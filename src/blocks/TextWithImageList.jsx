import Media from '../components/Media.jsx'
import { SmartLink } from './ui.jsx'

// §3.24 TextWithImageList: alternating rows on a 12-column grid (77.67 columns, gap 32 20), 80 between rows.
// Measured: text is always 5 columns (468 wide, x 828 or x 144). The image spans 7 columns (664, /platform/disclosures/cdp,
// /esg) or 6 (566, /csrd); /partners shows 515-wide images centred in the 6-column cell. Image heights follow the asset
// (row.ratio = w/h). Copy: h2 35/38.5 400 midnight, then 20/30 paragraphs and a 20/30 cobalt link, gap 20.
// Optional centred section title 60/66 400 -1.8 midnight (/csrd). `bg` e.g. linear-gradient(#f5f7ff, #fff) on cdp.
// 390: section padding 24 0, rows px 24 (342 wide), image first, gap 32; rows after the first get a 1px
// rgba(13,89,242,.5) top rule and padding-top 32; h2 30/33 -0.9.
const IMG_SPAN = { 6: 'lg:col-span-6', 7: 'lg:col-span-7' }
const IMG_START_RIGHT = { 6: 'lg:col-start-7', 7: 'lg:col-start-6' }

export default function TextWithImageList({ title, bg, rows = [], slotPrefix = 'product.twil' }) {
  return (
    <section className="py-6 lg:pb-3 lg:pt-16" style={bg ? { background: bg } : undefined}>
      {title && (
        <h2 className="mx-auto mb-12 max-w-[1200px] px-6 text-center text-[36px] font-normal leading-[39.6px] tracking-[-1.08px] text-midnight md:mb-20 md:text-[60px] md:leading-[66px] md:tracking-[-1.8px]">
          {title}
        </h2>
      )}
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 lg:gap-20 lg:px-6">
        {rows.map((r, i) => {
          const flip = i % 2 === 1
          const span = r.span ?? 7
          return (
            <div
              key={r.title}
              className={`grid grid-cols-1 items-center gap-x-5 gap-y-8 px-6 lg:grid-cols-12 lg:px-0 ${i > 0 ? 'border-t border-[rgba(13,89,242,.5)] pt-8 lg:border-t-0 lg:pt-0' : ''}`}
            >
              <div className={`${IMG_SPAN[span]} ${flip ? `lg:order-2 ${IMG_START_RIGHT[span]}` : 'lg:col-start-1'} ${r.natural ? 'flex justify-center' : ''}`}>
                <Media
                  slot={`${slotPrefix}.${i}`}
                  tone={flip ? 'neutral' : 'cool'}
                  className="w-full"
                  style={{ aspectRatio: String(r.ratio ?? 1.5), maxWidth: r.natural ? `${r.natural}px` : undefined }}
                />
              </div>
              <div className={`flex max-w-[468px] flex-col justify-center gap-5 lg:col-span-5 ${flip ? 'lg:order-1 lg:col-start-1 lg:row-start-1' : 'lg:col-start-8'}`}>
                <h2 className="text-[30px] font-normal leading-[33px] tracking-[-0.9px] text-midnight md:text-[35px] md:leading-[38.5px] md:tracking-[-1.05px]">{r.title}</h2>
                {(Array.isArray(r.body) ? r.body : [r.body]).map((p, k) => (
                  <p key={k} className="t-lead">
                    {p}
                  </p>
                ))}
                {r.link && (
                  <SmartLink to={r.link.to} className="text-[20px] font-medium leading-[30px] tracking-[-0.2px] text-cobalt">
                    {r.link.label}
                  </SmartLink>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
