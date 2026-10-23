import { Cta } from './ui.jsx'

// SectionHeader used by compare blocks (§3.31): H2 36/45 + body 18/27 (752) with an optional withArrow button right.
export default function SectionHeader({ title, body, button, centered = false }) {
  if (centered) {
    return (
      <div className="mx-auto flex max-w-[752px] flex-col items-center gap-4 text-center">
        <h2 className="b-h36">{title}</h2>
        {body && <p className="t-body-lg">{body}</p>}
      </div>
    )
  }
  return (
    <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between md:gap-8">
      <div className="flex max-w-[752px] flex-col gap-4">
        <h2 className="b-h36">{title}</h2>
        {body && <p className="t-body-lg">{body}</p>}
      </div>
      {button && <Cta {...button} arrow className="shrink-0" />}
    </div>
  )
}
