import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/metadata'
import { JsonLd } from '@/components/JsonLd'
import { SITE_URL } from '@/lib/constants'
import { DiscordButton } from '@/components/ui/DiscordButton'

export const metadata: Metadata = buildMetadata({
  title: 'How ExtoArts Works - Project Workflow & Process',
  description: 'See exactly how ExtoArts manages your YouTube editing project from brief to delivery. Transparent workflow, clear milestones, and consistent communication.',
  path: '/workflow',
})

const STEPS = [
  { num: '01', icon: 'ti-message-circle', title: 'Discovery Call (Discord Ticket)', desc: 'You join our Discord server and open a private ticket. Share your niche, style references, video length, upload frequency, and editing budget. A team lead reviews your brief personally.', duration: '1-2 hours', color: '#69ddff' },
  { num: '02', icon: 'ti-users', title: 'Editor Matching', desc: 'Based on your niche and style, we identify the specialist editor in our team who fits best. You receive their portfolio section showing work from creators in your category.', duration: 'Same day', color: '#96cdff' },
  { num: '03', icon: 'ti-file-invoice', title: 'Custom Quote', desc: 'We send a fully itemized quote: editing rate, agency fee (10%), turnaround time, revision rounds, and any add-ons. No hidden fees appear after approval.', duration: '2-4 hours', color: '#dbbadd' },
  { num: '04', icon: 'ti-upload', title: 'Footage Submission', desc: 'You approve the quote and pay a 50% deposit. Then you send your raw footage via your preferred file transfer method (Google Drive, WeTransfer, Dropbox). We provide guidance if needed.', duration: '24 hours', color: '#be92a2' },
  { num: '05', icon: 'ti-movie', title: 'Production & Editing', desc: 'Your assigned editor begins production. You receive progress updates via Discord. The editor follows your style guide, uses your approved music, and builds to your content benchmarks.', duration: '3-5 business days', color: '#69ddff' },
  { num: '06', icon: 'ti-eye', title: 'Review & Revisions', desc: 'We deliver a first cut for your review. You provide feedback directly in Discord with timestamps. We apply revisions until you\'re satisfied. Most projects close in 1-2 revision rounds.', duration: '1-2 days', color: '#96cdff' },
  { num: '07', icon: 'ti-check', title: 'Final Delivery & Payment', desc: 'Once you approve the final version, we send all export files (YouTube-optimized MP4, any raw files requested). The remaining 50% balance is due before the final delivery link is shared.', duration: 'Same day', color: '#a3e635' },
  { num: '08', icon: 'ti-refresh', title: 'Ongoing Retainer (Optional)', desc: 'For creators with consistent upload schedules, we set up a dedicated workflow: recurring file submission, priority queue, monthly invoice, and a reserved editor slot.', duration: 'Ongoing', color: '#dbbadd' },
]

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Work with ExtoArts for YouTube Video Editing',
  description: 'The complete workflow for working with ExtoArts from first contact to final delivery.',
  step: STEPS.map((s, i) => ({
    '@type': 'HowToStep',
    position: i + 1,
    name: s.title,
    text: s.desc,
  })),
}

export default function WorkflowPage() {
  return (
    <>
      <JsonLd data={howToSchema} />
      <p className="sr-only">How ExtoArts Works - YouTube Editing Workflow</p>

      {/* Hero */}
      <section style={{ padding: 'min(20vh,160px) min(20px,5%) min(60px,6vw)', textAlign: 'center', maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <span className="hero-badge" style={{ marginBottom: 28 }}>
          <span className="hero-badge-dot" aria-hidden="true" />
          8-Step Pipeline
        </span>
        <h1 style={{ fontSize: 'clamp(2rem,7vw,5rem)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.0, marginBottom: 24, color: 'var(--text-main)', textShadow: '0 2px 16px rgba(0,0,0,0.7)' }}>
          A Process Built<br /><span className="sweep-text">for Creators.</span>
        </h1>
        <p style={{ fontSize: 'clamp(0.9rem,1.8vw,1.15rem)', color: 'var(--text-muted)', maxWidth: 500, margin: '0 auto', lineHeight: 1.72, textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}>
          Every ExtoArts project follows the same transparent pipeline. Clear checkpoints, no black boxes - brief to delivery with zero surprises.
        </p>
      </section>

      {/* Pipeline */}
      <section style={{ padding: '0 min(16px,4%) min(80px,10vw)', maxWidth: 860, margin: '0 auto', position: 'relative', zIndex: 10, width: '100%', boxSizing: 'border-box' }}>

        {/* Progress bar header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 40, padding: '0 4px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'] }}>
          {STEPS.map((step, i) => (
            <div key={step.num} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? '1 1 auto' : '0 0 auto', minWidth: 0 }}>
              {/* Step dot */}
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: `rgba(${i < 3 ? '105,221,255' : i < 6 ? '150,205,255' : '219,186,221'},0.12)`,
                border: `2px solid ${step.color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, fontSize: '0.55rem', fontWeight: 900, color: step.color,
                boxShadow: `0 0 10px ${step.color}30`,
              }}>
                {step.num}
              </div>
              {/* Connector */}
              {i < STEPS.length - 1 && (
                <div style={{
                  flex: 1, height: 2, minWidth: 6,
                  background: `linear-gradient(90deg, ${step.color}60, ${STEPS[i + 1].color}60)`,
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
          {STEPS.map((step, i) => (
            <article
              key={step.num}
              className="sr workflow-article"
              style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: 0, animationDelay: `${i * 50}ms`, width: '100%', minWidth: 0 }}
            >
              {/* Left: checkpoint circle + connector line */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 4 }}>
                {/* Checkpoint circle */}
                <div style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: 'var(--surface)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: `2px solid ${step.color}90`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, position: 'relative', zIndex: 1,
                  boxShadow: `0 0 20px ${step.color}30, inset 0 0 10px ${step.color}20`,
                }}>
                  {/* Inner check ring */}
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'var(--surface-2)',
                    border: `1px solid ${step.color}70`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <i className={`ti ${step.icon}`} aria-hidden="true" style={{ color: step.color, fontSize: '0.95rem', textShadow: `0 0 10px ${step.color}80` }} />
                  </div>
                  {/* Step number badge */}
                  <span style={{
                    position: 'absolute', top: -4, right: -4,
                    width: 18, height: 18, borderRadius: '50%',
                    background: step.color, color: '#000',
                    fontSize: '0.5rem', fontWeight: 900,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 0 8px ${step.color}80`,
                  }}>
                    {step.num}
                  </span>
                </div>
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div style={{
                    width: 2, flex: 1, minHeight: 20, marginTop: 4,
                    background: `linear-gradient(180deg, ${step.color}, ${STEPS[i + 1].color}90)`,
                    borderRadius: 999,
                    boxShadow: `0 0 8px ${step.color}40`,
                  }} />
                )}
              </div>

              {/* Right: content card */}
              <div
                className="tilt-card glass-card"
                style={{
                  border: `1px solid var(--border)`,
                  borderLeft: `2px solid ${step.color}30`,
                  borderRadius: 18,
                  padding: '20px 24px',
                  marginLeft: 12,
                  marginBottom: i < STEPS.length - 1 ? 0 : 0,
                }}
              >
                <div className="tilt-inner">
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0, flex: 1 }}>
                      <span style={{
                        fontSize: '0.56rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px',
                        color: step.color,
                        background: `${step.color}12`,
                        border: `1px solid ${step.color}28`,
                        padding: '3px 10px', borderRadius: 999,
                        alignSelf: 'flex-start',
                      }}>
                        Checkpoint {step.num}
                      </span>
                      <h2 className="workflow-card-title" style={{ fontSize: 'clamp(0.85rem,2.5vw,1.05rem)', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.2px', fontFamily: 'var(--font-body)', lineHeight: 1.3 }}>
                        {step.title}
                      </h2>
                    </div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap', flexShrink: 0 }}>
                      <i className="ti ti-clock" aria-hidden="true" style={{ color: step.color, fontSize: '0.8rem' }} />
                      {step.duration}
                    </span>
                  </div>
                  <p style={{ fontSize: 'clamp(0.78rem,2vw,0.85rem)', color: 'var(--text-muted)', lineHeight: 1.72, margin: 0 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: 56, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <DiscordButton className="btn btn-main">
            <i className="ti ti-brand-discord" aria-hidden="true" /> Start Your Project
          </DiscordButton>
          <Link href="/pricing" className="btn btn-glass">
            <i className="ti ti-percentage" aria-hidden="true" /> View Pricing
          </Link>
        </div>
      </section>

      <style>{`
        .workflow-article {
          width: 100%;
          box-sizing: border-box;
          overflow: hidden;
        }
        @media (max-width: 540px) {
          .workflow-article {
            grid-template-columns: 48px 1fr !important;
          }
          .workflow-article > div:first-child > div:first-child {
            width: 42px !important;
            height: 42px !important;
          }
          .workflow-article > div:last-child {
            margin-left: 8px !important;
            padding: 14px 14px !important;
          }
          .workflow-card-title {
            font-size: 0.88rem !important;
            font-family: var(--font-body) !important;
          }
        }
      `}</style>
    </>
  )
}
