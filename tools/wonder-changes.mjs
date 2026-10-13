// The Wise Human. Copyright (c) 2026. Source-available; not for reuse. See LICENSE.md.
// Every Wonder change between an earlier copy of the project and this one, quoted (pass MH, the final read). In plain terms:
// Mikey's rule since pass MB is that Wonder text ships without waiting for his approval and every change is quoted in the pass's
// DECISIONS entry for his later check ("You don't really need me to approve wonder questions, just add them and I'll check them
// all later."). Give this tool the folder of the last delivered project, and it prints, as Markdown ready for the entry, each
// question whose words changed: its question, choices and closing old then new, and every voice that changed, by the person's
// name, before and now. It reads the code itself, so nothing is left out and nothing is quoted from memory.
// Run: node tools/wonder-changes.mjs <folder of the earlier project>   (for example /home/claude/base)
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const earlier = process.argv[2];
if (!earlier) { console.log('usage: node tools/wonder-changes.mjs <folder of the earlier project>'); process.exitCode = 1; }
else {
  const A = await import(pathToFileURL(resolve(earlier, 'src/logic.mjs')).href);
  const B = await import(new URL('../src/logic.mjs', import.meta.url).href);
  // A voice's label names its person (pass LY): the scientist is Frederick, the artist Chloe, the grandparent Georgette, the
  // skeptic Mike.
  const who = (label) => (/scientist/i.test(label) ? 'Frederick' : /artist/i.test(label) ? 'Chloe' : /grandparent/i.test(label) ? 'Georgette' : /skeptic/i.test(label) ? 'Mike' : String(label));
  const q = (s) => `"${s}"`;
  const list = (a) => ((a || []).length === 1 ? a[0] : (a || []).length === 2 ? `${a[0]} and ${a[1]}` : `${(a || []).slice(0, -1).join(', ')} and ${(a || [])[(a || []).length - 1]}`);
  const voices = (arr) => (arr || []).map((v) => `${who(v.voice)}: ${q(v.says)}`).join(' ');
  // Only the voices whose words changed, matched by person, so a reader sees the line that moved and not the whole set again
  // (the code check's second read of the late fixes).
  const changedVoices = (before, now) => { const byWho = (a) => new Map((a || []).map((v) => [who(v.voice), v.says])); const b = byWho(before); const n = byWho(now); const out = [];
    for (const [p, says] of n) if (b.get(p) !== says) out.push(b.has(p) ? `${p}: ${q(b.get(p))} became ${q(says)}` : `${p}, new: ${q(says)}`);
    for (const [p, says] of b) if (!n.has(p)) out.push(`${p}, removed: ${q(says)}`);
    return out.join('; '); };
  const old = new Map(A.WONDER.map((w) => [w.id, w]));
  const out = []; let changed = 0;
  for (const w of B.WONDER) {
    const o = old.get(w.id);
    if (!o) { changed += 1; out.push(`- ${w.id}, new: ${q(w.prompt)} Choices ${list(w.options)}. Short voices: ${voices(w.simple) || 'none'} Reader voices: ${voices(w.perspectives)} Closing: ${q(w.closing)}`); continue; }
    const keys = Object.keys({ ...w, ...o }).filter((k) => JSON.stringify(w[k]) !== JSON.stringify(o[k]));
    if (!keys.length) continue;
    changed += 1;
    const parts = [];
    if (keys.includes('prompt')) parts.push(`the question ${q(o.prompt)} became ${q(w.prompt)}`);
    if (keys.includes('options')) parts.push(`its choices ${list(o.options)} became ${list(w.options)}`);
    if (keys.includes('closing')) parts.push(`its closing ${q(o.closing)} became ${q(w.closing)}`);
    if (keys.includes('simple')) parts.push(`the short voices: ${changedVoices(o.simple, w.simple)}`);
    if (keys.includes('perspectives')) parts.push(`the reader voices: ${changedVoices(o.perspectives, w.perspectives)}`);
    const other = keys.filter((k) => !['prompt', 'options', 'closing', 'simple', 'perspectives'].includes(k));
    if (other.length) parts.push(`also changed: ${other.join(', ')}`);
    out.push(`- ${w.id} (${q(w.prompt)}): ${parts.join('; ')}`);
  }
  for (const o of A.WONDER) if (!B.WONDER.some((w) => w.id === o.id)) { changed += 1; out.push(`- ${o.id}, removed: ${q(o.prompt)}`); }
  console.log(`${changed} of the ${B.WONDER.length} Wonder questions changed.\n${out.join('\n')}`);
}
