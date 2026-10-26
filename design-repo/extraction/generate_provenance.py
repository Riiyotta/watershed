#!/usr/bin/env python3
"""Generates the distinct `source` and `semantic` objects (and the retrieval flag) of every section contract, and mirrors them
into tokens/llm/component-allowlist.json. The contracts are the data; this script is how they were produced and how they are refreshed.

  semantic = taxonomy      {id, category}                     from extraction/provenance-map.json (category is a closed enum)
  source   = provenance    {id, tag, file, lines, anchor}     id: implementing component or fragment; tag: rendered root element from
                           extraction/measured-values.json (sectionHeights.sections[*].tag); file/lines/anchor: by default the first src/
                           citation of the contract, or an explicit override in the map. verify_all.py resolves every range against the real file.
  generatedAssetRoles      roles a mode "generated" page may use in the section: the generation-safe roles its fields allow plus the
                           generation-safe substitutes of the reference-only / blocked ones (assets/asset-roles.json availability)
  retrievalEligible        false only for the pinned layout/runtime utilities listed in the map, each with a reason of 30+ characters.

The old free-form `category` field (and constraints.category) is removed: semantic.category is the single taxonomy.

Usage:  python3 extraction/generate_provenance.py            rewrite contracts and allowlist in place
        python3 extraction/generate_provenance.py --check    exit 1 when anything on disk differs from what would be generated
"""
import glob
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
FN_RE = re.compile(r'function\s+(\w+)')
LEAD = ['id', 'kind', 'title', 'purpose', 'semantic', 'source', 'retrievalEligible', 'retrievalIneligibleReason']


def jload(rel):
    with open(os.path.join(ROOT, rel), encoding='utf-8') as f:
        return json.load(f)


def dump(rel, d):
    with open(os.path.join(ROOT, rel), 'w', encoding='utf-8') as f:
        json.dump(d, f, indent=2, ensure_ascii=False)
        f.write('\n')


def first_src_citation(c):
    for x in c['evidence']['citations'] + c['responsive']['citations']:
        if x['ref'].startswith('src/'):
            file, rng = x['ref'].rsplit(':', 1)
            return file, rng, x['anchor']
    raise ValueError(f'{c["id"]}: no src/ citation to derive the source from')


def build_source(sid, c, entry, tags):
    s = entry.get('source', {})
    if 'override' in s:
        o = s['override']
        file, rng, anchor = o['file'], f'{o["lines"][0]}-{o["lines"][1]}', o['anchor']
    else:
        file, rng, anchor = first_src_citation(c)
        if '-' not in rng:
            rng = f'{rng}-{rng}'
    sid_src = s.get('id')
    if not sid_src:
        m = FN_RE.search(anchor)
        if not m:
            raise ValueError(f'{sid}: cannot derive source.id from anchor {anchor!r}; give source.id in the map')
        sid_src = m.group(1)
    tag = tags.get(sid, {}).get('tag')
    if not tag:
        raise ValueError(f'{sid}: no rendered tag in measured-values.json sectionHeights (run extraction/measure_section_heights.mjs)')
    return {'id': sid_src, 'tag': tag, 'file': file, 'lines': rng, 'anchor': anchor}


def field_roles(fields):
    """Every asset field's allowedRoles, in order of appearance (the reference-mode role set of a section)."""
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


def generated_roles(allowed, avail, subs):
    """What a mode "generated" page may use in a field that allows `allowed`: the generation-safe roles themselves plus the
    generation-safe substitutes of every reference-only or blocked role. Same rule as schema/semantic_validate.py generated_field_roles()."""
    out = set()
    for r in allowed:
        if avail[r] == 'generation-safe':
            out.add(r)
        else:
            out.update(x for x in subs[r] if avail[x] == 'generation-safe')
    return out


def build_generated_roles(c, avail, subs):
    out = set()
    for allowed in field_roles(c['content']['fields']):
        out |= generated_roles(allowed, avail, subs)
    return sorted(out)


def build_contract(sid, c, entry, tags, ret, roles):
    out = {k: v for k, v in c.items() if k not in ('category', 'semantic', 'source', 'retrievalEligible', 'retrievalIneligibleReason', 'generatedAssetRoles')}
    out['generatedAssetRoles'] = build_generated_roles(c, roles[0], roles[1])
    out['constraints'] = {k: v for k, v in c['constraints'].items() if k != 'category'}
    out['semantic'] = dict(entry['semantic'])
    out['source'] = build_source(sid, c, entry, tags)
    if sid in ret:
        out['retrievalEligible'] = False
        out['retrievalIneligibleReason'] = ret[sid]
    ordered = {k: out[k] for k in LEAD if k in out}
    for k, v in out.items():
        if k not in ordered and k != 'generatedAssetRoles':
            ordered[k] = v
            if k == 'assetRoles':
                ordered['generatedAssetRoles'] = out['generatedAssetRoles']
    return ordered


def allowlist_entry(rel, d):
    e = {
        'file': rel,
        'settableNodeProperties': ['section', 'variant', 'content', 'motion'] if d['variants'] else ['section', 'content', 'motion'],
        'contentFields': sorted(d['content']['fields']),
        'variants': [v['id'] for v in d['variants']],
        'motionPatterns': [p['pattern'] for p in d['motion']['patterns']],
        'assetRoles': d['assetRoles'],
        'generatedAssetRoles': d['generatedAssetRoles'],
        'semanticCategory': d['semantic']['category'],
        'retrievalEligible': d.get('retrievalEligible', True),
    }
    return e


def generate():
    pm = jload('extraction/provenance-map.json')
    mv = jload('extraction/measured-values.json')
    tags = mv['sectionHeights']['sections']
    ret = pm['retrievalIneligible']
    contracts = {}
    for p in sorted(glob.glob(os.path.join(ROOT, 'sections', '*.json'))):
        c = json.load(open(p, encoding='utf-8'))
        contracts[c['id']] = (os.path.relpath(p, ROOT), c)
    missing = sorted(set(contracts) - set(pm['sections']))
    extra = sorted(set(pm['sections']) - set(contracts))
    if missing or extra:
        raise ValueError(f'provenance-map.json does not match sections/: missing {missing}, extra {extra}')
    for sid in ret:
        if sid not in contracts:
            raise ValueError(f'retrievalIneligible names unknown section {sid}')
    reg = jload('assets/asset-roles.json')['roles']
    roles = ({r['id']: r['availability'] for r in reg}, {r['id']: r['generationSafeSubstitutes'] for r in reg})
    new = {}
    for sid, (rel, c) in contracts.items():
        new[sid] = (rel, build_contract(sid, c, pm['sections'][sid], tags, ret, roles))
    al = jload('tokens/llm/component-allowlist.json')
    al_new = json.loads(json.dumps(al))
    al_new['sections'] = {sid: allowlist_entry(rel, d) for sid, (rel, d) in sorted(new.items())}
    al_new['semanticCategories'] = pm['semanticCategories']
    al_new['retrievalIneligibleSections'] = sorted(ret)
    return contracts, new, al, al_new


def main(argv):
    try:
        contracts, new, al, al_new = generate()
    except ValueError as e:
        print(f'ERROR {e}')
        return 1
    drift = [sid for sid in new if new[sid][1] != contracts[sid][1]]
    al_drift = al != al_new
    if '--check' in argv:
        for sid in drift:
            print('DRIFT contract', sid)
        if al_drift:
            print('DRIFT tokens/llm/component-allowlist.json')
        print('provenance is in sync' if not drift and not al_drift else f'{len(drift)} contract(s) out of date')
        return 1 if drift or al_drift else 0
    for sid in drift:
        dump(new[sid][0], new[sid][1])
    if al_drift:
        dump('tokens/llm/component-allowlist.json', al_new)
    print(f'rewrote {len(drift)} contract(s); allowlist {"updated" if al_drift else "unchanged"}')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv))
