import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en" className="no-js">
      <Head>
        <script dangerouslySetInnerHTML={{ __html: `document.documentElement.classList.replace('no-js','js')` }} />
        <meta name="author" content="ExtoArts" />
        <meta name="keywords" content="YouTube video editing agency, thumbnail design service, retention editing, TikTok video editing, YouTube automation, video editing for YouTube, ExtoArts" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="theme-color" content="#030305" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#f8fafc" media="(prefers-color-scheme: light)" />
        <meta name="geo.region" content="IN" />
        <meta name="geo.placename" content="India" />
        <meta name="application-name" content="ExtoArts" />
        <meta name="msapplication-TileColor" content="#030305" />
        <meta name="msapplication-TileImage" content="/favicon-192.png" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:locale:alternate" content="en_GB" />
        <meta property="og:locale:alternate" content="en_AU" />
        <meta property="og:locale:alternate" content="en_IN" />
        <meta property="og:site_name" content="ExtoArts" />
        <meta property="og:image" content="https://iili.io/BZ0qLb4.png" />
        <meta property="og:image:width" content="2048" />
        <meta property="og:image:height" content="1144" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:alt" content="ExtoArts - Elite YouTube Video Editing Agency" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@extoarts" />
        <meta name="twitter:creator" content="@extoarts" />
        <meta name="twitter:image" content="https://iili.io/BZ0qLb4.png" />

        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="search" type="application/opensearchdescription+xml" title="ExtoArts" href="/opensearch.xml" />
        <link rel="alternate" type="application/rss+xml" title="ExtoArts Creator Insights" href="/rss" />

        <link rel="preconnect" href="https://iili.io" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://unpkg.com" crossOrigin="" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="" />

        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&display=swap" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
        <link rel="stylesheet" href="https://unpkg.com/aos@2.3.1/dist/aos.css" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebSite",
                "@id": "https://extoarts.in/#website",
                "name": "ExtoArts",
                "url": "https://extoarts.in/",
                "inLanguage": "en-US",
                "description": "YouTube-focused video editing agency offering retention editing, thumbnail design, TikTok short-form editing, and YouTube automation."
              },
              {
                "@type": ["Organization", "ProfessionalService"],
                "@id": "https://extoarts.in/#organization",
                "name": "ExtoArts",
                "url": "https://extoarts.in/",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://i.ibb.co/JR76yvRp/1758037248-icon.png",
                  "width": 512,
                  "height": 512
                },
                "foundingDate": "2024",
                "priceRange": "$$",
                "sameAs": [
                  "https://x.com/extoarts",
                  "https://youtube.com/@extoarts",
                  "https://www.instagram.com/extoarts",
                  "https://discord.gg/extoarts-1402333030827425922"
                ]
              }
            ]
          })}}
        />

        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=G-WTFPZB9Y4C`}
        />
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-WTFPZB9Y4C');
        `}} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
