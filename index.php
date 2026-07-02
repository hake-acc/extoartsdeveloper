<?php
declare(strict_types=1);
/**
 * ExtoArts - Front Controller
 *
 * Apache (AeonHost): .htaccess routes all unknown URLs here.
 * Replit dev server:  router.php passes control here after handling static files.
 *
 * Directory layout:
 *   includes/   config, db, auth, notify, email, error-handler  (HTTP-blocked)
 *   templates/  header, footer                                   (HTTP-blocked)
 *   pages/      public marketing pages                           (HTTP-blocked)
 *   portal/     auth-required portal pages                       (HTTP-blocked)
 *   api/        JSON API endpoints
 *   css/ js/    static assets (served directly by Apache / PHP built-in server)
 */

require_once __DIR__ . '/includes/error-handler.php';

// ── PHP fingerprint removal ─────────────────────────────────────────────────
header_remove('X-Powered-By');
ini_set('expose_php', '0');

// ── HTTPS redirect (production domain only) ─────────────────────────────────
$_rHost = $_SERVER['HTTP_HOST'] ?? '';
if (in_array($_rHost, ['extoarts.in', 'www.extoarts.in'], true)) {
    $proto   = strtolower($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? $_SERVER['REQUEST_SCHEME'] ?? '');
    $isHttps = ($proto === 'https') || (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
    if (!$isHttps) {
        header('Location: https://extoarts.in' . $_SERVER['REQUEST_URI'], true, 301);
        header('Cache-Control: max-age=86400');
        exit;
    }
    header('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload');
}
unset($_rHost);

// ── Content Security Policies ───────────────────────────────────────────────
const _CSP_PUBLIC =
    "default-src 'self'; " .
    "script-src 'self' 'unsafe-inline' cdn.jsdelivr.net cdnjs.cloudflare.com " .
        "www.googletagmanager.com challenges.cloudflare.com esm.sh static.cloudflareinsights.com; " .
    "script-src-elem 'self' 'unsafe-inline' cdn.jsdelivr.net cdnjs.cloudflare.com " .
        "www.googletagmanager.com challenges.cloudflare.com esm.sh static.cloudflareinsights.com; " .
    "style-src 'self' 'unsafe-inline' cdn.jsdelivr.net cdnjs.cloudflare.com; " .
    "font-src 'self' data: cdn.jsdelivr.net cdnjs.cloudflare.com; " .
    "img-src 'self' data: https: blob:; " .
    "frame-src 'self' discord.com www.discord.com challenges.cloudflare.com; " .
    "connect-src 'self' cdn.jsdelivr.net www.google-analytics.com " .
        "analytics.google.com www.googletagmanager.com " .
        "https://bigopvwtprisrfhuayxs.supabase.co wss://bigopvwtprisrfhuayxs.supabase.co esm.sh; " .
    "media-src 'self'; " .
    "object-src 'none'; " .
    "base-uri 'self'; " .
    "form-action 'self' https://accounts.google.com https://discord.com; " .
    "frame-ancestors 'self'; " .
    "upgrade-insecure-requests";

const _CSP_PORTAL =
    "default-src 'self'; " .
    "script-src 'self' 'unsafe-inline' https://esm.sh https://cdnjs.cloudflare.com " .
        "https://challenges.cloudflare.com; " .
    "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; " .
    "font-src 'self' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com data:; " .
    "img-src 'self' data: blob: https://iili.io https://i.ibb.co https://imgbb.com https://freeimage.host; " .
    "connect-src 'self' https://bigopvwtprisrfhuayxs.supabase.co wss://bigopvwtprisrfhuayxs.supabase.co; " .
    "frame-src 'self' https://challenges.cloudflare.com; " .
    "frame-ancestors 'self'; " .
    "object-src 'none'; " .
    "base-uri 'self'; " .
    "form-action 'self'";

function _set_html_security_headers(): void {
    header('X-Frame-Options: SAMEORIGIN');
    header('X-Content-Type-Options: nosniff');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    header('Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=()');
    header('Cross-Origin-Opener-Policy: same-origin-allow-popups');
    header('Content-Security-Policy: ' . _CSP_PUBLIC);
}

// ── URI normalisation ───────────────────────────────────────────────────────
$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
$uri = '/' . ltrim($uri, '/');

// ── IndexNow key verification files ────────────────────────────────────────
foreach (['ce5fc1ebd7e9487ea3b3b9465d36b2a2', '660500cdefe848cdbb4debe750e0a8b0'] as $_ink) {
    if ($uri === '/' . $_ink . '.txt') {
        header('Content-Type: text/plain');
        echo $_ink;
        exit;
    }
}
unset($_ink);

// ── Static sitemaps ─────────────────────────────────────────────────────────
if ($uri === '/sitemap.xml') {
    header('Content-Type: application/xml; charset=UTF-8');
    readfile(__DIR__ . '/sitemap-new.xml');
    exit;
}
if ($uri === '/sitemap-images.xml') {
    include __DIR__ . '/pages/sitemap-images.php';
    exit;
}

// ── IndexNow ping ───────────────────────────────────────────────────────────
if ($uri === '/indexnow-ping') {
    include __DIR__ . '/pages/indexnow-ping.php';
    exit;
}

// ── Chat (portal, passed with query string) ─────────────────────────────────
if ($uri === '/chat') {
    _set_html_security_headers();
    include __DIR__ . '/portal/chat.php';
    exit;
}

// ── API endpoints: /api/* ───────────────────────────────────────────────────
if (str_starts_with($uri, '/api/')) {
    $apiName = basename(substr($uri, 5));
    $apiFile = __DIR__ . '/api/' . $apiName . '.php';
    if (is_file($apiFile)) {
        include $apiFile;
        exit;
    }
    http_response_code(404);
    echo json_encode(['ok' => false, 'error' => 'Not found']);
    exit;
}

// ── Order submission ────────────────────────────────────────────────────────
if ($uri === '/order/submit') {
    include __DIR__ . '/api/order-submit.php';
    exit;
}

// ── OAuth error intercept ───────────────────────────────────────────────────
if (in_array($uri, ['/', '/auth/callback'], true) && isset($_GET['error'])) {
    $err  = trim($_GET['error'] ?? '');
    $code = trim($_GET['error_code'] ?? '');
    $desc = trim($_GET['error_description'] ?? '');
    if ($err === 'server_error' || $err === 'access_denied' || $code || $desc) {
        $msg = str_replace('+', ' ', urldecode($desc ?: ($code ?: $err)));
        header('Location: /login?oauth_error=' . urlencode($msg), true, 302);
        exit;
    }
}

// ── Route map ──────────────────────────────────────────────────────────────
// Prefixes:  p: = pages/   r: = portal/   bare: = root (llms.txt)
// __redirect: values issue a 301 to the given path.
$page = trim($uri, '/');

$map = [
    // Public pages
    ''              => 'p:home',
    'services'      => 'p:services',
    'portfolio'     => 'p:portfolio',
    'pricing'       => 'p:pricing',
    'workflow'      => 'p:workflow',
    'collab'        => 'p:collab',
    'contact'       => 'p:contact',
    'about'         => 'p:about',
    'tos'           => 'p:tos',
    'toc'           => 'p:tos',
    'privacy'       => 'p:privacy',
    'faq'           => 'p:faq',
    'estimate'      => 'p:estimate',
    'ticket'        => 'p:ticket',
    'support'       => 'p:ticket',
    'rss'           => 'p:rss',
    'feed'          => 'p:rss',
    'llms'          => 'bare:llms.txt',
    'llms.txt'      => 'bare:llms.txt',
    'health'        => 'p:health',

    // Portal (auth-required)
    'login'         => 'r:login',
    'register'      => 'r:register',
    'logout'        => 'r:logout',
    'verify-email'  => 'r:verify-email',
    'verify'        => 'r:verify',
    'auth/callback' => 'r:oauth-callback',
    'dashboard'     => 'r:dashboard',
    'apply'         => 'r:apply',
    'hq-portal'     => 'r:hq-portal',
    'admin'         => 'r:admin',

    // 301 redirects - SEO slugs + deleted pages
    'youtube-editing'            => '__redirect:/services',
    'thumbnail-design'           => '__redirect:/services',
    'discord-agency'             => '__redirect:/services',
    'gaming-video-editing'       => '__redirect:/services',
    'faceless-youtube-channel'   => '__redirect:/services',
    'youtube-shorts-editing'     => '__redirect:/services',
    'hire-video-editor'          => '__redirect:/services',
    'youtube-channel-management' => '__redirect:/services',
    'affordable-youtube-editing' => '__redirect:/pricing',
    'video-editing-cost'         => '__redirect:/pricing',
];

if (isset($map[$page])) {
    $target = $map[$page];

    if (str_starts_with($target, '__redirect:')) {
        header('Location: ' . substr($target, 11), true, 301);
        header('Cache-Control: max-age=86400');
        exit;
    }

    if (str_starts_with($target, 'p:')) {
        $file = __DIR__ . '/pages/' . substr($target, 2) . '.php';
    } elseif (str_starts_with($target, 'r:')) {
        $file = __DIR__ . '/portal/' . substr($target, 2) . '.php';
    } else {
        // bare: - file lives directly in root (e.g. llms.txt)
        $file = __DIR__ . '/' . substr($target, 5);
    }

    if (is_file($file)) {
        _set_html_security_headers();
        include $file;
        exit;
    }
}

// ── Social redirects (lazily loaded JSON) ──────────────────────────────────
if (strlen($uri) <= 20 && substr_count($uri, '/') === 1) {
    $redirectFile = __DIR__ . '/data/social_redirects.json';
    if (is_file($redirectFile)) {
        $decoded = json_decode(file_get_contents($redirectFile), true) ?: [];
        foreach ($decoded as $redirect) {
            if (!empty($redirect['path']) && $redirect['path'] === $uri && !empty($redirect['target'])) {
                if (!preg_match('#^https?://#i', $redirect['target'])) {
                    http_response_code(400);
                    exit;
                }
                header('X-Robots-Tag: all');
                header('Location: ' . $redirect['target'], true, 302);
                exit;
            }
        }
    }
}

// ── /blog → 301 home; /blog/* → 410 ────────────────────────────────────────
if ($uri === '/blog') {
    header('Location: /', true, 301);
    header('Cache-Control: max-age=86400');
    exit;
}
if (str_starts_with($uri, '/blog/')) {
    http_response_code(410);
    header('X-Robots-Tag: noindex');
    echo '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">'
       . '<title>Gone | ExtoArts</title></head><body>'
       . '<h1>410 Gone</h1><p>This page has been permanently removed.</p>'
       . '<p><a href="/">Return to ExtoArts</a></p></body></html>';
    exit;
}

// ── 404 fallback ────────────────────────────────────────────────────────────
http_response_code(404);
_set_html_security_headers();
include __DIR__ . '/404.php';
exit;
