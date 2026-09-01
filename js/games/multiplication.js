/* Times Tower - multiplication shown as groups of objects */
window.YH = window.YH || {}; YH.Games = YH.Games || {};

YH.Games.multiplication = {
    id: 'multiplication',
    kind: 'math',
    rounds: 8,

    make: function (level) {
        var ai = YH.AI.take('multiplication');
        if (ai) return YH.MathAI.toQuestion(ai);
        return YH.Games.multiplication.local(level);
    },

    local: function (level) {
        var U = YH.Util;
        var maxA = [0, 3, 5, 6, 8, 10, 12][Math.min(level, 6)];
        var maxB = [0, 3, 4, 5, 6, 9, 12][Math.min(level, 6)];
        var a = U.rnd(1, maxA);
        var b = U.rnd(1, maxB);
        var answer = a * b;

        var theme = U.pick(YH.MATH_THEMES);
        var visual = '';
        if (a <= 5 && b <= 5) {
            visual = '<span class="groups">';
            for (var g = 0; g < a; g++) {
                visual += '<span class="group">' + U.counters(theme.img, b, 'tight') + '</span>';
            }
            visual += '</span>';
        }

        return {
            type: 'choice',
            prompt: '<span class="sum">' + a + ' <span class="op-sign">×</span> ' + b + ' = <b class="qmark">?</b></span>',
            visual: visual,
            subtitle: (YH.lang === 'ar')
                ? (a + ' مجموعات فيها ' + b + ' في كل مجموعة')
                : (a + ' groups of ' + b),
            choices: U.numberChoices(answer, 4, Math.max(2, Math.round(answer * 0.4))),
            answer: answer,
            hint: (YH.lang === 'ar')
                ? ('اجمع ' + b + ' مع نفسه ' + a + ' مرات.')
                : ('Add ' + b + ' to itself ' + a + ' times.')
        };
    }
};
