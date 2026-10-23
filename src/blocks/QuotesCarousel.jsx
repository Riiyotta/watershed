import { TextLink } from './ui.jsx'

// §3.31 QuotesCarousel: 384-wide cards with a #658dfd left rule. 3 visible; scrolls at 390.
// Measured 1440 (/compare): the slider starts at the 1200 container edge (x 120, no inline padding), pitch 408
// (gap 24); header keeps the 24 padding. Card: heading → quote 20, quote → byline 40 (byline pinned to the bottom).
export default function QuotesCarousel({ title, link, quotes = [] }) {
  return (
    <section className="py-[43px] md:py-section lg:py-16 wide:py-section">
      {/* 1024-1279 (original max-width 1279): 12px container, stacked header, three cards share the row with no rule */}
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10 md:gap-12 lg:px-3 wide:px-0">
        <div className="flex flex-col gap-4 px-4 md:flex-row md:items-baseline md:justify-between md:px-6 lg:flex-col lg:items-start lg:px-0 wide:flex-row wide:items-baseline wide:px-6">
          <h2 className="t-h2">{title}</h2>
          {link && <TextLink {...link} />}
        </div>
        {/* MOTION: keen-slider drag */}
        <div className="no-scrollbar flex gap-6 overflow-x-auto px-4 md:px-0">
          {quotes.map((q) => (
            <figure key={q.name + q.heading} className="flex w-[300px] shrink-0 flex-col justify-between gap-10 border-l border-cobalt-40 px-6 md:w-[384px] lg:w-[calc((100%-48px)/3)] lg:border-l-0 lg:pl-[8.1px] lg:pr-0 wide:w-[384px] wide:border-l wide:px-6">
              <div className="flex flex-col gap-5">
                <p className="text-2xl font-semibold leading-[26.4px] tracking-[-0.72px] text-cobalt">{q.heading}</p>
                <blockquote className="font-serif text-lg font-normal leading-[22.5px] tracking-[-0.18px] text-midnight">“{q.text}”</blockquote>
              </div>
              <figcaption className="flex flex-col gap-1">
                <span className="text-md font-semibold leading-[19.2px] tracking-[-0.48px] text-ink">{q.name}</span>
                <span className="text-sm font-medium leading-[16.8px] tracking-[-0.14px] text-ink-secondary">{q.detail}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
