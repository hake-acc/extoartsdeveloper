// Server Component — CSS offset-path animation replaces Framer Motion (no client JS needed)
// @keyframes borderBeam is defined in globals.css

import { cn } from '@/lib/utils'

interface BorderBeamProps {
  size?: number
  duration?: number
  delay?: number
  colorFrom?: string
  colorTo?: string
  className?: string
  style?: React.CSSProperties
  reverse?: boolean
  initialOffset?: number
  borderWidth?: number
}

export function BorderBeam({
  className,
  size = 120,
  delay = 0,
  duration = 8,
  colorFrom = '#69ddff',
  colorTo = '#dbbadd',
  style,
  reverse = false,
  initialOffset = 0,
  borderWidth = 1,
}: BorderBeamProps) {
  // Negative animation-delay starts the beam partway through its cycle,
  // equivalent to Framer Motion's delay: -delay behaviour
  const animDelay = -(delay + (initialOffset / 100) * duration)

  return (
    <div
      className="pointer-events-none absolute inset-0 rounded-[inherit]"
      style={{
        border: `${borderWidth}px solid transparent`,
        WebkitMaskImage: 'linear-gradient(#000, #000), linear-gradient(#000, #000)',
        maskImage: 'linear-gradient(#000, #000), linear-gradient(#000, #000)',
        WebkitMaskClip: 'padding-box, border-box',
        maskClip: 'padding-box, border-box',
        WebkitMaskComposite: 'xor',
        maskComposite: 'exclude',
      } as React.CSSProperties}
    >
      <div
        className={cn('absolute aspect-square', className)}
        style={{
          width: size,
          background: `linear-gradient(to left, ${colorFrom}, ${colorTo}, transparent)`,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          animation: `borderBeam ${duration}s linear ${animDelay}s infinite`,
          animationDirection: reverse ? 'reverse' : 'normal',
          ...style,
        } as React.CSSProperties}
      />
    </div>
  )
}
