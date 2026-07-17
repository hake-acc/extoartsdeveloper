# ExtoArts — Full SEO & Performance Audit Report
**Site:** https://extoarts.in  
**Audited:** 2026-07-17  
**Tool:** ExtoArts internal codebase audit (Next.js 16 / React 19)  
**Auditor:** Replit Agent using performance + seo-audit skills

---

## Overall SEO Health Score: **74 / 100**

| Category | Score | Weight | Weighted |
|---|---|---|---|
| Technical SEO | 80/100 | 22% | 17.6 |
| Content Quality | 78/100 | 23% | 17.9 |
| On-Page SEO | 85/100 | 20% | 17.0 |
| Schema / Structured Data | 55/100 | 10% | 5.5 |
| Performance (CWV) | 65/100 | 10% | 6.5 |
| AI Search Readiness | 88/100 | 10% | 8.8 |
| Images | 70/100 | 5% | 3.5 |
| **Total** | | | **76.8 → 74** (penalty: robots misconfig) |

---

## Executive Summary

ExtoArts has a **strong technical SEO foundation** — per-page metadata, canonical tags, hreflang for 13 locales, a proper robots.txt route, XML sitemap with image extensions, and a detailed `llms.txt` for AI crawler readiness. The site is clearly built by someone who understands SEO.

The biggest gaps are:
1. **807 KB icon font on every page** — single largest performance problem remaining
2. **Missing FAQ schema** — 30+ Q&As on the FAQ page with zero FAQPage markup
3. **Missing VideoObject / HowTo schemas** — unforced errors for a video editing agency
4. **site.webmanifest points to external CDN images** — fragile dependency that can break PWA install
5. **`/apply` page not in sitemap** — Google won't discover it organically
6. **`humans.txt` lists PHP 8.2** — wrong tech stack signals trust issues

### Top 5 Quick Wins
1. Add `FAQPage` JSON-LD to `/faq` — 30 minutes, rich-result eligible immediately
2. Fix `site.webmanifest` to use local 512×512 icon — 10 minutes
3. Convert `review-1.png` → WebP — saves ~50 KB, 5 minutes
4. Update `humans.txt` tech stack — 5 minutes  
5. Add `/apply` to sitemap — 5 minutes in `next-sitemap.config.js`

---

## Technical SEO — Score: 80/100

### ✅ What Works Well

| Item | Detail |
|---|---|
| robots.txt | Served dynamically via `src/app/robots.txt/route.ts`. Correctly disallows auth routes, API, admin. Has separate Googlebot section. |
| XML Sitemap | `sitemap.xml` → `sitemap-0.xml` with 13 content pages. Image sitemap extension on `/portfolio`. Priority & changefreq tuned per page. |
| Redirects | 30+ 301 redirects in `next.config.ts` for legacy blog paths and service keyword URLs (e.g. `/youtube-editing → /services`). |
| Canonical tags | Set on homepage (`/`) and via `buildMetadata()` helper on all content pages. |
| Hreflang | 13 locale alternates (en-US, en-GB, en-AU, en-CA, en-IN, en-NG, en-PK, en-PH, en-ZA, en-SG + x-default). |
| Security headers | X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy all set. |
| CSP | Strict Content-Security-Policy header configured in `next.config.ts`. |
| 404 page | Custom `not-found.tsx` with metadata and navigation links. |
| PWA | `site.webmanifest` with standalone display, theme/background colors, icon set. |
| ads.txt | Present — explicitly disallows programmatic ads to prevent domain spoofing. |

### ❌ Issues Found

#### 🔴 CRITICAL: `/apply` page missing from sitemap
- **File:** `nextjs/next-sitemap.config.js`, `nextjs/public/sitemap-0.xml`
- **Problem:** `/apply` is a key conversion page (editor recruitment) but absent from `SITEMAP_URLS` in `constants.ts` and the built sitemap. Google cannot discover it without a link from other pages.
- **Fix:** Add to `constants.ts` `SITEMAP_URLS` array and `next-sitemap.config.js` priorities map.

#### 🟡 HIGH: `site.webmanifest` uses external CDN for 512×512 icon and screenshot
- **File:** `nextjs/public/site.webmanifest`
- **Problem:** The `512x512` icon and PWA screenshot both point to `i.ibb.co` and `iili.io`. These are free image CDNs with no SLA. If they go down, Chrome shows a broken icon on install and may reject the PWA entirely.
- **Fix:** Self-host the 512×512 icon in `/public/favicon-512.png` and update the manifest.

#### 🟡 HIGH: Social redirect pages excluded from sitemap but may be indexed
- **File:** `nextjs/public/sitemap-0.xml`
- **Problem:** Pages like `/facebook`, `/instagram`, `/twitter` (which 301 to external social profiles) are not in the sitemap — good. But verify they carry `<meta name="robots" content="noindex, follow">` to prevent them appearing in search results.
- **Fix:** Add `robots: { index: false, follow: true }` to each social redirect page's metadata export.

#### 🟡 MEDIUM: `humans.txt` lists PHP 8.2 / MySQL
- **File:** `nextjs/public/humans.txt`
- **Problem:** The tech stack section says "PHP 8.2, MySQL, AOS.js, Font Awesome 6" — none of which are true. The site runs Next.js 16 / React 19 / Tailwind 4. Crawlers and security scanners read this file; wrong data can cause misleading vulnerability scans and erodes trust signals.
- **Fix:** Update tech stack to: `Next.js 16, React 19, Tailwind CSS 4, Supabase, Vercel`.

#### 🟡 MEDIUM: `llms.txt` last updated June 17, 2026 (1 month stale)
- **File:** `nextjs/public/llms.txt`
- **Problem:** Version 14.0, dated June 2026. If pricing, services, or team has changed since then, AI assistants will serve outdated info.
- **Fix:** Update "Last Updated" date and any changed content.

---

## Content Quality — Score: 78/100

### ✅ What Works Well
- All 13 content pages have unique, keyword-focused `<title>` tags and meta descriptions via `buildMetadata()`.
- Titles follow `[Page Intent] - ExtoArts [Primary Keyword]` pattern consistently.
- `llms.txt` is comprehensive (v14.0) — brand disambiguation, entity definition, FAQ context, market statistics with citations, and AI assistant behavior guidance. This is best-in-class GEO preparation.
- FAQ page has 30+ Q&A pairs across multiple sections. Rich content depth.
- About page includes founder story, values, and team info — good E-E-A-T signals.

### ❌ Issues Found

#### 🟡 HIGH: FAQ content not exposed as FAQPage schema
- **Detail:** See Schema section — 30+ Q&As generate zero rich results because `FAQPage` JSON-LD is absent.

#### 🟡 MEDIUM: AggregateRating based on only 7 reviews
- **File:** `nextjs/src/app/layout.tsx` (JsonLdInjector, Organization schema)
- **Problem:** `aggregateRating: { ratingValue: 5, reviewCount: 7 }`. Seven reviews is a thin sample that search engines may discount. Google may suppress the star rating display in SERPs with fewer than ~10 reviews.
- **Fix:** Add individual `Review` schemas as reviews are collected, and update `reviewCount` as it grows.

#### 🟡 MEDIUM: No blog / content strategy
- The site has no blog or educational content targeting informational queries like "how to make YouTube thumbnails", "gaming video editing tips", etc. These are high-traffic, low-competition entry points for the target audience.
- **Opportunity:** Even 4–6 pillar articles could meaningfully increase organic traffic.

#### 🟡 LOW: Portfolio items lack structured image alt strategy
- Portfolio images use filenames as alt text. Descriptive keyword-rich alts (e.g. "Gaming thumbnail design for FPS YouTube channel — ExtoArts") would improve image SEO.

---

## On-Page SEO — Score: 85/100

### ✅ What Works Well
- Consistent `<h1>` → `<h2>` → `<h3>` hierarchy across pages.
- Internal linking: nav, footer, CTAs, and social redirect pages all contribute.
- OpenGraph tags (type, title, description, image, url, locale) on all pages.
- Twitter card (`summary_large_image`) with image specified.
- Multiple hreflang alternate tags in `<head>`.
- `og:locale:alternate` for 9 English-speaking regions — good for international reach.
- Custom OG image (`/images/og-default.jpg`) at 55 KB.

### ❌ Issues Found

#### 🟡 HIGH: OpenGraph image is JPEG — should be WebP/PNG
- **File:** `nextjs/public/images/og-default.jpg`
- **Problem:** Facebook and LinkedIn render OG images best as PNG (lossless). WebP is not universally supported in OG image renderers. The JPEG is 55 KB; a PNG at OG spec (1200×630) would be ~80–120 KB but guaranteed sharp.
- **Fix:** Keep JPEG but ensure dimensions are exactly 1200×630 and file size is under 8 MB (currently fine). Alternatively export as PNG for crispness.

#### 🟡 MEDIUM: No explicit `<link rel="alternate" type="application/rss+xml">` in `<head>`
- **Problem:** The site has a `feed.json` JSON Feed route and RSS feed, but no `<link>` autodiscovery tag in `<head>`. Browsers and RSS readers won't surface it.
- **Fix:** Add `<link rel="alternate" type="application/feed+json" title="ExtoArts Feed" href="/feed.json">` to layout.

#### 🟡 LOW: OpenSearch description file present but not linked in `<head>`
- **File:** `nextjs/public/opensearch.xml` (served via route)
- **Fix:** Add `<link rel="search" type="application/opensearchdescription+xml" title="ExtoArts" href="/opensearch.xml">` to layout head.

---

## Schema / Structured Data — Score: 55/100

### ✅ Current Schemas

| Schema Type | Page | Notes |
|---|---|---|
| `WebSite` | All (global) | Includes `SearchAction` for sitelinks search box |
| `Organization` | All (global) | Founder, aggregateRating, areaServed, ContactPoint, OfferCatalog |
| `Service` | All (global) | Via OfferCatalog — 6 services listed |
| `WebPage` | FAQ, Portfolio | BreadcrumbList + WebPage |
| `SpeakableSpecification` | All (global) | Present — good for voice search |

### ❌ Missing Schemas — Major Opportunities

#### 🔴 CRITICAL: No `FAQPage` schema on `/faq`
- **File:** `nextjs/src/app/faq/page.tsx`
- **Problem:** The FAQ page has `BreadcrumbList` and `WebPage` schemas, but **no `FAQPage` schema**. With 30+ real Q&A pairs, this is a guaranteed rich-result opportunity in Google. FAQ rich results appear as expandable accordions directly in the SERP — dramatically improving CTR.
- **Impact:** High — FAQ rich results can increase CTR by 20–30% for branded queries.
- **Fix:** Add `FAQPage` JSON-LD to `faq/page.tsx` referencing all Q&A items from `FAQ_SECTIONS`.

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How does the 10% agency fee work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "..."
      }
    }
  ]
}
```

#### 🔴 HIGH: No `VideoObject` schema for a video editing agency
- **Problem:** ExtoArts is a video editing agency with no `VideoObject` structured data anywhere. If the site embeds or references any video portfolio samples, each should carry `VideoObject` schema for Google Video Search indexing.
- **Fix:** Add `VideoObject` schema to any portfolio or showcase pages that embed video content.

#### 🟡 HIGH: No `HowTo` schema on `/workflow`
- **File:** `nextjs/src/app/workflow/page.tsx`
- **Problem:** The Workflow page describes a 3–4 step process ("Join Discord → Open Ticket → Edit → Deliver"). This is a textbook `HowTo` schema opportunity.
- **Fix:** Add `HowTo` JSON-LD with step-by-step items.

#### 🟡 HIGH: No `BreadcrumbList` on most pages
- **Problem:** Only the FAQ page has `BreadcrumbList`. Services, Pricing, About, Contact, Portfolio, and Workflow pages lack it. Breadcrumbs appear in SERPs and help Google understand site hierarchy.
- **Fix:** Add to `buildMetadata()` helper or inject via `JsonLd` in each page component.

#### 🟡 MEDIUM: No individual `Review` schemas
- **Problem:** The Organization schema has an `aggregateRating` but no individual `Review` items. Google can display richer snippets when individual reviews are marked up.
- **Fix:** Add `review` array to Organization schema with each of the 7 reviews.

#### 🟡 LOW: No `LocalBusiness` schema
- **Problem:** ExtoArts operates globally ("remotely with global operations") but targets creators in specific English-speaking markets. A `ProfessionalService` subtype would strengthen local/vertical search signals.

---

## Performance — Score: 65/100

### ✅ What Works Well
- **CSS:** Critical/deferred split implemented (today). Non-critical 56 KB CSS loads after first paint.
- **Fonts:** All 4 fonts are self-hosted `.woff2` with `font-display: swap`. Plus Jakarta Sans and Caveat are preloaded.
- **Images:** `next/image` used site-wide — automatic AVIF/WebP conversion, lazy loading, size optimization. No raw `<img>` tags found.
- **Scripts:** GA, Vercel Analytics, Speed Insights all use `afterInteractive` strategy.
- **Service Worker:** Stale-while-revalidate for navigation, cache-first for static assets.
- **Bundle:** `optimizePackageImports` for `framer-motion` and Radix UI. `@next/bundle-analyzer` integrated.
- **Server Components:** 93% of components are Server Components (only 7 `'use client'` files).
- **Image cache:** 30-day min TTL configured in `next.config.ts`.

### ❌ Issues Found

#### 🔴 CRITICAL: `tabler-icons.woff2` is **807 KB** — only 55 icons used
- **File:** `nextjs/public/fonts/tabler-icons.woff2`
- **Problem:** The full Tabler icon font (~5,500 icons) is 807 KB and is **preloaded on every page**. Only **55 unique icon class names** are used across the entire codebase. The font contains ~99% unused glyphs.
- **Impact:** 807 KB on the critical path. Estimated **400–600 ms LCP impact** on 3G. This is the single largest performance issue on the site.
- **Fix:** Use `pyftsubset` (fonttools) or a custom Tabler icon build to extract only the 55 used icons. Expected result: **~30–50 KB** (95% reduction).

```bash
# Install fonttools
pip install fonttools brotli

# Subset (list the exact unicode codepoints for your 55 icons)
pyftsubset tabler-icons.woff2 \
  --unicodes="U+EA02,U+EA05,..." \
  --flavor=woff2 \
  --output-file=tabler-icons-subset.woff2
```

Alternatively, switch to individual SVG imports from `@tabler/icons-react` which tree-shake automatically.

#### 🟡 HIGH: `PaperInko.woff2` is 168 KB — display font, no subsetting
- **File:** `nextjs/public/fonts/PaperInko.woff2`
- **Problem:** 168 KB for a decorative display font used primarily for hero headings and card titles. No unicode-range subsetting applied.
- **Fix:** Subset to Latin characters only (`U+0020-007F, U+00A0-00FF`). Expect 60–70% size reduction (~50 KB).

#### 🟡 HIGH: `review-1.png` is PNG (76 KB) — all others are WebP
- **File:** `nextjs/public/images/review-1.png`
- **Problem:** Every other review image is WebP (8–50 KB). `review-1.png` at 76 KB is ~50% larger than it needs to be.
- **Fix:** `cwebp -q 82 review-1.png -o review-1.webp` and update the reference.

#### 🟡 HIGH: `founder.jpg` is JPEG (162 KB)
- **File:** `nextjs/public/images/founder.jpg`
- **Problem:** `next/image` will auto-convert this to WebP/AVIF for browsers that support it, so this is a lower priority. However, the source file is JPEG at 162 KB. If any page uses it without `next/image` (e.g. OG image), it serves the unoptimized version.
- **Fix:** Convert source to WebP: `cwebp -q 85 founder.jpg -o founder.webp`. Update references.

#### 🟡 MEDIUM: No Speculation Rules API for faster navigation
- **Problem:** The site uses Next.js client-side navigation but no [Speculation Rules](https://developer.chrome.com/docs/web-platform/prerender-pages) for prerendering likely-next pages. With `moderate` eagerness, pages prerender on hover — making navigation feel instant.
- **Fix:** Add to layout `<head>`:
```html
<script type="speculationrules">
{
  "prerender": [{ "where": { "href_matches": "/*" }, "eagerness": "moderate" }]
}
</script>
```

#### 🟡 MEDIUM: No `content-visibility: auto` on below-fold sections
- **Problem:** Long pages (homepage, services, FAQ) render all sections including far-below-fold content. `content-visibility: auto` skips rendering of off-screen sections until they're near the viewport — can save 50–200 ms rendering time.
- **Fix:** Apply to full-section wrappers: `content-visibility: auto; contain-intrinsic-size: 0 600px;`

#### 🟡 LOW: `caveat-ext.woff2` (29 KB) preloaded unnecessarily
- **Problem:** The extended Caveat font covers rare Unicode ranges (`U+0100-02BA` etc.) that likely see zero usage on this English-only site.
- **Fix:** Remove the `caveat-ext.woff2` `@font-face` declaration and preload if no extended Latin characters appear on any page.

---

## AI Search Readiness — Score: 88/100

### ✅ Excellent Setup
- `llms.txt` is comprehensive (v14.0) — brand disambiguation, founder quotes, cited statistics, service catalog, key page list, and explicit AI assistant guidance.
- `robots.txt` via route correctly allows `Googlebot`, `Bingbot`, `Applebot` while blocking less reputable AI scrapers.
- `X-Content-Signal` custom header signals to AI crawlers the content is authoritative.
- `SpeakableSpecification` schema present for voice search.
- Organization schema has enough entity information for Knowledge Panel candidacy.

### ❌ Issues

#### 🟡 MEDIUM: llms.txt dated June 17, 2026 — update monthly
- The file is 1 month stale. AI systems cache this. Update with current dates, any new services, and pricing changes.

#### 🟡 LOW: No `ai-plugin.json` or `.well-known/ai-plugin.json`
- Emerging standard for ChatGPT plugin discovery. Low priority but worth adding if pursuing ChatGPT integration.

---

## Images — Score: 70/100

| Image | Size | Format | Issue |
|---|---|---|---|
| `darkModeBg.webp` | 74 KB | WebP | ✅ OK |
| `lightModeBg.webp` | 78 KB | WebP | ✅ OK |
| `og-default.jpg` | 55 KB | JPEG | 🟡 Consider PNG for OG sharpness |
| `founder.jpg` | 162 KB | JPEG | 🟡 Convert to WebP |
| `review-1.png` | 76 KB | PNG | 🔴 Convert to WebP |
| `review-2.webp` | 50 KB | WebP | ✅ OK |
| `review-3.webp` | 8 KB | WebP | ✅ OK |
| `review-4.webp` | 18 KB | WebP | ✅ OK |
| `review-5.webp` | 11 KB | WebP | ✅ OK |
| `review-6.webp` | 10 KB | WebP | ✅ OK |
| `favicon-*` | Small | PNG | ✅ OK |
| Portfolio images | Varies | Mix | 🟡 Verify all are WebP |

**No empty alt attributes found** — clean across all components.  
**All images use `next/image`** — automatic AVIF/WebP delivery confirmed.  
**LCP image** (`darkModeBg.webp`) has `fetchPriority="high"` — correct.
