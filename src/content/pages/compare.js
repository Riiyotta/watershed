// `compare` template pages (§4.8). Competitors are fictional ("Vendor A", "Vendor B").
import { b, faq, logos, photoFeature } from './kit.js'

const heroCompete = (title, body, opts = {}) =>
  b('HeroCompete', {
    eyebrow: 'Built for climate teams, ready on day one',
    title,
    body,
    panelTitle: opts.panelTitle ?? 'Northwind by the numbers',
    links: opts.links,
    tiles: [
      { value: '70%', label: 'lower total cost of ownership', desc: 'In one side-by-side evaluation, counting software, consultants and team time.', photo: true },
      { value: '0', label: 'third-party consultants needed', desc: 'Get set up without a long implementation project.' },
      { value: '1', label: 'platform for every data owner', desc: 'Facilities, HR and engineering teams contribute data directly.', dark: true },
      { value: '2M+', label: 'built-in emission factors', desc: 'Covering every scope 3 category and most of global GDP.', photo: true },
    ],
    proofs: [
      { title: 'Leader', desc: 'Independent analyst evaluation, 2026' },
      { title: 'Leader', desc: 'Category market study, 2026' },
      { title: '4.6 / 5', desc: 'Average peer review rating' },
    ],
  })

const quotesCarousel = b('QuotesCarousel', {
  title: 'Real climate teams. Real outcomes.',
  link: { label: 'Read customer stories', to: '/customers' },
  quotes: [
    { heading: 'vs. Vendor A', text: 'Northwind was far ahead in the evaluation. The product is more complete and the methods are clearer.', name: 'Head of Sustainability', detail: 'Global payments company' },
    { heading: 'vs. Vendor B', text: 'Factor selection was always accurate and easy to follow. We spend far less time correcting mapping errors.', name: 'Climate Lead', detail: 'Consumer health company' },
    { heading: 'Time saved', text: 'The assistants save us weeks each year, which means more time for decarbonisation work across our sites.', name: 'Sustainability Manager', detail: 'Industrial manufacturer' },
  ],
})

const inlineForm = b('InlineCtaForm', {
  title: "Let's talk about your goals",
  description: 'Book thirty minutes with a climate specialist. We will review your current setup, your reporting needs and what switching would involve.',
  submitLabel: 'Request a demo',
})

const quoteFeatures = b('QuoteFeatures', {
  title: 'Analyst recognition',
  body: 'Independent research firms have named Northwind a leader in every category they have assessed us in.',
  button: { label: 'Read the analyst summary', to: '/forrester-wave-2026' },
  quote: 'Northwind suits large enterprises looking for an integrated partner across measurement, reduction, product footprints and reporting, with strong advisory support and a fast-moving product.',
  caption: 'Independent analyst evaluation, 2026',
  features: [
    { title: 'Analyst evaluation, 2026', desc: 'Named a leader with top scores across most criteria, including data quality and reporting.' },
    { title: 'Market study, 2026', desc: 'Rated a leader in enterprise carbon management for calculation methods.' },
    { title: 'Innovation review, 2026', desc: 'Recognised for supply chain data and product footprint capabilities.' },
    { title: 'Market study, 2025', desc: 'Leader in ESG reporting software for benchmarking and readiness.' },
  ],
})

const faqFull = (vendor) =>
  b('FaqFullWidth', {
    title: `Five reasons teams choose Northwind over ${vendor}`,
    items: [
      { q: 'Lower total cost of ownership', a: 'Software fees are only part of the cost. In one comparison of real-world costs, the alternative cost several times more once consultants and internal time were included.', proof: { label: 'Technology company story', to: '/customers' } },
      { q: 'Up and running without an implementation project', a: 'Most teams complete setup and a first measurement in weeks with help from our in-house specialists.' },
      { q: 'Simple enough for every data owner', a: 'Facilities, HR and procurement teams can contribute data directly without training in carbon accounting.' },
      { q: 'A deep scope 3 engine, not just scope 1 and 2', a: 'Measure every scope 3 category with methods that improve as you add activity and supplier data.' },
      { q: 'Advisory, marketplace and assurance support in one place', a: 'Get expert guidance, vetted climate projects and audit support from the same team.' },
    ],
  })

const tqs = b('TableQuestionsStats', {
  eyebrow: 'How our AI works',
  title: 'AI that does the data work, so contributors do not have to',
  body: 'Facilities, HR and engineering teams should not need carbon accounting training to contribute data. Assistants take raw files and turn them into measurement-ready data, with every step traceable.',
  colA: 'What changes',
  colB: 'How the assistants do it',
  rows: [
    { q: 'Upload, do not format', a: 'Assistants ingest PDFs and bills, standardise units and dates, and flag anomalies.' },
    { q: 'Much faster', a: 'Time from upload to usable data drops dramatically.' },
    { q: 'Every step documented', a: 'Full lineage and change logs on every transformation, so auditors can see what happened.' },
    { q: 'You approve', a: 'Key outputs are surfaced for review before they are committed.' },
  ],
  numbers: [
    { value: '20', desc: 'purpose-built assistants for cleaning, mapping, analysis and drafting' },
    { value: '40,000+', desc: 'evaluations run before release' },
    { value: '25', desc: 'in-house climate scientists and engineers who build and review them' },
  ],
  cta: { title: 'See the assistants in action', label: 'Request a demo', to: '/demo' },
})

export default {
  '/compare': [
    heroCompete('See why more large companies choose Northwind today', 'Northwind is consistently named a leader in climate software by independent analysts. Here is why so many climate teams make the switch.', {
      panelTitle: 'Northwind vs.',
      links: [
        { label: 'Northwind vs. Vendor A', to: '/compare/workiva' },
        { label: 'Northwind vs. Vendor B', to: '/compare/sweep' },
      ],
    }),
    logos('small', 'Powering climate programmes for'),
    b('StatsRuled', {
      stats: [
        { value: '5 of 6', desc: 'of the largest banks in one market run their programmes on Northwind' },
        { value: '100+', desc: 'large enterprises trust Northwind with their climate data' },
        { value: '4Gt', desc: 'of emissions under management on the platform' },
        { value: '2M+', desc: 'built-in emission factors covering most of global GDP' },
      ],
    }),
    quoteFeatures,
    b('FeatureGridNumbered', {
      title: 'Platform depth, rigour and built-in expertise, backed by results',
      body: 'Many platforms claim to cover everything. Here is how deep each step goes and what sets Northwind apart.',
      button: { label: 'Explore the platform', to: '/platform' },
      cards: [
        { title: 'A data foundation with expert defaults', desc: 'Millions of factors with methods built by in-house scientists, so teams start from strong defaults and customise where needed.' },
        { title: 'AI across the whole workflow', desc: 'Assistants handle intake, cleaning, mapping and drafting, cutting time to usable data significantly.' },
        { title: 'Product footprints beyond factor mapping', desc: 'Model materials and processes at catalogue scale with transparent lifecycle methods.' },
        { title: 'Deep data lineage, not black-box totals', desc: 'Trace every number back to its source, method and reviewer, with change logs and versioning.' },
        { title: 'Proven at enterprise scale', desc: 'Large organisations across many sectors run their programmes on Northwind every day.', wide: true },
      ],
    }),
    b('LinkList', {
      caption: 'Report to every major framework from one data model.',
      links: [
        { label: 'Protocol inventory', to: '/platform/measure/carbon-accounting' },
        { label: 'EU standards', to: '/platform/disclosures/csrd' },
        { label: 'Global baseline', to: '/platform/disclosures/issb' },
        { label: 'Questionnaire', to: '/platform/disclosures/cdp' },
        { label: 'California rules', to: '/solutions/california' },
        { label: 'Climate risk', to: '/platform/climate/tcfd' },
        { label: 'UK energy reporting', to: '/platform/disclosures/secr' },
        { label: 'ESG reporting', to: '/platform/disclosures/esg' },
      ],
    }),
    inlineForm,
    photoFeature(null, 4),
    b('TextWithImageOrderedList', {
      plain: true,
      items: [
        {
          title: 'Ready to switch? We will move your programme for you.',
          body: 'Whether you are coming from spreadsheets, consultants or another platform, our migration team handles the heavy lifting so your next reporting deadline stays on track and nothing from previous years is lost.',
          list: [
            '**Compare:** a thirty-minute walkthrough of your current setup, what changes and what stays the same, with a clear plan for the move.',
            '**Migrate:** your dedicated customer team maps historical data, methods and reports into Northwind, checks the results against your previous totals and documents every change for auditors.',
            '**Report and reduce:** meet your next deadline with reviewed data, then use the same foundation to plan reductions and engage suppliers across your value chain.',
          ],
          button: { label: 'Talk to our migration team', to: '/demo' },
          ratio: 512 / 683,
        },
      ],
    }),
    quotesCarousel,
    faq('Common questions'),
  ],
  '/compare/workiva': [
    heroCompete('Northwind vs. Vendor A', 'Vendor A is built for financial reporting. Northwind is built for climate teams. One global company found a much lower total cost once software, consultants and internal time were counted.'),
    logos('small', 'Powering climate programmes for'),
    faqFull('Vendor A'),
    inlineForm,
    tqs,
    quoteFeatures,
    quotesCarousel,
    faq('Common questions', { n: 2 }),
  ],
  '/compare/sweep': [
    heroCompete('Northwind vs. Vendor B', 'Vendor B offers a general ESG toolkit. Northwind pairs deep climate methods with assistants that do the data work, so teams report faster with fewer outside consultants.'),
    logos('small', 'Powering climate programmes for'),
    faqFull('Vendor B'),
    inlineForm,
    tqs,
    b('Tables', {
      title: 'Feature comparison',
      desc: 'How the two platforms compare on the capabilities climate teams ask about most.',
      iconColumns: true,
      head: ['Capability', 'Northwind', 'Vendor B'],
      rows: [
        { group: 'Measurement' },
        ['All scope 3 categories', true, true],
        ['Supplier-specific data at scale', true, false],
        ['Product footprints', true, false],
        { group: 'Reporting' },
        ['Multi-framework reuse', true, true],
        ['Assurance support', true, false],
        { group: 'AI' },
        ['Traceable assistant steps', true, false],
      ],
      legend: ['Included', 'Not included'],
    }),
    quoteFeatures,
    b('QuoteVideo', { size: 'medium', quote: 'We moved our whole programme in one quarter and our first footprint on the new platform was cleaner and easier to defend than any before it.', name: 'Ana Ruiz', role: 'Director of Sustainability', logo: 6 }),
    faq('Common questions', { n: 3 }),
  ],
}
