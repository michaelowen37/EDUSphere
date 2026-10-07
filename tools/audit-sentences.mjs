// The Quick Review's educator sentences, word for word, from the code (pass LR, Mikey: the rules audit must never drift
// from what the screens say). In plain terms: this builds one made-up student (S-77) through every path, a review passed,
// nearly passed and missed, a lesson stuck after a review, a lesson never mastered and stuck, both kinds of Move Forward,
// and the fresh tries, and prints each sentence the app would show. With --write it puts that list into docs/RULES-AUDIT.md
// between the two markers; tests/docs-sync.test.mjs fails whenever the list in the audit differs from the code.
import { readFileSync, writeFileSync } from 'node:fs';
import * as L from '../src/logic.mjs';
export function canonicalSentences() {
  const iso = (d) => new Date(Date.UTC(2026, 9, d, 15, 0, 0)).toISOString();
  const att = (m, d, marks) => L.makeAttemptEvent({ moduleId: m, seed: 1 }, marks.map((c) => ({ correct: !!c, ms: 3000 })), null, iso(d), iso(d));
  const pass = (m, d) => att(m, d, [1, 1, 1, 1, 1]); const miss = (m, d) => att(m, d, [0, 0, 0, 1, 1]);
  const marks = (xs) => xs.map((c) => ({ correct: !!c }));
  const pre = L.prerequisitesOf('teen-numbers').slice(-1)[0];
  // A lesson starred on days 1 and 2, reviewed three weeks later.
  const ev = [pass('teen-numbers', 1), pass('teen-numbers', 2)];
  const review = L.buildLightReview(ev, 7, L.lightReviewDue(ev, iso(24)));
  const done = (xs, d) => L.makeLightReviewEvent(review, marks(xs), iso(d), iso(d));
  const stuck = [...ev, done([1, 0, 0, 0, 0], 24), miss('teen-numbers', 25), miss('teen-numbers', 26), L.makeLoopBackEvent('teen-numbers', pre, iso(26)), pass(pre, 27), pass(pre, 27), miss('teen-numbers', 28), miss('teen-numbers', 29)];
  const moved = [...stuck, L.makeMovedForwardEvent('teen-numbers', iso(30))];
  const first = (evs) => L.lightReviewSentences(evs, 'S-77')[0];
  // A lesson never mastered: two misses, a loop back, two more misses; then Move Forward and the fresh tries.
  const nv = [pass(pre, 1), pass(pre, 2), miss('teen-numbers', 3), miss('teen-numbers', 4), L.makeLoopBackEvent('teen-numbers', pre, iso(4).replace('T15', 'T16')), pass(pre, 5), miss('teen-numbers', 6), miss('teen-numbers', 7)];
  const nmv = [...nv, L.makeMovedForwardEvent('teen-numbers', iso(8))];
  const fr = L.buildLightReview(nmv, 3, L.lightReviewQueue(nmv, iso(30)).find((x) => x.moduleId === 'teen-numbers'));
  const fresh = (xs) => L.lightReviewSentences([...nmv, L.makeLightReviewEvent(fr, marks(xs), iso(30), iso(30))], 'S-77')[0];
  return [
    ['A lesson stuck after its review, in the Action Item popup', L.stuckSentence(stuck, 'teen-numbers', 'S-77')],
    ['The same in a summary, without the action line', L.stuckSentence(stuck, 'teen-numbers', 'S-77', { action: false })],
    ['A review passed clearly (four or five right)', first([...ev, done([1, 1, 1, 1, 1], 24)])],
    ['A review nearly passed (three right)', first([...ev, done([1, 1, 1, 0, 0], 24)])],
    ['A review missed (two or fewer)', first([...ev, done([1, 1, 0, 0, 0], 33)])],
    ['After Move Forward on a lesson stuck after its review', first(moved)],
    ['A lesson never mastered and stuck, in the Action Item popup', L.neverStuckSentence(nv, 'teen-numbers', 'S-77')],
    ['The same in a summary, without the action line', L.neverStuckSentence(nv, 'teen-numbers', 'S-77', { action: false })],
    ['After Move Forward before mastery', L.neverMovedSentence(nmv, nmv[nmv.length - 1], 'S-77')],
    ['A fresh try passed clearly', fresh([1, 1, 1, 1, 1])],
    ['A fresh try nearly passed', fresh([1, 1, 1, 0, 0])],
    ['A fresh try missed', fresh([1, 1, 0, 0, 0])],
  ];
}
const START = '<!-- sentences:start: generated from the code by tools/audit-sentences.mjs; never edit by hand, run node tools/audit-sentences.mjs --write -->';
const END = '<!-- sentences:end -->';
export function sentencesBlock() { return [START, ...canonicalSentences().map(([k, v]) => `- **${k}:** ${v}`), END].join('\n'); }
if (process.argv[1] && process.argv[1].endsWith('audit-sentences.mjs')) {
  const block = sentencesBlock();
  if (process.argv.includes('--write')) {
    const p = new URL('../docs/RULES-AUDIT.md', import.meta.url); const s = readFileSync(p, 'utf8');
    const a = s.indexOf('<!-- sentences:start'); const b = s.indexOf(END);
    if (a < 0 || b < 0) throw new Error('the markers are missing from docs/RULES-AUDIT.md');
    writeFileSync(p, s.slice(0, a) + block + s.slice(b + END.length)); console.log('docs/RULES-AUDIT.md: the sentences are updated from the code');
  } else console.log(block);
}
