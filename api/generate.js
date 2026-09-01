/* Vercel serverless function: POST /api/generate */
import { config, guard, readParams, generate, ERROR_TEXT } from "./_lib/ai-core.mjs";

export default async function handler(req, res) {
    res.setHeader("Cache-Control", "no-store");

    if (req.method !== "POST") {
        return res.status(405).json({ ok: false, error: "method_not_allowed" });
    }

    const cfg = config();
    const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
    const origin = req.headers.origin || req.headers.referer || "";
    const host = String(req.headers.host || "");
    const isLocal = /^(localhost|127\.0\.0\.1)(:|$)/.test(host);

    const g = guard(cfg, { ip, origin, isLocal });
    if (!g.ok) {
        return res.status(200).json({ ok: false, error: g.error, message: ERROR_TEXT[g.error] });
    }

    const body = typeof req.body === "string" ? safeParse(req.body) : (req.body || {});
    const result = await generate(cfg, readParams(body));
    return res.status(200).json(result);
}

function safeParse(s) { try { return JSON.parse(s); } catch { return {}; } }
