#!/usr/bin/env python3
"""Builds one generation-safe example PageSpec (`mode: "generated"`) per template into schema/examples/ and an index of them.

Every page is synthesised from the template's real node list and the section contracts (required fields at their word budgets, the
first node variant allowed, the first motion pattern), then filled with ORIGINAL placeholder copy for a fictional brand:

  brand        "Fennwick" (invented, not a real company; checked against the source registry by the validator)
  people       invented names from FICTIONAL_PEOPLE (never real people); avatars use avatar.fictional-placeholder
  customers    invented names from FICTIONAL_COMPANIES; logos use logo.fictional-customer
  assets       only generation-safe roles (brand.user-supplied-logo, avatar.fictional-placeholder, artboard.generated-visual, CC0 photo roles ...)
  URLs         internal routes in link fields; one reserved-host URL (https://fennwick.example/...) in running text where a field takes markup
  copy         generated deterministically from a word bank in this file (no source text)
  ratings      none: no contract has a rating field; the validator rejects ratings and analyst or review-platform names regardless

Chrome (nav, footer, promo bar, closing CTA bar) carries its own brand name, menus and offers, because a generated page must not fall back
to the clone's navigation copy (rule GENERATED_MODE_CHROME). The route is the template's only built route for a single-route template; a template with several routes
(their slugs are real article, customer, event and product names) gets a neutral route inside its route family (<parent>/sample-page).

Usage:  python3 schema/build_generated_examples.py            write schema/examples/generated.<template>.pagespec.json and the index
        python3 schema/build_generated_examples.py --check    exit 1 when a file on disk differs from what would be generated
Importable: build_all(repo) -> {template id: spec}. Deterministic: no clock, no randomness beyond a hash of the field path.
"""
import hashlib
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)
import semantic_validate as sv  # noqa: E402

OUT = os.path.join(HERE, 'examples')
INDEX = os.path.join(OUT, 'generated-index.json')
BRAND = 'Fennwick'
PAGESPEC_VERSION = '2.0.0'

FICTIONAL_PEOPLE = ['Maren Oyelaran', 'Idris Valcourt', 'Petra Lindqvist', 'Tomasz Ekwueme', 'Saoirse Marlowe', 'Dov Hartnell', 'Linnea Okonkwo', 'Casimir Dray']
FICTIONAL_COMPANIES = ['Tallowmere Freight', 'Quillon Bakeries', 'Harrowgate Textiles', 'Pennyroyal Foods', 'Ostrander Labs', 'Brindlecombe Hotels']
TITLES = ['Head of Field Operations', 'Programme Lead', 'Operations Director', 'Research Fellow']
ADJ = ['steady', 'plain', 'shared', 'practical', 'compact', 'honest', 'open', 'careful', 'quiet', 'modular', 'durable', 'direct', 'layered', 'seasonal']
NOUN = ['harbour', 'ledger', 'compass', 'orchard', 'workshop', 'signal', 'lantern', 'garden', 'bridge', 'meadow', 'forge', 'atlas', 'kiln', 'beacon', 'trellis', 'quarry']
VERB = ['gathers', 'reviews', 'shapes', 'guides', 'tracks', 'builds', 'sorts', 'maps', 'connects', 'tidies']
NOUN2 = ['teams', 'sites', 'plans', 'notes', 'routines', 'checks', 'stories', 'tools', 'habits', 'drafts']
DATES = ['12 March 2026', '4 June 2026', '19 November 2026']
FREE_PICKS = {
    'template.product-block-page': [('block.Hero', None), ('block.TextWithImage', None), ('block.Faq', None)],
    'template.compare-block-page': [('block.HeroCompete', 'stat-tiles'), ('block.Logos', 'small'), ('block.Faq', None)],
    'template.company-block-page': [('block.Hero', None), ('block.Faq', None)],
}
# template family (documentation in generated-index.json): which kind of page each template is
FAMILY = {
    'template.home': 'home', 'template.product-block-page': 'landing', 'template.company-block-page': 'landing', 'template.compare-block-page': 'landing',
    'template.lp': 'landing', 'template.manifesto': 'landing', 'template.change': 'landing', 'template.climate-leads': 'landing', 'template.brand': 'landing',
    'template.blog-post': 'article', 'template.blog-post-toc': 'article', 'template.customer-story-sidebar': 'customer-story',
    'template.customer-story-editorial': 'customer-story', 'template.customers-index': 'listing', 'template.feed-index': 'listing', 'template.news-index': 'listing',
    'template.legal-index': 'legal', 'template.legal-document': 'legal', 'template.legal-document-toc': 'legal',
    'template.guide-gated': 'gated-download', 'template.event-gated': 'gated-download', 'template.report-gated': 'gated-download',
    'template.podcast-gated': 'gated-download', 'template.event-summit': 'event', 'template.soc-report': 'report',
    'template.demo-hero': 'form-demo', 'template.product-tour-index': 'listing', 'template.product-tour-detail': 'form-demo', 'template.tool': 'tool',
    'template.careers': 'careers', 'template.quiz': 'quiz',
}


def h(s):
    return int(hashlib.sha256(s.encode()).hexdigest()[:12], 16)


def pick(seq, key):
    return seq[h(key) % len(seq)]


def cap(s):
    return s[:1].upper() + s[1:]


def text_for(path, f):
    n = f['maxWords']
    key = path.split('.')[-1].split('[')[0] if path else ''
    if key in ('name', 'attribution', 'cite'):
        name = pick(FICTIONAL_PEOPLE, path)
        return ' '.join(name.split()[:n])
    if key == 'role':
        return ' '.join(pick(TITLES, path).split()[:n])
    if key in ('organisation', 'outlet', 'source'):
        return ' '.join(pick(FICTIONAL_COMPANIES, path).split()[:n])
    if key in ('date', 'dateLine', 'time') and n >= 2:
        return ' '.join(pick(DATES, path).split()[:n])
    if key == 'brandName':
        return BRAND
    if key == 'copyright':
        return ' '.join(['©', '2026', BRAND, 'Ltd'][:n])
    if key in ('value', 'statValue', 'metric'):
        return str(10 + h(path) % 80) + ('%' if n >= 1 else '')
    a1, a2, a3 = pick(ADJ, path + 'a'), pick(ADJ, path + 'd'), pick(ADJ, path + 'i')
    n1, n2, n3 = pick(NOUN, path + 'b'), pick(NOUN, path + 'f'), pick(NOUN, path + 'j')
    m1, m2 = pick(NOUN2, path + 'e'), pick(NOUN2, path + 'h')
    v1, v2 = pick(VERB, path + 'c'), pick(VERB, path + 'g')
    if n == 1:
        return cap(n1)
    if n == 2:
        return cap(f'{a1} {n1}')
    if n == 3:
        return cap(f'{a1} {n1} {m1}')
    if n == 4:
        return cap(f'{a1} {n1} {v1} {m1}')
    words = [a1, n1, v1, a2, m1, 'for', a3, m2, 'and', v2, a2, n2, 'across', a1, n3, m1]
    k = min(n, len(words))
    out = cap(' '.join(words[:k]))
    if k >= 8 and key in ('body', 'text', 'description', 'answer', 'paragraph', 'paragraphs', 'intro', 'introParagraphs', 'lead', 'subhead', 'p', 'aside', 'excerpt', 'statement', 'quote'):
        out += '.'
    return out


class Synth:
    def __init__(self, repo):
        self.repo = repo

    def gen(self, f, path, force=False):
        t = f['type']
        if t in ('text', 'cell'):
            return text_for(path, f)
        if t == 'enum':
            return f['values'][0]
        if t == 'boolean':
            return True
        if t == 'integer':
            return f.get('minimum', 1)
        if t == 'route':
            return '/demo'
        if t == 'link':
            return {'label': text_for(path + '.label', {'maxWords': f['maxWords']}), 'to': '/demo'}
        if t == 'object':
            return self.obj(f['fields'], path)
        if t == 'list':
            n = max(f.get('minItems', 0), 1 if (f.get('required') or force) else 0)
            if 'maxItems' in f:
                n = min(n, f['maxItems'])
            return [self.gen(f['items'], f'{path}[{i}]', False) for i in range(n)]
        if t == 'asset':
            role = sv.generated_field_roles(f['allowedRoles'])[0]
            d = {'assetRole': role}
            if f.get('altText', True):
                d['alt'] = 'Illustration of ' + text_for(path + '.alt', {'maxWords': 5}).lower()
            return d
        if t == 'oneOf':
            return self.obj(f['options'][0]['fields'], path)
        raise ValueError(t)

    def obj(self, fields, path):
        return {k: self.gen(v, f'{path}.{k}' if path else k) for k, v in fields.items() if v.get('required')}

    def content(self, sec, variant, rules, path):
        fields = sec['content']['fields']
        c = self.obj(fields, path)
        for vr in sec.get('variantRules', []):
            if vr['variant'] != variant:
                continue
            for fld in vr.get('requireFields', []):
                c[fld] = self.gen(fields[fld], f'{path}.{fld}', True)
            if 'path' in vr and vr.get('minItems'):
                f = dict(fields[vr['path']])
                f['minItems'] = max(f.get('minItems', 0), vr['minItems'])
                f['required'] = True
                c[vr['path']] = self.gen(f, f'{path}.{vr["path"]}')
            if 'path' in vr and vr.get('requireItemFields'):
                items = c.get(vr['path']) or self.gen({**fields[vr['path']], 'required': True}, f'{path}.{vr["path"]}')
                for i, it in enumerate(items):
                    for fld in vr['requireItemFields']:
                        it[fld] = self.gen(fields[vr['path']]['items']['fields'][fld], f'{path}.{vr["path"]}[{i}].{fld}')
                c[vr['path']] = items
        for fld in (rules or {}).get('requireFields', []):
            c[fld] = self.gen(fields[fld], f'{path}.{fld}', True)
        for vr in sec.get('variantRules', []):
            if vr['variant'] == variant:
                for fld in vr.get('forbidFields', []):
                    c.pop(fld, None)
        for fld in sv.GENERATED_CHROME_FIELDS.get(sec['id'], ()):
            if fld not in c:
                c[fld] = self.gen(fields[fld], f'{path}.{fld}', True)
        return c

    def node(self, section, variant, rules, idx):
        sec = self.repo.sections[section]
        m = sec['motion']['patterns'][0]
        n = {'section': section, 'content': self.content(sec, variant, rules, f'n{idx}.{section}'),
             'motion': {'pattern': m['pattern'], 'reducedMotionFallback': m['reducedMotionFallback']}}
        if variant:
            n['variant'] = variant
        return n

    def route_for(self, spec):
        """A single-route template can only use its own built route. A template with several routes gets a neutral route inside its route
        family (built slugs are real article, customer, event and product names), the first candidate the validator accepts."""
        tid = spec['template']
        routes = [r['path'] for r in self.repo.routes if r.get('template') == tid]
        cands = routes if len(routes) == 1 else [sv.route_family(routes[0]) + '/sample-page']
        for r in cands:
            res = sv.validate(dict(spec, route=r), self.repo)
            if not res['errors'] and not res['warnings']:
                return r
        raise SystemExit(f'no acceptable generated route for {tid}: {res["schemaErrors"][:2]} {res["findings"][:2]}')

    def page(self, tid):
        t = self.repo.templates[tid]
        nodes = []
        if t['orderMode'] == 'free':
            for tn in t['nodes']:
                if tn['section'].startswith('chrome.') and tn['section'] != 'chrome.footer':
                    nodes.append(self.node(tn['section'], tn.get('variant'), None, len(nodes)))
            for s, v in FREE_PICKS[tid]:
                nodes.append(self.node(s, v, None, len(nodes)))
            for tn in t['nodes']:
                if tn['section'] == 'chrome.footer':
                    nodes.append(self.node(tn['section'], tn.get('variant'), None, len(nodes)))
        else:
            for tn in t['nodes']:
                if not tn.get('required'):
                    continue
                variant = tn.get('variant') or (tn['variants'][0] if tn.get('variants') else None)
                if variant is None and self.repo.sections[tn['section']].get('variantRequired'):
                    variant = self.repo.sections[tn['section']]['variants'][0]['id']
                nodes.append(self.node(tn['section'], variant, tn.get('contentRules'), len(nodes)))
        spec = {'pageSpecVersion': PAGESPEC_VERSION, 'mode': 'generated', 'route': '/', 'template': tid, 'nodes': nodes}
        spec['route'] = self.route_for(spec)
        return spec


def add_placeholder_url(spec):
    """Put one reserved-host URL in running text, where a text field takes markup (an article or legal body paragraph, else a FAQ answer)."""
    for n in spec['nodes']:
        c = n['content']
        for k in ('blocks', 'paragraphs', 'body', 'answer'):
            v = c.get(k)
            if isinstance(v, list) and v and isinstance(v[0], dict) and isinstance(v[0].get('text'), str):
                v[0]['text'] += f' Notes are kept at [the {BRAND} notes](https://notes.{BRAND.lower()}.example/start).'
                return True
    return False


def file_name(tid):
    return 'generated.' + tid.split('.', 1)[1] + '.pagespec.json'


def build_all(repo):
    syn = Synth(repo)
    out = {}
    for tid in sorted(repo.templates):
        spec = syn.page(tid)
        if tid in ('template.blog-post', 'template.legal-document'):
            add_placeholder_url(spec)
        out[tid] = spec
    return out


def dump(d):
    return json.dumps(d, indent=2, ensure_ascii=False) + '\n'


def build_index(specs):
    return {
        '$comment': 'GENERATED by schema/build_generated_examples.py. One mode "generated" PageSpec per template.',
        'brand': BRAND,
        'note': 'Each example is built from the template real node list and the section contracts with original placeholder copy for the fictional brand; it passes the Draft-07 schema and every semantic rule (verify_all.py generated_examples check) with zero source identity.',
        'families': {fam: sorted(t for t, f in FAMILY.items() if f == fam) for fam in sorted(set(FAMILY.values()))},
        'examples': {tid: {'file': file_name(tid), 'family': FAMILY[tid], 'route': specs[tid]['route'], 'nodes': len(specs[tid]['nodes'])} for tid in sorted(specs)},
    }


def main(argv):
    repo = sv.Repo()
    specs = build_all(repo)
    missing = sorted(set(repo.templates) - set(FAMILY))
    if missing:
        print('no family assigned for', missing)
        return 1
    files = {file_name(t): dump(s) for t, s in specs.items()}
    files['generated-index.json'] = dump(build_index(specs))
    if '--check' in argv:
        bad = [fn for fn, txt in files.items() if not os.path.exists(os.path.join(OUT, fn)) or open(os.path.join(OUT, fn), encoding='utf-8').read() != txt]
        extra = [fn for fn in os.listdir(OUT) if fn.startswith('generated.') and fn not in files] if os.path.isdir(OUT) else []
        for fn in bad + extra:
            print('DRIFT', fn)
        print('generated examples are up to date' if not bad and not extra else f'{len(bad) + len(extra)} generated example file(s) out of date')
        return 1 if bad or extra else 0
    os.makedirs(OUT, exist_ok=True)
    for fn, txt in files.items():
        with open(os.path.join(OUT, fn), 'w', encoding='utf-8') as f:
            f.write(txt)
    print(f'wrote {len(specs)} generated examples and the index to {os.path.relpath(OUT, ROOT)}')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv))
