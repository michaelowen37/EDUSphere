// Copyright (c) 2026 iECHO, LLC. All rights reserved.
// The story flow rules read over the young lessons (pass MS, round one's story flow check). The flow audit reads stories only, and
// two passes' flow checks found lesson lines that read robotic all the same: pass MR's ("Two socks that are just alike match.", a
// doubled opener in Things that happen) and pass MS's (a paragraph of four sentences of 12, 12, 12 and 11 words, and three
// sentences in a row opening "At"), so the trust pyramid asks for a machine. A lesson's paragraphs are read one at a time and across
// their breaks; its spoken script is read line by line and across lines, as a pre-reader hears it, a say-along game ending a stretch
// (the game's calls and the word said many ways are a game, which the say-along rules read), and one rule more than a story's, three
// sentences in a row that open with the same word. tests/scripts.test.mjs holds a lesson built since pass MS to none, and the older
// lessons' count to a limit that only falls.
// Run: node tools/lesson-flow.mjs            every read-aloud pre-K lesson's flags, course by course, and the count
import { sentencesOf, flowFlags, crossBreakRuns, crossBreakEven } from './story-flow.mjs';
import { COURSES, sayAlongParts } from '../src/logic.mjs';

// The first word of a sentence, lowered, for the openings rule.
const firstWord = (s) => (s.replace(/^[^A-Za-z]+/, '').match(/^[A-Za-z'-]+/) || [''])[0].toLowerCase();
// Each run of three sentences in a row that open with the same word, by that word (a run is counted once, however long).
function sameOpenings(sentences) {
  const out = []; let i = 0;
  while (i + 2 < sentences.length) {
    const w = firstWord(sentences[i]); let j = i + 1; while (j < sentences.length && firstWord(sentences[j]) === w) j += 1;
    if (w && j - i >= 3) out.push(w); i = j > i + 1 ? j : i + 1;
  }
  return out;
}
// A stretch of texts read as one stream (a lesson's paragraphs, or the script's lines between two games): each text by the flow rules,
// the runs and the even stretches across its breaks, and the openings; name(k) says which text a flag is in.
function stretchFlags(texts, name) {
  const flags = [];
  texts.forEach((t, k) => { for (const f of flowFlags(t).flags) flags.push(`${name(k)}: ${f}`); });
  for (const r of crossBreakRuns([...texts, ''])) flags.push(`${r.map(name).join(' + ')}: choppy across`);
  for (const r of crossBreakEven([...texts, ''])) flags.push(`${r.paras.map(name).join(' + ')}: ${r.rule} across`);
  for (const w of sameOpenings(texts.flatMap((t) => sentencesOf(t)))) flags.push(`${name(0)} onward: three sentences open with "${w}"`);
  return flags;
}
// Every flag of one lesson: its paragraphs, then its script, its own words on each line with a say-along game cut off, a line that
// ends in a game closing its stretch.
export function lessonFlowFlags(mod) {
  const lesson = (mod && mod.lesson) || {}; const paras = lesson.paragraphs || [];
  const flags = stretchFlags(paras, (k) => `paragraph ${k + 1}`);
  const own = (say) => sayAlongParts(say).filter((p) => p.role === 'say').map((p) => p.sentence).join(' ');
  const game = (say) => sayAlongParts(say).some((p) => p.role !== 'say');
  const stretches = []; let cur = [];
  (lesson.script || []).forEach((l, k) => { cur.push({ k, text: own(l.say) }); if (game(l.say)) { stretches.push(cur); cur = []; } });
  if (cur.length) stretches.push(cur);
  for (const s of stretches) flags.push(...stretchFlags(s.map((x) => x.text), (j) => `line ${s[j].k + 1}`));
  return flags;
}
// The lessons it reads: every module of a read-aloud pre-K course.
export function youngLessons() { return COURSES.filter((c) => c.readAloud && ['PK3', 'PK4'].includes(c.grade)).flatMap((c) => c.modules.map((m) => ({ course: c.id, mod: m }))); }

if (process.argv[1] && process.argv[1].endsWith('lesson-flow.mjs')) {
  let total = 0;
  for (const { course, mod } of youngLessons()) { const f = lessonFlowFlags(mod); if (!f.length) continue; total += f.length; console.log(`${course} / ${mod.id}`); for (const x of f) console.log(`  ${x}`); }
  console.log(`\n${total} flags in ${youngLessons().length} young lessons`);
}
