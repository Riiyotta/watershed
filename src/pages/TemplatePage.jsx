import { useLocation } from 'react-router-dom'
import { stripLocale, templateFor } from '../routing.js'
import blockPages from './registry.blocks.js'
import contentPages from './registry.content.js'
import Pending from './Pending.jsx'

const registry = { ...blockPages, ...contentPages }

// Resolves the current URL to its template and renders it with the locale-free path.
export default function TemplatePage() {
  const { pathname } = useLocation()
  const template = templateFor(pathname)
  const Page = registry[template]
  if (!Page) return <Pending />
  const path = stripLocale(pathname)
  return <Page key={path} path={path} template={template} />
}
