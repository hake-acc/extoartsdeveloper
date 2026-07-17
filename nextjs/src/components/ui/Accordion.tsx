'use client'

// ── Neumorphic FAQ Accordion ─────────────────────────────────────────────────
// Height animation uses CSS grid-template-rows (0fr → 1fr) — no Framer Motion needed.
// Colors are driven entirely by CSS variables (--nm-*) so both dark and light
// themes work without any hardcoded RGBA strings in JS.

import { useId, useState } from 'react'

// ── Types ─────────────────────────────────────────────────────────────────────
interface FAQItem {
  q: string
  a: string
}

interface FAQAccordionProps {
  items: FAQItem[]
  className?: string
}

// ── Single FAQ item ───────────────────────────────────────────────────────────
function NMItem({
  item,
  isOpen,
  onToggle,
  triggerId,
  panelId,
}: {
  item: FAQItem
  isOpen: boolean
  onToggle: () => void
  triggerId: string
  panelId: string
}) {
  return (
    <div className={`nm-card${isOpen ? ' nm-card--open' : ''}`}>
      {/* ── Trigger ── */}
      <button
        id={triggerId}
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'var(--font-body)',
          color: 'var(--text-main)',
          fontWeight: 600,
          fontSize: '0.97rem',
          letterSpacing: '-0.01em',
          padding: '22px 26px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
          textAlign: 'left',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <span style={{ flex: 1 }}>{item.q}</span>

        {/* ── Neumorphic ± circle — CSS transform replaces Framer Motion ── */}
        <span
          className={`nm-btn-circle${isOpen ? ' nm-btn-circle--active' : ''}`}
          aria-hidden="true"
          style={{
            display: 'inline-block',
            transition: 'transform 0.22s cubic-bezier(0.22,1,0.36,1)',
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
        >
          +
        </span>
      </button>

      {/* ── Answer panel — CSS grid height animation ── */}
      {/* grid-template-rows: 0fr → 1fr collapses/expands without layout shifts.
          The inner div needs min-height:0 for the grid technique to collapse to zero. */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        style={{
          display: 'grid',
          gridTemplateRows: isOpen ? '1fr' : '0fr',
          opacity: isOpen ? 1 : 0,
          transition: 'grid-template-rows 0.26s cubic-bezier(0.22,1,0.36,1), opacity 0.22s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        <div style={{ overflow: 'hidden', minHeight: 0 }}>
          <div
            style={{
              padding: '18px 26px 24px',
              borderTop: '1px solid var(--nm-divider)',
            }}
          >
            <p
              style={{
                fontSize: '0.88rem',
                color: 'var(--text-muted)',
                lineHeight: 1.82,
                margin: 0,
              }}
            >
              {item.a}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Accordion list ────────────────────────────────────────────────────────────
export function FAQAccordion({ items, className }: FAQAccordionProps) {
  const uid = useId()
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className={`nm-accordion${className ? ` ${className}` : ''}`}>
      {items.map((item, i) => (
        <NMItem
          key={item.q}
          item={item}
          isOpen={open === i}
          onToggle={() => setOpen(open === i ? null : i)}
          triggerId={`${uid}-trigger-${i}`}
          panelId={`${uid}-panel-${i}`}
        />
      ))}
    </div>
  )
}
