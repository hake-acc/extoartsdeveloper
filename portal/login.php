<?php
declare(strict_types=1);
require_once __DIR__ . '/../includes/auth.php';
secure_headers(false);

if (auth_user()) {
    header('Location: /dashboard');
    exit;
}

$error   = '';
$notice  = '';
$next = preg_replace('/[^\/\w\-\?=&%]/', '', $_GET['next'] ?? '/dashboard');
if (!str_starts_with($next, '/') || str_starts_with($next, '//')) $next = '/dashboard';

// Pre-fill email when coming from register or OAuth error (store RAW - escape only at output)
$prefill_email = trim($_GET['email'] ?? '');

if (isset($_GET['registered'])) {
    if (isset($_GET['verify'])) {
        $prefill_for_msg = $prefill_email ? ' to <strong>' . htmlspecialchars($prefill_email, ENT_QUOTES, 'UTF-8') . '</strong>' : '';
        $notice = 'Account created! Check your inbox' . $prefill_for_msg . ' and click the confirmation link before signing in.';
    } else {
        $notice = 'Your account has been created. Please sign in to get started.';
    }
} elseif (isset($_GET['expired'])) {
    $notice = 'Your session expired. Please sign in again.';
} elseif (isset($_GET['oauth_error'])) {
    $rawOAuthErr = urldecode($_GET['oauth_error']);
    if (str_starts_with($rawOAuthErr, '[NO_ACCOUNT]')) {
        // User signed in with Google/Discord but has no ExtoArts account yet.
        // Show a friendly register prompt instead of a confusing URL error.
        $notice = 'No ExtoArts account is linked to that Google/Discord email. Please <a href="/register">create a free account</a> first, then sign in.';
    } else {
        $error = $rawOAuthErr;
    }
} elseif (isset($_GET['next']) && !isset($_GET['registered'])) {
    $notice = 'Please sign in to continue.';
}

$role  = (isset($_GET['role']) && $_GET['role'] === 'editor') ? 'editor' : 'client';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!csrf_verify()) {
        $error = 'Security check failed. Please refresh and try again.';
        error_log('[ExtoArts/login] CSRF mismatch from IP ' . ($_SERVER['REMOTE_ADDR'] ?? 'unknown'));
    } else {
        $ip       = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        $username = trim($_POST['username'] ?? '');
        $password = $_POST['password'] ?? '';
        $ts_token = $_POST['cf-turnstile-response'] ?? '';

        if (!turnstile_verify($ts_token)) {
            $error = 'Human verification failed. Please try again.';
            error_log('[ExtoArts/login] Turnstile failed from IP ' . $ip);
        } elseif (!rate_limit_check('login_' . $ip, 8, 600)) {
            $error = 'Too many failed attempts. Please wait 10 minutes.';
        } elseif (!$username || !$password) {
            $error = 'Username and password are required.';
        } else {
            // Check admin credentials first
            if ($username === ADMIN_USERNAME && password_verify($password, ADMIN_PASSWORD_HASH)) {
                rate_limit_clear('login_' . $ip);
                auth_login_user([
                    'id' => 0, 'username' => ADMIN_USERNAME, 'name' => 'Admin',
                    'email' => 'admin@extoarts.in', 'avatar' => '',
                    'role' => 'admin', 'status' => 'active'
                ]);
                session_write_close();
                header('Location: /dashboard');
                exit;
            }

            $user = login_user_pw($username, $password);
            if ($user === null) {
                rate_limit_record('login_' . $ip);
                if (!empty($_SESSION['__db_error'])) {
                    $dberr = $_SESSION['__db_error'];
                    unset($_SESSION['__db_error']);
                    error_log('[ExtoArts/login] DB error for user lookup: ' . $dberr);
                    $error = 'Login temporarily unavailable. Please try again shortly.';
                } else {
                    error_log('[ExtoArts/login] Failed login attempt for username: ' . $username . ' from IP: ' . $ip);
                    $error = 'Invalid username or password.';
                }
            } elseif (!empty($user['__banned'])) {
                error_log('[ExtoArts/login] Banned account attempted login: ' . $username);
                $error = 'Account suspended. Contact us on Discord.';
            } elseif (!empty($user['__unverified'])) {
                session_write_close();
                header('Location: /verify-email?email=' . rawurlencode($user['email'] ?? '') . '&notice=unverified');
                exit;
            } else {
                rate_limit_clear('login_' . $ip);
                auth_login_user($user);
                session_write_close();
                header('Location: ' . $next);
                exit;
            }
        }
    }
}
// Carry over any DB error from a previous request stored in session
if (empty($error) && !empty($_SESSION['__db_error'])) {
    error_log('[ExtoArts/login] Prev DB error: ' . $_SESSION['__db_error']);
    unset($_SESSION['__db_error']);
    $error = 'Login temporarily unavailable. Please try again.';
}
?>
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Sign In | ExtoArts</title>
<meta name="robots" content="noindex, nofollow">
<meta name="color-scheme" content="dark">
<link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="stylesheet" href="/css/transitions.min.css?v=<?= filemtime(__DIR__.'/../css/transitions.min.css') ?>">
<script>(function(){try{var d=sessionStorage.getItem('ea_trans_dir');if(d){document.documentElement.dataset.eaTrans=d;sessionStorage.removeItem('ea_trans_dir');}}catch(e){}}());</script>
<style>@font-face{font-family:'Plus Jakarta Sans';font-style:normal;font-weight:400 900;font-display:swap;src:url('/css/fonts/plus-jakarta-sans.woff2') format('woff2');}</style>
<link rel="preload" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.44.0/dist/fonts/tabler-icons.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.44.0/dist/tabler-icons.min.css">
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
:root{
    --bg:#07070c;--surface:rgba(255,255,255,0.04);--primary:#00c4f0;
    --primary-glow:rgba(0,196,240,0.12);--border:rgba(255,255,255,0.08);
    --text-main:#f5f5f7;--text-muted:#6b7280;--red:#ef4444;
    --easing:cubic-bezier(0.16,1,0.3,1);
}
body{background:var(--bg);color:var(--text-main);font-family:'Plus Jakarta Sans',sans-serif;
    min-height:100vh;display:flex;flex-direction:column;align-items:center;
    justify-content:center;padding:20px;position:relative;overflow-x:hidden;}
.bg-orb{position:fixed;border-radius:50%;filter:blur(130px);pointer-events:none;z-index:0;animation:orbFloat 8s ease-in-out infinite;}
.bg-orb-1{width:600px;height:600px;background:rgba(0,196,240,0.05);top:-150px;left:-150px;}
.bg-orb-2{width:500px;height:500px;background:rgba(0,196,240,0.04);bottom:-100px;right:-100px;animation-delay:-4s;}
@keyframes orbFloat{0%,100%{transform:translateY(0) scale(1);}50%{transform:translateY(-20px) scale(1.05);}}
.wrap{position:relative;z-index:1;width:100%;max-width:430px;}
.login-logo{text-align:center;margin-bottom:32px;}
.logo-mark-wrap{width:68px;height:68px;border-radius:17px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;position:relative;border:1px solid rgba(34,211,238,0.22);background:rgba(34,211,238,0.04);box-shadow:0 0 28px rgba(34,211,238,0.08);animation:ringPulse 3.5s ease-in-out infinite;}
.logo-mark-wrap svg{width:46px;height:46px;}
@keyframes ringPulse{0%,100%{box-shadow:0 0 0 0 rgba(34,211,238,0.15);}50%{box-shadow:0 0 0 10px rgba(34,211,238,0);}}
.login-logo h1{font-size:1.8rem;font-weight:900;letter-spacing:-1px;}
.login-logo p{font-size:0.88rem;color:var(--text-muted);margin-top:6px;}
.card{background:rgba(255,255,255,0.025);border:1px solid var(--border);border-radius:24px;
    padding:36px 32px;backdrop-filter:blur(20px);
    box-shadow:0 0 0 1px rgba(255,255,255,0.02),0 24px 64px rgba(0,0,0,0.4);}
.role-tabs{display:flex;gap:0;margin-bottom:28px;background:rgba(255,255,255,0.03);
    border:1px solid var(--border);border-radius:14px;overflow:hidden;padding:4px;}
.role-tab{flex:1;padding:10px 8px;text-align:center;font-size:0.85rem;font-weight:700;
    cursor:pointer;border:none;background:transparent;color:var(--text-muted);
    transition:all 0.25s var(--easing);letter-spacing:0.5px;border-radius:10px;font-family:inherit;}
.role-tab.active{background:rgba(0,196,240,0.15);color:var(--primary);border:1px solid rgba(0,196,240,0.25);}
.role-tab:hover:not(.active){background:rgba(255,255,255,0.04);color:var(--text-main);}
.form-group{margin-bottom:18px;}
.form-group label{display:block;font-size:0.82rem;font-weight:700;margin-bottom:7px;color:var(--text-main);}
.input-wrap{position:relative;}
.input-wrap i.icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);
    color:var(--text-muted);font-size:0.85rem;pointer-events:none;
    animation:iconDrift 3s ease-in-out infinite;}
@keyframes iconDrift{0%,100%{color:var(--text-muted);filter:drop-shadow(0 0 0px rgba(0,196,240,0));}50%{color:rgba(0,196,240,0.55);filter:drop-shadow(0 0 5px rgba(0,196,240,0.35));}}
input[type=text],input[type=password]{
    width:100%;background:rgba(255,255,255,0.05);border:1px solid var(--border);
    border-radius:12px;padding:13px 15px 13px 40px;color:var(--text-main);
    font-size:0.93rem;font-family:inherit;outline:none;transition:border-color 0.2s;}
input:focus{border-color:var(--primary);}
.toggle-pw{position:absolute;right:14px;top:50%;transform:translateY(-50%);
    background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:0.88rem;padding:0;}
.toggle-pw:hover{color:var(--primary);}
.turnstile-wrap{margin-bottom:18px;display:flex;justify-content:center;}
.notice-error{padding:13px 18px;border-radius:12px;font-size:0.87rem;line-height:1.55;
    margin-bottom:20px;display:flex;gap:10px;align-items:flex-start;
    background:rgba(239,68,68,0.07);border:1px solid rgba(239,68,68,0.2);color:#fca5a5;}
.notice-success{padding:13px 18px;border-radius:12px;font-size:0.87rem;line-height:1.55;
    margin-bottom:20px;display:flex;gap:10px;align-items:flex-start;
    background:rgba(0,196,240,0.07);border:1px solid rgba(0,196,240,0.25);color:#a5f3fc;}
.btn-oauth{width:100%;padding:13px 15px;font-weight:700;font-size:0.9rem;border-radius:14px;
    cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;
    gap:10px;transition:all 0.2s ease;letter-spacing:0.1px;border:none;}
.btn-google{background:#fff;color:#3c4043;border:1px solid rgba(255,255,255,0.18);}
.btn-google:hover{background:#f1f3f4;box-shadow:0 4px 18px rgba(0,0,0,0.18);transform:translateY(-1px);}
.btn-discord{background:#5865F2;color:#fff;margin-top:10px;}
.btn-discord:hover{background:#4752c4;box-shadow:0 4px 18px rgba(88,101,242,0.4);transform:translateY(-1px);}
.btn-oauth:active{transform:translateY(0);}
.btn-oauth:disabled{opacity:0.6;cursor:not-allowed;transform:none;}
.btn-submit{width:100%;padding:15px;background:var(--primary);color:#000;font-weight:800;
    font-size:0.95rem;border:none;border-radius:14px;cursor:pointer;font-family:inherit;
    transition:all 0.25s var(--easing);display:flex;align-items:center;justify-content:center;gap:10px;}
.btn-submit:hover{background:#22d3ee;transform:translateY(-2px);box-shadow:0 12px 32px var(--primary-glow);}
.trust-row{display:flex;gap:8px;margin-top:14px;flex-wrap:wrap;}
.trust-badge{display:flex;align-items:center;gap:5px;font-size:0.72rem;color:var(--text-muted);
    background:rgba(255,255,255,0.03);border:1px solid var(--border);border-radius:50px;padding:4px 10px;}
.trust-badge i{font-size:0.65rem;color:#22c55e;}
.divider{display:flex;align-items:center;gap:12px;margin:20px 0;color:var(--text-muted);font-size:0.78rem;}
.divider::before,.divider::after{content:'';flex:1;height:1px;background:var(--border);}
.register-link{text-align:center;font-size:0.85rem;color:var(--text-muted);}
.register-link a{color:var(--primary);text-decoration:none;font-weight:700;}
.register-link a:hover{text-decoration:underline;}
.tos-text{font-size:0.78rem;color:var(--text-muted);line-height:1.6;text-align:center;
    margin-top:18px;padding-top:16px;border-top:1px solid var(--border);}
.tos-text a{color:rgba(0,196,240,0.8);}
.tos-text a:hover{color:var(--primary);}
.back-link{text-align:center;margin-top:20px;}
.back-link a{color:var(--text-muted);font-size:0.85rem;text-decoration:none;
    display:inline-flex;align-items:center;gap:6px;transition:color 0.2s;}
.back-link a:hover{color:var(--primary);}
.forgot-link{font-size:0.78rem;color:var(--text-muted);text-align:right;margin-top:-10px;margin-bottom:18px;}
.forgot-link a{color:rgba(0,196,240,0.7);text-decoration:none;}
.forgot-link a:hover{color:var(--primary);}
@media(max-width:480px){.card{padding:28px 22px;}}
</style>
</head>
<body>
<!-- Invisible preflight: lets the host's bot-protection challenge run and set
     its __test cookie before the login AJAX fires. Iframes execute inline JS
     that fetch() cannot, so the challenge completes silently. -->
<iframe id="ea-preflight" src="/api/health-check"
        style="display:none;width:0;height:0;border:0;" aria-hidden="true"
        tabindex="-1" title=""></iframe>

<div class="bg-orb bg-orb-1"></div>
<div class="bg-orb bg-orb-2"></div>

<div class="wrap">
    <div class="login-logo">
        <div class="logo-mark-wrap">
            <img src="/favicon-192.png" alt="ExtoArts logo" style="width:46px;height:46px;border-radius:11px;display:block;" onerror="this.onerror=null;this.outerHTML=`<svg width='46' height='46' viewBox='0 0 36 36' fill='none' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'><rect width='36' height='36' rx='9' fill='#0a0a14'/><path d='M10.5 10.5V25.5M10.5 10.5H24M10.5 18H20.5M10.5 25.5H24' stroke='#22d3ee' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/></svg>`">
        </div>
        <h1>ExtoArts</h1>
        <p>Sign in to your workspace</p>
        <div style="margin-top:18px;"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color:var(--primary);display:block;margin:0 auto;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg></div>
    </div>

    <div class="card">
        <?php if ($notice): ?>
        <div class="notice-success">
            <i class="ti ti-info-circle" style="flex-shrink:0;"></i>
            <span><?php echo $notice; ?></span>
        </div>
        <?php endif; ?>
        <?php if ($error): ?>
        <div class="notice-error" style="flex-direction:column;align-items:flex-start;">
            <div style="display:flex;gap:10px;align-items:center;"><i class="ti ti-alert-circle" style="flex-shrink:0;"></i><strong>Login Error</strong></div>
            <pre style="margin-top:8px;font-size:0.78rem;white-space:pre-wrap;word-break:break-all;font-family:monospace;background:rgba(0,0,0,0.3);padding:8px;border-radius:6px;width:100%;color:#fca5a5;"><?php echo htmlspecialchars($error); ?></pre>
        </div>
        <?php endif; ?>
        <div class="role-tabs">
            <button class="role-tab <?php echo $role==='client'?'active':''; ?>" onclick="setRole('client')">
                <i class="ti ti-user" style="margin-right:6px;"></i>Client
            </button>
            <button class="role-tab <?php echo $role==='editor'?'active':''; ?>" onclick="setRole('editor')">
                <i class="ti ti-brush" style="margin-right:6px;"></i>Editor
            </button>
        </div>

        <form method="POST" id="loginForm" autocomplete="on">
            <?php echo csrf_field(); ?>
            <input type="hidden" name="role" id="roleInput" value="<?php echo htmlspecialchars($role); ?>">

            <div class="form-group">
                <label for="username">Username or Email</label>
                <div class="input-wrap">
                    <i class="ti ti-user icon"></i>
                    <input type="text" name="username" id="username" autocomplete="username"
                        value="<?php echo htmlspecialchars($_POST['username'] ?? $prefill_email); ?>"
                        placeholder="Your username or email" required>
                </div>
            </div>

            <div class="form-group">
                <label for="password">Password</label>
                <div class="input-wrap">
                    <i class="ti ti-lock icon"></i>
                    <input type="password" name="password" id="password" autocomplete="current-password"
                        placeholder="Your password" required>
                    <button type="button" class="toggle-pw" onclick="togglePw()" tabindex="-1">
                        <i class="ti ti-eye" id="pwIcon"></i>
                    </button>
                </div>
            </div>

            <div class="forgot-link"><a href="/contact">Forgot password? Contact us</a></div>

            <div class="turnstile-wrap" id="turnstile-wrap">
                <?php
                $prodHost = in_array($_SERVER['HTTP_HOST'] ?? '', ['extoarts.in', 'www.extoarts.in'], true);
                if ($prodHost): ?>
                <div class="cf-turnstile"
                    data-sitekey="<?php echo htmlspecialchars(TURNSTILE_SITE_KEY); ?>"
                    data-theme="dark"
                    data-size="normal"></div>
                <?php else: ?>
                <div style="font-size:0.75rem;color:var(--text-muted);padding:6px 10px;border:1px dashed rgba(255,255,255,0.1);border-radius:8px;">
                    Turnstile bypassed (dev environment - not extoarts.in)
                </div>
                <?php endif; ?>
            </div>

            <button type="submit" class="btn-submit">
                <i class="ti ti-login"></i>Sign In
            </button>
        </form>

        <div class="trust-row">
            <span class="trust-badge"><i class="ti ti-circle-check"></i>bcrypt encrypted</span>
            <span class="trust-badge"><i class="ti ti-circle-check"></i>CSRF protected</span>
            <span class="trust-badge"><i class="ti ti-circle-check"></i>Human verified</span>
        </div>

        <div class="divider">or continue with</div>

        <div id="oauth-error" class="notice-error" style="display:none;margin-bottom:12px;flex-direction:column;align-items:flex-start;">
            <div style="display:flex;gap:10px;align-items:center;"><i class="ti ti-alert-circle" style="flex-shrink:0;"></i><strong>OAuth Error</strong></div>
            <pre id="oauth-error-msg" style="margin-top:8px;font-size:0.75rem;white-space:pre-wrap;word-break:break-all;font-family:monospace;background:rgba(0,0,0,0.3);padding:8px;border-radius:6px;width:100%;color:#fca5a5;"></pre>
        </div>

        <button id="btn-google" class="btn-oauth btn-google">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
        </button>

        <button id="btn-discord" class="btn-oauth btn-discord">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path fill="#fff" d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            Continue with Discord
        </button>

        <div class="divider"></div>

        <div class="register-link">
            Don't have an account? <a href="/register?role=<?php echo $role; ?>">Create one free</a>
        </div>

        <p class="tos-text">
            By signing in you agree to our <a href="/tos">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.
        </p>
    </div>

    <div class="back-link">
        <a href="/"><i class="ti ti-arrow-left"></i>Back to ExtoArts</a>
    </div>
</div>

<script>
function setRole(r) {
    document.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
    document.querySelector('.role-tab:' + (r==='client'?'first-child':'last-child')).classList.add('active');
    document.getElementById('roleInput').value = r;
    const url = new URL(window.location);
    url.searchParams.set('role', r);
    window.history.replaceState({}, '', url);
}
function togglePw() {
    const inp = document.getElementById('password');
    const ico = document.getElementById('pwIcon');
    if (inp.type === 'password') { inp.type = 'text'; ico.className = 'ti ti-eye-off icon'; }
    else { inp.type = 'password'; ico.className = 'ti ti-eye icon'; }
}
document.addEventListener('DOMContentLoaded', () => {
    const u = document.getElementById('username');
    const p = document.getElementById('password');
    if (u && u.value.trim()) {
        // Email pre-filled (coming from register) - move focus to password
        if (p) p.focus();
    } else if (u) {
        u.focus();
    }
});
</script>
<script type="module">
import { supabase, signInWithGoogle, signInWithDiscord } from '/src/supabaseClient.js';

// ── OAuth buttons ─────────────────────────────────────────────────────────────
function oauthBtn(id, fn) {
    const btn = document.getElementById(id);
    if (!btn) return;
    const orig = btn.innerHTML;
    btn.addEventListener('click', async () => {
        document.getElementById('oauth-error').style.display = 'none';
        btn.disabled = true;
        btn.innerHTML = '<i class="ti ti-loader-2 ti-spin"></i> Redirecting...';
        const error = await fn();
        if (error) {
            // Log full details to console for devs; show concise message to users
            console.warn('[SUPABASE_OAUTH_ERROR]', {
                status: error.status, name: error.name, message: error.message,
                cause: error.cause, host: window.location.origin,
                redirectTo: window.location.origin + '/auth/callback',
            });
            const userMsg = (error.message && !error.message.toLowerCase().includes('fetch'))
                ? error.message
                : 'Could not connect to the sign-in provider. Please try again or use email login.';
            document.getElementById('oauth-error-msg').textContent = userMsg;
            document.getElementById('oauth-error').style.display = 'flex';
            btn.disabled = false;
            btn.innerHTML = orig;
        }
    });
}
oauthBtn('btn-google',  () => signInWithGoogle('oauth-login'));
oauthBtn('btn-discord', () => signInWithDiscord('oauth-login'));

// ── Preflight: resolve once the bot-protection iframe has a chance to complete ──
const preflightReady = new Promise(resolve => {
    const iframe = document.getElementById('ea-preflight');
    if (!iframe) { resolve(); return; }
    // Resolve on load/error or after 3s max so login is never blocked
    iframe.addEventListener('load',  () => setTimeout(resolve, 80));
    iframe.addEventListener('error', resolve);
    setTimeout(resolve, 3000);
});

// ── Email/password login via Supabase (with PHP fallback for legacy accounts) ──
const loginForm  = document.getElementById('loginForm');
const submitBtn  = loginForm?.querySelector('[type="submit"]');
const ORIG_BTN   = submitBtn?.innerHTML;
let   phpFallback = false;   // when true, form submits normally to PHP

if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
}

async function handleLogin(e) {
    if (phpFallback) return; // PHP path: let the form POST normally

    const identifier = document.getElementById('username')?.value?.trim() || '';
    const password   = document.getElementById('password')?.value || '';

    // Only intercept for email-style inputs; username inputs go straight to PHP
    if (!identifier.includes('@')) return;
    if (!password) return;

    e.preventDefault();
    setLoading(true);

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: identifier,
            password,
        });

        if (error) {
            const msg = (error.message || '').toLowerCase();

            if (msg.includes('confirm') || msg.includes('verified') || msg.includes('not confirmed')) {
                // Email address not yet confirmed
                showInlineError(
                    'Please confirm your email address before signing in. ' +
                    'Check your inbox for the verification link we sent when you registered.'
                );
                setLoading(false);
                return;
            }

            // Wrong password, user not found, or any other error
            // Fall back to PHP so legacy (bcrypt) accounts still work
            phpFallback = true;
            setLoading(false);
            loginForm.submit();
            return;
        }

        if (data?.session) {
            // Bridge Supabase session to PHP session
            const csrf = loginForm.querySelector('[name="csrf_token"]')?.value || '';
            const next = new URLSearchParams(window.location.search).get('next') || '/dashboard';

            // Wait for the preflight iframe so the host's bot-protection cookie
            // (__test) is set before we POST — avoids the AES challenge interception
            await preflightReady;

            async function callAuthSession() {
                const r = await fetch('/api/auth-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf },
                    body: JSON.stringify({ access_token: data.session.access_token, provider: 'email', flow: 'email-login' }),
                    credentials: 'same-origin',
                });
                const text = await r.text();
                try {
                    return { res: r, bd: JSON.parse(text) };
                } catch (_) {
                    // Non-JSON response — host bot-protection challenge was returned
                    // Log for devs, surface friendly error to user
                    console.warn('[AUTH_SESSION_BRIDGE] Server returned non-JSON (HTTP ' + r.status + ')\n' +
                        'flow: email-login\nfull response: ' + text.slice(0, 600));
                    return { res: r, bd: null };
                }
            }

            let { res: br, bd } = await callAuthSession();

            // If bot-protection challenge was returned, retry once after a short pause
            if (!bd) {
                await new Promise(r => setTimeout(r, 1200));
                ({ res: br, bd } = await callAuthSession());
            }

            if (!bd) {
                showInlineError('Our server briefly blocked the sign-in request. Please try again - it usually works on the second attempt.');
                setLoading(false);
                supabase.auth.signOut().catch(() => {});
                return;
            }

            if (bd.ok) {
                window.location.href = bd.redirect || next;
            } else if (bd.no_account) {
                // Signed in with Supabase but no ExtoArts account — send to register
                const regEmail = data.session?.user?.email || '';
                window.location.href = '/register?notice=oauth_signup'
                    + (regEmail ? '&email=' + encodeURIComponent(regEmail) : '');
            } else {
                showInlineError(bd.error || 'Sign-in failed. Please try again.');
                setLoading(false);
                supabase.auth.signOut().catch(() => {});
            }
            return;
        }

        // No session and no error - fall through to PHP
        phpFallback = true;
        setLoading(false);
        loginForm.submit();

    } catch (networkErr) {
        phpFallback = true;
        setLoading(false);
        loginForm.submit();
    }
}

function setLoading(on) {
    if (!submitBtn) return;
    submitBtn.disabled = on;
    submitBtn.innerHTML = on
        ? '<i class="ti ti-loader-2 ti-spin"></i> Signing in...'
        : ORIG_BTN;
}

function showInlineError(msg) {
    let box = document.querySelector('.notice-error');
    if (!box) {
        box = document.createElement('div');
        box.className = 'notice-error';
        loginForm.parentNode.insertBefore(box, loginForm);
    }
    box.innerHTML =
        '<i class="ti ti-alert-circle" style="flex-shrink:0;margin-top:2px;"></i>' +
        '<span>' + msg.replace(/</g, '&lt;') + '</span>';
    box.style.display = 'flex';
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
</script>
<script src="/js/transitions.min.js?v=<?= filemtime(__DIR__.'/../js/transitions.min.js') ?>" defer></script>
</body>
</html>
