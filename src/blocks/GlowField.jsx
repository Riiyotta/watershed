// CSS substitute for the Unicorn Studio WebGL field (CLONE_SPEC §2.7 / PAGES_SPEC §8), same recipe as the homepage
// agents section. Used by CenteredAgent and EnergyForecast.
export default function GlowField({ warm = false }) {
  const bg = warm
    ? 'radial-gradient(55% 45% at 25% 75%, rgba(255,153,102,.75) 0%, transparent 70%), radial-gradient(60% 55% at 72% 80%, rgba(101,141,253,.9) 0%, transparent 70%), radial-gradient(80% 50% at 50% 100%, #265cff 0%, transparent 75%)'
    : 'radial-gradient(55% 45% at 25% 75%, rgba(167,139,250,.85) 0%, transparent 70%), radial-gradient(60% 55% at 72% 80%, rgba(101,141,253,.95) 0%, transparent 70%), radial-gradient(80% 50% at 50% 100%, #265cff 0%, transparent 75%), radial-gradient(40% 25% at 18% 55%, rgba(255,175,210,.6) 0%, transparent 70%)'
  return (
    // MOTION: optional slow drift of the blobs (WebGL stand-in)
    <div aria-hidden="true" className="agents-glow pointer-events-none absolute inset-x-0 top-0 h-[900px] overflow-hidden">
      <div className="absolute inset-0" style={{ background: bg, filter: 'blur(40px)' }} />
      <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ backgroundImage: 'var(--tex-noise)', backgroundSize: '160px' }} />
    </div>
  )
}
