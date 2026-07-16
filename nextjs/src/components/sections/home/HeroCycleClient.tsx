'use client'

// HeroCycleClient — handles the cycling h1 title animation.
// Renders the STATIC "You Are Valued." text during SSR and before hydration,
// so the h1 is always in the initial HTML (LCP candidate).
// After mount, AnimatePresence takes over and cycles to the alternate phrase.

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

const BrushLine = () => (
  <svg
    className="brush-underline"
    viewBox="0 0 100 10"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <path
      d="M 2,6 C 25,3 55,4 98,7 C 75,7 40,8 10,9"
      fill="none"
      stroke="var(--primary-accent)"
      strokeWidth="2.8"
      strokeLinecap="round"
    />
  </svg>
)

// Static phrase — rendered in SSR and used as the pre-hydration fallback.
// Must exactly match the server-rendered HTML to avoid hydration mismatches.
const StaticPhrase = () => (
  <span style={{ display: 'block' }}>
    You Are{' '}
    <span className="brush-highlight">
      Valued.
      <BrushLine />
    </span>
  </span>
)

export function HeroCycleClient() {
  const [mounted, setMounted] = useState(false)
  const [showAlt, setShowAlt] = useState(false)

  useEffect(() => {
    setMounted(true)
    let intervalId: number | null = null
    // Start cycling after 1.2 s so the entrance animation finishes first
    const timer = window.setTimeout(() => {
      setShowAlt((s) => !s)
      intervalId = window.setInterval(() => setShowAlt((s) => !s), 3000)
    }, 1200)
    return () => {
      window.clearTimeout(timer)
      if (intervalId) window.clearInterval(intervalId)
    }
  }, [])

  // Pre-hydration: return the same markup the server rendered → no mismatch
  if (!mounted) return <StaticPhrase />

  return (
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
            <BrushLine />
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
            <span style={{ color: 'var(--text-main)', lineHeight: 1 }}>the </span>
            <span style={{ display: 'inline-flex', gap: 12, alignItems: 'baseline' }}>
              <span style={{ color: 'var(--text-main)' }}>Art</span>
              <span className="brush-highlight" style={{ display: 'inline-block' }}>
                Lives.
                <BrushLine />
              </span>
            </span>
          </span>
        </motion.span>
      )}
    </AnimatePresence>
  )
}
