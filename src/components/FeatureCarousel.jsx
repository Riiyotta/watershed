import { useRef, useState } from 'react'
import { ArrowCircle } from './Icons.jsx'
import { EASE, prefersReducedMotion } from '../motion.js'
import Media from './Media.jsx'

// §2.6 Feature carousel. Index state only; slide motion is for Animation (§3.8).
const SLIDES = [
  { title: 'Data intake', desc: 'Load and organise records quickly with built-in file parsing and task tracking.', slot: 'home.feature.0' },
  { title: 'Cleaning and checks', desc: 'Automatic outlier detection and consistent formatting for every data source.', slot: 'home.feature.1' },
  { title: 'Mapping and methods', desc: 'Adjust category mapping and calculation methods to suit any measurement.', slot: 'home.feature.2' },
  { title: 'Analysis', desc: 'Find the biggest drivers in your footprint and see how each change affects it.', slot: 'home.feature.3' },
  { title: 'Review and sign-off', desc: 'Route numbers to approvers with comments, history and a clear audit trail.', slot: 'home.feature.4' },
]

// Props (all optional; defaults = homepage §2.6). MicroFeatureCarousel (PAGES_SPEC §0, §3.8):
//   title: H2; subhead: 20/30 lead under the H2 (max-width 720, gap 24)
//   slides: [{ title, desc?, tint? | slot?, tone? }]
//     desc omitted -> card 384x346 (390: 323x310) instead of 384x375 (323x334)
//     tint = Tailwind gradient classes for the placeholder image; slot/tone = Media slot (when no tint)
//   fluidHeader: block header (inner pages, measured): row gap 48 (390: 16); the H2/subhead column always wraps the H2
//     and flexes (min-width 0) so the H2 can reach 1152
//   autoHeight: description cards grow with their copy (min 384x375, 390: 323x334) instead of a fixed height
// With 3 or fewer slides everything fits at 1440, so the arrows are hidden from lg up (measured on /platform/act).
export default function FeatureCarousel({ title, subhead, slides = SLIDES, fluidHeader = false, autoHeight = false }) {
  const MAX = slides.length - 1
  const [index, setIndex] = useState(0)
  // Drag/swipe (keen-slider on the original): follow the pointer 1:1, release snaps by whole slides.
  const [drag, setDrag] = useState(0)
  const dragRef = useRef(null)
  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    dragRef.current = { x: e.clientX, y: e.clientY, t: performance.now(), on: false, id: e.pointerId }
  }
  const onPointerMove = (e) => {
    const d = dragRef.current
    if (!d) return
    const dx = e.clientX - d.x
    if (!d.on) {
      if (Math.abs(dx) < 5 || Math.abs(dx) < Math.abs(e.clientY - d.y)) return
      d.on = true
      e.currentTarget.setPointerCapture(d.id)
    }
    // rubber-band at the ends
    const edge = (index === 0 && dx > 0) || (index === MAX && dx < 0)
    setDrag(edge ? dx / 3 : dx)
  }
  const onPointerUp = (e) => {
    const d = dragRef.current
    dragRef.current = null
    if (!d || !d.on) return
    const dx = e.clientX - d.x
    // --slide-pitch is a length (mobile/md/>=1280) or, 1024-1279, a % of the track (slides = 1/3 of it)
    const raw = getComputedStyle(e.currentTarget).getPropertyValue('--slide-pitch')
    const track = e.currentTarget.firstElementChild
    const pitch = (raw.includes('%') ? (track.offsetWidth * parseFloat(raw)) / 100 : parseFloat(raw)) || 384
    const v = dx / Math.max(1, performance.now() - d.t) // px/ms
    let n = Math.round(-dx / pitch)
    if (n === 0 && (Math.abs(dx) > 40 || Math.abs(v) > 0.3)) n = dx < 0 ? 1 : -1
    setIndex((i) => Math.min(MAX, Math.max(0, i + n)))
    setDrag(0)
  }
  const dragging = drag !== 0
  const atStart = index === 0
  const atEnd = index === MAX

  return (
    <section className="py-12 md:py-[88px] lg:py-[72px] wide:py-[88px]">
      <div className={`container-ws flex items-end justify-between ${fluidHeader ? 'gap-4 md:gap-12 ' : title || subhead ? 'gap-6 ' : ''}px-2 md:px-6 lg:px-5 wide:px-6`}>
        {subhead || fluidHeader ? (
          <div className={`flex flex-col gap-4 md:gap-6 ${fluidHeader ? 'min-w-0 flex-1' : ''}`}>
            <h2 className="t-h2">{title}</h2>
            {subhead && <p className="t-lead max-w-[720px]">{subhead}</p>}
          </div>
        ) : (
          <h2 className={`t-h2 ${title ? '' : 'w-[271px] md:w-auto'}`}>{title ?? 'Find value in every part of the workflow'}</h2>
        )}
        <div className={`flex shrink-0 gap-[7px] md:gap-[10px] ${slides.length <= 3 ? 'lg:hidden' : ''}`}>
          <button
            type="button"
            aria-label="Previous slide"
            disabled={atStart}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            className={`h-10 w-10 transition-opacity duration-200 ${atStart ? 'text-cobalt-20 opacity-40' : 'text-cobalt-40 hover:opacity-75'}`}
          >
            <ArrowCircle dir="left" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            disabled={atEnd}
            onClick={() => setIndex((i) => Math.min(MAX, i + 1))}
            className={`h-10 w-10 transition-opacity duration-200 ${atEnd ? 'text-cobalt-20 opacity-40' : 'text-cobalt-40 hover:opacity-75'}`}
          >
            <ArrowCircle dir="right" />
          </button>
        </div>
      </div>

      {/* Full-bleed track wrapper with 64px edge mask */}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="feature-track-wrap mt-[27px] cursor-grab touch-pan-y select-none active:cursor-grabbing overflow-hidden px-2 md:mt-12 md:px-[max(24px,calc((100%-1152px)/2))] lg:mt-10 lg:px-5 wide:mt-12 wide:px-[max(24px,calc((100%-1152px)/2))]"
        style={{
          WebkitMaskImage: 'linear-gradient(90deg, transparent 0, #000 64px, #000 calc(100% - 64px), transparent 100%)',
          maskImage: 'linear-gradient(90deg, transparent 0, #000 64px, #000 calc(100% - 64px), transparent 100%)',
        }}
      >
        {/* Slide motion: 420ms sampled curve; drag/swipe via pointer events above */}
        <div className="feature-track flex gap-4 md:gap-0" style={{
            transform: `translateX(calc(var(--slide-pitch) * ${-index} + ${drag}px))`,
            // measured: 0 -> -384px in ~420ms, strong ease-out (EASE.feature)
            transition: dragging || prefersReducedMotion() ? 'none' : `transform 420ms ${EASE.feature}`,
          }}
        >
          {slides.map((s, i) => (
            <article
              key={s.title}
              className={`flex ${s.desc ? (autoHeight ? 'min-h-[334px] md:min-h-[375px]' : 'h-[334px] md:h-[375px]') : 'h-[310px] md:h-[346px]'} w-[323px] shrink-0 flex-col gap-4 border border-line bg-white p-4 md:gap-6 md:w-96 md:p-6 lg:w-1/3 wide:w-96 ${i > 0 ? 'md:border-l-0' : ''}`}
            >
              <div className="flex flex-col gap-[5px] md:gap-2">
                <h3 className="text-md font-medium leading-[18.72px] tracking-[-0.6px] text-ink md:text-xl md:leading-[24.57px]">{s.title}</h3>
                {s.desc && <p className="text-md font-normal leading-[22.4px] tracking-[-0.32px] text-ink-secondary">{s.desc}</p>}
              </div>
              {s.tint || !s.slot ? (
                <div className={`mt-auto h-[193px] w-full shrink-0 overflow-hidden border border-line-light bg-gray-20 bg-gradient-to-br md:h-[223px] ${s.tint ?? ''}`} role="img" aria-label="Product screenshot placeholder" />
              ) : (
                <Media slot={s.slot} tone={s.tone ?? (i % 2 ? 'neutral' : 'cool')} className="mt-auto h-[193px] w-full shrink-0 border border-line-light md:h-[223px]" />
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
