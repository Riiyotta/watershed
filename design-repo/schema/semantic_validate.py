#!/usr/bin/env python3
"""Semantic validator for PageSpec instances (the layer JSON Schema cannot express).

Layers, in order:
  1. Draft-07 JSON Schema (schema/pagespec.schema.json).
  2. Semantic rules, one function per rule id in compatibility/graph.json. Severity and
     rule parameters come from the graph (single source); the logic lives here. The rule id
     sets of the two files must be identical (extraction/verify_all.py checks this).

A PageSpec is validated against its DECLARED template: every node is cross-referenced with that
template's real node list (not nodes[] in isolation), keyed on (section, variant).

Generation context `mode` (required, closed enum in the schema):
  reference  a faithful reconstruction of the source: the roles listed in a field's `allowedRoles` apply and the clone's content is fine.
  generated  a NEW page for any other brand. The GENERATED_MODE_* rules reject, on NFKC-normalised text (zero-width characters removed,
             curly quotes straightened): the source brand in any spelling (GENERATED_MODE_BRAND), source CTA labels (_CTA), source copy as
             hashed 5-word shingles (_COPY), source URLs, hosts and social profiles (_URL) and any other non-reserved absolute URL
             (_EXTERNAL_URL), real customers (_CUSTOMER), real people (_PERSON), review scores and analyst or review-platform names (_RATING),
             a reference-only or blocked-for-generation asset role (_ASSET) or a role that is not one of the field's generation-safe roles
             (_ROLE), chrome that falls back to the clone's own navigation copy (_CHROME) and a route outside the template's route family
             (_ROUTE). Third-party names only warn (_THIRD_PARTY). Every pattern comes from assets/asset-roles.json `sourceBrand`, which
             extraction/build_source_brand.py derives from the project; if a required category is empty the validator fails closed
             (_PATTERNS_MISSING). Asset availability is pinned in CODE (PINNED_AVAILABILITY, ASSET_AVAILABILITY_PINNED) so editing the
             registry cannot make a protected role usable. Detection is string based and the pattern lists are not human-reviewed.

Usage:
    python3 schema/semantic_validate.py [path/to/pagespec.json]     # default: schema/example.pagespec.json
Exit status 0 = no schema errors and no error-severity findings; 1 otherwise.
Requires: Python 3 and `pip install jsonschema`. Paths derive from this file, never from the machine.
"""
import glob
import json
import os
import hashlib
import re
import sys
import unicodedata
from urllib.parse import urlsplit

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

SITE_CHROME = ('chrome.promo-bar', 'chrome.nav', 'chrome.footer')

# Contract taxonomy pins. They are deliberately defined HERE as well as in schema/section-contract.schema.json and in
# extraction/verify_all.py: each layer pins them independently, so changing a contract alone is caught by all three.
SEMANTIC_CATEGORIES = ('SHELL', 'HERO', 'PROOF', 'FEATURES', 'CONTENT', 'CONVERSION', 'FEED', 'ARTICLE')
# Layout-only utility and runtime UI (cookie or consent banners, modals, dialogs, overlays) are not retrievable exemplars.
RETRIEVAL_INELIGIBLE_PINNED = ('block.HorizontalRule', 'block.Spacer')
RUNTIME_UI_NAME_RE = re.compile(r'cookie|consent|modal|dialog|overlay|lightbox|toast|popover|drawer', re.I)
FORM_ENDPOINT_ROLE = 'form.endpoint-placeholder'
FORM_OK_CATEGORIES = ('CONVERSION', 'HERO', 'SHELL')
EDITORIAL_NAME_RE = re.compile(r'blog|news|post|article|editorial|stor(?:y|ies)|related', re.I)
URL_RE = re.compile(r'https?://', re.I)

# ---------------------------------------------------------------- generation context (mode)
MODES = ('reference', 'generated')
AVAILABILITY_VALUES = ('reference-only', 'generation-safe', 'blocked-for-generation')
# Availability of every asset role by PageSpec mode (assets/asset-roles.json `availability`). Pinned HERE in code, separately from the
# registry and from extraction/verify_all.py (which keeps its own copy): editing one of them alone is caught by the other two.
PINNED_AVAILABILITY = {
    'photo.environment': 'generation-safe', 'photo.business-setting': 'generation-safe', 'photo.dark-backdrop': 'generation-safe',
    'photo.person': 'blocked-for-generation',
    'artboard.product-ui': 'reference-only', 'artboard.diagram': 'generation-safe', 'artboard.cover-graphic': 'generation-safe',
    'video.poster-placeholder': 'generation-safe',
    'logo.customer-placeholder': 'reference-only', 'brand.wordmark-placeholder': 'reference-only',
    'badge.award-placeholder': 'generation-safe', 'illustration.decorative-placeholder': 'generation-safe',
    'background.generated-texture': 'generation-safe', 'form.endpoint-placeholder': 'generation-safe',
    'brand.user-supplied-logo': 'generation-safe', 'logo.fictional-customer': 'generation-safe', 'avatar.fictional-placeholder': 'generation-safe',
    'artboard.generated-visual': 'generation-safe', 'url.placeholder': 'generation-safe', 'copy.original': 'generation-safe',
}
PINNED_SUBSTITUTES = {
    'photo.person': ['avatar.fictional-placeholder'], 'artboard.product-ui': ['artboard.generated-visual'],
    'logo.customer-placeholder': ['logo.fictional-customer'], 'brand.wordmark-placeholder': ['brand.user-supplied-logo'],
}
# Rule ids raised by r_generated() and the asset walk (graph.json must list exactly these plus the registry pins).
GENERATED_RULES = ('GENERATED_MODE_BRAND', 'GENERATED_MODE_CTA', 'GENERATED_MODE_COPY', 'GENERATED_MODE_URL', 'GENERATED_MODE_EXTERNAL_URL',
                   'GENERATED_MODE_CUSTOMER', 'GENERATED_MODE_PERSON', 'GENERATED_MODE_RATING', 'GENERATED_MODE_THIRD_PARTY', 'GENERATED_MODE_ASSET',
                   'GENERATED_MODE_ROLE', 'GENERATED_MODE_CHROME', 'GENERATED_MODE_ROUTE', 'GENERATED_MODE_PATTERNS_MISSING')
# sourceBrand category -> rule id; the first six categories must be non-empty (fail closed), the last two only warn.
SOURCE_CATEGORY_RULE = {'brand': 'GENERATED_MODE_BRAND', 'cta': 'GENERATED_MODE_CTA', 'url': 'GENERATED_MODE_URL', 'customer': 'GENERATED_MODE_CUSTOMER',
                        'person': 'GENERATED_MODE_PERSON', 'rating': 'GENERATED_MODE_RATING', 'program': 'GENERATED_MODE_THIRD_PARTY', 'thirdParty': 'GENERATED_MODE_THIRD_PARTY'}
WARN_ONLY_CATEGORIES = ('program', 'thirdParty')
REQUIRED_SOURCE_CATEGORIES = ('brand', 'cta', 'url', 'customer', 'person', 'rating')
# Keys whose string values are the contract's own vocabulary (ids and enum members), not rendered text.
STRUCTURAL_KEYS = frozenset({'section', 'variant', 'template', 'mode', 'pageSpecVersion', 'assetRole', 'tone', 'pattern', 'reducedMotionFallback'})
# A generated page's chrome must carry these fields so nothing falls back to the clone's own navigation, footer or promo copy.
GENERATED_CHROME_FIELDS = {'chrome.nav': ('brandName', 'menus'), 'chrome.footer': ('brandName', 'groups', 'copyright'), 'chrome.promo-bar': ('offers',),
                           'chrome.cta-bar': ('title', 'button')}
SHINGLE_WORDS = 5
RESERVED_HOST_RE = re.compile(r'(?:^|\.)(?:example|invalid)$|(?:^|\.)example\.(?:com|org|net)$', re.I)
ANY_URL_RE = re.compile(r'(?:https?://|ftp://|mailto:)[^\s<>"\')\]]+|\bwww\.[^\s<>"\')\]]+', re.I)
ZERO_WIDTH_RE = re.compile('[\u200b\u200c\u200d\u200e\u200f\u2060\u2061\u2062\u2063\u2064\ufeff\u00ad]')


def norm(s):
    """NFKC, zero-width characters removed, curly quotes and dashes straightened, whitespace collapsed (same as extraction/build_source_brand.py)."""
    s = unicodedata.normalize('NFKC', str(s))
    s = ZERO_WIDTH_RE.sub('', s)
    for a, b in (('\u2018', "'"), ('\u2019', "'"), ('\u201a', "'"), ('\u201b', "'"), ('\u2032', "'"), ('\u201c', '"'), ('\u201d', '"'), ('\u201e', '"'),
                 ('\u2033', '"'), ('\u2010', '-'), ('\u2011', '-'), ('\u2012', '-'), ('\u2013', '-'), ('\u2014', '-')):
        s = s.replace(a, b)
    return re.sub(r'\s+', ' ', s).strip()


def norm_words(s):
    s = re.sub(r'\*|_|`', ' ', norm(s).lower())
    return re.findall(r"[a-z0-9]+(?:'[a-z]+)?", s)


def shingle_hash(words):
    return hashlib.sha256(' '.join(words).encode('utf-8')).hexdigest()[:16]


def generated_field_roles(allowed, avail=None, subs=None):
    """Roles a generated page may use in an asset field whose reference roles are `allowed`: the generation-safe ones themselves plus the
    generation-safe substitutes of the reference-only and blocked ones. Uses the pinned tables unless given others."""
    avail = PINNED_AVAILABILITY if avail is None else avail
    subs = PINNED_SUBSTITUTES if subs is None else subs
    out = set()
    for r in allowed:
        if avail.get(r) == 'generation-safe':
            out.add(r)
        else:
            out.update(x for x in subs.get(r, []) if avail.get(x) == 'generation-safe')
    return sorted(out)


def field_role_sets(fields):
    out = []

    def walk(f):
        if f['type'] == 'asset':
            out.append(list(f['allowedRoles']))
        elif f['type'] == 'list':
            walk(f['items'])
        elif f['type'] == 'object':
            for v in f['fields'].values():
                walk(v)
        elif f['type'] == 'oneOf':
            for o in f['options']:
                for v in o['fields'].values():
                    walk(v)
    for v in fields.values():
        walk(v)
    return out


def derived_generated_roles(section):
    out = set()
    for allowed in field_role_sets(section['content']['fields']):
        out.update(generated_field_roles(allowed))
    return sorted(out)


def url_host(u):
    u = u.rstrip('.,;:!?')
    if u.lower().startswith('mailto:'):
        addr = u[7:].split('?')[0]
        return addr.rsplit('@', 1)[-1].lower() if '@' in addr else ''
    if u.lower().startswith('www.'):
        u = 'https://' + u
    try:
        return (urlsplit(u).hostname or '').lower()
    except ValueError:
        return ''

MDLINK_RE = re.compile(r'\[([^\]]*)\]\(([^)]*)\)')


def _json(rel, root=None):
    with open(os.path.join(root or ROOT, rel), encoding='utf-8') as f:
        return json.load(f)


class Repo:
    """Everything the validator needs, loaded from inside the design-repo only."""

    def __init__(self, root=None):
        self.root = root or ROOT
        self.schema = _json('schema/pagespec.schema.json', self.root)
        self.templates = _json('templates/templates.json', self.root)['templates']
        self.routes = _json('templates/routes.json', self.root)['routes']
        self.route_map = {r['path']: r for r in self.routes}
        self.graph = _json('compatibility/graph.json', self.root)
        self.rule_cfg = {r['id']: r for r in self.graph['rules']}
        self.assets = _json('assets/asset-roles.json', self.root)
        self.roles = {r['id']: r for r in self.assets['roles']}
        self.sections = {}
        for p in sorted(glob.glob(os.path.join(self.root, 'sections', '*.json'))):
            with open(p, encoding='utf-8') as f:
                d = json.load(f)
            self.sections[d['id']] = d

    def source_patterns(self):
        """{category: [(id, compiled)]} from assets/asset-roles.json sourceBrand (fail-closed callers check for empty categories)."""
        if getattr(self, '_src_pats', None) is None:
            sb = self.assets.get('sourceBrand') or {}
            out = {}
            for cat, c in (sb.get('categories') or {}).items():
                pats = []
                for p in c.get('patterns', []):
                    try:
                        pats.append((p['id'], re.compile(p['pattern'], re.I if 'i' in p.get('flags', '') else 0)))
                    except (re.error, KeyError, TypeError):
                        continue
                out[cat] = pats
            self._src_pats = out
        return self._src_pats

    def shingles(self):
        if getattr(self, '_shingles', None) is None:
            try:
                self._shingles = frozenset(_json('assets/source-copy-hashes.json', self.root).get('copyShingles', []))
            except (OSError, ValueError):
                self._shingles = frozenset()
        return self._shingles

    def availability_findings(self):
        """(rule, path, message) for the registry-versus-pins comparison and the derived generatedAssetRoles; computed once per Repo."""
        if getattr(self, '_avail', None) is None:
            out = []
            reg = self.roles
            for rid, want in PINNED_AVAILABILITY.items():
                r = reg.get(rid)
                if r is None:
                    out.append(('ASSET_AVAILABILITY_PINNED', f'assets.roles.{rid}', f'pinned role {rid} is missing from assets/asset-roles.json'))
                    continue
                if r.get('availability') != want:
                    out.append(('ASSET_AVAILABILITY_PINNED', f'assets.roles.{rid}.availability', f'{rid} is pinned {want} in schema/semantic_validate.py but the registry says {r.get("availability")!r}'))
                if sorted(r.get('generationSafeSubstitutes', [])) != sorted(PINNED_SUBSTITUTES.get(rid, [])):
                    out.append(('ASSET_AVAILABILITY_PINNED', f'assets.roles.{rid}.generationSafeSubstitutes', f'{rid} substitutes {r.get("generationSafeSubstitutes")} differ from the pinned {PINNED_SUBSTITUTES.get(rid, [])}'))
            for rid in reg:
                if rid not in PINNED_AVAILABILITY:
                    out.append(('ASSET_AVAILABILITY_PINNED', f'assets.roles.{rid}', f'role {rid} has no pinned availability in schema/semantic_validate.py'))
            for sid, c in sorted(self.sections.items()):
                want = derived_generated_roles(c)
                if sorted(c.get('generatedAssetRoles', [])) != want:
                    out.append(('GENERATED_ROLES_DERIVED', f'sections.{sid}.generatedAssetRoles', f'{c.get("generatedAssetRoles")} differ from the roles derived from the pinned availability: {want}'))
            self._avail = out
        return self._avail

    def retrieval_eligible(self, section_id):
        """Closed boolean, default true. False for layout-only utility and runtime UI (see RETRIEVAL_ELIGIBILITY_PINNED)."""
        return self.sections[section_id].get('retrievalEligible', True)

    def retrieval_candidates(self):
        """Section ids a retrieval layer may return as exemplars."""
        return sorted(sid for sid in self.sections if self.retrieval_eligible(sid))


_REPO = None


def get_repo():
    global _REPO
    if _REPO is None:
        _REPO = Repo()
    return _REPO


def words(s):
    """Word count of rendered text: markdown link targets and emphasis markers are not words."""
    s = MDLINK_RE.sub(lambda m: m.group(1), str(s))
    s = s.replace('**', ' ').replace('*', ' ').replace('`', ' ')
    return len(s.split())


class Ctx:
    def __init__(self, spec, repo):
        self.spec, self.repo, self.findings = spec, repo, []

    def add(self, rule, path, msg):
        cfg = self.repo.rule_cfg.get(rule, {'severity': 'error'})
        self.findings.append({'rule': rule, 'severity': cfg['severity'], 'path': path, 'message': msg})


RULE_IMPLS = {}


def rule(rid):
    def deco(fn):
        RULE_IMPLS[rid] = fn
        return fn
    return deco


# ---------------------------------------------------------------- template helpers
def tnode_matches(tn, node):
    if tn['section'] != node.get('section'):
        return False
    nv = node.get('variant')
    if tn.get('variant') is not None:
        return nv == tn['variant']
    if tn.get('variants') is not None:
        return nv in tn['variants']
    return nv is None


def declared_template(ctx):
    return ctx.repo.templates.get(ctx.spec.get('template'))


def nodes_of(ctx):
    n = ctx.spec.get('nodes')
    return n if isinstance(n, list) else []


def content_nodes(ctx):
    return [(i, n) for i, n in enumerate(nodes_of(ctx)) if isinstance(n, dict) and n.get('section') not in SITE_CHROME]


# ---------------------------------------------------------------- rules: template cross-reference
@rule('NODE_IN_TEMPLATE')
def r_node_in_template(ctx):
    t = declared_template(ctx)
    if not t:
        return
    for i, n in enumerate(nodes_of(ctx)):
        if not any(tnode_matches(tn, n) for tn in t['nodes']):
            ctx.add('NODE_IN_TEMPLATE', f'nodes[{i}]', f'({n.get("section")}, {n.get("variant")}) is not a node of {t["id"]}')


@rule('REQUIRED_NODES_PRESENT')
def r_required(ctx):
    t = declared_template(ctx)
    if not t:
        return
    for tn in t['nodes']:
        if tn.get('required') and not any(tnode_matches(tn, n) for n in nodes_of(ctx)):
            ctx.add('REQUIRED_NODES_PRESENT', 'nodes', f'{t["id"]} requires ({tn["section"]}, {tn.get("variant") or tn.get("variants")}) but the spec has none')


@rule('NODE_ORDER_FIXED')
def r_order(ctx):
    t = declared_template(ctx)
    if not t or t.get('orderMode') != 'fixed':
        return
    idx = 0
    for i, n in enumerate(nodes_of(ctx)):
        hit = None
        for j in range(idx, len(t['nodes'])):
            if tnode_matches(t['nodes'][j], n):
                hit = j
                break
        if hit is None:
            if any(tnode_matches(tn, n) for tn in t['nodes']):
                ctx.add('NODE_ORDER_FIXED', f'nodes[{i}]', f'{n.get("section")} is out of order: {t["id"]} fixes its position')
        else:
            idx = hit


@rule('MAX_OCCURRENCES')
def r_max(ctx):
    t = declared_template(ctx)
    if not t:
        return
    counts = {}
    for i, n in enumerate(nodes_of(ctx)):
        for j, tn in enumerate(t['nodes']):
            if tnode_matches(tn, n):
                counts.setdefault(j, []).append(i)
                break
    for j, idxs in counts.items():
        tn = t['nodes'][j]
        limit = tn.get('maxOccurrences')
        if limit is None:
            limit = None if tn.get('repeatable') else 1
        if limit is not None and len(idxs) > limit:
            ctx.add('MAX_OCCURRENCES', f'nodes[{idxs[limit]}]', f'({tn["section"]}, {tn.get("variant") or tn.get("variants")}) occurs {len(idxs)} times; the template allows {limit}')


@rule('ONE_PER_PAGE_SECTION')
def r_one_per_page(ctx):
    seen = {}
    for i, n in enumerate(nodes_of(ctx)):
        sec = ctx.repo.sections.get(n.get('section'))
        if sec and sec['constraints'].get('onePerPage'):
            if n['section'] in seen:
                ctx.add('ONE_PER_PAGE_SECTION', f'nodes[{i}]', f'{n["section"]} is one-per-page but already used at nodes[{seen[n["section"]]}]')
            seen.setdefault(n['section'], i)


@rule('CHROME_MATCHES_TEMPLATE')
def r_chrome(ctx):
    t = declared_template(ctx)
    if not t:
        return
    ch = t['chrome']
    by = {}
    for i, n in enumerate(nodes_of(ctx)):
        if n.get('section') in SITE_CHROME:
            by.setdefault(n['section'], []).append((i, n))
    want = {'chrome.promo-bar': ch['promoBar'], 'chrome.nav': ch['nav'] != 'none', 'chrome.footer': ch['footer'] != 'none'}
    for sec, on in want.items():
        has = sec in by
        if on and not has:
            ctx.add('CHROME_MATCHES_TEMPLATE', 'nodes', f'{t["id"]} chrome requires {sec}')
        if has and not on:
            ctx.add('CHROME_MATCHES_TEMPLATE', f'nodes[{by[sec][0][0]}]', f'{t["id"]} chrome forbids {sec} (nav {ch["nav"]}, promoBar {ch["promoBar"]}, footer {ch["footer"]})')
    for sec, key in (('chrome.nav', 'nav'), ('chrome.footer', 'footer')):
        for i, n in by.get(sec, []):
            if want[sec] and n.get('variant') != ch[key]:
                ctx.add('CHROME_MATCHES_TEMPLATE', f'nodes[{i}]', f'{sec} variant must be "{ch[key]}" for {t["id"]}, got {n.get("variant")!r}')


@rule('CHROME_POSITION')
def r_chrome_pos(ctx):
    ns = nodes_of(ctx)
    last = len(ns) - 1
    seq = [n.get('section') for n in ns]
    order = [s for s in ('chrome.promo-bar', 'chrome.nav') if s in seq]
    for k, s in enumerate(order):
        if seq.index(s) != k:
            ctx.add('CHROME_POSITION', f'nodes[{seq.index(s)}]', f'{s} must come at position {k} (promo bar first, then nav)')
    if 'chrome.footer' in seq and seq.index('chrome.footer') != last:
        ctx.add('CHROME_POSITION', f'nodes[{seq.index("chrome.footer")}]', 'chrome.footer must be the last node')


def _free_block_template(ctx):
    t = declared_template(ctx)
    return t if t and t.get('orderMode') == 'free' else None


def hero_sections(repo):
    """Sections classed HERO by their own contract (semantic.category). The graph's heroSections list must equal this set."""
    return {sid for sid, c in repo.sections.items() if (c.get('semantic') or {}).get('category') == 'HERO'}


@rule('ONE_HERO')
def r_one_hero(ctx):
    t = declared_template(ctx)
    if not t:
        return
    heroes = hero_sections(ctx.repo)
    hits = [i for i, n in content_nodes(ctx) if n.get('section') in heroes]
    mx = t['constraints'].get('maxHeroCategoryBlocks', 1)
    if len(hits) > mx:
        ctx.add('ONE_HERO', f'nodes[{hits[mx]}]', f'{len(hits)} HERO-class sections; at most {mx} allowed on a {t["id"]} page')


@rule('HERO_FIRST')
def r_hero_first(ctx):
    t = _free_block_template(ctx)
    cn = content_nodes(ctx)
    if not t or not cn:
        return
    cfg = ctx.repo.rule_cfg['HERO_FIRST']
    heroes = hero_sections(ctx.repo) | set(cfg['params'].get('openerSections', []))
    if cn[0][1].get('section') in heroes:
        return
    exc_sections = set()
    for e in cfg.get('exceptions', []):
        exc_sections.update(e.get('sections', []))
    if len(cn) == 1 and cn[0][1].get('section') in exc_sections:
        return
    ctx.add('HERO_FIRST', f'nodes[{cn[0][0]}]', 'the first content node of a block page should be a hero-category block')


@rule('COMPARE_FIRST_LAST')
def r_compare(ctx):
    t = declared_template(ctx)
    cn = content_nodes(ctx)
    if not t or not cn:
        return
    first, last = t['constraints'].get('firstContentSection'), t['constraints'].get('lastContentSection')
    if first and cn[0][1].get('section') != first:
        ctx.add('COMPARE_FIRST_LAST', f'nodes[{cn[0][0]}]', f'{t["id"]} must open with {first}')
    if last and cn[-1][1].get('section') != last:
        ctx.add('COMPARE_FIRST_LAST', f'nodes[{cn[-1][0]}]', f'{t["id"]} must close with {last} before the footer')


@rule('TOC_LIMIT')
def r_toc(ctx):
    if not _free_block_template(ctx):
        return
    p = ctx.repo.rule_cfg['TOC_LIMIT']['params']
    hits = [i for i, n in content_nodes(ctx) if n.get('section') == p['section'] and n.get('variant') == p['variant']]
    if len(hits) > p['max']:
        ctx.add('TOC_LIMIT', f'nodes[{hits[p["max"]]}]', f'at most {p["max"]} {p["section"]} with-toc per page')


@rule('NO_ADJACENT_DUPLICATE')
def r_adjacent(ctx):
    if not _free_block_template(ctx):
        return
    exc = set()
    for e in ctx.repo.rule_cfg['NO_ADJACENT_DUPLICATE'].get('exceptions', []):
        exc.update(e.get('sections', []))
    prev = None
    for i, n in content_nodes(ctx):
        key = (n.get('section'), n.get('variant'))
        if prev and prev[1] == key and key[0] not in exc:
            ctx.add('NO_ADJACENT_DUPLICATE', f'nodes[{i}]', f'{key[0]} repeats back to back')
        prev = (i, key)


# ---------------------------------------------------------------- rules: routes and links
def route_family(path):
    """Parent path of a route ('/customers/x' -> '/customers', '/about-us' -> '')."""
    return path.rsplit('/', 1)[0]


def generated_route_ok(repo, tid, route):
    """A generated page may live at a built route bound to its template, or at an unbuilt route inside the template's route family
    (the same parent path as one of its built routes). A template with a single route has no family: only that route."""
    mine = [r['path'] for r in repo.routes if r.get('template') == tid]
    if route in mine:
        return True
    return len(mine) > 1 and route != '/' and route_family(route) in {route_family(m) for m in mine}


def effective_route(ctx):
    """The built route whose section restrictions apply: the page's own route when it is built, else the template's first (canonical) route."""
    route = ctx.spec.get('route')
    if route in ctx.repo.route_map or ctx.spec.get('mode') != 'generated':
        return route
    for r in ctx.repo.routes:
        if r.get('template') == ctx.spec.get('template'):
            return r['path']
    return route


@rule('ROUTE_BOUND_TO_TEMPLATE')
def r_route(ctx):
    route = ctx.spec.get('route')
    ent = ctx.repo.route_map.get(route)
    if ent is None:
        if ctx.spec.get('mode') == 'generated':
            if not generated_route_ok(ctx.repo, ctx.spec.get('template'), route):
                ctx.add('GENERATED_MODE_ROUTE', 'route', f'{route!r} is neither a built route of {ctx.spec.get("template")} nor inside its route family')
            return
        ctx.add('ROUTE_BOUND_TO_TEMPLATE', 'route', f'{route!r} is not one of the built routes')
        return
    if 'redirectTo' in ent:
        ctx.add('ROUTE_BOUND_TO_TEMPLATE', 'route', f'{route} is a redirect to {ent["redirectTo"]}; it has no template')
    elif ent.get('template') != ctx.spec.get('template'):
        ctx.add('ROUTE_BOUND_TO_TEMPLATE', 'route', f'{route} is assigned to {ent.get("template")}, not {ctx.spec.get("template")}')


@rule('SECTION_ROUTE_RESTRICTION')
def r_section_route(ctx):
    for i, n in enumerate(nodes_of(ctx)):
        sec = ctx.repo.sections.get(n.get('section'))
        if not sec:
            continue
        c = sec['constraints']
        eff = effective_route(ctx)
        if c.get('homeRouteOnly') and eff != '/':
            ctx.add('SECTION_ROUTE_RESTRICTION', f'nodes[{i}]', f'{n["section"]} is homepage-only')
        if c.get('routes') and eff not in c['routes']:
            ctx.add('SECTION_ROUTE_RESTRICTION', f'nodes[{i}]', f'{n["section"]} is only for {c["routes"]}')


def _walk_strings(v, path, out):
    if isinstance(v, str):
        out.append((path, v))
    elif isinstance(v, list):
        for i, x in enumerate(v):
            _walk_strings(x, f'{path}[{i}]', out)
    elif isinstance(v, dict):
        for k, x in v.items():
            _walk_strings(x, f'{path}.{k}' if path else k, out)


@rule('NO_EXTERNAL_URL')
def r_no_url(ctx):
    out = []
    _walk_strings(ctx.spec, '', out)
    gen = ctx.spec.get('mode') == 'generated'
    for path, s in out:
        if URL_RE.search(s):
            if gen and all(RESERVED_HOST_RE.search(url_host(u)) for u in ANY_URL_RE.findall(norm(s)) if URL_RE.search(u)):
                continue  # mode generated: placeholder URLs on reserved hosts (.example, .invalid, example.com/org/net) are the allowed kind
            ctx.add('NO_EXTERNAL_URL', path, f'absolute http(s) URL found: {s[:80]!r}')


def check_target(ctx, target, path):
    if not isinstance(target, str) or URL_RE.search(target):
        return
    base = re.split(r'[?#]', target)[0] or '/'
    for pre in ctx.repo.rule_cfg['LINK_RESOLVES_TO_ROUTE']['params']['forbiddenPrefixes']:
        if base.startswith(pre):
            ctx.add('LINK_RESOLVES_TO_ROUTE', path, f'{target} is a job detail page: not built, falls to the Pending page')
            return
    if not base.startswith('/') or base not in ctx.repo.route_map:
        ctx.add('LINK_RESOLVES_TO_ROUTE', path, f'{target} does not resolve to a built route')
        return
    if 'redirectTo' in ctx.repo.route_map[base]:
        ctx.add('LINK_TO_REDIRECT', path, f'{target} only redirects to {ctx.repo.route_map[base]["redirectTo"]}')


# ---------------------------------------------------------------- content walk (contract driven)
def pick_option(options, value):
    if not isinstance(value, dict):
        return None
    keys = set(value)
    for o in options:
        f = o['fields']
        req = {k for k, v in f.items() if v.get('required')}
        if keys <= set(f) and req <= keys:
            kind = f.get('kind')
            if kind and kind.get('type') == 'enum' and value.get('kind') not in kind['values']:
                continue
            return o
    return None


def walk_value(ctx, f, v, path, node_i):
    t = f['type']
    if t in ('text', 'cell'):
        if isinstance(v, str):
            n = words(v)
            if n > f['maxWords']:
                ctx.add('MAX_WORDS', path, f'{n} words exceeds the budget of {f["maxWords"]}')
            for m in MDLINK_RE.finditer(v):
                check_target(ctx, m.group(2), path)
    elif t == 'link' and isinstance(v, dict):
        lab = v.get('label')
        if isinstance(lab, str) and words(lab) > f['maxWords']:
            ctx.add('MAX_WORDS', f'{path}.label', f'{words(lab)} words exceeds the budget of {f["maxWords"]}')
        check_target(ctx, v.get('to'), f'{path}.to')
    elif t == 'route':
        check_target(ctx, v, path)
    elif t == 'list' and isinstance(v, list):
        for i, x in enumerate(v):
            walk_value(ctx, f['items'], x, f'{path}[{i}]', node_i)
    elif t == 'object' and isinstance(v, dict):
        walk_fields(ctx, f['fields'], v, path, node_i)
    elif t == 'asset' and isinstance(v, dict):
        role = v.get('assetRole')
        if ctx.spec.get('mode') == 'generated':
            av = PINNED_AVAILABILITY.get(role)
            if av != 'generation-safe':
                subs = PINNED_SUBSTITUTES.get(role, [])
                ctx.add('GENERATED_MODE_ASSET', f'{path}.assetRole', f'role {role!r} is {av or "unknown"} and cannot appear in a generated page' + (f' (use {subs})' if subs else ''))
            elif role not in generated_field_roles(f['allowedRoles']):
                ctx.add('GENERATED_MODE_ROLE', f'{path}.assetRole', f'role {role!r} is not a generation-safe role of this field (allowed in generated mode: {generated_field_roles(f["allowedRoles"])})')
        elif role not in f['allowedRoles']:
            ctx.add('ASSET_ROLE_ALLOWED', f'{path}.assetRole', f'role {role!r} is not allowed here (allowed: {f["allowedRoles"]})')
    elif t == 'oneOf':
        o = pick_option(f['options'], v)
        if o:
            walk_fields(ctx, o['fields'], v, path, node_i)


def walk_fields(ctx, fields, value, path, node_i):
    for k, v in value.items():
        if k in fields:
            walk_value(ctx, fields[k], v, f'{path}.{k}', node_i)


def count_at(content, path):
    cur = content
    for part in path.split('.'):
        if not isinstance(cur, dict) or part not in cur:
            return None
        cur = cur[part]
    return cur


@rule('MAX_WORDS')
def r_words(ctx):
    for i, n in enumerate(nodes_of(ctx)):
        sec = ctx.repo.sections.get(n.get('section'))
        if sec and isinstance(n.get('content'), dict):
            walk_fields(ctx, sec['content']['fields'], n['content'], f'nodes[{i}].content', i)


# the walk-driven rule ids below are emitted from walk_value / check_target above
for _rid in ('LINK_RESOLVES_TO_ROUTE', 'LINK_TO_REDIRECT', 'ASSET_ROLE_ALLOWED', 'GENERATED_MODE_ASSET', 'GENERATED_MODE_ROLE'):
    RULE_IMPLS[_rid] = r_words


@rule('VARIANT_RULES')
def r_variant(ctx):
    for i, n in enumerate(nodes_of(ctx)):
        sec = ctx.repo.sections.get(n.get('section'))
        c = n.get('content')
        if not sec or not isinstance(c, dict):
            continue
        for vr in sec.get('variantRules', []):
            if vr['variant'] != n.get('variant'):
                continue
            base = f'nodes[{i}].content'
            for fld in vr.get('forbidFields', []):
                if fld in c:
                    ctx.add('VARIANT_RULES', f'{base}.{fld}', f'{n["section"]}/{vr["variant"]} must not carry {fld}')
            for fld in vr.get('requireFields', []):
                if fld not in c:
                    ctx.add('VARIANT_RULES', base, f'{n["section"]}/{vr["variant"]} requires {fld}')
            if 'path' in vr:
                lst = c.get(vr['path'])
                if 'minItems' in vr and (not isinstance(lst, list) or len(lst) < vr['minItems']):
                    ctx.add('VARIANT_RULES', f'{base}.{vr["path"]}', f'{n["section"]}/{vr["variant"]} needs at least {vr["minItems"]} {vr["path"]}')
                for k, item in enumerate(lst if isinstance(lst, list) else []):
                    if not isinstance(item, dict):
                        continue
                    for fld in vr.get('requireItemFields', []):
                        if fld not in item:
                            ctx.add('VARIANT_RULES', f'{base}.{vr["path"]}[{k}]', f'{n["section"]}/{vr["variant"]} items require {fld}')
                    for fld in vr.get('forbidItemFields', []):
                        if fld in item:
                            ctx.add('VARIANT_RULES', f'{base}.{vr["path"]}[{k}].{fld}', f'{n["section"]}/{vr["variant"]} items must not carry {fld}')
                    if vr.get('forbidRowKinds') and item.get('kind') in vr['forbidRowKinds']:
                        ctx.add('VARIANT_RULES', f'{base}.{vr["path"]}[{k}]', f'{n["section"]}/{vr["variant"]} must not contain {item.get("kind")} rows')
            if vr.get('forbidRowKinds') and 'path' not in vr:
                for si, sect in enumerate(c.get('sections', []) if isinstance(c.get('sections'), list) else []):
                    for k, row in enumerate(sect.get('rows', []) if isinstance(sect, dict) else []):
                        if isinstance(row, dict) and row.get('kind') in vr['forbidRowKinds']:
                            ctx.add('VARIANT_RULES', f'{base}.sections[{si}].rows[{k}]', f'{n["section"]}/{vr["variant"]} must not contain {row.get("kind")} rows')


@rule('TEMPLATE_CONTENT_RULES')
def r_template_content(ctx):
    t = declared_template(ctx)
    if not t:
        return
    for i, n in enumerate(nodes_of(ctx)):
        c = n.get('content') if isinstance(n.get('content'), dict) else {}
        for tn in t['nodes']:
            if tnode_matches(tn, n) and tn.get('contentRules'):
                for fld in tn['contentRules'].get('forbidFields', []):
                    if fld in c:
                        ctx.add('TEMPLATE_CONTENT_RULES', f'nodes[{i}].content.{fld}', f'{t["id"]} forbids {fld} on {n["section"]}')
                for fld in tn['contentRules'].get('requireFields', []):
                    if fld not in c:
                        ctx.add('TEMPLATE_CONTENT_RULES', f'nodes[{i}].content', f'{t["id"]} requires {fld} on {n["section"]}')
                break


@rule('MOTION_PATTERN_ALLOWED')
def r_motion(ctx):
    for i, n in enumerate(nodes_of(ctx)):
        sec = ctx.repo.sections.get(n.get('section'))
        m = n.get('motion')
        if not sec or not isinstance(m, dict):
            continue
        pairs = {(p['pattern'], p['reducedMotionFallback']) for p in sec['motion']['patterns']}
        if (m.get('pattern'), m.get('reducedMotionFallback')) not in pairs:
            ctx.add('MOTION_PATTERN_ALLOWED', f'nodes[{i}].motion', f'({m.get("pattern")}, {m.get("reducedMotionFallback")}) is not allowed on {n["section"]}; allowed {sorted(pairs)}')


@rule('SCROLL_REVEAL_ONLY_PAGE_LINKS')
def r_reveal(ctx):
    for i, n in enumerate(nodes_of(ctx)):
        m = n.get('motion')
        if isinstance(m, dict) and 'reveal' in str(m.get('pattern', '')) and n.get('section') != 'shared.page-links':
            ctx.add('SCROLL_REVEAL_ONLY_PAGE_LINKS', f'nodes[{i}].motion', 'scroll reveals exist only on shared.page-links; none may be invented elsewhere')


@rule('SITE_WIDE_CHROME_CONTENT')
def r_sitewide(ctx):
    if ctx.spec.get('mode') == 'generated':
        return  # a generated page supplies its own chrome content (GENERATED_MODE_CHROME requires it)
    for i, n in enumerate(nodes_of(ctx)):
        sec = ctx.repo.sections.get(n.get('section'))
        if sec and sec['constraints'].get('siteWide') and n.get('content'):
            ctx.add('SITE_WIDE_CHROME_CONTENT', f'nodes[{i}].content', f'{n["section"]} is site-wide; omit page-level content')


# ---------------------------------------------------------------- rules: contract taxonomy (re-checked on every validation)
@rule('SEMANTIC_CATEGORY_CLOSED')
def r_semantic(ctx):
    """semantic.category is a closed class; conversion blocks are never filed as plain content, editorial collections never as FEATURES."""
    for sid, c in sorted(ctx.repo.sections.items()):
        sem = c.get('semantic')
        path = f'sections.{sid}.semantic'
        if not isinstance(sem, dict) or sem.get('category') not in SEMANTIC_CATEGORIES:
            ctx.add('SEMANTIC_CATEGORY_CLOSED', path, f'category {sem.get("category") if isinstance(sem, dict) else sem!r} is not one of {list(SEMANTIC_CATEGORIES)}')
            continue
        cat = sem['category']
        if FORM_ENDPOINT_ROLE in (c.get('assetRoles') or []) and cat not in FORM_OK_CATEGORIES:
            ctx.add('SEMANTIC_CATEGORY_CLOSED', path, f'{sid} carries a form endpoint but is classed {cat}; a conversion block must be CONVERSION (or a HERO or SHELL that embeds the form)')
        if cat == 'FEATURES' and EDITORIAL_NAME_RE.search(str(sem.get('id', ''))):
            ctx.add('SEMANTIC_CATEGORY_CLOSED', path, f'{sid} ({sem.get("id")}) is editorial or news content and must not be classed FEATURES')
        if not isinstance(c.get('source'), dict):
            ctx.add('SEMANTIC_CATEGORY_CLOSED', f'sections.{sid}.source', 'every contract needs a source object, distinct from semantic')


@rule('RETRIEVAL_ELIGIBILITY_PINNED')
def r_retrieval(ctx):
    """retrievalEligible is a closed boolean (default true). Layout-only utility and runtime UI are pinned to false with a reason of 30+ characters."""
    for sid, c in sorted(ctx.repo.sections.items()):
        path = f'sections.{sid}.retrievalEligible'
        elig = c.get('retrievalEligible', True)
        reason = c.get('retrievalIneligibleReason')
        pinned = sid in RETRIEVAL_INELIGIBLE_PINNED
        runtime_ui = bool(RUNTIME_UI_NAME_RE.search(f'{sid} {c.get("title", "")}'))
        if not isinstance(elig, bool):
            ctx.add('RETRIEVAL_ELIGIBILITY_PINNED', path, f'must be a boolean, got {elig!r}')
            continue
        if (pinned or runtime_ui) and elig is not False:
            ctx.add('RETRIEVAL_ELIGIBILITY_PINNED', path, f'{sid} is utility or runtime UI and must be retrievalEligible false')
        if runtime_ui and not pinned:
            ctx.add('RETRIEVAL_ELIGIBILITY_PINNED', path, f'{sid} looks like runtime UI (cookie, consent, modal, dialog, overlay) but is not in the pinned list of schema/semantic_validate.py')
        if elig is False and not pinned and not runtime_ui:
            ctx.add('RETRIEVAL_ELIGIBILITY_PINNED', path, f'{sid} is marked retrievalEligible false but is not in the pinned list; false is reserved for utility and runtime UI')
        if elig is False and (not isinstance(reason, str) or len(reason.strip()) < 30):
            ctx.add('RETRIEVAL_ELIGIBILITY_PINNED', f'sections.{sid}.retrievalIneligibleReason', 'a retrievalEligible false section needs a reason of at least 30 characters')
        if elig is True and reason is not None:
            ctx.add('RETRIEVAL_ELIGIBILITY_PINNED', f'sections.{sid}.retrievalIneligibleReason', 'a reason is only allowed when retrievalEligible is false')


@rule('ASSET_AVAILABILITY_PINNED')
def r_availability(ctx):
    """Always on: the registry's availability and substitutes equal the table pinned in this file, and every section's generatedAssetRoles equals
    what that table derives. Editing assets/asset-roles.json or a contract alone cannot make a protected role usable in a generated page."""
    for rid, path, msg in ctx.repo.availability_findings():
        ctx.add(rid, path, msg)


RULE_IMPLS['GENERATED_ROLES_DERIVED'] = r_availability


def _walk_text(v, path, out, key=None):
    """(path, string) for every rendered string of a spec; values under STRUCTURAL_KEYS (ids and enum members) are skipped."""
    if isinstance(v, str):
        if key not in STRUCTURAL_KEYS:
            out.append((path, v))
    elif isinstance(v, list):
        for i, x in enumerate(v):
            _walk_text(x, f'{path}[{i}]', out, key)
    elif isinstance(v, dict):
        for k, x in v.items():
            _walk_text(x, f'{path}.{k}' if path else k, out, k)


@rule('GENERATED_MODE_BRAND')
def r_generated(ctx):
    """mode generated: nothing of the source may appear. One finding per (string, rule); see the module docstring for the rule list."""
    if ctx.spec.get('mode') != 'generated':
        return
    repo = ctx.repo
    pats = repo.source_patterns()
    for cat in REQUIRED_SOURCE_CATEGORIES:
        if not pats.get(cat):
            ctx.add('GENERATED_MODE_PATTERNS_MISSING', f'assets/asset-roles.json sourceBrand.categories.{cat}', f'no usable {cat} patterns: {SOURCE_CATEGORY_RULE[cat]} cannot be enforced (failing closed)')
    if not repo.shingles():
        ctx.add('GENERATED_MODE_PATTERNS_MISSING', 'assets/source-copy-hashes.json', 'no source copy shingles: GENERATED_MODE_COPY cannot be enforced (failing closed)')
    texts = []
    _walk_text(ctx.spec, '', texts)
    for path, raw in texts:
        text = norm(raw)
        if not text:
            continue
        for cat, rid in SOURCE_CATEGORY_RULE.items():
            if path == 'route' and cat in WARN_ONLY_CATEGORIES:
                continue  # a single-route template admits only its own built route (e.g. /climate-leads): programme names there only warn in text
            for pid, rx in pats.get(cat, []):
                m = rx.search(text)
                if m:
                    ctx.add(rid, path, f'{m.group(0)!r} matches the source pattern {pid!r}; a generated page is a different brand with its own copy')
                    break
        if text.startswith('/'):
            amb = {x.lower() for x in (repo.assets.get('sourceBrand') or {}).get('ambiguousEnglishWordNames', [])}
            hit = amb & {t for t in re.split(r'[/\-_?=&#.]+', text.lower()) if t}
            if hit:
                ctx.add('GENERATED_MODE_CUSTOMER', path, f'{sorted(hit)} is a real customer of the source that is also an English word (not matched in prose, but not allowed in a route or link target)')
        for u in ANY_URL_RE.findall(text):
            host = url_host(u)
            if not host or not RESERVED_HOST_RE.search(host):
                ctx.add('GENERATED_MODE_EXTERNAL_URL', path, f'absolute URL host {host!r} is not a reserved placeholder domain (*.example, *.invalid, example.com, example.org, example.net)')
        w = norm_words(text)
        sh = repo.shingles()
        for i in range(len(w) - SHINGLE_WORDS + 1):
            if shingle_hash(w[i:i + SHINGLE_WORDS]) in sh:
                ctx.add('GENERATED_MODE_COPY', path, f'reproduces source copy (a run of {SHINGLE_WORDS} identical words near {" ".join(w[i:i + SHINGLE_WORDS])!r}); write original copy')
                break
    for i, n in enumerate(nodes_of(ctx)):
        need = GENERATED_CHROME_FIELDS.get(n.get('section'))
        if not need:
            continue
        c = n.get('content') if isinstance(n.get('content'), dict) else {}
        for fld in need:
            if not c.get(fld):
                ctx.add('GENERATED_MODE_CHROME', f'nodes[{i}].content', f'{n["section"]} of a generated page must carry its own {fld}; without it the clone\'s navigation, footer or promo copy would render')


for _rid in GENERATED_RULES:
    RULE_IMPLS.setdefault(_rid, r_generated)


RULE_IDS = set(RULE_IMPLS)


# ---------------------------------------------------------------- public API
def schema_errors(spec, repo=None):
    try:
        from jsonschema import Draft7Validator
    except ImportError:
        raise SystemExit('jsonschema is required: pip install jsonschema')
    repo = repo or get_repo()
    v = Draft7Validator(repo.schema)
    out = []
    for e in sorted(v.iter_errors(spec), key=lambda e: list(e.absolute_path)):
        out.append('/'.join(str(p) for p in e.absolute_path) + ': ' + e.message[:300])
    return out


def semantic_findings(spec, repo=None):
    repo = repo or get_repo()
    ctx = Ctx(spec, repo)
    ran = set()
    for rid, fn in RULE_IMPLS.items():
        if fn in ran:
            continue
        ran.add(fn)
        if isinstance(spec, dict):
            fn(ctx)
    return ctx.findings


def validate(spec, repo=None):
    repo = repo or get_repo()
    se = schema_errors(spec, repo)
    fi = semantic_findings(spec, repo) if isinstance(spec, dict) else []
    return {'schemaErrors': se, 'findings': fi, 'errors': len(se) + sum(1 for f in fi if f['severity'] == 'error'), 'warnings': sum(1 for f in fi if f['severity'] == 'warn')}


def main(argv):
    path = argv[1] if len(argv) > 1 else os.path.join(HERE, 'example.pagespec.json')
    with open(path, encoding='utf-8') as f:
        spec = json.load(f)
    res = validate(spec)
    for e in res['schemaErrors']:
        print('SCHEMA ERROR', e)
    for f_ in res['findings']:
        print(f'{f_["severity"].upper():5} {f_["rule"]} {f_["path"]}: {f_["message"]}')
    print(f'{os.path.basename(path)}: schema errors {len(res["schemaErrors"])}, errors {res["errors"]}, warnings {res["warnings"]}')
    return 1 if res['errors'] else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv))
