// HeroSection — SERVER component (no 'use client').
// The static h1 "Where You Are Valued." is rendered in the SSR HTML stream,
// making it an LCP candidate with zero JS dependency.
// HeroCycleClient hydrates after load and adds the cycling animation.
// HeroCtaButton is the only interactive element that needs client JS.

import { HeroCycleClient } from './HeroCycleClient'
import { HeroCtaButton } from './HeroCtaButton'

export function HeroSection() {
  return (
    <section
      className="hero"
      aria-label="FAQ Center Hero"
      style={{
        paddingTop: 'min(24svh, 24vh)',
        paddingBottom: 'min(120px, 12vw)',
        paddingLeft: 'min(40px, 6%)',
        paddingRight: 'min(40px, 6%)',
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        textAlign: 'left',
      }}
    >
      {/* Overline "HOME PAGE" — CSS entrance animation, no JS */}
      <div
        className="hero-entrance-1"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '0.72rem',
          fontWeight: 700,
          letterSpacing: '0.25em',
          color: 'var(--primary-accent)',
          textTransform: 'uppercase',
          fontFamily: 'var(--font-body)',
          marginBottom: '28px',
        }}
      >
        <span
          style={{
            width: '32px',
            height: '1.5px',
            backgroundColor: 'var(--primary-accent)',
            opacity: 0.4,
          }}
          aria-hidden="true"
        />
        Home Page
        <span
          style={{
            width: '32px',
            height: '1.5px',
            backgroundColor: 'var(--primary-accent)',
            opacity: 0.4,
          }}
          aria-hidden="true"
        />
      </div>

      {/* H1 — SSR renders "Where / You Are Valued." immediately for LCP.
          HeroCycleClient takes over the second line after hydration. */}
      <h1
        className="hero-entrance-2"
        aria-label="Where You Are Valued."
        style={{
          fontSize: 'clamp(2.6rem, 6.4vw, 5rem)',
          lineHeight: 1.0,
          letterSpacing: '-2px',
          color: 'var(--text-main)',
          marginBottom: '36px',
          fontWeight: 400,
          fontFamily: 'var(--font-display)',
          maxWidth: '800px',
          position: 'relative',
        }}
      >
        <span style={{ display: 'block' }} aria-hidden="true">
          Where
        </span>
        {/* Static SSR text is shown immediately; cycling starts post-hydration */}
        <HeroCycleClient />
      </h1>

      {/* Subtext — CSS entrance animation */}
      <p
        className="hero-entrance-3"
        style={{
          fontSize: 'clamp(1rem, 1.8vw, 1.12rem)',
          color: 'var(--text-muted)',
          lineHeight: 1.8,
          maxWidth: '520px',
          marginBottom: '44px',
          fontFamily: 'var(--font-body)',
          fontWeight: 400,
        }}
      >
        YouTube video editing, thumbnail design, and Shorts for creators who
        want real results. Flat 10% agency fee — 90% goes directly to your
        editor.
      </p>

      {/* CTA — client component only for the scroll onClick */}
      <div className="hero-entrance-4">
        <HeroCtaButton />
      </div>
    </section>
  )
}
