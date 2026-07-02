'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { buildMetadata } from '@/lib/metadata'

const schema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password required'),
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

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/auth-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok || !json.ok) {
        setError(json.message || 'Invalid email or password.')
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
    <section style={{ padding: 'min(20vh,160px) min(20px,5%) min(100px,10vw)', maxWidth: 460, margin: '0 auto', position: 'relative', zIndex: 10 }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 32, textDecoration: 'none' }}>
          <img src="/favicon-192.png" width={36} height={36} alt="ExtoArts" style={{ borderRadius: 8 }} />
          <span style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>ExtoArts</span>
        </Link>
        <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.4rem)', fontWeight: 900, letterSpacing: '-1px', marginBottom: 8, color: 'var(--text-main)' }}>
          Welcome Back
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Sign in to your ExtoArts portal</p>
      </div>

      <div className="tilt-card glass-card" style={{ border: '1px solid var(--border)', borderRadius: 22, padding: 36 }}>
        <div className="tilt-inner">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div style={{ marginBottom: 18 }}>
              <label htmlFor="email" style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '1px' }}>Email</label>
              <input id="email" type="email" style={inputStyle} placeholder="you@email.com" autoComplete="email" {...register('email')} />
              {errors.email && <p style={{ fontSize: '0.75rem', color: '#f87171', marginTop: 5 }}>{errors.email.message}</p>}
            </div>

            <div style={{ marginBottom: 28 }}>
              <label htmlFor="password" style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '1px' }}>Password</label>
              <input id="password" type="password" style={inputStyle} placeholder="Your password" autoComplete="current-password" {...register('password')} />
              {errors.password && <p style={{ fontSize: '0.75rem', color: '#f87171', marginTop: 5 }}>{errors.password.message}</p>}
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '12px 16px', fontSize: '0.82rem', color: '#f87171', marginBottom: 20 }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn btn-main" style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>

      <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.84rem', color: 'var(--text-muted)' }}>
        New client?{' '}
        <Link href="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 700 }}>
          Create an account
        </Link>
      </p>
      <p style={{ textAlign: 'center', marginTop: 8, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        Or start a project on{' '}
        <a href="https://discord.gg/extoarts-1402333030827425922" target="_blank" rel="noopener noreferrer" style={{ color: '#5865f2', textDecoration: 'none', fontWeight: 700 }}>
          Discord
        </a>{' '}
        - no account needed.
      </p>
    </section>
  )
}
