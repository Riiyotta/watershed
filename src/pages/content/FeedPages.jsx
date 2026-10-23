import FeedIndex from '../../templates/FeedIndex.jsx'
import NewsPage from './NewsPage.jsx'
import { BLOG_CHIPS, POSTS } from '../../content/posts.js'
import { GUIDES } from '../../content/guides.js'
import { EVENT_CHIPS, EVENTS } from '../../content/events.js'

const asFeed = (x) => ({ path: x.path, title: x.title, date: x.dateLabel ?? x.date, excerpt: x.excerpt, slot: x.slot, tone: x.tone, category: x.category })

// blog-index: /news (sidebar press page) and /blog (feed). /blog is not yet in routes.json (see report).
export function BlogIndexPage({ path }) {
  if (path === '/news') return <NewsPage />
  return <FeedIndex title="Blog" items={POSTS.map(asFeed)} chips={BLOG_CHIPS} search />
}

// guides-index: guides plus guide-category blog posts, newest first. No filters.
export function GuidesIndexPage() {
  const items = [...GUIDES, ...POSTS.filter((p) => p.category === 'guides')].sort((a, b) => b.time - a.time).map(asFeed)
  return <FeedIndex title="Guides" items={items} />
}

// events-index: chips only, 3 hero slides.
export function EventsIndexPage() {
  return <FeedIndex title="Events" items={EVENTS.map(asFeed)} chips={EVENT_CHIPS} slides={3} />
}
