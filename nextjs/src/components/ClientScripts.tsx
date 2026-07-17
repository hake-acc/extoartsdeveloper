'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { GA_ID } from '@/lib/constants'

export function ClientScripts() {
  const pathname = usePathname()

  // One-time setup: GA init, progress bar, modal helpers.
  // gtag.js is loaded via <Script strategy="afterInteractive"> in layout.tsx;
  // this useEffect sets up the dataLayer queue so events fired before the
  // script loads are batched and replayed when it arrives.
  useEffect(() => {
    if (GA_ID) {
      const w = window as unknown as Record<string, unknown>
      w.dataLayer = (w.dataLayer as unknown[]) || []
      const gtag = (...args: unknown[]) => { (w.dataLayer as unknown[]).push(args) }
      ;(w as Record<string, unknown>).gtag = gtag
      gtag('js', new Date())
      gtag('config', GA_ID)
    }

    // Progress arrow — store handler refs so we can clean them up on unmount
    let scrollHandler: (() => void) | null = null
    let resizeHandler: (() => void) | null = null

    const arrow = document.getElementById('page-progress-arrow')
    if (arrow) {
      let ticking = false
      function upd() {
        const s = document.documentElement
        const p = s.scrollTop / (s.scrollHeight - s.clientHeight) || 0
        const maxX = window.innerWidth - 84 // Fire (24px) + Brush (60px)
        arrow!.style.transform = `translate(${p * maxX}px, -50%)`
        ticking = false
      }
      scrollHandler = () => { if (!ticking) { requestAnimationFrame(upd); ticking = true } }
      resizeHandler = () => { if (!ticking) { requestAnimationFrame(upd); ticking = true } }
      window.addEventListener('scroll', scrollHandler, { passive: true })
      window.addEventListener('resize', resizeHandler, { passive: true })
    }

    // Discord modal helpers — exposed globally for inline button use
    function openModal(id: string) {
      const m = document.getElementById(id)
      if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden' }
    }
    function closeModal(id: string) {
      const m = document.getElementById(id)
      if (m) { m.classList.remove('open'); document.body.style.overflow = '' }
    }
    ;(window as unknown as Record<string, unknown>).openModal = openModal
    ;(window as unknown as Record<string, unknown>).closeModal = closeModal

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') closeModal('discordModal')
    }
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      // Remove all listeners registered in this effect — prevents accumulation across HMR cycles
      if (scrollHandler) window.removeEventListener('scroll', scrollHandler)
      if (resizeHandler) window.removeEventListener('resize', resizeHandler)
      document.removeEventListener('keydown', handleKeyDown)
      // Clean up global modal helpers to avoid stale closures on remount
      const w = window as unknown as Record<string, unknown>
      delete w.openModal
      delete w.closeModal
    }
  }, [])

  // Re-run on every route change: scroll reveal + card rings + count-up
  useEffect(() => {
    // Scroll reveal — observe all .sr elements that haven't been revealed yet
    const srEls = document.querySelectorAll<HTMLElement>('.sr:not(.in-view)')
    if (srEls.length) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in-view')
            io.unobserve(e.target)
          }
        })
      }, { threshold: 0.06, rootMargin: '0px 0px -20px 0px' })
      srEls.forEach((el) => io.observe(el))
      return () => io.disconnect()
    }
  }, [pathname])

  // Count-up — re-run on route change
  useEffect(() => {
    const countEls = document.querySelectorAll<HTMLElement>('[data-count-up]')
    if (!countEls.length) return

    // Respect prefers-reduced-motion: snap to final value instantly
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      countEls.forEach((el) => {
        const target = parseFloat(el.dataset.countUp ?? '0')
        const suffix = el.dataset.suffix ?? ''
        const prefix = el.dataset.prefix ?? ''
        const dec = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0
        el.textContent = prefix + (dec ? target.toFixed(dec) : Math.round(target)) + suffix
      })
      return
    }

    const cio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return
        const el = e.target as HTMLElement
        const target = parseFloat(el.dataset.countUp ?? '0')
        const suffix = el.dataset.suffix ?? ''
        const prefix = el.dataset.prefix ?? ''
        const dec = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0
        const dur = 1800
        const start = performance.now()
        function tick(now: number) {
          const p = Math.min((now - start) / dur, 1)
          const ease = 1 - Math.pow(1 - p, 3)
          const val = target * ease
          el.textContent = prefix + (dec ? val.toFixed(dec) : Math.round(val)) + suffix
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
        cio.unobserve(el)
      })
    }, { threshold: 0.5 })
    countEls.forEach((el) => cio.observe(el))
    return () => cio.disconnect()
  }, [pathname])

  return null
}
