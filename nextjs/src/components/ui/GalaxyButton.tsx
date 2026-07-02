'use client'

interface GalaxyButtonProps {
  href?: string
  onClick?: () => void
  children: React.ReactNode
  className?: string
  target?: string
  rel?: string
}

export function GalaxyButton({ href, onClick, children, className, target, rel }: GalaxyButtonProps) {
  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={`galaxy-btn ${className ?? ''}`}>
        <span className="gb-inner">{children}</span>
      </a>
    )
  }
  return (
    <button onClick={onClick} className={`galaxy-btn ${className ?? ''}`}>
      <span className="gb-inner">{children}</span>
    </button>
  )
}
