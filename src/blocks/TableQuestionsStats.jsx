import { Cta } from './ui.jsx'

// §3.31 TableQuestionsStats: question/answer rows + 4 inset-shadow number tiles (last is a CTA).
const TILE = {
  background: 'linear-gradient(transparent, rgba(245,248,255,.5)), rgba(147,174,255,.08)',
  boxShadow: '0 0 0 1px rgba(255,255,255,.64) inset, 2px 2px 4px rgba(4,19,48,.08) inset, -3px -3px 8px rgba(255,255,255,.32) inset',
}

// 390 (measured /compare/workiva): container gap 32; eyebrow Mono 10/12 → H2 16; body 14/21; the header row stays
// visible (th Mono 10/12); each row stacks: question 18/22.5 -0.54, answer 13/19.5 (padding-bottom 16).
export default function TableQuestionsStats({ eyebrow, title, body, colA = 'What changes', colB = 'How it works', rows = [], numbersLabel = 'Behind the answers', numbers = [], cta }) {
  return (
    <section className="bg-gray-10 px-4 py-16 md:px-6 md:py-section">
      <div className="mx-auto flex max-w-[1152px] flex-col gap-8 md:gap-12">
        <div className="grid grid-cols-1 items-end gap-x-12 gap-y-4 lg:grid-cols-2 lg:gap-y-6">
          <div className="flex flex-col gap-4 md:gap-6">
            <p className="font-mono text-[10px] leading-3 tracking-[normal] text-ink md:text-xs md:leading-[14.4px]">{eyebrow}</p>
            <h2 className="b-h36">{title}</h2>
          </div>
          {/* measured: the body column is 352 wide at x 744 (L6) */}
          <p className="text-sm font-normal leading-[21px] tracking-[-0.14px] text-ink-secondary md:text-lg md:leading-[27px] md:tracking-[-0.18px] lg:max-w-[352px]">{body}</p>
        </div>
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              <th className="py-[11px] font-mono text-[10px] font-normal leading-3 tracking-[normal] text-cobalt md:py-4 md:text-xs md:leading-[14.4px]">{colA}</th>
              <th className="py-[11px] font-mono text-[10px] font-normal leading-3 tracking-[normal] text-cobalt md:py-4 md:pl-6 md:text-xs md:leading-[14.4px]">{colB}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.q} className="flex flex-col border-t border-line-light md:table-row">
                <td className="pb-1 pt-[1px] text-lg font-medium leading-[22.5px] tracking-[-0.54px] text-ink md:w-1/2 md:py-6 md:text-2xl md:leading-[30px] md:tracking-[-0.72px]">{r.q}</td>
                <td className="pb-4 text-[13px] font-normal leading-[19.5px] tracking-[-0.13px] text-ink-secondary md:py-6 md:pl-6 md:pr-px md:text-md md:leading-6 md:tracking-[-0.16px]">{r.a}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex flex-col gap-4">
          <p className="font-mono text-xs leading-[14.4px] tracking-[normal] text-cobalt">{numbersLabel}</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {numbers.map((n) => (
              <div key={n.value} className="flex min-h-[160px] flex-col gap-3 rounded-md p-6" style={TILE}>
                <p className="text-[48px] font-light leading-[52.8px] text-ink">{n.value}</p>
                <p className="text-sm font-normal leading-[21px] text-[rgba(4,19,48,.8)]">{n.desc}</p>
              </div>
            ))}
            {cta && (
              <div className="flex min-h-[160px] flex-col justify-between gap-3 rounded-md p-6" style={TILE}>
                <p className="text-xl font-medium leading-[26.25px] text-ink">{cta.title}</p>
                <div>
                  <Cta label={cta.label} to={cta.to} arrow />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
