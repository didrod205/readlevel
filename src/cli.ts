#!/usr/bin/env node
/**
 * readlevel CLI — measure how hard your writing is to read. Zero-dependency.
 *
 *   readlevel article.md                  # readability report
 *   cat README.md | readlevel             # works as a filter
 *   readlevel post.txt --json             # machine-readable
 *   readlevel post.txt --max-grade 9      # exit 1 if it's harder than grade 9
 */

import { readFileSync } from "node:fs";
import { analyze, keywordDensity, longestSentences } from "./index.js";
import pkg from "../package.json";

const HELP = `readlevel — readability scores (Flesch, FK grade, Gunning Fog, SMOG…).

Usage:
  readlevel [file]               Report on a file, or stdin
  cat file | readlevel

Options:
      --json            Output the full analysis as JSON
      --keywords        Also show the top keywords by density
      --long            Also show the longest sentences
      --max-grade <n>   Exit 1 if the average grade level exceeds n (CI gate)
  -h, --help            Show this help
  -v, --version         Show version

Everything runs locally; your text is never uploaded.`;

function readInput(file: string | undefined): string {
  try {
    return readFileSync(file ?? 0, "utf8");
  } catch {
    return "";
  }
}

function main(): number {
  const argv = process.argv.slice(2);
  if (argv.includes("-h") || argv.includes("--help")) {
    process.stdout.write(HELP + "\n");
    return 0;
  }
  if (argv.includes("-v") || argv.includes("--version")) {
    process.stdout.write(`readlevel ${pkg.version}\n`);
    return 0;
  }

  // The file is the first non-flag arg that isn't the value of --max-grade.
  const maxGradeIdx = argv.indexOf("--max-grade");
  const file = argv.find((a, i) => !a.startsWith("-") && i !== maxGradeIdx + 1);
  const text = readInput(file);
  if (!text.trim()) {
    process.stderr.write("readlevel: no text to analyze (pass a file or pipe stdin).\n");
    return 2;
  }

  const a = analyze(text);

  if (argv.includes("--json")) {
    process.stdout.write(JSON.stringify(a, null, 2) + "\n");
  } else {
    const mins = Math.max(1, Math.round(a.readingTimeSeconds / 60));
    const lines = [
      `Grade level   ${a.grade} (${a.gradeLabel})`,
      `Reading ease  ${a.readability.fleschReadingEase} (${a.ease})`,
      ``,
      `  Flesch–Kincaid grade   ${a.readability.fleschKincaidGrade}`,
      `  Gunning Fog            ${a.readability.gunningFog}`,
      `  SMOG index             ${a.readability.smogIndex}`,
      `  Coleman–Liau           ${a.readability.colemanLiauIndex}`,
      `  Automated Readability  ${a.readability.automatedReadabilityIndex}`,
      ``,
      `${a.words} words · ${a.sentences} sentences · ${a.complexWords} complex · ~${mins} min read`,
    ];
    process.stdout.write(lines.join("\n") + "\n");

    if (argv.includes("--keywords")) {
      const kws = keywordDensity(text).slice(0, 8);
      process.stdout.write("\nTop keywords:\n");
      for (const k of kws) process.stdout.write(`  ${k.word}  ${k.percent}% (${k.count})\n`);
    }
    if (argv.includes("--long")) {
      process.stdout.write("\nLongest sentences:\n");
      for (const s of longestSentences(text, 3)) {
        const snip = s.text.length > 70 ? s.text.slice(0, 70) + "…" : s.text;
        process.stdout.write(`  [${s.words}w] ${snip}\n`);
      }
    }
  }

  // CI gate: fail if harder than --max-grade.
  const maxGradeArg = argv[argv.indexOf("--max-grade") + 1];
  if (argv.includes("--max-grade") && maxGradeArg !== undefined) {
    const max = Number(maxGradeArg);
    if (Number.isFinite(max) && a.grade > max) {
      process.stderr.write(`\nreadlevel: grade ${a.grade} exceeds the maximum ${max}.\n`);
      return 1;
    }
  }
  return 0;
}

process.exit(main());
