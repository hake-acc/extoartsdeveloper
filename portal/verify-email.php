<?php
declare(strict_types=1);
/**
 * ExtoArts - Email Verification Pending Page
 *
 * Shown after registration and when an unverified user tries to log in.
 * Handles the "Check your inbox" state and the resend flow.
 * In dev mode (non-production + no RESEND_API_KEY) the verification link
 * is displayed directly on screen for testing.
 */
require_once __DIR__ . '/../includes/auth.php';
secure_headers(false);

$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';

// Already logged-in and verified - nothing to do here
$current_user = auth_user();
if ($current_user && ($current_user['email_verified'] ?? true) !== false) {
    header('Location: /dashboard');
    exit;
}

$notice  = '';
$error   = '';
$success = '';

// Pull email from GET param (set by register.php or login.php redirect)
$display_email = trim($_GET['email'] ?? ($current_user['email'] ?? ''));
$is_editor     = ($_GET['role'] ?? '') === 'editor';

// Notice passed by login.php when it blocks an unverified login attempt
if (($_GET['notice'] ?? '') === 'unverified') {
    $notice = 'You need to verify your email address before you can sign in.';
}

// ── Dev mode: show verification link directly on screen ───────────────────────
$is_prod = in_array(
    strtolower(explode(':', $_SERVER['HTTP_HOST'] ?? '')[0]),
    ['extoarts.in', 'www.extoarts.in'],
    true
);
$dev_url = null;
if (!$is_prod) {
    foreach (['__dev_verify_url', '__dev_resend_url'] as $_dv_key) {
        if (!empty($_SESSION[$_dv_key])) {
            $dev_url = $_SESSION[$_dv_key];
            unset($_SESSION[$_dv_key]);
            break;
        }
    }
}

// ── POST: Resend verification email ──────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['action'] ?? '') === 'resend') {
    if (!csrf_verify()) {
        $error = 'Security check failed. Please refresh the page and try again.';
    } else {
        $resend_email = strtolower(trim($_POST['email'] ?? $display_email));

        if (!$resend_email || !filter_var($resend_email, FILTER_VALIDATE_EMAIL)) {
            $error = 'Please enter a valid email address.';
        } elseif (!rate_limit_check('resend_v_' . $ip, 2, 3600)) {
            $error = 'Too many resend attempts. Please wait an hour before trying again.';
        } else {
            try {
                $user = db_fetch(
                    "SELECT * FROM users WHERE email = ? LIMIT 1",
                    [$resend_email]
                );

                if (!$user) {
                    $error = 'No account found with that email address. Check the spelling or create a new account.';
                } elseif (!empty($user['email_verified'])) {
                    $success = 'Your email is already verified. You can sign in now.';
                } else {
                    rate_limit_record('resend_v_' . $ip);
                    $token      = generate_email_verify_token((int)$user['id']);
                    $verify_url = BASE_URL . '/verify?token=' . $token;
                    require_once __DIR__ . '/../includes/email.php';
                    $sent = send_verification_email($resend_email, $user['username'] ?? '', $verify_url);

                    // Dev mode: send_verification_email() stores URL under __dev_verify_url
                    if (!$is_prod && !empty($_SESSION['__dev_verify_url'])) {
                        $dev_url = $_SESSION['__dev_verify_url'];
                        unset($_SESSION['__dev_verify_url']);
                    }

                    $display_email = $resend_email;
                    if ($sent || $dev_url) {
                        $success = 'Verification email sent. Check your inbox and spam folder.';
                    } else {
                        $error = 'Failed to send the email. Please try again or contact us on Discord.';
                    }
                }
            } catch (Throwable $e) {
                error_log('[ExtoArts] verify-email resend error: ' . $e->getMessage());
                $error = 'Something went wrong. Please try again.';
            }
        }
    }
}

// Mask email for display  (user@gmail.com -> u***@gmail.com)
function _mask_email(string $email): string {
    if (!$email || !str_contains($email, '@')) return $email;
    [$local, $domain] = explode('@', $email, 2);
    $masked = strlen($local) <= 2
        ? $local
        : substr($local, 0, 1) . str_repeat('*', min(strlen($local) - 1, 5));
    return $masked . '@' . $domain;
}
$masked = _mask_email($display_email);
?>
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Verify Your Email | ExtoArts</title>
<meta name="robots" content="noindex, nofollow">
<link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<style>@font-face{font-family:'Plus Jakarta Sans';font-style:normal;font-weight:400 900;font-display:swap;src:url('/css/fonts/plus-jakarta-sans.woff2') format('woff2');}</style>
<link rel="preload" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.44.0/dist/fonts/tabler-icons.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.44.0/dist/tabler-icons.min.css">
<style>
*{margin:0;padding:0;box-sizing:border-box;}
:root{
    --bg:#07070c;--surface:rgba(255,255,255,0.04);--primary:#00c4f0;
    --primary-glow:rgba(0,196,240,0.12);--border:rgba(255,255,255,0.08);
    --text-main:#f5f5f7;--text-muted:#6b7280;--red:#ef4444;--green:#22c55e;
    --easing:cubic-bezier(0.16,1,0.3,1);
}
[data-theme="light"]{
    --bg:#f7f6f3;--surface:rgba(0,0,0,0.03);--border:rgba(0,0,0,0.09);
    --text-main:#0d0d12;--text-muted:#6b7280;--primary-glow:rgba(0,196,240,0.08);
}
body{background:var(--bg);color:var(--text-main);font-family:'Plus Jakarta Sans',sans-serif;
    min-height:100vh;display:flex;flex-direction:column;align-items:center;
    justify-content:center;padding:24px 20px 60px;position:relative;overflow-x:hidden;}
.bg-orb{position:fixed;border-radius:50%;filter:blur(130px);pointer-events:none;z-index:0;animation:orbFloat 8s ease-in-out infinite;}
.bg-orb-1{width:600px;height:600px;background:rgba(0,196,240,0.05);top:-150px;left:-150px;}
.bg-orb-2{width:500px;height:500px;background:rgba(168,85,247,0.04);bottom:-100px;right:-100px;animation-delay:-4s;}
@keyframes orbFloat{0%,100%{transform:translateY(0) scale(1);}50%{transform:translateY(-20px) scale(1.05);}}
.wrap{position:relative;z-index:1;width:100%;max-width:430px;}

/* Logo */
.logo-header{text-align:center;margin-bottom:24px;}
.logo-mark-wrap{width:62px;height:62px;border-radius:16px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px;border:1px solid rgba(34,211,238,0.22);background:rgba(34,211,238,0.04);box-shadow:0 0 28px rgba(34,211,238,0.08);animation:ringPulse 3.5s ease-in-out infinite;}
.logo-mark-wrap svg{width:42px;height:42px;}
@keyframes ringPulse{0%,100%{box-shadow:0 0 0 0 rgba(34,211,238,0.15);}50%{box-shadow:0 0 0 10px rgba(34,211,238,0);}}
.logo-header h1{font-size:1.55rem;font-weight:900;letter-spacing:-0.8px;}
.logo-header p{font-size:0.85rem;color:var(--text-muted);margin-top:5px;}

/* Card */
.card{background:rgba(255,255,255,0.025);border:1px solid var(--border);border-radius:24px;
    padding:34px 30px;backdrop-filter:blur(20px);
    box-shadow:0 0 0 1px rgba(255,255,255,0.02),0 24px 64px rgba(0,0,0,0.4);}
[data-theme="light"] .card{background:#fff;box-shadow:0 4px 32px rgba(0,0,0,0.08);}

/* Envelope icon */
.icon-wrap{text-align:center;margin-bottom:22px;}
.icon-circle{width:76px;height:76px;border-radius:50%;
    background:linear-gradient(135deg,rgba(0,196,240,0.12),rgba(168,85,247,0.1));
    border:1px solid rgba(0,196,240,0.22);
    display:inline-flex;align-items:center;justify-content:center;
    animation:iconPop 2.8s ease-in-out infinite;}
.icon-circle i{font-size:1.9rem;color:var(--primary);}
@keyframes iconPop{0%,100%{box-shadow:0 0 0 0 rgba(0,196,240,0.18);}50%{box-shadow:0 0 0 14px rgba(0,196,240,0);}}

.card-title{font-size:1.3rem;font-weight:900;letter-spacing:-0.4px;text-align:center;margin-bottom:7px;}
.card-sub{font-size:0.87rem;color:var(--text-muted);text-align:center;line-height:1.65;margin-bottom:22px;}

/* Email badge */
.email-badge{display:block;text-align:center;margin-bottom:20px;}
.email-badge span{display:inline-block;background:rgba(0,196,240,0.08);
    border:1px solid rgba(0,196,240,0.2);color:var(--primary);
    padding:5px 14px;border-radius:8px;font-size:0.82rem;font-weight:700;
    word-break:break-all;max-width:100%;}

/* Notices */
.notice{padding:12px 15px;border-radius:12px;font-size:0.84rem;line-height:1.55;margin-bottom:16px;}
.notice i{margin-right:6px;}
.notice-info{background:rgba(0,196,240,0.07);border:1px solid rgba(0,196,240,0.2);color:#67e8f9;}
.notice-error{background:rgba(239,68,68,0.07);border:1px solid rgba(239,68,68,0.2);color:#fca5a5;}
.notice-success{background:rgba(34,197,94,0.07);border:1px solid rgba(34,197,94,0.2);color:#86efac;}

/* Dev mode box */
.dev-box{background:rgba(168,85,247,0.06);border:1px solid rgba(168,85,247,0.22);
    border-radius:12px;padding:13px 15px;margin-bottom:16px;}
.dev-label{font-size:0.7rem;font-weight:800;letter-spacing:1.2px;color:rgba(168,85,247,0.85);
    text-transform:uppercase;margin-bottom:6px;display:flex;align-items:center;gap:6px;}
.dev-url{font-size:0.73rem;color:#c084fc;word-break:break-all;line-height:1.5;}
.dev-url a{color:#c084fc;}

/* Form */
.form-group{margin-bottom:14px;}
.form-group label{display:block;font-size:0.8rem;font-weight:700;margin-bottom:6px;color:var(--text-muted);}
.input-wrap{position:relative;}
.input-wrap i.icon{position:absolute;left:13px;top:50%;transform:translateY(-50%);
    color:var(--text-muted);font-size:0.83rem;pointer-events:none;}
input[type=email]{width:100%;background:rgba(255,255,255,0.05);border:1px solid var(--border);
    border-radius:12px;padding:12px 13px 12px 36px;color:var(--text-main);font-size:0.89rem;
    font-family:inherit;outline:none;transition:border-color .2s;}
input[type=email]:focus{border-color:rgba(0,196,240,0.5);background:rgba(0,196,240,0.04);}
[data-theme="light"] input[type=email]{background:rgba(0,0,0,0.03);}

.btn{width:100%;padding:14px;border:none;border-radius:13px;cursor:pointer;font-family:inherit;
    font-size:0.91rem;font-weight:800;transition:all .25s var(--easing);
    display:flex;align-items:center;justify-content:center;gap:8px;}
.btn-primary{background:var(--primary);color:#000;}
.btn-primary:hover{filter:brightness(1.1);transform:translateY(-1px);}
.btn-ghost{background:rgba(255,255,255,0.04);border:1px solid var(--border);
    color:var(--text-muted);font-size:0.84rem;font-weight:700;padding:11px;margin-top:9px;}
.btn-ghost:hover{background:rgba(255,255,255,0.07);color:var(--text-main);}
[data-theme="light"] .btn-ghost{background:rgba(0,0,0,0.03);}

.sep{text-align:center;font-size:0.78rem;color:var(--text-muted);margin:16px 0 13px;
    position:relative;}
.sep::before,.sep::after{content:'';position:absolute;top:50%;width:calc(50% - 18px);
    height:1px;background:var(--border);}
.sep::before{left:0;} .sep::after{right:0;}

.link-row{text-align:center;font-size:0.82rem;color:var(--text-muted);margin-bottom:8px;}
.link-row a{color:var(--primary);font-weight:700;text-decoration:none;}
.link-row a:hover{text-decoration:underline;}

/* Tips */
.tips{margin-top:18px;padding:13px 15px;background:rgba(255,255,255,0.02);
    border:1px solid var(--border);border-radius:12px;}
.tips-head{font-size:0.76rem;font-weight:800;color:var(--text-muted);margin-bottom:8px;}
.tips ul{list-style:none;padding:0;display:flex;flex-direction:column;gap:5px;}
.tips li{font-size:0.77rem;color:var(--text-muted);padding-left:14px;position:relative;}
.tips li::before{content:'>';position:absolute;left:0;color:var(--primary);font-weight:800;}
</style>
</head>
<body>
<div class="bg-orb bg-orb-1"></div>
<div class="bg-orb bg-orb-2"></div>

<div class="wrap">
    <div class="logo-header">
        <div class="logo-mark-wrap">
            <img src="/favicon-192.png" alt="ExtoArts logo" style="width:42px;height:42px;border-radius:10px;display:block;" onerror="this.onerror=null;this.outerHTML=`<svg width='42' height='42' viewBox='0 0 36 36' fill='none' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'><rect width='36' height='36' rx='9' fill='#0a0a14'/><path d='M10.5 10.5V25.5M10.5 10.5H24M10.5 18H20.5M10.5 25.5H24' stroke='#22d3ee' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/></svg>`">
        </div>
        <h1>ExtoArts</h1>
        <p>One step left - verify your email</p>
    </div>

    <div class="card">
        <!-- Envelope animation -->
        <div class="icon-wrap">
            <div class="icon-circle">
                <i class="ti ti-mail-opened"></i>
            </div>
        </div>

        <div class="card-title">Check your inbox</div>
        <div class="card-sub">
            We sent a verification link to your email address.
            Click it to activate your account and access your dashboard.
        </div>

        <?php if ($masked): ?>
        <div class="email-badge">
            <span><i class="ti ti-mail" style="margin-right:6px;font-size:0.73rem;opacity:0.7;"></i><?php echo htmlspecialchars($masked, ENT_QUOTES, 'UTF-8'); ?></span>
        </div>
        <?php endif; ?>

        <!-- Dev mode: show raw verification link for testing -->
        <?php if ($dev_url): ?>
        <div class="dev-box">
            <div class="dev-label">
                <i class="ti ti-code"></i> Developer Mode - Verification Link
            </div>
            <div class="dev-url">
                <a href="<?php echo htmlspecialchars($dev_url, ENT_QUOTES, 'UTF-8'); ?>" target="_blank">
                    <?php echo htmlspecialchars($dev_url, ENT_QUOTES, 'UTF-8'); ?>
                </a>
            </div>
        </div>
        <?php endif; ?>

        <!-- Notices -->
        <?php if ($notice): ?>
        <div class="notice notice-info">
            <i class="ti ti-info-circle"></i><?php echo htmlspecialchars($notice, ENT_QUOTES, 'UTF-8'); ?>
        </div>
        <?php endif; ?>
        <?php if ($error): ?>
        <div class="notice notice-error">
            <i class="ti ti-alert-triangle"></i><?php echo htmlspecialchars($error, ENT_QUOTES, 'UTF-8'); ?>
        </div>
        <?php endif; ?>
        <?php if ($success): ?>
        <div class="notice notice-success">
            <i class="ti ti-circle-check"></i><?php echo htmlspecialchars($success, ENT_QUOTES, 'UTF-8'); ?>
        </div>
        <?php endif; ?>

        <!-- Resend form -->
        <form method="POST" action="<?php echo '/verify-email' . ($display_email ? '?email=' . rawurlencode($display_email) : ''); ?>">
            <?php echo csrf_field(); ?>
            <input type="hidden" name="action" value="resend">

            <div class="form-group">
                <label for="resend_email">Your email address</label>
                <div class="input-wrap">
                    <i class="ti ti-mail icon"></i>
                    <input type="email" id="resend_email" name="email"
                           value="<?php echo htmlspecialchars($display_email, ENT_QUOTES, 'UTF-8'); ?>"
                           placeholder="you@gmail.com" autocomplete="email" required>
                </div>
            </div>

            <button type="submit" class="btn btn-primary">
                <i class="ti ti-send"></i> Resend Verification Email
            </button>
        </form>

        <div class="sep">or</div>

        <div class="link-row">
            <a href="/login"><i class="ti ti-arrow-left" style="font-size:0.72rem;"></i> Back to sign in</a>
        </div>
        <div class="link-row">
            <a href="/register">Use a different email address</a>
        </div>

        <div class="tips">
            <div class="tips-head"><i class="ti ti-bulb" style="color:var(--primary);margin-right:4px;"></i>Not seeing the email?</div>
            <ul>
                <li>Check your spam or junk folder first</li>
                <li>Verification links expire after 24 hours</li>
                <li>Gmail and Yahoo may delay by a few minutes</li>
                <li>Click "Resend" above if you still do not receive it</li>
            </ul>
        </div>
    </div>
</div>
</body>
</html>
