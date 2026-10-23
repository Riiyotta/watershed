import './primitives.css'
import Media from '../components/Media.jsx'
import Breadcrumbs from './Breadcrumbs.jsx'

// §2.3 PostHero. Sits under the (translucent) nav: margin-top -68, padding 100 0 64 (390: 89 0 43).
export default function PostHero({ crumbs, date, title, subtitle, slot, tone }) {
  return (
    <section className="-mt-[68px] bg-gray-10 pb-[43px] pt-[89px] md:pb-16 md:pt-[100px]">
      <div className="container-ws flex flex-col gap-[21px] md:gap-8">
        <Breadcrumbs items={crumbs} />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-12 xl:grid-cols-[552px_552px]">
          <div className="aspect-video w-full overflow-hidden rounded-btn bg-gray-20 xl:h-[311px]">
            <Media slot={slot} tone={tone} className="h-full w-full" />
          </div>
          <div className="flex flex-col justify-center gap-4 md:gap-6">
            {date && <p className="font-mono text-xs leading-[15px] tracking-[normal] text-ink-secondary md:text-sm md:leading-[17.5px]">{date}</p>}
            <h1 className="[overflow-wrap:anywhere] text-2xl font-medium leading-[30px] tracking-[-0.72px] text-ink md:text-5xl md:leading-[45px] md:tracking-[-1.08px]">{title}</h1>
            {subtitle && <p className="text-sm font-medium leading-[21px] text-ink-secondary md:text-lg md:leading-[27px]">{subtitle}</p>}
          </div>
        </div>
      </div>
    </section>
  )
}
