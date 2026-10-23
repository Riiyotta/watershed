import Media from '../components/Media.jsx'

// §3.34 PeopleCarousel / Advisors (/platform/marketplace).
export default function PeopleCarousel({ title, people = [] }) {
  return (
    <section className="py-16 md:py-section">
      <div className="container-ws flex flex-col gap-10">
        <h2 className="text-[32px] font-normal leading-[35.2px] text-midnight md:text-7xl md:leading-[52.8px]">{title}</h2>
        {/* MOTION: keen-slider drag/arrows */}
        <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 md:mx-0 md:px-0">
          {people.map((p, i) => (
            <div key={p.name} className="w-[240px] shrink-0 border border-cobalt-30">
              <Media slot={`product.advisors.${i}`} tone="neutral" className="h-[209px] w-full" />
              <div className="flex flex-col gap-1 p-3">
                <p className="font-mono text-sm leading-5 text-cobalt">{p.name}</p>
                <p className="font-mono text-sm leading-5 text-ink-secondary">{p.org}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
