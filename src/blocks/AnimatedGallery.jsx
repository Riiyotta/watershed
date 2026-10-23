import Media from '../components/Media.jsx'

// §3.34 AnimatedGallery (/platform/marketplace): 3 sticky stacked sections. Static layout only.
export default function AnimatedGallery({ sections = [] }) {
  return (
    <div className="mx-auto max-w-[1176px] border-x border-line-light">
      {sections.map((s, i) => (
        // MOTION: scroll-driven stacking; rows of 196x122 tiles slide in (JS)
        <section key={s.title} className="sticky top-[68px] border-t border-line-light bg-white lg:min-h-[706px]">
          <div className="flex flex-col gap-4 px-6 pb-10 pt-10 md:pb-[57px] md:pr-10">
            <p className="font-mono text-sm leading-5 text-cobalt">{String(i + 1).padStart(2, '0')}</p>
            <h2 className="b-h4">{s.title}</h2>
            <p className="t-lead max-w-[560px]">{s.body}</p>
          </div>
          <div className="flex flex-wrap gap-4 px-6 pb-10">
            {Array.from({ length: 4 }, (_, n) => (
              <Media key={n} slot={`product.gallery.${i}.${n}`} tone={['cool', 'warm', 'neutral', 'dark'][(i + n) % 4]} className="h-[122px] w-[196px]" />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
