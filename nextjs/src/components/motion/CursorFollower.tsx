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
    let idleTimer = 0
    let rafRunning = false

    // Start the RAF loop only when mouse moves; stop it after 500ms of inactivity.
    // This means the loop is idle 100% of the time when the user isn't moving the mouse,
    // instead of burning a frame every 16ms forever.
    function startRaf() {
      if (rafRunning) return
      rafRunning = true
      raf = requestAnimationFrame(tick)
    }

    function stopRaf() {
      rafRunning = false
      cancelAnimationFrame(raf)
    }

    function scheduleIdle() {
      clearTimeout(idleTimer)
      idleTimer = window.setTimeout(stopRaf, 500)
    }

    function onMove(e: MouseEvent) {
      mouseX = e.clientX
      mouseY = e.clientY
      dot!.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`
      startRaf()
      scheduleIdle()
    }

    function tick() {
      ringX += (mouseX - ringX) * 0.15
      ringY += (mouseY - ringY) * 0.15
      ring!.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`
      if (rafRunning) raf = requestAnimationFrame(tick)
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
    // Do NOT start RAF here — wait for first mouse move

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onEnter)
      document.removeEventListener('mouseout', onLeave)
      clearTimeout(idleTimer)
      stopRaf()
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  )
}
