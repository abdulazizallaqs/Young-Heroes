/* =========================================================
   Young Heroes - shared AI content logic
   Used by BOTH the local Express server (server.js) and the
   Vercel serverless functions (api/*.js), so there is only one
   copy of the prompts, the validation and the abuse guards.
   ========================================================= */

export const MATH_KINDS = ["addition", "subtraction", "multiplication", "numbers"];

export function config(env = process.env) {
    const key = (env.OPENAI_API_KEY || "").trim();
    return {
        key,
        model: env.OPENAI_MODEL || "gpt-4o-mini",
        base: (env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, ""),
        /* On a public site the AI must be switched on deliberately - see README */
        publicAI: String(env.ENABLE_PUBLIC_AI || "").toLowerCase() === "true",
        allowedHosts: (env.ALLOWED_HOSTS || "")
            .split(",").map(s => s.trim().toLowerCase()).filter(Boolean),
        dailyCap: parseInt(env.AI_DAILY_CAP || "500", 10),
        perIp: parseInt(env.AI_RATE_PER_10MIN || "40", 10),
        on: key.length > 0
    };
}

/* ---------------------------------------------------------
   Abuse guards. On a public deployment the endpoint spends
   real money, so it is closed by default and opened knowingly.
--------------------------------------------------------- */
const hits = new Map();      /* ip -> [timestamps] */
let dayStamp = today();
let dayCount = 0;

function today() { return new Date().toISOString().slice(0, 10); }

export function guard(cfg, { ip, origin, isLocal }) {
    if (!cfg.on) return { ok: false, error: "no_api_key" };

    /* localhost is always allowed - that is the developer's own machine */
    if (!isLocal) {
        if (!cfg.publicAI) return { ok: false, error: "ai_disabled_in_public" };

        if (cfg.allowedHosts.length) {
            let host = "";
            try { host = origin ? new URL(origin).hostname.toLowerCase() : ""; } catch { host = ""; }
            const allowed = host && cfg.allowedHosts.some(
                h => host === h || host.endsWith("." + h));
            if (!allowed) return { ok: false, error: "origin_not_allowed" };
        }
    }

    if (today() !== dayStamp) { dayStamp = today(); dayCount = 0; }
    if (dayCount >= cfg.dailyCap) return { ok: false, error: "daily_cap_reached" };

    /* The per-visitor limit is for the public internet. On localhost it is the
       developer's own key on their own machine, so long play sessions and test
       runs must not be throttled. The daily cap still applies everywhere. */
    if (!isLocal) {
        const now = Date.now();
        const win = now - 10 * 60 * 1000;
        const list = (hits.get(ip) || []).filter(t => t > win);
        if (list.length >= cfg.perIp) return { ok: false, error: "rate_limited" };
        list.push(now);
        hits.set(ip, list);
        if (hits.size > 5000) hits.clear();      /* keep memory bounded */
    }

    dayCount++;
    return { ok: true };
}

export function usage() { return { day: dayStamp, calls: dayCount }; }

/* ---------------------------------------------------------
   Prompts
--------------------------------------------------------- */
export function systemPrompt(kind, level, lang, count) {
    const langName = lang === "ar" ? "Arabic" : "English";

    if (kind === "words") {
        return `You build picture-vocabulary cards for children aged 5-10 learning English and Arabic.
Produce ${count} DIFFERENT everyday words that a child can recognise from a single emoji.
Difficulty ${level} of 6: level 1 = 3-4 letter concrete nouns, level 6 = longer or more abstract words.
Reply with ONLY a JSON object, no markdown:
{"items":[{"en":"cat","ar":"قطة","emoji":"🐱","cat":"animals"}]}
Rules:
- "en" is lowercase English, letters a-z only, 3 to 10 letters, no spaces.
- "ar" is the Arabic translation in Arabic script.
- "emoji" is exactly ONE emoji that clearly pictures the word.
- "cat" is a short category id such as animals, food, colors, home, nature, school, body, family.
- No proper nouns, no words needing more than one emoji, nothing scary or unsafe for children.`;
    }

    const opName = {
        addition: "addition",
        subtraction: "subtraction (never a negative answer)",
        multiplication: "multiplication",
        numbers: "number sense (counting, comparing, or a missing number in a sequence)"
    }[kind];

    return `You write ${opName} questions for children aged 5-10.
Question text must be written in ${langName}.
Difficulty ${level} of 6: level 1 uses numbers under 10, level 6 may use numbers up to 100.
Produce ${count} DIFFERENT questions.
Reply with ONLY a JSON object, no markdown:
{"items":[{"question":"3 + 4 = ?","answer":7,"choices":[7,5,8,6],"hint":"Start at 3 and count on 4 more.","emoji":"🍎"}]}
Rules:
- "answer" is a whole number, never negative.
- "choices" holds exactly 4 whole numbers: the answer plus 3 different wrong ones, all >= 0.
- "question" is short and friendly; a small story is welcome ("Sara has 3 apples...").
- "hint" is one short sentence in ${langName} telling the child HOW to work it out, never the answer itself.
- "emoji" is one optional emoji matching the story, or "".`;
}

/* ---------------------------------------------------------
   The OpenAI call
--------------------------------------------------------- */
export async function callOpenAI(cfg, kind, level, lang, count) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 20000);

    let r;
    try {
        r = await fetch(`${cfg.base}/chat/completions`, {
            method: "POST",
            signal: ctrl.signal,
            headers: {
                Authorization: `Bearer ${cfg.key}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: cfg.model,
                temperature: 1,
                response_format: { type: "json_object" },
                messages: [
                    { role: "system", content: systemPrompt(kind, level, lang, count) },
                    { role: "user", content: `Generate ${count} items now. Vary them.` }
                ]
            })
        });
    } catch (e) {
        clearTimeout(timer);
        throw new Error(e.name === "AbortError" ? "OpenAI timed out" : `Cannot reach OpenAI (${e.message})`);
    }
    clearTimeout(timer);

    const body = await r.json().catch(() => null);

    if (!r.ok) {
        const msg = body?.error?.message || `HTTP ${r.status}`;
        if (r.status === 401) throw new Error("OpenAI rejected the API key (401). Check OPENAI_API_KEY.");
        if (r.status === 429) throw new Error("OpenAI rate limit or no credit (429): " + msg);
        if (r.status === 404) throw new Error(`Model "${cfg.model}" not available for this key (404).`);
        throw new Error(msg);
    }

    const parsed = parseJson(body?.choices?.[0]?.message?.content);
    const items = Array.isArray(parsed) ? parsed : (parsed?.items || parsed?.questions || parsed?.words);
    if (!Array.isArray(items)) throw new Error("Model did not return an items array");
    return items;
}

export function parseJson(text) {
    if (!text) return null;
    const clean = String(text).replace(/```json/gi, "").replace(/```/g, "").trim();
    try { return JSON.parse(clean); } catch { /* try harder */ }
    const m = clean.match(/[{[][\s\S]*[}\]]/);
    if (m) { try { return JSON.parse(m[0]); } catch { /* give up */ } }
    return null;
}

/* ---------------------------------------------------------
   Validation - a child never sees a broken question
--------------------------------------------------------- */
export function validMath(it) {
    if (!it || typeof it !== "object") return null;
    const q = String(it.question || "").trim();
    const a = Number(it.answer);
    if (!q || q.length > 160) return null;
    if (!Number.isInteger(a) || a < 0 || a > 10000) return null;

    let choices = (Array.isArray(it.choices) ? it.choices : []).map(Number)
        .filter(n => Number.isInteger(n) && n >= 0 && n <= 10000);
    choices = Array.from(new Set(choices));
    if (!choices.includes(a)) choices.unshift(a);

    let bump = 1;
    while (choices.length < 4 && bump < 40) {
        for (const c of [a + bump, a - bump]) {
            if (c >= 0 && !choices.includes(c) && choices.length < 4) choices.push(c);
        }
        bump++;
    }
    if (choices.length < 4) return null;

    return {
        question: q,
        answer: a,
        choices: choices.slice(0, 4),
        hint: String(it.hint || "").slice(0, 160),
        emoji: oneEmoji(it.emoji) || ""
    };
}

const ARABIC = /[؀-ۿ]/;

export function validWord(it) {
    if (!it || typeof it !== "object") return null;
    const en = String(it.en || "").trim().toLowerCase();
    const ar = String(it.ar || "").trim();
    const emoji = oneEmoji(it.emoji);
    if (!/^[a-z]{3,10}$/.test(en)) return null;
    if (!ar || !ARABIC.test(ar) || ar.length > 24) return null;
    if (!emoji) return null;
    return { en, ar, img: emoji, cat: String(it.cat || "ai").slice(0, 20) };
}

export function oneEmoji(v) {
    const s = String(v || "").trim();
    if (!s) return "";
    const first = Array.from(s).find(c => /\p{Extended_Pictographic}/u.test(c));
    if (!first) return "";
    const tail = s.slice(s.indexOf(first))
        .match(/^(\p{Extended_Pictographic}(‍\p{Extended_Pictographic}|[️\u{1F3FB}-\u{1F3FF}])*)/u);
    return tail ? tail[1] : first;
}

/* ---------------------------------------------------------
   One place that turns a request into validated items
--------------------------------------------------------- */
export function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }

export function readParams(body = {}) {
    return {
        kind: String(body.kind || body.type || "addition"),
        level: clamp(parseInt(body.level, 10) || 1, 1, 6),
        lang: body.lang === "ar" ? "ar" : "en",
        count: clamp(parseInt(body.count, 10) || 6, 1, 10)
    };
}

export async function generate(cfg, { kind, level, lang, count }) {
    if (kind !== "words" && !MATH_KINDS.includes(kind)) return { ok: false, error: "bad_kind" };
    try {
        const raw = await callOpenAI(cfg, kind, level, lang, count + 4);
        const items = (kind === "words" ? raw.map(validWord) : raw.map(validMath)).filter(Boolean);
        if (!items.length) return { ok: false, error: "empty_result", message: "The model returned nothing usable." };
        return { ok: true, items: items.slice(0, count) };
    } catch (err) {
        return { ok: false, error: "ai_failed", message: err.message };
    }
}

export const ERROR_TEXT = {
    no_api_key: "No OPENAI_API_KEY is set, so the built-in generator is used.",
    ai_disabled_in_public: "AI is switched off for this site (ENABLE_PUBLIC_AI is not true). The built-in generator is used.",
    origin_not_allowed: "This site is not in ALLOWED_HOSTS.",
    rate_limited: "Too many requests from this visitor for now.",
    daily_cap_reached: "The daily AI limit for this site has been reached.",
    bad_kind: "Unknown content type requested."
};
