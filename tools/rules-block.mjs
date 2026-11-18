// Copyright (c) 2026 iECHO, LLC. All rights reserved.
// -----------------------------------------------------------------------------------------------------------------
// Run part of the rules test alone (pass NQ, EARMARKS L26: the lead's block runner, put in the tree so no chat builds it again).
//
// In plain terms: tests/logic.test.mjs is about 14,400 lines and takes about 13 to 17 minutes whole (796 and 808 seconds in pass NT's two
// runs alone, 1,018 inside pass NS's check.sh; 853 to 937 in pass NQ) and holds up to about 3.7 GB (3,634 to 3,688 MB at the most in pass
// NT's three runs; since pass NT its own last lines say so), so it runs with a 4 GB heap. A reader or an engineer who changed one bank, one module or one pass's checks needs only that part, so this tool cuts the
// part out of the test, runs it by itself and reports the same summary line and FAIL lines the whole test would. It never runs the
// whole test, and it never edits it.
//
// How the test is read: with the TypeScript compiler (the global install, found by `npm root -g`; it reads plain JavaScript), never
// by counting braces. Each top-level statement of the test is one of:
//   - an import (always kept);
//   - a declaration (const, let, var, function, class): the shared helpers (ok, pass, fail) and the many shared constants such as
//     PREK_DERIVE and PREK_BANKS;
//   - the summary lines at the end (always kept, so the run ends with the test's own "N passed, M failed" and exit code);
//   - a part: a block `{ ... }` (one pass's checks), a long loop, or a lone statement. A part that runs checks (it calls ok( or
//     changes pass or fail) is a check part, and the only kind this tool ever drops. A part that runs no checks (state the later
//     parts read, such as events.push(...) and p = ...) is kept every time, so the shared state still builds up as it does whole.
// How the kept declarations are chosen: a declaration is kept only when something kept needs it, by name, followed down the chain
// (a kept block names PREK_DERIVE, which names HELPERS, which names ...). A declaration whose initializer runs checks is treated the
// same way: kept only when a kept part needs what it declares. The match is by name alone and ignores scope, so a block that has a
// local variable named like a top-level one keeps that top-level one too: a little slower, never wrong.
// What a reader does when a kept block needs a value a dropped part computes: the tool says so, in a line beginning "NOTE", naming the
// name and the dropped part (a dropped loop that fills a shared Set or object, or assigns a top-level let); add a pattern that matches
// that part (a word from its comment, or `--part N`) and run again. A run that printed any NOTE exits 3 even when the copy passed,
// since a check can pass on a table nothing filled; `--allow-note` keeps the copy's own exit code when the reader has looked at the NOTE and it
// does not matter. A write through Object.assign(NAME, ...), Object.defineProperty(NAME, ...) or the like counts as a write to NAME.
// Line numbers: the copy keeps every kept line on its own original line (a dropped part becomes blank lines), so a failure's line
// in a stack trace is the line in tests/logic.test.mjs. The copy is written to the system's temporary folder, never into the tree (the
// docs test fails on a scratch file in tests/), with its relative imports and import.meta.url pointed at the real test's place, run
// from the project folder as `node tests/logic.test.mjs` is, and removed afterward, even when the run fails.
//
// Run (from the project folder):
//   node tools/rules-block.mjs --list [--file tests/logic.test.mjs]    every part, numbered, with its lines, kind, section and first comment
//   node tools/rules-block.mjs <pattern ...>                          keep the check parts whose text holds any pattern (case ignored)
//   node tools/rules-block.mjs --lines 4419-4480                      keep the check parts that touch those lines
//   node tools/rules-block.mjs --part 61 --part 62                    keep parts by their --list number (also --part 61,62)
//   node tools/rules-block.mjs --section 11b                          keep every check part under a "// ---- 11b." section heading
//   node tools/rules-block.mjs --selftest                             prove the tool works (light, no browser, never the whole test)
// A pattern matches a part's whole text, its leading comment included: a bank id (p3-next-guess), a module id (what-happens-next), a
// constant's name (NP_C4_WHICH) or words from the comment ("scored blind"). A pattern of the form re:<expression> is a regular
// expression. Patterns, --lines, --part and --section add to one another. A run that keeps no check part stops with exit code 2.
// What it prints: a line saying how many parts and declarations the copy keeps, any NOTE lines, then the copy's own "N passed, M failed"
// line and every FAIL line it printed, and "exit code N (seconds)". Its own exit code is the copy's (0 pass, 1 a failure), or 2 for a
// bad request, or 3 when the copy passed but a NOTE was printed (see below). --selftest prints PASS or FAIL lines and a "N passed, M failed" line of its own.
// -----------------------------------------------------------------------------------------------------------------
import { createRequire } from 'node:module';
import { execSync, spawn, spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const ROOT = process.cwd();
const ts = createRequire(import.meta.url)(execSync('npm root -g').toString().trim() + '/typescript');

// Method names that change the thing they are called on, so a dropped part that calls one on a shared constant is noticed.
const MUTATORS = new Set(['push', 'unshift', 'pop', 'shift', 'splice', 'sort', 'reverse', 'set', 'add', 'delete', 'clear']);
const ASSIGN_OPS = new Set([ts.SyntaxKind.EqualsToken, ts.SyntaxKind.PlusEqualsToken, ts.SyntaxKind.MinusEqualsToken, ts.SyntaxKind.AsteriskEqualsToken, ts.SyntaxKind.BarBarEqualsToken, ts.SyntaxKind.QuestionQuestionEqualsToken, ts.SyntaxKind.AmpersandAmpersandEqualsToken]);

// Reads a test's source into its statements: what each is, where it sits, what it names, declares, assigns and whether it runs checks.
export function readParts(src) {
  const sf = ts.createSourceFile('test.mjs', src, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  const lineOf = (pos) => sf.getLineAndCharacterOfPosition(pos).line + 1;
  const sections = [...src.matchAll(/^\/\/ ---- ([0-9]+[a-z]?)\.?\s*(.*?)(?: ----)?\s*$/gm)].map((m) => ({ id: m[1], title: m[2], line: lineOf(m.index) }));
  const sectionAt = (line) => { let s = null; for (const x of sections) if (x.line <= line) s = x; return s; };
  const declared = (node) => { const names = []; const bind = (b) => { if (!b) return; if (ts.isIdentifier(b)) names.push(b.text); else if (ts.isObjectBindingPattern(b) || ts.isArrayBindingPattern(b)) b.elements.forEach((e) => { if (!ts.isOmittedExpression(e)) bind(e.name); }); };
    if (ts.isVariableStatement(node)) node.declarationList.declarations.forEach((d) => bind(d.name)); else if ((ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node)) && node.name) names.push(node.name.text); return names; };
  // Every name a node uses (property names after a dot and object keys are not uses), and every name it assigns or mutates.
  const scan = (node) => { const uses = new Set(); const writes = new Set(); let checks = false;
    const root = (e) => { while (e && (ts.isPropertyAccessExpression(e) || ts.isElementAccessExpression(e) || ts.isParenthesizedExpression(e) || ts.isNonNullExpression(e))) e = e.expression; return e && ts.isIdentifier(e) ? e.text : null; };
    const walk = (n) => {
      if (ts.isIdentifier(n)) { const p = n.parent; const isKey = p && ((ts.isPropertyAccessExpression(p) && p.name === n) || (ts.isPropertyAssignment(p) && p.name === n) || (ts.isMethodDeclaration(p) && p.name === n) || (ts.isPropertySignature(p) && p.name === n) || (ts.isBindingElement(p) && p.propertyName === n) || (ts.isLabeledStatement(p) && p.label === n)); if (!isKey) uses.add(n.text); }
      if (ts.isCallExpression(n) && ts.isIdentifier(n.expression) && n.expression.text === 'ok') checks = true;
      if (ts.isBinaryExpression(n) && ASSIGN_OPS.has(n.operatorToken.kind)) { const r = root(n.left); if (r) { writes.add(r); if (r === 'pass' || r === 'fail') checks = true; } }
      if ((ts.isPrefixUnaryExpression(n) || ts.isPostfixUnaryExpression(n)) && (n.operator === ts.SyntaxKind.PlusPlusToken || n.operator === ts.SyntaxKind.MinusMinusToken)) { const r = root(n.operand); if (r) { writes.add(r); if (r === 'pass' || r === 'fail') checks = true; } }
      if (ts.isCallExpression(n) && ts.isPropertyAccessExpression(n.expression) && MUTATORS.has(n.expression.name.text)) { const r = root(n.expression.expression); if (r) writes.add(r); }
      // Object.assign(SHARED, ...) and its kin write their first argument, not Object (whose root the line above would read).
      if (ts.isCallExpression(n) && ts.isPropertyAccessExpression(n.expression) && ts.isIdentifier(n.expression.expression) && ((n.expression.expression.text === 'Object' && ['assign', 'defineProperty', 'defineProperties', 'setPrototypeOf'].includes(n.expression.name.text))) && n.arguments[0]) { const r = root(n.arguments[0]); if (r) writes.add(r); }
      ts.forEachChild(n, walk); };
    walk(node);
    // A name the part declares itself (a local variable or a parameter) is its own, so a write to it is not a write to a shared one.
    const own = new Set(); const mine = (n) => { if ((ts.isVariableDeclaration(n) || ts.isParameter(n)) && ts.isIdentifier(n.name)) own.add(n.name.text); if ((ts.isFunctionDeclaration(n) || ts.isClassDeclaration(n)) && n.name) own.add(n.name.text); ts.forEachChild(n, mine); };
    mine(node); for (const w of own) writes.delete(w); writes.delete('pass'); writes.delete('fail');
    return { uses, writes, checks }; };
  const out = []; let number = 0;
  for (const st of sf.statements) {
    const start = st.getStart(sf); const fullStart = st.getFullStart();
    const text = src.slice(fullStart, st.end); const first = lineOf(start); const last = lineOf(st.end);
    const info = { fullStart, start, end: st.end, first, last, text, node: st, section: (sectionAt(first) || {}).id || null };
    const s = scan(st); Object.assign(info, { uses: s.uses, writes: s.writes });
    if (ts.isImportDeclaration(st)) info.role = 'import';
    else if (ts.isVariableStatement(st) || ts.isFunctionDeclaration(st) || ts.isClassDeclaration(st)) { info.role = 'declaration'; info.names = declared(st); info.checks = s.checks; }
    else if (ts.isExpressionStatement(st) && /process\.exitCode/.test(st.getText(sf))) info.role = 'summary';
    else if (ts.isExpressionStatement(st) && /\$\{pass\} passed, \$\{fail\} failed/.test(st.getText(sf))) info.role = 'summary';
    else { info.role = 'part'; info.checks = s.checks; info.number = ++number;
      info.kind = ts.isBlock(st) ? 'block' : (ts.isForStatement(st) || ts.isForOfStatement(st) || ts.isForInStatement(st) || ts.isWhileStatement(st) || ts.isDoStatement(st)) ? 'loop' : s.checks ? 'check' : 'setup';
      const comment = (ts.getLeadingCommentRanges(src, fullStart) || []).map((r) => src.slice(r.pos, r.end)).filter((c) => !/^\/\/ ---- /.test(c)).map((c) => c.replace(/^\/\/+\s?|^\/\*+\s?|\s?\*\/$/g, '').trim()).find((c) => c);
      info.label = comment || st.getText(sf).replace(/\s+/g, ' ').slice(0, 90); }
    out.push(info);
  }
  return { sf, parts: out, sections, source: src };
}

// The listing: sections as headings, then each part with its number, lines, kind and first comment line or first words.
export function listParts(read) {
  const lines = []; let section = undefined;
  for (const p of read.parts) { if (p.role !== 'part') continue;
    if (p.section !== section) { section = p.section; const s = read.sections.find((x) => x.id === section); if (s) lines.push(`== section ${s.id}: ${s.title} (line ${s.line})`); }
    lines.push(`${String(p.number).padStart(4)}  ${String(p.first).padStart(5)}-${String(p.last).padEnd(5)} ${p.kind.padEnd(6)} ${p.label.slice(0, 110)}`); }
  return lines;
}

// Chooses what to keep: the selected check parts, every setup part, every import and summary, and the declarations they need.
export function chooseKept(read, sel) {
  const parts = read.parts.filter((p) => p.role === 'part');
  const matches = (p) => (sel.patterns || []).some((pt) => (/^re:/.test(pt) ? new RegExp(pt.slice(3), 'i').test(p.text) : p.text.toLowerCase().includes(pt.toLowerCase())))
    || (sel.lines || []).some(([a, b]) => p.first <= b && p.last >= a) || (sel.parts || []).includes(p.number) || (sel.sections || []).includes(p.section);
  const selected = parts.filter((p) => p.checks && matches(p));
  const kept = new Set(read.parts.filter((p) => p.role === 'import' || p.role === 'summary' || (p.role === 'part' && !p.checks)));
  selected.forEach((p) => kept.add(p));
  const byName = new Map(); for (const d of read.parts) if (d.role === 'declaration') for (const n of d.names) { if (!byName.has(n)) byName.set(n, []); byName.get(n).push(d); }
  const need = []; const seen = new Set(); const want = (p) => { for (const n of p.uses) if (byName.has(n) && !seen.has(n)) { seen.add(n); need.push(n); } };
  [...kept].forEach(want);
  while (need.length) { const n = need.pop(); for (const d of byName.get(n)) if (!kept.has(d)) { kept.add(d); want(d); } }
  // A dropped part that assigns or mutates something a kept part reads is a likely missing piece: say so.
  const keptUses = new Set(); for (const p of kept) for (const n of p.uses) keptUses.add(n);
  const notes = []; for (const p of parts) if (!kept.has(p)) { const hit = [...p.writes].filter((n) => byName.has(n) && keptUses.has(n) && byName.get(n).every((d) => kept.has(d))); if (hit.length) notes.push(`NOTE: ${hit.join(', ')} is read by a kept part and changed by dropped part ${p.number} (lines ${p.first}-${p.last}: ${p.label.slice(0, 60)}); add a pattern or --part ${p.number} to keep it`); }
  return { kept, selected, notes };
}

// Builds the copy's text: kept statements on their own lines, dropped ones as blank lines; relative imports and import.meta.url made absolute.
export function buildCopy(read, kept, realFile) {
  const url = pathToFileURL(realFile).href; const dir = url.slice(0, url.lastIndexOf('/') + 1);
  const edits = [];
  const visit = (n) => {
    if (ts.isImportDeclaration(n) && ts.isStringLiteral(n.moduleSpecifier) && /^\./.test(n.moduleSpecifier.text)) edits.push([n.moduleSpecifier.getStart(read.sf), n.moduleSpecifier.end, JSON.stringify(new URL(n.moduleSpecifier.text, dir).href)]);
    if (ts.isCallExpression(n) && n.expression.kind === ts.SyntaxKind.ImportKeyword && n.arguments[0] && ts.isStringLiteralLike(n.arguments[0]) && /^\./.test(n.arguments[0].text)) edits.push([n.arguments[0].getStart(read.sf), n.arguments[0].end, JSON.stringify(new URL(n.arguments[0].text, dir).href)]);
    if (ts.isPropertyAccessExpression(n) && ts.isMetaProperty(n.expression)) { const k = n.name.text; if (k === 'url') edits.push([n.getStart(read.sf), n.end, JSON.stringify(url)]); else if (k === 'filename') edits.push([n.getStart(read.sf), n.end, JSON.stringify(realFile)]); else if (k === 'dirname') edits.push([n.getStart(read.sf), n.end, JSON.stringify(resolve(realFile, '..'))]); }
    ts.forEachChild(n, visit); };
  let text = '';
  for (const p of read.parts) {
    const raw = read.source.slice(p.fullStart, p.end);
    if (!kept.has(p)) { text += raw.replace(/[^\n]/g, ''); continue; }
    const mine = []; const save = edits.length; visit(p.node); mine.push(...edits.splice(save));
    let t = raw; for (const [a, b, rep] of mine.sort((x, y) => y[0] - x[0])) t = t.slice(0, a - p.fullStart) + rep + t.slice(b - p.fullStart);
    text += t;
  }
  return text + read.source.slice(read.parts.length ? read.parts[read.parts.length - 1].end : 0).replace(/[^\n]/g, '');
}

// Runs a copy's text with node from the project folder and returns its summary line, its FAIL lines, its exit code and its stderr tail.
export function runCopy(text) {
  const dir = mkdtempSync(join(tmpdir(), 'rules-block-')); const file = join(dir, 'rules-block-copy.mjs'); writeFileSync(file, text);
  const t0 = Date.now(); const cleanup = () => { try { rmSync(dir, { recursive: true, force: true }); } catch (e) { /* already gone */ } };
  return new Promise((done) => {
    const child = spawn(process.execPath, [file], { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] });
    let buf = ''; const fails = []; let summary = null; let err = '';
    const eat = (line) => { if (/^FAIL\b/.test(line)) fails.push(line); else if (/^\d+ passed, \d+ failed$/.test(line)) summary = line; };
    child.stdout.on('data', (d) => { buf += d; let i; while ((i = buf.indexOf('\n')) >= 0) { eat(buf.slice(0, i)); buf = buf.slice(i + 1); } });
    child.stderr.on('data', (d) => { err = (err + d).slice(-3000); });
    child.on('close', (code, signal) => { if (buf) eat(buf); cleanup(); done({ summary, fails, code: code === null ? 1 : code, signal, err, seconds: Math.round((Date.now() - t0) / 100) / 10 }); });
    child.on('error', (e) => { cleanup(); done({ summary: null, fails, code: 1, err: String(e), seconds: 0 }); });
  });
}

// Reads the command line into a selection (patterns, line ranges, part numbers, section ids).
function parseArgs(argv) {
  const sel = { patterns: [], lines: [], parts: [], sections: [] }; let file = 'tests/logic.test.mjs'; let list = false; let selftest = false; let allowNote = false; let bad = null;
  for (let i = 0; i < argv.length; i++) { const a = argv[i];
    if (a === '--list') list = true; else if (a === '--allow-note') allowNote = true; else if (a === '--selftest') selftest = true; else if (a === '--file') file = argv[++i];
    else if (a === '--lines') { const m = /^(\d+)-(\d+)$/.exec(argv[++i] || ''); if (m) sel.lines.push([+m[1], +m[2]]); else bad = '--lines wants A-B'; }
    else if (a === '--part') { for (const x of String(argv[++i] || '').split(',')) { if (/^\d+$/.test(x)) sel.parts.push(+x); else bad = '--part wants numbers'; } }
    else if (a === '--section') sel.sections.push(String(argv[++i] || '')); else if (a.startsWith('--')) bad = 'unknown flag ' + a; else sel.patterns.push(a); }
  return { sel, file, list, selftest, allowNote, bad };
}

// The command: list, or keep and run.
async function main(argv) {
  const { sel, file, list, selftest, allowNote, bad } = parseArgs(argv);
  if (selftest) return selfTest();
  const real = resolve(ROOT, file);
  if (bad || (!list && !sel.patterns.length && !sel.lines.length && !sel.parts.length && !sel.sections.length)) { console.log((bad ? bad + '\n' : '') + 'usage: node tools/rules-block.mjs --list | <pattern ...> | --lines A-B | --part N | --section ID [--allow-note] | --selftest'); return 2; }
  const read = readParts(readFileSync(real, 'utf8'));
  if (list) { console.log(listParts(read).join('\n')); const n = read.parts.filter((p) => p.role === 'part').length; console.log(`${n} parts (${read.parts.filter((p) => p.kind === 'block').length} blocks, ${read.parts.filter((p) => p.kind === 'loop').length} loops, ${read.parts.filter((p) => p.kind === 'check').length} lone checks, ${read.parts.filter((p) => p.kind === 'setup').length} setup parts always kept), ${read.parts.filter((p) => p.role === 'declaration').length} declarations`); return 0; }
  const { kept, selected, notes } = chooseKept(read, sel);
  if (!selected.length) { console.log('no check part matches ' + JSON.stringify([...sel.patterns, ...sel.lines.map((l) => l.join('-')), ...sel.parts, ...sel.sections])); return 2; }
  console.log(`rules-block: running ${selected.length} check part(s) (${selected.map((p) => p.number).join(', ')}), with ${[...kept].filter((p) => p.role === 'declaration').length} declarations and ${[...kept].filter((p) => p.role === 'part' && !p.checks).length} setup parts kept`);
  notes.forEach((n) => console.log(n));
  const r = await runCopy(buildCopy(read, kept, real));
  if (r.summary) console.log(r.summary); else console.log('no summary line (the copy stopped early)' + (r.err ? ':\n' + r.err.split('\n').slice(-12).join('\n') : ''));
  r.fails.forEach((f) => console.log(f));
  console.log(`exit code ${r.code} (${r.seconds} s)`);
  // A NOTE means a kept part may have read a table a dropped part never filled, so a pass could be a pass on nothing: the run exits 3
  // (not the copy's 0) unless --allow-note says the reader has looked and the NOTE does not matter. A failure (1) is still 1.
  // The line says "exit code 3" only when the run returns 3 (pass NQ, F4, after round three's code read): a failing copy with a NOTE
  // exits 1, and until F4 its last line still said "exit code 3".
  if (notes.length && !allowNote) { const three = r.code === 0 && !!r.summary; console.log(`${three ? 'exit code 3: ' : ''}${notes.length} NOTE(s) above; a check may have passed on a table no kept part fills. Add the dropped part (a pattern or --part N), or run again with --allow-note if the NOTE does not matter.`); return three ? 3 : (r.summary ? r.code : (r.code || 1)); }
  return r.summary ? r.code : (r.code || 1);
}

// The self-test: a small block known to pass runs and shows no failure; a copy of it with one wrong expectation fails; --list names
// at least as many parts as the file has top-level blocks. It never runs the whole test.
async function selfTest() {
  let passed = 0, failed = 0; const ok = (name, cond, info) => { if (cond) { passed++; console.log('PASS - ' + name); } else { failed++; console.log('FAIL - ' + name + (info !== undefined ? '  ' + JSON.stringify(info).slice(0, 600) : '')); } };
  const real = resolve(ROOT, 'tests/logic.test.mjs'); const src = readFileSync(real, 'utf8'); const read = readParts(src);
  const KEY = 'same seed gives identical question';
  // 1. A small block known to pass.
  const a = chooseKept(read, { patterns: [KEY] });
  const run1 = await runCopy(buildCopy(read, a.kept, real));
  ok('a small known block (' + KEY + ') runs alone and passes', a.selected.length === 1 && run1.code === 0 && /^1 passed, 0 failed$/.test(run1.summary || '') && run1.fails.length === 0, { sel: a.selected.length, run1 });
  console.log('  its summary line: ' + run1.summary);
  // 1b. A check that needs a shared declaration (att, made just above it) keeps what it needs and passes.
  const b = chooseKept(read, { patterns: ['attempt has 5 core questions'] }); const run1b = await runCopy(buildCopy(read, b.kept, real));
  ok('a lone check that needs a shared declaration (attempt has 5 core questions, with its att) keeps it and passes', b.selected.length === 1 && [...b.kept].some((d) => d.role === 'declaration' && d.names.includes('att')) && run1b.code === 0 && /^1 passed, 0 failed$/.test(run1b.summary || ''), run1b);
  // 1c. A check that needs what a dropped loop computes is flagged by a NOTE naming the loop, not left to fail without a word.
  const c = chooseKept(read, { patterns: ["every pre-K bank's answer is derived again"] });
  ok("a check that reads what the dropped main loop computes is flagged: a NOTE names the loop's part", c.notes.length >= 1 && c.notes.some((n) => /PREK_UNCAUGHT/.test(n) && /for \(const \[genId, gen\] of Object\.entries\(L\.GENERATORS\)\)/.test(n)), c.notes);
  // 2. The same block with one planted wrong expectation must fail, and only its own check.
  const at = src.indexOf("ok('" + KEY + "'"); const endAt = src.indexOf('\n', at); const line = src.slice(at, endAt); const wrongLine = line.replace(' === ', ' !== ');
  const planted = src.slice(0, at) + wrongLine + src.slice(endAt);
  ok('the planted copy really differs (one wrong expectation)', wrongLine !== line && planted !== src);
  const pread = readParts(planted); const p = chooseKept(pread, { patterns: [KEY] });
  const run2 = await runCopy(buildCopy(pread, p.kept, real));
  ok('the planted wrong expectation fails alone, with its FAIL line and exit code 1', run2.code === 1 && /^0 passed, 1 failed$/.test(run2.summary || '') && run2.fails.length === 1 && run2.fails[0].includes(KEY), run2);
  console.log('  its summary line: ' + run2.summary);
  // 3. The listing names at least as many parts as the file has top-level blocks.
  const col0 = src.split('\n').filter((l) => /^\{/.test(l)).length; const listed = listParts(read).filter((l) => !l.startsWith('==')).length;
  ok(`--list names ${listed} parts, at least the ${col0} top-level { blocks of the file`, listed >= col0 && read.parts.filter((x) => x.kind === 'block').length >= col0 - 5, { listed, col0 });
  ok('every listed part has a number, its lines and a first comment or words', listParts(read).filter((l) => !l.startsWith('==')).every((l) => /^\s+\d+\s+\d+-\d+\s+(block|loop|check|setup)\s+\S/.test(l)));
  // 3b. A kept check that reads a table a dropped part fills with Object.assign: a NOTE names it, the run exits 3 though the copy passes,
  // --allow-note keeps the copy's 0, and naming the filler too leaves no NOTE. A made test in the temporary folder stands for the table.
  const dir = mkdtempSync(join(tmpdir(), 'rules-block-self-')); const made = join(dir, 'made.test.mjs');
  writeFileSync(made, ["let pass = 0, fail = 0;", "const ok = (l, c) => { console.log((c ? 'PASS' : 'FAIL') + ' - ' + l); c ? pass++ : fail++; };", "const SHARED = {};",
    "{ // fills the shared table", "  Object.assign(SHARED, { a: 1 }); ok('the filler block', true); }", "{ // reads the shared table", "  ok('the reader block passes on any table', Object.keys(SHARED).length >= 0); }",
    "{ // reads the shared table and wants its key", "  ok('a check that fails on an empty table', Object.keys(SHARED).length === 1); }",
    "console.log(`\n${pass} passed, ${fail} failed`);", "process.exitCode = fail ? 1 : 0;", ''].join('\n'));
  const cli = (...a) => spawnSync(process.execPath, [fileURLToPath(import.meta.url), '--file', made, ...a], { encoding: 'utf8', cwd: ROOT });
  const mread = readParts(readFileSync(made, 'utf8')); const mnotes = chooseKept(mread, { patterns: ['the reader block'] }).notes;
  ok('a dropped part that fills a shared table with Object.assign is seen as a write: a NOTE names the table and the filler', mnotes.length === 1 && /SHARED/.test(mnotes[0]) && /part 1/.test(mnotes[0]), mnotes);
  const r1 = cli('the reader block'); const r2 = cli('the reader block', '--allow-note'); const r3 = cli('the reader block', 'the filler block');
  ok('a passing run with a NOTE exits 3; --allow-note keeps the copy\'s 0; naming the filler too leaves no NOTE and exits 0', r1.status === 3 && /1 passed, 0 failed/.test(r1.stdout) && /exit code 3/.test(r1.stdout) && r2.status === 0 && r3.status === 0 && !/NOTE/.test(r3.stdout) && /2 passed, 0 failed/.test(r3.stdout), { r1: [r1.status, r1.stdout], r2: r2.status, r3: [r3.status, r3.stdout] });
  // A failing copy with a NOTE exits 1, and no line says "exit code 3" (pass NQ, F4).
  const r4 = cli('a check that fails on an empty table');
  ok('a failing run with a NOTE exits 1 and does not say "exit code 3"', r4.status === 1 && /0 passed, 1 failed/.test(r4.stdout) && /NOTE/.test(r4.stdout) && /exit code 1 /.test(r4.stdout) && !/exit code 3/.test(r4.stdout), [r4.status, r4.stdout]);
  rmSync(dir, { recursive: true, force: true });
  // 4. The copy is not left behind, and nothing is written into the tree.
  ok('the copy is written outside the tree and removed (no rules-block file in tests/)', !readFileSync(new URL('../.gitignore', import.meta.url), 'utf8').includes('rules-block') && !(execSync('ls -a tests').toString().includes('rules-block')));
  console.log(`\n${passed} passed, ${failed} failed`);
  return failed ? 1 : 0;
}

if (process.argv[1] && process.argv[1].endsWith('rules-block.mjs')) process.exitCode = await main(process.argv.slice(2));
