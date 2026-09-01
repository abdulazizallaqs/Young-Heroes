/* Vercel serverless function: GET /api/status */
import { config, usage, ERROR_TEXT } from "./_lib/ai-core.mjs";

export default function handler(req, res) {
    const cfg = config();
    const publicBlocked = cfg.on && !cfg.publicAI;
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({
        ok: true,
        app: "Young Heroes",
        ai: cfg.on && cfg.publicAI,
        model: (cfg.on && cfg.publicAI) ? cfg.model : null,
        usage: usage(),
        lastError: !cfg.on ? ERROR_TEXT.no_api_key
            : publicBlocked ? ERROR_TEXT.ai_disabled_in_public
                : null
    });
}
