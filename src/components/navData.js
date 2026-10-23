// Placeholder navigation content (original copy). Product panel structure per §3.9; Resources/Company reuse the shell.
// `to` = locale-free internal route (same destinations the footer uses for the equivalent items).
import { IconSquares, IconBars, IconDoc, IconTarget } from './Icons.jsx'

export const MENUS = {
  Product: {
    header: [
      { title: 'Platform tour', desc: 'See how every part of Northwind fits together', to: '/platform' },
      { title: 'Why Northwind', desc: 'How we compare with other climate tools', to: '/compare' },
    ],
    groups: [
      {
        title: 'Platform',
        links: [
          { label: 'Data assistant', icon: IconSquares, to: '/platform/sustainability-ai' },
          { label: 'Inventory', icon: IconBars, to: '/platform/measure' },
          { label: 'Disclosures', icon: IconDoc, to: '/platform/disclosures' },
          { label: 'Reduction', icon: IconTarget, to: '/platform/act' },
        ],
      },
      { title: 'Solutions', links: [{ label: 'Finance teams', to: '/solutions/finance' }, { label: 'Procurement', to: '/solutions/supply-chain' }, { label: 'Product impact', to: '/solutions/product-footprints' }, { label: 'Energy use', tag: 'New', to: '/solutions/energy-management' }, { label: 'Emission factors', to: '/solutions/ceda' }] },
      { title: 'Frameworks', links: [{ label: 'EU rules', to: '/solutions/csrd' }, { label: 'State rules', to: '/solutions/california' }, { label: 'Global standards', to: '/platform/disclosures/issb' }, { label: 'Questionnaires', to: '/platform/disclosures/cdp' }] },
    ],
    footer: { tag: 'Explore', text: 'Try a guided sandbox of the Northwind platform', cta: 'Start the tour', to: '/product-tours' },
  },
  Resources: {
    header: [
      { title: 'Resource library', desc: 'Guides, reports and templates in one place', to: '/guides' },
      { title: 'Research', desc: 'Methods and findings from our science team', to: '/state-of-corporate-sustainability-ai-2026' },
    ],
    groups: [
      { title: 'Learn', links: [{ label: 'Blog', to: '/blog' }, { label: 'Guides', to: '/guides' }, { label: 'Webinars', to: '/events' }, { label: 'Glossary', to: '/reading-list' }] },
      { title: 'Tools', links: [{ label: 'Benchmark explorer', to: '/assessments/climate-disclosure' }, { label: 'Rule checker', tag: 'New', to: '/tools/climate-policy-calendar' }, { label: 'Factor search', to: '/solutions/ceda' }] },
      { title: 'Events', links: [{ label: 'Upcoming', to: '/events' }, { label: 'On demand', to: '/events?filter=on-demand' }] },
    ],
    footer: { tag: 'Explore', text: 'Browse the full Northwind resource library', cta: 'View all', to: '/guides' },
  },
  Company: {
    header: [
      { title: 'About Northwind', desc: 'Our team, our story and what we value', to: '/about-us' },
      { title: 'Careers', desc: 'Open roles across every department', to: '/careers' },
    ],
    groups: [
      { title: 'Company', links: [{ label: 'About', to: '/about-us' }, { label: 'Newsroom', to: '/news' }, { label: 'Partners', to: '/partners' }] },
      { title: 'Trust', links: [{ label: 'Security', to: '/legal/security' }, { label: 'Privacy', to: '/legal/privacy' }, { label: 'Status', to: '/legal' }] },
      { title: 'Contact', links: [{ label: 'Sales', to: '/demo' }, { label: 'Support', to: '/demo' }] },
    ],
    footer: { tag: 'New', text: 'Read our latest annual impact report', cta: 'Read now', to: '/state-of-corporate-sustainability-ai-2026' },
  },
}
export const NAV_ITEMS = ['Product', 'Resources', 'Company', 'Customers']
// Top-level items without a dropdown
export const NAV_LINKS = { Customers: '/customers' }
