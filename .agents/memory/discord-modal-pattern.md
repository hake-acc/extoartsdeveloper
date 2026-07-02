---
name: Discord modal interactivity pattern
description: How to wire up Discord modal open/close in this Next.js 16 App Router project without breaking Server Components.
---

## Rule
Any button or element that opens/closes the Discord modal must be inside a `'use client'` component. Server pages (no `'use client'` directive) cannot have `onClick` props directly on DOM elements — Next.js 16 throws "Event handlers cannot be passed to Client Component props" at prerender time.

## How to apply
- For a "Get a Quote" / "Start a Project" CTA in a server page → import and render `<DiscordButton>` from `@/components/ui/DiscordButton`.
- For the modal itself → `@/components/DiscordModal` (client component, handles open/close internally).
- For global browser effects (scroll reveal, count-up, etc.) → `@/components/ClientScripts` (client component, runs in `useEffect`).
- Never add `dangerouslySetInnerHTML` script tags to server pages to wire up click events — this renders correctly on SSR but the script does not execute client-side in React rendering, causing a "script tag while rendering" warning.

**Why:** Next.js 16 App Router: all JSX rendered inside a Server Component is serialized before being sent to the client. Event handler functions are not serializable, so any `onClick` on a DOM element inside a Server Component causes a fatal prerender error.

**Applies to:** every new page or section that needs to trigger the Discord modal.
