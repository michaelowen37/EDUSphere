// The rules audit and the algorithms note never drift from the code (pass LR, Mikey: "never forget"). In plain terms: it
// checks that the educator sentences listed in docs/RULES-AUDIT.md are exactly what the code writes today, that both docs
// state the review timings the code uses, and that every student-facing phrase the audit quotes is still on screen.
import { readFileSync } from 'node:fs';
import * as L from '../src/logic.mjs';
import { sentencesBlock } from '../tools/audit-sentences.mjs';
let passed = 0; let failed = 0;
const ok = (name, cond, info) => { if (cond) { passed++; console.log('PASS - ' + name); } else { failed++; console.log('FAIL - ' + name + (info ? '  ' + info : '')); } };
const audit = readFileSync(new URL('../docs/RULES-AUDIT.md', import.meta.url), 'utf8');
const algo = readFileSync(new URL('../docs/ALGORITHMS.md', import.meta.url), 'utf8');
const ui = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8');
const a = audit.indexOf('<!-- sentences:start'); const b = audit.indexOf('<!-- sentences:end -->');
ok('the rules audit lists the Quick Review sentences exactly as the code writes them (fix: node tools/audit-sentences.mjs --write)', a >= 0 && b > a && audit.slice(a, b + '<!-- sentences:end -->'.length) === sentencesBlock());
for (const [doc, name] of [[audit, 'rules audit'], [algo, 'algorithms note']]) {
  ok(`the ${name} states the first review at ${L.LIGHT_REVIEW_FIRST_DAYS} calendar days`, doc.includes(`${L.LIGHT_REVIEW_FIRST_DAYS} calendar days`));
  ok(`the ${name} states the near-pass retry at ${L.LIGHT_REVIEW_RETRY_DAYS} days`, doc.includes(`${L.LIGHT_REVIEW_RETRY_DAYS} days later`));
  ok(`the ${name} states ${L.LIGHT_REVIEWS_PER_DAY} reviews a day`, doc.includes(`LIGHT_REVIEWS_PER_DAY = ${L.LIGHT_REVIEWS_PER_DAY}`));
}
// Words a student or educator reads, quoted in the audit; each must still be in the code and in the audit.
const WORDS = [
  'First, A Quick Review', 'One More Quick Review', "Five quick review questions from a module you've mastered long ago.", 'Your lessons come right after!',
  'That one is yours to keep!', 'We will look back at it once more soon.', "It's open again on your list so you can go back through it any time.",
  "You've mastered this once before but one of your reviews prompted a refresher.", 'You moved on from this one for now. It will come back later for a fresh try.',
  'A question from an earlier module', 'Practice Reviews are impromptu quizzes that appear weeks after a student masters a concept.',
  'Review quizzes are capped at two per day and students will never see a PASS or FAIL.', 'Move Forward',
];
// The four Wonder voices (pass LY, Mikey's words): each name and label is in the code and in the rules audit.
{
  const logic = readFileSync(new URL('../src/logic.mjs', import.meta.url), 'utf8');
  for (const w of ["name: 'Frederick', role: 'The Scientist'", "name: 'Chloe', role: 'The Artist'", "name: 'Georgette', role: 'The Grandparent of Faith'", "name: 'Mike', role: 'The Skeptic'"]) {
    const [, n, r] = w.match(/name: '(.*)', role: '(.*)'/);
    ok(`the Wonder voice ${n}, ${r}, is in the code and in the rules audit`, logic.includes(w) && audit.includes(`${n} (${r})`));
  }
}
// Every part of the start-chat doc has a check (pass LZ, Mikey: can every main item on it be delegated to a separate agent?):
// each section of docs/NEW-CHAT.md has a row in the map in docs/INDEPENDENT-CHECKS.md, every row names a check, and every
// check named has its brief there, so a section added to NEW-CHAT without a check, or a check without a brief, fails here.
{
  const newChat = readFileSync(new URL('../docs/NEW-CHAT.md', import.meta.url), 'utf8');
  const checks = readFileSync(new URL('../docs/INDEPENDENT-CHECKS.md', import.meta.url), 'utf8');
  const sections = [...newChat.matchAll(/^## (.+)$/gm)].map((m) => m[1].replace(/\s*\([^)]*\)$/, '').trim());
  const at = checks.indexOf('## Who checks each part of NEW-CHAT');
  const map = at < 0 ? '' : checks.slice(at, checks.indexOf('\n## ', at + 5));
  const rows = [...map.matchAll(/^\| ([^|]+?) \| ([^|]+?) \|$/gm)].map((m) => [m[1].trim(), m[2]]).filter(([name]) => name !== 'NEW-CHAT section');
  const unmapped = sections.filter((s) => !rows.some(([name]) => name === s));
  ok('every section of NEW-CHAT has a row in the checks map (docs/INDEPENDENT-CHECKS.md)', sections.length >= 10 && unmapped.length === 0, unmapped.join('; '));
  const NAMES = /[Tt]he (story flow brief|story brief|picture brief|screen brief|lesson brief|Wonder brief|game brief|code brief|accuracy check|alignment read|final read)/g;
  const bare = rows.filter(([, who]) => [...who.matchAll(NAMES)].length === 0).map(([name]) => name);
  const named = new Set(rows.flatMap(([, who]) => [...who.matchAll(NAMES)].map((m) => m[1])));
  const missing = [...named].filter((n) => !new RegExp(`^## The ${n}$`, 'm').test(checks));
  ok('every row of the checks map names a check, and every check it names has its brief', named.size >= 8 && bare.length === 0 && missing.length === 0, [...bare, ...missing].join('; '));
}
for (const w of WORDS) ok(`on screen and in the rules audit: "${w}"`, ui.includes(w) && audit.includes(w), (ui.includes(w) ? '' : 'missing from src/ui.jsx; ') + (audit.includes(w) ? '' : 'missing from the rules audit'));
// Mikey's words that logic writes for the educator (pass MB): each is in src/logic.mjs and quoted in the rules audit.
{
  const logic = readFileSync(new URL('../src/logic.mjs', import.meta.url), 'utf8');
  for (const w of ['Guessing, low confidence, multiple failed attempts and unusually slow progression pushes a student higher up the list.',
    'Game breaks taken: ', "Playing is still learning as concepts are woven into objectives but these are never marked on a student's transcript.",
    'Elective stories: ', 'Every module pairs with a short story and every course with a long.', "After these stories unlock, they're available to re-read.",
    'has read through a story more times than required.']) ok(`in the code and in the rules audit: "${w.trim()}"`, logic.includes(w) && audit.includes(w.trim()), (logic.includes(w) ? '' : 'missing from src/logic.mjs; ') + (audit.includes(w.trim()) ? '' : 'missing from the rules audit'));
}
// What each pass learned (Mikey, pass MB: "For each pass we do, if you learn anything new that should be remembered forever,
// please update the documentation, agent tasks, tests etc for future passes and let me know what changed."): the newest entry
// in docs/DECISIONS.md, from pass MB on, carries a bullet starting "For future passes" that names what changed.
{
  const dec = readFileSync(new URL('../docs/DECISIONS.md', import.meta.url), 'utf8');
  const heads = [...dec.matchAll(/^## (\d{4}-\d{2}-\d{2})[^\n]*$/gm)];
  const last = heads[heads.length - 1];
  const code = last ? ((last[0].match(/\(pass ([A-Z]{2})\)/) || [])[1] || '') : '';
  const end = last ? dec.indexOf('\n## ', last.index + 5) : -1;
  const body = last ? dec.slice(last.index, end < 0 ? dec.length : end) : '';
  ok(`the newest dated DECISIONS entry names its pass (pass ${code || '?'})`, !!code, last ? last[0].slice(0, 80) : 'no dated entry');
  ok(`the newest DECISIONS entry (pass ${code || '?'}) says what changed for future passes`, !!code && (code < 'MB' || /^- For future passes\b/m.test(body)), 'add a bullet "- For future passes: ..." naming the docs, briefs, tests and tools this pass changed, or saying nothing new');
}
// Numbered questions for Mikey (pass MD, his words: "Maybe just give them a number so I can say 1. Answer.  2. Answer"): every
// open question in docs/RULES-AUDIT.md section 11 carries Q<n> once, the numbers run from Q1 with none missing (a number is
// never reused or renumbered, and an answered one keeps its number), and docs/NEW-CHAT.md's short list names only numbers
// section 11 has, each once, with every open one of section 11 either listed or named as answered.
{
  const newChat = readFileSync(new URL('../docs/NEW-CHAT.md', import.meta.url), 'utf8');
  const s = audit.indexOf('## 11. Open items that need Mikey'); const e = audit.indexOf('\n## ', s + 5);
  const sec = audit.slice(s, e < 0 ? audit.length : e);
  const nums = [...sec.matchAll(/^- Q(\d+)\. /gm)].map((m) => Number(m[1]));
  const dup = nums.filter((n, i) => nums.indexOf(n) !== i);
  const gaps = nums.length ? Array.from({ length: Math.max(...nums) }, (_, i) => i + 1).filter((n) => !nums.includes(n)) : [1];
  ok('every open question in the rules audit carries one number, from Q1 up with none missing or repeated', nums.length >= 16 && dup.length === 0 && gaps.length === 0, `repeated ${dup.join(',')} missing ${gaps.join(',')}`);
  const q = newChat.indexOf('## Questions for Mikey'); const qe = newChat.indexOf('\n## ', q + 5);
  const list = newChat.slice(q, qe < 0 ? newChat.length : qe);
  const listed = [...list.matchAll(/^- Q(\d+)\. /gm)].map((m) => Number(m[1]));
  const answeredLine = (list.match(/^Answered: (.*)$/m) || [])[1] || '';
  const answered = [...answeredLine.matchAll(/Q(\d+)/g)].map((m) => Number(m[1]));
  const unknown = [...listed, ...answered].filter((n) => !nums.includes(n));
  const twice = listed.filter((n, i) => listed.indexOf(n) !== i || answered.includes(n));
  const dropped = nums.filter((n) => !listed.includes(n) && !answered.includes(n));
  ok("NEW-CHAT's short list names each of the rules audit's questions once, as open or as answered", unknown.length === 0 && twice.length === 0 && dropped.length === 0, `unknown ${unknown.join(',')} twice ${twice.join(',')} dropped ${dropped.join(',')}`);
  const answeredOpen = answered.filter((n) => !new RegExp(`^- Q${n}\\. Answered in pass`, 'm').test(sec));
  ok('a question NEW-CHAT calls answered carries its answer in the rules audit', answeredOpen.length === 0, answeredOpen.join(','));
}
// An answered question is never called open again (pass MI, the alignment read: Q27, Q30, Q31 and Q32 were answered while
// docs, comments and tests still said Q30 was waiting on Mikey or the light theme kept its gold until Q32 was settled, which a
// new chat would believe). Every doc but
// DECISIONS (history) and RULES-AUDIT section 11 (the questions themselves), the README, the skills and agents, and src, tests and tools are read. CLAUDE.md keeps
// its lines as written (they change only with Mikey's approval), so a later line there settles them, and it is left out.
{ const { readdirSync } = await import('node:fs');
  const s11 = audit.indexOf('## 11. Open items that need Mikey'); const e11 = audit.indexOf('\n## ', s11 + 5);
  const answeredNums = new Set([...audit.slice(s11, e11 < 0 ? audit.length : e11).matchAll(/^- Q(\d+)\. Answered in pass/gm)].map((m) => Number(m[1])));
  const files = [];
  // Since the second read of the late fixes: every doc but DECISIONS, the README, and the skills' and agents' briefs too.
  for (const [dir, ext] of [['../docs/', '.md'], ['../src/', ''], ['../tools/', '.mjs'], ['./', '.mjs'], ['./e2e/', '.mjs'], ['../.claude/agents/', '.md']]) {
    for (const f of readdirSync(new URL(dir, import.meta.url))) if (f.endsWith(ext) && f !== 'DECISIONS.md' && !/\.(csv|json|png|svg)$/.test(f) && (ext || /\.(mjs|jsx)$/.test(f))) files.push(new URL(dir + f, import.meta.url));
  }
  files.push(new URL('../README.md', import.meta.url));
  for (const d of readdirSync(new URL('../.claude/skills/', import.meta.url))) { try { files.push(...readdirSync(new URL(`../.claude/skills/${d}/`, import.meta.url)).filter((f) => f.endsWith('.md')).map((f) => new URL(`../.claude/skills/${d}/${f}`, import.meta.url))); } catch (e) { /* a file, not a folder */ } }
  const stale = [];
  for (const u of files) {
    let t = readFileSync(u, 'utf8'); if (u.pathname.endsWith('RULES-AUDIT.md')) t = t.slice(0, s11) + t.slice(e11 < 0 ? t.length : e11);
    // The phrasings a stale line has taken so far; when another turns up, it joins this list (the second read found the last two).
    for (const m of t.matchAll(/\(?Q(\d+) asks\b|until (?:Mikey )?answers Q(\d+)|until Q(\d+) is answered|waiting (?:on|for) Q(\d+)|(?:keeps its look|is frozen|still does[^.;,]{0,30}),? \(?Q(\d+)\b/g)) { const n = Number(m[1] || m[2] || m[3] || m[4] || m[5]); if (answeredNums.has(n)) stale.push(`${u.pathname.split('/').slice(-2).join('/')}: ${m[0]}`); }
  }
  ok('no doc, source, test or tool still calls an answered question open', answeredNums.size >= 30 && stale.length === 0, stale.slice(0, 8).join('; '));
}
// The pictures the browser tests write beside the page (tests/e2e/art; pass MF, the code check and the alignment read) never
// ship: .gitignore, both zip tools and the delivery command in NEW-CHAT leave the folder out, and the command leaves a checkpoint
// folder out too, since a killed walk can leave the folder behind and the updater stops on a file it does not expect.
{
  const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
  const gi = read('.gitignore'); const cz = read('tools/changes-zip.sh'); const cp = read('tools/checkpoint.sh'); const nc = read('docs/NEW-CHAT.md');
  const d = nc.indexOf('## How a pass is delivered'); const del = d < 0 ? '' : nc.slice(d, nc.indexOf('\n## ', d + 5) < 0 ? nc.length : nc.indexOf('\n## ', d + 5));
  const xs = (t, q) => ((t.match(new RegExp(`zip -qr .+? \\. -x((?: ${q}[^${q}\\n]+${q})+)`)) || [])[1] || '');   // the -x list alone, never a comment or prose
  ok("the browser tests' picture folder is left out of git and of every zip, and the delivery command leaves the checkpoint folder out (pass MF)", /^tests\/e2e\/art\/$/m.test(gi) && xs(cz, '"').includes('"tests/e2e/art/*"') && xs(cz, '"').includes('"CHECKPOINT/*"') && xs(cp, '"').includes('"tests/e2e/art/*"') && xs(del, "'").includes("'tests/e2e/art/*'") && xs(del, "'").includes("'CHECKPOINT/*'"));
}
console.log(`\n${passed} passed, ${failed} failed`);
process.exitCode = failed ? 1 : 0;   // never process.exit(): it can drop the last lines of a piped stdout (CLAUDE.md, 2026-09-23)
