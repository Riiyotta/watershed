// Template → page component, owned by the content-pages builder
// (indexes, blog, customer stories, gated landings, events, legal, news, demo, tours, tool).
// Keys are template names from routes.json; a template missing here falls back to Pending.
// Each page receives { path, template } with `path` locale-free.
import CustomersIndex from '../templates/CustomersIndex.jsx'
import { BlogIndexPage, EventsIndexPage, GuidesIndexPage } from './content/FeedPages.jsx'
import { BlogPostPage, CustomerStoryPage } from './content/PostPages.jsx'
import { EventPage, GuidePage } from './content/GatedPages.jsx'
import LegalPage from './content/LegalPages.jsx'
import DemoPage, { ProductTourPage, ToolPage } from './content/DemoPages.jsx'

export default {
  'customers-index': CustomersIndex,
  'customer-story': CustomerStoryPage,
  'blog-index': BlogIndexPage,
  'guides-index': GuidesIndexPage,
  'events-index': EventsIndexPage,
  'blog-post': BlogPostPage,
  guide: GuidePage,
  event: EventPage,
  legal: LegalPage,
  demo: DemoPage,
  'product-tour': ProductTourPage,
  tool: ToolPage,
}
