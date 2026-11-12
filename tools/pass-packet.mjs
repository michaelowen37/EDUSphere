// The Wise Human. Copyright (c) 2026. Source-available; not for reuse. See LICENSE.md.
// The pass packet (Q95, Mikey's answer in pass NH: "Q95 - A"; raised by pass NG's weekly flow review, run on Fable).
//
// In plain terms: a new chat used to start by reading the whole of docs/RULES-AUDIT.md, docs/EARMARKS.md and
// docs/INDEPENDENT-CHECKS.md, about 1.2 MB, more than a lead can hold before it works, and whatever it held it paid to read again on
// every turn of the pass. This tool copies, word for word, the lines of those three files that the pass's areas touch, and lists
// every other line in an index, one short line each with its file, its line number and its title, so the lead reads the packet and
// opens a full file only where the index points. The full files stay the only source of the rules: the packet is a copy made at the
// start of a pass and never kept in the repository, the alignment read and the final read still read the full files whole, and
// tests/pass-packet.test.mjs holds every copied line to its file byte for byte and every line of the three files to the packet once,
// copied or indexed. Each pass's DECISIONS entry names the areas it chose and counts any finding traced to a line the packet left
// out (the docs sync test holds the entry to it), so the areas can be widened where they missed.
//
// What an area takes (Claude's design, within Mikey's choice): a RULES-AUDIT section whole (stories is section 3, audio 4, lessons
// 5, banks 6, algorithms 7, screens 2 and 8, process every line of 9), or every RULES-AUDIT line whose title (its bold lead-in, or its
// first cell) holds the area's words (pictures, wonder, games, educator, licensing, standards, letters, audio, and since pass NH's round two screens and prek; a line's whole text
// would take most of the file, since pass NH's round one code read measured it); in EARMARKS, the sections an area names, each by its
// whole heading (prek, kindergarten, grade1, program), and every open row (Waiting) whose title holds the area's words; in
// INDEPENDENT-CHECKS, only the briefs --briefs names (an area takes none, since each check's agent reads its own brief). Always
// copied, whatever the areas: RULES-AUDIT's opening, section 1 (the vision), section 9 but its learned rows (every line of the
// process a pass follows), the learned rows of the newest three passes, section 10 (the plan) and section 11 (the questions);
// EARMARKS's opening, When they are built and How to add one; INDEPENDENT-CHECKS's How the checks fit together, Who checks each part
// of NEW-CHAT, When, How, the alignment read and the final read. A heading or a table's header line is copied with any line under it
// that is copied (its own table's, read back through the table's rows), so a copied row keeps its place. --match adds words of its own,
// read against titles too, in RULES-AUDIT and EARMARKS.
//
// Run: node tools/pass-packet.mjs --areas lessons,banks,letters,prek [--briefs code,screen] [--match <regular expression>] [--all]
//      > <scratch folder>/packet.md        (--list prints every area and what it takes; --all copies every line, for the test)
import { readFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url';

// The three files, by the short names the packet's line labels use.
export const SOURCES = { RA: 'docs/RULES-AUDIT.md', EA: 'docs/EARMARKS.md', IC: 'docs/INDEPENDENT-CHECKS.md' };
// A file is read from the project folder this tool sits in, wherever it is run from (a URL made into a path with fileURLToPath).
export const sourceText = (key) => readFileSync(fileURLToPath(new URL(`../${SOURCES[key]}`, import.meta.url)), 'utf8');

// Every area: what it takes whole (RULES-AUDIT sections by number, EARMARKS sections by their whole heading) and the words that pull a
// single row in from elsewhere by its title (in RULES-AUDIT any row, in EARMARKS an open one); INDEPENDENT-CHECKS' briefs come by --briefs alone.
export const AREAS = {
  stories: { say: 'stories: their writing, flow and cast', ra: ['3'] },
  audio: { say: 'the Eleven v4 audio and the audio ledger', ra: ['4'], words: /\b(audio ledger|Eleven|recordings?)\b/i },
  lessons: { say: 'lessons and their scripts', ra: ['5'] },
  banks: { say: 'questions and banks', ra: ['6'] },
  algorithms: { say: 'mastery, reviews, loop back and the other algorithms', ra: ['7'] },
  // Since round two's whole read of EARMARKS (pass NH): screens also takes the open earmarks, and any rules audit row, whose title names a
  // screen read, pass, sweep, check or engineer, since the rows that wait for the next screen read were in its index alone.
  screens: { say: 'the product map, screens, privacy and licensing', ra: ['2', '8'], words: /\bscreen (reads?|pass(es)?|sweeps?|checks?|engineers?)\b/i },
  process: { say: 'every learned row of section 9, not only the newest three passes', ra: ['9'] },
  pictures: { say: 'pictures, paintings and the art ledger', words: /\b(pictures?|paintings?|painted|Leonardo|drawings?|drawn|IconPic|ART-REQUESTS)\b/i },
  wonder: { say: 'the Wonder questions', words: /\bWonder\b/ },
  games: { say: 'games and their welcomes', words: /\b(games?|welcomes?)\b/i },
  educator: { say: 'the educator screens, reports, roster and backups', words: /\b(educators?|reports?|Action Items|roster|backups?)\b/i },
  licensing: { say: 'licensing and the free courses', words: /\b(licens\w*|TEFA|storefront|courseIsFree)\b/i },
  standards: { say: 'standards and citations', words: /\b(standards?|TEKS|TAC|Head Start|ELOF|Common Core|citations?|2027 recommendations)\b/ },
  letters: { say: 'the letters lessons, their sounds and the grown-up\'s card', words: /(grown-up's card|GROWN_UP_CARD\w*|which-sound|letter-name|letters? (lessons?|banks?|questions?|says?)|\bsounds?\b|SPEECH_SOUNDS|isLettersQuestion|device voice|\bnames? hold)/i },
  // Since round two's final read (pass NH): prek also takes the RULES-AUDIT rows whose title names a pre-K lesson or line, or the young
  // voice (a lesson requires what its ideas build on, the young voice, and every pre-K line fitting a short phone), which a pre-K lesson
  // pass needs and its other areas left to the index.
  prek: { say: 'the pre-K earmarks (E12, E13 and the 2027 map)', ea: ['Pre-K 3', 'Pre-K 4', 'Pre-K 3 and pre-K 4 by the 2027 recommendations (pass MR)', 'Pre-K 3 and pre-K 4, side by side by domain (pass MN; its 2022 codes are replaced since pass MR by the 2027 map above)'], words: /(pre-K (lessons?|lines?)|young voice)/i },
  kindergarten: { say: 'the kindergarten earmarks', ea: ['Kindergarten'] },
  grade1: { say: 'the grade 1 earmarks', ea: ['Grade 1'] },
  program: { say: 'the program items (L rows)', ea: ['Program items'] },
};
// What every packet copies, whatever the areas.
const ALWAYS = { ra: ['0', '1', '9', '10', '11'], ea: ['0', 'When they are built', 'How to add one'],
  ic: ['0', 'How the checks fit together', 'Who checks each part of NEW-CHAT', 'When', 'How', 'The alignment read', 'The final read'] };
const NEWEST_LEARNED = 3;   // how many passes' learned rows section 9 copies when the process area is not chosen

// A file's lines, each with its number (from 1), its section and what kind of line it is. A section is named by its heading: in
// RULES-AUDIT by its number ("8", and "7a" belongs to "7"), elsewhere by the heading's words; lines before the first heading are "0".
export function linesOf(key, text) {
  const out = []; let section = '0', sub = '';
  String(text).split('\n').forEach((line, i) => {
    const n = i + 1;
    if (/^## /.test(line)) { section = key === 'RA' ? (line.match(/^## (\d+)\./) || [, line.slice(3)])[1] : line.slice(3).trim(); sub = ''; }
    else if (/^### /.test(line)) sub = line.slice(4).trim();
    const kind = !line.trim() ? 'blank' : /^#{1,4} /.test(line) ? 'heading' : /^\|(\s*-{3,}\s*\|)+\s*$/.test(line) || /^\| (Rule|#|Item|Domain|File) \|/.test(line) ? 'header' : 'row';
    out.push({ key, n, line, section, sub, kind });
  });
  return out;
}

// A line's title for the index: a bold lead-in where it has one, an earmark's number and the start of its text, or the start of the
// line. At most 72 characters, so the index stays short.
export function titleOf(line, most = 72) {
  let t = String(line).replace(/^\|\s*/, '').replace(/^-\s+/, '');
  const ea = t.match(/^([AELP]\d+) \| (.*)$/);
  if (ea) t = ea[1] + ' ' + ea[2].replace(/\*\*/g, '');
  else { const bold = t.match(/^\*\*(.+?)\*\*/); t = bold ? bold[1].replace(/:$/, '') : t.replace(/\*\*/g, ''); }
  t = t.replace(/\s+\|.*$/, '').trim();
  return t.length > most ? t.slice(0, most) : t;
}

// A section 9 row of lessons learned, and the pass it is from ("What pass NG learned", "Checks learned in pass MS").
export const learnedPass = (line) => { const m = String(line).match(/^\| \*\*(?:What pass ([A-Z]{2}) learned|Checks learned in pass ([A-Z]{2}))/); return m ? (m[1] || m[2]) : null; };
// An EARMARKS row still to do: an earmark row whose last cell does not start with Done.
export const openEarmark = (line) => { const m = String(line).match(/^\| [AELP]\d+ \|.*\| ([^|]*) \|\s*$/); return !!m && !/^Done/.test(m[1].trim()); };

// Which lines a packet copies, for the areas, the briefs and the extra words chosen. Returns, for each file, its lines with copied set.
export function choose({ areas = [], briefs = [], match = null, all = false, texts = null } = {}) {
  const unknown = areas.filter((a) => !AREAS[a]); if (unknown.length) throw new Error(`no such area: ${unknown.join(', ')} (node tools/pass-packet.mjs --list)`);
  const picked = areas.map((a) => AREAS[a]);
  const raWhole = new Set([...ALWAYS.ra, ...picked.flatMap((a) => a.ra || [])]);
  const eaWhole = [...ALWAYS.ea, ...picked.flatMap((a) => a.ea || [])];
  const icWhole = new Set([...ALWAYS.ic, ...picked.flatMap((a) => a.ic || []), ...briefs.map((b) => `The ${b} brief`), ...briefs.map((b) => `The ${b}`)]);
  const words = picked.map((a) => a.words).filter(Boolean); if (match) words.push(new RegExp(match, 'i'));
  const holds = (line) => words.some((w) => w.test(titleOf(line, 400)));
  const out = {};
  for (const [key, path] of Object.entries(SOURCES)) {
    const lines = linesOf(key, texts ? texts[key] : sourceText(key));
    // Section 9's learned rows: the newest three passes' unless the process area takes them all.
    const learned = [...new Set(lines.filter((l) => key === 'RA' && l.section === '9').map((l) => learnedPass(l.line)).filter(Boolean))].sort();
    const newest = new Set(learned.slice(-NEWEST_LEARNED));
    for (const l of lines) {
      if (l.kind === 'blank') { l.copied = false; continue; }
      if (all) { l.copied = true; continue; }
      if (key === 'RA') {
        const lp = l.section === '9' ? learnedPass(l.line) : null;
        l.copied = raWhole.has(l.section) && !(lp && !newest.has(lp) && !areas.includes('process')) || (l.kind === 'row' && holds(l.line));
      } else if (key === 'EA') l.copied = eaWhole.includes(l.section) || (l.kind === 'row' && openEarmark(l.line) && holds(l.line));
      else l.copied = icWhole.has(l.section);
    }
    // A copied line keeps the heading of its section and its table's header lines, so it reads in place.
    for (let i = 0; i < lines.length; i++) {
      if (!lines[i].copied || lines[i].kind !== 'row') continue;
      let inTable = /^\|/.test(lines[i].line);
      for (let j = i - 1; j >= 0; j--) {
        const p = lines[j];
        // A table's header lines are copied only with a row of that table: the walk back keeps to the table's own lines.
        if (inTable) { if (p.kind === 'header') { p.copied = true; continue; } if (!/^\|/.test(p.line)) inTable = false; }
        if (p.kind === 'heading' && /^### /.test(p.line) && p.section === lines[i].section && lines[i].sub && p.line.slice(4).trim() === lines[i].sub) p.copied = true;
        if (p.kind === 'heading' && /^## /.test(p.line)) { p.copied = true; break; }
      }
    }
    out[key] = lines;
  }
  return out;
}

// The index of what a packet leaves out. In RULES-AUDIT and EARMARKS, one line for each line not copied: "[RA 74] §3 " and its title,
// with its size; in INDEPENDENT-CHECKS, one line for each section not copied, by its first and last lines ("[IC 67-93] The story
// brief"), since a check's agent reads its own brief and the lead opens one only to write that check's brief.
const kb = (n) => (n < 1024 ? `${n} bytes` : `${(n / 1024).toFixed(1)} KB`);
export function indexOf(key, lines) {
  const out = [];
  if (key === 'IC') {
    const groups = new Map();
    for (const l of lines) { if (l.copied) continue; if (!groups.has(l.section)) groups.set(l.section, []); groups.get(l.section).push(l); }
    for (const [section, ls] of groups) {
      const rows = ls.filter((l) => l.kind !== 'blank'); if (!rows.length) continue;
      out.push(`[IC ${rows[0].n}-${rows[rows.length - 1].n}] ${section} (${rows.length} lines, ${kb(rows.reduce((s, l) => s + Buffer.byteLength(l.line) + 1, 0))})`);
    }
    return out;
  }
  // RULES-AUDIT's lines carry their section's number; an earmark carries its own number (A1, E12, L5), so EARMARKS's need none.
  const where = (l) => (key === 'RA' ? `§${l.section} ` : '');
  for (const l of lines) {
    if (l.copied || l.kind === 'blank') continue;
    const what = l.kind === 'heading' ? l.line.trim().slice(0, 80) : l.kind === 'header' ? '(a table\'s header line)' : titleOf(l.line);
    out.push(`[${key} ${l.n}] ${where(l)}${what} (${kb(Buffer.byteLength(l.line))})`);
  }
  return out;
}

// The packet as text: a short head, then each file's copied lines and its index. Every copied line is "[RA 529] " and the line
// exactly as the file has it.
export function packet(opts = {}) {
  const chosen = choose(opts); const parts = [];
  const sizes = Object.entries(chosen).map(([key, lines]) => {
    const bytes = (l) => Buffer.byteLength(l.line) + 1;
    const total = lines.reduce((s, l) => s + bytes(l), 0) - 1;   // the last line has no newline after it
    const copied = lines.filter((l) => l.copied).reduce((s, l) => s + bytes(l), 0);
    return { key, total, copied, indexed: indexOf(key, lines).length };
  });
  parts.push('# Pass packet', '',
    `Made by node tools/pass-packet.mjs${opts.all ? ' --all' : ''}${(opts.areas || []).length ? ' --areas ' + opts.areas.join(',') : ''}${(opts.briefs || []).length ? ' --briefs ' + opts.briefs.join(',') : ''}${opts.match ? ` --match '${opts.match}'` : ''}.`,
    'A copy, never a source: the full files are the only source of the rules. Each copied line starts with its file and line number, so the full file opens at the same place (Read with offset). The index lists every line not copied, by its title; open the full file where a line bears on the work. A finding traced to a line the packet left out is counted in the pass\'s DECISIONS entry (Q95 (a)).',
    '', '| File | Bytes | Copied | Lines in the index |', '|---|---|---|---|',
    ...sizes.map((s) => `| ${SOURCES[s.key]} | ${s.total} | ${s.copied} | ${s.indexed} |`), '');
  for (const [key, lines] of Object.entries(chosen)) {
    parts.push(`## ${SOURCES[key]}: copied`, '');
    for (const l of lines) if (l.copied) parts.push(`[${key} ${l.n}] ${l.line}`);
    parts.push('', `## ${SOURCES[key]}: index of the rest`, '');
    parts.push(...indexOf(key, lines));
    parts.push('');
  }
  return parts.join('\n');
}

// Run on its own: the packet to standard output, or the list of areas.
if (process.argv[1] && process.argv[1].endsWith('pass-packet.mjs')) {
  const arg = (name) => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : null; };
  if (process.argv.includes('--list')) {
    console.log('Areas (node tools/pass-packet.mjs --areas a,b,c):');
    for (const [name, a] of Object.entries(AREAS)) console.log(`  ${name.padEnd(13)} ${a.say}${a.ra ? '; RULES-AUDIT section ' + a.ra.join(' and ') : ''}${a.ea ? '; EARMARKS ' + a.ea.join(', ') : ''}${a.ic ? '; ' + a.ic.join(', ') : ''}${a.words ? '; lines whose title holds ' + a.words.source.replace(/\\b/g, '') : ''}`);
    console.log('Briefs (--briefs): story, story flow, picture, screen, lesson, Wonder, game, code, accuracy check.');
  } else {
    const list = (v) => (v ? v.split(',').map((x) => x.trim()).filter(Boolean) : []);
    process.stdout.write(packet({ areas: list(arg('--areas')), briefs: list(arg('--briefs')), match: arg('--match'), all: process.argv.includes('--all') }) + '\n');
  }
}
