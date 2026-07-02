<?php
declare(strict_types=1);
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/notify.php';
secure_headers(false);

if (auth_user()) {
    header('Location: /dashboard');
    exit;
}

$errors  = [];
$notice  = '';
$success = false;
$role    = (isset($_GET['role']) && $_GET['role'] === 'editor') ? 'editor' : 'client';

// Pre-fill email from OAuth redirect (user tried to sign in with Google/Discord
// but has no account — we redirect them here to register).
$prefill_email = trim($_GET['email'] ?? '');
if (isset($_GET['notice']) && $_GET['notice'] === 'oauth_signup') {
    $notice = 'Your Google/Discord account is not linked to an ExtoArts account yet. Create one below'
        . ($prefill_email ? ' - your email has been pre-filled.' : '.')
        . ' Once registered, you can sign in with Google or Discord.';
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!csrf_verify()) {
        $errors[] = 'Security check failed. Please refresh and try again.';
    } else {
        $ip       = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        $username = trim($_POST['username'] ?? '');
        $email    = trim($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';
        $confirm  = $_POST['confirm'] ?? '';
        $role     = (isset($_POST['role']) && $_POST['role'] === 'editor') ? 'editor' : 'client';
        $ts_token = $_POST['cf-turnstile-response'] ?? '';
        $agreed   = isset($_POST['agreed_tos']);

        $honeypot = $_POST['website'] ?? '';
        if ($honeypot !== '') {
            // Bot filled the invisible honeypot field - silently discard
            header('Location: /verify-email?email=' . rawurlencode($email));
            exit;
        }

        if (!turnstile_verify($ts_token)) {
            $errors[] = 'Human verification failed. Please try again.';
        } elseif (!rate_limit_check('register_' . $ip, 5, 3600)) {
            $errors[] = 'Too many registration attempts from your location. Please wait an hour.';
        } else {
            if (!$username) $errors[] = 'Username is required.';
            elseif (strtolower($username) === 'admin' || strtolower($username) === 'xta_root' || strtolower($username) === 'extoarts_admin') $errors[] = 'That username is reserved. Please choose a different one.';
            elseif (strlen($username) < 3 || strlen($username) > 30) $errors[] = 'Username must be 3-30 characters.';
            elseif (!preg_match('/^[a-zA-Z0-9._\-]+$/', $username)) $errors[] = 'Username may only contain letters, numbers, dots, dashes, and underscores.';

            if (!$email) $errors[] = 'Email address is required.';
            elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Please enter a valid email address.';
            elseif (!preg_match('/@(gmail\.com|yahoo\.com|yahoo\.co\.[a-z]{2}|yahoo\.[a-z]{2,})$/i', $email)) $errors[] = 'Only Gmail (@gmail.com) and Yahoo (@yahoo.com) addresses are accepted.';

            if (!$password) $errors[] = 'Password is required.';
            elseif (strlen($password) < 8) $errors[] = 'Password must be at least 8 characters.';
            elseif ($password !== $confirm) $errors[] = 'Passwords do not match.';

            if (!$agreed) $errors[] = 'You must agree to the Terms of Service to register.';

            if (empty($errors)) {
                // Record every valid attempt (not just successes) so the limit
                // counts enumeration probes, not just successfully created accounts.
                rate_limit_record('register_' . $ip);
                $result = register_user($username, $email, $password, $role);
                if ($result['ok']) {
                    // Generate a verification token and send the email.
                    // In dev mode (no RESEND_API_KEY + non-production host) the URL
                    // is stored in $_SESSION['__dev_verify_url'] and shown on-screen.
                    $ev_token = generate_email_verify_token((int)$result['user']['id']);
                    $ev_url   = BASE_URL . '/verify?token=' . $ev_token;
                    require_once __DIR__ . '/../includes/email.php';
                    send_verification_email($email, $username, $ev_url);
                    notify_new_registration($username, $email, $role);
                    session_write_close();
                    // Redirect to the verification pending page - NOT the login page.
                    // The user must verify their email before accessing the dashboard.
                    $ev_role = $role === 'editor' ? '&role=editor' : '';
                    header('Location: /verify-email?email=' . rawurlencode($email) . $ev_role);
                    exit;
                } else {
                    $errors[] = $result['error'];
                }
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Create Account | ExtoArts</title>
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
    justify-content:center;padding:20px 20px 60px;position:relative;overflow-x:hidden;}
.bg-orb{position:fixed;border-radius:50%;filter:blur(130px);pointer-events:none;z-index:0;animation:orbFloat 8s ease-in-out infinite;}
.bg-orb-1{width:600px;height:600px;background:rgba(0,196,240,0.05);top:-150px;left:-150px;}
.bg-orb-2{width:500px;height:500px;background:rgba(0,196,240,0.04);bottom:-100px;right:-100px;animation-delay:-4s;}
@keyframes orbFloat{0%,100%{transform:translateY(0) scale(1);}50%{transform:translateY(-20px) scale(1.05);}}
.wrap{position:relative;z-index:1;width:100%;max-width:460px;}
.login-logo{text-align:center;margin-bottom:28px;}
.logo-mark-wrap{width:66px;height:66px;border-radius:16px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:14px;position:relative;border:1px solid rgba(34,211,238,0.22);background:rgba(34,211,238,0.04);box-shadow:0 0 28px rgba(34,211,238,0.08);animation:ringPulse 3.5s ease-in-out infinite;}
.logo-mark-wrap svg{width:44px;height:44px;}
@keyframes ringPulse{0%,100%{box-shadow:0 0 0 0 rgba(34,211,238,0.15);}50%{box-shadow:0 0 0 10px rgba(34,211,238,0);}}
.login-logo h1{font-size:1.7rem;font-weight:900;letter-spacing:-1px;}
.login-logo p{font-size:0.87rem;color:var(--text-muted);margin-top:6px;}
.card{background:rgba(255,255,255,0.025);border:1px solid var(--border);border-radius:24px;
    padding:36px 32px;backdrop-filter:blur(20px);
    box-shadow:0 0 0 1px rgba(255,255,255,0.02),0 24px 64px rgba(0,0,0,0.4);}
.role-tabs{display:flex;gap:0;margin-bottom:26px;background:rgba(255,255,255,0.03);
    border:1px solid var(--border);border-radius:14px;overflow:hidden;padding:4px;}
.role-tab{flex:1;padding:10px 8px;text-align:center;font-size:0.85rem;font-weight:700;
    cursor:pointer;border:none;background:transparent;color:var(--text-muted);
    transition:all 0.25s var(--easing);letter-spacing:0.5px;border-radius:10px;font-family:inherit;}
.role-tab.active{background:rgba(0,196,240,0.15);color:var(--primary);border:1px solid rgba(0,196,240,0.25);}
.role-tab:hover:not(.active){background:rgba(255,255,255,0.04);color:var(--text-main);}
.form-group{margin-bottom:16px;}
.form-group label{display:block;font-size:0.82rem;font-weight:700;margin-bottom:7px;}
.input-wrap{position:relative;}
.input-wrap i.icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);
    color:var(--text-muted);font-size:0.85rem;pointer-events:none;
    animation:iconDrift 3s ease-in-out infinite;}
@keyframes iconDrift{0%,100%{color:var(--text-muted);filter:drop-shadow(0 0 0px rgba(0,196,240,0));}50%{color:rgba(0,196,240,0.55);filter:drop-shadow(0 0 5px rgba(0,196,240,0.35));}}
input[type=text],input[type=email],input[type=password]{
    width:100%;background:rgba(255,255,255,0.05);border:1px solid var(--border);
    border-radius:12px;padding:13px 15px 13px 40px;color:var(--text-main);
    font-size:0.93rem;font-family:inherit;outline:none;transition:border-color 0.2s;}
input:focus{border-color:var(--primary);}
.toggle-pw{position:absolute;right:14px;top:50%;transform:translateY(-50%);
    background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:0.88rem;padding:0;}
.toggle-pw:hover{color:var(--primary);}
.pw-strength{height:4px;border-radius:4px;margin-top:6px;background:rgba(255,255,255,0.06);overflow:hidden;}
.pw-strength-bar{height:100%;border-radius:4px;transition:width 0.3s,background 0.3s;}
.pw-hint{font-size:0.72rem;color:var(--text-muted);margin-top:4px;}
.turnstile-wrap{margin-bottom:16px;display:flex;justify-content:center;}
.checkbox-row{display:flex;align-items:flex-start;gap:10px;margin-bottom:20px;}
.checkbox-row input[type=checkbox]{width:17px;height:17px;accent-color:var(--primary);flex-shrink:0;margin-top:2px;}
.checkbox-row label{font-size:0.82rem;color:var(--text-muted);line-height:1.6;}
.checkbox-row a{color:var(--primary);}
.notice-error{padding:13px 18px;border-radius:12px;font-size:0.87rem;line-height:1.55;
    margin-bottom:20px;display:flex;gap:10px;align-items:flex-start;
    background:rgba(239,68,68,0.07);border:1px solid rgba(239,68,68,0.2);color:#fca5a5;}
.notice-error ul{padding-left:16px;margin-top:6px;}
.btn-submit{width:100%;padding:15px;background:var(--primary);color:#000;font-weight:800;
    font-size:0.95rem;border:none;border-radius:14px;cursor:pointer;font-family:inherit;
    transition:all 0.25s var(--easing);display:flex;align-items:center;justify-content:center;gap:10px;}
.btn-submit:hover{background:#22d3ee;transform:translateY(-2px);box-shadow:0 12px 32px var(--primary-glow);}
.divider{display:flex;align-items:center;gap:12px;margin:18px 0;color:var(--text-muted);font-size:0.78rem;}
.divider::before,.divider::after{content:'';flex:1;height:1px;background:var(--border);}
.signin-link{text-align:center;font-size:0.85rem;color:var(--text-muted);}
.signin-link a{color:var(--primary);text-decoration:none;font-weight:700;}
.signin-link a:hover{text-decoration:underline;}
.editor-note{background:rgba(0,196,240,0.04);border:1px solid rgba(0,196,240,0.12);
    border-radius:12px;padding:14px 16px;font-size:0.82rem;color:var(--text-muted);
    line-height:1.65;margin-bottom:20px;}
.editor-note strong{color:var(--primary);}
.btn-oauth{width:100%;padding:13px 15px;font-weight:700;font-size:0.9rem;border-radius:14px;
    cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;
    gap:10px;transition:all 0.2s ease;letter-spacing:0.1px;border:none;}
.btn-google{background:#fff;color:#3c4043;border:1px solid rgba(255,255,255,0.18);}
.btn-google:hover{background:#f1f3f4;box-shadow:0 4px 18px rgba(0,0,0,0.18);transform:translateY(-1px);}
.btn-discord{background:#5865F2;color:#fff;margin-top:10px;}
.btn-discord:hover{background:#4752c4;box-shadow:0 4px 18px rgba(88,101,242,0.4);transform:translateY(-1px);}
.btn-oauth:active{transform:translateY(0);}
.btn-oauth:disabled{opacity:0.6;cursor:not-allowed;transform:none;}
.oauth-error{padding:11px 16px;border-radius:12px;font-size:0.85rem;line-height:1.5;
    margin-bottom:12px;display:none;gap:9px;align-items:flex-start;
    background:rgba(239,68,68,0.07);border:1px solid rgba(239,68,68,0.2);color:#fca5a5;}
.back-link{text-align:center;margin-top:18px;}
.back-link a{color:var(--text-muted);font-size:0.85rem;text-decoration:none;
    display:inline-flex;align-items:center;gap:6px;transition:color 0.2s;}
.back-link a:hover{color:var(--primary);}
@media(max-width:480px){.card{padding:28px 20px;}}
</style>
</head>
<body>
<div class="bg-orb bg-orb-1"></div>
<div class="bg-orb bg-orb-2"></div>

<div class="wrap">
    <div class="login-logo">
        <div class="logo-mark-wrap">
            <img src="/favicon-192.png" alt="ExtoArts logo" style="width:44px;height:44px;border-radius:11px;display:block;" onerror="this.onerror=null;this.outerHTML=`<svg width='44' height='44' viewBox='0 0 36 36' fill='none' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'><rect width='36' height='36' rx='9' fill='#0a0a14'/><path d='M10.5 10.5V25.5M10.5 10.5H24M10.5 18H20.5M10.5 25.5H24' stroke='#22d3ee' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/></svg>`">
        </div>
        <h1>Create Account</h1>
        <p>Join ExtoArts - it's free</p>
        <div style="margin-top:18px;"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color:var(--primary);display:block;margin:0 auto;"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg></div>
    </div>

    <div class="card">
        <?php if ($notice): ?>
        <div style="padding:13px 18px;border-radius:12px;font-size:0.87rem;line-height:1.55;margin-bottom:20px;display:flex;gap:10px;align-items:flex-start;background:rgba(0,196,240,0.07);border:1px solid rgba(0,196,240,0.25);color:#a5f3fc;">
            <i class="ti ti-info-circle" style="flex-shrink:0;margin-top:2px;"></i>
            <span><?php echo htmlspecialchars($notice); ?></span>
        </div>
        <?php endif; ?>
        <?php if (!empty($errors)): ?>
        <div class="notice-error">
            <i class="ti ti-alert-circle" style="flex-shrink:0;margin-top:2px;"></i>
            <div><?php if (count($errors) === 1): echo htmlspecialchars($errors[0]); else: ?><ul><?php foreach ($errors as $e): ?><li><?php echo htmlspecialchars($e); ?></li><?php endforeach; ?></ul><?php endif; ?></div>
        </div>
        <?php endif; ?>
        <div class="role-tabs">
            <button class="role-tab <?php echo $role==='client'?'active':''; ?>" onclick="setRole('client')">
                <i class="ti ti-user" style="margin-right:6px;"></i>Client
            </button>
            <button class="role-tab <?php echo $role==='editor'?'active':''; ?>" onclick="setRole('editor')">
                <i class="ti ti-brush" style="margin-right:6px;"></i>Editor / Artist
            </button>
        </div>

        <div id="editorNote" class="editor-note" style="<?php echo $role!=='editor'?'display:none;':''; ?>">
            <strong>Joining as an Editor:</strong> After registering you will complete a short application with your skills and portfolio. We review every application personally - typical response is 2-3 business days.
        </div>

        <form method="POST" id="regForm" autocomplete="on">
            <?php echo csrf_field(); ?>
            <input type="hidden" name="role" id="roleInput" value="<?php echo htmlspecialchars($role); ?>">
            <div style="display:none !important;position:absolute;left:-9999px;" aria-hidden="true">
                <input type="text" name="website" value="" tabindex="-1" autocomplete="off">
            </div>

            <div class="form-group">
                <label for="username">Username <span style="color:var(--primary);">*</span></label>
                <div class="input-wrap">
                    <i class="ti ti-at icon"></i>
                    <input type="text" name="username" id="username" autocomplete="username"
                        value="<?php echo htmlspecialchars($_POST['username'] ?? ''); ?>"
                        placeholder="e.g. coolcreator99" maxlength="30" required>
                </div>
            </div>

            <div class="form-group">
                <label for="email">Email Address <span style="color:var(--primary);">*</span></label>
                <div class="input-wrap">
                    <i class="ti ti-mail icon"></i>
                    <input type="email" name="email" id="email" autocomplete="email"
                        value="<?php echo htmlspecialchars($_POST['email'] ?? $prefill_email); ?>"
                        placeholder="you@gmail.com or you@yahoo.com" required>
                </div>
                <div style="font-size:0.73rem;color:var(--text-muted);margin-top:5px;padding-left:2px;">
                    <i class="ti ti-info-circle" style="color:rgba(0,196,240,0.5);margin-right:4px;"></i>Gmail and Yahoo addresses only
                </div>
            </div>

            <div class="form-group">
                <label for="password">Password <span style="color:var(--primary);">*</span></label>
                <div class="input-wrap">
                    <i class="ti ti-lock icon"></i>
                    <input type="password" name="password" id="password" autocomplete="new-password"
                        placeholder="Min 8 characters" required oninput="checkStrength(this.value)">
                    <button type="button" class="toggle-pw" onclick="togglePw('password','pwIcon1')" tabindex="-1">
                        <i class="ti ti-eye" id="pwIcon1"></i>
                    </button>
                </div>
                <div class="pw-strength"><div class="pw-strength-bar" id="strengthBar"></div></div>
                <div class="pw-hint" id="strengthHint">Enter a password</div>
            </div>

            <div class="form-group">
                <label for="confirm">Confirm Password <span style="color:var(--primary);">*</span></label>
                <div class="input-wrap">
                    <i class="ti ti-lock icon"></i>
                    <input type="password" name="confirm" id="confirm" autocomplete="new-password"
                        placeholder="Repeat your password" required>
                    <button type="button" class="toggle-pw" onclick="togglePw('confirm','pwIcon2')" tabindex="-1">
                        <i class="ti ti-eye" id="pwIcon2"></i>
                    </button>
                </div>
            </div>

            <div class="turnstile-wrap">
                <div class="cf-turnstile"
                    data-sitekey="<?php echo htmlspecialchars(TURNSTILE_SITE_KEY); ?>"
                    data-theme="dark"
                    data-size="normal"></div>
            </div>

            <div class="checkbox-row">
                <input type="checkbox" name="agreed_tos" id="agreed_tos" <?php echo isset($_POST['agreed_tos'])?'checked':''; ?>>
                <label for="agreed_tos">I agree to ExtoArts <a href="/tos" target="_blank">Terms of Service</a> and <a href="/privacy" target="_blank">Privacy Policy</a>.</label>
            </div>

            <button type="submit" class="btn-submit">
                <i class="ti ti-user-plus"></i>Create Account
            </button>
        </form>

        <div class="divider">or sign up with</div>

        <div id="oauth-error" class="oauth-error">
            <i class="ti ti-alert-circle" style="flex-shrink:0;margin-top:1px;"></i>
            <span id="oauth-error-msg"></span>
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

        <div class="divider">already have an account?</div>
        <div class="signin-link"><a href="/login?role=<?php echo $role; ?>">Sign In instead</a></div>
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
    document.getElementById('editorNote').style.display = r==='editor' ? '' : 'none';
    const url = new URL(window.location);
    url.searchParams.set('role', r);
    window.history.replaceState({}, '', url);
}
function togglePw(id, iconId) {
    const inp = document.getElementById(id);
    const ico = document.getElementById(iconId);
    if (inp.type === 'password') { inp.type = 'text'; ico.className = 'ti ti-eye-off icon'; }
    else { inp.type = 'password'; ico.className = 'ti ti-eye icon'; }
}
function checkStrength(v) {
    const bar  = document.getElementById('strengthBar');
    const hint = document.getElementById('strengthHint');
    let score  = 0;
    if (v.length >= 8)  score++;
    if (v.length >= 12) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/[0-9]/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;
    const levels = [
        {w:'0%',   bg:'transparent', t:'Enter a password'},
        {w:'20%',  bg:'#ef4444',     t:'Very weak'},
        {w:'40%',  bg:'#f97316',     t:'Weak'},
        {w:'60%',  bg:'#f59e0b',     t:'Fair'},
        {w:'80%',  bg:'#22c55e',     t:'Strong'},
        {w:'100%', bg:'#00c4f0',     t:'Very strong'},
    ];
    const l = levels[Math.min(score, 5)];
    bar.style.width = l.w;
    bar.style.background = l.bg;
    hint.textContent = l.t;
}
document.getElementById('username').focus();
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
            document.getElementById('oauth-error-msg').textContent = error.message;
            document.getElementById('oauth-error').style.display = 'flex';
            btn.disabled = false;
            btn.innerHTML = orig;
        }
    });
}
oauthBtn('btn-google',  () => signInWithGoogle('oauth-signup'));
oauthBtn('btn-discord', () => signInWithDiscord('oauth-signup'));

// ── Email/password registration ───────────────────────────────────────────────
const form      = document.getElementById('regForm');
const submitBtn = form?.querySelector('[type="submit"]');
const ORIG_BTN  = submitBtn?.innerHTML;

if (form && submitBtn) {
    form.addEventListener('submit', handleRegister);
}

async function handleRegister(e) {
    const email    = form.querySelector('[name="email"]')?.value?.trim() || '';
    const password = form.querySelector('[name="password"]')?.value || '';
    const agreed   = form.querySelector('[name="agreed_tos"]')?.checked;

    // If bare-minimum fields missing let PHP handle (avoids double error display)
    if (!email || !password || !agreed) return;

    e.preventDefault();
    clearJsErrors();
    setLoading(true);

    const username = form.querySelector('[name="username"]')?.value?.trim() || '';
    const confirm  = form.querySelector('[name="confirm"]')?.value || '';
    const role     = form.querySelector('[name="role"]')?.value || 'client';
    const tsToken  = form.querySelector('[name="cf-turnstile-response"]')?.value || '';
    const csrf     = form.querySelector('[name="csrf_token"]')?.value || '';

    try {
        // 1. Server-side validation (uniqueness, domain, rate-limit, Turnstile)
        const vr = await fetch('/api/validate-register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf },
            body: JSON.stringify({ username, email, password, confirm, role, ts_token: tsToken, agreed_tos: true }),
        });
        let vd;
        try {
            vd = await vr.json();
        } catch {
            vd = { ok: false, errors: [
                vr.status >= 500
                    ? 'Server error (' + vr.status + '). Please try again in a moment.'
                    : 'Could not reach the server. Please check your connection and try again.'
            ]};
        }

        if (!vd.ok) {
            showJsErrors(vd.errors || ['Validation failed. Please check your details.']);
            if (typeof turnstile !== 'undefined') turnstile.reset();
            setLoading(false);
            return;
        }

        // 2. Supabase signUp (sends confirmation email if confirmations are enabled)
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { username, role },
                emailRedirectTo: window.location.origin + '/auth/callback?flow=verify&role=' + encodeURIComponent(role),
            },
        });

        if (error) {
            showJsErrors([friendlyError(error.message)]);
            setLoading(false);
            return;
        }

        if (data?.session) {
            // Email confirmations disabled in Supabase - user is immediately active
            const br = await fetch('/api/auth-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf },
                body: JSON.stringify({ access_token: data.session.access_token, provider: 'email' }),
            });
            const bd = await br.json().catch(() => ({ ok: false }));
            window.location.href = bd.ok
                ? (bd.redirect || (role === 'editor' ? '/apply?notice=registered' : '/dashboard?notice=welcome'))
                : '/login?registered=1&email=' + encodeURIComponent(email);
        } else {
            // Email confirmation required - send to dedicated verify page
            const next = role === 'editor' ? '&next=' + encodeURIComponent('/apply?notice=registered') : '';
            window.location.href = '/verify-email?email=' + encodeURIComponent(email) + next;
        }

    } catch (networkErr) {
        // Network/module error: do NOT fall back to PHP registration.
        // PHP registration creates a public.users entry with bcrypt but no
        // Supabase auth.users entry, so authGuard.js would block the dashboard
        // for those users forever. Show a clear retry message instead.
        showJsErrors(['Connection error. Please check your internet and try again.']);
        setLoading(false);
    }
}

function setLoading(on) {
    if (!submitBtn) return;
    submitBtn.disabled = on;
    submitBtn.innerHTML = on
        ? '<i class="ti ti-loader-2 ti-spin"></i> Creating account...'
        : ORIG_BTN;
}

function showJsErrors(errs) {
    let box = document.getElementById('js-reg-errors');
    if (!box) {
        box = document.createElement('div');
        box.id = 'js-reg-errors';
        box.className = 'notice-error';
        form.prepend(box);
    }
    const safe = errs.map(m => m.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'));
    box.innerHTML = '<i class="ti ti-alert-circle" style="flex-shrink:0;margin-top:2px;"></i>'
        + '<div>' + (safe.length === 1 ? safe[0] : '<ul style="padding-left:16px;margin-top:6px;">' + safe.map(m => '<li>' + m + '</li>').join('') + '</ul>') + '</div>';
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function clearJsErrors() {
    document.getElementById('js-reg-errors')?.remove();
}

function friendlyError(msg) {
    msg = (msg || '').toLowerCase();
    if (msg.includes('already registered') || msg.includes('already been registered')) return 'An account with this email already exists. Please sign in instead.';
    if (msg.includes('password') && msg.includes('weak')) return 'Password is too weak. Use at least 8 characters with a mix of letters and numbers.';
    if (msg.includes('invalid email') || msg.includes('email_address_invalid') || msg.includes('email address') && msg.includes('invalid')) return 'Please enter a valid email address.';
    if (msg.includes('rate limit') || msg.includes('too many')) return 'Too many attempts. Please wait a few minutes and try again.';
    if (msg.includes('email not confirmed')) return 'Please check your email and confirm your account before signing in.';
    if (msg.includes('over_email_send_rate_limit') || msg.includes('email send rate')) return 'Too many emails sent. Please wait a minute before trying again.';
    if (msg.includes('signup_disabled') || msg.includes('signups not allowed')) return 'Registrations are temporarily disabled. Please try again later.';
    const raw = (msg || '').trim();
    return raw.charAt(0).toUpperCase() + raw.slice(1);
}
</script>
<script src="/js/transitions.min.js?v=<?= filemtime(__DIR__.'/../js/transitions.min.js') ?>" defer></script>
</body>
</html>
