<?php
declare(strict_types=1);
/**
 * IndexNow Ping Script - ExtoArts
 * Notifies Bing/Yandex/other IndexNow-compatible engines of updated pages.
 * Usage: include and call indexnow_ping($urls) or indexnow_ping_all_core()
 * Can also be called via CLI: php indexnow-ping.php
 */

define('INDEXNOW_KEY', 'ce5fc1ebd7e9487ea3b3b9465d36b2a2');
define('INDEXNOW_HOST', 'extoarts.in');
define('INDEXNOW_ENDPOINT', 'https://api.indexnow.org/indexnow');

// IMPORTANT: Only ping URLs that are in the sitemap.
// Do NOT add pages that have been intentionally excluded from the sitemap.
// The sitemap is the source of truth - keep this list in sync with sitemap.xml.
$CORE_URLS = [
    // Tier 1 - main nav / sitelinks
    'https://extoarts.in/',
    'https://extoarts.in/services',
    'https://extoarts.in/portfolio',
    'https://extoarts.in/pricing',
    'https://extoarts.in/about',
    'https://extoarts.in/contact',
    // Tier 2 - supporting pages
    'https://extoarts.in/workflow',
    'https://extoarts.in/faq',
    'https://extoarts.in/estimate',
    'https://extoarts.in/collab',
    // Tier 3 - legal
    'https://extoarts.in/tos',
    'https://extoarts.in/privacy',
];

/**
 * Ping IndexNow with one or more URLs.
 * @param string|array $urls Single URL string or array of URL strings.
 * @return array ['status' => int, 'body' => string]
 */
function indexnow_ping($urls): array {
    if (is_string($urls)) {
        $urls = [$urls];
    }
    $urls = array_values(array_filter($urls));
    if (empty($urls)) {
        return ['status' => 0, 'body' => 'No URLs provided'];
    }

    $payload = json_encode([
        'host'    => INDEXNOW_HOST,
        'key'     => INDEXNOW_KEY,
        'keyLocation' => 'https://' . INDEXNOW_HOST . '/' . INDEXNOW_KEY . '.txt',
        'urlList' => $urls,
    ]);

    $ch = curl_init(INDEXNOW_ENDPOINT);
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 10,
        CURLOPT_HTTPHEADER     => [
            'Content-Type: application/json; charset=utf-8',
            'Content-Length: ' . strlen($payload),
        ],
    ]);
    $body   = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return ['status' => $status, 'body' => $body];
}

/**
 * Ping all core site URLs at once (batch submission).
 */
function indexnow_ping_all_core(): array {
    global $CORE_URLS;
    return indexnow_ping($CORE_URLS);
}

// CLI usage: php indexnow-ping.php [url1] [url2] ...
if (php_sapi_name() === 'cli') {
    $args = array_slice($argv ?? [], 1);
    if (!empty($args)) {
        $result = indexnow_ping($args);
        echo "Pinged " . count($args) . " URL(s) -> HTTP {$result['status']}\n";
        echo $result['body'] . "\n";
    } else {
        $result = indexnow_ping_all_core();
        global $CORE_URLS;
        echo "Pinged " . count($CORE_URLS) . " core URLs -> HTTP {$result['status']}\n";
        echo $result['body'] . "\n";
    }
    exit;
}

// Web access: only from localhost/CLI or with admin key
if (php_sapi_name() !== 'cli') {
    $admin_key = file_exists(__DIR__ . '/../data/config.json')
        ? (json_decode(file_get_contents(__DIR__ . '/../data/config.json'), true)['admin_password'] ?? '')
        : '';
    $provided  = $_GET['key'] ?? '';
    $remote    = $_SERVER['REMOTE_ADDR'] ?? '';
    if ($remote !== '127.0.0.1' && $remote !== '::1' && ($admin_key === '' || $provided !== $admin_key)) {
        http_response_code(403);
        echo json_encode(['ok' => false, 'error' => 'Forbidden']);
        exit;
    }
    header('Content-Type: application/json');
    $target = $_GET['url'] ?? null;
    $result = $target ? indexnow_ping($target) : indexnow_ping_all_core();
    echo json_encode(['ok' => $result['status'] === 200 || $result['status'] === 202, 'status' => $result['status'], 'body' => $result['body']]);
    exit;
}
