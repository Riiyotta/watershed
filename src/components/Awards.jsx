import { useRef } from 'react'
import { Link } from 'react-router-dom'
import Button from './Button.jsx'
import { EASE, useSteppedLoop } from '../motion.js'
import { href } from '../routing.js'
import { ArrowRight } from './Icons.jsx'

// keen-slider auto-advance measured on the original: one slide every 2400ms, 860ms movement (EASE.awards),
// loops forever; vertical >=1024px, horizontal below. The step comes from keen's layout (perView 2.5, 16px
// spacing): (viewport + 16) / 2.5 = 149.6px desktop (358px tall) / 148.8px mobile (356px wide). Slides are
// sized with container units so the loop reads that pitch from the DOM.
const isDesktop = () => window.matchMedia('(min-width: 1024px)').matches

// §2.4 Text + awards box. Badges are placeholder squares (ASSET_MANIFEST §C); each links to an analyst-report page.
const BADGES = [
  { top: 'Analyst review', big: 'Top rated', year: '2026', bg: 'linear-gradient(135deg,#c1d2fe,#658dfd)', to: '/verdantix-2026' },
  { top: 'Category index', big: 'Leader', year: '2026', bg: 'linear-gradient(135deg,#e5e9f0,#93aeff)', to: '/forrester-wave-2026' },
  { top: 'Innovation list', big: 'Featured', year: '2025', bg: 'linear-gradient(135deg,#ffe2d6,#ff9966)', to: '/verdantix-smart-innovators-2026' },
  { top: 'Peer survey', big: 'Strong', year: '2025', bg: 'linear-gradient(135deg,#d7f7f4,#1d7368)', to: '/verdantix-2025' },
  { top: 'Annual award', big: 'Winner', year: '2026', bg: 'linear-gradient(135deg,#f5f8ff,#265cff)', to: '/verdantix-2026' },
  { top: 'Market study', big: 'Leader', year: '2025', bg: 'linear-gradient(135deg,#e3ebff,#0b2471)', to: '/forrester-wave-2026' },
  { top: 'Data quality', big: 'Gold', year: '2026', bg: 'linear-gradient(135deg,#fff3d6,#d4a855)', to: '/verdantix-smart-innovators-2026' },
  { top: 'Buyer guide', big: 'Pick', year: '2026', bg: 'linear-gradient(135deg,#e5e9f0,#232c40)', to: '/verdantix-2025' },
]

const PARAGRAPH =
  'Northwind is regularly reviewed by independent research firms that compare climate software. In recent evaluations, analysts rated the platform highly for data quality, supplier engagement and reporting workflows, and placed it among the strongest offerings in its category. Their reports looked at more than a dozen criteria, from methodology and auditability to ease of use, and found strengths across measurement, disclosure and reduction planning for large organisations.'
const BUTTONS = [
  { label: 'Read the analyst summary', to: '/verdantix-2026', variant: 'primary', shine: true },
  { label: 'Download the full review', to: '/forrester-wave-2026', variant: 'light' },
]

function Badge({ b, size }) {
  const big = size >= 200
  return (
    <div className="flex flex-col justify-between border border-[rgba(4,19,48,.12)] text-white" style={{ width: size, height: size, background: b.bg, padding: big ? 16 : 6 }} role="img" aria-label={`${b.big} ${b.year} badge (placeholder)`}>
      <span className={`font-mono ${big ? 'text-xs' : 'text-[7px] leading-[8px]'} text-ink`}>{b.top}</span>
      <span>
        <span className={`block font-semibold leading-none text-night ${big ? 'text-4xl' : 'text-xs'}`}>{b.big}</span>
        <span className={`block font-medium leading-none text-night ${big ? 'mt-2 text-2xl' : 'mt-1 text-[10px]'}`}>{b.year}</span>
      </span>
    </div>
  )
}

// Props (all optional; defaults = homepage §2.4). TextWithAwards (PAGES_SPEC §0) = paragraph (L14) + cta 'mono-link'.
//   eyebrow, title: strings; paragraph: string/node
//   cta: 'buttons' (homepage: primary shine + light, both withArrow) | 'mono-link' (§1.3 cta-link-mono)
//   buttons: [{ label, to, variant: 'primary'|'light'|'outline', shine }]  (cta 'buttons')
//   link: { label, to }                                                     (cta 'mono-link')
export default function Awards({
  eyebrow = 'Independent analyst reviews',
  title = 'A highly rated platform for climate data teams',
  paragraph = PARAGRAPH,
  cta = 'buttons',
  buttons = BUTTONS,
  link = { label: 'Read the analyst summary', to: '/verdantix-2026' },
}) {
  const trackRef = useRef(null)
  useSteppedLoop(trackRef, { interval: 2400, duration: 860, easing: EASE.awards, period: BADGES.length - 1, vertical: isDesktop })
  return (
    <section className="bg-white py-[43px] md:py-section">
      <div className="container-ws flex flex-col gap-8 py-4 lg:flex-row md:py-6 lg:items-center lg:justify-between lg:gap-16">
        <div className="flex flex-col gap-4 lg:w-[520px] lg:min-w-0 md:gap-6 wide:shrink-0">
          {eyebrow && <p className="t-eyebrow">{eyebrow}</p>}
          <h2 className="t-h2">{title}</h2>
          <p className="t-lead mt-[11px] md:mt-4">{paragraph}</p>
          <div className="mt-[31px] flex flex-wrap gap-2 md:mt-9 md:gap-3">
            {cta === 'mono-link' ? (
              // §1.3 cta-link-mono: Mono 14/15.4 500 #265cff + arrow (390: 12/13.2); mono CTA hover opacity (§3.12)
              <Link to={href(link.to)} className="inline-flex items-center gap-1 font-mono text-xs font-medium leading-[13.2px] text-cobalt transition-opacity duration-200 hover:opacity-75 md:text-sm md:leading-[15.4px]">
                {link.label} <ArrowRight size={12} />
              </Link>
            ) : (
              buttons.map((b) => (
                <Button key={b.label} as={Link} to={href(b.to)} variant={b.variant} arrow shine={b.shine}>
                  {b.label}
                </Button>
              ))
            )}
          </div>
        </div>

        {/* Awards box 520x360 (mobile 358x444) */}
        <div
          className="flex h-[444px] w-full flex-col overflow-hidden border border-line bg-cobalt-5 lg:h-[300px] lg:w-[400px] lg:shrink-0 lg:flex-row wide:h-[360px] wide:w-[520px]"
          style={{ backgroundImage: 'var(--dot-grid-awards)', backgroundSize: '4px 4px' }}
        >
          <Link to={href(BADGES[0].to)} className="flex h-[242px] shrink-0 items-center justify-center p-[21px] hover:opacity-80 lg:h-auto lg:min-w-0 lg:flex-1 lg:p-0 wide:w-[318px] wide:flex-none">
            <div className="shadow-badge">
              <Badge b={BADGES[0]} size={200} />
            </div>
          </Link>
          {/* Auto-slider: vertical on desktop, horizontal on mobile, (viewport+16)/2.5 pitch.
              Stepped loop via useSteppedLoop (values above). */}
          <div className="relative flex-1 overflow-hidden border-t border-line-soft [container-type:size] lg:w-[160px] lg:flex-none lg:border-l lg:border-t-0 wide:w-[200px]">
            <div ref={trackRef} className="awards-track flex h-full will-change-transform lg:h-auto lg:flex-col">
              {BADGES.slice(1).concat(BADGES.slice(1)).map((b, i) => (
                <Link key={i} to={href(b.to)} className="flex h-full w-[calc((100cqw+16px)/2.5)] shrink-0 items-center justify-center lg:h-[calc((100cqh+16px)/2.5)] lg:w-full">
                  <span className="block transition-transform duration-200 hover:scale-[1.02]">
                    <Badge b={b} size={80} />
                  </span>
                </Link>
              ))}
            </div>
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-10" style={{ background: 'linear-gradient(to top, rgba(240,244,255,.36), transparent)' }} />
          </div>
        </div>
      </div>
    </section>
  )
}
