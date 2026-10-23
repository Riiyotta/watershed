import { Cta } from './ui.jsx'

function CobaltIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true" className="shrink-0 text-cobalt">
      <rect x="5" y="4" width="22" height="24" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 11h12M10 16h12M10 21h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

// §3.19 InlineCta: recessed | inline | stacked.
export default function InlineCta({ variant = 'inline', title, sub, button = { label: 'Request a demo', to: '/demo' } }) {
  if (variant === 'recessed') {
    return (
      <section className="border-y border-line bg-bg-xlight">
        <div className="mx-auto flex max-w-[1152px] flex-col items-center justify-center gap-4 border-x border-line px-6 py-4 md:flex-row md:gap-6">
          <p className="text-center text-md font-normal leading-6 text-ink-secondary md:text-lg md:leading-[27px]">{title}</p>
          <Cta {...button} shine />
        </div>
      </section>
    )
  }
  if (variant === 'stacked') {
    return (
      <section className="py-8">
        <div className="mx-auto flex max-w-[1128px] flex-col items-start justify-between gap-6 border-y border-cobalt px-6 py-10 md:flex-row md:items-center md:px-10 md:py-16">
          <div className="flex flex-col gap-3">
            <CobaltIcon />
            <h2 className="text-[20px] font-semibold leading-[22px] tracking-[-0.6px] text-midnight">{title}</h2>
            {sub && <p className="t-lead">{sub}</p>}
          </div>
          <Cta {...button} arrow />
        </div>
      </section>
    )
  }
  // .inline: without a subtitle the title and button sit in one centred row (gap 24, 175 tall at 1440, measured
  // /platform/sustainability-ai); with a subtitle they stack (294 tall, /platform/disclosures/cdp).
  return (
    <section className="bg-white/50">
      <div className={`mx-auto flex max-w-[635px] flex-col items-center gap-4 px-4 py-16 text-center ${sub ? '' : 'md:flex-row md:justify-center md:gap-6 md:px-0'}`}>
        <p className="text-lg font-normal leading-[27px] text-ink-secondary">{title}</p>
        {sub && <p className="t-lead">{sub}</p>}
        <Cta {...button} shine />
      </div>
    </section>
  )
}
