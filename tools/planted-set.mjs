// Copyright (c) 2026 iECHO, LLC. All rights reserved.
// -----------------------------------------------------------------------------------------------------------------
// The planted-defect set (EARMARKS L19, pass NQ, at Mikey's answer to Q113, "Q113 - A"). In plain terms: every independent read
// (docs/INDEPENDENT-CHECKS.md) is one sample of what a reader notices, and the model map (RULES-AUDIT section 9) gives each read to a
// model as a guess. This tool turns that guess into a measurement. It keeps about thirty real past mistakes, each taken from
// docs/MISTAKE-CLASSES.md's evidence with its DECISIONS line, written in new words into a copy of today's content, beside clean items
// and items changed correctly that only look like mistakes. A reader is briefed on that copy as on any round, its report is scored
// here, and the scores pile up in tools/planted/scores.json, so the readers and the models can be compared over the weeks.
//
// The set lives in tools/planted/set.json, outside every file a reader of the copy loads: the build leaves this tool and the whole of
// tools/planted/ out of the copy, rewrites the generated docs from the planted source, puts a one-line stub in place of the histories
// that quote content word for word, and then fails if any file in the copy still holds a planted item's old words. tools/planted/
// README.md says how a scored read is briefed, how to score it, how to rotate and grow the set, and the rule for the records.
//
// Run (from the project folder):
//   node tools/planted-set.mjs --build <out dir> [--seed N] [--variant K]
//        copies the project into <out dir> (which must not exist yet), plants the set, writes READ-LIST-<brief>.md for each brief
//   node tools/planted-set.mjs --score <report file> --brief <lesson|story|wonder|code> --seed N [--model <name>] [--tokens <n>]
//        [--variant K] [--set <set file>] [--no-save]   scores a reader's report against the entries of its brief and saves the result
//        to scores.json; --set names the set its copy was built from when the set has changed since (round one's: set-r1.json)
//   node tools/planted-set.mjs --check       every wording of every entry lands exactly once in today's files (in memory, no copy)
//   node tools/planted-set.mjs --selftest    builds into a temporary folder and scores three made reports (no rules test, no browser)
// --seed picks one wording of each entry and the order of each read list (a build takes seed 1 when not given; --score needs the seed
// the copy was built with); --variant K forces wording K (counted from 1) for every entry that has one, the way the set's own test
// runs try every wording.
// -----------------------------------------------------------------------------------------------------------------
import { readFileSync, writeFileSync, existsSync, mkdirSync, cpSync, readdirSync, statSync, rmSync, mkdtempSync } from 'node:fs';
import { join, dirname, relative, basename, sep, resolve, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';

// Where things are: this tool sits in tools/, the set beside it in tools/planted/, and the project is the folder above.
const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const SET_DIR = join(HERE, 'planted');
const SET_FILE = join(SET_DIR, 'set.json');
const SCORES_FILE = join(SET_DIR, 'scores.json');

// The four briefs the set scores first (L19's first reads), each with the name its read list and its scores use, and how a reader
// of that brief names an item (the coverage receipt's forms: module, story, wonder, file).
export const BRIEFS = {
  lesson: { title: 'the lesson brief', reads: 'each lesson and its banks against its cited standards' },
  story: { title: 'the story brief with the picture brief', reads: 'each story against its lesson, and the art ledger rows of its pictures' },
  wonder: { title: 'the Wonder brief', reads: 'each Wonder question, its options, its closing, and its short and long voices' },
  code: { title: 'the code brief', reads: 'each function as new code' },
};
const KINDS = ['plant', 'control', 'near miss'];

// What the copy leaves out (L19's brief): the version history, installed packages, built files, a browser test's own output and
// the pages tests/e2e/make-page.mjs makes (each holds every item as it stood when it was made), a sound's takes, a mid-pass checkpoint,
// this tool and the set itself. Paths are relative to the project, with forward slashes. Every path .gitignore names is here
// (round one's code read: the made pages leaked 110 times wherever check.sh had run), and the self-test reads .gitignore to keep it so.
export const LEFT_OUT = ['.git', 'node_modules', 'dist', 'tests/e2e/out', 'tests/e2e/art', 'tests/e2e/page.html', 'tests/e2e/page-licensed.html',
  'audio/takes', 'CHECKPOINT', 'tools/planted-set.mjs', 'tools/planted'];
// Names left out wherever they stand, as .gitignore means a name with no slash in it (a Mac's .DS_Store, an installed package folder).
export const LEFT_OUT_ANYWHERE = ['.DS_Store', 'node_modules', '.git'];

// Whether a path of the project (relative, forward slashes) is left out of a copy.
export function leftOut(rel) {
  return LEFT_OUT.some((x) => rel === x || rel.startsWith(`${x}/`)) || rel.split('/').some((part) => LEFT_OUT_ANYWHERE.includes(part));
}

// The paths a .gitignore names that the copy would still carry: each pattern with a slash before its end is a path from the project's
// top, and one with none is a name at any depth. Returns the patterns not covered, so a new generated path is never copied unseen.
export function gitignoreGaps(text) {
  const gaps = [];
  for (const raw of String(text).split('\n')) {
    const line = raw.trim(); if (!line || line.startsWith('#') || line.startsWith('!')) continue;
    const pat = line.replace(/\/+$/, '');
    if (pat.replace(/^\//, '').includes('/')) { if (!leftOut(pat.replace(/^\//, ''))) gaps.push(line); }
    else if (!LEFT_OUT_ANYWHERE.includes(pat) && !LEFT_OUT.includes(pat)) gaps.push(line);
  }
  return gaps;
}

// The histories a reader of these briefs does not need, which quote content word for word, and the built page, which holds every
// item as it stood. Each becomes one line in the copy. No test the copy must pass reads them (only the docs sync test reads the
// histories, and it is not run on the copy; no light test and not the rules test reads index.html).
export const STUBS = {
  'docs/DECISIONS.md': '# Decisions\n\nThe pass history is kept in the main project and is not part of this copy.\n',
  'docs/CLAUDE-HISTORY.md': '# CLAUDE.md history\n\nThe history of CLAUDE.md is kept in the main project and is not part of this copy.\n',
  'docs/NEW-CHAT-HISTORY.md': '# NEW-CHAT history\n\nThe history of NEW-CHAT.md is kept in the main project and is not part of this copy.\n',
  'docs/RULES-AUDIT-HISTORY.md': '# Rules audit history\n\nThe history of RULES-AUDIT.md is kept in the main project and is not part of this copy.\n',
  'index.html': '<!-- The page is not built in this copy. Build it from the source with bash build.sh. -->\n',
};

// The generated docs, each rewritten from the planted source by the tool that writes it (the Run line in each tool's header), so a
// ledger or a list never keeps an item's old words. A tool with no output file writes its own (games-plan, record-counts --write;
// audio-ledger also writes docs/AUDIO-LEDGER.csv beside the page it prints).
export const GENERATED = [
  { args: ['tools/audio-ledger.mjs'], out: 'docs/AUDIO-LEDGER.md' },
  { args: ['tools/prompts-csv.mjs'], out: 'docs/LEONARDO-PROMPTS.csv' },
  { args: ['tools/prompts-csv.mjs', '--build', '1'], out: 'docs/LEONARDO-PROMPTS-EARLY.csv' },
  { args: ['tools/question-pools.mjs'], out: 'docs/QUESTION-POOLS.md' },
  { args: ['tools/review-ledger.mjs'], out: 'docs/REVIEW-LEDGER.md' },
  { args: ['tools/story-arc.mjs'], out: 'docs/THIN-STORIES.md' },
  { args: ['tools/story-art-audit.mjs'], out: 'docs/STORY-ART-AUDIT.md' },
  { args: ['tools/story-flow-audit.mjs'], out: 'docs/STORY-FLOW.md' },
  { args: ['tools/story-length.mjs'], out: 'docs/STORY-LENGTH.md' },
  { args: ['tools/untaught.mjs'], out: 'docs/UNTAUGHT.md' },
  { args: ['tools/cast-ages.mjs'], out: 'docs/CAST-AGES.md' },
  { args: ['tools/picture-candidates.mjs'], out: 'docs/PICTURE-CANDIDATES.md' },
  { args: ['tools/games-plan.mjs'], out: null },
  { args: ['tools/record-counts.mjs', '--write'], out: null },
];

// The leak check's window: a run of this many characters of an item's old words, crossing what the plant changed, is long enough
// to compare (a few words), and short enough to find where a ledger or a doc quotes only a sentence of a paragraph.
const WINDOW = 32;

// ---------------------------------------------------------------------------------------------------------------------------
// The set and the seed
// ---------------------------------------------------------------------------------------------------------------------------

// Reads the set and checks its shape: unique ids in the P (plant), K (control) and N (near miss) series, a known kind, brief and
// class, a harm of 1 to 3 on every plant, an item a reader can name, and every wording's edits naming a file of the project with
// a find that is not inside its replace (so the leak check can tell old words from new). Returns the entries, or throws.
export function loadSet(file = SET_FILE) {
  const set = JSON.parse(readFileSync(file, 'utf8'));
  const entries = set.entries || [];
  const problems = []; const ids = new Set(); const retired = new Set((set.retired || []).map((r) => r.id));
  for (const e of entries) {
    if (retired.has(e.id)) problems.push(`${e.id}: a retired id is never used again (set.json's retired list)`);
    const at = e.id || '(no id)';
    if (!/^[PKN]\d{2}$/.test(e.id || '')) problems.push(`${at}: an id is P, K or N and two digits`);
    if (ids.has(e.id)) problems.push(`${at}: id used twice`); ids.add(e.id);
    if (!KINDS.includes(e.kind)) problems.push(`${at}: kind is one of ${KINDS.join(', ')}`);
    if ({ P: 'plant', K: 'control', N: 'near miss' }[String(e.id)[0]] !== e.kind) problems.push(`${at}: its letter does not match its kind`);
    if (!BRIEFS[e.brief]) problems.push(`${at}: brief is one of ${Object.keys(BRIEFS).join(', ')}`);
    if (e.kind === 'plant' && !(e.harm >= 1 && e.harm <= 3)) problems.push(`${at}: a plant has a harm of 1, 2 or 3`);
    if (e.kind !== 'control' && !/^C\d{1,2}$/.test(e.class || '')) problems.push(`${at}: a plant or a near miss names its class (C1 to C35)`);
    const it = e.item || {};
    if (!['module', 'story', 'wonder', 'function'].includes(it.type)) problems.push(`${at}: item type is module, story, wonder or function`);
    if (!it.id) problems.push(`${at}: the item has an id (a module or Wonder id, a story's S serials, or a function's name)`);
    if (it.type === 'function' && (!it.file || !it.start)) problems.push(`${at}: a function item names its file and the text its first line starts with`);
    if (!e.about) problems.push(`${at}: a short line of what the item is (about)`);
    const variants = e.variants || [];
    if (!variants.length) problems.push(`${at}: at least one wording (a control with no change has one wording with no edits)`);
    variants.forEach((v, vi) => {
      if (e.kind !== 'control' && !(v.edits || []).length) problems.push(`${at} wording ${vi + 1}: a plant or a near miss changes something`);
      for (const ed of v.edits || []) {
        if (!ed.file || typeof ed.find !== 'string' || typeof ed.replace !== 'string' || !ed.find) problems.push(`${at} wording ${vi + 1}: an edit names a file, a find and a replace`);
        else if (ed.replace.includes(ed.find)) problems.push(`${at} wording ${vi + 1}: the find is inside its replace, so its old words cannot be told from the new (${ed.file})`);
        else if (!existsSync(join(ROOT, ed.file))) problems.push(`${at} wording ${vi + 1}: no file ${ed.file}`);
      }
      const words = v.catch || e.catch || [];
      if (e.kind === 'plant' && !words.length) problems.push(`${at} wording ${vi + 1}: a plant names the words a catch would use`);
      // The first catch pattern is two or more plain words, so it counts alone and the self-test can write a finding that uses it.
      if (words.length && /[\\()[\]|?*+^${}]/.test(words[0])) problems.push(`${at} wording ${vi + 1}: its first catch pattern is plain words, no pattern signs`);
      if (words.length && !/\S\s+\S/.test(words[0])) problems.push(`${at} wording ${vi + 1}: its first catch pattern is two or more words`);
      for (const w of words) { try { new RegExp(w, 'i'); } catch { problems.push(`${at} wording ${vi + 1}: catch pattern ${w} does not parse`); } }
    });
    if (e.kind === 'plant' && !(e.origin && e.origin.line && e.origin.words)) problems.push(`${at}: a plant names its origin, a DECISIONS line and a few of its words`);
    for (const k of e.known || []) { if (!k.what || !(k.words || []).length) problems.push(`${at}: a known real defect says what it is and the words a finding on it uses`); for (const w of k.words || []) { try { new RegExp(w, 'i'); } catch { problems.push(`${at}: known pattern ${w} does not parse`); } } }
    if (e.kind === 'near miss' && !(e.trap || []).length) problems.push(`${at}: a near miss names the words a false alarm on it would use (trap)`);
    if (e.kind === 'near miss' && (e.trap || []).length && (/[\\()[\]|?*+^${}]/.test(e.trap[0]) || !/\S\s+\S/.test(e.trap[0]))) problems.push(`${at}: a near miss's first trap pattern is two or more plain words`);
  }
  if (problems.length) throw new Error('the set is not well formed:\n  ' + problems.join('\n  '));
  return { about: set.about || '', stub: set.stub || {}, entries };
}

// A small seeded number in [0, 1) from a seed and a name (FNV-1a, then one step of mulberry32), so an entry's wording and its place
// in a read list depend only on the seed and its own id: a new entry never moves another.
export function seeded(seed, name) {
  let h = 2166136261 >>> 0; for (const ch of `${seed}:${name}`) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619) >>> 0; }
  let t = (h + 0x6D2B79F5) >>> 0; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

// Which wording each entry takes: the one --variant forces (K counted from 1, the last an entry has when it has fewer), or the
// seed's pick. Returns a map from id to the wording's index (from 0).
export function chooseVariants(entries, { seed = 1, variant = null } = {}) {
  const out = new Map();
  for (const e of entries) {
    const n = e.variants.length;
    out.set(e.id, variant ? Math.min(variant, n) - 1 : Math.floor(seeded(seed, `variant:${e.id}`) * n));
  }
  return out;
}

// The edits a build makes: every chosen wording's edits, in set order, each tagged with its entry.
function chosenEdits(entries, chosen) {
  return entries.flatMap((e) => (e.variants[chosen.get(e.id)].edits || []).map((ed) => ({ ...ed, id: e.id })));
}

// Counts how often a text occurs in another (no overlaps).
function count(text, find) { let n = 0; for (let i = text.indexOf(find); i >= 0; i = text.indexOf(find, i + find.length)) n += 1; return n; }

// Applies edits to a set of file texts held in memory, each find exactly once at the moment it is applied (an edit that finds its
// text twice or not at all is named), and every replace still there once all are applied (so no edit undoes another). Returns the
// planted texts by file and the problems found.
export function applyEdits(readText, edits) {
  const texts = new Map(); const problems = []; const applied = [];
  const get = (f) => { if (!texts.has(f)) texts.set(f, readText(f)); return texts.get(f); };
  for (const ed of edits) {
    const t = get(ed.file); const n = count(t, ed.find);
    if (n !== 1) { problems.push(`${ed.id}: its find occurs ${n} times in ${ed.file}, where it must occur once`); continue; }
    texts.set(ed.file, t.replace(ed.find, () => ed.replace)); applied.push(ed);
  }
  for (const ed of applied) if (!texts.get(ed.file).includes(ed.replace)) problems.push(`${ed.id}: its replace in ${ed.file} was changed by a later edit`);
  return { texts, problems };
}

// ---------------------------------------------------------------------------------------------------------------------------
// Where an item is, for the read lists and the scoring
// ---------------------------------------------------------------------------------------------------------------------------

// The lines a function spans in a file's text: from the line its start text begins on (which must occur once) to the line of the
// brace that closes its body, found by counting braces outside strings and comments. A start text that ends on [ or { names a table
// (export const EXPLANATIONS = [), which spans to the bracket that closes it. Returns [from, to], counted from 1.
export function functionLines(text, start) {
  const at = text.indexOf(start);
  if (at < 0 || text.indexOf(start, at + 1) >= 0) throw new Error(`the function start "${start}" must occur once`);
  const table = /[[{]\s*$/.test(start);
  let k = at + start.length; let depth = 0; let open = '{'; let close = '}';
  if (table) { k = start.search(/[[{]\s*$/) + at; open = text[k]; close = open === '[' ? ']' : '}'; }
  else {
    // The body opens at the first brace after the parameters' closing parenthesis (parameters may hold braces of their own).
    k = text.indexOf('(', at);
    for (; k < text.length; k += 1) { if (text[k] === '(') depth += 1; else if (text[k] === ')') { depth -= 1; if (depth === 0) break; } }
    k = text.indexOf('{', k);
  }
  let q = k; depth = 0; let quote = null;
  for (; q < text.length; q += 1) {
    const ch = text[q];
    if (quote) { if (ch === '\\') q += 1; else if (ch === quote) quote = null; continue; }
    if (ch === '/' && text[q + 1] === '/') { q = text.indexOf('\n', q); continue; }
    if (ch === '/' && text[q + 1] === '*') { q = text.indexOf('*/', q) + 1; continue; }
    if (ch === "'" || ch === '"' || ch === '`') { quote = ch; continue; }
    if (ch === open) depth += 1; else if (ch === close) { depth -= 1; if (depth === 0) break; }
  }
  const lineOf = (pos) => text.slice(0, pos).split('\n').length;
  return [lineOf(at), lineOf(q)];
}

// The line a read list gives an item, the way the coverage receipt names it: a module, a story by its S serials, a Wonder question,
// or a function as the file and the lines it spans in the planted copy.
export function itemLine(e, plantedText) {
  const it = e.item;
  if (it.type === 'module') return `- module ${it.id}`;
  if (it.type === 'story') return `- story ${it.id}`;
  if (it.type === 'wonder') return `- wonder ${it.id}`;
  const [from, to] = functionLines(plantedText(it.file), it.start);
  return `- file ${it.file} ${from}-${to}`;
}

// The order a read list gives a brief's entries for a seed: plants, controls and near misses mixed by the seed.
export function readOrder(entries, brief, seed) {
  return entries.filter((e) => e.brief === brief).map((e) => ({ e, k: seeded(seed, `order:${e.id}`) })).sort((a, b) => a.k - b.k).map((x) => x.e);
}

// The words that would tell a reader a read list is a test; no read list may hold one.
export const TELLS = /\b(planted|near miss(es)?|defects?|controls?)\b/i;

// A read list: what a pass's round brief would list as the items new this pass, in the seed's order, each with a short line of
// what it is, and nothing that says which item is planted, clean or changed correctly.
export function readList(entries, brief, seed, plantedText) {
  const lines = [`# Read list: ${BRIEFS[brief].title}`, '', `The items new this pass for ${BRIEFS[brief].title}. Read ${BRIEFS[brief].reads}, whole, in this copy.`, ''];
  for (const e of readOrder(entries, brief, seed)) lines.push(itemLine(e, plantedText), `  ${e.about}`);
  return lines.join('\n') + '\n';
}

// ---------------------------------------------------------------------------------------------------------------------------
// The leak check
// ---------------------------------------------------------------------------------------------------------------------------

// A text as a doc quotes it: a code string's escaped quote is a plain quote, a spreadsheet's doubled quote a single one, every kind
// of quote mark one mark (a paragraph's closing quote in the source can be a ledger cell's), and runs of spaces one space, so a
// sentence the source writes as 'Sam\'s dog' is found where the ledger writes "Sam's dog".
export function normal(text) { return String(text).replace(/\\(['"`])/g, '$1').replace(/""/g, '"').replace(/['"`‘’“”]/g, '"').replace(/[ \t]+/g, ' '); }

// The probes for one edit: every run of WINDOW characters of its old words that crosses what it changed (so the replace does not
// hold it), taken every few characters, with the whole find when it is shorter than a window. A file in the copy that holds one
// still holds the item's old words.
export function probes(find, replace) {
  const f = normal(find); const r = normal(replace);
  let p = 0; while (p < f.length && p < r.length && f[p] === r[p]) p += 1;
  let s = 0; while (s < f.length - p && s < r.length - p && f[f.length - 1 - s] === r[r.length - 1 - s]) s += 1;
  if (f.length <= WINDOW) return r.includes(f) ? [] : [f];
  const out = new Set();
  const first = Math.max(0, p - WINDOW + 1); const last = Math.min(f.length - WINDOW, f.length - s);
  for (let i = first; i <= last; i += 3) { const w = f.slice(i, i + WINDOW); if (!r.includes(w)) out.add(w); }
  const w = f.slice(Math.max(0, last), Math.max(0, last) + WINDOW); if (w.length === WINDOW && !r.includes(w)) out.add(w);
  return [...out];
}

// Every file of a folder, as paths relative to it with forward slashes, skipping what a list of relative paths leaves out.
function walk(dir, leaveOut = []) {
  const out = [];
  const go = (rel) => {
    for (const name of readdirSync(join(dir, rel))) {
      const r = rel ? `${rel}/${name}` : name;
      if (leaveOut.some((x) => r === x || r.startsWith(`${x}/`))) continue;
      const st = statSync(join(dir, r));
      if (st.isDirectory()) go(r); else out.push(r);
    }
  };
  go('');
  return out;
}

// A file's text if it is text (no NUL byte in its first 8,000 bytes), else null.
function textOf(path) {
  const buf = readFileSync(path);
  if (buf.subarray(0, 8000).includes(0)) return null;
  return buf.toString('utf8');
}

// The leak check: every file of the copy is read for every probe of every edit, and each hit is named with its file and entry. Two
// things keep content apart from a quote of the item. A probe counts only when every place today's edited files say it is inside a
// planted find (a long voice beside its short one, a moral beside its line, say the same words on their own). And a file holds a
// leak only when planting did not lower its count of the probe below the same file's in the project: a ledger rewritten from the
// planted source drops the item's old clip and keeps a lesson's own clip of the same sentence, while a doc that quotes the item and
// was neither rewritten nor stubbed keeps every one, and a file new to the copy keeps none. An entry may also allow a file it names
// with a reason (allowed: [{ file, why }]), for such content in another file, never for a quote of the item.
export function leaks(copyDir, entries, edits, readOriginal = (f) => (existsSync(join(ROOT, f)) ? readFileSync(join(ROOT, f), 'utf8') : '')) {
  const allowed = new Map(entries.map((e) => [e.id, new Set((e.allowed || []).map((a) => a.file))]));
  const originals = [...new Set(edits.map((ed) => ed.file))].map((f) => normal(readOriginal(f)));
  const finds = edits.map((ed) => normal(ed.find));
  const own = (w) => originals.reduce((n, t) => n + count(t, w), 0) === finds.reduce((n, t) => n + count(t, w), 0);
  const list = edits.map((ed) => ({ id: ed.id, file: ed.file, probes: probes(ed.find, ed.replace).filter(own) }));
  const found = [];
  for (const rel of walk(copyDir)) {
    const text = textOf(join(copyDir, rel)); if (text === null) continue;
    const n = normal(text); let before = null;
    for (const ed of list) {
      if (allowed.get(ed.id).has(rel)) continue;
      for (const w of ed.probes) {
        const now = count(n, w); if (!now) continue;
        if (before === null) before = normal(readOriginal(rel) || '');
        if (now >= count(before, w)) { found.push({ file: rel, id: ed.id, words: w }); break; }
      }
    }
  }
  return found;
}

// ---------------------------------------------------------------------------------------------------------------------------
// The build
// ---------------------------------------------------------------------------------------------------------------------------

// Whether a folder is the project or inside it (a relative path is read from the folder the tool runs in).
export function insideProject(dir) {
  const rel = relative(ROOT, resolve(dir));
  return rel === '' || (!rel.startsWith('..') && !isAbsolute(rel));
}

// check.sh as a copy holds it: every line that runs this tool goes, with the comment block just above it (the lines starting with #
// that lead into the step), since that block names the set and what its self-test checks (round one's code read). Other comments stay.
export function dropToolLines(text) {
  const lines = String(text).split('\n'); const out = [];
  for (const line of lines) {
    if (!line.includes('planted-set.mjs')) { out.push(line); continue; }
    while (out.length && /^\s*#/.test(out[out.length - 1])) out.pop();
  }
  return out.join('\n');
}

// Builds the planted copy: copies the project leaving out LEFT_OUT, applies the chosen wording of every entry, rewrites the generated
// docs from the planted source, stubs the histories and the built page (and any file the set's own stub list names), drops any
// check.sh line that runs this tool (it is not in the copy), checks that nothing of the set came along and nothing leaks, and writes
// one read list per brief. Returns a summary; throws with the problems when a step fails, leaving the folder for a look.
export function build(outDir, { seed = 1, variant = null, quiet = false } = {}) {
  const log = (s) => { if (!quiet) console.log(s); };
  const set = loadSet(); const entries = set.entries;
  outDir = resolve(outDir);   // a relative out dir is read from the folder the tool runs in, before any test of where it is
  if (existsSync(outDir)) throw new Error(`${outDir} exists already; the build writes a new folder`);
  if (insideProject(outDir)) throw new Error(`${outDir} is inside the project; build the copy outside it`);
  const chosen = chooseVariants(entries, { seed, variant });
  const edits = chosenEdits(entries, chosen);
  // The edits are tried in memory first, so a find that no longer lands stops the build before anything is copied.
  const dry = applyEdits((f) => readFileSync(join(ROOT, f), 'utf8'), edits);
  if (dry.problems.length) throw new Error('an edit does not land:\n  ' + dry.problems.join('\n  '));
  mkdirSync(outDir, { recursive: true });
  cpSync(ROOT, outDir, { recursive: true, filter: (src) => { const rel = relative(ROOT, src).split(sep).join('/'); return rel === '' || !leftOut(rel); } });
  log(`copied the project into ${outDir}`);
  for (const [file, text] of dry.texts) writeFileSync(join(outDir, file), text);
  log(`planted ${entries.length} entries (${edits.length} edits in ${dry.texts.size} files)`);
  // The generated docs, rewritten by their own tools in the copy, from the planted source.
  for (const g of GENERATED) {
    const run = spawnSync(process.execPath, g.args, { cwd: outDir, encoding: 'utf8', maxBuffer: 1 << 28 });
    if (run.status !== 0) throw new Error(`${g.args.join(' ')} failed in the copy: ${(run.stderr || '').slice(0, 600)}`);
    if (g.out) writeFileSync(join(outDir, g.out), run.stdout);
  }
  log(`rewrote the generated docs (${GENERATED.length} runs)`);
  const stubs = { ...STUBS, ...set.stub };
  for (const [file, text] of Object.entries(stubs)) if (existsSync(join(outDir, file))) writeFileSync(join(outDir, file), text);
  log(`stubbed ${Object.keys(stubs).length} files`);
  const checkSh = join(outDir, 'check.sh');
  if (existsSync(checkSh)) writeFileSync(checkSh, dropToolLines(readFileSync(checkSh, 'utf8')));
  // Nothing of the set came along, and no file holds a planted item's old words.
  const strays = walk(outDir).filter((rel) => rel === 'tools/planted-set.mjs' || rel.startsWith('tools/planted/'));
  if (strays.length) throw new Error(`the set's own files reached the copy: ${strays.join(', ')}`);
  const found = leaks(outDir, entries, edits);
  if (found.length) throw new Error('a file in the copy still holds a planted item\'s old words:\n  ' + found.map((l) => `${l.file} (${l.id}): "${l.words}"`).join('\n  '));
  log('leak check: no file holds a planted item\'s old words');
  const plantedText = (f) => readFileSync(join(outDir, f), 'utf8');
  // A read list that would tell its reader the copy is a test (an about line that says planted, say) stops the build.
  for (const brief of Object.keys(BRIEFS)) {
    const list = readList(entries, brief, seed, plantedText);
    if (TELLS.test(list)) throw new Error(`READ-LIST-${brief}.md would say "${list.match(TELLS)[0]}"; reword that entry's about line`);
    writeFileSync(join(outDir, `READ-LIST-${brief}.md`), list);
  }
  log(`wrote ${Object.keys(BRIEFS).map((b) => `READ-LIST-${b}.md`).join(', ')}`);
  return { entries: entries.length, edits: edits.length, files: dry.texts.size, chosen };
}

// ---------------------------------------------------------------------------------------------------------------------------
// Scoring a reader's report
// ---------------------------------------------------------------------------------------------------------------------------

// A report's findings: the items under its MUST FIX and SHOULD CONSIDER labels (a heading, a bold label or a line that starts with
// the words, "MUST FIX 2: ..." as well), each a list item, a numbered item, a bold-led paragraph or a heading of its own, with every
// line under it and every item indented under it, until the next item at its own depth or the next section (CLEAN, Opened, a
// strongest objection, a summary or a top heading). Returns [{ section: 'must' | 'should', text }].
export function findings(report) {
  const out = []; let section = null; let cur = null;
  const MAIN = /^\s{0,3}(?:#{1,6}\s*)?(?:\*\*|__)?\s*(MUST[ -]FIX(?:ES)?|SHOULD[ -]CONSIDERS?)\b/i;
  const OTHER = /^\s{0,3}(?:#{1,6}\s*)?(?:\*\*|__)?\s*(?:CLEAN|OPENED|ITEMS OPENED|STRONGEST(?: OBJECTION)?|OBJECTIONS?|SUMMARY|VERDICT)\b\s*(?:\*\*|__)?\s*(?:[:(.]|$)/i;
  const ITEM = /^(\s*)(?:[-*+]\s|\d+[.)]\s|#{3,6}\s|\*\*)/;
  const LABEL = /^\s*\*\*[^*\n]{1,30}?(?::\*\*|\*\*\s*:)/;   // a bold label inside a finding: **Place:**, **Fix**:
  const close = () => { if (cur && cur.text.trim()) out.push(cur); cur = null; };
  for (const line of String(report).split('\n')) {
    const main = line.match(MAIN);
    if (main) {
      close(); section = /^MUST/i.test(main[1]) ? 'must' : 'should';
      // Words after the label on its own line ("MUST FIX 2: module x ...") are a finding; a count or "none" is not.
      const rest = line.replace(MAIN, '').replace(/^[\s*_:#.)\-\u2013\u2014]+/, '').replace(/^\((?:\d+|none)\)/i, '').replace(/^[\s*_:#.)\-\u2013\u2014\d]+(?=\D)/, '').trim();
      if (rest && !/^(none|nothing|no findings?)\b/i.test(rest)) cur = { section, text: rest, indent: -1 };
      continue;
    }
    const heading = /^\s{0,3}#{1,6}\s/.test(line);
    if (OTHER.test(line) || (heading && /\b(clean|opened|objection|summary|verdict)\b/i.test(line)) || /^\s{0,3}#{1,2}\s/.test(line)) { close(); section = null; continue; }
    if (!section) continue;
    // A line opens a finding by its kind: a head (a numbered line, a heading, a bold line that is not a label such as **Place:**) opens
    // one at its depth or above; a bullet opens one only beside another bullet, since under a head it is that finding's Place, Problem
    // or Fix (round one's code read: the Fable lesson read's sub-bullets became findings of their own and lost the item their head named).
    const item = line.match(ITEM); const depth = (line.match(/^\s*/) || [''])[0].length;
    // A bold label is a detail only inside a head that is not itself a bold label: after **Item A:** a line **Item B:** is a finding.
    const label = LABEL.test(line) && !!cur && cur.kind === 'head' && !cur.labelHead; const bullet = !!item && /^\s*[-*+]\s/.test(line); const head = !!item && !bullet && !label;
    if (head && (!cur || depth <= cur.indent || heading)) { close(); cur = { section, text: line.trim(), indent: depth, kind: 'head', labelHead: LABEL.test(line) }; continue; }
    if (bullet && (!cur || (cur.kind !== 'head' && depth <= cur.indent))) { close(); cur = { section, text: line.trim(), indent: depth, kind: 'bullet' }; continue; }
    if (!line.trim()) { if (cur) cur.text += '\n'; continue; }
    if (cur) cur.text += '\n' + line.trim(); else cur = { section, text: line.trim(), indent: depth, kind: 'para' };
  }
  close();
  return out.map(({ section: s, text }) => ({ section: s, text })).filter((f) => !/^\s*[-*+]?\s*(none|nothing|no (must fix|findings?)|n\/a)\.?\s*$/i.test(f.text));
}

// The names a finding can use for an item: its id, its aliases (a title, a bank's id, a serial), and for a story every serial in its
// range. Returns a test that says whether a finding's text names the item, with a function item's lines too ("src/ui.jsx:6300").
export function namesItem(e, range = null) {
  const it = e.item; const names = [it.id, ...(it.aliases || [])];
  const serials = [];
  if (it.type === 'story') for (const part of String(it.id).split(/,\s*/)) { const m = part.match(/^S(\d+)(?:-S?(\d+))?$/); if (m) for (let n = Number(m[1]); n <= Number(m[2] || m[1]); n += 1) serials.push(n); }
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // A name with a capital letter (a lesson's title, a function's name) is matched as written, so a title that is a common word (Colors)
  // is not found in a sentence that only uses the word; an id in small letters is matched in any case.
  const res = names.filter((n) => !/^S\d+(-S?\d+)?$/.test(n)).map((n) => new RegExp(`(?<![\\w-])${esc(n).replace(/\s+/g, '\\s+')}(?![\\w-])`, /[A-Z]/.test(n) ? '' : 'i'));
  return (text) => {
    if (res.some((re) => re.test(text))) return true;
    if (serials.length) {
      for (const m of text.matchAll(/\bS(\d{2,5})(?:\s*(?:-|\u2013|to|through)\s*S?(\d{2,5}))?\b/g)) { const a = Number(m[1]); const b = Number(m[2] || m[1]); if (serials.some((s) => s >= a && s <= b)) return true; }
    }
    if (range && it.file) {
      const file = esc(basename(it.file));
      for (const m of text.matchAll(new RegExp(`${file}\\D{0,12}?(\\d{2,6})(?:\\s*(?:-|\u2013|to)\\s*(\\d{2,6}))?`, 'gi'))) { const a = Number(m[1]); const b = Number(m[2] || m[1]); if (a <= range[1] && b >= range[0]) return true; }
    }
    return false;
  };
}

// The items a finding is about: those its head names (the bold title of its first line, else that whole line), or, when its head names
// none, those its whole text names. A finding names its own item in its head and others only to compare (round one's Fable lesson
// read set one bank's 80 percent Yes beside five sister banks, which had made one finding about six items). Returns the ids and where
// they were found (bold, first or text).
export function aboutItems(text, entries, namers) {
  const first = String(text).split('\n')[0]; const bold = (first.match(/\*\*([^*]+)\*\*/) || [])[1] || '';
  // A bold title is the head when there is one (the words after it on the same line are the finding's body); else the first line is.
  for (const [from, part] of [['bold', bold], ['first', bold ? '' : first], ['text', text]]) { if (!part) continue; const hit = entries.filter((e) => namers.get(e.id)(part)); if (hit.length) return { ids: new Set(hit.map((e) => e.id)), from }; }
  return { ids: new Set(), from: null };
}

// Whether a finding uses the words an honest description of a defect would, read case-blind: one pattern of two or more words, or two
// different patterns matched at different places in it. One word alone is not enough (round one's code read: 272 patterns were a
// single word or under ten characters, "picture", "shows", "always", and a finding that named an item and complained of its comment
// scored a catch).
export function multiWord(p) { return /\s|\\s/.test(p); }
export function usesWords(text, patterns) {
  const spans = [];
  for (const p of patterns || []) {
    const m = new RegExp(p, 'i').exec(text); if (!m) continue;
    if (multiWord(p)) return true;
    const s = [m.index, m.index + Math.max(1, m[0].length)];
    if (!spans.some(([a, b]) => s[0] < b && a < s[1])) spans.push(s);
    if (spans.length >= 2) return true;
  }
  return false;
}

// Scores one report against one brief's entries. A plant is caught as a must fix, caught only as a should consider, missed, or
// needs a look (a finding names its item in other words, or uses its words without naming an item); a control a finding names, or a
// near miss a finding flags in its trap words, is a false alarm (a must fix) or a soft one (a should consider); a near miss named in
// other words needs a look; and a finding that names no entry's item is listed for the lead, since it may be a real defect.
export function score(report, brief, { entries, chosen, ranges = new Map() }) {
  const mine = entries.filter((e) => e.brief === brief);
  const found = findings(report);
  const namers = new Map(mine.map((e) => [e.id, namesItem(e, ranges.get(e.id))]));
  const about = new Map(found.map((f) => [f, aboutItems(f.text, mine, namers)]));
  // A batch finding names no item in its head (its bold title or first line) and two or more past it (the batch's looks, names read by
  // ear): it is about how items stand together, so it counts for a plant only in that plant's words, never as naming an item, and
  // raises no false alarm and no needs a look.
  const batch = (f) => about.get(f).from === 'text' && about.get(f).ids.size >= 2;
  const words = (e) => e.kind === 'near miss' ? e.trap : (e.variants[chosen.get(e.id)].catch || e.catch);
  const per = []; const knownHits = []; const used = new Set(found.filter((f) => about.get(f).ids.size));
  for (const e of mine) {
    const mentions = found.filter((f) => about.get(f).ids.has(e.id));
    const named = mentions.filter((f) => !batch(f));
    const hits = mentions.filter((f) => usesWords(f.text, words(e)));
    let outcome; const look = [];
    if (e.kind === 'plant') {
      if (hits.some((f) => f.section === 'must')) outcome = 'caught as must fix';
      else if (hits.length) outcome = 'caught as should consider';
      else if (named.length) { outcome = 'needs a look'; look.push(...named); }
      else {
        const loose = found.filter((f) => usesWords(f.text, words(e)) && about.get(f).ids.size === 0);
        if (loose.length) { outcome = 'needs a look'; look.push(...loose); loose.forEach((f) => used.add(f)); } else outcome = 'missed';
      }
    } else if (e.kind === 'control') {
      // A finding on a real defect the set knows in a control's item (round one found two) is no false alarm: it is listed for the lead.
      const real = named.filter((f) => (e.known || []).some((k) => usesWords(f.text, k.words)));
      const alarms = named.filter((f) => !real.includes(f));
      outcome = alarms.some((f) => f.section === 'must') ? 'false alarm' : alarms.length ? 'soft false alarm' : 'clean';
      if (alarms.length) look.push(...alarms);
      for (const f of real) knownHits.push({ id: e.id, f });
    } else {
      const flagged = named.filter((f) => usesWords(f.text, words(e)));   // a batch finding never makes a near miss's false alarm
      outcome = flagged.some((f) => f.section === 'must') ? 'false alarm' : flagged.length ? 'soft false alarm' : named.length ? 'needs a look' : 'clean';
      if (named.length) look.push(...named);
    }
    per.push({ id: e.id, kind: e.kind, class: e.class || null, harm: e.harm || 0, outcome, look });
  }
  const unmatched = found.filter((f) => !used.has(f));
  const plants = per.filter((p) => p.kind === 'plant');
  const sum = (list) => list.reduce((a, p) => a + p.harm, 0);
  const totals = {
    plants: plants.length,
    caughtMust: plants.filter((p) => p.outcome === 'caught as must fix').length,
    caughtShould: plants.filter((p) => p.outcome === 'caught as should consider').length,
    needsLook: per.filter((p) => p.outcome === 'needs a look').length,
    missed: plants.filter((p) => p.outcome === 'missed').length,
    falseAlarms: per.filter((p) => p.outcome === 'false alarm').length,
    softFalseAlarms: per.filter((p) => p.outcome === 'soft false alarm').length,
    controls: per.filter((p) => p.kind === 'control').length,
    nearMisses: per.filter((p) => p.kind === 'near miss').length,
    findings: found.length,
    unmatched: unmatched.length,
    harmAll: sum(plants),
    harmCaughtMust: sum(plants.filter((p) => p.outcome === 'caught as must fix')),
    harmCaughtAny: sum(plants.filter((p) => p.outcome.startsWith('caught'))),
    harm3All: plants.filter((p) => p.harm === 3).length,
    harm3Caught: plants.filter((p) => p.harm === 3 && p.outcome.startsWith('caught')).length,
  };
  return { per, unmatched, totals, known: knownHits };
}

// The scoring's printout: each entry by id with its outcome (a finding that needs a look quoted in part), the findings that matched
// no entry, and the totals, harm-weighted too, with the reminder L19 gives for reading them.
export function printScore(result, brief, meta) {
  const lines = [`Scored ${meta.report} against ${BRIEFS[brief].title}${meta.model ? `, model ${meta.model}` : ''}${meta.tokens ? `, ${meta.tokens} tokens` : ''}, seed ${meta.seed}${meta.variant ? `, wording ${meta.variant}` : ''}.`, ''];
  const cut = (t) => t.replace(/\s+/g, ' ').slice(0, 240) + (t.length > 240 ? ' ...' : '');
  for (const p of result.per) {
    lines.push(`${p.id} ${p.kind}${p.class ? ` ${p.class}` : ''}${p.kind === 'plant' ? ` harm ${p.harm}` : ''}: ${p.outcome}`);
    if (p.outcome !== 'caught as must fix' && p.look.length) for (const f of p.look) lines.push(`    (${f.section === 'must' ? 'must fix' : 'should consider'}) ${cut(f.text)}`);
  }
  if ((result.known || []).length) { lines.push('', `Findings on a real defect the set knows in a control's item (${result.known.length}; no false alarm, for the lead's triage):`); for (const k of result.known) lines.push(`  ${k.id} (${k.f.section === 'must' ? 'must fix' : 'should consider'}) ${cut(k.f.text)}`); }
  lines.push('', `Findings that match no entry (${result.unmatched.length}; read each, since it may be a real defect in today's content):`);
  for (const f of result.unmatched) lines.push(`  (${f.section === 'must' ? 'must fix' : 'should consider'}) ${cut(f.text)}`);
  const t = result.totals;
  lines.push('', `Plants: ${t.caughtMust} caught as must fix, ${t.caughtShould} caught only as should consider, ${t.missed} missed, of ${t.plants}; harm-weighted, ${t.harmCaughtMust} of ${t.harmAll} as must fix and ${t.harmCaughtAny} of ${t.harmAll} at all; harm 3, ${t.harm3Caught} of ${t.harm3All} caught.`,
    `False alarms: ${t.falseAlarms} (must fix) and ${t.softFalseAlarms} (should consider), on ${t.controls} ${t.controls === 1 ? 'control' : 'controls'} and ${t.nearMisses} ${t.nearMisses === 1 ? 'near miss' : 'near misses'}. Needs a look: ${t.needsLook}. Findings: ${t.findings}, ${t.unmatched} matching no entry.`,
    'A difference of two or three catches in thirty is noise (L19): compare runs over weeks, never one read.');
  return lines.join('\n');
}

// The lines each function item spans in the planted copy, worked out from the source with the chosen wordings applied in memory, so
// a finding that names "src/ui.jsx:6300" is matched to the function that holds that line.
export function functionRanges(entries, chosen) {
  const edits = chosenEdits(entries, chosen);
  const { texts } = applyEdits((f) => readFileSync(join(ROOT, f), 'utf8'), edits);
  const text = (f) => texts.get(f) ?? readFileSync(join(ROOT, f), 'utf8');
  return new Map(entries.filter((e) => e.item.type === 'function').map((e) => [e.id, functionLines(text(e.item.file), e.item.start)]));
}

// ---------------------------------------------------------------------------------------------------------------------------
// The checks of the set itself
// ---------------------------------------------------------------------------------------------------------------------------

// Every wording of every entry lands exactly once in today's files, on its own and beside the first wording of every other entry,
// and every function item's start is found once; returns the problems.
export function checkSet() {
  const { entries } = loadSet(); const problems = [];
  const read = (f) => readFileSync(join(ROOT, f), 'utf8');
  for (const e of entries) e.variants.forEach((v, vi) => {
    const chosen = chooseVariants(entries, { variant: 1 }); chosen.set(e.id, vi);
    const { problems: p } = applyEdits(read, chosenEdits(entries, chosen));
    for (const x of p) if (x.startsWith(`${e.id}:`)) problems.push(`${x} (wording ${vi + 1})`);
  });
  for (const e of entries.filter((x) => x.item.type === 'function')) { try { functionLines(read(e.item.file), e.item.start); } catch (err) { problems.push(`${e.id}: ${err.message}`); } }
  return [...new Set(problems)];
}

// Made reports for the self-test: one that names every plant of a brief as a must fix in its catch words, one that flags one
// control, and an empty one.
function madeReports(entries, chosen, brief) {
  const mine = entries.filter((e) => e.brief === brief);
  const name = (e) => e.item.id;
  const catchWord = (e) => (e.variants[chosen.get(e.id)].catch || e.catch)[0];
  const all = ['MUST FIX', ...mine.filter((e) => e.kind === 'plant').map((e, i) => `${i + 1}. ${name(e)}: ${catchWord(e)}. Fix it.`), '', 'SHOULD CONSIDER', '- None.', '', 'CLEAN', '- The rest.'].join('\n');
  const control = mine.find((e) => e.kind === 'control');
  const one = control ? ['MUST FIX', `1. ${name(control)}: this reads wrong to me. Fix it.`, '', 'CLEAN', '- The rest.'].join('\n') : null;
  return { all, one, empty: 'MUST FIX\n- None.\n\nSHOULD CONSIDER\n- None.\n\nCLEAN\n- Everything.\n' };
}

// The self-test: every wording lands once (checkSet), a build at seed 1 into a temporary folder plants every entry, carries none of
// the set's files, leaks nothing and lists every entry of each brief in its read list, a second seed is read too (another order or
// wording), and the three made reports score as they must: every plant caught with no false alarm, one false alarm, no catch.
export function selftest() {
  let pass = 0; let fail = 0;
  const ok = (name, cond, detail = '') => { if (cond) { pass += 1; console.log(`PASS - ${name}`); } else { fail += 1; console.log(`FAIL - ${name} ${detail}`); } };
  const { entries } = loadSet();
  const problems = checkSet();
  ok(`every wording of every entry lands exactly once in today's files (${entries.reduce((a, e) => a + e.variants.length, 0)} wordings of ${entries.length} entries)`, problems.length === 0, problems.join('; '));
  const plants = entries.filter((e) => e.kind === 'plant');
  ok(`the set holds plants, controls and near misses for each brief (${plants.length} plants, ${entries.filter((e) => e.kind === 'control').length} controls, ${entries.filter((e) => e.kind === 'near miss').length} near misses)`,
    Object.keys(BRIEFS).every((b) => ['plant', 'control', 'near miss'].every((k) => entries.some((e) => e.brief === b && e.kind === k))));
  ok('every harm-3 plant has a second wording, so a later run is not the same test', plants.filter((e) => e.harm === 3).every((e) => e.variants.length >= 2), plants.filter((e) => e.harm === 3 && e.variants.length < 2).map((e) => e.id).join(', '));
  const dir = mkdtempSync(join(tmpdir(), 'planted-selftest-')); const out = join(dir, 'copy');
  try {
    let built = null; let err = null;
    try { built = build(out, { seed: 1, quiet: true }); } catch (x) { err = x; }
    ok('a build at seed 1 plants every entry, rewrites the generated docs and finds no leak', !!built && !err, err ? err.message.slice(0, 800) : '');
    if (built) {
      const chosen = built.chosen; const edits = chosenEdits(entries, chosen);
      const missing = edits.filter((ed) => { const t = readFileSync(join(out, ed.file), 'utf8'); return !t.includes(ed.replace) || t.includes(ed.find); });
      ok(`every edit landed in the copy, its new words there and its old words gone (${edits.length} edits)`, missing.length === 0, missing.map((m) => m.id).join(', '));
      const strays = walk(out).filter((rel) => rel === 'tools/planted-set.mjs' || rel.startsWith('tools/planted/'));
      if (existsSync(join(out, 'check.sh')) && /planted-set\.mjs|planted-defect/i.test(readFileSync(join(out, 'check.sh'), 'utf8'))) strays.push('check.sh');
      ok('no file of the set, and no check.sh line that runs this tool or comment that names the set, reached the copy', strays.length === 0, strays.join(', '));
      const plantedText = (f) => readFileSync(join(out, f), 'utf8');
      for (const brief of Object.keys(BRIEFS)) {
        const list = readFileSync(join(out, `READ-LIST-${brief}.md`), 'utf8');
        const want = entries.filter((e) => e.brief === brief).map((e) => itemLine(e, plantedText));
        const have = list.split('\n').filter((l) => l.startsWith('- '));
        ok(`READ-LIST-${brief}.md names every entry of its brief once, and nothing else (${want.length} items)`, want.length > 0 && want.every((w) => have.filter((h) => h === w).length === 1) && have.length === want.length, want.filter((w) => !have.includes(w)).join(', '));
        ok(`READ-LIST-${brief}.md says nothing of which item is which`, !TELLS.test(list), (list.match(TELLS) || [''])[0]);
      }
      // A planted leak is caught: a doc in the copy given back one entry's old words fails the leak check, naming that file.
      const ed = edits[0]; const doc = join(out, 'docs', 'HANDOFF.md'); const before = readFileSync(doc, 'utf8');
      writeFileSync(doc, before + '\n' + normal(ed.find) + '\n');
      const caught = leaks(out, entries, edits);
      writeFileSync(doc, before);
      ok('a doc given back an entry\'s old words, planted, is caught by the leak check and named', caught.some((l) => l.file === 'docs/HANDOFF.md' && l.id === ed.id), JSON.stringify(caught.slice(0, 2)));
    }
  } finally { rmSync(dir, { recursive: true, force: true }); }
  // Rotation: another seed gives another order to at least one read list, or another wording to at least one entry.
  const a = chooseVariants(entries, { seed: 1 }); const b = chooseVariants(entries, { seed: 2 });
  const orders = Object.keys(BRIEFS).some((br) => readOrder(entries, br, 1).map((e) => e.id).join() !== readOrder(entries, br, 2).map((e) => e.id).join());
  ok('seed 2 rotates the set: another order or another wording than seed 1', orders || entries.some((e) => a.get(e.id) !== b.get(e.id)));
  // The three made reports, scored for every brief.
  const chosen = chooseVariants(entries, { seed: 1 }); const ranges = functionRanges(entries, chosen);
  for (const brief of Object.keys(BRIEFS)) {
    const made = madeReports(entries, chosen, brief);
    const all = score(made.all, brief, { entries, chosen, ranges });
    const n = entries.filter((e) => e.brief === brief && e.kind === 'plant').length;
    ok(`${brief}: a report naming every plant catches every one as a must fix, with no false alarm (${n} plants)`, all.totals.caughtMust === n && all.totals.falseAlarms === 0 && all.totals.softFalseAlarms === 0, JSON.stringify(all.per.filter((p) => p.kind === 'plant' && p.outcome !== 'caught as must fix').map((p) => p.id)));
    if (made.one) { const one = score(made.one, brief, { entries, chosen, ranges }); ok(`${brief}: a report flagging one control scores one false alarm and no catch`, one.totals.falseAlarms === 1 && one.totals.caughtMust + one.totals.caughtShould === 0, JSON.stringify(one.totals)); }
    const empty = score(made.empty, brief, { entries, chosen, ranges });
    ok(`${brief}: an empty report catches nothing and raises no alarm`, empty.totals.caughtMust + empty.totals.caughtShould === 0 && empty.totals.falseAlarms + empty.totals.softFalseAlarms === 0 && empty.totals.findings === 0, JSON.stringify(empty.totals));
  }
  // The report reader itself: section labels in the forms readers write, and a should consider kept apart from a must fix.
  const forms = findings('## MUST FIX\n\n1. **module a-b** line 3: a thing.\n   more of it\n2. second\n\n**SHOULD CONSIDER**\n- third\n\n### CLEAN\n- fourth\n\nOpened\n- module a-b\n');
  ok('the report reader finds must fix and should consider items in the forms readers write, and stops at CLEAN', forms.length === 3 && forms[0].section === 'must' && /more of it/.test(forms[0].text) && forms[2].section === 'should' && forms[2].text.includes('third'), JSON.stringify(forms));
  // Round one's Fable lesson read's shape: a bold numbered head with its Place, Problem and Fix as bullets of their own, which belong to
  // the head's finding (they had become findings that named no item), and a numbered should consider with deeper bullets.
  const shaped = findings('## MUST FIX\n\n**1. Red and blue, bank `p3-tap-red-blue`: a thing.**\n- Place: `src/logic.mjs` line 5000.\n- Problem: it is wrong.\n- Fix: say it right.\n\n**2. Taking turns: another.**\n**Place:** line 7.\n- Fix: a fix.\n\n## SHOULD CONSIDER\n\n1. **Colors: a third.**\n   - `pc-tap-colour`: a detail.\n2. **Animal sounds: a fourth.**\n\n## CLEAN\n- The rest.\n');
  const labelled = findings('MUST FIX\n**Red and blue:** the sea line.\n**Taking turns:** the idiom.\n- Fix: a fix.\n\nCLEAN\n- The rest.\n');
  ok('findings that each open with a bold label are findings of their own, each keeping its bullets', labelled.length === 2 && /Taking turns/.test(labelled[1].text) && /a fix/.test(labelled[1].text), JSON.stringify(labelled.map((f) => f.text)));
  ok('a numbered head keeps its Place, Problem and Fix bullets and bold labels as one finding with the item it names (the Fable lesson read\'s shape)', shaped.length === 4 && shaped[0].section === 'must' && /Red and blue/.test(shaped[0].text) && /Fix: say it right/.test(shaped[0].text) && /Place:\*\* line 7/.test(shaped[1].text) && /a fix/.test(shaped[1].text) && shaped[2].section === 'should' && /pc-tap-colour/.test(shaped[2].text), JSON.stringify(shaped.map((f) => f.text.split('\n')[0])));
  // A finding that names an item and complains of something else is never a catch (round one's code read): every wording of every plant
  // and near miss, its item named beside each fixed unrelated complaint, scores needs a look, never a catch or a false alarm.
  const UNRELATED = [
    'Its opening comment is not plain English and runs past the house\'s line length; reword it in short sentences.',
    'The citation names the wrong band of its standard; quote the band its grade uses, word for word.',
    'At 320 pixels wide its last line ends on one word alone, and the spacing above its title is uneven in the dark theme.',
  ];
  const flagged = []; let wordings = 0;
  for (const e of entries.filter((x) => x.kind !== 'control')) e.variants.forEach((v, vi) => {
    wordings += 1; const ch = new Map(chosen); ch.set(e.id, vi);
    for (const u of UNRELATED) { const o = score(`MUST FIX\n1. ${e.item.id}: ${u}\n`, e.brief, { entries, chosen: ch, ranges }).per.find((p) => p.id === e.id).outcome; if (o !== 'needs a look') flagged.push(`${e.id} wording ${vi + 1}: ${o}`); }
  });
  ok(`every plant and near miss named beside an unrelated complaint is needs a look, never caught (${wordings} wordings, ${UNRELATED.length} complaints each)`, wordings > 0 && flagged.length === 0, flagged.join('; '));
  // The copy's check.sh: the step that runs this tool goes with the comment block above it, and every other comment stays (a made one).
  const madeCheck = ['step "3f/13 a" x', '# The planted-defect set: its self-test builds a copy,', '# and scores made reports.', 'step "3g/13 the set" y; node tools/planted-set.mjs --selftest | tail -1', '# Lesson lines and pictures.', 'step "4/13 lessons" z'].join('\n');
  const dropped = dropToolLines(madeCheck);
  ok('a made check.sh loses the step that runs this tool and the comment block above it, and keeps the other comment', !/planted/.test(dropped) && dropped.includes('# Lesson lines and pictures.') && dropped.split('\n').length === 3, dropped);
  // Every path .gitignore names stays out of a copy, and a path added to .gitignore and not to LEFT_OUT is named (planted).
  const gi = existsSync(join(ROOT, '.gitignore')) ? readFileSync(join(ROOT, '.gitignore'), 'utf8') : '';
  const gaps = gitignoreGaps(gi); const plantedGap = gitignoreGaps(`${gi}\ntests/e2e/new-made-page.html\n`);
  ok(`every path .gitignore names is left out of a copy (${gi.split('\n').filter((l) => l.trim() && !l.trim().startsWith('#')).length} patterns), and a path added to it alone, planted, is named`, gi.length > 0 && gaps.length === 0 && plantedGap.length === 1 && plantedGap[0] === 'tests/e2e/new-made-page.html', JSON.stringify([gaps, plantedGap]));
  // A relative out dir is read from the folder the tool runs in: one inside the project is refused before any folder is made.
  const relIn = relative(process.cwd(), join(ROOT, 'planted-copy-selftest')) || '.'; const relOut = relative(process.cwd(), join(tmpdir(), 'planted-copy-selftest'));
  let refused = ''; try { build(relIn, { quiet: true }); } catch (x) { refused = x.message; }
  ok('a relative out dir inside the project is refused before anything is made, and one outside is not taken for inside', /inside the project/.test(refused) && !existsSync(join(ROOT, 'planted-copy-selftest')) && insideProject(relIn) && !insideProject(relOut), JSON.stringify([relIn, refused.slice(0, 120)]));
  // Each guard of the set, given the slip it guards against: a find that occurs twice, an edit a later edit undoes, a find inside its
  // replace, a near miss flagged in its trap words, and a read list that gives the game away.
  const twice = applyEdits(() => 'one cat, one cat', [{ id: 'X1', file: 'f', find: 'one cat', replace: 'two cats' }]);
  const undone = applyEdits(() => 'a red hat', [{ id: 'X1', file: 'f', find: 'red', replace: 'blue' }, { id: 'X2', file: 'f', find: 'blue hat', replace: 'green cap' }]);
  ok('an edit whose find occurs twice, and an edit a later edit undoes, are named (both planted)', twice.problems.length === 1 && /occurs 2 times/.test(twice.problems[0]) && undone.problems.some((p) => p.startsWith('X1:') && /changed by a later edit/.test(p)), JSON.stringify([twice.problems, undone.problems]));
  const tmp = mkdtempSync(join(tmpdir(), 'planted-shape-')); const bad = join(tmp, 'set.json');
  const plant = entries.find((e) => e.kind === 'plant'); const ed0 = plant.variants[0].edits[0];
  writeFileSync(bad, JSON.stringify({ entries: [{ ...plant, variants: [{ ...plant.variants[0], edits: [{ ...ed0, replace: `${ed0.find} and more` }] }] }] }));
  let shape = ''; try { loadSet(bad); } catch (x) { shape = x.message; } finally { rmSync(tmp, { recursive: true, force: true }); }
  ok('a set whose find sits inside its replace is refused (planted)', /inside its replace/.test(shape), shape.slice(0, 200));
  const near = entries.find((e) => e.kind === 'near miss');
  const nearReport = `MUST FIX\n1. ${near.item.id}: ${near.trap[0]} here. Fix it.\n`;
  const nearScore = score(nearReport, near.brief, { entries, chosen, ranges });
  ok(`a near miss flagged in its trap words is a false alarm, not a catch (${near.id}, planted)`, nearScore.per.find((p) => p.id === near.id).outcome === 'false alarm' && nearScore.totals.caughtMust === 0, JSON.stringify(nearScore.totals));
  // Every older round's set file is well formed, so that round's reports can still be scored against what its copies held (--set).
  const older = readdirSync(SET_DIR).filter((f) => /^set-r\d+\.json$/.test(f));
  const badOlder = older.filter((f) => { try { loadSet(join(SET_DIR, f)); return false; } catch { return true; } });
  ok(`every older round's set file is well formed (${older.join(', ') || 'none yet'})`, badOlder.length === 0, badOlder.join(', '));
  ok('a read list line that says planted, planted, is caught by the read lists\' check', TELLS.test('- module x\n  A planted item.') && !TELLS.test(readList(entries, 'lesson', 1, () => '')), '');
  console.log(`${pass} passed, ${fail} failed`);
  return fail;
}

// ---------------------------------------------------------------------------------------------------------------------------
// The command line: the tool runs only when it is the file being run, never when another file imports it.
// ---------------------------------------------------------------------------------------------------------------------------

if (process.argv[1] && process.argv[1].endsWith('planted-set.mjs')) {
  const args = process.argv.slice(2);
  const option = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };
  const seed = Number(option('--seed') || 1); const variant = option('--variant') ? Number(option('--variant')) : null;
  try {
    if (args.includes('--build')) {
      const out = option('--build'); if (!out) throw new Error('--build needs the folder to build into');
      const r = build(out, { seed, variant });
      console.log(`built ${out}: ${r.entries} entries, ${r.edits} edits in ${r.files} files, seed ${seed}${variant ? `, wording ${variant}` : ''}`);
    } else if (args.includes('--score')) {
      const file = option('--score'); const brief = option('--brief');
      if (!file || !BRIEFS[brief]) throw new Error(`--score needs a report file and --brief ${Object.keys(BRIEFS).join('|')}`);
      // The seed the copy was built with, given every time: a wrong seed scores the report against the wrong wordings (round one's code read).
      if (!/^\d+$/.test(option('--seed') || '')) throw new Error('--score needs --seed N, the seed the copy was built with');
      // The set the copy was built from: today's, or an older one named by --set (a copy built before the set changed is scored by its own).
      const setFile = option('--set') ? resolve(option('--set')) : SET_FILE;
      const { entries } = loadSet(setFile); const chosen = chooseVariants(entries, { seed, variant });
      const result = score(readFileSync(file, 'utf8'), brief, { entries, chosen, ranges: functionRanges(entries, chosen) });
      const meta = { report: basename(file), model: option('--model'), tokens: option('--tokens') ? Number(option('--tokens')) : null, seed, variant, set: basename(setFile) };
      console.log(printScore(result, brief, meta));
      if (!args.includes('--no-save')) {
        // The record keeps each entry's id and outcome and the run's counts, never an entry's words or place (the set's rule for records).
        const scores = existsSync(SCORES_FILE) ? JSON.parse(readFileSync(SCORES_FILE, 'utf8')) : { about: '', runs: [] };
        scores.runs.push({ when: new Date().toISOString(), brief, ...meta, totals: result.totals, entries: Object.fromEntries(result.per.map((p) => [p.id, p.outcome])) });
        writeFileSync(SCORES_FILE, JSON.stringify(scores, null, 2) + '\n');
        console.log(`\nsaved to ${relative(ROOT, SCORES_FILE)} (${scores.runs.length} runs)`);
      }
    } else if (args.includes('--check')) {
      const problems = checkSet();
      for (const p of problems) console.log(`PROBLEM - ${p}`);
      const { entries } = loadSet();
      console.log(problems.length ? `${problems.length} problems` : `every wording of every entry lands exactly once (${entries.length} entries)`);
      process.exitCode = problems.length ? 1 : 0;
    } else if (args.includes('--selftest')) {
      process.exitCode = selftest() ? 1 : 0;
    } else {
      console.log('Use --build <out dir> [--seed N] [--variant K], --score <report> --brief <name> --seed N [--model M] [--tokens N] [--set F] [--no-save], --check or --selftest.');
      process.exitCode = 1;
    }
  } catch (err) {
    console.log(`FAIL - ${err.message}`);
    process.exitCode = 1;
  }
}
