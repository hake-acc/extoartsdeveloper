/**
 * ExtoArts — Motion System (Emil Kowalski design philosophy)
 * Cursor glow trail, hero scroll parallax, ambient float,
 * avatar spring stagger, clip-path sec-label reveal, number scramble.
 *
 * Principles applied:
 *   - GPU-only: only transform + opacity + clip-path mutated at runtime
 *   - ease-out for entry (cubic-bezier(0.16,1,0.3,1))
 *   - Hover effects gated behind pointer:fine + hover:hover
 *   - prefers-reduced-motion: returns early where movement is involved
 *   - Never animate from scale(0) — minimum scale(0.78) + opacity
 *   - No animation on high-frequency actions (nav toggle, keyboard ops)
 *   - Spring lerp for decorative mouse tracking (natural momentum)
 */
(function () {
    'use strict';

    var reduced  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var fine     = window.matchMedia('(pointer: fine)').matches;
    var lowPerf  = document.documentElement.getAttribute('data-perf') === 'low';
    var midPerf  = document.documentElement.getAttribute('data-perf') === 'mid';

    /* ═══════════════════════════════════════════════════════════════════
       1. CURSOR GLOW TRAIL
       A 700px radial gradient that lazily follows the cursor with
       spring lerp (factor 0.09). The lag creates a sense of weight —
       it feels like light pooling, not a cursor copy.
       Pointer:fine only — never shown on touch devices.
       Purpose: decorative ambient depth, makes the page feel alive.
    ═══════════════════════════════════════════════════════════════════ */
    function initCursorGlow() {
        /* Cursor glow runs a continuous rAF loop — skip on mid and low perf
           devices where the compositor budget is needed for layout work. */
        if (!fine || reduced || lowPerf || midPerf) return;

        var glow = document.getElementById('ea-cursor-glow');
        if (!glow) {
            glow = document.createElement('div');
            glow.id = 'ea-cursor-glow';
            glow.setAttribute('aria-hidden', 'true');
            document.body.insertBefore(glow, document.body.firstChild);
        }

        var tx = window.innerWidth  / 2;
        var ty = window.innerHeight / 2;
        var cx = tx;
        var cy = ty;
        var visible = false;

        function lerp(a, b, t) { return a + (b - a) * t; }

        var html = document.documentElement;
        (function loop() {
            /* Reactively stop if perf is downgraded mid-session (battery drop,
               LCP threshold, or network change triggering a data-perf write).
               CSS already hides the element; stopping the rAF frees the
               compositor budget immediately without waiting for page reload. */
            var tier = html.getAttribute('data-perf');
            if (tier === 'low' || tier === 'mid') return;
            cx = lerp(cx, tx, 0.09);
            cy = lerp(cy, ty, 0.09);
            glow.style.transform = 'translate(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px)';
            requestAnimationFrame(loop);
        })();

        document.addEventListener('mousemove', function (e) {
            tx = e.clientX;
            ty = e.clientY;
            if (!visible) {
                visible = true;
                glow.style.opacity = '1';
            }
        }, { passive: true });

        document.addEventListener('mouseleave', function () {
            visible = false;
            glow.style.opacity = '0';
        });
    }

    /* Hero scroll parallax removed — content should scroll naturally */
    function initHeroParallax() {
        // Intentionally disabled: moving hero content on scroll caused
        // the upper section to visually drift away from its anchored position.
    }

    /* ═══════════════════════════════════════════════════════════════════
       3. AMBIENT FLOAT — hero platform badges
       .hp-badge elements breathe with a gentle y-drift (defined in
       motion.css as .ea-float). JS staggers animationDelay so each
       badge drifts at a different phase — feels organic, not robotic.
       Purpose: decorative, makes decorative UI elements feel alive.
    ═══════════════════════════════════════════════════════════════════ */
    function initAmbientFloat() {
        if (reduced) return;
        document.querySelectorAll('.hp-badge').forEach(function (el, i) {
            el.style.animationDelay = (i * 380) + 'ms';
            el.classList.add('ea-float');
        });
    }

    /* ═══════════════════════════════════════════════════════════════════
       4. AVATAR SPRING POP-IN
       Trust-section avatars (.htr-av) spring in on load with staggered
       delays (left→right cascade). Uses .ea-avatar-pop from motion.css
       which starts from scale(0.78) — not 0.
       "Nothing in the real world appears from nothing." — Emil Kowalski
       Purpose: first-time delight on landing page, reinforces social proof.
    ═══════════════════════════════════════════════════════════════════ */
    function initAvatarPop() {
        if (reduced) return;
        document.querySelectorAll('.htr-av').forEach(function (el, i) {
            el.style.animationDelay = (260 + i * 85) + 'ms';
            el.classList.add('ea-avatar-pop');
        });
    }

    /* ═══════════════════════════════════════════════════════════════════
       5. SECTION LABEL CLIP-PATH REVEAL
       .sec-label elements that DON'T have data-aos (handled by AOS)
       get a GPU clip-path sweep from left (inset(0 100% 0 0) → inset(0 0% 0 0)).
       CSS transitions (not keyframes) — interruptible if element
       leaves viewport before completing.
       Purpose: prevents jarring appearance; spatial direction from left
       mirrors natural reading order.
    ═══════════════════════════════════════════════════════════════════ */
    function initSecLabelReveal() {
        if (reduced) return;
        var labels = document.querySelectorAll('.sec-label:not([data-aos]):not([data-sl])');
        if (!labels.length) return;

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                io.unobserve(entry.target);
                /* rAF ensures the initial .ea-sl-init state paints before
                   .ea-sl-in triggers the transition — no flash-to-visible */
                requestAnimationFrame(function () {
                    requestAnimationFrame(function () {
                        entry.target.classList.add('ea-sl-in');
                    });
                });
            });
        }, { threshold: 0.55, rootMargin: '0px 0px -12px 0px' });

        labels.forEach(function (el) {
            el.setAttribute('data-sl', '1');
            el.classList.add('ea-sl-init');
            io.observe(el);
        });
    }

    /* ═══════════════════════════════════════════════════════════════════
       6. STAT NUMBER SCRAMBLE
       When stat numbers enter the viewport, they rapidly cycle random
       digits for ~520ms before the ease-out count-up resolves to the
       real value. Skips elements already handled by loader.js count-up
       (data-counted attribute).
       Purpose: state indication — makes stats feel "computed live"
       rather than static text that simply fades in.
    ═══════════════════════════════════════════════════════════════════ */
    function initNumberScramble() {
        if (reduced) return;

        var CHARS    = '0123456789';
        var SCRAMBLE = 520;   /* ms of random chars before count-up */
        var TOTAL    = 1800;  /* ms total animation */

        /* Target only elements not yet handled by loader.js count-up */
        var els = document.querySelectorAll('.stat-number:not([data-counted]):not([data-ns])');
        if (!els.length) return;

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                io.unobserve(entry.target);
                var el = entry.target;
                /* Mark so loader.js count-up skips it */
                el.setAttribute('data-ns',      '1');
                el.setAttribute('data-counted', '1');

                var raw    = el.textContent.trim();
                var match  = raw.match(/[\d.]+/);
                if (!match) return;

                var numStr = match[0];
                var target = parseFloat(numStr);
                var isFloat = numStr.includes('.');
                var digits  = Math.max(numStr.replace('.','').length, 1);
                var prefix  = raw.slice(0, raw.indexOf(numStr));
                var suffix  = raw.slice(raw.indexOf(numStr) + numStr.length);
                var t0 = performance.now();

                (function tick(now) {
                    var elapsed = now - t0;
                    var p = Math.min(elapsed / TOTAL, 1);

                    if (elapsed < SCRAMBLE) {
                        /* Scramble phase: random chars, same digit count */
                        var s = '';
                        for (var i = 0; i < digits; i++) {
                            s += CHARS[Math.floor(Math.random() * 10)];
                        }
                        el.textContent = prefix + s + suffix;
                    } else {
                        /* Count-up phase: ease-out-cubic */
                        var countP  = Math.min((elapsed - SCRAMBLE) / (TOTAL - SCRAMBLE), 1);
                        var eased   = 1 - Math.pow(1 - countP, 3);
                        var current = eased * target;
                        el.textContent = prefix + (isFloat ? current.toFixed(1) : Math.round(current)) + suffix;
                    }

                    if (p < 1) {
                        requestAnimationFrame(tick);
                    } else {
                        el.textContent = raw; /* Snap to exact final value */
                    }
                })(t0);
            });
        }, { threshold: 0.5 });

        els.forEach(function (el) { io.observe(el); });
    }

    /* ═══════════════════════════════════════════════════════════════════
       7. NAV SCROLL STATE
       Adds .ea-nav-scrolled to .site-nav once the user scrolls past
       48px. Uses rAF throttling so the scroll handler never blocks
       the main thread. Runs immediately to handle page loads that
       start mid-scroll (e.g. back/forward navigation).
    ═══════════════════════════════════════════════════════════════════ */
    function initNavScrolled() {
        var nav = document.querySelector('.site-nav');
        if (!nav) return;

        var THRESHOLD = 48;
        var ticking   = false;

        function update() {
            if (window.scrollY > THRESHOLD) {
                nav.classList.add('ea-nav-scrolled');
            } else {
                nav.classList.remove('ea-nav-scrolled');
            }
            ticking = false;
        }

        window.addEventListener('scroll', function () {
            if (!ticking) {
                requestAnimationFrame(update);
                ticking = true;
            }
        }, { passive: true });

        update(); /* sync initial state */
    }

    /* ═══════════════════════════════════════════════════════════════════
       8. SERVICE CARD ENTRANCE STAGGER
       Finds every .grid-3 container, assigns --i CSS custom property
       to each child (0, 1, 2 …), then adds .ea-stagger-ready so the
       CSS transition-delay formula activates. An IntersectionObserver
       adds .ea-stagger-in when ≥12% of the grid enters the viewport,
       triggering the staggered opacity + translateY entrance.
       Capped at 6 cards × 60ms = 360ms total stagger — within the
       impeccable-animate 500ms limit for 10 items.
    ═══════════════════════════════════════════════════════════════════ */
    function initServiceCardStagger() {
        if (reduced) return;

        var grids = document.querySelectorAll('.grid-3');
        if (!grids.length) return;

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                io.unobserve(entry.target);
                entry.target.classList.add('ea-stagger-in');
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });

        grids.forEach(function (grid) {
            /* Skip grids already handled by GSAP */
            if (grid.hasAttribute('data-gsap-grid')) return;
            /* Skip grids whose children are already owned by AOS — their
               entrance is AOS-driven; adding ea-stagger-ready would fight it
               (AOS manages opacity/transform on the same elements). */
            if (grid.children.length && grid.children[0].hasAttribute('data-aos')) return;
            Array.from(grid.children).forEach(function (child, i) {
                child.style.setProperty('--i', i);
            });
            grid.classList.add('ea-stagger-ready');
            io.observe(grid);
        });
    }

    /* ═══════════════════════════════════════════════════════════════════
       9. NAV HOVER PILL
       A sliding background pill that follows the cursor between nav links.
       Uses getBoundingClientRect to position accurately against the
       flex .nav-links container. Three-state machine:
         - idle     → pill is opacity:0, no transition on position
         - entering → pill snaps to position instantly, then fades in
         - tracking → pill slides with transition as cursor moves links
       Exiting the <ul> fades the pill out and resets to idle.
       Pointer:fine only — never runs on touch devices.
    ═══════════════════════════════════════════════════════════════════ */
    function initNavPill() {
        if (!fine) return;

        var ul = document.querySelector('.nav-links');
        if (!ul) return;

        var pill = document.createElement('span');
        pill.className = 'ea-nav-pill';
        pill.setAttribute('aria-hidden', 'true');
        ul.insertBefore(pill, ul.firstChild);
        /* Mark nav so CSS suppresses the per-link hover background */
        ul.classList.add('ea-pill-active');

        var links    = ul.querySelectorAll('a');
        var active   = false;
        var enterGen = 0; /* generation counter to cancel stale rAF callbacks */

        function placePill(link) {
            var ulRect   = ul.getBoundingClientRect();
            var linkRect = link.getBoundingClientRect();
            var x = linkRect.left - ulRect.left;
            /* Width is set instantly (no CSS transition on width — layout hit
               is one-time per hover, triggered by the user, not continuous).
               Position uses translateX — GPU composited, never layout. */
            pill.style.width     = linkRect.width + 'px';
            pill.style.transform = 'translateY(-50%) translateX(' + x + 'px)';
        }

        links.forEach(function (link) {
            link.addEventListener('mouseenter', function () {
                if (!active) {
                    /* First entry: position instantly (no transition), then
                       enable transitions for subsequent moves. Guard the rAF
                       with a generation token so a rapid mouseleave cannot
                       re-show the pill after it has already been hidden. */
                    var gen = ++enterGen;
                    pill.style.transition = 'none';
                    placePill(link);
                    requestAnimationFrame(function () {
                        if (gen !== enterGen) return; /* stale — mouseleave fired */
                        pill.style.transition = '';
                        pill.classList.add('ea-pill-visible');
                        active = true;
                    });
                } else {
                    placePill(link);
                }
            });
        });

        ul.addEventListener('mouseleave', function () {
            enterGen++;   /* invalidate any pending first-entry rAF */
            active = false;
            pill.classList.remove('ea-pill-visible');
        });
    }

    /* ═══════════════════════════════════════════════════════════════════
       INIT — runs after DOMContentLoaded.
       Heavy continuous effects (cursor glow, nav scroll) start
       immediately. One-time reveals wait for extoReady to ensure AOS
       has had a chance to initialise first so we can inspect
       data-aos attributes without race conditions.
    ═══════════════════════════════════════════════════════════════════ */
    function initImmediate() {
        initCursorGlow();
        initHeroParallax();
        initAmbientFloat();
        initAvatarPop();
        initNavScrolled();
        initNavPill();
    }

    function initAfterReady() {
        initSecLabelReveal();
        initNumberScramble();
        initServiceCardStagger();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initImmediate);
    } else {
        initImmediate();
    }

    /* extoReady fires on DOMContentLoaded via loader.js */
    document.addEventListener('extoReady', initAfterReady, { once: true });

})();
