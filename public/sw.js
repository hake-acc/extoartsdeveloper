const CACHE = 'extoarts-v2';
const PRECACHE = [
    '/',
    '/services',
    '/portfolio',
    '/pricing',
    '/hire-video-editor',
    '/about',
    '/contact',
    '/workflow',
    '/faq',
    'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800;900&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css',
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE).then(c => c.addAll(PRECACHE.map(u => new Request(u, {credentials:'same-origin'})))).catch(() => {})
    );
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    );
    self.clients.claim();
});

self.addEventListener('fetch', e => {
    const url = new URL(e.request.url);
    // Network-first for HTML pages and auth routes (always fresh)
    if (e.request.mode === 'navigate' || url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/login') || url.pathname.startsWith('/register')) {
        e.respondWith(
            fetch(e.request).then(r => {
                const c = r.clone();
                caches.open(CACHE).then(cache => cache.put(e.request, c));
                return r;
            }).catch(() => caches.match(e.request))
        );
        return;
    }
    // Cache-first for static assets (fonts, images, CSS, JS)
    if (url.origin !== location.origin || /\.(woff2?|ttf|png|jpg|jpeg|webp|gif|svg|ico|css|js|mp4)$/i.test(url.pathname)) {
        e.respondWith(
            caches.match(e.request).then(cached => cached || fetch(e.request).then(r => {
                if (r.ok) {
                    const c = r.clone();
                    caches.open(CACHE).then(cache => cache.put(e.request, c));
                }
                return r;
            }))
        );
    }
});
