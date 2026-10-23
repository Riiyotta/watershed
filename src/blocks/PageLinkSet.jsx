import { useState } from 'react'
import Media from '../components/Media.jsx'
import { DotsNav, Nudge, SmartLink } from './ui.jsx'

// §3.7 PageLinkSet: 3 visible cards (363, pitch 395). >3 cards → prev/next + dots. 390: cards 293, next peeks.
export default function PageLinkSet({ title = 'Additional resources', cards = [], slotPrefix = 'product.pls' }) {
  const [i, setI] = useState(0)
  const pages = Math.max(1, cards.length - 2)
  return (
    // MOTION: IntersectionObserver threshold .25 on the section (no reveal measured)
    // Measured: container padding 24 on all sides (390: 16); title optional (absent on /platform/disclosures/cdp);
    // card copy: eyebrow → title 12, title → CTA 24; eyebrow optional.
    <section className="py-16">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10 p-4 md:p-6">
        {title && <h2 className="b-h4">{title}</h2>}
        <div className="no-scrollbar -mx-4 overflow-x-auto px-4 md:mx-0 md:px-0 lg:overflow-hidden">
          {/* MOTION: keen-slider transform on index change */}
          {/* 1024-1199: three cards share the container (pitch = (track + 32) / 3); >=1200: 363 cards, 395 pitch */}
          <div className="flex gap-8 lg:[transform:translateX(calc((100%+32px)/-3*var(--pli)))] xl:[transform:translateX(var(--plx))]" style={{ '--plx': `${-i * 395}px`, '--pli': i }}>
            {cards.map((c, n) => (
              <SmartLink key={c.title + n} to={c.to} className="group flex w-[293px] shrink-0 flex-col md:w-[363px] lg:w-[calc((100%-64px)/3)] xl:w-[363px]">
                {/* MOTION: cardInner bg #fff .2s ease-in-out on hover */}
                <span className="flex flex-col bg-transparent group-hover:bg-white">
                  <Media slot={`${slotPrefix}.${n}`} tone={['cool', 'neutral', 'warm'][n % 3]} className="aspect-[363/204] w-full rounded-card" />
                  <span className="flex flex-col items-start pt-4">
                    {c.eyebrow && <span className="mb-3 font-mono text-[13px] font-normal leading-[13px] tracking-[normal] text-cobalt">{c.eyebrow}</span>}
                    <span className="text-[20px] font-medium leading-[22px] tracking-[-0.6px] text-ink">{c.title}</span>
                    <span className="mt-6 flex items-center gap-2 text-md font-medium leading-[19.2px] tracking-[-0.16px] text-cobalt">
                      {c.cta ?? 'Learn more'}
                      <Nudge group />
                    </span>
                  </span>
                </span>
              </SmartLink>
            ))}
          </div>
        </div>
        {cards.length > 3 && (
          <div className="hidden lg:block">
            <DotsNav index={i} count={pages} setIndex={setI} />
          </div>
        )}
      </div>
    </section>
  )
}
