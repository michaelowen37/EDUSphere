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
