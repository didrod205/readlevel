/**
 * English syllable estimator — a vowel-group heuristic with silent-`e`
 * handling. Not a dictionary (so it's tiny and dependency-free), but accurate
 * enough for readability formulas and deterministic by construction.
 */
export function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (w.length === 0) return 0;

  const groups = w.match(/[aeiouy]+/g);
  let count = groups ? groups.length : 0;

  // Silent trailing "e" (but keep the syllable in "-le" endings like "table").
  if (w.endsWith("e") && !w.endsWith("le")) count -= 1;

  return Math.max(1, count);
}

/** Total syllables across a list of words. */
export function totalSyllables(words: string[]): number {
  let sum = 0;
  for (const w of words) sum += countSyllables(w);
  return sum;
}
