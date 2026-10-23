#!/usr/bin/env python3
"""prove_drift.py: proves every drift check in verify_all.py actually catches drift.

For each case it copies the design-repo to a scratch directory (OS temp dir), injects ONE kind of drift, runs the matching
check function from the scratch copy and requires it to FAIL, after first requiring the unmutated copy to pass that check.
Citation cases need a sibling source tree (the clone project folder next to design-repo/); without one they are reported
as SKIPPED, because verify_all.py itself only warns in that situation.

Usage:  python3 extraction/prove_drift.py          Exit 0 only when every case that ran failed as intended.
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
    return C


def main():
    base = tempfile.mkdtemp(prefix='dr_drift_')
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
                for extra in ('CLONE_SPEC.md', 'ASSET_MANIFEST.md', 'IMAGE_CREDITS.md', 'tailwind.config.js', 'package.json'):
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
            for link in ('src', 'PAGES_SPEC.md', 'CLONE_SPEC.md', 'ASSET_MANIFEST.md', 'IMAGE_CREDITS.md', 'tailwind.config.js', 'package.json'):
                p = os.path.join(base, link)
                if os.path.islink(p):
                    os.unlink(p)
    finally:
        shutil.rmtree(base, ignore_errors=True)
    print(f'drift cases run: {ran}, caught: {ran - failed if failed <= ran else 0}, skipped: {skipped}, problems: {failed}')
    return 1 if failed else 0


if __name__ == '__main__':
    sys.exit(main())
