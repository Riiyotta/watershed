import { HubspotForm } from './primitives.jsx'

// §3.30 ContentForm.cedaRoot (measured 1440 /solutions/ceda): section bg #fff, padding 96 24 inside the 1200 container.
// H2 36/45 400 (normal tracking, 520 wide) → panel 32. Panel 1152x664, 1px #c0d0f0, two 575 columns.
// Left: option articles (padding 24, white; the second has a 1px top rule and fills the column): h3 21/26.25 400,
// body 16/24 400 (gap 12), disc list 16/24 400, padding-left 24 (gap 16).
// Right (padding 32): h2 21/26.25 400, intro 16/24 400 (gap 24), then the form (2-column first rows, 42 fields).
const CEDA_FIELDS = [
  { name: 'first', label: 'First name', half: true },
  { name: 'last', label: 'Last name', half: true },
  { name: 'email', label: 'Email', type: 'email', half: true },
  { name: 'phone', label: 'Phone number', type: 'tel', half: true, required: false },
  { name: 'org', label: 'Organisation name' },
  { name: 'version', label: 'Which version of the dataset are you interested in?', type: 'select', options: ['Open dataset', 'Extended dataset'] },
]

export default function ContentForm({ title, options = [], formTitle, formIntro, fields }) {
  return (
    <section className="bg-white">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-4 py-16 md:px-6 md:py-section">
        {title && <h2 className="max-w-[520px] text-[24px] font-normal leading-[30px] tracking-[normal] text-ink md:text-[36px] md:leading-[45px]">{title}</h2>}
        <div className="grid grid-cols-1 border border-line bg-white lg:min-h-[664px] lg:grid-cols-2">
          <div className="flex flex-col border-b border-line lg:border-b-0 lg:border-r">
            {options.map((o, i) => (
              <article key={o.title} className={`flex flex-col bg-white p-6 ${i ? 'flex-1 border-t border-line' : ''}`}>
                <h3 className="text-xl font-normal leading-[26.25px] tracking-[normal] text-ink">{o.title}</h3>
                <p className="mt-3 text-md font-normal leading-6 tracking-[-0.16px] text-ink-secondary">{o.body}</p>
                <ul className="mt-4 list-disc pl-6 text-md font-normal leading-6 tracking-[-0.16px] text-ink-secondary">
                  {o.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <div className="flex flex-col bg-white p-6 md:p-8">
            <h2 className="text-xl font-normal leading-[26.25px] tracking-[normal] text-ink">{formTitle}</h2>
            {formIntro && <p className="mt-6 text-md font-normal leading-6 tracking-[-0.16px] text-ink-secondary">{formIntro}</p>}
            <div className="mt-6 md:mt-[62px]">
              <HubspotForm fields={fields ?? CEDA_FIELDS} submitLabel="Submit" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
