// Every picture the app expects from Mikey has a row in the art ledger, so no photo is ever forgotten:
// story serials (S), coloring page serials (L), and nothing in the ledger that the app does not use.
import { readFileSync } from 'node:fs';
import { STORIES, COURSE_STORIES, COLOR_PAGES } from '../src/stories.mjs';
import { stylesFor, ROW } from '../tools/coloring-levels.mjs';
import { MAP_SERIALS, MODULES } from '../src/logic.mjs';
let pass = 0; let fail = 0;
const ok = (label, cond, detail = '') => { console.log((cond ? 'PASS' : 'FAIL') + ' - ' + label + (cond ? '' : '  ' + detail)); cond ? pass++ : fail++; };
const ledger = readFileSync('docs/ART-REQUESTS.md', 'utf8');
const rows = new Set([...ledger.matchAll(/^\| ((?:CS|[SLDMP])\d+) \|/gm)].map((m) => m[1]));
const lessonSerials = MODULES.flatMap((m) => (m.lesson && m.lesson.pictures || []).map((p) => p.serial));   // lesson pictures (pass JO)
const storySerials = Object.values(STORIES).flatMap((s) => [s.art, ...(s.more || []).map((m) => m.serial)]);
const letterSerials = 'abcdefghijklmnopqrstuvwxyz'.split('').map((ch, i) => `L${i + 1}`);
const drawingSerials = [...Array.from({ length: 27 }, (_, i) => `D${i + 1}`), ...Object.values(COLOR_PAGES).map(([serial]) => serial)];   // lesson pages D28 on (2026-09-24)
const courseSerials = Object.values(COURSE_STORIES).flatMap((s) => [s.art, ...(s.more || []).map((m) => m.serial)]);   // doubled long stories carry five more (2026-09-24)
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
console.log(`\n${pass} passed, ${fail} failed`);
process.exitCode = fail ? 1 : 0;   // never process.exit(): it can drop the last lines of a piped stdout (2026-09-23)
