#!/usr/bin/env bash
# ExtoArts Performance Validation Script
# Run this after each deployment to check key web performance signals.
# Usage: bash performance-check.sh [domain]

set -euo pipefail

DOMAIN="${1:-https://extoarts.in}"
PASS=0
FAIL=0
WARN=0

green()  { echo -e "\033[0;32m[PASS]\033[0m $1"; ((PASS++)); }
red()    { echo -e "\033[0;31m[FAIL]\033[0m $1"; ((FAIL++)); }
yellow() { echo -e "\033[0;33m[WARN]\033[0m $1"; ((WARN++)); }
header() { echo -e "\n\033[1;36m── $1 ──\033[0m"; }

echo -e "\033[1;37mExtoArts Performance Check — $(date '+%Y-%m-%d %H:%M:%S')\033[0m"
echo "Domain: $DOMAIN"

# ── 1. HTTP Response & HTTPS redirect ─────────────────────────────────────────
header "HTTP / HTTPS"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$DOMAIN/")
if [ "$HTTP_CODE" = "200" ]; then
    green "Homepage returns HTTP 200"
else
    red "Homepage returned HTTP $HTTP_CODE (expected 200)"
fi

# Check HSTS header
HSTS=$(curl -s -I --max-time 10 "$DOMAIN/" | grep -i "strict-transport-security" | head -1)
if [ -n "$HSTS" ]; then
    green "HSTS header present: $HSTS"
else
    yellow "HSTS header not found (may be handled by proxy/CDN)"
fi

# ── 2. robots.txt ─────────────────────────────────────────────────────────────
header "robots.txt"

ROBOTS=$(curl -s --max-time 10 "$DOMAIN/robots.txt")
if echo "$ROBOTS" | grep -q "Sitemap:"; then
    green "robots.txt has Sitemap directive"
else
    red "robots.txt missing Sitemap directive"
fi
if echo "$ROBOTS" | grep -q "Disallow: /hq-portal"; then
    green "robots.txt blocks /hq-portal"
else
    red "robots.txt missing Disallow for /hq-portal"
fi

# ── 3. Sitemap ─────────────────────────────────────────────────────────────────
header "Sitemap"

SITEMAP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$DOMAIN/sitemap.xml")
if [ "$SITEMAP_CODE" = "200" ]; then
    green "sitemap.xml returns HTTP 200"
else
    red "sitemap.xml returned HTTP $SITEMAP_CODE"
fi

SITEMAP_CT=$(curl -s -I --max-time 10 "$DOMAIN/sitemap.xml" | grep -i "content-type" | head -1)
if echo "$SITEMAP_CT" | grep -qi "xml"; then
    green "sitemap.xml Content-Type is XML: $SITEMAP_CT"
else
    yellow "sitemap.xml Content-Type unexpected: $SITEMAP_CT"
fi

# ── 4. Critical Pages ─────────────────────────────────────────────────────────
header "Page Availability"

PAGES=("/" "/services" "/pricing" "/portfolio" "/blog" "/about" "/contact"
       "/youtube-editing" "/thumbnail-design" "/gaming-video-editing"
       "/youtube-shorts-editing" "/faceless-youtube-channel" "/affordable-youtube-editing"
       "/workflow" "/collab" "/tos" "/privacy" "/resources" "/estimate")

for PAGE in "${PAGES[@]}"; do
    CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$DOMAIN$PAGE")
    if [ "$CODE" = "200" ]; then
        green "$PAGE — $CODE"
    else
        red "$PAGE — $CODE"
    fi
done

# ── 5. Protected Routes ───────────────────────────────────────────────────────
header "Protected Routes (must NOT be 200)"

BLOCKED=("/hq-portal" "/admin" "/setup-db" "/config.php" "/auth.php" "/db.php")
for ROUTE in "${BLOCKED[@]}"; do
    CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$DOMAIN$ROUTE")
    if [ "$CODE" != "200" ]; then
        green "$ROUTE blocked — HTTP $CODE"
    else
        red "$ROUTE is publicly accessible (HTTP $CODE) — review access controls"
    fi
done

# ── 6. Blog Sub-Slug Redirects ────────────────────────────────────────────────
header "Blog Slug Routing"

BLOG_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 -L "$DOMAIN/blog/art-techniques-beginners")
if [ "$BLOG_CODE" = "200" ]; then
    green "/blog/[slug] redirects and resolves correctly"
else
    yellow "/blog/[slug] returned $BLOG_CODE (expected 200 after redirect)"
fi

# ── 7. Key CWV Signals ────────────────────────────────────────────────────────
header "Core Web Vitals Signals"

# Check for lazy-loading on images
HTML=$(curl -s --max-time 15 "$DOMAIN/portfolio")
LAZY_COUNT=$(echo "$HTML" | grep -c 'loading="lazy"' || true)
if [ "$LAZY_COUNT" -gt 0 ]; then
    green "Lazy-loading present on /portfolio ($LAZY_COUNT instances)"
else
    yellow "No lazy-loaded images detected on /portfolio"
fi

# Check font preconnect
HTML_HOME=$(curl -s --max-time 15 "$DOMAIN/")
if echo "$HTML_HOME" | grep -q "fonts.googleapis.com"; then
    green "Google Fonts preconnect present on homepage"
else
    yellow "Google Fonts preconnect not found"
fi

if echo "$HTML_HOME" | grep -q "display=swap"; then
    green "font-display:swap present in Google Fonts URL"
else
    red "font-display:swap missing from Google Fonts URL"
fi

# Check viewport meta
if echo "$HTML_HOME" | grep -q 'name="viewport"'; then
    green "Viewport meta tag present"
else
    red "Viewport meta tag missing"
fi

# Check canonical
if echo "$HTML_HOME" | grep -q 'rel="canonical"'; then
    green "Canonical link tag present"
else
    red "Canonical link tag missing"
fi

# ── Summary ───────────────────────────────────────────────────────────────────
echo ""
echo -e "\033[1;37m────────────────────────────────────────\033[0m"
echo -e "\033[0;32mPASS: $PASS\033[0m  \033[0;31mFAIL: $FAIL\033[0m  \033[0;33mWARN: $WARN\033[0m"
echo -e "\033[1;37m────────────────────────────────────────\033[0m"

if [ "$FAIL" -gt 0 ]; then
    echo -e "\033[0;31mSome checks failed. Review above and redeploy as needed.\033[0m"
    exit 1
else
    echo -e "\033[0;32mAll critical checks passed.\033[0m"
    exit 0
fi
