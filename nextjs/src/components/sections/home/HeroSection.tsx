'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { DISCORD_URL } from '@/lib/constants'

const HERO_PHRASES = [
  'Video Editing',
  'Thumbnail Design',
  'Shorts Editing',
  'Channel Growth',
  'Motion Graphics',
]

const TICKER_ITEMS = [
  { icon: 'ti-brand-youtube', text: 'YouTube Editing' },
  { icon: 'ti-photo', text: 'Thumbnail Design' },
  { icon: 'ti-device-mobile-vibration', text: 'Shorts & TikTok' },
  { icon: 'ti-chart-line', text: 'Channel Automation' },
  { icon: 'ti-sparkles', text: 'Motion Graphics' },
  { icon: 'ti-device-gamepad-2', text: 'Gaming Channels' },
  { icon: 'ti-eye', text: 'Faceless YouTube' },
  { icon: 'ti-trending-up', text: 'Retention Editing' },
]

export function HeroSection() {
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!titleRef.current) return
    const words = titleRef.current.querySelectorAll<HTMLElement>('.ea-word')
    words.forEach((w, i) => {
      setTimeout(() => w.classList.add('in'), i * 90)
    })
  }, [])

  return (
    <>
      {/* Hero */}
      <section
        className="hero"
        aria-label="Hero"
        style={{
          paddingTop: 'min(22svh, 22vh)',
          paddingBottom: '8vh',
          paddingLeft: '20px',
          paddingRight: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Badge */}
        <div
          className="hero-badge sr"
          style={{ marginBottom: 32 }}
          aria-label="ExtoArts agency badge"
        >
          <span className="hero-badge-dot" aria-hidden="true" />
          <span>YouTube-Focused Creative Agency</span>
          <span aria-hidden="true" style={{ color: 'var(--text-muted)', opacity: 0.5 }}>|</span>
          <span style={{ color: 'var(--text-muted)' }}>Since 2024</span>
        </div>

        {/* Title */}
        <h1
          ref={titleRef}
          className="hero-title"
          style={{ marginBottom: 28 }}
        >
          <span>
            <span className="ea-word">Elite</span>{' '}
            <span className="ea-word">Creative</span>{' '}
            <span className="ea-word">Services</span>{' '}
            <span className="ea-word">for</span>
          </span>
          <span className="line-accent sweep-text" style={{ display: 'block', letterSpacing: '-3px' }}>
            <span className="cycle-stack" aria-live="polite">
              {HERO_PHRASES.map((phrase, i) => (
                <span key={phrase} className={`cycle-phrase${i === 0 ? ' is-active' : ''}`}>
                  {phrase}
                </span>
              ))}
            </span>
          </span>
        </h1>

        {/* Description */}
        <p
          className="hero-desc"
          style={{
            fontSize: 'clamp(1rem,1.8vw,1.2rem)',
            color: 'var(--text-muted)',
            maxWidth: 540,
            lineHeight: 1.75,
            fontWeight: 400,
            marginBottom: 44,
          }}
        >
          ExtoArts is a YouTube agency where{' '}
          <strong style={{ color: 'var(--text-main)', fontWeight: 700 }}>90% of your budget</strong>{' '}
          goes directly to your specialist editor. Real editors. Real results. Flat 10% fee.
        </p>

        {/* CTA row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            className="galaxy-btn"
            onClick={() => {
              const m = document.getElementById('discordModal')
              if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden' }
            }}
            aria-label="Start your project on Discord"
          >
            <span className="gb-inner">
              <i className="ti ti-brand-discord" aria-hidden="true" /> Start a Project
            </span>
          </button>
          <Link href="/portfolio" className="btn btn-glass">
            <i className="ti ti-eye" aria-hidden="true" /> View Work
          </Link>
        </div>

        {/* Platform trust pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginTop: 22 }}>
          <span style={{ fontSize: '0.58rem', color: 'var(--text-muted)', letterSpacing: '0.9px', textTransform: 'uppercase', fontWeight: 700 }}>
            Trusted on
          </span>
          <a
            href="https://discord.gg/extoarts-1402333030827425922"
            target="_blank"
            rel="noopener noreferrer"
            className="hp-badge"
            style={{ background: 'rgba(88,101,242,0.07)', color: '#818cf8', borderColor: 'rgba(88,101,242,0.22)', fontSize: '0.64rem', fontWeight: 800, letterSpacing: '0.3px', padding: '5px 12px', borderRadius: 20, textDecoration: 'none', border: '1px solid', display: 'inline-flex', alignItems: 'center', gap: 5, transition: 'opacity 0.18s' }}
          >
            <i className="ti ti-brand-discord" aria-hidden="true" /> Discord
          </a>
          <a
            href="https://www.trustpilot.com/review/extoarts.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="hp-badge"
            style={{ background: 'rgba(0,182,122,0.06)', color: '#34d399', borderColor: 'rgba(0,182,122,0.22)', fontSize: '0.64rem', fontWeight: 800, letterSpacing: '0.3px', padding: '5px 12px', borderRadius: 20, textDecoration: 'none', border: '1px solid', display: 'inline-flex', alignItems: 'center', gap: 5, transition: 'opacity 0.18s' }}
          >
            <i className="ti ti-star-filled" aria-hidden="true" /> Trustpilot
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-indicator" aria-hidden="true">
          <div className="mouse-outline">
            <div className="mouse-wheel" />
          </div>
          <span style={{ fontSize: '0.6rem', letterSpacing: '2px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Scroll</span>
        </div>
      </section>

      {/* Capability ticker */}
      <div
        style={{ padding: '0 0 20px', overflow: 'hidden' }}
        aria-hidden="true"
      >
        <div
          className="marquee-track"
          style={{ '--duration': '28s' } as React.CSSProperties}
        >
          <div className="marquee-inner" style={{ gap: 10, alignItems: 'center' }}>
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span
                key={i}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '7px 18px',
                  border: '1px solid var(--border)',
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.025)',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  letterSpacing: '0.3px',
                  whiteSpace: 'nowrap',
                  marginRight: 10,
                }}
              >
                <i className={`ti ${item.icon}`} style={{ color: 'var(--primary)', fontSize: '0.82rem' }} aria-hidden="true" />
                {item.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
