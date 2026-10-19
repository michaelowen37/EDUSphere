// Copyright (c) 2026 iECHO, LLC. All rights reserved.
// -----------------------------------------------------------------------------------------------------------------
// The review packet for one course (pass MJ). In plain terms: an independent check reads a course best from one file that
// holds everything a child meets in it, in screen order, so this prints it as markdown: each module's citations, its written
// lesson and the spoken script a pre-reader hears line by line with its picture, every distinct question its kinds make
// (400 seeds, one per questionKey, so only one wrong choice of each shows; a check that must read every wrong choice
// generates them itself) with the answer, the explanation and every More Info row and what a pre-reader hears after each
// wrong tap, the module's story with its pictures and audio, its experiments and coloring page; then the course's two long
// stories, its Wonder questions with both sets of voices, its games, and the ledger row of every picture named.
// docs/INDEPENDENT-CHECKS.md (How, step 1) asks for it.
//
// Run: node tools/course-packet.mjs <courseId> > /tmp/packet-<courseId>.md      (for example very-first-steps-pk3)
// -----------------------------------------------------------------------------------------------------------------
const COURSE = process.argv[2] || 'very-first-steps-pk3';
const ROOT = new URL('../', import.meta.url);
const L = await import(new URL('src/logic.mjs', ROOT));
const S = await import(new URL('src/stories.mjs', ROOT));
const { readFileSync } = await import('node:fs');
const ledger = readFileSync(new URL('docs/ART-REQUESTS.md', ROOT), 'utf8').split('\n');
const rowFor = (serial) => ledger.find((l) => l.startsWith(`| ${serial} |`)) || `(no ledger row for ${serial})`;
const c = L.COURSES.find((x) => x.id === COURSE);
if (!c) { console.error(`No course with the id ${COURSE}.`); process.exit(1); }
const out = [];
const p = (s = '') => out.push(s);
const desc = (ch) => { try { return L.describeChoice(ch); } catch (e) { return String(ch); } };
const vis = (v) => (v ? JSON.stringify(v).slice(0, 300) : '');
p(`# Review packet: ${c.title} (${c.id}), grade ${c.grade}, ${c.modules.length} modules${c.readAloud ? ', read aloud' : ''}`);
p();
const serials = new Set();
for (const m of c.modules) {
  p(`## ${m.order}. ${L.titleCase(m.title)} (${m.id}), skill ${m.skill || ''}`);
  p(`Tagline: ${m.tagline || ''}`);
  p(`Sources: ${(m.sources || []).join(' | ')}`);
  const les = m.lesson || {};
  p(); p('### Lesson (the written lesson; a pre-reader hears the script below instead)');
  for (const t of les.paragraphs || []) p(`- ${t}`);
  if (les.keyIdea) p(`Key idea: ${les.keyIdea}`);
  if (les.example) { p(`Example picture: ${vis(les.example.visual)}`); p(`Caption: ${les.example.caption || ''}`); for (const a of [].concat(les.example.another || [])) p(`Another way: ${typeof a === 'string' ? a : `${a.text} [picture ${vis(a.visual)}]`}`); if (les.example.formula) p(`Formula: ${les.example.formula}`); }
  for (const pic of les.pictures || []) { serials.add(pic.serial); p(`Painting ${pic.serial} (step ${pic.step}): ${pic.alt}`); }
  p(); p('### Spoken script (readAloudScript: what the child hears, line by line, with its picture)');
  try { L.readAloudScript(m).forEach((line, i) => p(`${i}. ${typeof line === 'string' ? line : `${line.say || line.text || ''}${(line.show || line.visual) ? `  [${vis(line.show || line.visual)}]` : ''}`}`)); } catch (e) { p(`(script error ${e.message})`); }
  p(); p(`### Questions (generators ${[...new Set(m.generators)].join(', ')}; every distinct question from seeds 1 to 400, by questionKey)`);
  for (const g of [...new Set(m.generators)]) {
    const seen = new Map();
    for (let seed = 1; seed <= 400; seed += 1) { let q; try { q = L.generateQuestion(g, seed); } catch (e) { continue; } if (!q) continue; const k = L.questionKey(q); if (!seen.has(k)) seen.set(k, q); }
    p(`#### ${g}: ${seen.size} distinct`);
    let n = 0;
    for (const q of seen.values()) {
      n += 1; if (n > 24) { p(`(... ${seen.size - 24} more of the same pattern)`); break; }
      p(`- Q: ${q.story ? `[setup] ${q.story} ` : ''}${q.prompt}${q.visual ? `  [picture ${vis(q.visual)}]` : ''}`);
      if (q.choices) p(`  Choices: ${q.choices.map((ch) => `${desc(ch)}${String(ch) === String(q.answer) ? ' (ANSWER)' : ''}`).join(' / ')}`); else p(`  Answer: ${q.answer}`);
      if (q.explain) p(`  Explanation: ${q.explain}${q.explainVisual ? `  [picture ${vis(q.explainVisual)}]` : ''}`);
      if (q.whyNot) for (const [ch, entry] of Object.entries(q.whyNot)) p(`  More Info, why not ${desc(ch)}: ${L.whyNotSentence ? L.whyNotSentence(entry) : JSON.stringify(entry)} | heard after that tap: ${L.preReaderWrongWords(q, ch, [ch])}`);
      if (q.alsoRight) p(`  More Info, more right answers: ${q.alsoRight.join(' ')}`);
    }
  }
  const st = S.STORIES[m.id];
  if (st) {
    p(); p(`### Module story: ${st.title} (art ${st.art})`);
    serials.add(st.art);
    p(`About: ${st.about || ''}`);
    (st.words || []).forEach((t, i) => p(`${i}. ${t}`));
    for (const mo of st.more || []) { const sr = mo.serial || mo.art; serials.add(sr); p(`Picture ${sr} after paragraph ${mo.after}: ${mo.alt}`); }
    p(`Main picture alt: ${st.alt || ''}`);
    if (st.audio) { p('Audio (Eleven v4 tags):'); [].concat(st.audio).forEach((t, i) => p(`${i}. ${t}`)); }
  }
  const ex = L.experimentsForModule(m.id);
  for (const e of ex) p(`Experiment: ${e.title} | ask: ${e.ask} | do: ${e.do} | see: ${e.see}${e.tell ? ` | tell (shown under the lesson): ${e.tell}` : ''}`);
  const cp = S.COLOR_PAGES && S.COLOR_PAGES[m.id];
  if (cp) { const sr = Array.isArray(cp) ? cp[0] : cp.serial; p(`Coloring page ${sr}: ${Array.isArray(cp) ? cp[1] : JSON.stringify(cp)}`); if (sr) serials.add(sr); }
  p();
}
for (const [label, table] of [['First long story (COURSE_STORIES)', S.COURSE_STORIES], ['Next long story (MASTERY_STORIES)', S.MASTERY_STORIES]]) {
  const st = table[COURSE];
  if (!st) { p(`## ${label}: none`); continue; }
  p(`## ${label}: ${st.title} (art ${st.art})`);
  serials.add(st.art);
  p(`About: ${st.about || ''}`); p(`Cast: ${JSON.stringify(st.cast || null)}`);
  (st.words || []).forEach((t, i) => p(`${i}. ${t}`));
  for (const mo of st.more || []) { const sr = mo.serial || mo.art; serials.add(sr); p(`Picture ${sr} after paragraph ${mo.after}: ${mo.alt}`); }
  p(`Main picture alt: ${st.alt || ''}`);
  if (st.audio) { p('Audio:'); [].concat(st.audio).forEach((t, i) => p(`${i}. ${t}`)); }
  p();
}
p('## Wonder questions for this course');
for (const w of L.WONDER.filter((x) => (x.courseIds || []).includes(COURSE))) {
  p(`### ${w.id} (theme ${w.theme}, stage ${w.stage}, ${w.answerMode})`);
  p(`Prompt: ${w.prompt}`); p(`Options: ${(w.options || []).join(' / ')}`);
  for (const v of w.simple || []) p(`Short voice, ${v.voice}: ${v.says}`);
  for (const v of w.perspectives || []) p(`Long voice, ${v.voice}: ${v.says}`);
  p(`Closing: ${w.closing}`);
  p();
}
p('## Games this course owns');
for (const id of L.COURSE_GAMES[COURSE] || []) { const g = L.GAMES.find((x) => x.id === id); p(`- ${id}: ${JSON.stringify(g)}`); }
p();
p('## Ledger rows for every picture named above');
for (const s of [...serials].filter(Boolean).sort()) p(rowFor(s));
console.log(out.join('\n'));
