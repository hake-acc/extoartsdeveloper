# ExtoArts — Prioritised Action Plan
**Generated:** 2026-07-17

---

## Phase 1 — Critical Fixes (This Week)

### P1-1 · Subset `tabler-icons.woff2` from 807 KB → ~40 KB
**Impact:** 🔴 Performance — eliminates 807 KB from every page's critical path  
**Effort:** 2–3 hours  
**Files:** `nextjs/public/fonts/tabler-icons.woff2`, `nextjs/src/app/layout.tsx`

55 icon classes are used site-wide. The full font is ~5,500 icons. Subset to only used glyphs.

Option A — Fonttools CLI:
```bash
pip install fonttools brotli
# Map each ti-* class to its Unicode codepoint from the Tabler CSS
pyftsubset tabler-icons.woff2 --unicodes="U+EA02,..." --flavor=woff2 \
  --output-file=tabler-icons-subset.woff2
```

Option B (easier) — Switch to `@tabler/icons-react` individual SVG imports:
```tsx
import { IconArrowRight } from '@tabler/icons-react'
// Each icon is a tree-shakeable SVG component — zero font file needed
```

---

### P1-2 · Add `FAQPage` JSON-LD to `/faq`
**Impact:** 🔴 SEO — rich result eligibility for 30+ Q&As in Google SERPs  
**Effort:** 30–45 minutes  
**File:** `nextjs/src/app/faq/page.tsx`, `nextjs/src/data/faq.ts`

Read all Q&A items from `FAQ_SECTIONS` and generate a `FAQPage` schema:

```tsx
// In faq/page.tsx
import { FAQ_SECTIONS } from '@/data/faq'
import { JsonLd } from '@/components/JsonLd'

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_SECTIONS.flatMap(section =>
    section.items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    }))
  ),
}
// Add <JsonLd data={faqSchema} /> inside the component
```

---

### P1-3 · Fix `site.webmanifest` — self-host the 512×512 icon
**Impact:** 🔴 Technical — PWA install reliability; external CDN is a single point of failure  
**Effort:** 15 minutes  
**File:** `nextjs/public/site.webmanifest`, `nextjs/public/favicon-512.png` (create)

1. Export a 512×512 PNG version of the logo to `public/favicon-512.png`
2. Update `site.webmanifest`:
```json
{
  "src": "/favicon-512.png",
  "sizes": "512x512",
  "type": "image/png",
  "purpose": "any maskable"
}
```
3. Self-host the PWA screenshot too: save to `public/images/pwa-screenshot.png`

---

### P1-4 · Add `/apply` to sitemap
**Impact:** 🔴 Technical — Google cannot discover /apply organically without a sitemap entry  
**Effort:** 5 minutes  
**Files:** `nextjs/src/lib/constants.ts`, `nextjs/next-sitemap.config.js`

```ts
// In constants.ts SITEMAP_URLS
{ loc: '/apply', changefreq: 'monthly', priority: 0.7 },
```
```js
// In next-sitemap.config.js priorities map
'/apply': 0.7,
```

---

## Phase 2 — High Impact (This Month)

### P2-1 · Add `HowTo` schema to `/workflow`
**Impact:** 🟡 SEO — rich result for step-by-step workflow in SERPs  
**Effort:** 30 minutes  
**File:** `nextjs/src/app/workflow/page.tsx`

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Get Your YouTube Videos Edited by ExtoArts",
  "description": "...",
  "step": [
    { "@type": "HowToStep", "name": "Share Your Brief", "text": "Join Discord..." },
    { "@type": "HowToStep", "name": "Get Matched", "text": "We pair you..." },
    { "@type": "HowToStep", "name": "Review & Refine", "text": "We deliver..." }
  ]
}
```

---

### P2-2 · Add `BreadcrumbList` schema to all content pages
**Impact:** 🟡 SEO — breadcrumb display in SERPs; site hierarchy signals  
**Effort:** 1 hour (add to `buildMetadata()` helper)  
**File:** `nextjs/src/lib/metadata.ts`

Add breadcrumb generation inside the helper so every page gets it automatically.

---

### P2-3 · Convert `review-1.png` → WebP and `founder.jpg` → WebP
**Impact:** 🟡 Performance — saves ~80 KB total  
**Effort:** 10 minutes  

```bash
cwebp -q 82 nextjs/public/images/review-1.png -o nextjs/public/images/review-1.webp
cwebp -q 85 nextjs/public/images/founder.jpg  -o nextjs/public/images/founder.webp
```
Update all component references to the new filenames.

---

### P2-4 · Subset `PaperInko.woff2` (168 KB → ~50 KB)
**Impact:** 🟡 Performance — reduces font payload by ~120 KB  
**Effort:** 30 minutes  

```bash
pyftsubset PaperInko.woff2 \
  --unicodes="U+0020-007F,U+00A0-00FF" \
  --flavor=woff2 \
  --output-file=PaperInko-subset.woff2
```
Add `unicode-range: U+0020-007F, U+00A0-00FF;` to the `@font-face` declaration.

---

### P2-5 · Add noindex to social redirect pages
**Impact:** 🟡 Technical — prevents /facebook, /instagram etc. from appearing in SERPs  
**Effort:** 15 minutes  

In each social redirect `page.tsx`, export:
```ts
export const metadata: Metadata = {
  robots: { index: false, follow: true },
}
```

---

### P2-6 · Add Speculation Rules API
**Impact:** 🟡 Performance — navigation feels instant (hover-triggered prerender)  
**Effort:** 15 minutes  
**File:** `nextjs/src/app/layout.tsx`

```tsx
// Inside <head> in layout.tsx
<script
  type="speculationrules"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      prerender: [{ where: { href_matches: '/*' }, eagerness: 'moderate' }],
    }),
  }}
/>
```

---

### P2-7 · Fix `humans.txt` tech stack
**Impact:** 🟡 Trust — wrong stack info misleads crawlers and security scanners  
**Effort:** 5 minutes  
**File:** `nextjs/public/humans.txt`

Replace:
```
Standards: HTML5, CSS3, PHP 8.2, JSON-LD Schema.org
Components: AOS.js, Font Awesome 6, Plus Jakarta Sans
Software: PHP 8.2, MySQL
```
With:
```
Standards: HTML5, CSS3, JSON-LD Schema.org
Framework: Next.js 16, React 19, Tailwind CSS 4
Components: Framer Motion, Radix UI, Tabler Icons, Plus Jakarta Sans
Hosting: Vercel
```

---

### P2-8 · Add RSS/Feed autodiscovery `<link>` to `<head>`
**Impact:** 🟡 Discovery — browsers and RSS readers surface the feed automatically  
**Effort:** 5 minutes  
**File:** `nextjs/src/app/layout.tsx`

```tsx
// In the root <head> metadata alternates or as a <link> tag
alternates: {
  types: {
    'application/feed+json': `${SITE_URL}/feed.json`,
  },
}
```

---

## Phase 3 — Content & Authority (Month 2)

### P3-1 · Grow review count to 10+ for aggregateRating display
- AggregateRating with `reviewCount: 7` may be suppressed by Google (threshold is ~10).
- Encourage recent clients to leave reviews and update the Organization schema.

### P3-2 · Add individual `Review` schemas
- Add each review as a `review` array item inside the Organization JSON-LD.
- Include `author`, `reviewRating`, `reviewBody`, `datePublished`.

### P3-3 · Publish first 4–6 blog/content articles
- Target: "gaming YouTube thumbnail tips", "how much does YouTube editing cost", "faceless YouTube channel ideas"
- Each targets a high-intent informational query in the creator economy.
- Pair with `Article` schema on each post.

### P3-4 · Add `VideoObject` schemas to portfolio
- If any portfolio entries link to or embed YouTube videos, add `VideoObject` schema.
- Required fields: `name`, `description`, `thumbnailUrl`, `uploadDate`.
- This makes the site eligible for Google Video Search rich results.

### P3-5 · Update `llms.txt` monthly
- Schedule a monthly reminder to update "Last Updated" date and service/pricing information.
- Current file is 1 month stale (June 17, 2026).

---

## Phase 4 — Monitoring & Iteration (Ongoing)

- Set up Google Search Console and submit sitemap
- Monitor Core Web Vitals in CrUX dashboard for field data
- Track FAQ page CTR before/after adding FAQPage schema (expect +20–30%)
- Monitor for new Tabler icon usage when adding components and keep subset updated
- Re-audit every 3 months or after major site changes

---

## Impact Summary

| Action | SEO Impact | Perf Impact | Effort |
|---|---|---|---|
| Subset Tabler icons | — | 🔴 Huge | Medium |
| FAQPage schema | 🔴 Huge | — | Low |
| Self-host manifest icon | 🟡 Medium | — | Low |
| Add /apply to sitemap | 🟡 Medium | — | Low |
| HowTo schema | 🟡 Medium | — | Low |
| BreadcrumbList all pages | 🟡 Medium | — | Medium |
| Convert review-1 + founder to WebP | — | 🟡 Medium | Low |
| Subset PaperInko | — | 🟡 Medium | Low |
| Speculation Rules | — | 🟡 Medium | Low |
| Fix humans.txt | 🟡 Low | — | Low |
| noindex social redirects | 🟡 Low | — | Low |
| RSS autodiscovery | 🟡 Low | — | Low |
