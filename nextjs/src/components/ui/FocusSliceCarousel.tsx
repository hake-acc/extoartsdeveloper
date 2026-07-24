'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

export interface FocusSliceItem {
  src: string
  alt: string
  title?: string
  subtitle?: string
}

interface Props {
  items: FocusSliceItem[]
  maxVisible?: number
}

export function FocusSliceCarousel({ items, maxVisible = 6 }: Props) {
  const visible = items.slice(0, maxVisible)
  const [active, setActive] = useState(0)

  if (visible.length === 0) return null

  const next = () => setActive((a) => (a + 1) % visible.length)

  return (
    <div
      role="region"
      aria-label="Featured work carousel"
      style={{
        display: 'flex',
        gap: 10,
        width: '100%',
        maxWidth: 1200,
        margin: '0 auto',
        height: 'clamp(260px, 38vw, 420px)',
        overflowX: 'auto',
        overflowY: 'hidden',
      }}
    >
      {visible.map((item, i) => {
        const isActive = i === active
        return (
          <motion.button
            key={item.src}
            layout
            onClick={() => setActive(i)}
            transition={{ type: 'spring', stiffness: 260, damping: 32 }}
            aria-label={`Show ${item.alt}`}
            aria-pressed={isActive}
            style={{
              position: 'relative',
              flexGrow: isActive ? 5 : 1,
              flexShrink: 0,
              flexBasis: 0,
              minWidth: isActive ? 220 : 56,
              height: '100%',
              borderRadius: 22,
              overflow: 'hidden',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              background: '#111',
            }}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes={isActive ? '(max-width: 768px) 80vw, 55vw' : '80px'}
              style={{ objectFit: 'cover' }}
              priority={false}
              unoptimized={false}
            />
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                background: isActive
                  ? 'linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.05) 55%, transparent 75%)'
                  : 'rgba(0,0,0,0.42)',
                transition: 'background 0.3s',
              }}
            />
            {isActive ? (
              <div style={{ position: 'absolute', left: 20, right: 20, bottom: 20, textAlign: 'left' }}>
                {(item.title ?? item.alt) && (
                  <p style={{ color: '#fff', fontWeight: 800, fontSize: 'clamp(0.95rem,1.6vw,1.2rem)', margin: 0, letterSpacing: '-0.3px' }}>
                    {item.title ?? item.alt}
                  </p>
                )}
                {item.subtitle && (
                  <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: '0.78rem', margin: '4px 0 0' }}>
                    {item.subtitle}
                  </p>
                )}
                <span
                  onClick={(e) => { e.stopPropagation(); next() }}
                  role="button"
                  tabIndex={-1}
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    bottom: 'calc(100% + 14px)',
                    left: 0,
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.92)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0d0d1c',
                  }}
                >
                  <i className="ti ti-arrow-right" aria-hidden="true" />
                </span>
              </div>
            ) : (
              <span className="sr-only">{item.alt}</span>
            )}
          </motion.button>
        )
      })}
    </div>
  )
}
