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
// A story picture takes its course subject's style (pass MO, round one's picture check: Listen and Point's and First Sounds and
// Letters' twelve new rows took Math's "distinct geometric shapes" where their subject is Reading's "character-focused, dreamy
// lighting", the slip pass MM made on the long stories' rows). The anchors are tools/stories/batch.py's MOD table, read from the
// file, so the batches and this check share one source. Every pre-K story row ends its style on its subject's anchor; the rows of
// kindergarten and up that do not wait as a count that only falls (141 in pass MO, kindergarten's and grade 1's), for their
// courses' reviews. Proven failing on pass MO's frozen copy (the twelve) and on a row given another subject's anchor.
{
  const py = readFileSync(new URL('../tools/stories/batch.py', import.meta.url), 'utf8');
  const modLine = py.split('\n').find((l) => l.startsWith('MOD = {')) || '';
  const anchors = Object.fromEntries([...modLine.matchAll(/'([A-Za-z]+)': \('[^']+', '([^']+)'\)/g)].map((m) => [m[1], m[2]]));
  const courseOf = {}; for (const c of COURSES) for (const m of c.modules) courseOf[m.id] = c;
  const offRows = (text) => text.split('\n').filter((l) => /^\| S\d+ \|/.test(l)).map((l) => l.split(' | ')).filter((cols) => { const c = courseOf[(cols[1] || '').trim()]; const anchor = c && anchors[c.subject]; return anchor && !(cols[3] || '').includes(`uncluttered layout, ${anchor}.`); })
    .map((cols) => ({ serial: cols[0].slice(2), grade: courseOf[cols[1].trim()].grade }));
  const off = offRows(ledger); const early = off.filter((r) => r.grade === 'PK3' || r.grade === 'PK4'); const later = off.filter((r) => r.grade !== 'PK3' && r.grade !== 'PK4');
  const swapped = ledger.replace(/(\| S3919 \|[^\n]*?)uncluttered layout, character-focused, dreamy lighting\./, '$1uncluttered layout, distinct geometric shapes.');
  const caught = offRows(swapped).some((r) => r.serial === 'S3919');
  ok(`every pre-K story picture takes its course subject's style anchor (${Object.keys(anchors).length} subjects read from batch.py; ${later.length} rows of kindergarten and up wait as a count that only falls)`, Object.keys(anchors).length >= 5 && early.length === 0 && later.length <= 141 && caught, `pre-K off: ${early.map((r) => r.serial).join(',')}; later ${later.length}`);
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
{ const { personReads, lookPairs: lookPairsWide, coursesBefore } = await import('../tools/look-echoes.mjs'); const lookPairs = (looks) => lookPairsWide(looks, coursesBefore);   // the reading this check was written with (pass NF, A97)
  const NEW_FROM = { S: 4027, P: 175 }; const ECHO_WAITING = 80;
  const MET_AGAIN = { 'P175|girl': ['S176', 'S200'], 'P175|boy': ['S113', 'S200'] };
  const isNew = (serial) => { const m = /^([SP])(\d+)$/.exec(serial); return !!m && +m[2] >= NEW_FROM[m[1]]; };
  const judge = (text) => { const all = personReads(text); const looks = all.filter((x) => x.read); const lookOf = new Map(looks.map((x) => [x.serial + '|' + x.group, x.look]));
    const metAgain = (x) => { const older = MET_AGAIN[x.serial + '|' + x.group]; return !!older && older.every((s) => lookOf.get(s + '|' + x.group) === x.look); };
    const fresh = (x) => isNew(x.serial) && !metAgain(x); const pairs = lookPairs(looks);
    return { looks: looks.length, unread: all.filter((x) => !x.read && isNew(x.serial)), newer: pairs.filter((p) => (fresh(p[0]) || fresh(p[1])) && !(p.same && p.sameLesson)),
      waiting: pairs.filter((p) => !fresh(p[0]) && !fresh(p[1]) && !p.same), named: Object.keys(MET_AGAIN).every((k) => { const [s, g] = k.split('|'); return metAgain({ serial: s, group: g, look: lookOf.get(k) }); }) }; };
  const name = ([a, b]) => a.serial + ' and ' + b.serial + ' (' + a.group + ', ' + a.hair + ' hair, ' + a.clothing + ')';
  const pairOf = (r, x, y) => r.newer.some(([a, b]) => [a.serial, b.serial].includes(x) && [a.serial, b.serial].some((s) => y.test(s)));
  const now = judge(ledger);
  const plants = [pairOf(judge(ledger.replace('in a long sapphire-blue coat', 'in a long tangerine coat')), 'S4038', /^S402[79]$/),
    pairOf(judge(ledger.split('in a caramel-brown dress').join('in a cranberry dress')), 'S1468', /^S403[5-8]$/),
    pairOf(judge(ledger.split('long black hair and green-framed glasses, in a caramel-brown dress').join('short black hair and bangs in a red dress')), 'S1468', /^S403[5-8]$/),
    pairOf(judge(ledger.split('a mop of reddish-brown hair over his forehead, in a tan t-shirt').join('a mop of brown hair over his forehead, in a teal t-shirt')), 'S4027', /^S40(2[7-9]|30)$/),
    judge(ledger.split('a short blond man bun and a blond goatee').join('a blond goatee')).unread.length > 0,
    now.named && now.waiting.some(([a, b]) => a.serial === 'P175' || b.serial === 'P175')];
  ok(`no person a pre-K row writes from pass MX on looks like another of their kind in the same lesson, course or course before, by hair and clothing color, and every look such a row begins is read (${now.looks} looks read; P175's Mia and Sam named as met again; ${now.waiting.length} older pairs wait as a count that only falls, at most ${ECHO_WAITING}; six near misses)`,
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
  const KEPT_ND = { near: ['S173 S3907', 'S185 S3911', 'S191 S4075', 'S212 S3907', 'S3911 S4047', 'S3915 S4059'], hair: [],
    look: ['S104 S128', 'S104 S146', 'S116 S3907', 'S116 S3911', 'S134 S3894', 'S1406 S3942', 'S1465 S3907', 'S1468 S3967', 'S149 S3899', 'S155 S3911', 'S158 S3904', 'S170 S3907', 'S179 S3894',
      'S179 S3907', 'S179 S3911', 'S200 S3911', 'S209 S3903', 'S215 S3907', 'S3886 S3899', 'S3894 S3907', 'S3894 S3963', 'S3899 S3967', 'S3899 S3970', 'S3903 S3955', 'S3903 S3959', 'S3903 S4011',
      'S3904 S3955', 'S3907 S3935', 'S3911 S3971', 'S3915 S3931', 'S3915 S3983', 'S3919 S4015', 'S95 S3899'] };
  const set = new Set(REPICKED_ND); const key = ([a, b]) => [a.serial, b.serial].sort((x, y) => +x.slice(1) - +y.slice(1)).join(' ');
  const mine = (pairs) => [...new Set(pairs.filter(([a, b]) => set.has(a.serial) || set.has(b.serial)).map(key))];
  const judge = (text) => { const reads = personReads(text).filter((x) => x.read); return { near: mine(hairNearPairs(reads)), hair: mine(hairPairs(reads)), look: mine(lookPairs(reads)) }; };
  const diff = (j) => Object.keys(KEPT_ND).flatMap((k) => [...j[k].filter((p) => !KEPT_ND[k].includes(p)).map((p) => 'new ' + k + ' pair ' + p), ...KEPT_ND[k].filter((p) => !j[k].includes(p)).map((p) => 'gone ' + k + ' pair ' + p)]);
  const now = diff(judge(ledger)); const LOOK = 'a small girl with a short black pixie cut in a red dress';
  const plant = ledger.includes(LOOK) ? diff(judge(ledger.split(LOOK).join('a small girl with a short black side ponytail in a red dress'))) : [];
  ok(`no row pass ND re-picked is in a pair it was not in before the pass, by one hair word, hair written alike or hair with clothing color (${REPICKED_ND.length} rows; ${KEPT_ND.near.length + KEPT_ND.hair.length + KEPT_ND.look.length} pairs named, each on pass NC's ledger; S1468's round one look, planted, caught)`,
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
// gray afro, in a red sweater; and a boy in Hear it in a word with short black locs like S3967's, in a green t-shirt.
{ const W = await import('../tools/look-echoes.mjs'); const { personReads } = W;
  const FROM = { S: 4127, P: 197 }; const WIDE_WAITING = { look: 53, hair: 17, near: 35 }; const MET_AGAIN_WIDE = {};
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
  const plants = [caught('look', ledger + row('S4127', 'hear-it-in-a-word', 'A small boy with short straight red hair, in a gray hoodie'), 'S4127', 'S3963'),
    caught('hair', ledger + row('S4131', 'look-and-write', 'A grandma with a short gray afro, in a red sweater'), 'S4131', 'S4111'),
    caught('near', ledger + row('S4128', 'hear-it-in-a-word', 'A small boy with short black locs, in a green t-shirt'), 'S4128', 'S3967')];
  const counts = Object.keys(READINGS).map((k) => `${now[k].waiting.length} ${k}`).join(', ');
  ok(`no person a pre-K row writes from pass NF on looks like another of their kind in the course of the same subject in the other pre-K grade either, by hair and clothing color, hair written alike or one shared hair word (EARMARKS A97; older pairs only that reading finds wait as counts that only fall, ${counts}, at most ${WIDE_WAITING.look}, ${WIDE_WAITING.hair} and ${WIDE_WAITING.near}; three plants caught beside the rows they echo, which the narrow reading misses)`,
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
console.log(`\n${pass} passed, ${fail} failed`);
process.exitCode = fail ? 1 : 0;   // never process.exit(): it can drop the last lines of a piped stdout (2026-09-23)
