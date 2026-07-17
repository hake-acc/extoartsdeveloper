# Technical SEO Findings

## Score: 80/100

## Passing Checks
- robots.txt: ✅ Served via Next.js route (`src/app/robots.txt/route.ts`) — works in dev + prod
- XML Sitemap: ✅ sitemap.xml → sitemap-0.xml, 13 pages, image extension on /portfolio
- 301 Redirects: ✅ 30+ legacy paths covered in next.config.ts
- Canonical: ✅ Present on all pages via buildMetadata()
- Hreflang: ✅ 13 locales including x-default
- Security headers: ✅ X-Frame, X-Content-Type, Referrer-Policy, Permissions-Policy, CSP
- 404 page: ✅ Custom not-found.tsx with metadata
- PWA: ✅ site.webmanifest with standalone display
- ads.txt: ✅ Explicitly disallows programmatic ads

## Failures
- /apply not in sitemap (CRITICAL)
- site.webmanifest 512×512 icon from external CDN i.ibb.co (HIGH)
- PWA screenshot from iili.io CDN (HIGH)
- Social redirect pages may be indexed without noindex (MEDIUM)
- humans.txt lists PHP 8.2 / MySQL — incorrect (MEDIUM)
- llms.txt dated June 17, 2026 — 1 month stale (MEDIUM)
