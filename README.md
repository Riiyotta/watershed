# Northwind site clone

A React 18 + Vite + Tailwind 3 clone of the layout, typography and motion of a real marketing site (en-GB), filled with original placeholder content for a fictional company, "Northwind". It has 571 routes, all served under `/en-GB`.

```bash
npm install
npm run dev        # http://localhost:5173/en-GB/ (pick another port with: npx vite --port 5241)
npm run build
```

## Information architecture

`ia.json` is the single source of truth for the site's structure: 64 templates, 111 sections, 571 routes. Every section is described once and referenced by id from the templates that use it.

| file | what it is |
|---|---|
| `ia.json` | the data. The only file to hand-edit. |
| `IA.md` | generated: share table, section reuse, per-template section tables, section reference |
| `matrix.csv` | generated: section × template matrix |
| `validate.mjs`, `build.mjs` | skill scripts. They read `ia.json` and hold no project-specific numbers. |
| `scripts/ia/` | optional generator that rebuilds `ia.json` from the code (see below) |

```bash
node validate.mjs && node build.mjs     # after any edit to ia.json
node scripts/ia/gen.mjs                 # after the code changes: re-derive ia.json (overwrites it)
```

`scripts/ia/gen.mjs` reads `src/routes.json`, the page definitions in `src/content/pages`, the variant checks in `src/content` (story variant, summit events, redirects, posts with a table of contents) and the per-route chrome rules in `src/layouts/chrome.js`. It fails if the template partition does not cover every route exactly once. Section descriptions live in `scripts/ia/catalog.mjs`; edit them there if you use the generator, because it overwrites `ia.json`. If you only hand-edit `ia.json`, do not run the generator afterwards.

## What the data shows

- **87% of routes come from four generated collections.** 496 of 571 routes are blog posts (251), events (180), customer stories (51) and guides (14). Eight templates render them. The build effort is in the other 75 routes: 46 of the 64 templates have exactly one route.
- **Product pages are one renderer with many compositions.** The 30 product routes share a block renderer and draw on 49 block types, but 28 pages (two are redirects) fall into 24 distinct block orders. Reuse lives at the block level, not the template level.
- **54 sections are shared across templates and 57 are page-local.** Keep the page-local ones local until a second caller appears. The shell sections (nav, footer, promo bar) are the widest. Four homepage components are also reused on inner pages: the feature carousel (as `features.feature-carousel`), content cards, the product overview and the awards slider.
- **Every section names its implementing file** in `implementedBy`, and the generator checks that each file exists on disk.

## Things worth knowing before editing

- **Scope numbers.** Each section's `scope` line is generated from the data (`Used on N routes (…)`), so the validator's prose-versus-count check is clean by construction. If you hand-write a scope with a different number, it will be flagged as informational only.
- **Validator reuse counts.** The validator's "SECTION REUSE" list counts a section once per occurrence, so a block repeated inside one template (for example `features.text-with-image`) inflates its "templates" figure. `IA.md` counts distinct templates; use that one.
- **Folded variants.** Blog posts under `/inside/` only lack the topics row, and past versus upcoming events only change the form title. Both are folded into one template each. Customer stories in the article layout are kept separate from blog posts, even though their sections match, because their content and breadcrumbs differ.
- **Redirects.** Seven routes redirect and have no page of their own: two product routes, one guide, two events, one legal route and one report route. They sit in `template.redirect` with their targets in `redirects`.
- **Deliberately not built.** Other locales, job-detail pages under `/careers/<id>`, and the product-tour and policy-calendar interiors are outside this IA. External links are not rendered as links anywhere.
- **Snapshot.** The IA reflects the code at the time of the last generator run. Other work on this project is still in progress, so re-run the generator after significant changes.
