'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

interface ServiceItem {
  icon: string
  title: string
  desc: string
  href: string
}

const SERVICES: ServiceItem[] = [
  {
    icon: 'ti-video',
    title: 'YouTube Video Editing',
    desc: 'High-retention edits that keep viewers watching till the end.',
    href: '/services#youtube-editing',
  },
  {
    icon: 'ti-photo',
    title: 'Thumbnail Design',
    desc: 'Scroll-stopping thumbnails that boost CTR and views.',
    href: '/services#thumbnail-design',
  },
  {
    icon: 'ti-device-mobile-vibration',
    title: 'YouTube Shorts',
    desc: 'Viral short-form edits built for maximum reach.',
    href: '/services#shorts-editing',
  },
  {
    icon: 'ti-settings-automation',
    title: 'Channel Automation',
    desc: 'We handle your content engine so you can focus on growth.',
    href: '/services#automation',
  },
]

export function ServicesSection() {
  const E = [0.16, 1, 0.3, 1] as const

  return (
    <section
      id="services"
      aria-labelledby="services-title"
      style={{
        padding: 'min(96px, 9vw) min(40px, 6%)',
        maxWidth: '1240px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* Section Header */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          textAlign: 'left',
          marginBottom: '56px',
        }}
      >
        {/* Overline with flanking lines */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.25em',
            color: 'var(--primary-accent)',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-body)',
            marginBottom: '20px',
          }}
        >
          <span style={{ width: '32px', height: '1.5px', backgroundColor: 'var(--primary-accent)', opacity: 0.4 }} aria-hidden="true" />
          Our Services
          <span style={{ width: '32px', height: '1.5px', backgroundColor: 'var(--primary-accent)', opacity: 0.4 }} aria-hidden="true" />
        </div>

        {/* Title: Crafted for Creators. */}
        <h2
          id="services-title"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 400,
            fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
            color: 'var(--text-main)',
            letterSpacing: '-1.5px',
            lineHeight: 1.05,
          }}
        >
          Crafted for{' '}
          <span style={{ position: 'relative', display: 'inline-block' }}>
            Creators.
            {/* Small purple enso circle accent */}
            <svg
              className="enso-circle-accent"
              viewBox="0 0 100 100"
              fill="none"
              stroke="var(--primary-accent)"
              strokeWidth="7"
              strokeLinecap="round"
              style={{
                position: 'absolute',
                right: '-28px',
                top: '15%',
                width: '30px',
                height: '30px',
                transform: 'rotate(-25deg)',
                opacity: 0.95,
              }}
              aria-hidden="true"
            >
              <path d="M 80,45 C 80,20 60,10 40,15 C 20,20 10,40 15,60 C 20,80 40,90 60,85 C 75,80 82,65 75,55 C 70,50 60,50 55,55" />
            </svg>
          </span>
        </h2>
      </div>

      {/* 4-Column Grid */}
      <div className="services-grid">
        {SERVICES.map((svc, idx) => {
          const delay = idx * 0.08
          return (
            <motion.article
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay, ease: E }}
              className="service-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                textAlign: 'left',
              }}
            >
              {/* Splatter Icon */}
              <div className="splatter-icon-container" style={{ marginBottom: '24px' }}>
                <svg className="splatter-bg" viewBox="0 0 100 100" fill="currentColor">
                  <path d="M50,25 C62,20 72,30 68,45 C64,60 55,68 42,64 C28,60 32,40 37,30 C42,20 45,28 50,25 Z" />
                  <circle cx="28" cy="28" r="3.5" />
                  <circle cx="72" cy="42" r="3" />
                  <circle cx="60" cy="65" r="2.5" />
                  <circle cx="36" cy="58" r="3" />
                  <circle cx="48" cy="72" r="1.5" />
                </svg>
                <i className={`ti ${svc.icon}`} style={{ fontSize: '1.4rem', zIndex: 1 }} aria-hidden="true" />
              </div>

              {/* Bold Title */}
              <h3
                style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 800,
                  fontSize: '1.15rem',
                  color: 'var(--text-main)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.25,
                  marginBottom: '12px',
                }}
              >
                {svc.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.86rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.6,
                  marginBottom: '24px',
                  flexGrow: 1,
                }}
              >
                {svc.desc}
              </p>

              {/* Explore Link */}
              <Link
                href={svc.href}
                className="explore-link"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  color: 'var(--primary-accent)',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'color 0.25s ease, gap 0.25s ease',
                }}
              >
                Explore <span className="arrow" style={{ fontSize: '0.9rem', transition: 'transform 0.25s' }}>&rarr;</span>
              </Link>
            </motion.article>
          )
        })}
      </div>

      <style>{`
        .services-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .explore-link:hover {
          color: var(--primary-accent-hover) !important;
        }
        .explore-link:hover .arrow {
          transform: translateX(4px);
        }
        .explore-link:focus-visible {
          outline: 2px solid var(--primary-accent);
          outline-offset: 4px;
          border-radius: 4px;
        }

        @media (max-width: 1024px) {
          .services-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 24px !important;
          }
        }

        @media (max-width: 640px) {
          .services-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .service-card {
            padding: 28px 20px !important;
          }
        }
      `}</style>
    </section>
  )
}
