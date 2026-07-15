// Loads Tabler Icons webfont CSS asynchronously after paint so it is
// never render-blocking. Executed via <Script strategy="afterInteractive">.
(function () {
  var l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = 'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.33.0/dist/tabler-icons.min.css';
  l.crossOrigin = 'anonymous';
  document.head.appendChild(l);
})();
