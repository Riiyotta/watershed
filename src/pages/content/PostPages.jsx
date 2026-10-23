import { getPost, relatedPosts } from '../../content/posts.js'
import { getStory, STORIES } from '../../content/customers.js'
import { ARTICLE_SHORT, PROFILE } from '../../content/bodies.js'
import { fmtLong, rng, seededDate } from '../../content/seed.js'
import BlogPost from '../../templates/BlogPost.jsx'
import CustomerStory from '../../templates/CustomerStory.jsx'

const feedItem = (p) => ({ path: p.path, title: p.title, slot: p.slot, tone: p.tone })

// blog-post (incl. /inside/*)
export function BlogPostPage({ path }) {
  const p = getPost(path)
  const crumbs = p.inside
    ? [
        { label: 'News & blog', path: '/blog' },
        { label: 'Inside Northwind', path: '/blog?filter=tech-design' },
      ]
    : [
        { label: 'News & blog', path: '/blog' },
        { label: p.categoryLabel, path: `/blog?filter=${p.category}` },
      ]
  return (
    <BlogPost
      crumbs={crumbs}
      date={p.dateLabel}
      title={p.title}
      subtitle={p.subtitle}
      slot={p.slot}
      tone={p.tone}
      body={p.body}
      hasToc={p.hasToc}
      // measured: /inside/* posts have no Topics row
      tags={p.inside ? [] : [{ label: p.categoryLabel, path: `/blog?filter=${p.category}`, colour: p.tagColour }]}
      related={relatedPosts(path).map(feedItem)}
    />
  )
}

// customer-story: Variant A (story template) for brand slugs, Variant B (blog post layout) for sentence slugs.
export function CustomerStoryPage({ path }) {
  const s = getStory(path)
  const i = STORIES.indexOf(s)
  if (s.variant === 'A') {
    const nextA = STORIES.slice(i + 1).concat(STORIES.slice(0, i)).find((x) => x.variant === 'A')
    // "Additional resources" PageLinks only on some stories (e.g. adventhealth, flexera)
    const related = ['adventhealth', 'flexera'].includes(s.slug)
      ? STORIES.filter((x) => x !== s)
          .slice(0, 4)
          .map((x) => ({ path: x.path, eyebrow: 'Customer story', title: x.company, slot: x.slot, tone: x.tone }))
      : null
    return <CustomerStory story={s} next={nextA?.path} related={related} />
  }
  const r = rng(path)
  const others = STORIES.filter((x) => x !== s && x.variant === 'B')
  return (
    <BlogPost
      crumbs={[
        { label: 'Customers', path: '/customers' },
        { label: 'Customer stories', path: '/customers?type=customer-stories' },
      ]}
      date={fmtLong(seededDate(path, 2021, 2025))}
      title={s.title}
      subtitle={s.subtitle}
      slot={s.slot}
      tone={s.tone}
      body={s.type === 'climate-leads' ? PROFILE : ARTICLE_SHORT}
      related={others.slice(Math.floor(r() * (others.length - 3))).slice(0, 3).map((x) => ({ path: x.path, title: x.title, slot: x.slot, tone: x.tone }))}
    />
  )
}
