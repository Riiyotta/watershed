import { HubspotForm } from './primitives.jsx'

// §3.34 CTAForm.frame (/platform/marketplace): centred H2 + 544-wide HubspotForm (8 fields, 2-col rows).
export default function CTAForm({ title, fields, submitLabel = 'Build your portfolio' }) {
  return (
    <section className="py-16 md:py-section">
      <div className="mx-auto flex max-w-[1176px] flex-col items-center gap-8 border border-line-light px-4 py-12">
        <h2 className="text-center text-[32px] font-normal leading-[35.2px] tracking-[-0.32px] text-midnight md:text-7xl md:leading-[52.8px] md:tracking-[-0.48px]">{title}</h2>
        <div className="w-full max-w-[544px]">
          <HubspotForm fields={fields} submitLabel={submitLabel} />
        </div>
      </div>
    </section>
  )
}
