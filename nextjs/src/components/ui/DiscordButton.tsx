'use client'

import type { CSSProperties, ReactNode } from 'react'

interface DiscordButtonProps {
  className?: string
  style?: CSSProperties
  children: ReactNode
  id?: string
}

export function DiscordButton({ className, style, children, id }: DiscordButtonProps) {
  function handleClick() {
    const m = document.getElementById('discordModal')
    if (m) {
      m.classList.add('open')
      document.body.style.overflow = 'hidden'
    }
  }

  return (
    <button id={id} className={className} style={style} onClick={handleClick}>
      {children}
    </button>
  )
}
