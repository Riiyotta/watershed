// §3.14 HorizontalRule: .medium = padding 24 + 1px #e3ebff rule; .none = 0-height spacer.
export default function HorizontalRule({ size = 'medium' }) {
  if (size === 'none') return <hr className="m-0 h-0 border-0" />
  return (
    // measured: section padding 24 0 (bg #fff) around a 1200 container with padding 24 → 97 tall at 1440
    <div className="bg-white py-6">
      <div className="mx-auto max-w-[1200px] p-4 md:p-6">
        <hr className="border-0 border-t border-cobalt-10" />
      </div>
    </div>
  )
}
