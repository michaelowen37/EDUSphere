// Copyright (c) 2026 iECHO, LLC. All rights reserved.
// -----------------------------------------------------------------------------------------------------------------
// Every piece of content in one project folder, keyed by what it is, as one JSON file (pass MM, the workflow review).
//
// In plain terms: tools/content-diff.mjs compares two copies course packet by course packet, and a packet shows at most 24
// questions of a kind from seeds 1 to 400, about half of the More Info sentences and explanations, and no Wonder question that
// names no course, no game deck, no plan row and no course goal. Pass MM's verification report planted a wrong answer that first
// appears at seed 890, and no packet showed it. This snapshot holds all of it, one key for each thing:
//   - every exported list or table of the logic, stories and curriculum files, item by item (a module by its id, a story by its
//     module, a Wonder question by its id, a game deck by its name, a plan row by its grade, subject and code), a course without
//     its modules, which have keys of their own;
//   - every distinct question each generator a course deals from makes, with every rendering of it (the choices, explanation,
//     More Info and more right examples). Every bank reads seeds 1 to 400 and doubles them while the last half still makes a new
//     question, up to 6,400, and a bank still making new ones there with fewer than 1,000 questions (a small bank with rare
//     questions, as Rhyme time's heard rhymes are, whose last new question came at seed 13,973) goes on doubling past 76,800,
//     the rules test's cap for pre-K banks, to 102,400 at most (round two's code check: at 6,400 it left 22 of them unread).
//     Since round three (pass MM) a question's rendering holds its printed words where they differ from its prompt (printedQuestion),
//     and every choice bank keeps its answer places, counted over the seeds it reads, so a shuffle shows as a change. The rule reads only the
//     bank, the same in both copies, so a bank that moves between grades is never read on different seeds. A bank still making
//     new questions at its cap (arithmetic with any numbers) keeps its first 400 seeds' questions item by item and a fingerprint
//     of everything it made;
//   - every art and audio ledger row and every review mark;
//   - a fingerprint of each source file, so a change to the screens is seen and read in the code check.
// The same code reads both copies, so a change in this tool never shows as a change in content. Each key also carries the
// courses it belongs to, where it belongs to any, so a comparison can say which changes fall outside a pass's scope.
//
// Run: node tools/content-snapshot.mjs [--root <project folder>] --out <file.json>   (about a minute; tools/content-diff.mjs
// runs it on both copies itself).
// -----------------------------------------------------------------------------------------------------------------
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, resolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const plain = (v) => JSON.stringify(v, (k, x) => (x instanceof Map ? [...x] : x instanceof Set ? [...x] : x));

export async function snapshot(root) {
  const imp = (f) => import(pathToFileURL(join(root, f)).href);
  const L = await imp('src/logic.mjs'); const S = await imp('src/stories.mjs');
  const C = existsSync(join(root, 'src/curriculum.mjs')) ? await imp('src/curriculum.mjs') : {};
  const items = {}; const scope = {};
  const put = (key, value, courses) => { items[key] = typeof value === 'string' ? value : plain(value); if (courses && courses.length) scope[key] = [...new Set(courses)].sort().join(','); };
  const moduleCourse = new Map(L.COURSES.flatMap((c) => c.modules.map((m) => [m.id, c.id])));
  const ownerOf = (id) => (moduleCourse.has(id) ? [moduleCourse.get(id)] : L.COURSES.some((c) => c.id === id) ? [id] : []);
  // Exported data, item by item. Arrays of things with ids go by id; plain tables go by key; a plan row goes by its grade and
  // subject, and its standards by their codes; anything else whole. Functions are code, read in the code check.
  for (const [file, mod] of [['logic', L], ['stories', S], ['curriculum', C]]) {
    for (const [name, v] of Object.entries(mod)) {
      if (typeof v === 'function' || v === null || v === undefined) continue;
      const base = `${file}.${name}`;
      if (Array.isArray(v) && v.length && v.every((x) => x && typeof x === 'object' && typeof x.id === 'string')) {
        for (const x of v) {
          if (name === 'COURSES') put(`${base}:${x.id}`, { ...x, modules: (x.modules || []).map((m) => m.id) }, [x.id]);
          else if (name === 'WONDER') put(`${base}:${x.id}`, x, x.courseIds || []);
          else if (name === 'GAMES') put(`${base}:${x.id}`, x, [L.gameCourse ? L.gameCourse(x.id) : null].filter(Boolean));
          else put(`${base}:${x.id}`, x, ownerOf(x.id));
        }
      } else if (Array.isArray(v) && v.length && v.every((x) => x && typeof x === 'object' && x.grade && x.subject)) {
        for (const x of v) {
          const rowKey = `${base}:${x.grade}|${x.subject}`; const { standards, ...row } = x;
          const courses = L.COURSES.filter((c) => c.grade === x.grade).map((c) => c.id);
          put(`${rowKey}:row`, row, courses);
          (standards || []).forEach((s, i) => put(`${rowKey}:standard:${s.code || s.id || i}`, s, courses));
        }
      } else if (v && typeof v === 'object' && !Array.isArray(v) && !(v instanceof Map) && !(v instanceof Set)) {
        for (const [k, x] of Object.entries(v)) put(`${base}:${k}`, x, ownerOf(k));
      } else put(base, v);
    }
  }
  // Every distinct question of every generator a course deals from, with all its renderings. The choices are sorted, so a
  // reshuffle is not a change to a question; where the answer sits is counted for the bank as a whole (places, below).
  const courseGens = new Map();
  for (const c of L.COURSES) for (const m of c.modules) for (const g of m.generators || []) { if (!courseGens.has(g)) courseGens.set(g, new Set()); courseGens.get(g).add(c.id); }
  for (const g of [...courseGens.keys()].sort()) {
    const seen = new Map(); let lastNew = 0; let limit = 400; const courses = [...courseGens.get(g)]; const places = new Map();
    for (let seed = 1; seed <= limit; seed++) {
      let q; try { q = L.generateQuestion(g, seed); } catch (e) { q = { prompt: `(throws: ${e && e.message})` }; }
      const key = L.questionKey(q);
      const pr = typeof L.printedQuestion === 'function' && q.type ? L.printedQuestion(q, true) : null;
      const printed = pr && (pr.prompt !== q.prompt || (pr.story || null) !== (q.story || null)) ? { story: pr.story || null, prompt: pr.prompt } : null;
      // Only a choice bank's answer sits in one place (round four's code read, pass MM: 13 order banks read "answer at -1").
      if (q.type === 'choice' && Array.isArray(q.choices) && q.choices.length > 1) { const at = q.choices.findIndex((c) => String(c) === String(q.answer)); const tag = `${at} of ${q.choices.length}`; places.set(tag, (places.get(tag) || 0) + 1); }
      const rendering = plain({ type: q.type, choices: Array.isArray(q.choices) ? [...q.choices].sort() : q.choices || null, explain: q.explain || null, explainVisual: q.explainVisual || null, whyNot: q.whyNot || null, alsoRight: q.alsoRight || null, printed,
        // What a pre-reader hears after a wrong trace, which no choice's reason carries (round four's content read, pass MM).
        wrongTrace: q.type === 'trace' && typeof L.preReaderWrongWords === 'function' ? L.preReaderWrongWords(q) : null });
      if (!seen.has(key)) { seen.set(key, { first: seed, renderings: new Set() }); lastNew = seed; }
      seen.get(key).renderings.add(rendering);
      if (seed === limit && lastNew > limit / 2 && (limit < 6400 || (limit < 76800 && seen.size < 1000))) limit *= 2;
    }
    const settled = lastNew <= limit / 2; const lines = [];
    put(`seeds:${g}`, `${limit} seeds, ${seen.size} questions${settled ? '' : ', still making new ones'}`, courses);
    if (places.size) put(`places:${g}`, [...places].sort().map(([tag, n]) => `answer at ${tag}: ${n}`).join('; '), courses);
    for (const [key, { first, renderings }] of seen) { const value = [...renderings].sort().join('\n'); if (settled || first <= 400) put(`question:${g}:${key}`, value, courses); if (!settled) lines.push(`${key}\n${value}`); }
    if (!settled) put(`question:${g}:fingerprint of all ${limit} seeds`, createHash('sha256').update(lines.sort().join('\n')).digest('hex').slice(0, 24), courses);
  }
  // The ledgers and the review marks.
  const art = join(root, 'docs/ART-REQUESTS.md');
  if (existsSync(art)) for (const line of readFileSync(art, 'utf8').split('\n')) { const m = /^\| ([A-Z]+\d+) \| ([^|]*?) \|/.exec(line); if (m) put(`art:${m[1]}`, line, ownerOf(m[2].trim().replace(/^lesson-/, ''))); }
  const audio = join(root, 'docs/AUDIO-LEDGER.csv');
  if (existsSync(audio)) for (const line of readFileSync(audio, 'utf8').split('\n').slice(1)) { const m = /^"([^"]+)","[^"]*","([^"]*)"/.exec(line); if (m) put(`audio:${m[1]}`, line, ownerOf(m[2])); }
  const marks = join(root, 'docs/review-status.json');
  if (existsSync(marks)) { const j = JSON.parse(readFileSync(marks, 'utf8')); for (const [section, v] of Object.entries(j)) { if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) put(`review:${section}:${k}`, x, ownerOf(String(k).replace(/^\w+:/, ''))); } }
  // A fingerprint of each source file: the content above is what a child meets; the code is read in the code check.
  for (const f of ['src/ui.jsx', 'src/logic.mjs', 'src/stories.mjs', 'src/curriculum.mjs']) {
    const p = join(root, f); if (!existsSync(p)) continue; const text = readFileSync(p, 'utf8');
    put(`code:${f}`, `${text.split('\n').length} lines, sha256 ${createHash('sha256').update(text).digest('hex').slice(0, 16)}`);
  }
  return { root, items, scope };
}

if (process.argv[1] && process.argv[1].endsWith('content-snapshot.mjs')) {
  const args = process.argv.slice(2); const option = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
  const out = option('--out');
  if (!out) { console.log('usage: node tools/content-snapshot.mjs [--root <project folder>] --out <file.json>'); process.exitCode = 1; } else {
    const root = resolve(option('--root') || fileURLToPath(new URL('..', import.meta.url)));
    const snap = await snapshot(root);
    writeFileSync(out, JSON.stringify(snap));
    console.log(`${Object.keys(snap.items).length} items from ${root} written to ${out}`);
  }
}
