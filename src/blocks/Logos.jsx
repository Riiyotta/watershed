import PlaceholderLogo, { LOGOS } from '../components/PlaceholderLogo.jsx'

// §3.3 Logos (.small / .medium). Strip mechanics = homepage §3.6 (monotone #666c80 layer, colour layer on hover).
const COLOURS = ['#265cff', '#1b7a5a', '#ff6633', '#0b2471', '#1d7368', '#ff9966']
const HEIGHTS = [20, 24, 18, 22, 26, 19, 23]

export function LogoStrip({ count = 18, mono = '#666c80', className = '' }) {
  const slides = Array.from({ length: count }, (_, i) => ({ logo: LOGOS[i % LOGOS.length], h: HEIGHTS[i % HEIGHTS.length], c: COLOURS[i % COLOURS.length] }))
  return (
    <div className={`overflow-hidden ${className}`} style={{ WebkitMaskImage: 'var(--logo-carousel-mask-image)', maskImage: 'var(--logo-carousel-mask-image)' }}>
      {/* MOTION: stepped keen-slider advance (homepage §3.6); IntersectionObserver threshold 0 starts/stops it; wrapper opacity .4s ease */}
      <div className="flex h-full items-center gap-16 md:gap-32">
        {slides.map((s, i) => (
          <div key={i} className="group relative flex shrink-0 items-center">
            {/* MOTION: monotone/colour swap opacity .25s ease-in-out */}
            <PlaceholderLogo logo={s.logo} height={s.h} className="h-[14px] w-auto opacity-60 group-hover:opacity-0 md:h-auto" style={{ color: mono }} />
            <PlaceholderLogo logo={s.logo} height={s.h} className="absolute left-0 h-[14px] w-auto opacity-0 group-hover:opacity-100 md:h-auto" style={{ color: s.c }} />
          </div>
        ))}
      </div>
    </div>
  )
}

// Measured (all instances, 1440/390): section padding 16 (small) / 40 (medium), 390: 11. The label sits LEFT in the
// 1200 container (padding 24; 390: 16) and is set in capitals in the original copy; the strip below is full-bleed with
// padding-bottom 40 (390: 27), logos ~46 tall (390: ~29). Totals: small 186 / medium 234 (390: 129 / 129).
export default function Logos({ size = 'small', label = 'Trusted by climate teams worldwide' }) {
  return (
    <section className={size === 'medium' ? 'py-[11px] md:py-10' : 'py-[11px] md:py-4'}>
      <div className="mx-auto max-w-[1200px] p-4 md:p-6">
        <p className="t-eyebrow uppercase tracking-[-0.14px]">{label}</p>
      </div>
      <div className="pb-[27px] md:pb-10">
        <LogoStrip className="h-[29px] w-full md:mx-auto md:h-[46px] md:max-w-[1260px]" />
      </div>
    </section>
  )
}
