import { Link } from 'react-router-dom'
import { ArrowRight } from './Icons.jsx'
import Button from './Button.jsx'
import Media from './Media.jsx'
import { href } from '../routing.js'

// §2.10 Content cards. Measured live: all 3 cards show an eyebrow. Each card links to the matching content page.
const CARDS = [
  {
    eyebrow: 'Case study',
    title: 'How a national retailer built a supplier programme that cut emissions and lowered costs year on year',
    slot: 'home.cards.0',
    to: '/customers/worldmarket',
  },
  {
    eyebrow: 'Guide',
    title: 'Climate disclosure for companies: the 2026 handbook',
    slot: 'home.cards.1',
    to: '/guides/climate-disclosure',
  },
  {
    eyebrow: 'New',
    title: 'Introducing Northwind assistants and a research grant',
    slot: 'home.cards.2',
    to: '/blog/2026-measurement-release',
  },
]

// Props (all optional; defaults = homepage §2.10). Inner-page ContentCards (PAGES_SPEC §0):
//   title, sub: header H2 and paragraph (sub omitted = no paragraph)
//   button: { label, to, variant = 'primary' } -> header becomes a row (space-between, align-end, gap 48)
//           with a withArrow button on the right
//   cards: [{ to, eyebrow?, title, desc?, bg? | slot?, tone? }]
//          desc present -> 16/24 500 #666c80 description instead of "Read more";
//          bg = CSS background for the image placeholder; slot/tone = Media slot (when no bg)
//          link = mono 14/17.5 cobalt label under the card (research cards, e.g. "Read paper"; 390: 12/15) in place of "Read more"
//   fluidHeader: block header (inner pages): always the row layout, and the H2 column flexes (min-width 0) so it can span 1152
export default function ContentCards({
  title = 'Start exploring',
  sub = 'Browse practical resources and learn from specialists in climate data.',
  button,
  cards = CARDS,
  fluidHeader = false,
}) {
  const heading = (
    <div className={`flex flex-col gap-4 md:gap-6 ${fluidHeader ? 'min-w-0 flex-1' : ''}`}>
      <h2 className="t-h2">{title}</h2>
      {sub && <p className="t-body-lg max-w-[640px]">{sub}</p>}
    </div>
  )
  return (
    <section className="py-16 md:py-section">
      <div className="container-ws">
        {button || fluidHeader ? (
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between md:gap-12">
            {heading}
            {button && (
              <Button as={Link} to={href(button.to)} variant={button.variant ?? 'primary'} arrow className="shrink-0">
                {button.label}
              </Button>
            )}
          </div>
        ) : (
          heading
        )}
        <div className="mt-[21px] grid grid-cols-1 gap-[21px] md:grid-cols-2 md:gap-x-12 lg:grid-cols-[repeat(3,minmax(0,1fr))] xl:grid-cols-[repeat(3,352px)] md:mt-8 md:gap-y-14">
          {cards.map((c, i) => (
            <Link key={c.title} to={href(c.to)} className="group flex flex-col gap-[11px] md:gap-4">
              {c.bg || !c.slot ? (
                <div className="aspect-video w-full overflow-hidden rounded-card bg-gray-20 xl:h-[198px] xl:w-[352px]" style={c.bg ? { background: c.bg } : undefined} role="img" aria-label="Card image placeholder" />
              ) : (
                <Media slot={c.slot} tone={c.tone ?? ['dark', 'cool', 'neutral'][i % 3]} className="aspect-video w-full rounded-card xl:h-[198px] xl:w-[352px]" />
              )}
              {c.eyebrow && <p className="t-eyebrow">{c.eyebrow}</p>}
              <h3 className="text-md font-medium leading-5 tracking-headline text-ink md:text-xl md:leading-[26.25px]">{c.title}</h3>
              {c.desc ? (
                // 16/24 500 #666c80 (PAGES_SPEC §0); 390 size not measured: 13/19.5 as the block copy uses
                <p className="text-[13px] font-medium leading-[19.5px] text-ink-secondary md:text-md md:leading-6">{c.desc}</p>
              ) : c.link ? null : (
                <span className="flex min-h-4 items-center gap-2 text-xs font-normal leading-[15px] text-cobalt group-hover:opacity-[.92] md:text-sm md:leading-[17.5px]">
                  Read more
                  {/* translateX(4px) on card hover, transform .2s ease-in-out (.card-arrow) */}
                  <ArrowRight size={14} className="card-arrow group-hover:translate-x-1" />
                </span>
              )}
              {c.link && <span className="font-mono text-xs leading-[15px] tracking-[-0.14px] text-cobalt md:text-sm md:leading-[17.5px]">{c.link}</span>}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
