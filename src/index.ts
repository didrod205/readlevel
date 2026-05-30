/**
 * readlevel — measure how hard your writing is to read.
 *
 * Deterministic, dependency-free readability analysis: word/sentence/syllable
 * counts, six standard readability formulas, reading time, and keyword density.
 * Runs entirely locally — your text never leaves the machine.
 */

import { countSyllables } from "./syllables.js";
import { STOPWORDS } from "./stopwords.js";

export { countSyllables, totalSyllables } from "./syllables.js";
export { STOPWORDS } from "./stopwords.js";

export interface ReadabilityScores {
  /** Flesch Reading Ease (0–100+, higher = easier). */
  fleschReadingEase: number;
  /** Flesch–Kincaid US grade level. */
  fleschKincaidGrade: number;
  gunningFog: number;
  smogIndex: number;
  automatedReadabilityIndex: number;
  colemanLiauIndex: number;
  /** Mean of the grade-level formulas. */
  averageGrade: number;
}

export interface Analysis {
  characters: number;
  charactersNoSpaces: number;
  letters: number;
  words: number;
  uniqueWords: number;
  sentences: number;
  paragraphs: number;
  syllables: number;
  /** Words of three or more syllables. */
  complexWords: number;
  averageWordsPerSentence: number;
  averageSyllablesPerWord: number;
  averageCharactersPerWord: number;
  /** Estimated silent reading time, in seconds (default 200 wpm). */
  readingTimeSeconds: number;
  /** Estimated speaking time, in seconds (default 130 wpm). */
  speakingTimeSeconds: number;
  readability: ReadabilityScores;
  /** Rounded average grade level. */
  grade: number;
  /** Human label for the grade, e.g. "8th grade", "College". */
  gradeLabel: string;
  /** Human label for Flesch Reading Ease, e.g. "Standard", "Very difficult". */
  ease: string;
}

const round = (n: number, p = 1): number => {
  if (!Number.isFinite(n)) return 0;
  const f = 10 ** p;
  return Math.round(n * f) / f;
};
const clampGrade = (n: number): number => (Number.isFinite(n) ? Math.max(0, n) : 0);

const WORD_RE = /[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu;

/** Extract word tokens (letters/numbers, with internal apostrophes/hyphens). */
export function words(text: string): string[] {
  return text.match(WORD_RE) ?? [];
}

/** Count sentences (terminated by `. ! ?`, or the whole text if unpunctuated). */
export function sentences(text: string): number {
  const matches = text.match(/[^.!?]+[.!?]+(?:["'”’)\]]+)?/g);
  if (matches && matches.length > 0) return matches.length;
  return words(text).length > 0 ? 1 : 0;
}

function easeLabel(score: number): string {
  if (score >= 90) return "Very easy";
  if (score >= 80) return "Easy";
  if (score >= 70) return "Fairly easy";
  if (score >= 60) return "Standard";
  if (score >= 50) return "Fairly difficult";
  if (score >= 30) return "Difficult";
  return "Very difficult";
}

function gradeLabel(grade: number): string {
  if (grade <= 0) return "—";
  if (grade < 1) return "Kindergarten";
  if (grade <= 5) return `${Math.round(grade)}th grade`;
  if (grade <= 8) return `${Math.round(grade)}th grade (middle school)`;
  if (grade <= 12) return `${Math.round(grade)}th grade (high school)`;
  if (grade <= 16) return "College";
  return "College graduate";
}

/**
 * Analyze a block of text and return counts, readability scores, and timing.
 *
 * ```ts
 * const a = analyze("The cat sat on the mat.");
 * a.grade;     // ~0–1 (very easy)
 * a.ease;      // "Very easy"
 * ```
 */
export function analyze(text: string): Analysis {
  const toks = words(text);
  const wordCount = toks.length;
  const sentenceCount = sentences(text);
  const paragraphCount = Math.max(text.trim() ? 1 : 0, text.split(/\n\s*\n/).filter((p) => p.trim()).length);
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;
  const letters = (text.match(/\p{L}/gu) ?? []).length;

  let syllables = 0;
  let complexWords = 0;
  const seen = new Set<string>();
  for (const w of toks) {
    const s = countSyllables(w);
    syllables += s;
    if (s >= 3) complexWords += 1;
    seen.add(w.toLowerCase());
  }

  const empty: Analysis = {
    characters, charactersNoSpaces, letters, words: 0, uniqueWords: 0, sentences: 0,
    paragraphs: paragraphCount, syllables: 0, complexWords: 0,
    averageWordsPerSentence: 0, averageSyllablesPerWord: 0, averageCharactersPerWord: 0,
    readingTimeSeconds: 0, speakingTimeSeconds: 0,
    readability: {
      fleschReadingEase: 0, fleschKincaidGrade: 0, gunningFog: 0, smogIndex: 0,
      automatedReadabilityIndex: 0, colemanLiauIndex: 0, averageGrade: 0,
    },
    grade: 0, gradeLabel: "—", ease: "—",
  };
  if (wordCount === 0 || sentenceCount === 0) return empty;

  const wps = wordCount / sentenceCount;
  const spw = syllables / wordCount;
  const cpw = letters / wordCount;

  const fleschReadingEase = 206.835 - 1.015 * wps - 84.6 * spw;
  const fleschKincaidGrade = clampGrade(0.39 * wps + 11.8 * spw - 15.59);
  const gunningFog = clampGrade(0.4 * (wps + 100 * (complexWords / wordCount)));
  const smogIndex = clampGrade(1.043 * Math.sqrt(complexWords * (30 / sentenceCount)) + 3.1291);
  const automatedReadabilityIndex = clampGrade(
    4.71 * (letters / wordCount) + 0.5 * wps - 21.43,
  );
  const L = (letters / wordCount) * 100;
  const S = (sentenceCount / wordCount) * 100;
  const colemanLiauIndex = clampGrade(0.0588 * L - 0.296 * S - 15.8);

  const gradeFormulas = [fleschKincaidGrade, gunningFog, smogIndex, automatedReadabilityIndex, colemanLiauIndex];
  const averageGrade = gradeFormulas.reduce((a, b) => a + b, 0) / gradeFormulas.length;

  return {
    characters,
    charactersNoSpaces,
    letters,
    words: wordCount,
    uniqueWords: seen.size,
    sentences: sentenceCount,
    paragraphs: paragraphCount,
    syllables,
    complexWords,
    averageWordsPerSentence: round(wps),
    averageSyllablesPerWord: round(spw, 2),
    averageCharactersPerWord: round(cpw, 2),
    readingTimeSeconds: Math.round((wordCount / 200) * 60),
    speakingTimeSeconds: Math.round((wordCount / 130) * 60),
    readability: {
      fleschReadingEase: round(fleschReadingEase),
      fleschKincaidGrade: round(fleschKincaidGrade),
      gunningFog: round(gunningFog),
      smogIndex: round(smogIndex),
      automatedReadabilityIndex: round(automatedReadabilityIndex),
      colemanLiauIndex: round(colemanLiauIndex),
      averageGrade: round(averageGrade),
    },
    grade: round(averageGrade),
    gradeLabel: gradeLabel(averageGrade),
    ease: easeLabel(fleschReadingEase),
  };
}

export interface KeywordDensityOptions {
  /** Max number of results. Default `10`. */
  top?: number;
  /** Ignore words shorter than this. Default `3`. */
  minLength?: number;
  /** Exclude common stop words. Default `true`. */
  removeStopwords?: boolean;
}

export interface Keyword {
  word: string;
  count: number;
  /** Share of all words, as a percentage. */
  percent: number;
}

/** Rank the most frequent meaningful words. */
export function keywordDensity(text: string, options: KeywordDensityOptions = {}): Keyword[] {
  const { top = 10, minLength = 3, removeStopwords = true } = options;
  const toks = words(text).map((w) => w.toLowerCase());
  const total = toks.length;
  const counts = new Map<string, number>();
  for (const w of toks) {
    if (w.length < minLength) continue;
    if (removeStopwords && STOPWORDS.has(w)) continue;
    counts.set(w, (counts.get(w) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([word, count]) => ({ word, count, percent: round((count / total) * 100, 2) }))
    .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word))
    .slice(0, top);
}

/** Reading time in seconds at `wpm` words per minute (default 200). */
export function readingTime(text: string, wpm = 200): number {
  return Math.round((words(text).length / wpm) * 60);
}

/** The longest sentences by word count (useful for spotting run-ons). */
export function longestSentences(text: string, n = 3): { text: string; words: number }[] {
  const raw = text.match(/[^.!?]+[.!?]+/g) ?? (text.trim() ? [text] : []);
  return raw
    .map((s) => ({ text: s.trim(), words: words(s).length }))
    .sort((a, b) => b.words - a.words)
    .slice(0, n);
}
