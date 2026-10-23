import Media from '../components/Media.jsx'
import { Faq, FIELDSETS, HubspotForm, PageLinks, Prose } from '../primitives/index.js'

// §4.6 GatedLanding: guide, event (default variant), report-landing (gated ones) and /podcast.
//
// Props
//   kind        'guide' | 'event' | 'report' | 'podcast'   (event => cream band, 600/600 grid, logistics block)
//   eyebrow     mono bar text, e.g. 'Northwind guide'
//   title       H1 text
//   body        Prose block array (see primitives/Prose.jsx); use { t:'ul', className:'checklist', items } for the checklist
//   logistics   events only: { date, time, location?, isPast? }
//   faq         optional [{q, a}] rendered inside the left column (ai-emissions variant)
//   form        { title, fields?: FIELDSETS key or array, submitLabel, imageSlot? }
//   related     PageLinks cards [{path, eyebrow, title, slot, tone}] (omit to hide)
export default function GatedLanding({ kind = 'guide', eyebrow, title, body = [], logistics, speakers, faq, form = {}, related, relatedTitle = 'Additional resources' }) {
  const isEvent = kind === 'event'
  const bg = isEvent ? '#fffbf3' : '#fff'
  const fields = Array.isArray(form.fields) ? form.fields : FIELDSETS[form.fields ?? (isEvent ? 'event' : 'guide')]
  return (
    <>
      <div className="relative" style={{ backgroundColor: bg }}>
        {/* grid-background band */}
        <div className="blueprint-grid absolute inset-0" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 h-32" aria-hidden="true" style={{ background: `linear-gradient(transparent, ${bg})` }} />

        {/* 390 (measured): img-narrow is absolute at top 40 and the card stack starts 120 lower, overlapping it */}
        <div className="absolute inset-x-0 top-10 md:hidden">
          <Media slot={form.imageSlot ?? `gated.${kind}.cover`} tone="cool" className="h-[205px] w-full" />
        </div>

        <div className="relative mx-6 pt-20 md:mx-auto md:max-w-[1119px] lg:max-w-none">
          {/* 1024-1199: the 50/50 card pair keeps the original's 81px left offset and shrinks (W - 141, max 1119) */}
          <div className={`mx-auto mt-[120px] grid grid-cols-1 items-start md:mt-0 lg:max-w-[1200px] ${isEvent ? 'lg:grid-cols-[repeat(2,minmax(0,600px))] lg:justify-center' : 'lg:ml-[81px] lg:w-[min(1119px,calc(100%-141px))] lg:grid-cols-2 xl:mx-auto xl:w-[1119px] xl:grid-cols-[559.5px_559.5px]'}`}>
            {/* Left column */}
            <article className="relative border-x border-cobalt-20">
              <p className="flex h-10 items-center border-b border-cobalt-20 bg-white px-3 font-mono text-xs leading-[13px] tracking-[normal] text-cobalt-40 md:px-8 md:text-sm md:leading-5">{eyebrow}</p>
              <div className={`border-b border-cobalt-20 bg-white ${isEvent ? 'flex flex-col justify-center p-3 md:px-8 md:py-6' : 'p-3 md:p-8'}`}>
                <h1 className="[overflow-wrap:anywhere] text-[45px] font-normal leading-[49.5px] tracking-[-1.35px] text-midnight md:text-7xl md:leading-[52.8px] md:tracking-[-1.44px]">{title}</h1>
              </div>
              {isEvent && logistics && (
                <div className={`bg-[#0033cc] px-[34px] py-[30px] ${logistics.isPast ? 'is-past' : ''}`}>
                  <dl className="grid grid-cols-[100px_1fr] gap-y-[22px]">
                    {[
                      ['Date', logistics.date],
                      ['Time', logistics.time],
                      ['Location', logistics.location],
                    ]
                      .filter(([, v]) => v)
                      .map(([k, v]) => (
                        <div key={k} className="contents">
                          <dt className="font-mono text-[20px] font-medium leading-6 tracking-[normal] text-cobalt-20">{k}</dt>
                          <dd className="text-[20px] font-medium leading-6 tracking-[-0.2px] text-white">{v}</dd>
                        </div>
                      ))}
                  </dl>
                </div>
              )}
              <div className="bg-white px-8 pb-9 pt-8 max-md:border-b max-md:border-cobalt-20 md:pb-2">
                <Prose blocks={body} className={`gated-prose ${kind === 'podcast' ? 'is-podcast' : ''}`} />
                {faq && <Faq compact items={faq} className="mb-6 lg:max-w-[428px]" />}
              </div>
              {speakers?.length > 0 && (
                // measured (events): padding 24 34; mono "speakers" eyebrow; rows gap 48, each a 159px square photo + text (gap 24; stacked at 390)
                <div className="bg-white px-[34px] py-6">
                  <p className="font-mono text-xs leading-[13px] tracking-[normal] text-cobalt md:text-sm md:leading-5">speakers</p>
                  <div className="flex flex-col gap-12">
                    {speakers.map((sp, i) => (
                      <div key={sp.name} className="flex flex-col gap-6 md:flex-row">
                        <div className="h-[159px] w-[159px] shrink-0 overflow-hidden">
                          <Media slot={`gated.speaker.${i}`} tone="cool" className="h-full w-full" alt="Speaker photo placeholder" />
                        </div>
                        <div className="max-w-[350px]">
                          <p className="mb-2 text-[22px] font-semibold leading-[13px] tracking-[normal] text-cobalt md:leading-5">{sp.name}</p>
                          <p className="mb-5 text-base font-medium leading-[22px] tracking-[normal] text-ink-secondary">{sp.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="pointer-events-none absolute inset-x-0 top-full h-[60px]" aria-hidden="true" style={{ background: 'linear-gradient(#fff, transparent)' }} />
            </article>

            {/* Right column: form-wrapper */}
            <div className={`border-cobalt-20 bg-white px-8 pb-12 ${isEvent ? 'border max-md:border-t-0 lg:border-l-0' : 'border max-md:border-t-0 lg:border-r-0'}`}>
              <div className="-mx-8 hidden aspect-[560/293] md:block">
                <Media slot={form.imageSlot ?? `gated.${kind}.cover`} tone="cool" className="h-full w-full" />
              </div>
              <h2 className="mb-9 pt-8 text-[25px] font-medium leading-[28.75px] tracking-[-0.75px] text-cobalt md:text-3xl md:leading-[32.2px] md:tracking-[-0.84px]">{form.title ?? 'Download the guide'}</h2>
              <HubspotForm fields={fields} submitLabel={form.submitLabel ?? 'Get your guide'} />
            </div>
          </div>
        </div>
        <div className="h-32" aria-hidden="true" />
      </div>

      {related?.length > 0 && (
        <div className="border-b border-cobalt-30" style={{ background: `linear-gradient(${bg}, #fff)` }}>
          <PageLinks title={relatedTitle} cards={related} />
        </div>
      )}
    </>
  )
}
