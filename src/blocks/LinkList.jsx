import { SmartLink } from './ui.jsx'

// §3.31 LinkList: centred caption + wrap-centred chips. MOTION: hover border #c0d0f0 / text cobalt .12s
export default function LinkList({ caption, links = [] }) {
  return (
    <section className="px-4 py-16 md:px-6">
      <div className="mx-auto flex max-w-[1152px] flex-col items-center gap-6 text-center">
        <p className="text-md font-medium leading-6 tracking-[-0.16px] text-ink-secondary">{caption}</p>
        <div className="flex flex-wrap justify-center gap-3">
          {links.map((l) => (
            <SmartLink key={l.label} to={l.to} className="flex h-10 items-center rounded-btn border border-line-light px-[14px] py-2 text-sm font-medium leading-[21px] text-ink hover:border-line hover:text-cobalt">
              {l.label}
            </SmartLink>
          ))}
        </div>
      </div>
    </section>
  )
}
