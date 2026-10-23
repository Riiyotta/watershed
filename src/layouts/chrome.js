import { storyVariant } from '../content/customers.js'

// Per-route chrome (PAGES_SPEC §1.1, §1.2, §4.9, §4.10, §4.12). `path` is locale-free.
//   nav:    'opaque' (homepage default) | 'translucent' (transparent at scrollY 0, opaque after) |
//           'inverted' (translucent with white links/logo, §1.1 isInvertedDesktop) | null (no nav)
//   demo:   show the "Book a demo" nav button
//   promo:  show the promo bar
//   footer: 'default' | 'short' (349 CTA strip, /climate-economy) | null (no footer)
const DEFAULT = { nav: 'opaque', demo: true, promo: true, footer: 'default' }

const under = (path, base) => path === base || path.startsWith(`${base}/`)

export function chromeFor(path) {
  // /demo, /demo/*: inverted translucent nav, no "Book a demo", no promo bar, no footer (§1.1, §1.2, §4.9)
  if (under(path, '/demo')) return { nav: 'inverted', demo: false, promo: false, footer: null }
  // /lp/*: no nav, no footer; the promo bar remains (§1.1 "Only the promo bar remains", §1.2, §4.9)
  if (path.startsWith('/lp/')) return { ...DEFAULT, nav: null, footer: null }
  // /product-tours and /product-tours/*: translucent nav, no promo bar (§1.2, §4.10)
  if (under(path, '/product-tours')) return { ...DEFAULT, nav: 'translucent', promo: false }
  // /climate-economy: shorter footer CTA strip (§1.2)
  if (path === '/climate-economy') return { ...DEFAULT, footer: 'short' }
  if (isTranslucent(path)) return { ...DEFAULT, nav: 'translucent' }
  return DEFAULT
}

// §1.1 isTranslucent: /blog, /events, /guides (ContentHero), every blog post (incl. /inside/*),
// customer posts on the BlogPostTemplate (variant B, sentence-style slugs), /tools/*.
function isTranslucent(path) {
  if (path === '/blog' || path === '/events' || path === '/guides') return true
  if (path.startsWith('/blog/') || path.startsWith('/inside/')) return true
  if (path.startsWith('/tools/')) return true
  if (path.startsWith('/customers/')) return storyVariant(path.slice('/customers/'.length)) === 'B'
  return false
}
