'use client'

import { useEffect } from 'react'

export function InkThemeScope() {
  useEffect(() => {
    const html = document.documentElement
    html.setAttribute('data-page-theme', 'ink')
    return () => {
      html.removeAttribute('data-page-theme')
    }
  }, [])

  return null
}
