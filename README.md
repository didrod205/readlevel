<div align="center">

# 📖 readlevel

### Measure how hard your writing is to read — instantly, and locally.

[![npm version](https://img.shields.io/npm/v/@didrod2539/readlevel.svg?color=success)](https://www.npmjs.com/package/@didrod2539/readlevel)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@didrod2539/readlevel?label=gzip)](https://bundlephobia.com/package/@didrod2539/readlevel)
[![CI](https://github.com/didrod205/readlevel/actions/workflows/ci.yml/badge.svg)](https://github.com/didrod205/readlevel/actions/workflows/ci.yml)
[![types](https://img.shields.io/npm/types/@didrod2539/readlevel.svg)](https://www.npmjs.com/package/@didrod2539/readlevel)
[![license](https://img.shields.io/npm/l/@didrod2539/readlevel.svg)](./LICENSE)

**[🌐 Try the free web app →](https://didrod205.github.io/readlevel/)** &nbsp;·&nbsp; paste your text, see its reading level as you type. Nothing uploaded.

</div>

---

You wrote something clear… to *you*. But will your customers, readers, or
students actually understand it? Most writing is **harder to read than the author
thinks** — long sentences and multi-syllable words quietly push the required
reading level up, and people bounce.

**readlevel** scores your text the way professional editors and accessibility
guidelines do: **Flesch Reading Ease**, **Flesch–Kincaid grade**, **Gunning Fog**,
**SMOG**, and more — plus word/sentence/syllable counts, reading time, and
keyword density. It's **deterministic** (the same text always gives the same,
auditable scores), **dependency-free**, and runs **100% locally**.

> 📸 _Screenshot / demo GIF:_ `./web/screenshot.png` — record the [live app](https://didrod205.github.io/readlevel/) as the grade number drops while you simplify a paragraph.

## Why it exists

- **AI can't replace it.** A chatbot *guesses* a grade level; readability formulas
  produce **exact, reproducible** numbers from precise syllable/word/sentence
  math. When a score must be auditable — plain-language laws, insurance, medical
  and government docs that mandate a grade level — you need the formula, not a vibe.
- **Privacy.** Online readability checkers want your draft on their servers (and
  often your email). readlevel runs on your machine. Your unpublished copy stays
  yours.
- **It's a writing habit, not a one-off.** A tiny library + an instant web app
  means you can check every email, post, or doc in seconds.

## Who it's for

**Marketers & copywriters** (does this ad/email land?), **content creators &
bloggers**, **students & academics**, **support/UX writers**, **technical
writers** (READMEs, docs), and **developers** who want a tiny library to grade
text in an app or CI.

## Install

**No install —** just open the **[web app](https://didrod205.github.io/readlevel/)**.

For the library:

```bash
npm install @didrod2539/readlevel
```

> Published on npm under the `@didrod2539` scope (`@didrod2539/readlevel`). The
> import name matches the package name; everything else is identical.

Zero dependencies. ESM + CJS + TypeScript types. Runs in the browser, Node, Deno and Bun.

## Usage

```ts
import { analyze } from "@didrod2539/readlevel";

const a = analyze("The cat sat on the mat.");
a.grade;        // ~0–1
a.gradeLabel;   // "—" / "8th grade" / "College" …
a.ease;         // "Very easy"
a.readability.fleschReadingEase;   // 116.1
a.readingTimeSeconds;              // estimated reading time
a.words;        // 6
a.sentences;    // 1
a.syllables;    // 6
```

### Keyword density (for SEO / editing)

```ts
import { keywordDensity } from "@didrod2539/readlevel";

keywordDensity("Marketing is great. Great marketing wins. Marketing wins.", { top: 3 });
// [{ word: "marketing", count: 3, percent: 30 }, { word: "wins", count: 2, percent: 20 }, …]
```

### Other helpers

```ts
import { readingTime, countSyllables, longestSentences } from "@didrod2539/readlevel";

readingTime(text, 200);        // seconds at 200 wpm
countSyllables("readability"); // 5
longestSentences(text, 3);     // the run-ons to break up
```

## What you get from `analyze()`

| Field | Meaning |
| ----- | ------- |
| `words` / `sentences` / `paragraphs` / `syllables` | Core counts |
| `uniqueWords` / `complexWords` | Vocabulary spread / 3+ syllable words |
| `readability.fleschReadingEase` | 0–100+ (higher = easier) |
| `readability.fleschKincaidGrade` / `gunningFog` / `smogIndex` / `automatedReadabilityIndex` / `colemanLiauIndex` | US grade-level formulas |
| `grade` / `gradeLabel` | Averaged grade + human label |
| `ease` | "Very easy" → "Very difficult" |
| `readingTimeSeconds` / `speakingTimeSeconds` | Time estimates |

## FAQ

**Is my text uploaded anywhere?**
No. The web app and the library run entirely on your device — no server, no
telemetry, works offline.

**How accurate are the syllable counts?**
readlevel uses a fast, deterministic heuristic (vowel groups + silent-`e`
handling) rather than a dictionary, so it stays tiny and dependency-free.
It's accurate enough for readability formulas; a handful of unusual words may be
off by a syllable, just like other formula-based tools.

**Which languages are supported?**
The readability formulas and syllable heuristic are tuned for **English**. Word,
sentence and reading-time counts work for any Latin-script text.

**Why do the formulas sometimes disagree?**
Each formula weighs sentence length and word complexity differently. `grade` is
the average of the grade-level formulas to smooth that out.

**Can I use it in CI to enforce a reading level?**
Yes — `analyze(text).grade` is a plain number; fail your build if a doc exceeds a
target grade.

## Contributing

Contributions welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) and the
[Code of Conduct](./CODE_OF_CONDUCT.md).

```bash
git clone https://github.com/didrod205/readlevel.git
cd readlevel
npm install
npm test          # run the suite
npm run dev       # run the web app locally
```

## 💖 Sponsor

readlevel is free, MIT-licensed, and built in spare time. If it helped you write
something everyone can read, please consider supporting it:

- ⭐ **Star this repo** — free, and it genuinely helps others find it.
- 🍋 **[Sponsor via Lemon Squeezy](https://elab-studio.lemonsqueezy.com/checkout/buy/5d059b89-51d0-456b-b33a-ed56994f7010)** — one-time or recurring support.

**Where your support goes:** passive-voice & adverb detection, sentence-level
highlighting of hard spots, more languages, a "rewrite suggestions" mode, a CLI
and an ESLint-style docs checker, keeping the free web app online, and fast issue
responses.

## License

[MIT](./LICENSE) © readlevel contributors
