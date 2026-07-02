'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(30, 'Username too long').regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores'),
  email: z.string().email('Valid email required').refine((e) => e.endsWith('@gmail.com') || e.endsWith('@yahoo.com'), 'Only Gmail or Yahoo email addresses are accepted'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['client', 'editor']),
  terms: z.literal(true, { errorMap: () => ({ message: 'You must accept the Terms of Service' }) }),
})
type FormData = z.infer<typeof schema>

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

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'client' },
  })

  async function onSubmit(data: FormData) {
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/auth-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok || !json.ok) {
        setError(json.message || 'Registration failed. Please try again.')
      } else {
        window.location.href = '/dashboard'
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section style={{ padding: 'min(16vh,130px) min(20px,5%) min(100px,10vw)', maxWidth: 520, margin: '0 auto', position: 'relative', zIndex: 10 }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 32, textDecoration: 'none' }}>
          <img src="/favicon-192.png" width={36} height={36} alt="ExtoArts" style={{ borderRadius: 8 }} />
          <span style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>ExtoArts</span>
        </Link>
        <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.4rem)', fontWeight: 900, letterSpacing: '-1px', marginBottom: 8, color: 'var(--text-main)' }}>
          Create Account
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Join the ExtoArts client portal</p>
      </div>

      <div className="tilt-card glass-card" style={{ border: '1px solid var(--border)', borderRadius: 22, padding: 36 }}>
        <div className="tilt-inner">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div style={{ marginBottom: 18 }}>
              <label htmlFor="username" style={labelStyle}>Username</label>
              <input id="username" type="text" style={inputStyle} placeholder="your_username" autoComplete="username" {...register('username')} />
              {errors.username && <p style={{ fontSize: '0.75rem', color: '#f87171', marginTop: 5 }}>{errors.username.message}</p>}
            </div>

            <div style={{ marginBottom: 18 }}>
              <label htmlFor="email" style={labelStyle}>Email Address</label>
              <input id="email" type="email" style={inputStyle} placeholder="you@gmail.com" autoComplete="email" {...register('email')} />
              {errors.email && <p style={{ fontSize: '0.75rem', color: '#f87171', marginTop: 5 }}>{errors.email.message}</p>}
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>Gmail or Yahoo only</p>
            </div>

            <div style={{ marginBottom: 18 }}>
              <label htmlFor="password" style={labelStyle}>Password</label>
              <input id="password" type="password" style={inputStyle} placeholder="Minimum 8 characters" autoComplete="new-password" {...register('password')} />
              {errors.password && <p style={{ fontSize: '0.75rem', color: '#f87171', marginTop: 5 }}>{errors.password.message}</p>}
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Account Type</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {(['client', 'editor'] as const).map((role) => (
                  <label
                    key={role}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '12px 16px',
                      border: '1px solid var(--border)',
                      borderRadius: 12,
                      cursor: 'pointer',
                      fontSize: '0.88rem',
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    <input type="radio" value={role} {...register('role')} style={{ accentColor: 'var(--primary)' }} />
                    {role === 'client' ? 'Client (Creator)' : 'Editor (Freelancer)'}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                <input type="checkbox" {...register('terms')} style={{ accentColor: 'var(--primary)', marginTop: 2, flexShrink: 0 }} />
                <span>
                  I agree to the{' '}
                  <Link href="/tos" target="_blank" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Terms of Service</Link>
                  {' '}and{' '}
                  <Link href="/privacy" target="_blank" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Privacy Policy</Link>
                </span>
              </label>
              {errors.terms && <p style={{ fontSize: '0.75rem', color: '#f87171', marginTop: 5 }}>{errors.terms.message}</p>}
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '12px 16px', fontSize: '0.82rem', color: '#f87171', marginBottom: 20 }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn btn-main" style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>

      <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.84rem', color: 'var(--text-muted)' }}>
        Already have an account?{' '}
        <Link href="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 700 }}>Sign in</Link>
      </p>
    </section>
  )
}
