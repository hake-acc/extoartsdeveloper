import Link from 'next/link'
import { SectionHeader } from '@/components/ui/SectionHeader'

const REASONS = [
  {
    icon: 'ti-percentage',
    title: '10% Flat Fee - No Hidden Costs',
    desc: 'Traditional agencies take 30-50%. We take 10%. 90% of your editing budget goes directly to the specialist editor assigned to your project.',
    highlight: '90% to your editor',
  },
  {
    icon: 'ti-target',
    title: 'Niche-Matched Specialists',
    desc: 'We don\'t assign a generalist editor to your gaming channel. You get a gaming editor. You get someone who lives and breathes your content type.',
    highlight: 'Not generalists',
  },
  {
    icon: 'ti-clock-check',
    title: 'Real Deadlines. Real Accountability.',
    desc: 'Missed deadline = free project. That\'s our policy. We don\'t give excuses - we give results within the timeframe we agree on.',
    highlight: '3-5 day turnaround',
  },
  {
    icon: 'ti-shield-check',
    title: 'No Lock-In. No Retainers Required.',
    desc: 'Pay per project or set up a monthly volume deal. Either way, no minimum commitments, no setup fees, and no cancellation penalties.',
    highlight: 'Start anytime',
  },
  {
    icon: 'ti-brand-discord',
    title: 'Direct Communication via Discord',
    desc: 'No ticket queues, no account managers. You talk directly to your editor in a private Discord channel. Revisions are fast and collaborative.',
    highlight: 'Zero friction',
  },
  {
    icon: 'ti-award',
    title: 'Verified 5-Star Track Record',
    desc: 'Every review on our Discord server is from a real client who received and approved their project. No fake reviews, no inflated ratings.',
    highlight: '5.0 average rating',
  },
]

export function WhyExtoArts() {
  return (
    <section
      id="why-extoarts"
      aria-labelledby="why-heading"
      style={{
        padding: 'min(80px,7vw) min(20px,5%)',
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 16,
        }}
        className="ea-stagger"
      >
        {REASONS.map((reason, i) => (
          <div
            key={reason.title}
            className="sr glass-card"
            style={{
              border: '1px solid var(--border)',
              borderRadius: 18,
              padding: '28px 26px',
              display: 'flex',
              gap: 18,
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'rgba(34,211,238,0.08)',
                border: '1px solid rgba(34,211,238,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <i className={`ti ${reason.icon}`} aria-hidden="true" style={{ color: 'var(--primary)', fontSize: '1.2rem' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 8, letterSpacing: '-0.2px' }}>
                {reason.title}
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.7, margin: '0 0 10px' }}>
                {reason.desc}
              </p>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--primary)', background: 'rgba(34,211,238,0.07)', border: '1px solid rgba(34,211,238,0.16)', padding: '3px 10px', borderRadius: 999, display: 'inline-block' }}>
                {reason.highlight}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: 44 }}>
        <Link href="/pricing" className="btn btn-glass" style={{ marginRight: 12 }}>
          <i className="ti ti-percentage" aria-hidden="true" /> See Pricing
        </Link>
        <Link href="/workflow" className="btn btn-glass">
          <i className="ti ti-route" aria-hidden="true" /> How We Work
        </Link>
      </div>
    </section>
  )
}
