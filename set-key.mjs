/* =========================================================
   npm run set-key
   Asks for an OpenAI key on the terminal and writes .env.
   Nothing is printed back and nothing is sent anywhere.
   ========================================================= */
import fs from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(dir, ".env");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = q => new Promise(res => rl.question(q, res));

console.log("\n  Young Heroes - OpenAI setup");
console.log("  Get a key at https://platform.openai.com/api-keys");
console.log("  (press Enter to leave it empty and keep the built-in generator)\n");

const key = (await ask("  OPENAI_API_KEY: ")).trim();
let model = (await ask("  Model [gpt-4o-mini]: ")).trim() || "gpt-4o-mini";
rl.close();

if (key && !/^sk-/.test(key)) {
    console.log("\n  ⚠ That does not look like an OpenAI key (they start with \"sk-\"). Saving it anyway.");
}

/* keep any other settings that are already in .env */
let existing = {};
if (fs.existsSync(envPath)) {
    fs.readFileSync(envPath, "utf8").split(/\r?\n/).forEach(line => {
        const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
        if (m) existing[m[1]] = m[2];
    });
}
existing.OPENAI_API_KEY = key;
existing.OPENAI_MODEL = model;
existing.PORT = existing.PORT || "3000";

const out = Object.keys(existing).map(k => `${k}=${existing[k]}`).join("\n") + "\n";
fs.writeFileSync(envPath, out, { mode: 0o600 });

console.log(`\n  Saved to .env${key ? "" : " (no key - the built-in generator stays in use)"}.`);
console.log("  .env is listed in .gitignore, so the key will not be committed.");
console.log("  Now run:  npm start\n");
