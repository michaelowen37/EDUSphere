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
  // Since pass MM CLAUDE.md is the short manual with no replaced lines, so it is read too; its old lines live in the history.
  files.push(new URL('../CLAUDE.md', import.meta.url));
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
  const at = manual.indexOf('## Lines a coder needs most'); const keptLines = at < 0 ? [] : manual.slice(at).split('\n').filter((l) => l.startsWith('- '));
  const blockLines = new Set(block.split('\n'));
  // Since pass MN (Mikey's answer to Q53, "Q53 - B") a kept line gone stale is corrected in place once RULES-AUDIT section 9's
  // row names it: a dated line that is not word for word a line of the history must be named in that row (its label, the words
  // before its first colon, followed there by a comma, a semicolon or " and"), and the history must keep a line with that label.
  const s9 = audit.slice(audit.indexOf('## 9. Process'), audit.indexOf('\n## 10.'));
  const row = (s9.split('\n').find((l) => l.startsWith('| **Section 11 keeps one line for each answered question')) || '');
  const esc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const notCopied = keptLines.filter((l) => !blockLines.has(l)).filter((l) => { const m = /^- ([^:]+):/.exec(l); const label = m ? m[1] : null;
    return !label || !new RegExp(`${esc(label)}(?=,|;| and )`).test(row) || ![...blockLines].some((h) => h.startsWith(`- ${label}:`)); });
  ok('every dated line CLAUDE.md keeps is word for word a line of the history or corrected in place as RULES-AUDIT section 9 names it, and the manual stays under 40,000 bytes (passes MM and MN)', keptLines.length >= 40 && notCopied.length === 0 && Buffer.byteLength(manual, 'utf8') < 40000, `${keptLines.length} kept; ${Buffer.byteLength(manual, 'utf8')} bytes; neither copied nor named: ${notCopied.map((l) => l.slice(0, 50)).join(' | ')}`);
  // Near misses: a corrected line the row does not name, and a label the row names only as the start of a longer one.
  { const nearRow = 'and the dated lines Themes (2026-09-24, Mikey), and more;'; const named = (label) => new RegExp(`${esc(label)}(?=,|;| and )`).test(nearRow);
    ok('a corrected line counts only when the row names its whole label (Themes (2026-09-24) is not Themes (2026-09-24, Mikey))', !named('Themes (2026-09-24)') && named('Themes (2026-09-24, Mikey)') && !named('Running check.sh (2026-09-28)')); }
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
// HANDOFF's numbers name the ledger's last serials (round three's final read, pass MO: they were a pass behind, S3914, D245 and
// P154, as pass LX found them once).
{ const h = readFileSync(new URL('../docs/HANDOFF.md', import.meta.url), 'utf8'); const art = readFileSync(new URL('../docs/ART-REQUESTS.md', import.meta.url), 'utf8');
  const top = (p) => Math.max(...[...art.matchAll(new RegExp('^\\| ' + p + '(\\d+) \\|', 'gm'))].map((m) => +m[1]));
  const want = ['S1 to S' + top('S'), 'CS1 to CS' + top('CS'), 'D28 to D' + top('D'), 'P1 to P' + top('P'), 'C1 to C' + top('C')];
  ok("HANDOFF's numbers name the ledger's last serials", want.every((w) => h.includes(w)), want.filter((w) => !h.includes(w)).join(', ')); }
console.log(`\n${passed} passed, ${failed} failed`);
process.exitCode = failed ? 1 : 0;   // never process.exit(): it can drop the last lines of a piped stdout (CLAUDE.md, 2026-09-23)
