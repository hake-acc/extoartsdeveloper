<?php
declare(strict_types=1);
// ── Gzip HTML output (PHP handles compression; Cloudflare won't double-compress) ──
if (!ini_get('zlib.output_compression')
    && !headers_sent()
    && extension_loaded('zlib')
    && isset($_SERVER['HTTP_ACCEPT_ENCODING'])
    && str_contains($_SERVER['HTTP_ACCEPT_ENCODING'], 'gzip')) {
    ini_set('zlib.output_compression', 'On');
    ini_set('zlib.output_compression_level', 6);
}

// Start session at very top before ANY output
if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.use_strict_mode', 1);
    ini_set('session.cookie_httponly', 1);
    ini_set('session.cookie_samesite', 'Lax');
    ini_set('session.gc_maxlifetime', 7200);
    $__hdr_proto = strtolower($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? $_SERVER['REQUEST_SCHEME'] ?? '');
    $__hdr_https = ($__hdr_proto === 'https') || (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
    if ($__hdr_https) ini_set('session.cookie_secure', 1);
    session_start();
}
$__nav_user = $_SESSION['user'] ?? null;

$current_page = basename($_SERVER['PHP_SELF'], ".php");

// ── HTTP cache headers ────────────────────────────────────────────────────────
// Public marketing pages: fresh for 1hr, then serve stale instantly while
//   revalidating in background (stale-while-revalidate), keep for 7 days on error.
// Logged-in portal pages or any query-string page: never cache.
$__is_portal = in_array($current_page, ['dashboard','hq-portal','chat','apply','admin'], true);
$__has_user  = !empty($_SESSION['user']);
if (empty($_GET) && !$__is_portal && !$__has_user) {
    header('Cache-Control: public, max-age=3600, stale-while-revalidate=86400, stale-if-error=604800');
    header('Vary: Accept-Encoding');
} else {
    header('Cache-Control: no-store, no-cache');
}

$prod_base = "https://extoarts.in";
$page_path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$page_url = $prod_base . $page_path;
$banner_url = "https://iili.io/BZ0qLb4.png";

$page_title = $page_title ?? "ExtoArts | YouTube Video Editing Agency & Thumbnail Design";
$page_desc = $page_desc ?? "YouTube video editing agency for creators who want real results. High-retention editing, thumbnail design, TikTok editing, and channel automation.";
$og_title = $og_title ?? $page_title;
$og_desc  = $og_desc  ?? $page_desc;
if (!isset($ga_id) || empty($ga_id)) $ga_id = 'G-WTFPZB9Y4C';
?>
<!DOCTYPE html>
<html lang="en" class="no-js">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <script>document.documentElement.classList.replace('no-js','js')</script>
    <script>
    // Safety net: if Supabase OAuth lands on any public page with auth tokens,
    // immediately bounce to /auth/callback so the session is properly established.
    // Handles both implicit flow (#access_token=) and PKCE flow (?code=).
    // This fires before any page content renders, so the user never sees a flash.
    (function(){
        var p = window.location.pathname;
        if (p === '/auth/callback') return;
        var h = window.location.hash;
        if (h && h.includes('access_token=')) {
            // Preserve query string so flow/role params survive the bounce
            window.location.replace('/auth/callback' + window.location.search + h);
            return;
        }
        var s = window.location.search;
        if (s && s.includes('code=') && s.includes('state=')) {
            window.location.replace('/auth/callback' + s + h);
        }
    })();
    </script>
    <script>
    /* Read transition direction from sessionStorage BEFORE the page renders.
       This sets data-ea-trans on <html> so CSS ::view-transition-* pseudo-elements
       and the JS fallback entrance animation both pick up the correct direction. */
    (function(){
        try {
            var d = sessionStorage.getItem('ea_trans_dir');
            if (d) {
                document.documentElement.dataset.eaTrans = d;
                sessionStorage.removeItem('ea_trans_dir');
            }
        } catch(e) {}
    })();
    </script>
    
    <title><?php echo htmlspecialchars($page_title); ?></title>
    <meta name="description" content="<?php echo htmlspecialchars($page_desc); ?>">

    <?php if (!empty($ga_id ?? '')): ?>
    <!-- GA deferred: queues dataLayer immediately, loads script after page load to cut TBT -->
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      window.addEventListener('load', function() {
        var s = document.createElement('script');
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=<?php echo htmlspecialchars($ga_id); ?>';
        document.head.appendChild(s);
        gtag('js', new Date());
        gtag('config', '<?php echo htmlspecialchars($ga_id); ?>');
      });
    </script>
    <?php endif; ?>
    <meta name="author" content="ExtoArts">
    <meta name="keywords" content="YouTube video editing agency, thumbnail design service, retention editing, TikTok video editing, YouTube automation, short-form content editing, video editing for YouTube, ExtoArts">
    <link rel="canonical" href="<?php echo $page_url; ?>" />
    
    <link rel="alternate" hreflang="en" href="<?php echo $page_url; ?>" />
    <link rel="alternate" hreflang="en-US" href="<?php echo $page_url; ?>" />
    <link rel="alternate" hreflang="en-GB" href="<?php echo $page_url; ?>" />
    <link rel="alternate" hreflang="en-IN" href="<?php echo $page_url; ?>" />
    <link rel="alternate" hreflang="en-AU" href="<?php echo $page_url; ?>" />
    <link rel="alternate" hreflang="en-CA" href="<?php echo $page_url; ?>" />
    <link rel="alternate" hreflang="en-NG" href="<?php echo $page_url; ?>" />
    <link rel="alternate" hreflang="en-PK" href="<?php echo $page_url; ?>" />
    <link rel="alternate" hreflang="en-PH" href="<?php echo $page_url; ?>" />
    <link rel="alternate" hreflang="en-ZA" href="<?php echo $page_url; ?>" />
    <link rel="alternate" hreflang="en-BD" href="<?php echo $page_url; ?>" />
    <link rel="alternate" hreflang="en-NZ" href="<?php echo $page_url; ?>" />
    <link rel="alternate" hreflang="en-SG" href="<?php echo $page_url; ?>" />
    <link rel="alternate" hreflang="x-default" href="<?php echo $page_url; ?>" />

    <meta name="geo.region" content="IN" />
    <meta name="geo.placename" content="India" />
    <meta name="language" content="English" />
    <meta property="og:locale:alternate" content="en_GB" />
    <meta property="og:locale:alternate" content="en_AU" />
    <meta property="og:locale:alternate" content="en_CA" />
    
    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
    <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48.png">
    <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="manifest" href="/site.webmanifest">
    <meta name="application-name" content="ExtoArts">
    <meta name="msapplication-config" content="/browserconfig.xml">
    <meta name="msapplication-TileColor" content="#030305">
    <meta name="msapplication-TileImage" content="/favicon-192.png">
    <link rel="search" type="application/opensearchdescription+xml" title="ExtoArts" href="/opensearch.xml">
    <link rel="alternate" type="application/rss+xml" title="ExtoArts Creator Insights" href="/rss">
    <link rel="alternate" type="application/json" title="ExtoArts Creator Insights" href="/feed.json">

    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <meta name="theme-color" content="#030305" media="(prefers-color-scheme: dark)">
    <meta name="theme-color" content="#f8fafc" media="(prefers-color-scheme: light)">
    <meta name="color-scheme" content="dark light">

    <meta property="og:type" content="website" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:site_name" content="ExtoArts" />
    <meta property="og:url" content="<?php echo $page_url; ?>" />
    <meta property="og:title" content="<?php echo htmlspecialchars($og_title); ?>" />
    <meta property="og:description" content="<?php echo htmlspecialchars($og_desc); ?>" />
    <meta property="og:image" content="<?php echo $banner_url; ?>" />
    <meta property="og:image:secure_url" content="<?php echo $banner_url; ?>" />
    <meta property="og:image:width" content="2048" />
    <meta property="og:image:height" content="1144" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:alt" content="ExtoArts - Elite YouTube Video Editing Agency" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@extoarts" />
    <meta name="twitter:creator" content="@extoarts" />
    <meta name="twitter:title" content="<?php echo htmlspecialchars($page_title); ?>" />
    <meta name="twitter:description" content="<?php echo htmlspecialchars($page_desc); ?>" />
    <meta name="twitter:image" content="<?php echo $banner_url; ?>" />
    <meta name="twitter:image:alt" content="ExtoArts - Elite YouTube Video Editing Agency" />

    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": "https://extoarts.in/#website",
          "name": "ExtoArts",
          "url": "https://extoarts.in/",
          "inLanguage": "en-US",
          "description": "YouTube-focused video editing agency offering retention editing, thumbnail design, TikTok short-form editing, and YouTube automation.",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://extoarts.in/faq?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        },
        {
          "@type": ["Organization", "ProfessionalService"],
          "@id": "https://extoarts.in/#organization",
          "name": "ExtoArts",
          "legalName": "ExtoArts",
          "brand": {
            "@type": "Brand",
            "name": "ExtoArts"
          },
          "alternateName": ["ExtoArts Agency", "Exto Arts"],
          "url": "https://extoarts.in/",
          "mainEntityOfPage": "https://extoarts.in/",
          "logo": {
            "@type": "ImageObject",
            "@id": "https://extoarts.in/#logo",
            "url": "https://extoarts.in/favicon-192.png",
            "contentUrl": "https://extoarts.in/favicon-192.png",
            "width": 192,
            "height": 192,
            "caption": "ExtoArts",
            "name": "ExtoArts Logo"
          },
          "image": {
            "@type": "ImageObject",
            "url": "https://iili.io/BZ0qLb4.png",
            "width": 2048,
            "height": 1144,
            "caption": "ExtoArts YouTube Video Editing Agency",
            "representativeOfPage": true
          },
          "description": "ExtoArts is a YouTube video editing agency founded in 2024 that provides high-retention video editing, thumbnail design, YouTube Shorts and TikTok editing, motion graphics, and full YouTube channel automation. ExtoArts is a coined brand name representing extended creative arts - the agency's distinctive trademark. ExtoArts charges a flat 10% agency fee - 90% of a creator's budget goes directly to the specialist editor.",
          "priceRange": "$$",
          "currenciesAccepted": "USD, PayPal, Crypto, PKR",
          "paymentAccepted": "PayPal, Bank Transfer, USDT, BTC, ETH, UPI, EasyPaisa, Bkash",
          "foundingDate": "2024",
          "founder": {
            "@type": "Person",
            "name": "Rehan",
            "alternateName": "RehanSigma",
            "jobTitle": "Founder & Creative Director",
            "url": "https://extoarts.in/about",
            "image": "https://iili.io/BZ0qsef.jpg",
            "sameAs": [
              "https://x.com/extoarts",
              "https://www.instagram.com/extoarts",
              "https://youtube.com/@extoarts"
            ],
            "worksFor": {"@id": "https://extoarts.in/#organization"}
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "5",
            "bestRating": "5",
            "worstRating": "1",
            "reviewCount": "7"
          },
          "numberOfEmployees": {"@type": "QuantitativeValue", "minValue": 6, "maxValue": 12},
          "slogan": "90% to your editor. Always.",
          "inLanguage": "en",
          "areaServed": [
            {"@type": "Country", "name": "United States"},
            {"@type": "Country", "name": "United Kingdom"},
            {"@type": "Country", "name": "Canada"},
            {"@type": "Country", "name": "Australia"},
            {"@type": "Country", "name": "New Zealand"},
            {"@type": "Country", "name": "India"},
            {"@type": "Country", "name": "Pakistan"},
            {"@type": "Country", "name": "Bangladesh"},
            {"@type": "Country", "name": "Nigeria"},
            {"@type": "Country", "name": "South Africa"},
            {"@type": "Country", "name": "Philippines"},
            {"@type": "Country", "name": "Singapore"},
            {"@type": "Country", "name": "Germany"},
            {"@type": "AdministrativeArea", "name": "Worldwide"}
          ],
          "serviceType": ["YouTube Video Editing", "Thumbnail Design", "Short-Form Video Editing", "YouTube Automation", "Gaming Video Editing"],
          "knowsAbout": ["YouTube Video Editing", "Thumbnail Design", "TikTok Editing", "YouTube Automation", "Motion Graphics", "Short-Form Content", "Gaming Video Editing", "Roblox Video Editing", "Minecraft Video Editing", "Faceless YouTube Channels"],
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "ExtoArts Services",
            "itemListElement": [
              {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "YouTube Video Editing"}},
              {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Thumbnail Design"}},
              {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "YouTube Shorts Editing"}},
              {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Faceless YouTube Channel Setup"}},
              {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Gaming Video Editing"}}
            ]
          },
          "contactPoint": [
            {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "url": "https://discord.gg/extoarts-1402333030827425922",
              "availableLanguage": "English"
            },
            {
              "@type": "ContactPoint",
              "contactType": "sales",
              "url": "https://extoarts.in/contact",
              "availableLanguage": "English"
            }
          ],
          "sameAs": [
            "https://x.com/extoarts",
            "https://www.threads.net/@extoarts",
            "https://youtube.com/@extoarts",
            "https://www.instagram.com/extoarts",
            "https://www.facebook.com/share/1J1UA6Txqr/",
            "https://discord.gg/extoarts-1402333030827425922",
            "https://www.trustpilot.com/review/extoarts.xyz"
          ]
        }
      ]
    }
    </script>

    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "SiteLinksSearchBox",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://extoarts.in/faq?q={search_term_string}"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://extoarts.in/faq?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
    </script>

    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "ExtoArts Site Navigation",
      "itemListElement": [
        {"@type": "SiteNavigationElement", "position": 1, "name": "Services", "url": "https://extoarts.in/services", "description": "YouTube video editing, thumbnail design, Shorts editing, and motion graphics services"},
        {"@type": "SiteNavigationElement", "position": 2, "name": "Portfolio", "url": "https://extoarts.in/portfolio", "description": "Showcase of gaming thumbnails, video edits, and motion graphics by ExtoArts"},
        {"@type": "SiteNavigationElement", "position": 3, "name": "Pricing", "url": "https://extoarts.in/pricing", "description": "Transparent editing rates and monthly retainer packages"},
        {"@type": "SiteNavigationElement", "position": 4, "name": "Workflow", "url": "https://extoarts.in/workflow", "description": "How ExtoArts manages your project from brief to delivery"},
        {"@type": "SiteNavigationElement", "position": 5, "name": "About", "url": "https://extoarts.in/about", "description": "The ExtoArts team, founder story, and frequently asked questions"},
        {"@type": "SiteNavigationElement", "position": 6, "name": "Free Tools", "url": "https://extoarts.in/free-tools", "description": "Free YouTube editing cost estimator, retention analyzer, and upload planner"},
        {"@type": "SiteNavigationElement", "position": 7, "name": "Contact", "url": "https://extoarts.in/contact", "description": "Reach ExtoArts via Discord to start your project"},
        {"@type": "SiteNavigationElement", "position": 8, "name": "FAQ", "url": "https://extoarts.in/faq", "description": "Comprehensive answers to client questions about ExtoArts services"}
      ]
    }
    </script>

    <?php if (!empty($breadcrumbs)): ?>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "ExtoArts", "item": "https://extoarts.in/"}
        <?php foreach ($breadcrumbs as $i => $crumb): ?>,
        {"@type": "ListItem", "position": <?php echo $i + 2; ?>, "name": "<?php echo htmlspecialchars($crumb['name']); ?>", "item": "https://extoarts.in<?php echo htmlspecialchars($crumb['url']); ?>"}
        <?php endforeach; ?>
      ]
    }
    </script>
    <?php endif; ?>
    
    <link rel="preconnect" href="https://iili.io" crossorigin>
    <link rel="dns-prefetch" href="https://iili.io">
    <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
    <link rel="dns-prefetch" href="https://cdn.jsdelivr.net">
    <link rel="dns-prefetch" href="https://www.googletagmanager.com">
    <!-- Critical CSS: inlined — zero render-blocking stylesheets on first paint -->
    <!-- Self-hosted Plus Jakarta Sans — original brand font, no external request -->
    <style>
@font-face{font-family:'Plus Jakarta Sans';font-style:normal;font-weight:200 800;font-display:swap;src:url('/css/fonts/plus-jakarta-sans.woff2') format('woff2');}
@font-face{font-family:'Plus Jakarta Sans';font-style:italic;font-weight:200 800;font-display:swap;src:url('/css/fonts/plus-jakarta-sans-italic.woff2') format('woff2');}
<?php echo file_get_contents(__DIR__ . '/../css/critical.min.css'); ?></style>

    <!-- Preload self-hosted Plus Jakarta Sans — eliminates FOUT, speeds LCP text -->
    <link rel="preload" as="font" type="font/woff2" crossorigin href="/css/fonts/plus-jakarta-sans.woff2">
    <!-- Tabler Icons full glyph sheet (icons beyond nav set) — async after paint -->
    <link rel="preload" as="font" type="font/woff2" crossorigin href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.33.0/dist/fonts/tabler-icons.woff2">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.33.0/dist/tabler-icons.min.css" media="print" onload="this.onload=null;this.media='all'">
    <noscript><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.33.0/dist/tabler-icons.min.css"></noscript>
    <!-- AOS — jsdelivr (same CDN, no extra DNS lookup) -->
    <link rel="preload" href="https://cdn.jsdelivr.net/npm/aos@2.3.1/dist/aos.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/aos@2.3.1/dist/aos.css"></noscript>
    <!-- Swiper.js — async stylesheet -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11.1.4/swiper-bundle.min.css" media="print" onload="this.onload=null;this.media='all'">
    <noscript><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11.1.4/swiper-bundle.min.css"></noscript>
    <!-- Splitting.js — base character-split stylesheet -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/splitting@1.0.6/dist/splitting.css" media="print" onload="this.onload=null;this.media='all'">
    <noscript><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/splitting@1.0.6/dist/splitting.css"></noscript>
    <!-- All page CSS: minified + async — critical.css covers above-fold rendering -->
    <link rel="stylesheet" href="/css/transitions.min.css?v=<?= filemtime(__DIR__.'/../css/transitions.min.css') ?>" media="print" onload="this.onload=null;this.media='all'">
    <noscript><link rel="stylesheet" href="/css/transitions.min.css"></noscript>
    <link rel="stylesheet" href="/css/cinematic.min.css?v=<?= filemtime(__DIR__.'/../css/cinematic.min.css') ?>" media="print" onload="this.onload=null;this.media='all'">
    <noscript><link rel="stylesheet" href="/css/cinematic.min.css"></noscript>
    <link rel="stylesheet" href="/css/shared.min.css?v=<?= filemtime(__DIR__.'/../css/shared.min.css') ?>" media="print" onload="this.onload=null;this.media='all'">
    <noscript><link rel="stylesheet" href="/css/shared.min.css"></noscript>
    <link rel="stylesheet" href="/css/premium.min.css?v=<?= filemtime(__DIR__.'/../css/premium.min.css') ?>" media="print" onload="this.onload=null;this.media='all'">
    <noscript><link rel="stylesheet" href="/css/premium.min.css"></noscript>
    <link rel="stylesheet" href="/css/identity.min.css?v=<?= filemtime(__DIR__.'/../css/identity.min.css') ?>" media="print" onload="this.onload=null;this.media='all'">
    <noscript><link rel="stylesheet" href="/css/identity.min.css"></noscript>
    <link rel="stylesheet" href="/css/ux.min.css?v=<?= filemtime(__DIR__.'/../css/ux.min.css') ?>" media="print" onload="this.onload=null;this.media='all'">
    <noscript><link rel="stylesheet" href="/css/ux.min.css"></noscript>
    <link rel="stylesheet" href="/css/reveal.min.css?v=<?= filemtime(__DIR__.'/../css/reveal.min.css') ?>" media="print" onload="this.onload=null;this.media='all'">
    <noscript><link rel="stylesheet" href="/css/reveal.min.css"></noscript>
    <link rel="stylesheet" href="/css/motion.min.css?v=<?= filemtime(__DIR__.'/../css/motion.min.css') ?>" media="print" onload="this.onload=null;this.media='all'">
    <noscript><link rel="stylesheet" href="/css/motion.min.css"></noscript>
    <link rel="stylesheet" href="/css/elite.min.css?v=<?= filemtime(__DIR__.'/../css/elite.min.css') ?>" media="print" onload="this.onload=null;this.media='all'">
    <noscript><link rel="stylesheet" href="/css/elite.min.css"></noscript>
    <?php if (!empty($extra_head)) echo $extra_head; ?>
    <!-- Speculation Rules: prefetch likely-next pages on moderate hover/pointer intent -->
    <script type="speculationrules">
    {
      "prefetch": [{
        "where": {"and": [
          {"href_matches": "/*"},
          {"not": {"href_matches": "/api/*"}},
          {"not": {"href_matches": "/login"}},
          {"not": {"href_matches": "/register"}},
          {"not": {"href_matches": "/logout"}},
          {"not": {"href_matches": "/dashboard*"}},
          {"not": {"href_matches": "/hq-portal*"}},
          {"not": {"href_matches": "/chat*"}}
        ]},
        "eagerness": "moderate"
      }]
    }
    </script>
</head>
<body>

    <a href="#main-content" class="skip-link">Skip to main content</a>

    <script>
        const _urlTheme = new URLSearchParams(location.search).get('theme');
        const savedTheme = _urlTheme || localStorage.getItem('theme');
        if (savedTheme === 'light') { 
            document.documentElement.setAttribute('data-theme', 'light'); 
        }
        function _syncThemeIcon() {
            const icon = document.getElementById('themeIcon');
            if (!icon) return;
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            icon.className = isLight ? 'ti ti-sun' : 'ti ti-moon';
        }
        document.addEventListener('DOMContentLoaded', _syncThemeIcon);
    </script>

    <div id="page-progress"></div>

    <div class="mesh-glow"></div>

    <!-- Cinematic background system — 7 layers, fixed, pointer-events:none -->
    <div class="bg-cinematic" aria-hidden="true">
        <div class="bg-field" id="bgField"><div class="bg-field-warm"></div></div>
        <div class="bg-aurora">
            <div class="aurora-band ab1"></div>
            <div class="aurora-band ab2"></div>
            <div class="aurora-band ab3"></div>
        </div>
        <div class="bg-depth bg-depth-a" id="bgDepthA"></div>
        <div class="bg-depth bg-depth-b" id="bgDepthB"></div>
        <div class="bg-grid" id="bgGrid"><div class="bg-grid-inner" id="bgGridInner"></div></div>
    </div>

    <nav class="site-nav">
        <a href="/" class="logo transition-link">
            <img src="/favicon-192.png" width="36" height="36" class="logo-mark" alt="ExtoArts logo" fetchpriority="high" decoding="sync" onerror="this.onerror=null;this.outerHTML=`<svg width='36' height='36' viewBox='0 0 36 36' fill='none' xmlns='http://www.w3.org/2000/svg' class='logo-mark' aria-hidden='true'><rect width='36' height='36' rx='9' fill='#0a0a14'/><path d='M10.5 10.5V25.5M10.5 10.5H24M10.5 18H20.5M10.5 25.5H24' stroke='#22d3ee' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/></svg>`">
            <span>ExtoArts</span>
        </a>
        <ul class="nav-links" role="list">
            <li><a href="/services" class="transition-link <?php echo ($current_page=='services')?'active':''; ?>" <?php echo ($current_page=='services')?'aria-current="page"':''; ?>>Services</a></li>
            <li><a href="/portfolio" class="transition-link <?php echo ($current_page=='portfolio')?'active':''; ?>" <?php echo ($current_page=='portfolio')?'aria-current="page"':''; ?>>Portfolio</a></li>
            <li><a href="/pricing" class="transition-link <?php echo ($current_page=='pricing')?'active':''; ?>" <?php echo ($current_page=='pricing')?'aria-current="page"':''; ?>>Pricing</a></li>
            <li><a href="/workflow" class="transition-link <?php echo ($current_page=='workflow')?'active':''; ?>" <?php echo ($current_page=='workflow')?'aria-current="page"':''; ?>>Workflow</a></li>
            <li><a href="/about" class="transition-link <?php echo ($current_page=='about')?'active':''; ?>" <?php echo ($current_page=='about')?'aria-current="page"':''; ?>>About</a></li>
            <li><a href="/contact" class="transition-link <?php echo ($current_page=='contact')?'active':''; ?>" <?php echo ($current_page=='contact')?'aria-current="page"':''; ?>>Contact</a></li>
            <li><a href="/collab" class="transition-link <?php echo ($current_page=='collab')?'active':''; ?>" <?php echo ($current_page=='collab')?'aria-current="page"':''; ?>>Partner</a></li>
        </ul>
        <div style="display:flex; align-items:center; gap:10px;">
            <?php if ($__nav_user): ?>
            <a href="/dashboard" class="nav-user-btn">
                <img src="<?php echo htmlspecialchars($__nav_user['avatar'] ?: ''); ?>" alt="<?php echo htmlspecialchars($__nav_user['name'] ?? $__nav_user['username'] ?? 'User'); ?> profile photo" width="28" height="28" decoding="async" onerror="this.style.display='none'">
                Dashboard
            </a>
            <?php else: ?>
            <a href="/login" class="nav-cta">Sign In</a>
            <?php endif; ?>
            <span class="theme-toggle" onclick="toggleTheme()" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleTheme();}" title="Toggle Theme" id="themeToggleBtn" role="button" tabindex="0" aria-label="Toggle light/dark theme">
                <i class="ti ti-moon" id="themeIcon" aria-hidden="true"></i>
            </span>
            <span class="hamburger" onclick="toggleMobileNav()" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleMobileNav();}" id="hamburgerBtn" role="button" tabindex="0" aria-label="Open navigation menu" aria-expanded="false" aria-controls="mobileNav">
                <i class="ti ti-menu-2" id="hamburgerIcon" aria-hidden="true"></i>
            </span>
        </div>
    </nav>

    <nav class="mobile-nav" id="mobileNav" aria-label="Mobile navigation">
        <span class="close-menu" onclick="closeMobileNav()" aria-label="Close menu"><i class="ti ti-x"></i></span>
        <ul role="list" style="list-style:none;margin:0;padding:0;display:contents;">
        <li><a href="/" class="transition-link <?php echo ($current_page=='home'||$current_page=='index')?'active':''; ?>" <?php echo ($current_page=='home'||$current_page=='index')?'aria-current="page"':''; ?> onclick="closeMobileNav()"><i class="ti ti-home" aria-hidden="true"></i><span>Home</span></a></li>
        <li><a href="/services" class="transition-link <?php echo ($current_page=='services')?'active':''; ?>" <?php echo ($current_page=='services')?'aria-current="page"':''; ?> onclick="closeMobileNav()"><i class="ti ti-stack" aria-hidden="true"></i><span>Services</span></a></li>
        <li><a href="/portfolio" class="transition-link <?php echo ($current_page=='portfolio')?'active':''; ?>" <?php echo ($current_page=='portfolio')?'aria-current="page"':''; ?> onclick="closeMobileNav()"><i class="ti ti-photo" aria-hidden="true"></i><span>Portfolio</span></a></li>
        <li><a href="/pricing" class="transition-link <?php echo ($current_page=='pricing')?'active':''; ?>" <?php echo ($current_page=='pricing')?'aria-current="page"':''; ?> onclick="closeMobileNav()"><i class="ti ti-tag" aria-hidden="true"></i><span>Pricing</span></a></li>
        <li><a href="/workflow" class="transition-link <?php echo ($current_page=='workflow')?'active':''; ?>" <?php echo ($current_page=='workflow')?'aria-current="page"':''; ?> onclick="closeMobileNav()"><i class="ti ti-route" aria-hidden="true"></i><span>Workflow</span></a></li>
        <li><a href="/about" class="transition-link <?php echo ($current_page=='about')?'active':''; ?>" <?php echo ($current_page=='about')?'aria-current="page"':''; ?> onclick="closeMobileNav()"><i class="ti ti-info-circle" aria-hidden="true"></i><span>About</span></a></li>
        <li><a href="/contact" class="transition-link <?php echo ($current_page=='contact')?'active':''; ?>" <?php echo ($current_page=='contact')?'aria-current="page"':''; ?> onclick="closeMobileNav()"><i class="ti ti-mail" aria-hidden="true"></i><span>Contact</span></a></li>
        <li><a href="/collab" class="transition-link <?php echo ($current_page=='collab')?'active':''; ?>" <?php echo ($current_page=='collab')?'aria-current="page"':''; ?> onclick="closeMobileNav()"><i class="ti ti-users-group" aria-hidden="true"></i><span>Partner</span></a></li>
        <?php if (!empty($_SESSION['user'])): ?>
        <li><a href="/dashboard" class="transition-link" onclick="closeMobileNav()"><i class="ti ti-layout-2"></i><span>Dashboard</span></a></li>
        <li><a href="/logout" class="transition-link" onclick="closeMobileNav()" style="color:#ef4444;"><i class="ti ti-logout"></i><span>Logout</span></a></li>
        <?php else: ?>
        <li><a href="/login" class="transition-link mobile-signin-btn" onclick="closeMobileNav()"><i class="ti ti-brand-discord"></i><span>Sign In</span></a></li>
        <?php endif; ?>
        </ul>
    </nav>

    <script src="/js/ui.js?v=<?= filemtime(__DIR__.'/../js/ui.js') ?>" defer></script>
    <script src="/js/transitions.js?v=<?= filemtime(__DIR__.'/../js/transitions.js') ?>" defer></script>

<main id="main-content">
