import ContentCards from '../components/ContentCards.jsx'

// §3.9 ContentCards = homepage §2.10 grid (props mapping only). No cards -> the homepage section unchanged.
// Card images use the `${slotPrefix}.${i}` Media slots; title/sub are only what the page passes (no homepage copy).
export default function ContentCardsBlock({ title = '', sub = '', button, cards, slotPrefix = 'product.cards' }) {
  if (!cards) return <ContentCards />
  return <ContentCards fluidHeader title={title} sub={sub} button={button} cards={cards.map((c, i) => ({ slot: `${slotPrefix}.${i}`, ...c }))} />
}
