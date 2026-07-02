const STATS = [
  { value: 120, suffix: '+', label: 'Projects Delivered', icon: 'ti-package' },
  { value: 5.0, suffix: '/5', label: 'Average Rating', icon: 'ti-star-filled', decimals: 1 },
  { value: 10, suffix: '%', label: 'Flat Agency Fee', icon: 'ti-percentage', prefix: 'Only ' },
  { value: 48, suffix: 'h', label: 'Avg. Turnaround', icon: 'ti-clock', prefix: '<' },
]

export function StatsSection() {
  return (
    <section
      aria-label="Agency statistics"
      style={{
        padding: 'min(56px,6vw) min(20px,5%)',
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
        }}
      >
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className="stat-item glass-card sr ea-card-bounce"
            style={{
              border: '1px solid var(--border)',
              borderRadius: 18,
              padding: '28px 24px',
              textAlign: 'center',
              animationDelay: `${i * 45}ms`,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'rgba(34,211,238,0.08)',
                border: '1px solid rgba(34,211,238,0.16)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <i className={`ti ${stat.icon}`} aria-hidden="true" style={{ color: 'var(--primary)', fontSize: '1.2rem' }} />
            </div>
            <div
              className="stat-number gradient-num"
              style={{
                fontSize: 'clamp(2rem,4vw,2.8rem)',
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
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, fontWeight: 600, letterSpacing: '0.3px' }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
