import { LogoStrip } from './Logos.jsx'
import SectionHeader from './SectionHeader.jsx'

// §3.31 FeatureGridNumbered: 3x384 cards sharing 1px #c0d0f0 borders, row gap 12. `wide` card spans 2 cols + logos.
export default function FeatureGridNumbered({ title, body, button, cards = [] }) {
  return (
    <section className="px-4 py-16 md:px-6 md:py-section">
      <div className="mx-auto flex max-w-[1152px] flex-col gap-12">
        <SectionHeader title={title} body={body} button={button} />
        <div className="grid grid-cols-1 gap-y-3 md:grid-cols-3">
          {cards.map((c, i) => (
            <div key={c.title} className={`flex flex-col gap-4 border border-line bg-white p-6 md:-ml-px ${c.wide ? 'md:col-span-2' : ''}`}>
              <span className="font-mono text-xs leading-[14.4px] text-cobalt">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="text-xl font-medium leading-[26px] tracking-[-0.72px] text-ink md:text-2xl md:leading-[30px]">{c.title}</h3>
              <p className="text-md font-medium leading-6 text-ink-secondary">{c.desc}</p>
              {c.wide && <LogoStrip count={10} mono="#242c47" className="mt-auto h-6" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
