<?php
declare(strict_types=1);
$page_title = "Hire a YouTube Video Editor | Contact ExtoArts";
$page_desc = "Hire a YouTube video editor through ExtoArts on Discord. Get a custom quote within hours. No sales scripts, no lock-in contracts, real editors ready now.";
include __DIR__ . '/../templates/header.php'; 
?>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "name": "Contact ExtoArts, Hire a YouTube Video Editor",
  "description": "Reach out to ExtoArts through Discord to get a quote for video editing, thumbnail design, TikTok editing, or YouTube automation services.",
  "url": "https://extoarts.in/contact"
}
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://extoarts.in/" },
    { "@type": "ListItem", "position": 2, "name": "Contact", "item": "https://extoarts.in/contact" }
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://extoarts.in/contact",
  "url": "https://extoarts.in/contact",
  "name": "Contact ExtoArts | Hire a YouTube Video Editor Today",
  "description": "Contact ExtoArts on Discord to hire a YouTube video editor, get a quote, or start your first project. Fast replies, no sales scripts, real humans.",
  "inLanguage": "en-US",
  "datePublished": "2024-01-01",
  "dateModified": "2026-06-17",
  "about": {"@id": "https://extoarts.in/#organization"},
  "publisher": { "@id": "https://extoarts.in/#organization" },
  "isPartOf": { "@id": "https://extoarts.in/#website" },
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": [".c-text", ".contact-method"]
  }
}
</script>

<style>
    .contact-container { padding: 180px 20px 100px; max-width: 1200px; margin: 0 auto; position: relative; z-index: 10; display: flex; flex-wrap: wrap; gap: 60px; align-items: flex-start; }
    
    .c-text { flex: 1; min-width: 300px; }
    .c-text h1 { font-size: clamp(2.8rem, 7vw, 5rem); font-weight: 900; line-height: 1.1; margin-bottom: 20px; letter-spacing: -2px; }
    .c-text p.intro { font-size: 1.1rem; line-height: 1.7; margin-bottom: 45px; max-width: 480px; color: var(--text-muted); }
    
    .contact-method { display: flex; align-items: flex-start; gap: 20px; margin-bottom: 30px; }
    .c-icon { width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; color: var(--primary); flex-shrink: 0; }
    .contact-method h3 { font-size: 1.1rem; font-weight: 800; margin-bottom: 4px; }
    .contact-method p { font-size: 0.92rem; margin: 0; color: var(--text-muted); line-height: 1.5; }

    :root {
        --discord: #5865f2;
        --discord-glow: rgba(88, 101, 242, 0.18);
        --discord-border: rgba(88, 101, 242, 0.28);
    }

    .contact-socials { display: flex; gap: 12px; margin-top: 10px; flex-wrap: wrap; }
    .contact-socials a {
        color: var(--text-muted);
        font-size: 1.1rem;
        transition: color 0.25s cubic-bezier(0.22, 0.61, 0.36, 1),
                    border-color 0.25s ease,
                    transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),
                    box-shadow 0.25s ease;
        background: var(--surface);
        width: 38px; height: 38px;
        display: flex; align-items: center; justify-content: center;
        border-radius: 50%;
        text-decoration: none;
        border: 1px solid var(--border);
    }
    .contact-socials a:hover { color: var(--primary); border-color: var(--primary); transform: translateY(-3px) scale(1.08); box-shadow: 0 5px 16px var(--primary-glow); }
    .contact-socials a:focus-visible { outline: 2px solid var(--primary); outline-offset: 3px; border-radius: 50%; }

    .c-card { flex: 1; min-width: 320px; border: 1px solid var(--discord-border) !important; border-radius: 36px; padding: 60px 40px; text-align: center; position: relative; overflow: hidden; background: var(--surface) !important; backdrop-filter: blur(10px); box-shadow: 0 0 50px var(--discord-glow) !important; }
    .c-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #5865f2, #7289da); }

    .discord-massive { font-size: 5rem; color: var(--discord); margin-bottom: 20px; filter: drop-shadow(0 0 28px var(--discord-glow)); animation: floatDiscord 4s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite alternate; display: block; }
    @keyframes floatDiscord { 0% { transform: translateY(0); } 100% { transform: translateY(-12px); } }

    .c-card h2 { font-size: 2rem; font-weight: 900; margin-bottom: 15px; letter-spacing: -0.5px; }
    .c-card p { font-size: 1rem; margin-bottom: 35px; line-height: 1.65; }

    .response-badge { display: inline-flex; align-items: center; gap: 8px; padding: 7px 16px; border-radius: 100px; font-size: 0.75rem; font-weight: 700; background: rgba(88,101,242,0.1); border: 1px solid var(--discord-border); color: var(--discord); margin-bottom: 30px; }
    .response-dot { width: 7px; height: 7px; border-radius: 50%; background: #57f287; animation: blink 1.5s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite; }
    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
</style>

<div class="contact-container">
    
    <div class="c-text" data-aos="fade-right">
        <span class="sec-label-inline" style="text-align:left;">Get in Touch</span>
        <h1>
            <span class="sr-only">Contact ExtoArts | Hire a YouTube Video Editor</span>
            <span aria-hidden="true" style="color:var(--text-main);">Let's Talk About Your<br></span><span aria-hidden="true" style="color:var(--primary);-webkit-text-fill-color:var(--primary);">Content.</span>
        </h1>
        <p class="intro">Whether you want to hire a video editor, get a thumbnail quote, or just ask a question, we're on Discord and we reply fast. No sales scripts, just real conversations.</p>
        
        <div class="contact-method">
            <div class="c-icon"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color:var(--primary);display:block;"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
            <div>
                <h3>Fastest Way to Reach Us</h3>
                <p>Join the Discord server, open a ticket, and we'll get back to you with a custom quote in just a few hours.</p>
            </div>
        </div>
        
        <div class="contact-method">
            <div class="c-icon"><i class="ti ti-mail" style="font-size:1.4rem;color:var(--primary);"></i></div>
            <div>
                <h3>Email Support</h3>
                <p>Prefer email? Reach us at <a href="mailto:support@extoarts.in" style="color:var(--primary);text-decoration:none;font-weight:700;">support@extoarts.in</a>. We respond within 24 hours.</p>
            </div>
        </div>

        <div class="contact-method">
            <div class="c-icon"><i class="ti ti-share" style="font-size:28px;color:var(--primary);"></i></div>
            <div>
                <h3>Follow Our Work</h3>
                <p>See what we've been building and stay updated on new services and content.</p>
                <div class="contact-socials">
                    <a href="https://youtube.com/@extoarts?si=po6tre_ZAY7i_LFz" target="_blank" rel="noopener" title="ExtoArts on YouTube"><i class="ti ti-brand-youtube"></i></a>
                    <a href="https://x.com/extoarts" target="_blank" rel="noopener" title="ExtoArts on X (Twitter)"><i class="ti ti-brand-x"></i></a>
                    <a href="https://www.threads.net/@extoarts" target="_blank" rel="noopener" title="ExtoArts on Threads"><i class="ti ti-brand-threads"></i></a>
                    <a href="https://www.instagram.com/extoarts?igsh=enVlYm9hczNiYjgw" target="_blank" rel="noopener" title="ExtoArts on Instagram"><i class="ti ti-brand-instagram"></i></a>
                    <a href="https://www.facebook.com/share/1J1UA6Txqr/" target="_blank" rel="noopener" title="ExtoArts on Facebook"><i class="ti ti-brand-facebook"></i></a>
                </div>
            </div>
        </div>
    </div>

    <div class="c-card" data-aos="fade-left" data-aos-delay="200">
        <i class="ti ti-brand-discord discord-massive"></i>
        <div class="response-badge"><span class="response-dot"></span> Usually replies within a few hours</div>
        <h2>The ExtoArts Hub</h2>
        <p>Your entire project runs inside a private Discord server - files, drafts, revisions, and payments all in one place. No extra tools, no email threads, nothing to install.</p>
        <a href="https://discord.gg/extoarts-1402333030827425922" target="_blank" rel="noopener" class="btn" style="width: 100%; background: #5865f2 !important; color: #fff !important; box-shadow: 0 10px 30px rgba(88,101,242,0.3); padding: 18px; border-radius: 100px; font-weight: 800; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 12px; font-size: 0.9rem; letter-spacing: 1px; text-transform: uppercase;"><i class="ti ti-brand-discord"></i> Enter the Server</a>
    </div>

</div>

<?php include __DIR__ . '/../templates/footer.php'; ?>
