/* =========================================================
   Young Heroes - boot & router
   ========================================================= */
window.YH = window.YH || {};

YH.App = (function () {

    function route() {
        var hash = location.hash || '';
        var parts = hash.replace(/^#\/?/, '').split('/');
        var page = parts[0] || '';

        if (!YH.State.exists() && page !== 'welcome') { location.hash = '#/welcome'; return; }

        YH.FX.clear();
        window.scrollTo(0, 0);

        switch (page) {
            case 'welcome': YH.Screens.welcome(); break;
            case 'map': YH.Screens.map(); break;
            case 'shop': YH.Screens.shop(); break;
            case 'trophies': YH.Screens.trophies(); break;
            case 'info': YH.Screens.info(); break;
            case 'play':
                if (parts[1] && YH.Games[parts[1]]) { YH.Engine.start(parts[1]); }
                else location.hash = '#/map';
                break;
            default:
                location.hash = YH.State.exists() ? '#/map' : '#/welcome';
        }
        document.body.classList.toggle('in-game', page === 'play');
    }

    function setLang(lang) {
        YH.applyLang(lang);
        YH.AI.flush();
        if (YH.State.exists()) {
            var p = YH.State.get();
            p.lang = lang;
            YH.State.save();
        }
        route();
    }

    function toggleLang() {
        YH.Audio.play('pop');
        setLang(YH.lang === 'ar' ? 'en' : 'ar');
    }

    function bindChrome() {
        document.getElementById('btnHome').addEventListener('click', function () {
            YH.Audio.play('whoosh');
            location.hash = '#/map';
        });
        document.getElementById('btnLang').addEventListener('click', toggleLang);

        document.getElementById('btnSound').addEventListener('click', function () {
            var p = YH.State.get(); if (!p) return;
            p.sfx = !p.sfx; YH.State.save();
            YH.Audio.setSfx(p.sfx);
            if (p.sfx) YH.Audio.play('pop');
            YH.UI.refreshTopbar();
        });

        document.getElementById('btnMusic').addEventListener('click', function () {
            var p = YH.State.get(); if (!p) return;
            p.music = !p.music; YH.State.save();
            YH.Audio.setMusic(p.music);
            YH.UI.refreshTopbar();
        });

        document.getElementById('heroChip').addEventListener('click', function () {
            location.hash = '#/shop';
        });
        document.getElementById('coinChip').addEventListener('click', function () {
            location.hash = '#/shop';
        });

        /* first real interaction unlocks audio in every browser */
        ['pointerdown', 'keydown'].forEach(function (ev) {
            window.addEventListener(ev, function once() {
                YH.Audio.unlock();
                var p = YH.State.get();
                if (p && p.music) YH.Audio.setMusic(true);
                window.removeEventListener(ev, once);
            });
        });

        window.addEventListener('hashchange', route);
    }

    function init() {
        YH.FX.init();
        var p = YH.State.load();
        YH.applyLang(p ? p.lang : 'en');
        if (p) {
            YH.Audio.setSfx(p.sfx);
            YH.Audio.setMusic(false); /* waits for the first tap */
        }
        bindChrome();
        YH.AI.init();
        YH.UI.wireClickSounds(document);
        if (!location.hash) location.hash = p ? '#/map' : '#/welcome';
        else route();
    }

    return { init: init, route: route, setLang: setLang, toggleLang: toggleLang };
})();

document.addEventListener('DOMContentLoaded', YH.App.init);
