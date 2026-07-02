<?php
declare(strict_types=1);
$page_title = "Terms of Service | ExtoArts YouTube Editing Agency";
$page_desc = "ExtoArts Terms of Service covering payments, revisions, ownership, portfolio rights, refunds, acceptable use, disputes, and client responsibilities.";
include __DIR__ . '/../templates/header.php';
?>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://extoarts.in/" },
    { "@type": "ListItem", "position": 2, "name": "Terms of Service", "item": "https://extoarts.in/tos" }
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://extoarts.in/tos",
  "url": "https://extoarts.in/tos",
  "name": "Terms of Service | ExtoArts YouTube Editing Agency",
  "description": "ExtoArts Terms of Service covering payments, revisions, ownership, portfolio rights, refunds, acceptable use, disputes, and client responsibilities.",
  "inLanguage": "en-US",
  "datePublished": "2026-06-08",
  "dateModified": "2026-06-08",
  "about": { "@id": "https://extoarts.in/#organization" },
  "publisher": { "@id": "https://extoarts.in/#organization" },
  "isPartOf": { "@id": "https://extoarts.in/#website" },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://extoarts.in/" },
      { "@type": "ListItem", "position": 2, "name": "Terms of Service", "item": "https://extoarts.in/tos" }
    ]
  }
}
</script>

<?php
$sections = [
    ["01", "Agreement & Scope", "<p>These Terms of Service govern your access to <strong>extoarts.in</strong> and your use of ExtoArts services, including YouTube video editing, thumbnail design, short-form editing, motion graphics, ads, creative strategy, and YouTube automation support.</p><p>By requesting a quote, opening a Discord ticket, paying an invoice, submitting project assets, approving work, or using any deliverable, you agree to these Terms. If you do not agree, do not use our services.</p>"],
    ["02", "Who ExtoArts Is", "<p><strong>ExtoArts is an independent, community-based creative agency.</strong> We are not represented as a formally incorporated company, LLC, corporation, or registered legal entity. We operate as a Discord-first creative team providing services on a good-faith commercial basis.</p><p>These Terms are intended to create a clear service agreement between you and ExtoArts. The informal status of the agency does not remove your obligation to pay for ordered work, respect our intellectual property, or follow these Terms.</p>"],
    ["03", "Official Communication Channels", "<p>Our official project channels are our Discord server, private Discord tickets, and <strong>extoarts@gmail.com</strong>. Discord is the preferred channel for project briefs, large file coordination, revisions, approvals, and delivery records.</p><ul><li>Project instructions should be submitted in one official ticket or email thread.</li><li>We are not responsible for missed instructions sent through unofficial accounts, personal DMs, deleted messages, or third-party impersonators.</li><li>You are responsible for keeping access to your Discord, email, and file-transfer accounts secure.</li></ul>"],
    ["04", "Quotes, Booking & Payment", "<p>Pricing is based on scope, complexity, urgency, usage rights, file volume, and the level of creative work required. A quote becomes active only after ExtoArts confirms it in writing through Discord or email.</p><ul><li><strong>Deposit:</strong> most projects require a 50% upfront deposit before work begins.</li><li><strong>Final payment:</strong> the remaining balance is due before unwatermarked, final-resolution, or source-level delivery unless agreed otherwise.</li><li><strong>Retainers:</strong> monthly retainers are billed at the start of the billing cycle and must be paid on time to keep priority placement.</li><li><strong>Fees:</strong> transfer, gateway, conversion, blockchain, bank, PayPal, or regional payment fees are the client's responsibility unless we agree otherwise.</li><li><strong>Currency:</strong> quotes are usually in USD unless another currency is clearly agreed.</li></ul><p>Accepted methods may include PayPal, bank transfer, cryptocurrency, UPI, Bkash, EasyPaisa, PKR transfer, or other approved methods. Availability may change.</p>"],
    ["05", "Client Responsibilities", "<p>You are responsible for giving us accurate instructions, lawful materials, timely feedback, and all assets needed to complete the work.</p><ul><li>You must own or have permission to use any footage, music, logos, fonts, characters, images, gameplay, voiceovers, scripts, or references you send.</li><li>You must identify any brand rules, platform rules, sponsor requirements, age restrictions, or content limitations before production begins.</li><li>You must provide feedback in a clear, consolidated format during the revision window.</li><li>You must not request illegal, exploitative, defamatory, hateful, sexually explicit, deceptive, or platform-violating content.</li></ul><p>You are responsible for copyright claims, Content ID issues, demonetization, strikes, takedowns, sponsor disputes, or legal issues caused by materials or instructions you supplied.</p>"],
    ["06", "Production Scope & Timeline", "<p>The project scope is the written brief, quote, and agreed deliverables confirmed before work begins. Anything not included in that scope may require extra cost or a separate booking.</p><ul><li>Estimated timelines are estimates, not guarantees, unless a rush deadline is expressly accepted in writing.</li><li>Late files, unclear instructions, slow approvals, payment delays, or major scope changes can move the delivery date.</li><li>We may pause work until missing assets, payments, or approvals are received.</li><li>Rush work may require an additional fee and depends on team availability.</li></ul>"],
    ["07", "Revisions & Approvals", "<p>Unless a quote says otherwise, standard projects include up to <strong>three rounds of minor revisions</strong>. Minor revisions include reasonable changes to pacing, text, color, sound levels, transitions, cuts, and similar adjustments within the original concept.</p><ul><li><strong>Major revisions</strong> include concept changes, new scripts, replacing large footage sections, new thumbnail directions, new animation style, new platform format, or changes that contradict the original brief.</li><li>Major revisions are billed separately or treated as a new project.</li><li>Revision requests must be sent as one consolidated list per round.</li><li>If you approve a draft, request final export, publish the work, or use the deliverable commercially, the work is considered accepted unless a clear defect is reported promptly.</li></ul>"],
    ["08", "Refunds, Cancellations & Chargebacks", "<p>Creative services require time, scheduling, planning, and skilled labor. For that reason, <strong>refunds are not available once production has begun</strong>, except where required by law or expressly agreed in writing.</p><ul><li><strong>Before production:</strong> if you cancel before an editor/designer is assigned and before work starts, we may refund the deposit minus payment fees and a reasonable administrative cost.</li><li><strong>After production begins:</strong> no refund is due. We may deliver the work completed up to the cancellation point after any outstanding balance is resolved.</li><li><strong>Quality disputes:</strong> if work does not match the agreed brief, our remedy is to correct it through reasonable revisions, not an automatic refund.</li><li><strong>Chargebacks:</strong> fraudulent or bad-faith chargebacks may result in service termination, loss of future service access, removal of unpaid usage rights, and evidence submission to the payment provider.</li></ul>"],
    ["09", "Ownership & Usage Rights", "<p>After full payment is received, you receive commercial usage rights to the final deliverables described in the quote, such as exported videos, thumbnails, ad creatives, or motion graphics.</p><ul><li>Rights transfer only after full payment clears.</li><li>Editable source files such as PSD, AEP, PRPROJ, project folders, presets, templates, raw timelines, and layered files are not included unless purchased or agreed in writing.</li><li>ExtoArts retains ownership of internal workflows, templates, presets, methods, unused concepts, project files, and agency know-how.</li><li>Third-party assets remain subject to their own license terms, including stock footage, fonts, plugins, music, SFX, software, character assets, and platform materials.</li></ul>"],
    ["10", "Portfolio, Credit & Confidentiality", "<p>Unless you request confidentiality before the project begins, ExtoArts may display completed work, screenshots, thumbnails, clips, before/after examples, and anonymized project results in our portfolio, social media, proposals, and marketing materials.</p><ul><li>If you need an NDA or private-label work, tell us before booking. Additional administrative or exclusivity fees may apply.</li><li>We will not intentionally publish private raw files, login details, unreleased sponsor information, or confidential strategy documents.</li><li>Portfolio rights do not give us ownership of your final paid deliverable; they allow us to show the work as an example of our services.</li></ul>"],
    ["11", "Brand Identity & Prior Use", "<p>The name <strong>ExtoArts</strong>, the domain <strong>extoarts.in</strong>, our logo, brand presentation, original site copy, service positioning, and creative materials are part of the ExtoArts brand identity established through public use beginning in 2024.</p><p>You may not impersonate ExtoArts, copy our website or brand in a confusing way, misrepresent affiliation with us, scrape our portfolio as your own, or use our name to collect payments or clients. We reserve all rights available to protect our brand, content, and reputation.</p>"],
    ["12", "Acceptable Use", "<p>You agree not to use our website, Discord server, or services to:</p><ul><li>Harass, threaten, abuse, exploit, or dox team members, clients, or community users.</li><li>Send malware, spam, phishing links, stolen files, or unauthorized account access.</li><li>Request content that is illegal, hateful, sexually exploitative, fraudulent, defamatory, or designed to evade platform rules.</li><li>Misrepresent ownership of assets, avoid payment, reverse-engineer unpaid drafts, or publish watermarked previews as final work.</li><li>Use bots, scrapers, or automated abuse against the website or Discord server.</li></ul>"],
    ["13", "Service Refusal & Termination", "<p>ExtoArts may refuse, pause, or terminate service if a client violates these Terms, fails to pay, behaves abusively, submits unlawful materials, files bad-faith disputes, or creates unreasonable risk for the team or community.</p><p>If service is terminated because of client misconduct, paid amounts are not refundable, and any unpaid deliverables or source files may be withheld.</p>"],
    ["14", "No Guaranteed Results", "<p>We work to create high-quality, retention-focused creative assets, but we do not guarantee views, subscribers, revenue, virality, click-through rate, watch time, monetization approval, sponsor results, or algorithmic performance. Platform outcomes depend on many factors outside our control, including your niche, audience, title, upload schedule, topic demand, channel history, and platform changes.</p>"],
    ["15", "Limitation of Liability", "<p>To the maximum extent permitted by applicable law, ExtoArts expressly excludes all liability for indirect, incidental, special, consequential, exemplary, or punitive damages arising from the website, services, files, delays, platform decisions, or client-provided materials - including lost profits, lost revenue, lost data, loss of goodwill, business interruption, or platform demonetization - even if ExtoArts has been advised of the possibility of such damages.</p><p>Our total aggregate liability for any claim arising from or related to a specific project is limited to the total amount you paid ExtoArts for that specific project in the 12 months preceding the claim. Nothing in these Terms limits liability where such limitation is prohibited by applicable law.</p>"],
    ["16", "Indemnity", "<p>You agree to indemnify and defend ExtoArts, its editors, designers, managers, contractors, and community team from and against any third-party claims, losses, damages, costs, and legal expenses arising from: your materials or instructions; your breach of these Terms; your misuse of deliverables; copyright or platform violations caused by assets you supplied; payment disputes initiated in bad faith; or your unlawful conduct.</p><p>This indemnity obligation is subject to the aggregate liability cap described in Section 15, except where prohibited by applicable law.</p>"],
    ["17", "Disputes", "<p>If a dispute arises, both parties agree to first attempt good-faith resolution through the original Discord ticket or <strong>extoarts@gmail.com</strong>. The party raising a dispute should explain the issue clearly and provide supporting evidence.</p><p>If the issue cannot be resolved within 30 days, the parties may pursue mediation, arbitration, or another mutually agreed process before formal legal action where practical. Nothing prevents either party from seeking urgent relief for fraud, impersonation, non-payment, confidentiality breaches, or intellectual-property misuse.</p>"],
    ["18", "Privacy", "<p>Our collection and use of personal information is explained in our <a href=\"/privacy\">Privacy Policy</a>. By using the website or services, you acknowledge that project communication, file handling, payment records, and Discord tickets may involve personal information processed as described there.</p>"],
    ["19", "Changes to These Terms", "<p>We may update these Terms when services, pricing, workflows, laws, or platform requirements change. Updated Terms will be posted on this page with a new effective date. Continued use of the website or services after changes means you accept the updated Terms. We will not apply material changes retroactively to projects already in progress at the time of the update.</p>"],
    ["20", "Governing Law", "<p>These Terms are intended to create a clear, good-faith commercial agreement. Because ExtoArts serves clients globally without a single registered jurisdiction, governing law for any formal dispute will be determined by the applicable law of the country or region in which you are ordinarily resident or in which the disputed services were contracted, unless a specific governing law is agreed in writing before work begins.</p><p>Nothing in this section prevents either party from seeking urgent relief in any competent court for fraud, non-payment, intellectual property misuse, or confidentiality breaches. We strongly recommend consulting qualified legal counsel in your jurisdiction before initiating any formal legal action.</p>"],
    ["21", "Severability & Miscellaneous", "<p><strong>Severability:</strong> If any provision of these Terms is found to be unenforceable or invalid under applicable law, that provision will be limited or modified to the minimum extent necessary to make it enforceable, or severed entirely if modification is not possible. All remaining provisions will continue in full force and effect.</p><p><strong>Entire Agreement:</strong> These Terms, together with any written project quote or brief confirmed by ExtoArts in writing, constitute the entire agreement between you and ExtoArts for the services described. They supersede all prior discussions, informal representations, and prior agreements on the same subject.</p><p><strong>Waiver:</strong> ExtoArts's failure to enforce any provision of these Terms on one occasion does not constitute a waiver of our right to enforce that provision in the future. No waiver is effective unless made in writing.</p><p><strong>Assignment:</strong> You may not transfer or assign your rights or obligations under these Terms without ExtoArts's prior written consent. ExtoArts may assign these Terms in connection with a business transfer, merger, or acquisition.</p>"],
    ["22", "Contact", "<p>For questions about these Terms, contact <strong>extoarts@gmail.com</strong> or open a ticket in our official Discord server at <a href=\"https://discord.gg/extoarts-1402333030827425922\">discord.gg/extoarts</a>.</p>"]
];
?>

<style>
    .tos-wrapper { max-width: 920px; margin: 140px auto 100px; padding: 0 20px; }
    .tos-header { text-align: center; margin-bottom: 54px; }
    .tos-kicker { font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 4px; color: var(--primary); display: block; margin-bottom: 16px; }
    .tos-header h1 { font-size: clamp(2.2rem, 6vw, 3.6rem); font-weight: 900; margin-bottom: 12px; letter-spacing: -1.5px; }
    .tos-lede { max-width: 760px; margin: 0 auto; font-size: 1rem; line-height: 1.8; color: var(--text-muted); }
    .tos-meta { display: flex; justify-content: center; gap: 18px 30px; flex-wrap: wrap; margin-top: 24px; }
    .tos-meta span { font-size: 0.78rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1.6px; color: var(--text-muted); display: flex; align-items: center; gap: 7px; }
    .tos-meta span i { color: var(--primary); }
    .tos-notice { background: var(--primary-glow); border: 1px solid rgba(0,210,255,0.24); border-radius: 20px; padding: 22px 26px; margin-bottom: 34px; font-size: 0.96rem; line-height: 1.8; color: var(--text-muted); }
    .tos-notice strong { color: var(--text-main); }
    .tos-section { border: 1px solid var(--border); border-radius: 24px; margin-bottom: 18px; overflow: hidden; background: var(--surface); transition: border-color 0.3s, box-shadow 0.3s; scroll-margin-top: 120px; position: relative; }
    .tos-section:hover { border-color: var(--border-hover); box-shadow: 0 6px 24px rgba(0,0,0,0.18); }
    .tos-section-header { display: flex; align-items: center; gap: 16px; padding: 26px 32px; }
    .tos-num { width: 38px; height: 38px; min-width: 38px; background: var(--primary-glow); border: 1px solid rgba(0,210,255,0.25); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.76rem; font-weight: 900; color: var(--primary); flex-shrink: 0; }
    .tos-section-header h2 { font-size: 1.12rem; font-weight: 850; color: var(--text-main); margin: 0; line-height: 1.35; }
    .tos-body { padding: 0 32px 30px; }
    .tos-body p { font-size: 0.96rem; line-height: 1.85; color: var(--text-muted); margin-bottom: 14px; }
    .tos-body p:last-child { margin-bottom: 0; }
    .tos-body ul { list-style: none; padding: 0; margin: 14px 0; display: grid; gap: 8px; }
    .tos-body ul li { font-size: 0.95rem; line-height: 1.7; color: var(--text-muted); padding-left: 22px; position: relative; }
    .tos-body ul li::before { content: ""; position: absolute; left: 0; top: 12px; width: 7px; height: 7px; border-radius: 50%; background: var(--primary); box-shadow: 0 0 12px var(--primary-glow); }
    .tos-body strong { color: var(--text-main); font-weight: 750; }
    .tos-body a { color: var(--primary); }
    .tos-divider { height: 1px; background: var(--border); margin: 0 32px 26px; }
    .tos-accept { background: var(--surface); border: 1px solid var(--primary); border-radius: 24px; padding: 38px; margin-top: 48px; display: flex; align-items: center; justify-content: space-between; gap: 28px; flex-wrap: wrap; }
    .tos-accept-text h3 { font-size: 1.22rem; font-weight: 850; margin-bottom: 8px; }
    .tos-accept-text p { font-size: 0.92rem; color: var(--text-muted); margin: 0; max-width: 480px; line-height: 1.7; }
    .tos-accept-btn { flex-shrink: 0; }
    @media (max-width: 600px) {
        .tos-wrapper { margin-top: 100px; }
        .tos-section-header { padding: 18px 16px; align-items: flex-start; }
        .tos-body { padding: 0 16px 20px; }
        .tos-divider { margin: 0 16px 20px; }
        .tos-accept { padding: 24px 16px; flex-direction: column; text-align: center; }
    }
</style>

<main class="tos-wrapper">
    <header class="tos-header">
        <span class="tos-kicker">Legal</span>
        <h1>Terms of Service</h1>
        <p class="tos-lede">These Terms explain how ExtoArts projects work, what clients are responsible for, how payments and revisions are handled, and what rights apply to creative deliverables.</p>
        <div class="tos-meta">
            <span><i class="ti ti-calendar"></i> Effective: June 8, 2026</span>
            <span><i class="ti ti-file-text"></i> Version 4.0</span>
            <span><i class="ti ti-world"></i> Global Agreement</span>
        </div>
    </header>

    <div style="background:rgba(251,191,36,0.1);border:1px solid rgba(251,191,36,0.35);border-radius:16px;padding:18px 24px;margin-bottom:28px;font-size:0.9rem;line-height:1.75;color:var(--text-muted);">
        <strong style="color:#f59e0b;">Notice:</strong> This document is provided for informational purposes only and does not constitute legal advice. ExtoArts is not a licensed law firm. Consult a qualified attorney in your jurisdiction for specific legal matters.
    </div>

    <div class="tos-notice">
        <strong>Please read carefully.</strong> By using ExtoArts services, sending project assets, making payment, or approving deliverables, you confirm that you understand and accept these Terms of Service.
    </div>

    <?php foreach ($sections as $section): ?>
        <section class="tos-section" id="terms-<?php echo $section[0]; ?>">
            <div class="tos-section-header">
                <div class="tos-num"><?php echo $section[0]; ?></div>
                <h2><?php echo htmlspecialchars($section[1]); ?></h2>
            </div>
            <div class="tos-divider"></div>
            <div class="tos-body">
                <?php echo $section[2]; ?>
            </div>
        </section>
    <?php endforeach; ?>

    <div class="tos-accept">
        <div class="tos-accept-text">
            <h3>Acknowledge & Accept</h3>
            <p>This saves an acceptance marker in your browser only. It does not create an account and does not send personal data to ExtoArts.</p>
        </div>
        <div class="tos-accept-btn">
            <button id="acceptBtn" class="btn btn-main" onclick="acceptTerms()">
                <i class="ti ti-circle-check" id="checkIcon" style="display:none;"></i>
                <span id="btnText">I Agree</span>
            </button>
        </div>
    </div>
</main>

<script>
    window.addEventListener('load', () => {
        if(localStorage.getItem('extoArtsTerms') === 'accepted') {
            const btn = document.getElementById('acceptBtn');
            document.getElementById('checkIcon').style.display = 'inline-block';
            document.getElementById('checkIcon').className = 'ti ti-checks';
            document.getElementById('btnText').innerText = 'Already Agreed';
            btn.style.background = 'rgba(0,210,255,0.1)';
            btn.style.boxShadow = 'none';
            btn.style.color = 'var(--primary)';
            btn.style.border = '1px solid rgba(0,210,255,0.3)';
            btn.disabled = true;
        }
    });

    function acceptTerms() {
        const btn = document.getElementById('acceptBtn');
        const icon = document.getElementById('checkIcon');
        const text = document.getElementById('btnText');
        icon.style.display = 'inline-block';
        icon.className = 'ti ti-circle-check';
        text.innerText = 'Agreed!';
        btn.style.background = 'linear-gradient(135deg, #00b09b, #96c93d)';
        btn.style.boxShadow = '0 0 40px rgba(0, 255, 100, 0.4)';
        btn.disabled = true;
        localStorage.setItem('extoArtsTerms', 'accepted');
        setTimeout(() => {
            document.body.classList.add('fade-out');
            setTimeout(() => { window.location.href = '/'; }, 400);
        }, 900);
    }
</script>

<?php include __DIR__ . '/../templates/footer.php'; ?>
