// The Wise Human. Copyright (c) 2026. Source-available; not for reuse. See LICENSE.md.
// No placeholder is left in a doc (pass MT, round one's final read). In plain terms: while a pass writes its records it leaves a
// name in capitals where a fact can only come at the end (the minutes check.sh took, a round's findings, a preview's link), and a
// hurried delivery could ship one. This lists every word in capitals joined by underscores in the docs that no code names and that
// is not one of the names the docs keep on purpose (KEPT: code a pass retired, and checks MISTAKE-CLASSES proposed). The delivery's
// clean step, bash tools/checkpoint.sh --clean, refuses while it lists any, and the docs sync test proves it on a planted one.
// Run from anywhere: node tools/placeholders.mjs [file ...]   (prints each with its file and line; exit 1 while any is left). Files
// named after it are read too, such as the delivery message's draft, which lives outside the project (the second read of round one).
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

// Names the docs keep on purpose though no code has them: code a pass retired (pass MR's say-with-me, the held sounds, the review
// backlog's old limits; pass NA's CB4_START, the blend bank's first sounds before its split, and THINK_TURN_MS, a wait that never ran)
// and checks proposed in docs/MISTAKE-CLASSES.md. A name added here is still in a doc and in no code (the
// docs sync test reads both ways).
export const KEPT = ['ALSO_FITS', 'CB4_START', 'HELD_SOUND', 'LIGHT_REVIEWS_BUSY_DAY', 'LIGHT_REVIEW_BACKLOG', 'ROGER_SENTENCE', 'SAY_WITH_ME', 'SAY_WITH_ME_LESSONS', 'SOUND_CARRIERS', 'THINK_TURN_MS'];
const NAME = /\b[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)+\b/g;
const ROOT = new URL('../', import.meta.url);

// The docs a person or a new chat reads: every docs/*.md, CLAUDE.md, its second part and the README, as { file, text }.
export function docTexts() {
  const docs = readdirSync(new URL('docs/', ROOT)).filter((f) => f.endsWith('.md')).map((f) => `docs/${f}`);
  return ['CLAUDE.md', 'CLAUDE-PART-2.md', 'CLAUDE-PART-3.md', 'README.md', ...docs].map((file) => ({ file, text: readFileSync(new URL(file, ROOT), 'utf8') }));
}

// Every name in capitals the code has: src, tools and tests (scripts of every kind), build.sh, check.sh and sw.js. This tool and
// the docs sync test are left out, since they hold KEPT and the planted placeholders.
export function codeNames() {
  const skip = new Set(['tools/placeholders.mjs', 'tests/docs-sync.test.mjs']);
  const code = /\.(mjs|js|jsx|py|sh)$/; const names = new Set(); const files = ['build.sh', 'check.sh', 'sw.js'];
  const walk = (dir) => { for (const f of readdirSync(new URL(dir, ROOT))) { const rel = `${dir}${f}`;
    if (/^tests\/e2e\/(out|art)$|node_modules/.test(rel)) continue;
    if (statSync(new URL(rel, ROOT)).isDirectory()) walk(`${rel}/`); else if (code.test(f)) files.push(rel); } };
  for (const d of ['src/', 'tools/', 'tests/']) walk(d);
  for (const rel of files) { if (skip.has(rel)) continue; let text = ''; try { text = readFileSync(new URL(rel, ROOT), 'utf8'); } catch { continue; }
    for (const m of text.matchAll(NAME)) names.add(m[0]); }
  return names;
}

// The placeholders in the given docs: each name in capitals that the code does not have and KEPT does not name, with its file and
// line, in the docs' order.
export function placeholdersIn(docs, names, kept = KEPT) {
  const out = [];
  for (const { file, text } of docs) text.split('\n').forEach((l, i) => { for (const m of l.matchAll(NAME)) if (!names.has(m[0]) && !kept.includes(m[0])) out.push({ file, line: i + 1, name: m[0] }); });
  return out;
}

if (process.argv[1] && process.argv[1].endsWith('placeholders.mjs')) {
  const extra = process.argv.slice(2).map((f) => ({ file: f, text: readFileSync(resolve(f), 'utf8') }));
  const left = placeholdersIn([...docTexts(), ...extra], codeNames());
  for (const x of left) console.log(`${x.file}:${x.line}: ${x.name}`);
  console.log(left.length ? `${left.length} placeholder${left.length === 1 ? '' : 's'} left in the docs: fill each before the delivery zip` : 'no placeholder left in the docs');
  process.exitCode = left.length ? 1 : 0;
}
