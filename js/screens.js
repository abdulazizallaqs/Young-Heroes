/* =========================================================
   Young Heroes - screens (welcome, map, shop, trophies, info)
   ========================================================= */
window.YH = window.YH || {};

YH.Screens = (function () {
    var U;
    function screen() { return document.getElementById('screen'); }
    function T(k, v) { return YH.t(k, v); }

    /* ---------------- WELCOME / HERO CREATOR ---------------- */
    function welcome() {
        U = YH.UI;
        YH.UI.hideTopbar();
        YH.UI.mascotHide();

        var existing = YH.State.exists() ? YH.State.get() : null;
        var chosen = { avatar: existing ? existing.avatar : YH.AVATARS[0], colorId: existing ? existing.colorId : 'blue' };

        var html =
            '<div class="welcome">' +
            '  <div class="logo-wrap">' +
            '    <div class="logo-badge">🦸</div>' +
            '    <h1 class="logo">' + U.esc(T('app.name')) + '</h1>' +
            '    <p class="tagline">' + U.esc(T('app.tagline')) + '</p>' +
            '  </div>' +

            (existing ? '<div class="card continue-card">' +
                '  <div class="cont-hero">' + YH.UI.heroHtml(58) + '</div>' +
                '  <div class="cont-info"><small>' + U.esc(T('welcome.returning')) + '</small>' +
                '     <b>' + U.esc(existing.name || 'Hero') + '</b>' +
                '     <span>' + U.esc(T('ui.level')) + ' ' + existing.level + ' • 🪙 ' + existing.coins + '</span></div>' +
                '  <button class="btn btn-primary" id="btnContinue">' + U.esc(T('ui.play')) + ' ▸</button>' +
                '</div>' : '') +

            '  <div class="card create-card">' +
            '    <h3>' + U.esc(existing ? T('welcome.newHero') : T('welcome.hi')) + '</h3>' +
            '    <p class="muted">' + U.esc(T('welcome.sub')) + '</p>' +

            '    <label class="field-label">' + U.esc(T('welcome.name')) + '</label>' +
            '    <input id="heroName" class="text-input" maxlength="14" placeholder="' + U.esc(T('welcome.namePlaceholder')) + '">' +

            '    <label class="field-label">' + U.esc(T('welcome.chooseAvatar')) + '</label>' +
            '    <div class="avatar-grid" id="avatarGrid"></div>' +

            '    <label class="field-label">' + U.esc(T('welcome.chooseColor')) + '</label>' +
            '    <div class="color-row" id="colorRow"></div>' +

            '    <button class="btn btn-primary big block" id="btnStart">🚀 ' + U.esc(T('welcome.start')) + '</button>' +
            '    <p class="tiny muted">🔒 ' + U.esc(T('gu.sub')) + '</p>' +
            '  </div>' +

            '  <button class="link-btn" id="btnLangWelcome">🌍 ' + (YH.lang === 'ar' ? 'English' : 'العربية') + '</button>' +
            '</div>';

        screen().innerHTML = html;

        var grid = document.getElementById('avatarGrid');
        YH.AVATARS.forEach(function (a) {
            var b = U.el('button', 'avatar-opt' + (a === chosen.avatar ? ' sel' : ''), a);
            b.addEventListener('click', function () {
                chosen.avatar = a;
                U.$$('.avatar-opt', grid).forEach(function (x) { x.classList.remove('sel'); });
                b.classList.add('sel');
                YH.FX.pop(b);
                YH.Audio.play('pop');
            });
            grid.appendChild(b);
        });

        var row = document.getElementById('colorRow');
        YH.HERO_COLORS.forEach(function (c) {
            var b = U.el('button', 'color-opt' + (c.id === chosen.colorId ? ' sel' : ''));
            b.style.background = 'linear-gradient(135deg,' + c.c1 + ',' + c.c2 + ')';
            b.addEventListener('click', function () {
                chosen.colorId = c.id;
                U.$$('.color-opt', row).forEach(function (x) { x.classList.remove('sel'); });
                b.classList.add('sel');
                YH.Audio.play('pop');
            });
            row.appendChild(b);
        });

        document.getElementById('btnStart').addEventListener('click', function () {
            var name = document.getElementById('heroName').value.trim();
            YH.State.create({ name: name || (YH.lang === 'ar' ? 'بطل' : 'Hero'), avatar: chosen.avatar, colorId: chosen.colorId });
            var p = YH.State.get();
            p.lang = YH.lang; YH.State.save();
            YH.Audio.play('levelup');
            YH.FX.confetti(110);
            setTimeout(function () { location.hash = '#/map'; }, 350);
        });

        if (existing) {
            document.getElementById('btnContinue').addEventListener('click', function () {
                YH.Audio.play('whoosh');
                location.hash = '#/map';
            });
        }

        document.getElementById('btnLangWelcome').addEventListener('click', function () {
            YH.App.toggleLang();
        });

        U.wireClickSounds(screen());
    }

    /* ---------------- WORLD MAP ---------------- */
    function map() {
        U = YH.UI;
        var p = YH.State.get();
        YH.UI.refreshTopbar();

        function gameCard(g) {
            var stars = p.stars[g.id] || 0;
            var best = p.best[g.id];
            return '<button class="game-tile" data-game="' + g.id + '" style="--tile:' + g.color + '">' +
                '  <span class="tile-emoji">' + g.emoji + '</span>' +
                '  <span class="tile-body">' +
                '    <b>' + U.esc(T('game.' + g.id)) + '</b>' +
                '    <small>' + U.esc(T('game.' + g.id + '.desc')) + '</small>' +
                '    <span class="tile-stars">' + U.starsHtml(stars) +
                (best !== undefined ? '<i class="tile-best">' + U.esc(T('ui.best')) + ' ' + best + '</i>' : '') +
                '</span>' +
                '  </span>' +
                '  <span class="tile-go">▸</span>' +
                '</button>';
        }

        var numbers = YH.GAMES.filter(function (g) { return g.land === 'numbers'; }).map(gameCard).join('');
        var words = YH.GAMES.filter(function (g) { return g.land === 'words'; }).map(gameCard).join('');

        screen().innerHTML =
            '<div class="map">' +
            '  <div class="hero-banner card">' +
            '    <div class="hb-hero">' + YH.UI.heroHtml(72) + '</div>' +
            '    <div class="hb-text">' +
            '      <b>' + U.esc(p.name || 'Hero') + '</b>' +
            '      <span>' + U.esc(T('ui.level')) + ' ' + p.level + ' • 🪙 ' + p.coins + ' • 🏆 ' + p.badges.length + '</span>' +
            '    </div>' +
            '    <div class="hb-actions">' +
            '      <button class="round-btn" id="goShop" title="' + U.esc(T('map.shop')) + '">🛍️</button>' +
            '      <button class="round-btn" id="goTrophy" title="' + U.esc(T('map.trophies')) + '">🏆</button>' +
            '      <button class="round-btn" id="goInfo" title="' + U.esc(T('map.grownups')) + '">⚙️</button>' +
            '    </div>' +
            '  </div>' +

            '  <h2 class="map-title">' + U.esc(T('map.title')) + '</h2>' +

            '  <section class="land land-numbers">' +
            '    <header><span class="land-emoji">🏔️</span><div><b>' + U.esc(T('map.numbers')) + '</b>' +
            '      <small>' + U.esc(T('map.numbersSub')) + '</small></div></header>' +
            '    <div class="tiles">' + numbers + '</div>' +
            '  </section>' +

            '  <section class="land land-words">' +
            '    <header><span class="land-emoji">🏝️</span><div><b>' + U.esc(T('map.words')) + '</b>' +
            '      <small>' + U.esc(T('map.wordsSub')) + '</small></div></header>' +
            '    <div class="tiles">' + words + '</div>' +
            '  </section>' +
            '</div>';

        U.$$('.game-tile', screen()).forEach(function (b) {
            b.addEventListener('click', function () {
                YH.Audio.play('whoosh');
                location.hash = '#/play/' + b.getAttribute('data-game');
            });
        });
        document.getElementById('goShop').addEventListener('click', function () { location.hash = '#/shop'; });
        document.getElementById('goTrophy').addEventListener('click', function () { location.hash = '#/trophies'; });
        document.getElementById('goInfo').addEventListener('click', function () { location.hash = '#/info'; });

        U.wireClickSounds(screen());
        YH.UI.mascotSay(T('m.welcome'));
    }

    /* ---------------- SHOP ---------------- */
    function shop() {
        U = YH.UI;
        var p = YH.State.get();
        YH.UI.refreshTopbar();

        function itemCard(it) {
            var owned = YH.State.owns(it.id);
            var worn = p[it.type] === it.id;
            var label = !owned ? ('🪙 ' + it.price)
                : (worn ? T('shop.remove') : T('shop.wear'));
            return '<button class="shop-item' + (owned ? ' owned' : '') + (worn ? ' worn' : '') + '" data-id="' + it.id + '">' +
                '<span class="si-emoji">' + it.emoji + '</span>' +
                '<span class="si-label">' + U.esc(label) + '</span>' +
                (worn ? '<span class="si-tag">' + U.esc(T('shop.worn')) + '</span>' : '') +
                '</button>';
        }

        var hats = YH.SHOP.filter(function (i) { return i.type === 'hat'; }).map(itemCard).join('');
        var pets = YH.SHOP.filter(function (i) { return i.type === 'pet'; }).map(itemCard).join('');

        screen().innerHTML =
            '<div class="sub-screen">' +
            '  <button class="pill-btn ghost" id="backMap">‹ ' + U.esc(T('ui.map')) + '</button>' +
            '  <div class="card preview-card">' + YH.UI.heroHtml(96) +
            '    <div class="preview-coins">🪙 <b>' + p.coins + '</b></div></div>' +
            '  <h2>🛍️ ' + U.esc(T('shop.title')) + '</h2>' +
            '  <p class="muted center">' + U.esc(T('shop.sub')) + '</p>' +
            '  <h3 class="shop-h">' + U.esc(T('shop.hats')) + '</h3>' +
            '  <div class="shop-grid">' + hats + '</div>' +
            '  <h3 class="shop-h">' + U.esc(T('shop.pets')) + '</h3>' +
            '  <div class="shop-grid">' + pets + '</div>' +
            '</div>';

        U.$$('.shop-item', screen()).forEach(function (b) {
            b.addEventListener('click', function () {
                var it = YH.State.shopItem(b.getAttribute('data-id'));
                if (!it) return;
                if (YH.State.owns(it.id)) {
                    YH.State.equip(it);
                    YH.Audio.play('pop');
                } else {
                    var r = YH.State.buy(it);
                    if (r === 'poor') {
                        YH.Audio.play('fail');
                        YH.FX.shake(b);
                        YH.UI.toast(T('shop.noCoins'), '🪙', 'warn');
                        return;
                    }
                    YH.Audio.play('badge');
                    YH.FX.burstFromEl(b, { emoji: it.emoji, count: 16 });
                    YH.UI.toast(T('shop.bought'), it.emoji, 'good');
                }
                shop();
            });
        });
        document.getElementById('backMap').addEventListener('click', function () { location.hash = '#/map'; });
        U.wireClickSounds(screen());
    }

    /* ---------------- TROPHY ROOM ---------------- */
    function trophies() {
        U = YH.UI;
        var p = YH.State.get();
        YH.UI.refreshTopbar();

        var cards = YH.BADGES.map(function (b) {
            var got = p.badges.indexOf(b.id) !== -1;
            return '<div class="badge-card' + (got ? ' got' : '') + '">' +
                '<span class="badge-emoji">' + (got ? b.emoji : '🔒') + '</span>' +
                '<b>' + U.esc(T('badge.' + b.id)) + '</b>' +
                (got ? '' : '<small>' + U.esc(T('trophy.locked')) + '</small>') +
                '</div>';
        }).join('');

        screen().innerHTML =
            '<div class="sub-screen">' +
            '  <button class="pill-btn ghost" id="backMap">‹ ' + U.esc(T('ui.map')) + '</button>' +
            '  <h2>🏆 ' + U.esc(T('trophy.title')) + '</h2>' +
            '  <p class="muted center">' + U.esc(T('trophy.sub')) + '</p>' +
            '  <div class="badge-grid">' + cards + '</div>' +
            '  <h3 class="shop-h">' + U.esc(T('trophy.stats')) + '</h3>' +
            '  <div class="card stat-list">' +
            '    <div class="res-row"><span>' + U.esc(T('trophy.totalCorrect')) + '</span><b>' + p.totalCorrect + '</b></div>' +
            '    <div class="res-row"><span>' + U.esc(T('trophy.bestStreak')) + '</span><b>🔥 ' + p.bestStreak + '</b></div>' +
            '    <div class="res-row"><span>' + U.esc(T('trophy.lifetimeCoins')) + '</span><b>🪙 ' + p.lifetimeCoins + '</b></div>' +
            '    <div class="res-row"><span>' + U.esc(T('trophy.gamesPlayed')) + '</span><b>' + p.roundsPlayed + '</b></div>' +
            '  </div>' +
            '</div>';

        document.getElementById('backMap').addEventListener('click', function () { location.hash = '#/map'; });
        U.wireClickSounds(screen());
    }

    /* ---------------- FOR GROWN-UPS ---------------- */
    function info() {
        U = YH.UI;
        var p = YH.State.get();
        YH.UI.refreshTopbar();

        screen().innerHTML =
            '<div class="sub-screen">' +
            '  <button class="pill-btn ghost" id="backMap">‹ ' + U.esc(T('ui.map')) + '</button>' +
            '  <h2>⚙️ ' + U.esc(T('gu.title')) + '</h2>' +
            '  <p class="muted center">' + U.esc(T('gu.sub')) + '</p>' +

            '  <div class="card ai-panel" id="aiPanel"></div>' +

            '  <div class="card setting-list">' +
            '    <label class="setting"><span><b>' + U.esc(T('gu.arabic')) + '</b>' +
            '      <small>' + U.esc(T('gu.arabicDesc')) + '</small></span>' +
            '      <input type="checkbox" id="setArabic" class="switch"' + (YH.lang === 'ar' ? ' checked' : '') + '></label>' +

            '    <label class="setting"><span><b>' + U.esc(T('gu.help')) + '</b>' +
            '      <small>' + U.esc(T('gu.helpDesc')) + '</small></span>' +
            '      <input type="checkbox" id="setHelp" class="switch"' + (p.arabicHelp ? ' checked' : '') + '></label>' +

            '    <label class="setting"><span><b>' + U.esc(T('ui.sound')) + '</b></span>' +
            '      <input type="checkbox" id="setSfx" class="switch"' + (p.sfx ? ' checked' : '') + '></label>' +

            '    <label class="setting"><span><b>' + U.esc(T('ui.music')) + '</b></span>' +
            '      <input type="checkbox" id="setMusic" class="switch"' + (p.music ? ' checked' : '') + '></label>' +
            '  </div>' +

            '  <button class="btn btn-danger block" id="btnReset">🗑️ ' + U.esc(T('gu.reset')) + '</button>' +
            '</div>';

        document.getElementById('backMap').addEventListener('click', function () { location.hash = '#/map'; });
        renderAiPanel();

        document.getElementById('setArabic').addEventListener('change', function () {
            YH.App.setLang(this.checked ? 'ar' : 'en');
            info();
        });
        document.getElementById('setHelp').addEventListener('change', function () {
            p.arabicHelp = this.checked; YH.State.save();
        });
        document.getElementById('setSfx').addEventListener('change', function () {
            p.sfx = this.checked; YH.State.save();
            YH.Audio.setSfx(p.sfx); YH.UI.refreshTopbar();
        });
        document.getElementById('setMusic').addEventListener('change', function () {
            p.music = this.checked; YH.State.save();
            YH.Audio.setMusic(p.music); YH.UI.refreshTopbar();
        });
        document.getElementById('btnReset').addEventListener('click', function () {
            var m = YH.UI.modal(
                '<div class="reward"><div class="reward-burst">🗑️</div>' +
                '<h2 class="reward-title">' + U.esc(T('gu.resetConfirm')) + '</h2>' +
                '<div class="res-actions">' +
                '<button class="btn btn-danger" id="doReset">' + U.esc(T('gu.yes')) + '</button>' +
                '<button class="btn btn-ghost" data-close>' + U.esc(T('gu.no')) + '</button></div></div>');
            m.el.querySelector('#doReset').addEventListener('click', function () {
                YH.State.reset();
                m.close();
                location.hash = '#/welcome';
                setTimeout(function () { location.reload(); }, 120);
            });
            YH.UI.wireClickSounds(m.el);
        });

        U.wireClickSounds(screen());
    }

    /* ---------------- AI status panel (inside settings) ---------------- */
    function renderAiPanel() {
        var host = document.getElementById('aiPanel');
        if (!host) return;

        function paint(st) {
            if (!document.getElementById('aiPanel')) return;
            var on = st.state === 'on';
            var dot = on ? 'on' : (st.state === 'unknown' ? 'wait' : 'off');
            var head = on ? T('ai.on') : (st.state === 'unknown' ? T('ai.checking') : T('ai.off'));

            host.innerHTML =
                '<div class="ai-head"><span class="ai-dot ' + dot + '"></span>' +
                '  <div><b>' + YH.UI.esc(T('ai.title')) + '</b>' +
                '    <small>' + YH.UI.esc(head) + (on && st.model ? ' · ' + YH.UI.esc(st.model) : '') + '</small></div>' +
                (on ? '<span class="ai-count">' + st.served + '</span>' : '') +
                '</div>' +
                '<p class="ai-note">' + YH.UI.esc(st.error || (on ? T('ai.okNote') : '')) + '</p>' +
                (on ? '' : '<div class="ai-steps">' +
                    '<b>' + YH.UI.esc(T('ai.howTitle')) + '</b>' +
                    '<ol><li>' + YH.UI.esc(T('ai.step1')) + '</li>' +
                    '<li><code>OPENAI_API_KEY=sk-...</code></li>' +
                    '<li><code>npm install</code></li>' +
                    '<li><code>npm start</code></li>' +
                    '<li>' + YH.UI.esc(T('ai.step5')) + ' <code>http://localhost:3000</code></li></ol>' +
                    '</div>') +
                '<button class="pill-btn" id="aiRetry">🔄 ' + YH.UI.esc(T('ai.retry')) + '</button>';

            var r = document.getElementById('aiRetry');
            if (r) r.addEventListener('click', function () {
                YH.Audio.play('click');
                host.classList.add('checking');
                YH.AI.retry().then(function (s2) { host.classList.remove('checking'); paint(s2); });
            });
        }

        paint(YH.AI.status());
        YH.AI.onChange(paint);
    }

    return { welcome: welcome, map: map, shop: shop, trophies: trophies, info: info };
})();
