/* Magic Ears - hear a word, tap the matching picture */
window.YH = window.YH || {}; YH.Games = YH.Games || {};

YH.Games.listening = {
    id: 'listening',
    kind: 'listening',
    rounds: 6,

    make: function (level) {
        var U = YH.Util;
        var set = YH.MathAI.wordSet(4, level >= 4);
        var target = set[0];

        /* In Arabic mode (or half the time when Arabic help is on) speak Arabic */
        var speakLang = 'en';
        if (YH.lang === 'ar') speakLang = 'ar';
        else if (YH.State.get().arabicHelp && Math.random() < 0.35) speakLang = 'ar';
        if (speakLang === 'ar' && !YH.Audio.canSpeak('ar')) speakLang = 'en';

        var spoken = speakLang === 'ar' ? target.ar : target.en;
        var canHear = YH.Audio.canSpeak(speakLang);

        return {
            type: 'choice',
            ai: set.ai,
            layout: 'pictures',
            prompt: '<span class="q-text">🎧 ' + YH.UI.esc(YH.t('q.whichPicture')) + '</span>',
            visual: '<div class="listen-box">' +
                '<button class="listen-btn" data-replay>🔊</button>' +
                '<div class="listen-hint">' + YH.UI.esc(YH.t('ui.listen')) + '</div>' +
                (canHear ? '' : '<div class="word-card small' + (speakLang === 'ar' ? ' ar' : '') + '"' +
                    (speakLang === 'ar' ? ' dir="rtl"' : '') + '>' + YH.UI.esc(spoken) + '</div>') +
                '</div>',
            choices: U.shuffle(set.slice()).map(function (w) {
                return { html: '<span class="pic">' + w.img + '</span>', value: w.en };
            }),
            answer: target.en,
            answerLabel: target.img + ' ' + (speakLang === 'ar' ? target.ar : target.en),
            say: { text: spoken, lang: speakLang },
            hint: (speakLang === 'ar' ? 'الكلمة: ' + target.ar : 'The word is "' + target.en + '"')
        };
    }
};
