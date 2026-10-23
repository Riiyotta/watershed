import Media from '../../components/Media.jsx'
import PlaceholderLogo, { LOGOS } from '../../components/PlaceholderLogo.jsx'
import BlogPostsThemeImages from '../BlogPostsThemeImages.jsx'

// §3.34 ClimateLeadsTemplate (/climate-leads). Measured 1440 (live):
//  - Hero: bg #4b72e6, padding 128 32 384 (starts under the nav; 60 below it here), two 688 columns (padding 0 24):
//    Serif H1 64/64 300 -1.92 white, right-aligned (500 wide); intro 18/24 600 white paragraphs (gap 24) and a row of
//    five 75x75 round avatar chips (bg #013aad, gap 10, 32 below). A 1440x583 photo fills the lower part and a white
//    angled cut (150) closes it; the first interview overlaps the hero by 160.
//  - Interviews: 1024 column (x 208), main padding 0 20, sections padding 24, 96 apart. Grid: avatar row (160 round)
//    → article 547 + aside 365 (gap 16 64), alternating sides. Name Serif 32/35.2 400 -0.96 black, role 18/28 600
//    #5d93ff (padding-bottom 16), Q&A 18/28 500 black with bold lead-ins (gap 24). Aside blocks are separated by 1px
//    #265cff rules (padding 24 0): logo 200x48; facts 18/27 600 #0033cc (gap 24); optional diagram 348x302.
//    Pull quote: Serif 48/60 500 -1.44 cobalt, 976 wide, with a pale <mark> (#caf5ff / #caffe8).
//  - blogPosts.themeImages: 1024 wide, border-top 1px #658dfd, 8 posts in 3 columns (312 wide).
const LEADS = [
  { name: 'Amir Kassab', role: 'Head of Sustainability', mark: '#caf5ff', quote: ['It is not about adding sustainability as an afterthought at the end of a project. We want to ', 'embed sustainability as a decision factor in everything we do', '.'] },
  { name: 'Ben Morley', role: 'Head of Sustainability Policy', mark: '#caffe8', diagram: true, quote: ['We are working not just to lead in our own sector, but to ', 'drive systematic change across the whole industry', ' through partnerships and policy.'] },
  { name: 'Will Parry', role: 'Senior Product Analyst', mark: '#caf5ff', quote: ['Most companies now see that their ', 'climate work is aligned with their mission', ' and long-term goals.'] },
  { name: 'Mia Keller', role: 'Workplace Sustainability Manager', mark: '#caffe8', quote: ['Climate work is a chance to think years ahead about ', 'how the choices we make today shape tomorrow', '.'] },
  { name: 'Ebba Lund', role: 'Global Sustainability Manager', mark: '#caf5ff', diagram: true, quote: ['Many of the solutions we need already exist. ', 'We just need to put them to work', ' at scale.'] },
]
const QA = [
  ['I have learned:', 'The opportunity on climate is vast, so the key is to keep breaking big ideas down into concrete next steps that the whole company can act on right away.'],
  ['My role:', 'Our programme builds on structures that already exist across the business. My job is to take that work to the next level, for our company and in partnership with our community.'],
  ['I want others to know:', 'Even small individual changes add up when they are applied across millions of customers. Curiosity, a good team and the right data take you a long way.'],
]
const RULE = 'border-t border-cobalt py-6'

export default function ClimateLeads() {
  return (
    <>
      <header className="relative overflow-hidden bg-[#4b72e6] px-4 pb-[220px] pt-12 md:px-8 md:pb-[384px] md:pt-[60px]">
        <Media slot="company.climateLeads.hero" tone="cool" className="absolute inset-x-0 bottom-0 h-[583px] w-full opacity-70" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[150px] bg-white" style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%)' }} />
        <div className="relative mx-auto grid max-w-[1376px] grid-cols-1 gap-8 md:grid-cols-2 md:gap-0">
          <div className="md:px-6">
            <h1 className="font-serif text-[44px] font-light leading-[44px] tracking-[-1.32px] text-white md:ml-auto md:max-w-[500px] md:text-right md:text-[64px] md:leading-[64px] md:tracking-[-1.92px]">Profiles in climate action</h1>
          </div>
          <div className="md:px-6">
            <div className="flex max-w-[569px] flex-col gap-6 text-lg font-semibold leading-6 tracking-[-0.18px] text-white">
              <p>Climate leads are the internal champions driving decarbonisation inside companies. They do the work behind the scenes to mobilise their businesses.</p>
              <p>They are rethinking their organisations for a low-carbon world and working across far-flung teams to turn pledges into reality. They are optimistic and grounded, tenacious and resourceful.</p>
              <p>Their work really matters. At Northwind, we are lucky to support them every day.</p>
            </div>
            <ul className="mt-8 flex gap-[10px]">
              {LEADS.map((l, i) => (
                <li key={l.name} className="h-[75px] w-[75px] overflow-hidden rounded-full bg-[#013aad]">
                  <a href={`#lead-${i}`} aria-label={l.name} className="block h-full w-full">
                    <Media slot={`company.climateLeads.chip.${i}`} tone="cool" className="h-full w-full rounded-full opacity-80" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>
      <div className="relative -mt-[160px] px-5">
        <div className="mx-auto flex max-w-[1024px] flex-col gap-24">
          {LEADS.map((l, i) => {
            const flip = i % 2 === 1
            return (
              <section key={l.name} id={`lead-${i}`} className="grid grid-cols-1 gap-x-16 gap-y-4 p-6 md:grid-cols-[547px_365px]">
                <header className={`pb-[5px] md:col-span-2 ${flip ? 'md:pl-[429px]' : ''}`}>
                  <Media slot={`company.climateLeads.avatar.${i}`} tone="neutral" className="h-40 w-40 rounded-full" />
                </header>
                <article className={`flex flex-col ${flip ? 'md:order-2' : ''}`}>
                  <div className="pb-4">
                    <h2 className="font-serif text-[32px] font-normal leading-[35.2px] tracking-[-0.96px] text-black">{l.name}</h2>
                    <p className="text-lg font-semibold leading-7 tracking-[-0.18px] text-[#5d93ff]">{l.role}</p>
                  </div>
                  <div className="flex flex-col gap-6">
                    {QA.map(([k, v]) => (
                      <p key={k} className="text-lg font-medium leading-7 tracking-[-0.18px] text-black">
                        <strong className="font-bold">{k}</strong> {v}
                      </p>
                    ))}
                  </div>
                </article>
                <aside className={`flex flex-col self-start border-b border-cobalt ${flip ? 'md:order-1' : ''}`}>
                  <div className={RULE}>
                    <PlaceholderLogo logo={LOGOS[(i + 1) % LOGOS.length]} height={36} className="h-12 max-w-[200px] text-midnight" />
                  </div>
                  <div className={`${RULE} flex flex-col gap-6 text-lg font-semibold leading-[27px] tracking-[normal] text-[#0033cc]`}>
                    <p>A global company focused on making everyday products and services with a lower footprint for its customers.</p>
                    <p>Already matching all of its corporate electricity with renewable energy and committed to a net-zero footprint.</p>
                  </div>
                  {l.diagram && (
                    <div className={RULE}>
                      <Media slot={`company.climateLeads.diagram.${i}`} tone="neutral" className="aspect-[348/302] w-full max-w-[348px]" />
                    </div>
                  )}
                </aside>
                <blockquote className="order-3 pt-12 md:col-span-2">
                  <p className="font-serif text-[32px] font-medium leading-[40px] tracking-[-0.96px] text-cobalt md:text-[48px] md:leading-[60px] md:tracking-[-1.44px]">
                    “{l.quote[0]}
                    <mark className="tracking-[-0.48px] text-cobalt [box-decoration-break:clone]" style={{ background: l.mark }}>
                      {l.quote[1]}
                    </mark>
                    {l.quote[2]}”
                  </p>
                </blockquote>
              </section>
            )
          })}
        </div>
        <div className="mx-auto mt-24 max-w-[1024px]">
          <BlogPostsThemeImages
            bordered
            title="The latest from climate leads"
            slotPrefix="company.climateLeads.posts"
            posts={[
              { title: 'Profiling leaders in climate action: supply chains', date: '14 April 2026', to: '/customers/profiling-leaders-in-climate-action-joanna-rice' },
              { title: 'A climate lead on supplier engagement', date: '2 February 2026', to: '/customers/profiling-leaders-in-climate-action-lilian-liu' },
              { title: 'Building a programme from scratch', date: '9 December 2025', to: '/customers/profiling-leaders-in-climate-action-neha-shah' },
              { title: 'Profiling leaders in climate action: retail', date: '12 October 2025', to: '/customers/profiling-leaders-in-climate-action-mark-danzenbaker' },
              { title: 'A climate lead on clean power', date: '3 August 2025', to: '/customers/profiling-leaders-in-climate-action-joanna-rice' },
              { title: 'Profiling leaders in climate action: finance', date: '21 June 2025', to: '/customers/profiling-leaders-in-climate-action-lilian-liu' },
              { title: 'A climate lead on travel', date: '8 May 2025', to: '/customers/profiling-leaders-in-climate-action-neha-shah' },
              { title: 'Profiling leaders in climate action: technology', date: '30 March 2025', to: '/customers/profiling-leaders-in-climate-action-mark-danzenbaker' },
            ]}
          />
        </div>
      </div>
    </>
  )
}
