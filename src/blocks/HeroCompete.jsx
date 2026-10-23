import Media from '../components/Media.jsx'
import { ChevronLeft16 } from '../components/Icons.jsx'
import { EmailCatcher } from './primitives.jsx'
import { SmartLink, TextLink } from './ui.jsx'

// §3.31 HeroCompete (measured 1440 /compare, /compare/workiva).
// Header block padding 96 24 64. Intro centred: eyebrow → H1 32, H1 → body 20, body → email catcher 32; intro → panel 80.
// Panel (1152, border #e6ebf5, radius 2, padding 20, gap 20): title row (24/30 + mono link), then 4 tiles 272x316
// (white, border rgba(4,19,48,.12), padding 20, image fill behind; value 64/64 300, label 21/26.25 500 -0.63,
// desc 16/19.2). `links` variant (/compare index): a 752-wide panel with a title and two 351x197 image link tiles.
// Proof strip: its own band with padding 64 0; 170 tall, borders #e6ebf5, 3 cells of 384 (padding 64 24 24, gap 16:
// 80x80 badge + title 18/22.5 -0.54 / desc 12/18, gap 2) with a 24x24 #c1d2fe chevron 20 from the top-right corner.
export default function HeroCompete({ eyebrow, title, body, panelTitle, panelLink = { label: 'See more', to: '/customers' }, tiles = [], links, proofs = [] }) {
  return (
    <header style={{ background: 'linear-gradient(#f5f8ff, #fff 80%)' }}>
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-[53px] px-4 pb-[43px] pt-16 md:gap-20 md:px-6 md:pb-16 md:pt-24">
        <div className="flex flex-col items-center text-center">
          <p className="font-mono text-xs leading-[15px] tracking-[normal] text-cobalt md:text-sm md:leading-[17.5px]">{eyebrow}</p>
          <h1 className="b-display mt-[21px] !text-[36px] !leading-[36px] !tracking-[-1.08px] md:mt-8 md:!text-[64px] md:!leading-[64px] md:!tracking-[-1.92px]">{title}</h1>
          <p className="t-body-lg mt-[13px] max-w-[702px] md:mt-5">{body}</p>
          <div className="mt-[21px] w-full max-w-[552px] md:mt-8">
            <EmailCatcher submitLabel="Request a demo" label="What's your work email?" />
          </div>
        </div>
        {links ? (
          <div className="flex w-full max-w-[752px] flex-col gap-5 rounded-btn border border-line-light p-5">
            <h2 className="text-xl font-medium leading-[26px] tracking-[-0.72px] text-ink md:text-2xl md:leading-[30px]">{panelTitle}</h2>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {links.map((l, i) => (
                <li key={l.label}>
                  <SmartLink to={l.to} aria-label={l.label} className="relative block aspect-[351/197] overflow-hidden rounded-btn border border-[rgba(4,19,48,.12)] bg-[rgba(1,1,1,.08)]">
                    <Media slot={`compare.hero.link.${i}`} tone={i ? 'neutral' : 'cool'} className="absolute inset-0 h-full w-full" />
                  </SmartLink>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex w-full flex-col gap-[13px] rounded-btn border border-line-light p-[13px] md:gap-5 md:p-5">
            <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between md:gap-4">
              <h2 className="text-lg font-medium leading-[22.5px] tracking-[-0.54px] text-ink md:text-2xl md:leading-[30px] md:tracking-[-0.72px]">{panelTitle}</h2>
              <TextLink {...panelLink} />
            </div>
            <ul className="grid grid-cols-1 gap-[5px] sm:grid-cols-2 md:gap-2 lg:grid-cols-4">
              {tiles.map((t, i) => (
                <li
                  key={i}
                  className="relative flex min-h-[208px] flex-col justify-between gap-8 overflow-hidden rounded-btn border border-[rgba(4,19,48,.12)] bg-white p-[13px] md:gap-12 md:p-5 lg:h-[316px]"
                >
                  <Media slot={`compare.hero.tile.${i}`} tone={t.dark ? 'dark' : t.photo ? 'cool' : 'neutral'} className={`absolute inset-0 h-full w-full ${t.photo || t.dark ? '' : 'opacity-20'}`} />
                  <span className="relative flex flex-col gap-2 md:gap-3">
                    {t.value && <span className={`text-[36px] font-light leading-[36px] tracking-[-1.08px] md:text-8xl md:leading-[64px] md:tracking-[-1.92px] ${t.dark ? 'text-white' : 'text-ink'}`}>{t.value}</span>}
                    <span className={`text-md font-medium leading-5 tracking-[-0.48px] md:text-xl md:leading-[26.25px] md:tracking-[-0.63px] ${t.dark ? 'text-white/80' : 'text-ink'}`}>{t.label}</span>
                  </span>
                  <span className={`relative text-md font-medium leading-[19.2px] tracking-[-0.16px] ${t.dark ? 'text-white/80' : 'text-[rgba(4,19,48,.8)]'}`}>{t.desc}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {/* Proof strip: full-bleed, 3 cells of 384; decorative 528x168 graphics in the outer gutters */}
      <div className="py-10 md:py-16">
        <div className="relative border-y border-line-light">
          <Media slot="compare.hero.gutter.l" tone="cool" className="absolute bottom-0 left-0 hidden h-[168px] w-[calc((100%-1152px)/2)] xl:block" />
          <Media slot="compare.hero.gutter.r" tone="cool" className="absolute bottom-0 right-0 hidden h-[168px] w-[calc((100%-1152px)/2)] xl:block" />
          <ul className="mx-auto grid max-w-[1152px] grid-cols-1 md:grid-cols-3 md:border-l md:border-line-light">
            {proofs.map((p, i) => (
              <li key={i} className="border-b border-line-light md:border-b-0 md:border-r">
                {/* MOTION: arrow icon colour .12s */}
                <SmartLink to={p.to ?? '/forrester-wave-2026'} className="group relative flex items-end gap-4 px-6 pb-6 pt-8 md:h-[168px] md:pt-16">
                  <Media slot={`compare.hero.badge.${i}`} tone="neutral" fit="contain" className="h-16 w-16 shrink-0 md:h-20 md:w-20" />
                  <span className="flex flex-col gap-[2px]">
                    <span className="text-lg font-medium leading-[22.5px] tracking-[-0.54px] text-ink">{p.title}</span>
                    <span className="text-xs font-medium leading-[18px] tracking-[-0.12px] text-ink-secondary">{p.desc}</span>
                  </span>
                  <span className="absolute right-5 top-5 flex h-6 w-6 rotate-180 items-center justify-center text-cobalt-20 transition-colors duration-[120ms] group-hover:text-cobalt">
                    <ChevronLeft16 />
                  </span>
                </SmartLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  )
}
