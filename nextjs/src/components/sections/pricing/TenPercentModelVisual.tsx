'use client'

import { useState, useRef, useEffect, useId } from 'react'
import { animate, motion } from 'framer-motion'

/* ── Locale-safe formatter ─────────────────────────────────────── */
const fmt = (n: number) => n.toLocaleString('en-US')

/* ── Animated counter ─────────────────────────────────────────── */
function AnimCount({ value, prefix = '$' }: { value: number; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const prevRef = useRef(value)
  useEffect(() => {
    const from = prevRef.current
    prevRef.current = value
    const ctrl = animate(from, value, {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(v) {
        if (ref.current) ref.current.textContent = prefix + fmt(Math.round(v))
      },
    })
    return () => ctrl.stop()
  }, [value, prefix])
  return <span ref={ref}>{prefix}{fmt(value)}</span>
}

/* ── Icons ─────────────────────────────────────────────────────── */
function WalletIcon({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" fill="none" aria-hidden="true">
      <rect x="3" y="9" width="28" height="18" rx="4" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M3 14h28" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M8 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.6"/>
      <circle cx="24" cy="21" r="2.5" fill="currentColor" opacity="0.7"/>
      <path d="M11 21h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function FilmIcon({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" fill="none" aria-hidden="true">
      <rect x="2" y="9" width="30" height="16" rx="3" stroke="currentColor" strokeWidth="1.6"/>
      <rect x="2" y="9" width="5" height="16" rx="2" stroke="currentColor" strokeWidth="1.6"/>
      <rect x="27" y="9" width="5" height="16" rx="2" stroke="currentColor" strokeWidth="1.6"/>
      <rect x="6" y="6" width="2.5" height="5" rx="1" fill="currentColor" opacity="0.6"/>
      <rect x="12" y="6" width="2.5" height="5" rx="1" fill="currentColor" opacity="0.6"/>
      <rect x="18" y="6" width="2.5" height="5" rx="1" fill="currentColor" opacity="0.6"/>
      <rect x="6" y="23" width="2.5" height="5" rx="1" fill="currentColor" opacity="0.6"/>
      <rect x="12" y="23" width="2.5" height="5" rx="1" fill="currentColor" opacity="0.6"/>
      <rect x="18" y="23" width="2.5" height="5" rx="1" fill="currentColor" opacity="0.6"/>
      <path d="M14 14l7 3.5-7 3.5V14z" fill="currentColor" opacity="0.9"/>
    </svg>
  )
}

function DiamondIcon({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none" aria-hidden="true">
      <path d="M15 4L4 13l11 13 11-13L15 4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
      <path d="M4 13h22" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M10 4l-2 9M20 4l2 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.55"/>
      <path d="M10 13L15 26M20 13L15 26" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.55"/>
    </svg>
  )
}

/* ── Desktop fork SVG connector ───────────────────────────────── */
function DesktopConnector({ id, editorPct }: { id: string; editorPct: number }) {
  const leftPath  = 'M50 2 C50 30 12 30 12 58'
  const rightPath = 'M50 2 C50 30 88 30 88 58'
  const editorW = Math.round(2 + (editorPct / 100) * 5)
  const feeW    = Math.round(1.5 + ((100 - editorPct) / 100) * 3)
  const leftParticles  = [0, 0.55, 1.1]
  const rightParticles = [0, 0.9]

  return (
    <svg
      viewBox="0 0 100 60"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ width: '100%', height: 110, display: 'block', overflow: 'visible' }}
    >
      <defs>
        <linearGradient id={`${id}-lg`} x1="50%" y1="0%" x2="12%" y2="100%">
          <stop offset="0%" stopColor="#a3e635" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#a3e635" stopOpacity="0.95"/>
        </linearGradient>
        <linearGradient id={`${id}-rg`} x1="50%" y1="0%" x2="88%" y2="100%">
          <stop offset="0%" stopColor="#69ddff" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#69ddff" stopOpacity="0.9"/>
        </linearGradient>
        <filter id={`${id}-glow`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="1.8" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <path id={`${id}-lp`} d={leftPath}/>
        <path id={`${id}-rp`} d={rightPath}/>
      </defs>
      <path d={leftPath}  stroke="#a3e635" strokeWidth={editorW + 5} strokeLinecap="round" fill="none" opacity="0.07"/>
      <path d={rightPath} stroke="#69ddff" strokeWidth={feeW + 5}    strokeLinecap="round" fill="none" opacity="0.08"/>
      <path d={leftPath}  stroke={`url(#${id}-lg)`} strokeWidth={editorW} strokeLinecap="round" fill="none" strokeDasharray="4 3" filter={`url(#${id}-glow)`} style={{ animation: 'flowDash 1.2s linear infinite' }}/>
      <path d={rightPath} stroke={`url(#${id}-rg)`} strokeWidth={feeW}    strokeLinecap="round" fill="none" strokeDasharray="3 4" filter={`url(#${id}-glow)`} style={{ animation: 'flowDash 1.8s linear infinite reverse' }}/>
      {leftParticles.map((delay, i) => (
        <circle key={`lp${i}`} r={2.4} fill="#a3e635" opacity="0.95" filter={`url(#${id}-glow)`}>
          <animateMotion dur="1.4s" repeatCount="indefinite" begin={`${delay}s`}><mpath href={`#${id}-lp`}/></animateMotion>
        </circle>
      ))}
      {rightParticles.map((delay, i) => (
        <circle key={`rp${i}`} r={2} fill="#69ddff" opacity="0.92" filter={`url(#${id}-glow)`}>
          <animateMotion dur="2s" repeatCount="indefinite" begin={`${delay}s`}><mpath href={`#${id}-rp`}/></animateMotion>
        </circle>
      ))}
    </svg>
  )
}

/* ── Mobile vertical pipe (sits between hub→card1 and card1→card2) */
function MobilePipe({ color, pct, id }: { color: string; pct: number; id: string }) {
  const particleDelays = pct === 90 ? [0, 0.55, 1.1] : [0, 0.9]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, margin: '2px 0' }}>
      <svg
        viewBox="0 0 40 56"
        aria-hidden="true"
        style={{ width: 40, height: 56, display: 'block', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id={`${id}-vg`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.35"/>
            <stop offset="100%" stopColor={color} stopOpacity="0.9"/>
          </linearGradient>
          <filter id={`${id}-vf`} x="-80%" y="-20%" width="260%" height="140%">
            <feGaussianBlur stdDeviation="1.6" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <path id={`${id}-vp`} d="M20 2 L20 54"/>
        </defs>
        {/* Ambient glow */}
        <path d="M20 2 L20 54" stroke={color} strokeWidth={pct === 90 ? 8 : 4} strokeLinecap="round" fill="none" opacity="0.07"/>
        {/* Main animated pipe */}
        <path
          d="M20 2 L20 54"
          stroke={`url(#${id}-vg)`}
          strokeWidth={pct === 90 ? 3.5 : 2}
          strokeLinecap="round"
          fill="none"
          strokeDasharray="4 3"
          filter={`url(#${id}-vf)`}
          style={{ animation: `flowDash ${pct === 90 ? '1.2s' : '1.8s'} linear infinite` }}
        />
        {/* Particles */}
        {particleDelays.map((delay, i) => (
          <circle key={i} r={pct === 90 ? 2.4 : 2} fill={color} opacity="0.95" filter={`url(#${id}-vf)`}>
            <animateMotion dur={pct === 90 ? '1.4s' : '2s'} repeatCount="indefinite" begin={`${delay}s`}>
              <mpath href={`#${id}-vp`}/>
            </animateMotion>
          </circle>
        ))}
        {/* Arrowhead */}
        <path d="M14 46 L20 54 L26 46" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.7"/>
      </svg>
      {/* Label pill */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        background: pct === 90 ? 'rgba(163,230,53,0.1)' : 'rgba(105,221,255,0.08)',
        border: `1px solid ${pct === 90 ? 'rgba(163,230,53,0.22)' : 'rgba(105,221,255,0.2)'}`,
        borderRadius: 999, padding: '2px 9px',
        fontSize: '0.63rem', fontWeight: 800, color, letterSpacing: '1px', textTransform: 'uppercase' as const,
        marginTop: 2,
      }}>
        {pct}% → {pct === 90 ? 'Editor' : 'ExtoArts'}
      </div>
    </div>
  )
}

/* ── Main exported component ──────────────────────────────────── */
export function TenPercentModelVisual() {
  const [budget, setBudget] = useState(500)
  const [isMobile, setIsMobile] = useState(false)
  const id = useId().replace(/:/g, '')

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 540px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const editorEarns = budget * 0.9
  const extoFee     = budget * 0.1
  const traditLow   = Math.round(budget * 0.4)
  const traditHigh  = Math.round(budget * 0.7)

  /* ── Shared card contents ─────────────────────────────────────── */
  const EditorCard = (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: 'rgba(163,230,53,0.05)',
        border: '1px solid rgba(163,230,53,0.18)',
        borderRadius: 22,
        padding: isMobile ? '20px 18px' : 'min(28px,3.5vw)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 28px var(--shadow)',
      }}
    >
      <div aria-hidden="true" style={{ position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)', width: 140, height: 70, background: 'radial-gradient(ellipse, rgba(163,230,53,0.22) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(163,230,53,0.12)', border: '1px solid rgba(163,230,53,0.24)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: '#a3e635' }}>
        <FilmIcon size={30}/>
      </div>
      <div style={{ fontSize: 'clamp(1.6rem,3.5vw,2.4rem)', fontWeight: 900, color: '#a3e635', letterSpacing: '-2px', lineHeight: 1, marginBottom: 8 }}>
        <AnimCount value={Math.round(editorEarns)}/>
      </div>
      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
        Goes directly to your specialist. Senior talent, paid fairly.
      </p>
    </motion.div>
  )

  const ExtoCard = (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: 'var(--primary-glow)',
        border: '1px solid var(--primary-glow)',
        borderRadius: 22,
        padding: isMobile ? '20px 18px' : 'min(28px,3.5vw)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 28px var(--shadow)',
      }}
    >
      <div aria-hidden="true" style={{ position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)', width: 140, height: 70, background: 'radial-gradient(ellipse, var(--primary-glow) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ width: 52, height: 52, borderRadius: 16, background: 'var(--primary-glow)', border: '1px solid var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: 'var(--primary)' }}>
        <DiamondIcon size={28}/>
      </div>
      <div style={{ fontSize: 'clamp(1.6rem,3.5vw,2.4rem)', fontWeight: 900, color: 'var(--primary)', letterSpacing: '-2px', lineHeight: 1, marginBottom: 8 }}>
        <AnimCount value={Math.round(extoFee)}/>
      </div>
      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
        Covers matching, QC, revisions &amp; delivery. Nothing hidden.
      </p>
    </motion.div>
  )

  /* ── Budget hub (shared) ──────────────────────────────────────── */
  const Hub = (
    <motion.div
      key={budget}
      initial={{ scale: 0.94, opacity: 0.7 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        background: 'var(--surface)', border: '1px solid var(--border-hover)',
        borderRadius: 22, padding: '18px 28px', minWidth: 160, textAlign: 'center',
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 8px 32px var(--shadow), 0 0 0 1px var(--primary-glow)',
      }}
    >
      <div aria-hidden="true" style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', width: 100, height: 50, background: 'radial-gradient(ellipse, var(--primary-glow) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ width: 44, height: 44, borderRadius: 14, background: 'var(--primary-glow)', border: '1px solid var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
        <WalletIcon size={24}/>
      </div>
      <div>
        <div style={{ fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-1.5px', lineHeight: 1 }}>
          <AnimCount value={budget}/>
        </div>
        <div style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-muted)', marginTop: 4 }}>
          Your Budget
        </div>
      </div>
    </motion.div>
  )

  return (
    <section style={{ padding: '0 min(20px,5%) min(80px,7vw)', maxWidth: 820, margin: '0 auto', position: 'relative', zIndex: 10 }}>

      {/* Heading */}
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <span className="sec-label" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span className="gradient-dot" aria-hidden="true" />
          Radical Transparency
        </span>
        <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 900, letterSpacing: '-1px', lineHeight: 1.1, marginBottom: 10 }}>
          How the 10% Model Works
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', maxWidth: 440, margin: '0 auto', lineHeight: 1.75 }}>
          Set any budget. 90% flows directly to your specialist. ExtoArts keeps 10%—flat, forever.
        </p>
      </div>

      {/* Slider */}
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: 'var(--surface)', border: '1px solid var(--border-hover)', borderRadius: 999, padding: '10px 22px', marginBottom: 14, boxShadow: '0 2px 12px var(--shadow)' }}>
          <WalletIcon size={18}/>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Your Budget</span>
          <span style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '-0.5px', minWidth: 72, textAlign: 'right' }}>${fmt(budget)}</span>
        </div>
        <div style={{ maxWidth: 420, margin: '0 auto', padding: '0 8px' }}>
          <input type="range" min={100} max={3000} step={50} value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            aria-label="Set your budget to see the 10% split"
            className="flow-range"
            style={{
              width: '100%', appearance: 'none', height: 5, borderRadius: 999,
              background: `linear-gradient(90deg, var(--primary) ${((budget - 100) / 2900) * 100}%, var(--border-hover) ${((budget - 100) / 2900) * 100}%)`,
              outline: 'none', cursor: 'pointer',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: '0.68rem', color: 'var(--text-muted)', opacity: 0.55, fontWeight: 600 }}>
            <span>$100</span><span>$3,000</span>
          </div>
        </div>
      </div>

      {/* ── MOBILE layout: vertical chain ─────────────────────────── */}
      {isMobile && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {Hub}
          <MobilePipe color="#a3e635" pct={90} id={`${id}-m1`} />
          <div style={{ width: '100%' }}>{EditorCard}</div>
          <MobilePipe color="#69ddff" pct={10} id={`${id}-m2`} />
          <div style={{ width: '100%' }}>{ExtoCard}</div>
        </div>
      )}

      {/* ── DESKTOP layout: hub + fork SVG + side-by-side cards ───── */}
      {!isMobile && (
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: -4 }}>
            {Hub}
          </div>
          <DesktopConnector id={id} editorPct={90}/>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {EditorCard}
            {ExtoCard}
          </div>
        </div>
      )}

      {/* Comparison strip */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        style={{
          marginTop: 20, padding: '16px 24px',
          background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.16)',
          borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 20, flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <i className="ti ti-alert-triangle" aria-hidden="true" style={{ color: '#f59e0b', fontSize: '0.95rem' }}/>
          <span>Traditional agencies on this budget take{' '}
            <span style={{ color: '#f59e0b', fontWeight: 800 }}>
              <AnimCount value={traditLow}/>–<AnimCount value={traditHigh}/>
            </span>{' '}in overhead
          </span>
        </div>
        <div style={{ width: 1, height: 18, background: 'var(--border-hover)', flexShrink: 0 }}/>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <i className="ti ti-check" aria-hidden="true" style={{ color: '#a3e635', fontSize: '0.95rem' }}/>
          <span>ExtoArts takes{' '}
            <span style={{ color: '#a3e635', fontWeight: 800 }}>
              <AnimCount value={Math.round(extoFee)}/>
            </span>{' '}flat — your editor keeps the rest
          </span>
        </div>
      </motion.div>

      <style>{`
        .flow-range::-webkit-slider-thumb {
          appearance: none; width: 18px; height: 18px; border-radius: 50%;
          background: var(--primary); cursor: pointer;
          box-shadow: 0 0 0 3px var(--primary-glow), 0 0 12px var(--primary-glow);
          border: 2px solid var(--bg); transition: box-shadow 0.2s;
        }
        .flow-range::-webkit-slider-thumb:hover {
          box-shadow: 0 0 0 5px var(--primary-glow), 0 0 20px var(--primary-glow);
        }
        .flow-range::-moz-range-thumb {
          width: 18px; height: 18px; border-radius: 50%;
          background: var(--primary); cursor: pointer;
          border: 2px solid var(--bg); box-shadow: 0 0 0 3px var(--primary-glow);
        }
        @keyframes flowDash { to { stroke-dashoffset: -22; } }
      `}</style>
    </section>
  )
}
