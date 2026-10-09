// The Wise Human. Copyright (c) 2026. Source-available; not for reuse. See LICENSE.md.
// Game breaks, elective stories and an early learner's Let's Read, walked in the real page (pass MB, from Mikey's notes).
// In plain terms: a made-up educator adds one early-years student, a test-only hook gives her a pre-K 4 course finished a few
// days ago, and the walk then plays as the child (Let's Read, the course's story read twice, a game and a picture) and checks
// the educator's report: the coloring line, then the game line and the elective story line in Mikey's words, each under the
// same short faint rule. The second read of the story waits the real STORY_REREAD_SECONDS, so this walk takes about a minute.
import { createRequire } from 'node:module'; import { pathToFileURL } from 'node:url'; import { execSync } from 'node:child_process';
const G = execSync('npm root -g').toString().trim(); const { chromium } = createRequire(import.meta.url)(`${G}/playwright`);
const L = await import('../../src/logic.mjs'); const ST = await import('../../src/stories.mjs');
const FINISH = 'first-steps-pk';   // an Early years student's pre-K 4 course with a long story (pre-K 3's courses are not assigned at that level)
const storyTitle = L.titleCase(ST.COURSE_STORIES[FINISH].title);
let passed = 0, failed = 0; const ok = (name, cond, info) => { if (cond) { passed++; console.log('PASS - ' + name); } else { failed++; console.log('FAIL - ' + name + (info ? '  ' + JSON.stringify(info).slice(0, 400) : '')); } };
const shots = process.argv[2] || null;
const browser = await chromium.launch(); const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, reducedMotion: 'reduce' });
const errors = []; page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
await page.goto(pathToFileURL(new URL('./page.html', import.meta.url).pathname).href);
const screen = () => page.evaluate(() => window.__eduTest && window.__eduTest.screen);
const screenIs = (n) => page.waitForFunction((x) => window.__eduTest && window.__eduTest.screen === x, n, { timeout: 15000 });
const text = async () => (await page.evaluate(() => document.body.innerText)).replace(/\s+/g, ' ');
const snap = async (name) => { if (shots) await page.screenshot({ path: `${shots}/${name}.png`, fullPage: true }); };
const tapIf = async (name) => { const b = page.getByRole('button', { name, exact: true }); if (await b.count()) { await b.first().click(); await page.waitForTimeout(300); return true; } return false; };
// An educator and one early-years student with First Steps finished three and two days ago.
await page.getByRole('button', { name: 'Create account', exact: true }).first().click(); await screenIs('educator-setup');
await page.fill('input[placeholder="PIN"]', '2468'); await page.fill('input[placeholder="PIN again"]', '2468'); await page.fill('input[placeholder="This device\'s name"]', 'Walk'); await page.selectOption('select[aria-label="Your state"]', 'TX');
await page.getByRole('button', { name: 'Create account', exact: true }).click(); await screenIs('educator-pick'); await page.waitForTimeout(500);
await tapIf('Skip tour'); await tapIf('Later'); await tapIf('Got it');
await page.getByRole('button', { name: 'Add someone new' }).first().click(); await page.waitForTimeout(300);
await page.fill('input[placeholder="School-issued ID"]', 'S-55'); await page.getByRole('button', { name: /^Early years/ }).first().click(); await page.waitForTimeout(200);
await page.getByRole('button', { name: 'Add', exact: true }).click(); await page.waitForTimeout(500); await tapIf('Later');
const seeded = await page.evaluate((id) => window.__eduTest.seedHistory('S-55', { finish: id }), FINISH);
ok('the hook finishes First Steps for S-55', seeded && seeded.finished === FINISH, seeded);
// The child's side: an early learner sees Let's Read once a course's story is open (pass LI's list; an early return hid it until pass MB).
await page.getByRole('button', { name: 'Home' }).first().click(); await page.waitForTimeout(500);
await page.getByRole('button', { name: /S-55$/ }).first().click(); await page.waitForTimeout(900); await tapIf('Later');
ok('the student lands on her courses', (await screen()) === 'overview', await screen());
const fold = page.getByRole('button', { name: "Let's Read", exact: true });
ok("an early learner with a finished course sees Let's Read", (await fold.count()) === 1);
if (await fold.count()) { await fold.first().click(); await page.waitForTimeout(400); }
let t = await text(); await snap('1-lets-read');
ok('it lists only the open story, with no locked row, no count of modules and no unlocked count', t.includes(storyTitle) && !/\bLocked\b/.test(t) && !/modules? to go/.test(t) && !/\d+ of \d+ unlocked/.test(t), t.slice(t.indexOf("Let's Read"), t.indexOf("Let's Read") + 300));
// The first read is the one the course asks for; the second, read to the end after STORY_REREAD_SECONDS, is elective.
await page.getByRole('button', { name: 'Read', exact: true }).first().click(); await screenIs('course-story'); await page.waitForTimeout(500);
await page.locator('[data-story-end]').scrollIntoViewIfNeeded(); await page.waitForTimeout((L.STORY_REREAD_SECONDS + 3) * 1000);   // read to the end: still the read the course asks for
await page.getByRole('button', { name: 'Back to my courses' }).first().click(); await screenIs('overview'); await page.waitForTimeout(400);
if ((await page.getByRole('button', { name: 'Read again', exact: true }).count()) === 0 && (await fold.count())) { await fold.first().click(); await page.waitForTimeout(400); }
ok('after the first read the row offers Read again', (await page.getByRole('button', { name: 'Read again', exact: true }).count()) === 1);
const readAgain = async () => {
  if ((await page.getByRole('button', { name: 'Read again', exact: true }).count()) === 0 && (await fold.count())) { await fold.first().click(); await page.waitForTimeout(400); }
  await page.getByRole('button', { name: 'Read again', exact: true }).first().click(); await screenIs('course-story'); await page.waitForTimeout(500);   // past the settle-scroll (pass JK)
};
const backToCourses = async () => { await page.getByRole('button', { name: 'Back to my courses' }).first().click(); await screenIs('overview'); await page.waitForTimeout(300); };
const longEnough = (L.STORY_REREAD_SECONDS + 3) * 1000;
// Read again to the end and stay long enough: counted.
await readAgain(); await page.locator('[data-story-end]').scrollIntoViewIfNeeded(); await page.waitForTimeout(longEnough); await backToCourses();
// Read again and stay long enough without reaching the end: not counted.
await readAgain();
const endShown = await page.evaluate(() => { const r = document.querySelector('[data-story-end]').getBoundingClientRect(); return r.top < window.innerHeight; });
await page.waitForTimeout(longEnough); await backToCourses();
// Read again to the end and leave at once: not counted.
await readAgain(); await page.locator('[data-story-end]').scrollIntoViewIfNeeded(); await page.waitForTimeout(1500); await backToCourses();
// A game and a picture, each opened and closed: one game break and one coloring break.
await page.evaluate(() => window.__eduTest.openColoring('play:dots-house')); await screenIs('coloring'); await page.waitForTimeout(500);
await page.getByRole('button', { name: 'Close game' }).click(); await screenIs('overview'); await page.waitForTimeout(400);
await page.evaluate(() => window.__eduTest.openColoring('ball')); await screenIs('coloring'); await page.waitForTimeout(500);
await page.getByRole('button', { name: 'Close coloring' }).click(); await screenIs('overview'); await page.waitForTimeout(400);
// The educator's report: the three lines, each under the short faint rule, in Mikey's words with the student's name.
await page.evaluate(() => window.__eduTest.goHome()); await screenIs('educator-pick'); await page.waitForTimeout(500); await tapIf('Got it');
await page.getByRole('button', { name: 'Open report' }).first().click(); await screenIs('educator-report'); await page.waitForTimeout(600);
const lines = await page.locator('[data-summary-play]').evaluateAll((els) => els.map((e) => ({ key: e.getAttribute('data-summary-play'), text: e.textContent, whole: !!e.querySelector('[data-summary-name]') && getComputedStyle(e.querySelector('[data-summary-name]')).whiteSpace === 'nowrap' && e.querySelector('[data-summary-name]').textContent === 'S-55', ruleAbove: !!(e.previousElementSibling && e.previousElementSibling.hasAttribute('data-summary-rule')) })));
await snap('2-report-summary');
ok('the summary shows the coloring, game and story lines in that order', lines.map((x) => x.key).join() === 'coloring,games,stories', lines);
ok('each line sits under the same short faint rule', lines.length === 3 && lines.every((x) => x.ruleAbove), lines);
ok("the game line is Mikey's, with the count", (lines.find((x) => x.key === 'games') || {}).text === "Game breaks taken: 1. Playing is still learning as concepts are woven into objectives but these are never marked on a student's transcript.", lines);
ok("the story line is Mikey's, counting one elective read by name (not the first read, a read that never reached the end, or one left at once)", !endShown && (lines.find((x) => x.key === 'stories') || {}).text === "Elective stories: 1. Every module pairs with a short story and every course with a long. After these stories unlock, they're available to re-read. 1 represents how many times S-55 has read through a story more times than required.", { endShown, lines });
ok("the student's name never breaks at its hyphen", (lines.find((x) => x.key === 'stories') || {}).whole === true, lines);
ok('the coloring line still reads as before', (lines.find((x) => x.key === 'coloring') || {}).text === 'Coloring breaks taken: 1. Coloring is play; it is never marked and never appears on the transcript.', lines);
ok('no page errors along the way', errors.length === 0, errors);
await browser.close();
console.log(`\n${passed} passed, ${failed} failed`);
process.exitCode = failed ? 1 : 0;   // never process.exit() (CLAUDE.md, 2026-09-23)
