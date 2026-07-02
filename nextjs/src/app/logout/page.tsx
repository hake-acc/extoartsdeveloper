'use client'

import { useEffect } from 'react'

export default function LogoutPage() {
  useEffect(() => {
    fetch('/api/auth-logout', { method: 'POST' }).finally(() => {
      window.location.href = '/login'
    })
  }, [])

  return (
    <section style={{ padding: 'min(22vh,180px) 20px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Signing out...</p>
    </section>
  )
}
