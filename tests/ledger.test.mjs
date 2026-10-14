// Every picture the app expects from Mikey has a row in the art ledger, so no photo is ever forgotten:
// story serials (S), coloring page serials (L), and nothing in the ledger that the app does not use.
import { readFileSync } from 'node:fs';
import { STORIES, COURSE_STORIES, MASTERY_STORIES, COLOR_PAGES } from '../src/stories.mjs';
import { stylesFor, ROW, TRY_ROW } from '../tools/coloring-levels.mjs';
import { MAP_SERIALS, MODULES } from '../src/logic.mjs';
let pass = 0; let fail = 0;
const ok = (label, cond, detail = '') => { console.log((cond ? 'PASS' : 'FAIL') + ' - ' + label + (cond ? '' : '  ' + detail)); cond ? pass++ : fail++; };
const ledger = readFileSync('docs/ART-REQUESTS.md', 'utf8');
const rows = new Set([...ledger.matchAll(/^\| ((?:CS|[SLDMP])\d+) \|/gm)].map((m) => m[1]));
const lessonSerials = MODULES.flatMap((m) => (m.lesson && m.lesson.pictures || []).map((p) => p.serial));   // lesson pictures (pass JO)
const storySerials = Object.values(STORIES).flatMap((s) => [s.art, ...(s.more || []).map((m) => m.serial)]);
const letterSerials = 'abcdefghijklmnopqrstuvwxyz'.split('').map((ch, i) => `L${i + 1}`);
const drawingSerials = [...Array.from({ length: 27 }, (_, i) => `D${i + 1}`), ...Object.values(COLOR_PAGES).map(([serial]) => serial)];   // lesson pages D28 on (2026-09-24)
const courseSerials = [...Object.values(COURSE_STORIES), ...Object.values(MASTERY_STORIES)].flatMap((s) => [s.art, ...(s.more || []).map((m) => m.serial)]);   // doubled long stories carry five more (2026-09-24); the next long stories too (pass MH)
const missing = [...storySerials, ...letterSerials, ...drawingSerials, ...courseSerials, ...MAP_SERIALS, ...lessonSerials].filter((x) => !rows.has(x));
ok('every lesson picture has a ledger row and a serial of its own', lessonSerials.every((x) => rows.has(x)) && new Set(lessonSerials).size === lessonSerials.length && MODULES.every((m) => (m.lesson && m.lesson.pictures || []).every((p) => /^P\d+$/.test(p.serial) && p.alt && p.alt.length > 5)), lessonSerials.filter((x) => !rows.has(x)).join(','));
ok('every story picture has a ledger row', missing.filter((x) => x.startsWith('S')).length === 0, missing.filter((x) => x.startsWith('S')).join(','));
ok('every letter coloring page has a ledger row', missing.filter((x) => x.startsWith('L')).length === 0, missing.filter((x) => x.startsWith('L')).join(','));
ok('every drawing page has a ledger row', missing.filter((x) => x.startsWith('D')).length === 0, missing.filter((x) => x.startsWith('D')).join(','));
ok('every course story has a ledger row', missing.filter((x) => x.startsWith('CS')).length === 0, missing.filter((x) => x.startsWith('CS')).join(','));
ok('every map has a ledger row', missing.filter((x) => x.startsWith('M')).length === 0, missing.filter((x) => x.startsWith('M')).join(','));
const used = new Set([...storySerials, ...letterSerials, ...drawingSerials, ...courseSerials, ...MAP_SERIALS, ...lessonSerials]);
const orphans = [...rows].filter((x) => !used.has(x));
ok('the ledger has no rows the app does not use', orphans.length === 0, orphans.join(','));
// Better pages (pass LX): every G serial the screens name in BETTER_PAGES has a ledger row, and every G row is named there.
{
  const ui = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8');
  const block = ui.slice(ui.indexOf('const BETTER_PAGES = {'), ui.indexOf('};', ui.indexOf('const BETTER_PAGES = {')));
  const named = [...block.matchAll(/\['(G\d+)'/g)].map((m) => m[1]);
  const gRows = [...ledger.matchAll(/^\| (G\d+) \|/gm)].map((m) => m[1]);
  ok('every better coloring page has a ledger row, and the ledger has no G row the app does not use', named.length >= 1 && named.every((g) => gRows.includes(g)) && gRows.every((g) => named.includes(g)), `named ${named.join(',')} rows ${gRows.join(',')}`);
}
// Shelf pictures (pass MG, Mikey: the Surprise me row's picture, "You can create a Leonardo prompt for this one too."): every U
// serial the screens name in SHELF_ART has a ledger row with a prompt and a status, and every U row is named there, so a
// painting is never asked for that the app does not use, and the app never waits for one the ledger forgot.
{
  const ui = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8');
  const block = ui.slice(ui.indexOf('const SHELF_ART = {'), ui.indexOf('};', ui.indexOf('const SHELF_ART = {')));
  const named = [...block.matchAll(/'(U\d+)'/g)].map((m) => m[1]);
  const uRows = ledger.split('\n').filter((l) => /^\| U\d+ \|/.test(l));
  const uSerials = uRows.map((l) => l.split(' | ')[0].slice(2));
  // Since pass MI (Mikey's answer to Q33: "flat is okay.  We can make a prompt for the flat version of the 3D character so it
  // still matches in a way.") a head-and-shoulders portrait asks for the flat, outlined style, as the same person its 3D
  // character sheet shows; any other screen picture keeps the house 3D style.
  const flat = 'Style: Flat vector illustration with clean, even dark outlines';
  const whole = uRows.every((l) => { const cols = l.split(' | '); const portrait = /head-and-shoulders portrait/.test(cols[3] || ''); return cols.length === 6 && (portrait ? cols[3].includes(flat) && /drawn flat and outlined/.test(cols[3]) && /Character: C\d+\.$/.test(cols[3].trim()) : cols[3].includes('Style: Clean 3D vector illustration')) && /^text, words, letters/.test(cols[4]) && /\| (?:Needed|Done) \|$/.test(l); });
  ok('every shelf picture the screens name has a ledger row with its prompt, and the ledger has no U row the app does not use', named.length >= 1 && named.every((u) => uSerials.includes(u)) && uSerials.every((u) => named.includes(u)) && whole, `named ${named.join(',')} rows ${uSerials.join(',')}`);
}
// Lesson paintings keep one style (pass MF, Mikey's answer to Q8, "your choice"): a P row shows a real thing a lesson line
// names, not a story scene, so none takes a story subject's anchor (distinct geometric shapes would stylize a fire truck). Its
// framing follows what it shows (the picture check): a close-up for one thing, a straight-on view where a shape, a size
// or a length must read true (a close-up's perspective turns a circle oval and shrinks the far paper clips; never "flat",
// which an image model can read as flat design beside the 3D style, the alignment read), and a wide view
// where a whole landmark or place must show; each ends on soft shadows.
{
  const pRows = ledger.split('\n').filter((l) => /^\| P\d+ \|/.test(l));
  // A character note ends a prompt in the ledger's own form, Character: C13. (the code check: the first form written here was
  // one the ledger never uses, so a core-cast lesson painting would have failed with its anchor kept).
  // A story subject's anchor anywhere in the prompt fails too (the code check's second read: the test read only the end).
  const off = pRows.filter((l) => { const prompt = l.split(' | ')[3] || ''; return !/uncluttered layout, (?:dynamic close-up|a straight-on view|a wide view), soft shadows\.(?: Character: C\d+(?:, C\d+)*\.)?$/.test(prompt.trim()) || /distinct geometric shapes|heroic composition|soft cinematic lighting|character-focused|dreamy lighting/i.test(prompt); });
  const framed = (f) => pRows.filter((l) => (l.split(' | ')[3] || '').includes(`uncluttered layout, ${f}, soft shadows.`)).length;
  ok('every lesson painting ends on one of the three framings with soft shadows, whatever its subject (Q8)', pRows.length >= 100 && off.length === 0 && framed('a straight-on view') >= 20 && framed('a wide view') >= 10, off.map((l) => l.split(' | ')[0].slice(2)).join(','));
}
// Character notes (pass LX): a sheet note (Character: C1.) ends the prompt. The batch driver used to append a kept note after
// the negative prompt, so 19 rows told Leonardo to avoid the very character the picture should show.
{
  const bad = ledger.split('\n').filter((l) => /^\| (?:CS|[SPDLMG])\d+ \|/.test(l)).filter((l) => { const cols = l.split(' | '); return cols.length >= 6 && /Character: C\d/.test(cols[cols.length - 2]); });
  ok('no negative prompt names a character sheet (a sheet note ends the prompt)', bad.length === 0, bad.map((l) => l.split(' | ')[0].slice(2)).join(','));
}
// Coloring levels (pass LY, Mikey): every coloring page is a scene at its level, and its style line and negative prompt are
// the level's own (tools/coloring-levels.mjs), so a page can never drift back to one plain object or to a pre-K style in
// grade 2. A scene names more than one thing (a word that joins two things), a weak net under the hand review.
{
  const rows = ledger.split('\n').map((l) => ROW.exec(l)).filter(Boolean);
  const off = rows.filter(([, serial, page, , prompt, neg]) => { const s = stylesFor(serial, page); return !s || !prompt.endsWith(`, ${s.style}`) || neg !== s.negative; }).map((m) => m[1]);
  ok('every coloring page carries its level\'s style and negative prompt', rows.length >= 238 && off.length === 0, off.slice(0, 12).join(','));
  const lone = rows.filter(([, , , , prompt]) => !/,| and | with | beside | among | in | on | under | over | by | near /.test(prompt.slice(0, prompt.indexOf(', Style:')))).map((m) => m[1]);
  ok('every coloring page scene names more than one thing', lone.length === 0, lone.join(','));
  const levels = new Set(rows.map(([, serial, page]) => (stylesFor(serial, page) || {}).level));
  ok('the pages climb through every level, pre-K 3 to grade 2', ['PK3', 'PK4', 'K', '1', '2'].every((l) => levels.has(l)));
}
// Images to try (pass LZ, Mikey: "a separate section for desired images that may or may not work"): each try is a
// hoped-for version of a planned picture, so it names a row the ledger plans (same serial and page), whose safe version is
// painted if the try fails; a coloring page's try keeps its level's style and negative prompt.
{
  const lines = ledger.split('\n');
  const planned = new Map(lines.map((l) => /^\| ((?:CS|[A-Z])\d+) \| (.*?) \|/.exec(l)).filter(Boolean).map((m) => [m[1], m[2]]));
  const tries = lines.map((l) => TRY_ROW.exec(l)).filter(Boolean);
  const orphan = tries.filter(([, serial, page]) => planned.get(serial) !== page).map((m) => m[1]);
  const offLevel = tries.filter(([, serial, page, , prompt, neg]) => { if (!/^[DG]\d/.test(serial)) return false; const s = stylesFor(serial, page); return !s || !prompt.endsWith(`, ${s.style}`) || neg !== s.negative; }).map((m) => m[1]);
  ok('every image to try names a planned picture, and a coloring page\'s try keeps its level\'s style', tries.length >= 1 && orphan.length === 0 && offLevel.length === 0, [...orphan, ...offLevel].join(','));
}
// Lesson coloring pages (pass LZ): the scene lives twice, in COLOR_PAGES (src/stories.mjs) and in its ledger row, so the
// row must name the page the app uses (lesson-<module id>) and carry the same scene, with at most a check note after it.
{
  const rows = new Map(ledger.split('\n').map((l) => ROW.exec(l)).filter(Boolean).map(([, serial, page, scene]) => [serial, [page, scene]]));
  const drift = Object.entries(COLOR_PAGES).filter(([mid, [serial, scene]]) => { const r = rows.get(serial); return !r || r[0] !== `lesson-${mid}` || !(r[1] === scene || r[1].startsWith(`${scene} (check:`)); }).map(([, [serial]]) => serial);
  ok('every lesson coloring page has its page and scene in the ledger as the code has them', Object.keys(COLOR_PAGES).length >= 210 && drift.length === 0, drift.join(','));
}
// The Images to try section is the ledger's last, so a row appended at the end of the file lands in it: the section holds
// only Try rows, and a Try row sits nowhere else.
{
  const lines = ledger.split('\n'); const at = lines.findIndex((l) => l.startsWith('## Images to try'));
  const next = lines.findIndex((l, i) => i > at && l.startsWith('## ')); const end = next < 0 ? lines.length : next;
  const inside = lines.slice(at + 1, end).filter((l) => /^\| /.test(l) && !/^\| Serial \|/.test(l));
  const strays = lines.filter((l, i) => (i <= at || i >= end) && TRY_ROW.test(l));
  ok('the Images to try section holds only Try rows, and no Try row sits anywhere else', at > 0 && inside.length >= 1 && inside.every((l) => TRY_ROW.test(l)) && strays.length === 0, inside.filter((l) => !TRY_ROW.test(l)).map((l) => l.slice(0, 12)).join(','));
}
// Nano Banana 2 takes no negative prompt (pass MC, Mikey: "Yeah, let's fold into the prompt."), so the spreadsheet a Leonardo
// session pastes from carries each row's bans as closing sentences of its prompt. Every ban the ledger uses has its sentence,
// each said the way Google's guide for the model advises (what the picture is, never what it is not), the character-sheet note
// moves to its own column, and docs/LEONARDO-PROMPTS.csv is what the tool writes today.
{
  const { foldPrompt, ledgerRows, csvText, hasPerson, replanSerials, saysNot } = await import('../tools/prompts-csv.mjs');
  const earmarks = readFileSync('docs/EARMARKS.md', 'utf8');
  const all = ledgerRows(ledger); const unknown = new Set(); const noteLeft = []; const sheetsLost = []; const unwritten = []; const negative = [];
  for (const [serial, , , prompt, bans] of all) {
    const f = foldPrompt(prompt, bans); f.unknown.forEach((x) => unknown.add(x));
    if (/Character:/.test(f.prompt)) noteLeft.push(serial);
    // The note's sheets reach the column when the scene shows a person, and only then (a jar of soil in Chloe's story gets none).
    const named = ((/Character: ([C\d, ]+)\.\s*$/.exec(prompt) || [])[1] || '').trim();
    if (f.note !== named || f.sheets !== (f.person ? named : '')) sheetsLost.push(serial);
    if (/\btext\b|\bletters\b/.test(bans) && !/wordless|The only marks on the page/.test(f.prompt)) unwritten.push(serial);
    // The folded sentences, everything after the ledger's own prompt, say what the picture is.
    const body = prompt.replace(/\s*Character: [C\d, ]+\.\s*$/, '').trim();
    if (/\b(no|not|never|without|don't|avoid)\b/i.test(f.prompt.slice(body.length)) && !f.unknown.length) negative.push(serial);
  }
  ok('every ban in the ledger folds into its prompt as a sentence of its own, for a model with no negative prompt', all.length >= 4700 && unknown.size === 0 && unwritten.length === 0, [...unknown, ...unwritten.slice(0, 5)].join(','));
  ok('every folded sentence says what the picture is, never what it is not (Google: "Describe what you want, not what you don\'t want")', negative.length === 0, negative.slice(0, 6).join(','));
  // The ledger's own prompts still say what a picture is not in some rows (pass MC counted them when the fold arrived); the number
  // may only fall, and a new row says what the picture is (EARMARKS A13).
  const NOT_PROMPT_LIMIT = 110; const saying = all.filter((r) => saysNot(r[3]));
  ok(`ledger prompts that say what the picture is not stay at or under ${NOT_PROMPT_LIMIT} and only fall (${saying.length} now)`, saying.length <= NOT_PROMPT_LIMIT && saysNot('A ball, no flowers') === 'no flowers' && saysNot('A ball among plain green leaves') === null, saying.slice(0, 3).map((r) => r[0]).join(','));
  ok('a character-sheet note leaves the folded prompt, and its sheets reach their column when the scene shows a person', noteLeft.length === 0 && sheetsLost.length === 0, [...noteLeft, ...sheetsLost].slice(0, 6).join(','));
  // Hands and skin are said only where a person is drawn: a clock's hands, a fox's face, a cube's flat face, a mother duck or a
  // class garden is not a person, and the model draws what the words name (the accuracy check, pass MC). These rows were wrong
  // once, both ways.
  const by = Object.fromEntries(all.map((r) => [r[0], r]));
  const noOne = ['P18', 'P85', 'S874', 'S1188', 'S1706', 'S1707', 'S3826', 'S2', 'S31', 'P11', 'P75', 'S484', 'S1373', 'S2358', 'S96', 'S168', 'S1427', 'S3107', 'S2015', 'S1430', 'CS540', 'P81', 'S3807', 'S570', 'S3175', 'S3556', 'S3241', 'S1715', 'S3362', 'CS389', 'CS518', 'CS375', 'P127', 'S3653', 'CS280'];
  const someone = ['S273', 'S442', 'S1450', 'P59', 'S57', 'S804', 'S2402', 'S1500', 'S1695', 'S1605', 'S2903', 'S2545', 'S1773', 'P46', 'S958', 'S40', 'CS412', 'CS477', 'CS583', 'S1208', 'S1418'];
  const handed = (s) => / Hands have five fingers/.test(foldPrompt(by[s][3], by[s][4]).prompt);
  const wrong = [...noOne.filter((s) => !by[s] || handed(s)), ...someone.filter((s) => !by[s] || !handed(s))];
  ok('hands and skin are said where a person is drawn and nowhere else (clock hands, animal faces, solid faces, a class garden, a grown-up\'s shoe)', wrong.length === 0 && hasPerson('a crossing guard waving') && !hasPerson('the long hand on the 3') && !hasPerson('A clock with hands pointing to 3') && !hasPerson("a grown-up's big shoe") && hasPerson("a little boy's toes"), wrong.join(','));
  // A picture EARMARKS A6 lists asks for drawn writing its bans forbid, so its row waits to be re-planned.
  const replan = replanSerials(earmarks); const csv = readFileSync('docs/LEONARDO-PROMPTS.csv', 'utf8').trim(); const want = csvText(ledger, earmarks);
  const waiting = want.split('\n').filter((l) => l.endsWith(',"Re-plan first (A6)"')).length;
  ok('every Needed picture EARMARKS A6 lists waits as Re-plan first (A6) in the spreadsheet', replan.size >= 150 && waiting === all.filter((r) => replan.has(r[0]) && r[5] === 'Needed').length && waiting > 0, `${replan.size} listed, ${waiting} waiting`);
  // The character sheets are painted in the same sessions, so they are rows too (pass MC: the tool had read only six-column rows).
  const sheetsListed = all.filter((r) => r[1] === 'character sheet').map((r) => r[0]);
  ok('docs/LEONARDO-PROMPTS.csv is the folded spreadsheet the tool writes today (node tools/prompts-csv.mjs > docs/LEONARDO-PROMPTS.csv), character sheets included', csv === want && /prompt for Nano Banana 2/.test(csv.split('\n')[0]) && sheetsListed.length === (ledger.match(/^\| C\d+ \|/gm) || []).length && sheetsListed.length >= 14, `${csv.split('\n').length - 1} rows, ${want.split('\n').length - 1} from the ledger`);
  // A sheet attached to a picture that never writes its character out paints whoever is there with that face, at the age the
  // sheet was drawn (the alignment read, pass MG: CS400's grocer would take Savanah's C7; EARMARKS A22). The look words are the
  // cast list's in docs/LEONARDO-BRIEF.md; the count may only fall, as A13's does.
  const LOOK = { Mike: ['brown eyes', 'sturdy', 'half-smile', 'shaved', 'bald', 'beard', 'black ring', 'rolled'], Chloe: ['wavy dark hair', 'patterned', 'paint'], Frederick: ['neat dark hair', 'glasses', 'gray hair', 'handlebar', 'mustache', 'lab coat'], Georgette: ['auburn', 'red button-front coat', 'red coat', 'knowing smile'], Savanah: ['copper-red', 'copper red', 'high bun', 'freckles', 'tattoo', 'tortoiseshell'], Jaxon: ['sandy', 'checkered', 'sly'], Harlow: ['blonde', 'pigtails', 'sage-green', 'blue eyes'] };
  const sheetOf = Object.fromEntries(sheetsListed.map((s) => [s, Object.keys(LOOK).find((n) => by[s][2].startsWith(n))]));
  const UNWRITTEN_SHEET_LIMIT = 130; let attached = 0; const unwrittenSheets = [];
  for (const [serial, , , prompt, bans] of all) {
    const f = foldPrompt(prompt, bans); const body = f.prompt.toLowerCase();
    for (const s of (f.sheets || '').split(/[,\s]+/).filter(Boolean)) { attached++; const who = sheetOf[s]; if (!who || !LOOK[who].some((w) => body.includes(w))) unwrittenSheets.push(`${serial}:${s}`); }
  }
  ok(`attached character sheets whose picture never writes the character out stay at or under ${UNWRITTEN_SHEET_LIMIT} and only fall (${unwrittenSheets.length} of ${attached} now, EARMARKS A22)`, attached >= 170 && unwrittenSheets.length <= UNWRITTEN_SHEET_LIMIT && !unwrittenSheets.includes('CS473:C8'), unwrittenSheets.slice(0, 6).join(','));
}
console.log(`\n${pass} passed, ${fail} failed`);
process.exitCode = fail ? 1 : 0;   // never process.exit(): it can drop the last lines of a piped stdout (2026-09-23)
