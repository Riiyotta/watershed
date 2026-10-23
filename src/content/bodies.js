// Original placeholder article bodies (Northwind, fictional). Block format: see src/primitives/Prose.jsx.
// Reused across many posts; together they exercise every prose element in PAGES_SPEC §2.1.

// Long body with enough h2/h3 for a TOC.
export const ARTICLE_LONG = [
  { t: 'p', text: 'Climate reporting has moved from a once-a-year exercise to a standing part of how companies plan. Teams that used to gather a handful of spreadsheets each spring now field questions from investors, customers and regulators throughout the year, often about the same numbers framed in slightly different ways.' },
  { t: 'p', text: 'This guide walks through the main reporting programmes at a glance, so you can see which ones apply to you, what data each one expects and how to prepare a single source of truth that serves all of them. It is written for sustainability leads, finance partners and anyone who has been handed the question **"are we ready?"**' },
  { t: 'stylized', text: '“The fastest teams treat disclosure as a by-product of good data, not a separate project.”', cite: 'NORTHWIND RESEARCH TEAM', slot: 'post.stylizedQuote' },
  { t: 'p', text: 'We have grouped the programmes by region. Each section notes who is in scope, when reporting begins and what to collect first. Where rules are still being finalised, we flag the open questions rather than guess at the outcome.' },
  { t: 'h2', text: 'North America' },
  { t: 'aside', paras: ['**Tip:** if you operate in more than one region, start with the programme that asks for the most granular data. Everything else is usually a subset of it. See our [carbon accounting overview](/platform/measure/carbon-accounting) for a primer.'] },
  { t: 'h3', text: 'Federal disclosure proposals' },
  { t: 'p', text: 'Proposed federal rules would ask listed companies to report direct and energy-related emissions, along with a description of material climate risks. Larger filers may also need limited assurance after a phase-in period. Private companies are generally out of scope, though many are asked for similar data by their customers.' },
  { t: 'ul', items: ['Scope 1 and 2 emissions, reported annually alongside financial statements', 'A narrative description of governance and risk management', { text: 'Optional or phased requirements, depending on filer size:', items: ['Scope 3 emissions where material', 'Third-party assurance over reported figures'] }] },
  { t: 'h3', text: 'State-level requirements' },
  { t: 'p', text: 'Several states have passed their own disclosure laws that reach beyond listed companies. Thresholds are typically based on annual revenue and doing business in the state, so it is worth checking with counsel even if you are privately held.' },
  { t: 'table', head: ['Programme', 'Who is in scope', 'First report', 'Assurance'], rows: [['Emissions disclosure act', 'Revenue above a set threshold', 'FY2026 data', 'Limited, then reasonable'], ['Climate risk report', 'Revenue above a lower threshold', 'Every two years', 'None'], ['Voluntary offsets rule', 'Sellers and buyers of offsets', 'Ongoing', 'None']] },
  { t: 'p', text: 'Deadlines can move as agencies finalise guidance, so build your plan around the data you will need rather than a single date.' },
  { t: 'h2', text: 'Europe' },
  { t: 'p', text: 'European rules take a broader view of sustainability that includes social and governance topics as well as climate. The starting point is a *double materiality* assessment: identifying both how sustainability issues affect the business and how the business affects people and the environment.' },
  { t: 'h3', text: 'Corporate sustainability reporting' },
  { t: 'p', text: 'Companies in scope publish a sustainability statement in their management report, tagged in a machine-readable format and subject to assurance. Many non-EU groups with significant European revenue will also fall in scope in later waves.' },
  { t: 'ol', items: ['Run a double materiality assessment and document the process.', 'Map material topics to the relevant disclosure requirements.', 'Close data gaps, starting with value-chain emissions.', 'Agree an assurance approach with your auditor early.'] },
  { t: 'h3', text: 'Fund and product labelling' },
  { t: 'p', text: 'Asset managers face additional rules about how sustainability claims are made in fund names and marketing. These rules depend on reliable portfolio-level emissions data, which in turn depends on the disclosures of the companies they invest in.' },
  { t: 'figure', slot: 'post.figure.chart', caption: 'Illustrative timeline of reporting waves', size: 'm', aspect: '4 / 3' },
  { t: 'p', text: 'Expect assurance requirements to tighten over time. The teams that cope best are the ones that keep an audit trail from the start, rather than reconstructing it at year end.' },
  { t: 'h2', text: 'United Kingdom' },
  { t: 'p', text: 'UK companies already report energy use and emissions in their annual reports, and listed companies disclose against a climate-related financial disclosure framework. New sustainability reporting standards based on the global baseline are expected to build on these.' },
  { t: 'h3', text: 'Energy and carbon reporting' },
  { t: 'p', text: 'Large companies report UK energy use, associated emissions, an intensity ratio and the efficiency actions taken during the year. The data overlaps heavily with what you will need elsewhere, so it is a natural place to start.' },
  { t: 'h3', text: 'Transition plans' },
  { t: 'p', text: 'Listed companies are increasingly expected to publish a transition plan describing how they will reach their stated targets. A credible plan links targets to specific levers, budgets and owners.' },
  { t: 'quote', paras: ['A plan without owners is a wish list. The useful question is who will do what, by when, and how you will know it worked.'] },
  { t: 'h2', text: 'Global baseline' },
  { t: 'p', text: 'International standards aim to give investors a consistent global baseline for climate and sustainability information. Many jurisdictions are adopting them, sometimes with local adjustments, which makes them a sensible design target for your data model.' },
  { t: 'h4', text: 'What to collect first' },
  { t: 'ul', items: ['Activity data for owned operations and purchased energy', 'Spend and supplier data for the largest purchase categories', 'Governance records: who reviews climate data, and how often'] },
  { t: 'p', text: 'Configuration values such as `reporting_year` and `consolidation_approach` should be agreed once and reused across every programme:' },
  { t: 'code', text: 'reporting_year: 2026\nconsolidation_approach: operational_control\nbase_year: 2022' },
  { t: 'p', text: 'If you would like help mapping your obligations, [talk to the Northwind team](/demo) or browse more [guides](/guides).' },
]

// Shorter body without a TOC.
export const ARTICLE_SHORT = [
  { t: 'p', text: 'This year brought steady progress for climate teams everywhere. More companies measured their full footprint, more set targets grounded in data, and more started to treat sustainability information with the same care as financial information.' },
  { t: 'p', text: 'Below we share a few highlights from the Northwind product and research teams, along with what we are focusing on next. Thank you to every customer who sent feedback along the way; much of what follows started as a conversation.' },
  { t: 'figure', slot: 'post.figure.wide', caption: 'Placeholder image: a year of product updates', aspect: '16 / 9' },
  { t: 'h2', text: 'What we shipped' },
  { t: 'p', text: 'The biggest change was to how data comes in. Uploads that used to require several rounds of cleaning now pass through automatic checks that flag gaps, duplicates and unit mismatches before anyone has to look at them.' },
  { t: 'ul', items: ['Faster data intake with built-in validation', 'Clearer audit trails for every calculated figure', 'New reporting templates for common frameworks'] },
  { t: 'p', text: 'We also rebuilt the review workflow so that approvers can comment on individual figures, request changes and sign off without leaving the page.' },
  { t: 'quote', paras: ['We spent less time chasing spreadsheets and more time talking to suppliers about the changes that actually reduce emissions.', 'That shift is the whole point.'] },
  { t: 'h2', text: 'What we learned' },
  { t: 'p', text: 'Teams want fewer dashboards and better answers. The most-used features this year were the ones that explained *why* a number changed, not just that it did.' },
  { t: 'aside', paras: ['Interested in the research behind these updates? Read our [methodology notes](/blog) or join an upcoming [event](/events).'] },
  { t: 'h2', text: 'Looking ahead' },
  { t: 'p', text: 'Next year we will keep investing in data quality, supplier engagement and assistive tools that take the busywork out of reporting. As always, we will share what we learn along the way.' },
]

// Profile post (customer Variant B): Q&A style with a stylized quote.
export const PROFILE = [
  { t: 'p', text: 'In this series we talk with people leading climate work inside their organisations about how they got started, what has surprised them and what advice they would give to others in the same seat.' },
  { t: 'stylized', text: '“Start with the data you have, be honest about the gaps, and improve a little every quarter.”', cite: 'HEAD OF SUSTAINABILITY, PLACEHOLDER COMPANY', slot: 'profile.stylizedQuote' },
  { t: 'h3', text: 'How did you come to lead climate work?' },
  { t: 'p', text: 'I came from operations, which turned out to be useful. Most of the emissions we care about sit inside processes that someone already owns, so the job is mostly about helping those owners see the climate side of decisions they already make.' },
  { t: 'h3', text: 'What has changed in the last year?' },
  { t: 'p', text: 'The questions got more specific. Customers used to ask whether we had a target. Now they ask for product-level figures, supplier coverage and the assumptions behind our numbers.' },
  { t: 'h3', text: 'What would you tell someone just starting out?' },
  { t: 'p', text: 'Find one or two allies in finance early. They already know how to build reliable, auditable numbers, and they will make your work far more credible inside the business.' },
  { t: 'p', text: 'Read more conversations like this one in our [customer stories](/customers).' },
]

// Legal document with numbered sections (TOC) and a long table.
export const LEGAL_LONG = [
  { t: 'p', text: '*Last modified: placeholder date*' },
  { t: 'p', text: 'This placeholder policy describes how Northwind (“**we**”, “**us**”) handles information relating to people who use its websites and services. It is sample text written for a design prototype and is not a real legal document.' },
  { t: 'p', text: 'By using the services you acknowledge this sample policy and the related [terms](/legal/terms). Please also read the [security overview](/legal/security).' },
  { t: 'h2', text: '1. Information we process' },
  { t: 'p', text: 'We may process information you give us directly, information collected automatically when you use the services, and information we receive from partners. The categories below are illustrative only.' },
  { t: 'ul', items: ['Contact details such as name, work email and company', 'Usage information such as pages viewed and features used', 'Event and webinar registrations', 'Correspondence you send us'] },
  { t: 'h2', text: '2. How information is collected' },
  { t: 'h3', text: 'Information you provide' },
  { t: 'p', text: 'You provide information when you fill out a form, register for an event, request a demo or contact support.' },
  { t: 'h3', text: 'Information collected automatically' },
  { t: 'p', text: 'When you visit the website, standard technical information such as browser type and approximate location may be recorded by cookies and similar technologies.' },
  { t: 'h3', text: 'Information from partners' },
  { t: 'p', text: 'We may receive business contact information from event co-hosts and data providers, subject to their own policies.' },
  { t: 'h2', text: '3. How information is used' },
  { t: 'table', head: ['Purpose', 'Categories', 'Basis', 'Retention'], rows: [['Providing the services', 'Contact, usage', 'Contract', 'Life of the account'], ['Responding to enquiries', 'Contact, correspondence', 'Legitimate interests', '24 months'], ['Event registration', 'Contact, registration details', 'Consent', '12 months after the event'], ['Marketing communications', 'Contact', 'Consent or legitimate interests', 'Until you opt out'], ['Security and fraud prevention', 'Usage, technical', 'Legitimate interests', '12 months']] },
  { t: 'h2', text: '4. When information is shared' },
  { t: 'p', text: 'We share information with service providers who help us run the business, with event co-hosts where you have registered for a joint event, and where required by law. We do not sell personal information.' },
  { t: 'h2', text: '5. Analytics and advertising' },
  { t: 'h3', text: 'Analytics' },
  { t: 'p', text: 'We use analytics tools to understand how the website is used. You can learn about opting out on the relevant provider pages, for example on the relevant opt-out page.' },
  { t: 'h3', text: 'Advertising' },
  { t: 'p', text: 'Some pages may use advertising cookies to measure campaigns. You can manage these through your browser settings or our cookie preferences.' },
  { t: 'h2', text: '6. Your choices' },
  { t: 'p', text: 'Depending on where you live, you may have rights to access, correct, delete or restrict the use of your information. To make a request, contact **privacy@northwind.example**.' },
  { t: 'h2', text: '7. Security' },
  { t: 'p', text: 'We use administrative, technical and physical safeguards appropriate to the information we hold. No system is perfectly secure, and we encourage you to use strong, unique passwords.' },
  { t: 'h2', text: '8. Changes to this policy' },
  { t: 'p', text: 'We may update this sample policy from time to time. The date at the top shows when it last changed.' },
]

export const LEGAL_SHORT = [
  { t: 'p', text: '*Last modified: placeholder date*' },
  { t: 'p', text: 'These placeholder terms apply to the Northwind prototype website. They are sample text written for a design exercise and are not a real agreement.' },
  { t: 'p', text: '**Use of the site.** You may browse the site for your own information. Please do not attempt to disrupt it, access areas you are not authorised to use, or copy content for commercial purposes.' },
  { t: 'p', text: '**Content.** Articles and resources are provided for general information only and are not professional advice. Figures and examples are illustrative.' },
  { t: 'p', text: '**Third-party links.** The site may link to external sites that we do not control. We are not responsible for their content or practices.' },
  { t: 'p', text: '**Liability.** To the extent permitted by law, the site is provided “as is” without warranties of any kind.' },
  { t: 'p', text: '**Contact.** Questions about these terms can be sent to **legal@northwind.example**. See also the [privacy policy](/legal/privacy).' },
]

// Gated landing bodies (§4.6 ul-wrapper)
export const GATED_GUIDE = [
  { t: 'p', text: 'Value-chain emissions are often the hardest part of a footprint to measure, and also where the biggest opportunities sit. This guide brings together practical lessons from climate teams on turning rough estimates into numbers you can act on.' },
  { t: 'p', text: 'In this guide you will find:' },
  { t: 'ul', className: 'checklist', items: ['Common challenges and how teams work around them', 'A step-by-step approach to improving data quality', 'How to prioritise suppliers for engagement', 'Templates for tracking progress over time'] },
  { t: 'p', text: 'Whether you are building your first inventory or refining a mature one, you will find a useful starting point here.' },
]

export const GATED_REPORT = [
  { t: 'p', text: 'An independent placeholder analyst report evaluated sustainability software providers across product capability, strategy and customer feedback. Download the summary to see how the market is changing and what to look for when choosing a platform.' },
  { t: 'p', text: 'Inside the report:' },
  { t: 'ul', className: 'checklist', items: ['How evaluation criteria were weighted', 'Where the market is heading over the next two years', 'Questions to ask during vendor selection'] },
  { t: 'aside', paras: ['*This is placeholder copy. No third-party report is reproduced or referenced here.*'] },
]

export const GATED_EVENT = [
  { t: 'p', text: 'Join the Northwind team for a focused session on practical climate reporting. We will share what we are seeing across customers, walk through a live example and leave plenty of time for questions.' },
  { t: 'p', text: 'Register to save your seat. A recording will be shared with everyone who signs up.' },
  { t: 'p', text: '**Who should attend:** sustainability, finance and operations leads responsible for climate data.' },
  { t: 'p', text: '**Format:** 45 minutes of discussion followed by open Q&A.' },
]

export const GATED_PODCAST = [
  { t: 'p', text: 'Conversations with people doing the practical work of decarbonisation: operators, researchers, finance leaders and policy specialists. New episodes every few weeks.' },
  { t: 'h4', text: 'In recent episodes' },
  { t: 'ul', className: 'checklist', items: ['What a credible transition plan looks like', 'Lessons from a decade of supplier engagement', 'Where clean power procurement goes next'] },
  { t: 'p', text: 'Subscribe on your favourite platform or sign up to get new episodes by email.' },
]

// Customer story Variant A sections (story template)
export const STORY_INTRO =
  'This customer story is placeholder copy for a fictional company. It describes, in general terms, how a climate team moved from annual spreadsheets to a continuous programme: measuring its full footprint, engaging suppliers on the largest sources and reporting to customers and regulators with confidence. The names, figures and quotes on this page are invented for the prototype and do not describe any real organisation. The structure mirrors a typical story: a short summary of the challenge, the approach the team took, and the results they saw after the first full reporting cycle, followed by a look at what they plan to tackle next as the programme matures and expands.'

export const STORY_KEYPOINTS = [
  { label: 'Challenge', text: 'Most of the footprint sat in the supply chain, but supplier data was patchy and collected by email once a year.' },
  { label: 'Solution', text: 'The team built a single inventory, prioritised the largest suppliers and set up a quarterly data request with clear templates.' },
  { label: 'Results', text: 'Within a year, primary data covered most purchased goods, and the company published its first assured report on schedule.' },
]

export const STORY_SECTIONS = [
  {
    id: 'challenge',
    label: 'Challenge',
    blocks: [
      { t: 'h2', text: 'A footprint dominated by the value chain' },
      { t: 'p', text: 'Like many companies, the placeholder company found that the vast majority of its emissions came from goods and services it bought rather than its own operations. Estimates based on spend gave a starting point, but they could not show which suppliers were improving.' },
      { t: 'p', text: 'Reporting requests were also multiplying. Customers wanted product-level figures, investors wanted targets, and new regulations were on the horizon.' },
    ],
  },
  {
    id: 'solution',
    label: 'Solution',
    blocks: [
      { t: 'h2', text: 'One inventory, many uses' },
      { t: 'p', text: 'The team consolidated its data into a single inventory with a clear audit trail. From there, they ranked suppliers by contribution and started with the largest twenty.' },
      { t: 'h3', text: 'Supplier engagement' },
      { t: 'p', text: 'Each supplier received a short template, a named contact and a regular check-in. Where suppliers lacked the capacity to measure, the team shared simple guidance and [free resources](/guides).' },
      { t: 'quote', paras: ['Once suppliers could see their own numbers next to the industry average, the conversation changed from compliance to opportunity.'], attribution: 'Placeholder name\nSustainability lead, placeholder company' },
    ],
  },
  {
    id: 'results',
    label: 'Results',
    blocks: [
      { t: 'h2', text: 'Faster reporting and real reductions' },
      { t: 'p', text: 'After the first cycle, the team published its report weeks earlier than the year before, with assurance completed on schedule. More importantly, several large suppliers committed to switching to renewable power.' },
      { t: 'ul', items: ['Primary data for most purchased goods', 'Reporting time cut substantially', 'A reduction roadmap agreed with leadership'] },
    ],
  },
]
