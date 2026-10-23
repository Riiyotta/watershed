import blocks from './index.js'

// §4.1 Generic renderer: an ordered list of { type, props }. Each block gets a stable slot prefix
// (`<template>.<path>.<type>.<n>`) for Media unless the page sets one.
export default function BlockPage({ blocks: list = [], template = 'product', path = '' }) {
  const key = path.replace(/^\//, '').replace(/\//g, '_') || 'root'
  return list.map((b, i) => {
    const Block = blocks[b.type]
    if (!Block) {
      if (import.meta.env.DEV) console.warn(`BlockPage: unknown block type "${b.type}"`)
      return null
    }
    const prefix = `${template}.${key}.${b.type}.${i}`
    return <Block key={i} slotPrefix={prefix} slot={`${prefix}.0`} {...b.props} />
  })
}
