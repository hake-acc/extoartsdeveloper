---
name: Portfolio image sourcing convention
description: Where portfolio thumbnails/logos/banners come from and how "newest only" is enforced — check before adding any portfolio data source.
---

The portfolio only ever renders local files under `nextjs/public/portfolio/{Thumbnails,Logos,Banners}`, which mirror a root-level `All Artists Samples/` folder (the source drop-in location for new work). There is no CDN/JSON data source anymore.

**Why:** an earlier version merged in legacy `src/data/portfolio.json` entries pointing at old iili.io CDN links (game-category thumbnails). The user explicitly required old links never resurface in the portfolio, so that file and its merge logic were removed entirely — do not reintroduce a JSON/CDN merge for portfolio images.

**How to apply:** any portfolio-listing code should read directly from the `public/portfolio/*` folders and sort by file `mtime` descending (newest first) — this is how "only show new samples first" is enforced across the homepage preview, the portfolio grid, and the featured carousel. If new samples are added, they only need to land in `public/portfolio/{sub}/`; no data file needs updating.
