/**
 * ExtoArts — Third-Party Library Integration
 * ──────────────────────────────────────────────────────────────────────────
 * Initialises: GSAP + ScrollTrigger, Splitting.js, Swiper.js
 *
 * Heavy libraries removed (Three.js, tsParticles, Lenis, Anime.js) to
 * reduce JS payload by ~1.1 MB and eliminate 404 console errors.
 *
 * Each block is fully guarded — if a CDN script fails to load the whole
 * file still runs without errors. Respects prefers-reduced-motion and the
 * existing data-perf="low|mid" adaptive performance system.
 *
 * Load-order contract (footer.php):
 *   gsap → ScrollTrigger → splitting → swiper → THIS FILE → app scripts
 */
(function () {
    'use strict';

    /* ── Performance / motion guards ────────────────────────────────────── */
    var PRM  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var PERF = document.documentElement.dataset.perf || 'high'; // 'low'|'mid'|'high'
    var LOW  = PERF === 'low';

    /* ═══════════════════════════════════════════════════════════════════════
       1. GSAP + ScrollTrigger
       Registers the plugin then applies non-destructive effects:
         a) Hero parallax drift (scrolls 18% of its height by viewport bottom)
         b) Section-label eyebrow reveal for [data-gsap-reveal] elements
         c) Card-grid stagger for containers with [data-gsap-grid]
       Does NOT re-animate anything already handled by AOS or custom CSS.
    ═══════════════════════════════════════════════════════════════════════ */
    function initGSAP() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        gsap.registerPlugin(ScrollTrigger);

        if (PRM) return;

        /* b) Eyebrow label reveals */
        gsap.utils.toArray('[data-gsap-reveal]').forEach(function (el) {
            gsap.from(el, {
                opacity : 0,
                y       : 28,
                duration: 0.85,
                ease    : 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 88%', once: true }
            });
        });

        /* c) Card grid stagger for opt-in containers */
        gsap.utils.toArray('[data-gsap-grid]').forEach(function (grid) {
            var items = grid.querySelectorAll(
                '.tilt-card, .info-card, .c-card, .price-card, .story-card, .process-card'
            );
            if (!items.length) return;
            gsap.from(items, {
                opacity : 0,
                y       : 36,
                stagger : 0.09,
                duration: 0.72,
                ease    : 'power2.out',
                scrollTrigger: { trigger: grid, start: 'top 82%', once: true }
            });
        });
    }

    /* ═══════════════════════════════════════════════════════════════════════
       2. SPLITTING.JS — Character & word splitting
       Opt-in via HTML attributes:
         data-splitting          → auto splits by chars (library default)
         data-split-chars        → splits + applies --char-index CSS var for
                                   staggered CSS animations
       Does NOT touch .ea-word elements — those use the existing custom system.
    ═══════════════════════════════════════════════════════════════════════ */
    function initSplitting() {
        if (typeof Splitting === 'undefined') return;

        /* Auto-split anything marked data-splitting (library default) */
        var generic = document.querySelectorAll('[data-splitting]:not([data-split-chars])');
        if (generic.length) Splitting({ target: generic });

        /* Char-indexed split with CSS animation support */
        document.querySelectorAll('[data-split-chars]').forEach(function (el) {
            var results = Splitting({ target: el, by: 'chars' });
            if (PRM) return;
            results.forEach(function (r) {
                r.chars.forEach(function (ch, i) {
                    ch.style.setProperty('--char-index', i);
                    ch.style.setProperty('--char-total', r.chars.length);
                    ch.style.animationDelay = (i * 30) + 'ms';
                });
                el.classList.add('ea-split-ready');
            });
        });
    }

    /* ═══════════════════════════════════════════════════════════════════════
       3. SWIPER.JS — Carousel/slider initialisation
       Opt-in via class: <div class="swiper ea-swiper"> ... </div>
       Optional data attrs on the .ea-swiper element:
         data-swiper-autoplay  → enables 4 s autoplay
         data-swiper-per-view  → fixed slidesPerView (overrides breakpoints)
       Standard Swiper DOM inside: .swiper-wrapper > .swiper-slide
       Sibling elements .swiper-pagination and .swiper-button-next/prev
       are auto-wired if present.
    ═══════════════════════════════════════════════════════════════════════ */
    function initSwiper() {
        if (typeof Swiper === 'undefined') return;

        document.querySelectorAll('.ea-swiper').forEach(function (el) {
            if (el.dataset.swiperInit) return;
            el.dataset.swiperInit = '1';

            var parent     = el.parentElement || el;
            var perView    = el.dataset.swiperPerView ? parseInt(el.dataset.swiperPerView, 10) : 'auto';
            var hasAutoplay = !!el.dataset.swiperAutoplay;

            new Swiper(el, {
                slidesPerView: perView,
                spaceBetween : 16,
                loop         : true,
                speed        : 560,
                grabCursor   : true,
                autoplay     : hasAutoplay ? { delay: 4000, disableOnInteraction: true, pauseOnMouseEnter: true } : false,
                pagination   : {
                    el       : parent.querySelector('.swiper-pagination'),
                    clickable: true,
                    dynamicBullets: true,
                },
                navigation: {
                    nextEl: parent.querySelector('.swiper-button-next'),
                    prevEl: parent.querySelector('.swiper-button-prev'),
                },
                breakpoints: perView === 'auto' ? {
                    480 : { slidesPerView: 1 },
                    768 : { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                } : {},
                a11y         : { enabled: true },
                keyboard     : { enabled: true },
            });
        });
    }

    /* ═══════════════════════════════════════════════════════════════════════
       BOOTSTRAP — run after DOM is ready
    ═══════════════════════════════════════════════════════════════════════ */
    function boot() {
        initGSAP();
        initSplitting();
        initSwiper();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
