import { InView } from '@/components/ui/InView'

const STATS = [
  {
    icon: 'ti-video',
    value: '120+',
    label: 'Projects Delivered',
    desc: 'Videos edited, thumbnails designed, channels grown',
    countUp: '120',
  },
  {
    icon: 'ti-star-filled',
    value: '5.0',
    label: 'Average Rating',
    desc: 'Verified reviews across Discord and Trustpilot',
    countUp: '5.0',
  },
  {
    icon: 'ti-percent',
    value: '10%',
    label: 'Flat Agency Fee',
    desc: '90% of your budget goes directly to your editor',
  },
  {
    icon: 'ti-clock',
    value: '48h',
    label: 'Turnaround',
    desc: 'Rush delivery for urgent projects, guaranteed',
  },
]

export function StatsSection() {
  return (
    <section
      aria-label="Key statistics"
      style={{
        padding: 'min(80px,7vw) min(20px,5%)',
        maxWidth: 1200,
        margin: '0 auto',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <hr className="section-divider" style={{ marginBottom: 'min(72px,6vw)' }} />

      <div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}
        className="stats-grid"
      >
        {STATS.map((stat, i) => (
          <InView
            key={stat.label}
            as="div"
            transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0 },
            }}
            className="stat-item glass-card tilt-card shine-border"
            style={{
              border: '1px solid var(--border)',
              borderRadius: 20,
              padding: 'min(32px,3vw) min(26px,2.5vw)',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div className="ea-card-ring" aria-hidden="true" />
            <div className="tilt-inner">
              <div
                className="icon-box"
                style={{ width: 44, height: 44, borderRadius: 12, fontSize: '1.1rem', marginBottom: 16 }}
                aria-hidden="true"
              >
                <i className={`ti ${stat.icon}`} />
              </div>
              <div
                className="stat-number gradient-num"
                style={{
                  fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
                  fontWeight: 900,
                  letterSpacing: '-2px',
                  lineHeight: 1,
                  marginBottom: 8,
                }}
                data-count-up={stat.countUp}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.01em', marginBottom: 6 }}>
                {stat.label}
              </div>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>
                {stat.desc}
              </p>
            </div>
          </InView>
        ))}
      </div>

      <hr className="section-divider" style={{ marginTop: 'min(72px,6vw)' }} />

      <style>{`
        @media (max-width: 800px) { .stats-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 480px) { .stats-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}
