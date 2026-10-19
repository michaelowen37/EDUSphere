// The curriculum map, checked. Fails only for grades marked ready; reports gaps for the rest.
import * as L from '../src/logic.mjs';
import { CURRICULUM, FRAMEWORKS, STATES, coverageReport, frameworkForState } from '../src/curriculum.mjs';

let pass = 0, fail = 0;
const ok = (name, cond) => { if (cond) { pass++; console.log('PASS -', name); } else { fail++; console.log('FAIL -', name); } };

const { rows, orphans } = coverageReport(L.MODULES);

ok('every plan names its published sources', CURRICULUM.every((p) => /TEKS|Texas/.test(p.source) && /Common Core|Head Start|Next Generation Science|National Council for the Social Studies|American Psychological Association|Council for Economic Education|National Communication Association/.test(p.source)));
ok('every standard names a framework the platform knows', CURRICULUM.every((p) => p.standards.every((st) => FRAMEWORKS[st.framework])));
ok('every state and the District of Columbia are listed with a framework', STATES.length === 51 && STATES.every((st) => FRAMEWORKS[st.framework]));
ok('Texas builds to TEKS and California to Common Core', frameworkForState('TX') === 'TEKS' && frameworkForState('CA') === 'CCSS');
ok('every plan carries both frameworks', CURRICULUM.every((p) => p.standards.some((st) => st.framework === 'TEKS') && p.standards.some((st) => st.framework === 'CCSS')));
ok('every module a plan names really exists', rows.every((r) => r.unknown.length === 0));
ok('every module belongs to at least one standard', orphans.length === 0);
ok('no prerequisite is missing and no chain loops back on itself', L.checkPrerequisiteGraph().length === 0);
for (const fw of Object.keys(FRAMEWORKS)) {
  for (const r of coverageReport(L.MODULES, fw).rows) {
    const label = `${fw} ${L.gradeLabel(r.grade)} ${r.subject}: ${r.covered} of ${r.total} standards covered`;
    // Ready is enforced against TEKS, the first framework we build to; Common Core gaps are reported.
    if (r.status === 'ready' && fw === 'TEKS') ok(label + ' (marked ready, so all must be)', r.missing.length === 0);
    else console.log('NOTE -', label, r.missing.length ? `still needs: ${r.missing.join(', ')}` : '');
  }
}
if (orphans.length) console.log('orphans:', orphans.join(', '));
// Reflections keep pace with the curriculum: a note for every stage where the pool is
// thinner than one question per module, and a check that every theme is represented.
for (const stage of ['early', 'growing', 'teen', 'grown']) {
  const modules = L.MODULES.filter((m) => L.stageForGrade(L.getCourse(m.courseId).grade) === stage).length;
  const questions = L.WONDER.filter((w) => (w.stage || 'early') === stage).length;
  if (modules === 0) continue;
  const line = `reflections for the ${stage} stage: ${questions} questions for ${modules} modules`;
  if (questions >= modules) ok(line, true); else console.log('NOTE -', line, `(write ${modules - questions} more to reach one per module)`);
  const themes = new Set(L.WONDER.filter((w) => (w.stage || 'early') === stage).map((w) => w.theme));
  ok(`every theme is represented in the ${stage} pool`, Object.keys(L.WONDER_THEMES).every((t) => themes.has(t)));
}
ok('every reflection carries a known theme', L.WONDER.every((w) => L.WONDER_THEMES[w.theme]));
// The transcript names the standards a finished course satisfied; every course must map to at least one code in each framework.
for (const c of L.COURSES) for (const fw of ['TEKS', 'CCSS']) {
  const ids = c.modules.map((m) => m.id);
  const codes = CURRICULUM.flatMap((e) => e.standards.filter((st) => st.framework === fw && st.moduleIds.some((id) => ids.includes(id))).map((st) => st.code));
  ok(`${c.id} has standards satisfied to show on a transcript (${fw})`, codes.length > 0);
}

// A plan never repeats a code: two lines with one code print twice on the map and split the modules that satisfy it.
const repeats = [];
for (const plan of CURRICULUM) { const seen = new Set(); for (const st of plan.standards) { const key = `${st.framework}:${st.code}`; if (seen.has(key)) repeats.push(`${plan.grade} ${plan.subject} ${key}`); seen.add(key); } }
ok('no plan repeats a code', repeats.length === 0, repeats.join(', '));
// Plans follow the citations (pass ML, First Steps' review): in a pre-K course reviewed at the refined standard, every Texas
// Prekindergarten Guidelines outcome and Head Start goal a lesson cites, written as a code and then its words in parentheses
// ("V.E.1 (sorts objects ...)", "Goal P-MATH 8 (measures ...)"), is a plan row for its grade that names the lesson, and every plan
// row that names the lesson is one it cites, so the standards map and the transcript never claim what a lesson does not teach.
// A code only mentioned ("heights and lengths (V.D.1) are taught in Bigger and smaller") is not a citation. First Sounds and
// Letters joins the list when its review comes.
{
  const REVIEWED_PREK = ['very-first-steps-pk3', 'listen-and-point-pk3', 'first-steps-pk'];
  const cited = (mod) => { const txt = (mod.sources || []).join(' '); const out = new Set();
    for (const m of txt.matchAll(/\b((?:IX|IV|V?I{0,3}|X)\.[A-F]\.\d+(?:\.[a-c])?) \(/g)) if (/^[IVX]+\./.test(m[1])) out.add(m[1]);
    for (const m of txt.matchAll(/\bP-([A-Z]+) (\d+) \(/g)) out.add(`P-${m[1]}.${m[2]}`);
    return out; };
  const off = [];
  for (const cid of REVIEWED_PREK) {
    const c = L.getCourse(cid); const planned = new Map();
    for (const p of CURRICULUM.filter((x) => x.grade === c.grade)) for (const st of p.standards) for (const mid of st.moduleIds) { if (!planned.has(mid)) planned.set(mid, new Set()); planned.get(mid).add(st.code.replace(/^PK[34]\./, '').replace(/^ELOF\./, '')); }
    for (const m of c.modules) { const cs = cited(L.MODULES.find((x) => x.id === m.id)); const ps = planned.get(m.id) || new Set();
      for (const code of cs) if (!ps.has(code)) off.push(`${m.id} cites ${code}, which no plan row gives it`);
      for (const code of ps) if (!cs.has(code)) off.push(`${m.id} is planned for ${code}, which it does not cite`); }
  }
  ok('every reviewed pre-K lesson\'s citations and its plan rows agree both ways (pass ML)', off.length === 0);
  if (off.length) console.log(off.slice(0, 6).join('\n'));
}
console.log(`\n${pass} passed, ${fail} failed`);
process.exitCode = fail ? 1 : 0;   // never process.exit(): it can drop the last lines of a piped stdout (2026-09-23)
