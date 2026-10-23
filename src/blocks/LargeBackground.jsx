import Media from '../components/Media.jsx'
import { Cta } from './ui.jsx'

// §3.29 LargeBackground hero (/solutions/ceda). Measured 1440: section 868 tall (padding 128 0 80); the 926x1005
// illustration is centred on the section; the content block (container padding 24) is vertically centred:
// logo 161x84 → H1 48, H1 (64/64 400, 960) → sub 20, sub (720) → small button 16.
export default function LargeBackground({ title, sub, button = { label: 'Get the data', to: '/guides/ceda-methodology' } }) {
  return (
    <header className="relative flex items-center overflow-hidden pb-[53px] pt-16 md:min-h-[868px] md:pb-20 md:pt-32" style={{ background: 'linear-gradient(#f5f8ff, #fff)' }}>
      <Media slot="product.largeBg.illustration" tone="cool" fit="contain" className="pointer-events-none absolute left-1/2 top-1/2 h-[1005px] w-[926px] max-w-none -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30" />
      <div className="relative mx-auto flex w-full max-w-[1200px] flex-col items-center p-4 text-center md:p-6">
        <Media slot="product.largeBg.logo" tone="neutral" fit="contain" className="mb-8 h-[84px] w-[161px] md:mb-12" />
        <h1 className="max-w-[960px] text-[32px] font-normal leading-[35.2px] tracking-[-0.96px] text-ink md:text-8xl md:leading-[64px] md:tracking-[-1.92px]">{title}</h1>
        <p className="t-lead mt-5 max-w-[720px]">{sub}</p>
        <div className="mt-4">
          <Cta {...button} className="b-btn-sm" />
        </div>
      </div>
    </header>
  )
}
