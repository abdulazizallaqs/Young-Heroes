/* =========================================================
   Young Heroes - local server (npm start)
   Serves the app and exposes the same two endpoints the
   Vercel functions in /api provide, using the same shared
   logic in lib/ai-core.mjs, so local == production.
   ========================================================= */
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import {
    config, guard, usage, readParams, generate, ERROR_TEXT
} from "./api/_lib/ai-core.mjs";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT;

app.use(express.json({ limit: "64kb" }));
app.use(cors());

/* never serve server-side source - this must come BEFORE express.static */
const PRIVATE = /^\/(api|_qa|node_modules)\/|^\/(server|set-key)\.m?js$|\.env/i;
app.use((req, res, next) => {
    if (req.method === "GET" && PRIVATE.test(req.path) && !req.path.startsWith("/api/")) {
        return res.status(404).end();
    }
    if (req.method === "GET" && req.path.startsWith("/api/") && !/^\/api\/(status|generate|generate-question)$/.test(req.path)) {
        return res.status(404).end();
    }
    next();
});

app.use(express.static(__dirname, { dotfiles: "deny" }));

app.get("/api/status", (_req, res) => {
    const cfg = config();
    res.set("Cache-Control", "no-store");
    res.json({
        ok: true,
        app: "Young Heroes",
        ai: cfg.on,
        model: cfg.on ? cfg.model : null,
        usage: usage(),
        lastError: cfg.on ? lastError : ERROR_TEXT.no_api_key
    });
});

let lastError = null;

app.post("/api/generate", async (req, res) => {
    const cfg = config();
    res.set("Cache-Control", "no-store");

    /* running locally, so the developer's own machine is always allowed */
    const g = guard(cfg, { ip: req.ip || "local", origin: req.headers.origin || "", isLocal: true });
    if (!g.ok) {
        lastError = ERROR_TEXT[g.error] || g.error;
        return res.json({ ok: false, error: g.error, message: lastError });
    }

    const result = await generate(cfg, readParams(req.body));
    lastError = result.ok ? null : (result.message || ERROR_TEXT[result.error] || result.error);
    if (!result.ok) console.error("  AI:", lastError);
    res.json(result);
});

/* the old single-question route, kept so nothing breaks */
app.post("/api/generate-question", async (req, res) => {
    const cfg = config();
    const p = readParams(req.body);
    p.count = 1;
    const r = await generate(cfg, p);
    if (r.ok && r.items[0]) return res.json({ ok: true, ai: r.items[0] });
    res.json({ ok: false, error: r.error || "unavailable" });
});

app.listen(PORT, () => {
    const cfg = config();
    console.log("\n  Young Heroes");
    console.log(`  → http://localhost:${PORT}`);
    if (cfg.on) {
        console.log(`  AI content: ON  (model: ${cfg.model})`);
    } else {
        console.log("  AI content: OFF - no OPENAI_API_KEY found");
        console.log("             Run 'npm run set-key'. Every game works without it.");
    }
    console.log("");
});
