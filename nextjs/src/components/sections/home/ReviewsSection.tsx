'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { reviews } from '@/data/reviews'
import type { Review } from '@/types'

// ── Review card ──────────────────────────────────────────────────────────────
function ReviewCard({ review, onClick }: { review: Review; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rev-card"
      aria-label={`Read full review from ${review.name}`}
      style={{ cursor: 'pointer', textAlign: 'left', background: 'none', border: 'none', padding: 0 }}
    >
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 18,
          padding: '24px 22px 20px',
          width: 310,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s, border-color 0.35s',
        }}
        className="rev-card-inner"
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              overflow: 'hidden',
              border: '1.5px solid var(--border)',
              flexShrink: 0,
            }}
          >
            {review.img ? (
              <Image src={review.img} alt={`Profile photo of ${review.name}`} width={40} height={40} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: `linear-gradient(135deg,${review.grad})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1rem',
                  color: '#fff',
                }}
              >
                {review.init}
              </div>
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {review.name}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 2 }}>{review.type}</div>
          </div>
          <div style={{ display: 'flex', gap: 1 }} role="img" aria-label="5 stars">
            {[...Array(5)].map((_, i) => (
              <i key={i} className="ti ti-star" aria-hidden="true" style={{ fontSize: '0.62rem', color: '#f59e0b' }} />
            ))}
          </div>
        </div>

        {/* Text */}
        <p
          style={{
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
            lineHeight: 1.72,
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          } as React.CSSProperties}
        >
          &ldquo;{review.text}&rdquo;
        </p>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', opacity: 0.6 }}>{review.date}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.65rem', color: '#5865f2', fontWeight: 700 }}>
            <i className="ti ti-brand-discord" aria-hidden="true" />
            Verified
          </span>
        </div>
      </div>
    </button>
  )
}

// ── Review modal ──────────────────────────────────────────────────────────────
function ReviewModal({ review, onClose }: { review: Review; onClose: () => void }) {
  return (
    <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-modal-name"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 99999,
          background: 'rgba(0,0,0,0.72)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 16 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 24,
            padding: 'min(40px,5vw)',
            maxWidth: 460,
            width: '100%',
            position: 'relative',
            boxShadow: '0 48px 120px rgba(0,0,0,0.6)',
          }}
        >
          <button
            onClick={onClose}
            aria-label="Close review"
            style={{
              position: 'absolute', top: 16, right: 16,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border)',
              borderRadius: 10, padding: '6px 10px',
              cursor: 'pointer', color: 'var(--text-muted)',
              fontSize: '0.85rem', fontFamily: 'var(--font-body)',
            }}
          >
            <i className="ti ti-x" aria-hidden="true" />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--border)', flexShrink: 0 }}>
              {review.img ? (
                <Image src={review.img} alt={`Profile photo of ${review.name}`} width={52} height={52} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg,${review.grad})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>
                  {review.init}
                </div>
              )}
            </div>
            <div>
              <div id="review-modal-name" style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 4 }}>{review.name}</div>
              <div style={{ display: 'flex', gap: 2 }} role="img" aria-label="5 out of 5 stars">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="ti ti-star" aria-hidden="true" style={{ fontSize: '0.75rem', color: '#f59e0b' }} />
                ))}
              </div>
            </div>
          </div>

          <span style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--primary)', background: 'rgba(105,221,255,0.09)', border: '1px solid rgba(105,221,255,0.18)', padding: '3px 10px', borderRadius: 999, display: 'inline-block', marginBottom: 16 }}>
            {review.type}
          </span>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.76, margin: '0 0 20px' }}>
            &ldquo;{review.text}&rdquo;
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            <span>{review.date}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#5865f2', fontWeight: 700 }}>
              <i className="ti ti-brand-discord" aria-hidden="true" /> Discord Verified
            </span>
          </div>
        </motion.div>
      </motion.div>
  )
}

// ── Main section ──────────────────────────────────────────────────────────────
export function ReviewsSection() {
  const [selected, setSelected] = useState<Review | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const row1 = reviews
  const row2 = [...reviews.slice(4), ...reviews.slice(0, 4)]

  return (
    <>
      <section
        aria-labelledby="reviews-heading"
        style={{ padding: 'min(80px,7vw) 0', position: 'relative', zIndex: 10, overflow: 'hidden' }}
      >
        {/* Header */}
        <div style={{ padding: '0 min(20px,5%)', maxWidth: 1200, margin: '0 auto 56px' }}>
          <div style={{ textAlign: 'center' }}>
            <span className="sec-label" style={{ display: 'inline-flex', marginBottom: 16, alignItems: 'center', gap: 8 }}>
              <span className="gradient-dot" aria-hidden="true" />
              Client Reviews
            </span>
            <h2 id="reviews-heading" style={{ fontSize: 'clamp(1.9rem,3.8vw,3rem)', fontWeight: 900, letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 14 }}>
              What Our Clients Say
            </h2>
            <p style={{ fontSize: 'clamp(0.9rem,1.5vw,1rem)', color: 'var(--text-muted)', maxWidth: 420, margin: '0 auto', lineHeight: 1.7 }}>
              Every review is from a real creator verified via Discord.
            </p>
            {/* Pause button — WCAG 2.1 SC 2.2.2: moving content must be pausable */}
            <button
              onClick={() => setIsPaused(p => !p)}
              aria-label={isPaused ? 'Resume reviews carousel' : 'Pause reviews carousel'}
              aria-pressed={isPaused}
              style={{
                marginTop: 20,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 16px',
                borderRadius: 999,
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'border-color 0.2s, color 0.2s',
              }}
            >
              <i className={isPaused ? 'ti ti-player-play' : 'ti ti-player-pause'} aria-hidden="true" style={{ fontSize: '0.85rem' }} />
              {isPaused ? 'Resume' : 'Pause'}
            </button>
          </div>
        </div>

        {/* Row 1 — left */}
        <div
          aria-label="Client reviews carousel"
          style={{ marginBottom: 14 }}
        >
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '8%', background: 'linear-gradient(90deg,var(--bg),transparent)', zIndex: 2, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '8%', background: 'linear-gradient(270deg,var(--bg),transparent)', zIndex: 2, pointerEvents: 'none' }} />
            <div className="marquee-track" style={{ '--duration': '36s' } as React.CSSProperties}>
              <div className="marquee-inner" style={{ gap: 14, alignItems: 'stretch', animationPlayState: isPaused ? 'paused' : undefined }}>
                {[...row1, ...row1].map((rev, i) => (
                  <ReviewCard key={i} review={rev} onClick={() => setSelected(rev)} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Row 2 — right */}
        <div>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '8%', background: 'linear-gradient(90deg,var(--bg),transparent)', zIndex: 2, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '8%', background: 'linear-gradient(270deg,var(--bg),transparent)', zIndex: 2, pointerEvents: 'none' }} />
            <div className="marquee-track" style={{ '--duration': '40s' } as React.CSSProperties}>
              <div className="marquee-inner reverse" style={{ gap: 14, alignItems: 'stretch', animationPlayState: isPaused ? 'paused' : undefined }}>
                {[...row2, ...row2].map((rev, i) => (
                  <ReviewCard key={i} review={rev} onClick={() => setSelected(rev)} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Rating summary + external profile badges */}
        <div style={{ padding: '48px min(20px,5%) 0', maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
            <div style={{ display: 'flex', gap: 3 }} role="img" aria-label="5 out of 5 stars">
              {[...Array(5)].map((_, i) => (
                <i key={i} className="ti ti-star" aria-hidden="true" style={{ fontSize: '1.1rem', color: '#f59e0b' }} />
              ))}
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              5.0 average · verified creators on Discord
            </span>
          </div>
          {/* External trust badges */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
            <a
              href="https://www.trustpilot.com/review/extoarts.in"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '9px 18px', borderRadius: 999,
                border: '1px solid rgba(0,182,122,0.35)',
                background: 'rgba(0,182,122,0.07)',
                textDecoration: 'none', color: 'var(--text-main)',
                fontSize: '0.78rem', fontWeight: 700,
                transition: 'border-color 0.2s, background 0.2s',
              }}
              className="trust-badge"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#00b67a"/>
              </svg>
              <span style={{ color: '#6ee7b7' }}>4.5</span>
              <span style={{ color: 'var(--text-main)' }}>on Trustpilot</span>
            </a>
            <a
              href="https://ytjobs.co/talent/profile/528947?r=179"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '9px 18px', borderRadius: 999,
                border: '1px solid rgba(255,0,0,0.25)',
                background: 'rgba(255,0,0,0.05)',
                textDecoration: 'none', color: 'var(--text-main)',
                fontSize: '0.78rem', fontWeight: 700,
                transition: 'border-color 0.2s, background 0.2s',
              }}
              className="trust-badge"
            >
              <i className="ti ti-brand-youtube" aria-hidden="true" style={{ color: '#ff0000', fontSize: '0.95rem' }} />
              Verified on YTJobs
            </a>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selected && <ReviewModal key="review-modal" review={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>

      <style>{`
        .rev-card-inner:hover {
          box-shadow: 0 18px 52px rgba(0,0,0,0.44), 0 0 0 1px rgba(105,221,255,0.09);
          border-color: rgba(255,255,255,0.11) !important;
        }
        @media (hover: hover) and (pointer: fine) {
          .rev-card-inner:hover { transform: translateY(-4px); }
        }
      `}</style>
    </>
  )
}
