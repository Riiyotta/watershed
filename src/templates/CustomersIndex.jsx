import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Media from '../components/Media.jsx'
import PlaceholderLogo, { LOGOS } from '../components/PlaceholderLogo.jsx'
import { ArrowRight } from '../components/Icons.jsx'
import { href, isExternal } from '../routing.js'
import { EASE, KEEN_MS, prefersReducedMotion, trackPointer, useInView } from '../motion.js'
import { CTABar, PlayTriangle, SelectField, SmallArrow } from '../primitives/index.js'
import { CUSTOMER_GRID, FEATURED_STORIES, INDUSTRIES, REGIONS, TYPES } from '../content/customers.js'

const RULE = 'border-cobalt-30'

// §4.2 /customers
export default function CustomersIndex() {
  return (
    <>
      <Hero />
      <LogoGrid />
      <FeaturedStories />
      <AllCustomers />
      <QuoteCarousel />
      <CTABar title="See it in action" />
    </>
  )
}

// Band: solid bottom rule; the frame's vertical rules are dashed (measured).
function Frame({ children, className = '', inner = '' }) {
  return (
    <div className={`border-b ${RULE} ${className}`}>
      <div className="container-ws">
        <div className={`border-x border-dashed ${RULE} ${inner}`}>{children}</div>
      </div>
    </div>
  )
}

function Hero() {
  // measured: 390 = header padding 48 0, no side rules, text then a 358x269 media; 1440 = text bottom-aligned (eyebrow margin-top auto)
  return (
    <div className={`border-b ${RULE} py-12 lg:py-0`}>
      <div className="container-ws">
      <div className={`grid grid-cols-1 lg:grid-cols-3 lg:border-l lg:border-dashed ${RULE}`}>
        <div className="flex flex-col pb-12 lg:col-span-2 lg:p-[60px]">
          <p className="text-md font-semibold uppercase leading-[22px] tracking-[-0.16px] text-cobalt lg:mt-auto">Customers</p>
          <h1 className="my-5 font-serif text-[38px] font-medium leading-[41.8px] tracking-[-1.14px] text-midnight md:text-7xl md:leading-[52.8px] md:tracking-[-1.44px]">Climate programmes that deliver measurable results</h1>
          <p className="mb-5 max-w-[720px] text-[20px] font-medium leading-[30px] tracking-[-0.2px] text-ink-secondary">Placeholder copy: teams of every size use Northwind to measure, report and reduce their emissions with data they can stand behind.</p>
        </div>
        <div className="relative h-[269px] bg-white lg:h-[640px]">
          {/* Autoplay preview video replaced by a placeholder (no embed). Play button: background .2s ease-in-out (measured). */}
          <Media slot="customers.hero.video" tone="cool" className="h-full w-full" alt="Video placeholder" />
          <button
            type="button"
            aria-label="Play video"
            className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 md:h-[112px] md:w-[112px] -translate-y-1/2 items-center justify-center border border-white bg-black/[.04] text-white transition-[background-color] duration-200 ease-in-out hover:bg-black/40"
            style={{ backdropFilter: 'blur(4px)' }}
          >
            <PlayTriangle size={48} className="h-6 w-6 md:h-12 md:w-12" />
          </button>
          <div className="absolute inset-x-0 bottom-0 grid h-[63px] grid-cols-2 border-t border-white md:h-[65px]" style={{ backdropFilter: 'blur(20px)' }}>
            {[LOGOS[3], LOGOS[7]].map((l, i) => (
              <div key={l.name} className={`flex items-center justify-center bg-black/[.04] text-white ${i ? 'border-l border-white' : ''}`}>
                <PlaceholderLogo logo={l} height={24} className="max-w-[148px]" />
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

// Logo grid cycle (measured on the original's framer-motion grid, AnimatePresence popLayout):
// every 4000ms every tile swaps. Exit: opacity 1 -> 0, translateY 0 -> -20px, rotateX 0 -> 60deg, 250ms easeIn,
// delay 30ms x index. Enter: opacity 0 -> 1, translateY 10px -> 0, rotateX -60deg -> 0, 400ms easeIn, delay 200 + 30ms x index.
// Grid perspective 800px. The new set puts the next group in the top row and moves the old top row down; the clone has
// two groups of six placeholder logos, so the rows alternate. Reduced motion (as the original): opacity-only
// cross-fade, exit 500ms, enter 800ms delay 200ms, no stagger. Starts once the grid is in view.
const LOGO_COLOURS = ['#265cff', '#1b7a5a', '#ff6633', '#0b2471', '#1d7368', '#ff9966']
const LOGO_PERIOD = 4000
const logoAt = (k, p) => LOGOS[(((p < 6 ? 0 : 1) + k) % 2) * 6 + (p % 6)]

function LogoTile({ logo, i }) {
  return (
    <>
      <PlaceholderLogo logo={logo} height={21} className="max-w-[89px] text-ink-secondary" />
      <PlaceholderLogo logo={logo} height={21} className="logo-colour absolute left-0 top-0 max-w-[89px]" style={{ color: LOGO_COLOURS[i % 6] }} />
    </>
  )
}

function LogoGrid() {
  const ref = useRef(null)
  const inView = useInView(ref)
  const [started, setStarted] = useState(false)
  const [k, setK] = useState(0)
  const [prevK, setPrevK] = useState(null)
  const kRef = useRef(0)
  if (inView && !started) setStarted(true)
  useEffect(() => {
    if (!started) return undefined
    const iv = setInterval(() => {
      setPrevK(kRef.current)
      kRef.current += 1
      setK(kRef.current)
    }, LOGO_PERIOD)
    return () => clearInterval(iv)
  }, [started])
  useLayoutEffect(() => {
    if (k === 0 || !ref.current) return undefined
    const rm = prefersReducedMotion()
    const anims = []
    ref.current.querySelectorAll('[data-mw-exit]').forEach((el) => {
      const i = +el.dataset.i
      anims.push(
        el.animate(
          rm ? [{ opacity: 1 }, { opacity: 0 }] : [{ opacity: 1, transform: 'translateY(0) rotateX(0)' }, { opacity: 0, transform: 'translateY(-20px) rotateX(60deg)' }],
          { duration: rm ? 500 : 250, delay: rm ? 0 : 30 * i, easing: EASE.easeIn, fill: 'both' },
        ),
      )
    })
    ref.current.querySelectorAll('[data-mw-enter]').forEach((el) => {
      const i = +el.dataset.i
      anims.push(
        el.animate(
          rm ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 0, transform: 'translateY(10px) rotateX(-60deg)' }, { opacity: 1, transform: 'none' }],
          { duration: rm ? 800 : 400, delay: rm ? 200 : 200 + 30 * i, easing: EASE.easeIn, fill: 'backwards' },
        ),
      )
    })
    // popLayout: the exiting tiles are removed once the last exit has finished (30 x 11 + 250 = 580ms)
    const done = setTimeout(() => setPrevK(null), rm ? 520 : 600)
    return () => {
      clearTimeout(done)
      anims.forEach((a) => a.cancel())
    }
  }, [k])
  return (
    <Frame>
      {/* measured: 28px rows at 1440 (2 x 6, gap 48 68); 390: 3 x 4, 10px rows, gap 44 */}
      <ul ref={ref} className="grid grid-cols-3 gap-x-4 gap-y-[44px] px-12 py-16 lg:grid-cols-6 lg:gap-x-[68px] lg:gap-y-12" style={{ perspective: 800 }}>
        {Array.from({ length: 12 }, (_, i) => {
          const l = logoAt(k, i)
          return (
            <li key={i} className="logo-cell relative flex h-[10px] items-center justify-center lg:h-7">
              <div key={k} data-mw data-mw-enter data-i={i} className="relative flex">
                <LogoTile logo={l} i={i} />
              </div>
              {prevK !== null && (
                <div key={`x${prevK}`} data-mw data-mw-exit data-i={i} aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="relative flex">
                    <LogoTile logo={logoAt(prevK, i)} i={i} />
                  </div>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </Frame>
  )
}

// Featured stories: the arrow nudges 4px on card hover (.2s ease-in-out). Grid cells (`dark`): only hovering the footer
// itself nudges the arrow and turns its text cobalt (measured: .anchorFooter:hover on the original).
function StoryFooter({ name, dark }) {
  return (
    <div className={`flex h-9 items-center justify-between border-y border-cobalt-100 py-[6px] ${dark ? 'cust-footer' : ''}`}>
      <span className={`text-sm font-medium leading-[22px] tracking-[-0.3px] ${dark ? 'cust-footer-text text-cobalt-100' : 'text-ink-secondary'}`}>{name}</span>
      <span className={`mr-1 flex items-center gap-1 text-sm font-medium leading-[22px] tracking-[-0.3px] text-ink-secondary ${dark ? 'cust-footer-text' : ''}`}>
        Read more <ArrowRight className={dark ? 'cust-footer-arrow' : 'nudge'} />
      </span>
    </div>
  )
}

function FeaturedStories() {
  const [index, setIndex] = useState(0)
  const n = FEATURED_STORIES.length
  const visibleDots = 16
  const track = useRef(null)
  const pitch = track.current?.children[1] ? track.current.children[1].offsetLeft - track.current.children[0].offsetLeft : 383
  // measured: dot grid + bottom fade on the full-width band; frame interior is white with dashed column lines at 1/3 and 2/3
  return (
    <div className={`relative border-b ${RULE}`} style={{ backgroundImage: 'radial-gradient(#e3ebff 1px, transparent 0)', backgroundSize: '16px 16px' }}>
      <div className="container-ws relative bg-white">
        <div className={`relative border-x border-dashed ${RULE} pt-8`}>
          <span aria-hidden="true" className={`pointer-events-none absolute inset-y-0 left-1/3 hidden border-r border-dashed ${RULE} lg:block`} />
          <span aria-hidden="true" className={`pointer-events-none absolute inset-y-0 left-2/3 hidden border-r border-dashed ${RULE} lg:block`} />
          <h2 className="mb-6 ml-4 font-mono text-md font-medium leading-4 tracking-[normal] text-cobalt lg:absolute lg:-left-[31px] lg:top-8 lg:mb-0 lg:ml-0">
            <span className="tracking-[normal] lg:hidden">Featured stories</span>
            <span className="hidden tracking-[normal] lg:block" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
              Featured stories
            </span>
          </h2>
          <div className="relative overflow-hidden px-4">
            {/* keen-slider move (measured on the original): 500ms ease-out-quint, same duration for dot jumps */}
            <ul ref={track} className="flex gap-8" style={{ transform: `translateX(${-index * pitch}px)`, transition: `transform ${KEEN_MS}ms ${EASE.keen}` }}>
              {FEATURED_STORIES.map((s) => (
                <li key={s.path} className="w-[265px] shrink-0 md:w-[351px]">
                  <Link to={href(s.path)} className="cust-cell group flex h-[628px] flex-col md:h-[690px]">
                    <div className="relative mb-6 aspect-[351/468] border border-cobalt bg-cobalt-5">
                      <Media slot={s.slot} tone={s.tone} className="h-full w-full" />
                      {/* measured: resting state is the photo only; hover fades in a white 75% veil with the logo */}
                      <div className="cust-overlay absolute inset-0 flex items-center justify-center bg-white/75 px-24 py-12 text-midnight" aria-hidden="true">
                        <PlaceholderLogo logo={s.logo} height={32} className="max-w-[180px]" />
                      </div>
                    </div>
                    <h3 className="mt-[6px] font-serif text-2xl font-medium leading-[26.4px] tracking-[-0.72px] text-midnight">{s.title}</h3>
                    <div className="mt-auto">
                      <StoryFooter name={s.company} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative flex items-center justify-center gap-2 py-2 lg:pb-14 lg:pt-8">
            <button type="button" aria-label="Previous story" onClick={() => setIndex(Math.max(0, index - 1))} className="flex h-8 w-8 items-center justify-center text-cobalt">
              <SmallArrow dir="left" size={16} />
            </button>
            {FEATURED_STORIES.slice(0, visibleDots).map((s, i) => (
              <button key={s.path} type="button" aria-label={`Go to story ${i + 1}`} aria-current={i === index} onClick={() => setIndex(i)} className={`h-2 w-2 rounded-full border border-cobalt ${i === index ? 'bg-cobalt' : ''}`} />
            ))}
            {n > visibleDots && <span className="text-[10px] leading-[10px] text-cobalt">…</span>}
            <button type="button" aria-label="Next story" onClick={() => setIndex(Math.min(n - 1, index + 1))} className="flex h-8 w-8 items-center justify-center text-cobalt">
              <SmallArrow size={16} />
            </button>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[120px]" style={{ background: 'linear-gradient(rgba(255,255,255,0), #f5f8ff)' }} />
    </div>
  )
}

const FILTERS = [
  { key: 'region', label: 'Region', options: REGIONS },
  { key: 'industry', label: 'Industry', options: INDUSTRIES },
  { key: 'type', label: 'Type', options: TYPES },
]

function AllCustomers() {
  const [params, setParams] = useSearchParams()
  const values = Object.fromEntries(FILTERS.map((f) => [f.key, params.get(f.key) ?? '']))
  const items = useMemo(
    () => CUSTOMER_GRID.filter((c) => FILTERS.every((f) => !values[f.key] || c[f.key] === values[f.key])),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [values.region, values.industry, values.type],
  )
  const update = (key, v) => {
    const next = new URLSearchParams(params)
    if (v) next.set(key, v)
    else next.delete(key)
    setParams(next, { replace: true, preventScrollReset: true })
  }
  // measured: no solid frame here; dashed side rules on the header + grid, a full-bleed dashed line under the header
  // and under every row, and a dashed rgba(13,89,242,.5) right rule per cell. The band clips the overflowing lines.
  return (
    <section className="overflow-hidden" style={{ background: 'linear-gradient(359deg, #fff 21.68%, #f7f9ff 59.56%, #fff 96.66%)' }}>
      <div className="container-ws">
        <div className={`cust-grid-head relative grid grid-cols-1 items-center gap-8 border-x border-dashed ${RULE} px-4 py-12 lg:grid-cols-[704px_350px] lg:justify-between lg:px-8 lg:py-[120px]`}>
          <h2 className="text-[38px] font-normal leading-[41.8px] tracking-[-1.14px] text-midnight md:text-7xl md:leading-[52.8px] md:tracking-[-1.44px]">Climate programmes with results</h2>
          <form className="grid gap-4" onSubmit={(e) => e.preventDefault()} aria-label="Filter customers">
            {FILTERS.map((f) => (
              <SelectField
                key={f.key}
                name={f.key}
                label={f.label}
                required={false}
                float
                options={[{ value: '', label: 'All' }, ...f.options]}
                placeholderOption={false}
                value={values[f.key]}
                onChange={(v) => update(f.key, v)}
              />
            ))}
          </form>
        </div>
        <p className="sr-only-ws" role="status">
          {items.length} customers shown
        </p>
        {/* IO threshold .2 on grid chunks on the original: no visual change, so not wired */}
        <ul className={`grid grid-cols-1 border-l border-dashed ${RULE} pb-px md:grid-cols-2 lg:grid-cols-3`}>
          {items.map((c) => (
            <li key={c.slug} className="cust-grid-cell relative">
              <CustomerCell c={c} />
            </li>
          ))}
          {items.length === 0 && <li className="p-12 text-ink-secondary">No customers match these filters.</li>}
        </ul>
      </div>
    </section>
  )
}

function CustomerCell({ c }) {
  // measured: resting = logo only over the band background; hover fades in the whole anchor
  // (1px orange→cobalt radial "border", white→#f7f9ff radial fill, title + footer) on top of the logo.
  const inner = (
    <>
      <span className="absolute inset-0 flex items-center justify-center p-6 text-midnight">
        <PlaceholderLogo logo={c.logo} height={40} className="max-h-[72px] max-w-[216px]" />
      </span>
      <span className="cust-overlay cust-grid-overlay absolute inset-0">
        {/* measured: both radials centre on the cursor (mousemove -> px relative to the anchor) */}
        <span className="absolute inset-0" aria-hidden="true" style={{ background: 'radial-gradient(250px circle at var(--mx, 0px) var(--my, 0px), #ff6633, #265cff)' }} />
        <span className="absolute inset-px flex flex-col p-6" style={{ background: 'radial-gradient(250px circle at var(--mx, 0px) var(--my, 0px), #fff, #f7f9ff)' }}>
          <span className="mt-[6px] font-serif text-2xl font-medium leading-[26.4px] tracking-[-0.72px] text-midnight">{c.title}</span>
          <span className="mt-auto">
            <StoryFooter name={c.company} dark />
          </span>
        </span>
      </span>
    </>
  )
  // Off-site cards (external customer reports on the real site) render as non-links: resting logo state,
  // no hover overlay/arrow. The clone never links off-site.
  if (c.external || !c.path || isExternal(c.path)) return <div className="relative block h-[190px] md:h-[221px]">{inner}</div>
  const cls = 'cust-cell group relative block h-[190px] md:h-[221px]'
  return (
    <Link to={href(c.path)} className={cls} onMouseMove={trackPointer}>
      {inner}
    </Link>
  )
}

const QUOTES = [
  { text: 'Placeholder quote: having one place for our climate data changed how quickly we could answer questions from customers and auditors alike.', name: 'Placeholder name', role: 'Head of sustainability', logo: LOGOS[0] },
  { text: 'Placeholder quote: the team helped us move from estimates to supplier data, and the conversations with suppliers became far more productive.', name: 'Placeholder name', role: 'Procurement lead', logo: LOGOS[1] },
  { text: 'Placeholder quote: our first assured report arrived on schedule, with an audit trail we could explain line by line.', name: 'Placeholder name', role: 'Finance director', logo: LOGOS[4] },
  { text: 'Placeholder quote: we finally see which changes actually reduce emissions, and we can plan around them.', name: 'Placeholder name', role: 'Operations lead', logo: LOGOS[8] },
]

function QuoteFigure({ q, old = false, className = '' }) {
  return (
    <figure {...(old ? { 'data-q-old': '', 'aria-hidden': true } : { 'data-q-cur': '' })} className={`mx-auto flex max-w-[640px] flex-col items-center text-center ${className}`}>
      <PlaceholderLogo logo={q.logo} height={28} className="max-h-[28px] max-w-[100px] text-midnight" />
      <blockquote className="my-[30px] px-[30px] text-[20px] font-normal leading-[26px] tracking-[normal] text-ink-secondary md:text-3xl md:leading-[36.4px]">{q.text}</blockquote>
      <figcaption className="flex items-center text-left">
        <span className="mr-6 flex h-[72px] w-[72px] shrink-0 items-center justify-center">
          <span className="h-16 w-16 overflow-hidden rounded-full">
            <Media slot="customers.quote.headshot" className="h-full w-full" />
          </span>
        </span>
        <span className="flex max-w-[256px] flex-col">
          <span className="text-[20px] font-semibold leading-6 tracking-[-0.2px] text-midnight">{q.name}</span>
          <span className="text-sm font-normal leading-5 tracking-[normal] text-cobalt">{q.role}</span>
        </span>
      </figcaption>
    </figure>
  )
}

// Quote carousel (keen-slider on the original, loop mode), measured: auto-advances every 5000ms from mount, always
// forwards (last -> first continues to the right); each move 500ms ease-out-quint; clicking a dot moves there and stops
// the autoplay; hover does not pause; not gated on prefers-reduced-motion. The pane (overflow hidden) clips the slides.
const QUOTE_INTERVAL = 5000

function QuoteCarousel() {
  const [state, setState] = useState({ i: 0, prev: null, dir: 1, n: 0 })
  const [auto, setAuto] = useState(true)
  const vp = useRef(null)
  const { i } = state
  const q = QUOTES[i]
  const move = (to, dir) => setState((st) => (to === st.i ? st : { i: to, prev: st.i, dir, n: st.n + 1 }))
  useEffect(() => {
    if (!auto) return undefined
    const iv = setInterval(() => setState((st) => ({ i: (st.i + 1) % QUOTES.length, prev: st.i, dir: 1, n: st.n + 1 })), QUOTE_INTERVAL)
    return () => clearInterval(iv)
  }, [auto])
  useLayoutEffect(() => {
    if (!state.n || !vp.current) return undefined
    const w = vp.current.clientWidth
    const opts = { duration: KEEN_MS, easing: EASE.keen, fill: 'both' }
    const cur = vp.current.querySelector('[data-q-cur]')
    const old = vp.current.querySelector('[data-q-old]')
    const a = [cur?.animate([{ transform: `translateX(${state.dir * w}px)` }, { transform: 'translateX(0)' }], opts), old?.animate([{ transform: 'translateX(0)' }, { transform: `translateX(${-state.dir * w}px)` }], opts)].filter(Boolean)
    const t = setTimeout(() => setState((st) => (st.n === state.n ? { ...st, prev: null } : st)), KEEN_MS)
    return () => {
      clearTimeout(t)
      a.forEach((x) => x.cancel())
    }
  }, [state.n, state.dir])
  // measured: dashed frame (padding 120 0; 390: 24 0), 912 pane (390: 276, margin 0 24) with padding 64 0 (390: 64 24);
  // slide: 100x28 logo, quote 28/36.4 (390: 20/26) margin 30 0 padding 0 30, byline row (72 avatar box, mr 24, left-aligned text)
  return (
    <section>
      <div className="container-ws">
        <div className={`border-x border-dashed ${RULE} py-6 lg:py-[120px]`}>
          <div className="mx-auto max-w-[960px] px-4 md:px-6">
            <div className="mx-6 overflow-hidden rounded-btn px-6 py-16 md:mx-0 md:px-0" style={{ background: 'linear-gradient(127.16deg, #fffbf3 14.28%, #f5f8ff 71.56%)' }}>
              <div ref={vp} data-mw className="relative">
                <QuoteFigure key={`c${state.n}`} q={q} />
                {state.prev !== null && <QuoteFigure key={`o${state.n}`} q={QUOTES[state.prev]} old className="absolute inset-x-0 top-0" />}
              </div>
              <div className="mt-9 flex justify-center gap-2">
                {QUOTES.map((_, k) => (
                  <button key={k} type="button" aria-label={`Show quote ${k + 1}`} aria-current={k === i} onClick={() => {
                      setAuto(false)
                      move(k, k > i ? 1 : -1)
                    }} className="flex h-4 w-4 items-center justify-center">
                    <span className={`block h-[10px] w-[10px] rounded-full border border-midnight ${k === i ? 'bg-midnight' : ''}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
