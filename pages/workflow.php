<?php
declare(strict_types=1);
$page_title = "YouTube Video Editing Process - How We Work | ExtoArts";
$page_desc = "See exactly how ExtoArts handles your video editing project - from first Discord message to final delivery. Four clear steps, no jargon, no confusion.";
$breadcrumbs = [['name' => 'Workflow', 'url' => '/workflow']];
include __DIR__ . '/../templates/header.php'; 
?>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Get a Video Edited with ExtoArts",
  "description": "Step-by-step guide to working with ExtoArts video editing agency, from opening a Discord ticket to receiving your finished video.",
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "How to Submit Your Project Brief to ExtoArts",
      "text": "Join the ExtoArts Discord server and open a private ticket. Share your footage, goals, style references, target audience, and deadline. ExtoArts reviews the brief immediately and asks clarifying questions to ensure full alignment before editing begins. This step typically takes under 10 minutes and is the only onboarding step required."
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "How ExtoArts Matches You with a Niche-Specialist Editor",
      "text": "ExtoArts matches your project to a specialist editor from its verified talent pool based on your niche, visual style, turnaround requirements, and budget. Gaming channels are matched to gaming editors. Vlog and storytelling content goes to narrative specialists. TikTok and Shorts content goes to short-form experts. You are introduced to your editor before any work begins."
    },
    {
      "@type": "HowToStep",
      "position": 3,
      "name": "What Happens During the Editing Production Phase",
      "text": "Your matched editor builds the complete cut using retention engineering principles: hook structuring, J-cuts and L-cuts, pattern interrupts, rhythm-locked sound design, color grading, and motion graphics where required. Every editorial decision is made to maximize Average View Duration. Production takes 3-5 business days for standard edits, 1-2 days for Shorts and TikTok."
    },
    {
      "@type": "HowToStep",
      "position": 4,
      "name": "How Your Finished Video Is Delivered and Revised",
      "text": "Before delivery, ExtoArts runs a quality control review against retention benchmarks. The QC-reviewed file is delivered through the Discord ticket at full resolution in H.264 MP4 format, optimized for YouTube upload. Every project includes a minimum of 3 revision rounds. Revisions are turned around quickly through the same ticket channel."
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
    { "@type": "ListItem", "position": 2, "name": "How We Work", "item": "https://extoarts.in/workflow" }
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://extoarts.in/workflow",
  "url": "https://extoarts.in/workflow",
  "name": "How We Work | ExtoArts Video Editing Process",
  "description": "See exactly how ExtoArts handles your video editing project - from first message to final delivery. Four clear steps, no jargon, no confusion.",
  "inLanguage": "en-US",
  "datePublished": "2024-01-01",
  "dateModified": "2026-06-17",
  "about": {"@id": "https://extoarts.in/#organization"},
  "publisher": { "@id": "https://extoarts.in/#organization" },
  "isPartOf": { "@id": "https://extoarts.in/#website" },
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": [".workflow-hero", ".step-content"]
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
      "name": "How does ExtoArts handle video editing projects?",
      "acceptedAnswer": { "@type": "Answer", "text": "ExtoArts handles projects in six steps: (1) Project brief submitted via Discord ticket, (2) Editor matched to your niche by ExtoArts, (3) Production by a specialist editor using retention engineering principles, (4) First delivery at full resolution via Discord, (5) Revision rounds - minimum 3 included per project, (6) Scale to a consistent monthly schedule. The entire process is managed through Discord." }
    },
    {
      "@type": "Question",
      "name": "How long does it take to get a YouTube video edited by ExtoArts?",
      "acceptedAnswer": { "@type": "Answer", "text": "Standard YouTube video edits take 3-5 business days. YouTube Shorts and TikTok edits take 1-2 business days. Rush delivery is available for an additional fee. Retainer clients receive priority queue placement for faster turnaround. Thumbnails are delivered within 24-48 hours." }
    },
    {
      "@type": "Question",
      "name": "How does ExtoArts match creators with the right video editor?",
      "acceptedAnswer": { "@type": "Answer", "text": "ExtoArts assigns editors based on niche expertise, not availability. Gaming channels are matched to gaming-specialist editors. Vlog and storytelling content goes to narrative editors. TikTok and YouTube Shorts content goes to short-form specialists. Faceless automation channels are matched to editors with experience in stock-footage and voiceover-driven production. This niche-matching system produces better retention and style consistency than generalist assignment." }
    },
    {
      "@type": "Question",
      "name": "What format does ExtoArts deliver edited videos in?",
      "acceptedAnswer": { "@type": "Answer", "text": "ExtoArts delivers edited videos at full resolution in H.264 MP4 format, optimized for direct YouTube upload. Delivery is through the Discord ticket channel where the project originated. The delivery includes editor notes, timestamps, and a checklist of retention elements built into the cut." }
    },
    {
      "@type": "Question",
      "name": "How many revision rounds does ExtoArts include with each project?",
      "acceptedAnswer": { "@type": "Answer", "text": "Every ExtoArts project includes a minimum of 3 rounds of minor revisions at no additional cost. Revisions are coordinated through the Discord ticket channel for fast turnaround. Major creative concept changes after production has started are treated as a new project. ExtoArts does not close a ticket until the client is satisfied with the final result." }
    }
  ]
}
</script>

<style>
    .workflow-hero { padding: 160px 20px 60px; text-align: center; position: relative; z-index: 10; }
    .workflow-hero h1 { font-size: clamp(3.5rem, 10vw, 7rem); font-weight: 900; letter-spacing: -3px; line-height: 1.1; margin-bottom: 20px; min-height: 1.5em; }
    .workflow-hero p { font-size: 1.1rem; color: var(--text-muted); max-width: 560px; margin: 0 auto; line-height: 1.7; }

    .pipeline-container { max-width: 1100px; margin: 0 auto 150px; padding: 0 20px; position: relative; }

    @media (min-width: 851px) {
        .central-spine { position: absolute; left: 50%; top: 0; bottom: 0; width: 1px; background: var(--border); transform: translateX(-50%); transition: background 0.4s; }
        .laser-progress { position: absolute; left: 50%; top: 0; width: 2px; height: 0; background: linear-gradient(to bottom, transparent, var(--primary), var(--purple)); box-shadow: 0 0 20px var(--primary); transform: translateX(-50%); z-index: 5; }
    }

    .step-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 150px; position: relative; width: 100%; }
    
    .step-content { width: 44%; padding: 50px; border-radius: 36px; transition: all 1s cubic-bezier(0.16, 1, 0.3, 1); opacity: 0; transform: translateY(50px) scale(0.9); border: 1px solid var(--border); }
    .step-row:nth-child(even) { flex-direction: row-reverse; }

    .step-row.is-active .step-content { opacity: 1; transform: translateY(0) scale(1); border-color: var(--primary) !important; box-shadow: 0 20px 50px var(--primary-glow) !important; }

    .step-node { position: absolute; left: 50%; transform: translateX(-50%) scale(0); width: 64px; height: 64px; z-index: 10; display: flex; align-items: center; justify-content: center; color: var(--primary); transition: 0.8s cubic-bezier(0.22, 1, 0.36, 1); }
    .step-row.is-active .step-node { transform: translateX(-50%) scale(1); }

    /* Workflow SVG icons */
    .step-node svg { width: 32px; height: 32px; overflow: visible; }
    .step-node .wf-draw {
        fill: none;
        stroke: var(--primary);
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
        transition: stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1) 0.25s;
    }
    .step-row.is-active .step-node .wf-draw { stroke-dashoffset: 0 !important; }
    @keyframes wfSpin   { to { transform: rotate(360deg); } }
    @keyframes wfBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
    .step-row.is-active .wf-spin   { animation: wfSpin   3s linear infinite; transform-box:fill-box; transform-origin:center; }
    .step-row.is-active .wf-bounce { animation: wfBounce 1.5s ease-in-out infinite; transform-box:fill-box; transform-origin:center; }

    .step-content .step-tag { display: inline-block; padding: 6px 15px; background: var(--primary-glow); border: 1px solid rgba(0, 210, 255, 0.2); color: var(--primary); border-radius: 100px; font-size: 0.7rem; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 22px; }
    .step-content h2 { font-size: 2.2rem; font-weight: 800; margin-bottom: 15px; letter-spacing: -1px; color: var(--text-main); transition: color 0.4s; }
    .step-content p { line-height: 1.8; font-size: 1.05rem; color: var(--text-muted); transition: color 0.4s; }

    @media (max-width: 850px) {
        .central-spine, .laser-progress, .step-node { display: none !important; }
        .step-row { margin-bottom: 30px; padding: 0; }
        .step-content { width: 100%; padding: 38px 28px; transform: translateY(30px); opacity: 0.3; text-align: left; border: 1px solid var(--border); border-radius: 28px; }
        .step-row.is-active .step-content { opacity: 1; transform: translateY(0); }
        .step-content h2 { font-size: 1.7rem; }
    }
</style>

<div class="workflow-hero" data-aos="fade-down">
    <span style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 4px; color: var(--primary); margin-bottom: 20px; display: block;">The Process</span>
    <h1 class="sr-only">ExtoArts Video Editing Process - From Brief to Final Delivery</h1>
    <div aria-hidden="true">
        <div style="font-size: clamp(3.5rem, 10vw, 7rem); font-weight: 900; letter-spacing: -3px; line-height: 1.05; margin-bottom: 20px;">
            <span style="color: var(--text-main);">The </span><span class="cycle-stack" aria-label="Process." style="color: var(--primary); -webkit-text-fill-color: var(--primary);"><span class="cycle-phrase is-active">Process.</span><span class="cycle-phrase" aria-hidden="true">Pipeline.</span><span class="cycle-phrase" aria-hidden="true">Steps.</span></span>
        </div>
    </div>
    <p>Six steps, exactly as they happen. From first message to final delivery - nothing hidden, nothing skipped.</p>
</div>

<div class="pipeline-container">
    <div class="central-spine"></div>
    <div class="laser-progress" id="laser"></div>

    <div class="step-row js-reveal">
        <div class="step-node">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="wf-draw" style="stroke-dasharray:80;stroke-dashoffset:80;" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </div>
        <div class="step-content process-card">
            <span class="step-tag">Step 01</span>
            <h2>Project Brief</h2>
            <p>Join our Discord, open a private ticket, and share your footage, references, and goals. We review your content, ask about your niche and target audience, and agree on the exact direction before editing starts.</p>
        </div>
    </div>

    <div class="step-row js-reveal">
        <div class="step-node">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="wf-draw" style="stroke-dasharray:90;stroke-dashoffset:90;" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9" class="wf-bounce"/></svg>
        </div>
        <div class="step-content process-card">
            <span class="step-tag">Step 02</span>
            <h2>Editor Match</h2>
            <p>We match your project with the right editor. Gaming channels get a high-energy gaming editor. Vlogs get a storyteller. TikTok and Shorts get a specialist in fast-paced short-form content. No generalists, every project gets an expert who works in that niche every day.</p>
        </div>
    </div>

    <div class="step-row js-reveal">
        <div class="step-node">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="wf-draw" style="stroke-dasharray:110;stroke-dashoffset:110;" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>
        </div>
        <div class="step-content process-card">
            <span class="step-tag">Step 03</span>
            <h2>Production</h2>
            <p>Your editor builds the full cut. Retention hooks, custom sound design, color grade, and motion graphics all put together to keep viewers watching. Our team reviews the cut before it reaches you to make sure it meets our quality standard.</p>
        </div>
    </div>

    <div class="step-row js-reveal">
        <div class="step-node">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="wf-draw" style="stroke-dasharray:80;stroke-dashoffset:80;" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13" class="wf-spin" style="transform-origin:16.5px 7.5px"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </div>
        <div class="step-content process-card">
            <span class="step-tag">Step 04</span>
            <h2>First Delivery</h2>
            <p>Your finished video is exported at full resolution and delivered through Discord. Full quality, ready to review. We include timestamps, notes from the editor, and a checklist of every retention element built into the cut.</p>
        </div>
    </div>

    <div class="step-row js-reveal">
        <div class="step-node">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="wf-draw" style="stroke-dasharray:80;stroke-dashoffset:80;" aria-hidden="true"><polyline points="1 4 1 10 7 10" class="wf-spin" style="transform-origin:4px 7px"/><path d="M3.51 15a9 9 0 1 0 .49-4.95"/></svg>
        </div>
        <div class="step-content process-card">
            <span class="step-tag">Step 05</span>
            <h2>Revisions</h2>
            <p>Tell us what you want adjusted. Every project includes a minimum of 3 revision rounds. You give feedback through Discord and we turn it around fast. We iterate until the cut is exactly what you envisioned - we don't close a ticket until you're satisfied.</p>
        </div>
    </div>

    <div class="step-row js-reveal">
        <div class="step-node">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="wf-draw" style="stroke-dasharray:80;stroke-dashoffset:80;" aria-hidden="true"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12" class="wf-bounce"/></svg>
        </div>
        <div class="step-content process-card">
            <span class="step-tag">Step 06</span>
            <h2>Scale</h2>
            <p>Most clients start with one video. Then two. Then a consistent schedule. When you're ready to scale to 4-8 videos per month, your dedicated editor is already warmed up on your style, audience, and brand. No re-briefing. Just consistent output at volume.</p>
        </div>
    </div>
</div>

<div style="text-align: center; margin-bottom: 150px;" data-aos="fade-up">
    <p style="color: var(--text-muted); font-size: 1rem; max-width: 480px; margin: 0 auto 35px; line-height: 1.7;">Ready to hand off your editing and get back to actually creating? Open a ticket and we'll get started right away.</p>
    <button class="btn-luma" onclick="openModal('discordModal')"><span><i class="ti ti-brand-discord"></i> Start Your Project</span></button>
</div>

<script>
    const steps = document.querySelectorAll('.js-reveal');
    const laser = document.getElementById('laser');
    const container = document.querySelector('.pipeline-container');

    function updateWorkflow() {
        const scrollY = window.scrollY;
        const vh = window.innerHeight;
        const trigger = vh * 0.8;

        if(window.innerWidth > 850 && container && laser) {
            const rect = container.getBoundingClientRect();
            const start = rect.top + scrollY;
            let progress = (scrollY + (vh/2)) - start;
            if (progress < 0) progress = 0;
            if (progress > rect.height) progress = rect.height;
            laser.style.height = progress + 'px';
        }

        steps.forEach(step => {
            const stepTop = step.getBoundingClientRect().top;
            if (stepTop < trigger) { 
                step.classList.add('is-active'); 
            } else { 
                step.classList.remove('is-active'); 
            }
        });
    }
    
    window.addEventListener('scroll', () => { requestAnimationFrame(updateWorkflow); });
    window.addEventListener('load', updateWorkflow);
    setTimeout(updateWorkflow, 500); 
</script>

<?php include __DIR__ . '/../templates/footer.php'; ?>
