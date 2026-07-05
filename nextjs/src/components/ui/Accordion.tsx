'use client'

// ── Neumorphic FAQ Accordion ─────────────────────────────────────────────────
// Colors are driven entirely by CSS variables (--nm-*) so both dark and light
// themes work without any hardcoded RGBA strings in JS.

import { AnimatePresence, motion } from 'framer-motion'
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

        {/* ── Neumorphic ± circle ── */}
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className={`nm-btn-circle${isOpen ? ' nm-btn-circle--active' : ''}`}
          aria-hidden="true"
        >
          +
        </motion.span>
      </button>

      {/* ── Animated answer panel ── */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="panel"
            id={panelId}
            role="region"
            aria-labelledby={triggerId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
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
          </motion.div>
        )}
      </AnimatePresence>
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
