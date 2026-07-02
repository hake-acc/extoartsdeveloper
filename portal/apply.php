<?php
declare(strict_types=1);
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/notify.php';
auth_require('editor');
secure_headers(true);

$user = auth_user();
$uid  = (int)($user['id'] ?? 0);

// Session sync: break purgatory loop - check if DB has approved since last login
if ($user['status'] === 'pending') {
    $row_sync = db_fetch("SELECT status FROM users WHERE id = ? LIMIT 1", [$uid]);
    if ($row_sync && $row_sync['status'] === 'active') {
        $_SESSION['user']['status'] = 'active';
        header('Location: /dashboard');
        exit;
    }
}

if ($user['status'] === 'active') {
    header('Location: /dashboard');
    exit;
}

// Check existing application
$already_applied = false;
$app_status = null;
$existing_app = db_fetch("SELECT status, admin_note FROM editor_applications WHERE user_id = ? LIMIT 1", [$uid]);
if ($existing_app) {
    $already_applied = true;
    $app_status = $existing_app;
}

$errors  = [];
$success = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !$already_applied) {
    if (!csrf_verify()) {
        $errors[] = 'Security check failed. Please refresh and try again.';
    } else {
        $display_name    = trim($_POST['display_name'] ?? '');
        $bio             = trim($_POST['bio'] ?? '');
        $specialties     = trim($_POST['specialties'] ?? '');
        $tools           = trim($_POST['tools'] ?? '');
        $exp             = (int)($_POST['experience_years'] ?? 0);
        $drive_links_raw = trim($_POST['drive_links'] ?? '');
        $portfolio_url   = trim($_POST['portfolio_url'] ?? '');
        $timezone        = trim($_POST['timezone'] ?? '');
        $availability    = trim($_POST['availability'] ?? '');
        $agreed          = isset($_POST['agreed_tos']) ? 1 : 0;

        if (!$display_name) $errors[] = 'Display name is required.';
        if (strlen($display_name) > 100) $errors[] = 'Display name must be under 100 characters.';
        if (!$bio || strlen($bio) < 50) $errors[] = 'Bio must be at least 50 characters.';
        if (!$specialties) $errors[] = 'Please select at least one specialty.';
        if (!$tools) $errors[] = 'Please list the tools you use.';
        if (!$drive_links_raw) $errors[] = 'At least one video sample link is required.';
        if (!$agreed) $errors[] = 'You must agree to the Terms of Service.';

        $drive_lines = array_filter(array_map('trim', explode("\n", $drive_links_raw)));
        $valid_links = [];
        foreach ($drive_lines as $link) {
            if (filter_var($link, FILTER_VALIDATE_URL)) {
                $valid_links[] = $link;
            } else {
                $errors[] = 'Invalid link: "' . htmlspecialchars(substr($link, 0, 60)) . '" - must be a valid URL.';
            }
        }

        if (count($valid_links) < 1) $errors[] = 'Please provide at least 1 valid video sample link.';
        if (count($valid_links) > 10) $errors[] = 'Maximum 10 links allowed.';
        if ($portfolio_url && !filter_var($portfolio_url, FILTER_VALIDATE_URL)) $errors[] = 'Portfolio URL is not valid.';

        if (empty($errors)) {
            try {
                db_insert(
                    "INSERT INTO editor_applications (user_id,display_name,bio,specialties,tools,experience_years,drive_links,portfolio_url,timezone,availability,agreed_tos,status,submitted_at)
                     VALUES (?,?,?,?,?,?,?,?,?,?,?,'pending',datetime('now'))",
                    [$uid, $display_name, $bio, $specialties, $tools, $exp, implode("\n", $valid_links), $portfolio_url, $timezone, $availability, $agreed]
                );
                $success              = true;
                $already_applied      = true;
                $app_status           = ['status' => 'pending', 'admin_note' => ''];
                notify_new_application($user, $display_name, $specialties, $bio, $tools, $exp);
            } catch (Throwable $e) {
                error_log('[ExtoArts] apply submit error: ' . $e->getMessage());
                $errors[] = 'Could not save your application. Please try again or reach us on <a href="https://discord.gg/extoarts-1402333030827425922" target="_blank" style="color:var(--primary)">Discord</a>.';
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
<title>Editor Application | ExtoArts</title>
<meta name="robots" content="noindex,nofollow">
<link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">

<style>@font-face{font-family:'Plus Jakarta Sans';font-style:normal;font-weight:400 900;font-display:swap;src:url('/css/fonts/plus-jakarta-sans.woff2') format('woff2');}</style>
<link rel="preload" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.44.0/dist/fonts/tabler-icons.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.44.0/dist/tabler-icons.min.css">
<style>
*{margin:0;padding:0;box-sizing:border-box;}
:root{--bg:#07070c;--surface:rgba(255,255,255,0.04);--primary:#00c4f0;--border:rgba(255,255,255,0.08);--text-main:#f5f5f7;--text-muted:#6b7280;}
body{background:var(--bg);color:var(--text-main);font-family:'Plus Jakarta Sans',sans-serif;min-height:100vh;padding:40px 20px;}
.wrap{max-width:720px;margin:0 auto;}
.topbar{display:flex;align-items:center;gap:12px;margin-bottom:36px;}
.topbar a{font-weight:900;font-size:1.1rem;color:var(--text-main);text-decoration:none;}
.topbar span{color:var(--text-muted);font-size:0.85rem;}
h1{font-size:1.7rem;font-weight:900;margin-bottom:6px;}
.sub{color:var(--text-muted);font-size:0.92rem;margin-bottom:32px;}
.card{background:rgba(255,255,255,0.03);border:1px solid var(--border);border-radius:18px;padding:28px;margin-bottom:18px;}
.card h2{font-size:1rem;font-weight:800;margin-bottom:20px;display:flex;align-items:center;gap:9px;}
.card h2 i{color:var(--primary);}
.form-group{margin-bottom:18px;}
.form-group label{display:block;font-size:0.83rem;font-weight:700;margin-bottom:7px;}
.req{color:var(--primary);}
input,select,textarea{width:100%;background:rgba(255,255,255,0.05);border:1px solid var(--border);border-radius:11px;padding:11px 14px;color:var(--text-main);font-size:0.9rem;font-family:inherit;outline:none;transition:border-color 0.2s;}
input:focus,select:focus,textarea:focus{border-color:var(--primary);}
textarea{resize:vertical;min-height:90px;}
select option{background:#0d0d14;}
.hint{font-size:0.77rem;color:var(--text-muted);margin-top:4px;}
.checkbox-label{display:flex;align-items:flex-start;gap:10px;cursor:pointer;font-size:0.88rem;line-height:1.5;}
.checkbox-label input[type=checkbox]{width:auto;margin-top:2px;}
.spec-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:8px;}
.spec-opt{border:1px solid var(--border);border-radius:9px;padding:9px 12px;cursor:pointer;display:flex;align-items:center;gap:8px;font-size:0.85rem;transition:0.2s;}
.spec-opt:hover,.spec-opt.selected{border-color:var(--primary);background:rgba(0,196,240,0.06);color:var(--primary);}
.spec-opt input{display:none;}
.btn{display:inline-flex;align-items:center;gap:7px;padding:11px 22px;border-radius:12px;font-size:0.9rem;font-weight:700;border:none;cursor:pointer;font-family:inherit;transition:all 0.2s;}
.btn-primary{background:var(--primary);color:#000;width:100%;justify-content:center;}
.btn-primary:hover{background:#22d3ee;}
.error-box{background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.25);color:#fca5a5;padding:14px 18px;border-radius:12px;font-size:0.88rem;line-height:1.6;margin-bottom:24px;}
.success-card{text-align:center;padding:50px 40px;}
.success-icon{font-size:50px;color:var(--primary);margin-bottom:16px;}
a{color:var(--primary);}
</style>
</head>
<body>
<div class="wrap">
    <div class="topbar">
        <a href="/">ExtoArts</a>
        <span>/</span>
        <span>Editor Application</span>
    </div>

<?php if ($already_applied || $success): ?>
    <div class="card success-card">
        <?php if (($app_status['status'] ?? '') === 'pending'): ?>
        <div class="success-icon"><i class="ti ti-clock"></i></div>
        <h1 style="margin-bottom:10px;">Application Received</h1>
        <p style="color:var(--text-muted);line-height:1.7;margin-bottom:20px;">Your application is under review. We typically respond within 2-3 business days.</p>
        <a href="https://discord.gg/extoarts-1402333030827425922" target="_blank"><i class="ti ti-brand-discord"></i> Questions? Join our Discord</a>
        <?php elseif (($app_status['status'] ?? '') === 'rejected'): ?>
        <div class="success-icon" style="color:#ef4444;"><i class="ti ti-circle-x"></i></div>
        <h1 style="margin-bottom:10px;">Application Not Approved</h1>
        <p style="color:var(--text-muted);line-height:1.7;">Unfortunately your application was not approved at this time.</p>
        <?php if (!empty($app_status['admin_note'])): ?>
        <div style="background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:12px;padding:14px 16px;margin:16px 0;text-align:left;font-size:0.88rem;line-height:1.6;"><strong>Feedback:</strong> <?php echo htmlspecialchars($app_status['admin_note']); ?></div>
        <?php endif; ?>
        <a href="https://discord.gg/extoarts-1402333030827425922" target="_blank"><i class="ti ti-brand-discord"></i> Reach out on Discord</a>
        <?php elseif (($app_status['status'] ?? '') === 'approved'): ?>
        <div class="success-icon" style="color:#22c55e;"><i class="ti ti-circle-check"></i></div>
        <h1 style="margin-bottom:10px;">Application Approved!</h1>
        <p style="color:var(--text-muted);line-height:1.7;margin-bottom:20px;">Welcome to the team! Go to your dashboard to see available orders.</p>
        <a href="/dashboard" class="btn btn-primary" style="display:inline-flex;width:auto;"><i class="ti ti-rocket"></i>Go to Dashboard</a>
        <?php endif; ?>
    </div>
<?php else: ?>
    <h1>Join the ExtoArts Team</h1>
    <p class="sub">Apply to become a video editor or designer. We review all applications within 2-3 business days.</p>

    <?php if (!empty($errors)): ?>
    <div class="error-box"><i class="ti ti-alert-triangle" style="margin-right:8px;"></i><strong>Please fix the following:</strong>
        <ul style="margin-top:8px;"><?php foreach ($errors as $e): ?><li style="margin:4px 0 4px 18px;"><?php echo $e; ?></li><?php endforeach; ?></ul>
    </div>
    <?php endif; ?>

    <form method="POST" id="applyForm">
        <?php echo csrf_field(); ?>

        <div class="card">
            <h2><i class="ti ti-user"></i>Personal Info</h2>
            <div class="form-group">
                <label>Display Name <span class="req">*</span></label>
                <input type="text" name="display_name" maxlength="100" value="<?php echo htmlspecialchars($_POST['display_name'] ?? $user['name']); ?>" required>
                <div class="hint">This is the name clients will see</div>
            </div>
            <div class="form-group">
                <label>Bio / About You <span class="req">*</span></label>
                <textarea name="bio" rows="5" minlength="50" required placeholder="Tell us about yourself, your style, and why you want to join ExtoArts..."><?php echo htmlspecialchars($_POST['bio'] ?? ''); ?></textarea>
                <div class="hint">Minimum 50 characters</div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
                <div class="form-group">
                    <label>Years of Experience <span class="req">*</span></label>
                    <select name="experience_years">
                        <?php foreach ([0,1,2,3,5,8,10] as $y): ?>
                        <option value="<?php echo $y; ?>" <?php echo (($_POST['experience_years'] ?? 0) == $y) ? 'selected' : ''; ?>><?php echo $y === 0 ? 'Less than 1 year' : ($y . '+ years'); ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div class="form-group">
                    <label>Timezone</label>
                    <input type="text" name="timezone" placeholder="e.g. UTC+5, EST, IST" value="<?php echo htmlspecialchars($_POST['timezone'] ?? ''); ?>">
                </div>
            </div>
            <div class="form-group">
                <label>Availability</label>
                <input type="text" name="availability" placeholder="e.g. Full-time, Part-time, Weekends only" value="<?php echo htmlspecialchars($_POST['availability'] ?? ''); ?>">
            </div>
        </div>

        <div class="card">
            <h2><i class="ti ti-star"></i>Specialties <span class="req">*</span></h2>
            <div class="spec-grid" id="specGrid">
                <?php
                $specs = ['YouTube Editing','Short-Form / Reels','Gaming Videos','Motion Graphics','Thumbnail Design','Color Grading','VFX / Effects','Ads & Promos','Podcast Editing','Documentary Style'];
                $selSpec = array_filter(array_map('trim', explode(',', $_POST['specialties'] ?? '')));
                foreach ($specs as $s):
                    $selected = in_array($s, $selSpec) ? 'selected' : '';
                ?>
                <label class="spec-opt <?php echo $selected; ?>" onclick="toggleSpec(this)">
                    <input type="checkbox" name="spec_cb[]" value="<?php echo htmlspecialchars($s); ?>" <?php echo $selected ? 'checked' : ''; ?>>
                    <?php echo htmlspecialchars($s); ?>
                </label>
                <?php endforeach; ?>
            </div>
            <input type="hidden" name="specialties" id="specialtiesHidden" value="<?php echo htmlspecialchars($_POST['specialties'] ?? ''); ?>">
        </div>

        <div class="card">
            <h2><i class="ti ti-adjustments"></i>Tools & Software</h2>
            <div class="form-group">
                <label>Software You Use <span class="req">*</span></label>
                <input type="text" name="tools" placeholder="e.g. Premiere Pro, After Effects, DaVinci Resolve, Photoshop" value="<?php echo htmlspecialchars($_POST['tools'] ?? ''); ?>" required>
                <div class="hint">List all editing and design tools you're proficient with</div>
            </div>
        </div>

        <div class="card">
            <h2><i class="ti ti-link"></i>Portfolio Samples</h2>
            <div class="form-group">
                <label>Video Sample Links <span class="req">*</span></label>
                <textarea name="drive_links" rows="5" placeholder="Paste one link per line (Google Drive, YouTube, Vimeo, etc.)&#10;https://drive.google.com/...&#10;https://youtu.be/..."><?php echo htmlspecialchars($_POST['drive_links'] ?? ''); ?></textarea>
                <div class="hint">1-10 links, one per line. Include your best work.</div>
            </div>
            <div class="form-group">
                <label>Portfolio Website (optional)</label>
                <input type="url" name="portfolio_url" placeholder="https://yourportfolio.com" value="<?php echo htmlspecialchars($_POST['portfolio_url'] ?? ''); ?>">
            </div>
        </div>

        <div class="card">
            <label class="checkbox-label">
                <input type="checkbox" name="agreed_tos" <?php echo isset($_POST['agreed_tos']) ? 'checked' : ''; ?>>
                <span>I have read and agree to the <a href="/tos" target="_blank">Terms of Service</a>. I understand that ExtoArts may use my submitted work samples for evaluation purposes only.</span>
            </label>
        </div>

        <button type="submit" class="btn btn-primary"><i class="ti ti-send"></i>Submit Application</button>
    </form>
<?php endif; ?>
</div>

<script>
function toggleSpec(el) {
    el.classList.toggle('selected');
    const cb = el.querySelector('input[type=checkbox]');
    cb.checked = el.classList.contains('selected');
    const selected = [...document.querySelectorAll('#specGrid .selected')].map(e => e.querySelector('input').value);
    document.getElementById('specialtiesHidden').value = selected.join(', ');
}
</script>
<script type="module" src="/src/authGuard.js"></script>
</body>
</html>
