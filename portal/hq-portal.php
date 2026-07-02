<?php
declare(strict_types=1);
if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.cookie_httponly', 1);
    ini_set('session.cookie_samesite', 'Lax');
    $__proto   = strtolower($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? $_SERVER['REQUEST_SCHEME'] ?? '');
    $__isHttps = ($__proto === 'https') || (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
    if ($__isHttps) ini_set('session.cookie_secure', 1);
    unset($__proto, $__isHttps);
    session_start();
}

header('X-Frame-Options: SAMEORIGIN');
header('X-Content-Type-Options: nosniff');
header('X-XSS-Protection: 1; mode=block');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()');
header('Cache-Control: no-store, no-cache, must-revalidate, private');
header('Pragma: no-cache');

define('DATA_DIR',  __DIR__ . '/../data');
define('PORT_FILE', DATA_DIR . '/portfolio.json');
define('REDIRECT_FILE', DATA_DIR . '/social_redirects.json');

if (!is_dir(DATA_DIR)) mkdir(DATA_DIR, 0755, true);
if (!is_dir('uploads'))  mkdir('uploads', 0755, true);

// ── helpers ────────────────────────────────────────────────────────────────
function loadPortfolio() {
    if (!file_exists(PORT_FILE)) return [];
    return json_decode(file_get_contents(PORT_FILE), true) ?: [];
}
function loadRedirects() {
    if (!file_exists(REDIRECT_FILE)) return [];
    return json_decode(file_get_contents(REDIRECT_FILE), true) ?: [];
}
function savePortfolio($data) {
    file_put_contents(PORT_FILE, json_encode(array_values($data),
        JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), LOCK_EX);
}
function saveRedirects($data) {
    file_put_contents(REDIRECT_FILE, json_encode(array_values($data),
        JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), LOCK_EX);
}
function makeSlug($s) {
    return preg_replace('/[^a-z0-9\-]/', '', strtolower(str_replace(' ', '-', trim($s))));
}
function makeRedirectPath($s) {
    $path = '/' . makeSlug(trim($s, '/'));
    return $path === '/' ? '' : $path;
}
function nextItemId($items) {
    if (empty($items)) return 1;
    $ids = array_column($items, 'id');
    return empty($ids) ? 1 : max($ids) + 1;
}
function uploadFile($input, $slug) {
    if (!isset($_FILES[$input]) || $_FILES[$input]['error'] !== UPLOAD_ERR_OK) return null;
    $ext = strtolower(pathinfo($_FILES[$input]['name'], PATHINFO_EXTENSION));
    $ok  = ['jpg','jpeg','png','webp','gif','mp4','webm','mov'];
    if (!in_array($ext, $ok, true)) return null;
    $mime_map = [
        'jpg'  => ['image/jpeg'],
        'jpeg' => ['image/jpeg'],
        'png'  => ['image/png'],
        'webp' => ['image/webp'],
        'gif'  => ['image/gif'],
        'mp4'  => ['video/mp4','video/mpeg'],
        'webm' => ['video/webm'],
        'mov'  => ['video/quicktime','video/mp4'],
    ];
    if (function_exists('finfo_open')) {
        $fi   = finfo_open(FILEINFO_MIME_TYPE);
        $mime = finfo_file($fi, $_FILES[$input]['tmp_name']);
        finfo_close($fi);
        if (!in_array($mime, $mime_map[$ext] ?? [], true)) return null;
    }
    $dest = 'uploads/' . makeSlug($slug) . '-' . time() . '.' . $ext;
    return move_uploaded_file($_FILES[$input]['tmp_name'], $dest) ? '/' . $dest : null;
}
function catBySlug($portfolio, $slug) {
    foreach ($portfolio as $i => $cat) { if ($cat['slug'] === $slug) return [$i, $cat]; }
    return [null, null];
}
function hq_csrf_token(): string {
    if (empty($_SESSION['hq_csrf'])) {
        $_SESSION['hq_csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['hq_csrf'];
}
function hq_csrf_field(): string {
    return '<input type="hidden" name="hq_csrf" value="' . htmlspecialchars(hq_csrf_token()) . '">';
}
function hq_csrf_check(): void {
    $token = $_POST['hq_csrf'] ?? '';
    if (!hash_equals(hq_csrf_token(), $token)) {
        http_response_code(403);
        exit('Invalid security token. Please reload the page and try again.');
    }
}

// ── credentials (loaded from data/config.json) ──────────────────────────────
$_hq_cfg    = is_file(DATA_DIR . '/config.json')
    ? (json_decode(file_get_contents(DATA_DIR . '/config.json'), true) ?: [])
    : [];
$_hq_user   = $_hq_cfg['hq']['username']      ?? 'ExtoRehan';
$_hq_hash   = $_hq_cfg['hq']['password_hash'] ?? '';

// ── rate limit: max 10 failed attempts per 15 minutes (session-based) ───────
$_hq_fails  = $_SESSION['hq_fails']    ?? 0;
$_hq_locked = $_SESSION['hq_lock_until'] ?? 0;
$_hq_locked_out = ($_hq_locked > time());

if (isset($_POST['login'])) {
    if ($_hq_locked_out) {
        $login_error = "Too many failed attempts. Try again in " . ceil(($_hq_locked - time()) / 60) . " minute(s).";
    } elseif (
        hash_equals($_hq_user, (string)($_POST['username'] ?? '')) &&
        $_hq_hash !== '' &&
        password_verify((string)($_POST['password'] ?? ''), $_hq_hash)
    ) {
        $_SESSION['hake_auth']  = true;
        $_SESSION['hq_fails']   = 0;
        unset($_SESSION['hq_lock_until']);
    } else {
        $_hq_fails++;
        $_SESSION['hq_fails'] = $_hq_fails;
        if ($_hq_fails >= 10) {
            $_SESSION['hq_lock_until'] = time() + 900;
            $login_error = "Too many failed attempts. Try again in 15 minutes.";
        } else {
            $login_error = "Wrong credentials.";
        }
    }
}
if (isset($_GET['logout'])) { session_destroy(); header("Location: /hq-portal"); exit(); }

// ── login gate ─────────────────────────────────────────────────────────────
if (!isset($_SESSION['hake_auth'])): ?>
<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>HQ Vault</title><link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png"><link rel="preload" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.44.0/dist/fonts/tabler-icons.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.44.0/dist/tabler-icons.min.css"><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',sans-serif;background:#00040d;color:#fff;min-height:100vh;display:flex;align-items:center;justify-content:center;background-image:radial-gradient(ellipse at 20% 50%,rgba(0,210,255,.06) 0,transparent 55%),radial-gradient(ellipse at 80% 50%,rgba(157,80,187,.06) 0,transparent 55%)}.card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:36px;padding:50px 44px;width:100%;max-width:400px;text-align:center;backdrop-filter:blur(30px);box-shadow:0 40px 80px rgba(0,0,0,.6)}.logo-svg{width:52px;height:52px;margin:0 auto 20px;display:flex;align-items:center;justify-content:center}h2{font-size:.95rem;letter-spacing:4px;color:#00d2ff;text-transform:uppercase;margin-bottom:32px}input{width:100%;padding:15px 20px;margin:7px 0;background:rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.08);color:#fff;border-radius:14px;font-size:.95rem;transition:.3s;text-align:center}input:focus{border-color:#00d2ff;background:#000;outline:none}.btn{width:100%;padding:15px;margin-top:14px;border-radius:14px;border:none;background:linear-gradient(90deg,#00d2ff,#9d50bb);font-weight:900;cursor:pointer;color:#fff;text-transform:uppercase;letter-spacing:2px;font-size:.82rem;transition:.3s}.btn:hover{transform:translateY(-2px);box-shadow:0 12px 30px rgba(0,210,255,.3)}.err{color:#ff4d4d;font-size:.82rem;font-weight:700;margin-bottom:14px;display:block}</style></head><body>
<div class="card">
  <div class="logo-svg"><svg width="52" height="52" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="ExtoArts" role="img"><rect width="36" height="36" rx="9" fill="#0a0a14"/><path d="M10.5 10.5V25.5M10.5 10.5H24M10.5 18H20.5M10.5 25.5H24" stroke="#22d3ee" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
  <h2><i class="ti ti-shield-check"></i> HQ Vault</h2>
  <?php if(isset($login_error)) echo "<span class='err'>".htmlspecialchars($login_error)."</span>"; ?>
  <form method="POST">
    <input type="text"     name="username" placeholder="Operator ID"  required autocomplete="off">
    <input type="password" name="password" placeholder="Passcode"      required>
    <button class="btn" type="submit" name="login"><i class="ti ti-lock-open"></i> Authenticate</button>
  </form>
</div></body></html>
<?php exit(); endif;

// ── AUTHENTICATED: handle all POST / GET actions ───────────────────────────
$portfolio = loadPortfolio();
$redirects = loadRedirects();
$msg       = $_GET['msg'] ?? '';

if (isset($_POST['add_redirect'])) {
    hq_csrf_check();
    $path = makeRedirectPath($_POST['redirect_path'] ?? '');
    $target = trim($_POST['redirect_target'] ?? '');
    $label = trim($_POST['redirect_label'] ?? '') ?: trim($path, '/');
    $reserved = ['/', '/services', '/portfolio', '/pricing', '/workflow', '/blog', '/collab', '/contact', '/about', '/tos', '/toc', '/privacy', '/hq-portal', '/sitemap.xml', '/robots.txt', '/llms.txt'];
    $validTarget = filter_var($target, FILTER_VALIDATE_URL) && preg_match('/^https?:\/\//i', $target);
    if ($path && $validTarget && !in_array($path, $reserved, true) && !str_starts_with($path, '/uploads') && !str_starts_with($path, '/data')) {
        $redirects = array_values(array_filter($redirects, fn($r) => ($r['path'] ?? '') !== $path));
        $redirects[] = [
            'path' => $path,
            'label' => $label,
            'target' => $target,
            'indexed' => true,
            'updated_at' => date('Y-m-d'),
        ];
        usort($redirects, fn($a, $b) => strcmp($a['path'] ?? '', $b['path'] ?? ''));
        saveRedirects($redirects);
        header("Location: /hq-portal?msg=RedirectAdded"); exit();
    }
    header("Location: /hq-portal?msg=RedirectInvalid"); exit();
}

if (isset($_POST['del_redirect'])) {
    hq_csrf_check();
    $path = '/' . trim($_POST['del_redirect'], '/');
    $redirects = array_values(array_filter($redirects, fn($r) => ($r['path'] ?? '') !== $path));
    saveRedirects($redirects);
    header("Location: /hq-portal?msg=RedirectDeleted"); exit();
}

// ── ADD CATEGORY ──
if (isset($_POST['add_cat'])) {
    hq_csrf_check();
    $slug = makeSlug($_POST['c_name']);
    $name = trim($_POST['c_name']);
    if ($name && $slug && !in_array($slug, array_column($portfolio, 'slug'))) {
        $thumb = uploadFile('c_thumb_file', $name) ?? trim($_POST['c_thumb_url'] ?? '');
        $meta  = trim($_POST['c_meta'] ?? '');
        $maxId = empty($portfolio) ? 0 : max(array_column($portfolio, 'id'));
        $portfolio[] = ['id' => $maxId + 1, 'slug' => $slug, 'name' => $name, 'thumb' => $thumb, 'meta' => $meta, 'items' => []];
        savePortfolio($portfolio);
    }
    header("Location: /hq-portal?msg=CategoryAdded"); exit();
}

// ── EDIT CATEGORY META ──
if (isset($_POST['edit_cat'])) {
    hq_csrf_check();
    $slug = $_POST['cat_slug'] ?? '';
    [$idx, $cat] = catBySlug($portfolio, $slug);
    if ($idx !== null) {
        $portfolio[$idx]['name'] = trim($_POST['c_name']) ?: $cat['name'];
        $portfolio[$idx]['meta'] = trim($_POST['c_meta'] ?? $cat['meta']);
        $newThumb = uploadFile('c_thumb_file', $portfolio[$idx]['name']) ?? trim($_POST['c_thumb_url'] ?? '');
        if ($newThumb) $portfolio[$idx]['thumb'] = $newThumb;
        savePortfolio($portfolio);
    }
    header("Location: /hq-portal?cat=$slug&msg=CategoryUpdated"); exit();
}

// ── MASS UPLOAD ITEMS ──
if (isset($_POST['add_items'])) {
    hq_csrf_check();
    $slug = $_POST['cat_slug'] ?? '';
    [$idx, $cat] = catBySlug($portfolio, $slug);
    if ($idx !== null && isset($_FILES['item_files'])) {
        $type   = $_POST['item_type'] ?? 'image';
        $ratio  = $_POST['item_ratio'] ?? '16:9';
        $vurl   = trim($_POST['item_vurl'] ?? '');
        $files  = $_FILES['item_files'];
        $count  = count($files['name']);
        $base   = $portfolio[$idx]['name'];
        $startN = count($portfolio[$idx]['items']) + 1;

        $mime_map = [
            'jpg'  => ['image/jpeg'], 'jpeg' => ['image/jpeg'],
            'png'  => ['image/png'],  'webp' => ['image/webp'],
            'gif'  => ['image/gif'],  'mp4'  => ['video/mp4','video/mpeg'],
            'webm' => ['video/webm'], 'mov'  => ['video/quicktime','video/mp4'],
        ];
        for ($i = 0; $i < $count; $i++) {
            if ($files['error'][$i] !== UPLOAD_ERR_OK) continue;
            $ext = strtolower(pathinfo($files['name'][$i], PATHINFO_EXTENSION));
            $ok  = ['jpg','jpeg','png','webp','gif','mp4','webm','mov'];
            if (!in_array($ext, $ok, true)) continue;
            if (function_exists('finfo_open')) {
                $fi   = finfo_open(FILEINFO_MIME_TYPE);
                $mime = finfo_file($fi, $files['tmp_name'][$i]);
                finfo_close($fi);
                if (!in_array($mime, $mime_map[$ext] ?? [], true)) continue;
            }
            $dest = 'uploads/' . makeSlug($base) . '-item-' . time() . '-' . $i . '.' . $ext;
            if (!move_uploaded_file($files['tmp_name'][$i], $dest)) continue;
            $path = '/' . $dest;
            $isVid = in_array($ext, ['mp4','webm','mov']);
            $portfolio[$idx]['items'][] = [
                'id'           => nextItemId($portfolio[$idx]['items']),
                'title'        => $base . ' #' . ($startN + $i),
                'project_type' => $isVid ? 'video' : $type,
                'thumbnail_url'=> $isVid ? ($vurl ?: $path) : $path,
                'video_url'    => $isVid ? $path : $vurl,
                'ratio'        => $ratio,
            ];
        }
        savePortfolio($portfolio);
    }
    header("Location: /hq-portal?cat=$slug&msg=ItemsAdded"); exit();
}

// ── DELETE ITEM ──
if (isset($_POST['del_item'])) {
    hq_csrf_check();
    $slug = $_POST['del_item'];
    $iid  = (int)($_POST['iid'] ?? 0);
    [$idx, $cat] = catBySlug($portfolio, $slug);
    if ($idx !== null) {
        $portfolio[$idx]['items'] = array_values(
            array_filter($portfolio[$idx]['items'], fn($it) => (int)$it['id'] !== $iid)
        );
        savePortfolio($portfolio);
    }
    header("Location: /hq-portal?cat=$slug&msg=ItemDeleted"); exit();
}

// ── DELETE CATEGORY ──
if (isset($_POST['del_cat'])) {
    hq_csrf_check();
    $slug = $_POST['del_cat'];
    $portfolio = array_values(array_filter($portfolio, fn($c) => $c['slug'] !== $slug));
    savePortfolio($portfolio);
    header("Location: /hq-portal?msg=CategoryDeleted"); exit();
}

// ── DECIDE VIEW ──
$catSlug   = $_GET['cat'] ?? null;
$view      = $catSlug ? 'category' : 'overview';
$activeCat = null;
if ($catSlug) {
    [,$activeCat] = catBySlug($portfolio, $catSlug);
    if (!$activeCat) { header("Location: /hq-portal"); exit(); }
}

$totalItems = array_sum(array_map(fn($c) => count($c['items']), $portfolio));
$totalFiles = count(glob('uploads/*.*') ?: []);
$totalRedirects = count($redirects);
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>HQ Vault | ExtoArts</title>
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="preload" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.44.0/dist/fonts/tabler-icons.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.44.0/dist/tabler-icons.min.css">
<style>
:root{--bg:#00040d;--surface:rgba(255,255,255,.03);--border:rgba(255,255,255,.08);--primary:#00d2ff;--purple:#9d50bb;--red:#ff4d4d;--text:#fff;--muted:#666}
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html{scroll-behavior:smooth}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:var(--bg)}::-webkit-scrollbar-thumb{background:linear-gradient(var(--primary),var(--purple));border-radius:10px}
body{font-family:'Segoe UI',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;overflow-x:hidden}

/* NAV */
nav{background:rgba(0,5,15,.92);border-bottom:1px solid var(--border);padding:13px 5%;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:200;backdrop-filter:blur(25px)}
.nav-logo{display:flex;align-items:center;gap:10px;font-weight:900;font-size:.95rem}
.nav-logo svg{width:28px;height:28px;flex-shrink:0;}
.logout{color:var(--red);text-decoration:none;font-weight:800;font-size:.68rem;border:1px solid var(--red);padding:7px 16px;border-radius:50px;text-transform:uppercase;transition:.3s}
.logout:hover{background:rgba(255,77,77,.12);box-shadow:0 0 15px rgba(255,77,77,.3)}

/* TOAST */
.toast{position:fixed;top:76px;left:50%;transform:translateX(-50%) translateY(-12px);background:linear-gradient(90deg,var(--primary),var(--purple));color:#000;font-weight:900;padding:11px 28px;border-radius:50px;font-size:.78rem;letter-spacing:1.5px;text-transform:uppercase;z-index:9999;opacity:0;transition:.4s;pointer-events:none}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0)}

/* WRAP */
.wrap{max-width:1200px;margin:0 auto;padding:28px 18px 120px}

/* STATS */
.stats{display:flex;gap:12px;margin-bottom:30px;flex-wrap:wrap}
.stat{background:rgba(0,210,255,.05);border:1px solid rgba(0,210,255,.15);border-radius:18px;padding:14px 22px;flex:1;min-width:110px;text-align:center}
.stat .n{font-size:1.7rem;font-weight:900;color:var(--primary);line-height:1}
.stat .l{font-size:.6rem;color:var(--muted);text-transform:uppercase;letter-spacing:2px;font-weight:800;margin-top:4px}

/* BREADCRUMB */
.breadcrumb{display:flex;align-items:center;gap:10px;margin-bottom:28px;font-size:.78rem;font-weight:800;text-transform:uppercase;letter-spacing:1px}
.breadcrumb a{color:var(--primary);text-decoration:none;transition:.2s}
.breadcrumb a:hover{opacity:.7}
.breadcrumb .sep{color:var(--muted)}
.breadcrumb .cur{color:var(--text)}

/* SECTION HEADER */
.sec-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:22px;gap:12px;flex-wrap:wrap}
.sec-title{font-size:.82rem;font-weight:900;text-transform:uppercase;letter-spacing:3px;color:var(--primary)}
.btn-new{background:var(--primary);color:#000;border:none;padding:10px 22px;border-radius:50px;font-weight:900;font-size:.72rem;text-transform:uppercase;letter-spacing:1.5px;cursor:pointer;transition:.3s;white-space:nowrap}
.btn-new:hover{box-shadow:0 0 25px rgba(0,210,255,.5);transform:translateY(-2px)}
.btn-red{background:rgba(255,77,77,.12);color:var(--red);border:1px solid rgba(255,77,77,.3);padding:10px 22px;border-radius:50px;font-weight:900;font-size:.72rem;text-transform:uppercase;letter-spacing:1.5px;cursor:pointer;transition:.3s;text-decoration:none;white-space:nowrap}
.btn-red:hover{background:rgba(255,77,77,.22);box-shadow:0 0 15px rgba(255,77,77,.25)}

/* CATEGORY GRID */
.cat-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:20px}
@media(max-width:600px){.cat-grid{grid-template-columns:1fr 1fr;gap:12px}}

.cat-card{background:var(--surface);border:1px solid var(--border);border-radius:28px;overflow:hidden;position:relative;transition:.4s;cursor:pointer}
.cat-card:hover{border-color:var(--primary);transform:translateY(-6px);box-shadow:0 20px 50px rgba(0,0,0,.5)}
.cat-cover{width:100%;aspect-ratio:16/9;object-fit:cover;display:block;opacity:.85;transition:.5s}
.cat-card:hover .cat-cover{opacity:1;transform:scale(1.04)}
.cat-cover-wrap{overflow:hidden;aspect-ratio:16/9;background:#000}
.cat-body{padding:18px}
.cat-name{font-weight:900;font-size:.95rem;margin-bottom:4px}
.cat-meta{font-size:.65rem;color:var(--primary);text-transform:uppercase;letter-spacing:1.5px;font-weight:800}
.cat-actions{display:flex;align-items:center;gap:8px;margin-top:14px}
.cat-btn{flex:1;padding:8px 12px;border-radius:12px;font-size:.68rem;font-weight:900;text-transform:uppercase;letter-spacing:1px;border:none;cursor:pointer;transition:.3s;text-align:center;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;gap:5px}
.cat-btn-open{background:var(--primary);color:#000}
.cat-btn-open:hover{box-shadow:0 0 20px rgba(0,210,255,.4)}
.cat-btn-del{background:rgba(255,77,77,.1);color:var(--red);border:1px solid rgba(255,77,77,.25)}
.cat-btn-del:hover{background:rgba(255,77,77,.2)}
.cat-count{position:absolute;top:10px;right:10px;background:rgba(0,0,0,.75);backdrop-filter:blur(8px);color:var(--primary);font-size:.6rem;font-weight:900;letter-spacing:1.5px;text-transform:uppercase;padding:4px 10px;border-radius:50px;border:1px solid rgba(0,210,255,.2)}

/* ADD CATEGORY PANEL */
.panel-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:500;backdrop-filter:blur(8px)}
.panel-overlay.open{display:flex;align-items:flex-end;justify-content:center}
@media(min-width:600px){.panel-overlay.open{align-items:center}}
.panel{background:#020c1a;border:1px solid var(--border);border-radius:32px 32px 0 0;width:100%;max-width:560px;padding:36px 30px 50px;animation:slideUp .3s ease-out}
@media(min-width:600px){.panel{border-radius:32px;padding:40px}}
@keyframes slideUp{from{transform:translateY(40px);opacity:0}to{transform:translateY(0);opacity:1}}
.panel-title{font-size:.82rem;font-weight:900;color:var(--primary);text-transform:uppercase;letter-spacing:3px;margin-bottom:24px}
.field{margin-bottom:14px}
.field label{display:block;font-size:.6rem;color:var(--muted);text-transform:uppercase;letter-spacing:2px;font-weight:900;margin-bottom:6px}
.field input,.field select,.field textarea{width:100%;padding:14px 16px;background:rgba(0,0,0,.6);border:1px solid var(--border);color:var(--text);border-radius:14px;font-size:.9rem;transition:.3s}
.field input:focus,.field select:focus,.field textarea:focus{border-color:var(--primary);background:rgba(0,0,0,.8);outline:none}
.field input[type=file]{padding:11px;background:rgba(0,210,255,.04);cursor:pointer}
.field input[type=file]::-webkit-file-upload-button{background:var(--primary);border:none;padding:7px 14px;border-radius:8px;color:#000;font-weight:800;cursor:pointer;margin-right:12px}
.field select option{background:#040d1a}
.field-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.submit-btn{width:100%;padding:16px;border:none;border-radius:16px;background:var(--primary);color:#000;font-weight:900;font-size:.82rem;text-transform:uppercase;letter-spacing:2px;cursor:pointer;margin-top:8px;transition:.3s}
.submit-btn:hover{box-shadow:0 0 30px rgba(0,210,255,.5);transform:translateY(-2px)}
.cancel-btn{width:100%;padding:14px;border:1px solid var(--border);border-radius:16px;background:none;color:var(--muted);font-weight:700;font-size:.8rem;cursor:pointer;margin-top:8px;transition:.3s}
.cancel-btn:hover{border-color:var(--primary);color:var(--text)}

/* UPLOAD AREA */
.upload-box{background:rgba(0,210,255,.04);border:2px dashed rgba(0,210,255,.25);border-radius:20px;padding:28px;text-align:center;transition:.3s;cursor:pointer;position:relative}
.upload-box:hover,.upload-box.drag{border-color:var(--primary);background:rgba(0,210,255,.08)}
.upload-box input[type=file]{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%}
.upload-box i{font-size:2rem;color:var(--primary);margin-bottom:10px;display:block}
.upload-box p{font-size:.82rem;color:var(--muted);font-weight:700}
.upload-box strong{color:var(--text)}
.file-list{margin-top:12px;text-align:left}
.file-list p{font-size:.72rem;color:var(--primary);font-weight:800;padding:4px 0;border-bottom:1px solid var(--border)}

/* ITEMS GRID (inside a category) */
.item-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px}
@media(max-width:600px){.item-grid{grid-template-columns:1fr 1fr;gap:10px}}

.item-thumb{background:var(--surface);border:1px solid var(--border);border-radius:20px;overflow:hidden;position:relative;transition:.35s}
.item-thumb:hover{border-color:var(--primary)}
.item-thumb-img{width:100%;aspect-ratio:16/9;object-fit:cover;display:block;transition:.4s}
.item-thumb[data-ratio="9:16"] .item-thumb-img{aspect-ratio:9/16}
.item-thumb[data-ratio="1:1"] .item-thumb-img{aspect-ratio:1/1}
.item-thumb:hover .item-thumb-img{transform:scale(1.04)}
.item-info{padding:10px 12px}
.item-title{font-size:.75rem;font-weight:800;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.item-badge{font-size:.58rem;color:var(--primary);text-transform:uppercase;letter-spacing:1px;font-weight:800;margin-top:3px}
.item-del{position:absolute;top:8px;right:8px;background:rgba(0,0,0,.7);color:var(--red);border:none;border-radius:50%;width:30px;height:30px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:.85rem;transition:.3s;text-decoration:none;opacity:0}
.item-thumb:hover .item-del{opacity:1}
.item-del:hover{background:var(--red);color:#fff;transform:scale(1.1)}
.item-vid-badge{position:absolute;bottom:50px;left:10px;background:rgba(0,0,0,.7);color:var(--primary);font-size:.58rem;font-weight:900;padding:3px 8px;border-radius:6px;text-transform:uppercase;letter-spacing:1px}

/* LOADER OVERLAY */
#loader{display:none;position:fixed;inset:0;background:rgba(0,0,0,.95);z-index:9999;flex-direction:column;align-items:center;justify-content:center;backdrop-filter:blur(10px)}
.spinner{width:52px;height:52px;border:4px solid rgba(0,210,255,.2);border-top-color:var(--primary);border-radius:50%;animation:spin .8s linear infinite;box-shadow:0 0 20px rgba(0,210,255,.3);margin-bottom:18px}
@keyframes spin{100%{transform:rotate(360deg)}}

/* UPLOAD SECTION */
.upload-section{background:var(--surface);border:1px solid var(--border);border-radius:28px;padding:28px;margin-bottom:28px}
.upload-section h3{font-size:.78rem;font-weight:900;text-transform:uppercase;letter-spacing:3px;color:var(--primary);margin-bottom:20px}

/* EMPTY STATE */
.empty{text-align:center;padding:60px 20px;color:var(--muted)}
.empty i{font-size:2.5rem;display:block;margin-bottom:14px;opacity:.4}
.empty p{font-size:.9rem}
.redirect-card{background:var(--surface);border:1px solid var(--border);border-radius:28px;padding:24px;margin-bottom:30px}
.redirect-grid{display:grid;grid-template-columns:1fr 1.6fr auto;gap:10px;align-items:end}
@media(max-width:800px){.redirect-grid{grid-template-columns:1fr}.redirect-row{grid-template-columns:1fr!important}}
.redirect-list{display:grid;gap:10px;margin-top:18px}
.redirect-row{display:grid;grid-template-columns:1fr 1.6fr auto;gap:10px;align-items:center;background:rgba(0,0,0,.28);border:1px solid var(--border);border-radius:16px;padding:12px 14px}
.redirect-path{color:var(--primary);font-weight:900;font-size:.82rem}
.redirect-target{color:var(--muted);font-size:.76rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.redirect-note{color:var(--muted);font-size:.72rem;line-height:1.5;margin-top:10px}
</style>
</head>
<body>

<div id="loader">
  <div class="spinner"></div>
  <p style="color:var(--primary);font-weight:900;letter-spacing:3px;text-transform:uppercase;font-size:.85rem;">Uploading...</p>
  <p style="color:var(--muted);margin-top:8px;font-size:.8rem;">Do not close this page.</p>
</div>

<?php if ($msg): ?>
<div class="toast show" id="toast">✓ <?php echo htmlspecialchars(str_replace(['Added','Deleted','Updated'], ['Added ✓','Deleted ✓','Updated ✓'], $msg)); ?></div>
<?php endif; ?>

<nav>
  <div class="nav-logo">
    <svg width="28" height="28" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="36" height="36" rx="9" fill="#0a0a14"/><path d="M10.5 10.5V25.5M10.5 10.5H24M10.5 18H20.5M10.5 25.5H24" stroke="#22d3ee" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    HQ Vault
  </div>
  <a href="?logout=1" class="logout"><i class="ti ti-power"></i> Exit</a>
</nav>

<div class="wrap">

  <!-- STATS -->
  <div class="stats">
    <div class="stat"><div class="n"><?php echo count($portfolio); ?></div><div class="l">Categories</div></div>
    <div class="stat"><div class="n"><?php echo $totalItems; ?></div><div class="l">Items</div></div>
    <div class="stat"><div class="n"><?php echo $totalFiles; ?></div><div class="l">Files</div></div>
    <div class="stat"><div class="n"><?php echo $totalRedirects; ?></div><div class="l">Redirects</div></div>
  </div>

  <?php if ($view === 'overview'): ?>

  <!-- ═══════════════════════════════════════
       OVERVIEW - ALL CATEGORIES
  ══════════════════════════════════════════ -->
  <div class="sec-header">
    <span class="sec-title"><i class="ti ti-route"></i> Search Redirects</span>
  </div>
  <div class="redirect-card">
    <form method="POST" class="redirect-grid">
      <?php echo hq_csrf_field(); ?>
      <div class="field" style="margin-bottom:0">
        <label>Shortcut Path</label>
        <input type="text" name="redirect_path" placeholder="discord, facebook, booking" required>
      </div>
      <div class="field" style="margin-bottom:0">
        <label>Target URL</label>
        <input type="url" name="redirect_target" placeholder="https://..." required>
      </div>
      <div class="field" style="margin-bottom:0">
        <label>Label</label>
        <input type="text" name="redirect_label" placeholder="Optional name">
      </div>
      <button type="submit" name="add_redirect" class="submit-btn" style="grid-column:1/-1;margin-top:4px"><i class="ti ti-plus"></i> Add / Update Redirect</button>
    </form>
    <p class="redirect-note">These URLs are added to the sitemap for discovery, but each shortcut only redirects. It never becomes a public page.</p>
    <?php if (empty($redirects)): ?>
      <div class="empty" style="padding:30px 20px"><i class="ti ti-route"></i><p>No redirects yet.</p></div>
    <?php else: ?>
      <div class="redirect-list">
      <?php foreach ($redirects as $redirect): ?>
        <div class="redirect-row">
          <div>
            <div class="redirect-path"><?php echo htmlspecialchars($redirect['path'] ?? ''); ?></div>
            <div class="redirect-target"><?php echo htmlspecialchars($redirect['label'] ?? 'Indexed redirect'); ?> · Sitemap indexed</div>
          </div>
          <div class="redirect-target"><?php echo htmlspecialchars($redirect['target'] ?? ''); ?></div>
          <form method="POST" style="display:inline" onsubmit="return confirm('Delete redirect <?php echo addslashes($redirect['path'] ?? ''); ?>?')">
            <?php echo hq_csrf_field(); ?>
            <input type="hidden" name="del_redirect" value="<?php echo urlencode(trim($redirect['path'] ?? '', '/')); ?>">
            <button type="submit" class="cat-btn cat-btn-del"><i class="ti ti-trash"></i></button>
          </form>
        </div>
      <?php endforeach; ?>
      </div>
    <?php endif; ?>
  </div>

  <div class="sec-header">
    <span class="sec-title"><i class="ti ti-stack"></i> Portfolio Categories</span>
    <button class="btn-new" onclick="openPanel()"><i class="ti ti-plus"></i> New Category</button>
  </div>

  <?php if (empty($portfolio)): ?>
    <div class="empty"><i class="ti ti-inbox"></i><p>No categories yet. Click "New Category" to add one.</p></div>
  <?php else: ?>
  <div class="cat-grid">
    <?php foreach ($portfolio as $cat): ?>
    <div class="cat-card">
      <div class="cat-cover-wrap">
        <?php if (!empty($cat['thumb'])): ?>
        <img class="cat-cover" src="<?php echo htmlspecialchars($cat['thumb']); ?>" alt="<?php echo htmlspecialchars($cat['name']); ?>" loading="lazy" onerror="this.parentElement.innerHTML='<div style=\'background:#020c1a;width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#555;\'>No Image</div>'">
        <?php else: ?>
        <div style="background:#020c1a;width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#555;font-size:.75rem;">No Cover</div>
        <?php endif; ?>
      </div>
      <span class="cat-count"><?php echo count($cat['items']); ?> items</span>
      <div class="cat-body">
        <div class="cat-name"><?php echo htmlspecialchars($cat['name']); ?></div>
        <div class="cat-meta"><?php echo htmlspecialchars($cat['meta'] ?? ''); ?></div>
        <div class="cat-actions">
          <a href="?cat=<?php echo urlencode($cat['slug']); ?>" class="cat-btn cat-btn-open"><i class="ti ti-folder-open"></i> Manage</a>
          <form method="POST" style="display:inline" onsubmit="return confirm('Delete entire category \'<?php echo addslashes($cat['name']); ?>\'? This cannot be undone.')">
            <?php echo hq_csrf_field(); ?>
            <input type="hidden" name="del_cat" value="<?php echo htmlspecialchars($cat['slug']); ?>">
            <button type="submit" class="cat-btn cat-btn-del"><i class="ti ti-trash"></i></button>
          </form>
        </div>
      </div>
    </div>
    <?php endforeach; ?>
  </div>
  <?php endif; ?>

  <?php elseif ($view === 'category'): ?>

  <!-- ═══════════════════════════════════════
       CATEGORY DETAIL VIEW
  ══════════════════════════════════════════ -->
  <div class="breadcrumb">
    <a href="/hq-portal"><i class="ti ti-home"></i> Overview</a>
    <span class="sep">/</span>
    <span class="cur"><?php echo htmlspecialchars($activeCat['name']); ?></span>
  </div>

  <div class="sec-header">
    <span class="sec-title"><i class="ti ti-photo"></i> <?php echo htmlspecialchars($activeCat['name']); ?> <span style="color:var(--muted);font-weight:700">(<?php echo count($activeCat['items']); ?> items)</span></span>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn-new" onclick="openPanel('edit')"><i class="ti ti-pencil"></i> Edit Category</button>
      <form method="POST" style="display:inline" onsubmit="return confirm('Delete entire category? Cannot be undone.')">
        <?php echo hq_csrf_field(); ?>
        <input type="hidden" name="del_cat" value="<?php echo htmlspecialchars($catSlug); ?>">
        <button type="submit" class="btn-red"><i class="ti ti-trash"></i> Delete Category</button>
      </form>
    </div>
  </div>

  <!-- MASS UPLOAD FORM -->
  <div class="upload-section">
    <h3><i class="ti ti-cloud-upload"></i> Add Items to This Category</h3>
    <form method="POST" enctype="multipart/form-data" onsubmit="document.getElementById('loader').style.display='flex'">
      <?php echo hq_csrf_field(); ?>
      <input type="hidden" name="cat_slug" value="<?php echo htmlspecialchars($catSlug); ?>">
      <div class="field-row" style="margin-bottom:12px">
        <div class="field">
          <label>Type</label>
          <select name="item_type">
            <option value="image">Image / Thumbnail</option>
            <option value="video">Video (with thumbnail)</option>
          </select>
        </div>
        <div class="field">
          <label>Ratio</label>
          <select name="item_ratio">
            <option value="16:9">16:9 - YouTube</option>
            <option value="9:16">9:16 - Shorts</option>
            <option value="1:1">1:1 - Square</option>
          </select>
        </div>
      </div>
      <div class="field">
        <label>Video URL (optional, for video type)</label>
        <input type="text" name="item_vurl" placeholder="Paste video link or leave blank">
      </div>
      <div class="upload-box" id="dropZone">
        <input type="file" name="item_files[]" multiple accept="image/*,video/mp4,video/webm" id="fileInput" onchange="showFiles(this)">
        <i class="ti ti-cloud-upload"></i>
        <p><strong>Click to choose files</strong> or drag & drop here</p>
        <p style="margin-top:6px;font-size:.7rem">Images & videos supported · Select multiple at once</p>
        <div class="file-list" id="fileList"></div>
      </div>
      <button type="submit" name="add_items" class="submit-btn" style="margin-top:16px"><i class="ti ti-rocket"></i> Upload All Files</button>
    </form>
  </div>

  <!-- ITEMS GRID -->
  <?php if (empty($activeCat['items'])): ?>
    <div class="empty"><i class="ti ti-photo-video"></i><p>No items yet. Upload some above.</p></div>
  <?php else: ?>
  <div class="sec-header" style="margin-top:10px">
    <span class="sec-title"><i class="ti ti-layout-grid"></i> All Items</span>
  </div>
  <div class="item-grid">
    <?php foreach ($activeCat['items'] as $item): ?>
    <div class="item-thumb" data-ratio="<?php echo htmlspecialchars($item['ratio']??'16:9'); ?>">
      <img class="item-thumb-img" src="<?php echo htmlspecialchars($item['thumbnail_url']??$item['video_url']??''); ?>" alt="<?php echo htmlspecialchars($item['title']??''); ?>" loading="lazy" onerror="this.src='data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'113\' fill=\'%23111\'><rect width=\'200\' height=\'113\' fill=\'%23111\'/></svg>'">
      <?php if(($item['project_type']??'image')==='video'): ?><span class="item-vid-badge"><i class="ti ti-player-play-filled"></i> Video</span><?php endif; ?>
      <form method="POST" style="display:contents" onsubmit="return confirm('Delete this item?')">
        <?php echo hq_csrf_field(); ?>
        <input type="hidden" name="del_item" value="<?php echo htmlspecialchars($catSlug); ?>">
        <input type="hidden" name="iid" value="<?php echo (int)$item['id']; ?>">
        <button type="submit" class="item-del"><i class="ti ti-x"></i></button>
      </form>
      <div class="item-info">
        <div class="item-title"><?php echo htmlspecialchars($item['title']??''); ?></div>
        <div class="item-badge"><?php echo htmlspecialchars(($item['project_type']??'image').' · '.($item['ratio']??'16:9')); ?></div>
      </div>
    </div>
    <?php endforeach; ?>
  </div>
  <?php endif; ?>

  <?php endif; ?>
</div>

<!-- ═══════════════════════════════════════
     ADD / EDIT CATEGORY PANEL
══════════════════════════════════════════ -->
<div class="panel-overlay" id="panelOverlay" onclick="if(event.target===this)closePanel()">
  <div class="panel">
    <div class="panel-title" id="panelTitle"><i class="ti ti-folder-plus"></i> New Category</div>
    <form method="POST" enctype="multipart/form-data" id="catForm" onsubmit="document.getElementById('loader').style.display='flex'">
      <?php echo hq_csrf_field(); ?>
      <input type="hidden" name="cat_slug" id="panelSlugInput" value="<?php echo htmlspecialchars($catSlug ?? ''); ?>">
      <div class="field">
        <label>Category Name *</label>
        <input type="text" name="c_name" id="panelName" placeholder="e.g. Free Fire Thumbnails" required value="<?php echo $activeCat ? htmlspecialchars($activeCat['name']) : ''; ?>">
      </div>
      <div class="field">
        <label>Short Description / Meta</label>
        <input type="text" name="c_meta" id="panelMeta" placeholder="e.g. 5 CTR-focused designs" value="<?php echo $activeCat ? htmlspecialchars($activeCat['meta']??'') : ''; ?>">
      </div>
      <div class="field">
        <label>Cover Image - Upload</label>
        <div class="upload-box" style="padding:16px">
          <input type="file" name="c_thumb_file" accept="image/*">
          <i class="ti ti-photo" style="font-size:1.3rem;margin-bottom:6px"></i>
          <p style="font-size:.75rem">Click to choose cover photo</p>
        </div>
      </div>
      <div class="field">
        <label>OR Cover Image URL</label>
        <input type="text" name="c_thumb_url" placeholder="https://..." value="<?php echo $activeCat ? htmlspecialchars($activeCat['thumb']??'') : ''; ?>">
      </div>
      <button type="submit" name="add_cat" id="panelSubmit" class="submit-btn"><i class="ti ti-plus"></i> Create Category</button>
      <button type="button" class="cancel-btn" onclick="closePanel()">Cancel</button>
    </form>
  </div>
</div>

<script>
// Toast auto-hide
const toast = document.getElementById('toast');
if (toast) setTimeout(() => { toast.classList.remove('show'); }, 4000);

// Panel
function openPanel(mode) {
    const overlay = document.getElementById('panelOverlay');
    overlay.classList.add('open');
    if (mode === 'edit') {
        document.getElementById('panelTitle').innerHTML = '<i class="ti ti-pencil"></i> Edit Category';
        document.getElementById('panelSubmit').name = 'edit_cat';
        document.getElementById('panelSubmit').innerHTML = '<i class="ti ti-device-floppy"></i> Save Changes';
    } else {
        document.getElementById('panelTitle').innerHTML = '<i class="ti ti-folder-plus"></i> New Category';
        document.getElementById('panelSubmit').name = 'add_cat';
        document.getElementById('panelSubmit').innerHTML = '<i class="ti ti-plus"></i> Create Category';
        document.getElementById('panelName').value = '';
        document.getElementById('panelMeta').value = '';
    }
}
function closePanel() { document.getElementById('panelOverlay').classList.remove('open'); }
document.addEventListener('keydown', e => { if (e.key === 'Escape') closePanel(); });

// File picker display
function showFiles(input) {
    const list = document.getElementById('fileList');
    if (!list) return;
    list.innerHTML = '';
    const files = Array.from(input.files);
    if (files.length === 0) return;
    files.forEach(f => { list.innerHTML += `<p><i class="ti ti-circle-check" style="color:var(--primary);margin-right:6px"></i>${f.name} (${(f.size/1024/1024).toFixed(1)} MB)</p>`; });
}

// Drag & drop highlight
const dz = document.getElementById('dropZone');
if (dz) {
    dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('drag'); });
    dz.addEventListener('dragleave', () => dz.classList.remove('drag'));
    dz.addEventListener('drop', e => {
        e.preventDefault(); dz.classList.remove('drag');
        const fi = document.getElementById('fileInput');
        const dt = new DataTransfer();
        Array.from(e.dataTransfer.files).forEach(f => dt.items.add(f));
        fi.files = dt.files;
        showFiles(fi);
    });
}
</script>
<script type="module" src="/src/authGuard.js"></script>
</body>
</html>
