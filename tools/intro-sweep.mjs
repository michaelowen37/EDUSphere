// The Wise Human. Copyright (c) 2026. Source-available; not for reuse. See LICENSE.md.
// Every game's welcome, played in the real page (pass MP). In plain terms: the browser test (tests/e2e/game-intro.mjs) walks a few
// games in depth; this tool plays the welcome of one game of every kind (or every game, with --all), the way a child would meet it,
// with a stand-in voice that says each line quickly, and reports each step of the demonstration: whether the pointer found the
// piece it was to tap, drag or follow, and whether the welcome reached Begin. A step that found nothing is printed with its game,
// so a board that lost a mark, or a new game whose welcome asks for something its board never marks, is found before a child meets
// it. Run it when a game or its welcome changes (Mikey, pass MP: "Any new games would then be edited tp match these rules as they
// are created."); one game of every kind takes about twelve minutes, every game about two and a half times as long. Since round two of pass MP a step whose
// pointer comes to rest under the floating Skip or off the window counts as a miss too, and --sideways plays on a phone held sideways
// (667 by 375), where Skip floats. Since round three, once the welcome has gone Begin must sit wholly in the window, and after Begin,
// pressed in the page, the board's top (the pointer had left the page scrolled to the closing line's speaker, Begin out of sight
// after 15 welcomes on a phone held sideways); and --older plays as an elementary student, so Quick fire, which asks only lessons
// from grade 3 up, plays its welcome too (an early-years student's Quick fire has nothing to ask, so it opens with none).
// Run: node tests/e2e/make-page.mjs && node tools/intro-sweep.mjs [--all] [--mouse] [--wide] [--sideways] [--older] [--dark] [gameId,gameId,...]
import { createRequire } from 'node:module'; import { execSync } from 'node:child_process'; import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

// The games to play: the ones named, or one of every kind (the first of each), or every game.
async function main() {
  const G = execSync('npm root -g').toString().trim(); const { chromium } = createRequire(import.meta.url)(`${G}/playwright`);
  const L = await import('../src/logic.mjs');
  const args = process.argv.slice(2); const named = args.find((a) => !a.startsWith('--'));
  const first = new Map(); for (const g of L.GAMES) if (!first.has(g.kind)) first.set(g.kind, g.id);
  const ids = named ? named.split(',') : args.includes('--all') ? L.GAMES.map((g) => g.id) : [...first.values()];
  const wide = args.includes('--wide'); const fine = args.includes('--mouse'); const dark = args.includes('--dark'); const sideways = args.includes('--sideways'); const older = args.includes('--older');
  const browser = await chromium.launch();
  // --sideways is a laptop's short window with a mouse since pass MR: a phone held sideways asks to be turned upright (Mikey's answer to Q71).
  const ctx = await browser.newContext({ viewport: wide ? { width: 1280, height: 860 } : sideways ? { width: 667, height: 375 } : { width: 390, height: 844 }, hasTouch: !fine && !sideways, isMobile: !fine && !wide && !sideways });
  const page = await ctx.newPage();
  const errors = []; page.on('pageerror', (e) => errors.push(String(e).slice(0, 300)));
  // A phone loads the page with the viewport line the real page has (tools/build-site.mjs), as tests/e2e/game-intro.mjs does, since
  // without it a phone lays the page out 980 pixels wide and scales it down (round one's screen check).
  let url = new URL('../tests/e2e/page.html', import.meta.url);
  if (!fine && !wide) { mkdirSync(new URL('../tests/e2e/out/', import.meta.url), { recursive: true }); const phone = new URL('../tests/e2e/out/page-phone.html', import.meta.url); writeFileSync(phone, readFileSync(url, 'utf8').replace('<head>', '<head><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">')); url = phone; }
  await page.goto(url.href);
  const screenIs = (n) => page.waitForFunction((x) => window.__eduTest && window.__eduTest.screen === x, n, { timeout: 15000 });
  const tapIf = async (name) => { const b = page.getByRole('button', { name, exact: true }); if (await b.count()) { await b.first().click(); await page.waitForTimeout(300); return true; } return false; };
  // An educator and one student, as the browser tests make them.
  await page.getByRole('button', { name: 'Create account', exact: true }).first().click(); await screenIs('educator-setup');
  await page.fill('input[placeholder="PIN"]', '2468'); await page.fill('input[placeholder="PIN again"]', '2468'); await page.fill('input[placeholder="This device\'s name"]', 'Sweep'); await page.selectOption('select[aria-label="Your state"]', 'TX');
  await page.getByRole('button', { name: 'Create account', exact: true }).click(); await screenIs('educator-pick'); await page.waitForTimeout(400);
  await tapIf('Skip tour'); await tapIf('Later'); await tapIf('Got it');
  await page.getByRole('button', { name: 'Add someone new' }).first().click(); await page.waitForTimeout(300);
  await page.fill('input[placeholder="School-issued ID"]', 'S-90'); await page.getByRole('button', { name: older ? /^Elementary/ : /^Early years/ }).first().click(); await page.waitForTimeout(200);
  await page.getByRole('button', { name: 'Add', exact: true }).click(); await page.waitForTimeout(400); await tapIf('Later');
  await page.getByRole('button', { name: 'Home' }).first().click(); await page.waitForTimeout(400);
  await page.getByRole('button', { name: /S-90$/ }).first().click(); await page.waitForTimeout(800); await tapIf('Later');
  if (dark) await page.evaluate(() => { try { document.documentElement.setAttribute('data-theme', 'dark'); } catch (e) { /* the light theme stays */ } });
  // A stand-in voice: 12 ms a character, reporting speaking and pending, so a welcome takes seconds.
  await page.evaluate(() => {
    window.__eduIntroPace = 0;   // the caption's reading floor dropped, as the browser test does (ui.jsx, introPace)
    let queue = []; let busy = false;
    const next = () => { if (busy || !queue.length) return; const u = queue.shift(); busy = true; setTimeout(() => { if (u.onstart) u.onstart({}); setTimeout(() => { busy = false; if (u.onend) u.onend({}); next(); }, Math.max(150, u.text.length * 12)); }, 10); };
    Object.defineProperty(window, 'speechSynthesis', { value: { get speaking() { return busy; }, get pending() { return queue.length > 0; }, speak(u) { queue.push(u); next(); }, cancel() { queue = []; }, getVoices() { return []; }, addEventListener() {}, removeEventListener() {} }, configurable: true });
  });
  let bad = 0;
  for (const id of ids) {
    await page.evaluate((g) => window.__eduTest.openColoring('play:' + g, { intro: true }), id); await page.waitForTimeout(300);
    const t0 = Date.now();
    while (Date.now() - t0 < 90000) { const pad = await page.evaluate(() => { const el = document.querySelector('[data-game-pad]'); return el ? el.getAttribute('data-game-pad') : null; }); if (pad !== 'intro') break; await page.waitForTimeout(250); }
    const res = await page.evaluate(() => ({ log: window.__eduIntro || null, pad: document.querySelector('[data-game-pad]').getAttribute('data-game-pad') }));
    const skipped = !res.log || res.log.game !== id;
    const missed = skipped ? [] : res.log.acts.filter((a) => !a.ok); const hidden = skipped ? [] : res.log.hidden || [];
    // Where Begin, then the board, sit once the welcome has gone: read after the page has had time to settle, Begin pressed in the
    // page itself (a click from outside would scroll it into view first), and the board's top with its first 120 pixels in view.
    let placed = null;
    if (!skipped && res.pad === 'ready') {
      await page.waitForTimeout(1400);
      const vh = await page.evaluate(() => window.innerHeight);
      const begin = await page.evaluate(() => { const b = document.querySelector('[data-begin-cover] button'); if (!b) return null; const q = b.getBoundingClientRect(); return [Math.round(q.top), Math.round(q.bottom)]; });
      await page.evaluate(() => { const b = document.querySelector('[data-begin-cover] button'); if (b) b.click(); }); await page.waitForTimeout(1400);
      const board = await page.evaluate(() => { const g = document.querySelector('[data-game-pad="play"] .edu-game-box'); if (!g) return null; const q = g.getBoundingClientRect(); return [Math.round(q.top), Math.round(q.bottom)]; });
      const beginOk = !!begin && begin[0] >= 0 && begin[1] <= vh; const boardOk = !!board && board[0] >= -1 && Math.min(board[1], board[0] + 120) <= vh;
      if (!beginOk || !boardOk) placed = `Begin at ${begin ? begin.join(' to ') : 'none'} and the board's top at ${board ? board[0] : 'none'} in a window ${vh} tall`;
    }
    const ok = skipped ? res.pad !== 'intro' : res.pad === 'ready' && res.log.done && missed.length === 0 && hidden.length === 0 && !placed;
    if (!ok) bad += 1;
    console.log(`${ok ? 'ok  ' : 'MISS'} ${id} ${skipped ? '(no welcome: the board cannot play one here)' : `${((Date.now() - t0) / 1000).toFixed(1)}s, ${res.log.acts.length} steps${missed.length ? `, nothing found for: ${missed.map((a) => a.act).join(', ')}` : ''}${hidden.length ? `, came to rest out of sight: ${hidden.map((h) => h.join(' ')).join('; ')}` : ''}${placed ? `, out of sight after the welcome: ${placed}` : ''}`}`);
    await page.getByRole('button', { name: 'Close game' }).click(); await page.waitForTimeout(400);
  }
  console.log(`\n${ids.length - bad} welcomes played through, ${bad} with a step that found nothing or came to rest out of sight, or Begin or the board out of sight after the welcome${errors.length ? `; browser errors: ${errors.slice(0, 3).join(' | ')}` : ''}`);
  await browser.close();
  process.exitCode = bad || errors.length ? 1 : 0;
}
// Runs only when it is the file being run (its own name, read with endsWith, so a folder with a space in its path still works).
if (process.argv[1] && process.argv[1].endsWith('intro-sweep.mjs')) await main();
