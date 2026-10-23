import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from './Button.jsx'
import Media from './Media.jsx'
import { href } from '../routing.js'
import { EASE } from '../motion.js'

// §2.5 Product overview (dark band) with 3 steps. Active index is state; autoplay is for Animation (§3.3).
const STEPS = [
  {
    title: 'Collect',
    desc: 'Bring activity, spend and supplier data into one place for a full view of your footprint. Automated checks flag gaps and outliers early, and every number links back to its source so your team can trace each figure.',
    stage: 'linear-gradient(160deg, #3a3f4a 0%, #5b5a52 35%, #2a3a35 70%, #10202a 100%)',
    stageSlot: 'home.po.stage.0',
    screenSlot: 'home.po.screen.0',
  },
  {
    title: 'Disclose',
    desc: 'Prepare reports for several frameworks at once with drafts that start from your own data and reuse answers across requests. Review steps, peer comparisons, assurance support and clear audit trails help you publish figures you are ready to stand behind.',
    stage: 'linear-gradient(160deg, #6b5a44 0%, #4a4a44 30%, #2c3530 65%, #141c22 100%)',
    stageSlot: 'home.po.stage.1',
    screenSlot: 'home.po.screen.1',
  },
  {
    title: 'Reduce',
    desc: 'Find practical ways to cut emissions and costs at the same time. Compare clean energy options, plan supplier programmes and model how changes to materials, products or operations will affect your footprint over time.',
    stage: 'linear-gradient(160deg, #5d6b3c 0%, #48562f 35%, #2d3a24 70%, #121a14 100%)',
    stageSlot: 'home.po.stage.2',
    screenSlot: 'home.po.screen.2',
  },
]

// Props (all optional; defaults = homepage §2.5 dark band). PAGES_SPEC §0 ProductOverview / .modeLight:
//   mode: 'dark' (homepage, /platform/act) | 'light' (bg #fff, ink H2 and step titles, #666c80 descriptions,
//         stage #f5f8ff + dither with the step image filling the 852x640 stage; no scrim, no glass inset)
//   title, body: header H2 and paragraph
//   button: { label, to, variant = 'primary' }
//   steps: [{ title, desc, stage? (dark: CSS background fallback), stageSlot?, screenSlot? (dark: Media slots), slot?, tone? (light: Media slot) }]
//          2 or 3 steps
const BUTTON = { label: 'Explore the platform', to: '/platform' }
const TITLE = 'Clear data, lasting impact.'
const BODY = 'Use proven methods to find savings, reduce risk and spot new opportunities hidden in your operational and supply chain data.'

export default function ProductOverview({ mode = 'dark', title = TITLE, body = BODY, button = BUTTON, steps = STEPS }) {
  const light = mode === 'light'
  const [active, setActive] = useState(0)
  const [run, setRun] = useState(0) // restarts the 6s countdown on manual selection
  const select = (i) => {
    setActive(i)
    setRun((r) => r + 1)
  }
  // Autoplay (measured): stepCountdown 6s linear on the active bar; when it ends the next step activates (01->02->03->01).
  const advance = () => setActive((a) => (a + 1) % steps.length)
  // Swipe track viewport width (358 at 390; wider on tablet) so the centring clamp works at any width below lg.
  const trackRef = useRef(null)
  const [trackW, setTrackW] = useState(358)
  useEffect(() => {
    const el = trackRef.current
    if (!el) return undefined
    const ro = new ResizeObserver(() => setTrackW(el.clientWidth - 2 * parseFloat(getComputedStyle(el.firstElementChild).paddingLeft)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  // Original (native smooth scroll on .smStepSlider) aligns the active step's left edge with the track start,
  // clamped at the end: scrollLeft 0 / 273 / max. 252 card + 21 gap = 273 pitch; 798px track (3 steps).
  const trackLen = steps.length * 273 - 21
  const trackOffset = Math.min(active * 273, Math.max(trackLen - trackW, 0))

  return (
    <section className={light ? 'bg-white' : 'bg-night'}>
      <div className="container-ws pb-14 pt-12 md:py-section">
        {/* Header row */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-8 md:flex-1 lg:w-[652px] lg:flex-none md:gap-6">
            <h2 className={`text-[22px] font-medium leading-[27.5px] tracking-headline ${light ? 'text-ink' : 'text-white'} md:text-7xl md:leading-[60px]`}>{title}</h2>
            <p className={`text-sm font-medium leading-[21px] tracking-normal ${light ? 'text-ink-secondary' : 'text-white/80'} md:text-lg md:leading-[27px]`}>{body}</p>
          </div>
          <Button as={Link} to={href(button.to)} variant={button.variant ?? 'primary'} className="w-full md:w-auto">
            {button.label}
          </Button>
        </div>

        {/* Body */}
        <div className="mt-8 md:mt-12 lg:grid lg:grid-cols-[284px_minmax(0,1fr)] lg:gap-4 xl:grid-cols-[284px_852px]">
          {/* Desktop step nav */}
          <div className="hidden lg:block">
            {steps.map((s, i) => (
              <StepButton key={s.title} step={s} index={i} active={active === i} run={run} onClick={() => select(i)} onDone={advance} light={light} />
            ))}
          </div>

          {/* Mobile: horizontal swipe track, start-aligns the active step. MOTION: track transform transition on change */}
          <div ref={trackRef} className="-mx-4 overflow-hidden md:-mx-6 lg:hidden">
            {/* Aligns the active step to the track start, clamped at the end (as the original smooth-scrolls). 252 card + 21 gap = 273 pitch; 798px track; clamp uses the measured viewport width. */}
            <div className="flex items-start gap-[21px] px-4 md:px-6" style={{ transform: `translateX(-${trackOffset}px)`, transition: `transform 265ms ${EASE.track}` }}>
              {steps.map((s, i) => (
                <div key={s.title} className="w-[252px] shrink-0">
                  <StepButton step={s} index={i} active={active === i} run={run} onClick={() => select(i)} onDone={advance} light={light} mobile />
                </div>
              ))}
            </div>
          </div>

          {light ? <LightStage active={active} steps={steps} /> : <Stage active={active} steps={steps} />}
        </div>
      </div>
    </section>
  )
}

function StepButton({ step, index, active, run, onClick, onDone, mobile = false, light = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex w-full flex-col text-left transition-opacity duration-300 ease-[ease] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cobalt ${active ? 'opacity-100' : 'opacity-[.48] hover:opacity-70'}`}
    >
      {/* 2px progress bar: track transparent, fill cobalt, origin left.
          MOTION: stepCountdown scaleX(0->1) 6s linear on the active step, then advance (§3.3). Static: active = full. */}
      <span className="block h-[2px] w-full bg-transparent">
        <span
          key={active ? `run-${run}` : 'idle'}
          className={`step-bar block h-full origin-left bg-cobalt ${active ? 'step-bar-run scale-x-100' : 'scale-x-0'}`}
          onAnimationEnd={active ? onDone : undefined}
        />
      </span>
      <span className="flex flex-col gap-2 py-6">
        <span className="flex items-baseline gap-2 text-lg font-normal leading-[21.6px]">
          <span className="text-cobalt-step">{String(index + 1).padStart(2, '0')}</span>
          <span className={light ? 'text-ink' : 'text-white'}>{step.title}</span>
        </span>
        {/* grid-template-rows 0fr -> 1fr, .35s (§3.3) */}
        <span className={`step-desc grid ${active || mobile ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
          <span className="overflow-hidden">
            <span className={`block text-xs font-medium leading-[18px] ${light ? 'text-ink-secondary' : 'text-white/80'} md:pb-1`}>{step.desc}</span>
          </span>
        </span>
      </span>
    </button>
  )
}

// Measured: bg images cross-fade (opacity .5s); the screen (.stageFade) fades out .35s, swaps, then fades in .35s.
function Stage({ active, steps }) {
  const [screenOn, setScreenOn] = useState(true)
  const [shown, setShown] = useState(active) // screen image swaps while faded out
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return undefined
    }
    setScreenOn(false)
    const t = setTimeout(() => {
      setShown(active)
      setScreenOn(true)
    }, 350)
    return () => clearTimeout(t)
  }, [active])
  const screenSlot = steps[shown]?.screenSlot
  return (
    <div className="relative mt-[10px] h-[400px] overflow-hidden rounded-btn bg-night lg:mt-0 lg:h-auto lg:w-full lg:pb-[calc(59.55%+122.7px)] xl:h-[630px] xl:w-[852px] xl:pb-0">
      {/* 1. bg image placeholders (B3), one per step: opacity .5s cross-fade */}
      {steps.map((s, i) => {
        const cls = `absolute inset-0 transition-opacity duration-500 motion-reduce:transition-none ${active === i ? 'opacity-100' : 'opacity-0'}`
        return s.stageSlot ? (
          <Media key={s.title} slot={s.stageSlot} className={`${cls} h-full w-full`} />
        ) : (
          <div key={s.title} aria-hidden="true" className={cls} style={{ background: s.stage }} />
        )
      })}
      {/* 2. dither overlay */}
      <div aria-hidden="true" className="tex-dither-dark absolute inset-0" />
      {/* 3. scrim */}
      <div aria-hidden="true" className="absolute inset-0" style={{ background: 'linear-gradient(rgba(4,19,48,.2) 0%, rgba(4,19,48,.5) 50%, rgba(4,19,48,.8) 100%)' }} />
      {/* 4. glass panel, bleeds off right/bottom */}
      <div
        className="absolute left-16 top-[185px] h-[225px] w-[304px] rounded p-2 lg:left-[calc(18%+9.6px)] lg:top-32 lg:h-auto lg:w-[calc(82%+0.4px)] xl:left-[163px] xl:h-[512px] xl:w-[699px]"
        style={{ background: 'rgba(255,255,255,.01)', backdropFilter: 'blur(var(--glass-blur))', WebkitBackdropFilter: 'blur(var(--glass-blur))', boxShadow: 'var(--shadow-glass-edge)' }}
      >
        {/* 5. inner white card with dashboard placeholder (B4) */}
        <div className={`stage-fade relative h-[209px] w-[288px] overflow-hidden rounded-btn bg-white lg:aspect-[683/496] lg:h-auto lg:w-full xl:h-[496px] xl:w-[683px] ${screenOn ? 'opacity-100' : 'opacity-0'}`}>
          {screenSlot ? (
            // all screens stacked so the next one is already decoded when the swap happens; only `shown` is visible
            steps.map((s, i) => (
              <Media
                key={s.title}
                slot={s.screenSlot}
                alt={i === shown ? `${s.title} screen` : ''}
                className={`absolute inset-0 h-full w-full ${i === shown ? 'opacity-100' : 'opacity-0'}`}
                style={{ objectPosition: 'left top' }}
              />
            ))
          ) : (
            <DashboardPlaceholder />
          )}
        </div>
      </div>
    </div>
  )
}

// Light mode (.modeLight): #f5f8ff stage with the dither; the step image fills the 852x640 stage (390: 400 tall).
// Images cross-fade with the same opacity .5s as the dark stage.
function LightStage({ active, steps }) {
  return (
    <div className="tex-dither-light relative mt-[10px] h-[400px] overflow-hidden rounded-btn lg:mt-0 lg:h-auto lg:w-full lg:pb-[calc(59.55%+132.7px)] xl:h-[640px] xl:w-[852px] xl:pb-0">
      {steps.map((s, i) => (
        <Media
          key={s.title}
          slot={s.slot}
          tone={s.tone ?? 'cool'}
          className={`absolute inset-0 h-full w-full transition-opacity duration-500 motion-reduce:transition-none ${active === i ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
    </div>
  )
}

function DashboardPlaceholder() {
  return (
    <div className="flex h-full" role="img" aria-label="Dashboard screenshot placeholder">
      <div className="w-[12%] border-r border-line-light bg-bg-xlight" />
      <div className="flex flex-1 flex-col gap-[4%] p-[4%]">
        <div className="h-[6%] w-[40%] rounded-btn bg-gray-20" />
        <div className="grid flex-1 grid-cols-2 gap-[4%]">
          <div className="rounded-card bg-gradient-to-br from-cobalt-10 to-cobalt-30" />
          <div className="rounded-card bg-gradient-to-br from-gray-10 to-gray-30" />
          <div className="rounded-card bg-gradient-to-br from-gray-10 to-gray-30" />
          <div className="rounded-card bg-gradient-to-br from-cobalt-5 to-cobalt-20" />
        </div>
      </div>
    </div>
  )
}
