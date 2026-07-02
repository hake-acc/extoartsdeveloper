<?php
declare(strict_types=1);
if (session_status() === PHP_SESSION_NONE) session_start();
error_reporting(E_ALL); ini_set('display_errors', 0);
define('DATA_DIR', __DIR__ . '/data');

function _pf_loadJson($file) {
    if (!file_exists($file)) return [];
    return json_decode(file_get_contents($file), true) ?: [];
}

if(isset($_GET['get_subs'])) {
    header('Content-Type: application/json');
    $subs = _pf_loadJson(DATA_DIR . '/subcategories.json');
    $cid  = (int)$_GET['get_subs'];
    $data = array_values(array_filter($subs, fn($s) => (int)$s['category_id'] === $cid));
    echo json_encode($data); exit;
}

if(isset($_GET['get_works'])) {
    header('Content-Type: application/json');
    $works = _pf_loadJson(DATA_DIR . '/works.json');
    $sid   = (int)$_GET['get_works'];
    $data  = array_values(array_filter($works, fn($w) => (int)$w['sub_id'] === $sid));
    usort($data, fn($a,$b) => ($b['id']??0) <=> ($a['id']??0));
    echo json_encode($data); exit;
}

// Load portfolio from JSON
$_pfRaw = _pf_loadJson(__DIR__ . '/../data/portfolio.json');
$localPortfolio = [];
foreach ($_pfRaw as $_cat) {
    $localPortfolio[$_cat['slug']] = [
        'name'  => $_cat['name'],
        'thumb' => $_cat['thumb'] ?? '',
        'meta'  => $_cat['meta'] ?? '',
        'items' => $_cat['items'] ?? [],
    ];
}

// Representative performance metrics per category (earned, not decorative)
$catMetrics = [
    'free-fire'               => ['stat' => 'CTR +61%',        'icon' => 'ti-trending-up'],
    'minecraft'               => ['stat' => '2.1M Views/mo',   'icon' => 'ti-eye'],
    'roblox'                  => ['stat' => 'CTR +55%',        'icon' => 'ti-trending-up'],
    'pubg'                    => ['stat' => 'CTR +38%',        'icon' => 'ti-trending-up'],
    'realistic'               => ['stat' => '+52% Retention',  'icon' => 'ti-clock'],
    'video-edits'             => ['stat' => '+44% Watch Time', 'icon' => 'ti-player-play-filled'],
    'motion-ads'              => ['stat' => '3.8x Engagement', 'icon' => 'ti-bolt'],
];

$page_title = "YouTube Editing Portfolio - Thumbnails & Video Edits | ExtoArts";
$page_desc = "Browse the ExtoArts portfolio - gaming thumbnails, YouTube video edits, TikTok short-form content, motion graphics, and more. Real work from real editors.";
$breadcrumbs = [['name' => 'Portfolio', 'url' => '/portfolio']];
include __DIR__ . '/../templates/header.php'; 
?>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://extoarts.in/" },
    { "@type": "ListItem", "position": 2, "name": "Portfolio", "item": "https://extoarts.in/portfolio" }
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://extoarts.in/portfolio",
  "url": "https://extoarts.in/portfolio",
  "name": "Portfolio | ExtoArts, Gaming Thumbnails, Video Edits & More",
  "description": "Browse the ExtoArts portfolio, gaming thumbnails, YouTube video edits, TikTok short-form content, motion graphics, and more. Real work from real editors.",
  "inLanguage": "en-US",
  "datePublished": "2024-01-01",
  "dateModified": "2026-06-17",
  "about": {"@id": "https://extoarts.in/#organization"},
  "publisher": { "@id": "https://extoarts.in/#organization" },
  "isPartOf": { "@id": "https://extoarts.in/#website" }
}
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://extoarts.in/portfolio#collection",
  "name": "ExtoArts Portfolio - YouTube Editing & Thumbnail Design",
  "description": "Browse real work from ExtoArts specialist editors - gaming thumbnails, YouTube video edits, TikTok short-form content, motion graphics, and more.",
  "url": "https://extoarts.in/portfolio",
  "inLanguage": "en-US",
  "publisher": { "@id": "https://extoarts.in/#organization" },
  "about": { "@id": "https://extoarts.in/#organization" },
  "hasPart": [
    { "@type": "ImageGallery", "name": "Free Fire Video Edits & Thumbnails", "description": "Free Fire gaming video edits and thumbnail designs from ExtoArts specialist editors." },
    { "@type": "ImageGallery", "name": "Minecraft Video Edits & Thumbnails", "description": "Minecraft gaming video edits and YouTube thumbnails from ExtoArts." },
    { "@type": "ImageGallery", "name": "Roblox Video Edits & Thumbnails", "description": "Roblox channel video edits and thumbnail designs from ExtoArts specialist gaming editors." },
    { "@type": "ImageGallery", "name": "PUBG Video Edits & Thumbnails", "description": "PUBG gaming video edits and thumbnail designs." },
    { "@type": "ImageGallery", "name": "Video Edits Portfolio", "description": "YouTube long-form and short-form video edits from ExtoArts editors." },
    { "@type": "ImageGallery", "name": "Motion Graphics Portfolio", "description": "Custom motion graphics, VFX, and After Effects work by ExtoArts." },
    { "@type": "ImageGallery", "name": "Ads & Creative Portfolio", "description": "Ad creatives and promotional content by ExtoArts designers." }
  ]
}
</script>

<style>
    .container { max-width: 1180px; margin: 120px auto 100px; padding: 0 18px; position: relative; z-index: 10; }
    .header-box { text-align: center; margin-bottom: 40px; }
    .header-box h1 { font-size: clamp(2.5rem, 8vw, 4rem); font-weight: 900; line-height: 1.1; margin-bottom: 10px; letter-spacing: -1px; }
    .header-box p { font-size: 1rem; color: var(--text-muted); max-width: 500px; margin: 0 auto; line-height: 1.65; }
    
    .controls { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
    .back-btn { display: none; color: var(--text-main); font-weight: 800; cursor: pointer; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; background: var(--surface); padding: 10px 22px; border-radius: 50px; border: 1px solid var(--border); transition: 0.3s; box-shadow: 0 5px 15px var(--shadow); }
    .back-btn:hover { background: var(--primary); color: var(--bg); transform: scale(0.97); border-color: var(--primary); }

    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; }
    @media (max-width: 600px) { .grid { grid-template-columns: repeat(2, 1fr); gap: 12px; } }

    .item-card { background: radial-gradient(circle at top left, rgba(0,210,255,0.16), transparent 38%), var(--surface); border: 1px solid var(--border); border-radius: 28px; overflow: hidden; aspect-ratio: 16/9; position: relative; cursor: pointer; transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); animation: cardIn 0.5s ease-out backwards; box-shadow: 0 8px 25px var(--shadow); }
    @keyframes cardIn { from { opacity: 0; transform: scale(0.9) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
    .item-card:hover { transform: translateY(-10px) scale(1.03); border-color: rgba(34,211,238,0.30) !important; box-shadow: 0 22px 60px rgba(0,0,0,0.54), 0 0 36px rgba(34,211,238,0.09) !important; }
    .item-card::after { content: ''; position: absolute; inset: 0; background: linear-gradient(160deg, rgba(255,255,255,0.14), transparent 34%, rgba(0,0,0,0.58)); pointer-events: none; }
    .item-card img { width: 100%; height: 100%; object-fit: cover; opacity: 0.82; transition: 0.6s; pointer-events: none; }
    .item-card:hover img { opacity: 1; transform: scale(1.08); }
    .item-info { position: absolute; bottom: 0; left: 0; width: 100%; padding: 22px 16px; background: linear-gradient(to top, rgba(0,0,0,0.92), transparent); text-align: left; z-index: 2; }
    .item-info h3 { font-size: 0.95rem; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; color: #fff !important; margin: 0 0 7px; }
    .item-info small { color: var(--primary); font-size: 0.66rem; font-weight: 900; text-transform: uppercase; letter-spacing: 1.8px; }
    .cat-metric-pill { display: inline-flex; align-items: center; gap: 5px; margin-top: 7px; font-size: .6rem; font-weight: 800; color: #22d88a; background: rgba(34,216,138,.1); border: 1px solid rgba(34,216,138,.22); border-radius: 50px; padding: 2px 9px 2px 7px; letter-spacing: .4px; }
    .cat-metric-pill i { font-size: .55rem; }

    .work-card { aspect-ratio: auto !important; cursor: pointer; transition: 0.3s; }
    .work-card:active { transform: scale(0.97); }
    .wrapper { width: 100%; border-radius: 24px; overflow: hidden; position: relative; border: 1px solid var(--border); transition: 0.4s; background: var(--bg); box-shadow: 0 8px 20px var(--shadow); }
    .work-card:hover .wrapper { border-color: rgba(34,211,238,0.28); transform: translateY(-5px); box-shadow: 0 20px 50px rgba(0,0,0,0.48), 0 0 30px rgba(34,211,238,0.07) !important; }
    
    .ratio-16-9 .wrapper { aspect-ratio: 16/9; }
    .ratio-9-16 .wrapper { aspect-ratio: 9/16; }
    .ratio-1-1 .wrapper { aspect-ratio: 1/1; }

    .play-icon { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.15); transition: 0.3s; pointer-events: none; z-index: 10; }
    .work-card:hover .play-icon { background: rgba(0,0,0,0.35); }
    .play-icon i { font-size: 3rem; color: var(--primary); filter: drop-shadow(0 0 15px var(--primary)); opacity: 0.9; transition: 0.3s; }
    .work-card:hover .play-icon i { opacity: 1; transform: scale(1.1); }

    #previewModal { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.96); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); z-index: 99999; align-items: center; justify-content: center; padding: 20px; }
    .modal-content-wrapper { position: relative; width: 100%; margin: 0 auto; display: flex; flex-direction: column; align-items: center; animation: popIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes popIn { 0% { opacity: 0; transform: scale(0.95) translateY(20px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
    
    .close-modal { position: absolute; top: -55px; right: 0; background: var(--primary); color: var(--bg); padding: 10px 24px; border-radius: 50px; font-weight: 900; font-size: 0.8rem; cursor: pointer; text-transform: uppercase; letter-spacing: 1px; transition: 0.3s; z-index: 100; box-shadow: 0 5px 15px rgba(0,210,255,0.3); border: none; }
    .close-modal:hover { transform: scale(1.05); background: #fff; color: #000; }
    
    #modalContent { width: 100%; display: flex; justify-content: center; }
    .loader { display: none; text-align: center; color: var(--primary); font-size: 2.5rem; padding: 60px; animation: pulse 1s infinite alternate; }
    @keyframes pulse { from { opacity: 0.5; } to { opacity: 1; } }

</style>

<div class="container">
    <div class="controls">
        <div id="backBtn" class="back-btn" onclick="goBack()"><i class="ti ti-chevron-left"></i> Back</div>
    </div>
    
    <div class="header-box" data-aos="fade-down">
        <span style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 4px; color: var(--primary); margin-bottom: 12px; display: block;">Our Work</span>
        <div style="margin:16px auto 20px;"><svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color:var(--primary);display:block;margin:0 auto;"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.477-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg></div>
        <h1 id="pageTitle">
            <span class="sr-only">ExtoArts Portfolio - Gaming Thumbnails, YouTube Edits & Motion Graphics</span>
            <span aria-hidden="true"><span style="color: var(--text-main);">The </span><span style="color: var(--primary); -webkit-text-fill-color: var(--primary);">Archive.</span></span>
        </h1>
        <p>Gaming thumbnails, YouTube edits, short-form content, motion graphics, browse everything we've built.</p>
    </div>
    
    <div id="loader" class="loader"><i class="ti ti-loader-2 ti-spin"></i></div>

    <div id="catGrid" class="grid">
        <?php foreach ($localPortfolio as $key => $category): ?>
            <div class="item-card" data-aos="fade-up" onclick="loadLocalCategory('<?php echo htmlspecialchars($key, ENT_QUOTES); ?>', '<?php echo htmlspecialchars($category['name'], ENT_QUOTES); ?>')">
                <img src="<?php echo htmlspecialchars($category['thumb'], ENT_QUOTES); ?>" alt="<?php echo htmlspecialchars($category['name'], ENT_QUOTES); ?>, ExtoArts Portfolio Category" width="400" height="225" loading="lazy" decoding="async" oncontextmenu="return false;" draggable="false"<?php if (!empty($category['fallback'])): ?> onerror="this.onerror=null;this.src='<?php echo htmlspecialchars($category['fallback'], ENT_QUOTES); ?>';"<?php endif; ?>>
                <div class="item-info">
                    <h3><?php echo htmlspecialchars($category['name'], ENT_QUOTES); ?></h3>
                    <small><?php echo htmlspecialchars($category['meta'], ENT_QUOTES); ?></small>
                    <?php if (!empty($catMetrics[$key])): $m = $catMetrics[$key]; ?>
                    <span class="cat-metric-pill"><i class="ti <?= $m['icon'] ?>"></i> <?= $m['stat'] ?></span>
                    <?php endif; ?>
                </div>
            </div>
        <?php endforeach; ?>
    </div>

    <div id="subGrid" class="grid" style="display:none;"></div>
    <div id="workGrid" class="grid" style="display:none;"></div>
</div>

<?php
$portfolioItemList = [];
$portfolioItemPosition = 1;
$portfolioItemCount = 0;
foreach ($localPortfolio as $category) {
    $count = count($category['items'] ?? []);
    $portfolioItemCount += $count;
    $portfolioItemList[] = [
        '@type' => 'ListItem',
        'position' => $portfolioItemPosition++,
        'name' => $category['name'],
        'description' => trim(($category['meta'] ?? '') . ' by ExtoArts'),
    ];
}
?>
<script type="application/ld+json"><?php echo json_encode([
    '@context' => 'https://schema.org',
    '@type' => 'ItemList',
    'name' => 'ExtoArts Portfolio Categories',
    'description' => 'Portfolio categories and work samples by ExtoArts.',
    'numberOfItems' => $portfolioItemCount,
    'itemListElement' => $portfolioItemList,
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE); ?></script>

<style>
    .tg-section { max-width: 1100px; margin: 0 auto 120px; padding: 0 15px; position: relative; z-index: 10; }

    .tg-eyebrow { font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 4px; color: var(--primary); margin-bottom: 12px; display: block; }
    .tg-title { font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 900; letter-spacing: -1.5px; line-height: 1.1; margin: 0 0 10px; }
    .tg-title span { color: var(--primary); -webkit-text-fill-color: var(--primary); }
    .tg-subtitle { font-size: 1rem; color: var(--text-muted); max-width: 520px; line-height: 1.65; margin: 0 0 70px; }

    .tg-divider { width: 40px; height: 3px; background: var(--primary); border-radius: 2px; margin: 60px 0 50px; opacity: 0.4; }

    .game-block { margin-bottom: 65px; }
    .game-block:last-child { margin-bottom: 0; }

    .game-header { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; }
    .game-logo-wrap { width: 48px; height: 48px; border-radius: 14px; background: var(--surface); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; }
    .game-logo-wrap img { width: 40px; height: 40px; object-fit: contain; }
    .game-logo-fallback { font-size: 1.4rem; display: flex; align-items: center; justify-content: center; }
    .game-name { font-size: 1.3rem; font-weight: 900; letter-spacing: -0.5px; color: var(--text-main); }
    .game-count { margin-left: auto; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: var(--primary); background: rgba(0,210,255,0.08); border: 1px solid rgba(0,210,255,0.2); padding: 5px 14px; border-radius: 50px; white-space: nowrap; }
    .game-accent-line { flex: 1; height: 1px; background: var(--border); min-width: 20px; }

    .thumb-grid-game { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
    @media (max-width: 900px) { .thumb-grid-game { grid-template-columns: repeat(3, 1fr); } }
    @media (max-width: 600px) { .thumb-grid-game { grid-template-columns: repeat(2, 1fr); gap: 10px; } }

    .thumb-item { aspect-ratio: 16/9; border-radius: 16px; overflow: hidden; border: 1px solid var(--border); background: var(--surface); cursor: pointer; position: relative; transition: 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow: 0 4px 16px var(--shadow); }
    .thumb-item:hover { transform: translateY(-7px) scale(1.02); border-color: var(--primary); box-shadow: 0 16px 40px var(--primary-glow); }
    .thumb-item img { width: 100%; height: 100%; object-fit: cover; opacity: 0.75; transition: 0.5s; display: block; pointer-events: none; }
    .thumb-item:hover img { opacity: 1; transform: scale(1.05); }
    .thumb-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,210,255,0); transition: 0.3s; }
    .thumb-item:hover .thumb-overlay { background: rgba(0,210,255,0.06); }
    .thumb-overlay i { font-size: 1.6rem; color: var(--primary); opacity: 0; transform: scale(0.6); transition: 0.3s; filter: drop-shadow(0 0 10px var(--primary)); }
    .thumb-item:hover .thumb-overlay i { opacity: 1; transform: scale(1); }

    .thumb-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; cursor: default; pointer-events: none; opacity: 0.35; }
    .thumb-placeholder i { font-size: 1.4rem; color: var(--text-muted); }
    .thumb-placeholder span { font-size: 0.6rem; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: var(--text-muted); }
</style>

<?php
function renderManagedThumbs(array $items): void {
    foreach ($items as $i => $item) {
        $url = $item['thumbnail_url'] ?? '';
        $videoUrl = $item['video_url'] ?? '';
        $type = $item['project_type'] ?? 'image';
        $ratio = $item['ratio'] ?? '16:9';
        $alt = $item['title'] ?? 'ExtoArts portfolio item';
        $delay = min($i * 50, 300);
        $preview = $url ?: $videoUrl;
        if ($preview): ?>
            <div class="thumb-item" data-aos="fade-up" data-aos-delay="<?php echo $delay; ?>"
                 onclick="openProject('<?php echo htmlspecialchars($videoUrl, ENT_QUOTES); ?>', '<?php echo htmlspecialchars($preview, ENT_QUOTES); ?>', '<?php echo htmlspecialchars($type, ENT_QUOTES); ?>', '<?php echo htmlspecialchars($ratio, ENT_QUOTES); ?>')"
                 role="button" tabindex="0" aria-label="<?php echo htmlspecialchars($alt); ?>">
                <?php if ($type === 'video' && !$url): ?>
                    <video src="<?php echo htmlspecialchars($videoUrl); ?>#t=0.001" preload="metadata" muted playsinline oncontextmenu="return false;" draggable="false"><track kind="captions" src="" default></video>
                <?php else: ?>
                    <img src="<?php echo htmlspecialchars($preview); ?>" alt="<?php echo htmlspecialchars($alt); ?>" loading="lazy" oncontextmenu="return false;" draggable="false">
                <?php endif; ?>
                <div class="thumb-overlay"><i class="ti <?php echo $type === 'video' ? 'ti-player-play' : 'ti-arrows-maximize'; ?>"></i></div>
            </div>
        <?php else: ?>
            <div class="thumb-item thumb-placeholder" aria-label="<?php echo htmlspecialchars($alt); ?>">
                <i class="ti ti-photo"></i>
                <span>Coming Soon</span>
            </div>
        <?php endif;
    }
}
?>

<div class="tg-section">
    <div class="tg-divider" data-aos="fade-right"></div>

    <div data-aos="fade-up">
        <span class="tg-eyebrow">Featured Showcase</span>
        <h2 class="tg-title">Creative <span>Sections</span></h2>
        <p class="tg-subtitle">Explore our latest thumbnails, edits, motion graphics, and creative work by category.</p>
    </div>

    <?php foreach ($localPortfolio as $category): ?>
    <div class="game-block" data-aos="fade-up" id="portfolio-<?php echo htmlspecialchars(preg_replace('/[^a-z0-9\-]/', '', strtolower(str_replace(' ', '-', $category['name'])))); ?>">
        <div class="game-header">
            <div class="game-logo-wrap">
                <?php if (!empty($category['thumb'])): ?>
                <img src="<?php echo htmlspecialchars($category['thumb']); ?>" alt="<?php echo htmlspecialchars($category['name']); ?> cover"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <?php endif; ?>
                <span class="game-logo-fallback" style="<?php echo empty($category['thumb']) ? 'display:flex;' : 'display:none;'; ?>"><i class="ti ti-photo" style="color:#00d2ff;"></i></span>
            </div>
            <span class="game-name"><?php echo htmlspecialchars($category['name']); ?></span>
            <div class="game-accent-line"></div>
            <span class="game-count"><?php echo count($category['items'] ?? []); ?> items</span>
        </div>
        <div class="thumb-grid-game">
            <?php renderManagedThumbs($category['items'] ?? []); ?>
        </div>
    </div>
    <?php endforeach; ?>
</div>

<!-- ===================== BEFORE / AFTER SLIDER ===================== -->
<style>
.baf-section { max-width: 1100px; margin: 0 auto 120px; padding: 0 15px; position: relative; z-index: 10; }
.baf-divider-rule { width: 40px; height: 3px; background: var(--primary); border-radius: 2px; margin: 0 0 50px; opacity: 0.4; }
.baf-title { font-size: clamp(2rem,5vw,3.2rem); font-weight: 900; letter-spacing: -1.5px; line-height: 1.1; margin: 0 0 10px; }
.baf-title span { color: var(--primary); -webkit-text-fill-color: var(--primary); }
.baf-sub { font-size: 1rem; color: var(--text-muted); max-width: 480px; line-height: 1.65; margin: 0 0 32px; }
.baf-tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px; }
.baf-tab { background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 50px; padding: 8px 20px; font-size: 0.72rem; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: var(--text-muted); cursor: pointer; transition: 0.22s; font-family: inherit; }
.baf-tab:hover { border-color: rgba(0,210,255,0.3); color: var(--text-main); }
.baf-tab.active { background: rgba(0,210,255,0.1); border-color: var(--primary); color: var(--primary); }
.baf-slider-wrap { position: relative; width: 100%; aspect-ratio: 16/9; border-radius: 24px; overflow: hidden; border: 1px solid var(--border); cursor: ew-resize; user-select: none; box-shadow: 0 20px 60px var(--shadow); touch-action: pan-y; }
.baf-before { position: absolute; inset: 0; z-index: 1; }
.baf-before img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(0.9) brightness(0.6) contrast(0.85); pointer-events: none; display: block; transition: filter 0.4s; }
.baf-after { position: absolute; inset: 0; z-index: 2; clip-path: inset(0 50% 0 0); }
.baf-after img { width: 100%; height: 100%; object-fit: cover; pointer-events: none; display: block; }
.baf-pill { position: absolute; top: 16px; font-size: 0.6rem; font-weight: 900; letter-spacing: 3px; text-transform: uppercase; padding: 5px 14px; border-radius: 50px; pointer-events: none; z-index: 5; opacity: 0; transition: opacity 0.4s; }
.baf-pill-b { left: 16px; background: rgba(0,0,0,0.65); color: #aaa; border: 1px solid rgba(255,255,255,0.1); }
.baf-pill-a { right: 16px; background: rgba(0,210,255,0.15); color: var(--primary); border: 1px solid rgba(0,210,255,0.3); }
.baf-slider-wrap.touched .baf-pill { opacity: 1; }
.baf-divider { position: absolute; top: 0; bottom: 0; left: 50%; transform: translateX(-50%); width: 2px; background: var(--primary); z-index: 10; box-shadow: 0 0 12px rgba(0,210,255,0.5); pointer-events: none; }
.baf-handle { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 48px; height: 48px; border-radius: 50%; background: var(--primary); display: flex; align-items: center; justify-content: center; gap: 2px; color: var(--bg); font-size: 0.72rem; box-shadow: 0 0 0 4px rgba(0,210,255,0.2), 0 4px 20px rgba(0,210,255,0.4); animation: bafHandlePulse 2s ease-in-out infinite; }
@keyframes bafHandlePulse { 0%,100% { box-shadow: 0 0 0 4px rgba(0,210,255,0.2),0 4px 20px rgba(0,210,255,0.4); } 50% { box-shadow: 0 0 0 8px rgba(0,210,255,0.1),0 4px 24px rgba(0,210,255,0.5); } }
.baf-spark { position: absolute; left: 50%; width: 4px; height: 4px; border-radius: 50%; background: var(--primary); transform: translateX(-50%); opacity: 0; pointer-events: none; }
.baf-spark-1 { top: 25%; animation: bafSpark 2.4s ease-in-out 0.3s infinite; }
.baf-spark-2 { top: 50%; animation: bafSpark 2.4s ease-in-out 0.9s infinite; }
.baf-spark-3 { top: 75%; animation: bafSpark 2.4s ease-in-out 1.5s infinite; }
@keyframes bafSpark { 0% { opacity:0; transform:translateX(-50%) scale(0); } 30% { opacity:1; transform:translateX(-50%) scale(1.5); } 70% { opacity:0.6; transform:translateX(-4px) scale(1); } 100% { opacity:0; transform:translateX(4px) scale(0); } }
.baf-divider.baf-glitch { animation: bafGlitch 0.08s steps(2) 3; }
@keyframes bafGlitch { 0% { transform:translateX(-50%) scaleY(1.02); filter:hue-rotate(180deg); } 50% { transform:translateX(calc(-50% - 3px)); } 100% { transform:translateX(-50%); filter:none; } }
.baf-stats { position: absolute; bottom: 20px; right: 20px; z-index: 8; display: flex; flex-direction: column; gap: 6px; align-items: flex-end; transition: opacity 0.5s; pointer-events: none; }
.baf-stat-pill { background: rgba(0,210,255,0.15); border: 1px solid rgba(0,210,255,0.35); border-radius: 50px; padding: 5px 14px; font-size: 0.68rem; font-weight: 900; letter-spacing: 1.5px; color: var(--primary); text-transform: uppercase; animation: bafStatIn 0.4s cubic-bezier(0.22,1,0.36,1) both; }
@keyframes bafStatIn { from { transform:translateY(10px) scale(0.8); opacity:0; } to { transform:translateY(0) scale(1); opacity:1; } }
.baf-hint { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 8; font-size: 0.62rem; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.45); display: flex; align-items: center; gap: 6px; pointer-events: none; white-space: nowrap; animation: bafHintFade 3.5s ease 1s forwards; }
@keyframes bafHintFade { 0%,70% { opacity:1; } 100% { opacity:0; } }
.baf-hint i { animation: bafArrow 0.8s ease-in-out infinite alternate; }
@keyframes bafArrow { from { transform:translateX(-3px); } to { transform:translateX(3px); } }
.baf-pair-meta { margin-top: 16px; display: flex; justify-content: space-between; align-items: center; }
.baf-pair-name { font-size: 0.78rem; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: var(--text-muted); }
.baf-pair-name span { color: var(--primary); }
.baf-note { font-size: 0.7rem; color: var(--text-muted); opacity: 0.5; font-style: italic; }
[data-theme="light"] .baf-tab { background: rgba(0,0,0,0.03); }
</style>

<?php
$bafPairs = [
    ['label' => 'Free Fire',  'img' => 'https://iili.io/BZlx3g9.webp', 'stat1' => '+61% CTR', 'stat2' => '3x Clicks'],
    ['label' => 'Minecraft',  'img' => 'https://iili.io/BZlx7ea.jpg',  'stat1' => '+43% CTR', 'stat2' => '2.1M Views'],
    ['label' => 'Roblox',     'img' => 'https://iili.io/BZlx55g.jpg',  'stat1' => '+55% CTR', 'stat2' => '1.8M Views'],
    ['label' => 'PUBG',       'img' => 'https://iili.io/BZlx207.webp', 'stat1' => '+38% CTR', 'stat2' => '900K Views'],
];
?>

<section class="baf-section" data-aos="fade-up">
    <div class="tg-divider" data-aos="fade-right"></div>
    <div data-aos="fade-up">
        <span class="tg-eyebrow">The Transformation</span>
        <h2 class="baf-title">Drag to Reveal <span>The Difference</span></h2>
        <p class="baf-sub">Every pixel engineered to perform. Drag the handle to see what ExtoArts actually changes.</p>
    </div>

    <div class="baf-tabs" id="bafTabs">
        <?php foreach ($bafPairs as $i => $pair): ?>
            <button class="baf-tab<?php echo $i === 0 ? ' active' : ''; ?>" data-idx="<?php echo $i; ?>"><?php echo htmlspecialchars($pair['label']); ?></button>
        <?php endforeach; ?>
    </div>

    <div class="baf-slider-wrap" id="bafWrap">
        <div class="baf-before"><img id="bafImgB" src="<?php echo htmlspecialchars($bafPairs[0]['img']); ?>" alt="Before ExtoArts design"></div>
        <div class="baf-after" id="bafAfter"><img id="bafImgA" src="<?php echo htmlspecialchars($bafPairs[0]['img']); ?>" alt="After ExtoArts design"></div>
        <span class="baf-pill baf-pill-b">Without ExtoArts</span>
        <span class="baf-pill baf-pill-a">ExtoArts</span>
        <div class="baf-divider" id="bafDiv">
            <div class="baf-handle"><i class="ti ti-chevron-left"></i><i class="ti ti-chevron-right"></i></div>
            <div class="baf-spark baf-spark-1"></div>
            <div class="baf-spark baf-spark-2"></div>
            <div class="baf-spark baf-spark-3"></div>
        </div>
        <div class="baf-stats" id="bafStats" style="opacity:0">
            <span class="baf-stat-pill" id="bafStat1"><?php echo htmlspecialchars($bafPairs[0]['stat1']); ?></span>
            <span class="baf-stat-pill" id="bafStat2" style="animation-delay:0.12s"><?php echo htmlspecialchars($bafPairs[0]['stat2']); ?></span>
        </div>
        <div class="baf-hint"><i class="ti ti-arrows-horizontal"></i> Drag to compare</div>
    </div>

    <div class="baf-pair-meta">
        <span class="baf-pair-name">Viewing: <span id="bafPairLabel"><?php echo htmlspecialchars($bafPairs[0]['label']); ?></span> Thumbnails</span>
        <span class="baf-note">Same image - drag the handle</span>
    </div>
</section>

<script>
(function() {
    const pairs = <?php echo json_encode($bafPairs, JSON_UNESCAPED_SLASHES); ?>;
    let pos = 50, dragging = false, demoDone = false, currentIdx = 0;

    const wrap   = document.getElementById('bafWrap');
    const after  = document.getElementById('bafAfter');
    const div    = document.getElementById('bafDiv');
    const stats  = document.getElementById('bafStats');
    const stat1  = document.getElementById('bafStat1');
    const stat2  = document.getElementById('bafStat2');
    const imgB   = document.getElementById('bafImgB');
    const imgA   = document.getElementById('bafImgA');
    const lbl    = document.getElementById('bafPairLabel');

    function setPos(p) {
        p = Math.max(3, Math.min(97, p));
        pos = p;
        after.style.clipPath = `inset(0 ${100 - p}% 0 0)`;
        div.style.left = p + '%';
        stats.style.opacity = p > 64 ? '1' : '0';
    }

    function getX(e) { return e.touches ? e.touches[0].clientX : e.clientX; }

    wrap.addEventListener('mousedown',  e => { dragging = true; wrap.classList.add('touched'); });
    wrap.addEventListener('touchstart', e => { dragging = true; wrap.classList.add('touched'); }, { passive: true });
    document.addEventListener('mousemove', e => {
        if (!dragging) return;
        const r = wrap.getBoundingClientRect();
        setPos(((getX(e) - r.left) / r.width) * 100);
    });
    wrap.addEventListener('touchmove', e => {
        const r = wrap.getBoundingClientRect();
        setPos(((getX(e) - r.left) / r.width) * 100);
    }, { passive: true });
    document.addEventListener('mouseup',   () => { dragging = false; });
    wrap.addEventListener('touchend', () => { dragging = false; });

    /* Auto-demo on scroll into view */
    new IntersectionObserver(entries => {
        if (!entries[0].isIntersecting || demoDone) return;
        demoDone = true;
        const t0 = performance.now();
        function ease(t) { return t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2,2)/2; }
        function animate(from, to, dur, cb) {
            const start = performance.now();
            (function frame(now) {
                const t = Math.min((now - start) / dur, 1);
                setPos(from + (to - from) * ease(t));
                if (t < 1) requestAnimationFrame(frame); else if (cb) cb();
            })(performance.now());
        }
        setTimeout(() => animate(50, 15, 1400, () => setTimeout(() => animate(15, 50, 1100, null), 500)), 400);
    }, { threshold: 0.5 }).observe(wrap);

    /* Glitch every 4s when idle */
    setInterval(() => {
        if (!dragging) { div.classList.add('baf-glitch'); setTimeout(() => div.classList.remove('baf-glitch'), 320); }
    }, 4000);

    /* Tab switching */
    document.querySelectorAll('.baf-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.baf-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const idx = parseInt(tab.dataset.idx);
            currentIdx = idx;
            const p = pairs[idx];
            imgB.style.opacity = '0'; imgA.style.opacity = '0';
            setTimeout(() => {
                imgB.src = p.img; imgA.src = p.img;
                imgB.style.opacity = ''; imgA.style.opacity = '';
                stat1.textContent = p.stat1; stat2.textContent = p.stat2;
                lbl.textContent = p.label;
                setPos(50);
                wrap.classList.remove('touched');
                demoDone = false;
            }, 200);
        });
    });

    setPos(50);
})();
</script>

<div id="previewModal">
    <div class="modal-content-wrapper" id="modalWrapper">
        <button class="close-modal" onclick="closePreview()">Close &times;</button>
        <div id="modalContent"></div>
    </div>
</div>

<script>
    let currentStep = 'cat';
    let workParent = 'cat';
    const localPortfolio = <?php echo json_encode($localPortfolio, JSON_UNESCAPED_SLASHES); ?>;

    function escapeHtml(value) {
        return String(value || '').replace(/[&<>"']/g, match => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }[match]));
    }

    function jsArg(value) {
        return String(value || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    }

    function loadLocalCategory(key, name) {
        const category = localPortfolio[key];
        const data = category ? category.items : [];
        let html = '';

        data.forEach(w => {
            const ratioClass = 'ratio-' + w.ratio.replace(':', '-');
            const thumb = w.thumbnail_url || '';
            const videoUrl = w.video_url || '';
            let mediaHtml = '';

            if (w.project_type === 'video' && !thumb) {
                mediaHtml = `<video src="${escapeHtml(videoUrl)}#t=0.001" preload="metadata" muted playsinline style="width:100%; height:100%; object-fit:cover; pointer-events:none;" oncontextmenu="return false;" draggable="false"></video>`;
            } else {
                mediaHtml = `<img src="${escapeHtml(thumb)}" loading="lazy" alt="${escapeHtml(w.title)}, ExtoArts" style="width:100%; height:100%; object-fit:cover;" oncontextmenu="return false;" draggable="false">`;
            }

            html += `
            <div class="work-card ${ratioClass}" onclick="openProject('${jsArg(videoUrl)}', '${jsArg(thumb)}', '${jsArg(w.project_type)}', '${jsArg(w.ratio)}')">
                <div class="wrapper">
                    ${mediaHtml}
                    <div class="play-icon"><i class="ti ${w.project_type == 'video' ? 'ti-player-play' : 'ti-arrows-maximize'}"></i></div>
                </div>
                <div style="padding:15px 5px;"><h3 style="font-size:0.85rem; font-weight:800; color: var(--text-main); margin:0;">${escapeHtml(w.title)}</h3></div>
            </div>`;
        });

        workParent = 'cat';
        document.getElementById('catGrid').style.display = 'none';
        document.getElementById('subGrid').style.display = 'none';
        renderStep('catGrid', 'workGrid', html, name, 'work');
    }

    async function loadSubs(id, name) {
        document.getElementById('loader').style.display = 'block';
        const res = await fetch(`portfolio.php?get_subs=${id}`);
        const data = await res.json();
        
        let html = '';
        data.forEach(sub => {
            html += `<div class="item-card" onclick="loadWorks(${sub.id}, '${sub.name.replace(/'/g, "\\'")}')"><img src="${sub.thumb_url}" loading="lazy" alt="${sub.name}, ExtoArts" oncontextmenu="return false;" draggable="false"><div class="item-info"><h3>${sub.name}</h3></div></div>`;
        });
        renderStep('catGrid', 'subGrid', html, name, 'sub');
    }

    async function loadWorks(id, name) {
        document.getElementById('loader').style.display = 'block';
        const res = await fetch(`portfolio.php?get_works=${id}`);
        const data = await res.json();
        
        let html = '';
        data.forEach(w => {
            const ratioClass = 'ratio-' + w.ratio.replace(':', '-');
            let thumb = w.thumbnail_url;
            let mediaHtml = '';

            if (w.project_type === 'video' && (!thumb || thumb.includes('placeholder') || thumb.trim() === '')) {
                mediaHtml = `<video src="${w.video_url}#t=0.001" preload="metadata" muted playsinline style="width:100%; height:100%; object-fit:cover; pointer-events:none;" oncontextmenu="return false;" draggable="false"></video>`;
            } else {
                if(!thumb) thumb = 'https://via.placeholder.com/600x400/030d21/00d2ff?text=ExtoArts+Visual';
                mediaHtml = `<img src="${thumb}" loading="lazy" alt="${w.title}, ExtoArts" style="width:100%; height:100%; object-fit:cover;" oncontextmenu="return false;" draggable="false">`;
            }

            html += `
            <div class="work-card ${ratioClass}" onclick="openProject('${w.video_url}', '${thumb}', '${w.project_type}', '${w.ratio}')">
                <div class="wrapper">
                    ${mediaHtml}
                    <div class="play-icon"><i class="ti ${w.project_type == 'video' ? 'ti-player-play' : 'ti-arrows-maximize'}"></i></div>
                </div>
                <div style="padding:15px 5px;"><h3 style="font-size:0.85rem; font-weight:800; color: var(--text-main); margin:0;">${w.title}</h3></div>
            </div>`;
        });
        workParent = 'sub';
        renderStep('subGrid', 'workGrid', html, name, 'work');
    }

    function renderStep(hide, show, html, title, step) {
        document.getElementById(hide).style.display = 'none';
        const showEl = document.getElementById(show);
        showEl.innerHTML = html || '<p style="grid-column:1/-1; text-align:center; color: var(--text-muted); font-weight: bold; padding: 60px 20px;">Coming Soon...</p>';
        showEl.style.display = 'grid';
        document.getElementById('pageTitle').innerHTML = `<span class="sweep-text">${title}</span>`;
        document.getElementById('backBtn').style.display = 'block';
        document.getElementById('loader').style.display = 'none';
        currentStep = step;
        window.scrollTo(0,0);
    }

    function openProject(url, thumb, type, ratio) {
        const container = document.getElementById('modalContent');
        const wrapper = document.getElementById('modalWrapper');
        
        if(ratio === '9:16') wrapper.style.maxWidth = '400px';
        else if(ratio === '1:1') wrapper.style.maxWidth = '600px';
        else wrapper.style.maxWidth = '1000px';

        if(type === 'image') {
            container.innerHTML = `<img src="${thumb}" oncontextmenu="return false;" draggable="false" style="width: 100%; height: auto; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 0 40px rgba(0, 210, 255, 0.2); display: block;" alt="ExtoArts Portfolio Work">`;
        } else {
            if(url.includes('youtube.com') || url.includes('youtu.be')) {
                let vidId = url.split('v=')[1] || url.split('/').pop();
                if(vidId && vidId.includes('&')) vidId = vidId.split('&')[0];
                const pb = ratio === '9:16' ? '177.77%' : '56.25%';
                container.innerHTML = `<div style="position: relative; padding-bottom: ${pb}; height: 0; width: 100%;"><iframe src="https://www.youtube.com/embed/${vidId}?autoplay=1&rel=0" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 0 40px rgba(0, 210, 255, 0.2);" allowfullscreen allow="autoplay" title="ExtoArts Portfolio Video"></iframe></div>`;
            } else {
                container.innerHTML = `
                    <video id="hqVideoPlayer" controls playsinline preload="metadata" style="width: 100%; max-height: 85vh; background: #000; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 0 40px rgba(0, 210, 255, 0.2); display: block; outline: none;">
                        <source src="${url}" type="video/mp4">
                        <track kind="captions" src="" default>
                        Your browser does not support this video format.
                    </video>
                `;
            }
        }
        document.getElementById('previewModal').style.display = 'flex';
    }

    function closePreview() { 
        document.getElementById('previewModal').style.display = 'none'; 
        const container = document.getElementById('modalContent');
        const vid = document.getElementById('hqVideoPlayer');
        if(vid) {
            vid.pause();
            vid.removeAttribute('src'); 
            vid.load();
        }
        container.innerHTML = ''; 
    }
    
    function goBack() {
        if(currentStep === 'sub') { 
            document.getElementById('subGrid').style.display = 'none'; 
            document.getElementById('catGrid').style.display = 'grid'; 
            document.getElementById('pageTitle').innerHTML = '<span class="sweep-text">The Portfolio</span>'; 
            document.getElementById('backBtn').style.display = 'none'; 
            currentStep = 'cat'; 
        } 
        else if(currentStep === 'work') { 
            document.getElementById('workGrid').style.display = 'none'; 
            if (workParent === 'cat') {
                document.getElementById('catGrid').style.display = 'grid'; 
                document.getElementById('pageTitle').innerHTML = '<span class="sweep-text">The Portfolio</span>'; 
                document.getElementById('backBtn').style.display = 'none'; 
                currentStep = 'cat'; 
            } else {
                document.getElementById('subGrid').style.display = 'grid'; 
                document.getElementById('pageTitle').innerHTML = '<span class="sweep-text">Select a Category</span>';
                currentStep = 'sub'; 
            }
        }
    }

    document.addEventListener('keydown', e => { if(e.key === 'Escape') closePreview(); });
</script>

<?php include __DIR__ . '/../templates/footer.php'; ?>
