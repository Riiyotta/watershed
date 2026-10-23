import Awards from '../components/Awards.jsx'

// §0 TextWithAwards = homepage §2.4 Awards with the cta-link-mono CTA instead of the two buttons (props mapping only).
export default function TextWithAwards({ eyebrow, title, paragraph, link }) {
  return <Awards eyebrow={eyebrow} title={title} paragraph={paragraph} cta="mono-link" link={link} />
}
