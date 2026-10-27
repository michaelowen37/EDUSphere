// The Wise Human. Copyright (c) 2026. Source-available; not for reuse. See LICENSE.md.
// A game's spoken welcome and its demonstration, walked in the real page (pass MP, Mikey: "I think games can have the instruction
// audio play automatically when entering the page", "an animation playing the game at the same time to show how it works", "When
// the instructional conversation and animation are finished, all games can have a begin button", "There should also be a way to skip
// the instructional audio and demonstration if they wish to.  The only way it is ever replayed again would be upon exiting the game
// and re-entering.  The top left icon wouldn't retrigger it (only resets game) nor would the instruction link (just displays the
// instructions through the popup as it does now).  Speaker icon can re-read the instructions but the demonstration requires a full
// exit and re-entrance").
// In plain terms: an early-years student taps a game's tile, and the welcome plays: the board plays itself under a pointer while a
// stand-in voice says each line and a caption shows it; a child's own taps do nothing to the board meanwhile, and the play clock
// waits. Then Begin, a fresh board, the round arrow that only resets, Close and the welcome again on the next visit, Skip, the
// Instructions link, the speaker, and the round arrow during the welcome. On a computer (a mouse and a keyboard) Which Sense's
// welcome shows a key being pressed, its numbers sit under the senses, its question is asked again by the speaker beside it, which
// has no border, and every step of the demonstration finds what it needs. Pong, which moves, keeps its moving note under Begin; a
// map waiting for its painting and Quick fire with nothing to ask open with no welcome; and with less motion asked for, the pointer
// jumps and the welcome still finishes. Since round one's checks: the board's own question waits for the welcome, the question the
// pointer asks is heard while it asks, Skip, Close and the round arrow during that ask leave the game's voice working, the speaker in
// the welcome reads the instructions once the welcome has gone, Tab never enters the demonstration's board, the key and the shooter's
// aim find their marks, Hold It in Mind's words wait for their line, Begin covers the board's own size, and the phone runs as a phone
// (the test page with a phone's viewport line), Skip in view on a phone held sideways. Since round two: Begin's pulse, every step at rest
// in view on two short screens and in the claude.ai preview's page-tall frame, and the ways out pressed in the ask's own frame. Since
// round three: Begin and then the board's top back in what shows once the welcome has gone, Begin's ring seen at its strength and
// still with less motion, a wrong tap's still sign with less motion, and a device with no voice. About five minutes.
import { createRequire } from 'node:module'; import { execSync } from 'node:child_process'; import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const G = execSync('npm root -g').toString().trim(); const { chromium } = createRequire(import.meta.url)(`${G}/playwright`);
const L = await import('../../src/logic.mjs');
let passed = 0, failed = 0; const ok = (name, cond, info) => { if (cond) { passed++; console.log('PASS - ' + name); } else { failed++; console.log('FAIL - ' + name + (info !== undefined ? '  ' + JSON.stringify(info).slice(0, 500) : '')); } };
const browser = await chromium.launch();
const errors = [];
// A stand-in voice that takes 12 ms a character, reports speaking and pending as a device's does, and records what it said, so a
// welcome runs in seconds and its words can be read; what it says while the welcome's pointer is asking the game's question is kept
// apart too (window.__saidAsking), so a question said before the welcome began can never pass for the pointer's.
const VOICE = () => {
  window.__eduIntroPace = 0;   // the caption's reading floor dropped, so a welcome takes as long as its voice and its acts (ui.jsx, introPace)
  const said = []; window.__said = said; window.__saidAsking = []; let queue = []; let busy = false;
  const next = () => { if (busy || !queue.length) return; const u = queue.shift(); busy = true; said.push(u.text); try { if (window.__eduIntro && window.__eduIntro.asking) window.__saidAsking.push(u.text); } catch (e) { /* only this test reads it */ } setTimeout(() => { if (u.onstart) u.onstart({}); setTimeout(() => { busy = false; if (u.onend) u.onend({}); next(); }, Math.max(120, u.text.length * 12)); }, 10); };
  Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: { get speaking() { return busy; }, get pending() { return queue.length > 0; }, speak(u) { queue.push(u); next(); }, cancel() { queue = []; }, getVoices() { return []; }, addEventListener() {}, removeEventListener() {} } });
};
// The test page as a phone loads it: with the viewport line the real page has (tools/build-site.mjs), since a phone lays a page
// out without one at 980 pixels and scales it down (round one's screen check: the phone section had not been a phone layout).
const PHONE_PAGE = new URL('./out/page-phone.html', import.meta.url);
mkdirSync(new URL('./out/', import.meta.url), { recursive: true });
writeFileSync(PHONE_PAGE, readFileSync(new URL('./page.html', import.meta.url), 'utf8').replace('<head>', '<head><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">'));
// An educator, one early-years student, signed in as her (as tests/e2e/play-and-read.mjs does).
const signIn = async (page, id, url = new URL('./page.html', import.meta.url).href, voice = true) => {
  const screenIs = (n) => page.waitForFunction((x) => window.__eduTest && window.__eduTest.screen === x, n, { timeout: 15000 });
  const tapIf = async (name) => { const b = page.getByRole('button', { name, exact: true }); if (await b.count()) { await b.first().click(); await page.waitForTimeout(300); return true; } return false; };
  await page.goto(url);
  await page.getByRole('button', { name: 'Create account', exact: true }).first().click(); await screenIs('educator-setup');
  await page.fill('input[placeholder="PIN"]', '2468'); await page.fill('input[placeholder="PIN again"]', '2468'); await page.fill('input[placeholder="This device\'s name"]', 'Intro'); await page.selectOption('select[aria-label="Your state"]', 'TX');
  await page.getByRole('button', { name: 'Create account', exact: true }).click(); await screenIs('educator-pick'); await page.waitForTimeout(400);
  await tapIf('Skip tour'); await tapIf('Later'); await tapIf('Got it');
  await page.getByRole('button', { name: 'Add someone new' }).first().click(); await page.waitForTimeout(300);
  await page.fill('input[placeholder="School-issued ID"]', id); await page.getByRole('button', { name: /^Early years/ }).first().click(); await page.waitForTimeout(200);
  await page.getByRole('button', { name: 'Add', exact: true }).click(); await page.waitForTimeout(400); await tapIf('Later');
  await page.getByRole('button', { name: 'Home' }).first().click(); await page.waitForTimeout(400);
  await page.getByRole('button', { name: new RegExp(`${id}$`) }).first().click(); await page.waitForTimeout(800); await tapIf('Later');
  if (voice) await page.evaluate(VOICE);
  return { screenIs, tapIf };
};
const pad = (page) => page.evaluate(() => { const el = document.querySelector('[data-game-pad]'); return el ? el.getAttribute('data-game-pad') : null; });
const left = (page) => page.evaluate(() => { const el = document.querySelector('[data-play-left]'); return el ? Number(el.getAttribute('data-play-left')) : null; });
const until = (page, fn, arg, ms = 60000) => page.waitForFunction(fn, arg, { timeout: ms }).then(() => true).catch(() => false);
// The voice is handed a line a sentence at a time (speechPieces), so what it said is read joined up.
const flat = (t) => String(t).replace(/\s+/g, ' ').trim();
const heardAll = (said, line) => flat(said.join(' ')).includes(flat(line));
const introDone = (page) => until(page, () => { const el = document.querySelector('[data-game-pad]'); return !!el && el.getAttribute('data-game-pad') !== 'intro'; }, null, 90000);
// Presses a button, found by its name, in the very frame the pointer's ask has the game's question said, and says whether it did:
// a click sent from the test a moment after it saw the ask could land once the ask was over, and the checks below had passed on a
// copy with round one's fault put back (round two's second read). The checks then wait a second, past the ask's own last steps
// (it waits 350 ms after its press, and its question for up to 7 seconds in 120 ms steps), so a hush the ask gives back late has
// come back before the game's voice is tried.
const pressDuringAsk = (page, name, ms = 30000) => page.evaluate(([n, limit]) => new Promise((done) => { const t0 = Date.now(); const tick = () => { const asking = !!(window.__eduIntro && window.__eduIntro.asking); const b = [...document.querySelectorAll('button')].find((x) => (x.getAttribute('aria-label') || x.textContent.trim()) === n); if (asking && b) { b.click(); done(true); } else if (Date.now() - t0 > limit) done(false); else requestAnimationFrame(tick); }; tick(); }), [name, ms]);

// ---- A phone: a touch screen, no keyboard ----
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await ctx.newPage(); page.on('pageerror', (e) => errors.push(String(e).slice(0, 300)));
  const { screenIs } = await signIn(page, 'S-71', PHONE_PAGE.href);
  const star = L.GAMES.find((g) => g.id === 'dots-star'); const words = L.gameIntro(star);
  const openPlay = async () => { const fold = page.getByRole('button', { name: "Let's Play", exact: true }); if (await fold.count() && (await fold.first().getAttribute('aria-expanded')) !== 'true') { await fold.first().click(); await page.waitForTimeout(300); } };
  await openPlay();
  // (A tile breathes, so it is never still: the taps are forced.)
  // 1. A real tap on the tile opens the game on its welcome: the board under a pointing hand, the first line said and shown.
  await page.getByRole('button', { name: `Play ${star.title}`, exact: true }).first().click({ force: true }); await screenIs('coloring');
  await until(page, () => !!document.querySelector('[data-game-intro]'), null, 5000);
  ok('a game opened from its tile opens on its welcome, the board playing itself under a pointing hand on a touch screen', (await pad(page)) === 'intro' && (await page.locator('[data-intro-stage] .edu-game-box').count()) === 1 && (await page.locator('[data-demo-pointer="hand"]').count()) === 1, await pad(page));
  await until(page, () => (window.__said || []).length > 0, null, 5000);
  const caption = (await page.locator('[data-intro-caption]').textContent()) || '';
  const firstSaid = await page.evaluate(() => window.__said[0]);
  ok('the voice says the welcome\'s first line and the caption shows it, Skip beside it', words[0].say.startsWith(firstSaid) && caption === words[0].say && (await page.getByRole('button', { name: 'Skip the instructions' }).isVisible()), { firstSaid, caption });
  // 2. A child's own tap on the board does nothing while the welcome plays it (the pointer's taps are the only ones it takes).
  const leftAtStart = await left(page);
  const target = await page.evaluate(() => { const el = document.querySelector('[data-intro-stage] [data-demo-tap]'); if (!el) return null; el.setAttribute('data-test-mark', '1'); const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
  if (target) { await page.touchscreen.tap(target.x, target.y); await page.mouse.click(target.x, target.y); }
  await page.waitForTimeout(250);
  ok('a child\'s own taps on the board do nothing while the welcome plays it', !!target && (await page.evaluate(() => { const el = document.querySelector('[data-intro-stage] [data-demo-tap]'); return !!el && el.getAttribute('data-test-mark') === '1'; })));
  await page.waitForTimeout(2500);
  ok('the play clock waits while the welcome plays', leftAtStart !== null && (await left(page)) === leftAtStart, { leftAtStart, now: await left(page) });
  // 3. It plays to its end: every step found what it needed, every line was said, and Begin waits with no moving note (a dot
  // picture does not move); the clock still waits.
  await introDone(page);
  const log = await page.evaluate(() => window.__eduIntro);
  const said = await page.evaluate(() => window.__said.slice());
  ok('the welcome plays to its end: every step of the demonstration done, every line said in order, then Begin', (await pad(page)) === 'ready' && log && log.done && !log.skipped && log.acts.length >= words.length && log.acts.every((a) => a.ok) && flat(said.join(' ')) === flat(words.map((w) => w.say).join(' ')) && (await page.locator('[data-begin-cover]').count()) === 1 && (await page.locator('[data-begin-note]').count()) === 0, { log, said: said.slice(0, 6) });
  // Begin pulses, as the button that invites the next tap does, and for a young learner sends out its ring in the paper's deep green
  // (round two's alignment read: Begin had no cue; the dark theme's mint ring would all but vanish on the pale paper).
  const beginCue = await page.evaluate(() => { const b = document.querySelector('[data-begin-cover] button'); if (!b) return null; const after = getComputedStyle(b, '::after'); return { pulse: b.classList.contains('edu-pulse'), young: document.documentElement.dataset.young, ring: after.borderTopColor, width: after.borderTopWidth, anim: getComputedStyle(b).animationName }; });
  ok('Begin pulses for a young learner, its ring the paper\'s deep green', !!beginCue && beginCue.pulse && beginCue.young === '1' && beginCue.ring === 'rgba(47, 93, 79, 0.9)' && beginCue.width === '3px' && /edu-pulse/.test(beginCue.anim), beginCue);
  // The ring is seen, not only set: over one two-second cycle its ripple rises past half its strength (each ripple starts at 0.8 of
  // the border's 0.9), so a ripple stuck at nothing fails (round three's second read: the check had read only its colour, width and
  // the animation's name).
  const ringPeak = await page.evaluate(() => new Promise((done) => { const b = document.querySelector('[data-begin-cover] button'); let peak = 0; const t0 = performance.now(); const tick = () => { if (!b || !b.isConnected) { done(peak); return; } peak = Math.max(peak, Number(getComputedStyle(b, '::after').opacity) || 0); if (performance.now() - t0 < 2200) requestAnimationFrame(tick); else done(peak); }; tick(); }));
  ok('Begin\'s ring shows: over one cycle its ripple rises past half its strength', ringPeak > 0.5, ringPeak);
  ok('the pointer and the caption leave with the welcome', (await page.locator('[data-demo-pointer]').count()) === 0 && (await page.locator('[data-intro-caption]').count()) === 0);
  // 4. Begin starts the game itself, a fresh board, and the clock runs.
  const leftAtBegin = await left(page);
  await page.getByRole('button', { name: 'Begin' }).click({ force: true }); await page.waitForTimeout(300);
  ok('Begin starts the game itself on a fresh board', (await pad(page)) === 'play' && (await page.locator('[data-dots-board]').count()) === 1 && (await page.locator('[data-demo-tap]').count()) === 0);
  await page.waitForTimeout(2300);
  ok('the play clock runs once the game begins', (await left(page)) < leftAtBegin, { leftAtBegin, now: await left(page) });
  // 5. The round arrow only resets the game: no welcome comes back.
  await page.getByRole('button', { name: 'Play again' }).click(); await page.waitForTimeout(500);
  ok('the round arrow resets the game and never plays the welcome again (Mikey: "only resets game")', (await pad(page)) === 'play' && (await page.locator('[data-game-intro]').count()) === 0);
  // 6. The speaker says the instructions again, with no demonstration, and leaves out the keyboard's line on a touch screen.
  await page.evaluate(() => { window.__said.length = 0; });
  await page.getByRole('button', { name: 'Hear the instructions' }).click();
  await until(page, (line) => (window.__said || []).join(' ').replace(/\s+/g, ' ').includes(line), flat(words[1].say), 8000);
  const heard = flat(await page.evaluate(() => window.__said.join(' ')));
  ok('the speaker says the welcome\'s words again, with no demonstration', heard.startsWith(flat(`${words[0].say} ${words[1].say}`)) && (await pad(page)) === 'play' && (await page.locator('[data-game-intro]').count()) === 0, heard.slice(0, 200));
  await page.getByRole('button', { name: 'Stop reading' }).click().catch(() => {});
  // 7. Close, and the next visit plays the welcome again.
  await page.getByRole('button', { name: 'Close game' }).click(); await screenIs('overview'); await page.waitForTimeout(400); await openPlay();
  await page.getByRole('button', { name: `Play ${star.title}`, exact: true }).first().click({ force: true }); await screenIs('coloring'); await page.waitForTimeout(400);
  ok('leaving the game and coming back plays the welcome again (Mikey: "requires a full exit and re-entrance")', (await pad(page)) === 'intro');
  // 8. Skip ends it at once: Begin, no pointer, the voice hushed.
  await page.waitForTimeout(600);
  await page.getByRole('button', { name: 'Skip the instructions' }).click(); await page.waitForTimeout(300);
  const saidAtSkip = await page.evaluate(() => window.__said.length); await page.waitForTimeout(1500);
  ok('Skip ends the welcome at once: Begin, no pointer, and nothing more said', (await pad(page)) === 'ready' && (await page.locator('[data-demo-pointer]').count()) === 0 && (await page.evaluate(() => window.__eduIntro.skipped)) === true && (await page.evaluate(() => window.__said.length)) === saidAtSkip);
  // 9. The Instructions link in the welcome ends it and shows the written instructions, as it always has.
  await page.getByRole('button', { name: 'Close game' }).click(); await screenIs('overview'); await page.waitForTimeout(400); await openPlay();
  await page.getByRole('button', { name: `Play ${star.title}`, exact: true }).first().click({ force: true }); await screenIs('coloring'); await page.waitForTimeout(800);
  await page.getByRole('button', { name: 'Instructions', exact: true }).click(); await page.waitForTimeout(400);
  ok('the Instructions link shows the written instructions and ends the welcome (Mikey: "just displays the instructions through the popup as it does now")', (await page.getByRole('dialog', { name: 'Instructions' }).count()) === 1 && (await pad(page)) === 'ready');
  await page.getByRole('button', { name: 'Got it' }).click(); await page.waitForTimeout(300);
  // 10. The round arrow in the welcome goes straight to Begin, and the welcome does not start over.
  await page.getByRole('button', { name: 'Close game' }).click(); await screenIs('overview'); await page.waitForTimeout(400); await openPlay();
  await page.getByRole('button', { name: `Play ${star.title}`, exact: true }).first().click({ force: true }); await screenIs('coloring'); await page.waitForTimeout(800);
  await page.getByRole('button', { name: 'Play again' }).click(); await page.waitForTimeout(800);
  ok('the round arrow during the welcome goes to Begin and never starts the welcome over', (await pad(page)) === 'ready' && (await page.locator('[data-game-intro]').count()) === 0);
  // 11. Pong moves, so its Begin keeps the moving note; the welcome comes first there too (opened by the test hook, since Pong is
  // from grade 2 and this student is in the early years).
  await page.getByRole('button', { name: 'Close game' }).click(); await screenIs('overview'); await page.waitForTimeout(400);
  await page.evaluate(() => window.__eduTest.openColoring('play:pong', { intro: true })); await screenIs('coloring'); await page.waitForTimeout(400);
  const pongIntro = (await pad(page)) === 'intro';
  await introDone(page);
  const pongLog = await page.evaluate(() => window.__eduIntro);
  ok('Pong opens on its welcome, the paddle follows the ball, and its Begin keeps the line that it moves once Begin is tapped', pongIntro && (await pad(page)) === 'ready' && pongLog.acts.every((a) => a.ok) && (await page.locator('[data-begin-note]').count()) === 1, pongLog);
  // 12. A map waiting for its painting, and Quick fire with nothing to ask, open with no welcome (no board is there to play).
  await page.getByRole('button', { name: 'Close game' }).click(); await screenIs('overview'); await page.waitForTimeout(300);
  await page.evaluate(() => window.__eduTest.openColoring('play:map-continents', { intro: true })); await screenIs('coloring'); await page.waitForTimeout(400);
  const mapPad = await pad(page);
  await page.getByRole('button', { name: 'Close game' }).click(); await screenIs('overview'); await page.waitForTimeout(300);
  await page.evaluate(() => window.__eduTest.openColoring('play:sprint-math', { intro: true })); await screenIs('coloring'); await page.waitForTimeout(400);
  ok('a map waiting for its painting, and Quick fire with nothing to ask yet, open with no welcome', mapPad === 'play' && (await pad(page)) === 'play', { mapPad, sprint: await pad(page) });
  await page.getByRole('button', { name: 'Close game' }).click(); await screenIs('overview');
  // 13. Which Sense on a touch screen: no keyboard line, no key press, and no numbers under the senses.
  await page.evaluate(() => window.__eduTest.openColoring('play:sense-psychology-k', { intro: true })); await screenIs('coloring'); await page.waitForTimeout(400);
  await introDone(page);
  const touchLog = await page.evaluate(() => window.__eduIntro);
  const touchSaid = await page.evaluate(() => window.__said.join(' '));
  ok('on a touch screen Which Sense\'s welcome leaves out the number keys, and the numbers under the senses stay hidden', touchLog.acts.every((a) => a.ok) && !touchLog.acts.some((a) => a.act === 'key') && !touchSaid.includes('number from 1 to 5') && (await page.locator('.edu-key-hint').first().isVisible().catch(() => false)) === false, touchLog);
  // 14. Skip in the very moment the pointer has the game's own question said (its hush lifted for that): the game's words are not
  // left silent afterwards (the welcome had put its hush back after its own cleanup, and every voice in the app stayed quiet).
  await page.getByRole('button', { name: 'Close game' }).click(); await screenIs('overview'); await page.waitForTimeout(300);
  await page.evaluate(() => window.__eduTest.openColoring('play:sense-psychology-k', { intro: true })); await screenIs('coloring');
  const asking = await pressDuringAsk(page, 'Skip the instructions', 20000); await page.waitForTimeout(1000);
  await page.evaluate(() => { window.__said.length = 0; });
  await page.getByRole('button', { name: 'Begin' }).click({ force: true });
  const spoke = await until(page, () => (window.__said || []).some((t) => /^Which sense tells you about /.test(t)), null, 5000);
  ok('Skip while the pointer has the question said leaves the game\'s own voice working after Begin', asking && spoke, { asking, said: await page.evaluate(() => window.__said.slice(0, 4)) });
  await ctx.close();
}

// ---- A computer: a mouse and a keyboard, a wide window ----
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 } });
  const page = await ctx.newPage(); page.on('pageerror', (e) => errors.push(String(e).slice(0, 300)));
  const { screenIs } = await signIn(page, 'S-72');
  const openGame = async (id, intro = true) => { await page.evaluate(([g, i]) => window.__eduTest.openColoring('play:' + g, { intro: i }), [id, intro]); await screenIs('coloring'); await page.waitForTimeout(300); };
  const closeGame = async () => { await page.getByRole('button', { name: 'Close game' }).click(); await screenIs('overview'); await page.waitForTimeout(300); };
  const sense = L.GAMES.find((g) => g.id === 'sense-psychology-k'); const words = L.gameIntro(sense);
  const asksSense = /^Which sense tells you about /;
  await openGame('sense-psychology-k');
  ok('on a computer the pointer is an arrow', (await page.locator('[data-demo-pointer="arrow"]').count()) === 1);
  // The board's own question waits for the welcome (round one's checks: Which Sense said its question as it opened, and the
  // welcome's first line cut it off): the first words said are the welcome's.
  await until(page, () => (window.__said || []).length > 0, null, 5000);
  const firstWords = await page.evaluate(() => window.__said[0]);
  ok("the board's own question waits for the welcome: the first words said are the welcome's", words[0].say.startsWith(firstWords) && !asksSense.test(firstWords), firstWords);
  // The key: shown on the screen while the board takes it. The welcome's board, measured for Begin's size below.
  let keySeen = false; let boardH = null;
  for (let i = 0; i < 160 && !keySeen; i++) { keySeen = await page.evaluate(() => { const k = document.querySelector('[data-demo-keycap]'); return !!k && Number(getComputedStyle(k).opacity) > 0.5 && /^[1-5]$/.test(k.textContent); }); if (boardH === null) boardH = await page.evaluate(() => { const b = document.querySelector('[data-intro-stage] .edu-game-box'); return b ? b.getBoundingClientRect().height : null; }); if (!keySeen) await page.waitForTimeout(150); if ((await pad(page)) !== 'intro') break; }
  // The speaker by the question: no border, like the page's other icons (Mikey: "I don't want any kind of border around it").
  const speakerBorder = await page.evaluate(() => { const b = document.querySelector('[data-intro-stage] [data-demo-replay]'); if (!b) return null; const cs = getComputedStyle(b); return { width: cs.borderTopWidth, style: cs.borderTopStyle, bg: cs.backgroundColor }; });
  await introDone(page);
  const log = await page.evaluate(() => window.__eduIntro);
  const said = await page.evaluate(() => window.__said.slice());
  ok('on a computer Which Sense\'s welcome says every line, the number line too, and shows the key pressed on the screen', words.every((w) => heardAll(said, w.say)) && keySeen && log.acts.some((a) => a.act === 'key' && a.ok), { keySeen, acts: log.acts });
  ok('every step of Which Sense\'s demonstration found what it needed, the question asked again by its speaker', log.acts.every((a) => a.ok) && log.acts.filter((a) => a.act === 'ask').length >= 2, log.acts);
  ok('the speaker beside the question has no border', !!speakerBorder && (speakerBorder.width === '0px' || speakerBorder.style === 'none'), speakerBorder);
  // The game's own question is said while the pointer presses its speaker (the welcome's hush lifted just for that), counted only
  // while it is asking, so a question said before the welcome could never pass for it (round one's code check: the old count did).
  const asked = await page.evaluate(() => window.__saidAsking.slice());
  ok('the question itself is heard while the pointer taps the speaker beside it', asked.some((t) => asksSense.test(t)), asked);
  // Begin covers the welcome board's own space (round one's screen check: a square Begin under a board 210 high moved the page).
  const coverH = await page.evaluate(() => { const c = document.querySelector('[data-begin-cover]'); return c ? c.getBoundingClientRect().height : null; });
  ok('Begin covers the space the welcome\'s board took, so the page does not jump', boardH !== null && coverH !== null && Math.abs(coverH - Math.max(170, boardH)) <= 2, { boardH, coverH });
  await page.getByRole('button', { name: 'Begin' }).click({ force: true }); await page.waitForTimeout(400);
  const hints = await page.locator('.edu-key-hint').evaluateAll((els) => els.map((e) => ({ shown: getComputedStyle(e).display !== 'none', text: e.textContent.trim() })));
  ok('on a computer the numbers 1 to 5 sit under the five senses', hints.length === 5 && hints.every((h, i) => h.shown && h.text === String(i + 1)), hints);
  // Close, and the round arrow, while the pointer has the question said: the game's voice still works afterwards (Skip is read on
  // the phone above), for the next game and after Begin.
  await closeGame(); await openGame('sense-psychology-k');
  const asking1 = await pressDuringAsk(page, 'Close game'); await screenIs('overview'); await page.waitForTimeout(1000); await page.evaluate(() => { window.__said.length = 0; });
  await openGame('sense-psychology-k', false);
  const spoke1 = await until(page, () => (window.__said || []).some((t) => /^Which sense tells you about /.test(t)), null, 5000);
  ok('Close while the pointer has the question said leaves the voice working for the next game', asking1 && spoke1, { asking1, said: await page.evaluate(() => window.__said.slice(0, 4)) });
  await closeGame(); await openGame('sense-psychology-k');
  const asking2 = await pressDuringAsk(page, 'Play again'); await page.waitForTimeout(1000);
  await page.evaluate(() => { window.__said.length = 0; });
  await page.getByRole('button', { name: 'Begin' }).click({ force: true });
  const spoke2 = await until(page, () => (window.__said || []).some((t) => /^Which sense tells you about /.test(t)), null, 5000);
  ok('the round arrow while the pointer has the question said goes to Begin, and the game\'s voice works after it', asking2 && spoke2, { asking2, said: await page.evaluate(() => window.__said.slice(0, 4)) });
  // The speaker in the welcome ends it and reads the instructions once it has gone (round one's game check: nothing was said).
  const star = L.GAMES.find((g) => g.id === 'dots-star'); const starWords = L.gameIntro(star);
  await closeGame(); await openGame('dots-star'); await page.waitForTimeout(900);
  await page.evaluate(() => { window.__said.length = 0; });
  await page.getByRole('button', { name: 'Hear the instructions' }).click();
  const readAgain = await until(page, (line) => (window.__said || []).join(' ').replace(/\s+/g, ' ').includes(line), flat(starWords[1].say), 8000);
  ok('the speaker in the welcome ends it and reads the instructions once the welcome has gone', readAgain && (await pad(page)) === 'ready' && (await page.getByRole('button', { name: 'Stop reading' }).count()) === 1, await page.evaluate(() => window.__said.slice(0, 3)));
  await page.getByRole('button', { name: 'Stop reading' }).click().catch(() => {});
  // Tab never takes the focus into the demonstration's board (round one's screen check: it reached the board's own buttons, inside
  // a part a screen reader is told to pass by, and the board's guard held it there).
  await closeGame(); await openGame('sense-psychology-k'); await page.waitForTimeout(600);
  await page.getByRole('button', { name: 'Close game' }).focus();
  let inside = false; for (let i = 0; i < 8; i++) { await page.keyboard.press('Tab'); inside = inside || (await page.evaluate(() => !!(document.activeElement && document.activeElement.closest && document.activeElement.closest('[data-intro-stage]')))); }
  ok('Tab never takes the focus into the demonstration\'s board', !inside);
  // The key step in card games, and the shooter's aim, find their marks on a computer (round one's checks: the key looked once, while
  // the board still showed its last answer, and the shooter found no chip that fit), and the shooter keeps its ships while it shows.
  const kinds = [];
  for (const id of ['valid-philosophy-9', 'tool-business-k', 'ship-even']) {
    await closeGame(); await openGame(id);
    let ships = 3; const t0 = Date.now();
    while ((await pad(page)) === 'intro' && Date.now() - t0 < 90000) { if (id === 'ship-even') { const n = await page.evaluate(() => { const b = document.querySelector('[data-intro-stage] [data-ship-shields]'); return b ? Number(b.getAttribute('data-ship-shields')) : 3; }); ships = Math.min(ships, n); } await page.waitForTimeout(250); }
    const l2 = await page.evaluate(() => window.__eduIntro); kinds.push({ id, acts: l2.acts, ships });
  }
  ok('on a computer the key step finds its key, and the shooter aims at a chip that fits and keeps its ships', kinds.every((k) => k.acts.length > 0 && k.acts.every((a) => a.ok) && k.acts.some((a) => a.act === 'key') && k.ships === 3), kinds);
  // Hold It in Mind's words are still up when the line about them begins (round one's game check: they had hidden before it).
  const recall = L.GAMES.find((g) => g.id === 'recall-psychology-6'); const startLine = L.gameIntro(recall).findIndex((l) => l.starts);
  await closeGame(); await openGame('recall-psychology-6');
  await until(page, (i) => { const el = document.querySelector('[data-game-intro]'); return !!el && Number(el.getAttribute('data-intro-line')) >= i; }, startLine, 30000);
  // The board still counts from four as the line begins: its words have not begun to hide (round two's second read: "hide in" alone
  // passed a copy with the hold taken out, whose board already read "hide in 3").
  const wordsUp = await page.evaluate(() => /hide in 4\b/.test((document.querySelector('[data-intro-stage]') || {}).textContent || ''));
  await introDone(page);
  const recallLog = await page.evaluate(() => window.__eduIntro);
  ok('Hold It in Mind\'s words are still showing when the line about them begins, and its welcome plays through', startLine > 0 && wordsUp && recallLog.acts.every((a) => a.ok), { startLine, wordsUp, acts: recallLog.acts });
  // Less motion asked for: the pointer jumps rather than glides, and the welcome still plays to its end (a drag game).
  await closeGame();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openGame('sort-size');
  await introDone(page);
  const calm = await page.evaluate(() => window.__eduIntro);
  ok('with less motion asked for, the welcome still plays to its end, the drag included', (await pad(page)) === 'ready' && calm.done && calm.acts.every((a) => a.ok) && calm.acts.some((a) => a.act === 'drag'), calm);
  const stillRing = await page.evaluate(() => { const b = document.querySelector('[data-begin-cover] button'); if (!b) return null; const a = getComputedStyle(b, '::after'); return { opacity: Number(a.opacity), anim: a.animationName }; });
  ok('with less motion asked for, Begin\'s ring stays still at 0.85 of its strength', !!stillRing && Math.abs(stillRing.opacity - 0.85) < 0.01 && stillRing.anim === 'none', stillRing);
  // A wrong tap with less motion asked for still shows a sign (the game brief's rule since pass MK; round three's second read: a wrong
  // answer's wobble stops then, and thirty games had shown nothing): Whose Turn Next's wrong name wears a red-brown dashed edge
  // for the moment it would have wobbled.
  await closeGame(); await openGame('turn-speech-k', false);
  const stillSign = await page.evaluate(() => { const box = document.querySelector('[data-turn-answer]'); if (!box) return null; const answer = box.getAttribute('data-turn-answer'); const wrong = [...box.querySelectorAll('button')].find((b) => b.getAttribute('aria-label') && !b.getAttribute('aria-label').includes(answer) && !/speaker|hear/i.test(b.getAttribute('aria-label'))); if (!wrong) return null; wrong.click(); return new Promise((done) => requestAnimationFrame(() => { const cs = getComputedStyle(wrong); done({ label: wrong.getAttribute('aria-label'), answer, wobble: wrong.classList.contains('edu-wobble'), style: cs.outlineStyle, color: cs.outlineColor, width: cs.outlineWidth }); })); });
  ok('with less motion asked for, a wrong tap wears a red-brown dashed edge where it would have wobbled', !!stillSign && stillSign.wobble && stillSign.style === 'dashed' && stillSign.color === 'rgb(185, 99, 74)' && stillSign.width === '3px', stillSign);
  await ctx.close();
}

// ---- A device with no voice (round three's second read: no browser test had read a welcome with nothing to say it) ----
// Which Sense's caption shows the line that asks the child to read the question rather than listen for it (its quiet wording), and
// the welcome leaves out what only a voice can do: the pointer asking the question, the speaker by the question and the closing
// speaker. The lines then stay up for their reading time, about three words a second.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await ctx.newPage(); page.on('pageerror', (e) => errors.push(String(e).slice(0, 300)));
  const { screenIs } = await signIn(page, 'S-76', PHONE_PAGE.href, false);
  // The test page brings a stand-in voice of its own (make-page.mjs), so it is taken away here, once the page has loaded.
  await page.evaluate(() => { Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: undefined }); Object.defineProperty(window, 'SpeechSynthesisUtterance', { configurable: true, value: undefined }); });
  const sense = L.GAMES.find((g) => g.id === 'sense-psychology-k'); const quietLine = L.gameIntro(sense).find((l) => l.quiet).quiet;
  await page.evaluate(() => window.__eduTest.openColoring('play:sense-psychology-k', { intro: true })); await screenIs('coloring');
  const sawQuiet = await until(page, (q) => ((document.querySelector('[data-intro-caption]') || {}).textContent || '') === q, quietLine, 60000);
  await introDone(page);
  const quietLog = await page.evaluate(() => window.__eduIntro);
  ok('with no voice, Which Sense\'s caption asks the child to read the question, and the welcome leaves out the ask and both speakers', sawQuiet && !!quietLog && quietLog.done && quietLog.acts.every((a) => a.ok) && !quietLog.acts.some((a) => ['ask', 'replay', 'speaker'].includes(a.act)) && (await pad(page)) === 'ready', { sawQuiet, quietLine, acts: quietLog && quietLog.acts });
  await ctx.close();
}

// Where Begin and then the board sit once a welcome has gone (round three's second read): Begin's button wholly in what shows, read
// after the page has had time to settle; then Begin pressed in the page itself (a click from the test would scroll it into view
// first), and the board's top in what shows, with its first 120 pixels (all of it, if it is shorter).
const beginThenBoard = async (fr, band) => {
  await (fr.page ? fr.page() : fr).waitForTimeout(1600);
  const v = await band(); const begin = await fr.evaluate(() => { const b = document.querySelector('[data-begin-cover] button'); if (!b) return null; const q = b.getBoundingClientRect(); return { top: Math.round(q.top), bottom: Math.round(q.bottom) }; });
  await fr.evaluate(() => { const b = document.querySelector('[data-begin-cover] button'); if (b) b.click(); }); await (fr.page ? fr.page() : fr).waitForTimeout(1600);
  const v2 = await band(); const board = await fr.evaluate(() => { const g = document.querySelector('[data-game-pad="play"] .edu-game-box'); if (!g) return null; const q = g.getBoundingClientRect(); return { top: Math.round(q.top), bottom: Math.round(q.bottom) }; });
  const ok1 = !!begin && begin.top >= v.top && begin.bottom <= v.bottom; const ok2 = !!board && board.top >= v2.top - 1 && Math.min(board.bottom, board.top + 120) <= v2.bottom;
  return { ok: ok1 && ok2, begin, view: v, board, view2: v2 };
};
// ---- Short screens: Skip stays in reach (round one's screen and game checks: on a phone held sideways, and in Walk the Robot on a
// 375 by 667 phone, it sat below the fold for the whole welcome); one Skip a person or a screen reader can reach, wholly in view ----
// Since round two's alignment read the whole welcome plays at each size too, and no step of it may come to rest under the floating
// Skip or off the window (the page had scrolled a target only to the window's foot, under Skip, and a drag never brought its
// landing into view: Walk the Robot's Go on the 375 by 667 phone, Which Sense's nose on the phone held sideways).
// Since round four: every target the pointer centred lands at the middle of the part it may use (window.__eduIntro.centred, in
// pixels off it; an offset carried into every page had put targets half the floating Skip's bar too low, so the pointer rested under
// it in Name the Feeling); and Pay It Off, whose board in play is taller than its welcome's, keeps its top in view after Begin (the
// browser's scroll anchoring had moved the page to keep the links under the board still, the board's top 14 pixels above the window).
for (const [w, h, id, more] of [[667, 375, 'sense-psychology-k', ['loan-econ-6']], [375, 667, 'walk-tech-k', []]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: true });
  const page = await ctx.newPage(); page.on('pageerror', (e) => errors.push(String(e).slice(0, 300)));
  const { screenIs } = await signIn(page, `S-7${w}`, PHONE_PAGE.href);
  await page.evaluate((g) => window.__eduTest.openColoring('play:' + g, { intro: true }), id); await screenIs('coloring'); await page.waitForTimeout(1500);
  const skips = page.getByRole('button', { name: 'Skip the instructions' }); const n = await skips.count(); const box = n === 1 ? await skips.boundingBox() : null;
  ok(`on a ${w} by ${h} phone (${id}), Skip stays in view while the welcome plays`, n === 1 && !!box && box.y >= 0 && box.y + box.height <= h, { n, box });
  if (n === 1) { await skips.click(); await page.waitForTimeout(400); }
  ok(`on a ${w} by ${h} phone, the Skip in view ends the welcome`, (await pad(page)) === 'ready', await pad(page));
  await page.getByRole('button', { name: 'Close game' }).click(); await screenIs('overview'); await page.waitForTimeout(300);
  await page.evaluate((g) => window.__eduTest.openColoring('play:' + g, { intro: true }), id); await screenIs('coloring');
  await introDone(page);
  const whole = await page.evaluate(() => window.__eduIntro);
  ok(`on a ${w} by ${h} phone, every step of ${id}'s welcome comes to rest in view, never under the floating Skip or off the window`, !!whole && whole.done && whole.acts.length > 0 && whole.acts.every((a) => a.ok) && !(whole.hidden && whole.hidden.length), whole && { acts: whole.acts, hidden: whole.hidden });
  // Once the welcome has gone, Begin is wholly in view, and after Begin, pressed in the page so the test scrolls nothing first, so is
  // the board's top (round three's second read: the pointer had left the page scrolled to the closing line's speaker, and Begin sat
  // above the window after 15 welcomes on a phone held sideways, Share the Cookies' at -25 to 32).
  const shown = await beginThenBoard(page, async () => ({ top: 0, bottom: h }));
  ok(`on a ${w} by ${h} phone, Begin is wholly in view once ${id}'s welcome has gone, and the board's top once Begin is pressed`, shown.ok, shown);
  // Each screen must have centred some targets, so its bound is never read over nothing (round five's second read).
  const centred = (whole && whole.centred) || [];
  ok(`on a ${w} by ${h} phone, ${id}'s pointer centred targets, and every one lands within 4 pixels of the middle of the part it may use`, centred.length > 0 && centred.every((d) => Math.abs(d) <= 4), centred);
  for (const g of more) {
    await page.getByRole('button', { name: 'Close game' }).click({ force: true }); await screenIs('overview'); await page.waitForTimeout(300);
    await page.evaluate((x) => window.__eduTest.openColoring('play:' + x, { intro: true }), g); await screenIs('coloring');
    await introDone(page);
    const placed = await beginThenBoard(page, async () => ({ top: 0, bottom: h }));
    // Scroll anchoring is off only for the switch to play, and back on once the board has been read (round five's second read: in
    // play it holds the answers still under a child's finger).
    const anchor = await page.evaluate(() => document.documentElement.style.overflowAnchor);
    ok(`on a ${w} by ${h} phone, ${g}'s board, taller in play than in its welcome, keeps its top in view after Begin, and scroll anchoring is back on in play`, placed.ok && anchor === '', { placed, anchor });
  }
  await ctx.close();
}
// ---- The claude.ai preview on a laptop: the app in a frame as tall as the page, the page around it scrolling (round two's second
// read: there the window is never short and never scrolls, so Skip had stayed below what showed for a whole welcome and the pointer
// left what showed for the closing speaker). The frame is served from another origin, as the preview's is, and what shows is the
// band the page around it shows: Skip sits in it while the welcome plays, and every step of the welcome comes to rest in it.
{ const http = await import('node:http');
  const html = readFileSync(new URL('./page.html', import.meta.url));
  const server = http.createServer((req, res) => { res.writeHead(200, { 'content-type': 'text/html' }); if (req.url.startsWith('/tall')) res.end(`<!doctype html><meta charset="utf-8"><body style="margin:0"><div style="height:120px"></div><iframe id="app" sandbox="allow-scripts allow-same-origin allow-forms" style="border:0;width:100%;height:5000px;display:block" src="http://127.0.0.1:${server.address().port}/page.html"></iframe><div style="height:600px"></div></body>`); else res.end(html); });
  await new Promise((r) => server.listen(0, r)); const port = server.address().port;
  // Signed in with a taller window, so the sign-in pop-ups fit what shows, then the laptop's 600 pixels for the welcome.
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 1000 } }); const op = await ctx.newPage(); op.on('pageerror', (e) => errors.push(String(e).slice(0, 300)));
  await op.goto(`http://localhost:${port}/tall`);
  const fr = op.frames().find((x) => x.url().includes('127.0.0.1'));
  const { screenIs } = await signIn(fr, 'S-75', `http://127.0.0.1:${port}/page.html`);
  await op.setViewportSize({ width: 1280, height: 600 }); await op.evaluate(() => window.scrollTo(0, 0)); await op.waitForTimeout(500);
  await fr.evaluate(() => window.__eduTest.openColoring('play:walk-tech-k', { intro: true })); await screenIs('coloring'); await op.waitForTimeout(1800);
  const band = async () => { const y = await op.evaluate(() => window.scrollY); return { top: y - 120, bottom: y - 120 + 600 }; };
  const skipShown = await (async () => { const b = await band(); const r = await fr.evaluate(() => { const f = document.querySelector('[data-intro-skip-float] button'); const row = document.querySelector('[data-intro-skip-row] button'); const el = f || row; if (!el) return null; const q = el.getBoundingClientRect(); return { top: Math.round(q.top), bottom: Math.round(q.bottom), float: !!f }; }); return { b, r, ok: !!r && r.top >= b.top && r.bottom <= b.bottom }; })();
  ok('in the claude.ai preview\'s page-tall frame, Skip sits in what shows while the welcome plays', skipShown.ok, skipShown);
  await introDone(fr);
  const framedLog = await fr.evaluate(() => window.__eduIntro);
  ok('in the page-tall frame, every step of Walk the Robot\'s welcome comes to rest in what shows', !!framedLog && framedLog.done && framedLog.acts.every((x) => x.ok) && !(framedLog.hidden && framedLog.hidden.length), framedLog && { acts: framedLog.acts, hidden: framedLog.hidden });
  // Begin, then the board's top, back in what shows once the welcome has gone (round three's second read: Kite's Begin sat at 342 to
  // 398 while what showed was 514 to 1114, after 28 of 59 welcomes in this frame).
  const framedShown = await beginThenBoard(fr, band);
  ok('in the page-tall frame, Begin is wholly in what shows once the welcome has gone, and the board\'s top once Begin is pressed', framedShown.ok, framedShown);
  // Skip, and then Instructions, pressed on Spot It's closing line while the page around the frame is still moving to its speaker
  // (round four's second read: the page went on moving after the welcome had gone, Begin was left above what showed, and the pop-up,
  // which places itself as it opens, half out of it). The press waits for the page to be seen moving, so the case is the one named.
  for (const way of ['Skip the instructions', 'Instructions']) {
    await fr.getByRole('button', { name: 'Close game' }).click({ force: true }); await screenIs('overview'); await op.evaluate(() => window.scrollTo(0, 0)); await op.waitForTimeout(400);
    await fr.evaluate(() => window.__eduTest.openColoring('play:spot-arts-k', { intro: true })); await screenIs('coloring');
    await until(fr, () => { const el = document.querySelector('[data-game-intro]'); const log = window.__eduIntro; return !!el && !!log && Number(el.getAttribute('data-intro-line')) === log.lines - 1; }, null, 60000);
    let moved = false; const t0 = Date.now(); let y0 = await op.evaluate(() => window.scrollY);
    while (!moved && Date.now() - t0 < 4000) { await op.waitForTimeout(30); const y1 = await op.evaluate(() => window.scrollY); moved = Math.abs(y1 - y0) >= 2; y0 = y1; }
    await fr.evaluate((name) => { const b = [...document.querySelectorAll('button')].find((x) => (x.getAttribute('aria-label') || x.textContent.trim()) === name && getComputedStyle(x).visibility !== 'hidden' && x.offsetParent !== null); if (b) b.click(); }, way);
    await op.waitForTimeout(1800);
    const v = await band();
    if (way === 'Instructions') {
      const dialog = await fr.evaluate(() => { const d = document.querySelector('[role="dialog"][aria-label="Instructions"]'); if (!d) return null; const q = d.getBoundingClientRect(); return { top: Math.round(q.top), bottom: Math.round(q.bottom) }; });
      ok('in the page-tall frame, Instructions pressed while the page moves to the closing speaker opens its pop-up wholly in what shows', moved && !!dialog && dialog.top >= v.top && dialog.bottom <= v.bottom, { moved, dialog, v });
      await fr.getByRole('button', { name: 'Got it' }).click({ force: true }); await op.waitForTimeout(1800);
    }
    const v2 = await band(); const begin = await fr.evaluate(() => { const b = document.querySelector('[data-begin-cover] button'); if (!b) return null; const q = b.getBoundingClientRect(); return { top: Math.round(q.top), bottom: Math.round(q.bottom) }; });
    ok(`in the page-tall frame, ${way === 'Instructions' ? 'once the pop-up is closed' : 'Skip pressed while the page moves to the closing speaker leaves'} Begin wholly in what shows`, moved && !!begin && begin.top >= v2.top && begin.bottom <= v2.bottom, { moved, begin, v2 });
  }
  // Instructions pressed once the page has stopped at the closing speaker, Begin's place above what shows: the pop-up stays wholly in
  // what shows, since the page waits for it to close before it brings Begin back, and then Begin comes back (round five's second read:
  // no check had needed that wait).
  { await fr.getByRole('button', { name: 'Close game' }).click({ force: true }); await screenIs('overview'); await op.evaluate(() => window.scrollTo(0, 0)); await op.waitForTimeout(400);
    await fr.evaluate(() => window.__eduTest.openColoring('play:spot-arts-k', { intro: true })); await screenIs('coloring');
    await until(fr, () => { const el = document.querySelector('[data-game-intro]'); const log = window.__eduIntro; return !!el && !!log && Number(el.getAttribute('data-intro-line')) === log.lines - 1; }, null, 60000);
    let moved = false; let still = 0; const t0 = Date.now(); let y0 = await op.evaluate(() => window.scrollY);
    while (still < 4 && Date.now() - t0 < 6000) { await op.waitForTimeout(60); const y1 = await op.evaluate(() => window.scrollY); if (Math.abs(y1 - y0) >= 2) { moved = true; still = 0; } else if (moved) still += 1; y0 = y1; }
    const during = (await pad(fr)) === 'intro';
    // The case named: the board's top, where Begin will sit, is above what shows as Instructions is pressed.
    const vPress = await band(); const boardTop = await fr.evaluate(() => { const b = document.querySelector('[data-intro-stage] .edu-game-box'); return b ? Math.round(b.getBoundingClientRect().top) : null; });
    const yPress = await op.evaluate(() => window.scrollY);
    await fr.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Instructions'); if (b) b.click(); });
    // The page must not move while the pop-up is open: a scroll back to Begin under it moves it, and a short one can still leave the
    // pop-up in view, so the page itself is read, at the press and 1.8 seconds later (the stop as the welcome ends may move it a few
    // pixels, since the test page's own document is a little taller than its frame).
    await op.waitForTimeout(1800); const yLater = await op.evaluate(() => window.scrollY);
    const v = await band(); const dialog = await fr.evaluate(() => { const d = document.querySelector('[role="dialog"][aria-label="Instructions"]'); if (!d) return null; const q = d.getBoundingClientRect(); return { top: Math.round(q.top), bottom: Math.round(q.bottom) }; });
    const above = boardTop !== null && boardTop < vPress.top - 20;   // well above, so a scroll back to it would be a real one (round six)
    ok('in the page-tall frame, Instructions pressed once the page has stopped at the closing speaker, Begin\'s place above what shows, keeps the page still while its pop-up is open, the pop-up wholly in what shows', moved && during && above && Math.abs(yLater - yPress) <= 12 && !!dialog && dialog.top >= v.top && dialog.bottom <= v.bottom, { moved, during, above, boardTop, vPress, yPress, yLater, dialog, v });
    await fr.getByRole('button', { name: 'Got it' }).click({ force: true }); await op.waitForTimeout(1800);
    const v2 = await band(); const begin = await fr.evaluate(() => { const b = document.querySelector('[data-begin-cover] button'); if (!b) return null; const q = b.getBoundingClientRect(); return { top: Math.round(q.top), bottom: Math.round(q.bottom) }; });
    ok('in the page-tall frame, Begin comes back into what shows once that pop-up is closed', !!begin && begin.top >= v2.top && begin.bottom <= v2.bottom, { begin, v2 }); }
  await ctx.close(); server.close(); }
ok('no browser errors during the walk', errors.length === 0, errors.slice(0, 4));
await browser.close();
console.log(`\n${passed} passed, ${failed} failed`);
process.exitCode = failed ? 1 : 0;   // never process.exit(): it can drop the last lines of a piped stdout (2026-09-23)
