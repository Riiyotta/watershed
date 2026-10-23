import { Sparkle } from '../components/Icons.jsx'

// §3.22 FeatureLarge: eyebrow + 2 columns, then a 4x270 feature grid.
export default function FeatureLarge({ eyebrow, title, body, items = [] }) {
  return (
    <section className="bg-white">
      <div className="container-ws flex flex-col gap-12 pt-16 md:gap-20 md:pt-20">
        <div className="flex flex-col gap-8">
          <p className="t-eyebrow flex items-center gap-2">
            <Sparkle size={18} />
            {eyebrow}
          </p>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-12">
            <h2 className="text-2xl font-normal leading-[28px] tracking-[-0.72px] text-ink md:text-5xl md:leading-[42.12px] md:tracking-[-1.08px]">{title}</h2>
            <p className="t-body-lg">{body}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 py-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <article key={it.title} className="flex flex-col gap-3">
              {/* 24x24 #93aeff icon tile above each item (measured) */}
              <span aria-hidden="true" className="h-6 w-6 bg-cobalt-30" />
              <h3 className="text-md font-normal leading-[18.72px] tracking-[-0.48px] text-ink">{it.title}</h3>
              <p className="text-sm font-medium leading-[19.6px] text-ink-secondary">{it.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
