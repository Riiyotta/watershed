import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Button from './Button.jsx'
import { href } from '../routing.js'
import { prefersReducedMotion } from '../motion.js'
import { IconEye, IconSliders, IconUsers, PromptGlyph, SendUp, Sparkle } from './Icons.jsx'

// §2.7 AI / agents section. WebGL glow replaced with a CSS gradient stand-in (A5).
const FEATURES = [
  { icon: IconUsers, title: 'Assistants that speed up work', desc: 'Hand off data cleaning, formatting and first-pass analysis to focused AI helpers.' },
  { icon: IconEye, title: 'Insight that sharpens results', desc: 'Draft reports with peer comparisons and a broad, well-maintained emissions library.' },
  { icon: IconSliders, title: 'Controls you can rely on', desc: 'Every answer comes with human review steps and calculations you can inspect.' },
]
// Chip lengths ~17 / ~30 / ~45 chars. Prompt examples for the auto-typer (§3.2).
export const PROMPTS = ['Summarise last quarter', 'Which suppliers drive our footprint?', 'Draft an overview for the board meeting']
export const CHIPS = ['Tidy my raw files', 'Where are my largest emissions?', 'Explain the drivers of change since last year']

export default function Agents() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* WebGL stand-in: starts 81px into the section, 900 tall. MOTION: optional slow drift of the blobs */}
      <div aria-hidden="true" className="agents-glow pointer-events-none absolute inset-x-0 top-[81px] h-[900px]">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(55% 45% at 25% 75%, rgba(167,139,250,.85) 0%, transparent 70%), radial-gradient(60% 55% at 72% 80%, rgba(101,141,253,.95) 0%, transparent 70%), radial-gradient(80% 50% at 50% 100%, #265cff 0%, transparent 75%), radial-gradient(40% 25% at 18% 55%, rgba(255,175,210,.6) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ backgroundImage: 'var(--tex-noise)', backgroundSize: '160px' }} />
      </div>
      {/* Top white fade, 410px */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[410px]" style={{ background: 'linear-gradient(#fff 0%, rgba(255,255,255,.95) 50%, rgba(255,255,255,.6) 75%, transparent 100%)' }} />
      {/* Dither overlay across the section */}
      <div aria-hidden="true" className="tex-dither-dark pointer-events-none absolute inset-0" />

      <div className="container-ws relative flex flex-col gap-[27px] py-[43px] md:gap-12 md:py-section">
        <div className="flex flex-col gap-[21px] md:gap-12">
          <p className="t-eyebrow flex items-center gap-[10px]">
            <Sparkle className="shrink-0" />
            Grounded in science, built with AI
          </p>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] md:gap-12 xl:grid-cols-[565px_539px]">
            <h2 className="text-2xl font-medium leading-[28.08px] tracking-headline text-ink md:text-5xl md:leading-[42.12px]">
              The assistant made for
              <br className="hidden md:block" /> climate data teams
            </h2>
            <div className="flex flex-col items-start gap-[21px] lg:w-[434px] md:gap-8">
              <p className="t-body-lg">Focused tools that help climate teams work quickly while keeping data accurate and reviewable.</p>
              <Button as={Link} to={href('/platform/sustainability-ai')} variant="outline" arrow>
                Meet the assistants
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-8 lg:grid-cols-[repeat(3,minmax(0,1fr))] xl:grid-cols-[repeat(3,363px)]">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex flex-col gap-2 md:gap-3">
              <f.icon className="text-cobalt-40" />
              <h3 className="text-sm font-medium leading-[16.38px] tracking-headline text-ink md:text-xl md:leading-[24.57px]">{f.title}</h3>
              <p className="text-xs font-medium leading-[16.8px] text-ink-secondary md:text-md md:leading-[22.4px]">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Prompt demo */}
        <PromptDemo className="mt-[89px] pb-2 md:mt-[208px] md:pb-5" />
      </div>
    </section>
  )
}

// §2.7 prompt card + chips, exported for reuse (PAGES_SPEC §0 PromptChat / CenteredAgent hero).
//   prompts: strings the auto-typer cycles through; chips: suggestion chip labels;
//   className: outer spacing (the homepage adds its own margins/padding).
export function PromptDemo({ prompts = PROMPTS, chips = CHIPS, className = '' }) {
  return (
    <div className={`prompt-demo mx-auto flex w-full flex-col gap-[11px] md:max-w-[752px] md:gap-4 ${className}`}>
      <div
        className="rounded-glass p-1 pb-3 md:pb-5"
        style={{
          background: 'rgba(11,36,113,.42)',
          boxShadow: 'inset 1px 1px 2px rgba(255,255,255,.26), inset 0 0 0 1px rgba(255,255,255,.10), inset 0 0 16px rgba(11,29,69,.36), 0 0 16px rgba(11,29,69,.32)',
        }}
      >
        <div
          className="flex h-14 items-center gap-3 rounded-[7.5px] pl-3 pr-2 md:h-16 md:pl-4 md:pr-3"
          style={{ background: 'radial-gradient(140% 120% at 28% 52%, rgba(11,36,113,.42) 0%, rgba(11,29,69,.3) 34%, transparent 100%), rgba(101,141,253,.5)' }}
        >
          <PromptGlyph className="shrink-0 text-white" />
          {/* auto-type PROMPTS (PromptTyper: 38ms/char, hold 1050ms, delete 14ms/char, gap 300ms); caret promptChatBlink 1s step-end (§3.2) */}
          <p className="flex min-w-0 flex-1 items-center text-lg font-semibold leading-[18px] tracking-headline text-white md:text-[20px] md:leading-[20px]" aria-label="cycling through example prompts">
            <PromptTyper prompts={prompts} />
            <span className="prompt-caret ml-0.5 inline-block h-[1em] w-[2px] bg-white" />
          </p>
          <button type="button" aria-label="Send" className="flex h-9 w-10 shrink-0 items-center justify-center rounded-[5px] md:rounded-panel text-white/70 hover:text-white">
            <SendUp />
          </button>
        </div>
      </div>
      <div className="no-scrollbar flex gap-[5px] overflow-x-auto md:gap-2">
        {chips.map((c) => (
          <button
            key={c}
            type="button"
            className="h-10 shrink-0 rounded-chip px-4 text-md font-semibold leading-6 text-white md:h-12 md:text-lg md:leading-7"
            style={{ background: 'rgba(12,121,213,.7)', boxShadow: 'var(--shadow-glass-edge), inset 0 1px 2px rgba(255,255,255,.26)' }}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  )
}

// Prompt auto-typer, measured on the original: starts when the demo scrolls into view (placeholder
// "What can I help you with?" until then), types ~38ms/char, holds 1050ms, deletes ~14ms/char, blank 300ms,
// next prompt; loops. Reduced motion: first prompt, static.
const TYPE_MS = 38
const HOLD_MS = 1050
const DELETE_MS = 14
const GAP_MS = 300
const PLACEHOLDER = 'What can I help you with?'

function PromptTyper({ prompts = PROMPTS }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (prefersReducedMotion()) {
      el.textContent = prompts[0]
      return undefined
    }
    el.textContent = PLACEHOLDER
    let t = 0
    let started = false
    const run = (p, n, dir) => {
      const text = prompts[p]
      el.textContent = text.slice(0, n)
      if (dir > 0) {
        if (n < text.length) t = setTimeout(() => run(p, n + 1, 1), TYPE_MS)
        else t = setTimeout(() => run(p, n - 1, -1), HOLD_MS)
      } else if (n > 0) t = setTimeout(() => run(p, n - 1, -1), DELETE_MS)
      else t = setTimeout(() => run((p + 1) % prompts.length, 1, 1), GAP_MS)
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) {
        started = true
        io.disconnect()
        run(0, 1, 1)
      }
    })
    io.observe(el)
    return () => {
      io.disconnect()
      clearTimeout(t)
    }
  }, [prompts.join('\n')]) // eslint-disable-line react-hooks/exhaustive-deps -- restart only when the text changes
  return <span ref={ref} className="prompt-text truncate" />
}
