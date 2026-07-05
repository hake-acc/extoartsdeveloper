'use client'

// MotionProvider — sets MotionConfig at the root so all Framer Motion
// animations respect prefers-reduced-motion automatically without needing
// useReducedMotion() in every individual component.
// reducedMotion="user" reads the OS preference; when reduced motion is on,
// Framer Motion skips animations (instant transitions).

import { MotionConfig } from 'framer-motion'

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      {children}
    </MotionConfig>
  )
}
