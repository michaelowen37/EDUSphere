// The Wise Human. Copyright (c) 2026. Source-available; not for reuse. See LICENSE.md.
// The pass packet (Q95, Mikey's answer in pass NH: "Q95 - A"; raised by pass NG's weekly flow review, run on Fable).
//
// In plain terms: a new chat used to start by reading the whole of docs/RULES-AUDIT.md, docs/EARMARKS.md and
// docs/INDEPENDENT-CHECKS.md, about 1.2 MB, more than a lead can hold before it works, and whatever it held it paid to read again on
// every turn of the pass. This tool copies, word for word, the lines of those three files that the pass's areas touch, and lists
// every other line in an index, one short line each with its file, its line number and its title, so the lead reads the packet and
// opens a full file only where the index points. The full files stay the only source of the rules: the packet is a copy made at the
// start of a pass and never kept in the repository, the three files are read whole once a week, in the week's tools pass, with a lesson
// pass's ripple read reading whole the rows that restate what it changed (Mikey's answer to Q119, pass NR: "Q119 - A"; until then the
// alignment read and the final read read them whole after every pass), and tests/pass-packet.test.mjs holds every copied line to its file
// byte for byte and every line of the three files to the packet once, copied or indexed. Each pass's DECISIONS entry names the areas it
// chose and counts any finding traced to a line the packet left out (the docs sync test holds the entry to it), so the areas can be
// widened where they missed.
//
// A packet for each agent (Mikey's answer to Q120, pass NS: "Q120 - A"; raised by pass NR's weekly flow review, run on Fable, its sixth
// recommendation). In plain terms: a pass's one packet had grown past a million bytes (pass NR's was 1,356,261), too long to read, so the
// lead searched it and the engineers and readers it briefed got none, and in pass NR 55 of the 60 must fixes after round zero had
// their rule in the packet and were missed, none traced to a line it left out. Since pass NS each engineer, writer and reader is given a
// packet of its own task's rows alone, made with --task: the rows its --match words name by their titles (its banks, lessons, functions
// and the words of its brief), with any --areas and --briefs it is given, and nothing every packet copies, no index and no screen rows
// unless its --briefs takes the screen brief or, since pass NX, --screen-rows asks for the rows alone (the screen brief takes a task packet
// past its size, so a lead told to drop --briefs had dropped the rows with it); such a packet holds about 40,000 bytes or less, so its
// agent reads it whole, and its head says so when it holds more, so the lead narrows its words or splits the task. The lead reads RULES-AUDIT's sections 9 to 11 whole (the
// process, the plan and the open questions) in place of searching one big packet, and opens any other row where its work needs it. Each
// pass's DECISIONS entry gives each agent's packet, its bytes, and the findings its packet left out and those it held and the agent
// missed. A reader's brief is given beside its packet by its heading, since a brief alone holds about 40,000 to 51,000 bytes; --briefs
// is for a task whose work is a brief's own rows. Since round one's code read of pass NS a task packet names, in its head and on the
// terminal, every word of its --match (each alternative at the top level of the expression) that named no row, since a misspelled name
// leaves its rule out without a word, and the run exits 2 when the packet holds no row at all.
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
//      node tools/pass-packet.mjs --task --match '<an agent's words>' [--briefs <its brief>] [--areas <an area>] [--screen-rows]
//      > <scratch folder>/packet-<agent>.md   (since pass NS, Q120 (a): one agent's packet, read whole; --screen-rows, since pass NX, adds
//      the earmark rows every screen brief names, for a screen read given its brief by its heading)
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
// What every packet copies, whatever the areas (but a task packet, below). Since pass NS INDEPENDENT-CHECKS' ripple read beside the
// alignment and final reads, the reads that read the records after a pass (EARMARKS L28: since Q119 a lesson pass runs it).
const ALWAYS = { ra: ['0', '1', '9', '10', '11'], ea: ['0', 'When they are built', 'How to add one'],
  ic: ['0', 'How the checks fit together', 'Who checks each part of NEW-CHAT', 'When', 'How', 'The ripple read', 'The alignment read', 'The final read'] };
// A task packet's size, read whole by one agent (Q120 (a): "under about 40,000 bytes and read whole"), and when a packet is over it.
export const TASK_BYTES = 40000;
export const taskOver = (bytes) => bytes > TASK_BYTES;
// The alternatives of a --match expression at its top level (split at each | outside parentheses and brackets), and those that name no
// rules audit row and no open earmark by its title, the rows a task packet copies by its words (since round one's code read of pass NS).
export function matchParts(match) {
  const parts = []; let depth = 0, cls = false, cur = '';
  for (let i = 0; i < String(match).length; i++) { const c = match[i];
    if (c === '\\') { cur += c + (match[i + 1] || ''); i += 1; continue; }
    if (cls) { if (c === ']') cls = false; cur += c; continue; }
    if (c === '[') cls = true; else if (c === '(') depth += 1; else if (c === ')') depth -= 1;
    if (c === '|' && depth === 0) { parts.push(cur); cur = ''; continue; }
    cur += c; }
  parts.push(cur); return parts.filter((p) => p !== '');
}
export function unmatchedWords(match, texts = null) {
  if (!match) return [];
  const titles = [...linesOf('RA', texts ? texts.RA : sourceText('RA')).filter((l) => l.kind === 'row'), ...linesOf('EA', texts ? texts.EA : sourceText('EA')).filter((l) => l.kind === 'row' && openEarmark(l.line))].map((l) => titleOf(l.line, 400));
  return matchParts(match).filter((p) => { const re = new RegExp(p, 'i'); return !titles.some((t) => re.test(t)); });
}
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

// The earmark rows every screen brief names until a read has taken them (INDEPENDENT-CHECKS, the screen brief). Pass NK's round three
// whole read of INDEPENDENT-CHECKS found the rule resting on the lead's memory, six screen briefs having left the rows out, round one's
// of pass NK among them, so the list is kept here, in one place, and a packet whose --briefs takes the screen brief prints it with each
// row's title, as since pass NX does a packet made with --screen-rows, which prints the rows without copying the brief (the brief alone
// takes a task packet past its 40,000 bytes, so a lead told to drop --briefs dropped the rows with it); the pass packet test holds the list
// to EARMARKS both ways (every row here open and still Waiting, so a row a read has taken comes off, and every open row whose status waits
// for the next screen read here).
export const SCREEN_BRIEF_ROWS = ['A36', 'A106', 'A107', 'A108', 'A109', 'A110', 'A116', 'A117', 'A118', 'A121', 'A134', 'A135', 'A136', 'A137', 'A140', 'A142', 'A144', 'A145', 'A146', 'L18'];   // A145 since pass NN: the uncentered read's blind spots; A146 since pass NP: what the read-along's checks do not yet see; A171, from pass NR, That reminds me!'s last two lines with motion on, off since pass NX, found clean by its round one's screen read; A175 to A177, from pass NU, What's new's notes on a phone held sideways, the Quick Review card's x beside its title at 320, and the ten pop-ups whose foot round one's screen read of pass NU did not read, off since pass NX, which fixed them (A172, from pass NS, and A173 and A174, from pass NT, done in pass NU); A155, from pass NQ, the Look back button with a course's whole label, off since pass NX, fixed in pass NR and read so by two screen reads, its status Fixed and no longer Waiting
export const waitsForScreenRead = (line) => { const m = String(line).match(/^\| [AELP]\d+ \|.*\| ([^|]*) \|\s*$/); return !!m && openEarmark(line) && /\bthe next screen read\b/i.test(m[1]); };
export function screenRowsSection(eaText) {
  const rows = String(eaText).split('\n');
  const named = SCREEN_BRIEF_ROWS.map((id) => { const l = rows.find((x) => x.startsWith('| ' + id + ' |')); return l ? `- ${titleOf(l, 160)}` : `- ${id} (not found in EARMARKS)`; });
  return ['## The earmark rows every screen brief names', '', 'Name each of these rows in the screen brief, with what the read is to look at in it; a read that cannot reach one says so (INDEPENDENT-CHECKS, the screen brief).', '', ...named, ''];
}
// Whether a packet prints those rows: its --briefs takes the screen brief, or since pass NX --screen-rows asks for them alone. Both kinds of
// packet read this one rule.
export const screenRowsAsked = (opts = {}) => !!opts.screenRows || (opts.briefs || []).includes('screen');

// Which lines a packet copies, for the areas, the briefs and the extra words chosen. Returns, for each file, its lines with copied set.
// Since pass NS (Q120 (a)) a task packet (task) copies only what its areas, briefs and words choose, nothing every packet copies.
export function choose({ areas = [], briefs = [], match = null, all = false, task = false, texts = null } = {}) {
  const unknown = areas.filter((a) => !AREAS[a]); if (unknown.length) throw new Error(`no such area: ${unknown.join(', ')} (node tools/pass-packet.mjs --list)`);
  if (task && all) throw new Error('--task and --all ask for opposite packets: a task packet copies one agent\'s rows, --all every line');
  const picked = areas.map((a) => AREAS[a]); const always = task ? { ra: [], ea: [], ic: [] } : ALWAYS;
  const raWhole = new Set([...always.ra, ...picked.flatMap((a) => a.ra || [])]);
  const eaWhole = [...always.ea, ...picked.flatMap((a) => a.ea || [])];
  const icWhole = new Set([...always.ic, ...picked.flatMap((a) => a.ic || []), ...briefs.map((b) => `The ${b} brief`), ...briefs.map((b) => `The ${b}`)]);
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
// Since pass NS (Q120 (a)) a task packet (opts.task) has a head of its own, its copied lines and no index: its agent reads it whole, and
// its head names its bytes and says so when they pass TASK_BYTES.
export function packet(opts = {}) {
  if (opts.task) return taskPacket(opts);
  const chosen = choose(opts); const parts = [];
  const sizes = Object.entries(chosen).map(([key, lines]) => {
    const bytes = (l) => Buffer.byteLength(l.line) + 1;
    const total = lines.reduce((s, l) => s + bytes(l), 0) - 1;   // the last line has no newline after it
    const copied = lines.filter((l) => l.copied).reduce((s, l) => s + bytes(l), 0);
    return { key, total, copied, indexed: indexOf(key, lines).length };
  });
  parts.push('# Pass packet', '',
    `Made by node tools/pass-packet.mjs${opts.all ? ' --all' : ''}${(opts.areas || []).length ? ' --areas ' + opts.areas.join(',') : ''}${(opts.briefs || []).length ? ' --briefs ' + opts.briefs.join(',') : ''}${opts.match ? ` --match '${opts.match}'` : ''}${opts.screenRows ? ' --screen-rows' : ''}.`,
    'A copy, never a source: the full files are the only source of the rules. Each copied line starts with its file and line number, so the full file opens at the same place (Read with offset). The index lists every line not copied, by its title; open the full file where a line bears on the work. A finding traced to a line the packet left out is counted in the pass\'s DECISIONS entry (Q95 (a)).',
    '', '| File | Bytes | Copied | Lines in the index |', '|---|---|---|---|',
    ...sizes.map((s) => `| ${SOURCES[s.key]} | ${s.total} | ${s.copied} | ${s.indexed} |`), '');
  // The earmark rows every screen brief names, with the screen brief or, since pass NX, by --screen-rows alone.
  if (screenRowsAsked(opts)) parts.push(...screenRowsSection(opts.texts ? opts.texts.EA : sourceText('EA')));
  for (const [key, lines] of Object.entries(chosen)) {
    parts.push(`## ${SOURCES[key]}: copied`, '');
    for (const l of lines) if (l.copied) parts.push(`[${key} ${l.n}] ${l.line}`);
    parts.push('', `## ${SOURCES[key]}: index of the rest`, '');
    parts.push(...indexOf(key, lines));
    parts.push('');
  }
  return parts.join('\n');
}

// One agent's packet (Q120 (a)): the head, then each file's copied lines, with no index, read whole by the agent it is made for.
export function taskPacket(opts = {}) {
  const chosen = choose({ ...opts, task: true });
  const body = [];
  // The earmark rows every screen brief names: with --briefs screen, or since pass NX with --screen-rows, which copies no brief, so a screen
  // read's task packet keeps the rows under its 40,000 bytes and its brief goes beside it by its heading.
  if (screenRowsAsked(opts)) body.push(...screenRowsSection(opts.texts ? opts.texts.EA : sourceText('EA')));
  for (const [key, lines] of Object.entries(chosen)) {
    const copied = lines.filter((l) => l.copied); if (!copied.length) continue;
    body.push(`## ${SOURCES[key]}: copied for this task`, '', ...copied.map((l) => `[${key} ${l.n}] ${l.line}`), '');
  }
  const made = `Made by node tools/pass-packet.mjs --task${(opts.areas || []).length ? ' --areas ' + opts.areas.join(',') : ''}${(opts.briefs || []).length ? ' --briefs ' + opts.briefs.join(',') : ''}${opts.match ? ` --match '${opts.match}'` : ''}${opts.screenRows ? ' --screen-rows' : ''}.`;
  const say = 'A copy, never a source: the full files are the only source of the rules. These are the rows of docs/RULES-AUDIT.md and the open rows of docs/EARMARKS.md this task\'s words name (each row by its title), with the sections of docs/INDEPENDENT-CHECKS.md its --briefs name (a reader\'s brief is given beside this packet by its heading), each starting with its file and line number, so the full file opens at the same place. Read every row before you start, from the first to the last. A row this packet left out is opened where your brief or your work points to it, and a finding whose rule it left out is said so in your report (Q120 (a)).';
  const rows = Object.values(chosen).reduce((n, lines) => n + lines.filter((l) => l.copied && l.kind === 'row').length, 0);
  // Words that named no row (since round one's code read), and, over the size, what to do: a brief alone holds about 40,000 to 51,000 bytes, so a
  // packet that takes one is given its brief by its heading instead.
  const missed = unmatchedWords(opts.match, opts.texts);
  const overSay = (opts.briefs || []).length ? `. Over the about ${TASK_BYTES.toLocaleString('en-US')} bytes a task packet holds so its agent reads it whole: a brief alone holds about 40,000 to 51,000 bytes, so give the reader its brief by its heading and leave --briefs out` : `. Over the about ${TASK_BYTES.toLocaleString('en-US')} bytes a task packet holds so its agent reads it whole: narrow its words, or split the task`;
  // The head counts its own bytes: the body's, and the head's as written with its count in it (a fixed point, found in two steps).
  const headOf = (bytes) => ['# Task packet', '', made, say, ...(missed.length ? [`Words that named no row: ${missed.join(', ')}. A misspelled name leaves its rule out: check each before the agent starts.`] : []), '', `${rows} rows, ${bytes.toLocaleString('en-US')} bytes in all${taskOver(bytes) ? overSay : ''}.`, ''];
  const bodyText = body.join('\n'); let bytes = Buffer.byteLength(bodyText);
  for (let i = 0; i < 3; i++) bytes = Buffer.byteLength(headOf(bytes).join('\n') + '\n' + bodyText);
  return headOf(bytes).join('\n') + '\n' + bodyText;
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
    const task = process.argv.includes('--task');
    const text = packet({ areas: list(arg('--areas')), briefs: list(arg('--briefs')), match: arg('--match'), all: process.argv.includes('--all'), task, screenRows: process.argv.includes('--screen-rows') });
    // A task packet ends with its own newline, so the file holds the very bytes its head counts.
    process.stdout.write(task ? text : text + '\n');
    // A task packet past its size says so on the terminal too, where the lead runs it (the packet's head says it as well), as do words
    // that named no row; a task packet that holds no row at all exits 2 (since round one's code read of pass NS).
    if (task && taskOver(Buffer.byteLength(text))) console.error(`NOTE: this task packet holds ${Buffer.byteLength(text).toLocaleString('en-US')} bytes, over the about ${TASK_BYTES.toLocaleString('en-US')} a task packet holds; narrow --match or split the task${list(arg('--briefs')).length ? ', and give a reader its brief by its heading' : ''}.`);
    if (task) { const missed = unmatchedWords(arg('--match')); if (missed.length) console.error(`NOTE: these words of --match name no row: ${missed.join(', ')}.`);
      if (/\n0 rows, /.test(text)) { console.error('NOTE: this task packet holds no row: give it --match words that name its rows.'); process.exitCode = 2; } }
  }
}
