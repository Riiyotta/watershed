// Re-derives ia.json from the project code. Run from the project root: node scripts/ia/gen.mjs
// OVERWRITES ia.json (hand edits are lost). Route lists, block orders, variants and chrome come from the code;
// section descriptions live in scripts/ia/catalog.mjs. Then run: node validate.mjs && node build.mjs
// Routes, block orders, variants and chrome come from the code; only descriptions live in catalog.mjs.
import fs from 'fs';
import { open } from './load.mjs';
import { CATEGORIES, SECTIONS } from './catalog.mjs';

const root = process.argv[2] ?? process.cwd();
const read = (p) => fs.readFileSync(root + '/' + p, 'utf8');
const { server, load } = await open();

const routesJson = JSON.parse(read('src/routes.json'));
const GROUPS = routesJson.templates;
const { default: productDefs } = await load('/src/content/pages/product.js');
const { default: compareDefs } = await load('/src/content/pages/compare.js');
const { default: companyDefs } = await load('/src/content/pages/company.js');
const { POSTS } = await load('/src/content/posts.js');
const { EVENT_REDIRECTS, isSummit } = await load('/src/content/events.js');
const { GUIDE_REDIRECTS } = await load('/src/content/guides.js');
const { STORIES } = await load('/src/content/customers.js');
const { chromeFor } = await load('/src/layouts/chrome.js');
await server.close();

// ---- facts parsed from source (so they are not retyped here) ----
const keysOf = (src, startMarker, endMarker) => {
  const a = src.indexOf(startMarker);
  const b = src.indexOf(endMarker, a);
  return [...src.slice(a, b).matchAll(/'(\/[^']*)'\s*:/g)].map((m) => m[1]);
};
const pagesSrc = read('src/blocks/pages.jsx');
const COMPANY_BESPOKE = keysOf(pagesSrc, 'const COMPANY_BESPOKE', '\n\nexport function CompanyPage');
const companyBespokeSrc = pagesSrc.slice(pagesSrc.indexOf('const COMPANY_BESPOKE'), pagesSrc.indexOf('export function CompanyPage'));
const REPORT_BESPOKE = Object.fromEntries([...pagesSrc.slice(pagesSrc.indexOf('const REPORT_BESPOKE'), pagesSrc.indexOf('const REPORT_GATED')).matchAll(/'(\/[^']*)':\s*(\w+)/g)].map((m) => [m[1], m[2]]));
const gatedSrc = pagesSrc.slice(pagesSrc.indexOf('const REPORT_GATED'), pagesSrc.indexOf('export function ReportLandingPage'));
const REPORT_GATED = {};
{
  const parts = gatedSrc.split(/\n  '(\/[^']+)': \{/);
  for (let i = 1; i < parts.length; i += 2) REPORT_GATED[parts[i]] = { faq: /\n\s+faq:/.test(parts[i + 1]) };
}
const companyBespokeKeys = [...companyBespokeSrc.matchAll(/'(\/[^']+)':\s*\w+/g)].map((m) => m[1]);
const reportRedirects = [...pagesSrc.matchAll(/path === '(\/[^']+)'\) return <Navigate to=\{href\('(\/[^']+)'\)/g)].map((m) => m[1]);
const postPagesSrc = read('src/pages/content/PostPages.jsx');
const STORY_RELATED = [...postPagesSrc.matchAll(/\[((?:'[^']+',?\s*)+)\]\.includes\(s\.slug\)/g)].flatMap((m) => [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]));
const legalSrc = read('src/pages/content/LegalPages.jsx');
const LEGAL_DOCS = [...legalSrc.matchAll(/'(\/legal\/[^']+)':\s*\{[^}]*?(toc: true)?\s*\}/g)].map((m) => ({ path: m[1], toc: /toc: true/.test(m[0]) }));
const legalRedirects = [...legalSrc.matchAll(/path === '(\/[^']+)'\) return <Navigate/g)].map((m) => m[1]);

// ---- route classification: returns { kind, label, sections (page-level) } ----
const blockSection = new Map(Object.entries(SECTIONS).filter(([, s]) => s.blockType).map(([id, s]) => [s.blockType, id]));
const unknownBlocks = new Set();
const sectionsOfBlocks = (list) => list.map((b) => {
  const id = blockSection.get(b.type);
  if (!id) unknownBlocks.add(b.type);
  return id;
});
const storyBy = new Map(STORIES.map((s) => [s.path, s]));
const postBy = new Map(POSTS.map((p) => [p.path, p]));

const HOME = ['hero.home', 'proof.awards-slider', 'features.product-overview', 'features.feature-carousel', 'features.ai-agents-demo', 'proof.stats-cornerstone', 'content.mission-split', 'feed.content-cards', 'proof.logo-marquee'];
const GATED_TAIL = ['conversion.gated-form', 'feed.page-links'];
const BESPOKE = {
  '/careers': ['content.careers-intro', 'content.careers-roles', 'content.careers-sidebar'],
  '/brand': ['content.brand-header', 'content.brand-logos', 'content.brand-colour', 'content.brand-typography', 'content.brand-press-kit'],
  '/change': ['hero.change', 'content.change-statement', 'content.section-text-block', 'content.grid', 'proof.quote', 'content.change-stats', 'conversion.cta-bar'],
  '/climate-leads': ['hero.climate-leads', 'content.climate-leads-interviews', 'feed.blog-posts-theme-images'],
};
const REPORT_BESPOKE_SECTIONS = {
  SOC2025Theme: ['hero.soc-banner', 'content.soc-text-card', 'conversion.soc-form-card'],
  Manifesto: ['article.manifesto'],
  Quiz: ['conversion.quiz'],
};

const redirects = [];
function classify(group, path) {
  const blocks = (defs) => {
    const list = defs[path];
    if (!list) throw new Error(`no page definition for ${group} ${path}`);
    if (list[0]?.redirect) return { kind: 'redirect', label: 'Redirect', page: [], redirectTo: list[0].redirect };
    return { kind: 'blocks:' + sectionsOfBlocks(list).join('>'), label: group === 'product' ? 'Product page' : group === 'compare' ? 'Compare page' : 'Company page', page: sectionsOfBlocks(list) };
  };
  switch (group) {
    case 'home': return { kind: 'home', label: 'Homepage', page: HOME };
    case 'product': return blocks(productDefs);
    case 'compare': return blocks(compareDefs);
    case 'company':
      if (companyBespokeKeys.includes(path)) return { kind: 'bespoke:' + path, label: 'Company page', page: BESPOKE[path] };
      if (path === '/podcast') return { kind: 'gated:podcast', label: 'Podcast landing', page: ['content.gated-card', ...GATED_TAIL] };
      return blocks(companyDefs);
    case 'report-landing': {
      if (reportRedirects.includes(path)) return { kind: 'redirect', label: 'Redirect', page: [], redirectTo: '/guides' };
      if (REPORT_BESPOKE[path]) return { kind: 'report:' + REPORT_BESPOKE[path], label: 'Report page', page: REPORT_BESPOKE_SECTIONS[REPORT_BESPOKE[path]] };
      if (REPORT_GATED[path]) return REPORT_GATED[path].faq
        ? { kind: 'gated:report-faq', label: 'Gated report landing (with FAQ)', page: ['content.gated-card', 'content.faq', ...GATED_TAIL] }
        : { kind: 'gated:report', label: 'Gated report landing', page: ['content.gated-card', ...GATED_TAIL] };
      throw new Error('unclassified report-landing ' + path);
    }
    case 'customers-index': return { kind: 'customers-index', label: 'Customers index', page: ['hero.customers', 'proof.customer-logo-grid', 'feed.featured-stories', 'feed.all-customers', 'proof.quote-carousel', 'conversion.cta-bar'] };
    case 'customer-story': {
      const s = storyBy.get(path);
      if (s.variant === 'A') return STORY_RELATED.includes(s.slug)
        ? { kind: 'story:A-related', label: 'Customer story (story layout + related links)', page: ['article.story-hero', 'article.story-sidebar', 'article.story-body', 'feed.page-links'] }
        : { kind: 'story:A', label: 'Customer story (story layout)', page: ['article.story-hero', 'article.story-sidebar', 'article.story-body'] };
      return { kind: 'post:customer-story', label: 'Customer story (article layout)', page: ['article.post-hero', 'article.prose', 'conversion.newsletter-band', 'feed.related-posts-grid'] };
    }
    case 'blog-index': return path === '/news'
      ? { kind: 'news', label: 'News index', page: ['feed.sidebar-index'] }
      : { kind: 'feed:blog', label: 'Blog index', page: ['hero.feed-carousel', 'feed.filter-bar', 'feed.card-grid', 'feed.load-more'] };
    case 'guides-index': return { kind: 'feed:guides', label: 'Guides index', page: ['hero.feed-carousel', 'feed.card-grid', 'feed.load-more'] };
    case 'events-index': return { kind: 'feed:events', label: 'Events index', page: ['hero.feed-carousel', 'feed.filter-bar', 'feed.card-grid', 'feed.load-more'] };
    case 'blog-post': return postBy.get(path).hasToc
      ? { kind: 'post:toc', label: 'Blog post (with table of contents)', page: ['article.post-hero', 'article.prose', 'article.toc', 'conversion.newsletter-band', 'feed.related-posts-grid'] }
      : { kind: 'post', label: 'Blog post', page: ['article.post-hero', 'article.prose', 'conversion.newsletter-band', 'feed.related-posts-grid'] };
    case 'guide': return GUIDE_REDIRECTS.has(path)
      ? { kind: 'redirect', label: 'Redirect', page: [], redirectTo: '/guides' }
      : { kind: 'gated:guide', label: 'Gated guide landing', page: ['content.gated-card', ...GATED_TAIL] };
    case 'event':
      if (EVENT_REDIRECTS.has(path)) return { kind: 'redirect', label: 'Redirect', page: [], redirectTo: '/demo' };
      if (isSummit(path.split('/').pop())) return { kind: 'event:summit', label: 'Summit event', page: ['content.summit-intro', 'content.summit-speakers', 'content.summit-sessions', 'conversion.summit-closing-cta'] };
      return { kind: 'gated:event', label: 'Event landing', page: ['content.gated-card', 'content.event-logistics', 'content.event-speakers', ...GATED_TAIL] };
    case 'legal':
      if (legalRedirects.includes(path)) return { kind: 'redirect', label: 'Redirect', page: [], redirectTo: '/legal/data-portal-terms' };
      if (path === '/legal') return { kind: 'legal:index', label: 'Legal index', page: ['feed.sidebar-index'] };
      return LEGAL_DOCS.find((d) => d.path === path)?.toc
        ? { kind: 'legal:toc', label: 'Legal document (with table of contents)', page: ['article.legal-document', 'article.toc'] }
        : { kind: 'legal:doc', label: 'Legal document', page: ['article.legal-document'] };
    case 'demo':
      if (path.startsWith('/lp/')) return { kind: 'lp', label: 'Campaign landing page', page: ['hero.lp', 'proof.logos', 'content.header-band', 'features.animated-steps', 'conversion.cta-slim', 'features.lp-feature-grid', 'conversion.featured-form'] };
      return path === '/demo/csrd'
        ? { kind: 'demo:csrd', label: 'Demo page (reporting variant)', page: ['hero.form', 'proof.quote', 'features.feature-carousel', 'feed.page-link-set'] }
        : { kind: 'demo', label: 'Demo page', page: ['hero.form', 'proof.quote'] };
    case 'product-tour': return path === '/product-tours'
      ? { kind: 'tour:index', label: 'Product tours index', page: ['hero.form', 'proof.quote'] }
      : { kind: 'tour', label: 'Product tour', page: ['hero.form', 'proof.quote', 'proof.text-with-logos'] };
    case 'tool': return { kind: 'tool', label: 'Tool page', page: ['hero.form'] };
    default: throw new Error('unknown group ' + group);
  }
}

// ---- chrome ----
const chromeLabel = (c) => {
  if (!c.nav && !c.footer) return 'campaign: promo bar only';
  if (c.nav === 'inverted') return 'minimal: inverted nav, no promo bar, no footer';
  if (c.footer === 'short') return 'full, short footer';
  if (c.nav === 'translucent' && !c.promo) return 'translucent nav, no promo bar';
  if (c.nav === 'translucent') return 'translucent nav';
  return 'full';
};
const shell = (c) => [c.promo && 'shell.promo-bar', c.nav && 'shell.nav', c.footer === 'default' && 'shell.footer', c.footer === 'short' && 'shell.footer-short'].filter(Boolean);

// ---- cluster routes into templates ----
const clusters = new Map();
const seen = new Map();
for (const [group, paths] of Object.entries(GROUPS)) {
  for (const path of paths) {
    if (seen.has(path)) throw new Error('route in two groups: ' + path);
    seen.set(path, group);
    const c = classify(group, path);
    const chrome = chromeFor(path);
    const label = c.kind === 'redirect' ? 'none (redirect)' : chromeLabel(chrome);
    const key = c.kind + '|' + label + '|' + (c.kind === 'redirect' ? '' : c.page.join('>'));
    if (!clusters.has(key)) clusters.set(key, { ...c, chromeLabel: label, chrome, groups: new Set(), routes: [] });
    const cl = clusters.get(key);
    cl.routes.push(path);
    cl.groups.add(group);
  }
}

const slug = (s) => s.replace(/^\//, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'home';
const last = (p) => p.split('/').filter(Boolean).pop() ?? 'home';
const usedIds = new Set();
const templates = [];
for (const cl of clusters.values()) {
  let id;
  let name;
  const single = cl.routes.length === 1;
  const mixed = cl.groups.size > 1;
  const kindSlug = slug(cl.kind.replace(/^blocks:.*/, '').replace(/^bespoke:/, '').replace(/^report:/, 'report-').replace(/^gated:/, 'gated-').replace(/:/g, '-'));
  if (cl.kind.startsWith('blocks:')) {
    const shortNames = cl.routes.map((r) => r.replace(/^\//, ''));
    id = 'template.' + (mixed ? 'block' : slug(cl.label.split(' ')[0].toLowerCase())) + '-' + slug(shortNames.slice(0, 2).join('-'));
    name = `${mixed ? 'Block page' : cl.label}: ${shortNames.slice(0, 3).join(' / ')}${shortNames.length > 3 ? ` +${shortNames.length - 3} more` : ''}`;
  } else if (cl.kind.startsWith('bespoke:')) {
    id = 'template.company-' + slug(cl.routes[0]);
    name = `Company page: ${last(cl.routes[0])}`;
  } else if (cl.kind === 'redirect') {
    id = 'template.redirect';
    name = 'Redirect routes (no page of their own)';
  } else if (cl.kind === 'home') {
    id = 'template.home';
    name = cl.label;
  } else if (cl.kind.startsWith('report:')) {
    id = 'template.' + kindSlug;
    name = `${cl.label}: ${cl.kind.slice(7)}`;
  } else {
    id = 'template.' + kindSlug + (cl.chromeLabel !== 'full' && usedIds.has('template.' + kindSlug) ? '-' + slug(cl.chromeLabel) : '');
    name = cl.label;
  }
  id = id.toLowerCase();
  let n = 2;
  const base = id;
  while (usedIds.has(id)) id = base + '-' + n++;
  usedIds.add(id);
  if (name.includes(',')) name = name.replace(/,/g, ' /');
  const big = cl.routes.length > 12;
  const t = {
    id,
    name,
    family: [...cl.groups].join('+'),
    routeCount: cl.routes.length,
    routes: big ? cl.routes.slice(0, 6) : cl.routes,
    ...(big ? { routesTruncated: true, routePattern: patternOf(cl.routes) } : {}),
    chrome: cl.chromeLabel,
    sections: cl.kind === 'redirect' ? [] : [...shell(cl.chrome).slice(0, shell(cl.chrome).findIndex((s) => s === 'shell.nav') + 1), ...cl.page, ...shell(cl.chrome).filter((s) => s.startsWith('shell.footer'))],
  };
  if (cl.kind === 'redirect') t.redirects = Object.fromEntries(cl.routes.map((r) => [r, redirectTarget(r)]));
  templates.push(t);
}
function patternOf(routes) {
  const prefixes = new Set(routes.map((r) => '/' + r.split('/').filter(Boolean)[0]));
  return [...prefixes].map((p) => `${p}/{slug}`).join(' or ');
}
function redirectTarget(r) {
  for (const [group, paths] of Object.entries(GROUPS)) if (paths.includes(r)) return classify(group, r).redirectTo;
}

// ---- sections: keep only those used; compute scope from data ----
const used = new Set(templates.flatMap((t) => t.sections));
const missing = [...used].filter((s) => !SECTIONS[s]);
if (missing.length) throw new Error('sections used but not in catalog: ' + missing.join(', '));
const unusedCatalog = Object.keys(SECTIONS).filter((s) => !used.has(s));
const sections = {};
for (const [id, s] of Object.entries(SECTIONS)) {
  if (!used.has(id)) continue;
  if (s.implementedBy) {
    const file = s.implementedBy.split(' > ')[0];
    if (!fs.existsSync(root + '/' + file)) throw new Error(`implementedBy missing on disk: ${id} -> ${file}`);
  }
  const ts = templates.filter((t) => t.sections.includes(id));
  const routes = ts.reduce((n, t) => n + t.routeCount, 0);
  const fam = [...new Set(ts.flatMap((t) => t.family.split('+')))];
  sections[id] = {
    category: s.category,
    description: s.description,
    scope: `Used on ${routes} route${routes === 1 ? '' : 's'} (${fam.join(', ')}).`,
    ...(s.implementedBy ? { implementedBy: s.implementedBy } : {}),
  };
}

// ---- hard checks on the partition ----
const allRoutes = Object.values(GROUPS).flat();
const assigned = templates.flatMap((t) => (t.routesTruncated ? [] : t.routes));
const total = templates.reduce((n, t) => n + t.routeCount, 0);
if (total !== allRoutes.length) throw new Error(`partition covers ${total} routes, routes.json has ${allRoutes.length}`);
const blockTypes = Object.keys((await import('fs')).readFileSync(root + '/src/blocks/index.js', 'utf8').split('export default {')[1].split('}')[0].split(',').map((s) => s.trim()).filter(Boolean).reduce((o, k) => ((o[k] = 1), o), {}));
const unusedBlocks = blockTypes.filter((b) => !blockSection.has(b) || !used.has(blockSection.get(b)));

const ia = {
  $comment: 'Derived from the project source by a generator that reads src/routes.json, the page definitions in src/content/pages, the variant classifiers in src/content, and src/layouts/chrome.js. Hand-edit this file for changes; IA.md and matrix.csv are generated from it.',
  meta: {
    title: 'Northwind site clone: information architecture',
    source: 'Local clone of the watershed.com/en-GB design (Northwind placeholder content), React + Vite',
    status: 'measured-from-source',
    productionApproved: false,
    totalRoutes: total,
    totalTemplates: templates.length,
    locale: routesJson.locale_prefix,
    generatedBy: 'ia-builder, with route partition computed from project code',
  },
  categories: CATEGORIES,
  sections,
  templates,
};
fs.writeFileSync(root + '/ia.json', JSON.stringify(ia, null, 2) + '\n');
console.log(JSON.stringify({ templates: templates.length, sections: Object.keys(sections).length, routes: total, unusedCatalog, unusedBlocks, unknownBlocks: [...unknownBlocks], storyRelated: STORY_RELATED, legalDocs: LEGAL_DOCS, legalRedirects, reportRedirects, reportBespoke: REPORT_BESPOKE, reportGated: REPORT_GATED, companyBespokeKeys }, null, 1));
