import PlaceholderLogo, { LOGOS } from '../components/PlaceholderLogo.jsx'
import { Nudge, SmartLink } from './ui.jsx'

// §3.27 TextWithLogos.gridRoot: 3x184 logo grid (cells 185x105) on a dither texture, one 2-col CTA cell.
const CELLS = ['logo', 'cutout', 'logo', 'empty', 'logo', 'cutout', 'cta', null, 'logo', 'logo', 'empty', 'cutout']

export default function TextWithLogos({ title, body, cta = { label: 'See all customer stories', to: '/customers' } }) {
  let n = 0
  return (
    <section className="pb-16 pt-24 md:pb-section md:pt-40">
      <div className="container-ws flex flex-col gap-12 wide:flex-row">
        <div className="flex flex-col gap-4 wide:w-[520px] wide:shrink-0">
          <h2 className="text-lg font-medium leading-[21.06px] tracking-[-0.54px] text-ink md:text-5xl md:leading-[42.12px] md:tracking-[-1.08px]">{title}</h2>
          <p className="t-lead">{body}</p>
        </div>
        <div className="relative wide:ml-auto">
          {/* overflowTile pokes out to the left of the grid */}
          <div aria-hidden="true" className="absolute -left-[60px] top-[105px] hidden h-[105px] w-[60px] border border-cobalt-20 bg-white wide:block" />
          {/* MOTION: logo swap opacity/transform .4s cubic-bezier(.22,1,.36,1), timed */}
          <div className="tex-dither-light grid grid-cols-3 md:w-[555px]">
            {CELLS.map((c, i) => {
              if (c === null) return null
              if (c === 'cta') {
                return (
                  <SmartLink key={i} to={cta.to} className="group col-span-2 flex h-[105px] items-end border border-cobalt-20 bg-cobalt-10 p-2">
                    <span className="flex items-center gap-2 text-xs font-normal leading-[16.8px] text-cobalt md:text-xl md:leading-[29.4px]">
                      {cta.label}
                      {/* MOTION: arrow moves on hover .2s */}
                      <Nudge group />
                    </span>
                  </SmartLink>
                )
              }
              if (c === 'logo') {
                const logo = LOGOS[n++ % LOGOS.length]
                return (
                  <div key={i} className="flex h-[105px] items-center justify-center border border-cobalt-30 bg-white">
                    <PlaceholderLogo logo={logo} height={20} className="max-w-[110px] text-ink-secondary" />
                  </div>
                )
              }
              if (c === 'cutout') return <div key={i} className={`h-[105px] border ${i % 2 ? 'border-cobalt-20' : 'border-cobalt-30'}`} />
              return <div key={i} className="h-[105px] bg-white" />
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
