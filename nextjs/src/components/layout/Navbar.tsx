'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_LINKS, DISCORD_URL } from '@/lib/constants'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const pathname = usePathname()
  const navRef = useRef<HTMLElement>(null)

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
        ref={navRef}
        className="site-nav"
        aria-label="Main navigation"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          padding: scrolled ? '10px min(28px, 4%)' : '18px min(28px, 4%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: scrolled ? 'var(--nav-bg)' : 'transparent',
          backdropFilter: scrolled ? 'blur(28px) saturate(200%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(28px) saturate(200%)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
          boxShadow: scrolled ? '0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 32px rgba(0,0,0,0.24)' : 'none',
          transition: 'padding 0.35s var(--easing), background 0.35s, border-color 0.35s, box-shadow 0.35s',
          viewTransitionName: 'site-nav',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="logo"
          aria-label="ExtoArts home"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            viewTransitionName: 'site-logo',
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
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: '0.72rem',
                  letterSpacing: '0.6px',
                  padding: '7px 14px',
                  borderRadius: 999,
                  textDecoration: 'none',
                  color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                  fontWeight: isActive ? 700 : 500,
                  background: isActive ? 'rgba(255,255,255,0.07)' : 'transparent',
                  border: isActive ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
                  transition: 'color 0.2s, background 0.2s, border-color 0.2s',
                  display: 'none',
                }}
                className="nav-link-item"
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* Right controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: 999,
              width: 34,
              height: 34,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              transition: 'border-color 0.2s, color 0.2s, background 0.2s',
              fontSize: '0.95rem',
            }}
          >
            <i className={`ti ti-${theme === 'dark' ? 'sun' : 'moon'}`} aria-hidden="true" />
          </button>

          {/* Discord CTA */}
          <button
            onClick={openDiscordModal}
            className="btn nav-cta"
            aria-label="Start a project on Discord"
            style={{ borderRadius: 999 }}
          >
            Start a Project
          </button>

          {/* Hamburger */}
          <button
            className="hamburger"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: 999,
              width: 34,
              height: 34,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              fontSize: '1rem',
              transition: 'border-color 0.2s, background 0.2s',
            }}
          >
            <i className="ti ti-menu-2" aria-hidden="true" />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            display: 'flex',
            justifyContent: 'flex-end',
            animation: 'fadeIn 0.2s ease',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setMobileOpen(false) }}
        >
          <div
            style={{
              width: 'min(300px, 86vw)',
              background: 'var(--surface)',
              borderLeft: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              padding: '20px',
              overflowY: 'auto',
              boxShadow: '-24px 0 80px rgba(0,0,0,0.5)',
              animation: 'mobileMenuSlideIn 0.3s var(--ease-spring)',
            }}
          >
            {/* Mobile header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
              <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                <img src="/favicon-192.png" width={28} height={28} alt="ExtoArts" style={{ borderRadius: 7 }} />
                <span style={{ fontWeight: 900, fontSize: '0.98rem', color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>ExtoArts</span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  borderRadius: 999,
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  fontSize: '0.9rem',
                }}
              >
                <i className="ti ti-x" aria-hidden="true" />
              </button>
            </div>

            {/* Nav links */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
              {[...NAV_LINKS, { href: '/contact', label: 'Contact' }].map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 12,
                      textDecoration: 'none',
                      color: isActive ? 'var(--primary)' : 'var(--text-main)',
                      fontWeight: isActive ? 700 : 500,
                      background: isActive ? 'rgba(34,211,238,0.06)' : 'transparent',
                      fontSize: '0.93rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      transition: 'background 0.2s, color 0.2s',
                      borderLeft: isActive ? '2px solid var(--primary)' : '2px solid transparent',
                    }}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            {/* Mobile footer */}
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a
                href={DISCORD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{
                  background: '#5865f2',
                  color: '#fff',
                  borderRadius: 12,
                  justifyContent: 'center',
                  width: '100%',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  boxShadow: '0 4px 16px rgba(88,101,242,0.28)',
                }}
              >
                <i className="ti ti-brand-discord" aria-hidden="true" /> Join Discord
              </a>
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
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 820px) {
          .nav-link-item { display: block !important; }
          .hamburger { display: none !important; }
        }
        @media (max-width: 819px) {
          .nav-links { display: none !important; }
        }
        .nav-link-item:hover {
          color: var(--text-main) !important;
          background: rgba(255,255,255,0.05) !important;
        }
        .theme-toggle:hover {
          border-color: var(--border-hover) !important;
          color: var(--text-main) !important;
          background: rgba(255,255,255,0.04) !important;
        }
        .hamburger:hover {
          border-color: var(--border-hover) !important;
          background: rgba(255,255,255,0.04) !important;
        }
      `}</style>
    </>
  )
}
