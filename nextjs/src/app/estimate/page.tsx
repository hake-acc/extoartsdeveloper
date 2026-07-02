'use client'

import { useState } from 'react'
import Link from 'next/link'

const VIDEO_LENGTHS = [
  { label: 'Short (under 5 min)', base: 50 },
  { label: 'Medium (5-15 min)', base: 100 },
  { label: 'Long (15-30 min)', base: 175 },
  { label: 'Extended (30-60 min)', base: 280 },
  { label: 'Long-form (60+ min)', base: 400 },
]

const COMPLEXITY_LEVELS = [
  { label: 'Basic Cuts', multiplier: 1.0, desc: 'Simple cuts, basic transitions, minimal color' },
  { label: 'Standard', multiplier: 1.35, desc: 'Motion graphics, color grading, music sync' },
  { label: 'Premium', multiplier: 1.75, desc: 'Custom VFX, advanced graphics, full production' },
]

const ADDONS = [
  { label: 'Thumbnail Design', price: 25 },
  { label: 'Rush Delivery (24-48h)', price: 50 },
  { label: 'Custom Motion Graphics Package', price: 80 },
  { label: 'B-Roll Sourcing', price: 30 },
  { label: 'Captions / Subtitles', price: 20 },
  { label: 'Channel Branding Pack (intro/outro)', price: 120 },
]

export default function EstimatePage() {
  const [videoLength, setVideoLength] = useState(0)
  const [complexity, setComplexity] = useState(0)
  const [selectedAddons, setSelectedAddons] = useState<Set<number>>(new Set())
  const [videosPerMonth, setVideosPerMonth] = useState(4)

  const base = VIDEO_LENGTHS[videoLength].base
  const complexMultiplier = COMPLEXITY_LEVELS[complexity].multiplier
  const addonTotal = Array.from(selectedAddons).reduce((sum, i) => sum + ADDONS[i].price, 0)
  const perVideoEditorPay = Math.round(base * complexMultiplier + addonTotal)
  const agencyFee = Math.round(perVideoEditorPay * 0.1)
  const totalPerVideo = perVideoEditorPay + agencyFee
  const monthlyTotal = totalPerVideo * videosPerMonth

  function toggleAddon(i: number) {
    setSelectedAddons((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  return (
    <>
      <h1 className="sr-only">YouTube Video Editing Cost Estimator - ExtoArts</h1>

      <section style={{ padding: 'min(20vh,160px) min(20px,5%) min(40px,4vw)', textAlign: 'center', maxWidth: 760, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <span className="hero-badge" style={{ marginBottom: 28 }}>
          <span className="hero-badge-dot" aria-hidden="true" />
          Instant Estimate
        </span>
        <h1 style={{ fontSize: 'clamp(2.6rem,7vw,5rem)', fontWeight: 900, letterSpacing: '-2.5px', lineHeight: 1.0, marginBottom: 24, color: 'var(--text-main)' }}>
          Cost <span className="sweep-text">Estimator.</span>
        </h1>
        <p style={{ fontSize: 'clamp(1rem,1.8vw,1.15rem)', color: 'var(--text-muted)', maxWidth: 460, margin: '0 auto', lineHeight: 1.72 }}>
          Get an instant ballpark for your editing project. Real quotes are provided via Discord.
        </p>
      </section>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 min(20px,5%) min(100px,10vw)', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start', position: 'relative', zIndex: 10 }}>
        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {/* Video length */}
          <div className="tilt-card glass-card" style={{ border: '1px solid var(--border)', borderRadius: 20, padding: 28 }}>
            <div className="tilt-inner">
              <h2 style={{ fontSize: '0.72rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px', color: 'var(--primary)', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="gradient-dot" aria-hidden="true" />
                Video Length
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {VIDEO_LENGTHS.map((v, i) => (
                  <button
                    key={v.label}
                    onClick={() => setVideoLength(i)}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12, border: `1px solid ${videoLength === i ? 'rgba(34,211,238,0.35)' : 'var(--border)'}`, background: videoLength === i ? 'rgba(34,211,238,0.07)' : 'transparent', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', fontFamily: 'var(--font-body)' }}
                    aria-pressed={videoLength === i}
                  >
                    <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${videoLength === i ? 'var(--primary)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {videoLength === i && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)' }} />}
                    </div>
                    <span style={{ fontSize: '0.88rem', fontWeight: videoLength === i ? 700 : 500, color: videoLength === i ? 'var(--text-main)' : 'var(--text-muted)' }}>{v.label}</span>
                    <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>from ${v.base}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Complexity */}
          <div className="tilt-card glass-card" style={{ border: '1px solid var(--border)', borderRadius: 20, padding: 28 }}>
            <div className="tilt-inner">
              <h2 style={{ fontSize: '0.72rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px', color: 'var(--primary)', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="gradient-dot" aria-hidden="true" />
                Editing Complexity
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {COMPLEXITY_LEVELS.map((c, i) => (
                  <button
                    key={c.label}
                    onClick={() => setComplexity(i)}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px', borderRadius: 12, border: `1px solid ${complexity === i ? 'rgba(34,211,238,0.35)' : 'var(--border)'}`, background: complexity === i ? 'rgba(34,211,238,0.07)' : 'transparent', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', fontFamily: 'var(--font-body)' }}
                    aria-pressed={complexity === i}
                  >
                    <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${complexity === i ? 'var(--primary)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                      {complexity === i && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)' }} />}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: complexity === i ? 700 : 500, color: complexity === i ? 'var(--text-main)' : 'var(--text-muted)', marginBottom: 2 }}>{c.label}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Add-ons */}
          <div className="tilt-card glass-card" style={{ border: '1px solid var(--border)', borderRadius: 20, padding: 28 }}>
            <div className="tilt-inner">
              <h2 style={{ fontSize: '0.72rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px', color: 'var(--primary)', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="gradient-dot" aria-hidden="true" />
                Add-Ons (Optional)
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {ADDONS.map((addon, i) => (
                  <button
                    key={addon.label}
                    onClick={() => toggleAddon(i)}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12, border: `1px solid ${selectedAddons.has(i) ? 'rgba(34,211,238,0.35)' : 'var(--border)'}`, background: selectedAddons.has(i) ? 'rgba(34,211,238,0.07)' : 'transparent', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', fontFamily: 'var(--font-body)' }}
                    aria-pressed={selectedAddons.has(i)}
                  >
                    <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${selectedAddons.has(i) ? 'var(--primary)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: selectedAddons.has(i) ? 'var(--primary)' : 'transparent' }}>
                      {selectedAddons.has(i) && <i className="ti ti-check" style={{ color: '#000', fontSize: '0.7rem' }} aria-hidden="true" />}
                    </div>
                    <span style={{ fontSize: '0.86rem', fontWeight: selectedAddons.has(i) ? 700 : 500, color: selectedAddons.has(i) ? 'var(--text-main)' : 'var(--text-muted)', flex: 1 }}>{addon.label}</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>+${addon.price}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Videos per month */}
          <div className="tilt-card glass-card" style={{ border: '1px solid var(--border)', borderRadius: 20, padding: 28 }}>
            <div className="tilt-inner">
              <h2 style={{ fontSize: '0.72rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px', color: 'var(--primary)', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="gradient-dot" aria-hidden="true" />
                Monthly Volume
              </h2>
              <label htmlFor="monthly-vol" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                <span>Videos per month</span>
                <strong style={{ color: 'var(--text-main)' }}>{videosPerMonth}</strong>
              </label>
              <input
                id="monthly-vol"
                type="range"
                min={1}
                max={20}
                value={videosPerMonth}
                onChange={(e) => setVideosPerMonth(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--primary)' }}
                aria-label={`${videosPerMonth} videos per month`}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 4 }}>
                <span>1 (occasional)</span>
                <span>20 (daily+)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Estimate result */}
        <div style={{ position: 'sticky', top: 100 }}>
          <div className="tilt-card glass-card" style={{ border: '1px solid rgba(34,211,238,0.25)', borderRadius: 22, padding: 30 }}>
            <div className="tilt-inner">
              <h2 style={{ fontSize: '0.72rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px', color: 'var(--primary)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="gradient-dot" aria-hidden="true" />
                Your Estimate
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Editor pays</span>
                  <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>${perVideoEditorPay}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>ExtoArts fee (10%)</span>
                  <span style={{ color: 'var(--warm)', fontWeight: 700 }}>+${agencyFee}</span>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem' }}>
                  <span style={{ color: 'var(--text-main)', fontWeight: 800 }}>Per video</span>
                  <span className="gradient-num" style={{ fontWeight: 900, letterSpacing: '-0.5px' }}>${totalPerVideo}</span>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px 18px', marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: 4 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{videosPerMonth} videos/month</span>
                  <span style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '1.1rem' }}>${monthlyTotal}/mo</span>
                </div>
                <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', margin: 0 }}>Based on your current selections</p>
              </div>

              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.6, background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 10, padding: '10px 14px' }}>
                <i className="ti ti-info-circle" aria-hidden="true" style={{ color: 'var(--warm)' }} /> This is a ballpark estimate. Final pricing is set in your custom quote via Discord.
              </p>

              <a
                href="https://discord.gg/extoarts-1402333030827425922"
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{ width: '100%', justifyContent: 'center', background: '#5865f2', color: '#fff', borderRadius: 14 }}
              >
                <i className="ti ti-brand-discord" aria-hidden="true" /> Get Exact Quote
              </a>
              <Link href="/pricing" style={{ display: 'block', textAlign: 'center', marginTop: 12, fontSize: '0.78rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
                View pricing guide &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 720px) {
          div[style*="grid-template-columns: 1fr 340px"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="position: sticky"] {
            position: static !important;
          }
        }
      `}</style>
    </>
  )
}
