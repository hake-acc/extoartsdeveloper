'use client'

// ── Neumorphic FAQ Accordion ─────────────────────────────────────────────────
// Styled after the Framer "Neumorphism FAQ" component by Shouvik Biswas
// Dark-mode adaptation: surface #141428, dual box-shadow (dark bottom-right +
// light top-left) — the same mechanics as the original light-mode component.

import { AnimatePresence, motion } from 'framer-motion'
import { useId, useState } from 'react'

// ── Shadow tokens ─────────────────────────────────────────────────────────────
// Neumorphism requires card background to match section background so shadows
// appear to extrude from / press into the same surface.
const NM_BG = '#141428'                 // must match section wrapper bg
const DARK  = 'rgba(0,0,0,0.72)'        // cast shadow: bottom-right
const LIGHT = 'rgba(255,255,255,0.055)' // highlight:   top-left

const shadowCard   = `9px 9px 22px ${DARK}, -6px -6px 14px ${LIGHT}`
const shadowActive = `9px 9px 22px ${DARK}, -6px -6px 14px ${LIGHT}, inset 0 0 0 1px rgba(105,221,255,0.13)`
const btnUp        = `5px 5px 12px ${DARK}, -3px -3px 8px ${LIGHT}`
const btnDown      = `inset 4px 4px 10px ${DARK}, inset -3px -3px 7px ${LIGHT}`

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
    <div
      style={{
        background: NM_BG,
        borderRadius: 22,
        boxShadow: isOpen ? shadowActive : shadowCard,
        transition: 'box-shadow 0.32s cubic-bezier(0.22,1,0.36,1)',
        overflow: 'hidden',
      }}
    >
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
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            width: 42,
            height: 42,
            borderRadius: '50%',
            background: NM_BG,
            boxShadow: isOpen ? btnDown : btnUp,
            color: isOpen ? '#69ddff' : 'var(--text-muted)',
            fontSize: '1.55rem',
            fontWeight: 200,
            lineHeight: '42px',
            transition: 'box-shadow 0.32s cubic-bezier(0.22,1,0.36,1), color 0.28s',
            userSelect: 'none',
          }}
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
                borderTop: '1px solid rgba(255,255,255,0.06)',
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
    // Section-level surface must match NM_BG for shadows to read correctly
    <div
      style={{
        background: NM_BG,
        borderRadius: 28,
        padding: '8px 0',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
      className={className}
    >
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
