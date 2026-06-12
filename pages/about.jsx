import Head from 'next/head';
import Layout from '../components/Layout';

export default function Page() {
  return (
    <Layout currentPage="about">
      <Head>
        <title>YouTube Video Editing Agency - About ExtoArts | FAQ</title>
        <meta name="description" content="How ExtoArts works - a YouTube video editing agency with vetted editors, transparent 10% flat fee, and real quality control on every project. No hidden costs." />
      </Head>
 
 */}

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://extoarts.in/#founder",
  "name": "Rehan",
  "alternateName": "RehanSigma",
  "jobTitle": "Founder & Creative Director",
  "worksFor": {"@id": "https://extoarts.in/#organization"},
  "description": "Rehan is the founder and creative director of ExtoArts, a global YouTube video editing and thumbnail design agency. He built ExtoArts to give creators access to elite editors at transparent, fair pricing.",
  "image": "https://iili.io/BZ0qsef.jpg",
  "url": "https://extoarts.in/about",
  "sameAs": [
    "https://x.com/extoarts",
    "https://www.instagram.com/extoarts",
    "https://youtube.com/@extoarts",
    "https://discord.gg/extoarts-1402333030827425922"
  ],
  "knowsAbout": [
    "YouTube Video Editing",
    "Thumbnail Design",
    "Content Strategy",
    "YouTube Channel Growth",
    "Short-Form Video Editing",
    "Motion Graphics",
    "Gaming Video Editing",
    "Faceless YouTube Channel Automation"
  ]
}
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What does ExtoArts mean?",
      "acceptedAnswer": { "@type": "Answer", "text": "ExtoArts is a coined brand name combining the concept of extended creative arts - built to represent pushing the craft of video editing and design beyond ordinary limits. ExtoArts (extoarts.in) is the agency's own distinctive trademark with no relation to any other word or phrase. The name was chosen by founder Rehan to reflect the agency's core mission: extend what is possible in YouTube content creation through elite editing, thumbnail design, and channel strategy." }
    },
    {
      "@type": "Question",
      "name": "Who founded ExtoArts?",
      "acceptedAnswer": { "@type": "Answer", "text": "ExtoArts was founded by six core members: Rehan, RevenantX, Subh, Hake, Leo, and RAGE. It started as a straightforward agency with a simple goal: deliver great work. Thanks to the creators who trusted them early on, it grew into an elite global network of YouTube video editors and thumbnail designers." }
    },
    {
      "@type": "Question",
      "name": "What is the ExtoArts 10% Golden Rule?",
      "acceptedAnswer": { "@type": "Answer", "text": "Traditional agencies take 30 to 50 percent of your budget. ExtoArts charges a flat 10% commission to cover management and infrastructure, and 90% of your money goes directly to the artist doing the actual work. This keeps pricing fair for creators and keeps editors motivated to deliver their best." }
    },
    {
      "@type": "Question",
      "name": "How long does a video edit or thumbnail take?",
      "acceptedAnswer": { "@type": "Answer", "text": "High-end thumbnails are typically delivered within 24 to 48 hours. Full video edits take 3 to 7 days depending on complexity, length, and the amount of custom VFX involved." }
    },
    {
      "@type": "Question",
      "name": "How do I pay ExtoArts for video editing services?",
      "acceptedAnswer": { "@type": "Answer", "text": "ExtoArts accepts payment via USD, Crypto, PayPal, UPI, Bkash, PKR, EasyPaisa, and more. Standard payment gateway fees are not covered by the agency." }
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
    { "@type": "ListItem", "position": 2, "name": "About", "item": "https://extoarts.in/about" }
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": "https://extoarts.in/about",
  "url": "https://extoarts.in/about",
  "name": "About ExtoArts | YouTube Video Editing Agency & FAQ",
  "description": "Learn how ExtoArts works - a YouTube editing agency with vetted editors, transparent 10% flat fee, and real quality control on every project. No hidden costs.",
  "inLanguage": "en-US",
  "datePublished": "2024-01-01",
  "dateModified": "2026-06-11",
  "publisher": { "@id": "https://extoarts.in/#organization" },
  "isPartOf": { "@id": "https://extoarts.in/#website" },
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": [".story-card", ".founder-spotlight", ".founder-quote"]
  }
}
</script>

<style>
    .about-container { max-width: 1200px; margin: 180px auto 100px; padding: 0 20px; position: relative; z-index: 10; }
    
    .intro-header { text-align: center; margin-bottom: 100px; }
    .intro-header h1 { font-size: clamp(2.8rem, 7vw, 5rem); font-weight: 900; line-height: 1.1; margin-bottom: 25px; letter-spacing: -2px; }
    .intro-header p { font-size: 1.15rem; color: var(--text-muted); max-width: 650px; margin: 0 auto; line-height: 1.7; }

    .story-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 120px; }
    .story-card { padding: 50px 40px; border-radius: 36px; text-align: left; display: flex; flex-direction: column; justify-content: center; border: 1px solid var(--border); transition: border-color 0.3s, box-shadow 0.3s; }
    .story-card:hover { border-color: var(--primary) !important; box-shadow: 0 20px 50px var(--primary-glow) !important; }
    .story-icon { display: none; }
    .story-card h3 { font-size: 1.8rem; margin-bottom: 18px; font-weight: 900; letter-spacing: -1px; }
    .story-card p { line-height: 1.8; font-size: 1rem; margin: 0; }
    @media (max-width: 900px) { .story-grid { grid-template-columns: 1fr; gap: 25px; } }

    .process-section { margin-bottom: 120px; }
    .process-section h2 { font-size: clamp(2.2rem, 5vw, 4rem); font-weight: 900; text-align: center; margin-bottom: 15px; letter-spacing: -1.5px; }
    .process-section .sec-sub { text-align: center; font-size: 1rem; color: var(--text-muted); max-width: 520px; margin: 0 auto 55px; line-height: 1.7; }
    .process-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 25px; }
    .process-card { padding: 45px 38px; border-radius: 36px; text-align: center; border: 1px solid var(--border); transition: border-color 0.3s, box-shadow 0.3s; }
    .process-card:hover { border-color: var(--primary) !important; box-shadow: 0 20px 50px var(--primary-glow) !important; }
    .step-num { width: 68px; height: 68px; font-weight: 900; font-size: 1.7rem; display: flex; align-items: center; justify-content: center; border-radius: 50%; margin: 0 auto 28px; background: var(--primary-glow); border: 1px solid rgba(0, 210, 255, 0.25); color: var(--primary); animation: stepNumFloat 3.2s ease-in-out infinite; }
    .process-card:nth-child(2) .step-num { animation-delay: -1.1s; }
    .process-card:nth-child(3) .step-num { animation-delay: -2.1s; }
    @keyframes stepNumFloat {
        0%, 100% { transform: translateY(0) scale(1); box-shadow: 0 0 0 rgba(34,211,238,0); }
        50% { transform: translateY(-5px) scale(1.06); box-shadow: 0 8px 24px rgba(34,211,238,0.28); }
    }
    .process-card h3 { font-size: 1.5rem; font-weight: 800; margin-bottom: 12px; letter-spacing: -0.5px; }
    .process-card p { font-size: 1rem; line-height: 1.7; margin: 0; }

    .faq-section { max-width: 860px; margin: 0 auto 60px; }
    .faq-section h2 { font-size: clamp(2.2rem, 5vw, 4rem); font-weight: 900; text-align: center; margin-bottom: 15px; letter-spacing: -1.5px; }
    .faq-section .sec-sub { text-align: center; font-size: 1rem; color: var(--text-muted); max-width: 500px; margin: 0 auto 55px; line-height: 1.7; }
    .faq-container { display: flex; flex-direction: column; gap: 16px; }
    .faq-item { border-radius: 22px; overflow: hidden; cursor: pointer; border: 1px solid var(--border); transition: border-color 0.3s; }
    .faq-item:hover, .faq-item.active { border-color: var(--primary) !important; }
    
    .faq-question { padding: 28px 38px; display: flex; justify-content: space-between; align-items: center; font-weight: 800; font-size: 1.1rem; user-select: none; transition: color 0.3s; }
    .faq-item:hover .faq-question, .faq-item.active .faq-question { color: var(--primary); }
    
    .faq-icon { font-size: 1rem; transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); color: var(--text-muted); flex-shrink: 0; margin-left: 20px; }
    .faq-item.active .faq-icon { transform: rotate(180deg); color: var(--primary); }
    
    .faq-answer { max-height: 0; padding: 0 38px; font-size: 1rem; line-height: 1.85; transition: all 0.4s ease-in-out; opacity: 0; color: var(--text-muted); }
    .faq-item.active .faq-answer { max-height: 600px; padding-bottom: 32px; opacity: 1; }
    .faq-answer strong { color: var(--text-main); font-weight: 800; }

    .sec-label-inline {
        font-size: 0.72rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 4px;
        color: var(--primary);
        margin-bottom: 12px;
        display: block;
        text-align: center;
    }

    .founder-spotlight { display: grid; grid-template-columns: 1fr 1.4fr; gap: 60px; align-items: center; margin-bottom: 120px; padding: 60px; border-radius: 36px; border: 1px solid var(--border); background: var(--surface); transition: border-color 0.3s, box-shadow 0.3s; }
    .founder-spotlight:hover { border-color: var(--border-hover); box-shadow: 0 30px 80px var(--primary-glow); }
    .founder-img-wrap { position: relative; }
    .founder-img-frame { width: 100%; aspect-ratio: 3/4; border-radius: 28px; overflow: hidden; border: 1px solid var(--border); }
    .founder-img-frame img { width: 100%; height: 100%; object-fit: cover; object-position: top center; filter: grayscale(10%); transition: filter 0.4s ease; }
    .founder-spotlight:hover .founder-img-frame img { filter: grayscale(0%); }
    .founder-img-badge { position: absolute; bottom: -16px; left: 50%; transform: translateX(-50%); background: var(--primary); color: #000; font-size: 0.7rem; font-weight: 900; text-transform: uppercase; letter-spacing: 3px; padding: 8px 22px; border-radius: 100px; white-space: nowrap; }
    .founder-content { display: flex; flex-direction: column; gap: 20px; }
    .founder-content .sec-label-inline { text-align: left; }
    .founder-content h2 { font-size: clamp(2rem, 4vw, 3rem); font-weight: 900; letter-spacing: -1.5px; line-height: 1.1; margin: 0; }
    .founder-content h2 span { color: var(--primary); }
    .founder-quote { border-left: 3px solid var(--primary); padding: 16px 24px; font-size: 1.05rem; line-height: 1.75; color: var(--text-muted); font-style: italic; border-radius: 0 14px 14px 0; background: var(--primary-glow); }
    .founder-content .founder-bio { font-size: 1rem; line-height: 1.8; color: var(--text-muted); margin: 0; }
    .founder-role-tag { display: inline-flex; align-items: center; gap: 10px; font-size: 0.85rem; font-weight: 700; color: var(--text-muted); letter-spacing: 0.5px; }
    .founder-role-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--primary); flex-shrink: 0; }

    @media (max-width: 900px) {
        .founder-spotlight { grid-template-columns: 1fr; gap: 40px; padding: 40px 28px; }
        .founder-img-frame { aspect-ratio: 4/3; }
        .founder-content h2 { font-size: clamp(1.8rem, 6vw, 2.5rem); }
    }

    @media (max-width: 768px) {
        .about-container { margin: 120px auto 70px; padding: 0 14px; }
        .intro-header { margin-bottom: 56px; }
        .intro-header h1 { margin-bottom: 16px; }
        .intro-header h1 [aria-hidden="true"] { font-size: clamp(2.05rem, 10vw, 2.85rem) !important; line-height: 1.02 !important; letter-spacing: -1.4px !important; }
        .intro-header p { max-width: 330px; }
        .story-grid { gap: 14px; margin-bottom: 70px; }
        .faq-question { padding: 22px 25px; font-size: 1rem; }
        .faq-answer { padding: 0 25px; font-size: 0.95rem; }
        .faq-item.active .faq-answer { padding-bottom: 22px; }
        .story-card { padding: 28px 22px; border-radius: 26px; }
        .story-icon { font-size: 2rem; margin-bottom: 16px; }
        .story-card h3 { margin-bottom: 10px; }
        .process-section { margin-bottom: 76px; }
        .process-grid { gap: 14px; }
        .process-section .sec-sub, .faq-section .sec-sub { margin-bottom: 32px; }
        .process-card { padding: 28px 22px; border-radius: 26px; }
        .step-num { width: 54px; height: 54px; font-size: 1.35rem; margin-bottom: 18px; }
        .founder-spotlight { gap: 26px; padding: 26px 20px; border-radius: 28px; margin-bottom: 76px; }
        .founder-img-frame { border-radius: 22px; }
        .founder-content { gap: 14px; }
        .founder-quote { padding: 13px 16px; font-size: 0.92rem; line-height: 1.55; }
        .founder-content .founder-bio { font-size: 0.92rem; line-height: 1.6; }
    }
</style>

<div className="about-container">
    
    <div className="intro-header" data-aos="fade-down">
        <span className="sec-label-inline">About the Agency</span>
        <h1>
            <span className="sr-only">ExtoArts - YouTube Video Editing Agency & Creative Services</span>
            <span aria-hidden="true" style="font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 900; line-height: 1.1; margin-bottom: 20px; letter-spacing: -1px; display: block; color: var(--text-main);">We connect <span style="color: var(--primary);">creators</span><br />with top-tier artists.</span>
        </h1>
        <p>No corporate fluff, no hidden fees, no surprises. Just high-quality YouTube video editing and thumbnail design, priced fairly for everyone involved.</p>
    </div>

    <div className="story-grid">
        <div className="story-card" data-aos="fade-right">
            <lord-icon src="https://cdn.lordicon.com/rbbnmpcf.json" trigger="loop" delay="1500" colors="primary:#22d3ee" style="width:56px;height:56px;margin-bottom:22px;display:block;"></lord-icon>
            <h3>What ExtoArts Is</h3>
            <p>ExtoArts is a YouTube video editing agency founded in 2024. It connects content creators with vetted specialist editors matched by niche - a gaming editor for gaming channels, a storytelling editor for vlogs, a short-form specialist for Shorts and TikTok. No generalists. Every edit passes an internal quality review before delivery.</p>
        </div>
        <div className="story-card" data-aos="fade-left" data-aos-delay="100">
            <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color:var(--primary);display:block;margin-bottom:22px;"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
            <h3>The 10% Golden Rule</h3>
            <p>Traditional agencies charge 30-50% commission on creator budgets. ExtoArts charges a flat 10%. <strong>90% of your budget goes directly to the editor doing the work.</strong> On a $500 edit, that means $450 to your editor versus $250-$350 at a traditional agency. Better pay produces better output - the math is simple.</p>
        </div>
        <div className="story-card" data-aos="fade-up" data-aos-delay="200">
            <i className="fas fa-users" aria-hidden="true" style="font-size:2.8rem;color:var(--primary);display:block;margin-bottom:22px;"></i>
            <h3>Creative Specialists, Not Generalists</h3>
            <p>We match each project with the right specialist - a gaming editor for gaming channels, a storytelling editor for vlogs, a short-form artist for Shorts and TikTok. Every editor on ExtoArts has a defined niche they excel in, and that's where your project goes.</p>
        </div>
    </div>

    <div className="founder-spotlight" data-aos="fade-up">
        <div className="founder-img-wrap">
            <div className="founder-img-frame">
                <img src="https://iili.io/BZ0qsef.jpg" alt="Rehan - Founder & Creative Director of ExtoArts" loading="lazy" />
            </div>
            <span className="founder-img-badge">Founder</span>
        </div>
        <div className="founder-content">
            <span className="sec-label-inline">The Person Behind It</span>
            <h2>Rehan <span>(Sigma)</span></h2>
            <div className="founder-role-tag"><span className="founder-role-dot"></span> Founder & Creative Director · ExtoArts</div>
            <blockquote className="founder-quote">"I built ExtoArts because I watched creators overpay for mediocre work, over and over again. Good editing shouldn't cost 40% of your budget in agency fees - that math has never made sense."<br /><cite style="font-size:0.8rem; font-style:normal; color:var(--primary); display:block; margin-top:10px;">- Rehan, Founder &amp; Creative Director, ExtoArts (2024)</cite></blockquote>
            <p className="founder-bio">Rehan is the founder and creative director of ExtoArts, a global YouTube video editing agency launched in 2024. He co-founded ExtoArts with five specialist editors (RevenantX, Subh, Hake, Leo, and RAGE) to solve a specific problem: creators couldn't afford agencies with 30-50% fees, and freelancers lacked the QC infrastructure agencies provide. The 10% model was built as the practical solution. ExtoArts operates fully remotely and serves creators in gaming, vlog, education, finance, faceless automation, and Shorts niches as of 2026.</p>
            <button className="btn btn-glass" onclick="openModal('discordModal')">
                <i className="fab fa-discord" style="color: #5865f2;"></i> Say Hello on Discord
            </button>
        </div>
    </div>

    <div className="process-section">
        <span className="sec-label-inline" data-aos="fade-up">The Process</span>
        <h2 className="sweep-text" data-aos="fade-up">How a Project Actually Works</h2>
        <p className="sec-sub" data-aos="fade-up">Simple, clear, and built so you always know what's happening with your project.</p>
        <div className="process-grid">
            <div className="process-card" data-aos="fade-up">
                <div className="step-num">01</div>
                <h3>The Brief</h3>
                <p>Join our Discord, open a private ticket, and share your footage, assets, and vision. We'll review it right away and ask the right questions.</p>
            </div>
            <div className="process-card" data-aos="fade-up" data-aos-delay="100">
                <div className="step-num">02</div>
                <h3>The Match</h3>
                <p>We pair your project with the best-fit specialist. A storyteller for vlogs, a high-energy editor for gaming, a punchy artist for shorts. No one-size-fits-all.</p>
            </div>
            <div className="process-card" data-aos="fade-up" data-aos-delay="200">
                <div className="step-num">03</div>
                <h3>The Polish</h3>
                <p>We deliver the first draft, you give feedback, we refine. This keeps going until it's exactly what you had in mind, and ready to post.</p>
            </div>
        </div>
    </div>

    <div className="faq-section">
        <span className="sec-label-inline" data-aos="fade-up">FAQ</span>
        <h2 className="sweep-text" data-aos="fade-up">Questions We Get a Lot</h2>
        <p className="sec-sub" data-aos="fade-up">Honest answers to the things creators usually ask before starting their first project with us.</p>
        
        <div className="faq-container">
            
            <div className="faq-item" data-aos="fade-up">
                <div className="faq-question">What does "ExtoArts" mean as a brand name? <i className="fas fa-chevron-down faq-icon"></i></div>
                <div className="faq-answer"><strong>ExtoArts</strong> is a coined brand name built from the idea of extending creative arts - the craft of video editing, thumbnail design, and channel strategy pushed beyond ordinary limits. The name ExtoArts is the agency's own distinctive trademark; it has no relation to any common word or phrase. Founder Rehan chose it to reflect a simple principle: extend what is possible for YouTube creators through elite production quality, fair pricing, and a team that genuinely cares about channel growth.</div>
            </div>

            <div className="faq-item" data-aos="fade-up">
                <div className="faq-question">Who founded ExtoArts? <i className="fas fa-chevron-down faq-icon"></i></div>
                <div className="faq-answer">ExtoArts was founded by six core members: <strong>Rehan, RevenantX, Subh, Hake, Leo, and RAGE.</strong> It started as a normal agency with a simple goal, do great work. Thanks to the creators who trusted them early on, it grew into an elite global network of editors and designers.</div>
            </div>

            <div className="faq-item" data-aos="fade-up">
                <div className="faq-question">What's the typical turnaround time? <i className="fas fa-chevron-down faq-icon"></i></div>
                <div className="faq-answer">Thumbnails typically land in your hands within <strong>24 to 48 hours</strong>. Full video edits are usually 3 to 7 days, depending on the complexity, runtime, and how much custom VFX is involved.</div>
            </div>

            <div className="faq-item" data-aos="fade-up">
                <div className="faq-question">How many revisions do I get? <i className="fas fa-chevron-down faq-icon"></i></div>
                <div className="faq-answer">Every project 
    </Layout>
  );
}
