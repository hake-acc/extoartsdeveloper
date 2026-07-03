'use client'

import { useEffect } from 'react'
import { GA_ID } from '@/lib/constants'

export function ClientScripts() {
  useEffect(() => {
    // Google Analytics — inject after mount
    if (GA_ID && !document.getElementById('ea-ga-script')) {
      const w = window as unknown as Record<string, unknown>
      w.dataLayer = (w.dataLayer as unknown[]) || []
      const gtag = (...args: unknown[]) => { (w.dataLayer as unknown[]).push(args) }
      gtag('js', new Date())
      gtag('config', GA_ID)
      const s = document.createElement('script')
      s.id = 'ea-ga-script'
      s.async = true
      s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
      document.head.appendChild(s)
    }

    // Progress bar
    const bar = document.getElementById('page-progress')
    if (bar) {
      let ticking = false
      function upd() {
        const s = document.documentElement
        const p = s.scrollTop / (s.scrollHeight - s.clientHeight) || 0
        bar!.style.transform = `scaleX(${p})`
        ticking = false
      }
      window.addEventListener('scroll', () => {
        if (!ticking) { requestAnimationFrame(upd); ticking = true }
      }, { passive: true })
    }

    // Scroll reveal
    const srEls = document.querySelectorAll<HTMLElement>('.sr')
    if (srEls.length) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in-view')
            io.unobserve(e.target)
          }
        })
      }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' })
      srEls.forEach((el) => io.observe(el))
    }

    // Card ring injection
    const sel = '.tilt-card, .stat-item, .rev-card, .price-card'
    document.querySelectorAll<HTMLElement>(sel).forEach((card) => {
      if (card.querySelector('.ea-card-ring')) return
      const ring = document.createElement('span')
      ring.className = 'ea-card-ring'
      ring.setAttribute('aria-hidden', 'true')
      card.appendChild(ring)
    })
    document.querySelectorAll<HTMLElement>('.price-card.featured').forEach((card) => {
      const r = card.querySelector('.ea-card-ring')
      if (r) r.classList.add('ea-ring-always')
    })

    // Discord modal helpers — exposed globally for inline button use
    function openModal(id: string) {
      const m = document.getElementById(id)
      if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden' }
    }
    function closeModal(id: string) {
      const m = document.getElementById(id)
      if (m) { m.classList.remove('open'); document.body.style.overflow = '' }
    }
    // Attach to window so vanilla-JS inline scripts can call openModal('discordModal')
    ;(window as unknown as Record<string, unknown>).openModal = openModal;
    ;(window as unknown as Record<string, unknown>).closeModal = closeModal

    // Keyboard close
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') closeModal('discordModal')
    }
    document.addEventListener('keydown', handleKeyDown)

    // Count-up
    const countEls = document.querySelectorAll<HTMLElement>('[data-count-up]')
    if (countEls.length) {
      const cio = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          const el = e.target as HTMLElement
          const target = parseFloat(el.dataset.target ?? '0')
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
    }

    // Note: hero phrase cycling is handled by HeroSection's CycleStack component
    // (React state + useEffect with proper cleanup) — no DOM-based interval here.

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return null
}
