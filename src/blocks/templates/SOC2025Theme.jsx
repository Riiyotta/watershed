import Media from '../../components/Media.jsx'
import { HubspotForm } from '../primitives.jsx'

// §3.34 SOC2025Theme + FullWidthBackground. Measured 1440 (live): a 1440x400 hero image that starts 80 above the
// content top (under the nav), so 320 shows below an opaque nav (390: 500 tall image, 420 visible). Content 64 below:
// 1280 container with padding 0 48 (390: 0 24), grid 568/568 gap 48 (390: one column, gap 40).
// Text card: white, 1px #c0d0f0, padding 32 (390: 24); H1 48/52.8 500 -1.44 cobalt (390: 38/41.8 -1.14) → body 20;
// paragraphs 20/30 #666c80 (gap 20); list padding-left 24, items padding-left 28 with cobalt disc markers, gap 12.
// Form column (gap 24; 390: 20): cover 568x297 radius 6, then a bordered card (padding 32; 390: 24 20) with an
// h2 24/26.4 500 -0.72 cobalt → form 24 (6 fields, first row 2 columns). A decorative image fills the right half of
// a 127-tall footer band (390: full width, 300 tall).
const COPY = {
  '/state-of-corporate-sustainability-ai-2026': {
    title: 'The state of corporate sustainability: AI edition',
    paras: [
      'Climate teams are entering the year at a turning point. Programmes remain lean and are stretched across a growing set of demands, from new rules to complex measurement, which leaves reductions too often in the background.',
      'AI is finally helping with data preparation, drafting and error checking. But concerns about accuracy, privacy, skills and budget still limit how far it can go.',
      'This report shows where teams are now, where AI is already working and what it will take to turn ambition into impact.',
    ],
  },
  '/verdantix-2026': {
    title: 'Independent market study: climate software leaders',
    paras: [
      'An independent research firm compared leading climate and ESG software providers across dozens of criteria, from data management to reporting and reduction planning.',
      'Read the full study to see how vendors were assessed and where Northwind was rated strongest.',
    ],
  },
}
const INSIDE = ['Where teams spend their time across measurement, action and reporting', 'Where AI speeds work up today, and what is holding it back', 'Practical moves for the year ahead: trust, governance and procurement']

export default function SOC2025Theme({ path }) {
  const c = COPY[path] ?? COPY['/state-of-corporate-sustainability-ai-2026']
  return (
    <div className="bg-white">
      <Media slot="report.soc.hero" tone="cool" className="h-[420px] w-full md:h-[320px]" />
      <div className="mx-auto mt-16 max-w-[1280px] px-6 md:px-12">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:justify-between xl:grid-cols-[568px_568px] lg:gap-12">
          <div className="flex flex-col gap-5 border border-line bg-white p-6 md:p-8">
            <h1 className="text-[38px] font-medium leading-[41.8px] tracking-[-1.14px] text-cobalt md:text-[48px] md:leading-[52.8px] md:tracking-[-1.44px]">{c.title}</h1>
            {c.paras.map((p) => (
              <p key={p} className="t-lead">
                {p}
              </p>
            ))}
            <p className="t-lead">What is inside:</p>
            <ul className="flex list-disc flex-col gap-3 pl-6 marker:text-cobalt">
              {INSIDE.map((it) => (
                <li key={it} className="t-lead pl-7">
                  {it}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-5 md:gap-6">
            <Media slot="report.soc.cover" tone="cool" className="aspect-[568/297] w-full rounded-md" />
            <div className="flex flex-col gap-6 border border-line bg-white px-5 py-6 md:p-8">
              <h2 className="text-2xl font-medium leading-[26.4px] tracking-[-0.72px] text-cobalt">Download the report</h2>
              <HubspotForm fields="guide" submitLabel="Get the report" />
            </div>
          </div>
        </div>
      </div>
      <div className="relative mt-20 h-[300px] overflow-hidden md:h-[127px]">
        <Media slot="report.soc.footer" tone="cool" className="absolute bottom-0 right-0 h-[195px] w-full md:h-[360px] md:w-1/2" />
      </div>
    </div>
  )
}
