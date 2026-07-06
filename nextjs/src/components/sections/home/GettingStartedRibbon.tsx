'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AccordionItem {
  icon: string
  question: string
  answer: string
}

const ITEMS: AccordionItem[] = [
  {
    icon: 'ti-wand',
    question: 'How do I get started with ExtoArts?',
    answer: 'Simply share your raw footage, style guides, and assets. We will match you with a specialist editor and set up a private chat to start production.',
  },
  {
    icon: 'ti-file-pencil',
    question: 'Do I need to sign a contract?',
    answer: 'No, there are no long-term contracts or retainer lock-ins. You can work with us on a flat per-project fee or monthly subscription. Pause or cancel anytime.',
  },
  {
    icon: 'ti-sparkles',
    question: 'Can I request a trial edit?',
    answer: 'Yes! We offer a discounted or free short trial edit for qualified creators, so you can test our editing quality and workflow before committing.',
  },
  {
    icon: 'ti-info-circle',
    question: 'What information do you need to get started?',
    answer: 'We need your footage, style references (videos you like), assets (logos, fonts, overlays), and clear goals for the video project.',
  },
]

export function GettingStartedRibbon() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close desktop dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveIdx(null)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  return (
    <section
      id="getting-started"
      className="torn-banner"
      ref={containerRef}
      style={{
        width: '100%',
        padding: '56px min(40px, 6%)',
        position: 'relative',
        zIndex: 20,
        marginTop: '20px',
        marginBottom: '60px',
      }}
    >
      {/* Wavy/Torn Top edge overlap */}
      <svg
        className="absolute top-[-11px] left-0 w-full h-[12px] pointer-events-none"
        viewBox="0 0 1440 20"
        preserveAspectRatio="none"
        style={{ fill: '#050507' }}
      >
        <path d="M 0,20 C 100,8 200,18 300,10 C 400,2 500,12 600,6 C 700,0 800,16 900,10 C 1000,4 1100,12 1200,8 C 1300,4 1380,14 1440,20 L 1440,20 L 0,20 Z" />
      </svg>

      {/* Wavy/Torn Bottom edge overlap */}
      <svg
        className="absolute bottom-[-11px] left-0 w-full h-[12px] pointer-events-none"
        viewBox="0 0 1440 20"
        preserveAspectRatio="none"
        style={{ fill: '#050507', transform: 'scaleY(-1)' }}
      >
        <path d="M 0,20 C 100,8 200,18 300,10 C 400,2 500,12 600,6 C 700,0 800,16 900,10 C 1000,4 1100,12 1200,8 C 1300,4 1380,14 1440,20 L 1440,20 L 0,20 Z" />
      </svg>

      {/* Ribbon content container */}
      <div
        className="ribbon-grid"
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'grid',
          alignItems: 'center',
          gap: '32px',
        }}
      >
        {/* Title Column */}
        <div className="ribbon-title-col">
          <span
            style={{
              fontSize: '0.62rem',
              fontWeight: 700,
              letterSpacing: '0.2em',
              color: 'var(--primary-accent)',
              display: 'block',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-body)',
              marginBottom: '6px',
            }}
          >
            Workflow
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 400,
              fontSize: '2rem',
              color: '#f4efe6',
              letterSpacing: '-0.5px',
              lineHeight: 1.1,
            }}
          >
            Getting <br style={{ display: 'none' }} /> Started.
          </h2>
        </div>

        {/* Accordions Column */}
        <div className="ribbon-items-row">
          {ITEMS.map((item, idx) => {
            const isOpen = activeIdx === idx
            return (
              <div
                key={idx}
                className="ribbon-item-wrapper"
                style={{
                  position: 'relative',
                }}
              >
                {/* Accordion Trigger */}
                <button
                  onClick={() => setActiveIdx(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="ribbon-trigger"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: 'transparent',
                    border: 'none',
                    color: '#f4efe6',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    padding: '8px 0',
                    outline: 'none',
                  }}
                >
                  {/* Ink Splatter Icon */}
                  <div className="splatter-icon-container">
                    <svg className="splatter-bg" viewBox="0 0 100 100" fill="currentColor">
                      <path d="M50,25 C62,20 72,30 68,45 C64,60 55,68 42,64 C28,60 32,40 37,30 C42,20 45,28 50,25 Z" />
                      <circle cx="28" cy="28" r="3.5" />
                      <circle cx="72" cy="42" r="3" />
                      <circle cx="60" cy="65" r="2.5" />
                      <circle cx="36" cy="58" r="3" />
                      <circle cx="48" cy="72" r="1.5" />
                    </svg>
                    <i className={`ti ${item.icon}`} style={{ fontSize: '1.25rem', zIndex: 1, color: 'var(--primary-accent)' }} aria-hidden="true" />
                  </div>

                  {/* Question Text */}
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      lineHeight: 1.3,
                      flex: 1,
                      paddingRight: '6px',
                    }}
                  >
                    {item.question}
                  </span>

                  {/* Chevron */}
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      color: 'var(--text-muted)',
                      fontSize: '0.9rem',
                    }}
                  >
                    <i className="ti ti-chevron-down" aria-hidden="true" />
                  </motion.span>
                </button>

                {/* Desktop Dropdown Popover */}
                <div className="desktop-popover-container">
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                          position: 'absolute',
                          top: 'calc(100% + 14px)',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '280px',
                          backgroundColor: '#0a0a0c',
                          border: '1px solid rgba(124, 58, 237, 0.25)',
                          borderRadius: '12px',
                          padding: '16px 18px',
                          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.65), 0 0 16px rgba(124, 58, 237, 0.08)',
                          zIndex: 50,
                        }}
                      >
                        {/* Caret */}
                        <div
                          style={{
                            position: 'absolute',
                            top: '-6px',
                            left: '50%',
                            transform: 'translateX(-50%) rotate(45deg)',
                            width: '10px',
                            height: '10px',
                            backgroundColor: '#0a0a0c',
                            borderTop: '1px solid rgba(124, 58, 237, 0.25)',
                            borderLeft: '1px solid rgba(124, 58, 237, 0.25)',
                          }}
                        />
                        <p
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '0.8rem',
                            color: '#eaddca',
                            lineHeight: 1.6,
                            margin: 0,
                          }}
                        >
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mobile Inline Collapsible Accordion */}
                <div className="mobile-accordion-container" style={{ overflow: 'hidden' }}>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div
                          style={{
                            padding: '12px 14px 16px 44px',
                            color: 'var(--muted-text)',
                            fontSize: '0.82rem',
                            lineHeight: 1.5,
                            fontFamily: 'var(--font-body)',
                            borderLeft: '2px solid rgba(124, 58, 237, 0.3)',
                            marginLeft: '26px',
                            marginTop: '4px',
                          }}
                        >
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <style>{`
        .ribbon-grid {
          grid-template-columns: 240px 1fr;
        }
        .ribbon-items-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .desktop-popover-container {
          display: block;
        }
        .mobile-accordion-container {
          display: none;
        }
        
        .ribbon-trigger:hover {
          color: var(--primary-accent-hover) !important;
        }
        .ribbon-trigger:hover .splatter-bg {
          color: rgba(124, 58, 237, 0.28) !important;
        }
        .ribbon-trigger:focus-visible {
          outline: 2px solid var(--primary-accent);
          outline-offset: 4px;
          border-radius: 8px;
        }

        @media (max-width: 1024px) {
          .ribbon-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .ribbon-items-row {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 24px !important;
          }
        }

        @media (max-width: 640px) {
          .ribbon-items-row {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .desktop-popover-container {
            display: none !important;
          }
          .mobile-accordion-container {
            display: block !important;
          }
          .ribbon-trigger {
            padding: 12px 0 !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
          }
        }
      `}</style>
    </section>
  )
}
