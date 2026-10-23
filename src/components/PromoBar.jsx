import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { href } from '../routing.js'
import { ChevronLeft, ChevronRightThin, ArrowRight } from './Icons.jsx'
import { EASE, prefersReducedMotion } from '../motion.js'

// §2.1 Promo bar. Offers rotate every 5s (measured 5000ms on the original). Re-measured: the outgoing offer
// travels 0 -> -46px while fading 1 -> 0 and the incoming one travels 46px -> 0 while fading 0 -> 1 (same
// distance at 1440 and 390), 450ms: transform EASE.promo, opacity EASE.promoFade. Static under reduced motion.
// Below 700px the text runs the original's promo-marquee (restarts with each offer, holds still for the first
// 1.68s, then moves linearly); speed pinned to the measured 31.6px/s because the placeholder copy is longer.
const OFFERS = [
  { badge: 'Annual index', text: 'Read the 2026 Northwind benchmark on how teams manage climate data.', link: 'Get the report', to: '/state-of-corporate-sustainability-ai-2026' },
  { badge: 'New feature', text: 'Shared workspaces now let finance and climate teams review data together.', link: 'Learn more', to: '/platform' },
]
const SLIDE_PX = 46
const MARQUEE_HOLD = 1680 // 12% of the original's 14s keyframes
const MARQUEE_SPEED = 0.0316 // px per ms
const MOBILE_Q = '(max-width: 700px)'

export default function PromoBar() {
  const [i, setI] = useState(0)
  const [prev, setPrev] = useState(null) // { i, dir, key, x } outgoing offer while sliding
  const offer = OFFERS[i]
  const curRef = useRef(null)
  const outRef = useRef(null)
  const timer = useRef(null)
  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' && window.matchMedia(MOBILE_Q).matches)
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_Q)
    const on = () => setMobile(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  const go = (d) => {
    // the outgoing copy keeps the marquee offset it had at the moment of the swap (as on the original)
    const inner = curRef.current?.querySelector('.promo-text-inner')
    const x = inner ? new DOMMatrix(getComputedStyle(inner).transform).m41 : 0
    setPrev(prefersReducedMotion() ? null : { i, dir: d, key: Date.now(), x })
    setI((v) => (v + d + OFFERS.length) % OFFERS.length)
  }
  const goRef = useRef(go)
  goRef.current = go

  // autoplay; restarts after a manual change
  useEffect(() => {
    if (prefersReducedMotion()) return undefined
    timer.current = setTimeout(() => goRef.current(1), 5000)
    return () => clearTimeout(timer.current)
  }, [i])

  // mobile marquee, restarted for every offer
  useLayoutEffect(() => {
    const inner = curRef.current?.querySelector('.promo-text-inner')
    if (!inner || !mobile || prefersReducedMotion()) return undefined
    const move = inner.offsetWidth / MARQUEE_SPEED
    const total = MARQUEE_HOLD + move
    const a = inner.animate(
      [{ transform: 'translateX(0)' }, { transform: 'translateX(0)', offset: MARQUEE_HOLD / total }, { transform: 'translateX(-100%)' }],
      { duration: total, iterations: Infinity, easing: 'linear' },
    )
    return () => a.cancel()
  }, [i, mobile])

  useLayoutEffect(() => {
    if (!prev) return undefined
    const s = prev.dir > 0 ? 1 : -1
    const outInner = outRef.current?.querySelector('.promo-text-inner')
    if (outInner && prev.x) outInner.style.transform = `translateX(${prev.x}px)`
    const fade = { duration: 450, easing: EASE.promoFade }
    const move = { duration: 450, easing: EASE.promo }
    outRef.current?.animate([{ transform: 'translateY(0)' }, { transform: `translateY(${-SLIDE_PX * s}px)` }], { ...move, fill: 'forwards' })
    outRef.current?.animate([{ opacity: 1 }, { opacity: 0 }], { ...fade, fill: 'forwards' })
    curRef.current?.animate([{ transform: `translateY(${SLIDE_PX * s}px)` }, { transform: 'translateY(0)' }], move)
    const a = curRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], fade)
    const done = () => setPrev(null)
    if (a) a.onfinish = done
    return () => {
      if (a) a.onfinish = null
    }
  }, [prev])
  return (
    <div className="relative h-10 bg-night">
      <div className="mx-auto flex h-full max-w-container items-center justify-between px-4 md:px-6">
        <button type="button" aria-label="Previous offer" onClick={() => go(-1)} className="group flex h-10 w-4 shrink-0 items-center justify-start pl-px text-promo-muted">
          <ChevronLeft width={7} height={12} className="transition-colors duration-150 group-hover:text-promo-text" />
        </button>
        <div className="relative mx-2 flex min-w-0 flex-1 overflow-hidden">
          <div ref={curRef} className="flex min-w-0 flex-1 items-center justify-center gap-2">
            <OfferContent offer={offer} />
          </div>
          {prev && (
            <div key={prev.key} ref={outRef} aria-hidden="true" className="absolute inset-0 flex items-center justify-center gap-2">
              <OfferContent offer={OFFERS[prev.i]} />
            </div>
          )}
        </div>
        <button type="button" aria-label="Next offer" onClick={() => go(1)} className="group flex h-10 w-4 shrink-0 items-center justify-end pr-px text-promo-muted">
          <ChevronRightThin width={7} height={12} className="transition-colors duration-150 group-hover:text-promo-text" />
        </button>
      </div>
    </div>
  )
}

function OfferContent({ offer }) {
  return (
    <>
            <span className="hidden shrink-0 rounded-btn bg-[rgba(255,175,210,.16)] px-1.5 py-[3px] font-mono text-2xs font-medium leading-[10px] text-promo-badge md:inline-block">
              {offer.badge}
            </span>
            {/* MOTION: below 700px the inner row runs the marquee (WAAPI in PromoBar, §3.11) */}
            <div className="promo-text min-w-0 overflow-hidden">
              <div className="promo-text-inner flex items-center gap-2 whitespace-nowrap">
                <span className="text-xs font-medium leading-[18px] text-promo-text md:text-[13px] md:leading-[19.5px]">{offer.text}</span>
                <Link to={href(offer.to)} className="inline-flex shrink-0 items-center gap-1 font-mono text-[11px] font-medium leading-[16.5px] text-promo-muted underline underline-offset-2 transition-colors duration-150 hover:text-promo-text">
                  {offer.link} <ArrowRight size={9} />
                </Link>
              </div>
            </div>
    </>
  )
}
