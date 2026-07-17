'use client'
import { useEffect } from 'react'

/**
 * Loads non-critical CSS after first paint using the preload + media="print" trick.
 * This removes the CSS chunk from the render-blocking critical path entirely.
 *
 * How it works:
 *  1. <link rel="preload" as="style"> — browser fetches immediately, non-blocking.
 *  2. <link media="print"> — downloaded but not applied (print-only media).
 *  3. On load → swap media to "all" to activate styles.
 */
export function DeferredStyles({ href }: { href: string }) {
  useEffect(() => {
    // Avoid double-inserting on HMR / re-renders
    if (document.querySelector(`link[data-deferred-href="${href}"]`)) return

    // Preload hint so the fetch starts immediately (parallel to, not after, HTML parse)
    const preload = document.createElement('link')
    preload.rel = 'preload'
    preload.as = 'style'
    preload.href = href
    document.head.appendChild(preload)

    // Non-blocking stylesheet: media="print" means browser downloads but doesn't
    // block rendering; on load we flip it to "all" to apply the styles.
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.media = 'print'
    link.setAttribute('data-deferred-href', href)
    link.href = href
    link.addEventListener('load', () => {
      link.media = 'all'
    })
    document.head.appendChild(link)
  }, [href])

  // Fallback for no-JS environments
  return (
    <noscript>
      <link rel="stylesheet" href={href} />
    </noscript>
  )
}
