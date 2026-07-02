interface AuroraBackgroundProps {
  className?: string
}

export function AuroraBackground({ className }: AuroraBackgroundProps) {
  return (
    <div className={`aurora-bg ${className ?? ''}`} aria-hidden="true">
      <div className="aurora-blob" />
    </div>
  )
}
