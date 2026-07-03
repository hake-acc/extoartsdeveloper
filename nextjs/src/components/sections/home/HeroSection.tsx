'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AuroraGL } from '@/components/ui/AuroraGL'
import { GalaxyButton } from '@/components/ui/GalaxyButton'
import { MagneticButton } from '@/components/ui/MagneticButton'

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
  { icon: 'ti-video', text: 'Cinematic Cuts' },
  { icon: 'ti-star-filled', text: '5-Star Rated' },
]

const E = [0.16, 1, 0.3, 1] as const
const fade = (delay = 0, y = 24) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: E },
})

function openDiscordModal() {
  if (typeof window === 'undefined') return
  const m = document.getElementById('discordModal')
  if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden' }
}

// ── Cycling headline phrase - React-managed with proper cleanup ────────────────
function CycleStack() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [exitIndex, setExitIndex] = useState<number | null>(null)

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % HERO_PHRASES.length
        setExitIndex(prev)
        // Clear exit class after transition
        setTimeout(() => setExitIndex(null), 400)
        return next
      })
    }, 2600)
    return () => clearInterval(id)
  }, [])

  return (
    <span
      className="cycle-stack"
      aria-live="polite"
      aria-atomic="true"
      style={{ letterSpacing: '-1.5px' }}
    >
      {HERO_PHRASES.map((phrase, i) => (
        <span
          key={phrase}
          className={[
            'cycle-phrase hero-accent-phrase',
            i === activeIndex ? 'is-active' : '',
            i === exitIndex ? 'is-exit' : '',
          ].filter(Boolean).join(' ')}
          aria-hidden={i !== activeIndex}
        >
          {phrase}
        </span>
      ))}
    </span>
  )
}

export function HeroSection() {
  return (
    <>
      <section
        className="hero"
        aria-label="Hero"
        style={{
          paddingTop: 'min(22svh, 22vh)',
          paddingBottom: '0',
          paddingLeft: '20px',
          paddingRight: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
          zIndex: 10,
          isolation: 'isolate',
        }}
      >
        {/* WebGL Aurora background - graceful CSS fallback if WebGL2 unavailable */}
        <AuroraGL
          colorStops={['#0d0320', '#69ddff', '#dbbadd']}
          amplitude={1.4}
          blend={0.52}
          speed={0.45}
          style={{
            zIndex: -1,
            opacity: 0.85,
            top: '-20%',
            height: '140%',
          }}
        />
        {/* CSS aurora fallback layer */}
        <div className="aurora-bg" aria-hidden="true">
          <div className="aurora-blob" />
        </div>

        {/* Agency badge */}
        <motion.div {...fade(0.05)} style={{ marginBottom: 32 }}>
          <span className="hero-badge" aria-label="YouTube-focused creative agency since 2024">
            <span className="hero-badge-dot" aria-hidden="true" />
            <span>YouTube-Focused Creative Agency</span>
            <span aria-hidden="true" style={{ color: 'var(--text-muted)', opacity: 0.35 }}>|</span>
            <span style={{ color: 'var(--text-muted)' }}>Since 2024</span>
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          {...fade(0.12)}
          className="hero-title"
          style={{ marginBottom: 24 }}
        >
          <span
            className="font-hero"
            style={{
              display: 'block',
              fontSize: 'clamp(2.8rem, 6.5vw, 5.8rem)',
              letterSpacing: '-3px',
              lineHeight: 1.0,
              color: 'var(--text-main)',
              fontWeight: 400,
            }}
          >
            Elite Creative Services
          </span>
          <span
            style={{
              display: 'block',
              fontSize: 'clamp(2.5rem, 5.8vw, 5rem)',
              fontWeight: 900,
              letterSpacing: '-2.5px',
              lineHeight: 1.1,
            }}
          >
            for <CycleStack />
          </span>
        </motion.h1>

        {/* Sub-text */}
        <motion.p
          {...fade(0.24)}
          style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
            color: 'var(--text-muted)',
            maxWidth: 500,
            lineHeight: 1.8,
            fontWeight: 400,
            marginBottom: 40,
            textWrap: 'balance',
          } as React.CSSProperties}
        >
          ExtoArts is a YouTube agency where{' '}
          <strong style={{ color: 'var(--text-main)', fontWeight: 700 }}>
            90% of your budget
          </strong>{' '}
          goes directly to your specialist editor. Real editors. Real results. Flat 10% fee.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          {...fade(0.32)}
          style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 56 }}
        >
          <GalaxyButton onClick={openDiscordModal}>
            <i className="ti ti-brand-discord" aria-hidden="true" />
            Start a Project
          </GalaxyButton>
          <MagneticButton>
            <a href="/portfolio" className="btn btn-glass" style={{ borderRadius: 999, display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              <i className="ti ti-eye" aria-hidden="true" />
              View Work
            </a>
          </MagneticButton>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          {...fade(0.5, 8)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            marginBottom: 32,
            opacity: 0.35,
          }}
          aria-hidden="true"
        >
          <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: 1, height: 28, background: 'linear-gradient(to bottom, var(--text-muted), transparent)' }}
          />
        </motion.div>

        {/* Ticker strip */}
        <motion.div
          {...fade(0.42)}
          className="ticker-outer"
          aria-hidden="true"
          style={{
            width: '100vw',
            overflow: 'hidden',
            position: 'relative',
            borderTop: '1px solid var(--border)',
            borderBottom: '1px solid var(--border)',
            padding: '11px 0',
            marginBottom: -1,
            background: 'rgba(255,255,255,0.012)',
          }}
        >
          <div className="ticker-track">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="ticker-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 16px', marginRight: 8, borderRadius: 999, border: '1px solid var(--border)', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap', background: 'transparent', transition: 'all 0.2s', cursor: 'default', letterSpacing: '0.2px' }}>
                <i className={`ti ${item.icon}`} style={{ color: 'var(--primary)', fontSize: '0.76rem' }} />
                {item.text}
              </span>
            ))}
          </div>
        </motion.div>
      </section>
    </>
  )
}
