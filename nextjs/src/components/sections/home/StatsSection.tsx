const STATS = [
  {
    value: 120,
    suffix: '+',
    label: 'Projects Delivered',
    icon: 'ti-package',
    desc: 'Completed across all niches',
  },
  {
    value: 5.0,
    suffix: '/5',
    label: 'Average Rating',
    icon: 'ti-star-filled',
    decimals: 1,
    desc: 'Verified Discord reviews',
  },
  {
    value: 10,
    suffix: '%',
    label: 'Flat Agency Fee',
    icon: 'ti-percentage',
    prefix: 'Only ',
    desc: '90% goes to your editor',
  },
  {
    value: 48,
    suffix: 'h',
    label: 'Avg. Turnaround',
    icon: 'ti-clock',
    prefix: '<',
    desc: 'For thumbnails & shorts',
  },
]

export function StatsSection() {
  return (
    <section
      aria-label="Agency statistics"
      style={{
        padding: 'min(64px,6vw) min(20px,5%)',
        maxWidth: 1100,
        margin: '0 auto',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div
        className="stats-row"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 14,
        }}
      >
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className="stat-item glass-card shine-border sr"
            style={{
              border: '1px solid var(--border)',
              borderRadius: 20,
              padding: '32px 28px',
              textAlign: 'center',
              animationDelay: `${i * 50}ms`,
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.35s var(--ease-spring), box-shadow 0.35s',
            }}
          >
            <div className="ea-card-ring" aria-hidden="true" />
            {/* Icon */}
            <div
              className="icon-box"
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                margin: '0 auto 18px',
              }}
            >
              <i className={`ti ${stat.icon}`} aria-hidden="true" style={{ fontSize: '1.25rem' }} />
            </div>
            {/* Number */}
            <div
              className="stat-number gradient-num"
              style={{
                fontSize: 'clamp(2.2rem, 4.5vw, 3rem)',
                fontWeight: 900,
                lineHeight: 1,
                marginBottom: 8,
              }}
              data-count-up
              data-target={stat.value}
              data-suffix={stat.suffix}
              data-prefix={stat.prefix ?? ''}
              data-decimals={stat.decimals ?? 0}
            >
              {stat.prefix ?? ''}{stat.value}{stat.suffix}
            </div>
            <p style={{
              fontSize: '0.8rem',
              color: 'var(--text-main)',
              margin: '0 0 5px',
              fontWeight: 700,
              letterSpacing: '-0.1px',
            }}>
              {stat.label}
            </p>
            <p style={{
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              margin: 0,
              fontWeight: 500,
            }}>
              {stat.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
