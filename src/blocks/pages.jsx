import { Navigate } from 'react-router-dom'
import Pending from '../pages/Pending.jsx'
import { href } from '../routing.js'
import companyPages from '../content/pages/company.js'
import comparePages from '../content/pages/compare.js'
import productPages from '../content/pages/product.js'
import BlockPage from './BlockPage.jsx'
import GatedLanding from '../templates/GatedLanding.jsx'
import { PodcastPage, relatedResources } from '../pages/content/GatedPages.jsx'
import { GATED_REPORT } from '../content/bodies.js'
import { faqItems } from '../content/pages/kit.js'
import Brand from './templates/Brand.jsx'
import Careers from './templates/Careers.jsx'
import Change from './templates/Change.jsx'
import ClimateLeads from './templates/ClimateLeads.jsx'
import Manifesto from './templates/Manifesto.jsx'
import Quiz from './templates/Quiz.jsx'
import SOC2025Theme from './templates/SOC2025Theme.jsx'

// Page components registered in src/pages/registry.blocks.js. Each receives { path, template }.

function renderDefs(defs, path, template) {
  const list = defs[path]
  if (!list) return <Pending />
  // §6 redirects (original goes to the non-locale URL; here we stay inside the locale)
  if (list[0]?.redirect) return <Navigate to={href(list[0].redirect)} replace />
  return <BlockPage blocks={list} path={path} template={template} />
}

export function ProductPage({ path, template }) {
  return renderDefs(productPages, path, template)
}

export function ComparePage({ path, template }) {
  return renderDefs(comparePages, path, template)
}

const COMPANY_BESPOKE = { '/careers': Careers, '/brand': Brand, '/change': Change, '/climate-leads': ClimateLeads }

export function CompanyPage({ path, template }) {
  const Bespoke = COMPANY_BESPOKE[path]
  if (Bespoke) return <Bespoke path={path} />
  if (path === '/podcast') return <PodcastPage />
  return renderDefs(companyPages, path, template)
}

const REPORT_BESPOKE = {
  '/state-of-corporate-sustainability-ai-2026': SOC2025Theme,
  '/verdantix-2026': SOC2025Theme,
  '/climate-economy': Manifesto,
  '/assessments/climate-disclosure': Quiz,
}

const REPORT_GATED = {
  '/forrester-wave-2026': { title: 'Independent analyst evaluation: climate management software, 2026' },
  '/verdantix-2025': { title: 'Market study: ESG and climate reporting software, 2025' },
  '/verdantix-smart-innovators-2026': { title: 'Innovation review: supply chain and product footprint software' },
  '/sustainability-policy-newsletter': {
    eyebrow: 'Northwind newsletter',
    title: 'The monthly climate policy briefing',
    formTitle: 'Subscribe to the briefing',
    submit: 'Subscribe',
    body: [
      { t: 'p', text: 'A short monthly note from our policy team on the rules, guidance and deadlines that matter for climate teams.' },
      { t: 'p', text: 'Each issue covers:' },
      { t: 'ul', className: 'checklist', items: ['New and changing disclosure rules by region', 'Key dates for the months ahead', 'What the changes mean in practice'] },
    ],
  },
  '/the-healthcare-product-carbon-footprint-playbook': {
    eyebrow: 'Northwind playbook',
    title: 'A product footprint playbook for healthcare companies',
    formTitle: 'Download the playbook',
    submit: 'Get the playbook',
    body: [
      { t: 'p', text: 'Healthcare buyers increasingly ask for product-level emissions data. This playbook sets out a practical path from first estimates to supplier-specific footprints.' },
      { t: 'p', text: 'Inside the playbook:' },
      { t: 'ul', className: 'checklist', items: ['How to scope a product footprint programme', 'Choosing methods for complex devices and consumables', 'Sharing results with buyers and procurement teams'] },
    ],
  },
  '/ai-emissions-sustainability': {
    eyebrow: 'Northwind research',
    title: 'Measuring the emissions of AI: a framework for companies',
    formTitle: 'Download the framework',
    submit: 'Get the framework',
    body: [
      { t: 'p', text: 'AI use is growing quickly inside every business, and so are questions about its footprint. This framework explains how to estimate the emissions of the AI services you use and build.' },
      { t: 'ul', className: 'checklist', items: ['Where AI emissions show up in your inventory', 'Methods for training and inference estimates', 'Questions to ask your providers'] },
    ],
    faq: faqItems(4, 1),
  },
}

export function ReportLandingPage({ path, template }) {
  if (path === '/spark-matrix-2023') return <Navigate to={href('/guides')} replace />
  const Bespoke = REPORT_BESPOKE[path]
  if (Bespoke) return <Bespoke path={path} />
  const g = REPORT_GATED[path]
  if (!g) return <Pending />
  // §4.6: these report routes use the shared GatedLanding template (owned by the content agent); copy is ours.
  return (
    <GatedLanding
      kind="report"
      eyebrow={g.eyebrow ?? 'Northwind report'}
      title={g.title}
      body={g.body ?? GATED_REPORT}
      faq={g.faq}
      form={{ title: g.formTitle ?? 'Download the report', fields: 'guide', submitLabel: g.submit ?? 'Get the report', imageSlot: `report.${path.slice(1)}.cover` }}
      related={relatedResources(path)}
    />
  )
}
