import Media from '../components/Media.jsx'
import GlowField from './GlowField.jsx'
import { EmailCatcher } from './primitives.jsx'

// §3.34 EnergyForecast hero (/solutions/energy-management): canvas substitute, email catcher, glass frame with prompt pill + chart.
// Measured 1440: header padding 96 + container padding 24, intro → frame gap 80; eyebrow → H1 32, H1 → sub 24,
// sub → form 32; H1 72/72 up to 1152 wide. glassFrame 752x332, bg rgba(1,1,1,.55), radius 10, padding 0 16 24, gap 16;
// the prompt pill (416x62 outer ring bg rgba(4,19,48,.24) + 1px rgba(255,255,255,.48), padding 8; inner 398x44 white
// pill, 16/19.2 600) straddles the frame top by 30; chart 720x260. Wrapper padding-bottom 24.
// 390: header padding 43, container padding 16, gap 53; eyebrow → H1 21, then 16 / 16; H1 32/32 -1.28;
// frame 358x174, padding 0 11 16, gap 11; pill 319x56 (inner 301x38, 12/14.4); chart 336x121.
export default function EnergyForecast({ eyebrow, title, sub, prompt, note }) {
  return (
    <div className="pb-4 md:pb-6">
      <header className="relative overflow-hidden bg-white py-[43px] md:py-section">
        <GlowField warm />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[513px]" style={{ background: 'linear-gradient(#fff 0%, #fff 40%, rgba(255,255,255,.62) 68%, transparent 100%)' }} />
        <div className="relative mx-auto flex max-w-[1200px] flex-col items-center gap-[53px] p-4 md:gap-20 md:p-6">
          <div className="flex flex-col items-center text-center">
            <p className="t-eyebrow">{eyebrow}</p>
            <h1 className="b-display-xl mt-[21px] max-w-[1152px] !leading-[32px] !tracking-[-1.28px] md:mt-8 md:!leading-[72px] md:!tracking-[-2.88px]">{title}</h1>
            <p className="t-body-lg mt-4 max-w-[702px] md:mt-6">{sub}</p>
            <div className="mt-4 w-full max-w-[552px] md:mt-8">
              <EmailCatcher submitLabel="Get notified" label="Your email" />
            </div>
          </div>
          <div className="relative flex w-full max-w-[752px] flex-col items-center gap-[11px] rounded-[10px] px-[11px] pb-4 md:gap-4 md:px-4 md:pb-6" style={{ background: 'rgba(1,1,1,.55)', boxShadow: 'var(--shadow-glass-edge)' }}>
            <div className="-mt-[30px] rounded-[1000px] border border-white/[.48] bg-[rgba(4,19,48,.24)] p-2 md:-mt-[30px]">
              <p className="flex h-[38px] max-w-[301px] items-center gap-[5px] rounded-[1000px] border border-white px-[11px] py-[7px] text-xs font-semibold leading-[14.4px] tracking-[-0.12px] text-ink md:h-11 md:max-w-[398px] md:gap-2 md:px-4 md:py-[10px] md:text-md md:leading-[19.2px] md:tracking-[-0.16px]" style={{ background: 'linear-gradient(#fff 0%, #f5f7fa 100%)' }}>
                {prompt}
              </p>
            </div>
            {/* EnergyForecastChart is an SVG chart in the original: placeholder */}
            <Media slot="product.energy.chart" tone="neutral" className="aspect-[720/260] w-full rounded-btn" />
          </div>
          {note && <p className="text-xs leading-[18px] text-ink-secondary">{note}</p>}
        </div>
      </header>
    </div>
  )
}
