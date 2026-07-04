'use client'

import { useEffect, useState } from 'react'

interface ObfuscatedEmailProps {
  user: string
  domain: string
  className?: string
  style?: React.CSSProperties
  label?: string
}

export function ObfuscatedEmail({ user, domain, className, style, label }: ObfuscatedEmailProps) {
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    setEmail(`${user}@${domain}`)
  }, [user, domain])

  if (!email) {
    return (
      <span className={className} style={style} aria-label={`${label ?? `${user}`} email, enable JavaScript to view`}>
        {user}&nbsp;[at]&nbsp;{domain}
      </span>
    )
  }

  return (
    <a href={`mailto:${email}`} className={className} style={style}>
      {email}
    </a>
  )
}
