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
// Since pass MM it can also build every course's packet at once from any copy of the project, for tools/content-diff.mjs:
//   node tools/course-packet.mjs --all --full --root <project folder> --out <folder>
// --root reads that copy's sources instead of this one's; --all writes one file per course into --out; --full lists every
// distinct question rather than the first 24 of each kind, and since round two's code check (pass MM) reads each bank's seeds by
// the snapshot's rule (doubling from 400 while the last half makes a new question, to 6,400, and past 76,800, to 102,400 at most,
// for a bank of fewer than 1,000 questions), so a comparison misses no question; until then it read seeds 1 to 400, and a packet held 253 of Rhyme
// time's 870 heard rhymes. Without --full the packet is as it was.
// -----------------------------------------------------------------------------------------------------------------
const { readFileSync, writeFileSync, mkdirSync } = await import('node:fs');
const { resolve } = await import('node:path');
const { pathToFileURL } = await import('node:url');
const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };
const ROOT = option('--root') ? pathToFileURL(resolve(option('--root')) + '/') : new URL('../', import.meta.url);
const FULL = flag('--full');
const L = await import(new URL('src/logic.mjs', ROOT));
const S = await import(new URL('src/stories.mjs', ROOT));
const ledger = readFileSync(new URL('docs/ART-REQUESTS.md', ROOT), 'utf8').split('\n');
const rowFor = (serial) => ledger.find((l) => l.startsWith(`| ${serial} |`)) || `(no ledger row for ${serial})`;
// One course's packet as text. Everything below, until the end of the function, is the packet as pass MJ wrote it.
function packet(COURSE) {
const c = L.COURSES.find((x) => x.id === COURSE);
if (!c) return null;
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
  // A lesson's example is its own drawing, its kind and fields beside the caption and the other ways, so the packet prints it
  // without those (round four's code read, pass MM: it read les.example.visual, which no lesson has, so all 662 lines were blank).
  if (les.example) { const { caption, another, formula, ...drawn } = les.example; p(`Example picture: ${vis(les.example.visual || drawn)}`); p(`Caption: ${les.example.caption || ''}`); for (const a of [].concat(les.example.another || [])) p(`Another way: ${typeof a === 'string' ? a : `${a.text} [picture ${vis(a.visual)}]`}`); if (les.example.formula) p(`Formula: ${les.example.formula}`); }
  for (const pic of les.pictures || []) { serials.add(pic.serial); p(`Painting ${pic.serial} (step ${pic.step}): ${pic.alt}`); }
  p(); p('### Spoken script (readAloudScript: what the child hears, line by line, with its picture)');
  try { L.readAloudScript(m).forEach((line, i) => p(`${i}. ${typeof line === 'string' ? line : `${line.say || line.text || ''}${(line.show || line.visual) ? `  [${vis(line.show || line.visual)}]` : ''}`}`)); } catch (e) { p(`(script error ${e.message})`); }
  p(); p(`### Questions (generators ${[...new Set(m.generators)].join(', ')}; every distinct question from ${FULL ? 'seeds read until the last half made nothing new' : 'seeds 1 to 400'}, by questionKey)`);
  for (const g of [...new Set(m.generators)]) {
    const seen = new Map(); let limit = 400; let lastNew = 0;
    for (let seed = 1; seed <= limit; seed += 1) { let q; try { q = L.generateQuestion(g, seed); } catch (e) { q = null; } if (q) { const k = L.questionKey(q); if (!seen.has(k)) { seen.set(k, q); lastNew = seed; } }
      if (FULL && seed === limit && lastNew > limit / 2 && (limit < 6400 || (limit < 76800 && seen.size < 1000))) limit *= 2; }
    p(`#### ${g}: ${seen.size} distinct${FULL ? ` (${limit} seeds${lastNew > limit / 2 ? ', still making new ones' : ''})` : ''}`);
    let n = 0;
    for (const q of seen.values()) {
      n += 1; if (!FULL && n > 24) { p(`(... ${seen.size - 24} more of the same pattern)`); break; }
      p(`- Q: ${q.story ? `[setup] ${q.story} ` : ''}${q.prompt}${q.visual ? `  [picture ${vis(q.visual)}]` : ''}`);
      // What the screen prints while the voice can speak, where it differs (round three's lesson check, pass MM).
      { const pr = typeof L.printedQuestion === 'function' ? L.printedQuestion(q, true) : null; if (pr && (pr.prompt !== q.prompt || (pr.story || null) !== (q.story || null))) p(`  Printed while the voice can speak: ${pr.story ? `[setup] ${pr.story} ` : ''}${pr.prompt}`); }
      if (q.choices) p(`  Choices: ${q.choices.map((ch) => `${desc(ch)}${String(ch) === String(q.answer) ? ' (ANSWER)' : ''}`).join(' / ')}`); else p(`  Answer: ${q.answer}`);
      // What a pre-reader hears after a wrong trace, which no choice's reason carries (round four's content read, pass MM).
      if (q.type === 'trace' && typeof L.preReaderWrongWords === 'function') p(`  A wrong trace hears: ${L.preReaderWrongWords(q)}`);
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
return out.join('\n');
}
// One course to the screen, as before; or with --all every course to its own file in --out.
if (flag('--all')) {
  const dir = option('--out'); if (!dir) { console.error('--all needs --out <folder>'); process.exitCode = 1; }
  else { mkdirSync(dir, { recursive: true }); for (const course of L.COURSES) writeFileSync(`${dir}/${course.id}.md`, packet(course.id) + '\n'); console.log(`wrote ${L.COURSES.length} packets to ${dir}`); }
} else {
  const id = args.find((a) => !a.startsWith('--') && a !== option('--root') && a !== option('--out')) || 'very-first-steps-pk3';
  const text = packet(id);
  if (text === null) { console.error(`No course with the id ${id}.`); process.exitCode = 1; } else console.log(text);
}
