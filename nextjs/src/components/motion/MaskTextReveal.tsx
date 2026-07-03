'use client'

/**
 * MaskTextReveal — slides text up from behind a clipping mask on page load.
 * Inspired by the Framer Community "Mask Text Reveal" component.
 *
 * Usage:
 *   <MaskTextReveal delay={0.1}>Your headline text</MaskTextReveal>
 *   <MaskTextReveal lines={['Line one', 'Line two']} stagger={0.08} />
 */

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface MaskTextRevealProps {
  /** Simple single-block reveal */
  children?: React.ReactNode
  /** Multi-line reveal — each string gets its own masked line */
  lines?: string[]
  /** Delay before the first line starts (seconds) */
  delay?: number
  /** Stagger between lines (seconds) */
  stagger?: number
  /** Duration of each line's reveal (seconds) */
  duration?: number
  /** Trigger when element enters viewport rather than immediately on mount */
  inView?: boolean
  className?: string
  style?: React.CSSProperties
  /** Applied to each individual line wrapper */
  lineClassName?: string
  lineStyle?: React.CSSProperties
}

const EASE = [0.16, 1, 0.3, 1] as const

export function MaskTextReveal({
  children,
  lines,
  delay = 0,
  stagger = 0.1,
  duration = 0.72,
  inView: triggerInView = false,
  className,
  style,
  lineClassName,
  lineStyle,
}: MaskTextRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const shouldAnimate = triggerInView ? isInView : true

  const lineVariants = {
    hidden: { y: '110%', opacity: 0 },
    visible: (i: number) => ({
      y: '0%',
      opacity: 1,
      transition: {
        duration,
        delay: delay + i * stagger,
        ease: EASE,
      },
    }),
  }

  if (lines && lines.length > 0) {
    return (
      <div ref={ref} className={className} style={style}>
        {lines.map((line, i) => (
          <div
            key={i}
            style={{
              overflow: 'hidden',
              display: 'block',
              ...lineStyle,
            }}
            className={lineClassName}
          >
            <motion.div
              custom={i}
              variants={lineVariants}
              initial="hidden"
              animate={shouldAnimate ? 'visible' : 'hidden'}
            >
              {line}
            </motion.div>
          </div>
        ))}
      </div>
    )
  }

  // Single-block reveal
  return (
    <div ref={ref} style={{ overflow: 'hidden', display: 'block', ...style }} className={className}>
      <motion.div
        custom={0}
        variants={lineVariants}
        initial="hidden"
        animate={shouldAnimate ? 'visible' : 'hidden'}
      >
        {children}
      </motion.div>
    </div>
  )
}
