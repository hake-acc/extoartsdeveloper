/**
 * ExtoArts — Galaxy Button Particle System
 * Injects a live cosmic canvas into every .galaxy-btn element.
 * GPU contract: canvas draw only. No layout reads inside rAF.
 * Respects prefers-reduced-motion (static nebula, no animation).
 */
(function () {
    'use strict';

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var STAR_COUNT   = 64;
    var TWINKLE_BASE = 0.65;
    var DPR          = Math.min(window.devicePixelRatio || 1, 2);

    /* ─── colours ───────────────────────────────────────────────── */
    var STAR_COLORS = [
        [180, 230, 255],   /* sky-blue */
        [200, 240, 255],   /* ice-blue */
        [140, 200, 255],   /* ocean-blue */
        [100, 180, 255],   /* deep-sky */
    ];
    var NEBULAE = [
        { fx: 0.12, fy: 0.50, fr: 1.05, c: 'rgba(29,78,216,'   },
        { fx: 0.75, fy: 0.28, fr: 0.85, c: 'rgba(34,211,238,'  },
        { fx: 0.50, fy: 0.78, fr: 0.70, c: 'rgba(56,189,248,'  },
        { fx: 0.88, fy: 0.55, fr: 0.60, c: 'rgba(14,165,233,'  },
    ];

    /* ─── entry ──────────────────────────────────────────────────── */
    function boot() {
        document.querySelectorAll('.galaxy-btn').forEach(setup);
    }

    /* ─── per-button setup ───────────────────────────────────────── */
    function setup(btn) {
        var inner = btn.querySelector('.gb-inner');
        if (!inner || inner.querySelector('.gb-canvas')) return;

        /* Wrap existing child nodes in a label layer */
        var label = document.createElement('span');
        label.className = 'gb-label';
        while (inner.firstChild) { label.appendChild(inner.firstChild); }

        /* Canvas sits behind the label */
        var canvas = document.createElement('canvas');
        canvas.className  = 'gb-canvas';
        canvas.setAttribute('aria-hidden', 'true');
        inner.appendChild(canvas);
        inner.appendChild(label);

        var ctx = canvas.getContext('2d');

        /* Measure */
        var W = 0, H = 0;

        function resize() {
            W = inner.offsetWidth;
            H = inner.offsetHeight;
            canvas.width  = Math.round(W * DPR);
            canvas.height = Math.round(H * DPR);
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
            /* Reinit nebulae cache */
            buildNebulaeCache();
        }

        /* Cached nebula gradients (re-built on resize) */
        var nebulaCache = [];
        function buildNebulaeCache() {
            nebulaCache = NEBULAE.map(function (n) {
                var cx = n.fx * W, cy = n.fy * H, r = n.fr * H;
                var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
                g.addColorStop(0,   n.c + '0.07)');
                g.addColorStop(0.5, n.c + '0.03)');
                g.addColorStop(1,   'transparent');
                return g;
            });
        }

        /* Stars */
        var stars = [];
        function makeStars() {
            stars = [];
            for (var i = 0; i < STAR_COUNT; i++) {
                var col = STAR_COLORS[i % STAR_COLORS.length];
                stars.push({
                    x:  Math.random() * W,
                    y:  Math.random() * H,
                    r:  Math.random() * 1.3 + 0.18,
                    vx: (Math.random() - 0.5) * 0.22,
                    vy: (Math.random() - 0.5) * 0.22,
                    op: Math.random() * 0.55 + 0.25,
                    tw: Math.random() * Math.PI * 2,
                    ts: Math.random() * 0.045 + 0.012,
                    r2: col[0], g2: col[1], b2: col[2]
                });
            }
        }

        /* Hover state */
        var hovered  = false;
        var mouseX   = 0, mouseY = 0;
        var hoverGlowX = 0, hoverGlowY = 0;

        btn.addEventListener('mouseenter', function () { hovered = true; }, { passive: true });
        btn.addEventListener('mouseleave', function () { hovered = false; }, { passive: true });
        btn.addEventListener('mousemove', function (e) {
            var rc = inner.getBoundingClientRect();
            mouseX = e.clientX - rc.left;
            mouseY = e.clientY - rc.top;
        }, { passive: true });

        /* Click burst */
        var burstT = 0;
        var burstX = 0, burstY = 0;
        btn.addEventListener('click', function (e) {
            var rc = inner.getBoundingClientRect();
            burstX = e.clientX - rc.left;
            burstY = e.clientY - rc.top;
            burstT = 1;
        });

        /* ── animation loop ── */
        var raf;
        function tick() {
            ctx.clearRect(0, 0, W, H);

            /* Nebulae */
            nebulaCache.forEach(function (g) {
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, W, H);
            });

            if (!reduced) {
                /* Hover spotlight */
                if (hovered) {
                    hoverGlowX += (mouseX - hoverGlowX) * 0.12;
                    hoverGlowY += (mouseY - hoverGlowY) * 0.12;
                    var glow = ctx.createRadialGradient(
                        hoverGlowX, hoverGlowY, 0,
                        hoverGlowX, hoverGlowY, H * 0.9
                    );
                    glow.addColorStop(0,   'rgba(167,139,250,0.18)');
                    glow.addColorStop(0.45,'rgba(124,58,237,0.06)');
                    glow.addColorStop(1,   'transparent');
                    ctx.fillStyle = glow;
                    ctx.fillRect(0, 0, W, H);
                }

                /* Click burst pulse */
                if (burstT > 0) {
                    burstT -= 0.045;
                    var bRad = (1 - burstT) * H * 1.2;
                    var bAlpha = burstT * 0.35;
                    var bg = ctx.createRadialGradient(burstX, burstY, 0, burstX, burstY, bRad);
                    bg.addColorStop(0,   'rgba(192,132,252,' + bAlpha + ')');
                    bg.addColorStop(0.6, 'rgba(124,58,237,'  + (bAlpha * 0.4) + ')');
                    bg.addColorStop(1,   'transparent');
                    ctx.fillStyle = bg;
                    ctx.fillRect(0, 0, W, H);
                }

                /* Stars */
                var speed = hovered ? 3.2 : 1;
                for (var i = 0; i < stars.length; i++) {
                    var s = stars[i];
                    s.tw += s.ts;
                    s.x  += s.vx * speed;
                    s.y  += s.vy * speed;

                    /* wrap */
                    if (s.x < -3) s.x = W + 3;
                    if (s.x > W + 3) s.x = -3;
                    if (s.y < -3) s.y = H + 3;
                    if (s.y > H + 3) s.y = -3;

                    var alpha = s.op * (TWINKLE_BASE + (1 - TWINKLE_BASE) * Math.abs(Math.sin(s.tw)));

                    /* Glow halo for brighter stars */
                    if (s.r > 0.85) {
                        ctx.beginPath();
                        ctx.arc(s.x, s.y, s.r * 3.2, 0, 6.2832);
                        ctx.fillStyle = 'rgba(' + s.r2 + ',' + s.g2 + ',' + s.b2 + ',' + (alpha * 0.09) + ')';
                        ctx.fill();
                    }

                    ctx.beginPath();
                    ctx.arc(s.x, s.y, s.r, 0, 6.2832);
                    ctx.fillStyle = 'rgba(' + s.r2 + ',' + s.g2 + ',' + s.b2 + ',' + alpha + ')';
                    ctx.fill();
                }
            }

            raf = requestAnimationFrame(tick);
        }

        /* Start */
        resize();
        makeStars();
        tick();

        /* Resize observer */
        if (window.ResizeObserver) {
            var ro = new ResizeObserver(function () {
                resize();
                makeStars();
            });
            ro.observe(inner);
        }
    }

    /* ─── boot timing ────────────────────────────────────────────── */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

})();
