'use client'

// Glare-on-hover card effect
// Inspired by Aceternity UI (aceternity/ui) - CardSpotlight / GlareCard pattern

import { useRef, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface GlareCardProps {
  children: React.ReactNode
  className?: string
  glareOpacity?: number
  tilt?: boolean
  maxTilt?: number
}

export function GlareCard({
  children,
  className,
  glareOpacity = 0.12,
  tilt = true,
  maxTilt = 8,
}: GlareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 })
  const [transform, setTransform] = useState({ rotX: 0, rotY: 0 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setGlare({ x, y, opacity: glareOpacity })

    if (tilt) {
      const rotY = ((e.clientX - rect.left - rect.width / 2) / rect.width) * maxTilt
      const rotX = -((e.clientY - rect.top - rect.height / 2) / rect.height) * maxTilt
      setTransform({ rotX, rotY })
    }
  }, [glareOpacity, tilt, maxTilt])

  const handleMouseLeave = useCallback(() => {
    setGlare(g => ({ ...g, opacity: 0 }))
    setTransform({ rotX: 0, rotY: 0 })
  }, [])

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn('relative overflow-hidden', className)}
      style={{
        transform: tilt
          ? `perspective(800px) rotateX(${transform.rotX}deg) rotateY(${transform.rotY}deg)`
          : undefined,
        transition: 'transform 0.15s ease-out',
        willChange: 'transform',
      }}
    >
      {children}
      {/* Glare overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity}), transparent 65%)`,
          transition: 'opacity 0.2s',
          mixBlendMode: 'screen',
        }}
      />
    </div>
  )
}
