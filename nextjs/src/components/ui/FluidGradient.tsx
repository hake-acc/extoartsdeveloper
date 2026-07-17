'use client'

// Exact Framer "Fluid Gradient" component code
// Source: https://www.framer.com/community/marketplace/components/fluid-gradient/
// (framerusercontent.com/modules/vgkFAgvd2WDCTyzcSFXh/…/Animated_Background.js)
// Only colours swapped to ExtoArts brand palette — animation logic is verbatim.
// Mobile optimisation: on touch/coarse-pointer devices we skip the Framer Motion
// animation entirely (filter:blur on large divs is a GPU killer on mobile) and
// render a static CSS gradient instead.

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface FluidGradientProps {
  color1?: string
  color2?: string
  color3?: string
  gradientSpeed?: number
  blur?: number
  style?: React.CSSProperties
}

export function FluidGradient({
  color1 = '#69ddff',   // Frozen Lake  (ExtoArts primary)
  color2 = '#be92a2',   // Old Rose     (ExtoArts accent)
  color3 = '#dbbadd',   // Pink Orchid  (ExtoArts mid)
  gradientSpeed = 3,
  blur = 100,
  style,
}: FluidGradientProps) {
  const duration = 20 / gradientSpeed
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const touch = window.matchMedia('(pointer: coarse)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setIsMobile(touch || reduced)
  }, [])

  // On mobile / reduced-motion: static radial gradient — zero JS animation cost.
  if (isMobile) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          background: `radial-gradient(circle at 80% 50%, ${color1}55 0%, transparent 55%),
                       radial-gradient(circle at 20% 80%, ${color2}55 0%, transparent 55%),
                       radial-gradient(circle at 50% 20%, ${color3}44 0%, transparent 55%)`,
          ...style,
        }}
      />
    )
  }

  // Desktop: animated blobs. Blur is capped at 60px (vs original 100px) to
  // reduce raster cost even on desktop GPUs.
  const desktopBlur = Math.min(blur, 60)

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        minWidth: '100px',
        minHeight: '100px',
        ...style,
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          width: '150%',
          height: '150%',
          left: '-25%',
          top: '-25%',
          background: `radial-gradient(circle at 80% 50%, ${color1} 0%, transparent 50%)`,
          filter: `blur(${desktopBlur}px)`,
        }}
        animate={{ x: ['0%', '20%', '0%'], y: ['0%', '25%', '0%'] }}
        transition={{ duration: duration, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        style={{
          position: 'absolute',
          width: '150%',
          height: '150%',
          left: '-25%',
          top: '-25%',
          background: `radial-gradient(circle at 20% 80%, ${color2} 0%, transparent 50%)`,
          filter: `blur(${desktopBlur}px)`,
        }}
        animate={{ x: ['0%', '-20%', '0%'], y: ['0%', '20%', '0%'] }}
        transition={{ duration: duration * 1.2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        style={{
          position: 'absolute',
          width: '150%',
          height: '150%',
          left: '-25%',
          top: '-25%',
          background: `radial-gradient(circle at 50% 20%, ${color3} 0%, transparent 50%)`,
          filter: `blur(${desktopBlur}px)`,
        }}
        animate={{ x: ['0%', '15%', '0%'], y: ['0%', '-20%', '0%'] }}
        transition={{ duration: duration * 0.9, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
