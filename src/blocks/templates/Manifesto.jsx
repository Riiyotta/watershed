import Media from '../../components/Media.jsx'
import { Inline } from '../ui.jsx'

// §3.34 Manifesto (/climate-economy). Footer CTA strip is shorter (349) on this page: chrome change, not implemented here.
const SECTIONS = [
  {
    h: null,
    p: [
      'The world economy is moving to run on low-carbon energy, and it is happening faster than many boardrooms expect.',
      'This shift is bigger than any single election or policy cycle. It is built on science, markets and steady falls in the cost of clean technology. More of the economy is changing, and the smartest financial decision is increasingly the right one for the planet.',
      'We call it the climate economy.',
      'We see it among our customers: companies in every industry and region that now treat climate data as business data. We see it in the steady growth of climate-related disclosure rules. And we see it in the numbers: what is good for the planet is more and more often good for business.',
    ],
  },
  {
    h: 'Where climate leaders are market leaders.',
    p: [
      'In the climate economy, climate leadership increasingly goes hand in hand with commercial leadership. Companies that invest in lowering emissions often find savings, operational improvements and reduced risk along the way.',
      'This is already visible in some sectors, where companies with the most effective climate programmes have performed well against broad market indices over several years.',
    ],
    fig: true,
  },
  {
    h: 'Where the cheapest kilowatt is also the cleanest.',
    p: [
      'Over the past decade the cost of wind, solar and batteries has fallen sharply. In many places new clean generation is now [cheaper than new fossil generation](/blog/clean-power-how-companies-decarbonize-electricity), and electric vehicles cost less to run.',
      'The chart below tracks the cost and deployment of several low-carbon technologies over the past decade. Prices have fallen while installed capacity has grown many times over.',
    ],
    fig: true,
  },
  {
    h: 'Where decarbonisation wins deals.',
    p: [
      'Procurement has changed. Large buyers now ask many thousands of suppliers for environmental data each year, and that number keeps rising.',
      'Clear, credible climate data increasingly shapes which suppliers win contracts. A manufacturer with product-level data can answer customer requests in days rather than months.',
    ],
    fig: true,
  },
  {
    h: 'Where AI saves more than time.',
    p: [
      'AI is turning months of carbon accounting into hours, but that is only the start. It puts climate intelligence in the hands of the people who control the biggest sources of emissions: facilities leads, procurement teams and finance.',
      'Getting the measurement right matters, especially as AI itself uses energy. Careful methods help companies understand that footprint too.',
    ],
    fig: true,
  },
  {
    h: 'Where more green earns more green.',
    p: [
      'A new economy is taking shape around the technologies that make energy, materials and transport cleaner, cheaper and more competitive.',
      'Capital is following. Investment in climate technology continues to grow, and the companies that move early are positioning themselves for the next generation of growth.',
      'The climate economy is here, but it is not evenly distributed. Many companies still treat sustainability as a compliance task, separate from the teams that make real business decisions.',
      'Our mission is to accelerate the climate economy. It is the biggest opportunity of our lifetimes, and it belongs to every company ready to build it.',
    ],
    fig: true,
  },
]

// Measured (live): section padding 160 24 80 (390: 107 16 53), 752 column. H1 64/64 500 -1.92 (390: 36/36 -1.08).
// One vertical rhythm: 24 between siblings (390: 16); H1 → body and body → H2 are 96 (390: 64). Body 18/27 500 #666c80
// (390: 14/21). H2 32/40 500 -0.96 (390: 22/27.5 -0.66). Figures: 752-wide image with a 1px #c0d0f0 border, 24 to a
// 10/15 500 -0.1 caption. Figure heights follow the charts (367, 629, 458, 430, 429).
const FIG_H = [367, 629, 458, 430, 429]

export default function Manifesto() {
  let fig = 0
  return (
    <section className="b-manifesto bg-white px-4 pb-[53px] pt-[107px] md:px-6 md:pb-20 md:pt-40">
      <div className="mx-auto flex max-w-[752px] flex-col gap-4 md:gap-6">
        <h1 className="mb-12 text-[36px] font-medium leading-[36px] tracking-[-1.08px] text-ink md:mb-[72px] md:text-[64px] md:leading-[64px] md:tracking-[-1.92px]">
          Welcome to the
          <br />
          climate economy
        </h1>
        {SECTIONS.map((s, i) => {
          const h = s.fig ? FIG_H[fig++ % FIG_H.length] : 0
          return [
            s.h && (
              <h2 key={`h${i}`} className="mt-12 text-[22px] font-medium leading-[27.5px] tracking-[-0.66px] text-ink md:mt-[72px] md:text-[32px] md:leading-10 md:tracking-[-0.96px]">
                {s.h}
              </h2>
            ),
            ...s.p.slice(0, s.fig && s.p.length > 2 ? 2 : undefined).map((p, j) => (
              <p key={`p${i}.${j}`} className="text-sm font-medium leading-[21px] tracking-[-0.14px] text-ink-secondary md:text-lg md:leading-[27px] md:tracking-[-0.18px]">
                <Inline text={p} />
              </p>
            )),
            s.fig && (
              <figure key={`f${i}`} className="flex flex-col gap-6">
                <Media slot={`report.climateEconomy.fig.${i}`} tone="neutral" className="w-full border border-line" style={{ aspectRatio: `752 / ${h}` }} />
                <figcaption className="text-[10px] font-medium leading-[15px] tracking-[-0.1px] text-ink-secondary">
                  Illustrative chart placeholder. Source notes and methodology appear here in the final figure. <a href="#">Source</a>
                </figcaption>
              </figure>
            ),
            ...(s.fig && s.p.length > 2
              ? s.p.slice(2).map((p, j) => (
                  <p key={`q${i}.${j}`} className="text-sm font-medium leading-[21px] tracking-[-0.14px] text-ink-secondary md:text-lg md:leading-[27px] md:tracking-[-0.18px]">
                    <Inline text={p} />
                  </p>
                ))
              : []),
          ]
        })}
      </div>
    </section>
  )
}
