import { InlineCtaForm as Band } from './primitives.jsx'

// §2.8 InlineCtaForm (filled variant on compare / energy-management): shared primitive (NewsletterBand) owned by the content agent.
export default function InlineCtaForm(props) {
  return <Band variant="filled" {...props} />
}
