#!/usr/bin/env node
/**
 * Optional measurement script: renders every templated route of the running clone at 1440px and records the height of
 * every section instance, then (with --write) stores the result in extraction/measured-values.json under `sectionHeights`.
 * extraction/wrapper_gate.py (run by verify_all.py) reads that ledger; this script is only needed to REFRESH it.
 *
 *   npm ci && npx vite build --outDir <scratch> && npx vite preview --outDir <scratch> --port 5481   # in the clone project
 *   PLAYWRIGHT_MODULE=<path to playwright/index.mjs, or leave unset when `playwright` is installed>
 *   node extraction/measure_section_heights.mjs --base http://localhost:5481 --write
 *
 * Options: --base <url> (default http://localhost:4173)   --write   --template <id> (measure one template)   --route <path>
 * Mapping from DOM to section ids lives in extraction/measure-recipes.json (data, not code). No machine path is stored.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const arg = (n, d) => { const i = process.argv.indexOf(n); return i < 0 ? d : (process.argv[i + 1] ?? true); };
const BASE = String(arg('--base', 'http://localhost:4173')).replace(/\/$/, '');
const WRITE = process.argv.includes('--write');
const ONLY_T = arg('--template', null);
const ONLY_R = arg('--route', null);

const J = (rel) => JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
const recipes = J('extraction/measure-recipes.json');
const routes = J('templates/routes.json').routes.filter((r) => r.template && (!ONLY_T || r.template === ONLY_T) && (!ONLY_R || r.path === ONLY_R));
const templates = J('templates/templates.json').templates;

const pw = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const chromium = pw.chromium || pw.default.chromium;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: recipes.viewport });

/** Runs inside the page. recipe: list of entries; blockOrder: array or null. */
const inPage = ({ recipe, blockOrder }) => {
  const $ = (s) => document.querySelector(s);
  const H = (e) => Math.round(e.getBoundingClientRect().height);
  const tag = (e) => e.tagName.toLowerCase();
  const out = [];
  const problems = [];
  const docH = document.documentElement.scrollHeight;
  const main = $('main');
  if (!main) return { docH, instances: out, problems: ['no <main>'] };
  if (blockOrder) {
    const kids = [...main.children];
    if (kids.length !== blockOrder.length) problems.push(`main has ${kids.length} children but blockOrder lists ${blockOrder.length}`);
    kids.forEach((e, i) => { if (blockOrder[i]) out.push({ section: blockOrder[i].section, variant: blockOrder[i].variant || null, heightPx: H(e), tag: tag(e) }); });
    return { docH, instances: out, problems };
  }
  for (const r of recipe) {
    if (r.mode === 'manifesto-header' || r.mode === 'manifesto-part') {
      const sec = $(r.el);
      const box = sec && sec.querySelector(':scope > div');
      if (!box) { problems.push(`${r.section}: manifesto container missing`); continue; }
      const h2 = [...box.children].filter((c) => c.tagName === 'H2');
      const top = (e) => e.getBoundingClientRect().top;
      const sTop = top(sec); const sBot = sec.getBoundingClientRect().bottom;
      if (r.mode === 'manifesto-header') out.push({ section: r.section, variant: null, heightPx: Math.round((h2.length ? top(h2[0]) : sBot) - sTop), tag: tag(sec) });
      else h2.forEach((e, i) => out.push({ section: r.section, variant: null, heightPx: Math.round((i + 1 < h2.length ? top(h2[i + 1]) : sBot) - top(e)), tag: tag(e.parentElement) }));
      continue;
    }
    if (r.each) {
      const els = [...document.querySelectorAll(r.each)];
      if (!els.length && !r.optional) problems.push(`${r.section}: no match for ${r.each}`);
      els.forEach((e) => out.push({ section: r.section, variant: null, heightPx: H(e), tag: tag(e) }));
      continue;
    }
    if (r.from) {
      const a = $(r.from); const b = $(r.to);
      if (!a || !b) { if (!r.optional) problems.push(`${r.section}: range ${r.from} .. ${r.to} not found`); continue; }
      out.push({ section: r.section, variant: null, heightPx: Math.round(b.getBoundingClientRect().bottom - a.getBoundingClientRect().top), tag: r.tag || tag(a) });
      continue;
    }
    const e = $(r.el);
    if (!e) { if (!r.optional) problems.push(`${r.section}: no match for ${r.el}`); continue; }
    out.push({ section: r.section, variant: null, heightPx: H(e), tag: r.tag || tag(e) });
  }
  return { docH, instances: out, problems };
};

const chromeInstances = async (t) => {
  const ch = t.chrome;
  const want = [];
  if (ch.promoBar) want.push({ section: 'chrome.promo-bar', variant: null, sel: '#root > :nth-child(1)' });
  if (ch.nav && ch.nav !== 'none') want.push({ section: 'chrome.nav', variant: ch.nav, sel: '#root > nav' });
  if (ch.footer && ch.footer !== 'none') want.push({ section: 'chrome.footer', variant: ch.footer, sel: '#root > footer' });
  const res = [];
  for (const w of want) {
    const r = await page.evaluate((s) => { const e = document.querySelector(s); return e ? { h: Math.round(e.getBoundingClientRect().height), tag: e.tagName.toLowerCase() } : null; }, w.sel);
    if (r) res.push({ section: w.section, variant: w.variant, heightPx: r.h, tag: r.tag });
    else res.push({ section: w.section, variant: w.variant, heightPx: null, tag: null, missing: true });
  }
  return res;
};

const perRoute = [];
const problemsAll = [];
for (const r of routes) {
  const t = templates[r.template];
  const recipe = r.blockOrder ? null : recipes.templates[r.template];
  if (!r.blockOrder && !recipe) { problemsAll.push(`${r.path}: no recipe for ${r.template}`); continue; }
  await page.goto(BASE + recipes.basePath + (r.path === '/' ? '/' : r.path), { waitUntil: 'networkidle' });
  await page.waitForSelector('main', { timeout: 15000 });
  await page.waitForTimeout(250);
  const res = await page.evaluate(inPage, { recipe, blockOrder: r.blockOrder || null });
  const chrome = await chromeInstances(t);
  // nodes the template keeps variants for (single-node sections) get that variant
  for (const i of res.instances) {
    if (!i.variant) { const nodes = t.nodes.filter((n) => n.section === i.section); if (nodes.length === 1 && nodes[0].variant) i.variant = nodes[0].variant; }
  }
  const instances = [...chrome.filter((c) => c.section === 'chrome.promo-bar'), ...chrome.filter((c) => c.section === 'chrome.nav'), ...res.instances, ...chrome.filter((c) => c.section === 'chrome.footer')];
  for (const c of chrome) if (c.missing) problemsAll.push(`${r.path}: ${c.section} not rendered`);
  for (const p of res.problems) problemsAll.push(`${r.path}: ${p}`);
  perRoute.push({ route: r.path, template: r.template, pageHeightPx: res.docH, instances: instances.filter((i) => !i.missing) });
}
await browser.close();

// ---- aggregate
const share = (rt) => Math.max(...rt.instances.map((i) => i.heightPx / rt.pageHeightPx));
const pages = {};
const counts = {};
const sections = {};
for (const rt of perRoute) {
  const cur = pages[rt.template];
  counts[rt.template] = (counts[rt.template] || 0) + 1;
  if (!cur || share(rt) > cur._share) pages[rt.template] = { _share: share(rt), route: rt.route, pageHeightPx: rt.pageHeightPx, sections: rt.instances.map(({ section, variant, heightPx, tag }) => ({ section, ...(variant ? { variant } : {}), heightPx, tag })) };
  for (const i of rt.instances) {
    const s = sections[i.section] || (sections[i.section] = { maxHeightPx: -1, route: null, template: null, tag: i.tag, instances: 0 });
    s.instances += 1;
    if (i.heightPx > s.maxHeightPx) { s.maxHeightPx = i.heightPx; s.route = rt.route; s.template = rt.template; s.tag = i.tag; }
  }
}
for (const [t, p] of Object.entries(pages)) { delete p._share; p.routesMeasured = counts[t]; }
const sorted = (o) => Object.fromEntries(Object.keys(o).sort().map((k) => [k, o[k]]));
const ledger = {
  description: 'Rendered heights at 1440px (extraction/measure_section_heights.mjs, recipes in extraction/measure-recipes.json). pages = per template the route whose largest single section holds the largest share of the page; sections = per section the tallest instance over every measured route. Read by extraction/wrapper_gate.py.',
  tool: 'extraction/measure_section_heights.mjs',
  viewport: recipes.viewport,
  routesMeasured: perRoute.length,
  measuredAt: new Date().toISOString().slice(0, 10),
  pages: sorted(pages),
  sections: sorted(sections),
};
console.log(`routes measured: ${perRoute.length}; templates: ${Object.keys(pages).length}; sections: ${Object.keys(sections).length}; problems: ${problemsAll.length}`);
problemsAll.slice(0, 40).forEach((p) => console.log('  PROBLEM', p));
if (WRITE) {
  if (ONLY_T || ONLY_R) { console.error('--write needs a full run (no --template/--route)'); process.exit(2); }
  if (problemsAll.length) { console.error('refusing to write with problems'); process.exit(1); }
  const mvPath = path.join(ROOT, 'extraction', 'measured-values.json');
  const mv = JSON.parse(fs.readFileSync(mvPath, 'utf8'));
  mv.sectionHeights = ledger;
  fs.writeFileSync(mvPath, JSON.stringify(mv, null, 2) + '\n');
  console.log('wrote sectionHeights to extraction/measured-values.json');
} else {
  fs.writeFileSync(path.join(process.env.TMPDIR || '/tmp', 'section-heights.preview.json'), JSON.stringify(ledger, null, 2));
  console.log('dry run: preview written to the OS temp dir (use --write to store it)');
}
process.exit(problemsAll.length ? 1 : 0);
