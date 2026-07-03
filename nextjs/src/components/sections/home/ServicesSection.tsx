import Link from 'next/link'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { BorderBeam } from '@/components/ui/BorderBeam'
import { InView } from '@/components/ui/InView'

const SERVICES = [
  {
    icon: 'ti-brand-youtube',
    label: 'SVC-01',
    title: 'High-Retention YouTube Editing',
    desc: 'Every cut, hook, and pacing decision is optimized to maximize Average View Duration. We analyze your niche, your audience, and your style — then edit to keep viewers watching.',
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
    desc: 'Short-form specialists who understand hook timing, vertical framing, and scroll-stopping techniques that work on algorithm-driven feeds.',
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
        padding: 'min(96px,8vw) min(20px,5%)',
        maxWidth: 1200,
        margin: '0 auto',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <SectionHeader
        label="What We Do"
        title={
          <>
            Premium Services.<br />
            <span className="sweep-text" style={{ display: 'block' }}>Every Niche.</span>
          </>
        }
        subtitle="Specialist editors matched to your content type, not generalists assigned by availability."
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 14,
        }}
        className="services-bento"
      >
        {SERVICES.map((svc, i) => {
          const isFeatured = i === 0
          const delay = i * 0.06

          return (
            <InView
              key={svc.label}
              as="article"
              transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
              variants={{
                hidden: { opacity: 0, y: 20, scale: 0.97 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              className={`tilt-card glass-card shine-border${isFeatured ? ' ea-ring-parent' : ''}`}
              style={{
                border: '1px solid var(--border)',
                padding: isFeatured ? '40px 36px' : '28px 26px',
                display: 'flex',
                flexDirection: 'column',
                gap: isFeatured ? 20 : 14,
                gridColumn: isFeatured ? 'span 1' : undefined,
                gridRow: isFeatured ? 'span 2' : undefined,
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 20,
                textDecoration: 'none',
              } as React.CSSProperties}
            >
              {/* Border beam on featured card */}
              {isFeatured && (
                <BorderBeam
                  size={180}
                  duration={10}
                  colorFrom="#c9a84c"
                  colorTo="#c47a55"
                  borderWidth={1}
                />
              )}

              <div className="ea-card-ring" aria-hidden="true" />

              <div className="tilt-inner" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: isFeatured ? 20 : 14 }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div
                    className="icon-box service-icon"
                    style={{
                      width: isFeatured ? 64 : 48,
                      height: isFeatured ? 64 : 48,
                      borderRadius: isFeatured ? 18 : 14,
                      fontSize: isFeatured ? '1.6rem' : '1.2rem',
                    }}
                    aria-hidden="true"
                  >
                    <i className={`ti ${svc.icon}`} />
                  </div>
                  <span
                    className="service-num"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: '0.58rem',
                      fontWeight: 900,
                      color: 'var(--text-muted)',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      opacity: 0.5,
                    }}
                  >
                    {svc.label}
                  </span>
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontSize: isFeatured ? 'clamp(1.2rem,2vw,1.55rem)' : '1rem',
                      fontWeight: 800,
                      letterSpacing: '-0.02em',
                      lineHeight: 1.2,
                      color: 'var(--text-main)',
                      marginBottom: isFeatured ? 14 : 10,
                    }}
                  >
                    {svc.title}
                  </h3>
                  <p
                    style={{
                      fontSize: isFeatured ? '0.95rem' : '0.83rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.75,
                      margin: 0,
                    }}
                  >
                    {svc.desc}
                  </p>
                </div>

                {/* Link */}
                <Link
                  href={svc.href}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: '0.77rem',
                    fontWeight: 800,
                    color: 'var(--primary)',
                    textDecoration: 'none',
                    letterSpacing: '0.1px',
                    marginTop: 'auto',
                    opacity: 0.8,
                    transition: 'opacity 0.2s, gap 0.2s',
                  }}
                  className="svc-link"
                >
                  Learn more
                  <i className="ti ti-arrow-right" aria-hidden="true" style={{ fontSize: '0.8rem' }} />
                </Link>
              </div>
            </InView>
          )
        })}
      </div>

      <style>{`
        @media (max-width: 860px) {
          .services-bento { grid-template-columns: repeat(2,1fr) !important; }
          .services-bento > *:first-child { grid-row: span 1 !important; }
        }
        @media (max-width: 560px) {
          .services-bento { grid-template-columns: 1fr !important; }
        }
        .svc-link:hover { opacity: 1 !important; gap: 10px !important; }
      `}</style>
    </section>
  )
}
