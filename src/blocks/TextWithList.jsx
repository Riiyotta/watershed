// §3.25 TextWithList (/platform/disclosures/csrd). Column placement on the 12-col grid was not measured:
// intro (icon + 60/66 title, 664 wide) spans the top; description left, subtitle + list right.
export default function TextWithList({ title, body, subtitle, items = [] }) {
  return (
    <section className="py-16">
      <div className="container-ws grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-x-5">
        <div className="flex flex-col gap-6 lg:col-span-12">
          <div aria-hidden="true" className="h-20 w-20 rounded-btn bg-gradient-to-br from-cobalt-10 to-cobalt-30" />
          <h2 className="max-w-[664px] text-[36px] font-normal leading-[40px] tracking-[-1.08px] text-midnight md:text-[60px] md:leading-[66px] md:tracking-[-1.8px]">{title}</h2>
        </div>
        <p className="t-lead lg:col-span-6">{body}</p>
        <div className="flex flex-col gap-4 lg:col-span-5 lg:col-start-8">
          <h3 className="text-[20px] font-semibold leading-[22px] text-midnight">{subtitle}</h3>
          <ul className="list-disc pl-[22px] marker:text-midnight">
            {items.map((it) => (
              <li key={it} className="t-lead my-2">
                {it}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
