/* =========================================================
   Young Heroes - visual effects layer
   Confetti, sparkles, coin showers, floating score text,
   screen shake and the bubbling background.
   ========================================================= */
window.YH = window.YH || {};

YH.FX = (function () {
    var canvas, ctx, parts = [], raf = null, W = 0, H = 0;
    var COLORS = ['#ff6b6b', '#4c6ef5', '#ffd43b', '#37b24d', '#f06595', '#22b8cf', '#845ef7', '#ff922b'];
    var reduced = false;

    function init() {
        canvas = document.getElementById('fx-canvas');
        if (!canvas) return;
        ctx = canvas.getContext('2d');
        resize();
        window.addEventListener('resize', resize);
        try {
            reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        } catch (e) { reduced = false; }
        buildBubbles();
    }

    function resize() {
        if (!canvas) return;
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        W = window.innerWidth; H = window.innerHeight;
        canvas.width = W * dpr; canvas.height = H * dpr;
        canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function loop() {
        if (!ctx) return;
        ctx.clearRect(0, 0, W, H);
        for (var i = parts.length - 1; i >= 0; i--) {
            var p = parts[i];
            p.life -= 1;
            if (p.life <= 0) { parts.splice(i, 1); continue; }

            p.vy += p.gravity;
            p.vx *= p.drag; p.vy *= p.drag;
            p.x += p.vx; p.y += p.vy;
            p.rot += p.vr;

            var alpha = Math.min(1, p.life / p.fade);
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);

            if (p.text) {
                ctx.font = (p.size) + 'px "Baloo 2", system-ui, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                if (p.stroke) {
                    ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(0,0,0,.35)';
                    ctx.strokeText(p.text, 0, 0);
                }
                ctx.fillStyle = p.color;
                ctx.fillText(p.text, 0, 0);
            } else if (p.shape === 'circle') {
                ctx.fillStyle = p.color;
                ctx.beginPath(); ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2); ctx.fill();
            } else {
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
            }
            ctx.restore();
        }
        if (parts.length) raf = requestAnimationFrame(loop);
        else { raf = null; ctx.clearRect(0, 0, W, H); }
    }

    function kick() { if (!raf && ctx) raf = requestAnimationFrame(loop); }

    function push(p) {
        if (parts.length > 900) return;
        parts.push(p);
    }

    function base(x, y) {
        return {
            x: x, y: y, vx: 0, vy: 0, gravity: 0.25, drag: 0.99,
            rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3,
            size: 12, color: COLORS[(Math.random() * COLORS.length) | 0],
            life: 90, fade: 40, shape: 'rect'
        };
    }

    /* Big celebration from the top of the screen */
    function confetti(count) {
        if (!ctx || reduced) return;
        count = count || 90;
        for (var i = 0; i < count; i++) {
            var p = base(Math.random() * W, -20 - Math.random() * 120);
            p.vx = (Math.random() - 0.5) * 4;
            p.vy = 2 + Math.random() * 4;
            p.gravity = 0.12;
            p.size = 8 + Math.random() * 12;
            p.life = 140 + Math.random() * 90;
            p.fade = 60;
            p.shape = Math.random() < 0.35 ? 'circle' : 'rect';
            push(p);
        }
        kick();
    }

    /* Radial burst at a point (usually the answer button) */
    function burst(x, y, opts) {
        if (!ctx || reduced) return;
        opts = opts || {};
        var n = opts.count || 26;
        for (var i = 0; i < n; i++) {
            var a = (Math.PI * 2 * i) / n + Math.random() * 0.3;
            var sp = (opts.speed || 5) * (0.5 + Math.random());
            var p = base(x, y);
            p.vx = Math.cos(a) * sp;
            p.vy = Math.sin(a) * sp - 1.5;
            p.size = opts.size || (6 + Math.random() * 10);
            p.gravity = 0.18;
            p.life = 60 + Math.random() * 40;
            p.shape = Math.random() < 0.5 ? 'circle' : 'rect';
            if (opts.color) p.color = opts.color;
            if (opts.emoji) { p.text = opts.emoji; p.size = 18 + Math.random() * 14; }
            push(p);
        }
        kick();
    }

    /* Floating "+5" style text */
    function floatText(x, y, text, color) {
        if (!ctx) return;
        var p = base(x, y);
        p.text = text; p.stroke = true;
        p.color = color || '#ffd43b';
        p.size = 34; p.vy = -2.2; p.vx = (Math.random() - 0.5) * 0.6;
        p.gravity = 0.02; p.vr = 0; p.rot = 0;
        p.life = 80; p.fade = 55;
        push(p); kick();
    }

    /* Emoji rain (used for level ups and badges) */
    function rain(emoji, count) {
        if (!ctx || reduced) return;
        for (var i = 0; i < (count || 20); i++) {
            var p = base(Math.random() * W, -30 - Math.random() * 200);
            p.text = emoji;
            p.size = 22 + Math.random() * 22;
            p.vy = 1.5 + Math.random() * 3;
            p.gravity = 0.05;
            p.vr = (Math.random() - 0.5) * 0.12;
            p.life = 180; p.fade = 60;
            push(p);
        }
        kick();
    }

    function burstFromEl(el, opts) {
        if (!el) return;
        var r = el.getBoundingClientRect();
        burst(r.left + r.width / 2, r.top + r.height / 2, opts);
    }

    function floatFromEl(el, text, color) {
        if (!el) return;
        var r = el.getBoundingClientRect();
        floatText(r.left + r.width / 2, r.top + r.height / 2, text, color);
    }

    function shake(el) {
        if (!el || reduced) return;
        el.classList.remove('fx-shake');
        void el.offsetWidth;
        el.classList.add('fx-shake');
    }

    function pop(el) {
        if (!el) return;
        el.classList.remove('fx-pop');
        void el.offsetWidth;
        el.classList.add('fx-pop');
    }

    /* Decorative bubbles in the background */
    function buildBubbles() {
        var host = document.getElementById('bubbles');
        if (!host) return;
        var frag = document.createDocumentFragment();
        for (var i = 0; i < 14; i++) {
            var b = document.createElement('span');
            b.className = 'bubble';
            b.style.left = (Math.random() * 100) + '%';
            b.style.width = b.style.height = (14 + Math.random() * 46) + 'px';
            b.style.animationDuration = (12 + Math.random() * 18) + 's';
            b.style.animationDelay = (-Math.random() * 20) + 's';
            b.style.opacity = (0.15 + Math.random() * 0.3);
            frag.appendChild(b);
        }
        host.appendChild(frag);
    }

    function clear() { parts.length = 0; }

    return {
        init: init, confetti: confetti, burst: burst, burstFromEl: burstFromEl,
        floatText: floatText, floatFromEl: floatFromEl, rain: rain,
        shake: shake, pop: pop, clear: clear
    };
})();
