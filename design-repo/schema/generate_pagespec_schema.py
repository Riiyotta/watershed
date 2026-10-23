#!/usr/bin/env python3
"""Regenerates the per-section parts of schema/pagespec.schema.json from the section contracts, so the schema can never
silently disagree with them.

Generated (from sections/*.json, tokens/llm/*, assets/asset-roles.json, templates/templates.json):
  definitions.content[<section>]   closed object schema built from the contract's content.fields
  definitions.motion[<section>]    allowed (pattern, reducedMotionFallback) pairs from the contract's motion.patterns
  definitions.node.allOf           one if/then per section (variant enum, variant required or forbidden)
  definitions.node.properties.section.enum, properties.template.enum
Everything else in the schema (motionAny, assetRole, tone enum, route pattern, top-level rules) is kept as is.

Usage:  python3 schema/generate_pagespec_schema.py            rewrite the schema in place
        python3 schema/generate_pagespec_schema.py --check    exit 1 and print the drift when the schema is out of date
Paths derive from this file; nothing depends on the machine.
"""
import glob
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
TONES = ['neutral', 'cool', 'warm', 'dark']


def load_contracts(root):
    out = {}
    for p in sorted(glob.glob(os.path.join(root, 'sections', '*.json'))):
        d = json.load(open(p, encoding='utf-8'))
        out[d['id']] = d
    return out


class Gen:
    def __init__(self, schema):
        self.role = schema['definitions']['assetRole']
        self.route_pat = schema['definitions']['content']['block.Hero']['properties']['primary']['properties']['to']['pattern']

    def conv(self, f):
        t = f['type']
        if t == 'text':
            return {'type': 'string', 'minLength': 1}
        if t == 'cell':
            return {'type': ['string', 'boolean']}
        if t == 'link':
            return {'type': 'object', 'required': ['label', 'to'], 'additionalProperties': False,
                    'properties': {'label': {'type': 'string', 'minLength': 1}, 'to': {'type': 'string', 'pattern': self.route_pat}}}
        if t == 'route':
            return {'type': 'string', 'pattern': self.route_pat}
        if t == 'enum':
            return {'type': 'string', 'enum': f['values']}
        if t == 'boolean':
            return {'type': 'boolean'}
        if t == 'integer':
            r = {'type': 'integer'}
            if 'minimum' in f:
                r['minimum'] = f['minimum']
            if 'maximum' in f:
                r['maximum'] = f['maximum']
            return r
        if t == 'list':
            r = {'type': 'array', 'items': self.conv(f['items'])}
            if f.get('minItems'):
                r['minItems'] = f['minItems']
            if 'maxItems' in f:
                r['maxItems'] = f['maxItems']
            return r
        if t == 'object':
            return self.obj(f['fields'])
        if t == 'oneOf':
            return {'oneOf': [self.obj(o['fields']) for o in f['options']]}
        if t == 'asset':
            p = {'assetRole': self.role, 'tone': {'type': 'string', 'enum': TONES}}
            if f.get('altText', True):
                p['alt'] = {'type': 'string', 'minLength': 1}
            return {'type': 'object', 'required': ['assetRole'], 'additionalProperties': False, 'properties': p}
        raise ValueError(f'unknown field type {t}')

    def obj(self, fields):
        r = {'type': 'object', 'properties': {k: self.conv(v) for k, v in fields.items()}, 'additionalProperties': False}
        req = [k for k, v in fields.items() if v.get('required')]
        if req:
            r['required'] = req
        return r


def node_rule(sid, c):
    then = {'properties': {'content': {'$ref': f'#/definitions/content/{sid}'}, 'motion': {'$ref': f'#/definitions/motion/{sid}'}}}
    if c['variants']:
        then['properties']['variant'] = {'type': 'string', 'enum': [v['id'] for v in c['variants']]}
        if c['variantRequired']:
            then['required'] = ['variant']
    else:
        then['not'] = {'required': ['variant']}
    return {'if': {'properties': {'section': {'const': sid}}, 'required': ['section']}, 'then': then}


def generate(root):
    schema = json.load(open(os.path.join(root, 'schema', 'pagespec.schema.json'), encoding='utf-8'))
    contracts = load_contracts(root)
    g = Gen(schema)
    ids = sorted(contracts)
    # stable order: sections already in the schema keep their position, new ones follow alphabetically (keeps diffs small)
    prior = list(schema['definitions']['content'])
    order = [s for s in prior if s in contracts] + [s for s in ids if s not in prior]
    d = schema['definitions']
    d['content'] = {sid: g.obj(contracts[sid]['content']['fields']) for sid in order}
    d['motion'] = {sid: {'anyOf': [{'properties': {'pattern': {'const': p['pattern']}, 'reducedMotionFallback': {'const': p['reducedMotionFallback']}}}
                                   for p in contracts[sid]['motion']['patterns']]} for sid in order}
    d['node']['allOf'] = [node_rule(sid, contracts[sid]) for sid in order]
    d['node']['properties']['section']['enum'] = ids
    schema['properties']['template']['enum'] = sorted(json.load(open(os.path.join(root, 'templates', 'templates.json'), encoding='utf-8'))['templates'])
    return schema


def canon(schema):
    """Order-insensitive view used by --check (allOf is a conjunction, so its order carries no meaning)."""
    s = json.loads(json.dumps(schema))
    s['definitions']['node']['allOf'] = {r['if']['properties']['section']['const']: r for r in s['definitions']['node']['allOf']}
    return s


def main(argv):
    root = ROOT
    path = os.path.join(root, 'schema', 'pagespec.schema.json')
    new = generate(root)
    if '--check' in argv:
        cur = json.load(open(path, encoding='utf-8'))
        a, b = canon(cur), canon(new)
        if a == b:
            print('schema is in sync with the section contracts')
            return 0
        for part in ('content', 'motion'):
            for sid in sorted(set(a['definitions'][part]) | set(b['definitions'][part])):
                if a['definitions'][part].get(sid) != b['definitions'][part].get(sid):
                    print(f'DRIFT definitions.{part}.{sid}')
        for sid in sorted(set(a['definitions']['node']['allOf']) | set(b['definitions']['node']['allOf'])):
            if a['definitions']['node']['allOf'].get(sid) != b['definitions']['node']['allOf'].get(sid):
                print(f'DRIFT node.allOf {sid}')
        if a['definitions']['node']['properties']['section']['enum'] != b['definitions']['node']['properties']['section']['enum']:
            print('DRIFT node.properties.section.enum')
        if a['properties']['template']['enum'] != b['properties']['template']['enum']:
            print('DRIFT properties.template.enum')
        return 1
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(new, f, indent=2, ensure_ascii=False)
        f.write('\n')
    print(f'wrote {path}: {len(new["definitions"]["content"])} sections')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv))
