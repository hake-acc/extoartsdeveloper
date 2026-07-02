<?php
declare(strict_types=1);
/**
 * ExtoArts - Email Verification Token Handler
 *
 * Handles GET /verify?token=<64-hex-chars>
 * Validates the token, marks the account as verified, logs the user in,
 * and redirects to /dashboard.
 *
 * Error cases: expired token, invalid/missing token, already verified.
 * Never shows a blank page - always renders a clear recovery UI.
 */
require_once __DIR__ . '/../includes/auth.php';
secure_headers(false);

// If already logged in and verified - go straight to dashboard
$current = auth_user();
if ($current && ($current['email_verified'] ?? true) !== false) {
    header('Location: /dashboard');
    exit;
}

$token = trim($_GET['token'] ?? '');

// No token provided
if (!$token) {
    $err_type  = 'missing';
    $err_email = '';
    goto RENDER_ERROR;
}

// Validate and consume the token
$result = consume_email_verify_token($token);

if ($result === null) {
    // Token not found in DB (invalid, already used, or typo)
    $err_type  = 'invalid';
    $err_email = '';
    goto RENDER_ERROR;
}

if (!empty($result['__expired'])) {
    // Token found but past the 24-hour expiry window
    $err_type  = 'expired';
    $err_email = $result['email'] ?? '';
    goto RENDER_ERROR;
}

// ── SUCCESS - log the user in and redirect to dashboard ──────────────────────
auth_login_user($result);
session_write_close();

$is_editor = ($result['role'] ?? '') === 'editor';
$redirect  = $is_editor ? '/apply?notice=registered' : '/dashboard?notice=welcome';
header('Location: ' . $redirect);
exit;

// ── Error rendering - only reached via goto ───────────────────────────────────
RENDER_ERROR:

$is_prod = in_array(
    strtolower(explode(':', $_SERVER['HTTP_HOST'] ?? '')[0]),
    ['extoarts.in', 'www.extoarts.in'],
    true
);

$err_messages = [
    'missing' => [
        'title' => 'No verification token',
        'body'  => 'This link appears to be incomplete. Please use the link from your verification email, or request a new one below.',
        'icon'  => 'ti-link-off',
        'color' => 'cyan',
    ],
    'invalid' => [
        'title' => 'Link already used or invalid',
        'body'  => 'This verification link has already been used, or it is not valid. If your account is verified, you can sign in. Otherwise, request a new link below.',
        'icon'  => 'ti-ban',
        'color' => 'red',
    ],
    'expired' => [
        'title' => 'Verification link expired',
        'body'  => 'This link is more than 24 hours old and has expired. Request a fresh link below - it only takes a second.',
        'icon'  => 'ti-clock',
        'color' => 'amber',
    ],
];
$msg = $err_messages[$err_type] ?? $err_messages['invalid'];
?>
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Verification Error | ExtoArts</title>
<meta name="robots" content="noindex, nofollow">
<link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<style>@font-face{font-family:'Plus Jakarta Sans';font-style:normal;font-weight:400 900;font-display:swap;src:url('/css/fonts/plus-jakarta-sans.woff2') format('woff2');}</style>
<link rel="preload" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.44.0/dist/fonts/tabler-icons.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.44.0/dist/tabler-icons.min.css">
<style>
*{margin:0;padding:0;box-sizing:border-box;}
:root{
    --bg:#07070c;--primary:#00c4f0;--border:rgba(255,255,255,0.08);
    --text-main:#f5f5f7;--text-muted:#6b7280;--red:#ef4444;--amber:#f59e0b;
    --easing:cubic-bezier(0.16,1,0.3,1);
}
body{background:var(--bg);color:var(--text-main);font-family:'Plus Jakarta Sans',sans-serif;
    min-height:100vh;display:flex;flex-direction:column;align-items:center;
    justify-content:center;padding:24px 20px 60px;position:relative;overflow-x:hidden;}
.bg-orb{position:fixed;border-radius:50%;filter:blur(130px);pointer-events:none;z-index:0;animation:orbFloat 8s ease-in-out infinite;}
.bg-orb-1{width:600px;height:600px;background:rgba(239,68,68,0.04);top:-150px;left:-150px;}
.bg-orb-2{width:500px;height:500px;background:rgba(245,158,11,0.03);bottom:-100px;right:-100px;animation-delay:-4s;}
@keyframes orbFloat{0%,100%{transform:translateY(0) scale(1);}50%{transform:translateY(-20px) scale(1.05);}}
.wrap{position:relative;z-index:1;width:100%;max-width:420px;}

.logo-header{text-align:center;margin-bottom:22px;}
.logo-mark-wrap{width:60px;height:60px;border-radius:15px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px;border:1px solid rgba(34,211,238,0.22);background:rgba(34,211,238,0.04);box-shadow:0 0 24px rgba(34,211,238,0.07);}
.logo-mark-wrap svg{width:40px;height:40px;}
.logo-header h2{font-size:1.4rem;font-weight:900;letter-spacing:-0.5px;}

.card{background:rgba(255,255,255,0.025);border:1px solid var(--border);border-radius:24px;
    padding:34px 30px;backdrop-filter:blur(20px);
    box-shadow:0 0 0 1px rgba(255,255,255,0.02),0 24px 64px rgba(0,0,0,0.4);text-align:center;}

.err-icon{width:76px;height:76px;border-radius:50%;display:inline-flex;
    align-items:center;justify-content:center;margin-bottom:22px;animation:errShake .6s var(--easing) both;}
.err-icon-cyan{background:rgba(0,196,240,0.1);border:1px solid rgba(0,196,240,0.2);}
.err-icon-red{background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.2);}
.err-icon-amber{background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.2);}
.err-icon i{font-size:1.8rem;}
.err-icon-cyan i{color:var(--primary);}
.err-icon-red i{color:var(--red);}
.err-icon-amber i{color:var(--amber);}
@keyframes errShake{0%,100%{transform:translateX(0);}20%,60%{transform:translateX(-4px);}40%,80%{transform:translateX(4px);}}

.err-title{font-size:1.25rem;font-weight:900;letter-spacing:-0.3px;margin-bottom:10px;}
.err-body{font-size:0.87rem;color:var(--text-muted);line-height:1.65;margin-bottom:28px;}

.btn{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;
    padding:14px;border:none;border-radius:13px;cursor:pointer;font-family:inherit;
    font-size:0.91rem;font-weight:800;text-decoration:none;transition:all .25s var(--easing);margin-bottom:10px;}
.btn-primary{background:var(--primary);color:#000;}
.btn-primary:hover{filter:brightness(1.1);transform:translateY(-1px);}
.btn-ghost{background:rgba(255,255,255,0.04);border:1px solid var(--border);color:var(--text-muted);font-size:0.85rem;}
.btn-ghost:hover{background:rgba(255,255,255,0.07);color:var(--text-main);}
</style>
</head>
<body>
<div class="bg-orb bg-orb-1"></div>
<div class="bg-orb bg-orb-2"></div>

<div class="wrap">
    <div class="logo-header">
        <div class="logo-mark-wrap">
            <img src="/favicon-192.png" alt="ExtoArts logo" style="width:40px;height:40px;border-radius:10px;display:block;" onerror="this.onerror=null;this.outerHTML=`<svg width='40' height='40' viewBox='0 0 36 36' fill='none' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'><rect width='36' height='36' rx='9' fill='#0a0a14'/><path d='M10.5 10.5V25.5M10.5 10.5H24M10.5 18H20.5M10.5 25.5H24' stroke='#22d3ee' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/></svg>`">
        </div>
        <h2>ExtoArts</h2>
    </div>

    <div class="card">
        <div class="err-icon err-icon-<?php echo $msg['color']; ?>">
            <i class="ti <?php echo $msg['icon']; ?>"></i>
        </div>

        <div class="err-title"><?php echo htmlspecialchars($msg['title'], ENT_QUOTES, 'UTF-8'); ?></div>
        <div class="err-body"><?php echo htmlspecialchars($msg['body'], ENT_QUOTES, 'UTF-8'); ?></div>

        <!-- Primary action: request a new verification link -->
        <a href="/verify-email<?php echo $err_email ? '?email=' . rawurlencode($err_email) : ''; ?>"
           class="btn btn-primary">
            <i class="ti ti-send"></i> Get a New Verification Link
        </a>

        <!-- Secondary: try signing in (maybe they already verified on another device) -->
        <a href="/login" class="btn btn-ghost">
            <i class="ti ti-login-2"></i> Sign In
        </a>
    </div>
</div>
</body>
</html>
