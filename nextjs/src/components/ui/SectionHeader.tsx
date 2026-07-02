interface SectionHeaderProps {
  label?: string
  title: React.ReactNode
  subtitle?: string
  centered?: boolean
  className?: string
}

export function SectionHeader({ label, title, subtitle, centered = true, className }: SectionHeaderProps) {
  return (
    <div className={className} style={{ textAlign: centered ? 'center' : 'left' }}>
      {label && (
        <span
          className="sec-label"
          style={{ display: 'block', marginBottom: 14, textAlign: centered ? 'center' : 'left' }}
        >
          <span className="gradient-dot" aria-hidden="true" />
          {label}
        </span>
      )}
      <h2
        className="sec-title"
        style={{
          fontSize: 'clamp(2.2rem,5vw,3.8rem)',
          fontWeight: 900,
          marginBottom: 14,
          color: 'var(--text-main)',
          letterSpacing: '-2px',
          lineHeight: 1.08,
          textAlign: centered ? 'center' : 'left',
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          style={{
            fontSize: '1rem',
            color: 'var(--text-muted)',
            maxWidth: 520,
            margin: centered ? '0 auto 50px' : '0 0 50px',
            lineHeight: 1.75,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
