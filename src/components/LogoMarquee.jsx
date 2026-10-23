import { useRef } from 'react'
import { Link } from 'react-router-dom'
import PlaceholderLogo, { LOGOS } from './PlaceholderLogo.jsx'
import { EASE, useInView, useSteppedLoop } from '../motion.js'
import { href } from '../routing.js'

// §2.11 Customer logo strip: 35 slides, 128px gap. Static frame only.
const COLOURS = ['#265cff', '#1b7a5a', '#ff6633', '#0b2471', '#1d7368', '#ff9966', '#4a6fff']
const HEIGHTS = [16, 22, 14, 20, 18, 26, 31, 15, 20, 24, 17, 19]
const SLIDES = Array.from({ length: 35 }, (_, i) => ({ logo: LOGOS[i % LOGOS.length], h: HEIGHTS[i % HEIGHTS.length], colour: COLOURS[i % COLOURS.length] }))

// tone: 'light' (homepage, monotone #666c80) | 'dark' (white monotone logos on dark heroes, PAGES_SPEC §3.33).
// `to` = locale-free target of the strip link (the whole strip is one link, §2.11).
export default function LogoMarquee({ tone = 'light', to = '/customers' }) {
  const secRef = useRef(null)
  const trackRef = useRef(null)
  const inView = useInView(secRef)
  // Measured: advances one slide (logo width + gap) every ~2016ms, 1060ms move (EASE.logos), leftward,
  // only while the strip is in the viewport; the first move becomes visible ~950ms after the strip enters view
  // (the curve's flat start accounts for ~100ms, hence 850). Slides repeat every LOGOS.length items.
  useSteppedLoop(trackRef, { interval: 2016, duration: 1060, easing: EASE.logos, period: LOGOS.length, active: inView, firstDelay: 850 })
  return (
    <section ref={secRef} className="pb-[38px] pt-[11px] md:pb-20 md:pt-10">
      <Link to={href(to)} aria-label="See our customers" className="block">
        <div className="h-[23px] overflow-hidden md:h-[31px]" style={{ WebkitMaskImage: 'var(--logo-carousel-mask-image)', maskImage: 'var(--logo-carousel-mask-image)' }}>
          {/* Stepped advance: one slide every 2016ms, 1060ms move (EASE.logos), leftward loop, only in viewport (§3.6) */}
          <div ref={trackRef} className="logo-marquee-track flex h-full items-center gap-32">
            {SLIDES.map((s, i) => (
              <div key={i} className="group relative flex shrink-0 items-center">
                {/* monotone layer: opacity swap .25s ease-in-out on hover */}
                <PlaceholderLogo logo={s.logo} height={s.h} className={`logo-layer max-w-[74px] ${tone === 'dark' ? 'text-white' : 'text-ink-secondary'} opacity-40 group-hover:opacity-0`} />
                {/* colour layer */}
                <PlaceholderLogo logo={s.logo} height={s.h} className="logo-layer absolute left-0 max-w-[74px] opacity-0 group-hover:opacity-100" style={{ color: s.colour }} />
              </div>
            ))}
          </div>
        </div>
      </Link>
    </section>
  )
}
