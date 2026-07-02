/**
 * ExtoArts - App Bootstrap
 * Adaptive performance detection, service worker, page transitions.
 *
 * Signals checked (in priority order):
 *   1. prefers-reduced-motion    — honoured in individual animation files
 *   2. Save-Data / slow network  — force low tier
 *   3. Hardware (cores + RAM)    — baseline tier
 *   4. Input method              — data-input="touch" on coarse pointer
 *   5. Battery (async)           — reactive low on critically low battery
 *   6. Runtime LCP (async)       — reactive mid if paint is very slow
 */

/* ── ADAPTIVE PERFORMANCE SYSTEM ──────────────────────────────────────── */
(function () {
    'use strict';
    try {
        /* ── 1. Hardware baseline ────────────────────────────────────────── */
        var cores = navigator.hardwareConcurrency || 4;
        var mem   = navigator.deviceMemory        || 4; /* GB; absent on Firefox */
        var low   = cores <= 2 || mem <= 1;
        var mid   = !low && (cores <= 4 || mem <= 2);

        /* ── 2. Network Information API ──────────────────────────────────── */
        /*    Save-Data or a slow effective connection overrides hardware.
              A mid-range device on 3G should still get reduced motion. */
        var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (conn) {
            if (conn.saveData ||
                conn.effectiveType === 'slow-2g' ||
                conn.effectiveType === '2g') {
                low = true; mid = false;          /* floor at low regardless of HW */
            } else if (!low && conn.effectiveType === '3g') {
                mid = true;                       /* capable HW but constrained pipe */
            }
        }

        /* ── 2b. Watch for network changes mid-session ───────────────────── */
        /*    effectiveType is a one-time snapshot; a 'change' event fires when
              the connection quality shifts (e.g. wifi → mobile, 4G → 3G). */
        if (conn && conn.addEventListener) {
            conn.addEventListener('change', function () {
                if (conn.saveData ||
                    conn.effectiveType === 'slow-2g' ||
                    conn.effectiveType === '2g') {
                    document.documentElement.setAttribute('data-perf', 'low');
                } else if (conn.effectiveType === '3g' &&
                           !document.documentElement.getAttribute('data-perf')) {
                    document.documentElement.setAttribute('data-perf', 'mid');
                }
            });
        }

        /* ── 3. Write synchronous tier ───────────────────────────────────── */
        if      (low) document.documentElement.setAttribute('data-perf', 'low');
        else if (mid) document.documentElement.setAttribute('data-perf', 'mid');
        /* high = no attribute (default — animation scripts check for absence) */

        /* ── 4. Input method ─────────────────────────────────────────────── */
        /*    Used by motion.js/ux.js to gate hover-only effects. */
        if (window.matchMedia('(pointer: coarse)').matches) {
            document.documentElement.setAttribute('data-input', 'touch');
        }

        /* ── 5. Battery API (async — reactive downgrade only) ────────────── */
        /*    Fires after initial render; safe to mutate data-perf mid-session
              because CSS [data-perf="low"] overrides kick in immediately. */
        if (navigator.getBattery) {
            navigator.getBattery().then(function (b) {
                function checkBattery() {
                    if (!b.charging && b.level < 0.15) {
                        document.documentElement.setAttribute('data-perf', 'low');
                    }
                }
                checkBattery();
                b.addEventListener('levelchange',     checkBattery);
                b.addEventListener('chargingchange',  checkBattery);
            }).catch(function () {});
        }

        /* ── 6. Reactive LCP: downgrade if paint is critically slow ──────── */
        /*    Only watches on non-low devices — low is already handled above.
              If LCP exceeds 4 s and no tier is set, apply mid so expensive
              continuous effects (cursor glow rAF, hero parallax) stop. */
        if (window.PerformanceObserver && !low) {
            try {
                new PerformanceObserver(function (list) {
                    var entries = list.getEntries();
                    if (!entries.length) return;
                    var lcp = entries[entries.length - 1].startTime;
                    if (lcp > 4000 && !document.documentElement.getAttribute('data-perf')) {
                        document.documentElement.setAttribute('data-perf', 'mid');
                    }
                }).observe({ type: 'largest-contentful-paint', buffered: true });
            } catch (e) {}
        }

    } catch (e) {}
})();

/* ── SERVICE WORKER ────────────────────────────────────────────────────── */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').catch(function () {});
    });
}

/* ── PAGE TRANSITION FALLBACK ─────────────────────────────────────────── */
/*    Runs only when the CSS @view-transition API isn't supported.
      Modern browsers (Chrome 126+, Firefox 134+, Safari 18.2+) use CSS rules. */
(function () {
    if (document.startViewTransition) return;

    /* Fade in on load */
    document.documentElement.style.opacity = '0';
    document.addEventListener('DOMContentLoaded', function () {
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                document.documentElement.style.transition = 'opacity 0.28s ease-out';
                document.documentElement.style.opacity = '';
                setTimeout(function () {
                    document.documentElement.style.transition = '';
                }, 350);
            });
        });
    });

    /* Fade out before navigating */
    document.addEventListener('click', function (e) {
        var a = e.target.closest('a[href]');
        if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
        var href = a.getAttribute('href') || '';
        if (!href ||
            href.charAt(0) === '#' ||
            href.indexOf('mailto:')     === 0 ||
            href.indexOf('tel:')        === 0 ||
            href.indexOf('javascript:') === 0) return;
        if (/^https?:\/\//.test(href) && href.indexOf(location.origin) !== 0) return;
        e.preventDefault();
        document.body.classList.add('page-out');
        var dest = href;
        setTimeout(function () { location.href = dest; }, 150);
    });
})();
