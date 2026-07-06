'use client'

import { motion } from 'framer-motion'

interface ProcessStep {
  number: string
  title: string
  desc: string
}

const STEPS: ProcessStep[] = [
  {
    number: '01',
    title: 'Share Your Vision',
    desc: 'Tell us about your channel, goals, and style.',
  },
  {
    number: '02',
    title: 'We Plan & Edit',
    desc: 'Our editors craft high-quality content tailored for you.',
  },
  {
    number: '03',
    title: 'Review & Refine',
    desc: 'You review, give feedback, we refine.',
  },
  {
    number: '04',
    title: 'Delivered & Optimized',
    desc: 'Final delivery, optimized for growth.',
  },
]

export function ProcessSection() {
  const E = [0.16, 1, 0.3, 1] as const

  return (
    <section
      id="process"
      aria-labelledby="process-title"
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
          marginBottom: '64px',
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
          Our Process
          <span style={{ width: '32px', height: '1.5px', backgroundColor: 'var(--primary-accent)', opacity: 0.4 }} aria-hidden="true" />
        </div>

        {/* Title: Simple. Clear. Effective. */}
        <h2
          id="process-title"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 400,
            fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
            color: 'var(--text-main)',
            letterSpacing: '-1.5px',
            lineHeight: 1.05,
          }}
        >
          Simple. Clear.{' '}
          <span className="brush-highlight">
            Effective.
            <svg className="brush-underline" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path
                d="M 2,6 C 25,3 55,4 98,7 C 75,7 40,8 10,9"
                fill="none"
                stroke="var(--primary-accent)"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h2>
      </div>

      {/* Timeline Wrapper */}
      <div className="timeline-container" style={{ position: 'relative' }}>
        {/* Horizontal Dotted Connector Line (Desktop) */}
        <div className="desktop-connector-line" aria-hidden="true" />

        {/* Vertical Dotted Connector Line (Mobile) */}
        <div className="mobile-connector-line" aria-hidden="true" />

        {/* Steps Grid */}
        <div className="steps-grid">
          {STEPS.map((step, idx) => {
            const delay = idx * 0.08
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.7, delay, ease: E }}
                className="step-item"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                {/* Numbered Circle */}
                <div
                  className="step-circle"
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    border: '2px solid var(--primary-accent)',
                    backgroundColor: 'var(--bg)',
                    color: 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                    fontWeight: 400,
                    fontFamily: 'var(--font-display)',
                    marginBottom: '20px',
                    transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.25s',
                    zIndex: 2,
                    boxShadow: '0 0 10px rgba(124, 58, 237, 0.05)',
                  }}
                >
                  {step.number}
                </div>

                {/* Step Title */}
                <h3
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    color: 'var(--text-main)',
                    marginBottom: '10px',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {step.title}
                </h3>

                {/* Step Description */}
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.6,
                    maxWidth: '240px',
                    margin: 0,
                  }}
                >
                  {step.desc}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>

      <style>{`
        .desktop-connector-line {
          position: absolute;
          top: 26px;
          left: 12.5%;
          right: 12.5%;
          height: 0;
          border-top: 2px dotted var(--border-subtle);
          z-index: 1;
        }
        .mobile-connector-line {
          display: none;
        }
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        .step-item:hover .step-circle {
          border-color: var(--primary-accent-hover) !important;
          transform: scale(1.08);
          box-shadow: 0 0 15px rgba(124, 58, 237, 0.25) !important;
        }

        @media (max-width: 1024px) {
          .desktop-connector-line {
            display: none !important;
          }
          .steps-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 40px !important;
          }
          .step-item {
            align-items: center !important;
            text-align: center !important;
          }
        }

        @media (max-width: 640px) {
          .steps-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .mobile-connector-line {
            display: block !important;
            position: absolute;
            top: 26px;
            bottom: 26px;
            left: 26px;
            width: 0;
            border-left: 2px dotted var(--border-subtle);
            z-index: 1;
          }
          .step-item {
            flex-direction: row !important;
            align-items: flex-start !important;
            text-align: left !important;
            gap: 16px;
          }
          .step-circle {
            margin-bottom: 0 !important;
            flex-shrink: 0;
          }
          .step-item h3 {
            margin-top: 4px;
            margin-bottom: 6px !important;
          }
          .step-item p {
            max-width: 100% !important;
          }
        }
      `}</style>
    </section>
  )
}
