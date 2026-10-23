import { Faq as FaqPrimitive } from './primitives.jsx'

// §2.9 / §3.10 Faq accordion: shared primitive owned by the content agent. This block only passes content through.
export default function Faq(props) {
  return <FaqPrimitive {...props} />
}
