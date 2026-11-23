// Copyright (c) 2026 iECHO, LLC. All rights reserved.
// -----------------------------------------------------------------------------------------------------------------
// Undo each part of a change alone, in a copy, and run a test: a part whose undoing still passes has no check that fails without it
// (pass NX, the week's flow review's first recommendation; the engineer brief's undo-alone proof, made one tool).
//
// In plain terms: a check proves a fix only if the check fails without the fix. Each pass of this week found a new check that could
// not fail, or held less than its record said, and the lead proved every fix by hand, with throwaway scripts that undid one part at a
// time in a copy and ran the tests. This tool does that in one command. Given the last delivered tree (--base) and the changed tree
// (--tree, by default the tree this file sits in), it finds the changed parts of the files named and, for each part alone, makes a
// temporary copy of the changed tree with only that part put back as the base has it, runs the test at the copy's top folder, and
// names every part whose undoing still passes: a survivor, a part no check fails without.
//
// A part: a hunk, a run of changed lines with no unchanged line between them, as the system's diff -U0 prints them (the way
// tools/coverage-receipt.mjs reads changed lines), held to undo the changed file to the base's exactly before anything runs. A hunk
// can hold several conditions and fail because of one, so --split also undoes each changed line of a hunk alone: a line the change
// added is taken out, a line it removed is put back where it stood, and a line it changed is given its old words back (each new line
// is paired, in order, with an old line of its hunk that shares at least half its words and marks). A new file is one hunk, undone
// by deleting it, and --split takes its lines out one at a time; a deleted file is one part, put back whole.
// The files: --files names them (a list parted by commas, the flag given as often as wanted): each entry a path from the tree's top,
// a folder ending in /, or a pattern with * (within one folder), ** (across folders) and ?; an entry may end in :A-B to keep only the
// parts touching its lines A to B in the changed tree. An entry that names no file of either tree is named and the run stops (exit 2)
// before any copy is made. By default: every changed .mjs under tools/ and tests/ (the browser tests' output folders, tests/e2e/out
// and tests/e2e/art, aside) and every changed .mjs directly in src/.
// The test: --test '<command>', run by bash at the copy's top folder; or --map, a JSON object, given inline or as a file, whose keys
// are paths or patterns as above and whose values are commands: a part's file takes the first key that matches it, and --test when
// none does. A file no key matches, with no --test, is under no test: its parts are named as survivors and never run. A run passes when
// its command exits 0, so a test that can exit 0 without running its checks is given its own pass condition, as check.sh gives each step
// one: undone, a tool's run guard makes its self-test print nothing and exit 0, so a self-test runs as 'node tools/<tool>.mjs --selftest
// > out.txt 2>&1; cat out.txt; tail -1 out.txt | grep -q " 0 failed"' (the file is written in the copy and removed with it), its whole
// output passed on so a crash's stack reaches the tool (since round one's code read of pass NX: a form that passes on its last line
// alone leaves a crash only the Node.js version line, so no throw can be read). A test that reads a
// built file (dist/, index.html, the browser tests' pages) builds it in its own command (./build.sh && node tests/e2e/make-page.mjs && ...),
// since a copy holds the tree's built files as they were built, and an undone part of the source would never reach them.
//
// How it runs: first the test runs on a copy of the changed tree as it is, each command the parts will use, and the tool refuses
// (exit 2) if any fails or reaches its limit there, since a failure after a part is undone could not be told from it. Then each part
// alone. Each run has a time limit (--timeout, in seconds; ten minutes unless given, since a limit is there to catch a hang, not a
// slow machine, pass KU's rule, so a longer test, a browser walk, is given its own); a run that reaches it is stopped with every
// process it started, and named, and a process a run leaves behind is ended when the run ends. Each copy is made fresh for its run
// and removed after it: the whole tree but its top .git and node_modules folders, with the files' times and links kept as they are,
// in a folder of its own inside the system's temporary folder or --work's (which may not sit inside the tree); the node_modules folder
// the tree finds, its own or a parent folder's, is linked beside the copy, so the copy's code finds the same packages. Stopped by
// SIGINT or SIGTERM, the tool ends its test's processes and removes its copies before it exits.
// Verdicts: caught (the test failed, and the file still parses with the part undone); survived (the test passed); stopped at its
// limit; broke its file's parse (the test failed, and with the part undone the file does not parse, read by node --check for .mjs,
// .js and .cjs and by TypeScript's parser for .jsx, so the failure may be the parse alone, not a check). A part caught by a throw is
// caught, and the throw's error line is shown, so a reader can tell a check that failed from a crash; the summary counts apart the
// caught parts whose run crashed or printed nothing (a throw's error line read, the Node.js version line alone, or no line), each
// for a reader to read by eye, since a crash can be a check's own failure or a part's undoing that no check reads. A part whose
// changed lines are all comments or blank lines, outside every template, read by TypeScript's parser (the global install, which
// tools/rules-block.mjs reads too), is named and not run, since no code changed; --comments runs those too.
//
// What it prints: the files and parts in scope, the run on the tree as it is, then a line for each part ([k/N], its file, its lines
// in the changed tree or where its lines were removed, and its first changed line that is not blank, + for a line the changed tree
// has and - for one it removed) and its verdict, its seconds and the test's last line (the Node.js version line a crash ends with read
// past); then every part that keeps the exit from 0, again, and a summary line.
// Exit codes: 0, no part survived, none was stopped at its limit and no hunk broke its file's parse (a line --split cannot undo
// without breaking the parse is shown, and its hunk's own run stands for it); 1, a part survived or is under no test; 2, refused: a
// bad request, an unknown --files entry, nothing in scope changed, or the test failing or stopped on the tree as it is; 3, no part
// survived, but a run was stopped at its limit or a hunk broke its file's parse, so not every part is proven.
// What it does not see: a condition inside a line (the smallest part is a whole line, so a line can hide a condition as a hunk can
// hide a line); a check outside the test it is given; a test that fails now and then (the tree as it is runs once). A test's own
// checks are no parts of the code it holds: undone alone, a check of a test leaves the test passing with one check fewer, so a run
// over a test file names its checks as survivors, and --files :A-B keeps a run to the code.
//
// Run (from the project folder):
//   node tools/undo-alone.mjs --base <the last delivered tree> --test '<command>'          every changed .mjs in tools, tests and src
//   node tools/undo-alone.mjs --base <dir> --files tools/blind-read.mjs --split \
//     --test 'node tools/blind-read.mjs --selftest > out.txt 2>&1; cat out.txt; tail -1 out.txt | grep -q " 0 failed"'
//   node tools/undo-alone.mjs --base <dir> --files src/logic.mjs:4419-4480 --split --test 'node --max-old-space-size=4096 tools/rules-block.mjs <part>'
//   node tools/undo-alone.mjs --base <dir> --map '{"src/logic.mjs": "node tools/rules-block.mjs <part>", "tools/**": "..."}'
//   node tools/undo-alone.mjs --selftest        made trees in a temporary folder, 10 to 30 seconds; PASS and FAIL lines, then a summary
// -----------------------------------------------------------------------------------------------------------------
import { spawn, spawnSync, execSync } from 'node:child_process';
import { chmodSync, cpSync, existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, realpathSync, renameSync, rmSync, statSync, symlinkSync, utimesSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Where this file is, and the tree it sits in, the default --tree.
const SELF = fileURLToPath(import.meta.url);
const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
// Each run's time limit in seconds when --timeout gives none: ten minutes.
const DEFAULT_SECONDS = 600;
// What a copy leaves out of the tree, at its top: git's history, and the installed packages, which are linked beside the copy instead.
const TOP_LEFT_OUT = new Set(['.git', 'node_modules']);
// What the walk over a tree's files leaves out: the same two folders, and the browser tests' output folders, which hold pictures and
// pages, never code.
const WALK_LEFT_OUT = /^(?:\.git|node_modules|tests\/e2e\/out|tests\/e2e\/art)$/;
// The files undone when --files names none: every .mjs under tools/ and tests/, and every .mjs directly in src/.
const DEFAULT_SCOPE = [/^tools\/.+\.mjs$/, /^tests\/.+\.mjs$/, /^src\/[^/]+\.mjs$/];
// Code files, whose comment lines TypeScript's parser tells from their code.
const CODE = /\.(?:mjs|js|cjs|jsx)$/;

// The test processes running now and the temporary folders made, so a stop by SIGINT or SIGTERM ends the first and removes the second.
const LIVE = { children: new Set(), dirs: new Set() };
const endGroup = (child, signal) => { try { process.kill(-child.pid, signal); } catch (e) { /* the group has ended already */ } };
function stopAll() { for (const child of LIVE.children) endGroup(child, 'SIGKILL'); for (const dir of LIVE.dirs) rmSync(dir, { recursive: true, force: true }); }

// TypeScript's parser, the global install (npm root -g), loaded only when a code file's comment lines or a .jsx file's parse are read.
let tsModule = null;
const typescript = () => tsModule || (tsModule = createRequire(import.meta.url)(execSync('npm root -g').toString().trim() + '/typescript'));

// Small words for the printed lines: a count with its noun, a run of line numbers, and a line cut to fit one printed line.
const count = (n, one, many) => n + ' ' + (n === 1 ? one : many);
const span = (a, b) => (a === b ? String(a) : a + '-' + b);
const shown = (line, width = 120) => { const t = String(line).trim(); return t.length > width ? t.slice(0, width - 3) + '...' : t; };

// A --files or --map entry as a pattern over a path from the tree's top: * within one folder, ** across folders, ? one character; an
// entry with none of them is the path itself, and an entry ending in / is everything under that folder.
function patternOf(entry) {
  const p = entry.endsWith('/') ? entry + '**' : entry; let re = '';
  for (let i = 0; i < p.length; i++) {
    if (p.startsWith('**/', i)) { re += '(?:.*/)?'; i += 2; } else if (p.startsWith('**', i)) { re += '.*'; i += 1; }
    else if (p[i] === '*') re += '[^/]*'; else if (p[i] === '?') re += '[^/]'; else re += p[i].replace(/[.+^${}()|[\]\\]/g, '\\$&');
  }
  return new RegExp('^' + re + '$');
}

// Every file of a tree, as a path from its top with forward slashes, the folders WALK_LEFT_OUT names left out; a link is not followed.
function filesUnder(root) {
  const out = [];
  const walk = (rel) => { for (const name of readdirSync(rel ? join(root, rel) : root)) { const r = rel ? rel + '/' + name : name; if (WALK_LEFT_OUT.test(r)) continue;
    const st = lstatSync(join(root, r)); if (st.isDirectory()) walk(r); else if (st.isFile()) out.push(r); } };
  walk(''); return out;
}

// A text cut into its lines, each keeping its line break, so the lines joined give the text back exactly (a last line with none too).
const linesOf = (text) => text.match(/[^\n]*\n|[^\n]+$/g) || [];

// The hunks of one file, from the system's diff -U0: each a run of the base's lines (where it starts, counted from 0, and how many)
// and the run of the changed tree's lines that took its place. A file only one tree has is one hunk of all its lines.
function hunksOf(baseFile, treeFile, baseLines, treeLines) {
  if (!baseLines || !treeLines) return [{ baseStart: 0, baseLen: baseLines ? baseLines.length : 0, treeStart: 0, treeLen: treeLines ? treeLines.length : 0 }];
  const r = spawnSync('diff', ['-U0', baseFile, treeFile], { encoding: 'utf8', maxBuffer: 1 << 30 });
  if (r.status !== 0 && r.status !== 1) throw new Error('diff could not compare ' + baseFile + ' and ' + treeFile + ': ' + String(r.stderr || r.error || 'exit ' + r.status).trim());
  return [...r.stdout.matchAll(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/gm)].map((m) => {
    const a = Number(m[1]); const b = m[2] === undefined ? 1 : Number(m[2]); const c = Number(m[3]); const d = m[4] === undefined ? 1 : Number(m[4]);
    return { baseStart: b ? a - 1 : a, baseLen: b, treeStart: d ? c - 1 : c, treeLen: d };
  });
}

// One change a part makes: the run of the changed tree's lines it replaces and the base's lines put in their place.
const changeOf = (h, baseLines) => ({ treeStart: h.treeStart, treeLen: h.treeLen, put: baseLines.slice(h.baseStart, h.baseStart + h.baseLen) });
// The changed tree's lines with some changes put back as the base has them, the last first, so each earlier one keeps its place.
function undone(treeLines, changes) {
  let lines = treeLines;
  for (const ch of [...changes].sort((x, y) => y.treeStart - x.treeStart)) lines = lines.slice(0, ch.treeStart).concat(ch.put, lines.slice(ch.treeStart + ch.treeLen));
  return lines;
}

// Each file in scope that differs from the base, read whole from both trees, with its hunks, which must undo the changed file to the
// base's text exactly, or the run stops; a file that is not text (a zero byte in its first 8,000) is named and left out, since it has
// no lines. The hunks come from hunksOf unless the self-test hands in a planted reader.
function readChanges(base, tree, scope, say, hunker = hunksOf) {
  const files = [];
  for (const file of scope) {
    const bp = join(base, file); const tp = join(tree, file); const inB = existsSync(bp); const inT = existsSync(tp);
    const bBuf = inB ? readFileSync(bp) : null; const tBuf = inT ? readFileSync(tp) : null;
    if (bBuf && tBuf && bBuf.equals(tBuf)) continue;
    if ([bBuf, tBuf].some((b) => b && b.subarray(0, 8000).includes(0))) { say('undo-alone: ' + file + ' is not text, so it is left out: it has no lines to undo one by one'); continue; }
    const baseText = bBuf ? bBuf.toString('utf8') : null; const treeText = tBuf ? tBuf.toString('utf8') : null;
    const baseLines = baseText === null ? null : linesOf(baseText); const treeLines = treeText === null ? null : linesOf(treeText);
    const hunks = hunker(bp, tp, baseLines, treeLines);
    if (!hunks.length || undone(treeLines || [], hunks.map((h) => changeOf(h, baseLines || []))).join('') !== (baseText === null ? '' : baseText)) { say('undo-alone: refused: the hunks diff gave for ' + file + ' do not undo it to the base, so a part would be put back in the wrong place'); return null; }
    files.push({ file, inB, inT, baseText, treeText, baseLines, treeLines, hunks });
  }
  return files;
}

// The lines of a code file that hold nothing but comments and blank space, read by TypeScript's parser: every token's comments are
// marked (those that start on a line of their own), and every template's own text, so a line of a template is text even when it is
// blank or starts with //. Returns the lines' numbers, counted from 0; an absent file has none.
function quietLines(text, file) {
  const quiet = new Set(); if (text === null) return quiet;
  const ts = typescript(); const K = ts.SyntaxKind; const TEMPLATE = new Set([K.NoSubstitutionTemplateLiteral, K.TemplateHead, K.TemplateMiddle, K.TemplateTail]);
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, file.endsWith('.jsx') ? ts.ScriptKind.JSX : ts.ScriptKind.JS);
  const comment = new Uint8Array(text.length + 1); const template = new Uint8Array(text.length + 1);
  const visit = (node) => { for (const r of ts.getLeadingCommentRanges(text, node.pos) || []) comment.fill(1, r.pos, r.end);
    if (TEMPLATE.has(node.kind)) template.fill(1, node.getStart(sf), node.end); for (const child of node.getChildren(sf)) visit(child); };
  visit(sf);
  let at = 0;
  linesOf(text).forEach((line, i) => { let still = true;
    for (let k = 0; k < line.length && still; k++) { const c = line.charCodeAt(k); const space = c === 32 || c === 9 || c === 10 || c === 13 || c === 11 || c === 12 || c === 160 || c === 65279;
      if (template[at + k] || (!space && !comment[at + k])) still = false; }
    if (still) quiet.add(i); at += line.length; });
  return quiet;
}

// The words and marks of a line, for telling how alike two lines are.
const wordsOf = (line) => line.match(/[A-Za-z_$][\w$]*|\d+|[^\s\w$]/g) || [];
// How alike two lines are, from 0 to 1: twice the words and marks they share over all they hold (a word counted as often as both hold it).
function alike(a, b) {
  const left = new Map(); for (const w of a) left.set(w, (left.get(w) || 0) + 1);
  let shared = 0; for (const w of b) { const n = left.get(w); if (n) { shared++; left.set(w, n - 1); } }
  return (2 * shared) / Math.max(1, a.length + b.length);
}
// The single changed lines of a hunk, each to be undone alone: a line the change added (taken out), a line it removed (put back where it
// stood) or a line it changed (given its old words back). Each new line is paired with an old one, in order, by the least-cost alignment:
// a pair costs 1 less its likeness and a line left alone a quarter, so two lines pair only where they share more than half their words.
function splitUnits(h, baseLines, treeLines) {
  const D = baseLines.slice(h.baseStart, h.baseStart + h.baseLen).map(wordsOf); const I = treeLines.slice(h.treeStart, h.treeStart + h.treeLen).map(wordsOf);
  const n = D.length; const m = I.length; const ALONE = 0.25; const pairCost = (i, j) => 1 - alike(D[i], I[j]);
  const cost = Array.from({ length: n + 1 }, () => new Float64Array(m + 1));
  for (let i = 0; i <= n; i++) for (let j = 0; j <= m; j++) if (i || j) cost[i][j] = Math.min(i ? cost[i - 1][j] + ALONE : Infinity, j ? cost[i][j - 1] + ALONE : Infinity, i && j ? cost[i - 1][j - 1] + pairCost(i - 1, j - 1) : Infinity);
  // The alignment read back from its end: a pair where the pair's cost gives the cell, else a new line alone, else an old line alone.
  const steps = [];
  for (let i = n, j = m; i || j;) {
    if (i && j && Math.abs(cost[i][j] - (cost[i - 1][j - 1] + pairCost(i - 1, j - 1))) < 1e-9) { steps.unshift(['changed', i - 1, j - 1]); i--; j--; }
    else if (j && Math.abs(cost[i][j] - (cost[i][j - 1] + ALONE)) < 1e-9) { steps.unshift(['added', -1, j - 1]); j--; }
    else { steps.unshift(['removed', i - 1, -1]); i--; }
  }
  // Each step as a part: an old line put back goes in after the hunk's new lines that come before it.
  let before = 0; const units = [];
  for (const [kind, i, j] of steps) {
    if (kind === 'removed') { units.push({ changes: [{ treeStart: h.treeStart + before, treeLen: 0, put: [baseLines[h.baseStart + i]] }], treeIdx: [], baseIdx: [h.baseStart + i], after: h.treeStart + before }); continue; }
    units.push({ changes: [{ treeStart: h.treeStart + j, treeLen: 1, put: kind === 'changed' ? [baseLines[h.baseStart + i]] : [] }], treeIdx: [h.treeStart + j], baseIdx: kind === 'changed' ? [h.baseStart + i] : [], after: h.treeStart + j });
    before++;
  }
  return units;
}

// Where a part is: its lines in the changed tree, or where its lines were removed; and with that, a new or deleted file said so, and a
// line of --split with its hunk's place beside it.
const placeOf = (u) => (u.treeIdx.length ? span(u.treeIdx[0] + 1, u.treeIdx[u.treeIdx.length - 1] + 1) : u.after ? 'removed after line ' + u.after : 'removed at the top');
function whereOf(u) {
  if (!u.F.inT) return '(deleted)';
  if (u.level === 'line') return placeOf(u) + ' (a line of the hunk at ' + u.hunkWhere + ')';
  return placeOf(u) + (u.F.inB ? '' : ' (new)');
}
// How a part is named on its line: its file, where it is, and its first changed line that is not blank, + for a line the changed tree
// has and - for one it removed.
function describe(u) {
  const added = u.treeIdx.map((i) => u.F.treeLines[i]).find((l) => l.trim()); const gone = u.baseIdx.map((i) => u.F.baseLines[i]).find((l) => l.trim());
  return u.file + ' ' + whereOf(u) + ': ' + (added !== undefined ? '+ ' + shown(added) : gone !== undefined ? '- ' + shown(gone) : '(blank lines only)');
}

// The parts of the changed files, in order: each hunk, and with --split each of its changed lines when it holds more than one, each with
// the test command its file takes and whether its lines are all comments or blank; under --files' :A-B, only the parts touching them.
function partsOf(files, o, limits) {
  const parts = [];
  for (const F of files) {
    const command = (o.map && (o.map.find((e) => e.re.test(F.file)) || {}).command) || o.test || null;
    const readQuiet = !o.comments && CODE.test(F.file); const treeQuiet = readQuiet ? quietLines(F.treeText, F.file) : new Set(); const baseQuiet = readQuiet ? quietLines(F.baseText, F.file) : new Set();
    const L = limits.get(F.file);
    const touches = (u) => !Array.isArray(L) || L.some(([a, b]) => (u.treeIdx.length ? u.treeIdx.some((i) => i + 1 >= a && i + 1 <= b) : u.after >= a - 1 && u.after <= b));
    for (const h of F.hunks) {
      const whole = { F, file: F.file, level: 'hunk', command, changes: [changeOf(h, F.baseLines || [])], treeIdx: Array.from({ length: h.treeLen }, (_, i) => h.treeStart + i), baseIdx: Array.from({ length: h.baseLen }, (_, i) => h.baseStart + i), after: h.treeStart, deletesFile: !F.inB };
      const units = [whole];
      if (o.split && F.inT) { const lines = splitUnits(h, F.baseLines || [], F.treeLines); if (lines.length > 1) units.push(...lines.map((s) => ({ ...s, F, file: F.file, level: 'line', command, hunkWhere: placeOf(whole), deletesFile: false }))); }
      for (const u of units) { u.quiet = readQuiet && u.treeIdx.every((i) => treeQuiet.has(i)) && u.baseIdx.every((i) => baseQuiet.has(i)); if (touches(u)) parts.push(u); }
    }
  }
  return parts;
}

// The node_modules folder the tree's code finds its packages in: its own, or the nearest one a folder above it holds, as Node looks.
function packagesOf(dir) { for (let d = resolve(dir); ; d = dirname(d)) { const p = join(d, 'node_modules'); if (existsSync(p) && statSync(p).isDirectory()) return realpathSync(p); if (dirname(d) === d) return null; } }
// A fresh copy of the tree for one run: every file but the top .git and node_modules folders, each file's times kept (a test may
// compare them) and each link kept as it is written, so a link inside the tree still points inside the copy.
const copyTree = (tree, at) => cpSync(tree, at, { recursive: true, verbatimSymlinks: true, preserveTimestamps: true, filter: (src) => !TOP_LEFT_OUT.has(relative(tree, src)) });
// Puts one part back in a copy as the base has it: writes its file with the part's lines undone, or deletes a new file the part is the whole of.
function applyPart(at, u) {
  const abs = join(at, u.file);
  if (u.deletesFile) { rmSync(abs, { force: true }); return; }
  mkdirSync(dirname(abs), { recursive: true }); writeFileSync(abs, undone(u.F.treeLines || [], u.changes).join(''));
}
// Whether a copy's file still parses with the part undone: node --check for .mjs, .js and .cjs, TypeScript's parser for .jsx (node reads
// no JSX). Null when it parses, when the part deleted it, or when its kind has no reader; else the reader's words.
function parseProblem(file, abs) {
  if (!existsSync(abs)) return null;
  if (file.endsWith('.jsx')) { const ts = typescript(); const d = ts.createSourceFile(file, readFileSync(abs, 'utf8'), ts.ScriptTarget.Latest, false, ts.ScriptKind.JSX).parseDiagnostics || []; return d.length ? 'TypeScript: ' + shown(ts.flattenDiagnosticMessageText(d[0].messageText, ' '), 160) : null; }
  if (!/\.(?:mjs|js|cjs)$/.test(file)) return null;
  const r = spawnSync(process.execPath, ['--check', abs], { encoding: 'utf8' }); return r.status === 0 ? null : throwOf(r.stderr) || shown(r.stderr, 160);
}

// What a run printed last, the Node.js version line a crash ends with read past (a run that printed that line alone says so); and a
// throw's error line, where a stack shows one.
function lastLineOf(out) { const all = out.split('\n').map((l) => l.trim()).filter(Boolean); const lines = all.filter((l) => !/^Node\.js v\d+(?:\.\d+)*$/.test(l));
  return lines.length ? shown(lines[lines.length - 1], 200) : all.length ? '(only the Node.js version line a crash ends with)' : '(it printed nothing)'; }
function throwOf(out) { if (!/^\s+at \S/m.test(out)) return null; const m = /^\s*(?:Uncaught\s+)?(?:[A-Z][\w$]*)?Error(?: \[[A-Z0-9_]+\])?: .*$/m.exec(out); return m ? shown(m[0], 160) : null; }

// Runs a test command by bash at a copy's top folder, in a process group of its own: a run that reaches its limit is ended with every
// process it started (SIGTERM, then SIGKILL two seconds on for any that will not stop), and any process a run leaves behind is ended
// when the run exits, so its output closes. Resolves with the exit code, whether the limit stopped it, its seconds and the last 64 KB
// of what it printed, both streams in the order they came.
function runCommand(command, cwd, seconds) {
  return new Promise((done) => {
    const began = Date.now(); let out = ''; let stopped = false;
    const child = spawn('bash', ['-c', command], { cwd, detached: true, stdio: ['ignore', 'pipe', 'pipe'] });
    LIVE.children.add(child);
    const eat = (d) => { out = (out + d).slice(-65536); }; child.stdout.on('data', eat); child.stderr.on('data', eat);
    const limit = setTimeout(() => { stopped = true; endGroup(child, 'SIGTERM'); setTimeout(() => endGroup(child, 'SIGKILL'), 2000).unref(); }, seconds * 1000);
    child.on('exit', () => endGroup(child, 'SIGKILL'));
    child.on('close', (code) => { clearTimeout(limit); LIVE.children.delete(child); done({ code: code === null ? 128 : code, stopped, seconds: (Date.now() - began) / 1000, out }); });
  });
}

// The command line read into the run's settings, or the reason it cannot run.
function parseArgs(argv) {
  const o = { base: null, tree: null, work: null, files: [], test: null, map: null, timeout: DEFAULT_SECONDS, split: false, comments: false, selftest: false, bad: null };
  let mapText = null;
  for (let i = 0; i < argv.length && !o.bad; i++) {
    const a = argv[i]; const value = () => { const v = argv[++i]; if (v === undefined || v === '') o.bad = a + ' needs a value'; return v; };
    if (a === '--base') o.base = value(); else if (a === '--tree') o.tree = value(); else if (a === '--work') o.work = value();
    else if (a === '--test') o.test = value(); else if (a === '--map') mapText = value();
    else if (a === '--files') o.files.push(...String(value() || '').split(',').map((s) => s.trim()).filter(Boolean));
    else if (a === '--timeout') { const v = Number(value()); if (Number.isFinite(v) && v > 0) o.timeout = v; else o.bad = '--timeout needs a number of seconds above 0'; }
    else if (a === '--split') o.split = true; else if (a === '--comments') o.comments = true; else if (a === '--selftest') o.selftest = true;
    else o.bad = 'unknown argument ' + a;
  }
  if (o.bad || o.selftest) return o;
  if (!o.base) o.bad = '--base is needed: the last delivered tree';
  else if (!o.test && mapText === null) o.bad = 'a test is needed: --test, or --map';
  else if (mapText !== null) {
    // --map: a JSON object inline, or a file holding one; each value a command.
    let text = mapText;
    if (!/^\s*\{/.test(text)) { if (!existsSync(text)) { o.bad = '--map ' + mapText + ' is neither a JSON object nor a file'; return o; } text = readFileSync(text, 'utf8'); }
    try {
      const m = JSON.parse(text); if (!m || typeof m !== 'object' || Array.isArray(m)) throw new Error('it is not an object');
      o.map = Object.entries(m).map(([key, command]) => { if (typeof command !== 'string' || !command.trim()) throw new Error('the command for ' + key + ' is not a command'); return { key, re: patternOf(key), command }; });
      if (!o.map.length) throw new Error('it names no file');
    } catch (e) { o.bad = '--map is not a JSON object of files and commands: ' + e.message; }
  }
  return o;
}

const USAGE = "usage: node tools/undo-alone.mjs --base <dir> [--tree <dir>] (--test '<command>' | --map <JSON or file>) [--files <paths, folders or patterns, each may end :A-B>] [--timeout <seconds>] [--split] [--comments] [--work <dir>] | --selftest";

// The whole run as the command line asks: the request read, then the self-test or the undoing.
async function main(argv, say = (line) => console.log(line)) {
  const o = parseArgs(argv);
  if (o.bad) { say('undo-alone: ' + o.bad); say(USAGE); return 2; }
  if (o.selftest) return selfTest(say);
  return undoAlone(o, say);
}

// The undoing: the trees and the files checked, the parts found, the test run on the tree as it is, then each part alone; returns the exit
// code. The hunks come from hunksOf unless the self-test hands in a planted reader.
async function undoAlone(o, say, hunker = hunksOf) {
  // The two trees and the work folder, each checked before anything is read or copied.
  const tree = resolve(o.tree || ROOT); const base = resolve(o.base); const work = resolve(o.work || tmpdir());
  for (const [flag, dir] of [['--base', base], ['--tree', tree], ['--work', work]]) if (!existsSync(dir) || !statSync(dir).isDirectory()) { say('undo-alone: refused: ' + flag + ' ' + dir + ' is not a folder'); return 2; }
  if (realpathSync(tree) === realpathSync(base)) { say('undo-alone: refused: --base and --tree are one folder, so nothing can differ'); return 2; }
  const inside = relative(realpathSync(tree), realpathSync(work)); if (!inside.startsWith('..') && !isAbsolute(inside)) { say('undo-alone: refused: --work ' + work + ' is inside the tree, which every run copies'); return 2; }
  // The files in scope: every entry --files gives must name a file of either tree, and an entry's :A-B keeps the parts touching those lines;
  // with no --files, every .mjs under tools/ and tests/ and directly in src/.
  const all = [...new Set([...filesUnder(tree), ...filesUnder(base)])].sort();
  const limits = new Map(); let scope = all.filter((f) => DEFAULT_SCOPE.some((re) => re.test(f)));
  if (o.files.length) {
    const unknown = []; const named = new Set();
    for (const entry of o.files) {
      const m = /^(.+):(\d+)-(\d+)$/.exec(entry); const given = (m ? m[1] : entry).replace(/^\.\//, ''); const path = isAbsolute(given) ? relative(tree, given) : given;
      if (m && Number(m[2]) > Number(m[3])) { say('undo-alone: refused: --files ' + entry + ' gives its lines backward'); return 2; }
      const hits = all.filter((f) => patternOf(path).test(f));
      if (!hits.length) { unknown.push(entry); continue; }
      for (const f of hits) { named.add(f); const had = limits.get(f); if (!m) limits.set(f, 'all'); else if (had !== 'all') limits.set(f, [...(had || []), [Number(m[2]), Number(m[3])]]); }
    }
    if (unknown.length) { for (const e of unknown) say('undo-alone: --files ' + e + ' names no file of the tree or the base'); say('undo-alone: refused: ' + count(unknown.length, 'entry names', 'entries name') + ' nothing, so a part meant to be undone would go unread'); return 2; }
    scope = [...named].sort();
  }
  // Each changed file's hunks, then its parts; a run with no part has nothing to prove and is refused.
  let files; try { files = readChanges(base, tree, scope, say, hunker); } catch (e) { say('undo-alone: refused: ' + e.message); return 2; }
  if (!files) return 2;
  const parts = partsOf(files, o, limits);
  if (!parts.length) { say('undo-alone: refused: ' + (files.length ? 'no part of the changed files lies in the lines --files names' : 'no file in scope differs from the base (' + count(scope.length, 'file', 'files') + ' read)') + ', so there is nothing to undo'); return 2; }
  const quiet = parts.filter((u) => u.quiet); const listed = parts.filter((u) => !u.quiet);
  say('undo-alone: base ' + base + '; tree ' + tree + "; each run's limit is " + o.timeout + ' seconds');
  say('undo-alone: ' + count(files.length, 'changed file', 'changed files') + ' in scope: ' + files.map((F) => F.file + ' (' + (F.inB ? (F.inT ? '' : 'deleted, ') : 'new, ') + count(F.hunks.length, 'hunk', 'hunks') + ')').join(', '));
  if (quiet.length) say('undo-alone: comment only, not run (--comments runs them): ' + quiet.map((u) => u.file + ' ' + whereOf(u)).join(', '));
  const W = mkdtempSync(join(work, 'undo-alone-')); LIVE.dirs.add(W);
  try {
    const packages = packagesOf(tree); if (packages) symlinkSync(packages, join(W, 'node_modules'), 'dir');
    const copy = join(W, 'copy');
    // One run in a fresh copy: the part put back (none for the tree as it is), its file's parse read, the test run, the copy removed.
    const runOnce = async (u, command) => { copyTree(tree, copy); let problem = null; if (u) { applyPart(copy, u); problem = parseProblem(u.file, join(copy, u.file)); }
      const r = await runCommand(command, copy, o.timeout); rmSync(copy, { recursive: true, force: true }); return { ...r, problem }; };
    // The test on the tree as it is, first, each command the parts will use: a failure or a stop there refuses the run.
    for (const command of [...new Set(listed.filter((u) => u.command).map((u) => u.command))]) {
      say('undo-alone: the tree as it is, before any part is undone: ' + command);
      const r = await runOnce(null, command); const thrown = throwOf(r.out);
      if (r.stopped || r.code !== 0) { say('undo-alone: refused: ' + (r.stopped ? 'the test was stopped at its ' + o.timeout + '-second limit' : 'the test fails (exit ' + r.code + ')') + ' on the tree as it is, so a failure with a part undone could not be told from it' + (thrown ? '; a throw: ' + thrown : '') + '; last line: ' + lastLineOf(r.out)); return 2; }
      say('  passed (' + r.seconds.toFixed(1) + ' s); last line: ' + lastLineOf(r.out));
    }
    // Each part alone, with its verdict.
    let k = 0;
    for (const u of listed) {
      k++; say('[' + k + '/' + listed.length + '] ' + describe(u));
      if (!u.command) { u.verdict = 'no test'; say('  under no test, not run: no --map entry matches ' + u.file + ' and no --test was given'); continue; }
      const r = await runOnce(u, u.command); const s = r.seconds.toFixed(1) + ' s'; const last = 'last line: ' + lastLineOf(r.out); const thrown = throwOf(r.out);
      u.verdict = r.stopped ? 'stopped' : r.code === 0 ? 'survived' : r.problem ? 'broke' : 'caught';
      u.crash = u.verdict === 'caught' && (!!thrown || /^last line: \((only the Node\.js version line|it printed nothing)/.test(last));
      if (u.verdict === 'stopped') say('  stopped at its ' + o.timeout + '-second limit (' + s + '): the run was ended with every process it started; ' + last);
      else if (u.verdict === 'survived') say('  survived (' + s + '): the test passed with it undone' + (r.problem ? ', though ' + u.file + ' does not parse so (' + r.problem + '), so the test never loads it' : '') + '; ' + last);
      else if (u.verdict === 'broke') say("  broke its file's parse (" + s + '): ' + u.file + ' does not parse with it undone (' + r.problem + "), so the test's failure may be the parse alone; " + last);
      else say('  caught (' + s + '): the test failed with it undone' + (thrown ? ', by a throw: ' + thrown : '') + '; ' + last);
    }
    // The parts that keep the exit from 0, again, and the summary: a survivor or a part under no test gives 1; else a part stopped at its
    // limit, or a hunk that broke its file's parse, gives 3 (a line of --split that broke the parse has its hunk's run to stand for it).
    const of = (v) => listed.filter((u) => u.verdict === v);
    for (const [v, words] of [['survived', 'survived'], ['no test', 'under no test'], ['stopped', 'stopped at its limit'], ['broke', "broke its file's parse"]]) for (const u of of(v)) if (v !== 'broke' || u.level === 'hunk') say('undo-alone: ' + words + ': ' + describe(u));
    const code = of('survived').length + of('no test').length ? 1 : of('stopped').length + of('broke').filter((u) => u.level === 'hunk').length ? 3 : 0;
    const hunks = listed.filter((u) => u.level === 'hunk').length; const crashed = of('caught').filter((u) => u.crash).length;
    say('undo-alone: ' + count(listed.length, 'part', 'parts') + ' (' + count(hunks, 'hunk', 'hunks') + ', ' + count(listed.length - hunks, 'line', 'lines') + '): ' + of('caught').length + ' caught' + (crashed ? ' (' + crashed + ' of them by a crash or with nothing printed, each to read by eye)' : '') + ', ' + of('survived').length + ' survived, ' + of('stopped').length + ' stopped at its limit, ' + of('broke').length + " broke its file's parse, " + of('no test').length + ' under no test; ' + quiet.length + ' comment only, not run; exit ' + code);
    return code;
  } finally { rmSync(W, { recursive: true, force: true }); }
}

// The self-test (light: made trees in a temporary folder, 10 to 30 seconds): each rule the header gives, run on a made base and changed
// tree through main as the command line calls it, the exit codes and the stops by signal through this file run alone. It prints PASS
// and FAIL lines and a summary line, "N passed, M failed".
async function selfTest(say) {
  let passed = 0; let failed = 0;
  const ok = (name, cond, info) => { if (cond) { passed++; say('PASS - ' + name); } else { failed++; say('FAIL - ' + name + (info === undefined ? '' : '  ' + JSON.stringify(info).slice(0, 2000))); } };
  const T = mkdtempSync(join(tmpdir(), 'undo-alone-self-')); LIVE.dirs.add(T); const work = join(T, 'work'); mkdirSync(work);
  try {
    // A made tree from a table of paths and texts; a pair of them, the base and the changed tree; a file's text from its lines.
    const lay = (dir, table) => { for (const [p, text] of Object.entries(table)) { const f = join(dir, p); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, text); } return dir; };
    const pair = (name, baseTable, treeTable) => ({ b: lay(join(T, name, 'base'), baseTable), t: lay(join(T, name, 'tree'), treeTable) });
    const js = (...lines) => lines.join('\n') + '\n';
    // A run through main as the command line calls it, its printed lines kept; a run of a file of this tool alone, for its exit code (this
    // file's own through cli). A run still going after 15 seconds, or 20 for a file run alone, reads as no exit code, and every run after
    // it is skipped as failed, so a run that never ends fails the self-test in seconds rather than holding it to its limit (a file run alone
    // is killed with SIGKILL, since a run caught in a loop that never waits cannot run its SIGTERM handler). This file's own
    // runs through cli skip the comment read (--comments), which loads TypeScript, about a second a run on a busy machine; the runs through
    // main hold that read.
    let stuck = false; const skipped = { code: null, lines: ['(not run: an earlier run of the self-test never ended)'], text: '(not run: an earlier run of the self-test never ended)' };
    const run = async (args) => { if (stuck) return skipped; const lines = []; const code = await Promise.race([main([...args, '--work', work], (l) => lines.push(l)), new Promise((r) => setTimeout(() => r(null), 15000).unref())]); if (code === null) stuck = true; return { code, lines, text: lines.join('\n') }; };
    const alone = (file, args, env = process.env) => { if (stuck) return skipped; const r = spawnSync(process.execPath, [file, ...args, '--work', work], { encoding: 'utf8', cwd: T, timeout: 20000, killSignal: 'SIGKILL', env }); if (r.status === null) stuck = true; return { code: r.status, text: String(r.stdout) + String(r.stderr) }; };
    const cli = (args) => alone(SELF, [...args, '--comments']);
    const has = (text, line) => text.split('\n').includes(line);
    const like = (text, re) => text.split('\n').some((l) => re.test(l));
    const last = (text) => text.trim().split('\n').pop();
    const gone = (pid) => { const st = String(spawnSync('ps', ['-o', 'stat=', '-p', String(pid)], { encoding: 'utf8' }).stdout).trim(); return st === '' || st.startsWith('Z'); };
    const SUMMARY = (parts, hunks, caught, survived, stopped, broke, none, quiet, code, crashed = 0) => 'undo-alone: ' + count(parts, 'part', 'parts') + ' (' + count(hunks, 'hunk', 'hunks') + ', ' + count(parts - hunks, 'line', 'lines') + '): ' + caught + ' caught' + (crashed ? ' (' + crashed + ' of them by a crash or with nothing printed, each to read by eye)' : '') + ', ' + survived + ' survived, ' + stopped + ' stopped at its limit, ' + broke + " broke its file's parse, " + none + ' under no test; ' + quiet + ' comment only, not run; exit ' + code;
    // The made code and its test: clamp holds a number at 0 or above; the test checks clamp(-1) is 0.
    const CHECK = js("import { clamp } from '../src/lib.mjs';", 'const good = clamp(-1) === 0;', "console.log(good ? '1 passed, 0 failed' : '0 passed, 1 failed');", 'process.exitCode = good ? 0 : 1;');
    const BARE = js('export const clamp = (x) => x;'); const HELD = js('export const clamp = (x) => Math.max(0, x);');

    // 1. A fix with a check that fails without it: no survivor, exit 0 through this file run alone.
    { const { b, t } = pair('held', { 'src/lib.mjs': BARE, 'tests/check.mjs': CHECK }, { 'src/lib.mjs': HELD, 'tests/check.mjs': CHECK });
      const r = cli(['--base', b, '--tree', t, '--test', 'node tests/check.mjs']);
      ok("a fix with a check that fails without it: no survivor, exit 0 run alone; its part named by file, line and first changed line; the test's last line printed for the tree as it is and for the part; each run limited to 600 seconds when --timeout gives none",
        r.code === 0 && has(r.text, 'undo-alone: 1 changed file in scope: src/lib.mjs (1 hunk)') && like(r.text, /; each run's limit is 600 seconds$/) && has(r.text, 'undo-alone: the tree as it is, before any part is undone: node tests/check.mjs')
        && like(r.text, /^ {2}passed \(\d+\.\d s\); last line: 1 passed, 0 failed$/) && has(r.text, '[1/1] src/lib.mjs 1: + export const clamp = (x) => Math.max(0, x);')
        && like(r.text, /^ {2}caught \(\d+\.\d s\): the test failed with it undone; last line: 0 passed, 1 failed$/) && last(r.text) === SUMMARY(1, 1, 1, 0, 0, 0, 0, 0, 0), r); }

    // 2. A fix with no such check: the part survives, named, exit 1; and --files :A-B keeps the parts touching its lines.
    const TWO_BASE = js('export const clamp = (x) => x;', '// one line between', '// and another', 'export const size = 10;');
    const TWO_TREE = js('export const clamp = (x) => Math.max(0, x);', '// one line between', '// and another', 'export const size = 12;');
    { const { b, t } = pair('survivor', { 'src/lib.mjs': TWO_BASE, 'tests/check.mjs': CHECK }, { 'src/lib.mjs': TWO_TREE, 'tests/check.mjs': CHECK });
      const r = cli(['--base', b, '--tree', t, '--test', 'node tests/check.mjs']);
      ok('a fix with no check that fails without it: its part survives, named by file, line and first changed line in its run and again at the end, exit 1 run alone; the part the test holds is still caught',
        r.code === 1 && has(r.text, '[1/2] src/lib.mjs 1: + export const clamp = (x) => Math.max(0, x);') && has(r.text, '[2/2] src/lib.mjs 4: + export const size = 12;')
        && like(r.text, /^ {2}survived \(\d+\.\d s\): the test passed with it undone; last line: 1 passed, 0 failed$/) && has(r.text, 'undo-alone: survived: src/lib.mjs 4: + export const size = 12;') && last(r.text) === SUMMARY(2, 2, 1, 1, 0, 0, 0, 0, 1), r);
      const r2 = await run(['--base', b, '--tree', t, '--test', 'node tests/check.mjs', '--files', 'src/lib.mjs:3-9']);
      const r3 = await run(['--base', b, '--tree', t, '--test', 'node tests/check.mjs', '--files', 'src/lib.mjs:2-3']);
      const r4 = await run(['--base', b, '--tree', t, '--test', 'node tests/check.mjs', '--files', 'src/lib.mjs:9-3']);
      ok('--files with :A-B keeps only the parts touching those lines (the size line alone); lines no part touches are refused, nothing to undo; lines given backward are refused',
        r2.code === 1 && has(r2.text, '[1/1] src/lib.mjs 4: + export const size = 12;') && r3.code === 2 && has(r3.text, 'undo-alone: refused: no part of the changed files lies in the lines --files names, so there is nothing to undo')
        && !like(r3.text, /the tree as it is/) && r4.code === 2 && has(r4.text, 'undo-alone: refused: --files src/lib.mjs:9-3 gives its lines backward'), [r2.lines, r3.lines, r4.lines]); }

    // 3. A changed file under no test: named, counted as a survivor, never run; and --map giving each file its first matching entry's command.
    { const OTHER = js("import { other } from '../src/other.mjs';", 'const good = other === 2;', "console.log('other: ' + (good ? '1 passed, 0 failed' : '0 passed, 1 failed'));", 'process.exitCode = good ? 0 : 1;');
      const { b, t } = pair('notest', { 'src/lib.mjs': BARE, 'src/other.mjs': js('export const other = 1;'), 'tests/check.mjs': CHECK, 'tests/other.mjs': OTHER }, { 'src/lib.mjs': HELD, 'src/other.mjs': js('export const other = 2;'), 'tests/check.mjs': CHECK, 'tests/other.mjs': OTHER });
      const r = await run(['--base', b, '--tree', t, '--map', JSON.stringify({ 'src/lib.mjs': 'node tests/check.mjs' })]);
      ok('a changed file under no test (--map names another file, no --test): its part is named, counted as a survivor and never run, exit 1',
        r.code === 1 && has(r.text, '[2/2] src/other.mjs 1: + export const other = 2;') && has(r.text, '  under no test, not run: no --map entry matches src/other.mjs and no --test was given')
        && has(r.text, 'undo-alone: under no test: src/other.mjs 1: + export const other = 2;') && r.lines.filter((l) => /^ {2}(caught|survived|stopped|broke)/.test(l)).length === 1 && last(r.text) === SUMMARY(2, 2, 1, 0, 0, 0, 1, 0, 1), r.lines);
      const mapFile = join(T, 'map.json'); writeFileSync(mapFile, JSON.stringify({ 'src/l*.mjs': 'node tests/check.mjs', 'src/**': 'node tests/other.mjs' }));
      const r2 = await run(['--base', b, '--tree', t, '--map', mapFile]);
      ok('--map, given as a file: each file takes the first entry that matches it (src/lib.mjs matches both and runs the first), each command runs on the tree as it is first, and each part runs its own test, exit 0',
        r2.code === 0 && has(r2.text, 'undo-alone: the tree as it is, before any part is undone: node tests/check.mjs') && has(r2.text, 'undo-alone: the tree as it is, before any part is undone: node tests/other.mjs')
        && like(r2.text, /^ {2}caught \(\d+\.\d s\): the test failed with it undone; last line: other: 0 passed, 1 failed$/) && like(r2.text, /^ {2}caught \(\d+\.\d s\): the test failed with it undone; last line: 0 passed, 1 failed$/), r2.lines); }

    // 4. A test that fails before any part is undone: refused, exit 2; words that look like an error, printed with no stack, are not a throw.
    { const FAILING = js("import { clamp } from '../src/lib.mjs';", "console.log('TypeError: words a test printed, not a throw');", 'const good = clamp(-1) === -7;', "console.log(good ? '1 passed, 0 failed' : '0 passed, 1 failed');", 'process.exitCode = good ? 0 : 1;');
      const { b, t } = pair('refused', { 'src/lib.mjs': BARE, 'tests/check.mjs': FAILING }, { 'src/lib.mjs': HELD, 'tests/check.mjs': FAILING });
      const r = cli(['--base', b, '--tree', t, '--test', 'node tests/check.mjs']);
      ok('a test that fails before any part is undone: refused, exit 2 run alone, its last line printed, no part run, and printed words that look like an error read as no throw',
        r.code === 2 && has(r.text, 'undo-alone: refused: the test fails (exit 1) on the tree as it is, so a failure with a part undone could not be told from it; last line: 0 passed, 1 failed') && !like(r.text, /^\[1\//), r.text); }
    // 4b. The near miss: a test stopped at its limit on the tree as it is, one that will not stop for SIGTERM: refused too, ended by SIGKILL two
    // seconds on, so within seconds, though the made test would not end for twenty.
    { const STUCK = js("import { ready } from '../src/lib.mjs';", 'setTimeout(() => process.exit(0), 20000).unref();', 'if (!ready) setInterval(() => {}, 1000);', "else console.log('1 passed, 0 failed');");
      const { b, t } = pair('stuck', { 'src/lib.mjs': js('export const ready = true;'), 'tests/stuck.mjs': STUCK }, { 'src/lib.mjs': js('export const ready = false;'), 'tests/stuck.mjs': STUCK });
      const began = Date.now(); const r = await run(['--base', b, '--tree', t, '--test', "trap '' TERM; node tests/stuck.mjs", '--timeout', '1']); const took = Date.now() - began;
      ok('a test stopped at its limit on the tree as it is, deaf to SIGTERM: refused, exit 2, ended by SIGKILL within seconds, no part run',
        r.code === 2 && like(r.text, /^undo-alone: refused: the test was stopped at its 1-second limit on the tree as it is, so a failure with a part undone could not be told from it; last line: /) && !like(r.text, /^\[1\//) && took < 10000, { lines: r.lines, took }); }

    // 5. A run past its limit: named with its limit, exit 3 (no survivor, but not proven), ended by SIGTERM with every process it started:
    // the test's node runs under bash (a list of two commands, so bash does not hand itself over to it) and would never end on its own.
    { const pidFile = join(T, 'limit.pid');
      const HANG = js("import { writeFileSync } from 'node:fs';", "import { ready } from '../src/lib.mjs';", 'writeFileSync(' + JSON.stringify(pidFile) + ', String(process.pid));', 'setTimeout(() => process.exit(0), 30000).unref();', 'if (!ready) setInterval(() => {}, 1000);', "else console.log('1 passed, 0 failed');");
      const { b, t } = pair('limit', { 'src/lib.mjs': js('export const ready = false;'), 'tests/hang.mjs': HANG }, { 'src/lib.mjs': js('export const ready = true;'), 'tests/hang.mjs': HANG });
      const r = cli(['--base', b, '--tree', t, '--test', 'node tests/hang.mjs && echo ran', '--timeout', '3']);
      const pid = existsSync(pidFile) ? Number(readFileSync(pidFile, 'utf8')) : 0; const took = Number((/^ {2}stopped at its 3-second limit \((\d+\.\d) s\)/m.exec(r.text) || [])[1]);
      ok('a run past its limit: named with its limit and again at the end, exit 3 run alone, ended by SIGTERM at the limit (before the SIGKILL two seconds on) with every process it started, the node under bash too',
        r.code === 3 && has(r.text, '[1/1] src/lib.mjs 1: + export const ready = true;') && like(r.text, /^ {2}stopped at its 3-second limit \(\d+\.\d s\): the run was ended with every process it started; last line: /)
        && has(r.text, 'undo-alone: stopped at its limit: src/lib.mjs 1: + export const ready = true;') && last(r.text) === SUMMARY(1, 1, 0, 0, 1, 0, 0, 0, 3) && took < 4.5 && pid > 0 && gone(pid), { text: r.text, took, pid }); }
    // 5b. A process a run leaves behind, holding the run's output open: ended when the run exits, so the run ends with it and is not stopped.
    { const { b, t } = pair('leftover', { 'src/lib.mjs': BARE, 'tests/check.mjs': CHECK }, { 'src/lib.mjs': HELD, 'tests/check.mjs': CHECK });
      const began = Date.now(); const r = await run(['--base', b, '--tree', t, '--test', 'node tests/check.mjs && (sleep 30 &)', '--timeout', '20']); const took = Date.now() - began;
      ok('a process a run leaves behind is ended when the run exits, so the run reads as passed and caught, in seconds, never as stopped at its limit', r.code === 0 && like(r.text, /^ {2}caught \(\d+\.\d s\)/) && took < 10000, { lines: r.lines, took }); }

    // 6. --split finds a line a whole hunk hides: two conditions in one hunk, the test holding one. Every --split run of the self-test (here,
    // 6b's and 11's) goes through this file run alone, so an alignment that never ends is stopped and fails its case (in this process it
    // would hold the self-test for ever, since the alignment never waits).
    { const OK = js("import { ok } from '../src/lib.mjs';", 'const good = ok(-1) === false;', "console.log(good ? '1 passed, 0 failed' : '0 passed, 1 failed');", 'process.exitCode = good ? 0 : 1;');
      const { b, t } = pair('split', { 'src/lib.mjs': js('export const ok = (x) => {', '  return true;', '};'), 'tests/ok.mjs': OK }, { 'src/lib.mjs': js('export const ok = (x) => {', '  if (x < 0) return false;', '  if (x > 100) return false;', '  return true;', '};'), 'tests/ok.mjs': OK });
      const whole = await run(['--base', b, '--tree', t, '--test', 'node tests/ok.mjs']); const split = cli(['--base', b, '--tree', t, '--test', 'node tests/ok.mjs', '--split']);
      ok('a hunk of two conditions, the test holding one: caught as a whole, so no survivor without --split (the line it hides)', whole.code === 0 && has(whole.text, '[1/1] src/lib.mjs 2-3: + if (x < 0) return false;') && last(whole.text) === SUMMARY(1, 1, 1, 0, 0, 0, 0, 0, 0), whole.lines);
      ok('--split undoes each line alone and finds the line the whole hunk hides: the unheld condition survives, named by its own line, exit 1',
        split.code === 1 && has(split.text, '[2/3] src/lib.mjs 2 (a line of the hunk at 2-3): + if (x < 0) return false;') && has(split.text, '[3/3] src/lib.mjs 3 (a line of the hunk at 2-3): + if (x > 100) return false;')
        && has(split.text, 'undo-alone: survived: src/lib.mjs 3 (a line of the hunk at 2-3): + if (x > 100) return false;') && last(split.text) === SUMMARY(3, 1, 2, 1, 0, 0, 0, 0, 1), split.text); }
    // 6b. --split pairs a changed line with its most alike old line, not the one in its place, and puts each removed line back where it
    // stood: one before the changed line, one after it.
    { const F = js("import { f } from '../src/lib.mjs';", 'const good = f(0) === -1 && f(-9) === -1;', "console.log(good ? '1 passed, 0 failed' : '0 passed, 1 failed');", 'process.exitCode = good ? 0 : 1;');
      const { b, t } = pair('pairs', { 'src/lib.mjs': js('export const f = (x) => {', '  if (x === 0) return 0;', '  if (x > 0) return 1;', '  if (x < -5) return -5;', '  return -1;', '};'), 'tests/f.mjs': F }, { 'src/lib.mjs': js('export const f = (x) => {', '  if (x > 1) return 1;', '  return -1;', '};'), 'tests/f.mjs': F });
      const r = cli(['--base', b, '--tree', t, '--test', 'node tests/f.mjs', '--split']);
      ok('--split gives a changed line the old line most alike it (x > 0 for x > 1, though x === 0 stood in its place) and puts each removed line back where it stood, one before the changed line and one after: the removed conditions are caught, the changed one survives',
        r.code === 1 && has(r.text, '[2/4] src/lib.mjs removed after line 1 (a line of the hunk at 2): - if (x === 0) return 0;') && has(r.text, '[3/4] src/lib.mjs 2 (a line of the hunk at 2): + if (x > 1) return 1;')
        && has(r.text, '[4/4] src/lib.mjs removed after line 2 (a line of the hunk at 2): - if (x < -5) return -5;')
        && has(r.text, 'undo-alone: survived: src/lib.mjs 2 (a line of the hunk at 2): + if (x > 1) return 1;') && last(r.text) === SUMMARY(4, 1, 3, 1, 0, 0, 0, 0, 1), r.text); }

    // 7. An unknown --files path, and a pattern that matches nothing: each named, refused before any copy; a folder, a ./ path and a full path name files.
    { const { b, t } = pair('unknown', { 'src/lib.mjs': BARE, 'tests/check.mjs': CHECK }, { 'src/lib.mjs': HELD, 'tests/check.mjs': CHECK });
      const r = await run(['--base', b, '--tree', t, '--test', 'node tests/check.mjs', '--files', 'src/lib.mjs,src/nosuch.mjs', '--files', 'src/*.nothing']);
      ok('an unknown --files path and a pattern that matches nothing: each named, refused with exit 2 before any copy or run',
        r.code === 2 && has(r.text, 'undo-alone: --files src/nosuch.mjs names no file of the tree or the base') && has(r.text, 'undo-alone: --files src/*.nothing names no file of the tree or the base')
        && has(r.text, 'undo-alone: refused: 2 entries name nothing, so a part meant to be undone would go unread') && !like(r.text, /the tree as it is/) && readdirSync(work).length === 0, r.lines);
      const named = await Promise.all(['src/', './src/lib.mjs', join(t, 'src/lib.mjs')].map((f) => run(['--base', b, '--tree', t, '--test', 'node tests/check.mjs', '--files', f])));
      ok('a --files folder ending in /, a path starting ./ and a full path each name the file', named.every((x) => x.code === 0 && has(x.text, 'undo-alone: 1 changed file in scope: src/lib.mjs (1 hunk)')), named.map((x) => x.lines)); }

    // 8. Comment lines: a part of comments and blank lines alone is named and not run; a line of a template is text, even blank or starting //.
    { const { b, t } = pair('comments', { 'src/lib.mjs': js('export const clamp = (x) => x;', 'export const size = 10;', 'export const text = `a', 'b', 'c`;'), 'tests/check.mjs': CHECK },
        { 'src/lib.mjs': js('export const clamp = (x) => Math.max(0, x);', 'export const size = 10;', '// a new note, nothing else', '', 'export const text = `a', '// a line of a template, not a comment', 'b', '', 'c`;'), 'tests/check.mjs': CHECK });
      const r = await run(['--base', b, '--tree', t, '--test', 'node tests/check.mjs']); const r2 = await run(['--base', b, '--tree', t, '--test', 'node tests/check.mjs', '--comments']);
      ok('a part of a comment line and a blank line is named and not run; a template line that starts with //, and a blank one, are text and run (each survives: no test reads them)',
        r.code === 1 && has(r.text, 'undo-alone: comment only, not run (--comments runs them): src/lib.mjs 3-4') && has(r.text, '[2/3] src/lib.mjs 6: + // a line of a template, not a comment') && has(r.text, '[3/3] src/lib.mjs 8: (blank lines only)')
        && last(r.text) === SUMMARY(3, 3, 1, 2, 0, 0, 0, 1, 1), r.lines);
      ok('--comments runs the comment part too (it survives: no test reads a comment)', r2.code === 1 && has(r2.text, '[2/4] src/lib.mjs 3-4: + // a new note, nothing else') && has(r2.text, 'undo-alone: survived: src/lib.mjs 3-4: + // a new note, nothing else') && last(r2.text) === SUMMARY(4, 4, 1, 3, 0, 0, 0, 0, 1), r2.lines); }

    // 9. Two hunks that parse only together: each broke its file's parse, exit 3; a test that never loads the file names them survivors.
    { const FILL = js("import { fill } from '../src/lib.mjs';", 'const good = fill([1, 2, 3, 4, 5]).length === 5;', "console.log(good ? '1 passed, 0 failed' : '0 passed, 1 failed');", 'process.exitCode = good ? 0 : 1;');
      const { b, t } = pair('parse', { 'src/lib.mjs': js('export const fill = (x) => {', '  x.push(1);', '  x.push(2);', '  return x;', '};'), 'tests/fill.mjs': FILL, 'src/ui.jsx': js('const A = () => {', '  return <b>a</b>;', '};') },
        { 'src/lib.mjs': js('export const fill = (x) => {', '  if (x.length < 5) {', '  x.push(1);', '  x.push(2);', '  }', '  return x;', '};'), 'tests/fill.mjs': FILL, 'src/ui.jsx': js('const A = () => {', '  if (a) {', '  return <b>a</b>;', '  }', '};') });
      const r = await run(['--base', b, '--tree', t, '--test', 'node tests/fill.mjs']); const r2 = await run(['--base', b, '--tree', t, '--test', 'true', '--files', 'src/lib.mjs,src/ui.jsx']);
      const broke = r.lines.filter((l) => /^ {2}broke its file's parse \(\d+\.\d s\): src\/lib\.mjs does not parse with it undone \(SyntaxError: .+\), so the test's failure may be the parse alone; last line: /.test(l)).length;
      ok("two hunks that parse only together: each broke its file's parse, named with node --check's error, exit 3, the hunks named again at the end",
        r.code === 3 && has(r.text, '[1/2] src/lib.mjs 2: + if (x.length < 5) {') && has(r.text, '[2/2] src/lib.mjs 5: + }') && broke === 2 && has(r.text, "undo-alone: broke its file's parse: src/lib.mjs 2: + if (x.length < 5) {") && last(r.text) === SUMMARY(2, 2, 0, 0, 0, 2, 0, 0, 3), r.lines);
      ok("a test that passes with the file unparsed never loads it: its parts survive, the parse named beside them, a .jsx file's by TypeScript's parser",
        r2.code === 1 && r2.lines.filter((l) => /^ {2}survived \(\d+\.\d s\): the test passed with it undone, though src\/lib\.mjs does not parse so \(SyntaxError: .+\), so the test never loads it; /.test(l)).length === 2
        && r2.lines.filter((l) => /^ {2}survived \(\d+\.\d s\): the test passed with it undone, though src\/ui\.jsx does not parse so \(TypeScript: .+\), so the test never loads it; /.test(l)).length === 2, r2.lines); }

    // 10. The default scope: every changed .mjs under tools/ and tests/ (their output folders aside) and directly in src/; a file that is not
    // text is left out by name; --files ** reads every other file but the top .git and node_modules folders; a long line is cut to fit.
    { const long = 'export const v = "' + 'x'.repeat(200) + '";';
      const names = ['tools/t.mjs', 'tools/deep/d.mjs', 'tests/u.mjs', 'tests/e2e/w.mjs', 'src/s.mjs', 'src/ui.jsx', 'src/sub/w.mjs', 'docs/d.md', 'tests/e2e/out/o.mjs', 'tests/e2e/art/a.mjs', 'tools/x.js', '.git/x.mjs', 'node_modules/y.mjs'];
      const table = (v) => Object.fromEntries([...names.map((n) => [n, js('export const v = ' + v + ';')]), ['tools/same.mjs', js('export const same = 1;')], ['tools/bin.mjs', v === 1 ? 'a\u0000b' : 'a\u0000c']]);
      const { b, t } = pair('scope', table(1), { ...table(2), 'tools/t.mjs': js(long) });
      const r = await run(['--base', b, '--tree', t, '--test', 'true']); const r2 = await run(['--base', b, '--tree', t, '--test', 'true', '--files', '**']);
      ok('by default every changed .mjs under tools/ and tests/ (tests/e2e/out and tests/e2e/art aside) and directly in src/, and nothing else; a file that is not text left out by name; a test that prints nothing said so; a long first line cut to fit',
        has(r.text, 'undo-alone: 5 changed files in scope: src/s.mjs (1 hunk), tests/e2e/w.mjs (1 hunk), tests/u.mjs (1 hunk), tools/deep/d.mjs (1 hunk), tools/t.mjs (1 hunk)') && has(r.text, 'undo-alone: tools/bin.mjs is not text, so it is left out: it has no lines to undo one by one')
        && like(r.text, /^ {2}survived \(\d+\.\d s\): the test passed with it undone; last line: \(it printed nothing\)$/) && has(r.text, '[5/5] tools/t.mjs 1: + ' + long.slice(0, 117) + '...'), r.lines);
      ok('--files ** reads every changed text file but those under the top .git and node_modules folders (and the output folders), and a kind with no parse reader (a .md) is read as parsing',
        has(r2.text, 'undo-alone: 9 changed files in scope: docs/d.md (1 hunk), src/s.mjs (1 hunk), src/sub/w.mjs (1 hunk), src/ui.jsx (1 hunk), tests/e2e/w.mjs (1 hunk), tests/u.mjs (1 hunk), tools/deep/d.mjs (1 hunk), tools/t.mjs (1 hunk), tools/x.js (1 hunk)')
        && r2.lines.filter((l) => /^ {2}survived \(\d+\.\d s\): the test passed with it undone; last line: \(it printed nothing\)$/.test(l)).length === 9, r2.lines); }

    // 11. A new file is undone by deleting it, a deleted file by putting it back, lines removed at a file's top put back there; --split takes a
    // new file's lines out one at a time, and adds no line to a one-line hunk or to a deleted file.
    { const NEW = js("import { fresh } from '../src/new.mjs';", "console.log(fresh === 1 ? '1 passed, 0 failed' : '0 passed, 1 failed');", 'process.exitCode = fresh === 1 ? 0 : 1;');
      const { b, t } = pair('files', { 'src/old.mjs': js('export const stale = 1;'), 'src/top.mjs': js('export const gone = 1;', 'export const kept = 2;'), 'tests/new.mjs': NEW }, { 'src/new.mjs': js('export const fresh = 1;', 'export const extra = 2;'), 'src/top.mjs': js('export const kept = 2;'), 'tests/new.mjs': NEW });
      const r = await run(['--base', b, '--tree', t, '--test', 'node tests/new.mjs']); const r2 = cli(['--base', b, '--tree', t, '--test', 'node tests/new.mjs', '--split']);
      ok('a new file undone by deleting it (caught by a throw, its error line shown and the Node.js version line read past), a deleted file by putting it back, lines removed at the top put back there (both survive: nothing reads them)',
        r.code === 1 && has(r.text, 'undo-alone: 3 changed files in scope: src/new.mjs (new, 1 hunk), src/old.mjs (deleted, 1 hunk), src/top.mjs (1 hunk)') && has(r.text, '[1/3] src/new.mjs 1-2 (new): + export const fresh = 1;')
        && like(r.text, /^ {2}caught \(\d+\.\d s\): the test failed with it undone, by a throw: Error \[ERR_MODULE_NOT_FOUND\]: Cannot find module .+; last line: /) && !like(r.text, /last line: Node\.js v/)
        && has(r.text, 'undo-alone: survived: src/old.mjs (deleted): - export const stale = 1;') && has(r.text, 'undo-alone: survived: src/top.mjs removed at the top: - export const gone = 1;') && last(r.text) === SUMMARY(3, 3, 1, 2, 0, 0, 0, 0, 1, 1), r.lines);
      ok("--split takes a new file's lines out one at a time (the line the test imports caught, the other surviving) and adds no line to a one-line hunk or to a deleted file",
        r2.code === 1 && has(r2.text, '[2/5] src/new.mjs 1 (a line of the hunk at 1-2): + export const fresh = 1;') && has(r2.text, 'undo-alone: survived: src/new.mjs 2 (a line of the hunk at 1-2): + export const extra = 2;') && last(r2.text) === SUMMARY(5, 3, 2, 3, 0, 0, 0, 0, 1, 2), r2.text);
      // A test whose command passes on only its last line, as check.sh's steps do: a crash leaves the Node.js version line alone, and says so.
      const r3 = await run(['--base', b, '--tree', t, '--files', 'src/new.mjs', '--test', 'node tests/new.mjs > out.txt 2>&1; code=$?; tail -1 out.txt; exit $code']);
      ok('a run that printed only the Node.js version line a crash ends with says so, not that it printed nothing, and the summary counts it apart', r3.code === 0 && like(r3.text, /^ {2}caught \(\d+\.\d s\): the test failed with it undone; last line: \(only the Node\.js version line a crash ends with\)$/) && last(r3.text) === SUMMARY(1, 1, 1, 0, 0, 0, 0, 0, 0, 1), r3.lines);
      // The header's own form (round one's code read of pass NX): the whole output passed on, so the crash's throw is read.
      const r4 = await run(['--base', b, '--tree', t, '--files', 'src/new.mjs', '--test', 'node tests/new.mjs > out.txt 2>&1; cat out.txt; tail -1 out.txt | grep -q " 0 failed"']);
      ok("the header's test form passes a crash's stack on, so its throw is read and shown, and the summary counts it apart", r4.code === 0 && like(r4.text, /^ {2}caught \(\d+\.\d s\): the test failed with it undone, by a throw: Error \[ERR_MODULE_NOT_FOUND\]: Cannot find module .+; last line: /) && last(r4.text) === SUMMARY(1, 1, 1, 0, 0, 0, 0, 0, 0, 1), r4.lines); }

    // 12. Each copy is the tree's own: its packages found through the node_modules folder above the tree, linked beside the copy in --work's
    // folder; a link inside the tree kept pointing inside the copy; files' times kept; no .git; nothing a run writes reaching the tree.
    { const L = join(T, 'link'); lay(join(L, 'node_modules', 'fakepkg'), { 'package.json': JSON.stringify({ name: 'fakepkg', type: 'module', exports: './index.mjs' }), 'index.mjs': js('export const answer = 42;') });
      const whereFile = join(T, 'link-where.json');
      const PKG = js("import { existsSync, statSync, writeFileSync } from 'node:fs';", "import { answer } from 'fakepkg';", "import { clamp } from '../src/link.mjs';", "writeFileSync('made-by-the-test.txt', 'a run wrote this');",
        'writeFileSync(' + JSON.stringify(whereFile) + ", JSON.stringify({ cwd: process.cwd(), git: existsSync('.git') }));", "const good = answer === 42 && clamp(-1) === 0 && statSync('data/old.txt').mtimeMs < 1e12;", "console.log(good ? '1 passed, 0 failed' : '0 passed, 1 failed');", 'process.exitCode = good ? 0 : 1;');
      const b = lay(join(L, 'base'), { 'src/lib.mjs': BARE, 'tests/pkg.mjs': PKG, 'data/old.txt': 'old' }); const t = lay(join(L, 'tree'), { 'src/lib.mjs': HELD, 'tests/pkg.mjs': PKG, 'data/old.txt': 'old', '.git/HEAD': 'ref: refs/heads/main' });
      symlinkSync('lib.mjs', join(t, 'src', 'link.mjs')); utimesSync(join(t, 'data', 'old.txt'), new Date('2001-01-01T00:00:00Z'), new Date('2001-01-01T00:00:00Z'));
      const r = await run(['--base', b, '--tree', t, '--test', 'node tests/pkg.mjs']); const where = existsSync(whereFile) ? JSON.parse(readFileSync(whereFile, 'utf8')) : {};
      ok("each copy is the tree's own: its package found through a node_modules folder above the tree, linked beside the copy in --work's folder; the part read through a link inside the tree; a file's old time kept; no .git; nothing written into the tree",
        r.code === 0 && has(r.text, '[1/1] src/lib.mjs 1: + export const clamp = (x) => Math.max(0, x);') && like(r.text, /^ {2}caught /) && String(where.cwd).startsWith(realpathSync(work) + '/') && where.git === false && !existsSync(join(t, 'made-by-the-test.txt')), { lines: r.lines, where });
      renameSync(join(L, 'node_modules'), join(L, 'packages-away'));
      const r2 = await run(['--base', b, '--tree', t, '--test', 'node tests/pkg.mjs']);
      ok('the near miss: with no node_modules folder to find, the same run is refused (the test cannot load its package), so the link is what the case above stands on', r2.code === 2 && like(r2.text, /^undo-alone: refused: the test fails \(exit 1\) on the tree as it is, so a failure with a part undone could not be told from it; a throw: Error \[ERR_MODULE_NOT_FOUND\]: Cannot find package 'fakepkg'/), r2.lines); }

    // 13. Stopped by SIGTERM or SIGINT mid-run, as check.sh's limit stops a step: it exits 143 or 130 within seconds, ends its test's processes
    // and leaves no copy behind.
    for (const [signal, want] of [['SIGTERM', 143], ['SIGINT', 130]]) {
      const pidFile = join(T, signal + '.pid'); const sigWork = join(T, signal + '-work'); mkdirSync(sigWork);
      const FOREVER = js("import { writeFileSync } from 'node:fs';", 'writeFileSync(' + JSON.stringify(pidFile) + ', String(process.pid));', 'setTimeout(() => process.exit(0), 30000).unref();', 'setInterval(() => {}, 1000);');
      const { b, t } = pair(signal, { 'src/lib.mjs': BARE, 'tests/forever.mjs': FOREVER }, { 'src/lib.mjs': HELD, 'tests/forever.mjs': FOREVER });
      const end = await new Promise((done) => {
        const child = spawn(process.execPath, [SELF, '--base', b, '--tree', t, '--test', 'node tests/forever.mjs && echo never', '--timeout', '60', '--work', sigWork], { stdio: 'ignore' });
        const began = Date.now(); let sent = 0;
        const poll = setInterval(() => { if (!sent && existsSync(pidFile)) { sent = Date.now(); child.kill(signal); } else if (Date.now() - began > 20000) child.kill('SIGKILL'); }, 50);
        child.on('exit', (code) => { clearInterval(poll); done({ code, after: sent ? Date.now() - sent : -1 }); });
      });
      const pid = existsSync(pidFile) ? Number(readFileSync(pidFile, 'utf8')) : 0;
      ok('stopped by ' + signal + ' mid-run: exits ' + want + ' within seconds, ends its test\'s processes and leaves no copy behind', end.code === want && end.after >= 0 && end.after < 5000 && pid > 0 && gone(pid) && readdirSync(sigWork).length === 0, { end, pid, left: readdirSync(sigWork) });
    }

    // 14. A bad request is refused with exit 2 before anything is copied, its reason and the usage line printed.
    { const { b, t } = pair('bad', { 'src/lib.mjs': BARE }, { 'src/lib.mjs': HELD }); const same = pair('same', { 'src/lib.mjs': BARE }, { 'src/lib.mjs': BARE });
      const asks = [[[], '--base is needed: the last delivered tree'], [['--base', b, '--tree', t], 'a test is needed: --test, or --map'], [['--base', b, '--tree', t, '--test', 'true', '--timeout', '0'], '--timeout needs a number of seconds above 0'],
        [['--base', b, '--tree', t, '--map', '{"src/lib.mjs": 5}'], '--map is not a JSON object of files and commands: the command for src/lib.mjs is not a command'], [['--base', b, '--tree', t, '--map', '{}'], '--map is not a JSON object of files and commands: it names no file'],
        [['--base', b, '--tree', t, '--map', '[1]'], '--map ' + '[1]' + ' is neither a JSON object nor a file'], [['--base', b, '--tree', t, '--test', 'true', '--bogus'], 'unknown argument --bogus'], [['--base', b, '--tree', t, '--test'], '--test needs a value']];
      const outs = []; for (const [args, words] of asks) { const lines = []; const code = await main(args, (l) => lines.push(l)); outs.push({ ok: code === 2 && lines[0] === 'undo-alone: ' + words && lines[1] === USAGE, lines }); }
      const refusals = [[['--base', b, '--tree', b, '--test', 'true'], 'undo-alone: refused: --base and --tree are one folder, so nothing can differ'], [['--base', join(T, 'nowhere'), '--tree', t, '--test', 'true'], 'undo-alone: refused: --base ' + join(T, 'nowhere') + ' is not a folder'],
        [['--base', b, '--tree', t, '--test', 'true', '--work', join(t, 'src')], 'undo-alone: refused: --work ' + join(t, 'src') + ' is inside the tree, which every run copies'], [['--base', same.b, '--tree', same.t, '--test', 'true'], 'undo-alone: refused: no file in scope differs from the base (1 file read), so there is nothing to undo']];
      for (const [args, line] of refusals) { const lines = []; const code = await main(args, (l) => lines.push(l)); outs.push({ ok: code === 2 && lines.length === 1 && lines[0] === line, lines }); }
      ok('a bad request is refused with exit 2 before anything is copied, its reason (and for a bad command line the usage) printed: no --base, no test, a limit of 0, a --map command that is not text, an empty or unreadable --map, an unknown flag, a flag with no value, one folder for both trees, a base that is no folder, a work folder inside the tree, and nothing changed',
        outs.length === 12 && outs.every((x) => x.ok), outs.filter((x) => !x.ok)); }

    // 15. The hunks are held to undo the changed file to the base exactly: diff's pass, and a hunk moved one line up, or none for a changed file, is refused by name.
    { const { b, t } = pair('guard', { 'src/lib.mjs': TWO_BASE }, { 'src/lib.mjs': TWO_TREE }); const said = [];
      const good = readChanges(b, t, ['src/lib.mjs'], (l) => said.push(l)); const moved = readChanges(b, t, ['src/lib.mjs'], (l) => said.push(l), (...a) => hunksOf(...a).map((h, i) => (i ? { ...h, treeStart: h.treeStart - 1 } : h)));
      const none = readChanges(b, t, ['src/lib.mjs'], (l) => said.push(l), () => []);
      const through = []; const code = await undoAlone(parseArgs(['--base', b, '--tree', t, '--test', 'true', '--work', work]), (l) => through.push(l), () => []);
      ok("the hunks must undo the changed file to the base exactly: diff's two pass, and a hunk moved one line up, or no hunk for a changed file, is refused by name, through the whole run too (exit 2, before any copy or run)",
        good && good.length === 1 && good[0].hunks.length === 2 && moved === null && none === null && code === 2 && [...said, ...through].length === 3
        && [...said, ...through].every((l) => l === 'undo-alone: refused: the hunks diff gave for src/lib.mjs do not undo it to the base, so a part would be put back in the wrong place'), { said, through, code }); }

    // 16. With no --tree, the tree is the one this file sits in, from whatever folder the command is run: a copy of this file run from a made tree.
    { const { b, t } = pair('home', { 'src/lib.mjs': BARE, 'tests/check.mjs': CHECK }, { 'src/lib.mjs': HELD, 'tests/check.mjs': CHECK }); lay(t, { 'tools/undo-alone.mjs': readFileSync(SELF, 'utf8') });
      const r = alone(join(t, 'tools', 'undo-alone.mjs'), ['--base', b, '--files', 'src/lib.mjs', '--test', 'node tests/check.mjs']);
      ok('with no --tree the tree is the one this file sits in, not the folder the command is run from', r.code === 0 && r.text.split('\n').some((l) => l.startsWith('undo-alone: base ' + b + '; tree ' + realpathSync(t) + ';')), r.text); }

    // 17. A diff that cannot compare stops the run by name, before any copy: here a diff that always fails, found first on PATH.
    { const { b, t } = pair('nodiff', { 'src/lib.mjs': BARE }, { 'src/lib.mjs': HELD }); const bin = lay(join(T, 'brokenbin'), { diff: '#!/bin/sh\necho "this diff is broken" >&2\nexit 2\n' }); chmodSync(join(bin, 'diff'), 0o755);
      const r = alone(SELF, ['--base', b, '--tree', t, '--test', 'true'], { ...process.env, PATH: bin + ':' + process.env.PATH });
      ok('a diff that cannot compare stops the run by name, exit 2, before any copy or run', r.code === 2 && has(r.text, 'undo-alone: refused: diff could not compare ' + join(b, 'src/lib.mjs') + ' and ' + join(t, 'src/lib.mjs') + ': this diff is broken') && !r.text.includes('the tree as it is'), r.text); }

    ok('every run removed its copy: the work folder is empty', readdirSync(work).length === 0, readdirSync(work));
  } finally { rmSync(T, { recursive: true, force: true }); }
  say(''); say(passed + ' passed, ' + failed + ' failed');
  return failed ? 1 : 0;
}

// Run alone: a stop by SIGINT or SIGTERM ends the test's processes and removes the copies first; the exit code is the run's.
if (process.argv[1] && process.argv[1].endsWith('undo-alone.mjs')) {
  process.on('SIGINT', () => { stopAll(); process.exit(130); });
  process.on('SIGTERM', () => { stopAll(); process.exit(143); });
  process.exitCode = await main(process.argv.slice(2));
}
