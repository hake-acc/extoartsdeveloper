<?php
declare(strict_types=1);
/**
 * ExtoArts - Transactional Email
 *
 * Uses the Resend API (https://resend.com) to send verification emails.
 * Set RESEND_API_KEY in environment secrets to enable real email delivery.
 *
 * Dev/staging fallback: when RESEND_API_KEY is absent and the host is not
 * extoarts.in, the verification URL is stored in the session so
 * verify-email.php can display it directly on screen for testing.
 */

// ── Quota / throttle helpers (file-based, no DB dependency) ──────────────────

/**
 * Check and increment the global daily email counter.
 * Returns false (and logs) when the daily cap is reached.
 * Cap is set to 80 to stay safely under Resend's 100/day free-tier limit.
 */
function _email_daily_quota_ok(): bool {
    $file  = sys_get_temp_dir() . '/ea_eqd.json';
    $today = date('Y-m-d');
    $data  = [];
    if (is_file($file)) {
        $data = json_decode(file_get_contents($file), true) ?: [];
    }
    if (($data['date'] ?? '') !== $today) {
        $data = ['date' => $today, 'count' => 0];
    }
    if ($data['count'] >= 80) {
        error_log('[ExtoArts] QUOTA: daily email cap (80) reached. Email NOT sent to protect Resend quota.');
        return false;
    }
    $data['count']++;
    file_put_contents($file, json_encode($data), LOCK_EX);
    return true;
}

/**
 * Per-address send throttle: max 2 sends per 600 seconds (10 min).
 * Returns false when the address has been emailed too recently.
 */
function _email_addr_throttle_ok(string $email): bool {
    $file   = sys_get_temp_dir() . '/ea_eat_' . md5(strtolower($email)) . '.json';
    $window = 600;
    $max    = 2;
    $data   = [];
    if (is_file($file)) {
        $data = json_decode(file_get_contents($file), true) ?: [];
    }
    $now = time();
    if (isset($data['first']) && ($now - (int)$data['first']) > $window) {
        $data = [];
    }
    $data['first'] = $data['first'] ?? $now;
    $data['count'] = ($data['count'] ?? 0) + 1;
    if ($data['count'] > $max) {
        error_log('[ExtoArts] THROTTLE: email to ' . $email . ' blocked (too frequent).');
        return false;
    }
    file_put_contents($file, json_encode($data), LOCK_EX);
    return true;
}

/**
 * Send a verification email to a newly registered user.
 *
 * @param string $to_email  Recipient email address
 * @param string $to_name   Recipient display name / username
 * @param string $verify_url Full verification URL (/verify?token=...)
 * @return bool  true on success (or dev-mode), false on real send failure
 */
function send_verification_email(string $to_email, string $to_name, string $verify_url): bool {
    // Read from env var first; fall back to hardcoded key for backwards compatibility.
    // Set RESEND_API_KEY in Replit Secrets to override.
    $api_key = getenv('RESEND_API_KEY') ?: ($_ENV['RESEND_API_KEY'] ?? 're_L43Uxs7w_4pzHVMyrqE1wEDgoRB5dcqd4');
    $is_prod = in_array(
        strtolower(explode(':', $_SERVER['HTTP_HOST'] ?? '')[0]),
        ['extoarts.in', 'www.extoarts.in'],
        true
    );

    // ── Abuse / quota guards ──────────────────────────────────────────────────
    if (!_email_daily_quota_ok()) {
        error_log('[ExtoArts] Verification email to ' . $to_email . ' blocked by daily quota.');
        return false;
    }
    if (!_email_addr_throttle_ok($to_email)) {
        error_log('[ExtoArts] Verification email to ' . $to_email . ' blocked by per-address throttle.');
        return false;
    }

    // ── Dev mode: no API key configured ──────────────────────────────────────
    if (empty($api_key)) {
        error_log('[ExtoArts] Email skipped (RESEND_API_KEY not set). Verify URL: ' . $verify_url);
        if (!$is_prod) {
            // Store the URL in session so verify-email.php can display it
            $_SESSION['__dev_verify_url'] = $verify_url;
            return true; // treat as success in dev
        }
        // Production with no API key - log and soft-fail
        error_log('[ExtoArts] CRITICAL: RESEND_API_KEY missing in production. Email NOT sent to ' . $to_email);
        return false;
    }

    // ── Build payload ─────────────────────────────────────────────────────────
    $html    = _build_verify_email_html($to_name, $verify_url);
    $payload = json_encode([
        'from'    => 'ExtoArts <noreply@extoarts.in>',
        'to'      => [$to_email],
        'subject' => 'Verify your ExtoArts account',
        'html'    => $html,
    ]);

    // ── Send via Resend REST API ──────────────────────────────────────────────
    if (!function_exists('curl_init')) {
        error_log('[ExtoArts] Email send failed: cURL not available.');
        return false;
    }

    $ch = curl_init('https://api.resend.com/emails');
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 12,
        CURLOPT_CONNECTTIMEOUT => 6,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_HTTPHEADER     => [
            'Authorization: Bearer ' . $api_key,
            'Content-Type: application/json',
        ],
    ]);
    $result = curl_exec($ch);
    $code   = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $cerr   = curl_error($ch);
    curl_close($ch);

    if ($cerr) {
        error_log('[ExtoArts] Email cURL error: ' . $cerr);
        return false;
    }
    if ($code < 200 || $code >= 300) {
        error_log('[ExtoArts] Resend API error HTTP ' . $code . ': ' . $result);
        return false;
    }

    return true;
}

/**
 * Send a password-reset email (placeholder for future use).
 * Currently not wired to any UI - reserved for future password reset flow.
 */
function send_password_reset_email(string $to_email, string $to_name, string $reset_url): bool {
    $api_key = getenv('RESEND_API_KEY') ?: ($_ENV['RESEND_API_KEY'] ?? 're_L43Uxs7w_4pzHVMyrqE1wEDgoRB5dcqd4');
    $is_prod = in_array(
        strtolower(explode(':', $_SERVER['HTTP_HOST'] ?? '')[0]),
        ['extoarts.in', 'www.extoarts.in'],
        true
    );

    // ── Abuse / quota guards ──────────────────────────────────────────────────
    if (!_email_daily_quota_ok()) {
        error_log('[ExtoArts] Password reset email to ' . $to_email . ' blocked by daily quota.');
        return false;
    }
    if (!_email_addr_throttle_ok($to_email)) {
        error_log('[ExtoArts] Password reset email to ' . $to_email . ' blocked by per-address throttle.');
        return false;
    }

    if (empty($api_key)) {
        error_log('[ExtoArts] Password reset email skipped (no API key). URL: ' . $reset_url);
        if (!$is_prod) {
            $_SESSION['__dev_reset_url'] = $reset_url;
            return true;
        }
        return false;
    }

    $to_name_safe = htmlspecialchars($to_name, ENT_QUOTES, 'UTF-8');
    $url_safe     = htmlspecialchars($reset_url, ENT_QUOTES, 'UTF-8');
    $html = <<<HTML
<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="font-family:'Segoe UI',Arial,sans-serif;background:#07070c;margin:0;padding:40px 20px;">
<div style="max-width:520px;margin:0 auto;background:#0f0f1a;border:1px solid rgba(255,255,255,0.08);border-radius:20px;overflow:hidden;">
  <div style="background:linear-gradient(135deg,#00c4f0 0%,#a855f7 100%);padding:36px 40px 28px;text-align:center;">
    <img src="https://i.ibb.co/JR76yvRp/1758037248-icon.png" width="60" height="60" alt="ExtoArts" style="border-radius:50%;">
    <h1 style="color:#fff;margin:14px 0 0;font-size:1.4rem;font-weight:900;">ExtoArts</h1>
  </div>
  <div style="padding:32px 40px;">
    <h2 style="color:#f5f5f7;font-size:1.2rem;margin:0 0 10px;">Reset your password</h2>
    <p style="color:#9ca3af;line-height:1.6;margin:0 0 24px;">Hi {$to_name_safe}, click the button below to reset your password. This link expires in 1 hour.</p>
    <div style="text-align:center;margin:28px 0;">
      <a href="{$url_safe}" style="display:inline-block;background:#00c4f0;color:#000;text-decoration:none;padding:14px 32px;border-radius:12px;font-weight:800;font-size:0.92rem;">Reset Password</a>
    </div>
    <p style="color:#6b7280;font-size:0.78rem;margin:0;">If you didn't request a password reset, you can safely ignore this email.</p>
  </div>
</div>
</body></html>
HTML;

    $payload = json_encode([
        'from'    => 'ExtoArts <noreply@extoarts.in>',
        'to'      => [$to_email],
        'subject' => 'Reset your ExtoArts password',
        'html'    => $html,
    ]);

    $ch = curl_init('https://api.resend.com/emails');
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 12,
        CURLOPT_CONNECTTIMEOUT => 6,
        CURLOPT_HTTPHEADER     => [
            'Authorization: Bearer ' . $api_key,
            'Content-Type: application/json',
        ],
    ]);
    $result = curl_exec($ch);
    $code   = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return ($code >= 200 && $code < 300);
}

// ── Private: HTML email template ──────────────────────────────────────────────

function _build_verify_email_html(string $name, string $verify_url): string {
    $name_safe = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
    $url_safe  = htmlspecialchars($verify_url, ENT_QUOTES, 'UTF-8');
    $year      = date('Y');
    return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Verify your ExtoArts account</title>
</head>
<body style="font-family:'Segoe UI',Arial,sans-serif;background:#07070c;margin:0;padding:40px 20px;">
  <div style="max-width:520px;margin:0 auto;">

    <!-- Header banner -->
    <div style="background:linear-gradient(135deg,#00c4f0 0%,#a855f7 100%);border-radius:20px 20px 0 0;padding:40px 40px 32px;text-align:center;">
      <img src="https://i.ibb.co/JR76yvRp/1758037248-icon.png" width="64" height="64" alt="ExtoArts logo" style="border-radius:50%;display:block;margin:0 auto 16px;">
      <h1 style="color:#fff;margin:0;font-size:1.5rem;font-weight:900;letter-spacing:-0.5px;">ExtoArts</h1>
      <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:0.85rem;">Elite Creative Agency</p>
    </div>

    <!-- Body card -->
    <div style="background:#0f0f1a;border:1px solid rgba(255,255,255,0.08);border-radius:0 0 20px 20px;padding:40px;">
      <h2 style="color:#f5f5f7;font-size:1.25rem;font-weight:800;margin:0 0 14px;">Verify your email address</h2>
      <p style="color:#9ca3af;line-height:1.65;margin:0 0 8px;font-size:0.95rem;">Hi <strong style="color:#e5e7eb;">{$name_safe}</strong>,</p>
      <p style="color:#9ca3af;line-height:1.65;margin:0 0 32px;font-size:0.95rem;">
        Thanks for joining ExtoArts. Click the button below to verify your email address and unlock your dashboard.
        This link expires in <strong style="color:#e5e7eb;">24 hours</strong>.
      </p>

      <!-- CTA button -->
      <div style="text-align:center;margin:0 0 32px;">
        <a href="{$url_safe}"
           style="display:inline-block;background:#00c4f0;color:#000;text-decoration:none;
                  padding:16px 40px;border-radius:14px;font-weight:800;font-size:0.95rem;
                  letter-spacing:0.3px;">
          Verify Email Address
        </a>
      </div>

      <!-- Plain-text fallback URL -->
      <p style="color:#6b7280;font-size:0.8rem;margin:0 0 6px;">Or copy and paste this link in your browser:</p>
      <p style="word-break:break-all;margin:0 0 28px;">
        <a href="{$url_safe}" style="color:#00c4f0;font-size:0.78rem;">{$url_safe}</a>
      </p>

      <hr style="border:none;border-top:1px solid rgba(255,255,255,0.07);margin:0 0 24px;">

      <p style="color:#6b7280;font-size:0.78rem;line-height:1.55;margin:0;">
        If you didn't create an ExtoArts account, you can safely ignore this email - your address will not be used.
      </p>
    </div>

    <!-- Footer -->
    <p style="text-align:center;color:#374151;font-size:0.75rem;margin:20px 0 0;">
      &copy; {$year} ExtoArts &mdash; extoarts.in
    </p>

  </div>
</body>
</html>
HTML;
}
