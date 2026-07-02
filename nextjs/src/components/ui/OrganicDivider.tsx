interface OrganicDividerProps {
  flip?: boolean
  className?: string
}

export function OrganicDivider({ flip, className }: OrganicDividerProps) {
  return (
    <div
      className={`organic-divider ${className ?? ''}`}
      style={flip ? { transform: 'scaleY(-1)' } : undefined}
      aria-hidden="true"
    >
      <svg viewBox="0 0 1440 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M0,40 C240,100 480,0 720,30 C960,60 1200,10 1440,50 L1440,100 L0,100 Z"
          fill="var(--surface)"
          opacity="0.6"
        />
        <path
          d="M0,55 C260,15 500,90 760,45 C1000,10 1220,70 1440,35 L1440,100 L0,100 Z"
          fill="var(--bg)"
        />
      </svg>
    </div>
  )
}
