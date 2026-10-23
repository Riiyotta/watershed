import { useState } from 'react'
import Media from '../components/Media.jsx'
import { Cta, MonoCta } from './ui.jsx'

// §3.4 TextWithImage. Default: image left; `rightAligned`: image right. 390: text first, image after, x 8.
// `ratio` = the image's natural aspect (w/h); the media box is the image plus a 5px inline-image gap (552x552 → 557, 4:3 → 552x414 in a 419 box).
export default function TextWithImage({ eyebrow, title, body, items, cta, rightAligned = false, ratio = 1, bullets, link, slot = 'product.twi.0', tone = 'cool' }) {
  const [active, setActive] = useState(0)
  return (
    // MOTION: IntersectionObserver threshold .3 per section (no visual change measured)
    <section className="py-[43px] md:py-section">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-4 px-2 md:px-6 lg:grid-cols-2 lg:gap-12">
        <div className={`flex max-w-[520px] flex-col justify-center gap-[21px] md:gap-8 ${rightAligned ? '' : 'lg:order-2'}`}>
          {eyebrow && <p className="t-eyebrow">{eyebrow}</p>}
          <h2 className="t-h2">{title}</h2>
          <p className="t-body-lg">{body}</p>
          {items && (
            <ul className="flex flex-col gap-[11px] border-l border-cobalt-30 pl-2 md:gap-4 md:pl-3">
              {items.map((it, i) => (
                <li key={it}>
                  {/* Clickable highlight; no auto-cycling observed. MOTION: color .4s cubic-bezier(.4,0,.2,1) */}
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    aria-pressed={active === i}
                    className={`w-full text-left text-[13px] font-semibold leading-[15.6px] !tracking-[normal] md:text-md md:leading-[19.2px] ${active === i ? 'text-ink' : 'text-ink-secondary'}`}
                  >
                    {it}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {/* /platform variant: plain bullet list (ul padding-left 22, li 16/24 500 #666c80, gap 8) + cta-link-mono */}
          {bullets && (
            <ul className="flex list-disc flex-col gap-2 pl-[22px] marker:text-midnight">
              {bullets.map((it) => (
                <li key={it} className="text-[14px] font-medium leading-[21px] tracking-[-0.14px] text-ink-secondary md:text-md md:leading-6 md:tracking-[-0.16px]">
                  {it}
                </li>
              ))}
            </ul>
          )}
          {link && (
            <div>
              <MonoCta {...link} />
            </div>
          )}
          {cta && (
            <div>
              <Cta {...cta} arrow />
            </div>
          )}
        </div>
        <div className={`w-full rounded-btn pb-[5px] ${rightAligned ? '' : 'lg:order-1'}`}>
          <Media slot={slot} tone={tone} fit="contain" className="w-full rounded-btn" style={{ aspectRatio: String(ratio) }} />
        </div>
      </div>
    </section>
  )
}
