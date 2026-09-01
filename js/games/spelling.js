/* Spell It! - build the English word letter by letter */
window.YH = window.YH || {}; YH.Games = YH.Games || {};

YH.Games.spelling = {
    id: 'spelling',
    kind: 'spelling',
    rounds: 6,

    make: function (level) {
        var U = YH.Util;
        /* keep words short at low levels so the tiles stay tappable */
        var maxLen = [0, 4, 5, 6, 7, 9, 12][Math.min(level, 6)];
        var target = null;

        /* an AI word if one is waiting and it is short enough */
        var fromAI = false;
        var ai = YH.AI.take('words');
        if (ai && ai.en.length <= maxLen) { target = YH.MathAI.toWord(ai); fromAI = true; }

        if (!target) {
            var pool = YH.WORDS.filter(function (w) { return w.en.length <= maxLen; });
            if (pool.length < 4) pool = YH.WORDS;
            target = U.pick(pool);
        }
        var extras = Math.min(4, Math.max(1, level));

        return {
            type: 'letters',
            ai: fromAI,
            prompt: '<span class="q-text">' + YH.UI.esc(YH.t('q.buildWord')) + '</span>',
            visual: '<div class="big-pic">' + target.img + '</div>' +
                (YH.State.get().arabicHelp || YH.lang === 'ar'
                    ? '<div class="word-card small ar" dir="rtl">' + target.ar + '</div>' : ''),
            answerWord: target.en,
            answer: target.en,
            answerLabel: target.en,
            letters: U.letterTiles(target.en, extras),
            say: { text: target.en, lang: 'en' },
            hint: (YH.lang === 'ar')
                ? ('الكلمة فيها ' + target.en.length + ' حروف وتبدأ بـ "' + target.en.charAt(0) + '"')
                : ('It has ' + target.en.length + ' letters and starts with "' + target.en.charAt(0) + '"')
        };
    }
};
