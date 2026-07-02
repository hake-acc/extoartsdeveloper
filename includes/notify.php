<?php
declare(strict_types=1);
/**
 * ExtoArts - Notification helpers
 * Sends Discord webhook alerts to the site owner for new registrations
 * and editor applications. Requires discord_webhook_url in data/config.json.
 * All functions are silent on failure - they never crash the calling page.
 */

// ── Internal: POST a Discord webhook ─────────────────────────────────────────
function _notify_discord(array $embed): void {
    $cfg = $GLOBALS['_site_cfg'] ?? [];
    $url = $cfg['discord_webhook_url'] ?? '';
    if (empty($url)) return; // webhook not configured, skip silently

    $payload = json_encode(['embeds' => [$embed]]);

    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => $payload,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 5,
            CURLOPT_CONNECTTIMEOUT => 3,
            CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
        ]);
        @curl_exec($ch);
        curl_close($ch);
    } elseif (ini_get('allow_url_fopen')) {
        $ctx = stream_context_create(['http' => [
            'method'  => 'POST',
            'header'  => "Content-Type: application/json\r\n",
            'content' => $payload,
            'timeout' => 5,
        ]]);
        @file_get_contents($url, false, $ctx);
    }
}

// ── New account registered ────────────────────────────────────────────────────
function notify_new_registration(string $username, string $email, string $role): void {
    try {
        $role_label = ucfirst($role);
        _notify_discord([
            'title'       => 'New ' . $role_label . ' Registered',
            'description' => '**' . $username . '** (`' . $email . '`) just created a ' . $role_label . ' account.',
            'color'       => 0x00c4f0,
            'footer'      => ['text' => 'ExtoArts - ' . date('Y-m-d H:i') . ' UTC'],
        ]);
    } catch (Throwable $e) {
        error_log('[ExtoArts] notify_new_registration error: ' . $e->getMessage());
    }
}

// ── New editor application submitted ─────────────────────────────────────────
function notify_new_application(array $user, string $display_name, string $specialties, string $bio, string $tools, mixed $exp): void {
    try {
        $username = $user['username'] ?? $user['name'] ?? 'unknown';
        $email    = $user['email'] ?? '';
        _notify_discord([
            'title'       => 'New Editor Application',
            'description' => '**' . $display_name . '** (`' . $username . '` / `' . $email . '`) submitted an editor application.',
            'fields'      => [
                ['name' => 'Specialties', 'value' => $specialties ?: '-', 'inline' => true],
                ['name' => 'Tools',       'value' => $tools       ?: '-', 'inline' => true],
                ['name' => 'Experience',  'value' => $exp . ' yr(s)', 'inline' => true],
            ],
            'color'  => 0xa855f7,
            'footer' => ['text' => 'ExtoArts - ' . date('Y-m-d H:i') . ' UTC'],
        ]);
    } catch (Throwable $e) {
        error_log('[ExtoArts] notify_new_application error: ' . $e->getMessage());
    }
}
