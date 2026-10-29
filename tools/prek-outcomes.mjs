// The Wise Human. Copyright (c) 2026. Source-available; not for reuse. See LICENSE.md.
// Every pre-K outcome, for the standards map (pass MS, Mikey's answer to Q76, "Q76 - C": list every outcome of the 2027
// recommendations in the pre-K plans, the untaught ones shown as not yet covered, and mark pre-K as still being written until every
// one is taught). In plain terms: the pre-K outcomes are transcribed word for word in docs/standards/ (the 2027 Pre-K Guidelines Review
// Committee's recommendations for pre-K 3 and pre-K 4, which Mikey adopted in pass MR, and Head Start's Early Learning Outcomes
// Framework preschool goals); the app runs in one browser file and cannot read those files, so this tool copies them into
// src/curriculum.mjs as PREK_OUTCOMES, between its markers, and the coverage test fails whenever the copy and the files disagree. The
// pre-K plans (prekPlans in src/curriculum.mjs) list every one of them, domain by domain, and the lessons that teach each.
// Run: node tools/prek-outcomes.mjs          (prints the counts and whether src/curriculum.mjs holds the copy)
//      node tools/prek-outcomes.mjs --write  (writes it between the PREK_OUTCOMES markers in src/curriculum.mjs)
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

const dir = new URL('../docs/standards/', import.meta.url);
const read = (name) => readFileSync(new URL(name, dir), 'utf8').split('\n');
// Head Start's preschool domains in the framework's own order (the ELOF lists Approaches to Learning, Social and Emotional
// Development, Language and Communication, Literacy, Mathematics Development, Scientific Reasoning, and Perceptual, Motor, and Physical
// Development); each name is read from its file's "# Domain:" line, and the order is held here.
const ELOF_ORDER = ['P-ATL', 'P-SE', 'P-LC', 'P-LIT', 'P-MATH', 'P-SCI', 'P-PMP'];

// The outcomes, as data: for each pre-K age, each 2027 outcome's code and words in the file's order, with its domain's numeral and
// name from the file's "## I Positive Character Development Domain" lines; and every Head Start preschool goal with its domain.
export function prekOutcomesFromFiles() {
  const out = { TEKS_DOMAINS: [], ELOF_DOMAINS: [], PK3: [], PK4: [], ELOF: [] };
  const domains = new Map();
  for (const grade of ['PK3', 'PK4']) {
    for (const line of read(`tea-${grade.toLowerCase()}-2027-recommended.txt`)) {
      const d = /^## ([IVX]+) (.+?) Domain$/.exec(line); if (d) { if (!domains.has(d[1])) domains.set(d[1], d[2]); continue; }
      const m = /^([IVX]+\.[A-Z]\.\d+(?:\.[a-z])?)\t(.+)$/.exec(line); if (m) out[grade].push([m[1], m[2]]);
    }
  }
  const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  out.TEKS_DOMAINS = ROMAN.filter((r) => domains.has(r)).map((r) => [r, domains.get(r)]);
  const goals = new Map(); const names = new Map();
  for (const f of readdirSync(dir).filter((x) => /^elof-preschool-.*\.txt$/.test(x))) {
    let domain = null;
    for (const line of read(f)) {
      const d = /^# Domain: (.+)$/.exec(line); if (d) { domain = d[1].trim(); continue; }
      const m = /^(P-[A-Z]+) (\d+)\tGOAL\t(.+)$/.exec(line); if (!m) continue;
      goals.set(`${m[1]} ${m[2]}`, m[3]); if (domain && !names.has(m[1])) names.set(m[1], domain);
    }
  }
  out.ELOF_DOMAINS = ELOF_ORDER.map((k) => [k, names.get(k)]);
  for (const k of ELOF_ORDER) {
    const nums = [...goals.keys()].filter((g) => g.startsWith(`${k} `)).map((g) => Number(g.split(' ')[1])).sort((a, b) => a - b);
    for (const n of nums) out.ELOF.push([`${k} ${n}`, goals.get(`${k} ${n}`)]);
  }
  return out;
}
// The copy as src/curriculum.mjs holds it: one outcome a line, so a change in a file shows as a change of one line.
export function prekOutcomesBlock() {
  const o = prekOutcomesFromFiles(); const q = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  const pairs = (list) => list.map(([a, b]) => `    [${q(a)}, ${q(b)}],`).join('\n');
  return `export const PREK_OUTCOMES = {\n  TEKS_DOMAINS: [\n${pairs(o.TEKS_DOMAINS)}\n  ],\n  ELOF_DOMAINS: [\n${pairs(o.ELOF_DOMAINS)}\n  ],\n  PK3: [\n${pairs(o.PK3)}\n  ],\n  PK4: [\n${pairs(o.PK4)}\n  ],\n  ELOF: [\n${pairs(o.ELOF)}\n  ],\n};`;
}
// The copy as src/curriculum.mjs holds it now, between its markers, or null without them.
export function heldBlock(src) {
  const a = src.indexOf('// PREK_OUTCOMES:start'); const b = src.indexOf('// PREK_OUTCOMES:end');
  if (a < 0 || b < a) return null;
  return src.slice(src.indexOf('\n', a) + 1, b).replace(/\n$/, '');
}
// Runs only when it is the file being run (its own name, read with endsWith, so a folder with a space in its path still works), and
// writes only on its flag.
const runAlone = !!process.argv[1] && process.argv[1].endsWith('prek-outcomes.mjs');
if (runAlone) {
  const url = new URL('../src/curriculum.mjs', import.meta.url);
  const src = readFileSync(url, 'utf8'); const block = prekOutcomesBlock(); const held = heldBlock(src); const o = prekOutcomesFromFiles();
  if (held === null) { console.log('src/curriculum.mjs has no PREK_OUTCOMES markers'); process.exitCode = 1; }
  else if (process.argv.includes('--write')) {
    const a = src.indexOf('// PREK_OUTCOMES:start'); const from = src.indexOf('\n', a) + 1; const b = src.indexOf('// PREK_OUTCOMES:end');
    writeFileSync(url, `${src.slice(0, from)}${block}\n${src.slice(b)}`);
    console.log(`PREK_OUTCOMES written: ${o.PK3.length} pre-K 3 outcomes, ${o.PK4.length} pre-K 4 outcomes, ${o.ELOF.length} Head Start goals`);
  } else {
    console.log(`${o.PK3.length} pre-K 3 outcomes, ${o.PK4.length} pre-K 4 outcomes, ${o.ELOF.length} Head Start goals, in ${o.TEKS_DOMAINS.length} and ${o.ELOF_DOMAINS.length} domains`);
    console.log(held === block ? 'src/curriculum.mjs holds this copy.' : 'src/curriculum.mjs holds a different copy: run node tools/prek-outcomes.mjs --write');
  }
}
