
        (function() {
            const loader      = document.getElementById('dream-loader');
            const loaderPct   = document.getElementById('loaderPct');
            const siteContent = document.getElementById('site-content');
            const bar         = document.getElementById('page-progress');
            const fluidPath   = document.getElementById('fluidPath');
            /* eaWrap removed — pure SVG approach uses SVG user-space coords */

            /* Skip loader for returning visitors in the same session */
            if (new URLSearchParams(location.search).has('fresh')) sessionStorage.removeItem('extoLoaderShown');
            const skipLoader = !!sessionStorage.getItem('extoLoaderShown');
            if (skipLoader) {
                if (loader) loader.classList.add('loader-skip');
                if (siteContent) { siteContent.style.transition = 'none'; siteContent.classList.add('content-ready'); }
                /* Mark as return visit so entrance animations skip gracefully */
                document.documentElement.dataset.eaReturn = '1';
                document.addEventListener('DOMContentLoaded', () => {
                    document.dispatchEvent(new CustomEvent('extoReady'));
                    const aosOpts = { duration: 750, easing: 'ease-out-cubic', once: false, mirror: true, offset: 60, delay: 0 };
                    if (typeof AOS !== 'undefined') { AOS.init(aosOpts); }
                    else { window.addEventListener('load', () => { if (typeof AOS !== 'undefined') AOS.init(aosOpts); }, { once: true }); }
                });
                return;
            }
            sessionStorage.setItem('extoLoaderShown', '1');

            /* ---- Wave animation config ---- */
            const ANIM_MS    = 3000;  /* fill completes in exactly 3 seconds */
            const WAVE_PTS   = 30;    /* wave sample points */
            const MIN_SHOW   = 3150;  /* loader visible for at least this long */

            let animStart    = null;
            let rafId        = null;
            let animDone     = false;
            let canDismiss   = false;
            let hideStarted  = false;
            const loaderT0   = Date.now();

            /* SVG viewBox dimensions — must match viewBox="0 0 1000 512" in HTML */
            const SVG_W = 1000;
            const SVG_H = 512;

            /* Build a complex sinusoidal closed-path in SVG user space */
            function buildWavePath(progress, elapsed) {
                const t  = elapsed / 1000;
                const p  = progress / 100;

                /* Wave center Y: SVG_H at p=0 (bottom), 0 at p=1 (top) */
                const baseY = SVG_H * (1 - p);

                /* Amplitude: 0 at extremes, max at mid-progress, breathes over time */
                const amp = SVG_H * 0.20 * Math.sin(p * Math.PI) * (0.72 + 0.28 * Math.sin(t * 0.85));

                /* Sample 30 points across the wave */
                const pts = [];
                for (let i = 0; i <= WAVE_PTS; i++) {
                    const xn = i / WAVE_PTS;
                    const x  = xn * SVG_W;
                    const y  = baseY
                        + amp        * Math.sin(xn * Math.PI * 3.9  + t * 2.55)
                        + amp * 0.44 * Math.sin(xn * Math.PI * 7.4  - t * 1.82)
                        + amp * 0.21 * Math.cos(xn * Math.PI * 2.6  + t * 3.38)
                        + amp * 0.13 * Math.sin(xn * Math.PI * 11.2 + t * 4.15);
                    pts.push({ x, y });
                }

                /* Smooth cubic bezier (midpoint control-points) through sample points */
                let d = `M 0,${SVG_H} L ${pts[0].x},${pts[0].y}`;
                for (let i = 0; i < pts.length - 1; i++) {
                    const mx = (pts[i].x + pts[i + 1].x) / 2;
                    d += ` C ${mx},${pts[i].y} ${mx},${pts[i + 1].y} ${pts[i + 1].x},${pts[i + 1].y}`;
                }
                d += ` L ${SVG_W},${SVG_H} Z`;
                return d;
            }

            /* Per-frame update */
            function animFrame(ts) {
                if (!animStart) animStart = ts;
                const elapsed  = ts - animStart;
                const progress = Math.min(100, (elapsed / ANIM_MS) * 100);
                const rounded  = Math.round(progress);

                /* Percentage counter */
                if (loaderPct) loaderPct.textContent = `loading... ${rounded}%`;

                /* Top progress bar */
                if (bar) bar.style.width = progress + '%';

                /* Aria */
                if (loader) loader.setAttribute('aria-valuenow', rounded);

                /* Wave clip path — pure SVG user-space coords */
                if (fluidPath) {
                    if (progress < 100) {
                        fluidPath.setAttribute('d', buildWavePath(progress, elapsed));
                    } else {
                        /* Full solid cover: rectangle covering entire SVG */
                        fluidPath.setAttribute('d', `M 0,${SVG_H} L 0,-10 L ${SVG_W},-10 L ${SVG_W},${SVG_H} Z`);
                    }
                }

                if (progress < 100) {
                    rafId = requestAnimationFrame(animFrame);
                } else {
                    /* Wave fully covered — trigger loaderBox zoom-out exit */
                    const box = document.getElementById('loaderBox');
                    if (box) box.classList.add('ea-box-exit');
                    /* Give the zoom-out transition time to finish (~0.52s) then dismiss */
                    setTimeout(() => {
                        animDone = true;
                        if (canDismiss) doHide();
                    }, 490);
                }
            }

            /* Start the animation loop */
            requestAnimationFrame(() => requestAnimationFrame(animFrame));

            /* Reveal site content + fire extoReady so animations know to start */
            function revealContent() {
                if (!siteContent) return;
                requestAnimationFrame(() => requestAnimationFrame(() => {
                    siteContent.classList.add('content-ready');
                    /* Dispatch after one frame so opacity transition has begun */
                    setTimeout(() => document.dispatchEvent(new CustomEvent('extoReady')), 120);
                }));
            }

            function doHide() {
                if (hideStarted) return;
                hideStarted = true;
                cancelAnimationFrame(rafId);

                const elapsed = Date.now() - loaderT0;
                const delay   = Math.max(0, MIN_SHOW - elapsed);

                setTimeout(() => {
                    if (bar) { bar.style.transition = 'opacity .4s'; bar.style.opacity = '0'; }
                    if (loader && !loader.classList.contains('loader-skip')) {
                        loader.classList.add('loader-hidden');
                        /* Reveal content quickly after loader starts fading (was 300ms) */
                        setTimeout(revealContent, 100);
                        setTimeout(() => {
                            if (loader) loader.style.display = 'none';
                            const aosOpts = { duration: 750, easing: 'ease-out-cubic', once: false, mirror: true, offset: 60, delay: 0 };
                            if (typeof AOS !== 'undefined') {
                                AOS.init(aosOpts);
                            } else {
                                /* AOS not yet loaded - retry until it appears */
                                let tries = 0;
                                const poll = setInterval(() => {
                                    if (typeof AOS !== 'undefined') { clearInterval(poll); AOS.init(aosOpts); return; }
                                    if (++tries > 20) clearInterval(poll);
                                }, 150);
                            }
                        }, 750);
                    }
                }, delay);
            }

            function tryDismiss() {
                canDismiss = true;
                if (animDone) doHide();
                /* else doHide() fires from animFrame when animation completes */
            }

            document.addEventListener('DOMContentLoaded', () => setTimeout(tryDismiss, 180));
            window.addEventListener('load', tryDismiss);
            setTimeout(tryDismiss, 5000); /* safety net — reduced from 7s */
        })();

        document.addEventListener('DOMContentLoaded', () => {
            const SELECTOR = [
                'section:not(.no-reveal)',
                '.service-card',
                '.portfolio-item',
                '.blog-card',
                '.pricing-card',
                '.workflow-step',
                '.stat-card',
                '.team-card',
                '.faq-item',
                '.case-study-card',
                '.tool-card',
                '.testimonial-card',
                '[data-reveal]'
            ].join(', ');

            const targets = document.querySelectorAll(SELECTOR);
            const vh = window.innerHeight;

            const io = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    const el = entry.target;
                    if (entry.isIntersecting) {
                        const siblings = el.parentElement
                            ? Array.from(el.parentElement.children).filter(c => c.classList.contains('scroll-reveal'))
                            : [];
                        const sibIdx = siblings.indexOf(el);
                        const stagger = sibIdx > 0 ? sibIdx * 75 : 0;
                        el.style.transitionDelay = stagger + 'ms';
                        el.classList.remove('sr-exit');
                        el.classList.add('sr-visible');
                    } else {
                        if (el.classList.contains('sr-visible')) {
                            el.style.transitionDelay = '0ms';
                            const rect = el.getBoundingClientRect();
                            if (rect.bottom < 0) {
                                el.classList.add('sr-exit');
                            } else {
                                el.classList.remove('sr-visible');
                            }
                        }
                    }
                });
            }, { threshold: 0.07, rootMargin: '0px 0px -3% 0px' });

            /* Determine animation direction for each element */
            function assignDirection(el, idx) {
                const tag = el.tagName.toLowerCase();
                const isSection = tag === 'section';
                if (isSection) return; /* sections: default up (no extra class) */

                /* Use position relative to viewport width */
                const rect = el.getBoundingClientRect();
                const elCenterX = rect.left + rect.width / 2;
                const vw = window.innerWidth;

                /* Cards in a grid: alternate left/right by sibling index */
                const isCard = el.matches('.service-card,.blog-card,.portfolio-item,.pricing-card,.testimonial-card,.case-study-card,.tool-card,.stat-card,.workflow-step,.team-card,.faq-item');
                if (isCard) {
                    const allCards = el.parentElement ? Array.from(el.parentElement.children).filter(c => c.matches('.service-card,.blog-card,.portfolio-item,.pricing-card,.testimonial-card,.case-study-card,.tool-card,.stat-card,.workflow-step,.team-card,.faq-item')) : [];
                    const cardIdx = allCards.indexOf(el);
                    if (cardIdx % 3 === 0) el.classList.add('sr-left');
                    else if (cardIdx % 3 === 1) el.classList.add('sr-right');
                    else el.classList.add('sr-zoom');
                    return;
                }

                /* Everything else: position-based */
                if (elCenterX < vw * 0.38) {
                    el.classList.add('sr-left');
                } else if (elCenterX > vw * 0.62) {
                    el.classList.add('sr-right');
                } else {
                    /* near center: alternate zoom / default up */
                    if (idx % 2 === 0) el.classList.add('sr-zoom');
                    /* else: no direction class = default translateY up */
                }
            }

            targets.forEach((el, idx) => {
                const rect = el.getBoundingClientRect();
                if (rect.top < vh && rect.bottom > 0) {
                    return;
                }
                assignDirection(el, idx);
                el.classList.add('scroll-reveal');
                io.observe(el);
            });
        });

        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('.auto-type').forEach(el => {
                const words = el.getAttribute('data-words').split('|');
                let wordIdx = 0;
                let charIdx = 0;
                let isDeleting = false;
                let timer = null;

                function rand(min, max) { return min + Math.floor(Math.random() * (max - min + 1)); }

                function tick() {
                    const current = words[wordIdx];
                    if (isDeleting) {
                        charIdx--;
                    } else {
                        charIdx++;
                    }
                    el.textContent = current.slice(0, charIdx);

                    let delay;
                    if (!isDeleting && charIdx === current.length) {
                        isDeleting = true;
                        delay = 2200;
                    } else if (isDeleting && charIdx === 0) {
                        isDeleting = false;
                        wordIdx = (wordIdx + 1) % words.length;
                        delay = 380;
                    } else if (isDeleting) {
                        delay = rand(38, 58);
                    } else {
                        delay = rand(68, 112);
                    }

                    timer = setTimeout(tick, delay);
                }

                const preloaded = el.textContent.trim() || el.innerHTML.trim();
                if (preloaded === words[0]) {
                    charIdx = words[0].length;
                    isDeleting = true;
                    timer = setTimeout(tick, 2600);
                } else {
                    el.textContent = '';
                    charIdx = 0;
                    timer = setTimeout(tick, 950);
                }
            });
        });

        /* ---- GLOBAL COUNT-UP FOR .stat-number ---- */
        /* Waits for extoReady so counters only animate after the loader is gone */
        (function() {
            function initCountUp() {
                const statEls = document.querySelectorAll('.stat-number');
                if (!statEls.length) return;
                const run = (el) => {
                    if (el.dataset.counted) return;
                    el.dataset.counted = '1';
                    const raw = el.textContent.trim();
                    const m = raw.match(/[\d.]+/);
                    if (!m) return;
                    const numStr = m[0];
                    const target  = parseFloat(numStr);
                    const isFloat = numStr.includes('.');
                    const suffix  = raw.slice(raw.indexOf(numStr) + numStr.length);
                    const prefix  = raw.slice(0, raw.indexOf(numStr));
                    const dur = 2000;
                    let t0 = null;
                    el.classList.add('counting');
                    const step = (ts) => {
                        if (!t0) t0 = ts;
                        const pct   = Math.min((ts - t0) / dur, 1);
                        const eased = 1 - Math.pow(1 - pct, 3);
                        el.textContent = prefix + (isFloat ? (eased * target).toFixed(1) : Math.round(eased * target)) + suffix;
                        if (pct < 1) { requestAnimationFrame(step); }
                        else { el.textContent = raw; el.classList.remove('counting'); el.classList.add('done'); }
                    };
                    requestAnimationFrame(step);
                };
                const io = new IntersectionObserver((entries) => {
                    entries.forEach(e => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
                }, { threshold: 0.35, rootMargin: '0px 0px -5% 0px' });
                statEls.forEach(el => io.observe(el));
            }
            document.addEventListener('extoReady', initCountUp, { once: true });
        })();

        /* ---- GLOBAL CARD SHIMMER ON SCROLL-IN ---- */
        /* Waits for extoReady so shimmer only fires after content is visible */
        (function() {
            function initShimmer() {
                if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
                const SEL = [
                    '.service-card', '.price-card', '.story-card', '.process-card',
                    '.info-card', '.c-card', '.blog-card', '.tilt-card',
                    '.founder-card-inline', '.seo-card'
                ].join(', ');
                const cards = document.querySelectorAll(SEL);
                if (!cards.length) return;
                const io = new IntersectionObserver((entries) => {
                    entries.forEach(e => {
                        if (e.isIntersecting) {
                            io.unobserve(e.target);
                            e.target.classList.add('shimmer-active');
                            setTimeout(() => e.target.classList.remove('shimmer-active'), 2000);
                        }
                    });
                }, { threshold: 0.18, rootMargin: '0px 0px -5% 0px' });
                cards.forEach(c => io.observe(c));
            }
            document.addEventListener('extoReady', initShimmer, { once: true });
        })();

        /* ---- HERO + STAT ENTRANCE ANIMATIONS (fires once on extoReady) ---- */
        (function() {
            function initEntrances() {
                var isReturn = document.documentElement.dataset.eaReturn === '1';

                /* On return visits: reveal words instantly, no animation */
                if (isReturn) {
                    document.querySelectorAll('.ea-word').forEach(function(w) {
                        w.style.opacity = '1';
                        w.style.transform = 'none';
                    });
                    var la = document.querySelector('.ea-line-enter');
                    if (la) la.classList.add('ea-in');
                    return;
                }

                /* FIRST LOAD — full entrance sequence */

                /* 1. Hero title — word-by-word bounce */
                const words = document.querySelectorAll('.ea-word');
                words.forEach(function(w, i) {
                    w.style.animationDelay = (i * 95) + 'ms';
                    w.classList.add('ea-word-in');
                });

                /* 2. Line-accent (typewriter span) fades in after all words land */
                var lineAcc = document.querySelector('.ea-line-enter');
                if (lineAcc) {
                    setTimeout(function() {
                        lineAcc.classList.add('ea-in');
                    }, words.length * 95 + 90);
                }

                /* 3. Stat items — staggered card bounce
                   fill-mode:both in CSS keeps them at from-state (opacity:0) during delay */
                var stats = document.querySelectorAll('.stat-item');
                stats.forEach(function(el, i) {
                    el.style.animationDelay = (320 + i * 85) + 'ms';
                    el.classList.add('ea-card-bounce');
                });
            }
            document.addEventListener('extoReady', initEntrances, { once: true });
        })();

        // === VIDEO REEL ===
        (function() {
            var cards = document.querySelectorAll('.reel-card');
            if (!cards.length) return;
            var active = null;
            function playCard(card) {
                if (active && active !== card) stopCard(active);
                var vid = card.querySelector('video');
                var src = card.dataset.src;
                if (!vid.src && src) vid.src = src;
                card.classList.add('playing');
                vid.play().catch(function(){});
                active = card;
            }
            function stopCard(card) {
                var vid = card.querySelector('video');
                vid.pause();
                card.classList.remove('playing');
                if (active === card) active = null;
            }
            cards.forEach(function(card) {
                var isMobile = window.matchMedia('(pointer:coarse)').matches;
                if (!isMobile) {
                    card.addEventListener('mouseenter', function() { playCard(card); });
                    card.addEventListener('mouseleave', function() { stopCard(card); });
                } else {
                    card.addEventListener('click', function() {
                        if (card.classList.contains('playing')) { stopCard(card); }
                        else { playCard(card); }
                    });
                }
            });
        })();
    

    (function(){
        try {
            if (!localStorage.getItem('ea_v1_seen')) {
                localStorage.setItem('ea_v1_seen','1');
                var b = document.getElementById('lagBubble');
                if (b) { b.style.display = 'flex'; setTimeout(function(){ if(b&&b.parentNode) b.remove(); }, 8000); }
            }
        } catch(e){}
    })();
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js').catch(function(){});
        });
    }

    /* ===== EDGE PARTICLE SYSTEM ===== */
    /* Deferred until extoReady - no CPU wasted during loader animation */
    (function(){
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        var c = document.getElementById('ea-particles');
        if (!c || !c.getContext) return;
        var ctx = c.getContext('2d');
        var W, H, pts = [], raf, started = false, EDGE = 0.16, N = 26;

        function resize() {
            W = c.width = innerWidth;
            H = c.height = innerHeight;
        }

        function edgePos() {
            var side = (Math.random() * 4) | 0;
            switch (side) {
                case 0: return { x: Math.random() * W, y: Math.random() * H * EDGE };
                case 1: return { x: Math.random() * W, y: H - Math.random() * H * EDGE };
                case 2: return { x: Math.random() * W * EDGE, y: Math.random() * H };
                default: return { x: W - Math.random() * W * EDGE, y: Math.random() * H };
            }
        }

        var COLORS = ['34,211,238', '167,139,250', '255,255,255', '99,102,241'];

        function mkPt() {
            var p = edgePos();
            return {
                x: p.x, y: p.y,
                vx: (Math.random() - 0.5) * 0.32,
                vy: (Math.random() - 0.5) * 0.32,
                r: 0.8 + Math.random() * 1.1,
                a: 0.08 + Math.random() * 0.2,
                col: COLORS[(Math.random() * COLORS.length) | 0]
            };
        }

        function isNearEdge(p) {
            return p.x < W * EDGE || p.x > W * (1 - EDGE) || p.y < H * EDGE || p.y > H * (1 - EDGE);
        }

        function init() {
            pts = [];
            for (var i = 0; i < N; i++) pts.push(mkPt());
        }

        function frame() {
            ctx.clearRect(0, 0, W, H);
            for (var i = 0; i < pts.length; i++) {
                var p = pts[i];
                p.x += p.vx;
                p.y += p.vy;
                if (!isNearEdge(p) || p.x < 0 || p.x > W || p.y < 0 || p.y > H) {
                    var np = edgePos();
                    p.x = np.x; p.y = np.y;
                    p.vx = (Math.random() - 0.5) * 0.32;
                    p.vy = (Math.random() - 0.5) * 0.32;
                }
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(' + p.col + ',' + p.a + ')';
                ctx.fill();
                for (var j = i + 1; j < pts.length; j++) {
                    var q = pts[j];
                    var dx = p.x - q.x, dy = p.y - q.y;
                    var d = Math.sqrt(dx * dx + dy * dy);
                    if (d < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = 'rgba(255,255,255,' + (0.028 * (1 - d / 120)) + ')';
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.stroke();
                    }
                }
            }
            raf = requestAnimationFrame(frame);
        }

        function startParticles() {
            if (started) return;
            started = true;
            resize();
            init();
            frame();
            window.addEventListener('resize', function() { resize(); init(); }, { passive: true });
            document.addEventListener('visibilitychange', function() {
                if (document.hidden) cancelAnimationFrame(raf);
                else if (started) frame();
            });
        }

        document.addEventListener('extoReady', startParticles, { once: true });
    })();
    