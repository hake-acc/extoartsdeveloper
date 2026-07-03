import { InView } from '@/components/ui/InView'

// Each stat gets a unique brand colour — all 5 palette colours represented
const STATS = [
  {
    icon: 'ti-video',
    value: '120+',
    label: 'Projects Delivered',
    desc: 'Videos edited, thumbnails designed, channels grown',
    countUp: '120',
    color: '#69ddff',   // Frozen Lake
    rgba: '105,221,255',
  },
  {
    icon: 'ti-star-filled',
    value: '5.0',
    label: 'Average Rating',
    desc: 'Verified reviews across Discord and Trustpilot',
    countUp: '5.0',
    color: '#96cdff',   // Sky Blue
    rgba: '150,205,255',
  },
  {
    icon: 'ti-percent',
    value: '10%',
    label: 'Flat Agency Fee',
    desc: '90% of your budget goes directly to your editor',
    color: '#dbbadd',   // Pink Orchid
    rgba: '219,186,221',
  },
  {
    icon: 'ti-clock',
    value: '48h',
    label: 'Turnaround',
    desc: 'Rush delivery for urgent projects, guaranteed',
    color: '#be92a2',   // Old Rose
    rgba: '190,146,162',
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
              border: `1px solid rgba(${stat.rgba},0.15)`,
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
              {/* Per-stat brand-coloured icon box */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  fontSize: '1.1rem',
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  background: `linear-gradient(135deg, rgba(${stat.rgba},0.14), rgba(${stat.rgba},0.06))`,
                  border: `1px solid rgba(${stat.rgba},0.22)`,
                  boxShadow: `0 0 16px rgba(${stat.rgba},0.08)`,
                  color: stat.color,
                  transition: 'box-shadow 0.3s, border-color 0.3s',
                }}
                aria-hidden="true"
              >
                <i className={`ti ${stat.icon}`} />
              </div>

              {/* Per-stat brand-coloured gradient number */}
              <div
                className="stat-number"
                style={{
                  fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
                  fontWeight: 900,
                  letterSpacing: '-2px',
                  lineHeight: 1,
                  marginBottom: 8,
                  background: `linear-gradient(135deg, ${stat.color} 0%, #eeeef8 55%, ${stat.color} 100%)`,
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'gradientShimmerX 5s linear infinite',
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
