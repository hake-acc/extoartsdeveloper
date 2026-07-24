'use client'

// error.tsx — route-level error boundary.
// Renders when a Server Component or data fetch throws during rendering.
// Provides branded recovery UI instead of Next.js default error page.

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Dev-only: log to console for quick inspection.
      // TODO: replace with a production error-reporting service (e.g. Sentry).
      console.error('[ExtoArts] Page error:', error)
    }
  }, [error])

  return (
    <main
      id="main-content"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'min(40px, 6%)',
        textAlign: 'center',
        gap: 24,
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '0.72rem',
          fontWeight: 700,
          letterSpacing: '0.25em',
          color: 'var(--primary-accent)',
          textTransform: 'uppercase',
          marginBottom: '8px',
        }}
      >
        <span style={{ width: '32px', height: '1.5px', backgroundColor: 'var(--primary-accent)', opacity: 0.4 }} />
        Something went wrong
        <span style={{ width: '32px', height: '1.5px', backgroundColor: 'var(--primary-accent)', opacity: 0.4 }} />
      </span>

      <h1
        style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 400,
          fontFamily: 'var(--font-display)',
          letterSpacing: '-1.5px',
          color: 'var(--text-main)',
          lineHeight: 1.1,
          margin: 0,
        }}
      >
        That page hit a snag.
      </h1>

      <p
        style={{
          fontSize: '1rem',
          color: 'var(--text-muted)',
          maxWidth: 440,
          lineHeight: 1.7,
          margin: 0,
        }}
      >
        Something unexpected happened on our end. You can try again, or head
        back home while we sort it out.
      </p>

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={() => reset()}
          className="btn btn-main"
          aria-label="Try loading the page again"
        >
          Try again
        </button>
        <Link href="/" className="btn btn-glass" style={{ borderRadius: 999 }}>
          <i className="ti ti-home" aria-hidden="true" /> Back to home
        </Link>
      </div>

      {error.digest && (
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', opacity: 0.5, margin: 0 }}>
          Error ID: {error.digest}
        </p>
      )}
    </main>
  )
}
