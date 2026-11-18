// Copyright (c) 2026 iECHO, LLC. All rights reserved.
// -----------------------------------------------------------------------------------------------------------------
// The guard against a fix made by weakening (pass NQ, EARMARKS L20, Mikey's answer to Q113, "Q113 - A").
//
// In plain terms: a failing check can be made to pass by asking less of it, a floor lowered to the count a broken page now gives,
// a wait added for the line that fails, a time limit raised past a step that hangs, a test left with fewer checks. Each can be
// right, and each must then be said. This test reads every such value in the tree and compares it with the baseline the last pass
// left (tests/fixtures/floor-baseline.json): a value that moved the lenient way fails unless the newest DECISIONS entry's Loosened
// bullet names it with its new value (its form is below). A value that moved the strict way, or a new one, passes and is reported;
// a value gone is reported, and fails unless the bullet names it.
//
// What it reads, and which way is lenient:
//   1. Named values, by their family's name, in tests/, tests/e2e/, tools/ and src/ (this file aside): FLOORS and every *_FLOOR or
//      *_FLOORS (a floor lowered); every *_LIMIT (a limit raised); every *_WAITS, *_WAITING or WAITING (a member added, or a count
//      under one raised); KEPT and every *_KEPT, KEPT_* or *_EXCEPTIONS (a member added). Three lists hold the cases a check runs,
//      not exceptions to it, so for them a member removed is the lenient way (CASES, below); tests/e2e/cue-words.mjs reads a floor
//      of 0 as a ceiling (its zeroOr), so in a file that does, a 0 raised is lenient too; one generator rule is left out (LEFT_OUT).
//      A value built by code cannot be read as data and is reported: OLDER_KEPT, and since round one's code read of pass NQ a value
//      that anything continues after it, as a number followed by arithmetic (const X_FLOOR = 694 - 10 was read as 694); a value that
//      becomes one is gone from the tree. A name defined twice in one file is told apart by the label of the next check after it.
//   2. Counts pinned in a browser test (tests/e2e, tests/site.test.mjs, tools/layout-sweep.mjs), since round one's code read of pass NQ
//      read only at the top level of a check's condition, the second argument of an ok( call, where a number is what the check asks:
//      a name's .length or .size compared ===, >= or > with a number (question-screens' PRINT_PAIRS.length === 15); any name compared
//      >= or > with a number (a floor at a check's top level, whatever it measures, so lowering it lets more pass: heldFor >= 2100,
//      plantPalette >= 1); and a plain name compared === with a number when the name is a count by its making, set to 0 by let and
//      raised by ++ or +=, or taken from a .length or .size (question-screens' screens === 33, sizeReads === 4 and combos === 4). Each
//      is at least 1 once > is read as the next number up, and lowering it is lenient. They are grouped by file, by the name and by
//      === or at least, and compared as a set, so a check moved or a new one passes, === 15 made >= 15 is seen, and a group renamed
//      with every number kept is read as the same group.
//   3. check.sh's time limits, by each step's name in run (a limit raised); and each limit against the one docs/CHECK-TIMES.md's
//      newest run recorded for its step, so a raised limit carries its cause (L20's step times).
//   4. Each step's count of checks, from its newest passing run in docs/CHECK-TIMES.md (a count fallen). A failed or stopped step's
//      count is not its count of checks, so the newest run in which the step passed is read.
// Not read, each named so a later pass can choose it: a check of none loosened to a few (bad.length === 0 made <= 2) and every ceiling
// (<, <=); a count compared outside an ok( condition, as a check worked out into a const first (game-intro's really) or control flow
// (if (lines.length > 1), which the reading before round one's code read took as pins); a comparison inside a callback in a condition
// (a per-item predicate, where a lower number can be the stricter way) or under a !; a number in arithmetic, on the left, or with a
// decimal point (ringPeak > 0.5); a plain name compared === that is not a count by its making (an exact state, as play-and-read's
// at360 === 2, its covers two to a row at 360 pixels, where a lower number is another layout and not a looser check); and the light
// tests' own inline numbers.
//
// The form DECISIONS names a value in, since round one's code read of pass NQ: one bullet of the newest entry (the "## " entry nearest
// the end of docs/DECISIONS.md before "## Open items"), and no other line of it, a bullet that starts "- **Loosened.**" and names each
// value the pass moved the lenient way with its reason, one value an item, the items parted by semicolons (a semicolon inside
// parentheses parts nothing) or written as sub-bullets under it, word for word in this shape:
//   - **Loosened.** tile-edges FLOORS.drawings 694 to 690 (the reason); question-screens PRINT_PAIRS.length 15 to 14 (the reason);
//     FOLD_WAITS gains 'p3-new-lesson 3' (the reason); the question screens' limit 4,000 to 4,400 seconds (the reason); the stories
//     step's count 6,939 to 6,930 (the reason).
// A pass that loosened nothing writes no such bullet, or "- **Loosened.** None.", and the entry holds one such bullet at most (two fail).
// Each item holds the value's name and its new value as a number; a value gone, its name alone. The name: a named value's constant and
// path (FLOORS.drawings; FLOORS.screens['light 320 by 568'] or FLOORS.screens.light 320 by 568), with the file's short name (tile-edges,
// logic.test, src/logic) where another file has a value of that name; a pinned count's file short name and the name counted
// (question-screens PRINT_PAIRS.length, question-screens screens); a list member's list and the member (FOLD_WAITS and 'p3-new-lesson 3');
// a limit's step name in check.sh's run ("the question screens"); a step's count, its name as check.sh echoes it without its number
// ("lesson lines and pictures", "stories") or its name in run. Case, quotes, backticks and brackets are read past, and a number written
// with commas is read as one number. No other line of the entry names a value: every entry's "- **check.sh.**" bullet lists each step's
// count ("the stories 6,939, the click-through 366"), so a line that holds a value's name and its new number elsewhere would name a
// fallen count by the bullet that reports it, and --write would put it into the baseline (round one's code read of pass NQ).
//
// How a pass's end works: check.sh's final run writes its record to docs/CHECK-TIMES.md after its verdict (CHECK_TIMES_FILE set to the
// tree's own file), when this test has already run inside it, so inside check.sh this test reads the run before for the step counts. Then:
//   (1) node tests/floor-guard.test.mjs, run once alone, reads the final run's counts (a fallen count named in the Loosened bullet, or fixed);
//   (2) once DECISIONS is written and (1) passes, node tests/floor-guard.test.mjs --write sets the baseline for the next pass from the tree
//       as delivered. It refuses while a lenient move has no item in the bullet, or the entry has two bullets, so a loosening is never
//       written into the baseline; and it refuses where there is no readable baseline to compare with, unless --first is given.
// A run of check.sh mid-pass, before the pass's DECISIONS entry exists, reads the last pass's entry as the newest, so on a tree with an
// honest loosening it fails step 3d: the FAIL line names each value with its old and new value and its direction (every one of them, since
// pass NQ's F4; until then only the first twelve), the list the lead keeps in the round's notes and writes into the pass's Loosened bullet
// at its end. check.sh's log keeps only the step's last line (its "N passed, M failed"), so the lead runs the guard alone (node
// tests/floor-guard.test.mjs) to read the list. That failure is read as the docs sync test's failures on
// records not yet written are read, expected and named, and a value the lead did not mean to loosen is put back instead; the guard has no
// flag to skip it, and nothing else in the run depends on it.
// When this file's reading changes (a new kind read, a key's form changed), the baseline is written again from the last delivered tree,
// never from the tree in progress, so the pass's own loosenings stay visible: in a copy of the last delivered tree with this file put in
// it, delete tests/fixtures/floor-baseline.json, run node tests/floor-guard.test.mjs --write --first, and copy the baseline into the tree
// (round one's code read of pass NQ did so, from pass NP's delivery with docs/CHECK-TIMES.md seeded). --first writes only where there is
// no readable baseline.
//
// It proves itself on every run, each plant in a temporary copy of the files it changes, never the real tree: a floor lowered with no
// line (fails) and with its item in the Loosened bullet (passes), a floor raised (passes with no line), a wait added, a pinned .length
// lowered, a pinned plain count lowered and a floor written as arithmetic (each fails), a limit raised with no line (fails twice: against
// the baseline and against CHECK-TIMES' newest run), with its item (passes) and with a line outside the bullet beside a bullet naming
// something else (fails twice), a step's count fallen with no line and with a check.sh bullet that reports the fallen count (each fails),
// two Loosened bullets (fail), a made read with a kind dropped (the first check fails), and each case of --write's choice.
// -----------------------------------------------------------------------------------------------------------------
import { readFileSync, writeFileSync, readdirSync, statSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { parseTimes, countOf } from '../tools/check-times.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const BASELINE = join(ROOT, 'tests/fixtures/floor-baseline.json');
const SELF = 'tests/floor-guard.test.mjs';
let passed = 0; let failed = 0;
const ok = (name, cond, info) => { if (cond) { passed++; console.log('PASS - ' + name); } else { failed++; console.log('FAIL - ' + name + (info ? '  ' + info : '')); } };
const note = (line) => console.log('NOTE - ' + line);

// Which way a named value is lenient, by its family's name (1 above).
const familyOf = (name) => (/(^|_)FLOORS?$/.test(name) ? 'floor' : /_LIMIT$/.test(name) ? 'limit' : /(^|_)(WAITS|WAITING)$/.test(name) ? 'waits' : /^KEPT$|(^|_)KEPT(_|$)|_EXCEPTIONS$/.test(name) ? 'kept' : null);
// Lists whose members are the cases a check runs, each read from its code: for them a member removed is the lenient way.
const CASES = [
  { file: 'tests/logic.test.mjs', name: 'KEPT', anchor: "the tidy step's verb line", why: "the sentences the tidy step's verb line must keep as they are, each a case the check runs" },
  { file: 'tests/e2e/question-screens.mjs', name: 'STORIES_KEPT', anchor: '', why: 'the stories whose runs must stay kept whole, each opened at three widths' },
  { file: 'tests/e2e/question-screens.mjs', name: 'REASONS_KEPT', anchor: '', why: 'the reasons whose runs must stay kept whole' },
];
// A name of a family's shape that is no check's leniency.
const LEFT_OUT = [{ file: 'src/logic.mjs', name: 'SP_JOINS_KEPT_APART', why: "a generator's rule (no missing space between two words that run together into a word), not an exception to a check" }];

// The files read: every script under tests, tools and src for named values (the browser tests' pictures and pages aside), and the
// browser tests for pinned counts.
const walk = (dir, out = []) => { for (const f of readdirSync(join(ROOT, dir))) { const rel = `${dir}/${f}`; if (/^tests\/e2e\/(out|art)$|node_modules/.test(rel)) continue;
  if (statSync(join(ROOT, rel)).isDirectory()) walk(rel, out); else if (/\.(mjs|jsx)$/.test(f)) out.push(rel); } return out; };
const namedFiles = () => [...walk('tests'), ...walk('tools'), ...walk('src')].filter((f) => f !== SELF);
const browserFiles = () => [...walk('tests/e2e'), 'tests/site.test.mjs', 'tools/layout-sweep.mjs'];
const tokenOf = (rel) => rel.replace(/^tests\/e2e\//, '').replace(/^tests\//, '').replace(/^tools\//, '').replace(/\.(mjs|jsx)$/, '');

// The code with every comment, string and regular expression blanked to spaces (newlines kept), so a search finds code alone and a
// bracket inside a string never counts; offsets stay the same, so a literal is cut from the real text at the place found. A slash
// starts a regular expression after an operator, an opening bracket or punctuation, or after a word such as return or typeof.
const BEFORE_REGEX = new Set(['return', 'typeof', 'case', 'do', 'else', 'in', 'of', 'yield', 'await', 'void', 'delete', 'new', 'throw']);
function blank(text) {
  const out = text.split(''); const n = text.length; let prev = '';
  const fill = (a, b) => { for (let k = a; k < b && k < n; k++) if (out[k] !== '\n') out[k] = ' '; };
  const wordBefore = (i) => { let k = i - 1; while (k >= 0 && /\s/.test(text[k])) k--; let s = k; while (s >= 0 && /[A-Za-z_$]/.test(text[s])) s--; return text.slice(s + 1, k + 1); };
  for (let i = 0; i < n;) {
    const c = text[i];
    if (c === '/' && text[i + 1] === '/') { const e = text.indexOf('\n', i); const end = e < 0 ? n : e; fill(i, end); i = end; continue; }
    if (c === '/' && text[i + 1] === '*') { const e = text.indexOf('*/', i + 2); const end = e < 0 ? n : e + 2; fill(i, end); i = end; continue; }
    if (c === "'" || c === '"') { let j = i + 1; while (j < n && text[j] !== c && text[j] !== '\n') j += text[j] === '\\' ? 2 : 1; fill(i + 1, j); i = j + 1; prev = c; continue; }
    if (c === '`') { let j = i + 1; let depth = 0; while (j < n) { if (text[j] === '\\') { j += 2; continue; } if (depth === 0 && text[j] === '`') break; if (text[j] === '$' && text[j + 1] === '{') { depth++; j += 2; continue; } if (depth > 0 && text[j] === '}') depth--; j++; }
      fill(i + 1, j); i = j + 1; prev = '`'; continue; }
    if (c === '/' && (prev === '' || /[(,=:[!&|?{};+\-*%<>~^]/.test(prev) || (/[A-Za-z]/.test(prev) && BEFORE_REGEX.has(wordBefore(i))))) { let j = i + 1; let cls = false; while (j < n && text[j] !== '\n') { if (text[j] === '\\') { j += 2; continue; } if (text[j] === '[') cls = true; else if (text[j] === ']') cls = false; else if (text[j] === '/' && !cls) break; j++; }
      fill(i + 1, j); i = j + 1; while (/[a-z]/.test(text[i] || '')) i++; prev = '/'; continue; }
    if (!/\s/.test(c)) prev = c;
    i++;
  }
  return out.join('');
}
// The blanked code of each text read, kept by the text itself, since the plants read the tree again with one file changed and the rest
// the same (src/logic.mjs alone is about five megabytes).
const blanked = new Map();
const blankOf = (text) => { let code = blanked.get(text); if (code === undefined) { code = blank(text); blanked.set(text, code); } return code; };
// Where a bracket that opens at i closes, in blanked code.
const closing = (code, i) => { let depth = 0; for (let k = i; k < code.length; k++) { if ('([{'.includes(code[k])) depth++; else if (')]}'.includes(code[k])) { depth--; if (depth === 0) return k + 1; } } return code.length; };
// One sandbox to read data literals in: only Set is known, so anything else a literal names throws.
const sandbox = vm.createContext({ Set });

// A literal written as data (numbers, strings, lists, tables and new Set), read from the real text at the place the blanked code
// shows it; a value built by code (it names another value, spreads one, calls anything but a list's own map, or anything continues
// after it, as arithmetic, a call or a member, since round one's code read of pass NQ) is null, reported.
const CONTINUES = /[-+*\/%&|^<>=!?.([`]/;
function literalAt(code, text, i) {
  while (/\s/.test(code[i] || '')) i++;
  let end;
  if (code.startsWith('new Set(', i)) end = closing(code, i + 7);
  else if (code[i] === '[' || code[i] === '{') end = closing(code, i);
  else { const m = /^-?\d[\d_]*(?:\.\d+)?/.exec(code.slice(i, i + 40)); if (!m) return null; end = i + m[0].length; }
  let after = end; const map = code[i] === '[' ? /^\s*\.map\(/.exec(code.slice(end, end + 40)) : null; if (map) after = closing(code, end + map[0].length - 1);
  const next = (/\S/.exec(code.slice(after, after + 200)) || [''])[0];
  if (next && CONTINUES.test(next)) return null;
  const inner = code.slice(i, end);
  if (/\.\.\./.test(inner)) return null;
  for (const m of inner.matchAll(/[A-Za-z_$][\w$]*/g)) { const w = m[0]; const nx = inner.slice(m.index + w.length).match(/^\s*(\S)/);
    if (['new', 'Set', 'true', 'false', 'null', 'undefined'].includes(w) || (nx && nx[1] === ':')) continue; return null; }
  try { return { value: vm.runInContext('(' + text.slice(i, end) + ')', sandbox, { timeout: 1000 }) }; } catch (e) { return null; }
}
// The label of the next check after a place in a file: the words of its first argument up to any ${, to tell apart two values of one name.
function anchorAfter(code, text, at) {
  const m = /\bok\(\s*/g; m.lastIndex = at; const hit = m.exec(code); if (!hit || hit.index - at > 6000) return '';
  const q = hit.index + hit[0].length; const quote = text[q]; if (!['"', "'", '`'].includes(quote)) return '';
  let s = ''; for (let k = q + 1; k < text.length && s.length < 60; k++) { if (text[k] === quote || (text[k] === '$' && text[k + 1] === '{')) break; s += text[k]; }
  return s.replace(/[^A-Za-z0-9 ',-]/g, ' ').replace(/\s+/g, ' ').trim();   // no dot or colon, which divide a value's key
}
// A name defined twice in one file is told apart by the label of the check after it; when that label is reworded, the value keeps its
// place: a value of the baseline missing from the tree takes the tree's unclaimed one of the same file and name, the one with the most
// members in common (or the only one), so a reworded label is no value gone and a member added under it is still caught.
const headOf = (key) => (/^(.+?::[A-Z][A-Z0-9_]*@[^.:]*)/.exec(key) || [])[1] || null;
function rekey(baseline, values) {
  const group = (list) => { const g = new Map(); for (const e of list) { const h = headOf(e.key); if (!h) continue; if (!g.has(h)) g.set(h, []); g.get(h).push(e); } return g; };
  const base = group(baseline); const tree = group(values); const nameOf = (h) => h.slice(0, h.indexOf('@')); const rename = new Map();
  for (const [h, es] of base) {
    if (tree.has(h)) continue;
    const spare = [...tree.keys()].filter((x) => !base.has(x) && !rename.has(x) && nameOf(x) === nameOf(h)); if (!spare.length) continue;
    const ids = new Set(es.map((e) => e.key.slice(h.length)));
    const best = spare.map((x) => [x, tree.get(x).filter((e) => ids.has(e.key.slice(x.length))).length]).sort((a, b) => b[1] - a[1])[0];
    if (spare.length === 1 || best[1] > 1) rename.set(best[0], h);
  }
  return values.map((e) => { const h = headOf(e.key); return h && rename.has(h) ? { ...e, key: rename.get(h) + e.key.slice(h.length) } : e; });
}
// A pinned group renamed with every number kept (a variable given a better name): a group of the baseline missing from the tree takes
// the tree's new group of the same file and the same === or at least whose numbers are the same, and the rename is reported.
function repin(baseline, values) {
  const baseKeys = new Set(baseline.map((e) => e.key)); const treeKeys = new Set(values.map((e) => e.key)); const claimed = new Map(); const renamed = [];
  const same = (a, b) => a.length === b.length && a.every((x, k) => x === b[k]);
  for (const b of baseline.filter((e) => e.kind === 'pinned' && !treeKeys.has(e.key))) {
    const t = values.find((e) => e.kind === 'pinned' && !baseKeys.has(e.key) && !claimed.has(e.key) && e.file === b.file && e.op === b.op && same(e.values, b.values));
    if (t) { claimed.set(t.key, b.key); renamed.push(`${b.name} (${b.op}) in ${b.file}, now ${t.name}, its numbers kept (${b.values.join(', ')})`); }
  }
  return { values: values.map((e) => (claimed.has(e.key) ? { ...e, key: claimed.get(e.key) } : e)), renamed };
}

// Every named value in one file, flattened to entries: a number with the way it is lenient, a list, or a list's member.
function namedIn(rel, text, push, computed) {
  const code = blankOf(text); const found = [];
  for (const m of code.matchAll(/\b(?:const|let|var)\s+([A-Z][A-Z0-9_]*)\s*=\s*/g)) { const family = familyOf(m[1]); if (!family) continue;
    if (LEFT_OUT.some((x) => x.file === rel && x.name === m[1])) continue; found.push({ name: m[1], family, at: m.index + m[0].length }); }
  const zeroCeiling = /\bconst zeroOr\b/.test(code);
  for (const f of found) {
    const twice = found.filter((x) => x.name === f.name).length > 1; const anchor = twice ? anchorAfter(code, text, f.at) : '';
    const base = twice ? `${f.name}@${anchor}` : f.name;
    const lit = literalAt(code, text, f.at);
    if (!lit) { computed.push(`${rel} ${f.name}`); continue; }
    const cases = CASES.find((x) => x.file === rel && x.name === f.name && (!x.anchor || anchor.startsWith(x.anchor)));
    const listLenient = cases ? 'removed' : 'added';
    // A value walked down its path: numbers are floors or limits; a list or a table of waits or kept things is a list of members.
    const flat = (key, display, v) => {
      if (typeof v === 'number') { push({ kind: 'number', key: `${rel}::${key}`, file: rel, name: display, family: f.family, value: v, lenient: f.family === 'floor' ? (zeroCeiling && v === 0 ? 'zero' : 'lower') : 'higher' }); return; }
      if (v instanceof Set || Array.isArray(v) || (v && typeof v === 'object' && (f.family === 'waits' || f.family === 'kept'))) {
        push({ kind: 'list', key: `${rel}::${key}`, file: rel, name: display, family: f.family, lenient: listLenient });
        const members = v instanceof Set ? [...v] : Array.isArray(v) ? v : Object.keys(v);
        for (const el of members) { const id = typeof el === 'string' || typeof el === 'number' ? String(el) : JSON.stringify(el); const said = Array.isArray(el) ? String(el.find((x) => typeof x === 'string') || id) : id;
          push({ kind: 'member', key: `${rel}::${key}::${id}`, file: rel, name: display, family: f.family, member: said, lenient: listLenient }); }
        if (!(v instanceof Set) && !Array.isArray(v)) for (const [k, x] of Object.entries(v)) { if (typeof x === 'number') push({ kind: 'number', key: `${rel}::${key}.${k}`, file: rel, name: `${display}.${k}`, family: f.family, value: x, lenient: 'higher' }); else if (x && typeof x === 'object') flat(`${key}.${k}`, `${display}.${k}`, x); }
        return; }
      if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) flat(`${key}.${k}`, `${display}.${k}`, x);
    };
    flat(base, f.name, lit.value);
  }
}

// The second argument of each ok( call in a file, the check's condition, as [start, end) in the blanked code.
function conditionsOf(code) {
  const spans = [];
  for (const m of code.matchAll(/(?<![\w$.])ok\(/g)) { const open = m.index + 2; const end = closing(code, open); const cuts = []; let depth = 0;
    for (let k = open; k < end; k++) { const c = code[k]; if ('([{'.includes(c)) depth++; else if (')]}'.includes(c)) depth--; else if (c === ',' && depth === 1) cuts.push(k); }
    if (cuts.length) spans.push([cuts[0] + 1, cuts.length > 1 ? cuts[1] : end - 1]); }
  return spans;
}
// Whether a place inside a condition that starts at a lies in an arrow function's body there (a per-item predicate) or inside a group
// under a ! (a comparison whose truth the check turns round), where a lower number is not surely the lenient way.
function nested(code, a, i) {
  const opens = []; const arrows = [];
  for (let k = a; k < i; k++) { const c = code[k];
    if (c === '=' && code[k + 1] === '>') { arrows.push(opens.length); k++; continue; }
    if ('([{'.includes(c)) opens.push(k); else if (')]}'.includes(c)) { opens.pop(); while (arrows.length && arrows[arrows.length - 1] > opens.length) arrows.pop(); } }
  return arrows.length > 0 || opens.some((o) => code[o] === '(' && /!\s*$/.test(code.slice(Math.max(a, o - 4), o)));
}
// The plain names in a file that are counts by their making: set to 0 by let and raised by ++ or +=, or taken from a .length or .size.
function countsOf(code) {
  const zero = new Set(); for (const m of code.matchAll(/\blet\s+[^;\n]*/g)) for (const d of m[0].matchAll(/([A-Za-z_$][\w$]*)\s*=\s*0(?![\w.])/g)) zero.add(d[1]);
  const raised = new Set([...code.matchAll(/([A-Za-z_$][\w$]*)\s*(?:\+\+|\+=)/g), ...code.matchAll(/\+\+\s*([A-Za-z_$][\w$]*)/g)].map((m) => m[1]));
  const taken = [...code.matchAll(/\bconst\s+([A-Za-z_$][\w$]*)\s*=\s*[A-Za-z_$][\w$.]*\.(?:length|size)\s*(?=[;,\n])/g)].map((m) => m[1]);
  return new Set([...[...zero].filter((x) => raised.has(x)), ...taken]);
}
const PIN = /(?<![\w$.\])])([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\s*(===|>=|>)\s*(\d+)(?![\w.])/g;
// Every count pinned in one browser test (2 above), grouped by the name and by === or at least.
function pinnedIn(rel, text, groups) {
  const code = blankOf(text); const counts = countsOf(code);
  for (const [a, b] of conditionsOf(code)) {
    for (const m of code.slice(a, b).matchAll(PIN)) {
      const i = a + m.index; const name = m[1]; const op = m[2] === '===' ? '===' : '>='; const at = Number(m[3]) + (m[2] === '>' ? 1 : 0);
      if (at < 1 || nested(code, a, i)) continue;
      const before = (/(\S)\s*$/.exec(code.slice(Math.max(a, i - 12), i)) || [])[1] || ''; const after = (/^\s*(\S)/.exec(code.slice(i + m[0].length, b + 1)) || [])[1] || '';
      if (/[-+*\/%!]/.test(before) || /[-+*\/%]/.test(after)) continue;   // a number in arithmetic, or a name under a !
      if (op === '===' && !/\.(?:length|size)$/.test(name) && !counts.has(name)) continue;   // an exact state, not a count
      const key = `${rel}::${name} ${op}`; if (!groups.has(key)) groups.set(key, { kind: 'pinned', key, file: rel, name, op, values: [], lenient: 'lower' });
      groups.get(key).values.push(at);
    }
  }
}

// check.sh's steps: each one's name as it echoes it, and, for a step run under a limit, its name in run and its limit.
const stepsOf = (text) => String(text || '').split('\n').filter((l) => /^step "/.test(l)).map((l) => { const label = /^step "([^"]+)"/.exec(l)[1]; const r = / run "([^"]+)" (\d+) /.exec(l); return { label, run: r ? r[1] : '', limit: r ? Number(r[2]) : null }; });
const bare = (label) => label.replace(/^\d+[a-z]?\/\d+ /, '');

// The tree's values: named values, pinned counts, check.sh's limits, and each step's count of checks from its newest passing run.
// source(rel) gives a file's text, from the tree or, for a plant, from its temporary copy.
function readTree(source) {
  const values = []; const computed = []; const push = (e) => values.push(e);
  for (const rel of namedFiles()) { const t = source(rel); if (t !== null) namedIn(rel, t, push, computed); }
  const groups = new Map(); for (const rel of browserFiles()) { const t = source(rel); if (t !== null) pinnedIn(rel, t, groups); }
  for (const g of groups.values()) values.push({ ...g, values: g.values.sort((a, b) => a - b) });
  const steps = stepsOf(source('check.sh'));
  for (const s of steps.filter((x) => x.run)) values.push({ kind: 'number', key: `check.sh::run "${s.run}"`, file: 'check.sh', name: s.run, step: s.label, family: 'limit', value: s.limit, lenient: 'higher' });
  let doc = { runs: [], folded: { runs: 0, steps: [] } }; let timesError = '';
  try { doc = parseTimes(source('docs/CHECK-TIMES.md') || ''); } catch (e) { timesError = e.message; }
  const labels = []; for (const r of doc.runs) for (const s of r.steps) if (!labels.includes(s.name)) labels.push(s.name);
  for (const label of labels) { const run = doc.runs.find((r) => r.steps.some((s) => s.name === label && /^passed/.test(s.status) && countOf(s.summary) !== null)); if (!run) continue;
    const s = run.steps.find((x) => x.name === label && /^passed/.test(x.status) && countOf(x.summary) !== null);
    values.push({ kind: 'number', key: `CHECK-TIMES::${label}`, file: 'docs/CHECK-TIMES.md', name: bare(label), run: (steps.find((x) => x.label === label) || {}).run || '', family: 'count', value: countOf(s.summary), lenient: 'lower', from: run.began }); }
  return { values, computed, steps, doc, timesError };
}

// The newest DECISIONS entry (the "## " entry nearest the end before "## Open items"), its pass, and the items of its Loosened bullet,
// the only words read for names (the form above): case, quotes, backticks and brackets set aside the same way for an item and for a
// name, and each item's numbers, commas read past.
const plainOf = (s) => String(s).toLowerCase().replace(/\[\s*(['"`])(.*?)\1\s*\]/g, '.$2').replace(/['"`*\u2018\u2019\u201c\u201d]/g, '').replace(/\s+/g, ' ').trim();
// A number written with commas is one number, and a comma after it ends it ("the stories 6,939, the click-through 366"): until a near
// miss of round one's fixes in pass NQ such a number was read as 6, so a count of a thousand or more followed by a comma was never read.
const numbersIn = (line) => new Set([...line.matchAll(/(?<![\d.,])\d{1,3}(?:,\d{3})+(?!\d|,\d)|(?<![\d.,])\d+(?!\d)/g)].map((m) => Number(m[0].replace(/,/g, ''))));
const LOOSENED = '- **Loosened.**';
// The entry holds one Loosened bullet at most, so every loosening is said in one place.
const oneBullet = (ent) => ent.bullets <= 1;
// The FAIL line's list for lenient moves: every move, after a note when the entry has two Loosened bullets. Since pass NQ's F4 it names
// them all (until then the first twelve), and check.sh keeps only the step's last line, so the lead runs the guard alone to read it.
const lenientLine = (ent, lenient) => [...(!oneBullet(ent) ? [`${ent.bullets} Loosened bullets: write one`] : []), ...lenient].join(' | ');
const itemsOf = (text) => { const out = []; let depth = 0; let cur = '';
  for (const c of text) { if (c === '(') depth++; else if (c === ')') depth = Math.max(0, depth - 1); if (c === ';' && depth === 0) { out.push(cur); cur = ''; } else cur += c; }
  out.push(cur); return out.map((s) => s.trim()).filter(Boolean); };
function newestEntry(text) {
  const open = text.lastIndexOf('\n## Open items'); const end = open < 0 ? text.length : open; const start = text.lastIndexOf('\n## ', end - 1);
  const lines = text.slice(start + 1, end).split('\n'); const pass = (/\(pass ([A-Z]{2})\)/.exec(lines[0]) || [])[1] || '?';
  const items = []; let bullets = 0;
  for (let k = 0; k < lines.length; k++) { if (!lines[k].startsWith(LOOSENED)) continue; bullets++;
    items.push(...itemsOf(lines[k].slice(LOOSENED.length)));
    for (let j = k + 1; j < lines.length && /^\s+\S/.test(lines[j]); j++) items.push(...itemsOf(lines[j].replace(/^\s+(?:[-*]\s+)?/, ''))); }
  return { pass, bullets, items: items.map((s) => ({ text: s, plain: plainOf(s), numbers: numbersIn(s) })) };
}

// Baseline against tree: each value that moved the lenient way, named in the Loosened bullet or not; each strict move, new value, value
// gone and group renamed; and the baseline's values gone from the tree that are accounted for (named, or a member no longer waiting).
function compare(baseline, read, entry) {
  const re = repin(baseline, rekey(baseline, read.values)); const tree = { ...read, values: re.values };
  const out = { lenient: [], named: [], strict: [], fresh: [], limits: [], renamed: re.renamed, accounted: new Set() };
  const byKey = new Map(tree.values.map((e) => [e.key, e]));
  const fileOfName = new Map(); for (const e of [...baseline, ...tree.values]) { if (!fileOfName.has(e.name)) fileOfName.set(e.name, new Set()); fileOfName.get(e.name).add(e.file); }
  const needFile = (e) => e.kind === 'pinned' || (e.file !== 'check.sh' && e.file !== 'docs/CHECK-TIMES.md' && fileOfName.get(e.name).size > 1);
  const names = (e) => [plainOf(e.name), ...(e.kind === 'number' && e.family === 'count' && e.run ? [plainOf(e.run)] : [])];
  const said = (e, value, member) => entry.items.some((l) => names(e).some((n) => l.plain.includes(n)) && (!needFile(e) || l.plain.includes(plainOf(tokenOf(e.file))))
    && (value === undefined || l.numbers.has(value)) && (member === undefined || l.plain.includes(plainOf(member))));
  const where = (e) => (e.file === 'check.sh' ? `check.sh's run "${e.name}"` : e.file === 'docs/CHECK-TIMES.md' ? `the step ${e.name} (docs/CHECK-TIMES.md)` : e.kind === 'pinned' ? `${e.name} (${e.op}) in ${e.file}` : `${e.name} in ${e.file}`);
  const lenient = (e, text, value, member) => { const yes = said(e, value, member); (yes ? out.named : out.lenient).push(text); return yes; };
  for (const b of baseline) {
    const t = byKey.get(b.key);
    if (b.kind === 'number') {
      if (!t) { if (lenient(b, `${where(b)}: ${b.value}, gone from the tree`)) out.accounted.add(b.key); continue; }
      if (t.value === b.value) continue;
      const loose = b.lenient === 'lower' ? t.value < b.value : b.lenient === 'higher' ? t.value > b.value : t.value !== 0;
      const how = b.lenient === 'zero' ? 'a floor of none read as a ceiling, raised' : t.value < b.value ? 'lowered' : 'raised';
      if (loose) lenient(b, `${where(b)}: ${b.value} to ${t.value}, ${how}`, t.value); else out.strict.push(`${where(b)}: ${b.value} to ${t.value}, ${how}`);
    } else if (b.kind === 'list') {
      if (!t && lenient(b, `${where(b)}: the list is gone from the tree`)) { out.accounted.add(b.key); for (const m of baseline) if (m.kind === 'member' && m.key.startsWith(b.key + '::')) out.accounted.add(m.key); }
    } else if (b.kind === 'member') {
      if (t) continue; if (!byKey.has(b.key.slice(0, b.key.lastIndexOf('::')))) continue;   // the whole list gone is reported once, above
      if (b.lenient === 'removed') { if (lenient(b, `${where(b)}: its case "${b.member}" taken out`, undefined, b.member)) out.accounted.add(b.key); }
      else { out.strict.push(`${where(b)}: "${b.member}" no longer waits or is kept`); out.accounted.add(b.key); }
    } else if (b.kind === 'pinned') {
      const left = [...(t ? t.values : [])]; const pairs = []; let allNamed = true;
      for (const v of [...b.values].sort((x, y) => y - x)) { const at = left.filter((x) => x >= v).sort((x, y) => x - y)[0];
        if (at !== undefined) { left.splice(left.indexOf(at), 1); if (at > v) out.strict.push(`${where(b)}: ${v} to ${at}, raised`); continue; }
        pairs.push(v); }
      for (const v of pairs) { const below = left.filter((x) => x < v).sort((x, y) => y - x)[0];
        if (below !== undefined) { left.splice(left.indexOf(below), 1); if (!lenient(b, `${where(b)}: ${v} to ${below}, lowered`, below)) allNamed = false; } else if (!lenient(b, `${where(b)}: ${v}, gone from the tree`)) allNamed = false; }
      if (!t && allNamed) out.accounted.add(b.key);
      for (const v of left) out.fresh.push(`${where(b)}: ${v}, a new count`);
    }
  }
  const baseKeys = new Set(baseline.map((e) => e.key));
  for (const t of tree.values) {
    if (baseKeys.has(t.key)) continue;
    if (t.kind === 'member') { const listKey = t.key.slice(0, t.key.lastIndexOf('::')); if (!baseKeys.has(listKey)) continue;
      if (t.lenient === 'added') lenient(t, `${where(t)}: "${t.member}" added`, undefined, t.member); else out.fresh.push(`${where(t)}: the case "${t.member}" added`); }
    else out.fresh.push(`${where(t)}: ${t.kind === 'pinned' ? t.values.join(', ') : t.kind === 'list' ? 'a new list' : t.value}, new`);
  }
  // Each limit in check.sh against the limit docs/CHECK-TIMES.md's newest run recorded for its step (L20: a raised limit carries its cause).
  for (const t of tree.values.filter((e) => e.file === 'check.sh')) {
    const run = tree.doc.runs.find((r) => r.steps.some((s) => s.name === t.step && s.limit !== null)); if (!run) continue;
    const was = run.steps.find((s) => s.name === t.step && s.limit !== null).limit;
    if (t.value > was) (said(t, t.value) ? out.named : out.limits).push(`check.sh's run "${t.name}": ${t.value} seconds, over the ${was} its step had in the run that began ${run.began}`);
  }
  return out;
}

// Whether --write may write the baseline, and what it prints: over a readable baseline only with every lenient move an item of the one
// Loosened bullet and never with --first; with no readable baseline, only with --first.
function writeDecision({ old, oldError, first, res, entry }) {
  if (!old) return first ? { write: true, say: [] } : { write: false, say: [`not written: there is no readable baseline (${oldError}); the first one is written with --write --first, from the last delivered tree, as this file's header says`] };
  if (first) return { write: false, say: ["not written: a baseline exists, so --write compares with it, and --first writes only where there is none (when this file's reading changes, the baseline is written again from the last delivered tree, as its header says)"] };
  const unnamed = [...res.lenient, ...res.limits]; const say = unnamed.map((l) => 'UNNAMED - ' + l);
  if (entry.bullets > 1) say.push(`the newest DECISIONS entry (pass ${entry.pass}) has ${entry.bullets} Loosened bullets: write one`);
  if (unnamed.length || entry.bullets > 1) { say.push(`not written: ${unnamed.length} lenient move${unnamed.length === 1 ? ' has' : 's have'} no item in the newest DECISIONS entry's Loosened bullet (pass ${entry.pass})${entry.bullets > 1 ? ', and the entry has more than one such bullet' : ''}`); return { write: false, say }; }
  return { write: true, say: [] };
}

// The baseline file: a line for each value, so a change to it reads as a diff of lines.
const writeBaseline = (values, from) => writeFileSync(BASELINE, `{"from": ${JSON.stringify(from)},\n"values": [\n${values.map((e) => JSON.stringify(e)).join(',\n')}\n]}\n`);
const stored = (e) => { const { step, run, from, ...rest } = e; return e.file === 'check.sh' ? { ...rest, step } : e.file === 'docs/CHECK-TIMES.md' ? { ...rest, run, from } : rest; };
const disk = (overrides = {}) => (rel) => { try { return readFileSync(overrides[rel] || join(ROOT, rel), 'utf8'); } catch (e) { return null; } };
const readBaseline = () => { try { const v = JSON.parse(readFileSync(BASELINE, 'utf8')).values; return Array.isArray(v) ? { old: v, oldError: '' } : { old: null, oldError: 'it holds no list of values' }; } catch (e) { return { old: null, oldError: e.code === 'ENOENT' ? 'the file is missing' : e.message }; } };

// With --write (on this line, the flag checked where the file is the one being run, CLAUDE-PART-2's rule): set the baseline from the
// tree as it stands, as writeDecision allows; otherwise run the guard and its plants.
if (process.argv[1] && process.argv[1].endsWith('floor-guard.test.mjs') && process.argv.includes('--write')) {
  const first = process.argv.includes('--first');
  const tree = readTree(disk()); const entry = newestEntry(readFileSync(join(ROOT, 'docs/DECISIONS.md'), 'utf8')); const { old, oldError } = readBaseline();
  const d = writeDecision({ old, oldError, first, res: old ? compare(old, tree, entry) : null, entry });
  for (const l of d.say) console.log(l);
  if (!d.write) process.exitCode = 1;
  else { writeBaseline(tree.values.map(stored), `the tree as it stood when the newest DECISIONS entry was pass ${entry.pass}'s, written ${new Date().toISOString().slice(0, 10)}${first ? ' with --first' : ''}`);
    console.log(`baseline written to tests/fixtures/floor-baseline.json: ${tree.values.length} values (pass ${entry.pass}'s entry newest${first ? ', the first, with --first' : ''})`); }
} else {
  // The guard on the tree as it stands.
  const tree = readTree(disk()); const decisions = readFileSync(join(ROOT, 'docs/DECISIONS.md'), 'utf8'); const entry = newestEntry(decisions);
  const { old, oldError } = readBaseline(); const baseline = old || [];
  const res = compare(baseline, tree, entry);
  // Each kind read held to the baseline's own count of it (round one's code read of pass NQ: the floors were guesses), less the values the
  // comparison accounts for as gone (an item of the Loosened bullet, or a member no longer waiting), so a reader that stops reading a kind
  // is named at once.
  const KINDS = [['named numbers', (e) => e.kind === 'number' && !['check.sh', 'docs/CHECK-TIMES.md'].includes(e.file)], ['lists', (e) => e.kind === 'list'], ['members', (e) => e.kind === 'member'],
    ['pinned counts in browser tests', (e) => e.kind === 'pinned'], ['limits in check.sh', (e) => e.kind === 'number' && e.file === 'check.sh'], ["steps' counts from docs/CHECK-TIMES.md", (e) => e.kind === 'number' && e.file === 'docs/CHECK-TIMES.md']];
  const tallyOf = (values, accounted) => KINDS.map(([label, is]) => ({ label, read: values.filter(is).length, base: baseline.filter(is).length, accounted: baseline.filter((e) => is(e) && accounted.has(e.key)).length }));
  const shortOf = (tl) => tl.filter((t) => t.read + t.accounted < t.base);
  const tally = tallyOf(tree.values, res.accounted); const short = shortOf(tally); const built = tree.computed.length;
  ok(`the guard reads the tree, each kind at least the baseline's own count of it less those gone and accounted for: ${tally.map((t) => `${t.read} ${t.label} (${t.base} in the baseline)`).join(', ')}; ${built} value${built === 1 ? '' : 's'} built by code, reported`,
    !oldError && !tree.timesError && baseline.length > 0 && short.length === 0,
    oldError ? `no readable baseline (${oldError}); the header says how it is written` : tree.timesError || short.map((t) => `${t.label}: ${t.read} read, ${t.accounted} accounted for, ${t.base} in the baseline`).join('; '));
  for (const c of tree.computed) note(`built by code, not read as data: ${c}`);
  for (const l of res.renamed) note(`a pinned count renamed: ${l}`);
  for (const l of res.named) note(`moved the lenient way, named in pass ${entry.pass}'s Loosened bullet: ${l}`);
  for (const l of res.strict) note(`moved the strict way: ${l}`);
  for (const l of res.fresh) note(`new since the baseline: ${l}`);
  ok(`no value moved the lenient way without its item in the newest DECISIONS entry's one Loosened bullet (pass ${entry.pass}; ${entry.bullets} such bullet${entry.bullets === 1 ? '' : 's'}, ${entry.items.length} item${entry.items.length === 1 ? '' : 's'}): a floor lowered, a pinned count lowered, a wait or a kept exception added, a case taken out, a limit raised, a step's count of checks fallen, or a value gone (${baseline.length} values in the baseline; ${res.named.length} named, ${res.strict.length} strict, ${res.fresh.length} new)`,
    res.lenient.length === 0 && oneBullet(entry), lenientLine(entry, res.lenient));
  ok(`no limit in check.sh is over the limit docs/CHECK-TIMES.md's newest run recorded for its step without its item in the Loosened bullet (EARMARKS L20: a raised limit carries its cause)`, res.limits.length === 0, res.limits.join(' | '));

  // The plants, each in a temporary copy of the files it changes, read as the tree with those files swapped in and compared with the
  // baseline; a planted DECISIONS bullet or line goes into a temporary copy of DECISIONS, at the end of its newest entry.
  const dir = mkdtempSync(join(tmpdir(), 'floor-guard-'));
  try {
    const withLines = (...lines) => { const at = decisions.lastIndexOf('\n## Open items'); const p = join(dir, 'DECISIONS.md'); writeFileSync(p, `${decisions.slice(0, at)}\n${lines.join('\n')}\n${decisions.slice(at)}`); return newestEntry(readFileSync(p, 'utf8')); };
    const loosened = (...items) => withLines(`${LOOSENED} ${items.join('; ')}.`);
    const has = (list, part) => list.some((l) => l.includes(part));
    // Since pass NT (EARMARKS L34): every plant takes the baseline's value, never the tree's, and finds the tree's own text by the tree's
    // value, so a pass that raised a value before --write wrote the baseline still plants a lowering against the baseline. In pass NR the
    // tree's FLOORS.drawings, raised to 700, made 696, read as raised from the baseline's 694, and the stories' count, 6,975 in the
    // newest run, made 6,966, read against the baseline's 6,939 as not fallen, so the guard failed its own plants until --write ran. Since
    // round one's code read of pass NT, which undid nine parts of that fix one at a time with every check still passing on a tree whose
    // values were the baseline's, the plants run twice: on the tree as it stands, and on a tree that raised its values before --write
    // (below), asking the same verdicts.
    const baseOf = (key) => (baseline.find((e) => e.key === key) || {}).value;
    const basePinOf = (key) => (baseline.find((e) => e.key === key) || { values: [] }).values;
    const drawings = baseOf('tests/e2e/tile-edges.mjs::FLOORS.drawings');
    let copies = 0;
    // The plants on the tree with under's files swapped in ({} is the tree as it stands): each check a [label, condition, what it read].
    const plantChecks = (under) => {
      const t = readTree(disk(under)); const own = compare(baseline, t, entry); const out = [];
      const copy = (rel, edit) => { const text = readFileSync(under[rel] || join(ROOT, rel), 'utf8'); const changed = edit(text); if (changed === text) return null; const p = join(dir, `${rel.replace(/\//g, '__')}-${copies++}`); writeFileSync(p, changed); return { ...under, [rel]: p }; };
      const verdict = (over, ent = entry) => compare(baseline, readTree(disk(over || under)), ent);
      const value = (key) => (t.values.find((e) => e.key === key) || {}).value;
      const pinOf = (key) => (t.values.find((e) => e.key === key) || { values: [] }).values;
      // A floor lowered, with no line and with its item in the Loosened bullet, and raised: tile-edges' FLOORS.drawings, the baseline's.
      const drawings = baseOf('tests/e2e/tile-edges.mjs::FLOORS.drawings');
      const floorTo = (n) => copy('tests/e2e/tile-edges.mjs', (x) => x.replace(/(const FLOORS = \{ drawings: )\d+/, `$1${n}`));
      const low = drawings && floorTo(drawings - 4); const lowRes = low && verdict(low);
      const lowNamed = low && verdict(low, loosened(`tile-edges FLOORS.drawings ${drawings} to ${drawings - 4} (planted by the guard's own test)`));
      out.push([`a FLOORS value lowered with no line fails, and passes with its item in the Loosened bullet (tile-edges' FLOORS.drawings, ${drawings} to ${drawings - 4}, planted in a copy)`,
        !!low && has(lowRes.lenient, `FLOORS.drawings in tests/e2e/tile-edges.mjs: ${drawings} to ${drawings - 4}, lowered`) && !has(lowNamed.lenient, 'FLOORS.drawings') && has(lowNamed.named, 'FLOORS.drawings'), low ? lowRes.lenient.join(' | ') : 'the plant found no FLOORS.drawings in tests/e2e/tile-edges.mjs']);
      const drawingsNow = value('tests/e2e/tile-edges.mjs::FLOORS.drawings'); const highTo = drawings && drawingsNow && Math.max(drawings, drawingsNow) + 6;
      const high = highTo && floorTo(highTo); const highRes = high && verdict(high);
      out.push([`a floor raised passes with no line, reported as strict (tile-edges' FLOORS.drawings, ${drawings} to ${highTo}, planted in a copy)`,
        !!high && !has(highRes.lenient, 'FLOORS.drawings') && has(highRes.strict, `FLOORS.drawings in tests/e2e/tile-edges.mjs: ${drawings} to ${highTo}, raised`), high ? highRes.strict.join(' | ') : 'no plant']);
      // A wait added: a lesson line put in fold-check's FOLD_WAITS.
      const wait = copy('tests/e2e/fold-check.mjs', (x) => x.replace(/export const FOLD_WAITS = \{/, "export const FOLD_WAITS = { 'planted-wait 1': 'a wait planted by the guard', "));
      const waitRes = wait && verdict(wait);
      out.push(["a wait added with no line fails (fold-check's FOLD_WAITS gains 'planted-wait 1', planted in a copy)", !!wait && has(waitRes.lenient, 'FOLD_WAITS in tests/e2e/fold-check.mjs: "planted-wait 1" added'), wait ? waitRes.lenient.join(' | ') : 'the plant found no FOLD_WAITS']);
      // A pinned .length lowered (question-screens' section 16b's fifteen lines) and a pinned plain count lowered (its 33 screens).
      const pairs = basePinOf('tests/e2e/question-screens.mjs::PRINT_PAIRS.length ===')[0]; const pairsNow = pinOf('tests/e2e/question-screens.mjs::PRINT_PAIRS.length ===')[0];
      const pin = pairs && pairsNow && copy('tests/e2e/question-screens.mjs', (x) => x.replace(`PRINT_PAIRS.length === ${pairsNow}`, `PRINT_PAIRS.length === ${pairs - 1}`)); const pinRes = pin && verdict(pin);
      out.push([`a pinned .length lowered with no line fails (question-screens' PRINT_PAIRS.length === ${pairs} made ${pairs - 1}, planted in a copy)`, !!pin && has(pinRes.lenient, `PRINT_PAIRS.length (===) in tests/e2e/question-screens.mjs: ${pairs} to ${pairs - 1}, lowered`), pin ? pinRes.lenient.join(' | ') : 'the plant found no PRINT_PAIRS.length']);
      const screens = basePinOf('tests/e2e/question-screens.mjs::screens ===')[0]; const screensNow = pinOf('tests/e2e/question-screens.mjs::screens ===')[0];
      const plain = screens && screensNow && copy('tests/e2e/question-screens.mjs', (x) => x.replace(`screens === ${screensNow} `, `screens === ${screens - 1} `)); const plainRes = plain && verdict(plain);
      out.push([`a pinned plain count lowered with no line fails (question-screens' screens === ${screens} made ${screens - 1}, a count by its making, planted in a copy; round one's code read of pass NQ)`, !!plain && has(plainRes.lenient, `screens (===) in tests/e2e/question-screens.mjs: ${screens} to ${screens - 1}, lowered`), plain ? plainRes.lenient.join(' | ') : 'the plant found no screens === in tests/e2e/question-screens.mjs']);
      // A floor written as arithmetic (round one's code read of pass NQ): question-screens' KEPT_FLOOR made "<itself> - 10" is built by code, and gone.
      const kept = baseOf('tests/e2e/question-screens.mjs::KEPT_FLOOR'); const keptNow = value('tests/e2e/question-screens.mjs::KEPT_FLOOR');
      const arith = kept !== undefined && keptNow !== undefined && copy('tests/e2e/question-screens.mjs', (x) => x.replace(`const KEPT_FLOOR = ${keptNow};`, `const KEPT_FLOOR = ${keptNow} - 10;`));
      const arithTree = arith && readTree(disk(arith)); const arithRes = arith && compare(baseline, arithTree, entry);
      out.push([`a floor written as arithmetic is read as built by code, so it is gone from the tree and fails with no line (question-screens' KEPT_FLOOR = ${keptNow} made ${keptNow} - 10, planted in a copy; round one's code read of pass NQ)`,
        !!arith && arithTree.computed.includes('tests/e2e/question-screens.mjs KEPT_FLOOR') && has(arithRes.lenient, `KEPT_FLOOR in tests/e2e/question-screens.mjs: ${kept}, gone from the tree`), arith ? arithRes.lenient.join(' | ') : 'the plant found no KEPT_FLOOR']);
      // A limit raised (the question screens' limit in check.sh, a tenth over the highest of the baseline's, the tree's and the one the newest
      // run recorded): with no line it fails against the baseline and against CHECK-TIMES; its item in the Loosened bullet passes, every other
      // lenient move of the tree as it stands still there; and a line outside the bullet that holds its name and new limit, beside a bullet
      // that names only a floor, still fails twice (round one's code read of pass NQ).
      const qs = baseOf('check.sh::run "the question screens"'); const qsNow = value('check.sh::run "the question screens"');
      const qsStep = (t.values.find((e) => e.key === 'check.sh::run "the question screens"') || {}).step; const qsRun = t.doc.runs.find((r) => r.steps.some((x) => x.name === qsStep && x.limit !== null));
      const qsWas = qsRun ? qsRun.steps.find((x) => x.name === qsStep && x.limit !== null).limit : qs; const up = qs && qsNow && Math.round(Math.max(qs, qsNow, qsWas) * 1.1);
      const lim = qs && qsNow && copy('check.sh', (x) => x.replace(`run "the question screens" ${qsNow} `, `run "the question screens" ${up} `)); const limRes = lim && verdict(lim);
      const limNamed = lim && verdict(lim, loosened(`the question screens' limit ${qs.toLocaleString('en-US')} to ${up.toLocaleString('en-US')}, a tenth more seconds (planted by the guard's own test, its new limit followed by a comma)`));
      const limOutside = lim && verdict(lim, withLines(`${LOOSENED} tile-edges FLOORS.drawings ${drawings} to ${drawings - 4} (planted by the guard's own test).`, `- The question screens' limit was raised from ${qs.toLocaleString('en-US')} to ${up.toLocaleString('en-US')} seconds, a line planted by the guard's own test outside the Loosened bullet.`));
      out.push([`a limit raised in check.sh with no line fails, against the baseline and against docs/CHECK-TIMES.md's newest run; it passes with its item in the Loosened bullet; and a line outside the bullet holding its name and new limit still fails twice (the question screens, ${qs} to ${up}, planted in a copy)`,
        !!lim && has(limRes.lenient, `check.sh's run "the question screens": ${qs} to ${up}, raised`) && has(limRes.limits, `check.sh's run "the question screens": ${up} seconds, over the ${qsWas}`) && limNamed.lenient.length === own.lenient.filter((l) => !l.includes('"the question screens"')).length && limNamed.limits.length === 0
        && has(limOutside.lenient, `check.sh's run "the question screens": ${qs} to ${up}, raised`) && has(limOutside.limits, `check.sh's run "the question screens": ${up} seconds`),
        lim ? JSON.stringify({ lenient: limRes.lenient, limits: limRes.limits, named: limNamed && limNamed.named, outside: limOutside && [limOutside.lenient, limOutside.limits] }) : 'the plant found no run "the question screens"']);
      // A step's count fallen (the stories' count in docs/CHECK-TIMES.md's newest passing run, nine under the baseline's): with no line it
      // fails, and a check.sh bullet that reports the fallen count, as every entry's does, still fails (round one's code read of pass NQ).
      const stories = baseOf('CHECK-TIMES::5/13 stories'); const storiesNow = value('CHECK-TIMES::5/13 stories');
      const fall = stories && storiesNow && copy('docs/CHECK-TIMES.md', (x) => { const i = x.indexOf('| 5/13 stories |'); const j = x.indexOf('\n', i); return i < 0 ? x : x.slice(0, i) + x.slice(i, j).replace(new RegExp(`\\b${storiesNow}( passed)`), `${stories - 9}$1`) + x.slice(j); });
      const fallRes = fall && verdict(fall);
      const fallBullet = fall && verdict(fall, withLines(`- **check.sh.** ALL CHECKS PASSED, its one whole run on the final tree, a bullet planted by the guard's own test: the rules test 3,243, the docs sync test 122, the stories ${(stories - 9).toLocaleString('en-US')}, the click-through 366 and every other step whole.`));
      out.push([`a step's count of checks fallen with no line fails, and a check.sh bullet that reports the fallen count does not name it (the stories, ${stories} to ${stories - 9} in docs/CHECK-TIMES.md's newest run, planted in a copy)`,
        !!fall && has(fallRes.lenient, `the step stories (docs/CHECK-TIMES.md): ${stories} to ${stories - 9}, lowered`) && has(fallBullet.lenient, `the step stories (docs/CHECK-TIMES.md): ${stories} to ${stories - 9}, lowered`), fall ? JSON.stringify([fallRes.lenient, fallBullet.lenient]) : 'the plant found no count for 5/13 stories']);
      return out;
    };
    for (const [label, cond, info] of plantChecks({})) ok(label, cond, info);
    // The tree raised before --write, as pass NR's was (EARMARKS L34): tile-edges' FLOORS.drawings six over the baseline, question-screens'
    // PRINT_PAIRS.length and screens one over and its KEPT_FLOOR four over, the question screens' limit in check.sh a fifth over, as the
    // limit the newest run recorded for its step, and the stories' newest count 36 over, each written whatever the tree holds.
    const tv = (key) => (tree.values.find((e) => e.key === key) || {}).value; const tp = (key) => (tree.values.find((e) => e.key === key) || { values: [] }).values[0];
    const writeAs = (rel, edit) => { const p = join(dir, `${rel.replace(/\//g, '__')}-raised`); writeFileSync(p, edit(readFileSync(join(ROOT, rel), 'utf8'))); return p; };
    const R = { drawings: drawings + 6, pairs: basePinOf('tests/e2e/question-screens.mjs::PRINT_PAIRS.length ===')[0] + 1, screens: basePinOf('tests/e2e/question-screens.mjs::screens ===')[0] + 1,
      kept: baseOf('tests/e2e/question-screens.mjs::KEPT_FLOOR') + 4, limit: Math.round(baseOf('check.sh::run "the question screens"') * 1.2), stories: baseOf('CHECK-TIMES::5/13 stories') + 36 };
    const limitStep = (tree.values.find((e) => e.key === 'check.sh::run "the question screens"') || {}).step;
    const newestLine = (x, start, edit) => { const i = x.indexOf(start); const j = x.indexOf('\n', i); return i < 0 ? x : x.slice(0, i) + edit(x.slice(i, j)) + x.slice(j); };
    const raised = {
      'tests/e2e/tile-edges.mjs': writeAs('tests/e2e/tile-edges.mjs', (x) => x.replace(/(const FLOORS = \{ drawings: )\d+/, `$1${R.drawings}`)),
      'tests/e2e/question-screens.mjs': writeAs('tests/e2e/question-screens.mjs', (x) => x.replace(`PRINT_PAIRS.length === ${tp('tests/e2e/question-screens.mjs::PRINT_PAIRS.length ===')}`, `PRINT_PAIRS.length === ${R.pairs}`)
        .replace(`screens === ${tp('tests/e2e/question-screens.mjs::screens ===')} `, `screens === ${R.screens} `).replace(`const KEPT_FLOOR = ${tv('tests/e2e/question-screens.mjs::KEPT_FLOOR')};`, `const KEPT_FLOOR = ${R.kept};`)),
      'check.sh': writeAs('check.sh', (x) => x.replace(`run "the question screens" ${tv('check.sh::run "the question screens"')} `, `run "the question screens" ${R.limit} `)),
      'docs/CHECK-TIMES.md': writeAs('docs/CHECK-TIMES.md', (x) => newestLine(newestLine(x, '| 5/13 stories |', (l) => l.replace(new RegExp(`\\b${tv('CHECK-TIMES::5/13 stories')}( passed)`), `${R.stories}$1`)),
        `| ${limitStep} |`, (l) => l.replace(/^(\| [^|]+ \| [^|]+ \| )\d+( \|)/, `$1${R.limit}$2`))) };
    const rt = readTree(disk(raised)); const rv = (key) => (rt.values.find((e) => e.key === key) || {}).value; const rp = (key) => (rt.values.find((e) => e.key === key) || { values: [] }).values[0];
    const rRun = rt.doc.runs.find((r) => r.steps.some((x) => x.name === limitStep && x.limit !== null));
    const raisedRead = { drawings: rv('tests/e2e/tile-edges.mjs::FLOORS.drawings'), pairs: rp('tests/e2e/question-screens.mjs::PRINT_PAIRS.length ==='), screens: rp('tests/e2e/question-screens.mjs::screens ==='), kept: rv('tests/e2e/question-screens.mjs::KEPT_FLOOR'), limit: rv('check.sh::run "the question screens"'), stories: rv('CHECK-TIMES::5/13 stories'), recorded: rRun ? rRun.steps.find((x) => x.name === limitStep && x.limit !== null).limit : null };
    ok(`the tree raised before --write reads every value raised, the limit the newest run recorded too (EARMARKS L34, pass NT: FLOORS.drawings ${R.drawings}, PRINT_PAIRS.length ${R.pairs}, screens ${R.screens}, KEPT_FLOOR ${R.kept}, the question screens' limit ${R.limit}, the stories ${R.stories})`,
      Object.keys(R).every((k) => raisedRead[k] === R[k]) && raisedRead.recorded === R.limit, JSON.stringify(raisedRead));
    for (const [label, cond, info] of plantChecks(raised)) ok(`on a tree that raised its values before --write (EARMARKS L34, pass NT), ${label}`, cond, info);
    // The FAIL line names every lenient move (pass NQ, F4, after round three's code read; until then the first twelve): thirteen made moves.
    const made = Array.from({ length: 13 }, (_, i) => `made move ${i + 1} in a made file: ${i + 20} to ${i + 10}, lowered`); const line = lenientLine(entry, made).split(' | ');
    ok('the FAIL line for lenient moves names every move, not the first twelve (thirteen made moves; pass NQ, F4)', made.every((m) => line.includes(m)), line.join(' | '));
    // Two Loosened bullets fail, whatever they name: the entry holds one.
    const two = withLines(`${LOOSENED} tile-edges FLOORS.drawings ${drawings} to ${drawings - 4} (planted by the guard's own test).`, `${LOOSENED} None.`);
    ok('a newest entry with two Loosened bullets fails the guard, so the bullet stays one (planted in a copy of DECISIONS)', two.bullets === entry.bullets + 2 && !oneBullet(two) && two.items.some((x) => /floors\.drawings/.test(x.plain)), JSON.stringify({ bullets: two.bullets }));
    // A reader that stops reading a kind is named by the first check: a made read with every pinned count dropped is short of the
    // baseline's own count of them, where the guessed floors it replaced would have passed any read of 150 or more.
    const dropped = tree.values.filter((e) => e.kind !== 'pinned'); const droppedShort = shortOf(tallyOf(dropped, compare(baseline, { ...tree, values: dropped }, entry).accounted));
    ok(`a reader that stops reading a kind fails the first check, held to the baseline's own count (every pinned count dropped from a made read: ${droppedShort.map((x) => `${x.read} ${x.label} of ${x.base}`).join('; ')})`, droppedShort.length === 1 && droppedShort[0].label.startsWith('pinned counts'), JSON.stringify(droppedShort));
    // --write's choice, case by case.
    const quiet = { lenient: [], limits: [] }; const loud = { lenient: ['FLOORS.drawings in tests/e2e/tile-edges.mjs: 694 to 690, lowered'], limits: [] }; const one = { bullets: 1, pass: 'NQ' };
    const choices = [!writeDecision({ old: null, oldError: 'the file is missing', first: false, res: null, entry: one }).write, writeDecision({ old: null, oldError: 'the file is missing', first: true, res: null, entry: one }).write,
      !writeDecision({ old: [], oldError: '', first: true, res: quiet, entry: one }).write, !writeDecision({ old: [], oldError: '', first: false, res: loud, entry: one }).write,
      !writeDecision({ old: [], oldError: '', first: false, res: quiet, entry: { bullets: 2, pass: 'NQ' } }).write, writeDecision({ old: [], oldError: '', first: false, res: quiet, entry: one }).write];
    ok('--write refuses with no readable baseline unless --first, refuses --first over a baseline, refuses an unnamed lenient move or two Loosened bullets, and writes when every move is named (round one\'s code read of pass NQ)', choices.every(Boolean), JSON.stringify(choices));
  } finally { rmSync(dir, { recursive: true, force: true }); }
  console.log(`\n${passed} passed, ${failed} failed`);
  process.exitCode = failed ? 1 : 0;   // never process.exit(): it can drop the last lines of a piped stdout (CLAUDE.md, 2026-09-23)
}
