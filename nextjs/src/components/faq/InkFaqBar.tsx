'use client'

import { useId, useState } from 'react'

interface FAQItem {
  q: string
  a: string
}

interface InkFaqBarProps {
  label: string
  items: FAQItem[]
}

export function InkFaqBar({ label, items }: InkFaqBarProps) {
  const uid = useId()
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="ink-card-black">
      <div className="ink-faq-row">
        <div className="ink-faq-label">{label}</div>
        <div className="ink-faq-items">
          {items.map((item, i) => {
            const isOpen = open === i
            const triggerId = `${uid}-t-${i}`
            const panelId = `${uid}-p-${i}`
            return (
              <div key={item.q} className="ink-faq-item" data-open={isOpen}>
                <button
                  id={triggerId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="ink-faq-q"
                  style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', textAlign: 'left', padding: 0 }}
                >
                  <span>{item.q}</span>
                  <i className="ti ti-chevron-down" aria-hidden="true" />
                </button>
                {isOpen && (
                  <div id={panelId} role="region" aria-labelledby={triggerId} className="ink-faq-a">
                    {item.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
