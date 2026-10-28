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
// Letters joined the list in its review (pass MM), so every pre-K course is on it.
{
  const REVIEWED_PREK = ['very-first-steps-pk3', 'listen-and-point-pk3', 'first-steps-pk', 'first-sounds-pk'];   // First Sounds and Letters since pass MM
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
  // Quoted word for word (pass MM, the review of the workflow: a mistake class the checks found by reading in passes MK and ML,
  // held by no machine until now). A citation names a code and quotes its words in parentheses after it: a Texas outcome
  // (III.B.6 (identifies rhyming words)) or a Head Start goal (P-LIT 1 (demonstrates ...)), and a goal's progression after
  // "month progression reads" in quotation marks. Each quote must be the plan row's words for that code, which are TEA's and
  // Head Start's (the row keeps "Child" and the period; a quote starts after Child), and a progression quoted twice in one age
  // must be quoted the same. Proven on pass ML's copy: pre-K 3's lessons had turned "(e.g., ...)" into ", for example ..." four
  // times and "(receptive)" into ", receptive," twice.
  const balanced = (s, i) => { let d = 0; for (let k = i; k < s.length; k++) { if (s[k] === '(') d += 1; else if (s[k] === ')') { d -= 1; if (d === 0) return s.slice(i + 1, k); } } return null; };
  const quotesIn = (text) => { const out = [];
    for (const m of text.matchAll(/\b((?:I|II|III|IV|V|VI|VII|VIII|IX|X)\.[A-F]\.\d+(?:\.[a-z])?) \(/g)) out.push({ kind: 'tpg', code: m[1], text: balanced(text, m.index + m[0].length - 1) });
    for (const m of text.matchAll(/\b(P-[A-Z]+ \d+) \(/g)) out.push({ kind: 'goal', code: m[1], text: balanced(text, m.index + m[0].length - 1) });
    for (const m of text.matchAll(/(\d\d) to (\d\d) month progression reads "([^"]+)"/g)) { const g = [...text.slice(0, m.index).matchAll(/\b(P-[A-Z]+ \d+)\b/g)].pop(); out.push({ kind: `${m[1]}-${m[2]}`, code: g ? g[1] : null, text: m[3] }); }
    return out; };
  const norm = (t) => String(t || '').trim().replace(/^Child /, '').replace(/\.$/, '').replace(/^./, (ch) => ch.toLowerCase());
  const misquoted = []; const progressions = new Map(); let quoted = 0;
  for (const cid of REVIEWED_PREK) {
    const c = L.getCourse(cid); const rows = new Map(CURRICULUM.filter((x) => x.grade === c.grade).flatMap((x) => x.standards).map((st) => [st.code, st.text]));
    for (const m of c.modules) for (const q of (L.MODULES.find((x) => x.id === m.id).sources || []).flatMap(quotesIn)) {
      if (!q.text || !q.code) continue; quoted += 1;
      if (q.kind === 'tpg' || q.kind === 'goal') { const key = q.kind === 'tpg' ? `${c.grade}.${q.code}` : `ELOF.${q.code.replace(' ', '.')}`;
        if (rows.has(key) && norm(rows.get(key)) !== norm(q.text)) misquoted.push(`${m.id}: ${q.code} quotes "${q.text}" where its plan row reads "${rows.get(key)}"`); }
      else { const k = `${c.grade} ${q.code} ${q.kind}`; if (progressions.has(k) && progressions.get(k).text !== q.text) misquoted.push(`${m.id}: ${q.code}'s ${q.kind} month progression is quoted differently in ${progressions.get(k).mod}`); else progressions.set(k, { text: q.text, mod: m.id }); }
    }
  }
  ok('every quote in a reviewed pre-K lesson\'s citations is word for word its plan row\'s, and a progression is quoted the same everywhere in its age (pass MM)', quoted >= 150 && misquoted.length === 0, `${quoted} quotes; ${misquoted.slice(0, 4).join(' | ')}`);
  if (misquoted.length) console.log(misquoted.slice(0, 8).join('\n'));
}
// Quoted as published (pass MM): the 2022 Texas Prekindergarten Guidelines (PK3 and PK4) and the Head Start ELOF preschool goals
// and progressions are kept word for word in docs/standards/ (read by five independent readers; its README says how), and every
// quote in every pre-K lesson's citations must be their words: a Texas outcome after its code, whole; a Head Start goal after its
// code, whole; and a progression, after "month progression reads" or named by its sentences ("while its second, "..."" or "its
// first sentence, "...""), the whole cell or a run of its sentences, tied to the nearest goal before it and to the age the
// citation names (pre-K 3's 36 to 48 months and pre-K 4's 48 to 60 months when it names none). Proven on pass ML's copy: it
// fails the six pre-K 3 misquotes the plan-row check above was written for and First Sounds and Letters' four short quotes, and
// nothing else in the 219 quotes there (208 of pre-K 3 and First Steps, two of them indicators, and First Sounds and Letters' 11). An indicator quote is held to an indicators file once one is transcribed, and is listed until then.
{
  const { readFileSync: read, readdirSync } = await import('node:fs');
  const dir = new URL('../docs/standards/', import.meta.url);
  // Two editions of the Texas guidelines (pass MR): the 2022 guidelines, and the 2027 Pre-K Guidelines Review Committee's
  // recommendations, which Mikey adopted in pass MR. A citation names its edition ("Texas Prekindergarten Guidelines (2027
  // recommendations)"), and its quotes are held to that edition's file; one that names none is read as 2022's.
  const tea = { 2022: { PK3: new Map(), PK4: new Map() }, 2027: { PK3: new Map(), PK4: new Map() } }; const elof = new Map();
  for (const f of readdirSync(dir).filter((f) => /^(tea-pk[34]-(?:2022|2027)|elof-preschool)-.*\.txt$/.test(f))) {
    const grade = /^tea-pk3/.test(f) ? 'PK3' : /^tea-pk4/.test(f) ? 'PK4' : null; const ed = /^tea-pk[34]-2027-/.test(f) ? 2027 : 2022;
    for (const line of read(new URL(f, dir), 'utf8').split('\n')) { let m;
      if (grade && (m = /^([IVX]+\.[A-Z]\.\d+(?:\.[a-z])?)\t(.+)$/.exec(line))) tea[ed][grade].set(m[1], m[2]);
      else if ((m = /^(P-[A-Z]+ \d+)\t(GOAL|36-48|48-60|INDICATOR)\t(.+)$/.exec(line))) { const k = `${m[1]}|${m[2]}`; elof.set(k, m[2] === 'INDICATOR' ? [...(elof.get(k) || []), m[3]] : m[3]); } } }
  const plain = (t) => String(t || '').replace(/[\u2010\u2011]/g, '-').replace(/[\u2018\u2019]/g, "'").replace(/\s+/g, ' ').trim();
  const bare = (t) => plain(t).replace(/^Child /, '').replace(/\.$/, '');
  const balanced = (s, i) => { let d = 0; for (let k = i; k < s.length; k++) { if (s[k] === '(') d += 1; else if (s[k] === ')') { d -= 1; if (d === 0) return s.slice(i + 1, k); } } return null; };
  const runsOf = (cell) => { const s = plain(cell).split(/(?<=\.)\s+(?=[A-Z])/); const out = []; for (let i = 0; i < s.length; i += 1) for (let j = i; j < s.length; j += 1) out.push(s.slice(i, j + 1).join(' ')); return out.sort((a, b) => b.length - a.length); };
  const off = []; const waiting = []; let quotes = 0;
  const EDITION_2027 = 'Texas Prekindergarten Guidelines (2027 recommendations)';
  const check = (grade, id, src) => { const ed = src.includes(EDITION_2027) ? 2027 : 2022; const named = ed === 2027 ? 'the 2027 recommendations' : 'the 2022 guidelines';
    for (const k of src.matchAll(/\b((?:I|II|III|IV|V|VI|VII|VIII|IX|X)\.[A-F]\.\d+(?:\.[a-z])?) \(/g)) { quotes += 1; const q = balanced(src, k.index + k[0].length - 1); const t = tea[ed][grade].get(k[1]);
      if (t === undefined) off.push(`${id}: ${k[1]} is no ${grade} outcome of ${named}`); else if (bare(t) !== bare(q)) off.push(`${id}: ${k[1]} quotes "${q}" where TEA prints, in ${named}, "${t}"`); }
    for (const k of src.matchAll(/\b(P-[A-Z]+ \d+) \(/g)) { quotes += 1; const q = balanced(src, k.index + k[0].length - 1); const t = elof.get(`${k[1]}|GOAL`);
      if (t === undefined) off.push(`${id}: ${k[1]} is no Head Start preschool goal`); else if (bare(t) !== bare(q)) off.push(`${id}: ${k[1]} quotes "${q}" where Head Start prints "${t}"`); }
    for (let p = src.indexOf('"'); p >= 0; p = src.indexOf('"', p + 1)) {
      const before = src.slice(Math.max(0, p - 90), p); if (!/[A-Z]/.test(src[p + 1] || '')) continue;
      const indicator = /indicators reads $/.test(before);
      const prog = /progression(?: reads| names)?,? $|\bits (?:first|second|third|fourth|last|first two|first three)(?: sentence)?, $|it reads $/.test(before) && /progression|it reads/.test(src.slice(Math.max(0, p - 400), p));
      if (!prog && !indicator) continue;
      const head = src.slice(0, p); const g = [...head.matchAll(/\b(P-[A-Z]+ \d+)\b/g)].pop(); if (!g) { off.push(`${id}: a quoted progression with no goal before it`); continue; }
      quotes += 1;
      if (indicator) { const list = elof.get(`${g[1]}|INDICATOR`); const hit = (list || []).map(plain).find((r) => src.startsWith(r + '"', p + 1));
        if (!list) waiting.push(`${id}: an indicator of ${g[1]}`); else if (!hit) off.push(`${id}: ${g[1]}'s indicator is quoted "${src.slice(p + 1, p + 120)}..." where Head Start prints none such`); else p += hit.length + 1; continue; }
      const named = [...head.slice(g.index).matchAll(/\b(36 to 48|48 to 60) month\b/g)].pop();
      const band = named ? named[1].replace(' to ', '-') : /three-year-olds it reads $/.test(before) ? '36-48' : grade === 'PK3' ? '36-48' : '48-60';
      const cell = elof.get(`${g[1]}|${band}`); const hit = cell && runsOf(cell).find((r) => src.startsWith(r + '"', p + 1));
      if (!hit) off.push(`${id}: ${g[1]}'s ${band} month progression is quoted "${src.slice(p + 1, p + 140)}..." where Head Start prints "${cell}"`); else p += hit.length + 1; }
  };
  for (const c of L.COURSES.filter((x) => x.grade === 'PK3' || x.grade === 'PK4')) for (const m of c.modules) check(c.grade, m.id, plain((L.MODULES.find((x) => x.id === m.id).sources || []).join(' ')));
  ok(`every quote in a pre-K lesson's citations is the standard's own words as its publisher prints them, kept in docs/standards (pass MM; ${quotes} quotes)`, quotes >= 200 && tea[2022].PK3.size === 88 && tea[2022].PK4.size === 128 && tea[2027].PK3.size === 123 && tea[2027].PK4.size === 132 && off.length === 0, off.slice(0, 4).join(' | '));
  // Mikey adopted the 2027 recommendations (pass MR: "I think we should go ahead and implement the new recommendations from the
  // 2027 Pre-K Guidelines Review Committee."), so every pre-K lesson that quotes a Texas outcome names that edition.
  const old = []; for (const c of L.COURSES.filter((x) => x.grade === 'PK3' || x.grade === 'PK4')) for (const m of c.modules) { const s = (L.MODULES.find((x) => x.id === m.id).sources || []).join(' ');
    if (/\b(?:I|II|III|IV|V|VI|VII|VIII|IX|X)\.[A-F]\.\d+(?:\.[a-z])? \(/.test(s) && !s.includes(EDITION_2027)) old.push(m.id); }
  ok('every pre-K lesson that cites a Texas outcome quotes the 2027 recommendations, which Mikey adopted (pass MR)', old.length === 0, old.join(', '));
  if (off.length) console.log(off.slice(0, 8).join('\n'));
  if (waiting.length) console.log(`NOTE - Head Start indicator quotes not yet held to a transcribed text: ${waiting.length} (${waiting.join('; ')})`);
  // Near misses: the check fails a quote one word off, a code the 2022 text lacks, a progression sentence reworded and a goal
  // quoted short, and passes a progression quoted sentence by sentence.
  const before = off.length; const q = (s) => plain(s);
  check('PK4', 'near-1', q('Texas Prekindergarten Guidelines III.B.6 (identifies rhyming word)'));
  check('PK4', 'near-2', q('Texas Prekindergarten Guidelines III.B.10 (identifies rhyming words)'));
  check('PK4', 'near-3', q('Head Start ELOF Goal P-LIT 1 (demonstrates awareness that spoken language is composed of smaller segments of sound), whose 48 to 60 month progression reads "Identifies rhyming words."'));
  check('PK4', 'near-4', q('Head Start ELOF Goal P-LIT 1 (demonstrates awareness that spoken language is composed of smaller segments)'));
  const fails = off.length - before;
  const fine = off.length; check('PK3', 'near-5', q('Head Start ELOF Goal P-SCI 3 (compares and categorizes observable phenomena), in part, since the lesson teaches the first sentence of its 36 to 48 month progression, "Sorts objects into groups based on simple attributes, such as color.", while its second waits.'));
  ok('the published-words check fails a word off, a 2015 code, a reworded progression and a short goal, and passes a progression quoted by its sentences', fails === 4 && off.length === fine, `${fails} near misses failed`);
  // The edition is read too (pass MR): under the 2027 label, a 2022 code that the committee renumbered, an outcome it deleted and
  // an outcome quoted without the words it added each fail, and the renumbered code with its 2027 words passes.
  const e27 = off.length; const lab = (t) => q(`Aligned with ${EDITION_2027} ${t}`);
  check('PK4', 'near-6', lab('III.B.6 (identifies rhyming words)'));
  check('PK3', 'near-7', lab('II.E.4 (understands increasingly longer sentences that combine two ideas)'));
  check('PK3', 'near-8', lab('II.A.2 (shows understanding by following two-step verbal directions)'));
  const fails27 = off.length - e27; const fine27 = off.length; check('PK4', 'near-9', lab('III.B.5 (identifies rhyming words)'));
  ok('under the 2027 label the check fails a renumbered 2022 code, a deleted outcome and a quote missing the committee\'s words, and passes the 2027 words', fails27 === 3 && off.length === fine27, `${fails27} near misses failed`);
  off.length = before;
}
console.log(`\n${pass} passed, ${fail} failed`);
process.exitCode = fail ? 1 : 0;   // never process.exit(): it can drop the last lines of a piped stdout (2026-09-23)
