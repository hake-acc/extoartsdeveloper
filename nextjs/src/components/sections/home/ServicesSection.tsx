import Link from 'next/link'
import { SectionHeader } from '@/components/ui/SectionHeader'

const SERVICES = [
  {
    icon: 'ti-brand-youtube',
    label: 'SVC-01',
    title: 'High-Retention YouTube Editing',
    desc: 'Every cut, hook, and pacing decision is optimized to maximize Average View Duration. We analyze your niche, your audience, and your style - then edit to keep viewers watching.',
    href: '/services#youtube-editing',
    featured: true,
  },
  {
    icon: 'ti-photo',
    label: 'SVC-02',
    title: 'Viral Thumbnail Design',
    desc: 'CTR-optimized thumbnails built to stop the scroll. Color psychology, composition, and proven click-through frameworks.',
    href: '/services#thumbnail-design',
  },
  {
    icon: 'ti-device-mobile-vibration',
    label: 'SVC-03',
    title: 'Shorts & TikTok Editing',
    desc: 'Short-form specialists who understand hook timing, vertical framing, and the scroll-stopping techniques that work on algorithm-driven feeds.',
    href: '/services#shorts-editing',
  },
  {
    icon: 'ti-device-gamepad-2',
    label: 'SVC-04',
    title: 'Gaming Video Editing',
    desc: 'Niche-matched gaming editors for Roblox, Minecraft, PUBG, Free Fire, and more. We know the culture, the pacing, and the audience.',
    href: '/services#gaming',
  },
  {
    icon: 'ti-sparkles',
    label: 'SVC-05',
    title: 'Motion Graphics & VFX',
    desc: 'Custom After Effects animations, transitions, and visual effects purpose-built for your channel identity.',
    href: '/services#motion-graphics',
  },
  {
    icon: 'ti-eye-off',
    label: 'SVC-06',
    title: 'Faceless Channel Automation',
    desc: 'Script to published video - complete done-for-you production for faceless YouTube channels and automated content businesses.',
    href: '/services#faceless',
  },
]

export function ServicesSection() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      style={{
        padding: 'min(80px,7vw) min(20px,5%)',
        maxWidth: 1200,
        margin: '0 auto',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <SectionHeader
        label="What We Do"
        title={<>Premium Services.<br /><span className="sweep-text" style={{ display: 'block' }}>Every Niche.</span></>}
        subtitle="Specialist editors matched to your content type, not generalists assigned by availability."
      />

      {/* Bento grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 18,
        }}
        className="ea-stagger"
      >
        {SERVICES.map((svc, i) => (
          <article
            key={svc.label}
            className={`tilt-card glass-card sr${i % 3 === 0 ? ' sr-left' : i % 3 === 2 ? ' sr-right' : ''}`}
            style={{
              border: '1px solid var(--border)',
              padding: 32,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              ...(i === 0 ? { gridRow: 'span 2' } : {}),
            }}
          >
            <div className="tilt-inner" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  className="service-icon"
                  style={{
                    width: i === 0 ? 74 : 52,
                    height: i === 0 ? 74 : 52,
                    borderRadius: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <i className={`ti ${svc.icon}`} aria-hidden="true" style={{ fontSize: i === 0 ? '1.85rem' : '1.4rem' }} />
                </div>
                <span
                  className="service-num"
                  style={{
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    color: 'var(--text-muted)',
                    border: '1px solid var(--border)',
                    padding: '3px 10px',
                    borderRadius: 999,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  {svc.label}
                </span>
              </div>

              <h3
                style={{
                  fontSize: i === 0 ? 'clamp(1.25rem,2.2vw,1.7rem)' : 'clamp(1.1rem,1.8vw,1.35rem)',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  letterSpacing: '-0.4px',
                  flex: i === 0 ? 0 : undefined,
                }}
              >
                {svc.title}
              </h3>

              <p
                style={{
                  fontSize: '0.88rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.7,
                  flex: i === 0 ? 1 : undefined,
                  margin: 0,
                }}
              >
                {svc.desc}
              </p>

              <Link
                href={svc.href}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--primary)',
                  textDecoration: 'none',
                  letterSpacing: '0.3px',
                  marginTop: 'auto',
                  paddingTop: 8,
                }}
                aria-label={`Learn more about ${svc.title}`}
              >
                Learn more <i className="ti ti-arrow-right" aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <Link href="/services" className="btn btn-glass">
          <i className="ti ti-layout-grid" aria-hidden="true" /> Explore All Services
        </Link>
      </div>
    </section>
  )
}
