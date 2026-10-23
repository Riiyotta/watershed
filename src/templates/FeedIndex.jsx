import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FeaturedCarousel, FeedGrid, FeedSearch, FilterChips, LoadMore, NewsletterBand } from '../primitives/index.js'

// §4.3 ContentHero + FeedGrid (/blog, /guides, /events).
// items: [{path, title, date, excerpt, slot, tone, category}]; chips (optional) filter by `category` via ?filter=
export default function FeedIndex({ title, items, slides = 5, chips, search = false }) {
  const [params, setParams] = useSearchParams()
  const filter = params.get('filter') ?? ''
  const [query, setQuery] = useState('')
  const [count, setCount] = useState(12)

  const filtered = useMemo(() => {
    let out = items
    if (chips && filter) out = out.filter((i) => i.category === filter)
    if (query) out = out.filter((i) => i.title.toLowerCase().includes(query.toLowerCase()))
    return out
  }, [items, chips, filter, query])

  const setFilter = (slug) => {
    const next = new URLSearchParams(params)
    if (slug) next.set('filter', slug)
    else next.delete('filter')
    setParams(next, { replace: true, preventScrollReset: true })
    setCount(12)
  }

  const shown = filtered.slice(0, count)
  return (
    <>
      <FeaturedCarousel title={title} slides={items.slice(0, slides)} />
      <section className="overflow-x-clip pb-16 pt-[43px] md:pb-section md:pt-16">
        <div className="container-ws flex flex-col gap-[21px] md:gap-8">
          {(chips || search) && (
            <div className="flex flex-col gap-[11px] md:flex-row md:items-start md:justify-between md:gap-4">
              {chips ? <FilterChips chips={chips} value={filter} onChange={setFilter} /> : <span />}
              {search && (
                <FeedSearch
                  className="w-full md:w-auto"
                  onSearch={(q) => {
                    setQuery(q)
                    setCount(12)
                  }}
                />
              )}
            </div>
          )}
          <FeedGrid items={shown} inset={<NewsletterBand />} insetAfter={6} />
          {shown.length === 0 && <p className="text-ink-secondary">No results. Try another filter.</p>}
          {filtered.length > count && <LoadMore onClick={() => setCount((c) => c + 12)} />}
        </div>
      </section>
    </>
  )
}
