// Server Component — CSS keyframe animations replace Framer Motion (no client JS needed)
// Animation keyframes are defined in globals.css as fluidBlob1/2/3
// Blob filters are stripped on touch devices via .fluid-gradient-blob media query in globals.css

interface FluidGradientProps {
  color1?: string
  color2?: string
  color3?: string
  gradientSpeed?: number
  blur?: number
  style?: React.CSSProperties
}

export function FluidGradient({
  color1 = '#69ddff',   // Frozen Lake  (ExtoArts primary)
  color2 = '#be92a2',   // Old Rose     (ExtoArts accent)
  color3 = '#dbbadd',   // Pink Orchid  (ExtoArts mid)
  gradientSpeed = 3,
  blur = 60,
  style,
}: FluidGradientProps) {
  const duration = 20 / gradientSpeed

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        minWidth: '100px',
        minHeight: '100px',
        ...style,
      }}
    >
      <div
        className="fluid-gradient-blob"
        style={{
          position: 'absolute',
          width: '150%',
          height: '150%',
          left: '-25%',
          top: '-25%',
          background: `radial-gradient(circle at 80% 50%, ${color1} 0%, transparent 50%)`,
          filter: `blur(${blur}px)`,
          animation: `fluidBlob1 ${duration}s ease-in-out infinite`,
        }}
      />
      <div
        className="fluid-gradient-blob"
        style={{
          position: 'absolute',
          width: '150%',
          height: '150%',
          left: '-25%',
          top: '-25%',
          background: `radial-gradient(circle at 20% 80%, ${color2} 0%, transparent 50%)`,
          filter: `blur(${blur}px)`,
          animation: `fluidBlob2 ${duration * 1.2}s ease-in-out infinite`,
        }}
      />
      <div
        className="fluid-gradient-blob"
        style={{
          position: 'absolute',
          width: '150%',
          height: '150%',
          left: '-25%',
          top: '-25%',
          background: `radial-gradient(circle at 50% 20%, ${color3} 0%, transparent 50%)`,
          filter: `blur(${blur}px)`,
          animation: `fluidBlob3 ${duration * 0.9}s ease-in-out infinite`,
        }}
      />
    </div>
  )
}
