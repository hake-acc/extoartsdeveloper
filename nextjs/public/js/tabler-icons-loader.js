// Loads Tabler Icons CSS asynchronously after paint so it is
// never render-blocking. Now self-hosted: no CDN dependency.
// Executed via <Script strategy="afterInteractive">.
(function () {
  var l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = '/css/tabler-icons.min.css';
  document.head.appendChild(l);
})();
