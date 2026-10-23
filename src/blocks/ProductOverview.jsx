import ProductOverview from '../components/ProductOverview.jsx'

// §0 ProductOverview (props mapping only): dark = homepage §2.5 unchanged (/platform/act);
// `light` = mode 'light' (.modeLight). Step images use the `${slotPrefix}.${i}` Media slots.
export default function ProductOverviewBlock({ light = false, title, body, button, steps = [], slotPrefix = 'product.po' }) {
  if (!light) return <ProductOverview />
  return <ProductOverview mode="light" title={title} body={body} button={button} steps={steps.map((s, i) => ({ slot: `${slotPrefix}.${i}`, ...s }))} />
}
