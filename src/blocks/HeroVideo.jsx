import { Cta, VideoMedia } from './ui.jsx'

// §3.2 Hero.videoRoot. bg linear-gradient(#f5f8ff, #fff). 390 (measured /platform/disclosures): padding 85 0 53, x 8,
// H1 36/36 -1.44, gaps 43 (shell) / 21 (header) / 16 (meta) / 11 (buttons), play button 120x120.
export default function HeroVideo({ title, sub, primary = { label: 'Get a demo', to: '/demo' }, secondary, slot = 'product.heroVideo.0' }) {
  return (
    <header className="pb-[53px] pt-[85px] md:pb-20 md:pt-32" style={{ background: 'linear-gradient(#f5f8ff 0%, #fff 100%)' }}>
      <div className="mx-auto flex max-w-[1200px] flex-col gap-[43px] px-2 md:gap-16 md:px-6">
        <div className="flex flex-col gap-[21px] md:gap-8">
          <h1 className="b-display max-w-[812px] !text-[36px] !leading-[36px] !tracking-[-1.44px] md:!text-[64px] md:!leading-[64px] md:!tracking-[-2.56px]">{title}</h1>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-6">
            <p className="t-lead max-w-[720px]">{sub}</p>
            <div className="flex shrink-0 flex-wrap gap-[11px] md:gap-4">
              {primary && <Cta {...primary} shine />}
              {secondary && <Cta {...secondary} variant="light" />}
            </div>
          </div>
        </div>
        {/* Poster + autoplay muted preroll in the original; placeholder with play button here */}
        <VideoMedia slot={slot} tone="dark" play="xl" className="aspect-video w-full rounded-btn bg-night" />
      </div>
    </header>
  )
}
