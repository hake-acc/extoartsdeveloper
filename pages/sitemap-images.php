<?php
declare(strict_types=1);
header('Content-Type: application/xml; charset=UTF-8');

$portfolioFile = __DIR__ . '/../data/portfolio.json';
$categories = [];
if (is_file($portfolioFile)) {
    $categories = json_decode(file_get_contents($portfolioFile), true) ?: [];
}

$baseUrl = 'https://extoarts.in';

echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

  <url>
    <loc>https://extoarts.in/</loc>
    <image:image>
      <image:loc>https://iili.io/BZ0qLb4.png</image:loc>
      <image:title>ExtoArts - YouTube Video Editing Agency</image:title>
      <image:caption>ExtoArts banner - elite YouTube video editing and thumbnail design agency for creators</image:caption>
    </image:image>
    <image:image>
      <image:loc>https://iili.io/BZ0qsef.jpg</image:loc>
      <image:title>Rehan - ExtoArts Founder and Creative Director</image:title>
      <image:caption>Rehan, founder and creative director of ExtoArts YouTube video editing agency</image:caption>
    </image:image>
  </url>

  <url>
    <loc>https://extoarts.in/about</loc>
    <image:image>
      <image:loc>https://iili.io/BZ0qsef.jpg</image:loc>
      <image:title>Rehan - ExtoArts Founder</image:title>
      <image:caption>Rehan, founder of ExtoArts YouTube video editing and thumbnail design agency</image:caption>
    </image:image>
  </url>

<?php foreach ($categories as $cat):
    $catName = htmlspecialchars($cat['name'] ?? '', ENT_XML1);
    $catSlug = htmlspecialchars($cat['slug'] ?? '', ENT_XML1);
    $items = $cat['items'] ?? [];
    $imageItems = array_filter($items, fn($i) => ($i['project_type'] ?? '') === 'image' && !empty($i['thumbnail_url']));
    if (empty($imageItems)) continue;
?>
  <url>
    <loc><?php echo $baseUrl . '/portfolio#' . $catSlug; ?></loc>
<?php foreach ($imageItems as $item):
    $imgUrl = htmlspecialchars($item['thumbnail_url'], ENT_XML1);
    $imgTitle = htmlspecialchars(($item['title'] ?? $catName . ' Design') . ' - ExtoArts', ENT_XML1);
    $imgCaption = htmlspecialchars('YouTube thumbnail design: ' . ($item['title'] ?? $catName) . ' by ExtoArts', ENT_XML1);
?>
    <image:image>
      <image:loc><?php echo $imgUrl; ?></image:loc>
      <image:title><?php echo $imgTitle; ?></image:title>
      <image:caption><?php echo $imgCaption; ?></image:caption>
    </image:image>
<?php endforeach; ?>
  </url>

<?php endforeach; ?>

</urlset>
