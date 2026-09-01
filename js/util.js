/* =========================================================
   Young Heroes - small helpers shared by the games
   ========================================================= */
window.YH = window.YH || {};

YH.Util = (function () {

    function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

    function shuffle(a) {
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var t = a[i]; a[i] = a[j]; a[j] = t;
        }
        return a;
    }

    function pick(arr) { return arr[rnd(0, arr.length - 1)]; }

    /* n distinct numbers around `answer`, always including it */
    function numberChoices(answer, count, spread, allowNegative) {
        var set = [answer];
        var guard = 0;
        while (set.length < count && guard++ < 300) {
            var d = rnd(-spread, spread);
            if (d === 0) continue;
            var v = answer + d;
            if (!allowNegative && v < 0) continue;
            if (set.indexOf(v) === -1) set.push(v);
        }
        var n = 0;
        while (set.length < count) { n++; if (set.indexOf(answer + n) === -1) set.push(answer + n); }
        return shuffle(set).map(function (v) { return { html: String(v), value: v }; });
    }

    /* Draw `n` distinct words, the first one is the target */
    function wordSet(n, sameCat) {
        var all = YH.WORDS;
        var target = pick(all);
        var pool = all.filter(function (w) {
            if (w.en === target.en) return false;
            return sameCat ? w.cat === target.cat : true;
        });
        if (pool.length < n - 1) pool = all.filter(function (w) { return w.en !== target.en; });
        shuffle(pool);
        return [target].concat(pool.slice(0, n - 1));
    }

    /* A row of emoji used as counting objects */
    function counters(emoji, n, cls) {
        var out = '<span class="counters ' + (cls || '') + '">';
        for (var i = 0; i < n; i++) {
            out += '<span class="counter" style="animation-delay:' + (i * 45) + 'ms">' + emoji + '</span>';
        }
        return out + '</span>';
    }

    function label(word) { return YH.lang === 'ar' ? word.ar : word.en; }
    function other(word) { return YH.lang === 'ar' ? word.en : word.ar; }

    /* Letters for the spelling game: the word's letters plus a few extras */
    function letterTiles(word, extras) {
        var letters = word.split('');
        var alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
        var guard = 0;
        while (letters.length < word.length + extras && guard++ < 100) {
            var c = pick(alphabet);
            letters.push(c);
        }
        return shuffle(letters);
    }

    function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

    return {
        rnd: rnd, shuffle: shuffle, pick: pick, numberChoices: numberChoices,
        wordSet: wordSet, counters: counters, label: label, other: other,
        letterTiles: letterTiles, capitalize: capitalize
    };
})();
