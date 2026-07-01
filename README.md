# 🎀 Suno Kawaii Player

A cute black/pink/yellow **desktop music player for [Suno AI](https://suno.com) songs**. Browse Suno,
pick songs you love, and they drop into your own offline-capable library — all in a soft, animated
kawaii interface.

> Windows desktop app · runs entirely on your PC · open source · **no account, no telemetry, nothing
> sent to the developer.** (In the Explore tab you sign into *your own* Suno account — just like
> using suno.com.)

## ✨ Features

- **Built-in Suno browser** — log in once, click songs to add them to your library (no scraping).
- **Real music player** — play/pause, next/prev, shuffle, repeat, seek, volume, audio visualizer.
- **3-band EQ** with presets, playlists, favorites, search & sorting.
- **Offline** — download songs as `.mp3` or cache your whole library to play with no internet.
- **AI songwriting helper** ("Create" tab) — generates title/style/lyrics (optional, your own DeepSeek key).
- **OBS overlay** — green-screen "Now Playing" for streamers.
- **Backup & restore** to a `.json` file · **one-click self-updates**.

## 🚀 Setup (no coding needed, Windows)

1. Install **Node.js** from [nodejs.org](https://nodejs.org) (click the green LTS button, then Next → Finish).
2. On GitHub: **`< > Code` → Download ZIP**, unzip it, and double-click **`start.bat`**.

First run downloads dependencies (needs internet, ~1 min), then the player opens. After that just
double-click `start.bat` to listen. 🎶

> **Mac/Linux:** run `npm install` then `npm start`.
> **Want an installer?** Double-click `build-exe.bat` to build a Windows `.exe` in `dist\`.

## 🛡️ Is this safe?

Plain, readable source — no obfuscation, no runtime dependencies. The only files that touch your PC or
network: `main.js`, `preload.js`, `renderer/suno-preload.js`, `index.html` (CSP), `start.bat`,
`build-exe.bat`, `package.json`.

It connects only to: **suno.com / cdn\*.suno.ai** (songs), **github.com** (updates),
**api.deepseek.com** (only if you use "Create"), and Google Fonts. No analytics, no telemetry, no app
account. See [`PRIVACY.md`](PRIVACY.md) and [`TERMS.md`](TERMS.md).

## 💜 Credits & License

- Idea, concept & design — **[Feris](https://mez.ink/ferisooo)** ([@ferisooo](https://github.com/ferisooo))
- Engineering & code — built with **[Claude](https://claude.ai) (Anthropic)**

MIT License (see [`LICENSE`](LICENSE)). Forks welcome — keep the MIT notice and credit Feris (design)
and Claude/Anthropic (engineering).

> Not affiliated with Suno, Anthropic, DeepSeek, Google, GitHub, or OBS. An independent fan-made player
> — use it in accordance with Suno's Terms of Service.
