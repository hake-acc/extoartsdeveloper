import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Health Check | ExtoArts',
  robots: { index: false, follow: false },
}

export default function HealthPage() {
  const checks = [
    { name: 'Next.js App Router', status: 'ok', detail: 'Rendering' },
    { name: 'Supabase URL configured', status: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'ok' : 'warn', detail: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing — auth will be unavailable' },
    { name: 'Supabase Anon Key configured', status: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'ok' : 'warn', detail: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing — auth will be unavailable' },
    { name: 'Discord Ticket Webhook', status: process.env.DISCORD_WEBHOOK_TICKET ? 'ok' : 'warn', detail: process.env.DISCORD_WEBHOOK_TICKET ? 'Configured' : 'Not set — ticket submissions will fail silently' },
    { name: 'NODE_ENV', status: 'ok', detail: process.env.NODE_ENV ?? 'unknown' },
  ]

  const allOk = checks.every((c) => c.status === 'ok')

  return (
    <section style={{ padding: 'min(18vh,140px) min(20px,5%) min(80px,8vw)', maxWidth: 720, margin: '0 auto', position: 'relative', zIndex: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 36, flexWrap: 'wrap' }}>
        <h1 style={{ fontSize: 'clamp(1.6rem,3.5vw,2.2rem)', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.8px' }}>
          Health Check
        </h1>
        <span style={{ padding: '4px 14px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', background: allOk ? 'rgba(34,197,94,0.10)' : 'rgba(251,191,36,0.10)', color: allOk ? '#4ade80' : '#fbbf24', border: `1px solid ${allOk ? 'rgba(74,222,128,0.25)' : 'rgba(251,191,36,0.25)'}` }}>
          {allOk ? '✓ All Systems Operational' : '⚠ Action Needed'}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {checks.map((check) => (
          <div key={check.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: check.status === 'ok' ? '#4ade80' : check.status === 'warn' ? '#fbbf24' : '#f87171', boxShadow: `0 0 8px ${check.status === 'ok' ? 'rgba(74,222,128,0.5)' : check.status === 'warn' ? 'rgba(251,191,36,0.5)' : 'rgba(248,113,113,0.5)'}`, flexShrink: 0, display: 'inline-block' }} aria-hidden="true" />
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>{check.name}</span>
            </div>
            <span style={{ fontSize: '0.78rem', color: check.status === 'ok' ? 'var(--text-muted)' : check.status === 'warn' ? '#fbbf24' : '#f87171', textAlign: 'right', maxWidth: '55%' }}>
              {check.detail}
            </span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 32, padding: '16px 20px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 14 }}>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
          <strong style={{ color: 'var(--text-main)' }}>Note:</strong> This page is for internal diagnostics. Environment checks that show &quot;warn&quot; will not crash the app but may disable specific features. Configure the missing variables in your Replit Secrets or .env.local to resolve them.
        </p>
      </div>
    </section>
  )
}
