# ExtoArts — SEO Action Plan
**Site:** https://extoarts.in  
**Generated:** 2026-07-16  
**Overall Score:** 40/100 — Poor  

---

## Priority Definitions

- 🔴 **Critical** — Fix immediately. Blocks indexing signals or creates penalty risk.
- 🟠 **High** — Fix within 1 week. Significant ranking or trust impact.
- ⚠️ **Medium** — Fix within 1 month. Meaningful optimization with moderate effort.
- ℹ️ **Low** — Backlog. Nice-to-have improvements.

---

## Immediate Blockers (Fix This Week)

### 🔴 1. Fix the schema rendering bug — highest impact single fix
**Root cause:** JSON-LD script blocks are being injected inside a component that renders multiple times, producing ~160 duplicate schema objects across 3 script tags. This also bloats the HTML to 504KB.  
**Where to look:** Search the Next.js codebase for `application/ld+json` or `JSON.stringify` inside components. If schema is in a shared section/layout component that renders per-section, move it to the root `layout.tsx` (or `_app.tsx`) so it renders exactly once.  
**Expected result:** HTML drops from 504KB to ~50–80KB. Schema duplication resolved. Page parse time improves.

```bash
# Find the schema injection point
grep -r 'application/ld+json' nextjs/src/ --include="*.tsx" --include="*.ts" -l
grep -r 'FAQPage' nextjs/src/ --include="*.tsx" --include="*.ts" -l
```

---

### 🔴 2. Remove FAQPage schema — penalty risk
**Why:** FAQPage is restricted to government and healthcare authority sites since August 2023. ExtoArts is a commercial agency. There are no rich results from this schema — only potential manual review risk.  
**Fix:** Delete all FAQPage JSON-LD blocks. The FAQ content page (/faq) should use `WebPage` schema only. If you want to signal FAQ content for AI systems, use plain heading + paragraph structure (no schema needed).  
**Do NOT replace with HowTo** (deprecated September 2023).

After fixing items 1 and 2, re-run:
```bash
python3 .agents/agentic-seo-skill/scripts/validate_schema.py /tmp/page.html
```

---

### 🔴 3. Fix the Trustpilot broken link — destroys trust claim
**Why:** The homepage hero states "Verified 5-Star Track Record" and links to Trustpilot — but the link returns 403. This makes the trust claim unverifiable.  
**Fix:** Go to Trustpilot, find the correct profile URL for extoarts.in, and update the link. If the profile does not exist, remove the Trustpilot claim and badge entirely.

---

### 🔴 4. Expand /faq page content — most damaging thin content
**Current:** 246 words. **Minimum for FAQ type:** 800 words.  
**Fix:** Add 15–20 additional Q&A pairs covering:
- Pricing questions (how is 10% calculated, payment methods, invoicing)
- Editor matching process (how do you match creators to editors)
- Revision policy (how many revisions, turnaround time)
- Contract and cancellation questions
- Niche-specific questions (gaming, vlogs, Shorts, thumbnails)

Target 900–1200 words. Structure each Q as an H2, answer in the first 40–55 words (Featured Snippet formatting), expand with 2–4 supporting sentences.

---

## High Priority (This Week)

### 🟠 5. Fix remaining broken links
| Link | Fix |
|---|---|
| Instagram (`?igsh=...`) | Replace with `https://www.instagram.com/extoarts` (no tracking params) |
| LinkedIn `/in/exto-arts-924272421` | Verify slug exists; update to correct URL |
| YTJobs profile | Verify the profile is public; update or remove |
| Twitter intent URL (403) | Replace with `https://x.com/extoarts` profile link or remove share button |

---

### 🟠 6. Remove useless hreflang tags
**Current:** 14 hreflang tags all pointing to the same URL `https://extoarts.in`. This provides zero regional signal and wastes 800+ bytes per page.  
**Fix:** Remove all `<link rel="alternate" hreflang="...">` tags from the `<head>`. If genuine regional pages exist in the future, re-add with distinct URLs.

**In `layout.tsx` or wherever alternates are set:**
```tsx
// Remove this entire block or the next-seo alternateLinks config
```

---

### 🟠 7. Remove non-content URLs from sitemap
**Current:** sitemap-0.xml includes `.well-known/api-catalog`, `.well-known/mcp/server-card.json`, `.well-known/oauth-*`, `robots.txt`, `opensearch.xml`.  
**Fix:** In `next-sitemap.config.js`, add:
```js
exclude: [
  '/.well-known/*',
  '/robots.txt',
  '/opensearch.xml',
  '/sitemap*.xml',
],
```

---

### 🟠 8. Fix H1 word spacing (animation spans)
**Current:** H1 renders as "WhereYou AreValued." in parsed text.  
**Fix:** Ensure each animated `<span>` has a trailing space or that adjacent spans have spaces between them:
```tsx
// Option A: space in span content
<span>Where </span><span>You Are </span><span>Valued.</span>

// Option B: CSS word-spacing or margin
// Option C: aria-label on H1 for crawlers
<h1 aria-label="Where You Are Valued.">...</h1>
```

---

### 🟠 9. Expand /ticket (96 words → 300+)
The support ticket page is indexed but near-empty. Either:
- Add a proper description of what a support ticket is for, what to expect, and response times (300–400 words), OR
- Add `<meta name="robots" content="noindex">` if this is a pure form page not meant for search.

---

## Medium Priority (This Month)

### ⚠️ 10. Add contextual internal links
**Current:** 0 in-body links. All 210 internal links are navigation anchors repeated 15×.  
**Target:** 3–5 contextual links per page.

Suggested additions:
- Homepage → /services (from "YouTube Video Editing" section)
- Homepage → /pricing (from pricing teaser)
- /about → /services and /workflow
- /faq → /pricing (from pricing questions)
- /workflow → /services
- /collab → /services and /pricing
- /services → /portfolio (from each service card)

Use descriptive anchor text: "our video editing services", "see pricing plans", "view portfolio samples".

---

### ⚠️ 11. Add Service and Offer schema to /services and /pricing
Add specific schema to unlock rich results for service and pricing pages:

**On /services:**
```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "YouTube Video Editing",
  "provider": { "@id": "https://extoarts.in/#organization" },
  "description": "High-retention YouTube video editing by niche-matched specialists.",
  "areaServed": "Worldwide",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "USD",
    "description": "Flat 10% agency fee on editor rate"
  }
}
```

**On /pricing:**
Add `Offer` schema with price ranges per tier.

---

### ⚠️ 12. Add BreadcrumbList schema to all inner pages
Breadcrumbs help Google understand site structure and display sitelinks in search results.

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://extoarts.in" },
    { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://extoarts.in/services" }
  ]
}
```

---

### ⚠️ 13. Add SearchAction to WebSite schema (Sitelinks Searchbox)
Add to the single, deduplicated WebSite schema block:
```json
{
  "@type": "WebSite",
  "url": "https://extoarts.in/",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://extoarts.in/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```
Only add this if the site has a functional internal search.

---

### ⚠️ 14. Expand /collab, /estimate, /apply pages
| Page | Current | Target | Action |
|---|---|---|---|
| /collab | 259w | 400w+ | Add editor partnership benefits, selection criteria, application process overview |
| /estimate | 208w | 400w+ | Explain what goes into an estimate, turnaround for quotes, what information to prepare |
| /apply | 172w | 400w+ | Expand editor qualification requirements, application steps, what to expect |

---

### ⚠️ 15. Add links to llms.txt
**Current:** 23 sections but no page links — AI assistants cannot navigate to key pages from the file.  
**Fix:** Add a links section:
```
## Key Pages
- [YouTube Video Editing Services](https://extoarts.in/services): Full list of editing services and specialities
- [Pricing & Rates](https://extoarts.in/pricing): Flat-fee pricing structure and editor rates
- [Portfolio](https://extoarts.in/portfolio): Sample work across gaming, vlog, Shorts, and thumbnail categories
- [About ExtoArts](https://extoarts.in/about): Agency background, founder, and team
- [FAQ](https://extoarts.in/faq): Common questions about process, pricing, and delivery
- [Get a Quote](https://extoarts.in/estimate): Request a project estimate
```

---

### ⚠️ 16. Migrate critical images off iili.io CDN
**Current:** OG image (`BZ0qLb4.png`) and all reviewer avatar images hosted on iili.io.  
**Risk:** Service outage or rate-limiting on iili.io breaks social previews on every share.  
**Fix:** Copy images to `/public/images/` in the Next.js project and update `og:image` and `<Image src>` props. Deploy to Vercel — images will be served from Vercel's CDN.

---

### ⚠️ 17. Add speakable schema to homepage key passages
Marks content for Google Assistant and AI citation:
```json
{
  "@type": "WebPage",
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": [".hero-description", ".agency-pitch", ".value-proposition"]
  }
}
```
Add CSS classes to the 1–2 most citable paragraphs on the homepage and FAQ page.

---

## Low Priority / Backlog

### ℹ️ 18. Add ProfilePage schema to /about (E-E-A-T signal)
```json
{
  "@type": "ProfilePage",
  "mainEntity": {
    "@type": "Person",
    "name": "Rehan",
    "jobTitle": "Founder & Creative Director",
    "worksFor": { "@id": "https://extoarts.in/#organization" },
    "sameAs": ["https://x.com/extoarts", "https://www.instagram.com/extoarts"]
  }
}
```

### ℹ️ 19. Explicitly declare FacebookBot in robots.txt
Currently inherits `*` rules. Add explicit entry to be deliberate about Facebook crawler access.

### ℹ️ 20. Get a PageSpeed API key
```bash
# Add to .agents/agentic-seo-skill/.env
PAGESPEED_API_KEY=your_key_here
# Free key from: https://console.cloud.google.com → PageSpeed Insights API
```
Re-run `pagespeed.py` to get confirmed CWV field data.

### ℹ️ 21. Build review volume on Trustpilot
Only 7 reviews weakens E-E-A-T Authoritativeness. After fixing the Trustpilot link, actively request reviews from completed clients. Target 25+ reviews to strengthen the trust claim.

### ℹ️ 22. Remove `changefreq` and `priority` from sitemap
Google ignores both fields. Removing them reduces sitemap file size with no downside.

---

## Expected Impact After Fixes

| Fix Group | Score Impact | Effort |
|---|---|---|
| Schema bug + FAQPage removal (items 1–2) | +12–15 pts | Low — 1–2 file edits |
| Broken links (items 3, 5) | +3–5 pts | Low — URL updates |
| /faq content expansion (item 4) | +5–8 pts | Medium — writing |
| Hreflang removal (item 6) | +2 pts | Low — config change |
| Sitemap cleanup (item 7) | +2 pts | Low — config change |
| Contextual internal links (item 10) | +4–6 pts | Medium — 5–8 edits |
| Service/Offer schema (item 11) | +3–5 pts | Low — JSON-LD addition |
| Thin page expansion (items 9, 14) | +4–6 pts | High — writing |
| **Total estimated gain** | **+35–45 pts** | |

**Projected score after all Critical + High fixes: 55–65/100 (Needs Improvement → Good)**  
**Projected score after all fixes: 75–80/100 (Good)**
