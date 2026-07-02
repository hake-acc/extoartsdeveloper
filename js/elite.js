/**
 * ExtoArts — Elite Interactions
 * Magnetic buttons, GSAP parallax, stat counters, lazy images.
 *
 * Runs AFTER libs-init.js (GSAP, Lenis, Splitting, Anime all available).
 * Respects existing systems: cursor glow (motion.js), tilt (premium.js),
 * AOS (loader.js), hero parallax (motion.js) — does NOT duplicate them.
 *
 * GPU contract: only transform + opacity + clip-path in rAF loops.
 * Guards: prefers-reduced-motion + data-perf="low" respected throughout.
 */
(function () {
    'use strict';

    var PRM  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var FINE = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var PERF = document.documentElement.dataset.perf || 'high';
    var LOW  = PERF === 'low';

    /* ═══════════════════════════════════════════════════════════════════
       1. MAGNETIC BUTTONS
       Galaxy-btn and btn-main move toward the cursor when the mouse
       is within the activation radius. Spring-returns on leave.
       Uses GSAP for smooth spring easing.
       Only on pointer:fine — never on touch.
    ═══════════════════════════════════════════════════════════════════ */
    function initMagneticButtons() {
        if (!FINE || PRM || typeof gsap === 'undefined') return;

        var SELECTORS = [
            '.galaxy-btn',
            '.btn-main:not(.no-mag)',
        ].join(', ');

        document.querySelectorAll(SELECTORS).forEach(function (btn) {
            var strength = btn.classList.contains('galaxy-btn') ? 0.40 : 0.25;
            var RADIUS   = 90; /* px: activation zone around button */

            btn.addEventListener('mousemove', function (e) {
                var rect = btn.getBoundingClientRect();
                var cx   = rect.left + rect.width  / 2;
                var cy   = rect.top  + rect.height / 2;
                var dx   = e.clientX - cx;
                var dy   = e.clientY - cy;

                gsap.to(btn, {
                    x       : dx * strength,
                    y       : dy * strength,
                    duration: 0.35,
                    ease    : 'power2.out',
                    overwrite: true,
                });
            });

            btn.addEventListener('mouseleave', function () {
                gsap.to(btn, {
                    x       : 0,
                    y       : 0,
                    duration: 0.55,
                    ease    : 'power3.out',
                    overwrite: true,
                });
            });
        });
    }

    /* ═══════════════════════════════════════════════════════════════════
       2. IMAGE PARALLAX — GSAP ScrollTrigger
       Preview cards, reel cards, and thumb tiles get a gentle y-offset
       as they scroll through the viewport (content scrolls slower than
       the page, creating depth).
       Parent element must have overflow:hidden — css/elite.css handles this.
    ═══════════════════════════════════════════════════════════════════ */
    function initImageParallax() {
        if (PRM || LOW || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        /* Preview cards */
        document.querySelectorAll('.preview-card .preview-img').forEach(function (img) {
            gsap.fromTo(img,
                { yPercent: -8 },
                {
                    yPercent: 8,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: img.closest('.preview-card'),
                        start  : 'top bottom',
                        end    : 'bottom top',
                        scrub  : 1.2,
                    }
                }
            );
        });

        /* Reel card images */
        document.querySelectorAll('.reel-card > img, .reel-card > video').forEach(function (el) {
            gsap.fromTo(el,
                { yPercent: -6 },
                {
                    yPercent: 6,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: el.closest('.reel-card'),
                        start  : 'top bottom',
                        end    : 'bottom top',
                        scrub  : 1.4,
                    }
                }
            );
        });

        /* Thumb strip tiles */
        document.querySelectorAll('.thumb-tile img').forEach(function (img, i) {
            var dir = i % 2 === 0 ? -5 : 5;
            gsap.fromTo(img,
                { yPercent: dir * -1 },
                {
                    yPercent: dir,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: img.closest('.thumb-tile') || img,
                        start  : 'top bottom',
                        end    : 'bottom top',
                        scrub  : 1,
                    }
                }
            );
        });

        /* Founder card photo */
        var founderImg = document.querySelector('.founder-photo-wrap img, .founder-photo');
        if (founderImg) {
            gsap.fromTo(founderImg,
                { yPercent: -4 },
                {
                    yPercent: 4,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: founderImg.closest('.founder-card-inline') || founderImg,
                        start  : 'top bottom',
                        end    : 'bottom top',
                        scrub  : 1.5,
                    }
                }
            );
        }
    }

    /* ═══════════════════════════════════════════════════════════════════
       4. GSAP STAGGER CARD REVEALS
       Adds a second layer of stagger animation to card grids that have
       [data-gsap-grid] — complementing AOS on the section headings.
       Targets elements NOT already initialised by AOS to avoid conflict.
    ═══════════════════════════════════════════════════════════════════ */
    function initCardStagger() {
        if (PRM || LOW || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        document.querySelectorAll('[data-gsap-grid]').forEach(function (grid) {
            var cards = grid.querySelectorAll(
                '.tilt-card, .info-card, .c-card, .price-card, .story-card, .process-card'
            );
            if (!cards.length) return;

            gsap.from(cards, {
                opacity : 0,
                y       : 40,
                stagger : 0.08,
                duration: 0.8,
                ease    : 'power3.out',
                scrollTrigger: {
                    trigger: grid,
                    start  : 'top 82%',
                    once   : true,
                }
            });
        });
    }

    /* ═══════════════════════════════════════════════════════════════════
       5. GSAP HEADING WORD REVEAL
       Elements with [data-elite-text] get their words split by
       Splitting.js then animated in with a Y-translate stagger.
       Avoids conflict with AOS by targeting only [data-elite-text],
       not [data-aos] elements.
    ═══════════════════════════════════════════════════════════════════ */
    function initTextReveals() {
        if (PRM || typeof gsap === 'undefined' || typeof Splitting === 'undefined') return;
        if (typeof ScrollTrigger === 'undefined') return;

        document.querySelectorAll('[data-elite-text]').forEach(function (el) {
            /* Split into words only (not chars) to keep aria intact */
            var result = Splitting({ target: el, by: 'words' });
            if (!result || !result[0]) return;

            var words = result[0].words;
            gsap.set(words, { opacity: 0, y: '110%' });

            ScrollTrigger.create({
                trigger: el,
                start  : 'top 88%',
                once   : true,
                onEnter: function () {
                    gsap.to(words, {
                        opacity : 1,
                        y       : '0%',
                        duration: 0.7,
                        stagger : 0.055,
                        ease    : 'power3.out',
                    });
                },
            });
        });
    }

    /* ═══════════════════════════════════════════════════════════════════
       6. LAZY IMAGE LOAD — opacity reveal
       Adds .ea-loaded once the browser fires the 'load' event on each
       <img loading="lazy">. CSS elite.css starts them at opacity:0 and
       transitions to 1 when this class is added.
    ═══════════════════════════════════════════════════════════════════ */
    function initLazyImages() {
        document.querySelectorAll('img[loading="lazy"]').forEach(function (img) {
            if (img.complete && img.naturalWidth) {
                img.classList.add('ea-loaded');
                return;
            }
            img.addEventListener('load', function () {
                img.classList.add('ea-loaded');
            });
            img.addEventListener('error', function () {
                img.classList.add('ea-loaded'); /* reveal even on error */
            });
        });
    }

    /* ═══════════════════════════════════════════════════════════════════
       7. MOUSE PARALLAX — hero floating badges
       The hero platform badges (.hp-badge) move slightly opposite to
       the cursor — adds the illusion of a z-depth layer above the hero.
       Separate from motion.js cursor glow (that follows mouse directly).
    ═══════════════════════════════════════════════════════════════════ */
    function initHeroBadgeParallax() {
        if (!FINE || PRM || LOW) return;

        var hero   = document.querySelector('.hero');
        var badges = document.querySelectorAll('.hp-badge');
        if (!hero || !badges.length) return;

        var tx = 0, ty = 0;
        var cx = 0, cy = 0;

        function lerp(a, b, t) { return a + (b - a) * t; }

        hero.addEventListener('mousemove', function (e) {
            var rect = hero.getBoundingClientRect();
            tx = ((e.clientX - rect.left) / rect.width  - 0.5) * 14;
            ty = ((e.clientY - rect.top)  / rect.height - 0.5) * 8;
        }, { passive: true });

        hero.addEventListener('mouseleave', function () {
            tx = 0; ty = 0;
        });

        (function loop() {
            cx = lerp(cx, tx, 0.06);
            cy = lerp(cy, ty, 0.06);
            badges.forEach(function (b, i) {
                var depth = 0.6 + i * 0.15;
                b.style.transform = 'translateY(var(--float-y, 0px)) translate(' +
                    (-cx * depth).toFixed(2) + 'px,' +
                    (-cy * depth).toFixed(2) + 'px)';
            });
            requestAnimationFrame(loop);
        })();
    }

    /* ═══════════════════════════════════════════════════════════════════
       8. SECTION FADE-IN (non-AOS sections)
       GSAP ScrollTrigger fade for sections that don't carry data-aos.
       Uses opacity + translateY — same GPU contract as AOS.
    ═══════════════════════════════════════════════════════════════════ */
    function initSectionFades() {
        if (PRM || LOW || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        var candidates = document.querySelectorAll(
            'section:not([data-aos]):not([data-gsap-revealed])'
        );

        candidates.forEach(function (sec) {
            /* Mark so we don't double-init on hot-reload */
            sec.dataset.gsapRevealed = '1';
            gsap.from(sec, {
                opacity : 0,
                y       : 24,
                duration: 0.9,
                ease    : 'power2.out',
                scrollTrigger: {
                    trigger: sec,
                    start  : 'top 88%',
                    once   : true,
                }
            });
        });
    }

    /* ═══════════════════════════════════════════════════════════════════
       UTILITY — observe once with IntersectionObserver
    ═══════════════════════════════════════════════════════════════════ */
    function observeOnce(el, cb) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                io.unobserve(entry.target);
                cb(entry.target);
            });
        }, { threshold: 0.55 });
        io.observe(el);
    }

    /* ═══════════════════════════════════════════════════════════════════
       BOOTSTRAP
    ═══════════════════════════════════════════════════════════════════ */
    function boot() {
        initLazyImages();       /* First — no deps */
        initMagneticButtons();
        initTextReveals();
        initCardStagger();
        initImageParallax();
        initHeroBadgeParallax();
        initSectionFades();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
