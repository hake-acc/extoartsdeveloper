'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import portfolioData from '@/data/portfolio.json'
import type { PortfolioCategory, PortfolioItem } from '@/types'

const categories = portfolioData as PortfolioCategory[]

// ── Lightbox ──────────────────────────────────────────────────────────────────
function LightboxModal({ item, category, onClose }: { item: PortfolioItem; category: PortfolioCategory; onClose: () => void }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // Focus close button on open; Escape to close
  useEffect(() => {
    closeButtonRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`${item.title} preview`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        style={{
          position: 'fixed', inset: 0, zIndex: 99999,
          background: 'rgba(0,0,0,0.90)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ maxWidth: 960, width: '95vw', position: 'relative' }}
        >
          <button
            onClick={onClose}
            aria-label="Close preview"
            style={{
              position: 'absolute', top: -48, right: 0,
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 999, width: 38, height: 38,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#fff', fontSize: '1rem',
              transition: 'background 0.2s',
              fontFamily: 'var(--font-body)',
            }}
          >
            <i className="ti ti-x" aria-hidden="true" />
          </button>

          <div style={{ borderRadius: 22, overflow: 'hidden', aspectRatio: '16/9', position: 'relative', boxShadow: '0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)' }}>
            <Image
              src={item.thumbnail_url}
              alt={item.title}
              fill
              sizes="(max-width: 960px) 95vw, 960px"
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>

          <div style={{ padding: '16px 4px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div>
              <p style={{ fontWeight: 700, color: '#fff', margin: 0, fontSize: '0.92rem', letterSpacing: '-0.2px' }}>{item.title}</p>
              <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', margin: '2px 0 0' }}>{category.name}</p>
            </div>
            <span style={{ fontSize: '0.64rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--primary)', background: 'rgba(105,221,255,0.1)', border: '1px solid rgba(105,221,255,0.2)', padding: '4px 12px', borderRadius: 999, flexShrink: 0 }}>
              {item.project_type === 'video' ? 'Video' : 'Image'}
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ── Portfolio item card ───────────────────────────────────────────────────────
function PortfolioCard({ item, category, index, onClick }: { item: PortfolioItem; category: PortfolioCategory; index: number; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.button
      className="portfolio-card"
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'relative',
        aspectRatio: '16/9',
        overflow: 'hidden',
        borderRadius: 16,
        cursor: 'pointer',
        background: 'var(--surface)',
        border: 'none',
        padding: 0,
        display: 'block',
        width: '100%',
        boxShadow: hovered
          ? '0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(105,221,255,0.14)'
          : '0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
        transition: 'box-shadow 0.4s cubic-bezier(0.22,1,0.36,1)',
      }}
      aria-label={`View ${item.title}`}
    >
      <Image
        src={item.thumbnail_url}
        alt={item.title}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        style={{
          objectFit: 'cover',
          transform: hovered ? 'scale(1.04)' : 'scale(1)',
          transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1)',
        }}
        loading="lazy"
      />

      {/* Overlay */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: hovered
            ? 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.18) 60%, transparent 100%)'
            : 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)',
          transition: 'background 0.4s',
        }}
      />

      {/* Label */}
      <div
        style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          padding: '14px 14px',
          transform: hovered ? 'translateY(0)' : 'translateY(4px)',
          opacity: hovered ? 1 : 0.7,
          transition: 'transform 0.35s cubic-bezier(0.22,1,0.36,1), opacity 0.35s',
        }}
      >
        <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.1px', textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
          {item.title}
        </p>
      </div>

      {/* Type badge */}
      {item.project_type === 'video' && (
        <div
          style={{
            position: 'absolute',
            top: 10, right: 10,
            width: 28, height: 28,
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff',
            fontSize: '0.7rem',
          }}
        >
          <i className="ti ti-player-play-filled" aria-hidden="true" />
        </div>
      )}
    </motion.button>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [lightbox, setLightbox] = useState<{ item: PortfolioItem; category: PortfolioCategory } | null>(null)

  const filtered = activeCategory === 'all'
    ? categories
    : categories.filter((c) => c.slug === activeCategory)

  return (
    <>
      {lightbox && (
        <LightboxModal
          item={lightbox.item}
          category={lightbox.category}
          onClose={() => setLightbox(null)}
        />
      )}

      <h1 className="sr-only">ExtoArts Creative Portfolio - YouTube Thumbnails and Video Edits</h1>

      {/* Page hero */}
      <section
        style={{
          padding: 'min(20vh,160px) min(20px,5%) min(44px,4vw)',
          textAlign: 'center',
          maxWidth: 800,
          margin: '0 auto',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16,1,0.3,1] }}>
          <span className="hero-badge" style={{ marginBottom: 28, display: 'inline-flex' }}>
            <span className="hero-badge-dot" aria-hidden="true" />
            Real Work. Real Results.
          </span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16,1,0.3,1] }}
          className="font-hero"
          style={{ fontSize: 'clamp(2.6rem,7vw,5rem)', fontWeight: 400, letterSpacing: '-2.5px', lineHeight: 1.0, marginBottom: 20, color: 'var(--text-main)' }}
        >
          Our Creative <span className="sweep-text">Portfolio.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16,1,0.3,1] }}
          style={{ fontSize: 'clamp(1rem,1.8vw,1.12rem)', color: 'var(--text-muted)', maxWidth: 480, margin: '0 auto', lineHeight: 1.75 }}
        >
          Gaming thumbnails, video edits, motion graphics, and channel artwork — all produced for real YouTube creators.
        </motion.p>
      </section>

      {/* Category filter */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.28, ease: [0.16,1,0.3,1] }}
        style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', padding: '0 20px 44px', position: 'relative', zIndex: 10 }}
      >
        {[{ slug: 'all', name: 'All Work' }, ...categories].map(({ slug, name }: { slug: string; name: string }) => {
          const isActive = activeCategory === slug
          return (
            <button
              key={slug}
              onClick={() => setActiveCategory(slug)}
              aria-pressed={isActive}
              style={{
                padding: '8px 20px',
                borderRadius: 999,
                border: `1px solid ${isActive ? 'var(--primary)' : 'var(--border)'}`,
                background: isActive ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                color: isActive ? '#000' : 'var(--text-muted)',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.22s cubic-bezier(0.16,1,0.3,1)',
                fontFamily: 'var(--font-body)',
                letterSpacing: '0.2px',
                boxShadow: isActive ? '0 0 20px rgba(105,221,255,0.25)' : 'none',
              }}
            >
              {name}
            </button>
          )
        })}
      </motion.div>

      {/* Portfolio grid */}
      <div
        style={{ maxWidth: 1300, margin: '0 auto', padding: '0 min(20px,5%) min(100px,10vw)', position: 'relative', zIndex: 10 }}
      >
        {filtered.map((cat) => (
          <div key={cat.id} style={{ marginBottom: 64 }}>
            {/* Category header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: 'clamp(1.1rem,2.5vw,1.4rem)', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.5px', margin: 0 }}>
                {cat.name}
              </h2>
              <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '3px 10px', borderRadius: 999, fontWeight: 700 }}>
                {cat.meta}
              </span>
            </div>

            {/* Responsive grid */}
            <div
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}
            >
              {cat.items.map((item, i) => (
                <PortfolioCard
                  key={item.id}
                  item={item}
                  category={cat}
                  index={i}
                  onClick={() => setLightbox({ item, category: cat })}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
