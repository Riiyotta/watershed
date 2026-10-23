import FeatureCarousel from '../components/FeatureCarousel.jsx'

// §3.8 MicroFeatureCarousel = homepage §2.6 FeatureCarousel (props mapping only; motion, drag and arrows come from it).
// No slides -> the homepage carousel unchanged (/demo/csrd). Card images use the `${slotPrefix}.${i}` Media slots.
export default function MicroFeatureCarousel({ title, sub, slides, slotPrefix = 'product.mfc' }) {
  if (!slides) return <FeatureCarousel />
  return <FeatureCarousel fluidHeader autoHeight title={title} subhead={sub} slides={slides.map((s, i) => ({ slot: `${slotPrefix}.${i}`, ...s }))} />
}
