<?php
declare(strict_types=1);
$page_title = "YouTube Video Editing Pricing & Rates | ExtoArts";
$page_desc = "ExtoArts charges a flat 10% agency fee - 90% goes to your editor. Transparent YouTube video editing rates, project pricing, and monthly retainer packages.";
$breadcrumbs = [['name' => 'Pricing', 'url' => '/pricing']];
include __DIR__ . '/../templates/header.php'; 
?>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "PriceSpecification",
  "name": "ExtoArts Video Editing Pricing",
  "description": "Transparent video editing pricing with a flat 10% agency fee. 90% of the budget goes directly to the editor. Custom quotes for one-off projects and discounted monthly retainer packages available.",
  "priceCurrency": "USD",
  "eligibleCustomerType": "https://schema.org/Enduser"
}
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://extoarts.in/" },
    { "@type": "ListItem", "position": 2, "name": "Pricing", "item": "https://extoarts.in/pricing" }
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://extoarts.in/pricing",
  "url": "https://extoarts.in/pricing",
  "name": "Video Editing Pricing, Rates & Packages | ExtoArts",
  "description": "ExtoArts charges a flat 10% agency fee - 90% goes to your editor. Explore transparent video editing rates, project pricing, and monthly retainer packages.",
  "inLanguage": "en-US",
  "datePublished": "2024-01-01",
  "dateModified": "2026-06-17",
  "about": {"@id": "https://extoarts.in/#organization"},
  "publisher": { "@id": "https://extoarts.in/#organization" },
  "isPartOf": { "@id": "https://extoarts.in/#website" },
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": [".page-header", ".pricing-section", ".cost-guide-faq"]
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
      "acceptedAnswer": { "@type": "Answer", "text": "YouTube video editing ranges from $20-$80 for basic freelancer work, $100-$350 for specialist mid-tier editing, and $400-$1,200+ for premium agency productions. ExtoArts operates on a flat 10% fee - you set the budget, ExtoArts takes 10%, and 90% goes to the specialist editor. Most projects fall between $50-$400 per video." }
    },
    {
      "@type": "Question",
      "name": "What affects the cost of video editing for YouTube?",
      "acceptedAnswer": { "@type": "Answer", "text": "The main cost drivers are: video length, complexity (basic cuts vs motion graphics), turnaround speed (rush fees add 25-50%), the editor's niche specialization, and revision rounds included. Motion graphics and VFX work can add 30-100% to base costs." }
    },
    {
      "@type": "Question",
      "name": "Is professional YouTube video editing worth the cost?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes. Professional editing directly improves Average View Duration (AVD), which is the primary signal YouTube's algorithm uses to distribute content. Channels that improve AVD from 30% to 50%+ typically see 2-3x improvement in reach within 60-90 days." }
    },
    {
      "@type": "Question",
      "name": "How much does ExtoArts charge for video editing?",
      "acceptedAnswer": { "@type": "Answer", "text": "ExtoArts charges a flat 10% agency management fee. A creator with a $200 per video budget pays ExtoArts $20 and their assigned specialist editor receives $180. No retainer fees, no setup costs, no hidden charges. Custom quotes are issued through the Discord ticket for every project." }
    },
    {
      "@type": "Question",
      "name": "What payment methods does ExtoArts accept?",
      "acceptedAnswer": { "@type": "Answer", "text": "ExtoArts accepts PayPal, bank transfer, USDT, BTC, ETH, UPI, EasyPaisa, Bkash, and PKR transfer. Most projects require a 50% deposit before work begins, with the remaining balance due before final delivery." }
    }
  ]
}
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://extoarts.in/pricing#service",
  "name": "YouTube Video Editing - Transparent Pricing",
  "description": "ExtoArts charges a flat 10% agency fee for YouTube video editing, thumbnail design, Shorts editing, and channel automation. 90% of your budget goes directly to your assigned specialist editor.",
  "provider": { "@id": "https://extoarts.in/#organization" },
  "serviceType": "YouTube Video Editing Agency",
  "areaServed": { "@type": "GeoShape", "name": "Worldwide" },
  "url": "https://extoarts.in/pricing",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "description": "Flat 10% agency fee. You set the budget - 90% goes to your specialist editor. No retainer lock-in, no hidden fees.",
    "url": "https://extoarts.in/pricing"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Video Editing Pricing Tiers",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "YouTube Short / TikTok Editing", "description": "Under 3 minutes. Market rate $30-$100." } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Standard YouTube Video Editing", "description": "5-15 minutes. Market rate $80-$250." } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Long-Form YouTube Editing", "description": "15-30 minutes. Market rate $150-$450." } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Gaming Video Editing", "description": "8-20 minutes. Market rate $100-$300." } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Thumbnail Design", "description": "Per image. Market rate $25-$120." } }
    ]
  }
}
</script>

<style>
    .page-header { padding: 180px 20px 80px; text-align: center; max-width: 860px; margin: 0 auto; position: relative; z-index: 10; }
    .page-header h1 { font-size: clamp(3rem, 8vw, 5.5rem); font-weight: 900; line-height: 1.1; margin-bottom: 20px; letter-spacing: -2px; min-height: 1.5em; }
    .page-header p { font-size: 1.1rem; color: var(--text-muted); line-height: 1.7; max-width: 540px; margin: 0 auto; }

    .golden-rule { max-width: 1000px; margin: 0 auto 60px; border: 1px solid var(--primary) !important; border-radius: 36px; padding: 55px 45px; display: flex; align-items: center; gap: 40px; position: relative; z-index: 10; background: var(--surface) !important; backdrop-filter: blur(10px); box-shadow: 0 0 60px var(--primary-glow) !important; }
    .rule-number { font-size: 6rem; font-weight: 900; color: var(--primary); line-height: 1; text-shadow: 0 0 40px rgba(0,210,255,0.4); flex-shrink: 0; }
    .rule-text h2 { font-size: 1.8rem; font-weight: 800; margin-bottom: 12px; }
    .rule-text p { font-size: 1rem; line-height: 1.7; }
    @media (max-width: 768px) { .golden-rule { flex-direction: column; text-align: center; gap: 20px; padding: 40px 25px; } }

    .pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 25px; max-width: 1100px; margin: 0 auto 80px; padding: 24px 20px 0; position: relative; z-index: 10; }
    .price-card { padding: 50px 40px; transition: transform 0.4s var(--easing), border-color 0.3s, box-shadow 0.3s; display: flex; flex-direction: column; border: 1px solid var(--border); border-radius: 36px; }
    .price-card:hover { transform: translateY(-6px); border-color: rgba(34,211,238,0.28) !important; box-shadow: 0 28px 70px rgba(0,0,0,0.52), 0 0 40px rgba(34,211,238,0.07) !important; }
    
    .price-card.premium { border-color: var(--purple) !important; position: relative; isolation: isolate; margin-top: 0; }
    .price-card.premium::before { content: 'RECOMMENDED'; position: absolute; top: -16px; left: 50%; transform: translateX(-50%); background: var(--purple); color: #fff; font-size: 0.68rem; font-weight: 900; padding: 5px 16px; border-radius: 50px; letter-spacing: 2px; text-transform: uppercase; white-space: nowrap; z-index: 2; box-shadow: 0 4px 12px rgba(139,92,246,0.35); }
    .price-card.premium:hover { border-color: rgba(167,139,250,0.32) !important; box-shadow: 0 28px 70px rgba(0,0,0,0.52), 0 0 40px rgba(167,139,250,0.10) !important; }
    
    .p-title { font-size: 1.5rem; font-weight: 800; margin-bottom: 12px; letter-spacing: -0.5px; }
    .p-desc { font-size: 0.95rem; margin-bottom: 28px; line-height: 1.65; flex-grow: 1; }
    .p-price { font-size: 2.2rem; font-weight: 900; margin-bottom: 28px; border-bottom: 1px solid var(--border); padding-bottom: 28px; letter-spacing: -1px; }
    .p-price span { font-size: 0.95rem; font-weight: 500; letter-spacing: 0; }
    
    .p-features { list-style: none; margin-bottom: 38px; }
    .p-features li { margin-bottom: 14px; font-size: 0.95rem; display: flex; align-items: flex-start; gap: 12px; line-height: 1.5; }
    .p-features li i { color: var(--primary); margin-top: 2px; flex-shrink: 0; animation: checkPulse 2.8s ease-in-out infinite; }
    .premium .p-features li i { color: var(--purple); animation: checkPulseP 2.8s ease-in-out infinite; }
    .p-features li:nth-child(2) i { animation-delay: 0.4s; }
    .p-features li:nth-child(3) i { animation-delay: 0.8s; }
    .p-features li:nth-child(4) i { animation-delay: 1.2s; }
    .p-features li:nth-child(5) i { animation-delay: 1.6s; }
    @keyframes checkPulse {
        0%, 100% { color: var(--primary); filter: drop-shadow(0 0 0px rgba(34,211,238,0)); transform: scale(1); }
        50% { color: #22d3ee; filter: drop-shadow(0 0 6px rgba(34,211,238,0.7)); transform: scale(1.18); }
    }
    @keyframes checkPulseP {
        0%, 100% { color: var(--purple); filter: drop-shadow(0 0 0px rgba(59,130,246,0)); transform: scale(1); }
        50% { color: #818cf8; filter: drop-shadow(0 0 6px rgba(59,130,246,0.7)); transform: scale(1.18); }
    }

    .pricing-faq { max-width: 860px; margin: 0 auto 120px; padding: 0 20px; text-align: center; }
    .pricing-faq h2 { font-size: clamp(2rem, 4vw, 3rem); font-weight: 900; margin-bottom: 20px; letter-spacing: -1px; }
    .pricing-faq p { font-size: 1rem; color: var(--text-muted); line-height: 1.75; margin-bottom: 15px; }
    .pricing-faq strong { color: var(--text-main); }

    /* ===== COST GUIDE (merged from /video-editing-cost) ===== */
    .cost-tier-grid { max-width: 1100px; margin: 0 auto 80px; display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 22px; padding: 0 20px; position: relative; z-index: 10; }
    .cost-tier { background: var(--surface); border: 1px solid var(--border); border-radius: 28px; padding: 38px 32px; }
    .cost-tier.featured { border-color: rgba(34,211,238,0.32); box-shadow: 0 0 44px rgba(34,211,238,0.10), 0 20px 60px rgba(0,0,0,0.42); }
    .tier-label { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: var(--text-muted); margin-bottom: 10px; }
    .tier-label.hot { color: var(--primary); }
    .cost-tier h3 { font-size: clamp(1.1rem, 2vw, 1.4rem); font-weight: 900; margin-bottom: 8px; }
    .cost-range { font-size: clamp(1.4rem, 3vw, 1.8rem); font-weight: 900; color: var(--primary); margin-bottom: 16px; }
    .cost-range span { font-size: 1rem; font-weight: 500; color: var(--text-muted); }
    .cost-tier ul { list-style: none; padding: 0; margin: 0; }
    .cost-tier ul li { display: flex; gap: 10px; align-items: flex-start; font-size: 0.92rem; line-height: 1.65; margin-bottom: 10px; }
    .cost-tier ul li i { color: var(--primary); font-size: 0.8rem; margin-top: 4px; flex-shrink: 0; }
    .price-table-section { max-width: 900px; margin: 0 auto 80px; padding: 0 20px; position: relative; z-index: 10; }
    .price-table-section h2 { font-size: clamp(1.6rem, 3.5vw, 2.2rem); font-weight: 900; letter-spacing: -1px; margin-bottom: 10px; line-height: 1.2; }
    .price-table-section > p { font-size: 0.97rem; color: var(--text-muted); line-height: 1.7; margin-bottom: 24px; }
    .price-table { width: 100%; border-collapse: collapse; font-size: 0.95rem; }
    .price-table th { background: var(--surface); padding: 14px 18px; text-align: left; font-weight: 800; border-bottom: 2px solid var(--primary); color: var(--primary); }
    .price-table td { padding: 14px 18px; border-bottom: 1px solid var(--border); vertical-align: top; line-height: 1.6; }
    .price-table tr:hover td { background: rgba(0,210,255,0.025); }
    .price-highlight { color: var(--primary); font-weight: 800; }
    .pricing-tstack { max-width: 1000px; margin: 0 auto; padding: 0 20px 56px; }
    .pricing-tstack-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }
    .pricing-tbadge { display: inline-flex; align-items: center; gap: 8px; background: var(--surface); border: 1px solid var(--border); border-radius: 50px; padding: 9px 18px 9px 14px; font-size: .76rem; font-weight: 600; color: var(--text-muted); transition: border-color .2s, color .2s; }
    .pricing-tbadge:hover { border-color: rgba(34,211,238,.22); color: var(--text-main); }
    .pricing-tbadge i { color: var(--primary); font-size: .78rem; flex-shrink: 0; }
    [data-theme="light"] .pricing-tbadge { background: #fff; border-color: rgba(0,0,0,.08); }
    .cost-factors { max-width: 860px; margin: 0 auto 80px; padding: 0 20px; position: relative; z-index: 10; }
    .cost-factors h2 { font-size: clamp(1.6rem, 3.5vw, 2.2rem); font-weight: 900; letter-spacing: -1px; margin-bottom: 20px; }
    .cost-factors ul { list-style: none; padding: 0; margin: 0; }
    .cost-factors ul li { display: flex; align-items: flex-start; gap: 12px; font-size: 1rem; line-height: 1.75; margin-bottom: 14px; }
    .cost-factors ul li i { margin-top: 3px; flex-shrink: 0; }
    .cost-guide-faq { max-width: 860px; margin: 0 auto 80px; padding: 0 20px; position: relative; z-index: 10; }
    .cost-guide-faq h2 { font-size: clamp(1.6rem, 3.5vw, 2.2rem); font-weight: 900; letter-spacing: -1px; margin-bottom: 30px; }
    .faq-item-q { font-size: 1.05rem; font-weight: 800; margin-bottom: 10px; }
    .faq-item-a { font-size: 0.97rem; line-height: 1.82; margin-bottom: 28px; padding-bottom: 24px; border-bottom: 1px solid var(--border); }
    .cost-guide-divider { max-width: 860px; margin: 0 auto 80px; padding: 0 20px; text-align: center; }
    .cost-guide-divider h2 { font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 900; letter-spacing: -0.5px; margin-bottom: 12px; }
    .cost-guide-divider p { font-size: 0.97rem; color: var(--text-muted); line-height: 1.7; }
    [data-theme="light"] .price-table th { background: rgba(0,0,0,0.04); }
    @media (max-width: 768px) { .cost-tier-grid { grid-template-columns: 1fr; } .price-table { font-size: 0.82rem; } .price-table th, .price-table td { padding: 10px 12px; } }
</style>

<div class="page-header" data-aos="fade-down">
    <span style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 4px; color: var(--primary); margin-bottom: 20px; display: block;">Transparent Pricing</span>
    <h1 style="color: var(--text-main);">
        <span class="sr-only">Video Editing Pricing, Rates & Retainer Packages | ExtoArts</span>
        <span aria-hidden="true"><span style="color: var(--text-main);">The </span><span style="color: var(--primary); -webkit-text-fill-color: var(--primary);">Rates.</span></span>
    </h1>
    <p>We stripped out the agency markup. You pay for the edit - not the account manager, not the coordinator, not the overhead. Rates vary by project scope because no two briefs have the same requirements.</p>
</div>

<div class="golden-rule process-card" data-aos="fade-up" style="padding: 55px 45px !important;">
    <div class="rule-number">10%</div>
    <div class="rule-text">
        <h2>The Flat Agency Fee, Always</h2>
        <p>Most agencies quietly take 30 to 50 percent of your budget, leaving the actual editor underpaid and unmotivated. We charge a flat 10% to cover management and quality assurance. <strong style="color: var(--text-main);">90% of your money goes directly to the artist building your video.</strong> Better pay, better results, every single time.</p>
    </div>
</div>

<div style="max-width:1100px;margin:0 auto 10px;padding:0 20px;display:flex;align-items:center;gap:12px;flex-wrap:wrap;" data-aos="fade-up">
    <div style="display:flex;align-items:center;gap:8px;padding:10px 18px;background:rgba(0,210,255,.06);border:1px solid rgba(0,210,255,.2);border-radius:50px;">
        <i class="ti ti-info-circle" style="color:var(--primary);font-size:.8rem;flex-shrink:0;"></i>
        <span style="font-size:.82rem;color:var(--text-muted);">Most one-off projects fall between <strong style="color:var(--text-main);">$50-$400</strong>. You set the budget, we make it work.</span>
    </div>
</div>

<div class="pricing-grid">
    <div class="price-card" data-aos="fade-up" data-aos-delay="100">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:26px;">
            <div style="width:42px;height:42px;background:rgba(34,211,238,.08);border:1px solid rgba(34,211,238,.2);border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                <i class="ti ti-bolt" aria-hidden="true" style="font-size:1.2rem;color:var(--primary);"></i>
            </div>
            <span style="font-size:.6rem;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:var(--text-muted);">One-Off</span>
        </div>
        <h3 class="p-title">One-Off Project</h3>
        <p class="p-desc">Perfect for testing our quality on a single video or thumbnail, or handling overflow when your usual editor is backed up.</p>
        <div class="p-price">Custom <span>/ per deliverable</span></div>
        <ul class="p-features">
            <li><i class="ti ti-check"></i> Matched to a specialist editor for your niche</li>
            <li><i class="ti ti-check"></i> 3 rounds of revisions included</li>
            <li><i class="ti ti-check"></i> 50% upfront, 50% on final delivery</li>
            <li><i class="ti ti-check"></i> Quality review by a Hub Manager before delivery</li>
            <li><i class="ti ti-check"></i> High-res final export (PNG/JPG/MP4)</li>
        </ul>
        <button class="btn btn-glass" style="width: 100%;" onclick="openModal('discordModal')">Get a Quote on Discord</button>
    </div>

    <div class="price-card premium" data-aos="fade-up" data-aos-delay="200">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:26px;">
            <div style="width:42px;height:42px;background:rgba(34,211,238,.12);border:1px solid rgba(34,211,238,.3);border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                <i class="ti ti-repeat" aria-hidden="true" style="font-size:1.2rem;color:var(--primary);"></i>
            </div>
            <span style="font-size:.6rem;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:var(--primary);">Most Popular</span>
        </div>
        <h3 class="p-title">Monthly Retainer</h3>
        <p class="p-desc">Lock in a dedicated editor who learns your channel's style inside and out. Consistent quality, faster turnarounds, and a bulk discount applied automatically.</p>
        <div class="p-price">Discounted <span>/ monthly</span></div>
        <ul class="p-features">
            <li><i class="ti ti-check"></i> Priority queue, your projects go first</li>
            <li><i class="ti ti-check"></i> A dedicated editor who grows with your channel</li>
            <li><i class="ti ti-check"></i> Automatic bulk-pricing discount</li>
            <li><i class="ti ti-check"></i> Cancel or pause anytime, no lock-in contracts</li>
            <li><i class="ti ti-check"></i> Monthly performance check-in</li>
        </ul>
        <button class="btn btn-main" style="width: 100%;" onclick="openModal('discordModal')">Negotiate Your Retainer</button>
    </div>
</div>

<div style="max-width:1100px;margin:0 auto 60px;padding:0 20px;" data-aos="fade-up">
    <div style="background:linear-gradient(135deg,rgba(34,211,238,.06) 0%,rgba(139,92,246,.06) 100%);border:1px solid rgba(34,211,238,.2);border-radius:28px;padding:36px 40px;display:flex;gap:32px;align-items:flex-start;flex-wrap:wrap;">
        <div style="width:48px;height:48px;flex-shrink:0;background:rgba(34,211,238,.08);border:1px solid rgba(34,211,238,.2);border-radius:14px;display:flex;align-items:center;justify-content:center;" aria-hidden="true"><i class="ti ti-shield-check" style="font-size:1.4rem;color:var(--primary);"></i></div>
        <div>
            <h3 style="font-size:1.3rem;font-weight:900;margin:0 0 10px;letter-spacing:-.4px;color:var(--text-main);">Quality Guaranteed - Revisions Until It's Right</h3>
            <p style="font-size:.95rem;color:var(--text-muted);line-height:1.7;margin:0 0 14px;">Every project includes 3 rounds of revisions. If the first draft isn't close, we fix it. If the second isn't right, we fix it again. We don't close a ticket until you're satisfied with the work.</p>
            <div style="display:flex;gap:10px;flex-wrap:wrap;">
                <span style="font-size:.72rem;font-weight:700;padding:4px 12px;background:rgba(34,211,238,.1);border:1px solid rgba(34,211,238,.25);border-radius:20px;color:var(--primary);">3+ Revision Rounds</span>
                <span style="font-size:.72rem;font-weight:700;padding:4px 12px;background:rgba(34,211,238,.1);border:1px solid rgba(34,211,238,.25);border-radius:20px;color:var(--primary);">QC Before Delivery</span>
                <span style="font-size:.72rem;font-weight:700;padding:4px 12px;background:rgba(34,211,238,.1);border:1px solid rgba(34,211,238,.25);border-radius:20px;color:var(--primary);">No Commitment Until You Approve</span>
            </div>
        </div>
    </div>
</div>

<div class="pricing-faq" data-aos="fade-up">
    <h2 class="sweep-text">A Few Things Worth Knowing</h2>
    <p>
        <strong>Why Custom Pricing?</strong> Every video is different. A 5-minute vlog edit isn't the same as a 20-minute documentary with custom VFX. Charging them the same rate would be unfair to everyone. We quote based on actual scope.
    </p>
    <p>
        <strong>What counts as the 10%?</strong> The agency fee covers project management, quality assurance reviews, communication coordination, and platform costs. It's not just a middleman charge, it's the reason your project actually gets done on time.
    </p>
    <p>
        <strong>How do I get an exact number?</strong> Open a ticket on our Discord, give us your niche, video length, style references, and upload frequency. We'll come back with a specific quote, usually within a few hours.
    </p>
    <div style="margin-top: 40px; display:flex; gap:16px; justify-content:center; flex-wrap:wrap;">
        <button class="btn-luma" onclick="openModal('discordModal')"><span><i class="ti ti-brand-discord"></i> Get a Quote</span></button>
        <a href="/estimate" class="btn btn-glass transition-link" style="padding: 20px 36px; display:inline-flex; align-items:center; gap:8px;"><i class="ti ti-calculator" style="font-size:20px;flex-shrink:0;"></i> Use the Cost Estimator</a>
    </div>
</div>

<!-- ===== COST GUIDE (merged from /video-editing-cost) ===== -->

<div class="cost-guide-divider" data-aos="fade-up">
    <span style="font-size:0.66rem;font-weight:700;text-transform:uppercase;letter-spacing:4px;color:var(--text-muted);display:block;margin-bottom:14px;">Market Rates</span>
    <h2>What Does Video Editing Actually Cost?</h2>
    <p>What the market actually charges in 2026 - from budget freelancers to traditional agencies. ExtoArts sits between the two, with the quality of the second and the accessibility of the first.</p>
</div>

<div class="cost-tier-grid">
    <div class="cost-tier" data-aos="fade-up">
        <div class="tier-label">Tier 1</div>
        <h3>Budget Freelancers</h3>
        <div class="cost-range">$20-$80 <span>per video</span></div>
        <ul>
            <li><i class="ti ti-check"></i>Basic cuts and J-cuts</li>
            <li><i class="ti ti-check"></i>Auto-generated captions</li>
            <li><i class="ti ti-check"></i>Simple color correction</li>
            <li><i class="ti ti-x" style="color:#ff6b6b"></i>No niche specialization</li>
            <li><i class="ti ti-x" style="color:#ff6b6b"></i>Variable reliability and quality</li>
            <li><i class="ti ti-x" style="color:#ff6b6b"></i>No quality control before delivery</li>
        </ul>
    </div>
    <div class="cost-tier featured" data-aos="fade-up" data-aos-delay="80">
        <div class="tier-label hot">Tier 2 - ExtoArts</div>
        <h3>Specialist Agency</h3>
        <div class="cost-range">10% <span>flat agency fee</span></div>
        <ul>
            <li><i class="ti ti-check"></i>Niche-matched specialist editor</li>
            <li><i class="ti ti-check"></i>Retention engineering and hook structuring</li>
            <li><i class="ti ti-check"></i>Sound design and motion graphics</li>
            <li><i class="ti ti-check"></i>Pre-delivery quality control review</li>
            <li><i class="ti ti-check"></i>3+ revision rounds included</li>
            <li><i class="ti ti-check"></i>90% of budget to your editor</li>
        </ul>
    </div>
    <div class="cost-tier" data-aos="fade-up" data-aos-delay="160">
        <div class="tier-label">Tier 3</div>
        <h3>Traditional Agencies</h3>
        <div class="cost-range">$400-$1,200+ <span>per video</span></div>
        <ul>
            <li><i class="ti ti-check"></i>Full-service production team</li>
            <li><i class="ti ti-check"></i>Account manager and project coordinator</li>
            <li><i class="ti ti-check"></i>Multiple revision rounds</li>
            <li><i class="ti ti-x" style="color:#ff6b6b"></i>30-50% agency commission</li>
            <li><i class="ti ti-x" style="color:#ff6b6b"></i>Often requires retainer contracts</li>
            <li><i class="ti ti-x" style="color:#ff6b6b"></i>Less creator gets for their budget</li>
        </ul>
    </div>
</div>

<div class="price-table-section" data-aos="fade-up">
    <h2>YouTube Video Editing Rates by Video Type</h2>
    <p>Typical market rates for professional video editing in 2026. ExtoArts projects are governed by the flat 10% agency fee - you set your budget within these ranges.</p>
    <table class="price-table">
        <thead>
            <tr>
                <th>Video Type</th>
                <th>Length</th>
                <th>Market Rate</th>
                <th>Complexity</th>
            </tr>
        </thead>
        <tbody>
            <tr><td><strong>YouTube Short / TikTok</strong></td><td>Under 3 min</td><td class="price-highlight">$30-$100</td><td>Low-Medium</td></tr>
            <tr><td><strong>Standard YouTube Video</strong></td><td>5-15 min</td><td class="price-highlight">$80-$250</td><td>Medium</td></tr>
            <tr><td><strong>Long-Form YouTube</strong></td><td>15-30 min</td><td class="price-highlight">$150-$450</td><td>Medium-High</td></tr>
            <tr><td><strong>Gaming Video Edit</strong></td><td>8-20 min</td><td class="price-highlight">$100-$300</td><td>Medium (niche expertise required)</td></tr>
            <tr><td><strong>Motion Graphics Heavy</strong></td><td>Any</td><td class="price-highlight">$200-$800+</td><td>High (After Effects work)</td></tr>
            <tr><td><strong>Faceless Channel Video</strong></td><td>8-20 min</td><td class="price-highlight">$120-$400</td><td>Medium-High (full production)</td></tr>
            <tr><td><strong>Thumbnail Design</strong></td><td>Per image</td><td class="price-highlight">$25-$120</td><td>Medium (CTR-optimized design)</td></tr>
        </tbody>
    </table>
</div>

<div class="pricing-tstack" data-aos="fade-up">
<div class="pricing-tstack-row">
    <span class="pricing-tbadge"><i class="ti ti-rotate-clockwise"></i> 3 Revision Rounds Always Included</span>
    <span class="pricing-tbadge"><i class="ti ti-clock"></i> 24-48h Thumbnail Turnaround</span>
    <span class="pricing-tbadge"><i class="ti ti-target"></i> Niche-Matched Editor Assignment</span>
    <span class="pricing-tbadge"><i class="ti ti-percentage"></i> 90% of Budget to Your Editor</span>
    <span class="pricing-tbadge"><i class="ti ti-file-description"></i> No Contracts or Retainers</span>
</div>
</div>

<section class="cost-factors" data-aos="fade-up">
    <h2>What Drives Editing Costs Up or Down</h2>
    <ul>
        <li><i class="ti ti-arrow-up" style="color:#ff6b6b"></i><span><strong>Motion graphics and VFX</strong> - Custom After Effects work, 3D elements, and complex animations add 30-100% to base editing costs.</span></li>
        <li><i class="ti ti-arrow-up" style="color:#ff6b6b"></i><span><strong>Rush turnaround</strong> - Same-day or 48-hour delivery typically costs 25-50% more than standard 3-5 business day turnaround.</span></li>
        <li><i class="ti ti-arrow-up" style="color:#ff6b6b"></i><span><strong>Raw footage volume</strong> - More footage to review and cut from means more editing time and higher cost per finished minute.</span></li>
        <li><i class="ti ti-arrow-down" style="color:#22d88a"></i><span><strong>Regular retainer volume</strong> - Creators who order 4+ videos per month typically negotiate lower per-video rates.</span></li>
        <li><i class="ti ti-arrow-down" style="color:#22d88a"></i><span><strong>Tight briefs</strong> - Well-prepared briefs with timestamps, references, and clear instructions reduce revision rounds and total cost.</span></li>
        <li><i class="ti ti-arrow-down" style="color:#22d88a"></i><span><strong>Standard formats</strong> - Established formats (talking head, gaming commentary, explainer) cost less than highly customized styles.</span></li>
    </ul>
</section>

<section class="cost-guide-faq" data-aos="fade-up">
    <h2>Cost - Frequently Asked Questions</h2>
    <div>
        <p class="faq-item-q">How much does YouTube video editing cost in 2026?</p>
        <p class="faq-item-a">YouTube video editing ranges from $20-$80 for basic freelancer work, $100-$350 for specialist mid-tier editing, and $400-$1,200+ for premium agency productions. ExtoArts operates on a flat 10% fee - you set the budget, ExtoArts takes 10%, and 90% goes to the specialist editor. Most projects fall between $50-$400 per video.</p>
    </div>
    <div>
        <p class="faq-item-q">What affects the cost of video editing for YouTube?</p>
        <p class="faq-item-a">The main cost drivers are: video length, complexity (basic cuts vs motion graphics), turnaround speed (rush fees add 25-50%), the editor's niche specialization, and revision rounds included. Motion graphics and VFX work can add 30-100% to base costs.</p>
    </div>
    <div>
        <p class="faq-item-q">Is professional YouTube video editing worth the cost?</p>
        <p class="faq-item-a">Yes. Professional editing directly improves Average View Duration (AVD), which is the primary signal YouTube's algorithm uses to distribute content. Channels that improve AVD from 30% to 50%+ typically see 2-3x improvement in reach within 60-90 days.</p>
    </div>
    <div>
        <p class="faq-item-q">How much does ExtoArts charge for video editing?</p>
        <p class="faq-item-a">ExtoArts charges a flat 10% agency management fee. A creator with a $200 per video budget pays ExtoArts $20 and their assigned specialist editor receives $180. No retainer fees, no setup costs, no hidden charges. Custom quotes are issued through the Discord ticket for every project.</p>
    </div>
</section>

<?php include __DIR__ . '/../templates/footer.php'; ?>
