// Copyright (c) 2026 iECHO, LLC. All rights reserved.
// -----------------------------------------------------------------------------------------------------------------
// The ripple read's manifest, made by a tool (pass NX, EARMARKS L28; the ripple read is Mikey's answer to Q119, pass NR, "Q119 - A").
//
// In plain terms: since pass NR a lesson pass does not read its three long records whole (docs/RULES-AUDIT.md, docs/EARMARKS.md and
// docs/INDEPENDENT-CHECKS.md). A reader on Fable, the ripple read (docs/INDEPENDENT-CHECKS.md), searches them and the records that
// restate them for every row that still says what the pass changed, starting from a manifest of the changes, which the lead wrote by
// hand. A hand list holds what the lead thought of: pass NR's ripple read found the browser tests' floors still at pass NP's counts
// while the pass had added four lessons, 52 lesson lines, 20 banks and seven drawings. This tool writes the manifest from two trees,
// the last delivered one (--base) and the tree it sits in, from the tools' own readings, so the reader starts from a list with recall
// and judges it. It finds too much on purpose: the reader judges each entry, and the lead each finding, before a row changes.
//
// What it lists, by section (L28's six items and the ripple brief's four):
//   1. Every value the floor guard and tools/record-counts.mjs read that moved, old and new: the guard's floors, limits, waits, kept
//      lists, pinned counts, check.sh's limits and each step's count of checks; record-counts' counts and the markers that hold them.
//   2. What the pass moved, kind by kind (lessons, lesson lines, drawings, banks, questions, stories and the rest, counted in both
//      trees), and every floor, ceiling or pinned count in a test or tool whose words name a kind it moved, whether or not its own value
//      moved (L28's item 1), each with what it counts (its name, the label of its check, the comment above it); and every number in a
//      test or tool equal to a moved count's old value.
//   3. Every id, title, function, file and tool flag added, renamed or removed: tools/content-snapshot.mjs's keys for the content (a
//      renamed id is a key gone and one added with the same item, or the same title), the files by their bytes, and for each changed
//      script its exported names (in src every top-level name) and the flags its strings hold.
//   4. Every question raised, answered or withdrawn in docs/RULES-AUDIT.md section 11, every RULES-AUDIT row whose text changed (by its
//      title) and every EARMARKS row (by its id), each with its old and new words and the rows on either side named (L28's item 6), and
//      every heading or line removed or changed in the records, with its old and new words.
//   5. L28's items 2, 3 and 5: the searches "since pass <a pass>", from the last lesson pass to the base's own, and "<a moved count>
//      since pass", with their hits in the records the ripple read searches (HANDOFF's check.sh line by its newest segment alone); the
//      counts each quick test prints, old and new, by running each in both trees and diffing their PASS and NOTE lines; and HANDOFF's
//      check.sh line, read by its newest pass's segment in each tree. L28's item 4 is judgment, so it is a list and not a verdict: every
//      row that holds a moved value's old number in the present tense, the verdict the reader's, as the manifest says.
// What it reuses, never a second copy of their rules: the floor guard reads both trees itself, each in a copy made as its header says a
// baseline is written from a delivered tree (this tree's guard put in, the baseline left out, --write --first), so every value is the
// guard's own reading; tools/record-counts.mjs's recordCounts() reads each tree's code and its marker pattern the records;
// tools/content-snapshot.mjs's snapshot() reads each tree, the same code for both, as tools/content-diff.mjs runs it; tools/pass-packet.mjs's
// linesOf and titleOf read the rows and name them; and each quick test runs in each tree as check.sh runs it. What it reads itself, since
// no tool reads it: the ceilings (< and <=) of every ok( condition, and its floors and pinned counts of 10 or more that the guard does not
// read, each at the condition's top level as the guard reads its own, by the TypeScript parser that check.sh's step 9 already needs; the
// exported names and flags; and the records' questions, rows and lines.
// What stays the reader's: where each entry is restated and whether each row is still true; a row dated to an older pass that reads as
// current (L28's item 4), listed in section 5 for the reader to judge; and what the ripple brief says no search can see.
//
// Nothing is written in either tree but the --out file, which may not be in the base: the guard and the counts run in temporary
// copies made of links to a tree's files, removed link by link (a link is unlinked, only a real folder entered), and the manifest
// checks at its end that every file of the base is as it was.
//
// Run: node tools/ripple-manifest.mjs --base <the last delivered tree> [--out <file>] [--lesson-pass <pass>] [--quick <tests>|--no-quick]
//      (about four minutes on the pass's two-CPU machine: two content snapshots of about a minute each and the six quick tests in each
//      tree; without --out the manifest goes to standard output and its notes to standard error; it exits 2 when an argument is refused
//      or none gives --base, and 1 when a part could not be read or the base changed, each named in the manifest)
//      node tools/ripple-manifest.mjs --selftest   (made base and tree pairs, the tool run on them as the lead runs it; a few seconds)
// -----------------------------------------------------------------------------------------------------------------
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, lstatSync, mkdtempSync, mkdirSync, copyFileSync, symlinkSync, unlinkSync, rmdirSync, realpathSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join, resolve, dirname, basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { linesOf, titleOf } from './pass-packet.mjs';
import { COUNT_MARK, RECORD_DOCS } from './record-counts.mjs';

// This tree, this tool's own file, and what a comparison of two trees leaves out: the build's output and what a run leaves behind.
const HERE = resolve(fileURLToPath(new URL('..', import.meta.url)));
// A run's seconds, said as a person says them ("1 second", "12 seconds").
const secondsSince = (start) => { const s = Math.round((Date.now() - start) / 1000); return s === 1 ? '1 second' : s + ' seconds'; };
const SELF = 'tools/ripple-manifest.mjs';
const SKIPPED = /^(?:\.git|node_modules|dist|CHECKPOINT|tests\/e2e\/out|tests\/e2e\/art)(?:\/|$)|^(?:index\.html|sw\.js)$|(?:^|\/)\.DS_Store$/;
// The six quick tests whose printed counts L28's item 3 diffs, each run as check.sh runs it (its steps 4, 5, 3, 5b, 2 and 5c).
const QUICK_TESTS = ['tests/scripts.test.mjs', 'tests/stories.test.mjs', 'tests/spelling.test.mjs', 'tests/ledger.test.mjs', 'tests/coverage.test.mjs', 'tests/pictures.test.mjs'];
// The records whose removed and changed lines section 4 lists: the pass's own records (the engineer brief's list), the records the
// ripple read searches and the two history files, since nothing already written in them is removed (RULES-AUDIT section 9).
const RECORDS = ['docs/RULES-AUDIT.md', 'docs/RULES-AUDIT-HISTORY.md', 'docs/EARMARKS.md', 'docs/INDEPENDENT-CHECKS.md', 'docs/NEW-CHAT.md', 'docs/NEW-CHAT-HISTORY.md',
  'docs/DECISIONS.md', 'docs/HANDOFF.md', 'docs/PROJECT-CONTEXT.md', 'docs/ALGORITHMS.md', 'docs/DESIGN.md', 'README.md', 'CLAUDE.md', 'CLAUDE-PART-2.md', 'CLAUDE-PART-3.md', 'docs/CLAUDE-HISTORY.md'];
// The records the ripple read searches (its brief in docs/INDEPENDENT-CHECKS.md), the three long ones first.
const SEARCHED = ['docs/RULES-AUDIT.md', 'docs/EARMARKS.md', 'docs/INDEPENDENT-CHECKS.md', 'docs/NEW-CHAT.md', 'docs/HANDOFF.md', 'docs/PROJECT-CONTEXT.md',
  'docs/ALGORITHMS.md', 'docs/DESIGN.md', 'README.md', 'CLAUDE.md', 'CLAUDE-PART-2.md', 'CLAUDE-PART-3.md'];
const LONG_THREE = ['docs/RULES-AUDIT.md', 'docs/EARMARKS.md', 'docs/INDEPENDENT-CHECKS.md'];

// What a value counts, read from its words (its name, its check's label and the comment above it): each kind of content a pass can
// move, and the words that name it. A value whose words name a kind the pass moved is listed in section 2. The screens a walk visits
// grow with the lessons, their lines, their drawings and the questions, so a screen count is read as moved with any of them.
const KIND_WORDS = {
  lessons: /\b(?:lessons?|modules?|mods?)\b/,
  'lesson lines': /\b(?:lines?|scripts?|paragraphs?)\b/,
  drawings: /\b(?:drawings?|drawn|pictures?|pics?|diagrams?|paintings?|icons?|kinds?|looks?|shapes?|art)\b/,
  banks: /\b(?:banks?|generators?|gens?)\b/,
  questions: /\b(?:questions?|prompts?|seeds?|rounds?|choices?|answers?|tiles?|cards?)\b/,
  stories: /\b(?:stor(?:y|ies)|books?|pages?)\b/,
  'coloring pages': /\bcolou?ring\b/,
  Wonder: /\bwonders?\b/,
  games: /\b(?:games?|boards?|decks?|welcomes?)\b/,
  screens: /\bscreens?\b/,
  'audio rows': /\b(?:clips?|audio|voices?|sounds?|recordings?)\b/,
  'art rows': /\b(?:ledger|serials?|paintings?)\b/,
  courses: /\b(?:courses?|grades?|subjects?)\b/,
};
// The words a record uses for each count, read in section 5's present-tense rows as the start of a word (a record says "744 modules"
// or "744 lessons"); record-counts' names first, then the kinds of section 2.
const STEMS = { courses: 'course', modules: 'modul|lesson', subjects: 'subject', moduleStories: 'stor', courseStories: 'stor', nextStories: 'stor', lifeSkills: 'skill',
  games: 'game', gameKinds: 'kind', wonder: 'wonder|question', wonderEarly: 'wonder|question', coloringPages: 'page', banks: 'bank|generator', lessons: 'lesson|modul',
  'lesson lines': 'line', paragraphs: 'paragraph', drawings: 'drawing|picture', questions: 'question', stories: 'stor', 'coloring pages': 'page', Wonder: 'wonder',
  'art rows': 'row|picture|painting', 'audio rows': 'clip|row' };
// A verb in the present tense, the mark of a row that reads as current (L28's item 4), so a sentence with one beside an old count is listed.
const PRESENT = /\b(?:is|are|has|have|holds?|reads|counts|gives|takes|makes|prints|runs|stands|sits|lists|names|walks|keeps|needs|asks|says|shows|draws|covers|deals|plays|opens|stays|pins|checks|finds|comes|goes)\b/i;

// Small helpers: a digest of bytes, a count with its noun, a text cut to a length, and a number as the records write it, standing alone
// (never inside an id such as count-to-3), with its commas.
// (A snapshot can hold an item whose value is undefined, a table entry JSON cannot write, so a value that is neither text nor bytes
// is digested as its words.)
const digest = (x) => createHash('sha1').update(typeof x === 'string' || Buffer.isBuffer(x) ? x : String(x)).digest('base64').slice(0, 12);
const plural = (n, word, many) => `${Number(n).toLocaleString('en-US')} ${n === 1 ? word : many || word + 's'}`;
const cut = (s, n = 300) => { const t = String(s).replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, n) + ' ...' : t; };
const quoted = (s, n) => '"' + cut(s, n) + '"';
const NUMBER = /(?<![\w.,-])(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?(?![\w-]|,\d)/g;
const numbersIn = (s) => [...String(s).matchAll(NUMBER)].map((m) => m[0]);
const valueOf = (s) => Number(String(s).replace(/,/g, ''));
const masked = (s) => String(s).replace(NUMBER, '#');
const stemOf = (word) => { const w = String(word || '').toLowerCase().replace(/[^a-z]/g, ''); const s = w.replace(/(?:ies|es|s|y)$/, ''); return s.length >= 3 ? s : w.length >= 3 ? w : ''; };
const escapeRe = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// The word a guard value's name ends on, its family's ending and .length or .size taken off (READ_FLOOR is read, PRINT_PAIRS.length pairs).
const lastWord = (name) => { const words = String(name).replace(/\.(?:length|size)$/, '').split('.').pop().replace(/_(?:FLOORS?|LIMIT|WAITS|WAITING|KEPT|EXCEPTIONS)$/, '').replace(/([a-z])([A-Z])/g, '$1 $2').split(/[\s_]+/).filter(Boolean); return words[words.length - 1] || ''; };
const NUMBER_WORDS = { 10: 'ten', 11: 'eleven', 12: 'twelve', 13: 'thirteen', 14: 'fourteen', 15: 'fifteen', 16: 'sixteen', 17: 'seventeen', 18: 'eighteen', 19: 'nineteen', 20: 'twenty' };
// A count in every form the records write it (digits, digits with commas, and its word up to twenty, with a capital or without), as a
// pattern that never matches inside a longer number.
const numberPattern = (n) => { const forms = [String(n)]; const commas = Number(n).toLocaleString('en-US'); if (commas !== String(n)) forms.push(commas);
  const w = NUMBER_WORDS[n]; if (w) forms.push(w, w[0].toUpperCase() + w.slice(1)); return '(?<![\\w.,])(?:' + forms.map(escapeRe).join('|') + ')(?![\\w]|,\\d)'; };

// The TypeScript parser, from npm's global modules as the scripts test finds it (check.sh's step 9 runs the global tsc, so it is there
// wherever check.sh runs); the command line refuses to start without it.
let ts = null;
function parser() {
  if (!ts) ts = createRequire(import.meta.url)(join(execFileSync('npm', ['root', '-g'], { encoding: 'utf8' }).trim(), 'typescript'));
  return ts;
}
const parse = (rel, text) => { const T = parser(); return T.createSourceFile(rel, text, T.ScriptTarget.Latest, true, /\.jsx$/.test(rel) ? T.ScriptKind.JSX : T.ScriptKind.JS); };

// Every file of a tree but the build's output and what a run leaves, each with its size, its time and (when asked) a digest of its bytes.
function filesOf(root, withDigest = true) {
  const out = new Map();
  const walk = (rel) => { for (const name of readdirSync(rel ? join(root, rel) : root).sort()) { const r = rel ? rel + '/' + name : name; if (SKIPPED.test(r)) continue;
    const st = statSync(join(root, r)); if (st.isDirectory()) walk(r); else if (st.isFile()) out.set(r, { size: st.size, time: st.mtimeMs, digest: withDigest ? digest(readFileSync(join(root, r))) : '' }); } };
  walk(''); return out;
}

// A temporary copy of a tree made of links to its files, read and never written, and its removal link by link: a link is unlinked and
// only a real folder is entered, so no file a link points to is ever touched (a recursive delete that followed a link would empty the base).
function unmirror(path) { const st = lstatSync(path); if (st.isSymbolicLink() || !st.isDirectory()) { unlinkSync(path); return; } for (const name of readdirSync(path)) unmirror(join(path, name)); rmdirSync(path); }
const linkAll = (from, to, leave = []) => { mkdirSync(to, { recursive: true }); if (!existsSync(from)) return; for (const name of readdirSync(from)) if (!leave.includes(name)) symlinkSync(join(from, name), join(to, name)); };
const lastLine = (s) => String(s || '').trim().split('\n').pop() || '';

// The floor guard's own reading of a tree (section 1, and the floors and pinned counts of section 2). In a temporary copy holding links
// to the tree's tests, tools, code, check.sh, docs/CHECK-TIMES.md and docs/DECISIONS.md, with this tree's guard put in and the baseline
// left out, the guard writes its baseline with --write --first, as its header says a baseline is written from the last delivered tree,
// and that file holds every value it reads. This tree's guard reads both trees, so a value that moved is a value and never a change in the
// guard's reading. (Its import of tools/check-times.mjs is the tree's own, the parser of that tree's step times; a tree without one is
// given this tree's.)
function guardRead(root) {
  const guard = join(HERE, 'tests/floor-guard.test.mjs');
  if (!existsSync(guard)) return { values: null, error: 'this tree has no tests/floor-guard.test.mjs' };
  const dir = mkdtempSync(join(tmpdir(), 'ripple-guard-'));
  try {
    linkAll(join(root, 'tests'), join(dir, 'tests'), ['fixtures', 'floor-guard.test.mjs']);
    linkAll(join(root, 'tests/fixtures'), join(dir, 'tests/fixtures'), ['floor-baseline.json']);
    copyFileSync(guard, join(dir, 'tests/floor-guard.test.mjs'));
    linkAll(join(root, 'tools'), join(dir, 'tools'));
    if (!existsSync(join(dir, 'tools/check-times.mjs'))) copyFileSync(join(HERE, 'tools/check-times.mjs'), join(dir, 'tools/check-times.mjs'));
    symlinkSync(join(root, 'src'), join(dir, 'src'));
    mkdirSync(join(dir, 'docs'));
    for (const f of ['check.sh', 'docs/CHECK-TIMES.md', 'docs/DECISIONS.md']) if (existsSync(join(root, f))) symlinkSync(join(root, f), join(dir, f));
    if (!existsSync(join(dir, 'docs/DECISIONS.md'))) writeFileSync(join(dir, 'docs/DECISIONS.md'), '## (pass ??): a tree with no DECISIONS\n\n## Open items\n');
    const r = spawnSync(process.execPath, [join(dir, 'tests/floor-guard.test.mjs'), '--write', '--first'], { cwd: dir, encoding: 'utf8', maxBuffer: 1 << 26 });
    const file = join(dir, 'tests/fixtures/floor-baseline.json');
    if (!existsSync(file)) return { values: null, error: `the guard wrote no values (exit ${r.status}): ${lastLine(r.stdout)} ${lastLine(r.stderr)}`.trim() };
    return { values: JSON.parse(readFileSync(file, 'utf8')).values, said: lastLine(r.stdout) };
  } finally { unmirror(dir); }
}

// The snapshot made small, in the reading process: each key with a digest of its value, the questions bank by bank (a digest of each
// question's key and of its renderings), and for each item that is a record, its digest without its id (so a renamed id keeps it) and its
// title; for each lesson its title, its course, its lines, its paragraphs and its drawings (every picture with a kind in its lesson).
function digestOf(snap) {
  const keys = {}; const bodies = {}; const titles = {}; const banks = {}; const lessons = {};
  const drawings = (x, out = []) => { if (Array.isArray(x)) x.forEach((y) => drawings(y, out)); else if (x && typeof x === 'object') { if (typeof x.kind === 'string') out.push(JSON.stringify(x)); Object.values(x).forEach((y) => drawings(y, out)); } return out; };
  for (const [k, v] of Object.entries(snap.items)) {
    if (k.startsWith('question:')) { const rest = k.slice(9); const at = rest.indexOf(':'); const bank = rest.slice(0, at); (banks[bank] = banks[bank] || {})[digest(rest.slice(at + 1))] = digest(v); continue; }
    keys[k] = digest(v);
    if (typeof v !== 'string' || !/^[[{]/.test(v)) continue;
    let x = null; try { x = JSON.parse(v); } catch (e) { continue; }
    if (!x || typeof x !== 'object' || Array.isArray(x)) continue;
    if (typeof x.title === 'string') titles[k] = x.title;
    const { id, ...rest } = x; bodies[k] = digest(JSON.stringify(rest));
    if (k.startsWith('logic.MODULES:')) { const lesson = x.lesson || {}; const pics = drawings(lesson);
      lessons[k.slice('logic.MODULES:'.length)] = { title: x.title || '', course: x.courseId || '', script: (lesson.script || []).length, paragraphs: (lesson.paragraphs || []).length, drawings: pics.length, lesson: digest(JSON.stringify(lesson)), pictures: digest(pics.sort().join('\n')) }; }
  }
  for (const k of Object.keys(keys)) if (!(k in bodies)) bodies[k] = keys[k];
  return { keys, bodies, titles, banks, lessons };
}

// One tree's counts and content, read in a process of its own (each tree's code is about seven megabytes, and two in one process would
// hold both): record-counts' counts, by this tree's tools/record-counts.mjs set beside the tree's own code in a temporary folder (by the
// tree's own tool if this one cannot read it, which is said), and the digest of tools/content-snapshot.mjs's snapshot of the tree.
async function sideFacts(root) {
  const out = { counts: null, countsBy: '', countsError: '', content: null, contentError: '' };
  const dir = mkdtempSync(join(tmpdir(), 'ripple-counts-'));
  try {
    mkdirSync(join(dir, 'tools')); copyFileSync(join(HERE, 'tools/record-counts.mjs'), join(dir, 'tools/record-counts.mjs'));
    symlinkSync(join(root, 'src'), join(dir, 'src'));
    try { out.counts = await (await import(pathToFileURL(join(dir, 'tools/record-counts.mjs')).href)).recordCounts(); out.countsBy = "this tree's tools/record-counts.mjs"; } catch (e) {
      out.countsError = e.message;
      if (existsSync(join(root, 'tools/record-counts.mjs'))) {
        try { out.counts = await (await import(pathToFileURL(join(root, 'tools/record-counts.mjs')).href)).recordCounts(); out.countsBy = "its own tools/record-counts.mjs, since this tree's could not read it (" + cut(e.message, 120) + ')'; out.countsError = ''; } catch (e2) { out.countsError += '; its own tool: ' + e2.message; }
      }
    }
  } finally { unmirror(dir); }
  try { const { snapshot } = await import(pathToFileURL(join(HERE, 'tools/content-snapshot.mjs')).href); out.content = digestOf(await snapshot(root)); } catch (e) { out.contentError = e.message; }
  return out;
}
// The reading process, started from this file with --side, and what it wrote.
function sideRead(root) {
  const dir = mkdtempSync(join(tmpdir(), 'ripple-side-')); const file = join(dir, 'side.json');
  try {
    const r = spawnSync(process.execPath, [join(HERE, SELF), '--side', root, '--to', file], { cwd: dir, encoding: 'utf8', maxBuffer: 1 << 26 });
    if (!existsSync(file)) { const why = `the reading process wrote nothing (exit ${r.status}): ${cut(String(r.stderr || '').trim().split('\n').slice(-3).join(' '), 300)}`; return { counts: null, countsError: why, content: null, contentError: why }; }
    return JSON.parse(readFileSync(file, 'utf8'));
  } finally { unmirror(dir); }
}

// A quick test run in a tree as check.sh runs it (node, from the tree's top folder), its PASS and NOTE lines and its summary kept.
function quickRun(root, rel) {
  if (!existsSync(join(root, rel))) return { missing: true, lines: [], summary: '', status: null };
  const r = spawnSync(process.execPath, [join(root, rel)], { cwd: root, encoding: 'utf8', maxBuffer: 1 << 28 });
  const all = String(r.stdout || '').split('\n');
  return { missing: false, status: r.status, lines: all.filter((l) => /^(?:PASS|NOTE) - /.test(l)), fails: all.filter((l) => /^FAIL - /.test(l)).length,
    summary: (all.filter((l) => /^\d+ passed, \d+ failed\s*$/.test(l)).pop() || '').trim(), error: r.error ? r.error.message : '' };
}
// Two runs' lines compared: a line is paired with the other run's line of the same words, every number masked, in their order; a pair
// whose numbers differ moved, and a line only one run printed is new or gone.
function quickDiff(a, b) {
  const group = (lines) => { const g = new Map(); for (const l of lines) { const t = masked(l); if (!g.has(t)) g.set(t, []); g.get(t).push(l); } return g; };
  const A = group(a.lines); const B = group(b.lines); const moved = []; const gone = []; const fresh = [];
  for (const [t, xs] of A) { const ys = B.get(t) || []; xs.forEach((x, i) => { if (i >= ys.length) gone.push(x); else if (x !== ys[i]) moved.push([x, ys[i]]); }); }
  for (const [t, ys] of B) { const xs = A.get(t) || []; for (const y of ys.slice(xs.length)) fresh.push(y); }
  return { moved, gone, fresh };
}

// HANDOFF's check.sh line, the line holding the most "check.sh (pass XX):" segments, cut into its segments, the newest by its pass's
// name (two capitals, which sort in the order the passes ran), each segment's items ("stories 6,975", "3,320 rule tests") by their words.
function checkLineOf(text) {
  const lines = String(text || '').split('\n'); let best = -1; let most = 0;
  lines.forEach((l, i) => { const n = (l.match(/check\.sh \(pass [A-Z]{2}\):/g) || []).length; if (n > most) { most = n; best = i; } });
  if (best < 0) return null;
  const line = lines[best]; const marks = [...line.matchAll(/check\.sh \(pass ([A-Z]{2})\):/g)];
  const segments = marks.map((m, k) => ({ pass: m[1], text: line.slice(m.index, k + 1 < marks.length ? marks[k + 1].index : line.length).trim() }));
  const newest = segments.slice().sort((x, y) => (x.pass < y.pass ? 1 : x.pass > y.pass ? -1 : 0))[0];
  return { n: best + 1, segments, newest };
}
function segmentItems(seg) {
  const out = new Map(); const body = seg.text.replace(/^check\.sh \(pass [A-Z]{2}\):\s*/, '');
  for (const part of body.split(/,\s+(?:and\s+)?|;\s+|\.\s+/)) { const nums = numbersIn(part); if (!nums.length) continue; const label = part.replace(NUMBER, ' ').replace(/\s+/g, ' ').trim(); if (!out.has(label)) out.set(label, nums.join(' ')); }
  return out;
}
// The last lesson pass, read from the base's HANDOFF check.sh line: the newest pass whose stories count rose over the segment before it,
// since a pass that adds lessons adds their stories' checks (pass NR's 6,975 rose from pass NQ's 6,939; pass NQ, the tools pass, did not).
function lessonPassOf(text) {
  const cl = checkLineOf(text); if (!cl) return null;
  const segs = cl.segments.slice().sort((x, y) => (x.pass < y.pass ? 1 : x.pass > y.pass ? -1 : 0));
  const storiesOf = (s) => { const m = /\bstories\s+([\d,]+)|([\d,]+)\s+story checks/.exec(s.text); return m ? valueOf(m[1] || m[2]) : null; };
  for (let k = 0; k + 1 < segs.length; k++) { const a = storiesOf(segs[k]); const b = storiesOf(segs[k + 1]); if (a !== null && b !== null && a > b) return { pass: segs[k].pass, why: `the stories test's count rose from ${b.toLocaleString('en-US')} in pass ${segs[k + 1].pass} to ${a.toLocaleString('en-US')} in pass ${segs[k].pass}, by the base's HANDOFF check.sh line` }; }
  return null;
}
// The passes a DECISIONS file's entries name, in their order.
const passesOf = (text) => [...String(text || '').matchAll(/^## [^\n]*?\(pass ([A-Z]{2})\)/gm)].map((m) => m[1]);

// A script's names and flags: its exported names (in src every top-level name too), each with a digest of its declaration with the name
// taken out, so a name changed on the same code reads as renamed; and every flag (--word) its strings hold. In a shell script, its
// functions and the flags of its lines outside comments.
function namesOf(rel, text) {
  const names = new Map(); const flags = new Set(); const FLAG = /(?<![\w-])--[a-z][a-z0-9-]*/g;
  if (/\.sh$/.test(rel)) {
    for (const l of String(text).split('\n')) { if (/^\s*#/.test(l)) continue; const f = /^\s*([A-Za-z_]\w*)\s*\(\)\s*\{/.exec(l); if (f) names.set(f[1], { exported: false, shape: digest(l.replace(f[1], '\u0000')) }); for (const m of l.matchAll(FLAG)) flags.add(m[0]); }
    return { names, flags };
  }
  const T = parser(); const sf = parse(rel, text); const everyName = rel.startsWith('src/');
  const keep = (name, node, exported) => { if (exported || everyName) names.set(name, { exported, shape: digest(node.getText(sf).replace(name, '\u0000')) }); };
  for (const st of sf.statements) {
    const exported = !!(st.modifiers && st.modifiers.some((m) => m.kind === T.SyntaxKind.ExportKeyword));
    if ((T.isFunctionDeclaration(st) || T.isClassDeclaration(st)) && st.name) keep(st.name.text, st, exported);
    else if (T.isVariableStatement(st)) { for (const d of st.declarationList.declarations) if (T.isIdentifier(d.name)) keep(d.name.text, d, exported); }
    else if (T.isExportDeclaration(st) && st.exportClause && T.isNamedExports(st.exportClause)) for (const el of st.exportClause.elements) names.set(el.name.text, { exported: true, shape: digest(el.getText(sf).replace(el.name.text, '\u0000')) });
  }
  const visit = (node) => { if (T.isStringLiteral(node) || T.isNoSubstitutionTemplateLiteral(node) || T.isTemplateHead(node) || T.isTemplateMiddle(node) || T.isTemplateTail(node)) for (const m of String(node.text).matchAll(FLAG)) flags.add(m[0]); T.forEachChild(node, visit); };
  visit(sf);
  return { names, flags };
}

// One script's checks and named values, for section 2: every comparison with a number at the top level of an ok( condition (never inside a
// function written in the condition, a per-item test, nor under a !, as the guard reads its own), each with its check's label and line;
// and every named value in capitals with the comment above it and, for a value inside a table, the line that holds its key.
const scripts = new Map();
function scriptOf(rel, text) {
  const T = parser(); const sf = parse(rel, text); const K = T.SyntaxKind; const comparisons = []; const notes = new Map(); const full = sf.getFullText();
  const OPS = { [K.EqualsEqualsEqualsToken]: '===', [K.GreaterThanEqualsToken]: '>=', [K.GreaterThanToken]: '>', [K.LessThanToken]: '<', [K.LessThanEqualsToken]: '<=' };
  const FLIP = { '>=': '<=', '>': '<', '<': '>', '<=': '>=', '===': '===' };
  const lineOf = (node) => sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1;
  const sourceLines = full.split('\n');
  const visit = (node) => {
    if (T.isCallExpression(node) && T.isIdentifier(node.expression) && node.expression.text === 'ok' && node.arguments.length >= 2) {
      const label = node.arguments[0].getText(sf).replace(/^[`'"]|[`'"]$/g, '');
      const scan = (n) => {
        if (T.isArrowFunction(n) || T.isFunctionExpression(n) || (T.isPrefixUnaryExpression(n) && n.operator === K.ExclamationToken)) return;
        if (T.isBinaryExpression(n) && OPS[n.operatorToken.kind]) { const right = T.isNumericLiteral(n.right); const left = T.isNumericLiteral(n.left);
          if (right !== left) { const num = right ? n.right : n.left; const other = right ? n.left : n.right; const op = right ? OPS[n.operatorToken.kind] : FLIP[OPS[n.operatorToken.kind]];
            comparisons.push({ rel, name: other.getText(sf).replace(/\s+/g, ''), op, value: Number(num.text.replace(/_/g, '')), label, line: lineOf(n) }); } }
        T.forEachChild(n, scan);
      };
      scan(node.arguments[1]);
    }
    if (T.isVariableDeclaration(node) && T.isIdentifier(node.name) && /^[A-Z][A-Z0-9_]*$/.test(node.name.text) && !notes.has(node.name.text)) {
      const st = node.parent && node.parent.parent ? node.parent.parent : node;
      const ranges = (T.getLeadingCommentRanges(full, st.getFullStart()) || []).slice(-3);
      const comment = ranges.map((r) => full.slice(r.pos, r.end).replace(/^\/\/\s?/gm, '').replace(/^\/\*+|\*+\/$/g, '')).join(' ');
      const props = new Map();
      const walkProps = (obj, path) => { if (!obj || !T.isObjectLiteralExpression(obj)) return; for (const p of obj.properties) { if (!T.isPropertyAssignment(p)) continue;
        const key = T.isIdentifier(p.name) || T.isStringLiteral(p.name) || T.isNumericLiteral(p.name) ? p.name.text : p.name.getText(sf); const here = path ? path + '.' + key : key;
        props.set(here, cut(sourceLines[lineOf(p) - 1] || '', 200)); walkProps(p.initializer, here); } };
      walkProps(node.initializer, '');
      notes.set(node.name.text, { comment: cut(comment, 400), props, line: lineOf(node) });
    }
    T.forEachChild(node, visit);
  };
  visit(sf);
  return { comparisons, notes };
}
const scriptAt = (root, rel) => { const key = root + '\u0000' + rel; if (!scripts.has(key)) scripts.set(key, existsSync(join(root, rel)) ? scriptOf(rel, readFileSync(join(root, rel), 'utf8')) : { comparisons: [], notes: new Map() }); return scripts.get(key); };
// The words of a value, for its kinds: camelCase and capitals with underscores cut into words, all in lower case.
const wordsOf = (...parts) => parts.join(' ').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[_.$]/g, ' ').toLowerCase();
const kindsIn = (words) => Object.keys(KIND_WORDS).filter((k) => KIND_WORDS[k].test(words));

// Two texts' words compared: each change with up to eight words on either side, the words that differ in double brackets.
function wordChanges(a, b, around = 8) {
  const x = String(a).split(/\s+/).filter(Boolean); const y = String(b).split(/\s+/).filter(Boolean);
  let p = 0; while (p < x.length && p < y.length && x[p] === y[p]) p++;
  let s = 0; while (s < x.length - p && s < y.length - p && x[x.length - 1 - s] === y[y.length - 1 - s]) s++;
  const xm = x.slice(p, x.length - s); const ym = y.slice(p, y.length - s); const ops = [];
  for (let i = 0; i < p; i++) ops.push(['=', i, i]);
  if (xm.length * ym.length <= 4e6) {
    const n = xm.length; const m = ym.length; const L = new Int32Array((n + 1) * (m + 1));
    for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i * (m + 1) + j] = xm[i] === ym[j] ? L[(i + 1) * (m + 1) + j + 1] + 1 : Math.max(L[(i + 1) * (m + 1) + j], L[i * (m + 1) + j + 1]);
    let i = 0; let j = 0;
    while (i < n || j < m) { if (i < n && j < m && xm[i] === ym[j]) { ops.push(['=', p + i, p + j]); i++; j++; } else if (j < m && (i >= n || L[i * (m + 1) + j + 1] >= L[(i + 1) * (m + 1) + j])) { ops.push(['+', -1, p + j]); j++; } else { ops.push(['-', p + i, -1]); i++; } }
  } else { for (let i = 0; i < xm.length; i++) ops.push(['-', p + i, -1]); for (let j = 0; j < ym.length; j++) ops.push(['+', -1, p + j]); }
  for (let k = 0; k < s; k++) ops.push(['=', x.length - s + k, y.length - s + k]);
  // A run of only added (or only removed) words slides back while the word before it is the run's last word, so an inserted clause
  // reads as it was written ("[[check.sh (pass AC): ... 5.]] check.sh (pass AB)", not "(pass [[AC): ... (pass]] AB)").
  for (let k = 0; k < ops.length; k++) {
    if (ops[k][0] === '=') continue;
    let e = k; while (e + 1 < ops.length && ops[e + 1][0] !== '=') e++;
    if (new Set(ops.slice(k, e + 1).map((o) => o[0])).size === 1) { const pick = ops[k][0]; const at = pick === '+' ? 2 : 1; const words = pick === '+' ? y : x;
      while (k > 0 && ops[k - 1][0] === '=' && words[ops[k - 1][at]] === words[ops[e][at]]) { const eq = ops[k - 1]; const last = ops[e][at]; const run = [eq[at], ...ops.slice(k, e).map((o) => o[at])];
        ops.splice(k - 1, e - k + 2, ...run.map((i) => (pick === '+' ? ['+', -1, i] : ['-', i, -1])), pick === '+' ? ['=', eq[1], last] : ['=', last, eq[2]]); k--; e--; } }
    k = e;
  }
  // Runs of changed words, joined where fewer than three equal words part them, each shown with its own side's words around it.
  const runs = []; let cur = null; let same = 0;
  ops.forEach((o, k) => { if (o[0] === '=') { same++; return; } if (cur && same < 3) cur.end = k; else { cur = { start: k, end: k }; runs.push(cur); } same = 0; });
  return runs.map((r) => {
    const side = (pick, words) => { const own = (o) => o[0] === '=' || o[0] === pick; const word = (o) => words[pick === '-' ? o[1] : o[2]];
      const mid = ops.slice(r.start, r.end + 1).filter(own).map((o) => (o[0] === '=' ? word(o) : '[[' + word(o) + ']]')).join(' ').replace(/\]\] \[\[/g, ' ');
      const before = ops.slice(0, r.start).filter(own); const after = ops.slice(r.end + 1).filter(own);
      return [(before.length > around ? '... ' : '') + before.slice(-around).map(word).join(' '), mid || '[[]]', after.slice(0, around).map(word).join(' ') + (after.length > around ? ' ...' : '')].filter(Boolean).join(' '); };
    return { old: side('-', x), now: side('+', y) };
  });
}
// How alike two lines are, by the share of their words they hold in common, so a changed line is told from a removed one beside an added one.
const alike = (a, b) => { const A = new Set(String(a).toLowerCase().split(/\W+/).filter(Boolean)); const B = new Set(String(b).toLowerCase().split(/\W+/).filter(Boolean)); if (!A.size || !B.size) return 0; let n = 0; for (const w of A) if (B.has(w)) n++; return n / Math.max(A.size, B.size); };

// One record's lines, base against tree, by the diff program (which tools/content-diff.mjs needs too): each hunk's removed lines paired with
// the most alike added line, so each is removed or changed, with the count of lines added.
function lineChanges(a, b) {
  let text = ''; try { text = execFileSync('diff', ['-U0', a, b], { maxBuffer: 1 << 28, encoding: 'utf8' }); } catch (e) { if (e.status !== 1) throw e; text = String(e.stdout || ''); }
  const out = { removed: [], changed: [], added: [] }; let h = null; const hunks = [];
  for (const l of text.split('\n')) { const m = /^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/.exec(l); if (m) { h = { a: Number(m[1]), b: Number(m[3]), del: [], add: [] }; hunks.push(h); continue; }
    if (!h) continue; if (l.startsWith('-')) h.del.push(l.slice(1)); else if (l.startsWith('+')) h.add.push(l.slice(1)); }
  for (const hk of hunks) { const used = new Set();
    hk.del.forEach((d, i) => { let best = -1; let score = 0.5; hk.add.forEach((x, j) => { if (used.has(j)) return; const s = alike(d, x); if (s >= score) { score = s; best = j; } });
      if (best >= 0) { used.add(best); out.changed.push({ was: hk.a + i, now: hk.b + best, old: d, line: hk.add[best] }); } else out.removed.push({ was: hk.a + i, old: d }); });
    hk.add.forEach((x, j) => { if (!used.has(j)) out.added.push({ now: hk.b + j, line: x }); }); }
  return out;
}

// docs/RULES-AUDIT.md section 11, question by question: each "- QN." line with its status (answered, withdrawn or open) and its line.
function questionsOf(text) {
  const lines = String(text || '').split('\n'); const out = new Map(); const start = lines.findIndex((l) => /^## 11\./.test(l)); if (start < 0) return out;
  for (let i = start + 1; i < lines.length && !/^## /.test(lines[i]); i++) { const m = /^- Q(\d+)\.\s+(.*)$/.exec(lines[i]); if (m) out.set(Number(m[1]), { n: i + 1, text: m[2], status: /^Answered\b/.test(m[2]) ? 'answered' : /^Withdrawn\b/.test(m[2]) ? 'withdrawn' : 'open' }); }
  return out;
}
// A record's table rows, read by tools/pass-packet.mjs's linesOf and named by its titleOf, keyed by title (RULES-AUDIT) or by id (EARMARKS);
// a title that two rows share is told apart by its count.
function rowsOf(key, text) {
  const out = new Map(); const all = linesOf(key, String(text || '')).filter((l) => l.kind === 'row' && l.line.startsWith('| '));
  for (const l of all) { const ea = /^\| ([AELP]\d+) \|/.exec(l.line); let k = key === 'EA' ? (ea ? ea[1] : null) : titleOf(l.line, 100000); if (!k) continue; let c = 2; while (out.has(k)) k = k.replace(/ \(\d+\)$/, '') + ' (' + c++ + ')'; out.set(k, { n: l.n, line: l.line, section: l.section, title: titleOf(l.line, 90) }); }
  return { rows: out, all };
}
// The rows on either side of a row, by their lines and titles (L28's item 6): the reader reads them with it.
const besideRow = (all, n) => { const k = all.findIndex((l) => l.n === n); const name = (l) => (l ? `line ${l.n} ${quoted(titleOf(l.line, 90))}` : 'none'); return k < 0 ? '' : `the rows on either side: ${name(all[k - 1])}; ${name(all[k + 1])}`; };
const besideLine = (lines, n) => { const near = (d) => { for (let i = n - 1 + d; i >= 0 && i < lines.length; i += d) if (lines[i].trim()) return `line ${i + 1} ${quoted(titleOf(lines[i], 90))}`; return 'none'; }; return `the lines on either side: ${near(-1)}; ${near(1)}`; };

// The records the ripple read searches, as the tree holds them, HANDOFF's check.sh line cut to its newest segment (L28's item 5: a search
// for an old count drowns in the line's older segments, 81 hits for 91 in pass NR).
function searchedTexts(root) {
  return SEARCHED.filter((f) => existsSync(join(root, f))).map((f) => { const lines = readFileSync(join(root, f), 'utf8').split('\n');
    if (f === 'docs/HANDOFF.md') { const cl = checkLineOf(lines.join('\n')); if (cl) lines[cl.n - 1] = cl.newest.text; }
    return { file: f, lines }; });
}
// The sentence around a place in a line, and every line a pattern finds: its file, its number, its row's title, its hits and the
// first hit's sentence.
function sentenceAt(line, at, len = 0) { let a = line.lastIndexOf('. ', at); a = a < 0 || at - a > 240 ? Math.max(0, at - 180) : a + 2; let b = line.indexOf('. ', at + len); b = b < 0 || b - at > 240 ? Math.min(line.length, at + len + 180) : b + 1; return (a > 0 ? '... ' : '') + line.slice(a, b).trim() + (b < line.length ? ' ...' : ''); }
function hitsOf(texts, re) { const out = []; for (const { file, lines } of texts) lines.forEach((l, i) => { const ms = [...l.matchAll(re)]; if (ms.length) out.push({ file, n: i + 1, title: titleOf(l, 90), times: ms.length, text: sentenceAt(l, ms[0].index, ms[0][0].length) }); }); return out; }
const hitLine = (h) => `  - ${h.file} line ${h.n} ${quoted(h.title, 90)}${h.times > 1 ? ' (' + h.times + ' hits)' : ''}: ${quoted(h.text, 420)}`;

// The whole manifest: both trees read, each part compared, and the markdown written. It returns the text, what could not be read, and
// the number of entries in each section.
export async function manifest({ base, tree, quick = QUICK_TESTS, lessonPass = null }) {
  const unread = []; const say = (s) => unread.push(s); const started = Date.now();
  const baseFiles = filesOf(base); const treeFiles = filesOf(tree);
  const text = (root, rel) => (existsSync(join(root, rel)) ? readFileSync(join(root, rel), 'utf8') : '');
  // The readings: the guard's of each tree, each tree's counts and content, and the quick tests in each.
  const gBase = guardRead(base); const gTree = guardRead(tree);
  if (gBase.error) say(`the floor guard's reading of the base: ${gBase.error}`); if (gTree.error) say(`the floor guard's reading of the tree: ${gTree.error}`);
  const sBase = sideRead(base); const sTree = sideRead(tree);
  for (const [who, s] of [['base', sBase], ['tree', sTree]]) { if (s.countsError) say(`record-counts on the ${who}: ${s.countsError}`); if (s.contentError) say(`tools/content-snapshot.mjs on the ${who}: ${s.contentError}`); }
  const runs = quick.map((rel) => ({ rel, a: quickRun(base, rel), b: quickRun(tree, rel) }));
  for (const q of runs) for (const [who, r] of [['base', q.a], ['tree', q.b]]) if (!r.missing && (r.error || !r.summary)) say(`${q.rel} in the ${who} printed no summary line${r.error ? ' (' + r.error + ')' : ''}, so its lines may be cut short`);
  const counted = {};
  // Every moved count, old and new, with the words a record uses for it (its stems), for section 2's equal numbers and section 5's
  // searches; a limit in seconds is searched for in the records and never matched against a test's counts.
  const movedValues = [];
  // The quick tests' lines compared first, since their moved counts are among the moved values: each number of a moved line that
  // differs, by its place in the line, with the word after it as its noun.
  for (const q of runs) { q.d = quickDiff(q.a, q.b);
    for (const [x, y] of q.d.moved) { const xs = numbersIn(x); const ys = numbersIn(y); xs.forEach((n, i) => { if (ys[i] === undefined || n === ys[i]) return; const word = (new RegExp(escapeRe(n) + '\\s+([A-Za-z][A-Za-z-]*)').exec(x) || [])[1];
      movedValues.push({ label: `${quoted(x.slice(7), 90)} (${q.rel})`, old: valueOf(n), now: valueOf(ys[i]), stems: stemOf(word) }); }); } }

  // Section 1: the guard's values and record-counts' counts and markers.
  const sec1 = [];
  const guardWhere = (e) => (e.file === 'check.sh' ? `check.sh's run "${e.name}"` : e.file === 'docs/CHECK-TIMES.md' ? `the step ${e.name}'s count of checks (docs/CHECK-TIMES.md's newest passing run)` : e.kind === 'pinned' ? `${e.name} (${e.op}) in ${e.file}` : `${e.name} in ${e.file}`);
  const way = (e, was, now) => { const loose = e.lenient === 'lower' ? now < was : e.lenient === 'higher' ? now > was : e.lenient === 'zero' ? now !== 0 : false; return `${now < was ? 'lowered' : 'raised'}, the ${loose ? 'lenient' : 'strict'} way as the guard reads it`; };
  let guardMoved = []; let guardFresh = []; let guardGone = [];
  if (gBase.values && gTree.values) {
    const A = new Map(gBase.values.map((e) => [e.key, e])); const B = new Map(gTree.values.map((e) => [e.key, e]));
    for (const [k, a] of A) { const b = B.get(k); if (!b) guardGone.push(a); else if ((a.kind === 'number' && a.value !== b.value) || (a.kind === 'pinned' && a.values.join() !== b.values.join())) guardMoved.push([a, b]); }
    for (const [k, b] of B) if (!A.has(k)) guardFresh.push(b);
    sec1.push(`The guard read ${plural(gBase.values.length, 'value')} in the base and ${plural(gTree.values.length, 'value')} in the tree (its own reading, in a copy of each: ${quoted(gTree.said, 200)}). Its own run against its baseline, and the newest DECISIONS entry's Loosened bullet, give the verdict on each lenient move; this list gives every move.`, '');
    sec1.push(`Moved (${guardMoved.length}):`);
    for (const [a, b] of guardMoved) {
      if (a.kind === 'number') { sec1.push(`- ${guardWhere(b)}: ${a.value} to ${b.value}${a.file === 'check.sh' ? ' seconds' : ''}, ${way(a, a.value, b.value)}`); counted[1] = (counted[1] || 0) + 1; movedValues.push({ label: `${b.name} in ${b.file}`, old: a.value, now: b.value, stems: stemOf(lastWord(b.name)), seconds: a.file === 'check.sh' }); }
      else { sec1.push(`- ${guardWhere(b)}: ${a.values.join(', ')} to ${b.values.join(', ')}`); counted[1] = (counted[1] || 0) + 1; a.values.forEach((v, i) => { if (b.values[i] !== undefined && b.values[i] !== v) movedValues.push({ label: `${b.name} (${b.op}) in ${b.file}`, old: v, now: b.values[i], stems: stemOf(lastWord(b.name)) }); }); }
    }
    const member = (e, how) => `- ${e.name} in ${e.file} ${how} ${quoted(e.member, 160)}`;
    const freshShown = guardFresh.map((e) => (e.kind === 'member' ? member(e, e.lenient === 'removed' ? 'gains the case' : 'gains') : `- ${guardWhere(e)}: ${e.kind === 'pinned' ? e.values.join(', ') : e.kind === 'list' ? 'a new list' : e.value}, new in the tree`));
    const goneShown = guardGone.map((e) => (e.kind === 'member' ? member(e, e.lenient === 'removed' ? 'loses the case' : 'loses') : `- ${guardWhere(e)}: ${e.kind === 'pinned' ? e.values.join(', ') : e.kind === 'list' ? 'the list' : e.value}, gone from the tree`));
    if (!guardMoved.length) sec1.push('None.');
    sec1.push('', `New in the tree (${freshShown.length}):`, ...(freshShown.length ? freshShown : ['None.']), '', `Gone from the tree (${goneShown.length}):`, ...(goneShown.length ? goneShown : ['None.']));
    counted[1] = (counted[1] || 0) + freshShown.length + goneShown.length;
  } else sec1.push('The guard\'s values were not read (named under "Not read" above).');
  sec1.push('', '### tools/record-counts.mjs: its counts, from each tree\'s code, and the markers that hold them in the records', '');
  if (sBase.counts && sTree.counts) {
    sec1.push(`Read on the tree by ${sTree.countsBy}, and on the base by ${sBase.countsBy}.`);
    const keys = [...new Set([...Object.keys(sBase.counts), ...Object.keys(sTree.counts)])]; const still = [];
    for (const k of keys) { const a = sBase.counts[k]; const b = sTree.counts[k]; if (a === b) { still.push(`${k} ${a}`); continue; } sec1.push(`- ${k}: ${a === undefined ? 'not a count in the base' : a} to ${b === undefined ? 'not a count in the tree' : b}`); counted[1] = (counted[1] || 0) + 1;
      if (typeof a === 'number' && typeof b === 'number') movedValues.push({ label: `record-counts' ${k}`, old: a, now: b, stems: STEMS[k] || stemOf(k) }); }
    sec1.push(`Unmoved: ${still.join(', ') || 'none'}.`);
  } else sec1.push('The counts were not read (named under "Not read" above).');
  const marksOf = (root) => { const m = []; for (const f of RECORD_DOCS) text(root, f).split('\n').forEach((l, i) => { for (const x of l.matchAll(COUNT_MARK)) m.push({ file: f, n: i + 1, key: x[1], value: x[2] }); }); return m; };
  const mA = marksOf(base); const mB = marksOf(tree); const nth = (list) => { const seen = new Map(); return list.map((x) => { const k = x.file + ' ' + x.key; const i = seen.get(k) || 0; seen.set(k, i + 1); return { ...x, id: k + ' ' + i }; }); };
  const MA = new Map(nth(mA).map((x) => [x.id, x])); const MB = new Map(nth(mB).map((x) => [x.id, x])); const markLines = [];
  for (const [id, b] of MB) { const a = MA.get(id); if (!a) markLines.push(`- n:${b.key} in ${b.file} line ${b.n}: ${b.value}, a marker new in the tree`); else if (a.value !== b.value) markLines.push(`- n:${b.key} in ${b.file} line ${b.n}: ${a.value} to ${b.value}`); }
  for (const [id, a] of MA) if (!MB.has(id)) markLines.push(`- n:${a.key} in ${a.file} (base line ${a.n}): ${a.value}, a marker gone from the tree`);
  sec1.push('', `Markers in ${RECORD_DOCS.join(', ')} whose number moved, or that are new or gone (${markLines.length} of ${mB.length} in the tree):`, ...(markLines.length ? markLines : ['None.']));
  counted[1] = (counted[1] || 0) + markLines.length;

  // Section 2: what the pass moved, kind by kind, and every floor, ceiling and pinned count whose words name a kind it moved.
  const sec2 = []; const A = sBase.content; const B = sTree.content; let moved = new Set(Object.keys(KIND_WORDS)); let changes = null;
  const famOf = (k) => { const i = k.indexOf(':'); return i < 0 ? k : k.slice(0, i); };
  if (A && B) {
    // Item changes, family by family (logic.MODULES, stories.STORIES, art, audio, ...); a key gone and one added in the same family whose
    // item is the same without its id, or whose title is the same, is a renamed id; and the banks by their questions.
    const fams = new Map(); const fam = (f) => { if (!fams.has(f)) fams.set(f, { added: [], removed: [], changed: [], renamed: [], titled: [] }); return fams.get(f); };
    for (const k of Object.keys(A.keys)) { if (!(k in B.keys)) fam(famOf(k)).removed.push(k); else if (A.keys[k] !== B.keys[k]) { fam(famOf(k)).changed.push(k); if (A.titles[k] !== undefined && B.titles[k] !== undefined && A.titles[k] !== B.titles[k]) fam(famOf(k)).titled.push([k, A.titles[k], B.titles[k]]); } }
    for (const k of Object.keys(B.keys)) if (!(k in A.keys)) fam(famOf(k)).added.push(k);
    for (const f of fams.values()) for (const k of f.removed.slice()) { let j = f.added.findIndex((x) => B.bodies[x] === A.bodies[k]); let how = 'the same item'; if (j < 0 && A.titles[k]) { j = f.added.findIndex((x) => B.titles[x] === A.titles[k]); how = 'the same title, its item changed'; }
      if (j >= 0) { f.renamed.push([k, f.added[j], how]); f.added.splice(j, 1); f.removed.splice(f.removed.indexOf(k), 1); } }
    const banks = { added: Object.keys(B.banks).filter((g) => !(g in A.banks)), removed: Object.keys(A.banks).filter((g) => !(g in B.banks)), renamed: [], changed: [] };
    const bankDigest = (q) => digest(Object.entries(q).sort().map(([x, y]) => x + y).join(','));
    for (const g of banks.removed.slice()) { const d = bankDigest(A.banks[g]); const j = banks.added.findIndex((x) => bankDigest(B.banks[x]) === d); if (j >= 0) { banks.renamed.push([g, banks.added[j]]); banks.added.splice(j, 1); banks.removed.splice(banks.removed.indexOf(g), 1); } }
    for (const g of Object.keys(A.banks)) if (g in B.banks) { const a = A.banks[g]; const b = B.banks[g]; let plus = 0; let minus = 0; let changed = 0; for (const q of Object.keys(a)) { if (!(q in b)) minus++; else if (a[q] !== b[q]) changed++; } for (const q of Object.keys(b)) if (!(q in a)) plus++;
      if (plus || minus || changed) banks.changed.push({ g, plus, minus, changed, was: Object.keys(a).length, now: Object.keys(b).length }); }
    changes = { fams, banks };
    // The counts of each kind in both trees, and which kinds moved.
    const kindCounts = (D) => { const n = (prefix) => Object.keys(D.keys).filter((k) => k.startsWith(prefix)).length; const ls = Object.values(D.lessons); const sum = (f) => ls.reduce((s, x) => s + x[f], 0);
      return { lessons: ls.length, 'lesson lines': sum('script'), paragraphs: sum('paragraphs'), drawings: sum('drawings'), banks: Object.keys(D.banks).length, questions: Object.values(D.banks).reduce((s, q) => s + Object.keys(q).length, 0),
        stories: n('stories.STORIES:') + n('stories.COURSE_STORIES:') + n('stories.MASTERY_STORIES:'), 'coloring pages': n('stories.COLOR_PAGES:'), Wonder: n('logic.WONDER:'), games: n('logic.GAMES:'), courses: n('logic.COURSES:'), 'art rows': n('art:'), 'audio rows': n('audio:') }; };
    // Which kinds moved, each with every reason it moved, so the manifest says why and each rule is seen.
    const cA = kindCounts(A); const cB = kindCounts(B); const why = new Map(); const mark = (kind, reason) => { if (!why.has(kind)) why.set(kind, new Set()); why.get(kind).add(reason); };
    const famMoved = (f) => { const x = fams.get(f); return !!x && x.added.length + x.removed.length + x.changed.length + x.renamed.length > 0; };
    if (famMoved('logic.MODULES')) mark('lessons', 'lessons added, removed or changed');
    for (const id of new Set([...Object.keys(A.lessons), ...Object.keys(B.lessons)])) { const a = A.lessons[id]; const b = B.lessons[id];
      if (!a || !b) { const x = a || b; if (x.script + x.paragraphs) mark('lesson lines', 'a lesson with lines added or removed'); if (x.drawings) mark('drawings', 'a lesson with pictures added or removed'); continue; }
      if (a.lesson !== b.lesson) mark('lesson lines', "a lesson's lines changed"); if (a.pictures !== b.pictures) mark('drawings', "a lesson's pictures changed"); }
    if (fams.has('code') && fams.get('code').changed.includes('code:src/ui.jsx')) mark('drawings', 'src/ui.jsx changed');
    if (famMoved('stories.COLOR_PAGES')) mark('coloring pages', 'coloring pages changed');
    if (banks.added.length + banks.removed.length + banks.renamed.length) mark('banks', 'banks added, removed or renamed');
    if (banks.changed.length) mark('questions', "a bank's questions changed"); if (banks.added.length + banks.removed.length) mark('questions', 'banks added or removed');
    if (['stories.STORIES', 'stories.COURSE_STORIES', 'stories.MASTERY_STORIES'].some(famMoved)) mark('stories', 'stories changed');
    if (famMoved('logic.WONDER')) mark('Wonder', 'Wonder questions changed');
    if (['logic.GAMES', 'logic.COURSE_GAMES', 'logic.DEMO_ROUNDS'].some(famMoved)) mark('games', 'games, decks or welcome rounds changed');
    if (famMoved('logic.COURSES')) mark('courses', 'courses changed');
    if (famMoved('art')) mark('art rows', 'art ledger rows changed'); if (famMoved('audio')) mark('audio rows', 'audio ledger rows changed');
    if (['lessons', 'lesson lines', 'drawings', 'questions'].some((k) => why.has(k))) mark('screens', 'read with the lessons, their lines, their drawings and the questions');
    moved = new Set(why.keys());
    const kindLine = (k) => `${k} ${cA[k] === cB[k] ? cB[k].toLocaleString('en-US') + ', its items changed' : cA[k].toLocaleString('en-US') + ' to ' + cB[k].toLocaleString('en-US')} (${[...why.get(k)].join('; ')})`;
    sec2.push(`What the pass moved, kind by kind, each with why (tools/content-snapshot.mjs on both trees; a lesson's lines are its spoken script's lines and its paragraphs are counted apart, its drawings every picture with a kind in its lesson): ${[...moved].filter((k) => k in cA).map(kindLine).join('; ') || 'nothing'}${moved.has('screens') ? '; and the screens a walk visits, ' + [...why.get('screens')].join('; ') : ''}. Unmoved: ${Object.keys(cA).filter((k) => !moved.has(k) && cA[k] === cB[k]).map((k) => k + ' ' + cB[k].toLocaleString('en-US')).join(', ')}.`, '');
    for (const k of Object.keys(cA)) if (cA[k] !== cB[k]) movedValues.push({ label: `the ${k} (tools/content-snapshot.mjs)`, old: cA[k], now: cB[k], stems: STEMS[k] || stemOf(k) });
  } else sec2.push('What the pass moved could not be read (named under "Not read" above), so every kind is read as moved.', '');
  // The values: the guard's floors, limits and pinned counts in tests and tools, with this tool's own reading of the ceilings and of the
  // floors and pinned counts of 10 or more the guard does not read; each with its words, its kinds, and its value in both trees.
  const isScript = (rel) => /^(?:tests|tools)\/.*\.(?:mjs|js)$/.test(rel) && rel !== SELF && !SKIPPED.test(rel);
  // The guard's values and this tool's are kept in two lists and joined the guard's first, so each file lists the values L28 found stale first.
  const guardItems = []; const ownItems = []; const gBaseKeys = new Map((gBase.values || []).map((e) => [e.key, e]));
  for (const e of gTree.values || []) {
    if (!isScript(e.file)) continue;
    const s = scriptAt(tree, e.file);
    if (e.kind === 'number' && (e.family === 'floor' || e.family === 'limit')) {
      const head = String(e.name).split('.')[0]; const note = s.notes.get(head) || { comment: '', props: new Map() }; const path = String(e.name).split('.').slice(1).join('.'); const prop = path ? note.props.get(path) || '' : '';
      const was = gBaseKeys.has(e.key) ? gBaseKeys.get(e.key).value : null;
      guardItems.push({ by: 'the guard', what: e.family === 'floor' ? 'a floor' : 'a limit, a ceiling', file: e.file, name: e.name, was: was === null ? 'not in the base' : String(was), now: String(e.value), words: wordsOf(e.name, note.comment, prop), says: [note.comment && quoted(note.comment, 220), prop && 'its line: ' + quoted(prop, 120)].filter(Boolean).join('; '), numbers: [e.value] });
    } else if (e.kind === 'pinned') {
      const labels = [...new Set(s.comparisons.filter((c) => c.name === String(e.name).replace(/\s+/g, '') && (e.op === '===' ? c.op === '===' : (c.op === '>=' && e.values.includes(c.value)) || (c.op === '>' && e.values.includes(c.value + 1)))).map((c) => c.label))];
      const was = gBaseKeys.has(e.key) ? gBaseKeys.get(e.key).values.join(', ') : 'not in the base';
      guardItems.push({ by: 'the guard', what: e.op === '===' ? 'a pinned count (===)' : 'a pinned floor (at least)', file: e.file, name: `${e.name} (${e.op})`, was, now: e.values.join(', '), words: wordsOf(e.name, ...labels), says: labels.length ? 'its check: ' + labels.map((l) => quoted(l, 160)).join(' | ') : '', numbers: e.values, one: e.op === '>=' && e.values.every((v) => v === 1) });
    }
  }
  // The guard's own pins, and the files it reads them in (the browser tests, which run only in check.sh): a pinned === count outside them
  // fails its own test the moment its count moves, in the quick tests a round runs or the rules test in check.sh, so it is counted, not listed.
  const guardPins = new Set((gTree.values || []).filter((e) => e.kind === 'pinned').flatMap((e) => e.values.map((v) => `${e.file} ${String(e.name).replace(/\s+/g, '')} ${e.op} ${v}`)));
  const pinFiles = new Set((gTree.values || []).filter((e) => e.kind === 'pinned').map((e) => e.file)); let pinsElsewhere = 0;
  for (const rel of [...treeFiles.keys()].filter(isScript)) {
    const s = scriptAt(tree, rel); const changed = !baseFiles.has(rel) || baseFiles.get(rel).digest !== treeFiles.get(rel).digest; const old = changed && baseFiles.has(rel) ? scriptAt(base, rel) : null;
    for (const c of s.comparisons) {
      const ceiling = c.op === '<' || c.op === '<='; const at = c.op === '>' ? c.value + 1 : c.value;
      if (ceiling ? (c.op === '<' ? c.value < 2 : c.value < 1) : at < 10) continue;
      if (!ceiling && guardPins.has(`${rel} ${c.name} ${c.op === '===' ? '===' : '>='} ${at}`)) continue;
      if (c.op === '===' && !pinFiles.has(rel)) { pinsElsewhere++; continue; }
      const was = !baseFiles.has(rel) ? 'not in the base' : !changed ? String(c.value) : ((old && old.comparisons.find((x) => x.name === c.name && x.op === c.op && x.label === c.label)) || { value: 'not found in the base' }).value;
      ownItems.push({ by: 'this tool', what: ceiling ? 'a ceiling' : c.op === '===' ? 'a pinned count (===)' : 'a floor', file: rel, name: `${c.name} ${c.op} ${c.value}, line ${c.line}`, was: String(was), now: String(c.value), words: wordsOf(c.name, c.label), says: 'its check: ' + quoted(c.label, 160), numbers: [c.value] });
    }
  }
  const items = [...guardItems, ...ownItems];
  for (const it of items) it.kinds = kindsIn(it.words);
  const listed = items.filter((it) => it.kinds.some((k) => moved.has(k)));
  const bare = items.filter((it) => !it.kinds.length && it.by === 'the guard');
  sec2.push(`${plural(listed.length, 'value')} in a test or tool name${listed.length === 1 ? 's' : ''} a kind the pass moved, each with its value in the base and in the tree, the kinds its words name, and what it counts in its own words, file by file, the guard's first. The guard reads the floors, the limits and the browser tests' pinned counts; this tool reads the ceilings (< and <=) of every check, and the floors of 10 or more and the browser tests' pinned counts of 10 or more the guard does not read, at the top level of an ok( condition, so a value it reads says "this tool". A floor of one, an existence check (a plant caught, a screen read), is named on one line under its file. ${plural(pinsElsewhere, "pinned === count")} of 10 or more outside the browser tests ${pinsElsewhere === 1 ? 'is' : 'are'} not listed: each fails its own test the moment its count moves. A value whose number still stands where its counted thing moved is the reader's to measure against the code (pass NR's floors stood at pass NP's counts).`);
  const byFile = new Map(); for (const it of listed) { if (!byFile.has(it.file)) byFile.set(it.file, []); byFile.get(it.file).push(it); }
  const files = [...byFile].sort((x, y) => x[0].localeCompare(y[0]));
  if (files.length) sec2.push('', `By file: ${files.map(([f, l]) => f + ' ' + l.length).join(', ')}.`);
  for (const [file, list] of files) {
    sec2.push('', `#### ${file} (${list.length})`);
    const ones = list.filter((it) => it.one); const rest = list.filter((it) => !it.one);
    for (const it of rest) sec2.push(`- ${it.name}, ${it.what} (${it.by}): ${it.was === it.now ? it.now + ', unchanged' : it.was + ' to ' + it.now}; names ${it.kinds.join(', ')}${it.says ? '; ' + it.says : ''}`);
    if (ones.length) sec2.push(`- floors of one, each an existence check (the guard): ${ones.map((it) => it.name.replace(/ \(>=\)$/, '') + (it.was === it.now ? '' : ' (' + it.was + ' to ' + it.now + ')')).join(', ')}`);
    counted[2] = (counted[2] || 0) + list.length;
  }
  if (bare.length) { sec2.push('', `The guard's values whose words name no kind (${bare.length}), each the reader's to read where the pass moved what it may count:`);
    const bareBy = new Map(); for (const it of bare) { if (!bareBy.has(it.file)) bareBy.set(it.file, []); bareBy.get(it.file).push(`${it.name} ${it.now}`); }
    for (const [file, l] of bareBy) sec2.push(`- ${file}: ${l.join('; ')}`); }
  // Every number in a test or tool equal to a moved count's old value, which a test pinned to that count still holds.
  const oldOnes = movedValues.filter((v) => Number.isInteger(v.old) && v.old >= 10 && !v.seconds);
  const equal = []; for (const it of items) for (const v of oldOnes) if (it.numbers.includes(v.old) && !(it.file === String(v.label).split(' in ').pop() && it.name.startsWith(String(v.label).split(' in ')[0]))) equal.push(`- ${it.name} in ${it.file}, ${it.what} (${it.by}), is ${v.old.toLocaleString('en-US')}, the old value of ${v.label}, now ${Number(v.now).toLocaleString('en-US')}`);
  sec2.push('', `### Numbers in a test or tool equal to a moved count's old value (${equal.length})`, '', ...(equal.length ? [...new Set(equal)] : ['None.']));
  counted[2] = (counted[2] || 0) + new Set(equal).size;

  // Section 3: ids, titles, functions, files and flags. The content's heading comes first whether or not it was read, and a pass that
  // moved no content says so, so an empty list is never read as one cut short (the first real run, pass NX, printed the heading alone).
  const sec3 = ['### Content, by tools/content-snapshot.mjs\'s keys (a question bank by the questions it deals; a renamed id is a key gone and one added with the same item, or the same title)', ''];
  const contentFrom = sec3.length;
  if (changes) {
    const idOf = (k) => k.slice(k.indexOf(':') + 1);
    for (const [f, x] of [...changes.fams].filter(([f]) => f !== 'seeds' && f !== 'places').sort((a, b) => a[0].localeCompare(b[0]))) {
      const parts = [];
      if (x.renamed.length) parts.push(`renamed ${x.renamed.map(([a, b, how]) => idOf(a) + ' to ' + idOf(b) + ' (' + how + ')').join(', ')}`);
      if (x.added.length) parts.push(`added ${x.added.map(idOf).join(', ')}`);
      if (x.removed.length) parts.push(`removed ${x.removed.map(idOf).join(', ')}`);
      if (x.changed.length) parts.push(`changed (${x.changed.length}) ${x.changed.map(idOf).join(', ')}`);
      if (!parts.length) continue;
      sec3.push(`- ${f}: ${parts.join('; ')}`); counted[3] = (counted[3] || 0) + x.renamed.length + x.added.length + x.removed.length + x.titled.length;
      for (const [k, a, b] of x.titled) sec3.push(`  - the title of ${k}: ${quoted(a, 160)} to ${quoted(b, 160)}`);
    }
    const bk = changes.banks; const bparts = [];
    if (bk.renamed.length) bparts.push(`renamed ${bk.renamed.map(([a, b]) => a + ' to ' + b + ' (the same questions)').join(', ')}`);
    if (bk.added.length) bparts.push(`added ${bk.added.map((g) => g + ' (' + Object.keys(B.banks[g]).length + ' questions)').join(', ')}`);
    if (bk.removed.length) bparts.push(`removed ${bk.removed.map((g) => g + ' (' + Object.keys(A.banks[g]).length + ' questions)').join(', ')}`);
    if (bparts.length) { sec3.push(`- the banks: ${bparts.join('; ')}`); counted[3] = (counted[3] || 0) + bk.renamed.length + bk.added.length + bk.removed.length; }
    if (bk.changed.length) sec3.push(`- the questions of a bank kept (${bk.changed.length} banks): ${bk.changed.map((c) => c.g + ' ' + c.was + ' to ' + c.now + ' (' + c.plus + ' added, ' + c.minus + ' gone, ' + c.changed + ' changed)').join('; ')}`);
    if (sec3.length === contentFrom) sec3.push('No content id, title or bank added, renamed, removed or changed.');
  } else sec3.push('The content was not read (named under "Not read" above).');
  const added = [...treeFiles.keys()].filter((r) => !baseFiles.has(r)); const removed = [...baseFiles.keys()].filter((r) => !treeFiles.has(r));
  const renamedFiles = []; for (const r of removed.slice()) { const d = baseFiles.get(r).digest; const j = added.findIndex((x) => treeFiles.get(x).digest === d); if (j >= 0) { renamedFiles.push([r, added[j]]); added.splice(j, 1); removed.splice(removed.indexOf(r), 1); } }
  const changedFiles = [...treeFiles.keys()].filter((r) => baseFiles.has(r) && baseFiles.get(r).digest !== treeFiles.get(r).digest);
  sec3.push('', '### Files (index.html, sw.js, dist and the tests\' pictures left out)', '', `- added (${added.length}): ${added.join(', ') || 'none'}`, `- removed (${removed.length}): ${removed.join(', ') || 'none'}`,
    `- renamed (${renamedFiles.length}): ${renamedFiles.map(([a, b]) => a + ' to ' + b + ' (the same bytes)').join(', ') || 'none'}`, `- changed (${changedFiles.length}): ${changedFiles.join(', ') || 'none'}`);
  counted[3] = (counted[3] || 0) + added.length + removed.length + renamedFiles.length;
  sec3.push('', '### Code names and tool flags, script by script (exported names, in src every top-level name, and the flags each script\'s strings hold)', '');
  const isCode = (rel) => /^(?:src|tools|tests)\/.*\.(?:mjs|jsx|js)$|\.sh$/.test(rel);
  const codeRels = [...new Set([...baseFiles.keys(), ...treeFiles.keys()])].filter(isCode).filter((r) => !baseFiles.has(r) || !treeFiles.has(r) || baseFiles.get(r).digest !== treeFiles.get(r).digest).sort();
  let codeLines = 0;
  for (const rel of codeRels) {
    let a = { names: new Map(), flags: new Set() }; let b = { names: new Map(), flags: new Set() };
    if (baseFiles.has(rel)) a = namesOf(rel, readFileSync(join(base, rel), 'utf8')); if (treeFiles.has(rel)) b = namesOf(rel, readFileSync(join(tree, rel), 'utf8'));
    const gone = [...a.names].filter(([n]) => !b.names.has(n)); const fresh = [...b.names].filter(([n]) => !a.names.has(n)); const renamed = [];
    for (const [n, x] of gone.slice()) { const k = fresh.findIndex(([, y]) => y.shape === x.shape); if (k >= 0) { renamed.push([n, fresh[k][0]]); fresh.splice(k, 1); gone.splice(gone.findIndex(([m]) => m === n), 1); } }
    const flagsGone = [...a.flags].filter((f) => !b.flags.has(f)).sort(); const flagsAdded = [...b.flags].filter((f) => !a.flags.has(f)).sort();
    if (!gone.length && !fresh.length && !renamed.length && !flagsGone.length && !flagsAdded.length) continue;
    const state = !baseFiles.has(rel) ? 'new' : !treeFiles.has(rel) ? 'gone' : 'changed'; const parts = [];
    const nm = ([n, x]) => n + (x.exported ? '' : ' (not exported)');
    if (renamed.length) parts.push(`renamed ${renamed.map(([x, y]) => x + ' to ' + y + ' (the same code)').join(', ')}`);
    if (fresh.length) parts.push(`added ${fresh.map(nm).join(', ')}`); if (gone.length) parts.push(`removed ${gone.map(nm).join(', ')}`);
    if (flagsAdded.length) parts.push(`flags added ${flagsAdded.join(', ')}`); if (flagsGone.length) parts.push(`flags taken out ${flagsGone.join(', ')}`);
    sec3.push(`- ${rel} (${state}): ${parts.join('; ')}`); codeLines++; counted[3] = (counted[3] || 0) + renamed.length + fresh.length + gone.length + flagsAdded.length + flagsGone.length;
  }
  if (!codeLines) sec3.push('No name or flag added, renamed or removed.');

  // Section 4: questions, rows, headings and lines.
  const sec4 = [];
  const raA = text(base, 'docs/RULES-AUDIT.md'); const raB = text(tree, 'docs/RULES-AUDIT.md'); const qA = questionsOf(raA); const qB = questionsOf(raB); const qLines = [];
  for (const [n, b] of [...qB].sort((x, y) => x[0] - y[0])) { const a = qA.get(n);
    if (!a) qLines.push(`- Q${n}, raised${b.status === 'open' ? '' : ' and ' + b.status + ' in the same pass'} (line ${b.n}): ${quoted(b.text, 600)}`);
    else if (a.status !== b.status) qLines.push(`- Q${n}, ${b.status} (${a.status} in the base; line ${b.n}): old ${quoted(a.text, 500)}; new ${quoted(b.text, 600)}`);
    else if (a.text !== b.text) qLines.push(`- Q${n}, reworded, still ${b.status} (line ${b.n}): ${wordChanges(a.text, b.text).map((c) => 'old ' + quoted(c.old, 300) + ', new ' + quoted(c.now, 300)).join('; ')}`); }
  for (const [n, a] of qA) if (!qB.has(n)) qLines.push(`- Q${n}, gone from section 11 (base line ${a.n}): ${quoted(a.text, 400)}`);
  sec4.push(`### docs/RULES-AUDIT.md section 11, question by question (${qLines.length})`, '', ...(qLines.length ? qLines : ['No question raised, answered, withdrawn or reworded.']), '');
  counted[4] = (counted[4] || 0) + qLines.length;
  const rowSection = (key, file, label) => {
    const a = rowsOf(key, text(base, file)); const b = rowsOf(key, text(tree, file)); const lines = [];
    const gone = [...a.rows.keys()].filter((k) => !b.rows.has(k)); const fresh = [...b.rows.keys()].filter((k) => !a.rows.has(k)); const pairs = [];
    for (const k of gone.slice()) { let best = -1; let score = 0.5; fresh.forEach((f, j) => { const s = alike(a.rows.get(k).line, b.rows.get(f).line); if (s >= score) { score = s; best = j; } }); if (best >= 0) { pairs.push([k, fresh[best]]); fresh.splice(best, 1); gone.splice(gone.indexOf(k), 1); } }
    const entry = (head, x, y) => { lines.push(head); for (const c of wordChanges(x.line, y.line)) lines.push(`  - old: ${quoted(c.old, 500)}`, `    new: ${quoted(c.now, 500)}`); lines.push(`  - ${besideRow(b.all, y.n)}`); };
    for (const [k, y] of b.rows) { const x = a.rows.get(k); if (x && x.line !== y.line) entry(`- ${quoted(y.title, 120)}, ${key === 'RA' ? 'section ' + y.section + ', ' : ''}line ${y.n} (base line ${x.n})${key === 'EA' ? ', status ' + quoted(x.line.split('|').slice(-2, -1)[0], 100) + ' to ' + quoted(y.line.split('|').slice(-2, -1)[0], 100) : ''}:`, x, y); }
    for (const [k, f] of pairs) entry(`- ${quoted(b.rows.get(f).title, 120)}, line ${b.rows.get(f).n}, its title changed from ${quoted(k, 160)}:`, a.rows.get(k), b.rows.get(f));
    for (const k of fresh) { const y = b.rows.get(k); lines.push(`- ${quoted(y.title, 120)}, line ${y.n}, a row new in the tree: ${quoted(y.line, 600)}`, `  - ${besideRow(b.all, y.n)}`); }
    for (const k of gone) { const x = a.rows.get(k); lines.push(`- ${quoted(x.title, 120)} (base line ${x.n}), a row gone from the tree: ${quoted(x.line, 600)}`); }
    const n = lines.filter((l) => l.startsWith('- ')).length; counted[4] = (counted[4] || 0) + n;
    sec4.push(`### ${label} (${n})`, '', ...(lines.length ? lines : ['None.']), '');
  };
  rowSection('RA', 'docs/RULES-AUDIT.md', 'RULES-AUDIT rows whose text changed, by title, with their old and new words and the rows on either side');
  rowSection('EA', 'docs/EARMARKS.md', 'EARMARKS rows whose text changed, by id, with their old and new words and the rows on either side');
  // Every record's removed and changed lines (a RULES-AUDIT or EARMARKS row and a question are above), a removed line found again in a
  // record named as moved there, and the lines added counted.
  const index = new Map(); for (const f of RECORDS) text(tree, f).split('\n').forEach((l, i) => { if (l.trim().length > 20 && !index.has(l)) index.set(l, `${f} line ${i + 1}`); });
  const tableRow = (f, l) => (f === 'docs/RULES-AUDIT.md' || f === 'docs/EARMARKS.md') && /^\| /.test(l); const questionLine = (f, l) => f === 'docs/RULES-AUDIT.md' && /^- Q\d+\. /.test(l);
  const recLines = []; const addedBy = [];
  for (const f of RECORDS) {
    const pa = join(base, f); const pb = join(tree, f);
    if (!existsSync(pa) && !existsSync(pb)) continue;
    if (!existsSync(pb)) { recLines.push(`- ${f}: the record is gone from the tree`); continue; } if (!existsSync(pa)) { recLines.push(`- ${f}: a record new in the tree`); continue; }
    if (baseFiles.has(f) && treeFiles.has(f) && baseFiles.get(f).digest === treeFiles.get(f).digest) continue;
    const ch = lineChanges(pa, pb);
    const treeLines = text(tree, f).split('\n'); const baseLines = text(base, f).split('\n'); const long = LONG_THREE.includes(f);
    for (const r of ch.removed) { if (!r.old.trim() || tableRow(f, r.old) || questionLine(f, r.old)) continue; const head = /^#{1,6} /.test(r.old);
      recLines.push(`- ${f}: ${head ? 'a heading' : 'a line'} removed (base line ${r.was}): ${quoted(r.old, 600)}${index.has(r.old) ? ', found again at ' + index.get(r.old) : ''}${long ? '; in the base, ' + besideLine(baseLines, r.was) : ''}`); }
    for (const c of ch.changed) { if (tableRow(f, c.old) || questionLine(f, c.old)) continue; const head = /^#{1,6} /.test(c.old);
      recLines.push(`- ${f}: ${head ? 'a heading' : 'a line'} changed (base line ${c.was}, tree line ${c.now}):`); for (const w of wordChanges(c.old, c.line)) recLines.push(`  - old: ${quoted(w.old, 500)}`, `    new: ${quoted(w.now, 500)}`);
      if (long) recLines.push(`  - ${besideLine(treeLines, c.now)}`); }
    const heads = ch.added.filter((x) => /^#{1,6} /.test(x.line)); if (ch.added.length) addedBy.push(`${f} ${ch.added.length}${heads.length ? ' (headings added: ' + heads.map((x) => quoted(x.line, 100)).join(', ') + ')' : ''}`);
  }
  const recCount = recLines.filter((l) => l.startsWith('- ')).length; counted[4] = (counted[4] || 0) + recCount;
  sec4.push(`### Headings and lines removed or changed in the records (${recCount}; RULES-AUDIT and EARMARKS rows and the questions are above)`, '', ...(recLines.length ? recLines : ['None.']), '', `Lines added, by record: ${addedBy.join('; ') || 'none'}.`);

  // Section 5: L28's searches and reads.
  const sec5 = []; const texts = searchedTexts(tree);
  const decA = text(base, 'docs/DECISIONS.md'); const passes = passesOf(decA); const newestBase = passes[passes.length - 1] || null;
  const found = lessonPass ? { pass: lessonPass, why: 'given with --lesson-pass' } : lessonPassOf(text(base, 'docs/HANDOFF.md'));
  const from = found ? found.pass : newestBase; const at = passes.lastIndexOf(from); const searched = at >= 0 ? passes.slice(at) : [from, newestBase].filter(Boolean);
  sec5.push(`### "since pass <a pass>", from the last lesson pass to the base's own (L28's item 2)`, '', found ? `The last lesson pass: ${found.pass} (${found.why}).` : `No last lesson pass was read from the base's HANDOFF check.sh line, so the base's own pass is searched (${newestBase || 'none'}).`,
    `The passes searched: ${[...new Set(searched)].join(', ') || 'none'}, in ${texts.map((t) => t.file).join(', ')}; HANDOFF's check.sh line is read by its newest segment alone.`, '');
  for (const p of [...new Set(searched)]) { const hits = hitsOf(texts, new RegExp('[Ss]ince pass ' + p + '\\b', 'g')); sec5.push(`- "since pass ${p}": ${plural(hits.length, 'line')}`, ...hits.map(hitLine)); counted[5] = (counted[5] || 0) + hits.length; }
  const seenOld = new Set(); const searchValues = movedValues.filter((v) => Number.isInteger(v.old) && v.old >= 10 && v.old !== v.now).filter((v) => { const k = v.old + ' ' + v.stems; if (seenOld.has(k)) return false; seenOld.add(k); return true; });
  sec5.push('', `### "<a moved count> since pass" (L28's item 2; every moved count of 10 or more, by its old value, in every form the records write it)`, '');
  let countHits = 0;
  for (const v of [...new Map(searchValues.map((x) => [x.old, x])).values()]) { const n = numberPattern(v.old); const hits = hitsOf(texts, new RegExp('(?:' + n + ')[^.]{0,200}?[Ss]ince pass [A-Z]{2}\\b|[Ss]ince pass [A-Z]{2}\\b[^.]{0,200}?(?:' + n + ')', 'g'));
    if (!hits.length) continue; sec5.push(`- ${v.old.toLocaleString('en-US')} (${v.label}, now ${Number(v.now).toLocaleString('en-US')}): ${plural(hits.length, 'line')}`, ...hits.map(hitLine)); countHits += hits.length; }
  if (!countHits) sec5.push(searchValues.length ? `No hit for ${searchValues.map((v) => v.old.toLocaleString('en-US')).join(', ')}.` : 'No count of 10 or more moved.');
  counted[5] = (counted[5] || 0) + countHits;
  sec5.push('', '### The counts each quick test prints, old and new (L28\'s item 3: each test run in both trees, its PASS and NOTE lines paired by their words with the numbers masked)', '');
  for (const q of runs) {
    const d = q.d; const said = (r) => (r.missing ? 'has no such test' : r.summary || 'printed no summary'); const head = `- ${q.rel}: the base ${said(q.a)}; the tree ${said(q.b)}`;
    sec5.push(head + (d.moved.length + d.fresh.length + d.gone.length ? '' : '; every line the same'));
    for (const [x, y] of d.moved) sec5.push(`  - ${quoted(x, 400)} to ${quoted(y, 400)}`);
    if (d.fresh.length) sec5.push(`  - new in the tree (${d.fresh.length}): ${d.fresh.map((l) => quoted(l, 240)).join('; ')}`);
    if (d.gone.length) sec5.push(`  - gone from the tree (${d.gone.length}): ${d.gone.map((l) => quoted(l, 240)).join('; ')}`);
    counted[5] = (counted[5] || 0) + d.moved.length + d.fresh.length + d.gone.length;
  }
  sec5.push('', '### HANDOFF\'s check.sh line, by its newest pass\'s segment (L28\'s item 5)', '');
  const clA = checkLineOf(text(base, 'docs/HANDOFF.md')); const clB = checkLineOf(text(tree, 'docs/HANDOFF.md'));
  if (clA && clB) {
    sec5.push(`- the base's newest segment, pass ${clA.newest.pass} (line ${clA.n}): ${quoted(clA.newest.text, 3000)}`, `- the tree's newest segment, pass ${clB.newest.pass} (line ${clB.n}): ${quoted(clB.newest.text, 3000)}`);
    const ia = segmentItems(clA.newest); const ib = segmentItems(clB.newest); const diffs = [];
    for (const [k, v] of ib) { if (!ia.has(k)) diffs.push(`${k}: ${v}, new`); else if (ia.get(k) !== v) diffs.push(`${k}: ${ia.get(k)} to ${v}`); }
    for (const [k, v] of ia) if (!ib.has(k)) diffs.push(`${k}: ${v}, gone`);
    sec5.push(`- items that differ between the two segments (${diffs.length}): ${diffs.join('; ') || 'none'}${clB.newest.pass === clA.newest.pass ? ' (the tree has no segment of its own yet: the line is filled after check.sh, a placeholder until then)' : ''}`);
    counted[5] = (counted[5] || 0) + diffs.length;
  } else sec5.push(`- ${clB ? 'the base' : 'the tree'}'s docs/HANDOFF.md has no check.sh line of "check.sh (pass XX):" segments`);
  sec5.push('', '### Rows that hold a moved count\'s old number in the present tense (L28\'s item 4, a list and not a verdict)', '',
    'Each row below holds an old value of a count that moved, in a sentence with a verb in the present tense (and the count\'s word, where the count has one). A row dated to an older pass can be true as history and still read as current; no search can tell the two apart, so the verdict on each is the reader\'s: still true, true as history and worth a date, or no longer true.', '');
  let present = 0; const presentSeen = new Set();
  for (const v of movedValues.filter((x) => Number.isInteger(x.old) && x.old >= 10 && x.old !== x.now)) {
    const key = v.old + ' ' + v.stems; if (presentSeen.has(key)) continue; presentSeen.add(key);
    const re = new RegExp(numberPattern(v.old), 'g'); const stem = v.stems ? new RegExp('\\b(?:' + v.stems + ')', 'i') : null; const rows = [];
    for (const { file, lines } of texts) lines.forEach((l, i) => { for (const m of l.matchAll(re)) { const s = sentenceAt(l, m.index, m[0].length); if (!PRESENT.test(s) || (stem && !stem.test(s))) continue; rows.push({ file, n: i + 1, title: titleOf(l, 90), times: 1, text: s }); break; } });
    if (!rows.length) continue; sec5.push(`- ${v.old.toLocaleString('en-US')} (${v.label}, now ${Number(v.now).toLocaleString('en-US')}): ${plural(rows.length, 'row')}`, ...rows.map(hitLine)); present += rows.length;
  }
  if (!present) sec5.push('None.');
  counted[5] = (counted[5] || 0) + present;

  // The base as it was: every file's size and time read again, and any change named, since nothing may write there.
  const after = filesOf(base, false); const touched = [];
  for (const [r, x] of baseFiles) { const y = after.get(r); if (!y) touched.push(`${r} gone`); else if (y.size !== x.size || y.time !== x.time) touched.push(`${r} changed`); }
  for (const r of after.keys()) if (!baseFiles.has(r)) touched.push(`${r} added`);
  if (touched.length) say(`THE BASE CHANGED while the manifest was made: ${touched.slice(0, 20).join(', ')}${touched.length > 20 ? ' and ' + (touched.length - 20) + ' more' : ''}`);

  // The manifest.
  const newestTree = passesOf(text(tree, 'docs/DECISIONS.md')).pop() || 'none';
  const head = ['# The ripple read\'s manifest', '', `Made by node tools/ripple-manifest.mjs --base ${base}, in ${tree}, on ${new Date().toLocaleDateString('en-CA')} (EARMARKS L28), in ${secondsSince(started)}. The base's newest DECISIONS entry is pass ${newestBase || 'none'}'s; the tree's, pass ${newestTree}'s.`, '',
    'A list made to find too much, from the tools\' own readings of both trees: the reader reads each entry against the records and judges it, as the ripple read\'s brief says (docs/INDEPENDENT-CHECKS.md, the ripple read), and the lead judges each finding before a row changes.', '',
    '| Section | Entries |', '|---|---|', `| 1. Values the floor guard and tools/record-counts.mjs read that moved | ${counted[1] || 0} |`, `| 2. Floors, ceilings and pinned counts whose counted thing the pass moved | ${counted[2] || 0} |`,
    `| 3. Ids, titles, functions, files and tool flags added, renamed or removed | ${counted[3] || 0} |`, `| 4. Questions, rows, headings and lines | ${counted[4] || 0} |`, `| 5. L28's searches and reads | ${counted[5] || 0} |`, '',
    '## Not read', '', ...(unread.length ? unread.map((u) => `- ${u}`) : ['Everything was read.']), ''];
  const body = [...head, '## 1. Values the floor guard and tools/record-counts.mjs read that moved', '', '### The floor guard (tests/floor-guard.test.mjs), its own reading of both trees', '', ...sec1, '',
    '## 2. Floors, ceilings and pinned counts whose counted thing the pass moved (L28\'s item 1)', '', ...sec2, '', '## 3. Ids, titles, functions, files and tool flags added, renamed or removed', '', ...sec3, '',
    '## 4. Questions, rows, headings and lines', '', ...sec4, '', '## 5. L28\'s searches and reads', '', ...sec5, '',
    '## What stays the reader\'s', '', 'This list is where the reading starts, never where it ends. The reader searches the records for each entry in every form they write it, reads each row a search finds whole with the rows on either side, runs each tool a new row describes, and gives each row its verdict; the rows that hold an old value in the present tense (section 5) are judged by the reader, since a row true as history and a row gone stale read alike to a search. What no change of the pass touches (a row that is missing, drift with no link to the pass, a restatement in words no search tried, two older rows that disagree) is for the week\'s whole reads, as the ripple read\'s brief says.', ''];
  return { text: body.join('\n'), unread, counted, touched };
}

// The self-test: made base and tree pairs, the tool run on them from the made tree as the lead runs it (spawnSync, --base and --out),
// and the manifest read for every kind of entry, each beside a near miss that must not be listed; then the tool run to standard output
// on a third pair (a game moves there, and its tree has no check.sh segment of its own yet), on a pair where nothing moved (the made tree
// read against a copy of itself), on a broken pair (a base whose code throws, a tree whose code ends its reading process, and a quick test
// that writes into its tree), and on each refusal. The made trees hold
// copies of this tree's guard, record-counts, content-snapshot, check-times and pass-packet, and of this file, so the real code reads
// them; the made tree's record-counts reads one count more than the base's code has, so the base is read by its own tool, as a pass that
// adds a count leaves it; and the base's own guard is a stub that reads nothing, so a base read by its own guard would show every value new.
function madeTree(root, side, { broken = false, exits = false, games = false, noSegment = false } = {}) {
  const tree = side === 'tree'; const put = (rel, body) => { mkdirSync(dirname(join(root, rel)), { recursive: true }); writeFileSync(join(root, rel), body); };
  // The real code, copied into both trees; the base has no tools/check-times.mjs, so the guard's copy of it is given this tree's.
  for (const rel of [SELF, 'tools/content-snapshot.mjs', 'tools/record-counts.mjs', 'tools/pass-packet.mjs', 'tests/floor-guard.test.mjs', ...(tree ? ['tools/check-times.mjs'] : [])]) put(rel, readFileSync(join(HERE, rel)));
  // The base's own guard is an older one that reads nothing.
  if (!tree) put('tests/floor-guard.test.mjs', ['// A stub of an older guard for the ripple manifest\'s self-test: it reads nothing.', "import { writeFileSync, mkdirSync } from 'node:fs';",
    "if (process.argv[1].endsWith('floor-guard.test.mjs') && process.argv.slice(2).includes('--write')) { mkdirSync(new URL('./fixtures/', import.meta.url), { recursive: true }); writeFileSync(new URL('./fixtures/floor-baseline.json', import.meta.url), '{\"values\": []}\\n'); console.log('baseline written: 0 values, a stub'); }", ''].join('\n'));
  // A baseline in both trees, which the guard's copy must leave out, since --write --first refuses over one.
  put('tests/fixtures/floor-baseline.json', '{"from": "a made baseline", "values": []}\n');
  if (tree) { const rc = readFileSync(join(HERE, 'tools/record-counts.mjs'), 'utf8'); const anchor = 'banks: Object.keys(L.GENERATORS).length,';
    if (rc.split(anchor).length !== 2) throw new Error(`tools/record-counts.mjs no longer holds "${anchor}" once, where the made tree's one more count is planted`); put('tools/record-counts.mjs', rc.split(anchor).join(anchor + ' newThings: L.NEW_THING.length,')); }
  // The code: a course of two lessons that becomes three (one renamed, one retitled with its line and picture changed), banks renamed,
  // added, removed and changed (g-one deals ten questions and g-three four), twenty generators that become twenty-one, a Wonder question,
  // a coloring page and the screens' code added in the tree.
  const modules = [
    "{ id: 'count-one', title: '" + (tree ? 'One dot' : 'One') + "', lesson: { script: [{ say: '" + (tree ? 'One dot, alone.' : 'One dot.') + "', show: { kind: 'dots', count: 1" + (tree ? ", color: 'red'" : '') + " } }] }, generators: ['g-one', " + (tree ? "'g-new'" : "'g-old', 'g-gone'") + '] }',
    "{ id: '" + (tree ? 'count-two' : 'count-old') + "', title: 'Two', lesson: { script: [{ say: 'Two dots.', show: { kind: 'dots', count: 2 } }] }, generators: ['g-two'] }",
    ...(tree ? ["{ id: 'count-three', title: 'Three', lesson: { script: [{ say: 'Three dots.', show: { kind: 'dots', count: 3 } }] }, generators: ['g-three'] }"] : []),
  ];
  const pads = Array.from({ length: tree ? 17 : 16 }, (_, i) => "'pad" + String(i + 1).padStart(2, '0') + "': " + (100 + i)).join(', ');
  put('src/logic.mjs', exits ? 'process.exit(3);\n' : broken ? "throw new Error('a made logic that cannot load');\n" : ['// A made logic for the ripple manifest\'s self-test.',
    "export const COURSES = [{ id: 'count-pk', title: 'Counting', grade: 'PK4', subject: 'Math', modules: [" + modules.join(', ') + '] }];',
    'export const MODULES = COURSES.flatMap((c) => c.modules.map((m) => ({ ...m, courseId: c.id })));',
    "export const GENERATORS = { 'g-one': 1, '" + (tree ? 'g-new' : 'g-old') + "': 4, 'g-two': 2, " + (tree ? "'g-three': 3, " : "'g-gone': 5, ") + pads + ' };',
    'export const LIFE_SKILLS = []; export const GAMES = [' + (games ? "{ id: 'made-game', kind: 'dots', title: 'A made game' }" : '') + '];',
    'export const WONDER = [' + (tree ? "{ id: 'w-made', stage: 'early', prompt: 'What is a made thing?' }" : '') + '];',
    '// A table entry JSON cannot write, as the real logic has.', 'export const MADE_TABLE = { gap: undefined, kept: 1 };',
    ...(tree ? ["export const NEW_THING = ['a thing only the tree has'];", 'const LOCAL_THING = 1;'] : []),
    '// A renamed bank asks the same questions; in the tree one of g-two\'s questions is asked another way.',
    "export function generateQuestion(g, seed) { const head = g === 'g-old' || g === 'g-new' ? 'which is more' : g; const kinds = g === 'g-one' ? 10 : g === 'g-three' ? 4 : 2; const prompt = " + (tree ? "g === 'g-two' && seed % 2 ? 'g-two asks one more' : " : '') + "head + ' asks ' + (seed % kinds); return { type: 'choice', prompt, choices: ['a', 'b'], answer: 'a' }; }",
    'export function questionKey(q) { return q.prompt; }', ''].join('\n'));
  put('src/ui.jsx', '// Made screens for the ripple manifest\'s self-test: only their fingerprint is read.\nexport const SCREENS = ' + (tree ? 2 : 1) + ';\n');
  put('src/stories.mjs', ['// Made stories for the ripple manifest\'s self-test.',
    "export const STORIES = { 'count-one': { title: 'One stone', about: 'a stone' }, '" + (tree ? 'count-two' : 'count-old') + "': { title: 'Two stones', about: 'two stones' }, '" + (tree ? 'count-extra2' : 'count-extra') + "': { title: 'Extra stones', about: '" + (tree ? 'more extra' : 'extra') + "' }" + (tree ? ", 'count-three': { title: 'Three stones', about: 'three stones' }" : '') + ' };',
    'export const COURSE_STORIES = {}; export const MASTERY_STORIES = {}; export const COLOR_PAGES = {' + (tree ? " 'count-three': { title: 'Three stones to color' } " : '') + '};', ''].join('\n'));
  put('docs/ART-REQUESTS.md', ['| Serial | Module | Prompt |', '|---|---|---|', '| S1 | count-one | a stone on a path |', tree ? '| S2 | count-three | three stones on a path |' : '| S3 | count-one | a stone the tree drops |', ''].join('\n'));
  put('docs/AUDIO-LEDGER.csv', ['key,text,module', '"a1","One dot.","count-one"', ...(tree ? ['"a2","Three dots.","count-three"'] : []), ''].join('\n'));
  // A made browser test: floors and pins the guard reads, and the ceilings and pins it does not, each naming a kind or none.
  put('tests/e2e/made-walk.mjs', ['// A made browser test for the ripple manifest\'s self-test: read, never run.', 'const ok = (name, cond) => console.log((cond ? \'PASS - \' : \'FAIL - \') + name);',
    '// The lesson lines the walk reads.', 'const FLOORS = { lines: ' + (tree ? 3 : 2) + ' };', '// The stories the walk opens.', 'const STORY_FLOOR = 2;', '// The games the walk plays.', 'const GAMES_FLOOR = 4;',
    '// The lessons the walk reads, counted at twelve.', 'const LESSON_FLOOR = 12;', '// The seconds a slow walk waits.', 'const SLOW_FLOOR = 60;', ...(tree ? ['// A floor new in the tree.', 'const NEW_FLOOR = 5;'] : ['// A floor gone from the tree.', 'const OLD_FLOOR = 3;']),
    '// The drawings on the walk\'s tiles.', 'const TILE_FLOOR = 2;', '// The Wonder questions the walk opens.', 'const WONDER_FLOOR = 1;', '// The courses the walk opens.', 'const COURSE_FLOOR = 1;',
    '// The ledger rows the walk reads.', 'const LEDGER_FLOOR = 1;', '// The clips the walk plays.', 'const CLIP_FLOOR = 1;', '// The coloring pages the walk opens.', 'const COLOR_FLOOR = 1;',
    '// The rows the walk reads, counted at forty.', 'const READ_FLOOR = ' + (tree ? 44 : 40) + ';',
    "const MADE_WAITS = ['a'" + (tree ? ", 'b'" : '') + '];', 'const banks = []; const over = []; const planted = 0; const screenCount = 30; const asked = []; const lineCount = []; const pinsRead = []; const extra = []; const seen = [];',
    "ok('every bank the walk reads', banks.length === 2);", "ok('no lesson line under the cue, at most a few', over.length <= 7);",
    "ok('a planted lesson line caught', planted >= 1);", "ok('the walk reads its screens', screenCount === 30);", "ok('every question the walk asks', asked.length >= " + (tree ? 8 : 6) + ');', "ok('every line the walk reads', lineCount.length >= 12);",
    "ok('every pin the walk reads', pinsRead.length >= " + (tree ? 55 : 50) + ');', "ok('a few planted lesson words at most', 9 >= extra.length);", "ok('more than eleven lines seen', seen.length > 11);", ''].join('\n'));
  put('tests/e2e/made-cue.mjs', ['// A made browser test that reads a floor of none as a ceiling, as tests/e2e/cue-words.mjs does: read, never run.', 'const zeroOr = (n) => n;',
    '// Words under the cue at the narrow size, none.', 'const FLOORS = { quiet: ' + (tree ? 2 : 0) + ' };', 'export const made = [zeroOr, FLOORS];', ''].join('\n'));
  // A made rules test: this tool's own reading, each threshold pinned by a case on each side, and the forms it leaves out.
  put('tests/made-rules.test.mjs', ['// A made rules test for the ripple manifest\'s self-test: read, never run.', 'const ok = (name, cond) => console.log((cond ? \'PASS - \' : \'FAIL - \') + name);',
    'const stories = []; const lessonsSeen = []; const choices = []; const tenLessons = []; const nineLessons = []; const moreLessons = []; const fewLessons = []; const tooMany = []; const none = []; const atMostOne = []; const noneAtAll = []; const extraLines = []; const list = []; const rowsRead = []; const generatorsRead = []; const questionsRead = [];',
    "ok('the walk reads every story, at least a dozen', stories.length >= 12);", "ok('each question has its choices', [].length === 3);", "ok('every lesson counted', lessonsSeen.length === 12);", "ok('a question has a few choices', choices.length >= 3);",
    "ok('at least ten lessons read', tenLessons.length >= 10);", "ok('at least nine lessons read', nineLessons.length >= 9);", "ok('more than nine lessons read', moreLessons.length > 9);", "ok('more than eight lessons read', fewLessons.length > 8);",
    "ok('fewer than two lesson lines too many', tooMany.length < 2);", "ok('fewer than one lesson line too many', none.length < 1);", "ok('at most one lesson line too many', atMostOne.length <= 1);", "ok('no lesson line too many', noneAtAll.length <= 0);",
    "ok('not too many lesson lines', !(extraLines.length > 20));", "ok('every lesson read often enough', list.every((x) => x.lessons >= 50));",
    "ok('every row read', rowsRead.length >= 40);", "ok('every generator counted', generatorsRead.length >= 20);", "ok('every question counted', questionsRead.length >= 16);", ''].join('\n'));
  put('tests/made-quick.test.mjs', ['// A made quick test for the ripple manifest\'s self-test, standing in for the six.', "console.log('PASS - every lesson read (" + (tree ? 14 : 12) + " lessons)');",
    "console.log('PASS - every question read (" + (tree ? '1,250' : '1,200') + " questions)');", "console.log('PASS - a line that stays (5 parts)');", "console.log('PASS - a line only the " + (tree ? 'tree' : 'base') + " prints');", "console.log('NOTE - a note that stays');", "console.log('\\n4 passed, 0 failed');", ''].join('\n'));
  put('tests/made-writer.test.mjs', ['// A made quick test that writes into its own tree and prints no summary, for the broken pair.', "import { writeFileSync } from 'node:fs';", "writeFileSync(new URL('./made-writer-touched.txt', import.meta.url), 'touched');", "console.log('PASS - a made writer ran');", ''].join('\n'));
  if (tree) put('tests/made-new.test.mjs', "// A made quick test only the tree has.\nconsole.log('PASS - a test only the tree has (1 thing)');\nconsole.log('\\n1 passed, 0 failed');\n");
  put('tools/made-tool.mjs', ['// A made tool for the ripple manifest\'s self-test: read, never run.', 'export function ' + (tree ? 'newName' : 'oldName') + '(a) { return a + 1; }', 'export const kept = 1;', tree ? 'export const added = 2;' : 'export const goneName = 5;',
    "const args = process.argv.slice(2); export const flags = [args.includes('--alpha'), args.includes('" + (tree ? '--gamma' : '--beta') + "')];", ...(tree ? ['const shared = 3; export { shared };'] : []), ''].join('\n'));
  if (tree) put('tools/made-new.mjs', '// A made tool new in the tree.\nexport const fresh = 1;\n'); else put('tools/made-old.mjs', "// A made tool only the base has.\nexport const oldTool = 'a tool only the base has';\n");
  put(tree ? 'tests/fixtures/made-b.json' : 'tests/fixtures/made-a.json', '{"made": "the same bytes in both trees"}\n');
  if (tree) put('docs/ALGORITHMS.md', '# Algorithms (made): a record only the tree has.\n'); else { put('docs/OLD-NOTES.md', 'Notes only the base holds.\n'); put('docs/DESIGN.md', '# Design (made): a record only the base has.\n'); }
  put('check.sh', ['#!/usr/bin/env bash', '# A made check.sh for the ripple manifest\'s self-test: read, never run.', ...(tree ? ['made_step() { echo made; }'] : []),
    'step "3x/13 the made self-test" /tmp/made.txt; run "the made self-test" ' + (tree ? 90 : 60) + ' node tools/made-tool.mjs --selftest' + (tree ? ' --made-flag' : '') + ' 2>&1 | tail -1 | tee /tmp/made.txt', ''].join('\n'));
  // The records: rows changed, retitled, new, gone and twinned; rows that hold moved counts in every form, and their near misses.
  put('docs/RULES-AUDIT.md', ['# Rules audit (made for the ripple manifest\'s self-test)', '', '## 9. Process: how a pass is built and delivered', '', '| Rule | Written in | Enforced by |', '|---|---|---|',
    '| **The first row (pass AA):** it says one thing. | here | doc |',
    '| **The changed row (pass AA):** the walk counts ' + (tree ? '3 lessons since pass AB. Changed in place in pass AD.' : '2 lessons since pass AB.') + ' | here | test |',
    '| **The third row (pass AA):** it says another thing since pass AC, and again since pass AC. | here | doc |',
    '| **The count row (pass AA):** the quick test reads 12 lessons since pass AB. | here | test |',
    '| **The word row (pass AA):** the quick test reads twelve lessons. | here | test |',
    '| **The dated row (pass AA):** twelve lessons, in pass AA. | here | doc |',
    '| **The seconds row (pass AA):** the walk takes 12 seconds. | here | doc |',
    '| **The comma row (pass AA):** the walk reads 1,200 questions since pass AB. | here | test |',
    '| **' + (tree ? 'The retitled row' : 'The renamed row') + ' (pass AA):** a row whose title changes in the tree, its words kept. | here | doc |',
    tree ? '| **The new row (pass AD):** penguins swim fast through icy southern oceans. | there | test |' : '| **The gone row (pass AA):** zebras graze quietly beside rivers under morning light. | here | doc |',
    '| **The hundred row (pass AA):** the quick test reads 120 lessons since pass AB. | here | test |',
    '| **The capital row (pass AA):** Twelve lessons are what it reads. | here | doc |',
    '| **The sixteen row (pass AA):** the walk asks 16 questions since pass AB. | here | test |',
    '| **The forty row (pass AA):** the walk reads 40 rows since pass AB. | here | test |',
    '| **The fifty row (pass AA):** the walk reads 50 pins since pass AB. | here | test |',
    '| **The twenty row (pass AA):** the made logic holds 20 banks. | here | doc |',
    '| **The twin row (pass AA):** one twin' + (tree ? ', changed.' : '.') + ' | here | doc |',
    '| **The twin row (pass AA):** the other twin. | here | doc |', '',
    '## 11. Open items that need Mikey', '',
    tree ? '- Q1. Answered in pass AD (Mikey: "Q1 - A"). Its rule lives in section 9 (the made dog sits).' : '- Q1. Open since pass AA: should the made dog sit? (a) yes, (b) no.',
    '- Q2. Open since pass AA: kept open in both trees.',
    tree ? '- Q3. Withdrawn in pass AD, before it was asked.' : '- Q3. Open since pass AA: to be withdrawn.',
    tree ? '- Q4. Open since pass AD: a new made question.' : '- Q5. Open since pass AA: a question the tree drops.',
    '- Q6. Open since pass AA: a question asked ' + (tree ? 'another' : 'one') + ' way.', ...(tree ? ['- Q7. Answered in pass AD (Mikey: "Q7 - B"). Raised and answered in the same pass.'] : []), ''].join('\n'));
  put('docs/EARMARKS.md', ['# Earmarks (made)', '', '## Program items', '', '| Item | What | Status |', '|---|---|---|', '| L1 | A made earmark. | ' + (tree ? 'Done (pass AD)' : 'Waiting (the next tools pass)') + ' |', '| L2 | A made earmark kept. | Waiting |', '',
    ...(tree ? [] : ['## Old section', '', 'An old paragraph under a heading that goes.', '']), '## Kept section', '', 'A paragraph that stays.', ''].join('\n'));
  put('docs/INDEPENDENT-CHECKS.md', ['# Checks (made)', '', '## The made brief', '', 'The brief says ' + (tree ? 'another' : 'one') + ' thing.', '', 'A line after it.', ''].join('\n'));
  put('docs/NEW-CHAT.md', ['# New chat (made)', '', '- Counts: <!-- n:modules -->' + (tree ? 3 : 2) + '<!-- /n --> modules.', ...(tree ? [] : ['- An old bullet that goes.', '- A line that moves to the history file, word for word.']), '- A bullet that stays.', ''].join('\n'));
  put('docs/NEW-CHAT-HISTORY.md', ['# New chat history (made)', '', ...(tree ? ['- A line that moves to the history file, word for word.'] : []), ''].join('\n'));
  put('docs/PROJECT-CONTEXT.md', ['# Project context (made)', '', tree ? 'Banks: <!-- n:banks -->21<!-- /n -->.' : 'Stories: <!-- n:moduleStories -->3<!-- /n -->.', ''].join('\n'));
  // HANDOFF: a note with one segment first (the line read is the one with the most), and the oldest segment in the older "story checks"
  // form, holding "12 lessons since pass AB", which only a search of the whole line would find.
  put('docs/HANDOFF.md', ['# Handoff (made)', '', 'An older note: check.sh (pass ZZ): 1 rule test.', '', 'The counts: ' + (tree && !noSegment ? 'check.sh (pass AD): rules 11, stories 24, the made walk 5. ' : '') + 'check.sh (pass AC): rules 10, stories 20, the made walk 5. check.sh (pass AB): rules 10, stories 20, the made walk 5. check.sh (pass AA): 9 rule tests, 18 story checks, the made walk 5, and 12 lessons since pass AB.', ''].join('\n'));
  if (!broken) put('docs/DECISIONS.md', ['# Decisions (made)', '', '## 2026-01-01 (pass AA): the first made pass', '', '- a line.', '', '## 2026-01-02 (pass AB): the second made pass', '', '- a line.', '', '## 2026-01-03 (pass AC): the third made pass', '', '- a line.', '',
    ...(tree ? ['## 2026-01-04 (pass AD): the fourth made pass', '', '- a line.', ''] : []), '## Open items', '', '- none.', ''].join('\n'));
}
async function selfTest() {
  let passed = 0; let failed = 0; const started = Date.now();
  const ok = (name, cond, info) => { if (cond) { passed++; console.log('PASS - ' + name); } else { failed++; console.log('FAIL - ' + name + (info ? '  ' + cut(info, 900) : '')); } };
  const dir = realpathSync(mkdtempSync(join(tmpdir(), 'ripple-selftest-')));
  try {
    const B = join(dir, 'base'); const T = join(dir, 'tree'); const B2 = join(dir, 'broken-base'); const T2 = join(dir, 'broken-tree'); const B3 = join(dir, 'games-base'); const T3 = join(dir, 'games-tree'); const B4 = join(dir, 'still-base');
    let built = true;
    try { madeTree(B, 'base'); madeTree(T, 'tree'); madeTree(B2, 'base', { broken: true }); madeTree(T2, 'tree', { exits: true }); madeTree(B3, 'base'); madeTree(T3, 'tree', { games: true, noSegment: true }); madeTree(B4, 'tree'); } catch (e) { ok('the made trees are built', false, e.message); built = false; }
    if (built) {
    const out = join(dir, 'manifest.md'); const before = filesOf(B); const scratch = join(dir, 'tmp'); mkdirSync(scratch); const env = { ...process.env, TMPDIR: scratch };
    const r = spawnSync(process.execPath, [join(T, SELF), '--base', B, '--out', out, '--quick', 'tests/made-quick.test.mjs,tests/made-new.test.mjs'], { cwd: dir, encoding: 'utf8', maxBuffer: 1 << 26, env });
    // The tool's own copies are named ripple-; npm may leave its compile cache in the same folder.
    const leftover = readdirSync(scratch).filter((name) => /^ripple-/.test(name)); const m = existsSync(out) ? readFileSync(out, 'utf8') : '';
    const section = (n, text = m) => { const a = text.indexOf('\n## ' + n + '. '); const b = text.indexOf('\n## ', a + 4); return a < 0 ? '' : text.slice(a, b < 0 ? text.length : b); };
    const s1 = section(1); const s2 = section(2); const s3 = section(3); const s4 = section(4); const s5 = section(5); const has = (s, ...parts) => parts.every((p) => s.includes(p));
    const lineWith = (s, ...parts) => s.split('\n').find((l) => parts.every((p) => l.includes(p))) || '';
    const linesOfPart = (s, word) => s.split('\n').filter((l) => l.includes(word)).join(' | ');
    ok('the tool runs from the made tree with --base and --out, as the lead runs it, writes its manifest, exits 0 and says where it wrote', r.status === 0 && m.startsWith("# The ripple read's manifest") && String(r.stdout).includes(out) && has(m, 'Everything was read.'), `exit ${r.status}: ${r.stdout} ${r.stderr} ${m.slice(0, 400)}`);
    ok('every temporary copy the tool made, of the guard, the counts and each reading process, is removed when it ends', leftover.length === 0, leftover.join(', '));
    ok('the six quick tests the tool runs are the six L28 names, each a step of this tree\'s check.sh (scripts, stories, spelling, ledger, coverage, pictures)', QUICK_TESTS.map((q) => q.replace(/^tests\/|\.test\.mjs$/g, '')).sort().join() === 'coverage,ledger,pictures,scripts,spelling,stories' && QUICK_TESTS.every((q) => readFileSync(join(HERE, 'check.sh'), 'utf8').split('\n').some((l) => /^step "/.test(l) && l.includes('node ' + q))), QUICK_TESTS.join(', '));
    // Section 3 also holds this tree's own tools/check-times.mjs, which the made base lacks (the guard's copy is given this tree's), so
    // the file and its names and flags are listed as added; that file changes from pass to pass (pass NX's --from added four names and six flags), so its
    // entries are counted from its own line and the made pair's forty by hand.
    const timesLine = s3.split('\n').find((l) => l.startsWith('- tools/check-times.mjs (new): ')) || '';
    const timesCount = timesLine ? timesLine.slice(timesLine.indexOf(': ') + 2).split('; ').reduce((n, part) => n + part.replace(/^(added|flags added) /, '').split(', ').length, 0) : -1;
    ok('the manifest\'s head counts each section\'s entries, the number its lists hold (19, 31, 22 and 28 in the made pair, each counted by hand; in section 3, the made pair\'s 40 and this tree\'s check-times file with its names and flags)', timesCount > 0 && s3.includes('- added (4): docs/ALGORITHMS.md, tests/made-new.test.mjs, tools/check-times.mjs, tools/made-new.mjs') && [19, 31, 40 + 1 + timesCount, 22, 28].every((c, i) => new RegExp('\\| ' + (i + 1) + '\\. [^|]+\\| ' + c + ' \\|').test(m)), `check-times entries ${timesCount}; ` + m.slice(0, 1400));
    // Section 1: moved values, old and new, by the guard's own reading; values new and gone; record-counts' counts and markers.
    ok('a moved floor is listed with its old and new value, by the guard\'s own reading (FLOORS.lines 2 to 3 in the made walk)', has(s1, 'FLOORS.lines in tests/e2e/made-walk.mjs: 2 to 3, raised, the strict way'), s1);
    ok('a limit raised in check.sh is listed, the lenient way as the guard reads it (the made self-test, 60 to 90 seconds)', has(s1, 'check.sh\'s run "the made self-test": 60 to 90 seconds, raised, the lenient way'), s1);
    ok('a floor of none read as a ceiling, raised, is the lenient way as the guard reads it (the made cue\'s FLOORS.quiet 0 to 2)', has(s1, 'FLOORS.quiet in tests/e2e/made-cue.mjs: 0 to 2, raised, the lenient way'), s1);
    ok('a pinned count that moved is listed with its old and new values (asked.length at least 6 to 8)', has(s1, 'asked.length (>=) in tests/e2e/made-walk.mjs: 6 to 8'), s1);
    ok('a floor that did not move is not listed as moved (STORY_FLOOR stays 2)', !s1.includes('STORY_FLOOR in tests/e2e/made-walk.mjs: 2 to'), s1);
    ok('a value new in the tree, a value gone from it and a member added to a waits list are each named (NEW_FLOOR 5; OLD_FLOOR 3; MADE_WAITS gains "b")', has(s1, '- NEW_FLOOR in tests/e2e/made-walk.mjs: 5, new in the tree', '- OLD_FLOOR in tests/e2e/made-walk.mjs: 3, gone from the tree', '- MADE_WAITS in tests/e2e/made-walk.mjs gains "b"') && !s1.includes('gains "a"'), s1);
    ok('record-counts\' moved counts are listed, old and new, and an unmoved one only as unmoved (modules 2 to 3, banks 20 to 21; courses 1 unmoved)', has(s1, '- modules: 2 to 3', '- banks: 20 to 21', '- moduleStories: 3 to 4') && !s1.includes('- courses:') && /Unmoved: [^\n]*courses 1/.test(s1), s1);
    ok('a count the tree\'s record-counts reads and the base\'s code lacks is read on the base by the base\'s own tool, and said so (newThings)', has(s1, '- newThings: not a count in the base to 1', 'on the base by its own tools/record-counts.mjs, since this tree\'s could not read it'), s1);
    ok('a marker whose number moved, one new in the tree and one gone from it are each listed with its record and line', has(s1, '- n:modules in docs/NEW-CHAT.md line 3: 2 to 3', '- n:banks in docs/PROJECT-CONTEXT.md line 3: 21, a marker new in the tree', '- n:moduleStories in docs/PROJECT-CONTEXT.md (base line 3): 3, a marker gone from the tree'), s1);
    // Section 2: what moved, and the values whose counted thing moved.
    ok('what the pass moved is counted kind by kind in both trees, each kind with every reason it moved, and games are not moved', has(s2, 'lessons 2 to 3 (lessons added, removed or changed)', "lesson lines 2 to 3 (a lesson's lines changed; a lesson with lines added or removed)", "drawings 2 to 3 (a lesson's pictures changed; a lesson with pictures added or removed; src/ui.jsx changed)", 'coloring pages 0 to 1 (coloring pages changed)', 'banks 4, its items changed (banks added, removed or renamed)', "questions 16 to 18 (a bank's questions changed; banks added or removed)", 'stories 3 to 4 (stories changed)', 'Wonder 0 to 1 (Wonder questions changed)', 'courses 1, its items changed (courses changed)', 'art rows 2, its items changed (art ledger rows changed)', 'audio rows 1 to 2 (audio ledger rows changed)', 'and the screens a walk visits, read with the lessons, their lines, their drawings and the questions') && /Unmoved: paragraphs 0, games 0\./.test(s2), s2.slice(0, 1500));
    ok('a floor for each kind the pass moved is listed with that kind (lessons, drawings, Wonder, courses, art rows, audio rows, coloring pages, questions)', [['- LESSON_FLOOR,', 'lessons'], ['- TILE_FLOOR,', 'drawings'], ['- WONDER_FLOOR,', 'Wonder'], ['- COURSE_FLOOR,', 'courses'], ['- LEDGER_FLOOR,', 'art rows'], ['- CLIP_FLOOR,', 'audio rows'], ['- COLOR_FLOOR,', 'coloring pages'], ['- asked.length (>=),', 'questions']].every(([name, kind]) => { const l = lineWith(s2, name); return l.includes('; names ') && l.slice(l.indexOf('; names ')).split(';')[1].includes(kind); }), linesOfPart(s2, '_FLOOR,') + ' | ' + lineWith(s2, 'asked.length'));
    ok('a floor whose counted thing moved and whose value did not is listed, unchanged, with what it counts (STORY_FLOOR 2, the stories)', has(lineWith(s2, '- STORY_FLOOR'), '2, unchanged', 'names stories', 'The stories the walk opens'), s2);
    ok('a value inside a table shows the line that holds its key (FLOORS.lines, its line "const FLOORS = { lines: 3 };")', has(lineWith(s2, '- FLOORS.lines,'), 'its line: "const FLOORS = { lines: 3 };"'), lineWith(s2, 'FLOORS.lines'));
    ok('a pinned count whose counted thing moved is listed, unchanged, with its check\'s label (banks.length === 2, the banks)', has(lineWith(s2, 'banks.length (===)'), '2, unchanged', 'names banks', 'every bank the walk reads'), s2);
    ok('a floor whose counted thing did not move is not listed (GAMES_FLOOR, the games)', !s2.includes('GAMES_FLOOR'), s2);
    ok('a ceiling, which the guard does not read, is listed by this tool with its kind (over.length <= 7, the lesson lines)', has(lineWith(s2, 'over.length <= 7'), 'a ceiling (this tool)', 'lesson lines'), s2);
    ok('a comparison with its number on the left is read the other way round (9 >= extra.length, a ceiling of 9)', has(lineWith(s2, 'extra.length <= 9'), 'a ceiling (this tool)', 'lessons'), linesOfPart(s2, 'extra.length'));
    ok('a floor of 10 or more outside the browser tests is listed by this tool, and floors and pins under 10 are not (stories.length >= 12; choices.length >= 3, [].length === 3)', has(lineWith(s2, 'stories.length >= 12'), 'a floor (this tool)', 'names stories') && !s2.includes('choices.length >= 3') && !s2.includes('.length === 3'), s2);
    ok('each threshold is pinned by a case on each side (>= 10 listed and >= 9 not; > 9 listed and > 8 not; < 2 listed and < 1 not; <= 1 listed and <= 0 not)', has(s2, 'tenLessons.length >= 10', 'moreLessons.length > 9', 'tooMany.length < 2', 'atMostOne.length <= 1') && !s2.includes('nineLessons') && !s2.includes('fewLessons') && !s2.includes('none.length < 1') && !s2.includes('noneAtAll'), linesOfPart(s2, 'Lessons') + ' | ' + linesOfPart(s2, 'tooMany') + ' | ' + linesOfPart(s2, 'atMostOne'));
    ok('a comparison under a ! or inside a function written in the condition is not read (extraLines; x.lessons)', !s2.includes('extraLines') && !s2.includes('x.lessons'), linesOfPart(s2, 'extraLines') + linesOfPart(s2, 'x.lessons'));
    const walk = s2.slice(s2.indexOf('#### tests/e2e/made-walk.mjs'), s2.indexOf('#### tests/made-rules.test.mjs'));
    ok('each file\'s values are listed the guard\'s first, then this tool\'s, its count beside its name, and the files counted at the head (the made walk)', /By file: tests\/e2e\/made-walk\.mjs \d+, tests\/made-rules\.test\.mjs \d+\./.test(s2) && walk.indexOf('banks.length (===)') > 0 && walk.indexOf('over.length <= 7') > walk.indexOf('banks.length (===)') && walk.indexOf('LESSON_FLOOR') < walk.indexOf('over.length <= 7'), walk);
    ok('a floor of one, an existence check, is named on one line under its file, and not among the counts (planted >= 1)', has(lineWith(walk, '- floors of one, each an existence check (the guard):'), 'planted') && !lineWith(walk, 'planted (>=)'), walk);
    ok('a pinned === count the guard does not read in a browser test is listed by this tool (screenCount === 30, the screens)', has(lineWith(walk, 'screenCount === 30'), 'a pinned count (===) (this tool)', 'names screens'), walk);
    ok('a pinned === count of 10 or more outside the browser tests is counted and not listed, since its own test fails when its count moves (lessonsSeen.length === 12)', /[1-9]\d* pinned === counts? of 10 or more outside the browser tests (?:is|are) not listed/.test(s2) && !s2.includes('lessonsSeen'), s2.slice(0, 1600));
    ok('a pinned count of 10 or more the guard reads is listed once, as the guard\'s, never again by this tool, with > read as at least one more (lineCount.length >= 12; seen.length > 11)', s2.split('\n').filter((l) => l.startsWith('- lineCount.length (>=), a pinned floor (at least) (the guard)')).length === 1 && !s2.includes('lineCount.length >= 12, line') && has(lineWith(s2, '- seen.length (>=), a pinned floor (at least) (the guard)'), '12, unchanged') && !s2.includes('seen.length > 11, line'), linesOfPart(s2, 'lineCount.length') + ' | ' + linesOfPart(s2, 'seen.length'));
    ok('the guard\'s values whose words name no kind are named on one line a file, for the reader (SLOW_FLOOR 60, NEW_FLOOR 5, READ_FLOOR 44; the made cue\'s FLOORS.quiet 2)', has(lineWith(s2.slice(s2.indexOf('whose words name no kind')), '- tests/e2e/made-walk.mjs:'), 'SLOW_FLOOR 60', 'NEW_FLOOR 5', 'READ_FLOOR 44') && has(lineWith(s2.slice(s2.indexOf('whose words name no kind')), '- tests/e2e/made-cue.mjs:'), 'FLOORS.quiet 2'), s2.slice(s2.indexOf('whose words name no kind')));
    const equalList = s2.slice(s2.indexOf('### Numbers in a test or tool equal'));
    ok('a number equal to a moved count\'s old value is named, from each kind of moved count, and a limit\'s old seconds are not matched against counts', has(lineWith(equalList, '- LESSON_FLOOR in tests/e2e/made-walk.mjs'), 'is 12, the old value of', 'now 14') && has(lineWith(equalList, '- rowsRead.length >= 40'), 'the old value of READ_FLOOR in tests/e2e/made-walk.mjs, now 44') && has(lineWith(equalList, '- generatorsRead.length >= 20'), "the old value of record-counts' banks, now 21") && has(lineWith(equalList, '- questionsRead.length >= 16'), 'the old value of the questions (tools/content-snapshot.mjs), now 18') && !equalList.includes('SLOW_FLOOR'), equalList);
    // Section 3: ids, titles, files, names and flags.
    ok('a renamed id is named, the same item under a new key (logic.MODULES count-old to count-two, and its story)', has(lineWith(s3, '- logic.MODULES:'), 'renamed count-old to count-two (the same item)') && has(lineWith(s3, '- stories.STORIES:'), 'renamed count-old to count-two (the same item)'), s3);
    ok('an id renamed with its item changed is named by its title, and a bank renamed by its questions (count-extra to count-extra2; g-old to g-new)', has(lineWith(s3, '- stories.STORIES:'), 'count-extra to count-extra2 (the same title, its item changed)') && has(s3, 'renamed g-old to g-new (the same questions)'), s3);
    ok('ids and banks added and removed, a bank whose questions changed and a changed title are named (count-three, S3, g-three, g-gone, g-two; "One" to "One dot")', has(lineWith(s3, '- logic.MODULES:'), 'added count-three') && has(lineWith(s3, '- art:'), 'added S2', 'removed S3') && has(lineWith(s3, '- the banks:'), 'added g-three (4 questions)', 'removed g-gone (2 questions)') && has(s3, 'g-two 2 to 2 (1 added, 1 gone, 0 changed)', 'the title of logic.MODULES:count-one: "One" to "One dot"'), s3);
    ok('files added, removed and renamed by their bytes are named', has(s3, 'added (4): docs/ALGORITHMS.md, tests/made-new.test.mjs, tools/check-times.mjs, tools/made-new.mjs', 'removed (3): docs/DESIGN.md, docs/OLD-NOTES.md, tools/made-old.mjs', 'tests/fixtures/made-a.json to tests/fixtures/made-b.json (the same bytes)'), s3);
    ok('a renamed function, names added and removed, an export list and the flags added and taken out are named, and a kept name and a kept flag are not', has(lineWith(s3, '- tools/made-tool.mjs (changed)'), 'renamed oldName to newName (the same code)', 'added added, shared', 'removed goneName', 'flags added --gamma', 'flags taken out --beta') && !lineWith(s3, '- tools/made-tool.mjs').includes('kept') && !lineWith(s3, '- tools/made-tool.mjs').includes('--alpha'), s3);
    ok('a script gone from the tree is named with its names (tools/made-old.mjs)', has(lineWith(s3, '- tools/made-old.mjs (gone)'), 'removed oldTool'), s3);
    ok('in src every top-level name is read, exported or not, and each new one named (src/logic.mjs gains NEW_THING, and LOCAL_THING, not exported)', has(lineWith(s3, '- src/logic.mjs (changed)'), 'added NEW_THING, LOCAL_THING (not exported)'), s3);
    ok('a shell script\'s functions and the flags of its lines outside comments are read (check.sh gains made_step and --made-flag)', has(lineWith(s3, '- check.sh (changed)'), 'added made_step (not exported)', 'flags added --made-flag'), s3);
    ok('the content\'s changed items are listed by family, the seeds and places a bank\'s read leaves are not, and the files changed are named (count-one; seeds:, places:; RULES-AUDIT, made-tool)', has(lineWith(s3, '- logic.MODULES:'), 'changed (1) count-one') && !/^- (?:seeds|places):/m.test(s3) && has(lineWith(s3, '- changed ('), 'docs/RULES-AUDIT.md', 'tools/made-tool.mjs'), s3);
    // Section 4: questions, rows, headings and lines.
    ok('each question raised, answered, withdrawn, reworded or gone is listed with its words, a question raised and answered at once said so, and a question kept open is not', has(lineWith(s4, '- Q1, answered (open in the base'), 'old "Open since pass AA: should the made dog sit?', 'new "Answered in pass AD (Mikey: "Q1 - A")') && has(s4, '- Q3, withdrawn (open in the base', '- Q4, raised (line', '- Q5, gone from section 11 (base line', '- Q6, reworded, still open', '- Q7, raised and answered in the same pass') && !s4.includes('- Q2'), linesOfPart(s4, '- Q'));
    ok('a changed row is listed by its title with its old and new words and the rows on either side named, and an unchanged row is not (the changed row; the first and third rows)', has(s4, '- "The changed row (pass AA)", section 9, line 8 (base line 8):', 'old: "', '[[2', 'new: "', '[[3', 'the rows on either side: line 7 "The first row (pass AA)"; line 9 "The third row (pass AA)"') && !s4.includes('- "The third row (pass AA)"'), s4);
    ok('two rows of one title are told apart, so a change to the first is listed by its own line (the twin rows)', has(s4, '- "The twin row (pass AA)", section 9, line 23 (base line 23):', '[[twin, changed.]]'), linesOfPart(s4, 'twin'));
    ok('a row whose title changed is paired with its new title, and a row new in the tree and one gone from it are named (the renamed row; the new row; the gone row)', has(s4, '- "The retitled row (pass AA)", line 15, its title changed from "The renamed row (pass AA)":', '- "The new row (pass AD)", line 16, a row new in the tree:', '- "The gone row (pass AA)" (base line 16), a row gone from the tree:'), linesOfPart(s4, ' row (pass A'));
    ok('each change in a row shows its own side\'s words around it, so a later change keeps the earlier one\'s words (the old "counts 2 lessons", the new "counts 3 lessons", beside the clause added)', has(s4, 'old: "... the walk counts 2 lessons since pass AB. [[]] | here | test |"', 'new: "... the walk counts 3 lessons since pass AB. [[Changed in place in pass AD.]] | here | test |"'), s4.split('\n').filter((l) => /^\s+(?:- )?(?:old|new):/.test(l)).join(' | '));
    ok('a clause inserted in a line reads as it was written, the insertion slid back to where its words begin (the made HANDOFF\'s new segment)', has(s4, 'new: "The counts: [[check.sh (pass AD): rules 11, stories 24, the made walk 5.]] check.sh (pass AC): rules 10,', 'old: "The counts: [[]] check.sh (pass AC): rules 10,'), linesOfPart(s4, 'The counts'));
    ok('an EARMARKS row is listed by its id with its status old and new, and a kept row is not (L1 Waiting to Done; L2)', has(lineWith(s4, '- "L1 A made earmark."'), 'status "Waiting (the next tools pass)" to "Done (pass AD)"') && !s4.includes('- "L2 '), s4);
    ok('a removed heading is listed with its words, its line and, in a long record, the lines on either side, and a kept heading and a blank line are not (## Old section; ## Kept section)', has(s4, '- docs/EARMARKS.md: a heading removed (base line 10): "## Old section"; in the base, the lines on either side: line 8 "L2 A made earmark kept."; line 12 "An old paragraph under a heading that goes."') && !/a heading (?:removed|changed) \([^)]*\):? "## (?:Kept section|Program items)"/.test(s4) && !/a line removed \([^)]*\): ""/.test(s4), linesOfPart(s4, 'docs/EARMARKS.md'));
    ok('a removed line and a changed line are listed, the changed one with its old and new words, a moved line with where it is found again, and a kept line is not', has(s4, '- docs/NEW-CHAT.md: a line removed (base line 4): "- An old bullet that goes."', '- docs/NEW-CHAT.md: a line changed (base line 3, tree line 3):', 'old: "- Counts: <!-- n:modules [[-->2<!--]] /n --> modules."', 'new: "- Counts: <!-- n:modules [[-->3<!--]] /n --> modules."', '- docs/NEW-CHAT.md: a line removed (base line 5): "- A line that moves to the history file, word for word.", found again at docs/NEW-CHAT-HISTORY.md line 3') && !/a line (?:removed|changed) \([^)]*\):? "- A bullet that stays/.test(s4), linesOfPart(s4, 'NEW-CHAT'));
    ok('a changed line in a long record names the lines on either side, and a record gone from the tree or new in it is named (INDEPENDENT-CHECKS; DESIGN; ALGORITHMS)', has(s4, '- docs/INDEPENDENT-CHECKS.md: a line changed (base line 5, tree line 5):', 'the lines on either side: line 3 "## The made brief"; line 7 "A line after it."', '- docs/DESIGN.md: the record is gone from the tree', '- docs/ALGORITHMS.md: a record new in the tree'), linesOfPart(s4, 'INDEPENDENT-CHECKS') + ' | ' + linesOfPart(s4, 'the record') + ' | ' + linesOfPart(s4, 'a record'));
    ok('the records\' lines leave the RULES-AUDIT rows and questions to their own lists, and the lines added are counted by record with their headings', !/- docs\/RULES-AUDIT\.md: a (?:line|heading) (?:removed|changed)/.test(s4) && has(lineWith(s4, 'Lines added, by record:'), 'docs/DECISIONS.md 4 (headings added: "## 2026-01-04 (pass AD): the fourth made pass")', 'docs/NEW-CHAT-HISTORY.md 1'), linesOfPart(s4, 'RULES-AUDIT.md: a') + ' || ' + lineWith(s4, 'Lines added'));
    // Section 5: L28's searches and reads.
    ok('the last lesson pass is read from the base\'s HANDOFF check.sh line, an older segment\'s "story checks" too (pass AB, whose stories rose from 18 to 20; pass AC\'s did not), and every pass from it to the base\'s own is searched (AB, AC)', has(s5, 'The last lesson pass: AB (the stories test\'s count rose from 18 in pass AA to 20 in pass AB', 'The passes searched: AB, AC,', '- "since pass AB": 7 lines', 'docs/RULES-AUDIT.md line 8 "The changed row (pass AA)"', 'docs/RULES-AUDIT.md line 10 "The count row (pass AA)"', '- "since pass AC": 1 line', 'docs/RULES-AUDIT.md line 9 "The third row (pass AA)" (2 hits)'), s5);
    const counts = s5.slice(s5.indexOf('"<a moved count> since pass"'), s5.indexOf('### The counts each quick test prints'));
    ok('"<a moved count> since pass" finds the rows that hold a moved count\'s old value beside "since pass", in digits and with commas, from each kind of moved count, never inside a longer number (12, 1,200, 40, 50, 16; not the 120 lessons)', has(lineWith(counts, '- 12 ('), 'now 14): 1 line') && has(counts, 'line 10 "The count row (pass AA)": "| **The count row (pass AA):** the quick test reads 12 lessons since pass AB.') && has(lineWith(counts, '- 1,200 ('), 'now 1,250): 1 line') && has(lineWith(counts, '- 40 ('), 'now 44): 1 line') && has(lineWith(counts, '- 50 ('), 'now 55): 1 line') && has(lineWith(counts, '- 16 ('), 'now 18): 1 line') && !counts.includes('The hundred row'), counts);
    ok('a quick test\'s counts are diffed by running it in both trees, its moved lines listed old and new, and a line that stays is not (a made test file standing in)', has(s5, '- tests/made-quick.test.mjs: the base 4 passed, 0 failed; the tree 4 passed, 0 failed', '"PASS - every lesson read (12 lessons)" to "PASS - every lesson read (14 lessons)"', '"PASS - every question read (1,200 questions)" to "PASS - every question read (1,250 questions)"') && !s5.includes('a line that stays'), s5);
    ok('a line only one tree\'s run prints is named new or gone, and a quick test only the tree has is run there and said so (made-new)', has(s5, '- new in the tree (1): "PASS - a line only the tree prints"', '- gone from the tree (1): "PASS - a line only the base prints"', '- tests/made-new.test.mjs: the base has no such test; the tree 1 passed, 0 failed', '- new in the tree (1): "PASS - a test only the tree has (1 thing)"'), s5);
    ok('HANDOFF\'s check.sh line, the line with the most segments, is read by its newest pass\'s segment in each tree, and the items that differ named (pass AC; pass AD; rules 10 to 11, stories 20 to 24; the made walk the same)', has(s5, 'the base\'s newest segment, pass AC', 'the tree\'s newest segment, pass AD', 'rules: 10 to 11', 'stories: 20 to 24') && !lineWith(s5, 'items that differ').includes('the made walk') && !s5.includes('pass ZZ'), s5);
    const pres = s5.slice(s5.indexOf('in the present tense'));
    ok('a row that holds a moved count\'s old number in the present tense is listed, in digits, words, a capital word and commas, from each kind of moved count, the verdict left to the reader, as the manifest says', has(s5, 'the verdict on each is the reader\'s') && has(pres, '- 12 (', 'The count row (pass AA)', 'The word row (pass AA)', 'The capital row (pass AA)', '- 1,200 (', 'The comma row (pass AA)', '- 40 (', 'The forty row (pass AA)', '- 50 (', 'The fifty row (pass AA)', '- 20 (', 'The twenty row (pass AA)', '- 16 (', 'The sixteen row (pass AA)'), pres);
    ok('a row with the old number and no verb in the present tense is not listed, nor one whose sentence lacks the count\'s word, nor one with the number inside a longer one (the dated, seconds and hundred rows)', !pres.includes('The dated row') && !pres.includes('The seconds row') && !pres.includes('The hundred row'), pres);
    ok('the base is left as it was: every file the same, and the manifest says so', [...before].every(([k, x]) => { const y = filesOf(B).get(k); return y && y.digest === x.digest; }) && filesOf(B).size === before.size && !m.includes('THE BASE CHANGED'), m.slice(0, 600));
    // The manifest to standard output, on a pair where a game moves and the tree has no check.sh segment of its own, with the last lesson pass given and no quick tests.
    const plain = spawnSync(process.execPath, [join(T3, SELF), '--base', B3, '--lesson-pass', 'AA', '--no-quick'], { cwd: dir, encoding: 'utf8', maxBuffer: 1 << 26, env });
    ok('a pair where a game moves lists the games among the moved kinds, with why, and the floor that counts them (GAMES_FLOOR, listed in this pair alone)', has(section(2, plain.stdout), 'games 0 to 1 (games, decks or welcome rounds changed)') && has(lineWith(section(2, plain.stdout), '- GAMES_FLOOR,'), '4, unchanged; names games'), section(2, plain.stdout).slice(0, 1200));
    ok('a tree whose HANDOFF check.sh line has no segment of its own yet is said so, the line filled after check.sh', has(section(5, plain.stdout), "the tree's newest segment, pass AC", 'the tree has no segment of its own yet'), section(5, plain.stdout).slice(section(5, plain.stdout).indexOf('HANDOFF'), section(5, plain.stdout).indexOf('HANDOFF') + 900));
    ok('without --out the manifest goes to standard output and its summary to standard error; --lesson-pass sets the passes searched and --no-quick runs no quick test',
      plain.status === 0 && plain.stdout.startsWith("# The ripple read's manifest") && /the ripple read's manifest of /.test(plain.stderr) && has(plain.stdout, 'The last lesson pass: AA (given with --lesson-pass).', 'The passes searched: AA, AB, AC,') && !section(5, plain.stdout).includes('- tests/made-'),
      `exit ${plain.status}: ${plain.stderr} ${section(5, plain.stdout).slice(0, 900)}`);
    // A pair where nothing moved: the made tree read against a copy of itself, so every list says none and the run exits 0.
    const unmoved = spawnSync(process.execPath, [join(T, SELF), '--base', B4, '--no-quick'], { cwd: dir, encoding: 'utf8', maxBuffer: 1 << 26, env });
    ok('a pair where nothing moved (the made tree read against a copy of itself) says so in every list, its content, files, names and questions none and each of its first four sections counted 0, and exits 0',
      unmoved.status === 0 && has(section(3, unmoved.stdout), 'No content id, title or bank added, renamed, removed or changed.', '- added (0): none', 'No name or flag added, renamed or removed.') && has(section(4, unmoved.stdout), 'No question raised, answered, withdrawn or reworded.') && [1, 2, 3, 4].every((s) => new RegExp('\\| ' + s + '\\. [^|]+\\| 0 \\|').test(unmoved.stdout)),
      'exit ' + unmoved.status + ': ' + String(unmoved.stderr).slice(0, 300) + ' ' + section(3, unmoved.stdout).slice(0, 600) + ' ' + unmoved.stdout.slice(0, 900));
    // The broken pair: what could not be read is named, the base's change is caught, every kind is read as moved, and the run exits 1.
    const out2 = join(dir, 'broken.md'); const b2 = spawnSync(process.execPath, [join(T2, SELF), '--base', B2, '--out', out2, '--quick', 'tests/made-writer.test.mjs'], { cwd: dir, encoding: 'utf8', maxBuffer: 1 << 26, env });
    const m2 = existsSync(out2) ? readFileSync(out2, 'utf8') : ''; const unread2 = m2.slice(m2.indexOf('## Not read'), m2.indexOf('\n## 1. '));
    ok('a base whose code cannot load, a tree whose reading process ends before it writes, a quick test that prints no summary and a test that writes into the base are each named under "Not read", every kind is read as moved (GAMES_FLOOR listed, which besides only the pair where a game moves lists), and the run exits 1',
      b2.status === 1 && has(unread2, '- record-counts on the base: a made logic that cannot load', '- tools/content-snapshot.mjs on the base: a made logic that cannot load', '- record-counts on the tree: the reading process wrote nothing (exit 3)', '- tools/content-snapshot.mjs on the tree: the reading process wrote nothing (exit 3)', 'tests/made-writer.test.mjs in the base printed no summary line', 'THE BASE CHANGED while the manifest was made: tests/made-writer-touched.txt added') && has(section(2, m2), 'so every kind is read as moved', '- GAMES_FLOOR, a floor (the guard)') && /NOTE: /.test(b2.stderr) && !unread2.includes("the floor guard's reading of the base"),
      `exit ${b2.status}: ${unread2} ${b2.stderr}`);
    ok('a manifest whose content could not be read says so under the content\'s heading (the broken pair)', has(section(3, m2), "### Content, by tools/content-snapshot.mjs's keys", 'The content was not read (named under "Not read" above).'), section(3, m2).slice(0, 500));
    // The refusals, each run as the lead runs the tool: arguments refused, and a machine without the diff program or TypeScript.
    const run = (args, extra = {}) => spawnSync(process.execPath, [join(T, SELF), ...args], { cwd: dir, encoding: 'utf8', ...extra });
    const nowhere = run(['--base', join(dir, 'nowhere')]); const itself = run(['--base', T]); const none = run([]); const badPass = run(['--base', B, '--lesson-pass', 'ab']); const badQuick = run(['--base', B, '--quick', 'tests/no-such.test.mjs']);
    const noCode = run(['--base', join(dir, 'base', 'docs')]); const intoBase = run(['--base', B, '--out', join(B, 'manifest.md')]);
    symlinkSync(B, join(dir, 'base-link')); const intoLink = run(['--base', B, '--out', join(dir, 'base-link', 'manifest.md')]);
    ok('a --base that is not a folder, one with no src/logic.mjs, the tree itself, a lesson pass that is not two capitals, a quick test in neither tree and an --out inside the base, named straight or through a link, are refused with exit 2, writing nothing, and no --base prints the usage with exit 2 too (since round one\'s code read of pass NX; 1 is a part not read or a base changed)',
      nowhere.status === 2 && /not a folder/.test(nowhere.stdout) && noCode.status === 2 && /holds no src\/logic\.mjs/.test(noCode.stdout) && itself.status === 2 && /this tree itself/.test(itself.stdout) && badPass.status === 2 && /two capitals/.test(badPass.stdout) && badQuick.status === 2 && /in neither tree/.test(badQuick.stdout) && intoBase.status === 2 && /inside the base/.test(intoBase.stdout) && intoLink.status === 2 && /inside the base/.test(intoLink.stdout) && !existsSync(join(B, 'manifest.md')) && none.status === 2 && /^usage:/.test(none.stdout),
      JSON.stringify([nowhere.status, noCode.status, itself.status, badPass.status, badQuick.status, intoBase.status, intoLink.status, none.status, intoBase.stdout, intoLink.stdout, nowhere.stdout, noCode.stdout, itself.stdout, badPass.stdout, badQuick.stdout, none.stdout]));
    const bare = join(dir, 'bin-bare'); const diffOnly = join(dir, 'bin-diff'); mkdirSync(bare); mkdirSync(diffOnly);
    const diffAt = spawnSync('sh', ['-c', 'command -v diff'], { encoding: 'utf8' }).stdout.trim(); if (diffAt) symlinkSync(diffAt, join(diffOnly, 'diff'));
    const noDiff = run(['--base', B], { env: { ...env, PATH: bare } }); const noTs = run(['--base', B], { env: { ...env, PATH: diffOnly } });
    ok('a machine without the diff program, or without TypeScript in npm\'s global modules, is refused with exit 2 before anything is read', !!diffAt && noDiff.status === 2 && /the diff program/.test(noDiff.stdout) && noTs.status === 2 && /TypeScript is not found/.test(noTs.stdout), JSON.stringify([diffAt, noDiff.status, noDiff.stdout, noDiff.stderr.slice(0, 300), noTs.status, noTs.stdout, noTs.stderr.slice(0, 300)]));
    }
  } finally { unmirror(dir); }
  console.log(`\n${passed} passed, ${failed} failed (${secondsSince(started)})`);
  process.exitCode = failed ? 1 : 0;   // never process.exit(): it can drop the last lines of a piped stdout (CLAUDE.md, 2026-09-23)
}

// Run alone: the self-test, the reading process for one tree (--side), or the manifest. Only when this is the file being run.
if (process.argv[1] && process.argv[1].endsWith('ripple-manifest.mjs')) {
  const args = process.argv.slice(2); const option = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };
  if (args.includes('--selftest')) await selfTest();
  else if (args.includes('--side')) writeFileSync(option('--to'), JSON.stringify(await sideFacts(resolve(option('--side')))));
  else if (!option('--base')) { console.log('usage: node tools/ripple-manifest.mjs --base <the last delivered tree> [--out <file>] [--lesson-pass <pass>] [--quick <tests, comma-separated>|--no-quick] | --selftest'); process.exitCode = 2; }
  else {
    const given = resolve(option('--base')); const refuse = (why) => { console.log(`not run: ${why}`); process.exitCode = 2; };
    // An --out path is held against the base by its real folder, so one written through a link into the base is refused too.
    const realOut = (p) => { const at = resolve(p); if (existsSync(at)) return realpathSync(at); return existsSync(dirname(at)) ? join(realpathSync(dirname(at)), basename(at)) : at; };
    const quick = args.includes('--no-quick') ? [] : option('--quick') ? option('--quick').split(',').map((x) => x.trim()).filter(Boolean) : QUICK_TESTS;
    if (!existsSync(given) || !statSync(given).isDirectory()) refuse(`--base ${given} is not a folder`);
    else if (!existsSync(join(given, 'src/logic.mjs'))) refuse(`--base ${given} holds no src/logic.mjs, so it is not a tree of the project`);
    else if (realpathSync(given) === realpathSync(HERE)) refuse(`--base ${given} is this tree itself: give the last delivered tree`);
    else if (option('--lesson-pass') && !/^[A-Z]{2}$/.test(option('--lesson-pass'))) refuse(`--lesson-pass ${option('--lesson-pass')} is not a pass's name of two capitals (NR)`);
    else if (spawnSync('diff', ['--version'], { encoding: 'utf8' }).error) refuse('the diff program, which the records are compared with, is not found');
    else if ((() => { try { return !parser(); } catch (e) { return true; } })()) refuse('TypeScript is not found in npm\'s global modules (npm root -g), where check.sh\'s step 9 finds tsc');
    else if (option('--out') && (realOut(option('--out')) + '/').startsWith(realpathSync(given) + '/')) refuse(`--out ${resolve(option('--out'))} is inside the base, which stays as it was delivered`);
    else if (quick.some((q) => !existsSync(join(given, q)) && !existsSync(join(HERE, q)))) refuse(`--quick names ${quick.filter((q) => !existsSync(join(given, q)) && !existsSync(join(HERE, q))).join(', ')}, in neither tree`);
    else {
      const res = await manifest({ base: realpathSync(given), tree: realpathSync(HERE), quick, lessonPass: option('--lesson-pass') });
      const summary = `the ripple read's manifest of ${HERE} against ${given}: ${[1, 2, 3, 4, 5].map((s) => 'section ' + s + ' ' + (res.counted[s] || 0)).join(', ')}${res.unread.length ? '; NOTE: ' + res.unread.length + ' part' + (res.unread.length === 1 ? '' : 's') + ' not read, named under "Not read"' : ''}`;
      if (option('--out')) { writeFileSync(resolve(option('--out')), res.text); console.log(`${summary}; written to ${resolve(option('--out'))}`); } else { process.stdout.write(res.text); console.error(summary); }
      for (const u of res.unread) console.error('NOTE: ' + u);
      if (res.unread.length || res.touched.length) process.exitCode = 1;
    }
  }
}
