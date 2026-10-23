import './primitives.css'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import Media from '../components/Media.jsx'
import { href, isExternal } from '../routing.js'
import { SearchIcon } from './icons.jsx'

// §4.3 FeedCard (a). item: { path, title, date?, slot, tone? }. `showDate=false` for RelatedContent.
export function FeedCard({ item, showDate = true, headingLevel = 'h2' }) {
  const H = headingLevel
  // Off-site destinations render as a non-link card (no hover affordance)
  const linked = item.path && !isExternal(item.path)
  const Tag = linked ? Link : 'div'
  return (
    <Tag {...(linked ? { to: href(item.path) } : {})} className={`${linked ? 'feed-card' : ''} flex flex-col gap-4 rounded-btn md:gap-6`}>
      <div className="feed-media aspect-video w-full overflow-hidden rounded-btn border border-line-light bg-gray-10 xl:aspect-auto xl:h-[198px]">
        <Media slot={item.slot} tone={item.tone} className="h-full w-full" />
      </div>
      <div className="flex flex-col gap-2 md:gap-3">
        <H className="feed-title [overflow-wrap:anywhere] text-md font-medium leading-5 tracking-[-0.48px] text-ink md:text-xl md:leading-[26.25px] md:tracking-[-0.63px]">{item.title}</H>
        {showDate && item.date && (
          <p className="font-mono text-xs font-medium leading-[15px] tracking-[normal] text-ink-secondary md:text-sm md:leading-[17.5px]">{item.date}</p>
        )}
      </div>
    </Tag>
  )
}

// Grid 3 x 352, gap 48 (390: 1 column, gap 32). `insetAfter` + `inset` render a full-bleed row
// (e.g. NewsletterBand) after that many cards, then the rest continue in a new grid.
export function FeedGrid({ items, insetAfter = 6, inset = null, showDate = true, className = '' }) {
  const grid = 'grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 lg:grid-cols-3 xl:grid-cols-[repeat(3,352px)]'
  const first = inset ? items.slice(0, insetAfter) : items
  const rest = inset ? items.slice(insetAfter) : []
  return (
    <div className={className}>
      <div className={grid}>
        {first.map((it) => (
          <FeedCard key={it.path ?? it.title} item={it} showDate={showDate} />
        ))}
      </div>
      {inset && first.length >= insetAfter && (
        <Fragment>
          {/* FeedGrid.inset: full-bleed row */}
          <div className="feed-inset -mx-4 my-[21px] md:my-8">{inset}</div>
          {rest.length > 0 && (
            <div className={grid}>
              {rest.map((it) => (
                <FeedCard key={it.path ?? it.title} item={it} showDate={showDate} />
              ))}
            </div>
          )}
        </Fragment>
      )}
    </div>
  )
}

// Filter chips (§4.3). chips: [{slug, label}], value: '' = All.
export function FilterChips({ chips, value, onChange, className = '' }) {
  const all = [{ slug: '', label: 'All' }, ...chips]
  return (
    <div className={`no-scrollbar -mx-4 flex gap-[5px] overflow-x-auto px-4 md:mx-0 md:flex-wrap md:gap-2 md:overflow-visible md:px-0 ${className}`} role="group" aria-label="Filter">
      {all.map((c) => (
        <button
          key={c.slug || 'all'}
          type="button"
          aria-pressed={value === c.slug}
          onClick={() => onChange(c.slug)}
          className={`feed-chip h-[30px] shrink-0 whitespace-nowrap rounded-btn border border-line-light bg-white px-[9px] py-[5px] text-xs font-medium leading-[18px] text-ink md:h-10 md:px-[14px] md:py-2 md:text-sm md:leading-[21px] ${value === c.slug ? 'is-active' : ''}`}
        >
          {c.label}
        </button>
      ))}
    </div>
  )
}

// Feed search (§4.3): 160x40, icon at left. Submits on Enter (sampling suggested no live filtering).
export function FeedSearch({ onSearch, placeholder = 'Search posts', className = '' }) {
  return (
    <form
      role="search"
      className={`relative ${className}`}
      onSubmit={(e) => {
        e.preventDefault()
        onSearch?.(new FormData(e.currentTarget).get('q')?.toString().trim() ?? '')
      }}
    >
      <SearchIcon className="pointer-events-none absolute left-[9px] top-1/2 md:left-[14px] -translate-y-1/2 text-ink" />
      <input
        type="search"
        name="q"
        placeholder={placeholder}
        aria-label={placeholder}
        className="feed-search h-[30px] w-full rounded-btn border border-line-light bg-white py-[5px] pl-[30px] pr-[9px] text-xs font-medium text-ink outline-none transition-[border-color] duration-200 placeholder:text-ink-disabled md:h-10 md:w-[160px] md:py-2 md:pl-[38px] md:pr-[14px] md:text-sm"
      />
    </form>
  )
}

export function LoadMore({ onClick, label = 'Load more' }) {
  return (
    <div className="flex justify-center pt-[21px] md:pt-8">
      <button type="button" className="btn-load-more" onClick={onClick}>
        {label}
      </button>
    </div>
  )
}
