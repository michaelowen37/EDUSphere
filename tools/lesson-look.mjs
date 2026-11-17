// Copyright (c) 2026 iECHO, LLC. All rights reserved.
// -----------------------------------------------------------------------------------------------------------------
// A lesson's look, screen by screen (pass NQ, EARMARKS L26: the lead's first look at every new lesson, put in the tree).
//
// In plain terms: the lead looks first at every new lesson (docs/INDEPENDENT-CHECKS.md, How, item 6) in the real page, at the screen's
// own size, one picture for each place the page is scrolled to. This tool opens the real page and saves those pictures: every lesson
// line (a stepped lesson shows one line at a time, and each line is stepped through with its Next button), or the whole lesson page of
// an older lesson, and every question screen dealt at each seed, at each size and theme, scrolled through from the top to the bottom
// in steps a little shorter than the screen so no part is missed, with an index.md that lists each picture with the line's words or the
// question's prompt, story and answer. It never takes a picture of a whole page ("fullPage" draws everything pinned to the screen where
// the screen stood, How item 12); every picture is the screen as a child sees it at that scroll place.
// How the page is opened (as tests/e2e/fold-check.mjs and tests/e2e/question-screens.mjs do): tests/e2e/page.html, the real built app
// with its test hook window.__eduTest; a made-up educator walks through the module's own level, openModule(id) opens the module's lesson,
// showQuestion(bank, seed, module) deals one question as the module asks it, and the theme is set before the page loads
// (edusphere_v1_theme). Motion is off (reducedMotion 'reduce') and touch is on (hasTouch true), as the e2e tests open it. The test page's
// 8-pixel body margin is taken off, since the product has none (as fold-check does), and the walk-through's notes under a question's
// picture are seen as an educator sees them, which a child's screen does not show (fold-check's reason for its learner).
// Build the page first, under the heavy lock (the lead's step, a few minutes):
//   flock /tmp/nq-heavy.lock bash -c './build.sh && node tests/e2e/make-page.mjs'
//
// Run (from the project folder; a browser job, so under the lock too):
//   flock /tmp/nq-heavy.lock node tools/lesson-look.mjs <moduleId ...> --out <dir> [--sizes 390x844,320x568] [--themes light,dark]
//        [--seeds 1-6 | --seeds 1,4,9 | --cover [--cover-cap 40]] [--lines | --questions]
//   sizes      default 390x844 (a phone); themes default light,dark; seeds default 1-3
//   --lines    only the lesson's lines (or page); --questions only the question screens; neither takes both
//   --cover    chooses the seeds itself, bank by bank, from the generators read in node (src/logic.mjs), until each bank has dealt every
//              item of its table at least once: an item is a question as questionKey in src/logic.mjs defines it (setup, wording,
//              picture and answer), read over seeds 1 to 2,000, so a yes or no bank of sixteen pictures takes sixteen seeds, not two
//              (the pass NL case How item 6 cites; never the first six by habit). The first seed of each answer is taken first, so a cap
//              met early still shows every answer. At most --cover-cap seeds per bank (default 40); it prints the seeds it chose for
//              each bank, how many items and answers there are, and any answer never reached or items left past the cap, and the
//              index says so too
// Files: <out>/<module>__line-03__390x844__light__y0.png, <module>__q-<bank>-s<seed>__390x844__dark__y680.png (the module, the line or the
// bank and seed, the size, the theme, and the page's scroll place in pixels from its top), and <out>/index.md.
// Prints: one line per module as it is read, then "N pictures of M screens, K blank, E page errors" and the folder. A picture that is all
// one color is blank and fails the run (exit code 1), as does a page error; a module the app does not know is named and stops the run with exit code 2, before any browser opens.
// --selftest (heavy: under the lock): one pre-K lesson (what-happens-next), one size (390x844), one theme (light), two seeds: the right
// number of pictures (at least one for each of the lesson's lines and each bank's two seeds, and every line and every question screen
// present), none blank, and the index lists each picture; it also proves a blank (all one color) picture is caught, and that --cover's
// seeds reach every answer of a small bank.
// -----------------------------------------------------------------------------------------------------------------
import { createRequire } from 'node:module';
import { execSync, spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, readdirSync, readFileSync, existsSync, rmSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PAGE = new URL('../tests/e2e/page.html', import.meta.url).href;

// Reads "1-6" or "1,4,9" or "3" into a list of seeds.
export function parseSeeds(text) {
  const out = []; for (const part of String(text).split(',')) { const m = /^(\d+)-(\d+)$/.exec(part.trim()); if (m) for (let s = +m[1]; s <= +m[2]; s++) out.push(s); else if (/^\d+$/.test(part.trim())) out.push(+part.trim()); else throw new Error('seeds look like 1-6 or 1,4,9: ' + text); }
  return [...new Set(out)];
}

// The seeds that make a bank deal every item of its table at least once (How item 6: "every item of its table is seen"). An item is a
// question as questionKey defines it (the setup, wording, picture and answer; the order of the choices does not make a new one), so a yes
// or no bank with sixteen pictures is sixteen items and takes at least sixteen seeds, where its two answers alone would take two. The
// keys over seeds 1 to UNIVERSE are the table. Seeds are kept in the order they first give something new, but the first seed of each
// answer comes first, so a cap met early still shows every answer before it shows a second picture of one. Returns the seeds, how many
// items and answers there are, and what was never reached (items past the cap or past seed UNIVERSE are counted in missedKeys).
export function coverSeeds(L, bank, cap = 40, universe = 2000) {
  const firstKey = new Map(); const firstAnswer = new Map();
  for (let s = 1; s <= universe; s++) { const q = L.generateQuestion(bank, s); const k = L.questionKey(q); const a = String(q.answer); if (!firstKey.has(k)) firstKey.set(k, s); if (!firstAnswer.has(a)) firstAnswer.set(a, s); }
  const chosen = new Set(); const order = [...firstAnswer.values()].sort((x, y) => x - y).concat([...firstKey.values()].sort((x, y) => x - y));
  for (const s of order) { if (chosen.size >= cap) break; chosen.add(s); }
  const seeds = [...chosen].sort((x, y) => x - y); const keysSeen = new Set(); const answersSeen = new Set();
  for (const s of seeds) { const q = L.generateQuestion(bank, s); keysSeen.add(L.questionKey(q)); answersSeen.add(String(q.answer)); }
  return { seeds, items: firstKey.size, answers: firstAnswer.size, missed: [...firstAnswer.keys()].filter((a) => !answersSeen.has(a)), missedKeys: firstKey.size - keysSeen.size };
}

// The scroll places of a page: the first at the top, each next one a little under a screen further (a sixth of the screen of overlap, so
// a line cut at the bottom of one picture opens the next), the last at the very bottom.
export function scrollPlaces(pageHeight, viewHeight) {
  const step = Math.max(1, Math.floor(viewHeight * 5 / 6)); const last = Math.max(0, pageHeight - viewHeight); const out = [0];
  while (out[out.length - 1] < last) out.push(Math.min(last, out[out.length - 1] + step));
  return out;
}

// True when a picture (a PNG's bytes) is all one color: every channel's smallest and largest value are the same.
export async function isBlank(sharp, buffer) { const { channels } = await sharp(buffer).stats(); return channels.every((c) => c.min === c.max); }

// Opens the page for each size and theme, steps through the modules, and writes the pictures and the index.
export async function lessonLook({ ids, out, sizes = ['390x844'], themes = ['light', 'dark'], seeds = [1, 2, 3], cover = false, coverCap = 40, lines = true, questions = true, log = console.log }) {
  const L = await import(new URL('../src/logic.mjs', import.meta.url).href);
  // A module id the app does not know stops the run before any browser opens, naming each (exit code 2 at the command line), so a
  // misspelled id never reads as "0 pictures of 0 screens" and a pass. Since pass NQ's F4 (round three's code read) it stops first,
  // before the page is looked for and before the out folder is made, and its line says no pictures were taken: until F4 the folder was
  // made, a tree with no page named the page and not the id, and each id was logged "(skipped)" though the run stopped.
  const mods = []; const unknown = []; for (const id of ids) { const m = L.getModule(id); if (!m) { log('unknown module ' + id + ' (no pictures taken)'); unknown.push(id); continue; } mods.push(m); }
  if (unknown.length) return { unknown, pictures: 0, screens: 0, blank: 0, problems: [], pageErrors: 0, modules: 0, items: [] };
  const G = execSync('npm root -g').toString().trim(); const req = createRequire(import.meta.url);
  const { chromium } = req(`${G}/playwright`); const sharp = req(`${G}/sharp`);
  if (!existsSync(fileURLToPath(PAGE))) throw new Error('tests/e2e/page.html is not built: run ./build.sh && node tests/e2e/make-page.mjs first (under the heavy lock)');
  mkdirSync(out, { recursive: true });
  // The seeds of each bank: the ones asked for, or the ones --cover chooses.
  const bankSeeds = new Map(); const coverNotes = [];
  for (const m of mods) for (const bank of m.generators || []) {
    if (cover) { const c = coverSeeds(L, bank, coverCap); bankSeeds.set(m.id + '/' + bank, c.seeds); coverNotes.push(`cover ${m.id}/${bank}: seeds ${c.seeds.join(', ')} (${c.seeds.length} seeds for ${c.items} items and ${c.answers} answers${c.missedKeys ? `; ${c.missedKeys} items left past the cap or past seed 2,000` : ''}${c.missed.length ? '; answers never reached: ' + c.missed.slice(0, 12).join(' | ') + (c.missed.length > 12 ? ` and ${c.missed.length - 12} more` : '') : ''})`); }
    else bankSeeds.set(m.id + '/' + bank, seeds);
  }
  coverNotes.forEach((n) => log(n));
  // What each module shows: its lines or page, then its questions, with the pictures of each (by size and theme) added as they are taken.
  const book = new Map(); const item = (mid, key, init) => { const k = mid + '\u0000' + key; if (!book.has(k)) book.set(k, { mid, key, ...init, pictures: [] }); return book.get(k); };
  const problems = []; let pictures = 0; let blank = 0; const screens = new Set(); const pageErrors = [];
  const levelOf = (m) => { const course = L.getCourse(m.courseId); const levelFor = { early: 'early', growing: 'elementary', teen: 'middle', grown: 'high' }; return L.LEVELS.find((lv) => lv.id === levelFor[L.stageForGrade(course.grade)]); };
  const browser = await chromium.launch();
  try {
    for (const size of sizes) for (const theme of themes) {
      const [width, height] = size.split('x').map(Number);
      const ctx = await browser.newContext({ viewport: { width, height }, hasTouch: true, reducedMotion: 'reduce' });
      await ctx.addInitScript((t) => { try { localStorage.setItem('edusphere_v1_theme', t); } catch (e) { /* no storage */ } }, theme);
      const page = await ctx.newPage(); page.on('pageerror', (e) => pageErrors.push(`${size} ${theme}: ${String(e).slice(0, 200)}`));
      await page.goto(PAGE); await page.addStyleTag({ content: 'body { margin: 0 !important; }' });
      const screenIs = (n) => page.waitForFunction((x) => window.__eduTest && window.__eduTest.screen === x, n, { timeout: 15000 });
      const settle = () => page.waitForFunction(() => !window.__eduSettleUntil || Date.now() >= window.__eduSettleUntil, null, { timeout: 5000 }).catch(() => {});
      const tapIf = async (name) => { const b = page.getByRole('button', { name, exact: true }); if (await b.count()) { await b.first().click({ force: true }); await page.waitForTimeout(250); return true; } return false; };
      await screenIs('welcome');
      await page.getByRole('button', { name: 'Create account', exact: true }).first().click(); await screenIs('educator-setup');
      await page.fill('input[placeholder="PIN"]', '2468'); await page.fill('input[placeholder="PIN again"]', '2468'); await page.fill('input[placeholder="This device\'s name"]', 'Look'); await page.selectOption('select[aria-label="Your state"]', 'TX');
      await page.getByRole('button', { name: 'Create account', exact: true }).click(); await screenIs('educator-pick'); await page.waitForTimeout(500);
      for (const n of ['Skip tour', 'Later', 'Got it']) await tapIf(n);
      // One picture for each scroll place of the screen as it stands: the picture of the viewport, never of the whole page.
      const shoot = async (stem) => {
        await settle(); await page.waitForTimeout(250);
        const dims = await page.evaluate(() => ({ h: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight), vh: window.innerHeight }));
        const names = [];
        for (const y of scrollPlaces(dims.h, dims.vh)) {
          await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y); await page.waitForTimeout(150);
          const buf = await page.screenshot({ fullPage: false }); const name = `${stem}__${size}__${theme}__y${y}.png`;
          writeFileSync(join(out, name), buf); pictures++; names.push(name);
          if (await isBlank(sharp, buf)) { blank++; problems.push(`blank picture: ${name}`); }
        }
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' })); screens.add(stem + '\u0000' + size + '\u0000' + theme);
        return names;
      };
      // The modules of one level are read in one walk-through.
      const byLevel = new Map(); for (const m of mods) { const lv = levelOf(m); if (!byLevel.has(lv.id)) byLevel.set(lv.id, { lv, list: [] }); byLevel.get(lv.id).list.push(m); }
      for (const { lv, list } of byLevel.values()) {
        await page.evaluate(() => window.__eduTest.goTo('educator-pick')); await page.waitForTimeout(300); for (const n of ['Skip tour', 'Later', 'Got it']) await tapIf(n);
        await settle(); await page.getByRole('button', { name: `Walk through ${lv.title.toLowerCase()}` }).first().click({ force: true }); await screenIs('overview'); await page.waitForTimeout(400);
        for (const m of list) {
          const stemBase = m.id;
          if (lines) {
            await page.evaluate(() => window.__eduTest.goTo('overview')); await screenIs('overview'); await page.waitForTimeout(200);
            await page.evaluate((id) => window.__eduTest.openModule(id), m.id); await screenIs('lesson'); await page.waitForTimeout(700);
            const stepOf = () => page.evaluate(() => [...document.querySelectorAll('[data-lesson-dots] span')].findIndex((s) => s.hasAttribute('data-lit')));
            const dots = await page.evaluate(() => document.querySelectorAll('[data-lesson-dots] span').length);
            if (dots > 0) {
              // A stepped lesson: each line, with its words from the screen, then Next.
              for (let i = 0; i < dots; i++) {
                for (let t = 0; t < 40 && (await stepOf()) !== i; t++) { if (t % 10 === 9) await page.locator('[data-lesson-nav] button[aria-label="Next"]').first().click({ force: true }).catch(() => {}); await page.waitForTimeout(100); }
                await page.waitForTimeout(250);
                if ((await stepOf()) !== i) { problems.push(`${m.id} line ${i + 1}: the page shows line ${(await stepOf()) + 1}`); continue; }
                const words = await page.evaluate(() => { const p = document.querySelector('[data-lesson-words]'); return p ? p.textContent.replace(/\s+/g, ' ').trim() : ''; });
                const it = item(m.id, `line-${String(i + 1).padStart(2, '0')}`, { order: i, title: `Lesson line ${i + 1} of ${dots}`, words }); it.pictures.push({ size, theme, names: await shoot(`${stemBase}__${it.key}`) });
                if (i < dots - 1) await page.locator('[data-lesson-nav] button[aria-label="Next"]').first().click({ force: true });
              }
            } else {
              // A lesson page: its words from the lesson itself.
              const words = [...(m.lesson.paragraphs || []).map((t) => t.replace(/\[\[(.*?)\]\]/g, '$1').replace(/\s+/g, ' ').trim()), m.lesson.keyIdea ? 'Key idea: ' + String(m.lesson.keyIdea).replace(/\s+/g, ' ') : ''].filter(Boolean).join(' / ');
              const it = item(m.id, 'line-01', { order: 0, title: 'Lesson page', words }); it.pictures.push({ size, theme, names: await shoot(`${stemBase}__${it.key}`) });
            }
          }
          if (questions) {
            for (const bank of m.generators || []) for (const seed of bankSeeds.get(m.id + '/' + bank)) {
              const shown = await page.evaluate(([g, s, id]) => window.__eduTest.showQuestion(g, s, id), [bank, seed, m.id]);
              if (!shown) { problems.push(`${m.id} ${bank} seed ${seed}: the page would not deal it`); continue; }
              await screenIs('practice'); await page.waitForTimeout(600);
              const q = await page.evaluate(() => { const x = window.__eduTest.question; return x ? JSON.parse(JSON.stringify(x)) : null; });
              const it = item(m.id, `q-${bank}-s${String(seed).padStart(4, '0')}`, { order: 1000 + (m.generators || []).indexOf(bank) * 100000 + seed, title: `Question ${bank}, seed ${seed}`, q: q ? { prompt: q.prompt, story: q.story || null, choices: q.choices || null, answer: q.answer } : null });
              it.pictures.push({ size, theme, names: await shoot(`${stemBase}__${it.key}`) });
            }
          }
          log(`read ${m.id} at ${size} ${theme}`);
        }
        await page.evaluate(() => window.__eduTest.goTo('overview')).catch(() => {}); await tapIf('Exit');
      }
      await ctx.close();
    }
  } finally { await browser.close(); }
  // The index: each module, each line or question with its words, and the pictures of each size and theme, in the order they were read.
  const md = [`# Lesson look`, '', `Modules: ${mods.map((m) => m.id).join(', ')}. Sizes: ${sizes.join(', ')}. Themes: ${themes.join(', ')}. ${cover ? `Seeds chosen by --cover (at most ${coverCap} a bank).` : `Seeds: ${seeds.join(', ')}.`} Motion off, touch on; one picture for each scroll place, never the whole page.`, ''];
  coverNotes.forEach((n) => md.push('- ' + n)); if (coverNotes.length) md.push('');
  for (const m of mods) {
    md.push(`## ${m.id}: ${m.title}`, '');
    for (const it of [...book.values()].filter((b) => b.mid === m.id).sort((a, b) => a.order - b.order)) {
      md.push(`### ${it.title}`, '');
      if (it.q) { md.push(`Prompt: ${it.q.prompt}`); if (it.q.story) md.push(`Story: ${it.q.story}`); if (it.q.choices) md.push(`Choices: ${it.q.choices.join(' | ')}`); md.push(`Answer: ${it.q.answer}`); }
      else md.push(`Words: ${it.words}`);
      md.push(''); for (const p of it.pictures) md.push(`- ${p.size} ${p.theme}: ${p.names.map((n) => `[${n.replace(/^.*__(y\d+)\.png$/, '$1')}](${n})`).join(', ')}`); md.push('');
    }
  }
  writeFileSync(join(out, 'index.md'), md.join('\n'));
  pageErrors.forEach((e) => problems.push('page error: ' + e));
  return { pictures, screens: screens.size, blank, problems, pageErrors: pageErrors.length, modules: mods.length, items: [...book.values()] };
}

// The self-test: one pre-K lesson, one size, one theme, two seeds, in a temporary folder.
async function selfTest() {
  let passed = 0, failed = 0; const ok = (name, cond, info) => { if (cond) { passed++; console.log('PASS - ' + name); } else { failed++; console.log('FAIL - ' + name + (info !== undefined ? '  ' + JSON.stringify(info).slice(0, 700) : '')); } };
  if (!existsSync(fileURLToPath(PAGE))) { console.log('FAIL - tests/e2e/page.html is not built: run ./build.sh && node tests/e2e/make-page.mjs under the heavy lock first'); console.log('\n0 passed, 1 failed'); return 1; }
  const G = execSync('npm root -g').toString().trim(); const sharp = createRequire(import.meta.url)(`${G}/sharp`);
  const L = await import(new URL('../src/logic.mjs', import.meta.url).href);
  // The pure parts first (no browser): the seeds, the scroll places, the blank test, and --cover on a small bank.
  ok('seeds read as ranges and lists', JSON.stringify(parseSeeds('1-3')) === '[1,2,3]' && JSON.stringify(parseSeeds('4,9,4')) === '[4,9]');
  ok('scroll places start at the top, step a little under a screen and end at the bottom', JSON.stringify(scrollPlaces(500, 844)) === '[0]' && JSON.stringify(scrollPlaces(2000, 844)) === '[0,703,1156]' && scrollPlaces(1688, 844).at(-1) === 844);
  const white = await sharp({ create: { width: 40, height: 40, channels: 3, background: '#ffffff' } }).png().toBuffer(); const two = await sharp({ create: { width: 40, height: 40, channels: 3, background: '#ffffff' } }).composite([{ input: { create: { width: 5, height: 5, channels: 3, background: '#000000' } }, left: 3, top: 3 }]).png().toBuffer();
  ok('a picture of one color is blank; one with a mark on it is not', (await isBlank(sharp, white)) === true && (await isBlank(sharp, two)) === false);
  const bank = 'p3-next-check'; const c = coverSeeds(L, bank, 40); const answers = new Set(c.seeds.map((s) => String(L.generateQuestion(bank, s).answer)));
  ok(`--cover's seeds (${c.seeds.join(', ')}) deal every answer of ${bank} (${c.answers} answers) and none is missed`, c.answers >= 2 && answers.size === c.answers && c.missed.length === 0, c);
  // A yes or no bank has two answers but many items (its pictures): covering answers alone is two seeds; covering its items is every one.
  const yn = 'p3-next-good'; const y = coverSeeds(L, yn, 40); const keysOf = (seeds) => new Set(seeds.map((s) => L.questionKey(L.generateQuestion(yn, s))));
  const allKeys = new Set(Array.from({ length: 2000 }, (_, i) => L.questionKey(L.generateQuestion(yn, i + 1))));
  const byAnswerOnly = []; { const seen = new Set(); for (let s = 1; s <= 2000; s++) { const a = String(L.generateQuestion(yn, s).answer); if (!seen.has(a)) { seen.add(a); byAnswerOnly.push(s); } } }
  ok(`--cover shows every item of a yes or no bank (${yn}: ${y.answers} answers, ${y.items} items, ${y.seeds.length} seeds chosen), where covering its answers alone takes ${byAnswerOnly.length} seeds and shows ${keysOf(byAnswerOnly).size} of the ${allKeys.size} items`, y.answers === 2 && y.items > 2 && keysOf(y.seeds).size === allKeys.size && y.missedKeys === 0 && keysOf(byAnswerOnly).size < allKeys.size, { y, allKeys: allKeys.size });
  const capped = coverSeeds(L, yn, 3); ok('a cap met early still shows every answer first and counts the items left', capped.seeds.length === 3 && capped.missed.length === 0 && capped.missedKeys === y.items - 3, capped);
  // An unknown module id stops with exit code 2 and names the id, in the library and at the command line, before the out folder is made,
  // its line saying no pictures were taken (pass NQ, F4).
  const badDir = mkdtempSync(join(tmpdir(), 'lesson-look-bad-')); const said = []; const bad = await lessonLook({ ids: ['no-such-module'], out: join(badDir, 'out'), log: (x) => said.push(x) });
  const badMade = existsSync(join(badDir, 'out')); rmSync(badDir, { recursive: true, force: true });
  const out2 = join(tmpdir(), 'lesson-look-bad2'); rmSync(out2, { recursive: true, force: true });
  const cli = spawnSync(process.execPath, [fileURLToPath(import.meta.url), 'no-such-module', 'what-happens-next-typo', '--out', out2], { encoding: 'utf8' }); const cliMade = existsSync(out2);
  ok('an unknown module id is named and the command exits 2, taking no pictures and making no folder, its line saying no pictures were taken', bad.unknown && bad.unknown[0] === 'no-such-module' && bad.pictures === 0 && !badMade && !cliMade
    && said.includes('unknown module no-such-module (no pictures taken)') && !said.some((x) => /skipped/.test(x)) && cli.status === 2 && /unknown module id: no-such-module, what-happens-next-typo/.test(cli.stdout), { status: cli.status, out: cli.stdout, said, badMade, cliMade });
  rmSync(out2, { recursive: true, force: true });
  // The browser part.
  const out = mkdtempSync(join(tmpdir(), 'lesson-look-')); const id = 'what-happens-next'; const m = L.getModule(id); const lines = m.lesson.script.length; const banks = m.generators.length;
  try {
    const t0 = Date.now(); const r = await lessonLook({ ids: [id], out, sizes: ['390x844'], themes: ['light'], seeds: [1, 2], log: () => {} });
    const files = readdirSync(out).filter((f) => f.endsWith('.png')); const index = readFileSync(join(out, 'index.md'), 'utf8');
    const lineIds = new Set(files.filter((f) => /__line-\d+__/.test(f)).map((f) => /__(line-\d+)__/.exec(f)[1])); const qIds = new Set(files.filter((f) => /__q-/.test(f)).map((f) => /__(q-[^_]+(?:-[^_]+)*-s\d+)__/.exec(f)[1]));
    ok(`one lesson (${id}, ${lines} lines, ${banks} banks), one size, one theme, two seeds: ${files.length} pictures of ${r.screens} screens (${lines} lines and ${banks * 2} questions), every line and every question present`, lineIds.size === lines && qIds.size === banks * 2 && r.screens === lines + banks * 2 && files.length >= r.screens && files.length === r.pictures, { lines: [...lineIds], qIds: [...qIds], screens: r.screens, files: files.length });
    ok('none of the pictures is blank, no page error, no problem', r.blank === 0 && r.pageErrors === 0 && r.problems.length === 0, r.problems);
    const names = files.filter((f) => !index.includes(f)); ok('the index lists every picture, with each line\'s words and each question\'s prompt and answer', names.length === 0 && (index.match(/^Words: .+/gm) || []).length === lines && (index.match(/^Prompt: .+/gm) || []).length === banks * 2 && (index.match(/^Answer: .+/gm) || []).length === banks * 2, { missing: names.slice(0, 5) });
    const sizes = await Promise.all(files.slice(0, 3).map(async (f) => (await sharp(join(out, f)).metadata()).width + 'x' + (await sharp(join(out, f)).metadata()).height));
    ok('each picture is the screen at its own size (390 by 844), not a whole page', sizes.every((s) => s === '390x844'), sizes);
    console.log(`  ${files.length} pictures in ${Math.round((Date.now() - t0) / 1000)} s`);
  } finally { rmSync(out, { recursive: true, force: true }); }
  console.log(`\n${passed} passed, ${failed} failed`);
  return failed ? 1 : 0;
}

if (process.argv[1] && process.argv[1].endsWith('lesson-look.mjs')) {
  const args = process.argv.slice(2);
  if (args.includes('--selftest')) process.exitCode = await selfTest();
  else {
    const opt = (name, dflt) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : dflt; };
    const valued = new Set(['--out', '--sizes', '--themes', '--seeds', '--cover-cap']); const ids = args.filter((a, i) => !a.startsWith('--') && !valued.has(args[i - 1]));
    const out = opt('--out', null);
    if (!ids.length || !out) { console.log('usage: node tools/lesson-look.mjs <moduleId ...> --out <dir> [--sizes 390x844,320x568] [--themes light,dark] [--seeds 1-6 | --cover] [--lines | --questions] | --selftest'); process.exitCode = 2; }
    else {
      const onlyLines = args.includes('--lines'); const onlyQuestions = args.includes('--questions');
      const r = await lessonLook({ ids, out, sizes: opt('--sizes', '390x844').split(','), themes: opt('--themes', 'light,dark').split(','), seeds: parseSeeds(opt('--seeds', '1-3')), cover: args.includes('--cover'), coverCap: Number(opt('--cover-cap', 40)), lines: !onlyQuestions || onlyLines, questions: !onlyLines || onlyQuestions });
      if (r.unknown && r.unknown.length) { console.log('unknown module id: ' + r.unknown.join(', ') + ' (no pictures taken)'); process.exitCode = 2; }
      else {
      r.problems.forEach((p) => console.log('PROBLEM - ' + p));
      console.log(`${r.pictures} pictures of ${r.screens} screens, ${r.blank} blank, ${r.pageErrors} page errors, in ${out}`);
      process.exitCode = r.problems.length ? 1 : 0;
      }
    }
  }
}
