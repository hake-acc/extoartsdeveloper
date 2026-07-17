// Server Component — scroll-reveal via .sr CSS class + ClientScripts IntersectionObserver

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
          {STEPS.map((step, idx) => (
              <div
                key={idx}
                className="step-item sr"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  position: 'relative',
                  zIndex: 2,
                  transitionDelay: `${idx * 80}ms`,
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
              </div>
          ))}
        </div>
      </div>

      <style>{`
        /* Hide the legacy full-width connector; we'll draw per-step segments */
        .desktop-connector-line {
          display: none;
        }
        .mobile-connector-line {
          display: none;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          align-items: start;
        }

        /* Per-step connector segments for desktop: each step draws
           a left and right dotted segment that meet between items. */
        @media (min-width: 1025px) {
          .step-item {
            position: relative;
          }

          .step-item::before,
          .step-item::after {
            content: '';
            position: absolute;
            top: 26px;
            height: 0;
            border-top: 2px dotted var(--border-subtle);
            z-index: 1;
            width: calc(50% + 12px);
          }

          /* left segment reaches halfway to previous column (plus half gap) */
          .step-item::before {
            left: calc(-50% - 12px);
          }

          /* right segment reaches halfway to next column (plus half gap) */
          .step-item::after {
            left: calc(100% - 12px);
          }

          /* don't draw segments outside the row */
          .step-item:first-child::before,
          .step-item:last-child::after {
            display: none;
          }

          /* ensure the circle sits above the connector */
          .step-circle {
            position: relative;
            z-index: 2;
            background: var(--bg);
          }
        }

        .step-item:hover .step-circle {
          border-color: var(--primary-accent-hover) !important;
          transform: scale(1.08);
          box-shadow: 0 0 15px rgba(124, 58, 237, 0.25) !important;
        }

        @media (max-width: 1024px) {
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
            gap: 0 !important;
          }
          /* Vertical connector for mobile: dashed purple line behind the circles */
          .mobile-connector-line {
            display: block !important;
            position: absolute;
            left: 32px;
            top: 8px;
            bottom: 8px;
            width: 0;
            border-left: 4px dashed var(--primary-accent);
            z-index: 1;
            opacity: 0.95;
          }
          .step-item {
            flex-direction: row !important;
            align-items: flex-start !important;
            text-align: left !important;
            gap: 20px;
            padding: 20px 0;
            border-bottom: 1px solid var(--border);
          }
          .step-item:last-child {
            border-bottom: none;
          }
          .step-circle {
            margin-bottom: 0 !important;
            flex-shrink: 0;
            width: 48px !important;
            height: 48px !important;
            font-size: 1.1rem !important;
            background: var(--nav-bg) !important;
            border: 2px solid var(--primary-accent) !important;
          }
          .step-item h3 {
            font-size: 1rem !important;
            margin-top: 4px;
            margin-bottom: 8px !important;
            color: var(--text-main) !important;
          }
          .step-item p {
            max-width: 100% !important;
            font-size: 0.88rem !important;
            color: var(--text-muted) !important;
          }
        }
      `}</style>
    </section>
  )
}
