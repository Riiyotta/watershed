import { PromptDemo } from '../components/Agents.jsx'
import { ArrowRight } from '../components/Icons.jsx'
import GlowField from './GlowField.jsx'
import { Cta, SmartLink } from './ui.jsx'

// §3.20 CenteredAgent hero (/platform/sustainability-ai). Measured: section padding 96 (390: 43) + container padding 24
// (390: 16). Pill → H1 32, H1 → sub 24, sub → CTAs 32, content → PromptChat (homepage PromptDemo) 96 (390: 16/16/16/32).
// Pill 285x34 padding 4 4 4 14 gap 6 (390: 32 tall, padding 3 3 3 9, gap 4), mono label tracking normal.
export default function CenteredAgent({ pill, title, sub, primary = { label: 'Request a demo', to: '/demo' }, secondary }) {
  return (
    <header className="relative overflow-hidden bg-white py-[43px] md:py-section">
      <GlowField />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[513px]" style={{ background: 'linear-gradient(#fff 0%, #fff 40%, rgba(255,255,255,.62) 68%, transparent 100%)' }} />
      <div aria-hidden="true" className="tex-dither-dark pointer-events-none absolute inset-0" />
      <div className="relative mx-auto flex max-w-[1200px] flex-col items-center gap-8 p-4 md:gap-24 md:p-6">
        <div className="flex flex-col items-center gap-4 text-center md:gap-6">
          {pill && (
            <SmartLink to={pill.to} className="flex h-8 items-center gap-1 rounded-[80px] border border-line-light bg-gray-10 py-[3px] pl-[9px] pr-[3px] md:mb-2 md:h-[34px] md:gap-[6px] md:py-1 md:pl-[14px] md:pr-1">
              <span className="font-mono text-xs leading-[15px] tracking-[normal] text-cobalt md:text-sm md:leading-[17.5px]">{pill.label}</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cobalt text-white">
                <ArrowRight size={12} />
              </span>
            </SmartLink>
          )}
          <h1 className="b-display-xl max-w-[1152px] !leading-[32px] !tracking-[-1.28px] md:!leading-[72px] md:!tracking-[-2.88px]">{title}</h1>
          <p className="t-body-lg max-w-[702px]">{sub}</p>
          <div className="flex flex-wrap justify-center gap-2 md:mt-2 md:gap-3">
            {primary && <Cta {...primary} shine />}
            {secondary && <Cta {...secondary} variant="light" />}
          </div>
        </div>
        <PromptDemo />
      </div>
    </header>
  )
}
