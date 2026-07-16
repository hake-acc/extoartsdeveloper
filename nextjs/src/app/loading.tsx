// loading.tsx — shown immediately on navigation while the page stream loads.
// Renders a lightweight skeleton that matches the rough layout of most pages,
// preventing a blank white flash during server data fetches.

export default function Loading() {
  return (
    <main
      id="main-content"
      aria-label="Loading page"
      aria-busy="true"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: 'min(24svh, 24vh) min(40px, 6%) min(120px, 12vw)',
        maxWidth: '1200px',
        margin: '0 auto',
        gap: 24,
      }}
    >
      {/* Overline skeleton */}
      <div
        className="skeleton-pulse"
        style={{ width: 120, height: 14, borderRadius: 4 }}
        aria-hidden="true"
      />
      {/* H1 skeleton — two lines */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} aria-hidden="true">
        <div className="skeleton-pulse" style={{ width: 'clamp(200px, 50vw, 480px)', height: 'clamp(2.6rem, 6.4vw, 5rem)', borderRadius: 6 }} />
        <div className="skeleton-pulse" style={{ width: 'clamp(160px, 40vw, 380px)', height: 'clamp(2.6rem, 6.4vw, 5rem)', borderRadius: 6 }} />
      </div>
      {/* Subtitle skeleton */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }} aria-hidden="true">
        <div className="skeleton-pulse" style={{ width: 'min(520px, 80vw)', height: 16, borderRadius: 4 }} />
        <div className="skeleton-pulse" style={{ width: 'min(440px, 70vw)', height: 16, borderRadius: 4 }} />
        <div className="skeleton-pulse" style={{ width: 'min(300px, 55vw)', height: 16, borderRadius: 4 }} />
      </div>
      {/* CTA skeleton */}
      <div className="skeleton-pulse" style={{ width: 200, height: 52, borderRadius: 999 }} aria-hidden="true" />

      <style>{`
        .skeleton-pulse {
          background: linear-gradient(
            90deg,
            var(--surface) 25%,
            var(--surface-2) 50%,
            var(--surface) 75%
          );
          background-size: 200% 100%;
          animation: skeletonPulse 1.4s ease-in-out infinite;
        }
        @keyframes skeletonPulse {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .skeleton-pulse { animation: none; background: var(--surface-2); }
        }
      `}</style>
    </main>
  )
}
