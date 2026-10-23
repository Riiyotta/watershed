import { useLocation } from 'react-router-dom'
import { templateFor } from '../routing.js'

// Temporary stand-in for routes whose template isn't built yet.
export default function Pending() {
  const { pathname } = useLocation()
  const template = templateFor(pathname)

  return (
    <section className="mx-auto grid min-h-[60vh] max-w-[1200px] place-items-center px-6 py-24 text-center">
      <div>
        <p className="font-mono text-sm uppercase tracking-wide text-neutral-500">{template ?? 'Unknown route'}</p>
        <h1 className="mt-4 text-4xl font-medium tracking-tight">This page is being built</h1>
        <p className="mt-3 text-neutral-500">{pathname}</p>
      </div>
    </section>
  )
}
