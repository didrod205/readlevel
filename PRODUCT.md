# readlevel — Product & Strategy

Why readlevel exists, who it's for, how it's positioned, and how it could sustain itself.

## 1. Why this idea

Almost everyone writes for other people — emails, posts, ads, docs, essays — and
almost everyone overestimates how easy their writing is to read. Long sentences
and multi-syllable words quietly raise the required reading level, and readers
drop off. The fix is a number: a reading-level score. But good scores are
**formula-based and exact** (syllables, words, sentences), not something to
eyeball — and many contexts (plain-language laws, insurance, healthcare,
government) literally **mandate** a maximum grade level with auditable proof.

readlevel turns that into an instant habit: paste text, see the grade and what's
making it hard, locally. It's a "why didn't I have this?" tool for anyone who
writes.

It fits every constraint: **AI can't reliably replace it** (formulas need exact,
reproducible math; an LLM only estimates), **no server**, **no API key**, **runs
in the browser or any JS runtime**, immediate value, broad audience.

## 2. Competitor analysis

| Tool | What it does | Gaps readlevel fills |
| ---- | ------------ | -------------------- |
| Hemingway Editor | Highlights hard sentences | Paid desktop/web; closed; not a library; your text on their app |
| Online readability checkers | Score pasted text | **Upload** your draft; ads; not embeddable |
| `text-readability` / `textstat` (libs) | Compute formulas | Library-only (no friendly app); some carry deps; less of a "habit" |
| Word-count sites | Counts + maybe reading time | No readability formulas, no keyword density, server-side |
| Grammar tools (Grammarly, etc.) | Grammar + style | Cloud, account, subscription; overkill for "what grade is this?" |

**Nobody** offers a zero-dependency library **and** a friendly **local** web app
that gives the full picture — counts, six formulas, reading time, keyword density
— with nothing uploaded.

## 3. Differentiation

1. **Local-first & private** — your unpublished draft never leaves the browser.
2. **Deterministic & auditable** — same text → same scores (good for compliance).
3. **Library + app from one core** — devs embed it; everyone uses the studio.
4. **Complete** — not just one formula: counts, six readability scores, timing,
   keyword density.
5. **Zero dependencies**, runs anywhere JS does.

## 4. Folder structure

```
readlevel/
├─ src/        syllables.ts · stopwords.ts · index.ts (formulas + API)
├─ test/       deterministic count/formula/keyword tests
├─ web/        Vite live dashboard → docs/ (GitHub Pages)
├─ .github/    ci · release · pages workflows, templates, FUNDING
└─ README · LICENSE · CONTRIBUTING · CODE_OF_CONDUCT · CHANGELOG · PRODUCT
```

## 9. GitHub Topics

```
readability, flesch, flesch-kincaid, reading-level, reading-time,
text-statistics, word-count, syllables, keyword-density, gunning-fog,
writing, zero-dependency
```

## 10. Product Hunt launch copy

**Tagline:** See your writing's reading level as you type — locally, nothing uploaded.

**Description:**
> Your writing is probably harder to read than you think. readlevel scores any
> text the way editors and accessibility guidelines do — Flesch reading ease,
> grade level, reading time, plus word/sentence/syllable counts and keyword
> density — and updates live as you simplify.
>
> It runs 100% in your browser (your draft never leaves your machine), and
> there's a zero-dependency npm library to grade text in your own app or CI.
>
> Free & open-source (MIT). 📖

**First comment (maker):** "I kept shipping 'simple' copy that tested at a college
reading level. I wanted a private, instant gauge — not a cloud tool that wants my
unpublished drafts — so I built one."

## 11. npm package name

- **Primary:** `readlevel` (clear, searchable — "reading level"; available).
- Discoverability via keyword topics & SEO below.

## 12. SEO keyword strategy

Intent-rich queries:

- "readability score", "reading level checker", "flesch kincaid grade level"
- "how hard is my text to read", "what grade level is my writing"
- "reading time calculator", "keyword density checker"
- "readability javascript library", "flesch reading ease calculator"
- "hemingway editor alternative free"

Tactics: descriptive `<title>`/meta on the app (done), README phrasing, per-formula
docs ("What is a good Flesch score?"), GitHub topics, and the GitHub Pages app as
an indexable landing page.

## 13. Monetization (without breaking the free, local promise)

Core stays free, open-source, local forever.

1. **Sponsorship** — Lemon Squeezy (wired up), with a clear "where it goes" note.
2. **Pro / integrations** — a paid "rewrite suggestions" mode, a CMS/Google Docs/
   VS Code extension, a team "house-style & grade target" linter, or a CLI/CI
   action that fails builds when docs exceed a target grade.
3. **Funded features** — orgs sponsor multilingual support or compliance-grade
   reporting (plain-language audits).

Guardrails: never upload user text, never add telemetry, never paywall the
existing analysis features.
