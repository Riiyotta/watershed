import { Navigate } from 'react-router-dom'
import { href } from '../../routing.js'
import GatedLanding from '../../templates/GatedLanding.jsx'
import SummitEvent from '../../templates/SummitEvent.jsx'
import { getGuide, GUIDES } from '../../content/guides.js'
import { EVENTS, getEvent } from '../../content/events.js'
import { POSTS } from '../../content/posts.js'
import { GATED_EVENT, GATED_GUIDE, GATED_PODCAST } from '../../content/bodies.js'
import { rng } from '../../content/seed.js'

// 5 "Additional resources" cards: mix of guides, posts and events, deterministic per page.
export function relatedResources(path, n = 5) {
  const pool = [
    ...GUIDES.map((g) => ({ ...g, eyebrow: 'Guide' })),
    ...POSTS.slice(0, 40).map((p) => ({ ...p, eyebrow: 'Blog' })),
    ...EVENTS.slice(0, 20).map((e) => ({ ...e, eyebrow: 'Event' })),
  ].filter((x) => x.path !== path)
  const r = rng(`res:${path}`)
  const start = Math.floor(r() * (pool.length - n))
  return pool.slice(start, start + n).map((x) => ({ path: x.path, eyebrow: x.eyebrow, title: x.title, slot: x.slot, tone: x.tone }))
}

export function GuidePage({ path }) {
  const g = getGuide(path)
  if (g.redirect) return <Navigate to={href('/guides')} replace />
  // NOTE: /guides/state-of-corporate-sustainability-2025 uses SOC2025Theme on the real site (§4.6); rendered as GatedLanding here.
  return (
    <GatedLanding
      kind="guide"
      eyebrow="Northwind guide"
      title={g.title}
      body={GATED_GUIDE}
      form={{ title: 'Download the guide', fields: 'guide', submitLabel: 'Get your guide', imageSlot: g.slot }}
      related={relatedResources(path)}
    />
  )
}

const SPEAKERS = Array.from({ length: 11 }, (_, i) => ({ name: `Speaker name ${i + 1}`, role: ['Head of sustainability, placeholder company', 'Partner, placeholder firm', 'Policy lead, Northwind', 'Founder, placeholder startup'][i % 4] }))
const SESSIONS = [
  { time: '2:30pm', title: 'Doors open', desc: 'Grab a drink and find your seat.' },
  { time: '2:45pm', title: 'The year in climate data', desc: 'A placeholder keynote on what changed this year and what comes next for climate teams.' },
  { time: '3:30pm', title: 'Climate programmes in practice', desc: 'A placeholder panel of practitioners sharing what worked, what did not and what they would do differently.' },
  { time: '4:30pm', title: 'Networking', desc: 'Meet the Northwind team and fellow attendees.' },
]

// Two placeholder speakers per standard event (deterministic)
function eventSpeakers(path) {
  const r = rng(`speakers:${path}`)
  const i = Math.floor(r() * (SPEAKERS.length - 1))
  return SPEAKERS.slice(i, i + 2)
}

export function EventPage({ path }) {
  const e = getEvent(path)
  if (e.redirect) return <Navigate to={href('/demo')} replace />
  if (e.summit)
    return (
      <SummitEvent
        kicker={e.title.replace(/summit/i, '').trim() || 'Northwind'}
        title="Summit"
        dateLines={[e.dayLabel, e.timeLabel, e.location ?? 'Location to be confirmed']}
        body={GATED_EVENT.slice(0, 1)}
        speakers={SPEAKERS}
        sessions={SESSIONS}
      />
    )
  return (
    <GatedLanding
      kind="event"
      eyebrow="Northwind event"
      title={e.title}
      body={GATED_EVENT}
      logistics={{ date: e.dayLabel, time: e.timeLabel, location: e.location, isPast: e.isPast }}
      speakers={eventSpeakers(path)}
      form={{ title: e.isPast ? 'Watch the recording' : 'Register now', fields: 'event', submitLabel: e.isPast ? 'Watch now' : 'Register', imageSlot: e.slot }}
      related={relatedResources(path)}
    />
  )
}

// /podcast lives under the `company` template (owned by the block-pages agent). Exported for them to map.
export function PodcastPage() {
  return (
    <GatedLanding
      kind="podcast"
      eyebrow="Northwind podcast"
      title="Conversations on the climate economy"
      body={GATED_PODCAST}
      form={{ title: 'Get new episodes by email', fields: 'guide', submitLabel: 'Subscribe', imageSlot: 'podcast.cover' }}
      related={relatedResources('/podcast')}
    />
  )
}
