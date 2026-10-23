import Media from '../components/Media.jsx'
import PlaceholderLogo, { LOGOS } from '../components/PlaceholderLogo.jsx'
import { PlayGlyph } from './ui.jsx'

// §3.21 QuoteVideo (.medium bg #ebece4 / .small bg #e3ebff).
// Measured 1440 (/platform/sustainability-ai): section padding 96 (small 64) + container padding 24, callout 1152x433.
// The 767x431 thumbnail sits at the left and fades into the callout colour; the quote pane spans columns 8-12
// (x 816, 479 wide, padding 32 48 32 32) and overlaps the faded edge. The 80x80 cobalt play trigger is centred on
// the callout. Meta: name 16/20 500 -0.48, title 14/17.5 500, logo 115 wide, gap 24.
// 390: section padding 64 0 32, container padding 16; image 356x200 on top with a 53x53 play trigger; pane padding
// 16 21, gap 21; quote 18/22.5 -0.36; name 13/16.25 -0.39; title 12/15 -0.12.
export default function QuoteVideo({ size = 'medium', quote, name, role, logo = 3, slot = 'product.qv.0' }) {
  const bg = size === 'medium' ? '#ebece4' : '#e3ebff'
  return (
    <section className={size === 'medium' ? 'pb-8 pt-16 md:py-section' : 'pb-8 pt-[43px] md:py-16'}>
      <div className="mx-auto max-w-[1200px] p-4 md:p-6">
        <article className="relative overflow-hidden rounded-btn border border-[rgba(36,38,51,.1)] lg:grid lg:h-[433px] lg:grid-cols-12" style={{ background: bg }}>
          {/* medium: autoplay muted preroll in the original */}
          <div className="relative aspect-[356/200] w-full lg:absolute lg:inset-y-0 lg:left-0 lg:aspect-auto lg:w-2/3 xl:w-[767px]">
            <Media slot={slot} tone="warm" className="absolute inset-0 h-full w-full" />
            <div aria-hidden="true" className="absolute inset-0 hidden lg:block" style={{ background: `linear-gradient(to right, transparent 55%, ${bg} 100%)` }} />
          </div>
          {/* MOTION: hover opacity .8, transition bg/opacity .12s (§3.21) */}
          <button
            type="button"
            aria-label="Play video"
            className="absolute left-1/2 top-[74px] flex h-[53px] w-[53px] -translate-x-1/2 items-center justify-center bg-cobalt text-white hover:opacity-80 lg:top-1/2 lg:h-20 lg:w-20 lg:-translate-y-1/2"
          >
            <PlayGlyph size={20} />
          </button>
          <div className="relative flex flex-col justify-end gap-[21px] px-[21px] py-4 lg:col-span-5 lg:col-start-8 lg:gap-8 lg:pb-8 lg:pl-8 lg:pr-12 lg:pt-8">
            <blockquote className="font-serif text-lg font-normal leading-[22.5px] tracking-[-0.36px] text-night md:text-2xl md:leading-[30px] md:tracking-[-0.48px]">“{quote}”</blockquote>
            <div className="flex items-center justify-between gap-4 md:gap-6">
              <div className="flex flex-col gap-[3px] md:gap-1">
                <p className="text-[13px] font-medium leading-[16.25px] tracking-[-0.39px] text-night md:text-md md:leading-5 md:tracking-[-0.48px]">{name}</p>
                <p className="text-xs font-medium leading-[15px] tracking-[-0.12px] text-night md:text-sm md:leading-[17.5px] md:tracking-[-0.14px]">{role}</p>
              </div>
              <PlaceholderLogo logo={LOGOS[logo % LOGOS.length]} height={22} className="max-w-[115px] text-night" />
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
