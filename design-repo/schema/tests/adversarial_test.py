#!/usr/bin/env python3
"""Adversarial suite: proves every rule rejects a bad instance, and that every control passes.

* CONTROLS: one auto-synthesised valid PageSpec per template (loops over templates.values())
  plus the bundled example. Each must produce zero schema errors and zero error-severity findings.
* MUTATIONS: each mutates a valid spec (or the registry for registry-level cases) so that exactly
  one thing is wrong, and the suite asserts the expected rule (or SCHEMA) fires.
* WARN cases must raise a warn-severity finding and no error.

Run:  python3 schema/tests/adversarial_test.py          (needs `pip install jsonschema`)
Exit status 0 only when every mutation is rejected and every control passes.
"""
import copy
import importlib.util
import json
import os
import shutil
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.join(ROOT, 'schema'))
import semantic_validate as sv  # noqa: E402


def load_verify(root):
    spec = importlib.util.spec_from_file_location('verify_all_mod', os.path.join(root, 'extraction', 'verify_all.py'))
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m


# ------------------------------------------------------------------ synthesis
def gen(f):
    t = f['type']
    if t in ('text', 'cell'):
        return ' '.join(['Sample'] * max(1, min(2, f['maxWords'])))
    if t == 'enum':
        return f['values'][0]
    if t == 'boolean':
        return True
    if t in ('integer', 'number'):
        return f.get('minimum', 1)
    if t == 'route':
        return '/demo'
    if t == 'link':
        return {'label': 'Sample', 'to': '/demo'}
    if t == 'object':
        return gen_obj(f['fields'])
    if t == 'list':
        n = max(f.get('minItems', 0), 1 if f.get('required') else 0)
        if 'maxItems' in f:
            n = min(n, f['maxItems'])
        return [gen(f['items']) for _ in range(n)]
    if t == 'asset':
        d = {'assetRole': f['allowedRoles'][0]}
        if f.get('altText', True):
            d['alt'] = 'Sample description'
        return d
    if t == 'oneOf':
        o = f['options'][0]
        return gen_obj(o['fields'])
    raise ValueError(t)


def gen_obj(fields):
    return {k: gen(v) for k, v in fields.items() if v.get('required')}


def synth_content(sec, variant, rules):
    fields = sec['content']['fields']
    c = gen_obj(fields)
    for vr in sec.get('variantRules', []):
        if vr['variant'] != variant:
            continue
        for fld in vr.get('requireFields', []):
            c[fld] = gen(fields[fld])
        if 'path' in vr and vr.get('minItems'):
            f = dict(fields[vr['path']])
            f['minItems'] = max(f.get('minItems', 0), vr['minItems'])
            f['required'] = True
            c[vr['path']] = gen(f)
        if 'path' in vr and vr.get('requireItemFields'):
            items = c.get(vr['path']) or gen({**fields[vr['path']], 'required': True})
            for it in items:
                for fld in vr['requireItemFields']:
                    it[fld] = gen(fields[vr['path']]['items']['fields'][fld])
            c[vr['path']] = items
    for fld in (rules or {}).get('requireFields', []):
        c[fld] = gen(fields[fld])
    for vr in sec.get('variantRules', []):
        if vr['variant'] == variant:
            for fld in vr.get('forbidFields', []):
                c.pop(fld, None)
    return c


FREE_PICKS = {
    'template.product-block-page': [('block.Hero', None), ('block.TextWithImage', None), ('block.Faq', None)],
    'template.compare-block-page': [('block.HeroCompete', 'stat-tiles'), ('block.Logos', 'small'), ('block.Faq', None)],
    'template.company-block-page': [('block.Hero', None), ('block.Faq', None)],
}


def make_node(repo, section, variant, rules=None):
    sec = repo.sections[section]
    node = {'section': section, 'content': {} if sec['constraints'].get('siteWide') else synth_content(sec, variant, rules),
            'motion': {'pattern': sec['motion']['patterns'][0]['pattern'], 'reducedMotionFallback': sec['motion']['patterns'][0]['reducedMotionFallback']}}
    if variant:
        node['variant'] = variant
    return node


def synth(repo, tid):
    t = repo.templates[tid]
    route = next(r['path'] for r in repo.routes if r.get('template') == tid)
    nodes = []
    if t['orderMode'] == 'free':
        picks = FREE_PICKS[tid]
        for tn in t['nodes']:
            if tn['section'].startswith('chrome.') and tn['section'] != 'chrome.footer':
                nodes.append(make_node(repo, tn['section'], tn.get('variant')))
        for s, v in picks:
            nodes.append(make_node(repo, s, v))
        for tn in t['nodes']:
            if tn['section'] == 'chrome.footer':
                nodes.append(make_node(repo, tn['section'], tn.get('variant')))
    else:
        for tn in t['nodes']:
            if not tn.get('required'):
                continue
            variant = tn.get('variant') or (tn['variants'][0] if tn.get('variants') else None)
            if variant is None and repo.sections[tn['section']].get('variantRequired'):
                variant = repo.sections[tn['section']]['variants'][0]['id']
            nodes.append(make_node(repo, tn['section'], variant, tn.get('contentRules')))
    return {'pageSpecVersion': '1.0.0', 'route': route, 'template': tid, 'nodes': nodes}


def find(spec, section, nth=0):
    hits = [n for n in spec['nodes'] if n['section'] == section]
    return hits[nth]


def idx(spec, section):
    return next(i for i, n in enumerate(spec['nodes']) if n['section'] == section)


# ------------------------------------------------------------------ mutations
def build_cases(repo, example, ctl):
    C = []  # (name, kind, expected marker, spec_factory)

    def add(name, expect, base, fn, kind='reject'):
        C.append((name, kind, expect, lambda: fn(copy.deepcopy(base))))

    def m_enum_template(s): s['template'] = 'template.nonexistent'; return s
    add('wrong enum: template id', 'SCHEMA', example, m_enum_template)

    def m_enum_variant(s): find(s, 'chrome.nav')['variant'] = 'sticky'; return s
    add('wrong enum: node variant', 'SCHEMA', example, m_enum_variant)

    def m_missing_required(s): del find(s, 'shared.post-hero')['content']['title']; return s
    add('missing required field', 'SCHEMA', example, m_missing_required)

    def m_alias(s): find(s, 'shared.post-hero')['section'] = 'shared.postHero'; return s
    add('invented type alias', 'SCHEMA', example, m_alias)

    def m_no_fallback(s): del find(s, 'shared.post-hero')['motion']['reducedMotionFallback']; return s
    add('missing reducedMotionFallback', 'SCHEMA', example, m_no_fallback)

    def m_motion_field(s): find(s, 'shared.post-hero')['motion']['parallaxDepth'] = 0.3; return s
    add('invented motion field', 'SCHEMA', example, m_motion_field)

    def m_content_field(s): find(s, 'shared.post-hero')['content']['badge'] = 'New'; return s
    add('invented content field', 'SCHEMA', example, m_content_field)

    def m_dup(s): s['nodes'].insert(idx(s, 'shared.post-hero') + 1, copy.deepcopy(find(s, 'shared.post-hero'))); return s
    add('duplicate one-per-page section', 'MAX_OCCURRENCES', example, m_dup)

    def m_dup_chrome(s): s['nodes'].insert(1, copy.deepcopy(find(s, 'chrome.nav'))); return s
    add('duplicate nav node', 'MAX_OCCURRENCES', example, m_dup_chrome)

    def m_remove(s): s['nodes'].pop(idx(s, 'shared.post-hero')); return s
    add('removed mandatory section', 'REQUIRED_NODES_PRESENT', example, m_remove)

    def m_reorder(s):
        a, b = idx(s, 'shared.article-body'), idx(s, 'shared.newsletter-band')
        s['nodes'][a], s['nodes'][b] = s['nodes'][b], s['nodes'][a]; return s
    add('reordered fixed-position section', 'NODE_ORDER_FIXED', example, m_reorder)

    def m_footer_first(s): s['nodes'].insert(0, s['nodes'].pop()); return s
    add('footer moved to the front', 'CHROME_POSITION', example, m_footer_first)

    def m_variant_mismatch(s): s['template'] = 'template.blog-post-toc'; s['route'] = next(r['path'] for r in repo.routes if r.get('template') == 'template.blog-post-toc'); return s
    add('template/node mismatch: plain article under the TOC template', 'NODE_IN_TEMPLATE', example, m_variant_mismatch)

    home = ctl['template.home']
    def m_nodes_of_other(s): s['template'] = 'template.lp'; s['route'] = '/lp/why-watershed-platform'; return s
    add('template/node mismatch: homepage nodes declared as the LP template', 'NODE_IN_TEMPLATE', home, m_nodes_of_other)

    def m_words(s): find(s, 'shared.post-hero')['content']['title'] = ' '.join(['word'] * 40); return s
    add('maxWords overflow', 'MAX_WORDS', example, m_words)

    def m_words_link(s): find(s, 'shared.post-hero')['content']['breadcrumbs'][0]['label'] = 'one two three four five six'; return s
    add('maxWords overflow on a link label', 'MAX_WORDS', example, m_words_link)

    def m_role(s): find(s, 'shared.post-hero')['content']['image']['assetRole'] = 'photo.real-employee'; return s
    add('invented assetRole', 'SCHEMA', example, m_role)

    def m_role_valid_wrong(s): find(s, 'shared.related-content')['content']['items'][0]['image']['assetRole'] = 'photo.person'; return s
    add('valid assetRole not allowed in this field (people photo as a card image)', 'ASSET_ROLE_ALLOWED', example, m_role_valid_wrong)

    lp = ctl['template.lp']
    def m_logo_role(s): find(s, 'block.Logos')['content']['logoSet']['assetRole'] = 'photo.environment'; return s
    add('pinned logo field changed to a different valid role', 'ASSET_ROLE_ALLOWED', lp, m_logo_role)

    def m_form_role(s): find(s, 'shared.newsletter-band')['content']['formEndpoint']['assetRole'] = 'artboard.product-ui'; return s
    add('form endpoint changed to a different valid role', 'ASSET_ROLE_ALLOWED', example, m_form_role)

    def m_tone(s): find(s, 'shared.post-hero')['content']['image']['tone'] = 'neon'; return s
    add('invented media tone', 'SCHEMA', example, m_tone)

    def m_ext(s): find(s, 'shared.post-hero')['content']['breadcrumbs'][0]['to'] = 'https://example.org/blog'; return s
    add('external http(s) link in a link field', 'NO_EXTERNAL_URL', example, m_ext)

    def m_ext_md(s):
        find(s, 'shared.article-body')['content']['blocks'][0]['text'] = 'Read the [report](https://example.org/report) first.'; return s
    add('external http(s) link inside text markup', 'NO_EXTERNAL_URL', example, m_ext_md)

    def m_careers(s): find(s, 'shared.post-hero')['content']['breadcrumbs'][0]['to'] = '/careers/123-staff-engineer'; return s
    add('link to an unbuilt route (/careers/<id>)', 'LINK_RESOLVES_TO_ROUTE', example, m_careers)

    def m_unknown(s): find(s, 'shared.post-hero')['content']['breadcrumbs'][0]['to'] = '/blog/does-not-exist'; return s
    add('link to a route that does not exist', 'LINK_RESOLVES_TO_ROUTE', example, m_unknown)

    def m_wrong_template(s): s['route'] = '/customers/canva'; return s
    add('route assigned to the wrong template', 'ROUTE_BOUND_TO_TEMPLATE', example, m_wrong_template)

    def m_redirect_route(s): s['route'] = '/data-portal-terms'; return s
    add('redirect route used as a page route', 'ROUTE_BOUND_TO_TEMPLATE', example, m_redirect_route)

    def m_lp_nav(s): s['nodes'].insert(1, make_node(repo, 'chrome.nav', 'opaque')); return s
    add('chrome rule: an /lp/* page with a nav', 'CHROME_MATCHES_TEMPLATE', lp, m_lp_nav)

    def m_lp_footer(s): s['nodes'].append(make_node(repo, 'chrome.footer', 'default')); return s
    add('chrome rule: an /lp/* page with a footer', 'CHROME_MATCHES_TEMPLATE', lp, m_lp_footer)

    def m_nav_variant(s): find(s, 'chrome.nav')['variant'] = 'opaque'; return s
    add('chrome rule: opaque nav on a translucent-nav template', 'CHROME_MATCHES_TEMPLATE', example, m_nav_variant)

    manifesto = ctl['template.manifesto']
    def m_footer_variant(s): find(s, 'chrome.footer')['variant'] = 'default'; return s
    add('chrome rule: default footer on /climate-economy (short footer only)', 'CHROME_MATCHES_TEMPLATE', manifesto, m_footer_variant)

    def m_reveal(s): find(s, 'shared.post-hero')['motion'] = {'pattern': 'scroll-reveal-fade-up', 'reducedMotionFallback': 'transition-removed'}; return s
    add('invented scroll-reveal pattern', 'SCHEMA', example, m_reveal)

    def m_reveal2(s): find(s, 'shared.post-hero')['motion'] = {'pattern': 'scroll-reveal-two-way', 'reducedMotionFallback': 'transition-unchanged'}; return s
    add('real scroll-reveal pattern on a section that does not own it', 'SCROLL_REVEAL_ONLY_PAGE_LINKS', example, m_reveal2)

    def m_parallax(s): find(s, 'shared.post-hero')['motion'] = {'pattern': 'parallax', 'reducedMotionFallback': 'animation-stopped'}; return s
    add('invented parallax pattern', 'SCHEMA', example, m_parallax)

    home_s = ctl['template.home']
    def m_fallback_lie(s): find(s, 'home.product-overview')['motion'] = {'pattern': 'step-countdown-autoplay', 'reducedMotionFallback': 'static-first-frame'}; return s
    add('motion fallback that misstates real behaviour (autoplay does not stop)', 'MOTION_PATTERN_ALLOWED', home_s, m_fallback_lie)

    def m_home_route(s): s['route'] = '/platform'; return s
    add('homepage template bound to a non-home route', 'ROUTE_BOUND_TO_TEMPLATE', home_s, m_home_route)

    prod = ctl['template.product-block-page']
    def m_two_heroes(s): s['nodes'].insert(2, make_node(repo, 'block.CenteredAgent', None)); return s
    add('two hero-category blocks on a block page', 'ONE_HERO', prod, m_two_heroes)

    def m_seven_twi(s):
        for _ in range(7): s['nodes'].insert(idx(s, 'chrome.footer'), make_node(repo, 'block.TextWithImage', None))
        return s
    add('block repeated beyond its observed maximum', 'MAX_OCCURRENCES', prod, m_seven_twi)

    def m_two_toc(s):
        for _ in range(2): s['nodes'].insert(idx(s, 'chrome.footer'), make_node(repo, 'block.SectionTextBlock', 'with-toc'))
        return s
    add('two with-toc text blocks on one page', 'TOC_LIMIT', prod, m_two_toc)

    def m_grid_variant(s):
        n = make_node(repo, 'block.Grid', 'two-up-numbered')
        n['content']['items'][0]['image'] = {'assetRole': 'photo.business-setting', 'alt': 'Sample'}
        s['nodes'].insert(idx(s, 'chrome.footer'), n); return s
    add('variant rule: numbered grid items may not carry an image', 'VARIANT_RULES', prod, m_grid_variant)

    def m_pov(s):
        n = make_node(repo, 'block.ProductOverview', 'dark-default'); n['content'] = {'title': 'Sample'}
        s['nodes'].insert(idx(s, 'chrome.footer'), n); return s
    add('variant rule: dark-default product overview must have no authored content', 'VARIANT_RULES', prod, m_pov)

    comp = ctl['template.compare-block-page']
    def m_compare_last(s): s['nodes'].insert(idx(s, 'chrome.footer'), make_node(repo, 'block.StatsRuled', None)); return s
    add('compare page not closed by the FAQ', 'COMPARE_FIRST_LAST', comp, m_compare_last)

    editorial = ctl['template.customer-story-editorial']
    def m_topics(s):
        find(s, 'shared.article-body')['content']['topics'] = [{'label': 'Policy', 'to': '/blog', 'dot': 'policy'}]; return s
    add('template content rule: editorial customer story may not carry topics', 'TEMPLATE_CONTENT_RULES', editorial, m_topics)

    tours = ctl['template.product-tour-index']
    def m_tours(s): del find(s, 'shared.hero-with-form')['content']['toursList']; return s
    add('template content rule: tours index requires the tours list', 'TEMPLATE_CONTENT_RULES', tours, m_tours)

    gated = ctl['template.event-gated']
    def m_event_logistics(s): del find(s, 'gated.landing-band')['content']['logistics']; return s
    add('variant rule: event landing requires logistics', 'VARIANT_RULES', gated, m_event_logistics)

    # --- warn-only cases
    def w_redirect_link(s): find(s, 'shared.post-hero')['content']['breadcrumbs'][0]['to'] = '/solutions/consumer-goods'; return s
    add('link to a redirect-only route', 'LINK_TO_REDIRECT', example, w_redirect_link, 'warn')

    def w_hero_not_first(s):
        s['nodes'].insert(2, s['nodes'].pop(3)); return s
    add('hero not first on a block page', 'HERO_FIRST', prod, w_hero_not_first, 'warn')

    def w_adjacent(s):
        for _ in range(2):
            s['nodes'].insert(idx(s, 'chrome.footer'), make_node(repo, 'block.ContentGrid', None))
        return s
    add('same block repeated back to back', 'NO_ADJACENT_DUPLICATE', prod, w_adjacent, 'warn')

    def w_sitewide(s): find(s, 'chrome.promo-bar')['content'] = {'offers': [{'badge': 'New', 'text': 'Hello', 'link': {'label': 'Go', 'to': '/demo'}}]}; return s
    add('page-level content on a site-wide chrome section', 'SITE_WIDE_CHROME_CONTENT', example, w_sitewide, 'warn')
    return C


def registry_cases():
    """(name, mutate(root) callable, verify check name) run on a scratch copy of the repo."""
    def asset_policy(root, role, new):
        p = os.path.join(root, 'assets', 'asset-roles.json')
        d = json.load(open(p))
        for r in d['roles']:
            if r['id'] == role:
                r['generationPolicy'] = new
        json.dump(d, open(p, 'w'), indent=2)

    return [
        ('pinned policy: customer logos changed to may-generate-new (valid but wrong)', lambda root: asset_policy(root, 'logo.customer-placeholder', 'may-generate-new'), 'check_asset_roles'),
        ('pinned policy: person photos changed to may-generate-new', lambda root: asset_policy(root, 'photo.person', 'may-generate-new'), 'check_asset_roles'),
        ('pinned policy: form endpoint changed to may-generate-new', lambda root: asset_policy(root, 'form.endpoint-placeholder', 'may-generate-new'), 'check_asset_roles'),
        ('pinned policy: brand wordmark changed to placeholder-only', lambda root: asset_policy(root, 'brand.wordmark-placeholder', 'placeholder-only'), 'check_asset_roles'),
        ('policy value outside the closed enum', lambda root: asset_policy(root, 'photo.environment', 'free-for-all'), 'check_asset_roles'),
        ('route reassigned to the wrong template in routes.json', lambda root: _reassign(root), 'check_routes'),
    ]


def _reassign(root):
    p = os.path.join(root, 'templates', 'routes.json')
    d = json.load(open(p))
    for r in d['routes']:
        if r['path'] == '/customers/canva':
            r['template'] = 'template.blog-post'
    json.dump(d, open(p, 'w'), indent=2)


def count_cases(root=None):
    """(mutations, controls) without running them; used by verify_all to recompute the manifest counts."""
    repo = sv.Repo(root) if root else sv.Repo()
    base = root or ROOT
    example = json.load(open(os.path.join(base, 'schema', 'example.pagespec.json')))
    ctl = {tid: synth(repo, tid) for tid in repo.templates}
    return len(build_cases(repo, example, ctl)) + len(registry_cases()), 1 + len(ctl)


def main():
    repo = sv.Repo()
    example = json.load(open(os.path.join(ROOT, 'schema', 'example.pagespec.json')))
    ctl = {tid: synth(repo, tid) for tid in repo.templates}
    fails = []
    # controls
    ok = 0
    controls = [('example.pagespec.json', example)] + [(tid, s) for tid, s in ctl.items()]
    for name, spec in controls:
        res = sv.validate(spec, repo)
        if res['errors']:
            fails.append(f'CONTROL FAILED {name}: ' + '; '.join(res['schemaErrors'][:2] + [f"{f['rule']} {f['message']}" for f in res['findings'] if f['severity'] == 'error'][:2]))
        else:
            ok += 1
    # mutations
    cases = build_cases(repo, example, ctl)
    rejected = 0
    for name, kind, expect, factory in cases:
        res = sv.validate(factory(), repo)
        rules = {f['rule'] for f in res['findings']}
        if kind == 'reject':
            hit = (expect == 'SCHEMA' and res['schemaErrors']) or (expect != 'SCHEMA' and any(f['rule'] == expect and f['severity'] == 'error' for f in res['findings']))
            if res['errors'] and hit:
                rejected += 1
            else:
                fails.append(f'NOT REJECTED ({expect}): {name}; got schema {len(res["schemaErrors"])} rules {sorted(rules)}')
        else:
            warn = any(f['rule'] == expect and f['severity'] == 'warn' for f in res['findings'])
            if warn and res['errors'] == 0:
                rejected += 1
            else:
                fails.append(f'WARN CASE FAILED ({expect}): {name}; errors {res["errors"]} rules {sorted(rules)}')
    # registry-level
    vmod = load_verify(ROOT)
    reg = registry_cases()
    for name, mutate, check in reg:
        tmp = tempfile.mkdtemp(prefix='dr_adv_')
        try:
            dst = os.path.join(tmp, 'design-repo')
            shutil.copytree(ROOT, dst, ignore=shutil.ignore_patterns('__pycache__', '*.zip'))
            mutate(dst)
            failures, _w = getattr(vmod, check)(dst)
            if failures:
                rejected += 1
            else:
                fails.append(f'REGISTRY MUTATION NOT REJECTED: {name}')
        finally:
            shutil.rmtree(tmp, ignore_errors=True)
    total = len(cases) + len(reg)
    for f in fails:
        print('FAIL', f)
    print(f'controls passed: {ok}/{len(controls)} (1 example + {len(ctl)} templates)')
    n_warn = sum(1 for c in cases if c[1] == 'warn')
    print(f'mutations rejected: {rejected}/{total} ({len(cases) - n_warn} spec reject, {n_warn} spec warn-only, {len(reg)} registry)')
    return 0 if not fails else 1


if __name__ == '__main__':
    sys.exit(main())
