import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { absolute: '404 — Page Not Found | ExtoArts' },
  description: 'The page you are looking for could not be found.',
}

export default function NotFound() {
  return (
    <section style={{ padding: 'min(22vh,180px) min(20px,5%) min(100px,10vw)', textAlign: 'center', maxWidth: 700, margin: '0 auto', position: 'relative', zIndex: 10 }}>
      <div style={{ fontSize: 'clamp(5rem,15vw,9rem)', fontWeight: 900, letterSpacing: '-6px', lineHeight: 1, marginBottom: 20 }}>
        <span className="gradient-num">404</span>
      </div>
      <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900, letterSpacing: '-1px', marginBottom: 16, color: 'var(--text-main)' }}>
        Page Not Found
      </h1>
      <p style={{ fontSize: '1rem', color: 'var(--text-muted)', maxWidth: 420, margin: '0 auto 40px', lineHeight: 1.7 }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
      </p>
      <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href="/" className="btn btn-main">
          <i className="ti ti-home" aria-hidden="true" /> Go Home
        </Link>
        <Link href="/services" className="btn btn-glass">
          <i className="ti ti-layout-grid" aria-hidden="true" /> View Services
        </Link>
      </div>
    </section>
  )
}
