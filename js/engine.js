/* =========================================================
   Young Heroes - game engine
   Every game just supplies questions; the engine handles the
   round flow, scoring, streaks, sounds, effects and results.
   ========================================================= */
window.YH = window.YH || {};
YH.Games = YH.Games || {};

YH.Engine = (function () {
    var cfg = null, q = null;
    var round = 0, total = 8, correctCount = 0, streak = 0, attempts = 0, locked = false;
    var earnedCoins = 0, earnedXp = 0;
    var built = '';
    var runId = 0;          /* bumped on every start(); stale timers check it */

    var U = null;

    function T(k, v) { return YH.t(k, v); }

    function shuffle(a) {
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var t = a[i]; a[i] = a[j]; a[j] = t;
        }
        return a;
    }

    function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

    function start(gameId) {
        U = YH.UI;
        runId++;
        cfg = YH.Games[gameId];
        if (!cfg) { location.hash = '#/map'; return; }
        round = 0; correctCount = 0; streak = 0; locked = false;
        earnedCoins = 0; earnedXp = 0;
        total = cfg.rounds || 8;
        renderShell();
        nextQuestion();
    }

    function meta() {
        return YH.GAMES.filter(function (g) { return g.id === cfg.id; })[0] || { emoji: '🎮', color: '#4c6ef5' };
    }

    function renderShell() {
        var m = meta();
        var screen = document.getElementById('screen');
        screen.innerHTML =
            '<div class="game-wrap" style="--game:' + m.color + '">' +
            '  <div class="game-head">' +
            '    <button class="pill-btn ghost" id="gBack">‹ ' + U.esc(T('ui.map')) + '</button>' +
            '    <div class="game-title"><span class="gt-emoji">' + m.emoji + '</span>' +
            '      <span>' + U.esc(T('game.' + cfg.id)) + '</span></div>' +
            '    <div class="streak-box" id="streakBox"><span class="fire">🔥</span><b id="streakN">0</b></div>' +
            '  </div>' +
            '  <div class="progress-track"><div class="progress-fill" id="progFill"></div>' +
            '    <span class="progress-label" id="progLabel"></span></div>' +
            '  <div class="card game-card" id="qCard"></div>' +
            '  <div class="game-foot">' +
            '    <button class="pill-btn" id="gHint">💡 ' + U.esc(T('ui.hint')) + '</button>' +
            '  </div>' +
            '</div>';
        document.getElementById('gBack').addEventListener('click', function () {
            YH.Audio.play('whoosh'); location.hash = '#/map';
        });
        document.getElementById('gHint').addEventListener('click', showHint);
        U.wireClickSounds(screen);
        updateProgress();
    }

    function updateProgress() {
        var pct = (round / total) * 100;
        var f = document.getElementById('progFill');
        if (f) f.style.width = pct + '%';
        var l = document.getElementById('progLabel');
        if (l) l.textContent = T('q.round') + ' ' + Math.min(round + 1, total) + ' ' + T('q.of') + ' ' + total;
        var s = document.getElementById('streakN');
        if (s) s.textContent = streak;
        var box = document.getElementById('streakBox');
        if (box) box.classList.toggle('hot', streak >= 3);
    }

    function nextQuestion() {
        var myRun = runId;
        if (round >= total) { finish(); return; }

        var card = document.getElementById('qCard');
        if (!card) return;              /* player left the game - stop quietly */

        attempts = 0; locked = false; built = '';
        updateProgress();
        card.classList.add('loading');

        Promise.resolve(cfg.make(YH.State.difficulty(cfg.id), { rnd: rnd, shuffle: shuffle }))
            .then(function (spec) {
                if (myRun !== runId) return;                    /* another game started */
                var live = document.getElementById('qCard');
                if (!live) return;                              /* player navigated away */
                q = spec;
                live.classList.remove('loading');
                renderQuestion();
            })
            .catch(function (e) {
                /* a broken question must never freeze the round */
                if (myRun !== runId) return;
                console.warn('Question generation failed, skipping:', e);
                round++;
                setTimeout(nextQuestion, 300);
            });
    }

    function arabicHint(text) {
        var p = YH.State.get();
        if (!p.arabicHelp || YH.lang === 'ar' || !text) return '';
        return '<span class="ar-help" dir="rtl">' + U.esc(text) + '</span>';
    }

    function renderQuestion() {
        var card = document.getElementById('qCard');
        var html = (q.ai ? '<div class="ai-badge" title="Written by OpenAI">✨ AI</div>' : '') +
            '<div class="q-prompt">' + q.prompt + '</div>';
        if (q.promptAr) html += '<div class="q-prompt-ar" dir="rtl">' + U.esc(q.promptAr) + '</div>';
        if (q.visual) html += '<div class="q-visual">' + q.visual + '</div>';
        if (q.subtitle) html += '<div class="q-sub">' + q.subtitle + '</div>';

        if (q.type === 'letters') {
            html += '<div class="build-slot" id="buildSlot"></div>';
            html += '<div class="letters" id="letters"></div>';
            html += '<div class="letter-tools">' +
                '<button class="pill-btn" id="btnClear">⌫ ' + U.esc(T('ui.clear')) + '</button></div>';
        } else if (q.type === 'input') {
            html += '<div class="input-row">' +
                '<input type="number" inputmode="numeric" id="numInput" class="num-input" placeholder="?">' +
                '<button class="btn btn-primary" id="btnCheck">' + U.esc(T('ui.check')) + '</button></div>';
        } else {
            html += '<div class="options ' + (q.layout || 'grid') + '" id="options"></div>';
        }
        html += '<div class="feedback" id="feedback"></div>';
        card.innerHTML = html;
        card.classList.remove('fx-shake');
        YH.FX.pop(card);

        if (q.type === 'letters') buildLetters();
        else if (q.type === 'input') buildInput();
        else buildChoices();

        /* wired here rather than with an inline onclick, so the site can run
           under a strict Content-Security-Policy */
        U.$$('[data-replay]', card).forEach(function (b) {
            b.addEventListener('click', replay);
        });

        if (q.say) YH.Audio.speak(q.say.text, q.say.lang);
        if (q.sayNumber !== undefined) YH.Audio.sayNumber(q.sayNumber);

        U.wireClickSounds(card);
    }

    /* ---------- choice questions ---------- */
    function buildChoices() {
        var box = document.getElementById('options');
        q.choices.forEach(function (c) {
            var b = U.el('button', 'opt' + (q.layout === 'pictures' ? ' opt-pic' : ''));
            b.setAttribute('data-val', String(c.value));
            b.innerHTML = '<span class="opt-main">' + c.html + '</span>' +
                (c.sub ? '<span class="opt-sub">' + U.esc(c.sub) + '</span>' : '') +
                (c.arHelp ? arabicHint(c.arHelp) : '');
            b.addEventListener('click', function () {
                if (locked) return;
                if (c.speak) YH.Audio.speak(c.speak.text, c.speak.lang);
                judge(c.value === q.answer, b, c);
            });
            box.appendChild(b);
        });
    }

    /* ---------- number input questions ---------- */
    function buildInput() {
        var input = document.getElementById('numInput');
        var btn = document.getElementById('btnCheck');
        function submit() {
            if (locked) return;
            var v = parseInt(input.value, 10);
            if (isNaN(v)) { YH.FX.shake(input); return; }
            var ok = (v === q.answer);
            if (!ok && q.compare) {
                /* higher / lower style hint, does not burn an attempt hard */
                YH.Audio.play('wrong');
                YH.FX.shake(document.getElementById('qCard'));
                var msg = v < q.answer ? T('q.higher') : T('q.lower');
                if (Math.abs(v - q.answer) <= 1) msg = T('q.veryClose') + ' ' + msg;
                setFeedback(msg, 'warn');
                attempts++;
                input.value = ''; input.focus();
                if (attempts >= 4) reveal();
                return;
            }
            judge(ok, btn, null, input);
        }
        btn.addEventListener('click', submit);
        input.addEventListener('keyup', function (e) { if (e.key === 'Enter') submit(); });
        setTimeout(function () { try { input.focus(); } catch (e) { } }, 150);
    }

    /* ---------- letter building (spelling) ---------- */
    function buildLetters() {
        var slot = document.getElementById('buildSlot');
        var box = document.getElementById('letters');

        function paint() {
            slot.innerHTML = '';
            for (var i = 0; i < q.answerWord.length; i++) {
                var s = U.el('span', 'slot' + (built[i] ? ' filled' : ''), built[i] || '');
                slot.appendChild(s);
            }
        }
        paint();

        q.letters.forEach(function (ch) {
            var b = U.el('button', 'letter', ch);
            b.addEventListener('click', function () {
                if (locked || built.length >= q.answerWord.length) return;
                built += ch;
                b.classList.add('used');
                b.disabled = true;
                YH.Audio.play('pop');
                paint();
                if (built.length === q.answerWord.length) {
                    setTimeout(function () {
                        judge(built.toLowerCase() === q.answerWord.toLowerCase(), slot);
                    }, 220);
                }
            });
            box.appendChild(b);
        });

        document.getElementById('btnClear').addEventListener('click', function () {
            if (locked) return;
            built = '';
            YH.UI.$$('.letter', box).forEach(function (l) { l.classList.remove('used'); l.disabled = false; });
            paint();
        });
    }

    function setFeedback(text, kind) {
        var f = document.getElementById('feedback');
        if (!f) return;
        f.className = 'feedback show ' + (kind || '');
        f.setAttribute('dir', 'auto');
        f.textContent = text;
    }

    /* ---------- judging ---------- */
    var PRAISE_EN = ['Awesome!', 'Superb!', 'You got it!', 'Brilliant!', 'Hero move!', 'Yes!'];
    var PRAISE_AR = ['رائع!', 'ممتاز!', 'أحسنت!', 'عمل بطولي!', 'نعم!', 'مذهل!'];

    function judge(ok, sourceEl, choice, inputEl) {
        if (locked) return;
        attempts++;
        if (ok) {
            locked = true;
            streak++;
            var firstTry = (attempts === 1);
            if (firstTry) correctCount++;

            var coins = firstTry ? (2 + Math.min(3, Math.floor(streak / 3))) : 1;
            var xp = firstTry ? 10 : 4;

            YH.Audio.play('correct');
            if (streak >= 3) YH.Audio.play('streak');
            YH.FX.burstFromEl(sourceEl, { count: 28, emoji: streak >= 5 ? '⭐' : null });
            YH.FX.floatFromEl(sourceEl, '+' + coins + ' 🪙', '#ffd43b');
            if (sourceEl) sourceEl.classList.add('right');

            earnedCoins += coins; earnedXp += xp;
            YH.State.addCoins(coins);
            var evts = YH.State.addXp(xp);
            YH.State.recordAnswer(cfg.kind, true, streak);
            YH.UI.refreshTopbar();

            var praise = (YH.lang === 'ar' ? PRAISE_AR : PRAISE_EN);
            setFeedback(praise[Math.floor(Math.random() * praise.length)], 'good');
            if (streak === 3 || streak === 5 || streak === 10) {
                YH.UI.mascotSay(T('rew.streak', { n: streak }), 'happy');
                YH.FX.confetti(50);
            }
            pendingEvents = pendingEvents.concat(evts);

            round++;
            updateProgress();
            var myRun = runId;
            setTimeout(function () { if (myRun === runId) nextQuestion(); }, 1000);
        } else {
            streak = 0;
            YH.State.recordAnswer(cfg.kind, false, streak);
            YH.Audio.play('wrong');
            YH.FX.shake(document.getElementById('qCard'));
            if (sourceEl && sourceEl.classList) sourceEl.classList.add('wrong');
            if (choice) { sourceEl.disabled = true; }
            setFeedback(T('q.wrong'), 'bad');
            updateProgress();
            if (attempts >= 2) reveal();
            else if (inputEl) { inputEl.value = ''; inputEl.focus(); }
        }
    }

    function reveal() {
        locked = true;
        var answerText = q.answerLabel !== undefined ? q.answerLabel : q.answer;
        setFeedback(T('q.answerWas') + ' ' + answerText, 'warn');
        var right = document.querySelector('#options .opt[data-val="' + String(q.answer).replace(/"/g, '') + '"]');
        if (right) right.classList.add('right');
        if (q.type === 'letters') {
            var slot = document.getElementById('buildSlot');
            if (slot) {
                slot.innerHTML = '';
                q.answerWord.split('').forEach(function (ch) {
                    slot.appendChild(YH.UI.el('span', 'slot filled hintfill', ch));
                });
            }
        }
        round++;
        var myRun = runId;
        setTimeout(function () { if (myRun === runId) nextQuestion(); }, 1800);
    }

    function showHint() {
        var msg = q && q.hint ? q.hint : (cfg.kind === 'math' ? T('m.hintMath') : T('m.hintWord'));
        YH.UI.mascotSay(msg);
        if (q && q.say) YH.Audio.speak(q.say.text, q.say.lang);
    }

    /* ---------- results ---------- */
    var pendingEvents = [];

    function finish() {
        /* only render results if the player is still on this game's screen */
        if (!document.getElementById('qCard') && !document.querySelector('.game-wrap')) return;
        var res = YH.State.finishRound(cfg.id, correctCount, total);
        var badges = YH.State.checkBadges();
        var bonus = res.stars * 5;
        if (bonus) YH.State.addCoins(bonus);
        YH.UI.refreshTopbar();

        var pct = correctCount / total;
        var msgKey = pct === 1 ? 'res.perfect' : (pct >= 0.7 ? 'res.great' : (pct >= 0.4 ? 'res.good' : 'res.keep'));

        if (res.stars >= 2) { YH.FX.confetti(140); YH.Audio.play('star'); }
        else YH.Audio.play('pop');

        var m = meta();
        document.getElementById('screen').innerHTML =
            '<div class="results card" style="--game:' + m.color + '">' +
            '  <div class="res-stars">' + YH.UI.starsHtml(res.stars) + '</div>' +
            '  <h2>' + YH.UI.esc(T('res.title')) + '</h2>' +
            '  <p class="res-msg">' + YH.UI.esc(T(msgKey)) + '</p>' +
            (res.isBest && correctCount > 0 ? '<p class="res-best">🏅 ' + YH.UI.esc(T('res.newBest')) + '</p>' : '') +
            '  <div class="res-rows">' +
            '    <div class="res-row"><span>' + YH.UI.esc(T('res.correctCount')) + '</span><b>' + correctCount + ' / ' + total + '</b></div>' +
            '    <div class="res-row"><span>' + YH.UI.esc(T('res.coinsEarned')) + '</span><b>🪙 ' + ((correctCount * 2) + bonus) + '</b></div>' +
            '    <div class="res-row"><span>' + YH.UI.esc(T('res.xpEarned')) + '</span><b>⚡ ' + (correctCount * 10) + '</b></div>' +
            '  </div>' +
            '  <div class="res-actions">' +
            '    <button class="btn btn-primary big" id="resAgain">🔁 ' + YH.UI.esc(T('ui.playAgain')) + '</button>' +
            '    <button class="btn btn-ghost big" id="resMap">🗺️ ' + YH.UI.esc(T('ui.map')) + '</button>' +
            '  </div>' +
            '</div>';

        document.getElementById('resAgain').addEventListener('click', function () { start(cfg.id); });
        document.getElementById('resMap').addEventListener('click', function () { location.hash = '#/map'; });
        YH.UI.wireClickSounds(document.getElementById('screen'));

        var evts = pendingEvents; pendingEvents = [];
        YH.UI.celebrate(evts, badges);
    }

    function replay() {
        YH.Audio.unlock();
        if (q && q.say) YH.Audio.speak(q.say.text, q.say.lang);
        else if (q && q.sayNumber !== undefined) YH.Audio.sayNumber(q.sayNumber);
    }

    return { start: start, rnd: rnd, shuffle: shuffle, replay: replay };
})();
