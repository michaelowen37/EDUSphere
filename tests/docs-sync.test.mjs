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
// Since pass NQ (Mikey's answer to Q116, "Q116 - A") section 2 is the app as it stands, rewritten once, and its old heading and lines, as
// pass NP left them, are kept word for word in docs/RULES-AUDIT-HISTORY.md (held by the pass NQ block at the end of this test). The checks
// that read a corrected line of the old section 2 read it there: withOldSection2 gives the rules audit with the old section 2 in place of
// the new, or the audit as it is if either is missing (and then those checks fail, as they should).
const OLD_SECTION_2 = "RULES-AUDIT section 2 as pass NP left it, before pass NQ rewrote it at Mikey's word, word for word";
const withOldSection2 = (auditText, histText) => { const o = `<!-- ${OLD_SECTION_2}: begin -->\n`; const ia = histText.indexOf(o); const ib = histText.indexOf(`<!-- ${OLD_SECTION_2}: end -->`);
  const i2 = auditText.indexOf('\n## 2. The product'); const i3 = auditText.indexOf('\n## 3. Writing: stories');
  return ia >= 0 && ib > ia && i2 >= 0 && i3 > i2 ? auditText.slice(0, i2 + 1) + histText.slice(ia + o.length, ib) + auditText.slice(i3) : auditText; };
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
  const auditThen = withOldSection2(audit, hist);   // since pass NQ, for the checks below that read a line of the old section 2
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
    const said = (auditThen.match(/Corrected in place in pass ND \(Mikey's answer to Q85\)/g) || []).length;
    ok("docs/RULES-AUDIT-HISTORY.md keeps the three rows pass ND corrected in place as pass NC left them (section 2's line, section 4's row and section 6's short breaths), each corrected row says so, and section 9's row for Q85 names them (pass ND, Q85 (b))", /^- \*\*Since pass NC \(Domain III's phonemes/.test(kept) && (kept.match(/Q88 as[k]s Mikey/g) || []).length === 3 && said >= 3 && auditThen.includes('Corrected in pass ND, each read against the code: section 2') && !/Q88 as[k]s Mikey/.test(auditThen) && createHash('sha256').update(kept, 'utf8').digest('hex') === '82144b19b20626b09308aaeafde4cffb105b71b507588e9769a570e11076308c', `${said} rows say so`); }
  // Pass NE's two blocks, held the same way: Q89, which Mikey answered when he opened the pass ("Q89 - A"), and the two rows his answer
  // let pass NE correct in place under Q85 (b), as pass ND left them, each corrected row saying so and section 9's row for Q85 naming them.
  { const o = "<!-- RULES-AUDIT section 11's answered questions in pass NE, word for word: begin -->\n"; const ia = hist.indexOf(o); const ib = hist.indexOf("<!-- RULES-AUDIT section 11's answered questions in pass NE, word for word: end -->");
    const ne = ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : '';
    ok('docs/RULES-AUDIT-HISTORY.md keeps the question answered in pass NE, every line unchanged (pass NE)', /^- Q89\. Answered in pass NE/.test(ne) && ne.includes('The question as it stood: One breath for a hiss in the three letters lessons') && createHash('sha256').update(ne, 'utf8').digest('hex') === '8e583c0def68e2d1fa00a58d6631bc73b509f679216143c6eb39e7d841977634'); }
  { const o = '<!-- RULES-AUDIT rows as pass ND left them, before pass NE corrected them in place, word for word: begin -->\n'; const ia = hist.indexOf(o); const ib = hist.indexOf('<!-- RULES-AUDIT rows as pass ND left them, before pass NE corrected them in place, word for word: end -->');
    const kept = ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : '';
    const said = (auditThen.match(/Corrected in place in pass NE \(Mikey's answer to Q85\)/g) || []).length;
    ok("docs/RULES-AUDIT-HISTORY.md keeps the six rows pass NE corrected in place as pass ND left them (section 2's line, section 4's row on one breath in the letters lessons, and since the pass's own work section 5's row on III.C.2 and III.C.3, section 6's row on a spacing or dots question, section 8's row on writing shown as print and its row on every drawing on an answer tile), each corrected row says so, and section 9's row for Q85 names them (pass NE, Q85 (b))", /^- \*\*Since pass ND \(Domain III's letters and their sounds/.test(kept) && (kept.match(/Q89 as[k]s Mikey/g) || []).length === 2 && ['| **Domain III\'s III.C.2 and III.C.3, read (pass ND', '| **A spacing or dots question is never answered by its look (pass ND', '| **Writing shown as print (pass ND', '| **Every drawing on an answer tile reads at its edge (pass ND'].every((s) => kept.includes('\n' + s)) && said >= 6 && auditThen.includes('Corrected in pass NE, each read against the code: section 2') && auditThen.includes('Corrected in pass NE too, each where the pass\'s own work outgrew it') && !/Q89 as[k]s Mikey/.test(auditThen) && createHash('sha256').update(kept, 'utf8').digest('hex') === '287fe18195c984df8431d824837eb6a4d76d5ea001391467002849251c640b96', `${said} rows say so`); }
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
    const said = (auditThen.match(/Corrected in place in pass NF \(Mikey's answer to Q85\)/g) || []).length + (auditThen.match(/and again in pass NF, its pass NE words there too/g) || []).length;
    // Since p29 four rows more, which the pass's own work outgrew (section 4's one breath, section 5's III.C.2 and III.C.3, and section 8's
    // rows on a lesson's own letters and print and on a drawing beside its dots, EARMARKS A101 and A102), and since p38 section 8's row on
    // no word under the scroll cue on a short phone (EARMARKS A99 and A103, the scroll-cue engineer's work).
    ok("docs/RULES-AUDIT-HISTORY.md keeps the rows pass NF corrected in place as pass NE left them (section 2's pass MP line, section 8's pass MP light-theme row and its row on every drawing on an answer tile, and where the pass's own work outgrew them section 4's row on one breath in the letters lessons, section 5's row on III.C.2 and III.C.3 and section 8's rows on a lesson's own letters and print, on a drawing beside its dots, on every drawing on the dark theme's lesson paper and on no word under the scroll cue on a short phone, and at Mikey's word mid-pass section 9's row on which model a task runs on), each corrected row says so, and section 9's row for Q85 names them (pass NF, Q85 (b))", /^- \*\*Since pass MP \(Mikey's game, sound and story notes/.test(kept) && ['| **Light-theme changes in pass MP, at Mikey\'s word (Q56', '| **Every drawing on an answer tile reads at its edge (pass ND', '**One breath for a hiss in the three letters lessons (pass ND', '| **Domain III\'s III.C.2 and III.C.3, read (pass ND', '| **A lesson\'s own letters and print grow on a wide screen (pass NE', '| **A drawing beside its dots grows on a wide screen (pass ND', '| **Every drawing on the dark theme\'s lesson paper reads at its edge (pass NE', '| **No word under the scroll cue on a short phone (pass NE', '| **Which model a task runs on (Mikey, pass NC:'].every((s) => kept.includes('\n' + s)) && said >= 10 && auditThen.includes('Corrected in pass NF too, at Mikey\'s word ("You may know this already') && auditThen.includes('Corrected in pass NF, each read against the code, since Mikey\'s answer to Q90') && auditThen.includes('Corrected in pass NF too, each where the pass\'s own work outgrew it, read against the code') && !/^- Q90\. A thin edge/m.test(auditThen) && createHash('sha256').update(kept, 'utf8').digest('hex') === 'b5a7e4f709ea8ef6e22c3e72f6b70a3fcaade0966a749fcc656f029b1aff1a48', `${said} rows say so`); }
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
      && auditThen.includes('Corrected in place again in pass NI, at his word (Q98 (a)), its pass NH words there too.') && auditThen.includes('Corrected in place in pass NI (Mikey\'s answer to Q98), its pass NH words in docs/RULES-AUDIT-HISTORY.md.') && auditThen.includes('Corrected in pass NI, at Mikey\'s word (his answer to Q98), each saying so')
      && auditThen.split('and again in pass NI, its pass NF words there too').length === 3 /* since pass NK one of the two goes on, ", and again in pass NK" */ && auditThen.includes('section 4\'s row on one breath for a hiss (ten lessons since Q, V and Y')); }
  // The question answered when pass NJ opened (Q99: skin in the painted looks), in a block of its own with what was built, and the four rows
  // and one line his words of pass NJ changed (section 1's Stay neutral and section 7's reflections row, his Wonder default; section 5's one
  // look per person, Q99; section 5's picture-like drawings, his new order), as pass NI left them, each changed row saying so.
  { const o = "<!-- RULES-AUDIT section 11's answered questions in pass NJ, word for word: begin -->\n"; const ia = hist.indexOf(o); const ib = hist.indexOf("<!-- RULES-AUDIT section 11's answered questions in pass NJ, word for word: end -->");
    const nj = ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : '';
    ok('docs/RULES-AUDIT-HISTORY.md keeps the question answered when pass NJ opened, Q99, every line unchanged, and section 11 answers it in one line and asked Q100 in full until pass NK answered it (pass NJ)', /^- Q99\. Answered in pass NJ/.test(nj) && nj.includes("The question as it stood: Skin in the painted people's looks") && createHash('sha256').update(nj, 'utf8').digest('hex') === '60db346b92aa7288be60a0f89fa0a5ac2df9afe1e5d890551a54563f2900f094'
      && audit.includes('- Q99. Answered in pass NJ (Mikey: "Q99 - A"). Its rule lives in section 5') && (/\n- Q100\. The Wonder Questions tour card's last line/.test(audit) || (/\n- Q100\. Answered in pass NK /.test(audit) && hist.includes("The question as it stood: The Wonder Questions tour card's last line")))); }
  // The questions answered when pass NK opened (Q100 to Q104), in a block of their own with what was built, each answered in one line in
  // section 11, Q105 and Q106 asked there in full until pass NL answered them (each then in pass NL's block, as it stood); and the row
  // his words of pass NK changed (section 8's Wonder Questions on by default), as pass NJ left it.
  { const o = "<!-- RULES-AUDIT section 11's answered questions in pass NK, word for word: begin -->\n"; const ia = hist.indexOf(o); const ib = hist.indexOf("<!-- RULES-AUDIT section 11's answered questions in pass NK, word for word: end -->");
    const nk = ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : '';
    const r0 = "<!-- RULES-AUDIT rows as pass NJ left them, before pass NK changed them at Mikey's word, word for word: begin -->\n"; const ra = hist.indexOf(r0); const rb = hist.indexOf("<!-- RULES-AUDIT rows as pass NJ left them, before pass NK changed them at Mikey's word, word for word: end -->");
    const kept = ra >= 0 && rb > ra ? hist.slice(ra + r0.length, rb) : '';
    ok('docs/RULES-AUDIT-HISTORY.md keeps the questions answered when pass NK opened, Q100 to Q104, every line unchanged, and the Wonder row as pass NJ left it; section 11 answers each in one line and asks Q105 and Q106 in full, or since pass NL answers them with their words in its block (pass NK)', [100, 101, 102, 103, 104].every((n) => new RegExp('^- Q' + n + '\\. Answered in pass NK', 'm').test(nk) && new RegExp('\\n- Q' + n + '\\. Answered in pass NK \\(Mikey: ').test(audit))
      && createHash('sha256').update(nk, 'utf8').digest('hex') === '8fc7d7a48696e173fee47c2e507edca4655fef56fa8dd97f5994600bfef94c31' && /^\| \*\*Wonder Questions on by default/.test(kept) && createHash('sha256').update(kept, 'utf8').digest('hex') === 'c1070cec7bc94dbac54ecca86bfc6f3e642c8b341d82e127026724ea01c1e1c9'
      && (/\n- Q105\. The Wonder Questions page's card line/.test(audit) || (/\n- Q105\. Answered in pass NL /.test(audit) && hist.includes("The question as it stood: The Wonder Questions page's card line beside the words on its buttons")))
      && (/\n- Q106\. The add-a-student tip's pointer/.test(audit) || (/\n- Q106\. Answered in pass NL /.test(audit) && hist.includes("The question as it stood: The add-a-student tip's pointer to the Wonder card")))); }
  // The rows pass NK corrected in place under Mikey's answer to Q85, as pass NJ left them, in a block of their own held by a digest (round three's
  // whole read of RULES-AUDIT found the block held by none): the two the pass corrected as it wrote its records and the nine round three's
  // whole read found the code had outgrown, each corrected row saying so and section 9's row for Q85 naming them.
  { const o = "<!-- RULES-AUDIT rows as pass NJ left them, before pass NK corrected them under Mikey's answer to Q85, word for word: begin -->\n"; const ia = hist.indexOf(o); const ib = hist.indexOf("<!-- RULES-AUDIT rows as pass NJ left them, before pass NK corrected them under Mikey's answer to Q85, word for word: end -->");
    const kept = ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : '';
    const OPENINGS = ["| **Domain III's III.C.2 and III.C.3, read (pass ND", '| **What pass NJ learned', 'What is written and checked today: the audio ledger', '**The voices a lesson shows (pass MV', '| **Q, V and Y, and a name\'s letters in order, read', '| **A tapped choice that would hand over the answer stays quiet', '| **A picture answer tells a screen reader its name', '| **A question about what a child heard asks only what every device voice can show', '| **A pre-reader hears all four Wonder voices', '| **A lone letter keeps the word before it on a lesson line', "| **The grown-up's card on a device with no voice", '| **No word under the scroll cue on a short phone', '| **Every drawing on an answer tile reads at its edge', "| **Every drawing on the dark theme's lesson paper reads at its edge"];
    const rows = kept.split('\n').filter(Boolean);
    const said = audit.split('Corrected in place in pass NK (Mikey\'s answer to Q85; round three\'s whole read of this file), its old words in docs/RULES-AUDIT-HISTORY.md.').length - 1;
    const saidAgain = audit.split('Corrected in place again in pass NK (Mikey\'s answer to Q85; check.sh\'s second run of the pass), its pass NJ words there too.').length - 1;
    ok("docs/RULES-AUDIT-HISTORY.md keeps the rows pass NK corrected under Q85 as pass NJ left them, eleven since round three's whole read of RULES-AUDIT and fourteen since check.sh's second run, in RULES-AUDIT's order after the first two, each held by its digest; each corrected row says so and section 9's row for Q85 names them (pass NK)",
      rows.length === 14 && OPENINGS.every((w, k) => rows[k] && rows[k].startsWith(w)) && createHash('sha256').update(kept, 'utf8').digest('hex') === 'db4b09132a7b68d343e465c9b4faf0bd5f3aabd39f5bb5af35c890b613ab0812'
      && said === 8 && saidAgain === 3 && audit.includes('Corrected in place again in pass NK (Mikey\'s answer to Q85; round three\'s whole read of this file, which found it and the card\'s browser test at pass NI\'s counts), its pass NJ words there too.')
      && audit.includes("and, since round three's whole read of this file, read against the code: section 4's paragraph on the audio ledger"), JSON.stringify({ rows: rows.length, said, saidAgain })); }
  // The questions answered in pass NL (Q105 and Q106 at its opening, Q107 raised and answered in the pass), in a block of their own with
  // what was built, each answered in one line in section 11; the rows his words of pass NL changed (section 2's My Classroom line and
  // section 8's rows on the tour cards and on Wonder Questions on by default), as pass NK left them; and the nine rows pass NL corrected
  // under Q85, as pass NK left them, in RULES-AUDIT's order. Each block is held by its digest, each changed or corrected row says so, and
  // section 9's row for Q85 names them.
  { const block = (name) => { const o = `<!-- ${name}: begin -->\n`; const ia = hist.indexOf(o); const ib = hist.indexOf(`<!-- ${name}: end -->`); return ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : ''; };
    const digest = (t) => createHash('sha256').update(t, 'utf8').digest('hex');
    const nl = block("RULES-AUDIT section 11's answered questions in pass NL, word for word");
    const word = block("RULES-AUDIT rows as pass NK left them, before pass NL changed them at Mikey's word, word for word");
    const q85 = block("RULES-AUDIT rows as pass NK left them, before pass NL corrected them under Mikey's answer to Q85, word for word");
    const OPEN85 = ["- **Since pass NK (Mikey's answers to Q100 to Q104", '| **The vowels, small letters, end marks and shapes of any size and any turn, read (pass NK', "| **Pass NK's banks are worked out from what they say and show", '| **A pre-reader hears all four Wonder voices', '| **A demonstration does what its words say', '| **No word under the scroll cue on a short phone', '| **A lone letter keeps the word before it on a lesson line', "| **The grown-up's card on a device with no voice", '| **A student signed out after fifteen quiet minutes', '| **CLAUDE.md in two parts, never summarized', "| **The owner's listening waits for the recordings", '| **An id is defined once', "| **A picture of a screen read by eye is the screen's own size", '| **The records written once, each count filled in from the code'];
    const rows85 = q85.split('\n').filter(Boolean); const rowsWord = word.split('\n').filter(Boolean);
    const said = auditThen.split("Corrected in place in pass NL (Mikey's answer to Q85), its pass NK words in docs/RULES-AUDIT-HISTORY.md.").length - 1;
    const saidAgain = auditThen.split("Corrected in place again in pass NL (Mikey's answer to Q85), its pass NK words there too.").length - 1;
    ok("docs/RULES-AUDIT-HISTORY.md keeps the questions answered in pass NL, Q105 to Q107, every line unchanged, each answered in one line in section 11 and none open after it; the four rows his words of pass NL changed and the fourteen it corrected under Q85 (nine before round three's whole read of RULES-AUDIT), as pass NK left them, each block held by its digest, each row saying so and section 9's row for Q85 naming them (pass NL)",
      [105, 106, 107].every((n) => new RegExp('^- Q' + n + '\\. Answered in pass NL \\(Mikey: ', 'm').test(nl) && new RegExp('\\n- Q' + n + '\\. Answered in pass NL \\(Mikey: ').test(auditThen) && new RegExp('^- Q' + n + '\\. .*The question as it stood: ', 'm').test(nl))
      && digest(nl) === '96fa0f36f50ab936515a57c5265c470289a437572718bf64827e5193b9d3635b' && rowsWord.length === 4 && rowsWord[0].startsWith('- **My Classroom:**') && rowsWord[1].startsWith('| Tour cards look like the page they explain') && rowsWord[2].startsWith('| **Wonder Questions on by default') && rowsWord[3].startsWith('- Q100. Answered in pass NK') && digest(word) === '515b85c71f4ab2236779593faacb427ad492a50a6a665c985fcec1dbfda8e0d0'
      && rows85.length === 14 && OPEN85.every((w, k) => rows85[k] && rows85[k].startsWith(w)) && digest(q85) === 'a363aa63845fc88247e804c21e078acda4fe7faa9415636b0815ddb95ce137af' && said === 10 && saidAgain === 4
      && auditThen.includes("Changed in place again in pass NL, at Mikey's word (his answer to Q106), its pass NK words in docs/RULES-AUDIT-HISTORY.md.") && auditThen.includes('(changed at his word in pass NL, its pass NK words there too)') && auditThen.includes('and again in pass NL, at his word (his answers to Q105, Q106 and Q107 and his words for the two cards), its pass NK words there too.')
      && auditThen.includes("Corrected in pass NL, under Mikey's answer to Q85, each saying so,") && auditThen.includes("Changed in pass NL, at Mikey's word (his answers to Q105, Q106 and Q107 and his words for the two Wonder cards), each saying so,")
      && !/\n- Q10[5-7]\. (?!Answered)/.test(auditThen), JSON.stringify({ nl: digest(nl).slice(0, 12), word: digest(word).slice(0, 12), q85: digest(q85).slice(0, 12), rowsWord: rowsWord.length, rows85: rows85.length, said, saidAgain })); }
  // The question answered in pass NM (Q108, asked by the dialog at its start and answered at once, "Three lessons, about 15"), in a block
  // of its own with what was built and the question in gist, its words not kept past the chat's summary; answered in one line in section
  // 11; the row his answer changed (section 9's row on a pass of six lessons in two waves), as pass NL left it; and, since round three's
  // whole read of RULES-AUDIT's second half (the block had been held by nothing), the nine rows pass NM corrected under Q85 as pass NL left
  // them: section 8's rows on no word under the scroll cue and on the reading light, section 5's on a painting and its line, section 6's on
  // a picture answer's name, section 7's on the four Wonder voices, section 9's on an id defined once and on which model a task runs on,
  // and, from the lead's runs after round three, section 8's on the tile and paper edges, their floors at the pass's counts. Each block is held by its digest,
  // each changed or corrected row says so, and section 9's row for Q85 names them.
  { const block = (name) => { const o = `<!-- ${name}: begin -->\n`; const ia = hist.indexOf(o); const ib = hist.indexOf(`<!-- ${name}: end -->`); return ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : ''; };
    const digest = (t) => createHash('sha256').update(t, 'utf8').digest('hex');
    const nm = block("RULES-AUDIT section 11's answered questions in pass NM, word for word");
    const word = block("RULES-AUDIT rows as pass NL left them, before pass NM changed them at Mikey's word, word for word"); const rowsWord = word.split('\n').filter(Boolean);
    const q85 = block("RULES-AUDIT rows as pass NL left them, before pass NM corrected them under Mikey's answer to Q85, word for word"); const rows85 = q85.split('\n').filter(Boolean);
    const OPEN85 = ['| **No word under the scroll cue on a short phone', '| **A painting and its line (pass ML', '| **A picture answer tells a screen reader its name (pass MO', '| **A pre-reader hears all four Wonder voices', '| **The reading light never moves the words', '| **An id is defined once (pass MX)', '| **Which model a task runs on (Mikey, pass NC', '| **Every drawing on an answer tile reads at its edge (pass ND', "| **Every drawing on the dark theme's lesson paper reads at its edge (pass NE"];
    const said = audit.split("Corrected in place in pass NM (Mikey's answer to Q85), its pass NL words in docs/RULES-AUDIT-HISTORY.md.").length - 1;
    const saidAgain = audit.split("Corrected in place again in pass NM (Mikey's answer to Q85), its pass NL words there too.").length - 1;
    ok("docs/RULES-AUDIT-HISTORY.md keeps the question answered in pass NM, Q108, unchanged, answered in one line in section 11 and none open after it, the row his answer changed and the nine rows pass NM corrected under Q85 as pass NL left them, each block held by its digest, each row saying so and section 9's row for Q85 naming them (pass NM)",
      /^- Q108\. Answered in pass NM \(Mikey: "Three lessons, about 15"\)/m.test(nm) && /^- Q108\. .*The question as it stood: /m.test(nm) && /\n- Q108\. Answered in pass NM \(Mikey: "Three lessons, about 15", picked in the dialog at the pass's start\)\. Its rule lives in section 9 /.test(audit)
      && digest(nm) === 'b611a2c7616ed4c7872a7b48cb157afbea9694337d46a2f71c0747edafc004d9' && rowsWord.length === 1 && rowsWord[0].startsWith('| **A pass of six lessons in two waves, tried (Mikey\'s answer to Q101') && digest(word) === '1424bb1ac9a72bc856c09fa9f1ac366a5da2943f87a4f7455a141c6fed861a2b'
      && audit.includes("Changed in place in pass NM, at Mikey's word (his answer to Q108), its pass NL words in docs/RULES-AUDIT-HISTORY.md.") && audit.includes("Changed in pass NM, at Mikey's word (his answer to Q108), saying so,")
      && rows85.length === 9 && OPEN85.every((w, k) => rows85[k] && rows85[k].startsWith(w)) && digest(q85) === '2c46b86e87ab46ff8b13fb739aa383f8b93965d5c3dfd21875cf2a1a79258c2c' && said === 3 && saidAgain === 6
      && audit.includes("Corrected in pass NM, under Mikey's answer to Q85, saying so,") && audit.includes("And since round three's whole reads of this file: section 5's row on a painting and its line")
      && !/\n- Q108\. (?!Answered)/.test(audit), JSON.stringify({ nm: digest(nm).slice(0, 12), word: digest(word).slice(0, 12), q85: digest(q85).slice(0, 12), rowsWord: rowsWord.length, rows85: rows85.length, said, saidAgain })); }
  { const o = "<!-- RULES-AUDIT rows as pass NI left them, before pass NJ changed them at Mikey's word, word for word: begin -->\n"; const ia = hist.indexOf(o); const ib = hist.indexOf("<!-- RULES-AUDIT rows as pass NI left them, before pass NJ changed them at Mikey's word, word for word: end -->");
    const kept = ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : '';
    ok("docs/RULES-AUDIT-HISTORY.md keeps the rows and lines pass NJ changed at Mikey's word as pass NI left them (Stay neutral, one look per person, the picture-like drawings and the reflections row; and since round two's whole read My Classroom's line, the two sound paragraphs, Wonder text, the plan's audio paragraph and Q5's line), each changed one says so, and none of the old approval sentences stands (pass NJ)", /^- \*\*Stay neutral\.\*\* Four voices and none is right\. Nothing argues for or against religion\. Nothing reaches a child until the school approves it\./.test(kept) && kept.includes('\n| **One look per person, and what a picture tells apart') && kept.includes("\n| **The app's picture-like drawings, painted as their own set after the review") && kept.includes('every course has at least one; nothing offered until approved;') && createHash('sha256').update(kept, 'utf8').digest('hex') === '0f17b3c3973d6553f6d5b64047ea1e48eb2ddc2f19bf840e66f0e355579bbf63'
      && kept.includes('Wonder questions to review (nothing reaches a child until approved).') && kept.includes('Separately, and unchanged, a question reaches a student only after an educator approves it in the app') && kept.includes('- Q5. Answered in pass MF') && !audit.includes('Wonder questions to review (nothing reaches a child until approved).') && !audit.includes('Separately, and unchanged, a question reaches a student only after an educator approves it in the app') && !audit.includes("Its rule lives in src/logic.mjs (an educator's approval kept by the Wonder question's id) and section 9.")
      && audit.includes('Changed in pass NJ at Mikey\'s word ("I think I want the wonder questions pre-approved by default too"), its old words in docs/RULES-AUDIT-HISTORY.md.') && audit.includes('Changed in pass NJ at his word (Q99 (a)), its pass NI words in docs/RULES-AUDIT-HISTORY.md.') && audit.includes('since pass NJ at Mikey\'s word, "I think I want the wonder questions pre-approved by default too"; nothing was offered until approved before it') && !/every course has at least one; nothing offered until approved;/.test(audit)); }
  // The row pass NJ corrected in place under Mikey's answer to Q85 (section 9's row on what every pass reads and does, which said check.sh
  // is started and polled, where since pass NJ CLAUDE.md says it is waited for by a background job; the weekly flow review found it), as
  // pass NI left it, the corrected row saying so and section 9's row for Q85 naming it.
  { const o = "<!-- RULES-AUDIT rows as pass NI left them, before pass NJ corrected them under Mikey's answer to Q85, word for word: begin -->\n"; const ia = hist.indexOf(o); const ib = hist.indexOf("<!-- RULES-AUDIT rows as pass NI left them, before pass NJ corrected them under Mikey's answer to Q85, word for word: end -->");
    const kept = ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : '';
    ok("docs/RULES-AUDIT-HISTORY.md keeps the rows pass NJ corrected under Q85 as pass NI left them (what every pass reads and does: check.sh started and polled; and since round two's whole read the coloring trial's row), each says so and section 9's row for Q85 names them (pass NJ)", /^\| Every pass: read NEW-CHAT, the pass packet/.test(kept) && kept.includes('started and polled to the end inside one turn;') && createHash('sha256').update(kept, 'utf8').digest('hex') === 'b88de01077bd1c5d1abacd913633b4eb9b51c6727fa423cdf47ddc37b0bbb570'
      && kept.includes('\n| **The coloring trial, then Lucid Origin') && audit.includes('(since pass NJ last within each build, the art ledger\'s row below:') && kept.includes('\n| Tour cards look like the page they explain (Mikey, pass LI):') && audit.includes("In pass NJ the Wonder card's last line, made untrue by his new default, was replaced with Claude's words and asked as Q100")
      && audit.includes('started detached and waited for to the end by a background job inside one turn;') && !audit.includes('started and polled to the end inside one turn;') && audit.includes("Corrected in place again in pass NJ (Mikey's answer to Q85), where it said check.sh is started and polled, its pass NI words there too.") && audit.includes("Corrected in pass NJ, read against what a pass does: section 9's row on what every pass reads and does")); }
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
  // since pass NB, which is no copy of the history and is read here no more than CLAUDE.md's own Lines added since pass MS. Since pass NL
  // that section is in docs/CLAUDE-HISTORY.md (the pass NL block below), and the slice runs to part two's end.
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
    // Since pass NJ the lines it corrected (Reflection questions, at Mikey's word; check.sh's time and how to wait for it) count as kept too.
    const njOpen = '<!-- CLAUDE.md lines as pass NI left them, before pass NJ corrected them, word for word: begin -->\n'; const njA = hist.indexOf(njOpen); const njB = hist.indexOf('<!-- CLAUDE.md lines as pass NI left them, before pass NJ corrected them, word for word: end -->');
    for (const l of (njA >= 0 && njB > njA ? hist.slice(njA + njOpen.length, njB).split('\n') : [])) ngKept.add(l);
    // Since pass NL the four lines it corrected (three on check.sh's time and when to run it, and the line on CLAUDE.md's parts) count as kept too.
    const nlOpen = '<!-- CLAUDE.md lines as pass NK left them, before pass NL corrected them, word for word: begin -->\n'; const nlA = hist.indexOf(nlOpen); const nlB = hist.indexOf('<!-- CLAUDE.md lines as pass NK left them, before pass NL corrected them, word for word: end -->');
    for (const l of (nlA >= 0 && nlB > nlA ? hist.slice(nlA + nlOpen.length, nlB).split('\n') : [])) ngKept.add(l);
    // Since pass NQ the four lines it corrected after round three's records read (the Backups line, and three on check.sh's time) count as kept too.
    const nqOpen = '<!-- CLAUDE.md lines as pass NP left them, before pass NQ corrected them, word for word: begin -->\n'; const nqA = hist.indexOf(nqOpen); const nqB = hist.indexOf('<!-- CLAUDE.md lines as pass NP left them, before pass NQ corrected them, word for word: end -->');
    for (const l of (nqA >= 0 && nqB > nqA ? hist.slice(nqA + nqOpen.length, nqB).split('\n') : [])) ngKept.add(l);
    // Since pass NR its line on running the rules test alone (a heap of 4 GB, after the final run of 1:48 PM stopped out of memory) counts as kept too.
    const nrOpen = "<!-- CLAUDE.md's line on the rules test as pass NQ left it, before pass NR changed it, word for word: begin -->\n"; const nrA = hist.indexOf(nrOpen); const nrB = hist.indexOf("<!-- CLAUDE.md's line on the rules test as pass NQ left it, before pass NR changed it, word for word: end -->");
    for (const l of (nrA >= 0 && nrB > nrA ? hist.slice(nrA + nrOpen.length, nrB).split('\n') : [])) ngKept.add(l);
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
    // Since pass NL the section is read where it moved word for word, the history's pass NL block, as part three's index says.
    const movedOpen = "<!-- CLAUDE-PART-2.md's and CLAUDE-PART-3.md's lines moved in pass NL, word for word: begin -->\n"; const mvA = hist.indexOf(movedOpen); const mvB = hist.indexOf("<!-- CLAUDE-PART-2.md's and CLAUDE-PART-3.md's lines moved in pass NL, word for word: end -->");
    const part3 = mvA >= 0 && mvB > mvA ? hist.slice(mvA + movedOpen.length, mvB) : '';
    const ms = (t) => { const a = t.indexOf('## Lines added since pass MS\n'); const b = t.indexOf('\n## Lines added since pass NG\n'); return a >= 0 && b > a ? t.slice(a, b) : ''; };   // the section's own last newline, not the blank line after it
    const MS_DIGEST = '71e79518df7893a6126b1ebc1ccf93088b49a0585c20840452c6fe9975c41d56'; const NG_DIGEST = 'ceee5127665b864b2508a9cd4f72746529de0d4a393f57cae364d7169357d4f1';
    const msOut = ms(part3).split('\n'); const plants = [digest(kept.replace('every letter starts at the top', 'every letter starts at its top')) !== NG_DIGEST, digest([...msOut.slice(0, 3), ...msOut.slice(4)].join('\n')) !== MS_DIGEST];
    ok('docs/CLAUDE-HISTORY.md keeps the five CLAUDE.md lines pass NG corrected, its heading over the parts and four lines of part two, as pass NF left them, RULES-AUDIT section 9 names them, and CLAUDE.md\'s Lines added since pass MS are kept word for word, in CLAUDE-PART-3.md from pass NG and in docs/CLAUDE-HISTORY.md\'s pass NL block since pass NL (pass NG; two near misses caught)',
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
      // Since pass NS (Mikey's answer to Q120, "Q120 - A") the first line names RULES-AUDIT's sections 9 to 11 and each agent's own rows in
      // the pass packet's place, a change pass NS's own block holds whole.
      && (/^New chats: read docs\/NEW-CHAT\.md first, then the pass packet it asks for \(node tools\/pass-packet\.mjs/.test(manual) || /^New chats: read docs\/NEW-CHAT\.md first, then docs\/RULES-AUDIT\.md's sections 9 to 11 whole and the latest docs\/DECISIONS\.md entry, [^\n]*\(Mikey's answer to Q120, pass NS; from pass NH a pass packet stood in their place\)/.test(manual)) && row.includes("Corrected in pass NH, at Mikey's word (his answer to Q95, \"Q95 - A\")")); }
  // The four lines pass NJ corrected (CLAUDE.md's Reflection questions, at Mikey's word of pass NJ; CLAUDE.md's line on check.sh's time
  // and part two's Running check.sh, which said about ten minutes and to poll; and since round one's code read part two's Wonder text
  // line, which said an educator's approval in the app is unchanged), kept word for word under a digest, the new lines in place. Since pass
  // NQ (round three's records read) the two time lines say about three hours, so their words as pass NP left them, the new lines of pass
  // NJ, are read in the history's pass NQ blocks in their place.
  { const o = '<!-- CLAUDE.md lines as pass NI left them, before pass NJ corrected them, word for word: begin -->\n'; const ia = hist.indexOf(o); const ib = hist.indexOf('<!-- CLAUDE.md lines as pass NI left them, before pass NJ corrected them, word for word: end -->');
    const kept = ia >= 0 && ib > ia ? hist.slice(ia + o.length, ib) : ''; const digest = (t) => createHash('sha256').update(t, 'utf8').digest('hex'); const NJ_DIGEST = '7fdb977f0f53a9b034f2700563c03b107588cb280530e72e21dab7b0ef162f3b';
    const part2 = readFileSync(new URL('../CLAUDE-PART-2.md', import.meta.url), 'utf8');
    const slice = (name) => { const o2 = `<!-- ${name}: begin -->\n`; const a2 = hist.indexOf(o2); const b2 = hist.indexOf(`<!-- ${name}: end -->`); return a2 >= 0 && b2 > a2 ? hist.slice(a2 + o2.length, b2) : ''; };
    const nqKept = slice('CLAUDE.md lines as pass NP left them, before pass NQ corrected them, word for word'); const nqRun = slice("CLAUDE-PART-2.md's line on running check.sh as pass NP left it, before pass NQ changed it, word for word");
    ok("docs/CLAUDE-HISTORY.md keeps the four lines pass NJ corrected as pass NI left them (Reflection questions, opt in until Mikey's word; check.sh's time and how to wait for it, here and in part two; part two's Wonder text line), and the new lines stand (pass NJ; a word changed in the block, planted, caught)",
      /^- Reflection questions are opt in: nothing reaches a student until somebody at the school approves it\./.test(kept) && kept.includes('\n- check.sh takes about ten minutes, so start it detached and poll it') && kept.includes('\n- Running check.sh (2026-09-28): it takes about ten minutes') && digest(kept) === NJ_DIGEST && digest(kept.replace('deliberate', 'deliberated')) !== NJ_DIGEST && kept.includes('deliberate')
      && manual.includes('- Reflection questions are on by default since pass NJ (Mikey:') && (manual.includes('- check.sh takes about two and a half hours (149 minutes in pass NI)') || (manual.includes('- check.sh takes about three hours (') && nqKept.includes('\n- check.sh takes about two and a half hours (149 minutes in pass NI)')))
      && (part2.includes('- Running check.sh (2026-09-28): it takes about two and a half hours') || (part2.includes('- Running check.sh (2026-09-28): it takes about three hours (') && nqRun.startsWith('- Running check.sh (2026-09-28): it takes about two and a half hours'))) && !/check\.sh takes about ten minutes/.test(manual)
      && kept.includes("\n- Wonder text (Mikey, pass MB): ") && kept.includes("An educator's approval in the app is unchanged.") && part2.includes("In the app, an educator's approval gave way in pass NJ, at Mikey's word, to every question starting on") && !part2.includes("An educator's approval in the app is unchanged.")); }
  // Pass NL, at Mikey's word ("Feel free to edit all Claude files at your discretion only when you think it's feasible to do so and that it
  // won't impact our product as a whole.  These edits would probably be good to double check with the advisor (if any are made)"): the 23
  // lines added from pass MS to NK, each one pass's design record (part two's Lines added since pass NB and part three's two sections),
  // moved word for word to docs/CLAUDE-HISTORY.md between two markers held by their digest; part three's index names each by its heading
  // (its words before its first colon outside parentheses) and the code names and files it mentions, both ways, so a line moved without an
  // entry, or an entry with no line, fails; and four CLAUDE.md lines corrected in place (three on check.sh's time and when to run it, one on
  // CLAUDE.md's parts), their words as pass NK left them in a block of their own, RULES-AUDIT section 9's row naming the change. The three
  // files together stay under 64,000 bytes, so the manual every session loads does not grow back into a history unnoticed: when a new line
  // would pass it, move a feature's design record word for word to the history, as pass NL did, or raise the bound with its reason in
  // RULES-AUDIT section 9. Near misses: a word changed in the moved block, an entry left out of the index, a line put back in part three,
  // and a word changed in the corrections block.
  { const digest = (t) => createHash('sha256').update(t, 'utf8').digest('hex');
    const between = (o, c) => { const a = hist.indexOf(o); const b = hist.indexOf(c); return a >= 0 && b > a ? hist.slice(a + o.length, b) : ''; };
    const moved = between("<!-- CLAUDE-PART-2.md's and CLAUDE-PART-3.md's lines moved in pass NL, word for word: begin -->\n", "<!-- CLAUDE-PART-2.md's and CLAUDE-PART-3.md's lines moved in pass NL, word for word: end -->");
    const fixed = between('<!-- CLAUDE.md lines as pass NK left them, before pass NL corrected them, word for word: begin -->\n', '<!-- CLAUDE.md lines as pass NK left them, before pass NL corrected them, word for word: end -->');
    const MOVED_DIGEST = 'c95b522cd9a332e02083f5abe3ce9a125c70d9bd40333781f61ec32e85f55e34'; const FIXED_DIGEST = 'dd63fb2424a1803b202bd8334b98668f8deff495348b720cd88be9e12d374433';
    const p2 = readFileSync(new URL('../CLAUDE-PART-2.md', import.meta.url), 'utf8'); const p3 = readFileSync(new URL('../CLAUDE-PART-3.md', import.meta.url), 'utf8');
    const headingOf = (line) => { const t = line.slice(2); let depth = 0;
      for (let i = 0; i < t.length; i++) { const ch = t[i]; if (ch === '(') depth++; else if (ch === ')') depth = Math.max(0, depth - 1); else if (ch === ':' && depth === 0) return t.slice(0, i); }
      depth = 0; let words = 0;   // no colon outside parentheses: the words before the first parenthesis, outside any, after the tenth word
      for (let i = 0; i < t.length; i++) { const ch = t[i]; if (ch === ' ' && depth === 0) words++; if (ch === '(') { if (depth === 0 && words >= 10) return t.slice(0, i).trimEnd(); depth++; } else if (ch === ')') depth = Math.max(0, depth - 1); }
      return null; };
    // The names an entry lists (widened by the Fable check, pass NL, which found FitText, SCENES, data-cue-room and check.sh in moved lines and
    // in no entry): file paths, .claude files, check.sh and build.sh, window.__ names, data- attributes, CONSTANT_CASE, single words in
    // capitals of five letters or more, PascalCase and camelCase.
    const NAME = /(?:tests\/e2e\/|tests\/|tools\/|src\/|docs\/)[\w.\/-]+\.(?:mjs|md|csv|jsx)|\.claude\/[\w.\/-]+\.(?:json|md)|\b(?:check|build)\.sh\b|window\.__\w+|\bdata-[a-z]+(?:-[a-z]+)*|\b[A-Z][A-Z0-9]*_[A-Z0-9_]+\b|(?<![\w-])[A-Z]{5,}(?![\w-])|\b[A-Z][a-z0-9]+(?:[A-Z][a-z0-9]+)+\b|\b[a-z]+[A-Z][A-Za-z0-9]+\b/g;
    const entryOf = (l) => { const names = [...new Set(l.match(NAME) || [])]; return `- ${headingOf(l)}.` + (names.length ? ` Names: ${names.join(', ')}.` : ''); };
    const indexOf = (t) => { const a = t.indexOf('## Lines moved in pass NL'); const b = t.indexOf('\n## Lines added since pass NL'); return a < 0 || b < a ? [] : t.slice(a, b).split('\n').filter((l) => l.startsWith('- ')); };
    const movedLines = moved.split('\n').filter((l) => l.startsWith('- '));
    const indexed = (t, m) => JSON.stringify(indexOf(t)) === JSON.stringify(m.split('\n').filter((l) => l.startsWith('- ')).map(entryOf));
    // A moved line back in a part, whole or edited (the Fable check put one back with a word changed, and it passed): no line of part two, or
    // of part three outside its index, opens with a moved line's heading.
    const outsideIndex = (t) => { const a = t.indexOf('## Lines moved in pass NL'); const b = t.indexOf('\n## Lines added since pass NL'); return a < 0 || b < a ? t : t.slice(0, a) + t.slice(b); };
    const opens = movedLines.map((l) => '- ' + headingOf(l));
    const parts = (a, b) => !a.includes('## Lines added since pass NB') && !b.includes('## Lines added since pass MS') && !b.includes('## Lines added since pass NG') && !movedLines.some((l) => a.includes(l) || b.includes(l))
      && ![...a.split('\n'), ...outsideIndex(b).split('\n')].some((l) => opens.some((o) => l.startsWith(o)));
    const size = Buffer.byteLength(manual, 'utf8') + Buffer.byteLength(p2, 'utf8') + Buffer.byteLength(p3, 'utf8');
    const plants = [digest(moved.replace('one breath', 'one-breath')) !== MOVED_DIGEST && moved.includes('one breath'), !indexed(p3.replace(indexOf(p3)[4] + '\n', ''), moved), !parts(p2, p3 + '\n' + movedLines[7] + '\n'), digest(fixed.replace('about ten', 'about twelve')) !== FIXED_DIGEST && fixed.includes('about ten'),
      (() => { const l = movedLines[2]; const h = ('- ' + headingOf(l)).length; const edited = l.slice(0, h) + l.slice(h).replace(' the ', ' a '); return edited !== l && !parts(p2 + '\n' + edited + '\n', p3); })()];   // a word changed after its heading
    ok(`CLAUDE-PART-2.md's and CLAUDE-PART-3.md's 23 lines added from pass MS to NK are kept word for word in docs/CLAUDE-HISTORY.md, part three's index names each both ways, four CLAUDE.md lines corrected keep their old words, RULES-AUDIT section 9 names the change, and the three files stay under 64,000 bytes (pass NL; ${size} bytes; five near misses caught)`,
      digest(moved) === MOVED_DIGEST && movedLines.length === 23 && moved.includes('## Lines added since pass NB\n') && moved.includes('## Lines added since pass MS\n') && moved.includes('## Lines added since pass NG\n')
      && indexed(p3, moved) && parts(p2, p3) && digest(fixed) === FIXED_DIGEST && fixed.split('\n').filter((l) => l.trim()).length === 4
      && !/check\.sh takes about ten/.test(manual) && !/the whole of check\.sh takes about ten/.test(manual) && manual.includes('which holds an index of the lines added from pass MS to NK and the lines added since pass NL')
      && row.includes("Corrected in pass NL, at Mikey's word") && size < 64000 && plants.every(Boolean), JSON.stringify({ moved: digest(moved).slice(0, 12), fixed: digest(fixed).slice(0, 12), index: indexOf(p3).length, size, plants })); }
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
// TEA's guidelines page looked at in each pass that cites pre-K (EARMARKS L17; pass NM, round three's whole reads of EARMARKS and of
// INDEPENDENT-CHECKS: passes NJ, NL and NM each cited pre-K codes and recorded no look until a later read found it missing): when the
// newest DECISIONS entry cites a 2027 pre-K code (PK3 or PK4 and a code), L17 says "Checked in pass" and that entry's pass. The row with
// that pass's clause renamed, planted, is caught.
{ const dec = readFileSync(new URL('../docs/DECISIONS.md', import.meta.url), 'utf8'); const ear = readFileSync(new URL('../docs/EARMARKS.md', import.meta.url), 'utf8');
  const heads = [...dec.matchAll(/^## (\d{4}-\d{2}-\d{2})[^\n]*$/gm)]; const last = heads[heads.length - 1];
  const code = last ? ((last[0].match(/\(pass ([A-Z]{2})\)/) || [])[1] || '') : ''; const end = last ? dec.indexOf('\n## ', last.index + 5) : -1;
  const body = last ? dec.slice(last.index, end < 0 ? dec.length : end) : ''; const cites = /\bPK[34] [IVX]+\.[A-Z]\.\d/.test(body);
  const l17 = ear.split('\n').find((l) => l.startsWith('| L17 |')) || ''; const names = (row) => !!code && row.includes(`Checked in pass ${code} (`);
  ok(`EARMARKS L17 records a look at TEA's guidelines page in the newest pass when it cites pre-K (pass ${code || '?'}${cites ? ', which cites pre-K' : ', which cites no pre-K code'}; the look renamed to another pass, planted, caught)`,
    !!l17 && (!cites || (names(l17) && !names(l17.split(`Checked in pass ${code} (`).join('Checked in pass XX (')))), cites ? 'add "Checked in pass ' + code + ' (...)" to L17 once the page is read' : ''); }
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
// The records' counts come from the code, and a pointer names words that are there (pass NK, Mikey's answer to Q102: "B is okay, only if
// you think this doesn't introduce risk that would lead to reduced accuracy or quality."). Every count marker (<!-- n:modules -->729<!-- /n -->)
// in the records that describe the app as it stands holds the number tools/record-counts.mjs works out from the code today and names a count
// the tool knows, and every pointer (<!-- points-to: docs/FILE.md | words -->) in any doc names a file that holds those words. Near misses: a
// marker one behind, a marker naming a count the tool does not know, and a pointer to words that are not there, each caught.
{ const RC = await import('../tools/record-counts.mjs'); const counts = await RC.recordCounts(); const { readdirSync } = await import('node:fs');
  const texts = RC.RECORD_DOCS.map((f) => [f, readFileSync(new URL('../' + f, import.meta.url), 'utf8')]);
  const marks = texts.flatMap(([f, x]) => [...x.matchAll(RC.COUNT_MARK)].map((m) => f + ' ' + m[1]));
  const stale = texts.flatMap(([f, x]) => RC.staleMarks(x, counts).map((s) => `${f}: ${s.key} written ${s.was}, the code gives ${s.want}`));
  const behind = RC.staleMarks('<!-- n:modules -->' + (counts.modules - 1) + '<!-- /n -->', counts).length === 1 && RC.staleMarks('<!-- n:lessons -->5<!-- /n -->', counts).some((s) => s.want === undefined);
  const docs = ['docs', '.'].flatMap((d) => readdirSync(new URL('../' + d + '/', import.meta.url)).filter((n) => /\.md$/.test(n)).map((n) => (d === '.' ? n : d + '/' + n)));
  const pointerOff = (x) => [...x.matchAll(RC.POINTER)].filter((m) => { let target = ''; try { target = readFileSync(new URL('../' + m[1].trim(), import.meta.url), 'utf8'); } catch (e) { return true; } return !target.includes(m[2].trim()); }).map((m) => m[1] + ' | ' + m[2]);
  // Since pass NL the history's block of moved CLAUDE lines is read as a record: its two pointers (pass NK's line) are kept word for word
  // under the block's digest, which a pointer corrected in place would break, so the check reads the history without that block (the Fable
  // check of the move).
  const asRead = (d) => { const t = readFileSync(new URL('../' + d, import.meta.url), 'utf8'); if (d !== 'docs/CLAUDE-HISTORY.md') return t;
    const a = t.indexOf("<!-- CLAUDE-PART-2.md's and CLAUDE-PART-3.md's lines moved in pass NL, word for word: begin -->"); const b = t.indexOf("<!-- CLAUDE-PART-2.md's and CLAUDE-PART-3.md's lines moved in pass NL, word for word: end -->");
    return a >= 0 && b > a ? t.slice(0, a) + t.slice(b) : t; };
  const pointers = docs.flatMap((d) => [...asRead(d).matchAll(RC.POINTER)]).length;
  const badPointers = docs.flatMap((d) => pointerOff(asRead(d)).map((p) => d + ': ' + p));
  const pointerPlant = pointerOff('<!-- points-to: docs/RULES-AUDIT.md | words no row has ever said -->').length === 1;
  ok(`every count the records state is the code's, as tools/record-counts.mjs works it out, and every pointer names words that are there (pass NK, Q102 (b); ${marks.length} count markers, ${pointers} pointers; a marker one behind, a count the tool does not know and a pointer to missing words, planted, caught; fix: node tools/record-counts.mjs --write)`,
    marks.length >= 10 && stale.length === 0 && behind && badPointers.length === 0 && pointerPlant, [...stale, ...badPointers].slice(0, 6).join(' | ')); }
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
  // Pass MZ: the rules audit bullet quotes Mikey's answer to Q85 now, so it no longer waits; pass NK: the tour cards' bullet quotes his
  // answer to Q100, so it no longer waits either.
  const WAITING = ['Questions for him carry numbers', 'Wonder questions and edits ship', 'Writing: varied sentence lengths', 'Never take a shortcut', 'No Spanish course'];
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
  // Since pass NQ each step opens with check.sh's step helper, which echoes its name and times it (the next block), where it opened with echo.
  const steps = check.split('\n').filter((l) => /^step "1[0-3][a-z]?\/13 /.test(l));
  const first = steps.find((l) => / run "[^"]+" \d+ /.test(l)) || ''; const planted = check.replace(first, first.replace(/ run "[^"]+" (\d+) /, ' timeout $1 '));
  // Eighteen browser steps since pass ND's tile edges step (13k, EARMARKS A89), and nineteen since pass NE's paper edges step (13l, EARMARKS A92).
  // Twenty since pass NE's step for the words under the scroll cue (13m, EARMARKS A63).
  // Twenty-two since pass NG's steps for the grown-up's card (13n, Q91) and the note for a browser too old for the app (13o, Q92).
  // Twenty-three since pass NJ's step for the student signed out after fifteen quiet minutes (13p).
  ok(`check.sh names a browser step stopped at its time limit and notes one past two thirds of it, so a limit is raised before it stops a passing run (pass MT; ${steps.length} browser steps, each through run; the click-through's 695 seconds of 720 noted, a hung step named with its code kept, three near misses passed, a bare timeout caught)`,
    slowFn !== '' && runFn !== '' && notes.length === want.length && want.every((w, i) => notes[i].startsWith(w)) && last.startsWith(hung) && codes === 'code 124\ncode 0\ncode 1'
    && steps.length === 24 && steps.every((l) => / run "[^"]+" \d+ /.test(l)) && bare(check).length === 0 && bare(planted).length === 1,
    JSON.stringify({ notes, codes, last: last.slice(0, 60), steps: steps.length, bare: bare(check).length, planted: bare(planted).length }));
}
// Every step that runs a tool's self-test runs under a limit through run, and every step run under a limit has a comment naming the pass
// and the time its limit was set from (round one's code read of pass NQ: steps 3e, 3f and 3g ran with no limit, so a hang there had no
// TIMEOUT line and no limit was recorded; EARMARKS L20: a raised limit carries its cause). A step's comment is the comment block just above
// it, or above the run steps right before it that it follows in a group (3f follows 3e). Near misses, each caught: step 3e put back as it
// was written, with no run, and the click-through's comment taken away.
{ const check = readFileSync(new URL('../check.sh', import.meta.url), 'utf8');
  const runStep = (l) => /^step "/.test(l) && / run "[^"]+" \d+ /.test(l); const labelOf = (l) => /^step "([^"]+)"/.exec(l)[1];
  const unlimited = (text) => text.split('\n').filter((l) => /^step "/.test(l) && /--selftest/.test(l) && !runStep(l)).map(labelOf);
  const uncaused = (text) => { const lines = text.split('\n'); const out = [];
    lines.forEach((l, i) => { if (!runStep(l)) return; let k = i - 1; while (k >= 0 && runStep(lines[k])) k--; const block = []; while (k >= 0 && /^#/.test(lines[k])) { block.unshift(lines[k]); k--; }
      const words = block.join(' '); if (!/\bpass [A-Z]{2}\b/.test(words) || !/\b(?:seconds?|minutes?)\b/.test(words)) out.push(labelOf(l)); });
    return out; };
  const selftests = check.split('\n').filter((l) => /^step "/.test(l) && /--selftest/.test(l)).length; const runs = check.split('\n').filter(runStep).length;
  const oldE = check.replace(/^step "3e\/13 [^\n]*$/m, 'step "3e/13 the rules test\'s block runner proves itself" /tmp/edu_rb.txt; node tools/rules-block.mjs --selftest | tail -1 | tee /tmp/edu_rb.txt; grep -q " 0 failed" /tmp/edu_rb.txt || failed');
  const noComment = (() => { const lines = check.split('\n'); const i = lines.findIndex((l) => l.startsWith('step "10/13 browser click-through')); let k = i - 1; while (k >= 0 && /^#/.test(lines[k])) k--; return [...lines.slice(0, k + 1), ...lines.slice(i)].join('\n'); })();
  ok(`every step that runs a tool's self-test runs under a limit through run, and every one of check.sh's ${runs} limits has a comment naming the pass and the time it was set from (round one's code read of pass NQ, EARMARKS L20; ${selftests} self-test steps; step 3e put back with no run and the click-through's comment taken away, planted, caught)`,
    selftests >= 4 && unlimited(check).length === 0 && uncaused(check).length === 0 && oldE !== check && unlimited(oldE).includes("3e/13 the rules test's block runner proves itself") && noComment !== check && uncaused(noComment).includes('10/13 browser click-through (about twelve minutes)'),
    JSON.stringify({ unlimited: unlimited(check), uncaused: uncaused(check), planted: [unlimited(oldE), uncaused(noComment)] })); }
// check.sh's step times (pass NQ, EARMARKS L20, Mikey's answer to Q113): every step is timed and, once the verdict line is printed, the
// run's record goes to the file CHECK_TIMES_FILE names, and only when it is set (since round one's code read of pass NQ, the lead's
// decision: a pass's own runs set it to the tree's docs/CHECK-TIMES.md, and a run in Mikey's folder leaves his folder as it was). This runs
// check.sh's own helpers (step, step_end, failed, run, slow, times_write and finish, the run's end), taken from the file as the block above
// takes slow and run, on a fake run of three tiny steps: one passing, one failing and one stopped at its one-second limit. It runs in a
// temporary folder holding a copy of tools/check-times.mjs and an empty docs folder, so a writer that falls back to docs/CHECK-TIMES.md
// writes there and is seen, never into the tree. With CHECK_TIMES_FILE naming a temporary file, the record must hold each step's name,
// seconds, limit, status and summary line, the run's verdict and its minutes; nothing may reach the file before the verdict (a step reads
// the tree; pass MT's third run failed when a doc changed mid-run); and the writer prints nothing, so the verdict stays the log's last line.
// With it unset, nothing is written anywhere, the line before the verdict says the times were not recorded and why, the verdict is still
// the last line, and the run's record is whole in /tmp's place. Near misses, each caught: a times_write whose writer prints, a step_end
// that writes into the file mid-run, a file whose run line the tool cannot read (the writer refuses it rather than write the runs it could
// read), and, unset, the writer as it stood before round one's code read (it wrote to docs/CHECK-TIMES.md) and an end with no line saying
// so. And the tool's own rules on made runs: twelve whole and the thirteenth folded into its median; a step more than a quarter over the
// median before it flagged and one exactly a quarter over not; check.sh's slow rule at 201 of 300 seconds flagged and at exactly two thirds
// not.
{
  const { execFileSync } = await import('node:child_process'); const { mkdtempSync, mkdirSync, copyFileSync, rmSync, existsSync } = await import('node:fs');
  const { tmpdir } = await import('node:os'); const { join } = await import('node:path');
  const T = await import('../tools/check-times.mjs');
  const check = readFileSync(new URL('../check.sh', import.meta.url), 'utf8');
  const fn = (name) => (check.match(new RegExp(`^${name}\\(\\) \\{[\\s\\S]*?\\}$`, 'm')) || [''])[0];
  const helpers = { slow: fn('slow'), run: fn('run'), step_end: fn('step_end'), step: fn('step'), failed: fn('failed'), times_write: fn('times_write'), finish: fn('finish') };
  const VERDICT = 'CHECKS FAILED - read the lines above'; const UNSET = "NOTE: this run's step times were not recorded: CHECK_TIMES_FILE is not set";
  const fake = (h, set = true) => { const dir = mkdtempSync(join(tmpdir(), 'edu-times-')); const at = (f) => join(dir, f); const target = at('CHECK-TIMES.md');
    mkdirSync(at('tools')); mkdirSync(at('docs')); copyFileSync(new URL('../tools/check-times.mjs', import.meta.url), at('tools/check-times.mjs'));
    const script = [`slow_file='${at('slow.txt')}'; : > "$slow_file"; times_file='${at('times.txt')}'; step_run_file='${at('step-run.txt')}'; times_log='${at('write.log')}'; step_name=''; fail=0`,
      `printf 'began\\t%s\\t%s\\n' "$(date +%s)" "$(date '+%Y-%m-%d %H:%M %Z')" > "$times_file"; ${set ? `export CHECK_TIMES_FILE='${target}'` : 'unset CHECK_TIMES_FILE'}`,
      h.slow, h.run, h.step_end, h.step, h.failed, h.times_write, h.finish,
      `step "1/3 a passing step" '${at('pass.txt')}'; echo "3 passed, 0 failed" | tee '${at('pass.txt')}'; grep -q " 0 failed" '${at('pass.txt')}' || failed`,
      `step "2/3 a failing step" '${at('fail.txt')}'; echo "1 passed, 1 failed" | tee '${at('fail.txt')}'; grep -q " 0 failed" '${at('fail.txt')}' || failed`,
      `step "3/3 a step stopped at its limit" '${at('hung.txt')}'; run "a hung step" 1 sleep 5 2>&1 | tail -1 | tee '${at('hung.txt')}'; grep -q " 0 failed" '${at('hung.txt')}' || failed`,
      `if [ -e '${target}' ] || [ -e '${at('docs/CHECK-TIMES.md')}' ]; then echo early > '${at('early.txt')}'; fi`, 'finish; echo "status $?" > ' + `'${at('status.txt')}'`].join('\n');
    let out = ''; let doc = null; let error = '';
    try { out = execFileSync('bash', ['-c', script], { cwd: dir, encoding: 'utf8', timeout: 60000 }); if (set) doc = T.parseTimes(readFileSync(target, 'utf8')); } catch (e) { error = String(e.message || e).slice(0, 160); }
    const lines = out.trim().split('\n'); const written = existsSync(target) || existsSync(at('docs/CHECK-TIMES.md'));
    const record = existsSync(at('times.txt')) ? readFileSync(at('times.txt'), 'utf8') : ''; const status = existsSync(at('status.txt')) ? readFileSync(at('status.txt'), 'utf8').trim() : '';
    const early = existsSync(at('early.txt')); rmSync(dir, { recursive: true, force: true });
    return { lastLine: lines[lines.length - 1], before: lines[lines.length - 2] || '', doc, early, error, written, record, status }; };
  const real = fake(helpers); const run = real.doc && real.doc.runs[0]; const s = run ? run.steps : [];
  const recordOk = !!run && real.doc.runs.length === 1 && run.verdict === VERDICT && Number.isFinite(run.minutes) && /^\d{4}-\d\d-\d\d \d\d:\d\d /.test(run.began) && /^\d{4}-\d\d-\d\d \d\d:\d\d /.test(run.ended)
    && s.length === 3 && s.map((x) => x.name).join('|') === '1/3 a passing step|2/3 a failing step|3/3 a step stopped at its limit'
    && s.map((x) => x.status).join('|') === 'passed|failed|stopped at its limit' && s[0].limit === null && s[1].limit === null && s[2].limit === 1
    && s.every((x) => Number.isFinite(x.seconds)) && s[2].seconds >= 1 && s[0].summary === '3 passed, 0 failed' && s[1].summary === '1 passed, 1 failed'
    && s[2].summary.startsWith('TIMEOUT: a hung step was stopped at its 1-second limit') && T.countOf(s[0].summary) === 3 && !real.before.startsWith(UNSET) && real.status === 'status 1';
  // With CHECK_TIMES_FILE unset: nothing written, the line saying so just before the verdict, the verdict last, the record whole in /tmp's place.
  const unset = fake(helpers, false);
  const unsetOk = unset.error === '' && !unset.written && !unset.early && unset.lastLine === VERDICT && unset.before.startsWith(UNSET) && /^ended\t/m.test(unset.record) && unset.record.split('\n').filter((l) => l.startsWith('step\t')).length === 3 && unset.status === 'status 1';
  // The near misses: the writer's output left on the log, step_end writing each step into the file itself as it closes, and, unset, the
  // writer as it stood before round one's code read (no guard, and docs/CHECK-TIMES.md when the variable was empty) and an end that never says so.
  const printing = fake({ ...helpers, times_write: helpers.times_write.replace(' > "$times_log" 2>&1', '') });
  const midRun = fake({ ...helpers, step_end: helpers.step_end.replace('>> "$times_file"', '>> "$times_file"; echo x >> "$CHECK_TIMES_FILE"') });
  const OLD_WRITE = 'times_write() { step_end; printf \'ended\\t%s\\t%s\\t%s\\t%s\\n\' "$(date +%s)" "$(date \'+%Y-%m-%d %H:%M %Z\')" "$SECONDS" "$1" >> "$times_file"\n  node tools/check-times.mjs --write "$times_file" --into "${CHECK_TIMES_FILE:-docs/CHECK-TIMES.md}" > "$times_log" 2>&1 || { echo "NOTE: this run\'s step times were not written to ${CHECK_TIMES_FILE:-docs/CHECK-TIMES.md}; read $times_log"; echo "$1"; }; }';
  const oldWriter = fake({ ...helpers, times_write: OLD_WRITE }, false);
  const silentEnd = fake({ ...helpers, finish: helpers.finish.split('\n').filter((l) => !l.includes('CHECK_TIMES_FILE is not set')).join('\n') }, false);
  const unsetCaught = oldWriter.written && !silentEnd.before.startsWith(UNSET) && silentEnd.lastLine === VERDICT;
  const mangled = (() => { try { T.parseTimes(T.renderTimes(real.doc || { runs: [], folded: { runs: 0, steps: [] } }).replace(/^Began /m, 'Begun ')); return false; } catch (e) { return true; } })();
  // The fold and the flags, on made runs.
  const made = (k, secs) => ({ began: `2026-01-${String(k).padStart(2, '0')} 01:00 CST`, ended: `2026-01-${String(k).padStart(2, '0')} 02:00 CST`, minutes: 60, about: false, verdict: 'ALL CHECKS PASSED', note: '',
    steps: [{ name: 'a step', seconds: secs, limit: 300, status: 'passed', summary: '5 passed, 0 failed' }] });
  let doc = { runs: [], folded: { runs: 0, from: '', to: '', steps: [] } }; for (let k = 1; k <= 13; k++) doc = T.addRun(doc, made(k, 100 + k));
  const again = T.parseTimes(T.renderTimes(doc));
  const foldOk = doc.runs.length === T.KEEP_WHOLE && doc.folded.runs === 1 && doc.folded.steps[0].seconds.join() === '101' && doc.runs[0].began.startsWith('2026-01-13') && again.folded.runs === 1 && again.folded.steps[0].seconds.join() === '101' && T.renderTimes(again) === T.renderTimes(doc);
  const flags = (newest) => T.analyze(T.addRun({ runs: [made(1, 100), made(2, 100)], folded: { runs: 0, from: '', to: '', steps: [] } }, made(3, newest)))[0].flags.join('; ');
  const flagOk = /growing/.test(flags(126)) && !/growing/.test(flags(125)) && /near its limit/.test(flags(201)) && !/near its limit/.test(flags(200));
  ok(`check.sh times every step and, when CHECK_TIMES_FILE is set, writes the run there only after its verdict line, which stays the log's last line, and with it unset writes nothing and says so on the line before the verdict (pass NQ, EARMARKS L20, and round one's code read; a fake run of a passing, a failing and a hung step through check.sh's own helpers and its finish, set and unset; ${Object.values(helpers).filter(Boolean).length} of 7 helpers found; a printing writer, a file written mid-run, a run line the tool cannot read, and unset the old writer and a silent end, planted, caught; the fold at ${T.KEEP_WHOLE} runs and the flags at a quarter and at two thirds)`,
    Object.values(helpers).every(Boolean) && recordOk && real.lastLine === VERDICT && !real.early && real.error === '' && unsetOk && unsetCaught
    && printing.lastLine !== VERDICT && midRun.early && mangled && foldOk && flagOk,
    JSON.stringify({ recordOk, last: real.lastLine, early: real.early, error: real.error, steps: s.map((x) => [x.name, x.seconds, x.limit, x.status, String(x.summary).slice(0, 40)]), unsetOk, unset: { last: unset.lastLine, before: unset.before.slice(0, 60), written: unset.written, error: unset.error, status: unset.status }, oldWriter: oldWriter.written, silentEnd: silentEnd.before.slice(0, 40), printing: printing.lastLine, midRun: midRun.early, mangled, foldOk, flagOk }));
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
  // Since pass NS (Mikey's answer to Q120, "Q120 - A") the message names RULES-AUDIT's sections 9 to 11, which the lead reads whole, where
  // from pass NH it named the pass packet; pass NR's message and pass NG's, planted, are each caught.
  const okMsg = (m, p) => /read docs\/NEW-CHAT\.md, then RULES-AUDIT sections 9 to 11 and the latest DECISIONS entry/.test(m) && !/the pass packet/.test(m) && !/docs\/RULES-AUDIT\.md/.test(m) && p === m;
  const old = 'New chat for The Wise Human. Unzip the project, read docs/NEW-CHAT.md, docs/RULES-AUDIT.md, docs/EARMARKS.md, docs/INDEPENDENT-CHECKS.md and the latest DECISIONS entry, then continue. Committed through <pass>.';
  const oldNR = 'New chat for The Wise Human. Unzip the project, read docs/NEW-CHAT.md, then the pass packet it asks for and the latest DECISIONS entry, then continue. Committed through <pass>.';
  ok("the opening message names RULES-AUDIT sections 9 to 11, and HANDOFF's prompt is that message word for word (pass NS, Q120 (a); since pass NH, Q95 (a), it named the pass packet; pass NR's message and pass NG's, planted, caught)", okMsg(msg, prompt) && !okMsg(old, old) && !okMsg(msg, old) && !okMsg(oldNR, oldNR), { msg: msg.slice(0, 120), same: prompt === msg });
  const entries = dec.split(/\n(?=## \d{4}-\d{2}-\d{2} \(pass [A-Z]{2}\))/).filter((e) => /^## \d{4}-\d{2}-\d{2} \(pass [A-Z]{2}\)/.test(e));
  const from = (e) => { const p = (e.match(/^## \d{4}-\d{2}-\d{2} \(pass ([A-Z]{2})\)/) || [])[1] || ''; return p.length === 2 && p >= 'NH'; };
  // Since pass NS (Mikey's answer to Q120, "Q120 - A") a bullet may name the task packets (--task) in place of one packet's areas.
  const bullet = /^- \*\*The pass packet\.\*\* .*node tools\/pass-packet\.mjs (--areas [a-z0-9,]+|--task).*Findings traced to a line the packet left out: (\d+|none)/m;
  const fromNS = (e) => { const p = (e.match(/^## \d{4}-\d{2}-\d{2} \(pass ([A-Z]{2})\)/) || [])[1] || ''; return p.length === 2 && p >= 'NS'; };
  // Each area a bullet names is one the tool has (since pass NH's round one code read: any word passed).
  const { AREAS } = await import('../tools/pass-packet.mjs');
  const areasOf = (e) => ((e.match(/^- \*\*The pass packet\.\*\* .*?--areas ([a-z0-9,]+)/m) || [])[1] || '').split(',').filter(Boolean);
  const missing = entries.filter(from).filter((e) => !bullet.test(e) || (!areasOf(e).length && !fromNS(e)) || areasOf(e).some((a) => !AREAS[a])).map((e) => e.slice(0, 30));
  const nh = entries.find((e) => /^## \d{4}-\d{2}-\d{2} \(pass NH\)/.test(e)) || '';
  ok('every DECISIONS entry from pass NH on has the pass packet\'s bullet, naming its areas and counting the findings traced to a line the packet left out (pass NH, Q95 (a); the bullet taken out, planted, caught)', nh !== '' && missing.length === 0 && !bullet.test(nh.replace(/^- \*\*The pass packet\.\*\*.*$/m, '')) && areasOf(nh.replace('--areas screens', '--areas screenz')).some((a) => !AREAS[a]), missing);
  // The packet's honest count (EARMARKS L27, pass NP's weekly flow review, its item 9; built in pass NQ): from pass NQ's entry on, the same
  // bullet gives the packet's size in bytes, what the lead read of it ("read whole" or "searched"), and, beside its count of findings traced
  // to a line the packet left out, its count of findings whose rule was in the packet and was missed, as "Findings whose rule was in the
  // packet and was missed: <n or none>". Older entries are not held to it. A made pass NQ entry with the whole bullet passes, and the same
  // bullet with the second count taken out, planted, is caught.
  const fromNQ = (e) => { const p = (e.match(/^## \d{4}-\d{2}-\d{2} \(pass ([A-Z]{2})\)/) || [])[1] || ''; return p.length === 2 && p >= 'NQ'; };
  const honest = (e) => { const b = (e.match(/^- \*\*The pass packet\.\*\* .*$/m) || [''])[0];
    return bullet.test(b) && /\b\d{1,3}(?:,\d{3})+ bytes\b|\b\d+ bytes\b/.test(b) && /\b(read whole|searched)\b/.test(b) && /Findings whose rule was in the packet and was missed: (\d+|none)\b/.test(b); };
  const made = '## 2026-11-16 (pass NQ): a made entry\n\n- **The pass packet.** Made at the start (node tools/pass-packet.mjs --areas prek,screens; 966,707 bytes), searched for each rule the pass touched, not read whole. Findings traced to a line the packet left out: none. Findings whose rule was in the packet and was missed: 2.\n';
  // Since round one's code read of pass NQ the check cannot pass by holding no entry: the newest dated entry (as the check near this file's
  // top finds it) is held once it is pass NQ's or later, or names no pass the heading form "(pass XX)" gives, so an entry whose heading
  // the split above misses, or whose packet bullet is missing, fails; until pass NQ's entry is written the newest is pass NP's, which is
  // not held. Planted, each in a copy of DECISIONS's text with a pass NQ entry put before "## Open items": the entry with no packet
  // bullet, caught; the same entry headed "(pass NQ, a made heading)", caught; and the entry in the form, passed.
  const entriesOf = (text) => text.split(/\n(?=## \d{4}-\d{2}-\d{2} \(pass [A-Z]{2}\))/).filter((e) => /^## \d{4}-\d{2}-\d{2} \(pass [A-Z]{2}\)/.test(e));
  const newestHeld = (text) => { const heads = [...text.matchAll(/^## (\d{4}-\d{2}-\d{2})[^\n]*$/gm)]; const last = heads[heads.length - 1]; if (!last) return { owed: true, held: false, code: '' };
    const code = (last[0].match(/\(pass ([A-Z]{2})\)/) || [])[1] || ''; if (code && code < 'NQ') return { owed: false, held: true, code };
    const e = entriesOf(text).find((x) => x.startsWith(last[0] + '\n') || x === last[0]); return { owed: true, held: !!e && fromNQ(e) && honest(e), code }; };
  const withEntry = (entry) => { const at = dec.lastIndexOf('\n## Open items'); return `${dec.slice(0, at)}\n${entry}${dec.slice(at)}`; };
  const now = newestHeld(dec); const bare = made.replace(/^- \*\*The pass packet\.\*\*.*\n/m, '- **For future passes:** nothing new (made).\n');
  const plants = [!newestHeld(withEntry(bare)).held, !newestHeld(withEntry(made.replace('(pass NQ)', '(pass NQ, a made heading)'))).held, newestHeld(withEntry(made)).held && newestHeld(withEntry(made)).owed];
  const unkept = entries.filter(fromNQ).filter((e) => !honest(e)).map((e) => e.slice(0, 30));
  ok(`every DECISIONS entry from pass NQ on gives in its pass packet's bullet the packet's size in bytes, what the lead read of it, and beside the findings traced to a line the packet left out the findings whose rule was in the packet and was missed, and the newest entry is held once it is pass NQ's or later (EARMARKS L27, pass NQ, and round one's code read; ${entries.filter(fromNQ).length} entries held; the newest is pass ${now.code || '?'}'s, ${now.owed ? 'held' : 'not yet held'}; a made entry passed, and its bullet with the second count taken out, planted, caught; and, as the newest entry, a pass NQ entry with no packet bullet and one with a made heading, planted, caught, and one in the form passed)`,
    unkept.length === 0 && now.held && honest(made) && !honest(made.replace(' Findings whose rule was in the packet and was missed: 2.', '')) && !fromNQ(nh) && plants.every(Boolean), { unkept, now, plants }); }
// The coverage receipt (pass NQ, EARMARKS L20; INDEPENDENT-CHECKS, How, item 9): tools/coverage-receipt.mjs's self-test, made reports on
// this tree's own ids held against made changes and a made list: one that opened everything misses nothing, one that skipped a Wonder
// question and part of a file names both, one with a misspelled module names it, and in --list a bank opened at half its seeds, a screen
// in one theme of two and a misspelled test are each named.
{ const { selfTest } = await import('../tools/coverage-receipt.mjs'); const cases = await selfTest(); const bad = cases.filter((c) => !c.ok);
  ok(`the coverage receipt's self-test passes its ${cases.length} cases, so a read that missed an item, or named one that does not exist, says so (pass NQ, EARMARKS L20)`, cases.length >= 6 && bad.length === 0, bad.map((c) => `${c.name}: ${c.detail.slice(0, 200)}`).join(' | ')); }
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
// Pass NN (Mikey, opening pass NN: "You don't really need to keep Fable under 90, just under 100%."): section 9's row on which
// model a task runs on changed at his word, its pass NM words kept word for word in docs/RULES-AUDIT-HISTORY.md under a digest,
// and the row says so; a block edited by one letter, planted, is caught.
{ const { createHash } = await import('node:crypto');   // imported here, as the blocks above import it inside their own
  const hist = readFileSync(new URL('../docs/RULES-AUDIT-HISTORY.md', import.meta.url), 'utf8'); const audit = readFileSync(new URL('../docs/RULES-AUDIT.md', import.meta.url), 'utf8');
  const mark = "RULES-AUDIT rows as pass NM left them, before pass NN changed them at Mikey's word, word for word";
  const inside = (t) => { const a = t.indexOf(`<!-- ${mark}: begin -->\n`); const b = t.indexOf(`\n<!-- ${mark}: end -->`); return a < 0 || b < a ? '' : t.slice(a + `<!-- ${mark}: begin -->\n`.length, b); };
  const dig = (t) => createHash('sha256').update(inside(t), 'utf8').digest('hex').slice(0, 8);
  ok(`docs/RULES-AUDIT-HISTORY.md keeps section 9's model row as pass NM left it, before pass NN changed it at Mikey's word, unchanged (digest ${dig(hist)}), and the row says so (a block edited by one letter, planted, caught)`,
    dig(hist) === '99ab0173' && audit.includes("Changed in place in pass NN, at Mikey's word, its pass NM words there too.") && dig(((i) => hist.slice(0, i) + 'about 41' + hist.slice(i + 8))(hist.lastIndexOf('about 40 percent of a week is the aim'))) !== '99ab0173', dig(hist)); }
// Pass NO (Mikey, opening pass NO: "Q109 - B" and "Q110 - B"): the two questions answered, each in one line in section 11 and in full in
// docs/RULES-AUDIT-HISTORY.md's pass NO block, none open after them and Q111 open until pass NP answered it; the four section 8 rows and section 10's heading and
// paragraph his answers changed kept as pass NN left them, each block held by its digest and each changed row saying so, and section 9's
// Q85 row naming them; a block edited by one letter, planted, caught.
{ const { createHash } = await import('node:crypto');   // imported here, as the blocks above import it inside their own
  const hist = readFileSync(new URL('../docs/RULES-AUDIT-HISTORY.md', import.meta.url), 'utf8'); const audit = readFileSync(new URL('../docs/RULES-AUDIT.md', import.meta.url), 'utf8');
  const qName = "RULES-AUDIT section 11's answered questions in pass NO, word for word"; const rName = "RULES-AUDIT rows as pass NN left them, before pass NO changed them at Mikey's word, word for word";
  const inside = (t, name) => { const a = t.indexOf(`<!-- ${name}: begin -->\n`); const b = t.indexOf(`<!-- ${name}: end -->`); return a < 0 || b < a ? '' : t.slice(a + `<!-- ${name}: begin -->\n`.length, b); };
  const dig = (t) => createHash('sha256').update(t, 'utf8').digest('hex').slice(0, 8);
  const qs = inside(hist, qName); const rows = inside(hist, rName); const rowsList = rows.split('\n').filter(Boolean);
  const OPEN = ['| **The read-along (Mikey, pass MH', '| **More Info read aloud (Mikey, pass MI', "| **The light theme's lit sentence (Mikey, pass MI", '| **The reading light never moves the words (pass NC', '## 10. The plan, in Mikey', '**Four builds since pass NN'];
  // The plant edits the block's own first 'Q109 - B' (since pass NQ, whose blocks quote it too and come later in the file; until then the
  // last one in the file, which was this block's).
  const planted = ((i) => hist.slice(0, i) + 'Q109 - C' + hist.slice(i + 8))(hist.indexOf('Q109 - B', hist.indexOf(`<!-- ${qName}: begin -->`)));
  ok(`docs/RULES-AUDIT-HISTORY.md keeps the questions answered in pass NO, Q109 and Q110 (digest ${dig(qs)}), and the rows their answers changed as pass NN left them (digest ${dig(rows)}), unchanged; each answered in one line in section 11 with none open after it and Q111 open until pass NP answered it; each changed row saying so and section 9's Q85 row naming them (pass NO; a block edited by one letter, planted, caught)`,
    dig(qs) === 'a80080e5' && dig(rows) === '387e617c' && /^- Q109\. Answered in pass NO \(Mikey: "Q109 - B"\): .*The question as it stood: /m.test(qs) && /^- Q110\. Answered in pass NO \(Mikey: "Q110 - B"\): .*The question as it stood: /m.test(qs)
    && /\n- Q109\. Answered in pass NO \(Mikey: "Q109 - B"\)\. Its rule lives in section 10 /.test(audit) && /\n- Q110\. Answered in pass NO \(Mikey: "Q110 - B"\)\. Its rule lives in section 8 /.test(audit) && !/\n- Q1(09|10)\. (?!Answered)/.test(audit) && (/\n- Q111\. (?!Answered)/.test(audit) || /\n- Q111\. Answered in pass NP \(Mikey: "Q111 - A"\)\. /.test(audit))
    && rowsList.length === OPEN.length && OPEN.every((w, k) => rowsList[k].startsWith(w)) && audit.split("Changed in place in pass NO, at Mikey's word (his answer to Q110), its pass NN words").length - 1 === 4
    && audit.includes("Changed in place in pass NO, at Mikey's word (his answer to Q109), its pass NN words in docs/RULES-AUDIT-HISTORY.md.") && audit.includes("Changed in pass NO, at Mikey's word (his answers to Q109 and Q110), each saying so,")
    && dig(inside(planted, qName)) !== dig(qs), JSON.stringify({ qs: dig(qs), rows: dig(rows), n: rowsList.length })); }
// Pass NP's first batch (the whole reads of RULES-AUDIT pass NM owed, on Fable): the rows changed at Mikey's word (his answer to Q110,
// and his message opening pass NN on the four builds and on Fable) and the rows corrected under his answer to Q85, each block kept as
// pass NO left them in docs/RULES-AUDIT-HISTORY.md and held by its digest, every row opening as its list says, each changed or corrected
// row saying so, as many times as the rows of its kind, and section 9's Q85 row naming them; a block edited by one letter inside it,
// planted, caught.
{ const { createHash } = await import('node:crypto');   // imported here, as the blocks above import it inside their own
  const hist = readFileSync(new URL('../docs/RULES-AUDIT-HISTORY.md', import.meta.url), 'utf8'); const audit = readFileSync(new URL('../docs/RULES-AUDIT.md', import.meta.url), 'utf8');
  const auditThen = withOldSection2(audit, hist);   // since pass NQ: section 2's corrected lines read where they are kept
  const wName = "RULES-AUDIT rows as pass NO left them, before pass NP's first batch changed them at Mikey's word, word for word"; const qName = "RULES-AUDIT rows as pass NO left them, before pass NP's first batch corrected them under Q85, word for word";
  const inside = (t, name) => { const a = t.indexOf(`<!-- ${name}: begin -->\n`); const b = t.indexOf(`<!-- ${name}: end -->`); return a < 0 || b < a ? '' : t.slice(a + `<!-- ${name}: begin -->\n`.length, b); };
  const dig = (t) => createHash('sha256').update(t, 'utf8').digest('hex').slice(0, 8);
  const word = inside(hist, wName); const q85 = inside(hist, qName); const wordRows = word.split('\n').filter(Boolean); const q85Rows = q85.split('\n').filter(Boolean);
  const OPEN_WORD = ["- **Since pass MH (Mikey's notes of October 12 and 13, 2026):**", "- **Since pass MI (Mikey's notes and answers of October 13, 2026):**", "**The audio ledger in two builds (Mikey, pass NJ:", "| **The art ledger in two builds (Mikey, pass NJ,", "| **A pass of six lessons in two waves, tried (Mikey's answer to Q101", "| **What pass NM learned (Claude's, from the reads and the checks):**", "- Q108. Answered in pass NM (Mikey: \"Three lessons, about 15\""];
  const OPEN_Q85 = ["- **Since pass NL (Mikey's answers to Q105 to Q107", "| Titles are stored in sentence case and shown in title case", "| **A long story at a course's first finish and again at mastery (Mikey, pass MH", "| **Prompts for Nano Banana 2 (pass MC, Mikey:", "| **Say it together, one word in five silly ways (Mikey, pass MR, Q67", "| Reflections (Wonder): after every two different lessons worked", "| **Every pop-up is one Overlay (pass MB", "| **The read-along (Mikey, pass MH", "| **Light-theme changes at Mikey's word (pass MH", "| **One rule for where a sentence ends (pass MN", "| **The light theme's lit sentence (Mikey, pass MI", "| **Light-theme changes in pass MQ, at Mikey's word", "| **Light-theme changes in passes MS and MT", "| **No short line kept to the left beside centered words", "| **Speech parts kept whole on the page", "| **Every color edged (Mikey's answer to Q90", "| **Which model a task runs on (Mikey, pass NC", "Pass LR (Mikey: never forget):"];
  const changed = (auditThen.match(/Changed in place in pass NP, at Mikey's word \([^)]*\), its pass NO words in docs\/RULES-AUDIT-HISTORY\.md\./g) || []).length;
  const corrected = auditThen.split("Corrected in place in pass NP, under Mikey's answer to Q85, its pass NO words in docs/RULES-AUDIT-HISTORY.md.").length - 1;
  const plant = (name, from, to) => { const a = hist.indexOf(`<!-- ${name}: begin -->`); const b = hist.indexOf(`<!-- ${name}: end -->`); const i = a < 0 ? -1 : hist.indexOf(from, a); return i < 0 || i > b ? hist : hist.slice(0, i) + to + hist.slice(i + from.length); };   // inside its own block, never an older one with the same words
  ok(`docs/RULES-AUDIT-HISTORY.md keeps the rows pass NP's first batch changed at Mikey's word (digest ${dig(word)}) and corrected under Q85 (digest ${dig(q85)}) as pass NO left them, unchanged, each row opening as its list says; each changed or corrected row saying so and section 9's Q85 row naming them (pass NP's first batch; a block edited by one letter inside it, planted, caught)`,
    dig(word) === '880a07c4' && dig(q85) === '686cde7f' && wordRows.length === OPEN_WORD.length && OPEN_WORD.every((w, k) => wordRows[k].startsWith(w)) && q85Rows.length === OPEN_Q85.length && OPEN_Q85.every((w, k) => q85Rows[k].startsWith(w))
    && changed === OPEN_WORD.length && corrected === OPEN_Q85.length && auditThen.includes("Changed in pass NP's first batch, at Mikey's word (") && auditThen.includes("Corrected in pass NP's first batch, under Mikey's answer to Q85, each saying so,")
    && dig(inside(plant(wName, 'lights the sentence being read', 'lights the sentence being reed'), wName)) !== dig(word) && dig(inside(plant(qName, 'Sixteen pop-ups use it', 'Sixteen pop-ups use at'), qName)) !== dig(q85),
    JSON.stringify({ word: dig(word), q85: dig(q85), nWord: wordRows.length, nQ85: q85Rows.length, changed, corrected })); }
// Pass NP's records (Mikey, opening pass NP: "Q111 - A"): Q111 answered, in one line in section 11 and in full in docs/RULES-AUDIT-HISTORY.md's
// pass NP block for answered questions, with Q112 to Q114 raised after it; the two rows his answer changed (section 2's line for pass NO and
// section 8's read-along row, each corrected under Q85 too, for the places pass NP gave the read-along) and the row corrected under Q85 alone
// (section 7's row on the four Wonder voices), each kept as pass NP's first batch left them, each block held by its digest, every row opening
// as its list says, each changed or corrected row saying so, as many times as the rows of its kind, and section 9's Q85 row naming them; a
// block edited by one letter inside it, planted, caught.
{ const { createHash } = await import('node:crypto');   // imported here, as the blocks above import it inside their own
  const hist = readFileSync(new URL('../docs/RULES-AUDIT-HISTORY.md', import.meta.url), 'utf8'); const audit = readFileSync(new URL('../docs/RULES-AUDIT.md', import.meta.url), 'utf8');
  const auditThen = withOldSection2(audit, hist);   // since pass NQ: section 2's corrected lines read where they are kept
  const qName = "RULES-AUDIT section 11's answered questions in pass NP, word for word"; const wName = "RULES-AUDIT rows as pass NP's first batch left them, before pass NP's records changed them at Mikey's word, word for word"; const cName = "RULES-AUDIT rows as pass NP's first batch left them, before pass NP's records corrected them under Q85, word for word";
  const inside = (t, name) => { const a = t.indexOf(`<!-- ${name}: begin -->\n`); const b = t.indexOf(`<!-- ${name}: end -->`); return a < 0 || b < a ? '' : t.slice(a + `<!-- ${name}: begin -->\n`.length, b); };
  const dig = (t) => createHash('sha256').update(t, 'utf8').digest('hex').slice(0, 8);
  const qs = inside(hist, qName); const word = inside(hist, wName); const q85 = inside(hist, cName); const wordRows = word.split('\n').filter(Boolean); const q85Rows = q85.split('\n').filter(Boolean);
  const OPEN_WORD = ["- **Since pass NO (Mikey's answers to Q109 and Q110):**", "| **The read-along (Mikey, pass MH"];
  const OPEN_Q85 = ["| **A pre-reader hears all four Wonder voices (Mikey, pass MH"];
  const said = (s) => auditThen.split(s).length - 1;
  const changed = said("Changed in place in pass NP's records, at Mikey's word (his answer to Q111) and under his answer to Q85, its words as pass NP's first batch wrote them in docs/RULES-AUDIT-HISTORY.md.") + said("Changed in place again in pass NP's records, at Mikey's word (his answer to Q111) and under his answer to Q85, its words as pass NP's first batch left them there too."); const corrected = said("Corrected in place again in pass NP (Mikey's answer to Q85), its pass NO words there too.");
  const raised = [112, 113, 114].every((n) => new RegExp(`\\n- Q${n}\\. `).test(auditThen));
  const plant = (name, from, to) => { const a = hist.indexOf(`<!-- ${name}: begin -->`); const b = hist.indexOf(`<!-- ${name}: end -->`); const i = a < 0 ? -1 : hist.indexOf(from, a); return i < 0 || i > b ? hist : hist.slice(0, i) + to + hist.slice(i + from.length); };   // inside its own block, never an older one with the same words
  ok(`docs/RULES-AUDIT-HISTORY.md keeps the question answered in pass NP, Q111 (digest ${dig(qs)}), the rows his answer changed (digest ${dig(word)}) and the row corrected under Q85 (digest ${dig(q85)}) as pass NP's first batch left them, unchanged, each row opening as its list says; Q111 answered in one line in section 11 and Q112 to Q114 raised after it; each changed or corrected row saying so and section 9's Q85 row naming them (pass NP's records; a block edited by one letter inside it, planted, caught)`,
    dig(qs) === 'e7e8ebb4' && dig(word) === '6a73dcd5' && dig(q85) === '43b10f56' && /^- Q111\. Answered in pass NP \(Mikey: "Q111 - A"\): .*The question as it stood: Should a Wonder choice keep its green light/m.test(qs)
    && /\n- Q111\. Answered in pass NP \(Mikey: "Q111 - A"\)\. Its rule lives in section 8 /.test(auditThen) && raised
    && wordRows.length === OPEN_WORD.length && OPEN_WORD.every((w, k) => wordRows[k].startsWith(w)) && q85Rows.length === OPEN_Q85.length && OPEN_Q85.every((w, k) => q85Rows[k].startsWith(w))
    && changed === OPEN_WORD.length && corrected === OPEN_Q85.length && auditThen.includes("Changed in pass NP's records, at Mikey's word (his answer to Q111), each saying so,") && auditThen.includes("Corrected in pass NP's records, under Mikey's answer to Q85, saying so,")
    && dig(inside(plant(qName, 'keeps its light green', 'keeps its light greet'), qName)) !== dig(qs) && dig(inside(plant(wName, 'pulls me back up the page', 'pulls me back up the pace'), wName)) !== dig(word) && dig(inside(plant(cName, '138 of the 140 since pass NM', '138 of the 141 since pass NM'), cName)) !== dig(q85),
    JSON.stringify({ q: dig(qs), word: dig(word), q85: dig(q85), nWord: wordRows.length, nQ85: q85Rows.length, changed, corrected, raised })); }
// Pass NP's change of CLAUDE-PART-3.md's read-along line (round three's whole read of INDEPENDENT-CHECKS): the line as pass NO left it is
// kept word for word in docs/CLAUDE-HISTORY.md's pass NP block, held by its digest, and RULES-AUDIT section 9's row on CLAUDE.md lines
// names the change; the block edited by one letter, planted, caught.
{ const { createHash } = await import('node:crypto');
  const hist = readFileSync(new URL('../docs/CLAUDE-HISTORY.md', import.meta.url), 'utf8'); const audit = readFileSync(new URL('../docs/RULES-AUDIT.md', import.meta.url), 'utf8');
  const name = "CLAUDE-PART-3.md's read-along line as pass NO left it, before pass NP changed it, word for word";
  const inside = (t) => { const a = t.indexOf(`<!-- ${name}: begin -->\n`); const b = t.indexOf(`<!-- ${name}: end -->`); return a < 0 || b < a ? '' : t.slice(a + `<!-- ${name}: begin -->\n`.length, b); };
  const dig = (t) => createHash('sha256').update(t, 'utf8').digest('hex').slice(0, 8); const kept = inside(hist);
  const planted = inside(hist.replace('(pass NO, Mikey', '(pass NO. Mikey'));
  ok(`docs/CLAUDE-HISTORY.md keeps CLAUDE-PART-3.md's read-along line as pass NO left it (digest ${dig(kept)}), and RULES-AUDIT section 9 names pass NP's change (round three; the block edited by one letter, planted, caught)`, dig(kept) === '12aabecc' && /^- The read-along, sentence by sentence \(pass NO, /.test(kept) && audit.includes("Changed in pass NP, under Mikey's standing word of pass NG on CLAUDE.md: part three's read-along line of pass NO") && dig(planted) !== dig(kept), dig(kept)); }
// Pass NP's round three (Mikey's answer to Q85): the rows its whole reads of RULES-AUDIT found the code had outgrown, the browser tests'
// floors among them, kept as pass NP's records left them in a block of their own held by its digest, every row opening as the list says,
// each corrected row saying so, as many times as the rows, and section 9's Q85 row naming them; the block edited inside, planted, caught.
{ const { createHash } = await import('node:crypto');
  const hist = readFileSync(new URL('../docs/RULES-AUDIT-HISTORY.md', import.meta.url), 'utf8'); const audit = readFileSync(new URL('../docs/RULES-AUDIT.md', import.meta.url), 'utf8');
  const name = "RULES-AUDIT rows as pass NP's records left them, before pass NP's round three corrected them under Q85, word for word";
  const inside = (t) => { const a = t.indexOf(`<!-- ${name}: begin -->\n`); const b = t.indexOf(`<!-- ${name}: end -->`); return a < 0 || b < a ? '' : t.slice(a + `<!-- ${name}: begin -->\n`.length, b); };
  const dig = (t) => createHash('sha256').update(t, 'utf8').digest('hex').slice(0, 8); const kept = inside(hist); const rows = kept.split('\n').filter(Boolean);
  const OPEN_R3 = ["| **Pre-K's questions about a story and print and pictures, read (pass NM, the standards review, three lessons at Mikey'", "| **Follow the directions, a pre-reader's way to answer (pass MO, earmarks E12 and E13, Domain II):**", "| **The app says a lesson's sounds itself (Mikey's notes on Q51, pass MO: \"Just keeps saying the letter s for what seems", "| **Pass NM's banks worked out from what they say and show, scored blind two ways, and every reason held (pass NM, round", "| **No pre-K line or question waits under a short phone's fold (pass MZ, EARMARKS A80; Claude's design, the light theme ", "| **The reading light never moves the words (pass NC, EARMARKS A86; Claude's design; pass NO, Mikey's answer to Q110):**", "| **No word under the scroll cue on a short phone (pass NE, EARMARKS A63, and pass NF, EARMARKS A99 and A103; Claude's d", "| **A drawing beside its dots grows on a wide screen (pass ND, EARMARKS A88; Claude's design):**", "| **The Wonder words keep a hyphenated word whole (pass ND, round one's screen read and round two's code read; Claude's ", "| **Every drawing on an answer tile reads at its edge (pass ND, EARMARKS A89; Claude's design):**", "| **Every drawing on the dark theme's lesson paper reads at its edge (pass NE, EARMARKS A92; Claude's design):**", "| **An id is defined once (pass MX):**", "| **Which model a task runs on (Mikey, pass NC: \"If you are "];
  const said = audit.split("Corrected in place in pass NP's round three (Mikey's answer to Q85), its words as pass NP's records left them in docs/RULES-AUDIT-HISTORY.md.").length - 1;
  const FROM = "story and print and pictures, "; const planted = kept.replace(FROM, "story and print and pictures,x");
  ok(`docs/RULES-AUDIT-HISTORY.md keeps the rows pass NP's round three corrected under Q85 as pass NP's records left them (digest ${dig(kept)}, ${rows.length} rows), each opening as its list says, each saying so and section 9's Q85 row naming them (a block edited inside, planted, caught)`,
    dig(kept) === 'c09eb78b' && rows.length === OPEN_R3.length && OPEN_R3.every((o, k) => rows[k].startsWith(o)) && said === OPEN_R3.length && audit.includes("Corrected in pass NP's round three, under Mikey's answer to Q85, saying so,") && kept.includes(FROM) && dig(planted) !== dig(kept), JSON.stringify({ d: dig(kept), rows: rows.length, said })); }
// The algorithms note's Reflections paragraph says when a reflection comes and in what order, as nextWonder does (pass NQ, round
// one's code reads: it said a reflection came "after every WONDER_EVERY (2) finished rounds" and that "the theme met longest ago comes
// first", where nextWonder counts different modules worked since the last answer and puts the rough patch's themes first, then the
// fewest answers, then the theme met longest ago, then the question answered longest ago, then the course's own question). The count
// is read from the paragraph and held to WONDER_EVERY and to nextWonder on logs: one module worked over and over is never due, as
// many different modules as the paragraph says are, failed rounds too. The order is read as the order the paragraph names its six
// keys in, and each key is held above the next by nextWonder on a log where the two disagree, with only two questions turned on
// (the second pair's case beside a calm one, since the rough patch's order holds only after a rough patch). MISS_STREAK and
// WONDER_MAX_REPEATS are read too. The old count and the old order, planted in the paragraph, are caught.
{ const section = (doc) => { const at = doc.indexOf('\n## Reflections\n'); if (at < 0) return ''; const end = doc.indexOf('\n## ', at + 5); return doc.slice(at, end < 0 ? doc.length : end).replace(/\s+/g, ' '); };
  const KEYS = [['the rough patch\'s failure and feelings', /the failure and feelings questions come first/], ['their ups-and-downs next', /the ups-and-downs ones next/],
    ['the fewest answers', /the question answered fewest times comes first/], ['the theme met longest ago', /the one whose theme was met longest ago/],
    ['the question answered longest ago', /then the one answered longest ago/], ['the course\'s own', /then one written for this course before one its stage shares/]];
  const at = (text) => KEYS.map(([, re]) => { const m = re.exec(text); return m ? m.index : -1; });
  const inOrder = (text) => { const p = at(text); return p.every((x) => x >= 0) && p.every((x, k) => k === 0 || x > p[k - 1]); };
  const count = (text) => { const m = /reflection is offered once `WONDER_EVERY` \((\d+)\) different modules have been worked since the last one was answered, pass or fail/.exec(text); return m ? Number(m[1]) : null; };
  const numberOf = (text, name) => { const m = new RegExp('`' + name + '` \\((\\d+)\\)').exec(text); return m ? Number(m[1]) : null; };
  const docRight = (doc) => { const t = section(doc); return count(t) === L.WONDER_EVERY && inOrder(t) && numberOf(t, 'MISS_STREAK') === L.MISS_STREAK && numberOf(t, 'WONDER_MAX_REPEATS') === L.WONDER_MAX_REPEATS; };
  // The code: logs a counting-k student could leave, every time an hour of September 1.
  const C = 'counting-k'; const T = (h) => `2026-09-01T${String(h).padStart(2, '0')}:00:00.000Z`;
  const mods = L.getCourse(C).modules.map((m) => m.id);
  const round = (id, h, passed) => { const n = L.moduleRules(id).questions; const flags = Array.from({ length: n }, (_, k) => passed || k === 0); return { type: 'attempt_completed', at: T(h), startedAt: T(h), moduleId: id, seed: 1, core: flags.map((c) => ({ correct: c })), review: null, coreCorrect: flags.filter(Boolean).length, coreTotal: n }; };
  const answered = (id, h) => L.makeWonderEvent(id, mods[0], T(h), 30, 5);
  const due = (h, rough) => mods.slice(0, L.WONDER_EVERY).map((id, k) => round(id, h + k, !(rough && k === L.WONDER_EVERY - 1)));
  const onlyTwo = (a, b) => L.setWonderOn(L.setWonderOn(L.setAllWonder(L.emptyWonderReview(), false), a.id, true), b.id, true);
  const first = (events, a, b) => (L.nextWonder(events, C, onlyTwo(a, b)) || {}).id || null;
  const early = (theme, own = false) => L.WONDER.filter((w) => (w.stage || 'early') === 'early' && (w.theme || 'world') === theme && (own ? w.courseIds.includes(C) : w.courseIds.length === 0) && L.wonderAllowed(w, C, 'early'));
  const [F] = early('failure'); const [Fe] = early('feelings'); const [U] = early('ups-and-downs'); const [Wd, Wd2] = early('world'); const [own] = early('world', true);
  const counted = mods.length > L.WONDER_EVERY && L.nextWonder(mods.slice(0, L.WONDER_EVERY - 1).flatMap((id, k) => [round(id, 2 * k + 1, true), round(id, 2 * k + 2, true)]), C, L.emptyWonderReview()) === null
    && L.nextWonder(mods.slice(0, L.WONDER_EVERY).map((id, k) => round(id, k + 1, true)), C, L.emptyWonderReview()) !== null
    && L.nextWonder(mods.slice(0, L.WONDER_EVERY).map((id, k) => round(id, k + 1, false)), C, L.emptyWonderReview()) !== null;
  // Each key above the next: the question each key puts first, on a log where the next key would put the other first.
  const PAIRS = {
    'a rough patch puts a failure question answered once above a world question never answered, and a calm log does not': first([answered(F.id, 1), ...due(3, true)], F, Wd) === F.id && first([answered(F.id, 1), ...due(3, false)], F, Wd) === Wd.id,
    'a rough patch puts a feelings question answered once above an ups-and-downs question never answered': first([answered(Fe.id, 1), ...due(3, true)], Fe, U) === Fe.id,
    'a rough patch puts an ups-and-downs question answered once above a world question never answered': first([answered(U.id, 1), ...due(3, true)], U, Wd) === U.id,
    'the question answered fewest times comes above one whose theme was met longer ago': first([answered(Fe.id, 1), answered(Wd2.id, 5), ...due(7, false)], Wd, Fe) === Wd.id,
    'the theme met longest ago comes above the question answered longest ago': first([answered(Wd.id, 1), answered(Fe.id, 3), answered(Wd2.id, 5), ...due(7, false)], Wd, Fe) === Fe.id,
    'the question answered longest ago comes above the course\'s own': first([answered(Wd.id, 1), answered(own.id, 3), ...due(5, false)], Wd, own) === Wd.id,
    'the course\'s own comes above its stage\'s, though written after it': L.WONDER.indexOf(Wd) < L.WONDER.indexOf(own) && first(due(1, false), Wd, own) === own.id,
  };
  const wrong = Object.entries(PAIRS).filter(([, held]) => !held).map(([name]) => name);
  // The old paragraph's count and order, planted.
  const NEW_COUNT = 'A reflection is offered once `WONDER_EVERY` (2) different modules have been worked since\nthe last one was answered, pass or fail:';
  const NEW_ORDER = 'question answered fewest times comes first, then the one whose theme was met longest ago\n(a theme never met first), then the one answered longest ago,';
  const oldCount = algo.replace(NEW_COUNT, 'A reflection is offered after every `WONDER_EVERY` (2) finished rounds, pass or fail,\nsince the last one was answered:');
  const oldOrder = algo.replace(NEW_ORDER, 'question whose theme was met longest ago comes first, then the one answered fewest times\n(a theme never met first), then the one answered longest ago,');
  // A near miss of the order alone: the last two keys swapped, every phrase still there.
  const LAST_TWO = 'then the one answered longest ago, then one written for this\ncourse before one its stage shares,';
  const swapped = algo.replace(LAST_TWO, 'then one written for this\ncourse before one its stage shares, then the one answered longest ago,');
  ok(`the algorithms note's Reflections paragraph says a reflection comes once WONDER_EVERY (${L.WONDER_EVERY}) different modules are worked, and names nextWonder's order, rough patch, fewest answers, theme met longest ago, answered longest ago, the course's own, each held above the next by nextWonder (pass NQ, round one's code reads; the old count, the old order and the last two keys swapped, planted, caught)`,
    !!(F && Fe && U && Wd && Wd2 && own) && docRight(algo) && counted && wrong.length === 0 && oldCount !== algo && !docRight(oldCount) && oldOrder !== algo && !docRight(oldOrder) && swapped !== algo && !docRight(swapped),
    JSON.stringify({ count: count(section(algo)), at: at(section(algo)), counted, wrong, picked: [F, Fe, U, Wd, Wd2, own].map((w) => w && w.id) })); }
// The README's Confidence paragraph and the plain-English summary's confidence line say what the code does (pass NQ, engineer F2; F's
// report, item 6). The README said two quick wrong answers earn "a quiet "guessing?" on the report", where only Who Needs Help names
// them, and that the score is built from timing; the plain-English line counted speed in the score and said the formula is printed on
// every report. Both are read word for word, and the code is run at what they say: the count and the seconds of guessing against Who
// Needs Help (classView) at them and just past them, time against computeConfidence (the same rounds at two seconds an answer and at
// twenty score the same), and the rules against every report's definitions (CONFIDENCE_RULES) and the Key Words. The old words and two
// wrong numbers, planted, are caught.
{ const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8'); const plain = readFileSync(new URL('../docs/EDUSPHERE-IN-PLAIN-ENGLISH.md', import.meta.url), 'utf8');
  const WORDS = { one: 1, two: 2, three: 3, four: 4, five: 5 }; const num = (w) => (WORDS[String(w).toLowerCase()] !== undefined ? WORDS[String(w).toLowerCase()] : Number(w));
  const ID = 'count-to-5'; const N = L.moduleRules(ID).questions; const T = (i) => `2026-10-0${i}T12:00:00.000Z`;
  const round = (i, flags, ms) => ({ type: 'attempt_completed', at: T(i), startedAt: T(i), moduleId: ID, seed: i, core: flags.map((c, j) => ({ correct: !!c, timeMs: Array.isArray(ms) ? ms[j] : ms })), review: null, coreCorrect: flags.filter(Boolean).length, coreTotal: flags.length });
  // Who Needs Help on a latest round whose first answers are wrong at the times given, the rest right at nine seconds.
  const named = (wrongMs) => { const flags = Array.from({ length: N }, (_, j) => (j < wrongMs.length ? 0 : 1)); const ms = flags.map((c, j) => (j < wrongMs.length ? wrongMs[j] : 9000));
    const ev = [L.makeCoursesEnabledEvent(['counting-k'], T(1)), round(2, Array(N).fill(1), 9000), round(3, flags, ms)]; return L.classView([{ id: 's', label: 'Sam', events: ev }], T(9))[0].reasons.some((r) => /signs of guessing/.test(r)); };
  const guessAt = (wrong, secs) => wrong >= 1 && named(Array(wrong).fill(secs * 1000 - 1)) && !named(Array(wrong - 1).fill(secs * 1000 - 1)) && !named(Array(wrong).fill(secs * 1000));
  const timeFree = () => [[1, 1, 1, 1, 1], [0, 0, 1, 1, 1], [1, 0, 0, 0, 0]].every((f) => L.computeConfidence(ID, [round(2, Array(N).fill(1), 2000), round(3, f.slice(0, N), 2000)]).score === L.computeConfidence(ID, [round(2, Array(N).fill(1), 20000), round(3, f.slice(0, N), 20000)]).score);
  const carried = () => L.CONFIDENCE_RULES.every((r) => L.buildReport('Sam', []).definitions.includes(r)) && L.EXPLANATIONS.some((x) => /^Confidence/.test(x.term));
  const README_NOW = /\*\*Confidence, not just correctness\.\*\* Each module carries a score from 1 to 5 built\nfrom passing it, a flawless latest round, a run of correct answers and how its questions\nfare when they come back\. Time never changes the score\. (\w+) or more wrong answers in the\nlatest round, each in under (\w+) seconds, name the module under signs of guessing on Who\nNeeds Help, because tapping fast usually means not thinking\. The report's Key Words give\nthe rules in plain words\./;
  const readmeRight = (t) => { const m = README_NOW.exec(t); return !!m && guessAt(num(m[1]), num(m[2])) && timeFree() && carried(); };
  const plainRight = (t) => /^- \*\*Confidence score, 1 to 5\.\*\* Built from passing, a flawless latest round, a run of correct answers, and later recall\. Time never changes it\. Quick wrong answers are named as signs of guessing on Who Needs Help instead\. Every report carries the rules in its definitions, and its Key Words say them in plain words\.$/m.test(t) && timeFree() && carried();
  const at = README_NOW.exec(readme); const para = at ? at[0] : '';
  const PLANTS = {
    "the README's old paragraph": [readme.replace(para, '**Confidence, not just correctness.** Each module carries a score from 1 to 5 built\nfrom mastery, streaks, timing and how the material fares when it comes back. Two\nwrong answers in under four seconds earns a quiet "guessing?" on the report, because\ntapping fast usually means not thinking.'), plain],
    'three wrong answers': [readme.replace(para, para.replace('Two or more wrong', 'Three or more wrong')), plain],
    'under five seconds': [readme.replace(para, para.replace('in under four seconds', 'in under five seconds')), plain],
    "the plain-English summary's old line": [readme, plain.replace(/^- \*\*Confidence score, 1 to 5\.\*\*.*$/m, () => "- **Confidence score, 1 to 5.** Built from correct answers, streaks, speed against the student's own pace, and later recall. The formula is printed on every report.")],
  };
  const uncaught = Object.entries(PLANTS).filter(([, [r, p]]) => r === readme && p === plain || (readmeRight(r) && plainRight(p))).map(([name]) => name);
  ok(`the README's Confidence paragraph and the plain-English summary's confidence line say what the code does: guessing is named on Who Needs Help at two or more wrong answers in the latest round under four seconds each, time never changes the score, and every report carries the rules in its definitions with the Key Words saying them in words (pass NQ, F2; ${Object.keys(PLANTS).length} old words and wrong numbers planted, each caught)`,
    !!para && readmeRight(readme) && plainRight(plain) && uncaught.length === 0, JSON.stringify({ readme: !!para && readmeRight(readme), plain: plainRight(plain), uncaught })); }
// Pass NQ's records (Mikey, opening pass NQ: "Q112 - C", "Q113 - A", "Q114 - A", "Q115 - A" and "Q116 - A"): the five questions answered,
// each in one line in section 11 and in full in docs/RULES-AUDIT-HISTORY.md's pass NQ block for answered questions, with Q117 and Q119
// asked after them and Q118 withdrawn in round three before it was asked, its line quoting DECISIONS (2026-09-22, pass L) as DECISIONS has
// it (its premise was untrue to that record; the line as it was asked, planted, caught); section 2 as pass NP left it, rewritten whole at
// his answer to Q116, its old heading and lines in a block of their own (which the checks above that read its corrected lines read through
// withOldSection2); the rows his answers changed and the rows corrected under his answer to Q85 (fourteen since round three's whole read,
// section 3's restated floors among them), each kept as pass NP left them; and CLAUDE-PART-3's read-along line and CLAUDE-PART-2's Running
// check.sh line as pass NP left them, in docs/CLAUDE-HISTORY.md, the second since its start command names CHECK_TIMES_FILE (engineer B's
// second round) and since round three's records read the project's step-times file and about three hours, and since that read CLAUDE.md's
// four lines it corrected (the Backups line, and three on check.sh's time) in a block of their own. Each block is held by its digest,
// every row opening as its list says, each changed or corrected row saying so, as many times as its rows, and section 9's rows naming
// them; one letter edited inside each block, planted, is caught.
{ const { createHash } = await import('node:crypto');
  const hist = readFileSync(new URL('../docs/RULES-AUDIT-HISTORY.md', import.meta.url), 'utf8'); const audit = readFileSync(new URL('../docs/RULES-AUDIT.md', import.meta.url), 'utf8');
  const claudeHist = readFileSync(new URL('../docs/CLAUDE-HISTORY.md', import.meta.url), 'utf8'); const part3 = readFileSync(new URL('../CLAUDE-PART-3.md', import.meta.url), 'utf8');
  const part2 = readFileSync(new URL('../CLAUDE-PART-2.md', import.meta.url), 'utf8'); const manual = readFileSync(new URL('../CLAUDE.md', import.meta.url), 'utf8');
  const dec = readFileSync(new URL('../docs/DECISIONS.md', import.meta.url), 'utf8');
  const qName = "RULES-AUDIT section 11's answered questions in pass NQ, word for word"; const sName = OLD_SECTION_2;
  const wName = "RULES-AUDIT rows as pass NP left them, before pass NQ changed them at Mikey's word, word for word"; const cName = "RULES-AUDIT rows as pass NP left them, before pass NQ corrected them under Q85, word for word";
  const lName = "CLAUDE-PART-3.md's read-along line as pass NP left it, before pass NQ changed it, word for word";
  const kName = "CLAUDE-PART-2.md's line on running check.sh as pass NP left it, before pass NQ changed it, word for word";
  const mName = "CLAUDE.md lines as pass NP left them, before pass NQ corrected them, word for word";
  const inside = (t, name) => { const a = t.indexOf(`<!-- ${name}: begin -->\n`); const b = t.indexOf(`<!-- ${name}: end -->`); return a < 0 || b < a ? '' : t.slice(a + `<!-- ${name}: begin -->\n`.length, b); };
  const dig = (t) => createHash('sha256').update(t, 'utf8').digest('hex').slice(0, 8);
  const plant = (t, name, from, to) => { const a = t.indexOf(`<!-- ${name}: begin -->`); const b = t.indexOf(`<!-- ${name}: end -->`); const i = a < 0 ? -1 : t.indexOf(from, a); return i < 0 || i > b ? t : t.slice(0, i) + to + t.slice(i + from.length); };   // inside its own block, never an older one with the same words
  const qs = inside(hist, qName); const s2 = inside(hist, sName); const word = inside(hist, wName); const q85 = inside(hist, cName); const line = inside(claudeHist, lName); const runLine = inside(claudeHist, kName); const mdLines = inside(claudeHist, mName);
  const wordRows = word.split('\n').filter(Boolean); const q85Rows = q85.split('\n').filter(Boolean);
  const ANSWERS = { 112: 'Q112 - C', 113: 'Q113 - A', 114: 'Q114 - A', 115: 'Q115 - A', 116: 'Q116 - A' };
  const answered = Object.entries(ANSWERS).every(([n, x]) => new RegExp(`^- Q${n}\\. Answered in pass NQ \\(Mikey: "${x}"\\): .*The question as it stood: `, 'm').test(qs) && audit.includes(`\n- Q${n}. Answered in pass NQ (Mikey: "${x}"). Its rule lives in `));
  const raised = [117, 118, 119].every((n) => new RegExp(`\\n- Q${n}\\. `).test(audit));
  // Q118, withdrawn in round three before it was asked: its line says so and quotes DECISIONS' pass L line as DECISIONS has it.
  const PASS_L = 'Backups no longer download when a course is finished (students saw the note); the two triggers left are an educator signing out after changes and a student tapping Exit.';
  const withdrawn = (t) => t.includes(`\n- Q118. Withdrawn in pass NQ's round three, before it was asked. It said no record took out the backup when a student finishes a course, and DECISIONS does (2026-09-22, pass L: "${PASS_L}"). Nothing is asked;`) && dec.includes(PASS_L);
  const asAsked = audit.replace(/\n- Q118\. [^\n]*/, () => '\n- Q118. A backup when a student finishes a course. No record says the course trigger was removed.');
  const OPEN_WORD = ['| **Two people who look alike, read by machine (pass MX, rou', "| **Hair written alike, read by machine (pass NC, round two'", "| **Hair near alike, and Mike's haircut his own (pass ND, ro", '| **Look echoes read across a pre-K subject (pass NF, EARMAR', "**The app's own sounds are measured against recordings (pass", "| **The app's picture-like drawings, painted as their own se", "| **An outcome's two halves, read one way at both ages (pass", "| **Follow the directions, a pre-reader's way to answer (pas", '| **The read-along (Mikey, pass MH: "At least on dark theme,', '| **Light-theme changes in pass MO, at Mikey\'s word (Q54: "Q', '| **Light-theme changes in pass MM, as fixes the checks aske', '| **Every game opens on its welcome (Mikey, pass MP: "I thin', '| **Light-theme changes in pass MP, at Mikey\'s word (Q56: "Q', '| **Light-theme changes in pass MQ, at Mikey\'s word (Q62: "Q', '| **No word spills out of its box, and no speaker pushes cen', "| **No pre-K line or question waits under a short phone's fo", "| **A column of one-picture answers is a phone's width on an", "| **A83's last four, and the drawings' edges on their own pa", '| **No word under the scroll cue on a short phone (pass NE, ', '| **Every drawing on an answer tile reads at its edge (pass ', "| **Every drawing on the dark theme's lesson paper reads at ", '| **A student signed out after fifteen quiet minutes (Mikey,', '| **Checks learned in pass MU:** a sound nobody can hear whe', '| **Checks learned in pass MM:** a pre-K bank is read on eve', '| **Which model a task runs on (Mikey, pass NC: "If you are ', "| **A pass of six lessons in two waves, tried (Mikey's answe", "| **What pass NO learned (Claude's, from the lead's look and", "## 10. The plan, in Mikey's order (updated 2026-10-06, pass ", '5. The depth program: long stories for the early courses (L1'];
  const OPEN_Q85 = ['| **Short runs across a paragraph break ', '| **Even stretches and Then after Then a', '| **No choking hazard in a pre-K story o', '| **A young child near a height, water o', '**The tag floor (pass MJ, the second rea',
    '| **Confidence, 1 to 5:** 1 once practic', '| Reflections (Wonder): after every two ', '| Placement: none below grade 3; a per-s', '| The class view: a need score (3 per mo', '| **The light review, the fourth exposur',
    '- Weekly summaries, when they exist, car', '- Q89. Answered in pass NE (Mikey: "Q89 ', '- Q90. Answered in pass NF (Mikey: "Q90 ', '- Q106. Answered in pass NL (Mikey: "Q10'];
  const said = (re) => (audit.match(re) || []).length;
  const changed = said(/Changed in place in pass NQ, at Mikey's word \(his answer to Q11[2-6], "Q11[2-6] - [AC]"\)[^|]*?its pass NP words in docs\/RULES-AUDIT-HISTORY\.md\./g);
  const corrected = said(/Corrected in place in pass NQ, under Mikey's answer to Q85, its pass NP words in docs\/RULES-AUDIT-HISTORY\.md\./g);
  const s2Now = audit.includes('\n## 2. The product, as it stands (rewritten in pass NQ at Mikey\'s answer to Q116, "Q116 - A", as the app today)\n') && !audit.includes('## 2. The product, as it stands (walked in pass LD');
  const plants = [dig(inside(plant(hist, qName, 'Should the reason after a wrong tap stay at full ink', 'Should the reason after a wrong tap stay at fall ink'), qName)) !== dig(qs),
    dig(inside(plant(hist, sName, 'with the students\' pictures; Educator Login', 'with the students\' pictures, Educator Login'), sName)) !== dig(s2),
    dig(inside(plant(hist, wName, 'which practises the expressive half', 'which practices the expressive half'), wName)) !== dig(word),
    dig(inside(plant(hist, cName, 'places one notch conservatively', 'places one notch conservatively.'), cName)) !== dig(q85),
    dig(inside(plant(claudeHist, lName, 'until it reads 4.5 to 1; and the app keeps', 'until it reads 4.5 to 1, and the app keeps'), lName)) !== dig(line),
    dig(inside(plant(claudeHist, kName, 'past one call\'s limit. Start it detached', 'past one call\'s limit; start it detached'), kName)) !== dig(runLine),
    dig(inside(plant(claudeHist, mName, 'which takes about two and a half hours,', 'which takes about two and a half hours;'), mName)) !== dig(mdLines), !withdrawn(asAsked)];
  ok(`docs/RULES-AUDIT-HISTORY.md keeps the questions answered in pass NQ, Q112 to Q116 (digest ${dig(qs)}), section 2 as pass NP left it (digest ${dig(s2)}), the rows Mikey's answers changed (digest ${dig(word)}, ${wordRows.length} lines) and the rows corrected under Q85 (digest ${dig(q85)}, ${q85Rows.length} rows), and docs/CLAUDE-HISTORY.md part three's read-along line (digest ${dig(line)}) and part two's Running check.sh line (digest ${dig(runLine)}), and CLAUDE.md's four lines corrected after round three's records read (digest ${dig(mdLines)}), unchanged, part two's new line naming the project's step-times file, and CLAUDE.md's new lines the two backup triggers and about three hours; each question answered in one line in section 11, Q117 and Q119 asked after them and Q118 withdrawn; section 2 rewritten; each changed or corrected row saying so and section 9's rows naming them (pass NQ's records; one letter edited inside each block, and Q118 as it was asked, planted, caught)`,
    dig(qs) === '75a0ea61' && dig(s2) === 'aa27a83e' && dig(word) === '5378e934' && dig(q85) === '72e6ca23' && dig(line) === '876436f6' && dig(runLine) === 'e6dad857' && dig(mdLines) === '5ad4a45a' && answered && raised && withdrawn(audit) && !/\n- Q11[2-6]\. (?!Answered)/.test(audit)
    && s2.startsWith('## 2. The product, as it stands (walked in pass LD') && /\n- \*\*Not built yet:\*\* [^\n]*\n$/.test(s2) && s2Now && withOldSection2(audit, hist) !== audit
    && wordRows.length === OPEN_WORD.length && OPEN_WORD.every((w, k) => wordRows[k].startsWith(w)) && q85Rows.length === OPEN_Q85.length && OPEN_Q85.every((w, k) => q85Rows[k].startsWith(w))
    && changed === wordRows.length - 1 && corrected === q85Rows.length   // every changed line but section 10's heading carries its sentence
    && audit.includes("Changed in pass NQ, at Mikey's word (his answers to Q112 to Q116), each saying so,") && audit.includes("Corrected in pass NQ, under Mikey's answer to Q85, each saying so,")
    && /^- The read-along, sentence by sentence \(pass NO, /.test(line) && audit.includes("Changed in pass NQ, under Mikey's standing word of pass NG on CLAUDE.md: part three's read-along line")
    && part3.includes('the reason after a wrong tap wears no faint and no mark on its clay strip, where none could be seen (since pass NQ, Mikey\'s answer to Q112, "Q112 - C"), the green strip keeping its faint') && plants.every(Boolean)
    && /^- Running check\.sh \(2026-09-28\): [^\n]*setsid nohup bash -c '\.\/check\.sh > /.test(runLine) && part2.includes("setsid nohup bash -c 'CHECK_TIMES_FILE=<the project>/docs/CHECK-TIMES.md ./check.sh > /tmp/check.log 2>&1;")
    && part2.includes("- Running check.sh (2026-09-28): it takes about three hours (187 minutes in pass NP's final run and 191 in pass NQ's mid-pass run;") && part2.includes("names the project's step-times file, or records no step times; EARMARKS L20)")
    && audit.includes("and part two's line Running check.sh (2026-09-28) starts check.sh with CHECK_TIMES_FILE naming the project's step-times file, docs/CHECK-TIMES.md")
    && mdLines.split('\n').filter(Boolean).length === 4 && mdLines.startsWith('Then `src/logic.mjs`, then `src/ui.jsx`, then the tests.') && mdLines.includes('\n- Backups (2026-09-20): `autoBackup(reason)` runs on sign-out, first sign-in of the day and course finish,')
    && manual.includes('\n- Backups (2026-09-20): `autoBackup(reason)` runs when a student taps Exit and when an educator signs out, only if something changed,') && !manual.includes('first sign-in of the day and course finish, and saves')
    && manual.split("about three hours (187 minutes in pass NP's final run and 191 in pass NQ's mid-pass run)").length === 3 && manual.includes('`./check.sh`, which takes about three hours,') && !/about two and a half hours/.test(manual)
    && audit.includes("Corrected in pass NQ too, under the same word, after round three's records read: four lines of CLAUDE.md itself, the line Backups (2026-09-20),"),
    JSON.stringify({ q: dig(qs), s: dig(s2), w: dig(word), c: dig(q85), l: dig(line), k: dig(runLine), m: dig(mdLines), nWord: wordRows.length, nQ85: q85Rows.length, changed, corrected, answered, raised, withdrawn: withdrawn(audit), s2Now, plants })); }
// The commit message's title (CLAUDE-PART-2's Commit message line, Mikey, 2026-09-24: "a GitHub title of 72 characters or fewer"): round
// three's records read of pass NQ found pass NQ's title 115 characters, and pass NP's had been 91, with no check holding it, so the first
// line of docs/COMMIT-MESSAGE.md is held to 72 characters or fewer. Near miss: pass NQ's first title, 115 characters, put back, caught.
{ const msg = readFileSync(new URL('../docs/COMMIT-MESSAGE.md', import.meta.url), 'utf8');
  const titleOf = (t) => t.split('\n')[0]; const fits = (t) => titleOf(t).trim().length > 0 && [...titleOf(t)].length <= 72;
  const OLD_TITLE = "NQ: the checks' own tools (the planted-defect set, step times, the floor guard, the coverage receipt), Q112 to Q116";
  const planted = msg.replace(titleOf(msg), () => OLD_TITLE);
  ok(`docs/COMMIT-MESSAGE.md's first line, the GitHub title, is 72 characters or fewer (${[...titleOf(msg)].length}; CLAUDE-PART-2's Commit message line; pass NQ, round three's records read, which found 115; that title put back, planted, caught)`,
    fits(msg) && planted !== msg && [...OLD_TITLE].length === 115 && !fits(planted), titleOf(msg)); }
// Pass NR's records (Mikey, opening pass NR: "Q117 - A" and "Q119 - A"): the two questions answered, each in one line in section 11 and in
// full in docs/RULES-AUDIT-HISTORY.md's pass NR block for answered questions, with Q120 asked after them in section 11 and NEW-CHAT's open
// list, Q121 since round three's final read and Q122 since its screen read; the lines his answer to Q119 changed (the file's opening line, section 9's rows on the pass
// packet, on the records written once and, since round three's ripple read, on what pass NK learned, and section 10's heading and first
// step) and the rows the pass's work outgrew, corrected under his answer to Q85 (seventeen since round three's ripple read, twenty-two since the floors run
// after it and twenty-three since round three's screen read's fixes: section 2's five lines, section 5's two rows, section 6's one,
// section 7's seven, section 8's seven and section 9's one), each kept as pass NQ left
// them; section 9's new rows on Q117 and on the whole reads and the ripple read; INDEPENDENT-CHECKS' ripple read, its brief before the
// alignment read's and How item 14's sentence; and, in the records' second sitting, CLAUDE.md's first line and part two's Rules audit line
// changed to say what Q119 (a) made true, their words as pass NQ left them in docs/CLAUDE-HISTORY.md's pass NR block and section 9's row on
// CLAUDE.md lines naming the change. Each block is held by its digest, every row opening as its list says, each changed or corrected row
// saying so, as many times as its rows (section 10's heading, which can carry no sentence, aside), and section 9's row for Q85 naming them;
// one letter edited inside each block, planted, is caught.
{ const { createHash } = await import('node:crypto');
  const hist = readFileSync(new URL('../docs/RULES-AUDIT-HISTORY.md', import.meta.url), 'utf8'); const audit = readFileSync(new URL('../docs/RULES-AUDIT.md', import.meta.url), 'utf8');
  const ic = readFileSync(new URL('../docs/INDEPENDENT-CHECKS.md', import.meta.url), 'utf8'); const nc = readFileSync(new URL('../docs/NEW-CHAT.md', import.meta.url), 'utf8');
  const claudeHist = readFileSync(new URL('../docs/CLAUDE-HISTORY.md', import.meta.url), 'utf8'); const manual = readFileSync(new URL('../CLAUDE.md', import.meta.url), 'utf8'); const part2 = readFileSync(new URL('../CLAUDE-PART-2.md', import.meta.url), 'utf8');
  const kName = "CLAUDE.md's first line and CLAUDE-PART-2.md's Rules audit line as pass NQ left them, before pass NR changed them, word for word";
  const qName = "RULES-AUDIT section 11's answered questions in pass NR, word for word";
  const wName = "RULES-AUDIT rows as pass NQ left them, before pass NR changed them at Mikey's word, word for word";
  const cName = "RULES-AUDIT rows as pass NQ left them, before pass NR corrected them under Q85, word for word";
  const inside = (t, name) => { const a = t.indexOf(`<!-- ${name}: begin -->\n`); const b = t.indexOf(`<!-- ${name}: end -->`); return a < 0 || b < a ? '' : t.slice(a + `<!-- ${name}: begin -->\n`.length, b); };
  const dig = (t) => createHash('sha256').update(t, 'utf8').digest('hex').slice(0, 8);
  const plant = (t, name, from, to) => { const a = t.indexOf(`<!-- ${name}: begin -->`); const b = t.indexOf(`<!-- ${name}: end -->`); const i = a < 0 ? -1 : t.indexOf(from, a); return i < 0 || i > b ? t : t.slice(0, i) + to + t.slice(i + from.length); };   // inside its own block, never an older one with the same words
  const qs = inside(hist, qName); const word = inside(hist, wName); const q85 = inside(hist, cName); const claudeLines = inside(claudeHist, kName);
  const wordRows = word.split('\n').filter(Boolean); const q85Rows = q85.split('\n').filter(Boolean);
  const ANSWERS = { 117: 'Q117 - A', 119: 'Q119 - A' };
  const answered = Object.entries(ANSWERS).every(([n, x]) => new RegExp(`^- Q${n}\\. Answered in pass NR \\(Mikey: "${x}"\\): .*The question as it stood: `, 'm').test(qs) && audit.includes(`\n- Q${n}. Answered in pass NR (Mikey: "${x}"). Its rule lives in `));
  // Since pass NS, which answered them, a line for each in section 11, as pass NQ's block reads Q117 to Q119 (their words as asked are held
  // in pass NS's block for answered questions, below).
  const raised = [120, 121, 122].every((n) => new RegExp(`\\n- Q${n}\\. `).test(audit));
  const OPEN_WORD = ['Written 2026-10-06 (pass LD, rewritten in pass LE', "| **The pass packet (Mikey's answer to Q95, pass NH", '| **The records written once, each count filled in', "| **What pass NK learned (Claude's", "## 10. The plan, in Mikey's order (updated 2026-10-06", '1. This file complete and read by every chat (since pass NH'];
  const OPEN_Q85 = ['- **My Classroom:** ', '- **Practice:** ', '- **Wonder questions:** ', '- **What pre-K teaches:** ', "- **The educator's report:** ", '| **Say it together, one word in five silly ways', "| **Domain III's predictions, retelling and book handling", '| **A heard question prints none of the words it asks about', "| **A lesson's own reset bounds every reader", "| **The report's own words about a lesson say what", '| The class view: a need score', '| **The weekly note and Since you last looked', '| **A lesson named in a sentence keeps its name', '| **The light review, the fourth exposure', '| **A pre-reader hears all four Wonder voices', "| **No pre-K line or question waits under a short phone's fold", '| **The reading light never moves the words', "| **The picture to match draws at its answers' size", '| **No word under the scroll cue on a short phone', "| **A lesson's words keep a hyphenated word whole", '| **Every drawing on an answer tile reads at its edge', "| **Every drawing on the dark theme's lesson paper reads at its edge", '| **An id is defined once (pass MX)'];
  // The two CLAUDE lines (Q119 (a)): each says the weekly whole reads, the ripple read and what a lesson pass's alignment and final reads
  // read, the last marked Claude's reading since round three's final read, the old words of both kept, and section 9's row on CLAUDE.md
  // lines naming the change.
  const claudeNow = manual.split('\n')[0].endsWith("since Mikey's answer to Q119 (pass NR) the three are read whole once a week, in the tools pass, and in a lesson pass the ripple read reads the rows restating its changes, the alignment and final reads the records it changed and those rows (Claude's reading).")
    && part2.includes("since pass NR, at his answer to Q119, read whole once a week in the tools pass, and in a lesson pass the ripple read reads the rows restating its changes, the alignment and final reads the records it changed and those rows, Claude's reading)")
    && /^New chats: read docs\/NEW-CHAT\.md first, then the pass packet it asks for [^\n]*the alignment read and the final read read those three files whole\.\n- Rules audit \(2026-10-06, pass LD, Mikey\): [^\n]*the alignment read and the final read reading it whole\), and when a rule is added or changed/.test(claudeLines)
    && audit.includes("Changed in pass NR, under Mikey's standing word of pass NG on CLAUDE.md: CLAUDE.md's first line and part two's line Rules audit (2026-10-06, pass LD, Mikey),")
    // CLAUDE.md's line on the rules test (pass NR, after its final run of 1:48 PM stopped out of memory): the run given 4 GB, its old words kept.
    && inside(claudeHist, "CLAUDE.md's line on the rules test as pass NQ left it, before pass NR changed it, word for word") === "- `node tests/logic.test.mjs` — rules only; fastest loop while changing logic.\n"
    && manual.includes("\n- `node --max-old-space-size=4096 tests/logic.test.mjs` — rules only;") && audit.includes("Changed in pass NR too, under the same word, after its final check run of 1:48 PM stopped in its first step out of memory: CLAUDE.md's line on running the rules test alone");
  const said = (re) => (audit.match(re) || []).length;
  const changed = said(/Changed in place in pass NR, at Mikey's word \(his answer to Q119, "Q119 - A"\), its pass NQ words in docs\/RULES-AUDIT-HISTORY\.md\./g);
  const corrected = said(/Corrected in place in pass NR, under Mikey's answer to Q85, its pass NQ words in docs\/RULES-AUDIT-HISTORY\.md\./g);
  const rows = audit.includes("| **A long row's pass-by-pass history moved to the history file (Mikey's answer to Q117, pass NR, \"Q117 - A\";") && audit.includes("| **The long records read whole once a week, and a ripple read in each lesson pass (Mikey's answer to Q119, pass NR, \"Q119 - A\";")
    && audit.includes("Changed in pass NR, at Mikey's word (his answers to Q117 and Q119), each saying so,") && audit.includes("Corrected in pass NR, under Mikey's answer to Q85, each saying so,");
  const ripple = ic.includes('\n## The ripple read\n') && ic.indexOf('\n## The ripple read\n') < ic.indexOf('\n## The alignment read\n')
    && ic.includes('Since pass NR (Mikey\'s answer to Q119, "Q119 - A") the long files are read whole once a week, in the tools pass, and a lesson pass runs the ripple read in their place');
  const plants = [dig(inside(plant(hist, qName, 'The question as it stood: Moving a long row', 'The question as it stood: Moving a lung row'), qName)) !== dig(qs),
    dig(inside(plant(hist, wName, 'the alignment read and the final read read it whole. It holds', 'the alignment read and the final read rad it whole. It holds'), wName)) !== dig(word),
    dig(inside(plant(hist, cName, 'then Who needs help once there are two students.', 'then Who needs halp once there are two students.'), cName)) !== dig(q85),
    dig(inside(plant(claudeHist, kName, 'read those three files whole.', 'read those three files hole.'), kName)) !== dig(claudeLines)];
  ok(`docs/RULES-AUDIT-HISTORY.md keeps the questions answered in pass NR, Q117 and Q119 (digest ${dig(qs)}), the lines Mikey's answer to Q119 changed (digest ${dig(word)}, ${wordRows.length} lines) and the rows corrected under Q85 (digest ${dig(q85)}, ${q85Rows.length} rows), unchanged; each question answered in one line in section 11, Q120 asked after them there and in NEW-CHAT, Q121 since round three's final read and Q122 since its screen read; each changed or corrected row saying so and section 9's rows naming them; and INDEPENDENT-CHECKS' ripple read with How item 14's sentence; and docs/CLAUDE-HISTORY.md keeps CLAUDE.md's first line and part two's Rules audit line as pass NQ left them (digest ${dig(claudeLines)}), both lines now saying what Q119 (a) made true, their last clause marked Claude's reading (pass NR's records; one letter edited inside each block, planted, caught)`,
    dig(qs) === '0142f1fc' && dig(word) === 'a76755b1' && dig(q85) === '0a504952' && dig(claudeLines) === '7793c3e4' && claudeNow && answered && raised && !/\n- Q11[79]\. (?!Answered)/.test(audit)
    && wordRows.length === OPEN_WORD.length && OPEN_WORD.every((w, k) => wordRows[k].startsWith(w)) && q85Rows.length === OPEN_Q85.length && OPEN_Q85.every((w, k) => q85Rows[k].startsWith(w))
    && changed === wordRows.length - 1 && corrected === q85Rows.length && rows && ripple && plants.every(Boolean),
    JSON.stringify({ q: dig(qs), w: dig(word), c: dig(q85), k: dig(claudeLines), claudeNow, nWord: wordRows.length, nQ85: q85Rows.length, changed, corrected, answered, raised, rows, ripple, plants })); }
// Pass NS's records (Mikey, opening pass NS: "Q120 - A", "Q121 - A" and "Q122 - A"): the three questions answered, each in one line in
// section 11 and in full in docs/RULES-AUDIT-HISTORY.md's pass NS block for answered questions; the lines his answers changed (the file's
// opening line, section 6's row on a heard question, section 7's row on confidence, section 8's row on the grown-up's card, section 9's rows
// on what every pass reads, on the pass packet and on its honest count, and section 10's heading and first step), kept as pass NR left
// them; CLAUDE.md's first line and part two's Rules audit line, changed under his standing word of pass NG after his answer to Q120, their
// words as pass NR left them in docs/CLAUDE-HISTORY.md's pass NS block; and INDEPENDENT-CHECKS' How item 11, a packet for each agent. Each
// block is held by its digest, every row opening as its list says, each changed row saying so, as many times as its rows (section 10's
// heading, which can carry no sentence, aside), and section 9's rows naming them. And the pass packet's bullet, from pass NS on, gives the
// task packets (--task), each read whole with its bytes, and both counts (Q120 (a)). One letter edited inside each block, and a made pass
// NS entry with its bullet's --task taken out, planted, are each caught.
{ const { createHash } = await import('node:crypto');
  const hist = readFileSync(new URL('../docs/RULES-AUDIT-HISTORY.md', import.meta.url), 'utf8'); const audit = readFileSync(new URL('../docs/RULES-AUDIT.md', import.meta.url), 'utf8');
  const ic = readFileSync(new URL('../docs/INDEPENDENT-CHECKS.md', import.meta.url), 'utf8'); const dec = readFileSync(new URL('../docs/DECISIONS.md', import.meta.url), 'utf8');
  const claudeHist = readFileSync(new URL('../docs/CLAUDE-HISTORY.md', import.meta.url), 'utf8'); const manual = readFileSync(new URL('../CLAUDE.md', import.meta.url), 'utf8'); const part2 = readFileSync(new URL('../CLAUDE-PART-2.md', import.meta.url), 'utf8');
  const qName = "RULES-AUDIT section 11's answered questions in pass NS, word for word";
  const wName = "RULES-AUDIT rows as pass NR left them, before pass NS changed them at Mikey's word, word for word";
  const kName = "CLAUDE.md's first line and CLAUDE-PART-2.md's Rules audit line as pass NR left them, before pass NS changed them, word for word";
  // Since pass NS's records read: part three's fifth line, which said a feature's rows come by the pass packet's areas, kept in its own block.
  const p3Name = "CLAUDE-PART-3.md's line on the history's index as pass NR left it, before pass NS's records read corrected it, word for word";
  const part3 = readFileSync(new URL('../CLAUDE-PART-3.md', import.meta.url), 'utf8');
  const inside = (t, name) => { const a = t.indexOf(`<!-- ${name}: begin -->\n`); const b = t.indexOf(`<!-- ${name}: end -->`); return a < 0 || b < a ? '' : t.slice(a + `<!-- ${name}: begin -->\n`.length, b); };
  const dig = (t) => createHash('sha256').update(t, 'utf8').digest('hex').slice(0, 8);
  const plant = (t, name, from, to) => { const a = t.indexOf(`<!-- ${name}: begin -->`); const b = t.indexOf(`<!-- ${name}: end -->`); const i = a < 0 ? -1 : t.indexOf(from, a); return i < 0 || i > b ? t : t.slice(0, i) + to + t.slice(i + from.length); };   // inside its own block, never an older one with the same words
  const qs = inside(hist, qName); const word = inside(hist, wName); const claudeLines = inside(claudeHist, kName); const p3Line = inside(claudeHist, p3Name);
  const wordRows = word.split('\n').filter(Boolean);
  const ANSWERS = { 120: 'Q120 - A', 121: 'Q121 - A', 122: 'Q122 - A' };
  const answered = Object.entries(ANSWERS).every(([n, x]) => new RegExp(`^- Q${n}\\. Answered in pass NS \\(Mikey: "${x}"\\): .*The question as it stood: `, 'm').test(qs) && audit.includes(`\n- Q${n}. Answered in pass NS (Mikey: "${x}"). Its rule lives in `));
  const OPEN_WORD = ['Written 2026-10-06 (pass LD, rewritten in pass LE', '| **A heard question prints none of the words it asks about', '| **Confidence, 1 to 5:**', "| **The grown-up's card on a device with no voice", '| Every pass: read NEW-CHAT, the pass packet', "| **The pass packet (Mikey's answer to Q95, pass NH", "| **The pass packet's honest count (pass NQ", "## 10. The plan, in Mikey's order (updated 2026-10-06", '1. This file complete and read by every chat (since pass NH'];
  const said = (re) => (audit.match(re) || []).length;
  const changed = said(/Changed in place in pass NS, at Mikey's word \(his answer to Q12[0-2], "Q12[0-2] - A"\), its pass NR words in docs\/RULES-AUDIT-HISTORY\.md\./g);
  // The two CLAUDE lines (Q120 (a)): CLAUDE.md's first line names RULES-AUDIT's sections 9 to 11 and each agent's own rows, and keeps pass
  // NR's last clause word for word; part two's line names them too; their old words kept; section 9's row on CLAUDE.md lines naming the change.
  const claudeNow = /^New chats: read docs\/NEW-CHAT\.md first, then docs\/RULES-AUDIT\.md's sections 9 to 11 whole and the latest docs\/DECISIONS\.md entry, as NEW-CHAT says \(Mikey's answer to Q120, pass NS; from pass NH a pass packet stood in their place\); each agent is given a packet of its own task's rows of docs\/RULES-AUDIT\.md and docs\/EARMARKS\.md \(node tools\/pass-packet\.mjs --task\) and its brief in docs\/INDEPENDENT-CHECKS\.md, each read whole; since Mikey's answer to Q119 \(pass NR\) the three are read whole once a week/.test(manual.split('\n')[0])
    && part2.includes('since pass NS (Q120) sections 9 to 11 whole, each agent its own rows; since pass NR,')
    && /^New chats: read docs\/NEW-CHAT\.md first, then the pass packet it asks for [^\n]*\n- Rules audit \(2026-10-06, pass LD, Mikey\): [^\n]*since pass NR, at his answer to Q119, read whole once a week in the tools pass[^\n]*\n$/.test(claudeLines)
    && audit.includes("Changed in pass NS, under Mikey's standing word of pass NG on CLAUDE.md, at his answer to Q120 (\"Q120 - A\"): CLAUDE.md's first line,");
  const rows = audit.includes("Changed in pass NS, at Mikey's word (his answers to Q120, Q121 and Q122), each saying so,") && ic.includes('\n11. A packet for each agent (since pass NS, Mikey\'s answer to Q120, "Q120 - A";') && !ic.includes('\n11. The pass packet (since pass NH');
  // The task packets' form in the bullet, from pass NS on: --task, read whole, the bytes and both counts.
  const entriesOf = (text) => text.split(/\n(?=## \d{4}-\d{2}-\d{2} \(pass [A-Z]{2}\))/).filter((e) => /^## \d{4}-\d{2}-\d{2} \(pass [A-Z]{2}\)/.test(e));
  const codeOf = (e) => (e.match(/^## \d{4}-\d{2}-\d{2} \(pass ([A-Z]{2})\)/) || [])[1] || '';
  const taskForm = (e) => { const b = (e.match(/^- \*\*The pass packet\.\*\* .*$/m) || [''])[0]; return /node tools\/pass-packet\.mjs --task/.test(b) && /\bread whole\b/.test(b) && /\b\d{1,3}(?:,\d{3})+ bytes\b|\b\d+ bytes\b/.test(b) && /Findings traced to a line the packet left out: (\d+|none)\b/.test(b) && /Findings whose rule was in the packet and was missed: (\d+|none)\b/.test(b); };
  const unkept = entriesOf(dec).filter((e) => codeOf(e) >= 'NS' && codeOf(e).length === 2).filter((e) => !taskForm(e)).map((e) => e.slice(0, 30));
  const made = '## 2026-11-17 (pass NS): a made entry\n\n- **The pass packet.** The lead read RULES-AUDIT sections 9 to 11 whole (257,471 bytes), and each reader its own task packet, read whole (node tools/pass-packet.mjs --task --match \'a\', 36,077 bytes). Findings traced to a line the packet left out: none. Findings whose rule was in the packet and was missed: 1.\n';
  const plants = [dig(inside(plant(hist, qName, 'A rules packet for each agent, read whole,', 'A rules packet for each agent, read hole,'), qName)) !== dig(qs),
    dig(inside(plant(hist, wName, "a new chat's lead reads it through the pass packet", "a new chat's lead read it through the pass packet"), wName)) !== dig(word),
    dig(inside(plant(claudeHist, kName, 'then the pass packet it asks for', 'then the pass packet it asked for'), kName)) !== dig(claudeLines),
    taskForm(made), !taskForm(made.replace('pass-packet.mjs --task', 'pass-packet.mjs')),
    dig(inside(plant(claudeHist, p3Name, 'which the pass packet brings by area', 'which the pass packet brought by area'), p3Name)) !== dig(p3Line)];
  ok(`docs/RULES-AUDIT-HISTORY.md keeps the questions answered in pass NS, Q120 to Q122 (digest ${dig(qs)}), and the lines Mikey's answers changed (digest ${dig(word)}, ${wordRows.length} lines), unchanged; each answered in one line in section 11, each changed row saying so and section 9's rows naming them, and INDEPENDENT-CHECKS' How item 11 a packet for each agent; docs/CLAUDE-HISTORY.md keeps CLAUDE.md's first line and part two's Rules audit line as pass NR left them (digest ${dig(claudeLines)}), and since pass NS's records read part three's fifth line (digest ${dig(p3Line)}), the lines saying what Q120 (a) made true; and the pass packet's bullet in every entry from pass NS on gives the task packets, read whole, their bytes and both counts (pass NS; one letter edited in each block and the bullet's --task taken out, planted, caught)`,
    dig(qs) === '28eeec29' && dig(word) === '672cd77e' && dig(claudeLines) === 'f705174f' && dig(p3Line) === '21b20699' && /^Since pass NL this file holds an index[^\n]*which the pass packet brings by area\.[^\n]*\n$/.test(p3Line) && part3.split('\n')[4].includes('which a task packet brings by its words.') && audit.includes("At pass NS's records read (Fable), CLAUDE.md's first line says") && claudeNow && answered && !/\n- Q12[0-2]\. (?!Answered)/.test(audit)
    && wordRows.length === OPEN_WORD.length && OPEN_WORD.every((w, k) => wordRows[k].startsWith(w)) && changed === wordRows.length - 1 && rows && unkept.length === 0 && plants.every(Boolean),
    JSON.stringify({ q: dig(qs), w: dig(word), k: dig(claudeLines), p3: dig(p3Line), claudeNow, nWord: wordRows.length, changed, answered, rows, unkept, plants })); }
console.log(`\n${passed} passed, ${failed} failed`);
process.exitCode = failed ? 1 : 0;   // never process.exit(): it can drop the last lines of a piped stdout (CLAUDE.md, 2026-09-23)
