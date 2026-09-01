/* =========================================================
   Young Heroes - sound engine
   All effects are synthesised with the Web Audio API so the
   app is noisy and fun even with zero downloaded assets.
   Optional mp3 files in assets/sounds are used when they load.
   ========================================================= */
window.YH = window.YH || {};

YH.Audio = (function () {
    var ctx = null, master = null, sfxBus = null, musicBus = null;
    var ready = false;
    var files = {};
    var sfxOn = true, musicOn = true;
    var musicTimer = null, musicStep = 0;

    var NOTE = { C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
        C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0, C6: 1046.5 };

    function init() {
        if (ctx) return;
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        try {
            ctx = new AC();
            master = ctx.createGain(); master.gain.value = 0.9; master.connect(ctx.destination);
            sfxBus = ctx.createGain(); sfxBus.gain.value = 0.75; sfxBus.connect(master);
            musicBus = ctx.createGain(); musicBus.gain.value = 0.13; musicBus.connect(master);
            ready = true;
        } catch (e) { ready = false; }
        loadFiles();
    }

    function loadFiles() {
        ['correct', 'wrong', '1', '2', '3', '4', '5'].forEach(function (n) {
            try {
                var a = new Audio('assets/sounds/' + n + '.mp3');
                a.preload = 'auto';
                a.addEventListener('canplaythrough', function () { files[n] = a; }, { once: true });
                a.load();
            } catch (e) { /* ignore */ }
        });
    }

    function unlock() {
        init();
        if (ctx && ctx.state === 'suspended') ctx.resume();
    }

    /* --- low level voice --- */
    function tone(opts) {
        if (!ready || !sfxOn) return;
        var t0 = ctx.currentTime + (opts.delay || 0);
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = opts.type || 'sine';
        osc.frequency.setValueAtTime(opts.freq, t0);
        if (opts.to) osc.frequency.exponentialRampToValueAtTime(Math.max(20, opts.to), t0 + (opts.dur || 0.2));
        var vol = (opts.vol === undefined ? 0.25 : opts.vol);
        gain.gain.setValueAtTime(0.0001, t0);
        gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + (opts.dur || 0.2));
        osc.connect(gain); gain.connect(opts.bus || sfxBus);
        osc.start(t0); osc.stop(t0 + (opts.dur || 0.2) + 0.05);
    }

    function noise(dur, vol, filterHz) {
        if (!ready || !sfxOn) return;
        var len = Math.floor(ctx.sampleRate * dur);
        var buf = ctx.createBuffer(1, len, ctx.sampleRate);
        var d = buf.getChannelData(0);
        for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
        var src = ctx.createBufferSource(); src.buffer = buf;
        var f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = filterHz || 2000;
        var g = ctx.createGain(); g.gain.value = vol || 0.2;
        src.connect(f); f.connect(g); g.connect(sfxBus);
        src.start();
    }

    function playFile(name, vol) {
        var a = files[name];
        if (!a || !sfxOn) return false;
        try {
            var c = a.cloneNode();
            c.volume = vol === undefined ? 0.6 : vol;
            var p = c.play();
            if (p && p.catch) p.catch(function () { });
            return true;
        } catch (e) { return false; }
    }

    /* --- named effects --- */
    var FX = {
        click: function () { tone({ freq: 660, to: 880, dur: 0.09, type: 'triangle', vol: 0.16 }); },
        pop: function () { tone({ freq: 420, to: 900, dur: 0.12, type: 'sine', vol: 0.22 }); },
        whoosh: function () { noise(0.35, 0.12, 1200); },
        correct: function () {
            if (!playFile('correct', 0.5)) {
                [NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C6].forEach(function (f, i) {
                    tone({ freq: f, dur: 0.22, type: 'triangle', vol: 0.22, delay: i * 0.075 });
                });
            }
        },
        wrong: function () {
            if (!playFile('wrong', 0.45)) {
                tone({ freq: 300, to: 150, dur: 0.3, type: 'sawtooth', vol: 0.16 });
            }
        },
        coin: function () {
            tone({ freq: NOTE.B4, dur: 0.07, type: 'square', vol: 0.15 });
            tone({ freq: NOTE.E5, dur: 0.22, type: 'square', vol: 0.15, delay: 0.07 });
        },
        star: function () {
            [NOTE.G4, NOTE.C5, NOTE.E5].forEach(function (f, i) {
                tone({ freq: f, dur: 0.3, type: 'sine', vol: 0.2, delay: i * 0.12 });
            });
        },
        levelup: function () {
            [NOTE.C5, NOTE.D5, NOTE.E5, NOTE.G5, NOTE.C6].forEach(function (f, i) {
                tone({ freq: f, dur: 0.35, type: 'triangle', vol: 0.24, delay: i * 0.1 });
            });
            noise(0.5, 0.08, 5000);
        },
        badge: function () {
            [NOTE.E5, NOTE.G5, NOTE.C6, NOTE.E5, NOTE.C6].forEach(function (f, i) {
                tone({ freq: f, dur: 0.3, type: 'sine', vol: 0.22, delay: i * 0.12 });
            });
        },
        streak: function () {
            tone({ freq: NOTE.E5, to: NOTE.C6, dur: 0.35, type: 'triangle', vol: 0.2 });
        },
        tick: function () { tone({ freq: 1200, dur: 0.04, type: 'square', vol: 0.08 }); },
        fail: function () { tone({ freq: 220, to: 110, dur: 0.5, type: 'triangle', vol: 0.18 }); }
    };

    function play(name) {
        init();
        if (!sfxOn) return;
        if (ctx && ctx.state === 'suspended') ctx.resume();
        if (FX[name]) FX[name]();
    }

    function sayNumber(n) {
        init();
        if (!sfxOn) return;
        if (!playFile(String(n), 0.7)) {
            var base = 300 + n * 40;
            tone({ freq: base, to: base * 1.5, dur: 0.25, type: 'triangle', vol: 0.2 });
        }
    }

    /* --- background music: a gentle looping arpeggio --- */
    var PATTERN = [
        NOTE.C4, NOTE.E4, NOTE.G4, NOTE.C5, NOTE.G4, NOTE.E4,
        NOTE.A4, NOTE.C5, NOTE.E5, NOTE.C5, NOTE.A4, NOTE.G4,
        NOTE.F4, NOTE.A4, NOTE.C5, NOTE.A4, NOTE.F4, NOTE.E4,
        NOTE.G4, NOTE.B4, NOTE.D5, NOTE.B4, NOTE.G4, NOTE.D4
    ];

    function musicNote() {
        if (!ready || !musicOn) return;
        var f = PATTERN[musicStep % PATTERN.length];
        var t0 = ctx.currentTime;
        var osc = ctx.createOscillator(); osc.type = 'triangle';
        osc.frequency.value = f;
        var g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(0.5, t0 + 0.03);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.55);
        osc.connect(g); g.connect(musicBus);
        osc.start(t0); osc.stop(t0 + 0.6);
        if (musicStep % 6 === 0) {
            var b = ctx.createOscillator(); b.type = 'sine';
            b.frequency.value = f / 4;
            var bg = ctx.createGain();
            bg.gain.setValueAtTime(0.0001, t0);
            bg.gain.exponentialRampToValueAtTime(0.6, t0 + 0.05);
            bg.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.2);
            b.connect(bg); bg.connect(musicBus);
            b.start(t0); b.stop(t0 + 1.3);
        }
        musicStep++;
    }

    function startMusic() {
        init();
        if (!ready || musicTimer) return;
        if (ctx.state === 'suspended') ctx.resume();
        musicTimer = setInterval(musicNote, 320);
    }
    function stopMusic() {
        if (musicTimer) { clearInterval(musicTimer); musicTimer = null; }
    }

    /* --- speech: pronounces words in English or Arabic --- */
    var voices = [];
    function refreshVoices() {
        if (!('speechSynthesis' in window)) return;
        voices = window.speechSynthesis.getVoices() || [];
    }
    if ('speechSynthesis' in window) {
        refreshVoices();
        window.speechSynthesis.onvoiceschanged = refreshVoices;
    }

    function pickVoice(langCode) {
        if (!voices.length) refreshVoices();
        var exact = voices.filter(function (v) { return v.lang && v.lang.toLowerCase().indexOf(langCode) === 0; });
        return exact[0] || null;
    }

    function speak(text, lang) {
        if (!('speechSynthesis' in window) || !sfxOn || !text) return false;
        try {
            window.speechSynthesis.cancel();
            var u = new SpeechSynthesisUtterance(text);
            var code = (lang === 'ar') ? 'ar' : 'en';
            var v = pickVoice(code);
            if (v) u.voice = v;
            u.lang = (lang === 'ar') ? 'ar-SA' : 'en-US';
            u.rate = 0.85; u.pitch = 1.15;
            window.speechSynthesis.speak(u);
            return !!v || code === 'en';
        } catch (e) { return false; }
    }

    function canSpeak(lang) {
        if (!('speechSynthesis' in window)) return false;
        return !!pickVoice(lang === 'ar' ? 'ar' : 'en');
    }

    return {
        init: init,
        unlock: unlock,
        play: play,
        sayNumber: sayNumber,
        speak: speak,
        canSpeak: canSpeak,
        startMusic: startMusic,
        stopMusic: stopMusic,
        setSfx: function (on) { sfxOn = !!on; },
        setMusic: function (on) {
            musicOn = !!on;
            if (musicOn) startMusic(); else stopMusic();
        },
        get sfxOn() { return sfxOn; },
        get musicOn() { return musicOn; }
    };
})();
