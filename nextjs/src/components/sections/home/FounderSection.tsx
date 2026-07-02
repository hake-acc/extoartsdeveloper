import Link from 'next/link'
import Image from 'next/image'
import { FOUNDER_PHOTO, DISCORD_URL } from '@/lib/constants'

export function FounderSection() {
  return (
    <section
      aria-labelledby="founder-heading"
      style={{
        padding: 'min(80px,7vw) min(20px,5%)',
        maxWidth: 1100,
        margin: '0 auto',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div
        className="tilt-card glass-card sr"
        style={{
          border: '1px solid var(--border)',
          borderRadius: 24,
          padding: 'min(52px,5vw)',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: 48,
          alignItems: 'center',
        }}
      >
        <div className="tilt-inner">
          <span
            className="sec-label"
            style={{ display: 'inline-flex', marginBottom: 20, alignItems: 'center', gap: 8 }}
          >
            <span className="gradient-dot" aria-hidden="true" />
            Meet the Founder
          </span>
          <h2 id="founder-heading" style={{ fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 900, letterSpacing: '-1px', marginBottom: 16, color: 'var(--text-main)' }}>
            Rehan <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>/ RehanSigma</span>
          </h2>
          <p style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 18 }}>
            Founder & Creative Director
          </p>
          <blockquote style={{ borderLeft: '2px solid var(--primary)', paddingLeft: 18, margin: '0 0 24px', color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.97rem', lineHeight: 1.7 }}>
            &ldquo;90% of your budget should go to the person actually doing the work. That&apos;s not generosity - it&apos;s just fair.&rdquo;
          </blockquote>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.72, marginBottom: 28 }}>
            ExtoArts was founded in 2024 with one principle: treat editors and creators fairly. We&apos;re not a middleman who takes 40%. We&apos;re a specialist team that takes 10% and delivers premium results.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/about" className="btn btn-glass" style={{ fontSize: '0.82rem' }}>
              <i className="ti ti-user" aria-hidden="true" /> About Rehan
            </Link>
            <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-muted)', textDecoration: 'none', padding: '12px 18px', border: '1px solid var(--border)', borderRadius: 14, transition: 'color 0.2s' }}>
              <i className="ti ti-brand-discord" aria-hidden="true" /> Discord
            </a>
          </div>
        </div>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div
            style={{
              width: 'clamp(140px,18vw,200px)',
              height: 'clamp(140px,18vw,200px)',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid rgba(34,211,238,0.25)',
              boxShadow: '0 0 40px rgba(34,211,238,0.12)',
              position: 'relative',
            }}
          >
            <Image
              src={FOUNDER_PHOTO}
              alt="Rehan - ExtoArts Founder & Creative Director"
              fill
              sizes="200px"
              style={{ objectFit: 'cover' }}
              priority={false}
            />
          </div>
          {/* Glow ring */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: -8,
              borderRadius: '50%',
              border: '1px solid rgba(34,211,238,0.15)',
              animation: 'pulseGlow 3s ease infinite',
            }}
          />
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          section[aria-labelledby="founder-heading"] .tilt-card {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
          section[aria-labelledby="founder-heading"] .tilt-card > div:last-child {
            justify-self: center;
          }
          section[aria-labelledby="founder-heading"] blockquote {
            text-align: left;
          }
        }
      `}</style>
    </section>
  )
}
