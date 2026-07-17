# Schema / Structured Data Findings

## Score: 55/100

## Present Schemas
- WebSite (global) — SearchAction for sitelinks
- Organization (global) — founder, aggregateRating (5/5, 7 reviews), areaServed, OfferCatalog, ContactPoint
- Service (global via OfferCatalog) — 6 services
- WebPage (FAQ, Portfolio)
- BreadcrumbList (FAQ only)
- SpeakableSpecification (global)
- ImageObject (global via Organization)

## Missing Schemas

### FAQPage — CRITICAL
- Location: /faq has 30+ Q&As
- Zero FAQPage markup = zero rich result eligibility
- Fix: Generate from FAQ_SECTIONS data array

### HowTo — HIGH
- Location: /workflow describes a 3-step process
- Fix: Add HowTo JSON-LD with 3 HowToStep items

### BreadcrumbList — HIGH (missing on most pages)
- Present only on /faq
- Missing: /services, /pricing, /about, /contact, /portfolio, /workflow, /estimate
- Fix: Add to buildMetadata() helper

### VideoObject — HIGH
- Site is a video editing agency with zero VideoObject schema
- Any embedded/linked portfolio videos should carry this
- Required: name, description, thumbnailUrl, uploadDate

### Review (individual) — MEDIUM
- aggregateRating present but no individual Review items
- Fix: Add review[] array to Organization schema

### LocalBusiness / ProfessionalService — LOW
- Would strengthen vertical search signals
