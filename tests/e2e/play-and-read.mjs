// The Wise Human. Copyright (c) 2026. Source-available; not for reuse. See LICENSE.md.
// Game breaks, elective stories and an early learner's Let's Read, walked in the real page (pass MB, from Mikey's notes).
// In plain terms: a made-up educator adds one early-years student, a test-only hook gives her a pre-K 4 course finished a few
// days ago, and the walk then plays as the child (Let's Read, the course's story read twice, a game and a picture) and checks
// the educator's report: the coloring line, then the game line and the elective story line in Mikey's words, each under the
// same short faint rule. The second read of the story waits the real STORY_REREAD_SECONDS, and since pass MF the walk takes
// about three minutes (check.sh allows seven).
import { createRequire } from 'node:module'; import { fileURLToPath } from 'node:url'; import { execSync } from 'node:child_process'; import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
const G = execSync('npm root -g').toString().trim(); const { chromium } = createRequire(import.meta.url)(`${G}/playwright`);
const L = await import('../../src/logic.mjs'); const ST = await import('../../src/stories.mjs');
const FINISH = 'first-steps-pk';   // an Early years student's pre-K 4 course with a long story (pre-K 3's courses are not assigned at that level)
const storyTitle = L.titleCase(ST.COURSE_STORIES[FINISH].title);
let passed = 0, failed = 0; const ok = (name, cond, info) => { if (cond) { passed++; console.log('PASS - ' + name); } else { failed++; console.log('FAIL - ' + name + (info ? '  ' + JSON.stringify(info).slice(0, 400) : '')); } };
const shots = process.argv[2] || null;
const browser = await chromium.launch(); const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, reducedMotion: 'reduce' });
const errors = []; page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
await page.goto(new URL('./page.html', import.meta.url).href);
const screen = () => page.evaluate(() => window.__eduTest && window.__eduTest.screen);
const screenIs = (n) => page.waitForFunction((x) => window.__eduTest && window.__eduTest.screen === x, n, { timeout: 15000 });
const text = async () => (await page.evaluate(() => document.body.innerText)).replace(/\s+/g, ' ');
const snap = async (name) => { if (shots) await page.screenshot({ path: `${shots}/${name}.png`, fullPage: true }); };
const tapIf = async (name) => { const b = page.getByRole('button', { name, exact: true }); if (await b.count()) { await b.first().click(); await page.waitForTimeout(300); return true; } return false; };
const settle = () => page.waitForFunction(() => !window.__eduSettleUntil || Date.now() >= window.__eduSettleUntil, null, { timeout: 5000 }).catch(() => {});
// Opens a lesson and passes its round, answering by the page's own question object; a trace question (a memory check from a
// tracing lesson a finished course has among its stars) is drawn along its strokes by the test hook (pass ME).
const passRound = async (id) => {
  await page.evaluate((m) => window.__eduTest.openModule(m), id); await screenIs('lesson');
  for (let i = 0; i < 25 && !(await page.getByLabel('Start practice').count()); i++) { await settle(); await page.getByLabel('Next').click(); }
  await settle(); await page.getByLabel('Start practice').click(); await screenIs('practice');
  for (let i = 0; i < 30; i++) {
    const st = await page.evaluate(() => ({ screen: window.__eduTest.screen, q: window.__eduTest.question })); if (st.screen !== 'practice') break;
    await settle();
    if (st.q.type === 'trace') await page.evaluate(() => window.__eduTest.traceWell());
    else { const byValue = page.locator(`button[data-choice="${String(st.q.answer).replace(/"/g, '\\"')}"]`); if (await byValue.count()) await byValue.first().click(); else await page.getByRole('button', { name: st.q.answer, exact: true }).first().click(); }
    await page.getByRole('button', { name: 'Check answer' }).click();
    const btn = page.getByRole('button', { name: /Next question|See results/ }); const label = await btn.textContent(); await btn.click();
    if (label.includes('See results')) break;
  }
  await screenIs('result'); await page.waitForTimeout(300); };
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
// Pass MC: a pre-reader's Let's Play explains with pictures, so the line about locked games never shows for her.
{ const play = page.getByRole('button', { name: "Let's Play", exact: true });
  if (await play.count()) { await play.first().click(); await page.waitForTimeout(300); }
  ok("an early learner's Let's Play shows no sentence about locked games, though a locked tile shows", (await play.count()) === 1 && (await page.locator('[data-play-note]').count()) === 0 && (await page.getByRole('button', { name: 'Locked game' }).count()) >= 1);
  if (await play.count()) { await play.first().click(); await page.waitForTimeout(200); }
  if ((await fold.count()) && (await fold.first().getAttribute('aria-expanded')) !== 'true') { await fold.first().click(); await page.waitForTimeout(300); } }
// The first read is the one the course asks for; the second, read to the end after STORY_REREAD_SECONDS, is elective. Since pass
// ME (Mikey's answer to Q17) an early learner opens the course's story with a gold book named for the story, and the story reads
// itself aloud on the self-reading page with one way home (pass MF, Mikey's answer to Q22), since pass MG a Return Home button
// across the bottom (Mikey: "No home icon, just a home button across the bottom"), which goes home.
const hearIt = `Hear ${storyTitle}`; const hearAgain = `Hear ${storyTitle} again`;
ok("the course's story is a gold book named for it, not a worded Read button", (await page.getByRole('button', { name: hearIt, exact: true }).count()) === 1 && (await page.getByRole('button', { name: 'Read', exact: true }).count()) === 0);
await page.evaluate(() => { window.__spoken = []; });
await page.getByRole('button', { name: hearIt, exact: true }).first().click(); await screenIs('course-story'); await page.waitForTimeout(700);
ok("opened from the shelf, the course's story reads itself aloud on the self-reading page with one way home across the bottom and no Back to my courses or Keep going", (await page.locator('[data-read-aloud-story="shelf"][data-course-story-page]').count()) === 1 && (await page.getByLabel('Return Home').count()) === 1 && (await page.getByLabel('Keep going').count()) === 0 && (await page.getByRole('button', { name: 'Back to my courses' }).count()) === 0 && (await page.evaluate(() => window.__spoken[0])) === `${ST.COURSE_STORIES[FINISH].title}.`, await page.evaluate(() => window.__spoken.slice(0, 2)));
await page.locator('[data-story-end]').scrollIntoViewIfNeeded(); await page.waitForTimeout((L.STORY_REREAD_SECONDS + 3) * 1000);   // read to the end: still the read the course asks for
await page.getByLabel('Return Home').first().click(); await screenIs('overview'); await page.waitForTimeout(400);
if ((await page.getByRole('button', { name: hearAgain, exact: true }).count()) === 0 && (await fold.count())) { await fold.first().click(); await page.waitForTimeout(400); }
ok('after the first read the book offers the story again', (await page.getByRole('button', { name: hearAgain, exact: true }).count()) === 1);
const readAgain = async () => {
  if ((await page.getByRole('button', { name: hearAgain, exact: true }).count()) === 0 && (await fold.count())) { await fold.first().click(); await page.waitForTimeout(400); }
  await page.getByRole('button', { name: hearAgain, exact: true }).first().click(); await screenIs('course-story'); await page.waitForTimeout(500);   // past the settle-scroll (pass JK)
};
const backToCourses = async () => { await page.getByLabel('Return Home').first().click(); await screenIs('overview'); await page.waitForTimeout(300); };
const longEnough = (L.STORY_REREAD_SECONDS + 3) * 1000;
// Two test voices: the page's own ends every line in thirty milliseconds; the slow one takes 400 and reports speaking and
// pending the way a device's does (pass MD), so a reading can be stopped before the page has followed it to the end.
const fastVoice = () => page.evaluate(() => { Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: { cancel() {}, getVoices() { return []; }, speak(u) { window.__spoken.push(u.text); (window.__rates = window.__rates || []).push(u.rate); setTimeout(() => { if (u.onend) u.onend({}); }, 30); } } }); });
const slowVoice = () => page.evaluate(() => { const q = []; let cur = null; let timer = null; window.__spoken = []; window.__rates = [];
  const next = () => { cur = q.shift() || null; if (!cur) return; const mine = cur; timer = setTimeout(() => { if (cur !== mine) return; cur = null; if (mine.onend) mine.onend({}); if (!cur) next(); }, 400); };
  Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: { get speaking() { return !!cur; }, get pending() { return q.length > 0; }, cancel() { q.length = 0; if (timer) clearTimeout(timer); cur = null; }, getVoices() { return []; }, speak(u) { window.__spoken.push(u.text); window.__rates.push(u.rate); q.push(u); if (!cur) next(); } } }); });
// Read again to the end and stay long enough: counted.
await readAgain(); await page.locator('[data-story-end]').scrollIntoViewIfNeeded(); await page.waitForTimeout(longEnough); await backToCourses();
// Read again, stop the voice at once, and stay long enough without reaching the end: not counted. (Since pass ME the page reads
// itself and follows the voice down the story, so a reading left to run reaches the end by itself, which is a read to the end.)
await slowVoice(); await readAgain(); await page.waitForFunction(() => window.__spoken.length > 0, null, { timeout: 5000 }); await page.evaluate(() => window.speechSynthesis.cancel()); await page.waitForTimeout(2600);   // the page's voice watch ends a reading that went quiet; a tap on Stop reading would scroll the page to the button, under the last paragraph
const endShown = await page.evaluate(() => { const r = document.querySelector('[data-story-end]').getBoundingClientRect(); return r.top < window.innerHeight; });
await page.waitForTimeout(longEnough); await backToCourses(); await fastVoice();
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
// Pass MC: an Elementary student on day one sees Pong open, her own courses' games locked, and the line that says how they open,
// in its strip and readable (the screen check measured the line at 2.74 to 1 when it sat on the moving wash).
await page.evaluate(() => window.__eduTest.goHome()); await screenIs('educator-pick'); await page.waitForTimeout(400); await tapIf('Got it');
await page.getByRole('button', { name: 'Add someone new' }).first().click(); await page.waitForTimeout(300);
await page.fill('input[placeholder="School-issued ID"]', 'S-56'); await page.getByRole('button', { name: /^Elementary/ }).first().click(); await page.waitForTimeout(200);
await page.getByRole('button', { name: 'Add', exact: true }).click(); await page.waitForTimeout(500); await tapIf('Later');
await page.getByRole('button', { name: 'Home' }).first().click(); await page.waitForTimeout(500);
await page.getByRole('button', { name: /S-56$/ }).first().click(); await page.waitForTimeout(900); await tapIf('Later');
{ const play = page.getByRole('button', { name: "Let's Play", exact: true });
  if (await play.count()) { await play.first().click(); await page.waitForTimeout(400); }
  const note = page.locator('[data-play-note]');
  const seen = (await note.count()) === 1 && (await note.isVisible());
  const measured = seen ? await note.evaluate((el) => {
    const rgb = (s) => (s.match(/[\d.]+/g) || []).map(Number); const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
    const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
    const fg = rgb(getComputedStyle(el).color); const bg = rgb(getComputedStyle(el.closest('[data-play-strip]')).backgroundColor);
    const a = lum(fg), b = lum(bg); return { text: el.textContent, ratio: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05), inWash: !!el.closest('.edu-colorwash') }; }) : null;
  // Since pass MM (Q45) the line says what opens the locked tiles by stage: an Elementary student's courses are grade 3 and up,
  // whose games wait for every star.
  ok('an Elementary student on day one sees the line under Let\'s Play, in its strip, off the wash, at 4.5 to 1 or better, saying mastering opens her courses\' games', seen && measured && measured.text === 'Mastering every module within a course unlocks a new game.' && !measured.inWash && measured.ratio >= 4.5, measured);
  ok('Pong is open on her first day and her courses\' games wait', (await page.getByRole('button', { name: 'Play Pong' }).count()) === 1 && (await page.getByRole('button', { name: 'Locked game' }).count()) >= 3); }
// Pass MD (Mikey: "They can play after the lesson as a reward like you mentioned."): a lesson story heard as a round's reward
// waits in an early learner's Let's Read, after the course stories, newest first (round one of the checks), each a gold book
// that names its story, and opened from there it reads itself aloud, its arrow resting while the voice reads, and its one big
// arrow goes home.
{ const HEARD = ['colours', 'same-and-different'];   // heard in this order, so same-and-different is the newest
  await page.evaluate(() => window.__eduTest.goHome()); await screenIs('educator-pick'); await page.waitForTimeout(400); await tapIf('Got it');
  const seededHeard = await page.evaluate((ids) => window.__eduTest.seedHistory('S-55', { heard: ids }), HEARD);
  ok('the hook marks two First Steps lesson stories as heard', seededHeard && (seededHeard.heard || []).length === 2, seededHeard);
  await page.getByRole('button', { name: 'Home' }).first().click(); await page.waitForTimeout(500);
  await page.getByRole('button', { name: /S-55$/ }).first().click(); await page.waitForTimeout(900); await tapIf('Later');
  const fold2 = page.getByRole('button', { name: "Let's Read", exact: true });
  if ((await fold2.count()) && (await fold2.first().getAttribute('aria-expanded')) !== 'true') { await fold2.first().click(); await page.waitForTimeout(400); }
  const rows = await page.locator('[data-heard-story]').evaluateAll((els) => els.map((e) => e.getAttribute('data-heard-story')));
  await snap('3-heard-stories');
  const books = await page.locator('[data-heard-story] button').evaluateAll((els) => els.map((b) => b.getAttribute('aria-label')));
  ok("an early learner's Let's Read lists the heard lesson stories newest first, each a gold book naming its story", rows.join() === 'same-and-different,colours' && books.join('|') === [ST.STORIES['same-and-different'].title, ST.STORIES.colours.title].map((t) => `Hear ${L.titleCase(t)} again`).join('|') && (await page.locator('[data-heard-note]').count()) === 1, { rows, books });
  // The arrow rests while the voice reads and invites a tap once it stops (the screen check: the test voice ends each line in
  // thirty milliseconds, so no walk ever saw it rest). A slower voice, with the speaking and pending flags of a real one.
  await slowVoice();
  await page.locator('[data-heard-story="colours"] button').click(); await screenIs('story');
  const pulsing = () => page.locator('[data-story-next] button').evaluate((b) => b.classList.contains('edu-pulse'));
  const restingAtOnce = !(await pulsing()); await page.waitForTimeout(1300);
  const said = await page.evaluate(() => window.__spoken.slice());
  ok('opened from the shelf, the lesson story reads itself aloud, its title first, with one big arrow and no Practice this', said[0] === `${ST.STORIES.colours.title}.` && (await page.locator('[data-read-aloud-story="shelf"]').count()) === 1 && (await page.getByLabel('Keep going').count()) === 1 && (await page.getByRole('button', { name: 'Practice this' }).count()) === 0, said.slice(0, 2));
  ok('its arrow rests from the first moment and while the voice reads, with no cue to scroll', restingAtOnce && !(await pulsing()) && (await page.locator('[data-scroll-cue]').count()) === 0 && (await page.getByRole('button', { name: 'Stop reading' }).count()) === 1);
  await page.getByRole('button', { name: 'Stop reading' }).click(); await page.waitForTimeout(400);
  ok('stopped, the arrow invites a tap, and the round speaker can read it again', (await pulsing()) && (await page.getByRole('button', { name: 'Read the story to me' }).count()) === 1);
  // The voice's own end brings the pulse back too (the screen check's second read: a stop tap proves nothing about the end a
  // voice reports), and so does a pace change in the middle of a reading.
  await page.getByRole('button', { name: 'Read the story to me' }).click(); await page.waitForTimeout(600);
  const readingAgain = !(await pulsing()) && (await page.getByRole('button', { name: 'Stop reading' }).count()) === 1;
  const spokenBefore = await page.evaluate(() => window.__spoken.length);
  // A pre-K 3 story starts on the snail, and a tap on the pace already set does nothing (pass MH), so the other pace is tapped and
  // the sentence in the voice's mouth is said again at the new rate (the code check's second read).
  const slowNow = await page.evaluate(() => document.querySelector('button[aria-label="Read slowly"]').getAttribute('aria-pressed') === 'true');
  await page.getByLabel(slowNow ? 'Read at the usual speed' : 'Read slowly').click(); await page.waitForTimeout(400);
  // The sentence in the voice's mouth is said again from its start, three quarters as fast (the code check: no rate was read).
  const paced = await page.evaluate((n0) => { const s = window.__spoken; const r = window.__rates; const t = s[n0]; const k = s.indexOf(t); return { t, then: r[k], now: r[n0], k, n0 }; }, spokenBefore);
  // Since pass MH (Mikey: "the story should continue to read but the speed should adjust in real time.  Not stop the audio.") a
  // pace change in the middle of a reading goes on reading at the new pace: the arrow keeps resting and the speaker still stops.
  ok('a pace change in the middle of a reading keeps reading at the new pace, the arrow still resting', readingAgain && !(await pulsing()) && (await page.getByRole('button', { name: 'Stop reading' }).count()) === 1 && !!paced.t && paced.k < paced.n0 && Math.abs(paced.now / paced.then - (slowNow ? 1 / 0.75 : 0.75)) < 0.02, paced);
  await page.getByRole('button', { name: 'Stop reading' }).click(); await page.waitForTimeout(400);
  await page.getByRole('button', { name: 'Read the story to me' }).click(); await page.waitForTimeout(600);
  const restsWhileReading = !(await pulsing());
  await page.waitForFunction(() => !!document.querySelector('button[aria-label="Read the story to me"]'), null, { timeout: 20000 });
  await page.waitForTimeout(300);
  ok('when the voice finishes by itself the arrow invites a tap', restsWhileReading && (await pulsing()));
  await page.getByLabel('Keep going').click(); await screenIs('overview');
  ok('its arrow goes home', (await screen()) === 'overview'); await fastVoice();
  // The surprise-me book (pass MF, Mikey's answer to Q18, "good idea"): with two heard stories, one more gold book with a star
  // reads one of them, and the next tap reads the other, never the same one twice running.
  const openFold = async () => { const f = page.getByRole('button', { name: "Let's Read", exact: true }); if ((await f.count()) && (await f.first().getAttribute('aria-expanded')) !== 'true') { await f.first().click(); await page.waitForTimeout(400); } };
  await openFold();
  const surpriseBook = page.locator('[data-surprise-book] button');
  ok("with two heard stories the shelf offers a surprise-me book, a gold book with a star, named for what it does", (await surpriseBook.count()) === 1 && (await surpriseBook.getAttribute('aria-label')) === 'Surprise me with a story' && (await page.locator('[data-surprise-book] [data-book-star]').count()) === 1);
  // Its row has a picture where every story row has one (pass MG, Mikey: "It can just be a bunch overlapping question marks"):
  // four question marks the app draws, each in a color of its own, overlapping on the paper, the picture for good since pass MH.
  { const pic = await page.evaluate(() => { const p = document.querySelector('[data-surprise-book] [data-surprise-picture]'); if (!p) return null; const marks = [...p.querySelectorAll('[data-question-mark]')]; const colors = new Set(marks.map((m) => m.querySelectorAll('path')[1].getAttribute('stroke'))); const boxes = marks.map((m) => m.getBoundingClientRect()); const overlap = boxes.some((a, i) => boxes.some((b, j) => i < j && a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom)); const r = p.getBoundingClientRect(); const story = document.querySelector('[data-heard-story] > div'); return { state: p.getAttribute('data-surprise-picture'), marks: marks.length, colors: colors.size, overlap, w: Math.round(r.width), storyW: story ? Math.round(story.getBoundingClientRect().width) : 0, first: p.parentElement.firstElementChild === p }; });
    ok('the surprise row shows its picture first, as big as a story row\'s: four overlapping question marks in four colors', !!pic && pic.state === 'drawn' && pic.marks === 4 && pic.colors === 4 && pic.overlap && pic.w >= 52 && pic.w === pic.storyW && pic.first, pic); }
  const surprised = [];
  for (let k = 0; k < 3; k++) {
    await openFold(); await settle(); await surpriseBook.click(); await screenIs('story'); await page.waitForTimeout(400);
    surprised.push(await page.evaluate(() => window.__eduTest.moduleId));
    ok(`the surprise book reads a heard story on the self-reading page (tap ${k + 1})`, HEARD.includes(surprised[k]) && (await page.locator('[data-read-aloud-story="shelf"]').count()) === 1, surprised);
    await settle(); await page.getByLabel('Keep going').click(); await screenIs('overview'); await page.waitForTimeout(300);
  }
  ok('three taps never read the same story twice running, so with two heard stories they alternate', surprised[0] !== surprised[1] && surprised[1] !== surprised[2], surprised);
  // Pass MI (Mikey: "The surprise me book to read should always be at the top of the book list."): its row heads the list,
  // above the course's own story and every heard story.
  await openFold();
  const order = await page.evaluate(() => [...document.querySelectorAll('[data-surprise-book], [data-long-story-row], [data-heard-story]')].map((r) => (r.hasAttribute('data-surprise-book') ? 'surprise' : r.hasAttribute('data-long-story-row') ? 'long' : 'heard')));
  ok('the Surprise me book is the first row of the book list, above the long story and the heard stories', order[0] === 'surprise' && order.includes('long') && order.includes('heard'), order);
  // Pass MI (Mikey: "When selecting a book from let's read and selecting the forward arrow to finish, we should still be at the
  // same place on the page where we clicked the book,  not back to the top of the page where the modules are."): a heard story
  // opened from partway down the page, and the story's arrow comes back to the book where it was.
  { const book = page.locator('[data-heard-story="colours"] button');
    await book.evaluate((b) => b.scrollIntoView({ block: 'center' })); await page.waitForTimeout(300);
    const before = await page.evaluate(() => ({ y: Math.round(window.scrollY), top: Math.round(document.querySelector('[data-heard-story="colours"]').getBoundingClientRect().top) }));
    await settle(); await book.click(); await screenIs('story'); await page.waitForTimeout(500);
    await settle(); await page.getByLabel('Keep going').click(); await screenIs('overview'); await page.waitForTimeout(800);
    const after = await page.evaluate(() => { const r = document.querySelector('[data-heard-story="colours"]'); return { y: Math.round(window.scrollY), top: r ? Math.round(r.getBoundingClientRect().top) : null }; });
    ok("the story's arrow comes back to the same place on the page, the book where it was tapped", before.y > 200 && after.top !== null && Math.abs(after.top - before.top) <= 4, { before, after }); }
  // The device's back from a book Let's Read opened keeps the place too (pass MI, the alignment read; fromShelf since the second read).
  { const book = page.locator('[data-heard-story="colours"] button');
    await book.evaluate((b) => b.scrollIntoView({ block: 'center' })); await page.waitForTimeout(300);
    const before = await page.evaluate(() => ({ y: Math.round(window.scrollY), top: Math.round(document.querySelector('[data-heard-story="colours"]').getBoundingClientRect().top) }));
    await settle(); await book.click(); await screenIs('story'); await page.waitForTimeout(500);
    await page.goBack().catch(() => {}); await screenIs('overview'); await page.waitForTimeout(800);
    const after = await page.evaluate(() => { const r = document.querySelector('[data-heard-story="colours"]'); return r ? Math.round(r.getBoundingClientRect().top) : null; });
    ok("the device's back from a book Let's Read opened comes back to the same place too", before.y > 200 && after !== null && Math.abs(after - before.top) <= 4, { before, after }); }
  // The cover shelf (Q18, the other suggestion): once every story of a course's group is painted, the group shows as covers to
  // tap, each named like its row was; with one painting missing the rows stay. The page learns which paintings it has from
  // window.__eduArt (the build lists art/stories), so the walk lists the two stories' pictures there and serves a tiny image.
  // The page is a file, so a routed response never reaches it: two small pictures are written beside the page for the walk
  // (tests/e2e/art/stories, removed again at the end, and on any exit), the way the real art/stories folder sits beside index.html.
  const arts = HEARD.map((id) => ST.STORIES[id].art); const savedArt = await page.evaluate(() => (Array.isArray(window.__eduArt) ? window.__eduArt.slice() : []));
  // fileURLToPath keeps a folder with a space in its name whole (iCloud Drive's; the pass MC lesson), and the folder is cleared
  // first, in case a run was killed before it could clean up. A kill by check.sh's timeout sends SIGTERM: bare Node then skips
  // its exit handlers, and Playwright's own listener closes the browser, so the walk exits on SIGTERM itself and its exit
  // handler runs whatever else is listening (the code checks). .gitignore and the delivery zips leave tests/e2e/art out.
  const artRoot = fileURLToPath(new URL('./art/', import.meta.url)); const artDir = fileURLToPath(new URL('./art/stories/', import.meta.url));
  const cleanArt = () => { try { rmSync(artRoot, { recursive: true, force: true }); } catch (e) { /* nothing to remove */ } };
  cleanArt(); mkdirSync(artDir, { recursive: true }); process.on('exit', cleanArt); process.on('SIGTERM', () => process.exit(143));
  const sharp = createRequire(import.meta.url)(`${G}/sharp`);
  for (const [i, serial] of arts.entries()) await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240"><rect width="320" height="240" fill="${i ? '#CFE8F7' : '#F7E3C9'}"/><circle cx="${i ? 90 : 230}" cy="80" r="40" fill="#F2C94C"/><path d="M0 240 L0 170 Q160 120 320 180 L320 240 Z" fill="#7CC3A6"/></svg>`)).webp().toFile(`${artDir}/${serial}.webp`);
  await page.evaluate((a) => { window.__eduArt = [a[0]]; }, arts);
  await page.getByRole('button', { name: "Let's Read", exact: true }).first().click(); await page.waitForTimeout(200); await openFold();
  ok('with one of the two paintings missing the group keeps its rows', (await page.locator('[data-heard-covers]').count()) === 0 && (await page.locator('[data-heard-story]').count()) === 2);
  await page.evaluate((a) => { window.__eduArt = a; }, arts);
  await page.getByRole('button', { name: "Let's Read", exact: true }).first().click(); await page.waitForTimeout(200); await openFold();
  const coverLabels = await page.locator('[data-heard-covers] [data-heard-story] button').evaluateAll((els) => els.map((b) => b.getAttribute('aria-label')));
  // The pictures themselves must load (the screen check: they are lazy and below the fold, so counting img elements would pass
  // with a wrong path): scroll them into view and wait for each to have its width.
  await page.locator('[data-heard-covers]').scrollIntoViewIfNeeded();
  const loaded = await page.waitForFunction(() => { const ims = [...document.querySelectorAll('[data-heard-covers] img')]; return ims.length === 2 && ims.every((im) => im.complete && im.naturalWidth > 0); }, null, { timeout: 8000 }).then(() => true).catch(() => false);
  await snap('3b-cover-shelf');
  ok('with every painting in the group the shelf shows covers, one tap each, named like the rows were, newest first, each picture loaded', (await page.locator('[data-heard-covers]').count()) === 1 && coverLabels.join('|') === [ST.STORIES['same-and-different'].title, ST.STORIES.colours.title].map((t) => `Hear ${L.titleCase(t)} again`).join('|') && loaded && (await page.locator('[data-heard-covers] .edu-breathe').count()) === 2, { coverLabels, loaded });
  // Two covers to a row on a 360-pixel phone, the width most browser checks use, and five on a laptop (the screen checks: one to a
  // row at 140 pixels, four at 130). An auto-fill grid lists every track it made, empty ones too, so the count is read from it.
  const tracks = () => page.locator('[data-cover-grid]').evaluate((g) => getComputedStyle(g).gridTemplateColumns.split(' ').length);
  await page.setViewportSize({ width: 360, height: 780 }); await page.waitForTimeout(400);
  const tops = await page.locator('[data-heard-covers] [data-heard-story]').evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().top)));
  const at360 = await tracks();
  await page.setViewportSize({ width: 1280, height: 800 }); await page.waitForTimeout(400); const at1280 = await tracks();
  ok('the covers sit two to a row at 360 pixels wide and five at 1280', tops.length === 2 && tops[0] === tops[1] && at360 === 2 && at1280 === 5, { tops, at360, at1280 });
  await page.setViewportSize({ width: 390, height: 844 }); await page.waitForTimeout(300);
  await settle(); await page.locator('[data-heard-covers] [data-heard-story="colours"] button').click(); await screenIs('story'); await page.waitForTimeout(300);
  ok('a cover opens its story on the self-reading page', (await page.evaluate(() => window.__eduTest.moduleId)) === 'colours' && (await page.locator('[data-read-aloud-story="shelf"]').count()) === 1);
  await settle(); await page.getByLabel('Keep going').click(); await screenIs('overview'); await page.waitForTimeout(300);
  // The drawn question marks are the Surprise me picture for good (pass MH, Mikey: "I actually like the question marks you drew for
  // the surprise me section.  We can keep those instead of Leonard prompt"): U1 is retired, so even a file of that name in the
  // painting list leaves the drawing in place. The Let's Read tap closes the fold and openFold opens it again, so the picture
  // mounts afresh (the code check's second read in pass MG).
  await page.evaluate((a) => { window.__eduArt = [...a, 'U1']; }, arts);
  await page.getByRole('button', { name: "Let's Read", exact: true }).first().click(); await page.waitForTimeout(200); await openFold();
  await page.locator('[data-surprise-book]').scrollIntoViewIfNeeded();
  const keptDrawn = await page.waitForFunction(() => { const p = document.querySelector('[data-surprise-picture]'); return !!p && p.getAttribute('data-surprise-picture') === 'drawn' && p.querySelectorAll('[data-question-mark]').length === 4 && !p.querySelector('img'); }, null, { timeout: 4000 }).then(() => true).catch(() => false);
  ok("the Surprise me row keeps its drawn question marks for good, whatever the painting list says (U1 retired, pass MH)", keptDrawn);
  await page.evaluate((a) => { window.__eduArt = a; }, savedArt); cleanArt(); }
// A course finished live (pass ME, Mikey's answer to Q17): an early learner one star short of First Steps passes its last lesson.
// The result says the whole course is done; the lesson's own story comes first, as the round's reward; then the course-finished
// page, with its confetti and star, its spoken line, the big gold book and the way home (pass MF, Mikey's answer to Q22: "Home
// and it can be a button that says Return Home"), since pass MG one wide button across the bottom with no drawing (Mikey: "No
// home icon, just a home button across the bottom"); the book reads the course's story aloud on the self-reading page (since
// pass ML its next story, The shadow on the tent, since this is the last star's celebration), and that page's button goes home,
// where the next course's open lesson waits. Afterwards the shelf offers both long stories, and a round on a lesson that
// already had its star celebrates nothing.
{ await page.evaluate(() => window.__eduTest.goHome()); await screenIs('educator-pick'); await page.waitForTimeout(400); await tapIf('Got it');
  await page.getByRole('button', { name: 'Add someone new' }).first().click(); await page.waitForTimeout(300);
  await page.fill('input[placeholder="School-issued ID"]', 'S-57'); await page.getByRole('button', { name: /^Early years/ }).first().click(); await page.waitForTimeout(200);
  await page.getByRole('button', { name: 'Add', exact: true }).click(); await page.waitForTimeout(500); await tapIf('Later');
  const almost = await page.evaluate((id) => window.__eduTest.seedHistory('S-57', { almost: id }), FINISH);
  ok('the hook leaves First Steps one star short for S-57', !!almost && almost.almost === FINISH && !!almost.lastLesson, almost);
  await page.getByRole('button', { name: 'Home' }).first().click(); await page.waitForTimeout(500);
  await page.getByRole('button', { name: /S-57$/ }).first().click(); await page.waitForTimeout(900); await tapIf('Later');
  await page.evaluate(() => { window.__spoken = []; });
  await passRound(almost.lastLesson);
  const t2 = await text();
  ok('the round that earns the last star says the whole course is done, and its arrow is the book of the lesson story never heard', t2.includes('Well done! That was the whole course.') && t2.includes('Next: ') && (await page.getByLabel('Hear your story').count()) === 1, t2.slice(0, 200));
  await settle(); await page.getByLabel('Hear your story').click(); await screenIs('story'); await page.waitForTimeout(500); await settle();
  await page.getByLabel('Keep going').click(); await screenIs('course-done'); await page.waitForTimeout(900);
  const courseTitle = L.titleCase(L.getCourse(FINISH).title);
  const cheer = await page.evaluate(() => ({ confetti: document.querySelectorAll('.edu-confetti').length, star: !!document.querySelector('.edu-land-star'), labels: [...document.querySelectorAll('button')].map((b) => b.getAttribute('aria-label')).filter(Boolean), said: window.__spoken.join(' '), words: document.querySelector('[data-course-done]') ? document.querySelector('[data-course-done]').textContent : '', page: document.body.innerText.replace(/\s+/g, ' ') }));
  await snap('4-course-done');
  // Since pass MH the last star is the second celebration: a child who hears it hears every star (the first, every lesson passed,
  // came on an earlier day in the seeded history). Since pass ML First Steps has its next long story (The shadow on the tent), so
  // this celebration opens it, said as a new story (celebrationStory), and its book is the next story of First Steps.
  const cheerSaid = `Hooray! You earned every star in ${courseTitle}! Here is a new story. Tap the gold book to hear it, or tap the green button at the bottom to go home.`;
  ok('the course-finished page shows its confetti and star, names the course aloud as it opens and says what the two taps do, and offers the big gold book of the next story and the way home, with only Back and the speaker beside them', cheer.confetti >= 24 && cheer.star && cheer.said.includes(cheerSaid) && cheer.labels.join('|') === `Back|Say it again|Hear the next story of ${courseTitle}|Return Home` && cheer.words.includes(`Hooray! You earned every star in ${courseTitle}!`) && cheer.words.includes('Here is a new story.'), cheer);
  ok('the book wears Hear the story under it and the way home says Return Home (Mikey, Q22: a button that says Return Home)', cheer.page.includes('Hear the story') && cheer.page.includes('Return Home') && !cheer.labels.includes('Keep going'), cheer.page.slice(0, 300));
  // The way home (pass MG, Mikey: "No home icon, just a home button across the bottom"): one wide button, words and no drawing,
  // the page's last control, under the book and across the card's width; the book stays the prominent round tap above it.
  const home = await page.evaluate(() => { const b = document.querySelector('[data-course-done-home]'); const book = document.querySelector('[data-course-story-book]'); const cardEl = document.querySelector('[data-course-done]'); const r = b.getBoundingClientRect(); const k = book.getBoundingClientRect(); const c = cardEl.getBoundingClientRect(); const all = [...document.querySelectorAll('button')].filter((x) => x.offsetParent); return { wide: r.width, card: c.width, below: r.top >= k.bottom, last: all[all.length - 1] === b, drawing: b.querySelectorAll('svg').length, text: b.textContent.trim(), book: k.width }; });
  ok('the way home is one wide button across the bottom, with words and no drawing, under the prominent gold book', home.text === 'Return Home' && home.drawing === 0 && home.wide >= home.card - 2 && home.below && home.last && home.book >= 100, home);
  await page.evaluate(() => { window.__spoken = []; });
  await page.locator('[data-course-story-book]').click(); await screenIs('course-story'); await page.waitForTimeout(1200);
  const saidCs = await page.evaluate(() => window.__spoken.slice());
  ok("the book opens the course's next story, which reads itself aloud from its title on the self-reading page, with the same way home and no arrow", saidCs[0] === `${ST.MASTERY_STORIES[FINISH].title}.` && (await page.locator('[data-read-aloud-story="reward"][data-course-story-page]').count()) === 1 && (await page.getByLabel('Return Home').count()) === 1 && (await page.getByLabel('Keep going').count()) === 0 && (await page.getByRole('button', { name: 'Back to my courses' }).count()) === 0, saidCs.slice(0, 2));
  await settle(); await page.getByLabel('Return Home').click(); await page.waitForTimeout(900);
  const after = await screen();
  // The celebration ends at home (pass MF, Mikey's answer to Q22), where the course the result named (Next: First Sounds and
  // Letters) waits with its first lesson open to start, by the page's own statuses: finishing First Steps switches on the grade 1
  // Numbers course too, locked behind kindergarten, and that one must not be the course the result named.
  const nextCourse = L.getCourse('first-sounds-pk'); const nextFirst = [...nextCourse.modules].sort((a, b) => a.order - b.order)[0];
  const landed = await page.evaluate(() => ({ module: window.__eduTest.moduleId, visible: window.__eduTest.visibleModuleIds() }));
  ok("the story's Return Home button goes home, where the next course's first lesson is open to start", after === 'overview' && landed.visible.includes(nextFirst.id), { after, landed });
  ok('the result had named that course, the first open one, never the locked course the finish switched on', t2.includes(`Next: ${L.titleCase(nextCourse.title)}.`), t2.slice(0, 200));
  await page.evaluate(() => window.__eduTest.goTo('overview')); await page.waitForTimeout(600);
  const fold3 = page.getByRole('button', { name: "Let's Read", exact: true });
  if ((await fold3.count()) && (await fold3.first().getAttribute('aria-expanded')) !== 'true') { await fold3.first().click(); await page.waitForTimeout(400); }
  const shelf = await page.locator('[data-course-story-book], [data-mastery-story-book], [data-heard-story] button').evaluateAll((bs) => bs.map((b) => b.getAttribute('aria-label')));
  ok("afterwards the shelf offers both long stories as gold books, the first not yet heard and the next one again, and the reward story heard today is the newest lesson story", shelf[0] === hearIt && shelf[1] === `Hear ${L.titleCase(ST.MASTERY_STORIES[FINISH].title)} again` && shelf[2] === `Hear ${L.titleCase(ST.STORIES[almost.lastLesson].title)} again`, shelf);
  await passRound(almost.lastLesson);
  const again = await text();
  ok('a round on a lesson that already had its star shows a plain well done, and its arrow goes on without a second celebration', !again.includes('whole course') && (await page.getByLabel('Keep going').count()) === 1, again.slice(0, 120));
  await settle(); await page.getByLabel('Keep going').click(); await page.waitForTimeout(700);
  // By now the finish has switched on the grade 1 Numbers course (locked), so this arrow proves the pick skips a locked course.
  ok('no second celebration for a finished course, and the arrow moves on to an open lesson (the grade 1 course the finish switched on is locked and skipped)', (await screen()) === 'lesson' && (await page.evaluate(() => window.__eduTest.moduleId)) === nextFirst.id, { screen: await screen(), module: await page.evaluate(() => window.__eduTest.moduleId) });
  // The confetti: with motion on, no piece sits on the card's top edge waiting (the screen check's fix) and the pieces move; with
  // motion off every piece lies still (no animation) and the page still works.
  await page.evaluate(() => window.__eduTest.goTo('course-done')); await screenIs('course-done'); await page.waitForTimeout(300);
  const still = await page.locator('.edu-confetti').evaluateAll((els) => ({ n: els.length, none: els.every((e) => getComputedStyle(e).animationName === 'none'), untransformed: els.filter((e) => getComputedStyle(e).transform === 'none').length }));
  await page.emulateMedia({ reducedMotion: 'no-preference' }); await page.waitForTimeout(400);
  const moving = await page.locator('.edu-confetti').evaluateAll((els) => { const read = () => els.map((e) => getComputedStyle(e).transform); const a = read(); return new Promise((done) => setTimeout(() => { const b = read(); done({ animated: els.every((e) => getComputedStyle(e).animationName !== 'none'), edge: els.filter((e) => getComputedStyle(e).transform === 'none' && getComputedStyle(e).opacity !== '0').length, changed: a.filter((t, i) => t !== b[i]).length }); }, 300)); });
  await page.emulateMedia({ reducedMotion: 'reduce' }); await page.waitForTimeout(200);
  ok('with motion off the confetti lies still, and with motion on it falls with no piece lining the top edge', still.n >= 24 && still.none && still.untransformed === 0 && moving.animated && moving.edge === 0 && moving.changed > 0, { still, moving });
  // The end of the shower (the screen check's second read): each piece's animation runs a finite number of times, and jumped
  // past its end, no piece is left showing inside the card (with fill mode backwards in place of both, they would line the top
  // edge again once their showers were over).
  await page.emulateMedia({ reducedMotion: 'no-preference' }); await page.waitForTimeout(300);
  const ended = await page.evaluate(() => { const card = document.querySelector('[data-course-done]').getBoundingClientRect(); const anims = document.getAnimations().filter((a) => a.effect && a.effect.target && a.effect.target.classList && a.effect.target.classList.contains('edu-confetti')); const finite = anims.every((a) => Number.isFinite(a.effect.getComputedTiming().iterations)); for (const a of anims) { const t = a.effect.getComputedTiming(); a.currentTime = t.endTime + 100; } const pieces = [...document.querySelectorAll('.edu-confetti')]; const showing = pieces.filter((e) => { const r = e.getBoundingClientRect(); return Number(getComputedStyle(e).opacity) > 0.05 && r.bottom > card.top && r.top < card.bottom && r.right > card.left && r.left < card.right; }).length; return { anims: anims.length, finite, showing }; });
  await page.emulateMedia({ reducedMotion: 'reduce' }); await page.waitForTimeout(200);
  ok('every confetti shower ends, and once it has, no piece is left showing on the card', ended.anims >= 24 && ended.finite && ended.showing === 0, ended); }
// A last star earned by a Quick Review (pass ME, the code check): a child whose last First Steps lesson was moved past clears its
// fresh try at the start of the day; the review's result goes on to the celebration page once, and that page's Return Home button goes
// home, where the day's second review waits.
{ await page.evaluate(() => window.__eduTest.goHome()); await screenIs('educator-pick'); await page.waitForTimeout(400); await tapIf('Got it');
  await page.getByRole('button', { name: 'Add someone new' }).first().click(); await page.waitForTimeout(300);
  await page.fill('input[placeholder="School-issued ID"]', 'S-59'); await page.getByRole('button', { name: /^Early years/ }).first().click(); await page.waitForTimeout(200);
  await page.getByRole('button', { name: 'Add', exact: true }).click(); await page.waitForTimeout(500); await tapIf('Later');
  // Two reviews are due today: the moved lesson's fresh try (older, so first) and a starred lesson's first look back.
  const moved = await page.evaluate((id) => window.__eduTest.seedHistory('S-59', { movedLast: id, movedDays: 30, due: 1 }), FINISH);
  ok('the hook leaves First Steps with its last lesson moved past for S-59, and a second review due', !!moved && moved.movedLast === FINISH && !!moved.lastLesson && moved.due.length === 1, moved);
  await page.getByRole('button', { name: 'Home' }).first().click(); await page.waitForTimeout(500);
  await page.getByRole('button', { name: /S-59$/ }).first().click(); await page.waitForTimeout(900); await tapIf('Later');
  ok('her day opens on two quick look backs', (await page.locator('[data-light-review-count="2"]').count()) === 1 && (await page.getByRole('button', { name: 'Start', exact: true }).count()) === 1);
  const clearReview = async () => {
    for (let k = 0; k < 8 && (await screen()) === 'practice'; k++) {
      const q = await page.evaluate(() => window.__eduTest.question); if (!q) break;
      await settle();
      if (q.type === 'trace') await page.evaluate(() => window.__eduTest.traceWell()); else await page.locator(`button[data-choice="${String(q.answer).replace(/"/g, '\\"')}"]`).first().click();
      await page.waitForTimeout(150); await tapIf('Check answer');
      const next = page.getByRole('button', { name: /Next question|See results|Finish/ }).first(); if (await next.count()) { await next.click(); await page.waitForTimeout(250); }
    }
    await page.waitForTimeout(500); };
  await page.getByRole('button', { name: 'Start', exact: true }).click(); await page.waitForTimeout(500);
  const firstReviewed = await page.evaluate(() => window.__eduTest.moduleId);
  await clearReview();
  ok('the fresh try comes first and clears from its own result screen, whose button is Next, the second review waiting', firstReviewed === moved.lastLesson && (await screen()) === 'light-review-result' && (await page.locator('[data-light-review-result="clear"]').count()) === 1 && (await page.getByRole('button', { name: 'Next', exact: true }).count()) === 1, { firstReviewed, screen: await screen() });
  await page.evaluate(() => { window.__spoken = []; });
  await settle(); await page.getByRole('button', { name: 'Next', exact: true }).click(); await page.waitForTimeout(900);
  const courseTitle = L.titleCase(L.getCourse(FINISH).title);
  const said = await page.evaluate(() => window.__spoken.join(' '));
  ok("the star it earned was the course's last, so the celebration page comes before the second review, naming the course (the second read: it used to wait behind Next and never show)", (await screen()) === 'course-done' && said.includes(`You earned every star in ${courseTitle}!`), { screen: await screen(), said: said.slice(0, 120) });
  await settle(); await page.getByLabel('Return Home').click(); await page.waitForTimeout(700);
  ok("its Return Home button goes home, where the day's second review waits", (await screen()) === 'overview' && (await page.locator('[data-light-review-count="1"]').count()) === 1, { screen: await screen(), cards: await page.locator('[data-light-review-card]').count() });
  await page.getByRole('button', { name: 'Start', exact: true }).click(); await page.waitForTimeout(500); await clearReview();
  ok('the second review clears and goes home without a second celebration', (await screen()) === 'light-review-result' && (await page.getByRole('button', { name: 'Back to my lessons' }).count()) === 1);
  await settle(); await page.getByRole('button', { name: 'Back to my lessons' }).click(); await page.waitForTimeout(700);
  ok('back on her lessons, nothing celebrates again', (await screen()) === 'overview', await screen());
  // That lesson's own story was never earned (it was moved past before a pass), so this first passed round offers it as the
  // round's reward, and the story's arrow goes on without a second celebration: the star the review earned stands.
  await passRound(moved.lastLesson);
  const bookNow = (await page.getByLabel('Hear your story').count()) === 1;
  if (bookNow) { await settle(); await page.getByLabel('Hear your story').click(); await screenIs('story'); await page.waitForTimeout(500); }
  await settle(); await page.getByLabel('Keep going').click(); await page.waitForTimeout(700);
  ok("a first passed round on that lesson afterwards offers its own story as the reward and celebrates no second time: the star the review earned stands, and the story's arrow goes on", bookNow && !['course-done', 'result', 'story'].includes(await screen()), { bookNow, screen: await screen() }); }
// A reader's finished course (pass MF, Mikey's answer to Q21: "reader too but don't need the print"): the Elementary student
// S-56, one star short of How Computers Think (tech-3, three tap-answer lessons with a long story), passes its last lesson. Her
// result says the whole course is done and offers Celebrate!, once; the celebration page names the course on its card without
// speaking unasked (a reader's screens never talk unless asked), its gold book reads Read the story, its button across the
// bottom reads Return Home, the book opens the reader's story page with no Print link and Return Home at both ends, the end one
// the same wide button (pass MG, the screen check), and that goes home.
{ const READER = 'tech-3';
  await page.evaluate(() => window.__eduTest.goHome()); await screenIs('educator-pick'); await page.waitForTimeout(400); await tapIf('Got it');
  const almostR = await page.evaluate((id) => window.__eduTest.seedHistory('S-56', { almost: id }), READER);
  ok("the hook leaves the reader's course one star short for S-56", !!almostR && almostR.almost === READER && !!almostR.lastLesson, almostR);
  await page.getByRole('button', { name: 'Home' }).first().click(); await page.waitForTimeout(500);
  await page.getByRole('button', { name: /S-56$/ }).first().click(); await page.waitForTimeout(900); await tapIf('Later');
  // A reader's lesson offers View story, then Practice this on the story page; the round is answered by the page's own question.
  await page.evaluate((m) => window.__eduTest.openModule(m), almostR.lastLesson); await screenIs('lesson'); await settle();
  if (await tapIf('View story')) { await screenIs('story'); await settle(); }
  // The device's back from a story a lesson opened goes to the top of the courses, never to a place Let's Read kept earlier in
  // the walk (the second read of pass MI's late fixes: only a story Let's Read opened gives a place back).
  if ((await screen()) === 'story') {
    await page.goBack().catch(() => {}); await screenIs('overview'); await page.waitForTimeout(800);
    const y = await page.evaluate(() => Math.round(window.scrollY));
    ok("the device's back from a lesson's story opens the courses at the top, not at a place the shelf kept", y <= 4, y);
    await page.evaluate((m) => window.__eduTest.openModule(m), almostR.lastLesson); await screenIs('lesson'); await settle();
    if (await tapIf('View story')) { await screenIs('story'); await settle(); }
  }
  await page.getByRole('button', { name: 'Practice this', exact: true }).first().click(); await screenIs('practice');
  for (let i = 0; i < 30; i++) {
    const st = await page.evaluate(() => ({ screen: window.__eduTest.screen, q: window.__eduTest.question })); if (st.screen !== 'practice') break;
    await settle();
    const byValue = page.locator(`button[data-choice="${String(st.q.answer).replace(/"/g, '\\"')}"]`); if (await byValue.count()) await byValue.first().click(); else await page.getByRole('button', { name: st.q.answer, exact: true }).first().click();
    await page.getByRole('button', { name: 'Check answer' }).click();
    const btn = page.getByRole('button', { name: /Next question|See results/ }); const label = await btn.textContent(); await btn.click();
    if (label.includes('See results')) break;
  }
  await screenIs('result'); await page.waitForTimeout(300);
  const readerTitle = L.titleCase(L.getCourse(READER).title); const tr = await text();
  ok("a reader's round that earns the course's last star says so and offers Celebrate!", tr.includes('That was the whole course!') && (await page.getByRole('button', { name: 'Celebrate!', exact: true }).count()) === 1 && (await page.locator('[data-course-finished-line]').count()) === 1, tr.slice(0, 240));
  await page.evaluate(() => { window.__spoken = []; });
  await settle(); await page.getByRole('button', { name: 'Celebrate!', exact: true }).click(); await screenIs('course-done'); await page.waitForTimeout(900);
  const rc = await page.evaluate(() => ({ confetti: document.querySelectorAll('.edu-confetti').length, labels: [...document.querySelectorAll('button')].map((b) => b.getAttribute('aria-label')).filter(Boolean), said: window.__spoken.join(' '), page: document.body.innerText.replace(/\s+/g, ' ') }));
  await snap('5-reader-course-done');
  ok("a reader's celebration shows the confetti, names the course on the card, says Read the story under its gold book and Return Home across the bottom, and speaks nothing unasked", rc.confetti >= 24 && rc.page.includes(`Hooray! You finished the whole course, ${readerTitle}!`) && rc.page.includes('Read the story') && rc.page.includes('Return Home') && rc.labels.join('|') === `Back|Hear it|Read the story of ${readerTitle}|Return Home` && rc.said === '', rc);
  await page.locator('[data-course-story-book]').click(); await screenIs('course-story'); await page.waitForTimeout(600);
  const rp = await text();
  ok("the book opens the reader's story page, with no Print link and Return Home at both ends (Mikey: don't need the print)", (await page.locator('[data-reader-story="reward"][data-course-story-page]').count()) === 1 && rp.includes(ST.COURSE_STORIES[READER].title.split(' ')[0]) && (await page.getByRole('button', { name: 'Print', exact: true }).count()) === 0 && (await page.getByRole('button', { name: 'Return Home', exact: true }).count()) === 2 && (await page.getByRole('button', { name: 'Back to my courses' }).count()) === 0, rp.slice(0, 200));
  { const wide = await page.evaluate(() => { const b = document.querySelector('[data-reader-story-home]'); const s = document.querySelector('[data-reader-story]'); return b && s ? { b: Math.round(b.getBoundingClientRect().width), s: Math.round(s.getBoundingClientRect().width), label: b.getAttribute('aria-label'), last: [...document.querySelectorAll('button')].filter((x) => x.offsetParent).pop() === b } : null; });
    ok("the reader's story page from Celebrate! ends on the same wide Return Home button the celebration ended on", !!wide && wide.label === 'Return Home' && wide.b >= wide.s - 2 && wide.last, wide); }
  await settle(); await page.getByRole('button', { name: 'Return Home', exact: true }).first().click(); await screenIs('overview'); await page.waitForTimeout(500);
  ok("Return Home goes home, and the course's story now waits on Let's Read with its Print link, as before", (await screen()) === 'overview');
  // From grade 6 up the line is calmer (pass MG, Mikey's answer to Q24, "calmer"), the confetti and the star kept: a grade 9
  // course's page, opened by the test hook, says Well done with the course's name, and no Hooray.
  { const calm = L.getCourse('psychology-9'); await page.evaluate((id) => window.__eduTest.goTo('course-done', id), calm.id); await screenIs('course-done'); await page.waitForTimeout(700);
    const cw = await page.evaluate(() => ({ words: (document.querySelector('[data-course-done]') || {}).textContent || '', confetti: document.querySelectorAll('.edu-confetti').length, star: !!document.querySelector('.edu-land-star') }));
    ok('a grade 9 course is celebrated in a calmer line, Well done and its name, with the confetti and the star kept', cw.words.includes(`Well done. You finished ${L.titleCase(calm.title)}.`) && !cw.words.includes('Hooray') && cw.confetti >= 24 && cw.star, cw);
    await settle(); await page.locator('[data-course-done-home]').click(); await screenIs('overview'); await page.waitForTimeout(400); }
  await page.evaluate((id) => window.__eduTest.openCourseStory(id), READER); await screenIs('course-story'); await page.waitForTimeout(400);
  ok("opened from the shelf, the reader's story page keeps Back to my courses and Print", (await page.locator('[data-reader-story="shelf"]').count()) === 1 && (await page.getByRole('button', { name: 'Print', exact: true }).count()) === 1 && (await page.getByRole('button', { name: 'Back to my courses' }).count()) === 2);
  await page.getByRole('button', { name: 'Back to my courses' }).first().click(); await screenIs('overview'); await page.waitForTimeout(300);
  // Back on the result of a round on that starred lesson, nothing celebrates a second time.
  await page.evaluate((m) => window.__eduTest.openModule(m), almostR.lastLesson); await screenIs('lesson'); await settle();
  if (await tapIf('View story')) { await screenIs('story'); await settle(); }
  await page.getByRole('button', { name: 'Practice this', exact: true }).first().click(); await screenIs('practice');
  for (let i = 0; i < 30; i++) {
    const st = await page.evaluate(() => ({ screen: window.__eduTest.screen, q: window.__eduTest.question })); if (st.screen !== 'practice') break;
    await settle();
    const byValue = page.locator(`button[data-choice="${String(st.q.answer).replace(/"/g, '\\"')}"]`); if (await byValue.count()) await byValue.first().click(); else await page.getByRole('button', { name: st.q.answer, exact: true }).first().click();
    await page.getByRole('button', { name: 'Check answer' }).click();
    const btn = page.getByRole('button', { name: /Next question|See results/ }); const label = await btn.textContent(); await btn.click();
    if (label.includes('See results')) break;
  }
  await screenIs('result'); await page.waitForTimeout(300);
  ok('a round on a lesson that already had its star offers no second celebration', (await page.getByRole('button', { name: 'Celebrate!', exact: true }).count()) === 0 && !(await text()).includes('That was the whole course!')); }
// A reader's Quick Review that earns a course's last star (pass MF, the screen check's second read): the Elementary student
// S-60, whose last How Computers Think lesson was moved past a month ago, clears its fresh try at the start of the day; the
// review's result says the whole course is done and offers Celebrate!, and its own Back to my lessons goes home as it says.
{ await page.evaluate(() => window.__eduTest.goHome()); await screenIs('educator-pick'); await page.waitForTimeout(400); await tapIf('Got it');
  await page.getByRole('button', { name: 'Add someone new' }).first().click(); await page.waitForTimeout(300);
  await page.fill('input[placeholder="School-issued ID"]', 'S-60'); await page.getByRole('button', { name: /^Elementary/ }).first().click(); await page.waitForTimeout(200);
  await page.getByRole('button', { name: 'Add', exact: true }).click(); await page.waitForTimeout(500); await tapIf('Later');
  const movedR = await page.evaluate(() => window.__eduTest.seedHistory('S-60', { movedLast: 'tech-3', movedDays: 30 }));
  ok("the hook leaves the reader's course with its last lesson moved past for S-60", !!movedR && movedR.movedLast === 'tech-3' && !!movedR.lastLesson, movedR);
  await page.getByRole('button', { name: 'Home' }).first().click(); await page.waitForTimeout(500);
  await page.getByRole('button', { name: /S-60$/ }).first().click(); await page.waitForTimeout(900); await tapIf('Later');
  await page.getByRole('button', { name: 'Start', exact: true }).click(); await page.waitForTimeout(500);
  for (let k = 0; k < 8 && (await screen()) === 'practice'; k++) {
    const q = await page.evaluate(() => window.__eduTest.question); if (!q) break;
    await settle();
    const byValue = page.locator(`button[data-choice="${String(q.answer).replace(/"/g, '\\"')}"]`); if (await byValue.count()) await byValue.first().click(); else await page.getByRole('button', { name: q.answer, exact: true }).first().click();
    await page.waitForTimeout(150); await tapIf('Check answer');
    const next = page.getByRole('button', { name: /Next question|See results|Finish/ }).first(); if (await next.count()) { await next.click(); await page.waitForTimeout(250); }
  }
  await page.waitForTimeout(500);
  const rv = await text();
  ok("the reader's review result says the whole course is done and offers Celebrate! beside its own Back to my lessons", (await screen()) === 'light-review-result' && rv.includes('That was the whole course!') && (await page.getByRole('button', { name: 'Celebrate!', exact: true }).count()) === 1 && (await page.getByRole('button', { name: 'Back to my lessons' }).count()) === 1, { screen: await screen(), rv: rv.slice(0, 200) });
  await settle(); await page.getByRole('button', { name: 'Celebrate!', exact: true }).click(); await screenIs('course-done'); await page.waitForTimeout(500);
  ok("Celebrate! opens the reader's celebration, with Read the story under its book", (await text()).includes('Read the story') && (await page.locator('[data-course-done-home]').count()) === 1);
  await settle(); await page.locator('[data-course-done-home]').click(); await screenIs('overview'); await page.waitForTimeout(400);
  ok('its Return Home button goes home', (await screen()) === 'overview'); }
// The first finish (pass MH, Mikey: "Even for early readers, they should be launched into the long story at the end of a completed
// course (both 1st and 2nd time on different days)" and "I saw an arrow and not an unlocked long story"): the Early years student
// S-58 has passed every First Steps lesson but the last, once, two days ago. Passing the last today says that was every lesson;
// after the lesson's own reward story the first celebration opens, says every lesson aloud and offers the course's long story,
// which reads itself; and the long story then waits on Let's Read, open, before a single star.
{ await page.evaluate(() => window.__eduTest.goHome()); await screenIs('educator-pick'); await page.waitForTimeout(400); await tapIf('Got it');
  await page.getByRole('button', { name: 'Add someone new' }).first().click(); await page.waitForTimeout(300);
  await page.fill('input[placeholder="School-issued ID"]', 'S-58'); await page.getByRole('button', { name: /^Early years/ }).first().click(); await page.waitForTimeout(200);
  await page.getByRole('button', { name: 'Add', exact: true }).click(); await page.waitForTimeout(500); await tapIf('Later');
  const one = await page.evaluate((id) => window.__eduTest.seedHistory('S-58', { complete: id }), FINISH);
  ok('the hook leaves First Steps one lesson short of its first finish for S-58', !!one && one.complete === FINISH && !!one.lastLesson, one);
  await page.getByRole('button', { name: 'Home' }).first().click(); await page.waitForTimeout(500);
  await page.getByRole('button', { name: /S-58$/ }).first().click(); await page.waitForTimeout(900); await tapIf('Later');
  await page.evaluate(() => { window.__spoken = []; });
  await passRound(one.lastLesson);
  const t1 = await text();
  ok('the round that passes the last unpassed lesson says that was every lesson, and names no next course yet', t1.includes('Well done! That was every lesson.') && !t1.includes('Next: ') && !t1.includes('whole course'), t1.slice(0, 200));
  if ((await page.getByLabel('Hear your story').count()) === 1) { await settle(); await page.getByLabel('Hear your story').click(); await screenIs('story'); await page.waitForTimeout(500); }
  await settle(); await page.getByLabel('Keep going').click(); await screenIs('course-done'); await page.waitForTimeout(900);
  const courseTitle1 = L.titleCase(L.getCourse(FINISH).title);
  const first = await page.evaluate(() => ({ stage: (document.querySelector('[data-course-done]') || {}).getAttribute ? document.querySelector('[data-course-done]').getAttribute('data-course-done-stage') : null, said: window.__spoken.join(' '), kind: (document.querySelector('[data-course-story-book]') || { getAttribute: () => null }).getAttribute('data-course-story-kind') }));
  ok('the first celebration opens with every lesson said aloud and the course\'s first long story offered', first.stage === 'complete' && first.kind === 'course' && first.said.includes(`Hooray! You did every lesson in ${courseTitle1}! Here is its story. Tap the gold book to hear it, or tap the green button at the bottom to go home.`), first);
  await snap('4b-first-finish');
  await page.evaluate(() => { window.__spoken = []; });
  await settle(); await page.locator('[data-course-story-book]').click(); await screenIs('course-story'); await page.waitForTimeout(1200);
  const saidFirst = await page.evaluate(() => window.__spoken.slice());
  ok('its gold book opens the long story on the self-reading page, the story of the course, read aloud from its title', saidFirst[0] === `${ST.COURSE_STORIES[FINISH].title}.` && (await page.locator('[data-read-aloud-story="reward"][data-course-story-kind="course"]').count()) === 1 && (await text()).includes(`The story of ${courseTitle1}`), saidFirst.slice(0, 2));
  await settle(); await page.getByLabel('Return Home').click(); await screenIs('overview'); await page.waitForTimeout(600);
  const fold4 = page.getByRole('button', { name: "Let's Read", exact: true });
  if ((await fold4.count()) && (await fold4.first().getAttribute('aria-expanded')) !== 'true') { await fold4.first().click(); await page.waitForTimeout(400); }
  const openBook = await page.locator(`[data-course-story-book="${FINISH}"]`).evaluateAll((bs) => bs.map((b) => ({ label: b.getAttribute('aria-label'), disabled: b.disabled })));
  ok("afterwards the long story waits on Let's Read, open before a single star (it used to wait for every star)", openBook.length === 1 && !openBook[0].disabled && openBook[0].label === `Hear ${storyTitle} again`, openBook); }
// A reader's first finish (pass MH): the Elementary student S-61, one lesson short of How Computers Think's first finish, passes
// it; her result says that was every lesson and offers Celebrate!, whose page names every lesson passed and offers the story.
{ await page.evaluate(() => window.__eduTest.goHome()); await screenIs('educator-pick'); await page.waitForTimeout(400); await tapIf('Got it');
  await page.getByRole('button', { name: 'Add someone new' }).first().click(); await page.waitForTimeout(300);
  await page.fill('input[placeholder="School-issued ID"]', 'S-61'); await page.getByRole('button', { name: /^Elementary/ }).first().click(); await page.waitForTimeout(200);
  await page.getByRole('button', { name: 'Add', exact: true }).click(); await page.waitForTimeout(500); await tapIf('Later');
  const oneR = await page.evaluate(() => window.__eduTest.seedHistory('S-61', { complete: 'tech-3' }));
  ok("the hook leaves the reader's course one lesson short of its first finish for S-61", !!oneR && oneR.complete === 'tech-3' && !!oneR.lastLesson, oneR);
  await page.getByRole('button', { name: 'Home' }).first().click(); await page.waitForTimeout(500);
  await page.getByRole('button', { name: /S-61$/ }).first().click(); await page.waitForTimeout(900); await tapIf('Later');
  await page.evaluate((m) => window.__eduTest.openModule(m), oneR.lastLesson); await screenIs('lesson'); await settle();
  if (await tapIf('View story')) { await screenIs('story'); await settle(); }
  await page.getByRole('button', { name: 'Practice this', exact: true }).first().click(); await screenIs('practice');
  for (let i = 0; i < 30; i++) {
    const st = await page.evaluate(() => ({ screen: window.__eduTest.screen, q: window.__eduTest.question })); if (st.screen !== 'practice') break;
    await settle();
    const byValue = page.locator(`button[data-choice="${String(st.q.answer).replace(/"/g, '\\"')}"]`); if (await byValue.count()) await byValue.first().click(); else await page.getByRole('button', { name: st.q.answer, exact: true }).first().click();
    await page.getByRole('button', { name: 'Check answer' }).click();
    const btn = page.getByRole('button', { name: /Next question|See results/ }); const label = await btn.textContent(); await btn.click();
    if (label.includes('See results')) break;
  }
  await screenIs('result'); await page.waitForTimeout(300);
  const tr1 = await text(); const readerTitle1 = L.titleCase(L.getCourse('tech-3').title);
  ok("a reader's round that passes the last unpassed lesson says that was every lesson and offers Celebrate!", tr1.includes('That was every lesson in the course!') && (await page.getByRole('button', { name: 'Celebrate!', exact: true }).count()) === 1, tr1.slice(0, 200));
  await settle(); await page.getByRole('button', { name: 'Celebrate!', exact: true }).click(); await screenIs('course-done'); await page.waitForTimeout(700);
  const rp1 = await text();
  ok("the reader's first celebration names every lesson passed and offers the course's story to read", rp1.includes(`Hooray! You passed every lesson in ${readerTitle1}!`) && rp1.includes('Here is its story.') && rp1.includes('Read the story'), rp1.slice(0, 300));
  await settle(); await page.locator('[data-course-done-home]').click(); await screenIs('overview'); await page.waitForTimeout(400);
  ok("its Return Home button goes home", (await screen()) === 'overview'); }
// A quick check that completes a course (pass MI, Mikey's answer to Q37: "celebrate"): the Elementary student S-62, one lesson short
// of the same course's first finish, places the last lesson with "I already know this"; the quick check's result says that was
// every lesson and offers Celebrate!, whose page opens the course's story as after a round.
{ await page.evaluate(() => window.__eduTest.goHome()); await screenIs('educator-pick'); await page.waitForTimeout(400); await tapIf('Got it');
  await page.getByRole('button', { name: 'Add someone new' }).first().click(); await page.waitForTimeout(300);
  await page.fill('input[placeholder="School-issued ID"]', 'S-62'); await page.getByRole('button', { name: /^Elementary/ }).first().click(); await page.waitForTimeout(200);
  await page.getByRole('button', { name: 'Add', exact: true }).click(); await page.waitForTimeout(500); await tapIf('Later');
  const oneQ = await page.evaluate(() => window.__eduTest.seedHistory('S-62', { complete: 'tech-3' }));
  await page.getByRole('button', { name: 'Home' }).first().click(); await page.waitForTimeout(500);
  await page.getByRole('button', { name: /S-62$/ }).first().click(); await page.waitForTimeout(900); await tapIf('Later');
  await page.evaluate((m) => window.__eduTest.startQuickCheck(m), oneQ.lastLesson); await screenIs('practice');
  for (let i = 0; i < 12; i++) {
    const st = await page.evaluate(() => ({ screen: window.__eduTest.screen, q: window.__eduTest.question })); if (st.screen !== 'practice') break;
    await page.waitForTimeout(2100);   // a quick check counts an answer under two seconds as rushed, and three rushed as a guess
    await settle();
    const byValue = page.locator(`button[data-choice="${String(st.q.answer).replace(/"/g, '\\"')}"]`); if (await byValue.count()) await byValue.first().click(); else await page.getByRole('button', { name: st.q.answer, exact: true }).first().click();
    await page.getByRole('button', { name: 'Check answer' }).click();
    const btn = page.getByRole('button', { name: /Next question|See results/ }); const label = await btn.textContent(); await btn.click();
    if (label.includes('See results')) break;
  }
  await screenIs('quick-result'); await page.waitForTimeout(400);
  const tq = await text();
  ok('a quick check that places the last unpassed lesson says that was every lesson in the course and offers Celebrate! (Q37)', tq.includes('You already know') && tq.includes('That was every lesson in the course!') && (await page.getByRole('button', { name: 'Celebrate!', exact: true }).count()) === 1, tq.slice(0, 300));
  await settle(); await page.getByRole('button', { name: 'Celebrate!', exact: true }).click(); await screenIs('course-done'); await page.waitForTimeout(700);
  const tqd = await text();
  ok("its celebration names every lesson passed and offers the course's story, as after a round", tqd.includes(`Hooray! You passed every lesson in ${L.titleCase(L.getCourse('tech-3').title)}!`) && tqd.includes('Read the story'), tqd.slice(0, 300));
  await settle(); await page.locator('[data-course-done-home]').click(); await screenIs('overview'); await page.waitForTimeout(400); }
// A walk-through's reward comes once (the code check, pass MD): the walk-through logs the first read in the log it keeps in
// memory, so when a Wonder returns to the result, the arrow goes on and the book does not come back with the same story.
{ await page.evaluate(() => window.__eduTest.goHome()); await screenIs('educator-pick'); await page.waitForTimeout(400); await tapIf('Got it');
  await page.getByLabel('Walk through early years').click({ force: true }); await screenIs('overview');
  const seen = [];
  for (const id of ['colours', 'same-and-different']) {
    await passRound(id);
    for (let hop = 0; hop < 10; hop++) {
      const s = await screen();
      if (s === 'result') { const book = (await page.getByLabel('Hear your story').count()) > 0; seen.push(`${id}:${book ? 'book' : 'arrow'}`); await settle(); await (book ? page.getByLabel('Hear your story') : page.getByLabel(/Keep going|Go again/)).click(); }
      else if (s === 'story') { seen.push(`${id}:story`); await page.waitForTimeout(500); await settle(); await page.getByLabel('Keep going').click(); }
      else if (s === 'wonder') { seen.push(`${id}:wonder`); await settle(); await page.locator('button').filter({ hasText: /\S/ }).last().click(); }
      else if (s === 'wonder-voices') { for (let k = 0; k < 4; k++) { await settle(); if (await page.getByLabel('Finish').count()) { await page.getByLabel('Finish').click(); break; } await page.getByLabel('Next').click(); } }
      else break;
      await page.waitForTimeout(350);
    }
  }
  ok("a walk-through's reward story comes once: after a Wonder the result's arrow goes on", seen.join() === 'colours:book,colours:story,same-and-different:book,same-and-different:story,same-and-different:wonder,same-and-different:arrow', seen); }
// The place kept in a frame as tall as the page (pass MI): the claude.ai preview on a laptop shows the app in such a frame, whose
// own window never scrolls, so the page came back at its top after a book. A host page holds the app in a 5,000-pixel frame;
// the page around it is scrolled so a heard story's book sits mid-screen, the book is pressed inside the frame, and the story's
// arrow must bring the page around the frame back to the same place.
{ writeFileSync('/tmp/edu-place-host.html', `<!doctype html><html><body style="margin:0;background:#111"><div style="height:120px;color:#ccc">Preview header</div><iframe id="app" src="${new URL('./page.html', import.meta.url).href}" style="border:0;width:100%;height:5000px;display:block"></iframe><div style="height:600px"></div></body></html>`);
  const host = await browser.newPage({ viewport: { width: 1280, height: 800 }, hasTouch: true, reducedMotion: 'reduce' });
  await host.goto('file:///tmp/edu-place-host.html'); await host.waitForTimeout(800);
  const f = host.frames().find((x) => x.url().endsWith('page.html'));
  const fIs = (n) => f.waitForFunction((x) => window.__eduTest && window.__eduTest.screen === x, n, { timeout: 15000 });
  const press = (name) => f.evaluate((n) => { const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === n || x.getAttribute('aria-label') === n); if (b) b.click(); return !!b; }, name);
  await fIs('welcome'); await press('Create account'); await fIs('educator-setup');
  await f.fill('input[placeholder="PIN"]', '2468'); await f.fill('input[placeholder="PIN again"]', '2468'); await f.fill('input[placeholder="This device\'s name"]', 'Frame'); await f.selectOption('select[aria-label="Your state"]', 'TX');
  await press('Create account'); await fIs('educator-pick'); await host.waitForTimeout(600);
  for (const n of ['Skip tour', 'Later', 'Got it']) { await press(n); await host.waitForTimeout(250); }
  await press('Add someone new'); await host.waitForTimeout(300);
  await f.fill('input[placeholder="School-issued ID"]', 'S-71'); await f.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => /^Early years/.test(x.textContent.trim())); if (b) b.click(); }); await host.waitForTimeout(200);
  await press('Add'); await host.waitForTimeout(500); await press('Later');
  await f.evaluate((id) => window.__eduTest.seedHistory('S-71', { finish: id }), FINISH);
  await f.evaluate(() => window.__eduTest.seedHistory('S-71', { heard: ['colours', 'same-and-different'] }));
  await press('Home'); await host.waitForTimeout(500);
  const quiet = () => f.evaluate(() => Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: { speaking: false, pending: false, cancel() {}, getVoices() { return []; }, speak() {} } }));   // no voice, so nothing follows the reading down the page
  const signIn = async () => { await f.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => x.getAttribute('aria-label') === 'S-71'); if (b) b.click(); }); await host.waitForTimeout(900); await press('Later'); await fIs('overview'); };
  // Where the book sits on the host's screen: the frame starts 120 pixels down the host page.
  const onScreen = (id) => f.evaluate((m) => { const r = document.querySelector(`[data-heard-story="${m}"]`); return r ? Math.round(r.getBoundingClientRect().top) : null; }, id).then(async (top) => (top === null ? null : 120 + top - (await host.evaluate(() => Math.round(window.scrollY)))));
  const roundTrip = async (id, aim) => {
    const fold = await f.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => x.getAttribute('aria-label') === "Let's Read"); return b ? b.getAttribute('aria-expanded') : null; });
    if (fold !== 'true') { await press("Let's Read"); await host.waitForTimeout(500); }
    const top = await f.evaluate((m) => { const r = document.querySelector(`[data-heard-story="${m}"]`); return r ? Math.round(r.getBoundingClientRect().top) : null; }, id);
    await host.evaluate((y) => window.scrollTo(0, y), 120 + top - aim); await host.waitForTimeout(700);
    const before = await onScreen(id);
    await f.evaluate((m) => document.querySelector(`[data-heard-story="${m}"] button`).click(), id); await fIs('story'); await host.waitForTimeout(800);
    const atStory = await host.evaluate(() => Math.round(window.scrollY));
    await f.evaluate(() => document.querySelector('[aria-label="Keep going"]').click()); await fIs('overview'); await host.waitForTimeout(1000);
    return { before, atStory, after: await onScreen(id) }; };
  await signIn(); await quiet();
  const one = await roundTrip('colours', 400);
  ok("in a page-tall frame (the claude.ai preview) the story's arrow brings the book back to where it was tapped on the screen", one.before !== null && one.after !== null && Math.abs(one.before - 400) <= 8 && Math.abs(one.after - one.before) <= 8, one);
  const two = await roundTrip('same-and-different', 520);
  ok('a second book on the same page comes back to its own place too', two.before !== null && two.after !== null && Math.abs(two.after - two.before) <= 8, two);
  // A refreshed frame opens straight on the overview (the where-note), and its first book is the first thing measured.
  await host.reload(); await host.waitForTimeout(1500);
  const f2 = host.frames().find((x) => x.url().endsWith('page.html'));
  await f2.waitForFunction(() => window.__eduTest && window.__eduTest.screen === 'overview', null, { timeout: 15000 }).catch(() => {});
  await f2.evaluate(() => Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: { speaking: false, pending: false, cancel() {}, getVoices() { return []; }, speak() {} } }));
  const fold2 = await f2.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => x.getAttribute('aria-label') === "Let's Read"); if (b && b.getAttribute('aria-expanded') !== 'true') b.click(); return !!b; }); await host.waitForTimeout(500);
  const top2 = await f2.evaluate(() => { const r = document.querySelector('[data-heard-story="colours"]'); return r ? Math.round(r.getBoundingClientRect().top) : null; });
  await host.evaluate((y) => window.scrollTo(0, y), 120 + top2 - 400); await host.waitForTimeout(700);
  const where = async () => { const t = await f2.evaluate(() => { const r = document.querySelector('[data-heard-story="colours"]'); return r ? Math.round(r.getBoundingClientRect().top) : null; }); return t === null ? null : 120 + t - (await host.evaluate(() => Math.round(window.scrollY))); };
  const b3 = await where();
  await f2.evaluate(() => document.querySelector('[data-heard-story="colours"] button').click()); await f2.waitForFunction(() => window.__eduTest.screen === 'story', null, { timeout: 15000 }); await host.waitForTimeout(800);
  await f2.evaluate(() => document.querySelector('[aria-label="Keep going"]').click()); await f2.waitForFunction(() => window.__eduTest.screen === 'overview', null, { timeout: 15000 }); await host.waitForTimeout(1000);
  const a3 = await where();
  ok('after a refresh, the first book tapped comes back to its place as well', fold2 && b3 !== null && a3 !== null && Math.abs(a3 - b3) <= 8, { b3, a3 });
  await host.close(); rmSync('/tmp/edu-place-host.html', { force: true }); }
ok('no page errors along the way', errors.length === 0, errors);
await browser.close();
console.log(`\n${passed} passed, ${failed} failed`);
process.exitCode = failed ? 1 : 0;   // never process.exit() (CLAUDE.md, 2026-09-23)
