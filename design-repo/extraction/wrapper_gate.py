#!/usr/bin/env python3
"""wrapper_gate.py: automated whole-page-wrapper quality gate (a check of verify_all.py; also runnable alone).

A section contract must describe ONE part of a page. The gate reads the rendered heights recorded at 1440px in
extraction/measured-values.json (`sectionHeights`, refreshed by extraction/measure_section_heights.mjs) and applies:

  HERO height     a section classed semantic.category HERO taller than 1800px WARNS; taller than 3000px FAILS unless an explicit
                  reviewed whitelist entry (kind hero-height) covers it with a maxHeightPx above the measured height.
  page share      per template, the page whose largest section holds the largest share of the document height is checked.
                  One non-chrome section holding more than 50% of that page's height WARNS; more than 60% FAILS unless a reviewed
                  whitelist entry (kind page-share, template + section, maxSharePct and maxHeightPx above the measured values) covers it.
  missing data    a section, a template page or a required template node with no measurement is an ERROR. No guessing, no default.
  stale entries   a whitelist entry that no longer covers a real finding FAILS, so the whitelist cannot grow silently.

Whitelist: extraction/wrapper-whitelist.json. Every entry needs reviewedBy, attestation ("agent" or "human"), reviewedOn and a
justification of 30+ characters. An entry with attestation "agent" is the attestation of an automated reviewer, not a human sign-off.

Usage:  python3 extraction/wrapper_gate.py [--root <design-repo dir>]
"""
import glob
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

HERO_WARN_PX = 1800
HERO_FAIL_PX = 3000
SHARE_WARN_PCT = 50.0
SHARE_FAIL_PCT = 60.0
ENTRY_KEYS = {'kind', 'section', 'template', 'maxHeightPx', 'maxSharePct', 'reviewedBy', 'attestation', 'reviewedOn', 'justification'}
DATE_RE = re.compile(r'^\d{4}-\d{2}-\d{2}$')


def _j(root, rel):
    with open(os.path.join(root, rel), encoding='utf-8') as f:
        return json.load(f)


def _contracts(root):
    out = {}
    for p in sorted(glob.glob(os.path.join(root, 'sections', '*.json'))):
        d = json.load(open(p, encoding='utf-8'))
        out[d['id']] = d
    return out


def validate_whitelist(wl):
    """Structural errors of the whitelist file itself."""
    F = []
    if not isinstance(wl, dict) or not isinstance(wl.get('entries'), list):
        return ['wrapper-whitelist.json must be an object with an entries list']
    seen = set()
    for i, e in enumerate(wl['entries']):
        where = f'whitelist entry {i}'
        if not isinstance(e, dict):
            F.append(f'{where} is not an object')
            continue
        extra = set(e) - ENTRY_KEYS
        if extra:
            F.append(f'{where} has unknown keys {sorted(extra)}')
        kind = e.get('kind')
        if kind not in ('hero-height', 'page-share'):
            F.append(f'{where}: kind must be hero-height or page-share')
            continue
        need = ['section', 'maxHeightPx', 'reviewedBy', 'attestation', 'reviewedOn', 'justification'] + (['template', 'maxSharePct'] if kind == 'page-share' else [])
        for k in need:
            if k not in e:
                F.append(f'{where} ({kind}) is missing {k}')
        if kind == 'hero-height' and 'template' in e:
            F.append(f'{where}: hero-height entries are per section, not per template')
        if not isinstance(e.get('reviewedBy'), str) or not e.get('reviewedBy', '').strip():
            F.append(f'{where}: reviewedBy must be a non-empty string')
        if e.get('attestation') not in ('agent', 'human'):
            F.append(f'{where}: attestation must be "agent" or "human"')
        if not isinstance(e.get('justification'), str) or len(e['justification'].strip()) < 30:
            F.append(f'{where}: justification must be at least 30 characters')
        if not isinstance(e.get('reviewedOn'), str) or not DATE_RE.match(e.get('reviewedOn', '')):
            F.append(f'{where}: reviewedOn must be YYYY-MM-DD')
        if not isinstance(e.get('maxHeightPx'), int) or isinstance(e.get('maxHeightPx'), bool) or e.get('maxHeightPx', 0) <= 0:
            F.append(f'{where}: maxHeightPx must be a positive integer')
        if kind == 'page-share' and (not isinstance(e.get('maxSharePct'), (int, float)) or isinstance(e.get('maxSharePct'), bool) or not 0 < e.get('maxSharePct', 0) <= 100):
            F.append(f'{where}: maxSharePct must be a number in (0, 100]')
        key = (kind, e.get('section'), e.get('template'))
        if key in seen:
            F.append(f'{where}: duplicate of an earlier entry {key}')
        seen.add(key)
    return F


def check_wrapper_gate(root):
    F, W = [], []
    contracts = _contracts(root)
    try:
        sh = _j(root, 'extraction/measured-values.json').get('sectionHeights')
    except (OSError, ValueError) as e:
        return [f'measured-values.json unreadable: {e}'], W
    if not isinstance(sh, dict):
        return ['no sectionHeights in extraction/measured-values.json: a missing measurement is an error (run extraction/measure_section_heights.mjs --write)'], W
    try:
        wl = _j(root, 'extraction/wrapper-whitelist.json')
    except (OSError, ValueError) as e:
        return [f'wrapper-whitelist.json unreadable: {e}'], W
    F.extend(validate_whitelist(wl))
    entries = wl.get('entries', []) if isinstance(wl, dict) and isinstance(wl.get('entries'), list) else []
    templates = _j(root, 'templates/templates.json')['templates']
    if (sh.get('viewport') or {}).get('width') != 1440:
        F.append('sectionHeights must be measured at a 1440px viewport')
    sections = sh.get('sections') or {}
    pages = sh.get('pages') or {}

    # ---- missing data is an error
    for sid in sorted(contracts):
        s = sections.get(sid)
        if not isinstance(s, dict) or not isinstance(s.get('maxHeightPx'), int) or isinstance(s.get('maxHeightPx'), bool) or s['maxHeightPx'] < 0:
            F.append(f'no measurement for section {sid} (sectionHeights.sections): a missing measurement is an error')
    for sid in sorted(set(sections) - set(contracts)):
        F.append(f'sectionHeights measures {sid}, which has no contract')
    for tid, t in sorted(templates.items()):
        pg = pages.get(tid)
        if not isinstance(pg, dict) or not isinstance(pg.get('pageHeightPx'), int) or pg.get('pageHeightPx', 0) <= 0 or not isinstance(pg.get('sections'), list):
            F.append(f'no measured page for template {tid} (sectionHeights.pages)')
            continue
        have = {x.get('section') for x in pg['sections'] if isinstance(x, dict)}
        for n in t['nodes']:
            if n.get('required') and n['section'] not in have:
                F.append(f'measured page {pg.get("route")} of {tid} has no measurement for required node {n["section"]}')
        for x in pg['sections']:
            if not isinstance(x, dict) or not isinstance(x.get('heightPx'), int) or isinstance(x.get('heightPx'), bool) or x['heightPx'] < 0:
                F.append(f'{tid}: a section instance on {pg.get("route")} has no valid heightPx: {x}')
    if F:
        # thresholds are meaningless on incomplete data; report the missing data and stop
        return F, W

    used = set()

    def entry_for(kind, section, template=None):
        for i, e in enumerate(entries):
            if isinstance(e, dict) and e.get('kind') == kind and e.get('section') == section and (kind == 'hero-height' or e.get('template') == template):
                return i, e
        return None, None

    # ---- HERO height
    for sid, c in sorted(contracts.items()):
        if c['semantic']['category'] != 'HERO':
            continue
        h = sections[sid]['maxHeightPx']
        i, e = entry_for('hero-height', sid)
        if h > HERO_FAIL_PX:
            if e is None:
                F.append(f'HERO {sid} is {h}px tall (> {HERO_FAIL_PX}) on {sections[sid]["route"]}: a whole-page wrapper, not a hero. Decompose it or add a reviewed hero-height whitelist entry')
            elif h >= e['maxHeightPx']:
                used.add(i)
                F.append(f'HERO {sid} is {h}px tall but its whitelist maxHeightPx is {e["maxHeightPx"]}: the reviewed ceiling is exceeded')
            else:
                used.add(i)
                W.append(f'HERO {sid} is {h}px tall (> {HERO_FAIL_PX}) but whitelisted up to {e["maxHeightPx"]}px by {e["reviewedBy"]} ({e["attestation"]})')
        elif h > HERO_WARN_PX:
            W.append(f'HERO {sid} is {h}px tall (> {HERO_WARN_PX}) on {sections[sid]["route"]}')
            if e is not None:
                used.add(i)
        elif e is not None:
            pass  # reported as stale below

    # ---- page share
    for tid, pg in sorted(pages.items()):
        total = pg['pageHeightPx']
        for x in pg['sections']:
            sid = x['section']
            c = contracts.get(sid)
            if c is None or c['semantic']['category'] == 'SHELL':
                continue
            share = 100.0 * x['heightPx'] / total
            if share <= SHARE_WARN_PCT:
                continue
            i, e = entry_for('page-share', sid, tid)
            msg = f'{sid} is {x["heightPx"]}px of the {total}px page {pg["route"]} ({tid}): {share:.1f}% of the page height'
            if share > SHARE_FAIL_PCT:
                if e is None:
                    F.append(f'{msg} (> {SHARE_FAIL_PCT:.0f}%): a whole-page wrapper. Decompose it or add a reviewed page-share whitelist entry')
                elif share >= e['maxSharePct'] or x['heightPx'] >= e['maxHeightPx']:
                    used.add(i)
                    F.append(f'{msg}, over the whitelisted ceiling ({e["maxSharePct"]}% / {e["maxHeightPx"]}px)')
                else:
                    used.add(i)
                    W.append(f'{msg} (> {SHARE_FAIL_PCT:.0f}%), whitelisted by {e["reviewedBy"]} ({e["attestation"]})')
            else:
                W.append(f'{msg} (> {SHARE_WARN_PCT:.0f}%)')
                if e is not None:
                    used.add(i)

    for i, e in enumerate(entries):
        if isinstance(e, dict) and i not in used:
            F.append(f'stale whitelist entry {i} ({e.get("kind")} {e.get("section")} {e.get("template", "")}): it no longer covers a real finding; remove it')
    return F, W


def main(argv):
    root = ROOT
    if '--root' in argv:
        root = os.path.abspath(argv[argv.index('--root') + 1])
    F, W = check_wrapper_gate(root)
    for x in F:
        print('FAIL', x)
    for x in W:
        print('warn', x)
    print(f'wrapper gate: {len(F)} failure(s), {len(W)} warning(s)')
    return 1 if F else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv))
