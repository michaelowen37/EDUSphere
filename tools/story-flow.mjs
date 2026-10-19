// The story flow rules (2026-09-28, Mikey): what makes a paragraph read robotic. Shared by tools/story-flow-audit.mjs,
// which reports on every story, and tests/stories.test.mjs, which holds the early years at zero.
export const sentencesOf = (text) => text.replace(/\s+/g, ' ').trim().split(/(?<=[.!?])\s+(?=[A-Z"'(])/).map((s) => s.trim()).filter(Boolean);
const wc = (s) => s.split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length;
// Short runs across a paragraph break (pass MK, the story check): the choppy rule reads one paragraph at a time, so three short
// sentences could still run across a break (Quack, it said again. The duck! | She closed her eyes once more. Ribbit! Who said
// that?). This reads a story's paragraphs as one stream with the flow rules, the moral left out and a one-word beat skipped, and
// returns each run of three or more sentences of six words or fewer that crosses a break, as the paragraphs (from 0) it touches.
export function crossBreakRuns(words) {
  const all = []; words.slice(0, -1).forEach((p, i) => sentencesOf(p).forEach((s) => all.push([i, wc(s)])));
  const runs = []; let run = [];
  const flush = () => { const paras = [...new Set(run.map((r) => r[0]))]; if (run.length >= 3 && paras.length > 1) runs.push(paras); run = []; };
  for (const [i, n] of all) { if (n === 1) continue; if (n <= 6) run.push([i, n]); else flush(); }
  flush(); return runs;
}
// Even stretches and Then after Then across a paragraph break (pass ML, the story check's second read): the brief has read
// all three rules across a break since pass MK, but only the short-run rule had a tool, so four sentences within three words
// of one length (11, 11, 12, 11, from "The last number you say tells how many" into "the counting jar") passed every check.
// This reads the story as one stream, the moral left out, and returns each such stretch that crosses a break, and each Then
// right after a Then across one, as { rule, paras } with the paragraphs (from 0) it touches. A stretch inside one paragraph
// is flowFlags' to report, so it is not repeated here.
export function crossBreakEven(words) {
  const all = []; words.slice(0, -1).forEach((p, i) => sentencesOf(p).forEach((s) => all.push([i, wc(s), s])));
  const out = [];
  for (let i = 0; i + 3 < all.length; i++) {
    const w = all.slice(i, i + 4); const lens = w.map((x) => x[1]); const paras = [...new Set(w.map((x) => x[0]))];
    if (paras.length > 1 && Math.max(...lens) - Math.min(...lens) <= 3 && Math.min(...lens) >= 4) { out.push({ rule: 'monotone', paras }); i += 3; }
  }
  for (let i = 1; i < all.length; i++) if (all[i][0] !== all[i - 1][0] && /^Then\b/.test(all[i][2]) && /^Then\b/.test(all[i - 1][2])) out.push({ rule: 'then, then', paras: [all[i - 1][0], all[i][0]] });
  return out;
}
export function flowFlags(paragraph, { moral = false } = {}) {
  const sents = sentencesOf(paragraph); const lens = sents.map(wc); const flags = [];
  // A story's closing moral is a short refrain by design (Count one at a time. The last number is how many.), so the
  // choppy rule skips it; the other two rules still apply.
  // A single word on its own (Mmm. Corner. Peep!) is a sound, a shout or a beat, by design; it neither counts toward a choppy
  // run nor breaks one.
  let run = 0; if (!moral) for (const n of lens) { if (n === 1) continue; run = n <= 6 ? run + 1 : 0; if (run === 3) { flags.push('choppy'); break; } }
  for (let i = 0; i + 3 < lens.length; i++) { const w = lens.slice(i, i + 4); if (Math.max(...w) - Math.min(...w) <= 3 && Math.min(...w) >= 4) { flags.push('monotone'); break; } }
  for (let i = 1; i < sents.length; i++) if (/^Then\b/.test(sents[i]) && /^Then\b/.test(sents[i - 1])) { flags.push('then, then'); break; }
  return { flags, lens };
}
