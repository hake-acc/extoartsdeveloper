<?php
declare(strict_types=1);
/**
 * ExtoArts - Chat: Poll Messages
 * GET /api/chat-poll?oid=X&after=ISO_TIMESTAMP
 * Returns messages newer than `after` for the given order.
 */
define('_EXTOARTS_JSON_ENDPOINT', true);
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/_api.php';
auth_require('client', 'editor', 'admin');

$user = auth_user();
$uid  = (int)($user['id'] ?? 0);
$role = $user['role'];
$oid  = (int)($_GET['oid'] ?? 0);
$after = trim($_GET['after'] ?? '');

if ($oid < 1) {
    json_out(['ok' => false, 'error' => 'Invalid order.'], 400);
}

// Validate order access
$base_sql = "SELECT id, status, chat_cleared FROM orders WHERE id = ?";
if ($role === 'client') {
    $base_sql .= " AND client_id = ?";
    $order = db_fetch($base_sql . " LIMIT 1", [$oid, $uid]);
} elseif ($role === 'editor') {
    $base_sql .= " AND editor_id = ?";
    $order = db_fetch($base_sql . " LIMIT 1", [$oid, $uid]);
} else {
    $order = db_fetch($base_sql . " LIMIT 1", [$oid]);
}

if (!$order) {
    json_out(['ok' => false, 'error' => 'Access denied.'], 403);
}

try {
    if ($after !== '' && strtotime($after) !== false) {
        $messages = db_fetch_all(
            "SELECT id, sender_id, sender_name, sender_role, message, created_at
             FROM chat_messages WHERE order_id = ? AND created_at > ? ORDER BY created_at ASC LIMIT 100",
            [$oid, $after]
        );
    } else {
        $messages = db_fetch_all(
            "SELECT id, sender_id, sender_name, sender_role, message, created_at
             FROM chat_messages WHERE order_id = ? ORDER BY created_at ASC LIMIT 200",
            [$oid]
        );
    }
    json_out(['ok' => true, 'messages' => $messages]);
} catch (Throwable $e) {
    error_log('[ExtoArts] chat-poll error: ' . $e->getMessage());
    json_out(['ok' => false, 'error' => 'Could not load messages.', 'messages' => []], 500);
}
