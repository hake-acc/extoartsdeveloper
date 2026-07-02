<?php
declare(strict_types=1);
$page_title = "YouTube Video Editing & Thumbnail Design | ExtoArts";
$page_desc  = "ExtoArts is a YouTube video editing agency for creators. High-retention edits, thumbnail design, Shorts editing, and channel automation. Flat-fee pricing.";
$og_title   = "ExtoArts - YouTube Editing Agency";
$og_desc    = "YouTube editing agency for creators. High-retention edits, flat-fee pricing.";
include __DIR__ . '/../templates/header.php';

/* ── Review data – prepared here so the section can render anywhere in the page ── */
$_reviews = [
    [
        'img' => 'https://iili.io/BZ0qgft.png',
        'init' => 'B', 'grad' => '#00d2ff,#0ea5e9',
        'n' => 'BetterGhazi', 'c' => 14,
        'date' => 'Dec 2024', 'type' => 'Video Edit',
        't' => '10/10 services. Best team completed within the deadline of 1 hour and best quality, no revisions needed.',
    ],
    [
        'img' => 'https://iili.io/BZ0qi5G.webp',
        'init' => 'S', 'grad' => '#7c3aed,#a855f7',
        'n' => 'Mr SYTH', 'c' => 14,
        'date' => 'Nov 2024', 'type' => 'Thumbnail Design',
        't' => 'ExtoArts is super professional and creative. They delivered my work on time with amazing quality. Highly recommend!',
    ],
    [
        'img' => 'https://iili.io/BZ0qX0F.webp',
        'init' => 'M', 'grad' => '#f59e0b,#ef4444',
        'n' => 'MANIK KAMBOJ', 'c' => 4,
        'date' => 'Oct 2024', 'type' => 'Motion Graphics',
        't' => 'I really liked the service, and the bot was ready within the time that was promised.',
    ],
    [
        'img' => 'https://iili.io/BZ0qSsI.webp',
        'init' => 'D', 'grad' => '#10b981,#06b6d4',
        'n' => 'Directional', 'c' => 13,
        'date' => 'Apr 2025', 'type' => 'Script + Thumbnail + Logo',
        't' => 'Got a script, thumbnail, and logo made and I\'m really impressed. Everything came out clean, creative, and exactly what I needed. Super affordable too. Honestly, great work for the price and definitely recommend if you want quality without spending big.',
    ],
    [
        'img' => 'https://iili.io/BZ0qOOv.webp',
        'init' => 'J', 'grad' => '#3b82f6,#8b5cf6',
        'n' => 'Joovah', 'c' => 10,
        'date' => 'Feb 2025', 'type' => 'Video Edit',
        't' => 'Quick and easy, got the demands exactly like we wanted. Overall pretty professional and good service.',
    ],
    [
        'img' => 'https://iili.io/BZ0qN5J.webp',
        'init' => 'Y', 'grad' => '#ef4444,#f97316',
        'n' => 'DiabloYT', 'c' => 12,
        'date' => 'Jan 2025', 'type' => 'Video Editing',
        't' => 'I am a small YouTuber who has used the services provided by ExtoArts and in my opinion they have really good prices for their work. They treat their customers with respect and are humble, they actually interact with you normally, for example in live streams and YouTube videos. Their service and time management are also really good.',
    ],
];

$_card = function($r) {
    $avatar = $r['img']
        ? '<img src="'.htmlspecialchars($r['img']).'" alt="'.htmlspecialchars($r['n']).'" width="48" height="48" loading="lazy" decoding="async">'
        : '<span class="rev-avatar-init" style="background:linear-gradient(135deg,'.htmlspecialchars($r['grad']).');width:100%;height:100%;display:flex;align-items:center;justify-content:center;border-radius:50%;">'.htmlspecialchars($r['init']).'</span>';
    $img = $r['img'] ?? '';
    $date = htmlspecialchars($r['date'] ?? '', ENT_QUOTES);
    $type = htmlspecialchars($r['type'] ?? '', ENT_QUOTES);
    return '<button class="rev-card" type="button"
        data-name="'.htmlspecialchars($r['n'], ENT_QUOTES).'"
        data-review-count="'.intval($r['c']).'"
        data-text="'.htmlspecialchars($r['t'], ENT_QUOTES).'"
        data-img="'.htmlspecialchars($img, ENT_QUOTES).'"
        data-init="'.htmlspecialchars($r['init'], ENT_QUOTES).'"
        data-grad="'.htmlspecialchars($r['grad'], ENT_QUOTES).'"
        data-date="'.$date.'"
        data-type="'.$type.'"
        aria-label="Read full review from '.htmlspecialchars($r['n'], ENT_QUOTES).'">
        <div class="rev-top-meta">
            <span class="rev-type-pill">'.htmlspecialchars($r['type'] ?? '').'</span>
            <span class="rev-date"><i class="ti ti-calendar-event"></i> '.htmlspecialchars($r['date'] ?? '').'</span>
        </div>
        <div class="rev-body">
            <p class="rev-text">'.htmlspecialchars($r['t']).'</p>
            <span class="rev-open-hint"><i class="ti ti-arrow-up-right"></i></span>
        </div>
        <div class="rev-foot">
            <div class="rev-avatar-wrap">
                <div class="rev-avatar-ring">
                    <div class="rev-avatar-inner">'.$avatar.'</div>
                </div>
            </div>
            <div class="rev-meta">
                <div class="rev-name">'.htmlspecialchars($r['n']).'</div>
                <div class="rev-stars" role="img" aria-label="5 out of 5 stars"><i class="ti ti-star-filled" aria-hidden="true"></i><i class="ti ti-star-filled" aria-hidden="true"></i><i class="ti ti-star-filled" aria-hidden="true"></i><i class="ti ti-star-filled" aria-hidden="true"></i><i class="ti ti-star-filled" aria-hidden="true"></i></div>
            </div>
            <div class="rev-badge"><i class="ti ti-brand-discord"></i> Verified</div>
        </div>
    </button>';
};

$_row1 = implode('', array_map($_card, $_reviews));
$_row2 = implode('', array_map($_card, array_merge(array_slice($_reviews, 4), array_slice($_reviews, 0, 4))));
?>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is ExtoArts?",
      "acceptedAnswer": { "@type": "Answer", "text": "ExtoArts (extoarts.in) is a YouTube video editing agency founded in 2024 that provides high-retention video editing, thumbnail design, YouTube Shorts and TikTok editing, motion graphics, and full YouTube channel automation. ExtoArts operates on a 10% flat agency fee model, meaning 90% of a creator's editing budget goes directly to the specialist editor assigned to the project." }
    },
    {
      "@type": "Question",
      "name": "How much does ExtoArts charge for video editing?",
      "acceptedAnswer": { "@type": "Answer", "text": "ExtoArts charges a flat 10% agency fee. If a creator's editing budget is $500 per video, ExtoArts takes $50 and the editor receives $450. Traditional agencies charge 30-50% commission. There are no hidden fees, retainer lock-ins, or setup costs. Request a custom quote on the ExtoArts Discord server." }
    },
    {
      "@type": "Question",
      "name": "How long does an ExtoArts video edit take?",
      "acceptedAnswer": { "@type": "Answer", "text": "Standard YouTube video edits take 3-5 business days depending on length and complexity. Rush delivery is available. Thumbnails are delivered within 24-48 hours. YouTube Shorts and TikTok edits take 1-2 business days. Retainer clients receive priority queue placement for faster turnaround." }
    },
    {
      "@type": "Question",
      "name": "Does ExtoArts edit TikTok and YouTube Shorts?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes. ExtoArts has editors who specialize specifically in short-form vertical content (9:16 aspect ratio) for TikTok, YouTube Shorts, and Instagram Reels. Short-form editing is a distinct craft from long-form YouTube editing - ExtoArts assigns dedicated short-form specialists, not generalists." }
    },
    {
      "@type": "Question",
      "name": "Does ExtoArts work with gaming channels?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes. ExtoArts has a dedicated gaming content team serving Roblox, Minecraft, PUBG, Free Fire, Fortnite, GTA V, and other gaming niches. ExtoArts is one of the few agencies that assigns niche-specific gaming editors rather than generalists. 3D character thumbnail design for gaming channels is also available." }
    },
    {
      "@type": "Question",
      "name": "How do I start working with ExtoArts?",
      "acceptedAnswer": { "@type": "Answer", "text": "Join the ExtoArts Discord server at discord.gg/extoarts-1402333030827425922 and open a private ticket. Share your footage, niche, upload schedule, and style references. ExtoArts will match you with the right specialist editor and send a custom quote within hours." }
    },
    {
      "@type": "Question",
      "name": "Can ExtoArts manage a faceless YouTube channel?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes. ExtoArts offers complete faceless YouTube channel automation including scriptwriting, voiceover sourcing, full video production, thumbnail design, upload scheduling, and YouTube SEO strategy. This is a full end-to-end managed service for investors and entrepreneurs who want to run a profitable YouTube channel without appearing on camera." }
    }
  ]
}
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://extoarts.in/" }
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://extoarts.in/",
  "url": "https://extoarts.in/",
  "name": "ExtoArts | YouTube Video Editing Agency, Thumbnail Design & Shorts Editing",
  "description": "YouTube video editing agency for creators. High-retention video editing, viral thumbnail design, TikTok and YouTube Shorts editing, channel automation, fair pricing, and real editors.",
  "inLanguage": "en-US",
  "datePublished": "2024-01-01",
  "dateModified": "2026-06-17",
  "about": {"@id": "https://extoarts.in/#organization"},
  "keywords": "YouTube video editing agency, thumbnail design service, TikTok video editing, YouTube Shorts editing, channel automation, ExtoArts, gaming video editing, faceless YouTube channel",
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": [".services-hero", ".stat-item", ".reel-section", ".services-section"]
  },
  "publisher": { "@id": "https://extoarts.in/#organization" },
  "isPartOf": { "@id": "https://extoarts.in/#website" }
}
</script>

<?php
$_pfData = json_decode(file_get_contents(__DIR__ . '/../data/portfolio.json'), true) ?: [];
$_pfSchemaItems = [];
$_pfPos = 1;
foreach ($_pfData as $cat) {
    foreach ($cat['items'] ?? [] as $item) {
        if (empty($item['thumbnail_url'])) continue;
        $_pfSchemaItems[] = [
            'position'    => $_pfPos++,
            'name'        => htmlspecialchars($item['title'] ?? ($cat['name'] . ' Sample'), ENT_QUOTES),
            'description' => htmlspecialchars('ExtoArts ' . $cat['name'] . ' - ' . ($item['title'] ?? 'creative work sample') . '. Professionally designed for YouTube creators.', ENT_QUOTES),
            'url'         => 'https://extoarts.in/portfolio',
            'image'       => htmlspecialchars($item['thumbnail_url'], ENT_QUOTES),
            'type'        => $item['project_type'] === 'video' ? 'VideoObject' : 'ImageObject',
            'category'    => htmlspecialchars($cat['name'], ENT_QUOTES),
        ];
    }
}
?>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": "https://extoarts.in/#portfolio",
  "name": "ExtoArts Creative Portfolio",
  "description": "Original creative work by ExtoArts - YouTube video editing, gaming thumbnail design, motion graphics, and short-form content produced for real creators.",
  "url": "https://extoarts.in/portfolio",
  "numberOfItems": <?php echo count($_pfSchemaItems); ?>,
  "itemListElement": [
    <?php echo implode(",\n    ", array_map(function($it) {
        return json_encode([
            "@type" => "ListItem",
            "position" => $it['position'],
            "item" => [
                "@type" => "CreativeWork",
                "name" => html_entity_decode($it['name'], ENT_QUOTES),
                "description" => html_entity_decode($it['description'], ENT_QUOTES),
                "url" => $it['url'],
                "image" => html_entity_decode($it['image'], ENT_QUOTES),
                "genre" => html_entity_decode($it['category'], ENT_QUOTES),
                "creator" => ["@id" => "https://extoarts.in/#organization"],
                "provider" => ["@id" => "https://extoarts.in/#organization"],
                "isPartOf" => ["@id" => "https://extoarts.in/#portfolio"],
            ]
        ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    }, $_pfSchemaItems)); ?>
  ]
}
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Review",
      "author": {"@type": "Person", "name": "BetterGhazi"},
      "reviewRating": {"@type": "Rating", "ratingValue": "5", "bestRating": "5", "worstRating": "1"},
      "reviewBody": "10/10 services. Best team completed within the deadline of 1 hour and best quality, no revisions needed.",
      "itemReviewed": {"@id": "https://extoarts.in/#organization"},
      "publisher": {"@type": "Organization", "name": "Discord"}
    },
    {
      "@type": "Review",
      "author": {"@type": "Person", "name": "Mr SYTH"},
      "reviewRating": {"@type": "Rating", "ratingValue": "5", "bestRating": "5", "worstRating": "1"},
      "reviewBody": "ExtoArts is super professional and creative. They delivered my work on time with amazing quality. Highly recommend!",
      "itemReviewed": {"@id": "https://extoarts.in/#organization"},
      "publisher": {"@type": "Organization", "name": "Discord"}
    },
    {
      "@type": "Review",
      "author": {"@type": "Person", "name": "MANIK KAMBOJ"},
      "reviewRating": {"@type": "Rating", "ratingValue": "5", "bestRating": "5", "worstRating": "1"},
      "reviewBody": "I really liked the service, and the bot was ready within the time that was promised.",
      "itemReviewed": {"@id": "https://extoarts.in/#organization"},
      "publisher": {"@type": "Organization", "name": "Discord"}
    },
    {
      "@type": "Review",
      "author": {"@type": "Person", "name": "Directional"},
      "reviewRating": {"@type": "Rating", "ratingValue": "5", "bestRating": "5", "worstRating": "1"},
      "reviewBody": "Got a script, thumbnail, and logo made and I'm really impressed. Everything came out clean, creative, and exactly what I needed. Super affordable too. Honestly, great work for the price and definitely recommend if you want quality without spending big.",
      "itemReviewed": {"@id": "https://extoarts.in/#organization"},
      "publisher": {"@type": "Organization", "name": "Discord"}
    },
    {
      "@type": "Review",
      "author": {"@type": "Person", "name": "Joovah"},
      "reviewRating": {"@type": "Rating", "ratingValue": "5", "bestRating": "5", "worstRating": "1"},
      "reviewBody": "Quick and easy, got the demands exactly like we wanted. Overall pretty professional and good service.",
      "itemReviewed": {"@id": "https://extoarts.in/#organization"},
      "publisher": {"@type": "Organization", "name": "Discord"}
    },
    {
      "@type": "Review",
      "author": {"@type": "Person", "name": "DiabloYT"},
      "reviewRating": {"@type": "Rating", "ratingValue": "5", "bestRating": "5", "worstRating": "1"},
      "reviewBody": "I am a small YouTuber who has used the services provided by ExtoArts and in my opinion they have really good prices for their work. They treat their customers with respect and are humble, they actually interact with you normally. Their service and time management are also really good.",
      "itemReviewed": {"@id": "https://extoarts.in/#organization"},
      "publisher": {"@type": "Organization", "name": "Discord"}
    }
  ]
}
</script>

<style>
    .hero { 
        padding: 22vh 20px 8vh;
        padding-top: min(22svh, 22vh); 
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        text-align: center; 
        position: relative; 
        z-index: 10; 
    }

    .hero-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 16px 6px 10px;
        border-radius: 50px;
        border: 1px solid rgba(34,211,238,0.22);
        background: rgba(34,211,238,0.06);
        font-size: 0.66rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 2.5px;
        color: var(--primary);
        margin-bottom: 32px;
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
    }
    .hero-badge-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--primary);
        box-shadow: 0 0 8px rgba(34,211,238,0.8);
        flex-shrink: 0;
        animation: badgePulse 2.8s ease infinite;
    }
    @keyframes badgePulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.55; transform: scale(0.75); }
    }
    [data-theme="light"] .hero-badge {
        background: rgba(2,132,199,0.07);
        border-color: rgba(2,132,199,0.25);
        color: var(--primary);
    }
    [data-theme="light"] .hero-badge-dot {
        background: var(--primary);
        box-shadow: 0 0 8px rgba(2,132,199,0.7);
    }

    .hero-title { 
        font-size: clamp(3.2rem, 9vw, 7rem); 
        font-weight: 900; 
        line-height: 1.0; 
        letter-spacing: -2px; 
        margin-bottom: 32px; 
    }

    .hero-title .line-accent {
        color: var(--primary);
        display: block;
        min-height: 1.1em;
    }

    .hero-title .line-accent .cycle-stack {
        -webkit-text-fill-color: var(--primary);
        color: var(--primary);
    }

    .hero-desc { 
        font-size: clamp(1rem, 1.8vw, 1.2rem); 
        color: var(--text-muted); 
        max-width: 540px; 
        line-height: 1.75; 
        font-weight: 400; 
        margin-bottom: 44px; 
    }

    .btn-wrap { 
        display: flex; 
        align-items: center;
        gap: 16px; 
        justify-content: center; 
        flex-wrap: wrap; 
    }

    .hero-platforms{display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:22px;}
    .hp-label{font-size:.58rem;color:var(--text-muted);letter-spacing:.9px;text-transform:uppercase;font-weight:700;}
    .hp-badge{display:inline-flex;align-items:center;gap:5px;padding:5px 12px;border-radius:20px;text-decoration:none;font-size:.64rem;font-weight:800;letter-spacing:.3px;border:1px solid;transition:opacity .18s,background .18s;}
    .hp-badge:hover{opacity:.75;}
    .hp-ytjobs{background:rgba(239,68,68,.06);color:#f87171;border-color:rgba(239,68,68,.22);}
    .hp-tp{background:rgba(0,182,122,.06);color:#34d399;border-color:rgba(0,182,122,.22);}
    [data-theme="light"] .hp-ytjobs{background:rgba(185,28,28,.07);color:#b91c1c;border-color:rgba(185,28,28,.28);}
    [data-theme="light"] .hp-tp{background:rgba(4,120,87,.07);color:#047857;border-color:rgba(4,120,87,.28);}

    .scroll-indicator { 
        margin-top: 72px; 
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        gap: 12px; 
        opacity: 0.35; 
    }

    .mouse-outline { 
        width: 24px; 
        height: 36px; 
        border: 1.5px solid var(--text-muted); 
        border-radius: 50px; 
        position: relative; 
    }

    .mouse-wheel { 
        width: 4px; 
        height: 7px; 
        background: var(--text-main); 
        border-radius: 4px; 
        position: absolute; 
        top: 6px; 
        left: 50%; 
        transform: translateX(-50%); 
        animation: wheelDrop 2s ease-in-out infinite; 
    }

    @keyframes wheelDrop { 
        0% { top: 6px; opacity: 1; } 
        100% { top: 18px; opacity: 0; } 
    }

    .sec-label {
        font-size: 0.66rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 4px;
        color: var(--text-muted);
        margin-bottom: 14px;
        display: block;
        text-align: center;
    }

    .sec-title { 
        text-align: center; 
        font-size: clamp(2.2rem, 5vw, 3.8rem); 
        font-weight: 900; 
        margin-bottom: 14px; 
        color: var(--text-main); 
        letter-spacing: -2px; 
        line-height: 1.08;
    }

    .sec-sub {
        text-align: center;
        font-size: 1rem;
        color: var(--text-muted);
        max-width: 520px;
        margin: 0 auto 50px;
        line-height: 1.75;
    }

    .services-section { 
        padding: min(80px, 7vw) min(20px, 5%); 
        max-width: 1200px; 
        margin: 0 auto; 
        position: relative; 
        z-index: 10; 
    }

    .grid-3 { 
        display: grid; 
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
        gap: 18px;
        border: none;
        border-radius: 0;
        overflow: visible;
    }

    /* ── Bento: services section — tall featured left, two stacked right ─── */
    #services .grid-3 {
        grid-template-columns: 3fr 2fr;
        grid-template-rows: auto auto;
        gap: 18px;
    }
    #services .grid-3 .tilt-card:first-child {
        grid-row: span 2;
        display: flex;
        flex-direction: column;
        border-top: 1px solid rgba(34,211,238,0.20);
        background: rgba(6,6,22,0.93);
    }
    #services .grid-3 .tilt-card:first-child .tilt-inner {
        flex: 1;
        display: flex;
        flex-direction: column;
    }
    #services .grid-3 .tilt-card:first-child p {
        flex: 1;
    }
    #services .grid-3 .tilt-card:first-child h3 {
        font-size: clamp(1.25rem, 2.2vw, 1.7rem);
        letter-spacing: -0.6px;
    }
    #services .grid-3 .tilt-card:first-child .service-icon {
        width: 74px;
        height: 74px;
        background: linear-gradient(135deg, rgba(34,211,238,.14), rgba(124,58,237,.10));
        border-color: rgba(34,211,238,.24);
        box-shadow: 0 0 36px rgba(34,211,238,.10), inset 0 0 16px rgba(124,58,237,.07);
    }
    #services .grid-3 .tilt-card:first-child .service-icon i.ti {
        font-size: 1.85rem;
    }
    @media (max-width: 800px) {
        #services .grid-3 { grid-template-columns: 1fr; grid-template-rows: auto; }
        #services .grid-3 .tilt-card:first-child { grid-row: span 1; }
        #services .grid-3 .tilt-card:first-child h3 { font-size: 1.25rem; }
    }

    .tilt-card { 
        padding: min(44px, 5vw) min(36px, 4.5vw); 
        text-align: left; 
        border: 1px solid rgba(255,255,255,0.07);
        border-right: 1px solid rgba(255,255,255,0.07);
        background: rgba(5,5,17,0.90);
        border-radius: 22px;
        box-shadow: 0 20px 55px rgba(0,0,0,0.62), 0 0 0 1px rgba(255,255,255,0.04);
        transition: background 0.4s ease, transform 0.45s var(--easing), box-shadow 0.45s var(--easing), border-color 0.4s ease; 
    }

    .tilt-card:last-child {
        border-right: 1px solid rgba(255,255,255,0.07);
    }

    .tilt-card:hover {
        background: rgba(7,7,22,0.96) !important;
        transform: translateY(-6px);
        box-shadow: 0 34px 84px rgba(0,0,0,0.74), 0 0 38px rgba(34,211,238,0.08), 0 0 0 1px rgba(34,211,238,0.15);
        border-color: rgba(34,211,238,0.18) !important;
    }

    .tilt-inner { 
        pointer-events: none; 
    }

    .service-num {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        font-size: 0.58rem;
        font-weight: 900;
        letter-spacing: 2px;
        color: var(--primary);
        text-transform: uppercase;
        margin-bottom: 22px;
        padding: 4px 11px;
        border: 1px solid rgba(34,211,238,0.22);
        border-radius: 20px;
        background: rgba(34,211,238,0.06);
    }

    .service-icon { 
        width: 68px; 
        height: 68px; 
        background: linear-gradient(135deg, rgba(34,211,238,0.10), rgba(124,58,237,0.07));
        border: 1px solid rgba(34,211,238,0.17); 
        border-radius: 20px; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        margin-bottom: 24px;
        position: relative;
        overflow: visible;
        flex-shrink: 0;
        box-shadow: 0 0 26px rgba(34,211,238,0.07), inset 0 0 12px rgba(124,58,237,0.05);
    }
    .service-icon svg {
        width: 34px;
        height: 34px;
        overflow: visible;
    }
    .service-icon img, .service-icon i.ti {
        font-size: 1.6rem;
        color: var(--primary);
        display: block;
        flex-shrink: 0;
        transition: filter 0.3s ease, transform 0.3s ease;
    }
    .js-tilt:hover .service-icon img, .js-tilt:hover .service-icon i.ti {
        filter: drop-shadow(0 0 12px rgba(34,211,238,0.7));
        transform: scale(1.12);
    }

    .tilt-card h3 { 
        font-size: clamp(1.1rem, 2.2vw, 1.35rem); 
        font-weight: 800; 
        margin-bottom: 12px; 
        letter-spacing: -0.5px;
        line-height: 1.25;
    }

    .tilt-card p { 
        font-size: clamp(0.88rem, 1.6vw, 0.94rem); 
        line-height: 1.72; 
        color: var(--text-muted);
    }

    .featured-section { 
        padding: min(80px, 7vw) min(20px, 5%); 
        max-width: 1400px; 
        margin: 0 auto; 
        text-align: center; 
        z-index: 10; 
        position: relative; 
    }

    .preview-grid { 
        display: grid; 
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); 
        gap: 20px; 
    }

    .preview-card { 
        position: relative; 
        border-radius: 24px; 
        overflow: hidden; 
        border: 1px solid var(--border); 
        aspect-ratio: 16/9; 
        background: var(--surface); 
        cursor: pointer; 
        transition: transform 0.35s var(--easing), border-color 0.3s, box-shadow 0.3s; 
    }

    .preview-img { 
        width: 100%; 
        height: 100%; 
        object-fit: cover; 
        opacity: 0.6; 
        transition: 0.5s ease; 
    }

    .preview-card:hover { 
        transform: translateY(-10px); 
        border-color: var(--primary); 
        box-shadow: 0 20px 50px var(--primary-glow);
    }

    .preview-card:hover .preview-img { 
        opacity: 1; 
        transform: scale(1.05); 
    }

    .preview-overlay { 
        position: absolute; 
        inset: 0; 
        background: linear-gradient(to top, rgba(0,0,0,0.92) 0%, transparent 55%); 
        display: flex; 
        flex-direction: column; 
        justify-content: flex-end; 
        align-items: flex-start; 
        padding: 28px; 
        pointer-events: none; 
    }

    .preview-overlay span { 
        font-size: clamp(1.05rem, 2.2vw, 1.35rem); 
        font-weight: 900; 
        color: #fff !important; 
        letter-spacing: -0.5px; 
        margin-bottom: 5px;
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .preview-overlay small { 
        color: var(--primary); 
        font-weight: 800; 
        font-size: 0.72rem; 
        text-transform: uppercase; 
        letter-spacing: 2px;
        transition: transform 0.4s 0.03s cubic-bezier(0.16, 1, 0.3, 1), color 0.3s ease;
    }

    @media (hover: hover) and (pointer: fine) {
        .preview-card:hover .preview-overlay span { transform: translateY(-5px); }
        .preview-card:hover .preview-overlay small { transform: translateY(-5px); color: #fff; }
    }

    .founder-section { 
        padding: min(40px, 4.5vw) min(20px, 5%); 
        max-width: 1000px; 
        margin: 0 auto; 
        position: relative; 
        z-index: 10; 
    }

    .founder-card-inline { 
        display: flex; 
        align-items: center; 
        gap: 50px; 
        padding: min(50px, 5vw) min(50px, 6%); 
        border-radius: 36px; 
        border: 1px solid var(--border);
        background: var(--surface);
        transition: transform 0.4s ease, border-color 0.3s; 
    }

    .founder-card-inline:hover { 
        transform: translateY(-5px); 
        border-color: rgba(34,211,238,0.30) !important; 
        box-shadow: 0 28px 70px rgba(0,0,0,0.44), 0 0 40px rgba(34,211,238,0.07) !important;
    }

    .founder-img-inline { 
        width: 150px; 
        height: 150px; 
        border-radius: 50%; 
        object-fit: cover; 
        object-position: center 60%;
        border: 2px solid var(--border); 
        flex-shrink: 0; 
    }

    .founder-info-inline { 
        text-align: left; 
    }

    .founder-info-inline h3 { 
        font-size: clamp(1.6rem, 4vw, 2.8rem); 
        font-weight: 900; 
        margin-bottom: 5px; 
        line-height: 1; 
        letter-spacing: -1px; 
    }

    .founder-info-inline h3 span { 
        color: var(--text-muted); 
        font-size: clamp(0.95rem, 2vw, 1.2rem); 
        font-weight: 500; 
        letter-spacing: 0; 
    }

    .founder-info-inline p.title { 
        color: var(--primary); 
        font-weight: 800; 
        font-size: 0.78rem; 
        text-transform: uppercase; 
        letter-spacing: 4px; 
        margin-bottom: 15px; 
    }

    .founder-info-inline p.desc { 
        font-size: 1rem; 
        margin-bottom: 25px; 
        line-height: 1.65; 
    }

    .seo-mission-block {
        max-width: 860px;
        margin: 0 auto 120px;
        padding: min(40px, 4.5vw) min(20px, 5%);
        text-align: center;
    }
    .seo-mission-block h2 {
        font-size: clamp(1.7rem, 4vw, 2.2rem);
        font-weight: 900;
        margin-bottom: 20px;
        letter-spacing: -1px;
    }
    .seo-mission-block p {
        font-size: 1rem;
        line-height: 1.85;
        color: var(--text-muted);
        margin-bottom: 18px;
    }
    .seo-mission-block strong {
        color: var(--text-main);
    }

    .stats-row {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 14px;
        margin: 48px auto;
        max-width: 1100px;
        width: calc(100% - 48px);
        position: relative;
        z-index: 10;
        border: none;
        border-radius: 0;
        overflow: visible;
        background: none;
    }
    .stat-item {
        text-align: center;
        flex: unset;
        min-width: unset;
        padding: min(28px, 3.5vw) min(16px, 4%);
        border-right: none;
        border: 1px solid rgba(255,255,255,0.07);
        border-radius: 20px;
        background: rgba(5,5,17,0.90);
        box-shadow: 0 16px 44px rgba(0,0,0,0.54), 0 0 0 1px rgba(255,255,255,0.03);
        transition: border-color 0.32s ease, box-shadow 0.32s ease;
    }
    .stat-item:last-child { border-right: none; border: 1px solid rgba(255,255,255,0.07); }
    .stat-number { font-size: clamp(1.6rem, 3.8vw, 2.4rem); font-weight: 900; background: linear-gradient(135deg, #22d3ee 0%, #38bdf8 35%, #0ea5e9 65%, #22d3ee 100%); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; letter-spacing: -1.5px; line-height: 1; margin-bottom: 8px; animation: sweepGradient 3s linear infinite; }
    .stat-label { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: var(--text-muted); line-height: 1.4; }

    @media (max-width: 768px) {
        .founder-card-inline { 
            flex-direction: column; 
            text-align: center; 
            padding: 40px 25px; 
            gap: 25px; 
        }
        .founder-info-inline { 
            text-align: center; 
        }
        .stats-row { grid-template-columns: repeat(2, 1fr); }
        .stat-item { border-right: none; border-bottom: none; border: 1px solid rgba(255,255,255,0.07); }
        .stat-item:last-child { border-bottom: none; }
        .grid-3 { grid-template-columns: 1fr; gap: 14px; }
        .tilt-card { border-right: 1px solid rgba(255,255,255,0.07); border-bottom: none; }
        .tilt-card:last-child { border-bottom: none; }
    }

    /* ===== REVIEWS SECTION ===== */
    .reviews-section {
        padding: min(130px, 12vw) 0 min(110px, 10vw);
        position: relative;
        overflow: hidden;
    }

    .rev-trust-bar {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        margin-bottom: 20px;
        flex-wrap: wrap;
    }
    .rev-trust-pill {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding: 7px 16px;
        border-radius: 50px;
        font-size: 0.78rem;
        font-weight: 700;
        letter-spacing: 0.02em;
    }
    .rev-trust-pill.stars {
        background: rgba(245,158,11,0.1);
        border: 1px solid rgba(245,158,11,0.2);
        color: var(--warm);
    }
    .rev-trust-pill.count {
        background: rgba(13,13,28,0.9);
        border: 1px solid rgba(255,255,255,0.12);
        color: var(--text-soft);
    }
    .rev-trust-pill.discord {
        background: rgba(88,101,242,0.1);
        border: 1px solid rgba(88,101,242,0.22);
        color: #7289da;
    }
    .rev-trust-sep {
        width: 4px; height: 4px;
        border-radius: 50%;
        background: var(--border);
        flex-shrink: 0;
    }

    .marquee-outer {
        position: relative;
        margin: 0 -80px;
        overflow: hidden;
    }
    .marquee-fade {
        position: absolute;
        top: 0; bottom: 0;
        width: 220px;
        z-index: 2;
        pointer-events: none;
    }
    .marquee-fade.left  { left: 0;  background: linear-gradient(to right, var(--bg) 15%, transparent 100%); }
    .marquee-fade.right { right: 0; background: linear-gradient(to left,  var(--bg) 15%, transparent 100%); }

    .marquee-row {
        overflow: hidden;
        margin-bottom: 20px;
        transform: translateZ(0);
        mask-image: linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%);
        -webkit-mask-image: linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%);
    }
    .marquee-row:last-child { margin-bottom: 0; }
    .marquee-row:hover .marquee-track,
    .marquee-row:focus-within .marquee-track { animation-play-state: paused; }

    .marquee-track {
        display: flex;
        gap: 20px;
        width: max-content;
        padding: 12px 0;
        will-change: transform;
        backface-visibility: hidden;
        transform: translate3d(0,0,0);
    }
    .marquee-track.go-left  { animation: mLeft  58s linear infinite; }
    .marquee-track.go-right { animation: mRight 52s linear infinite; }

    @keyframes mLeft  { 0% { transform: translate3d(0,0,0); }     100% { transform: translate3d(-50%,0,0); } }
    @keyframes mRight { 0% { transform: translate3d(-50%,0,0); }  100% { transform: translate3d(0,0,0); }    }

    /* === Card === */
    .rev-card {
        flex-shrink: 0;
        width: 370px;
        background: linear-gradient(145deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.015) 100%);
        border: 1px solid rgba(255,255,255,0.07);
        border-radius: 22px;
        padding: 30px 30px 26px;
        display: flex;
        flex-direction: column;
        gap: 0;
        position: relative;
        overflow: hidden;
        cursor: pointer;
        transition: border-color 0.45s var(--easing), box-shadow 0.45s var(--easing), transform 0.45s var(--easing), background 0.45s var(--easing);
        backdrop-filter: blur(12px);
        text-align: left;
        appearance: none;
        font: inherit;
        color: inherit;
    }
    .rev-card::before {
        content: '';
        position: absolute;
        inset: -45% auto auto -35%;
        width: 190px;
        height: 190px;
        background: radial-gradient(circle, rgba(167,139,250,0.10), transparent 68%);
        opacity: 0;
        transform: scale(0.6);
        transition: opacity 0.45s var(--easing), transform 0.45s var(--easing);
        pointer-events: none;
    }
    .rev-card::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 22px;
        background: linear-gradient(135deg, rgba(13,13,28,0.06) 0%, transparent 60%);
        opacity: 0;
        transition: opacity 0.4s ease;
        pointer-events: none;
    }
    .rev-card:hover,
    .rev-card:focus-visible {
        border-color: rgba(34,211,238,0.16);
        box-shadow: 0 22px 64px rgba(0,0,0,0.58), 0 0 32px rgba(34,211,238,0.05);
        transform: translateY(-8px) scale(1.015);
    }
    .rev-card:hover::before,
    .rev-card:focus-visible::before { opacity: 1; transform: scale(1); }
    .rev-card:hover::after,
    .rev-card:focus-visible::after { opacity: 1; }

    .rev-quote-icon {
        position: absolute;
        top: 18px; right: 22px;
        font-size: clamp(2.5rem, 5vw, 3.5rem);
        line-height: 1;
        font-family: Georgia, serif;
        background: linear-gradient(135deg, var(--primary), var(--purple));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        opacity: 0.18;
        pointer-events: none;
        user-select: none;
    }

    .rev-body {
        flex: 1;
        margin-bottom: 24px;
    }
    .rev-text {
        font-size: 0.93rem;
        color: rgba(255,255,255,0.72);
        line-height: 1.8;
        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    .rev-open-hint {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin-top: 16px;
        color: var(--primary);
        font-size: 0.72rem;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        opacity: 0;
        transform: translateY(8px);
        transition: opacity 0.35s var(--easing), transform 0.35s var(--easing);
    }
    .rev-card:hover .rev-open-hint,
    .rev-card:focus-visible .rev-open-hint {
        opacity: 1;
        transform: translateY(0);
    }

    .rev-foot {
        display: flex;
        align-items: center;
        gap: 14px;
        border-top: 1px solid rgba(255,255,255,0.06);
        padding-top: 20px;
    }

    .rev-avatar-wrap {
        position: relative;
        flex-shrink: 0;
    }
    .rev-avatar-ring {
        width: 52px; height: 52px;
        border-radius: 50%;
        padding: 2.5px;
        background: linear-gradient(135deg, var(--primary), var(--purple));
        box-shadow: 0 0 12px rgba(167,139,250,0.2);
        flex-shrink: 0;
    }
    .rev-avatar-inner {
        width: 100%; height: 100%;
        border-radius: 50%;
        overflow: hidden;
        background: var(--surface);
        display: flex; align-items: center; justify-content: center;
    }
    .rev-avatar-inner img {
        width: 100%; height: 100%;
        object-fit: cover;
        object-position: center center;
        border-radius: 50%;
        display: block;
    }
    .rev-avatar-init {
        font-size: 1.1rem;
        font-weight: 900;
        color: #fff;
    }

    .rev-meta { flex: 1; min-width: 0; }
    .rev-name {
        font-size: 0.9rem; font-weight: 800;
        color: var(--text-main);
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        margin-bottom: 4px;
    }
    .rev-stars { color: var(--warm); font-size: 0.68rem; letter-spacing: 3px; }

    .rev-badge {
        display: inline-flex; align-items: center; gap: 5px;
        background: rgba(88,101,242,0.1);
        border: 1px solid rgba(88,101,242,0.22);
        border-radius: 8px;
        padding: 5px 10px;
        font-size: 0.68rem; font-weight: 800;
        color: #7289da;
        white-space: nowrap;
        flex-shrink: 0;
        letter-spacing: 0.02em;
    }

    .rev-top-meta {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 18px;
    }
    .rev-type-pill {
        font-size: 0.62rem;
        font-weight: 800;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--primary);
        background: rgba(34,211,238,0.08);
        border: 1px solid rgba(34,211,238,0.18);
        border-radius: 6px;
        padding: 3px 9px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 60%;
    }
    .rev-date {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 0.62rem;
        font-weight: 600;
        color: rgba(255,255,255,0.32);
        white-space: nowrap;
        flex-shrink: 0;
    }
    .rev-date i { font-size: 0.68rem; opacity: 0.7; }
    [data-theme="light"] .rev-date { color: var(--text-muted); }
    [data-theme="light"] .rev-type-pill { color: var(--primary); }

    .review-modal .modal-box {
        max-width: 620px;
        padding: 0;
        overflow: hidden;
        text-align: left;
        transform: translateY(18px) scale(0.96);
        transition: transform 0.35s var(--easing);
    }
    .review-modal.show .modal-box {
        transform: translateY(0) scale(1);
    }
    .review-modal-card {
        position: relative;
        padding: 34px;
        background:
            radial-gradient(circle at 15% 0%, rgba(167,139,250,0.10), transparent 34%),
            linear-gradient(145deg, rgba(18,18,40,0.95), rgba(13,13,28,0.98));
    }
    .review-modal-close {
        position: absolute;
        top: 18px;
        right: 18px;
        width: 42px;
        height: 42px;
        border: 1px solid var(--border);
        background: rgba(255,255,255,0.04);
        color: var(--text-main);
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.3s var(--easing), border-color 0.3s, background 0.3s;
    }
    .review-modal-close:hover {
        transform: rotate(90deg) scale(1.06);
        border-color: var(--primary);
        background: var(--primary-glow);
    }
    .review-modal-head {
        display: flex;
        align-items: center;
        gap: 16px;
        padding-right: 48px;
        margin-bottom: 24px;
    }
    .review-modal-avatar {
        width: 68px;
        height: 68px;
        border-radius: 50%;
        padding: 3px;
        background: linear-gradient(135deg, var(--primary), var(--accent));
        box-shadow: 0 0 18px rgba(167,139,250,0.22);
        flex-shrink: 0;
    }
    .review-modal-avatar-inner {
        width: 100%;
        height: 100%;
        border-radius: inherit;
        overflow: hidden;
        background: var(--surface);
    }
    .review-modal-avatar img,
    .review-modal-avatar span {
        width: 100%;
        height: 100%;
        border-radius: inherit;
        display: flex;
        align-items: center;
        justify-content: center;
        object-fit: cover;
        font-weight: 900;
        color: #fff;
    }
    .review-modal-name {
        font-size: clamp(1.05rem, 2.2vw, 1.35rem);
        font-weight: 900;
        color: var(--text-main);
        margin-bottom: 4px;
    }
    .review-modal-proof {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 10px;
        color: var(--text-muted);
        font-size: 0.82rem;
        font-weight: 700;
    }
    .review-modal-proof span:first-child {
        color: var(--warm);
        letter-spacing: 2px;
    }
    .review-modal-text {
        color: rgba(255,255,255,0.78) !important;
        font-size: clamp(0.9rem, 1.8vw, 1.06rem);
        line-height: 1.9;
        margin-bottom: 24px;
    }
    .review-modal-action {
        display: flex;
        justify-content: flex-end;
    }

    @media (max-width: 768px) {
        .marquee-outer { margin: 0 -20px; }
        .marquee-fade { width: 70px; }
        .rev-card { width: 290px; padding: 22px 22px 20px; }
        .rev-trust-bar { gap: 8px; }
        .rev-trust-sep { display: none; }
        .review-modal-card { padding: 26px 22px; }
        .review-modal-head { align-items: flex-start; }
        .review-modal-text { font-size: 0.98rem; }
    }


    /* ===== HERO TRUST ROW ===== */
    .hero-trust {
        display: flex;
        align-items: center;
        gap: 11px;
        justify-content: center;
        margin-top: 28px;
        flex-wrap: wrap;
    }
    .htr-avs { display: flex; align-items: center; }
    .htr-av {
        width: 33px;
        height: 33px;
        border-radius: 50%;
        border: 2.5px solid var(--bg);
        object-fit: cover;
        margin-left: -9px;
        box-shadow: 0 2px 8px rgba(0,0,0,.5);
        flex-shrink: 0;
        transition: transform .2s;
    }
    .htr-av:first-child { margin-left: 0; }
    .htr-avs:hover .htr-av { transform: scale(1.08); }
    .htr-info { display: flex; flex-direction: column; gap: 2px; }
    .htr-stars { display: flex; gap: 1px; color: var(--warm); font-size: .62rem; }
    .htr-label { font-size: .7rem; color: rgba(255,255,255,.42); font-weight: 600; line-height: 1.35; }
    .htr-label strong { color: rgba(255,255,255,.82); }
    .ea-count-wrap {
        background: linear-gradient(90deg, var(--primary), var(--purple));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-weight: 700;
    }
    .ea-count { display: inline; }
    [data-theme="light"] .htr-label { color: var(--text-muted); }
    [data-theme="light"] .htr-label strong { color: var(--text-main); }

    /* ===== HERO SPOTLIGHT ===== */
    .hero-spotlight {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 3;
        overflow: hidden;
    }
    .hero-spotlight-blob {
        position: absolute;
        width: 680px;
        height: 680px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(34,211,238,0.04) 0%, transparent 68%);
        left: 0;
        top: 0;
        transition: transform 1.4s cubic-bezier(0.16,1,0.3,1);
        pointer-events: none;
    }

    /* ===== CAPABILITY PILLS (static) ===== */
    .cap-static-wrap {
        padding: 26px 0 22px;
        position: relative;
        z-index: 10;
    }
    .cap-pill-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: center;
        max-width: 820px;
        margin: 0 auto;
        padding: 0 min(24px, 5%);
    }

    .cap-chip {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 8px 18px 8px 10px;
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 100px;
        backdrop-filter: blur(10px) saturate(140%);
        -webkit-backdrop-filter: blur(10px) saturate(140%);
        font-size: 0.83rem;
        font-weight: 600;
        color: var(--text-soft);
        white-space: nowrap;
        cursor: default;
        flex-shrink: 0;
        transition: border-color 0.3s, background 0.3s, color 0.3s;
    }
    .cap-chip:hover {
        border-color: rgba(34,211,238,0.32);
        background: rgba(34,211,238,0.06);
        color: var(--primary);
    }
    .cap-chip-icon {
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(34,211,238,0.12);
        border-radius: 50%;
        font-size: 0.72rem;
        color: var(--primary);
        flex-shrink: 0;
        transition: background 0.3s;
    }
    .cap-chip:hover .cap-chip-icon { background: rgba(34,211,238,0.22); }

    [data-theme="light"] .cap-chip {
        background: rgba(0,0,0,0.04);
        border-color: rgba(0,0,0,0.09);
    }
    [data-theme="light"] .cap-chip:hover {
        background: rgba(34,211,238,0.08);
        border-color: rgba(34,211,238,0.35);
    }
    [data-theme="light"] .cap-chip-icon { background: rgba(34,211,238,0.14); }

    .tilt-card { position: relative; overflow: hidden; }

    /* ===== LIGHT MODE OVERRIDES ===== */
        background: rgba(0,0,0,0.04) !important;
    }
    [data-theme="light"] .hero-float-pill {
        background: rgba(0,0,0,0.06);
        border: 1px solid rgba(0,0,0,0.10);
        color: var(--text-main);
    }
    [data-theme="light"] .rev-card {
        background: linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(240,244,248,0.9) 100%);
        border: 1px solid rgba(0,0,0,0.08);
        box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    }
    [data-theme="light"] .rev-card:hover,
    [data-theme="light"] .rev-card:focus-visible {
        border-color: rgba(0,0,0,0.14);
        box-shadow: 0 8px 32px rgba(0,0,0,0.10);
    }
    [data-theme="light"] .rev-text {
        color: var(--text-muted);
    }
    [data-theme="light"] .rev-foot {
        border-top: 1px solid var(--border);
    }
    [data-theme="light"] .review-modal-card {
        background:
            radial-gradient(circle at 15% 0%, rgba(2,132,199,0.08), transparent 34%),
            var(--surface);
    }
    [data-theme="light"] .review-modal-close {
        background: rgba(0,0,0,0.04);
    }
    [data-theme="light"] .review-modal-text {
        color: var(--text-muted) !important;
    }
    [data-theme="light"] .rev-trust-pill.count {
        background: rgba(0,0,0,0.05);
        border: 1px solid rgba(0,0,0,0.10);
        color: var(--text-soft);
    }
    [data-theme="light"] .service-icon {
        border-color: rgba(2, 132, 199, 0.18);
        box-shadow: none;
    }
    [data-theme="light"] .js-tilt:hover .service-icon img,
    [data-theme="light"] .js-tilt:hover .service-icon i.ti {
        filter: drop-shadow(0 0 8px rgba(2,132,199,0.35));
    }
    [data-theme="light"] .rev-avatar-ring {
        box-shadow: 0 2px 8px rgba(0,0,0,0.10);
    }
    [data-theme="light"] .review-modal-avatar {
        box-shadow: 0 2px 10px rgba(0,0,0,0.10);
    }
    [data-theme="light"] .stats-row {
        background: none;
    }
    [data-theme="light"] .stat-item {
        background: rgba(255,255,255,0.94);
        border-color: rgba(0,0,0,0.08);
        box-shadow: 0 6px 24px rgba(0,0,0,0.07);
    }
    [data-theme="light"] .grid-3 {
        border: none;
    }
    [data-theme="light"] .tilt-card {
        background: rgba(255,255,255,0.94);
        border-color: rgba(0,0,0,0.08);
        border-right: 1px solid rgba(0,0,0,0.08);
        box-shadow: 0 12px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04);
    }
    [data-theme="light"] .preview-card:hover {
        box-shadow: 0 4px 24px rgba(0,0,0,0.11);
    }
    [data-theme="light"] .founder-card-inline:hover {
        box-shadow: 0 4px 24px rgba(0,0,0,0.10) !important;
    }
</style>

<header class="hero">

    <div class="hero-nebula-orbs" aria-hidden="true"></div>
    <p class="sr-only">ExtoArts - YouTube Video Editing Agency, Thumbnail Design &amp; Channel Automation Service by ExtoArts (extoarts.in)</p>
    <div class="hero-spotlight" aria-hidden="true">
        <div class="hero-spotlight-blob"></div>
    </div>


    <div class="hero-badge" data-aos="fade-down">
        <span class="hero-badge-dot" aria-hidden="true"></span>
        YouTube Video Editing Agency
    </div>
    
    <h1 class="hero-title">
        <span class="ea-word">We</span> <span class="ea-word">make</span> <span class="ea-word">your</span><br>
        <span class="line-accent ea-line-enter ea-word">content work.</span>
    </h1>
    
    <p class="hero-desc" data-aos="fade-up" data-aos-delay="180">
        Your editor knows your niche before they touch a single clip. Flat 10% fee. Thumbnails in 48 hours.
    </p>
    
    <div class="btn-wrap" data-aos="fade-up" data-aos-delay="280">
        <button class="galaxy-btn" onclick="openModal('discordModal')"><span class="gb-inner"><i class="ti ti-rocket"></i> Start a Project</span></button>
        <a href="/portfolio" class="btn btn-glass btn-glass-dim transition-link">See Our Work</a>
    </div>

    <!-- Trusted creators avatar row -->
    <div class="hero-trust" data-aos="fade-up" data-aos-delay="350">
        <div class="htr-avs">
            <img src="https://iili.io/BZ0qgft.png"  class="htr-av" alt="Creator" width="40" height="40" loading="eager" fetchpriority="high" decoding="async">
            <img src="https://iili.io/BZ0qi5G.webp" class="htr-av" alt="Creator" width="40" height="40" loading="eager" decoding="async">
            <img src="https://iili.io/BZ0qX0F.webp" class="htr-av" alt="Creator" width="40" height="40" loading="eager" decoding="async">
            <img src="https://iili.io/BZ0qSsI.webp" class="htr-av" alt="Creator" width="40" height="40" loading="eager" decoding="async">
            <img src="https://iili.io/BZ0qOOv.webp" class="htr-av" alt="Creator" width="40" height="40" loading="eager" decoding="async">
        </div>
        <div class="htr-info">
            <div class="htr-stars">
                <i class="ti ti-star-filled"></i><i class="ti ti-star-filled"></i><i class="ti ti-star-filled"></i><i class="ti ti-star-filled"></i><i class="ti ti-star-filled"></i>
            </div>
            <span class="htr-label"><strong class="ea-count-wrap"><span class="ea-count" data-target="120">0</span>+</strong> YouTube creators scaling with ExtoArts</span>
        </div>
    </div>

    <a href="/estimate" class="hero-sub-link transition-link" data-aos="fade-up" data-aos-delay="360">
        <i class="ti ti-calculator"></i>Not sure what it costs? Use the free estimator &rarr;
    </a>

    <!-- Platform presence badges -->
    <div class="hero-platforms" data-aos="fade-up" data-aos-delay="420">
        <span class="hp-label">Find us on</span>
        <a href="https://ytjobs.co/talent/profile/528947?r=179" target="_blank" rel="noopener noreferrer" class="hp-badge hp-ytjobs" aria-label="ExtoArts on YTJobs">
            <svg viewBox="0 0 16 11" width="15" height="11" aria-hidden="true" style="flex-shrink:0;"><rect x="0" y="0" width="16" height="11" rx="2.8" fill="#ef4444"/><polygon points="6.5,2.5 11.5,5.5 6.5,8.5" fill="white"/></svg>
            YTJobs
        </a>
        <!-- Custom Trustpilot badge — lightweight, no external scripts -->
        <a href="https://www.trustpilot.com/review/extoarts.in" target="_blank" rel="noopener noreferrer" class="hp-badge hp-trustpilot" aria-label="ExtoArts rated Excellent on Trustpilot">
            <svg width="14" height="14" viewBox="0 0 111 105" fill="none" aria-hidden="true" style="flex-shrink:0;"><path d="M55.5 0L68.02 40.6H111L76.99 65.7L89.51 106.3L55.5 81.2L21.49 106.3L34.01 65.7L0 40.6H42.98L55.5 0Z" fill="#00b67a"/></svg>
            <span style="font-size:.62rem;font-weight:800;letter-spacing:.2px;">4.5 Excellent</span>
        </a>
    </div>

    <a href="#services" class="scroll-indicator" data-aos="fade-in" data-aos-delay="480" aria-label="Scroll to services">
        <div class="mouse-outline" aria-hidden="true">
            <div class="mouse-wheel"></div>
        </div>
    </a>
</header>


<div class="cap-static-wrap" aria-label="Agency capabilities">
    <div class="cap-pill-grid">
        <div class="cap-chip"><span class="cap-chip-icon"><i class="ti ti-photo"></i></span>Thumbnail Design</div>
        <div class="cap-chip"><span class="cap-chip-icon"><i class="ti ti-movie"></i></span>Video Editing</div>
        <div class="cap-chip"><span class="cap-chip-icon"><i class="ti ti-device-mobile"></i></span>Short-Form Content</div>
        <div class="cap-chip"><span class="cap-chip-icon"><i class="ti ti-chart-line"></i></span>Retention Hooks</div>
        <div class="cap-chip"><span class="cap-chip-icon"><i class="ti ti-palette"></i></span>Color Grading</div>
        <div class="cap-chip"><span class="cap-chip-icon"><i class="ti ti-wave-sine"></i></span>Sound Design</div>
        <div class="cap-chip"><span class="cap-chip-icon"><i class="ti ti-chart-bar"></i></span>YouTube Growth</div>
        <div class="cap-chip"><span class="cap-chip-icon"><i class="ti ti-settings-2"></i></span>Channel Automation</div>
        <div class="cap-chip"><span class="cap-chip-icon"><i class="ti ti-star-filled"></i></span>5-Star Rated</div>
        <div class="cap-chip"><span class="cap-chip-icon"><i class="ti ti-clock-bolt"></i></span>Fast Turnaround</div>
        <div class="cap-chip"><span class="cap-chip-icon"><i class="ti ti-device-gamepad-2"></i></span>Gaming Content</div>
        <div class="cap-chip"><span class="cap-chip-icon"><i class="ti ti-eye-off"></i></span>Faceless YouTube</div>
        <div class="cap-chip"><span class="cap-chip-icon"><i class="ti ti-sparkles"></i></span>Motion Graphics</div>
        <div class="cap-chip"><span class="cap-chip-icon"><i class="ti ti-cut"></i></span>Shorts Editing</div>
    </div>
</div>

<div class="stats-row" data-aos="fade-up">
    <div class="stat-item">
        <div class="stat-number">50%+</div>
        <div class="stat-label">Viewer Retention Target</div>
    </div>
    <div class="stat-item">
        <div class="stat-number">10%</div>
        <div class="stat-label">Flat Agency Fee - Only</div>
    </div>
    <div class="stat-item">
        <div class="stat-number">24-48h</div>
        <div class="stat-label">Thumbnail Turnaround</div>
    </div>
    <div class="stat-item">
        <div class="stat-number">90%</div>
        <div class="stat-label">Of Budget Goes To Your Editor</div>
    </div>
</div>

<style>
/* Trust stack */
.tstack{padding:min(28px,2.5vw) min(24px,5%) min(64px,5.5vw);}
.tstack-row{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;max-width:900px;margin:0 auto;}
.tstack-badge{display:flex;align-items:center;gap:8px;background:var(--surface);border:1px solid var(--border);border-radius:50px;padding:9px 18px 9px 14px;font-size:.75rem;font-weight:600;color:var(--text-muted);transition:border-color .2s,color .2s;}
.tstack-badge:hover{border-color:rgba(34,211,238,.22);color:var(--text-main);}
.tstack-badge i{color:var(--primary);font-size:.78rem;flex-shrink:0;}
[data-theme="light"] .tstack-badge{background:#fff;border-color:rgba(0,0,0,.08);}
</style>


<div class="tstack" data-aos="fade-up">
<div class="tstack-row">
    <span class="tstack-badge"><i class="ti ti-repeat"></i> 3 Revision Rounds</span>
    <span class="tstack-badge"><i class="ti ti-clock-hour-4"></i> Replies Within Hours</span>
    <span class="tstack-badge"><i class="ti ti-adjustments-horizontal"></i> Niche-Matched Editors</span>
    <span class="tstack-badge"><i class="ti ti-shield-check"></i> Secure Payments</span>
    <span class="tstack-badge"><i class="ti ti-world"></i> 30+ Countries Served</span>
</div>
</div>

<section class="reviews-section" id="reviews">
    <div class="rev-trust-bar" data-aos="fade-up">
        <span class="rev-trust-pill stars" style="display:inline-flex;align-items:center;gap:5px;"><i class="ti ti-star-filled" style="color:#fbbf24;font-size:18px;"></i><i class="ti ti-star-filled" style="color:#fbbf24;font-size:18px;"></i><i class="ti ti-star-filled" style="color:#fbbf24;font-size:18px;"></i><i class="ti ti-star-filled" style="color:#fbbf24;font-size:18px;"></i><i class="ti ti-star-filled" style="color:#fbbf24;font-size:18px;"></i> 5.0 Rating</span>
        <span class="rev-trust-sep"></span>
        <span class="rev-trust-pill count"><i class="ti ti-users"></i> 50+ Happy Creators</span>
        <span class="rev-trust-sep"></span>
        <span class="rev-trust-pill" style="display:inline-flex;align-items:center;gap:5px;"><i class="ti ti-star" aria-hidden="true" style="color:#f59e0b;font-size:14px;flex-shrink:0;"></i> All 5-Star Reviews</span>
        <span class="rev-trust-sep"></span>
        <span class="rev-trust-pill discord"><i class="ti ti-brand-discord"></i> Verified on Discord</span>
        <span class="rev-trust-sep"></span>
        <a href="https://ytjobs.co/talent/profile/528947?r=179" target="_blank" rel="noopener noreferrer" class="rev-trust-pill rev-trust-ytjobs" style="text-decoration:none;display:inline-flex;align-items:center;gap:5px;">
            <svg viewBox="0 0 16 11" width="14" height="10" aria-hidden="true" style="flex-shrink:0;"><rect x="0" y="0" width="16" height="11" rx="2.8" fill="#ef4444"/><polygon points="6.5,2.5 11.5,5.5 6.5,8.5" fill="white"/></svg>
            On YTJobs
        </a>
    </div>

    <span class="sec-label" data-aos="fade-up">Client Reviews</span>
    <h2 class="sec-title" data-aos="fade-up" style="margin-bottom: 14px;">Straight from the Discord.</h2>
    <p class="sec-sub" data-aos="fade-up" style="margin-bottom: 64px; max-width:520px; margin-left:auto; margin-right:auto;">Every review below came from a real ticket. Pulled directly from our Discord server, nothing edited, nothing selected for the marketing page.</p>

    <div class="marquee-outer" data-aos="fade-up">
        <div class="marquee-fade left"></div>
        <div class="marquee-fade right"></div>

        <div class="marquee-row">
            <div class="marquee-track go-left">
                <?php echo $_row1 . $_row1; ?>
            </div>
        </div>

        <div class="marquee-row">
            <div class="marquee-track go-right">
                <?php echo $_row2 . $_row2; ?>
            </div>
        </div>
    </div>
</section>

<section id="services" class="services-section">
    <h2 class="sec-title sweep-text" data-aos="fade-up">Three crafts. One team.</h2>
    <p class="sec-sub" data-aos="fade-up">Thumbnails that earn the click. Videos that hold the watch. Shorts that interrupt the scroll. Each one handled by specialists, not generalists with a broad portfolio.</p>
    
    <div class="grid-3">
        <div class="tilt-card js-tilt" data-aos="fade-up">
            <div class="tilt-inner">
                <span class="service-num">01 - Thumbnails</span>
                <div class="service-icon" aria-hidden="true">
                    <i class="ti ti-photo"></i>
                </div>
                <h3>YouTube Thumbnail Design</h3>
                <p>Your thumbnail is the most important frame of your video, and it hasn't been posted yet. We design click-worthy thumbnails using composition, color psychology, and A/B-tested visual strategies that genuinely move your CTR.</p>
            </div>
        </div>
        
        <div class="tilt-card js-tilt" data-aos="fade-up" data-aos-delay="100">
            <div class="tilt-inner">
                <span class="service-num">02 - Video Editing</span>
                <div class="service-icon" aria-hidden="true">
                    <i class="ti ti-movie"></i>
                </div>
                <h3>YouTube Video Editing</h3>
                <p>We don't just trim clips, we build retention into the edit itself. Pacing, sound design, motion graphics, and hooks all working together to keep viewers watching all the way to the end.</p>
            </div>
        </div>
        
        <div class="tilt-card js-tilt" data-aos="fade-up" data-aos-delay="200">
            <div class="tilt-inner">
                <span class="service-num">03 - Short-Form</span>
                <div class="service-icon" aria-hidden="true">
                    <i class="ti ti-device-mobile"></i>
                </div>
                <h3>TikTok & Short-Form Editing</h3>
                <p>Short-form is its own craft. Our editors are trained specifically for vertical content, fast cuts, sound-synced energy, and hooks designed to stop the scroll in the first two seconds.</p>
            </div>
        </div>
    </div>
</section>


<section class="featured-section">
    <h2 class="sec-title sweep-text" data-aos="fade-up">From the Archive - Gaming Thumbnails</h2>
    <p class="sec-sub" data-aos="fade-up">A sample of gaming thumbnail work from the archive. Click any to browse the full portfolio.</p>
    
    <div class="preview-grid">
        <div class="preview-card" data-aos="fade-up" onclick="window.location.href='/portfolio'">
            <img class="preview-img" src="https://iili.io/BZlx55g.jpg" alt="Roblox gaming thumbnail by ExtoArts" width="640" height="360" loading="lazy" decoding="async" oncontextmenu="return false;" draggable="false">
            <div class="preview-overlay">
                <span>Roblox Entity</span>
                <small>3D Thumbnail Design</small>
            </div>
        </div>
        
        <div class="preview-card" data-aos="fade-up" data-aos-delay="100" onclick="window.location.href='/portfolio'">
            <img class="preview-img" src="https://iili.io/BZlx7ea.jpg" alt="Minecraft gaming thumbnail by ExtoArts" width="640" height="360" loading="lazy" decoding="async" oncontextmenu="return false;" draggable="false">
            <div class="preview-overlay">
                <span>Minecraft Hardcore</span>
                <small>Composition & VFX</small>
            </div>
        </div>
        
        <div class="preview-card" data-aos="fade-up" data-aos-delay="200" onclick="window.location.href='/portfolio'">
            <img class="preview-img" src="https://iili.io/BZlx3g9.webp" alt="Free Fire gaming thumbnail by ExtoArts" width="640" height="360" loading="lazy" decoding="async" oncontextmenu="return false;" draggable="false">
            <div class="preview-overlay">
                <span>Free Fire Elite</span>
                <small>VFX Integration</small>
            </div>
        </div>
    </div>
    
    <a href="/portfolio" class="btn btn-glass transition-link" style="margin-top: 50px;" data-aos="fade-up">Browse the Full Portfolio</a>
</section>


<style>
#discord-agency { position: relative; overflow: hidden; }
#discord-agency::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
        radial-gradient(ellipse 55% 90% at 8% 50%, rgba(88,101,242,0.08) 0%, transparent 62%),
        radial-gradient(ellipse 50% 80% at 92% 50%, rgba(139,92,246,0.06) 0%, transparent 58%),
        radial-gradient(ellipse 35% 50% at 50% 100%, rgba(139,92,246,0.05) 0%, transparent 55%);
    pointer-events: none;
    z-index: 0;
}
#discord-agency > * { position: relative; z-index: 1; }
/* ── Discord process panel ──────────────────────────── */
.dsc-process-panel { display: flex; max-width: 1000px; margin: 0 auto; background: rgba(5,5,17,0.88); border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; overflow: hidden; position: relative; }
.dsc-proc-step { flex: 1; padding: min(44px,5vw) min(36px,4vw); }
.dpc-num { display: block; font-size: clamp(2.4rem,5vw,3.6rem); font-weight: 900; letter-spacing: -3px; color: rgba(34,211,238,0.11); line-height: 1; margin-bottom: 22px; font-variant-numeric: tabular-nums; }
.dpc-icon { width: 46px; height: 46px; background: linear-gradient(135deg,rgba(34,211,238,.09),rgba(124,58,237,.05)); border: 1px solid rgba(34,211,238,.18); border-radius: 13px; display: flex; align-items: center; justify-content: center; margin-bottom: 18px; }
.dpc-icon i { font-size: 1.25rem; color: var(--primary); }
.dpc-title { font-size: 1.05rem; font-weight: 800; letter-spacing: -0.4px; margin-bottom: 10px; color: var(--text-main); line-height: 1.3; }
.dpc-desc { font-size: 0.875rem; color: var(--text-muted); line-height: 1.72; margin: 0; }
.dpc-divider { width: 1px; background: rgba(255,255,255,0.07); flex-shrink: 0; margin: 28px 0; }
.dsc-proc-step { transition: background 0.25s ease; }
.dsc-proc-step:hover { background: rgba(34,211,238,0.025); }
[data-theme="light"] .dsc-process-panel { background: rgba(255,255,255,0.90); border-color: rgba(0,0,0,0.08); }
[data-theme="light"] .dpc-divider { background: rgba(0,0,0,0.08); }
[data-theme="light"] .dpc-num { color: rgba(34,211,238,0.30); }
[data-theme="light"] .dpc-icon { background: linear-gradient(135deg,rgba(2,132,199,.08),rgba(124,58,237,.04)); border-color: rgba(2,132,199,.22); }
[data-theme="light"] #services .grid-3 .tilt-card:first-child { border-top-color: rgba(2,132,199,.22); background: rgba(255,255,255,.96); }
@media (max-width: 720px) { .dsc-process-panel { flex-direction: column; } .dpc-divider { width: auto; height: 1px; margin: 0 28px; } }
</style>
<section id="discord-agency" class="services-section" data-aos="fade-up">
    <h2 class="sec-title" data-aos="fade-up">YouTube Editing via Discord - Start to Finish</h2>
    <p class="sec-sub" data-aos="fade-up" style="max-width:640px;margin-left:auto;margin-right:auto;">ExtoArts is a Discord-native creative agency. Every brief, revision, and final delivery happens in a private channel - no onboarding portals, no email threads, no extra tools. Just the same platform you already use.</p>

    <div class="dsc-process-panel">
        <div class="dsc-proc-step" data-aos="fade-up" data-aos-delay="0">
            <span class="dpc-num" aria-hidden="true">01</span>
            <div class="dpc-icon" aria-hidden="true"><i class="ti ti-brand-discord"></i></div>
            <h3 class="dpc-title">Open a Ticket</h3>
            <p class="dpc-desc">Join the ExtoArts server and open a private ticket. Share your footage, niche, style references, and goals. We review it the same day and clarify anything we need before work starts.</p>
        </div>
        <div class="dpc-divider" aria-hidden="true"></div>
        <div class="dsc-proc-step" data-aos="fade-up" data-aos-delay="120">
            <span class="dpc-num" aria-hidden="true">02</span>
            <div class="dpc-icon" aria-hidden="true"><i class="ti ti-messages"></i></div>
            <h3 class="dpc-title">Real-Time Updates</h3>
            <p class="dpc-desc">Your private ticket is a direct line to your assigned editor. Ask questions, share feedback, and track progress - no platform switching, no extra tools required.</p>
        </div>
        <div class="dpc-divider" aria-hidden="true"></div>
        <div class="dsc-proc-step" data-aos="fade-up" data-aos-delay="240">
            <span class="dpc-num" aria-hidden="true">03</span>
            <div class="dpc-icon" aria-hidden="true"><i class="ti ti-circle-check"></i></div>
            <h3 class="dpc-title">Full-Res Delivery</h3>
            <p class="dpc-desc">Final video, thumbnail, or motion graphic delivered at full resolution through Discord. Download and post - no third-party file sharing or extra steps required.</p>
        </div>
    </div>
</section>

<style>
.editor-showcase{padding:min(120px,11vw) 0 min(140px,13vw);position:relative;overflow:hidden;}
.editor-showcase::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 65% 55% at 50% 5%,rgba(167,139,250,.04) 0%,transparent 60%),radial-gradient(ellipse 40% 55% at 10% 85%,rgba(139,92,246,.05) 0%,transparent 55%);pointer-events:none;}
.ew-wrap{max-width:1100px;margin:0 auto;padding:0 min(24px,5%);}
.ew-window{background:#09091a;border:1px solid rgba(255,255,255,.07);border-radius:16px;overflow:hidden;box-shadow:0 40px 100px rgba(0,0,0,.75),0 0 0 1px rgba(255,255,255,.04);margin-top:56px;user-select:none;}
/* Titlebar */
.ew-tb{display:flex;align-items:center;gap:10px;padding:11px 18px;background:#050510;border-bottom:1px solid rgba(255,255,255,.05);}
.ew-dots{display:flex;gap:6px;}
.ew-dot{width:12px;height:12px;border-radius:50%;}
.ew-dot-r{background:#ff5f57;} .ew-dot-y{background:#febc2e;} .ew-dot-g{background:#28c840;}
.ew-tb-file{font-size:.65rem;font-weight:700;letter-spacing:.8px;color:rgba(255,255,255,.3);font-family:monospace;margin-left:4px;}
.ew-tb-r{margin-left:auto;display:flex;align-items:center;gap:8px;}
.ew-status{display:flex;align-items:center;gap:5px;font-size:.6rem;font-weight:900;letter-spacing:1.5px;color:#22d3ee;text-transform:uppercase;}
.ew-status-dot{width:6px;height:6px;border-radius:50%;background:#22d3ee;animation:ewblink 1.4s ease-in-out infinite;}
@keyframes ewblink{0%,100%{opacity:1}50%{opacity:.25}}
.ew-badge-hdr{font-size:.58rem;font-weight:900;padding:3px 8px;background:rgba(34,211,238,.1);border:1px solid rgba(34,211,238,.28);color:#22d3ee;border-radius:4px;letter-spacing:1px;}
/* Main */
.ew-main{display:flex;height:300px;border-bottom:1px solid rgba(255,255,255,.05);}
/* Preview */
.ew-preview{flex:1;position:relative;overflow:hidden;cursor:col-resize;min-width:0;}
.ew-scene-raw{position:absolute;inset:0;background:linear-gradient(180deg,#26263d 0%,#1a1a2e 32%,#0d0d20 62%,#07070f 100%);}
.ew-scene-raw .ew-mtn{position:absolute;bottom:0;left:0;right:0;height:44%;background:#050510;clip-path:polygon(0% 70%,7% 42%,16% 58%,27% 32%,38% 52%,50% 26%,62% 46%,74% 20%,85% 38%,95% 28%,100% 34%,100% 100%,0% 100%);}
.ew-scene-raw .ew-noise{position:absolute;inset:0;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.07'/%3E%3C/svg%3E");opacity:.6;}
.ew-scene-cin{position:absolute;inset:0;background:linear-gradient(180deg,#07101e 0%,#0b2c50 16%,#0c4e7c 30%,#0e7cb8 40%,#f5a623 50%,#d97706 58%,#9a3a0a 72%,#1c0804 100%);}
.ew-scene-cin .ew-sun{position:absolute;width:80px;height:40px;background:radial-gradient(ellipse,rgba(251,191,36,.9) 0%,rgba(245,158,11,.5) 45%,transparent 70%);left:50%;top:43%;transform:translate(-50%,-50%);filter:blur(5px);}
.ew-scene-cin .ew-mtn{position:absolute;bottom:0;left:0;right:0;height:44%;background:#0d0402;clip-path:polygon(0% 70%,7% 42%,16% 58%,27% 32%,38% 52%,50% 26%,62% 46%,74% 20%,85% 38%,95% 28%,100% 34%,100% 100%,0% 100%);}
.ew-scene-cin .ew-refl{position:absolute;bottom:0;left:0;right:0;height:22%;background:linear-gradient(180deg,rgba(217,119,6,.12) 0%,rgba(249,115,22,.05) 100%);}
/* Divider */
.ew-div-line{position:absolute;top:0;bottom:0;width:2px;background:rgba(255,255,255,.9);z-index:5;transform:translateX(-50%);box-shadow:0 0 14px rgba(255,255,255,.4);pointer-events:none;}
.ew-div-handle{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:30px;height:30px;background:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.7rem;color:#111;box-shadow:0 2px 12px rgba(0,0,0,.4);pointer-events:all;cursor:col-resize;}
.ew-cin-half{position:absolute;top:0;bottom:0;left:0;overflow:hidden;}
.ew-lbl{position:absolute;top:10px;font-size:.52rem;font-weight:900;letter-spacing:2px;padding:3px 8px;border-radius:4px;z-index:4;text-transform:uppercase;}
.ew-lbl-raw{left:10px;background:rgba(0,0,0,.65);color:rgba(255,255,255,.55);border:1px solid rgba(255,255,255,.12);}
.ew-lbl-cin{right:10px;background:rgba(34,211,238,.12);color:#22d3ee;border:1px solid rgba(34,211,238,.35);}
.ew-pv-footer{position:absolute;bottom:0;left:0;right:0;padding:7px 12px;background:linear-gradient(0deg,rgba(0,0,0,.85) 0%,transparent 100%);display:flex;align-items:center;gap:7px;z-index:4;}
.ew-fx-pill{font-size:.52rem;font-weight:900;letter-spacing:1px;padding:3px 8px;background:rgba(217,119,6,.15);border:1px solid rgba(217,119,6,.4);border-radius:4px;color:#f59e0b;text-transform:uppercase;}
.ew-pv-info{font-size:.6rem;color:rgba(255,255,255,.55);}
.ew-pv-info strong{color:#fff;}
.ew-cin-tag{margin-left:auto;font-size:.52rem;font-weight:900;letter-spacing:1.5px;padding:3px 8px;background:rgba(34,211,238,.12);border:1px solid rgba(34,211,238,.35);border-radius:4px;color:#22d3ee;text-transform:uppercase;}
/* Right panel */
.ew-panel{width:250px;flex-shrink:0;border-left:1px solid rgba(255,255,255,.05);display:flex;flex-direction:column;background:#06060f;}
.ew-ptabs{display:flex;border-bottom:1px solid rgba(255,255,255,.05);}
.ew-ptab{flex:1;padding:9px 6px;font-size:.65rem;font-weight:700;color:rgba(255,255,255,.3);background:transparent;border:none;cursor:pointer;transition:.2s;border-bottom:2px solid transparent;}
.ew-ptab.active{color:#fff;background:rgba(255,255,255,.03);border-bottom-color:#22d3ee;}
.ew-tcont{display:none;flex:1;flex-direction:column;overflow:hidden;}
.ew-tcont.active{display:flex;}
/* Track list */
.ew-tlist{flex:1;padding:6px;}
.ew-ti{display:flex;align-items:center;gap:9px;padding:8px 9px;border-radius:8px;margin-bottom:3px;cursor:pointer;transition:.2s;border:1px solid transparent;}
.ew-ti:hover{background:rgba(34,211,238,.05);border-color:rgba(34,211,238,.15);}
.ew-ti.active{background:rgba(34,211,238,.09);border-color:rgba(34,211,238,.3);}
.ew-ti-ico{width:26px;height:26px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:.65rem;flex-shrink:0;}
.ewi-v{background:rgba(34,211,238,.12);color:#22d3ee;} .ewi-f{background:rgba(139,92,246,.12);color:#8b5cf6;} .ewi-a{background:rgba(217,119,6,.12);color:#f59e0b;}
.ew-ti-name{font-size:.65rem;font-weight:700;color:rgba(255,255,255,.82);line-height:1;}
.ew-ti-sub{font-size:.55rem;color:rgba(255,255,255,.32);margin-top:2px;}
/* Export */
.ew-export{padding:10px 10px;border-top:1px solid rgba(255,255,255,.05);}
.ew-exp-hd{display:flex;justify-content:space-between;margin-bottom:5px;}
.ew-exp-lbl{font-size:.58rem;color:rgba(255,255,255,.35);font-weight:700;text-transform:uppercase;letter-spacing:.5px;}
.ew-exp-val{font-size:.62rem;color:#22d3ee;font-weight:900;font-family:monospace;}
.ew-exp-bar{height:4px;background:rgba(255,255,255,.07);border-radius:2px;overflow:hidden;margin-bottom:6px;}
.ew-exp-fill{height:100%;width:100%;transform:scaleX(0.02);transform-origin:left;background:linear-gradient(90deg,#22d3ee,#7c3aed);border-radius:2px;transition:transform .25s;}
.ew-exp-desc{font-size:.56rem;color:rgba(255,255,255,.28);line-height:1.5;}
/* Color grade tab */
.ew-cg{padding:10px;}
.ew-wheels{display:flex;gap:8px;justify-content:center;margin-bottom:10px;}
.ew-whl{text-align:center;}
.ew-whl-c{width:50px;height:50px;border-radius:50%;border:2px solid rgba(255,255,255,.08);position:relative;overflow:hidden;}
.ew-whl-lift{background:radial-gradient(circle at 40% 60%,#1e3a5f,#0f172a);}
.ew-whl-gamma{background:radial-gradient(circle at 50% 45%,#0c4a6e,#1e3a5f,#0f172a);}
.ew-whl-gain{background:radial-gradient(circle at 60% 35%,#b45309,#7c2d12,#1c0905);}
.ew-whl-c::after{content:'';position:absolute;top:50%;left:50%;width:4px;height:4px;background:rgba(255,255,255,.75);border-radius:50%;transform:translate(-50%,-50%);}
.ew-whl-lbl{font-size:.5rem;color:rgba(255,255,255,.35);margin-top:3px;font-weight:700;letter-spacing:1px;text-transform:uppercase;}
.ew-sliders{display:flex;flex-direction:column;gap:5px;}
.ew-sl-row{display:flex;align-items:center;gap:6px;}
.ew-sl-lbl{font-size:.53rem;color:rgba(255,255,255,.35);width:50px;text-transform:uppercase;letter-spacing:.5px;}
.ew-sl-tr{flex:1;height:3px;background:rgba(255,255,255,.08);border-radius:2px;position:relative;}
.ew-sl-f{position:absolute;left:0;top:0;bottom:0;border-radius:2px;}
.ew-sl-t{background:#0ea5e9;} .ew-sl-o{background:#f59e0b;} .ew-sl-s{background:#22d3ee;} .ew-sl-c{background:#8b5cf6;}
.ew-sl-val{font-size:.53rem;color:rgba(255,255,255,.45);width:22px;text-align:right;font-family:monospace;}
/* Timeline */
.ew-timeline{background:#05050e;}
.ew-tl-ctrl{display:flex;align-items:center;gap:10px;padding:7px 14px;border-bottom:1px solid rgba(255,255,255,.04);}
.ew-playbtn{width:26px;height:26px;background:rgba(34,211,238,.1);border:1px solid rgba(34,211,238,.28);border-radius:6px;color:#22d3ee;font-size:.65rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:.2s;flex-shrink:0;}
.ew-playbtn:hover{background:rgba(34,211,238,.2);}
.ew-tc{font-size:.68rem;font-family:monospace;color:#22d3ee;letter-spacing:.5px;}
.ew-tl-info{margin-left:auto;font-size:.52rem;font-weight:700;letter-spacing:1px;color:rgba(255,255,255,.2);text-transform:uppercase;}
/* Ruler */
.ew-ruler{height:18px;background:#04040c;border-bottom:1px solid rgba(255,255,255,.04);display:flex;margin-left:46px;}
.ew-rmark{flex:1;border-left:1px solid rgba(255,255,255,.07);font-size:.42rem;color:rgba(255,255,255,.2);padding:2px 2px;font-family:monospace;white-space:nowrap;overflow:hidden;}
/* Tracks */
.ew-tracks-body{position:relative;}
.ew-tl-row{display:flex;height:34px;border-bottom:1px solid rgba(255,255,255,.04);}
.ew-tl-lbl{width:46px;display:flex;align-items:center;justify-content:center;font-size:.58rem;font-weight:900;color:rgba(255,255,255,.28);border-right:1px solid rgba(255,255,255,.05);flex-shrink:0;background:#04040c;}
.ew-tl-cnt{flex:1;position:relative;overflow:hidden;}
/* Clips */
.ew-clip{position:absolute;height:24px;top:5px;border-radius:5px;display:flex;align-items:center;padding:0 7px;font-size:.55rem;font-weight:700;cursor:pointer;transition:filter .2s,box-shadow .2s;overflow:hidden;white-space:nowrap;}
.ew-clip::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(90deg,transparent,transparent 7px,rgba(255,255,255,.03) 7px,rgba(255,255,255,.03) 8px);}
.ew-clip:hover{filter:brightness(1.25);}
.ew-clip.playing{filter:brightness(1.35);box-shadow:0 0 14px var(--cg);}
.evc-1{background:linear-gradient(90deg,rgba(34,211,238,.22),rgba(34,211,238,.12));border:1px solid rgba(34,211,238,.38);color:rgba(255,255,255,.88);--cg:rgba(34,211,238,.6);}
.evc-2{background:linear-gradient(90deg,rgba(99,102,241,.22),rgba(139,92,246,.16));border:1px solid rgba(99,102,241,.4);color:rgba(255,255,255,.85);--cg:rgba(99,102,241,.6);}
.evc-3{background:linear-gradient(90deg,rgba(139,92,246,.18),rgba(167,139,250,.12));border:1px solid rgba(139,92,246,.35);color:rgba(255,255,255,.7);--cg:rgba(139,92,246,.6);}
.evc-t{background:linear-gradient(90deg,rgba(217,119,6,.22),rgba(180,83,9,.14));border:1px solid rgba(217,119,6,.38);color:rgba(255,255,255,.7);--cg:rgba(217,119,6,.5);}
.evc-a{background:rgba(124,58,237,.1);border:1px solid rgba(124,58,237,.22);height:24px;--cg:rgba(124,58,237,.5);}
/* Playhead */
.ew-ph{position:absolute;top:0;bottom:0;width:2px;background:#22d3ee;z-index:10;pointer-events:none;box-shadow:0 0 8px rgba(34,211,238,.5);}
.ew-ph::before{content:'';position:absolute;top:-1px;left:50%;transform:translateX(-50%);border-left:5px solid transparent;border-right:5px solid transparent;border-top:7px solid #22d3ee;}
/* Responsive */
/* === Tablet ≤ 860px: stack panel below preview === */
@media(max-width:860px){
    .ew-main{flex-direction:column;height:auto;}
    .ew-preview{height:268px;flex-shrink:0;}
    .ew-panel{width:100%;height:auto;border-left:none;border-top:1px solid rgba(255,255,255,.04);}
    .ew-tlist{display:flex;flex-direction:row;overflow-x:auto;gap:6px;padding:8px;scrollbar-width:none;}
    .ew-tlist::-webkit-scrollbar{display:none;}
    .ew-ti{min-width:130px;flex-shrink:0;margin-bottom:0;}
    .ew-export{display:none;}
    .ew-cg{display:grid;grid-template-columns:auto 1fr;gap:10px;align-items:center;padding:8px 10px;}
    .ew-wheels{margin-bottom:0;}
    .ew-sliders{gap:4px;}
    .ew-tcont{max-height:88px;overflow:hidden;}
    .ew-ptab{font-size:.62rem;padding:8px 6px;}
}
/* === Mobile ≤ 580px: compact === */
@media(max-width:580px){
    .ew-preview{height:240px;cursor:default;}
    .ew-div-handle{width:44px;height:44px;font-size:.9rem;box-shadow:0 0 0 6px rgba(255,255,255,.08),0 2px 12px rgba(0,0,0,.5);}
    .ew-tl-row{height:28px;}
    .ew-clip{height:18px;font-size:.46rem;top:5px;}
    .ew-ti{min-width:115px;}
    .ew-whl-c{width:40px;height:40px;}
    .ew-wheels{gap:8px;}
    .ew-tb-file{max-width:110px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
    .ew-tl-info{display:none;}
    .ew-ruler{margin-left:40px;}
    .ew-tl-lbl{width:40px;font-size:.52rem;}
    .ew-tc{font-size:.62rem;}
    .editor-showcase{padding:72px 0 88px;}
    .ew-lbl{font-size:.5rem;padding:2px 7px;}
    .ew-pv-footer{padding:6px 10px;}
    .ew-pv-info{display:none;}
}
/* === Mobile ≤ 420px: ultra-compact === */
@media(max-width:420px){
    .ew-preview{height:210px;}
    .ew-strip{gap:4px;}
    .ew-sthumb{width:64px;height:36px;}
    .ew-ptab{font-size:.6rem;padding:7px 4px;}
    .ew-tlist{gap:4px;padding:6px;}
    .ew-ti{min-width:100px;padding:7px 8px;}
}
/* === Drag hint overlay === */
.ew-drag-hint{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:20;opacity:0;transition:opacity .45s;}
.ew-drag-hint.ew-hint-on{opacity:1;}
.ew-drag-pill{background:rgba(0,0,0,.72);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.14);border-radius:24px;padding:7px 16px;font-size:.62rem;font-weight:800;color:rgba(255,255,255,.65);letter-spacing:.5px;display:flex;align-items:center;gap:6px;}
/* Thumbnail strip */
.ew-strip{display:flex;gap:7px;justify-content:center;margin:28px auto 0;max-width:700px;}
.ew-sthumb{width:118px;height:66px;object-fit:cover;border-radius:7px;border:2px solid transparent;opacity:.5;cursor:pointer;transition:opacity .2s,border-color .2s,transform .18s;flex-shrink:0;}
.ew-sthumb:hover{opacity:.82;transform:scale(1.06);}
.ew-sthumb.active{opacity:1;border-color:rgba(34,211,238,.55);box-shadow:0 0 16px rgba(34,211,238,.22);}
.ew-strip-hint{text-align:center;font-size:.58rem;color:rgba(255,255,255,.2);margin-top:7px;letter-spacing:.8px;text-transform:uppercase;font-weight:700;}
@media(max-width:640px){.ew-sth-hide{display:none;}.ew-sthumb{width:75px;height:42px;}.ew-strip{gap:5px;}}
/* Trustpilot trust section */
.tp-section{padding:clamp(48px,6vw,72px) min(24px,5%) clamp(40px,5vw,60px);text-align:center;}
.tp-section-label{font-size:.65rem;font-weight:800;letter-spacing:2.5px;text-transform:uppercase;color:var(--text-muted);margin:0 0 18px;}
.tp-trust-wrap{display:flex;align-items:center;flex-wrap:wrap;gap:12px;justify-content:center;padding:16px 24px;background:rgba(0,182,122,.04);border:1px solid rgba(0,182,122,.15);border-radius:14px;margin:0 auto 32px;max-width:680px;}
.tp-brand-row{display:flex;align-items:center;gap:7px;text-decoration:none;}
.tp-star-logo{width:22px;height:21px;flex-shrink:0;}
.tp-wordmark{font-size:.78rem;font-weight:900;color:#fff;letter-spacing:.4px;}
.tp-vsep{width:1px;height:20px;background:rgba(255,255,255,.12);}
.tp-stars-row{display:flex;align-items:center;gap:2px;}
.tp-sf{display:inline-block;width:17px;height:17px;background:#00b67a;clip-path:polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);}
.tp-excellent{font-size:.7rem;font-weight:900;color:#00b67a;margin-left:5px;letter-spacing:.3px;}
.tp-read-btn,.tp-write-btn{font-size:.63rem;font-weight:800;padding:6px 13px;border-radius:7px;text-decoration:none;letter-spacing:.4px;transition:background .2s,color .2s;white-space:nowrap;}
.tp-read-btn{background:rgba(0,182,122,.12);color:#00b67a;border:1px solid rgba(0,182,122,.3);}
.tp-read-btn:hover{background:rgba(0,182,122,.22);}
.tp-write-btn{background:rgba(255,255,255,.04);color:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.1);}
.tp-write-btn:hover{background:rgba(0,182,122,.12);color:#00b67a;border-color:rgba(0,182,122,.25);}
.tp-box-wrap{max-width:720px;margin:0 auto;}
[data-theme="light"] .tp-trust-wrap{background:rgba(0,182,122,.05);border-color:rgba(0,182,122,.2);}
[data-theme="light"] .tp-wordmark{color:#1a1a1a;}
@media(max-width:580px){.tp-vsep{display:none;}.tp-trust-wrap{gap:9px;padding:12px 14px;}}
/* Custom Trustpilot widget — lightweight no-script replacement */
.hp-trustpilot{background:rgba(0,182,122,.07);color:#00b67a;border-color:rgba(0,182,122,.3);}
.hp-trustpilot:hover{background:rgba(0,182,122,.15);}
[data-theme="light"] .hp-trustpilot{background:rgba(0,150,100,.08);color:#007a4d;border-color:rgba(0,150,100,.3);}
.tp-custom-widget{display:flex;align-items:center;gap:8px;justify-content:center;flex-wrap:wrap;padding:12px 20px;background:rgba(0,182,122,.04);border:1px solid rgba(0,182,122,.15);border-radius:10px;}
.tp-cw-stars{display:flex;align-items:center;gap:2px;}
.tp-sf-half{background:linear-gradient(90deg,#00b67a 50%,rgba(255,255,255,.15) 50%);}
.tp-cw-score{font-size:.9rem;font-weight:900;color:#00b67a;line-height:1;}
.tp-cw-label{font-size:.65rem;color:var(--text-muted);font-weight:600;}
.tp-cw-sep{color:var(--border);font-size:.8rem;}
.tp-cw-link{display:inline-flex;align-items:center;gap:4px;font-size:.63rem;font-weight:800;color:#00b67a;text-decoration:none;padding:4px 10px;border-radius:6px;border:1px solid rgba(0,182,122,.3);background:rgba(0,182,122,.08);transition:background .18s;}
.tp-cw-link:hover{background:rgba(0,182,122,.18);}
[data-theme="light"] .tp-custom-widget{background:rgba(0,182,122,.05);border-color:rgba(0,182,122,.2);}
</style>

<section class="editor-showcase">
    <div class="ew-wrap">
        <h2 class="sec-title" data-aos="fade-up" style="max-width:680px;margin-left:auto;margin-right:auto;">Watch a Project Get <span class="sweep-text">Edited Live</span></h2>
        <p class="sec-sub" data-aos="fade-up" style="max-width:540px;margin-left:auto;margin-right:auto;">This is what your project looks like from our end. Drag the divider to compare raw vs cinematic, click clips, or hit play to see the timeline run.</p>

        <!-- Clickable portfolio thumbnails - changes the editor preview -->
        <div class="ew-strip" data-aos="fade-up">
            <img src="https://iili.io/BZlxEqN.jpg" alt="Minecraft thumbnail" class="ew-sthumb active" data-idx="0" width="160" height="90" loading="lazy" decoding="async">
            <img src="https://iili.io/BZlx207.webp" alt="PUBG thumbnail" class="ew-sthumb" data-idx="1" width="160" height="90" loading="lazy" decoding="async">
            <img src="https://iili.io/BZlxRdF.jpg" alt="Roblox thumbnail" class="ew-sthumb" data-idx="2" width="160" height="90" loading="lazy" decoding="async">
            <img src="https://iili.io/BZlxdfS.webp" alt="Free Fire thumbnail" class="ew-sthumb" data-idx="3" width="160" height="90" loading="lazy" decoding="async">
            <img src="https://iili.io/BZlo4xR.webp" alt="Realistic design" class="ew-sthumb ew-sth-hide" data-idx="4" width="160" height="90" loading="lazy" decoding="async">
        </div>
        <p class="ew-strip-hint">Click a thumbnail above to load it into the preview</p>

        <div class="ew-window" data-aos="fade-up" data-aos-delay="100">
            <!-- Titlebar -->
            <div class="ew-tb">
                <div class="ew-dots">
                    <div class="ew-dot ew-dot-r"></div>
                    <div class="ew-dot ew-dot-y"></div>
                    <div class="ew-dot ew-dot-g"></div>
                </div>
                <span class="ew-tb-file">CREATOR_PROJECT_FINAL_4K.prj</span>
                <div class="ew-tb-r">
                    <div class="ew-status"><div class="ew-status-dot"></div> EDITING</div>
                    <span class="ew-badge-hdr">4K HDR</span>
                </div>
            </div>

            <!-- Main -->
            <div class="ew-main">
                <!-- Before/After preview -->
                <div class="ew-preview" id="ewPv">
                    <!-- Mobile/tablet drag hint overlay -->
                    <div class="ew-drag-hint" id="ewDragHint" aria-hidden="true">
                        <div class="ew-drag-pill"><span style="font-size:.8rem;">&#8644;</span> Drag to compare</div>
                    </div>
                    <!-- RAW: real portfolio image with flat/ungraded filter -->
                    <div style="position:absolute;inset:0;overflow:hidden;">
                        <img id="ewRawImg" src="https://iili.io/BZlxEqN.jpg" alt="" aria-hidden="true" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:grayscale(.6) contrast(.82) brightness(.9) saturate(.35);transition:opacity .5s;">
                        <div style="position:absolute;inset:0;background:rgba(15,12,30,.3);pointer-events:none;"></div>
                    </div>
                    <!-- CINEMATIC: same image with color grade filter + teal-orange overlay -->
                    <div id="ewCin" style="position:absolute;inset:0;clip-path:inset(0 50% 0 0);overflow:hidden;">
                        <img id="ewCinImg" src="https://iili.io/BZlxEqN.jpg" alt="" aria-hidden="true" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(1.55) contrast(1.14) brightness(1.03);transition:opacity .5s;">
                        <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(14,165,233,.1) 0%,transparent 45%,rgba(245,158,11,.09) 100%);pointer-events:none;mix-blend-mode:screen;"></div>
                    </div>
                    <!-- Labels -->
                    <span class="ew-lbl ew-lbl-raw">RAW FOOTAGE</span>
                    <span class="ew-lbl ew-lbl-cin">CINEMATIC EDIT</span>
                    <!-- Divider -->
                    <div class="ew-div-line" id="ewDvd" style="left:50%;pointer-events:all;cursor:col-resize;">
                        <div class="ew-div-handle">&#8644;</div>
                    </div>
                    <!-- Footer -->
                    <div class="ew-pv-footer">
                        <span class="ew-fx-pill"><i class="ti ti-wand" style="margin-right:3px;"></i> LUT</span>
                        <span class="ew-pv-info"><strong>Color Grading</strong> &nbsp;Applying cinematic Teal &amp; Orange LUT</span>
                        <span class="ew-cin-tag">CINEMATIC 4K</span>
                    </div>
                </div>

                <!-- Right panel -->
                <div class="ew-panel">
                    <div class="ew-ptabs">
                        <button class="ew-ptab active" data-ew-tab="tracks">Tracks</button>
                        <button class="ew-ptab" data-ew-tab="cgrade">Color Grade</button>
                    </div>

                    <!-- Tracks tab -->
                    <div class="ew-tcont active" id="ewTabTracks">
                        <div class="ew-tlist">
                            <div class="ew-ti active" data-ew-clip="c1">
                                <div class="ew-ti-ico ewi-v"><i class="ti ti-movie"></i></div>
                                <div><div class="ew-ti-name">V1: YouTube Intro</div><div class="ew-ti-sub">High Retention Hook</div></div>
                            </div>
                            <div class="ew-ti" data-ew-clip="t1">
                                <div class="ew-ti-ico ewi-f"><i class="ti ti-stack"></i></div>
                                <div><div class="ew-ti-name">FX: Motion Graphics</div><div class="ew-ti-sub">Smooth Transitions</div></div>
                            </div>
                            <div class="ew-ti" data-ew-clip="a1">
                                <div class="ew-ti-ico ewi-a"><i class="ti ti-music"></i></div>
                                <div><div class="ew-ti-name">A1: Beat Sync Overlay</div><div class="ew-ti-sub">Audio EQ &amp; Effects</div></div>
                            </div>
                        </div>
                        <div class="ew-export">
                            <div class="ew-exp-hd"><span class="ew-exp-lbl">Export Est.</span><span class="ew-exp-val">2.4s</span></div>
                            <div class="ew-exp-bar"><div class="ew-exp-fill" id="ewExpFill"></div></div>
                            <p class="ew-exp-desc">ExtoArts editors use cloud-optimized workflows to deliver cinematic projects within hours.</p>
                        </div>
                    </div>

                    <!-- Color Grade tab -->
                    <div class="ew-tcont" id="ewTabCgrade">
                        <div class="ew-cg">
                            <div class="ew-wheels">
                                <div class="ew-whl"><div class="ew-whl-c ew-whl-lift"></div><div class="ew-whl-lbl">Lift</div></div>
                                <div class="ew-whl"><div class="ew-whl-c ew-whl-gamma"></div><div class="ew-whl-lbl">Gamma</div></div>
                                <div class="ew-whl"><div class="ew-whl-c ew-whl-gain"></div><div class="ew-whl-lbl">Gain</div></div>
                            </div>
                            <div class="ew-sliders">
                                <div class="ew-sl-row"><span class="ew-sl-lbl">Teal</span><div class="ew-sl-tr"><div class="ew-sl-f ew-sl-t" style="width:62%;"></div></div><span class="ew-sl-val">+62</span></div>
                                <div class="ew-sl-row"><span class="ew-sl-lbl">Orange</span><div class="ew-sl-tr"><div class="ew-sl-f ew-sl-o" style="width:74%;"></div></div><span class="ew-sl-val">+74</span></div>
                                <div class="ew-sl-row"><span class="ew-sl-lbl">Sat</span><div class="ew-sl-tr"><div class="ew-sl-f ew-sl-s" style="width:48%;"></div></div><span class="ew-sl-val">+48</span></div>
                                <div class="ew-sl-row"><span class="ew-sl-lbl">Contrast</span><div class="ew-sl-tr"><div class="ew-sl-f ew-sl-c" style="width:55%;"></div></div><span class="ew-sl-val">+55</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Timeline -->
            <div class="ew-timeline">
                <div class="ew-tl-ctrl">
                    <button class="ew-playbtn" id="ewPlayBtn" title="Play / Pause"><i class="ti ti-player-play-filled" id="ewPlayIco"></i></button>
                    <span class="ew-tc" id="ewTc">00:00:00:00</span>
                    <span class="ew-tl-info">ExtoArts Studio &nbsp;|&nbsp; 4K@60fps</span>
                </div>
                <div class="ew-ruler" id="ewRuler"></div>
                <div class="ew-tracks-body" id="ewTracks">
                    <div class="ew-tl-row">
                        <div class="ew-tl-lbl">V1</div>
                        <div class="ew-tl-cnt" id="ewTrV1">
                            <div class="ew-clip evc-1" style="left:2%;width:29%;" data-es="0.02" data-ee="0.31" id="ewC1">Intro Hook</div>
                            <div class="ew-clip evc-2" style="left:33%;width:40%;" data-es="0.33" data-ee="0.73" id="ewC2">Main Content</div>
                            <div class="ew-clip evc-3" style="left:75%;width:21%;" data-es="0.75" data-ee="0.96" id="ewC3">Outro Slow</div>
                        </div>
                    </div>
                    <div class="ew-tl-row">
                        <div class="ew-tl-lbl">T1</div>
                        <div class="ew-tl-cnt" id="ewTrT1">
                            <div class="ew-clip evc-t" style="left:2%;width:71%;" data-es="0.02" data-ee="0.73" id="ewCT">Cinematic LUT Layer</div>
                        </div>
                    </div>
                    <div class="ew-tl-row">
                        <div class="ew-tl-lbl">A1</div>
                        <div class="ew-tl-cnt" id="ewTrA1">
                            <div class="ew-clip evc-a" style="left:2%;width:95%;padding:0;" data-es="0.02" data-ee="0.97" id="ewCA">
                                <svg id="ewWv" style="width:100%;height:24px;display:block;" viewBox="0 0 500 24" preserveAspectRatio="none"></svg>
                            </div>
                        </div>
                    </div>
                    <!-- Playhead (spans all rows) -->
                    <div class="ew-ph" id="ewPh" style="left:2%;"></div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- ── Trustpilot Trust Section ─────────────────────────────────────── -->
<section class="tp-section">
    <p class="tp-section-label">Verified Reviews</p>

    <!-- Static branded badge — always visible regardless of review count -->
    <div class="tp-trust-wrap" data-aos="fade-up">
        <a href="https://www.trustpilot.com/review/extoarts.in" target="_blank" rel="noopener noreferrer" class="tp-brand-row" aria-label="ExtoArts on Trustpilot">
            <!-- Trustpilot TP star logo -->
            <svg class="tp-star-logo" viewBox="0 0 111 105" aria-hidden="true" fill="none">
                <path d="M55.5 0L68.02 40.6H111L76.99 65.7L89.51 106.3L55.5 81.2L21.49 106.3L34.01 65.7L0 40.6H42.98L55.5 0Z" fill="#00b67a"/>
            </svg>
            <span class="tp-wordmark">Trustpilot</span>
        </a>
        <div class="tp-vsep" aria-hidden="true"></div>
        <div class="tp-stars-row" aria-label="5 star rating">
            <span class="tp-sf" aria-hidden="true"></span>
            <span class="tp-sf" aria-hidden="true"></span>
            <span class="tp-sf" aria-hidden="true"></span>
            <span class="tp-sf" aria-hidden="true"></span>
            <span class="tp-sf" aria-hidden="true"></span>
            <span class="tp-excellent">Excellent</span>
        </div>
        <div class="tp-vsep" aria-hidden="true"></div>
        <a href="https://www.trustpilot.com/review/extoarts.in" target="_blank" rel="noopener noreferrer" class="tp-read-btn">Read our reviews</a>
        <a href="https://www.trustpilot.com/evaluate/extoarts.in" target="_blank" rel="noopener noreferrer" class="tp-write-btn">Leave a review</a>
    </div>

    <!-- Custom Trustpilot rating display — lightweight, no external scripts -->
    <div class="tp-box-wrap" data-aos="fade-up" data-aos-delay="80">
        <div class="tp-custom-widget">
            <div class="tp-cw-stars" role="img" aria-label="4.5 out of 5 stars">
                <span class="tp-sf" aria-hidden="true"></span>
                <span class="tp-sf" aria-hidden="true"></span>
                <span class="tp-sf" aria-hidden="true"></span>
                <span class="tp-sf" aria-hidden="true"></span>
                <span class="tp-sf tp-sf-half" aria-hidden="true"></span>
            </div>
            <span class="tp-cw-score">4.5</span>
            <span class="tp-cw-label">out of 5</span>
            <span class="tp-cw-sep" aria-hidden="true">|</span>
            <a href="https://www.trustpilot.com/review/extoarts.in" target="_blank" rel="noopener noreferrer" class="tp-cw-link">
                <svg width="13" height="13" viewBox="0 0 111 105" fill="none" aria-hidden="true"><path d="M55.5 0L68.02 40.6H111L76.99 65.7L89.51 106.3L55.5 81.2L21.49 106.3L34.01 65.7L0 40.6H42.98L55.5 0Z" fill="#00b67a"/></svg>
                Read reviews on Trustpilot
            </a>
        </div>
    </div>
</section>

<script>
(function(){
'use strict';
/* ---- Waveform ---- */
var wv=document.getElementById('ewWv');
if(wv){
    var bars='',p=0.5;
    for(var i=0;i<100;i++){
        p=Math.max(0.08,Math.min(0.92,p+(Math.random()-0.48)*0.22));
        var x=(i/100)*496+2,h=p*20,y=(24-h)/2;
        bars+='<line x1="'+x+'" y1="'+y+'" x2="'+x+'" y2="'+(y+h)+'" stroke="#7c3aed" stroke-width="3.2" stroke-linecap="round" opacity="'+(0.4+p*0.55)+'"/>';
    }
    wv.innerHTML=bars;
}
/* ---- Ruler ---- */
var ruler=document.getElementById('ewRuler');
if(ruler){for(var r=0;r<10;r++){var m=document.createElement('div');m.className='ew-rmark';m.textContent='00:0'+(r*6)+':00';ruler.appendChild(m);}}
/* ---- Before/After Divider ---- */
var pv=document.getElementById('ewPv'),dvd=document.getElementById('ewDvd'),cin=document.getElementById('ewCin');
var dragging=false;
function setDiv(cx){
    if(!pv||!dvd||!cin)return;
    var r=pv.getBoundingClientRect(),pct=Math.max(5,Math.min(95,((cx-r.left)/r.width)*100));
    dvd.style.left=pct+'%';cin.style.clipPath='inset(0 '+(100-pct)+'% 0 0)';
}
dvd.addEventListener('mousedown',function(e){dragging=true;e.preventDefault();e.stopPropagation();});
pv.addEventListener('mousedown',function(e){dragging=true;setDiv(e.clientX);});
document.addEventListener('mousemove',function(e){if(dragging)setDiv(e.clientX);});
document.addEventListener('mouseup',function(){dragging=false;});
dvd.addEventListener('touchstart',function(e){dragging=true;e.preventDefault();},{passive:false});
/* Non-passive touchmove on the handle so we can preventDefault() and block page scroll while dragging */
dvd.addEventListener('touchmove',function(e){if(e.touches[0]){e.preventDefault();setDiv(e.touches[0].clientX);}},{passive:false});
pv.addEventListener('touchstart',function(e){if(e.touches[0]){dragging=true;setDiv(e.touches[0].clientX);}},{passive:true});
document.addEventListener('touchmove',function(e){if(dragging&&e.touches[0])setDiv(e.touches[0].clientX);},{passive:true});
document.addEventListener('touchend',function(){dragging=false;});
/* ---- Tab switching ---- */
document.querySelectorAll('.ew-ptab').forEach(function(btn){
    btn.addEventListener('click',function(){
        document.querySelectorAll('.ew-ptab').forEach(function(b){b.classList.remove('active');});
        document.querySelectorAll('.ew-tcont').forEach(function(c){c.classList.remove('active');});
        btn.classList.add('active');
        var t=btn.dataset.ewTab;
        var el=document.getElementById('ewTab'+t.charAt(0).toUpperCase()+t.slice(1));
        if(el)el.classList.add('active');
    });
});
/* ---- Playhead + animation ---- */
var ph=document.getElementById('ewPh'),tc=document.getElementById('ewTc'),
    playBtn=document.getElementById('ewPlayBtn'),playIco=document.getElementById('ewPlayIco'),
    expFill=document.getElementById('ewExpFill');
/* ---- Portfolio image cycling ---- */
var ewImgs=[
    {url:'https://iili.io/BZlxEqN.jpg',lbl:'MINECRAFT_EDIT_4K.prj'},
    {url:'https://iili.io/BZlx207.webp',lbl:'PUBG_GAMEPLAY_4K.prj'},
    {url:'https://iili.io/BZlxRdF.jpg',lbl:'ROBLOX_THUMBNAIL_4K.prj'},
    {url:'https://iili.io/BZlxdfS.webp',lbl:'FREE_FIRE_ACTION_4K.prj'},
    {url:'https://iili.io/BZlo4xR.webp',lbl:'REALISTIC_DESIGN_4K.prj'}
];
var ewActiveImg=0;
var ewRawImg=document.getElementById('ewRawImg');
var ewCinImg=document.getElementById('ewCinImg');
var ewTbFile=document.querySelector('.ew-tb-file');
function ewSetImg(idx){
    ewActiveImg=idx;
    var img=ewImgs[idx];
    if(ewRawImg)ewRawImg.src=img.url;
    if(ewCinImg)ewCinImg.src=img.url;
    if(ewTbFile)ewTbFile.textContent=img.lbl;
    document.querySelectorAll('.ew-sthumb').forEach(function(el,i){el.classList.toggle('active',i===idx);});
}
document.querySelectorAll('.ew-sthumb').forEach(function(el,i){el.addEventListener('click',function(){ewSetImg(i);});});
var playing=false,pos=0.02,last=null,dur=15;
var clips=[
    {id:'ewC1',s:0.02,e:0.31},{id:'ewC2',s:0.33,e:0.73},{id:'ewC3',s:0.75,e:0.96},
    {id:'ewCT',s:0.02,e:0.73},{id:'ewCA',s:0.02,e:0.97}
];
var tiItems=document.querySelectorAll('.ew-ti[data-ew-clip]');
function fmt(t){
    var s=t*dur,m=Math.floor(s/60),sc=Math.floor(s%60),f=Math.floor((s%1)*24);
    return '00:'+('0'+m).slice(-2)+':'+('0'+sc).slice(-2)+':'+('0'+f).slice(-2);
}
function tick(pos){
    if(ph)ph.style.left=(pos*96+2)+'%';
    if(tc)tc.textContent=fmt(pos);
    if(expFill)expFill.style.transform='scaleX('+pos+')';
    clips.forEach(function(c){
        var el=document.getElementById(c.id);
        if(el)el.classList.toggle('playing',pos>=c.s&&pos<=c.e);
    });
    tiItems.forEach(function(ti){
        var c=ti.dataset.ewClip;
        var active=(c==='c1'&&pos>=0.02&&pos<=0.31)||(c==='t1'&&pos>=0.33&&pos<=0.73)||(c==='a1'&&pos>=0.75);
        ti.classList.toggle('active',active);
    });
}
function loop(ts){
    if(!playing)return;
    if(!last)last=ts;
    pos+=(ts-last)/1000/dur;
    last=ts;
    if(pos>1){pos=0;ewActiveImg=(ewActiveImg+1)%ewImgs.length;ewSetImg(ewActiveImg);}
    tick(pos);
    requestAnimationFrame(loop);
}
playBtn.addEventListener('click',function(){
    playing=!playing;
    playIco.className=playing?'ti ti-player-pause-filled':'ti ti-player-play-filled';
    if(playing){last=null;requestAnimationFrame(loop);}
});
/* Click to seek on timeline */
var tracksEl=document.getElementById('ewTracks');
if(tracksEl){
    tracksEl.addEventListener('click',function(e){
        var r=tracksEl.getBoundingClientRect();
        var x=e.clientX-r.left-46;
        var w=r.width-46;
        pos=Math.max(0,Math.min(1,x/w));
        tick(pos);
    });
}
/* Track item clicks */
tiItems.forEach(function(ti){
    ti.addEventListener('click',function(){
        tiItems.forEach(function(i){i.classList.remove('active');});
        ti.classList.add('active');
    });
});
tick(pos);

/* ---- IntersectionObserver: auto-play when visible, pause when scrolled away ---- */
var ewSection=document.querySelector('.editor-showcase');
var ewInView=false, ewHintPlayed=false;
var ewHintEl=document.getElementById('ewDragHint');

function ewRunHint(){
    if(ewHintPlayed||dragging)return;
    ewHintPlayed=true;
    /* 1. Show the hint pill */
    if(ewHintEl)ewHintEl.classList.add('ew-hint-on');
    /* 2. Animated sine-wave sweep of the divider */
    var startTs=null,hintDur=2600;
    function ha(ts){
        if(!startTs)startTs=ts;
        var t=(ts-startTs)/hintDur;
        if(t>=1){
            if(!dragging)setDiv(pv.getBoundingClientRect().left+pv.getBoundingClientRect().width*.5);
            if(ewHintEl)ewHintEl.classList.remove('ew-hint-on');
            return;
        }
        var pct=.5+Math.sin(t*Math.PI*2)*.24;
        var r=pv.getBoundingClientRect();
        if(!dragging)setDiv(r.left+r.width*pct);
        requestAnimationFrame(ha);
    }
    setTimeout(function(){requestAnimationFrame(ha);},380);
    /* 3. Fade hint pill out after sweep */
    setTimeout(function(){if(ewHintEl)ewHintEl.classList.remove('ew-hint-on');},3200);
}

if(ewSection&&'IntersectionObserver' in window){
    var ewObs=new IntersectionObserver(function(entries){
        entries.forEach(function(e){
            if(e.isIntersecting&&!ewInView){
                ewInView=true;
                if(!playing){playing=true;last=null;if(playIco)playIco.className='ti ti-player-pause-filled';requestAnimationFrame(loop);}
                ewRunHint();
            } else if(!e.isIntersecting&&ewInView){
                ewInView=false;
                playing=false;
                if(playIco)playIco.className='ti ti-player-play-filled';
            }
        });
    },{threshold:0.28});
    ewObs.observe(ewSection);
} else {
    /* Fallback for browsers without IntersectionObserver */
    setTimeout(function(){playing=true;if(playIco)playIco.className='ti ti-player-pause-filled';last=null;requestAnimationFrame(loop);},1200);
}

/* ---- Space bar = play / pause (only when editor is in view) ---- */
document.addEventListener('keydown',function(e){
    if(e.code!=='Space')return;
    var ae=document.activeElement;
    if(ae&&(ae.tagName==='INPUT'||ae.tagName==='TEXTAREA'||ae.isContentEditable))return;
    if(!ewSection)return;
    var r=ewSection.getBoundingClientRect();
    if(r.top<window.innerHeight&&r.bottom>0){
        e.preventDefault();
        playing=!playing;
        if(playing){last=null;requestAnimationFrame(loop);}
        if(playIco)playIco.className=playing?'ti ti-player-pause-filled':'ti ti-player-play-filled';
    }
});

/* ---- Click a clip block to seek playhead to its start and auto-play ---- */
document.querySelectorAll('.ew-clip').forEach(function(clip){
    clip.addEventListener('click',function(ev){
        ev.stopPropagation();
        var s=parseFloat(clip.dataset.es||0);
        pos=s; tick(pos);
        if(!playing){playing=true;last=null;requestAnimationFrame(loop);if(playIco)playIco.className='ti ti-player-pause-filled';}
    });
});
})();
</script>

<section class="founder-section">
    <h2 class="sec-title sweep-text" data-aos="fade-up" style="margin-bottom: 40px;">Who Started This</h2>
    
    <div class="founder-card-inline">
        <img src="https://iili.io/BZ0qsef.jpg" alt="Rehan, Founder of ExtoArts Video Editing Agency" class="founder-img-inline" width="120" height="120" loading="lazy" decoding="async" data-aos="fade-right">
        <div class="founder-info-inline" data-aos="fade-left" data-aos-delay="80">
            <h3>Rehan <span>(Sigma)</span></h3>
            <p class="title">Founder & Creative Director</p>
            <p class="desc">Started ExtoArts because he got tired of watching creators pay premium prices for mediocre edits. Now he runs a global network of vetted editors who genuinely care about the quality of every project they touch.</p>
            <button class="btn btn-glass" onclick="openModal('discordModal')">
                <i class="ti ti-brand-discord" style="font-size: 1.1rem; color: #5865f2;"></i> Say Hello
            </button>
        </div>
    </div>
</section>


<div id="reviewModal" class="modal review-modal" aria-hidden="true">
    <div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="reviewModalName">
        <div class="review-modal-card">
            <button class="review-modal-close" type="button" aria-label="Close review" data-review-close>
                <i class="ti ti-x"></i>
            </button>
            <div class="review-modal-head">
                <div class="review-modal-avatar">
                    <div class="review-modal-avatar-inner" id="reviewModalAvatar"></div>
                </div>
                <div>
                    <div class="review-modal-name" id="reviewModalName">Client Review</div>
                    <div class="review-modal-proof">
                        <span role="img" aria-label="5 out of 5 stars"><i class="ti ti-star-filled" aria-hidden="true"></i><i class="ti ti-star-filled" aria-hidden="true"></i><i class="ti ti-star-filled" aria-hidden="true"></i><i class="ti ti-star-filled" aria-hidden="true"></i><i class="ti ti-star-filled" aria-hidden="true"></i></span>
                        <span><i class="ti ti-brand-discord"></i> <strong id="reviewModalCount">0</strong> verified reactions</span>
                    </div>
                    <div class="review-modal-meta" id="reviewModalMeta" style="display:none; margin-top:7px; display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
                        <span class="rev-type-pill" id="reviewModalType" style="font-size:0.6rem;"></span>
                        <span class="rev-date" id="reviewModalDate" style="font-size:0.6rem; color:rgba(255,255,255,0.35);"><i class="ti ti-calendar-event"></i> <span id="reviewModalDateVal"></span></span>
                    </div>
                </div>
            </div>
            <p class="review-modal-text" id="reviewModalText"></p>
            <div class="review-modal-action">
                <button class="btn btn-main" type="button" onclick="openModal('discordModal'); closeReviewModal();">
                    <i class="ti ti-brand-discord"></i> Start Like This
                </button>
            </div>
        </div>
    </div>
</div>

<style>
.reel-section { padding: 100px 0 80px; }
.reel-header { max-width: 1200px; margin: 0 auto 48px; padding: 0 5%; display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; flex-wrap: wrap; }
.reel-header h2 { margin: 8px 0 0; }
.reel-track { display: flex; gap: 16px; overflow-x: auto; padding: 0 5% 20px; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
.reel-track::-webkit-scrollbar { display: none; }
.reel-card { flex: 0 0 320px; height: 200px; border-radius: 20px; overflow: hidden; position: relative; cursor: pointer; scroll-snap-align: start; border: 1px solid var(--border); background: var(--surface); }
@media (max-width: 600px) { .reel-card { flex: 0 0 82vw; height: 175px; } }
.reel-card img, .reel-card video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: opacity 0.4s; }
.reel-card video { opacity: 0; z-index: 2; }
.reel-card.playing video { opacity: 1; }
.reel-card.playing img { opacity: 0; }
.reel-play { position: absolute; inset: 0; z-index: 3; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.35); transition: opacity 0.3s; }
.reel-play i { font-size: 2rem; color: #fff; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.5)); transition: transform 0.2s; }
.reel-card.playing .reel-play { opacity: 0; pointer-events: none; }
@media (hover: hover) and (pointer: fine) { .reel-card:hover .reel-play i { transform: scale(1.15); } }
.reel-tag { position: absolute; bottom: 12px; left: 14px; z-index: 4; background: rgba(0,0,0,0.62); backdrop-filter: blur(8px); color: #fff; font-size: 0.68rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 4px 10px; border-radius: 30px; border: 1px solid rgba(255,255,255,0.12); }
.thumb-strip { max-width: 1200px; margin: 40px auto 0; padding: 0 5%; display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
@media (max-width: 700px) { .thumb-strip { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 400px) { .thumb-strip { grid-template-columns: repeat(2, 1fr); } }
.thumb-tile { aspect-ratio: 16/9; border-radius: 14px; overflow: hidden; border: 1px solid var(--border); }
.thumb-tile img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.38s cubic-bezier(0.22,1,0.36,1); }
@media (hover: hover) and (pointer: fine) { .thumb-tile:hover img { transform: scale(1.05); } }
[data-theme="light"] .reel-card { border-color: var(--border); }
</style>
<section class="reel-section" data-aos="fade-up">
    <div class="reel-header">
        <div>
            <h2 class="sec-title" data-aos="fade-up">From the current queue.</h2>
        </div>
        <a href="/portfolio" class="btn btn-glass transition-link" style="white-space:nowrap;">See Full Portfolio <i class="ti ti-arrow-right" style="font-size:0.8em;margin-left:6px;"></i></a>
    </div>

    <div class="reel-track" id="reelTrack">
        <div class="reel-card" data-src="/uploads/minecraft-edits-vid-1773380771.mp4">
            <img src="https://iili.io/BZlxlXR.jpg" alt="Minecraft video edit" width="320" height="180" loading="lazy" decoding="async">
            <div class="reel-play"><i class="ti ti-player-play-filled"></i></div>
            <video muted loop playsinline preload="none" aria-label="Minecraft video edit preview"><track kind="captions" src="" default></video>
            <span class="reel-tag">Minecraft Edit</span>
        </div>
        <div class="reel-card" data-src="/uploads/minecraft-edits-vid-1773380829.mp4">
            <img src="https://iili.io/BZlx0sp.jpg" alt="Minecraft video edit" width="320" height="180" loading="lazy" decoding="async">
            <div class="reel-play"><i class="ti ti-player-play-filled"></i></div>
            <video muted loop playsinline preload="none" aria-label="Minecraft video edit preview"><track kind="captions" src="" default></video>
            <span class="reel-tag">Minecraft Edit</span>
        </div>
        <div class="reel-card" data-src="/uploads/minecraft-edits-vid-1773381514.mp4">
            <img src="https://iili.io/BZlxG1I.jpg" alt="Minecraft video edit" width="320" height="180" loading="lazy" decoding="async">
            <div class="reel-play"><i class="ti ti-player-play-filled"></i></div>
            <video muted loop playsinline preload="none" aria-label="Minecraft video edit preview"><track kind="captions" src="" default></video>
            <span class="reel-tag">Minecraft Edit</span>
        </div>
        <div class="reel-card" data-src="/uploads/roblox-edits-vid-1773381991.mp4">
            <img src="https://iili.io/BZlo8Hg.jpg" alt="Roblox video edit" width="320" height="180" loading="lazy" decoding="async">
            <div class="reel-play"><i class="ti ti-player-play-filled"></i></div>
            <video muted loop playsinline preload="none" aria-label="Roblox video edit preview"><track kind="captions" src="" default></video>
            <span class="reel-tag">Roblox Edit</span>
        </div>
        <div class="reel-card" data-src="/uploads/advertisements-vid-1773381811.mp4">
            <img src="https://iili.io/BZlnUn2.png" alt="Motion graphics ad" width="320" height="180" loading="lazy" decoding="async">
            <div class="reel-play"><i class="ti ti-player-play-filled"></i></div>
            <video muted loop playsinline preload="none" aria-label="Motion graphics ad preview"><track kind="captions" src="" default></video>
            <span class="reel-tag">Ad Edit</span>
        </div>
        <div class="reel-card" data-src="/uploads/motion-graphics--1-vid-1773159376-0.mp4">
            <img src="https://iili.io/BZloel1.webp" alt="Motion graphics" width="320" height="180" loading="lazy" decoding="async">
            <div class="reel-play"><i class="ti ti-player-play-filled"></i></div>
            <video muted loop playsinline preload="none" aria-label="Motion graphics preview"><track kind="captions" src="" default></video>
            <span class="reel-tag">Motion Graphics</span>
        </div>
    </div>

    <div class="thumb-strip">
        <div class="thumb-tile"><img src="https://iili.io/BZlx3g9.webp" alt="Free Fire thumbnail design" width="240" height="135" loading="lazy" decoding="async"></div>
        <div class="thumb-tile"><img src="https://iili.io/BZlx7ea.jpg" alt="Minecraft thumbnail design" width="240" height="135" loading="lazy" decoding="async"></div>
        <div class="thumb-tile"><img src="https://iili.io/BZlx55g.jpg" alt="Roblox thumbnail design" width="240" height="135" loading="lazy" decoding="async"></div>
        <div class="thumb-tile"><img src="https://iili.io/BZlx207.webp" alt="PUBG thumbnail design" width="240" height="135" loading="lazy" decoding="async"></div>
        <div class="thumb-tile"><img src="https://iili.io/BZlo4xR.webp" alt="Realistic thumbnail design" width="240" height="135" loading="lazy" decoding="async"></div>
    </div>
</section>


<!-- ===================== CHANNEL AUDIT QUIZ ===================== -->
<style>
.audit-section { padding: 100px 0; position: relative; overflow: hidden; }
.audit-container { max-width: 680px; margin: 0 auto; padding: 0 20px; position: relative; z-index: 10; }
.audit-wrap { background: var(--surface); border: 1px solid var(--border); border-radius: 32px; overflow: hidden; box-shadow: 0 20px 60px var(--shadow), 0 0 0 1px rgba(0,210,255,0.06); min-height: 480px; position: relative; }
.audit-screen { padding: 52px 40px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 480px; text-align: center; }
@media (max-width: 600px) { .audit-screen { padding: 36px 20px; } }
.audit-ring { position: absolute; border-radius: 50%; border: 1px solid rgba(0,210,255,0.12); top: 50%; left: 50%; transform: translate(-50%,-50%); pointer-events: none; animation: auRingPulse 3s ease-in-out infinite; }
.audit-ring-2 { width: 320px; height: 320px; }
.audit-ring-3 { width: 480px; height: 480px; border-color: rgba(0,210,255,0.06); animation-delay: 1.5s; }
@keyframes auRingPulse { 0%,100% { opacity: 0.3; transform: translate(-50%,-50%) scale(0.97); } 50% { opacity: 1; transform: translate(-50%,-50%) scale(1.03); } }
.audit-icon-wrap { width: 72px; height: 72px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; font-size: 1.8rem; color: var(--primary); position: relative; z-index: 2; }
.audit-intro-title { font-size: clamp(1.8rem,5vw,2.6rem); font-weight: 900; letter-spacing: -1px; margin: 0 0 14px; color: var(--text-main); position: relative; z-index: 2; }
.audit-intro-sub { font-size: 0.97rem; color: var(--text-muted); line-height: 1.65; max-width: 380px; margin: 0 auto 32px; position: relative; z-index: 2; }
.btn-audit-start { display: inline-flex; align-items: center; gap: 10px; background: var(--primary); color: var(--bg); border: none; border-radius: 50px; padding: 14px 32px; font-size: 0.95rem; font-weight: 800; cursor: pointer; letter-spacing: 0.5px; transition: 0.3s; box-shadow: 0 8px 24px rgba(0,210,255,0.3); position: relative; z-index: 2; font-family: inherit; }
.btn-audit-start:hover { transform: scale(1.04); box-shadow: 0 12px 32px rgba(0,210,255,0.45); }
.audit-scan-line { width: 120px; height: 2px; background: var(--border); border-radius: 1px; overflow: hidden; position: relative; margin-bottom: 20px; }
.audit-scan-line::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg,transparent,var(--primary),transparent); animation: auScanSlide 0.7s linear infinite; }
@keyframes auScanSlide { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
.audit-scan-label { font-size: 0.72rem; color: var(--primary); font-weight: 800; letter-spacing: 3px; text-transform: uppercase; animation: auFlicker 0.35s ease infinite alternate; }
@keyframes auFlicker { from { opacity: 0.6; } to { opacity: 1; } }
.audit-screen-q { align-items: stretch; text-align: left; padding-top: 36px; padding-bottom: 36px; }
.audit-prog-track { width: 100%; height: 3px; background: var(--border); border-radius: 2px; overflow: hidden; margin-bottom: 28px; flex-shrink: 0; }
.audit-prog-fill { height: 100%; width: 100%; transform: scaleX(0); transform-origin: left; background: linear-gradient(90deg,var(--primary),var(--purple)); border-radius: 2px; transition: transform 0.5s cubic-bezier(0.4,0,0.2,1); box-shadow: 0 0 8px rgba(0,210,255,0.5); }
.audit-q-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-shrink: 0; }
.audit-q-meta > span:first-child { font-size: 0.72rem; font-weight: 800; letter-spacing: 3px; text-transform: uppercase; color: var(--text-muted); }
.audit-cat-tag { font-size: 0.65rem; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: var(--primary); background: rgba(0,210,255,0.1); border: 1px solid rgba(0,210,255,0.2); padding: 4px 12px; border-radius: 50px; }
.audit-q-card { transition: transform 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.3s; }
.audit-q-text { font-size: 1.1rem; font-weight: 800; color: var(--text-main); line-height: 1.45; margin: 0 0 22px; letter-spacing: -0.3px; }
.audit-opts { display: flex; flex-direction: column; gap: 10px; }
.audit-opt { background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 16px; padding: 13px 18px; cursor: pointer; font-size: 0.88rem; font-weight: 600; color: var(--text-main); transition: 0.22s; text-align: left; display: flex; align-items: center; gap: 12px; font-family: inherit; width: 100%; }
.audit-opt::before { content: ''; width: 18px; height: 18px; border-radius: 50%; border: 2px solid var(--border); flex-shrink: 0; transition: 0.22s; }
.audit-opt:hover { border-color: var(--primary); background: rgba(0,210,255,0.06); transform: translateX(4px); }
.audit-opt:hover::before { border-color: var(--primary); }
.audit-opt.selected { border-color: var(--primary); background: rgba(0,210,255,0.12); animation: auOptPop 0.4s ease; pointer-events: none; }
.audit-opt.selected::before { background: var(--primary); border-color: var(--primary); box-shadow: 0 0 8px rgba(0,210,255,0.5); }
@keyframes auOptPop { 0% { transform: scale(1); } 40% { transform: scale(1.018); } 100% { transform: scale(1); } }
.audit-insight { height: 26px; margin-top: 16px; font-size: 0.79rem; color: var(--primary); font-style: italic; font-weight: 600; opacity: 0; transition: opacity 0.3s; line-height: 1.4; }
.audit-insight.show { opacity: 1; }
.audit-result-wrap { display: flex; flex-direction: column; align-items: center; gap: 4px; width: 100%; }
.audit-res-scan { display: flex; flex-direction: column; align-items: center; gap: 20px; position: relative; }
.audit-res-ring { position: absolute; border-radius: 50%; border: 1px solid rgba(0,210,255,0.2); animation: auRingPulse 1.1s ease-in-out infinite; }
.audit-res-ring-1 { width: 180px; height: 180px; }
.audit-res-ring-2 { width: 280px; height: 280px; border-color: rgba(0,210,255,0.1); animation-delay: 0.55s; }
.audit-res-scan > i { font-size: 2.2rem; color: var(--primary); animation: auFlicker 0.4s ease infinite alternate; position: relative; z-index: 2; }
.audit-res-scan > p { font-size: 0.72rem; font-weight: 800; letter-spacing: 3px; text-transform: uppercase; color: var(--primary); position: relative; z-index: 2; }
.audit-score-ring { position: relative; width: 160px; height: 160px; margin: 0 auto 28px; }
.audit-score-svg { width: 100%; height: 100%; transform: rotate(-90deg); }
.au-track { fill: none; stroke: var(--border); stroke-width: 8; }
.au-arc { fill: none; stroke: var(--primary); stroke-width: 8; stroke-linecap: round; stroke-dasharray: 339.3; stroke-dashoffset: 339.3; transition: stroke-dashoffset 2s cubic-bezier(0.4,0,0.2,1), stroke 0.5s; filter: drop-shadow(0 0 6px rgba(0,210,255,0.6)); }
.audit-score-num { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); text-align: center; }
.audit-score-num span { font-size: clamp(1.8rem, 4vw, 2.6rem); font-weight: 900; color: var(--text-main); line-height: 1; letter-spacing: -2px; }
.audit-score-num small { display: block; font-size: 0.75rem; font-weight: 700; color: var(--text-muted); margin-top: 2px; }
.audit-tier-badge { display: inline-block; background: linear-gradient(135deg,rgba(0,210,255,0.15),rgba(100,50,255,0.12)); border: 1px solid rgba(0,210,255,0.3); border-radius: 50px; padding: 8px 24px; font-size: 0.82rem; font-weight: 900; letter-spacing: 2.5px; text-transform: uppercase; color: var(--primary); margin-bottom: 10px; animation: auGlitch 0.5s steps(4,end); }
@keyframes auGlitch { 0% { clip-path: inset(80% 0 0 0); transform: translateX(-4px); } 25% { clip-path: inset(0 0 60% 0); transform: translateX(4px); } 50% { clip-path: inset(40% 0 20% 0); transform: translateX(-2px); } 75%,100% { clip-path: inset(0); transform: translateX(0); } }
.audit-tier-desc { font-size: 0.9rem; color: var(--text-muted); line-height: 1.6; max-width: 440px; margin: 0 auto 24px; text-align: center; }
.audit-recs-box { background: rgba(0,0,0,0.18); border: 1px solid var(--border); border-radius: 20px; padding: 22px 26px; margin-bottom: 24px; text-align: left; display: flex; flex-direction: column; gap: 14px; width: 100%; }
.audit-rec { display: flex; gap: 10px; align-items: flex-start; font-size: 0.86rem; color: var(--text-muted); line-height: 1.55; opacity: 0; transform: translateY(8px); transition: opacity 0.4s, transform 0.4s; }
.audit-rec.show { opacity: 1; transform: translateY(0); }
.audit-rec i { color: var(--primary); font-size: 0.75rem; margin-top: 4px; flex-shrink: 0; }
.audit-result-actions { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
.audit-result-actions .btn { font-size: 0.82rem; padding: 10px 20px; }
[data-theme="light"] .audit-opt { background: rgba(0,0,0,0.03); }
[data-theme="light"] .audit-recs-box { background: rgba(0,0,0,0.05); }
</style>

<section class="audit-section" id="channel-audit" data-aos="fade-up">
    <div class="audit-container">
        <div style="text-align:center; margin-bottom: 44px;">
            <h2 class="sec-title">Score Your <span class="sweep-text">Channel</span></h2>
            <p class="sec-sub">7 questions. A weighted score out of 100. A personalised breakdown of exactly what's holding your YouTube growth back.</p>
        </div>
        <div class="audit-wrap" id="auditWrap">

            <!-- INTRO -->
            <div class="audit-screen" id="auScIntro">
                <div class="audit-ring audit-ring-2"></div>
                <div class="audit-ring audit-ring-3"></div>
                <div class="audit-icon-wrap"><svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color:var(--primary);display:block;"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg></div>
                <h2 class="audit-intro-title">Channel Audit Score</h2>
                <p class="audit-intro-sub">A weighted engine checks 4 growth pillars and tells you exactly where you're losing ground.</p>
                <button class="btn-audit-start" id="auStartBtn">Run My Audit <i class="ti ti-arrow-right"></i></button>
            </div>

            <!-- SCAN TRANSITION -->
            <div class="audit-screen" id="auScScan" style="display:none">
                <div class="audit-scan-line"></div>
                <p class="audit-scan-label" id="auScanLbl">Initializing channel diagnostics...</p>
            </div>

            <!-- QUESTIONS -->
            <div class="audit-screen audit-screen-q" id="auScQ" style="display:none">
                <div class="audit-prog-track"><div class="audit-prog-fill" id="auProgFill"></div></div>
                <div class="audit-q-meta">
                    <span id="auQCounter">Q1 / 7</span>
                    <span class="audit-cat-tag" id="auQCat">Content</span>
                </div>
                <div class="audit-q-card" id="auQCard">
                    <p class="audit-q-text" id="auQText"></p>
                    <div class="audit-opts" id="auOpts"></div>
                    <p class="audit-insight" id="auInsight"></p>
                </div>
            </div>

            <!-- RESULT -->
            <div class="audit-screen" id="auScResult" style="display:none">
                <div class="audit-res-scan" id="auResScan">
                    <div class="audit-res-ring audit-res-ring-1"></div>
                    <div class="audit-res-ring audit-res-ring-2"></div>
                    <i class="ti ti-cpu"></i>
                    <p id="auResLbl">Computing your score...</p>
                </div>
                <div class="audit-result-wrap" id="auResReveal" style="display:none">
                    <div class="audit-score-ring">
                        <svg viewBox="0 0 120 120" class="audit-score-svg">
                            <circle cx="60" cy="60" r="54" class="au-track"/>
                            <circle cx="60" cy="60" r="54" class="au-arc" id="auArc"/>
                        </svg>
                        <div class="audit-score-num"><span id="auScoreNum">0</span><small>/100</small></div>
                    </div>
                    <div class="audit-tier-badge" id="auTierBadge"></div>
                    <p class="audit-tier-desc" id="auTierDesc"></p>
                    <div class="audit-recs-box" id="auRecs"></div>
                    <div class="audit-result-actions">
                        <a href="https://discord.gg/extoarts-1402333030827425922" target="_blank" rel="noopener" class="btn btn-primary"><i class="ti ti-brand-discord"></i> Get a Real Audit - Free</a>
                        <button class="btn btn-glass" id="auShareBtn"><i class="ti ti-share"></i> Share Score</button>
                        <button class="btn btn-glass" id="auRetakeBtn"><i class="ti ti-rotate-clockwise"></i> Retake</button>
                    </div>
                </div>
            </div>

        </div>
    </div>
</section>

<script>
(function() {
    const QS = [
        {
            text: "How often do you upload to YouTube?",
            cat: "Content",
            opts: ["Sporadically, no real schedule", "A few times a month", "Once a week", "Multiple times per week"],
            scores: [0, 5, 10, 15],
            insight: [
                "Sporadic uploads signal inconsistency - the algorithm stops pushing your content.",
                "Monthly frequency limits the compounding effect of discovery.",
                "Weekly uploads give the algorithm a steady, predictable signal.",
                "High frequency builds compounding discovery advantages over time."
            ]
        },
        {
            text: "What does your thumbnail creation process look like?",
            cat: "Visual",
            opts: ["Screenshots or no real design", "DIY in Canva or Photoshop", "I hire a freelancer sometimes", "Consistently CTR-optimized design"],
            scores: [0, 8, 14, 20],
            insight: [
                "Optimized thumbnails can 3x CTR without touching the video content at all.",
                "Custom designs consistently outperform templates - originality drives clicks.",
                "Consistency matters as much as quality in a winning thumbnail strategy.",
                "Strong CTR is one of the most powerful relevance signals to the algorithm."
            ]
        },
        {
            text: "What is your average video CTR?",
            cat: "Audience",
            opts: ["Under 2%", "2% to 4%", "4% to 7%", "Above 7%"],
            scores: [0, 8, 15, 20],
            insight: [
                "Below 2% CTR means the algorithm actively deprioritizes your content.",
                "2-5% is industry average - you're in range but there's measurable room to grow.",
                "Above-average CTR - the algorithm actively rewards and promotes this.",
                "Top-tier CTR - YouTube's engine promotes you ahead of similar channels."
            ]
        },
        {
            text: "How do your videos open?",
            cat: "Content",
            opts: ["No real hook strategy", "Long intro before the content", "Short 5-10 second intro", "Optimized cold open, value within 3 seconds"],
            scores: [0, 4, 10, 15],
            insight: [
                "Viewers decide to stay or leave within the first 3 seconds.",
                "Long intros drop early retention below the threshold the algorithm rewards.",
                "Short intros keep early retention above 50%, which YouTube values.",
                "Cold-open hooks are the single biggest driver of above-average retention."
            ]
        },
        {
            text: "How consistent is your channel's visual branding?",
            cat: "Visual",
            opts: ["No consistent branding at all", "Somewhat consistent, DIY", "Consistent but self-designed", "Professionally designed brand system"],
            scores: [0, 5, 10, 15],
            insight: [
                "Channels with strong branding see 40% higher subscriber conversion rates.",
                "Loose branding reduces audience trust and makes the channel forgettable.",
                "A consistent DIY brand is a solid foundation - professional design multiplies it.",
                "Recognized branding drives direct search volume and loyal return viewers."
            ]
        },
        {
            text: "How is your video editing handled?",
            cat: "Operations",
            opts: ["I edit everything myself (8+ hrs per video)", "I edit myself but it takes too long", "I use a part-time freelancer", "I have a reliable editing workflow or team"],
            scores: [0, 3, 7, 10],
            insight: [
                "Every hour spent editing is time not spent on scripting, strategy, and growth.",
                "Editing bottleneck is the #1 reason channels stall after early momentum.",
                "Part-time help reduces pressure, but consistency gaps still limit growth.",
                "Reliable production systems separate scaling channels from stalled ones."
            ]
        },
        {
            text: "What is your biggest growth bottleneck right now?",
            cat: "Operations",
            opts: ["No clear strategy", "Not enough time to create and edit", "Good content but low views", "Inconsistent upload schedule", "Ready to scale, need a production partner"],
            scores: [0, 1, 2, 3, 5],
            insight: [
                "A clear content strategy is the foundation everything else builds on.",
                "Reclaiming editing time is the highest-ROI move for a solo creator.",
                "Distribution and thumbnails drive discovery more than content quality alone.",
                "The algorithm rewards cadence - one missed week can tank three weeks of momentum.",
                "Production partnerships are how creators remove the bottleneck between ideas and posted content."
            ]
        }
    ];

    let qIndex = 0, finalScore = 0;
    const answers = [];

    const screens = { intro: 'auScIntro', scan: 'auScScan', q: 'auScQ', result: 'auScResult' };
    function showScreen(k) {
        Object.values(screens).forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
        const el = document.getElementById(screens[k]);
        if (el) el.style.display = 'flex';
    }

    document.getElementById('auStartBtn').addEventListener('click', () => {
        showScreen('scan');
        const labels = ['Initializing channel diagnostics...', 'Loading scoring engine...', 'Almost ready...'];
        let li = 0;
        const iv = setInterval(() => {
            if (++li < labels.length) document.getElementById('auScanLbl').textContent = labels[li];
        }, 500);
        setTimeout(() => { clearInterval(iv); showScreen('q'); renderQ(0); }, 1500);
    });

    function renderQ(i) {
        const q = QS[i];
        document.getElementById('auProgFill').style.transform = 'scaleX(' + (i / QS.length) + ')';
        document.getElementById('auQCounter').textContent = 'Q' + (i + 1) + ' / ' + QS.length;
        document.getElementById('auQCat').textContent = q.cat;
        document.getElementById('auQText').textContent = q.text;
        const ins = document.getElementById('auInsight');
        ins.textContent = '';
        ins.classList.remove('show');

        const optsEl = document.getElementById('auOpts');
        optsEl.innerHTML = '';
        q.opts.forEach((opt, oi) => {
            const btn = document.createElement('button');
            btn.className = 'audit-opt';
            btn.textContent = opt;
            btn.addEventListener('click', () => pick(oi));
            optsEl.appendChild(btn);
        });

        const card = document.getElementById('auQCard');
        card.style.transition = 'none';
        card.style.opacity = '0';
        card.style.transform = 'translateX(50px)';
        requestAnimationFrame(() => requestAnimationFrame(() => {
            card.style.transition = 'transform 0.42s cubic-bezier(0.22,1,0.36,1), opacity 0.32s';
            card.style.opacity = '1';
            card.style.transform = 'translateX(0)';
        }));
    }

    function pick(oi) {
        document.querySelectorAll('.audit-opt').forEach(o => { o.classList.remove('selected'); o.style.pointerEvents = 'none'; });
        document.querySelectorAll('.audit-opt')[oi].classList.add('selected');
        const q = QS[qIndex];
        const ins = document.getElementById('auInsight');
        ins.textContent = q.insight[Math.min(oi, q.insight.length - 1)];
        ins.classList.add('show');
        answers[qIndex] = oi;
        setTimeout(() => {
            qIndex++;
            if (qIndex < QS.length) {
                const card = document.getElementById('auQCard');
                card.style.transition = 'transform 0.28s ease, opacity 0.22s';
                card.style.opacity = '0';
                card.style.transform = 'translateX(-50px)';
                setTimeout(() => renderQ(qIndex), 300);
            } else {
                showResult();
            }
        }, 950);
    }

    function showResult() {
        showScreen('result');
        document.getElementById('auResScan').style.display = 'flex';
        document.getElementById('auResReveal').style.display = 'none';
        const lbls = ['Computing your score...', 'Analyzing 4 growth pillars...', 'Generating recommendations...'];
        let li = 0;
        const iv = setInterval(() => { if (++li < lbls.length) document.getElementById('auResLbl').textContent = lbls[li]; }, 650);
        setTimeout(() => {
            clearInterval(iv);
            document.getElementById('auResScan').style.display = 'none';
            document.getElementById('auResReveal').style.display = 'flex';
            revealScore();
        }, 1950);
    }

    function revealScore() {
        finalScore = 0;
        const catS = { Content: 0, Visual: 0, Audience: 0, Operations: 0 };
        const catM = { Content: 0, Visual: 0, Audience: 0, Operations: 0 };
        answers.forEach((ai, qi) => {
            const q = QS[qi];
            const pts = q.scores[ai] || 0;
            finalScore += pts;
            catS[q.cat] = (catS[q.cat] || 0) + pts;
            catM[q.cat] = (catM[q.cat] || 0) + Math.max(...q.scores);
        });

        const arc = document.getElementById('auArc');
        let col = '#ff4757';
        if (finalScore > 25) col = '#ffa502';
        if (finalScore > 45) col = '#00d2ff';
        if (finalScore > 65) col = '#00e676';
        if (finalScore > 80) col = '#7bed9f';
        arc.style.stroke = col;
        arc.style.filter = `drop-shadow(0 0 6px ${col}99)`;
        setTimeout(() => { arc.style.strokeDashoffset = 339.3 - (finalScore / 100) * 339.3; }, 80);

        const numEl = document.getElementById('auScoreNum');
        let cur = 0, step = finalScore / 80;
        const civ = setInterval(() => {
            cur = Math.min(cur + step, finalScore);
            numEl.textContent = Math.round(cur);
            if (cur >= finalScore) clearInterval(civ);
        }, 25);

        const tiers = [
            { max: 25, name: 'Raw Upload', desc: 'Core fundamentals are missing. Your channel has real potential being held back by gaps in production and strategy.' },
            { max: 45, name: 'Grinding Creator', desc: "You're putting in the work, but inefficiencies are bleeding views and slowing your compounding growth." },
            { max: 65, name: 'Momentum Builder', desc: 'You have the right instincts. One focused production upgrade could dramatically accelerate your results.' },
            { max: 80, name: 'Optimized Operator', desc: "Your channel is dialed in. You need the right production partner to scale what's already working." },
            { max: 100, name: 'Algorithm Ally', desc: "Fully optimized. The algorithm is working in your favor - you need a production team that can match your pace." }
        ];
        const tier = tiers.find(t => finalScore <= t.max) || tiers[tiers.length - 1];
        document.getElementById('auTierBadge').textContent = tier.name;
        document.getElementById('auTierDesc').textContent = tier.desc;

        const recMap = {
            Content: 'Upload consistency and hook quality are the two biggest levers you have. Creators who post 2-3x per week with optimized cold opens grow 3x faster than sporadic uploaders with similar content.',
            Visual: 'Thumbnail redesign is the highest ROI change you can make without touching the video. Testing a CTR-optimized thumbnail on your top 3 videos typically shows measurable results within 48 hours.',
            Audience: "Your CTR is the primary signal YouTube uses to decide whether to promote your content. A professional thumbnail combined with a stronger hook in the first 3 seconds is the fastest path to above-average reach.",
            Operations: 'Removing yourself from the editing process is the highest-leverage decision a solo creator can make. Every hour reclaimed from editing is an hour available for scripting, strategy, and growth.'
        };
        const ratios = Object.entries(catS).map(([k, v]) => ({ cat: k, ratio: v / (catM[k] || 1) })).sort((a, b) => a.ratio - b.ratio);
        const recs = ratios.slice(0, 3).map(r => recMap[r.cat]).filter(Boolean);
        const recsEl = document.getElementById('auRecs');
        recsEl.innerHTML = recs.map((r, i) => `<div class="audit-rec" style="transition-delay:${(i+1)*0.18}s"><i class="ti ti-arrow-right"></i><span>${r}</span></div>`).join('');
        setTimeout(() => document.querySelectorAll('.audit-rec').forEach(el => el.classList.add('show')), 200);
    }

    document.getElementById('auShareBtn').addEventListener('click', () => {
        const shareText = `I scored ${finalScore}/100 on the ExtoArts Channel Audit. How does your YouTube channel stack up?`;
        const shareUrl  = 'https://extoarts.in/#channel-audit';
        const btn = document.getElementById('auShareBtn');

        function markCopied(ok) {
            btn.innerHTML = ok
                ? '<i class="ti ti-check"></i> Copied!'
                : '<i class="ti ti-share"></i> Share Score';
            if (ok) setTimeout(() => { btn.innerHTML = '<i class="ti ti-share"></i> Share Score'; }, 2500);
        }

        function fallbackCopy() {
            try {
                const ta = document.createElement('textarea');
                ta.value = shareText + ' ' + shareUrl;
                ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0';
                document.body.appendChild(ta);
                ta.focus(); ta.select();
                const ok = document.execCommand('copy');
                document.body.removeChild(ta);
                markCopied(ok);
            } catch(e) { markCopied(false); }
        }

        if (navigator.share) {
            navigator.share({ title: 'ExtoArts Channel Audit', text: shareText, url: shareUrl })
                .then(() => { btn.innerHTML = '<i class="ti ti-check"></i> Shared!'; setTimeout(() => { btn.innerHTML = '<i class="ti ti-share"></i> Share Score'; }, 2000); })
                .catch(() => fallbackCopy());
        } else if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(shareText + ' ' + shareUrl)
                .then(() => markCopied(true))
                .catch(() => fallbackCopy());
        } else {
            fallbackCopy();
        }
    });

    document.getElementById('auRetakeBtn').addEventListener('click', () => {
        answers.length = 0; qIndex = 0; finalScore = 0;
        document.getElementById('auProgFill').style.transform = 'scaleX(0)';
        document.getElementById('auArc').style.strokeDashoffset = '339.3';
        document.getElementById('auScoreNum').textContent = '0';
        document.getElementById('auResScan').style.display = 'flex';
        document.getElementById('auResReveal').style.display = 'none';
        document.getElementById('auResLbl').textContent = 'Computing your score...';
        showScreen('intro');
    });
})();
</script>

<script>
    function closeReviewModal() {
        const modal = document.getElementById('reviewModal');
        if (!modal) return;
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }


    document.addEventListener('DOMContentLoaded', () => {
        const modal = document.getElementById('reviewModal');
        const avatar = document.getElementById('reviewModalAvatar');
        const name = document.getElementById('reviewModalName');
        const count = document.getElementById('reviewModalCount');
        const text = document.getElementById('reviewModalText');

        if (modal && avatar && name && count && text) {
            document.querySelectorAll('.rev-card').forEach(card => {
                card.addEventListener('click', () => {
                    const img = card.dataset.img;
                    const init = card.dataset.init || '?';
                    const grad = card.dataset.grad || '#00d2ff,#9d50bb';
                    avatar.innerHTML = '';

                    if (img) {
                        const image = document.createElement('img');
                        image.src = img;
                        image.alt = card.dataset.name || 'Client avatar';
                        avatar.appendChild(image);
                    } else {
                        const fallback = document.createElement('span');
                        fallback.textContent = init;
                        fallback.style.background = `linear-gradient(135deg, ${grad})`;
                        avatar.appendChild(fallback);
                    }

                    name.textContent = card.dataset.name || 'Client Review';
                    count.textContent = card.dataset.reviewCount || '0';
                    text.textContent = card.dataset.text || '';
                    const modalType = document.getElementById('reviewModalType');
                    const modalDateVal = document.getElementById('reviewModalDateVal');
                    if (modalType) modalType.textContent = card.dataset.type || '';
                    if (modalDateVal) modalDateVal.textContent = card.dataset.date || '';
                    modal.style.display = 'flex';
                    modal.setAttribute('aria-hidden', 'false');
                    setTimeout(() => modal.classList.add('show'), 10);
                });
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal || e.target.closest('[data-review-close]')) {
                    closeReviewModal();
                }
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.classList.contains('show')) {
                    closeReviewModal();
                }
            });
        }
    });

    /* Card tilt handled by /js/premium.js (site-wide) */

    /* ---- 120+ EASE-OUT COUNTER ---- */
    (function() {
        const el = document.querySelector('.ea-count');
        if (!el) return;
        const target = parseInt(el.dataset.target, 10) || 120;
        let fired = false;
        function runCount() {
            if (fired) return;
            fired = true;
            const duration = 1800;
            const start = performance.now();
            (function step(now) {
                const p = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.round(1 + (target - 1) * eased);
                if (p < 1) requestAnimationFrame(step);
                else el.textContent = target;
            })(start);
        }
        const obs = new IntersectionObserver(function(entries) {
            if (entries[0].isIntersecting) { runCount(); obs.disconnect(); }
        }, { threshold: 0.1 });
        obs.observe(el);
    })();

    /* ---- HERO MOUSE SPOTLIGHT ---- */
    (function() {
        if (!window.matchMedia("(pointer: fine)").matches) return;
        const hero = document.querySelector('.hero');
        const blob = hero && hero.querySelector('.hero-spotlight-blob');
        if (!hero || !blob) return;
        function setBlobPos(bxPct, byPct) {
            const rect = hero.getBoundingClientRect();
            const x = (bxPct / 100) * rect.width  - 340;
            const y = (byPct / 100) * rect.height - 340;
            blob.style.transform = 'translate(' + x.toFixed(1) + 'px, ' + y.toFixed(1) + 'px)';
        }
        setBlobPos(50, 45);
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const bx = ((e.clientX - rect.left) / rect.width)  * 100;
            const by = ((e.clientY - rect.top)  / rect.height) * 100;
            setBlobPos(bx, by);
        });
        hero.addEventListener('mouseleave', () => {
            setBlobPos(50, 45);
        });
    })();

</script>

<style>
/* ── HOMEPAGE ENTRANCE ANIMATIONS ──────────────────────────────────── */

/* Service card icon: scale-pop after the card's own reveal fires */
.tilt-card[data-aos].aos-animate .service-icon {
    animation: eaIconPop 0.52s 0.16s cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes eaIconPop {
    from { transform: scale(0.68) translateY(8px); opacity: 0; filter: blur(6px); }
    to   { transform: scale(1)    translateY(0);   opacity: 1; filter: none;      }
}

/* Discord process step numbers: bloom in from transparent */
.dsc-proc-step[data-aos].aos-animate .dpc-num {
    animation: eaStepNumBloom 0.72s 0.08s cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes eaStepNumBloom {
    from { opacity: 0; transform: translateY(12px) scale(0.82); filter: blur(5px); }
    to   { opacity: 1; transform: none;                          filter: none;      }
}

/* Discord process step icons: pop in slightly after the number */
.dsc-proc-step[data-aos].aos-animate .dpc-icon {
    animation: eaIconPop 0.48s 0.22s cubic-bezier(0.16, 1, 0.3, 1) both;
}

/* Reduced motion: disable all new entrance keyframes */
@media (prefers-reduced-motion: reduce) {
    .tilt-card[data-aos].aos-animate .service-icon,
    .dsc-proc-step[data-aos].aos-animate .dpc-num,
    .dsc-proc-step[data-aos].aos-animate .dpc-icon {
        animation: none;
    }
    .preview-overlay span,
    .preview-overlay small {
        transition: none !important;
    }
}
</style>

<?php include __DIR__ . '/../templates/footer.php'; ?>
