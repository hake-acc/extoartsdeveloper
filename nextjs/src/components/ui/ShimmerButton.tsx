'use client'

// Shimmer button - inspired by Magic UI
// https://github.com/magicuidesign/magicui

import { cn } from '@/lib/utils'

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string
  background?: string
  borderRadius?: string
  children: React.ReactNode
  className?: string
  href?: string
  target?: string
  rel?: string
}

export function ShimmerButton({
  shimmerColor = 'rgba(255,255,255,0.15)',
  background = 'var(--primary)',
  borderRadius = '999px',
  children,
  className,
  href,
  target,
  rel,
  ...props
}: ShimmerButtonProps) {
  const inner = (
    <span
      className={cn(
        'relative inline-flex items-center gap-2 overflow-hidden px-7 py-3.5',
        'text-sm font-bold text-black',
        className,
      )}
      style={{ borderRadius, background }}
    >
      {/* Shimmer sweep */}
      <span
        aria-hidden="true"
        className="shimmer-sweep pointer-events-none absolute inset-0"
        style={{ borderRadius }}
      />
      {children}
    </span>
  )

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className="inline-block" style={{ textDecoration: 'none' }}>
        {inner}
      </a>
    )
  }

  return (
    <button {...props} className="inline-block border-0 bg-transparent p-0 cursor-pointer">
      {inner}
    </button>
  )
}
