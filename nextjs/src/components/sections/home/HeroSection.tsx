'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export function HeroSection() {
  const E = [0.16, 1, 0.3, 1] as const

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: E },
  })

  const [showAlt, setShowAlt] = useState(false)

  useEffect(() => {
    // swap title after initial entrance animation, then toggle every 3s
    let intervalId: number | null = null
    const timer = window.setTimeout(() => {
      setShowAlt((s) => !s)
      intervalId = window.setInterval(() => setShowAlt((s) => !s), 3000)
    }, 1200)

    return () => {
      window.clearTimeout(timer)
      if (intervalId) window.clearInterval(intervalId)
    }
  }, [])

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

      {/* Massive Title */}
      <motion.h1
        {...fadeUp(0.2)}
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
        {/* Keep 'Where' fixed */}
        <span style={{ display: 'block' }} aria-hidden="true">
          Where
        </span>

        <AnimatePresence mode="wait" initial={false}>
          {!showAlt ? (
            <motion.span
              key="original"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45 }}
              style={{ display: 'block' }}
            >
              You Are{' '}
              <span className="brush-highlight">
                Valued.
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
            </motion.span>
          ) : (
            <motion.span
              key="alt"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45 }}
              style={{ display: 'block' }}
            >
              <span style={{ display: 'inline-flex', gap: 18, alignItems: 'flex-end' }}>
                <span style={{ color: 'var(--text-main)', lineHeight: 1 }}>
                  the 
                </span>

                <span style={{ display: 'inline-flex', gap: 12, alignItems: 'baseline' }}>
                  <span style={{ color: 'var(--text-main)' }}>Art</span>
                  <span className="brush-highlight" style={{ display: 'inline-block' }}>
                    Lives.
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
                </span>
              </span>
            </motion.span>
          )}
        </AnimatePresence>
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
        YouTube video editing, thumbnail design, and Shorts for creators who want real results. Flat 10% agency fee — 90% goes directly to your editor.
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
