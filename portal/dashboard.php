<?php
declare(strict_types=1);
require_once __DIR__ . '/../includes/auth.php';
auth_require('client', 'editor', 'admin');
secure_headers(true);

$user   = auth_user();
$uid    = (int)($user['id'] ?? 0);
$role   = $user['role'];
$status = $user['status'];

// ── Session sync: break editor purgatory loop ─────────────────────────────────
if ($role === 'editor' && $status === 'pending') {
    $row_sync = db_fetch("SELECT status FROM users WHERE id = ? LIMIT 1", [$uid]);
    if ($row_sync && $row_sync['status'] === 'active') {
        $_SESSION['user']['status'] = 'active';
        $user['status'] = $status = 'active';
    }
}

$notice      = $_GET['notice'] ?? '';
$success_msg = '';
$error_msg   = '';

$_get_error = trim($_GET['error'] ?? '');
if ($_get_error && !$error_msg) {
    $error_map = [
        'csrf'           => 'Security check failed. Please refresh and try again.',
        'rate_limit'     => 'Too many orders submitted too quickly. Please wait a few minutes.',
        'order_failed'   => 'Order could not be saved. Please try again or contact us on Discord.',
    ];
    $error_msg = $error_map[$_get_error] ?? htmlspecialchars($_get_error);
}

// ── Admin POST actions (form-based, non-AJAX) ─────────────────────────────────
if ($role === 'admin' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!csrf_verify()) {
        $error_msg = 'Security check failed.';
    } else {
        $action = $_POST['action'] ?? '';
        if ($action === 'approve_editor') {
            $app_id = (int)($_POST['app_id'] ?? 0);
            $auid   = (int)($_POST['user_id'] ?? 0);
            db_execute("UPDATE editor_applications SET status='approved', reviewed_at=NOW() WHERE id=?", [$app_id]);
            db_execute("UPDATE users SET status='active' WHERE id=? AND role='editor'", [$auid]);
            $success_msg = 'Editor approved.';
        } elseif ($action === 'reject_editor') {
            $app_id = (int)($_POST['app_id'] ?? 0);
            $auid   = (int)($_POST['user_id'] ?? 0);
            $note   = trim($_POST['admin_note'] ?? '');
            db_execute("UPDATE editor_applications SET status='rejected', admin_note=?, reviewed_at=NOW() WHERE id=?", [$note, $app_id]);
            db_execute("UPDATE users SET status='rejected' WHERE id=? AND role='editor'", [$auid]);
            $success_msg = 'Editor rejected.';
        } elseif ($action === 'reply_ticket') {
            $tid = (int)($_POST['ticket_id'] ?? 0);
            $msg = trim($_POST['reply_message'] ?? '');
            $tst = trim($_POST['ticket_status'] ?? 'in_progress');
            if ($tid > 0 && $msg) {
                db_insert("INSERT INTO ticket_replies (ticket_id, sender_id, sender_role, message, created_at) VALUES (?,?,'admin',?,NOW())", [$tid, $uid, $msg]);
                $resolved = in_array($tst, ['resolved','closed']) ? ", resolved_at=NOW()" : '';
                db_execute("UPDATE support_tickets SET status=?, updated_at=NOW() $resolved WHERE id=?", [$tst, $tid]);
                $success_msg = 'Reply sent.';
            }
        } elseif ($action === 'close_ticket') {
            $tid = (int)($_POST['ticket_id'] ?? 0);
            if ($tid > 0) { db_execute("UPDATE support_tickets SET status='closed', resolved_at=NOW(), updated_at=NOW() WHERE id=?", [$tid]); $success_msg = 'Ticket closed.'; }
        }
    }
}

// ── Data fetching ─────────────────────────────────────────────────────────────
$orders = $assigned_orders = $available_orders = $my_interests = [];
$stats  = [];
$app_status = null;
$editor_profile = null;
$editor_earnings = [];
$unread_notif_count = 0;
$recent_notifs = [];

// Common: payment methods (used by client + editor)
$payment_methods_list = db_fetch_all("SELECT * FROM payment_methods WHERE is_active=1 ORDER BY sort_order ASC, id ASC");

$status_labels = [
    'pending'                => ['Pending Review',          '#eab308'],
    'awaiting_half_payment'  => ['Awaiting 50% Payment',    '#f97316'],
    'half_paid'              => ['50% Payment Submitted',   '#60a5fa'],
    'in_progress'            => ['In Progress',             '#00c4f0'],
    'revision'               => ['Revision',                '#60a5fa'],
    'awaiting_final_payment' => ['Awaiting Final Payment',  '#f97316'],
    'final_paid'             => ['Final Payment Submitted', '#60a5fa'],
    'completed'              => ['Completed',               '#22c55e'],
    'cancelled'              => ['Cancelled',               '#6b7280'],
];

$admin_tab = $_GET['tab'] ?? ($role === 'admin' ? 'applications' : 'overview');
$dash_tab  = $_GET['tab'] ?? 'overview';

if ($role === 'client') {
    // One parallel round-trip: orders + unread notification IDs + recent notifications.
    // Unread count is derived in PHP (COUNT(*) not supported in PostgREST parallel fetch).
    $par = db_fetch_parallel([
        ["SELECT * FROM orders WHERE client_id=? ORDER BY created_at DESC LIMIT 50", [$uid]],
        ["SELECT id FROM notifications WHERE user_id=? AND is_read=0 LIMIT 200", [$uid]],
        ["SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC LIMIT 10", [$uid]],
    ]);
    $orders             = $par[0];
    $unread_notif_count = count($par[1]);
    $recent_notifs      = $par[2];

    $stats['total']     = count($orders);
    $stats['pending']   = count(array_filter($orders, fn($o) => $o['status'] === 'pending'));
    $stats['active']    = count(array_filter($orders, fn($o) => in_array($o['status'], ['in_progress','revision'])));
    $stats['completed'] = count(array_filter($orders, fn($o) => $o['status'] === 'completed'));

} elseif ($role === 'editor') {

    if ($status === 'active') {
        // Batch all independent simple reads into one parallel round-trip.
        $par = db_fetch_parallel([
            ["SELECT * FROM editor_applications WHERE user_id=? LIMIT 1", [$uid]],
            ["SELECT * FROM editor_profiles WHERE user_id=? LIMIT 1", [$uid]],
            ["SELECT order_id FROM order_interests WHERE editor_id=?", [$uid]],
            ["SELECT id FROM notifications WHERE user_id=? AND is_read=0 LIMIT 200", [$uid]],
            ["SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC LIMIT 10", [$uid]],
        ]);
        $app_status         = $par[0][0] ?? null;
        $editor_profile     = $par[1][0] ?? null;
        $my_interests       = array_column($par[2], 'order_id');
        $unread_notif_count = count($par[3]);
        $recent_notifs      = $par[4];

        // JOIN queries require php_exec RPC; run sequentially via PostgREST fallback.
        $assigned_orders = db_fetch_all(
            "SELECT o.*, u.name as client_name, u.avatar as client_avatar FROM orders o LEFT JOIN users u ON u.id=o.client_id WHERE o.editor_id=? ORDER BY o.updated_at DESC LIMIT 50",
            [$uid]
        );
        $available_orders = db_fetch_all(
            "SELECT o.*, u.name as client_name FROM orders o LEFT JOIN users u ON u.id=o.client_id WHERE o.status='pending' AND o.editor_id IS NULL ORDER BY o.created_at DESC LIMIT 50"
        );
        $editor_earnings = db_fetch_all(
            "SELECT op.*, o.title as order_title FROM order_payments op LEFT JOIN orders o ON o.id=op.order_id WHERE op.submitted_by IN (SELECT id FROM users WHERE id=?) OR o.editor_id=? AND op.status='approved' ORDER BY op.submitted_at DESC LIMIT 20",
            [$uid, $uid]
        );
        $stats['active']    = count(array_filter($assigned_orders, fn($o) => in_array($o['status'], ['in_progress','revision'])));
        $stats['available'] = count($available_orders);
        $stats['completed'] = count(array_filter($assigned_orders, fn($o) => $o['status'] === 'completed'));
        $stats['total']     = count($assigned_orders);

    } else {
        // Pending/rejected editor: fetch app + profile + notifications in one shot.
        $par = db_fetch_parallel([
            ["SELECT * FROM editor_applications WHERE user_id=? LIMIT 1", [$uid]],
            ["SELECT * FROM editor_profiles WHERE user_id=? LIMIT 1", [$uid]],
            ["SELECT id FROM notifications WHERE user_id=? AND is_read=0 LIMIT 200", [$uid]],
            ["SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC LIMIT 10", [$uid]],
        ]);
        $app_status         = $par[0][0] ?? null;
        $editor_profile     = $par[1][0] ?? null;
        $unread_notif_count = count($par[2]);
        $recent_notifs      = $par[3];
    }

} elseif ($role === 'admin') {
    // Parallelize the 4 simple (non-JOIN) admin queries into one round-trip.
    // Tickets use ORDER BY CASE which PostgREST cannot handle; we sort in PHP instead.
    $par_admin = db_fetch_parallel([
        ["SELECT * FROM users ORDER BY created_at DESC LIMIT 500", []],
        ["SELECT id, name FROM users WHERE role='editor' AND status='active' ORDER BY name", []],
        ["SELECT * FROM support_tickets ORDER BY created_at DESC LIMIT 200", []],
        ["SELECT * FROM payment_methods ORDER BY sort_order ASC, id ASC", []],
    ]);
    $all_users     = $par_admin[0];
    $editors_list  = $par_admin[1];
    $all_tickets   = $par_admin[2];
    $pm_list_admin = $par_admin[3];

    // Sort tickets by status priority in PHP (equivalent to ORDER BY CASE).
    $_ts_order = ['open'=>1,'in_progress'=>2,'waiting'=>3,'resolved'=>4,'closed'=>5];
    usort($all_tickets, fn($a,$b) =>
        ($_ts_order[$a['status']] ?? 9) <=> ($_ts_order[$b['status']] ?? 9)
        ?: strtotime($b['created_at'] ?? 0) <=> strtotime($a['created_at'] ?? 0)
    );
    $open_count = count(array_filter($all_tickets, fn($t) => in_array($t['status'], ['open','in_progress','waiting'])));

    // JOIN/aggregate queries — sequential (require php_exec for full results).
    $pending_apps     = db_fetch_all("SELECT a.*, u.name, u.email, u.avatar FROM editor_applications a JOIN users u ON u.id=a.user_id WHERE a.status='pending' ORDER BY a.submitted_at ASC");
    $all_orders_admin = db_fetch_all("SELECT o.*, c.name as client_name, e.name as editor_name FROM orders o LEFT JOIN users c ON c.id=o.client_id LEFT JOIN users e ON e.id=o.editor_id ORDER BY o.created_at DESC LIMIT 200");
    $pending_payments = db_fetch_all("SELECT op.*, o.title as order_title, u.name as submitter_name FROM order_payments op LEFT JOIN orders o ON o.id=op.order_id LEFT JOIN users u ON u.id=op.submitted_by WHERE op.status='pending' ORDER BY op.submitted_at DESC LIMIT 100");
    $all_interests    = db_fetch_all("SELECT oi.*, u.name as editor_name FROM order_interests oi LEFT JOIN users u ON u.id=oi.editor_id ORDER BY oi.created_at ASC");
    $interests_by_order = [];
    foreach ($all_interests as $int) { $interests_by_order[$int['order_id']][] = $int; }

    $stats = ['users'=>count($all_users),'orders'=>count($all_orders_admin),'apps'=>count($pending_apps),'tickets'=>$open_count];

    $open_ticket = $open_replies = null;
    if (isset($_GET['tid']) && $admin_tab === 'tickets') {
        $tid = (int)$_GET['tid'];
        $open_ticket  = db_fetch("SELECT * FROM support_tickets WHERE id=? LIMIT 1", [$tid]);
        $open_replies = $open_ticket ? db_fetch_all("SELECT * FROM ticket_replies WHERE ticket_id=? ORDER BY created_at ASC", [$tid]) : [];
    }
    $order_status_counts  = db_fetch_all("SELECT status, COUNT(*) as cnt FROM orders GROUP BY status");
    $analytics_revenue    = (float)(db_value("SELECT COALESCE(SUM(payment_amount),0) FROM orders WHERE status='completed' AND payment_amount>0") ?? 0);
    $analytics_active_rev = (float)(db_value("SELECT COALESCE(SUM(payment_amount),0) FROM orders WHERE status IN ('in_progress','revision','awaiting_final_payment','final_paid','half_paid') AND payment_amount>0") ?? 0);
    $user_role_counts     = db_fetch_all("SELECT role, COUNT(*) as cnt FROM users WHERE deleted_at IS NULL GROUP BY role");
    $recent_audit         = db_fetch_all("SELECT al.*, u.name as actor_name FROM audit_log al LEFT JOIN users u ON u.id=al.actor_id ORDER BY al.created_at DESC LIMIT 15");
}
// Notifications fetched inside client/editor blocks above. Admin has no notification panel.

$ticket_status_meta   = ['open'=>['Open','#eab308'],'in_progress'=>['In Progress','#00c4f0'],'waiting'=>['Waiting','#60a5fa'],'resolved'=>['Resolved','#22c55e'],'closed'=>['Closed','#6b7280']];
$ticket_priority_colors = ['low'=>'#6b7280','normal'=>'#00c4f0','high'=>'#f59e0b','urgent'=>'#ef4444'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><?php echo $role==='admin'?'Admin Panel':($role==='editor'?'Editor HQ':'My Dashboard'); ?> | ExtoArts</title>
<meta name="robots" content="noindex,nofollow">
<link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<style>@font-face{font-family:'Plus Jakarta Sans';font-style:normal;font-weight:400 900;font-display:swap;src:url('/css/fonts/plus-jakarta-sans.woff2') format('woff2');}</style>
<link rel="preload" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.44.0/dist/fonts/tabler-icons.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.44.0/dist/tabler-icons.min.css">
<style>
/* ═══════════════════════════════════════════════════════════════
   ExtoArts Dashboard — Professional Product Design System
   Principles: Stripe · Linear · Vercel
   ═══════════════════════════════════════════════════════════════ */
*{margin:0;padding:0;box-sizing:border-box;}

:root{
    /* Surface hierarchy — opaque, solid, no glass */
    --bg:        #09090f;
    --surface:   #0d1019;
    --surface2:  #111520;
    --surface3:  #161b28;
    /* Structural borders */
    --border:    #1e2232;
    --border-s:  #141826;
    /* Brand */
    --primary:   #00c4f0;
    --primary-glow: rgba(0,196,240,0.08);
    --primary-dim:  rgba(0,196,240,0.08);
    --primary-mid:  rgba(0,196,240,0.15);
    /* Text */
    --text-main: #dce0ee;
    --text-muted:#878ea4;
    --text-dim:  #4e546a;
    /* Status */
    --green:     #22c55e;
    --yellow:    #eab308;
    --red:       #ef4444;
    --orange:    #f97316;
    --blue:      #60a5fa;
    --purple:    #60a5fa;   /* remapped — violet is banned */
    /* Motion */
    --easing:    cubic-bezier(0.16,1,0.3,1);
}

body{background:var(--bg);color:var(--text-main);font-family:'Plus Jakarta Sans',sans-serif;min-height:100vh;display:flex;flex-direction:column;}
a{color:inherit;text-decoration:none;}
button{font-family:inherit;}

/* ── Topbar ─────────────────────────────────────────────────── */
.topbar{background:var(--bg);border-bottom:1px solid var(--border);padding:0 22px;display:flex;align-items:center;justify-content:space-between;height:56px;position:sticky;top:0;z-index:100;gap:12px;}
.topbar-left{display:flex;align-items:center;gap:9px;}
.brand{font-weight:800;font-size:0.96rem;letter-spacing:-0.3px;display:flex;align-items:center;gap:8px;color:var(--text-main);}
.admin-badge{font-size:0.56rem;font-weight:800;text-transform:uppercase;letter-spacing:2px;padding:3px 7px;border-radius:4px;background:rgba(239,68,68,0.1);color:#fca5a5;border:1px solid rgba(239,68,68,0.2);}
.editor-badge{font-size:0.56rem;font-weight:800;text-transform:uppercase;letter-spacing:2px;padding:3px 7px;border-radius:4px;background:rgba(96,165,250,0.1);color:#93c5fd;border:1px solid rgba(96,165,250,0.2);}
.topbar-right{display:flex;align-items:center;gap:8px;}
.user-chip{display:flex;align-items:center;gap:7px;padding:4px 10px 4px 4px;border:1px solid var(--border);border-radius:7px;font-size:0.81rem;font-weight:600;cursor:default;background:var(--surface);}
.user-chip img{width:24px;height:24px;border-radius:50%;object-fit:cover;}
.role-badge{font-size:0.57rem;font-weight:800;text-transform:uppercase;letter-spacing:1px;padding:2px 6px;border-radius:4px;}
.role-client{background:var(--primary-dim);color:var(--primary);}
.role-editor{background:rgba(96,165,250,0.1);color:#93c5fd;}
.role-admin{background:rgba(239,68,68,0.1);color:#fca5a5;}
.mob-menu-btn{display:none;background:none;border:none;color:var(--text-muted);font-size:1.05rem;cursor:pointer;padding:7px;border-radius:7px;transition:0.16s;}
.mob-menu-btn:hover{background:var(--surface2);color:var(--text-main);}

/* ── Buttons ─────────────────────────────────────────────────── */
.btn{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:7px;font-size:0.82rem;font-weight:700;border:none;cursor:pointer;transition:all 0.15s var(--easing);white-space:nowrap;}
.btn-primary{background:var(--primary);color:#000;}
.btn-primary:hover{background:#22d3ee;box-shadow:0 0 0 3px rgba(0,196,240,0.15);}
.btn-outline{background:transparent;border:1px solid var(--border);color:var(--text-muted);}
.btn-outline:hover{background:var(--surface2);color:var(--text-main);}
.btn-sm{padding:5px 11px;font-size:0.78rem;}
.btn-xs{padding:3px 8px;font-size:0.72rem;border-radius:5px;}
.btn-approve{background:rgba(34,197,94,0.08);color:var(--green);border:1px solid rgba(34,197,94,0.2);}
.btn-approve:hover{background:rgba(34,197,94,0.16);}
.btn-reject{background:rgba(239,68,68,0.07);color:var(--red);border:1px solid rgba(239,68,68,0.18);}
.btn-reject:hover{background:rgba(239,68,68,0.14);}
.btn-interest{background:var(--primary-dim);color:var(--primary);border:1px solid rgba(0,196,240,0.18);}
.btn-interest:hover{background:var(--primary-mid);}
.btn-withdraw{background:var(--surface2);color:var(--text-muted);border:1px solid var(--border);}
.btn-withdraw:hover{background:var(--surface3);color:var(--text-main);}
.btn-full{width:100%;justify-content:center;}

/* ── Layout ──────────────────────────────────────────────────── */
.main{flex:1;display:flex;min-height:0;}
.sidebar{width:212px;flex-shrink:0;border-right:1px solid var(--border);padding:12px 8px;display:flex;flex-direction:column;gap:1px;position:sticky;top:56px;height:calc(100vh - 56px);overflow-y:auto;background:var(--bg);}
.sidebar-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:149;}
.sidebar-overlay.open{display:block;}
/* Nav — Linear-style: minimal shift on hover, icon lights on active */
.nav-item{display:flex;align-items:center;gap:9px;padding:7px 10px;border-radius:6px;font-size:0.83rem;font-weight:500;color:var(--text-dim);transition:color 0.14s,background 0.14s;cursor:pointer;white-space:nowrap;}
.nav-item:hover{background:var(--surface2);color:var(--text-muted);}
.nav-item.active{background:var(--surface2);color:var(--text-main);font-weight:600;}
.nav-item.active i{color:var(--primary);}
.nav-item i{width:15px;text-align:center;font-size:0.86rem;flex-shrink:0;}
.nav-divider{height:1px;background:var(--border);margin:8px 2px;}
.nav-label{font-size:0.59rem;font-weight:700;text-transform:uppercase;letter-spacing:2.5px;color:var(--text-dim);padding:8px 10px 2px;}
.badge-cnt{margin-left:auto;font-size:0.62rem;font-weight:800;padding:1px 6px;border-radius:4px;min-width:18px;text-align:center;}
.badge-red{background:rgba(239,68,68,0.12);color:var(--red);border:1px solid rgba(239,68,68,0.18);}
.badge-cyan{background:var(--primary-dim);color:var(--primary);border:1px solid rgba(0,196,240,0.18);}
.badge-yellow{background:rgba(234,179,8,0.1);color:var(--yellow);border:1px solid rgba(234,179,8,0.18);}

/* ── Content ─────────────────────────────────────────────────── */
.content{flex:1;padding:28px 30px;overflow-y:auto;max-width:1120px;}
@media(max-width:1200px){.content{max-width:100%;}}

/* ── Welcome ─────────────────────────────────────────────────── */
.welcome-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:26px;flex-wrap:wrap;gap:12px;}
.welcome-text h1{font-size:1.45rem;font-weight:800;letter-spacing:-0.5px;}
.welcome-text p{color:var(--text-muted);font-size:0.84rem;margin-top:3px;}

/* ── Stats — Stripe-style: one container, cells separated by 1px gap ── */
.stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:1px;margin-bottom:26px;background:var(--border);border:1px solid var(--border);border-radius:10px;overflow:hidden;}
.stat-card{background:var(--surface);padding:20px 20px;transition:background 0.14s;}
.stat-card:hover{background:var(--surface2);}
.stat-num{font-size:1.75rem;font-weight:800;letter-spacing:-1.5px;line-height:1;margin-bottom:5px;}
.stat-label{font-size:0.67rem;color:var(--text-dim);text-transform:uppercase;letter-spacing:1.2px;font-weight:700;}

/* ── Section title ───────────────────────────────────────────── */
.section-title{font-size:0.87rem;font-weight:700;margin-bottom:10px;display:flex;align-items:center;justify-content:space-between;gap:10px;color:var(--text-muted);}

/* ── Tables ──────────────────────────────────────────────────── */
.tbl-wrap{background:var(--surface);border:1px solid var(--border);border-radius:10px;overflow:hidden;overflow-x:auto;margin-bottom:22px;}
.tbl{width:100%;border-collapse:collapse;}
.tbl th{font-size:0.67rem;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--text-dim);padding:10px 14px;text-align:left;border-bottom:1px solid var(--border);white-space:nowrap;background:var(--surface);}
.tbl td{padding:11px 14px;font-size:0.83rem;border-bottom:1px solid var(--border-s);vertical-align:middle;}
.tbl tr:last-child td{border-bottom:none;}
.tbl tr:hover td{background:var(--surface2);}

/* ── Status pills — rectangular chips, not bubbles ───────────── */
.pill{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:4px;font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;white-space:nowrap;}

/* ── Notices ─────────────────────────────────────────────────── */
.notice{padding:10px 14px;border-radius:8px;margin-bottom:18px;font-size:0.84rem;line-height:1.55;display:flex;align-items:flex-start;gap:9px;}
.notice-pending{background:rgba(0,196,240,0.05);border:1px solid rgba(0,196,240,0.16);color:var(--primary);}
.notice-success{background:rgba(34,197,94,0.06);border:1px solid rgba(34,197,94,0.18);color:#86efac;}
.notice-error{background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.18);color:#fca5a5;}
.notice-warning{background:rgba(234,179,8,0.05);border:1px solid rgba(234,179,8,0.18);color:#fde68a;}

/* ── Empty states ────────────────────────────────────────────── */
.empty-state{text-align:center;padding:52px 24px;border:1px solid var(--border);border-radius:10px;background:var(--surface);}
.empty-icon{width:52px;height:52px;background:var(--surface2);border:1px solid var(--border);border-radius:10px;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;font-size:1.25rem;color:var(--text-dim);}
.empty-state h3{font-weight:800;margin-bottom:6px;font-size:0.97rem;}
.empty-state p{color:var(--text-muted);font-size:0.84rem;line-height:1.6;max-width:320px;margin:0 auto;}
.empty-cta{margin-top:20px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap;}

/* ── Order cards ─────────────────────────────────────────────── */
.order-cards{display:flex;flex-direction:column;gap:8px;}
.order-card{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:16px 18px;transition:background 0.14s,border-color 0.14s;}
.order-card:hover{background:var(--surface2);}
.order-card[data-status="in_progress"]{border-left:3px solid var(--primary);}
.order-card[data-status="revision"]{border-left:3px solid var(--blue);}
.order-card[data-status="awaiting_half_payment"]{border-left:3px solid var(--orange);}
.order-card[data-status="awaiting_final_payment"]{border-left:3px solid var(--orange);}
.order-card[data-status="completed"]{border-left:3px solid var(--green);}

/* ── Payment inputs ──────────────────────────────────────────── */
.pay-input{width:100%;background:var(--surface2);border:1px solid var(--border);border-radius:7px;color:var(--text-main);font-family:inherit;font-size:0.83rem;padding:8px 12px;outline:none;transition:border-color 0.16s;}
.pay-input:focus{border-color:var(--primary);}

/* ── Editor job cards ────────────────────────────────────────── */
.job-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:8px;}
.job-card{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:16px;transition:background 0.14s,border-color 0.14s;display:flex;flex-direction:column;gap:10px;}
.job-card:hover{background:var(--surface2);}
.job-card.interested{border-color:rgba(0,196,240,0.3);background:rgba(0,196,240,0.025);}
.job-pkg{font-size:0.65rem;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:var(--primary);margin-bottom:3px;}
.job-title{font-weight:700;font-size:0.94rem;line-height:1.35;}
.job-meta{display:flex;gap:8px;flex-wrap:wrap;}
.job-meta-item{font-size:0.75rem;color:var(--text-muted);display:flex;align-items:center;gap:4px;}
.job-desc{font-size:0.81rem;color:var(--text-muted);line-height:1.55;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;}
.job-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:auto;}

/* ── Work cards ──────────────────────────────────────────────── */
.work-cards{display:flex;flex-direction:column;gap:8px;}
.work-card{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:16px 18px;}
.work-card[data-status="in_progress"]{border-left:3px solid var(--primary);}
.work-card[data-status="revision"]{border-left:3px solid var(--blue);}
.work-card[data-status="awaiting_final_payment"]{border-left:3px solid var(--orange);}
.work-card[data-status="completed"]{border-left:3px solid var(--green);}
.progress-bar{height:3px;background:var(--border);border-radius:3px;overflow:hidden;margin:10px 0;}
.progress-fill{height:100%;border-radius:3px;transition:width 0.6s var(--easing);}

/* ── App cards (admin) ───────────────────────────────────────── */
.app-card{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:18px;margin-bottom:8px;}
.app-header{display:flex;align-items:center;gap:11px;margin-bottom:14px;}
.app-header img{width:36px;height:36px;border-radius:50%;object-fit:cover;border:2px solid var(--border);}

/* ── Admin table status accents ──────────────────────────────── */
.tbl tr[data-status="in_progress"] td:first-child{box-shadow:inset 3px 0 0 var(--primary);}
.tbl tr[data-status="revision"] td:first-child{box-shadow:inset 3px 0 0 var(--blue);}
.tbl tr[data-status="pending"] td:first-child{box-shadow:inset 3px 0 0 var(--yellow);}
.tbl tr[data-status="awaiting_half_payment"] td:first-child,.tbl tr[data-status="awaiting_final_payment"] td:first-child{box-shadow:inset 3px 0 0 var(--orange);}
.tbl tr[data-status="completed"] td:first-child{box-shadow:inset 3px 0 0 var(--green);}

/* ── Form inputs ─────────────────────────────────────────────── */
input[type=text],input[type=url],input[type=number],input[type=date],select,textarea{width:100%;background:var(--surface2);border:1px solid var(--border);border-radius:7px;padding:9px 12px;color:var(--text-main);font-size:0.87rem;font-family:inherit;outline:none;transition:border-color 0.16s;}
input:focus,select:focus,textarea:focus{border-color:var(--primary);background:var(--surface3);}
textarea{resize:vertical;min-height:80px;}
select option{background:var(--surface);}
.form-group{margin-bottom:15px;}
.form-group label{display:block;font-size:0.79rem;font-weight:700;margin-bottom:5px;color:var(--text-muted);}
.form-row-2{display:grid;grid-template-columns:1fr 1fr;gap:12px;}

/* ── Modal ───────────────────────────────────────────────────── */
.modal-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.72);z-index:200;align-items:center;justify-content:center;}
.modal-overlay.open{display:flex;}
.modal{background:var(--surface);border:1px solid var(--border);border-radius:12px;width:100%;max-width:600px;max-height:90vh;overflow-y:auto;padding:26px;position:relative;box-shadow:0 24px 56px rgba(0,0,0,0.55);}
.modal h2{font-size:1.08rem;font-weight:800;margin-bottom:20px;letter-spacing:-0.3px;}
.modal-close{position:absolute;top:12px;right:12px;background:none;border:none;color:var(--text-muted);font-size:0.97rem;cursor:pointer;padding:6px;border-radius:6px;transition:0.15s;}
.modal-close:hover{color:var(--text-main);background:var(--surface2);}

/* Package options */
.pkg-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:6px;}
.pkg-option{border:1px solid var(--border);border-radius:8px;padding:10px;cursor:pointer;transition:0.16s;background:var(--surface2);}
.pkg-option:hover{border-color:var(--primary);}
.pkg-option.selected{border-color:var(--primary);background:rgba(0,196,240,0.06);}
.pkg-option input{display:none;}
.pkg-name{font-weight:700;font-size:0.85rem;margin-bottom:2px;}
.pkg-desc{font-size:0.72rem;color:var(--text-muted);line-height:1.4;}

/* ── Chat panel ──────────────────────────────────────────────── */
.chat-panel{position:fixed;top:0;right:-100%;width:400px;max-width:100vw;height:100vh;background:var(--surface);border-left:1px solid var(--border);z-index:300;display:flex;flex-direction:column;transition:right 0.3s var(--easing);}
.chat-panel.open{right:0;}
.chat-panel-header{padding:13px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:12px;flex-shrink:0;}
.chat-panel-title{font-weight:700;font-size:0.9rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.chat-panel-body{flex:1;overflow:hidden;}
.chat-panel-body iframe{width:100%;height:100%;border:none;}
.chat-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:299;opacity:0;pointer-events:none;transition:opacity 0.3s;}
.chat-overlay.open{opacity:1;pointer-events:all;}

/* ── Interest banner ─────────────────────────────────────────── */
.interest-banner{background:var(--primary-dim);border:1px solid rgba(0,196,240,0.16);border-radius:7px;padding:9px 13px;font-size:0.81rem;color:var(--primary);margin-bottom:14px;}

/* ── Ticket detail ───────────────────────────────────────────── */
.ticket-view{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:20px;margin-top:16px;}
.msg-bubble{padding:10px 14px;border-radius:8px;margin-bottom:8px;font-size:0.85rem;line-height:1.6;}
.msg-admin{background:rgba(0,196,240,0.05);border:1px solid rgba(0,196,240,0.12);margin-left:24px;}
.msg-user{background:var(--surface2);border:1px solid var(--border);}
.msg-meta{font-size:0.68rem;color:var(--text-dim);margin-bottom:4px;}

/* ── Profile form ────────────────────────────────────────────── */
.profile-section{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:20px;margin-bottom:12px;}
.profile-section h3{font-size:0.87rem;font-weight:800;margin-bottom:16px;display:flex;align-items:center;gap:8px;}
.profile-section h3 i{color:var(--primary);}

/* ── Earnings ────────────────────────────────────────────────── */
.earnings-card{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:16px 18px;display:flex;align-items:center;gap:12px;}
.earnings-icon{width:44px;height:44px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0;}

/* ── Skeleton loaders ────────────────────────────────────────── */
.skeleton{background:var(--surface2);border-radius:6px;position:relative;overflow:hidden;}
.skeleton::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.025) 50%,transparent 100%);animation:sk-wave 1.8s ease-in-out infinite;}
@keyframes sk-wave{0%{transform:translateX(-100%);}100%{transform:translateX(100%);}}

/* ── Responsive ──────────────────────────────────────────────── */
@media(max-width:900px){.content{padding:20px 16px;}}
@media(max-width:768px){
    .mob-menu-btn{display:flex;align-items:center;justify-content:center;}
    .user-chip span:not(.role-badge){display:none;}
    .sidebar{position:fixed;left:-225px;top:0;height:100vh;width:218px;z-index:150;background:var(--surface);border-right:1px solid var(--border);padding:62px 8px 24px;transition:left 0.26s var(--easing);overflow-y:auto;}
    .sidebar.open{left:0;}
    .main{flex-direction:column;}
    .content{padding:16px 14px;max-width:100%;}
    .stats-grid{grid-template-columns:1fr 1fr;}
    .welcome-row{flex-direction:column;align-items:flex-start;gap:8px;margin-bottom:18px;}
    .welcome-text h1{font-size:1.3rem;}
    .modal-overlay{align-items:flex-end;}
    .modal{border-radius:12px 12px 0 0;max-width:100%;max-height:92vh;padding:20px 16px;margin:0;}
    .pkg-grid{grid-template-columns:1fr;}
    .form-row-2{grid-template-columns:1fr;}
    .job-cards{grid-template-columns:1fr;}
}
@media(max-width:420px){.content{padding:12px 10px;}.stat-num{font-size:1.5rem;}}

/* ── Notification bell ───────────────────────────────────────── */
.notif-bell{position:relative;}
.notif-btn{background:none;border:1px solid var(--border);color:var(--text-muted);font-size:0.92rem;cursor:pointer;padding:6px 9px;border-radius:7px;transition:0.16s;display:flex;align-items:center;justify-content:center;position:relative;}
.notif-btn:hover{background:var(--surface2);color:var(--text-main);}
.notif-badge{position:absolute;top:-5px;right:-5px;min-width:15px;height:15px;background:var(--red);color:#fff;border-radius:50%;font-size:0.57rem;font-weight:800;display:flex;align-items:center;justify-content:center;padding:0 3px;border:2px solid var(--bg);}
.notif-dropdown{position:absolute;top:calc(100% + 6px);right:0;width:288px;background:var(--surface);border:1px solid var(--border);border-radius:10px;box-shadow:0 16px 40px rgba(0,0,0,0.5);z-index:500;overflow:hidden;display:none;}
.notif-dropdown.open{display:block;}
.notif-header{padding:9px 13px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;}
.notif-header strong{font-size:0.78rem;}
.notif-item{padding:9px 13px;border-bottom:1px solid var(--border-s);transition:background 0.14s;}
.notif-item.unread{background:rgba(0,196,240,0.04);}
.notif-item-title{font-size:0.8rem;font-weight:700;margin-bottom:2px;}
.notif-item-body{font-size:0.73rem;color:var(--text-muted);line-height:1.4;}
.notif-item-time{font-size:0.64rem;color:var(--text-dim);margin-top:2px;}
.notif-empty{padding:22px 16px;text-align:center;font-size:0.82rem;color:var(--text-muted);}

/* ── Search / filter ─────────────────────────────────────────── */
.tbl-search{width:100%;background:var(--surface2);border:1px solid var(--border);border-radius:7px;padding:8px 12px;color:var(--text-main);font-size:0.84rem;font-family:inherit;outline:none;transition:border-color 0.16s;margin-bottom:10px;}
.tbl-search:focus{border-color:var(--primary);}

/* ── Analytics ───────────────────────────────────────────────── */
.analytics-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:18px;}
@media(max-width:680px){.analytics-grid{grid-template-columns:1fr;}}
.analytics-card{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:16px;}
.analytics-card h3{font-size:0.73rem;font-weight:800;text-transform:uppercase;letter-spacing:1.2px;color:var(--text-dim);margin-bottom:12px;}
.donut-legend{display:flex;flex-direction:column;gap:6px;flex:1;min-width:0;}
.donut-legend-item{display:flex;align-items:center;gap:7px;font-size:0.75rem;}
.donut-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}

/* ── Delete user modal ───────────────────────────────────────── */
.del-choice{border:1px solid var(--border);border-radius:8px;padding:12px 14px;cursor:pointer;transition:border-color 0.16s,background 0.16s;margin-bottom:8px;background:var(--surface2);}
.del-choice:hover{border-color:rgba(239,68,68,0.32);background:rgba(239,68,68,0.04);}
.del-choice h4{font-size:0.85rem;font-weight:800;margin-bottom:3px;}
.del-choice p{font-size:0.76rem;color:var(--text-muted);line-height:1.45;}
</style>
</head>
<body>

<div class="sidebar-overlay" id="sidebarOverlay" onclick="closeSidebar()"></div>

<div class="topbar">
    <div class="topbar-left">
        <button class="mob-menu-btn" onclick="toggleSidebar()" aria-label="Menu"><i class="ti ti-menu-2"></i></button>
        <a href="/" class="brand">
            <svg width="28" height="28" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="36" height="36" rx="9" fill="#0a0a14"/><path d="M10.5 10.5V25.5M10.5 10.5H24M10.5 18H20.5M10.5 25.5H24" stroke="#22d3ee" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            ExtoArts
            <?php if ($role === 'admin'): ?><span class="admin-badge">Admin</span><?php endif; ?>
            <?php if ($role === 'editor'): ?><span class="editor-badge">Editor</span><?php endif; ?>
        </a>
    </div>
    <div class="topbar-right">
        <div class="user-chip">
            <img src="<?php echo htmlspecialchars($user['avatar'] ?: 'https://i.ibb.co/JR76yvRp/1758037248-icon.png'); ?>" alt="<?php echo htmlspecialchars($user['name'] ?: $user['username'] ?? 'User'); ?> profile photo">
            <span><?php echo htmlspecialchars(explode(' ', $user['name'] ?: $user['username'] ?? 'User')[0]); ?></span>
            <span class="role-badge role-<?php echo $role; ?>"><?php echo ucfirst($role); ?></span>
        </div>
        <?php if ($role !== 'admin'): ?>
        <div class="notif-bell" id="notifBell">
            <button class="notif-btn" id="notifBtn" onclick="toggleNotifDropdown()" aria-label="Notifications">
                <i class="ti ti-bell"></i>
                <?php if ($unread_notif_count > 0): ?><span class="notif-badge"><?php echo min($unread_notif_count, 9); ?></span><?php endif; ?>
            </button>
            <div class="notif-dropdown" id="notifDropdown">
                <div class="notif-header">
                    <strong>Notifications</strong>
                    <?php if ($unread_notif_count > 0): ?><button onclick="markAllNotifsRead()" style="background:none;border:none;color:var(--primary);font-size:0.73rem;cursor:pointer;font-weight:700;padding:0;">Mark all read</button><?php endif; ?>
                </div>
                <?php if (empty($recent_notifs)): ?>
                <div class="notif-empty">No notifications yet</div>
                <?php else: foreach ($recent_notifs as $n):
                    $nc = ['info'=>'var(--primary)','success'=>'var(--green)','warning'=>'var(--yellow)','error'=>'var(--red)'][$n['type']] ?? 'var(--primary)'; ?>
                <div class="notif-item <?php echo $n['is_read'] ? '' : 'unread'; ?>">
                    <div class="notif-item-title" style="color:<?php echo $nc; ?>;"><?php echo htmlspecialchars($n['title']); ?></div>
                    <?php if ($n['body']): ?><div class="notif-item-body"><?php echo htmlspecialchars($n['body']); ?></div><?php endif; ?>
                    <div class="notif-item-time"><?php echo date('M j, g:ia', strtotime($n['created_at'])); ?></div>
                </div>
                <?php endforeach; endif; ?>
            </div>
        </div>
        <?php endif; ?>
        <a href="/logout" class="btn btn-outline btn-sm">Logout</a>
    </div>
</div>

<div class="main">
<aside class="sidebar" id="sidebar">
<?php if ($role === 'admin'): ?>
    <div class="nav-label">Admin</div>
    <a href="/dashboard?tab=applications" class="nav-item <?php echo $admin_tab==='applications'?'active':''; ?>">
        <i class="ti ti-user-check"></i>Applications
        <?php if (count($pending_apps) > 0): ?><span class="badge-cnt badge-red"><?php echo count($pending_apps); ?></span><?php endif; ?>
    </a>
    <a href="/dashboard?tab=orders" class="nav-item <?php echo $admin_tab==='orders'?'active':''; ?>">
        <i class="ti ti-briefcase"></i>Orders
        <span class="badge-cnt badge-cyan"><?php echo count($all_orders_admin); ?></span>
    </a>
    <a href="/dashboard?tab=users" class="nav-item <?php echo $admin_tab==='users'?'active':''; ?>">
        <i class="ti ti-users"></i>Users
    </a>
    <a href="/dashboard?tab=tickets" class="nav-item <?php echo $admin_tab==='tickets'?'active':''; ?>">
        <i class="ti ti-headset"></i>Tickets
        <?php if ($open_count > 0): ?><span class="badge-cnt badge-red"><?php echo $open_count; ?></span><?php endif; ?>
    </a>
    <a href="/dashboard?tab=payments" class="nav-item <?php echo $admin_tab==='payments'?'active':''; ?>">
        <i class="ti ti-wallet"></i>Payments
        <?php if (count($pending_payments) > 0): ?><span class="badge-cnt badge-yellow"><?php echo count($pending_payments); ?></span><?php endif; ?>
    </a>
    <a href="/dashboard?tab=analytics" class="nav-item <?php echo $admin_tab==='analytics'?'active':''; ?>">
        <i class="ti ti-chart-pie"></i>Analytics
    </a>
    <div class="nav-divider"></div>
    <a href="/" class="nav-item"><i class="ti ti-world"></i>View Site</a>
    <a href="/logout" class="nav-item" style="color:var(--red);"><i class="ti ti-logout"></i>Logout</a>

<?php elseif ($role === 'client'): ?>
    <div class="nav-label">Dashboard</div>
    <a href="/dashboard" class="nav-item <?php echo $dash_tab==='overview'?'active':''; ?>"><i class="ti ti-home"></i>Overview</a>
    <a href="#" class="nav-item" onclick="openOrderModal();closeSidebar();return false;"><i class="ti ti-circle-plus"></i>New Order</a>
    <a href="#orders" class="nav-item" onclick="closeSidebar()"><i class="ti ti-list"></i>My Orders</a>
    <div class="nav-divider"></div>
    <div class="nav-label">Help</div>
    <a href="https://discord.gg/extoarts-1402333030827425922" target="_blank" class="nav-item" style="color:#5865f2;"><i class="ti ti-brand-discord"></i>Discord</a>
    <a href="/tos" class="nav-item"><i class="ti ti-file-description"></i>Terms</a>
    <div class="nav-divider"></div>
    <a href="/logout" class="nav-item" style="color:var(--red);"><i class="ti ti-logout"></i>Logout</a>

<?php else: /* editor */ ?>
    <div class="nav-label">Editor HQ</div>
    <a href="/dashboard" class="nav-item <?php echo $dash_tab==='overview'?'active':''; ?>"><i class="ti ti-home"></i>Overview</a>
    <?php if ($status === 'active'): ?>
    <a href="/dashboard?tab=jobs" class="nav-item <?php echo $dash_tab==='jobs'?'active':''; ?>">
        <i class="ti ti-search"></i>Available Jobs
        <?php if (!empty($available_orders)): ?><span class="badge-cnt badge-cyan"><?php echo count($available_orders); ?></span><?php endif; ?>
    </a>
    <a href="/dashboard?tab=work" class="nav-item <?php echo $dash_tab==='work'?'active':''; ?>">
        <i class="ti ti-movie"></i>My Work
        <?php $active_work = count(array_filter($assigned_orders, fn($o) => in_array($o['status'],['in_progress','revision']))); ?>
        <?php if ($active_work > 0): ?><span class="badge-cnt badge-yellow"><?php echo $active_work; ?></span><?php endif; ?>
    </a>
    <a href="/dashboard?tab=earnings" class="nav-item <?php echo $dash_tab==='earnings'?'active':''; ?>"><i class="ti ti-currency-dollar"></i>Earnings</a>
    <a href="/dashboard?tab=profile" class="nav-item <?php echo $dash_tab==='profile'?'active':''; ?>"><i class="ti ti-user-edit"></i>My Profile</a>
    <?php endif; ?>
    <a href="/dashboard?tab=application" class="nav-item <?php echo $dash_tab==='application'?'active':''; ?>"><i class="ti ti-file-text"></i>Application</a>
    <div class="nav-divider"></div>
    <a href="https://discord.gg/extoarts-1402333030827425922" target="_blank" class="nav-item" style="color:#5865f2;"><i class="ti ti-brand-discord"></i>Discord</a>
    <a href="/logout" class="nav-item" style="color:var(--red);"><i class="ti ti-logout"></i>Logout</a>
<?php endif; ?>
</aside>

<main class="content">
<?php if ($success_msg): ?><div class="notice notice-success"><i class="ti ti-circle-check" style="margin-right:8px;"></i><?php echo htmlspecialchars($success_msg); ?></div><?php endif; ?>
<?php if ($error_msg): ?><div class="notice notice-error"><i class="ti ti-alert-circle" style="margin-right:8px;"></i><?php echo htmlspecialchars($error_msg); ?></div><?php endif; ?>
<?php if ($notice === 'welcome'): ?><div class="notice notice-success"><i class="ti ti-star" style="margin-right:8px;"></i><strong>Welcome!</strong> Your account is ready. Place your first order below.</div><?php endif; ?>
<?php if ($notice === 'order_placed'): ?><div class="notice notice-success"><i class="ti ti-circle-check" style="margin-right:8px;"></i>Order placed! We'll review it and get back to you soon.</div><?php endif; ?>

<?php
// ═══════════════════════════════════════════════════════════════════
// ADMIN PANEL
// ═══════════════════════════════════════════════════════════════════
if ($role === 'admin'):
?>
<div class="welcome-row">
    <div class="welcome-text">
        <h1><?php $tnames=['applications'=>'Editor Applications','orders'=>'Orders','users'=>'Users','tickets'=>'Support Tickets','payments'=>'Payments','analytics'=>'Analytics']; echo $tnames[$admin_tab]??'Admin Panel'; ?></h1>
        <p><?php echo date('l, F j, Y'); ?></p>
    </div>
</div>
<div class="stats-grid">
    <div class="stat-card"><div class="stat-num"><?php echo $stats['users']??0; ?></div><div class="stat-label">Users</div></div>
    <div class="stat-card"><div class="stat-num" style="color:var(--primary);"><?php echo $stats['orders']??0; ?></div><div class="stat-label">Orders</div></div>
    <div class="stat-card"><div class="stat-num" style="color:var(--yellow);"><?php echo $stats['apps']??0; ?></div><div class="stat-label">Pending Apps</div></div>
    <div class="stat-card"><div class="stat-num" style="color:var(--red);"><?php echo $stats['tickets']??0; ?></div><div class="stat-label">Open Tickets</div></div>
</div>

<?php if ($admin_tab === 'applications'): ?>
<?php if (empty($pending_apps)): ?>
<div class="empty-state"><div class="empty-icon" style="background:rgba(245,158,11,0.08);border-color:rgba(245,158,11,0.2);color:var(--yellow);"><i class="ti ti-user-check"></i></div><h3>No pending applications</h3><p>New editor applications will appear here for review.</p></div>
<?php else: foreach ($pending_apps as $app): ?>
<div class="app-card">
    <div class="app-header">
        <img src="<?php echo htmlspecialchars($app['avatar']?:'https://i.ibb.co/JR76yvRp/1758037248-icon.png'); ?>" alt="<?php echo htmlspecialchars($app['display_name'] ?? 'Applicant'); ?> profile photo">
        <div><div style="font-weight:800;font-size:0.95rem;"><?php echo htmlspecialchars($app['display_name']); ?></div><div style="font-size:0.78rem;color:var(--text-muted);"><?php echo htmlspecialchars($app['email']); ?></div></div>
    </div>
    <div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:12px;">
        <span style="font-size:0.79rem;color:var(--text-muted);"><strong style="color:var(--text-main);">Specialties:</strong> <?php echo htmlspecialchars($app['specialties']); ?></span>
        <span style="font-size:0.79rem;color:var(--text-muted);"><strong style="color:var(--text-main);">Tools:</strong> <?php echo htmlspecialchars($app['tools']); ?></span>
        <span style="font-size:0.79rem;color:var(--text-muted);"><strong style="color:var(--text-main);">Exp:</strong> <?php echo $app['experience_years']; ?> yrs</span>
        <span style="font-size:0.79rem;color:var(--text-muted);"><strong style="color:var(--text-main);">TZ:</strong> <?php echo htmlspecialchars($app['timezone']); ?></span>
        <span style="font-size:0.79rem;color:var(--text-muted);">Applied <?php echo date('M j, Y', strtotime($app['submitted_at'])); ?></span>
    </div>
    <?php if ($app['bio']): ?><p style="font-size:0.84rem;color:var(--text-muted);line-height:1.6;margin-bottom:10px;background:rgba(255,255,255,0.03);padding:10px 12px;border-radius:9px;"><?php echo nl2br(htmlspecialchars($app['bio'])); ?></p><?php endif; ?>
    <?php if ($app['drive_links']): ?>
    <div style="background:rgba(255,255,255,0.03);border:1px solid var(--border);border-radius:9px;padding:10px 12px;margin-bottom:10px;">
        <div style="font-size:0.68rem;font-weight:800;color:var(--text-muted);margin-bottom:5px;text-transform:uppercase;letter-spacing:1px;">Video Samples</div>
        <?php foreach (explode("\n", $app['drive_links']) as $lnk): if (trim($lnk)): ?>
        <div style="margin:3px 0;"><a href="<?php echo safe_url(trim($lnk)); ?>" target="_blank" rel="noopener" style="color:var(--primary);font-size:0.8rem;word-break:break-all;"><i class="ti ti-link" style="margin-right:5px;"></i><?php echo htmlspecialchars(substr(trim($lnk),0,80)); ?></a></div>
        <?php endif; endforeach; ?>
    </div>
    <?php endif; ?>
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button class="btn btn-approve btn-sm" onclick="adminAction('approve_editor',{app_id:<?php echo $app['id']; ?>,user_id:<?php echo $app['user_id']; ?>})"><i class="ti ti-check"></i>Approve</button>
        <button class="btn btn-reject btn-sm" onclick="openRejectModal(<?php echo $app['id']; ?>,<?php echo $app['user_id']; ?>)"><i class="ti ti-x"></i>Reject</button>
    </div>
</div>
<?php endforeach; endif; ?>

<?php elseif ($admin_tab === 'orders'): ?>
<?php if (empty($all_orders_admin)): ?>
<div class="empty-state"><div class="empty-icon"><i class="ti ti-briefcase"></i></div><h3>No orders yet</h3><p>Client orders will appear here once placed.</p></div>
<?php else: ?>
<input type="text" class="tbl-search" id="ordersSearch" placeholder="Search by title, client, editor or status..." oninput="filterTable('ordersSearch','ordersTbl')">
<div class="tbl-wrap">
<table class="tbl" id="ordersTbl">
    <thead><tr><th>Project</th><th>Client</th><th>Editor</th><th>Status</th><th>Budget</th><th>Deadline</th><th>Actions</th></tr></thead>
    <tbody>
    <?php foreach ($all_orders_admin as $o):
        $sl = $status_labels[$o['status']] ?? ['Unknown','#6b7280'];
        $order_interests_here = $interests_by_order[$o['id']] ?? [];
    ?>
    <tr data-status="<?php echo htmlspecialchars($o['status']); ?>">
        <td>
            <div style="font-weight:700;max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"><?php echo htmlspecialchars($o['title']); ?></div>
            <div style="font-size:0.73rem;color:var(--text-muted);"><?php echo htmlspecialchars($o['package_name']?:'Custom'); ?></div>
            <?php if (!empty($order_interests_here)): ?>
            <div style="margin-top:4px;display:flex;flex-wrap:wrap;gap:4px;">
                <?php foreach ($order_interests_here as $int): ?>
                <span style="font-size:0.66rem;background:rgba(0,196,240,0.1);color:var(--primary);border:1px solid rgba(0,196,240,0.2);padding:1px 7px;border-radius:20px;cursor:pointer;" onclick="assignEditor(<?php echo (int)$o['id']; ?>,<?php echo (int)$int['editor_id']; ?>,<?php echo json_encode($int['editor_name']); ?>)" title="Click to assign this editor"><?php echo htmlspecialchars($int['editor_name']); ?> <i class="ti ti-user-plus" style="font-size:0.6rem;"></i></span>
                <?php endforeach; ?>
            </div>
            <?php endif; ?>
        </td>
        <td style="font-size:0.82rem;"><?php echo htmlspecialchars($o['client_name']??'-'); ?></td>
        <td style="font-size:0.82rem;"><?php echo htmlspecialchars($o['editor_name']??'<span style="color:var(--text-muted);">Unassigned</span>'); ?></td>
        <td><span class="pill" style="background:<?php echo $sl[1]; ?>22;color:<?php echo $sl[1]; ?>;border:1px solid <?php echo $sl[1]; ?>44;"><?php echo $sl[0]; ?></span></td>
        <td style="font-size:0.82rem;color:var(--text-muted);"><?php echo $o['payment_amount']?'$'.number_format((float)$o['payment_amount'],2):($o['budget']?:'-'); ?></td>
        <td style="font-size:0.82rem;color:var(--text-muted);"><?php echo $o['deadline']?date('M j, Y',strtotime($o['deadline'])):'-'; ?></td>
        <td style="white-space:nowrap;">
            <button class="btn btn-outline btn-xs" onclick="openOrderEdit(<?php echo htmlspecialchars(json_encode($o)); ?>)"><i class="ti ti-edit"></i>Edit</button>
            <?php if (in_array($o['status'], ['in_progress','revision','awaiting_final_payment','final_paid'])): ?>
            <button class="btn btn-outline btn-xs" style="color:var(--primary);margin-left:4px;" onclick="openChatPanel(<?php echo (int)$o['id']; ?>,<?php echo json_encode($o['title']); ?>)"><i class="ti ti-messages"></i>Chat</button>
            <?php endif; ?>
            <?php if ($o['status'] === 'half_paid'): ?>
            <button class="btn btn-approve btn-xs" style="margin-left:4px;" onclick="adminPaymentAction(<?php echo (int)$o['id']; ?>,'approve_half_payment')"><i class="ti ti-check"></i>OK 50%</button>
            <?php elseif ($o['status'] === 'final_paid'): ?>
            <button class="btn btn-approve btn-xs" style="margin-left:4px;" onclick="adminPaymentAction(<?php echo (int)$o['id']; ?>,'approve_final_payment')"><i class="ti ti-checks"></i>Complete</button>
            <?php endif; ?>
        </td>
    </tr>
    <?php endforeach; ?>
    </tbody>
</table>
</div>
<?php endif; ?>

<?php elseif ($admin_tab === 'users'): ?>
<input type="text" class="tbl-search" id="usersSearch" placeholder="Search by name, email, username or role..." oninput="filterTable('usersSearch','usersTbl')">
<div class="tbl-wrap">
<table class="tbl" id="usersTbl">
    <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
    <tbody>
    <?php foreach ($all_users as $u): ?>
    <tr>
        <td><div style="font-weight:700;"><?php echo htmlspecialchars($u['name']); ?></div><div style="font-size:0.73rem;color:var(--text-muted);">@<?php echo htmlspecialchars($u['username']??''); ?></div></td>
        <td style="font-size:0.82rem;color:var(--text-muted);"><?php echo htmlspecialchars($u['email']); ?></td>
        <td><span class="pill" style="background:rgba(255,255,255,0.06);border:1px solid var(--border);"><?php echo ucfirst($u['role']); ?></span></td>
        <td><?php $sc=['active'=>['Active','#22c55e'],'pending'=>['Pending','#f59e0b'],'banned'=>['Banned','#ef4444'],'rejected'=>['Rejected','#6b7280']]; $sl2=$sc[$u['status']]??['?','#6b7280']; ?><span class="pill" style="background:<?php echo $sl2[1]; ?>22;color:<?php echo $sl2[1]; ?>;border:1px solid <?php echo $sl2[1]; ?>44;"><?php echo $sl2[0]; ?></span></td>
        <td style="font-size:0.79rem;color:var(--text-muted);"><?php echo date('M j, Y',strtotime($u['created_at'])); ?></td>
        <td style="white-space:nowrap;">
            <?php if ($u['role'] !== 'admin'): ?>
            <?php if ($u['status'] !== 'banned'): ?>
            <button class="btn btn-reject btn-xs" onclick="adminAction('ban_user',{user_id:<?php echo (int)$u['id']; ?>},confirm('Ban <?php echo addslashes(htmlspecialchars($u['name']??'')); ?>?'))"><i class="ti ti-ban"></i>Ban</button>
            <?php else: ?>
            <button class="btn btn-approve btn-xs" onclick="adminAction('unban_user',{user_id:<?php echo (int)$u['id']; ?>})"><i class="ti ti-check"></i>Unban</button>
            <?php endif; ?>
            <button class="btn btn-xs" style="background:rgba(239,68,68,0.08);color:var(--red);border:1px solid rgba(239,68,68,0.2);margin-left:4px;" onclick="openDeleteUserModal(<?php echo (int)$u['id']; ?>,<?php echo json_encode($u['name']??$u['username']??'User'); ?>)" title="Delete user"><i class="ti ti-user-x"></i></button>
            <?php else: ?>
            <span style="font-size:0.73rem;color:var(--text-muted);">Admin</span>
            <?php endif; ?>
        </td>
    </tr>
    <?php endforeach; ?>
    </tbody>
</table>
</div>

<?php elseif ($admin_tab === 'tickets'): ?>
<?php if ($open_ticket): ?>
<a href="/dashboard?tab=tickets" style="display:inline-flex;align-items:center;gap:7px;color:var(--text-muted);font-size:0.84rem;margin-bottom:16px;"><i class="ti ti-arrow-left"></i>All Tickets</a>
<div class="ticket-view">
    <h2 style="font-size:1.08rem;font-weight:800;margin-bottom:8px;"><?php echo htmlspecialchars($open_ticket['subject']); ?></h2>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;">
        <?php $ts=$ticket_status_meta[$open_ticket['status']]??['?','#6b7280']; ?>
        <span class="pill" style="background:<?php echo $ts[1]; ?>22;color:<?php echo $ts[1]; ?>;border:1px solid <?php echo $ts[1]; ?>44;"><?php echo $ts[0]; ?></span>
        <span style="font-size:0.77rem;color:var(--text-muted);"><?php echo htmlspecialchars($open_ticket['name']); ?></span>
        <span style="font-size:0.77rem;color:var(--text-muted);"><?php echo date('M j, Y',strtotime($open_ticket['created_at'])); ?></span>
    </div>
    <div class="msg-bubble msg-user"><div class="msg-meta"><?php echo htmlspecialchars($open_ticket['name']); ?> - original</div><?php echo nl2br(htmlspecialchars($open_ticket['message'])); ?></div>
    <?php foreach ($open_replies as $rep): ?>
    <div class="msg-bubble <?php echo $rep['sender_role']==='admin'?'msg-admin':'msg-user'; ?>">
        <div class="msg-meta"><?php echo $rep['sender_role']==='admin'?'ExtoArts Admin':htmlspecialchars($open_ticket['name']??'User'); ?> - <?php echo date('M j, g:ia',strtotime($rep['created_at'])); ?></div>
        <?php echo nl2br(htmlspecialchars($rep['message'])); ?>
    </div>
    <?php endforeach; ?>
    <form method="POST" style="margin-top:18px;"><?php echo csrf_field(); ?>
        <input type="hidden" name="action" value="reply_ticket">
        <input type="hidden" name="ticket_id" value="<?php echo $open_ticket['id']; ?>">
        <div class="form-group"><label>Reply</label><textarea name="reply_message" rows="4" placeholder="Write your reply..." required></textarea></div>
        <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
            <select name="ticket_status" style="width:auto;flex:none;padding:8px 12px;">
                <?php foreach ($ticket_status_meta as $k=>[$l,$c]): ?><option value="<?php echo $k; ?>" <?php echo $open_ticket['status']===$k?'selected':''; ?>><?php echo $l; ?></option><?php endforeach; ?>
            </select>
            <button type="submit" class="btn btn-primary"><i class="ti ti-send"></i>Send</button>
            <form method="POST" style="display:inline;"><?php echo csrf_field(); ?><input type="hidden" name="action" value="close_ticket"><input type="hidden" name="ticket_id" value="<?php echo $open_ticket['id']; ?>"><button type="submit" class="btn btn-outline"><i class="ti ti-x"></i>Close</button></form>
        </div>
    </form>
</div>
<?php elseif (empty($all_tickets)): ?>
<div class="empty-state"><div class="empty-icon"><i class="ti ti-headset"></i></div><h3>No support tickets</h3><p>Incoming tickets from clients will appear here.</p></div>
<?php else: ?>
<div class="tbl-wrap">
<table class="tbl">
    <thead><tr><th>Subject</th><th>From</th><th>Category</th><th>Priority</th><th>Status</th><th>Created</th></tr></thead>
    <tbody>
    <?php foreach ($all_tickets as $t): $ts=$ticket_status_meta[$t['status']]??['?','#6b7280']; ?>
    <tr style="cursor:pointer;" onclick="location.href='/dashboard?tab=tickets&tid=<?php echo $t['id']; ?>'">
        <td style="font-weight:700;"><?php echo htmlspecialchars($t['subject']); ?></td>
        <td style="font-size:0.82rem;"><?php echo htmlspecialchars($t['name']??'-'); ?></td>
        <td style="font-size:0.77rem;color:var(--text-muted);"><?php echo ucfirst(str_replace('_',' ',$t['category'])); ?></td>
        <td><span style="font-size:0.74rem;font-weight:700;color:<?php echo $ticket_priority_colors[$t['priority']]??'#6b7280'; ?>;"><?php echo ucfirst($t['priority']); ?></span></td>
        <td><span class="pill" style="background:<?php echo $ts[1]; ?>22;color:<?php echo $ts[1]; ?>;border:1px solid <?php echo $ts[1]; ?>44;"><?php echo $ts[0]; ?></span></td>
        <td style="font-size:0.77rem;color:var(--text-muted);"><?php echo date('M j, Y',strtotime($t['created_at'])); ?></td>
    </tr>
    <?php endforeach; ?>
    </tbody>
</table>
</div>
<?php endif; ?>

<?php elseif ($admin_tab === 'payments'): ?>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:22px;align-items:start;">
<div>
    <div class="section-title"><span>Payment Methods</span><button class="btn btn-primary btn-sm" onclick="openPmModal()"><i class="ti ti-plus"></i>Add</button></div>
    <?php if (empty($pm_list_admin)): ?>
    <div class="empty-state" style="padding:28px;"><div class="empty-icon"><i class="ti ti-wallet"></i></div><h3>No payment methods</h3><p style="font-size:0.83rem;">Add methods so clients know where to pay.</p></div>
    <?php else: ?>
    <div style="display:flex;flex-direction:column;gap:9px;">
    <?php foreach ($pm_list_admin as $pm): ?>
    <div style="background:var(--surface);border:1px solid <?php echo $pm['is_active']?'var(--border)':'rgba(107,114,128,0.2)'; ?>;border-radius:13px;padding:13px 15px;opacity:<?php echo $pm['is_active']?'1':'0.5'; ?>;">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">
            <div>
                <div style="font-weight:800;font-size:0.88rem;"><?php echo htmlspecialchars($pm['label']); ?> <span style="font-size:0.68rem;background:rgba(255,255,255,0.07);padding:2px 7px;border-radius:8px;"><?php echo strtoupper($pm['type']); ?></span><?php if($pm['network']): ?> <span style="font-size:0.69rem;color:var(--primary);"><?php echo htmlspecialchars($pm['network']); ?></span><?php endif; ?></div>
                <div style="font-size:0.79rem;color:var(--text-muted);margin-top:2px;word-break:break-all;"><?php echo htmlspecialchars($pm['value']); ?></div>
                <?php if($pm['instructions']): ?><div style="font-size:0.73rem;color:var(--text-muted);margin-top:3px;font-style:italic;"><?php echo htmlspecialchars($pm['instructions']); ?></div><?php endif; ?>
            </div>
            <div style="display:flex;gap:5px;flex-shrink:0;">
                <button class="btn btn-outline btn-xs" onclick="editPmModal(<?php echo htmlspecialchars(json_encode($pm)); ?>)"><i class="ti ti-edit"></i></button>
                <button class="btn btn-xs" style="background:rgba(255,255,255,0.06);border:1px solid var(--border);" onclick="togglePm(<?php echo (int)$pm['id']; ?>)"><i class="ti ti-<?php echo $pm['is_active']?'eye-off':'eye'; ?>"></i></button>
                <button class="btn btn-reject btn-xs" onclick="deletePm(<?php echo (int)$pm['id']; ?>)"><i class="ti ti-trash"></i></button>
            </div>
        </div>
    </div>
    <?php endforeach; ?>
    </div>
    <?php endif; ?>
</div>
<div>
    <div class="section-title"><span>Pending Payments</span></div>
    <?php if (empty($pending_payments)): ?>
    <div class="empty-state" style="padding:28px;"><div class="empty-icon"><i class="ti ti-receipt"></i></div><h3>No pending payments</h3><p style="font-size:0.83rem;">Client payment references appear here for review.</p></div>
    <?php else: foreach ($pending_payments as $pp): ?>
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:13px;padding:13px 15px;margin-bottom:9px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;flex-wrap:wrap;margin-bottom:7px;">
            <div><div style="font-weight:800;font-size:0.87rem;"><?php echo htmlspecialchars($pp['order_title']??'Order #'.$pp['order_id']); ?></div><div style="font-size:0.73rem;color:var(--text-muted);"><?php echo ucfirst($pp['payment_type']); ?> - <?php echo htmlspecialchars($pp['submitter_name']??'Client'); ?> - <?php echo date('M j, g:ia',strtotime($pp['submitted_at'])); ?></div></div>
            <?php if($pp['amount']): ?><span style="font-weight:800;color:var(--green);">$<?php echo number_format((float)$pp['amount'],2); ?></span><?php endif; ?>
        </div>
        <div style="background:rgba(255,255,255,0.06);border-radius:8px;padding:8px 11px;font-size:0.84rem;word-break:break-all;margin-bottom:9px;"><strong>Ref:</strong> <?php echo htmlspecialchars($pp['reference']); ?></div>
        <div style="display:flex;gap:6px;">
            <button class="btn btn-approve btn-xs" onclick="adminPaymentAction(<?php echo (int)$pp['order_id']; ?>,'approve_<?php echo $pp['payment_type']; ?>_payment')"><i class="ti ti-check"></i>Approve</button>
            <button class="btn btn-reject btn-xs" onclick="adminPaymentAction(<?php echo (int)$pp['order_id']; ?>,'reject_<?php echo $pp['payment_type']; ?>_payment')"><i class="ti ti-x"></i>Reject</button>
        </div>
    </div>
    <?php endforeach; endif; ?>
</div>
</div>

<?php elseif ($admin_tab === 'analytics'): ?>
<?php
$status_colors = ['pending'=>'#eab308','awaiting_half_payment'=>'#f97316','half_paid'=>'#60a5fa','in_progress'=>'#00c4f0','revision'=>'#60a5fa','awaiting_final_payment'=>'#f97316','final_paid'=>'#60a5fa','completed'=>'#22c55e','cancelled'=>'#6b7280'];
$order_total = array_sum(array_column($order_status_counts, 'cnt'));
$role_map = [];
foreach ($user_role_counts as $rc) $role_map[$rc['role']] = (int)$rc['cnt'];
?>
<div class="analytics-grid">
    <div class="analytics-card">
        <h3>Revenue</h3>
        <div style="font-size:2rem;font-weight:900;color:var(--green);">$<?php echo number_format($analytics_revenue, 2); ?></div>
        <div style="font-size:0.78rem;color:var(--text-muted);margin-top:4px;">From completed orders</div>
        <div style="margin-top:14px;padding-top:14px;border-top:1px solid var(--border);display:flex;gap:24px;">
            <div>
                <div style="font-size:1.2rem;font-weight:800;color:var(--yellow);">$<?php echo number_format($analytics_active_rev, 2); ?></div>
                <div style="font-size:0.74rem;color:var(--text-muted);">Active pipeline</div>
            </div>
            <div>
                <div style="font-size:1.2rem;font-weight:800;"><?php echo $order_total; ?></div>
                <div style="font-size:0.74rem;color:var(--text-muted);">Total orders</div>
            </div>
        </div>
    </div>
    <div class="analytics-card">
        <h3>Users</h3>
        <div style="display:flex;gap:20px;flex-wrap:wrap;">
            <div><div style="font-size:1.7rem;font-weight:900;"><?php echo $role_map['client']??0; ?></div><div style="font-size:0.7rem;color:var(--text-muted);font-weight:700;text-transform:uppercase;letter-spacing:1px;">Clients</div></div>
            <div><div style="font-size:1.7rem;font-weight:900;color:var(--purple);"><?php echo $role_map['editor']??0; ?></div><div style="font-size:0.7rem;color:var(--text-muted);font-weight:700;text-transform:uppercase;letter-spacing:1px;">Editors</div></div>
            <div><div style="font-size:1.7rem;font-weight:900;color:var(--red);"><?php echo $role_map['admin']??0; ?></div><div style="font-size:0.7rem;color:var(--text-muted);font-weight:700;text-transform:uppercase;letter-spacing:1px;">Admins</div></div>
        </div>
        <div style="margin-top:14px;padding-top:14px;border-top:1px solid var(--border);">
            <span style="font-size:0.85rem;font-weight:800;"><?php echo array_sum(array_values($role_map)); ?> total accounts</span>
        </div>
    </div>
</div>
<div class="analytics-grid">
    <div class="analytics-card">
        <h3>Order Status Breakdown</h3>
        <?php if ($order_total > 0):
            $segments = []; $offset = 0;
            foreach ($order_status_counts as $os) {
                $pct = ($os['cnt'] / $order_total) * 100;
                $segments[] = ['status'=>$os['status'],'cnt'=>(int)$os['cnt'],'pct'=>$pct,'offset'=>$offset,'color'=>$status_colors[$os['status']]??'#6b7280'];
                $offset += $pct;
            }
            $conic = implode(',', array_map(fn($s) => "{$s['color']} {$s['offset']}% ".($s['offset']+$s['pct']).'%', $segments));
        ?>
        <div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap;">
            <div style="width:110px;height:110px;border-radius:50%;background:conic-gradient(<?php echo $conic; ?>);flex-shrink:0;"></div>
            <div class="donut-legend">
                <?php foreach ($segments as $s): ?>
                <div class="donut-legend-item">
                    <div class="donut-dot" style="background:<?php echo $s['color']; ?>;"></div>
                    <span style="color:var(--text-muted);"><?php echo $status_labels[$s['status']][0] ?? ucwords(str_replace('_',' ',$s['status'])); ?></span>
                    <span style="margin-left:auto;font-weight:800;"><?php echo $s['cnt']; ?></span>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
        <?php else: ?>
        <div style="color:var(--text-muted);font-size:0.84rem;padding:16px 0;">No orders yet.</div>
        <?php endif; ?>
    </div>
    <div class="analytics-card">
        <h3>Recent Activity</h3>
        <?php if (empty($recent_audit)): ?>
        <div style="color:var(--text-muted);font-size:0.84rem;">No activity logged yet.</div>
        <?php else: ?>
        <div style="display:flex;flex-direction:column;max-height:280px;overflow-y:auto;">
        <?php foreach ($recent_audit as $al): ?>
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;font-size:0.77rem;padding:7px 0;border-bottom:1px solid rgba(255,255,255,0.04);">
            <div>
                <span style="font-weight:700;"><?php echo htmlspecialchars($al['actor_name']??'System'); ?></span>
                <span style="color:var(--text-muted);"> <?php echo htmlspecialchars(str_replace('_',' ',$al['action'])); ?></span>
                <?php if ($al['target_type']): ?><span style="color:var(--text-muted);"> &middot; <?php echo htmlspecialchars($al['target_type']); ?> #<?php echo (int)$al['target_id']; ?></span><?php endif; ?>
                <?php if ($al['detail']): ?><div style="color:var(--text-muted);font-size:0.71rem;margin-top:1px;"><?php echo htmlspecialchars(mb_substr($al['detail'],0,64)); ?></div><?php endif; ?>
            </div>
            <div style="color:var(--text-muted);white-space:nowrap;font-size:0.7rem;flex-shrink:0;"><?php echo date('M j, g:ia',strtotime($al['created_at'])); ?></div>
        </div>
        <?php endforeach; ?>
        </div>
        <?php endif; ?>
    </div>
</div>

<?php endif; ?>

<?php
// ═══════════════════════════════════════════════════════════════════
// CLIENT DASHBOARD
// ═══════════════════════════════════════════════════════════════════
elseif ($role === 'client'):
?>
<div class="welcome-row">
    <div class="welcome-text">
        <h1>Welcome back, <?php echo htmlspecialchars(explode(' ',$user['name']??$user['username']??'there')[0]); ?></h1>
        <p><?php echo date('l, F j, Y'); ?></p>
    </div>
    <button class="btn btn-primary" onclick="openOrderModal()"><i class="ti ti-plus"></i>New Order</button>
</div>
<div class="stats-grid">
    <div class="stat-card"><div class="stat-num"><?php echo $stats['total']??0; ?></div><div class="stat-label">Total Orders</div></div>
    <div class="stat-card"><div class="stat-num" style="color:var(--yellow);"><?php echo $stats['pending']??0; ?></div><div class="stat-label">Pending</div></div>
    <div class="stat-card"><div class="stat-num" style="color:var(--primary);"><?php echo $stats['active']??0; ?></div><div class="stat-label">In Progress</div></div>
    <div class="stat-card"><div class="stat-num" style="color:var(--green);"><?php echo $stats['completed']??0; ?></div><div class="stat-label">Completed</div></div>
</div>
<div id="orders">
    <div class="section-title"><span>My Orders</span><button class="btn btn-primary btn-sm" onclick="openOrderModal()"><i class="ti ti-plus"></i>New Order</button></div>
    <?php if (empty($orders)): ?>
    <div class="empty-state"><div class="empty-icon"><i class="ti ti-movie"></i></div><h3>No orders yet</h3><p>Place your first order and we'll get started. Video editing, thumbnails, and more.</p><div class="empty-cta"><button class="btn btn-primary" onclick="openOrderModal()"><i class="ti ti-plus"></i>Place First Order</button><a href="/services" class="btn btn-outline">View Services</a></div></div>
    <?php else: ?>
    <div class="order-cards">
    <?php foreach ($orders as $o):
        $o_status = $o['status'];
        $sl = $status_labels[$o_status] ?? ['Unknown','#6b7280'];
        $pamt = (float)($o['payment_amount'] ?? 0);
        $half = $pamt > 0 ? round($pamt / 2, 2) : null;
        $chat_active = in_array($o_status, ['in_progress','revision','awaiting_final_payment','final_paid']) && empty($o['chat_cleared']);
        $paid_states = ['half_paid','in_progress','revision','awaiting_final_payment','final_paid','completed'];
    ?>
    <div class="order-card" data-status="<?php echo htmlspecialchars($o_status); ?>">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap;margin-bottom:10px;">
            <div>
                <div style="font-weight:800;font-size:0.97rem;"><?php echo htmlspecialchars($o['title']); ?></div>
                <div style="font-size:0.73rem;color:var(--text-muted);margin-top:2px;"><?php echo htmlspecialchars($o['package_name']?:'Custom'); ?><?php if($o['deadline']): ?> - Due <?php echo date('M j, Y',strtotime($o['deadline'])); ?><?php endif; ?></div>
            </div>
            <span class="pill" style="background:<?php echo $sl[1]; ?>22;color:<?php echo $sl[1]; ?>;border:1px solid <?php echo $sl[1]; ?>44;flex-shrink:0;"><?php echo $sl[0]; ?></span>
        </div>

        <?php if ($pamt > 0 && !in_array($o_status, ['pending','cancelled'])): ?>
        <div style="display:flex;gap:7px;margin-bottom:11px;">
            <div style="flex:1;background:rgba(255,255,255,0.04);border-radius:9px;padding:8px 11px;text-align:center;"><div style="font-size:0.58rem;color:var(--text-muted);margin-bottom:1px;">TOTAL</div><div style="font-weight:800;font-size:0.95rem;">$<?php echo number_format($pamt,2); ?></div></div>
            <div style="flex:1;background:<?php echo in_array($o_status,$paid_states)?'rgba(34,197,94,0.08)':'rgba(255,255,255,0.04)'; ?>;border-radius:9px;padding:8px 11px;text-align:center;border:1px solid <?php echo in_array($o_status,$paid_states)?'rgba(34,197,94,0.2)':'transparent'; ?>;"><div style="font-size:0.58rem;color:var(--text-muted);margin-bottom:1px;">50% UPFRONT</div><div style="font-weight:800;font-size:0.95rem;color:<?php echo in_array($o_status,$paid_states)?'var(--green)':'var(--yellow)'; ?>;">$<?php echo number_format($half,2); ?></div></div>
            <div style="flex:1;background:<?php echo in_array($o_status,['final_paid','completed'])?'rgba(34,197,94,0.08)':'rgba(255,255,255,0.04)'; ?>;border-radius:9px;padding:8px 11px;text-align:center;border:1px solid <?php echo in_array($o_status,['final_paid','completed'])?'rgba(34,197,94,0.2)':'transparent'; ?>;"><div style="font-size:0.58rem;color:var(--text-muted);margin-bottom:1px;">ON DELIVERY</div><div style="font-weight:800;font-size:0.95rem;color:<?php echo in_array($o_status,['final_paid','completed'])?'var(--green)':'var(--text-muted)'; ?>;">$<?php echo number_format($half,2); ?></div></div>
        </div>
        <?php endif; ?>

        <?php if ($o_status === 'awaiting_half_payment'): ?>
        <div style="background:rgba(249,115,22,0.07);border:1px solid rgba(249,115,22,0.2);border-radius:10px;padding:10px 13px;margin-bottom:9px;">
            <div style="font-size:0.81rem;font-weight:700;color:#fb923c;margin-bottom:2px;"><i class="ti ti-clock" style="margin-right:6px;"></i>Action Required - 50% Upfront Payment</div>
            <div style="font-size:0.77rem;color:var(--text-muted);">Send <?php echo $half?'$'.number_format($half,2):'the 50% amount'; ?> to one of the methods below.</div>
        </div>
        <?php if (!empty($payment_methods_list)): ?>
        <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:10px;">
        <?php foreach ($payment_methods_list as $pm): ?>
        <div style="background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:8px;padding:8px 12px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
            <div style="flex:1;min-width:0;"><div style="font-size:0.76rem;font-weight:700;"><?php echo htmlspecialchars($pm['label']); ?><?php if($pm['network']): ?> <span style="color:var(--primary);">(<?php echo htmlspecialchars($pm['network']); ?>)</span><?php endif; ?></div><div style="font-size:0.79rem;font-family:monospace;word-break:break-all;margin-top:1px;"><?php echo htmlspecialchars($pm['value']); ?></div><?php if($pm['instructions']): ?><div style="font-size:0.69rem;color:var(--text-muted);margin-top:1px;"><?php echo htmlspecialchars($pm['instructions']); ?></div><?php endif; ?></div>
        </div>
        <?php endforeach; ?>
        </div>
        <?php endif; ?>
        <div style="background:rgba(255,255,255,0.03);border:1px solid var(--border);border-radius:10px;padding:11px 13px;">
            <div style="font-size:0.79rem;font-weight:700;margin-bottom:7px;">Submit Payment Reference</div>
            <input type="text" class="pay-input" id="payRef_<?php echo $o['id']; ?>" placeholder="Transaction ID / hash / screenshot URL" style="margin-bottom:6px;">
            <input type="text" class="pay-input" id="payNote_<?php echo $o['id']; ?>" placeholder="Note (optional)" style="margin-bottom:9px;">
            <button class="btn btn-primary btn-sm btn-full" onclick="submitPayment(<?php echo $o['id']; ?>,'half')"><i class="ti ti-send"></i>I've Sent - Submit Reference</button>
        </div>

        <?php elseif ($o_status === 'half_paid'): ?>
        <div style="background:rgba(96,165,250,0.06);border:1px solid rgba(96,165,250,0.18);border-radius:8px;padding:10px 13px;">
            <div style="font-size:0.81rem;font-weight:700;color:var(--blue);"><i class="ti ti-hourglass-half" style="margin-right:6px;"></i>Payment Submitted - Awaiting Verification</div>
            <div style="font-size:0.76rem;color:var(--text-muted);margin-top:3px;">We're verifying your payment. Work begins once confirmed.</div>
        </div>

        <?php elseif ($o_status === 'awaiting_final_payment'): ?>
        <?php if ($o['delivery_link']): ?><div style="background:rgba(34,197,94,0.06);border:1px solid rgba(34,197,94,0.22);border-radius:10px;padding:10px 13px;margin-bottom:9px;"><div style="font-size:0.81rem;font-weight:700;color:var(--green);margin-bottom:5px;"><i class="ti ti-circle-check" style="margin-right:6px;"></i>Delivery Ready</div><a href="<?php echo safe_url($o['delivery_link']); ?>" target="_blank" rel="noopener" class="btn btn-outline btn-sm"><i class="ti ti-external-link"></i>View Files</a></div><?php endif; ?>
        <div style="background:rgba(249,115,22,0.07);border:1px solid rgba(249,115,22,0.2);border-radius:10px;padding:10px 13px;margin-bottom:9px;">
            <div style="font-size:0.81rem;font-weight:700;color:#fb923c;margin-bottom:2px;"><i class="ti ti-clock" style="margin-right:6px;"></i>Final Payment Required</div>
            <div style="font-size:0.77rem;color:var(--text-muted);">Send the remaining <?php echo $half?'$'.number_format($half,2):'balance'; ?> to complete your order.</div>
        </div>
        <?php if (!empty($payment_methods_list)): ?>
        <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:9px;">
        <?php foreach ($payment_methods_list as $pm): ?><div style="background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:8px;padding:8px 12px;"><div style="font-size:0.76rem;font-weight:700;"><?php echo htmlspecialchars($pm['label']); ?><?php if($pm['network']): ?> <span style="color:var(--primary);">(<?php echo htmlspecialchars($pm['network']); ?>)</span><?php endif; ?></div><div style="font-size:0.79rem;font-family:monospace;word-break:break-all;margin-top:1px;"><?php echo htmlspecialchars($pm['value']); ?></div></div><?php endforeach; ?>
        </div>
        <?php endif; ?>
        <div style="background:rgba(255,255,255,0.03);border:1px solid var(--border);border-radius:10px;padding:11px 13px;">
            <div style="font-size:0.79rem;font-weight:700;margin-bottom:7px;">Submit Final Payment Reference</div>
            <input type="text" class="pay-input" id="payRef_<?php echo $o['id']; ?>" placeholder="Transaction ID / hash / screenshot URL" style="margin-bottom:6px;">
            <input type="text" class="pay-input" id="payNote_<?php echo $o['id']; ?>" placeholder="Note (optional)" style="margin-bottom:9px;">
            <button class="btn btn-primary btn-sm btn-full" onclick="submitPayment(<?php echo $o['id']; ?>,'final')"><i class="ti ti-send"></i>Submit Final Payment</button>
        </div>

        <?php elseif ($o_status === 'final_paid'): ?>
        <div style="background:rgba(96,165,250,0.06);border:1px solid rgba(96,165,250,0.18);border-radius:8px;padding:10px 13px;">
            <div style="font-size:0.81rem;font-weight:700;color:var(--blue);"><i class="ti ti-hourglass-half" style="margin-right:6px;"></i>Final Payment Submitted - Completing Order</div>
        </div>
        <?php if ($o['delivery_link']): ?><div style="margin-top:9px;"><a href="<?php echo safe_url($o['delivery_link']); ?>" target="_blank" rel="noopener" class="btn btn-outline btn-sm"><i class="ti ti-external-link"></i>View Delivery</a></div><?php endif; ?>

        <?php elseif ($o_status === 'completed'): ?>
        <div style="background:rgba(34,197,94,0.06);border:1px solid rgba(34,197,94,0.18);border-radius:10px;padding:10px 13px;">
            <div style="font-size:0.81rem;font-weight:700;color:var(--green);"><i class="ti ti-checks" style="margin-right:6px;"></i>Order Complete - Thank you!</div>
        </div>
        <?php if ($o['delivery_link']): ?><div style="margin-top:9px;"><a href="<?php echo safe_url($o['delivery_link']); ?>" target="_blank" rel="noopener" class="btn btn-outline btn-sm"><i class="ti ti-download"></i>Download Files</a></div><?php endif; ?>
        <?php endif; ?>

        <div style="display:flex;gap:7px;flex-wrap:wrap;margin-top:10px;">
            <?php if ($chat_active): ?>
            <button class="btn btn-outline btn-sm" style="color:var(--primary);" onclick="openChatPanel(<?php echo (int)$o['id']; ?>,<?php echo json_encode($o['title']); ?>)"><i class="ti ti-messages"></i>Chat with Editor</button>
            <?php endif; ?>
            <?php if (in_array($o_status, ['in_progress','awaiting_final_payment'])): ?>
            <button class="btn btn-outline btn-sm" onclick="requestRevision(<?php echo (int)$o['id']; ?>)"><i class="ti ti-rotate-clockwise"></i>Request Revision</button>
            <?php endif; ?>
        </div>
    </div>
    <?php endforeach; ?>
    </div>
    <?php endif; ?>
</div>

<?php
// ═══════════════════════════════════════════════════════════════════
// EDITOR DASHBOARD
// ═══════════════════════════════════════════════════════════════════
else: // editor
?>

<?php if ($status === 'pending' && !in_array($dash_tab, ['application'])): ?>
<div class="notice notice-pending" style="display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;">
    <div><i class="ti ti-clock" style="margin-right:8px;"></i><strong>Application pending.</strong> You'll get full access once approved by admin.</div>
    <a href="/dashboard?tab=application" class="btn btn-outline btn-sm">View Status</a>
</div>
<?php endif; ?>

<?php if ($status === 'rejected'): ?>
<div class="notice notice-error"><i class="ti ti-circle-x" style="margin-right:8px;"></i>Your editor application was not approved. <a href="https://discord.gg/extoarts-1402333030827425922" target="_blank" style="color:#fca5a5;text-decoration:underline;">Contact us on Discord</a> for more info.</div>
<?php endif; ?>

<?php if ($dash_tab === 'overview' && $status === 'active'): ?>
<div class="welcome-row">
    <div class="welcome-text">
        <h1>Editor HQ, <?php echo htmlspecialchars(explode(' ',$user['name']??$user['username']??'there')[0]); ?></h1>
        <p><?php echo date('l, F j, Y'); ?></p>
    </div>
    <a href="/dashboard?tab=jobs" class="btn btn-primary"><i class="ti ti-search"></i>Browse Jobs</a>
</div>
<div class="stats-grid">
    <div class="stat-card"><div class="stat-num" style="color:var(--primary);"><?php echo $stats['active']??0; ?></div><div class="stat-label">Active Work</div></div>
    <div class="stat-card"><div class="stat-num" style="color:var(--yellow);"><?php echo count($my_interests); ?></div><div class="stat-label">Interests Sent</div></div>
    <div class="stat-card"><div class="stat-num" style="color:var(--green);"><?php echo $stats['completed']??0; ?></div><div class="stat-label">Completed</div></div>
    <div class="stat-card"><div class="stat-num"><?php echo count($available_orders); ?></div><div class="stat-label">Available Jobs</div></div>
</div>

<?php if (!empty($assigned_orders)): ?>
<div class="section-title" style="margin-top:6px;"><span>Active Assignments</span><a href="/dashboard?tab=work" class="btn btn-outline btn-sm">View All</a></div>
<div class="work-cards">
<?php foreach (array_filter($assigned_orders, fn($o)=>in_array($o['status'],['in_progress','revision'])) as $o):
    $sl = $status_labels[$o['status']] ?? ['Unknown','#6b7280'];
    $progress_map = ['in_progress'=>60,'revision'=>80,'awaiting_final_payment'=>90,'completed'=>100,'pending'=>10,'awaiting_half_payment'=>20,'half_paid'=>30,'final_paid'=>95,'cancelled'=>0];
    $prog = $progress_map[$o['status']] ?? 20;
    $pamt = (float)($o['payment_amount'] ?? 0);
    $chat_active = in_array($o['status'], ['in_progress','revision','awaiting_final_payment','final_paid']) && empty($o['chat_cleared']);
?>
<div class="work-card" data-status="<?php echo htmlspecialchars($o['status']); ?>">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;flex-wrap:wrap;margin-bottom:8px;">
        <div>
            <div style="font-weight:800;font-size:0.96rem;"><?php echo htmlspecialchars($o['title']); ?></div>
            <div style="font-size:0.74rem;color:var(--text-muted);margin-top:2px;"><?php echo htmlspecialchars($o['package_name']?:'Custom'); ?><?php if($o['deadline']): ?> - Due <?php echo date('M j, Y',strtotime($o['deadline'])); ?><?php endif; ?></div>
        </div>
        <span class="pill" style="background:<?php echo $sl[1]; ?>22;color:<?php echo $sl[1]; ?>;border:1px solid <?php echo $sl[1]; ?>44;"><?php echo $sl[0]; ?></span>
    </div>
    <div class="progress-bar"><div class="progress-fill" style="width:<?php echo $prog; ?>%;background:<?php echo $sl[1]; ?>;"></div></div>
    <?php if ($o['status'] === 'revision' && $o['admin_note']): ?><div style="background:rgba(96,165,250,0.06);border:1px solid rgba(96,165,250,0.18);border-radius:8px;padding:9px 12px;font-size:0.82rem;margin-bottom:8px;"><strong style="color:var(--blue);">Revision note:</strong> <?php echo htmlspecialchars($o['admin_note']); ?></div><?php endif; ?>
    <div style="display:flex;gap:7px;flex-wrap:wrap;margin-top:8px;">
        <?php if ($chat_active): ?><button class="btn btn-interest btn-sm" onclick="openChatPanel(<?php echo (int)$o['id']; ?>,<?php echo json_encode($o['title']); ?>)"><i class="ti ti-messages"></i>Message Client</button><?php endif; ?>
        <?php if (in_array($o['status'],['in_progress','revision'])): ?><button class="btn btn-primary btn-sm" onclick="openDeliveryModal(<?php echo (int)$o['id']; ?>,<?php echo json_encode($o['title']); ?>)"><i class="ti ti-upload"></i>Submit Delivery</button><?php endif; ?>
        <?php if ($o['status'] === 'revision'): ?><button class="btn btn-outline btn-sm" onclick="markRevisionDone(<?php echo (int)$o['id']; ?>)"><i class="ti ti-rotate-clockwise"></i>Mark Done</button><?php endif; ?>
    </div>
</div>
<?php endforeach; ?>
</div>
<?php endif; ?>

<?php if (!empty($available_orders)): ?>
<div class="section-title" style="margin-top:20px;"><span>New Available Jobs</span><a href="/dashboard?tab=jobs" class="btn btn-outline btn-sm">Browse All</a></div>
<div class="job-cards">
<?php foreach (array_slice($available_orders, 0, 4) as $o):
    $interested = in_array($o['id'], $my_interests);
?>
<div class="job-card <?php echo $interested?'interested':''; ?>">
    <div>
        <div class="job-pkg"><?php echo htmlspecialchars($o['package_name']?:'Custom Project'); ?></div>
        <div class="job-title"><?php echo htmlspecialchars($o['title']); ?></div>
    </div>
    <div class="job-meta">
        <?php if ($o['budget']): ?><span class="job-meta-item"><i class="ti ti-tag"></i><?php echo htmlspecialchars($o['budget']); ?></span><?php endif; ?>
        <?php if ($o['deadline']): ?><span class="job-meta-item"><i class="ti ti-calendar"></i>Due <?php echo date('M j',strtotime($o['deadline'])); ?></span><?php endif; ?>
        <span class="job-meta-item"><i class="ti ti-clock"></i><?php echo date('M j',strtotime($o['created_at'])); ?></span>
    </div>
    <div class="job-actions">
        <?php if (!$interested): ?>
        <button class="btn btn-interest btn-sm" onclick="expressInterest(<?php echo (int)$o['id']; ?>,this)"><i class="ti ti-flag-2"></i>I'm Interested</button>
        <?php else: ?>
        <span class="btn btn-withdraw btn-sm" style="cursor:default;"><i class="ti ti-check"></i>Interest Sent</span>
        <button class="btn btn-withdraw btn-xs" onclick="withdrawInterest(<?php echo (int)$o['id']; ?>,this)" title="Withdraw interest"><i class="ti ti-x"></i></button>
        <?php endif; ?>
    </div>
</div>
<?php endforeach; ?>
</div>
<?php endif; ?>

<?php elseif ($dash_tab === 'jobs' && $status === 'active'): ?>
<div class="welcome-row">
    <div class="welcome-text"><h1>Available Jobs</h1><p>Pending orders without an assigned editor. Express interest and we'll assign you if selected.</p></div>
</div>
<?php if (empty($available_orders)): ?>
<div class="empty-state"><div class="empty-icon"><i class="ti ti-search"></i></div><h3>No available jobs right now</h3><p>Check back soon. New client orders will appear here once placed and ready for assignment.</p></div>
<?php else: ?>
<div class="job-cards">
<?php foreach ($available_orders as $o):
    $interested = in_array($o['id'], $my_interests);
?>
<div class="job-card <?php echo $interested?'interested':''; ?>" id="jobcard_<?php echo $o['id']; ?>">
    <div>
        <div class="job-pkg"><?php echo htmlspecialchars($o['package_name']?:'Custom Project'); ?></div>
        <div class="job-title"><?php echo htmlspecialchars($o['title']); ?></div>
    </div>
    <?php if ($o['description']): ?><div class="job-desc"><?php echo htmlspecialchars($o['description']); ?></div><?php endif; ?>
    <div class="job-meta">
        <?php if ($o['budget']): ?><span class="job-meta-item"><i class="ti ti-tag"></i><?php echo htmlspecialchars($o['budget']); ?></span><?php endif; ?>
        <?php if ($o['deadline']): ?><span class="job-meta-item"><i class="ti ti-calendar"></i>Due <?php echo date('M j, Y',strtotime($o['deadline'])); ?></span><?php endif; ?>
        <span class="job-meta-item"><i class="ti ti-clock"></i>Posted <?php echo date('M j',strtotime($o['created_at'])); ?></span>
    </div>
    <?php if ($interested): ?>
    <div class="interest-banner"><i class="ti ti-circle-check" style="margin-right:6px;"></i>Interest sent - admin will assign you if selected.</div>
    <?php endif; ?>
    <div class="job-actions">
        <?php if (!$interested): ?>
        <button class="btn btn-interest btn-sm" onclick="openInterestModal(<?php echo (int)$o['id']; ?>,<?php echo json_encode($o['title']); ?>)"><i class="ti ti-flag-2"></i>Express Interest</button>
        <?php else: ?>
        <span class="btn btn-withdraw btn-sm" style="cursor:default;"><i class="ti ti-check"></i>Interest Sent</span>
        <button class="btn btn-withdraw btn-sm" onclick="withdrawInterest(<?php echo (int)$o['id']; ?>,this)"><i class="ti ti-x"></i>Withdraw</button>
        <?php endif; ?>
    </div>
</div>
<?php endforeach; ?>
</div>
<?php endif; ?>

<?php elseif ($dash_tab === 'work' && $status === 'active'): ?>
<div class="welcome-row">
    <div class="welcome-text"><h1>My Work</h1><p>All your assigned orders and their current status.</p></div>
</div>
<?php if (empty($assigned_orders)): ?>
<div class="empty-state"><div class="empty-icon"><i class="ti ti-movie"></i></div><h3>No assignments yet</h3><p>Browse available jobs, express interest, and admin will assign you to orders.</p><div class="empty-cta"><a href="/dashboard?tab=jobs" class="btn btn-primary"><i class="ti ti-search"></i>Browse Jobs</a></div></div>
<?php else: ?>
<div class="work-cards">
<?php foreach ($assigned_orders as $o):
    $sl = $status_labels[$o['status']] ?? ['Unknown','#6b7280'];
    $progress_map = ['in_progress'=>60,'revision'=>80,'awaiting_final_payment'=>90,'completed'=>100,'pending'=>10,'awaiting_half_payment'=>20,'half_paid'=>30,'final_paid'=>95,'cancelled'=>0];
    $prog = $progress_map[$o['status']] ?? 20;
    $pamt = (float)($o['payment_amount'] ?? 0);
    $chat_active = in_array($o['status'], ['in_progress','revision','awaiting_final_payment','final_paid']) && empty($o['chat_cleared']);
?>
<div class="work-card" data-status="<?php echo htmlspecialchars($o['status']); ?>">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;flex-wrap:wrap;margin-bottom:8px;">
        <div>
            <div style="font-weight:800;font-size:0.97rem;"><?php echo htmlspecialchars($o['title']); ?></div>
            <div style="font-size:0.74rem;color:var(--text-muted);margin-top:2px;"><?php echo htmlspecialchars($o['package_name']?:'Custom'); ?> <?php if($o['client_name']): ?>&mdash; <span style="color:var(--primary);"><?php echo htmlspecialchars($o['client_name']); ?></span><?php endif; ?><?php if($o['deadline']): ?> &mdash; Due <?php echo date('M j, Y',strtotime($o['deadline'])); ?><?php endif; ?></div>
        </div>
        <span class="pill" style="background:<?php echo $sl[1]; ?>22;color:<?php echo $sl[1]; ?>;border:1px solid <?php echo $sl[1]; ?>44;"><?php echo $sl[0]; ?></span>
    </div>
    <div class="progress-bar"><div class="progress-fill" style="width:<?php echo $prog; ?>%;background:<?php echo $sl[1]; ?>;"></div></div>

    <?php if ($pamt > 0): ?><div style="font-size:0.78rem;color:var(--text-muted);margin:4px 0;"><i class="ti ti-currency-dollar" style="color:var(--green);margin-right:5px;"></i>Project value: <strong style="color:var(--text-main);">$<?php echo number_format($pamt,2); ?></strong></div><?php endif; ?>

    <?php if ($o['status'] === 'revision' && $o['admin_note']): ?>
    <div style="background:rgba(96,165,250,0.06);border:1px solid rgba(96,165,250,0.18);border-radius:8px;padding:9px 12px;font-size:0.83rem;margin:9px 0;"><strong style="color:var(--blue);"><i class="ti ti-alert-triangle" style="margin-right:5px;"></i>Revision Requested:</strong><br><?php echo nl2br(htmlspecialchars($o['admin_note'])); ?></div>
    <?php endif; ?>

    <?php if ($o['delivery_link']): ?><div style="margin:8px 0;"><a href="<?php echo safe_url($o['delivery_link']); ?>" target="_blank" class="btn btn-outline btn-sm"><i class="ti ti-link"></i>View Last Delivery</a></div><?php endif; ?>

    <?php if ($o['description'] && $o['status'] === 'in_progress'): ?>
    <details style="margin:8px 0;"><summary style="font-size:0.79rem;color:var(--text-muted);cursor:pointer;">Brief Details</summary><div style="font-size:0.82rem;color:var(--text-muted);line-height:1.6;margin-top:6px;padding:8px 0;"><?php echo nl2br(htmlspecialchars($o['description'])); ?></div></details>
    <?php endif; ?>

    <div style="display:flex;gap:7px;flex-wrap:wrap;margin-top:10px;">
        <?php if ($chat_active): ?><button class="btn btn-interest btn-sm" onclick="openChatPanel(<?php echo (int)$o['id']; ?>,<?php echo json_encode($o['title']); ?>)"><i class="ti ti-messages"></i>Message Client</button><?php endif; ?>
        <?php if (in_array($o['status'],['in_progress','revision'])): ?><button class="btn btn-primary btn-sm" onclick="openDeliveryModal(<?php echo (int)$o['id']; ?>,<?php echo json_encode($o['title']); ?>)"><i class="ti ti-upload"></i>Submit Delivery</button><?php endif; ?>
        <?php if ($o['status'] === 'revision'): ?><button class="btn btn-outline btn-sm" onclick="markRevisionDone(<?php echo (int)$o['id']; ?>)"><i class="ti ti-rotate-clockwise"></i>Mark Revision Done</button><?php endif; ?>
        <?php if ($o['status'] === 'completed'): ?><span class="pill" style="background:rgba(34,197,94,0.1);color:var(--green);border:1px solid rgba(34,197,94,0.2);">Order Complete</span><?php endif; ?>
    </div>
</div>
<?php endforeach; ?>
</div>
<?php endif; ?>

<?php elseif ($dash_tab === 'earnings' && $status === 'active'): ?>
<div class="welcome-row"><div class="welcome-text"><h1>Earnings</h1><p>Your payment history from completed work.</p></div></div>
<?php
$total_earned = 0;
$approved_payments = db_fetch_all("SELECT op.*, o.title as order_title FROM order_payments op LEFT JOIN orders o ON o.id=op.order_id WHERE o.editor_id=? AND op.status='approved' ORDER BY op.submitted_at DESC", [$uid]);
foreach ($approved_payments as $ep) $total_earned += (float)($ep['amount'] ?? 0);
$pending_count = (int)db_value("SELECT COUNT(*) FROM order_payments op LEFT JOIN orders o ON o.id=op.order_id WHERE o.editor_id=? AND op.status='pending'", [$uid]);
?>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px;margin-bottom:24px;">
    <div class="earnings-card"><div class="earnings-icon" style="background:rgba(34,197,94,0.1);color:var(--green);"><i class="ti ti-currency-dollar"></i></div><div><div style="font-size:1.6rem;font-weight:900;color:var(--green);">$<?php echo number_format($total_earned,2); ?></div><div style="font-size:0.74rem;color:var(--text-muted);font-weight:700;text-transform:uppercase;letter-spacing:1px;">Total Earned</div></div></div>
    <div class="earnings-card"><div class="earnings-icon" style="background:rgba(245,158,11,0.1);color:var(--yellow);"><i class="ti ti-hourglass-half"></i></div><div><div style="font-size:1.6rem;font-weight:900;color:var(--yellow);"><?php echo $pending_count; ?></div><div style="font-size:0.74rem;color:var(--text-muted);font-weight:700;text-transform:uppercase;letter-spacing:1px;">Pending Approvals</div></div></div>
    <div class="earnings-card"><div class="earnings-icon" style="background:rgba(0,196,240,0.1);color:var(--primary);"><i class="ti ti-briefcase"></i></div><div><div style="font-size:1.6rem;font-weight:900;color:var(--primary);"><?php echo $stats['completed']??0; ?></div><div style="font-size:0.74rem;color:var(--text-muted);font-weight:700;text-transform:uppercase;letter-spacing:1px;">Orders Completed</div></div></div>
</div>
<?php if (empty($approved_payments)): ?>
<div class="empty-state"><div class="empty-icon" style="color:var(--green);background:rgba(34,197,94,0.08);border-color:rgba(34,197,94,0.2);"><i class="ti ti-currency-dollar"></i></div><h3>No earnings yet</h3><p>Complete orders and get your payments approved to see your earnings here.</p></div>
<?php else: ?>
<div class="section-title"><span>Payment History</span></div>
<div class="tbl-wrap">
<table class="tbl">
    <thead><tr><th>Order</th><th>Type</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead>
    <tbody>
    <?php foreach ($approved_payments as $ep): ?>
    <tr>
        <td style="font-weight:600;max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"><?php echo htmlspecialchars($ep['order_title']??'Order #'.$ep['order_id']); ?></td>
        <td><span class="pill" style="background:rgba(255,255,255,0.05);border:1px solid var(--border);"><?php echo ucfirst($ep['payment_type']); ?></span></td>
        <td style="font-weight:800;color:var(--green);">$<?php echo number_format((float)($ep['amount']??0),2); ?></td>
        <td style="font-size:0.81rem;color:var(--text-muted);"><?php echo date('M j, Y',strtotime($ep['submitted_at'])); ?></td>
        <td><span class="pill" style="background:rgba(34,197,94,0.1);color:var(--green);border:1px solid rgba(34,197,94,0.2);">Approved</span></td>
    </tr>
    <?php endforeach; ?>
    </tbody>
</table>
</div>
<?php endif; ?>

<?php elseif ($dash_tab === 'profile' && $status === 'active'): ?>
<div class="welcome-row"><div class="welcome-text"><h1>My Profile</h1><p>Update your public editor profile and specialties.</p></div></div>
<?php if (isset($_GET['profile_saved'])): ?><div class="notice notice-success"><i class="ti ti-circle-check" style="margin-right:8px;"></i>Profile updated successfully.</div><?php endif; ?>
<form id="profileForm" onsubmit="saveProfile(event)">
    <div class="profile-section">
        <h3><i class="ti ti-photo"></i>Avatar</h3>
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px;">
            <img id="avatarPreview" src="<?php echo htmlspecialchars(($editor_profile['avatar_url']??$user['avatar'])?:'https://i.ibb.co/JR76yvRp/1758037248-icon.png'); ?>" style="width:64px;height:64px;border-radius:50%;object-fit:cover;border:2px solid var(--border);" alt="Your profile avatar preview">
            <div style="flex:1;"><input type="url" id="avatarUrl" name="avatar_url" placeholder="Paste image URL (https://...)" value="<?php echo htmlspecialchars($editor_profile['avatar_url']??$user['avatar']??''); ?>" oninput="previewAvatar(this.value)"><div style="font-size:0.74rem;color:var(--text-muted);margin-top:4px;">Upload to Imgur, iili.io, or similar and paste the direct link.</div></div>
        </div>
    </div>
    <div class="profile-section">
        <h3><i class="ti ti-user"></i>About</h3>
        <div class="form-group"><label>Bio</label><textarea name="bio" rows="4" placeholder="Describe your editing style, experience, and what you specialize in..."><?php echo htmlspecialchars($editor_profile['bio']??''); ?></textarea></div>
        <div class="form-row-2">
            <div class="form-group"><label>Timezone</label><input type="text" name="timezone" placeholder="e.g. UTC+5, IST, EST" value="<?php echo htmlspecialchars($editor_profile['timezone']??''); ?>"></div>
            <div class="form-group"><label>Availability</label><input type="text" name="availability" placeholder="e.g. Full-time, Mon-Fri" value="<?php echo htmlspecialchars($editor_profile['availability']??''); ?>"></div>
        </div>
    </div>
    <div class="profile-section">
        <h3><i class="ti ti-star"></i>Skills</h3>
        <div class="form-group"><label>Specialties</label><input type="text" name="specialties" placeholder="YouTube Editing, Motion Graphics, Thumbnail Design..." value="<?php echo htmlspecialchars($editor_profile['specialties']??''); ?>"></div>
        <div class="form-group"><label>Tools & Software</label><input type="text" name="tools" placeholder="Premiere Pro, After Effects, DaVinci Resolve..." value="<?php echo htmlspecialchars($editor_profile['tools']??''); ?>"></div>
        <div class="form-group"><label>Portfolio URL</label><input type="url" name="portfolio_url" placeholder="https://yourportfolio.com" value="<?php echo htmlspecialchars($editor_profile['portfolio_url']??''); ?>"></div>
    </div>
    <button type="submit" class="btn btn-primary"><i class="ti ti-device-floppy"></i>Save Profile</button>
</form>

<?php elseif ($dash_tab === 'application'): ?>
<div class="welcome-row"><div class="welcome-text"><h1>Application</h1><p>Your editor application status.</p></div></div>
<?php if (!$app_status): ?>
<div style="text-align:center;padding:40px 20px;"><p style="color:var(--text-muted);margin-bottom:16px;">You haven't submitted an application yet.</p><a href="/apply" class="btn btn-primary"><i class="ti ti-file-text"></i>Apply Now</a></div>
<?php elseif ($app_status['status'] === 'pending'): ?>
<div style="text-align:center;padding:40px 20px;"><div style="font-size:50px;color:var(--primary);margin-bottom:16px;"><i class="ti ti-clock"></i></div><h2 style="font-weight:900;margin-bottom:10px;">Application Under Review</h2><p style="color:var(--text-muted);line-height:1.7;max-width:400px;margin:0 auto 20px;">We typically respond within 2-3 business days. You'll get full dashboard access once approved.</p><a href="https://discord.gg/extoarts-1402333030827425922" target="_blank" class="btn btn-outline"><i class="ti ti-brand-discord"></i>Chat on Discord</a></div>
<?php elseif ($app_status['status'] === 'rejected'): ?>
<div style="text-align:center;padding:40px 20px;"><div style="font-size:50px;color:var(--red);margin-bottom:16px;"><i class="ti ti-circle-x"></i></div><h2 style="font-weight:900;margin-bottom:10px;">Application Not Approved</h2><?php if(!empty($app_status['admin_note'])): ?><div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:14px 16px;margin:16px auto;text-align:left;font-size:0.88rem;line-height:1.6;max-width:480px;"><strong>Feedback:</strong> <?php echo htmlspecialchars($app_status['admin_note']); ?></div><?php endif; ?><a href="https://discord.gg/extoarts-1402333030827425922" target="_blank" class="btn btn-outline"><i class="ti ti-brand-discord"></i>Reach Out on Discord</a></div>
<?php elseif ($app_status['status'] === 'approved'): ?>
<div style="text-align:center;padding:40px 20px;"><div style="font-size:50px;color:var(--green);margin-bottom:16px;"><i class="ti ti-circle-check"></i></div><h2 style="font-weight:900;margin-bottom:10px;">Application Approved!</h2><p style="color:var(--text-muted);line-height:1.7;max-width:400px;margin:0 auto 20px;">You're on the team. Browse available jobs and start working.</p><a href="/dashboard?tab=jobs" class="btn btn-primary"><i class="ti ti-search"></i>Browse Jobs</a></div>
<?php endif; ?>

<?php elseif ($status === 'pending' || $status === 'rejected'): ?>
<div class="welcome-row"><div class="welcome-text"><h1>Editor HQ</h1></div></div>
<?php else: ?>
<div class="welcome-row"><div class="welcome-text"><h1>Editor HQ</h1><p>Your command center for all things ExtoArts.</p></div></div>
<?php endif; ?>

<?php endif; // end role switch ?>
</main>
</div>

<!-- ── Chat Panel ─────────────────────────────────────────────────────────── -->
<div class="chat-overlay" id="chatOverlay" onclick="closeChatPanel()"></div>
<div class="chat-panel" id="chatPanel">
    <div class="chat-panel-header">
        <span class="chat-panel-title" id="chatPanelTitle">Chat</span>
        <button onclick="closeChatPanel()" style="background:none;border:none;color:var(--text-muted);font-size:1rem;cursor:pointer;padding:4px;"><i class="ti ti-x"></i></button>
    </div>
    <div class="chat-panel-body"><iframe id="chatIframe" src="" title="Chat"></iframe></div>
</div>

<!-- ── Order Modal (client) ──────────────────────────────────────────────── -->
<?php if ($role === 'client'): ?>
<div class="modal-overlay" id="orderModal">
<div class="modal">
    <button class="modal-close" onclick="closeModal('orderModal')"><i class="ti ti-x"></i></button>
    <h2><i class="ti ti-circle-plus" style="color:var(--primary);margin-right:10px;"></i>New Order</h2>
    <form method="POST" action="/order/submit">
        <?php echo csrf_field(); ?>
        <div class="form-group">
            <label>Project Title <span style="color:var(--primary);">*</span></label>
            <input type="text" name="title" placeholder="e.g. Gaming Montage Edit - Roblox" required maxlength="300">
        </div>
        <div class="form-group">
            <label>Service Package</label>
            <div class="pkg-grid">
                <?php
                $pkgs = [
                    ['youtube_edit','YouTube Video Edit','Full video editing for YouTube content'],
                    ['thumbnail','Thumbnail Design','Eye-catching thumbnails that boost CTR'],
                    ['shorts','Shorts / Reels Edit','Fast-paced short-form content'],
                    ['custom','Custom Project','Something unique or a bundle'],
                ];
                foreach ($pkgs as [$slug,$name,$desc]):
                ?>
                <label class="pkg-option" onclick="selectPkg(this,'<?php echo $slug; ?>','<?php echo $name; ?>')">
                    <input type="radio" name="_pkg_select" value="<?php echo $slug; ?>">
                    <div class="pkg-name"><?php echo $name; ?></div>
                    <div class="pkg-desc"><?php echo $desc; ?></div>
                </label>
                <?php endforeach; ?>
            </div>
            <input type="hidden" name="package_slug" id="pkgSlug" value="">
            <input type="hidden" name="package_name" id="pkgName" value="Custom Project">
        </div>
        <div class="form-group">
            <label>Project Description <span style="color:var(--primary);">*</span></label>
            <textarea name="description" rows="5" placeholder="Describe your project in detail. Include your style preferences, reference channels, key moments to include, etc." required minlength="20"></textarea>
        </div>
        <div class="form-group">
            <label>Reference Links</label>
            <input type="text" name="reference_links" placeholder="YouTube channels, video links, or style references you like">
        </div>
        <div class="form-row-2">
            <div class="form-group">
                <label>Budget (optional)</label>
                <input type="text" name="budget" placeholder="e.g. $50-$100">
            </div>
            <div class="form-group">
                <label>Deadline (optional)</label>
                <input type="date" name="deadline" min="<?php echo date('Y-m-d', strtotime('+1 day')); ?>">
            </div>
        </div>
        <button type="submit" class="btn btn-primary btn-full"><i class="ti ti-send"></i>Place Order</button>
    </form>
</div>
</div>
<?php endif; ?>

<!-- ── Delivery Modal (editor) ───────────────────────────────────────────── -->
<?php if ($role === 'editor'): ?>
<div class="modal-overlay" id="deliveryModal">
<div class="modal">
    <button class="modal-close" onclick="closeModal('deliveryModal')"><i class="ti ti-x"></i></button>
    <h2><i class="ti ti-upload" style="color:var(--primary);margin-right:10px;"></i>Submit Delivery</h2>
    <p id="deliveryOrderTitle" style="color:var(--text-muted);font-size:0.86rem;margin-bottom:18px;"></p>
    <div class="form-group">
        <label>Delivery Link <span style="color:var(--primary);">*</span></label>
        <input type="url" id="deliveryLink" placeholder="Google Drive, WeTransfer, Dropbox, etc." required>
        <div style="font-size:0.75rem;color:var(--text-muted);margin-top:4px;">Make sure the link has sharing enabled (view access for anyone with the link).</div>
    </div>
    <button class="btn btn-primary btn-full" onclick="submitDelivery()"><i class="ti ti-send"></i>Submit Delivery</button>
</div>
</div>

<!-- Interest Modal -->
<div class="modal-overlay" id="interestModal">
<div class="modal">
    <button class="modal-close" onclick="closeModal('interestModal')"><i class="ti ti-x"></i></button>
    <h2><i class="ti ti-flag-2" style="color:var(--primary);margin-right:10px;"></i>Express Interest</h2>
    <p id="interestOrderTitle" style="color:var(--text-muted);font-size:0.86rem;margin-bottom:16px;"></p>
    <div class="notice notice-pending" style="margin-bottom:16px;font-size:0.83rem;"><i class="ti ti-info-circle" style="margin-right:7px;"></i>Admin will assign you to this order if selected. You'll be notified via the dashboard.</div>
    <div class="form-group">
        <label>Message (optional)</label>
        <textarea id="interestMsg" rows="3" placeholder="Why are you a great fit for this project? Any relevant experience?"></textarea>
    </div>
    <button class="btn btn-primary btn-full" onclick="submitInterest()"><i class="ti ti-send"></i>Send Interest</button>
</div>
</div>
<?php endif; ?>

<!-- ── Reject Editor Modal (admin) ───────────────────────────────────────── -->
<?php if ($role === 'admin'): ?>
<div class="modal-overlay" id="rejectModal">
<div class="modal">
    <button class="modal-close" onclick="closeModal('rejectModal')"><i class="ti ti-x"></i></button>
    <h2><i class="ti ti-circle-x" style="color:var(--red);margin-right:10px;"></i>Reject Application</h2>
    <div class="form-group"><label>Feedback Note (optional)</label><textarea id="rejectNote" rows="4" placeholder="Explain why the application was not approved. This helps the editor improve."></textarea></div>
    <div style="display:flex;gap:9px;"><button class="btn btn-reject" onclick="submitReject()"><i class="ti ti-x"></i>Reject</button><button class="btn btn-outline" onclick="closeModal('rejectModal')">Cancel</button></div>
</div>
</div>

<!-- Order Edit Modal (admin) -->
<div class="modal-overlay" id="orderEditModal">
<div class="modal">
    <button class="modal-close" onclick="closeModal('orderEditModal')"><i class="ti ti-x"></i></button>
    <h2><i class="ti ti-edit" style="color:var(--primary);margin-right:10px;"></i>Edit Order</h2>
    <input type="hidden" id="editOrderId">
    <div class="form-group"><label>Status</label>
        <select id="editStatus">
            <?php foreach ($status_labels as $k=>[$l,$c]): ?><option value="<?php echo $k; ?>"><?php echo $l; ?></option><?php endforeach; ?>
        </select>
    </div>
    <div class="form-group"><label>Assign Editor</label>
        <select id="editEditorId">
            <option value="">Unassigned</option>
            <?php foreach ($editors_list as $e): ?><option value="<?php echo $e['id']; ?>"><?php echo htmlspecialchars($e['name']); ?></option><?php endforeach; ?>
        </select>
    </div>
    <div class="form-row-2">
        <div class="form-group"><label>Payment Amount ($)</label><input type="number" id="editPayAmount" step="0.01" min="0" placeholder="0.00"></div>
        <div class="form-group"><label>Deadline</label><input type="date" id="editDeadline"></div>
    </div>
    <div class="form-group"><label>Delivery Link</label><input type="url" id="editDelivery" placeholder="https://..."></div>
    <div class="form-group"><label>Admin Note</label><textarea id="editNote" rows="3" placeholder="Notes visible to client/editor..."></textarea></div>
    <button class="btn btn-primary btn-full" onclick="submitOrderEdit()"><i class="ti ti-device-floppy"></i>Save Changes</button>
</div>
</div>

<!-- Payment Method Modal (admin) -->
<div class="modal-overlay" id="pmModal">
<div class="modal">
    <button class="modal-close" onclick="closeModal('pmModal')"><i class="ti ti-x"></i></button>
    <h2 id="pmModalTitle"><i class="ti ti-wallet" style="color:var(--primary);margin-right:10px;"></i>Add Payment Method</h2>
    <input type="hidden" id="pmId" value="0">
    <div class="form-row-2">
        <div class="form-group"><label>Type</label>
            <select id="pmType"><option value="crypto">Crypto</option><option value="bank">Bank Transfer</option><option value="paypal">PayPal</option><option value="other">Other</option></select>
        </div>
        <div class="form-group"><label>Label</label><input type="text" id="pmLabel" placeholder="e.g. USDT (TRC20)"></div>
    </div>
    <div class="form-group"><label>Address / Account</label><input type="text" id="pmValue" placeholder="Wallet address, account number, PayPal email..."></div>
    <div class="form-row-2">
        <div class="form-group"><label>Network (optional)</label><input type="text" id="pmNetwork" placeholder="e.g. TRC20, ERC20"></div>
        <div class="form-group"><label>Sort Order</label><input type="number" id="pmSort" value="0" min="0"></div>
    </div>
    <div class="form-group"><label>Instructions (optional)</label><input type="text" id="pmInstructions" placeholder="Any special instructions for the client..."></div>
    <button class="btn btn-primary btn-full" onclick="savePm()"><i class="ti ti-device-floppy"></i>Save Method</button>
</div>
</div>
<?php endif; ?>

<!-- Delete User Modal (admin) -->
<?php if ($role === 'admin'): ?>
<div class="modal-overlay" id="deleteUserModal">
<div class="modal">
    <button class="modal-close" onclick="closeModal('deleteUserModal')"><i class="ti ti-x"></i></button>
    <h2><i class="ti ti-user-x" style="color:var(--red);margin-right:10px;"></i>Remove User</h2>
    <p id="delUserDesc" style="color:var(--text-muted);font-size:0.86rem;margin-bottom:16px;"></p>
    <div class="del-choice" onclick="softDeleteUser()">
        <h4><i class="ti ti-user-off" style="color:var(--yellow);margin-right:6px;"></i>Soft Delete (Anonymize)</h4>
        <p>Removes personal data and blocks login. Order and payment records are kept for accounting. Can be recovered from DB if needed.</p>
    </div>
    <div class="del-choice" onclick="promptHardDelete()">
        <h4><i class="ti ti-trash" style="color:var(--red);margin-right:6px;"></i>Hard Delete (Permanent)</h4>
        <p>Permanently removes the account. Orders are kept but unlinked. Requires typed confirmation. Cannot be undone.</p>
    </div>
    <div id="delUserImpact" style="display:none;background:rgba(239,68,68,0.07);border:1px solid rgba(239,68,68,0.25);border-radius:10px;padding:12px 14px;margin-top:10px;">
        <div style="font-size:0.82rem;font-weight:700;color:var(--red);margin-bottom:6px;"><i class="ti ti-alert-triangle" style="margin-right:6px;"></i>Permanent deletion impact</div>
        <div id="delUserImpactBody" style="font-size:0.8rem;color:var(--text-muted);margin-bottom:10px;"></div>
        <input type="text" id="delUserConfirmInput" class="pay-input" placeholder='Type CONFIRMED to proceed' style="margin-bottom:10px;">
        <button class="btn btn-reject btn-full" onclick="confirmHardDelete()"><i class="ti ti-trash"></i>Permanently Delete</button>
    </div>
    <button class="btn btn-outline btn-full" style="margin-top:10px;" onclick="closeModal('deleteUserModal')">Cancel</button>
</div>
</div>
<?php endif; ?>

<script>
const CSRF = <?php echo json_encode(csrf_token()); ?>;
const ROLE = <?php echo json_encode($role); ?>;

// ── Sidebar ───────────────────────────────────────────────────────────────────
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebarOverlay').classList.toggle('open');
}
function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('open');
}

// ── Modals ────────────────────────────────────────────────────────────────────
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('.modal-overlay').forEach(mo => {
    mo.addEventListener('click', e => { if (e.target === mo) mo.classList.remove('open'); });
});

function openOrderModal() { openModal('orderModal'); }
function selectPkg(el, slug, name) {
    document.querySelectorAll('.pkg-option').forEach(p => p.classList.remove('selected'));
    el.classList.add('selected');
    document.getElementById('pkgSlug').value = slug;
    document.getElementById('pkgName').value = name;
}

// ── Chat panel ────────────────────────────────────────────────────────────────
function openChatPanel(oid, title) {
    document.getElementById('chatPanelTitle').textContent = title || 'Chat';
    document.getElementById('chatIframe').src = '/chat?oid=' + oid;
    document.getElementById('chatPanel').classList.add('open');
    document.getElementById('chatOverlay').classList.add('open');
    /* Focus the iframe so keyboard events land inside it */
    setTimeout(() => {
        const frame = document.getElementById('chatIframe');
        try { frame.contentWindow.focus(); } catch(e) {}
        frame.focus();
    }, 350);
}
function closeChatPanel() {
    document.getElementById('chatPanel').classList.remove('open');
    document.getElementById('chatOverlay').classList.remove('open');
    setTimeout(() => { document.getElementById('chatIframe').src = ''; }, 320);
}
/* Escape key closes chat panel */
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.getElementById('chatPanel').classList.contains('open')) {
        closeChatPanel();
    }
});

// ── AJAX helper ───────────────────────────────────────────────────────────────
async function apiPost(action, data = {}) {
    const payload = new URLSearchParams({ action, csrf_token: CSRF, ...data });
    const r = await fetch('/api/order-action', { method: 'POST', body: payload });
    return r.json();
}

function showToast(msg, ok = true) {
    const d = document.createElement('div');
    d.style.cssText = `position:fixed;bottom:24px;right:24px;z-index:9999;padding:12px 18px;border-radius:12px;font-size:0.86rem;font-weight:700;max-width:340px;animation:slideUp 0.3s ease;${ok?'background:rgba(34,197,94,0.15);border:1px solid rgba(34,197,94,0.3);color:#86efac;':'background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.3);color:#fca5a5;'}`;
    d.textContent = msg;
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 3800);
}

// ── Client actions ────────────────────────────────────────────────────────────
async function submitPayment(oid, type) {
    const ref  = document.getElementById('payRef_' + oid)?.value?.trim();
    const note = document.getElementById('payNote_' + oid)?.value?.trim() || '';
    if (!ref) { showToast('Please enter your payment reference.', false); return; }
    const r = await apiPost('submit_' + type + '_payment', { order_id: oid, payment_ref: ref, payment_note: note });
    if (r.ok) { showToast(r.msg); setTimeout(() => location.reload(), 1500); }
    else showToast(r.error || 'Error. Please try again.', false);
}

async function requestRevision(oid) {
    const note = prompt('Describe the changes you need (optional):') || '';
    const r = await apiPost('request_revision', { order_id: oid, note });
    if (r.ok) { showToast(r.msg); setTimeout(() => location.reload(), 1500); }
    else showToast(r.error || 'Error.', false);
}

// ── Editor actions ────────────────────────────────────────────────────────────
let _deliveryOid = 0;
let _interestOid = 0;

function openDeliveryModal(oid, title) {
    _deliveryOid = oid;
    document.getElementById('deliveryOrderTitle').textContent = title;
    document.getElementById('deliveryLink').value = '';
    openModal('deliveryModal');
}

async function submitDelivery() {
    const link = document.getElementById('deliveryLink').value.trim();
    if (!link) { showToast('Please enter a delivery link.', false); return; }
    const r = await apiPost('submit_delivery', { order_id: _deliveryOid, delivery_link: link });
    if (r.ok) { showToast(r.msg); closeModal('deliveryModal'); setTimeout(() => location.reload(), 1500); }
    else showToast(r.error || 'Error.', false);
}

async function markRevisionDone(oid) {
    const r = await apiPost('mark_revision_done', { order_id: oid });
    if (r.ok) { showToast(r.msg); setTimeout(() => location.reload(), 1200); }
    else showToast(r.error || 'Error.', false);
}

function openInterestModal(oid, title) {
    _interestOid = oid;
    document.getElementById('interestOrderTitle').textContent = title;
    document.getElementById('interestMsg').value = '';
    openModal('interestModal');
}

async function submitInterest() {
    const msg = document.getElementById('interestMsg').value.trim();
    const r = await apiPost('express_interest', { order_id: _interestOid, message: msg });
    if (r.ok) { showToast(r.msg); closeModal('interestModal'); setTimeout(() => location.reload(), 1500); }
    else showToast(r.error || 'Error.', false);
}

async function expressInterest(oid, btn) {
    const r = await apiPost('express_interest', { order_id: oid, message: '' });
    if (r.ok) { showToast(r.msg); setTimeout(() => location.reload(), 1200); }
    else showToast(r.error || 'Error.', false);
}

async function withdrawInterest(oid, btn) {
    const r = await apiPost('withdraw_interest', { order_id: oid });
    if (r.ok) { showToast(r.msg); setTimeout(() => location.reload(), 1200); }
    else showToast(r.error || 'Error.', false);
}

function previewAvatar(url) {
    const el = document.getElementById('avatarPreview');
    if (el && url.startsWith('http')) el.src = url;
}

async function saveProfile(e) {
    e.preventDefault();
    const f = document.getElementById('profileForm');
    const data = Object.fromEntries(new FormData(f));
    const r = await apiPost('update_profile', data);
    if (r.ok) showToast(r.msg);
    else showToast(r.error || 'Error.', false);
}

// ── Admin actions ─────────────────────────────────────────────────────────────
let _rejectAppId = 0, _rejectUserId = 0;

function openRejectModal(app_id, user_id) {
    _rejectAppId = app_id; _rejectUserId = user_id;
    document.getElementById('rejectNote').value = '';
    openModal('rejectModal');
}

async function submitReject() {
    const note = document.getElementById('rejectNote').value.trim();
    const r = await apiPost('reject_editor', { app_id: _rejectAppId, user_id: _rejectUserId, admin_note: note });
    if (r.ok) { showToast(r.msg); closeModal('rejectModal'); setTimeout(() => location.reload(), 1200); }
    else showToast(r.error || 'Error.', false);
}

async function adminAction(action, data = {}, guard = true) {
    if (!guard) return;
    const r = await apiPost(action, data);
    if (r.ok) { showToast(r.msg); setTimeout(() => location.reload(), 1200); }
    else showToast(r.error || 'Error.', false);
}

async function adminPaymentAction(oid, action) {
    const r = await apiPost(action, { order_id: oid });
    if (r.ok) { showToast(r.msg); setTimeout(() => location.reload(), 1200); }
    else showToast(r.error || 'Error.', false);
}

async function assignEditor(oid, eid, ename) {
    if (!confirm('Assign ' + ename + ' to this order?')) return;
    const r = await apiPost('assign_editor', { order_id: oid, editor_id: eid });
    if (r.ok) { showToast(r.msg); setTimeout(() => location.reload(), 1200); }
    else showToast(r.error || 'Error.', false);
}

function openOrderEdit(order) {
    document.getElementById('editOrderId').value = order.id;
    document.getElementById('editStatus').value = order.status;
    document.getElementById('editEditorId').value = order.editor_id || '';
    document.getElementById('editPayAmount').value = order.payment_amount || '';
    document.getElementById('editDeadline').value = order.deadline || '';
    document.getElementById('editDelivery').value = order.delivery_link || '';
    document.getElementById('editNote').value = order.admin_note || '';
    openModal('orderEditModal');
}

async function submitOrderEdit() {
    const oid     = document.getElementById('editOrderId').value;
    const status  = document.getElementById('editStatus').value;
    const eid     = document.getElementById('editEditorId').value;
    const amount  = document.getElementById('editPayAmount').value;
    const deadline = document.getElementById('editDeadline').value;
    const delivery = document.getElementById('editDelivery').value;
    const note    = document.getElementById('editNote').value;
    const r = await apiPost('update_order', { order_id: oid, order_status: status, editor_id: eid, payment_amount: amount, delivery_link: delivery, admin_note: note });
    if (r.ok) { showToast(r.msg); closeModal('orderEditModal'); setTimeout(() => location.reload(), 1200); }
    else showToast(r.error || 'Error.', false);
}

function openPmModal() {
    document.getElementById('pmId').value = 0;
    document.getElementById('pmModalTitle').innerHTML = '<i class="ti ti-wallet" style="color:var(--primary);margin-right:10px;"></i>Add Payment Method';
    ['pmType','pmLabel','pmValue','pmNetwork','pmInstructions'].forEach(id => { document.getElementById(id).value = ''; });
    document.getElementById('pmSort').value = 0;
    openModal('pmModal');
}

function editPmModal(pm) {
    document.getElementById('pmId').value = pm.id;
    document.getElementById('pmModalTitle').innerHTML = '<i class="ti ti-edit" style="color:var(--primary);margin-right:10px;"></i>Edit Payment Method';
    document.getElementById('pmType').value = pm.type || '';
    document.getElementById('pmLabel').value = pm.label || '';
    document.getElementById('pmValue').value = pm.value || '';
    document.getElementById('pmNetwork').value = pm.network || '';
    document.getElementById('pmInstructions').value = pm.instructions || '';
    document.getElementById('pmSort').value = pm.sort_order || 0;
    openModal('pmModal');
}

async function savePm() {
    const data = {
        pm_id: document.getElementById('pmId').value,
        pm_type: document.getElementById('pmType').value,
        pm_label: document.getElementById('pmLabel').value,
        pm_value: document.getElementById('pmValue').value,
        pm_network: document.getElementById('pmNetwork').value,
        pm_instructions: document.getElementById('pmInstructions').value,
        pm_sort: document.getElementById('pmSort').value,
    };
    const r = await apiPost('save_payment_method', data);
    if (r.ok) { showToast(r.msg); closeModal('pmModal'); setTimeout(() => location.reload(), 1200); }
    else showToast(r.error || 'Error.', false);
}

async function togglePm(id) {
    const r = await apiPost('toggle_payment_method', { pm_id: id });
    if (r.ok) { showToast(r.msg); setTimeout(() => location.reload(), 1000); }
    else showToast(r.error || 'Error.', false);
}

async function deletePm(id) {
    if (!confirm('Delete this payment method?')) return;
    const r = await apiPost('delete_payment_method', { pm_id: id });
    if (r.ok) { showToast(r.msg); setTimeout(() => location.reload(), 1000); }
    else showToast(r.error || 'Error.', false);
}

// ── CSS animation ─────────────────────────────────────────────────────────────
const style = document.createElement('style');
style.textContent = '@keyframes slideUp{from{transform:translateY(20px);opacity:0;}to{transform:translateY(0);opacity:1;}}';
document.head.appendChild(style);

// ── Notification Bell ─────────────────────────────────────────────────────────
function toggleNotifDropdown() {
    const dd = document.getElementById('notifDropdown');
    if (dd) dd.classList.toggle('open');
}
async function markAllNotifsRead() {
    const r = await apiPost('mark_notifications_read', {});
    if (r.ok) {
        document.querySelectorAll('.notif-badge').forEach(b => b.remove());
        document.querySelectorAll('.notif-item.unread').forEach(i => i.classList.remove('unread'));
        const btn = document.querySelector('#notifDropdown .notif-header button');
        if (btn) btn.remove();
        showToast('All notifications marked as read.');
    }
}
document.addEventListener('click', e => {
    const bell = document.getElementById('notifBell');
    if (bell && !bell.contains(e.target)) {
        const dd = document.getElementById('notifDropdown');
        if (dd) dd.classList.remove('open');
    }
});

// ── Table search / filter ─────────────────────────────────────────────────────
function filterTable(searchId, tableId) {
    const q = (document.getElementById(searchId)?.value || '').toLowerCase();
    const tbl = document.getElementById(tableId);
    if (!tbl) return;
    tbl.querySelectorAll('tbody tr').forEach(tr => {
        tr.style.display = tr.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
}

// ── Delete User ───────────────────────────────────────────────────────────────
let _delUserId = 0;
function openDeleteUserModal(uid, name) {
    _delUserId = uid;
    document.getElementById('delUserImpact').style.display = 'none';
    document.getElementById('delUserConfirmInput').value = '';
    document.getElementById('delUserDesc').textContent = 'Account: ' + name;
    openModal('deleteUserModal');
}
async function softDeleteUser() {
    if (!_delUserId) return;
    if (!confirm('Anonymize this user? Their order history will be kept but login is blocked.')) return;
    const r = await apiPost('delete_user', { user_id: _delUserId });
    if (r.ok) { showToast(r.msg); closeModal('deleteUserModal'); setTimeout(() => location.reload(), 1200); }
    else showToast(r.error || 'Error.', false);
}
async function promptHardDelete() {
    if (!_delUserId) return;
    const r = await apiPost('hard_delete_user', { user_id: _delUserId, confirmed: '' });
    if (r.needs_confirm) {
        const imp = r.impact || {};
        const body = `${imp.name || 'User'} (${imp.email || ''}) - ${imp.orders || 0} orders and ${imp.tickets || 0} tickets will be unlinked.`;
        document.getElementById('delUserImpactBody').textContent = body;
        document.getElementById('delUserImpact').style.display = 'block';
    } else if (!r.ok) {
        showToast(r.error || 'Error.', false);
    }
}
async function confirmHardDelete() {
    const val = document.getElementById('delUserConfirmInput').value.trim();
    if (val !== 'CONFIRMED') { showToast('Type CONFIRMED to proceed.', false); return; }
    const r = await apiPost('hard_delete_user', { user_id: _delUserId, confirmed: 'CONFIRMED' });
    if (r.ok) { showToast(r.msg); closeModal('deleteUserModal'); setTimeout(() => location.reload(), 1300); }
    else showToast(r.error || 'Error.', false);
}
</script>
<script type="module" src="/src/authGuard.js"></script>
</body>
</html>
