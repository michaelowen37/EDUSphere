// Every picture the app expects from Mikey has a row in the art ledger, so no photo is ever forgotten:
// story serials (S), coloring page serials (L), and nothing in the ledger that the app does not use.
import { readFileSync } from 'node:fs';
import { STORIES, COURSE_STORIES, MASTERY_STORIES, COLOR_PAGES } from '../src/stories.mjs';
import { stylesFor, ROW, TRY_ROW } from '../tools/coloring-levels.mjs';
import { MAP_SERIALS, MODULES, COURSES } from '../src/logic.mjs';
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
  const { foldPrompt, ledgerRows, csvText, hasPerson, replanSerials, saysNot, REFERENCE_NAMES, CAST_ORDER, MODEL, modelFor, COLORING_MODEL, COLORING_TRIAL, TRIAL_PAGES, TRIAL_GROUP, coloringKind, onLucid, gradeOfWhere, sceneWords, SCENE_WORDS_BAN, SCENE_WORDS_FROM } = await import('../tools/prompts-csv.mjs');
  const { GRADES } = await import('../src/logic.mjs');
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
  // may only fall, and a new row says what the picture is (EARMARKS A13). 92 since pass ML (110 before, when 95 rows said it): First Steps' P17, S1421 and S1433
  // say what they show.
  const NOT_PROMPT_LIMIT = 92; const saying = all.filter((r) => saysNot(r[3]));
  ok(`ledger prompts that say what the picture is not stay at or under ${NOT_PROMPT_LIMIT} and only fall (${saying.length} now)`, saying.length <= NOT_PROMPT_LIMIT && saysNot('A ball, no flowers') === 'no flowers' && saysNot('A ball among plain green leaves') === null, saying.slice(0, 3).map((r) => r[0]).join(','));
  ok('a character-sheet note leaves the folded prompt, and its sheets reach their column when the scene shows a person', noteLeft.length === 0 && sheetsLost.length === 0, [...noteLeft, ...sheetsLost].slice(0, 6).join(','));
  // Hands and skin are said only where a person is drawn: a clock's hands, a fox's face, a cube's flat face, a mother duck or a
  // class garden is not a person, and the model draws what the words name (the accuracy check, pass MC). These rows were wrong
  // once, both ways. A scene's mood of patient is no patient (pass NY: the moods put the word in seven rows that attach a sheet
  // and in S2015's, and the fold had read each as a person). Since Mikey's answer to Q133 (pass NY, "Q133 - A") the same reading
  // gives the ten subjects' story rows Reading's words or Science's, and the person reader's rows are named on both sides: people
  // the list had missed (a band voting, a speaker at a lectern, listeners, a crowded cafeteria, everyone laughing, two classes on a
  // rug, a bookkeeper, a manager, an official, experts, helpers, a guide, a club or a group at work, a figure speaking, a parade,
  // running legs, visitors walking) and no one where a person word is written or named (a list of customers, a letter signed by
  // students, a chart by student, a card's lines, bean children, family messages, a speech card's audience), each word's catch
  // planted beside it.
  const by = Object.fromEntries(all.map((r) => [r[0], r]));
  const noOne = ['P111', 'P18', 'P85', 'S874', 'S1188', 'S1706', 'S1707', 'S3826', 'S2', 'S31', 'P11', 'P75', 'S484', 'S1373', 'S2358', 'S96', 'S168', 'S1427', 'S3107', 'S2015', 'S1430', 'CS540', 'P81', 'S3807', 'S570', 'S3175', 'S3556', 'S3241', 'S1715', 'S3362', 'CS389', 'CS518', 'CS375', 'P127', 'S3653', 'CS280',
    'S2877', 'S2973', 'S3115', 'S3209', 'S3273', 'S3588', 'CS494', 'S2423', 'S2562', 'S3137', 'S2462', 'S1991', 'S1992', 'S2768'];
  const someone = ['S273', 'S442', 'S1450', 'P59', 'S57', 'S804', 'S2402', 'S1500', 'S1695', 'S1605', 'S2903', 'S2545', 'S1773', 'P46', 'S958', 'S40', 'CS412', 'CS477', 'CS583', 'S1208', 'S1418',
    'S577', 'S2924', 'S2964', 'S2975', 'S3022', 'S3024', 'S3096', 'S3195', 'S3365', 'S3448', 'S3453', 'S3506', 'S3523', 'S3573', 'S3574', 'S3575', 'S3612',
    'S3619', 'S3626', 'S3627', 'S3630', 'S3641', 'S3727', 'CS96', 'S1246', 'S1257', 'CS437', 'CS515', 'S2405', 'S1216'];
  // Each new word's catch, planted: [the words, whether a person is drawn].
  const CATCHES = [['a rubber band holding the sticks', false], ['a thin band of silt', false], ['A band room with a jar', false], ['A band voting behind a curtain', true],
    ['sound coming from its speaker', false], ['a small round speaker between them', false], ['A speaker pushing sound waves', false], ['A speaker pausing at a lectern', true],
    ['A crowded page of words', false], ['A crowded hall at night', true], ['a password manager open', false], ['A manager pinning a schedule', true],
    ['an official map of the county', false], ['An official painting a cross on a wheel', true], ['helper nineteen on the chart', false], ['Two medical helpers at a door', true],
    ['A school guide with a heading over each paragraph', false], ['a guide dog in a harness', false], ['A cave guide with a flashlight', true], ['a group chat on a phone', false], ['with a group practicing', true],
    ['a club roster', false], ['A robotics club counting money', true], ['A welded figure of bicycle parts', false], ['one figure speaking', true],
    ['a loud parade drum', false], ['The big drum booming in the parade', true], ['a table on four sturdy legs', false], ['his legs hanging off the dog bed', false], ['blood carrying oxygen to running legs', true],
    ['a good conductor of heat', false], ['a conductor holding up a flute', true], ['the names home and visitors ready', false], ['home 4, visitors 2', false], ['visitors walking', true],
    ['Two thought bubbles over a game: everyone will think I am bad', false], ['Three circles labeled everyone, some and one', false], ['a robot while everyone laughs', true],
    ['Two classes on a rug saying hello', true], ['A lifeguard chair beside the pool', false], ['A list of steps with a finger on the third one', true],
    ['a list of ten thousand customers', false], ['a letter signed by three students at the bottom', false], ['One chart of hours of sleep by student', false],
    ['A card with three lines: tell someone who has stood in the light', false], ['a row of tall bean children', false], ['A phone lighting up with family messages', false],
    ['Three questions on a note card, audience, occasion, purpose', false], ['a speaker\'s final question over a silent audience', true],
    ['a villager carrying water from the well', true], ['the classes schedule pinned to a board', false],
    // Round two's code read of pass NY: a card's lines end where something is set beside the card, a list's names where a word like a
    // begins someone new, and the family words and everybody each have a case.
    ['A card with two lines: stop, breathe, beside a girl reading it', true], ['a list of chores a mom holds up', true], ['a family chat on a phone', false],
    ['a family calendar on the fridge', false], ['family texts on a screen', false], ['everybody clapping', true]];
  const catchesMissed = CATCHES.filter(([words, drawn]) => hasPerson(words) !== drawn).map(([words]) => words);
  const handed = (s) => / Hands have five fingers/.test(foldPrompt(by[s][3], by[s][4]).prompt);
  const wrong = [...noOne.filter((s) => !by[s] || handed(s)), ...someone.filter((s) => !by[s] || !handed(s))];
  ok(`hands and skin are said where a person is drawn and nowhere else (clock hands, animal faces, solid faces, a class garden, a grown-up's shoe; since pass NY the person reader's rows and ${CATCHES.length} catches of its words)`, wrong.length === 0 && hasPerson('a crossing guard waving') && !hasPerson('the long hand on the 3') && !hasPerson('A clock with hands pointing to 3') && !hasPerson('a round clock with a plain white face, its only marks two black hands') && !hasPerson("a grown-up's big shoe") && hasPerson("a little boy's toes")
    && !hasPerson('A row of jars on a windowsill, wonder-filled and vibrant, stylized, curious, curious and patient') && !hasPerson('A progress bar on a laptop, wonder-filled and vibrant, stylized, curious, patient and hopeful') && hasPerson('a young patient on a clinic bed') && hasPerson('a patient and a chart on a clinic bed') && catchesMissed.length === 0, [...wrong, ...catchesMissed].join(','));
  // A picture EARMARKS A6 lists asks for drawn writing its bans forbid, so its row waits to be re-planned.
  const replan = replanSerials(earmarks); const csv = readFileSync('docs/LEONARDO-PROMPTS.csv', 'utf8').trim(); const want = csvText(ledger, earmarks);
  const waiting = want.split('\n').filter((l) => l.endsWith(',"Re-plan first (A6)"')).length;
  ok('every Needed picture EARMARKS A6 lists waits as Re-plan first (A6) in the spreadsheet', replan.size >= 150 && waiting === all.filter((r) => replan.has(r[0]) && r[5] === 'Needed').length && waiting > 0, `${replan.size} listed, ${waiting} waiting`);
  // Pass MM (round two's picture check): a course reviewed at the refined standard plans every picture around things (the
  // picture brief, item 3), so no picture of its own may still wait under A6. First Sounds and Letters' eleven were planned
  // around things in its round one while the A6 list still named them, and the spreadsheet told Mikey to re-plan eleven
  // finished prompts. The reviewed courses are the coverage test's REVIEWED_PREK, read from its source so the two never differ.
  { const listed = (readFileSync('tests/coverage.test.mjs', 'utf8').match(/const REVIEWED_PREK = \[([^\]]*)\]/) || [, ''])[1];
    const reviewed = [...listed.matchAll(/'([a-z0-9-]+)'/g)].map((m) => m[1]);
    const coursesOf = (where) => new Set([...MODULES.filter((m) => m.id === where).map((m) => m.courseId), ...(MODULES.some((m) => m.courseId === where) ? [where] : [])]);
    const stale = all.filter((r) => replan.has(r[0]) && [...coursesOf(r[1])].some((c) => reviewed.includes(c))).map((r) => r[0]);
    ok(`no picture of a reviewed pre-K course still waits under EARMARKS A6 (${reviewed.length} courses read)`, reviewed.length >= 4 && stale.length === 0, stale.join(','));
  }
  // A scene after sunset folds its sun ban as a sun already set (round five's record read, pass MM: CS660's sky glows "just after
  // sunset, the sun already down", and "The sunlight comes from beyond the edge of the picture." could light it as day); a daytime
  // scene keeps the sunlight from beyond the edge.
  { const dusk = all.filter(([, , , prompt, bans]) => /after sunset|sun already down/i.test(String(prompt).split(/\s*Style:/)[0]) && String(bans).split(',').map((x) => x.trim()).includes('sun'));
    const wrong = dusk.filter(([, , , prompt, bans]) => !/The sun has already set below the edge of the picture/.test(foldPrompt(prompt, bans).prompt) || /The sunlight comes from beyond the edge/.test(foldPrompt(prompt, bans).prompt));
    const day = foldPrompt('A sunny park at noon, a girl on a swing. Style: Clean 3D vector illustration.', 'sun').prompt;
    ok(`a scene after sunset keeps its sun set in its folded prompt (${dusk.length} rows), and a daytime scene its sunlight from beyond the edge`, dusk.length >= 1 && wrong.length === 0 && /The sunlight comes from beyond the edge of the picture/.test(day), wrong.map((r) => r[0]).join(', ')); }
  // The character sheets are painted in the same sessions, so they are rows too (pass MC: the tool had read only six-column rows).
  const sheetsListed = all.filter((r) => r[1] === 'character sheet').map((r) => r[0]);
  ok('docs/LEONARDO-PROMPTS.csv is the folded spreadsheet the tool writes today (node tools/prompts-csv.mjs > docs/LEONARDO-PROMPTS.csv), character sheets included', csv === want && /"prompt \(bans folded in\)"/.test(csv.split('\n')[0]) && sheetsListed.length === (ledger.match(/^\| C\d+ \|/gm) || []).length && sheetsListed.length >= 14, `${csv.split('\n').length - 1} rows, ${want.split('\n').length - 1} from the ledger`);
  // Generation day (Mikey, pass MK): the rows come in his painting order, each person's references, then the pictures with that
  // person alone, person by person; then two or more of the cast; then the rest by grade from pre-K 3 up; then what has no grade.
  // Every row names its model, and every character sheet has its reference name (Mike - 1), one name each.
  // Since pass NJ in two builds (Mikey: "...so that I can prioritize the early learning designs/sounds and access them easily."): build
  // 1, pre-K 3 to grade 1 with every character reference at every age, then build 2, grade 2 and up, each in that order inside it, and
  // docs/LEONARDO-PROMPTS-EARLY.csv is build 1 alone with the same numbers.
  { const parse = (line) => [...line.matchAll(/"((?:[^"]|"")*)"/g)].map((m) => m[1].replace(/""/g, '"'));
    const lines = want.split('\n').slice(1).map(parse); const head = parse(want.split('\n')[0]); const col = (n) => head.indexOf(n);
    const { BUILDS, EARLY_GRADES, buildOf } = await import('../tools/prompts-csv.mjs');
    const waiting = Object.values(COLORING_TRIAL).includes('waiting'); const moved = Object.values(COLORING_TRIAL).some((s) => s !== 'failed');
    const builds = []; for (const l of lines) if (builds[builds.length - 1] !== l[col('build')]) builds.push(l[col('build')]);
    const order = (b) => {
      const mine = lines.filter((l) => l[col('build')] === BUILDS[b]);
      const groups = []; for (const l of mine) if (groups[groups.length - 1] !== l[col('group')]) groups.push(l[col('group')]);
      const trialGroup = b === 1 && waiting ? groups[0] : null; const colorGroup = moved ? groups[groups.length - 1] : null;
      const middle = groups.slice(trialGroup ? 1 : 0, colorGroup ? -1 : undefined);
      const castGroups = CAST_ORDER.flatMap((p) => [`${p}: references`, p]).filter((g) => middle.includes(g));
      const gradeGroups = middle.slice(castGroups.length + (middle.includes('Two or more of the cast') ? 1 : 0));
      return { mine, groups, trialGroup, colorGroup, middle, castGroups, gradeGroups };
    };
    const one = order(1); const two = order(2);
    const label = (g) => ({ PK3: 'Pre-K 3', PK4: 'Pre-K 4', K: 'Kindergarten', 1: 'Grade 1' }[g]);
    ok('the spreadsheet runs in two builds, build 1 (pre-K 3 to grade 1, with every character reference) and then build 2 (grade 2 and up), each in Mikey\'s painting order: in build 1 the coloring trial first while it waits, then each person\'s references and their pictures, person by person, then two or more of the cast, then by grade from pre-K 3 to grade 1, then the coloring pages on Lucid Origin; in build 2 the same from grade 2, its last grade group the maps; numbered from 1 through both, each group once in its build (pass NJ)',
      head[1] === 'build' && builds.join('|') === `${BUILDS[1]}|${BUILDS[2]}` && lines.every((l, k) => Number(l[col('order')]) === k + 1)
      && [one, two].every((o) => o.groups.length === new Set(o.groups).size && o.middle.slice(0, o.castGroups.length).join() === o.castGroups.join() && (!moved || /on Lucid Origin, painted last/.test(o.colorGroup)))
      && one.castGroups[0] === 'Mike: references' && one.gradeGroups.join('|') === EARLY_GRADES.map(label).join('|') && (!waiting || one.trialGroup === TRIAL_GROUP)
      && two.castGroups.every((g) => !/: references$/.test(g)) && two.gradeGroups[0] === 'Grade 2' && two.gradeGroups[two.gradeGroups.length - 1].startsWith('No grade') && !two.groups.includes(TRIAL_GROUP),
      `${one.groups.join(' | ')} || ${two.groups.join(' | ')}`);
    // What goes in each build: every character sheet and Wonder portrait in build 1 (all seven people at every age, the older ones too,
    // as Mikey asked), every lesson, story and long story picture by its course's grade, the maps in build 2, and the early file the
    // same rows as build 1, numbered the same.
    const early = readFileSync('docs/LEONARDO-PROMPTS-EARLY.csv', 'utf8').trim();
    const wrongBuild = lines.filter((l) => { const s = l[col('serial')]; const g = l[col('grade')]; const b = l[col('build')] === BUILDS[1] ? 1 : 2;
      if (/^[CU]\d/.test(s)) return b !== 1; if (/^M\d/.test(s)) return b !== 2; if (l[col('group')] === TRIAL_GROUP) return b !== 1;
      return g ? b !== (['Pre-K 3', 'Pre-K 4', 'Kindergarten', 'Grade 1'].includes(g) ? 1 : 2) : false; }).map((l) => l[col('serial')]);
    const sheetsIn1 = one.mine.filter((l) => /^C\d/.test(l[col('serial')])).length;
    const want1 = csvText(ledger, earmarks, { build: 1 });
    ok('every character sheet and Wonder portrait is in build 1, every picture with a grade is in its grade\'s build and every map in build 2, and docs/LEONARDO-PROMPTS-EARLY.csv is build 1 alone, its rows numbered as in the whole spreadsheet (node tools/prompts-csv.mjs --build 1) (pass NJ)',
      wrongBuild.length === 0 && sheetsIn1 === sheetsListed.length && early === want1 && want1.split('\n').length - 1 === one.mine.length && want1.split('\n')[1] === want.split('\n')[1]
      && buildOf({ serial: 'C99', grade: null, where: 'character sheet' }) === 1 && buildOf({ serial: 'M9', grade: null, where: 'x' }) === 2 && buildOf({ serial: 'S1', grade: '2', where: 'x' }) === 2 && buildOf({ serial: 'S1', grade: '1', where: 'x' }) === 1,
      `${wrongBuild.slice(0, 8).join(',')}; sheets in build 1 ${sheetsIn1} of ${sheetsListed.length}; early file ${early === want1 ? 'matches' : 'differs'}`);
    // Since round one's code read: every Let's Color page (each drawing page, letter page and the star) is in build 1, since a page opens
    // for each lesson passed (coloringUnlocked) and pre-K 3 to grade 1 hold more lessons than Let's Color has pages, so a child opens
    // every one before grade 2. The rule by a page's style level, planted, put the last four drawing pages (D24 to D27) in build 2.
    { const { COLORING_PICTURES } = await import('../src/logic.mjs'); const { levelOf } = await import('../tools/coloring-levels.mjs');
      const earlyLessons = MODULES.filter((m) => { const c = COURSES.find((x) => x.id === m.courseId); return c && EARLY_GRADES.includes(String(c.grade)); }).length;
      const pageRows = lines.filter((l) => !l[col('grade')] && /^[DLG]\d/.test(l[col('serial')]));
      const notIn1 = pageRows.filter((l) => l[col('build')] !== BUILDS[1]).map((l) => l[col('serial')]);
      const byLevel = pageRows.filter((l) => { const s = l[col('serial')]; const lv = /^L\d/.test(s) ? 'L' : levelOf(s, l[col('where')]); return !(lv === 'L' || EARLY_GRADES.includes(String(lv))); }).map((l) => l[col('serial')]);
      ok(`every Let's Color page (${pageRows.length} rows: the drawing pages, the letter pages and the star) is in build 1, since a child opens all ${COLORING_PICTURES.length} before grade 2 (${earlyLessons} lessons from pre-K 3 to grade 1); the rule by style level, planted, is caught (round one's code read)`,
        1 + earlyLessons >= COLORING_PICTURES.length && pageRows.length >= 50 && notIn1.length === 0 && ['D24', 'D25', 'D26', 'D27'].every((x) => byLevel.includes(x)),
        JSON.stringify({ notIn1, byLevel, earlyLessons })); }
    // Since round one's code read the group of pictures with no grade names only what is in it, build by build: the Wonder portraits sit
    // in their persons' groups, build 2's group is the maps, and build 1's holds the Let's Color pages only if their trial fails (until
    // then they are painted last on Lucid Origin). A name that names the portraits, as pass NI's did, planted, is caught.
    { const pc = await import('../tools/prompts-csv.mjs');
      const kindOf = (serial) => (/^M\d/.test(serial) ? 'maps' : /^U\d/.test(serial) ? 'Wonder portraits' : /^D\d/.test(serial) ? "Let's Color drawing pages" : /^L\d/.test(serial) ? 'letter pages' : /^G\d/.test(serial) ? 'the star' : 'other');
      const namesWhatItHolds = (name, serials) => { const named = (name.split('No grade: ')[1] || '').split(/, and |, | and /).filter(Boolean); const held = [...new Set(serials.map(kindOf))]; return named.length === held.length && held.every((k) => named.includes(k)); };
      const noGrade = lines.filter((l) => /^No grade/.test(l[col('group')]));
      const groups = [...new Set(noGrade.map((l) => l[col('group')]))];
      const was = { ...pc.COLORING_TRIAL }; pc.COLORING_TRIAL.pages = 'failed'; pc.COLORING_TRIAL.letters = 'failed';
      const ifFailed = pc.noGradeGroupName(1); Object.assign(pc.COLORING_TRIAL, was);
      ok(`the group of pictures with no grade names only what is in it: build 2's is ${JSON.stringify(pc.noGradeGroupName(2))} and holds the ${noGrade.length} maps, build 1 has none while the Let's Color trial waits, and with the trial failed build 1's names its pages; a name with the Wonder portraits, planted, is caught (round one's code read)`,
        groups.length === 1 && groups[0] === pc.noGradeGroupName(2) && namesWhatItHolds(groups[0], noGrade.map((l) => l[col('serial')])) && noGrade.every((l) => l[col('build')] === BUILDS[2])
        && pc.noGradeGroupName(1) === 'No grade' && ifFailed === "No grade: Let's Color drawing pages, letter pages and the star" && !/portrait/i.test(groups[0] + ifFailed)
        && !namesWhatItHolds('No grade: Wonder portraits and maps', noGrade.map((l) => l[col('serial')])),
        JSON.stringify({ groups, ifFailed, serials: noGrade.map((l) => l[col('serial')]) })); }
    const names = Object.values(REFERENCE_NAMES); const inColorGroup = (l) => moved && /on Lucid Origin, painted last/.test(l[col('group')]);   // the Lucid groups of both builds (pass NJ)
    // Every row names its model: Nano Banana 2.1 for every painting, reference and map, and for a coloring page the model its
    // kind's trial gives it (Lucid Origin, said with its fallback while the trial waits); the trial's rows name one model each.
    const trialLines = lines.filter((l) => l[col('group')] === TRIAL_GROUP);
    ok('every row names its model and its settings: Nano Banana 2.1 for every painting, reference and map, and for a coloring page the model its trial gives it; every character sheet has a reference name of its own, and a picture names each reference it needs',
      MODEL === 'Nano Banana 2.1' && COLORING_MODEL === 'Lucid Origin' && lines.every((l) => l[col('settings')].length > 20) && sheetsListed.every((s) => REFERENCE_NAMES[s]) && new Set(names).size === names.length
      && lines.filter((l) => l[col('group')] !== TRIAL_GROUP).every((l) => l[col('model')] === modelFor(l[col('serial')]) && (coloringKind(l[col('serial')]) || l[col('model')] === MODEL))
      && lines.filter((l) => coloringKind(l[col('serial')]) && l[col('group')] !== TRIAL_GROUP).every((l) => inColorGroup(l) === onLucid(l[col('serial')]) && /Lucid Origin/.test(l[col('model')]) === onLucid(l[col('serial')]))
      && lines.filter((l) => l[col('references to attach')]).every((l) => l[col('references to attach')].split(', ').every((x) => /^[A-Z][a-z]+ - \d \(C\d+\)$/.test(x))), names.join(', '));
    // The trial (Q44): five pages, one each of pre-K 3, pre-K 4, kindergarten and grade 2 and one letter page, each painted on
    // Nano Banana 2.1 and then on Lucid Origin with no reference, and none of them listed again later while the trial waits.
    const trialSerials = TRIAL_PAGES.filter((s) => COLORING_TRIAL[coloringKind(s)] === 'waiting');
    ok('the coloring trial lists each of its five pages twice, on Nano Banana 2.1 and then on Lucid Origin, with no reference, and not again later while it waits (Q44)',
      TRIAL_PAGES.length === 5 && TRIAL_PAGES.every((s) => coloringKind(s)) && TRIAL_PAGES.some((s) => coloringKind(s) === 'letters')
      && trialLines.length === 2 * trialSerials.length && trialSerials.every((s, i) => trialLines[2 * i][col('serial')] === s && trialLines[2 * i + 1][col('serial')] === s && trialLines[2 * i][col('model')] === MODEL && trialLines[2 * i + 1][col('model')] === COLORING_MODEL)
      && trialLines.every((l) => /no reference, so the two models are compared on the words alone/.test(l[col('settings')]) && l[col('status')] === 'Trial')
      && lines.filter((l) => trialSerials.includes(l[col('serial')])).length === trialLines.length,
      trialLines.map((l) => `${l[col('serial')]}:${l[col('model')]}`).join(','));
    // A coloring page on Lucid Origin attaches its level's approved trial page as a Style Reference, so a level's outlines stay alike.
    ok('every coloring page on Lucid Origin attaches its level\'s approved page as a Style Reference (Q44)',
      lines.filter(inColorGroup).every((l) => /as a Style Reference at Mid/.test(l[col('settings')])) && (!moved || lines.filter(inColorGroup).length >= 25),
      String(lines.filter(inColorGroup).length));
    // Leonardo's page for Lucid Origin takes a prompt of up to 2,000 characters, so every coloring page's folded prompt fits it.
    const long = lines.filter((l) => coloringKind(l[col('serial')]) && l[col('prompt (bans folded in)')].length >= 2000).map((l) => l[col('serial')]);
    ok('every coloring page\'s folded prompt fits Lucid Origin\'s 2,000 characters (Q44)', long.length === 0 && lines.some((l) => coloringKind(l[col('serial')])), long.join(',')); }
  // Scene words (Mikey's answer to Q42, pass ML: "relax it for scene words only, from grade 3 up."): a row may show words only
  // when its bans say SCENE_WORDS_BAN, and then only in a story scene, a long story's scene or a lesson painting for grade 3 or
  // older; its prompt quotes one or two short words or phrases (letters, spaces and apostrophes, under 26 characters, never a
  // lone letter or a numeral, which a question could ask for), its check note spells each one out to be read letter by letter,
  // and the fold names them as the only writing. A quote in any other prompt fails, since only scene words are ever quoted.
  {
    const from = GRADES.indexOf(SCENE_WORDS_FROM); const bad = []; let rowsWithWords = 0;
    const fine = (w) => w.length >= 2 && w.length <= 25 && /^[A-Za-z][A-Za-z' ]*[A-Za-z]$/.test(w) && w.split(' ').some((x) => x.length >= 2);
    for (const [serial, where, scene, prompt, bans] of all) {
      const quoted = sceneWords(prompt); const banned = String(bans).split(',').map((x) => x.trim()).includes(SCENE_WORDS_BAN);
      if (!quoted.length && !banned) continue;
      rowsWithWords++;
      const g = GRADES.indexOf(String(gradeOfWhere(where))); const f = foldPrompt(prompt, bans);
      const okRow = banned && quoted.length >= 1 && quoted.length <= 2 && /^(S|CS|P)\d/.test(serial) && g >= from && quoted.every(fine)
        && /\(check: [^)]*letter by letter[^)]*\)/.test(scene) && quoted.every((w) => scene.includes(w))
        && f.prompt.includes(`The only writing in the picture is ${quoted.map((w) => `"${w}"`).join(' and ')}, spelled exactly so`) && !/\btext, words, letters\b/.test(bans);
      if (!okRow) bad.push(serial);
    }
    // The rule is proven on its near misses: a grade 2 row, a numeral, a lone letter and a coloring page all fail, and the fold
    // of a good row names its words.
    const near = (s, w, p) => { const g = GRADES.indexOf(String(gradeOfWhere(w))); return /^(S|CS|P)\d/.test(s) && g >= from && sceneWords(p).every(fine); };
    const proven = !near('S401', 'vowel-teams', 'a sign that reads "RAIN"') && !near('S2844', 'the-true-cost-of-credit', 'a sign that reads "OPEN 24"') && !near('S2844', 'the-true-cost-of-credit', 'a sign that reads "B"') && !near('D140', 'lesson-hundreds-tens-ones', 'a jar that reads "PENNIES"') && near('S2844', 'the-true-cost-of-credit', 'a sign that reads "CASH TODAY"')
      && foldPrompt('A shop whose sign reads "OPEN", a bus stop. Style: x.', `${SCENE_WORDS_BAN}, labels`).prompt.includes('The only writing in the picture is "OPEN", spelled exactly so');
    ok('scene words show only from grade 3 up, in story scenes and lesson paintings, quoted short and spelled out in the check note, and the fold names them as the only writing (Q42)', rowsWithWords >= 1 && bad.length === 0 && proven, bad.slice(0, 6).join(','));
  }
  // A sheet attached to a picture that never writes its character out paints whoever is there with that face, at the age the
  // sheet was drawn (the alignment read, pass MG: CS400's grocer would take Savanah's C7; EARMARKS A22). The look words are the
  // cast list's in docs/LEONARDO-BRIEF.md; the count may only fall, as A13's does.
  const LOOK = { Mike: ['brown eyes', 'sturdy', 'half-smile', 'shaved', 'bald', 'beard', 'black ring', 'rolled'], Chloe: ['wavy dark hair', 'patterned', 'paint'], Frederick: ['neat dark hair', 'glasses', 'gray hair', 'handlebar', 'mustache', 'lab coat'], Georgette: ['auburn', 'red button-front coat', 'red coat', 'knowing smile'], Savanah: ['copper-red', 'copper red', 'high bun', 'freckles', 'tattoo', 'tortoiseshell'], Jaxon: ['sandy', 'checkered', 'sly'], Harlow: ['blonde', 'pigtails', 'sage-green', 'blue eyes'] };
  const sheetOf = Object.fromEntries(sheetsListed.map((s) => [s, Object.keys(LOOK).find((n) => by[s][2].startsWith(n))]));
  // 121 since pass MK (124 before): Mike's three rows in The ball that rolled away write him out now. 118 since pass ML: Three
  // stones' S1, S29 and S1448 write him out too. 117 since pass NY: CS494's speech card, whose word audience the person reading
  // no longer takes for a person (Q133), attaches no sheet.
  const UNWRITTEN_SHEET_LIMIT = 117; let attached = 0; const unwrittenSheets = [];
  for (const [serial, , , prompt, bans] of all) {
    const f = foldPrompt(prompt, bans); const body = f.prompt.toLowerCase();
    for (const s of (f.sheets || '').split(/[,\s]+/).filter(Boolean)) { attached++; const who = sheetOf[s]; if (!who || !LOOK[who].some((w) => body.includes(w))) unwrittenSheets.push(`${serial}:${s}`); }
  }
  ok(`attached character sheets whose picture never writes the character out stay at or under ${UNWRITTEN_SHEET_LIMIT} and only fall (${unwrittenSheets.length} of ${attached} now, EARMARKS A22)`, attached >= 170 && unwrittenSheets.length <= UNWRITTEN_SHEET_LIMIT && !unwrittenSheets.includes('CS473:C8'), unwrittenSheets.slice(0, 6).join(','));
}
// A lesson picture's alt is its ledger scene word for word, the check note aside (pass MN, round one's picture check: P150's alt said
// "a worried face" where its line, scene and prompt said scared, wide-open eyes, and a screen reader reads the alt). The 26 older
// paintings whose alt says the same scene in more or fewer words wait by name for their courses' reviews, and the list only falls.
{
  const ALT_WAITING = ['P24', 'P25', 'P27', 'P28', 'P30', 'P31', 'P32', 'P33', 'P34', 'P35', 'P36', 'P37', 'P38', 'P39', 'P40', 'P41', 'P42', 'P48', 'P49', 'P50', 'P51', 'P53', 'P56', 'P66', 'P67', 'P70'];
  const sceneOf = {}; for (const m of ledger.matchAll(/^\| (P\d+) \| [^|]+ \| ([^|]+) \|/gm)) sceneOf[m[1]] = m[2].trim().replace(/ \(check: [^)]*\)$/, '');
  const pics = MODULES.flatMap((m) => (m.lesson && m.lesson.pictures) || []);
  const differ = pics.filter((p) => sceneOf[p.serial] !== p.alt).map((p) => p.serial);
  const unlisted = differ.filter((s) => !ALT_WAITING.includes(s)); const stale = ALT_WAITING.filter((s) => !differ.includes(s));
  // Its near misses: the alt P150 had, which fails, and the alt it has.
  const p150 = pics.find((p) => p.serial === 'P150'); const near = (alt) => sceneOf.P150 === alt;
  ok(`a lesson picture's alt is its ledger scene word for word (${pics.length} read; ${ALT_WAITING.length} older ones wait by name and only fall)`, pics.length >= 150 && unlisted.length === 0 && stale.length === 0 && !near('Two small children at the bottom of a tall playground slide, one grinning and one looking up at it with a worried face') && !!p150 && near(p150.alt), `differ: ${unlisted.join(', ')}; listed but matching: ${stale.join(', ')}`);
}
// A story picture takes its course subject's style (pass MO, round one's picture check: Listen and Point's and First Sounds and
// Letters' twelve new rows took Math's "distinct geometric shapes" where their subject is Reading's "character-focused, dreamy
// lighting", the slip pass MM made on the long stories' rows). The anchors are tools/stories/batch.py's MOD table, read from the
// file, so the batches and this check share one source. Every story row (S and CS) of a subject the table gives words ends its
// style on its subject's anchor. Until pass NY the check read pre-K's S rows alone and let 141 rows of kindergarten and grade 1
// wait as a count (EARMARKS A45); pass NY, putting every row's subject words and mood in at Mikey's word ("all rows should be
// updated throughout"), ended those 141 on their own anchors, and the nine pre-K course rows of the picnic the check had never read
// (CS613 to CS634, Science's anchor on a Math course) and CS37 (none). The picnic's three wide views, a composition written for
// the whole blanket, are named. Proven failing on pass MO's frozen copy (the twelve) and on a row given another subject's anchor.
// Since Mikey's answer to Q133 (pass NY, "Q133 - A") the check reads every story row: a subject the table gives no words of its own
// ends on Reading's anchor where the spreadsheet's reading (tools/prompts-csv.mjs, hasPerson, on the prompt's words before its
// style) finds a person and on Science's where it finds none; planted, a row of people given Science's anchor and a row of things
// given Reading's, each caught.
{
  const py = readFileSync(new URL('../tools/stories/batch.py', import.meta.url), 'utf8');
  const modLine = py.split('\n').find((l) => l.startsWith('MOD = {')) || '';
  const anchors = Object.fromEntries([...modLine.matchAll(/'([A-Za-z]+)': \('[^']+', '([^']+)'\)/g)].map((m) => [m[1], m[2]]));
  // A course story's rows name their course (math-9), the other story rows their module.
  const courseOf = {}; for (const c of COURSES) { courseOf[c.id] = c; for (const m of c.modules) courseOf[m.id] = c; }
  const OWN_VIEW = new Set(['CS632', 'CS635', 'CS636']);   // the picnic's wide views from a little above, the whole blanket in view
  const { hasPerson } = await import('../tools/prompts-csv.mjs');
  // A row's anchor: its subject's, or for a subject with none of its own Reading's or Science's by the person reading (Q133).
  const anchorOf = (subject, prompt) => anchors[subject] || (hasPerson(String(prompt).split(/\s*Style:/)[0]) ? anchors.Reading : anchors.Science);
  const offRows = (text) => text.split('\n').filter((l) => /^\| C?S\d+ \|/.test(l)).map((l) => l.split(' | ')).filter((cols) => { const c = courseOf[(cols[1] || '').trim()]; const anchor = c && anchorOf(c.subject, cols[3] || ''); return anchor && !OWN_VIEW.has(cols[0].slice(2)) && !(cols[3] || '').includes(`uncluttered layout, ${anchor}.`); })
    .map((cols) => ({ serial: cols[0].slice(2), grade: courseOf[cols[1].trim()].grade }));
  const off = offRows(ledger);
  const swapped = ledger.replace(/(\| S3919 \|[^\n]*?)uncluttered layout, character-focused, dreamy lighting\./, '$1uncluttered layout, distinct geometric shapes.');
  // S494 (an Art row of a girl drawing cups, Reading's) given Science's anchor, and S496 (an Art row of cups alone, Science's) Reading's.
  const people = ledger.replace(/(\| S494 \|[^\n]*?)uncluttered layout, character-focused, dreamy lighting\./, '$1uncluttered layout, dynamic close-up, soft shadows.');
  const things = ledger.replace(/(\| S496 \|[^\n]*?)uncluttered layout, dynamic close-up, soft shadows\./, '$1uncluttered layout, character-focused, dreamy lighting.');
  const caught = offRows(swapped).some((r) => r.serial === 'S3919') && people !== ledger && offRows(people).some((r) => r.serial === 'S494') && things !== ledger && offRows(things).some((r) => r.serial === 'S496');
  const rowsRead = ledger.split('\n').filter((l) => /^\| C?S\d+ \|/.test(l) && courseOf[(l.split(' | ')[1] || '').trim()]).length;
  ok(`every story picture (S and CS) takes its course subject's style anchor, a subject the table gives none Reading's for people and Science's for things (Mikey's answer to Q133), but the picnic's three wide views (${Object.keys(anchors).length} subjects read from batch.py; ${rowsRead} rows read; none waits since pass NY, EARMARKS A45)`, Object.keys(anchors).length >= 5 && rowsRead >= 4733 && off.length === 0 && caught, `off: ${off.map((r) => r.serial).join(',')}`);
}
// A story row's modifier, Mikey's answer to Q128 (pass NY, November 23, 2026: "Q128- C (let's prioritize this because I will be
// working on images soon)."): a story scene or a long story's scene carries its subject's whole "Playful modifier" cell from
// docs/LEONARDO-BRIEF.md's table and then the scene's mood, two to four words of tools/stories/batch.py's MOOD_WORDS, in that order:
// "<scene>, imaginative and expressive, storybook style, delighted and warm. Style: ...". A scene holds commas, so the words before
// ". Style:" are read from their end: the mood is the last piece after a comma (a mood holds none), and the subject's cell stands
// just before it. Since his word of the same morning ("all rows should be updated throughout") every story row carries both: the
// 4,250 rows that had carried their subject's first clause alone, the 116 that had carried another subject's (Math's on
// kindergarten's civics, health, technology and letters rows and on grade 1's S350), the course stories' 58 first pictures in their
// older form ("warm and detailed, a scene that could hold a whole course") and 21 rows whose mood named a look took a mood each from
// two mood writers, who read every scene (pass NY). At Mikey's answers to Q132 and Q133 (the same afternoon: "Q132 - A", "Q133 - A")
// a beat in a Math course (its mood "gentle and warm") carries Math's words without the "cheerful and" a beat gave up in pass MN
// (RULES-AUDIT's row on each face named), "..., neat, colorful, geometric, gentle and warm", where 64 such rows had carried the mood
// alone, held by name until his answer; and a subject the table gives no words of its own carries Reading's words where the
// spreadsheet's reading finds a person and Science's where it finds none. Every row without its words and a mood fails, a new
// one too. The tools' table is the brief's: batch.py's MOD
// holds each subject's whole cell as the brief's table has it, word for word, and long-batch.py reads MOD and the mood words from
// batch.py. And the two tools write the rule: each runs with python3 on a copy of the files it reads and writes, as a writer runs it.
// Near misses, each caught: a mood row without the table's words, the table's words after the mood, a mood before the first clause
// alone, a cell of the wrong subject, a row with the table's words and no mood, a row in the older form (a new one and one of the
// rows that carried it until pass NY), a new row whose mood names a thing, a Math beat with "cheerful and" and one with its mood alone,
// as until Q132, a row of people of a subject with no words of its own given Science's and a row of things Reading's, and MOD's
// cell and the brief's each changed alone; and a new row with both passes.
{
  const py = readFileSync(new URL('../tools/stories/batch.py', import.meta.url), 'utf8');
  const lb = readFileSync(new URL('../tools/stories/long-batch.py', import.meta.url), 'utf8');
  const brief = readFileSync(new URL('../docs/LEONARDO-BRIEF.md', import.meta.url), 'utf8');
  // The tools' table: each subject's whole cell from batch.py's MOD line; and a list of words from a line of batch.py.
  const modOf = (text) => Object.fromEntries([...((text.split('\n').find((l) => l.startsWith('MOD = {')) || '').matchAll(/'([A-Za-z]+)': \('([^']+)', '[^']+'\)/g))].map((m) => [m[1], m[2]]));
  const wordsOf = (text, name) => ((new RegExp('^' + name + " = '([a-z ]+)'\\.split\\(\\)$", 'm').exec(text) || [])[1] || '').split(' ').filter(Boolean);
  // The brief's table: the playful modifier of each subject its first column names in words ("Reading and Writing" is two). A row
  // whose cell begins "as" gives no words of its own (the ten subjects of the table's last row), and the tools give such a subject Reading's for people and Science's for things.
  const briefCells = (text) => { const lines = text.split('\n'); const at = lines.findIndex((l) => /^\| Subject \| Playful modifier \|/.test(l)); const out = {};
    if (at < 0) return out;
    for (const l of lines.slice(at + 2)) { if (!l.startsWith('| ')) break; const cells = l.slice(2, -2).split(' | '); if (/^as /.test(cells[1])) continue; for (const s of cells[0].split(/, | and /)) out[s] = cells[1]; }
    return out; };
  const MOD = modOf(py); const BRIEF = briefCells(brief);
  const sameTable = (mod, cells) => Object.keys(mod).length >= 5 && Object.keys(cells).length === Object.keys(mod).length && Object.keys(mod).every((s) => mod[s] === cells[s]);
  const WORDS = new Set(wordsOf(py, 'MOOD_WORDS')); const JOIN = new Set(wordsOf(py, 'MOOD_JOINERS'));
  // A mood: two to four words of MOOD_WORDS, a joining word only between two of them (batch.py's mood_problem, the same rule), and
  // since round one's code read of pass NY never two joining words together and no word said twice, and since round two's never with
  // no joining word at all.
  const moodOk = (mood) => { const w = String(mood).split(' '); const said = w.filter((x) => !JOIN.has(x));
    return WORDS.size >= 20 && w.length >= 2 && w.length <= 4 && w.every((x) => WORDS.has(x) || JOIN.has(x)) && !JOIN.has(w[0]) && !JOIN.has(w[w.length - 1])
      && !w.some((x, i) => i > 0 && JOIN.has(x) && JOIN.has(w[i - 1])) && new Set(said).size === said.length
      && w.some((x) => JOIN.has(x)); };
  const subjectOf = {}; for (const c of COURSES) { subjectOf[c.id] = c.subject; for (const m of c.modules) subjectOf[m.id] = c.subject; }
  // A row's words (Mikey's answers to Q132 and Q133): its subject's cell, a Math beat's without "cheerful and", and a subject with no
  // words of its own Reading's or Science's by the spreadsheet's reading of a person in the words before its style.
  const { hasPerson } = await import('../tools/prompts-csv.mjs');
  const cellFor = (subject, head, mood, mod) => {
    if (!(subject in mod)) return hasPerson(head) ? mod.Reading : mod.Science;
    return mood === 'gentle and warm' && mod[subject].startsWith('cheerful and ') ? mod[subject].slice('cheerful and '.length) : mod[subject]; };
  const judge = (text, mod = MOD) => { const out = { both: 0, bad: [] };
    for (const line of text.split('\n')) {
      const m = /^\| ((S|CS)(\d+)) \| ([^|]+?) \| /.exec(line); if (!m) continue;
      const prompt = line.split(' | ')[3] || ''; const at = prompt.indexOf('. Style:'); const subject = subjectOf[m[4]];
      if (at < 0 || subject === undefined || !mod.Reading || !mod.Science) { out.bad.push(m[1] + ' (unread)'); continue; }
      const head = prompt.slice(0, at); const pieces = head.split(', '); const last = pieces[pieces.length - 1]; const cell = cellFor(subject, head, last, mod); const tail = ', ' + cell + ', ' + last;
      if (head.endsWith(tail) && head.length > tail.length) { if (moodOk(last)) out.both++; else out.bad.push(m[1] + ' (its words after the cell are not two to four words of MOOD_WORDS)'); continue; }
      out.bad.push(m[1] + ' (without its words and a mood)');
    }
    return out; };
  const now = judge(ledger);
  // The near misses, on S3923 (Listen and Point, Reading) as the rows carry it since pass NY, on S3886 (held), and on rows added
  // after the day's last serials.
  const rowS3923 = ledger.split('\n').find((l) => l.startsWith('| S3923 |')) || ''; const MINE = ', imaginative and expressive, storybook style, gentle and warm. Style:';
  const asS3923 = (words) => (rowS3923.includes(MINE) ? ledger.split(rowS3923).join(rowS3923.split(MINE).join(words + '. Style:')) : '');
  const added = (serial, module, modifier) => ledger + '\n| ' + serial + ' | ' + module + ' | A planted row | A small girl reading on a rug, ' + modifier + '. Style: Clean 3D vector illustration, balanced lighting, uncluttered layout, character-focused, dreamy lighting. | text, words | Needed |';
  const caught = (text, serial) => !!text && judge(text).bad.some((b) => b.split(' ')[0] === serial);
  const rowS3886 = ledger.split('\n').find((l) => l.startsWith('| S3886 |')) || ''; const BEAT_WORDS = ', neat, colorful, geometric, gentle and warm. Style:';
  const asRow = (row, from, to) => (row && row.includes(from) ? ledger.split(row).join(row.split(from).join(to)) : '');
  const rowS494 = ledger.split('\n').find((l) => l.startsWith('| S494 |')) || ''; const rowS496 = ledger.split('\n').find((l) => l.startsWith('| S496 |')) || '';
  const NEAR = {
    'a mood row without the table\'s words': caught(asS3923(', gentle and warm'), 'S3923'),
    'the table\'s words after the mood': caught(asS3923(', gentle and warm, imaginative and expressive, storybook style'), 'S3923'),
    'a mood before the first clause alone': caught(asS3923(', gentle and warm, imaginative and expressive'), 'S3923'),
    'a cell of the wrong subject': caught(asS3923(', cheerful and neat, colorful, geometric, gentle and warm'), 'S3923'),
    'a new row with the table\'s words and no mood': caught(added('S4229', 'two-ideas', 'imaginative and expressive, storybook style'), 'S4229'),
    'a new row in the older form': caught(added('CS661', 'listen-and-point-pk3', 'imaginative and expressive'), 'CS661'),
    'a row in the older form, as 4,250 were until pass NY': caught(asS3923(', imaginative and expressive'), 'S3923'),
    'a new row whose mood names a thing': caught(added('S4229', 'two-ideas', 'imaginative and expressive, storybook style, a red ball'), 'S4229'),
    'a new row whose mood says two joining words together': caught(added('S4229', 'two-ideas', 'imaginative and expressive, storybook style, calm and and warm'), 'S4229'),
    'a new row whose mood says one word twice': caught(added('S4229', 'two-ideas', 'imaginative and expressive, storybook style, calm calm'), 'S4229'),
    'a new row whose mood has no joining word': caught(added('S4229', 'two-ideas', 'imaginative and expressive, storybook style, calm patient'), 'S4229'),
    'a new row with both passes': !!rowS3923 && !caught(added('S4229', 'two-ideas', 'imaginative and expressive, storybook style, calm and warm'), 'S4229'),
    'a Math beat with "cheerful and", the whole cell': caught(asRow(rowS3886, BEAT_WORDS, ', cheerful and neat, colorful, geometric, gentle and warm. Style:'), 'S3886'),
    'a Math beat with its mood alone, as until Q132': caught(asRow(rowS3886, BEAT_WORDS, ', gentle and warm. Style:'), 'S3886'),
    'a row of people of a subject with no words of its own given Science\'s (Q133)': caught(asRow(rowS494, ', imaginative and expressive, storybook style, ', ', wonder-filled and vibrant, stylized, curious, '), 'S494'),
    'a row of things of a subject with no words of its own given Reading\'s (Q133)': caught(asRow(rowS496, ', wonder-filled and vibrant, stylized, curious, ', ', imaginative and expressive, storybook style, '), 'S496') };
  const missed = Object.keys(NEAR).filter((k) => !NEAR[k]);
  ok(`every story row carries its subject's whole modifier from docs/LEONARDO-BRIEF.md's table and then a mood, in that order (Mikey's answer to Q128, "Q128- C", and his word of pass NY, "all rows should be updated throughout"), a Math beat Math's words without "cheerful and" (Q132) and a subject with no words of its own Reading's for people and Science's for things (Q133) (${now.both} rows carry both; near misses caught: ${Object.keys(NEAR).length - missed.length} of ${Object.keys(NEAR).length})`,
    now.bad.length === 0 && now.both >= 4733 && missed.length === 0, `wrong: ${now.bad.slice(0, 8).join(', ')}; near misses missed: ${missed.join('; ')}`);
  // The tools' table is the brief's, and long-batch.py takes it and the mood words from batch.py. Planted: MOD's Reading cell
  // changed alone, and the brief's, each caught.
  const PY_CELL = "'Reading': ('imaginative and expressive, storybook style', "; const BRIEF_CELL = '| Reading and Writing | imaginative and expressive, storybook style |';
  const modAlone = py.includes(PY_CELL) && !sameTable(modOf(py.split(PY_CELL).join("'Reading': ('imaginative and expressive, picture-book style', ")), BRIEF);
  const briefAlone = brief.includes(BRIEF_CELL) && !sameTable(MOD, briefCells(brief.split(BRIEF_CELL).join('| Reading and Writing | imaginative and expressive, picture-book style |')));
  const longReads = lb.includes("open('tools/stories/batch.py')") && /^b = .*MOD = eval\(re\.search\(r'\^MOD = /m.test(lb) && /MOOD_WORDS = re\.search\(r"\^MOOD_WORDS = /.test(lb);
  ok(`the story tools' table is the brief's: tools/stories/batch.py's MOD holds each subject's whole playful modifier as docs/LEONARDO-BRIEF.md's table has it, word for word (${Object.keys(MOD).join(', ')}), and long-batch.py reads MOD and the mood words from batch.py; MOD's cell and the brief's, each changed alone, planted, caught (Q128 (c))`,
    sameTable(MOD, BRIEF) && modAlone && briefAlone && longReads, JSON.stringify({ MOD, BRIEF, modAlone, briefAlone, longReads }));
  // The two tools write the rule, each run with python3 on a copy of the files it reads and writes, beside the tree's src/logic.mjs
  // (which imports nothing). batch.py is given tools/stories/batch-example.py itself, its main picture's alt and its last picture's
  // changed and one picture added, so the example's own moods are read: it rewrites the main picture's older template row (an older
  // row read as the template's; planted in that form, since no row carries it after pass NY) and the last picture's (its own mood), and adds S4229 at the end of the story scenes with one blank
  // line before the Course stories heading (pass NY: the driver had stopped on any new row since S4228's row came to touch the
  // heading), each with Science's whole cell and a mood, keeping the rows whose alts it kept, a hand-written one among them; with
  // them, an Art story's main row (Elements of art, a subject with no words of its own in the table, its scene a girl at an art
  // table) takes Reading's words, its mood and Reading's anchor (Mikey's answer to Q133, pass NY), and a Math story's beat, its alt
  // changed with the mood "gentle and warm", Math's words without "cheerful and" (his answer to Q132), its other picture Math's whole
  // cell. Given a mood of each wrong kind (a thing, one word, a joining word at the end, none), it stops, names each picture with
  // why, and writes nothing, and given those beside a changed alt on a row with a check note, it names each under each of its two
  // stops and writes nothing; given the main alt changed
  // again, it rewrites the row it wrote (a row of the new form read as the template's, never as hand-written). long-batch.py, given
  // reading-3's and art-3's long stories as they stand with a story mood and one picture's own, writes their rows with Reading's
  // whole cell (art-3's of people too, Science's for its painting alone, by the person reading) and those moods, and given reading-3's with a mood of each wrong kind, stops and writes nothing.
  const { mkdtempSync, mkdirSync, copyFileSync, symlinkSync, writeFileSync, rmSync } = await import('node:fs'); const { spawnSync } = await import('node:child_process');
  const { tmpdir } = await import('node:os'); const { join } = await import('node:path'); const { fileURLToPath } = await import('node:url');
  const root = fileURLToPath(new URL('..', import.meta.url)); const dirs = [];
  // A copy of the files the story tools read and write, in a folder of its own.
  const copy = () => { const dir = mkdtempSync(join(tmpdir(), 'edu-batch-')); dirs.push(dir);
    for (const d of ['src', 'docs', 'tools/stories']) mkdirSync(join(dir, d), { recursive: true });
    symlinkSync(join(root, 'src/logic.mjs'), join(dir, 'src/logic.mjs'));
    // The person reading the drivers run (Q133): the spreadsheet's own, linked as logic.mjs is.
    for (const f of ['tools/prompts-csv.mjs', 'tools/coloring-levels.mjs']) symlinkSync(join(root, f), join(dir, f));
    for (const f of ['src/stories.mjs', 'docs/ART-REQUESTS.md', 'tools/stories/batch.py', 'tools/stories/long-batch.py']) copyFileSync(join(root, f), join(dir, f));
    return dir; };
  // A tool run on a copy with a batch file: its exit code and everything it printed.
  const runTool = (dir, tool, batch) => { writeFileSync(join(dir, 'batch-file.py'), batch); const r = spawnSync('python3', ['tools/stories/' + tool, 'batch-file.py'], { cwd: dir, encoding: 'utf8', timeout: 120000 });
    return { code: r.status, said: (r.stdout || '') + (r.stderr || '') + (r.error ? String(r.error) : '') }; };
  const fileOf = (dir, f) => readFileSync(join(dir, f), 'utf8');
  const rowOf = (dir, serial) => fileOf(dir, 'docs/ART-REQUESTS.md').split('\n').find((l) => l.startsWith('| ' + serial + ' |')) || '';
  // The words a row's prompt carries after its scene and its subject's cell, up to ". Style:" (its mood), or null.
  const moodAfter = (row, cell) => { const c = row.split(' | '); const lead = (c[2] || '').replace(/ \(check: .*\)$/, '') + ', ' + cell + ', '; return c[3] && c[3].startsWith(lead) ? c[3].slice(lead.length).split('. Style:')[0] : null; };
  const example = readFileSync(new URL('../tools/stories/batch-example.py', import.meta.url), 'utf8');
  // A story's words as a Python string the drivers read: apostrophes as APOS, every other mark kept.
  const pyString = (v) => JSON.stringify(String(v).replace(/'/g, 'APOS')).replace(/[^\x00-\x7f]/g, (c) => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'));
  // An Art story (Elements of art, grade 3), a subject with no words of its own in the table, its main alt changed, with a mood.
  const art = STORIES['elements-of-art'];
  const artStory = "\nNEW['elements-of-art'] = dict(about=" + pyString(art.about) + ', title=' + pyString(art.title) + ", bg='art room', mood='curious and bright', alt=" + pyString(art.alt + ' in the sun')
    + ', more=[' + art.more.map((m, i) => '(' + pyString(m.alt + (i === art.more.length - 1 ? ' in the sun' : '')) + ', ' + m.after + ')').join(', ') + '], words=[' + art.words.map(pyString).join(', ') + '])\n';
  // Its last picture, cups pinned on a wall, shows no one: given a new alt too, its row takes Science's words and anchor (round two's
  // code read of pass NY, its M2: with only the girl's row changed, a style_for that gave Reading's to every such subject passed).
  const artThings = art.more[art.more.length - 1];
  // The example's story with its main alt and its last picture's alt changed (the last keeps its own mood) and a picture added, and
  // the Art story; or, with bad moods, one of each kind the driver refuses, a thing (the main picture's own), one word (the last
  // picture's), a joining word at the end (the third extra picture's, its alt changed too) and none (the added picture, the story's
  // mood taken out); and with a hand-written row too, a changed alt on S442, whose row is planted with a check note, so both of the
  // driver's stops are printed.
  const BAD_MOODS = "_d.pop('mood', None); _d['alt_mood'] = 'a red ball'\n_d['more'][2] = (_d['more'][2][0] + ' on the mat', _d['more'][2][1], None, 'warm and')\n_d['more'][3] = _d['more'][3][:3] + ('warm',)\n"
    // Since round one's code read of pass NY, two pictures more whose moods say two joining words together and a word twice, and since
    // round two's a third whose mood has no joining word.
    + "_d['more'] = _d['more'] + [('The girl holding up the rock', 6, None, 'calm and and warm'), ('The girl holding up the pillow', 6, None, 'calm calm'), ('The girl holding up the cup', 6, None, 'calm patient')]\n";
  // A hand-written row is one the template did not write: S442 carries a check note, and since round one's code read of pass NY S441's
  // prompt carries a thing where its mood would be ("scene, cell, a red ball"), which template_start reads as no mood, so its alt
  // changed stops the driver as a hand-written row's does, where its words would be overwritten.
  const HAND_ALT = "_d['more'][0] = (_d['more'][0][0] + ' on the mat', _d['more'][0][1])\n_d['more'][1] = (_d['more'][1][0] + ' on the mat', _d['more'][1][1])\n";
  const changed = (alt, bad = '') => example + "\n_d = NEW['hard-or-soft']\n_d['alt'] = _d['alt'] + ' " + alt + "'\n"
    + "_d['more'] = _d['more'][:-1] + [(_d['more'][-1][0] + ' on the mat',) + tuple(_d['more'][-1][1:]), ('The girl smiling beside the sorted pairs', 6)]\n"
    + (bad ? BAD_MOODS + (bad === 'moods and hand' ? HAND_ALT : '') : artStory);
  let ran = {};
  try {
    const A = copy(); const S442 = rowOf(A, 'S442'); const handNote = ' | A hand pressing a hard rock and a soft pillow (check: one hand) | ';
    writeFileSync(join(A, 'docs/ART-REQUESTS.md'), fileOf(A, 'docs/ART-REQUESTS.md').split(S442).join(S442.split(' | A hand pressing a hard rock and a soft pillow | ').join(handNote)));
    // The main picture's row in the older form, its subject's first clause alone, as 4,250 rows were until pass NY.
    const S440 = rowOf(A, 'S440'); const S440old = S440.split(', ' + MOD.Science + ', curious and playful. Style:').join(', ' + MOD.Science.split(', ')[0] + '. Style:');
    writeFileSync(join(A, 'docs/ART-REQUESTS.md'), fileOf(A, 'docs/ART-REQUESTS.md').split(S440).join(S440old));
    const plantedOld = S440old !== S440 && S440old.includes(', wonder-filled and vibrant. Style:');
    // S441's prompt with a thing where its mood is, a hand-written row by template_start's reading (round one's code read of pass NY).
    const S441 = rowOf(A, 'S441'); const S441hand = S441.split(', ' + MOD.Science + ', ').length === 2 ? S441.replace(/(, wonder-filled and vibrant, stylized, curious, )[a-z ]+(\. Style:)/, '$1a red ball$2') : '';
    writeFileSync(join(A, 'docs/ART-REQUESTS.md'), fileOf(A, 'docs/ART-REQUESTS.md').split(S441).join(S441hand));
    const plantedHand = !!S441hand && S441hand !== S441 && S441hand.includes(', curious, a red ball. Style:');
    const ledgerA = fileOf(A, 'docs/ART-REQUESTS.md'); const storiesA = fileOf(A, 'src/stories.mjs'); const kept = ['S441', 'S442', 'S1740'].map((s) => rowOf(A, s));
    const reasons = ['S440 (not words of MOOD_WORDS: a red ball)', 'S1740 (begins or ends on a joining word)', 'S1741 (not two to four words)', 'S4229 (no mood)', 'S4230 (two joining words together)', 'S4231 (one word said twice)', 'S4232 (no joining word)'];
    const untouched = () => fileOf(A, 'docs/ART-REQUESTS.md') === ledgerA && fileOf(A, 'src/stories.mjs') === storiesA;
    const refused = runTool(A, 'batch.py', changed('in the sun', 'moods'));
    const refusedWell = refused.code === 1 && reasons.every((x) => refused.said.includes(x)) && !/hand-written/.test(refused.said) && untouched();
    const refusedBoth = runTool(A, 'batch.py', changed('in the sun', 'moods and hand'));
    const refusedBothWell = plantedHand && refusedBoth.code === 1 && rowOf(A, 'S442').includes('(check: one hand)') && /hand-written ledger rows and new alts[^\n]*S441, S442/.test(refusedBoth.said)
      && reasons.every((x) => refusedBoth.said.includes(x)) && untouched();
    const wrote = runTool(A, 'batch.py', changed('in the sun'));
    const main = rowOf(A, 'S440'); const last = rowOf(A, 'S1741'); const fresh = rowOf(A, 'S4229'); const sci = MOD.Science;
    const wroteWell = plantedOld && wrote.code === 0 && main.includes(' in the sun |') && moodOk(moodAfter(main, sci)) && moodOk(moodAfter(last, sci)) && moodAfter(last, sci) !== moodAfter(main, sci)
      && last.includes('minimalist bathroom background') && moodAfter(fresh, sci) === moodAfter(main, sci) && fileOf(A, 'docs/ART-REQUESTS.md').includes(fresh + '\n\n## Course stories (CS serials)')
      && kept.every((r, i) => !!r && rowOf(A, ['S441', 'S442', 'S1740'][i]) === r) && hasPerson(art.alt) && moodAfter(rowOf(A, art.art), MOD.Reading) === 'curious and bright' && rowOf(A, art.art).includes('uncluttered layout, character-focused, dreamy lighting.')
      && !hasPerson(artThings.alt + ' in the sun') && moodAfter(rowOf(A, artThings.serial), sci) === 'curious and bright' && rowOf(A, artThings.serial).includes(' in the sun |') && rowOf(A, artThings.serial).includes('uncluttered layout, dynamic close-up, soft shadows.');
    // Mikey's answers to Q132 and Q133 (pass NY): a Math story's beat whose alt changes, with the mood "gentle and warm", is written
    // with Math's words without "cheerful and", and its other picture with its own mood with Math's whole cell.
    const M = copy(); const tt = STORIES['telling-time'];
    const ttMore = tt.more.map((m, i) => '(' + pyString(m.alt + (i < 2 ? ' in the rain' : '')) + ', ' + m.after + (i === 0 ? ", None, 'calm and warm'" : i === 1 ? ", None, 'gentle and warm'" : '') + ')');
    const mathRan = runTool(M, 'batch.py', "NEW['telling-time'] = dict(about=" + pyString(tt.about) + ', title=' + pyString(tt.title) + ", bg='town square', mood='curious and bright', alt=" + pyString(tt.alt)
      + ', more=[' + ttMore.join(', ') + '], words=[' + tt.words.map(pyString).join(', ') + '])\n');
    const beatRow = rowOf(M, tt.more[1].serial); const calmRow = rowOf(M, tt.more[0].serial);
    const mathWell = mathRan.code === 0 && beatRow.includes(' in the rain |') && moodAfter(beatRow, 'neat, colorful, geometric') === 'gentle and warm' && !beatRow.includes('cheerful')
      && beatRow.includes('uncluttered layout, distinct geometric shapes.') && moodAfter(calmRow, MOD.Math) === 'calm and warm';
    const again = runTool(A, 'batch.py', changed('in the shade'));
    const againWell = again.code === 0 && rowOf(A, 'S440').includes(' in the shade |') && moodOk(moodAfter(rowOf(A, 'S440'), sci));
    const F = copy(); const story = COURSE_STORIES['reading-3']; const art3 = COURSE_STORIES['art-3']; const ledgerF = fileOf(F, 'docs/ART-REQUESTS.md'); const storiesF = fileOf(F, 'src/stories.mjs');
    // A long story as it stands, with a story mood and its third picture's own; or, for reading-3, no story mood and one picture's own
    // of each kind the driver refuses (a thing, one word, a joining word at the start), the last two with none.
    const own = (mood) => (mood ? ['', '', ", 'playful and bright'", '', ''] : [", 'a red ball'", ", 'warm'", ", 'and warm'", '', '']);
    const entry = (id, s, mood, owns = own(mood), alt = s.alt) => pyString(id) + ': dict(about=' + pyString(s.about) + ', alt=' + pyString(alt) + (mood ? ", mood='" + mood + "'" : '') + ', more=['
      + s.more.map((m, i) => '(' + pyString(m.alt) + ', ' + m.after + owns[i] + ')').join(', ') + '], words=[' + s.words.map(pyString).join(', ') + '])';
    // Since round one's code read of pass NY art-3's main picture is given a new scene, so its row takes the story's mood with it, where it
    // had kept "full of wonder", written for the scene it replaced; reading-3's keeps its scene and its own mood.
    // art-3's main picture is given a new scene of things alone (round two's code read of pass NY, its M2: a new scene of people kept the
    // old row's cell and anchor right by chance), so its row takes Science's words and anchor with the story's mood.
    const ART3_THINGS = 'A large painting of a boat in a storm on a museum wall';
    const longBatch = (mood) => 'NEW = { ' + entry('reading-3', story, mood) + (mood ? ', ' + entry('art-3', art3, mood, own(mood), ART3_THINGS) : '') + " }\nBG = { 'reading-3': 'classroom', 'art-3': 'museum' }\n";
    // The two faults since round one's code read of pass NY: the story's own mood says two joining words together, and its main picture
    // has a new scene, so the main row, which takes the story's mood, stops the driver (every picture has a mood of its own, all good
    // but the first, which says a word twice, and, since round two's code read, the second, which has no joining word).
    const longNew = 'NEW = { ' + entry('reading-3', story, 'calm and and warm', [", 'calm calm'", ", 'calm patient'", ", 'curious and warm'", ", 'curious and warm'", ", 'curious and warm'"], story.alt + ' in the sun') + " }\nBG = { 'reading-3': 'classroom' }\n";
    const longRefused = runTool(F, 'long-batch.py', longBatch(null));
    const longRefusedWell = longRefused.code === 1 && ['CS68 (not words of MOOD_WORDS: a red ball)', 'CS69 (not two to four words)', 'CS70 (begins or ends on a joining word)', 'CS71 (no mood)', 'CS72 (no mood)'].every((x) => longRefused.said.includes(x))
      && fileOf(F, 'docs/ART-REQUESTS.md') === ledgerF && fileOf(F, 'src/stories.mjs') === storiesF;
    const longNewRefused = runTool(F, 'long-batch.py', longNew);
    const longNewWell = longNewRefused.code === 1 && [`${story.art} (two joining words together)`, 'CS68 (one word said twice)', 'CS69 (no joining word)'].every((x) => longNewRefused.said.includes(x)) && !/CS7[0-2] \(/.test(longNewRefused.said)
      && fileOf(F, 'docs/ART-REQUESTS.md') === ledgerF && fileOf(F, 'src/stories.mjs') === storiesF;
    // Mikey's answer to Q132 in long-batch.py too: math-4's second picture with its own mood "gentle and warm" takes Math's words
    // without "cheerful and", its first the story's mood after Math's whole cell.
    const G = copy(); const m4 = COURSE_STORIES['math-4'];
    const mathLong = runTool(G, 'long-batch.py', 'NEW = { ' + entry('math-4', m4, 'curious and warm', ['', ", 'gentle and warm'", '', '', '']) + " }\nBG = { 'math-4': 'community center' }\n");
    const mathLongWell = mathLong.code === 0 && m4.more.length === 5 && moodAfter(rowOf(G, m4.more[1].serial), 'neat, colorful, geometric') === 'gentle and warm' && !rowOf(G, m4.more[1].serial).includes('cheerful')
      && moodAfter(rowOf(G, m4.more[0].serial), MOD.Math) === 'curious and warm';
    const readingMain = rowOf(F, story.art);
    const longWrote = runTool(F, 'long-batch.py', longBatch('curious and warm'));
    const longWroteWell = longWrote.code === 0 && story.more.length === 5 && art3.more.length === 5
      && [[story, () => MOD.Reading], [art3, (m) => (hasPerson(m.alt) ? MOD.Reading : sci)]].every(([s, cellOf]) => s.more.every((m, i) => moodAfter(rowOf(F, m.serial), cellOf(m)) === (i === 2 ? 'playful and bright' : 'curious and warm')))
      && art3.more.some((m) => hasPerson(m.alt)) && art3.more.some((m) => !hasPerson(m.alt)) && art3.more.every((m) => rowOf(F, m.serial).includes('uncluttered layout, ' + (hasPerson(m.alt) ? 'character-focused, dreamy lighting' : 'dynamic close-up, soft shadows') + '.'))
      && hasPerson(art3.alt) && !hasPerson(ART3_THINGS) && (rowOf(F, art3.art).split(' | ')[3] || '').startsWith(ART3_THINGS + ', ') && moodAfter(rowOf(F, art3.art), sci) === 'curious and warm' && rowOf(F, art3.art).includes('uncluttered layout, dynamic close-up, soft shadows.') && rowOf(F, story.art) === readingMain && moodAfter(readingMain, MOD.Reading) === 'proud and lively';
    ran = { refusedWell, refusedBothWell, wroteWell, againWell, mathWell, longRefusedWell, longNewWell, longWroteWell, mathLongWell, said: [refused, refusedBoth, wrote, again, mathRan, longRefused, longNewRefused, longWrote, mathLong].map((r) => r.code + ' ' + r.said.trim().slice(-240)) };
  } finally { for (const d of dirs) rmSync(d, { recursive: true, force: true }); }
  ok('the story tools write a story row\'s subject words and then its mood, and stop without one, each run on a copy (Q128 (c)): batch.py, given tools/stories/batch-example.py with alts changed and a picture added, rewrites an older template row and the picture with its own mood and adds S4229 before the Course stories heading, each with Science\'s whole cell and a mood, as an Art story\'s row of a girl takes Reading\'s words and anchor and its row of cups alone Science\'s (Q133), keeps the rows whose alts it kept, stops with nothing written on a mood of each wrong kind, alone and beside a hand-written row\'s new alt, naming each, and rewrites a row it wrote when its alt changes again; given a Math story\'s beat, writes Math\'s words without "cheerful and" (Q132); long-batch.py writes reading-3\'s rows with Reading\'s whole cell and art-3\'s with Reading\'s for its people and Science\'s for its painting alone, its main row\'s new scene of a painting alone taking Science\'s words and anchor (Q133), and math-4\'s beat with Math\'s words without "cheerful and" (Q132), with their moods, and stops with nothing written on a mood of each wrong kind',
    ran.refusedWell && ran.refusedBothWell && ran.wroteWell && ran.againWell && ran.mathWell && ran.longRefusedWell && ran.longNewWell && ran.longWroteWell && ran.mathLongWell, JSON.stringify(ran));
}
// Two people who look alike (pass MX, round two's content read: Gran's tangerine coat a lesson after a white-haired grandma's
// marigold sweater, the look class every pass since MO has met, each time found by a person reading). tools/look-echoes.mjs reads
// every pre-K story and painting row's people for their hair and clothing color families and lists two people of one kind (girl,
// boy, woman, man) in different lessons of the same course or the course before whose families both match, the looks themselves
// differing. A row from pass MX on (S4027 and P175 on) is held to none; the older pairs wait as a count that only falls (EARMARKS
// A73). Since the third read: a person a new row begins a look for (with, who has, of about eight with, teacher with) that the tool
// cannot read fails (Dex's dad, whose man bun had read as a second man, was read as no one); the people a new row meets again are
// named, each with the older rows it repeats (P175 paints Mia and Sam as their course draws them), where any look an older row gave
// had been excused, so someone given another's look word for word passed; and two people in one lesson are read too. The near misses:
// Gran's coat put back to tangerine; Noemi's dress as round two's fix first wrote it, cranberry, beside First steps' girl with short
// black hair in a red dress, which this check found; Noemi given that girl's look word for word; Dex given brown hair and a teal
// t-shirt beside Jasper in his own story; and Dex's dad with no hair written; while P175's Mia and Sam, named, pass.
// Since pass NQ (Mikey's answer to Q114, "Q114 - A") a look counts its hairstyle, garment and skin too, which sets the founding case apart
// (Gran's coat beside the grandma's sweater, her hair under a hat beside long loose hair), and with it Noemi's cranberry dress (her long hair
// and glasses beside the short black pixie cut S1468's girl has worn since pass ND re-picked her) and Dex's teal t-shirt (a mop beside
// Jasper's mohawk): the Q114 block at the end holds each as no pair. The plants here are each case alike in all four: Gran given the
// grandma's long loose white hair in a tangerine sweater; Noemi given S1468's look word for word as it stands; Noemi's cranberry dress with
// S1468's pixie cut; Jasper given brown curls in a green t-shirt beside P175's Sam, whose curly hair is the same hairstyle in another word,
// in one lesson (two looks written differently, so an echo, not a person met again); Dex's dad with no hair written, as before; and P175's
// Mia and Sam, named, pass only by their naming (with it taken out, caught), since (a) left P175 no pair outside the looks it repeats.
{ const { personReads, lookPairs: lookPairsWide, coursesBefore } = await import('../tools/look-echoes.mjs'); const lookPairs = (looks) => lookPairsWide(looks, coursesBefore);   // the reading this check was written with (pass NF, A97)
  // ECHO_WAITING: 80 until pass NQ, 0 since: Q114 (a) sets every one of the 80 older pairs apart by hairstyle or garment (or both).
  const NEW_FROM = { S: 4027, P: 175 }; const ECHO_WAITING = 0;
  const MET_AGAIN = { 'P175|girl': ['S176', 'S200'], 'P175|boy': ['S113', 'S200'] };
  const isNew = (serial) => { const m = /^([SP])(\d+)$/.exec(serial); return !!m && +m[2] >= NEW_FROM[m[1]]; };
  const judge = (text, metTable = MET_AGAIN) => { const all = personReads(text); const looks = all.filter((x) => x.read); const lookOf = new Map(looks.map((x) => [x.serial + '|' + x.group, x.look]));
    const metAgain = (x) => { const older = metTable[x.serial + '|' + x.group]; return !!older && older.every((s) => lookOf.get(s + '|' + x.group) === x.look); };
    const fresh = (x) => isNew(x.serial) && !metAgain(x); const pairs = lookPairs(looks);
    return { looks: looks.length, unread: all.filter((x) => !x.read && isNew(x.serial)), newer: pairs.filter((p) => (fresh(p[0]) || fresh(p[1])) && !(p.same && p.sameLesson)),
      waiting: pairs.filter((p) => !fresh(p[0]) && !fresh(p[1]) && !p.same), named: Object.keys(MET_AGAIN).every((k) => { const [s, g] = k.split('|'); return metAgain({ serial: s, group: g, look: lookOf.get(k) }); }) }; };
  const name = ([a, b]) => a.serial + ' and ' + b.serial + ' (' + a.group + ', ' + a.hair + ' hair, ' + a.clothing + ')';
  const pairOf = (r, x, y) => r.newer.some(([a, b]) => [a.serial, b.serial].includes(x) && [a.serial, b.serial].some((s) => y.test(s)));
  const now = judge(ledger);
  const plants = [pairOf(judge(ledger.replace('silver hair under a wide-brimmed cream felt hat, in a long sapphire-blue coat', 'long white hair worn loose over her shoulders, in a long tangerine sweater')), 'S4038', /^S402[79]$/),
    pairOf(judge(ledger.split('long black hair and green-framed glasses, in a caramel-brown dress').join('a short black pixie cut in a red dress')), 'S1468', /^S403[5-8]$/),
    pairOf(judge(ledger.split('long black hair and green-framed glasses, in a caramel-brown dress').join('a short black pixie cut, in a cranberry dress')), 'S1468', /^S403[5-8]$/),
    judge(ledger.split('a short dark-brown mohawk and a gap-toothed grin, in a turquoise t-shirt').join('dark-brown curls and a gap-toothed grin, in a green t-shirt')).newer.some((p) => !p.same && p.sameLesson && [p[0].serial, p[1].serial].includes('P175')),
    judge(ledger.split('a short blond man bun and a blond goatee').join('a blond goatee')).unread.length > 0,
    now.named && judge(ledger, {}).newer.some(([a, b]) => a.serial === 'P175' || b.serial === 'P175')];
  ok(`no person a pre-K row writes from pass MX on looks like another of their kind in the same lesson, course or course before, by hair and clothing color, hairstyle, garment and skin since pass NQ (Q114 (a)), and every look such a row begins is read (${now.looks} looks read; P175's Mia and Sam named as met again; ${now.waiting.length} older pairs wait as a count that only falls, at most ${ECHO_WAITING}; six near misses)`,
    now.looks >= 500 && now.unread.length === 0 && now.newer.length === 0 && now.waiting.length <= ECHO_WAITING && plants.every(Boolean),
    `new pairs: ${now.newer.map(name).join('; ')}; unread: ${now.unread.map((x) => x.serial + ' ' + x.why).join('; ')}; waiting ${now.waiting.length}; near misses ${plants}`); }
// Hair written alike (pass NC, round two's content read): two people of one kind whose hair is the same color family and the same style
// words, whatever they wear, in the same course or the course before (hairPairs; a beard, glasses, graying and the like set two apart).
// A row from pass NC on (S4079 and P189 on) is held to none, and the older pairs wait as a count that only falls (EARMARKS A90). The
// near misses: Emeka's short wavy black hair and Astrid's mom's long blond braid put back, each caught beside the older row it echoed.
{ const { personReads, hairPairs: hairPairsWide, coursesBefore } = await import('../tools/look-echoes.mjs'); const hairPairs = (looks) => hairPairsWide(looks, coursesBefore);   // as written (pass NF, A97)
  const FROM = { S: 4079, P: 189 }; const HAIR_WAITING = 5;
  const isNew = (serial) => { const m = /^([SP])(\d+)$/.exec(serial); return !!m && +m[2] >= FROM[m[1]]; };
  const judge = (text) => { const pairs = hairPairs(personReads(text).filter((x) => x.read)); return { newer: pairs.filter(([a, b]) => isNew(a.serial) || isNew(b.serial)), waiting: pairs.filter(([a, b]) => !isNew(a.serial) && !isNew(b.serial)) }; };
  const now = judge(ledger); const swap = (from, to) => (ledger.includes(from) ? judge(ledger.split(from).join(to)) : null);
  const caughtBeside = (r, older) => !!r && r.newer.some(([a, b]) => [a.serial, b.serial].includes(older));
  const plants = [caughtBeside(swap('A small boy with short black locs, in a lemon-yellow t-shirt', 'A small boy with short wavy black hair, in a lemon-yellow t-shirt'), 'S3987'),
    caughtBeside(swap('a mom with a short blond pixie cut, in a coral blouse', 'a mom with long blond hair in a loose braid, in a coral blouse'), 'S4039')];
  ok(`no person a pre-K row writes from pass NC on has hair written like another of their kind in the same course or course before, whatever they wear (${now.waiting.length} older pairs wait as a count that only falls, at most ${HAIR_WAITING}; two near misses)`,
    now.newer.length === 0 && now.waiting.length <= HAIR_WAITING && plants.every(Boolean), `new pairs: ${now.newer.map(([a, b]) => a.serial + ' and ' + b.serial).join('; ')}; waiting ${now.waiting.length}; near misses ${plants}`); }
// Hair near alike (pass ND, round one's story check): hairNearPairs reads one shared style word where hairPairs asks for all of them, so
// a row from pass ND on (S4099 and P194 on) is held to none, and the older pairs wait as a count that only falls. Its plants: Harriet's
// first look, a chin-length brown bob, caught beside say-it-to-fit's girl (S3997), and the car-seat girl's A90 pigtails beside S107's.
{ const { personReads, hairNearPairs: hairNearPairsWide, coursesBefore } = await import('../tools/look-echoes.mjs'); const hairNearPairs = (looks) => hairNearPairsWide(looks, coursesBefore);   // as written (pass NF, A97)
  // HAIR_NEAR_WAITING: 33 since round two's alignment read made the tool read a style word in its forms (curly as curls, braids as braid),
  // where it stood at 18 by the older reading; pass NC's ledger had 49 by the stricter one.
  const FROM = { S: 4099, P: 194 }; const HAIR_NEAR_WAITING = 33;
  const isNew = (serial) => { const m = /^([SP])(\d+)$/.exec(serial); return !!m && +m[2] >= FROM[m[1]]; };
  const pairsIn = (text) => hairNearPairs(personReads(text).filter((x) => x.read));
  const now = pairsIn(ledger); const newer = now.filter(([a, b]) => isNew(a.serial) || isNew(b.serial)); const waiting = now.filter(([a, b]) => !isNew(a.serial) && !isNew(b.serial));
  const has = (pairs, x, y) => pairs.some(([a, b]) => (a.serial === x && b.serial === y) || (a.serial === y && b.serial === x));
  const swap = (from, to) => (ledger.includes(from) ? pairsIn(ledger.split(from).join(to)) : []);
  const plants = [has(swap('a chin-length auburn bob and freckles', 'a chin-length brown bob and freckles'), 'S4107', 'S3997'),
    has(swap('a brown side braid tied with a yellow ribbon', 'short brown pigtails tied with yellow ribbons'), 'S4075', 'S107'),
    // Round two's alignment read: round one's look for the play-together boy, curls beside how-friends-feel's curly hair, put back.
    has(swap('small boy with two short black braids in a green shirt', 'small boy with short black curls in a green shirt'), 'S3915', 'S3907')];
  ok(`no person a pre-K row writes from pass ND on has hair sharing a style word and a color with another of their kind in the same course or course before (${waiting.length} older pairs wait as a count that only falls, at most ${HAIR_NEAR_WAITING}; three plants caught)`,
    newer.length === 0 && waiting.length <= HAIR_NEAR_WAITING && plants.every(Boolean), `new pairs: ${newer.map(([a, b, s]) => a.serial + ' and ' + b.serial + ' (' + s.join(', ') + ')').join('; ')}; waiting ${waiting.length}; plants ${plants}`); }
// The rows pass ND re-picked (the third read): A90's 52 older rows keep their serials, so the hair checks above held them only by their
// ceilings, never to none, and round one's look for S1468 made a new near pair under that ceiling, found only by round two's
// alignment read. Each re-picked row is in no pair it was not in before the pass: the pairs it is in today by the three readings (one
// distinctive hair word, hair written alike, and hair with clothing color), each of them on pass NC's ledger read by today's tool, are
// named (KEPT_ND), a new one fails, and one that is gone must leave the list. Its plant: S1468's round one look, a short black side
// ponytail, put back, caught.
{ const W = await import('../tools/look-echoes.mjs'); const { personReads } = W; const hairPairs = (r) => W.hairPairs(r, W.coursesBefore); const hairNearPairs = (r) => W.hairNearPairs(r, W.coursesBefore); const lookPairs = (r) => W.lookPairs(r, W.coursesBefore);   // as written (pass NF, A97)
  const REPICKED_ND = ['S1', 'S104', 'S105', 'S1397', 'S1398', 'S1448', 'S1468', 'S3894', 'S3895', 'S3896', 'S3897', 'S3898', 'S3899', 'S3900', 'S3901', 'S3902', 'S3903', 'S3904', 'S3905', 'S3906',
    'S3907', 'S3908', 'S3909', 'S3910', 'S3911', 'S3912', 'S3913', 'S3914', 'S3915', 'S3916', 'S3917', 'S3918', 'S3919', 'S3920', 'S3921', 'S3922', 'S3939', 'S3940', 'S3941', 'S3942',
    'S4063', 'S4064', 'S4065', 'S4066', 'S4071', 'S4072', 'S4073', 'S4074', 'S4075', 'S4076', 'S4077', 'S4078'];
  // KEPT_ND.look: 33 pairs named until pass NQ, none since: Q114 (a) sets every one apart by hairstyle or garment (each is listed, with its
  // words, in pass NQ's record of what the change did); the near and hair pairs read hair alone and stay as they were.
  const KEPT_ND = { near: ['S173 S3907', 'S185 S3911', 'S191 S4075', 'S212 S3907', 'S3911 S4047', 'S3915 S4059'], hair: [], look: [] };
  const set = new Set(REPICKED_ND); const key = ([a, b]) => [a.serial, b.serial].sort((x, y) => +x.slice(1) - +y.slice(1)).join(' ');
  const mine = (pairs) => [...new Set(pairs.filter(([a, b]) => set.has(a.serial) || set.has(b.serial)).map(key))];
  const judge = (text) => { const reads = personReads(text).filter((x) => x.read); return { near: mine(hairNearPairs(reads)), hair: mine(hairPairs(reads)), look: mine(lookPairs(reads)) }; };
  const diff = (j) => Object.keys(KEPT_ND).flatMap((k) => [...j[k].filter((p) => !KEPT_ND[k].includes(p)).map((p) => 'new ' + k + ' pair ' + p), ...KEPT_ND[k].filter((p) => !j[k].includes(p)).map((p) => 'gone ' + k + ' pair ' + p)]);
  const now = diff(judge(ledger)); const LOOK = 'a small girl with a short black pixie cut in a red dress';
  const plant = ledger.includes(LOOK) ? diff(judge(ledger.split(LOOK).join('a small girl with a short black side ponytail in a red dress'))) : [];
  ok(`no row pass ND re-picked is in a pair it was not in before the pass, by one hair word, hair written alike or hair with clothing color (with hairstyle, garment and skin since pass NQ, Q114 (a)) (${REPICKED_ND.length} rows; ${KEPT_ND.near.length + KEPT_ND.hair.length + KEPT_ND.look.length} pairs named, each on pass NC's ledger; S1468's round one look, planted, caught)`,
    now.length === 0 && plant.some((d) => d.startsWith('new near pair') && d.includes('S1468')), `now: ${now.slice(0, 6).join('; ')}; plant: ${plant.slice(0, 4).join('; ')}`); }
// Mike's haircut is his (pass ND, round one's story check; pass MQ re-picked a boy with Mike at four's look): Mike, "a shaved-short
// haircut and curious brown eyes", is painted in every pre-K course, so no other pre-K boy wears a buzz cut, a crew cut or a
// shaved-short haircut. Its plant: A note for the fridge's boy given his first look, a red buzz cut, caught; Mike's own rows pass.
{ const { personReads } = await import('../tools/look-echoes.mjs');
  const MIKE = /shaved-short haircut and curious brown eyes/; const SHORT_CUT = /\b(?:buzz cut|crew cut|shaved)/;
  const offenders = (text) => personReads(text).filter((x) => x.group === 'boy' && SHORT_CUT.test(x.words) && !MIKE.test(x.words)).map((x) => x.serial);
  const mikes = personReads(ledger).filter((x) => x.group === 'boy' && MIKE.test(x.words)).length; const now = offenders(ledger);
  const plant = offenders(ledger.split('A small boy with wavy red hair over his ears and round cheeks,').join('A small boy with a red buzz cut and round cheeks,')).includes('S4103');
  ok(`no pre-K boy but Mike wears a buzz cut, a crew cut or a shaved-short haircut (${mikes} rows of Mike read; the fridge boy's buzz cut planted, caught)`, mikes >= 3 && now.length === 0 && plant, `${now.join(', ')}; plant ${plant}`); }
// A look read against its own subject too (EARMARKS A97, pass NF; Claude's design): the checks above read a row against its own course
// and the course one place before or after it in COURSES (coursesBefore), so pre-K 4's First Sounds and Letters met First Steps and never
// pre-K 3's Listen and point, the reading course a child meets the year before, where In it goes' boy first wore S3963's short straight
// red hair and gray top, found by eye (pass NE). The wide reading (coursesNear) adds the course of the same subject in the other pre-K
// grade. A row from pass NF on (S4127 and P197 on) is held to none by all three readings: hair and clothing color (a person met again
// named in MET_AGAIN_WIDE, none yet), hair written alike, and one shared hair word. The older pairs only the wide reading finds wait as
// counts that only fall (EARMARKS A105): 53 by hair and clothing color, 17 by hair written alike, 35 by one shared hair word. Its plants,
// each a row appended for a lesson of pass NF and each caught by the wide reading beside the older row it echoes and not by the narrow
// one: a boy in Hear it in a word with S3963's short straight red hair, in a gray hoodie; a grandma in Look and write with S4111's short
// gray afro, in a red sweater; and a boy in Hear it in a word with short black locs like S3967's, in a green t-shirt. Since pass NQ (Mikey's
// answer to Q114, "Q114 - A") a look counts its garment too, so the boy's gray hoodie beside S3963's gray knit sweater is no pair (the Q114
// block at the end holds it), and the first plant gives him S3963's sweater as well, alike in all four.
{ const W = await import('../tools/look-echoes.mjs'); const { personReads } = W;
  // WIDE_WAITING.look: 53 until pass NQ, 1 since (S209's man, short black hair and a short black beard in a gray sweater, beside S1406's,
  // short black hair in a gray sweater: a beard is not among what (a) counts): Q114 (a) sets the other 52 apart by hairstyle or garment.
  // The hair readings read hair alone, and their 17 and 35 stay.
  const FROM = { S: 4127, P: 197 }; const WIDE_WAITING = { look: 1, hair: 17, near: 35 }; const MET_AGAIN_WIDE = {};
  const isNew = (serial) => { const m = /^([SP])(\d+)$/.exec(serial); return !!m && +m[2] >= FROM[m[1]]; };
  const key = (p) => [p[0].serial, p[1].serial].sort().join(' ') + '|' + p[0].group + '|' + [p[0].look, p[1].look].sort().join(' || ');
  const metAgain = (p) => p.same && [[p[0], p[1]], [p[1], p[0]]].some(([x, y]) => isNew(x.serial) && (MET_AGAIN_WIDE[x.serial + '|' + x.group] || []).includes(y.serial));
  const READINGS = { look: (r, near) => W.lookPairs(r, near).filter((p) => !(p.same && p.sameLesson)), hair: W.hairPairs, near: W.hairNearPairs };
  const judge = (text) => { const reads = personReads(text).filter((x) => x.read); const out = {};
    for (const [k, f] of Object.entries(READINGS)) { const wide = f(reads, W.coursesNear); const narrow = new Set(f(reads, W.coursesBefore).map(key));
      out[k] = { newer: wide.filter((p) => (isNew(p[0].serial) || isNew(p[1].serial)) && !metAgain(p)), waiting: wide.filter((p) => !isNew(p[0].serial) && !isNew(p[1].serial) && !(k === 'look' && p.same) && !narrow.has(key(p))), narrowKeys: narrow }; }
    return out; };
  const now = judge(ledger);
  const row = (serial, module, person) => `\n| ${serial} | ${module} | A planted row (check: one person) | ${person}, standing in a sunny kitchen, warm and calm. Style: Clean 3D vector illustration. | none | Needed |\n`;
  const caught = (k, text, serial, older) => { const j = judge(text)[k]; const hit = j.newer.find((p) => [p[0].serial, p[1].serial].includes(serial) && [p[0].serial, p[1].serial].includes(older)); return !!hit && !j.narrowKeys.has(key(hit)); };
  const plants = [caught('look', ledger + row('S4127', 'hear-it-in-a-word', 'A small boy with short straight red hair, in a gray sweater'), 'S4127', 'S3963'),
    caught('hair', ledger + row('S4131', 'look-and-write', 'A grandma with a short gray afro, in a red sweater'), 'S4131', 'S4111'),
    caught('near', ledger + row('S4128', 'hear-it-in-a-word', 'A small boy with short black locs, in a green t-shirt'), 'S4128', 'S3967')];
  const counts = Object.keys(READINGS).map((k) => `${now[k].waiting.length} ${k}`).join(', ');
  ok(`no person a pre-K row writes from pass NF on looks like another of their kind in the course of the same subject in the other pre-K grade either, by hair and clothing color (with hairstyle, garment and skin since pass NQ, Q114 (a)), hair written alike or one shared hair word (EARMARKS A97; older pairs only that reading finds wait as counts that only fall, ${counts}, at most ${WIDE_WAITING.look}, ${WIDE_WAITING.hair} and ${WIDE_WAITING.near}; three plants caught beside the rows they echo, which the narrow reading misses)`,
    Object.keys(READINGS).every((k) => now[k].newer.length === 0 && now[k].waiting.length <= WIDE_WAITING[k]) && plants.every(Boolean),
    `new: ${Object.keys(READINGS).flatMap((k) => now[k].newer.map((p) => k + ' ' + p[0].serial + ' and ' + p[1].serial)).join('; ')}; waiting ${counts}; plants ${plants}`); }
// Skin in a person's look (Mikey's answer to Q99, pass NJ: "Q99 - A"; EARMARKS A123): every row from pass NI's new serials on that paints a
// person writes skin in plain words (pass NI's writer began it; S4135 "warm brown skin"), and every character sheet and Wonder portrait
// writes its person's skin as docs/CHARACTERS.md's Skin table gives it (Mikey's words for five, Claude's choice for Frederick and Chloe at his
// word). An older row gains skin as its lesson is read again (the early build's rows before they are painted, EARMARKS L23), so the rows
// before pass NI are not read here. A coloring page (D, L or G) is line art with white insides, so it writes no skin (round two's whole read
// of EARMARKS: a skin word asks the painter for what the page's style forbids); a painting in color does. Plants: a new painting of a person
// with no skin, C1 without Mike's words, and a new coloring page asked for skin, each caught.
{ const { foldPrompt: fold, ledgerRows: rowsOf, hasPerson: person } = await import('../tools/prompts-csv.mjs');
  const FROM = { S: 4135, CS: 661, P: 197 };   // paintings in color only (round two: the coloring pages' D, L and G write no skin)
  const isNew = (serial) => { const m = /^(CS|[A-Z])(\d+)$/.exec(serial); return !!(m && FROM[m[1]] !== undefined && Number(m[2]) >= FROM[m[1]]); };
  const body = (prompt) => String(prompt).split(/\s*Style:/)[0];
  const skinless = (rows) => rows.filter(([serial, , scene, prompt]) => isNew(serial) && person(scene) && !/\bskin\b/i.test(body(prompt))).map((r) => r[0]);
  // A coloring page from pass NI's serials on that names skin (D301 and L27 and G2 on), which its white insides cannot show.
  const pageSkin = (rows) => rows.filter(([serial, , , prompt]) => { const m = /^([DLG])(\d+)$/.exec(serial); return !!m && Number(m[2]) >= ({ D: 301, L: 27, G: 2 })[m[1]] && /\bskin\b/i.test(body(prompt)); }).map((r) => r[0]);
  const cast = readFileSync('docs/CHARACTERS.md', 'utf8'); const table = (cast.split('## Skin, the same in every picture')[1] || '').split('\n## ')[0];
  const words = Object.fromEntries([...table.matchAll(/^\| (Mike|Savanah|Jaxon|Harlow|Georgette|Frederick|Chloe) \| ([a-z -]+skin[a-z -]*) \|/gm)].map((m) => [m[1], m[2].trim()]));
  const sheetPeople = { C1: 'Mike', C2: 'Mike', C3: 'Chloe', C4: 'Chloe', C12: 'Chloe', C5: 'Frederick', C6: 'Frederick', C13: 'Frederick', C7: 'Savanah', C8: 'Savanah', C9: 'Jaxon', C10: 'Harlow', C11: 'Georgette', C14: 'Georgette', U2: 'Frederick', U3: 'Chloe', U4: 'Georgette', U5: 'Mike' };
  const looksOff = (rows) => Object.entries(sheetPeople).filter(([serial, who]) => { const r = rows.find((x) => x[0] === serial); if (!r || !words[who]) return true;
    const text = body(r[3]); const w = words[who]; return !text.includes(w); }).map(([s]) => s);   // the table's words exactly (round one's code read: U2's turned-round form had passed)
  const rows = rowsOf(ledger); const newPeople = rows.filter(([serial, , scene]) => isNew(serial) && person(scene)).length;
  const plantRow = ['S99999', 'q-v-and-y', 'A small boy smiling', 'A small boy with short black hair, in a red shirt, smiling. Style: Clean 3D vector illustration.', 'text', 'Needed'];
  const plantSheet = rows.map((r) => (r[0] === 'C1' ? [r[0], r[1], r[2], r[3].replace(`${words.Mike}, `, ''), r[4], r[5]] : r));
  const plantPage = ['D999', 'q-v-and-y', 'A girl coloring', 'A girl with light tan skin coloring a kite, in thick black outlines. Style: Clean black line art for a coloring page.', 'text', 'Needed'];
  ok(`every painting in color from pass NI's serials on that paints a person writes skin (${newPeople} rows), every character sheet and Wonder portrait writes its person's skin as docs/CHARACTERS.md gives it (${Object.keys(words).length} people, ${Object.keys(sheetPeople).length} rows), and no coloring page from pass NI's serials on asks for skin; a new painting with no skin, C1 without Mike's words and a new coloring page asked for skin, planted, each caught (Q99 (a), pass NJ; the coloring pages since round two's whole read)`,
    newPeople >= 8 && skinless(rows).length === 0 && Object.keys(words).length === 7 && looksOff(rows).length === 0 && pageSkin(rows).length === 0 && skinless([...rows, plantRow]).includes('S99999') && looksOff(plantSheet).includes('C1') && pageSkin([...rows, plantPage]).includes('D999'),
    `skinless ${skinless(rows).join(',')}; looks off ${looksOff(rows).join(',')}; coloring pages with skin ${pageSkin(rows).join(',')}; words ${JSON.stringify(words)}`); }
// The look tool counts skin, hairstyle and garment (pass NQ, Mikey's answer to Q114, "Q114 - A": "Count skin, hairstyle and garment too, so
// two people set apart by any of them no longer count as alike"). Three checks, their near misses on the real rows, each new rule proven
// failing with its guard taken out of a copy of the tool (the copy is written to a folder of its own and imported, as the rules test does).
// (1) Skin is read into its family from every form the rows write (light: pale white, fair, light and light tan; tan: tan, olive-toned tan
// and light brown; brown: medium, warm and deep brown), the cast's toned forms too; every skin a pre-K row writes today has a family, and a
// skin in words no family names, planted, is caught; and a look that writes its skin before its hair keeps its hair's own color.
// (2) The founding case's two grandmas (pass MX: S4038's Gran beside S4027's and S4029's grandma): Gran given the grandma's long loose white
// hair and a tangerine sweater is a pair, alike in everything; in a tangerine coat, alike in all but garment, no pair; with her own hair
// under her hat, alike in all but hairstyle, no pair; with deep brown skin beside the grandma's fair skin, alike in all but skin, no pair,
// and a pair again with skins of one family (light tan beside fair) or with one skin unwritten. Jasper given brown curls beside P175's Sam's
// curly hair is one hairstyle in two words, an echo. A hair pair (pass NC's plant, Emeka's short wavy black hair beside S3987's boy's) and a
// near hair pair (pass ND's plant, Harriet's chin-length brown bob beside S3997's girl's chin-length curls): with skins of two families none,
// with skins of one family still one. (3) What (a) set apart, held so it is never silent: the founding case as it was (Gran's tangerine
// coat), Noemi's cranberry dress beside S1468's girl, Dex's teal t-shirt beside Jasper's, and In it goes' boy's gray hoodie beside S3963's
// gray sweater are each no pair, and each a pair again with garment and hairstyle taken out of a copy, as before pass NQ.
{ const W = await import('../tools/look-echoes.mjs');
  const { mkdtempSync, writeFileSync, rmSync } = await import('node:fs'); const { tmpdir } = await import('node:os'); const { join } = await import('node:path'); const { pathToFileURL } = await import('node:url');
  const GRAN = 'silver hair under a wide-brimmed cream felt hat, in a long sapphire-blue coat';   // S4038, Gran as she stands since pass MX
  const GRANDMA = 'long white hair worn loose over her shoulders, in a cozy marigold sweater';   // S4027 and S4029
  const LOOSE = 'long white hair worn loose over her shoulders'; const JASPER = 'a short dark-brown mohawk and a gap-toothed grin, in a turquoise t-shirt';
  const row = (serial, module, person) => `\n| ${serial} | ${module} | A planted row (check: one person) | ${person}, standing in a sunny kitchen, warm and calm. Style: Clean 3D vector illustration. | none | Needed |\n`;
  const swap = (text, from, to) => text.split(from).join(to);
  const readsOf = (T, text) => T.personReads(text).filter((r) => r.read);
  // A pair of one group between a row x names and a row y names (serials by pattern).
  const has = (pairs, x, y, group) => pairs.some((p) => p[0].group === group && ((x.test(p[0].serial) && y.test(p[1].serial)) || (x.test(p[1].serial) && y.test(p[0].serial))));
  const gran = (T, words, grandma = GRANDMA) => has(T.lookPairs(readsOf(T, swap(swap(ledger, GRAN, words), GRANDMA, grandma)), T.coursesNear), /^S4038$/, /^S402[79]$/, 'woman');
  const emeka = (T, mine, his) => has(T.hairPairs(readsOf(T, swap(swap(ledger, 'A small boy with short black locs, in a lemon-yellow t-shirt', `A small boy with short wavy black hair${mine}, in a lemon-yellow t-shirt`), 'short wavy black hair, in a white t-shirt', `short wavy black hair${his}, in a white t-shirt`)), T.coursesNear), /^S40(8[7-9]|90)$/, /^S39(8[7-9]|90)$/, 'boy');
  const harriet = (T, hers) => has(T.hairNearPairs(readsOf(T, swap(swap(ledger, 'a chin-length auburn bob and freckles', 'a chin-length brown bob, freckles and deep brown skin'), 'chin-length curly brown hair, in a gray t-shirt', `chin-length curly brown hair and ${hers} skin, in a gray t-shirt`)), T.coursesNear), /^S41(0[7-9]|10)$/, /^S3997$/, 'girl');
  const skinOf = (T, words) => { const x = T.personReads(row('S99990', 'which-way-we-read-pk', `A small boy with ${words}, in a red t-shirt`)).find((r) => r.group === 'boy'); return x && x.read ? `${x.hair} ${x.skin}` : 'unread'; };
  // (1) The skin a form is read as: each form the rows and the cast write, in a planted row, with its family.
  const FORMS = [['short black hair and pale white skin', 'black light'], ['short black hair and fair skin', 'black light'], ['short black hair and light skin', 'black light'], ['short black hair and light tan skin', 'black light'],
    ['short black hair and tan skin', 'black tan'], ['short black hair and olive-toned tan skin', 'black tan'], ['short black hair and light brown skin', 'black tan'], ['short black hair and medium brown skin', 'black brown'],
    ['short black hair and warm brown skin', 'black brown'], ['short black hair and deep brown skin', 'black brown'], ['short black hair and fair skin with a rosy tone', 'black light'], ['short black hair and light skin with a warm golden tone', 'black light'],
    ['short black hair and light skin with freckles', 'black light'], ['warm brown skin and short black hair', 'black brown']];
  const formsOff = (T) => FORMS.filter(([words, want]) => skinOf(T, words) !== want).map(([words]) => `${words}: ${skinOf(T, words)}`);
  const written = W.personReads(ledger).filter((x) => x.read && x.skinWords); const unplaced = (text) => W.personReads(text).filter((x) => x.read && x.skinWords && !x.skin).map((x) => `${x.serial} ${x.skinWords}`);
  const plantSkin = unplaced(ledger + row('S99991', 'which-way-we-read-pk', 'A small boy with short black hair and sun-kissed skin, in a red t-shirt')).some((s) => s.startsWith('S99991'));
  // (2) The near misses, each a test of a copy of the tool T that holds when the rule does.
  const NEAR = {
    'alike in everything, a pair': (T) => gran(T, `${LOOSE}, in a long tangerine sweater`),
    'alike in all but garment, no pair': (T) => !gran(T, `${LOOSE}, in a long tangerine coat`),
    'alike in all but hairstyle, no pair': (T) => !gran(T, 'silver hair under a wide-brimmed cream felt hat, in a long tangerine sweater'),
    'alike in all but skin, no pair': (T) => !gran(T, `${LOOSE} and deep brown skin, in a long tangerine sweater`, `${LOOSE} and fair skin, in a cozy marigold sweater`),
    'skins of one family, a pair': (T) => gran(T, `${LOOSE} and light tan skin, in a long tangerine sweater`, `${LOOSE} and fair skin, in a cozy marigold sweater`),
    'one skin unwritten, a pair': (T) => gran(T, `${LOOSE} and deep brown skin, in a long tangerine sweater`),
    'one hairstyle in two words, an echo': (T) => has(T.lookEchoes(readsOf(T, swap(ledger, JASPER, 'dark-brown curls and a gap-toothed grin, in a green t-shirt')), T.coursesNear), /^S40(2[7-9]|30)$/, /^P175$/, 'boy'),
    'a hair pair with skins of two families, none': (T) => !emeka(T, ' and deep brown skin', ' and fair skin'),
    'a hair pair with skins of one family, still one': (T) => emeka(T, ' and deep brown skin', ' and warm brown skin'),
    'a near hair pair with skins of two families, none': (T) => !harriet(T, 'fair'),
    'a near hair pair with skins of one family, still one': (T) => harriet(T, 'warm brown'),
    'every form read into its family, the hair kept its own': (T) => formsOff(T).length === 0 };
  // (3) What (a) set apart.
  const PAST = {
    'the founding case as it was, Gran in her tangerine coat': (T) => !gran(T, 'silver hair under a wide-brimmed cream felt hat, in a long tangerine coat'),
    "Noemi's cranberry dress beside S1468's girl": (T) => !has(T.lookPairs(readsOf(T, swap(ledger, 'in a caramel-brown dress', 'in a cranberry dress')), T.coursesNear), /^S403[5-8]$/, /^S1468$/, 'girl'),
    "Dex's teal t-shirt beside Jasper's": (T) => !T.lookPairs(readsOf(T, swap(ledger, 'a mop of reddish-brown hair over his forehead, in a tan t-shirt', 'a mop of brown hair over his forehead, in a teal t-shirt')), T.coursesNear).some((p) => p.some((x) => /mop of brown hair/.test(x.words)) && p.some((x) => /mohawk/.test(x.words))),
    "In it goes' boy's gray hoodie beside S3963's": (T) => !has(T.lookPairs(readsOf(T, ledger + row('S4127', 'hear-it-in-a-word', 'A small boy with short straight red hair, in a gray hoodie')), T.coursesNear), /^S4127$/, /^S3963$/, 'boy') };
  // Each guard, the words it is in the tool and its words taken out, and the near miss that must fail without it.
  const GUARDS = {
    'skin in lookPairs': [' && a.garment === b.garment && !skinApart(a, b)) pairs.push', ' && a.garment === b.garment) pairs.push', 'alike in all but skin, no pair'],
    'garment in lookPairs': [' && a.garment === b.garment && !skinApart', ' && !skinApart', 'alike in all but garment, no pair'],
    'hairstyle in lookPairs': [' && hairstyleOf(a) === hairstyleOf(b)', '', 'alike in all but hairstyle, no pair'],
    'a style word in its forms': ['.filter(Boolean).map((w) => NEAR_FORMS[w] || w))].sort()', '.filter(Boolean))].sort()', 'one hairstyle in two words, an echo'],
    'skin in hairPairs': [' && marks(a) === marks(b) && !skinApart(a, b)) pairs.push', ' && marks(a) === marks(b)) pairs.push', 'a hair pair with skins of two families, none'],
    'skin in hairNearPairs': [' || skinApart(a, b)) continue;', ') continue;', 'a near hair pair with skins of two families, none'],
    'a compound skin read before its parts': ["[['light', /\\blight[- ]tan\\b/], ", '[', 'every form read into its family, the hair kept its own'],
    'the hair read past the skin': [".find((piece) => !/\\bskin\\b/.test(piece)) || ''", '[0]', 'every form read into its family, the hair kept its own'] };
  const src = readFileSync(new URL('../tools/look-echoes.mjs', import.meta.url), 'utf8'); const logicAt = new URL('../src/logic.mjs', import.meta.url).href;
  const dir = mkdtempSync(join(tmpdir(), 'edu-looks-')); let copies = 0;
  // A copy of the tool with words taken out, or null when those words are not in it exactly once (the check then fails).
  const copyWithout = async (pairsOut) => { let text = src; for (const [from, to] of pairsOut) { if (text.split(from).length !== 2) return null; text = text.replace(from, to); }
    const f = join(dir, `look-echoes-copy-${++copies}.mjs`); writeFileSync(f, text.replace("from '../src/logic.mjs'", `from '${logicAt}'`)); return import(pathToFileURL(f).href); };
  const loose = []; let pastBack = false;
  try {
    for (const [name, [from, to, nearMiss]] of Object.entries(GUARDS)) { const T = await copyWithout([[from, to]]); if (!T || NEAR[nearMiss](T)) loose.push(name); }
    const before = await copyWithout([[GUARDS['garment in lookPairs'][0], GUARDS['garment in lookPairs'][1]], [GUARDS['hairstyle in lookPairs'][0], GUARDS['hairstyle in lookPairs'][1]]]);
    pastBack = !!before && Object.values(PAST).every((f) => !f(before));
  } finally { rmSync(dir, { recursive: true, force: true }); }
  const missed = Object.entries(NEAR).filter(([, f]) => !f(W)).map(([k]) => k); const pastHeld = Object.entries(PAST).filter(([, f]) => !f(W)).map(([k]) => k);
  ok(`the look tool reads skin into three families from every form the rows write and the cast's toned forms (${FORMS.length} forms), every skin a pre-K row writes today has one (${written.length} looks), a skin in words no family names, planted, is caught, and a look that writes its skin before its hair keeps its hair's own color (pass NQ, Q114 (a))`,
    written.length >= 150 && unplaced(ledger).length === 0 && plantSkin && formsOff(W).length === 0, `forms off: ${formsOff(W).join('; ')}; unplaced: ${unplaced(ledger).join('; ')}; planted caught ${plantSkin}`);
  ok(`two people count as alike only when hair and clothing color, hairstyle and garment all match and their skin does not set them apart, and skin sets apart a hair pair and a near hair pair: ${Object.keys(NEAR).length} near misses on the founding case's grandmas, Jasper and P175's Sam, and the hair plants of pass NC and pass ND, and each of ${Object.keys(GUARDS).length} guards taken out of a copy of the tool fails its own (pass NQ, Mikey's answer to Q114, "Q114 - A")`,
    missed.length === 0 && loose.length === 0, `near misses not held: ${missed.join('; ')}; guards whose removal no near miss caught: ${loose.join('; ')}`);
  ok(`what Q114 (a) set apart is held, never silent: the founding case as it was (Gran's tangerine coat beside the grandma's marigold sweater), Noemi's cranberry dress, Dex's teal t-shirt and In it goes' boy's gray hoodie are each no pair, and each a pair again with garment and hairstyle taken out of a copy, as before pass NQ`,
    pastHeld.length === 0 && pastBack, `paired still: ${pastHeld.join('; ')}; pairs again without garment and hairstyle: ${pastBack}`); }
console.log(`\n${pass} passed, ${fail} failed`);
process.exitCode = fail ? 1 : 0;   // never process.exit(): it can drop the last lines of a piped stdout (2026-09-23)
