'use client'

// Injects JSON-LD <script> tags during SSR via useServerInsertedHTML so they
// are emitted into the HTML stream but are NEVER in React's virtual DOM during
// client reconciliation — eliminating the React 19 hydration mismatch that
// occurs when dangerouslySetInnerHTML <script> elements appear inside the
// explicit <head> JSX tree.
//
// Usage: <JsonLdInjector schemas={[websiteSchema, orgSchema]} />
// Place the component anywhere in the server component tree (e.g. RootLayout body).

import { useServerInsertedHTML } from 'next/navigation'
import type { Thing, WithContext } from 'schema-dts'

type JsonLdData = WithContext<Thing> | Record<string, unknown> | Record<string, unknown>[]

interface JsonLdInjectorProps {
  schemas: JsonLdData[]
}

export function JsonLdInjector({ schemas }: JsonLdInjectorProps) {
  useServerInsertedHTML(() => (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  ))
  return null
}

// Legacy single-schema export kept for any page-level usage.
// Prefer JsonLdInjector for layout-level schemas.
interface JsonLdProps {
  data: JsonLdData
}

export function JsonLd({ data }: JsonLdProps) {
  useServerInsertedHTML(() => (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  ))
  return null
}
