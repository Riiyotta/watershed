// /news (press coverage + releases) and /legal index data. All placeholder; outlets are invented.
import { fmtDayMon, fmtNumeric, fmtShort, rng, seededDate } from './seed.js'

const OUTLETS = ['The Daily Ledger', 'Climate Wire Weekly', 'Market Signal', 'Green Business Review', 'Tech & Planet', 'The Morning Brief', 'Sustainability Today', 'Data Desk']
const HEADLINES = [
  'A new estimate for the footprint of corporate computing',
  'Why disclosure is becoming a board-level topic',
  'Startups race to make supply-chain emissions measurable',
  'How assistive tools are changing climate reporting',
  'The quiet rise of the in-house climate data team',
  'What the latest reporting rules mean for mid-sized companies',
  'Clean power procurement goes mainstream',
  'Inside the push for better emissions factors',
  'Ten companies to watch in sustainability software',
  'Automating the busywork out of ESG data',
  'Supplier engagement moves from surveys to shared data',
  'The case for open emissions data',
  'Investors want climate numbers they can trust',
  'Carbon accounting grows up',
]

export const COVERAGE = HEADLINES.map((title, i) => {
  const d = seededDate(`cov:${i}`, 2025, 2026)
  return { title, outlet: OUTLETS[Math.floor(rng(`o:${i}`)() * OUTLETS.length)], date: fmtNumeric(d), time: d.getTime(), external: true } // press outlets are off-site: rendered as non-links
}).sort((a, b) => b.time - a.time)

const RELEASES_T = [
  'Northwind publishes an open framework for measuring computing emissions',
  'Northwind customers commit to new clean energy investment',
  'Northwind introduces assistive agents for climate teams',
  'Independent analysts recognise Northwind in carbon management software',
  'Northwind partners with a renewable developer on new projects',
  'Northwind launches product footprints for supply chains',
  'Northwind supports an initiative to keep emissions data open',
  'Northwind expands to a new region',
  'Northwind and partners source clean power across emerging markets',
  'Northwind opens a research fellowship',
]
export const RELEASES = RELEASES_T.map((title, i) => {
  const d = seededDate(`rel:${i}`, 2024, 2026)
  return { title, date: fmtDayMon(d), time: d.getTime(), to: '/blog' }
}).sort((a, b) => b.time - a.time)

// /legal index: 3 current groups + archived (§4.7)
const doc = (title, seed, to) => ({ title, date: fmtShort(seededDate(seed, 2023, 2026)), to })
export const LEGAL_GROUPS = [
  {
    id: 'software-agreements',
    heading: 'Software agreements',
    items: [doc('Master subscription agreement', 'l1', '/legal/terms'), doc('Data processing addendum', 'l2', '/legal/privacy'), doc('Data portal terms', 'l3', '/legal/data-portal-terms')],
  },
  {
    id: 'solutions-agreements',
    heading: 'Solutions agreements',
    items: [doc('Environmental credit agreement', 'l4', '/legal/terms'), doc('Supplier agreement', 'l5', '/legal/terms'), doc('Annex', 'l6', '/legal/terms')],
  },
  {
    id: 'website-policies',
    heading: 'Website terms and policies',
    items: [doc('Website terms of service', 'l7', '/legal/terms'), doc('Privacy policy', 'l8', '/legal/privacy'), doc('Security', 'l9', '/legal/security')],
  },
  {
    id: 'archived',
    heading: 'Archived agreements',
    items: [doc('Master subscription agreement', 'l10', '/legal/terms'), doc('Master subscription agreement', 'l11', '/legal/terms'), doc('Privacy policy', 'l12', '/legal/privacy'), doc('Privacy policy', 'l13', '/legal/privacy')],
  },
]
