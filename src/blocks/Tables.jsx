import { CheckIcon, CrossIcon } from './ui.jsx'

// §3.26 Tables (comparison). `iconColumns`: cell values true/false render check/cross icons.
// Rows: [label, ...cells]; a row { group: 'Name' } renders a group header. Wide tables scroll at 390.
export default function Tables({ title, desc, head = [], rows = [], legend, iconColumns = false }) {
  const cell = (v) => {
    if (iconColumns && typeof v === 'boolean') {
      return v ? <CheckIcon className="text-cobalt" /> : <CrossIcon className="text-ink-disabled" />
    }
    return v
  }
  let stripe = 0
  return (
    <section className="py-16">
      <div className="container-ws flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl font-normal leading-[30px] tracking-[-0.72px] text-headline md:text-5xl md:leading-[45px] md:tracking-[-1.08px]">{title}</h2>
          {desc && <p className="max-w-[524px] text-md leading-6 text-ink-secondary">{desc}</p>}
        </div>
        <div className="overflow-x-auto rounded-btn border border-b-0 border-line-light">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr>
                {head.map((h, i) => (
                  <th key={i} className="border-b border-r border-line-light p-3 text-sm font-semibold leading-[21px] text-ink last:border-r-0">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                if (r.group) {
                  return (
                    <tr key={i}>
                      <th colSpan={head.length} className="border-b border-line-light p-3 text-lg font-semibold leading-[22.5px] text-ink">
                        {r.group}
                      </th>
                    </tr>
                  )
                }
                stripe += 1
                return (
                  <tr key={i} className={stripe % 2 === 0 ? 'bg-gray-10' : 'bg-white'}>
                    {r.map((c, j) => (
                      <td key={j} className={`border-b border-r border-line-light p-3 align-top text-sm leading-[21px] last:border-r-0 ${j === 0 ? 'font-medium text-ink' : 'text-ink-secondary'}`}>
                        {cell(c)}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {legend && (
          <div className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm leading-5 text-ink-secondary sm:grid-cols-3">
            {legend.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
