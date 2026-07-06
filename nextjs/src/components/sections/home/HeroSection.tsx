'use client'

import { motion } from 'framer-motion'

export function HeroSection() {
  const E = [0.16, 1, 0.3, 1] as const

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: E },
  })

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
      {/* Overline "FAQ CENTER" with flanking lines */}
      <motion.div
        {...fadeUp(0.1)}
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
        <span style={{ width: '32px', height: '1.5px', backgroundColor: 'var(--primary-accent)', opacity: 0.4 }} aria-hidden="true" />
        Home Page
        <span style={{ width: '32px', height: '1.5px', backgroundColor: 'var(--primary-accent)', opacity: 0.4 }} aria-hidden="true" />
      </motion.div>

      {/* Massive Title: Answers to Everything. */}
      <motion.h1
        {...fadeUp(0.2)}
        style={{
          fontSize: 'clamp(3.2rem, 7.5vw, 5.8rem)',
          lineHeight: 1.0,
          letterSpacing: '-2px',
          color: 'var(--text-main)',
          marginBottom: '36px',
          fontWeight: 400,
          fontFamily: 'var(--font-display)',
          maxWidth: '800px',
        }}
      >
        Answers <br style={{ display: 'none' }} />
        to{' '}
        <span className="brush-highlight">
          Everything.
          <svg className="brush-underline" viewBox="0 0 100 10" preserveAspectRatio="none">
            <path
              d="M 2,6 C 25,3 55,4 98,7 C 75,7 40,8 10,9"
              fill="none"
              stroke="var(--primary-accent)"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </motion.h1>

      {/* Descriptive Subtext */}
      <motion.p
        {...fadeUp(0.3)}
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
        Everything you need to know about working with ExtoArts &mdash; from first contact to final delivery.
      </motion.p>

      {/* CTA Button */}
      <motion.div {...fadeUp(0.4)}>
        <button
          onClick={() => {
            const target = document.getElementById('getting-started')
            if (target) {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
          }}
          className="btn btn-main"
          aria-label="Let's Clear Things Up"
        >
          Let's Clear Things Up <span style={{ fontSize: '1.2rem', marginLeft: '6px' }}>&rarr;</span>
        </button>
      </motion.div>
    </section>
  )
}
