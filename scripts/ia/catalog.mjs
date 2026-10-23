// Hand-written half of the IA: categories and one description per section (defined exactly once).
// Everything else in ia.json (route lists, block orders, variants, chrome, scope counts) is derived from the project's code by gen.mjs.

export const CATEGORIES = {
  SHELL: 'Site chrome that wraps a page: promo bar, navigation and footer, in the variants a route can opt into.',
  HERO: 'The page-opening block above the first content band.',
  PROOF: 'Social proof and credibility: logos, testimonials, customer stats, analyst awards.',
  FEATURES: 'Product explanation modules: capability rows, step tabs, carousels, demos.',
  CONTENT: 'Substantive body bands: prose, tables, grids, statements, FAQs, bespoke one-page bodies.',
  CONVERSION: 'Calls to action and forms: demo requests, gated downloads, newsletter and email capture.',
  FEED: 'Collections of linked content: card grids, lists, filters, featured sliders, related-link sets.',
  ARTICLE: 'Reading layouts for long-form pages: posts, customer stories, legal documents, with their navigation aids.',
};

const C = 'src/components/';
const B = 'src/blocks/';
const P = 'src/primitives/';
const T = 'src/templates/';
const D = 'src/pages/content/DemoPages.jsx';
const G = 'src/pages/content/GatedPages.jsx';

// id -> { category, description, implementedBy }. `blockType` links a section to a key in src/blocks/index.js.
export const SECTIONS = {
  // ---- SHELL
  'shell.promo-bar': { category: 'SHELL', implementedBy: C + 'PromoBar.jsx', description: 'Thin dark bar above the nav that rotates through offer messages with prev/next arrows; below 700px the active message scrolls as a marquee.' },
  'shell.nav': { category: 'SHELL', implementedBy: C + 'Nav.jsx', description: 'Sticky 68px top navigation: wordmark, three hover dropdown menus (Product, Resources, Company), a Customers link, Sign in and Book a demo; a hamburger panel with drill-in submenus below 1024px. Variants: opaque, translucent (turns opaque on first scroll), inverted (white text over a dark hero, no demo button).' },
  'shell.footer': { category: 'SHELL', implementedBy: C + 'Footer.jsx', description: 'Peach-to-cobalt gradient call-to-action strip with a collapsible demo form, above a dark link panel (seven link groups, locale select, legal row) with a large outlined arc decoration on the right.' },
  'shell.footer-short': { category: 'SHELL', implementedBy: C + 'Footer.jsx', description: 'The same footer with a shorter call-to-action strip: heading plus a single email-capture field and centred legal copy instead of the demo form.' },

  // ---- HERO
  'hero.home': { category: 'HERO', implementedBy: C + 'Hero.jsx', description: 'Homepage hero: dithered landscape backdrop, decoding-text eyebrow ticker, H1, email field joined to a button on a glass pill, colour-tile block around a product image with a typing prompt pill, 6x2 customer-logo grid with hover case-study strips, and a three-column testimonial row.' },
  'hero.default': { category: 'HERO', blockType: 'Hero', implementedBy: B + 'Hero.jsx', description: 'Standard product-page hero: eyebrow, H1, subhead and primary/secondary buttons beside a 552px media square on a pale-blue gradient (variants for 3:4 media and background tint).' },
  'hero.video': { category: 'HERO', blockType: 'HeroVideo', implementedBy: B + 'HeroVideo.jsx', description: 'Large-type hero with a 64px H1 and a wide autoplay-video placeholder panel below it, on a pale gradient.' },
  'hero.centered-agent': { category: 'HERO', blockType: 'CenteredAgent', implementedBy: B + 'CenteredAgent.jsx', description: 'Centred AI hero over a purple glow field: pill, H1, subhead, CTAs, then the shared typing prompt demo with suggestion chips.' },
  'hero.large-background': { category: 'HERO', blockType: 'LargeBackground', implementedBy: B + 'LargeBackground.jsx', description: 'Tall centred hero with a logo mark, 64px H1, subhead and a small button over a large decorative illustration.' },
  'hero.compete': { category: 'HERO', blockType: 'HeroCompete', implementedBy: B + 'HeroCompete.jsx', description: 'Comparison-page hero: intro copy plus a panel of comparison tiles or links and a proof strip with chevron controls.' },
  'hero.carousel': { category: 'HERO', blockType: 'HeroWithCarousel', implementedBy: B + 'HeroWithCarousel.jsx', description: 'Marketplace hero with a sliding carousel of partner/integration cards.' },
  'hero.energy-forecast': { category: 'HERO', blockType: 'EnergyForecast', implementedBy: B + 'EnergyForecast.jsx', description: 'Energy-management hero: intro text, a ringed prompt pill and a dark glass frame holding a forecast chart image.' },
  'hero.form': { category: 'HERO', implementedBy: P + 'HeroWithForm.jsx', description: 'Hero with the conversion form built in (dark theme for demo pages, light for tours and tools): copy, feature list, stats or quote on one side and a form card or banner form on the other.' },
  'hero.lp': { category: 'HERO', implementedBy: D + ' > LpHero', description: 'Campaign-page hero: uppercase eyebrow, light-weight 60px H1, body copy and a single arrow button, with a cursor-following highlight.' },
  'hero.feed-carousel': { category: 'HERO', implementedBy: P + 'FeaturedCarousel.jsx', description: 'Autoplaying featured-story carousel that opens blog, guides and events indexes: media beside title and excerpt, progress dots and a pause control.' },
  'hero.customers': { category: 'HERO', implementedBy: T + 'CustomersIndex.jsx > Hero', description: 'Customers index hero: eyebrow, serif H1 and lead copy beside a tall video placeholder with a play button.' },
  'hero.change': { category: 'HERO', implementedBy: B + 'templates/Change.jsx', description: 'Full-bleed photo hero for the Change page with a logo row, a three-line uppercase wordmark and a small caption.' },
  'hero.climate-leads': { category: 'HERO', implementedBy: B + 'templates/ClimateLeads.jsx', description: 'Blue hero with a right-aligned serif H1, intro paragraphs, a row of round avatar chips and a photo closed by an angled white cut.' },
  'hero.soc-banner': { category: 'HERO', implementedBy: B + 'templates/SOC2025Theme.jsx', description: 'Full-width banner image that starts under the nav at the top of the report landing pages.' },

  // ---- PROOF
  'proof.logos': { category: 'PROOF', blockType: 'Logos', implementedBy: B + 'Logos.jsx', description: 'Static customer-logo strip under a hero: mono label above a row of invented logo marks (small and medium sizes).' },
  'proof.logo-marquee': { category: 'PROOF', implementedBy: C + 'LogoMarquee.jsx', description: 'Stepped customer-logo carousel that moves one logo slot at a time while on screen; logos are grey and turn colour on hover (dark tone available).' },
  'proof.awards-slider': { category: 'PROOF', blockType: 'TextWithAwards', implementedBy: C + 'Awards.jsx', description: 'Analyst-recognition section: eyebrow, H2, paragraph and call to action beside an award badge and a looping badge slider. The call to action is two buttons on the homepage and a single mono link on product pages.' },
  'proof.quote': { category: 'PROOF', blockType: 'Quote', implementedBy: B + 'Quote.jsx', description: 'Single testimonial: logo tile in a bordered cell beside a large quote, name and role, with optional prev/next arrows for several quotes.' },
  'proof.quote-background': { category: 'PROOF', blockType: 'QuoteBackground', implementedBy: B + 'QuoteBackground.jsx', description: 'Large pull quote set over a dark full-bleed image, without attribution.' },
  'proof.quote-features': { category: 'PROOF', blockType: 'QuoteFeatures', implementedBy: B + 'QuoteFeatures.jsx', description: 'Testimonial paired with a short list of feature highlights.' },
  'proof.quotes-carousel': { category: 'PROOF', blockType: 'QuotesCarousel', implementedBy: B + 'QuotesCarousel.jsx', description: 'Horizontally sliding row of quote cards (408px pitch) with detail lines.' },
  'proof.quote-video': { category: 'PROOF', blockType: 'QuoteVideo', implementedBy: B + 'QuoteVideo.jsx', description: 'Bordered callout pairing a customer quote with a video thumbnail and centred play button (medium and small sizes).' },
  'proof.customer-photo-feature': { category: 'PROOF', blockType: 'CustomerPhotoFeature', implementedBy: B + 'CustomerPhotoFeature.jsx', description: 'Row of portrait photo cards each carrying a headline customer metric, with a header link and slider arrows.' },
  'proof.people-carousel': { category: 'PROOF', blockType: 'PeopleCarousel', implementedBy: B + 'PeopleCarousel.jsx', description: 'Slider of people cards (marketplace partners and experts).' },
  'proof.personnel-slider': { category: 'PROOF', blockType: 'PersonnelSlider', implementedBy: B + 'PersonnelSlider.jsx', description: 'Full-bleed slider of 240px staff cards (photo, name, role) with a header and round arrow controls.' },
  'proof.stats-cornerstone': { category: 'PROOF', implementedBy: C + 'Stats.jsx', description: 'Homepage stats card: four headline statistics in a row, a dotted divider band, then an illustration beside supporting text.' },
  'proof.stats-ruled': { category: 'PROOF', blockType: 'StatsRuled', implementedBy: B + 'StatsRuled.jsx', description: 'Row of large statistics separated by thin rules (comparison page).' },
  'proof.text-with-logos': { category: 'PROOF', blockType: 'TextWithLogos', implementedBy: B + 'TextWithLogos.jsx', description: 'Text column with a link beside a dithered grid of logo tiles that swap on a timer.' },
  'proof.customer-logo-grid': { category: 'PROOF', implementedBy: T + 'CustomersIndex.jsx > LogoGrid', description: 'Customers index band of 12 logo tiles that flip to new logos every few seconds.' },
  'proof.quote-carousel': { category: 'PROOF', implementedBy: T + 'CustomersIndex.jsx > QuoteCarousel', description: 'Customers index slider of large customer quotes with avatar, advancing automatically with dot controls.' },

  // ---- FEATURES
  'features.product-overview': { category: 'FEATURES', blockType: 'ProductOverview', implementedBy: C + 'ProductOverview.jsx', description: 'Product tour band: three auto-advancing steps (6-second progress bar, expanding description) beside a stage image and screen panel; dark on the homepage, light mode available.' },
  'features.feature-carousel': { category: 'FEATURES', blockType: 'MicroFeatureCarousel', implementedBy: C + 'FeatureCarousel.jsx', description: 'Header with arrow controls above a track of 384px feature cards that moves one card per click and supports drag.' },
  'features.ai-agents-demo': { category: 'FEATURES', implementedBy: C + 'Agents.jsx', description: 'Homepage AI section over a purple glow: three feature columns, then a glass prompt card that types example prompts, with suggestion chips.' },
  'features.text-with-image': { category: 'FEATURES', blockType: 'TextWithImage', implementedBy: B + 'TextWithImage.jsx', description: 'The workhorse feature row: eyebrow, title, body and a bullet list or link beside a media box; image side alternates.' },
  'features.text-with-image-list': { category: 'FEATURES', blockType: 'TextWithImageList', implementedBy: B + 'TextWithImageList.jsx', description: 'Alternating rows on a 12-column grid, each an image beside a text column.' },
  'features.text-with-image-ordered-list': { category: 'FEATURES', blockType: 'TextWithImageOrderedList', implementedBy: B + 'TextWithImageOrderedList.jsx', description: 'Up to four numbered steps, each a 512px media beside copy, alternating sides (industry pages).' },
  'features.feature-large': { category: 'FEATURES', blockType: 'FeatureLarge', implementedBy: B + 'FeatureLarge.jsx', description: 'Large intro (eyebrow, H2, body in two columns) above a grid of icon-tile feature items.' },
  'features.feature-grid-numbered': { category: 'FEATURES', blockType: 'FeatureGridNumbered', implementedBy: B + 'FeatureGridNumbered.jsx', description: 'Grid of numbered feature cells.' },
  'features.animated-gallery': { category: 'FEATURES', blockType: 'AnimatedGallery', implementedBy: B + 'AnimatedGallery.jsx', description: 'Marketplace gallery of tiles that stack and slide in as the page scrolls.' },
  'features.animated-steps': { category: 'FEATURES', implementedBy: D + ' > AnimatedSteps', description: 'Campaign-page step list with a progress bar that auto-advances and pauses on hover (static list below 900px).' },
  'features.lp-feature-grid': { category: 'FEATURES', implementedBy: D + ' > LpFeatureGrid', description: 'Campaign-page grid of feature cards.' },

  // ---- CONTENT
  'content.feature-text': { category: 'CONTENT', blockType: 'FeatureText', implementedBy: B + 'FeatureText.jsx', description: 'Big centred statement: 48px H2, optionally with a call-to-action button or section-heading treatment.' },
  'content.section-text-block': { category: 'CONTENT', blockType: 'SectionTextBlock', implementedBy: B + 'SectionTextBlock.jsx', description: '752px prose column using the shared article text styles, optionally with a table of contents and margin annotations.' },
  'content.grid': { category: 'CONTENT', blockType: 'Grid', implementedBy: B + 'Grid.jsx', description: 'Two- or three-column item grid with a header; items can be numbered, image-topped or plain.' },
  'content.content-grid': { category: 'CONTENT', blockType: 'ContentGrid', implementedBy: B + 'ContentGrid.jsx', description: 'Bento grid of wide, half and narrow media cards with title, description and link.' },
  'content.text-with-list': { category: 'CONTENT', blockType: 'TextWithList', implementedBy: B + 'TextWithList.jsx', description: 'Icon and 60px intro title beside columns of list items on a 12-column grid.' },
  'content.tables': { category: 'CONTENT', blockType: 'Tables', implementedBy: B + 'Tables.jsx', description: 'Titled comparison table with alternating banded rows.' },
  'content.table-questions-stats': { category: 'CONTENT', blockType: 'TableQuestionsStats', implementedBy: B + 'TableQuestionsStats.jsx', description: 'Comparison table of questions with supporting statistics.' },
  'content.faq': { category: 'CONTENT', blockType: 'Faq', implementedBy: P + 'Faq.jsx', description: 'Accordion of questions that slide open, with a call-to-action box; a compact variant sits inside gated landing cards.' },
  'content.faq-full-width': { category: 'CONTENT', blockType: 'FaqFullWidth', implementedBy: B + 'FaqFullWidth.jsx', description: 'Full-width FAQ list with its own heading and spacing.' },
  'content.header-band': { category: 'CONTENT', blockType: 'HeaderRoot', implementedBy: B + 'HeaderRoot.jsx', description: 'Eyebrow, title and body header band, used to open a page or to introduce a mid-page section.' },
  'content.horizontal-rule': { category: 'CONTENT', blockType: 'HorizontalRule', implementedBy: B + 'HorizontalRule.jsx', description: 'Thin 1152px rule that separates bands on long-form pages.' },
  'content.spacer': { category: 'CONTENT', blockType: 'Spacer', implementedBy: B + 'Spacer.jsx', description: '96px empty gap.' },
  'content.video': { category: 'CONTENT', blockType: 'Video', implementedBy: B + 'Video.jsx', description: 'Bordered 16:9 video placeholder with a play overlay (no embed).' },
  'content.info-cards': { category: 'CONTENT', blockType: 'InfoCards', implementedBy: B + 'InfoCards.jsx', description: 'Heading and cards over a full-bleed photo background.' },
  'content.link-list': { category: 'CONTENT', blockType: 'LinkList', implementedBy: B + 'LinkList.jsx', description: 'Header with a list or chips of links.' },
  'content.mission-split': { category: 'CONTENT', implementedBy: C + 'Mission.jsx', description: 'Homepage split band: dark text panel with a dashed cobalt rule beside a full-height photo with a gold dot-grid overlay.' },
  'content.gated-card': { category: 'CONTENT', implementedBy: T + 'GatedLanding.jsx', description: 'Left column of a gated landing page: mono kind label, large title and body copy in a ruled white card over a blueprint grid.' },
  'content.event-logistics': { category: 'CONTENT', implementedBy: T + 'GatedLanding.jsx', description: 'Blue date, time and location block inside an event landing card.' },
  'content.event-speakers': { category: 'CONTENT', implementedBy: T + 'GatedLanding.jsx', description: 'Speakers list on event landing pages: square photo beside name and role.' },
  'content.summit-intro': { category: 'CONTENT', implementedBy: T + 'SummitEvent.jsx', description: 'Summit event opener: large mono title, date lines, intro copy and a waitlist form card.' },
  'content.summit-speakers': { category: 'CONTENT', implementedBy: T + 'SummitEvent.jsx', description: 'Summit speaker grid inside a white card.' },
  'content.summit-sessions': { category: 'CONTENT', implementedBy: T + 'SummitEvent.jsx', description: 'Summit agenda: time pill, title and description per session.' },
  'content.careers-intro': { category: 'CONTENT', implementedBy: B + 'templates/Careers.jsx', description: 'Dark photo header across both columns with H1 and intro paragraphs.' },
  'content.careers-roles': { category: 'CONTENT', implementedBy: B + 'templates/Careers.jsx', description: 'Roles header, department filter pills and department-grouped job rows with locations and chevrons.' },
  'content.careers-sidebar': { category: 'CONTENT', implementedBy: B + 'templates/Careers.jsx', description: 'Right column of link sections separated by dotted rules, ending in a photo slider.' },
  'content.brand-header': { category: 'CONTENT', implementedBy: B + 'templates/Brand.jsx', description: 'Brand page H1 band.' },
  'content.brand-logos': { category: 'CONTENT', implementedBy: B + 'templates/Brand.jsx', description: 'Light and dark logo tiles with spec rows and download chips, plus a trademark note.' },
  'content.brand-colour': { category: 'CONTENT', implementedBy: B + 'templates/Brand.jsx', description: 'Nine colour swatches with names, hex values and copy buttons.' },
  'content.brand-typography': { category: 'CONTENT', implementedBy: B + 'templates/Brand.jsx', description: 'Sans, serif and mono type samples with captions.' },
  'content.brand-press-kit': { category: 'CONTENT', implementedBy: B + 'templates/Brand.jsx', description: 'Press-kit heading and a primary download button.' },
  'content.change-statement': { category: 'CONTENT', implementedBy: B + 'templates/Change.jsx', description: 'Tall scroll runway with a sticky large statement followed by highlighted paragraphs and a primary button.' },
  'content.change-stats': { category: 'CONTENT', implementedBy: B + 'templates/Change.jsx', description: 'Second scroll runway: a pinned photo panel with two bordered statistic boxes and white paragraphs.' },
  'content.climate-leads-interviews': { category: 'CONTENT', implementedBy: B + 'templates/ClimateLeads.jsx', description: 'Alternating interview sections: round avatar, serif name, Q&A and a ruled aside with logo, facts and an optional diagram; pull quotes between.' },
  'content.soc-text-card': { category: 'CONTENT', implementedBy: B + 'templates/SOC2025Theme.jsx', description: 'Bordered white card with cobalt H1 and report description with a custom bullet list.' },

  // ---- CONVERSION
  'conversion.inline-cta': { category: 'CONVERSION', blockType: 'InlineCta', implementedBy: B + 'InlineCta.jsx', description: 'Call-to-action band in recessed, inline or stacked variants: text plus one primary button.' },
  'conversion.inline-cta-form': { category: 'CONVERSION', blockType: 'InlineCtaForm', implementedBy: B + 'InlineCtaForm.jsx', description: 'Newsletter-style email capture band built on the shared email-catcher form.' },
  'conversion.cta-form': { category: 'CONVERSION', blockType: 'CTAForm', implementedBy: B + 'CTAForm.jsx', description: 'Closing form band for the marketplace page.' },
  'conversion.content-form': { category: 'CONVERSION', blockType: 'ContentForm', implementedBy: B + 'ContentForm.jsx', description: 'Bordered two-panel block: option rows on the left, request form on the right.' },
  'conversion.cta-bar': { category: 'CONVERSION', implementedBy: P + 'CTABar.jsx', description: 'Slim call-to-action row: title and one button between rules.' },
  'conversion.cta-slim': { category: 'CONVERSION', implementedBy: D + ' > CtaSlim', description: 'Campaign-page slim call to action.' },
  'conversion.featured-form': { category: 'CONVERSION', implementedBy: D + ' > FeaturedForm', description: 'Campaign-page closing form block.' },
  'conversion.gated-form': { category: 'CONVERSION', implementedBy: T + 'GatedLanding.jsx', description: 'Right column of a gated landing page: cover image, cobalt heading and the shared form with floating labels.' },
  'conversion.newsletter-band': { category: 'CONVERSION', implementedBy: P + 'NewsletterBand.jsx', description: 'Bracketed newsletter sign-up band; inset after the sixth card in feed grids and shown above related content on posts.' },
  'conversion.quiz': { category: 'CONVERSION', implementedBy: B + 'templates/Quiz.jsx', description: 'Quiz card on a gradient band: intro, six question slides with progress bar and previous/next, then a form slide.' },
  'conversion.soc-form-card': { category: 'CONVERSION', implementedBy: B + 'templates/SOC2025Theme.jsx', description: 'Cover image above a bordered form card, with a decorative footer image band.' },
  'conversion.summit-closing-cta': { category: 'CONVERSION', implementedBy: T + 'SummitEvent.jsx', description: 'Bordered translucent closing band: summit name, date line and a Register button that scrolls to the form.' },

  // ---- FEED
  'feed.content-cards': { category: 'FEED', blockType: 'ContentCards', implementedBy: C + 'ContentCards.jsx', description: 'Header with a button above three 16:9 image cards with eyebrow, title and a read-more or description line.' },
  'feed.page-link-set': { category: 'FEED', blockType: 'PageLinkSet', implementedBy: B + 'PageLinkSet.jsx', description: 'Related-pages block: title and three linked media cards.' },
  'feed.page-links': { category: 'FEED', implementedBy: P + 'PageLinks.jsx', description: 'Related-resources cards that fade up as they scroll into view (the one scroll reveal on the site) and slide on small screens.' },
  'feed.blog-posts-theme-images': { category: 'FEED', blockType: 'BlogPostsThemeImages', implementedBy: B + 'BlogPostsThemeImages.jsx', description: 'Grid of bordered post cards with figure, title and arrow.' },
  'feed.filter-bar': { category: 'FEED', implementedBy: P + 'Feed.jsx > FilterChips', description: 'Filter chips (and, on the blog, a search box) that write a filter query parameter.' },
  'feed.card-grid': { category: 'FEED', implementedBy: P + 'Feed.jsx > FeedGrid', description: 'Three-column grid of content cards; on filterable feeds a newsletter band is inset after the sixth card.' },
  'feed.load-more': { category: 'FEED', implementedBy: P + 'Feed.jsx > LoadMore', description: 'Load more button that reveals twelve further cards.' },
  'feed.related-posts-grid': { category: 'FEED', implementedBy: P + 'Feed.jsx > FeedGrid', description: 'Grid of related content cards at the foot of a post.' },
  'feed.sidebar-index': { category: 'FEED', implementedBy: P + 'SidebarList.jsx', description: 'Index page with a full-height sidebar (title, anchor nav, contact notice) beside ruled list rows: coverage and release rows on news, document links on legal.' },
  'feed.featured-stories': { category: 'FEED', implementedBy: T + 'CustomersIndex.jsx > FeaturedStories', description: 'Customers index slider of featured story cards with a hover overlay.' },
  'feed.all-customers': { category: 'FEED', implementedBy: T + 'CustomersIndex.jsx > AllCustomers', description: 'Filterable customers grid: three selects (region, industry, type) that rewrite the URL query; cells show a logo and reveal title and footer on hover.' },

  // ---- ARTICLE
  'article.post-hero': { category: 'ARTICLE', implementedBy: P + 'PostHero.jsx', description: 'Post opener: breadcrumbs, date, title, subtitle and a 552px media image, under a translucent nav.' },
  'article.prose': { category: 'ARTICLE', implementedBy: P + 'Prose.jsx', description: 'Article body in the shared prose styles: 20/30 text, headings, nested lists, quotes, figures with caption pills, callouts, tables and inline code; followed by a topics row on most posts.' },
  'article.toc': { category: 'ARTICLE', implementedBy: P + 'Toc.jsx', description: 'Sticky table of contents beside the article that highlights the section in view (starts with an Introduction item).' },
  'article.story-hero': { category: 'ARTICLE', implementedBy: T + 'CustomerStory.jsx', description: 'Customer story header: logo, title and subtitle over a wide banner with a play control.' },
  'article.story-sidebar': { category: 'ARTICLE', implementedBy: T + 'CustomerStory.jsx', description: 'Sticky full-height sidebar with customer facts, product list, section links and a next-story button.' },
  'article.story-body': { category: 'ARTICLE', implementedBy: T + 'CustomerStory.jsx', description: 'Story sections beside the sidebar: media, quote and prose sections that the sidebar links track.' },
  'article.legal-document': { category: 'ARTICLE', implementedBy: 'src/pages/content/LegalPages.jsx > LegalDocument', description: 'Legal document page: back link strip, serif light-weight H1 and legal prose.' },
  'article.manifesto': { category: 'ARTICLE', implementedBy: B + 'templates/Manifesto.jsx', description: 'Long essay on a 752px column: 64px H1, body, H2s and bordered chart figures with captions.' },
};

// Block types that exist in src/blocks/index.js but which no page definition renders. Listed in the README, not as sections.
