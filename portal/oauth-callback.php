<?php
declare(strict_types=1);
require_once __DIR__ . '/../includes/auth.php';
secure_headers(false);
$csrf = csrf_token();
?>
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Signing in... | ExtoArts</title>
<meta name="robots" content="noindex, nofollow">
<link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<style>@font-face{font-family:'Plus Jakarta Sans';font-style:normal;font-weight:400 900;font-display:swap;src:url('/css/fonts/plus-jakarta-sans.woff2') format('woff2');}</style>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
:root{--bg:#07070c;--primary:#00c4f0;--text-main:#f5f5f7;--text-muted:#6b7280;}
body{background:var(--bg);color:var(--text-main);font-family:'Plus Jakarta Sans',sans-serif;
    min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;}
.wrap{text-align:center;max-width:380px;}
.logo-mark-wrap{width:68px;height:68px;border-radius:17px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:20px;border:1px solid rgba(34,211,238,0.22);background:rgba(34,211,238,0.04);box-shadow:0 0 28px rgba(34,211,238,0.08);animation:ringPulse 3.5s ease-in-out infinite;}
.logo-mark-wrap svg{width:46px;height:46px;}
@keyframes ringPulse{0%,100%{box-shadow:0 0 0 0 rgba(34,211,238,0.15);}50%{box-shadow:0 0 0 10px rgba(34,211,238,0);}}
.spinner{width:40px;height:40px;border:3px solid rgba(0,196,240,0.15);
    border-top-color:var(--primary);border-radius:50%;
    animation:spin 0.8s linear infinite;margin:0 auto 18px;}
@keyframes spin{to{transform:rotate(360deg);}}
h2{font-size:1.25rem;font-weight:800;margin-bottom:8px;}
p{font-size:0.87rem;color:var(--text-muted);line-height:1.6;}
.error-box{margin-top:20px;padding:14px 18px;border-radius:14px;
    background:rgba(239,68,68,0.07);border:1px solid rgba(239,68,68,0.2);
    color:#fca5a5;font-size:0.87rem;display:none;}
.btn{display:inline-flex;align-items:center;gap:8px;margin-top:16px;
    padding:11px 22px;background:var(--primary);color:#000;font-weight:700;
    font-size:0.88rem;border:none;border-radius:12px;cursor:pointer;
    font-family:inherit;text-decoration:none;}
</style>
</head>
<body>
<div class="wrap">
    <div class="logo-mark-wrap">
        <img src="/favicon-192.png" alt="ExtoArts logo" style="width:46px;height:46px;border-radius:11px;display:block;" onerror="this.onerror=null;this.outerHTML=`<svg width='46' height='46' viewBox='0 0 36 36' fill='none' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'><rect width='36' height='36' rx='9' fill='#0a0a14'/><path d='M10.5 10.5V25.5M10.5 10.5H24M10.5 18H20.5M10.5 25.5H24' stroke='#22d3ee' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/></svg>`">
    </div>
    <div class="spinner" id="spinner"></div>
    <h2 id="status-title">Completing sign-in...</h2>
    <p id="status-msg">Please wait while we verify your account.</p>
    <div class="error-box" id="error-box">
        <span id="error-msg">Something went wrong. Please try again.</span>
        <br><a class="btn" href="/login" style="margin-top:12px;">Back to Sign In</a>
    </div>
</div>
<input type="hidden" id="csrf_token" value="<?php echo htmlspecialchars($csrf); ?>">
<script type="module">
import { supabase } from '/src/supabaseClient.js';

// ── Error display ────────────────────────────────────────────────────────────
function showError(msg, extra) {
    document.getElementById('spinner').style.display    = 'none';
    document.getElementById('status-title').textContent = 'Sign-in failed';
    document.getElementById('status-msg').style.display = 'none';
    if (extra) console.warn('[ExtoArts OAuth]', msg, '\n\n' + extra);
    const errEl = document.getElementById('error-msg');
    errEl.textContent = msg;
    document.getElementById('error-box').style.display  = 'block';
}

// ── URL / localStorage context ───────────────────────────────────────────────
// flow=verify       came from email confirmation link (email/password signup)
// flow=oauth-login  came from login page OAuth button (no new accounts)
// flow=oauth-signup came from register page OAuth button (new accounts allowed)
// role=editor|client passed through from registration emailRedirectTo
//
// For OAuth: flow is stored in localStorage (set in supabaseClient.js before
// redirect) because the redirectTo URL must be clean (no query params) to
// match Supabase's redirect URL allowlist exactly.
// For email confirmation: flow and role come as URL query params.
const _urlParams = new URLSearchParams(window.location.search);
const _urlFlow   = _urlParams.get('flow') || '';
let   _lsFlow    = '';
try { _lsFlow = localStorage.getItem('extoarts_oauth_flow') || ''; } catch {}
// URL params win (email confirm links); localStorage is fallback for OAuth
const _flowParam = _urlFlow || _lsFlow;
const _roleParam = _urlParams.get('role') || '';
// Always clear localStorage after reading so it doesn't leak into future sessions
try { localStorage.removeItem('extoarts_oauth_flow'); } catch {}

// ── Bridge to PHP session via hidden form POST ───────────────────────────────
// Using a real form submit (Sec-Fetch-Mode: navigate) instead of fetch() (cors)
// so the host WAF treats it as legitimate browser navigation, not an AJAX bot.
// auth-session.php detects the form content-type and redirects instead of JSON.
function handleSession(session) {
    const csrf = document.getElementById('csrf_token').value;
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/api/auth-session';
    const fields = {
        access_token: session.access_token,
        flow:         _flowParam,
        role:         _roleParam,
        csrf_token:   csrf,
    };
    for (const [name, value] of Object.entries(fields)) {
        const inp = document.createElement('input');
        inp.type  = 'hidden';
        inp.name  = name;
        inp.value = value || '';
        form.appendChild(inp);
    }
    document.body.appendChild(form);
    form.submit();
}

// ── Check for OAuth error in URL before starting auth detection ──────────────
// Supabase can return errors in query params (?error=...) or hash (#error=...)
const _hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
const _oauthError = _urlParams.get('error') || _hashParams.get('error');

if (_oauthError) {
    const desc = _hashParams.get('error_description')
              || _urlParams.get('error_description')
              || _oauthError;
    const rawCtx = '[OAUTH_CALLBACK_ERROR]\nerror: ' + _oauthError +
        '\nerror_description: ' + (desc || 'n/a') +
        '\nhash: ' + window.location.hash.substring(0, 200) +
        '\nquery: ' + window.location.search +
        '\nflow: ' + _flowParam +
        '\nhost: ' + window.location.host;
    showError('[SUPABASE_OAUTH_ERROR] ' + decodeURIComponent(desc.replace(/\+/g, ' ')), rawCtx);
} else {
    // ── Detect session from URL ──────────────────────────────────────────────
    //
    // With implicit flow, supabase-js reads #access_token=... from the URL hash
    // and fires onAuthStateChange. Two events can carry the session depending on
    // the supabase-js version and how detectSessionInUrl processed the URL:
    //
    //   SIGNED_IN      - standard event when a new session is established
    //   INITIAL_SESSION - supabase-js v2.91+ fires this immediately on init
    //                     with any session it found (from URL or localStorage)
    //
    // We handle both to be version-agnostic. We require session to be non-null
    // to avoid triggering on the empty INITIAL_SESSION that fires before the
    // URL tokens are processed.
    //
    // For email confirmation links that still carry a ?code= (PKCE-style from
    // Supabase email verify), the fallback timeout calls exchangeCodeForSession
    // explicitly.

    let _handled = false;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (_handled) return;
        if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session) {
            _handled = true;
            subscription.unsubscribe();
            await handleSession(session);
        }
        // Do NOT handle SIGNED_OUT here: it fires on init when there is no
        // existing session, which would falsely show "cancelled" before
        // detectSessionInUrl has a chance to process the URL tokens.
    });

    // Fallback: if no auth event fires within 10 seconds, try all methods
    setTimeout(async () => {
        if (_handled) return;
        _handled = true;
        subscription.unsubscribe();

        // 1. Try explicit PKCE code exchange if a ?code= param exists
        //    (covers email confirmation links from Supabase that return a code
        //    rather than a hash token, e.g. when the project has PKCE email auth)
        const code = _urlParams.get('code');
        if (code) {
            const { data: codeData, error: codeErr } = await supabase.auth.exchangeCodeForSession(code);
            if (codeData?.session) {
                await handleSession(codeData.session);
                return;
            }
            if (codeErr) {
                showError(codeErr.message || 'Code exchange failed. Please try signing in again.');
                return;
            }
        }

        // 2. Check if a session is already stored (detectSessionInUrl succeeded
        //    but the event was missed)
        const { data: { session }, error } = await supabase.auth.getSession();
        if (session) {
            await handleSession(session);
        } else {
            showError(error?.message || 'Sign-in timed out. Please try again.');
        }
    }, 4000);
}
</script>
</body>
</html>
