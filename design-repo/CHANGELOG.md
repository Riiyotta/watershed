# Changelog

## 0.1.0 (initial build, status design-review-pending)

Built from scratch from the clone source, CLONE_SPEC.md, PAGES_SPEC.md, ASSET_MANIFEST.md and IMAGE_CREDITS.md.

* Tokens: 393 tokens across foundation, semantic, component and layout tiers; light theme resolved, dark band documented; LLM catalog, policy and allowlist (version 1.0.0).
* Contracts: 17 primitives, 15 components, 96 sections (12 homepage sections including chrome, 49 block types, shared page sections, bespoke pages).
* Templates: 31 templates partitioned with the project's own classifiers; 571 routes = 564 templated + 7 redirects, each exactly once.
* Compatibility graph: 24 rules with severity and named exceptions, each checked against the real block orders when written; identical rule ids in `schema/semantic_validate.py`.
* Asset roles: 14 closed roles with generation policies; six roles pinned (people, customer logos, brand wordmark, award badges, decorative illustrations, form endpoints).
* Motion: closed pattern vocabulary with honest reduced-motion fallbacks; corrections to early recon numbers recorded in `extraction/measured-values.json` (awards 2400ms, logo strip 1060ms/2016ms, ticker 4500ms, promo 5000ms/46px, nav dropdown fade-scale, product countdown continues under reduced motion).
* Verification: `verify_all.py` (parity, citations, counts, routes, graph, assets, tokens, self-containment), `adversarial_test.py` (55 mutations, 32 controls), `prove_drift.py` (each drift check proven to fail on injected drift).
* Known gaps carried honestly: tablet never measured, 12 of 180 events sampled, three inferred routes, block-library hover nudges and FaqFullWidth not animated in the clone.
