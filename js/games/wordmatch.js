/* Picture Words - see a picture, pick the word (or the reverse) */
window.YH = window.YH || {}; YH.Games = YH.Games || {};

YH.Games.wordmatch = {
    id: 'wordmatch',
    kind: 'word',
    rounds: 8,

    make: function (level) {
        var U = YH.Util;
        var set = YH.MathAI.wordSet(4, level >= 3);
        var target = set[0];
        var pictureFirst = Math.random() < 0.6;

        if (pictureFirst) {
            /* picture -> word */
            return {
                type: 'choice',
                ai: set.ai,
                prompt: '<span class="q-text">' + YH.UI.esc(YH.t('q.whatIsThis')) + '</span>',
                visual: '<div class="big-pic pulse">' + target.img + '</div>',
                choices: U.shuffle(set.slice()).map(function (w) {
                    return {
                        html: '<span class="word">' + U.capitalize(U.label(w)) + '</span>',
                        value: w.en,
                        arHelp: w.ar,
                        speak: { text: U.label(w), lang: YH.lang }
                    };
                }),
                answer: target.en,
                answerLabel: U.capitalize(U.label(target)),
                say: { text: U.label(target), lang: YH.lang },
                hint: (YH.lang === 'ar')
                    ? ('تبدأ الكلمة بحرف "' + U.label(target).charAt(0) + '"')
                    : ('The word starts with "' + U.label(target).charAt(0).toUpperCase() + '"')
            };
        }

        /* word -> picture */
        return {
            type: 'choice',
            ai: set.ai,
            layout: 'pictures',
            prompt: '<span class="q-text">' + YH.UI.esc(YH.t('q.whichPicture')) + '</span>',
            visual: '<div class="word-card">' + U.capitalize(U.label(target)) +
                (YH.lang === 'en' && YH.State.get().arabicHelp ? '<small dir="rtl">' + target.ar + '</small>' : '') + '</div>',
            choices: U.shuffle(set.slice()).map(function (w) {
                return { html: '<span class="pic">' + w.img + '</span>', value: w.en };
            }),
            answer: target.en,
            answerLabel: target.img,
            say: { text: U.label(target), lang: YH.lang },
            hint: (YH.lang === 'ar') ? 'استمع إلى الكلمة مرة أخرى.' : 'Tap the hint to hear the word again.'
        };
    }
};
