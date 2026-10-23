import './primitives.css'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Media from '../components/Media.jsx'
import { href } from '../routing.js'
import { EASE, KEEN_MS, useVisibleRatio } from '../motion.js'
import { Arrow24, SmallArrow } from './icons.jsx'

// §4.6 PageLinks.default ("Additional resources"). cards: [{path, eyebrow, title, slot, tone}]
// Slider: 371-wide cards, gap 20, 3 visible (390: 295 wide). Prev/next 32x32 + 8px dots.
export default function PageLinks({ title = 'Additional resources', cards }) {
  const [index, setIndex] = useState(0)
  const max = Math.max(0, cards.length - 1)
  const track = useRef(null)
  const root = useRef(null)
  // measured: IO threshold .25 on the section toggles the reveal both ways (cards fade back out when it drops below .25)
  const inView = useVisibleRatio(root, 0.25)
  const pitch = track.current?.children[1] ? track.current.children[1].offsetLeft - track.current.children[0].offsetLeft : 391
  return (
    <section ref={root} className={`py-16 ${inView ? 'pl-inview' : ''}`}>
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        <h2 className="pb-3 text-[25px] font-medium leading-[28.75px] tracking-[-0.75px] text-cobalt md:text-3xl md:leading-[32.2px] md:tracking-[-0.84px]">{title}</h2>
        <div className="relative overflow-hidden pb-[50px]">
          {/* keen-slider move: 500ms ease-out-quint (EASE.keen), measured on the original's keen sliders */}
          <ul ref={track} className="flex gap-5" style={{ transform: `translateX(${-index * pitch}px)`, transition: `transform ${KEEN_MS}ms ${EASE.keen}` }}>
            {cards.map((c, i) => (
              // Scroll reveal (measured): card opacity 0 -> 1 + translateY(50px) -> 0, .5s cubic-bezier(.215,.61,.355,1);
              // delay --slide-index = .1s on the 2nd card, .2s on the 3rd, 0 otherwise (nth-child rules on the original).
              <li key={c.path} data-reveal="page-link" style={{ '--slide-index': `${i === 1 ? 0.1 : i === 2 ? 0.2 : 0}s` }} className="w-[295px] shrink-0 md:w-[370.67px]">
                <Link to={href(c.path)} className="pl-card pl-reveal group flex h-full flex-col border border-cobalt bg-white">
                  <figure className="aspect-[369/194] border-b border-cobalt">
                    <Media slot={c.slot} tone={c.tone} className="h-full w-full" />
                  </figure>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="mb-3 font-mono text-xs leading-[13px] tracking-[normal] text-cobalt md:text-sm md:leading-5">{c.eyebrow}</p>
                    {/* measured: the title reserves three lines (short titles get the remainder as margin) */}
                    <h3 className="min-h-[86.25px] [overflow-wrap:anywhere] text-[25px] font-medium leading-[28.75px] tracking-[-0.75px] text-midnight md:min-h-[96.6px] md:text-3xl md:leading-[32.2px] md:tracking-[-0.84px]">{c.title}</h3>
                    <span className="pt-8 text-cobalt">
                      <Arrow24 className="nudge" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          {cards.length > 1 && (
            <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-2">
              <button type="button" aria-label="Previous" disabled={index === 0} onClick={() => setIndex((i) => Math.max(0, i - 1))} className="h-8 w-8 text-cobalt disabled:opacity-40">
                <SmallArrow dir="left" />
              </button>
              {cards.map((_, i) => (
                <button key={i} type="button" aria-label={`Go to slide ${i + 1}`} aria-current={i === index} onClick={() => setIndex(i)} className={`h-2 w-2 rounded-full border border-cobalt ${i === index ? 'bg-cobalt' : ''}`} />
              ))}
              <button type="button" aria-label="Next" disabled={index === max} onClick={() => setIndex((i) => Math.min(max, i + 1))} className="h-8 w-8 text-cobalt disabled:opacity-40">
                <SmallArrow />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
