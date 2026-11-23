// Copyright (c) 2026 iECHO, LLC. All rights reserved.
// -----------------------------------------------------------------------------------------------------------------
// The coverage receipt: what a read opened, held against what it was given (pass NQ, EARMARKS L20; docs/INDEPENDENT-CHECKS.md,
// How, item 9: every reader ends its report with the items it opened).
//
// In plain terms: a reader can call a pass clean having never opened the lesson the pass changed most. Since pass NG every brief
// asks the reader to end its report with a list headed "Opened"; this tool reads that list and holds it against what the read was
// given: the items tools/content-snapshot.mjs finds changed between --base and the tree this tool sits in, and the changed lines of
// the source files, or a plain list of items (--list). So it is run in the copy the read was given, with --base the copy the pass
// began from. It prints every changed item the list never names, and every item the list names that does not exist (a misspelled
// id), and exits 1 when it finds either, so the lead sees it.
//
// The form, one item a line under a heading line "Opened" ("Opened", "## Opened", "**Opened**" or "Opened:"), each a bullet, a kind
// and its names; a dash, an en dash, an asterisk, a bullet or a number may lead, spacing and case are free, a range may be written
// 1-12, 1 to 12 or with an en dash, and a size 390x844, 390 by 844 or with a times sign:
//   - file src/logic.mjs 40304-40420          a file and the lines read (ranges with commas; with no range, the whole file)
//   - module what-happens-next                 a module: its lesson and lines, its lesson paintings and its banks
//   - course letters-pk                         a course: everything that is the course's
//   - bank p3-next-guess seeds 1-12             a bank at the seeds read (with no seeds, the bank at seeds unnamed)
//   - story S4189-S4192                         a story's pictures by serial; story <module id>: its words, pictures, coloring page, voices
//   - art D314                                  ledger rows by serial, any prefix (S, P, D, C, CS, L, G, M, U)
//   - wonder w-early-new-way-home               a Wonder question
//   - game dots-kite                            a game, its deck and its welcome
//   - screen lesson what-happens-next 390x844 light   a screen: what it shows, the id, its sizes and its theme (light, dark or both)
//   - test tests/stories.test.mjs               a test run; tool tools/question-pools.mjs, a tool run
//   - item audio:sound-m                        any item of the snapshot by its key, for what no kind above names
// What covers a changed item: its own kind, and a module its banks, lines and paintings, a story its words and pictures, a course
// everything of the course; a changed table of the code that no kind names (a word list, a plan row) is covered by the file's
// changed lines read. A bank named at any seeds covers its questions in --base (the seeds are kept for the record); in --list a bank
// given with seeds must be opened at all of them.
//
// Run, in the copy the read was given: node tools/coverage-receipt.mjs <report> --base <the copy the pass began from> [--scope <course ids>]
//        [--files <paths or folders/>]
//        (about a minute: both copies are snapshotted; --files defaults to the four source files, src/logic.mjs, src/ui.jsx,
//        src/stories.mjs and src/curriculum.mjs; --scope keeps the scope's courses' items and those that belong to no course, and
//        refuses an id no course of either copy has, since round one's code read of pass NQ)
//      node tools/coverage-receipt.mjs <report> --list <a file of the items the read was given, one a line, in the same form>
//      node tools/coverage-receipt.mjs --selftest   (made reports on this tree's own ids; docs-sync runs it in check.sh)
// -----------------------------------------------------------------------------------------------------------------
import { readFileSync, existsSync, readdirSync, statSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { snapshot } from './content-snapshot.mjs';

const HERE = resolve(fileURLToPath(new URL('..', import.meta.url)));
export const KINDS = ['file', 'module', 'course', 'bank', 'story', 'art', 'wonder', 'game', 'screen', 'test', 'tool', 'item'];
export const SOURCE_FILES = ['src/logic.mjs', 'src/ui.jsx', 'src/stories.mjs', 'src/curriculum.mjs'];

// Ranges of numbers in words ("40304-40420", "1 to 12", "3, 5-7"), as [from, to] pairs.
const rangesIn = (s) => [...String(s).matchAll(/(\d+)\s*(?:-|to)\s*(\d+)|(\d+)/g)].map((m) => (m[3] ? [Number(m[3]), Number(m[3])] : [Number(m[1]), Number(m[2])])).map(([a, b]) => [Math.min(a, b), Math.max(a, b)]);
// Ledger serials in words ("S4189-S4192", "S4189 to 4192", "D314"), each as its prefix and number.
const serialsIn = (s) => { const out = []; for (const m of String(s).matchAll(/\b([A-Z]{1,2})(\d+)(?:\s*(?:-|to)\s*(?:[A-Z]{1,2})?(\d+))?/g)) { const a = Number(m[2]); const b = m[3] ? Number(m[3]) : a; for (let n = Math.min(a, b); n <= Math.max(a, b) && n - Math.min(a, b) < 5000; n++) out.push(`${m[1]}${n}`); } return out; };
const inRanges = (n, rs) => rs.some(([a, b]) => n >= a && n <= b);
// How many lines a text has, numbered as an editor and diff number them: the newline that ends a file's last line starts no line of its
// own, and a text with no newline at its end still has its last line (an empty file is one empty line, as an editor shows it). Until pass
// NX both counts below were split('\n').length, one too many for a file ending in a newline, so a report that read a whole file to its
// last line was told it missed a line past the end. Both callers read this one count, and the self-test runs each.
export const linesInText = (text) => { const s = String(text); return s.split('\n').length - (s.endsWith('\n') ? 1 : 0); };

// One line of a list as an item: its kind and what it names, read forgivingly (a dash or a number before it, any spacing and case,
// en and em dashes inside ranges, "by" and the times sign inside sizes).
export function parseItem(raw) {
  const line = String(raw).replace(/[\u2013\u2014]/g, '-').replace(/\u00d7/g, 'x').replace(/(\d)\s*(?:by|x)\s*(\d)/gi, '$1x$2').replace(/`/g, '').trim();
  const words = line.split(/\s+/); const kind = (words[0] || '').toLowerCase(); const rest = words.slice(1).join(' ');
  if (!KINDS.includes(kind)) return { kind: 'unknown', text: line };
  if (kind === 'file' || kind === 'test' || kind === 'tool') { const path = (words[1] || '').replace(/^\.\//, '').replace(/[,;:]$/, ''); return { kind, path, ranges: kind === 'file' ? rangesIn(words.slice(2).join(' ')) : [], text: line }; }
  if (kind === 'bank') { const seedAt = rest.search(/\bseeds?\b/i); return { kind, id: words[1], seeds: seedAt < 0 ? [] : rangesIn(rest.slice(seedAt)), text: line }; }
  if (kind === 'story' || kind === 'art') { const serials = serialsIn(rest); return { kind, serials, ids: serials.length ? [] : rest.split(/[\s,]+/).filter(Boolean), text: line }; }
  if (kind === 'screen') { const sizes = [...rest.matchAll(/\b(\d+x\d+)\b/g)].map((m) => m[1]); const theme = /\bboth\b/i.test(rest) ? 'both' : /\bdark\b/i.test(rest) ? 'dark' : /\blight\b/i.test(rest) ? 'light' : '';
    return { kind, what: (words[1] || '').toLowerCase(), id: words[2] || '', sizes, theme, text: line }; }
  if (kind === 'item') return { kind, key: rest.trim(), text: line };
  return { kind, id: words[1] || '', text: line };
}

// The items a report lists under its last heading line "Opened": every bullet line after it, up to the next heading.
export function openedIn(text) {
  const lines = String(text).split('\n'); let at = -1;
  lines.forEach((l, i) => { if (/^\s*(?:#{1,6}\s*)?(?:\*\*|__)?\s*opened\s*(?:\*\*|__)?\s*:?\s*(?:\([^)]*\))?\s*(?:\*\*|__)?\s*$/i.test(l)) at = i; });
  if (at < 0) return null;
  const items = [];
  for (const l of lines.slice(at + 1)) { if (/^\s*#{1,6}\s/.test(l)) break; const m = /^\s*(?:[-*+\u2022\u2013\u2014]|\d+[.)])\s+(.*)$/.exec(l); if (m) items.push(parseItem(m[1])); }
  return items;
}

// What this tree has, for telling a real id from a misspelled one and for knowing whose a thing is.
export async function treeFacts(root = HERE) {
  const L = await import(pathToFileURL(join(root, 'src/logic.mjs')).href); const S = await import(pathToFileURL(join(root, 'src/stories.mjs')).href);
  const modules = new Map(); const gens = new Map(); const courses = new Map();
  for (const c of L.COURSES) { courses.set(c.id, c.modules.map((m) => m.id)); for (const m of c.modules) { modules.set(m.id, { course: c.id, gens: m.generators || [] }); for (const g of m.generators || []) { if (!gens.has(g)) gens.set(g, new Set()); gens.get(g).add(m.id); } } }
  const wonders = new Map((L.WONDER || []).map((w) => [w.id, w.courseIds || []]));
  const games = new Map((L.GAMES || []).map((g) => [g.id, L.gameCourse ? L.gameCourse(g.id) : null]));
  const art = new Map(); const ledger = join(root, 'docs/ART-REQUESTS.md');
  if (existsSync(ledger)) for (const l of readFileSync(ledger, 'utf8').split('\n')) { const m = /^\| ([A-Z]+)(\d+) \| ([^|]*?) \|/.exec(l); if (m) art.set(`${m[1]}${m[2]}`, { prefix: m[1], owner: m[3].trim().replace(/^lesson-/, '') }); }
  const ui = existsSync(join(root, 'src/ui.jsx')) ? readFileSync(join(root, 'src/ui.jsx'), 'utf8') : '';
  const screens = new Set([...ui.matchAll(/screen === '([a-z][a-z0-9-]*)'/g)].map((m) => m[1]));
  // A file's lines (linesInText, since pass NX), or null for no such file, read once a file.
  const lineCount = new Map(); const linesOf = (f) => { if (!lineCount.has(f)) { const p = join(root, f); lineCount.set(f, existsSync(p) && statSync(p).isFile() ? linesInText(readFileSync(p, 'utf8')) : null); } return lineCount.get(f); };
  const bankExists = (g) => { if (gens.has(g)) return true; try { const q = L.generateQuestion(g, 1); return !!(q && (q.prompt || q.type)); } catch (e) { return false; } };
  const grades = new Map(L.COURSES.map((c) => [c.id, c.grade]));
  return { root, modules, gens, courses, grades, wonders, games, art, screens, stories: S.STORIES || {}, linesOf, bankExists };
}
const courseOf = (facts, id) => (facts.modules.get(id) || {}).course || (facts.courses.has(id) ? id : facts.games.get(id) || null);

// Whether an opened item names something that exists, with the reason when it does not.
export function nothingNamed(item, facts) {
  switch (item.kind) {
    case 'unknown': return `"${item.text}" starts with no kind this form knows (${KINDS.join(', ')})`;
    case 'file': case 'test': case 'tool': { const n = facts.linesOf(item.path); if (n === null) return `${item.kind} ${item.path}: no such file`;
      const past = item.ranges.filter(([, b]) => b > n); return past.length ? `file ${item.path}: lines past its end (${n} lines): ${past.map(([a, b]) => `${a}-${b}`).join(', ')}` : null; }
    case 'module': return facts.modules.has(item.id) ? null : `module ${item.id}: no module has that id`;
    case 'course': return facts.courses.has(item.id) ? null : `course ${item.id}: no course has that id`;
    case 'bank': return facts.bankExists(item.id) ? null : `bank ${item.id}: no bank has that id`;
    case 'wonder': return facts.wonders.has(item.id) ? null : `wonder ${item.id}: no Wonder question has that id`;
    case 'game': return facts.games.has(item.id) ? null : `game ${item.id}: no game has that id`;
    case 'story': case 'art': { if (item.serials.length) { const none = item.serials.filter((s) => !facts.art.has(s)); return none.length ? `${item.kind} ${item.serials[0]}: no ledger row for ${none.slice(0, 4).join(', ')}${none.length > 4 ? ` and ${none.length - 4} more` : ''}` : null; }
      const bad = item.ids.filter((id) => !(facts.stories[id] || facts.courses.has(id))); return !item.ids.length ? `${item.kind}: names no serial and no id` : bad.length ? `story ${bad.join(', ')}: no story has that id` : null; }
    case 'screen': return [facts.modules, facts.gens, facts.wonders, facts.courses, facts.games].some((m) => m.has(item.id)) || facts.screens.has(item.id) ? null : `screen ${item.what} ${item.id}: nothing has that id`;
    default: return null;
  }
}

// What a changed snapshot item needs for an Opened item to cover it: its kind and id, a ledger row's owner, or a table of the code.
export function needOf(key, value = '') {
  const part = key.split(':'); const v = String(value);
  if (/^(question|seeds|places)$/.test(part[0])) return { kind: 'bank', id: part[1] };
  if (part[0] === 'art') { const m = /^\| ([A-Z]+)\d+ \| ([^|]*?) \|/.exec(v); return { kind: 'art', serial: part[1], prefix: m ? m[1] : part[1].replace(/\d+$/, ''), owner: m ? m[2].trim().replace(/^lesson-/, '') : '' }; }
  if (part[0] === 'audio') { const m = /^"([^"]+)","([^"]*)","([^"]*)"/.exec(v); const type = m ? m[2] : ''; const owner = m ? m[3] : ''; const serial = (/^([A-Z]+\d+)-/.exec(part.slice(1).join(':')) || [])[1] || '';
    if (type === 'lesson line') return { kind: 'module', id: owner }; if (/story/.test(type)) return { kind: 'story', id: owner, serial }; if (/^game welcome/.test(type)) return { kind: 'game', id: owner }; return { kind: 'item' }; }
  if (part[0] === 'review') { const k = part[2]; const id = part.slice(3).join(':'); return k === 'module' ? { kind: 'module', id } : k === 'game' ? { kind: 'game', id } : k === 'wonder' ? { kind: 'wonder', id } : { kind: 'story', id }; }
  if (part[0] === 'code') return { kind: 'code' };
  const [table, id] = [part[0], part.slice(1).join(':')];
  if (table === 'logic.MODULES') return { kind: 'module', id };
  if (['logic.COURSES', 'logic.COURSE_GAMES', 'stories.COURSE_GOALS'].includes(table)) return { kind: 'course', id };
  if (['stories.STORIES', 'stories.COLOR_PAGES', 'stories.COURSE_STORIES', 'stories.MASTERY_STORIES'].includes(table)) return { kind: 'story', id };
  if (table === 'logic.WONDER') return { kind: 'wonder', id };
  if (['logic.GAMES', 'logic.DEMO_ROUNDS'].includes(table)) return { kind: 'game', id };
  const src = /^(logic|stories|curriculum)\./.exec(table); if (src) return { kind: 'shared', src: `src/${src[1]}.mjs` };
  return { kind: 'item' };
}

// Whether one opened item covers one need (a changed item's kind and id), by the rules in the header.
function covers(o, need, key, facts) {
  if (o.kind === 'item') return o.key === key;
  if (o.kind === 'course') { const c = o.id; if (need.kind === 'course') return need.id === c; if (need.kind === 'bank') return [...(facts.gens.get(need.id) || [])].some((m) => courseOf(facts, m) === c);
    if (need.kind === 'wonder') return (facts.wonders.get(need.id) || []).includes(c); if (need.kind === 'art') return courseOf(facts, need.owner) === c || need.owner === c; return courseOf(facts, need.id) === c; }
  if (need.kind === 'bank') return (o.kind === 'bank' && o.id === need.id) || (o.kind === 'module' && (facts.gens.get(need.id) || new Set()).has(o.id));
  if (need.kind === 'module') return o.kind === 'module' && o.id === need.id;
  if (need.kind === 'wonder') return o.kind === 'wonder' && o.id === need.id;
  if (need.kind === 'game') return (o.kind === 'game' || (o.kind === 'screen' && o.what === 'game')) && o.id === need.id;
  if (need.kind === 'story') { if (o.kind === 'story' && o.ids.includes(need.id)) return true; if ((o.kind === 'story' || o.kind === 'art') && need.serial && o.serials.includes(need.serial)) return true;
    return o.kind === 'story' && o.serials.some((s) => (facts.art.get(s) || {}).owner === need.id); }
  if (need.kind === 'art') { if ((o.kind === 'art' || o.kind === 'story') && o.serials.includes(need.serial)) return true;
    if (o.kind === 'story' && o.ids.includes(need.owner) && ['S', 'D', 'CS'].includes(need.prefix)) return true; return o.kind === 'module' && o.id === need.owner && ['P', 'L'].includes(need.prefix); }
  return false;
}

// A file's changed lines between two copies, from diff: each hunk's new lines as a range, and a deletion as the line it follows.
export function fileChanges(base, here, files) {
  const out = [];
  for (const f of files) { const a = join(base, f); const b = join(here, f); const inA = existsSync(a); const inB = existsSync(b);
    if (!inA && !inB) continue; if (!inB) { out.push({ file: f, how: 'removed', ranges: [], points: [] }); continue; }
    // A file new since the base is changed on every line it has (linesInText, since pass NX), and none past its end.
    if (!inA) { out.push({ file: f, how: 'added', ranges: [[1, linesInText(readFileSync(b, 'utf8'))]], points: [] }); continue; }
    if (readFileSync(a).equals(readFileSync(b))) continue;
    let text = ''; try { text = execFileSync('diff', ['-U0', a, b], { maxBuffer: 1 << 28 }).toString(); } catch (e) { text = String(e.stdout || ''); }
    const ranges = []; const points = [];
    for (const m of text.matchAll(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/gm)) { const at = Number(m[1]); const n = m[2] === undefined ? 1 : Number(m[2]); if (n === 0) points.push(at); else ranges.push([at, at + n - 1]); }
    out.push({ file: f, how: 'changed', ranges, points });
  }
  return out;
}
// The files a --files list names, each a path or, ending in a slash, every text file under a folder in either copy.
const TEXT = /\.(mjs|js|jsx|md|csv|json|sh|py|txt)$/; const SKIP = /(^|\/)(node_modules|dist|out|art|audio)(\/|$)|^index\.html$|^sw\.js$/;
function filesNamed(list, roots) {
  const out = new Set();
  for (const f of list) { if (!f.endsWith('/')) { out.add(f); continue; }
    for (const r of roots) { const walk = (d) => { const p = join(r, d); if (!existsSync(p)) return; for (const n of readdirSync(p)) { const rel = `${d}${n}`; if (SKIP.test(rel)) continue; if (statSync(join(r, rel)).isDirectory()) walk(`${rel}/`); else if (TEXT.test(n)) out.add(rel); } }; walk(f); } }
  return [...out].sort();
}

// Lines of a file left uncovered by the opened file items: the changed ranges and points minus the ranges read, as ranges.
function linesLeft(change, opened) {
  const reads = opened.filter((o) => o.kind === 'file' && o.path === change.file);
  if (reads.some((o) => !o.ranges.length)) return [];
  const rs = reads.flatMap((o) => o.ranges); const left = [];
  for (const [a, b] of change.ranges) { let start = null; for (let n = a; n <= b + 1; n++) { const open = n <= b && !inRanges(n, rs); if (open && start === null) start = n; if (!open && start !== null) { left.push([start, n - 1]); start = null; } } }
  for (const p of change.points) if (!inRanges(p, rs) && !inRanges(p + 1, rs)) left.push([p, p]);
  return change.how === 'removed' ? (reads.length ? [] : [[0, 0]]) : left;
}
const say = (rs) => rs.map(([a, b]) => (a === b ? `${a}` : `${a}-${b}`)).join(', ');

// The receipt for --base: every changed item no opened item covers, grouped by what would cover it; every changed line left unread;
// and every opened item that names nothing that exists.
export function receipt({ keyed, files, opened, facts }) {
  const missed = new Map(); const shared = new Map();
  for (const { key, value } of keyed) {
    const need = needOf(key, value); if (need.kind === 'code') continue;
    if (need.kind === 'shared') { if (!shared.has(need.src)) shared.set(need.src, []); shared.get(need.src).push(key); continue; }
    if (opened.some((o) => covers(o, need, key, facts))) continue;
    const label = need.kind === 'item' ? `item ${key}` : need.kind === 'art' ? `art ${need.serial}${need.owner ? ` (${need.owner})` : ''}` : `${need.kind} ${need.id}`;
    if (!missed.has(label)) missed.set(label, []); missed.get(label).push(key);
  }
  const lines = files.map((c) => ({ file: c.file, how: c.how, left: linesLeft(c, opened) })).filter((x) => x.left.length);
  // A table of the code that no kind names is covered when its source file's changed lines were all read (or it was named as an item).
  for (const [src, keys] of shared) { const unread = lines.some((x) => x.file === src) || !files.some((c) => c.file === src);
    const left = keys.filter((k) => !opened.some((o) => o.kind === 'item' && o.key === k)); if (unread && left.length) missed.set(`the tables of ${src} that no kind names`, left); }
  const nothing = opened.map((o) => nothingNamed(o, facts)).filter(Boolean);
  return { missed: [...missed].map(([label, keys]) => ({ label, keys })), lines, nothing };
}

// The receipt for --list: every given item no opened item covers, with the part left (a bank's seeds, a file's lines, a screen's sizes).
export function listReceipt({ given, opened, facts }) {
  const missed = [];
  for (const g of given) {
    if (g.kind === 'file') { const n = facts.linesOf(g.path) || 0; const want = g.ranges.length ? g.ranges : [[1, n]]; const left = linesLeft({ file: g.path, how: 'changed', ranges: want, points: [] }, opened); if (left.length) missed.push(`file ${g.path} ${say(left)}`); continue; }
    if (g.kind === 'bank') { const reads = opened.filter((o) => o.kind === 'bank' && o.id === g.id); const byModule = opened.some((o) => (o.kind === 'module' && (facts.gens.get(g.id) || new Set()).has(o.id)) || (o.kind === 'course' && [...(facts.gens.get(g.id) || [])].some((m) => courseOf(facts, m) === o.id)));
      if (!g.seeds.length) { if (!reads.length && !byModule) missed.push(`bank ${g.id}`); continue; }
      const rs = reads.flatMap((o) => o.seeds); const any = reads.some((o) => !o.seeds.length); const left = [];
      for (const [a, b] of g.seeds) { let start = null; for (let n = a; n <= b + 1; n++) { const open = n <= b && !any && !inRanges(n, rs); if (open && start === null) start = n; if (!open && start !== null) { left.push([start, n - 1]); start = null; } } }
      if (left.length) missed.push(`bank ${g.id} seeds ${say(left)}`); continue; }
    if (g.kind === 'screen') { const reads = opened.filter((o) => o.kind === 'screen' && o.what === g.what && o.id === g.id);
      const themes = g.theme === 'both' ? ['light', 'dark'] : g.theme ? [g.theme] : [''];
      const left = (g.sizes.length ? g.sizes : ['']).flatMap((s) => themes.filter((t) => !reads.some((o) => (!s || !o.sizes.length || o.sizes.includes(s)) && (!t || !o.theme || o.theme === 'both' || o.theme === t))).map((t) => `${s} ${t}`.trim()));
      if (left.length) missed.push(`screen ${g.what} ${g.id} ${left.join(', ')}`); continue; }
    if (g.kind === 'test' || g.kind === 'tool') { if (!opened.some((o) => o.kind === g.kind && o.path === g.path)) missed.push(`${g.kind} ${g.path}`); continue; }
    if (g.kind === 'story' || g.kind === 'art') { const need = g.serials.length ? g.serials.map((s) => ({ kind: 'art', serial: s, prefix: s.replace(/\d+$/, ''), owner: (facts.art.get(s) || {}).owner || '' })) : g.ids.map((id) => ({ kind: 'story', id }));
      const left = need.filter((n) => !opened.some((o) => covers(o, n, '', facts))); if (left.length) missed.push(`${g.kind} ${left.map((n) => n.serial || n.id).join(', ')}`); continue; }
    if (g.kind === 'item') { if (!opened.some((o) => o.kind === 'item' && o.key === g.key)) missed.push(`item ${g.key}`); continue; }
    if (g.kind === 'unknown') { missed.push(`"${g.text}" (a given item of no kind this form knows)`); continue; }
    if (!opened.some((o) => covers(o, { kind: g.kind, id: g.id }, '', facts))) missed.push(`${g.kind} ${g.id}`);
  }
  return { missed, nothing: opened.map((o) => nothingNamed(o, facts)).filter(Boolean) };
}

// The --scope ids no course has, in this tree or in the base (a course a pass took out is still the base's): a misspelled id keeps no
// course's items, so the receipt could print that every changed item was opened (round one's code read of pass NQ). It is refused.
export const unknownScope = (scope, courseIds) => scope.filter((id) => !courseIds.has(id));
export async function courseIdsOf(root) { const L = await import(pathToFileURL(join(root, 'src/logic.mjs')).href); return new Set(L.COURSES.map((c) => c.id)); }

// What changed between the base and this tree: every keyed item whose value differs (the comparison tools/content-diff.mjs prints,
// from tools/content-snapshot.mjs's snapshot of each copy), kept to the scope's courses and those of no course, and the files' lines.
// A scope that names no course of either copy is refused before either copy is read.
export async function changedSince(base, { scope = [], files = SOURCE_FILES } = {}) {
  if (scope.length) { const ids = new Set([...(await courseIdsOf(resolve(base))), ...(await courseIdsOf(HERE))]); const bad = unknownScope(scope, ids);
    if (bad.length) throw new Error(`--scope names ${bad.join(', ')}, which no course of this tree or of the base has (a misspelled id would keep no course's items)`); }
  const A = await snapshot(resolve(base)); const B = await snapshot(HERE);
  const keys = [...new Set([...Object.keys(A.items), ...Object.keys(B.items)])].filter((k) => A.items[k] !== B.items[k]);
  const inScope = (k) => { if (!scope.length) return true; const cs = (B.scope[k] || A.scope[k] || '').split(',').filter(Boolean); return !cs.length || cs.some((c) => scope.includes(c)); };
  const keyed = keys.filter(inScope).map((key) => ({ key, value: key in B.items ? B.items[key] : A.items[key] }));
  return { keyed, files: fileChanges(resolve(base), HERE, filesNamed(files, [resolve(base), HERE])), total: keys.length };
}

// The self-test: made reports on this tree's own ids (a pre-K module with two banks and a story, its story's first and last serial, a
// Wonder question), held against made changes and a made list, so it needs no second copy and no snapshot. Each case names what it
// expects: a report that opened everything misses nothing; one that skipped a Wonder question and part of a file names both; one
// with a misspelled module names it and the module's items it then missed; in --list, a bank opened at half its seeds, a screen
// in one theme of two, and a misspelled test; since round one's code read of pass NQ, a misspelled --scope id, refused; and since pass NX
// a file's lines counted as an editor numbers them, in this tool's own file (treeFacts) and in two made files new since a made base, one
// ending in a newline and one not (fileChanges, in the system's temp folder, removed after).
export async function selfTest() {
  const facts = await treeFacts(HERE); const cases = [];
  const m = [...facts.modules].find(([id, x]) => ['PK3', 'PK4'].includes(facts.grades.get(x.course)) && x.gens.length >= 2 && [...facts.art.values()].some((a) => a.prefix === 'S' && a.owner === id));
  if (!m) return [{ name: 'the self-test finds a pre-K module with two banks and a story in this tree', ok: false, detail: 'none found' }];
  // The module's first story picture and the pictures that follow it in a row, so the made range names only rows that exist.
  const [mid, { gens: [b1, b2] }] = m; const first = Number([...facts.art].find(([, a]) => a.prefix === 'S' && a.owner === mid)[0].slice(1));
  const serials = []; for (let n = first; facts.art.has(`S${n}`) && facts.art.get(`S${n}`).owner === mid; n++) serials.push(`S${n}`); const range = `${serials[0]}-${serials[serials.length - 1]}`;
  const w = [...facts.wonders.keys()][0];
  const keyed = [{ key: `logic.MODULES:${mid}`, value: '' }, { key: `question:${b1}:q`, value: '' }, { key: `seeds:${b2}`, value: '' }, { key: `stories.STORIES:${mid}`, value: '' }, { key: `art:${serials[0]}`, value: `| ${serials[0]} | ${mid} | x |` }, { key: `logic.WONDER:${w}`, value: '' }];
  const files = [{ file: 'src/logic.mjs', how: 'changed', ranges: [[100, 110]], points: [] }];
  const report = (lines) => `Findings above.\n\n**Opened**\n${lines.map((l, i) => (i % 2 ? `\u2013 ${l}` : `- ${l}`)).join('\n')}\n`;
  const all = [`module ${mid}`, `story ${range.replace('-', ' to ')}`, `wonder ${w}`, 'file src/logic.mjs 90\u2013120'];
  const r1 = receipt({ keyed, files, opened: openedIn(report(all)), facts });
  cases.push({ name: 'a report that opened everything misses nothing and names nothing that does not exist', ok: r1.missed.length === 0 && r1.lines.length === 0 && r1.nothing.length === 0, detail: JSON.stringify(r1) });
  const r2 = receipt({ keyed, files, opened: openedIn(report([`module ${mid}`, `story ${range}`, 'file src/logic.mjs 100-105'])), facts });
  cases.push({ name: 'a report that skipped the Wonder question and read part of a file names both', ok: r2.missed.length === 1 && r2.missed[0].label === `wonder ${w}` && r2.lines.length === 1 && say(r2.lines[0].left) === '106-110' && r2.nothing.length === 0, detail: JSON.stringify(r2) });
  const r3 = receipt({ keyed, files, opened: openedIn(report([`module ${mid}x`, `story ${range}`, `wonder ${w}`, 'file src/logic.mjs'])), facts });
  cases.push({ name: 'a report with a misspelled module id names it, and the module and its banks it then missed', ok: r3.nothing.length === 1 && r3.nothing[0].startsWith(`module ${mid}x`) && ['module', 'bank'].every((k) => r3.missed.some((x) => x.label.startsWith(k + ' '))), detail: JSON.stringify(r3) });
  const given = [`module ${mid}`, `bank ${b1} seeds 1-12`, `story ${range}`, `wonder ${w}`, `screen lesson ${mid} 390x844 both`, 'test tests/stories.test.mjs'].map(parseItem);
  const l1 = listReceipt({ given, opened: openedIn(report([`module ${mid}`, `bank ${b1} seeds 1 to 12`, `story ${range}`, `wonder ${w}`, `screen lesson ${mid} 390 by 844 both themes`, 'test tests/stories.test.mjs'])), facts });
  cases.push({ name: 'in --list, a report that opened every given item misses nothing (seeds written 1 to 12, the size 390 by 844, both themes)', ok: l1.missed.length === 0 && l1.nothing.length === 0, detail: JSON.stringify(l1) });
  const l2 = listReceipt({ given, opened: openedIn(report([`module ${mid}`, `bank ${b1} seeds 1-6`, `story ${range}`, `wonder ${w}`, `screen lesson ${mid} 390x844 light`, 'test tests/storys.test.mjs'])), facts });
  cases.push({ name: 'in --list, a bank opened at half its seeds, a screen in one theme of two and a misspelled test are each named', ok: l2.missed.includes(`bank ${b1} seeds 7-12`) && l2.missed.includes(`screen lesson ${mid} 390x844 dark`) && l2.missed.includes('test tests/stories.test.mjs') && l2.nothing.length === 1 && l2.nothing[0].startsWith('test tests/storys.test.mjs'), detail: JSON.stringify(l2) });
  cases.push({ name: 'a report with no heading line "Opened" is read as having opened nothing', ok: openedIn('Findings, and no list.') === null, detail: '' });
  // A --scope id no course has is refused (round one's code read of pass NQ): named among real ones, and refused by changedSince before
  // either copy is read (this tree as its own base, so nothing is snapshotted when the refusal works).
  const course = facts.modules.get(mid).course; const ids = new Set(facts.courses.keys());
  let refused = ''; try { await changedSince(HERE, { scope: [course, `${course}x`] }); } catch (e) { refused = e.message; }
  cases.push({ name: 'a --scope id no course has is named and refused before either copy is read, and a real one is kept', ok: unknownScope([course, `${course}x`], ids).join() === `${course}x` && unknownScope([course], ids).length === 0 && refused.includes(`--scope names ${course}x,`), detail: refused || 'not refused' });
  // Since pass NX, treeFacts' count of a file's lines, read on this tool's own file, which ends in a newline, so its last line is the one
  // its last newline ends: in --list a report that read it from line 1 to that line, given by name alone, misses nothing, and a read one
  // line past its end is named as past it (split('\n') had counted one line more, after the last newline).
  { const own = 'tools/coverage-receipt.mjs'; const text = readFileSync(join(HERE, own), 'utf8'); const last = (text.match(/\n/g) || []).length;
    const whole = listReceipt({ given: [parseItem(`file ${own}`)], opened: openedIn(report([`file ${own} 1-${last}`])), facts });
    const past = nothingNamed(parseItem(`file ${own} 1-${last + 1}`), facts);
    cases.push({ name: "a file's lines are counted as an editor numbers them: in --list a report that read this tool's own file to its last line misses nothing, and a read one line past its end is named (pass NX)",
      ok: text.endsWith('\n') && last > 100 && facts.linesOf(own) === last && whole.missed.length === 0 && whole.nothing.length === 0 && String(past).includes(`lines past its end (${last} lines): 1-${last + 1}`),
      detail: JSON.stringify({ last, counted: facts.linesOf(own), whole, past }) }); }
  // And fileChanges' count of a file new since --base, on two made copies in the system's temp folder, the base with neither file and the
  // copy with two of three lines each, one ending in a newline and one not: each is changed on lines 1 to 3 and on none past them, a report
  // that read both to line 3 leaves no line unread, and one that read the first only to line 2 is told it missed line 3.
  { const root = mkdtempSync(join(tmpdir(), 'receipt-selftest-')); let r = null;
    try { const base = join(root, 'base'); const copy = join(root, 'copy'); mkdirSync(base); mkdirSync(copy);
      writeFileSync(join(copy, 'ends.txt'), 'one\ntwo\nthree\n'); writeFileSync(join(copy, 'open.txt'), 'one\ntwo\nthree');
      const ch = fileChanges(base, copy, ['ends.txt', 'open.txt']); const range = (f) => JSON.stringify((ch.find((c) => c.file === f && c.how === 'added') || {}).ranges);
      const all = receipt({ keyed: [], files: ch, opened: openedIn(report(['file ends.txt 1-3', 'file open.txt 1-3'])), facts });
      const short = receipt({ keyed: [], files: ch, opened: openedIn(report(['file ends.txt 1-2', 'file open.txt 1-3'])), facts });
      r = { ends: range('ends.txt'), open: range('open.txt'), all: all.lines, short: short.lines };
    } finally { rmSync(root, { recursive: true, force: true }); }
    cases.push({ name: 'a file new since --base is changed on each line it has and on none past its end, ending in a newline or not: a report that read both made files to line 3 leaves no line unread, and one that read the first to line 2 misses line 3 (pass NX)',
      ok: !!r && r.ends === '[[1,3]]' && r.open === '[[1,3]]' && r.all.length === 0 && r.short.length === 1 && r.short[0].file === 'ends.txt' && say(r.short[0].left) === '3',
      detail: JSON.stringify(r) }); }
  return cases;
}

// Run alone: the self-test, a --list receipt, or a --base receipt. Only when this is the file being run.
if (process.argv[1] && process.argv[1].endsWith('coverage-receipt.mjs')) {
  const args = process.argv.slice(2); const option = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
  const reportFile = args.find((a, i) => !a.startsWith('--') && !['--base', '--list', '--scope', '--files'].includes(args[i - 1]));
  if (args.includes('--selftest')) {
    const cases = await selfTest(); for (const c of cases) console.log(`${c.ok ? 'PASS' : 'FAIL'} - ${c.name}${c.ok ? '' : '  ' + c.detail.slice(0, 600)}`);
    const bad = cases.filter((c) => !c.ok).length; console.log(`\n${cases.length - bad} passed, ${bad} failed`); process.exitCode = bad ? 1 : 0;
  } else if (!reportFile || (!option('--base') && !option('--list'))) {
    console.log('usage: node tools/coverage-receipt.mjs <report> --base <copy> [--scope id,id] [--files paths,folders/] | <report> --list <items file> | --selftest'); process.exitCode = 1;
  } else {
    const opened = openedIn(readFileSync(reportFile, 'utf8')); const facts = await treeFacts(HERE);
    if (!opened) { console.log(`${reportFile} has no heading line "Opened": the read listed nothing it opened (INDEPENDENT-CHECKS, How, item 9)`); process.exitCode = 1; } else if (option('--list')) {
      const given = openedIn(`Opened\n${readFileSync(option('--list'), 'utf8').split('\n').filter((l) => l.trim()).map((l) => (/^\s*(?:[-*+\u2022\u2013\u2014]|\d+[.)])\s/.test(l) ? l : `- ${l}`)).join('\n')}`);
      const r = listReceipt({ given, opened, facts });
      console.log(`The coverage receipt for ${reportFile} against the list ${option('--list')}: ${given.length} item${given.length === 1 ? '' : 's'} given, ${opened.length} opened.`);
      for (const x of r.missed) console.log(`MISSED - ${x}`); for (const x of r.nothing) console.log(`NAMES NOTHING - ${x}`);
      const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`; console.log(r.missed.length || r.nothing.length ? `${plural(r.missed.length, 'given item')} missed, ${plural(r.nothing.length, 'opened item')} naming nothing` : 'Every given item was opened, and every opened item exists.'); process.exitCode = r.missed.length || r.nothing.length ? 1 : 0;
    } else {
      const scope = (option('--scope') || '').split(',').filter(Boolean); const files = option('--files') ? option('--files').split(',').filter(Boolean) : SOURCE_FILES;
      let ch = null; try { ch = await changedSince(option('--base'), { scope, files }); } catch (e) { console.log(`not run: ${e.message}`); process.exitCode = 1; }
      if (ch) { const r = receipt({ keyed: ch.keyed, files: ch.files, opened, facts });
      const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
      console.log(`The coverage receipt for ${reportFile} against ${option('--base')}${scope.length ? ` (scope ${scope.join(', ')})` : ''}: ${plural(ch.keyed.length, 'changed item')}${scope.length ? ` of ${ch.total}` : ''}, ${plural(ch.files.length, 'changed file')} of ${files.join(', ')}; ${plural(opened.length, 'item')} opened.`);
      for (const x of r.missed) console.log(`MISSED - ${x.label}: ${x.keys.length} changed item${x.keys.length === 1 ? '' : 's'} (${x.keys.slice(0, 3).join('; ')}${x.keys.length > 3 ? '; ...' : ''})`);
      for (const x of r.lines) console.log(`MISSED - file ${x.file}${x.how === 'removed' ? ' (removed)' : ''} lines ${say(x.left)}`);
      for (const x of r.nothing) console.log(`NAMES NOTHING - ${x}`);
      const n = r.missed.length + r.lines.length; console.log(n || r.nothing.length ? `${plural(n, 'changed item or file')} missed, ${plural(r.nothing.length, 'opened item')} naming nothing` : 'Every changed item was opened, and every opened item exists.'); process.exitCode = n || r.nothing.length ? 1 : 0; }
    }
  }
}
