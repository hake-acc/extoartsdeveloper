<?php
declare(strict_types=1);
$page_title = "Brand Partnerships & Creative Collabs | ExtoArts";
$page_desc = "Commission motion graphics, VFX, thumbnails, video editing, and post-production from ExtoArts. One-off creative work for brands and creators with a high quality bar.";
$breadcrumbs = [['name' => 'Collab', 'url' => '/collab']];
include __DIR__ . '/../templates/header.php'; 
?>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://extoarts.in/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Collab",
      "item": "https://extoarts.in/collab"
    }
  ]
}
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://extoarts.in/collab",
  "url": "https://extoarts.in/collab",
  "name": "Brand Partnerships & Creative Collaborations | ExtoArts",
  "description": "Commission motion graphics, VFX, thumbnails, video editing, and post-production from ExtoArts. One-off creative work for brands and creators with a high quality bar.",
  "inLanguage": "en-US",
  "datePublished": "2024-01-01",
  "dateModified": "2026-06-17",
  "about": {"@id": "https://extoarts.in/#organization"},
  "publisher": {"@id": "https://extoarts.in/#organization"},
  "isPartOf": {"@id": "https://extoarts.in/#website"},
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": [".page-header", ".info-card"]
  }
}
</script>

<style>
    .collab-container { padding: 180px 20px 100px; max-width: 1200px; margin: 0 auto; position: relative; z-index: 10; }
    
    .page-header { text-align: center; margin-bottom: 80px; }
    .page-header h1 { font-size: clamp(3rem, 8vw, 5.5rem); font-weight: 900; line-height: 1.1; margin-bottom: 20px; letter-spacing: -2px; }
    .page-header p { font-size: 1.2rem; color: var(--text-muted); line-height: 1.6; max-width: 700px; margin: 0 auto; }

    /* Split Grid Layout */
    .collab-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: stretch; }
    @media (max-width: 900px) { .collab-grid { grid-template-columns: 1fr; } }

    /* Glass Cards */
    .info-card { padding: 50px 40px; border-radius: 40px; display: flex; flex-direction: column; justify-content: center; }
    .info-card:hover { border-color: rgba(34,211,238,0.28) !important; transform: translateY(-6px); box-shadow: 0 28px 70px rgba(0,0,0,0.48), 0 0 38px rgba(34,211,238,0.06); }
    
    .card-icon { width: 70px; height: 70px; background: rgba(0,210,255,0.05); border: 1px solid rgba(0,210,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin-bottom: 25px; }
    
    .info-card h2 { font-size: 2rem; font-weight: 900; margin-bottom: 20px; letter-spacing: -1px; }
    .info-card p { font-size: 1.05rem; line-height: 1.7; margin-bottom: 20px; }
    .info-card p:last-of-type { margin-bottom: 0; }

    .collab-build-note { font-size: .92rem; color: var(--text-muted); margin-top: 16px; margin-bottom: 16px; line-height: 1.6; }
    .tag-cloud { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 16px; }
    .tag { background: var(--bg); border: 1px solid var(--border); padding: 8px 16px; border-radius: 50px; font-size: 0.85rem; font-weight: 800; letter-spacing: 1px; color: var(--text-main); }

    .cta-wrapper { text-align: center; margin-top: 80px; }
</style>

<div class="collab-container">
    <div class="page-header" data-aos="fade-down">
        <span class="sec-label-inline">Work With Us</span>
        <h1>
            <span class="sr-only">Brand Partnerships & Creative Collaborations | ExtoArts</span>
            <span aria-hidden="true"><span style="color: var(--text-main);">Creative </span><span class="cycle-stack" aria-label="Partnerships." style="color: var(--primary); -webkit-text-fill-color: var(--primary);"><span class="cycle-phrase is-active">Partnerships.</span><span class="cycle-phrase" aria-hidden="true">Collabs.</span><span class="cycle-phrase" aria-hidden="true">Commissions.</span></span></span>
        </h1>
        <p>We don't take every brief. We take the ones where there's a clear vision, real scope, and room to do the work properly.</p>
    </div>

    <div class="collab-grid">
        <div class="info-card" data-aos="fade-right">
            <div class="card-icon"><i class="ti ti-send"></i></div>
            <h2>How It Works</h2>
            <p>Open a ticket in our Discord server with your brief. Include what you’re building, visual references, and what success looks like for the finished deliverable. We review every brief the same day.</p>
            <p>If the project is the right fit, we’ll quote it and give you a clear timeline. If it isn’t, we’ll say so directly - no ghosting, no polite deflection. That’s the only way to keep the quality bar where it needs to be.</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 40px;">
            <div class="info-card" data-aos="fade-left" data-aos-delay="100">
                <div class="card-icon" style="color: var(--purple); border-color: var(--purple);"><i class="ti ti-sparkles" style="color:var(--purple);"></i></div>
                <h2>What We Build</h2>
                <p class="collab-build-note">Every deliverable goes through an internal review before it leaves our hands. We don’t hand off rough cuts and call them first passes.</p>
                <div class="tag-cloud">
                    <span class="tag">Motion Graphics</span>
                    <span class="tag">VFX</span>
                    <span class="tag">Thumbnails</span>
                    <span class="tag">Video Editing</span>
                    <span class="tag">Sound Design</span>
                    <span class="tag">Post-Production</span>
                    <span class="tag">3D Design</span>
                    <span class="tag">Intro / Outro</span>
                </div>
            </div>

            <div class="info-card" data-aos="fade-left" data-aos-delay="200" style="padding: 40px;">
                <h2 style="font-size: 1.5rem; display:flex; align-items:center; gap:10px;"><i class="ti ti-receipt" style="font-size:19px;color:var(--primary);"></i> Pricing</h2>
                <p>We quote based on what the work actually requires - not what the client hopes to spend. Most one-off collab projects land between $80 and $800 depending on scope and turnaround. We don’t publish a rate card because creative scope varies too much to pre-price it honestly.</p>
            </div>
        </div>

    </div>

    <div class="cta-wrapper" data-aos="fade-up">
        <button class="btn-luma" onclick="openModal('discordModal')"><span>
            <i class="ti ti-brand-discord"></i> Send a Brief</span>
        </button>
    </div>

</div>

<?php include __DIR__ . '/../templates/footer.php'; ?>
