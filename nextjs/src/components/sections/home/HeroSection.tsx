'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FluidGradient } from '@/components/ui/FluidGradient'
import { GalaxyButton } from '@/components/ui/GalaxyButton'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { MaskTextReveal } from '@/components/motion/MaskTextReveal'

// Each phrase gets its own brand color — all 5 palette colours in sequence
const HERO_PHRASES: { text: string; color: string }[] = [
  { text: 'Video Editing',    color: '#69ddff' }, // Frozen Lake
  { text: 'Thumbnail Design', color: '#96cdff' }, // Sky Blue
  { text: 'Shorts Editing',   color: '#d8e1ff' }, // Lavender
  { text: 'Channel Growth',   color: '#dbbadd' }, // Pink Orchid
  { text: 'Motion Graphics',  color: '#be92a2' }, // Old Rose
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
  { icon: 'ti-star', text: '5-Star Rated' },
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

// ── Cycling headline phrase — each phrase has its own brand colour ─────────────
function CycleStack() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [exitIndex, setExitIndex] = useState<number | null>(null)

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % HERO_PHRASES.length
        setExitIndex(prev)
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
          key={phrase.text}
          className={[
            'cycle-phrase hero-accent-phrase',
            i === activeIndex ? 'is-active' : '',
            i === exitIndex ? 'is-exit' : '',
          ].filter(Boolean).join(' ')}
          aria-hidden={i !== activeIndex}
          style={{ color: phrase.color }}
        >
          {phrase.text}
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
        {/* Fluid Gradient background — exact Framer component, ExtoArts palette */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: -1,
          }}
        >
          <FluidGradient
            color1="#69ddff"
            color2="#be92a2"
            color3="#dbbadd"
            gradientSpeed={3}
            blur={120}
          />
        </div>
        {/* Dark overlay so text stays readable */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: -1,
            background: 'rgba(3,3,5,0.72)',
            pointerEvents: 'none',
          }}
        />

        {/* Agency badge */}
        <motion.div {...fade(0.05)} style={{ marginBottom: 32 }}>
          <span className="hero-badge" aria-label="YouTube-focused creative agency since 2024">
            <span className="hero-badge-dot" aria-hidden="true" />
            <span>YouTube-Focused Creative Agency</span>
            <span aria-hidden="true" style={{ color: 'var(--text-muted)', opacity: 0.35 }}>|</span>
            <span style={{ color: 'var(--text-muted)' }}>Since 2024</span>
          </span>
        </motion.div>

        {/* Main headline — mask-reveal on the static line; fade on the cycling line */}
        <h1 className="hero-title" style={{ marginBottom: 24 }}>
          {/* Line 1 — masked slide-up reveal */}
          <MaskTextReveal delay={0.08} duration={0.82}>
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
          </MaskTextReveal>
          {/* Line 2 — simple fade so CycleStack animates freely */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: 'block',
              fontSize: 'clamp(2.5rem, 5.8vw, 5rem)',
              fontWeight: 900,
              letterSpacing: '-2.5px',
              lineHeight: 1.1,
            }}
          >
            for <CycleStack />
          </motion.span>
        </h1>

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
            style={{
              width: 20,
              height: 30,
              borderRadius: 50,
              border: '1.5px solid var(--text-muted)',
              display: 'flex',
              justifyContent: 'center',
              paddingTop: 5,
            }}
          >
            <div style={{ width: 3, height: 5, borderRadius: 4, background: 'var(--text-main)' }} />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Ticker ── */}
      <div
        role="marquee"
        aria-label="Services offered"
        style={{
          overflow: 'hidden',
          background: 'var(--surface)',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
          padding: '14px 0',
          position: 'relative',
          zIndex: 10,
          maskImage: 'linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            width: 'max-content',
            animation: 'marqueeScroll 28s linear infinite',
          }}
          aria-hidden="true"
        >
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => {
            // Assign brand colours in sequence across ticker items
            const TICKER_COLORS = ['#69ddff', '#96cdff', '#d8e1ff', '#dbbadd', '#be92a2']
            const c = TICKER_COLORS[i % TICKER_COLORS.length]
            return (
              <span
                key={i}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  paddingRight: 44,
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  letterSpacing: '0.8px',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}
              >
                <i className={`ti ${item.icon}`} aria-hidden="true" style={{ color: c, fontSize: '0.85rem' }} />
                {item.text}
              </span>
            )
          })}
        </div>
      </div>
    </>
  )
}
