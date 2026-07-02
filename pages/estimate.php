<?php
declare(strict_types=1);
$page_title = "YouTube Video Editing Cost Estimator | ExtoArts";
$page_desc = "Find out how much YouTube video editing costs in 2026. Use our free instant estimator - enter your niche, video length, and style to get a real price range in seconds.";
include __DIR__ . '/../templates/header.php';
?>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://extoarts.in/estimate",
  "url": "https://extoarts.in/estimate",
  "name": "YouTube Video Editing Cost Estimator - Free Instant Quote | ExtoArts",
  "description": "Free interactive tool to estimate the cost of YouTube video editing in 2026. Enter your project details and get an instant price range.",
  "inLanguage": "en-US",
  "datePublished": "2026-05-22",
  "dateModified": "2026-06-17",
  "publisher": { "@id": "https://extoarts.in/#organization" },
  "isPartOf": { "@id": "https://extoarts.in/#website" },
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": [".speakable-intro", ".speakable-cost-facts"]
  }
}
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much does YouTube video editing cost in 2026?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "YouTube video editing costs range from $30 to $300+ per video in 2026, depending on video length, complexity, niche, and whether you need motion graphics or VFX. A basic 5-10 minute YouTube video edit costs $40-$80. A complex 20+ minute gaming or educational video with custom VFX costs $150-$300. Monthly retainer packages are discounted by 15-20% compared to per-video pricing."
      }
    },
    {
      "@type": "Question",
      "name": "How much does it cost to hire a YouTube video editor per month?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Hiring a YouTube video editor on a monthly retainer typically costs $200 to $1,200 per month in 2026, depending on upload frequency and video complexity. A creator uploading 4 standard videos per month pays roughly $200-$400/month. A creator uploading weekly with complex gaming edits or VFX pays $600-$1,200/month. Monthly retainers include priority delivery and a dedicated editor who learns your channel style."
      }
    },
    {
      "@type": "Question",
      "name": "How much does thumbnail design cost for YouTube?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Professional YouTube thumbnail design costs $15 to $60 per thumbnail in 2026. Simple flat-design thumbnails run $15-$25 each. Advanced thumbnails with 3D renders, custom backgrounds, and photo manipulation cost $35-$60 each. Monthly thumbnail packages (4-12 thumbnails) are available at discounted rates from $80 to $400/month."
      }
    },
    {
      "@type": "Question",
      "name": "Is YouTube video editing cheaper on a monthly retainer?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Monthly retainer packages for YouTube video editing are typically 15-25% cheaper than paying per video. Retainers also include a dedicated editor who learns your channel style, priority delivery queue, and a monthly performance check-in. For creators uploading consistently, a retainer delivers better quality and lower cost per video."
      }
    },
    {
      "@type": "Question",
      "name": "How much does it cost to edit gaming YouTube videos?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Gaming YouTube video editing costs $40 to $250 per video depending on the game, length, and complexity. A basic 10-minute Roblox or Minecraft highlight edit runs $40-$80. A cinematic PUBG or Fortnite montage with custom VFX, color grading, and motion graphics costs $120-$250. Gaming editors who know the genre's pacing and culture produce significantly better results than general editors."
      }
    }
  ]
}
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://extoarts.in/" },
    { "@type": "ListItem", "position": 2, "name": "Cost Estimator", "item": "https://extoarts.in/estimate" }
  ]
}
</script>

<style>
.est-hero {
    padding: 160px 20px 60px;
    text-align: center;
    max-width: 860px;
    margin: 0 auto;
    position: relative;
    z-index: 10;
}
.est-hero h1 {
    font-size: clamp(2.6rem, 7vw, 4.8rem);
    font-weight: 900;
    line-height: 1.1;
    letter-spacing: -2px;
    margin-bottom: 20px;
}
.est-hero p {
    font-size: 1.1rem;
    color: var(--text-muted);
    line-height: 1.7;
    max-width: 580px;
    margin: 0 auto 12px;
}
.est-badge {
    display: inline-block;
    font-size: 0.72rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 4px;
    color: var(--primary);
    margin-bottom: 20px;
}

/* ── Cost Facts Strip ── */
.cost-facts-strip {
    max-width: 980px;
    margin: 0 auto 60px;
    padding: 0 20px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    position: relative;
    z-index: 10;
}
.cost-fact {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 22px 24px;
    text-align: center;
}
.cost-fact .cf-range {
    font-size: 1.5rem;
    font-weight: 900;
    color: var(--primary);
    letter-spacing: -1px;
    margin-bottom: 6px;
    display: block;
}
.cost-fact .cf-label {
    font-size: 0.82rem;
    color: var(--text-muted);
    line-height: 1.4;
}

/* ── Estimator Tool ── */
.estimator-wrap {
    max-width: 980px;
    margin: 0 auto 80px;
    padding: 0 20px;
    position: relative;
    z-index: 10;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 28px;
    align-items: start;
}
@media (max-width: 768px) { .estimator-wrap { grid-template-columns: 1fr; } }

.est-form-panel {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 36px;
    padding: 44px 40px;
}
.est-form-panel h2 {
    font-size: 1.5rem;
    font-weight: 800;
    margin-bottom: 30px;
    letter-spacing: -0.5px;
}

.field-group { margin-bottom: 26px; }
.field-group label {
    display: block;
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: var(--text-muted);
    margin-bottom: 10px;
}
.option-grid {
    display: grid;
    gap: 8px;
}
.option-grid.cols-2 { grid-template-columns: 1fr 1fr; }
.option-grid.cols-3 { grid-template-columns: 1fr 1fr 1fr; }
.option-grid.cols-4 { grid-template-columns: 1fr 1fr 1fr 1fr; }
@media (max-width: 480px) {
    .option-grid.cols-3, .option-grid.cols-4 { grid-template-columns: 1fr 1fr; }
}

.opt-btn {
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 10px 8px;
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
    line-height: 1.3;
    font-family: inherit;
}
.opt-btn:hover {
    border-color: var(--primary);
    color: var(--text-main);
}
.opt-btn.active {
    background: var(--primary-glow);
    border-color: var(--primary);
    color: var(--primary);
    font-weight: 700;
}
.opt-btn .ob-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 4px;
    height: 38px;
}
.opt-btn .ob-icon svg {
    pointer-events: none;
    flex-shrink: 0;
    color: var(--text-muted);
    transition: color 0.2s;
}
.opt-btn:hover .ob-icon svg {
    color: var(--text-main);
}
.opt-btn.active .ob-icon svg {
    color: var(--primary);
}

/* ── Result Panel ── */
.est-result-panel {
    position: sticky;
    top: 100px;
}
.result-card {
    background: var(--surface);
    border: 1px solid var(--primary);
    border-radius: 36px;
    padding: 40px 36px;
    box-shadow: 0 0 60px var(--primary-glow);
    margin-bottom: 20px;
}
.result-label {
    font-size: 0.72rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 3px;
    color: var(--primary);
    margin-bottom: 10px;
}
.result-range {
    font-size: clamp(2.2rem, 5vw, 3.2rem);
    font-weight: 900;
    letter-spacing: -2px;
    line-height: 1;
    margin-bottom: 6px;
    color: var(--text-main);
}
.result-period {
    font-size: 0.88rem;
    color: var(--text-muted);
    margin-bottom: 28px;
}
.result-breakdown {
    border-top: 1px solid var(--border);
    padding-top: 24px;
    margin-bottom: 28px;
}
.rb-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    font-size: 0.9rem;
}
.rb-row .rb-key { color: var(--text-muted); }
.rb-row .rb-val { font-weight: 700; color: var(--text-main); }
.rb-row.rb-total .rb-key { font-weight: 800; color: var(--text-main); }
.rb-row.rb-total .rb-val { color: var(--primary); font-size: 1rem; }

.result-note {
    font-size: 0.8rem;
    color: var(--text-muted);
    line-height: 1.5;
    margin-bottom: 24px;
    padding: 12px 16px;
    background: rgba(0,210,255,0.04);
    border-radius: 12px;
    border: 1px solid rgba(0,210,255,0.1);
}
.result-note i { color: var(--primary); margin-right: 5px; }

.retainer-card {
    background: var(--surface);
    border: 1px solid var(--purple);
    border-radius: 24px;
    padding: 28px 28px;
    box-shadow: 0 0 40px var(--purple-glow);
}
.retainer-card .rc-label {
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 3px;
    color: var(--purple);
    margin-bottom: 8px;
}
.retainer-card .rc-range {
    font-size: 1.8rem;
    font-weight: 900;
    letter-spacing: -1px;
    margin-bottom: 4px;
}
.retainer-card .rc-sub {
    font-size: 0.83rem;
    color: var(--text-muted);
    margin-bottom: 16px;
}
.retainer-card .rc-saving {
    font-size: 0.82rem;
    font-weight: 700;
    color: var(--purple);
}

/* ── Cost Context Section ── */
.cost-context {
    max-width: 900px;
    margin: 0 auto 80px;
    padding: 0 20px;
    position: relative;
    z-index: 10;
}
.cost-context h2 {
    font-size: clamp(1.8rem, 4vw, 2.6rem);
    font-weight: 900;
    letter-spacing: -1px;
    margin-bottom: 18px;
}
.cost-context p {
    font-size: 1rem;
    line-height: 1.8;
    color: var(--text-muted);
    margin-bottom: 16px;
}
.cost-context p strong { color: var(--text-main); }

.pricing-table-wrap {
    margin: 40px 0;
    overflow-x: auto;
    border-radius: 20px;
    border: 1px solid var(--border);
}
.pricing-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.92rem;
}
.pricing-table thead th {
    background: var(--surface);
    padding: 16px 20px;
    text-align: left;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: var(--text-muted);
    font-weight: 700;
    border-bottom: 1px solid var(--border);
}
.pricing-table tbody td {
    padding: 15px 20px;
    border-bottom: 1px solid var(--border);
    color: var(--text-main);
    line-height: 1.45;
}
.pricing-table tbody tr:last-child td { border-bottom: none; }
.pricing-table tbody tr:hover td { background: rgba(0,210,255,0.03); }
.pricing-table .td-range {
    font-weight: 800;
    color: var(--primary);
    white-space: nowrap;
}
.pricing-table .td-type { font-weight: 600; }

.est-faq { max-width: 860px; margin: 0 auto 80px; padding: 0 20px; }
.est-faq h2 { font-size: clamp(1.8rem, 4vw, 2.6rem); font-weight: 900; letter-spacing: -1px; margin-bottom: 40px; }
.faq-item { border-bottom: 1px solid var(--border); padding: 24px 0; }
.faq-item:first-of-type { border-top: 1px solid var(--border); }
.faq-q { font-size: 1.05rem; font-weight: 700; margin-bottom: 12px; color: var(--text-main); }
.faq-a { font-size: 0.95rem; line-height: 1.8; color: var(--text-muted); }
.faq-a strong { color: var(--text-main); }

.est-cta { text-align: center; padding: 80px 20px 120px; position: relative; z-index: 10; }
.est-cta h2 { font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 900; letter-spacing: -1px; margin-bottom: 18px; }
.est-cta p { font-size: 1.05rem; color: var(--text-muted); max-width: 500px; margin: 0 auto 36px; line-height: 1.7; }

[data-theme="light"] .opt-btn { background: #f1f5f9; border-color: var(--border); }
[data-theme="light"] .opt-btn.active { background: rgba(0,180,220,0.08); }
[data-theme="light"] .result-note { background: rgba(0,180,220,0.04); }
</style>
<div class="est-hero" data-aos="fade-down">
    <span class="est-badge">Free Tool - No Signup Required</span>
    <h1 class="sr-only">YouTube Video Editing Cost Estimator 2026 - Instant Price Calculator | ExtoArts</h1>
    <div aria-hidden="true">
        <span style="color: var(--text-main);">What Will Your </span><span class="cycle-stack" aria-label="Edit Cost?"><span class="cycle-phrase is-active sweep-text">Edit Cost?</span><span class="cycle-phrase sweep-text" aria-hidden="true">Project Cost?</span><span class="cycle-phrase sweep-text" aria-hidden="true">Retainer Cost?</span></span>
    </div>
    <p class="speakable-intro" style="margin-top: 20px;">The most accurate free YouTube video editing cost estimator for 2026. No email required, no fluff - just a real price range based on your actual project.</p>
    <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 8px;"><i class="ti ti-lock" style="color: var(--primary);"></i> No data collected. Estimates are anonymous and instant.</p>
</div>

<!-- Quick cost facts strip -->
<div class="cost-facts-strip speakable-cost-facts" data-aos="fade-up">
    <div class="cost-fact">
        <span class="cf-range">$40-$80</span>
        <span class="cf-label">Basic YouTube video edit (5-10 min)</span>
    </div>
    <div class="cost-fact">
        <span class="cf-range">$80-$150</span>
        <span class="cf-label">Standard video edit (10-20 min)</span>
    </div>
    <div class="cost-fact">
        <span class="cf-range">$150-$300</span>
        <span class="cf-label">Complex edit with VFX / motion graphics</span>
    </div>
    <div class="cost-fact">
        <span class="cf-range">$15-$60</span>
        <span class="cf-label">Per professional thumbnail design</span>
    </div>
</div>

<!-- ── Interactive Estimator ── -->
<div class="estimator-wrap">
    <!-- Form panel -->
    <div class="est-form-panel" data-aos="fade-right">
        <h2>Build Your Estimate</h2>

        <div class="field-group">
            <label>What type of content?</label>
            <div class="option-grid cols-2" id="type-grid">
                <button class="opt-btn active" data-group="type" data-val="longform">
                    <span class="ob-icon"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/></svg></span>YouTube Long-form
                </button>
                <button class="opt-btn" data-group="type" data-val="gaming">
                    <span class="ob-icon"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="6" x2="10" y1="11" y2="11"/><line x1="8" x2="8" y1="9" y2="13"/><line x1="15" x2="15.01" y1="12" y2="12"/><line x1="17" x2="17.01" y1="10" y2="10"/><path d="M6 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><path d="M11 5a2 2 0 0 1 2 0l1 1.5a2 2 0 0 0 1.7 1H18"/><path d="M13 5a2 2 0 0 0-2 0L10 6.5a2 2 0 0 1-1.7 1H6"/></svg></span>Gaming Video
                </button>
                <button class="opt-btn" data-group="type" data-val="shorts">
                    <span class="ob-icon"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></span>Shorts / TikTok
                </button>
                <button class="opt-btn" data-group="type" data-val="thumbnail">
                    <span class="ob-icon"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></span>Thumbnail Design
                </button>
                <button class="opt-btn" data-group="type" data-val="faceless">
                    <span class="ob-icon"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg></span>Faceless / Automation
                </button>
                <button class="opt-btn" data-group="type" data-val="fullpackage">
                    <span class="ob-icon"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg></span>Video + Thumbnail
                </button>
            </div>
        </div>

        <div class="field-group" id="length-group">
            <label>Video length</label>
            <div class="option-grid cols-3">
                <button class="opt-btn active" data-group="length" data-val="short">Under 10 min</button>
                <button class="opt-btn" data-group="length" data-val="medium">10-20 min</button>
                <button class="opt-btn" data-group="length" data-val="long">20+ min</button>
            </div>
        </div>

        <div class="field-group">
            <label>Editing complexity</label>
            <div class="option-grid cols-2">
                <button class="opt-btn" data-group="complexity" data-val="basic">
                    <span class="ob-icon"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" x2="8.12" y1="4" y2="15.88"/><line x1="14.47" x2="20" y1="14.48" y2="20"/><line x1="8.12" x2="12" y1="8.12" y2="12"/></svg></span>Basic cuts &amp; captions
                </button>
                <button class="opt-btn active" data-group="complexity" data-val="standard">
                    <span class="ob-icon"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg></span>Sound design + pacing
                </button>
                <button class="opt-btn" data-group="complexity" data-val="advanced">
                    <span class="ob-icon"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M21 16h-4"/><path d="M11 3H9"/></svg></span>Motion graphics
                </button>
                <button class="opt-btn" data-group="complexity" data-val="premium">
                    <span class="ob-icon"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg></span>Full VFX + color grade
                </button>
            </div>
        </div>

        <div class="field-group">
            <label>How often do you upload?</label>
            <div class="option-grid cols-2">
                <button class="opt-btn active" data-group="freq" data-val="oneoff">One-off project</button>
                <button class="opt-btn" data-group="freq" data-val="4pm">4 videos / month</button>
                <button class="opt-btn" data-group="freq" data-val="8pm">8 videos / month</button>
                <button class="opt-btn" data-group="freq" data-val="12pm">12+ videos / month</button>
            </div>
        </div>

        <div class="field-group">
            <label>Turnaround preference</label>
            <div class="option-grid cols-3">
                <button class="opt-btn active" data-group="turnaround" data-val="standard">Standard (3-7 days)</button>
                <button class="opt-btn" data-group="turnaround" data-val="priority">Priority (2-3 days)</button>
                <button class="opt-btn" data-group="turnaround" data-val="rush">Rush (24-48 hrs)</button>
            </div>
        </div>
    </div>

    <!-- Result panel -->
    <div class="est-result-panel" data-aos="fade-left">
        <div class="result-card">
            <div class="result-label">Estimated cost per video</div>
            <div class="result-range" id="result-range">$80 - $120</div>
            <div class="result-period" id="result-period">One-off project &middot; Standard turnaround</div>

            <div class="result-breakdown">
                <div class="rb-row">
                    <span class="rb-key">Base editing rate</span>
                    <span class="rb-val" id="rb-base">$72 - $109</span>
                </div>
                <div class="rb-row">
                    <span class="rb-key">ExtoArts 10% fee</span>
                    <span class="rb-val" id="rb-fee">$8 - $11</span>
                </div>
                <div class="rb-row">
                    <span class="rb-key">Turnaround adjustment</span>
                    <span class="rb-val" id="rb-turnaround">Included</span>
                </div>
                <div class="rb-row rb-total" style="border-top: 1px solid var(--border); padding-top: 14px; margin-top: 4px;">
                    <span class="rb-key">Total estimate</span>
                    <span class="rb-val" id="rb-total">$80 - $120</span>
                </div>
            </div>

            <div class="result-note">
                <i class="ti ti-info-circle"></i>This is an estimated range based on market rates in 2026. Your actual quote may vary based on raw footage quality, revision count, and specific style requirements. ExtoArts always provides an exact quote before any work begins.
            </div>

            <button class="btn btn-main" style="width:100%; padding: 18px;" onclick="openModal('discordModal')">
                <i class="ti ti-brand-discord"></i> Get My Exact Quote on Discord
            </button>
        </div>

        <div class="retainer-card" id="retainer-card">
            <div class="rc-label">Monthly Retainer Option</div>
            <div class="rc-range" id="rc-range">$272 - $408</div>
            <div class="rc-sub" id="rc-sub">4 videos per month &middot; dedicated editor</div>
            <div class="rc-saving" id="rc-saving"><i class="ti ti-tag"></i> Save ~15% vs. per-video pricing</div>
        </div>
    </div>
</div>

<!-- ── Cost Context / SEO Content ── -->
<div class="cost-context" data-aos="fade-up">
    <h2 class="sweep-text">How Much Does YouTube Video Editing Cost in 2026?</h2>
    <p>YouTube video editing costs <strong>$30 to $300+ per video</strong> in 2026, depending on length, complexity, niche, and whether you need custom motion graphics or visual effects. This range reflects the real market rate for professional editors - not the cheapest freelancers on Fiverr, and not inflated agency prices with 40% overhead.</p>
    <p>The biggest factor in what you pay is <strong>complexity, not length</strong>. A 20-minute talking-head vlog edit with simple cuts and captions costs far less than a 10-minute gaming montage with custom Blender renders, particle effects, and frame-perfect sound design.</p>

    <div class="pricing-table-wrap">
        <table class="pricing-table">
            <thead>
                <tr>
                    <th>Video Type</th>
                    <th>Length</th>
                    <th>Complexity</th>
                    <th>Price Range (per video)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="td-type">YouTube long-form (vlog/talking head)</td>
                    <td>5-10 min</td>
                    <td>Basic cuts + captions</td>
                    <td class="td-range">$30 - $60</td>
                </tr>
                <tr>
                    <td class="td-type">YouTube long-form (storytelling / educational)</td>
                    <td>10-20 min</td>
                    <td>Sound design + pacing</td>
                    <td class="td-range">$70 - $140</td>
                </tr>
                <tr>
                    <td class="td-type">YouTube long-form (complex / commentary)</td>
                    <td>20+ min</td>
                    <td>Motion graphics + VFX</td>
                    <td class="td-range">$150 - $280</td>
                </tr>
                <tr>
                    <td class="td-type">Gaming video (Roblox, Minecraft, casual)</td>
                    <td>8-15 min</td>
                    <td>Standard gaming edit</td>
                    <td class="td-range">$40 - $90</td>
                </tr>
                <tr>
                    <td class="td-type">Gaming montage (PUBG, Fortnite, cinematic)</td>
                    <td>5-12 min</td>
                    <td>Full VFX + color grade</td>
                    <td class="td-range">$120 - $250</td>
                </tr>
                <tr>
                    <td class="td-type">YouTube Shorts / TikTok / Reels</td>
                    <td>Under 60 sec</td>
                    <td>Vertical format, hooks</td>
                    <td class="td-range">$20 - $55</td>
                </tr>
                <tr>
                    <td class="td-type">Faceless / automation video</td>
                    <td>8-20 min</td>
                    <td>B-roll + VO sync + graphics</td>
                    <td class="td-range">$80 - $180</td>
                </tr>
                <tr>
                    <td class="td-type">Thumbnail design (flat design)</td>
                    <td>-</td>
                    <td>Standard composition</td>
                    <td class="td-range">$15 - $30</td>
                </tr>
                <tr>
                    <td class="td-type">Thumbnail design (3D render + composite)</td>
                    <td>-</td>
                    <td>Advanced / gaming style</td>
                    <td class="td-range">$35 - $65</td>
                </tr>
            </tbody>
        </table>
    </div>

    <p><strong>Why does ExtoArts charge a 10% flat fee?</strong> Most agencies quietly take 30-50% of your budget, leaving editors underpaid and unmotivated. Our flat 10% covers management, quality assurance, and coordination. That means 90% of your money goes directly to the specialist editing your video - resulting in better work, faster. See our full <a href="/pricing" style="color: var(--primary);">pricing breakdown</a> for more detail.</p>
    <p><strong>Monthly retainers save 15-20%.</strong> If you upload consistently, locking in a dedicated editor on a monthly retainer is significantly cheaper per video than paying per project. Your editor also learns your style over time, reducing revision rounds and delivery time. Learn more about our <a href="/workflow" style="color: var(--primary);">how we work</a> page.</p>
</div>

<!-- ── FAQ Section ── -->
<div class="est-faq" data-aos="fade-up">
    <h2>Frequently Asked Questions About Video Editing Costs</h2>

    <div class="faq-item">
        <div class="faq-q">How much does YouTube video editing cost per video in 2026?</div>
        <div class="faq-a"><strong>YouTube video editing costs $30 to $300+ per video</strong>, depending on length, complexity, and niche. A basic 5-10 minute edit runs $30-$60. A complex 20+ minute video with custom motion graphics and VFX costs $150-$280. Gaming videos with cinematic effects cost $120-$250. Use the estimator above to calculate your specific range.</div>
    </div>

    <div class="faq-item">
        <div class="faq-q">Is it cheaper to hire a video editor on Fiverr or through an agency?</div>
        <div class="faq-a">Fiverr prices are lower but come with significant quality variance, communication overhead, and no accountability layer. A $25 Fiverr edit often requires 4-5 revision rounds and still may not match a professional standard. A <strong>transparent agency like ExtoArts</strong> charges more per video, but includes a project manager, quality review, guaranteed revisions, and an editor matched to your specific niche - saving time and avoiding the revision spiral.</div>
    </div>

    <div class="faq-item">
        <div class="faq-q">How much does it cost to outsource YouTube video editing monthly?</div>
        <div class="faq-a">Outsourcing YouTube video editing on a monthly basis costs <strong>$200 to $1,200/month</strong> depending on upload frequency and complexity. 4 standard videos/month runs $200-$400. 8 gaming or complex videos/month runs $500-$900. Monthly retainers include priority delivery, a dedicated editor, and a 15-20% discount vs. per-video pricing.</div>
    </div>

    <div class="faq-item">
        <div class="faq-q">Does ExtoArts offer rush delivery for video editing?</div>
        <div class="faq-a">Yes. Standard delivery is 3-7 days. Priority delivery (2-3 days) and rush delivery (24-48 hours) are available at a surcharge. Rush edits require clean, pre-organized footage and a detailed brief to be achievable. Retainer clients receive automatic priority queue placement at no extra cost.</div>
    </div>

    <div class="faq-item">
        <div class="faq-q">What is included in a professional YouTube video edit?</div>
        <div class="faq-a">A professional YouTube video edit from ExtoArts includes: multi-track audio mixing, J-cuts and L-cuts for seamless pacing, color correction and grading, <strong>retention hooks</strong> (pattern interrupts, zoom-ins, reaction text), captions and lower-thirds, custom sound effects and music sync, and a final quality review by a senior editor. Motion graphics and VFX are available as add-ons or included depending on complexity tier.</div>
    </div>
</div>

<!-- ── CTA ── -->
<div class="est-cta" data-aos="fade-up">
    <h2 class="sweep-text">Ready for Your Exact Quote?</h2>
    <p>The estimator gives you a range. Discord gives you a number. Open a ticket, drop your brief, and we'll come back with a specific quote - usually within a few hours.</p>
    <div style="display:flex; gap:16px; justify-content:center; flex-wrap:wrap;">
        <button class="btn btn-main" style="padding:20px 48px;" onclick="openModal('discordModal')"><i class="ti ti-brand-discord"></i> Get a Custom Quote</button>
        <a href="/services" class="btn btn-glass" style="padding:20px 40px;">Explore Services</a>
    </div>
</div>

<script>
(function() {
    /* ── State ── */
    const state = {
        type: 'longform',
        length: 'short',
        complexity: 'standard',
        freq: 'oneoff',
        turnaround: 'standard'
    };

    /* ── Base price matrix [min, max] ── */
    const baseMatrix = {
        longform:   { short: [36, 55],  medium: [63, 109],  long: [127, 218] },
        gaming:     { short: [36, 72],  medium: [72, 145],  long: [145, 218] },
        shorts:     { short: [18, 45],  medium: [18, 45],   long: [18, 45]  },
        thumbnail:  { short: [13, 27],  medium: [13, 27],   long: [13, 27]  },
        faceless:   { short: [54, 109], medium: [90, 163],  long: [145, 245] },
        fullpackage:{ short: [54, 90],  medium: [90, 163],  long: [163, 290] }
    };

    /* ── Complexity multipliers ── */
    const complexMult = { basic: 0.75, standard: 1, advanced: 1.45, premium: 2.0 };

    /* ── Frequency (retainer) discounts ── */
    const freqData = {
        oneoff: { label: 'One-off project', discount: 0, vols: 1 },
        '4pm':  { label: '4 videos/month retainer', discount: 0.15, vols: 4 },
        '8pm':  { label: '8 videos/month retainer', discount: 0.18, vols: 8 },
        '12pm': { label: '12+ videos/month retainer', discount: 0.22, vols: 12 }
    };

    /* ── Turnaround ── */
    const turnaroundData = {
        standard: { label: 'Standard turnaround (3-7 days)', surcharge: 0 },
        priority: { label: 'Priority turnaround (2-3 days)',  surcharge: 0.20 },
        rush:     { label: 'Rush turnaround (24-48 hrs)',     surcharge: 0.40 }
    };

    function fmt(n) { return '$' + Math.round(n); }

    function calculate() {
        const type = state.type;
        const len  = (type === 'shorts' || type === 'thumbnail') ? 'short' : state.length;
        const [bMin, bMax] = baseMatrix[type][len];

        const cMult = complexMult[state.complexity];
        let min = bMin * cMult;
        let max = bMax * cMult;

        /* Turnaround surcharge applied BEFORE 10% fee */
        const tData = turnaroundData[state.turnaround];
        min *= (1 + tData.surcharge);
        max *= (1 + tData.surcharge);

        /* 10% agency fee: displayed base is 90%, total is 100% */
        const baseMin = min;
        const baseMax = max;
        const totalMin = Math.round(min / 0.9);
        const totalMax = Math.round(max / 0.9);
        const feeMin = totalMin - Math.round(baseMin);
        const feeMax = totalMax - Math.round(baseMax);

        const fData = freqData[state.freq];

        /* Display per-video total */
        document.getElementById('result-range').textContent = fmt(totalMin) + ' - ' + fmt(totalMax);
        document.getElementById('result-period').textContent = fData.label + ' \u00B7 ' + tData.label;
        document.getElementById('rb-base').textContent = fmt(Math.round(baseMin)) + ' - ' + fmt(Math.round(baseMax));
        document.getElementById('rb-fee').textContent = fmt(feeMin) + ' - ' + fmt(feeMax);
        document.getElementById('rb-turnaround').textContent = tData.surcharge > 0 ? '+' + Math.round(tData.surcharge * 100) + '%' : 'Included';
        document.getElementById('rb-total').textContent = fmt(totalMin) + ' - ' + fmt(totalMax);

        /* Retainer card */
        const rc = document.getElementById('retainer-card');
        if (state.freq === 'oneoff') {
            /* Show 4-video retainer estimate as upsell */
            const rMin = fmt(Math.round(totalMin * 4 * 0.85));
            const rMax = fmt(Math.round(totalMax * 4 * 0.85));
            document.getElementById('rc-range').textContent = rMin + ' - ' + rMax;
            document.getElementById('rc-sub').textContent = '4 videos/month · dedicated editor';
            document.getElementById('rc-saving').innerHTML = '<i class="ti ti-tag"></i> Save ~15% vs. per-video pricing';
        } else {
            const vols = fData.vols;
            const disc = fData.discount;
            const rMin = fmt(Math.round(totalMin * vols * (1 - disc)));
            const rMax = fmt(Math.round(totalMax * vols * (1 - disc)));
            document.getElementById('rc-range').textContent = rMin + ' - ' + rMax;
            document.getElementById('rc-sub').textContent = vols + ' videos/month · dedicated editor';
            document.getElementById('rc-saving').innerHTML = '<i class="ti ti-tag"></i> Save ~' + Math.round(disc * 100) + '% vs. per-video pricing';
        }
    }

    /* ── Button logic ── */
    const lengthGroup = document.getElementById('length-group');
    function updateLengthVisibility() {
        const hide = state.type === 'shorts' || state.type === 'thumbnail';
        lengthGroup.style.display = hide ? 'none' : '';
    }

    document.querySelectorAll('.opt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const group = btn.dataset.group;
            const val   = btn.dataset.val;
            state[group] = val;

            /* Deactivate siblings */
            btn.closest('.option-grid').querySelectorAll('.opt-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            updateLengthVisibility();
            calculate();
        });
    });

    /* Init */
    updateLengthVisibility();
    calculate();
})();
</script>

<?php include __DIR__ . '/../templates/footer.php'; ?>
