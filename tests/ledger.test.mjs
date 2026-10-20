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
  // once, both ways.
  const by = Object.fromEntries(all.map((r) => [r[0], r]));
  const noOne = ['P111', 'P18', 'P85', 'S874', 'S1188', 'S1706', 'S1707', 'S3826', 'S2', 'S31', 'P11', 'P75', 'S484', 'S1373', 'S2358', 'S96', 'S168', 'S1427', 'S3107', 'S2015', 'S1430', 'CS540', 'P81', 'S3807', 'S570', 'S3175', 'S3556', 'S3241', 'S1715', 'S3362', 'CS389', 'CS518', 'CS375', 'P127', 'S3653', 'CS280'];
  const someone = ['S273', 'S442', 'S1450', 'P59', 'S57', 'S804', 'S2402', 'S1500', 'S1695', 'S1605', 'S2903', 'S2545', 'S1773', 'P46', 'S958', 'S40', 'CS412', 'CS477', 'CS583', 'S1208', 'S1418'];
  const handed = (s) => / Hands have five fingers/.test(foldPrompt(by[s][3], by[s][4]).prompt);
  const wrong = [...noOne.filter((s) => !by[s] || handed(s)), ...someone.filter((s) => !by[s] || !handed(s))];
  ok('hands and skin are said where a person is drawn and nowhere else (clock hands, animal faces, solid faces, a class garden, a grown-up\'s shoe)', wrong.length === 0 && hasPerson('a crossing guard waving') && !hasPerson('the long hand on the 3') && !hasPerson('A clock with hands pointing to 3') && !hasPerson('a round clock with a plain white face, its only marks two black hands') && !hasPerson("a grown-up's big shoe") && hasPerson("a little boy's toes"), wrong.join(','));
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
  { const parse = (line) => [...line.matchAll(/"((?:[^"]|"")*)"/g)].map((m) => m[1].replace(/""/g, '"'));
    const lines = want.split('\n').slice(1).map(parse); const head = parse(want.split('\n')[0]); const col = (n) => head.indexOf(n);
    const groups = []; for (const l of lines) if (groups[groups.length - 1] !== l[col('group')]) groups.push(l[col('group')]);
    // Since pass ML (Mikey's answer to Q44, "run the trial, then move them if they pass"): while the trial waits, its five pages
    // come first, each on both models, and the coloring pages painted on Lucid Origin come last, after what has no grade.
    const waiting = Object.values(COLORING_TRIAL).includes('waiting'); const moved = Object.values(COLORING_TRIAL).some((s) => s !== 'failed');
    const trialGroup = waiting ? groups[0] : null; const colorGroup = moved ? groups[groups.length - 1] : null;
    const middle = groups.slice(waiting ? 1 : 0, moved ? -1 : undefined);
    const castGroups = CAST_ORDER.flatMap((p) => [`${p}: references`, p]).filter((g) => middle.includes(g));
    const gradeGroups = middle.slice(castGroups.length + (middle.includes('Two or more of the cast') ? 1 : 0));
    const names = Object.values(REFERENCE_NAMES);
    ok('the spreadsheet runs in Mikey\'s painting order: the coloring trial first while it waits, then each person\'s references and then their pictures, person by person, then two or more of the cast, then by grade from pre-K 3, then what has no grade, then the coloring pages on Lucid Origin, numbered from 1, each group once',
      lines.every((l, k) => Number(l[col('order')]) === k + 1) && groups.length === new Set(groups).size && middle.slice(0, castGroups.length).join() === castGroups.join() && castGroups[0] === 'Mike: references' && gradeGroups[0] === 'Pre-K 3' && gradeGroups[gradeGroups.length - 1].startsWith('No grade')
      && (!waiting || trialGroup === TRIAL_GROUP) && (!moved || /on Lucid Origin, painted last/.test(colorGroup)),
      groups.join(' | '));
    // Every row names its model: Nano Banana 2.1 for every painting, reference and map, and for a coloring page the model its
    // kind's trial gives it (Lucid Origin, said with its fallback while the trial waits); the trial's rows name one model each.
    const trialLines = lines.filter((l) => l[col('group')] === TRIAL_GROUP);
    ok('every row names its model and its settings: Nano Banana 2.1 for every painting, reference and map, and for a coloring page the model its trial gives it; every character sheet has a reference name of its own, and a picture names each reference it needs',
      MODEL === 'Nano Banana 2.1' && COLORING_MODEL === 'Lucid Origin' && lines.every((l) => l[col('settings')].length > 20) && sheetsListed.every((s) => REFERENCE_NAMES[s]) && new Set(names).size === names.length
      && lines.filter((l) => l[col('group')] !== TRIAL_GROUP).every((l) => l[col('model')] === modelFor(l[col('serial')]) && (coloringKind(l[col('serial')]) || l[col('model')] === MODEL))
      && lines.filter((l) => coloringKind(l[col('serial')]) && l[col('group')] !== TRIAL_GROUP).every((l) => (l[col('group')] === colorGroup) === onLucid(l[col('serial')]) && /Lucid Origin/.test(l[col('model')]) === onLucid(l[col('serial')]))
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
      lines.filter((l) => l[col('group')] === colorGroup).every((l) => /as a Style Reference at Mid/.test(l[col('settings')])) && (!moved || lines.filter((l) => l[col('group')] === colorGroup).length >= 25),
      String(lines.filter((l) => l[col('group')] === colorGroup).length));
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
  // stones' S1, S29 and S1448 write him out too.
  const UNWRITTEN_SHEET_LIMIT = 118; let attached = 0; const unwrittenSheets = [];
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
console.log(`\n${pass} passed, ${fail} failed`);
process.exitCode = fail ? 1 : 0;   // never process.exit(): it can drop the last lines of a piped stdout (2026-09-23)
