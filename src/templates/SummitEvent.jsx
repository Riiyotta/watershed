import Media from '../components/Media.jsx'
import { FIELDSETS, HubspotForm, Prose } from '../primitives/index.js'

// §3.34 SummitEventTemplate (summit / climate-week style event pages). Measured against /events/2023-climate-week.
// props: { title, kicker, dateLines:[string], body (Prose blocks), speakers:[{name, role}], sessions:[{time, title, desc}] }
//
// 1440: band padding 64 0 (#fffbf2 + illustration); hero section margin-top 64, padding 24, grid 595/397 gap 112;
//       speakers/sessions: section padding 48 12 > white card (radius 2, padding 48), h2 48/56.16 -1.44, mb 48.
// 390:  hero margin-top 40, padding 16, single column; cards padding 48 32; h2 32/37.44 -0.96.
const SECTION = 'mx-auto w-full max-w-[1152px] px-3 py-12'
const CARD = 'rounded-btn bg-white px-8 py-12 md:p-12'
const H2 = 'mb-12 text-[32px] font-medium leading-[37.44px] tracking-[-0.96px] text-ink md:text-7xl md:leading-[56.16px] md:tracking-[-1.44px]'

export default function SummitEvent({ title, kicker, dateLines, body, speakers, sessions }) {
  const [day, ...rest] = dateLines
  return (
    <div className="relative overflow-hidden bg-[#fffbf2] py-16">
      {/* 1800x2000 background illustration -> placeholder */}
      <Media slot="summit.illustration" tone="warm" className="pointer-events-none absolute left-1/2 top-0 h-[2000px] w-[1800px] max-w-none -translate-x-1/2 opacity-40" />
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />
      <div className="relative">
        {/* Hero */}
        <section className="mx-auto mt-10 grid max-w-[1152px] grid-cols-1 items-start p-4 md:mt-16 md:p-6 lg:grid-cols-[595px_397px] lg:gap-[112px]">
          <div>
            {/* The event wordmark is an image on the real site (598x178); a text wordmark stands in, in the same box. */}
            <div className="mb-[45px] flex h-[112px] flex-col justify-center lg:h-[182px]">
              <p className="font-mono text-2xl uppercase leading-8 tracking-[0.12em] text-ink-secondary md:text-[40px] md:leading-[44px]">{kicker}</p>
              <h1 className="font-mono text-[44px] font-medium uppercase leading-[1] tracking-[0.12em] text-poppy md:text-[72px]">{title}</h1>
            </div>
            <p
              className="mb-5 font-mono text-[20px] font-medium leading-[30px] tracking-[normal] text-midnight"
              style={{
                backgroundImage: 'linear-gradient(150deg, #ff6633 0%, #6083eb 48.96%, #93aeff 63.54%, #ff6633 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {day}
              <span className="block leading-[26px] tracking-[-0.2px]">
                {rest.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </span>
            </p>
            <div className="mt-6 px-[5px] py-[30px] md:px-0 md:pb-0 md:pt-12">
              <Prose blocks={body} className="!text-midnight [&_p]:!text-midnight" />
            </div>
          </div>
          <div className="max-w-full bg-white px-[30px] py-9 md:max-w-[480px] md:p-9">
            <h2 className="text-[25px] font-medium leading-[28.75px] tracking-[-0.75px] text-cobalt md:text-3xl md:leading-[32.2px] md:tracking-[-0.84px]">Join the waitlist</h2>
            <p className="mb-5 mt-3 text-xs font-medium leading-[18px] tracking-[-0.12px] text-[#415591]">The event is at capacity. Add your name and we will let you know if a space opens up.</p>
            <HubspotForm fields={FIELDSETS.waitlist} submitLabel="Submit" />
          </div>
        </section>

        {/* Speakers: 4 x 240, gap 24 (390: 1 column) */}
        <section className={SECTION}>
          <div className={CARD}>
            <h2 className={H2}>Speakers</h2>
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[repeat(4,240px)]">
              {speakers.map((s, i) => (
                <li key={i} className="flex flex-col">
                  <Media slot={`summit.speaker.${i}`} tone={i % 2 ? 'warm' : 'cool'} className="aspect-square w-full" />
                  <h3 className="mb-2 mt-7 text-[20px] font-normal leading-[22px] tracking-[-0.6px] text-poppy">{s.name}</h3>
                  <p className="mb-5 text-base font-medium leading-[22px] tracking-[normal] text-ink-secondary">{s.role}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Sessions: rows margin-top 60, padding-bottom 48, rule #e6ebf5 (none on the last) */}
        <section className={SECTION}>
          <div className={CARD}>
            <h2 className={H2}>Sessions</h2>
            <ul>
              {sessions.map((s, i) => (
                <li key={i} className={`mt-[60px] flex flex-col md:flex-row ${i < sessions.length - 1 ? 'border-b border-line-light pb-12' : ''}`}>
                  <span className="mb-4 self-start whitespace-nowrap bg-cobalt-10 px-4 py-1 font-mono text-xs leading-[13px] tracking-[normal] text-[#415591] md:mr-[72px] md:text-sm md:leading-5">{s.time}</span>
                  <div className="md:flex-1">
                    <h3 className="mb-5 mt-6 text-[38px] font-normal leading-[41.8px] tracking-[-1.14px] text-poppy md:-mt-[7.2px] md:text-7xl md:leading-[52.8px] md:tracking-[-1.44px]">{s.title}</h3>
                    <p className="mb-5 text-[20px] font-medium leading-[30px] tracking-[-0.2px] text-ink-secondary">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Closing CTA: margin 48 auto, padding 24 (390: 16); bordered translucent wrapper */}
        <section className="mx-auto my-12 max-w-[1152px] p-4 md:p-6">
          <div className="flex flex-col items-start gap-6 border border-cobalt-30 bg-white/50 p-6 md:flex-row md:items-center md:justify-between md:px-12 md:py-10">
            <div>
              <h3 className="text-[30px] font-medium leading-[33px] tracking-[-0.9px] text-ink-secondary md:text-[35px] md:leading-[38.5px] md:tracking-[-1.05px]">Can’t make it in person? Join the waitlist for the recording.</h3>
              <p className="mt-[14px] text-[20px] font-medium leading-[30px] tracking-[-0.2px] text-ink-secondary">{dateLines.join(' | ')}</p>
            </div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                window.scrollTo({ top: 0 })
              }}
              className="inline-flex h-10 shrink-0 items-center rounded-btn bg-poppy px-[11px] text-[13px] font-medium leading-[19.5px] tracking-[-0.13px] text-white md:h-[47px] md:px-4 md:text-base md:leading-6 md:tracking-[-0.16px]"
            >
              Register
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
