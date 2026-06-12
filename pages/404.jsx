import Head from 'next/head';
import Layout from '../components/Layout';

export default function NotFound() {
  return (
    <Layout currentPage="404">
      <Head>
        <title>404 Not Found | ExtoArts</title>
        <meta name="robots" content="noindex" />
      </Head>
      <section style={{textAlign:'center',padding:'120px 20px'}}>
        <h1 style={{fontSize:'6rem',fontWeight:'900',background:'linear-gradient(135deg,#22d3ee,#6366f1)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',marginBottom:'16px'}}>404</h1>
        <p style={{fontSize:'1.2rem',color:'var(--text-muted)',marginBottom:'32px'}}>This page does not exist or was moved.</p>
        <a href="/" style={{display:'inline-flex',alignItems:'center',gap:'8px',padding:'14px 28px',background:'var(--primary)',color:'#000',fontWeight:'900',borderRadius:'12px',textDecoration:'none',fontSize:'0.95rem'}}>
          Back to Home
        </a>
      </section>
    </Layout>
  );
}
