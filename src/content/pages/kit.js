// Builders + original placeholder copy (fictional company "Northwind") for block pages.
// Lengths follow PAGES_SPEC §3 (len / L counts). No source copy, customer names or brand marks.

const DEMO = { label: 'Request a demo', to: '/demo' }
const TOUR = { label: 'Take a tour', to: '/product-tours' }

export const b = (type, props = {}) => ({ type, props })

// ---------- Heroes ----------
export const hero = (eyebrow, title, sub, opts = {}) =>
  b('Hero', { eyebrow, title, sub, primary: opts.primary ?? DEMO, secondary: opts.tour ? TOUR : opts.secondary, media: opts.media ?? {}, bg: opts.bg })

export const heroVideo = (title, sub) => b('HeroVideo', { title, sub, primary: { label: 'Get a demo', to: '/demo' }, secondary: { label: 'See it in action', to: '/product-tours' } })

// ---------- Logos ----------
export const logos = (size = 'small', label = 'Trusted by climate teams worldwide') => b('Logos', { size, label })

// ---------- TextWithImage ----------
const TWI_ITEMS = [
  ['Cover every scope and category in one model', 'Connect finance, facilities and travel systems', 'Flag anomalies automatically before review'],
  ['Map spend to activity data with clear methods', 'Swap estimates for supplier data as it arrives', 'Keep a full audit trail for every figure'],
  ['Draft framework responses from your own data', 'Reuse answers across questionnaires', 'Route sections to reviewers with comments'],
  ['Model reduction levers by cost and impact', 'Track targets against a live baseline', 'Share progress with leaders in one view'],
]
export const twi = (n, title, body, opts = {}) =>
  b('TextWithImage', {
    eyebrow: opts.eyebrow,
    title,
    body,
    items: opts.cta || opts.bullets || opts.items === false ? undefined : opts.items ?? TWI_ITEMS[n % TWI_ITEMS.length],
    cta: opts.cta,
    bullets: opts.bullets,
    link: opts.link,
    ratio: opts.ratio ?? 4 / 3,
    rightAligned: opts.right ?? n % 2 === 1,
    tone: ['cool', 'neutral', 'cool', 'warm'][n % 4],
  })

// ---------- Ordered list (industry) ----------
export const orderedList = (topic) =>
  b('TextWithImageOrderedList', {
    items: [
      { title: `One reliable record for every ${topic} footprint`, body: `Bring scope 1, 2 and 3 data together at company and product level, with consistent methods your auditors and buyers can follow from source to total.`, to: '/platform/measure' },
      { title: `Methods built for ${topic} supply chains`, body: `Draw on a large, regularly updated factor library and choose spend, activity or supplier-specific approaches for each category without rebuilding your model.`, to: '/platform/measure/carbon-accounting' },
      { title: 'Insights that point to real reductions', body: `Trace emissions through materials, processes and suppliers to find the hotspots worth acting on, then compare options by cost and impact before you commit.`, to: '/platform/act' },
      { title: 'Reporting that is ready when you are', body: `Prepare disclosures for several frameworks at once, reuse answers across requests and keep every number linked to its evidence for review.`, to: '/platform/disclosures' },
    ],
  })

// ---------- Quotes ----------
export const QUOTES = [
  { text: 'Before Northwind our footprint lived in a dozen spreadsheets. Now our team spends its time on supplier conversations and reduction plans instead of chasing files, and our numbers hold up when finance and auditors ask how we got there.', name: 'Maya Okafor', role: 'Head of Sustainability, Acme', logo: 0 },
  { text: 'The level of detail in the methods gave our board real confidence. We moved from a rough annual estimate to quarterly figures we can actually manage against.', name: 'Daniel Brennan', role: 'Director of ESG Reporting, Globex', logo: 1 },
  { text: 'We answered three frameworks in the time one used to take. Being able to reuse reviewed answers and trace each figure back to its source changed how our whole team works through reporting season.', name: 'Lena Fischer', role: 'Sustainability Manager, Lumen', logo: 4 },
  { text: 'Supplier engagement finally feels practical. We can see which partners matter most, share clear requests and track what comes back without a separate project every year.', name: 'Tomás Silva', role: 'Procurement Lead, Halcyon', logo: 7 },
]
export const quote = (start = 0, count = 1) => b('Quote', { quotes: QUOTES.slice(start, start + count).concat(start + count > QUOTES.length ? QUOTES.slice(0, start + count - QUOTES.length) : []) })

// ---------- FAQ (shared primitive) ----------
const FAQ_POOL = [
  ['Which scopes and categories does Northwind cover?', 'Northwind supports scope 1, 2 and all fifteen scope 3 categories, with methods that range from spend-based estimates to supplier-specific data so you can improve accuracy over time.'],
  ['Can we use our own emission factors?', 'Yes. You can bring custom factors, apply them to selected activities or business units and keep a record of when and why each choice was made.'],
  ['How long does a first measurement take?', 'Most teams complete an initial footprint in a few weeks. Timelines depend on how many data sources you connect and how much historical data you want to include.'],
  ['Is the data ready for assurance?', 'Every figure links back to its source data, method and reviewer, so auditors can follow the trail without extra workbooks or manual reconciliation.'],
  ['Which reporting frameworks are supported?', 'Northwind prepares content for the major voluntary and mandatory frameworks and lets you reuse reviewed answers across questionnaires and regions.'],
  ['How are permissions handled?', 'Admins control access by team, entity and dataset, and every change is logged so you can see who edited what and when.'],
  ['Do you offer advisory support?', 'Our in-house climate specialists help with scoping, methodology questions and review cycles, alongside a network of partner firms.'],
  ['Can we track non-carbon metrics?', 'Yes. Water, waste and other environmental metrics can be collected alongside emissions and used in the same reports and dashboards.'],
  ['How does Northwind keep methods up to date?', 'Our science team reviews factors and methods every year and publishes change notes, so you can see what moved and why.'],
  ['Can suppliers share data directly?', 'Yes. Suppliers can respond to structured requests in a simple portal, and their answers flow straight into your footprint with a full record.'],
  ['Does Northwind integrate with our ERP?', 'Standard connectors cover common finance, procurement and travel systems, and file uploads handle everything else.'],
  ['How is customer data protected?', 'Data is encrypted in transit and at rest, access is role-based and the platform is independently audited each year.'],
  ['Can we model reduction scenarios?', 'You can compare levers by cost and impact, set targets and track progress against a live baseline.'],
  ['What does onboarding look like?', 'A dedicated team guides scoping, data connections and your first review cycle, with training for every user group.'],
]
export const faqItems = (n = 6, offset = 0) => Array.from({ length: n }, (_, i) => {
  const [q, a] = FAQ_POOL[(i + offset) % FAQ_POOL.length]
  return { q, a }
})
export const faq = (title = 'Common questions', opts = {}) =>
  b('Faq', {
    eyebrow: 'FAQ',
    title: title.charAt(0).toUpperCase() + title.slice(1),
    items: faqItems(opts.n ?? 6, opts.offset ?? 0),
    cta: { title: "Don't see what you're looking for?", body: 'Ask our team and we will help you find the answer for your programme.', label: 'Ask our team', to: '/demo' },
  })

// ---------- PageLinkSet ----------
const RESOURCES = [
  { eyebrow: 'Guide', title: 'A practical guide to scope 3 measurement', to: '/guides/mastering-scope-3' },
  { eyebrow: 'Guide', title: 'Planning a sustainability programme for next year', to: '/guides/sustainability-planning-2026' },
  { eyebrow: 'Platform', title: 'Platform overview', to: '/platform' },
  { eyebrow: 'Platform', title: 'Measurement and carbon accounting', to: '/platform/measure' },
  { eyebrow: 'Solutions', title: 'Reporting for new EU rules', to: '/solutions/csrd' },
  { eyebrow: 'Guide', title: 'Preparing for California disclosure rules', to: '/guides/california-climate-rules-sb253-sb261' },
  { eyebrow: 'Platform', title: 'Reduction planning and clean power', to: '/platform/act' },
]
export const pageLinks = (offset = 0, count = 3, title = 'Additional resources', cta) =>
  b('PageLinkSet', { title, cards: Array.from({ length: count }, (_, i) => ({ ...RESOURCES[(i + offset) % RESOURCES.length], cta })) })

// ---------- Carousels / cards ----------
const MFC = [
  { title: 'Millions of factors covering most of the global economy' },
  { title: 'Methods reviewed by independent experts every year' },
  { title: 'Hundreds of automated checks on every upload' },
  { title: 'Full data lineage from source to total' },
  { title: 'Peer benchmarks drawn from real programmes' },
]
export const microCarousel = (title, sub, slides) => b('MicroFeatureCarousel', { title, sub, slides: slides ?? MFC })

export const contentCards = (title = 'The platform built for climate data teams', opts = {}) =>
  b('ContentCards', {
    title,
    sub: 'Focused tools that help sustainability teams move quickly without giving up accuracy or control.',
    button: opts.button ?? { label: 'Meet the assistants', to: '/platform/sustainability-ai' },
    cards: [
      { title: 'Assistants that speed up work', desc: 'Hand off cleaning, formatting and first-pass analysis to focused helpers.', to: '/platform/sustainability-ai' },
      { title: 'Context that sharpens results', desc: 'Draft reports with peer comparisons and a well-maintained factor library.', to: '/platform/measure' },
      { title: 'Controls you can rely on', desc: 'Human review steps and calculations you can inspect at every stage.', to: '/platform/disclosures' },
    ],
  })

export const photoFeature = (title = 'Big claims are easy. Results are better.', count = 3, opts = {}) =>
  b('CustomerPhotoFeature', {
    title,
    columns: opts.columns,
    videoLabel: 'Watch the stories',
    cards: [
      { metric: '3 days', caption: 'to finish a first state disclosure report', quote: 'We were done before the internal deadline, with every figure traceable.' },
      { metric: '5x', caption: 'faster quarterly measurement cycles', quote: 'The checks catch issues early, so review is about decisions, not typos.' },
      { metric: '4 hours', caption: 'saved each week on data preparation', quote: 'Our analysts finally have time for supplier work and planning.' },
      { metric: '2 weeks', caption: 'saved on annual data transformation', quote: 'Raw files go in and structured, reviewable data comes out.' },
    ]
      .slice(0, count)
      .map((c) => (opts.quotes ? c : { ...c, quote: undefined })),
  })

const CGRID = [
  { title: 'Process utility bills in seconds', desc: 'Turn PDFs and exports into structured energy and spend data with built-in checks.' },
  { title: 'Draft reports in moments', desc: 'Start disclosures from your own data with the right format for each request.' },
  { title: 'Clean messy data automatically', desc: 'Standardise units, dates and labels across languages and source systems.' },
  { title: 'Automate repeat tasks', desc: 'Save reusable workflows that run the same steps every reporting cycle.' },
  { title: 'Build dashboards on request', desc: 'Describe the view you need and get a shareable dashboard built from reviewed data.' },
  { title: 'Product footprints at scale', desc: 'Estimate footprints across a full catalogue and refine the products that matter most.' },
  { title: 'Answer supplier questions fast', desc: 'Respond to customer and supplier requests with figures that link back to evidence.' },
  { title: 'Track every project', desc: 'Follow reduction projects from idea to delivery with costs and savings in one place.' },
]
// sizes: per-card 'half' | 'wide' | 'narrow' (see ContentGrid). Default: four half cards (2 rows of 576/576).
export const contentGrid = (title = 'Give your climate team more time back', opts = {}) => {
  const sizes = opts.sizes ?? ['half', 'half', 'half', 'half']
  return b('ContentGrid', {
    title,
    sub: opts.sub ?? 'And move work out of spreadsheets for good.',
    link: opts.link === false ? undefined : { label: 'Explore the platform', to: '/platform' },
    items: sizes.map((size, i) => ({ ...CGRID[(i + (opts.offset ?? 0)) % CGRID.length], size })),
  })
}

export const inlineCta = (variant = 'inline', title = 'See how Northwind can support your goals', sub) => b('InlineCta', { variant, title, sub })

export const textList = (rows) => b('TextWithImageList', { rows })

const TWIL_ROWS = (topic) => [
  { title: 'Understand the requirements', body: `See which ${topic} obligations apply to you, what each one asks for and how your current data maps to it. Northwind keeps guidance up to date as rules and questionnaires change, so your plan stays current.` },
  { title: 'Add your data', body: 'Connect finance, facilities and supplier systems or upload files directly. Built-in checks flag gaps and anomalies before they reach a report, and every figure keeps a link back to its source.' },
  { title: 'Explore the details', body: 'Drill into any total to see the activities, factors and assumptions behind it, then compare periods, sites and business units.' },
  { title: 'Analyse your footprint', body: 'Filter, sort and visualise emissions by scope, category, region or supplier to find the hotspots that matter most and share the views with colleagues.' },
  { title: 'Prepare your data for submission', body: 'Once your data is ready, map it to each question automatically and review the draft response alongside the evidence that supports it, with comments and approvals in one place.' },
  { title: 'Complete your submission', body: 'As you answer, reuse reviewed responses from previous cycles and other frameworks, assign sections to owners and track progress against the deadline.' },
]
// Long-form disclosure rows (/platform/disclosures/cdp etc.): six rows, 664-wide images, no links, pale gradient band.
export const twil = (topic, opts = {}) =>
  b('TextWithImageList', {
    title: opts.title,
    bg: opts.bg === undefined ? 'linear-gradient(#f5f7ff, #fff)' : opts.bg || undefined,
    rows: TWIL_ROWS(topic)
      .slice(0, opts.count ?? 6)
      .map((r, i) => ({ ...r, span: opts.span ?? 7, ratio: opts.ratio ?? (i === 1 ? 664 / 422 : 664 / 443) })),
  })

// ---------- Long-form prose (SectionTextBlock) ----------
export const longForm = (topic, full) => {
  const lead = full.replace(/^The /, 'the ')
  const nodes = [
    { h2: `What is ${lead}?` },
    { p: `${full} is a reporting framework that asks companies to explain how climate-related topics affect their business and how their activities affect the climate. It sets out what to disclose, how to structure it and which supporting data is expected.` },
    { p: `Investors, customers and regulators increasingly use ${topic} responses to compare companies, so a clear and well-supported submission has become part of how many organisations show progress.` },
    { h2: `Why ${topic} reporting matters` },
    { p: 'A consistent disclosure helps stakeholders understand risk, opportunity and ambition. It also gives internal teams a shared baseline for planning, budgeting and target setting.' },
    { aside: 'Tip: start collecting supporting evidence early. Most of the effort goes into finding and checking source data, not writing the narrative.' },
    { h2: 'Key dates and timelines' },
    { p: 'Timelines change from year to year, so always confirm with the official guidance. A typical cycle looks like this:' },
    { table: { head: ['Period', 'What happens'], rows: [['Q1', 'Guidance and questionnaires are published'], ['Q2', 'Response window opens'], ['Q3', 'Submission deadline for most companies'], ['Q4', 'Scores and public responses are released']] } },
    { h3: 'Preparing your first response' },
    { ul: ['Confirm which modules or sections apply to you', 'Gather scope 1, 2 and 3 data with clear methods', 'Assign owners for governance, risk and strategy sections', 'Plan time for internal review and sign-off'] },
    { h2: `Examples of ${topic} reporting requirements` },
    { p: 'Requests usually fall into a few groups: governance and oversight, risks and opportunities, strategy and scenario analysis, metrics and targets, and verification of the figures you report.' },
    { table: { head: ['Section', 'Example question'], rows: [['Governance', 'Who oversees climate-related issues at board level?'], ['Risk', 'How do you identify and assess climate-related risks?'], ['Targets', 'What emissions targets have you set and how are you tracking them?'], ['Verification', 'Have your reported emissions been independently verified?']] } },
  ]
  return nodes
}

export const stb = (nodes, withToc = false, extra = {}) => b('SectionTextBlock', { nodes, withToc, ...extra })

export const grid3 = (title, sub) =>
  b('Grid', {
    variant: 'three',
    title,
    sub,
    items: [
      { desc: 'Customers manage a combined footprint larger than several mid-sized economies.', tone: 'dark' },
      { desc: 'Our factor library spans every region and many years of climate data.', tone: 'dark' },
      { desc: 'Our long-term goal is to help cut a meaningful share of global emissions.', tone: 'dark' },
    ],
  })

export const featureText = (title) => b('FeatureText', { title })
