// Lists modules whose questions can ask for a worded answer that the lesson never says. Run it after
// changing lessons or generators: node tools/untaught.mjs > docs/UNTAUGHT.md
import * as L from '../src/logic.mjs';
const text = (m) => { const ex = m.lesson.example || {}; return [...m.lesson.paragraphs, m.lesson.keyIdea, ex.caption || '', ex.formula || '', ex.text || '', ...(m.lesson.script || []).map((s) => s.say)].join(' ').toLowerCase(); };
// Only recall answers count: a few words, no digits, not a yes or a no. Computed answers (7 tens and 3 ones) are the rule at work, not a fact to have been told.
const STOP = new Set(['yes', 'no', 'true', 'false', 'same', 'different', 'more', 'fewer', 'less', 'bigger', 'smaller', 'both', 'neither', 'none', 'all']);
const wordy = (a) => typeof a === 'string' && !/\d/.test(a) && a.trim().split(/\s+/).length <= 3 && !STOP.has(a.toLowerCase().replace(/[.!]$/, '')) && !/^(dots|shape|item|pic|art|icon|swatch|letters|solid):/.test(a) && a.length > 1;
// Reading's decoding tasks (read this word, which has the sh sound) and vocabulary-from-context tasks teach in the question itself; they are not recall.
const DECODING = new Set(['read-the-word', 'sh-ch-th', 'silent-e', 'read-the-sentence', 'what-happened', 'vowel-teams', 'two-syllable-words', 'word-meaning-from-context']);
const rows = [];
for (const m of L.MODULES) {
  if (L.getCourse(m.courseId).subject === 'Reading') continue;
  const taught = text(m); const missing = new Map();
  for (const g of new Set(m.generators)) for (let seed = 1; seed <= 40; seed++) {
    const q = L.generateQuestion(g, seed); if (q.type !== 'choice' || !wordy(q.answer)) continue;
    const said = `${q.story || ''} ${q.prompt || ''}`.toLowerCase(); const a = String(q.answer).toLowerCase().replace(/[.!]$/, '');
    if (!taught.includes(a) && !said.includes(a)) missing.set(a, (missing.get(a) || 0) + 1);
  }
  if (missing.size) { const c = L.getCourse(m.courseId); rows.push({ grade: c.grade, subject: c.subject, id: m.id, missing: [...missing.keys()].slice(0, 6) }); }
}
console.log('# Untaught answers\n\nModules where a question can ask for a worded answer the lesson never says. Numbers, pictures and computed answers are not counted. Fix by teaching the fact in the lesson (or a story), or by narrowing the generator.\n');
console.log(`Modules: ${rows.length} of ${L.MODULES.length}.\n\n| Grade | Subject | Module | Answers never said in the lesson |\n|---|---|---|---|`);
for (const r of rows) console.log(`| ${r.grade} | ${r.subject} | ${r.id} | ${r.missing.join(', ')} |`);
