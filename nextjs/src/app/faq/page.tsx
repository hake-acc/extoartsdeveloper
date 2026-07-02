import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/metadata'
import { JsonLd } from '@/components/JsonLd'

export const metadata: Metadata = buildMetadata({
  title: 'YouTube Video Editing FAQ - ExtoArts Questions Answered',
  description: 'Complete FAQ for ExtoArts YouTube video editing agency. Pricing, turnaround, process, revisions, gaming editing, faceless channels, and getting started.',
  path: '/faq',
})

const FAQ_SECTIONS = [
  {
    section: 'Getting Started',
    items: [
      { q: 'How do I get started with ExtoArts?', a: 'Join our Discord server at discord.gg/extoarts and open a private support ticket. Tell us your niche, editing style, upload frequency, and budget. A team lead will reply within hours with editor recommendations and a custom quote.' },
      { q: 'Do I need to sign a contract?', a: 'No long-term contracts required. We work project-by-project unless you choose a monthly retainer plan. A simple order confirmation is exchanged for each project, but there are no minimum commitments.' },
      { q: 'Can I request a trial edit?', a: 'Yes. We can do a short trial edit (usually 1-2 minutes of your footage) so you can see the editing quality before committing to a full project. Trial edits are priced at our standard rate.' },
      { q: 'What information do you need to get started?', a: 'We need: (1) your YouTube channel link or niche description, (2) style references (channels you want to sound/look like), (3) raw footage or brief, (4) your editing budget, and (5) your upload schedule and deadlines.' },
    ],
  },
  {
    section: 'Pricing & Payments',
    items: [
      { q: 'How does the 10% fee model work?', a: 'You tell us your editing budget per video. ExtoArts takes 10% as the agency management fee. The remaining 90% goes directly to your assigned specialist editor. If your budget is $300, ExtoArts takes $30, and your editor receives $270.' },
      { q: 'Are there any hidden fees?', a: 'No. The quote we send you is the final price. No setup fees, no account management fees, no surprise charges. If a project needs add-ons (extra motion graphics, licensed music, etc.), these are quoted separately before any work begins.' },
      { q: 'What payment methods do you accept?', a: 'PayPal, bank transfer, USDT, BTC, ETH, UPI (India), EasyPaisa (Pakistan), Bkash (Bangladesh), and PKR transfer. Most projects require a 50% deposit before work begins, with the remaining 50% due before final delivery.' },
      { q: 'Do you offer refunds?', a: 'If we fail to deliver a completed project, you receive a full refund. If you cancel mid-project after work has begun, a partial refund is issued based on work completed. Final approved files are non-refundable as the work has been delivered and accepted.' },
    ],
  },
  {
    section: 'Services & Turnaround',
    items: [
      { q: 'How long does a standard YouTube video edit take?', a: 'Standard turnaround is 3-5 business days for most YouTube videos (10-20 minutes). Shorter videos or simpler projects may be delivered faster. Rush delivery (24-48 hours) is available for an additional fee.' },
      { q: 'How long does thumbnail design take?', a: 'Custom thumbnail design is delivered in 24-48 hours. This includes 1-2 revision rounds. Urgent thumbnails (same-day) are available with a rush fee depending on team availability.' },
      { q: 'Do you handle faceless YouTube channels?', a: 'Yes. We offer complete done-for-you faceless channel production: script writing, voiceover integration (AI or human), full video editing, thumbnail design, upload scheduling, and YouTube SEO. Pricing is quoted per project based on video length and complexity.' },
      { q: 'What editing software do your editors use?', a: 'Our editors primarily work in Adobe Premiere Pro, Final Cut Pro, and After Effects. For motion graphics and VFX, we use After Effects exclusively. Tools are disclosed in your editor profile when we make the match.' },
    ],
  },
  {
    section: 'Revisions & Quality',
    items: [
      { q: 'How many revision rounds are included?', a: 'Standard projects include a minimum of 3 rounds of revisions. ExtoArts also runs a quality-control review before each initial delivery, which means most clients use fewer revisions than the maximum included. Monthly retainer clients receive unlimited revisions within scope. Additional revision rounds beyond the included count are billed at a flat hourly rate.' },
      { q: 'What counts as a revision vs. a new edit?', a: 'A revision is any change that falls within the original brief - adjusting cuts, fixing pacing, changing color grades, updating captions, or adding music. A new edit means changing the fundamental direction (different style, different footage, different format) and is quoted as a new project.' },
      { q: 'What if I am not happy with the final result?', a: 'Contact us via Discord and explain specifically what needs to change. We will work with you until the result meets the original brief. If the dissatisfaction stems from something we failed to deliver that was clearly in the brief, the additional revision is at no charge.' },
    ],
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_SECTIONS.flatMap((section) =>
    section.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    }))
  ),
}

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <h1 className="sr-only">ExtoArts Frequently Asked Questions</h1>

      <section style={{ padding: 'min(20vh,160px) min(20px,5%) min(60px,6vw)', textAlign: 'center', maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <span className="hero-badge" style={{ marginBottom: 28 }}>
          <span className="hero-badge-dot" aria-hidden="true" />
          {FAQ_SECTIONS.reduce((acc, s) => acc + s.items.length, 0)} Questions Answered
        </span>
        <h1 style={{ fontSize: 'clamp(2.6rem,7vw,5rem)', fontWeight: 900, letterSpacing: '-2.5px', lineHeight: 1.0, marginBottom: 24, color: 'var(--text-main)' }}>
          Frequently Asked<br /><span className="sweep-text">Questions.</span>
        </h1>
        <p style={{ fontSize: 'clamp(1rem,1.8vw,1.15rem)', color: 'var(--text-muted)', maxWidth: 480, margin: '0 auto', lineHeight: 1.72 }}>
          Everything you need to know about working with ExtoArts - from first contact to final delivery.
        </p>
      </section>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 min(20px,5%) min(100px,10vw)', position: 'relative', zIndex: 10 }}>
        {FAQ_SECTIONS.map((section) => (
          <div key={section.section} style={{ marginBottom: 52 }}>
            <h2 style={{ fontSize: '0.72rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px', color: 'var(--primary)', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="gradient-dot" aria-hidden="true" />
              {section.section}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {section.items.map((item) => (
                <details key={item.q} className="faq-item">
                  <summary style={{ padding: '20px 24px', fontWeight: 700, fontSize: '0.97rem', color: 'var(--text-main)', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                    {item.q}
                    <i className="ti ti-chevron-down" aria-hidden="true" style={{ color: 'var(--primary)', flexShrink: 0, fontSize: '0.9rem' }} />
                  </summary>
                  <p style={{ padding: '0 24px 22px', fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.75, margin: 0, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        ))}

        {/* Still have questions */}
        <div className="tilt-card glass-card sr" style={{ border: '1px solid rgba(34,211,238,0.2)', borderRadius: 20, padding: 'min(40px,4vw)', textAlign: 'center' }}>
          <div className="tilt-inner">
            <i className="ti ti-help-circle" aria-hidden="true" style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: 16, display: 'block' }} />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: 10 }}>Still have questions?</h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.65 }}>
              Join our Discord server and ask directly. A team lead will answer personally within hours.
            </p>
            <a href="https://discord.gg/extoarts-1402333030827425922" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#5865f2', color: '#fff', padding: '11px 24px', borderRadius: 14, fontSize: '0.84rem', fontWeight: 800, textDecoration: 'none' }}>
              <i className="ti ti-brand-discord" aria-hidden="true" /> Ask on Discord
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
