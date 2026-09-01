# 🦸 Young Heroes

A playful learning world for kids aged roughly 5–10. Four maths games, four
language games, a hero you build and dress up, coins, XP, badges, sound effects,
music, confetti — and a one-tap **Arabic mode** that flips the whole app to
right-to-left with an Arabic voice.

**No accounts. No login. No passwords. Nothing leaves the device.**
Progress lives in the browser's own storage.

---

## Play it

**The quickest way** — double-click `index.html`. That is it. Everything works
offline from the file system.

**With the little Node server** (nicer URL, and optional AI questions):

```bash
npm install
npm start

```

---

## What is inside

### 🏔️ Number Valley

| Game | What it practises |
| --- | --- |
| **Adding Peaks** | Addition, with emoji counters you can literally count at low levels |
| **Take-Away Cave** | Subtraction, showing objects being crossed out |
| **Times Tower** | Multiplication, drawn as groups of objects |
| **Number Hunt** | Counting, bigger/smaller, missing numbers in a sequence, and a "guess my number" game with higher/lower hints |

### 🏝️ Word Island

| Game | What it practises |
| --- | --- |
| **Picture Words** | Match a picture to its English word — and the other way round |
| **Two Worlds** | English ↔ Arabic vocabulary matching (the bilingual game) |
| **Spell It!** | Build the word letter by letter from shuffled tiles |
| **Magic Ears** | The app says a word out loud; the child taps the right picture |

All the language games share a 70-word bilingual picture dictionary covering
animals, food, colours, family, school, nature, home and the body.

### 🎮 Game feel

- **Sound**: every effect is synthesised live with the Web Audio API — clicks,
  coin chimes, correct/wrong stings, level-up fanfares — so nothing needs
  downloading. The mp3 files in `assets/sounds` are used automatically when they
  load. There is also a gentle generated background music loop.
- **Voice**: words are pronounced using the browser's speech synthesis, in
  English or Arabic depending on the mode.
- **Effects**: canvas confetti, radial bursts from the button you tapped,
  floating "+3 🪙" score text, emoji rain on level-ups, screen shake on a wrong
  answer, a streak counter that catches fire, and a fox mascot who cheers you on.
- **Progression**: coins → the Hero Shop (hats and pets you wear), XP → levels,
  and twelve badges in the Trophy Room. Difficulty scales with the hero's level.

### 🌍 Arabic mode

Tap **ع** in the top bar (or the switch under *For grown-ups*) and the entire
interface, every game and the voice switch to Arabic with a proper RTL layout.
There is also a softer option — *Arabic help* — which keeps the app in English
but adds small Arabic translations under words while playing.

---

## Project layout

```
Young Heroes/
├── index.html            single page shell
├── vercel.json           caching + security headers for the deployed site
├── server.js             local dev server (npm start)
├── set-key.mjs           `npm run set-key` helper
├── api/
│   ├── status.js         serverless: is AI on?
│   ├── generate.js       serverless: content, with the abuse guards
│   └── _lib/ai-core.mjs  prompts, validation and limits (shared with server.js)
├── css/
│   ├── style.css         design system, shell, map, shop, trophies
│   └── games.css         everything inside a game
├── js/
│   ├── data.js           vocabulary, avatars, shop items, badges, game list
│   ├── i18n.js           English + Arabic strings, RTL switching
│   ├── audio.js          Web Audio effects, music loop, speech
│   ├── fx.js             canvas particles, confetti, shakes
│   ├── state.js          hero profile, XP, coins, badges (localStorage)
│   ├── ui.js             shared UI helpers, toasts, modals, mascot
│   ├── util.js           shared game helpers
│   ├── ai.js             prefetch queue + AI on/off state
│   ├── mathai.js         turns AI items into questions
│   ├── engine.js         the round runner used by every game
│   ├── screens.js        welcome, map, shop, trophy room, settings
│   ├── app.js            boot + hash router
│   └── games/            one small file per game
└── assets/
    ├── img/              icon + celebration gif
    └── sounds/           optional mp3 effects
```

Adding a game is deliberately small: drop a file in `js/games/`, register it on
`YH.Games`, add an entry to `YH.GAMES` in `data.js` and its two labels to
`i18n.js`. The engine handles rounds, scoring, streaks, sounds and results.

---

---

## Putting it online (GitHub → Vercel → your domain)

The app is a plain static site plus two small serverless functions, so Vercel
needs no build step.

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Young Heroes"
git branch -M main
git remote add origin https://github.com/<you>/young-heroes.git
git push -u origin main
```

`.gitignore` already excludes `.env`, `node_modules/` and the QA harness, so
your key cannot be committed by accident. Check `git status` before the first
push and make sure `.env` is not listed.

### 2. Import into Vercel

New Project → import the repo → **Framework Preset: Other** → Deploy.
Leave the build command and output directory empty. Vercel serves the root as
static files and turns `api/status.js` and `api/generate.js` into functions.
`vercel.json` already sets the caching and security headers.

### 3. Point your domain at it

Vercel → Project → Settings → Domains → add your domain and follow the DNS
instructions it gives you.

### 4. Decide about AI in production — read this before switching it on

Once the site is public, `/api/generate` is reachable by anyone, and **every
call is charged to your OpenAI account**. An unprotected endpoint like that
does get found and abused. So it ships **switched off**: without
`ENABLE_PUBLIC_AI=true`, visitors get the built-in generator and the site costs
you nothing. Every game still works — most people would never notice.

If you do want AI for visitors, set these in
**Vercel → Settings → Environment Variables** (never in the repo):

| Variable | Value | Why |
| --- | --- | --- |
| `OPENAI_API_KEY` | `sk-...` | Your key |
| `ENABLE_PUBLIC_AI` | `true` | The deliberate switch |
| `ALLOWED_HOSTS` | `yourdomain.com,your-project.vercel.app` | Only your own pages may call it |
| `AI_DAILY_CAP` | `500` | Hard ceiling on requests per day |
| `AI_RATE_PER_10MIN` | `40` | Per-visitor limit |

Then set a **spend limit on the OpenAI account itself** (Billing → Limits).
That is the only cap nobody can route around, and it is the one that actually
protects you.

The guards are best-effort, not a login: the per-visitor limit lives in each
serverless instance's memory, so a spread-out attack can get more through than
the numbers suggest, and `ALLOWED_HOSTS` checks a header a determined person can
forge. They stop casual abuse and accidents. If Young Heroes ever gets big
traffic, put the AI behind a proper rate-limit service or move it to a signed
endpoint.

---

## AI content with an OpenAI key

With a key, **every game** asks OpenAI for fresh material instead of only
shuffling the built-in content:

| Game | What OpenAI writes |
| --- | --- |
| Adding Peaks, Take-Away Cave, Times Tower, Number Hunt | New questions, often as little stories ("Sara has 3 apples...") with a teaching hint |
| Picture Words, Two Worlds, Spell It!, Magic Ears | New English + Arabic + emoji vocabulary cards, beyond the 70 built in |

Questions are written in whichever language the app is in, so Arabic mode gets
Arabic questions.

### Switching it on locally

```bash
npm install
npm run set-key      # asks for your key and writes .env (nothing is printed back)
npm start            # then open http://localhost:3000
```

Or copy `.env.example` to `.env` and paste the key into `OPENAI_API_KEY=`
yourself. `.env` is in `.gitignore`, and the server refuses to serve dotfiles or
its own source, so the key never leaves the machine except in calls to OpenAI.

For the deployed site, see *Putting it online* above — AI is off by default
there on purpose.

To confirm it is live, open **⚙️ For grown-ups** in the app. The panel shows a
green dot and the model name when it is working, and the exact reason when it is
not (no key, wrong key, no credit, server not running). It also counts how many
AI items have been used this session.

### How it behaves

- **It never makes a child wait.** Items are fetched in batches of six in the
  background. If the queue is empty when a round starts, that round uses the
  built-in generator and the AI catches up for the next one. Roughly the first
  question of each game is local; the rest are AI.
- **Bad output is thrown away, not shown.** The server checks every item —
  the answer must be a whole number that appears among exactly four distinct
  choices; a vocabulary card must have an a-z English word, real Arabic script
  and exactly one emoji. Anything failing is dropped silently.
- **Failure is invisible to the child.** No key, an expired key, no credit, a
  timeout, or the server being stopped all fall back to the built-in generator.
  Only the grown-ups panel says what went wrong.
- **Cost is small.** One call returns about ten items, and spare items are
  cached, so a full round of eight questions is usually one request. With
  `gpt-4o-mini` an afternoon of play costs a fraction of a cent.

### Endpoints

| Route | Purpose |
| --- | --- |
| `GET /api/status` | Whether AI is on, which model, usage today, last error |
| `POST /api/generate` | `{kind, level, lang, count}` → `{ok, items:[…]}` |

`kind` is `addition`, `subtraction`, `multiplication`, `numbers` or `words`.
`count` is capped at 10 and `level` at 6. The same code runs locally through
`server.js` and in production as a Vercel function, so behaviour matches.

## License

MIT — see [LICENSE](LICENSE).
