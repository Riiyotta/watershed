import { tocFromBlocks } from '../primitives/index.js'
import { Prose, Toc, toProseBlocks } from './primitives.jsx'
import { RichText } from './ui.jsx'

// §3.12 SectionTextBlock: 752 prose column at 18/27 (390: 14/21). Annotation margin notes sit off-screen at 1440
// (x -298 / 1450) but render INLINE at 390 (measured on /about-us: border-y 1px #0b2471, padding 24 0, 358x239 image,
// margin 48 0), so `{ annotation: true }` nodes are shown below 1224 only (Annotation max-width 1224 = inline).
// `withToc`: TocSidebar layout (§2.2, grid 818.6/409.3 gap 36, padding 64 12 24) with a Serif H1 45/47.25 300 and the
// shared 20/30 Prose + Toc primitives.
export default function SectionTextBlock({ withToc = false, title, intro, nodes = [], slotPrefix = 'product.stb' }) {
  if (!withToc) {
    return (
      <section className="py-16 md:py-section">
        <div className="b-stb mx-auto w-full max-w-[800px] px-4 md:px-6">
          <RichText nodes={nodes} slotPrefix={slotPrefix} />
        </div>
      </section>
    )
  }
  const blocks = toProseBlocks(nodes, slotPrefix)
  return (
    // Measured: section padding 12 max((100vw-1264)/2, 0) (88 at 1440; 390: 0), columns 2fr 1fr; the .blog-post column is
    // 792 max with padding 48 (390: 24 16)
    <section className="lg:px-[max(calc((100vw-1264px)/2),0px)] lg:py-3">
      <div className="mx-auto grid max-w-[1264px] grid-cols-1 gap-9 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:justify-center min-[1264px]:grid-cols-[818.6px_409.3px]">
        <div className="mx-auto w-full min-w-0 max-w-[792px] px-4 py-6 md:p-12">
          {title && <h1 className="mb-6 font-serif text-[45px] font-light leading-[47.25px] tracking-[-1.12px] text-ink-secondary">{title}</h1>}
          <Prose className="b-stb-toc" blocks={intro ? [{ t: 'p', text: intro }, ...blocks] : blocks} />
        </div>
        {/* TocSidebar: sticky top 128 (STB), hidden below 1024 inside the primitive */}
        <aside className="hidden lg:block">
          <Toc items={tocFromBlocks(blocks)} top={128} />
        </aside>
      </div>
    </section>
  )
}
