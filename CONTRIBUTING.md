# Contributing to readlevel

Thanks for taking the time to contribute! 🎉 readlevel aims to be a small,
dependency-free, **deterministic** tool. Contributions are reviewed with that in
mind.

## Getting started

```bash
git clone https://github.com/didrod205/readlevel.git
cd readlevel
npm install
```

| Command | What it does |
| ------- | ------------ |
| `npm test` | Run the test suite (Vitest). |
| `npm run test:watch` | Re-run tests on change. |
| `npm run typecheck` | Type-check without emitting. |
| `npm run build` | Build the library (`dist/`). |
| `npm run build:web` | Build the web app (`docs/`). |
| `npm run dev` | Run the web app locally (`vite`). |

## Good contributions

- **Passive-voice / adverb / weasel-word detection.**
- **Sentence-level highlighting** of the hardest spots.
- **More readability formulas** or **more languages** (with the right syllable model).
- **A CLI** to grade files and fail CI above a target grade.

## Rules of the road

1. Every change needs a test. For formulas, assert exact values where possible,
   or robust relative invariants ("dense prose scores a higher grade than plain
   prose"). For syllables, use words where any reasonable heuristic agrees.
2. `npm run typecheck` and `npm test` must pass.
3. Keep the public API small and the package **zero-dependency**.
4. Cite a reference for any new formula.

## Reporting bugs

Open an issue with the input text (or a minimal snippet), the field/score
involved, and what you expected vs. got.

By contributing you agree your contributions are licensed under the project's
[MIT License](./LICENSE).
