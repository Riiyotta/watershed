// Blog posts (incl. /inside/*), generated from routes.json and seeded by slug.
import { pathsFor } from '../routing.js'
import { fmtLong, humanize, lastSegment, pick, rng, seededDate, TONES } from './seed.js'
import { ARTICLE_LONG, ARTICLE_SHORT } from './bodies.js'

// /blog filter chips (§4.3: 7 chips incl. All)
export const BLOG_CHIPS = [
  { slug: 'product-updates', label: 'Product updates' },
  { slug: 'guides', label: 'Guides' },
  { slug: 'sustainability-ai', label: 'Sustainability AI' },
  { slug: 'customer-stories', label: 'Customer stories' },
  { slug: 'policy', label: 'Policy' },
  { slug: 'tech-design', label: 'Tech & design' },
]

const TAG_COLOURS = { 'product-updates': '#053ce1', guides: '#00bb81', 'sustainability-ai': '#ff6633', 'customer-stories': '#4a6fff', policy: '#0b2471', 'tech-design': '#1d7368' }

function categoryFor(slug, r) {
  if (/policy|sec-|sb-?253|sb-?261|csrd|esrs|issb|aasb|regulat|omnibus|disclosure|law|rule/.test(slug)) return 'policy'
  if (/ai-|-ai|llm|agent/.test(slug)) return 'sustainability-ai'
  if (/guide|how-to|toolkit|101|primer|what-is/.test(slug)) return 'guides'
  if (/release|launch|introduc|announc|new-/.test(slug)) return 'product-updates'
  return pick(r, ['product-updates', 'guides', 'sustainability-ai', 'customer-stories', 'policy'])
}

const SUBTITLES = ['A practical overview for climate teams', 'What changed and what to do next', 'Notes from the Northwind research team', null, null]

function build(path) {
  const slug = lastSegment(path)
  const r = rng(path)
  const inside = path.startsWith('/inside/')
  const category = inside ? 'tech-design' : categoryFor(slug, r)
  const d = seededDate(path, inside ? 2021 : 2019, 2026)
  const hasToc = slug === 'esg-disclosure-toolkit' || (!inside && r() < 0.3)
  return {
    path,
    slug,
    inside,
    title: humanize(slug),
    category,
    categoryLabel: BLOG_CHIPS.find((c) => c.slug === category).label,
    tagColour: TAG_COLOURS[category],
    time: d.getTime(),
    date: fmtLong(d),
    dateLabel: r() < 0.25 ? `Updated: ${fmtLong(d)}` : fmtLong(d),
    subtitle: pick(r, SUBTITLES),
    excerpt: 'A short placeholder summary of the article that explains what readers will learn and why it matters for climate teams today.',
    slot: `post.${slug}.hero`,
    tone: pick(r, TONES),
    hasToc,
    body: hasToc ? ARTICLE_LONG : ARTICLE_SHORT,
  }
}

export const POSTS = pathsFor('blog-post')
  .map(build)
  .sort((a, b) => b.time - a.time)

const byPath = new Map(POSTS.map((p) => [p.path, p]))
export const getPost = (path) => byPath.get(path)

// 3 related posts (same category first), deterministic.
export function relatedPosts(path, n = 3) {
  const p = byPath.get(path)
  const pool = POSTS.filter((x) => x.path !== path && (!p || x.category === p.category))
  const r = rng(`related:${path}`)
  const out = []
  const src = pool.length >= n ? pool : POSTS.filter((x) => x.path !== path)
  while (out.length < n && out.length < src.length) {
    const c = src[Math.floor(r() * src.length)]
    if (!out.includes(c)) out.push(c)
  }
  return out
}
