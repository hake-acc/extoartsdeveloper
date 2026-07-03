'use client'

// Radix UI Accordion - styled for ExtoArts
// Pattern inspired by shadcn/ui (shadcn-ui/ui), adapted for our design system
// Uses @radix-ui/react-accordion (already installed)

import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

interface FAQItem {
  q: string
  a: string
}

interface FAQAccordionProps {
  items: FAQItem[]
  className?: string
}

// Single item - reads its open state from Radix via data-state attribute via prop
function AccordionItem({ item, value, isOpen }: { item: FAQItem; value: string; isOpen: boolean }) {
  return (
    <AccordionPrimitive.Item
      value={value}
      className="faq-accordion-item"
      style={{
        background: 'var(--surface)',
        border: `1px solid ${isOpen ? 'rgba(201,168,76,0.22)' : 'var(--border)'}`,
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        transition: 'border-color 0.28s, box-shadow 0.28s',
        boxShadow: isOpen ? '0 4px 24px rgba(0,0,0,0.18)' : 'none',
      }}
    >
      <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            color: 'var(--text-main)',
            fontWeight: 700,
            fontSize: '0.95rem',
            letterSpacing: '-0.01em',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            textAlign: 'left',
          }}
        >
          <span style={{ flex: 1 }}>{item.q}</span>
          <motion.span
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: isOpen ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${isOpen ? 'rgba(201,168,76,0.24)' : 'var(--border)'}`,
              color: isOpen ? 'var(--primary)' : 'var(--text-muted)',
              fontSize: '1.1rem',
              lineHeight: 1,
              transition: 'background 0.25s, border-color 0.25s, color 0.25s',
            }}
            aria-hidden="true"
          >
            +
          </motion.span>
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>

      <AccordionPrimitive.Content forceMount style={{ overflow: 'hidden' }}>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                style={{
                  padding: '16px 24px 22px',
                  borderTop: '1px solid var(--border)',
                }}
              >
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.8, margin: 0 }}>
                  {item.a}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  )
}

export function FAQAccordion({ items, className }: FAQAccordionProps) {
  // Radix is single source of truth — openValue drives both item border/icon AND content
  const [openValue, setOpenValue] = useState<string>('')

  return (
    <AccordionPrimitive.Root
      type="single"
      collapsible
      value={openValue}
      onValueChange={(val) => setOpenValue(val)}
      style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
      className={className}
    >
      {items.map((item, i) => {
        const value = `item-${i}`
        return (
          <AccordionItem
            key={item.q}
            item={item}
            value={value}
            isOpen={openValue === value}
          />
        )
      })}
    </AccordionPrimitive.Root>
  )
}
