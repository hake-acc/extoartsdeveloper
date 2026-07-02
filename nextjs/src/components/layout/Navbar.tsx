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
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

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
          padding: scrolled ? '12px min(28px, 4%)' : '20px min(28px, 4%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: scrolled ? 'var(--nav-bg)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
          transition: 'padding 0.35s var(--easing), background 0.35s, border-color 0.35s, backdrop-filter 0.35s',
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
          }}
        >
          <img
            src="/favicon-192.png"
            width={34}
            height={34}
            alt="ExtoArts logo"
            style={{ borderRadius: 8 }}
          />
          <span
            style={{
              fontWeight: 900,
              fontSize: '1.08rem',
              letterSpacing: '-0.3px',
              color: 'var(--text-main)',
              fontFamily: 'var(--font-display)',
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
            gap: 4,
            listStyle: 'none',
          }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontSize: '0.72rem',
                letterSpacing: '0.9px',
                padding: '7px 14px',
                borderRadius: 999,
                textDecoration: 'none',
                color: pathname === link.href ? 'var(--text-main)' : 'var(--text-muted)',
                fontWeight: pathname === link.href ? 700 : 500,
                background: pathname === link.href ? 'rgba(255,255,255,0.06)' : 'transparent',
                transition: 'color 0.2s, background 0.2s',
                display: 'none',
              }}
              className="nav-link-item"
              aria-current={pathname === link.href ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{
              background: 'none',
              border: '1px solid var(--border)',
              borderRadius: 999,
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              transition: 'border-color 0.2s, color 0.2s',
              fontSize: '1rem',
            }}
          >
            <i className={`ti ti-${theme === 'dark' ? 'sun' : 'moon'}`} aria-hidden="true" />
          </button>

          {/* Discord CTA */}
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                const m = document.getElementById('discordModal')
                if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden' }
              }
            }}
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
              background: 'none',
              border: '1px solid var(--border)',
              borderRadius: 999,
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              fontSize: '1.1rem',
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
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setMobileOpen(false) }}
        >
          <div
            style={{
              width: 'min(320px, 88vw)',
              background: 'var(--surface)',
              borderLeft: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              padding: '20px',
              overflowY: 'auto',
            }}
          >
            {/* Mobile header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
              <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                <img src="/favicon-192.png" width={30} height={30} alt="ExtoArts" style={{ borderRadius: 7 }} />
                <span style={{ fontWeight: 900, fontSize: '1rem', color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>ExtoArts</span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 999, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1rem' }}
              >
                <i className="ti ti-x" aria-hidden="true" />
              </button>
            </div>

            {/* Nav links */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    padding: '13px 16px',
                    borderRadius: 14,
                    textDecoration: 'none',
                    color: pathname === link.href ? 'var(--primary)' : 'var(--text-main)',
                    fontWeight: pathname === link.href ? 700 : 500,
                    background: pathname === link.href ? 'rgba(34,211,238,0.07)' : 'transparent',
                    fontSize: '0.97rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    transition: 'background 0.2s, color 0.2s',
                    borderLeft: pathname === link.href ? '2px solid var(--primary)' : '2px solid transparent',
                  }}
                  aria-current={pathname === link.href ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contact"
                style={{ padding: '13px 16px', borderRadius: 14, textDecoration: 'none', color: 'var(--text-main)', fontWeight: 500, fontSize: '0.97rem', display: 'flex', alignItems: 'center', gap: 10, transition: 'background 0.2s, color 0.2s', borderLeft: '2px solid transparent' }}
              >
                Contact
              </Link>
            </nav>

            {/* Mobile footer */}
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <a
                href="https://discord.gg/extoarts-1402333030827425922"
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{ background: '#5865f2', color: '#fff', borderRadius: 14, justifyContent: 'center', width: '100%' }}
              >
                <i className="ti ti-brand-discord" aria-hidden="true" /> Join Discord
              </a>
              <button
                onClick={toggleTheme}
                style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 14, padding: '11px 16px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.88rem', fontFamily: 'var(--font-body)' }}
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
      `}</style>
    </>
  )
}
