import Head from 'next/head';
import Layout from '../components/Layout';

export default function Page() {
  return (
    <Layout currentPage="portfolio">
      <Head>
        <title>YouTube Editing Portfolio - Thumbnails & Video Edits | ExtoArts</title>
        <meta name="description" content="Browse the ExtoArts portfolio - gaming thumbnails, YouTube video edits, TikTok short-form content, motion graphics, and more. Real work from real editors." />
      </Head>
 
 */}

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
  "dateModified": "2026-05-06",
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

    .item-card { background: radial-gradient(circle at top left, rgba(0,210,255,0.16), transparent 38%), var(--surface); border: 1px solid var(--border); border-radius: 28px; overflow: hidden; aspect-ratio: 1/1; position: relative; cursor: pointer; transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); animation: cardIn 0.5s ease-out backwards; box-shadow: 0 8px 25px var(--shadow); }
    @keyframes cardIn { from { opacity: 0; transform: scale(0.9) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
    .item-card:hover { transform: translateY(-10px) scale(1.03); border-color: var(--primary) !important; box-shadow: 0 20px 50px var(--primary-glow) !important; }
    .item-card::after { content: ''; position: absolute; inset: 0; background: linear-gradient(160deg, rgba(255,255,255,0.14), transparent 34%, rgba(0,0,0,0.58)); pointer-events: none; }
    .item-card img { width: 100%; height: 100%; object-fit: cover; opacity: 0.82; transition: 0.6s; pointer-events: none; }
    .item-card:hover img { opacity: 1; transform: scale(1.08); }
    .item-info { position: absolute; bottom: 0; left: 0; width: 100%; padding: 22px 16px; background: linear-gradient(to top, rgba(0,0,0,0.92), transparent); text-align: left; z-index: 2; }
    .item-info h3 { font-size: 0.95rem; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; color: #fff !important; margin: 0 0 7px; }
    .item-info small { color: var(--primary); font-size: 0.66rem; font-weight: 900; text-transform: uppercase; letter-spacing: 1.8px; }

    .work-card { aspect-ratio: auto !important; cursor: pointer; transition: 0.3s; }
    .work-card:active { transform: scale(0.97); }
    .wrapper { width: 100%; border-radius: 24px; overflow: hidden; position: relative; border: 1px solid var(--border); transition: 0.4s; background: var(--bg); box-shadow: 0 8px 20px var(--shadow); }
    .work-card:hover .wrapper { border-color: var(--primary); transform: translateY(-5px); box-shadow: 0 20px 40px var(--primary-glow) !important; }
    
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

<div className="container">
    <div className="controls">
        <div id="backBtn" className="back-btn" onclick="goBack()"><i className="fas fa-chevron-left"></i> Back</div>
    </div>
    
    <div className="header-box" data-aos="fade-down">
        <span style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 4px; color: var(--primary); margin-bottom: 12px; display: block;">Our Work</span>
        <div style="margin:16px auto 20px;"><svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color:var(--primary);display:block;margin:0 auto;"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.477-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg></div>
        <h1 id="pageTitle">
            <span className="sr-only">ExtoArts Portfolio - Gaming Thumbnails, YouTube Edits & Motion Graphics</span>
            <span aria-hidden="true"><span style="color: var(--text-main);">The </span><span className="auto-type" data-words="Archive.|Vault.|Portfolio." style="color: var(--primary); -webkit-text-fill-color: var(--primary);">Archive.</span><span className="type-cursor" style="-webkit-text-fill-color: var(--text-main); color: var(--text-main);">|</span></span>
        </h1>
        <p>Gaming thumbnails, YouTube edits, short-form content, motion graphics, browse everything we've built.</p>
    </div>
    
    <div id="loader" className="loader"><i className="fas fa-circle-notch fa-spin"></i></div>

    <div id="catGrid" className="grid">
        
            <div className="item-card" data-aos="fade-up" onclick="loadLocalCategory('', '')">
                <img src="" alt=", ExtoArts Portfolio Category" loading="lazy" oncontextmenu="return false;" draggable="false" onerror="this.onerror=null;this.src='';" />
                <div className="item-info">
                    <h3></h3>
                    <small></small>
                </div>
            </div>
        
    </div>

    <div id="subGrid" className="grid" style="display:none;"></div>
    <div id="workGrid" className="grid" style="display:none;"></div>
</div>


<script type="application/ld+json"></script>

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


            <div className="thumb-item" data-aos="fade-up" data-aos-delay=""
                 onclick="openProject('', '', '', '')"
                 role="button" tabIndex="0" aria-label="">
                
                    <video src="#t=0.001" preload="metadata" muted playsinline oncontextmenu="return false;" draggable="false"></video>
                
                    <img src="" alt="" loading="lazy" oncontextmenu="return false;" draggable="false" />
                
                <div className="thumb-overlay"><i className="fas "></i></div>
            </div>
        
            <div className="thumb-item thumb-placeholder" aria-label="">
                <i className="fas fa-image"></i>
                <span>Coming Soon</span>
            </div>
        

<div className="tg-section">
    <div className="tg-divider" data-aos="fade-right"></div>

    <div data-aos="fade-up">
        <span className="tg-eyebrow">Featured Showcase</span>
        <h2 className="tg-title">Creative <span>Sections</span></h2>
        <p className="tg-subtitle">Explore our latest thumbnails, edits, motion graphics, and creative work by category.</p>
    </div>

    
    <div className="game-block" data-aos="fade-up" id="portfolio-">
        <div className="game-header">
            <div className="game-logo-wrap">
                
                <img src="" alt=" cover"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                
                <span className="game-logo-fallback" style=""><i className="fas fa-images" style="color:#00d2ff;"></i></span>
            </div>
            <span className="game-name"></span>
            <div className="game-accent-line"></div>
            <span className="game-count"> items</span>
        </div>
        <div className="thumb-grid-game">
            
        </div>
    </div>
    
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
.baf-stat-pill { background: rgba(0,210,255,0.15); border: 1px solid rgba(0,210,255,0.35); border-radius: 50px; padding: 5px 14px; font-size: 0.68rem; font-weight: 900; letter-spacing: 1.5px; color: var(--primary); text-transform: uppercase; animation: bafStatIn 0.4s cubic-bezier(0.34,1.4,0.64,1) both; }
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



<section className="baf-section" data-aos="fade-up">
    <div className="tg-divider" data-aos="fade-right"></div>
    <div data-aos="fade-up">
        <span className="tg-eyebrow">The Transformation</span>
        <h2 className="baf-title">Drag to Reveal <span>The Difference</span></h2>
        <p className="baf-sub">Every pixel engineered to perform. Drag the handle to see what ExtoArts actually changes.</p>
    </div>

    <div className="baf-tabs" id="bafTabs">
        
            <button className="baf-tab" data-idx=""></button>
        
    </div>

    <div className="baf-slider-wrap" id="bafWrap">
        <div className="baf-before"><img id="bafImgB" src="" alt="Before ExtoArts design" /></div>
        <div className="baf-after" id="bafAfter"><img id="bafImgA" src="" alt="After ExtoArts design" /></div>
        <span className="baf-pill baf-pill-b">Without ExtoArts</span>
        <span className="baf-pill baf-pill-a">ExtoArts</span>
        <div className="baf-divider" id="bafDiv">
            <div className="baf-handle"><i className="fas fa-chevron-left"></i><i className="fas fa-chevron-right"></i></div>
            <div className="baf-spark baf-spark-1"></div>
            <div className="baf-spark baf-spark-2"></div>
            <div className="baf-spark baf-spark-3"></div>
        </div>
        <div className="baf-stats" id="bafStats" style="opacity:0">
            <span className="baf-stat-pill" id="bafStat1"></span>
            <span className="baf-stat-pill" id="bafStat2" style="animation-delay:0.12s"></span>
        </div>
        <div className="baf-hint"><i className="fas fa-arrows-alt-h"></i> Drag to compare</div>
    </div>

    <div className="baf-pair-meta">
        <span className="baf-pair-name">Viewing: <span id="bafPairLabel"></span> Thumbnails</span>
        <span className="baf-note">Same image - drag the handle</span>
    </div>
</section>

<script>
(function() {
    const pairs = ;
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
    <div className="modal-content-wrapper" id="modalWrapper">
        <button className="close-modal" onclick="closePreview()">Close &times;</button>
        <div id="modalContent"></div>
    </div>
</div>

<script>
    let currentStep = 'cat';
    let workParent = 'cat';
    const localPortfolio = ;

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
                mediaHtml = `<img src="${escapeHtml(thumb)}" loading="lazy" alt="${escapeHtml(w.title)}, ExtoArts" style="width:100%; height:100%; object-fit:cover;" oncontextmenu="return false;" draggable="false" />`;
            }

            html += `
            <div className="work-card ${ratioClass}" onclick="openProject('${jsArg(videoUrl)}', '${jsArg(thumb)}', '${jsArg(w.project_type)}', '${jsArg(w.ratio)}')">
                <div className="wrapper">
                    ${mediaHtml}
                    <div className="play-icon"><i className="fas ${w.project_type == 'video' ? 'fa-play-circle' : 'fa-expand-alt'}"></i></div>
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
            html += `<div className="item-card" onclick="loadWorks(${sub.id}, '${sub.name.replace(/'/g, "\\'")}')"><img src="${sub.thumb_url}" loading="lazy" alt="${sub.name}, ExtoArts" oncontextmenu="return false;" draggable="false" /><div className="item-info"><h3>${sub.name}</h3></div></div>`;
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

            if (w.project_type === 'video' && (!thumb || thumb.
    </Layout>
  );
}
