#!/usr/bin/env python3
"""verify_all.py: one command that checks the whole design-repo.

Checks (each is a function check_*(root) -> (failures, warnings) so tests can call it on a copy):
  manifest        required fields, entryPoints inside the package, counts RECOMPUTED from the files, allowlistVersion parity
  allowlist       parity BOTH directions: every allowlist id has a contract file and every contract file has an allowlist entry;
                  nodeProperties, contentFields, variants, assetRoles and templates match the schema/contracts
  citations       every path:line[-line] resolves in the real source file, stays inside its length, and the quoted anchor text
                  occurs inside the cited range. WARNING (not failure) when no sibling source tree exists, so a standalone copy passes.
  routes          every route is assigned to exactly ONE template or is a redirect (no gaps, no double assignment), per-template
                  counts match, chrome matches the template, evidence levels are not stronger than the template, redirect
                  targets are templated routes, and every real block order passes the semantic rules
  templates       node sections exist, variants are valid, content rules reference real fields, chrome nodes match chrome metadata
  sections        every contract validates against the CLOSED schema/section-contract.schema.json; distinct source and semantic objects;
                  retrievalEligible pinned (independently of semantic_validate.py); motion with a reducedMotionFallback, structured responsive, a11y
  classification  conversion blocks are CONVERSION, editorial blocks are not FEATURES, CTA-like copy outside CONVERSION is reviewed,
                  the graph's hero list equals the sections classed HERO, no template carries two HERO sections without a named exception
  schema_sync     schema/pagespec.schema.json equals what schema/generate_pagespec_schema.py builds from the contracts
  provenance_sync source, semantic and the allowlist mirror equal what extraction/generate_provenance.py builds
  wrapper_gate    extraction/wrapper_gate.py: HERO height and single-section page share from the measured heights (reviewed whitelist)
  ia_crosswalk    semantic ids exist in the sibling ia.json with the same category (WARNING when no sibling exists)
  graph           rule ids identical to schema/semantic_validate.py, severities, named exceptions
  asset_roles     closed policy enum plus PINNED policy values for compliance-critical roles (not just enum membership)
  tokens          styleTokens resolve to the catalog, catalog names exist, policy categories are real catalog keys
  selfcontained   no absolute machine paths, JSON parses, no framework vocabulary in contract fields
  example         the bundled example passes schema + semantic validation
  measured        the classifier partition recorded in extraction/measured-values.json matches routes.json
  snapshot        WARNING when the sibling source tree changed since the recorded snapshot digest

Drift checks are proven to fail on injected drift by extraction/prove_drift.py (run it after changing a check).
Usage:  python3 extraction/verify_all.py [--root <design-repo dir>]      Requires `pip install jsonschema`.
"""
import glob
import hashlib
import json
import os
import re
import sys
import importlib.util

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

RANK = {'measured': 3, 'derived': 2, 'inferred': 1}
FORBIDDEN_WORDS = re.compile(r'\b(className|JSX|useState|useEffect|useRef|useLayoutEffect|useMemo|useCallback|Tailwind|tailwind|React|Vite|Next\.js|Radix|keen-slider|framer-motion|styled-components|Redux)\b')
CLASS_STRING = re.compile(r'(?<![\w/])(?:sm|md|lg|xl|2xl):[a-z\[][\w\-\[\]\.%/]*')
ABS_PATHS = ('/Us' 'ers/', '/ho' 'me/', 'C:\\Us' 'ers\\', '/priv' 'ate/tmp', '/var/' 'folders')
# Independent pins (semantic_validate.py and schema/section-contract.schema.json pin the same facts separately).
SEMANTIC_CATEGORIES = ['SHELL', 'HERO', 'PROOF', 'FEATURES', 'CONTENT', 'CONVERSION', 'FEED', 'ARTICLE']
RETRIEVAL_PINNED = ['block.HorizontalRule', 'block.Spacer']
RUNTIME_UI_NAME = re.compile(r'cookie|consent|modal|dialog|overlay|lightbox|toast|popover|drawer', re.I)
FORM_ROLE = 'form.endpoint-placeholder'
EDITORIAL_NAME = re.compile(r'blog|news|post|article|editorial|stor(?:y|ies)|related', re.I)
CTA_COPY = re.compile(r'call to action|\bcta\b|book a demo|request a demo|register|subscribe|sign.?up|download|email.catcher|waitlist', re.I)
CITE_RE = re.compile(r'^([\w./\-]+\.(?:jsx?|css|md|json|js|mjs)):(\d+)(?:-(\d+))?$')


def guarded(fn):
    """A check that crashes on malformed input counts as a FAILURE (never as a pass)."""
    import functools

    @functools.wraps(fn)
    def wrapper(*a, **k):
        try:
            return fn(*a, **k)
        except Exception as e:  # noqa: BLE001
            return [f'{fn.__name__} crashed on malformed input: {type(e).__name__}: {e}'], []
    return wrapper


def jload(root, rel):
    with open(os.path.join(root, rel), encoding='utf-8') as f:
        return json.load(f)


def all_json(root):
    for p in sorted(glob.glob(os.path.join(root, '**', '*.json'), recursive=True)):
        yield os.path.relpath(p, root), p


def sections(root):
    out = {}
    for p in sorted(glob.glob(os.path.join(root, 'sections', '*.json'))):
        d = json.load(open(p, encoding='utf-8'))
        out[d['id']] = (os.path.relpath(p, root), d)
    return out


def load_validator(root):
    spec = importlib.util.spec_from_file_location('semantic_validate_mod_' + hashlib.md5(root.encode()).hexdigest()[:8], os.path.join(root, 'schema', 'semantic_validate.py'))
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m


def count_tokens(root):
    n = 0
    for p in glob.glob(os.path.join(root, 'tokens', '*', '*.json')):
        if os.sep + 'llm' + os.sep in p or os.sep + 'themes' + os.sep in p:
            continue
        d = json.load(open(p, encoding='utf-8'))
        n += len(d.get('tokens', {}))
    return n


# ------------------------------------------------------------------ manifest
@guarded
def check_manifest(root):
    F, W = [], []
    m = jload(root, 'registry.manifest.json')
    for k in ('status', 'productionApproved', 'repositoryId', 'defaultTheme', 'schemaValidatedThemes', 'counts', 'allowlistVersion', 'versionFieldNote', 'sourceStack', 'entryPoints', 'scopeReductions', 'limits'):
        if k not in m:
            F.append(f'manifest missing {k}')
    if m.get('status') != 'design-review-pending':
        F.append('manifest status must be design-review-pending')
    if m.get('productionApproved') is not False:
        F.append('manifest productionApproved must be false')
    for k, v in (m.get('entryPoints') or {}).items():
        for x in (v if isinstance(v, list) else [v]):
            if '..' in x or x.startswith('/') or ':' in x:
                F.append(f'entryPoint {k} points outside the package: {x}')
            elif not os.path.exists(os.path.join(root, x)):
                F.append(f'entryPoint {k} does not exist: {x}')
    al = jload(root, 'tokens/llm/component-allowlist.json')
    routes = jload(root, 'templates/routes.json')['routes']
    templ = jload(root, 'templates/templates.json')['templates']
    graph = jload(root, 'compatibility/graph.json')['rules']
    roles = jload(root, 'assets/asset-roles.json')['roles']
    secs = sections(root)
    real = {
        'tokens': count_tokens(root),
        'primitives': len(glob.glob(os.path.join(root, 'primitives', '*.json'))),
        'components': len(glob.glob(os.path.join(root, 'components', '*.json'))),
        'sections': len(secs),
        'templates': len(templ),
        'routes': len(routes),
        'templatedRoutes': sum(1 for r in routes if 'template' in r),
        'redirectRoutes': sum(1 for r in routes if 'redirectTo' in r),
        'assetRoles': len(roles),
        'graphRules': len(graph),
        'retrievalIneligibleSections': sum(1 for _s in secs.values() if _s[1].get('retrievalEligible', True) is False),
        'heroSections': sum(1 for _s in secs.values() if _s[1]['semantic']['category'] == 'HERO'),
        'wrapperWhitelistEntries': len(jload(root, 'extraction/wrapper-whitelist.json')['entries']),
    }
    try:
        spec = importlib.util.spec_from_file_location('adv_mod_' + hashlib.md5(root.encode()).hexdigest()[:8], os.path.join(root, 'schema', 'tests', 'adversarial_test.py'))
        adv = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(adv)
        mu, co = adv.count_cases(root)
        real['adversarialMutations'] = mu
        real['adversarialControls'] = co
    except Exception as e:
        W.append(f'could not count adversarial cases: {e}')
    c = m.get('counts', {})
    for k, v in real.items():
        if k not in c:
            F.append(f'manifest counts is missing {k}')
        elif c[k] != v:
            F.append(f'manifest counts.{k} is {c[k]} but the files say {v}')
    if m.get('allowlistVersion') != al.get('version'):
        F.append(f'allowlistVersion {m.get("allowlistVersion")} != component-allowlist.json version {al.get("version")}')
    note = m.get('versionFieldNote', '')
    if 'documentation-only' not in note or 'allowlistVersion' not in note:
        F.append('versionFieldNote must say which version fields are documentation-only and that allowlistVersion is machine-checked')
    th = m.get('schemaValidatedThemes') or []
    for t in th:
        if not os.path.exists(os.path.join(root, 'tokens', 'themes', t + '.json')):
            F.append(f'schemaValidatedThemes names a missing theme {t}')
    if m.get('defaultTheme') not in th:
        F.append('defaultTheme must be a schema-validated theme')
    return F, W


# ------------------------------------------------------------------ allowlist parity
@guarded
def check_allowlist(root):
    F, W = [], []
    al = jload(root, 'tokens/llm/component-allowlist.json')
    schema = jload(root, 'schema/pagespec.schema.json')
    secs = sections(root)
    for group in ('primitives', 'components'):
        files = {os.path.relpath(p, root) for p in glob.glob(os.path.join(root, group, '*.json'))}
        listed = {v['file'] for v in al[group].values()}
        for ph in sorted(listed - files):
            F.append(f'allowlist {group}: phantom entry, no file {ph}')
        for orphan in sorted(files - listed):
            F.append(f'allowlist {group}: contract file {orphan} has no allowlist entry')
        for i, v in al[group].items():
            if os.path.exists(os.path.join(root, v['file'])) and jload(root, v['file']).get('id') != i:
                F.append(f'allowlist {group}: {v["file"]} id does not match {i}')
    listed = set(al['sections'])
    on_disk = set(secs)
    for ph in sorted(listed - on_disk):
        F.append(f'allowlist sections: phantom entry {ph} (no contract file)')
    for orphan in sorted(on_disk - listed):
        F.append(f'allowlist sections: contract {orphan} has no allowlist entry')
    for sid in listed & on_disk:
        a, (rel, d) = al['sections'][sid], secs[sid]
        if a['file'] != rel:
            F.append(f'allowlist {sid}: file {a["file"]} != {rel}')
        if sorted(a['contentFields']) != sorted(d['content']['fields']):
            F.append(f'allowlist {sid}: contentFields differ from the contract')
        if a['variants'] != [v['id'] for v in d['variants']]:
            F.append(f'allowlist {sid}: variants differ from the contract')
        if a['motionPatterns'] != [p['pattern'] for p in d['motion']['patterns']]:
            F.append(f'allowlist {sid}: motionPatterns differ from the contract')
        if a['assetRoles'] != d['assetRoles']:
            F.append(f'allowlist {sid}: assetRoles differ from the contract')
        if a.get('semanticCategory') != d['semantic']['category']:
            F.append(f'allowlist {sid}: semanticCategory {a.get("semanticCategory")!r} != contract {d["semantic"]["category"]!r}')
        if a.get('retrievalEligible') != d.get('retrievalEligible', True):
            F.append(f'allowlist {sid}: retrievalEligible {a.get("retrievalEligible")!r} != contract {d.get("retrievalEligible", True)!r}')
        exp = ['section', 'variant', 'content', 'motion'] if d['variants'] else ['section', 'content', 'motion']
        if a['settableNodeProperties'] != exp:
            F.append(f'allowlist {sid}: settableNodeProperties {a["settableNodeProperties"]} != {exp}')
    if sorted(al.get('retrievalIneligibleSections', [])) != sorted(RETRIEVAL_PINNED):
        F.append(f'allowlist retrievalIneligibleSections {al.get("retrievalIneligibleSections")} != the pinned list {RETRIEVAL_PINNED}')
    if al.get('semanticCategories') != sorted(SEMANTIC_CATEGORIES):
        F.append('allowlist semanticCategories differs from the closed category list')
    node_props = sorted(schema['definitions']['node']['properties'])
    if sorted(al['nodeProperties']) != node_props:
        F.append(f'allowlist nodeProperties {al["nodeProperties"]} != schema node properties {node_props}')
    if sorted(al['pageSpecProperties']) != sorted(schema['properties']):
        F.append('allowlist pageSpecProperties differ from the schema')
    roles = [r['id'] for r in jload(root, 'assets/asset-roles.json')['roles']]
    if sorted(al['assetRoles']) != sorted(roles):
        F.append('allowlist assetRoles differ from assets/asset-roles.json')
    if sorted(schema['definitions']['assetRole']['enum']) != sorted(roles):
        F.append('schema assetRole enum differs from assets/asset-roles.json')
    if sorted(schema['properties']['template']['enum']) != sorted(al['templates']):
        F.append('schema template enum differs from the allowlist templates')
    if sorted(al['templates']) != sorted(jload(root, 'templates/templates.json')['templates']):
        F.append('allowlist templates differ from templates.json')
    if sorted(schema['definitions']['node']['properties']['section']['enum']) != sorted(listed):
        F.append('schema section enum differs from the allowlist sections')
    return F, W


# ------------------------------------------------------------------ citations
def find_src_root(root):
    cand = os.path.dirname(os.path.abspath(root))
    if os.path.isdir(os.path.join(cand, 'src')) and os.path.exists(os.path.join(cand, 'PAGES_SPEC.md')):
        return cand
    return None


def iter_citations(o, where, out):
    if isinstance(o, dict):
        if 'ref' in o and 'anchor' in o and isinstance(o['ref'], str):
            out.append((where, o['ref'], o['anchor']))
        if set(o) == {'id', 'tag', 'file', 'lines', 'anchor'} and isinstance(o.get('file'), str) and isinstance(o.get('lines'), str):
            out.append((where + ' (source)', f'{o["file"]}:{o["lines"]}', o['anchor']))
        for k, v in o.items():
            if k in ('citation', 'measuredFrom') and isinstance(v, str) and CITE_RE.match(v):
                out.append((where, v, None))
            elif k in ('citations', 'cites') and isinstance(v, list):
                for x in v:
                    if isinstance(x, str):
                        if CITE_RE.match(x):
                            out.append((where, x, None))
                    else:
                        iter_citations(x, where, out)
            else:
                iter_citations(v, where, out)
    elif isinstance(o, list):
        for x in o:
            iter_citations(x, where, out)


@guarded
def check_citations(root, src_root=None):
    F, W = [], []
    src = src_root or find_src_root(root)
    cites = []
    for rel, p in all_json(root):
        iter_citations(json.load(open(p, encoding='utf-8')), rel, cites)
    if src is None:
        W.append(f'no sibling source tree: {len(cites)} citations NOT resolved (standalone copy). Run next to the clone project to verify them.')
        return F, W
    cache = {}
    for where, ref, anchor in cites:
        m = CITE_RE.match(ref)
        if not m:
            F.append(f'{where}: malformed citation {ref!r}')
            continue
        path, a, b = m.group(1), int(m.group(2)), int(m.group(3) or m.group(2))
        fp = os.path.join(src, path)
        if not os.path.isfile(fp):
            F.append(f'{where}: citation file missing {path}')
            continue
        if fp not in cache:
            cache[fp] = open(fp, encoding='utf-8').read().split('\n')
            if cache[fp] and cache[fp][-1] == '':
                cache[fp].pop()
        L = cache[fp]
        if a < 1 or b < a or b > len(L):
            F.append(f'{where}: {ref} is out of range (file has {len(L)} lines)')
            continue
        if anchor is not None and anchor not in '\n'.join(L[a - 1:b]):
            F.append(f'{where}: {ref} does not contain the quoted anchor {anchor!r} (in range but describes other code)')
    return F, W


def src_digest(src):
    h = hashlib.sha256()
    n = 0
    for p in sorted(glob.glob(src + '/src/**/*', recursive=True)):
        if os.path.isfile(p):
            h.update(os.path.relpath(p, src).encode())
            h.update(open(p, 'rb').read())
            n += 1
    for extra in ['tailwind.config.js', 'package.json', 'CLONE_SPEC.md', 'PAGES_SPEC.md', 'ASSET_MANIFEST.md', 'IMAGE_CREDITS.md']:
        h.update(extra.encode())
        h.update(open(os.path.join(src, extra), 'rb').read())
        n += 1
    return h.hexdigest(), n


@guarded
def check_snapshot(root):
    F, W = [], []
    src = find_src_root(root)
    snap = jload(root, 'registry.manifest.json').get('sourceSnapshot', {})
    if src is None:
        W.append('no sibling source tree: snapshot digest not compared')
        return F, W
    d, n = src_digest(src)
    if d != snap.get('digest'):
        W.append(f'source changed since the snapshot ({snap.get("takenAt")}): digest differs ({n} files now vs {snap.get("fileCount")}). Re-diff counts and facts, then rebuild.')
    return F, W


# ------------------------------------------------------------------ routes + templates
@guarded
def check_routes(root):
    F, W = [], []
    routes = jload(root, 'templates/routes.json')['routes']
    templ = jload(root, 'templates/templates.json')['templates']
    seen = {}
    for r in routes:
        p = r['path']
        if p in seen:
            F.append(f'route {p} listed twice (double assignment)')
        seen[p] = r
        has_t, has_r = 'template' in r, 'redirectTo' in r
        if has_t == has_r:
            F.append(f'route {p} must have exactly one of template / redirectTo')
        if has_t and r['template'] not in templ:
            F.append(f'route {p} -> unknown template {r["template"]}')
        if r.get('evidenceLevel') not in RANK:
            F.append(f'route {p} has no valid evidenceLevel')
    for p, r in seen.items():
        if 'redirectTo' in r:
            tgt = seen.get(r['redirectTo'])
            if tgt is None or 'template' not in tgt:
                F.append(f'redirect {p} -> {r["redirectTo"]} must target a templated route')
    cnt = {}
    for r in routes:
        if 'template' in r:
            cnt[r['template']] = cnt.get(r['template'], 0) + 1
    for tid, t in templ.items():
        if t.get('routeCount') != cnt.get(tid, 0):
            F.append(f'{tid}.routeCount {t.get("routeCount")} != actual {cnt.get(tid, 0)}')
        if cnt.get(tid, 0) == 0:
            F.append(f'{tid} has no routes')
    for r in routes:
        if 'template' not in r or r['template'] not in templ:
            continue
        t = templ[r['template']]
        if r['chrome'] != t['chrome']:
            F.append(f'route {r["path"]} chrome {r["chrome"]} != template chrome {t["chrome"]} (route-admission drift)')
        best = t['evidence']['desktop']
        if RANK[r['evidenceLevel']] > RANK[best]:
            F.append(f'route {r["path"]} claims {r["evidenceLevel"]} but template {t["id"]} desktop evidence is only {best}')
    src = find_src_root(root)
    if src and os.path.exists(os.path.join(src, 'src', 'routes.json')):
        real = json.load(open(os.path.join(src, 'src', 'routes.json')))
        allp = {p for ps in real['templates'].values() for p in ps}
        mine = set(seen)
        if allp != mine:
            F.append(f'routes differ from the clone src/routes.json: missing {sorted(allp - mine)[:5]} extra {sorted(mine - allp)[:5]}')
    else:
        W.append('no sibling src/routes.json: route list not compared with the clone')
    try:
        sv = load_validator(root)
        repo = sv.Repo(root)
        for r in routes:
            if 'blockOrder' not in r:
                continue
            nodes = [{'section': 'chrome.promo-bar'}, {'section': 'chrome.nav', 'variant': 'opaque'}] + [dict(b) for b in r['blockOrder']] + [{'section': 'chrome.footer', 'variant': 'default'}]
            spec = {'route': r['path'], 'template': r['template'], 'nodes': nodes}
            ctx = sv.Ctx(spec, repo)
            for fn in (sv.r_node_in_template, sv.r_max, sv.r_one_hero, sv.r_hero_first, sv.r_compare, sv.r_toc, sv.r_adjacent, sv.r_chrome_pos, sv.r_chrome):
                fn(ctx)
            for f in ctx.findings:
                if f['severity'] == 'error':
                    F.append(f'real block order of {r["path"]} violates {f["rule"]}: {f["message"]}')
                else:
                    W.append(f'real block order of {r["path"]}: warn {f["rule"]}: {f["message"]}')
    except Exception as e:
        F.append(f'could not run the rules over the real block orders: {e}')
    return F, W


@guarded
def check_templates(root):
    F, W = [], []
    templ = jload(root, 'templates/templates.json')['templates']
    secs = sections(root)
    for tid, t in templ.items():
        if t['orderMode'] not in ('fixed', 'free'):
            F.append(f'{tid} orderMode invalid')
        for k in ('chrome', 'nodes', 'evidence', 'routeSelector'):
            if k not in t:
                F.append(f'{tid} missing {k}')
        for n in t['nodes']:
            if not isinstance(n, dict) or 'section' not in n or 'required' not in n or 'repeatable' not in n:
                F.append(f'{tid} node must be an object with section/required/repeatable: {n}')
                continue
            s = secs.get(n['section'])
            if not s:
                F.append(f'{tid} node section {n["section"]} has no contract')
                continue
            d = s[1]
            vids = [v['id'] for v in d['variants']]
            vs = ([n['variant']] if n.get('variant') else []) + n.get('variants', [])
            for v in vs:
                if v not in vids:
                    F.append(f'{tid} node {n["section"]} variant {v} is not a variant of the section')
            if d['variantRequired'] and not vs:
                F.append(f'{tid} node {n["section"]} must name a variant (section variantRequired)')
            for k2 in ('forbidFields', 'requireFields'):
                for fld in (n.get('contentRules') or {}).get(k2, []):
                    if fld not in d['content']['fields']:
                        F.append(f'{tid} contentRules {k2} names unknown field {fld}')
        ch = t['chrome']
        names = [n['section'] for n in t['nodes']]
        if ch['promoBar'] != ('chrome.promo-bar' in names):
            F.append(f'{tid} promoBar chrome flag disagrees with its nodes')
        if (ch['nav'] != 'none') != ('chrome.nav' in names):
            F.append(f'{tid} nav chrome disagrees with its nodes')
        if (ch['footer'] != 'none') != ('chrome.footer' in names):
            F.append(f'{tid} footer chrome disagrees with its nodes')
        for n in t['nodes']:
            if n['section'] == 'chrome.nav' and n.get('variant') != ch['nav']:
                F.append(f'{tid} nav node variant differs from chrome.nav')
            if n['section'] == 'chrome.footer' and n.get('variant') != ch['footer']:
                F.append(f'{tid} footer node variant differs from chrome.footer')
        for lv in ('desktop', 'mobile', 'tablet'):
            if t['evidence'].get(lv) not in RANK:
                F.append(f'{tid} evidence.{lv} invalid')
    return F, W


# ------------------------------------------------------------------ sections
def walk_text_fields(fields, path, out):
    for k, f in fields.items():
        t = f['type']
        p = f'{path}.{k}'
        if t in ('text', 'cell', 'link'):
            out.append((p, f))
        elif t == 'list':
            walk_text_fields({'[]': f['items']}, p, out)
        elif t == 'object':
            walk_text_fields(f['fields'], p, out)
        elif t == 'oneOf':
            for o in f['options']:
                walk_text_fields(o['fields'], p + '<' + o['name'] + '>', out)


@guarded
def check_sections(root):
    F, W = [], []
    mp = jload(root, 'tokens/10-semantic/motion-patterns.json')
    pats, fbs = mp['patterns'], mp['reducedMotionFallbacks']
    secs = sections(root)
    csch = jload(root, 'schema/section-contract.schema.json')
    try:
        from jsonschema import Draft7Validator
        Draft7Validator.check_schema(csch)
        cval = Draft7Validator(csch)
    except Exception as e:  # noqa: BLE001
        cval = None
        F.append(f'schema/section-contract.schema.json is not a valid Draft-07 schema: {e}')
    if cval is not None:
        if csch['properties']['semantic']['properties']['category'].get('enum') != SEMANTIC_CATEGORIES:
            F.append('section-contract.schema.json semantic.category enum differs from the closed category list pinned in verify_all.py')
        if csch.get('additionalProperties') is not False or csch['properties']['source'].get('additionalProperties') is not False or csch['properties']['semantic'].get('additionalProperties') is not False:
            F.append('section-contract.schema.json must stay closed (additionalProperties false) at the top level and on source and semantic')
        if csch['properties']['retrievalEligible'].get('type') != 'boolean' or csch['properties']['retrievalIneligibleReason'].get('minLength') != 30:
            F.append('section-contract.schema.json must keep retrievalEligible a boolean and the reason at 30+ characters')
        for sid, (rel, d) in secs.items():
            for e in sorted(cval.iter_errors(d), key=lambda e: list(e.absolute_path))[:3]:
                F.append(f'{rel}: contract schema: {"/".join(str(p) for p in e.absolute_path)}: {e.message[:150]}')
    all_roles = {r['id'] for r in jload(root, 'assets/asset-roles.json')['roles']}
    sem_ids = {}
    for sid, (rel, d) in secs.items():
        sem, src = d.get('semantic', {}), d.get('source', {})
        if sem.get('category') not in SEMANTIC_CATEGORIES:
            F.append(f'{sid} semantic.category {sem.get("category")!r} is outside the closed list')
        sem_ids.setdefault(sem.get('id'), set()).add(sem.get('category'))
        if src.get('id') == sem.get('id'):
            F.append(f'{sid}: source.id and semantic.id must be different kinds of identifier')
        m = re.match(r'^(\d+)-(\d+)$', str(src.get('lines', '')))
        if not m or int(m.group(1)) > int(m.group(2)):
            F.append(f'{sid} source.lines {src.get("lines")!r} is not a valid ascending range')
        if not str(src.get('file', '')).startswith('src/'):
            F.append(f'{sid} source.file must live under src/')
        elig = d.get('retrievalEligible', True)
        reason = d.get('retrievalIneligibleReason')
        pinned = sid in RETRIEVAL_PINNED
        if not isinstance(elig, bool):
            F.append(f'{sid} retrievalEligible must be a closed boolean')
        if pinned and elig is not False:
            F.append(f'{sid} is pinned retrieval-ineligible in verify_all.py but its contract says {elig!r}')
        if RUNTIME_UI_NAME.search(f'{sid} {d.get("title", "")}') and not pinned:
            F.append(f'{sid} looks like runtime UI (cookie, consent, modal, dialog, overlay) and must be in the pinned retrieval-ineligible list of verify_all.py')
        if elig is False and not pinned:
            F.append(f'{sid} is retrievalEligible false but not pinned: false is reserved for utility and runtime UI')
        if elig is False and (not isinstance(reason, str) or len(reason.strip()) < 30):
            F.append(f'{sid} retrievalEligible false needs a reason of 30+ characters')
        if elig is not False and reason is not None:
            F.append(f'{sid} carries a retrievalIneligibleReason although it is retrievable')
        used = set()

        def roles(f):
            if f['type'] == 'asset':
                used.update(f['allowedRoles'])
            elif f['type'] == 'list':
                roles(f['items'])
            elif f['type'] == 'object':
                for v in f['fields'].values():
                    roles(v)
            elif f['type'] == 'oneOf':
                for o in f['options']:
                    for v in o['fields'].values():
                        roles(v)
        for v in d['content']['fields'].values():
            roles(v)
        if sorted(d['assetRoles']) != sorted(used):
            F.append(f'{sid} assetRoles {d["assetRoles"]} differ from the roles its fields allow {sorted(used)}')
        if not set(d['assetRoles']) <= all_roles:
            F.append(f'{sid} assetRoles name an unknown role')
        peer = d.get('constraints', {}).get('layoutPeer')
        if peer is not None:
            if peer not in secs:
                F.append(f'{sid} layoutPeer {peer} is not a section')
            elif secs[peer][1].get('constraints', {}).get('layoutPeer') != sid:
                F.append(f'{sid} layoutPeer {peer} is not reciprocal')
    for i, cats in sem_ids.items():
        if len(cats) > 1:
            F.append(f'semantic id {i} is classed {sorted(map(str, cats))}: one id, one category')
    pm = jload(root, 'extraction/provenance-map.json')
    if sorted(pm['retrievalIneligible']) != sorted(RETRIEVAL_PINNED):
        F.append('provenance-map.json retrievalIneligible differs from the list pinned in verify_all.py')
    if pm['semanticCategories'] != sorted(SEMANTIC_CATEGORIES):
        F.append('provenance-map.json semanticCategories differs from the closed list pinned in verify_all.py')
    for sid, (rel, d) in secs.items():
        for k in ('id', 'kind', 'semantic', 'source', 'purpose', 'content', 'variants', 'constraints', 'motion', 'responsive', 'a11y', 'assetRoles', 'styleTokens', 'evidence', 'scopeNotes'):
            if k not in d:
                F.append(f'{sid} missing {k}')
        if d.get('content', {}).get('additionalProperties') is not False:
            F.append(f'{sid} content must be closed (additionalProperties false)')
        tf = []
        walk_text_fields(d['content']['fields'], 'content', tf)
        for p, f in tf:
            if not isinstance(f.get('maxWords'), int) or f['maxWords'] < 1:
                F.append(f'{sid} {p} has no maxWords budget')
        ps = d['motion']['patterns']
        if not ps:
            F.append(f'{sid} motion lists no patterns')
        for p in ps:
            if p['pattern'] not in pats:
                F.append(f'{sid} motion pattern {p["pattern"]} is not in the closed vocabulary')
            if p.get('reducedMotionFallback') not in fbs:
                F.append(f'{sid} pattern {p["pattern"]} lacks a valid reducedMotionFallback')
            if 'reveal' in p['pattern'] and sid != 'shared.page-links':
                F.append(f'{sid} uses a scroll-reveal pattern: only shared.page-links may')
            if p['pattern'] == 'none' and p.get('reducedMotionFallback') != 'not-applicable':
                F.append(f'{sid} none pattern must pair with not-applicable')
        bps = d['responsive']['breakpoints']
        if sorted(b['viewport']['name'] for b in bps) != ['desktop', 'desktop-narrow', 'mobile', 'tablet']:
            F.append(f'{sid} responsive must have structured mobile, tablet, desktop-narrow and desktop entries')
        for b in bps:
            if b['evidenceLevel'] not in RANK or not isinstance(b['layout'], dict) or not b['layout']:
                F.append(f'{sid} responsive {b["viewport"]["name"]} must be a structured layout object with an evidenceLevel')
            if b['viewport']['name'] in ('tablet', 'desktop-narrow') and b['evidenceLevel'] == 'measured':
                F.append(f'{sid} {b["viewport"]["name"]} was never measured on the original')
        if not d['a11y']:
            F.append(f'{sid} has no a11y notes')
        ev = d['evidence']
        if not ev['citations']:
            F.append(f'{sid} has no citations')
        for lv in ('desktop', 'mobile', 'tablet'):
            if ev['level'].get(lv) not in RANK:
                F.append(f'{sid} evidence.level.{lv} invalid')
        if d['variantRequired'] and not d['variants']:
            F.append(f'{sid} variantRequired without variants')
        vids = {v['id'] for v in d['variants']}
        for vr in d['variantRules']:
            if vr['variant'] not in vids:
                F.append(f'{sid} variantRule names unknown variant {vr["variant"]}')
    return F, W


# ------------------------------------------------------------------ graph
@guarded
def check_graph(root):
    F, W = [], []
    g = jload(root, 'compatibility/graph.json')['rules']
    sv = load_validator(root)
    ids = [r['id'] for r in g]
    if len(ids) != len(set(ids)):
        F.append('duplicate graph rule ids')
    if set(ids) != sv.RULE_IDS:
        F.append(f'graph rule ids and validator rule ids differ: only in graph {sorted(set(ids) - sv.RULE_IDS)}, only in validator {sorted(sv.RULE_IDS - set(ids))}')
    secs = sections(root)
    for r in g:
        if r['severity'] not in ('error', 'warn'):
            F.append(f'{r["id"]} severity must be error or warn')
        for e in r['exceptions']:
            if 'id' not in e or 'reason' not in e:
                F.append(f'{r["id"]} exception needs a name (id) and a reason')
            for s in e.get('sections', []):
                if s not in secs:
                    F.append(f'{r["id"]} exception names unknown section {s}')
        for s in r['params'].get('heroSections', []):
            if s not in secs:
                F.append(f'{r["id"]} param names unknown section {s}')
    return F, W


# ------------------------------------------------------------------ asset roles
PINNED = {'logo.customer-placeholder': 'invented-mark-only', 'brand.wordmark-placeholder': 'invented-mark-only', 'photo.person': 'must-not-fabricate',
          'badge.award-placeholder': 'placeholder-only', 'illustration.decorative-placeholder': 'placeholder-only', 'form.endpoint-placeholder': 'must-not-reuse-live-endpoint'}


@guarded
def check_asset_roles(root):
    F, W = [], []
    ar = jload(root, 'assets/asset-roles.json')
    pol = set(ar['generationPolicies'])
    seen = {}
    for r in ar['roles']:
        seen[r['id']] = r
        if r['generationPolicy'] not in pol:
            F.append(f'role {r["id"]}: generationPolicy {r["generationPolicy"]!r} is outside the closed enum')
        if not r['guidance'].get('mayDo') or not r['guidance'].get('mustNot'):
            F.append(f'role {r["id"]}: guidance needs mayDo and mustNot')
    for rid, want in PINNED.items():
        r = seen.get(rid)
        if not r:
            F.append(f'pinned role {rid} missing')
            continue
        if not r.get('pinnedPolicy'):
            F.append(f'role {rid} must be marked pinnedPolicy')
        if r['generationPolicy'] != want:
            F.append(f'PINNED role {rid} must have generationPolicy {want!r}, found {r["generationPolicy"]!r} (a valid but wrong value)')
    for rid, r in seen.items():
        if r.get('pinnedPolicy') and rid not in PINNED:
            F.append(f'role {rid} is marked pinned but has no expected value in verify_all')
    banned = ' '.join(x for r in ar['roles'] for x in r['guidance']['mustNot']).lower()
    if 'real company' not in ar.get('sourcePolicyNote', '') or 'logo' not in banned or 'employee' not in banned:
        F.append('asset policy must explicitly ban reproducing real logos, real employee/customer photos and proprietary content')
    secs = sections(root)
    for sid, (_rel, d) in secs.items():
        for r in d['assetRoles']:
            if r not in seen:
                F.append(f'{sid} uses unknown assetRole {r}')
    ex = jload(root, 'schema/example.pagespec.json')
    found = set()

    def walk(o):
        if isinstance(o, dict):
            if 'assetRole' in o:
                found.add(o['assetRole'])
            for v in o.values():
                walk(v)
        elif isinstance(o, list):
            for v in o:
                walk(v)
    walk(ex)
    for r in found:
        if r not in seen:
            F.append(f'example uses unknown assetRole {r}')
    return F, W


# ------------------------------------------------------------------ tokens
@guarded
def check_tokens(root):
    F, W = [], []
    cat = jload(root, 'tokens/llm/token-catalog.json')
    pol = jload(root, 'tokens/llm/token-policy.json')
    names = set()
    for v in cat['keys'].values():
        names.update(v)
    files = {}
    for p in glob.glob(os.path.join(root, 'tokens', '*', '*.json')):
        if os.sep + 'llm' + os.sep in p or os.sep + 'themes' + os.sep in p:
            continue
        files.update(json.load(open(p, encoding='utf-8')).get('tokens', {}))
    for n in sorted(names - set(files)):
        F.append(f'catalog name {n} exists in no tokens/ file')
    for k in cat['referenceableCategories']:
        if k not in cat['keys']:
            F.append(f'referenceable category {k} is not a catalog key')
    for k in pol['rawValueRestrictions']:
        if k not in cat['keys']:
            F.append(f'token-policy rawValueRestrictions key {k!r} is not a real catalog key')
    if pol['overrides'].get('pageSpecLevel') is not False:
        F.append('token-policy overrides must state that PageSpecs carry no style/token override field')
    schema = jload(root, 'schema/pagespec.schema.json')
    if set(schema['definitions']['node']['properties']) & {'style', 'tokens', 'tokenOverrides', 'overrides', 'className'}:
        F.append('the schema has a per-instance style/token field but token-policy says it does not')
    for folder in ('primitives', 'sections'):
        for p in glob.glob(os.path.join(root, folder, '*.json')):
            d = json.load(open(p, encoding='utf-8'))
            for t in d.get('styleTokens', []):
                if t not in names:
                    F.append(f'{os.path.relpath(p, root)} styleTokens names {t!r}, which is not in the token catalog')
    def enum_tokens(fields, where):
        for k, f in fields.items():
            if f['type'] == 'enum':
                for val in f['values']:
                    if isinstance(val, str) and val.startswith('color.') and val not in names:
                        F.append(f'{where}.{k} enum value {val} is not a catalog colour token')
            elif f['type'] == 'object':
                enum_tokens(f['fields'], where + '.' + k)
            elif f['type'] == 'list':
                enum_tokens({'[]': f['items']}, where + '.' + k)
            elif f['type'] == 'oneOf':
                for o in f['options']:
                    enum_tokens(o['fields'], where + '.' + k)
    for sid, (_rel, d) in sections(root).items():
        enum_tokens(d['content']['fields'], sid)
    sem = jload(root, 'tokens/10-semantic/color.json')['tokens']
    light = jload(root, 'tokens/themes/light.json')['resolved']
    for k, v in sem.items():
        if k not in light or not light[k].get('value'):
            F.append(f'theme light does not resolve semantic token {k}')
        if v['ref'] not in files:
            F.append(f'semantic token {k} refs unknown foundation token {v["ref"]}')
    return F, W


# ------------------------------------------------------------------ self-containment + lint
@guarded
def check_selfcontained(root):
    F, W = [], []
    for dirpath, dirs, fns in os.walk(root):
        dirs[:] = [d for d in dirs if d != '__pycache__']
        for fn in fns:
            if fn.endswith(('.pyc', '.DS_Store')):
                continue
            p = os.path.join(dirpath, fn)
            try:
                txt = open(p, encoding='utf-8').read()
            except UnicodeDecodeError:
                continue
            for pat in ABS_PATHS:
                if pat in txt:
                    F.append(f'{os.path.relpath(p, root)} contains an absolute machine path ({pat})')
            if fn.endswith('.json'):
                try:
                    json.loads(txt)
                except ValueError as e:
                    F.append(f'{os.path.relpath(p, root)} is not valid JSON: {e}')

    def lint(o, where, key=None):
        if isinstance(o, str):
            if key in ('anchor', 'ref'):
                return
            if FORBIDDEN_WORDS.search(o) or CLASS_STRING.search(o):
                F.append(f'{where}: framework vocabulary in a contract field: {o[:90]!r}')
        elif isinstance(o, list):
            for x in o:
                lint(x, where, key)
        elif isinstance(o, dict):
            for k, v in o.items():
                lint(v, where, k)
    for folder in ('tokens', 'primitives', 'components', 'sections', 'templates', 'compatibility', 'assets'):
        for p in glob.glob(os.path.join(root, folder, '**', '*.json'), recursive=True):
            lint(json.load(open(p, encoding='utf-8')), os.path.relpath(p, root))
    lint(json.load(open(os.path.join(root, 'schema', 'pagespec.schema.json'), encoding='utf-8')), 'schema/pagespec.schema.json')
    return F, W


@guarded
def check_example(root):
    F, W = [], []
    sv = load_validator(root)
    repo = sv.Repo(root)
    spec = jload(root, 'schema/example.pagespec.json')
    res = sv.validate(spec, repo)
    for e in res['schemaErrors']:
        F.append('example schema error: ' + e)
    for f in res['findings']:
        (F if f['severity'] == 'error' else W).append(f'example {f["rule"]} {f["path"]}: {f["message"]}')
    try:
        from jsonschema import Draft7Validator
        Draft7Validator.check_schema(repo.schema)
    except Exception as e:
        F.append(f'schema is not valid Draft-07: {e}')
    return F, W


@guarded
def check_measured(root):
    F, W = [], []
    mv = jload(root, 'extraction/measured-values.json')
    routes = jload(root, 'templates/routes.json')['routes']
    cnt = {}
    for r in routes:
        if 'template' in r:
            cnt[r['template']] = cnt.get(r['template'], 0) + 1
    part = mv['classifierRuns']['partition']
    for tid, n in part.items():
        if cnt.get(tid) != n:
            F.append(f'measured-values partition says {tid}={n} but routes.json has {cnt.get(tid)}')
    if set(part) != set(cnt):
        F.append('measured-values partition and routes.json name different templates')
    if sum(part.values()) + mv['classifierRuns']['redirects'] != len(routes):
        F.append('measured-values partition does not sum to the route count')
    for c in mv['corrections']:
        if c.get('chosen') != 'implemented':
            F.append(f'correction {c.get("topic")} must record that the implemented value was chosen')
    return F, W


# ------------------------------------------------------------------ classification
@guarded
def check_classification(root):
    F, W = [], []
    secs = sections(root)
    g = jload(root, 'compatibility/graph.json')['rules']
    rules = {r['id']: r for r in g}
    heroes = sorted(sid for sid, (_r, d) in secs.items() if d['semantic']['category'] == 'HERO')
    for rid in ('ONE_HERO', 'HERO_FIRST'):
        if sorted(rules[rid]['params']['heroSections']) != heroes:
            F.append(f'graph {rid}.params.heroSections differs from the sections classed HERO: {heroes}')
    for o in rules['HERO_FIRST']['params'].get('openerSections', []):
        if o not in secs:
            F.append(f'HERO_FIRST openerSections names unknown section {o}')
    templ = jload(root, 'templates/templates.json')['templates']
    for tid, t in templ.items():
        hs = [n['section'] for n in t['nodes'] if n['section'] in heroes and (t['orderMode'] == 'fixed')]
        if len(hs) > t['constraints'].get('maxHeroCategoryBlocks', 1):
            F.append(f'{tid} lists {len(hs)} HERO sections ({hs}) in its fixed node list without maxHeroCategoryBlocks')
    for sid, (_rel, d) in secs.items():
        cat, sid_sem = d['semantic']['category'], d['semantic']['id']
        if FORM_ROLE in d['assetRoles'] and cat not in ('CONVERSION', 'HERO', 'SHELL'):
            F.append(f'{sid} carries a form endpoint but is classed {cat}: conversion blocks must be CONVERSION')
        if cat == 'FEATURES' and EDITORIAL_NAME.search(sid_sem):
            F.append(f'{sid} ({sid_sem}) is editorial or news content and must not be classed FEATURES')
        if cat != 'CONVERSION' and sid_sem.split('.')[0] == 'conversion':
            F.append(f'{sid}: semantic id {sid_sem} is a conversion id but the category is {cat}')
        if cat == 'CONVERSION' and sid_sem.split('.')[0] != 'conversion':
            F.append(f'{sid}: category CONVERSION with a non-conversion semantic id {sid_sem}')
    # CTA-like copy outside CONVERSION must carry a review with a disposition
    rv = jload(root, 'extraction/classification-review.json')
    reviewed = {}
    for i, e in enumerate(rv['entries']):
        for k in ('section', 'finding', 'disposition', 'justification', 'reviewedBy', 'attestation', 'reviewedOn'):
            if k not in e:
                F.append(f'classification-review entry {i} is missing {k}')
        if e.get('disposition') not in ('secondary-cta-accepted',):
            F.append(f'classification-review entry {i}: disposition must be secondary-cta-accepted (a primary conversion block is reclassified, not reviewed)')
        if len(str(e.get('justification', '')).strip()) < 30:
            F.append(f'classification-review entry {i}: justification needs 30+ characters')
        if e.get('attestation') not in ('agent', 'human'):
            F.append(f'classification-review entry {i}: attestation must be agent or human')
        reviewed[e.get('section')] = e
    hit = set()
    for sid, (_rel, d) in secs.items():
        if d['semantic']['category'] in ('CONTENT', 'FEATURES', 'PROOF', 'FEED', 'ARTICLE'):
            fields = ' '.join(d['content']['fields'])
            if CTA_COPY.search(d['purpose']) or re.search(r'cta|button', fields, re.I):
                hit.add(sid)
                if sid not in reviewed:
                    F.append(f'{sid} ({d["semantic"]["category"]}) has CTA-like copy but no entry in extraction/classification-review.json: reclassify it as CONVERSION or record why the CTA is secondary')
    for sid in reviewed:
        if sid not in secs:
            F.append(f'classification-review names unknown section {sid}')
        elif sid not in hit:
            F.append(f'classification-review entry for {sid} is stale: the section no longer matches the CTA-like copy scan')
    return F, W


# ------------------------------------------------------------------ generated artefacts stay in sync
def _load_tool(root, rel, name):
    spec = importlib.util.spec_from_file_location(name + '_' + hashlib.md5(root.encode()).hexdigest()[:8], os.path.join(root, rel))
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m


@guarded
def check_schema_sync(root):
    F, W = [], []
    m = _load_tool(root, 'schema/generate_pagespec_schema.py', 'gen_schema')
    cur = json.load(open(os.path.join(root, 'schema', 'pagespec.schema.json'), encoding='utf-8'))
    new = m.generate(root)
    a, b = m.canon(cur), m.canon(new)
    if a != b:
        for part in ('content', 'motion'):
            for sid in sorted(set(a['definitions'][part]) | set(b['definitions'][part])):
                if a['definitions'][part].get(sid) != b['definitions'][part].get(sid):
                    F.append(f'pagespec.schema.json definitions.{part}.{sid} differs from the contract')
        for sid in sorted(set(a['definitions']['node']['allOf']) | set(b['definitions']['node']['allOf'])):
            if a['definitions']['node']['allOf'].get(sid) != b['definitions']['node']['allOf'].get(sid):
                F.append(f'pagespec.schema.json node rule for {sid} differs from the contract')
        for k, where in (('section enum', lambda x: x['definitions']['node']['properties']['section']['enum']), ('template enum', lambda x: x['properties']['template']['enum'])):
            if where(a) != where(b):
                F.append(f'pagespec.schema.json {k} differs from the contracts')
        if not F:
            F.append('pagespec.schema.json differs from what schema/generate_pagespec_schema.py builds')
    return F, W


@guarded
def check_provenance_sync(root):
    F, W = [], []
    m = _load_tool(root, 'extraction/generate_provenance.py', 'gen_prov')
    m.ROOT = root
    contracts, new, al, al_new = m.generate()
    for sid in new:
        if new[sid][1] != contracts[sid][1]:
            F.append(f'{sid}: source/semantic/retrieval differ from what extraction/generate_provenance.py builds')
    if al != al_new:
        F.append('tokens/llm/component-allowlist.json differs from what extraction/generate_provenance.py builds')
    return F, W


@guarded
def check_wrapper(root):
    m = _load_tool(root, 'extraction/wrapper_gate.py', 'wrapper_gate')
    return m.check_wrapper_gate(root)


@guarded
def check_ia_crosswalk(root):
    F, W = [], []
    src = find_src_root(root)
    if src is None or not os.path.exists(os.path.join(src, 'ia.json')):
        W.append('no sibling ia.json: semantic ids not cross-checked against the information architecture')
        return F, W
    ia = json.load(open(os.path.join(src, 'ia.json'), encoding='utf-8'))['sections']
    for sid, (_rel, d) in sections(root).items():
        s = d['semantic']
        if s['id'] not in ia:
            F.append(f'{sid}: semantic.id {s["id"]} is not a section of ia.json')
        elif ia[s['id']]['category'] != s['category']:
            F.append(f'{sid}: semantic category {s["category"]} but ia.json classes {s["id"]} as {ia[s["id"]]["category"]}')
    return F, W


CHECKS = [('manifest', check_manifest), ('allowlist', check_allowlist), ('citations', check_citations), ('routes', check_routes), ('templates', check_templates), ('sections', check_sections),
          ('graph', check_graph), ('asset_roles', check_asset_roles), ('tokens', check_tokens), ('selfcontained', check_selfcontained), ('example', check_example), ('measured', check_measured), ('classification', check_classification), ('schema_sync', check_schema_sync),
          ('provenance_sync', check_provenance_sync), ('wrapper_gate', check_wrapper), ('ia_crosswalk', check_ia_crosswalk), ('snapshot', check_snapshot)]


def run(root):
    total_f = 0
    for name, fn in CHECKS:
        F, W = fn(root)
        status = 'FAIL' if F else ('WARN' if W else 'PASS')
        print(f'[{status}] {name}: {len(F)} failure(s), {len(W)} warning(s)')
        for x in F[:25]:
            print('    FAIL', x)
        if len(F) > 25:
            print(f'    ... {len(F) - 25} more failures')
        for x in W[:6]:
            print('    warn', x)
        if len(W) > 6:
            print(f'    ... {len(W) - 6} more warnings')
        total_f += len(F)
    print('RESULT:', 'FAILED' if total_f else 'ALL CHECKS PASSED', f'({total_f} failures)')
    return total_f


if __name__ == '__main__':
    root = ROOT
    if '--root' in sys.argv:
        root = os.path.abspath(sys.argv[sys.argv.index('--root') + 1])
    sys.exit(1 if run(root) else 0)
