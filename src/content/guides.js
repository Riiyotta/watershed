// Guides, generated from routes.json and seeded by slug.
import { pathsFor } from '../routing.js'
import { fmtLong, humanize, lastSegment, pick, rng, seededDate, TONES } from './seed.js'

// /guides/climate-economy redirects to /guides on the real site (§4.6)
export const GUIDE_REDIRECTS = new Set(['/guides/climate-economy'])

function build(path) {
  const slug = lastSegment(path)
  const r = rng(path)
  const d = seededDate(path, 2023, 2026)
  return {
    path,
    slug,
    title: humanize(slug),
    time: d.getTime(),
    date: fmtLong(d),
    slot: `guide.${slug}.cover`,
    tone: pick(r, TONES),
    excerpt: 'A placeholder summary of the guide: the questions it answers and the practical steps it walks through.',
    redirect: GUIDE_REDIRECTS.has(path),
  }
}

export const GUIDES = pathsFor('guide')
  .map(build)
  .filter((g) => !g.redirect)
  .sort((a, b) => b.time - a.time)

const byPath = new Map(pathsFor('guide').map((p) => [p, build(p)]))
export const getGuide = (path) => byPath.get(path)
