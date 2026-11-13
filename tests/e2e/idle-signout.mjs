// The Wise Human. Copyright (c) 2026. Source-available; not for reuse. See LICENSE.md.
// A student signed out after fifteen quiet minutes (pass NJ, Mikey: "When logging in as a student and exiting the browser.  I returned
// what seems like an hour later and the student was still logged into to the device.   Maybe we should have students auto-logged out
// after a period of inactivity kind of like the instructors?  We don't need it visually displayed like we do for the educators but maybe
// we log out after 15 minutes of activity."). In plain terms, in a real browser on the test page (tests/e2e/make-page.mjs):
//   1. A browser closed and opened again: the note of where a student was (edusphere_v1_where) brings the student back when its time is
//      under fifteen minutes old, and when it is older, or has no time at all (every note before pass NJ), the sign-in screen shows and
//      the note is erased.
//   2. While the page is open: fifteen quiet minutes (set through the test hook quietFor, since a test cannot wait them out) end the
//      session on the next check, a tap before then starts the fifteen minutes again and writes the note's time anew, a page brought
//      back into view after them ends it at once, and the touch that wakes a device left too long ends it without doing anything else
//      (the touch is made where the sign-in screen's Educator Login button stands, which it must not open).
//      A clock set back a little while the student works is not quiet (since round one's code read), and a tap made right after a
//      sign-out by the clock does what it taps (since round one's screen read). A mouse moved to wake the device holds back a click
//      300 ms later, and a key pressed to wake it does not hold back a click a second and a half later (since round two's code read),
//      and a mouse button pressed inside a move's hold and let go after it presses nothing (since round three's).
//   3. Nothing counts down on the screen, and no file is downloaded (the idle sign-out's lack of a backup is pinned in the rules test,
//      since these sessions change nothing a backup would save).
// The rule itself (STUDENT_IDLE_MS, studentIdleOver, whereNoteFresh) and the screen code's use of it, each with a plant, are in the
// rules test (tests/logic.test.mjs).
// Run: ./build.sh && node tests/e2e/make-page.mjs && node tests/e2e/idle-signout.mjs
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
let passed = 0, failed = 0;
const ok = (name, cond, info) => { if (cond) { passed++; console.log('PASS - ' + name); } else { failed++; console.log('FAIL - ' + name + (info !== undefined ? '  ' + JSON.stringify(info).slice(0, 600) : '')); } };
const MIN = 60 * 1000;
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
const page = await ctx.newPage();
const downloads = []; page.on('download', (d) => downloads.push(d.suggestedFilename()));
const screen = () => page.evaluate(() => (window.__eduTest ? window.__eduTest.screen : null));
const note = () => page.evaluate(() => { try { return JSON.parse(localStorage.getItem('edusphere_v1_where')); } catch (e) { return null; } });
const waitScreen = async (name, ms = 12000) => { try { await page.waitForFunction((n) => window.__eduTest && window.__eduTest.screen === n, name, { timeout: ms }); return true; } catch (e) { return false; } };
await page.goto(new URL('./page.html', import.meta.url).href);
await waitScreen('welcome', 30000);
// Where the sign-in screen's Educator Login button stands, for the waking touch below.
const login = await page.getByRole('button', { name: 'Educator Login' }).boundingBox();
// A learner kept as the app keeps one, and a note of where they were, written ago minutes back (or with no time when ago is null).
const seed = (ago) => page.evaluate(({ ago }) => {
  const rec = { version: 1, name: 'T1', createdAt: new Date().toISOString(), events: [{ type: 'courses_enabled', at: new Date().toISOString(), courseIds: ['very-first-steps-pk3'] }] };
  localStorage.setItem('fake:edusphere_v1_learner_t1', JSON.stringify(rec));
  localStorage.setItem('edusphere_v1_where', JSON.stringify({ name: 'T1', screen: 'overview', moduleId: null, ...(ago === null ? {} : { at: Date.now() - ago * 60 * 1000 }) }));
}, { ago });
const reopen = async (ago) => { await seed(ago); await page.reload(); await page.waitForFunction(() => window.__eduTest && ['welcome', 'overview'].includes(window.__eduTest.screen), null, { timeout: 30000 }); await page.waitForTimeout(800); return { screen: await screen(), note: await note() }; };

// 1. A browser closed and opened again.
{ const r = await reopen(5); ok('a note five minutes old brings the student back to their overview, and the note carries a time again', r.screen === 'overview' && r.note && r.note.name === 'T1' && Date.now() - r.note.at < 2 * MIN, r); }
{ const r = await reopen(16); ok('a note sixteen minutes old brings no one back: the sign-in screen shows and the note is erased', r.screen === 'welcome' && r.note === null, r); }
{ const r = await reopen(60); ok('an hour later, as Mikey found it, the sign-in screen shows', r.screen === 'welcome' && r.note === null, r); }
{ const r = await reopen(null); ok('a note with no time, as every note before pass NJ, brings no one back', r.screen === 'welcome' && r.note === null, r); }

// 2. While the page is open.
{ await reopen(1);
  const was = await screen();
  const hooked = await page.evaluate((ms) => window.__eduTest.quietFor(ms), 15 * MIN + 1000);
  const gone = await waitScreen('welcome', 20000);
  ok('fifteen quiet minutes on the overview end the session at the next check, which comes within twenty seconds, and erase the note', was === 'overview' && hooked === true && gone && (await note()) === null, { was, hooked, gone }); }
{ await reopen(1);
  await page.evaluate(() => { const w = JSON.parse(localStorage.getItem('edusphere_v1_where')); w.at = Date.now() - 10 * 60 * 1000; localStorage.setItem('edusphere_v1_where', JSON.stringify(w)); });
  await page.evaluate((ms) => window.__eduTest.quietFor(ms), 14 * MIN + 50 * 1000);
  await page.mouse.click(4, 300);   // a tap on the page's empty edge
  const at = (await note() || {}).at;
  await page.waitForTimeout(17000);
  ok('a tap before the fifteen minutes are up starts them again and writes the note\'s time anew, so the next check leaves the student signed in', (await screen()) === 'overview' && Date.now() - at < MIN, { screen: await screen(), at }); }
// Since round one's code read: a clock moved back is not quiet. The page's clock is set back five seconds (a time sync, a hand
// change) and the student taps on: the tap and the next check leave the student signed in, the note kept, where the first build sent
// the student to the sign-in screen and erased the note, a practice round in it.
{ await reopen(1);
  await page.evaluate(() => { const real = Date.now.bind(Date); window.__realDateNow = real; Date.now = () => real() - 5000; });
  await page.mouse.click(4, 300);
  await page.waitForTimeout(17000);
  const s = await screen(); const n = await note();
  await page.evaluate(() => { if (window.__realDateNow) Date.now = window.__realDateNow; });
  ok('a clock set back five seconds while a student works is not quiet: the tap and the next check leave the student signed in, the note kept (round one\'s code read)', s === 'overview' && n && n.name === 'T1', { s, n }); }
{ await reopen(1);
  await page.evaluate((ms) => window.__eduTest.quietFor(ms), 16 * MIN);
  await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
  const gone = await waitScreen('welcome', 3000);
  ok('a page brought back into view after fifteen quiet minutes ends the session at once', gone, await screen()); }
{ await reopen(1);
  await page.evaluate((ms) => window.__eduTest.quietFor(ms), 16 * MIN);
  await page.touchscreen.tap(login.x + login.width / 2, login.y + login.height / 2);   // a finger where Educator Login stands once the sign-in screen shows
  await page.waitForTimeout(1500);
  const s = await screen();
  ok('the touch that wakes a device left too long signs the student out and does nothing else: it never opens what stands under it on the sign-in screen', s === 'welcome' && (await note()) === null, s); }

// Since round one's screen read: a tap made right after a sign-out by the clock does what it taps. The overview is scrolled first, so
// the sign-in screen scrolls to its top; on the product page at 375 by 667 the screen read saw that scroll reach the student's
// listener before it was taken away, taken for a waking press, and the next real tap on a name held back. Here the tap is on Educator
// Login, 300 ms after the sign-in screen shows. No near miss is kept: on this test page the scroll arrives after the listener is gone
// (the lead's probe with the first build's handler planted, at 375 by 667 and 390 by 844, by finger and by mouse, opened Educator
// Login each time), so the rules test holds the two guards, nothing heard after the sign-out and only a press held, by their plants.
{ await reopen(1);
  await page.evaluate(() => window.scrollTo(0, 500)); await page.waitForTimeout(400);
  const scrolled = await page.evaluate(() => window.scrollY);
  await page.evaluate((ms) => window.__eduTest.quietFor(ms), 16 * MIN);
  const gone = await waitScreen('welcome', 20000);
  await page.waitForTimeout(300);
  const b = await page.getByRole('button', { name: 'Educator Login' }).boundingBox();
  if (b) await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2);
  await page.waitForTimeout(1200);
  const s = await screen();
  ok('a tap right after a sign-out by the clock, from a scrolled page, does what it taps: Educator Login opens (round one\'s screen read)', scrolled > 100 && gone && !!b && s !== 'welcome', { scrolled, gone, s }); }

// Since round two's code read every waking event but a scroll is held, a press until its click or a moment after it lifts or is
// cancelled, and a key, a pointer move or a wheel 800 ms, as the first build held every waking event: holding only a press (round
// one's change) let a mouse's first move sign out and the click after it press what now stood there, and a key held until a click or a
// lift that never came swallowed a deliberate click up to three seconds later. Both are near misses: each fails on round two's frozen
// copy of the page (pass NJ, the lead's run of this file on it), and the mouse's is where Educator Login stands.
{ await reopen(1);
  await page.evaluate((ms) => window.__eduTest.quietFor(ms), 16 * MIN);
  const x = login.x + login.width / 2, y = login.y + login.height / 2;
  await page.mouse.move(x - 60, y - 60); await page.mouse.move(x, y);   // the mouse that wakes the device, coming to rest where Educator Login stands
  await page.waitForTimeout(300);
  await page.mouse.click(x, y);
  await page.waitForTimeout(1200);
  const s = await screen();
  ok('a mouse moved to wake a device left too long signs the student out, and its click 300 ms later presses nothing on the sign-in screen (round two\'s code read)', s === 'welcome' && (await note()) === null, s); }
{ await reopen(1);
  await page.evaluate((ms) => window.__eduTest.quietFor(ms), 16 * MIN);
  await page.keyboard.press('Shift');   // a key that wakes it
  const gone = await waitScreen('welcome', 3000);
  await page.waitForTimeout(1500);
  const b = await page.getByRole('button', { name: 'Educator Login' }).boundingBox();
  if (b) await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2);
  await page.waitForTimeout(1200);
  const s = await screen();
  ok('a key pressed to wake it signs the student out, and a click a second and a half later does what it clicks: Educator Login opens (round two\'s code read)', gone && !!b && s !== 'welcome', { gone, s }); }
// Since round three's code read a press begun inside a move's or a key's 800 ms is held as a press from then on: a mouse moved to wake
// the device, its button pressed at 600 ms and let go at 950 ms, had clicked through. A near miss: it fails on round three's frozen copy.
{ await reopen(1);
  await page.evaluate((ms) => window.__eduTest.quietFor(ms), 16 * MIN);
  const x = login.x + login.width / 2, y = login.y + login.height / 2;
  await page.mouse.move(x - 60, y - 60); await page.mouse.move(x, y);
  await page.waitForTimeout(600); await page.mouse.down(); await page.waitForTimeout(350); await page.mouse.up();
  await page.waitForTimeout(1200);
  const s = await screen();
  ok('a mouse moved to wake it, its button pressed 600 ms later and let go 350 ms after that, presses nothing on the sign-in screen (round three\'s code read)', s === 'welcome' && (await note()) === null, s); }

// 3. No backup file, and nothing counting down. The chip read cannot fail today, since no build has drawn the educator's chip on a
// student's screen; it stands against one being added, and the other student screens are the screen read's to see (round two's code read).
{ await reopen(1); const body = await page.evaluate(() => document.body.innerText); const chips = await page.evaluate(() => document.querySelectorAll('.edu-logout-chip').length);
  ok('nothing on a student\'s screen counts down to a sign-out, as Mikey asked ("We don\'t need it visually displayed"): no words and no countdown chip', !/Logging out in|logged out in/i.test(body) && chips === 0, chips); }
ok('no file was downloaded by any sign-out above (these sessions changed nothing, so a backup would have had nothing new to save; the rules test\'s pin, with its plant, is what holds the idle sign-out to no backup)', downloads.length === 0, downloads);

// No near miss is kept for a press's hold: in this test's Chromium a press whose element the sign-out removes sends no click to what
// now stands there on the sign-in screen, held or not (tried with a mouse click and with a finger's tap, the hold taken out of a copy of the page; tried again
// in round three, whose code read doubted it, with the hold and the press's own stop both taken out: neither opened Educator Login,
// the lead's probe in pass NJ), so a plant could not trip it. A press's hold is for touch browsers that place a tap's click after the screen has changed (the ghost click); the
// rules test pins it in the screen code with plants of its own (tests/logic.test.mjs, pass NJ's idle block). The mouse's and the key's
// holds above are near misses.
await browser.close();
console.log(`${passed} passed, ${failed} failed`); process.exitCode = failed ? 1 : 0;
