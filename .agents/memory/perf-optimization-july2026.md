---
name: Performance optimization run July 2026
description: What was changed, constraints hit, and what remains for Tier 3+4
---

## Applied (commit 9250c39)
- next.config.ts: social redirects (discord/youtube/instagram/twitter/facebook/threads + short aliases) moved to edge-level config — zero compute, single-hop to external URL
- next.config.ts: Cache-Control for /images/* (30d SWR)
- layout.tsx: Caveat font preload removed (font-display:optional fonts ignore preloads — was wasting bandwidth competing with LCP)
- globals.css: scroll-behavior:smooth removed from html (Lenis conflict); body text-rendering → auto (faster mobile); skip link uses transform not top (eliminates focus CLS); focus ring border-radius → inherit (was forcing 12px pill on all elements)
- page.tsx: revalidate=3600 (ISR — TTFB from edge cache)
- services/pricing/faq/about/workflow/collab: force-static (no unnecessary function invocations)
- ClientScripts.tsx: prefers-reduced-motion guard on count-up animation (WCAG 2.3.3)

## Key constraint
**ssr:false is NOT allowed in Server Components.** page.tsx is a Server Component — dynamic() there must always use ssr:true. To use ssr:false for below-fold sections, they must be imported from a 'use client' wrapper.

## Tier 3+4 still pending
- Background image preload priority for returning visitors (localStorage theme race)
- schema-dts → devDependencies; turndown → server-only import
- Delete legacy images: founder.jpg, review-1.png, apple-touch-icon.webp
- sw.js: register as service worker or delete
- Remove overflow-x:hidden from html element
- WebMcpProvider: lazy-load only on MCP routes
- Remove redundant X-Frame-Options header
- Make dateModified dynamic in WebPage schema
- Navbar Server/Client component split
- CSP nonces via middleware (architectural change)
- Framer Motion → CSS replacements audit
