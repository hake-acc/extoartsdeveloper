/**
 * ExtoArts — Premium Card Interactions v2
 * Mouse-responsive 3D tilt + dynamic spotlight lighting on all major card types.
 * Replaces the old .js-tilt implementation with a smoother, site-wide system.
 * GPU-safe: only uses transform + opacity. Lerped for smooth motion.
 */
(function () {
    'use strict';

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const MAX_TILT = 3.5;   // max degrees of rotation — intentionally subtle
    const LERP_K   = 0.1;   // lerp factor — lower = smoother/slower return

    const SELECTORS = [
        '.tilt-card',
        '.price-card',
        '.info-card',
        '.story-card',
        '.c-card',
        '.rev-card',
    ].join(', ');

    function lerp(a, b, t) { return a + (b - a) * t; }

    function initCard(card) {
        if (card.dataset.pInit) return;
        card.dataset.pInit = '1';

        // Inject spotlight layer behind card content
        const spot = document.createElement('div');
        spot.className = 'card-spotlight';
        spot.setAttribute('aria-hidden', 'true');
        card.insertBefore(spot, card.firstChild);

        let tx = 0, ty = 0;   // target rotation
        let cx = 0, cy = 0;   // current rotation
        let hovered = false;
        let raf = null;

        function frame() {
            const ddx = tx - cx, ddy = ty - cy;
            if (Math.abs(ddx) < 0.005 && Math.abs(ddy) < 0.005) {
                cx = tx; cy = ty;
                apply(cx, cy);
                raf = null;
                return;
            }
            cx = lerp(cx, tx, LERP_K);
            cy = lerp(cy, ty, LERP_K);
            apply(cx, cy);
            raf = requestAnimationFrame(frame);
        }

        function apply(rx, ry) {
            const lift = hovered ? -5 : 0;
            card.style.transform =
                `perspective(820px) rotateX(${rx.toFixed(3)}deg) rotateY(${ry.toFixed(3)}deg) translateY(${lift}px)`;
        }

        function kick() { if (!raf) raf = requestAnimationFrame(frame); }

        card.addEventListener('mousemove', function (e) {
            const r = card.getBoundingClientRect();
            const mx = e.clientX - r.left;
            const my = e.clientY - r.top;

            // Normalize to [-1, 1]
            const nx = (mx / r.width  - 0.5) * 2;
            const ny = (my / r.height - 0.5) * 2;

            tx = -ny * MAX_TILT;
            ty =  nx * MAX_TILT;

            // Spotlight position
            card.style.setProperty('--sx', (mx / r.width  * 100).toFixed(1) + '%');
            card.style.setProperty('--sy', (my / r.height * 100).toFixed(1) + '%');
            card.style.setProperty('--sa', '1');

            kick();
        }, { passive: true });

        card.addEventListener('mouseenter', function () {
            hovered = true;
            card.style.setProperty('--sa', '1');
            kick();
        });

        card.addEventListener('mouseleave', function () {
            hovered = false;
            tx = 0; ty = 0;
            card.style.setProperty('--sa', '0');
            card.style.setProperty('--sx', '50%');
            card.style.setProperty('--sy', '50%');
            kick();

            // Remove inline transform after lerp settles so CSS hover can take over
            if (raf) {
                const old = raf;
                const cleanup = setInterval(function () {
                    if (!raf) {
                        clearInterval(cleanup);
                        card.style.transform = '';
                    }
                }, 50);
                setTimeout(function () { clearInterval(cleanup); }, 900);
            } else {
                card.style.transform = '';
            }
        });
    }

    function initAll() {
        document.querySelectorAll(SELECTORS).forEach(initCard);
    }

    // Immediate init for visible content
    if (document.readyState !== 'loading') {
        initAll();
    }
    document.addEventListener('DOMContentLoaded', initAll);

    // Re-init after loader hides (some cards may be in an AOS-hidden state initially)
    document.addEventListener('extoReady', function () {
        setTimeout(initAll, 400);
    });
})();
