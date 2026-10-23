import Media from '../components/Media.jsx'

// §3.23 InfoCards.withBackgroundImage (/solutions/california).
export default function InfoCards({ title, cards = [], slot = 'product.infocards.bg' }) {
  return (
    <section className="relative overflow-hidden py-16">
      <Media slot={slot} tone="dark" className="absolute inset-0 h-full w-full" />
      <div className="container-ws relative grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-12 xl:grid-cols-[368px_736px]">
        <h2 className="b-h4 !text-white">{title}</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {cards.map((c) => (
            <div key={c.label} className="flex flex-col items-start gap-8 border-l border-white/30 py-6 pl-8 pr-6 md:gap-12">
              <span className="flex h-[34px] items-center gap-2 rounded-[80px] border border-white/30 bg-white/15 py-1 pl-1 pr-3">
                <span className="h-6 w-6 rounded-full bg-white/30" aria-hidden="true" />
                <span className="text-sm font-medium leading-[16.8px] text-white">{c.label}</span>
              </span>
              <p className="text-[20px] font-medium leading-[30px] text-white">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
