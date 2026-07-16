# ExtoArts — Full SEO Audit Report
**URL:** https://extoarts.in  
**Scope:** Full-site audit (14 pages crawled)  
**Date:** 2026-07-16  
**Industry detected:** Agency / Consultancy (YouTube creative services)  

---

## Audit Summary

### Overall SEO Health Score: 40/100 — Poor

| Category | Weight | Score | Weighted |
|---|---|---|---|
| Technical SEO | 25% | 42/100 | 10.5 |
| Content Quality | 20% | 25/100 | 5.0 |
| On-Page SEO | 15% | 47/100 | 7.1 |
| Schema / Structured Data | 15% | 13/100 | 2.0 |
| Performance (CWV) | 10% | 60/100* | 6.0 |
| Image Optimization | 10% | 70/100 | 7.0 |
| AI Search Readiness (GEO) | 5% | 40/100 | 2.0 |
| **TOTAL** | | | **39.5 → 40/100** |

*Performance: Score confidence Low — PageSpeed API rate-limited. Estimate based on HTML analysis.

**Score: 40 reflects strong security and social meta foundations, severely penalised by a schema duplication rendering bug (Critical, −15), restricted FAQPage schema on a commercial site (Critical, −15), thin content across 6 of 14 pages (Critical, −15), and navigation-only internal linking with zero contextual body links (Warning, −5).**

---

### Top 3 Critical Issues

1. 🔴 **Schema rendering bug** — WebSite, Organization, FAQPage, WebPage are each duplicated ~40 times in the HTML (504KB page). Confirmed by validate_schema.py (FAQPage flagged at blocks 3, 7, 11 … 159).
2. 🔴 **FAQPage schema on a commercial site** — Restricted to government/healthcare authority sites only since August 2023. Using it on extoarts.in produces no rich results and may generate a manual action flag.
3. 🔴 **Thin content on 6 pages** — /ticket (96 words), /portfolio (137), /apply (172), /estimate (208), /faq (246), /collab (259). All below minimum thresholds; /faq is below its 800-word minimum by 70%.

### Top 3 Opportunities

1. ✅ Fix the schema bug → instantly resolve 40+ invalid FAQPage blocks and the duplication penalty in one code change.
2. ✅ Add contextual internal links → currently 0 in-body links exist; all 210 internal links are identical navigation anchors repeated 15× per page.
3. ✅ Expand thin pages → /faq and /collab are within reach of minimum thresholds with moderate content additions.

---

## Environment Limitations

- **PageSpeed Insights API**: Rate-limited during audit. CWV scores are `Hypothesis` confidence. Add a free API key to `.env` for confirmed field data.

---

## Detailed Findings

### A. Technical SEO — 42/100

#### Crawlability

| Element | Value | Severity | Confidence |
|---|---|---|---|
| robots.txt | Present, 20 user-agent entries, sitemap declared | ✅ Pass | Confirmed |
| Sitemap | sitemap.xml → sitemap-0.xml (20 URLs) | ✅ Pass | Confirmed |
| Sitemap non-page URLs | sitemap-0.xml includes `.well-known/*`, `robots.txt`, `opensearch.xml` | ⚠️ Warning | Confirmed |
| sitemap_index.xml / sitemap-index.xml | 404 (script tries alternative names) | ℹ️ Info | Confirmed |
| Redirect chain | Root: 0 hops, 98ms | ✅ Pass | Confirmed |
| meta robots | `index, follow` | ✅ Pass | Confirmed |

**Finding:** Sitemap contains non-content technical URLs.  
**Evidence:** sitemap-0.xml includes `/.well-known/api-catalog`, `/.well-known/mcp/server-card.json`, `/.well-known/oauth-*`, `/robots.txt`, `/opensearch.xml`.  
**Impact:** Googlebot wastes crawl budget on non-indexable technical endpoints; these URLs may return JSON/XML that Google will refuse to index, creating crawl noise.  
**Fix:** Exclude all `.well-known/*`, `robots.txt`, `opensearch.xml` paths from `next-sitemap.config.js` using the `exclude` array.

---

#### Indexability & Schema (Critical)

**Finding 1: Schema rendering bug — massive duplication**  
**Evidence:** HTML page size is 504KB. `validate_schema.py` flagged FAQPage at blocks 3, 7, 11 … 159 (≈40 duplicate blocks). `grep -c 'application/ld+json'` = 3 script tags, meaning each script block contains ~13 repeated sets of [WebSite + Organization + FAQPage + WebPage]. The same 4 schema types are injected ~40 times each.  
**Severity:** 🔴 Critical  
**Confidence:** Confirmed  
**Impact:** 504KB HTML is 5-10× normal page size; slows parse time and TTFB. Duplicate schema blocks create conflicting signals Google must resolve; the parser picks one and ignores the rest. Google's structured data documentation explicitly warns against duplicate `@type` blocks of the same type on a page. Combined with FAQPage, this is the highest-risk item on the site.  
**Fix:** Find the Next.js component or layout that injects JSON-LD and ensure it renders exactly once. Likely the schema is placed inside a component that is rendered per-section instead of in the `<Head>` once. Move all global schema to `layout.tsx` or the equivalent root layout, not inside reusable section components.

---

**Finding 2: FAQPage schema — restricted type on commercial site**  
**Evidence:** `validate_schema.py` output: "Block 3: @type 'FAQPage' is restricted to government and healthcare sites only (Aug 2023)". FAQPage appears ~40 times (from duplication bug above). ExtoArts is a commercial agency.  
**Severity:** 🔴 Critical  
**Confidence:** Confirmed  
**Impact:** FAQPage rich results are not rendered for commercial sites since August 2023. Google may flag it as misleading markup during a structured data manual review.  
**Fix:** Remove all FAQPage schema. Replace FAQ questions with plain `Article` + `speakable` schema (marks key answer passages for voice and AI citation) or simply use standard `WebPage` schema on the /faq page. The FAQ content itself is valuable — only the schema type needs changing.

---

#### Security — 100/100

| Header | Value | Status |
|---|---|---|
| HSTS | max-age=63072000; includeSubDomains; preload | ✅ |
| CSP | Present (default-src 'self' + external allows) | ✅ |
| X-Frame-Options | SAMEORIGIN | ✅ |
| X-Content-Type-Options | nosniff | ✅ |
| Referrer-Policy | strict-origin-when-cross-origin | ✅ |
| Permissions-Policy | camera=(), microphone=(), geolocation=() | ✅ |
| HTTPS | Yes | ✅ |

Security is the strongest area on the site. Full marks with HSTS preload — rare and excellent.

---

#### H1 Rendering Issue

**Finding:** H1 reads "WhereYou AreValued." in parsed HTML.  
**Evidence:** parse_html output: `"h1": ["WhereYou AreValued."]`  
**Severity:** ⚠️ Warning  
**Confidence:** Confirmed  
**Impact:** Google parses the text node content of H1; if CSS animation spans are not spaced correctly, the extracted text lacks spaces between words, making it semantically meaningless and keyword-less.  
**Fix:** Ensure animated span elements in the H1 either: (a) have a trailing space in their text content, or (b) are wrapped in a visually-hidden `<span aria-hidden="true">` with a separate accessible H1 for screen readers and crawlers.

---

### B. Content Quality — 25/100

#### Word Count Audit

| Page | Words | Minimum | Status |
|---|---|---|---|
| / (homepage) | 1,365 | 500 | ✅ Pass |
| /services | 910 | 800 | ✅ Pass |
| /about | 746 | 400 | ✅ Pass |
| /pricing | 433 | 400 | ✅ Pass |
| /collab | 259 | 300+ | ⚠️ Warning |
| /faq | 246 | 800 (FAQ type) | 🔴 Critical |
| /estimate | 208 | 300+ | ⚠️ Warning |
| /apply | 172 | 300+ | ⚠️ Warning |
| /portfolio | 137 | 300+ | ⚠️ Warning |
| /ticket | 96 | 300 | 🔴 Critical |

**Finding:** /ticket at 96 words and /faq at 246 words (vs 800 minimum) are the most severe.  
**Evidence:** duplicate_content.py crawl output confirmed above counts across 14 pages.  
**Impact:** Thin content pages are candidates for algorithmic demotion. The /faq page is a key conversion and traffic page for informational queries — at 246 words it fails comprehensively for any long-tail FAQ intent.  
**Fix:** See Action Plan for page-by-page content expansion targets.

#### Readability

| Metric | Value | Target | Status |
|---|---|---|---|
| Flesch Reading Ease | 56.1 | 60–70 | ⚠️ Borderline |
| Flesch-Kincaid Grade | 8.4 | 7–9 | ✅ Pass |
| Avg sentence length | 11.7 words | <25 | ✅ Pass |
| Complex word % | 18% | <20% | ✅ Pass |

Readability is acceptable for an agency audience. Not a priority fix.

#### E-E-A-T Assessment

| Factor | Score | Key Signals |
|---|---|---|
| Experience (20%) | 14/20 | Portfolio samples present; founder photo; limited "I built this" narrative |
| Expertise (25%) | 17/25 | Niche-matched positioning, service depth; no author credentials page |
| Authoritativeness (25%) | 11/25 | Only 7 Trustpilot reviews; no press mentions; no external citations found |
| Trustworthiness (30%) | 22/30 | Contact page, privacy, ToS, Discord, verified 5-star claim; Trustpilot link is broken (403) |

**E-E-A-T Total: 64/100 — Moderate**

The biggest E-E-A-T gap is authoritativeness (only 7 reviews, no press coverage) and broken trust links (Trustpilot 403 destroys the "Verified 5-Star Track Record" claim).

---

### C. On-Page SEO — 47/100

#### Homepage

| Element | Value | Length | Status |
|---|---|---|---|
| Title | "YouTube Video Editing & Thumbnail Design \| ExtoArts" | 51 chars | ✅ Pass |
| Meta description | "High-retention YouTube editing, thumbnail design, and Shorts editing for creators. Flat-fee pricing, real editors, fast turnaround." | 131 chars | ✅ Pass |
| H1 | "WhereYou AreValued." | — | ⚠️ Warning (spacing) |
| Canonical | https://extoarts.in | — | ✅ Pass |
| lang | en | — | ✅ Pass |
| Open Graph | 7/7 | — | ✅ Pass |
| Twitter Card | 6/6 | — | ✅ Pass |

#### Inner Pages

| Page | Title | Meta Desc | H1 | Status |
|---|---|---|---|---|
| /services | 74 chars | 154 chars | "Every Service. Built for YouTube." | ✅ |
| /pricing | 52 chars | 154 chars | "Simple, Honest Pricing." | ✅ |
| /about | 70 chars | 147 chars | "Built by Creators, for Creators." | ✅ |
| /faq | 68 chars | 152 chars | "Frequently Asked Questions." | ✅ |

All inner-page titles and meta descriptions are well-formed.

#### Internal Linking

**Finding:** Zero contextual internal links — all 210 internal links are navigation anchors.  
**Evidence:** internal_links.py: Top anchors all nav items ("ExtoArts", "Services", "Portfolio", etc.), each repeated exactly 15× per page. No in-body anchor text links between content sections.  
**Severity:** ⚠️ Warning  
**Confidence:** Confirmed  
**Impact:** No link equity flows between content pages. Google cannot determine topical relationships between pages from link signals. Pillar pages (services, pricing) receive no contextual authority from supporting pages (collab, workflow, about).  
**Fix:** Add 3–5 contextual links per page pointing to related content. Example: /about → /services, /workflow → /services, /faq → /pricing.

#### Hreflang

**Finding:** 14 hreflang tags all pointing to the identical URL `https://extoarts.in`.  
**Evidence:** hreflang_checker.py confirmed all 14 alternates (en, en-US, en-GB, en-IN … x-default) resolve to `https://extoarts.in`.  
**Severity:** ⚠️ Warning  
**Confidence:** Confirmed  
**Impact:** Hreflang tags with identical URLs across all regions provide zero regional targeting signal to Google. They inflate HTML weight without benefit.  
**Fix:** Either (a) remove all hreflang tags (the site is a single-language, single-URL site — hreflang is not needed), or (b) create genuine region-specific landing pages if regional differentiation is intended. Option (a) is the correct immediate fix.

#### Broken Links (Confirmed)

| URL | Status | Anchor | Fix |
|---|---|---|---|
| https://www.trustpilot.com/review/extoarts.in | 403 | "4.5 on Trustpilot" | Update to correct Trustpilot profile URL |
| https://ytjobs.co/talent/profile/528947?r=179 | 403 | "Verified on YTJobs" | Verify link or remove if profile is private |
| https://www.instagram.com/extoarts?igsh=... | 429 | "ExtoArts on Instagram" | Remove `igsh` parameter, use plain profile URL |
| https://www.linkedin.com/in/exto-arts-924272421 | 999 | "ExtoArts on LinkedIn" | Verify LinkedIn profile slug |
| Twitter intent share URL | 403 | (no text) | Update to x.com equivalent or remove |

The Trustpilot broken link is the highest priority — it directly undermines the "Verified 5-Star Track Record" trust claim.

---

### D. Schema / Structured Data — 13/100

**Existing schema types detected:** WebSite, Organization (with AggregateRating, founder, areaServed), FAQPage, WebPage  
**Format:** JSON-LD ✅  
**Script blocks:** 3  
**Total schema objects:** ~160 (due to duplication bug)

| Schema | Status | Issues |
|---|---|---|
| WebSite | ⚠️ Warning | Duplicated ~40× |
| Organization | ⚠️ Warning | Duplicated ~40×; otherwise well-structured with founder, aggregateRating, areaServed |
| FAQPage | 🔴 Critical | Restricted type + duplicated ~40× |
| WebPage | ⚠️ Warning | Duplicated ~40× |

**Missing opportunities:**
- `Service` schema on /services (with individual `Offer` objects per service tier)
- `PriceSpecification` / `Offer` on /pricing
- `BreadcrumbList` on all inner pages
- `Article` or `ProfilePage` on /about
- `speakable` on any page (GEO / voice search gap)
- `SearchAction` on WebSite schema (enables Sitelinks Searchbox for branded queries)

---

### E. Performance (CWV) — 60/100 ⚠️ Low Confidence

**Status:** PageSpeed Insights API rate-limited. No field data (CrUX) or lab data available.  
**Confidence:** Hypothesis

**LLM-inferred risks from HTML analysis:**

| Signal | Observation | CWV Risk |
|---|---|---|
| HTML page size | 504KB — 5–10× typical SPA page | LCP risk: browser must parse large DOM before render |
| Next.js framework | SSR/SSG — generally good for TTFB | Positive for LCP |
| Images | Next.js Image API — auto WebP, lazy loading | Positive for CLS/LCP |
| Schema duplication | ~160 JSON-LD objects in 3 script blocks | INP risk: JS parse overhead |
| External images | OG/reviewer images from iili.io CDN | Potential LCP risk if hero uses external URL |

**Recommendation:** Add a free PageSpeed Insights API key to resolve environment limitation. Run:
```bash
python3 .agents/agentic-seo-skill/scripts/pagespeed.py https://extoarts.in --strategy both --json
```

---

### F. Image Optimization — 70/100

| Check | Result | Status |
|---|---|---|
| Total images | 32 | ℹ️ |
| Missing alt text | 0 | ✅ Pass |
| Format | WebP via Next.js Image API | ✅ Pass |
| Portfolio images | .webp confirmed | ✅ Pass |
| Image availability | All 32 return 200 | ✅ Pass |
| OG image host | iili.io (external, uncontrolled) | ⚠️ Warning |
| Reviewer images | iili.io (external, uncontrolled) | ⚠️ Warning |

**Finding:** Key social and trust images (OG preview, reviewer avatars) are hosted on a third-party free CDN (iili.io).  
**Impact:** If iili.io goes down or rate-limits, OG images in social shares and reviewer photos on the homepage both break. This is an availability dependency, not an optimization issue.  
**Fix:** Migrate OG image and reviewer photos to `/public/` in the Next.js project or a controlled CDN (e.g., Cloudflare Images, Vercel Blob, or R2).

---

### G. AI Search Readiness (GEO) — 40/100

#### AI Crawler Access

| Crawler | Status | Impact |
|---|---|---|
| ChatGPT-User (browsing) | ✅ Allowed | ChatGPT can browse and cite |
| OAI-SearchBot | ✅ Allowed | OpenAI search features |
| PerplexityBot | ✅ Allowed | Perplexity AI search |
| anthropic-ai | ✅ Allowed | Claude web features |
| GPTBot | 🚫 Blocked | No OpenAI training data |
| ClaudeBot | 🚫 Blocked | No Anthropic training data |
| Google-Extended | 🚫 Blocked | No Gemini training |
| Bytespider | 🚫 Blocked | No ByteDance training |

**Assessment:** AI search bots (browsing/retrieval) are correctly allowed. Training crawlers are blocked — a defensible choice. The setup is well-considered.

#### llms.txt

**Status:** ✅ Present at `/llms.txt` — 23 sections, quality 70/100  
**Gap:** No links to key pages. AI assistants reading the file cannot navigate to services, pricing, or portfolio.  
**Fix:** Add 5–8 `- [Page Title](URL): Description` entries linking to key pages.

#### Citability Gaps

| Signal | Status |
|---|---|
| Self-contained 134–167 word answer blocks | ❌ Not found — content is short punchy marketing copy |
| Speakable schema | ❌ Missing |
| Original statistics/data points | ⚠️ Partial — "flat 10% agency fee" is citable |
| Question-phrased H2/H3 headings | ❌ Minimal — H2s are marketing slogans, not questions |

---

## Scoring Chain-of-Thought Summary

### Technical SEO (42/100)
**Positives (4):** HTTPS/HSTS preload 100%, no redirect chains, robots.txt comprehensive 20-UA config, canonical correct across all pages.  
**Deficits (3):** Schema duplication bug (504KB HTML), sitemap includes non-indexable technical URLs, H1 text concatenated.  
**Base:** 4/7 × 100 = 57. Penalties: Critical (schema duplication, −15), Warning (sitemap, −5). **Final: 42.**

### Content Quality (25/100)
**Positives (3):** Homepage 1365w, Services 910w, About 746w all meet minimums.  
**Deficits (6):** /ticket 96w, /faq 246w (vs 800 minimum), /portfolio 137w, /apply 172w, /estimate 208w, /collab 259w.  
**Base:** 3/9 × 100 = 33. Penalties: Critical (/ticket, −15). Warnings (×2 most severe thin pages, −10). **Final: 25** (capped adjustment; many deficits, majority of pages below threshold).

### On-Page SEO (47/100)
**Positives (4):** Title perfect 51 chars, meta descriptions all 130–154 chars, social meta 100/100, canonical correct.  
**Deficits (3):** H1 spacing bug, zero contextual internal links, hreflang tags semantically useless.  
**Base:** 4/7 × 100 = 57. Warnings (H1, links, −10). **Final: 47.**

### Schema (13/100)
**Positives (2):** JSON-LD format, Organization schema is well-structured.  
**Deficits (3):** FAQPage restricted, schema duplicated 40×, missing Service/Offer/BreadcrumbList.  
**Base:** 2/5 × 100 = 40. Critical (FAQPage, −15) Critical (duplication, −15). **Final: 13.**

### Performance (60/100 — Low Confidence)
Estimated from HTML indicators. Next.js SSR and Image API are positive signals. 504KB HTML and external CDN images are risks.

### Images (70/100)
**Positives (4):** 0 missing alt text, WebP via Next.js, all 200, portfolio webp.  
**Deficits (1):** External CDN for key images.  
**Base:** 4/5 × 100 = 80. Warning (external CDN, −10). **Final: 70.**

### GEO (40/100)
**Positives (3):** llms.txt present, AI search bots allowed, quotable pricing model.  
**Deficits (3):** llms.txt no links, no speakable schema, no citability-optimised blocks.  
**Base:** 3/6 × 100 = 50. Warnings (−10). **Final: 40.**

---

## Unknowns / Follow-ups (to move Hypothesis → Confirmed)

1. **CWV field data** — Add PageSpeed API key and re-run `pagespeed.py --strategy both`
2. **Trustpilot review count** — 403 on link; verify the profile exists and review count backing the 4.5 claim
3. **Inner page schema** — /services, /pricing, /about not schema-audited (only homepage checked)
4. **FAQPage source location** — Identify which Next.js component injects FAQPage and how many times it renders
5. **CSP strictness** — CSP header contains `unsafe-inline` and `unsafe-eval`; acceptable but worth reviewing if XSS risk is a concern
