import { useEffect, useRef, useState } from 'react'
import Quote from '../../blocks/Quote.jsx'
import MicroFeatureCarousel from '../../blocks/MicroFeatureCarousel.jsx'
import PageLinkSet from '../../blocks/PageLinkSet.jsx'
import TextWithLogos from '../../blocks/TextWithLogos.jsx'
import Logos from '../../blocks/Logos.jsx'
import HeaderRoot from '../../blocks/HeaderRoot.jsx'
import Button from '../../components/Button.jsx'
import Media from '../../components/Media.jsx'
import { FIELDSETS, HeroWithForm, HubspotForm } from '../../primitives/index.js'
import { relatedResources } from './GatedPages.jsx'
import { trackPointer } from '../../motion.js'

const QUOTES = [
  { text: 'Placeholder quote: we could finally test how one design change affected the whole footprint, and act on it with confidence.', name: 'Placeholder name', role: 'Director of environmental impact, placeholder company', logo: 2 },
  { text: 'Placeholder quote: the team’s guidance turned a once-a-year scramble into a programme our leadership trusts.', name: 'Placeholder name', role: 'Head of sustainability, placeholder company', logo: 5 },
]

// demo template: /demo, /demo/csrd (DemoTemplate) and /lp/* (LP template)
export default function DemoPage({ path }) {
  if (path.startsWith('/lp/')) return <LpPage path={path} />
  const csrd = path === '/demo/csrd'
  return (
    <>
      <HeroWithForm
        theme="dark"
        title={csrd ? 'See how Northwind supports sustainability reporting' : 'See the Northwind climate platform in action'}
        lead="Placeholder copy: book a demo to see how Northwind brings measurement, reporting and reduction planning together in one place, with expert support along the way."
        features={[
          'Measure every scope with an audit-ready trail',
          'Prepare disclosures for multiple frameworks from one dataset',
          'Automate data cleaning and first-draft reports',
          'Get support from in-house climate and policy specialists',
        ]}
        stats={[
          { value: '3x', label: 'faster time to first report (placeholder figure)' },
          { value: '100%', label: 'of placeholder audits passed in the sample' },
        ]}
        form={{ variant: 'solo', title: 'Talk to our climate specialists', fields: FIELDSETS.demo, submitLabel: 'Request a demo' }}
      />
      <Quote quotes={csrd ? QUOTES.slice(0, 1) : QUOTES} slotPrefix="demo.quote" />
      {csrd && (
        <>
          <MicroFeatureCarousel />
          <PageLinkSet
            title="Related resources"
            cards={relatedResources(path, 3).map((c) => ({ to: c.path, eyebrow: c.eyebrow, title: c.title }))}
            slotPrefix="demo.pls"
          />
        </>
      )}
    </>
  )
}

// product-tour: /product-tours (index, statsLabel list) and /product-tours/<slug> (feature list)
const TOURS = [
  { title: 'AI reporting', desc: 'See how first drafts of disclosures come together from your data.' },
  { title: 'Climate disclosures', desc: 'Walk through preparing a state-level climate report.' },
  { title: 'Product footprints', desc: 'Explore product-level emissions at scale.' },
  { title: 'Measurement', desc: 'Follow a footprint from raw data to audited figures.' },
]

export function ProductTourPage({ path }) {
  const index = path === '/product-tours'
  const slug = path.split('/').pop()
  const title = index ? 'Explore Northwind with self-guided tours' : `${slug.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase()).replace(/\bai\b/i, 'AI')} for any climate report`
  return (
    <>
      {/* Storylane tour is gated (noAccess): only the pre-submit state is shown (§4.10) */}
      <HeroWithForm
        theme="light"
        eyebrow={index ? 'Self-guided, at your own pace' : undefined}
        eyebrowDot="#00bb81"
        title={title}
        lead={index ? 'Placeholder copy: pick a tour to see the product in a few minutes, at your own pace.' : undefined}
        statsLabel={index ? { label: 'Available tours', items: TOURS } : undefined}
        form={{ variant: 'banner', mediaSlot: `tour.${slug}.banner`, mediaAspect: index ? '522 / 121' : undefined, fields: FIELDSETS.tour, submitLabel: 'Start your tour' }}
      />
      <Quote quotes={[{ ...QUOTES[0], logo: 7 }]} slotPrefix="tour.quote" />
      {/* measured: the /product-tours index ends after the Quote (no TextWithLogos) */}
      {!index && <TextWithLogos title="Trusted by climate teams worldwide" body="Placeholder copy: Northwind is built for sustainability programmes of every size, with specialist support and tools that scale." />}
    </>
  )
}

export function ToolPage() {
  return (
    <HeroWithForm
      theme="light"
      eyebrow="Climate policy calendar"
      eyebrowDot="#ff9966"
      title="Keep track of climate policy deadlines"
      lead="Placeholder copy: follow consultations, deadlines and decisions across regions and frameworks in one calendar that you can sync with your own."
      features={['Key policy dates in one place.', 'Filter by region and by mandatory or voluntary requirement.', 'Sync updates to your calendar and plan ahead.']}
      quote={{ text: '“Placeholder quote: the calendar keeps our whole team aligned on what is coming next, without anyone having to track it by hand.”', name: 'Placeholder name', role: 'Head of sustainability, placeholder company' }}
      form={{ variant: 'banner', mediaSlot: 'tool.calendar.banner', fields: FIELDSETS.guide, submitLabel: 'Get the calendar' }}
    />
  )
}

// ---------------------------------------------------------------- /lp/* (§3.32, §4.9)
// Promo bar only: no nav, no footer (chrome variant, not implemented here; see report).
function LpPage() {
  return (
    <>
      <LpHero />
      <Logos size="small" label="Trusted by climate teams worldwide" />
      <HeaderRoot eyebrow="How it works" title="One platform from data to decisions" body="Placeholder copy: Northwind connects measurement, reporting and reduction planning so every number has a clear trail." link={{ label: 'See the platform', to: '/platform' }} />
      <AnimatedSteps />
      <CtaSlim />
      <LpFeatureGrid />
      <FeaturedForm />
    </>
  )
}

// Hero highlight (measured on the original heroSection): a 650px radial (rgba(255,255,255,.25) -> transparent 80%)
// centred on the cursor, fading in on hover (opacity .2s ease-in-out). Not gated on reduced motion.
function LpHero() {
  return (
    <section className="lp-hero relative overflow-hidden py-16 md:py-20" onMouseMove={trackPointer}>
      <div aria-hidden="true" className="lp-hero-hl pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(650px circle at var(--mx, 0px) var(--my, 0px), rgba(255, 255, 255, 0.25), transparent 80%)' }} />
      <div className="container-ws relative grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col gap-6 lg:col-span-6">
          <p className="text-md font-semibold uppercase leading-[22px] text-cobalt">Why Northwind</p>
          <h1 className="text-4xl font-light leading-[40px] tracking-[-1.48px] text-ink-secondary md:text-[60px] md:leading-[66px]">The climate platform built for complete, credible data</h1>
          <p className="t-lead">Placeholder copy: measure every scope, report to any framework and plan reductions with the support of in-house specialists.</p>
          <div>
            <Button href="#lp-form" arrow>
              Get started
            </Button>
          </div>
        </div>
        {/* ProductScreen HTML mock replaced by a placeholder */}
        <div className="lg:col-span-6">
          <Media slot="lp.hero.screen" tone="cool" className="aspect-[566/414] w-full rounded-btn" />
        </div>
      </div>
    </section>
  )
}

const STEPS = [
  { title: 'Bring in your data', desc: 'Upload spreadsheets, connect systems and let automatic checks catch gaps.' },
  { title: 'Calculate with confidence', desc: 'Every figure links back to its source data, factor and method.' },
  { title: 'Report and reduce', desc: 'Generate disclosures and model the levers that cut emissions.' },
]

// AnimatedSteps (measured on the original, >= 900px only; below that the original shows a static list):
// the current item's indicator moves translateX(-100%) -> 0 in 2% steps every 50ms (CSS transform 50ms linear between
// steps), holds full for 500ms, then the next item starts (wrapping). Hovering an item makes it current and pauses with
// a full bar; leaving holds 500ms then advances. The bar of non-current items fades out (opacity .25s
// cubic-bezier(.22,1,.36,1)). Title hover colour .125s ease-in-out. Runs regardless of reduced motion / visibility.
const STEP_TICK = 50
const STEP_INC = 2
const STEP_HOLD = 500
const STEPS_MQ = '(min-width: 900px)'

function AnimatedSteps() {
  const [active, setActive] = useState(0)
  const [prog, setProg] = useState([100, 100, 100]) // percent filled per item
  const activeRef = useRef(0)
  const progRef = useRef(prog)
  const commit = (a, p) => {
    activeRef.current = a
    progRef.current = p
    setActive(a)
    setProg(p)
  }
  const [hover, setHover] = useState(-1)
  const [desk, setDesk] = useState(() => typeof window !== 'undefined' && window.matchMedia(STEPS_MQ).matches)
  useEffect(() => {
    const mq = window.matchMedia(STEPS_MQ)
    const on = () => setDesk(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  // start the first item from empty once on desktop
  useEffect(() => {
    if (desk) commit(activeRef.current, progRef.current.map((v, i) => (i === activeRef.current ? 0 : v)))
  }, [desk])
  useEffect(() => {
    if (!desk || hover >= 0) return undefined
    let hold = 0
    const iv = setInterval(() => {
      const a = activeRef.current
      const p = progRef.current
      if (p[a] < 100) return commit(a, p.map((v, i) => (i === a ? Math.min(100, v + STEP_INC) : v)))
      hold += STEP_TICK
      if (hold < STEP_HOLD) return undefined
      hold = 0
      const next = (a + 1) % STEPS.length
      return commit(next, p.map((v, i) => (i === next ? 0 : v)))
    }, STEP_TICK)
    return () => clearInterval(iv)
  }, [desk, hover])
  const select = (i) => commit(i, progRef.current.map((v, k) => (k === i ? 100 : v)))
  return (
    <section className="border-y border-cobalt py-16">
      <div className="container-ws">
        <h2 className="mb-10 text-[32px] font-normal leading-[40px] tracking-[-0.4px] text-midnight md:text-7xl md:leading-[56.16px]">From data to decisions</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[576px_576px]">
          <ol>
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <button
                  type="button"
                  onClick={() => select(i)}
                  onMouseEnter={() => {
                    if (!desk) return
                    setHover(i)
                    select(i)
                  }}
                  onMouseLeave={() => setHover(-1)}
                  aria-pressed={active === i}
                  className={`group flex w-full flex-col gap-4 px-6 py-12 text-left ${active === i ? '' : 'opacity-60'}`}
                >
                  <span className="font-mono text-md font-medium leading-[19.2px] text-cobalt">{String(i + 1).padStart(2, '0')}</span>
                  <strong className="text-3xl font-medium leading-[30.8px] text-midnight transition-colors duration-[125ms] ease-in-out group-hover:text-cobalt">{s.title}</strong>
                  <span className="text-md font-medium leading-6 text-ink-secondary">{s.desc}</span>
                  <span className="block h-px w-full overflow-hidden bg-cobalt-20">
                    <span
                      className="block h-px w-full bg-cobalt"
                      style={{
                        opacity: active === i ? 1 : 0,
                        transform: `translateX(${(desk ? prog[i] : 100) - 100}%)`,
                        transition: 'opacity 0.25s cubic-bezier(0.22, 1, 0.36, 1), transform 50ms linear',
                      }}
                    />
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <Media slot={`lp.steps.${active}`} tone="cool" className="aspect-square w-full lg:h-full" />
        </div>
      </div>
    </section>
  )
}

function CtaSlim() {
  return (
    <section className="container-ws py-6">
      <div className="flex flex-col items-start justify-between gap-3 rounded-[6px] px-6 py-3 md:h-16 md:flex-row md:items-center" style={{ background: 'linear-gradient(to left, #265cff 0%, #e2f5fa 100%)' }}>
        <p className="text-[21px] font-semibold leading-[23.1px] tracking-[-0.63px] text-midnight">See the platform for yourself</p>
        <a href="#lp-form" className="inline-flex h-10 w-[136px] items-center justify-center rounded-btn bg-midnight font-mono text-sm font-medium leading-[21px] text-[#fffbf3]">
          Book a demo
        </a>
      </div>
    </section>
  )
}

const FEATURES = [
  ['Complete measurement', 'Cover every scope and category with methods that stand up to audit, from operations to the value chain.'],
  ['Any framework', 'Prepare disclosures for several frameworks from one dataset, without rebuilding your numbers each time.'],
  ['Expert support', 'Work with in-house climate scientists and policy specialists who know the rules and the data.'],
]

function LpFeatureGrid() {
  return (
    <section className="py-16 md:py-section">
      <div className="container-ws">
        <h2 className="mb-10 text-[28px] font-medium leading-[34px] tracking-[-0.96px] text-midnight md:text-[32px] md:leading-[40px]">Why teams choose Northwind</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 xl:grid-cols-[repeat(3,368px)]">
          {FEATURES.map(([h, b]) => (
            <div key={h} className="border border-line p-6">
              <h3 className="mb-3 text-[21px] font-semibold leading-[26.25px] text-ink">{h}</h3>
              <p className="text-md font-normal leading-6 text-ink-secondary">{b}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturedForm() {
  return (
    <section id="lp-form" className="border-t border-cobalt-30 pb-6 pt-[72px]" style={{ background: 'linear-gradient(#fff, rgba(219,235,231,.31))' }}>
      <div className="container-ws flex flex-col items-center text-center">
        <h2 className="text-[28px] font-normal leading-[34px] text-midnight md:text-[35px] md:leading-[40.95px]">Talk to our team</h2>
        <p className="t-lead mt-4 max-w-[580px]">Placeholder copy: tell us a little about your programme and we will be in touch.</p>
        <div className="mt-10 w-full max-w-[474px] pb-12 text-left">
          <HubspotForm fields={FIELDSETS.demo} submitLabel="Request a demo" />
        </div>
      </div>
    </section>
  )
}
