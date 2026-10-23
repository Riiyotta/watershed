// Customer stories + /customers grid data. Slugs contain real company names, so every story is
// presented under an invented company name with a PlaceholderLogo. No real names/logos are shown.
import { pathsFor } from '../routing.js'
import { hash, lastSegment, pick, rng, TONES } from './seed.js'

const NAMES = [
  'Acme Logistics', 'Brightwater Foods', 'Calder Health', 'Driftwood Apparel', 'Elm & Oak Retail', 'Fennel Software', 'Granite Freight',
  'Harbourline Media', 'Ironleaf Manufacturing', 'Juniper Financial', 'Kitebridge Travel', 'Lakeshore Markets', 'Meridian Devices',
  'Northgate Services', 'Oakhaven Bank', 'Pebblestone Design', 'Quarry Lane Group', 'Riverton Health', 'Saltmarsh Beauty',
  'Tallpine Outdoor', 'Umberfield Ports', 'Vantage Analytics', 'Westbrook Consulting', 'Yarrow Hospitality', 'Zephyr Payments',
  'Amberline Energy', 'Bluefen Capital', 'Cobalt Ridge Tech', 'Dunmore Paper', 'Eastwind Telecom', 'Fairhaven Homes', 'Glenrock Mining',
  'Hollybrook Dental', 'Islay Beverages', 'Jasper Robotics', 'Kingsmere Insurance', 'Larkspur Cloud', 'Moorfield Engineering',
  'Nettlebed Grocers', 'Orchard Street Labs', 'Penrose Medical', 'Quillfeather Books', 'Redcliff Steel', 'Sandpiper Airlines',
  'Thornbury Textiles', 'Upland Coffee', 'Valewood Furniture', 'Wexford Chemicals', 'Yewtree Education', 'Zinnia Cosmetics',
  'Ashgrove Pharma', 'Birchfield Media', 'Cedarline Travel', 'Dovecote Studios', 'Emberly Foods', 'Foxglove Fashion', 'Galeway Shipping',
  'Heathcote Brewing', 'Inkwell Print', 'Juno Mobility', 'Kestrel Fintech', 'Lindenwood Retail', 'Marram Outdoors', 'Northcliff Data',
  'Osprey Engineering', 'Plover Health', 'Quayside Markets', 'Rowan Software', 'Silverbirch Hotels', 'Tamarisk Apparel', 'Underhill Freight',
  'Violet Lane Beauty', 'Willowmere Bank', 'Yardley Tools', 'Zest Kitchens', 'Alder Point Media', 'Bramble Analytics', 'Coppergate Ports',
  'Dewpond Water', 'Elderberry Goods', 'Fernleigh Group', 'Goldcrest Devices', 'Hawthorn Capital',
]
const MARKS = ['circle', 'diamond', 'bars', 'ring', 'square', 'leaf', null]

export const REGIONS = [
  { value: 'anz', label: 'ANZ' },
  { value: 'europe', label: 'Europe' },
  { value: 'north-america', label: 'North America' },
]
export const INDUSTRIES = [
  { value: 'consumer-goods', label: 'Consumer goods' },
  { value: 'financial-services', label: 'Financial services' },
  { value: 'food-beverage-and-hospitality', label: 'Food, beverage and hospitality' },
  { value: 'manufacturing-and-industrial', label: 'Manufacturing and industrial' },
  { value: 'professional-services', label: 'Professional services' },
  { value: 'retail', label: 'Retail' },
  { value: 'technology', label: 'Technology' },
  { value: 'transportation', label: 'Transportation' },
]
export const TYPES = [
  { value: 'customer-stories', label: 'Customer stories' },
  { value: 'climate-leads', label: 'Climate leads' },
  { value: 'milestones', label: 'Milestones' },
  { value: 'reports', label: 'Reports' },
]

const A_EXCEPTIONS = new Set(['fortune-500-media-company', 'global-technology-company', 'hain-celestial', 'henry-schein'])
// §4.5 rule of thumb: brand-name slugs = Variant A (story template), sentence-style slugs = Variant B (blog post layout)
export const storyVariant = (slug) => (!slug.includes('-') || A_EXCEPTIONS.has(slug) ? 'A' : 'B')

const A_TITLES = [
  (n) => `How ${n} built a supplier programme that cut emissions year on year`,
  (n) => `${n} measures its full footprint and reports with confidence`,
  (n) => `Inside ${n}'s plan to decarbonise its value chain`,
  (n) => `${n} turns climate data into everyday business decisions`,
  (n) => `How ${n} moved from annual spreadsheets to a continuous climate programme`,
]
const B_TITLES = {
  profile: (n) => `Profiling leaders in climate action: a conversation with ${n}'s sustainability lead`,
  milestone: (n) => `${n} marks a milestone in its climate programme`,
  story: (n) => `How ${n} is making climate progress part of the customer experience`,
}
const SUBTITLES = [
  'A placeholder summary of how a fictional climate team scaled its programme and what it learned along the way.',
  'Invented company, invented figures: a sample story that shows the structure of a customer case study.',
]

function typeFor(slug, variant) {
  if (variant === 'A') return 'customer-stories'
  if (/profiling|climate-leads|profile/.test(slug)) return 'climate-leads'
  if (/earth-day|summit|recap/.test(slug)) return 'milestones'
  return 'customer-stories'
}

const storyPaths = pathsFor('customer-story')

function build(path, i) {
  const slug = lastSegment(path)
  const r = rng(path)
  const variant = storyVariant(slug)
  const company = NAMES[i % NAMES.length]
  const type = typeFor(slug, variant)
  const title =
    variant === 'A'
      ? pick(r, A_TITLES)(company)
      : type === 'climate-leads'
        ? B_TITLES.profile(company)
        : type === 'milestones'
          ? B_TITLES.milestone(company)
          : B_TITLES.story(company)
  return {
    path,
    slug,
    variant,
    company,
    logo: { name: company.split(' ')[0], mark: MARKS[i % MARKS.length] },
    title,
    subtitle: pick(r, SUBTITLES),
    type,
    region: pick(r, REGIONS).value,
    industry: pick(r, INDUSTRIES).value,
    size: pick(r, ['500+', '1,000+', '5,000+', '10,000+']),
    products: pick(r, [['Measurement', 'Reporting'], ['Measurement', 'Supplier engagement'], ['Measurement', 'Reporting', 'Product footprints']]),
    slot: `customer.${slug}.hero`,
    tone: pick(r, TONES),
    external: false,
  }
}

export const STORIES = storyPaths.map(build)
const byPath = new Map(STORIES.map((s) => [s.path, s]))
export const getStory = (path) => byPath.get(path)

// /customers grid: 83 cards measured. 51 internal stories + 32 external "report" cards.
// External destinations on the real site are customer sites / ESG PDFs; here they render as non-link cards.
const EXTERNAL = Array.from({ length: 83 - STORIES.length }, (_, k) => {
  const i = STORIES.length + k
  const company = NAMES[i % NAMES.length]
  const r = rng(`ext:${i}`)
  return {
    path: null, // real site links to external customer reports; the clone never links off-site
    slug: `report-${k + 1}`,
    company,
    logo: { name: company.split(' ')[0], mark: MARKS[i % MARKS.length] },
    title: `${company} publishes its annual climate report`,
    type: r() < 0.7 ? 'reports' : 'milestones',
    region: pick(r, REGIONS).value,
    industry: pick(r, INDUSTRIES).value,
    slot: `customer.report.${k + 1}`,
    tone: pick(r, TONES),
    external: true,
  }
})

export const CUSTOMER_GRID = [...STORIES, ...EXTERNAL]
  .map((c) => [hash(`order:${c.slug}`), c])
  .sort((a, b) => a[0] - b[0])
  .map(([, c]) => c)
export const FEATURED_STORIES = STORIES.slice(0, 30)
