/* =========================================================
   Young Heroes - AI content layer
   Talks to the local server, which talks to OpenAI.
   Rules it follows, always:
     1. It NEVER blocks a round. If nothing is ready, the game
        uses its own generator and the AI keeps filling in the
        background for the next round.
     2. If there is no key, no server, or a bad response, it
        switches itself off quietly. Children see no errors.
   ========================================================= */
window.YH = window.YH || {};

YH.AI = (function () {

    var state = 'unknown';   /* unknown | on | off */
    var info = { model: null, error: null, served: 0 };
    var queues = {};         /* kind -> [items] */
    var loading = {};        /* kind -> bool */
    var LOW_WATER = 2;       /* refill when fewer than this remain */
    var BATCH = 6;
    var pausedUntil = 0;     /* set when the server says slow down */

    function offline(reason) {
        state = 'off';
        info.error = reason || info.error;
        notify();
    }

    var listeners = [];
    function onChange(fn) { listeners.push(fn); }
    function notify() { listeners.forEach(function (f) { try { f(status()); } catch (e) { } }); }

    function status() {
        return { state: state, model: info.model, error: info.error, served: info.served };
    }

    /* ---------- boot: ask the server once ---------- */
    function init() {
        if (location.protocol === 'file:' || !window.fetch) {
            offline('Opened as a file, so there is no server to ask. Run "npm start" to switch AI on.');
            return Promise.resolve(status());
        }
        return fetch('api/status', { cache: 'no-store' })
            .then(function (r) { return r.json(); })
            .then(function (d) {
                if (d && d.ok && d.ai) {
                    state = 'on';
                    info.model = d.model;
                    info.error = null;
                    notify();
                    warmUp();
                } else {
                    offline(d && d.lastError ? d.lastError :
                        'No OPENAI_API_KEY found in .env, so the built-in generator is used.');
                }
                return status();
            })
            .catch(function () {
                offline('The Young Heroes server is not running. Start it with "npm start".');
                return status();
            });
    }

    /* Fill the two most-used queues as soon as the map appears */
    function warmUp() {
        fill('words');
        fill('addition');
    }

    /* ---------- fetching ---------- */
    function fill(kind) {
        if (state !== 'on' || loading[kind]) return Promise.resolve();
        if (Date.now() < pausedUntil) return Promise.resolve();
        loading[kind] = true;

        var level = 1;
        try { level = YH.State.get() ? Math.min(6, Math.ceil(YH.State.get().level / 2)) : 1; } catch (e) { }

        return fetch('api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ kind: kind, level: level, lang: YH.lang, count: BATCH })
        })
            .then(function (r) { return r.json(); })
            .then(function (d) {
                loading[kind] = false;
                if (d && d.ok && d.items && d.items.length) {
                    queues[kind] = (queues[kind] || []).concat(d.items);
                    info.error = null;
                    notify();
                } else if (d) {
                    /* a limit is temporary - back off instead of hammering */
                    if (d.error === 'rate_limited' || d.error === 'daily_cap_reached') {
                        pausedUntil = Date.now() + 5 * 60 * 1000;
                        info.error = d.message || 'Taking a short break from AI content.';
                        notify();
                    } else if (d.error === 'no_api_key' || d.error === 'ai_failed' ||
                        d.error === 'origin_not_allowed' || d.error === 'ai_disabled_in_public') {
                        /* these will not fix themselves - stop asking */
                        offline(d.message || 'OpenAI could not be reached. Using the built-in generator.');
                    }
                }
            })
            .catch(function () {
                loading[kind] = false;
                offline('Lost contact with the server. Using the built-in generator.');
            });
    }

    /* ---------- the games call this ----------
       Returns an item immediately, or null. Never a promise,
       never a wait. Refilling happens in the background.      */
    function take(kind) {
        if (state !== 'on') return null;
        var q = queues[kind] || [];
        if (q.length <= LOW_WATER) fill(kind);
        if (!q.length) return null;
        info.served++;
        return q.shift();
    }

    /* Word games share one pool of AI-made vocabulary */
    function takeWords(n) {
        var out = [];
        for (var i = 0; i < n; i++) {
            var w = take('words');
            if (!w) break;
            out.push(w);
        }
        /* all-or-nothing: a half AI / half built-in set makes odd choices */
        if (out.length < n) {
            queues.words = out.concat(queues.words || []);
            info.served -= out.length;
            return null;
        }
        return out;
    }

    /* Language changed - queued content is in the wrong language now */
    function flush() {
        queues = {};
        if (state === 'on') warmUp();
    }

    function retry() {
        state = 'unknown';
        queues = {}; loading = {}; pausedUntil = 0;
        return init();
    }

    return {
        init: init, take: take, takeWords: takeWords, flush: flush,
        status: status, onChange: onChange, retry: retry,
        get on() { return state === 'on'; }
    };
})();
