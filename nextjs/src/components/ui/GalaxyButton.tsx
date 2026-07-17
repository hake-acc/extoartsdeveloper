'use client'

import { useEffect, useRef } from 'react'

interface GalaxyButtonProps {
  href?: string
  onClick?: () => void
  children: React.ReactNode
  className?: string
  target?: string
  rel?: string
}

/**
 * GalaxyButton — spinning conic-gradient border.
 *
 * CSS @property animation works in Chrome/Edge but NOT Firefox.
 * We drive the rotation via requestAnimationFrame so it works everywhere,
 * and keep the @property declaration as a fallback for when JS hasn't
 * attached yet (first paint).
 */
function useConicRotation(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let angle = 0
    let raf: number

    function tick() {
      angle = (angle + 0.5) % 360
      el!.style.setProperty('--gb-angle', `${angle}deg`)
      raf = requestAnimationFrame(tick)
    }

    // Touch devices (mobile/tablet): skip the RAF loop entirely — the spinning
    // border is a perpetual CPU drain on devices that can't hover anyway.
    if (window.matchMedia('(pointer: coarse)').matches) return

    // Only engage the JS driver if the browser won't animate @property itself.
    // Chrome/Edge support CSS.registerProperty; Firefox doesn't.
    const needsJsDriver = !('registerProperty' in (window.CSS ?? {}))
    if (needsJsDriver) {
      raf = requestAnimationFrame(tick)
      return () => cancelAnimationFrame(raf)
    }
    // Chrome/Edge: CSS handles it — speed up on hover via class
    return undefined
  }, [ref])
}

function GalaxyInner({
  href,
  onClick,
  children,
  className,
  target,
  rel,
}: GalaxyButtonProps) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null)
  useConicRotation(ref)

  if (href) {
    return (
      <a ref={ref} href={href} target={target} rel={rel} className={`galaxy-btn ${className ?? ''}`}>
        <span className="gb-inner">{children}</span>
      </a>
    )
  }
  return (
    <button ref={ref} onClick={onClick} className={`galaxy-btn ${className ?? ''}`}>
      <span className="gb-inner">{children}</span>
    </button>
  )
}

export function GalaxyButton(props: GalaxyButtonProps) {
  return <GalaxyInner {...props} />
}
