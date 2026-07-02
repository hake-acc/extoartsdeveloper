<?php
declare(strict_types=1);
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/notify.php';
auth_require('client');

$user = auth_user();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: /dashboard');
    exit;
}

if (!csrf_verify()) {
    header('Location: /dashboard?error=csrf');
    exit;
}

if (!rate_limit_check('order_submit_' . $user['id'], 5, 300)) {
    header('Location: /dashboard?error=rate_limit');
    exit;
}

$title           = trim($_POST['title'] ?? '');
$package_slug    = trim($_POST['package_slug'] ?? '');
$package_name    = trim($_POST['package_name'] ?? 'Custom Project');
$description     = trim($_POST['description'] ?? '');
$reference_links = trim($_POST['reference_links'] ?? '');
$budget          = trim($_POST['budget'] ?? '');
$deadline_raw    = trim($_POST['deadline'] ?? '');

if (!$title) { header('Location: /dashboard?error=' . urlencode('Project title is required.')); exit; }
if (strlen($title) > 300) { header('Location: /dashboard?error=' . urlencode('Title too long.')); exit; }
if (!$description || strlen($description) < 20) { header('Location: /dashboard?error=' . urlencode('Please describe your project (min 20 characters).')); exit; }
if (strlen($description) > 8000) { header('Location: /dashboard?error=' . urlencode('Description too long (max 8000 characters).')); exit; }
if (strlen($reference_links) > 2000) { header('Location: /dashboard?error=' . urlencode('Reference links too long (max 2000 characters).')); exit; }
if (strlen($budget) > 100) { $budget = substr($budget, 0, 100); }
if (strlen($package_slug) > 80) { $package_slug = substr($package_slug, 0, 80); }
if (strlen($package_name) > 120) { $package_name = substr($package_name, 0, 120); }

$deadline = null;
if ($deadline_raw) {
    $dt = DateTime::createFromFormat('Y-m-d', $deadline_raw);
    if ($dt && $dt > new DateTime()) $deadline = $deadline_raw;
}

try {
    $uid = (int)$user['id'];
    db_insert(
        "INSERT INTO orders (client_id, package_slug, package_name, title, description, reference_links, budget, deadline, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', datetime('now'), datetime('now'))",
        [$uid, $package_slug, $package_name, $title, $description, $reference_links, $budget, $deadline]
    );
    rate_limit_record('order_submit_' . $user['id']);
    notify_new_order($user, $title, $package_name, $description);
    header('Location: /dashboard?notice=order_placed');
} catch (Throwable $e) {
    error_log('[ExtoArts] order submit error: ' . $e->getMessage());
    header('Location: /dashboard?error=order_failed');
}
exit;
