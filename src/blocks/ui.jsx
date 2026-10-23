import { Link } from 'react-router-dom'
import Button from '../components/Button.jsx'
import { ArrowCircle, ArrowRight, ChevronLeft16 } from '../components/Icons.jsx'
import Media from '../components/Media.jsx'
import { href } from '../routing.js'
import { Inline } from '../primitives/index.js'
import './blocks.css'

// Shared bits for the block library (not a design primitive: only glue used by several blocks).

const isExternal = (to) => /^https?:\/\//.test(to)

// Internal paths → <Link to={href(path)}>; external URLs are not linked (the clone never leaves the site).
export function SmartLink({ to = '/demo', className = '', children, ...rest }) {
  if (isExternal(to)) {
    return (
      <span className={className} {...rest}>
        {children}
      </span>
    )
  }
  return (
    <Link to={href(to)} className={className} {...rest}>
      {children}
    </Link>
  )
}

// Homepage Button (CLONE_SPEC §3.4) routed through SmartLink.
export function Cta({ to = '/demo', label, variant = 'primary', arrow = false, shine = false, className = '' }) {
  if (isExternal(to)) {
    return (
      // No external links: same styling, rendered as a non-link button
      <Button as="button" type="button" variant={variant} arrow={arrow} shine={shine} className={className}>
        {label}
      </Button>
    )
  }
  return (
    <Button as={Link} to={href(to)} variant={variant} arrow={arrow} shine={shine} className={className}>
      {label}
    </Button>
  )
}

export function Nudge({ size = 14, group = false }) {
  // MOTION: transform .13s ease-out (§1.3) / .2s ease-in-out on cards (§3.7)
  return <ArrowRight size={size} className={`${group ? 'b-nudge-g' : 'b-nudge'} shrink-0`} />
}

// §1.3 cta-link-mono
export function MonoCta({ to, label }) {
  return (
    <SmartLink to={to} className="b-cta-mono">
      {label}
      <Nudge />
    </SmartLink>
  )
}

// §1.3 Button.colorTextMono / colorTextDefault
export function TextLink({ to, label, mono = true, className = '' }) {
  return (
    <SmartLink to={to} className={`${mono ? 'b-text-mono' : 'b-text-default'} ${className}`}>
      {label}
      <Nudge />
    </SmartLink>
  )
}

export function PlayGlyph({ size = 12, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" className={className} aria-hidden="true">
      <path d="M2.5 1.5v9l8-4.5z" fill="currentColor" />
    </svg>
  )
}

// §1.3 VideoLink
export function VideoLink({ label }) {
  return (
    <button type="button" className="b-video-link">
      <PlayGlyph />
      {label}
    </button>
  )
}

// Video placeholder: same-size Media with a play-button overlay (no embeds).
// size: 'xl' = Hero.videoRoot 160x160 white triangle 46x56; 'sq' = QuoteVideo 80x80 cobalt square.
export function VideoMedia({ slot, tone = 'dark', className = '', play = 'sq', label = 'Play video' }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Media slot={slot} tone={tone} className="absolute inset-0 h-full w-full" />
      {play === 'xl' ? (
        // MOTION: hover transform/box-shadow .18s ease (§3.2)
        <button
          type="button"
          aria-label={label}
          className="absolute left-1/2 top-1/2 flex h-[120px] w-[120px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-btn bg-white/10 backdrop-blur-[4px] md:h-40 md:w-40"
          style={{ boxShadow: '0 12px 40px rgba(0,0,0,.24)' }}
        >
          <span
            aria-hidden="true"
            className="ml-[6px] block h-0 w-0 border-y-[14px] border-l-[23px] border-y-transparent border-l-white md:ml-3 md:border-y-[28px] md:border-l-[46px]"
          />
        </button>
      ) : (
        // MOTION: hover opacity .8, transition bg/opacity .12s (§3.21)
        <button
          type="button"
          aria-label={label}
          className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-cobalt text-white hover:opacity-80 md:h-20 md:w-20"
        >
          <PlayGlyph size={20} />
        </button>
      )}
    </div>
  )
}

// QuoteMark 33x28
export function QuoteMark({ className = '', color = '#c1d2fe' }) {
  return (
    <svg width="33" height="28" viewBox="0 0 33 28" fill="none" className={`shrink-0 ${className}`} aria-hidden="true">
      <path d="M0 28V16.6C0 7.4 5.2 1.7 13.4 0l1.6 3.3C10.1 4.9 7.6 8.2 7.4 12.8H14V28H0zm18.6 0V16.6C18.6 7.4 23.8 1.7 32 0l1 3.3c-4.9 1.6-7.4 4.9-7.6 9.5h6.6V28H18.6z" fill={color} />
    </svg>
  )
}

export function CheckIcon({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={`shrink-0 ${className}`} aria-hidden="true">
      <path d="M3 8.5l3.2 3L13 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function CrossIcon({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={`shrink-0 ${className}`} aria-hidden="true">
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

// 40x40 circle arrows as on the homepage carousel (prev #c1d2fe, next #658dfd). §3.6
export function CircleArrows({ index, max, setIndex, className = '', gap = 'gap-2' }) {
  return (
    <div className={`flex shrink-0 ${gap} ${className}`}>
      <button
        type="button"
        aria-label="Previous"
        disabled={index <= 0}
        onClick={() => setIndex(Math.max(0, index - 1))}
        className={`h-10 w-10 ${index <= 0 ? 'text-cobalt-20 opacity-40' : 'text-cobalt-20 hover:text-cobalt-40'}`}
      >
        <ArrowCircle dir="left" />
      </button>
      <button
        type="button"
        aria-label="Next"
        disabled={index >= max}
        onClick={() => setIndex(Math.min(max, index + 1))}
        className={`h-10 w-10 ${index >= max ? 'text-cobalt-20 opacity-40' : 'text-cobalt-40 hover:text-cobalt'}`}
      >
        <ArrowCircle dir="right" />
      </button>
    </div>
  )
}

// 32x32 prev/next + dots row (PageLinkSet §3.7)
export function DotsNav({ index, count, setIndex }) {
  return (
    <div className="flex items-center justify-center gap-4">
      <button type="button" aria-label="Previous" onClick={() => setIndex(Math.max(0, index - 1))} className="flex h-8 w-8 items-center justify-center p-2 text-ink-secondary hover:opacity-70">
        <ChevronLeft16 />
      </button>
      <div className="flex items-center gap-2">
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
            className={`h-2 w-2 rounded-full ${i === index ? 'bg-cobalt' : 'bg-cobalt-20'}`}
          />
        ))}
      </div>
      <button type="button" aria-label="Next" onClick={() => setIndex(Math.min(count - 1, index + 1))} className="flex h-8 w-8 rotate-180 items-center justify-center p-2 text-ink-secondary hover:opacity-70">
        <ChevronLeft16 />
      </button>
    </div>
  )
}

// Rich text renderer for the SectionTextBlock 18/27 band: nodes are { h2|h3|h4|p|ul|ol|quote|aside|img|table }.
// Inline markup ([label](/path), **bold**) uses the shared primitive's Inline.
export { Inline }

export function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function RichText({ nodes = [], slotPrefix = 'prose' }) {
  return nodes.map((n, i) => {
    if (n.h2) return <h2 key={i} id={slugify(n.h2)}>{n.h2}</h2>
    if (n.h3) return <h3 key={i} id={slugify(n.h3)}>{n.h3}</h3>
    if (n.h4) return <h4 key={i}>{n.h4}</h4>
    if (n.p) return <p key={i}><Inline text={n.p} /></p>
    if (n.ul) return <ul key={i}>{n.ul.map((li, j) => <li key={j}><Inline text={li} /></li>)}</ul>
    if (n.ol) return <ol key={i}>{n.ol.map((li, j) => <li key={j}><Inline text={li} /></li>)}</ol>
    if (n.quote) return <blockquote key={i}><p className="mb-0"><Inline text={n.quote} /></p></blockquote>
    if (n.aside) return <aside key={i} className="blog-aside"><p className="mb-0"><Inline text={n.aside} /></p></aside>
    if (n.annotation)
      return (
        <div key={i} className="!my-12 border-y border-midnight py-6 min-[1224px]:hidden">
          <Media slot={`${slotPrefix}.annotation.${i}`} tone={n.tone ?? 'neutral'} className="w-full" style={{ aspectRatio: '358 / 239' }} />
        </div>
      )
    if (n.img)
      return (
        <figure key={i} className={`photo ${n.size ? `maxWidth-${n.size}` : ''}`}>
          <Media slot={`${slotPrefix}.${i}`} tone={n.tone ?? 'neutral'} className="w-full" style={{ aspectRatio: n.ratio ?? '16 / 9' }} />
          {n.caption && <figcaption>{n.caption}</figcaption>}
        </figure>
      )
    if (n.table)
      return (
        <div key={i} className="table-embedded overflow-x-auto">
          <table>
            <thead>
              <tr>{n.table.head.map((h) => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {n.table.rows.map((r, j) => (
                <tr key={j}>{r.map((c, k) => <td key={k}><Inline text={c} /></td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    return null
  })
}
