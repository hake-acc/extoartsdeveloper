// Server Component — InView removed; scroll-reveal via .sr CSS class + ClientScripts IntersectionObserver
import Link from 'next/link'
import { SectionHeader } from '@/components/ui/SectionHeader'

const REASONS = [
  {
    icon: 'ti-percentage',
    title: '10% Flat Fee - No Hidden Costs',
    desc: 'Traditional agencies take 30-50%. We take 10%. 90% of your editing budget goes directly to the specialist editor assigned to your project.',
    highlight: '90% to your editor',
    colorVar: 'var(--c-gaming-glow)',
    borderVar: 'var(--c-gaming-border)',
    iconColor: 'var(--c-gaming)',
  },
  {
    icon: 'ti-target',
    title: 'Niche-Matched Specialists',
    desc: "We don't assign a generalist editor to your gaming channel. You get a specialist editor with a content optimization strategy built around your niche.",
    highlight: 'Not generalists',
    colorVar: 'var(--c-growth-glow)',
    borderVar: 'var(--c-growth-border)',
    iconColor: 'var(--c-growth)',
  },
  {
    icon: 'ti-clock-check',
    title: 'Real Deadlines. Real Accountability.',
    desc: "Missed deadline = free project. That's our policy. We don't give excuses - we give results within the timeframe we agree on.",
    highlight: '3-5 day turnaround',
    colorVar: 'var(--c-shortform-glow)',
    borderVar: 'var(--c-shortform-border)',
    iconColor: 'var(--c-shortform)',
  },
  {
    icon: 'ti-shield-check',
    title: 'No Lock-In. No Retainers Required.',
    desc: 'Pay per project or set up a monthly volume deal. Either way, no minimum commitments, no setup fees, and no cancellation penalties.',
    highlight: 'Start anytime',
    colorVar: 'var(--c-faceless-glow)',
    borderVar: 'var(--c-faceless-border)',
    iconColor: 'var(--c-faceless)',
  },
  {
    icon: 'ti-brand-discord',
    title: 'Direct Communication via Discord',
    desc: 'No ticket queues, no account managers. You talk directly to your editor in a private Discord channel. Revisions are fast and collaborative.',
    highlight: 'Zero friction',
    colorVar: 'var(--c-business-glow)',
    borderVar: 'var(--c-business-border)',
    iconColor: 'var(--c-business)',
  },
  {
    icon: 'ti-award',
    title: 'Verified 5-Star Track Record',
    desc: 'Every review on our Discord server is from a real client who received and approved their project. No fake reviews, no inflated ratings.',
    highlight: '5.0 average rating',
    colorVar: 'var(--c-firsttime-glow)',
    borderVar: 'var(--c-firsttime-border)',
    iconColor: 'var(--c-firsttime)',
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
        subtitle="Six reasons creators trust ExtoArts as their YouTube SEO agency for channel growth."
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(310px, 100%), 1fr))',
          gap: 14,
        }}
      >
        {REASONS.map((reason, i) => (
          <div
            key={reason.title}
            className="ink-card sr"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
              transitionDelay: `${i * 70}ms`,
            }}
          >
            {/* Remove neon background glow for authentic paper look */}

            <div className="ink-card-icon">
              <i className={`ti ${reason.icon}`} aria-hidden="true" style={{ fontSize: '1.5rem', zIndex: 1 }} />
            </div>

            <div style={{ flex: 1, zIndex: 1 }}>
              <h3 className="ink-card-title">
                {reason.title}
              </h3>
              <p style={{
                fontSize: '0.9rem',
                lineHeight: 1.8,
                margin: '0 0 20px',
                fontFamily: 'var(--font-body)',
              }}>
                {reason.desc}
              </p>
              <span className="highlight-chip" style={{
                background: 'transparent',
                borderStyle: 'dashed',
                borderWidth: '1px',
                padding: '6px 14px',
              }}>
                <i className="ti ti-check" aria-hidden="true" style={{ fontSize: '0.8rem', marginRight: '4px' }} />
                {reason.highlight}
              </span>
            </div>
            
            {/* Decorative Hanko Stamp */}
            <div className="hanko-stamp">
              証
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
        @media (hover: hover) and (pointer: fine) {
          .glass-card:hover .reason-icon { transform: scale(1.08) rotate(-4deg); }
        }
      `}</style>
    </section>
  )
}
