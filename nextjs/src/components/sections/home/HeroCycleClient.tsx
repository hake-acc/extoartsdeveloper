'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

const pathVariants = {
  rest: {
    pathLength: 0,
    opacity: 0,
    transition: { opacity: { duration: 0.18, delay: 0.05 } },
  },
  hover: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.55, ease: [0.4, 0, 0.2, 1] },
      opacity: { duration: 0.04 },
    },
  },
}

// Animated brush line — Framer Motion, used only after hydration.
const BrushLine = () => (
  <motion.svg
    className="brush-underline"
    viewBox="0 0 100 10"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <motion.path
      d="M 2,6 C 25,3 55,4 98,7 C 75,7 40,8 10,9"
      fill="none"
      stroke="var(--primary-accent)"
      strokeWidth="2.8"
      strokeLinecap="round"
      variants={pathVariants}
    />
  </motion.svg>
)

// Plain SVG — used only in StaticPhrase (SSR + pre-hydration).
// Must be plain HTML with no Framer Motion attributes to avoid hydration mismatch.
const StaticBrushLine = () => (
  <svg
    className="brush-underline"
    viewBox="0 0 100 10"
    preserveAspectRatio="none"
    aria-hidden="true"
    style={{ opacity: 0 }}
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

// Static phrase — plain HTML, rendered in SSR and used as the pre-hydration fallback.
const StaticPhrase = () => (
  <span style={{ display: 'block' }}>
    You Are{' '}
    <span className="brush-highlight">
      Valued.
      <StaticBrushLine />
    </span>
  </span>
)

export function HeroCycleClient() {
  const [mounted, setMounted] = useState(false)
  const [showAlt, setShowAlt] = useState(false)

  useEffect(() => {
    setMounted(true)
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
          <motion.span
            className="brush-highlight"
            initial="rest"
            whileHover="hover"
            animate="rest"
          >
            Valued.
            <BrushLine />
          </motion.span>
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
              <motion.span
                className="brush-highlight"
                style={{ display: 'inline-block' }}
                initial="rest"
                whileHover="hover"
                animate="rest"
              >
                Lives.
                <BrushLine />
              </motion.span>
            </span>
          </span>
        </motion.span>
      )}
    </AnimatePresence>
  )
}
