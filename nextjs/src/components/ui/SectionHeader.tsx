interface SectionHeaderProps {
  label?: string
  title: React.ReactNode
  subtitle?: string
  centered?: boolean
  className?: string
}

export function SectionHeader({ label, title, subtitle, centered = true, className }: SectionHeaderProps) {
  return (
    <div className={className} style={{ textAlign: centered ? 'center' : 'left', marginBottom: 54 }}>
      {label && (
        <span
          className="sec-label sr"
          style={{ display: 'inline-flex', marginBottom: 16, alignItems: 'center', gap: 8 }}
        >
          <span className="gradient-dot" aria-hidden="true" />
          {label}
        </span>
      )}
      <h2
        className="sec-title sr"
        style={{
          fontSize: 'clamp(2.2rem, 5.5vw, 4rem)',
          fontWeight: 900,
          marginBottom: 16,
          color: 'var(--text-main)',
          letterSpacing: '-2.5px',
          lineHeight: 1.05,
          textAlign: centered ? 'center' : 'left',
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="sr"
          style={{
            fontSize: '1rem',
            color: 'var(--text-muted)',
            maxWidth: 520,
            margin: centered ? '0 auto' : '0',
            lineHeight: 1.75,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
