/* =========================================================
   Young Heroes - hero profile & progression
   Saved in localStorage only. No account, no login, no server.
   ========================================================= */
window.YH = window.YH || {};

YH.State = (function () {
    var KEY = 'younghero.profile.v1';
    var profile = null;

    function blank() {
        return {
            created: Date.now(),
            name: '',
            avatar: YH.AVATARS[0],
            colorId: 'blue',
            hat: null,
            pet: null,
            xp: 0,
            level: 1,
            xpInLevel: 0,
            coins: 0,
            lifetimeCoins: 0,
            totalCorrect: 0,
            totalAnswers: 0,
            bestStreak: 0,
            roundsPlayed: 0,
            badges: [],
            owned: [],
            stars: {},
            best: {},
            stats: {},
            lang: 'en',
            sfx: true,
            music: true,
            arabicHelp: true
        };
    }

    function load() {
        try {
            var raw = localStorage.getItem(KEY);
            profile = raw ? JSON.parse(raw) : null;
        } catch (e) { profile = null; }
        if (profile) {
            var d = blank();
            Object.keys(d).forEach(function (k) {
                if (profile[k] === undefined) profile[k] = d[k];
            });
        }
        return profile;
    }

    function save() {
        try { localStorage.setItem(KEY, JSON.stringify(profile)); } catch (e) { /* private mode */ }
    }

    function create(opts) {
        profile = blank();
        profile.name = (opts && opts.name) || '';
        profile.avatar = (opts && opts.avatar) || YH.AVATARS[0];
        profile.colorId = (opts && opts.colorId) || 'blue';
        profile.lang = YH.lang;
        save();
        return profile;
    }

    function reset() {
        try { localStorage.removeItem(KEY); } catch (e) { }
        profile = null;
    }

    function get() { return profile; }
    function exists() { return !!profile; }

    /* --- XP curve: each level needs a bit more than the last --- */
    function xpNeeded(level) { return 60 + (level - 1) * 40; }

    /* Returns array of events e.g. [{type:'level', level:4}] */
    function addXp(n) {
        var events = [];
        profile.xp += n;
        profile.xpInLevel += n;
        while (profile.xpInLevel >= xpNeeded(profile.level)) {
            profile.xpInLevel -= xpNeeded(profile.level);
            profile.level++;
            events.push({ type: 'level', level: profile.level });
        }
        save();
        return events;
    }

    function addCoins(n) {
        profile.coins += n;
        if (n > 0) profile.lifetimeCoins += n;
        save();
    }

    function recordAnswer(kind, correct, streak) {
        profile.totalAnswers++;
        if (correct) {
            profile.totalCorrect++;
            profile.stats[kind] = (profile.stats[kind] || 0) + 1;
        }
        if (streak !== undefined && streak > profile.bestStreak) profile.bestStreak = streak;
        save();
    }

    function finishRound(gameId, correct, total) {
        profile.roundsPlayed++;
        var stars = correct >= total ? 3 : (correct >= Math.ceil(total * 0.7) ? 2 : (correct >= Math.ceil(total * 0.4) ? 1 : 0));
        var isBest = false;
        if (!profile.stars[gameId] || stars > profile.stars[gameId]) profile.stars[gameId] = stars;
        if (!profile.best[gameId] || correct > profile.best[gameId]) { profile.best[gameId] = correct; isBest = true; }
        save();
        return { stars: stars, isBest: isBest };
    }

    /* Returns newly unlocked badge objects */
    function checkBadges() {
        var unlocked = [];
        YH.BADGES.forEach(function (b) {
            if (profile.badges.indexOf(b.id) === -1 && b.test(profile)) {
                profile.badges.push(b.id);
                unlocked.push(b);
            }
        });
        if (unlocked.length) save();
        return unlocked;
    }

    function owns(id) { return profile.owned.indexOf(id) !== -1; }

    function buy(item) {
        if (owns(item.id)) return 'owned';
        if (profile.coins < item.price) return 'poor';
        profile.coins -= item.price;
        profile.owned.push(item.id);
        equip(item);
        save();
        return 'ok';
    }

    function equip(item) {
        if (!owns(item.id)) return false;
        profile[item.type] = (profile[item.type] === item.id) ? null : item.id;
        save();
        return true;
    }

    function color() {
        var c = YH.HERO_COLORS.filter(function (x) { return x.id === profile.colorId; })[0];
        return c || YH.HERO_COLORS[0];
    }

    function shopItem(id) {
        return YH.SHOP.filter(function (s) { return s.id === id; })[0] || null;
    }

    /* Difficulty for a game scales with hero level, capped so it stays fun */
    function difficulty(gameId) {
        var base = Math.min(6, Math.ceil(profile.level / 2));
        var mastery = profile.stars[gameId] || 0;
        return Math.max(1, Math.min(6, base + (mastery >= 3 ? 1 : 0)));
    }

    return {
        load: load, save: save, create: create, reset: reset, get: get, exists: exists,
        xpNeeded: xpNeeded, addXp: addXp, addCoins: addCoins,
        recordAnswer: recordAnswer, finishRound: finishRound, checkBadges: checkBadges,
        owns: owns, buy: buy, equip: equip, color: color, shopItem: shopItem,
        difficulty: difficulty
    };
})();
