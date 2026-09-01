/* Number Hunt - counting, comparing, sequences and the classic guess game */
window.YH = window.YH || {}; YH.Games = YH.Games || {};

YH.Games.numbers = {
    id: 'numbers',
    kind: 'math',
    rounds: 8,

    make: function (level) {
        var ai = YH.AI.take('numbers');
        if (ai) return YH.MathAI.toQuestion(ai);
        var U = YH.Util;
        var kinds = ['count', 'compare', 'missing'];
        if (level >= 2) kinds.push('guess');
        if (level >= 3) kinds.push('compare', 'missing');
        var kind = U.pick(kinds);
        return YH.Games.numbers[kind](level, U);
    },

    /* How many do you see? */
    count: function (level, U) {
        var maxN = [0, 5, 7, 9, 12, 15, 20][Math.min(level, 6)];
        var n = U.rnd(1, maxN);
        var theme = U.pick(YH.MATH_THEMES);
        return {
            type: 'choice',
            prompt: '<span class="q-text">' + YH.UI.esc(YH.t('q.count')) + '</span>',
            visual: U.counters(theme.img, n),
            choices: U.numberChoices(n, 4, 3),
            answer: n,
            sayNumber: undefined,
            hint: (YH.lang === 'ar') ? 'عُدّ واحداً واحداً بإصبعك.' : 'Point at each one and count out loud.'
        };
    },

    /* Which number is bigger / smaller? */
    compare: function (level, U) {
        var max = [0, 9, 20, 50, 99, 500, 999][Math.min(level, 6)];
        var a = U.rnd(1, max), b = U.rnd(1, max);
        while (b === a) b = U.rnd(1, max);
        var wantBigger = Math.random() < 0.5;
        var answer = wantBigger ? Math.max(a, b) : Math.min(a, b);
        return {
            type: 'choice',
            layout: 'wide',
            prompt: '<span class="q-text">' + YH.UI.esc(YH.t(wantBigger ? 'q.bigger' : 'q.smaller')) + '</span>',
            choices: U.shuffle([a, b]).map(function (v) { return { html: '<b class="bignum">' + v + '</b>', value: v }; }),
            answer: answer,
            hint: (YH.lang === 'ar') ? 'انظر إلى عدد الخانات أولاً.' : 'Compare how many digits each number has first.'
        };
    },

    /* Which number is missing from the sequence? */
    missing: function (level, U) {
        var step = level <= 2 ? 1 : U.pick([1, 2, 2, 5, 10]);
        var start = U.rnd(1, Math.max(2, level * 8));
        var seq = [];
        for (var i = 0; i < 5; i++) seq.push(start + i * step);
        var hideIdx = U.rnd(1, 3);
        var answer = seq[hideIdx];
        var shown = seq.map(function (v, i) {
            return '<span class="seq' + (i === hideIdx ? ' seq-hole' : '') + '">' + (i === hideIdx ? '?' : v) + '</span>';
        }).join('<span class="seq-dash">–</span>');

        return {
            type: 'choice',
            prompt: '<span class="q-text">' + YH.UI.esc(YH.t('q.missing')) + '</span>',
            visual: '<div class="sequence">' + shown + '</div>',
            choices: U.numberChoices(answer, 4, Math.max(1, step + 1)),
            answer: answer,
            hint: (YH.lang === 'ar') ? ('الأرقام تزيد بمقدار ' + step + ' في كل مرة.') : ('The numbers go up by ' + step + ' each time.')
        };
    },

    /* Guess my number, with higher / lower hints */
    guess: function (level, U) {
        var top = [0, 10, 20, 30, 50, 100, 200][Math.min(level, 6)];
        var answer = U.rnd(1, top);
        return {
            type: 'input',
            compare: true,
            prompt: '<span class="q-text">' + YH.UI.esc(YH.t('q.guessRange', { a: 1, b: top })) + '</span>',
            visual: '<div class="crystal">🔮</div>',
            subtitle: YH.t('q.typeAnswer'),
            answer: answer,
            hint: (YH.lang === 'ar') ? 'جرّب الرقم في المنتصف أولاً.' : 'Try the number in the middle first, then halve the range.'
        };
    }
};
