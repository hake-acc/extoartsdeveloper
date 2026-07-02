/**
 * ExtoArts — Cinematic Background System
 * Layer 3: Scroll parallax depth
 * Layer 4: Perspective grid cursor reaction
 * Layer 5: Section atmosphere transitions
 * Layer 6: Interactive spotlight on CTAs + cards
 *
 * GPU contract: only transform + opacity are mutated at runtime.
 */
(function () {
    'use strict';

    var html    = document.documentElement;
    var perf    = html.getAttribute('data-perf');
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Nothing to do on low-power devices — CSS hides the whole layer */
    if (perf === 'low') return;

    /* ─────────────────────────────────────────────────────────────────
       LAYER 3  Scroll depth parallax
       depthA moves slightly with scroll, depthB against it.
       Very subtle factors (0.036 / 0.020) keep it imperceptible
       yet perceivable on stare.
    ──────────────────────────────────────────────────────────────── */
    var depthA   = document.getElementById('bgDepthA');
    var depthB   = document.getElementById('bgDepthB');
    var scrollY  = 0;
    var depthRaf = false;

    if ((depthA || depthB) && !reduced) {
        window.addEventListener('scroll', function () {
            scrollY = window.scrollY;
            if (!depthRaf) {
                depthRaf = true;
                requestAnimationFrame(function () {
                    depthRaf = false;
                    if (depthA) depthA.style.transform = 'translateY(' + (scrollY * 0.036).toFixed(2) + 'px)';
                    if (depthB) depthB.style.transform = 'translateY(' + (scrollY * -0.020).toFixed(2) + 'px)';
                });
            }
        }, { passive: true });
    }

    /* ─────────────────────────────────────────────────────────────────
       LAYER 4  Perspective grid cursor tilt
       Max tilt: ±1.1 degrees. At 900px perspective this creates
       roughly 2-3px apparent pixel shift at center — feels like depth,
       not an obvious effect. Lazy follow (lerp) prevents jitter.
    ──────────────────────────────────────────────────────────────── */
    var gridInner = document.getElementById('bgGridInner');
    var gx = 0, gy = 0, gcx = 0, gcy = 0, gridRaf = false;

    if (gridInner && !reduced && perf !== 'mid') {
        document.addEventListener('mousemove', function (e) {
            /* Normalise to -1 … +1 */
            gx = (e.clientX / window.innerWidth  - 0.5) * 2;
            gy = (e.clientY / window.innerHeight - 0.5) * 2;
            if (!gridRaf) {
                gridRaf = true;
                requestAnimationFrame(tickGrid);
            }
        }, { passive: true });

        function tickGrid() {
            /* Exponential smoothing */
            gcx += (gx - gcx) * 0.055;
            gcy += (gy - gcy) * 0.055;
            var rx =  gcy * 1.1;   /* tilt around X-axis based on vertical mouse */
            var ry = -gcx * 1.1;   /* tilt around Y-axis based on horizontal mouse */
            gridInner.style.transform =
                'perspective(900px) rotateX(' + rx.toFixed(3) + 'deg) rotateY(' + ry.toFixed(3) + 'deg)';
            /* Keep animating until settled */
            if (Math.abs(gx - gcx) > 0.0025 || Math.abs(gy - gcy) > 0.0025) {
                requestAnimationFrame(tickGrid);
            } else {
                gridRaf = false;
            }
        }
    }

    /* ─────────────────────────────────────────────────────────────────
       LAYER 5  Section atmosphere
       IntersectionObserver watches major page regions and sets a
       body class that drives CSS transition on aurora band opacity.
       Debounced with a small timer so rapid scrolling doesn't flicker.
    ──────────────────────────────────────────────────────────────── */
    if ('IntersectionObserver' in window) {
        var sectionMap = [
            { sel: 'footer',                        cls: 's-footer'    },
            { sel: '.portfolio-section, #portfolio', cls: 's-portfolio' },
            { sel: '.pricing-section, .pricing-grid, .price-card', cls: 's-pricing' },
        ];

        var atmTimer = null;
        var activeAtm = '';

        function setAtmosphere(cls) {
            if (cls === activeAtm) return;
            clearTimeout(atmTimer);
            atmTimer = setTimeout(function () {
                if (activeAtm) document.body.classList.remove(activeAtm);
                if (cls)        document.body.classList.add(cls);
                activeAtm = cls;
            }, 120);
        }

        var atmObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    setAtmosphere(entry.target._atmCls || '');
                }
            });
        }, { threshold: 0.20 });

        sectionMap.forEach(function (mapping) {
            var els = document.querySelectorAll(mapping.sel);
            els.forEach(function (el) {
                el._atmCls = mapping.cls;
                atmObs.observe(el);
            });
        });

        /* Reset to default (hero) when top of page visible */
        var heroSentinel = document.querySelector('.hero-section, main > section:first-child');
        if (heroSentinel) {
            heroSentinel._atmCls = '';
            atmObs.observe(heroSentinel);
        }
    }

    /* ─────────────────────────────────────────────────────────────────
       LAYER 6  Interactive spotlight
       A radial-gradient spotlight (il-overlay) is injected into each
       target element. It follows the cursor inside the element's
       bounding box, creating a soft light-response without a glow.
    ──────────────────────────────────────────────────────────────── */
    function initSpotlight() {
        var targets = document.querySelectorAll(
            '.btn-luma, .btn-luma-white, ' +
            '.service-card, .price-card, .c-card, ' +
            '.portfolio-item, .founder-card-inline, ' +
            '.process-card, .stat-item, .quick-link'
        );

        targets.forEach(function (el) {
            /* Prevent double-injection on re-init */
            if (el.querySelector('.il-overlay')) return;

            /* Elements must be non-static for absolute child */
            var pos = window.getComputedStyle(el).position;
            if (pos === 'static') el.style.position = 'relative';

            var overlay = document.createElement('div');
            overlay.className = 'il-overlay';
            el.insertBefore(overlay, el.firstChild); /* first child — natural order keeps text above */

            el.addEventListener('mousemove', function (e) {
                var rect = el.getBoundingClientRect();
                var x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1) + '%';
                var y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1) + '%';
                el.style.setProperty('--il-x', x);
                el.style.setProperty('--il-y', y);
                overlay.classList.add('il-on');
            }, { passive: true });

            el.addEventListener('mouseleave', function () {
                overlay.classList.remove('il-on');
            });
        });
    }

    /* ─────────────────────────────────────────────────────────────────
       INIT
       Run on DOM-ready and again after extoReady (loader dismiss)
       so portal pages that build their UI dynamically get coverage.
    ──────────────────────────────────────────────────────────────── */
    function init() { initSpotlight(); }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    document.addEventListener('extoReady', function () {
        initSpotlight();
    }, { once: true });

})();
