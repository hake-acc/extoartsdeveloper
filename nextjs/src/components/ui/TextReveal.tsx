'use client'

import { createElement, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface TextRevealProps {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  className?: string
  delay?: number
}

export function TextReveal({ text, as = 'span', className, delay = 0 }: TextRevealProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => el.classList.add('in'), delay)
            io.unobserve(el)
          }
        })
      },
      { threshold: 0.3 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [delay])

  const words = text.split(' ')

  return createElement(
    as,
    { ref, className: cn('word-reveal', className) },
    words.map((word, i) => (
      <span
        key={i}
        className="word"
        style={{ transitionDelay: `${i * 55}ms`, animationDelay: `${i * 55}ms` }}
      >
        {word}
        {i < words.length - 1 ? '\u00A0' : ''}
      </span>
    ))
  )
}
