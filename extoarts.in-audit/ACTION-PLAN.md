# ExtoArts SEO Action Plan
**Domain:** extoarts.in | **Audit Date:** July 6, 2026

---

## Phase 1: Critical Fixes — Week 1

These block SERP features, social sharing, or have been broken for years.

### 1.1 Fix homepage og:image (30 min)
- **File:** `nextjs/src/app/layout.tsx`
- **Change:** Add `openGraph.images` to root layout metadata using `DEFAULT_OG_IMAGE` constant
- **Impact:** Every share of `extoarts.in` on Discord, Twitter, Facebook will gain an image preview card

### 1.2 Replace HowTo schema on /workflow (1 hr)
- **File:** `nextjs/src/app/workflow/` (schema component or page metadata)
- **Change:** Replace `"@type": "HowTo"` with `"@type": "ItemList"` preserving all 8 steps
- **Why now:** HowTo schema was deprecated September 2023 — nearly 3 years of dead markup

### 1.3 Fix robots.txt SearchAction conflict (15 min)
- **File:** `nextjs/src/app/robots.ts`
- **Change:** Add `{ userAgent: '*', allow: '/faq?q=' }` entry before the `/*?*` disallow, or replace `/*?*` with `/*?utm_*`
- **Impact:** Unblocks the site's own SearchAction schema and OpenSearch descriptor

### 1.4 Add canonical to /estimate (20 min)
- **File:** `nextjs/src/app/estimate/` page component
- **Change:** Add `generateMetadata()` with canonical, unique title, and unique meta description
- **Example title:** "YouTube Editing Cost Estimator | Get an Instant Quote | ExtoArts"

### 1.5 Fix duplicate brand name in /services and /portfolio titles (20 min)
- **Files:** `nextjs/src/app/services/` and `nextjs/src/app/portfolio/`
- **Change:**
  - Services: "YouTube Video Editing Services — Thumbnails & Shorts | ExtoArts" (58 chars)
  - Portfolio: "Portfolio — YouTube Thumbnails, Logos & Channel Banners | ExtoArts" (66 chars, trim if needed)

---

## Phase 2: High-Impact Improvements — Weeks 2–3

### 2.1 Fix social redirect status codes (30 min)
- **File:** `nextjs/next.config.ts`
- **Change:** Change `/discord`, `/youtube`, `/instagram`, `/twitter`, `/threads`, `/facebook` redirects from `permanent: false` (or missing flag) to `permanent: true` — this emits 308 instead of 307

### 2.2 Remove social redirect pages from sitemap (20 min)
- **File:** `nextjs/src/app/sitemap.ts`
- **Change:** Remove the 6 social redirect entries (`/discord`, `/youtube`, `/instagram`, `/twitter`, `/threads`, `/facebook`) from the routes array

### 2.3 Fix www → non-www canonicalization (varies)
- **Where:** Vercel project settings or DNS provider
- **Change:** Add a redirect rule in Vercel (vercel.json or dashboard) to redirect `www.extoarts.in` → `extoarts.in`

### 2.4 Implement hreflang for English locale variants (2 hrs)
- **File:** `nextjs/src/lib/metadata.ts` or `generateMetadata()` per page
- **Change:** Add `alternates.languages` using the `HREFLANG_LOCALES` array from constants.ts
- **Pattern:** All locales point to the same URL (self-referencing hreflang for single-language multi-region)
- **Example:**
  ```ts
  alternates: {
    languages: {
      'en': 'https://extoarts.in/',
      'en-US': 'https://extoarts.in/',
      'en-IN': 'https://extoarts.in/',
      // ... all 13 locales
      'x-default': 'https://extoarts.in/',
    }
  }
  ```

### 2.5 Fix og:title, og:type, og:locale on homepage (30 min)
- **File:** `nextjs/src/app/layout.tsx` or homepage metadata
- **Change:** Set `og:type: "website"`, `og:locale: "en_US"`, align `og:title` with page title, add `og:image:width/height`

### 2.6 Add AggregateRating Trustpilot reference to Organization schema (1 hr)
- **Change:** Add `"sameAs": "https://www.trustpilot.com/review/extoarts.in"` and wire `itemReviewed` on AggregateRating

### 2.7 Fix lastmod in sitemap to use real dates (1 hr)
- **File:** `nextjs/src/app/sitemap.ts`
- **Change:** Create a `sitemap-dates.ts` config mapping each route to its last meaningful content change date; reference in sitemap.ts

---

## Phase 3: Content & Authority — Month 2

### 3.1 Build /blog/[slug] pages (Task #2 — already proposed)
- 7 articles are already written as RSS descriptions — expand each to 800–1200 words
- Add Article schema (not FAQPage) with `datePublished`, `author`, `image`
- Estimated organic traffic unlock: "youtube video editing tips", "gaming thumbnail ctr", "avd vs ctr youtube" — all 1K-10K monthly searches

### 3.2 Add Service schema to /services page
- 4 services × `"@type": "Service"` with `serviceType`, `provider`, `areaServed`, `offers`

### 3.3 Replace HowTo with ItemList + BreadcrumbList sitewide
- Add BreadcrumbList to all inner pages (Home > Services, Home > Pricing, etc.)

### 3.4 Add VideoObject schema to portfolio
- For any embedded or linked YouTube videos on /portfolio, add VideoObject schema
- This enables video rich results in Google Image/Video search

### 3.5 Migrate images from iili.io to controlled CDN
- Move OG image, founder photo, and portfolio images to Vercel Blob or Cloudflare R2
- Update `remotePatterns` in next.config.ts

### 3.6 Improve portfolio page copy
- Current meta: 111 chars, generic
- Target: "50+ YouTube thumbnails, gaming channel banners, and brand logos — real CTR results from real creators." (98 chars)
- Add niche-specific copy sections around the image grid

---

## Phase 4: Monitoring & Iteration — Ongoing

### 4.1 Set up Google Search Console
- Verify `extoarts.in` and `www.extoarts.in` (verify both, set non-www as primary)
- Submit sitemap.xml
- Use URL Inspection to confirm /estimate, /workflow, /portfolio indexation

### 4.2 Run PageSpeed Insights monthly
- Target: LCP < 2.5s, INP < 200ms, CLS < 0.1 on mobile
- Watch JS payload from Framer Motion + GSAP bundle

### 4.3 SEO drift baseline
- After Phase 1 fixes are deployed, run `/seo drift baseline https://extoarts.in` to snapshot current state
- Run `/seo drift compare https://extoarts.in` after each deployment

### 4.4 Content calendar
- Publish 1 blog article per month using existing RSS feed descriptions as seeds
- Target: "YouTube video editing agency [city]" variants for local/regional SEO
- Use `/seo content-brief <topic>` before writing each article

### 4.5 Build external authority
- Submit to Clutch.co, G2, DesignRush — these create indexed third-party citations
- Request Trustpilot reviews from existing clients → feeds AggregateRating schema

---

## Priority Summary

| # | Fix | Effort | Impact |
|---|---|---|---|
| 1 | Homepage og:image | 30 min | 🔴 Critical |
| 2 | HowTo → ItemList on /workflow | 1 hr | 🔴 Critical |
| 3 | robots.txt SearchAction conflict | 15 min | 🔴 Critical |
| 4 | /estimate canonical + unique title | 20 min | 🔴 Critical |
| 5 | /services + /portfolio title dedup | 20 min | 🔴 Critical |
| 6 | Social redirect 307 → 308 | 30 min | 🟠 High |
| 7 | Remove social redirects from sitemap | 20 min | 🟠 High |
| 8 | www → non-www redirect | 30 min | 🟠 High |
| 9 | Hreflang for 13 English locales | 2 hrs | 🟠 High |
| 10 | og:type, og:locale, og:image dims | 30 min | 🟠 High |
| 11 | Blog pages (/blog/[slug]) | 4–8 hrs | 🟠 High |
| 12 | Service schema on /services | 1 hr | 🟡 Medium |
| 13 | BreadcrumbList sitewide | 1 hr | 🟡 Medium |
| 14 | VideoObject on portfolio | 1 hr | 🟡 Medium |
| 15 | Migrate images from iili.io | 2 hrs | 🟡 Medium |
| 16 | lastmod real dates in sitemap | 1 hr | 🟡 Medium |
| 17 | CSP header | 2 hrs | 🟡 Medium |
