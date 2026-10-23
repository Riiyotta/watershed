import PlaceholderLogo, { LOGOS } from './PlaceholderLogo.jsx'
import { useEffect, useRef, useState } from 'react'
import { ArrowRight, PromptGlyph } from './Icons.jsx'
import { prefersReducedMotion } from '../motion.js'
import { Link } from 'react-router-dom'
import { href } from '../routing.js'
import Media from './Media.jsx'

// §2.3 Hero. Static states only.
// Ticker messages (30-45 chars each). Animation agent: cycle these with the scramble/decode (§3.1).
export const TICKER_MESSAGES = [
  { text: 'Trusted by 120+ teams across 30 countries', dot: '#265cff' },
  { text: 'Over 4 billion data points processed', dot: '#93aeff' },
  { text: 'Audit-ready numbers for every reporting cycle', dot: '#265cff' },
]

// Dither offsets for tiles 1,3,5,8,10,12 (§2.3)
const DITHER = { 0: '-475px -15px', 2: '-190px -118px', 4: '-240px -400px', 7: '-90px -120px', 9: '-130px -250px', 11: '-350px -390px' }
// four tiles carry the hidden "Read case study" strip; each links to a customer story (variant A)
const CTA_TILES = new Map([[0, '/customers/canva'], [3, '/customers/burton'], [6, '/customers/figma'], [10, '/customers/skyscanner']])
const LOGO_HEIGHTS = [20, 24, 20, 18, 22, 20, 22, 20, 24, 18, 20, 22]

export default function Hero() {
  return (
    <header className="relative overflow-x-clip pt-[53px] md:pt-20" style={{ background: 'linear-gradient(#fff 40%, #f5f8ff 75%, #f5f8ff 100%)' }}>
      {/* (a) WebGL stand-in: static dithered landscape, full-bleed. MOTION: optional subtle shimmer (A4). */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[712px] overflow-hidden md:h-[779px]">
        <div
          className="absolute inset-0"
          style={{ backgroundImage: "url('/img/hero-landscape.png')", backgroundSize: 'cover', backgroundPosition: '50% 100%', transform: 'translateY(7%)' }}
        />
      </div>

      <div className="container-ws relative">
        {/* Hero grid: 896 / 224, gap 32 */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,4fr)_minmax(0,1fr)] lg:gap-8">
          <div className="flex flex-col gap-4 pt-[5px] md:gap-6 md:pt-2">
            <HeroTicker />

            <h1
              className="max-w-[850px] text-[40px] font-medium leading-[40px] tracking-[-2.88px] text-ink md:text-9xl md:leading-[72px]"
              style={{ textWrap: 'balance' }}
            >
              Clean climate data for confident decisions
            </h1>

            <p className="t-lead md:w-fit md:max-w-[720px]">Carbon accounting software that turns scattered data into clear numbers.</p>

            <HeroForm />
          </div>
        </div>

        <ImageComposition />
      </div>

      {/* (b) Social proof */}
      <div className="bg-cobalt-5 pb-[43px] md:pb-16">
        <div className="container-ws">
          <LogoGrid />
          <Testimonial />
        </div>
      </div>
    </header>
  )
}

function HeroForm() {
  return (
    <form className="relative grid w-full grid-cols-1 gap-y-[5px] md:w-[452px] md:grid-cols-[276px_176px] md:gap-y-4" onSubmit={(e) => e.preventDefault()}>
      {/* Soft cobalt glow under the field row (desktop) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 hidden h-[52px] w-full md:block"
        style={{ background: 'linear-gradient(90deg, #e3ebff, rgba(101,141,253,.8))', filter: 'blur(36px)', transform: 'translateY(24px)' }}
      />
      {/* Frosted glass pill behind the joined field (desktop) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 hidden h-[52px] w-full rounded-btn md:block"
        style={{
          background: 'color-mix(in srgb, #93aeff 8%, transparent)',
          backdropFilter: 'blur(var(--glass-blur))',
          WebkitBackdropFilter: 'blur(var(--glass-blur))',
          boxShadow: 'inset 0 1px 0 #fff9, 0 0 0 1px #0413300f',
        }}
      />
      <label className="sr-only" htmlFor="hero-email">
        Work email
      </label>
      <input
        id="hero-email"
        type="email"
        placeholder="Work email address*"
        className="relative h-10 w-full rounded-btn border border-line-light bg-white px-[11px] py-[7px] text-xs font-medium text-ink placeholder:text-ink-disabled focus:shadow-focus md:my-1 md:ml-1 md:h-11 md:w-[272px] md:rounded-r-none md:border-r-0 md:px-4 md:py-[10px] md:text-sm"
      />
      <button
        type="submit"
        className="hs-submit relative h-10 w-full whitespace-nowrap tracking-[normal] rounded-btn bg-cobalt px-4 text-[13px] font-medium leading-[19.5px] text-white hover:bg-cobalt-70 md:my-1 md:mr-1 md:h-11 md:w-[172px] md:rounded-l-none md:py-[10px] md:pl-4 md:pr-9 md:text-left md:text-md md:leading-6"
      >
        Request a demo
      </button>
      <p className="text-2xs font-medium leading-[15px] text-ink-secondary md:col-span-2 md:text-xs md:leading-[18px]">
        By submitting, you agree to Northwind&rsquo;s{' '}
        <Link to={href('/legal/privacy')} className="text-cobalt">
          privacy policy
        </Link>{' '}
        and to receive occasional product updates by email.
      </p>
    </form>
  )
}

const Block = ({ className = '', style }) => <div aria-hidden="true" className={`absolute ${className}`} style={style} />

function ImageComposition() {
  return (
    <>
      {/* Desktop: absolutely positioned on a 192x108 module grid; origin = content x144 / y563 */}
      <div className="relative hidden aspect-[1152/324] lg:block">
        <div className="absolute left-0 top-[calc(200%/3)] z-[2] flex h-[calc(100%/3)] w-[calc(100%/3)] items-end bg-slate-block p-4">
          <Caption />
        </div>
        <Block className="left-[calc(100%/3)] top-[calc(200%/3)] h-[calc(100%/3)] w-[calc(100%/6)] bg-tangerine" />
        <Block className="left-[calc(100%/3)] top-[calc(100%/3)] h-[calc(100%/3)] w-[calc(100%/6)] bg-cobalt-40" />
        <Block className="bottom-full left-[calc(500%/6)] z-[2] h-[calc(100%*114/324)] w-[calc(100%/6)] bg-teal" />
        <Block className="left-[calc(500%/6)] top-0 h-[calc(100%/3)] w-[calc(100%/6)] bg-cobalt" />
        <Block className="left-full top-[calc(100%/3)] h-[calc(100%/3)] w-[calc(100%/6)] bg-poppy" />
        <div className="absolute left-1/2 top-0 z-[2] h-full w-1/2 overflow-hidden rounded-btn bg-slate-block">
          <HeroImagePlaceholder />
        </div>
      </div>

      {/* Mobile: grid 239 / 119; side blocks bleed off-screen */}
      {/* Below lg (incl. tablet) the 358px mobile module grid scales with the container: all sizes are
          fractions of the 358 x 285 mobile box, so 390 renders exactly as measured. */}
      <div className="relative mt-4 grid grid-cols-[239fr_119fr] lg:hidden">
        <Block className="left-[-24%] top-[25.3%] h-[24.9%] w-[33.24%] bg-cobalt-40" />
        <Block className="left-[-24%] top-[50.2%] h-[24.9%] w-[33.24%] bg-tangerine" />
        <Block className="left-[90.8%] top-[50.2%] h-[24.9%] w-[33.24%] bg-poppy" />
        <div className="relative z-[2] col-span-2 aspect-[358/201] overflow-hidden rounded-btn bg-slate-block">
          <HeroImagePlaceholder />
        </div>
        <div className="relative z-[2] flex aspect-[239/84] items-end bg-slate-block p-[11px]">
          <Caption />
        </div>
        <div className="relative z-[2] aspect-[119/84] bg-teal" />
      </div>
    </>
  )
}

function Caption() {
  return (
    <p className="font-mono text-xs font-medium leading-[14.4px] text-white md:text-sm md:leading-[16.8px]">
      Used by sustainability teams at <span style={{ fontWeight: 250 }}>↘</span>
    </p>
  )
}

// Prompt pill type-in, measured on the original (.heroPromptText): types once on load, one character every
// 50ms, starting ~1130ms after first paint, then stays (no cycling). Reduced motion: full text immediately.
const TYPE_START = 1130
const TYPE_STEP = 50
function TypedPrompt({ text }) {
  const [n, setN] = useState(() => (prefersReducedMotion() ? text.length : 0))
  useEffect(() => {
    if (prefersReducedMotion()) return undefined
    let iv = 0
    const t = setTimeout(() => {
      setN(1)
      iv = setInterval(() => setN((v) => (v >= text.length ? (clearInterval(iv), v) : v + 1)), TYPE_STEP)
    }, TYPE_START)
    return () => {
      clearTimeout(t)
      clearInterval(iv)
    }
  }, [text])
  return (
    <>
      <span className="hero-prompt-text" aria-hidden="true">
        {text.slice(0, n)}
      </span>
      <span className="sr-only">{text}</span>
    </>
  )
}

// B1: product image (pill-less slot) + HTML prompt pill with caret layered on top
function HeroImagePlaceholder() {
  return (
    <div className="relative h-full w-full">
      <Media slot="home.hero.product" alt="" loading="eager" className="absolute inset-0 h-full w-full" />
      <div className="absolute left-[10%] top-[22%] flex h-[30px] items-center gap-2 rounded-full bg-white/95 pl-[9px] pr-[14px] shadow-[0_0_0_4px_rgba(255,255,255,.25)] md:left-[30%] md:top-[22%] md:h-[42px] md:pl-[12px] md:pr-5">
        <PromptGlyph size={18} className="text-cobalt-40" />
        <span className="text-[10.44px] font-semibold leading-[19.28px] tracking-[-0.39px] text-ink md:text-[16.8px] md:leading-[31px] md:tracking-[-0.62px]">
          <TypedPrompt text="Where should we cut emissions first?" />
        </span>
        {/* MOTION: heroPromptBlink 1s step-end infinite (§3.2) */}
        <span className="hero-caret -ml-1 inline-block h-[1em] w-px bg-ink text-[11px] md:text-[16.8px]" />
      </div>
    </div>
  )
}

function LogoGrid() {
  return (
    <div className="grid grid-cols-3 overflow-hidden border-x border-t border-line bg-white md:grid-cols-6">
      {LOGOS.map((logo, i) => {
        const hasCta = CTA_TILES.has(i)
        const Tag = hasCta ? Link : 'div'
        return (
          <Tag
            key={logo.name}
            {...(hasCta ? { to: href(CTA_TILES.get(i)) } : {})}
            className={`group relative flex h-[102px] items-center justify-center overflow-hidden border-b border-r border-line bg-cobalt-5 [&:nth-child(3n)]:border-r-0 md:[&:nth-child(3n)]:border-r md:[&:nth-child(6n)]:border-r-0 ${DITHER[i] ? 'tex-dither-light' : ''}`}
            style={DITHER[i] ? { backgroundPosition: DITHER[i] } : undefined}
          >
            {/* MOTION: logo wrapper translateY(-15%) .2s ease-out on hover; strip slides in (§3.5).
                The wrapper fills the tile (as .homeLogoImage does on the original) so -15% = -15.15px. */}
            <div className={`logo-tile-img flex min-h-[74px] w-full self-stretch items-center justify-center px-4 py-3 text-navy ${hasCta ? 'group-hover:-translate-y-[15%]' : ''}`}>
              <PlaceholderLogo logo={logo} fluid className="h-[var(--logo-h-sm)] w-auto max-w-[135px] md:h-[var(--logo-h)] md:max-w-[180px]" style={{ '--logo-h': `${LOGO_HEIGHTS[i]}px`, '--logo-h-sm': `${LOGO_HEIGHTS[i] * 0.75}px` }} />
            </div>
            {hasCta && (
              <span className="logo-tile-cta absolute inset-x-0 bottom-0 flex h-8 translate-y-8 items-center justify-center gap-1 border-t border-line bg-cobalt-5 font-mono text-2xs font-medium leading-[10px] text-cobalt opacity-0 hover:text-cobalt-100 group-hover:translate-y-0 group-hover:opacity-100 md:text-xs md:leading-3">
                Read case study <ArrowRight size={10} />
              </span>
            )}
          </Tag>
        )
      })}
    </div>
  )
}

function Testimonial() {
  return (
    <div className="relative grid grid-cols-1 border-x border-b border-line bg-cobalt-5 lg:grid-cols-[repeat(3,minmax(0,1fr))] lg:border-b-0 wide:grid-cols-[383px_383px_383px]">
      {/* Flank dither blocks (desktop only) */}
      <div
        aria-hidden="true"
        className="tex-dither-light absolute bottom-0 hidden h-[110px] w-[214px] border border-line wide:block"
        style={{ right: 'min(50% + 600px, 100% - 1px)', backgroundPosition: '-300px -200px' }}
      />
      <div
        aria-hidden="true"
        className="tex-dither-light absolute top-0 hidden h-[110px] w-[214px] border border-line wide:block"
        style={{ left: 'min(50% + 600px, 100% - 1px)', backgroundPosition: '-520px -260px' }}
      />

      {/* B2 portrait */}
      <Media
        slot="home.hero.testimonial"
        alt="Portrait of a sustainability lead"
        className="block h-[448px] w-full lg:h-[385px] wide:h-[398px] wide:w-[382px]"
        style={{ objectPosition: '50% 20%' }}
      />

      {/* Stat + quote share columns 2-3 as one flex row from lg (as .testimonialContent). 1024-1279: the
          card is fluid (32px margins, 24px padding, stretches to the quote's height) and the row is centred
          above a 14px gap; >=1280: 288 square card centred in a 383 column, quote 431 wide overhanging it by 48. */}
      <div className="contents lg:col-span-2 lg:mb-[14px] lg:flex lg:self-center wide:mb-0 wide:self-stretch">
      {/* Stat card */}
      <div className="flex items-center justify-center px-8 pt-8 lg:my-8 lg:ml-8 lg:w-[calc(31.36%+30.5px)] lg:shrink-0 lg:items-stretch lg:p-0 wide:-mr-12 wide:my-0 wide:ml-0 wide:w-[383px] wide:items-start wide:pt-12">
        <div className="flex w-full flex-col justify-between gap-[21px] border border-line p-4 lg:gap-0 lg:p-6 wide:h-[288px] wide:w-[288px] wide:p-8">
          <PlaceholderLogo logo={{ name: 'Acme', mark: 'circle' }} height={24} className="h-6 opacity-[.85] lg:h-8" style={{ color: '#131b24' }} />
          <div>
            <p className="text-[40px] font-light leading-[48px] text-cobalt lg:text-9xl lg:leading-[86.4px]">
              12k<span className="font-mono" style={{ fontWeight: 250 }}>↘</span>
            </p>
            <p className="mt-6 font-mono text-xs font-medium leading-[14.4px] text-ink-secondary lg:text-sm lg:leading-[16.8px]">tonnes of CO₂e, per year</p>
          </div>
        </div>
      </div>

      {/* Quote: 431 wide, overhangs column 2 */}
      <div className="flex flex-col justify-center gap-4 px-8 pb-8 pt-[21px] lg:min-w-0 lg:flex-1 lg:gap-6 lg:py-12 lg:pl-8 lg:pr-12 wide:h-[384px] wide:w-[431px] wide:flex-none">
        {/* Each word in its own span (hook for word-level motion if added later) */}
        <blockquote className="font-serif text-[22px] font-medium leading-[27.5px] text-ink lg:text-4xl lg:leading-10">
          {'Northwind is helping us cut 12,000 tonnes of emissions a year, thanks to one trusted, shared source of climate data for all.'.split(' ').map((w, i) => (
            <span key={i}>{w} </span>
          ))}
        </blockquote>
      </div>
      </div>
    </div>
  )
}

// §3.1 Eyebrow ticker, measured on the original (rAF-sampled):
// - period 4500ms; first change 4.5s after mount
// - exit: transition transform 220ms cubic-bezier(.4,0,1,1), opacity 220ms -> translateY(-6px), opacity 0
// - +133ms: transition none, translateY(6px), opacity 0, swap message + dot colour, all cells blank
// - next frame: transition transform 320ms cubic-bezier(0,0,.2,1), opacity ~31ms*len ease-out -> 0 / 1
// - decode: cell i gets a random block glyph at 17 + 38*i ms, re-rolled every ~61ms, resolves 183ms later
//   (3-5 glyph cells trail the front); spaces stay blank. Reduced motion: static first message.
const GLYPHS = '▓▒░█■□▪▫▀▄'
const T_PERIOD = 4500
const T_SWAP = 133
const CH_STEP = 38
const CH_LIFE = 183
const GLYPH_HOLD = 61

function HeroTicker() {
  const pRef = useRef(null)
  const dotRef = useRef(null)
  const textRef = useRef(null)
  useEffect(() => {
    if (prefersReducedMotion()) return undefined
    const p = pRef.current
    const text = textRef.current
    let idx = 0
    let raf = 0
    const timers = []
    const later = (fn, ms) => timers.push(setTimeout(fn, ms))
    const pick = (i, bucket) => GLYPHS[(i * 7 + bucket * 13 + ((Math.random() * GLYPHS.length) | 0)) % GLYPHS.length]

    const decode = (msg) => {
      const chars = [...msg]
      text.textContent = ''
      const cells = chars.map(() => {
        const c = document.createElement('span')
        c.className = 'inline-block w-[1ch]'
        c.textContent = ' '
        text.appendChild(c)
        return c
      })
      const state = chars.map(() => -1) // last glyph bucket rendered
      const t0 = performance.now()
      const total = 17 + CH_STEP * (chars.length - 1) + CH_LIFE
      const frame = (now) => {
        const e = now - t0
        for (let i = 0; i < chars.length; i++) {
          if (chars[i] === ' ') continue
          const start = 17 + CH_STEP * i
          if (e < start) break
          if (e >= start + CH_LIFE) {
            if (state[i] !== -2) {
              cells[i].textContent = chars[i]
              state[i] = -2
            }
          } else {
            const bucket = Math.floor((e - start) / GLYPH_HOLD)
            if (state[i] !== bucket) {
              cells[i].textContent = pick(i, bucket)
              state[i] = bucket
            }
          }
        }
        if (e < total) raf = requestAnimationFrame(frame)
      }
      raf = requestAnimationFrame(frame)
    }

    const cycle = () => {
      p.style.transition = 'transform 220ms cubic-bezier(0.4, 0, 1, 1), opacity 220ms'
      p.style.transform = 'translateY(-6px)'
      p.style.opacity = '0'
      later(() => {
        idx = (idx + 1) % TICKER_MESSAGES.length
        const msg = TICKER_MESSAGES[idx]
        p.style.transition = 'none'
        p.style.transform = 'translateY(6px)'
        p.style.opacity = '0'
        p.setAttribute('aria-label', msg.text)
        dotRef.current.style.background = msg.dot
        decode(msg.text)
        requestAnimationFrame(() => {
          void p.offsetHeight
          p.style.transition = `transform 320ms cubic-bezier(0, 0, 0.2, 1), opacity ${Math.round(31 * msg.text.length)}ms ease-out`
          p.style.transform = 'translateY(0)'
          p.style.opacity = '1'
        })
      }, T_SWAP)
    }
    const iv = setInterval(cycle, T_PERIOD)
    return () => {
      clearInterval(iv)
      timers.forEach(clearTimeout)
      cancelAnimationFrame(raf)
    }
  }, [])

  const msg = TICKER_MESSAGES[0]
  return (
    <p
      ref={pRef}
      className="flex items-center gap-2 font-mono text-xs leading-[14.4px] text-ink md:text-sm md:leading-[16.8px]"
      style={{ fontVariantNumeric: 'tabular-nums', willChange: 'transform, opacity' }}
      aria-label={msg.text}
    >
      <span ref={dotRef} className="h-2 w-2 shrink-0" style={{ background: msg.dot }} />
      <span ref={textRef} className="hero-ticker whitespace-nowrap" aria-hidden="true">
        {[...msg.text].map((ch, i) => (
          <span key={i} className="inline-block w-[1ch]">
            {ch === ' ' ? ' ' : ch}
          </span>
        ))}
      </span>
    </p>
  )
}
