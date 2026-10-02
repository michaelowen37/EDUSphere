// -----------------------------------------------------------------------------------------------------------------
// Question pools audit (2026-10-01, pass HR, Mikey). In plain terms: for every module, this counts how many different
// questions its question banks can actually produce (sampling each bank many times and counting distinct
// question-and-setup pairs) and compares that with the length of one practice round for that module. A module whose
// pool is smaller than its round would have to repeat questions; the app now shortens such a round instead, and this
// report lists them so their banks can be grown. Run: node tools/question-pools.mjs > docs/QUESTION-POOLS.md
// -----------------------------------------------------------------------------------------------------------------
import { COURSES, generateQuestion, moduleRules, questionKey } from '../src/logic.mjs';
export function poolSize(generators, samples = 600) {
  const seen = new Set();
  for (const g of new Set(generators)) for (let s = 1; s <= samples; s++) { seen.add(questionKey(generateQuestion(g, s * 7919))); }
  return seen.size;
}
export function shortPools(samples = 600) {
  const rows = [];
  for (const c of COURSES) for (const m of c.modules) {
    if ([...new Set(m.generators)].every((g) => generateQuestion(g, 1).type === 'trace')) continue; // tracing is motor practice; repeats are allowed
    const need = moduleRules(m.id).questions; const have = poolSize(m.generators, samples);
    if (have < need) rows.push({ grade: c.grade, subject: c.subject, course: c.id, module: m.id, title: m.title, have, need });
  }
  return rows;
}
if (process.argv[1] && process.argv[1].endsWith('question-pools.mjs')) {
  const rows = shortPools();
  const total = COURSES.reduce((a, c) => a + c.modules.length, 0);
  console.log(`# Question pools\n\nGenerated ${new Date().toISOString().slice(0, 10)} by tools/question-pools.mjs. ${rows.length} of ${total} modules can produce fewer different questions than one practice round asks for. Those rounds are shortened rather than repeating a question; each bank below needs more questions, written so every answer is taught in its lesson.\n\n| Grade | Subject | Course | Module | Different questions | Round length |\n|---|---|---|---|---|---|`);
  for (const r of rows) console.log(`| ${r.grade} | ${r.subject} | ${r.course} | ${r.module} | ${r.have} | ${r.need} |`);
}
