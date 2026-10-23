import Media from '../components/Media.jsx'

// §3.13 Grid: itemsThree (3x352, image 300x180 + description) / itemsTwo (2x552, mono number, title, description).
// 390 unmeasured: 1 column. itemsTwo measured 1440: circle 32 → title 16 → description 12; rows 48 apart.
export default function Grid({ title, sub, variant = 'three', items = [], slotPrefix = 'company.grid' }) {
  return (
    <section className="bg-white py-16 md:py-section">
      <div className="container-ws">
        <div className="mb-12 flex max-w-[752px] flex-col gap-4 md:mb-20">
          <h2 className="b-h36">{title}</h2>
          {sub && <p className="t-body-lg">{sub}</p>}
        </div>
        {variant === 'three' ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
            {items.map((it, i) => (
              <div key={i} className="flex flex-col">
                <Media slot={`${slotPrefix}.${i}`} tone={it.tone ?? 'dark'} className="mb-[29px] aspect-[300/180] w-full max-w-[300px]" />
                {it.title && <h3 className="mb-2 text-lg font-medium leading-[22.5px] text-ink">{it.title}</h3>}
                <p className="text-md font-medium leading-6 text-ink-secondary">{it.desc}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
            {items.map((it, i) => (
              <div key={i} className="flex flex-col gap-3">
                {/* number sits in a 32x32 circle with a 1px cobalt ring; circle → title 16 (measured /about-us) */}
                <span className="mb-1 flex h-8 w-8 items-center justify-center rounded-full border border-cobalt font-mono text-sm leading-[16.8px] text-cobalt">{i + 1}</span>
                <h3 className="text-xl font-medium leading-[26px] tracking-[-0.72px] text-ink md:text-2xl md:leading-[30px]">{it.title}</h3>
                <p className="text-md font-medium leading-6 text-ink-secondary">{it.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
