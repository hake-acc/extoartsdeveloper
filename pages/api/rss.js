// RSS feed (placeholder - ExtoArts does not have a blog)
export default function handler(req, res) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>ExtoArts Creator Insights</title>
    <link>https://extoarts.in</link>
    <description>YouTube video editing tips, channel growth strategies, and creator resources from ExtoArts.</description>
    <language>en-US</language>
    <atom:link href="https://extoarts.in/rss" rel="self" type="application/rss+xml"/>
  </channel>
</rss>`;
  res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.status(200).send(xml);
}
