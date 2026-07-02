'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'processing' | 'error'>('processing')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    async function handleCallback() {
      try {
        const supabaseUrl =
          process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey =
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseKey) {
          setErrorMsg('Authentication service unavailable.')
          setStatus('error')
          return
        }

        const { createClient } = await import('@supabase/supabase-js')
        const client = createClient(supabaseUrl, supabaseKey)

        // Handle PKCE / code exchange
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')
        const errorParam = urlParams.get('error')
        const errorDescription = urlParams.get('error_description')

        if (errorParam) {
          setErrorMsg(errorDescription ?? errorParam)
          setStatus('error')
          return
        }

        // Hash-based token (implicit flow)
        const hash = window.location.hash
        if (hash && hash.includes('access_token')) {
          const { data, error } = await client.auth.getSession()
          if (error || !data.session) {
            setErrorMsg(error?.message ?? 'Could not retrieve session.')
            setStatus('error')
            return
          }
          // Persist session to server cookie
          await fetch('/api/auth-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ access_token: data.session.access_token }),
          })
          router.replace('/dashboard')
          return
        }

        // PKCE flow
        if (code) {
          const { data, error } = await client.auth.exchangeCodeForSession(code)
          if (error || !data.session) {
            setErrorMsg(error?.message ?? 'Could not exchange code for session.')
            setStatus('error')
            return
          }
          await fetch('/api/auth-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ access_token: data.session.access_token }),
          })
          router.replace('/dashboard')
          return
        }

        // Try existing session
        const { data } = await client.auth.getSession()
        if (data.session) {
          await fetch('/api/auth-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ access_token: data.session.access_token }),
          })
          router.replace('/dashboard')
          return
        }

        setErrorMsg('No active session found. Please sign in again.')
        setStatus('error')
      } catch (err) {
        setErrorMsg('An unexpected error occurred during authentication.')
        setStatus('error')
        console.error('OAuth callback error:', err)
      }
    }

    handleCallback()
  }, [router])

  if (status === 'error') {
    return (
      <section
        style={{
          padding: 'min(20vh,160px) min(20px,5%)',
          maxWidth: 560,
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontSize: '2.5rem',
            marginBottom: 20,
            filter: 'grayscale(1)',
            opacity: 0.6,
          }}
        >
          ⚠️
        </div>
        <h1
          style={{
            fontSize: 'clamp(1.5rem,3.5vw,2rem)',
            fontWeight: 900,
            color: 'var(--text-main)',
            marginBottom: 14,
            letterSpacing: '-0.5px',
          }}
        >
          Authentication Failed
        </h1>
        <p
          style={{
            fontSize: '0.9rem',
            color: 'var(--text-muted)',
            marginBottom: 32,
            lineHeight: 1.7,
          }}
        >
          {errorMsg}
        </p>
        <a
          href="/login"
          className="btn btn-main"
          style={{ borderRadius: 14, display: 'inline-flex', alignItems: 'center', gap: 8 }}
        >
          <i className="ti ti-arrow-left" aria-hidden="true" /> Back to Login
        </a>
      </section>
    )
  }

  return (
    <section
      style={{
        padding: 'min(20vh,160px) min(20px,5%)',
        maxWidth: 560,
        margin: '0 auto',
        textAlign: 'center',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          border: '3px solid var(--border)',
          borderTopColor: 'var(--primary)',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 24px',
        }}
        aria-hidden="true"
      />
      <h1
        style={{
          fontSize: '1.4rem',
          fontWeight: 900,
          color: 'var(--text-main)',
          marginBottom: 10,
          letterSpacing: '-0.5px',
        }}
      >
        Signing you in…
      </h1>
      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
        Completing authentication. You&apos;ll be redirected in a moment.
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  )
}
