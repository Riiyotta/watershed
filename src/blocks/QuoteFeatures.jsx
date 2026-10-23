import Media from '../components/Media.jsx'
import SectionHeader from './SectionHeader.jsx'

// §3.31 QuoteFeatures. Vertical gaps between the header, quote row and feature row are unmeasured (48 used).
export default function QuoteFeatures({ title, body, button, quote, caption, features = [], slot = 'compare.qf.0' }) {
  return (
    <section className="px-4 py-16 md:px-6 md:py-section">
      <div className="mx-auto flex max-w-[1152px] flex-col gap-12">
        <SectionHeader title={title} body={body} button={button} />
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <figure className="flex flex-col gap-6">
            <blockquote className="font-serif text-[22px] font-normal leading-[28px] tracking-[-0.44px] text-ink md:text-[28px] md:leading-[35px] md:tracking-[-0.56px]">“{quote}”</blockquote>
            <figcaption className="font-mono text-xs leading-[14.4px] text-ink-secondary">{caption}</figcaption>
          </figure>
          <Media slot={slot} tone="cool" className="aspect-square w-full" />
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {features.map((f) => (
            <div key={f.title} className="flex flex-col gap-3">
              <h3 className="text-md font-medium leading-[18.72px] tracking-[-0.48px] text-ink">{f.title}</h3>
              <p className="text-sm font-medium leading-[21px] tracking-[-0.14px] text-ink-secondary">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
