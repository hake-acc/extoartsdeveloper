'use client'

// Exact Framer "Fluid Gradient" component code
// Source: https://www.framer.com/community/marketplace/components/fluid-gradient/
// (framerusercontent.com/modules/vgkFAgvd2WDCTyzcSFXh/…/Animated_Background.js)
// Only colours swapped to ExtoArts brand palette — animation logic is verbatim.
//
// Mobile optimisation is handled purely in CSS (globals.css @media pointer:coarse):
//   .fluid-gradient-blob { filter: none !important; }
// This strips filter:blur() on touch devices without any JS detection, which
// avoids a server/client hydration mismatch that would hurt CLS scores.

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
  blur = 60,            // Capped at 60px (was 100px) — reduces raster cost on desktop too
  style,
}: FluidGradientProps) {
  const duration = 20 / gradientSpeed

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
        className="fluid-gradient-blob"
        style={{
          position: 'absolute',
          width: '150%',
          height: '150%',
          left: '-25%',
          top: '-25%',
          background: `radial-gradient(circle at 80% 50%, ${color1} 0%, transparent 50%)`,
          filter: `blur(${blur}px)`,
        }}
        animate={{ x: ['0%', '20%', '0%'], y: ['0%', '25%', '0%'] }}
        transition={{ duration: duration, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="fluid-gradient-blob"
        style={{
          position: 'absolute',
          width: '150%',
          height: '150%',
          left: '-25%',
          top: '-25%',
          background: `radial-gradient(circle at 20% 80%, ${color2} 0%, transparent 50%)`,
          filter: `blur(${blur}px)`,
        }}
        animate={{ x: ['0%', '-20%', '0%'], y: ['0%', '20%', '0%'] }}
        transition={{ duration: duration * 1.2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="fluid-gradient-blob"
        style={{
          position: 'absolute',
          width: '150%',
          height: '150%',
          left: '-25%',
          top: '-25%',
          background: `radial-gradient(circle at 50% 20%, ${color3} 0%, transparent 50%)`,
          filter: `blur(${blur}px)`,
        }}
        animate={{ x: ['0%', '15%', '0%'], y: ['0%', '-20%', '0%'] }}
        transition={{ duration: duration * 0.9, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
