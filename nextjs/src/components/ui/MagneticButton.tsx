'use client'

// MagneticButton — spring-interpolated magnetic hover effect.
// Uses useSpring for natural momentum so position carries velocity on release,
// avoiding the artificial "snapping" of direct mouse-to-transform mapping.
// Only fires on devices with a fine pointer (mouse/trackpad), not touch.

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { motion, useSpring } from 'framer-motion'

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  /** 0–1: how strongly the element follows the cursor. Default 0.35. */
  strength?: number
}

// Fast stiffness + moderate damping = snappy but with visible momentum on release
const SPRING = { stiffness: 150, damping: 15, mass: 0.1 }

export function MagneticButton({ children, className, strength = 0.35 }: MagneticButtonProps) {
  const x = useSpring(0, SPRING)
  const y = useSpring(0, SPRING)

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    x.set((e.clientX - rect.left - rect.width / 2) * strength)
    y.set((e.clientY - rect.top - rect.height / 2) * strength)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      className={cn('magnetic-btn', className)}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  )
}
