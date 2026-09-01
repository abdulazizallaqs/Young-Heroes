/* =========================================================
   Young Heroes - turns an AI item into a question the engine
   can render. Shared by all four maths games.
   ========================================================= */
window.YH = window.YH || {};

YH.MathAI = (function () {

    /* AI maths question -> engine question */
    function toQuestion(ai) {
        var U = YH.Util;
        var text = String(ai.question || '');
        var pure = /^[\s\d+\-×x*÷/=?]+$/.test(text);   /* "7 + 5 = ?" style */

        /* dir="auto" stops an English sentence rendering backwards while the
           app is in Arabic mode, and vice-versa. */
        var prompt = pure
            ? '<span class="sum">' + YH.UI.esc(text) + '</span>'
            : '<bdi class="q-text story" dir="auto">' + YH.UI.esc(text) + '</bdi>';

        var choices = U.shuffle(ai.choices.slice()).map(function (v) {
            return { html: String(v), value: v };
        });

        return {
            type: 'choice',
            ai: true,
            prompt: prompt,
            visual: ai.emoji ? '<div class="story-emoji">' + ai.emoji + '</div>' : '',
            subtitle: YH.t('q.tapAnswer'),
            choices: choices,
            answer: ai.answer,
            hint: ai.hint || YH.t('m.hintMath')
        };
    }

    /* AI word item -> the same shape as the built-in dictionary */
    function toWord(item) {
        return { en: item.en, ar: item.ar, img: item.img, cat: item.cat || 'ai' };
    }

    /* A set of n words: all AI, or all built-in. Never mixed, so the
       four choices in a round always feel like they belong together. */
    function wordSet(n, sameCat) {
        var ai = YH.AI.takeWords(n);
        if (ai) {
            var set = ai.map(toWord);
            /* guard against the model repeating a word inside one batch */
            var seen = {}, uniq = [];
            set.forEach(function (w) { if (!seen[w.en]) { seen[w.en] = 1; uniq.push(w); } });
            if (uniq.length === n) { uniq.ai = true; return uniq; }
        }
        var local = YH.Util.wordSet(n, sameCat);
        local.ai = false;
        return local;
    }

    return { toQuestion: toQuestion, toWord: toWord, wordSet: wordSet };
})();
