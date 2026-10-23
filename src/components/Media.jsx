import { resolveMedia } from '../content/media.js'

const TONES = {
  neutral: 'linear-gradient(135deg, #e7ebf3 0%, #d3dae8 100%)',
  cool: 'linear-gradient(135deg, #c9d8ff 0%, #8fb0f5 55%, #4d74e0 100%)',
  warm: 'linear-gradient(135deg, #ffe3cf 0%, #f7b99a 55%, #e8846b 100%)',
  dark: 'linear-gradient(135deg, #0b2150 0%, #041330 100%)',
}

// One swappable image slot. Renders the mapped file from content/media.js when present,
// otherwise a same-size gradient placeholder (exact id first, then pattern pools; see media.js). `slot` is a stable id like 'blog.post.hero'.
export default function Media({ slot, alt = '', tone = 'neutral', className = '', fit = 'cover', style, loading = 'lazy' }) {
  const src = resolveMedia(slot)
  if (src) {
    return <img src={src} alt={alt} loading={loading} decoding={loading === 'eager' ? undefined : 'async'} data-slot={slot} className={className} style={{ objectFit: fit, ...style }} />
  }
  return (
    <div
      role={alt ? 'img' : undefined}
      aria-label={alt || undefined}
      data-slot={slot}
      className={className}
      style={{ background: TONES[tone] ?? TONES.neutral, ...style }}
    />
  )
}
