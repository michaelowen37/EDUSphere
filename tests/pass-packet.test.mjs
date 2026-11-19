// The Wise Human. Copyright (c) 2026. Source-available; not for reuse. See LICENSE.md.
// The pass packet, held to its three files (Q95, Mikey's answer in pass NH: "Q95 - A"). In plain terms: tools/pass-packet.mjs copies
// the lines of docs/RULES-AUDIT.md, docs/EARMARKS.md and docs/INDEPENDENT-CHECKS.md that a pass's areas touch and lists the rest in
// an index, and a new chat's lead reads the packet in place of the whole files. A copy that drifted from its file, a line in neither
// the copy nor the index, or an index line that points at the wrong place would let a rule slip by unread, so this test makes the
// packet for several sets of areas and checks, for each:
//   - every copied line is its file's line, byte for byte, at the line number it carries;
//   - every line of the three files is in the packet once, copied or in the index (a brief of INDEPENDENT-CHECKS by its section's
//     first and last lines), and every index line names the right line by its title;
//   - what every packet copies whatever the areas (RULES-AUDIT's opening and sections 1, 9 but its older learned rows, 10 and 11; the
//     newest three passes' learned rows; EARMARKS's opening, When they are built and How to add one; INDEPENDENT-CHECKS's How the
//     checks fit together, Who checks each part of NEW-CHAT, When, How, the alignment read and the final read) is copied whole;
//   - each area's sections are copied whole when it is chosen, and --all copies every line and indexes none.
// Near misses, each made from a real packet and caught: a copied line changed by one character, a copied line dropped, an index line
// pointing one line off, a file changed after its packet was made, and a copied line that differs from its file only in its bytes
// (a no-break space for a space).
// Since pass NS (Mikey's answer to Q120, "Q120 - A"): every packet copies INDEPENDENT-CHECKS' ripple read with the alignment and final
// reads (EARMARKS L28), and a task packet (--task), one agent's packet read whole, is held too: every line it copies is its file's line
// byte for byte; it copies nothing every packet copies unless its own words, areas or briefs choose it, and no index; it copies every row
// its words name by its title, with the headings and table headers that keep each row in place; and its head gives its own bytes, and
// says it is over when it holds more than about 40,000. Near misses, each caught: a packet made with the same words but not as a task
// (the always list and the index in it), its head's count one byte off, an index put back under it, and a matched row dropped.
// Run: node tests/pass-packet.test.mjs
import { readFileSync } from 'node:fs'; import { spawnSync } from 'node:child_process'; import { fileURLToPath } from 'node:url';
const T = await import('../tools/pass-packet.mjs');
let passed = 0, failed = 0;
const ok = (name, cond, info) => { if (cond) { passed++; console.log('PASS - ' + name); } else { failed++; console.log('FAIL - ' + name + (info !== undefined ? '  ' + JSON.stringify(info).slice(0, 600) : '')); } };

// The files read as the tool reads them, from the project folder (since round two's code read: by the working folder this test could not
// be run from another one, while the tool could).
const TEXTS = Object.fromEntries(Object.keys(T.SOURCES).map((k) => [k, T.sourceText(k)]));
const linesOf = (texts) => Object.fromEntries(Object.entries(texts).map(([k, t]) => [k, t.split('\n')]));

// Every fault a packet has against the files' texts: copies that differ by a byte, lines in neither part or in both, index lines
// that name the wrong line. Returns { faults, copied } where copied maps each file to the set of its line numbers copied.
export function checkPacket(text, texts = TEXTS) {
  const faults = []; const src = linesOf(texts);
  const copied = { RA: new Set(), EA: new Set(), IC: new Set() }; const indexed = { RA: new Set(), EA: new Set(), IC: new Set() };
  let part = null, file = null;
  for (const line of String(text).split('\n')) {
    const head = line.match(/^## (docs\/[A-Z-]+\.md): (copied|index of the rest)$/);
    if (head) { file = Object.keys(T.SOURCES).find((k) => T.SOURCES[k] === head[1]); part = head[2]; continue; }
    if (!part || !line) continue;
    if (part === 'copied') {
      const m = line.match(/^\[(RA|EA|IC) (\d+)\] ([\s\S]*)$/); if (!m || m[1] !== file) { faults.push({ kind: 'not a copied line', line: line.slice(0, 80) }); continue; }
      const n = +m[2]; const want = src[file][n - 1];
      if (want === undefined || Buffer.compare(Buffer.from(m[3]), Buffer.from(want)) !== 0) faults.push({ kind: 'copy differs from its file', at: `${file} ${n}` });
      if (copied[file].has(n)) faults.push({ kind: 'copied twice', at: `${file} ${n}` }); copied[file].add(n);
    } else {
      const r = line.match(/^\[IC (\d+)-(\d+)\] (.+) \((\d+) lines, /);
      if (file === 'IC' && r) {
        const a = +r[1], b = +r[2]; const section = r[3];
        for (let n = a; n <= b; n++) if (src.IC[n - 1] !== undefined && src.IC[n - 1].trim()) { if (indexed.IC.has(n)) faults.push({ kind: 'indexed twice', at: `IC ${n}` }); indexed.IC.add(n); }
        // The range is one section: it starts at that section's heading (or the file's first line, for the opening) and runs to the
        // line before the next heading's blank.
        const startOk = section === '0' ? a === 1 : src.IC[a - 1] === `## ${section}`;
        const nextHead = src.IC.findIndex((l, i) => i > a - 1 && /^## /.test(l));
        const endOk = (nextHead < 0 ? src.IC.length : nextHead) >= b && src.IC.slice(b, nextHead < 0 ? undefined : nextHead).every((l) => !l.trim());
        if (!startOk || !endOk) faults.push({ kind: 'brief range is not its section', at: `IC ${a}-${b}`, section });
        continue;
      }
      const m = line.match(/^\[(RA|EA) (\d+)\] (.*) \((\d+ bytes|[\d.]+ KB)\)$/);
      if (!m || m[1] !== file) { faults.push({ kind: 'not an index line', line: line.slice(0, 80) }); continue; }
      const n = +m[2]; const want = src[file][n - 1];
      if (want === undefined || !want.trim()) { faults.push({ kind: 'index names no line', at: `${file} ${n}` }); continue; }
      const kind = /^#{1,4} /.test(want) ? 'heading' : /^\|(\s*-{3,}\s*\|)+\s*$/.test(want) || /^\| (Rule|#|Item|Domain|File) \|/.test(want) ? 'header' : 'row';
      const title = kind === 'heading' ? want.trim().slice(0, 80) : kind === 'header' ? "(a table's header line)" : T.titleOf(want);
      if (!m[3].endsWith(title)) faults.push({ kind: 'index title is not its line\'s', at: `${file} ${n}`, has: m[3].slice(0, 60), want: title.slice(0, 60) });
      if (indexed[file].has(n)) faults.push({ kind: 'indexed twice', at: `${file} ${n}` }); indexed[file].add(n);
    }
  }
  // Every nonblank line of every file, copied or indexed, never both. (A blank line is copied when it sits inside a copied run? Never:
  // blank lines are left out of both parts, since they carry nothing.)
  for (const k of Object.keys(src)) src[k].forEach((l, i) => {
    const n = i + 1; if (!l.trim()) return;
    const c = copied[k].has(n), x = indexed[k].has(n);
    if (!c && !x) faults.push({ kind: 'in neither part', at: `${k} ${n}` });
    if (c && x) faults.push({ kind: 'in both parts', at: `${k} ${n}` });
  });
  return { faults, copied };
}

// The sections of a file, each with its line numbers, read the same way the tool reads them.
const sectionLines = (key, section) => T.linesOf(key, TEXTS[key]).filter((l) => l.section === section && l.kind !== 'blank').map((l) => l.n);
const learnedLines = () => T.linesOf('RA', TEXTS.RA).filter((l) => l.section === '9' && T.learnedPass(l.line)).map((l) => ({ n: l.n, pass: T.learnedPass(l.line) }));

const SETS = [
  { name: 'no areas (what every packet copies)', opts: {} },
  { name: 'pass NH\'s start (screens, banks, letters, prek)', opts: { areas: ['screens', 'banks', 'letters', 'prek'] } },
  { name: 'a pre-K lesson pass', opts: { areas: ['lessons', 'banks', 'stories', 'audio', 'pictures', 'wonder', 'standards', 'letters', 'prek'], briefs: ['lesson', 'code'] } },
  { name: 'every area and every brief', opts: { areas: Object.keys(T.AREAS), briefs: ['story', 'story flow', 'picture', 'screen', 'lesson', 'Wonder', 'game', 'code'] } },
  { name: 'a match of its own', opts: { areas: ['banks'], match: 'scroll cue' } },
  { name: '--all', opts: { all: true } },
];
const learned = learnedLines(); const passes = [...new Set(learned.map((l) => l.pass))].sort(); const newest = new Set(passes.slice(-3));
for (const set of SETS) {
  const text = T.packet(set.opts); const { faults, copied } = checkPacket(text);
  ok(`${set.name}: every copy is its file's line byte for byte, and every line is in the packet once`, faults.length === 0, faults.slice(0, 6));
  const want = (key, section, why) => { const miss = sectionLines(key, section).filter((n) => !copied[key].has(n) && !(key === 'RA' && section === '9' && learned.some((l) => l.n === n && !newest.has(l.pass) && !(set.opts.areas || []).includes('process') && !set.opts.all))); return miss.length ? `${why}: ${key} lines ${miss.slice(0, 5).join(', ')}` : null; };
  const always = [want('RA', '0', 'RULES-AUDIT\'s opening'), want('RA', '1', 'section 1'), want('RA', '9', 'section 9'), want('RA', '10', 'section 10'), want('RA', '11', 'section 11'),
    want('EA', '0', 'EARMARKS\'s opening'), want('EA', 'When they are built', 'When they are built'), want('EA', 'How to add one', 'How to add one'),
    ...['0', 'How the checks fit together', 'Who checks each part of NEW-CHAT', 'When', 'How', 'The ripple read', 'The alignment read', 'The final read'].map((s) => want('IC', s, s))].filter(Boolean);
  ok(`${set.name}: what every packet copies is copied whole`, always.length === 0, always);
  const newestCopied = learned.filter((l) => newest.has(l.pass)).every((l) => copied.RA.has(l.n));
  ok(`${set.name}: the newest three passes' learned rows are copied (${[...newest].join(', ')})`, newestCopied);
  const whole = [];
  for (const a of set.opts.areas || []) { const A = T.AREAS[a];
    for (const s of A.ra || []) { const miss = sectionLines('RA', s).filter((n) => !copied.RA.has(n)); if (miss.length) whole.push(`${a}: RA §${s} lines ${miss.slice(0, 4).join(', ')}`); }
    for (const s of A.ea || []) { const secs = [...new Set(T.linesOf('EA', TEXTS.EA).map((l) => l.section))].filter((x) => x === s); for (const x of secs) { const miss = sectionLines('EA', x).filter((n) => !copied.EA.has(n)); if (miss.length) whole.push(`${a}: EA ${x} lines ${miss.slice(0, 4).join(', ')}`); } } }
  ok(`${set.name}: each chosen area's sections are copied whole`, whole.length === 0, whole);
  if (set.opts.all) {
    const all = Object.keys(T.SOURCES).every((k) => TEXTS[k].split('\n').every((l, i) => !l.trim() || copied[k].has(i + 1)));
    ok('--all copies every line of the three files and indexes none', all && !/\n\[(RA|EA) \d+\] [^\n]* \((\d+ bytes|[\d.]+ KB)\)\n/.test(text.split('index of the rest').slice(1).join('')));
  }
}

// The near misses, each made from a real packet.
const base = T.packet({ areas: ['banks', 'letters'] });
const baseLines = base.split('\n');
const firstCopy = baseLines.findIndex((l) => /^\[RA \d+\] \| \*\*/.test(l));
{ const p = [...baseLines]; p[firstCopy] = p[firstCopy].replace(/ the /, ' teh '); ok('near miss: a copied line changed by one word is caught', checkPacket(p.join('\n')).faults.some((f) => f.kind === 'copy differs from its file')); }
{ const p = [...baseLines]; p.splice(firstCopy, 1); ok('near miss: a copied line dropped is caught (in neither part)', checkPacket(p.join('\n')).faults.some((f) => f.kind === 'in neither part')); }
{ const p = [...baseLines]; const i = p.findIndex((l) => /^\[RA \d+\] §\d+ [A-Z][^(]+ \(/.test(l)); p[i] = p[i].replace(/^\[RA (\d+)\]/, (m, n) => `[RA ${+n + 1}]`); ok('near miss: an index line one line off is caught', checkPacket(p.join('\n')).faults.length > 0); }
{ const changed = { ...TEXTS, RA: TEXTS.RA.replace('\n| Every question is generated by arithmetic from a seed', '\n| Every question is generated by arithmetics from a seed') };
  ok('near miss: a file changed after its packet was made is caught', changed.RA !== TEXTS.RA && checkPacket(base, changed).faults.some((f) => f.kind === 'copy differs from its file')); }
{ const p = [...baseLines]; const at = p[firstCopy].indexOf('] ') + 2; const body = p[firstCopy].slice(at); const sp = body.indexOf(' ', 3);
  p[firstCopy] = p[firstCopy].slice(0, at) + body.slice(0, sp) + '\u00A0' + body.slice(sp + 1);
  ok('near miss: a copy differing only in its bytes (a no-break space) is caught', sp > 0 && p[firstCopy].length === baseLines[firstCopy].length && checkPacket(p.join('\n')).faults.some((f) => f.kind === 'copy differs from its file')); }

// What the areas choose (since pass NH's round one code read, which undid seven parts of the choosing one at a time in a copy of the tool,
// --match, the areas' words, the open earmarks, --briefs, the header lines, the headings and the newest three passes' learned rows, and
// found that every check above still passed: they held the packet's copies, not its choices). Each is read here from a real packet.
const TEXTS_LINES = Object.fromEntries(Object.entries(TEXTS).map(([k, t]) => [k, T.linesOf(k, t)]));
const copiedOf = (opts) => checkPacket(T.packet(opts)).copied;
{ // (a) --match: every rules audit row whose title holds the words is copied, rows outside the chosen sections among them.
  const c = copiedOf({ areas: ['banks'], match: 'scroll cue' });
  const rows = TEXTS_LINES.RA.filter((l) => l.kind === 'row' && /scroll cue/i.test(T.titleOf(l.line, 400)));
  ok('--match copies every rules audit row whose title holds its words, outside the chosen areas too', rows.length > 0 && rows.every((l) => c.RA.has(l.n)) && rows.some((l) => l.section !== '6'), rows.map((l) => l.n));
  // Since round two's code read: and an open earmark that only --match reaches (A118, the serif run where Georgia is missing).
  const georgia = TEXTS_LINES.EA.find((l) => l.line.startsWith('| A118 |')); const g = copiedOf({ areas: ['banks'], match: 'Georgia' }); const none = copiedOf({ areas: ['banks'] });
  ok('--match copies an open earmark whose title holds its words, which the areas alone leave in the index (A118)', !!georgia && g.EA.has(georgia.n) && !none.EA.has(georgia.n), georgia && georgia.n); }
{ // (b) an area's words: letters alone copies section 8's row on the grown-up's card and the open earmarks whose titles hold its words,
  // and leaves in the index a row whose title holds none of them (a row's own text is not read, so its whole text holding the words is no reason).
  const c = copiedOf({ areas: ['letters'] });
  const card = TEXTS_LINES.RA.find((l) => /^\| \*\*The grown-up's card on a device with no voice/.test(l.line));
  const open = TEXTS_LINES.EA.filter((l) => l.kind === 'row' && T.openEarmark(l.line) && T.AREAS.letters.words.test(T.titleOf(l.line, 400)));
  const bodyOnly = TEXTS_LINES.RA.find((l) => l.kind === 'row' && !['0', '1', '9', '10', '11'].includes(l.section) && !T.AREAS.letters.words.test(T.titleOf(l.line, 400)) && T.AREAS.letters.words.test(l.line));
  ok("an area's words copy the rows and open earmarks whose titles hold them (letters: the grown-up's card's row and the open letters earmarks), never a row only its text holds them in", !!card && c.RA.has(card.n) && open.length > 0 && open.every((l) => c.EA.has(l.n)) && !!bodyOnly && !c.RA.has(bodyOnly.n), { card: card && card.n, open: open.map((l) => l.n), bodyOnly: bodyOnly && bodyOnly.n });
  // Since round two's code read: the rows the letters words reach since round one widened them (sounds, what a letter says, the device
  // voice), each found by its title, and no Done earmark, whatever its title holds.
  const wide = [/^\| \*\*Two near sounds never side by side/, /^\| \*\*A reason says another letter's sound only as what it is not/, /^\| \*\*X's sound, two sounds said together/, /^\| \*\*The device voice is US English first/].map((re) => TEXTS_LINES.RA.find((l) => re.test(l.line)));
  const done = TEXTS_LINES.EA.filter((l) => l.kind === 'row' && !T.openEarmark(l.line) && /^\| [AELP]\d+ \|/.test(l.line) && T.AREAS.letters.words.test(T.titleOf(l.line, 400)));
  ok("letters copies the four rows round one's wider words reach (two near sounds, a reason's other sound, X's sound, the device voice), and no Done earmark its words name", wide.every(Boolean) && wide.every((l) => c.RA.has(l.n)) && done.length > 0 && done.every((l) => !c.EA.has(l.n)), { wide: wide.map((l) => l && l.n), done: done.map((l) => l.n) }); }
{ // (c) --briefs: the code brief copied whole, and no other brief.
  const c = copiedOf({ briefs: ['code'] });
  const of = (name) => TEXTS_LINES.IC.filter((l) => l.section === name && l.kind !== 'blank');
  const others = ['The story brief', 'The screen brief', 'The lesson brief', 'The picture brief'].flatMap(of);
  ok('--briefs copies the brief it names whole and no other', of('The code brief').length > 0 && of('The code brief').every((l) => c.IC.has(l.n)) && others.every((l) => !c.IC.has(l.n))); }
{ // (d) every copied row keeps its ## heading, its ### heading and its own table's header lines, and no table's header line is copied
  // without a row of that table.
  const c = copiedOf({ areas: ['letters', 'prek'] }); const lost = [];
  for (const k of ['RA', 'EA']) { const L = TEXTS_LINES[k];
    for (let i = 0; i < L.length; i++) { const l = L[i]; if (l.kind !== 'row' || !c[k].has(l.n)) continue;
      const head = [...L.slice(0, i)].reverse().find((p) => /^## /.test(p.line)); if (head && !c[k].has(head.n)) lost.push(`${k} ${l.n}: its heading`);
      if (l.sub) { const sub = [...L.slice(0, i)].reverse().find((p) => /^### /.test(p.line)); if (sub && !c[k].has(sub.n)) lost.push(`${k} ${l.n}: its sub-heading`); }
      if (/^\|/.test(l.line)) { let j = i - 1; while (j >= 0 && /^\|/.test(L[j].line)) { if (L[j].kind === 'header' && !c[k].has(L[j].n)) lost.push(`${k} ${l.n}: its table's header`); j--; } } }
    // A header line copied with no row of its own table below it.
    for (let i = 0; i < L.length; i++) { if (L[i].kind !== 'header' || !c[k].has(L[i].n)) continue; let j = i + 1; let has = false; while (j < L.length && /^\|/.test(L[j].line)) { if (L[j].kind === 'row' && c[k].has(L[j].n)) has = true; j++; } if (!has) lost.push(`${k} ${L[i].n}: a header with no row of its table`); } }
  ok("every copied row keeps its heading, its sub-heading and its own table's header lines, and no table's header is copied without a row of that table", lost.length === 0, lost.slice(0, 6)); }
{ // (e) the learned rows: with no process area the fourth newest pass's are in the index, and with it every pass's are copied.
  const learned = TEXTS_LINES.RA.filter((l) => l.section === '9' && T.learnedPass(l.line)); const passes = [...new Set(learned.map((l) => T.learnedPass(l.line)))].sort();
  const fourth = learned.filter((l) => T.learnedPass(l.line) === passes[passes.length - 4]);
  const without = copiedOf({}); const withIt = copiedOf({ areas: ['process'] });
  ok("section 9's learned rows: the fourth newest pass's are left to the index with no process area, and every pass's are copied with it", fourth.length > 0 && fourth.every((l) => !without.RA.has(l.n)) && learned.every((l) => withIt.RA.has(l.n)), passes.slice(-4)); }
{ // (f) every section, heading and brief an area or the always list names is in its file, so a renamed heading fails here, not silently.
  const has = (k, s) => TEXTS_LINES[k].some((l) => l.section === s);
  const missing = Object.entries(T.AREAS).flatMap(([n, a]) => [...(a.ra || []).filter((s) => !has('RA', s)).map((s) => `${n}: RA ${s}`), ...(a.ea || []).filter((s) => !has('EA', s)).map((s) => `${n}: EA ${s}`), ...(a.ic || []).filter((s) => !has('IC', s)).map((s) => `${n}: IC ${s}`)]);
  for (const b of ['story', 'story flow', 'picture', 'screen', 'lesson', 'Wonder', 'game', 'code']) if (!has('IC', `The ${b} brief`)) missing.push(`brief ${b}`);
  if (!has('IC', 'The accuracy check')) missing.push('brief accuracy check');   // since round two's code read: --briefs "accuracy check" takes it
  ok('every section, heading and brief the areas name is in its file (a renamed heading would fail here)', missing.length === 0, missing); }

// The areas the tool offers are the ones its own list prints, and every area takes something.
{ // (g) since round two's final read (pass NH): prek copies the rules audit rows a pre-K lesson pass needs that its other areas leave to
  // the index, each named by its title: a pre-K lesson requires what its ideas build on, the young voice, and the two rows on every pre-K
  // line and question fitting a short phone. Near miss: prek without its words leaves them in the index, caught.
  const lesson = ['lessons', 'banks', 'stories', 'audio', 'pictures', 'wonder', 'standards', 'letters', 'prek'];
  const want = [/^\| \*\*A pre-K lesson requires what its ideas build on/, /^\| \*\*The young voice/, /^\| \*\*Every pre-K lesson line and question fits a short phone/, /^\| \*\*No pre-K line or question waits under a short phone's fold/]
    .map((re) => TEXTS_LINES.RA.find((l) => re.test(l.line)));
  const c = copiedOf({ areas: lesson });
  const kept = T.AREAS.prek.words; let without = null;
  try { delete T.AREAS.prek.words; without = copiedOf({ areas: lesson }); } finally { T.AREAS.prek.words = kept; }
  ok("a pre-K lesson pass's packet copies the four rows on a pre-K lesson's requires, the young voice and the short phone, which only prek's words reach (their words taken away, planted, leave them in the index, caught)",
    want.every(Boolean) && want.every((l) => c.RA.has(l.n)) && !!without && want.some((l) => !without.RA.has(l.n)), want.map((l) => l && l.n)); }
{ // (h) since round two's whole read of EARMARKS (pass NH): screens copies the open earmarks whose title names a screen read, pass,
  // sweep, check or engineer, which it had left in the index (A117's practice titles at 320, A120's test page margin and A121, what pass
  // NH's screen read did not reach). Near miss: screens without its words leaves them in the index, caught.
  const want = ['A117', 'A120', 'A121'].map((id) => TEXTS_LINES.EA.find((l) => l.line.startsWith(`| ${id} |`)));
  const c = copiedOf({ areas: ['screens'] });
  const kept = T.AREAS.screens.words; let without = null;
  try { delete T.AREAS.screens.words; without = copiedOf({ areas: ['screens'] }); } finally { T.AREAS.screens.words = kept; }
  ok("screens copies the open earmarks that wait for a screen read (A117, A120 and A121; its words taken away, planted, leave them in the index, caught)",
    want.every(Boolean) && want.every((l) => c.EA.has(l.n)) && !!without && want.every((l) => !without.EA.has(l.n)), want.map((l) => l && l.n)); }
{ // (i) since round two's code read: an area takes an EARMARKS section by its whole heading, so grade1 takes Grade 1 and never a Grade 10
  // section that starts with the same words (none exists yet, so one is planted in a copy of the text with an open row; caught by a start
  // match, measured by the read).
  const texts = { ...TEXTS, EA: TEXTS.EA + '\n## Grade 10\n\n| E99 | A planted grade 10 row (pass ZZ) | ZZ | Waiting |\n' };
  const lines = T.choose({ areas: ['grade1'], texts }).EA; const g10 = lines.filter((l) => l.section === 'Grade 10' && l.kind === 'row');
  ok('grade1 takes Grade 1 by its whole heading and no row of a planted Grade 10', g10.length === 1 && g10.every((l) => !l.copied) && lines.some((l) => l.section === 'Grade 1' && l.copied), g10.map((l) => l.n)); }
{ // (j) since round two's code read: the tool reads its files from its own folder, so run from another folder it makes the same packet
  // (it stopped with a bare ENOENT before round one's code read).
  const { execFileSync } = await import('node:child_process'); const { tmpdir } = await import('node:os'); const { fileURLToPath } = await import('node:url');
  let out = ''; let error = null;
  try { out = execFileSync(process.execPath, [fileURLToPath(new URL('../tools/pass-packet.mjs', import.meta.url)), '--areas', 'banks,letters'], { cwd: tmpdir(), encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] }); } catch (e) { error = String(e.message).split('\n').slice(0, 2).join(' '); }
  const r = out ? checkPacket(out) : { faults: ['no packet'], copied: { RA: new Set(), EA: new Set(), IC: new Set() } }; const mine = checkPacket(T.packet({ areas: ['banks', 'letters'] }));
  const same = ['RA', 'EA', 'IC'].every((k) => r.copied[k].size === mine.copied[k].size && [...r.copied[k]].every((n) => mine.copied[k].has(n)));
  ok('the tool run from another folder makes the same packet, every line in its place', !error && r.faults.length === 0 && same, error || r.faults.slice(0, 3)); }
// The earmark rows every screen brief names (pass NK, round three's whole read of INDEPENDENT-CHECKS: six screen briefs had left them out):
// every row on the list open in EARMARKS, every open row whose status waits for the next screen read on the list, the packet printing them
// with the screen brief and not without it; an open row planted with that status and left off the list, caught.
{ const ea = TEXTS.EA.split('\n');
  const open = (id) => ea.some((l) => l.startsWith('| ' + id + ' |') && T.openEarmark(l));
  const waiting = (lines) => lines.filter(T.waitsForScreenRead).map((l) => l.match(/^\| ([AELP]\d+) \|/)[1]);
  const missing = (lines) => waiting(lines).filter((id) => !T.SCREEN_BRIEF_ROWS.includes(id));
  const withScreen = T.packet({ briefs: ['screen'] }); const without = T.packet({ briefs: ['code'] });
  const planted = [...ea, '| A999 | A planted row (the pass packet test) | NK | Waiting (the next screen read) |'];
  ok('the pass packet names the earmark rows every screen brief names, each open in EARMARKS, every open row waiting for the next screen read among them, with the screen brief and not without it (pass NK; an open row waiting for the next screen read left off the list, planted, caught)',
    T.SCREEN_BRIEF_ROWS.every(open) && missing(ea).length === 0 && waiting(ea).length >= 5 && withScreen.includes('## The earmark rows every screen brief names') && T.SCREEN_BRIEF_ROWS.every((id) => withScreen.includes('\n- ' + id + ' ') && !withScreen.includes('\n- ' + id + ' (not found')) && !without.includes('## The earmark rows every screen brief names') && checkPacket(withScreen).faults.length === 0 && missing(planted).join() === 'A999',
    { notOpen: T.SCREEN_BRIEF_ROWS.filter((id) => !open(id)), missing: missing(ea) }); }
// A task packet (Q120 (a), pass NS): one agent's rows alone, read whole. Its faults against the files' texts, for the options it was made
// with: a copy that differs from its file, a line every packet copies that its own words, areas and briefs did not choose, an index, a
// row its words name left out, and a head whose count is not its own bytes, or that says over or not as its bytes are.
{ const ALWAYS_SECTIONS = { RA: ['0', '1', '9', '10', '11'], EA: ['0', 'When they are built', 'How to add one'], IC: ['0', 'How the checks fit together', 'Who checks each part of NEW-CHAT', 'When', 'How', 'The ripple read', 'The alignment read', 'The final read'] };
  const taskFaults = (text, opts) => { const out = []; const src = linesOf(TEXTS); let file = null;
    const chosen = T.choose({ ...opts, task: true });
    const words = opts.match ? new RegExp(opts.match, 'i') : null; const picked = (opts.areas || []).map((a) => T.AREAS[a]);
    const areaWords = picked.map((a) => a.words).filter(Boolean); const areaRa = picked.flatMap((a) => a.ra || []); const areaEa = picked.flatMap((a) => a.ea || []);
    const briefSections = (opts.briefs || []).flatMap((b) => [`The ${b} brief`, `The ${b}`]);
    const copied = { RA: new Set(), EA: new Set(), IC: new Set() };
    for (const line of String(text).split('\n')) {
      const head = line.match(/^## (docs\/[A-Z-]+\.md): (.+)$/);
      if (head) { if (head[2] !== 'copied for this task') out.push(`a part that is not copied rows: ${line.slice(0, 60)}`); file = Object.keys(T.SOURCES).find((k) => T.SOURCES[k] === head[1]); continue; }
      const m = line.match(/^\[(RA|EA|IC) (\d+)\] ([\s\S]*)$/); if (!m) continue;
      if (m[1] !== file) { out.push(`a line under another file's heading: ${line.slice(0, 60)}`); continue; }
      const want = src[m[1]][+m[2] - 1]; if (want === undefined || Buffer.compare(Buffer.from(m[3]), Buffer.from(want)) !== 0) out.push(`copy differs: ${m[1]} ${m[2]}`);
      copied[m[1]].add(+m[2]); }
    // Nothing every packet copies, unless this task's words, areas or briefs choose it.
    for (const k of ['RA', 'EA', 'IC']) for (const l of T.linesOf(k, TEXTS[k])) { if (!copied[k].has(l.n) || l.kind !== 'row' || !ALWAYS_SECTIONS[k].includes(l.section)) continue;
      const mine = (k === 'RA' && (areaRa.includes(l.section) || [words, ...areaWords].some((w) => w && w.test(T.titleOf(l.line, 400)))))
        || (k === 'EA' && (areaEa.includes(l.section) || (T.openEarmark(l.line) && [words, ...areaWords].some((w) => w && w.test(T.titleOf(l.line, 400))))))
        || (k === 'IC' && briefSections.includes(l.section));
      if (!mine) out.push(`a line every packet copies, not this task's: ${k} ${l.n}`); }
    // Every row this task's words name by its title is copied (in RULES-AUDIT any row, in EARMARKS an open one).
    if (words) for (const k of ['RA', 'EA']) for (const l of T.linesOf(k, TEXTS[k])) if (l.kind === 'row' && (k === 'RA' || T.openEarmark(l.line)) && words.test(T.titleOf(l.line, 400)) && !copied[k].has(l.n)) out.push(`a row its words name, left out: ${k} ${l.n}`);
    if (/^## docs\/[A-Z-]+\.md: index of the rest$/m.test(text)) out.push('an index');
    // The head's count is the packet's own bytes, over or not as they are.
    const said = (text.match(/\n(\d+) rows, ([\d,]+) bytes in all(\. Over the about [\d,]+ bytes[^\n]*)?\.\n/) || []);
    const bytes = Buffer.byteLength(text); const n = said[2] ? Number(said[2].replace(/,/g, '')) : -1;
    if (n !== bytes) out.push(`its head says ${n} bytes, it holds ${bytes}`);
    if (!!said[3] !== (bytes > T.TASK_BYTES)) out.push(`its head says over ${!!said[3]}, at ${bytes} bytes`);
    const rows = Object.values(chosen).reduce((x, ls) => x + ls.filter((l) => l.copied && l.kind === 'row').length, 0); if (Number(said[1]) !== rows) out.push(`its head says ${said[1]} rows, it copies ${rows}`);
    return out; };
  const TASKS = [{ match: 'pre-K lesson|yes or no bank|answer tile|say-along|read-along' }, { match: "grown-up's card|GROWN_UP_CARD", briefs: ['screen'] }, { match: 'pass packet|whole reads?|ripple read', briefs: ['code'] }, { areas: ['licensing'] }];
  const made = TASKS.map((o) => [o, T.packet({ ...o, task: true })]);
  const now = made.map(([o, t]) => [JSON.stringify(o), taskFaults(t, o)]).filter(([, f]) => f.length);
  ok(`a task packet copies its own rows alone, each its file's line byte for byte, every row its words name, nothing every packet copies that it did not choose and no index, and its head gives its own bytes, over or not as they are (pass NS, Q120 (a); ${made.map(([, t]) => Buffer.byteLength(t).toLocaleString('en-US')).join(', ')} bytes)`, now.length === 0, now.slice(0, 3));
  // The near misses, each made from a real task packet.
  const [o0, t0] = made[0];
  const notTask = T.packet(o0); const offByOne = t0.replace(/(\n\d+ rows, )([\d,]+)( bytes in all)/, (m, a, n, b) => a + (Number(n.replace(/,/g, '')) + 1).toLocaleString('en-US') + b);
  const indexed = t0 + '\n## docs/RULES-AUDIT.md: index of the rest\n\n[RA 1] a line (10 bytes)\n';
  const dropped = t0.split('\n').filter((l, i, all) => i !== all.findIndex((x) => /^\[RA \d+\] \| \*\*/.test(x))).join('\n');
  const plants = [taskFaults(notTask, o0).some((f) => /every packet copies/.test(f)) && taskFaults(notTask, o0).some((f) => /an index|not copied rows/.test(f)), taskFaults(offByOne, o0).some((f) => /its head says/.test(f)), taskFaults(indexed, o0).some((f) => /an index|not copied rows/.test(f)), taskFaults(dropped, o0).some((f) => /left out/.test(f))];
  ok('near misses: a packet with the same words but not a task, its head\'s count one byte off, an index put back and a matched row dropped, each caught (pass NS)', plants.every(Boolean), plants);
  // Since round one's code read of pass NS, which undid each of these alone and found the test still passing: Mikey's number held; the
  // command line run as the lead runs it, once under the size and once over, its file the very bytes its head counts and the terminal's
  // note there only when over; the screen rows in a task packet whose briefs take the screen brief; the edge of the size pinned with a
  // planted row; and words of --match that name no row named, and a packet with no row refused.
  ok('a task packet holds about 40,000 bytes, Mikey\'s number (Q120 (a): "under about 40,000 bytes and read whole"), and is over only past it (round one\'s code read of pass NS)', T.TASK_BYTES === 40000 && !T.taskOver(40000) && T.taskOver(40001));
  { const tool = fileURLToPath(new URL('../tools/pass-packet.mjs', import.meta.url));
    const run = (args) => spawnSync(process.execPath, [tool, '--task', ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    const headCount = (s) => { const m = String(s).match(/\n\d+ rows, ([\d,]+) bytes in all/); return m ? Number(m[1].replace(/,/g, '')) : -1; };
    const under = run(['--match', TASKS[2].match]); const over = run(['--match', TASKS[2].match, '--briefs', 'code']);
    const fine = (r, isOver) => r.status === 0 && r.stdout.startsWith('# Task packet\n') && Buffer.byteLength(r.stdout) === headCount(r.stdout)
      && /\. Over the about 40,000 bytes/.test(r.stdout) === isOver && /NOTE: this task packet holds [\d,]+ bytes, over/.test(r.stderr) === isOver;
    ok(`the command line prints a task packet whose file holds the very bytes its head counts, and says over on the terminal only when it is over (${Buffer.byteLength(under.stdout).toLocaleString('en-US')} bytes under, ${Buffer.byteLength(over.stdout).toLocaleString('en-US')} over with the code brief, which it says to give by line range; round one's code read of pass NS)`,
      fine(under, false) && fine(over, true) && /give a reader its brief by its line range/.test(over.stderr) && /give the reader its brief by its line range and leave --briefs out/.test(over.stdout),
      { under: [under.status, Buffer.byteLength(under.stdout), headCount(under.stdout), under.stderr.slice(0, 200)], over: [over.status, Buffer.byteLength(over.stdout), headCount(over.stdout), over.stderr.slice(0, 200)] });
    const none = run([]); const missed = run(['--match', 'zzzqqq|^The pass packet']);
    ok('words of --match that name no row are named in the head and on the terminal, the rest kept, and a task packet with no row at all exits 2 with a plain note (round one\'s code read of pass NS)',
      missed.status === 0 && /\nWords that named no row: zzzqqq\. /.test(missed.stdout) && /NOTE: these words of --match name no row: zzzqqq\.\n/.test(missed.stderr) && headCount(missed.stdout) === Buffer.byteLength(missed.stdout) && /\n[1-9]\d* rows, /.test(missed.stdout)
        && !/Words that named no row/.test(under.stdout) && !/name no row/.test(under.stderr) && none.status === 2 && /NOTE: this task packet holds no row/.test(none.stderr),
      { missed: [missed.status, missed.stderr.slice(0, 200)], none: [none.status, none.stderr.slice(0, 200)] }); }
  ok('the words of --match are split at each | outside parentheses and brackets, and a word that names no rules audit row and no open earmark by its title is found, an open earmark\'s title and a word in other capitals naming their rows (round one\'s code read and round two\'s records read of pass NS)',
    JSON.stringify(T.matchParts('a|(b|c)|[|]|d\\|e||f')) === JSON.stringify(['a', '(b|c)', '[|]', 'd\\|e', 'f']) && T.unmatchedWords(TASKS[0].match).length === 0 && JSON.stringify(T.unmatchedWords('zzzqqq|^The pass packet|(qqzz|xxyy)')) === JSON.stringify(['zzzqqq', '(qqzz|xxyy)']) && T.unmatchedWords(null).length === 0
    // Since round two's records read: an open earmark's title names its row, and a word in other capitals names its row too, as the packet reads them.
    // Since pass NU the open earmark is the first row of the screen brief's list, which the check above holds open (it was A172, which pass NU closed).
    && T.unmatchedWords('^' + T.SCREEN_BRIEF_ROWS[0]).length === 0 && T.unmatchedWords("GROWN-UP'S CARD ON A DEVICE").length === 0);
  ok('a task packet whose briefs take the screen brief holds the earmark rows every screen brief names, and one without it does not (round one\'s code read of pass NS)',
    made[1][1].includes('## The earmark rows every screen brief names') && T.SCREEN_BRIEF_ROWS.every((id) => made[1][1].includes('\n- ' + id + ' ')) && !made[0][1].includes('## The earmark rows every screen brief names') && !made[2][1].includes('## The earmark rows every screen brief names'));
  // The edge, with a planted row padded until its packet holds exactly 40,000 bytes: that packet is not over, and one byte more of its
  // row is (the over words then lengthen the head, so no packet holds exactly 40,001).
  { const plant = (pad) => ({ ...TEXTS, RA: TEXTS.RA + `\n| **Zqedge, a planted row (pass ZZ)** | ${'x'.repeat(pad)} |\n` });
    const at = (pad) => T.packet({ match: 'Zqedge', task: true, texts: plant(pad) });
    let pad = 39000; for (let i = 0; i < 6 && Buffer.byteLength(at(pad)) !== T.TASK_BYTES; i++) pad += T.TASK_BYTES - Buffer.byteLength(at(pad));
    const edge = at(pad), past = at(pad + 1); const said = (t) => (t.match(/\n(\d+) rows, ([\d,]+) bytes in all(\. Over[^\n]*)?\.\n/) || []);
    ok(`a planted row padded until its task packet holds exactly 40,000 bytes is not over, and one byte more of it is over (then ${Buffer.byteLength(past).toLocaleString('en-US')} bytes with the over words; round one's code read of pass NS)`,
      Buffer.byteLength(edge) === 40000 && said(edge)[1] === '1' && said(edge)[2] === '40,000' && !said(edge)[3]
        && said(past)[1] === '1' && !!said(past)[3] && Number(String(said(past)[2]).replace(/,/g, '')) === Buffer.byteLength(past) && Buffer.byteLength(past) > 40001,
      { edge: [Buffer.byteLength(edge), said(edge).slice(1)], past: [Buffer.byteLength(past), said(past).slice(1, 3)] }); }
  // --task and --all are opposite asks, refused with a plain message.
  ok('--task with --all is refused with a plain message (pass NS)', (() => { try { T.choose({ all: true, task: true }); return false; } catch (e) { return /opposite packets/.test(e.message); } })()); }
ok('every area takes a section, a brief or words', Object.values(T.AREAS).every((a) => (a.ra || []).length || (a.ea || []).length || (a.ic || []).length || a.words));
ok('an unknown area is refused with a plain message', (() => { try { T.choose({ areas: ['nonsense'] }); return false; } catch (e) { return /no such area: nonsense/.test(e.message); } })());

console.log(`\n${passed} passed, ${failed} failed`);
process.exitCode = failed ? 1 : 0;
