import { useState } from 'react'
import Media from '../components/Media.jsx'
import { Cta, MonoCta } from './ui.jsx'

// §3.34 HeroWithCarousel + HeroFooter (/platform/marketplace). 390 unmeasured: stacked.
export default function HeroWithCarousel({ eyebrow, title, body, button, slides = [], footer }) {
  const [i, setI] = useState(0)
  return (
    <header className="mx-auto max-w-[1176px] border-x border-line-light">
      <div className="grid grid-cols-1 gap-10 px-4 py-12 md:py-16 md:pl-16 md:pr-6 lg:grid-cols-[1fr_502px] lg:gap-12">
        <div className="flex flex-col gap-5">
          <p className="t-eyebrow">{eyebrow}</p>
          <h1 className="text-[36px] font-normal leading-[40px] tracking-[-1.08px] text-midnight md:text-[60px] md:leading-[66px] md:tracking-[-1.8px]">{title}</h1>
          <p className="t-lead">{body}</p>
          <div>
            <Cta {...button} arrow />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {/* MOTION: keen-slider slide change */}
          <Media slot={`product.marketplace.slide.${i}`} tone={['cool', 'warm', 'neutral'][i % 3]} className="aspect-[502/330] w-full" />
          <p className="font-mono text-md font-medium uppercase leading-4 text-cobalt">{slides[i]}</p>
          <div className="flex gap-2">
            {slides.map((s, n) => (
              <button key={s} type="button" aria-label={`Slide ${n + 1}`} onClick={() => setI(n)} className={`h-2 w-2 rounded-full ${n === i ? 'bg-cobalt' : 'bg-cobalt-20'}`} />
            ))}
          </div>
        </div>
      </div>
      {footer && (
        <div className="flex flex-col gap-3 border-t border-line-light px-4 py-6 md:px-16">
          <p className="max-w-[420px] text-md leading-[22px] text-ink-secondary">{footer.text}</p>
          <MonoCta {...footer.link} />
        </div>
      )}
    </header>
  )
}
