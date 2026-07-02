<?php
declare(strict_types=1);
// Admin is now a role within the unified dashboard.
// This file redirects for backward compatibility.
require_once __DIR__ . '/../includes/auth.php';
$user = auth_user();
if ($user && $user['role'] === 'admin') {
    header('Location: /dashboard?tab=applications');
} else {
    header('Location: /login');
}
exit;
