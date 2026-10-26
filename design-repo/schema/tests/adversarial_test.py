#!/usr/bin/env python3
"""Adversarial suite: proves every rule rejects a bad instance, and that every control passes.

* CONTROLS: one auto-synthesised valid PageSpec per template in mode "reference" (loops over templates.values()), one mode "generated"
  example per template (schema/examples/generated.*.pagespec.json, built by schema/build_generated_examples.py), the bundled reference
  example, and explicit pass cases (real source content is fine in reference mode; a reserved placeholder URL is fine in generated mode).
  Each must produce zero schema errors and zero error-severity findings.
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
import build_generated_examples as bg  # noqa: E402


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
    return {'pageSpecVersion': '2.0.0', 'mode': 'reference', 'route': route, 'template': tid, 'nodes': nodes}


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

    def m_two_heroes_fixed(s):
        s['nodes'].insert(idx(s, 'home.hero') + 1, copy.deepcopy(find(s, 'home.hero'))); return s
    add('two HERO-class sections on a fixed template page (homepage)', 'ONE_HERO', home, m_two_heroes_fixed)

    def m_wrapper_back(s): find(s, 'shared.article-body')['section'] = 'legal.document'; return s
    add('retired whole-page wrapper id (legal.document) is no longer a section', 'SCHEMA', example, m_wrapper_back)

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


# ------------------------------------------------------------------ generation context (mode "generated")
def find_asset(spec, role):
    """First asset dict carrying `role` anywhere in the spec."""
    def walk(o):
        if isinstance(o, dict):
            if o.get('assetRole') == role:
                return o
            for v in o.values():
                r = walk(v)
                if r:
                    return r
        elif isinstance(o, list):
            for v in o:
                r = walk(v)
                if r:
                    return r
        return None
    return walk(spec)


def asset_host(gen, role):
    """(template id, spec) of the first generated example that carries `role` (every role used below must occur in the shipped examples)."""
    for tid in sorted(gen):
        if find_asset(gen[tid], role):
            return tid, gen[tid]
    raise SystemExit(f'no generated example carries role {role}')


def load_generated(repo, base=None):
    """{template id: spec} read from schema/examples/generated.*.pagespec.json (the shipped generation-safe examples)."""
    base = base or ROOT
    out = {}
    for fn in sorted(os.listdir(os.path.join(base, 'schema', 'examples'))):
        if fn.startswith('generated.') and fn.endswith('.pagespec.json'):
            spec = json.load(open(os.path.join(base, 'schema', 'examples', fn), encoding='utf-8'))
            out[spec['template']] = spec
    return out


def canary_of():
    """One plain-text fragment of the source copy (assets/asset-roles.json sourceBrand.copy.canaries)."""
    return json.load(open(os.path.join(ROOT, 'assets', 'asset-roles.json'), encoding='utf-8'))['sourceBrand']['copy']['canaries'][0]


def generated_cases(repo, gen, example, canary):
    G = []  # (name, kind, expected, factory)  kind: reject | warn | pass

    def add(name, expect, base, fn, kind='reject'):
        G.append((name, kind, expect, lambda: fn(copy.deepcopy(base))))

    blog = gen['template.blog-post']

    def body(s, text): find(s, 'shared.article-body')['content']['blocks'][0]['text'] = text; return s
    def title(s, text): find(s, 'shared.post-hero')['content']['title'] = text; return s

    # --- mode itself
    def m_no_mode(s): del s['mode']; return s
    add('mode: missing', 'SCHEMA', blog, m_no_mode)
    def m_bad_mode(s): s['mode'] = 'Generated'; return s
    add('mode: value outside the closed enum (Generated)', 'SCHEMA', blog, m_bad_mode)
    def m_purpose_mode(s): s['mode'] = 'draft'; return s
    add('mode: invented value (draft)', 'SCHEMA', blog, m_purpose_mode)
    def m_relabel(s): s['mode'] = 'generated'; return s
    add('mode: the reference example relabelled generated (nav, footer and promo carry no own content)', 'GENERATED_MODE_CHROME', example, m_relabel)
    # --- brand and logo leakage
    add('brand: source name in a heading', 'GENERATED_MODE_BRAND', blog, lambda s: title(s, 'Why Watershed keeps notes'))
    add('brand: clone stand-in brand in body copy', 'GENERATED_MODE_BRAND', blog, lambda s: body(s, 'Northwind keeps notes for every team.'))
    add('brand: full-width spelling (NFKC) of the source name', 'GENERATED_MODE_BRAND', blog, lambda s: title(s, '\uff57\uff41\uff54\uff45\uff52\uff53\uff48\uff45\uff44 notes'))
    add('brand: zero-width character inside the source name', 'GENERATED_MODE_BRAND', blog, lambda s: title(s, 'Water\u200bshed notes for teams'))
    add('brand: spaced spelling of the source name', 'GENERATED_MODE_BRAND', blog, lambda s: title(s, 'Water shed notes for teams'))
    def m_brand_nav(s): find(s, 'chrome.nav')['content']['brandName'] = 'Northwind'; return s
    add('brand: source brand as the generated page brand name in the nav', 'GENERATED_MODE_BRAND', blog, m_brand_nav)
    def m_brand_alt(s): find(s, 'shared.post-hero')['content']['image']['alt'] = 'Watershed team photo'; return s
    add('brand: source name in image alt text', 'GENERATED_MODE_BRAND', blog, m_brand_alt)
    def m_brand_route(s): s['route'] = '/blog/watershed-update'; return s
    add('brand: source name in the page route', 'GENERATED_MODE_BRAND', blog, m_brand_route)
    def m_brand_link(s): find(s, 'shared.post-hero')['content']['breadcrumbs'][0]['to'] = '/lp/why-watershed-platform'; return s
    add('brand: source name in a link target', 'GENERATED_MODE_BRAND', blog, m_brand_link)
    def m_wordmark(s):
        footer = find(s, 'chrome.footer')
        footer['content']['brandMark'] = {'assetRole': 'brand.wordmark-placeholder'}; return s
    add('logo: the clone wordmark role in a generated footer', 'GENERATED_MODE_ASSET', blog, m_wordmark)
    tid_logo, logos = asset_host(gen, 'logo.fictional-customer')
    def m_logo_role(s): find_asset(s, 'logo.fictional-customer')['assetRole'] = 'logo.customer-placeholder'; return s
    add('logo: customer-logo stand-in role (reference-only) in a generated logo strip', 'GENERATED_MODE_ASSET', logos, m_logo_role)
    def m_logo_wrong_field(s): find(s, 'shared.post-hero')['content']['image']['assetRole'] = 'logo.fictional-customer'; return s
    add('logo: a generation-safe logo role in a photo field', 'GENERATED_MODE_ROLE', blog, m_logo_wrong_field)
    def m_ref_role(s): find(s, 'shared.post-hero')['content']['image']['assetRole'] = 'photo.real-employee'; return s
    add('logo: invented role', 'SCHEMA', blog, m_ref_role)
    # --- proprietary media
    tid_av, avatars = asset_host(gen, 'avatar.fictional-placeholder')
    def m_person_photo(s): find_asset(s, 'avatar.fictional-placeholder')['assetRole'] = 'photo.person'; return s
    add('proprietary media: a person photograph role (blocked) in a generated page', 'GENERATED_MODE_ASSET', avatars, m_person_photo)
    tid_vis, visuals = asset_host(gen, 'artboard.generated-visual')
    def m_screens(s): find_asset(s, 'artboard.generated-visual')['assetRole'] = 'artboard.product-ui'; return s
    add('proprietary media: the product screen artboard role (reference-only) in a generated page', 'GENERATED_MODE_ASSET', visuals, m_screens)
    def m_photo_in_avatar(s): find_asset(s, 'avatar.fictional-placeholder')['assetRole'] = 'photo.environment'; return s
    add('proprietary media: a landscape photo role in an avatar field', 'GENERATED_MODE_ROLE', avatars, m_photo_in_avatar)
    def m_asset_alt_brand(s): find_asset(s, 'artboard.generated-visual')['alt'] = 'Screenshot of the Northwind dashboard'; return s
    add('proprietary media: a source product screenshot described in alt text', 'GENERATED_MODE_BRAND', visuals, m_asset_alt_brand)
    # --- CTA leakage
    def promo_label(s, text): find(s, 'chrome.promo-bar')['content']['offers'][0]['link']['label'] = text; return s
    add('CTA: brand-verb label (Try Northwind)', 'GENERATED_MODE_CTA', blog, lambda s: promo_label(s, 'Try Northwind'))
    add('CTA: a source label (Request a demo)', 'GENERATED_MODE_CTA', blog, lambda s: promo_label(s, 'Request a demo'))
    add('CTA: a source label with a no-break space (Get a\u00a0demo)', 'GENERATED_MODE_CTA', blog, lambda s: promo_label(s, 'Get a\u00a0demo'))
    add('CTA: brand-verb label with the real brand (Book a Watershed demo)', 'GENERATED_MODE_CTA', blog, lambda s: promo_label(s, 'Book a Watershed demo'))
    # --- copy leakage
    add('copy: a run of source marketing copy in a paragraph', 'GENERATED_MODE_COPY', blog, lambda s: body(s, canary + ' and some new words.'))
    add('copy: the same run upper-cased with curly apostrophes and extra spaces', 'GENERATED_MODE_COPY', blog, lambda s: body(s, ('  ' + canary.upper().replace("'", '\u2019')).replace(' ', '  ')))
    add('copy: the run split by markdown emphasis', 'GENERATED_MODE_COPY', blog, lambda s: body(s, '**' + canary.split(' ', 1)[0] + '** ' + canary.split(' ', 1)[1] + ' end'))
    # --- URL leakage
    add('URL: a source URL with scheme', 'GENERATED_MODE_URL', blog, lambda s: body(s, 'Details at [the site](https://watershed.com/pricing).'))
    add('URL: a source host without a scheme', 'GENERATED_MODE_URL', blog, lambda s: body(s, 'Details at stripe.com today.'))
    add('URL: a source social profile', 'GENERATED_MODE_URL', blog, lambda s: body(s, 'Follow https://www.linkedin.com/company/watershedclimate for news.'))
    add('URL: a podcast store link the source points to (the source has no app store links)', 'GENERATED_MODE_URL', blog, lambda s: body(s, 'Listen at https://podcasts.apple.com/gb/podcast/x today.'))
    add('URL: a source form portal host', 'GENERATED_MODE_URL', blog, lambda s: body(s, 'Submit through share.hsforms.com today.'))
    add('URL: a real non-source host (not a reserved placeholder domain)', 'GENERATED_MODE_EXTERNAL_URL', blog, lambda s: body(s, 'See [docs](https://larkwell.io/docs) for more.'))
    add('URL: a mailto address on a real domain', 'GENERATED_MODE_EXTERNAL_URL', blog, lambda s: body(s, 'Write to mailto:hello@larkwell.io for help.'))
    add('URL: an external URL on a reserved host is fine only in text, not in a link field', 'SCHEMA', blog, lambda s: find(s, 'shared.post-hero')['content']['breadcrumbs'][0].__setitem__('to', 'https://fennwick.example/blog') or s)
    # --- person, customer, rating
    def m_quote_person(s): find(s, 'shared.post-hero')['content']['title'] = 'Interview with Joanna Rice'; return s
    add('person: a real person named by the source', 'GENERATED_MODE_PERSON', blog, m_quote_person)
    add('person: a real person with a zero-width character', 'GENERATED_MODE_PERSON', blog, lambda s: title(s, 'Interview with Joan\u200bna Rice'))
    add('person: another real person named by the source', 'GENERATED_MODE_PERSON', blog, lambda s: title(s, 'Interview with Steve Davis'))
    add('customer: a real customer named in a heading', 'GENERATED_MODE_CUSTOMER', blog, lambda s: title(s, 'How Canva keeps notes'))
    add('customer: a real customer, spaced and capitalised (Advent Health)', 'GENERATED_MODE_CUSTOMER', blog, lambda s: body(s, 'Used by Advent Health every day.'))
    add('customer: a real customer that is also an English word, as a route (/customers/braze)', 'GENERATED_MODE_CUSTOMER', blog, lambda s: s.__setitem__('route', '/blog/braze') or s)
    add('customer: a real customer in a link target', 'GENERATED_MODE_CUSTOMER', blog, lambda s: find(s, 'shared.post-hero')['content']['breadcrumbs'][0].__setitem__('to', '/customers/canva') or s)
    add('rating: a numeric review score', 'GENERATED_MODE_RATING', blog, lambda s: body(s, 'Rated 4.8 out of 5 by our users.'))
    add('rating: star glyphs', 'GENERATED_MODE_RATING', blog, lambda s: body(s, '\u2605\u2605\u2605\u2605\u2605 from our readers.'))
    add('rating: a review platform name', 'GENERATED_MODE_RATING', blog, lambda s: body(s, 'High performer on G2 this season.'))
    add('rating: an analyst firm ranking', 'GENERATED_MODE_RATING', blog, lambda s: body(s, 'A leader in the Forrester Wave this year.'))
    add('third party: a competitor the source compares itself with only WARNS', 'GENERATED_MODE_THIRD_PARTY', blog, lambda s: body(s, 'A fair comparison with Workiva for new teams.'), 'warn')
    # --- chrome and route
    def m_nav_nobrand(s): find(s, 'chrome.nav')['content'].pop('brandName'); return s
    add('chrome: a generated nav without its own brand name', 'GENERATED_MODE_CHROME', blog, m_nav_nobrand)
    def m_nav_nomenus(s): find(s, 'chrome.nav')['content'].pop('menus'); return s
    add('chrome: a generated nav that falls back to the clone menus', 'GENERATED_MODE_CHROME', blog, m_nav_nomenus)
    def m_footer_nocopy(s): find(s, 'chrome.footer')['content'].pop('copyright'); return s
    add('chrome: a generated footer without a copyright line', 'GENERATED_MODE_CHROME', blog, m_footer_nocopy)
    def m_promo_empty(s): find(s, 'chrome.promo-bar')['content'] = {}; return s
    add('chrome: a generated promo bar without offers', 'GENERATED_MODE_CHROME', blog, m_promo_empty)
    def m_route_family(s): s['route'] = '/pricing'; return s
    add('route: a generated blog page outside the blog route family', 'GENERATED_MODE_ROUTE', blog, m_route_family)
    def m_route_single(s): s['route'] = '/sample-home'; return s
    add('route: a generated homepage at an unbuilt route', 'GENERATED_MODE_ROUTE', gen['template.home'], m_route_single)
    def m_route_other(s): s['route'] = '/customers'; return s
    add('route: a generated blog page at a built route of another template', 'ROUTE_BOUND_TO_TEMPLATE', blog, m_route_other)
    # --- controls that must PASS
    def c_ref_real(s):
        find(s, 'shared.post-hero')['content']['title'] = 'Watershed uses Northwind, Request a demo, 4.8 out of 5 on G2, Canva, Joanna Rice'
        return s
    add('reference mode keeps real source content (brand, CTA, rating, customer, person) valid', None, example, c_ref_real, 'pass')
    def c_reserved(s): body(s, 'Notes are kept at [the notes](https://notes.fennwick.example/start) and https://docs.fennwick.invalid.'); return s
    add('generated mode accepts reserved placeholder URLs in text', None, blog, c_reserved, 'pass')
    def c_brandmark(s): find(s, 'chrome.footer')['content']['brandMark'] = {'assetRole': 'brand.user-supplied-logo'}; return s
    add('generated mode accepts the user-supplied brand mark role', None, blog, c_brandmark, 'pass')
    def c_ref_role(s): find(s, 'chrome.footer')['content']['brandMark'] = {'assetRole': 'brand.wordmark-placeholder'}; return s
    add('reference mode accepts the clone wordmark role', None, example, c_ref_role, 'pass')
    def c_gen_role_in_ref(s): find(s, 'chrome.footer')['content']['brandMark'] = {'assetRole': 'brand.user-supplied-logo'}; return s
    add('reference mode rejects a generation-safe-only role (user-supplied logo)', 'ASSET_ROLE_ALLOWED', example, c_gen_role_in_ref)
    return G


def jedit(root, rel, fn):
    p = os.path.join(root, rel)
    d = json.load(open(p, encoding='utf-8'))
    fn(d)
    json.dump(d, open(p, 'w', encoding='utf-8'), indent=2, ensure_ascii=False)


def sec_edit(sid, fn):
    return lambda root: jedit(root, f'sections/{sid}.json', fn)


def heights_edit(fn):
    return lambda root: jedit(root, 'extraction/measured-values.json', lambda d: fn(d['sectionHeights']))


def wl_edit(fn):
    return lambda root: jedit(root, 'extraction/wrapper-whitelist.json', fn)


def role_edit(root, rid, fn):
    """Edit one role of assets/asset-roles.json (rid None: edit the whole document)."""
    def go(d):
        if rid is None:
            fn(d)
        else:
            fn(next(r for r in d['roles'] if r['id'] == rid))
    jedit(root, 'assets/asset-roles.json', go)


def sb_edit(root, fn):
    jedit(root, 'assets/asset-roles.json', lambda d: fn(d['sourceBrand']))


def text_edit(root, rel, old, new):
    p = os.path.join(root, rel)
    s = open(p, encoding='utf-8').read()
    if old not in s:
        raise SystemExit(f'mutation target not found in {rel}: {old[:60]!r}')
    open(p, 'w', encoding='utf-8').write(s.replace(old, new, 1))


def _flip_wordmark(root):
    role_edit(root, 'brand.wordmark-placeholder', lambda r: r.__setitem__('availability', 'generation-safe'))
    sec_edit('chrome.footer', lambda d: d['generatedAssetRoles'].append('brand.wordmark-placeholder'))(root)
    jedit(root, 'tokens/llm/component-allowlist.json', lambda d: d['sections']['chrome.footer']['generatedAssetRoles'].append('brand.wordmark-placeholder'))


def _loosen_verify_pin(root):
    role_edit(root, 'photo.person', lambda r: r.__setitem__('availability', 'generation-safe'))
    text_edit(root, 'extraction/verify_all.py', "    'photo.person': 'blocked-for-generation',\n    'artboard.product-ui'", "    'photo.person': 'generation-safe',\n    'artboard.product-ui'")


def _hand_edit(root):
    def go(d):
        for n in d['nodes']:
            if isinstance(n['content'].get('title'), str):
                w = n['content']['title'].split()
                w[0] = 'Amber' if w[0] != 'Amber' else 'Umber'   # same word count: only the builder comparison can notice
                n['content']['title'] = ' '.join(w)
                return
        raise SystemExit('no title to edit')
    jedit(root, 'schema/examples/generated.lp.pagespec.json', go)


def _add_runtime_ui(root):
    d = json.load(open(os.path.join(root, 'sections', 'block.Spacer.json'), encoding='utf-8'))
    d['id'] = 'shared.cookie-consent-banner'
    d['title'] = 'Cookie consent banner'
    d.pop('retrievalEligible', None)
    d.pop('retrievalIneligibleReason', None)
    json.dump(d, open(os.path.join(root, 'sections', 'shared.cookie-consent-banner.json'), 'w', encoding='utf-8'), indent=2, ensure_ascii=False)


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
        # --- closed section-contract schema, source vs semantic
        ('contract schema: invented top-level key in a contract', sec_edit('block.Hero', lambda d: d.__setitem__('inventedKey', 1)), 'check_sections'),
        ('contract schema: invented key inside the source object', sec_edit('block.Hero', lambda d: d['source'].__setitem__('extra', 'x')), 'check_sections'),
        ('contract schema: source object removed (semantic alone is not provenance)', sec_edit('block.Hero', lambda d: d.pop('source')), 'check_sections'),
        ('contract schema: semantic object removed', sec_edit('block.Hero', lambda d: d.pop('semantic')), 'check_sections'),
        ('contract schema: semantic.category outside the closed list', sec_edit('block.Hero', lambda d: d['semantic'].__setitem__('category', 'HEROISH')), 'check_sections'),
        ('contract schema: source.tag outside the closed list', sec_edit('block.Hero', lambda d: d['source'].__setitem__('tag', 'blink')), 'check_sections'),
        ('contract: source.lines reversed', sec_edit('block.Hero', lambda d: d['source'].__setitem__('lines', '40-6')), 'check_sections'),
        ('contract: one semantic id with two categories', sec_edit('block.Hero', lambda d: d['semantic'].update({'id': 'proof.quote', 'category': 'CONTENT'})), 'check_sections'),
        ('contract: assetRoles that its fields do not allow', sec_edit('block.Hero', lambda d: d['assetRoles'].append('photo.person')), 'check_sections'),
        # --- retrievalEligible
        ('retrievalEligible: a pinned utility (Spacer) made retrievable', sec_edit('block.Spacer', lambda d: (d.pop('retrievalEligible'), d.pop('retrievalIneligibleReason'))), 'check_sections'),
        ('retrievalEligible: a string "false" instead of a closed boolean', sec_edit('block.Spacer', lambda d: d.__setitem__('retrievalEligible', 'false')), 'check_sections'),
        ('retrievalEligible: reason shorter than 30 characters', sec_edit('block.Spacer', lambda d: d.__setitem__('retrievalIneligibleReason', 'layout only')), 'check_sections'),
        ('retrievalEligible: false on a section that is not pinned', sec_edit('block.Hero', lambda d: d.update({'retrievalEligible': False, 'retrievalIneligibleReason': 'Not a real reason but long enough to pass the length rule.'})), 'check_sections'),
        ('retrievalEligible: a reason on a retrievable section', sec_edit('block.Hero', lambda d: d.__setitem__('retrievalIneligibleReason', 'A reason that has no business being here at all.')), 'check_sections'),
        ('retrievalEligible: a cookie consent banner section that is not pinned', _add_runtime_ui, 'check_sections'),
        ('retrievalEligible: allowlist mirror says Spacer is retrievable', lambda root: jedit(root, 'tokens/llm/component-allowlist.json', lambda d: d['sections']['block.Spacer'].__setitem__('retrievalEligible', True)), 'check_allowlist'),
        ('retrievalEligible: allowlist pinned list emptied', lambda root: jedit(root, 'tokens/llm/component-allowlist.json', lambda d: d.__setitem__('retrievalIneligibleSections', [])), 'check_allowlist'),
        ('semantic: allowlist category differs from the contract', lambda root: jedit(root, 'tokens/llm/component-allowlist.json', lambda d: d['sections']['block.Hero'].__setitem__('semanticCategory', 'CONTENT')), 'check_allowlist'),
        # --- classification
        ('classification: a form section filed as CONTENT', sec_edit('shared.newsletter-band', lambda d: d['semantic'].update({'id': 'content.newsletter-band', 'category': 'CONTENT'})), 'check_classification'),
        ('classification: an editorial feed filed as FEATURES', sec_edit('shared.related-content', lambda d: d['semantic'].__setitem__('category', 'FEATURES')), 'check_classification'),
        ('classification: graph hero list drops a HERO section', lambda root: jedit(root, 'compatibility/graph.json', lambda d: [r['params']['heroSections'].pop() for r in d['rules'] if r['id'] == 'ONE_HERO']), 'check_classification'),
        ('classification: a second HERO section in a fixed template', lambda root: jedit(root, 'templates/templates.json', lambda d: d['templates']['template.home']['nodes'].insert(3, {'section': 'block.Hero', 'required': False, 'repeatable': False})), 'check_classification'),
        ('classification: CTA-like copy with its review removed', lambda root: jedit(root, 'extraction/classification-review.json', lambda d: d['entries'].pop(0)), 'check_classification'),
        # --- generated artefacts
        ('schema sync: a section content definition edited by hand', lambda root: jedit(root, 'schema/pagespec.schema.json', lambda d: d['definitions']['content']['block.Hero']['properties'].__setitem__('invented', {'type': 'string'})), 'check_schema_sync'),
        ('provenance sync: source.tag edited by hand', sec_edit('block.Hero', lambda d: d['source'].__setitem__('tag', 'aside')), 'check_provenance_sync'),
        # --- whole-page-wrapper gate
        ('wrapper gate: a HERO taller than 3000px without a whitelist entry', heights_edit(lambda h: h['sections']['change.hero'].__setitem__('maxHeightPx', 4200)), 'check_wrapper'),
        ('wrapper gate: a section holding 70% of its page without a whitelist entry', heights_edit(lambda h: [x.__setitem__('heightPx', int(h['pages']['template.brand']['pageHeightPx'] * 0.7)) for x in h['pages']['template.brand']['sections'] if x['section'] == 'brand.logos']), 'check_wrapper'),
        # --- generation context: availability pinned in code, independent of the registry
        ('availability: the clone wordmark role made generation-safe in the registry', lambda root: role_edit(root, 'brand.wordmark-placeholder', lambda r: r.__setitem__('availability', 'generation-safe')), 'check_asset_roles'),
        ('availability: person photographs made generation-safe in the registry', lambda root: role_edit(root, 'photo.person', lambda r: r.__setitem__('availability', 'generation-safe')), 'check_asset_roles'),
        ('availability: product screen artboards made generation-safe in the registry', lambda root: role_edit(root, 'artboard.product-ui', lambda r: r.__setitem__('availability', 'generation-safe')), 'check_asset_roles'),
        ('availability: customer-logo stand-ins made blocked instead of reference-only (valid but wrong)', lambda root: role_edit(root, 'logo.customer-placeholder', lambda r: r.__setitem__('availability', 'blocked-for-generation')), 'check_asset_roles'),
        ('availability: a generation-safe role downgraded in the registry', lambda root: role_edit(root, 'photo.environment', lambda r: r.__setitem__('availability', 'reference-only')), 'check_asset_roles'),
        ('availability: value outside the closed enum', lambda root: role_edit(root, 'photo.environment', lambda r: r.__setitem__('availability', 'free-for-all')), 'check_asset_roles'),
        ('availability: removed from a role', lambda root: role_edit(root, 'photo.environment', lambda r: r.pop('availability')), 'check_asset_roles'),
        ('availability: generationSafeSubstitutes removed from a blocked role', lambda root: role_edit(root, 'photo.person', lambda r: r.__setitem__('generationSafeSubstitutes', [])), 'check_asset_roles'),
        ('availability: a substitute that is itself not generation-safe', lambda root: role_edit(root, 'photo.person', lambda r: r.__setitem__('generationSafeSubstitutes', ['brand.wordmark-placeholder'])), 'check_asset_roles'),
        ('availability: generatedModeGuidance removed', lambda root: role_edit(root, 'photo.person', lambda r: r.pop('generatedModeGuidance')), 'check_asset_roles'),
        ('availability: a new role added to the registry without a code pin', lambda root: role_edit(root, None, lambda d: d['roles'].append(dict(d['roles'][0], id='photo.extra'))), 'check_asset_roles'),
        ('availability: registry, contract and allowlist flipped together to let the clone wordmark into generated pages', _flip_wordmark, 'check_asset_roles'),
        ('availability: PINNED_AVAILABILITY entry deleted from semantic_validate.py', lambda root: text_edit(root, 'schema/semantic_validate.py', " 'brand.wordmark-placeholder': 'reference-only',\n", '\n'), 'check_asset_roles'),
        ('availability: a pin loosened in semantic_validate.py only', lambda root: text_edit(root, 'schema/semantic_validate.py', "'photo.person': 'blocked-for-generation'", "'photo.person': 'generation-safe'"), 'check_asset_roles'),
        ('availability: the pin in verify_all.py loosened with the registry (semantic_validate.py still pins the old value)', _loosen_verify_pin, 'check_asset_roles'),
        ('contract: generatedAssetRoles lists a reference-only role', sec_edit('chrome.footer', lambda d: d['generatedAssetRoles'].append('brand.wordmark-placeholder')), 'check_sections'),
        ('contract: generatedAssetRoles removed', sec_edit('chrome.footer', lambda d: d.pop('generatedAssetRoles')), 'check_sections'),
        ('contract: generatedAssetRoles emptied for a section with a media field', sec_edit('block.Hero', lambda d: d.__setitem__('generatedAssetRoles', [])), 'check_sections'),
        ('mode: removed from the required list of the schema', lambda root: jedit(root, 'schema/pagespec.schema.json', lambda d: d['required'].remove('mode')), 'check_mode'),
        ('mode: enum widened with an invented value', lambda root: jedit(root, 'schema/pagespec.schema.json', lambda d: d['properties']['mode']['enum'].append('draft')), 'check_mode'),
        ('mode: the allowlist no longer lists mode', lambda root: jedit(root, 'tokens/llm/component-allowlist.json', lambda d: d['pageSpecProperties'].remove('mode')), 'check_mode'),
        ('mode: the reference example relabelled generated', lambda root: jedit(root, 'schema/example.pagespec.json', lambda d: d.__setitem__('mode', 'generated')), 'check_mode'),
        # --- source brand registry
        ('source brand: brand patterns emptied', lambda root: sb_edit(root, lambda sb: sb['categories']['brand'].__setitem__('patterns', [])), 'check_source_brand'),
        ('source brand: the brand pattern loosened until it no longer matches its own sample', lambda root: sb_edit(root, lambda sb: sb['categories']['brand']['patterns'][0].__setitem__('pattern', 'zzzz')), 'check_source_brand'),
        ('source brand: the clone stand-in brand pattern removed', lambda root: sb_edit(root, lambda sb: sb['categories']['brand']['patterns'].pop(1)), 'check_source_brand'),
        ('source brand: customer patterns cut below the pinned minimum', lambda root: sb_edit(root, lambda sb: sb['categories']['customer'].__setitem__('patterns', sb['categories']['customer']['patterns'][:5])), 'check_source_brand'),
        ('source brand: people patterns removed', lambda root: sb_edit(root, lambda sb: sb['categories'].pop('person')), 'check_source_brand'),
        ('source brand: CTA patterns removed', lambda root: sb_edit(root, lambda sb: sb['categories']['cta'].__setitem__('patterns', [])), 'check_source_brand'),
        ('source brand: URL patterns removed', lambda root: sb_edit(root, lambda sb: sb['categories']['url'].__setitem__('patterns', [])), 'check_source_brand'),
        ('source brand: rating patterns removed', lambda root: sb_edit(root, lambda sb: sb['categories']['rating'].__setitem__('patterns', [])), 'check_source_brand'),
        ('source brand: a pattern broadened until it matches a harmless sample', lambda root: sb_edit(root, lambda sb: sb['categories']['brand']['patterns'][0].__setitem__('pattern', 'water|shed|larkwell|[a-z]')), 'check_source_brand'),
        ('source brand: a category raises another rule code', lambda root: sb_edit(root, lambda sb: sb['categories']['cta'].__setitem__('code', 'GENERATED_MODE_BRAND')), 'check_source_brand'),
        ('source brand: reviewStatus claims a human review', lambda root: sb_edit(root, lambda sb: sb.__setitem__('reviewStatus', 'Reviewed and approved by a human.')), 'check_source_brand'),
        ('source brand: count drift', lambda root: sb_edit(root, lambda sb: sb['counts'].__setitem__('patterns', 999)), 'check_source_brand'),
        ('source brand: copy shingles emptied', lambda root: jedit(root, 'assets/source-copy-hashes.json', lambda d: d.__setitem__('copyShingles', [])), 'check_source_brand'),
        ('source brand: copy shingles thinned below the pinned minimum', lambda root: jedit(root, 'assets/source-copy-hashes.json', lambda d: d.__setitem__('copyShingles', d['copyShingles'][:500])), 'check_source_brand'),
        ('source brand: canaries removed', lambda root: sb_edit(root, lambda sb: sb['copy'].__setitem__('canaries', [])), 'check_source_brand'),
        ('source brand: a canary edited so that it is no longer source copy', lambda root: sb_edit(root, lambda sb: sb['copy']['canaries'].__setitem__(0, 'this sentence was never in the source at all')), 'check_source_brand'),
        ('source brand: shingle hashes replaced with source text', lambda root: jedit(root, 'assets/source-copy-hashes.json', lambda d: d['copyShingles'].append('not a hash, plain source text')), 'check_source_brand'),
        # --- generated examples
        ('generated examples: the home example deleted', lambda root: os.remove(os.path.join(root, 'schema', 'examples', 'generated.home.pagespec.json')), 'check_generated_examples'),
        ('generated examples: an example relabelled reference', lambda root: jedit(root, 'schema/examples/generated.lp.pagespec.json', lambda d: d.__setitem__('mode', 'reference')), 'check_generated_examples'),
        ('generated examples: source brand written into an example', lambda root: jedit(root, 'schema/examples/generated.blog-post.pagespec.json', lambda d: [n['content'].__setitem__('title', 'Why Watershed') for n in d['nodes'] if n['section'] == 'shared.post-hero']), 'check_generated_examples'),
        ('generated examples: a real person photograph role written into an example', lambda root: jedit(root, 'schema/examples/generated.blog-post.pagespec.json', lambda d: [n['content']['image'].__setitem__('assetRole', 'photo.person') for n in d['nodes'] if n['section'] == 'shared.post-hero']), 'check_generated_examples'),
        ('generated examples: an example hand-edited (differs from what the builder produces)', _hand_edit, 'check_generated_examples'),
        ('generated examples: the family index drops a family', lambda root: jedit(root, 'schema/examples/generated-index.json', lambda d: d['families'].pop('legal')), 'check_generated_examples'),
        # --- the validator must keep enforcing generated mode (leaks injected into a generated example)
        ('enforcement: r_generated made a no-op in semantic_validate.py', lambda root: text_edit(root, 'schema/semantic_validate.py', "    if ctx.spec.get('mode') != 'generated':\n        return\n    repo = ctx.repo\n    pats", "    return\n    repo = ctx.repo\n    pats"), 'check_generated_enforcement'),
        ('enforcement: the source-pattern scan skipped in semantic_validate.py', lambda root: text_edit(root, 'schema/semantic_validate.py', "            for pid, rx in pats.get(cat, []):\n                m = rx.search(text)", "            for pid, rx in []:\n                m = rx.search(text)"), 'check_generated_enforcement'),
        ('enforcement: shingle matching removed from semantic_validate.py', lambda root: text_edit(root, 'schema/semantic_validate.py', "            if shingle_hash(w[i:i + SHINGLE_WORDS]) in sh:", "            if False:"), 'check_generated_enforcement'),
        ('enforcement: asset availability ignored in the generated walk of semantic_validate.py', lambda root: text_edit(root, 'schema/semantic_validate.py', "            if av != 'generation-safe':", "            if False:"), 'check_generated_enforcement'),
        ('enforcement: the chrome requirement removed from semantic_validate.py', lambda root: text_edit(root, 'schema/semantic_validate.py', "            if not c.get(fld):", "            if False:"), 'check_generated_enforcement'),
        ('enforcement: the external URL check removed from semantic_validate.py', lambda root: text_edit(root, 'schema/semantic_validate.py', "            if not host or not RESERVED_HOST_RE.search(host):", "            if False:"), 'check_generated_enforcement'),
        ('enforcement: text normalisation removed from semantic_validate.py (NFKC and zero-width)', lambda root: text_edit(root, 'schema/semantic_validate.py', "    s = unicodedata.normalize('NFKC', str(s))\n    s = ZERO_WIDTH_RE.sub('', s)", "    s = str(s)"), 'check_generated_enforcement'),
        ('enforcement: the manifest counts the generated examples', lambda root: jedit(root, 'registry.manifest.json', lambda d: d['counts'].__setitem__('generatedExamples', 3)), 'check_manifest'),
        ('wrapper gate: a missing section measurement', heights_edit(lambda h: h['sections'].pop('brand.logos')), 'check_wrapper'),
        ('wrapper gate: a missing template page measurement', heights_edit(lambda h: h['pages'].pop('template.brand')), 'check_wrapper'),
        ('wrapper gate: no sectionHeights at all', lambda root: jedit(root, 'extraction/measured-values.json', lambda d: d.pop('sectionHeights')), 'check_wrapper'),
        ('wrapper gate: whitelist justification shorter than 30 characters', wl_edit(lambda d: d['entries'][0].__setitem__('justification', 'one page only')), 'check_wrapper'),
        ('wrapper gate: whitelist entry without reviewedBy', wl_edit(lambda d: d['entries'][0].pop('reviewedBy')), 'check_wrapper'),
        ('wrapper gate: whitelist ceiling at or below the measured value', wl_edit(lambda d: d['entries'][0].__setitem__('maxHeightPx', 100)), 'check_wrapper'),
        ('wrapper gate: stale whitelist entry for a section that is fine', wl_edit(lambda d: d['entries'].append({'kind': 'hero-height', 'section': 'home.hero', 'maxHeightPx': 9000, 'reviewedBy': 'x', 'attestation': 'agent', 'reviewedOn': '2026-10-23', 'justification': 'A stale entry that must be rejected by the gate.'})), 'check_wrapper'),
        ('wrapper gate: HERO between 1800 and 3000px only WARNS', heights_edit(lambda h: h['sections']['change.hero'].__setitem__('maxHeightPx', 2400)), 'check_wrapper', 'warn'),
        ('wrapper gate: a 55% section only WARNS', heights_edit(lambda h: [x.__setitem__('heightPx', int(h['pages']['template.brand']['pageHeightPx'] * 0.55)) for x in h['pages']['template.brand']['sections'] if x['section'] == 'brand.logos']), 'check_wrapper', 'warn'),
    ]


def semantic_registry_cases():
    """(name, mutate(root), expected rule): the mutated COPY of the repo is loaded with its own semantic_validate.py and validates the example."""
    return [
        ('semantic_validate pin: a pinned utility (Spacer) made retrievable', sec_edit('block.Spacer', lambda d: (d.pop('retrievalEligible'), d.pop('retrievalIneligibleReason'))), 'RETRIEVAL_ELIGIBILITY_PINNED'),
        ('semantic_validate pin: retrievalEligible as a string', sec_edit('block.Spacer', lambda d: d.__setitem__('retrievalEligible', 'false')), 'RETRIEVAL_ELIGIBILITY_PINNED'),
        ('semantic_validate pin: reason shorter than 30 characters', sec_edit('block.HorizontalRule', lambda d: d.__setitem__('retrievalIneligibleReason', 'layout only')), 'RETRIEVAL_ELIGIBILITY_PINNED'),
        ('semantic_validate pin: a cookie consent banner section that is not pinned', _add_runtime_ui, 'RETRIEVAL_ELIGIBILITY_PINNED'),
        ('semantic_validate pin: false on an unpinned section', sec_edit('block.Hero', lambda d: d.update({'retrievalEligible': False, 'retrievalIneligibleReason': 'Not a real reason but long enough to pass the length rule.'})), 'RETRIEVAL_ELIGIBILITY_PINNED'),
        ('semantic_validate pin: semantic.category outside the closed list', sec_edit('block.Hero', lambda d: d['semantic'].__setitem__('category', 'HEROISH')), 'SEMANTIC_CATEGORY_CLOSED'),
        ('semantic_validate pin: a form section filed as CONTENT', sec_edit('shared.newsletter-band', lambda d: d['semantic'].__setitem__('category', 'CONTENT')), 'SEMANTIC_CATEGORY_CLOSED'),
        ('semantic_validate pin: an editorial feed filed as FEATURES', sec_edit('shared.related-content', lambda d: d['semantic'].__setitem__('category', 'FEATURES')), 'SEMANTIC_CATEGORY_CLOSED'),
        ('semantic_validate pin: source object removed', sec_edit('block.Hero', lambda d: d.pop('source')), 'SEMANTIC_CATEGORY_CLOSED'),
        # --- generation context, validated with the mutated COPY's own validator (a reference example or a generated example)
        ('semantic_validate pin: the clone wordmark role made generation-safe in the registry', lambda root: role_edit(root, 'brand.wordmark-placeholder', lambda r: r.__setitem__('availability', 'generation-safe')), 'ASSET_AVAILABILITY_PINNED'),
        ('semantic_validate pin: person photographs made generation-safe in the registry', lambda root: role_edit(root, 'photo.person', lambda r: r.__setitem__('availability', 'generation-safe')), 'ASSET_AVAILABILITY_PINNED'),
        ('semantic_validate pin: substitutes of a blocked role emptied in the registry', lambda root: role_edit(root, 'photo.person', lambda r: r.__setitem__('generationSafeSubstitutes', [])), 'ASSET_AVAILABILITY_PINNED'),
        ('semantic_validate pin: a role added to the registry without a pinned availability', lambda root: role_edit(root, None, lambda d: d['roles'].append(dict(d['roles'][0], id='photo.extra'))), 'ASSET_AVAILABILITY_PINNED'),
        ('semantic_validate pin: generatedAssetRoles of a section loosened', sec_edit('chrome.footer', lambda d: d['generatedAssetRoles'].append('brand.wordmark-placeholder')), 'GENERATED_ROLES_DERIVED'),
        ('semantic_validate pin: generatedAssetRoles of a section emptied', sec_edit('block.Hero', lambda d: d.__setitem__('generatedAssetRoles', [])), 'GENERATED_ROLES_DERIVED'),
        ('generated mode fails closed: brand patterns emptied', lambda root: sb_edit(root, lambda sb: sb['categories']['brand'].__setitem__('patterns', [])), 'GENERATED_MODE_PATTERNS_MISSING', 'generated'),
        ('generated mode fails closed: customer patterns removed', lambda root: sb_edit(root, lambda sb: sb['categories'].pop('customer')), 'GENERATED_MODE_PATTERNS_MISSING', 'generated'),
        ('generated mode fails closed: the sourceBrand registry removed', lambda root: jedit(root, 'assets/asset-roles.json', lambda d: d.pop('sourceBrand')), 'GENERATED_MODE_PATTERNS_MISSING', 'generated'),
        ('generated mode fails closed: every pattern of a category unusable (does not compile)', lambda root: sb_edit(root, lambda sb: [p.__setitem__('pattern', '(') for p in sb['categories']['person']['patterns']]), 'GENERATED_MODE_PATTERNS_MISSING', 'generated'),
        ('generated mode fails closed: copy shingles file emptied', lambda root: jedit(root, 'assets/source-copy-hashes.json', lambda d: d.__setitem__('copyShingles', [])), 'GENERATED_MODE_PATTERNS_MISSING', 'generated'),
        ('generated mode fails closed: copy shingles file removed', lambda root: os.remove(os.path.join(root, 'assets', 'source-copy-hashes.json')), 'GENERATED_MODE_PATTERNS_MISSING', 'generated'),
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
    gen = load_generated(repo, base)
    gcases = generated_cases(repo, gen, example, 'placeholder')
    n_pass = sum(1 for c in gcases if c[1] == 'pass')
    return len(build_cases(repo, example, ctl)) + len(gcases) - n_pass + len(registry_cases()) + len(semantic_registry_cases()), 1 + len(ctl) + len(gen) + n_pass


def main():
    repo = sv.Repo()
    example = json.load(open(os.path.join(ROOT, 'schema', 'example.pagespec.json')))
    ctl = {tid: synth(repo, tid) for tid in repo.templates}
    gen = load_generated(repo)
    canary = canary_of()
    fails = []
    # controls
    ok = 0
    controls = [('example.pagespec.json', example)] + [(tid, s) for tid, s in ctl.items()] + [('generated ' + tid, s) for tid, s in gen.items()]
    for name, spec in controls:
        res = sv.validate(spec, repo)
        if res['errors']:
            fails.append(f'CONTROL FAILED {name}: ' + '; '.join(res['schemaErrors'][:2] + [f"{f['rule']} {f['message']}" for f in res['findings'] if f['severity'] == 'error'][:2]))
        else:
            ok += 1
    # mutations
    cases = build_cases(repo, example, ctl) + generated_cases(repo, gen, example, canary)
    rejected = 0
    for name, kind, expect, factory in cases:
        res = sv.validate(factory(), repo)
        rules = {f['rule'] for f in res['findings']}
        if kind == 'pass':
            if res['errors']:
                fails.append(f'PASS CASE FAILED: {name}: ' + '; '.join(res['schemaErrors'][:2] + [f"{f['rule']} {f['message'][:90]}" for f in res['findings'] if f['severity'] == 'error'][:2]))
            else:
                rejected += 1
        elif kind == 'reject':
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
    for case in reg:
        name, mutate, check = case[:3]
        expect = case[3] if len(case) > 3 else 'fail'
        tmp = tempfile.mkdtemp(prefix='dr_adv_')
        try:
            dst = os.path.join(tmp, 'design-repo')
            shutil.copytree(ROOT, dst, ignore=shutil.ignore_patterns('__pycache__', '*.zip'))
            mutate(dst)
            failures, warnings = getattr(vmod, check)(dst)
            if expect == 'fail' and failures:
                rejected += 1
            elif expect == 'warn' and not failures and warnings:
                rejected += 1
            else:
                fails.append(f'REGISTRY MUTATION NOT {"REJECTED" if expect == "fail" else "WARNED"}: {name} (failures {len(failures)}, warnings {len(warnings)})')
        finally:
            shutil.rmtree(tmp, ignore_errors=True)
    sem_reg = semantic_registry_cases()
    for case in sem_reg:
        name, mutate, rule_id = case[:3]
        tmp = tempfile.mkdtemp(prefix='dr_adv_sem_')
        try:
            dst = os.path.join(tmp, 'design-repo')
            shutil.copytree(ROOT, dst, ignore=shutil.ignore_patterns('__pycache__', '*.zip'))
            mutate(dst)
            spec_ = importlib.util.spec_from_file_location('sv_scratch_' + str(abs(hash(name))), os.path.join(dst, 'schema', 'semantic_validate.py'))
            sv2 = importlib.util.module_from_spec(spec_)
            spec_.loader.exec_module(sv2)
            spec_ = gen['template.blog-post'] if (len(case) > 3 and case[3] == 'generated') else example
            res = sv2.validate(spec_, sv2.Repo(dst))
            if any(f['rule'] == rule_id and f['severity'] == 'error' for f in res['findings']):
                rejected += 1
            else:
                fails.append(f'SEMANTIC REGISTRY MUTATION NOT REJECTED ({rule_id}): {name}')
        finally:
            shutil.rmtree(tmp, ignore_errors=True)
    total = len(cases) + len(reg) + len(sem_reg)
    ok_controls_extra = 0
    for f in fails:
        print('FAIL', f)
    print(f'controls passed: {ok}/{len(controls)} (1 reference example + {len(ctl)} reference templates + {len(gen)} generated examples)')
    n_warn = sum(1 for c in cases if c[1] == 'warn')
    n_pass = sum(1 for c in cases if c[1] == 'pass')
    print(f'mutations rejected: {rejected - n_pass}/{total - n_pass} ({len(cases) - n_warn - n_pass} spec reject, {n_warn} spec warn-only, {len(reg)} registry, {len(sem_reg)} semantic registry); explicit pass controls: {n_pass}')
    return 0 if not fails else 1


if __name__ == '__main__':
    sys.exit(main())
