'use client'

// MotionProvider — wraps the app in MotionConfig so every framer-motion
// animation in the tree respects the user's OS "prefer reduced motion"
// accessibility setting without each component needing to query it.

import { MotionConfig } from 'framer-motion'

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      {children}
    </MotionConfig>
  )
}
