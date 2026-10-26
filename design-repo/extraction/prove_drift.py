#!/usr/bin/env python3
"""prove_drift.py: proves every drift check in verify_all.py actually catches drift.

For each case it copies the design-repo to a scratch directory (OS temp dir), injects ONE kind of drift, runs the matching
check function from the scratch copy and requires it to FAIL, after first requiring the unmutated copy to pass that check.
Citation cases need a sibling source tree (the clone project folder next to design-repo/); without one they are reported
as SKIPPED, because verify_all.py itself only warns in that situation.

Usage:  python3 extraction/prove_drift.py [--scratch <empty dir>]   (default: a fresh directory in the OS temp dir)
        Exit 0 only when every case that ran failed as intended.
"""
import hashlib
import importlib.util
import json
import os
import shutil
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)


def load(root):
    spec = importlib.util.spec_from_file_location('verify_all_' + hashlib.md5(root.encode()).hexdigest()[:8], os.path.join(root, 'extraction', 'verify_all.py'))
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m


def edit(root, rel, fn):
    p = os.path.join(root, rel)
    if rel.endswith('.json'):
        d = json.load(open(p, encoding='utf-8'))
        fn(d)
        json.dump(d, open(p, 'w', encoding='utf-8'), indent=2)
    else:
        s = open(p, encoding='utf-8').read()
        open(p, 'w', encoding='utf-8').write(fn(s))


def first_cite_file(root):
    for dp, _, fns in os.walk(os.path.join(root, 'sections')):
        for fn in sorted(fns):
            return os.path.join('sections', fn)


def cases():
    C = []

    def add(name, check, mutate, needs_src=False):
        C.append((name, check, mutate, needs_src))

    sec = 'sections/block.Hero.json'
    add('allowlist: phantom section entry', 'check_allowlist', lambda r: edit(r, 'tokens/llm/component-allowlist.json', lambda d: d['sections'].__setitem__('block.Phantom', d['sections']['block.Hero'])))
    add('allowlist: contract file with no allowlist entry (orphan)', 'check_allowlist', lambda r: edit(r, 'tokens/llm/component-allowlist.json', lambda d: d['sections'].pop('block.Spacer')))
    add('allowlist: phantom primitive entry', 'check_allowlist', lambda r: edit(r, 'tokens/llm/component-allowlist.json', lambda d: d['primitives'].__setitem__('primitive.ghost', {'file': 'primitives/ghost.json'})))
    add('allowlist: orphan component contract', 'check_allowlist', lambda r: open(os.path.join(r, 'components', 'orphan.json'), 'w').write(json.dumps({'id': 'component.orphan'})))
    add('allowlist: contentFields drift from the contract', 'check_allowlist', lambda r: edit(r, 'tokens/llm/component-allowlist.json', lambda d: d['sections']['block.Hero']['contentFields'].append('inventedField')))
    add('allowlist: assetRoles drift from asset-roles.json', 'check_allowlist', lambda r: edit(r, 'tokens/llm/component-allowlist.json', lambda d: d['assetRoles'].append('photo.invented')))
    add('allowlist: schema assetRole enum drift', 'check_allowlist', lambda r: edit(r, 'schema/pagespec.schema.json', lambda d: d['definitions']['assetRole']['enum'].pop()))
    add('manifest: wrong sections count', 'check_manifest', lambda r: edit(r, 'registry.manifest.json', lambda d: d['counts'].__setitem__('sections', d['counts']['sections'] + 1)))
    add('manifest: wrong routes count', 'check_manifest', lambda r: edit(r, 'registry.manifest.json', lambda d: d['counts'].__setitem__('routes', 570)))
    add('manifest: wrong tokens count', 'check_manifest', lambda r: edit(r, 'registry.manifest.json', lambda d: d['counts'].__setitem__('tokens', 1)))
    add('manifest: allowlistVersion mismatch', 'check_manifest', lambda r: edit(r, 'registry.manifest.json', lambda d: d.__setitem__('allowlistVersion', '9.9.9')))
    add('manifest: entryPoint outside the package', 'check_manifest', lambda r: edit(r, 'registry.manifest.json', lambda d: d['entryPoints'].__setitem__('external', '../ia.json')))
    add('manifest: productionApproved true', 'check_manifest', lambda r: edit(r, 'registry.manifest.json', lambda d: d.__setitem__('productionApproved', True)))
    add('routes: route removed (gap)', 'check_routes', lambda r: edit(r, 'templates/routes.json', lambda d: d['routes'].pop(5)))
    add('routes: route listed twice (double assignment)', 'check_routes', lambda r: edit(r, 'templates/routes.json', lambda d: d['routes'].append(dict(d['routes'][0]))))
    add('routes: route assigned to a different template (count and chrome drift)', 'check_routes', lambda r: edit(r, 'templates/routes.json', lambda d: [x.__setitem__('template', 'template.lp') for x in d['routes'] if x['path'] == '/customers/canva']))
    add('routes: chrome of a route disagrees with its template', 'check_routes', lambda r: edit(r, 'templates/routes.json', lambda d: [x['chrome'].__setitem__('nav', 'inverted') for x in d['routes'] if x['path'] == '/platform']))
    add('routes: redirect pointing at another redirect', 'check_routes', lambda r: edit(r, 'templates/routes.json', lambda d: [x.__setitem__('redirectTo', '/data-portal-terms') for x in d['routes'] if x['path'] == '/spark-matrix-2023']))
    add('routes: real block order that breaks a graph rule (two heroes)', 'check_routes', lambda r: edit(r, 'templates/routes.json', lambda d: [x['blockOrder'].insert(1, {'section': 'block.HeroVideo'}) for x in d['routes'] if x['path'] == '/platform']))
    add('routes: template routeCount drift', 'check_routes', lambda r: edit(r, 'templates/templates.json', lambda d: d['templates']['template.home'].__setitem__('routeCount', 7)))
    add('routes: evidence stronger than the template allows', 'check_routes', lambda r: edit(r, 'templates/routes.json', lambda d: [x.__setitem__('evidenceLevel', 'measured') for x in d['routes'] if x.get('template') == 'template.event-summit']))
    add('graph: rule removed from the graph (validator still implements it)', 'check_graph', lambda r: edit(r, 'compatibility/graph.json', lambda d: d['rules'].pop(0)))
    add('graph: phantom rule id in the graph', 'check_graph', lambda r: edit(r, 'compatibility/graph.json', lambda d: d['rules'].append(dict(d['rules'][0], id='NO_SUCH_RULE'))))
    add('graph: exception without a name', 'check_graph', lambda r: edit(r, 'compatibility/graph.json', lambda d: [x['exceptions'][0].pop('id') for x in d['rules'] if x['id'] == 'HERO_FIRST']))
    add('asset roles: pinned customer-logo policy changed to a valid but wrong value', 'check_asset_roles', lambda r: edit(r, 'assets/asset-roles.json', lambda d: [x.__setitem__('generationPolicy', 'may-generate-new') for x in d['roles'] if x['id'] == 'logo.customer-placeholder']))
    add('asset roles: policy outside the closed enum', 'check_asset_roles', lambda r: edit(r, 'assets/asset-roles.json', lambda d: d['roles'][0].__setitem__('generationPolicy', 'anything-goes')))
    add('asset roles: pinned flag removed', 'check_asset_roles', lambda r: edit(r, 'assets/asset-roles.json', lambda d: [x.__setitem__('pinnedPolicy', False) for x in d['roles'] if x['id'] == 'photo.person']))
    add('tokens: styleTokens names a token that is not in the catalog', 'check_tokens', lambda r: edit(r, 'sections/block.Hero.json', lambda d: d['styleTokens'].append('role.invented')))
    add('tokens: catalog phantom name', 'check_tokens', lambda r: edit(r, 'tokens/llm/token-catalog.json', lambda d: d['keys']['semanticColor'].append('text.invented')))
    add('tokens: policy category that is not a catalog key', 'check_tokens', lambda r: edit(r, 'tokens/llm/token-policy.json', lambda d: d['rawValueRestrictions'].__setitem__('typography', 'x')))
    add('tokens: policy claims a PageSpec override field exists', 'check_tokens', lambda r: edit(r, 'tokens/llm/token-policy.json', lambda d: d['overrides'].__setitem__('pageSpecLevel', True)))
    add('sections: motion without a reducedMotionFallback', 'check_sections', lambda r: edit(r, sec, lambda d: d['motion']['patterns'][0].pop('reducedMotionFallback')))
    add('sections: invented scroll-reveal pattern on a section', 'check_sections', lambda r: edit(r, sec, lambda d: d['motion']['patterns'].append({'pattern': 'scroll-reveal-two-way', 'reducedMotionFallback': 'transition-unchanged'})))
    add('sections: text field without a maxWords budget', 'check_sections', lambda r: edit(r, sec, lambda d: d['content']['fields']['title'].pop('maxWords')))
    add('sections: prose-only responsive behaviour', 'check_sections', lambda r: edit(r, sec, lambda d: d['responsive'].__setitem__('breakpoints', ['desktop two columns, mobile one'])))
    add('templates: node that is a bare string', 'check_templates', lambda r: edit(r, 'templates/templates.json', lambda d: d['templates']['template.home']['nodes'].__setitem__(2, 'home.hero')))
    add('templates: chrome flag disagrees with the nodes', 'check_templates', lambda r: edit(r, 'templates/templates.json', lambda d: d['templates']['template.lp']['chrome'].__setitem__('nav', 'opaque')))
    add('self-containment: absolute machine path in the README', 'check_selfcontained', lambda r: edit(r, 'README.md', lambda s: s + '\nSee ' + '/Us' + 'ers/someone/project/design-repo\n'))
    add('self-containment: framework vocabulary in a contract field', 'check_selfcontained', lambda r: edit(r, sec, lambda d: d.__setitem__('purpose', 'Pass className through the props of the React component')))
    add('example: schema-invalid example', 'check_example', lambda r: edit(r, 'schema/example.pagespec.json', lambda d: d['nodes'][2]['content'].pop('title')))
    add('measured-values: partition drift', 'check_measured', lambda r: edit(r, 'extraction/measured-values.json', lambda d: d['classifierRuns']['partition'].__setitem__('template.home', 2)))
    add('measured-values: a correction that does not choose the implemented value', 'check_measured', lambda r: edit(r, 'extraction/measured-values.json', lambda d: d['corrections'][0].__setitem__('chosen', 'spec')))
    # citation drift (needs the sibling source tree)
    def out_of_range(d):
        d['evidence']['citations'][0]['ref'] = 'src/blocks/Hero.jsx:1-99999'
    def wrong_anchor(d):
        d['evidence']['citations'][0]['anchor'] = 'THIS TEXT IS NOT IN THE CITED RANGE'
    def missing_file(d):
        d['evidence']['citations'][0]['ref'] = 'src/blocks/NoSuchFile.jsx:1-2'
    add('citations: out-of-range line citation', 'check_citations', lambda r: edit(r, sec, out_of_range), True)
    add('citations: in-range citation whose anchor text is not in the range', 'check_citations', lambda r: edit(r, sec, wrong_anchor), True)
    add('citations: citation to a missing file', 'check_citations', lambda r: edit(r, sec, missing_file), True)
    add('citations: source.lines out of range of the real file', 'check_citations', lambda r: edit(r, sec, lambda d: d['source'].__setitem__('lines', '1-99999')), True)
    add('citations: source anchor that is not inside the cited range', 'check_citations', lambda r: edit(r, sec, lambda d: d['source'].__setitem__('anchor', 'THIS TEXT IS NOT IN THE SOURCE RANGE')), True)
    add('citations: source.file that does not exist', 'check_citations', lambda r: edit(r, sec, lambda d: d['source'].__setitem__('file', 'src/blocks/NoSuchFile.jsx')), True)
    add('ia crosswalk: semantic.id that is not in ia.json', 'check_ia_crosswalk', lambda r: edit(r, sec, lambda d: d['semantic'].__setitem__('id', 'hero.invented')), True)
    add('ia crosswalk: semantic category that ia.json contradicts', 'check_ia_crosswalk', lambda r: edit(r, sec, lambda d: d['semantic'].__setitem__('category', 'CONTENT')), True)
    # contract schema, retrieval pins, classification
    add('sections: invented key in a contract (closed contract schema)', 'check_sections', lambda r: edit(r, sec, lambda d: d.__setitem__('inventedKey', 1)))
    add('sections: source object removed', 'check_sections', lambda r: edit(r, sec, lambda d: d.pop('source')))
    add('sections: source.lines reversed', 'check_sections', lambda r: edit(r, sec, lambda d: d['source'].__setitem__('lines', '40-6')))
    add('sections: semantic.category outside the closed list', 'check_sections', lambda r: edit(r, sec, lambda d: d['semantic'].__setitem__('category', 'HEROISH')))
    add('sections: pinned utility (Spacer) made retrievable', 'check_sections', lambda r: edit(r, 'sections/block.Spacer.json', lambda d: (d.pop('retrievalEligible'), d.pop('retrievalIneligibleReason'))))
    add('sections: retrievalEligible as a string', 'check_sections', lambda r: edit(r, 'sections/block.Spacer.json', lambda d: d.__setitem__('retrievalEligible', 'false')))
    add('sections: retrievalEligible reason under 30 characters', 'check_sections', lambda r: edit(r, 'sections/block.Spacer.json', lambda d: d.__setitem__('retrievalIneligibleReason', 'layout only')))
    add('sections: retrievalEligible false on an unpinned section', 'check_sections', lambda r: edit(r, sec, lambda d: d.update({'retrievalEligible': False, 'retrievalIneligibleReason': 'Not a real reason but long enough to pass the length rule.'})))
    add('sections: runtime UI (cookie consent banner) section that is not pinned', 'check_sections', lambda r: open(os.path.join(r, 'sections', 'shared.cookie-consent-banner.json'), 'w').write(json.dumps(dict(json.load(open(os.path.join(r, 'sections', 'block.Spacer.json'))), id='shared.cookie-consent-banner', title='Cookie consent banner', retrievalEligible=True, retrievalIneligibleReason=None))))
    add('allowlist: retrievalEligible mirror drift', 'check_allowlist', lambda r: edit(r, 'tokens/llm/component-allowlist.json', lambda d: d['sections']['block.Spacer'].__setitem__('retrievalEligible', True)))
    add('allowlist: semanticCategory mirror drift', 'check_allowlist', lambda r: edit(r, 'tokens/llm/component-allowlist.json', lambda d: d['sections']['block.Hero'].__setitem__('semanticCategory', 'CONTENT')))
    add('classification: form section filed as CONTENT', 'check_classification', lambda r: edit(r, 'sections/shared.newsletter-band.json', lambda d: d['semantic'].update({'id': 'content.newsletter-band', 'category': 'CONTENT'})))
    add('classification: editorial feed filed as FEATURES', 'check_classification', lambda r: edit(r, 'sections/shared.related-content.json', lambda d: d['semantic'].__setitem__('category', 'FEATURES')))
    add('classification: graph hero list differs from the HERO sections', 'check_classification', lambda r: edit(r, 'compatibility/graph.json', lambda d: [x['params']['heroSections'].pop() for x in d['rules'] if x['id'] == 'ONE_HERO']))
    add('classification: two HERO sections in a fixed template', 'check_classification', lambda r: edit(r, 'templates/templates.json', lambda d: d['templates']['template.home']['nodes'].insert(3, {'section': 'block.Hero', 'required': False, 'repeatable': False})))
    add('classification: CTA-like copy without a review', 'check_classification', lambda r: edit(r, 'extraction/classification-review.json', lambda d: d['entries'].pop(0)))
    add('classification: stale review entry', 'check_classification', lambda r: edit(r, 'extraction/classification-review.json', lambda d: d['entries'].append(dict(d['entries'][0], section='block.Spacer'))))
    add('schema sync: hand-edited section content definition', 'check_schema_sync', lambda r: edit(r, 'schema/pagespec.schema.json', lambda d: d['definitions']['content']['block.Hero']['properties'].__setitem__('invented', {'type': 'string'})))
    add('schema sync: section enum drops a section', 'check_schema_sync', lambda r: edit(r, 'schema/pagespec.schema.json', lambda d: d['definitions']['node']['properties']['section']['enum'].pop()))
    add('provenance sync: hand-edited source.tag', 'check_provenance_sync', lambda r: edit(r, sec, lambda d: d['source'].__setitem__('tag', 'aside')))
    add('provenance sync: provenance map drops a section', 'check_provenance_sync', lambda r: edit(r, 'extraction/provenance-map.json', lambda d: d['sections'].pop('block.Hero')))
    # whole-page-wrapper gate
    add('wrapper gate: HERO over 3000px without a whitelist entry', 'check_wrapper', lambda r: edit(r, 'extraction/measured-values.json', lambda d: d['sectionHeights']['sections']['change.hero'].__setitem__('maxHeightPx', 4200)))
    add('wrapper gate: section over 60% of its page without a whitelist entry', 'check_wrapper', lambda r: edit(r, 'extraction/measured-values.json', lambda d: [x.__setitem__('heightPx', int(d['sectionHeights']['pages']['template.brand']['pageHeightPx'] * 0.7)) for x in d['sectionHeights']['pages']['template.brand']['sections'] if x['section'] == 'brand.logos']))
    add('wrapper gate: missing section measurement', 'check_wrapper', lambda r: edit(r, 'extraction/measured-values.json', lambda d: d['sectionHeights']['sections'].pop('brand.logos')))
    add('wrapper gate: missing template page measurement', 'check_wrapper', lambda r: edit(r, 'extraction/measured-values.json', lambda d: d['sectionHeights']['pages'].pop('template.brand')))
    add('wrapper gate: sectionHeights removed', 'check_wrapper', lambda r: edit(r, 'extraction/measured-values.json', lambda d: d.pop('sectionHeights')))
    add('wrapper gate: whitelist justification under 30 characters', 'check_wrapper', lambda r: edit(r, 'extraction/wrapper-whitelist.json', lambda d: d['entries'][0].__setitem__('justification', 'one page only')))
    add('wrapper gate: whitelist entry without reviewedBy', 'check_wrapper', lambda r: edit(r, 'extraction/wrapper-whitelist.json', lambda d: d['entries'][0].pop('reviewedBy')))
    add('wrapper gate: whitelist ceiling below the measured height', 'check_wrapper', lambda r: edit(r, 'extraction/wrapper-whitelist.json', lambda d: d['entries'][0].__setitem__('maxHeightPx', 100)))
    add('wrapper gate: stale whitelist entry', 'check_wrapper', lambda r: edit(r, 'extraction/wrapper-whitelist.json', lambda d: d['entries'].append({'kind': 'hero-height', 'section': 'home.hero', 'maxHeightPx': 9000, 'reviewedBy': 'x', 'attestation': 'agent', 'reviewedOn': '2026-10-23', 'justification': 'A stale entry that must be rejected by the gate.'})))
    add('manifest: wrapperWhitelistEntries count drift', 'check_manifest', lambda r: edit(r, 'registry.manifest.json', lambda d: d['counts'].__setitem__('wrapperWhitelistEntries', 99)))
    add('manifest: heroSections count drift', 'check_manifest', lambda r: edit(r, 'registry.manifest.json', lambda d: d['counts'].__setitem__('heroSections', 99)))
    # generation context: mode, asset availability pins, source brand registry, generated examples, enforcement
    def rep(old, new):
        def go(t):
            if old not in t:
                raise SystemExit(f'drift target not found: {old[:60]!r}')
            return t.replace(old, new, 1)
        return go

    def role(rid, fn):
        return lambda r: edit(r, 'assets/asset-roles.json', lambda d: fn(next(x for x in d['roles'] if x['id'] == rid)))

    def sb(fn):
        return lambda r: edit(r, 'assets/asset-roles.json', lambda d: fn(d['sourceBrand']))
    wm = 'brand.wordmark-placeholder'
    add('mode: removed from the required list of the schema', 'check_mode', lambda r: edit(r, 'schema/pagespec.schema.json', lambda d: d['required'].remove('mode')))
    add('mode: enum widened with an invented value', 'check_mode', lambda r: edit(r, 'schema/pagespec.schema.json', lambda d: d['properties']['mode']['enum'].append('draft')))
    add('mode: the allowlist drops mode', 'check_mode', lambda r: edit(r, 'tokens/llm/component-allowlist.json', lambda d: d['pageSpecProperties'].remove('mode')))
    add('mode: the schema generator no longer builds the mode property (schema differs from the generator)', 'check_schema_sync', lambda r: edit(r, 'schema/pagespec.schema.json', lambda d: d['properties'].pop('mode')))
    add('availability: the clone wordmark made generation-safe in the registry', 'check_asset_roles', role(wm, lambda x: x.__setitem__('availability', 'generation-safe')))
    add('availability: person photographs made generation-safe in the registry', 'check_asset_roles', role('photo.person', lambda x: x.__setitem__('availability', 'generation-safe')))
    add('availability: a generation-safe role downgraded in the registry', 'check_asset_roles', role('photo.environment', lambda x: x.__setitem__('availability', 'reference-only')))
    add('availability: value outside the closed enum', 'check_asset_roles', role('photo.environment', lambda x: x.__setitem__('availability', 'free-for-all')))
    add('availability: generationSafeSubstitutes removed from a blocked role', 'check_asset_roles', role('photo.person', lambda x: x.__setitem__('generationSafeSubstitutes', [])))
    add('availability: generatedModeGuidance removed from a role', 'check_asset_roles', role('photo.person', lambda x: x.pop('generatedModeGuidance')))
    add('availability: a role added to the registry without a code pin', 'check_asset_roles', lambda r: edit(r, 'assets/asset-roles.json', lambda d: d['roles'].append(dict(d['roles'][0], id='photo.extra'))))
    add('availability: a pin entry removed from verify_all.py', 'check_asset_roles', lambda r: edit(r, 'extraction/verify_all.py', rep("    'photo.person': 'blocked-for-generation',\n    'artboard.product-ui'", "    'artboard.product-ui'")))
    add('availability: a pin entry removed from semantic_validate.py', 'check_asset_roles', lambda r: edit(r, 'schema/semantic_validate.py', rep(" 'brand.wordmark-placeholder': 'reference-only',\n", "\n")))
    add('availability: a pin loosened in semantic_validate.py only', 'check_asset_roles', lambda r: edit(r, 'schema/semantic_validate.py', rep("'photo.person': 'blocked-for-generation'", "'photo.person': 'generation-safe'")))
    add('availability: a pin loosened in verify_all.py together with the registry (semantic_validate.py still pins the old value)', 'check_asset_roles', lambda r: (role('photo.person', lambda x: x.__setitem__('availability', 'generation-safe'))(r), edit(r, 'extraction/verify_all.py', rep("    'photo.person': 'blocked-for-generation',\n    'artboard.product-ui'", "    'photo.person': 'generation-safe',\n    'artboard.product-ui'"))))
    def flip_all(r):
        role(wm, lambda x: x.__setitem__('availability', 'generation-safe'))(r)
        edit(r, 'sections/chrome.footer.json', lambda d: d['generatedAssetRoles'].append(wm))
        edit(r, 'tokens/llm/component-allowlist.json', lambda d: d['sections']['chrome.footer']['generatedAssetRoles'].append(wm))
        edit(r, 'schema/semantic_validate.py', rep("'brand.wordmark-placeholder': 'reference-only'", "'brand.wordmark-placeholder': 'generation-safe'"))
    add('availability: registry, contract, allowlist and the validator pin flipped together (verify_all.py still pins the real value)', 'check_asset_roles', flip_all)
    add('contracts: generatedAssetRoles lists a reference-only role', 'check_sections', lambda r: edit(r, 'sections/chrome.footer.json', lambda d: d['generatedAssetRoles'].append(wm)))
    add('contracts: generatedAssetRoles removed', 'check_sections', lambda r: edit(r, 'sections/chrome.footer.json', lambda d: d.pop('generatedAssetRoles')))
    add('contracts: generatedAssetRoles drift in the provenance generator output', 'check_provenance_sync', lambda r: edit(r, 'sections/chrome.footer.json', lambda d: d['generatedAssetRoles'].append('photo.environment')))
    add('allowlist: generatedAssetRoles mirror drift', 'check_provenance_sync', lambda r: edit(r, 'tokens/llm/component-allowlist.json', lambda d: d['sections']['chrome.footer'].__setitem__('generatedAssetRoles', [])))
    add('source brand: brand patterns emptied', 'check_source_brand', sb(lambda x: x['categories']['brand'].__setitem__('patterns', [])))
    add('source brand: the brand pattern loosened until it no longer matches its own sample', 'check_source_brand', sb(lambda x: x['categories']['brand']['patterns'][0].__setitem__('pattern', 'zzzz')))
    add('source brand: the clone stand-in brand pattern removed', 'check_source_brand', sb(lambda x: x['categories']['brand']['patterns'].pop(1)))
    add('source brand: a pattern broadened until it matches a harmless sample', 'check_source_brand', sb(lambda x: x['categories']['brand']['patterns'][0].__setitem__('pattern', 'water|shed|larkwell|[a-z]')))
    add('source brand: customer patterns cut below the pinned minimum', 'check_source_brand', sb(lambda x: x['categories']['customer'].__setitem__('patterns', x['categories']['customer']['patterns'][:5])))
    add('source brand: a required category removed', 'check_source_brand', sb(lambda x: x['categories'].pop('person')))
    add('source brand: CTA patterns removed', 'check_source_brand', sb(lambda x: x['categories']['cta'].__setitem__('patterns', [])))
    add('source brand: URL patterns removed', 'check_source_brand', sb(lambda x: x['categories']['url'].__setitem__('patterns', [])))
    add('source brand: rating patterns removed', 'check_source_brand', sb(lambda x: x['categories']['rating'].__setitem__('patterns', [])))
    add('source brand: reviewStatus claims a human review', 'check_source_brand', sb(lambda x: x.__setitem__('reviewStatus', 'Reviewed and approved by a human.')))
    add('source brand: copy shingles emptied', 'check_source_brand', lambda r: edit(r, 'assets/source-copy-hashes.json', lambda d: d.__setitem__('copyShingles', [])))
    add('source brand: canaries removed', 'check_source_brand', sb(lambda x: x['copy'].__setitem__('canaries', [])))
    add('source brand: a canary that is no longer in the shingle set', 'check_source_brand', sb(lambda x: x['copy']['canaries'].__setitem__(0, 'this sentence was never in the source at all')))
    add('source brand: one pattern description edited (registry differs from what build_source_brand.py derives)', 'check_source_brand', sb(lambda x: x['categories']['customer']['patterns'][0].__setitem__('description', 'edited by hand')), True)
    add('source brand: a source customer pattern deleted (registry differs from what build_source_brand.py derives)', 'check_source_brand', lambda r: edit(r, 'assets/asset-roles.json', lambda d: (d['sourceBrand']['categories']['customer']['patterns'].pop(6), d['sourceBrand']['counts'].__setitem__('patterns', d['sourceBrand']['counts']['patterns'] - 1), d['sourceBrand']['counts']['byCategory'].__setitem__('customer', d['sourceBrand']['counts']['byCategory']['customer'] - 1))), True)
    add('generated examples: the home example deleted', 'check_generated_examples', lambda r: os.remove(os.path.join(r, 'schema', 'examples', 'generated.home.pagespec.json')))
    add('generated examples: an example relabelled reference', 'check_generated_examples', lambda r: edit(r, 'schema/examples/generated.lp.pagespec.json', lambda d: d.__setitem__('mode', 'reference')))
    add('generated examples: the source brand written into an example', 'check_generated_examples', lambda r: edit(r, 'schema/examples/generated.blog-post.pagespec.json', lambda d: [n['content'].__setitem__('title', 'Why Watershed') for n in d['nodes'] if n['section'] == 'shared.post-hero']))
    add('generated examples: a person photograph role written into an example', 'check_generated_examples', lambda r: edit(r, 'schema/examples/generated.blog-post.pagespec.json', lambda d: [n['content']['image'].__setitem__('assetRole', 'photo.person') for n in d['nodes'] if n['section'] == 'shared.post-hero']))
    add('generated examples: an example hand-edited (differs from the builder)', 'check_generated_examples', lambda r: edit(r, 'schema/examples/generated.lp.pagespec.json', lambda d: [n['content'].__setitem__('title', 'Amber ' + ' '.join(n['content']['title'].split()[1:])) for n in d['nodes'] if isinstance(n['content'].get('title'), str)][:1]))
    add('generated examples: the family index drops a family', 'check_generated_examples', lambda r: edit(r, 'schema/examples/generated-index.json', lambda d: d['families'].pop('legal')))
    add('enforcement: generated-mode rules made a no-op in semantic_validate.py', 'check_generated_enforcement', lambda r: edit(r, 'schema/semantic_validate.py', rep("    if ctx.spec.get('mode') != 'generated':\n        return\n    repo = ctx.repo\n    pats", "    return\n    repo = ctx.repo\n    pats")))
    add('enforcement: the source pattern scan skipped in semantic_validate.py', 'check_generated_enforcement', lambda r: edit(r, 'schema/semantic_validate.py', rep("            for pid, rx in pats.get(cat, []):\n                m = rx.search(text)", "            for pid, rx in []:\n                m = rx.search(text)")))
    add('enforcement: shingle matching removed from semantic_validate.py', 'check_generated_enforcement', lambda r: edit(r, 'schema/semantic_validate.py', rep("            if shingle_hash(w[i:i + SHINGLE_WORDS]) in sh:", "            if False:")))
    add('enforcement: asset availability ignored in the generated asset walk', 'check_generated_enforcement', lambda r: edit(r, 'schema/semantic_validate.py', rep("            if av != 'generation-safe':", "            if False:")))
    add('enforcement: text normalisation (NFKC, zero-width) removed', 'check_generated_enforcement', lambda r: edit(r, 'schema/semantic_validate.py', rep("    s = unicodedata.normalize('NFKC', str(s))\n    s = ZERO_WIDTH_RE.sub('', s)", "    s = str(s)")))
    add('enforcement: a reserved-host exemption widened to every host', 'check_generated_enforcement', lambda r: edit(r, 'schema/semantic_validate.py', rep("            if not host or not RESERVED_HOST_RE.search(host):", "            if False:")))
    add('manifest: generatedExamples count drift', 'check_manifest', lambda r: edit(r, 'registry.manifest.json', lambda d: d['counts'].__setitem__('generatedExamples', 3)))
    add('manifest: sourceBrandPatterns count drift', 'check_manifest', lambda r: edit(r, 'registry.manifest.json', lambda d: d['counts'].__setitem__('sourceBrandPatterns', 3)))
    add('manifest: assetRoles count drift', 'check_manifest', lambda r: edit(r, 'registry.manifest.json', lambda d: d['counts'].__setitem__('assetRoles', 14)))
    return C


def main():
    if '--scratch' in sys.argv:
        base = os.path.abspath(sys.argv[sys.argv.index('--scratch') + 1])
        if os.path.exists(base) and os.listdir(base):
            raise SystemExit(f'--scratch {base} must be empty or not exist')
        os.makedirs(base, exist_ok=True)
        own = False
    else:
        base = tempfile.mkdtemp(prefix='dr_drift_')
        own = True
    ran = failed = skipped = 0
    try:
        v0 = load(ROOT)
        has_src = v0.find_src_root(ROOT) is not None
        for name, check, mutate, needs_src in cases():
            if needs_src and not has_src:
                print(f'SKIP  {name} (no sibling source tree)')
                skipped += 1
                continue
            dst = os.path.join(base, 'design-repo')
            if os.path.exists(dst):
                shutil.rmtree(dst)
            shutil.copytree(ROOT, dst, ignore=shutil.ignore_patterns('__pycache__', '*.zip'))
            if needs_src:
                # the scratch copy must still sit next to the source tree for citation resolution
                os.symlink(os.path.join(os.path.dirname(ROOT), 'src'), os.path.join(base, 'src'))
                os.symlink(os.path.join(os.path.dirname(ROOT), 'PAGES_SPEC.md'), os.path.join(base, 'PAGES_SPEC.md'))
                for extra in ('CLONE_SPEC.md', 'ASSET_MANIFEST.md', 'IMAGE_CREDITS.md', 'tailwind.config.js', 'package.json', 'ia.json'):
                    s = os.path.join(os.path.dirname(ROOT), extra)
                    if os.path.exists(s):
                        os.symlink(s, os.path.join(base, extra))
            vclean = load(dst)
            before, _ = getattr(vclean, check)(dst)
            if before:
                print(f'BASE  {name}: the unmutated copy already fails {check}: {before[:1]}')
                failed += 1
                continue
            mutate(dst)
            vmut = load(dst)
            after, _ = getattr(vmut, check)(dst)
            ran += 1
            if after:
                print(f'OK    {check:20} caught: {name}')
            else:
                print(f'MISS  {check:20} did NOT catch: {name}')
                failed += 1
            for link in ('src', 'PAGES_SPEC.md', 'CLONE_SPEC.md', 'ASSET_MANIFEST.md', 'IMAGE_CREDITS.md', 'tailwind.config.js', 'package.json', 'ia.json'):
                p = os.path.join(base, link)
                if os.path.islink(p):
                    os.unlink(p)
    finally:
        if own:
            shutil.rmtree(base, ignore_errors=True)
        else:
            shutil.rmtree(os.path.join(base, 'design-repo'), ignore_errors=True)
    print(f'drift cases run: {ran}, caught: {ran - failed if failed <= ran else 0}, skipped: {skipped}, problems: {failed}')
    return 1 if failed else 0


if __name__ == '__main__':
    sys.exit(main())
