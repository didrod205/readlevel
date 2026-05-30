import { analyze, keywordDensity } from "../src/index";

const $ = <T extends HTMLElement>(id: string): T => document.getElementById(id) as T;
const input = $<HTMLTextAreaElement>("input");

function fmtTime(sec: number): string {
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return s ? `${m}m ${s}s` : `${m}m`;
}

function gradeColor(grade: number): string {
  if (grade <= 6) return "var(--good)";
  if (grade <= 10) return "var(--ok)";
  if (grade <= 14) return "var(--warn)";
  return "var(--bad)";
}

const SAMPLE =
  "We're thrilled to invite you to our product launch. It's going to be a great evening with " +
  "demos, drinks, and a few surprises. The utilization of excessively multisyllabic terminology, " +
  "however, can substantially diminish the comprehensibility of otherwise straightforward " +
  "promotional communications intended for a broad and heterogeneous audience.";

function update(): void {
  const text = input.value;
  const a = analyze(text);

  $("grade").textContent = a.words ? String(a.grade) : "—";
  ($("grade") as HTMLElement).style.color = gradeColor(a.grade);
  $("gradeLabel").textContent = a.words ? a.gradeLabel : "Grade level";
  $("ease").textContent = a.words ? `${a.ease} · Flesch ${a.readability.fleschReadingEase}` : "";

  const counts: [string, string][] = [
    ["Words", String(a.words)],
    ["Sentences", String(a.sentences)],
    ["Paragraphs", String(a.paragraphs)],
    ["Syllables", String(a.syllables)],
    ["Reading time", fmtTime(a.readingTimeSeconds)],
    ["Speaking time", fmtTime(a.speakingTimeSeconds)],
    ["Avg words/sentence", String(a.averageWordsPerSentence)],
    ["Complex words", String(a.complexWords)],
  ];
  $("counts").innerHTML = counts
    .map(([k, v]) => `<div class="cell"><span class="v">${v}</span><span class="k">${k}</span></div>`)
    .join("");

  const r = a.readability;
  const scores: [string, number][] = [
    ["Flesch–Kincaid grade", r.fleschKincaidGrade],
    ["Gunning Fog", r.gunningFog],
    ["SMOG", r.smogIndex],
    ["Automated Readability", r.automatedReadabilityIndex],
    ["Coleman–Liau", r.colemanLiauIndex],
  ];
  $("scores").innerHTML = scores
    .map(([k, v]) => `<div class="row"><span>${k}</span><b>${a.words ? v : "—"}</b></div>`)
    .join("");

  const kw = keywordDensity(text, { top: 8 });
  $("keywords").innerHTML = kw.length
    ? kw
        .map((k) => `<span class="chip">${k.word} <em>${k.count}× · ${k.percent}%</em></span>`)
        .join("")
    : `<span class="muted">—</span>`;
}

$("sample").addEventListener("click", () => {
  input.value = SAMPLE;
  update();
});
input.addEventListener("input", update);
update();
