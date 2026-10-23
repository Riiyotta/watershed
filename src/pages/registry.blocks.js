// Template → page component, owned by the block-pages builder
// (product, compare, company, report-landing block pages).
// Keys are template names from routes.json; a template missing here falls back to Pending.
import { CompanyPage, ComparePage, ProductPage, ReportLandingPage } from '../blocks/pages.jsx'

export default {
  product: ProductPage,
  compare: ComparePage,
  company: CompanyPage,
  'report-landing': ReportLandingPage,
}
