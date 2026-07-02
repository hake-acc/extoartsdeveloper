<?php
declare(strict_types=1);
$page_title = "Privacy Policy | ExtoArts YouTube Editing Agency";
$page_desc = "ExtoArts Privacy Policy. Covers GDPR and CCPA rights, cookies, data retention, deletion requests, Discord project records, and client file handling.";
include __DIR__ . '/../templates/header.php';
?>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://extoarts.in/" },
    { "@type": "ListItem", "position": 2, "name": "Privacy Policy", "item": "https://extoarts.in/privacy" }
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://extoarts.in/privacy",
  "url": "https://extoarts.in/privacy",
  "name": "Privacy Policy | ExtoArts",
  "description": "ExtoArts Privacy Policy explaining GDPR and CCPA rights, cookies, analytics, data retention, deletion requests, Discord project records, and client file handling.",
  "inLanguage": "en-US",
  "datePublished": "2024-01-01",
  "dateModified": "2026-06-08",
  "publisher": { "@id": "https://extoarts.in/#organization" },
  "isPartOf": { "@id": "https://extoarts.in/#website" },
  "breadcrumb": { "@type": "BreadcrumbList", "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://extoarts.in/" },
    { "@type": "ListItem", "position": 2, "name": "Privacy Policy", "item": "https://extoarts.in/privacy" }
  ]}
}
</script>

<?php

$sections = [
    ["01", "Who We Are", "<p><strong>ExtoArts</strong> is an open, community-driven creative hub operating at <strong>extoarts.in</strong>. We connect content creators with specialist video editors, thumbnail designers, and creative professionals across YouTube, short-form video, motion graphics, and channel automation.</p><p>ExtoArts operates primarily through Discord. Project briefs, revision requests, file handoff, approvals, and delivery are coordinated through our official Discord server and email. For any privacy question or data request, contact <strong>extoarts@gmail.com</strong>.</p>"],
    ["02", "Information We Collect", "<p>We collect only the information reasonably needed to respond to inquiries, scope projects, deliver services, process payments, protect our website, and maintain accurate client records.</p><ul><li><strong>Contact details:</strong> name, email address, Discord username, social profile links, and any details you provide in forms, email, or tickets.</li><li><strong>Account data (dashboard users):</strong> if you are granted access to the ExtoArts client dashboard, we store your login credentials (hashed password), account type, and the date your account was created. Dashboard accounts are created by ExtoArts staff - you do not self-register.</li><li><strong>Project information:</strong> briefs, references, brand assets, raw footage, thumbnails, music, scripts, voiceovers, gameplay files, feedback notes, and final deliverables.</li><li><strong>Order and chat records:</strong> project orders, status updates, package details, payment notes, and in-dashboard chat messages are stored in our database to support your project and maintain a record of agreements.</li><li><strong>Commercial records:</strong> quote history, invoices, payment status, transaction references, refunds, chargeback records, and service history.</li><li><strong>Communication records:</strong> Discord ticket messages, email threads, revision requests, approvals, and support conversations.</li><li><strong>Technical and analytics data:</strong> IP address, browser type, device type, approximate location (country or region), referring pages, page views, and session data collected by Google Analytics and our hosting and CDN providers for security, uptime, and usage analysis.</li><li><strong>Preference data:</strong> theme preference and Terms acceptance stored locally in your browser only - not transmitted to our servers.</li></ul>"],
    ["03", "How We Use Information", "<p>We use personal information for legitimate business purposes, contract performance, consent-based processing where required, and legal compliance.</p><ul><li>To answer inquiries, prepare quotes, and recommend the right creative service.</li><li>To create project tickets, assign editors or designers, manage revisions, and deliver final files.</li><li>To process payments, prevent fraud, resolve disputes, and keep financial records.</li><li>To protect our website, Discord server, client files, and team members from spam, abuse, and unauthorized activity.</li><li>To improve page performance, service quality, portfolio presentation, and support workflows.</li><li>To display completed work in our portfolio only where our Terms allow it or where you have not requested confidentiality before work begins.</li></ul><p>We do <strong>not</strong> sell personal information, rent client lists, or use client project data for unrelated advertising profiles.</p>"],
    ["04", "Legal Bases for Processing", "<p>If GDPR, UK GDPR, or similar privacy laws apply to you, our legal bases may include:</p><ul><li><strong>Contract:</strong> processing needed to quote, perform, revise, and deliver requested services.</li><li><strong>Legitimate interests:</strong> operating the agency, securing the site, improving services, preventing fraud, and maintaining client records.</li><li><strong>Consent:</strong> optional portfolio permissions, optional marketing communications, and any cookie-based tracking that legally requires consent.</li><li><strong>Legal obligation:</strong> tax, accounting, dispute, abuse-prevention, and compliance record keeping.</li></ul>"],
    ["05", "Cookies, Local Storage & Analytics", "<p>ExtoArts uses browser storage and analytics to run the site and understand how it is used.</p><ul><li><strong>localStorage (functional):</strong> we store your theme preference and Terms acceptance in your browser's localStorage so the site remembers your choices. This is purely functional - no data is sent to our servers.</li><li><strong>Session cookies (authenticated users):</strong> when you log in to the ExtoArts client dashboard, a secure server-side session cookie is set to maintain your authenticated session. This cookie expires when you log out or close your browser.</li><li><strong>Google Analytics 4 (analytics):</strong> we use Google Analytics to understand how visitors find and use the website. Google Analytics sets cookies that collect anonymised usage data including page views, session duration, approximate location (country or region), device type, and referral source. This data is sent to and processed by Google LLC under their own <a href=\"https://policies.google.com/privacy\" target=\"_blank\" rel=\"noopener\">Privacy Policy</a>. You can opt out at any time using the <a href=\"https://tools.google.com/dlpage/gaoptout\" target=\"_blank\" rel=\"noopener\">Google Analytics Opt-out Browser Add-on</a>.</li></ul><p>We do not use advertising pixels, retargeting cookies, or behaviorally targeted ad networks. If this changes, we will update this policy and provide appropriate consent controls where required by law.</p>"],
    ["06", "Third-Party Service Providers", "<p>Our services depend on trusted third-party platforms. When you use those platforms, their own terms and privacy policies also apply. The following providers may receive or process data in connection with ExtoArts:</p><ul><li><strong>Discord:</strong> primary project communication, ticketing, revision management, file delivery, and community coordination. Discord may process messages, usernames, and any files you share in project tickets.</li><li><strong>Supabase (PostgreSQL database):</strong> cloud-hosted database storing account information, project orders, chat messages, and payment status for registered dashboard users. Data is stored on Supabase-managed servers.</li><li><strong>Google Analytics (Google LLC):</strong> website usage analytics. See Section 05 for full details and opt-out options.</li><li><strong>Payment providers (PayPal, cryptocurrency networks, bank transfer services, UPI, EasyPaisa, Bkash):</strong> payment processing, transaction verification, fraud prevention, and refund handling. ExtoArts does not store card numbers, bank account credentials, or wallet private keys.</li><li><strong>Cloudflare / hosting provider:</strong> HTTPS, caching, DDoS protection, firewall rules, security logs, and site performance.</li><li><strong>Google Fonts (fonts.googleapis.com):</strong> web font delivery. Google may log the requesting IP address and browser type.</li><li><strong>Font Awesome (cdnjs.cloudflare.com):</strong> icon library delivered from a CDN. Standard request logs may be generated.</li><li><strong>Image CDNs (iili.io / freeimage.host, ImgBB):</strong> portfolio images and site assets are served from these permanent image hosting providers.</li><li><strong>Lordicon / Lottie (cdn.lordicon.com, lottie.host):</strong> animated icon assets used in the site interface.</li><li><strong>File transfer tools:</strong> temporary handling of large raw footage, source references, and deliverables during active projects.</li></ul><p>We share personal information with third parties only when necessary to deliver services, comply with law, protect users, or work with providers acting on our behalf. We do not sell personal information to any party.</p>"],
    ["07", "International Transfers", "<p>ExtoArts serves creators globally. Your information may be processed in countries other than your own through Discord, hosting providers, payment services, email providers, and file-transfer tools. Those countries may have privacy laws different from your location.</p><p>Where required, we rely on appropriate safeguards such as service-provider contracts, platform privacy commitments, standard contractual protections, consent, or necessity for contract performance.</p>"],
    ["08", "Retention & Deletion", "<p>We keep information only as long as reasonably necessary for the purpose collected, unless a longer period is required for legal, tax, payment, fraud-prevention, or dispute reasons.</p><ul><li><strong>Project files:</strong> typically retained for up to 6 months after completion unless you request earlier deletion, request extended storage, or the files are needed for an active dispute.</li><li><strong>Discord and email records:</strong> retained as needed to document project decisions, revision approvals, payment disputes, and support history.</li><li><strong>Financial records:</strong> retained for accounting, tax, fraud-prevention, and chargeback purposes.</li><li><strong>Portfolio items:</strong> may remain public until removed, unless confidentiality was agreed before project start or removal is legally required.</li></ul><p>To request deletion, email <strong>extoarts@gmail.com</strong> with enough information for us to identify the relevant project or account.</p>"],
    ["09", "Your Privacy Rights", "<p>Depending on your location, you may have the right to:</p><ul><li>Request access to personal information we hold about you.</li><li>Request correction of inaccurate or incomplete information.</li><li>Request deletion of personal information, subject to lawful retention limits.</li><li>Request restriction of processing or object to certain processing.</li><li>Request a portable copy of information you provided to us.</li><li>Withdraw consent where processing is based on consent.</li><li>Complain to a privacy regulator in your region.</li></ul><p>We aim to respond to valid privacy requests within 30 days. Complex requests or requests requiring identity verification may take longer where permitted by law.</p>"],
    ["10", "CCPA / CPRA Notice for California Residents", "<p>If you are a California resident, you may have rights under the CCPA/CPRA, including the right to know, access, correct, delete, and limit certain uses of personal information.</p><p><strong>Do Not Sell or Share:</strong> ExtoArts does not sell personal information and does not knowingly share personal information for cross-context behavioral advertising. If this changes, we will update this policy and provide a clear opt-out method.</p><p>We do not discriminate against users for exercising privacy rights. To submit a California privacy request, contact <strong>extoarts@gmail.com</strong> with the subject line “California Privacy Request.”</p>"],
    ["11", "Children & Minors", "<p>Our services are intended for users aged 13 and older. We do not knowingly collect personal information from children under 13. If you believe a child under 13 provided personal information to ExtoArts, contact us and we will take reasonable steps to delete it.</p><p>If you are under the age of majority in your location, you should use our services only with permission from a parent, guardian, or responsible adult.</p>"],
    ["12", "Security", "<p>We use reasonable technical and organizational safeguards to protect information, including HTTPS, platform access controls, limited team access, Discord ticket privacy, and security monitoring provided by hosting and CDN services.</p><p>No online service can guarantee absolute security. You are responsible for sending only assets you are authorized to share and for protecting your own Discord, email, file-storage, and payment accounts.</p>"],
    ["13", "Changes to This Policy", "<p>We may update this Privacy Policy as our services, tools, or legal requirements change. The updated version will be posted on this page with a revised effective date. Continued use of the website or services after an update means you accept the revised policy.</p>"],
    ["14", "Contact", "<p>For privacy questions, access requests, deletion requests, or complaints, contact us at <strong>extoarts@gmail.com</strong>. You may also reach us through our official Discord server for project-specific requests.</p>"]
];
?>

<style>
    .privacy-wrapper { max-width: 920px; margin: 140px auto 100px; padding: 0 20px; }
    .privacy-header { text-align: center; margin-bottom: 54px; }
    .privacy-kicker { font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 4px; color: var(--primary); display: block; margin-bottom: 16px; }
    .privacy-header h1 { font-size: clamp(2.2rem, 6vw, 3.6rem); font-weight: 900; margin-bottom: 12px; letter-spacing: -1.5px; }
    .privacy-lede { max-width: 760px; margin: 0 auto; font-size: 1rem; line-height: 1.8; color: var(--text-muted); }
    .privacy-meta { display: flex; justify-content: center; gap: 18px 30px; flex-wrap: wrap; margin-top: 24px; }
    .privacy-meta span { font-size: 0.78rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1.6px; color: var(--text-muted); display: flex; align-items: center; gap: 7px; }
    .privacy-meta span i { color: var(--primary); }
    .privacy-notice { background: var(--primary-glow); border: 1px solid rgba(0,210,255,0.24); border-radius: 20px; padding: 22px 26px; margin-bottom: 34px; font-size: 0.96rem; line-height: 1.8; color: var(--text-muted); }
    .privacy-notice strong { color: var(--text-main); }
    .priv-section { border: 1px solid var(--border); border-radius: 24px; margin-bottom: 18px; overflow: hidden; background: var(--surface); transition: border-color 0.3s, box-shadow 0.3s; scroll-margin-top: 120px; position: relative; }
    .priv-section:hover { border-color: var(--border-hover); box-shadow: 0 6px 24px rgba(0,0,0,0.18); }
    .priv-section-header { display: flex; align-items: center; gap: 16px; padding: 26px 32px; }
    .priv-num { width: 38px; height: 38px; min-width: 38px; background: var(--primary-glow); border: 1px solid rgba(0,210,255,0.25); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.76rem; font-weight: 900; color: var(--primary); flex-shrink: 0; animation: numFloat 3.5s ease-in-out infinite; }
    .priv-section:nth-child(2n) .priv-num { animation-delay: -1.75s; }
    .priv-section:nth-child(3n) .priv-num { animation-delay: -0.9s; }
    @keyframes numFloat {
        0%, 100% { transform: translateY(0); box-shadow: 0 0 0px rgba(0,196,240,0); }
        50% { transform: translateY(-4px); box-shadow: 0 6px 18px rgba(0,196,240,0.25); }
    }
    .priv-section-header h2 { font-size: 1.12rem; font-weight: 850; color: var(--text-main); margin: 0; line-height: 1.35; }
    .priv-body { padding: 0 32px 30px; }
    .priv-body p { font-size: 0.96rem; line-height: 1.85; color: var(--text-muted); margin-bottom: 14px; }
    .priv-body p:last-child { margin-bottom: 0; }
    .priv-body ul { list-style: none; padding: 0; margin: 14px 0; display: grid; gap: 8px; }
    .priv-body ul li { font-size: 0.95rem; line-height: 1.7; color: var(--text-muted); padding-left: 22px; position: relative; }
    .priv-body ul li::before { content: ""; position: absolute; left: 0; top: 12px; width: 7px; height: 7px; border-radius: 50%; background: var(--primary); box-shadow: 0 0 12px var(--primary-glow); }
    .priv-body strong { color: var(--text-main); font-weight: 750; }
    .priv-body a { color: var(--primary); }
    .priv-divider { height: 1px; background: var(--border); margin: 0 32px 26px; }
    .privacy-contact { text-align: center; margin-top: 54px; padding: 38px; border: 1px solid var(--border); border-radius: 24px; background: var(--surface); }
    .privacy-contact h3 { font-size: 1.24rem; font-weight: 850; margin-bottom: 10px; }
    .privacy-contact p { color: var(--text-muted); font-size: 0.95rem; margin-bottom: 24px; line-height: 1.7; }
    @media (max-width: 600px) {
        .privacy-wrapper { margin-top: 100px; }
        .priv-section-header { padding: 18px 16px; align-items: flex-start; }
        .priv-body { padding: 0 16px 20px; }
        .priv-divider { margin: 0 16px 20px; }
        .privacy-contact { padding: 28px 16px; }
    }
</style>

<main class="privacy-wrapper">
    <header class="privacy-header">
        <span class="privacy-kicker">Legal</span>
        <h1>Privacy Policy</h1>
        <p class="privacy-lede">This Privacy Policy explains what personal information ExtoArts collects, the purposes for which it is processed, how long it is retained, and the rights available to you under applicable privacy laws including GDPR, UK GDPR, CCPA, and CPRA.</p>
        <div class="privacy-meta">
            <span><i class="ti ti-calendar"></i> Effective: June 8, 2026</span>
            <span><i class="ti ti-shield-check" aria-hidden="true" style="color:var(--primary);vertical-align:middle;font-size:0.85em;margin-right:5px;"></i> Version 4.0</span>
            <span><i class="ti ti-world"></i> Global Notice</span>
        </div>
    </header>

    <div style="background:rgba(251,191,36,0.1);border:1px solid rgba(251,191,36,0.35);border-radius:16px;padding:18px 24px;margin-bottom:28px;font-size:0.9rem;line-height:1.75;color:var(--text-muted);">
        <strong style="color:#f59e0b;">Notice:</strong> This document is provided for informational purposes only and does not constitute legal advice. ExtoArts is not a licensed law firm. Consult a qualified attorney or data protection professional in your jurisdiction for specific legal matters.
    </div>

    <div class="privacy-notice">
        <strong>Plain-language summary:</strong> we collect the information needed to communicate with clients, deliver creative work, process payments, protect the site, and keep project records. We use Google Analytics for website usage data. We do not sell personal information, and you can contact us to access, correct, or request deletion of your data.
    </div>

    <?php foreach ($sections as $section): ?>
        <section class="priv-section" id="privacy-<?php echo $section[0]; ?>">
            <div class="priv-section-header">
                <div class="priv-num"><?php echo $section[0]; ?></div>
                <h2><?php echo htmlspecialchars($section[1]); ?></h2>
            </div>
            <div class="priv-divider"></div>
            <div class="priv-body">
                <?php echo $section[2]; ?>
            </div>
        </section>
    <?php endforeach; ?>

    <div class="privacy-contact">
        <h3>Questions About Your Privacy?</h3>
        <p>If you have a privacy question, want a copy of your data, or want project files removed from our records, contact us directly.</p>
        <a href="mailto:extoarts@gmail.com" class="btn btn-glass"><i class="ti ti-mail"></i> Email Us</a>
        <button class="btn btn-main" onclick="openModal('discordModal')"><i class="ti ti-brand-discord"></i> Discord</button>
    </div>
</main>

<?php include __DIR__ . '/../templates/footer.php'; ?>
