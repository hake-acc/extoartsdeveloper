---
name: Optimization run July 2026
description: Full performance/a11y/SEO optimization pass — what was changed and why it matters for future work.
---

# ExtoArts Optimization Run — July 16, 2026

## Hero LCP (P1-A)
- `HeroSection.tsx` converted from `'use client'` to a server component.
- `HeroCycleClient.tsx` created: `'use client'`, uses `useState(false)` guard so SSR/pre-hydration renders static "You Are Valued." text — no hydration mismatch.
- `HeroCtaButton.tsx` created: thin client wrapper for scroll onClick only.
- Entrance animations moved from Framer Motion `motion.h1` to CSS classes `hero-entrance-1..4` in globals.css using `@keyframes heroFadeUp`.
- **Why:** The h1 was JS-dependent, delaying LCP by 1–2 s on mobile.

## CSP unsafe-eval removed (P1-C)
- Removed `unsafe-eval` from `script-src` in `next.config.ts`.
- Also removed `cdn.jsdelivr.net` from all CSP directives (Tabler self-hosted).
- Also removed `iili.io`/`freeimage.host` from `img-src` (images migrated).
- **Why:** `unsafe-eval` is a Lighthouse Best Practices direct hit; not needed in Next.js production builds.

## AuroraGL optimization (P1-B)
- Added `IntersectionObserver` to gate `requestAnimationFrame` — pauses when canvas is off-screen.
- Added `prefers-reduced-motion: reduce` check at top of effect — skips WebGL entirely, CSS aurora fallback is used.
- **Why:** Unbounded RAF loop was taxing GPU + main thread at 60fps even when the user had scrolled away.

## Font display (P2-E)
- Caveat fonts changed from `font-display: swap` to `font-display: optional` — decorative only, no CLS.
- Plus Jakarta Sans and Paper Inko remain `swap` since they're body/display fonts.
- CSS `@keyframes heroFadeUp` added for hero entrance (used instead of Framer Motion on server component).

## Tabler Icons self-hosted (P2-B)
- Installed `@tabler/icons-webfont@3.33.0` as devDependency.
- Copied `tabler-icons.woff2` → `public/fonts/tabler-icons.woff2`.
- Built `public/css/tabler-icons.min.css` with absolute `/fonts/tabler-icons.woff2` path (woff2-only, removes woff/ttf fallbacks).
- Updated `public/js/tabler-icons-loader.js` to use `/css/tabler-icons.min.css`.
- Updated `layout.tsx` Tabler preload to `/fonts/tabler-icons.woff2`.
- Removed `cdn.jsdelivr.net` preconnect/dns-prefetch from layout.

## iili.io images migrated (P2-C)
- Downloaded all images to `public/images/`: og-default.png, founder.jpg, review-1..6.
- Updated `src/lib/constants.ts`: DEFAULT_OG_IMAGE = `/images/og-default.png`, FOUNDER_PHOTO = `/images/founder.jpg`.
- Updated `src/data/reviews.ts`: all img refs now `/images/review-*.webp/.png`.
- Updated `src/app/page.tsx`, `src/app/layout.tsx` (org schema), removed iili.io preconnect.
- Removed `unoptimized` guards from PortfolioClient and FocusSliceCarousel (iili.io gone).
- `remotePatterns: []` in next.config.ts — no external image hosts needed.

## Portfolio alt text (P3-A)
- `src/lib/portfolio.ts` now uses `filenameToAlt(filename, category)` — converts filename to readable alt: "YouTube thumbnail design by ExtoArts — gaming-edit-v2".

## SearchAction removed (P3-C)
- Removed `potentialAction` (SearchAction) from websiteSchema in layout.tsx.
- FAQ page does not implement `?q=` search — the target URL was invalid per Google's spec.

## Keywords removed
- Removed `keywords` array from root metadata — Google has ignored it since 2009.

## Footer Links (P1-D)
- All internal `<a href>` in Footer.tsx replaced with Next.js `<Link href>` for prefetching.

## Focus trap in Navbar (P4-A)
- `drawerRef` added to the mobile drawer motion.div.
- `useEffect` traps Tab/Shift+Tab within focusable elements of the drawer when open.
- First focusable element receives focus on drawer open.

## Error/Loading boundaries (P5-A/B)
- `src/app/error.tsx` created: branded error UI with "Try again" + "Back to home" actions.
- `src/app/loading.tsx` created: skeleton screen matching hero layout; `@keyframes skeletonPulse`; respects `prefers-reduced-motion`.

## Mobile performance fixes — July 17, 2026
Five targeted fixes for touch-device lag; zero visual change on desktop.

1. **Lenis disabled on touch** (`SmoothScrollProvider.tsx`): added `(pointer: coarse)` early-return before Lenis init. Also removed `touchMultiplier` option (irrelevant now). Native mobile scroll is hardware-accelerated; Lenis demotes it to a JS RAF loop.
2. **FluidGradient static on mobile** (`FluidGradient.tsx`): `useEffect` detects `(pointer: coarse)` or `prefers-reduced-motion` and sets `isMobile` state. Mobile path renders a plain CSS `radial-gradient` with no Framer Motion animations and no `filter:blur`. Desktop blur capped at 60px (was 100px). `**Why:**` `filter:blur(100px)` on 150%-viewport divs forces the GPU to rasterize a massive off-screen surface each frame — worst single offender for mobile FPS.
3. **GalaxyButton RAF skipped on touch** (`GalaxyButton.tsx`): early `(pointer: coarse)` return before the `needsJsDriver` check. Mobile can't hover so the spinning border is pure waste.
4. **AuroraGL CSS fallback on mobile** (`AuroraGL.tsx`): added `(pointer: coarse)` early-return alongside the existing `prefers-reduced-motion` check. CSS aurora in globals.css is the fallback.
5. **backdrop-filter removed on touch** (`globals.css`): added `@media (pointer: coarse)` block at end of file overriding `backdrop-filter: none` on `.glass-card`, `.service-card`, `.tstack-badge`, `.hero-badge`, `.page-hero-bg`, `.tilt-card`, `.navbar-glass`. Replaced with opaque solid backgrounds. Also disabled hover `transform` on cards (compositor layer creation on tap is jarring). **Why:** 14+ blurred layers cause GPU memory pressure on mobile; solid backgrounds are free to composite.
