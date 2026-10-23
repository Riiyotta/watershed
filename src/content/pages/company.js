// `company` block pages (§4.11). Bespoke company pages (/careers, /brand, /change, /climate-leads) live in src/blocks/templates.
import { b, faq, featureText, logos, quote, stb, textList } from './kit.js'

const stories = (title) =>
  b('PageLinkSet', {
    title,
    cards: [
      { eyebrow: 'Interview', title: 'A pragmatic approach to climate', to: '/blog/ceo-perspective-on-getting-to-net-zero', cta: 'Read more' },
      { eyebrow: 'Northwind HQ', title: 'Bending the emissions curve', to: '/blog/one-gigaton', cta: 'Read more' },
      { eyebrow: 'Business briefings', title: 'Reduction: changing business practice', to: '/blog/build-high-impact-climate-program', cta: 'Read more' },
      { eyebrow: 'Customers', title: 'How leading companies run climate programmes', to: '/customers', cta: 'Read more' },
      { eyebrow: 'Careers', title: 'We are hiring', to: '/careers', cta: 'Read more' },
    ],
  })

export default {
  '/about-us': [
    b('Hero', {
      eyebrow: 'Our mission',
      title: 'Accelerate the climate economy',
      sub: [
        'The shift to a low-carbon economy is well under way. Clean energy is often cheaper than fossil fuels, customers are asking for lower-impact products, and companies everywhere need to understand climate risk, supply chain resilience and resource use.',
        'This new economy needs more detailed and actionable information than companies have ever had at scale. To help them meet it, we built a climate data platform that turns complex inputs into clear decisions.',
        'Northwind combines deep climate science with careful engineering to surface the risks and opportunities that give a company a lasting edge.',
      ],
      primary: null,
      media: { tone: 'cool' },
      bg: 'linear-gradient(#f5f7ff 0%, #fff 100%)',
    }),
    logos('medium', 'Powering climate programmes for'),
    b('Grid', {
      variant: 'three',
      title: 'By the numbers',
      items: [
        { desc: 'Customers manage a combined footprint larger than several mid-sized economies.' },
        { desc: 'Our factor library spans every region and many years of data.' },
        { desc: 'Our long-term goal is to help remove or reduce a meaningful share of global emissions.' },
      ],
    }),
    b('HorizontalRule'),
    featureText('About Northwind'),
    stb([
      { annotation: true, tone: 'cool' },
      { p: 'We started Northwind because we believed helping companies decarbonise was one of the most effective ways to tackle climate change.' },
      { p: 'Our mission is to accelerate the climate economy, and our long-term goal is to help customers reduce or remove a significant volume of emissions each year.' },
      { annotation: true, tone: 'warm' },
      { p: 'Today, Northwind is a team of several hundred people across offices in North America, Europe and Asia-Pacific. Our customers span every region and industry, from retailers and manufacturers to banks and professional services firms.' },
      { p: 'The platform includes a broad climate database for detailed measurement, software for reporting and supply chain engagement, and a marketplace for carefully vetted climate projects. Expertise from our network of partners, scientists and policy specialists is built into every part of it.' },
    ]),
    stories('In the news'),
    b('Grid', {
      variant: 'two',
      title: 'Operating principles',
      sub: 'These principles guide how we work, prioritise and make decisions. They are a living set of values that evolve with the company.',
      items: [
        { title: 'Put customers first', desc: 'Our customers are at the centre of our mission. We keep them in mind in every decision and treat their goals as our own.' },
        { title: 'Focus on what matters most', desc: 'Time is precious, especially in a climate crisis. We prioritise ruthlessly and drop work that does not move us forward.' },
        { title: 'Build an inclusive team', desc: 'We can only succeed with people who feel they belong. We design our hiring, culture and growth paths with that in mind.' },
        { title: 'Bring intensity and care', desc: 'We care deeply about the work and each other, and we bring energy to doing the best work of our careers.' },
        { title: 'Take ownership', desc: 'If something is broken, we fix it. We step up and see work through to the end.' },
      ],
    }),
    featureText('Sustainability at Northwind'),
    stb([
      { p: 'We hold ourselves to the same standards we help customers meet. We measure our own footprint every year using our platform and publish the results.' },
      { p: 'We have set reduction targets, focused on hotspots such as business travel and purchased services, and introduced internal policies on travel, food and supplier selection. We also fund long-term carbon removal for emissions we cannot yet avoid.' },
    ]),
    stories('More from Northwind'),
  ],
  '/ai-fellowship': [
    b('Hero', {
      eyebrow: 'AI Fellowship',
      title: 'Become the AI expert your climate team needs',
      sub: 'An applied programme for sustainability professionals who want to build, test and document AI workflows for their own organisations, with support from Northwind specialists.',
      primary: { label: 'Apply now', to: '/demo' },
      secondary: { label: 'Read about the first cohort', to: '/blog/meet-the-first-ai-fellows' },
    }),
    faq('Fellowship questions', { n: 4, offset: 2 }),
    b('Video'),
    b('CustomerPhotoFeature', {
      title: 'What fellows achieved',
      videoLabel: 'Watch the recap',
      cards: [
        { metric: '12', caption: 'workflows documented and shared', quote: 'I came away with tools my team uses every week.' },
        { metric: '30%', caption: 'average time saved on data preparation', quote: 'The programme turned ideas into working processes.' },
        { metric: '8 wks', caption: 'from kickoff to final presentations', quote: 'Practical, focused and well supported throughout.' },
      ],
    }),
    b('Spacer'),
    b('Spacer'),
    b('Spacer'),
  ],
  '/partners': [
    b('HeaderRoot', {
      eyebrow: 'Northwind ecosystem',
      title: 'Our partners',
      body: 'Meet your climate goals with our network of experienced partners. Extend the scope of your programme with specialist services, datasets and capabilities.',
      link: { label: 'Get started', to: '/demo' },
    }),
    textList([
      { title: 'Consulting partners', body: ['Deliver on your commitments with consulting firms that handle scoping, measurement, target setting and reduction planning for programmes of every size.', 'Northwind and our advisory partners offer joint services for first-time reporters.'], link: { label: 'Read more', to: '/blog/deloitte-partnership' }, span: 6, natural: 515, ratio: 515 / 312 },
      { title: 'Technology and data partners', body: 'Leading technology and data providers give you one connected system for actionable, audit-ready climate management, with integrations that bring source data straight into your footprint.', link: { label: 'Read more', to: '/blog/watershed-ecosystem' }, span: 6, natural: 515, ratio: 515 / 426 },
    ]),
    quote(2),
    faq('Questions about our partners', { n: 3, offset: 4 }),
    b('BlogPostsThemeImages', {
      title: 'Partner resources',
      posts: [
        { title: 'Building a connected climate stack', date: 'Mar 2026', to: '/blog/watershed-ecosystem' },
        { title: 'Working with advisory firms', date: 'Jan 2026', to: '/blog/deloitte-partnership' },
        { title: 'Data partnerships that scale', date: 'Nov 2025', to: '/blog/ecovadis-partnership' },
      ],
    }),
  ],
  '/reading-list': [
    stb(
      [
        { img: true, ratio: '612 / 344', tone: 'cool' },
        { h2: 'The problem statement' },
        { ul: ['Background on climate fundamentals: a summary of the latest science', 'Global emissions gap analysis', 'Visualisations of where emissions come from by country and sector', 'Feedback loops and tipping points in the climate system'] },
        { aside: 'A favourite piece of climate fiction: a novel imagining how institutions might respond over the coming decades.' },
        { p: 'Human cost:' },
        { ul: ['The social cost of carbon', 'Health and climate change', 'The economics of a warming world'] },
        { h2: 'Solution paths' },
        { img: true, ratio: '612 / 344', tone: 'warm' },
        { h3: 'Clean energy' },
        { p: 'Clean generation is now the cheapest option in many places. It is only one part of the puzzle, but a very important one.' },
        { ul: ['Core data on generation costs', 'Commentary on how fast grids are changing', 'Case studies of national transitions'] },
        { h3: 'Where do emissions come from?' },
        { ul: ['Global greenhouse gas emissions data', 'Interactive climate data explorers'] },
        { h3: 'Scenario modelling' },
        { aside: 'If you read one piece, make it a clear mental model of how to think about combating climate change.' },
        { ul: ['A table of climate solutions ranked by impact', 'A policy guide for low-carbon energy', 'Interactive energy policy simulators'] },
        { h2: 'The role of companies' },
        { ul: ['How to tell whether net zero goals are serious', 'A short explainer on net zero', 'Reporting on corporate climate programmes'] },
        { h2: 'Ongoing subscriptions' },
        { ul: ['Climate newsletters', 'Podcasts about climate and business', 'A climate-focused news site'] },
      ],
      true,
      { title: 'Climate reading list', intro: 'These are the readings that have most shaped our thinking as we built Northwind. Send us recommendations or feedback as you look through.' },
    ),
  ],
}
