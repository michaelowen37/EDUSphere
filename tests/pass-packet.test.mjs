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
// Run: node tests/pass-packet.test.mjs
import { readFileSync } from 'node:fs';
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
    ...['0', 'How the checks fit together', 'Who checks each part of NEW-CHAT', 'When', 'How', 'The alignment read', 'The final read'].map((s) => want('IC', s, s))].filter(Boolean);
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
ok('every area takes a section, a brief or words', Object.values(T.AREAS).every((a) => (a.ra || []).length || (a.ea || []).length || (a.ic || []).length || a.words));
ok('an unknown area is refused with a plain message', (() => { try { T.choose({ areas: ['nonsense'] }); return false; } catch (e) { return /no such area: nonsense/.test(e.message); } })());

console.log(`\n${passed} passed, ${failed} failed`);
process.exitCode = failed ? 1 : 0;
