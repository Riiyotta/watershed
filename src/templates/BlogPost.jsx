import { Link } from 'react-router-dom'
import { href } from '../routing.js'
import { FeedGrid, NewsletterBand, PostHero, Prose, Toc, tocFromBlocks } from '../primitives/index.js'

// §4.4 BlogPostTemplate (blog posts, /inside/*, customer Variant B).
// props: { crumbs, date, title, subtitle, slot, tone, body, hasToc, tags:[{label, path, colour}], related:[FeedCard items] }
export default function BlogPost({ crumbs, date, title, subtitle, slot, tone, body, hasToc = false, tags = [], related = [] }) {
  // measured: the TOC opens with an "Introduction" item pointing at the article top
  const toc = hasToc ? [{ id: 'introduction', text: 'Introduction', level: 2 }, ...tocFromBlocks(body)] : []
  const tagsRow = tags.length > 0 && (
    <ul className="blogTags mb-4 flex flex-wrap items-center gap-3">
      <li className="font-mono text-sm font-medium leading-[22px] tracking-[-0.3px] text-[#6d7fb2]">Topics:</li>
      {tags.map((t) => (
        <li key={t.label} className="my-2">
          <Link to={href(t.path)} className="flex items-center gap-1 text-sm font-medium leading-[18.06px] text-midnight hover:text-cobalt">
            <span className="mb-0.5 h-2 w-2 rounded-full" style={{ background: t.colour }} aria-hidden="true" />
            {t.label}
          </Link>
        </li>
      ))}
    </ul>
  )
  return (
    <>
      <PostHero crumbs={crumbs} date={date} title={title} subtitle={subtitle} slot={slot} tone={tone} />
      <main className="mx-auto max-w-[1280px] pt-[43px] md:pt-16">
        {hasToc ? (
          <div className="grid grid-cols-1 gap-6 pb-6 lg:grid-cols-[minmax(0,821.3px)_minmax(0,410.6px)] lg:justify-center lg:px-3">
            <article id="introduction" className="mx-auto w-full max-w-[780px] scroll-mt-[120px] px-4 lg:px-6">
              <Prose blocks={body} />
              {tagsRow}
            </article>
            <aside className="sidebar hidden pr-4 lg:block">
              <Toc items={toc} top={100} />
            </aside>
          </div>
        ) : (
          <article className="mx-auto max-w-[780px] px-4 pb-6 md:px-6">
            <Prose blocks={body} />
            {tagsRow}
          </article>
        )}
      </main>
      <div className="pt-16">
        <NewsletterBand />
      </div>
      {related.length > 0 && (
        <section className="py-section">
          <div className="container-ws">
            <h2 className="sr-only-ws">Related content</h2>
            <FeedGrid items={related} showDate={false} />
          </div>
        </section>
      )}
    </>
  )
}
