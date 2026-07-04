'use client'

import { ObfuscatedEmail } from '@/components/ui/ObfuscatedEmail'

export function DiscordModal() {
  function handleClose() {
    const m = document.getElementById('discordModal')
    if (m) {
      m.classList.remove('open')
      document.body.style.overflow = ''
    }
  }

  return (
    <div
      id="discordModal"
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="discordModalTitle"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose()
      }}
    >
      <div className="modal-box">
        <i
          className="ti ti-brand-discord"
          style={{
            fontSize: '3rem',
            color: '#5865f2',
            marginBottom: '20px',
            display: 'block',
            filter: 'drop-shadow(0 0 20px rgba(88,101,242,0.4))',
          }}
          aria-hidden="true"
        />
        <h2
          id="discordModalTitle"
          style={{
            color: 'var(--text-main)',
            marginBottom: '10px',
            fontSize: '1.8rem',
            fontWeight: 900,
          }}
        >
          Join the Server
        </h2>
        <p
          style={{
            color: 'var(--text-muted)',
            marginBottom: '30px',
            fontSize: '0.95rem',
            lineHeight: 1.6,
          }}
        >
          Tell us what you need. We&apos;ll match you with a specialist editor and send a custom
          quote within hours. No commitment until you approve it.
        </p>
        <a
          href="https://discord.gg/extoarts-1402333030827425922"
          className="btn"
          style={{
            width: '100%',
            background: '#5865f2',
            color: '#fff',
            boxShadow: '0 10px 30px rgba(88,101,242,0.3)',
            borderRadius: '16px',
            justifyContent: 'center',
          }}
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="ti ti-brand-discord" aria-hidden="true" /> Start Your Project on Discord
        </a>
        <button
          id="discordModalClose"
          onClick={handleClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '0.8rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            display: 'block',
            margin: '20px auto 0',
            fontFamily: 'var(--font-body)',
          }}
        >
          Maybe Later
        </button>
        <p
          style={{
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            marginTop: '16px',
            lineHeight: 1.5,
          }}
        >
          Prefer email?{' '}
          <ObfuscatedEmail
            user="support"
            domain="extoarts.in"
            style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 700 }}
          />
        </p>
      </div>
    </div>
  )
}
