// Events, generated from routes.json and seeded by slug.
import { pathsFor } from '../routing.js'
import { fmtEventDay, fmtLong, humanize, lastSegment, pick, rng, seededDate, TONES } from './seed.js'

// /events filter chips (§4.3: 8 chips incl. All)
export const EVENT_CHIPS = [
  { slug: 'webinars', label: 'Webinars' },
  { slug: 'in-person', label: 'In person' },
  { slug: 'demos', label: 'Demos' },
  { slug: 'office-hours', label: 'Office hours' },
  { slug: 'summits', label: 'Summits' },
  { slug: 'policy-briefings', label: 'Policy briefings' },
  { slug: 'on-demand', label: 'On demand' },
]

// Slugs that redirect to /demo on the real site (§4.6, §6)
export const EVENT_REDIRECTS = new Set(['/events/ai-features-demo-1', '/events/california-climate-disclosures-demo'])

// SummitEventTemplate variant (§3.34): summit / climate-week style pages
export const isSummit = (slug) => /climate-week|summit/.test(slug)

const CITIES = ['London', 'New York', 'San Francisco', 'Berlin', 'Sydney', 'Paris', 'Amsterdam', 'Toronto']
const TODAY = Date.UTC(2026, 9, 23)

function category(slug) {
  if (isSummit(slug)) return 'summits'
  if (/demo|demonstration|proof-of-concept/.test(slug)) return 'demos'
  if (/office-hours/.test(slug)) return 'office-hours'
  if (/policy|briefing|sb-?253|wiener|carb|ccdaa|ab-1305|election|circuit/.test(slug)) return 'policy-briefings'
  if (/london|reuters|greenbiz|greenfin|vivatech|economist|breakfast|net-?zero-?live|google-next|pei-|cityweek|informa|scope3innovation|sustainability-live|trellis|cips/.test(slug)) return 'in-person'
  return 'webinars'
}

function build(path) {
  const slug = lastSegment(path)
  const r = rng(path)
  const d = seededDate(path, 2023, 2026)
  const cat = category(slug)
  const past = d.getTime() < TODAY
  const inPerson = cat === 'in-person' || cat === 'summits'
  const hour = 8 + Math.floor(r() * 9)
  return {
    path,
    slug,
    title: humanize(slug),
    category: past && cat === 'webinars' && r() < 0.5 ? 'on-demand' : cat,
    time: d.getTime(),
    date: fmtLong(d),
    dayLabel: fmtEventDay(d),
    timeLabel: `${String(hour).padStart(2, '0')}:${pick(r, ['00', '15', '30'])} UTC`,
    location: inPerson ? `${pick(r, CITIES)} (venue to be confirmed)` : null,
    isPast: past,
    summit: isSummit(slug),
    redirect: EVENT_REDIRECTS.has(path),
    slot: `event.${slug}.cover`,
    tone: pick(r, TONES),
    excerpt: 'A placeholder description of the session: who it is for, what will be covered and how to take part.',
  }
}

export const EVENTS = pathsFor('event')
  .map(build)
  .filter((e) => !e.redirect)
  .sort((a, b) => b.time - a.time)

const byPath = new Map(pathsFor('event').map((p) => [p, build(p)]))
export const getEvent = (path) => byPath.get(path)
