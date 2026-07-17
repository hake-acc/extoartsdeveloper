# Performance Findings

## Score: 65/100

## Asset Inventory

| Asset | Size | Status |
|---|---|---|
| tabler-icons.woff2 | 807 KB | 🔴 CRITICAL — 55 of ~5500 icons used |
| PaperInko.woff2 | 168 KB | 🟡 Subset to Latin |
| caveat.woff2 | 60 KB | ✅ OK |
| caveat-ext.woff2 | 29 KB | 🟡 Likely unused range |
| plus-jakarta-sans.woff2 | 27 KB | ✅ OK |
| plus-jakarta-sans-italic.woff2 | 29 KB | ✅ OK |
| darkModeBg.webp | 74 KB | ✅ OK |
| lightModeBg.webp | 78 KB | ✅ OK |
| founder.jpg | 162 KB | 🟡 Convert to WebP |
| review-1.png | 76 KB | 🟡 Convert to WebP |
| og-default.jpg | 55 KB | ✅ Acceptable |

## Passing Checks
- Critical/deferred CSS split: ✅ (just implemented)
- Self-hosted fonts with preload: ✅
- next/image everywhere: ✅ (no raw img tags found)
- AVIF/WebP delivery: ✅ (next.config.ts)
- 30-day image cache TTL: ✅
- afterInteractive scripts: ✅ (GA, Vercel, Tabler loader)
- Service Worker: ✅ stale-while-revalidate + cache-first
- optimizePackageImports: ✅ framer-motion, radix-ui
- Server Components: ✅ 93% of components
- Bundle analyzer: ✅ integrated

## Failures
- tabler-icons.woff2 807 KB for 55 icons (CRITICAL)
- PaperInko.woff2 168 KB not subsetted (HIGH)
- review-1.png is PNG not WebP (HIGH)
- founder.jpg is JPEG not WebP (MEDIUM)
- No Speculation Rules API (MEDIUM)
- No content-visibility:auto on below-fold sections (MEDIUM)
- caveat-ext.woff2 29 KB preloaded for likely-unused unicode range (LOW)

## Tabler Icons Actually Used (55 total)
ti-adjustments, ti-alert-triangle, ti-arrow-right, ti-award, ti-brand-discord,
ti-brand-x, ti-brand-youtube, ti-briefcase, ti-building, ti-calculator,
ti-channel, ti-chart-line, ti-check, ti-chevron-down, ti-circle-letter-e,
ti-clock, ti-clock-check, ti-credit-card, ti-device-gamepad-2,
ti-device-mobile-vibration, ti-eye, ti-eye-off, ti-file-invoice,
ti-file-pencil, ti-help-circle, ti-home, ti-info-circle, ti-layout-grid,
ti-line, ti-list-details, ti-mail, ti-message-circle, ti-movie, ti-panorama,
ti-percentage, ti-photo, ti-receipt, ti-refresh, ti-rocket, ti-route, ti-send,
ti-settings-automation, ti-shield-check, ti-sparkles, ti-star, ti-target,
ti-trending-up, ti-upload, ti-user, ti-users, ti-video, ti-wand, ti-world,
ti-x, ti-zoom-in
