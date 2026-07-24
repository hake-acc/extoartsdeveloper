const CACHE = 'extoarts-v8';

self.addEventListener('install', () => {
    // No aggressive precaching on install - it creates network contention on first load.
    // Pages and assets are cached lazily as the user browses via the fetch handler.
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', e => {
    const req = e.request;
    const url = new URL(req.url);

    // ── Portal / auth pages: always network-first, never serve stale ──────────
    const isPortal = ['/dashboard','/login','/register','/logout','/apply',
                      '/hq-portal','/chat'].some(p => url.pathname.startsWith(p))
                  || url.pathname.startsWith('/api/');
    if (isPortal) {
        e.respondWith(
            fetch(req).catch(() => caches.match(req))
        );
        return;
    }

    // ── HTML navigation: stale-while-revalidate ────────────────────────────────
    // Serve cached page instantly if available, refresh cache in background.
    if (req.mode === 'navigate') {
        e.respondWith(
            caches.open(CACHE).then(cache =>
                cache.match(req).then(cached => {
                    const networkFetch = fetch(req).then(res => {
                        if (res.ok) cache.put(req, res.clone());
                        return res;
                    }).catch(() => cached);
                    return cached || networkFetch;
                })
            )
        );
        return;
    }

    // ── Static assets (CSS, JS, fonts, images): cache-first, update in background ──
    const isStatic = url.origin !== location.origin
        || /\.(woff2?|ttf|png|jpg|jpeg|webp|gif|svg|ico|css|js|mp4)$/i.test(url.pathname);
    if (isStatic) {
        e.respondWith(
            caches.open(CACHE).then(cache =>
                cache.match(req).then(cached => {
                    const networkFetch = fetch(req).then(res => {
                        if (res && res.ok) cache.put(req, res.clone());
                        return res;
                    });
                    if (cached) {
                        if (!url.search.includes('v=')) networkFetch.catch(() => {});
                        return cached;
                    }
                    return networkFetch;
                })
            )
        );
        return;
    }
});
