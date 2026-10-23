# Northwind site clone: information architecture

Source: Local clone of the watershed.com/en-GB design (Northwind placeholder content), React + Vite
Status: **measured-from-source** · production approved: **false**
571 routes · 64 templates · 116 unique sections

> Generated from `ia.json` by `build.mjs`. Edit the JSON, not this file.

## Shape of the site

The largest 3 templates (Blog post, Event landing, Blog post (with table of contents)) account for 418 of 571 routes (73%). The remaining 153 routes span 61 templates.

| template | routes | share |
|---|---:|---:|
| Blog post | 169 | 30% |
| Event landing | 167 | 29% |
| Blog post (with table of contents) | 82 | 14% |
| Customer story (story layout) | 33 | 6% |
| Customer story (article layout) | 16 | 3% |
| Gated guide landing | 13 | 2% |
| Summit event | 11 | 2% |
| Redirect routes (no page of their own) | 7 | 1% |
| Gated report landing | 5 | 1% |
| Product page: platform/disclosures/cdp / platform/disclosures/rfp-guide / platform/disclosures/secr | 3 | 1% |
| Legal document | 3 | 1% |
| Campaign landing page | 3 | 1% |
| Product tour | 3 | 1% |
| Product page: industry/consumer-goods / industry/professional-services | 2 | 0% |
| Product page: industry/food-beverage / industry/retail | 2 | 0% |
| Block page: solutions/california/guaranteed-assurance / reading-list | 2 | 0% |
| Customer story (story layout + related links) | 2 | 0% |
| Report page: SOC2025Theme | 2 | 0% |
| Homepage | 1 | 0% |
| Product page: industry/apparel | 1 | 0% |
| Product page: industry/technology | 1 | 0% |
| Product page: platform | 1 | 0% |
| Product page: platform/act | 1 | 0% |
| Product page: platform/climate/tcfd | 1 | 0% |
| Product page: platform/disclosures | 1 | 0% |
| Product page: platform/disclosures/csrd | 1 | 0% |
| Product page: platform/disclosures/esg | 1 | 0% |
| Product page: platform/disclosures/issb | 1 | 0% |
| Product page: platform/marketplace | 1 | 0% |
| Product page: platform/measure | 1 | 0% |
| Product page: platform/measure/carbon-accounting | 1 | 0% |
| Product page: platform/sustainability-ai | 1 | 0% |
| Product page: solutions/california | 1 | 0% |
| Product page: solutions/ceda | 1 | 0% |
| Product page: solutions/csrd | 1 | 0% |
| Product page: solutions/energy-management | 1 | 0% |
| Product page: solutions/finance | 1 | 0% |
| Product page: solutions/product-footprints | 1 | 0% |
| Product page: solutions/supply-chain | 1 | 0% |
| Customers index | 1 | 0% |
| Blog index | 1 | 0% |
| News index | 1 | 0% |
| Guides index | 1 | 0% |
| Events index | 1 | 0% |
| Legal index | 1 | 0% |
| Legal document (with table of contents) | 1 | 0% |
| Compare page: compare | 1 | 0% |
| Compare page: compare/sweep | 1 | 0% |
| Compare page: compare/workiva | 1 | 0% |
| Demo page | 1 | 0% |
| Demo page (reporting variant) | 1 | 0% |
| Product tours index | 1 | 0% |
| Company page: about-us | 1 | 0% |
| Company page: ai-fellowship | 1 | 0% |
| Company page: brand | 1 | 0% |
| Company page: careers | 1 | 0% |
| Company page: change | 1 | 0% |
| Company page: climate-leads | 1 | 0% |
| Company page: partners | 1 | 0% |
| Podcast landing | 1 | 0% |
| Tool page | 1 | 0% |
| Gated report landing (with FAQ) | 1 | 0% |
| Report page: Quiz | 1 | 0% |
| Report page: Manifesto | 1 | 0% |

## Page chrome

**283 routes carry chrome = `full`** — Homepage, Product page: industry/apparel, Product page: industry/consumer-goods / industry/professional-services, Product page: industry/food-beverage / industry/retail, Product page: industry/technology, Product page: platform, Product page: platform/act, Product page: platform/climate/tcfd, Product page: platform/disclosures, Product page: platform/disclosures/cdp / platform/disclosures/rfp-guide / platform/disclosures/secr, Product page: platform/disclosures/csrd, Product page: platform/disclosures/esg, Product page: platform/disclosures/issb, Product page: platform/marketplace, Product page: platform/measure, Product page: platform/measure/carbon-accounting, Product page: platform/sustainability-ai, Product page: solutions/california, Block page: solutions/california/guaranteed-assurance / reading-list, Product page: solutions/ceda, Product page: solutions/csrd, Product page: solutions/energy-management, Product page: solutions/finance, Product page: solutions/product-footprints, Product page: solutions/supply-chain, Customers index, Customer story (story layout + related links), Customer story (story layout), News index, Gated guide landing, Summit event, Event landing, Legal index, Legal document, Legal document (with table of contents), Compare page: compare, Compare page: compare/sweep, Compare page: compare/workiva, Company page: about-us, Company page: ai-fellowship, Company page: brand, Company page: careers, Company page: change, Company page: climate-leads, Company page: partners, Podcast landing, Gated report landing (with FAQ), Report page: Quiz, Gated report landing, Report page: SOC2025Theme.

**7 routes carry chrome = `none (redirect)`** — Redirect routes (no page of their own).

**271 routes carry chrome = `translucent nav`** — Customer story (article layout), Blog index, Blog post (with table of contents), Blog post, Guides index, Events index, Tool page.

**2 routes carry chrome = `minimal: inverted nav, no promo bar, no footer`** — Demo page, Demo page (reporting variant).

**3 routes carry chrome = `campaign: promo bar only`** — Campaign landing page.

**4 routes carry chrome = `translucent nav, no promo bar`** — Product tours index, Product tour.

**1 routes carry chrome = `full, short footer`** — Report page: Manifesto.

## Sections by reuse

How widely a section is shared determines whether it belongs in a shared
component library or stays local to its page.

| section | category | templates | routes | implementation | scope |
|---|---|---:|---:|---|---|
| `shell.nav` | SHELL | 62 | 561 | `src/components/Nav.jsx` | Used on 561 routes (home, product, company, customers-index, customer-story, blog-index, blog-post, guides-index, guide, events-index, event, legal, compare, demo, product-tour, tool, report-landing). |
| `shell.footer` | SHELL | 59 | 558 | `src/components/Footer.jsx` | Used on 558 routes (home, product, company, customers-index, customer-story, blog-index, blog-post, guides-index, guide, events-index, event, legal, compare, product-tour, tool, report-landing). |
| `shell.promo-bar` | SHELL | 58 | 555 | `src/components/PromoBar.jsx` | Used on 555 routes (home, product, company, customers-index, customer-story, blog-index, blog-post, guides-index, guide, events-index, event, legal, compare, tool, report-landing). |
| `conversion.newsletter-band` | CONVERSION | 3 | 267 | `src/primitives/NewsletterBand.jsx` | Used on 267 routes (customer-story, blog-post). |
| `feed.related-posts-grid` | FEED | 3 | 267 | `src/primitives/Feed.jsx > FeedGrid` | Used on 267 routes (customer-story, blog-post). |
| `article.post-hero` | ARTICLE | 3 | 267 | `src/primitives/PostHero.jsx` | Used on 267 routes (customer-story, blog-post). |
| `article.prose` | ARTICLE | 3 | 267 | `src/primitives/Prose.jsx` | Used on 267 routes (customer-story, blog-post). |
| `feed.page-links` | FEED | 6 | 189 | `src/primitives/PageLinks.jsx` | Used on 189 routes (customer-story, guide, event, company, report-landing). |
| `content.gated-card` | CONTENT | 5 | 187 | `src/templates/GatedLanding.jsx` | Used on 187 routes (guide, event, company, report-landing). |
| `conversion.gated-form` | CONVERSION | 5 | 187 | `src/templates/GatedLanding.jsx` | Used on 187 routes (guide, event, company, report-landing). |
| `content.event-logistics` | CONTENT | 1 | 167 | `src/templates/GatedLanding.jsx` | Used on 167 routes (event). |
| `content.event-speakers` | CONTENT | 1 | 167 | `src/templates/GatedLanding.jsx` | Used on 167 routes (event). |
| `article.toc` | ARTICLE | 2 | 83 | `src/primitives/Toc.jsx` | Used on 83 routes (blog-post, legal). |
| `article.story-hero` | ARTICLE | 2 | 35 | `src/templates/CustomerStory.jsx` | Used on 35 routes (customer-story). |
| `article.story-sidebar` | ARTICLE | 2 | 35 | `src/templates/CustomerStory.jsx` | Used on 35 routes (customer-story). |
| `article.story-body` | ARTICLE | 2 | 35 | `src/templates/CustomerStory.jsx` | Used on 35 routes (customer-story). |
| `content.faq` | CONTENT | 28 | 32 | `src/primitives/Faq.jsx` | Used on 32 routes (product, compare, company, report-landing). |
| `proof.quote` | PROOF | 20 | 25 | `src/blocks/Quote.jsx` | Used on 25 routes (product, demo, product-tour, company). |
| `hero.default` | HERO | 19 | 23 | `src/blocks/Hero.jsx` | Used on 23 routes (product, company). |
| `proof.logos` | PROOF | 16 | 20 | `src/blocks/Logos.jsx` | Used on 20 routes (product, compare, demo, company). |
| `feed.page-link-set` | FEED | 16 | 20 | `src/blocks/PageLinkSet.jsx` | Used on 20 routes (product, demo, company). |
| `hero.summit` | HERO | 1 | 11 | `src/templates/SummitEvent.jsx` | Used on 11 routes (event). |
| `content.summit-speakers` | CONTENT | 1 | 11 | `src/templates/SummitEvent.jsx` | Used on 11 routes (event). |
| `content.summit-sessions` | CONTENT | 1 | 11 | `src/templates/SummitEvent.jsx` | Used on 11 routes (event). |
| `conversion.summit-closing-cta` | CONVERSION | 1 | 11 | `src/templates/SummitEvent.jsx` | Used on 11 routes (event). |
| `features.text-with-image` | FEATURES | 10 | 10 | `src/blocks/TextWithImage.jsx` | Used on 10 routes (product). |
| `content.section-text-block` | CONTENT | 7 | 10 | `src/blocks/SectionTextBlock.jsx` | Used on 10 routes (product, company). |
| `features.text-with-image-list` | FEATURES | 6 | 8 | `src/blocks/TextWithImageList.jsx` | Used on 8 routes (product, company). |
| `features.text-with-image-ordered-list` | FEATURES | 6 | 8 | `src/blocks/TextWithImageOrderedList.jsx` | Used on 8 routes (product, compare). |
| `content.feature-text` | CONTENT | 6 | 8 | `src/blocks/FeatureText.jsx` | Used on 8 routes (product, company). |
| `conversion.inline-cta` | CONVERSION | 6 | 8 | `src/blocks/InlineCta.jsx` | Used on 8 routes (product). |
| `features.feature-carousel` | FEATURES | 7 | 7 | `src/components/FeatureCarousel.jsx` | Used on 7 routes (home, product, demo). |
| `hero.form` | HERO | 5 | 7 | `src/primitives/HeroWithForm.jsx` | Used on 7 routes (demo, product-tour, tool). |
| `proof.customer-photo-feature` | PROOF | 5 | 5 | `src/blocks/CustomerPhotoFeature.jsx` | Used on 5 routes (product, compare, company). |
| `feed.content-cards` | FEED | 5 | 5 | `src/components/ContentCards.jsx` | Used on 5 routes (home, product). |
| `content.horizontal-rule` | CONTENT | 3 | 5 | `src/blocks/HorizontalRule.jsx` | Used on 5 routes (product, company). |
| `content.grid` | CONTENT | 4 | 4 | `src/blocks/Grid.jsx` | Used on 4 routes (product, company). |
| `content.content-grid` | CONTENT | 4 | 4 | `src/blocks/ContentGrid.jsx` | Used on 4 routes (product). |
| `conversion.inline-cta-form` | CONVERSION | 4 | 4 | `src/blocks/InlineCtaForm.jsx` | Used on 4 routes (product, compare). |
| `proof.text-with-logos` | PROOF | 2 | 4 | `src/blocks/TextWithLogos.jsx` | Used on 4 routes (product, product-tour). |
| `content.header-band` | CONTENT | 2 | 4 | `src/blocks/HeaderRoot.jsx` | Used on 4 routes (demo, company). |
| `article.legal-header` | ARTICLE | 2 | 4 | `src/pages/content/LegalPages.jsx > LegalDocument` | Used on 4 routes (legal). |
| `article.legal-body` | ARTICLE | 2 | 4 | `src/pages/content/LegalPages.jsx > LegalDocument` | Used on 4 routes (legal). |
| `hero.compete` | HERO | 3 | 3 | `src/blocks/HeroCompete.jsx` | Used on 3 routes (compare). |
| `hero.feed-carousel` | HERO | 3 | 3 | `src/primitives/FeaturedCarousel.jsx` | Used on 3 routes (blog-index, guides-index, events-index). |
| `proof.quote-features` | PROOF | 3 | 3 | `src/blocks/QuoteFeatures.jsx` | Used on 3 routes (compare). |
| `proof.quote-video` | PROOF | 3 | 3 | `src/blocks/QuoteVideo.jsx` | Used on 3 routes (product, compare). |
| `features.product-overview` | FEATURES | 3 | 3 | `src/components/ProductOverview.jsx` | Used on 3 routes (home, product). |
| `content.tables` | CONTENT | 3 | 3 | `src/blocks/Tables.jsx` | Used on 3 routes (product, compare). |
| `feed.card-grid` | FEED | 3 | 3 | `src/primitives/Feed.jsx > FeedGrid` | Used on 3 routes (blog-index, guides-index, events-index). |
| `feed.load-more` | FEED | 3 | 3 | `src/primitives/Feed.jsx > LoadMore` | Used on 3 routes (blog-index, guides-index, events-index). |
| `hero.lp` | HERO | 1 | 3 | `src/pages/content/DemoPages.jsx > LpHero` | Used on 3 routes (demo). |
| `features.animated-steps` | FEATURES | 1 | 3 | `src/pages/content/DemoPages.jsx > AnimatedSteps` | Used on 3 routes (demo). |
| `features.lp-feature-grid` | FEATURES | 1 | 3 | `src/pages/content/DemoPages.jsx > LpFeatureGrid` | Used on 3 routes (demo). |
| `conversion.cta-slim` | CONVERSION | 1 | 3 | `src/pages/content/DemoPages.jsx > CtaSlim` | Used on 3 routes (demo). |
| `conversion.featured-form` | CONVERSION | 1 | 3 | `src/pages/content/DemoPages.jsx > FeaturedForm` | Used on 3 routes (demo). |
| `hero.video` | HERO | 2 | 2 | `src/blocks/HeroVideo.jsx` | Used on 2 routes (product). |
| `proof.awards-slider` | PROOF | 2 | 2 | `src/components/Awards.jsx` | Used on 2 routes (home, product). |
| `proof.quotes-carousel` | PROOF | 2 | 2 | `src/blocks/QuotesCarousel.jsx` | Used on 2 routes (compare). |
| `content.table-questions-stats` | CONTENT | 2 | 2 | `src/blocks/TableQuestionsStats.jsx` | Used on 2 routes (compare). |
| `content.faq-full-width` | CONTENT | 2 | 2 | `src/blocks/FaqFullWidth.jsx` | Used on 2 routes (compare). |
| `content.video` | CONTENT | 2 | 2 | `src/blocks/Video.jsx` | Used on 2 routes (product, company). |
| `conversion.cta-bar` | CONVERSION | 2 | 2 | `src/primitives/CTABar.jsx` | Used on 2 routes (customers-index, company). |
| `feed.blog-posts-theme-images` | FEED | 2 | 2 | `src/blocks/BlogPostsThemeImages.jsx` | Used on 2 routes (company). |
| `feed.filter-bar` | FEED | 2 | 2 | `src/primitives/Feed.jsx > FilterChips` | Used on 2 routes (blog-index, events-index). |
| `feed.sidebar-index` | FEED | 2 | 2 | `src/primitives/SidebarList.jsx` | Used on 2 routes (blog-index, legal). |
| `hero.soc-banner` | HERO | 1 | 2 | `src/blocks/templates/SOC2025Theme.jsx` | Used on 2 routes (report-landing). |
| `content.soc-text-card` | CONTENT | 1 | 2 | `src/blocks/templates/SOC2025Theme.jsx` | Used on 2 routes (report-landing). |
| `conversion.soc-form-card` | CONVERSION | 1 | 2 | `src/blocks/templates/SOC2025Theme.jsx` | Used on 2 routes (report-landing). |
| `shell.footer-short` | SHELL | 1 | 1 | `src/components/Footer.jsx` | Used on 1 route (report-landing). |
| `hero.home` | HERO | 1 | 1 | `src/components/Hero.jsx` | Used on 1 route (home). |
| `hero.centered-agent` | HERO | 1 | 1 | `src/blocks/CenteredAgent.jsx` | Used on 1 route (product). |
| `hero.large-background` | HERO | 1 | 1 | `src/blocks/LargeBackground.jsx` | Used on 1 route (product). |
| `hero.carousel` | HERO | 1 | 1 | `src/blocks/HeroWithCarousel.jsx` | Used on 1 route (product). |
| `hero.energy-forecast` | HERO | 1 | 1 | `src/blocks/EnergyForecast.jsx` | Used on 1 route (product). |
| `hero.customers` | HERO | 1 | 1 | `src/templates/CustomersIndex.jsx > Hero` | Used on 1 route (customers-index). |
| `hero.change` | HERO | 1 | 1 | `src/blocks/templates/Change.jsx` | Used on 1 route (company). |
| `hero.climate-leads` | HERO | 1 | 1 | `src/blocks/templates/ClimateLeads.jsx` | Used on 1 route (company). |
| `proof.logo-marquee` | PROOF | 1 | 1 | `src/components/LogoMarquee.jsx` | Used on 1 route (home). |
| `proof.quote-background` | PROOF | 1 | 1 | `src/blocks/QuoteBackground.jsx` | Used on 1 route (product). |
| `proof.people-carousel` | PROOF | 1 | 1 | `src/blocks/PeopleCarousel.jsx` | Used on 1 route (product). |
| `proof.personnel-slider` | PROOF | 1 | 1 | `src/blocks/PersonnelSlider.jsx` | Used on 1 route (product). |
| `proof.stats-cornerstone` | PROOF | 1 | 1 | `src/components/Stats.jsx` | Used on 1 route (home). |
| `proof.stats-ruled` | PROOF | 1 | 1 | `src/blocks/StatsRuled.jsx` | Used on 1 route (compare). |
| `proof.customer-logo-grid` | PROOF | 1 | 1 | `src/templates/CustomersIndex.jsx > LogoGrid` | Used on 1 route (customers-index). |
| `proof.quote-carousel` | PROOF | 1 | 1 | `src/templates/CustomersIndex.jsx > QuoteCarousel` | Used on 1 route (customers-index). |
| `features.ai-agents-demo` | FEATURES | 1 | 1 | `src/components/Agents.jsx` | Used on 1 route (home). |
| `features.feature-large` | FEATURES | 1 | 1 | `src/blocks/FeatureLarge.jsx` | Used on 1 route (product). |
| `features.feature-grid-numbered` | FEATURES | 1 | 1 | `src/blocks/FeatureGridNumbered.jsx` | Used on 1 route (compare). |
| `features.animated-gallery` | FEATURES | 1 | 1 | `src/blocks/AnimatedGallery.jsx` | Used on 1 route (product). |
| `content.text-with-list` | CONTENT | 1 | 1 | `src/blocks/TextWithList.jsx` | Used on 1 route (product). |
| `content.spacer` | CONTENT | 1 | 1 | `src/blocks/Spacer.jsx` | Used on 1 route (company). |
| `content.info-cards` | CONTENT | 1 | 1 | `src/blocks/InfoCards.jsx` | Used on 1 route (product). |
| `content.link-list` | CONTENT | 1 | 1 | `src/blocks/LinkList.jsx` | Used on 1 route (compare). |
| `content.mission-split` | CONTENT | 1 | 1 | `src/components/Mission.jsx` | Used on 1 route (home). |
| `hero.careers` | HERO | 1 | 1 | `src/blocks/templates/Careers.jsx` | Used on 1 route (company). |
| `content.careers-roles-header` | CONTENT | 1 | 1 | `src/blocks/templates/Careers.jsx` | Used on 1 route (company). |
| `content.careers-department` | CONTENT | 1 | 1 | `src/blocks/templates/Careers.jsx` | Used on 1 route (company). |
| `content.careers-sidebar` | CONTENT | 1 | 1 | `src/blocks/templates/Careers.jsx` | Used on 1 route (company). |
| `content.brand-header` | CONTENT | 1 | 1 | `src/blocks/templates/Brand.jsx` | Used on 1 route (company). |
| `content.brand-logos` | CONTENT | 1 | 1 | `src/blocks/templates/Brand.jsx` | Used on 1 route (company). |
| `content.brand-colour` | CONTENT | 1 | 1 | `src/blocks/templates/Brand.jsx` | Used on 1 route (company). |
| `content.brand-typography` | CONTENT | 1 | 1 | `src/blocks/templates/Brand.jsx` | Used on 1 route (company). |
| `conversion.brand-press-kit` | CONVERSION | 1 | 1 | `src/blocks/templates/Brand.jsx` | Used on 1 route (company). |
| `content.change-statement` | CONTENT | 1 | 1 | `src/blocks/templates/Change.jsx` | Used on 1 route (company). |
| `content.change-changemakers` | CONTENT | 1 | 1 | `src/blocks/templates/Change.jsx` | Used on 1 route (company). |
| `content.change-stats` | CONTENT | 1 | 1 | `src/blocks/templates/Change.jsx` | Used on 1 route (company). |
| `content.climate-leads-interviews` | CONTENT | 1 | 1 | `src/blocks/templates/ClimateLeads.jsx` | Used on 1 route (company). |
| `conversion.cta-form` | CONVERSION | 1 | 1 | `src/blocks/CTAForm.jsx` | Used on 1 route (product). |
| `conversion.content-form` | CONVERSION | 1 | 1 | `src/blocks/ContentForm.jsx` | Used on 1 route (product). |
| `conversion.quiz` | CONVERSION | 1 | 1 | `src/blocks/templates/Quiz.jsx` | Used on 1 route (report-landing). |
| `feed.featured-stories` | FEED | 1 | 1 | `src/templates/CustomersIndex.jsx > FeaturedStories` | Used on 1 route (customers-index). |
| `feed.customers-filters` | FEED | 1 | 1 | `src/templates/CustomersIndex.jsx > AllCustomers` | Used on 1 route (customers-index). |
| `feed.customers-grid` | FEED | 1 | 1 | `src/templates/CustomersIndex.jsx > AllCustomers` | Used on 1 route (customers-index). |
| `article.manifesto-header` | ARTICLE | 1 | 1 | `src/blocks/templates/Manifesto.jsx` | Used on 1 route (report-landing). |
| `article.manifesto-part` | ARTICLE | 1 | 1 | `src/blocks/templates/Manifesto.jsx` | Used on 1 route (report-landing). |

**55 shared sections** appear in more than one template and belong in a component library.

**61 single-use sections** appear in exactly one template. Building these
as "reusable" components up front would be speculative — keep them page-local
until a second caller actually appears.

## Templates

### Homepage — `template.home`

1 route · `/` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | HERO | `hero.home` | page-local |
| 4 | PROOF | `proof.awards-slider` | shared ×2 |
| 5 | FEATURES | `features.product-overview` | shared ×3 |
| 6 | FEATURES | `features.feature-carousel` | shared ×7 |
| 7 | FEATURES | `features.ai-agents-demo` | page-local |
| 8 | PROOF | `proof.stats-cornerstone` | page-local |
| 9 | CONTENT | `content.mission-split` | page-local |
| 10 | FEED | `feed.content-cards` | shared ×5 |
| 11 | PROOF | `proof.logo-marquee` | page-local |
| 12 | SHELL | `shell.footer` | shared ×59 |

### Product page: industry/apparel — `template.product-industry-apparel`

1 route · `/industry/apparel` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | HERO | `hero.default` | shared ×19 |
| 4 | PROOF | `proof.logos` | shared ×16 |
| 5 | FEATURES | `features.text-with-image-ordered-list` | shared ×6 |
| 6 | PROOF | `proof.quote` | shared ×20 |
| 7 | FEED | `feed.page-link-set` | shared ×16 |
| 8 | SHELL | `shell.footer` | shared ×59 |

### Product page: industry/consumer-goods / industry/professional-services — `template.product-industry-consumer-goods-industry-professional-services`

2 routes · `/industry/consumer-goods`, `/industry/professional-services` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | HERO | `hero.default` | shared ×19 |
| 4 | PROOF | `proof.logos` | shared ×16 |
| 5 | FEATURES | `features.text-with-image-ordered-list` | shared ×6 |
| 6 | PROOF | `proof.quote` | shared ×20 |
| 7 | CONTENT | `content.faq` | shared ×28 |
| 8 | FEED | `feed.page-link-set` | shared ×16 |
| 9 | SHELL | `shell.footer` | shared ×59 |

### Product page: industry/food-beverage / industry/retail — `template.product-industry-food-beverage-industry-retail`

2 routes · `/industry/food-beverage`, `/industry/retail` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | HERO | `hero.default` | shared ×19 |
| 4 | PROOF | `proof.logos` | shared ×16 |
| 5 | FEATURES | `features.text-with-image-ordered-list` | shared ×6 |
| 6 | CONTENT | `content.faq` | shared ×28 |
| 7 | FEED | `feed.page-link-set` | shared ×16 |
| 8 | SHELL | `shell.footer` | shared ×59 |

### Product page: industry/technology — `template.product-industry-technology`

1 route · `/industry/technology` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | HERO | `hero.default` | shared ×19 |
| 4 | PROOF | `proof.logos` | shared ×16 |
| 5 | FEATURES | `features.text-with-image-ordered-list` | shared ×6 |
| 6 | CONTENT | `content.video` | shared ×2 |
| 7 | CONTENT | `content.faq` | shared ×28 |
| 8 | SHELL | `shell.footer` | shared ×59 |

### Product page: platform — `template.product-platform`

1 route · `/platform` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | HERO | `hero.default` | shared ×19 |
| 4 | FEATURES | `features.text-with-image` | shared ×10 |
| 5 | FEATURES | `features.text-with-image` | shared ×10 |
| 6 | FEATURES | `features.text-with-image` | shared ×10 |
| 7 | FEED | `feed.content-cards` | shared ×5 |
| 8 | PROOF | `proof.awards-slider` | shared ×2 |
| 9 | PROOF | `proof.quote` | shared ×20 |
| 10 | CONTENT | `content.faq` | shared ×28 |
| 11 | SHELL | `shell.footer` | shared ×59 |

### Product page: platform/act — `template.product-platform-act`

1 route · `/platform/act` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | HERO | `hero.default` | shared ×19 |
| 4 | FEATURES | `features.product-overview` | shared ×3 |
| 5 | FEATURES | `features.text-with-image` | shared ×10 |
| 6 | CONTENT | `content.feature-text` | shared ×6 |
| 7 | FEATURES | `features.text-with-image` | shared ×10 |
| 8 | FEATURES | `features.text-with-image` | shared ×10 |
| 9 | FEATURES | `features.text-with-image` | shared ×10 |
| 10 | PROOF | `proof.customer-photo-feature` | shared ×5 |
| 11 | PROOF | `proof.quote` | shared ×20 |
| 12 | CONTENT | `content.content-grid` | shared ×4 |
| 13 | CONVERSION | `conversion.inline-cta` | shared ×6 |
| 14 | FEATURES | `features.feature-carousel` | shared ×7 |
| 15 | CONTENT | `content.content-grid` | shared ×4 |
| 16 | CONTENT | `content.faq` | shared ×28 |
| 17 | SHELL | `shell.footer` | shared ×59 |

### Product page: platform/climate/tcfd — `template.product-platform-climate-tcfd`

1 route · `/platform/climate/tcfd` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | HERO | `hero.default` | shared ×19 |
| 4 | CONTENT | `content.section-text-block` | shared ×7 |
| 5 | CONTENT | `content.grid` | shared ×4 |
| 6 | CONTENT | `content.section-text-block` | shared ×7 |
| 7 | CONTENT | `content.section-text-block` | shared ×7 |
| 8 | PROOF | `proof.quote` | shared ×20 |
| 9 | CONTENT | `content.faq` | shared ×28 |
| 10 | FEED | `feed.page-link-set` | shared ×16 |
| 11 | SHELL | `shell.footer` | shared ×59 |

### Product page: platform/disclosures — `template.product-platform-disclosures`

1 route · `/platform/disclosures` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | HERO | `hero.video` | shared ×2 |
| 4 | PROOF | `proof.logos` | shared ×16 |
| 5 | FEATURES | `features.feature-carousel` | shared ×7 |
| 6 | FEATURES | `features.text-with-image` | shared ×10 |
| 7 | FEATURES | `features.text-with-image` | shared ×10 |
| 8 | FEATURES | `features.product-overview` | shared ×3 |
| 9 | FEATURES | `features.text-with-image` | shared ×10 |
| 10 | CONTENT | `content.faq` | shared ×28 |
| 11 | SHELL | `shell.footer` | shared ×59 |

### Redirect routes (no page of their own) — `template.redirect`

7 routes · `/platform/disclosures/california`, `/solutions/consumer-goods`, `/guides/climate-economy`, `/events/ai-features-demo-1`, `/events/california-climate-disclosures-demo`, `/data-portal-terms`, `/spark-matrix-2023` · chrome: **none (redirect)**

| # | category | section | |
|---:|---|---|---|

### Product page: platform/disclosures/cdp / platform/disclosures/rfp-guide / platform/disclosures/secr — `template.product-platform-disclosures-cdp-platform-disclosures-rfp-guide`

3 routes · `/platform/disclosures/cdp`, `/platform/disclosures/rfp-guide`, `/platform/disclosures/secr` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | HERO | `hero.default` | shared ×19 |
| 4 | CONTENT | `content.horizontal-rule` | shared ×3 |
| 5 | CONTENT | `content.section-text-block` | shared ×7 |
| 6 | CONTENT | `content.horizontal-rule` | shared ×3 |
| 7 | CONTENT | `content.feature-text` | shared ×6 |
| 8 | FEATURES | `features.text-with-image-list` | shared ×6 |
| 9 | CONVERSION | `conversion.inline-cta` | shared ×6 |
| 10 | CONTENT | `content.faq` | shared ×28 |
| 11 | PROOF | `proof.quote` | shared ×20 |
| 12 | FEED | `feed.page-link-set` | shared ×16 |
| 13 | SHELL | `shell.footer` | shared ×59 |

### Product page: platform/disclosures/csrd — `template.product-platform-disclosures-csrd`

1 route · `/platform/disclosures/csrd` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | HERO | `hero.default` | shared ×19 |
| 4 | CONTENT | `content.text-with-list` | page-local |
| 5 | FEATURES | `features.text-with-image-list` | shared ×6 |
| 6 | CONTENT | `content.tables` | shared ×3 |
| 7 | CONTENT | `content.tables` | shared ×3 |
| 8 | CONTENT | `content.tables` | shared ×3 |
| 9 | CONTENT | `content.faq` | shared ×28 |
| 10 | FEED | `feed.page-link-set` | shared ×16 |
| 11 | SHELL | `shell.footer` | shared ×59 |

### Product page: platform/disclosures/esg — `template.product-platform-disclosures-esg`

1 route · `/platform/disclosures/esg` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | HERO | `hero.default` | shared ×19 |
| 4 | FEATURES | `features.text-with-image-list` | shared ×6 |
| 5 | CONTENT | `content.section-text-block` | shared ×7 |
| 6 | CONTENT | `content.grid` | shared ×4 |
| 7 | CONTENT | `content.faq` | shared ×28 |
| 8 | CONTENT | `content.section-text-block` | shared ×7 |
| 9 | PROOF | `proof.quote` | shared ×20 |
| 10 | FEED | `feed.page-link-set` | shared ×16 |
| 11 | SHELL | `shell.footer` | shared ×59 |

### Product page: platform/disclosures/issb — `template.product-platform-disclosures-issb`

1 route · `/platform/disclosures/issb` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | HERO | `hero.default` | shared ×19 |
| 4 | CONTENT | `content.section-text-block` | shared ×7 |
| 5 | CONTENT | `content.feature-text` | shared ×6 |
| 6 | FEATURES | `features.text-with-image-list` | shared ×6 |
| 7 | CONTENT | `content.horizontal-rule` | shared ×3 |
| 8 | CONTENT | `content.faq` | shared ×28 |
| 9 | FEED | `feed.page-link-set` | shared ×16 |
| 10 | SHELL | `shell.footer` | shared ×59 |

### Product page: platform/marketplace — `template.product-platform-marketplace`

1 route · `/platform/marketplace` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | HERO | `hero.carousel` | page-local |
| 4 | FEATURES | `features.animated-gallery` | page-local |
| 5 | CONTENT | `content.grid` | shared ×4 |
| 6 | PROOF | `proof.quote` | shared ×20 |
| 7 | PROOF | `proof.logos` | shared ×16 |
| 8 | PROOF | `proof.people-carousel` | page-local |
| 9 | CONTENT | `content.faq` | shared ×28 |
| 10 | FEED | `feed.page-link-set` | shared ×16 |
| 11 | CONVERSION | `conversion.cta-form` | page-local |
| 12 | SHELL | `shell.footer` | shared ×59 |

### Product page: platform/measure — `template.product-platform-measure`

1 route · `/platform/measure` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | HERO | `hero.default` | shared ×19 |
| 4 | FEATURES | `features.text-with-image` | shared ×10 |
| 5 | FEATURES | `features.feature-carousel` | shared ×7 |
| 6 | FEATURES | `features.text-with-image` | shared ×10 |
| 7 | FEATURES | `features.text-with-image` | shared ×10 |
| 8 | PROOF | `proof.quote` | shared ×20 |
| 9 | FEED | `feed.content-cards` | shared ×5 |
| 10 | CONTENT | `content.faq` | shared ×28 |
| 11 | SHELL | `shell.footer` | shared ×59 |

### Product page: platform/measure/carbon-accounting — `template.product-platform-measure-carbon-accounting`

1 route · `/platform/measure/carbon-accounting` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | HERO | `hero.default` | shared ×19 |
| 4 | CONTENT | `content.feature-text` | shared ×6 |
| 5 | CONTENT | `content.faq` | shared ×28 |
| 6 | CONTENT | `content.section-text-block` | shared ×7 |
| 7 | CONTENT | `content.section-text-block` | shared ×7 |
| 8 | CONTENT | `content.section-text-block` | shared ×7 |
| 9 | FEATURES | `features.text-with-image-list` | shared ×6 |
| 10 | CONTENT | `content.feature-text` | shared ×6 |
| 11 | PROOF | `proof.quote` | shared ×20 |
| 12 | FEED | `feed.page-link-set` | shared ×16 |
| 13 | SHELL | `shell.footer` | shared ×59 |

### Product page: platform/sustainability-ai — `template.product-platform-sustainability-ai`

1 route · `/platform/sustainability-ai` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | HERO | `hero.centered-agent` | page-local |
| 4 | PROOF | `proof.quote-video` | shared ×3 |
| 5 | PROOF | `proof.logos` | shared ×16 |
| 6 | PROOF | `proof.customer-photo-feature` | shared ×5 |
| 7 | CONTENT | `content.content-grid` | shared ×4 |
| 8 | CONVERSION | `conversion.inline-cta` | shared ×6 |
| 9 | FEED | `feed.content-cards` | shared ×5 |
| 10 | PROOF | `proof.quote` | shared ×20 |
| 11 | FEATURES | `features.text-with-image` | shared ×10 |
| 12 | FEATURES | `features.feature-large` | page-local |
| 13 | FEED | `feed.content-cards` | shared ×5 |
| 14 | CONTENT | `content.faq` | shared ×28 |
| 15 | SHELL | `shell.footer` | shared ×59 |

### Product page: solutions/california — `template.product-solutions-california`

1 route · `/solutions/california` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | HERO | `hero.default` | shared ×19 |
| 4 | PROOF | `proof.logos` | shared ×16 |
| 5 | CONTENT | `content.info-cards` | page-local |
| 6 | CONVERSION | `conversion.inline-cta` | shared ×6 |
| 7 | FEATURES | `features.text-with-image` | shared ×10 |
| 8 | FEATURES | `features.text-with-image` | shared ×10 |
| 9 | FEATURES | `features.text-with-image` | shared ×10 |
| 10 | FEATURES | `features.text-with-image` | shared ×10 |
| 11 | FEATURES | `features.text-with-image` | shared ×10 |
| 12 | FEATURES | `features.text-with-image` | shared ×10 |
| 13 | CONTENT | `content.faq` | shared ×28 |
| 14 | FEED | `feed.page-link-set` | shared ×16 |
| 15 | SHELL | `shell.footer` | shared ×59 |

### Block page: solutions/california/guaranteed-assurance / reading-list — `template.block-solutions-california-guaranteed-assurance-reading-list`

2 routes · `/solutions/california/guaranteed-assurance`, `/reading-list` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | CONTENT | `content.section-text-block` | shared ×7 |
| 4 | SHELL | `shell.footer` | shared ×59 |

### Product page: solutions/ceda — `template.product-solutions-ceda`

1 route · `/solutions/ceda` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | HERO | `hero.large-background` | page-local |
| 4 | FEATURES | `features.text-with-image` | shared ×10 |
| 5 | CONVERSION | `conversion.content-form` | page-local |
| 6 | PROOF | `proof.quote-background` | page-local |
| 7 | PROOF | `proof.quote` | shared ×20 |
| 8 | PROOF | `proof.personnel-slider` | page-local |
| 9 | FEATURES | `features.text-with-image-ordered-list` | shared ×6 |
| 10 | CONTENT | `content.faq` | shared ×28 |
| 11 | SHELL | `shell.footer` | shared ×59 |

### Product page: solutions/csrd — `template.product-solutions-csrd`

1 route · `/solutions/csrd` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | HERO | `hero.default` | shared ×19 |
| 4 | FEATURES | `features.feature-carousel` | shared ×7 |
| 5 | PROOF | `proof.logos` | shared ×16 |
| 6 | CONTENT | `content.feature-text` | shared ×6 |
| 7 | FEATURES | `features.text-with-image` | shared ×10 |
| 8 | FEATURES | `features.text-with-image` | shared ×10 |
| 9 | FEATURES | `features.feature-carousel` | shared ×7 |
| 10 | PROOF | `proof.quote` | shared ×20 |
| 11 | FEATURES | `features.text-with-image` | shared ×10 |
| 12 | FEED | `feed.page-link-set` | shared ×16 |
| 13 | CONTENT | `content.faq` | shared ×28 |
| 14 | SHELL | `shell.footer` | shared ×59 |

### Product page: solutions/energy-management — `template.product-solutions-energy-management`

1 route · `/solutions/energy-management` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | HERO | `hero.energy-forecast` | page-local |
| 4 | FEATURES | `features.feature-carousel` | shared ×7 |
| 5 | PROOF | `proof.quote-video` | shared ×3 |
| 6 | CONTENT | `content.content-grid` | shared ×4 |
| 7 | FEED | `feed.content-cards` | shared ×5 |
| 8 | CONTENT | `content.faq` | shared ×28 |
| 9 | CONVERSION | `conversion.inline-cta-form` | shared ×4 |
| 10 | SHELL | `shell.footer` | shared ×59 |

### Product page: solutions/finance — `template.product-solutions-finance`

1 route · `/solutions/finance` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | HERO | `hero.default` | shared ×19 |
| 4 | PROOF | `proof.logos` | shared ×16 |
| 5 | CONVERSION | `conversion.inline-cta` | shared ×6 |
| 6 | FEATURES | `features.text-with-image` | shared ×10 |
| 7 | FEATURES | `features.text-with-image` | shared ×10 |
| 8 | FEATURES | `features.text-with-image` | shared ×10 |
| 9 | FEED | `feed.page-link-set` | shared ×16 |
| 10 | CONTENT | `content.faq` | shared ×28 |
| 11 | SHELL | `shell.footer` | shared ×59 |

### Product page: solutions/product-footprints — `template.product-solutions-product-footprints`

1 route · `/solutions/product-footprints` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | HERO | `hero.video` | shared ×2 |
| 4 | PROOF | `proof.logos` | shared ×16 |
| 5 | PROOF | `proof.customer-photo-feature` | shared ×5 |
| 6 | CONTENT | `content.content-grid` | shared ×4 |
| 7 | PROOF | `proof.text-with-logos` | shared ×2 |
| 8 | CONVERSION | `conversion.inline-cta` | shared ×6 |
| 9 | CONTENT | `content.tables` | shared ×3 |
| 10 | CONTENT | `content.faq` | shared ×28 |
| 11 | SHELL | `shell.footer` | shared ×59 |

### Product page: solutions/supply-chain — `template.product-solutions-supply-chain`

1 route · `/solutions/supply-chain` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | HERO | `hero.default` | shared ×19 |
| 4 | PROOF | `proof.quote` | shared ×20 |
| 5 | FEATURES | `features.text-with-image` | shared ×10 |
| 6 | FEATURES | `features.text-with-image` | shared ×10 |
| 7 | FEATURES | `features.text-with-image` | shared ×10 |
| 8 | FEED | `feed.page-link-set` | shared ×16 |
| 9 | CONTENT | `content.faq` | shared ×28 |
| 10 | SHELL | `shell.footer` | shared ×59 |

### Customers index — `template.customers-index`

1 route · `/customers` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | HERO | `hero.customers` | page-local |
| 4 | PROOF | `proof.customer-logo-grid` | page-local |
| 5 | FEED | `feed.featured-stories` | page-local |
| 6 | FEED | `feed.customers-filters` | page-local |
| 7 | FEED | `feed.customers-grid` | page-local |
| 8 | PROOF | `proof.quote-carousel` | page-local |
| 9 | CONVERSION | `conversion.cta-bar` | shared ×2 |
| 10 | SHELL | `shell.footer` | shared ×59 |

### Customer story (story layout + related links) — `template.story-a-related`

2 routes · `/customers/adventhealth`, `/customers/flexera` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | ARTICLE | `article.story-hero` | shared ×2 |
| 4 | ARTICLE | `article.story-sidebar` | shared ×2 |
| 5 | ARTICLE | `article.story-body` | shared ×2 |
| 6 | FEED | `feed.page-links` | shared ×6 |
| 7 | SHELL | `shell.footer` | shared ×59 |

### Customer story (story layout) — `template.story-a`

33 routes · `/customers/{slug}` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | ARTICLE | `article.story-hero` | shared ×2 |
| 4 | ARTICLE | `article.story-sidebar` | shared ×2 |
| 5 | ARTICLE | `article.story-body` | shared ×2 |
| 6 | SHELL | `shell.footer` | shared ×59 |

### Customer story (article layout) — `template.post-customer-story`

16 routes · `/customers/{slug}` · chrome: **translucent nav**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | ARTICLE | `article.post-hero` | shared ×3 |
| 4 | ARTICLE | `article.prose` | shared ×3 |
| 5 | CONVERSION | `conversion.newsletter-band` | shared ×3 |
| 6 | FEED | `feed.related-posts-grid` | shared ×3 |
| 7 | SHELL | `shell.footer` | shared ×59 |

### Blog index — `template.feed-blog`

1 route · `/blog` · chrome: **translucent nav**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | HERO | `hero.feed-carousel` | shared ×3 |
| 4 | FEED | `feed.filter-bar` | shared ×2 |
| 5 | FEED | `feed.card-grid` | shared ×3 |
| 6 | FEED | `feed.load-more` | shared ×3 |
| 7 | SHELL | `shell.footer` | shared ×59 |

### News index — `template.news`

1 route · `/news` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | FEED | `feed.sidebar-index` | shared ×2 |
| 4 | SHELL | `shell.footer` | shared ×59 |

### Blog post (with table of contents) — `template.post-toc`

82 routes · `/blog/{slug}` · chrome: **translucent nav**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | ARTICLE | `article.post-hero` | shared ×3 |
| 4 | ARTICLE | `article.prose` | shared ×3 |
| 5 | ARTICLE | `article.toc` | shared ×2 |
| 6 | CONVERSION | `conversion.newsletter-band` | shared ×3 |
| 7 | FEED | `feed.related-posts-grid` | shared ×3 |
| 8 | SHELL | `shell.footer` | shared ×59 |

### Blog post — `template.post`

169 routes · `/blog/{slug} or /inside/{slug}` · chrome: **translucent nav**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | ARTICLE | `article.post-hero` | shared ×3 |
| 4 | ARTICLE | `article.prose` | shared ×3 |
| 5 | CONVERSION | `conversion.newsletter-band` | shared ×3 |
| 6 | FEED | `feed.related-posts-grid` | shared ×3 |
| 7 | SHELL | `shell.footer` | shared ×59 |

### Guides index — `template.feed-guides`

1 route · `/guides` · chrome: **translucent nav**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | HERO | `hero.feed-carousel` | shared ×3 |
| 4 | FEED | `feed.card-grid` | shared ×3 |
| 5 | FEED | `feed.load-more` | shared ×3 |
| 6 | SHELL | `shell.footer` | shared ×59 |

### Gated guide landing — `template.gated-guide`

13 routes · `/guides/{slug}` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | CONTENT | `content.gated-card` | shared ×5 |
| 4 | CONVERSION | `conversion.gated-form` | shared ×5 |
| 5 | FEED | `feed.page-links` | shared ×6 |
| 6 | SHELL | `shell.footer` | shared ×59 |

### Events index — `template.feed-events`

1 route · `/events` · chrome: **translucent nav**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | HERO | `hero.feed-carousel` | shared ×3 |
| 4 | FEED | `feed.filter-bar` | shared ×2 |
| 5 | FEED | `feed.card-grid` | shared ×3 |
| 6 | FEED | `feed.load-more` | shared ×3 |
| 7 | SHELL | `shell.footer` | shared ×59 |

### Summit event — `template.event-summit`

11 routes · `/events/2023-climate-week`, `/events/2023-summit`, `/events/2024-climate-week`, `/events/april-2025-summit`, `/events/csrd-summit`, `/events/nyc-summit-2025`, `/events/reporting-ai-summit-2026`, `/events/sustainability-ai-summit`, `/events/sustainability-summit-de`, `/events/virtual-summit-climate-programs-2026`, `/events/year-end-summit-2025` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | HERO | `hero.summit` | page-local |
| 4 | CONTENT | `content.summit-speakers` | page-local |
| 5 | CONTENT | `content.summit-sessions` | page-local |
| 6 | CONVERSION | `conversion.summit-closing-cta` | page-local |
| 7 | SHELL | `shell.footer` | shared ×59 |

### Event landing — `template.gated-event`

167 routes · `/events/{slug}` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | CONTENT | `content.gated-card` | shared ×5 |
| 4 | CONTENT | `content.event-logistics` | page-local |
| 5 | CONTENT | `content.event-speakers` | page-local |
| 6 | CONVERSION | `conversion.gated-form` | shared ×5 |
| 7 | FEED | `feed.page-links` | shared ×6 |
| 8 | SHELL | `shell.footer` | shared ×59 |

### Legal index — `template.legal-index`

1 route · `/legal` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | FEED | `feed.sidebar-index` | shared ×2 |
| 4 | SHELL | `shell.footer` | shared ×59 |

### Legal document — `template.legal-doc`

3 routes · `/legal/data-portal-terms`, `/legal/security`, `/legal/terms` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | ARTICLE | `article.legal-header` | shared ×2 |
| 4 | ARTICLE | `article.legal-body` | shared ×2 |
| 5 | SHELL | `shell.footer` | shared ×59 |

### Legal document (with table of contents) — `template.legal-toc`

1 route · `/legal/privacy` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | ARTICLE | `article.legal-header` | shared ×2 |
| 4 | ARTICLE | `article.legal-body` | shared ×2 |
| 5 | ARTICLE | `article.toc` | shared ×2 |
| 6 | SHELL | `shell.footer` | shared ×59 |

### Compare page: compare — `template.compare-compare`

1 route · `/compare` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | HERO | `hero.compete` | shared ×3 |
| 4 | PROOF | `proof.logos` | shared ×16 |
| 5 | PROOF | `proof.stats-ruled` | page-local |
| 6 | PROOF | `proof.quote-features` | shared ×3 |
| 7 | FEATURES | `features.feature-grid-numbered` | page-local |
| 8 | CONTENT | `content.link-list` | page-local |
| 9 | CONVERSION | `conversion.inline-cta-form` | shared ×4 |
| 10 | PROOF | `proof.customer-photo-feature` | shared ×5 |
| 11 | FEATURES | `features.text-with-image-ordered-list` | shared ×6 |
| 12 | PROOF | `proof.quotes-carousel` | shared ×2 |
| 13 | CONTENT | `content.faq` | shared ×28 |
| 14 | SHELL | `shell.footer` | shared ×59 |

### Compare page: compare/sweep — `template.compare-compare-sweep`

1 route · `/compare/sweep` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | HERO | `hero.compete` | shared ×3 |
| 4 | PROOF | `proof.logos` | shared ×16 |
| 5 | CONTENT | `content.faq-full-width` | shared ×2 |
| 6 | CONVERSION | `conversion.inline-cta-form` | shared ×4 |
| 7 | CONTENT | `content.table-questions-stats` | shared ×2 |
| 8 | CONTENT | `content.tables` | shared ×3 |
| 9 | PROOF | `proof.quote-features` | shared ×3 |
| 10 | PROOF | `proof.quote-video` | shared ×3 |
| 11 | CONTENT | `content.faq` | shared ×28 |
| 12 | SHELL | `shell.footer` | shared ×59 |

### Compare page: compare/workiva — `template.compare-compare-workiva`

1 route · `/compare/workiva` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | HERO | `hero.compete` | shared ×3 |
| 4 | PROOF | `proof.logos` | shared ×16 |
| 5 | CONTENT | `content.faq-full-width` | shared ×2 |
| 6 | CONVERSION | `conversion.inline-cta-form` | shared ×4 |
| 7 | CONTENT | `content.table-questions-stats` | shared ×2 |
| 8 | PROOF | `proof.quote-features` | shared ×3 |
| 9 | PROOF | `proof.quotes-carousel` | shared ×2 |
| 10 | CONTENT | `content.faq` | shared ×28 |
| 11 | SHELL | `shell.footer` | shared ×59 |

### Demo page — `template.demo`

1 route · `/demo` · chrome: **minimal: inverted nav, no promo bar, no footer**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.nav` | shared ×62 |
| 2 | HERO | `hero.form` | shared ×5 |
| 3 | PROOF | `proof.quote` | shared ×20 |

### Demo page (reporting variant) — `template.demo-csrd`

1 route · `/demo/csrd` · chrome: **minimal: inverted nav, no promo bar, no footer**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.nav` | shared ×62 |
| 2 | HERO | `hero.form` | shared ×5 |
| 3 | PROOF | `proof.quote` | shared ×20 |
| 4 | FEATURES | `features.feature-carousel` | shared ×7 |
| 5 | FEED | `feed.page-link-set` | shared ×16 |

### Campaign landing page — `template.lp`

3 routes · `/lp/why-watershed-disclosures`, `/lp/why-watershed-platform`, `/lp/why-watershed-platform-scopes` · chrome: **campaign: promo bar only**

| # | category | section | |
|---:|---|---|---|
| 1 | HERO | `hero.lp` | page-local |
| 2 | PROOF | `proof.logos` | shared ×16 |
| 3 | CONTENT | `content.header-band` | shared ×2 |
| 4 | FEATURES | `features.animated-steps` | page-local |
| 5 | CONVERSION | `conversion.cta-slim` | page-local |
| 6 | FEATURES | `features.lp-feature-grid` | page-local |
| 7 | CONVERSION | `conversion.featured-form` | page-local |

### Product tours index — `template.tour-index`

1 route · `/product-tours` · chrome: **translucent nav, no promo bar**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.nav` | shared ×62 |
| 2 | HERO | `hero.form` | shared ×5 |
| 3 | PROOF | `proof.quote` | shared ×20 |
| 4 | SHELL | `shell.footer` | shared ×59 |

### Product tour — `template.tour`

3 routes · `/product-tours/ai-reporting`, `/product-tours/california-disclosures`, `/product-tours/product-footprints` · chrome: **translucent nav, no promo bar**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.nav` | shared ×62 |
| 2 | HERO | `hero.form` | shared ×5 |
| 3 | PROOF | `proof.quote` | shared ×20 |
| 4 | PROOF | `proof.text-with-logos` | shared ×2 |
| 5 | SHELL | `shell.footer` | shared ×59 |

### Company page: about-us — `template.company-about-us`

1 route · `/about-us` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | HERO | `hero.default` | shared ×19 |
| 4 | PROOF | `proof.logos` | shared ×16 |
| 5 | CONTENT | `content.grid` | shared ×4 |
| 6 | CONTENT | `content.horizontal-rule` | shared ×3 |
| 7 | CONTENT | `content.feature-text` | shared ×6 |
| 8 | CONTENT | `content.section-text-block` | shared ×7 |
| 9 | FEED | `feed.page-link-set` | shared ×16 |
| 10 | CONTENT | `content.grid` | shared ×4 |
| 11 | CONTENT | `content.feature-text` | shared ×6 |
| 12 | CONTENT | `content.section-text-block` | shared ×7 |
| 13 | FEED | `feed.page-link-set` | shared ×16 |
| 14 | SHELL | `shell.footer` | shared ×59 |

### Company page: ai-fellowship — `template.company-ai-fellowship`

1 route · `/ai-fellowship` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | HERO | `hero.default` | shared ×19 |
| 4 | CONTENT | `content.faq` | shared ×28 |
| 5 | CONTENT | `content.video` | shared ×2 |
| 6 | PROOF | `proof.customer-photo-feature` | shared ×5 |
| 7 | CONTENT | `content.spacer` | page-local |
| 8 | CONTENT | `content.spacer` | page-local |
| 9 | CONTENT | `content.spacer` | page-local |
| 10 | SHELL | `shell.footer` | shared ×59 |

### Company page: brand — `template.company-brand`

1 route · `/brand` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | CONTENT | `content.brand-header` | page-local |
| 4 | CONTENT | `content.brand-logos` | page-local |
| 5 | CONTENT | `content.brand-colour` | page-local |
| 6 | CONTENT | `content.brand-typography` | page-local |
| 7 | CONVERSION | `conversion.brand-press-kit` | page-local |
| 8 | SHELL | `shell.footer` | shared ×59 |

### Company page: careers — `template.company-careers`

1 route · `/careers` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | HERO | `hero.careers` | page-local |
| 4 | CONTENT | `content.careers-roles-header` | page-local |
| 5 | CONTENT | `content.careers-department` | page-local |
| 6 | CONTENT | `content.careers-sidebar` | page-local |
| 7 | SHELL | `shell.footer` | shared ×59 |

### Company page: change — `template.company-change`

1 route · `/change` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | HERO | `hero.change` | page-local |
| 4 | CONTENT | `content.change-statement` | page-local |
| 5 | CONTENT | `content.change-changemakers` | page-local |
| 6 | PROOF | `proof.quote` | shared ×20 |
| 7 | CONTENT | `content.change-stats` | page-local |
| 8 | CONVERSION | `conversion.cta-bar` | shared ×2 |
| 9 | SHELL | `shell.footer` | shared ×59 |

### Company page: climate-leads — `template.company-climate-leads`

1 route · `/climate-leads` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | HERO | `hero.climate-leads` | page-local |
| 4 | CONTENT | `content.climate-leads-interviews` | page-local |
| 5 | FEED | `feed.blog-posts-theme-images` | shared ×2 |
| 6 | SHELL | `shell.footer` | shared ×59 |

### Company page: partners — `template.company-partners`

1 route · `/partners` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | CONTENT | `content.header-band` | shared ×2 |
| 4 | FEATURES | `features.text-with-image-list` | shared ×6 |
| 5 | PROOF | `proof.quote` | shared ×20 |
| 6 | CONTENT | `content.faq` | shared ×28 |
| 7 | FEED | `feed.blog-posts-theme-images` | shared ×2 |
| 8 | SHELL | `shell.footer` | shared ×59 |

### Podcast landing — `template.gated-podcast`

1 route · `/podcast` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | CONTENT | `content.gated-card` | shared ×5 |
| 4 | CONVERSION | `conversion.gated-form` | shared ×5 |
| 5 | FEED | `feed.page-links` | shared ×6 |
| 6 | SHELL | `shell.footer` | shared ×59 |

### Tool page — `template.tool`

1 route · `/tools/climate-policy-calendar` · chrome: **translucent nav**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | HERO | `hero.form` | shared ×5 |
| 4 | SHELL | `shell.footer` | shared ×59 |

### Gated report landing (with FAQ) — `template.gated-report-faq`

1 route · `/ai-emissions-sustainability` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | CONTENT | `content.gated-card` | shared ×5 |
| 4 | CONTENT | `content.faq` | shared ×28 |
| 5 | CONVERSION | `conversion.gated-form` | shared ×5 |
| 6 | FEED | `feed.page-links` | shared ×6 |
| 7 | SHELL | `shell.footer` | shared ×59 |

### Report page: Quiz — `template.report-quiz`

1 route · `/assessments/climate-disclosure` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | CONVERSION | `conversion.quiz` | page-local |
| 4 | SHELL | `shell.footer` | shared ×59 |

### Report page: Manifesto — `template.report-manifesto`

1 route · `/climate-economy` · chrome: **full, short footer**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | ARTICLE | `article.manifesto-header` | page-local |
| 4 | ARTICLE | `article.manifesto-part` | page-local |
| 5 | SHELL | `shell.footer-short` | page-local |

### Gated report landing — `template.gated-report`

5 routes · `/forrester-wave-2026`, `/sustainability-policy-newsletter`, `/the-healthcare-product-carbon-footprint-playbook`, `/verdantix-2025`, `/verdantix-smart-innovators-2026` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | CONTENT | `content.gated-card` | shared ×5 |
| 4 | CONVERSION | `conversion.gated-form` | shared ×5 |
| 5 | FEED | `feed.page-links` | shared ×6 |
| 6 | SHELL | `shell.footer` | shared ×59 |

### Report page: SOC2025Theme — `template.report-soc2025theme`

2 routes · `/state-of-corporate-sustainability-ai-2026`, `/verdantix-2026` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.promo-bar` | shared ×58 |
| 2 | SHELL | `shell.nav` | shared ×62 |
| 3 | HERO | `hero.soc-banner` | page-local |
| 4 | CONTENT | `content.soc-text-card` | page-local |
| 5 | CONVERSION | `conversion.soc-form-card` | page-local |
| 6 | SHELL | `shell.footer` | shared ×59 |

## Section reference

### SHELL

_Site chrome that wraps a page: promo bar, navigation and footer, in the variants a route can opt into._

**`shell.promo-bar`** — Thin dark bar above the nav that rotates through offer messages with prev/next arrows; below 700px the active message scrolls as a marquee.

· Used on 555 routes (home, product, company, customers-index, customer-story, blog-index, blog-post, guides-index, guide, events-index, event, legal, compare, tool, report-landing). · appears on 555 routes · implemented by `src/components/PromoBar.jsx`

**`shell.nav`** — Sticky 68px top navigation: wordmark, three hover dropdown menus (Product, Resources, Company), a Customers link, Sign in and Book a demo; a hamburger panel with drill-in submenus below 1024px. Variants: opaque, translucent (turns opaque on first scroll), inverted (white text over a dark hero, no demo button).

· Used on 561 routes (home, product, company, customers-index, customer-story, blog-index, blog-post, guides-index, guide, events-index, event, legal, compare, demo, product-tour, tool, report-landing). · appears on 561 routes · implemented by `src/components/Nav.jsx`

**`shell.footer`** — Peach-to-cobalt gradient call-to-action strip with a collapsible demo form, above a dark link panel (seven link groups, locale select, legal row) with a large outlined arc decoration on the right.

· Used on 558 routes (home, product, company, customers-index, customer-story, blog-index, blog-post, guides-index, guide, events-index, event, legal, compare, product-tour, tool, report-landing). · appears on 558 routes · implemented by `src/components/Footer.jsx`

**`shell.footer-short`** — The same footer with a shorter call-to-action strip: heading plus a single email-capture field and centred legal copy instead of the demo form.

· Used on 1 route (report-landing). · appears on 1 routes · implemented by `src/components/Footer.jsx`

### HERO

_The page-opening block above the first content band._

**`hero.home`** — Homepage hero: dithered landscape backdrop, decoding-text eyebrow ticker, H1, email field joined to a button on a glass pill, colour-tile block around a product image with a typing prompt pill, 6x2 customer-logo grid with hover case-study strips, and a three-column testimonial row.

· Used on 1 route (home). · appears on 1 routes · implemented by `src/components/Hero.jsx`

**`hero.default`** — Standard product-page hero: eyebrow, H1, subhead and primary/secondary buttons beside a 552px media square on a pale-blue gradient (variants for 3:4 media and background tint).

· Used on 23 routes (product, company). · appears on 23 routes · implemented by `src/blocks/Hero.jsx`

**`hero.video`** — Large-type hero with a 64px H1 and a wide autoplay-video placeholder panel below it, on a pale gradient.

· Used on 2 routes (product). · appears on 2 routes · implemented by `src/blocks/HeroVideo.jsx`

**`hero.centered-agent`** — Centred AI hero over a purple glow field: pill, H1, subhead, CTAs, then the shared typing prompt demo with suggestion chips.

· Used on 1 route (product). · appears on 1 routes · implemented by `src/blocks/CenteredAgent.jsx`

**`hero.large-background`** — Tall centred hero with a logo mark, 64px H1, subhead and a small button over a large decorative illustration.

· Used on 1 route (product). · appears on 1 routes · implemented by `src/blocks/LargeBackground.jsx`

**`hero.compete`** — Comparison-page hero: intro copy plus a panel of comparison tiles or links and a proof strip with chevron controls.

· Used on 3 routes (compare). · appears on 3 routes · implemented by `src/blocks/HeroCompete.jsx`

**`hero.carousel`** — Marketplace hero with a sliding carousel of partner/integration cards.

· Used on 1 route (product). · appears on 1 routes · implemented by `src/blocks/HeroWithCarousel.jsx`

**`hero.energy-forecast`** — Energy-management hero: intro text, a ringed prompt pill and a dark glass frame holding a forecast chart image.

· Used on 1 route (product). · appears on 1 routes · implemented by `src/blocks/EnergyForecast.jsx`

**`hero.form`** — Hero with the conversion form built in (dark theme for demo pages, light for tours and tools): copy, feature list, stats or quote on one side and a form card or banner form on the other.

· Used on 7 routes (demo, product-tour, tool). · appears on 7 routes · implemented by `src/primitives/HeroWithForm.jsx`

**`hero.lp`** — Campaign-page hero: uppercase eyebrow, light-weight 60px H1, body copy and a single arrow button, with a cursor-following highlight.

· Used on 3 routes (demo). · appears on 3 routes · implemented by `src/pages/content/DemoPages.jsx > LpHero`

**`hero.feed-carousel`** — Autoplaying featured-story carousel that opens blog, guides and events indexes: media beside title and excerpt, progress dots and a pause control.

· Used on 3 routes (blog-index, guides-index, events-index). · appears on 3 routes · implemented by `src/primitives/FeaturedCarousel.jsx`

**`hero.customers`** — Customers index hero: eyebrow, serif H1 and lead copy beside a tall video placeholder with a play button.

· Used on 1 route (customers-index). · appears on 1 routes · implemented by `src/templates/CustomersIndex.jsx > Hero`

**`hero.change`** — Full-bleed photo hero for the Change page with a logo row, a three-line uppercase wordmark and a small caption.

· Used on 1 route (company). · appears on 1 routes · implemented by `src/blocks/templates/Change.jsx`

**`hero.climate-leads`** — Blue hero with a right-aligned serif H1, intro paragraphs, a row of round avatar chips and a photo closed by an angled white cut.

· Used on 1 route (company). · appears on 1 routes · implemented by `src/blocks/templates/ClimateLeads.jsx`

**`hero.soc-banner`** — Full-width banner image that starts under the nav at the top of the report landing pages.

· Used on 2 routes (report-landing). · appears on 2 routes · implemented by `src/blocks/templates/SOC2025Theme.jsx`

**`hero.summit`** — Summit event opener: large mono title, date lines, intro copy and a waitlist form card. Opens the page, so it is classed HERO.

· Used on 11 routes (event). · appears on 11 routes · implemented by `src/templates/SummitEvent.jsx`

**`hero.careers`** — Dark photo header across both columns with H1 and intro paragraphs. Opens the careers page, so it is classed HERO.

· Used on 1 route (company). · appears on 1 routes · implemented by `src/blocks/templates/Careers.jsx`

### PROOF

_Social proof and credibility: logos, testimonials, customer stats, analyst awards._

**`proof.logos`** — Static customer-logo strip under a hero: mono label above a row of invented logo marks (small and medium sizes).

· Used on 20 routes (product, compare, demo, company). · appears on 20 routes · implemented by `src/blocks/Logos.jsx`

**`proof.logo-marquee`** — Stepped customer-logo carousel that moves one logo slot at a time while on screen; logos are grey and turn colour on hover (dark tone available).

· Used on 1 route (home). · appears on 1 routes · implemented by `src/components/LogoMarquee.jsx`

**`proof.awards-slider`** — Analyst-recognition section: eyebrow, H2, paragraph and call to action beside an award badge and a looping badge slider. The call to action is two buttons on the homepage and a single mono link on product pages.

· Used on 2 routes (home, product). · appears on 2 routes · implemented by `src/components/Awards.jsx`

**`proof.quote`** — Single testimonial: logo tile in a bordered cell beside a large quote, name and role, with optional prev/next arrows for several quotes.

· Used on 25 routes (product, demo, product-tour, company). · appears on 25 routes · implemented by `src/blocks/Quote.jsx`

**`proof.quote-background`** — Large pull quote set over a dark full-bleed image, without attribution.

· Used on 1 route (product). · appears on 1 routes · implemented by `src/blocks/QuoteBackground.jsx`

**`proof.quote-features`** — Testimonial paired with a short list of feature highlights.

· Used on 3 routes (compare). · appears on 3 routes · implemented by `src/blocks/QuoteFeatures.jsx`

**`proof.quotes-carousel`** — Horizontally sliding row of quote cards (408px pitch) with detail lines.

· Used on 2 routes (compare). · appears on 2 routes · implemented by `src/blocks/QuotesCarousel.jsx`

**`proof.quote-video`** — Bordered callout pairing a customer quote with a video thumbnail and centred play button (medium and small sizes).

· Used on 3 routes (product, compare). · appears on 3 routes · implemented by `src/blocks/QuoteVideo.jsx`

**`proof.customer-photo-feature`** — Row of portrait photo cards each carrying a headline customer metric, with a header link and slider arrows.

· Used on 5 routes (product, compare, company). · appears on 5 routes · implemented by `src/blocks/CustomerPhotoFeature.jsx`

**`proof.people-carousel`** — Slider of people cards (marketplace partners and experts).

· Used on 1 route (product). · appears on 1 routes · implemented by `src/blocks/PeopleCarousel.jsx`

**`proof.personnel-slider`** — Full-bleed slider of 240px staff cards (photo, name, role) with a header and round arrow controls.

· Used on 1 route (product). · appears on 1 routes · implemented by `src/blocks/PersonnelSlider.jsx`

**`proof.stats-cornerstone`** — Homepage stats card: four headline statistics in a row, a dotted divider band, then an illustration beside supporting text.

· Used on 1 route (home). · appears on 1 routes · implemented by `src/components/Stats.jsx`

**`proof.stats-ruled`** — Row of large statistics separated by thin rules (comparison page).

· Used on 1 route (compare). · appears on 1 routes · implemented by `src/blocks/StatsRuled.jsx`

**`proof.text-with-logos`** — Text column with a link beside a dithered grid of logo tiles that swap on a timer.

· Used on 4 routes (product, product-tour). · appears on 4 routes · implemented by `src/blocks/TextWithLogos.jsx`

**`proof.customer-logo-grid`** — Customers index band of 12 logo tiles that flip to new logos every few seconds.

· Used on 1 route (customers-index). · appears on 1 routes · implemented by `src/templates/CustomersIndex.jsx > LogoGrid`

**`proof.quote-carousel`** — Customers index slider of large customer quotes with avatar, advancing automatically with dot controls.

· Used on 1 route (customers-index). · appears on 1 routes · implemented by `src/templates/CustomersIndex.jsx > QuoteCarousel`

### FEATURES

_Product explanation modules: capability rows, step tabs, carousels, demos._

**`features.product-overview`** — Product tour band: three auto-advancing steps (6-second progress bar, expanding description) beside a stage image and screen panel; dark on the homepage, light mode available.

· Used on 3 routes (home, product). · appears on 3 routes · implemented by `src/components/ProductOverview.jsx`

**`features.feature-carousel`** — Header with arrow controls above a track of 384px feature cards that moves one card per click and supports drag.

· Used on 7 routes (home, product, demo). · appears on 7 routes · implemented by `src/components/FeatureCarousel.jsx`

**`features.ai-agents-demo`** — Homepage AI section over a purple glow: three feature columns, then a glass prompt card that types example prompts, with suggestion chips.

· Used on 1 route (home). · appears on 1 routes · implemented by `src/components/Agents.jsx`

**`features.text-with-image`** — The workhorse feature row: eyebrow, title, body and a bullet list or link beside a media box; image side alternates.

· Used on 10 routes (product). · appears on 10 routes · implemented by `src/blocks/TextWithImage.jsx`

**`features.text-with-image-list`** — Alternating rows on a 12-column grid, each an image beside a text column.

· Used on 8 routes (product, company). · appears on 8 routes · implemented by `src/blocks/TextWithImageList.jsx`

**`features.text-with-image-ordered-list`** — Up to four numbered steps, each a 512px media beside copy, alternating sides (industry pages).

· Used on 8 routes (product, compare). · appears on 8 routes · implemented by `src/blocks/TextWithImageOrderedList.jsx`

**`features.feature-large`** — Large intro (eyebrow, H2, body in two columns) above a grid of icon-tile feature items.

· Used on 1 route (product). · appears on 1 routes · implemented by `src/blocks/FeatureLarge.jsx`

**`features.feature-grid-numbered`** — Grid of numbered feature cells.

· Used on 1 route (compare). · appears on 1 routes · implemented by `src/blocks/FeatureGridNumbered.jsx`

**`features.animated-gallery`** — Marketplace gallery of tiles that stack and slide in as the page scrolls.

· Used on 1 route (product). · appears on 1 routes · implemented by `src/blocks/AnimatedGallery.jsx`

**`features.animated-steps`** — Campaign-page step list with a progress bar that auto-advances and pauses on hover (static list below 900px).

· Used on 3 routes (demo). · appears on 3 routes · implemented by `src/pages/content/DemoPages.jsx > AnimatedSteps`

**`features.lp-feature-grid`** — Campaign-page grid of feature cards.

· Used on 3 routes (demo). · appears on 3 routes · implemented by `src/pages/content/DemoPages.jsx > LpFeatureGrid`

### CONTENT

_Substantive body bands: prose, tables, grids, statements, FAQs, bespoke one-page bodies._

**`content.feature-text`** — Big centred statement: 48px H2, optionally with a call-to-action button or section-heading treatment.

· Used on 8 routes (product, company). · appears on 8 routes · implemented by `src/blocks/FeatureText.jsx`

**`content.section-text-block`** — 752px prose column using the shared article text styles, optionally with a table of contents and margin annotations.

· Used on 10 routes (product, company). · appears on 10 routes · implemented by `src/blocks/SectionTextBlock.jsx`

**`content.grid`** — Two- or three-column item grid with a header; items can be numbered, image-topped or plain.

· Used on 4 routes (product, company). · appears on 4 routes · implemented by `src/blocks/Grid.jsx`

**`content.content-grid`** — Bento grid of wide, half and narrow media cards with title, description and link.

· Used on 4 routes (product). · appears on 4 routes · implemented by `src/blocks/ContentGrid.jsx`

**`content.text-with-list`** — Icon and 60px intro title beside columns of list items on a 12-column grid.

· Used on 1 route (product). · appears on 1 routes · implemented by `src/blocks/TextWithList.jsx`

**`content.tables`** — Titled comparison table with alternating banded rows.

· Used on 3 routes (product, compare). · appears on 3 routes · implemented by `src/blocks/Tables.jsx`

**`content.table-questions-stats`** — Comparison table of questions with supporting statistics.

· Used on 2 routes (compare). · appears on 2 routes · implemented by `src/blocks/TableQuestionsStats.jsx`

**`content.faq`** — Accordion of questions that slide open, with a call-to-action box; a compact variant sits inside gated landing cards.

· Used on 32 routes (product, compare, company, report-landing). · appears on 32 routes · implemented by `src/primitives/Faq.jsx`

**`content.faq-full-width`** — Full-width FAQ list with its own heading and spacing.

· Used on 2 routes (compare). · appears on 2 routes · implemented by `src/blocks/FaqFullWidth.jsx`

**`content.header-band`** — Eyebrow, title and body header band, used to open a page or to introduce a mid-page section.

· Used on 4 routes (demo, company). · appears on 4 routes · implemented by `src/blocks/HeaderRoot.jsx`

**`content.horizontal-rule`** — Thin 1152px rule that separates bands on long-form pages.

· Used on 5 routes (product, company). · appears on 5 routes · implemented by `src/blocks/HorizontalRule.jsx`

**`content.spacer`** — 96px empty gap.

· Used on 1 route (company). · appears on 1 routes · implemented by `src/blocks/Spacer.jsx`

**`content.video`** — Bordered 16:9 video placeholder with a play overlay (no embed).

· Used on 2 routes (product, company). · appears on 2 routes · implemented by `src/blocks/Video.jsx`

**`content.info-cards`** — Heading and cards over a full-bleed photo background.

· Used on 1 route (product). · appears on 1 routes · implemented by `src/blocks/InfoCards.jsx`

**`content.link-list`** — Header with a list or chips of links.

· Used on 1 route (compare). · appears on 1 routes · implemented by `src/blocks/LinkList.jsx`

**`content.mission-split`** — Homepage split band: dark text panel with a dashed cobalt rule beside a full-height photo with a gold dot-grid overlay.

· Used on 1 route (home). · appears on 1 routes · implemented by `src/components/Mission.jsx`

**`content.gated-card`** — Left column of a gated landing page: mono kind label, large title and body copy in a ruled white card over a blueprint grid.

· Used on 187 routes (guide, event, company, report-landing). · appears on 187 routes · implemented by `src/templates/GatedLanding.jsx`

**`content.event-logistics`** — Blue date, time and location block inside an event landing card.

· Used on 167 routes (event). · appears on 167 routes · implemented by `src/templates/GatedLanding.jsx`

**`content.event-speakers`** — Speakers list on event landing pages: square photo beside name and role.

· Used on 167 routes (event). · appears on 167 routes · implemented by `src/templates/GatedLanding.jsx`

**`content.summit-speakers`** — Summit speaker grid inside a white card.

· Used on 11 routes (event). · appears on 11 routes · implemented by `src/templates/SummitEvent.jsx`

**`content.summit-sessions`** — Summit agenda: time pill, title and description per session.

· Used on 11 routes (event). · appears on 11 routes · implemented by `src/templates/SummitEvent.jsx`

**`content.careers-roles-header`** — Roles header and the row of location filter pills.

· Used on 1 route (company). · appears on 1 routes · implemented by `src/blocks/templates/Careers.jsx`

**`content.careers-department`** — One department group: H3 name and alternating job rows with locations and chevrons; repeats per department.

· Used on 1 route (company). · appears on 1 routes · implemented by `src/blocks/templates/Careers.jsx`

**`content.careers-sidebar`** — Right column of link sections separated by dotted rules, ending in a photo slider.

· Used on 1 route (company). · appears on 1 routes · implemented by `src/blocks/templates/Careers.jsx`

**`content.brand-header`** — Brand page H1 band.

· Used on 1 route (company). · appears on 1 routes · implemented by `src/blocks/templates/Brand.jsx`

**`content.brand-logos`** — Light and dark logo tiles with spec rows and download chips, plus a trademark note.

· Used on 1 route (company). · appears on 1 routes · implemented by `src/blocks/templates/Brand.jsx`

**`content.brand-colour`** — Nine colour swatches with names, hex values and copy buttons.

· Used on 1 route (company). · appears on 1 routes · implemented by `src/blocks/templates/Brand.jsx`

**`content.brand-typography`** — Sans, serif and mono type samples with captions.

· Used on 1 route (company). · appears on 1 routes · implemented by `src/blocks/templates/Brand.jsx`

**`content.change-statement`** — Tall scroll runway with a sticky large statement followed by highlighted paragraphs and a primary button.

· Used on 1 route (company). · appears on 1 routes · implemented by `src/blocks/templates/Change.jsx`

**`content.change-changemakers`** — Changemakers intro text and a three-column grid of people cards with photo, customer logo, name and role.

· Used on 1 route (company). · appears on 1 routes · implemented by `src/blocks/templates/Change.jsx`

**`content.change-stats`** — Second scroll runway: a pinned photo panel with two bordered statistic boxes and white paragraphs.

· Used on 1 route (company). · appears on 1 routes · implemented by `src/blocks/templates/Change.jsx`

**`content.climate-leads-interviews`** — Alternating interview sections: round avatar, serif name, Q&A and a ruled aside with logo, facts and an optional diagram; pull quotes between.

· Used on 1 route (company). · appears on 1 routes · implemented by `src/blocks/templates/ClimateLeads.jsx`

**`content.soc-text-card`** — Bordered white card with cobalt H1 and report description with a custom bullet list.

· Used on 2 routes (report-landing). · appears on 2 routes · implemented by `src/blocks/templates/SOC2025Theme.jsx`

### CONVERSION

_Calls to action and forms: demo requests, gated downloads, newsletter and email capture._

**`conversion.brand-press-kit`** — Press-kit heading and a primary download button: a conversion block (download), classed CONVERSION rather than CONTENT.

· Used on 1 route (company). · appears on 1 routes · implemented by `src/blocks/templates/Brand.jsx`

**`conversion.inline-cta`** — Call-to-action band in recessed, inline or stacked variants: text plus one primary button.

· Used on 8 routes (product). · appears on 8 routes · implemented by `src/blocks/InlineCta.jsx`

**`conversion.inline-cta-form`** — Newsletter-style email capture band built on the shared email-catcher form.

· Used on 4 routes (product, compare). · appears on 4 routes · implemented by `src/blocks/InlineCtaForm.jsx`

**`conversion.cta-form`** — Closing form band for the marketplace page.

· Used on 1 route (product). · appears on 1 routes · implemented by `src/blocks/CTAForm.jsx`

**`conversion.content-form`** — Bordered two-panel block: option rows on the left, request form on the right.

· Used on 1 route (product). · appears on 1 routes · implemented by `src/blocks/ContentForm.jsx`

**`conversion.cta-bar`** — Slim call-to-action row: title and one button between rules.

· Used on 2 routes (customers-index, company). · appears on 2 routes · implemented by `src/primitives/CTABar.jsx`

**`conversion.cta-slim`** — Campaign-page slim call to action.

· Used on 3 routes (demo). · appears on 3 routes · implemented by `src/pages/content/DemoPages.jsx > CtaSlim`

**`conversion.featured-form`** — Campaign-page closing form block.

· Used on 3 routes (demo). · appears on 3 routes · implemented by `src/pages/content/DemoPages.jsx > FeaturedForm`

**`conversion.gated-form`** — Right column of a gated landing page: cover image, cobalt heading and the shared form with floating labels.

· Used on 187 routes (guide, event, company, report-landing). · appears on 187 routes · implemented by `src/templates/GatedLanding.jsx`

**`conversion.newsletter-band`** — Bracketed newsletter sign-up band; inset after the sixth card in feed grids and shown above related content on posts.

· Used on 267 routes (customer-story, blog-post). · appears on 267 routes · implemented by `src/primitives/NewsletterBand.jsx`

**`conversion.quiz`** — Quiz card on a gradient band: intro, six question slides with progress bar and previous/next, then a form slide.

· Used on 1 route (report-landing). · appears on 1 routes · implemented by `src/blocks/templates/Quiz.jsx`

**`conversion.soc-form-card`** — Cover image above a bordered form card, with a decorative footer image band.

· Used on 2 routes (report-landing). · appears on 2 routes · implemented by `src/blocks/templates/SOC2025Theme.jsx`

**`conversion.summit-closing-cta`** — Bordered translucent closing band: summit name, date line and a Register button that scrolls to the form.

· Used on 11 routes (event). · appears on 11 routes · implemented by `src/templates/SummitEvent.jsx`

### FEED

_Collections of linked content: card grids, lists, filters, featured sliders, related-link sets._

**`feed.content-cards`** — Header with a button above three 16:9 image cards with eyebrow, title and a read-more or description line.

· Used on 5 routes (home, product). · appears on 5 routes · implemented by `src/components/ContentCards.jsx`

**`feed.page-link-set`** — Related-pages block: title and three linked media cards.

· Used on 20 routes (product, demo, company). · appears on 20 routes · implemented by `src/blocks/PageLinkSet.jsx`

**`feed.page-links`** — Related-resources cards that fade up as they scroll into view (the one scroll reveal on the site) and slide on small screens.

· Used on 189 routes (customer-story, guide, event, company, report-landing). · appears on 189 routes · implemented by `src/primitives/PageLinks.jsx`

**`feed.blog-posts-theme-images`** — Grid of bordered post cards with figure, title and arrow.

· Used on 2 routes (company). · appears on 2 routes · implemented by `src/blocks/BlogPostsThemeImages.jsx`

**`feed.filter-bar`** — Filter chips (and, on the blog, a search box) that write a filter query parameter.

· Used on 2 routes (blog-index, events-index). · appears on 2 routes · implemented by `src/primitives/Feed.jsx > FilterChips`

**`feed.card-grid`** — Three-column grid of content cards; on filterable feeds a newsletter band is inset after the sixth card.

· Used on 3 routes (blog-index, guides-index, events-index). · appears on 3 routes · implemented by `src/primitives/Feed.jsx > FeedGrid`

**`feed.load-more`** — Load more button that reveals twelve further cards.

· Used on 3 routes (blog-index, guides-index, events-index). · appears on 3 routes · implemented by `src/primitives/Feed.jsx > LoadMore`

**`feed.related-posts-grid`** — Grid of related content cards at the foot of a post.

· Used on 267 routes (customer-story, blog-post). · appears on 267 routes · implemented by `src/primitives/Feed.jsx > FeedGrid`

**`feed.sidebar-index`** — Index page with a full-height sidebar (title, anchor nav, contact notice) beside ruled list rows: coverage and release rows on news, document links on legal.

· Used on 2 routes (blog-index, legal). · appears on 2 routes · implemented by `src/primitives/SidebarList.jsx`

**`feed.featured-stories`** — Customers index slider of featured story cards with a hover overlay.

· Used on 1 route (customers-index). · appears on 1 routes · implemented by `src/templates/CustomersIndex.jsx > FeaturedStories`

**`feed.customers-filters`** — Header of the customers directory: H2 and three floating-label selects (region, industry, type) that rewrite the URL query.

· Used on 1 route (customers-index). · appears on 1 routes · implemented by `src/templates/CustomersIndex.jsx > AllCustomers`

**`feed.customers-grid`** — Three-column directory grid of 83 customer cells that show a logo and reveal title and footer on hover.

· Used on 1 route (customers-index). · appears on 1 routes · implemented by `src/templates/CustomersIndex.jsx > AllCustomers`

### ARTICLE

_Reading layouts for long-form pages: posts, customer stories, legal documents, with their navigation aids._

**`article.post-hero`** — Post opener: breadcrumbs, date, title, subtitle and a 552px media image, under a translucent nav.

· Used on 267 routes (customer-story, blog-post). · appears on 267 routes · implemented by `src/primitives/PostHero.jsx`

**`article.prose`** — Article body in the shared prose styles: 20/30 text, headings, nested lists, quotes, figures with caption pills, callouts, tables and inline code; followed by a topics row on most posts.

· Used on 267 routes (customer-story, blog-post). · appears on 267 routes · implemented by `src/primitives/Prose.jsx`

**`article.toc`** — Sticky table of contents beside the article that highlights the section in view (starts with an Introduction item).

· Used on 83 routes (blog-post, legal). · appears on 83 routes · implemented by `src/primitives/Toc.jsx`

**`article.story-hero`** — Customer story header: logo, title and subtitle over a wide banner with a play control.

· Used on 35 routes (customer-story). · appears on 35 routes · implemented by `src/templates/CustomerStory.jsx`

**`article.story-sidebar`** — Sticky full-height sidebar with customer facts, product list, section links and a next-story button.

· Used on 35 routes (customer-story). · appears on 35 routes · implemented by `src/templates/CustomerStory.jsx`

**`article.story-body`** — Story sections beside the sidebar: media, quote and prose sections that the sidebar links track.

· Used on 35 routes (customer-story). · appears on 35 routes · implemented by `src/templates/CustomerStory.jsx`

**`article.legal-header`** — Legal document header: back link strip and the serif light-weight H1.

· Used on 4 routes (legal). · appears on 4 routes · implemented by `src/pages/content/LegalPages.jsx > LegalDocument`

**`article.legal-body`** — Legal prose in the 792px column (h2 and h3 at weight 400, long tables), with an optional sticky table of contents on the privacy policy.

· Used on 4 routes (legal). · appears on 4 routes · implemented by `src/pages/content/LegalPages.jsx > LegalDocument`

**`article.manifesto-header`** — Essay opener on a 752px column: 64px H1 and the heading-less intro paragraphs.

· Used on 1 route (report-landing). · appears on 1 routes · implemented by `src/blocks/templates/Manifesto.jsx`

**`article.manifesto-part`** — One essay part: 32px H2, body paragraphs and a bordered chart figure with a caption; repeats five times.

· Used on 1 route (report-landing). · appears on 1 routes · implemented by `src/blocks/templates/Manifesto.jsx`
