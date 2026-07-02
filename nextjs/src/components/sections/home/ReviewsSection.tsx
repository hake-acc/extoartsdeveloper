'use client'

import { useState } from 'react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { reviews } from '@/data/reviews'
import type { Review } from '@/types'

function ReviewCard({ review, onClick }: { review: Review; onClick: () => void }) {
  return (
    <button
      className="rev-card"
      type="button"
      onClick={onClick}
      aria-label={`Read full review from ${review.name}`}
      style={{ minWidth: 300, maxWidth: 320 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--primary)', background: 'rgba(34,211,238,0.09)', border: '1px solid rgba(34,211,238,0.18)', padding: '3px 10px', borderRadius: 999 }}>
          {review.type}
        </span>
        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <i className="ti ti-calendar-event" aria-hidden="true" /> {review.date}
        </span>
      </div>
      <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.65, flex: 1, textAlign: 'left', margin: '8px 0' }}>
        {review.text.length > 120 ? review.text.slice(0, 120) + '...' : review.text}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--border)', flexShrink: 0 }}>
            {review.img ? (
              <img src={review.img} alt={review.name} width={36} height={36} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
            ) : (
              <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg,${review.grad})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', color: '#fff' }}>
                {review.init}
              </div>
            )}
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>{review.name}</div>
            <div style={{ display: 'flex', gap: 2 }} role="img" aria-label="5 out of 5 stars">
              {[...Array(5)].map((_, i) => (
                <i key={i} className="ti ti-star-filled" aria-hidden="true" style={{ fontSize: '0.65rem', color: '#f59e0b' }} />
              ))}
            </div>
          </div>
        </div>
        <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#5865f2', display: 'flex', alignItems: 'center', gap: 4, border: '1px solid rgba(88,101,242,0.2)', padding: '3px 8px', borderRadius: 999, background: 'rgba(88,101,242,0.05)' }}>
          <i className="ti ti-brand-discord" aria-hidden="true" /> Verified
        </span>
      </div>
    </button>
  )
}

function ReviewModal({ review, onClose }: { review: Review; onClose: () => void }) {
  return (
    <div
      className="modal open"
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-name"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="modal-box" style={{ maxWidth: 520 }}>
        <button
          onClick={onClose}
          aria-label="Close review"
          style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: '1px solid var(--border)', borderRadius: 999, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.9rem' }}
        >
          <i className="ti ti-x" aria-hidden="true" />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--border)', flexShrink: 0 }}>
            {review.img ? (
              <img src={review.img} alt={review.name} width={56} height={56} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg,${review.grad})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem', color: '#fff' }}>
                {review.init}
              </div>
            )}
          </div>
          <div style={{ textAlign: 'left' }}>
            <div id="review-modal-name" style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 4 }}>{review.name}</div>
            <div style={{ display: 'flex', gap: 2 }} role="img" aria-label="5 out of 5 stars">
              {[...Array(5)].map((_, i) => (
                <i key={i} className="ti ti-star-filled" aria-hidden="true" style={{ fontSize: '0.8rem', color: '#f59e0b' }} />
              ))}
            </div>
          </div>
        </div>
        <span style={{ fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--primary)', background: 'rgba(34,211,238,0.09)', border: '1px solid rgba(34,211,238,0.18)', padding: '3px 10px', borderRadius: 999, display: 'inline-block', marginBottom: 16 }}>
          {review.type}
        </span>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.72, textAlign: 'left', margin: '0 0 20px' }}>
          &ldquo;{review.text}&rdquo;
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <span>{review.date}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#5865f2' }}>
            <i className="ti ti-brand-discord" aria-hidden="true" /> Discord Verified
          </span>
        </div>
      </div>
    </div>
  )
}

export function ReviewsSection() {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const row1 = reviews
  const row2 = [...reviews.slice(3), ...reviews.slice(0, 3)]

  return (
    <>
      <section
        aria-labelledby="reviews-heading"
        style={{ padding: 'min(80px,7vw) 0', position: 'relative', zIndex: 10 }}
      >
        <div style={{ padding: '0 min(20px,5%)', maxWidth: 1200, margin: '0 auto' }}>
          <SectionHeader
            label="Client Reviews"
            title={<>Real Creators. <span className="sweep-text">Real Results.</span></>}
            subtitle="Verified reviews from YouTube creators we've worked with. No fake testimonials."
          />
        </div>

        {/* Row 1 */}
        <div className="marquee-track" style={{ marginBottom: 14, '--duration': '38s' } as React.CSSProperties}>
          <div className="marquee-inner" style={{ gap: 14, paddingTop: 4, paddingBottom: 4 }}>
            {[...row1, ...row1].map((r, i) => (
              <ReviewCard key={`r1-${i}`} review={r} onClick={() => setSelectedReview(r)} />
            ))}
          </div>
        </div>

        {/* Row 2 */}
        <div className="marquee-track" style={{ '--duration': '42s' } as React.CSSProperties}>
          <div className="marquee-inner reverse" style={{ gap: 14, paddingTop: 4, paddingBottom: 4 }}>
            {[...row2, ...row2].map((r, i) => (
              <ReviewCard key={`r2-${i}`} review={r} onClick={() => setSelectedReview(r)} />
            ))}
          </div>
        </div>

        {/* Rating summary */}
        <div style={{ textAlign: 'center', marginTop: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, flexWrap: 'wrap', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }} role="img" aria-label="5 out of 5 stars from 7 reviews">
            {[...Array(5)].map((_, i) => (
              <i key={i} className="ti ti-star-filled" aria-hidden="true" style={{ fontSize: '1.2rem', color: '#f59e0b' }} />
            ))}
            <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', marginLeft: 6 }}>5.0</span>
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>7 verified reviews on Discord</span>
          <a href="https://discord.gg/extoarts-1402333030827425922" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.78rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5, border: '1px solid rgba(34,211,238,0.22)', padding: '5px 14px', borderRadius: 999 }}>
            <i className="ti ti-brand-discord" aria-hidden="true" /> See All Reviews
          </a>
        </div>
      </section>

      {selectedReview && (
        <ReviewModal review={selectedReview} onClose={() => setSelectedReview(null)} />
      )}
    </>
  )
}
