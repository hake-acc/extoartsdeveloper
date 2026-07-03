'use client'

// Inspired by motion-primitives (ibelick/motion-primitives)
// Scroll-triggered reveal wrapper using Framer Motion

import { useRef } from 'react'
import { motion, useInView, type Variants } from 'framer-motion'
import { cn } from '@/lib/utils'

interface InViewProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  variants?: Variants
  transition?: object
  viewOptions?: {
    once?: boolean
    amount?: number | 'some' | 'all'
  }
  as?: 'div' | 'section' | 'article' | 'aside' | 'span'
}

const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1 },
}

export function InView({
  children,
  className,
  style,
  variants = defaultVariants,
  transition = { duration: 0.5, ease: 'easeOut' },
  viewOptions = { once: true, amount: 0.15 },
  as = 'div',
}: InViewProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, viewOptions)

  const tags = {
    div: motion.div,
    section: motion.section,
    article: motion.article,
    aside: motion.aside,
    span: motion.span,
  }
  const MotionTag = tags[as]

  return (
    <MotionTag
      ref={ref as React.RefObject<HTMLDivElement & HTMLElement>}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variants}
      transition={transition}
      className={cn(className)}
      style={style}
    >
      {children}
    </MotionTag>
  )
}
