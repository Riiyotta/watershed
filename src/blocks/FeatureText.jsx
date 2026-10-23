import { Cta } from './ui.jsx'

// §3.11 FeatureText (+ .sectionHeading): big statement, 48/60 400 (390: 32/40).
// Without a CTA the heading is centred. With a CTA (measured on /platform/act, /solutions/csrd) the row is
// left-aligned: heading (max 902) on the left, a primary withArrow button on the right, gap 48 (390: stacked, gap 16).
// `bg`: the long-form disclosure pages use #f5f7ff (measured /platform/disclosures/cdp).
// `sectionHeading` drops the bottom padding (96 0 0; 390: 43 0 0).
export default function FeatureText({ title, cta, sectionHeading = false, bg }) {
  return (
    <section className={`bg-white pt-[43px] md:pt-section ${sectionHeading ? '' : 'pb-[43px] md:pb-section'}`} style={bg ? { background: bg } : undefined}>
      <div className="mx-auto max-w-[1200px] px-2 md:px-6">
        {cta ? (
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between md:gap-12">
            <h2 className="b-statement max-w-[902px]">{title}</h2>
            <Cta {...cta} arrow className="shrink-0" />
          </div>
        ) : (
          <div className="flex justify-center">
            <h2 className="b-statement text-center">{title}</h2>
          </div>
        )}
      </div>
    </section>
  )
}
