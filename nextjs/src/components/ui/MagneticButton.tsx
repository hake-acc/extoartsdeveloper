'use client'

import { useRef } from 'react'
import type { ReactNode, MouseEvent as ReactMouseEvent } from 'react'
import { cn } from '@/lib/utils'

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  strength?: number
  as?: 'div' | 'span'
}

export function MagneticButton({ children, className, strength = 0.35, as = 'div' }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)

  function handleMouseMove(e: ReactMouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) * strength
    const y = (e.clientY - rect.top - rect.height / 2) * strength
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`
  }

  function handleMouseLeave() {
    const el = ref.current
    if (!el) return
    el.style.transform = 'translate3d(0,0,0)'
  }

  const Tag = as
  return (
    <Tag
      ref={ref as never}
      className={cn('magnetic-btn', className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </Tag>
  )
}
