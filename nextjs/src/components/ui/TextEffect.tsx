'use client'

// Inspired by motion-primitives (ibelick/motion-primitives)
// Word and character level text animations

import { motion, useInView, type Variants } from 'framer-motion'
import { useRef } from 'react'
import { cn } from '@/lib/utils'

type SegmentType = 'word' | 'char'

interface TextEffectProps {
  children: string
  className?: string
  segmentType?: SegmentType
  preset?: 'blur' | 'slide-up' | 'fade' | 'scale'
  delay?: number
  staggerDelay?: number
  duration?: number
  as?: keyof React.JSX.IntrinsicElements
  trigger?: boolean // manual trigger; defaults to inView
  once?: boolean
}

const PRESETS: Record<string, { container: Variants; segment: Variants }> = {
  blur: {
    container: { hidden: {}, visible: { transition: { staggerChildren: 0.04 } } },
    segment: {
      hidden: { opacity: 0, filter: 'blur(8px)', y: 12 },
      visible: { opacity: 1, filter: 'blur(0px)', y: 0 },
    },
  },
  'slide-up': {
    container: { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } },
    segment: {
      hidden: { opacity: 0, y: 24 },
      visible: { opacity: 1, y: 0 },
    },
  },
  fade: {
    container: { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } },
    segment: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
  },
  scale: {
    container: { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } },
    segment: {
      hidden: { opacity: 0, scale: 0.8, y: 16 },
      visible: { opacity: 1, scale: 1, y: 0 },
    },
  },
}

export function TextEffect({
  children,
  className,
  segmentType = 'word',
  preset = 'blur',
  delay = 0,
  staggerDelay,
  duration = 0.6,
  as = 'p',
  trigger,
  once = true,
}: TextEffectProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref as React.RefObject<Element>, { once, margin: '0px 0px -40px 0px' })
  const isVisible = trigger !== undefined ? trigger : inView

  const { container, segment } = PRESETS[preset]
  const Tag = motion[as as keyof typeof motion] as typeof motion.p

  const containerVariants: Variants = {
    ...container,
    visible: {
      ...(container.visible as object),
      transition: {
        staggerChildren: staggerDelay ?? (segmentType === 'char' ? 0.03 : 0.06),
        delayChildren: delay,
      },
    },
  }

  const segments =
    segmentType === 'word'
      ? children.split(/(\s+)/)
      : children.split('')

  return (
    <Tag
      ref={ref as React.RefObject<HTMLParagraphElement>}
      className={cn('inline', className)}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={containerVariants}
      aria-label={children}
    >
      {segments.map((segment_text, i) => {
        const isSpace = /^\s+$/.test(segment_text)
        if (isSpace) return <span key={i}>{segment_text}</span>
        return (
          <motion.span
            key={i}
            className="inline-block"
            variants={segment}
            transition={{ duration, ease: [0.22, 0.61, 0.36, 1] }}
          >
            {segment_text}
          </motion.span>
        )
      })}
    </Tag>
  )
}
