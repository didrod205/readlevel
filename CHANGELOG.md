# Changelog

All notable changes to this project are documented in this file. The format is
based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this
project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0]

### Added

- Initial release.
- `analyze(text)` — counts (words, sentences, paragraphs, syllables, unique &
  complex words), six readability formulas (Flesch Reading Ease, Flesch–Kincaid,
  Gunning Fog, SMOG, ARI, Coleman–Liau), averaged grade + label, ease label, and
  reading/speaking time.
- `keywordDensity(text, options?)`, `readingTime(text, wpm?)`,
  `longestSentences(text, n?)`, `countSyllables(word)`, `words`, `sentences`.
- English stop-word list for keyword density.
- Free, local-only web app (live reading-level dashboard) deployed to GitHub Pages.
- Zero runtime dependencies; ESM + CJS + TypeScript types.

[Unreleased]: https://github.com/didrod205/readlevel/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/didrod205/readlevel/releases/tag/v0.1.0
