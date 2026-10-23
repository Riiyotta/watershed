import Media from '../components/Media.jsx'
import { Cta, Inline, MonoCta } from './ui.jsx'

// §3.5 TextWithImageOrderedList (industry pages). Items alternate rightAligned; media radius 16.
// The step numeral is a ::before on the H2 in the original (measured H2 = numeral line + title lines, 40.95 each);
// the reference screenshot shows it as a cobalt mono "1." about the size of the H2 cap height. Rendered as a block
// span inside the H2. `plain` (/solutions/ceda): no box, no numeral, text left / image right, item.ratio = media w/h.
export default function TextWithImageOrderedList({ items = [], plain = false, slotPrefix = 'product.twiol' }) {
  return (
    <section className="py-16 md:py-section">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-16 px-3 md:px-6 lg:max-w-[1200px] lg:gap-[192px] lg:px-16 xl:max-w-[1120px] xl:px-6">
        {items.map((it, i) => {
          const right = plain ? true : i % 2 === 1
          return (
            <section key={it.title} className="item grid grid-cols-1 items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <Media
                slot={`${slotPrefix}.${i}`}
                tone={i % 2 ? 'neutral' : 'cool'}
                fit="contain"
                className={`w-full rounded-2xl ${it.ratio ? '' : i % 2 ? 'aspect-[512/288]' : 'aspect-[512/341]'} ${right ? 'lg:order-2' : ''}`}
                style={it.ratio ? { aspectRatio: String(it.ratio) } : undefined}
              />
              <div className={`flex flex-col gap-6 ${plain ? 'max-w-[512px]' : 'max-w-[520px] border border-cobalt-30 p-8'} ${right ? 'lg:order-1' : ''} ${right && !plain ? 'lg:justify-self-end' : ''}`}>
                <h2 className={`t-h2 ${plain ? '' : 'lg:max-w-[446px]'}`}>
                  {!plain && <span className="block font-mono text-[40px] font-normal leading-[32.76px] tracking-[-0.04em] text-cobalt md:text-[46px] md:leading-[40.95px]">{i + 1}.</span>}
                  {it.title}
                </h2>
                <p className="t-body-lg">{it.body}</p>
                {/* /compare: ordered steps (ol padding-left 16, li 16/24 500 with a bold label, gap 12) + primary button */}
                {it.list && (
                  <ol className="flex list-decimal flex-col gap-3 pl-4 text-md font-medium leading-6 tracking-[-0.16px] text-ink-secondary">
                    {it.list.map((li) => (
                      <li key={li}>
                        <Inline text={li} />
                      </li>
                    ))}
                  </ol>
                )}
                {it.button ? (
                  <div className="pt-2">
                    <Cta {...it.button} />
                  </div>
                ) : (
                  <div>
                    <MonoCta to={it.to ?? '/platform'} label={it.cta ?? 'Learn more'} />
                  </div>
                )}
              </div>
            </section>
          )
        })}
      </div>
    </section>
  )
}
