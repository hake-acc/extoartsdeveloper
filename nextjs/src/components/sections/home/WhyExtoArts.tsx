import Link from 'next/link'
import { SectionHeader } from '@/components/ui/SectionHeader'

const REASONS = [
  {
    icon: 'ti-percentage',
    title: '10% Flat Fee - No Hidden Costs',
    desc: 'Traditional agencies take 30-50%. We take 10%. 90% of your editing budget goes directly to the specialist editor assigned to your project.',
    highlight: '90% to your editor',
    color: 'rgba(34,211,238,0.08)',
    borderColor: 'rgba(34,211,238,0.16)',
  },
  {
    icon: 'ti-target',
    title: 'Niche-Matched Specialists',
    desc: "We don't assign a generalist editor to your gaming channel. You get a gaming editor - someone who lives and breathes your content type.",
    highlight: 'Not generalists',
    color: 'rgba(29,78,216,0.08)',
    borderColor: 'rgba(29,78,216,0.16)',
  },
  {
    icon: 'ti-clock-check',
    title: 'Real Deadlines. Real Accountability.',
    desc: "Missed deadline = free project. That's our policy. We don't give excuses - we give results within the timeframe we agree on.",
    highlight: '3-5 day turnaround',
    color: 'rgba(34,211,238,0.08)',
    borderColor: 'rgba(34,211,238,0.16)',
  },
  {
    icon: 'ti-shield-check',
    title: 'No Lock-In. No Retainers Required.',
    desc: 'Pay per project or set up a monthly volume deal. Either way, no minimum commitments, no setup fees, and no cancellation penalties.',
    highlight: 'Start anytime',
    color: 'rgba(29,78,216,0.08)',
    borderColor: 'rgba(29,78,216,0.16)',
  },
  {
    icon: 'ti-brand-discord',
    title: 'Direct Communication via Discord',
    desc: 'No ticket queues, no account managers. You talk directly to your editor in a private Discord channel. Revisions are fast and collaborative.',
    highlight: 'Zero friction',
    color: 'rgba(88,101,242,0.08)',
    borderColor: 'rgba(88,101,242,0.16)',
  },
  {
    icon: 'ti-award',
    title: 'Verified 5-Star Track Record',
    desc: 'Every review on our Discord server is from a real client who received and approved their project. No fake reviews, no inflated ratings.',
    highlight: '5.0 average rating',
    color: 'rgba(245,158,11,0.08)',
    borderColor: 'rgba(245,158,11,0.16)',
  },
]

export function WhyExtoArts() {
  return (
    <section
      id="why-extoarts"
      aria-labelledby="why-heading"
      style={{
        padding: 'min(88px,8vw) min(20px,5%)',
        maxWidth: 1200,
        margin: '0 auto',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <SectionHeader
        label="Why ExtoArts"
        title={<>Why YouTube Creators<br /><span className="sweep-text">Choose ExtoArts.</span></>}
        subtitle="Six reasons agencies and independent creators trust us with their YouTube channels."
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
          gap: 14,
        }}
        className="ea-stagger"
      >
        {REASONS.map((reason, i) => (
          <div
            key={reason.title}
            className="glass-card shine-border sr"
            style={{
              border: '1px solid var(--border)',
              borderRadius: 20,
              padding: '28px 26px',
              display: 'flex',
              gap: 18,
              alignItems: 'flex-start',
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.35s var(--ease-spring), box-shadow 0.35s, border-color 0.35s',
            }}
          >
            {/* Subtle corner glow */}
            <div style={{
              position: 'absolute',
              top: 0, right: 0,
              width: '40%',
              height: '40%',
              background: `radial-gradient(ellipse at top right, ${reason.color}, transparent 70%)`,
              pointerEvents: 'none',
              zIndex: 0,
            }} aria-hidden="true" />

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 18, alignItems: 'flex-start', width: '100%' }}>
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 13,
                  background: reason.color,
                  border: `1px solid ${reason.borderColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'transform 0.3s var(--ease-spring)',
                }}
                className="reason-icon"
              >
                <i className={`ti ${reason.icon}`} aria-hidden="true" style={{ color: 'var(--primary)', fontSize: '1.18rem' }} />
              </div>

              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontSize: '0.98rem',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  marginBottom: 9,
                  letterSpacing: '-0.25px',
                  lineHeight: 1.3,
                }}>
                  {reason.title}
                </h3>
                <p style={{
                  fontSize: '0.83rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.72,
                  margin: '0 0 12px',
                }}>
                  {reason.desc}
                </p>
                <span className="highlight-chip">
                  <i className="ti ti-check" aria-hidden="true" style={{ fontSize: '0.7rem' }} />
                  {reason.highlight}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: 48, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href="/pricing" className="btn btn-glass" style={{ borderRadius: 999 }}>
          <i className="ti ti-percentage" aria-hidden="true" /> See Pricing
        </Link>
        <Link href="/workflow" className="btn btn-glass" style={{ borderRadius: 999 }}>
          <i className="ti ti-route" aria-hidden="true" /> How We Work
        </Link>
      </div>

      <style>{`
        .glass-card:hover .reason-icon { transform: scale(1.08) rotate(-4deg); }
      `}</style>
    </section>
  )
}
