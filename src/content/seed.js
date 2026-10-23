// Deterministic helpers for generated placeholder content (seeded by slug).

export function hash(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// xorshift32 seeded by a string
export function rng(seed) {
  let s = hash(String(seed)) || 1
  return () => {
    s ^= s << 13
    s ^= s >>> 17
    s ^= s << 5
    return (s >>> 0) / 4294967296
  }
}

export const pick = (r, arr) => arr[Math.floor(r() * arr.length)]

export const lastSegment = (path) => path.split('/').filter(Boolean).pop()

const UPPER = new Set([
  'ai', 'esg', 'csrd', 'cdp', 'issb', 'sb', 'uk', 'us', 'eu', 'esrs', 'sec', 'tcfd', 'gcp', 'anz', 'lsrs', 'obbb', 'roi', 'nyc',
  'uae', 'dma', 'carb', 'srs', 'llm', 'aasb', 'osfi', 'asic', 'pcf', 'pcfs', 'ghg', 'sbti', 'secr', 'eac', 'eacs', 'ccdaa', 'vppa',
  'rfp', 'faq', 'api', 'sfdr', 'iso', 'lca', 'cbam', 'gri', 'tnfd', 'ira', 'ppa', 'mdx', 'apac', 'emea', 'namer', 'cips', 'pei',
])

// "carbon-removal-for-businesses" -> "Carbon removal for businesses"
export function humanize(slug) {
  const words = slug.replace(/[-_]+/g, ' ').trim().split(/\s+/)
  return words
    .map((w, i) => {
      const lw = w.toLowerCase()
      if (lw === 'watershed' || lw === 'watershedcom') return 'Northwind' // never surface the source brand
      if (UPPER.has(lw)) return lw.toUpperCase()
      if (/^s\d+$/.test(lw)) return lw.toUpperCase() // s2
      return i === 0 ? lw.charAt(0).toUpperCase() + lw.slice(1) : lw
    })
    .join(' ')
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Seeded date between two years (inclusive), returned as a Date at UTC noon.
export function seededDate(seed, fromYear = 2021, toYear = 2026) {
  const r = rng(`date:${seed}`)
  const start = Date.UTC(fromYear, 0, 1)
  const end = Date.UTC(toYear, 9, 20)
  return new Date(start + Math.floor(r() * (end - start) / 86400000) * 86400000 + 43200000)
}

export const fmtLong = (d) => `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`
export const fmtShort = (d) => `${MON[d.getUTCMonth()]} ${String(d.getUTCDate()).padStart(2, '0')}, ${d.getUTCFullYear()}`
export const fmtDayMon = (d) => `${String(d.getUTCDate()).padStart(2, '0')} ${MON[d.getUTCMonth()]}`
export const fmtNumeric = (d) =>
  `${String(d.getUTCMonth() + 1).padStart(2, '0')}/${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCFullYear()).slice(2)}`
export const fmtEventDay = (d) =>
  `${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getUTCDay()]}, ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`

// Media tones available in <Media>
export const TONES = ['neutral', 'cool', 'warm', 'dark']
