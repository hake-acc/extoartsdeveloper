'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { DISCORD_URL } from '@/lib/constants'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  order_id: z.string().optional(),
  message: z.string().min(20, 'Message must be at least 20 characters'),
})

type FormData = z.infer<typeof schema>

export default function TicketPage() {
  const [submitted, setSubmitted] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  function onSubmit(_data: FormData) {
    setSubmitted(true)
    window.open(DISCORD_URL, '_blank', 'noopener,noreferrer')
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '13px 16px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    color: 'var(--text-main)',
    fontSize: '0.9rem',
    fontFamily: 'var(--font-body)',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.78rem',
    fontWeight: 700,
    color: 'var(--text-muted)',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: '1px',
  }

  return (
    <>
      <h1 className="sr-only">Submit a Support Ticket - ExtoArts</h1>

      <section style={{ padding: 'min(20vh,160px) min(20px,5%) min(100px,10vw)', maxWidth: 680, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span className="hero-badge" style={{ marginBottom: 24 }}>
            <span className="hero-badge-dot" aria-hidden="true" />
            Support Tickets
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem,5vw,3.5rem)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.05, marginBottom: 16, color: 'var(--text-main)' }}>
            Get <span className="sweep-text">Support.</span>
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
            For active projects, billing questions, or general support. For starting a new project, please{' '}
            <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 700 }}>
              open a Discord ticket
            </a>{' '}
            instead.
          </p>
        </div>

        {submitted ? (
          <div className="tilt-card glass-card" style={{ border: '1px solid rgba(16,185,129,0.3)', borderRadius: 22, padding: 48, textAlign: 'center' }}>
            <div className="tilt-inner">
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <i className="ti ti-brand-discord" aria-hidden="true" style={{ color: '#5865f2', fontSize: '2rem' }} />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: 12 }}>Head to Discord</h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 28 }}>
                We opened Discord for you. Open a ticket in our server and paste your details — our team typically responds within 24 hours.
              </p>
              <a
                href={DISCORD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-main"
                style={{ borderRadius: 14, display: 'inline-flex' }}
              >
                <i className="ti ti-brand-discord" aria-hidden="true" /> Open Discord
              </a>
            </div>
          </div>
        ) : (
          <div className="tilt-card glass-card" style={{ border: '1px solid var(--border)', borderRadius: 22, padding: 'min(40px,5vw)' }}>
            <div className="tilt-inner">
              <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label htmlFor="name" style={labelStyle}>Your Name</label>
                    <input id="name" type="text" style={inputStyle} placeholder="John Smith" {...register('name')} />
                    {errors.name && <p style={{ fontSize: '0.75rem', color: '#f87171', marginTop: 5 }}>{errors.name.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" style={labelStyle}>Email Address</label>
                    <input id="email" type="email" style={inputStyle} placeholder="you@example.com" {...register('email')} />
                    {errors.email && <p style={{ fontSize: '0.75rem', color: '#f87171', marginTop: 5 }}>{errors.email.message}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" style={labelStyle}>Subject</label>
                  <input id="subject" type="text" style={inputStyle} placeholder="Brief description of your issue" {...register('subject')} />
                  {errors.subject && <p style={{ fontSize: '0.75rem', color: '#f87171', marginTop: 5 }}>{errors.subject.message}</p>}
                </div>

                <div>
                  <label htmlFor="order_id" style={{ ...labelStyle, opacity: 0.7 }}>Order / Project ID <span style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>(optional)</span></label>
                  <input id="order_id" type="text" style={inputStyle} placeholder="If you have an active project reference" {...register('order_id')} />
                </div>

                <div>
                  <label htmlFor="message" style={labelStyle}>Message</label>
                  <textarea
                    id="message"
                    rows={6}
                    style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.65 }}
                    placeholder="Describe your issue or question in detail..."
                    {...register('message')}
                  />
                  {errors.message && <p style={{ fontSize: '0.75rem', color: '#f87171', marginTop: 5 }}>{errors.message.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-main"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <i className="ti ti-brand-discord" aria-hidden="true" /> Submit via Discord
                </button>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                  For faster support, open a ticket directly on{' '}
                  <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Discord</a>.
                </p>
              </form>
            </div>
          </div>
        )}
      </section>

      <style>{`
        input:focus, textarea:focus { border-color: rgba(34,211,238,0.45) !important; box-shadow: 0 0 0 3px rgba(34,211,238,0.08); }
      `}</style>
    </>
  )
}
