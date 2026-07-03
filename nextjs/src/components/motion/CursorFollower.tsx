'use client'

import { useEffect, useRef } from 'react'

export function CursorFollower() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let ringX = 0
    let ringY = 0
    let mouseX = 0
    let mouseY = 0
    let raf = 0

    function onMove(e: MouseEvent) {
      mouseX = e.clientX
      mouseY = e.clientY
      dot!.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`
    }

    function tick() {
      ringX += (mouseX - ringX) * 0.15
      ringY += (mouseY - ringY) * 0.15
      ring!.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(tick)
    }

    function onEnter(e: Event) {
      const target = e.target as HTMLElement
      if (target.closest('a, button, [role="button"]')) {
        ring!.style.width = '48px'
        ring!.style.height = '48px'
        ring!.style.borderColor = 'var(--primary)'
        dot!.style.opacity = '0'
      }
    }
    function onLeave(e: Event) {
      const target = e.target as HTMLElement
      if (target.closest('a, button, [role="button"]')) {
        ring!.style.width = '30px'
        ring!.style.height = '30px'
        ring!.style.borderColor = 'rgba(105,221,255,0.3)'
        dot!.style.opacity = '1'
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onEnter)
    document.addEventListener('mouseout', onLeave)
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onEnter)
      document.removeEventListener('mouseout', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  )
}
