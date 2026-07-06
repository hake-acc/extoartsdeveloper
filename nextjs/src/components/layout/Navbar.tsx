'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { NAV_LINKS } from '@/lib/constants'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const pathname = usePathname()

  // Sync theme state on mount
  useEffect(() => {
    const stored = localStorage.getItem('ea-theme')
    if (stored === 'light') {
      setTheme('light')
    } else if (stored === 'dark') {
      setTheme('dark')
    } else {
      const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches
      setTheme(prefersLight ? 'light' : 'dark')
    }
  }, [])

  // Listen to scroll to apply backdrop blur
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile drawer on path changes
  useEffect(() => { setMobileOpen(false) }, [pathname])

  // Prevent scroll when mobile menu is open
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
      if (m) {
        m.classList.add('open')
        document.body.style.overflow = 'hidden'
      }
    }
  }

  // Filter out Home from links, as requested
  const links = NAV_LINKS.filter((link) => link.href !== '/')

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
          padding: scrolled ? '12px min(40px, 6%)' : '24px min(40px, 6%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: scrolled ? 'var(--nav-bg)' : 'transparent',
          backdropFilter: scrolled ? 'var(--glass-blur)' : 'none',
          WebkitBackdropFilter: scrolled ? 'var(--glass-blur)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
          boxShadow: scrolled ? '0 4px 30px rgba(0, 0, 0, 0.15)' : 'none',
          transition: 'padding 0.3s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s, border-color 0.3s, box-shadow 0.3s',
        }}
      >
        {/* Left Side: Logo */}
        <Link
          href="/"
          aria-label="ExtoArts home"
          style={{
            textDecoration: 'none',
            outline: 'none',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 400,
              fontSize: '1.9rem',
              letterSpacing: '-1.5px',
              color: 'var(--text-main)',
              transition: 'color 0.25s ease-in-out',
            }}
          >
            ExtoArts
          </span>
        </Link>

        {/* Center: Desktop Links */}
        <div
          className="nav-links"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {links.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link-item"
                aria-current={isActive ? 'page' : undefined}
                style={{
                  position: 'relative',
                  padding: '8px 16px',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                  textDecoration: 'none',
                  transition: 'color 0.25s ease-in-out',
                  fontFamily: 'var(--font-body)',
                  letterSpacing: '-0.01em',
                }}
              >
                {link.label}
                {/* Active Underline */}
                {isActive && (
                  <motion.span
                    layoutId="activeNavUnderline"
                    className="absolute bottom-0 left-4 right-4 h-[2px]"
                    style={{
                      background: 'var(--primary-accent)',
                      boxShadow: '0 0 8px var(--primary-accent)',
                      borderRadius: '99px',
                    }}
                    aria-hidden="true"
                  />
                )}
              </Link>
            )
          })}
        </div>

        {/* Right Side: Theme Toggle + CTA */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          {/* Theme Toggle */}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              fontSize: '1rem',
              transition: 'border-color 0.25s, color 0.25s, background-color 0.25s',
              outline: 'none',
            }}
          >
            <motion.span
              key={theme}
              initial={{ rotate: -45, opacity: 0, scale: 0.8 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <i className={`ti ti-${theme === 'dark' ? 'sun' : 'moon'}`} aria-hidden="true" />
            </motion.span>
          </button>

          {/* CTA: Brush Button */}
          <button
            onClick={openDiscordModal}
            className="btn nav-cta"
            aria-label="Start a project on Discord"
          >
            <i className="ti ti-brand-discord" aria-hidden="true" style={{ fontSize: '1.2em' }} />
            Get a Quote
          </button>

          {/* Hamburger (Mobile Toggle) */}
          <button
            className="hamburger"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={mobileOpen}
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              fontSize: '1.1rem',
              transition: 'border-color 0.25s, background-color 0.25s',
              outline: 'none',
            }}
          >
            <i className={`ti ti-${mobileOpen ? 'x' : 'menu-2'}`} aria-hidden="true" />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
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
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
              aria-hidden="true"
            />

            {/* Drawer Panel */}
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
                width: 'min(340px, 85vw)',
                zIndex: 10000,
                background: 'var(--surface)',
                borderLeft: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
                boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.35)',
              }}
              role="dialog"
              aria-label="Mobile navigation"
              aria-modal="true"
            >
              {/* Drawer Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '24px 24px',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <Link href="/" style={{ textDecoration: 'none' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--text-main)' }}>ExtoArts</span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    width: '34px',
                    height: '34px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    fontSize: '1rem',
                  }}
                >
                  <i className="ti ti-x" aria-hidden="true" />
                </button>
              </div>

              {/* Drawer Nav links */}
              <nav style={{ padding: '24px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {links.map((link) => {
                  const isActive = pathname === link.href
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={isActive ? 'page' : undefined}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        fontSize: '0.95rem',
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                        textDecoration: 'none',
                        background: isActive ? 'rgba(124, 58, 237, 0.08)' : 'transparent',
                        transition: 'background-color 0.25s, color 0.25s',
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      {isActive && (
                        <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--primary-accent)', boxShadow: '0 0 8px var(--primary-accent)' }} />
                      )}
                      {link.label}
                    </Link>
                  )
                })}
              </nav>

              {/* Drawer Footer Actions */}
              <div style={{ padding: '24px 20px 48px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button
                  onClick={() => { openDiscordModal(); setMobileOpen(false) }}
                  className="btn nav-cta"
                  style={{ width: '100%', padding: '14px 24px', justifyContent: 'center' }}
                >
                  <i className="ti ti-brand-discord" aria-hidden="true" style={{ fontSize: '1.2em' }} />
                  Get a Quote
                </button>
                <button
                  onClick={toggleTheme}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-body)',
                    width: '100%',
                    transition: 'border-color 0.25s, color 0.25s',
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
        @media (min-width: 860px) {
          .nav-link-item { display: block !important; }
          .hamburger { display: none !important; }
        }
        @media (max-width: 859px) {
          .nav-links { display: none !important; }
        }
        .nav-link-item::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 16px;
          right: 16px;
          height: 2px;
          background-color: var(--primary-accent);
          transform: scaleX(0);
          transform-origin: bottom right;
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          border-radius: 99px;
          box-shadow: 0 0 8px var(--primary-accent);
        }
        .nav-link-item:hover::after {
          transform: scaleX(1);
          transform-origin: bottom left;
        }
        .nav-link-item:hover {
          color: var(--text-main) !important;
        }
        .theme-toggle:hover {
          border-color: var(--border-hover) !important;
          color: var(--text-main) !important;
          background-color: rgba(124, 58, 237, 0.05) !important;
        }
        .hamburger:hover {
          border-color: var(--border-hover) !important;
          background-color: rgba(124, 58, 237, 0.05) !important;
        }
      `}</style>
    </>
  )
}
