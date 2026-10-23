// Image slots → real files in public/img/slots/.
// Every file is either an openly licensed (CC0) photo, credited in IMAGE_CREDITS.md, or an
// original "Northwind" product artboard rendered from invented data. Nothing is taken from any brand site.
//
// Lookup order (see resolveMedia): 1. exact slot id in `exact`, 2. first matching pattern rule,
// which picks deterministically from a pool by hashing the slot id. A rule can return null to keep
// the gradient placeholder (logos, award badges, decorative illustrations).
// To pin a specific image to a slot, add it to `exact`.

const P = '/img/slots/'
const photo = (n) => `${P}photo-${n}.jpg`
const ab = (n) => `${P}ab-${n}.jpg`

// ---- pools -------------------------------------------------------------------------------
const NATURE = ['wind-sunset', 'wind-offshore', 'wind-field', 'wind-hills', 'solar-field', 'solar-rows', 'forest-aerial', 'forest-valley', 'mountains', 'cloud-sea', 'mountain-lake', 'coast', 'glacier', 'ice-lake', 'farm-aerial', 'wheat', 'road-mountains'].map(photo)
const BUSINESS = ['office-empty', 'office-loft', 'desk-top', 'desk-window', 'team-laptops', 'team-notes', 'finance-chart', 'city-night', 'containers', 'refinery', 'smokestack', 'clothing-store', 'clothing-rail', 'grocery'].map(photo)
const PHOTOS = interleave(NATURE, BUSINESS)
const DARK = ['dark-mountain-lake', 'dark-wind-sunset', 'dark-forest-valley', 'dark-mountains', 'dark-coast', 'dark-ice-lake', 'cloud-sea', 'city-night'].map(photo)
const PEOPLE = ['woman-1', 'man-4', 'woman-3', 'man-2', 'woman-2', 'man-5', 'woman-4', 'man-3', 'man-1']
const AVATARS = PEOPLE.map((n) => `${P}p-${n}-sq.jpg`)
const PORTRAITS = PEOPLE.map((n) => `${P}p-${n}-tall.jpg`)
const BOARDS = ['dashboard', 'scopes', 'suppliers', 'report', 'assistant', 'plan', 'energy', 'footprint']
const AB_SQUARE = BOARDS.map((n) => ab(`sq-${n}`))
const AB_WIDE = BOARDS.map((n) => ab(`wide-${n}`))
const AB_VIDEO = ['dashboard', 'report', 'plan', 'energy', 'scopes'].map((n) => ab(`video-${n}`))
const AB_PO = ['dashboard', 'report', 'plan'].map((n) => ab(`po-${n}`))
const MIXED = interleave(PHOTOS, AB_WIDE)

export const pools = { NATURE, BUSINESS, PHOTOS, DARK, AVATARS, PORTRAITS, AB_SQUARE, AB_WIDE, AB_VIDEO, AB_PO, MIXED }

function interleave(a, b) {
  const out = []
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (i < a.length) out.push(a[i])
    if (i < b.length) out.push(b[i])
  }
  return out
}

// ---- exact slots -------------------------------------------------------------------------
const INDUSTRY = {
  apparel: ['clothing-store', 'clothing-rail'],
  'consumer-goods': ['containers', 'grocery'],
  'food-beverage': ['wheat', 'farm-aerial'],
  'professional-services': ['team-laptops', 'desk-window'],
  retail: ['grocery', 'clothing-store'],
  technology: ['office-loft', 'desk-top'],
}

export const exact = {
  'product.energy.chart': ab('energy-chart'),
  'lp.hero.screen': ab('wide-dashboard'),
  'post.figure.chart': ab('wide-plan'),
  'post.figure.wide': photo('wind-offshore'),
  'hero.form.banner': ab('wide-assistant'),
  'tool.calendar.banner': ab('wide-report'),
  'hero.form.bg': photo('dark-mountains'),
  'company.change.hero': photo('dark-mountain-lake'),
  'company.climateLeads.hero': photo('forest-valley'),
  'company.careers.hero': photo('office-loft'),
  'company.careers.photo': photo('team-laptops'),
  'report.soc.hero': photo('ice-lake'),
  'report.soc.cover': ab('wide-report'),
  'customers.hero.video': photo('wind-offshore'),
  'cta.inline.filled': photo('solar-rows'),
  'compare.hero.gutter.l': photo('wind-field'),
  'compare.hero.gutter.r': photo('solar-field'),
  'podcast.cover': photo('cloud-sea'),
  // homepage (pre-registered; components hook these up via <Media slot="home.…">)
  'home.hero.product': `${P}home-hero-product-bare.jpg`, // pill-less; use home-hero-product.jpg for baked-in prompt pill
  'home.hero.testimonial': `${P}p-woman-1-tall.jpg`,
  'home.po.stage.0': photo('mountain-lake'),
  'home.po.stage.1': photo('wheat'),
  'home.po.stage.2': photo('forest-valley'),
  'home.po.screen.0': `${P}home-po-dashboard.jpg`,
  'home.po.screen.1': `${P}home-po-report.jpg`,
  'home.po.screen.2': `${P}home-po-plan.jpg`,
  'home.feature.0': `${P}home-feature-assistant.jpg`,
  'home.feature.1': `${P}home-feature-scopes.jpg`,
  'home.feature.2': `${P}home-feature-suppliers.jpg`,
  'home.feature.3': `${P}home-feature-report.jpg`,
  'home.feature.4': `${P}home-feature-plan.jpg`,
  'home.stats.diagram': `${P}home-stats-diagram.png`,
  'home.mission.photo': photo('wind-sunset'),
  'home.cards.0': photo('solar-field'),
  'home.cards.1': ab('guide-cover'),
  'home.cards.2': `${P}home-card-chat.jpg`,
  'home.agents.glow': `${P}home-agents-glow.jpg`,
  ...Object.fromEntries(Object.entries(INDUSTRY).map(([k, [a]]) => [`product.industry_${k}.Hero.0.0`, photo(a)])),
}

// ---- pattern rules (first match wins) ----------------------------------------------------
const rules = [
  // keep placeholders: logos, award badges, huge decorative illustrations
  [/\.logo$|^compare\.hero\.badge\.|^summit\.illustration$|^product\.largeBg\.illustration$/, null],
  // people
  [/avatar|headshot/, AVATARS],
  [/^company\.change\.person\.|^summit\.speaker\.|^product\.advisors\.|\.PersonnelSlider\./, PORTRAITS],
  // full-bleed backgrounds with white text on top
  [/stylizedQuote|\.QuoteBackground\.|\.InfoCards\.|quoteBg|infocards/, DARK],
  // product UI → original Northwind artboards
  [/\.ProductOverview\.|\.po\.\d+$/, AB_PO],
  [/\.HeroVideo\.|heroVideo|^report\.climateEconomy\.fig\./, AB_VIDEO],
  [/^product\.[^.]+\.Hero\.0\.0$|\.TextWithImage\.\d+\.0$|\.QuoteFeatures\.|^lp\.steps\.|\.twi\.\d+$/, AB_SQUARE],
  [/\.MicroFeatureCarousel\.|\.TextWithImageList\.|\.TextWithImageOrderedList\.|\.mfc\.|^tour\.[^.]+\.banner$/, AB_WIDE],
  [/\.ContentCards\.|\.ContentGrid\.|\.cards\.\d+$|\.cgrid\.\d+$/, MIXED],
  // per-slug feeds: industry pages get on-theme photos, everything else draws from the photo pool
  [/^product\.industry_([a-z-]+)\./, (m) => INDUSTRY[m[1]]?.map(photo) ?? PHOTOS],
  [/^post\..*product-?updates|^post\.[^.]*productupdates/, AB_WIDE],
  [/./, PHOTOS],
]

// FNV-1a; stable across builds so a slot always gets the same image.
function hash(str) {
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

// Sibling slots ending in an index (`foo.bar.0`, `foo.bar.1`, …) take consecutive pool entries
// so neighbours in one row never repeat; other ids pick by hash.
function pick(pool, slot) {
  const m = slot.match(/^(.*?)(\d+)$/)
  const i = m ? hash(m[1]) + Number(m[2]) : hash(slot)
  return pool[i % pool.length]
}

export function resolveMedia(slot) {
  if (!slot) return undefined
  if (slot in exact) return exact[slot]
  for (const [re, pool] of rules) {
    const m = slot.match(re)
    if (!m) continue
    if (pool === null) return undefined
    const list = typeof pool === 'function' ? pool(m) : pool
    return pick(list, slot)
  }
  return undefined
}

export default exact
