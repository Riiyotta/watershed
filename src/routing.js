import routes from './routes.json'

export const LOCALE = routes.locale_prefix // '/en-GB'

// path (without locale) → template name, built once from ROUTES.json
const byPath = new Map()
for (const [template, paths] of Object.entries(routes.templates)) {
  for (const p of paths) byPath.set(p, template)
}

export function stripLocale(pathname) {
  const rest = pathname.startsWith(LOCALE) ? pathname.slice(LOCALE.length) : pathname
  const clean = rest.replace(/\/+$/, '')
  return clean === '' ? '/' : clean
}

export function templateFor(pathname) {
  return byPath.get(stripLocale(pathname)) ?? null
}

export function pathsFor(template) {
  return routes.templates[template] ?? []
}

export const isExternal = (path) => /^https?:\/\//.test(path)

// Prefix an internal path with the locale. External URLs aren't linked anywhere in the clone;
// if one slips through, it resolves to the home page rather than leaving the site.
export function href(path) {
  if (isExternal(path)) return `${LOCALE}/`
  return path === '/' ? `${LOCALE}/` : `${LOCALE}${path}`
}
