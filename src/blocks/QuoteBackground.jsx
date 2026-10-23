import Media from '../components/Media.jsx'

// §3.6 Quote.singleBackgroundRoot (/solutions/ceda): full-bleed 677 tall, #242633 + photo + dither. Measured 1440 only:
// the quote (24/36 400, normal tracking, 676 wide) is the only visible text (no attribution line).
export default function QuoteBackground({ text, name, role, slot = 'product.quoteBg.0' }) {
  return (
    <section className="relative overflow-hidden bg-[#242633]">
      <Media slot={slot} tone="dark" className="absolute inset-0 h-full w-full" />
      <div aria-hidden="true" className="tex-dither-dark absolute inset-0" />
      <div className="container-ws relative flex min-h-[480px] flex-col items-center justify-center gap-6 py-16 text-center md:min-h-[677px] md:py-section">
        <blockquote className="max-w-[676px] text-lg font-normal leading-[27px] tracking-[normal] text-white md:text-2xl md:leading-9">{text}</blockquote>
        {name && (
          <p className="text-sm font-medium text-white/80">
            {name}, {role}
          </p>
        )}
      </div>
    </section>
  )
}
