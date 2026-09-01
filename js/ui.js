/* =========================================================
   Young Heroes - shared UI helpers
   ========================================================= */
window.YH = window.YH || {};

YH.UI = (function () {

    function $(sel, root) { return (root || document).querySelector(sel); }
    function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

    function el(tag, cls, html) {
        var n = document.createElement(tag);
        if (cls) n.className = cls;
        if (html !== undefined) n.innerHTML = html;
        return n;
    }

    function esc(s) {
        return String(s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    /* ---------- hero avatar block (avatar + hat + pet) ---------- */
    function heroHtml(size) {
        var p = YH.State.get();
        var c = YH.State.color();
        var hat = p.hat ? YH.State.shopItem(p.hat) : null;
        var pet = p.pet ? YH.State.shopItem(p.pet) : null;
        return '<span class="hero-fig" style="--h1:' + c.c1 + ';--h2:' + c.c2 + ';font-size:' + (size || 64) + 'px">' +
            (hat ? '<span class="hero-hat">' + hat.emoji + '</span>' : '') +
            '<span class="hero-face">' + p.avatar + '</span>' +
            (pet ? '<span class="hero-pet">' + pet.emoji + '</span>' : '') +
            '</span>';
    }

    /* ---------- top bar ---------- */
    function refreshTopbar() {
        var p = YH.State.get();
        if (!p) return;
        var bar = document.getElementById('topbar');
        bar.classList.remove('hidden');

        var c = YH.State.color();
        bar.style.setProperty('--h1', c.c1);
        bar.style.setProperty('--h2', c.c2);

        var hat = p.hat ? YH.State.shopItem(p.hat) : null;
        document.getElementById('chipAvatar').innerHTML =
            (hat ? '<span class="chip-hat">' + hat.emoji + '</span>' : '') + p.avatar;
        document.getElementById('chipName').textContent = p.name || YH.t('welcome.hi');
        document.getElementById('chipLevel').textContent = YH.t('ui.level') + ' ' + p.level;

        var need = YH.State.xpNeeded(p.level);
        var pct = Math.max(0, Math.min(100, (p.xpInLevel / need) * 100));
        document.getElementById('xpFill').style.width = pct + '%';
        document.getElementById('xpText').innerHTML =
            '<bdi>' + p.xpInLevel + ' / ' + need + '</bdi> ' + esc(YH.t('ui.xp'));

        var coinEl = document.getElementById('coinCount');
        if (coinEl.textContent !== String(p.coins)) {
            coinEl.textContent = p.coins;
            YH.FX.pop(document.getElementById('coinChip'));
        }

        document.getElementById('btnSound').textContent = p.sfx ? '🔊' : '🔇';
        document.getElementById('btnSound').classList.toggle('off', !p.sfx);
        document.getElementById('btnMusic').textContent = p.music ? '🎵' : '🔕';
        document.getElementById('btnMusic').classList.toggle('off', !p.music);
    }

    function hideTopbar() { document.getElementById('topbar').classList.add('hidden'); }

    /* ---------- toast ---------- */
    function toast(msg, emoji, kind) {
        var layer = document.getElementById('toast-layer');
        var t = el('div', 'toast ' + (kind || ''),
            '<span class="toast-emoji">' + (emoji || '✨') + '</span><span>' + esc(msg) + '</span>');
        layer.appendChild(t);
        requestAnimationFrame(function () { t.classList.add('show'); });
        setTimeout(function () {
            t.classList.remove('show');
            setTimeout(function () { t.remove(); }, 400);
        }, 2600);
    }

    /* ---------- modal ---------- */
    function modal(html, opts) {
        opts = opts || {};
        var layer = document.getElementById('modal-layer');
        var wrap = el('div', 'modal-back');
        var box = el('div', 'modal-box ' + (opts.cls || ''), html);
        wrap.appendChild(box);
        layer.appendChild(wrap);
        requestAnimationFrame(function () { wrap.classList.add('show'); });

        function close() {
            wrap.classList.remove('show');
            setTimeout(function () { wrap.remove(); }, 300);
        }
        wrap.addEventListener('click', function (e) {
            if (e.target === wrap && !opts.sticky) close();
        });
        $$('[data-close]', box).forEach(function (b) {
            b.addEventListener('click', function () { YH.Audio.play('click'); close(); });
        });
        return { el: box, close: close };
    }

    /* ---------- mascot ---------- */
    var mascotTimer = null;
    function mascotSay(text, mood) {
        var m = document.getElementById('mascot');
        var bubble = document.getElementById('mascotBubble');
        var body = document.getElementById('mascotBody');
        m.classList.remove('hidden');
        bubble.textContent = text;
        bubble.classList.add('show');
        body.textContent = mood === 'sad' ? '🙁' : (mood === 'happy' ? '🦊' : '🦊');
        body.classList.remove('bounce'); void body.offsetWidth; body.classList.add('bounce');
        clearTimeout(mascotTimer);
        mascotTimer = setTimeout(function () { bubble.classList.remove('show'); }, 3600);
    }
    function mascotHide() { document.getElementById('mascot').classList.add('hidden'); }

    /* ---------- reward flow (level ups + badges) ---------- */
    function celebrate(events, badges) {
        var queue = [];
        (events || []).forEach(function (e) {
            if (e.type === 'level') queue.push({ kind: 'level', level: e.level });
        });
        (badges || []).forEach(function (b) { queue.push({ kind: 'badge', badge: b }); });
        if (!queue.length) return;

        function next() {
            var item = queue.shift();
            if (!item) return;
            if (item.kind === 'level') {
                YH.Audio.play('levelup');
                YH.FX.confetti(120);
                YH.FX.rain('⭐', 16);
                var m = modal(
                    '<div class="reward">' +
                    '<div class="reward-burst">🎉</div>' +
                    '<h2 class="reward-title">' + esc(YH.t('rew.levelUp')) + '</h2>' +
                    '<p class="reward-sub">' + esc(YH.t('rew.nowLevel', { n: item.level })) + '</p>' +
                    heroHtml(90) +
                    '<button class="btn btn-primary big" data-close>' + esc(YH.t('ui.next')) + '</button>' +
                    '</div>', { cls: 'reward-modal', sticky: true });
                m.el.querySelector('[data-close]').addEventListener('click', function () {
                    setTimeout(next, 320);
                });
            } else {
                YH.Audio.play('badge');
                YH.FX.rain(item.badge.emoji, 12);
                var b = item.badge;
                var m2 = modal(
                    '<div class="reward">' +
                    '<div class="reward-burst">' + b.emoji + '</div>' +
                    '<h2 class="reward-title">' + esc(YH.t('rew.badge')) + '</h2>' +
                    '<p class="reward-sub">' + esc(YH.t('badge.' + b.id)) + '</p>' +
                    '<button class="btn btn-primary big" data-close>' + esc(YH.t('ui.next')) + '</button>' +
                    '</div>', { cls: 'reward-modal', sticky: true });
                m2.el.querySelector('[data-close]').addEventListener('click', function () {
                    setTimeout(next, 320);
                });
            }
        }
        setTimeout(next, 420);
    }

    /* ---------- clicky buttons everywhere ---------- */
    function wireClickSounds(root) {
        $$('button, .clickable', root || document).forEach(function (b) {
            if (b.dataset.wired) return;
            b.dataset.wired = '1';
            b.addEventListener('pointerdown', function () {
                YH.Audio.unlock();
                if (!b.classList.contains('no-click-sound')) YH.Audio.play('click');
            });
        });
    }

    function starsHtml(n, total) {
        var out = '';
        for (var i = 0; i < (total || 3); i++) out += '<span class="star' + (i < n ? ' on' : '') + '">★</span>';
        return out;
    }

    return {
        $: $, $$: $$, el: el, esc: esc,
        heroHtml: heroHtml, refreshTopbar: refreshTopbar, hideTopbar: hideTopbar,
        toast: toast, modal: modal, mascotSay: mascotSay, mascotHide: mascotHide,
        celebrate: celebrate, wireClickSounds: wireClickSounds, starsHtml: starsHtml
    };
})();
