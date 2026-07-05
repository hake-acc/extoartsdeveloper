'use client'

// SectionHeader — cinematic section heading with per-element entrance animations.
// label  : InView fade-up (delay 0)
// title  : MaskTextReveal slide-up from behind a clipping mask (delay 0.05)
// subtitle: InView fade-up (delay 0.2)

import type { ReactNode } from 'react'
import { MaskTextReveal } from '@/components/motion/MaskTextReveal'
import { InView } from '@/components/ui/InView'

interface SectionHeaderProps {
  label?: string
  title: ReactNode
  subtitle?: string
  centered?: boolean
  className?: string
}

export function SectionHeader({
  label,
  title,
  subtitle,
  centered = true,
  className,
}: SectionHeaderProps) {
  return (
    <div className={className} style={{ textAlign: centered ? 'center' : 'left', marginBottom: 54 }}>
      {label && (
        <InView
          variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <span
            className="sec-label"
            style={{ display: 'inline-flex', marginBottom: 16, alignItems: 'center', gap: 8 }}
          >
            <span className="gradient-dot" aria-hidden="true" />
            {label}
          </span>
        </InView>
      )}

      <MaskTextReveal inView delay={0.05} duration={0.65}>
        <h2
          className="sec-title"
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
      </MaskTextReveal>

      {subtitle && (
        <InView
          variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <p
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
        </InView>
      )}
    </div>
  )
}
