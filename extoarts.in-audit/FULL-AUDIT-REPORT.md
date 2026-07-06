# ExtoArts SEO Full Audit Report
**Domain:** extoarts.in | **Date:** July 6, 2026 | **Stack:** Next.js 16 / Vercel
**Business Type:** YouTube Creative Agency (Agency vertical)

---

## SEO Health Score: 69 / 100

| Category | Weight | Score | Weighted |
|---|---|---|---|
| Technical SEO | 22% | 62/100 | 13.6 |
| Content Quality | 23% | 72/100 | 16.6 |
| On-Page SEO | 20% | 65/100 | 13.0 |
| Schema / Structured Data | 10% | 58/100 | 5.8 |
| Performance (CWV) | 10% | 75/100 | 7.5 |
| AI Search Readiness | 10% | 82/100 | 8.2 |
| Images | 5% | 80/100 | 4.0 |
| **TOTAL** | **100%** | | **68.7 → 69** |

---

## Executive Summary

ExtoArts has a solid foundation: clean Next.js stack on Vercel, proper HTTPS/security headers, all public pages returning 200, a well-structured llms.txt, and decent on-page content depth. The biggest drag on the score is a cluster of fixable issues: a missing homepage OG image, no hreflang implementation despite 13 locales defined in code, a deprecated HowTo schema on /workflow, a query-string robots.txt rule that accidentally blocks the site's own SearchAction, and several title tag duplications. None of these require a redesign — they are configuration and metadata fixes.

### Top 5 Critical Issues
1. **Homepage og:image missing** — homepage won't generate a social preview card on any platform
2. **HowTo schema on /workflow** — deprecated September 2023; lost rich result eligibility nearly 3 years ago
3. **`/*?*` robots disallow blocks SearchAction** — the site's own `/faq?q=` endpoint (used in schema + OpenSearch) is blocked for all bots
4. **/estimate page has no canonical tag** — crawlers may index it under a duplicate/wrong URL
5. **Hreflang not implemented in HTML** — 13 locales defined in constants.ts, none emitted in `<head>`; en-IN and SEA markets unaddressed

### Top 5 Quick Wins
1. Add `og:image` to homepage metadata (1 line in layout)
2. Replace HowTo schema with ItemList or custom Process schema
3. Remove `/*?*` from robots.txt or add `/faq?q=*` allow exception
4. Add canonical to /estimate page
5. Fix duplicate brand suffix in /services and /portfolio titles

---

## 1. Technical SEO

### ✅ What Works
- **HTTPS enforced:** HTTP → HTTPS 308 redirect working correctly
- **All public pages 200:** /, /services, /pricing, /portfolio, /about, /workflow, /faq, /contact, /estimate, /collab, /tos, /privacy — all clean
- **Security headers:** HSTS (63 days), X-Frame-Options: SAMEORIGIN, X-Content-Type-Options: nosniff, Referrer-Policy: strict-origin-when-cross-origin, Permissions-Policy (camera/mic/geo off)
- **robots.txt:** Structured with AI crawler section; explicit `Allow: /` and `Allow: /llms.txt` for GPTBot, ClaudeBot, PerplexityBot, Googlebot, and 8 others
- **Sitemap:** Valid XML, 20 URLs, referenced in robots.txt and sitemaps directive
- **CDN delivery:** Vercel with `x-vercel-cache: HIT`, `age:` header confirming edge caching

### ❌ Findings

#### [CRITICAL] `/*?*` Disallow Blocks SearchAction Endpoint
- **Evidence:** robots.txt line `Disallow: /*?*` applies to ALL user agents. The site's own SearchAction schema and OpenSearch descriptor both use `/faq?q={search_term_string}`. Any bot following the schema will be blocked.
- **Fix:** Add `Allow: /faq?q=` before the `/*?*` rule in robots.txt for the `*` group, or narrow the wildcard to only block tracking params: `Disallow: /*?utm_*`

#### [HIGH] Social Redirect Pages Use 307 (Temporary) Instead of 308 (Permanent)
- **Evidence:** `/discord`, `/youtube`, `/instagram`, `/twitter`, `/facebook` all return 307
- **Impact:** 307 does not pass PageRank. All social link equity from external sites linking to these short URLs is not consolidated.
- **Fix:** Change redirect type to 308 in `next.config.ts`

#### [HIGH] www Subdomain Does Not Redirect to Non-www
- **Evidence:** `http://www.extoarts.in/` → 308 → `https://www.extoarts.in/` (adds HTTPS but keeps www). The canonical is `https://extoarts.in` (non-www). www and non-www are currently serving as separate origins.
- **Impact:** Link equity split; Googlebot may index both versions.
- **Fix:** Add a Vercel redirect rule (or DNS redirect) sending `www.extoarts.in` → `extoarts.in`

#### [HIGH] Social Redirect Pages in Sitemap Are Redirect Destinations, Not Canonical URLs
- **Evidence:** `/discord`, `/youtube`, `/instagram`, `/twitter`, `/threads`, `/facebook` appear in sitemap.xml but return 307 redirects
- **Impact:** Google ignores or devalues sitemap entries that redirect. Wastes crawl budget.
- **Fix:** Remove social redirect pages from sitemap.xml. Sitemap should only list canonical, indexable pages.

#### [MEDIUM] Missing Content-Security-Policy Header
- **Evidence:** Response headers include no CSP. Site loads external resources from iili.io CDN.
- **Fix:** Add a permissive CSP starting with `default-src 'self'; img-src 'self' iili.io data:` and tighten iteratively.

#### [MEDIUM] lastmod in Sitemap Is Always Current Timestamp
- **Evidence:** All 20 sitemap entries share the same `lastmod` value (generated dynamically as `new Date().toISOString()` at build time). This is misleading — Google's crawl scheduler uses lastmod to prioritize recrawls.
- **Fix:** Store actual last-modified dates per route in a `sitemap-dates.ts` config and reference them in `sitemap.ts`

---

## 2. On-Page SEO

### ✅ What Works
- All core pages have unique meta descriptions
- All canonical tags present (except /estimate)
- Keyword targeting is on-point: "YouTube video editing", "thumbnail design", "channel automation", "flat-fee", "10% agency fee"
- Internal linking from homepage covers all key pages

### ❌ Findings

#### [CRITICAL] /estimate Page: Missing Canonical Tag + Generic Title
- **Canonical:** Missing entirely — crawlers may index under any URL variation
- **Title:** "ExtoArts | YouTube Video Editing Agency & Thumbnail Design" — identical to the homepage fallback; not unique
- **Meta description:** Generic (146 chars, same as homepage)
- **Fix:** Add a unique canonical, title, and description in the /estimate page metadata

#### [HIGH] Duplicate Brand Suffix on /services and /portfolio Titles
- **Evidence:**
  - `/services`: "YouTube Video Editing Services - Thumbnails & Shorts | ExtoArts | **ExtoArts**" (78 chars — over 60)
  - `/portfolio`: "Portfolio - YouTube Thumbnails, Logos & Channel Banners | ExtoArts | **ExtoArts**" (81 chars — over 60)
- **Impact:** Google truncates titles over ~60 chars in SERPs; the duplicate "ExtoArts" wastes character budget and looks like a bug.
- **Fix:** Remove duplicate suffix from both pages

#### [HIGH] Homepage OG Title Weaker Than Page Title
- **Page title:** "YouTube Video Editing & Thumbnail Design | ExtoArts" (keyword-rich)
- **OG title:** "ExtoArts - YouTube Editing Agency" (shorter, less descriptive)
- **Impact:** Social shares use the weaker OG title. Discord/Twitter/Facebook previews under-sell the page.
- **Fix:** Align og:title with the page title or use a deliberate social-optimised version

#### [MEDIUM] Homepage H1 Not Keyword-Optimised
- **H1:** "Where You Are Valued." — a brand-positioning statement, not a search-intent phrase
- **Opportunity:** Competitors rank for "YouTube video editing agency", "hire video editor", "YouTube thumbnail design service". The H1 contains none of these.
- **Fix:** Consider an H1 closer to "YouTube Video Editing & Thumbnail Design Agency" with the "Where You Are Valued" as a subheadline — or keep the current H1 and ensure the hero section's visible keyword copy is in an H2 or prominent paragraph

#### [MEDIUM] /collab Meta Description Exceeds 155-char Limit
- **Evidence:** 165 chars — "Commission motion graphics, VFX, thumbnails, video editing, and post-production from ExtoArts. One-off creative work for brands and creators with a high quality bar."
- **Fix:** Trim to ≤155 chars

#### [INFO] Hreflang Defined in Code But Not Emitted
- **Evidence:** `constants.ts` defines 13 locales (en, en-US, en-GB, en-IN, en-AU, en-CA, en-NG, en-PK, en-PH, en-ZA, en-BD, en-NZ, en-SG). Zero hreflang `<link>` tags appear in any page's `<head>`.
- **Context:** ExtoArts explicitly targets South Asian, Southeast Asian, African, and Western markets (confirmed by Country schema entries). No hreflang = no market signal to Google.
- **Fix:** Implement hreflang using Next.js `alternates.languages` in `generateMetadata()` — since the site is English-only but targeting multiple English locales, use `x-default` + locale alternates all pointing to the same URL (self-referencing hreflang for language/region targeting)

---

## 3. Schema / Structured Data

### ✅ What Works
- Organization + ProfessionalService schema on homepage with `@graph` structure
- WebSite + SearchAction schema (sitelinks search box)
- WebPage schema per page with `speakable` CSS selectors
- AggregateRating on service-heavy pages (/services, /pricing, /about)
- FAQPage on multiple pages — Google retired FAQ rich results May 7, 2026, but FAQPage retains **AI/LLM citation value** (keep it; just don't expect SERP stars)
- CollectionPage schema on /portfolio

### ❌ Findings

#### [CRITICAL] HowTo Schema on /workflow — Deprecated September 2023
- **Evidence:** `/workflow` has `"@type": "HowTo"` with 8 HowToSteps
- **Impact:** HowTo rich results were removed by Google in September 2023 — nearly 3 years ago. The schema generates zero SERP benefit and may trigger a manual quality signal against stale markup.
- **Fix:** Replace with `ItemList` (steps as list items) or a custom `Process` schema using `WebPage` + `mainEntity: ItemList`. The step content itself is excellent and should be preserved.

#### [HIGH] Missing og:image on Homepage
- **Evidence:** Homepage HTML contains no `<meta property="og:image">` tag. Interior pages (/, /services, /pricing, /about) have `https://iili.io/BZ0qLb4.png` via the OG tags, but the homepage is missing it.
- **Impact:** Any share of `https://extoarts.in/` on Discord, Twitter, Facebook, LinkedIn, WhatsApp — no image preview. Large conversion drop for referral traffic.
- **Fix:** Add `openGraph: { images: [{ url: DEFAULT_OG_IMAGE }] }` to the root `layout.tsx` metadata

#### [HIGH] Missing og:type and og:locale (Primary)
- **Evidence:** Homepage has `og:locale:alternate` tags (en_GB, en_AU, en_CA) but no primary `og:locale` and no `og:type`
- **Fix:** Add `og:type: "website"` and `og:locale: "en_US"` to homepage metadata

#### [HIGH] Missing og:image Dimensions
- **Evidence:** No `og:image:width` or `og:image:height` on any page
- **Impact:** Facebook and LinkedIn validators warn on missing dimensions; some platforms skip the image
- **Fix:** Add `og:image:width: 2048` and `og:image:height: 1144` (matches actual iili.io image size from Organization schema)

#### [MEDIUM] Missing VideoObject Schema
- **Evidence:** ExtoArts is a video editing agency with a YouTube channel (`youtube.com/@extoarts`). No VideoObject schema on any page.
- **Opportunity:** Embedding portfolio video samples with VideoObject schema (name, description, thumbnailUrl, uploadDate, duration) enables video rich results in Google Search.
- **Fix:** Add VideoObject schema to /portfolio for any embedded/linked videos

#### [MEDIUM] Missing Service Schema
- **Evidence:** /services page lists 4 distinct services (YouTube Editing, Thumbnail Design, Shorts Editing, Channel Automation) with no `Service` schema
- **Fix:** Add `Service` schema for each offering with `provider`, `serviceType`, `areaServed`, and `offers`

#### [MEDIUM] Missing BreadcrumbList
- **Evidence:** No BreadcrumbList schema on any page. No visible breadcrumb UI either.
- **Fix:** Add BreadcrumbList to all inner pages (e.g., Home > Services; Home > Pricing)

#### [INFO] FAQPage on Non-FAQ Pages
- **Evidence:** FAQPage schema appears on /services, /pricing, /about, /faq, /workflow — Google's May 2026 retirement of FAQ rich results means these generate no SERP feature. However, they remain valuable for AI/LLM citation (structured Q&A is highly citable by Perplexity, ChatGPT, etc.).
- **Action:** Keep FAQPage schema as-is. Do not remove. Note that it no longer drives SERP stars.

---

## 4. Content Quality (E-E-A-T)

### ✅ What Works
- Founder persona (Rehan) clearly established across /about, schema, llms.txt
- Founded date (2024) and business model (10% flat fee) stated and repeated
- Pricing page is transparent with clear fee structure
- llms.txt v14.0 is exceptional: cited statistics, market context, founder statement, benchmarks
- FAQ page has 19+ Q&A pairs with substantive answers
- Word counts are adequate: /faq (4011), /services (3471), /about (3484) — all well above thin content threshold

### ❌ Findings

#### [HIGH] No Blog / Article Content on the Site
- **Evidence:** 7 well-written articles exist as RSS feed descriptions only (high-retention editing, AVD vs CTR, gaming thumbnails, etc.) but no `/blog` pages exist. Organic content from search is zero.
- **Impact:** Competitors with blog content capture long-tail queries like "how to increase YouTube AVD", "gaming thumbnail CTR tips", "discord video editing agency" — ExtoArts has content for all these topics but captures none of the traffic.
- **Fix:** Implement `/blog/[slug]` pages (Task #2 is already proposed). The RSS feed descriptions are full-length article summaries that need only expansion to 800-1200 words each.

#### [HIGH] AggregateRating Schema — Review Source Not Specified
- **Evidence:** AggregateRating appears on multiple pages. No `reviewBody`, no link to Trustpilot (which is referenced in constants.ts as `TRUSTPILOT_URL`), no `sameAs` to review platform.
- **Impact:** Unverifiable ratings can trigger Google quality flags. Trustpilot link exists but is not wired into schema.
- **Fix:** Add `"sameAs": "https://www.trustpilot.com/review/extoarts.in"` to Organization schema, and link AggregateRating to `"itemReviewed"` with the org entity

#### [MEDIUM] Portfolio Page Under-describes Work (111-char meta, 1727 words)
- **Evidence:** Portfolio meta description: "Browse ExtoArts creative work: YouTube thumbnails, brand logos, and channel banners designed for real creators." — no niche specificity, no social proof number
- **Opportunity:** "50+ YouTube thumbnails, channel banners, and logos across gaming, lifestyle, and faceless channels — with real CTR results." would target actual search intent better
- **Fix:** Expand portfolio page copy with niche categories, style descriptions, and results context around the 72 portfolio images

#### [MEDIUM] Contact Page Light on Content (1690 words, no service details)
- **Evidence:** Contact page is sparse — primarily CTAs. No content about what happens after contact, turnaround expectations, or typical project scope.
- **Fix:** Add a brief "What to expect" section with 2-3 bullet process items to improve E-E-A-T signals and reduce bounce

---

## 5. Performance

> **Note:** PageSpeed Insights API returned no data during this audit (likely rate-limited). Performance scores are estimated from observable signals.

### ✅ Observed Signals
- Delivered via Vercel edge network; `x-vercel-cache: HIT` observed on first request
- Next.js 16 with Turbopack (fast compilation, optimised output)
- Font preloaded as WOFF2 (`/fonts/plus-jakarta-sans.woff2`) with `Cache-Control: public, max-age=31536000, immutable`
- `compress: true` in next.config.ts (Brotli/gzip enabled)
- Images: `formats: ['image/avif', 'image/webp']` configured in Next.js — automatically serves modern formats
- Page weight is low (113KB HTML on homepage)

### ⚠️ Estimated Concerns
- **Framer Motion + GSAP + Lenis + OGL** all loaded: combined JS payload likely 200-400KB gzipped. Animation-heavy pages may see TBT (Total Blocking Time) issues on mobile.
- **iili.io external image CDN:** No control over image latency or availability. 72 portfolio images all from external CDN = LCP risk on /portfolio
- **`cache-control: public, max-age=0, must-revalidate`** on HTML responses — no browser-side HTML caching; every navigation requires a round-trip to Vercel. This is standard for Next.js but means ISR/SSG should be configured for static pages.

### [MEDIUM] Recommendation
Run PageSpeed Insights manually: `https://pagespeed.web.dev/analysis?url=https://extoarts.in` — target LCP < 2.5s, INP < 200ms, CLS < 0.1 on mobile.

---

## 6. AI Search Readiness (GEO)

### ✅ Excellent Implementation
- **llms.txt:** v14.0, detailed, cited statistics, founder statement, benchmarks, brand disambiguation — one of the most thorough llms.txt files seen for an agency site
- **robots.txt AI section:** Explicit Allow for 12 AI crawlers including GPTBot, ClaudeBot, PerplexityBot, Applebot, Meta-ExternalAgent
- **FAQPage schema:** Despite no SERP rich result, FAQPage is highly citable by AI engines — structured Q&A maps directly to how AI synthesises answers
- **OpenSearch descriptor:** Enables browser search integration — minor but correct signal
- **RSS + JSON Feed:** Machine-readable content feeds — Perplexity and other AI search tools index RSS

### ❌ Findings

#### [MEDIUM] Speakable Schema CSS Selectors May Not Match Rendered DOM
- **Evidence:** Speakable uses `.hero`, `.torn-banner`, `.services-grid`, `.steps-grid` — these are JSX className strings in a React app. Next.js server-renders these, so the selectors should work, but should be verified in production rendered HTML.
- **Fix:** Audit that these CSS classes are present in the server-rendered HTML of the homepage

#### [MEDIUM] No Content Optimised for AI Citation (Passage-Level)
- **Evidence:** llms.txt is excellent but the actual page content lacks "self-contained answer blocks" — 134-167 word passages that directly answer common questions. AI Overview eligibility depends on passage citability.
- **Opportunity:** The FAQ page has good Q&A density. Services and pricing pages should each have 1-2 paragraphs that could be lifted verbatim as an AI answer (e.g., "ExtoArts charges a flat 10% agency fee. If your budget is $500 per video, ExtoArts takes $50...")
- The pricing page description already does this well — replicate pattern on services and about pages

#### [LOW] No Wikipedia / External Authority Entity Signal
- **Evidence:** Brand is relatively new (2024). No Wikipedia page, no Wikidata entry, no notable third-party mentions indexed.
- **Opportunity:** Getting listed on industry directories (Clutch.co, G2, DesignRush) establishes entity authority that AI engines use for brand citation confidence.

---

## 7. Images

### ✅ What Works
- 0 images missing alt text across all pages (strong — especially on /portfolio with 72 images)
- Next.js `<Image>` component enforces alt text via TypeScript types
- AVIF + WebP formats configured — Vercel serves these automatically
- Font preload working correctly

### ❌ Findings

#### [HIGH] All Portfolio and OG Images Hosted on iili.io External CDN
- **Evidence:** OG image, founder photo, and all 72 portfolio images are on `iili.io` — a third-party free image hosting service
- **Risk:** No SLA, no control over availability, no cache headers. If iili.io goes down or rate-limits, all portfolio images and all social preview images disappear simultaneously.
- **Fix:** Migrate images to Vercel Blob, Cloudinary, or your own S3 bucket. `next.config.ts` already has `remotePatterns` for iili.io — this would just be a CDN change.

#### [MEDIUM] Portfolio Images Likely Missing Descriptive Alt Text
- **Evidence:** Technically all `<img>` tags have `alt=` attributes, but with 72 portfolio images auto-populated from a data source, the alt text is likely generic filenames or empty strings rather than descriptive keyword-rich alternatives.
- **Opportunity:** Alt text like "gaming thumbnail design for Minecraft channel with high-contrast orange background" targets long-tail image search queries
- **Fix:** Audit the actual alt text values on /portfolio images and replace generic entries with descriptive copy per image

#### [LOW] No sitemap-images.xml
- **Evidence:** The PHP version has `sitemap-images.php` but the Next.js version has no image sitemap. Google needs an image sitemap to discover images served via JavaScript rendering.
- **Fix:** Add `nextjs/src/app/sitemap-images.xml/route.ts` that generates an image sitemap from portfolio data

---

## 8. Sitemap

| URL | Priority | changeFreq | Status |
|---|---|---|---|
| / | 1.0 | weekly | ✅ |
| /services | 0.9 | monthly | ✅ |
| /pricing | 0.9 | monthly | ✅ |
| /portfolio | 0.8 | weekly | ✅ |
| /about | 0.8 | monthly | ✅ |
| /workflow | 0.7 | monthly | ✅ |
| /faq | 0.8 | monthly | ✅ |
| /estimate | 0.7 | monthly | ⚠️ no canonical |
| /collab | 0.6 | monthly | ✅ |
| /contact | 0.7 | monthly | ✅ |
| /ticket | 0.5 | monthly | ⚠️ review if indexable |
| /apply | 0.5 | monthly | ⚠️ review if indexable |
| /tos | 0.3 | yearly | ✅ |
| /privacy | 0.3 | yearly | ✅ |
| /discord | 0.4 | yearly | ❌ 307 redirect in sitemap |
| /youtube | 0.3 | yearly | ❌ 307 redirect in sitemap |
| /instagram | 0.3 | yearly | ❌ 307 redirect in sitemap |
| /twitter | 0.3 | yearly | ❌ 307 redirect in sitemap |
| /threads | 0.3 | yearly | ❌ 307 redirect in sitemap |
| /facebook | 0.3 | yearly | ❌ 307 redirect in sitemap |

**Issues:**
- 6 social redirect URLs in sitemap are 307 temporaries → remove from sitemap
- `lastmod` is build-time timestamp for all entries → should reflect actual content dates
- `/rss` and `/feed.json` not in sitemap (acceptable — feeds have their own discovery via `<link rel="alternate">`)

---

## 9. Robots.txt Analysis

```
User-Agent: *
Allow: /
Disallow: /hq-portal          ✅ correct
Disallow: /admin               ✅ correct  
Disallow: /dashboard           ✅ correct
Disallow: /login               ✅ correct
Disallow: /register            ✅ correct
Disallow: /logout              ✅ correct
Disallow: /apply               ✅ correct (for * group)
Disallow: /api/                ✅ correct
Disallow: /order/              ✅ correct
Disallow: /chat                ✅ correct
Disallow: /health              ✅ correct
Disallow: /*?*                 ❌ BLOCKS /faq?q= (SearchAction endpoint)
```

**Fix:** Add `Allow: /faq?q=` before `/*?*`, or replace `/*?*` with `Disallow: /*?utm_` to only block tracking parameters.

---
