'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { NAV_LINKS, DISCORD_URL } from '@/lib/constants'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const pathname = usePathname()

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('ea-theme') : null
    if (stored === 'light') setTheme('light')
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  // Escape closes drawer
  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    if (next === 'light') {
      document.documentElement.setAttribute('data-theme', 'light')
      localStorage.setItem('ea-theme', 'light')
    } else {
      document.documentElement.removeAttribute('data-theme')
      localStorage.setItem('ea-theme', 'dark')
    }
  }

  function openDiscordModal() {
    if (typeof window !== 'undefined') {
      const m = document.getElementById('discordModal')
      if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden' }
    }
  }

  return (
    <>
      <nav
        className="site-nav"
        aria-label="Main navigation"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          padding: scrolled ? '10px min(28px, 4%)' : '20px min(28px, 4%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: scrolled ? 'var(--nav-bg)' : 'transparent',
          backdropFilter: scrolled ? 'blur(28px) saturate(200%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(28px) saturate(200%)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
          boxShadow: scrolled ? '0 1px 0 rgba(255,255,255,0.03) inset, 0 8px 32px rgba(0,0,0,0.22)' : 'none',
          transition: 'padding 0.4s cubic-bezier(0.16,1,0.3,1), background 0.4s, border-color 0.4s, box-shadow 0.4s',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          aria-label="ExtoArts home"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <img
            src="/favicon-192.png"
            width={32}
            height={32}
            alt="ExtoArts logo"
            style={{ borderRadius: 8 }}
          />
          <span
            style={{
              fontWeight: 900,
              fontSize: '1.05rem',
              letterSpacing: '-0.4px',
              color: 'var(--text-main)',
              fontFamily: 'var(--font-display)',
              transition: 'color 0.2s',
            }}
          >
            ExtoArts
          </span>
        </Link>

        {/* Desktop nav links */}
        <div
          className="nav-links"
          style={{ display: 'flex', alignItems: 'center', gap: 2 }}
        >
          {NAV_LINKS.map((link) => {
            const isActive = link.href === '/' ? pathname === '/' : pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link-item"
                aria-current={isActive ? 'page' : undefined}
                style={{
                  position: 'relative',
                  padding: '8px 14px',
                  borderRadius: 12,
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                  textDecoration: 'none',
                  background: isActive ? 'rgba(255,255,255,0.06)' : 'transparent',
                  transition: 'color 0.2s, background 0.2s',
                  letterSpacing: '-0.01em',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                {link.label}
                {/* Active page indicator — glowing dot */}
                <span style={{
                  display: 'block',
                  width: isActive ? 16 : 0,
                  height: 2,
                  borderRadius: 999,
                  background: 'var(--primary)',
                  boxShadow: isActive ? '0 0 6px var(--primary)' : 'none',
                  transition: 'width 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s',
                  marginTop: 1,
                }} aria-hidden="true" />
              </Link>
            )
          })}
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {/* Theme toggle */}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: 12,
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              fontSize: '0.95rem',
              transition: 'border-color 0.2s, color 0.2s, background 0.2s',
            }}
          >
            <i className={`ti ti-${theme === 'dark' ? 'sun' : 'moon'}`} aria-hidden="true" />
          </button>

          {/* CTA */}
          <button
            onClick={openDiscordModal}
            className="btn nav-cta"
            aria-label="Start a project"
            style={{ borderRadius: 14 }}
          >
            <i className="ti ti-brand-discord" aria-hidden="true" />
            Start a Project
          </button>

          {/* Hamburger (mobile) */}
          <button
            className="hamburger"
            onClick={() => setMobileOpen(v => !v)}
            aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={mobileOpen}
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: 12,
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              fontSize: '1rem',
              transition: 'border-color 0.2s, background 0.2s',
            }}
          >
            <i className={`ti ti-${mobileOpen ? 'x' : 'menu-2'}`} aria-hidden="true" />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9990,
                background: 'rgba(0,0,0,0.55)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
              }}
              aria-hidden="true"
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer"
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: 'min(340px, 88vw)',
                zIndex: 10000,
                background: 'var(--surface)',
                borderLeft: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
                boxShadow: '-24px 0 64px rgba(0,0,0,0.4)',
              }}
              role="dialog"
              aria-label="Mobile navigation"
              aria-modal="true"
            >
              {/* Drawer header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '20px 24px',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
                  <Image src="/favicon-192.png" width={28} height={28} alt="ExtoArts" priority style={{ borderRadius: 7 }} />
                  <span style={{ fontWeight: 900, fontSize: '0.98rem', color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>ExtoArts</span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border)',
                    borderRadius: 10,
                    width: 34,
                    height: 34,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  <i className="ti ti-x" aria-hidden="true" />
                </button>
              </div>

              {/* Nav links */}
              <nav style={{ padding: '16px 16px', flex: 1 }}>
                {NAV_LINKS.map((link, i) => {
                  const isActive = pathname === link.href
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.04, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link
                        href={link.href}
                        aria-current={isActive ? 'page' : undefined}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          padding: '12px 14px',
                          borderRadius: 12,
                          fontSize: '0.9rem',
                          fontWeight: isActive ? 800 : 500,
                          color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                          textDecoration: 'none',
                          background: isActive ? 'rgba(255,255,255,0.06)' : 'transparent',
                          transition: 'background 0.2s, color 0.2s',
                          marginBottom: 4,
                        }}
                      >
                        {isActive && (
                          <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0, boxShadow: '0 0 8px var(--primary)' }} />
                        )}
                        {link.label}
                      </Link>
                    </motion.div>
                  )
                })}
              </nav>

              {/* Drawer footer */}
              <div style={{ padding: '16px 20px 32px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button
                  onClick={() => { openDiscordModal(); setMobileOpen(false) }}
                  className="btn btn-primary-glow"
                  style={{ width: '100%', justifyContent: 'center', borderRadius: 14 }}
                >
                  <i className="ti ti-brand-discord" aria-hidden="true" />
                  Start a Project
                </button>
                <button
                  onClick={toggleTheme}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    padding: '11px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                    fontFamily: 'var(--font-body)',
                    width: '100%',
                    transition: 'border-color 0.2s',
                  }}
                >
                  <i className={`ti ti-${theme === 'dark' ? 'sun' : 'moon'}`} aria-hidden="true" />
                  {theme === 'dark' ? 'Light mode' : 'Dark mode'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 820px) {
          .nav-link-item { display: block !important; }
          .hamburger { display: none !important; }
        }
        @media (max-width: 819px) {
          .nav-links { display: none !important; }
        }
        .nav-link-item:hover { color: var(--text-main) !important; background: rgba(255,255,255,0.05) !important; }
        .theme-toggle:hover { border-color: var(--border-hover) !important; color: var(--text-main) !important; }
        .hamburger:hover { border-color: var(--border-hover) !important; background: rgba(255,255,255,0.04) !important; }
      `}</style>
    </>
  )
}
