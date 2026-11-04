// The Wise Human. Copyright (c) 2026. Source-available; not for reuse. See LICENSE.md.
// Every pre-K lesson line and question fits a short phone (pass MY, round one's screen check). Two words make one's last line put its
// Start practice star 22 pixels under a 375 by 667 phone's fold, with no scroll cue, and Check answer sat under the fold on every seed
// of two new banks, and no browser test read either: question-screens names its banks by hand, and the screen brief measured only
// what a pass changed. In plain terms: on a 375 by 667 phone, in the light theme and then the dark one, with the test page's voice
// on, every line of every read-aloud pre-K lesson is shown, and its Next button (the Start practice star on the last line) must end
// above the fold; and the first seed of every pre-K bank is shown, and Check answer must end above the fold (DESIGN: "Check answer
// never drops below the fold on a short phone."). Both themes, since neither is always the taller: the light theme's words sit a few
// pixels lower on some lines, and the dark theme's paper pads a picture four pixels each way, so 13 lines and banks sat under the
// fold in the dark theme alone (round two's code read, pass MY). A line or a bank that sat under the fold before this check waits by
// name in FOLD_WAITS with the lower of its two bottoms, so it fails if it moves lower, and a new one is held to the fold; a wait that
// names nothing the check reads, or a line now above the fold in both themes, fails too, so a fixed line drops its wait. A planted
// line and a planted question in each theme, each the first that ends within 120 pixels above the fold and is pushed 120 pixels down,
// so it crosses the fold, are caught (a push from higher up stays above the fold and proves nothing: the first bank ends at 480).
// Run: node tests/e2e/make-page.mjs && node tests/e2e/fold-check.mjs
import { createRequire } from 'node:module'; import { execSync } from 'node:child_process';
const G = execSync('npm root -g').toString().trim(); const { chromium } = createRequire(import.meta.url)(`${G}/playwright`);
const L = await import('../../src/logic.mjs');
const VH = 667;
// The lines and banks that sat under the fold when this check was written (pass MY: 86 lines of 40 lessons and 21 banks, in either
// theme, none of pass MX's or MY's lessons; 13 of them under it in the dark theme alone, round two's code read), by lesson and line
// (counted from 1) or by bank, each with the lower of its two bottoms in pixels; each waits for its lesson's next screen read (EARMARKS
// A80, the next pass's first work), and fails if it moves more than two pixels lower.
export const FOLD_WAITS = {
  'match-the-animals line 6': 706,
  'more-or-fewer line 12': 673,
  'first-marks line 4': 676,
  'three-dots line 4': 676, 'three-dots line 5': 676, 'three-dots line 6': 676,
  'big-and-little line 5': 807,
  'four-feelings line 1': 720, 'four-feelings line 8': 690,
  'one-more-one-fewer line 11': 739,
  'talk-with-a-friend line 8': 670, 'talk-with-a-friend line 11': 696,
  'voice-to-fit line 9': 684,
  'listen-and-tap-pictures line 12': 715,
  'animal-sounds line 10': 682,
  'two-steps-more line 3': 685,
  'learning-words line 2': 685, 'learning-words line 3': 685,
  'count-and-sort-words line 2': 691, 'count-and-sort-words line 5': 735, 'count-and-sort-words line 6': 681, 'count-and-sort-words line 8': 686, 'count-and-sort-words line 9': 751,
  'people-and-events line 1': 706, 'people-and-events line 2': 706, 'people-and-events line 3': 673, 'people-and-events line 4': 739, 'people-and-events line 5': 739, 'people-and-events line 7': 790,
  'things-that-happen line 2': 673,
  'colours line 1': 702, 'colours line 2': 682, 'colours line 3': 669, 'colours line 4': 669,
  'more-and-fewer-5 line 4': 676, 'more-and-fewer-5 line 11': 739,
  'first-strokes line 6': 673,
  'connect-the-dots line 5': 709, 'connect-the-dots line 6': 676, 'connect-the-dots line 7': 676,
  'draw-the-shapes line 2': 676, 'draw-the-shapes line 5': 676, 'draw-the-shapes line 6': 673,
  'taking-turns line 5': 673, 'taking-turns line 8': 673,
  'big-bigger-biggest line 2': 673,
  'helpers-all-around line 1': 752, 'helpers-all-around line 2': 758, 'helpers-all-around line 3': 791, 'helpers-all-around line 4': 774, 'helpers-all-around line 5': 794, 'helpers-all-around line 7': 673,
  'feelings-show line 6': 687, 'feelings-show line 11': 706, 'feelings-show line 13': 720,
  'how-friends-feel line 6': 690,
  'good-friend line 1': 723,
  'play-together line 8': 687,
  'say-it-to-fit line 9': 703, 'say-it-to-fit line 11': 684,
  'first-letter-tracing line 2': 709, 'first-letter-tracing line 3': 676, 'first-letter-tracing line 4': 676,
  'more-big-letters line 2': 676, 'more-big-letters line 3': 676, 'more-big-letters line 4': 676,
  'trace-straight-letters line 2': 676,
  'three-steps-more line 2': 720, 'three-steps-more line 6': 669,
  'more-learning-words line 1': 705, 'more-learning-words line 2': 768, 'more-learning-words line 3': 718, 'more-learning-words line 4': 718, 'more-learning-words line 5': 797,
  'sort-and-shape-words line 10': 817, 'sort-and-shape-words line 11': 751,
  'words-go-together line 6': 695,
  'opposites-and-same line 2': 718, 'opposites-and-same line 8': 956, 'opposites-and-same line 9': 723,
  'things-we-do line 1': 724, 'things-we-do line 2': 685, 'things-we-do line 6': 724,
  'voice-tells-more line 9': 775, 'voice-tells-more line 11': 684,
  'longer-sentences line 10': 682,
  'pm-same-animals': 670, 'p3-rhyme-tap': 691, 'p3-learn-match': 710, 'ps-find-match': 756, 'pm-same-vehicles': 704,
  'pm-different-vehicles': 702, 'pm-same-things': 756, 'pm-different-things': 746, 'pm-thing-part': 716, 'pm-same-water': 670,
  'pm-same-land': 670, 'p4-rhyme-pic': 756, 'p4-start-pic': 756, 'pl-trace-first': 679, 'pl-trace-more': 679,
  'pl-trace-ltf': 679, 'p4-steps-which': 676, 'p4-learn-pair': 710, 'p4-learn-three-yesno': 671, 'p4-learn-sort-rhyme': 712,
  'p4-group-odd': 714,
};
let passed = 0, failed = 0; const ok = (name, cond, info) => { if (cond) { passed++; console.log('PASS - ' + name); } else { failed++; console.log('FAIL - ' + name + (info !== undefined ? '  ' + JSON.stringify(info).slice(0, 900) : '')); } };
const over = (key, bottom) => bottom !== null && bottom > VH && !(FOLD_WAITS[key] !== undefined && bottom <= FOLD_WAITS[key] + 2);
// Every line and bank this check reads, with its bottom in each theme, so a wait is held to what is still under the fold.
const seen = new Map(); const note = (theme, key, bottom) => { if (!seen.has(key)) seen.set(key, {}); seen.get(key)[theme] = bottom; };
const early = L.COURSES.filter((c) => (c.grade === 'PK3' || c.grade === 'PK4') && c.readAloud);
const lessons = early.flatMap((c) => c.modules).filter((m) => m.lesson && Array.isArray(m.lesson.script) && m.lesson.script.length);
const banks = [...new Set(early.flatMap((c) => c.modules.flatMap((m) => m.generators)))];
const browser = await chromium.launch();
for (const theme of ['light', 'dark']) {
  const ctx = await browser.newContext({ viewport: { width: 375, height: VH }, hasTouch: true, reducedMotion: 'reduce' });
  await ctx.addInitScript((t) => { try { localStorage.setItem('edusphere_v1_theme', t); } catch (e) { /* no storage */ } }, theme);
  const page = await ctx.newPage();
  const errors = []; page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
  await page.goto(new URL('./page.html', import.meta.url).href);
  const screenIs = (n) => page.waitForFunction((x) => window.__eduTest && window.__eduTest.screen === x, n, { timeout: 15000 });
  const tapIf = async (name) => { const b = page.getByRole('button', { name, exact: true }); if (await b.count()) { await b.first().click({ force: true }); await page.waitForTimeout(250); return true; } return false; };
  await screenIs('welcome');
  await page.getByRole('button', { name: 'Create account', exact: true }).first().click(); await screenIs('educator-setup');
  await page.fill('input[placeholder="PIN"]', '2468'); await page.fill('input[placeholder="PIN again"]', '2468'); await page.fill('input[placeholder="This device\'s name"]', 'Fold'); await page.selectOption('select[aria-label="Your state"]', 'TX');
  await page.getByRole('button', { name: 'Create account', exact: true }).click(); await screenIs('educator-pick'); await page.waitForTimeout(500);
  for (const n of ['Skip tour', 'Later', 'Got it']) await tapIf(n);
  await page.getByLabel('Walk through early years').first().click({ force: true }); await screenIs('overview'); await page.waitForTimeout(400);
  // Which line shows: the one dot of the row drawn in its own color (the lesson's dots, one per line).
  const stepOf = () => page.evaluate(() => { const spans = [...document.querySelectorAll('[data-lesson-dots] span')]; if (spans.length < 2) return spans.length ? 0 : -1; const bg = spans.map((s) => s.style.background); const n = {}; for (const b of bg) n[b] = (n[b] || 0) + 1; return bg.findIndex((b) => n[b] === 1); });
  // Where a control ends on the page, in pixels from its top (null when it is not there).
  const bottomOf = (sel) => page.evaluate((s) => { const b = document.querySelector(s); if (!b) return null; const r = b.getBoundingClientRect(); return Math.round(r.bottom + window.scrollY); }, sel);
  const NAV = '[data-lesson-nav] button[aria-label="Next"], [data-lesson-nav] button[aria-label="Start practice"]';
  const CHECK = () => page.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Check answer'); if (!b) return null; const r = b.getBoundingClientRect(); return Math.round(r.bottom + window.scrollY); });
  // Every read-aloud pre-K lesson, line by line.
  const lineOff = []; const lineWaits = []; let linesRead = 0; let plantLine = null;
  for (const m of lessons) {
    await page.evaluate((id) => window.__eduTest.openModule(id), m.id); await screenIs('lesson'); await page.waitForTimeout(500);
    for (let i = 0; i < m.lesson.script.length; i++) {
      for (let t = 0; t < 40 && (await stepOf()) !== i; t++) { if (t % 10 === 9) await page.locator('[data-lesson-nav] button[aria-label="Next"]').first().click({ force: true }).catch(() => {}); await page.waitForTimeout(100); }
      await page.waitForTimeout(150);
      const key = `${m.id} line ${i + 1}`; const bottom = await bottomOf(NAV); linesRead += bottom === null ? 0 : 1; note(theme, key, bottom);
      if (over(key, bottom)) lineOff.push(`${key}: ${bottom}`); else if (bottom > VH) lineWaits.push(key);
      // The plant, once, on the first line whose Next ends within 120 pixels above the fold: its card pushed 120 pixels down puts the
      // Next under the fold, and the check must catch it.
      if (plantLine === null && bottom !== null && bottom > VH - 120 && bottom <= VH - 10) {
        plantLine = await page.evaluate(() => { const card = document.querySelector('.edu-rise'); if (!card) return null; const d = document.createElement('div'); d.style.height = '120px'; card.prepend(d); return true; });
        const pushed = await bottomOf(NAV); plantLine = plantLine && over('planted line', pushed); await page.evaluate(() => { const card = document.querySelector('.edu-rise'); if (card && card.firstChild && card.firstChild.style && card.firstChild.style.height === '120px') card.firstChild.remove(); });
      }
      if (i < m.lesson.script.length - 1) await page.locator('[data-lesson-nav] button[aria-label="Next"]').first().click({ force: true }).catch(() => {});
    }
  }
  ok(`every line of every read-aloud pre-K lesson ends its Next, or its Start practice star, above a 375 by 667 phone's fold in the ${theme} theme (${linesRead} lines of ${lessons.length} lessons read; ${lineWaits.length} older lines waiting by name; a line pushed 120 pixels down caught)`, lineOff.length === 0 && linesRead >= 800 && plantLine === true, { lineOff, plantLine });
  // Every pre-K bank's first seed, as its own lesson asks it.
  const bankOff = []; const bankWaits = []; let banksRead = 0; const skipped = []; let plantBank = null;
  for (const g of banks) {
    const home = early.flatMap((c) => c.modules).find((m) => m.generators.includes(g));
    await page.evaluate(([gen, mid]) => window.__eduTest.showQuestion(gen, 1, mid), [g, home.id]); await screenIs('practice'); await page.waitForTimeout(350);
    const bottom = await CHECK();
    if (bottom === null) { const q = await page.evaluate(() => window.__eduTest.question && window.__eduTest.question.type); skipped.push(`${g} (${q})`); continue; }
    banksRead += 1; const key = g; note(theme, key, bottom);
    if (over(key, bottom)) bankOff.push(`${key}: ${bottom}`); else if (bottom > VH) bankWaits.push(key);
    // The plant, once, on the first bank whose Check answer ends within 120 pixels above the fold: its question pushed 120 pixels down
    // puts Check answer under the fold, and the check must catch it.
    if (plantBank === null && bottom > VH - 120 && bottom <= VH - 10) {
      await page.evaluate(() => { const t = document.querySelector('[data-question-text]'); if (t) { const d = document.createElement('div'); d.style.height = '120px'; d.setAttribute('data-plant', ''); t.before(d); } });
      plantBank = over('planted question', await CHECK()); await page.evaluate(() => { const d = document.querySelector('[data-plant]'); if (d) d.remove(); });
    }
  }
  // A bank skipped has no Check answer: a tracing kind, which the child finishes by drawing.
  const notTrace = skipped.filter((s) => !/\(trace\)$/.test(s));
  ok(`every pre-K bank's Check answer ends above a 375 by 667 phone's fold in the ${theme} theme (${banksRead} banks read, ${skipped.length} tracing banks with no Check answer passed over; ${bankWaits.length} older banks waiting by name; a question pushed 120 pixels down caught)`, bankOff.length === 0 && notTrace.length === 0 && banksRead >= 300 && plantBank === true, { bankOff, notTrace, plantBank });
  ok(`no page error while the lessons and questions were shown in the ${theme} theme`, errors.length === 0, errors.slice(0, 3));
  await ctx.close();
}
// A wait names a line or bank this check reads that is still under the fold in a theme (round two's code read: a wait for a line that
// was fixed, or a key mistyped, never failed); a wait for a lesson that is not there is planted.
const unknownOf = (waits) => Object.keys(waits).filter((k) => !seen.has(k));
const stale = Object.keys(FOLD_WAITS).filter((k) => seen.has(k) && Object.values(seen.get(k)).every((b) => b === null || b <= VH));
const plantedWait = unknownOf({ ...FOLD_WAITS, 'no-such-lesson line 1': 700 }).length === unknownOf(FOLD_WAITS).length + 1;
ok(`every wait names a line or bank this check reads that is still under the fold in a theme (${Object.keys(FOLD_WAITS).length} waits; a wait for a lesson that is not there caught)`, unknownOf(FOLD_WAITS).length === 0 && stale.length === 0 && plantedWait, { unknown: unknownOf(FOLD_WAITS), stale });
// FOLD_REPORT=<file> writes every line and bank under the fold in either theme, with its bottom in each, for a reader filling FOLD_WAITS.
if (process.env.FOLD_REPORT) { const { writeFileSync } = await import('node:fs'); writeFileSync(process.env.FOLD_REPORT, JSON.stringify(Object.fromEntries([...seen].filter(([, b]) => Object.values(b).some((x) => x !== null && x > VH))), null, 1)); }
await browser.close();
console.log(`\n${passed} passed, ${failed} failed`);
process.exitCode = failed ? 1 : 0;
