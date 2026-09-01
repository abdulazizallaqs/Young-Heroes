/* Adding Peaks - addition with picture counters at low levels */
window.YH = window.YH || {}; YH.Games = YH.Games || {};

YH.Games.addition = {
    id: 'addition',
    kind: 'math',
    rounds: 8,

    make: function (level) {
        /* An AI question if one is already waiting, otherwise ours.
           take() returns instantly - a round never waits on the network. */
        var ai = YH.AI.take('addition');
        if (ai) return YH.MathAI.toQuestion(ai);
        return YH.Games.addition.local(level);
    },

    local: function (level) {
        var U = YH.Util;
        var max = [0, 5, 9, 12, 20, 50, 99][Math.min(level, 6)];
        var a = U.rnd(1, max);
        var b = U.rnd(1, Math.max(1, Math.min(max, level <= 2 ? 5 : max)));
        var answer = a + b;

        var theme = U.pick(YH.MATH_THEMES);
        var visual = '';
        if (a + b <= 12) {
            visual = U.counters(theme.img, a) + '<span class="op">+</span>' + U.counters(theme.img, b);
        }

        return {
            type: 'choice',
            prompt: '<span class="sum">' + a + ' <span class="op-sign">+</span> ' + b + ' = <b class="qmark">?</b></span>',
            visual: visual,
            subtitle: YH.t('q.tapAnswer'),
            choices: U.numberChoices(answer, 4, Math.max(2, Math.round(answer * 0.35))),
            answer: answer,
            hint: (YH.lang === 'ar')
                ? ('ابدأ من ' + a + ' ثم عُدّ ' + b + ' خطوات للأمام.')
                : ('Start at ' + a + ' and count on ' + b + ' more.')
        };
    }
};
