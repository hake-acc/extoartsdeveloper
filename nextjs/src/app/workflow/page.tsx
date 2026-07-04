import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/metadata'
import { JsonLd } from '@/components/JsonLd'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { SITE_URL } from '@/lib/constants'
import { DiscordButton } from '@/components/ui/DiscordButton'

export const metadata: Metadata = buildMetadata({
  title: 'How ExtoArts Works - Project Workflow & Process',
  description: 'See exactly how ExtoArts manages your YouTube editing project from brief to delivery. Transparent workflow, clear milestones, and consistent communication.',
  path: '/workflow',
})

const STEPS = [
  { num: '01', icon: 'ti-message-circle', title: 'Discovery Call (Discord Ticket)', desc: 'You join our Discord server and open a private ticket. Share your niche, style references, video length, upload frequency, and editing budget. A team lead reviews your brief personally.', duration: '1-2 hours' },
  { num: '02', icon: 'ti-users', title: 'Editor Matching', desc: 'Based on your niche and style, we identify the specialist editor in our team who fits best. You receive their portfolio section showing work from creators in your category.', duration: 'Same day' },
  { num: '03', icon: 'ti-file-invoice', title: 'Custom Quote', desc: 'We send a fully itemized quote: editing rate, agency fee (10%), turnaround time, revision rounds, and any add-ons. No hidden fees appear after approval.', duration: '2-4 hours' },
  { num: '04', icon: 'ti-upload', title: 'Footage Submission', desc: 'You approve the quote and pay a 50% deposit. Then you send your raw footage via your preferred file transfer method (Google Drive, WeTransfer, Dropbox). We provide guidance if needed.', duration: '24 hours' },
  { num: '05', icon: 'ti-movie', title: 'Production & Editing', desc: 'Your assigned editor begins production. You receive progress updates via Discord. The editor follows your style guide, uses your approved music, and builds to your content benchmarks.', duration: '3-5 business days' },
  { num: '06', icon: 'ti-eye', title: 'Review & Revisions', desc: 'We deliver a first cut for your review. You provide feedback directly in Discord with timestamps. We apply revisions until you\'re satisfied. Most projects close in 1-2 revision rounds.', duration: '1-2 days' },
  { num: '07', icon: 'ti-check', title: 'Final Delivery & Payment', desc: 'Once you approve the final version, we send all export files (YouTube-optimized MP4, any raw files requested). The remaining 50% balance is due before the final delivery link is shared.', duration: 'Same day as approval' },
  { num: '08', icon: 'ti-refresh', title: 'Ongoing Retainer (Optional)', desc: 'For creators with consistent upload schedules, we set up a dedicated workflow: recurring file submission, priority queue, monthly invoice, and a reserved editor slot.', duration: 'Ongoing' },
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
          8-Step Process
        </span>
        <h1 style={{ fontSize: 'clamp(2.6rem,7vw,5rem)', fontWeight: 900, letterSpacing: '-2.5px', lineHeight: 1.0, marginBottom: 24, color: 'var(--text-main)' }}>
          A Process Built<br /><span className="sweep-text">for Creators.</span>
        </h1>
        <p style={{ fontSize: 'clamp(1rem,1.8vw,1.15rem)', color: 'var(--text-muted)', maxWidth: 500, margin: '0 auto', lineHeight: 1.72 }}>
          Every ExtoArts project follows the same transparent workflow. No surprises, no black boxes - just clear milestones from brief to delivery.
        </p>
      </section>

      {/* Steps */}
      <section style={{ padding: '0 min(20px,5%) min(100px,10vw)', maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <div style={{ position: 'relative' }}>
          {/* Timeline line */}
          <div style={{ position: 'absolute', left: 28, top: 0, bottom: 0, width: 1, background: 'var(--border)' }} aria-hidden="true" />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {STEPS.map((step, i) => (
              <article
                key={step.num}
                className="sr"
                style={{ display: 'flex', gap: 28, paddingBottom: i < STEPS.length - 1 ? 40 : 0, animationDelay: `${i * 60}ms` }}
              >
                {/* Step number */}
                <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      background: 'var(--surface)',
                      border: '2px solid rgba(34,211,238,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 0 20px rgba(34,211,238,0.08)',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    <i className={`ti ${step.icon}`} aria-hidden="true" style={{ color: 'var(--primary)', fontSize: '1.3rem' }} />
                  </div>
                </div>

                {/* Content */}
                <div className="tilt-card glass-card" style={{ border: '1px solid var(--border)', borderRadius: 18, padding: '24px 28px', flex: 1, marginBottom: i < STEPS.length - 1 ? 0 : 0 }}>
                  <div className="tilt-inner">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: '0.6rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)', background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.16)', padding: '3px 10px', borderRadius: 999 }}>
                          Step {step.num}
                        </span>
                        <h2 style={{ fontSize: 'clamp(0.95rem,2vw,1.15rem)', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.2px' }}>
                          {step.title}
                        </h2>
                      </div>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}>
                        <i className="ti ti-clock" aria-hidden="true" style={{ color: 'var(--primary)', fontSize: '0.8rem' }} />
                        {step.duration}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.72, margin: 0 }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 56 }}>
          <DiscordButton className="btn btn-main" style={{ marginRight: 12 }}>
            <i className="ti ti-brand-discord" aria-hidden="true" /> Start Your Project
          </DiscordButton>
          <Link href="/pricing" className="btn btn-glass">
            <i className="ti ti-percentage" aria-hidden="true" /> View Pricing
          </Link>
        </div>
      </section>
    </>
  )
}
