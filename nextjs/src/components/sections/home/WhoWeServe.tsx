import { SectionHeader } from '@/components/ui/SectionHeader'

const CREATOR_TYPES = [
  { icon: 'ti-device-gamepad-2', title: 'Gaming Creators', desc: 'Roblox, Minecraft, PUBG, Free Fire, Fortnite. Niche-matched editors who understand the culture and pacing of gaming content.', color: '#c9a84c' },
  { icon: 'ti-eye-off', title: 'Faceless Channels', desc: 'Complete done-for-you production. Script, voiceover, edit, thumbnail, and upload. Just review and approve.', color: '#c47a55' },
  { icon: 'ti-device-mobile-vibration', title: 'Short-Form Creators', desc: 'TikTok, YouTube Shorts, Instagram Reels. Specialists who understand hook timing and the scroll-stop science.', color: '#a07c5a' },
  { icon: 'ti-trending-up', title: 'Growth-Stage YouTubers', desc: '10K-500K creators who want professional quality without agency pricing. Flat 10% fee. No lock-in.', color: '#c9a84c' },
  { icon: 'ti-building', title: 'Content Businesses', desc: 'Brands, agencies, and media companies needing reliable, scalable video editing at a predictable cost.', color: '#c47a55' },
  { icon: 'ti-briefcase', title: 'First-Time Creators', desc: 'Just starting out and want professional editing from day one. We provide full creative direction alongside editing.', color: '#a07c5a' },
]

export function WhoWeServe() {
  return (
    <section
      id="who-we-serve"
      aria-labelledby="who-heading"
      style={{
        padding: 'min(80px,7vw) min(20px,5%)',
        maxWidth: 1200,
        margin: '0 auto',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <SectionHeader
        label="Who This Is For"
        title={<>Built for Every <span className="sweep-text">Creator Type.</span></>}
        subtitle="Whether you're a solo creator or a content business, we have a specialist for your niche."
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16,
        }}
        className="ea-stagger"
      >
        {CREATOR_TYPES.map((type, i) => (
          <div
            key={type.title}
            className={`tilt-card glass-card sr${i % 3 === 0 ? ' sr-left' : i % 3 === 2 ? ' sr-right' : ''}`}
            style={{ border: '1px solid var(--border)', padding: 28 }}
          >
            <div className="tilt-inner">
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: `linear-gradient(135deg, ${type.color}18, ${type.color}0a)`,
                  border: `1px solid ${type.color}28`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}
              >
                <i className={`ti ${type.icon}`} aria-hidden="true" style={{ color: type.color, fontSize: '1.25rem' }} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 10, letterSpacing: '-0.2px' }}>
                {type.title}
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>
                {type.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
