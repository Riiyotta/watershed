import './primitives.css'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Media from '../components/Media.jsx'
import { ArrowCircle } from '../components/Icons.jsx'
import { href } from '../routing.js'
import { useReducedMotion, useVisibleRatio } from '../motion.js'
import { PauseGlyph, PlayTriangle } from './icons.jsx'

// §4.3 ContentHero + FeaturedCarousel (/blog, /guides, /events). slides: [{path, title, date, excerpt, slot, tone}]
// Motion, measured on the original (watershed.com/en-GB/blog):
//  - autoplay: the current dot's fill runs @keyframes fcProgress (scaleX 0 -> 1, linear, 6000ms); its end advances
//    the slide (wrapping last -> first). It runs only while playing AND >= 40% visible (IO .4) AND the carousel is
//    neither hovered nor focus-within; otherwise it pauses in place (data-state="paused").
//  - pause button -> stopped: fill shows full (data-state="static"); play -> restarts the fill from 0.
//  - any dot/arrow click stops autoplay (static). Arrows clamp and disable at the ends.
//  - slide change: media opacity 0 -> 1 .6s ease (outgoing holds 1 for .6s, then drops); content opacity .45s ease .2s +
//    translateY(8px) -> 0 .6s cubic-bezier(.22,1,.36,1) .2s (outgoing: opacity .2s, transform snaps after .2s);
//    current dot track width .3s ease.
//  - prefers-reduced-motion: no autoplay, no play/pause button, no transitions (as the original).
const AUTOPLAY_MS = 6000

export default function FeaturedCarousel({ title, slides }) {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [run, setRun] = useState(0) // bumps to restart the fill animation
  const [hover, setHover] = useState(false)
  const [focus, setFocus] = useState(false)
  const root = useRef(null)
  const visible = useVisibleRatio(root, 0.4)
  const n = slides.length
  const autoplay = playing && !reduced
  const fillState = !autoplay ? 'static' : visible && !hover && !focus ? 'running' : 'paused'
  const go = (i) => {
    setPlaying(false)
    setIndex(Math.max(0, Math.min(n - 1, i)))
  }
  return (
    <section className="-mt-[68px] bg-gray-10 pb-8 pt-[132px] md:pb-12 md:pt-[164px]">
      <div className="container-ws flex flex-col gap-8 md:gap-12">
        <h1 className="text-4xl font-medium leading-8 tracking-[-0.96px] text-ink md:text-7xl md:leading-[48px] md:tracking-[-1.44px]">{title}</h1>
        <div
          ref={root}
          data-autoplay={autoplay ? 'on' : 'off'}
          data-carousel="featured"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onFocus={() => setFocus(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setFocus(false)
          }}
        >
          {/* Track: slides stacked in one grid cell */}
          <div className="grid">
            {slides.map((s, i) => (
              <Link
                key={s.path}
                to={href(s.path)}
                aria-hidden={i !== index}
                tabIndex={i === index ? 0 : -1}
                className={`fc-slide group col-start-1 row-start-1 grid grid-cols-1 items-center gap-4 lg:grid-cols-2 lg:gap-12 xl:grid-cols-[552px_552px] ${i === index ? 'is-current' : ''}`}
              >
                <div className="fc-media aspect-video w-full overflow-hidden rounded-btn bg-gray-20 xl:h-[311px]">
                  <Media slot={s.slot} tone={s.tone} className="h-full w-full" />
                </div>
                <div className="fc-content flex flex-col gap-4 md:gap-6">
                  <p className="font-mono text-xs font-medium leading-[15px] tracking-[normal] text-ink-secondary md:text-sm md:leading-[17.5px]">{s.date}</p>
                  <h2 className="fc-title [overflow-wrap:anywhere] text-2xl font-medium leading-[30px] tracking-[-0.72px] text-ink md:text-5xl md:leading-[45px] md:tracking-[-1.08px]">{s.title}</h2>
                  {s.excerpt && <p className="text-sm font-medium leading-[21px] text-ink-secondary md:text-lg md:leading-[27px]">{s.excerpt}</p>}
                </div>
              </Link>
            ))}
          </div>
          <div className="flex items-center justify-between gap-[11px] pt-[11px] md:gap-4 md:pt-4">
            <div className="flex items-center gap-[3px] md:gap-1">
              <div className="contents">
                {slides.map((s, i) => (
                  <button key={s.path} type="button" aria-label={`Show slide ${i + 1}`} aria-current={i === index} onClick={() => go(i)} className="fc-dot-btn flex h-4 items-center px-[3px] md:h-6 md:px-1">
                    <span className={`fc-dot ${i === index ? 'is-current' : ''}`}>
                      {i === index && (
                        <span
                          key={`${index}-${run}`}
                          className="fc-fill"
                          data-state={fillState}
                          style={{ '--autoplay-duration': `${AUTOPLAY_MS}ms` }}
                          onAnimationEnd={() => setIndex((k) => (k + 1) % n)}
                        />
                      )}
                    </span>
                  </button>
                ))}
              </div>
              {!reduced && (
                <button
                  type="button"
                  aria-label={playing ? 'Pause autoplay' : 'Play autoplay'}
                  onClick={() => {
                    if (!playing) setRun((r) => r + 1)
                    setPlaying((p) => !p)
                  }}
                  className="ml-[3px] flex h-4 w-4 items-center justify-center rounded-btn md:ml-1 md:h-6 md:w-6"
                >
                  {playing ? <PauseGlyph /> : <PlayTriangle size={12} className="text-ink-secondary" />}
                </button>
              )}
            </div>
            <div className="flex">
              <button type="button" aria-label="Previous slide" disabled={index === 0} onClick={() => go(index - 1)} className={`${index === 0 ? 'text-line' : 'text-cobalt hover:text-cobalt-100'}`}>
                <ArrowCircle dir="left" />
              </button>
              <button type="button" aria-label="Next slide" disabled={index === n - 1} onClick={() => go(index + 1)} className={`${index === n - 1 ? 'text-line' : 'text-cobalt hover:text-cobalt-100'}`}>
                <ArrowCircle />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
