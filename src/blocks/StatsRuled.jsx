// §3.31 Stats.ruledRoot: 4 ruled cells, value 72/72 300 cobalt. 390: 2 columns, value scaled with the hero ratio.
export default function StatsRuled({ stats = [] }) {
  return (
    <section className="py-16 md:py-section">
      <div className="container-ws">
        <div className="grid grid-cols-2 border-l border-t border-line wide:grid-cols-4">
          {stats.map((s) => (
            <div key={s.value} className="flex flex-col gap-4 border-b border-r border-line p-5 lg:min-h-[208px]">
              <p className="text-[44px] font-light leading-[44px] tracking-[-1.32px] text-cobalt md:text-9xl md:leading-[72px] md:tracking-[-2.16px]">{s.value}</p>
              <p className="text-md font-medium leading-[19.2px] text-ink-secondary">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
