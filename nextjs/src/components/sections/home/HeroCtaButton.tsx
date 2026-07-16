'use client'

// HeroCtaButton — thin client wrapper for the hero CTA.
// Needs to be a client component only because of the onClick scroll handler.
// Kept minimal so bundle impact is negligible.

export function HeroCtaButton() {
  return (
    <button
      onClick={() => {
        const target = document.getElementById('getting-started')
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }}
      className="btn btn-main"
      aria-label="Let's Clear Things Up"
    >
      Let&apos;s Clear Things Up{' '}
      <span style={{ fontSize: '1.2rem', marginLeft: '6px' }}>&rarr;</span>
    </button>
  )
}
