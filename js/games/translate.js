/* Two Worlds - the English <-> Arabic matching game */
window.YH = window.YH || {}; YH.Games = YH.Games || {};

YH.Games.translate = {
    id: 'translate',
    kind: 'translate',
    rounds: 8,

    make: function (level) {
        var U = YH.Util;
        var set = YH.MathAI.wordSet(4, level >= 3);
        var target = set[0];
        var toArabic = Math.random() < 0.5;

        if (toArabic) {
            /* show English word + picture, choose the Arabic word */
            return {
                type: 'choice',
                ai: set.ai,
                prompt: '<span class="q-text">' + YH.UI.esc(YH.t('q.sayInArabic')) + '</span>',
                visual: '<div class="big-pic">' + target.img + '</div>' +
                    '<div class="word-card small">' + U.capitalize(target.en) + '</div>',
                choices: U.shuffle(set.slice()).map(function (w) {
                    return {
                        html: '<span class="word ar" dir="rtl">' + w.ar + '</span>',
                        value: w.en,
                        speak: { text: w.ar, lang: 'ar' }
                    };
                }),
                answer: target.en,
                answerLabel: target.ar,
                say: { text: target.en, lang: 'en' },
                hint: 'English: ' + target.en + '  •  العربية: ' + target.ar
            };
        }

        /* show Arabic word + picture, choose the English word */
        return {
            type: 'choice',
            ai: set.ai,
            prompt: '<span class="q-text">' + YH.UI.esc(YH.t('q.sayInEnglish')) + '</span>',
            visual: '<div class="big-pic">' + target.img + '</div>' +
                '<div class="word-card small ar" dir="rtl">' + target.ar + '</div>',
            choices: U.shuffle(set.slice()).map(function (w) {
                return {
                    html: '<span class="word">' + U.capitalize(w.en) + '</span>',
                    value: w.en,
                    speak: { text: w.en, lang: 'en' }
                };
            }),
            answer: target.en,
            answerLabel: U.capitalize(target.en),
            say: { text: target.ar, lang: 'ar' },
            hint: 'العربية: ' + target.ar + '  •  English: ' + target.en
        };
    }
};
