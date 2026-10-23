# Northwind design-repo

A machine-validated, AI-ready description of a design-faithful clone of a real company's marketing site, populated with **original placeholder copy for the fictional company "Northwind"**. It tells a generator what it may use (tokens, primitives, components, 113 section contracts), how pieces combine (31 templates, a compatibility graph) and how the result must behave (motion with reduced-motion fallbacks, responsive layout, accessibility).

**Status:** `design-review-pending`, `productionApproved: false` (see `registry.manifest.json`).

## What this is not

The source site is a real, live company. Its copy, photography, product screenshots, customer logos, award badges and brand marks are deliberately **not** in the clone and **must never be generated or reproduced** from this repo. Fonts are open-source substitutes (Inter for the commercial Messina Sans, Newsreader for P22 Mackinac, Geist Mono as is). Do not make this repository public without a human review; the zip `design-repo.zip` is a build artifact: add `design-repo.zip` to `.gitignore` and never commit it next to the folder it is built from.

## Counts (recomputed from disk by `extraction/verify_all.py`)

| Item | Count |
|---|---|
| Tokens (foundation, semantic, component, layout) | 393 |
| Primitives | 17 |
| Components | 15 |
| Sections (12 homepage sections incl. 3 chrome, 49 block types, shared page sections, per-part page sections; the whole-page `bespoke.*` wrappers were decomposed) | 113 |
| Templates | 31 |
| Routes (all under `/en-GB`) | 571 = 564 templated + 7 redirects |
| Asset roles | 14 |
| Compatibility graph rules | 26 |
| Sections classed HERO | 17 |
| Retrieval-ineligible sections | 2 |
| Reviewed wrapper-gate whitelist entries | 3 |
| Adversarial mutations / controls | 102 / 32 |

## Layout

```
README.md  CHANGELOG.md  registry.manifest.json
tokens/00-foundation  10-semantic  20-component  30-layout  themes  llm
assets/asset-roles.json
primitives/  components/  sections/            one JSON contract each
templates/templates.json  templates/routes.json
compatibility/graph.json
schema/pagespec.schema.json  section-contract.schema.json  generate_pagespec_schema.py  example.pagespec.json  semantic_validate.py  tests/adversarial_test.py
extraction/measured-values.json  verify_all.py  prove_drift.py  wrapper_gate.py  wrapper-whitelist.json  classification-review.json
extraction/provenance-map.json  generate_provenance.py  measure_section_heights.mjs  measure-recipes.json
```

## Run it

```
pip install jsonschema          # the only dependency; stock Python 3.9+
python3 schema/semantic_validate.py                  # validate the example (schema + semantic rules)
python3 schema/tests/adversarial_test.py             # every mutation rejected, every control passes
python3 extraction/verify_all.py                     # parity, citations, counts, routes, graph, assets, tokens
python3 extraction/prove_drift.py                    # proves each drift check catches injected drift (optional --scratch <empty dir>)
python3 extraction/wrapper_gate.py                   # the whole-page-wrapper gate alone (also part of verify_all.py)
python3 schema/generate_pagespec_schema.py --check   # schema equals what the contracts generate
python3 extraction/generate_provenance.py --check    # source / semantic / allowlist mirror equal what the map generates
```

All scripts derive their root from their own location; nothing depends on anything outside this folder. Citations (`path:line-range` plus an anchor text that must occur inside the range) point at the clone project; `verify_all.py` resolves them when the project folder sits next to `design-repo/` and degrades to a warning when it does not.

## Section contracts: one part of a page each

Every file in `sections/` is validated against the **closed** `schema/section-contract.schema.json` (an invented key anywhere is an error) and carries two distinct objects:

* `semantic` = taxonomy, `{ id, category }`: `id` is the section id of the project's information architecture (`ia.json`, cross-checked when it sits next to this folder) and `category` one of `SHELL, HERO, PROOF, FEATURES, CONTENT, CONVERSION, FEED, ARTICLE`. `CONVERSION` is the CTA class: a block whose job is a conversion (demo or newsletter form, gated download, closing band, press-kit download) must be CONVERSION; editorial and news collections are `FEED`, never `FEATURES`; a block carrying a form endpoint may only be CONVERSION, HERO or SHELL. Sections that merely carry a secondary CTA are listed with a reason in `extraction/classification-review.json`.
* `source` = provenance, `{ id, tag, file, lines, anchor }`: the implementing component or JSX fragment, the rendered root element at 1440px, and a line range of the real source file whose anchor text `verify_all.py` resolves. Both objects (and the allowlist mirror) are produced by `extraction/generate_provenance.py` from `extraction/provenance-map.json`.
* `retrievalEligible` is a closed boolean, default `true`. `false` needs a `retrievalIneligibleReason` of 30+ characters and is reserved for layout-only or runtime UI. The pinned list (`block.Spacer`, `block.HorizontalRule`) is defined separately in `schema/semantic_validate.py` (rule `RETRIEVAL_ELIGIBILITY_PINNED`), in `extraction/verify_all.py`, in the closed contract schema and in the allowlist, each proven by adversarial and drift cases. **No cookie or consent banner, modal, dialog or overlay section exists in this clone** (the cookie banner is a deliberate scope reduction; a grep of `src/` finds only legal copy), so the pin covers the two spacing utilities and any section whose id or title looks like runtime UI must join the list or the checks fail.

The former whole-page wrappers were decomposed along the real content boundaries of the render: `bespoke.brand` into `brand.header, logos, colour, typography, press-kit`; `bespoke.careers` into `careers.intro, roles-header, department (repeatable), sidebar`; `bespoke.change` into `change.hero, statement, changemakers, stats` (plus the `block.Quote` it already rendered); `bespoke.climate-leads` into `climate-leads.hero` and `climate-leads.interview` (repeatable; the post grid is `block.BlogPostsThemeImages`); `bespoke.manifesto` into `manifesto.header` and `manifesto.part` (repeatable); `bespoke.soc-report` into `soc.banner, text-card, form-card`; `legal.document` into `legal.header` and `legal.body`; `story.content-frame` into `story.sidebar` and `story.body`; `customers.all-customers` into `customers.filter-bar` and `customers.customer-grid`. Articles keep header / body / newsletter / related as separate sections. The single-prose-body exceptions are listed below. `bespoke.quiz` stays one section: a single 866px interactive card, 34% of its page.

## Whole-page-wrapper gate

`extraction/wrapper_gate.py` (a check of `verify_all.py`) reads the heights recorded at 1440px in `extraction/measured-values.json` `sectionHeights` (564 routes, every section instance; refreshed by the optional `extraction/measure_section_heights.mjs`, recipes in `extraction/measure-recipes.json`, run against the built clone). A HERO taller than 1800px warns and taller than 3000px fails; one non-chrome section holding more than 50% of its page warns and more than 60% fails; a missing measurement is an error; both failures can only be waived by an entry in `extraction/wrapper-whitelist.json` with `reviewedBy`, a justification of 30+ characters and a ceiling above the measured value; a stale entry fails. The three current entries (`shared.article-body` on the longest research post, `block.SectionTextBlock` on the prose-only `/reading-list`, `shared.hero-with-form` on the two-section `/demo`) are **attestations by an automated agent reviewer, not human sign-offs**. Layout-stretched parallel columns (`careers.sidebar`, `story.sidebar`) are measured by their content extent, not the stretched grid cell. Seven warnings remain by design (listed by `verify_all.py`); visual parity with the live site has not been measured (no live capture was available).

## How a PageSpec works

A PageSpec is `{ pageSpecVersion, route, template, nodes[] }`. Each node is `{ section, variant?, content, motion }`. The semantic validator checks every node against the **declared template's real node list**, keyed on `(section, variant)`:

* the route must be one of the 571 built routes and bound to exactly that template (redirect routes have no template);
* chrome (promo bar, nav variant, footer variant) must match the template chrome, as measured from the clone's chrome rules (a `/lp/*` page has no nav and no footer; `/demo*` has an inverted nav, no promo bar, no footer);
* fixed templates enforce node order; the three block-CMS templates (product, compare, company) take any order of their optional repeatable block nodes, with the real per-route block order kept as evidence in `routes.json`;
* text budgets (`maxWords`) come from observed real content or measured spec lengths, never invented;
* every asset reference uses a closed `assetRole` with a generation policy; people, customer logos, the brand wordmark, award badges, decorative illustrations and form endpoints are **pinned** (the exact policy value is checked, not just enum membership);
* motion is closed: `{ pattern, reducedMotionFallback }` pairs from the section contract. There are **no** scroll-triggered fade-ups, parallax or scroll-linked transforms; the single scroll reveal is on the PageLinks cards. Some motion deliberately does **not** stop under reduced motion (product step countdown, customers quote carousel, LP animated steps, PageLinks reveal): the fallback ids say so;
* no absolute http(s) URL anywhere; internal links must resolve to a built route; `/careers/<id>` job pages are not built and may not be linked.

PageSpecs carry **no per-instance style or token override field**: styling belongs to the section contracts (`tokens/llm/token-policy.json`).

## Template partition (route counts)

Partitioned with the project's own classifiers (`storyVariant`, the summit regex, `hasToc`, `chromeFor`, and the report/company/legal registries); see `extraction/measured-values.json` `classifierRuns`.

| Template | Routes | Order | Selector |
|---|---|---|---|
| `template.blog-post` | 169 | fixed | sourceGroup blog-post where getPost(path).hasToc === false (src/content/posts.js) |
| `template.event-gated` | 167 | fixed | sourceGroup event where isSummit(slug) === false (/climate-week or summit/) and not a redirect |
| `template.blog-post-toc` | 82 | fixed | sourceGroup blog-post where getPost(path).hasToc === true |
| `template.customer-story-sidebar` | 35 | fixed | sourceGroup customer-story where storyVariant(slug) === "A" (src/content/customers.js: slug without a hyphen, or one of fortune-500-media-company, global-technology-company, hain-celestial, henry-schein) |
| `template.product-block-page` | 28 | free | sourceGroup product, minus redirect routes (src/content/pages/product.js entries whose first block is a redirect) |
| `template.customer-story-editorial` | 16 | fixed | sourceGroup customer-story where storyVariant(slug) === "B" (sentence-style slugs) |
| `template.guide-gated` | 13 | fixed | sourceGroup guide minus redirect (GUIDE_REDIRECTS) |
| `template.event-summit` | 11 | fixed | sourceGroup event where isSummit(slug) === true (regex /climate-week or summit/ in src/content/events.js) |
| `template.report-gated` | 6 | fixed | sourceGroup report-landing keys of REPORT_GATED in src/blocks/pages.jsx |
| `template.company-block-page` | 4 | free | sourceGroup company, minus the four bespoke pages (COMPANY_BESPOKE) and /podcast |
| `template.compare-block-page` | 3 | free | sourceGroup compare |
| `template.feed-index` | 3 | fixed | /blog, /guides and /events |
| `template.legal-document` | 3 | fixed | sourceGroup legal documents without toc: true in LegalPages.jsx DOCS |
| `template.lp` | 3 | fixed | /lp/* (three identical routes) |
| `template.product-tour-detail` | 3 | fixed | sourceGroup product-tour where path !== "/product-tours" |
| `template.demo-hero` | 2 | fixed | /demo and /demo/csrd |
| `template.soc-report` | 2 | fixed | REPORT_BESPOKE SOC2025Theme routes |
| `template.brand` | 1 | fixed | /brand |
| `template.careers` | 1 | fixed | /careers (COMPANY_BESPOKE) |
| `template.change` | 1 | fixed | /change |
| `template.climate-leads` | 1 | fixed | /climate-leads |
| `template.customers-index` | 1 | fixed | sourceGroup customers-index |
| `template.home` | 1 | fixed | sourceGroup home |
| `template.legal-document-toc` | 1 | fixed | sourceGroup legal documents with toc: true in LegalPages.jsx DOCS |
| `template.legal-index` | 1 | fixed | /legal |
| `template.manifesto` | 1 | fixed | /climate-economy (REPORT_BESPOKE) |
| `template.news-index` | 1 | fixed | /news |
| `template.podcast-gated` | 1 | fixed | /podcast (company group) |
| `template.product-tour-index` | 1 | fixed | path === "/product-tours" |
| `template.quiz` | 1 | fixed | /assessments/climate-disclosure (REPORT_BESPOKE) |
| `template.tool` | 1 | fixed | /tools/climate-policy-calendar |

The 7 redirect routes (`/platform/disclosures/california`, `/solutions/consumer-goods`, `/data-portal-terms`, `/spark-matrix-2023`, `/guides/climate-economy`, `/events/ai-features-demo-1`, `/events/california-climate-disclosures-demo`) carry `redirectTo` in `templates/routes.json`.

## Evidence levels

Each template, responsive entry and route is marked `measured`, `derived` or `inferred`. Honest limits: tablet 768-1023 was never measured on the original (the clone stacks below 1024); the band 1024-1279 is recorded per section as `desktop-narrow` (the clone gained a `wide` 1280 breakpoint through a responsive fix that was still in progress at the snapshot, so many blocks keep their stacked layout until 1280); 12 of 180 event pages were sampled; 3 routes are inferred from siblings; summit 390, the LP testimonial and some bespoke pages are approximations. Where the written specs disagree with the implemented, QA-verified code, the code is recorded (see `corrections` in `measured-values.json`).

## Deliberate scope reductions (do not recreate)

Other locales (fr, de, en-AU), job detail pages, product-tour and policy-calendar interiors, WebGL backgrounds (static stand-ins), the cookie banner, external links, and scroll-driven motion on `/change` and `/platform/marketplace`.

## Source stack (documentation only)

Plain JavaScript, React 18, Vite 5, Tailwind CSS 3, react-router-dom 6 (exact versions in `registry.manifest.json` `sourceStack`). The stack never shapes token names, section ids, schema fields or validator logic.

## Snapshot

A design-repo is a snapshot of a moving clone. `registry.manifest.json` records the snapshot time and a source digest; re-diff counts and facts before trusting it after the clone changes.
