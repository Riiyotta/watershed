import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRightThin } from '../../components/Icons.jsx'
import Media from '../../components/Media.jsx'
import { href } from '../../routing.js'
import { SmartLink } from '../ui.jsx'

// §3.34 Careers. Job detail pages (/careers/<id>-<slug>) are NOT in routes.json: links point there and fall back to Pending.
// Measured 1440 (live): main = 1200 container, padding 0 12 24, grid 691/461, gap 24.
//  - Intro header spans both columns: bg #241f19 + photo, padding 80 48; 560-wide column: H1 35/38.5 600 -0.35 white,
//    paragraphs 20/30 white, gap 20. 390: padding 24, H1 30/33 -0.3, photo 250 tall at the top.
//  - Roles header padding 48 48 24 (390: 24): H2 32/35.2 600 -0.96 midnight, body 20/30 #666c80 (gap 20).
//  - Filters: margin-left 48 (390: 24), padding 12 48 32 0, gap 12, dotted 1px rgba(13,89,242,.5) rule below;
//    pills Mono 14/18 uppercase, padding 5 10.
//  - Department: h3 23/25.3 600 -0.69 midnight, padding 34 48 4 (390: 24 26 2); list padding 0 0 8 8 (390: 0 8 8);
//    rows padding 12 40 (alternate #f5f8ff), title 20/30 500 -0.2 cobalt, locations Mono 14/21 right-aligned (one per
//    line) + 8x14 chevron.
//  - Sidebar: sections padding 48 32, h2 24/26.4 600 -0.48 midnight → links 20; links padding 12 16 (bleeding 16),
//    20/27.5 500 -0.2 cobalt + chevron, optional category 16.67/22.9 #6d7fb2; dotted rules between sections; a
//    461x268 photo slider at the end (32x32 prev/next, bg rgba(255,255,255,.25)).
const LOCATIONS = ['All locations', 'Remote', 'San Francisco', 'New York', 'London', 'Germany', 'France', 'Mexico City', 'Sydney', 'Denver']
const DEPTS = [
  ['Customer Data Services', [['Customer data specialist (fixed-term)', ['Mexico City']], ['Customer data specialist, US (fixed-term)', ['New York', 'San Francisco']], ['Data specialist', ['London']], ['Service delivery manager', ['New York']], ['Data operations lead', ['London']], ['Customer data analyst', ['Sydney']]]],
  ['Customer Success', [['Customer success manager, strategic', ['London']], ['Manager, customer success', ['San Francisco']]]],
  ['Design', [['Product designer', ['San Francisco']], ['Staff product designer', ['London']]]],
  ['Engineering', [['Senior product engineer', ['New York']], ['Software engineer, cloud infrastructure', ['San Francisco']], ['Software engineer, full-stack', ['Mexico City']], ['Staff software engineer, AI product', ['London']], ['Software engineer, data platform', ['Remote']], ['Engineering manager', ['New York']], ['Security engineer', ['Remote']]]],
  ['Finance', [['Accounting manager', ['Mexico City']], ['Senior accountant', ['Mexico City']], ['Financial planning analyst', ['New York']]]],
  ['Go-to-market operations', [['Revenue operations manager', ['New York', 'Remote']], ['Sales operations analyst', ['London', 'Germany']], ['Deal desk lead', ['San Francisco', 'Denver']]]],
  ['Implementation', [['Implementation manager', ['London']]]],
  ['Legal', [['Commercial counsel', ['New York']], ['Privacy counsel', ['London']]]],
  ['Marketing', [['Head of content', ['New York']], ['Product marketing manager', ['San Francisco']], ['Field marketing manager', ['London', 'Germany']]]],
  ['People', [['Recruiter, engineering', ['San Francisco', 'Remote']], ['People partner', ['London']], ['Recruiting coordinator', ['Mexico City']]]],
  ['Product', [['Senior product manager, reporting', ['New York']], ['Product manager, supply chain', ['London']], ['Group product manager', ['San Francisco']]]],
  ['Sales', [['Account executive, enterprise', ['Germany']], ['Enterprise account manager', ['London']], ['Sales development representative', ['Remote']]]],
  ['Climate Advisory', [['Climate data advisor', ['London']], ['Climate data advisor', ['Sydney']], ['Climate data advisor (fixed-term)', ['France']], ['Senior climate advisor', ['New York', 'Denver']]]],
  ['Science', [['Climate scientist, emission factors', ['San Francisco']], ['Data scientist, product footprints', ['London']], ['Research scientist, AI evaluation', ['Remote']]]],
  ['Sales engineering', [['Solutions engineer', ['New York']], ['Solutions engineer', ['Germany']]]],
]
const SIDE = [
  ['Blog', [['Company updates, policy news and more from the team', '/blog/series-c']]],
  ['Life at Northwind', [['Building cloud infrastructure with ownership at Northwind', '/blog/meet-aviva-building-cloud-infrastructure-with-ownership-at-watershed']]],
  [
    'Writing from engineering and design',
    [
      ['An internal analytics layer powered by AI', '/blog/soup-ai-analytics-layer', 'Tech and design'],
      ['Building AI into climate reporting at Northwind', '/blog/meet-kevin-ai-engineer-sustainability', 'Tech and design'],
      ['Starting an engineering team from scratch', '/blog/mexico-city', 'Tech and design'],
      ['Designing for data-heavy workflows', '/blog/soup-ai-analytics-layer', 'Tech and design'],
    ],
  ],
]
const RULE = 'border-dotted border-[rgba(13,89,242,.5)]'

export default function Careers() {
  const [loc, setLoc] = useState('All locations')
  let row = 0
  return (
    <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 px-3 pb-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] xl:grid-cols-[691px_461px]">
      <header className="relative overflow-hidden bg-[#241f19] p-6 md:px-12 md:py-20 lg:col-span-2">
        <Media slot="company.careers.hero" tone="warm" className="absolute inset-x-0 top-0 h-[250px] w-full opacity-40 md:h-full" />
        <div className="relative flex max-w-[560px] flex-col gap-5">
          <h1 className="text-[30px] font-semibold leading-[33px] tracking-[-0.3px] text-white md:text-[35px] md:leading-[38.5px] md:tracking-[-0.35px]">Work at Northwind</h1>
          <p className="text-[20px] font-medium leading-[30px] tracking-[-0.2px] text-white">Climate change is an urgent problem with many ways to contribute. Here you can focus your day-to-day work on helping companies measure, report and cut their emissions at scale.</p>
          <p className="text-[20px] font-medium leading-[30px] tracking-[-0.2px] text-white">We believe companies are critical to the transition, and that better data leads to better decisions. We measure our success in the emissions our customers avoid, and we build the tools that make that possible.</p>
          <p className="text-[20px] font-medium leading-[30px] tracking-[-0.2px] text-white">We are backed by long-term investors and a growing team. If climate and technology both interest you, we would love to hear from you.</p>
        </div>
      </header>
      <article>
        <header className="flex flex-col gap-5 p-6 md:px-12 md:pb-6 md:pt-12">
          <h2 className="text-[32px] font-semibold leading-[35.2px] tracking-[-0.96px] text-midnight">Roles</h2>
          <p className="text-[20px] font-medium leading-[30px] tracking-[-0.2px] text-ink-secondary">We aim for consistent, fair and competitive pay. The cash range for a role may span several levels, and final offers depend on skills, experience and location. Pay comes with a full benefits package including health cover, retirement plans, generous paid time off, parental leave and wellbeing support.</p>
        </header>
        <div role="radiogroup" aria-label="Filter by location" className={`ml-6 flex flex-wrap gap-3 border-b pb-8 pr-6 pt-2 md:ml-12 md:pr-12 md:pt-3 ${RULE}`}>
          {LOCATIONS.map((l) => (
            <button
              key={l}
              type="button"
              role="radio"
              aria-checked={loc === l}
              onClick={() => setLoc(l)}
              className={`px-[10px] py-[5px] font-mono text-sm uppercase leading-[18px] tracking-[-0.14px] ${loc === l ? 'bg-cobalt-40 text-[#fffbf3]' : 'bg-cobalt-5 text-cobalt hover:bg-cobalt-40 hover:text-[#fffbf3]'}`}
            >
              {l}
            </button>
          ))}
        </div>
        {DEPTS.map(([dept, jobs]) => {
          const visible = jobs.filter(([, where]) => loc === 'All locations' || where.includes(loc))
          if (!visible.length) return null
          return (
            <div key={dept}>
              <h3 className="px-[26px] pb-[2px] pt-6 text-[23px] font-semibold leading-[25.3px] tracking-[-0.69px] text-midnight md:px-12 md:pb-1 md:pt-[34px]">{dept}</h3>
              <ul className="px-2 pb-2 md:pl-2 md:pr-0">
                {visible.map(([title, where]) => {
                  row += 1
                  const slug = `${1000 + row}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '')}`
                  return (
                    <li key={title + where.join()} className={`rounded-btn px-4 py-3 md:px-10 ${row % 2 ? 'bg-cobalt-5' : ''}`}>
                      <Link to={href(`/careers/${slug}`)} className="group flex items-center justify-between gap-2">
                        <span className="text-[20px] font-medium leading-[30px] tracking-[-0.2px] text-cobalt group-hover:underline">{title}</span>
                        <span className="flex shrink-0 items-center gap-4">
                          <span className="flex max-w-[200px] flex-col gap-[2px] text-right font-mono text-sm leading-[21px] text-cobalt">
                            {where.map((w) => (
                              <span key={w}>{w}</span>
                            ))}
                          </span>
                          <ChevronRightThin />
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </article>
      <aside className="flex flex-col">
        {SIDE.map(([h, links], i) => (
          <div key={h}>
            {i > 0 && <span aria-hidden="true" className={`mx-8 block border-t ${RULE}`} />}
            <section className="flex flex-col gap-5 px-8 py-12">
              <h2 className="text-2xl font-semibold leading-[26.4px] tracking-[-0.48px] text-midnight">{h}</h2>
              <ul className="-mx-4">
                {links.map(([label, to, cat]) => (
                  <li key={label}>
                    <SmartLink to={to} className="flex items-center justify-between gap-2 px-4 py-3">
                      <span className="flex flex-col">
                        <span className="text-[20px] font-medium leading-[27.5px] tracking-[-0.2px] text-cobalt">{label}</span>
                        {cat && <small className="text-[16.67px] font-medium leading-[22.9px] text-[#6d7fb2]">{cat}</small>}
                      </span>
                      <ChevronRightThin className="shrink-0 text-cobalt" />
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        ))}
        <section className="relative h-[268px] overflow-hidden">
          <Media slot="company.careers.photo" tone="neutral" className="h-full w-full" />
          <button type="button" aria-label="Previous photo" className="absolute bottom-[11px] left-[6px] flex h-8 w-8 items-center justify-center bg-white/25 p-[10px] text-white">
            <ChevronRightThin className="rotate-180" />
          </button>
          <button type="button" aria-label="Next photo" className="absolute bottom-[11px] right-[6px] flex h-8 w-8 items-center justify-center bg-white/25 p-[10px] text-white">
            <ChevronRightThin />
          </button>
        </section>
      </aside>
    </div>
  )
}
