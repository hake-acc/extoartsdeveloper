import Head from 'next/head';
import Layout from '../components/Layout';

export default function Page() {
  return (
    <Layout currentPage="collab">
      <Head>
        <title>Brand Partnerships & Creative Collabs | ExtoArts</title>
        <meta name="description" content="Partner with ExtoArts for brand collaborations, content partnerships, and creative alliances that align with our values and creative standards." />
      </Head>
 
 */}

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
  "name": "Brand Partnerships & Creative Collaborations | ExtoArts",
  "description": "Partner with ExtoArts for brand collaborations, content partnerships, and creative alliances that align with our values and creative standards.",
  "url": "https://extoarts.in/collab",
  "isPartOf": {
    "@type": "WebSite",
    "name": "ExtoArts",
    "url": "https://extoarts.in"
  },
  "about": {
    "@type": "Organization",
    "name": "ExtoArts",
    "url": "https://extoarts.in"
  }
}
</script>

<style>
    .collab-container { padding: 180px 20px 100px; max-width: 1200px; margin: 0 auto; position: relative; z-index: 10; }
    
    .page-header { text-align: center; margin-bottom: 80px; }
    .page-header h1 { font-size: clamp(3rem, 8vw, 5.5rem); font-weight: 900; line-height: 1.1; margin-bottom: 20px; letter-spacing: -2px; }
    .page-header p { font-size: 1.2rem; color: #8b949e; line-height: 1.6; max-width: 700px; margin: 0 auto; }

    /* Split Grid Layout */
    .collab-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: stretch; }
    @media (max-width: 900px) { .collab-grid { grid-template-columns: 1fr; } }

    /* Glass Cards */
    .info-card { padding: 50px 40px; border-radius: 40px; display: flex; flex-direction: column; justify-content: center; }
    .info-card:hover { border-color: var(--primary) !important; transform: translateY(-10px); }
    
    .card-icon { width: 70px; height: 70px; background: rgba(0,210,255,0.05); border: 1px solid rgba(0,210,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin-bottom: 25px; }
    
    .info-card h2 { font-size: 2rem; font-weight: 900; margin-bottom: 20px; letter-spacing: -1px; }
    .info-card p { font-size: 1.05rem; line-height: 1.7; margin-bottom: 20px; }
    .info-card p:last-of-type { margin-bottom: 0; }

    .tag-cloud { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 25px; }
    .tag { background: var(--bg); border: 1px solid var(--border); padding: 8px 16px; border-radius: 50px; font-size: 0.85rem; font-weight: 800; letter-spacing: 1px; color: var(--text-main); }

    .cta-wrapper { text-align: center; margin-top: 80px; }
</style>

<div className="collab-container">
    <div className="page-header" data-aos="fade-down">
        <div style="margin-bottom:22px;"><i className="fas fa-handshake" aria-hidden="true" style="font-size:3rem;color:var(--primary);display:block;text-align:center;"></i></div>
        <h1>
            <span className="sr-only">Brand Partnerships & Creative Collaborations | ExtoArts</span>
            <span aria-hidden="true"><span style="color: var(--text-main);">Strategic </span><span className="auto-type" data-words="Partnerships.|Collabs.|Alliances." style="color: var(--primary); -webkit-text-fill-color: var(--primary);">Partnerships.</span><span className="type-cursor" style="-webkit-text-fill-color: var(--text-main); color: var(--text-main);">|</span></span>
        </h1>
        <p>We truly value every opportunity to connect and grow together!</p>
    </div>

    <div className="collab-grid">
        <div className="info-card" data-aos="fade-right">
            <div className="card-icon"><lord-icon src="https://cdn.lordicon.com/ucfjvctd.json" trigger="loop" delay="1500" colors="primary:#22d3ee" stroke="bold" style="width:40px;height:40px;"></lord-icon></div>
            <h2>How We Collab</h2>
            <p>We’re always open to meaningful collaborations that align with our goals and community values. If you’re interested in working with us, feel free to reach out or create a ticket at our discord server with your proposal.</p>
            <p>Whether you’re aiming for sleek visuals or engaging media content, our team is ready to make it happen.</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 40px;">
            <div className="info-card" data-aos="fade-left" data-aos-delay="100">
                <div className="card-icon" style="color: var(--purple); border-color: var(--purple);"><lord-icon src="https://cdn.lordicon.com/okgbpdra.json" trigger="loop" delay="1500" stroke="bold" style="width:40px;height:40px;"></lord-icon></div>
                <h2>What We Offer</h2>
                <div className="tag-cloud">
                    <span className="tag">GFX</span>
                    <span className="tag">SFX</span>
                    <span className="tag">VFX</span>
                    <span className="tag">Thumbnails</span>
                    <span className="tag">Video Editing</span>
                    <span className="tag">Content Writing</span>
                    <span className="tag">Post-Production</span>
                    <span className="tag">3D Design</span>
                </div>
            </div>

            <div className="info-card" data-aos="fade-left" data-aos-delay="200" style="padding: 40px;">
                <h2 style="font-size: 1.5rem; display:flex; align-items:center; gap:10px;"><i className="fas fa-tags" style="font-size:19px;color:var(--primary);animation:li-shake var(--li-dur,1.5s) ease infinite;"></i> Curious About Pricing?</h2>
                <p>Since every project is unique, our pricing is flexible and based on the level of detail, creativity, and effort required. To get an estimate or discuss your project, simply open a ticket and our team will assist you shortly.</p>
            </div>
        </div>

    </div>

    <div className="cta-wrapper" data-aos="fade-up">
        <button className="btn-luma" onclick="openModal('discordModal')"><span>
            <i className="fab fa-discord"></i> Open a Proposal Ticket</span>
        </button>
    </div>

</div>


    </Layout>
  );
}
