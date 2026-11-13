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
  // And the other way (pass MS: Q73 to Q76 were answered in the rules audit while NEW-CHAT's short list still listed them as open, and
  // every check passed): a question NEW-CHAT lists as open is open in the rules audit, not answered there.
  const answeredIn = (s, ls = listed) => ls.filter((n) => new RegExp(`^- Q${n}\\. Answered in pass`, 'm').test(s));
  const listedAnswered = answeredIn(sec);
  // Near miss (round three's code read: the check ran none): the rules audit with the first open question answered there, as Q73 to
  // Q76 were while NEW-CHAT still listed them. With no question open, the near miss plants one of its own, so a pass that leaves none
  // open still proves the check (pass MU: these two near misses needed an open question, so a pass with none would have failed).
  const firstOpen = listed.length ? listed[0] : Math.max(0, ...nums) + 1; const base = listed.length ? sec : `${sec}\n- Q${firstOpen}. A question planted for the near miss.`;
  const planted = base.replace(new RegExp(`^- Q${firstOpen}\\. `, 'm'), `- Q${firstOpen}. Answered in pass ZZ. `);
  const plantCaught = answeredIn(planted, listed.length ? listed : [firstOpen]).includes(firstOpen);
  ok('a question NEW-CHAT lists as open is still open in the rules audit (pass MS; the near miss caught)', listedAnswered.length === 0 && plantCaught, listedAnswered.join(','));
  // Every open question is named in When to start the next new chat too, where Mikey reads which answers to send (pass MS, round
  // four's docs read: Q79 was left out there and in the commit message, the second time after pass MO's round five left out Q58). A
  // range ("Q77 to Q79") names every number in it. Near miss: the section with Q79 dropped.
  const covered = (s) => { const out = new Set(); for (const m of s.matchAll(/Q(\d+) to Q(\d+)/g)) for (let n = Number(m[1]); n <= Number(m[2]); n++) out.add(n); for (const m of s.matchAll(/Q(\d+)/g)) out.add(Number(m[1])); return out; };
  const w = newChat.indexOf('## When to start the next new chat'); const when = w < 0 ? '' : newChat.slice(w, (newChat.indexOf('\n## ', w + 5) + 1 || newChat.length + 1) - 1);
  const unnamed = (s, ls = listed) => ls.filter((n) => !covered(s).has(n));
  // With no question open, the near miss plants one named in the section and then drops it (pass MU, as above).
  const last = listed.length ? Math.max(...listed) : Math.max(0, ...nums) + 1; const whenOpen = listed.length ? when : `${when} (Q${last})`; const openNow = listed.length ? listed : [last];
  const withoutLast = whenOpen.split(`Q${last}`).join('Q0').replace(new RegExp(`Q(\\d+) to Q0`, 'g'), 'Q$1');
  ok('every open question is named in When to start the next new chat, ranges counted (pass MS; the near miss caught)', when.length > 100 && unnamed(when).length === 0 && unnamed(whenOpen, openNow).length === 0 && unnamed(withoutLast, openNow).includes(last), unnamed(when).join(','));
}
// An answered question is never called open again (pass MI, the alignment read: Q27, Q30, Q31 and Q32 were answered while
// docs, comments and tests still said Q30 was waiting on Mikey or the light theme kept its gold until Q32 was settled, which a
// new chat would believe). Every doc but
// DECISIONS (history) and RULES-AUDIT section 11 (the questions themselves), the README, the skills and agents, and src, tests and tools are read. Until pass MM
// CLAUDE.md was left out, since its old lines stood beside the later lines that settled them; since pass MM it is the short manual
// and is read, and its old lines live in docs/CLAUDE-HISTORY.md, which is left out like DECISIONS (and docs/NEW-CHAT-HISTORY.md).
{ const { readdirSync } = await import('node:fs');
  const s11 = audit.indexOf('## 11. Open items that need Mikey'); const e11 = audit.indexOf('\n## ', s11 + 5);
  const answeredNums = new Set([...audit.slice(s11, e11 < 0 ? audit.length : e11).matchAll(/^- Q(\d+)\. Answered in pass/gm)].map((m) => Number(m[1])));
  const files = [];
  // Since the second read of the late fixes: every doc but DECISIONS, the README, and the skills' and agents' briefs too.
  for (const [dir, ext] of [['../docs/', '.md'], ['../src/', ''], ['../tools/', '.mjs'], ['./', '.mjs'], ['./e2e/', '.mjs'], ['../.claude/agents/', '.md']]) {
    for (const f of readdirSync(new URL(dir, import.meta.url))) if (f.endsWith(ext) && !['DECISIONS.md', 'CLAUDE-HISTORY.md', 'NEW-CHAT-HISTORY.md', 'RULES-AUDIT-HISTORY.md'].includes(f) && !/\.(csv|json|png|svg)$/.test(f) && (ext || /\.(mjs|jsx)$/.test(f))) files.push(new URL(dir + f, import.meta.url));
  }
  files.push(new URL('../README.md', import.meta.url));
  // Since pass MM CLAUDE.md is the short manual with no replaced lines, so it is read too; its old lines live in the history. Since
  // pass MS its second part too.
  files.push(new URL('../CLAUDE.md', import.meta.url)); files.push(new URL('../CLAUDE-PART-2.md', import.meta.url)); files.push(new URL('../CLAUDE-PART-3.md', import.meta.url));   // part three since pass NG
  for (const d of readdirSync(new URL('../.claude/skills/', import.meta.url))) { try { files.push(...readdirSync(new URL(`../.claude/skills/${d}/`, import.meta.url)).filter((f) => f.endsWith('.md')).map((f) => new URL(`../.claude/skills/${d}/${f}`, import.meta.url))); } catch (e) { /* a file, not a folder */ } }
  const stale = [];
  for (const u of files) {
    let t = readFileSync(u, 'utf8'); if (u.pathname.endsWith('RULES-AUDIT.md')) t = t.slice(0, s11) + t.slice(e11 < 0 ? t.length : e11);
    // The phrasings a stale line has taken so far; when another turns up, it joins this list (the second read found the last two).
    for (const m of t.matchAll(/\(?Q(\d+) asks\b|until (?:Mikey )?answers Q(\d+)|until Q(\d+) is answered|waiting (?:on|for) Q(\d+)|(?:keeps its look|is frozen|still does[^.;,]{0,30}),? \(?Q(\d+)\b/g)) { const n = Number(m[1] || m[2] || m[3] || m[4] || m[5]); if (answeredNums.has(n)) stale.push(`${u.pathname.split('/').slice(-2).join('/')}: ${m[0]}`); }
  }
  ok('no doc, source, test or tool still calls an answered question open', answeredNums.size >= 30 && stale.length === 0, stale.slice(0, 8).join('; '));
}
// The answered questions' history (pass MN, Mikey's answer to Q52, "Q52 - B"): every answered question of section 11 moved word
// for word to docs/RULES-AUDIT-HISTORY.md, whose text between its markers must hash to the digest below, so nothing moved can be
// lost or edited; section 11 keeps one line for each answered question (its number, Mikey's answer word for word and where its
// rule now lives, never the question as it stood), and every answered number there has its full text in the history.
{
  const { createHash } = await import('node:crypto');
  const hist = readFileSync(new URL('../docs/RULES-AUDIT-HISTORY.md', import.meta.url), 'utf8');
  const open = "<!-- RULES-AUDIT section 11's answered questions through pass MN, word for word: begin -->\n"; const a = hist.indexOf(open); const b = hist.indexOf("<!-- RULES-AUDIT section 11's answered questions through pass MN, word for word: end -->");
  const block = a >= 0 && b > a ? hist.slice(a + open.length, b) : '';
  ok('docs/RULES-AUDIT-HISTORY.md keeps the answered questions section 11 held through pass MN, every line unchanged (pass MN)', createHash('sha256').update(block, 'utf8').digest('hex') === '686371a5c62de1a76bbb7a0350d2a465d657f4c27f38d3582fc159064f09c781');
  // A question answered in a later pass moves in a block of its own, held by a digest of its own (pass MO: Q54), so no earlier
  // block's digest ever changes; a question answered later in the same pass joins that pass's block (pass MO: Q59), whose digest
  // changes with it before the pass is delivered.
  { const o = "<!-- RULES-AUDIT section 11's answered questions in pass MO, word for word: begin -->\n"; const ia = hist.indexOf(o); const ib = hist.indexOf("<!-- RULES-AUDIT section 11's answered questions in pass MO, word for word: end -->");
    const mo = ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : '';
    ok('docs/RULES-AUDIT-HISTORY.md keeps the questions answered in pass MO, every line unchanged (pass MO)', createHash('sha256').update(mo, 'utf8').digest('hex') === '02d8bf566576d5c8f52c6785ccc6b4d0902e5d94b4e3b18a7fd9409ee8e625e8'); }
  // An open question whose text a pass brought up to date keeps its old text word for word in a block of its own (pass MO, round
  // five's record read: Q51 as pass MN left it).
  { const o = "<!-- RULES-AUDIT section 11's open questions as pass MN left them, before pass MO brought them up to date, word for word: begin -->\n"; const ia = hist.indexOf(o); const ib = hist.indexOf("<!-- RULES-AUDIT section 11's open questions as pass MN left them, before pass MO brought them up to date, word for word: end -->");
    const kept = ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : '';
    ok("docs/RULES-AUDIT-HISTORY.md keeps Q51's text as pass MN left it, every word unchanged (pass MO)", /^- Q51\. /.test(kept) && createHash('sha256').update(kept, 'utf8').digest('hex') === 'b79d27373188850e802c1ea71ae68d36df437d42f5834a6e9185c305fb1d7531'); }
  // Pass MP's two blocks, each held the same way: the four questions Mikey answered in this pass (Q55 to Q58, "Q55 - A" and the
  // rest), and Q51 as pass MO left it, before this pass brought it up to date from his notes on the voice check page's rows.
  { const o = "<!-- RULES-AUDIT section 11's answered questions in pass MP, word for word: begin -->\n"; const ia = hist.indexOf(o); const ib = hist.indexOf("<!-- RULES-AUDIT section 11's answered questions in pass MP, word for word: end -->");
    const mp = ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : '';
    ok('docs/RULES-AUDIT-HISTORY.md keeps the questions answered in pass MP, every line unchanged (pass MP)', createHash('sha256').update(mp, 'utf8').digest('hex') === '923f9d82ee03ea7eed025a9cdd665a2bfd06650cf21698745edfbff80275dc02'); }
  { const o = "<!-- RULES-AUDIT section 11's open questions as pass MO left them, before pass MP brought them up to date, word for word: begin -->\n"; const ia = hist.indexOf(o); const ib = hist.indexOf("<!-- RULES-AUDIT section 11's open questions as pass MO left them, before pass MP brought them up to date, word for word: end -->");
    const kept = ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : '';
    ok("docs/RULES-AUDIT-HISTORY.md keeps Q51's text as pass MO left it, every word unchanged (pass MP)", /^- Q51\. /.test(kept) && createHash('sha256').update(kept, 'utf8').digest('hex') === 'b14f547e0a7f097fec22f1b966fc0da91e26026394059283152cc9b217de3e81'); }
  // Pass MQ's block, held the same way: Q51, which Mikey closed for now ("We can close question 51 for now since it won't be
  // relevant in our refinements until later."), and Q60 to Q66, which he answered ("Q60 - B" and the rest).
  { const o = "<!-- RULES-AUDIT section 11's answered questions in pass MQ, word for word: begin -->\n"; const ia = hist.indexOf(o); const ib = hist.indexOf("<!-- RULES-AUDIT section 11's answered questions in pass MQ, word for word: end -->");
    const mq = ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : '';
    ok('docs/RULES-AUDIT-HISTORY.md keeps the questions answered in pass MQ, every line unchanged (pass MQ)', createHash('sha256').update(mq, 'utf8').digest('hex') === '95c8f25f2c29d249d0c0c1efc3e2d27188b91498ccfed1e67af945a3751e1607'); }
  // Pass MR's block, held the same way: Q67 to Q72, which Mikey answered when he opened the pass ("Q67 - B but let's make it fun."
  // and the rest).
  { const o = "<!-- RULES-AUDIT section 11's answered questions in pass MR, word for word: begin -->\n"; const ia = hist.indexOf(o); const ib = hist.indexOf("<!-- RULES-AUDIT section 11's answered questions in pass MR, word for word: end -->");
    const mr = ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : '';
    ok('docs/RULES-AUDIT-HISTORY.md keeps the questions answered in pass MR, every line unchanged (pass MR)', createHash('sha256').update(mr, 'utf8').digest('hex') === '66ffc4e597d5ca471591175bf1e4d37d2452c636ee55e4ca86f17245637808e5'); }
  // Pass MS's two blocks, held the same way: Q73 to Q76, which Mikey answered when he opened the pass ("Q73 - A" and the rest), and
  // the say-along row as pass MR left it, which his note on Q67 rewrote (one word in many silly voices), since a row a pass replaces
  // at his word keeps its old text word for word, as an answered question does.
  { const o = "<!-- RULES-AUDIT section 11's answered questions in pass MS, word for word: begin -->\n"; const ia = hist.indexOf(o); const ib = hist.indexOf("<!-- RULES-AUDIT section 11's answered questions in pass MS, word for word: end -->");
    const ms = ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : '';
    ok('docs/RULES-AUDIT-HISTORY.md keeps the questions answered in pass MS, every line unchanged (pass MS)', createHash('sha256').update(ms, 'utf8').digest('hex') === '33431e02df2fb328b1c94aa9fec2d5b74ba46a4f065537a0ccd334e7b77dbcdd'); }
  { const o = '<!-- RULES-AUDIT rows as pass MR left them, before pass MS replaced them, word for word: begin -->\n'; const ia = hist.indexOf(o); const ib = hist.indexOf('<!-- RULES-AUDIT rows as pass MR left them, before pass MS replaced them, word for word: end -->');
    const kept = ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : '';
    ok("docs/RULES-AUDIT-HISTORY.md keeps the say-along row as pass MR left it, every word unchanged, and the audit points to it (pass MS)", /^\| \*\*Say it with me \(Mikey, pass MR, Q67:/.test(kept) && createHash('sha256').update(kept, 'utf8').digest('hex') === 'cfc2a55a4ecbbbc7d3d275e2f6815f2cd12bd01463cef7386d47c94c0e381528' && audit.includes('The row as pass MR left it is kept word for word in docs/RULES-AUDIT-HISTORY.md')); }
  // Pass MT's two blocks, held the same way: Q77 to Q79, which Mikey answered when he opened the pass, and the say-along and plans
  // rows as pass MS left them, which his answers to Q77 and Q78 rewrote.
  { const o = "<!-- RULES-AUDIT section 11's answered questions in pass MT, word for word: begin -->\n"; const ia = hist.indexOf(o); const ib = hist.indexOf("<!-- RULES-AUDIT section 11's answered questions in pass MT, word for word: end -->");
    const mt = ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : '';
    ok('docs/RULES-AUDIT-HISTORY.md keeps the questions answered in pass MT, every line unchanged (pass MT)', createHash('sha256').update(mt, 'utf8').digest('hex') === '2c359185feb8004eaa8483a833158eca51497c1e621f4c5e99beb576c1a5f3d5'); }
  { const o = '<!-- RULES-AUDIT rows as pass MS left them, before pass MT replaced them, word for word: begin -->\n'; const ia = hist.indexOf(o); const ib = hist.indexOf('<!-- RULES-AUDIT rows as pass MS left them, before pass MT replaced them, word for word: end -->');
    const kept = ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : '';
    ok("docs/RULES-AUDIT-HISTORY.md keeps the say-along and plans rows as pass MS left them, every word unchanged, and the audit points to them (pass MT)", /^\| \*\*Say it with me, one word in many silly voices \(Mikey, pass MR, Q67:/.test(kept) && createHash('sha256').update(kept, 'utf8').digest('hex') === 'bad8804a3672a9aa8c7565a17fdbcfac9b63b541dd8d8fb0c6242afb503301e5' && audit.includes('The row as pass MR left it is kept word for word in docs/RULES-AUDIT-HISTORY.md, and the row as pass MS left it beside it') && audit.includes('The row as pass MS left it is kept word for word in docs/RULES-AUDIT-HISTORY.md')); }
  // Pass MU's two blocks, held the same way: Q80 and Q81, which Mikey answered when he opened the pass, and the say-along row as pass
  // MT left it, which his answer to Q81 and his notes on the cheer's sounds rewrote.
  { const o = "<!-- RULES-AUDIT section 11's answered questions in pass MU, word for word: begin -->\n"; const ia = hist.indexOf(o); const ib = hist.indexOf("<!-- RULES-AUDIT section 11's answered questions in pass MU, word for word: end -->");
    const mu = ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : '';
    ok('docs/RULES-AUDIT-HISTORY.md keeps the questions answered in pass MU, every line unchanged (pass MU)', createHash('sha256').update(mu, 'utf8').digest('hex') === '15e00d579bab05282a62156c80997194fd4d20dbcdafcb64bc57311e232f33fe'); }
  { const o = '<!-- RULES-AUDIT rows as pass MT left them, before pass MU replaced them, word for word: begin -->\n'; const ia = hist.indexOf(o); const ib = hist.indexOf('<!-- RULES-AUDIT rows as pass MT left them, before pass MU replaced them, word for word: end -->');
    const kept = ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : '';
    ok("docs/RULES-AUDIT-HISTORY.md keeps the say-along row as pass MT left it, every word unchanged, and the audit points to it (pass MU)", /^\| \*\*Say it together, one word in five silly ways \(Mikey, pass MR, Q67:/.test(kept) && createHash('sha256').update(kept, 'utf8').digest('hex') === 'dcb4cd30b352f8e23036a5166dba9d2284f24f4dd5432b67a6a72ae036256850' && audit.includes('and the row as pass MS left it beside it, and the row as pass MT left it after them')); }
  // Pass MV's block, held the same way: Q82, which Mikey answered when he opened the pass ("Q82: A").
  { const o = "<!-- RULES-AUDIT section 11's answered questions in pass MV, word for word: begin -->\n"; const ia = hist.indexOf(o); const ib = hist.indexOf("<!-- RULES-AUDIT section 11's answered questions in pass MV, word for word: end -->");
    const mv = ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : '';
    ok('docs/RULES-AUDIT-HISTORY.md keeps the questions answered in pass MV, every line unchanged (pass MV)', createHash('sha256').update(mv, 'utf8').digest('hex') === 'a9b3dfb1a73744b37213df50f5be34ab668687140b9627e17c621ca682b01a8c'); }
  // Pass MX's block, held the same way: Q83, which Mikey answered when he opened the pass ("Q83 - A (I want the correct form and don't
  // want to make it confusing)").
  { const o = "<!-- RULES-AUDIT section 11's answered questions in pass MX, word for word: begin -->\n"; const ia = hist.indexOf(o); const ib = hist.indexOf("<!-- RULES-AUDIT section 11's answered questions in pass MX, word for word: end -->");
    const mx = ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : '';
    ok('docs/RULES-AUDIT-HISTORY.md keeps the questions answered in pass MX, every line unchanged (pass MX)', /^- Q83\. Answered in pass MX/.test(mx) && createHash('sha256').update(mx, 'utf8').digest('hex') === 'b16346ddea22771bc5be40c81560590243c504ea7636bca653b82c6de9473e0b'); }
  // Pass MZ's block, held the same way: Q84 and Q85, which Mikey answered when he opened the pass ("Q84 - B", "Q85 - B"); its digest
  // taken again once round two's final read corrected the answers' counts before delivery.
  { const o = "<!-- RULES-AUDIT section 11's answered questions in pass MZ, word for word: begin -->\n"; const ia = hist.indexOf(o); const ib = hist.indexOf("<!-- RULES-AUDIT section 11's answered questions in pass MZ, word for word: end -->");
    const mz = ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : '';
    ok('docs/RULES-AUDIT-HISTORY.md keeps the questions answered in pass MZ, every line unchanged (pass MZ)', /^- Q84\. Answered in pass MZ/.test(mz) && /\n- Q85\. Answered in pass MZ/.test(mz) && createHash('sha256').update(mz, 'utf8').digest('hex') === '6530d2b2677542d6c1e485bb0030fc8123f4654942062cb3a223d6fa74d33555'); }
  // The rows Q85 lets a pass correct in place (pass MZ, Mikey's answer: "Q85 - B"): their words as pass MY left them, held by their digest,
  // and each corrected row says where those words are, so a correction never loses a word and never passes as the old rule.
  { const o = '<!-- RULES-AUDIT rows as pass MY left them, before pass MZ corrected them in place, word for word: begin -->\n'; const ia = hist.indexOf(o); const ib = hist.indexOf('<!-- RULES-AUDIT rows as pass MY left them, before pass MZ corrected them in place, word for word: end -->');
    const kept = ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : '';
    const said = (audit.match(/Corrected in place in pass MZ \(Mikey's answer to Q85\)/g) || []).length;
    ok("docs/RULES-AUDIT-HISTORY.md keeps the rows pass MZ corrected in place as pass MY left them, each corrected row says so, and section 9's row for Q85 names them (pass MZ, Q85 (b))", /^\| A round is five core questions \(settable\)/.test(kept) && kept.includes('the extra question') && said >= 4 && audit.includes('| **A row of this file that no longer says what the code does is corrected in place (Mikey, pass MZ') && createHash('sha256').update(kept, 'utf8').digest('hex') === '020513500236768c9ca304832d145ce75ecddf983328e9fed1c5da1a14362dab', `${said} rows say so`); }
  // Pass NA's two blocks, held the same way: Q86 and Q87, which Mikey answered when he opened the pass ("Q86 - yes, B", "Q87 - A"), and
  // the vision's sentences and the rows its answers corrected in place, as pass MZ left them.
  { const o = "<!-- RULES-AUDIT section 11's answered questions in pass NA, word for word: begin -->\n"; const ia = hist.indexOf(o); const ib = hist.indexOf("<!-- RULES-AUDIT section 11's answered questions in pass NA, word for word: end -->");
    const na = ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : '';
    ok('docs/RULES-AUDIT-HISTORY.md keeps the questions answered in pass NA, every line unchanged (pass NA)', /^- Q86\. Answered in pass NA/.test(na) && /\n- Q87\. Answered in pass NA/.test(na) && createHash('sha256').update(na, 'utf8').digest('hex') === '46be2b4ef230bbcf873b4f7fd6981994d5b5ff4ee776cfab081f027bf67efe92'); }
  { const o = '<!-- docs/VISION.md and RULES-AUDIT rows as pass MZ left them, before pass NA corrected them in place, word for word: begin -->\n'; const ia = hist.indexOf(o); const ib = hist.indexOf('<!-- docs/VISION.md and RULES-AUDIT rows as pass MZ left them, before pass NA corrected them in place, word for word: end -->');
    const kept = ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : '';
    ok("docs/RULES-AUDIT-HISTORY.md keeps the vision's sentences and the rows pass NA corrected in place as pass MZ left them, and section 9's row for Q86 names them (pass NA, Q86 (b))", /^- \*\*Master, then move\.\*\* A module opens only when everything it needs is mastered\./.test(kept) && kept.includes('asks whether to add a second way in') && audit.includes('| **The vision says what the app does (Mikey, pass NA, his answer to Q86') && createHash('sha256').update(kept, 'utf8').digest('hex') === 'db7f31d62e1ac33032c6df9bd2c07240f63b6d26bb4258fdc4beb2f1dbd7f532'); }
  // Pass NC's block, held the same way: section 8's two rows it corrected in place under Q85 (b), as pass NB left them, and each
  // corrected row saying so.
  { const o = '<!-- RULES-AUDIT rows as pass NB left them, before pass NC corrected them in place, word for word: begin -->\n'; const ia = hist.indexOf(o); const ib = hist.indexOf('<!-- RULES-AUDIT rows as pass NB left them, before pass NC corrected them in place, word for word: end -->');
    const kept = ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : '';
    const said = (audit.match(/Corrected in place in pass NC \(Mikey's answer to Q85\)/g) || []).length;
    ok("docs/RULES-AUDIT-HISTORY.md keeps the four rows pass NC corrected in place as pass NB left them (section 8's two, section 6's short breaths and section 7's twins), each corrected row says so, and section 9's row for Q85 names them (pass NC, Q85 (b))", /^\| \*\*Lines wrap balanced, and the Wonder answers stack on a narrow phone/.test(kept) && kept.includes('a browser check waits (EARMARKS A76 and A82)') && kept.includes('The app\'s sounds in short breaths') && kept.includes('A twin still open is named (pass MK') && said >= 4 && audit.includes('Corrected in pass NC, each read against the code: section 8') && audit.includes("and section 7's row on a twin still open") && createHash('sha256').update(kept, 'utf8').digest('hex') === '25c405a9d383bddebe52a5199031ef1fa7e7a090e77f0c0f5ecb0bdd54d256af', `${said} rows say so`); }
  // Pass ND's two blocks, held the same way: Q88, which Mikey answered when he opened the pass ("Q88 - A"), and the three rows his answer
  // let pass ND correct in place under Q85 (b), as pass NC left them, each corrected row saying so and section 9's row for Q85 naming them.
  { const o = "<!-- RULES-AUDIT section 11's answered questions in pass ND, word for word: begin -->\n"; const ia = hist.indexOf(o); const ib = hist.indexOf("<!-- RULES-AUDIT section 11's answered questions in pass ND, word for word: end -->");
    const nd = ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : '';
    ok('docs/RULES-AUDIT-HISTORY.md keeps the question answered in pass ND, every line unchanged (pass ND)', /^- Q88\. Answered in pass ND/.test(nd) && nd.includes('The question as it stood: A hiss said as one breath') && createHash('sha256').update(nd, 'utf8').digest('hex') === '949292b0607f6cf926d8ccb083e369ea29855b4e842239cec1432c3607e829ee'); }
  { const o = '<!-- RULES-AUDIT rows as pass NC left them, before pass ND corrected them in place, word for word: begin -->\n'; const ia = hist.indexOf(o); const ib = hist.indexOf('<!-- RULES-AUDIT rows as pass NC left them, before pass ND corrected them in place, word for word: end -->');
    const kept = ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : '';
    const said = (audit.match(/Corrected in place in pass ND \(Mikey's answer to Q85\)/g) || []).length;
    ok("docs/RULES-AUDIT-HISTORY.md keeps the three rows pass ND corrected in place as pass NC left them (section 2's line, section 4's row and section 6's short breaths), each corrected row says so, and section 9's row for Q85 names them (pass ND, Q85 (b))", /^- \*\*Since pass NC \(Domain III's phonemes/.test(kept) && (kept.match(/Q88 as[k]s Mikey/g) || []).length === 3 && said >= 3 && audit.includes('Corrected in pass ND, each read against the code: section 2') && !/Q88 as[k]s Mikey/.test(audit) && createHash('sha256').update(kept, 'utf8').digest('hex') === '82144b19b20626b09308aaeafde4cffb105b71b507588e9769a570e11076308c', `${said} rows say so`); }
  // Pass NE's two blocks, held the same way: Q89, which Mikey answered when he opened the pass ("Q89 - A"), and the two rows his answer
  // let pass NE correct in place under Q85 (b), as pass ND left them, each corrected row saying so and section 9's row for Q85 naming them.
  { const o = "<!-- RULES-AUDIT section 11's answered questions in pass NE, word for word: begin -->\n"; const ia = hist.indexOf(o); const ib = hist.indexOf("<!-- RULES-AUDIT section 11's answered questions in pass NE, word for word: end -->");
    const ne = ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : '';
    ok('docs/RULES-AUDIT-HISTORY.md keeps the question answered in pass NE, every line unchanged (pass NE)', /^- Q89\. Answered in pass NE/.test(ne) && ne.includes('The question as it stood: One breath for a hiss in the three letters lessons') && createHash('sha256').update(ne, 'utf8').digest('hex') === '8e583c0def68e2d1fa00a58d6631bc73b509f679216143c6eb39e7d841977634'); }
  { const o = '<!-- RULES-AUDIT rows as pass ND left them, before pass NE corrected them in place, word for word: begin -->\n'; const ia = hist.indexOf(o); const ib = hist.indexOf('<!-- RULES-AUDIT rows as pass ND left them, before pass NE corrected them in place, word for word: end -->');
    const kept = ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : '';
    const said = (audit.match(/Corrected in place in pass NE \(Mikey's answer to Q85\)/g) || []).length;
    ok("docs/RULES-AUDIT-HISTORY.md keeps the six rows pass NE corrected in place as pass ND left them (section 2's line, section 4's row on one breath in the letters lessons, and since the pass's own work section 5's row on III.C.2 and III.C.3, section 6's row on a spacing or dots question, section 8's row on writing shown as print and its row on every drawing on an answer tile), each corrected row says so, and section 9's row for Q85 names them (pass NE, Q85 (b))", /^- \*\*Since pass ND \(Domain III's letters and their sounds/.test(kept) && (kept.match(/Q89 as[k]s Mikey/g) || []).length === 2 && ['| **Domain III\'s III.C.2 and III.C.3, read (pass ND', '| **A spacing or dots question is never answered by its look (pass ND', '| **Writing shown as print (pass ND', '| **Every drawing on an answer tile reads at its edge (pass ND'].every((s) => kept.includes('\n' + s)) && said >= 6 && audit.includes('Corrected in pass NE, each read against the code: section 2') && audit.includes('Corrected in pass NE too, each where the pass\'s own work outgrew it') && !/Q89 as[k]s Mikey/.test(audit) && createHash('sha256').update(kept, 'utf8').digest('hex') === '287fe18195c984df8431d824837eb6a4d76d5ea001391467002849251c640b96', `${said} rows say so`); }
  // The question answered when pass NF opened (Q90: every one of the four colors edged), in a block of its own, and the rows its answer
  // let pass NF correct in place under Q85 (b), as pass NE left them, each corrected row saying so and section 9's row for Q85 naming them.
  { const o = "<!-- RULES-AUDIT section 11's answered questions in pass NF, word for word: begin -->\n"; const ia = hist.indexOf(o); const ib = hist.indexOf("<!-- RULES-AUDIT section 11's answered questions in pass NF, word for word: end -->");
    const nf = ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : '';
    ok('docs/RULES-AUDIT-HISTORY.md keeps the question answered in pass NF, every line unchanged (pass NF)', /^- Q90\. Answered in pass NF/.test(nf) && nf.includes('The question as it stood: A thin edge on all four colors of the colored shapes and squares') && createHash('sha256').update(nf, 'utf8').digest('hex') === 'e01975bec789642bf008959d4217864d31d683dc94a29522b8b56da355448c51'); }
  // The questions answered when pass NG opened (Q91: the grown-up's card; Q92: a note for a browser too old for the app), in a block of
  // their own, and the two rows of section 9 Mikey's word let pass NG correct in place (which model a task runs on, and the weekly
  // sweep), as pass NF left them, each corrected row saying so.
  { const o = "<!-- RULES-AUDIT section 11's answered questions in pass NG, word for word: begin -->\n"; const ia = hist.indexOf(o); const ib = hist.indexOf("<!-- RULES-AUDIT section 11's answered questions in pass NG, word for word: end -->");
    const ng = ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : '';
    ok('docs/RULES-AUDIT-HISTORY.md keeps the questions answered in pass NG, Q91 and Q92 as it opened and Q93 and Q94 mid-pass, every line unchanged (pass NG)', /^- Q91\. Answered in pass NG/.test(ng) && ng.includes('\n- Q92. Answered in pass NG') && ng.includes('The question as it stood: Letters questions on a device with no voice') && ng.includes('The question as it stood: The oldest iPads and iPhones') && ng.includes('\n- Q93. Answered in pass NG') && ng.includes('\n- Q94. Answered in pass NG') && createHash('sha256').update(ng, 'utf8').digest('hex') === 'ee9de3aef0cfcc4ee6ff9819edb435d389548a640fe66cf9a8607a878bafeb74'); }
  { const o = '<!-- RULES-AUDIT rows as pass NF left them, before pass NG corrected them in place, word for word: begin -->\n'; const ia = hist.indexOf(o); const ib = hist.indexOf('<!-- RULES-AUDIT rows as pass NF left them, before pass NG corrected them in place, word for word: end -->');
    const kept = ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : '';
    ok("docs/RULES-AUDIT-HISTORY.md keeps the two rows pass NG corrected in place at Mikey's word as pass NF left them (which model a task runs on, and the weekly sweep), and each corrected row says so (pass NG)", /^\| \*\*Which model a task runs on/.test(kept) && kept.includes('\n| **A research sweep once a week') && createHash('sha256').update(kept, 'utf8').digest('hex') === 'd8b2f02574a631eb3e8e27b1a738209fbbe52b7453265851aa8d1aac61e2a375'
      && audit.includes('and in pass NG, at his word again, its pass NF words in docs/RULES-AUDIT-HISTORY.md') && audit.includes('Corrected in place in pass NG, at his word, its pass NF words in docs/RULES-AUDIT-HISTORY.md')); }
  { const o = '<!-- RULES-AUDIT rows as pass NE left them, before pass NF corrected them in place, word for word: begin -->\n'; const ia = hist.indexOf(o); const ib = hist.indexOf('<!-- RULES-AUDIT rows as pass NE left them, before pass NF corrected them in place, word for word: end -->');
    const kept = ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : '';
    const said = (audit.match(/Corrected in place in pass NF \(Mikey's answer to Q85\)/g) || []).length + (audit.match(/and again in pass NF, its pass NE words there too/g) || []).length;
    // Since p29 four rows more, which the pass's own work outgrew (section 4's one breath, section 5's III.C.2 and III.C.3, and section 8's
    // rows on a lesson's own letters and print and on a drawing beside its dots, EARMARKS A101 and A102), and since p38 section 8's row on
    // no word under the scroll cue on a short phone (EARMARKS A99 and A103, the scroll-cue engineer's work).
    ok("docs/RULES-AUDIT-HISTORY.md keeps the rows pass NF corrected in place as pass NE left them (section 2's pass MP line, section 8's pass MP light-theme row and its row on every drawing on an answer tile, and where the pass's own work outgrew them section 4's row on one breath in the letters lessons, section 5's row on III.C.2 and III.C.3 and section 8's rows on a lesson's own letters and print, on a drawing beside its dots, on every drawing on the dark theme's lesson paper and on no word under the scroll cue on a short phone, and at Mikey's word mid-pass section 9's row on which model a task runs on), each corrected row says so, and section 9's row for Q85 names them (pass NF, Q85 (b))", /^- \*\*Since pass MP \(Mikey's game, sound and story notes/.test(kept) && ['| **Light-theme changes in pass MP, at Mikey\'s word (Q56', '| **Every drawing on an answer tile reads at its edge (pass ND', '**One breath for a hiss in the three letters lessons (pass ND', '| **Domain III\'s III.C.2 and III.C.3, read (pass ND', '| **A lesson\'s own letters and print grow on a wide screen (pass NE', '| **A drawing beside its dots grows on a wide screen (pass ND', '| **Every drawing on the dark theme\'s lesson paper reads at its edge (pass NE', '| **No word under the scroll cue on a short phone (pass NE', '| **Which model a task runs on (Mikey, pass NC:'].every((s) => kept.includes('\n' + s)) && said >= 10 && audit.includes('Corrected in pass NF too, at Mikey\'s word ("You may know this already') && audit.includes('Corrected in pass NF, each read against the code, since Mikey\'s answer to Q90') && audit.includes('Corrected in pass NF too, each where the pass\'s own work outgrew it, read against the code') && !/^- Q90\. A thin edge/m.test(audit) && createHash('sha256').update(kept, 'utf8').digest('hex') === 'b5a7e4f709ea8ef6e22c3e72f6b70a3fcaade0966a749fcc656f029b1aff1a48', `${said} rows say so`); }
  // The questions answered when pass NH opened (Q95: the pass packet; Q96: the eight letter-name kinds on the card; Q97: the letter hidden
  // beside the card), in a block of their own, and the two rows Mikey's answers let pass NH correct in place (section 8's row on the card
  // and section 9's row on what every pass reads), as pass NG left them, each corrected row saying so.
  { const o = "<!-- RULES-AUDIT section 11's answered questions in pass NH, word for word: begin -->\n"; const ia = hist.indexOf(o); const ib = hist.indexOf("<!-- RULES-AUDIT section 11's answered questions in pass NH, word for word: end -->");
    const nh = ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : '';
    ok('docs/RULES-AUDIT-HISTORY.md keeps the questions answered when pass NH opened, Q95, Q96 and Q97, every line unchanged (pass NH)', /^- Q95\. Answered in pass NH/.test(nh) && nh.includes('\n- Q96. Answered in pass NH') && nh.includes('\n- Q97. Answered in pass NH') && nh.includes('The question as it stood: What the lead reads at the start of a pass') && nh.includes('The question as it stood: Eight more letters questions on a device with no voice') && nh.includes("The question as it stood: The letter beside the grown-up's card") && createHash('sha256').update(nh, 'utf8').digest('hex') === '0e93461124e30a08df693665b0a07fc16cb1d2c9d901ab401505b66650d3bbeb'); }
  { const o = '<!-- RULES-AUDIT rows as pass NG left them, before pass NH corrected them in place, word for word: begin -->\n'; const ia = hist.indexOf(o); const ib = hist.indexOf('<!-- RULES-AUDIT rows as pass NG left them, before pass NH corrected them in place, word for word: end -->');
    const kept = ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : '';
    // Since round two's final read and its whole reads (pass NH): the file's own opening line and section 10's first step, which still said
    // every chat reads the whole file, and section 6's row on a letter question's print, which Q96 (a) outgrew, corrected in place too, their
    // pass NG words kept after the first two in the block, and section 9's row for Q85 naming the pass's corrections.
    ok("docs/RULES-AUDIT-HISTORY.md keeps the three rows and two lines pass NH corrected in place at Mikey's word as pass NG left them (the grown-up's card, what every pass reads, the opening line, a read-aloud question never printing its letter, and section 10's first step), each corrected line says so, and section 9's row for Q85 names them (pass NH)", /^\| \*\*The grown-up's card on a device with no voice/.test(kept) && kept.includes('\n| Every pass: read NEW-CHAT, this file, EARMARKS and the latest DECISIONS entry;') && kept.includes('\nWritten 2026-10-06 (pass LD, rewritten in pass LE after Mikey\'s review). Read it at the start of every chat, right after NEW-CHAT.md, before any work. It holds') && createHash('sha256').update(kept, 'utf8').digest('hex') === '092527a8c2796cba491a2cdc73c0b5d3773f351d5d28d12e12d1fb9cfc35bcc3' && kept.includes('\n| **A read-aloud question never prints the letter it asks for while the voice can say it') && kept.includes('\n1. This file complete and read by every chat.\n') && audit.includes('1. This file complete and read by every chat (since pass NH, at Mikey') && audit.includes('Corrected in pass NH, at Mikey\'s word (his answers to Q95, Q96 and Q97), each saying so')
      && audit.includes('Corrected in place in pass NH, at his word (Q96 (a) and Q97 (a)), its pass NG words in docs/RULES-AUDIT-HISTORY.md.') && audit.includes('Corrected in place in pass NH, at his word (Q95 (a)), its pass NG words in docs/RULES-AUDIT-HISTORY.md.')
      && /^Written 2026-10-06 .* a new chat's lead reads it through the pass packet .* Corrected in place in pass NH, at his word \(Q95 \(a\)\), its pass NG words in docs\/RULES-AUDIT-HISTORY\.md\.$/m.test(audit.split('\n')[2])); }
  // The question answered when pass NI opened (Q98: the seven picture questions beside a letter on the grown-up's card), in a block of its
  // own, and the row and the line Mikey's answer let pass NI correct in place (section 8's row on the card and section 2's pass NH line),
  // as pass NH left them, each corrected one saying so, and section 9's row for Q85 naming them. Since round two's whole read of the file:
  // the two rows the pass's own work outgrew, section 4's row on one breath (nine lessons, where Q, V and Y made ten) and section 5's row
  // on III.C.2 and III.C.3 (eighteen letters), corrected in place under Mikey's answer to Q85, their words kept after the first two.
  { const o = "<!-- RULES-AUDIT section 11's answered questions in pass NI, word for word: begin -->\n"; const ia = hist.indexOf(o); const ib = hist.indexOf("<!-- RULES-AUDIT section 11's answered questions in pass NI, word for word: end -->");
    const ni = ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : '';
    ok('docs/RULES-AUDIT-HISTORY.md keeps the question answered when pass NI opened, Q98, every line unchanged (pass NI)', /^- Q98\. Answered in pass NI/.test(ni) && ni.includes('The question as it stood: Seven picture questions beside a letter') && createHash('sha256').update(ni, 'utf8').digest('hex') === '634ac4db2967e0cdbe16413c2a3dc514bc3a4e6f140cdbd50bec4bcd6258a132'); }
  { const o = '<!-- RULES-AUDIT rows as pass NH left them, before pass NI corrected them in place, word for word: begin -->\n'; const ia = hist.indexOf(o); const ib = hist.indexOf('<!-- RULES-AUDIT rows as pass NH left them, before pass NI corrected them in place, word for word: end -->');
    const kept = ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : '';
    ok("docs/RULES-AUDIT-HISTORY.md keeps the row and the line pass NI corrected in place at Mikey's word as pass NH left them (the grown-up's card and section 2's pass NH line), and since round two the two rows its own work outgrew (one breath, and III.C.2 and III.C.3), each corrected one says so, and section 9's row for Q85 names them (pass NI)", /^\| \*\*The grown-up's card on a device with no voice/.test(kept) && kept.includes('\n- **Since pass NH (Mikey') && kept.includes('\n**One breath for a hiss in the three letters lessons') && kept.includes("\n| **Domain III's III.C.2 and III.C.3, read (pass ND") && createHash('sha256').update(kept, 'utf8').digest('hex') === '6d0dffa9ce17537f6852d5c5d5097645e496a394a0f67e008fd6011fb37783b6'
      && audit.includes('Corrected in place again in pass NI, at his word (Q98 (a)), its pass NH words there too.') && audit.includes('Corrected in place in pass NI (Mikey\'s answer to Q98), its pass NH words in docs/RULES-AUDIT-HISTORY.md.') && audit.includes('Corrected in pass NI, at Mikey\'s word (his answer to Q98), each saying so')
      && audit.split('and again in pass NI, its pass NF words there too.').length === 3 && audit.includes('section 4\'s row on one breath for a hiss (ten lessons since Q, V and Y')); }
  // HANDOFF's numbers name the pass that counted them (pass NC, round two's final read: its heading still named pass NB over pass NC's
  // numbers): the heading's pass is the newest DECISIONS entry's. An older pass's name, planted, is caught.
  { const handoff = readFileSync(new URL('../docs/HANDOFF.md', import.meta.url), 'utf8'); const dec = readFileSync(new URL('../docs/DECISIONS.md', import.meta.url), 'utf8');
    const passes = [...dec.matchAll(/^## (\d{4}-\d{2}-\d{2}) \(pass ([A-Z]{2})\)/gm)]; const last = passes.length ? passes[passes.length - 1][2] : '';
    const named = (text) => (/^## Numbers at handoff \(\d{4}-\d{2}-\d{2}, pass ([A-Z]{2})\)/m.exec(text) || [])[1];
    ok('HANDOFF\'s numbers heading names the newest DECISIONS entry\'s pass (pass NC; an older pass named, planted, caught)', !!last && named(handoff) === last && named(handoff.replace('pass ' + last + ')', 'pass AA)')) !== last, `heading names pass ${named(handoff)}, newest entry pass ${last}`); }
  // A research sweep once a week (Mikey, pass NC; RULES-AUDIT section 9): docs/AI-RESEARCH.md's newest entry is dated no more than
  // seven days before the newest DECISIONS entry, so a week of passes never goes by without one. A sweep eight days old, planted, is caught.
  { const research = readFileSync(new URL('../docs/AI-RESEARCH.md', import.meta.url), 'utf8');
    const dec = readFileSync(new URL('../docs/DECISIONS.md', import.meta.url), 'utf8');
    const newest = (text, re) => [...text.matchAll(re)].map((m) => Date.parse(m[1] + 'T00:00:00Z')).filter(Number.isFinite).sort((a, b) => b - a)[0];
    const lastPass = newest(dec, /^## (\d{4}-\d{2}-\d{2}) \(pass /gm); const sweep = (text) => newest(text, /^## (\d{4}-\d{2}-\d{2}) \(pass /gm);
    const within = (s) => Number.isFinite(lastPass) && Number.isFinite(s) && (lastPass - s) / 86400000 <= 7;
    const stale = new Date(lastPass - 8 * 86400000).toISOString().slice(0, 10);
    ok('docs/AI-RESEARCH.md has a sweep dated no more than seven days before the newest DECISIONS entry (pass NC, Mikey\'s weekly research; a sweep eight days old planted, caught)', within(sweep(research)) && !within(sweep('## ' + stale + ' (pass XX)\n')), `newest sweep ${new Date(sweep(research) || 0).toISOString().slice(0, 10)}, newest pass ${new Date(lastPass || 0).toISOString().slice(0, 10)}`); }
  // The vision says what the app does (pass NA, Mikey's answer to Q86, "Q86 - yes, B"): docs/VISION.md and section 1 of the rules audit
  // each say the gate is a pass and the star a second pass on another day, and the reflection rule with the code's own numbers
  // (WONDER_EVERY different lessons, MISS_STREAK misses in a row), and neither keeps a rule the app outgrew (the gate as mastered, a
  // reflection after every second finished round, a change wrong for moving past what is unmastered). Pass MZ's own texts are the near
  // misses: each must fail the check, and so must each text with one of the old test's two sentences planted in it (round two's final
  // read: the old texts failed on their other rules, so neither sentence had been read).
  { const vision = readFileSync(new URL('../docs/VISION.md', import.meta.url), 'utf8');
    const one = audit.slice(audit.indexOf('## 1. The vision'), audit.indexOf('## 2. The product'));
    const words = ['zero', 'one', 'two', 'three', 'four', 'five'];
    const flat = (t) => t.replace(/\s+/g, ' ');
    const faults = (t) => { const f = flat(t); const out = [];
      if (!/A module opens only when everything it needs is passed/.test(f)) out.push('the gate');
      if (!/Mastery, the star, is a second pass on another day/.test(f)) out.push('the star');
      if (!new RegExp('after every ' + words[L.WONDER_EVERY] + ' different lessons').test(f)) out.push('the reflection rule');
      if (!new RegExp(words[L.MISS_STREAK] + ' misses in a row').test(f)) out.push('the rough patch');
      if (/needs is mastered|second finished round|have not mastered, it is wrong|something unmastered/.test(f)) out.push('an old rule');
      return out; };
    const kept = (() => { const o = '<!-- docs/VISION.md and RULES-AUDIT rows as pass MZ left them, before pass NA corrected them in place, word for word: begin -->\n'; const ia = hist.indexOf(o); return ia >= 0 ? hist.slice(ia + o.length, hist.indexOf('<!-- docs/VISION.md and RULES-AUDIT rows as pass MZ left them, before pass NA corrected them in place, word for word: end -->')) : ''; })();
    const oldVision = vision.replace(/- \*\*Master, then move\.\*\*[^]*?(?=\n- \*\*Go back)/, kept.slice(0, kept.indexOf('\n- **Reflect')));
    const oldOne = one.replace(/- \*\*Reflect often, and for a reason\.\*\*[^\n]*/, (kept.split('\n').find((l) => l.startsWith('- **Reflect often, and for a reason.** Reflection questions come after every second')) || ''));
    const near = faults(oldVision).length > 0 && faults(oldOne).length > 0 && faults(vision.replace('two different lessons', 'two finished rounds')).length > 0
      && faults(vision.replace('have not passed, it is wrong', 'have not mastered, it is wrong')).length > 0 && faults(one.replace('something not passed, it is wrong', 'something unmastered, it is wrong')).length > 0;
    ok("docs/VISION.md and the rules audit's section 1 say the gate is a pass, the star a second pass on another day, and a reflection comes after every " + words[L.WONDER_EVERY] + ' different lessons worked, a hard round being ' + words[L.MISS_STREAK] + " misses in a row, as the code has them, and neither keeps a rule the app outgrew (pass NA, Q86 (b); pass MZ's own texts, the old test's two sentences planted in each and a changed number caught; the plants since round two's final read)", faults(vision).length === 0 && faults(one).length === 0 && near, `vision: ${faults(vision)}; section 1: ${faults(one)}; near misses ${near}`); }
  const s = audit.indexOf('## 11. Open items that need Mikey'); const e = audit.indexOf('\n## ', s + 5); const sec = audit.slice(s, e < 0 ? audit.length : e);
  const answeredLines = sec.split('\n').filter((l) => /^- Q\d+\. Answered in pass /.test(l));
  const long = answeredLines.filter((l) => !/^- Q\d+\. Answered in pass \w+ \(Mikey: .+\)\. Its rule lives in [^\n]+\.$/.test(l) || /The question as it stood/.test(l));
  const missing = answeredLines.map((l) => Number(l.match(/^- Q(\d+)\./)[1])).filter((n) => !new RegExp(`^- Q${n}\\. Answered in pass `, 'm').test(hist));
  ok('section 11 keeps one line for each answered question, and each has its full text in docs/RULES-AUDIT-HISTORY.md (pass MN, Q52)', answeredLines.length >= 52 && long.length === 0 && missing.length === 0, `long: ${long.map((l) => l.slice(0, 12)).join(',')}; missing: ${missing.join(',')}`);
}
// CLAUDE.md is the short manual every session loads (pass MM, Mikey: "If you can run the entire vision, rules, decisions,
// claude.md etc through these ideas to improve our workflow, please do."). The whole file as it stood through pass ML is kept
// word for word in docs/CLAUDE-HISTORY.md, between two markers whose text must hash to the digest below, so nothing moved can be
// lost or edited; every dated line CLAUDE.md still carries is word for word one of the history's; and CLAUDE.md stays under
// 40,000 bytes, so it never again grows into a history (186 KB and 383 dated lines by pass ML).
{
  const { createHash } = await import('node:crypto');
  const hist = readFileSync(new URL('../docs/CLAUDE-HISTORY.md', import.meta.url), 'utf8');
  const a = hist.indexOf('<!-- CLAUDE.md through pass ML, word for word: begin -->\n'); const b = hist.indexOf('<!-- CLAUDE.md through pass ML, word for word: end -->');
  const block = a >= 0 && b > a ? hist.slice(a + '<!-- CLAUDE.md through pass ML, word for word: begin -->\n'.length, b) : '';
  ok('docs/CLAUDE-HISTORY.md keeps CLAUDE.md as it stood through pass ML, every line unchanged (pass MM)', createHash('sha256').update(block, 'utf8').digest('hex') === 'd1358c8433a304e75b0cd2861e26df5d53f3c11785ad9638bebfa8ad7c2f798b');
  const manual = readFileSync(new URL('../CLAUDE.md', import.meta.url), 'utf8');
  // Since pass MS (Mikey: "If you need to break it into two documents feel free.  I would rather that than you having to summarize to
  // save space.") the dated lines a coder needs most stand in CLAUDE-PART-2.md, which CLAUDE.md imports, and are read there.
  const part2 = readFileSync(new URL('../CLAUDE-PART-2.md', import.meta.url), 'utf8');
  // Since pass NG a third part (CLAUDE.md's Lines added since pass MS, moved there word for word, and the lines added since pass NG),
  // imported the same way and read with the other two.
  const part3 = readFileSync(new URL('../CLAUDE-PART-3.md', import.meta.url), 'utf8');
  // Since pass NB, CLAUDE.md being full (a new line would take it past 40,000 bytes), new lines go in part two's last section, Lines added
  // since pass NB, which is no copy of the history and is read here no more than CLAUDE.md's own Lines added since pass MS.
  const at = part2.indexOf('## Lines a coder needs most'); const newAt = part2.indexOf('\n## Lines added since pass NB'); const keptLines = at < 0 ? [] : part2.slice(at, newAt > at ? newAt : undefined).split('\n').filter((l) => l.startsWith('- '));
  const blockLines = new Set(block.split('\n'));
  // Since pass MN (Mikey's answer to Q53, "Q53 - B") a kept line gone stale is corrected in place once RULES-AUDIT section 9's
  // row names it: a dated line that is not word for word a line of the history must be named in that row (its label, the words
  // before its first colon, followed there by a comma, a semicolon or " and"), and the history must keep a line with that label.
  const s9 = audit.slice(audit.indexOf('## 9. Process'), audit.indexOf('\n## 10.'));
  const row = (s9.split('\n').find((l) => l.startsWith('| **Section 11 keeps one line for each answered question')) || '');
  const esc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const notCopied = keptLines.filter((l) => !blockLines.has(l)).filter((l) => { const m = /^- ([^:]+):/.exec(l); const label = m ? m[1] : null;
    return !label || !new RegExp(`${esc(label)}(?=,|;| and )`).test(row) || ![...blockLines].some((h) => h.startsWith(`- ${label}:`)); });
  ok('every dated line CLAUDE.md keeps is word for word a line of the history or corrected in place as RULES-AUDIT section 9 names it, and the manual stays under 40,000 bytes (passes MM and MN; since pass MS each of its two parts)', keptLines.length >= 40 && notCopied.length === 0 && Buffer.byteLength(manual, 'utf8') < 40000 && Buffer.byteLength(part2, 'utf8') < 40000 && Buffer.byteLength(part3, 'utf8') < 40000, `${keptLines.length} kept; ${Buffer.byteLength(manual, 'utf8')}, ${Buffer.byteLength(part2, 'utf8')} and ${Buffer.byteLength(part3, 'utf8')} bytes; neither copied nor named: ${notCopied.map((l) => l.slice(0, 50)).join(' | ')}`);
  // The split (pass MS): CLAUDE.md imports its second part on a line of its own, outside any code, as Claude Code reads an import
  // (code.claude.com/docs/en/memory: "CLAUDE.md files can import additional files using @path/to/import syntax"); docs/CLAUDE-HISTORY.md
  // keeps CLAUDE.md as it stood through pass MR between two markers, held by its digest; and every line of it that is not blank, the
  // numbered rules, the headings and the compliance paragraph as well as the "- " lines, is in one of the two parts, word for word, or
  // (a "- " line only) corrected in place as RULES-AUDIT section 9 names it, so nothing slips through the cracks (round one's code
  // check: the check read only the "- " lines, and a CLAUDE.md with its rule 5 deleted passed). Near misses: a CLAUDE.md with no
  // import, a part two with a line left out, and a CLAUDE.md with rule 5's line removed.
  { const o = '<!-- CLAUDE.md through pass MR, word for word: begin -->\n'; const ia = hist.indexOf(o); const ib = hist.indexOf('<!-- CLAUDE.md through pass MR, word for word: end -->');
    const mr = ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : '';
    const imports = (text) => text.split('\n').some((l) => l.trim() === '@CLAUDE-PART-2.md') && text.split('\n').some((l) => l.trim() === '@CLAUDE-PART-3.md');
    // Since pass NG (Mikey: "You can change this file without my approval when you need to but just have the advisor double check the change
    // to ensure accuracy and no unintended accidental changes.") a line corrected in place may have no label to name (the tracing line has no
    // colon), so a line kept word for word in docs/CLAUDE-HISTORY.md's pass NG block, held by its digest below, counts as kept too.
    const ngOpen = '<!-- CLAUDE.md lines as pass NF left them, before pass NG corrected them, word for word: begin -->\n'; const ngA = hist.indexOf(ngOpen); const ngB = hist.indexOf('<!-- CLAUDE.md lines as pass NF left them, before pass NG corrected them, word for word: end -->');
    const ngKept = new Set(ngA >= 0 && ngB > ngA ? hist.slice(ngA + ngOpen.length, ngB).split('\n') : []);
    // Since pass NH (Mikey's answer to Q95, "Q95 - A") CLAUDE.md's first line names the pass packet, its old words kept in the history's
    // pass NH block, held by its digest below, which counts as kept too.
    const nhOpen = '<!-- CLAUDE.md lines as pass NG left them, before pass NH corrected them, word for word: begin -->\n'; const nhA = hist.indexOf(nhOpen); const nhB = hist.indexOf('<!-- CLAUDE.md lines as pass NG left them, before pass NH corrected them, word for word: end -->');
    for (const l of (nhA >= 0 && nhB > nhA ? hist.slice(nhA + nhOpen.length, nhB).split('\n') : [])) ngKept.add(l);
    const lost = (a, b) => { const have = new Set([...a.split('\n'), ...b.split('\n')]); return mr.split('\n').filter((l) => l.trim() && !have.has(l) && !ngKept.has(l)).filter((l) => { if (!l.startsWith('- ')) return true; const m = /^- ([^:]+):/.exec(l); const label = m ? m[1] : null; return !label || !new RegExp(`${esc(label)}(?=,|;| and )`).test(row); }); };
    const real = lost(manual, part2 + '\n' + part3); const someLine = keptLines[3] || ''; const rule5 = manual.split('\n').find((l) => l.startsWith('5. Every answer and explanation is computed by arithmetic')) || '';
    const plants = [!imports(manual.replace('@CLAUDE-PART-2.md', '`@CLAUDE-PART-2.md`')), lost(manual, part2.replace(`${someLine}\n`, '') + '\n' + part3).length > 0, rule5 !== '' && lost(manual.replace(`${rule5}\n`, ''), part2 + '\n' + part3).length > 0, !imports(manual.replace('@CLAUDE-PART-3.md', ''))];
    ok('CLAUDE.md imports its second part, docs/CLAUDE-HISTORY.md keeps it as it stood through pass MR, and no line of it is in neither part (pass MS; near misses caught)', createHash('sha256').update(mr, 'utf8').digest('hex') === 'bec294ed050e5b86bbcfc2adda02961a649b98c35840f635ccb0adb1910ad54b' && imports(manual) && real.length === 0 && plants.every(Boolean), `lost: ${real.map((l) => l.slice(0, 60)).join(' | ')}; plants ${plants}`); }
  // Near misses: a corrected line the row does not name, and a label the row names only as the start of a longer one.
  { const nearRow = 'and the dated lines Themes (2026-09-24, Mikey), and more;'; const named = (label) => new RegExp(`${esc(label)}(?=,|;| and )`).test(nearRow);
    ok('a corrected line counts only when the row names its whole label (Themes (2026-09-24) is not Themes (2026-09-24, Mikey))', !named('Themes (2026-09-24)') && named('Themes (2026-09-24, Mikey)') && !named('Running check.sh (2026-09-28)')); }
  // Two lines pass MS added, corrected in place in pass MT at Mikey's word (Q77 and Q78): their old words kept in docs/CLAUDE-HISTORY.md,
  // held by their digest, and RULES-AUDIT section 9 names them.
  { const o = '<!-- CLAUDE.md lines as pass MS wrote them, before pass MT corrected them, word for word: begin -->\n'; const ia = hist.indexOf(o); const ib = hist.indexOf('<!-- CLAUDE.md lines as pass MS wrote them, before pass MT corrected them, word for word: end -->');
    const kept = ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : '';
    ok('docs/CLAUDE-HISTORY.md keeps the two CLAUDE.md lines pass MT corrected as pass MS wrote them, and RULES-AUDIT section 9 names them (pass MT)', createHash('sha256').update(kept, 'utf8').digest('hex') === '9ef1f5e89f6f37c6f2b6a4d5862d79a9cb119ad989e14d4de858ea43326145ae' && row.includes('Corrected in pass MT, at Mikey\'s word')); }
  // The say-along line, corrected in place in pass MU at Mikey's word (Q81): its words as pass MT wrote them kept the same way.
  { const o = '<!-- CLAUDE.md lines as pass MT wrote them, before pass MU corrected them, word for word: begin -->\n'; const ia = hist.indexOf(o); const ib = hist.indexOf('<!-- CLAUDE.md lines as pass MT wrote them, before pass MU corrected them, word for word: end -->');
    const kept = ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : '';
    ok('docs/CLAUDE-HISTORY.md keeps the CLAUDE.md line pass MU corrected as pass MT wrote it, and RULES-AUDIT section 9 names it (pass MU)', /^- Say-along \(pass MS, /.test(kept) && createHash('sha256').update(kept, 'utf8').digest('hex') === '8807fc601f55d60281930354b66cd30cfcdca692264e0edbe8b58462b511eacd' && row.includes('Corrected in pass MU, at Mikey\'s word')); }
  // The line pass MY added, corrected in place in pass MZ at Mikey's word (Q84): its words as pass MY wrote them kept the same way.
  { const o = '<!-- CLAUDE.md lines as pass MY wrote them, before pass MZ corrected them, word for word: begin -->\n'; const ia = hist.indexOf(o); const ib = hist.indexOf('<!-- CLAUDE.md lines as pass MY wrote them, before pass MZ corrected them, word for word: end -->');
    const kept = ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : '';
    ok('docs/CLAUDE-HISTORY.md keeps the CLAUDE.md line pass MZ corrected as pass MY wrote it, and RULES-AUDIT section 9 names it (pass MZ)', /^- Parts of words, and a split lesson \(pass MY, /.test(kept) && createHash('sha256').update(kept, 'utf8').digest('hex') === 'f3e8fa11b4fad85c639cd69f89f3c2e204bbe49e6ee5941043c8be20e20dfcc2' && row.includes('Corrected in pass MZ, at Mikey\'s word')); }
  // The line pass NC added to CLAUDE-PART-2.md, corrected in place in pass ND at Mikey's word (Q88): its words as pass NC wrote them kept the same way.
  { const o = '<!-- CLAUDE.md lines as pass NC wrote them, before pass ND corrected them, word for word: begin -->\n'; const ia = hist.indexOf(o); const ib = hist.indexOf('<!-- CLAUDE.md lines as pass NC wrote them, before pass ND corrected them, word for word: end -->');
    const kept = ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : '';
    ok('docs/CLAUDE-HISTORY.md keeps the CLAUDE-PART-2 line pass ND corrected as pass NC wrote it, and RULES-AUDIT section 9 names it (pass ND)', /^- Phonemes, the one-breath hiss, writing to tell, and the screen read \(pass NC, /.test(kept) && /Q88 as[k]s Mikey/.test(kept) && createHash('sha256').update(kept, 'utf8').digest('hex') === '6d48bb3dc86291b4aaf4ad9f072ea7fbe8a60ae01592f012acc5357716f66035' && row.includes('Corrected in pass ND, at Mikey\'s word')); }
  // The same line, corrected in place again in pass NF at Mikey's word (Q90): its words as pass NE left them kept the same way.
  { const o = '<!-- CLAUDE.md lines as pass NE left them, before pass NF corrected them, word for word: begin -->\n'; const ia = hist.indexOf(o); const ib = hist.indexOf('<!-- CLAUDE.md lines as pass NE left them, before pass NF corrected them, word for word: end -->');
    const kept = ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : '';
    ok('docs/CLAUDE-HISTORY.md keeps the CLAUDE-PART-2 lines pass NF corrected as pass NE left them (pass ND\'s line at Q90, and pass NC\'s on which model at Mikey\'s word mid-pass), and RULES-AUDIT section 9 names them (pass NF)', /^- Letters and their sounds, spaces between words, and every drawing's edge \(pass ND, /.test(kept) && kept.includes('taking an edge of its own where it fell short (swatchEdge, SWATCH_TILE_EDGE)') && kept.includes('\n- Which model, and a weekly sweep (Mikey, pass NC, after usage ran out mid-pass;') && kept.includes('creative writing on Fable 5.1,') && createHash('sha256').update(kept, 'utf8').digest('hex') === '2f2a4e74c4cd92833f1d7233d31fb2ca48b9c6512902bee0c47a5bb1d695b3c7' && row.includes('Corrected in pass NF, at Mikey\'s word') && row.includes('Corrected in pass NF too, at Mikey\'s word')); }
  // Pass NG, at Mikey's word ("You can fix the CLAUDE.md tracing line text about where the line starts to make it accurate.  You can change
  // this file without my approval when you need to but just have the advisor double check the change to ensure accuracy and no unintended
  // accidental changes."): five CLAUDE.md lines corrected in place, their words as pass NF left them kept in docs/CLAUDE-HISTORY.md's pass NG
  // block under its digest, and RULES-AUDIT section 9's row names them; and CLAUDE.md's section Lines added since pass MS moved to
  // CLAUDE-PART-3.md word for word, held there by the digest of its text as CLAUDE.md had it, so nothing in the move was changed or lost.
  // Near misses: the block with a word changed, and the moved section with one line left out.
  { const o = '<!-- CLAUDE.md lines as pass NF left them, before pass NG corrected them, word for word: begin -->\n'; const ia = hist.indexOf(o); const ib = hist.indexOf('<!-- CLAUDE.md lines as pass NF left them, before pass NG corrected them, word for word: end -->');
    const kept = ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : '';
    const digest = (t) => createHash('sha256').update(t, 'utf8').digest('hex');
    const part3 = readFileSync(new URL('../CLAUDE-PART-3.md', import.meta.url), 'utf8');
    const ms = (t) => { const a = t.indexOf('## Lines added since pass MS\n'); const b = t.indexOf('\n## Lines added since pass NG\n'); return a >= 0 && b > a ? t.slice(a, b) : ''; };   // the section's own last newline, not the blank line after it
    const MS_DIGEST = '71e79518df7893a6126b1ebc1ccf93088b49a0585c20840452c6fe9975c41d56'; const NG_DIGEST = 'ceee5127665b864b2508a9cd4f72746529de0d4a393f57cae364d7169357d4f1';
    const msOut = ms(part3).split('\n'); const plants = [digest(kept.replace('every letter starts at the top', 'every letter starts at its top')) !== NG_DIGEST, digest([...msOut.slice(0, 3), ...msOut.slice(4)].join('\n')) !== MS_DIGEST];
    ok('docs/CLAUDE-HISTORY.md keeps the five CLAUDE.md lines pass NG corrected, its heading over the parts and four lines of part two, as pass NF left them, RULES-AUDIT section 9 names them, and CLAUDE-PART-3.md holds CLAUDE.md\'s Lines added since pass MS word for word (pass NG; two near misses caught)',
      /^- Tracing words follow TRACE_LETTERS stroke by stroke, and every letter starts at the top/.test(kept) && kept.includes("\n- IMPORTANT: existing lines in this file are not changed without Mikey's approval.") && kept.includes('\n- Strong model: ') && kept.includes('\n- Cheaper model: ') && kept.includes('\n- CLAUDE.md is two files since pass MS') && kept.includes('\n## CLAUDE.md, part two (pass MS)\n') && kept.includes('\nCLAUDE.md is full since pass NB') && kept.includes('so CLAUDE.md\'s tracing line holds for the capitals)')
      && digest(kept) === NG_DIGEST && digest(ms(part3)) === MS_DIGEST && !manual.includes('\n## Lines added since pass MS\n') && row.includes('Corrected in pass NG, at Mikey\'s word') && plants.every(Boolean), JSON.stringify({ kept: digest(kept).slice(0, 12), ms: digest(ms(part3)).slice(0, 12), plants })); }
  // Pass NH, at Mikey's word (his answer to Q95, "Q95 - A"): CLAUDE.md's first line names the pass packet, its words as pass NG left them
  // kept in docs/CLAUDE-HISTORY.md's pass NH block under its digest, and RULES-AUDIT section 9's row names the change. Near miss: the block
  // with a word changed.
  { const o = '<!-- CLAUDE.md lines as pass NG left them, before pass NH corrected them, word for word: begin -->\n'; const ia = hist.indexOf(o); const ib = hist.indexOf('<!-- CLAUDE.md lines as pass NG left them, before pass NH corrected them, word for word: end -->');
    const kept = ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : ''; const digest = (t) => createHash('sha256').update(t, 'utf8').digest('hex'); const NH_DIGEST = '51c6be306ad264b83d5f0cb026c76572af9df46ecd194fc4fb69acdc29d8fc41';
    // Since the Fable agent's read of the change: part two's line Rules audit (2026-10-06, pass LD, Mikey), which said the rules audit is read
    // with NEW-CHAT.md at the start of every chat, says it is read through the pass packet, its old words kept in the same block.
    ok("docs/CLAUDE-HISTORY.md keeps CLAUDE.md's first line and part two's Rules audit line as pass NG left them, CLAUDE.md's first line names the pass packet, and RULES-AUDIT section 9 names both changes (pass NH; a word changed in the block, planted, caught)",
      /^New chats: read docs\/NEW-CHAT\.md first, then docs\/RULES-AUDIT\.md/.test(kept) && kept.includes('\n- Rules audit (2026-10-06, pass LD, Mikey): docs/RULES-AUDIT.md maps every standing rule to what enforces it; read it with NEW-CHAT.md at the start of every chat, and when') && row.includes('the line Rules audit (2026-10-06, pass LD, Mikey), in CLAUDE-PART-2.md') && digest(kept) === NH_DIGEST && digest(kept.replace('says.', 'said.')) !== NH_DIGEST && kept.includes('says.')
      && /^New chats: read docs\/NEW-CHAT\.md first, then the pass packet it asks for \(node tools\/pass-packet\.mjs/.test(manual) && row.includes("Corrected in pass NH, at Mikey's word (his answer to Q95, \"Q95 - A\")")); }
  // The line pass ND added to CLAUDE-PART-2.md, corrected in place in pass NE at Mikey's word (Q89): its words as pass ND wrote them kept the same way.
  { const o = '<!-- CLAUDE.md lines as pass ND wrote them, before pass NE corrected them, word for word: begin -->\n'; const ia = hist.indexOf(o); const ib = hist.indexOf('<!-- CLAUDE.md lines as pass ND wrote them, before pass NE corrected them, word for word: end -->');
    const kept = ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : '';
    ok('docs/CLAUDE-HISTORY.md keeps the CLAUDE-PART-2 line pass NE corrected as pass ND wrote it, and RULES-AUDIT section 9 names it (pass NE)', /^- Letters and their sounds, spaces between words, and every drawing's edge \(pass ND, /.test(kept) && /Q89 as[k]s Mikey/.test(kept) && createHash('sha256').update(kept, 'utf8').digest('hex') === '380d6c54d17d1e373c8148af6c1778b7bf3da059bbe99c30cf685816dc459967' && row.includes('Corrected in pass NE, at Mikey\'s word')); }
}
// NEW-CHAT.md's history (pass MM): the state bullets of passes JE to MJ, the earlier chats' "When to start" paragraphs and the
// chain of earlier preview links moved, word for word, to docs/NEW-CHAT-HISTORY.md, whose text between its markers must hash to
// the digest below, so nothing moved can be lost or edited.
{
  const { createHash } = await import('node:crypto');
  const hist = readFileSync(new URL('../docs/NEW-CHAT-HISTORY.md', import.meta.url), 'utf8');
  const open = '<!-- NEW-CHAT history through pass ML, word for word: begin -->\n'; const a = hist.indexOf(open); const b = hist.indexOf('<!-- NEW-CHAT history through pass ML, word for word: end -->');
  const block = a >= 0 && b > a ? hist.slice(hist.indexOf('\n\n', a + open.length) + 2, b) : '';
  ok('docs/NEW-CHAT-HISTORY.md keeps the history NEW-CHAT.md held through pass ML, every line unchanged (pass MM)', createHash('sha256').update(block, 'utf8').digest('hex') === '09944cffc5de080b09d0ca0f9f4c599b9e415859fc7cb36f039e75efab0e3576');
}
// The question screens test's walk waits out the page's settle window before it taps a walk-through button (pass NG). Pass JM's rule,
// which the click-through and the drag test keep for every tap (settleTaps): a new screen asks for its top again at 80 and 320
// milliseconds unless the person moves, so a tap whose own scroll lands inside that window is undone and misses. The walk tapped 300
// milliseconds after sending the app to the classroom page, and on November 11 the Veterans Day note pushed the walk-through buttons
// below its 900-pixel window: check.sh's first run in pass NG stopped there, and pass NF's page did the same that day. Pass NF's walk,
// planted, is caught.
{ const qs = readFileSync(new URL('./e2e/question-screens.mjs', import.meta.url), 'utf8');
  const walkOf = (t) => { const a = t.indexOf('const walk = async (label) => {'); return a < 0 ? '' : t.slice(a, t.indexOf('};', a) + 2); };
  const settles = (w) => /await settle\(\);[^\n]*getByLabel\(label\)[^\n]*\.click\(/.test(w);
  const nf = "const walk = async (label) => {\n  await page.evaluate(() => window.__eduTest.goTo('educator-pick')); await page.waitForTimeout(300); for (const n of ['Skip tour', 'Later', 'Got it']) await tapIf(n);\n  await page.getByLabel(label).first().click({ force: true }); await screenIs('overview'); await page.waitForTimeout(300); };";
  ok("the question screens test's walk waits out the page's settle window before it taps a walk-through button (pass NG; pass NF's walk, planted, caught)", settles(walkOf(qs)) && !settles(walkOf(nf)) && walkOf(nf).length > 0, walkOf(qs).slice(0, 300)); }
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
// The audio ledger is current (pass MN, round three's lesson and story checks): tools/audio-generate.mjs records each clip from
// docs/AUDIO-LEDGER.csv, and clips are found by line number, so round one's words left in it after round two's lessons changed
// would have put "get a grown-up" over the line "you do not need to get a grown-up". The file must be what the tool makes from the
// code today (run node tools/audio-ledger.mjs > docs/AUDIO-LEDGER.md after a change to a story or a read-aloud line).
{ const { LEDGER_CSV } = await import('../tools/audio-ledger.mjs'); const file = readFileSync(new URL('../docs/AUDIO-LEDGER.csv', import.meta.url), 'utf8');
  const have = file.split('\n'); const want = LEDGER_CSV.split('\n'); const first = want.findIndex((l, i) => l !== have[i]);
  ok(`docs/AUDIO-LEDGER.csv is what tools/audio-ledger.mjs makes from the code today (${want.length - 2} clips)`, want.length > 9000 && file === LEDGER_CSV, first < 0 ? `lengths ${have.length} and ${want.length}` : `first difference at line ${first + 1}: ${String(have[first]).slice(0, 120)}`); }
// Every generated doc is what its tool prints today (pass MX): round one's code check found docs/QUESTION-POOLS.md and
// docs/UNTAUGHT.md still saying 694 modules and docs/STORY-FLOW.md's pre-K rows 41 and 46 stories after the pass had added modules
// and stories, and round two's alignment read found docs/AUDIO-LEDGER.md's bullet giving a goal the code had since changed, with no
// test holding any of them. Each tool runs as the docs say (node tools/<tool>.mjs > docs/<DOC>.md), the audio ledger's markdown read
// from its export since running that tool writes the CSV, and the date a doc was made is set aside, so a doc made on another day
// passes. The near misses, through the same comparison: QUESTION-POOLS with three modules fewer, as round one found it, and the
// ledger's bullet with its old example.
{ const { execFileSync } = await import('node:child_process'); const { fileURLToPath } = await import('node:url'); const { LEDGER_MD } = await import('../tools/audio-ledger.mjs');
  const root = fileURLToPath(new URL('..', import.meta.url));
  // Since the third read THIN-STORIES (tools/story-arc.mjs) and GAMES-PLAN (tools/games-plan.mjs writes it, so its export is read) too.
  const TOOLS = [['question-pools', 'QUESTION-POOLS'], ['untaught', 'UNTAUGHT'], ['story-flow-audit', 'STORY-FLOW'], ['review-ledger', 'REVIEW-LEDGER'], ['story-art-audit', 'STORY-ART-AUDIT'], ['story-length', 'STORY-LENGTH'], ['picture-candidates', 'PICTURE-CANDIDATES'], ['cast-ages', 'CAST-AGES'], ['story-arc', 'THIN-STORIES']];
  const made = new Map(TOOLS.map(([tool, doc]) => [doc, execFileSync('node', ['tools/' + tool + '.mjs'], { cwd: root, encoding: 'utf8', maxBuffer: 256 << 20, timeout: 180000 })]));
  made.set('AUDIO-LEDGER', LEDGER_MD + '\n'); const { GAMES_PLAN_MD } = await import('../tools/games-plan.mjs'); made.set('GAMES-PLAN', GAMES_PLAN_MD);
  const undated = (t) => String(t).replace(/^Generated \d{4}-\d\d-\d\d\b/m, 'Generated (date)');
  const stale = (doc, text) => undated(text) !== undated(made.get(doc));
  const docText = (doc) => readFileSync(new URL('../docs/' + doc + '.md', import.meta.url), 'utf8');
  const off = [...made.keys()].filter((doc) => stale(doc, docText(doc)));
  const pools = docText('QUESTION-POOLS'); const count = / of (\d+) modules/.exec(pools);
  const goal = L.goalTag(L.SOUND_RECORDINGS.m.goal); const ledger = docText('AUDIO-LEDGER');
  const plants = [!!count && stale('QUESTION-POOLS', pools.replace(count[0], ' of ' + (+count[1] - 3) + ' modules')), ledger.includes(goal) && stale('AUDIO-LEDGER', ledger.replace(goal, '[saying just the m sound of moon, a steady hum with the lips closed]'))];
  ok(`every generated doc is what its tool prints today, the date it was made aside (${made.size} docs; two near misses caught)`, off.length === 0 && plants.every(Boolean),
    `stale ${off.map((d) => 'docs/' + d + '.md').join(', ')} (run each doc's tool with > into it); near misses ${plants}`); }
// NEW-CHAT names the newest preview (pass NB, the lead's read of How a pass is delivered: pass NA published a new preview, recorded in
// its DECISIONS entry, and NEW-CHAT's chain still began with pass MZ's link, so a new chat would have been told to update a page two
// passes old). The first link of the chain, after "since pass", is the newest DECISIONS entry's preview; a chain one pass behind is
// planted and caught.
{
  const dec = readFileSync(new URL('../docs/DECISIONS.md', import.meta.url), 'utf8'); const nc = readFileSync(new URL('../docs/NEW-CHAT.md', import.meta.url), 'utf8');
  const previews = [...dec.matchAll(/^- \*\*The preview\.\*\* (https:\/\/claude\.ai\/artifact\/[A-Za-z0-9]+)/gm)].map((m) => m[1]);
  const newest = previews.at(-1);
  const chainOf = (text) => { const m = /since pass [A-Z]{2}, (https:\/\/claude\.ai\/artifact\/[A-Za-z0-9]+), which replaced pass [A-Z]{2}'s at (https:\/\/claude\.ai\/artifact\/[A-Za-z0-9]+)/.exec(text); return m ? [m[1], m[2]] : null; };
  const chain = chainOf(nc);
  const stale = nc.replace(/since pass [A-Z]{2}, https:\/\/claude\.ai\/artifact\/[A-Za-z0-9]+, which replaced /, 'since pass ZZ, ' + previews.at(-2) + ', which replaced ');
  const staleChain = chainOf(stale);
  ok(`NEW-CHAT's chain of preview links starts with the newest DECISIONS entry's preview, and the one it replaced comes next (pass NB; ${previews.length} previews in DECISIONS; a chain one pass behind caught)`,
    !!newest && !!chain && chain[0] === newest && chain[1] === previews.at(-2) && !!staleChain && staleChain[0] !== newest, chain ? 'chain starts ' + chain[0] + ', then ' + chain[1] + '; newest ' + newest : 'no chain found in NEW-CHAT');
}
// HANDOFF's numbers name the ledger's last serials (round three's final read, pass MO: they were a pass behind, S3914, D245 and
// P154, as pass LX found them once).
{ const h = readFileSync(new URL('../docs/HANDOFF.md', import.meta.url), 'utf8'); const art = readFileSync(new URL('../docs/ART-REQUESTS.md', import.meta.url), 'utf8');
  const top = (p) => Math.max(...[...art.matchAll(new RegExp('^\\| ' + p + '(\\d+) \\|', 'gm'))].map((m) => +m[1]));
  const want = ['S1 to S' + top('S'), 'CS1 to CS' + top('CS'), 'D28 to D' + top('D'), 'P1 to P' + top('P'), 'C1 to C' + top('C')];
  ok("HANDOFF's numbers name the ledger's last serials", want.every((w) => h.includes(w)), want.filter((w) => !h.includes(w)).join(', ')); }
// Mikey's standing preferences are his own words (pass MS, round three's final read): docs/PROJECT-CONTEXT.md section 7 had filed
// "A printed record never reads as complete when it is not" as his, Claude's reason for the (c) he chose in Q76, which reached past
// his choice to other grades and settled Q78 for him, the second time a rule was written wider than his choice (MISTAKE-CLASSES (b),
// the first in pass MR). Every bullet there quotes him: an answer ("Q76 - C") or words of his, five at least, found word for word in
// docs/DECISIONS.md in one of his messages kept there word for word (its lines start "> ", and every such line in DECISIONS is a line
// of his). The bullets written before pass MR, which carry his rules without his words, wait by their first words, and the list only
// falls. Near misses: the filed reason, and his Q76 bullet with Claude's reason put in quotation marks as his. Until round four's docs
// read a quote within 300 characters after his name counted as his too, so the filed reason would have passed once any line beside
// his name held it: a DECISIONS with such a line is a near miss now, which that rule passed.
{ const pc = readFileSync(new URL('../docs/PROJECT-CONTEXT.md', import.meta.url), 'utf8'); const dec = readFileSync(new URL('../docs/DECISIONS.md', import.meta.url), 'utf8');
  const s7 = (pc.split(/^## 7\. /m)[1] || '').split(/^## /m)[0]; const bullets = s7.split('\n').filter((l) => l.startsWith('- '));
  // Pass MZ: the rules audit bullet quotes Mikey's answer to Q85 now, so it no longer waits.
  const WAITING = ["The tour cards' words are his", 'Questions for him carry numbers', 'Wonder questions and edits ship', 'Writing: varied sentence lengths', 'Never take a shortcut', 'No Spanish course'];
  const hisIn = (text, near = false) => (q) => { if (!/^Q\d+ - /.test(q) && q.trim().split(/\s+/).length < 5) return false; let at = text.indexOf(q);
    while (at >= 0) { const line = text.lastIndexOf('\n', at) + 1; if (text.startsWith('> ', line) || (near && text.slice(Math.max(0, at - 300), at).includes('Mikey'))) return true; at = text.indexOf(q, at + 1); } return false; };
  const his = hisIn(dec);
  // Every run of "> " lines in DECISIONS follows a line that says it is Mikey's message, word for word, so a quote kept there is his.
  const dl = dec.split('\n'); const quoted = (l) => l === '>' || l.startsWith('> ');
  const runs = dl.map((l, i) => (quoted(l) && !(i > 0 && quoted(dl[i - 1])) ? i : -1)).filter((i) => i >= 0);
  const unnamed = runs.filter((i) => { let j = i - 1; while (j >= 0 && dl[j].trim() === '') j -= 1; return j < 0 || (!quoted(dl[j]) && !/Mikey's message, word for word/.test(dl[j])); });
  const reason = 'A printed record never reads as complete when it is not';
  const beside = `${dec}\n- Mikey chose (c) in Q76, for the reason Claude gave: "${reason}".\n`;
  const besideCaught = !hisIn(beside)(reason) && hisIn(beside, true)(reason);
  const quotesHim = (b) => [...b.matchAll(/"([^"]+)"/g)].some((m) => his(m[1]));
  const unquoted = bullets.filter((b) => !quotesHim(b) && !WAITING.some((w) => b.startsWith(`- ${w}`)));
  const stale = WAITING.filter((w) => !bullets.some((b) => b.startsWith(`- ${w}`)) || bullets.some((b) => b.startsWith(`- ${w}`) && quotesHim(b)));
  const misses = ['- A printed record never reads as complete when it is not (Q76 (c), pass MS).', '- Pre-K is counted against every 2027 outcome ("a printed record should never read as complete when it is not", pass MS).'].map((b) => !quotesHim(b));
  ok(`every standing preference in PROJECT-CONTEXT quotes Mikey, an answer or his own words found in one of his messages in DECISIONS (${bullets.length} bullets, ${WAITING.length} older ones waiting; three near misses caught, the third one the old 300-character rule passed)`, bullets.length >= 10 && unquoted.length === 0 && stale.length === 0 && misses.every(Boolean) && besideCaught && runs.length >= 4 && unnamed.length === 0, JSON.stringify({ unquoted: unquoted.map((b) => b.slice(0, 80)), stale, misses, besideCaught, runs: runs.length, unnamed: unnamed.map((i) => i + 1) })); }
// No placeholder left in a doc (pass MT, round one's final read: a pass leaves a name in capitals where a fact comes only at the end,
// and a hurried delivery could ship one). tools/placeholders.mjs lists every name in capitals in the docs that no code has and that
// its KEPT list does not keep on purpose, and the clean step before the delivery zip runs it and refuses while it lists any; the
// docs may hold placeholders mid-pass, so this reads the tool on the real docs and on planted ones: a placeholder written into
// DECISIONS is caught, a name the code has is not, and every kept name is still in a doc and in no code.
{
  const P = await import('../tools/placeholders.mjs');
  const docs = P.docTexts(); const names = P.codeNames(); const live = P.placeholdersIn(docs, names);
  const dec = docs.find((d) => d.file === 'docs/DECISIONS.md');
  const planted = (line) => P.placeholdersIn([{ file: dec.file, text: `${dec.text}\n${line}\n` }], names).filter((x) => x.line > dec.text.split('\n').length);
  const caught = planted('- For future passes: FUTURE_MT').map((x) => x.name).join() === 'FUTURE_MT' && planted('- check.sh passed in MINUTES_TO_FILL minutes.').length === 1;
  const real = planted('- SAY_ALONG_WAITS names the eight older lessons.').length === 0;
  const keptStale = P.KEPT.filter((k) => names.has(k) || !docs.some((d) => d.text.includes(k)));
  const clean = readFileSync(new URL('../tools/checkpoint.sh', import.meta.url), 'utf8'); const cleanRuns = /--clean" \]; then\n\s*node tools\/placeholders\.mjs \|\|/.test(clean);
  ok(`a placeholder left in a doc is found by tools/placeholders.mjs, which the clean step before the delivery zip runs (pass MT; ${live.length} in the docs now, ${names.size} names in the code, ${P.KEPT.length} kept; a planted placeholder caught, a real name passed)`, caught && real && keptStale.length === 0 && cleanRuns && names.has('SAY_ALONG_WAITS'), `caught ${caught}, real ${real}, stale kept ${keptStale.join(',')}, clean runs it ${cleanRuns}`);
}
// check.sh's time limits (pass MT). A limit is there to catch a hang, not a slow machine (pass KU's rule), yet twice a limit set from
// an older, shorter run stopped a passing one: the click-through at 480 seconds in pass KU, and at 720 in pass MT, after 348 of its
// 354 checks (it takes about 695 seconds run alone), where its log read like a crash. Every browser step now runs through check.sh's
// run, which names a step stopped at its limit, while slow notes a step past two thirds of its limit. This runs both helpers as
// check.sh writes them, in a shell of their own with their own file: a hung step is named on its last line and in the file, with its
// code (124) kept, so check.sh still fails it; pass MT's click-through, 695 seconds of 720, is noted, as is a step a second past two
// thirds; and a step at exactly two thirds, a quick step and a failing step's code (1) pass untouched (the near misses). And no step
// calls timeout with a limit of its own outside run (a copy of check.sh with one step put back to a bare timeout is caught). There are
// 17 browser steps since pass MY's fold check (13j).
{
  const { execFileSync } = await import('node:child_process'); const { mkdtempSync, rmSync } = await import('node:fs');
  const { tmpdir } = await import('node:os'); const { join } = await import('node:path');
  const check = readFileSync(new URL('../check.sh', import.meta.url), 'utf8');
  const slowFn = (check.match(/^slow\(\) \{.*\}$/m) || [''])[0]; const runFn = (check.match(/^run\(\) \{[\s\S]*?return "\$code"; \}$/m) || [''])[0];
  const dir = mkdtempSync(join(tmpdir(), 'edu-limits-')); const file = join(dir, 'slow.txt');
  const script = [`slow_file='${file}'; : > "$slow_file"`, slowFn, runFn,
    `run "a hung step" 1 sleep 5 > '${file}.out' 2>&1; echo "code $?" >> '${file}.codes'`,
    `run "a quick step" 30 true; echo "code $?" >> '${file}.codes'`, `run "a failing step" 30 false; echo "code $?" >> '${file}.codes'`,
    'slow "the click-through" 695 720; slow "a step at two thirds" 800 1200; slow "a step a second past two thirds" 801 1200'].join('\n');
  let notes = []; let codes = ''; let last = '';
  try { execFileSync('bash', ['-c', script], { stdio: 'ignore', timeout: 30000 }); notes = readFileSync(file, 'utf8').trim().split('\n');
    codes = readFileSync(`${file}.codes`, 'utf8').trim(); last = readFileSync(`${file}.out`, 'utf8').trim().split('\n').pop(); } catch (e) { notes = [String(e).slice(0, 120)]; }
  rmSync(dir, { recursive: true, force: true });
  const hung = 'TIMEOUT: a hung step was stopped at its 1-second limit';
  const want = [hung, 'NOTE: the click-through took 695 of its 720 seconds', 'NOTE: a step a second past two thirds took 801 of its 1200 seconds'];
  const bare = (text) => text.split('\n').filter((l) => !l.trim().startsWith('#') && /\btimeout \d/.test(l));
  const steps = check.split('\n').filter((l) => /^echo "1[0-3][a-z]?\/13 /.test(l));
  const first = steps.find((l) => / run "[^"]+" \d+ /.test(l)) || ''; const planted = check.replace(first, first.replace(/ run "[^"]+" (\d+) /, ' timeout $1 '));
  // Eighteen browser steps since pass ND's tile edges step (13k, EARMARKS A89), and nineteen since pass NE's paper edges step (13l, EARMARKS A92).
  // Twenty since pass NE's step for the words under the scroll cue (13m, EARMARKS A63).
  // Twenty-two since pass NG's steps for the grown-up's card (13n, Q91) and the note for a browser too old for the app (13o, Q92).
  ok(`check.sh names a browser step stopped at its time limit and notes one past two thirds of it, so a limit is raised before it stops a passing run (pass MT; ${steps.length} browser steps, each through run; the click-through's 695 seconds of 720 noted, a hung step named with its code kept, three near misses passed, a bare timeout caught)`,
    slowFn !== '' && runFn !== '' && notes.length === want.length && want.every((w, i) => notes[i].startsWith(w)) && last.startsWith(hung) && codes === 'code 124\ncode 0\ncode 1'
    && steps.length === 22 && steps.every((l) => / run "[^"]+" \d+ /.test(l)) && bare(check).length === 0 && bare(planted).length === 1,
    JSON.stringify({ notes, codes, last: last.slice(0, 60), steps: steps.length, bare: bare(check).length, planted: bare(planted).length }));
}
// Since pass NG's third read: the next chat's paragraph gives an open question as it now stands, not as first sent (Q97 was corrected
// mid-pass to the eleven kinds that keep their letter beside the card, and the paragraph still gave the yes or no kinds alone). Read here
// for Q97 while it is open: the paragraph's words for it name the eleven kinds; the first text, planted, caught.
{ const nc = readFileSync(new URL('../docs/NEW-CHAT.md', import.meta.url), 'utf8'); const para = (nc.match(/\nAfter pass NG \(2026-11-11\)[^\n]*/) || [''])[0];
  const q97 = (t) => { const m = /Q97: ([^)]*\))/.exec(t); return m ? m[1] : ''; };
  const open97 = /\n- Q97\. /.test(nc);
  const planted = para.replace(q97(para), 'in the yes or no kinds the card shows only what the voice says before the question, the letter and the question after Ready, or it stays as built)');
  ok("the next chat's paragraph gives Q97 as it now stands, the eleven kinds that keep their letter beside the card (pass NG's third read; the first text, planted, caught)", !open97 || (/eleven kinds/.test(q97(para)) && !/eleven kinds/.test(q97(planted))), q97(para).slice(0, 120)); }
// The pass packet (Q95, Mikey's answer in pass NH: "Q95 - A"). The opening message NEW-CHAT asks Mikey to send names the pass packet, and
// HANDOFF's prompt is that message word for word (pass NG's message, planted, caught); and every DECISIONS entry from pass NH on has a
// bullet starting "**The pass packet.**" that names the areas the pass chose and counts the findings traced to a line the packet left out,
// so the areas can be widened where they missed (an entry without the bullet, planted, caught).
{ const nc = readFileSync(new URL('../docs/NEW-CHAT.md', import.meta.url), 'utf8'); const hand = readFileSync(new URL('../docs/HANDOFF.md', import.meta.url), 'utf8');
  const dec = readFileSync(new URL('../docs/DECISIONS.md', import.meta.url), 'utf8');
  const msg = (nc.match(/\n5\. Send: "([^"]+)"/) || [])[1] || ''; const prompt = (hand.match(/## The prompt\n\n([^\n]+)/) || [])[1] || '';
  const okMsg = (m, p) => /read docs\/NEW-CHAT\.md, then the pass packet it asks for/.test(m) && !/docs\/RULES-AUDIT\.md/.test(m) && p === m;
  const old = 'New chat for The Wise Human. Unzip the project, read docs/NEW-CHAT.md, docs/RULES-AUDIT.md, docs/EARMARKS.md, docs/INDEPENDENT-CHECKS.md and the latest DECISIONS entry, then continue. Committed through <pass>.';
  ok("the opening message names the pass packet, and HANDOFF's prompt is that message word for word (pass NH, Q95 (a); pass NG's message, planted, caught)", okMsg(msg, prompt) && !okMsg(old, old) && !okMsg(msg, old), { msg: msg.slice(0, 120), same: prompt === msg });
  const entries = dec.split(/\n(?=## \d{4}-\d{2}-\d{2} \(pass [A-Z]{2}\))/).filter((e) => /^## \d{4}-\d{2}-\d{2} \(pass [A-Z]{2}\)/.test(e));
  const from = (e) => { const p = (e.match(/^## \d{4}-\d{2}-\d{2} \(pass ([A-Z]{2})\)/) || [])[1] || ''; return p.length === 2 && p >= 'NH'; };
  const bullet = /^- \*\*The pass packet\.\*\* .*node tools\/pass-packet\.mjs --areas [a-z0-9,]+.*Findings traced to a line the packet left out: (\d+|none)/m;
  // Each area a bullet names is one the tool has (since pass NH's round one code read: any word passed).
  const { AREAS } = await import('../tools/pass-packet.mjs');
  const areasOf = (e) => ((e.match(/^- \*\*The pass packet\.\*\* .*?--areas ([a-z0-9,]+)/m) || [])[1] || '').split(',').filter(Boolean);
  const missing = entries.filter(from).filter((e) => !bullet.test(e) || !areasOf(e).length || areasOf(e).some((a) => !AREAS[a])).map((e) => e.slice(0, 30));
  const nh = entries.find((e) => /^## \d{4}-\d{2}-\d{2} \(pass NH\)/.test(e)) || '';
  ok('every DECISIONS entry from pass NH on has the pass packet\'s bullet, naming its areas and counting the findings traced to a line the packet left out (pass NH, Q95 (a); the bullet taken out, planted, caught)', nh !== '' && missing.length === 0 && !bullet.test(nh.replace(/^- \*\*The pass packet\.\*\*.*$/m, '')) && areasOf(nh.replace('--areas screens', '--areas screenz')).some((a) => !AREAS[a]), missing); }
// docs/MISTAKE-CLASSES.md counts a pass once in a class's heading (pass NA, the third read: round two's evidence was counted as one
// more pass, so eight headings read "NA and NA since the review"). A heading's list of passes since the review names each pass once;
// the doubled heading is planted.
{ const mc = readFileSync(new URL('../docs/MISTAKE-CLASSES.md', import.meta.url), 'utf8').split('\n').filter((l) => /^### C\d+ /.test(l));
  const twice = (l) => { const m = /\((\d+) passes; (.*) since the review\)$/.exec(l); if (!m) return false; const list = m[2].replace(/ and /, ', ').split(', '); return new Set(list).size !== list.length; };
  ok('no heading of docs/MISTAKE-CLASSES.md names a pass twice in its list since the review (pass NA, the third read; a doubled heading caught)', mc.length >= 35 && !mc.some(twice) && twice('### C10 a wrong choice a child could fairly call right (12 passes; MV, MW, MX, MY, NA and NA since the review)'), mc.filter(twice).join(' | ')); }
// Since pass NE's third read: a round's record says which of its fixes are read by eye. Round two's bullet said every fix had a check
// that fails without it, and three had none, the second pass this came back after pass ND learned it ("A record says what a check holds
// and what is read by eye"), so a check: every line of the newest DECISIONS entry's The checks that claims "a check that fails without
// it" also names what is read by eye. Plant: such a line with no by eye, caught.
{ const dec = readFileSync(new URL('../docs/DECISIONS.md', import.meta.url), 'utf8'); const entry = dec.slice(dec.lastIndexOf('\n## 20'));
  const from = entry.indexOf('\n### The checks'); const to = entry.indexOf('\n### Tests and tools'); const checks = from >= 0 && to > from ? entry.slice(from, to) : '';
  const claims = (txt) => txt.split('\n').filter((l) => l.includes('a check that fails without it'));
  const unnamed = (txt) => claims(txt).filter((l) => !/\bby eye\b/.test(l)).map((l) => l.slice(0, 90));
  const now = unnamed(checks); const plant = unnamed(checks + '\n- **A planted round.** Every fix was applied, each with a check that fails without it.');
  ok(`every round of the newest DECISIONS entry that claims a check that fails without it names what is read by eye (pass NE's third read; ${claims(checks).length} lines read; a round that names none, planted, caught)`, checks.length > 1000 && claims(checks).length >= 3 && now.length === 0 && plant.length === 1, JSON.stringify(now));
}
// No hidden scratch file in the project's folders (pass NI, round two's whole read and code read: two slices of the rules test a scratch tool
// wrote, tests/.blocks-run.mjs and tests/.lines-run.mjs, sat in the tree, and a zip made from inside the folder would carry them into
// Mikey's folder). Every file under src, tools, tests (the browser test's output folders aside) and docs is read for a name that starts with a
// dot, but a Mac's .DS_Store, which Finder makes in Mikey's folder (since the third read's code read); a list with tests/.lines-run.mjs in
// it, planted, is caught, and one with docs/.DS_Store passes.
{ const { readdirSync, statSync } = await import('node:fs');
  const walk = (dir, out = []) => { for (const f of readdirSync(new URL('../' + dir, import.meta.url))) { const rel = `${dir}/${f}`;
    if (/^tests\/e2e\/(out|art)$|node_modules/.test(rel)) continue; if (statSync(new URL('../' + rel, import.meta.url)).isDirectory()) walk(rel, out); else out.push(rel); } return out; };
  const files = ['src', 'tools', 'tests', 'docs'].flatMap((d) => walk(d)); const hidden = (list) => list.filter((f) => { const n = f.split('/').pop(); return n.startsWith('.') && n !== '.DS_Store'; });   // a Mac's Finder makes .DS_Store in Mikey's folder (.gitignore's first line), never a scratch file (the third read's code read)
  ok(`no hidden scratch file sits in src, tools, tests or docs (pass NI, round two; ${files.length} files read; tests/.lines-run.mjs, planted, caught; a Mac's .DS_Store passed, since pass NI's third read)`, files.length >= 150 && hidden(files).length === 0 && hidden([...files, 'tests/.lines-run.mjs']).length === 1 && hidden([...files, 'docs/.DS_Store']).length === 0, hidden(files).join(', ')); }
console.log(`\n${passed} passed, ${failed} failed`);
process.exitCode = failed ? 1 : 0;   // never process.exit(): it can drop the last lines of a piped stdout (CLAUDE.md, 2026-09-23)
