import { useEffect, useRef, useState } from 'react'

// Easing curves sampled frame-by-frame from the original (watershed.com/en-GB) and encoded as CSS linear().
// Each list is the normalised progress at evenly spaced time steps across the stated duration.
export const EASE = {
  // keen-slider auto-advance, awards badges: 860ms symmetric S-curve, step (viewport+16)/2.5 = 149.6 / 148.8px.
  // Re-sampled on the original: threshold crossings (.01->.5 312ms, .1->.9 332ms, .001->.999 783ms) match this curve.
  awards:
    'linear(0, 0.002, 0.004, 0.009, 0.016, 0.028, 0.043, 0.064, 0.094, 0.131, 0.178, 0.238, 0.31, 0.399, 0.506, 0.61, 0.696, 0.767, 0.825, 0.872, 0.909, 0.936, 0.958, 0.973, 0.984, 0.991, 0.995, 0.998, 0.999, 1, 1)',
  // customer logo strip step: 1060ms (re-sampled: matches the original's 0.001->0.999 span of ~933ms, .5 @~467ms after onset)
  logos:
    'linear(0, 0, 0, 0.001, 0.002, 0.006, 0.011, 0.019, 0.032, 0.048, 0.072, 0.105, 0.146, 0.198, 0.264, 0.346, 0.442, 0.556, 0.653, 0.734, 0.8, 0.853, 0.896, 0.927, 0.951, 0.969, 0.981, 0.989, 0.994, 0.998, 1)',
  // promo offer opacity (incoming 0->1; outgoing uses 1 - this), sampled on the original, 450ms
  promoFade:
    'linear(0, 0.02 9%, 0.06 18%, 0.17 27.5%, 0.27 36%, 0.38 45%, 0.57 54%, 0.69 63%, 0.85 73%, 0.92 82%, 0.97 91%, 1)',
  // promo offer slide transform (framer-motion spring): 450ms, 46px travel
  promo:
    'linear(0, 0.127, 0.334, 0.497, 0.638, 0.728, 0.8, 0.848, 0.89, 0.917, 0.937, 0.955, 0.966, 0.976, 0.983, 0.988, 0.992, 0.995, 0.997, 0.998, 0.999, 1, 1, 1, 1)',
  // feature carousel arrow click: 420ms (re-sampled: within 2ms of the original at every threshold)
  feature:
    'linear(0, 0.159, 0.305, 0.425, 0.53, 0.614, 0.691, 0.753, 0.806, 0.848, 0.883, 0.911, 0.933, 0.951, 0.965, 0.975, 0.983, 0.989, 0.993, 0.996, 0.998, 0.999, 0.999, 1, 1)',
  // mobile product step track (native smooth scroll on the original): 265ms
  track: 'linear(0, 0.015, 0.066, 0.186, 0.403, 0.603, 0.719, 0.798, 0.857, 0.899, 0.929, 0.951, 0.969, 0.983, 0.993, 0.997, 1)',
  // keen-slider default move (inner pages: /customers featured stories + quotes, PageLinks): 500ms, 1 - (1 - t)^5.
  // Traced on the original quote carousel: first frame 15.5% at ~17ms, 912px settles at ~485ms.
  keen: 'linear(0, 0.1559, 0.2918, 0.4095, 0.5111, 0.5981, 0.6723, 0.7351, 0.7879, 0.8319, 0.8683, 0.8981, 0.9222, 0.9416, 0.9568, 0.9688, 0.9779, 0.9847, 0.9898, 0.9934, 0.9959, 0.9976, 0.9987, 0.9993, 0.9997, 0.9999, 1, 1, 1, 1, 1)',
  // framer-motion "easeIn" (the original's WAAPI linear() for the /customers logo grid matches it at every sample)
  easeIn: 'cubic-bezier(0.42, 0, 1, 1)',
  // framer-motion "easeOut" (customers logo grid hover colour layer, 250ms)
  easeOut: 'cubic-bezier(0, 0, 0.58, 1)',
}

// Inner-page timings measured on the original (PAGES_SPEC §5 re-checked).
export const KEEN_MS = 500

// true while at least `threshold` of the element is visible; flips back to false when it drops below
// (the original's PageLinks .inView class and FeaturedCarousel autoplay gate behave this way).
export function useVisibleRatio(ref, threshold) {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting && e.intersectionRatio >= threshold - 0.001), { threshold: [0, threshold] })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, threshold])
  return on
}

// Cursor position relative to the element, written to CSS custom properties (--mx / --my, px) on mousemove.
// Used for the radial highlights that follow the mouse (/customers grid cells, /lp hero).
export function trackPointer(e) {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  el.style.setProperty('--mx', `${e.clientX - r.left}px`)
  el.style.setProperty('--my', `${e.clientY - r.top}px`)
}

const RM_QUERY = '(prefers-reduced-motion: reduce)'

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia(RM_QUERY).matches
}

export function useReducedMotion() {
  const [rm, setRm] = useState(prefersReducedMotion)
  useEffect(() => {
    const mq = window.matchMedia(RM_QUERY)
    const on = () => setRm(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return rm
}

// true while any part of the element is inside the viewport
export function useInView(ref, rootMargin = '0px') {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, rootMargin])
  return inView
}

// Stepped auto-advance loop (keen-slider style) for a flex track whose children repeat every `period` items.
// Every `interval` ms the track moves to the next child (distance read from the DOM, so it works for both
// the vertical desktop and horizontal mobile layouts) over `duration` ms with `easing`; after `period` steps
// it snaps back to 0 with no transition (visually identical frame). Pauses while `active` is false.
// `firstDelay` (default `interval`) is the wait before the first step each time the loop (re)activates.
export function useSteppedLoop(trackRef, { interval, duration, easing, period, vertical = () => false, active = true, firstDelay = interval }) {
  const kRef = useRef(0)
  useEffect(() => {
    const track = trackRef.current
    if (!track || !active || prefersReducedMotion()) return undefined
    let snapTimer = 0
    const place = (k, animate) => {
      const v = vertical()
      const a = track.children[0]
      const b = track.children[k]
      if (!a || !b) return
      // subpixel distance (offsetTop/Left round to whole px; the awards pitch is 149.6 / 148.8)
      const ra = a.getBoundingClientRect()
      const rb = b.getBoundingClientRect()
      const d = +(v ? rb.top - ra.top : rb.left - ra.left).toFixed(3)
      track.style.transition = animate ? `transform ${duration}ms ${easing}` : 'none'
      track.style.transform = d ? (v ? `translate3d(0, ${-d}px, 0)` : `translate3d(${-d}px, 0, 0)`) : ''
    }
    const step = () => {
      kRef.current += 1
      place(kRef.current, true)
      if (kRef.current >= period) {
        snapTimer = setTimeout(() => {
          kRef.current = 0
          place(0, false)
        }, duration + 20)
      }
    }
    // re-derive the offset when the layout flips between vertical/horizontal
    const onResize = () => place(kRef.current, false)
    window.addEventListener('resize', onResize)
    let iv = 0
    const first = setTimeout(() => {
      step()
      iv = setInterval(step, interval)
    }, firstDelay)
    return () => {
      clearTimeout(first)
      clearInterval(iv)
      clearTimeout(snapTimer)
      window.removeEventListener('resize', onResize)
    }
  }, [trackRef, interval, duration, easing, period, vertical, active, firstDelay])
}
