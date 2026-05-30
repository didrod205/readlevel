import { describe, expect, it } from "vitest";
import {
  analyze,
  countSyllables,
  keywordDensity,
  longestSentences,
  readingTime,
  sentences,
  words,
} from "../src/index.js";

describe("countSyllables", () => {
  it("estimates common words correctly", () => {
    expect(countSyllables("cat")).toBe(1);
    expect(countSyllables("hello")).toBe(2);
    expect(countSyllables("table")).toBe(2);
    expect(countSyllables("cake")).toBe(1);
    expect(countSyllables("banana")).toBe(3);
    expect(countSyllables("beautiful")).toBe(3);
    expect(countSyllables("readability")).toBe(5);
  });

  it("never returns less than 1 for a real word", () => {
    expect(countSyllables("a")).toBe(1);
    expect(countSyllables("the")).toBe(1);
    expect(countSyllables("")).toBe(0);
  });
});

describe("tokenization", () => {
  it("counts words including apostrophes/hyphens", () => {
    expect(words("It's a well-known fact.")).toEqual(["It's", "a", "well-known", "fact"]);
  });

  it("counts sentences", () => {
    expect(sentences("One. Two! Three?")).toBe(3);
    expect(sentences("No terminal punctuation here")).toBe(1);
    expect(sentences("")).toBe(0);
  });
});

describe("analyze", () => {
  it("returns zeros for empty text", () => {
    const a = analyze("");
    expect(a.words).toBe(0);
    expect(a.grade).toBe(0);
    expect(a.gradeLabel).toBe("—");
  });

  it("counts a simple sentence", () => {
    const a = analyze("The cat sat on the mat.");
    expect(a.words).toBe(6);
    expect(a.sentences).toBe(1);
    expect(a.syllables).toBe(6);
    expect(a.uniqueWords).toBe(5); // "the" repeats
  });

  it("rates a simple sentence as very easy / low grade", () => {
    const a = analyze("The cat sat on the mat.");
    expect(a.readability.fleschReadingEase).toBeGreaterThan(90);
    expect(a.grade).toBeLessThanOrEqual(2);
    expect(a.ease).toBe("Very easy");
  });

  it("rates dense academic prose as harder than plain prose", () => {
    const plain = "I went to the store. I bought milk. Then I came home.";
    const dense =
      "The utilization of multisyllabic terminology substantially increases the cognitive " +
      "burden, thereby diminishing comprehensibility for the average reader.";
    const easy = analyze(plain);
    const hard = analyze(dense);
    expect(hard.grade).toBeGreaterThan(easy.grade);
    expect(hard.readability.fleschReadingEase).toBeLessThan(easy.readability.fleschReadingEase);
  });

  it("estimates reading time", () => {
    const text = Array(200).fill("word").join(" ");
    expect(analyze(text).readingTimeSeconds).toBe(60); // 200 words @ 200 wpm = 1 min
  });

  it("never produces a negative grade", () => {
    const a = analyze("Go. Run. Sit. Up.");
    for (const v of Object.values(a.readability)) expect(v).toBeGreaterThanOrEqual(0);
  });
});

describe("keywordDensity", () => {
  it("ranks frequent non-stopwords", () => {
    const text = "Marketing is great. Great marketing wins. Marketing, marketing, marketing!";
    const kw = keywordDensity(text, { top: 2 });
    expect(kw[0]).toMatchObject({ word: "marketing", count: 5 });
    expect(kw[0]!.percent).toBeGreaterThan(0);
    expect(kw.find((k) => k.word === "is")).toBeUndefined(); // stop word removed
  });

  it("respects minLength and stopword options", () => {
    const kw = keywordDensity("the the the cat cat dog", { removeStopwords: false, minLength: 3 });
    expect(kw[0]).toMatchObject({ word: "the", count: 3 });
  });
});

describe("helpers", () => {
  it("readingTime accepts a custom wpm", () => {
    const text = Array(300).fill("w").join(" ");
    expect(readingTime(text, 300)).toBe(60);
  });

  it("finds the longest sentences", () => {
    const text = "Short. This sentence is considerably longer than the other ones here.";
    const longest = longestSentences(text, 1);
    expect(longest[0]!.words).toBeGreaterThan(5);
  });
});
