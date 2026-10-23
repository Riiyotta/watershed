import Media from '../components/Media.jsx'
import { TextLink } from './ui.jsx'

// §3.18 ContentGrid: a bento of media cards sharing 1px #c0d0f0 borders (no gaps).
// Measured row patterns at 1440 (C = 1152): half+half 576/576, wide+narrow 768/385, narrow x3 384/385/385,
// narrow+wide 384/769. On a 6-column grid: wide = 4, half = 3, narrow = 2.
// Wide/half media are 16:9 (718x404, 526x297). Narrow media fills the remaining card height (335x354-404).
// 390: one column, card padding 16; wide/half media 324x182, narrow media ~324x341-390.
const SPAN = { wide: 'md:col-span-4', half: 'md:col-span-3', narrow: 'md:col-span-2' }

export default function ContentGrid({ title, sub, link, items = [], slotPrefix = 'product.cgrid' }) {
  return (
    <section className="py-8 md:py-section">
      <div className="container-ws flex flex-col gap-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-8">
          <div className="flex flex-col gap-4">
            <h2 className="b-h36 max-w-[768px]">{title}</h2>
            {sub && <p className="t-body-lg max-w-[768px]">{sub}</p>}
          </div>
          {link && <TextLink {...link} mono={false} className="shrink-0" />}
        </div>
        <div className="grid grid-cols-1 border-l border-t border-line md:grid-cols-6">
          {items.map((it, i) => {
            const size = it.size ?? 'half'
            return (
              <article key={i} className={`flex flex-col gap-6 border-b border-r border-line bg-white p-4 md:p-6 ${SPAN[size]}`}>
                <Media
                  slot={`${slotPrefix}.${i}`}
                  tone={i % 2 ? 'neutral' : 'cool'}
                  className={`w-full bg-gray-10 ${size === 'narrow' ? 'aspect-[335/354] md:aspect-auto md:min-h-[300px] md:flex-1' : 'aspect-video'}`}
                />
                <div className="flex flex-col gap-3">
                  <h3 className="b-card-title">{it.title}</h3>
                  <p className="text-[13px] font-medium leading-[19.5px] text-ink-secondary md:text-md md:leading-6">{it.desc}</p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
