/* Take-Away Cave - subtraction, always with a positive answer */
window.YH = window.YH || {}; YH.Games = YH.Games || {};

YH.Games.subtraction = {
    id: 'subtraction',
    kind: 'math',
    rounds: 8,

    make: function (level) {
        var ai = YH.AI.take('subtraction');
        if (ai) return YH.MathAI.toQuestion(ai);
        return YH.Games.subtraction.local(level);
    },

    local: function (level) {
        var U = YH.Util;
        var max = [0, 6, 10, 15, 25, 60, 99][Math.min(level, 6)];
        var a = U.rnd(2, max);
        var b = U.rnd(1, a);
        var answer = a - b;

        var theme = U.pick(YH.MATH_THEMES);
        var visual = '';
        if (a <= 12) {
            var out = '<span class="counters">';
            for (var i = 0; i < a; i++) {
                out += '<span class="counter' + (i >= a - b ? ' gone' : '') + '" style="animation-delay:' +
                    (i * 45) + 'ms">' + theme.img + '</span>';
            }
            out += '</span>';
            visual = out;
        }

        return {
            type: 'choice',
            prompt: '<span class="sum">' + a + ' <span class="op-sign">−</span> ' + b + ' = <b class="qmark">?</b></span>',
            visual: visual,
            subtitle: YH.t('q.tapAnswer'),
            choices: U.numberChoices(answer, 4, Math.max(2, Math.round(a * 0.3))),
            answer: answer,
            hint: (YH.lang === 'ar')
                ? ('ابدأ من ' + a + ' ثم عُدّ ' + b + ' خطوات للخلف.')
                : ('Start at ' + a + ' and count back ' + b + '.')
        };
    }
};
