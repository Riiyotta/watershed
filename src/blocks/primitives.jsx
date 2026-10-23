// Thin adapters from block-content props onto the shared primitives owned by the content-pages agent
// (src/primitives/*). No primitive is re-implemented here.
import {
  EmailCatcher as EmailCatcherP,
  Faq as FaqP,
  FIELDSETS,
  HubspotForm as HubspotFormP,
  NewsletterBand,
  Prose,
  Toc,
} from '../primitives/index.js'
import { href } from '../routing.js'

export { Prose, Toc }

// cta: { title, body, label, to } → primitive's { strong, text, label, href }
export function Faq({ cta, ...rest }) {
  const mapped = cta ? { strong: cta.title, text: cta.body, label: cta.label, href: /^https?:/.test(cta.to) ? cta.to : href(cta.to ?? '/demo') } : undefined
  return <FaqP cta={mapped} {...rest} />
}

// fields: FIELDSETS key or array (default 'demo')
export function HubspotForm({ fields = 'demo', submitLabel, ...rest }) {
  return <HubspotFormP fields={Array.isArray(fields) ? fields : FIELDSETS[fields] ?? FIELDSETS.demo} submitLabel={submitLabel} {...rest} />
}

export function EmailCatcher({ submitLabel, label = 'Work email', ...rest }) {
  return <EmailCatcherP buttonLabel={submitLabel} label={label} {...rest} />
}

// §2.8 InlineCtaForm (filled on compare / energy-management)
export function InlineCtaForm({ submitLabel, variant = 'filled', title, description }) {
  return <NewsletterBand title={title} description={description} buttonLabel={submitLabel} variant={variant} />
}

// Convert block-content rich-text nodes to Prose block shapes (primitives/Prose.jsx).
export function toProseBlocks(nodes = [], slotPrefix = 'prose') {
  return nodes
    .map((n, i) => {
      if (n.h2) return { t: 'h2', text: n.h2 }
      if (n.h3) return { t: 'h3', text: n.h3 }
      if (n.h4) return { t: 'h4', text: n.h4 }
      if (n.p) return { t: 'p', text: n.p }
      if (n.ul) return { t: 'ul', items: n.ul }
      if (n.ol) return { t: 'ol', items: n.ol }
      if (n.quote) return { t: 'quote', paras: [n.quote] }
      if (n.aside) return { t: 'aside', paras: [n.aside] }
      if (n.img) return { t: 'figure', slot: `${slotPrefix}.${i}`, caption: n.caption, size: n.size, aspect: n.ratio?.replace(/\s/g, ''), tone: n.tone }
      if (n.table) return { t: 'table', head: n.table.head, rows: n.table.rows }
      return null
    })
    .filter(Boolean)
}
