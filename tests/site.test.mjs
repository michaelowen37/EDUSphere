// The standalone page (index.html), the one GitHub Pages serves. Opens it in a real browser, signs in as an educator, adds a student,
// reloads the page, and checks the student is still there. That is the whole promise of
// local-first: what you did survives a reload because it lives in the browser's storage.
import { createRequire } from 'node:module'; import { execSync } from 'node:child_process'; import { pathToFileURL } from 'node:url';
const G = execSync('npm root -g').toString().trim(); const { chromium } = createRequire(import.meta.url)(`${G}/playwright`);
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 390, height: 844 } }); const page = await ctx.newPage();
const errors = []; page.on('pageerror', (e) => errors.push(String(e)));
const url = pathToFileURL('index.html').href;
await page.goto(url);
await page.getByRole('button', { name: 'Create account' }).click();
await page.fill('input[placeholder="PIN"]', '2468');
await page.fill('input[placeholder="PIN again"]', '2468');
await page.fill('input[placeholder="This device\'s name"]', 'Front desk');
await page.selectOption('select[aria-label="Your state"]', 'CA');
await page.getByRole('button', { name: 'Create account', exact: true }).click();
{ const skip = page.getByRole('button', { name: 'Skip tour' }); if (await skip.count()) await skip.click({ force: true }); }
{ const later = page.getByRole('button', { name: 'Later' }); if (await later.count()) await later.click(); }
// The What's new pop-up appears once per build on the real page, on a phone too, and shows the newest block of
// docs/WHATS-NEW.md whole (2026-09-28, pass FR: it had been dark since September 24, when the headings gained spaces).
const { newestNews } = await import('../tools/whats-new.mjs'); const { readFileSync } = await import('node:fs');
const wantNews = newestNews(readFileSync('docs/WHATS-NEW.md', 'utf8'));
await page.waitForTimeout(400);
// One pop-up at a time (pass HL): wait for the first-backup reminder, check What's new is not open beneath it, then answer it.
await page.waitForTimeout(1200);
const reminder = page.getByText('Make your first backup soon');
const oneAtATime = !((await reminder.count()) && (await page.getByRole('dialog', { name: "What's new" }).count()));
if (await reminder.count()) { await page.getByRole('button', { name: 'Later', exact: true }).first().click(); await page.waitForTimeout(500); }
const newsSeen = { shown: (await page.getByRole('dialog', { name: "What's new" }).count()) === 1, text: '' };
// A note keeps its last two words together with a no-break space since pass NT, so the words are read with it as a space.
if (newsSeen.shown) newsSeen.text = (await page.getByRole('dialog', { name: "What's new" }).textContent()).replace(/\u00a0/g, ' ');
// Since pass NU (EARMARKS A173) the educator's countdown chip hides on a phone while any pop-up is open, as under a sheet (Q104), until its
// last ten seconds: What's new is such a pop-up, opened here a few seconds into the educator's minute, so the chip reads 0 under it.
const chipUnderNews = newsSeen.shown ? await page.evaluate(() => { const c = document.querySelector('.edu-logout-chip'); return c ? { opacity: getComputedStyle(c).opacity, lastTen: c.hasAttribute('data-last-ten'), popup: document.body.classList.contains('edu-has-popup') } : null; }) : null;
// More Details (pass HL, Mikey): the pop-up shows short notes and a centered link to a page with every note in full.
const details = { link: (await page.getByRole('button', { name: 'More Details' }).count()) === 1, text: '' };
if (details.link) { await page.getByRole('button', { name: 'More Details' }).click(); await page.waitForTimeout(300); details.text = (await page.textContent('#root')).replace(/\u00a0/g, ' '); await page.getByRole('button', { name: 'Back to Classroom' }).click(); await page.waitForTimeout(300); }
{ const got = page.getByRole('button', { name: 'Got it' }); if (await got.count()) await got.click(); }
await page.waitForTimeout(200);
const newsGone = (await page.getByRole('dialog', { name: "What's new" }).count()) === 0;
const popupAfterNews = await page.evaluate(() => document.body.classList.contains('edu-has-popup'));
await page.getByRole('button', { name: 'Add someone new' }).click();
await page.fill('input[placeholder="School-issued ID"]', 'S-777');
await page.getByRole('button', { name: /^Elementary/ }).click();
await page.getByRole('button', { name: 'Add', exact: true }).click();
await page.waitForTimeout(300);
const before = await page.textContent('#root');
await page.reload();
await page.waitForTimeout(800);
const after = await page.textContent('#root');
let pass = 0, fail = 0;
const ok = (name, cond, info) => { if (cond) { pass++; console.log('PASS -', name); } else { fail++; console.log('FAIL -', name, info ? JSON.stringify(info) : ''); } };
ok('the standalone page runs and a student can be added', before.includes('S-777'));
ok('what was done survives a reload, because it lives in the browser', after.includes('S-777'));
const createOffered = (await page.getByRole('button', { name: 'Create account' }).count()) > 0;
ok('the account, device name and state are remembered too', !createOffered);
ok('no browser errors on the standalone page', errors.length === 0);
// The app's own speech sounds play from blob: addresses (pass MO), so the page's security policy must let media load from blob:;
// without it every sound would end at once on its error and every other check would stay green (round one's code check).
{ const page = readFileSync('index.html', 'utf8'); const csp = (page.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/) || [])[1] || '';
  ok('the standalone page\'s security policy lets the app\'s own sounds play (media-src keeps blob:)', /(?:^|;)\s*media-src [^;]*\bblob:/.test(csp), csp); }
ok("the What's new pop-up opens on a phone with the newest block in short notes, at most four", !!wantNews && newsSeen.shown && newsSeen.text.includes(wantNews.date) && wantNews.brief.slice(0, 4).every((t) => newsSeen.text.includes(t)) && newsGone);
ok('the backup reminder and What\'s new never open at the same time, so every button can be tapped', oneAtATime);
ok("on a phone the educator's countdown chip hides while What's new is open, until its last ten seconds, as under a sheet (pass NU, EARMARKS A173)", !!chipUnderNews && chipUnderNews.popup === true && chipUnderNews.lastTen === false && chipUnderNews.opacity === '0', chipUnderNews);
ok('once What\'s new is closed the body no longer carries edu-has-popup, so the chip shows again (pass NU)', popupAfterNews === false, { popupAfterNews });
ok("More Details opens a page with every note of the newest block in full, and closes the pop-up", details.link && wantNews.items.every((t) => details.text.includes(t)));
const newsAfter = (await page.getByRole('dialog', { name: "What's new" }).count()) === 0;
ok("What's new stays closed after a reload, because Got it was remembered", newsAfter);
// What's new on a laptop (pass MB, Mikey: it opened on his phone and never in Chrome on his Mac). The first week tour runs on
// a wide screen, and its end used to mark the news as seen without showing it. Now it opens after the tour and the
// first-backup reminder, one at a time, the same order a phone has.
{ const wide = await b.newContext({ viewport: { width: 1280, height: 800 } }); const lp = await wide.newPage();
  await lp.goto(url);
  await lp.getByRole('button', { name: 'Create account' }).click();
  await lp.fill('input[placeholder="PIN"]', '2468'); await lp.fill('input[placeholder="PIN again"]', '2468');
  await lp.fill('input[placeholder="This device\'s name"]', 'Laptop'); await lp.selectOption('select[aria-label="Your state"]', 'TX');
  await lp.getByRole('button', { name: 'Create account', exact: true }).click(); await lp.waitForTimeout(1500);
  const toured = (await lp.getByRole('button', { name: 'Skip tour' }).count()) === 1 && (await lp.getByRole('dialog', { name: "What's new" }).count()) === 0;
  await lp.getByRole('button', { name: 'Skip tour' }).click({ force: true }); await lp.waitForTimeout(1200);
  const remind = lp.getByText('Make your first backup soon');
  const waited = (await remind.count()) === 1 && (await lp.getByRole('dialog', { name: "What's new" }).count()) === 0;
  if (await remind.count()) { await lp.getByRole('button', { name: 'Later', exact: true }).first().click(); await lp.waitForTimeout(800); }
  const shown = (await lp.getByRole('dialog', { name: "What's new" }).count()) === 1;
  ok("on a laptop, What's new opens after the tour and then the backup reminder, one at a time (pass MB)", toured && waited && shown);
  await wide.close(); }
// Contact us inside a sandboxed frame (pass MB, from the same report): the claude.ai preview shows the page inside another
// page's frame, which may not open an email app, and desktop Chrome then does nothing. The popup copies the address and,
// when the page is still in front a moment after the tap, says what may have happened. The frame is served from another
// origin than the page around it, as the preview's is, where only the old way of copying works.
{ const http = await import('node:http');
  const html = readFileSync('index.html');
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'content-type': 'text/html' });
    if (req.url.startsWith('/outer')) res.end(`<!doctype html><meta charset="utf-8"><iframe id="app" sandbox="allow-scripts allow-same-origin allow-forms" style="border:0;width:100%;height:760px" src="http://127.0.0.1:${server.address().port}/index.html"></iframe>`);
    else res.end(html);
  });
  await new Promise((r) => server.listen(0, r)); const port = server.address().port;
  const framed = await b.newContext({ viewport: { width: 1280, height: 800 } });
  await framed.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: `http://localhost:${port}` });
  const op = await framed.newPage(); await op.goto(`http://localhost:${port}/outer`);
  const fr = op.frameLocator('#app');
  await fr.getByRole('button', { name: 'Contact us' }).click({ timeout: 30000 });
  const quiet = (await fr.locator('[data-contact-stuck]').count()) === 0;
  await fr.getByText('Open in your email app').click(); await op.waitForTimeout(2000);
  const note = (await fr.locator('[data-contact-stuck]').count()) === 1;
  await fr.getByRole('button', { name: 'Copy the address' }).click(); await op.waitForTimeout(400);
  const copied = (await fr.getByRole('button', { name: 'Copied!' }).count()) === 1;
  let clip = ''; try { clip = await op.evaluate(() => navigator.clipboard.readText()); } catch (e) { clip = String(e).slice(0, 60); }
  ok('in a sandboxed frame, Contact us says when no email app opened and copies the address (pass MB)', quiet && note && copied && clip === 'michaelowen37@gmail.com');
  // The other half: an email app that opens takes the focus from the page, and then no note appears.
  await fr.getByRole('button', { name: 'Close' }).click(); await fr.getByRole('button', { name: 'Contact us' }).click();
  await fr.getByText('Open in your email app').click(); await fr.locator('body').evaluate(() => window.dispatchEvent(new Event('blur')));
  await op.waitForTimeout(2000);
  ok('when an email app takes the focus, Contact us adds no note (pass MB)', (await fr.locator('[data-contact-stuck]').count()) === 0);
  await framed.close(); server.close(); }
// Pop-ups in a frame as tall as the page (pass MB, the code check's second read): the claude.ai preview on Mikey's Mac shows the
// app this way. Every pop-up is drawn by one Overlay, which opens at the top of what shows and then stays put while the page
// around the frame scrolls (educator screens redraw every second, and a box that followed the scroll hid its own buttons).
{ const http = await import('node:http');
  const html = readFileSync('index.html');
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'content-type': 'text/html' });
    if (req.url.startsWith('/tall')) res.end(`<!doctype html><meta charset="utf-8"><body style="margin:0"><div style="height:120px"></div><iframe id="app" sandbox="allow-scripts allow-same-origin allow-forms" style="border:0;width:100%;height:5000px;display:block" src="http://127.0.0.1:${server.address().port}/index.html"></iframe><div style="height:600px"></div></body>`);
    else res.end(html);
  });
  await new Promise((r) => server.listen(0, r)); const port = server.address().port;
  const tall = await b.newContext({ viewport: { width: 1280, height: 560 } }); const op = await tall.newPage();
  await op.goto(`http://localhost:${port}/tall`);
  const fr = op.frames().find((x) => x.url().includes('127.0.0.1'));
  await fr.waitForFunction(() => window.__eduTest && window.__eduTest.screen === 'welcome', null, { timeout: 30000 }); await op.waitForTimeout(1000);   // past the settle-scroll (pass JK)
  // What shows of the frame, in the frame's own pixels, and whether a box sits whole inside it.
  const shows = async (sel) => { const y = await op.evaluate(() => window.scrollY); const r = await fr.evaluate((s) => { const el = document.querySelector(s); if (!el) return null; const q = el.getBoundingClientRect(); return { top: Math.round(q.top), bottom: Math.round(q.bottom) }; }, sel);
    return { r, top: Math.round(y - 120), bottom: Math.round(y - 120 + 560), whole: !!r && r.top >= y - 120 && r.bottom <= y - 120 + 560 }; };
  const tap = (name, last = false) => fr.evaluate(({ n, last }) => { const all = [...document.querySelectorAll('button')].filter((x) => x.textContent.trim() === n); const el = last ? all.pop() : all[0]; if (el) el.click(); return !!el; }, { n: name, last });
  // The welcome page's Contact us, reached by scrolling the page around the frame, opens where it can be seen, the first time too.
  const foot = await fr.evaluate(() => Math.round([...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Contact us').getBoundingClientRect().top));
  await op.evaluate((y) => window.scrollTo(0, y), 120 + foot - 300); await op.waitForTimeout(300);
  await tap('Contact us'); await op.waitForTimeout(500);
  const contact = await shows('[role="dialog"][aria-label="Contact us"]');
  ok('in a page-tall frame, Contact us opens on screen the first time it is tapped (pass MB)', contact.whole && contact.top > 100, { ...contact, foot });
  await tap('×'); await op.evaluate(() => window.scrollTo(0, 0)); await op.waitForTimeout(300);
  // A new educator: Skip tour, Later, then What's new opens on screen, and stays put while the page around the frame scrolls,
  // so a person can scroll down to Got it when the box is taller than what shows.
  await tap('Educator Login'); await op.waitForTimeout(300);
  await fr.fill('input[placeholder="PIN"]', '2468'); await fr.fill('input[placeholder="PIN again"]', '2468');
  await fr.fill('input[placeholder="This device\'s name"]', 'Tall'); await fr.selectOption('select[aria-label="Your state"]', 'TX');
  await tap('Create account'); await fr.waitForSelector('[aria-label="First week tour"]', { timeout: 8000 }); await op.waitForTimeout(500);
  await tap('Skip tour'); await op.waitForTimeout(1300); await tap('Later'); await op.waitForTimeout(1300);
  const news = await shows('[role="dialog"][aria-label="What\'s new"]');
  await op.evaluate(() => window.scrollBy(0, 150)); await op.waitForTimeout(1600);
  const moved = await shows('[role="dialog"][aria-label="What\'s new"]');
  ok("in a page-tall frame, What's new opens at the top of what shows and stays put while the page scrolls (pass MB)", !!news.r && news.r.top >= news.top && news.r.top <= news.top + 40 && !!moved.r && moved.r.top === news.r.top, { news, moved });
  await tall.close(); server.close(); }
// The scroll cue in a frame as tall as the page (pass NF, EARMARKS A100). In plain terms: the cue is fixed to the bottom of the window it is
// drawn in, and decides whether to show by what of the page shows; in a frame as tall as the page (the claude.ai preview) that bottom is the
// page's own foot, so before pass NF the cue for a lesson's line was drawn about 4,400 pixels below what showed, and stayed drawn there once
// the page around the frame scrolled Next into view. The frame here is served from another origin than the page around it, 5,000 pixels tall
// and 120 down, as the pop-ups' frame above is. On a 320 by 568 phone and a 1280 by 560 laptop (where .edu-wrap is zoomed 1.08), an
// educator's walk-through opens Helpers all around, whose first line's Next sits below what shows, and the cue must stand 14 pixels (in the
// zoomed pixels) above the foot of what shows, within a pixel and a half either way; on the phone it must follow that foot when the page
// around the frame scrolls 100 pixels, go away once that page scrolls Next into view, come back at the top, and a tap on it must bring Next
// into view. The fix undone in the frame (the cue's bottom set back to 14 pixels above the frame's own foot by a style that outranks it)
// is planted and caught, by how far below what shows the cue then stands.
{ const http = await import('node:http');
  const html = readFileSync('index.html');
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'content-type': 'text/html' });
    if (req.url.startsWith('/tall')) res.end(`<!doctype html><meta charset="utf-8"><body style="margin:0"><div style="height:120px"></div><iframe id="app" sandbox="allow-scripts allow-same-origin allow-forms" style="border:0;width:100%;height:5000px;display:block" src="http://127.0.0.1:${server.address().port}/index.html"></iframe><div style="height:600px"></div></body>`);
    else res.end(html);
  });
  await new Promise((r) => server.listen(0, r)); const port = server.address().port;
  const seen = {};
  for (const [W, H] of [[320, 568], [1280, 560]]) {
    const ctx = await b.newContext({ viewport: { width: W, height: H }, hasTouch: W < 700 }); const op = await ctx.newPage();
    await op.goto(`http://localhost:${port}/tall`);
    const fr = op.frames().find((x) => x.url().includes('127.0.0.1'));
    await fr.waitForFunction(() => window.__eduTest && window.__eduTest.screen === 'welcome', null, { timeout: 30000 }); await op.waitForTimeout(1000);
    const tap = (name) => fr.evaluate((n) => { const el = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === n || x.getAttribute('aria-label') === n); if (el) el.click(); return !!el; }, name);
    await tap('Educator Login'); await op.waitForTimeout(300);
    await fr.fill('input[placeholder="PIN"]', '2468'); await fr.fill('input[placeholder="PIN again"]', '2468');
    await fr.fill('input[placeholder="This device\'s name"]', 'Cue'); await fr.selectOption('select[aria-label="Your state"]', 'TX');
    await tap('Create account'); await op.waitForTimeout(1500);
    for (const n of ['Skip tour', 'Later', 'Got it', 'Later', 'Got it']) { await tap(n); await op.waitForTimeout(700); }
    await tap('Walk through early years'); await fr.waitForFunction(() => window.__eduTest.screen === 'overview', null, { timeout: 10000 }); await op.waitForTimeout(500);
    await fr.evaluate(() => window.__eduTest.openModule('helpers-all-around')); await fr.waitForFunction(() => window.__eduTest.screen === 'lesson', null, { timeout: 10000 });
    await op.waitForTimeout(700);   // past the settle-scroll (pass JK), which brings the frame's top to the screen's top 80 and 320 ms after a screen opens
    // Where the cue stands against what shows of the frame (the page around it scrolled y, the frame 120 down), in the frame's pixels.
    const at = async (y) => { await op.evaluate((t) => window.scrollTo(0, t), y); await op.waitForTimeout(900);
      const r = await fr.evaluate(() => { const c = document.querySelector('[data-scroll-cue]'); const n = document.querySelector('[data-lesson-next]'); const w = document.querySelector('.edu-wrap');
        return { cue: c ? Math.round(c.getBoundingClientRect().bottom * 10) / 10 : null, next: n ? Math.round(n.getBoundingClientRect().bottom) : null, zoom: w ? parseFloat(getComputedStyle(w).zoom) || 1 : 1 }; });
      const foot = (await op.evaluate(() => window.scrollY)) - 120 + H; return { ...r, foot, want: Math.round((foot - 14 * r.zoom) * 10) / 10 }; };
    const placed = (s) => s.cue !== null && Math.abs(s.cue - s.want) <= 1.5;
    const top = await at(0); seen[`${W} by ${H}`] = { top, placed: placed(top) };
    if (W < 700) {
      const down = await at(100); const nextIn = await at(Math.max(0, top.next + 120 - H + 20)); const back = await at(0);
      // A tap on the cue, where it stands on the screen, scrolls the page around the frame until Next shows.
      const box = await fr.evaluate(() => { const c = document.querySelector('[data-scroll-cue]'); if (!c) return null; const q = c.getBoundingClientRect(); return { x: q.left + q.width / 2, y: q.top + q.height / 2 }; });
      if (box) { await op.mouse.click(box.x, box.y + 120); await op.waitForTimeout(1500); }
      const tapped = await fr.evaluate(() => ({ cue: !!document.querySelector('[data-scroll-cue]'), next: Math.round(document.querySelector('[data-lesson-next]').getBoundingClientRect().bottom) }));
      const shownTo = (await op.evaluate(() => window.scrollY)) - 120 + H;
      // The plant: the cue's bottom set back to the frame's own foot, read at the top, then taken away.
      await op.evaluate(() => window.scrollTo(0, 0)); await op.waitForTimeout(900);
      await fr.evaluate(() => { const s = document.createElement('style'); s.id = 'cue-foot-plant'; s.textContent = '[data-scroll-cue] { bottom: calc(14px + env(safe-area-inset-bottom, 0px)) !important; }'; document.head.appendChild(s); });
      const planted = await at(0); await fr.evaluate(() => { const s = document.getElementById('cue-foot-plant'); if (s) s.remove(); });
      Object.assign(seen[`${W} by ${H}`], { down, follows: placed(down), nextIn, gone: nextIn.cue === null, back, returns: placed(back), tapped, nextShown: !!box && !tapped.cue && tapped.next <= shownTo, plantedBelow: planted.cue === null ? null : Math.round(planted.cue - planted.foot) });
      // Since round one's screen read (pass NF): a practice round after a first wrong tap (p4-soe-first, seed 1) and a story page opened with no
      // voice (Bear hides), each read at the top of the page around the frame, the cue 14 pixels above the foot of what shows.
      await op.evaluate(() => window.scrollTo(0, 0)); await op.waitForTimeout(400);
      const practice = await fr.evaluate(async () => { window.__eduTest.showQuestion('p4-soe-first', 1); for (let k = 0; k < 60 && !(window.__eduTest.screen === 'practice' && window.__eduTest.question); k++) await new Promise((r) => setTimeout(r, 50));
        const q = window.__eduTest.question; if (!q) return null; const c = q.choices.find((x) => x !== q.answer); const b = [...document.querySelectorAll('button[data-choice]')].find((x) => x.getAttribute('data-choice') === c); if (!b) return null; b.click();
        await new Promise((r) => setTimeout(r, 150)); const check = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Check answer'); if (!check) return null; check.click(); return true; });
      const atPractice = practice ? await at(0) : null;
      await fr.evaluate(() => { window.__voice = window.speechSynthesis; Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: undefined }); window.__eduTest.openStory('hear-it-in-a-word'); });
      await op.waitForTimeout(400); const atStory = await at(0);
      await fr.evaluate(() => { Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: window.__voice }); });
      Object.assign(seen[`${W} by ${H}`], { atPractice, practicePlaced: !!atPractice && placed(atPractice), atStory, storyPlaced: placed(atStory) });
    } else {
      // The laptop with the page around the frame scrolled 100 pixels (round one's screen read): the cue follows the foot of what shows.
      const down = await at(100); Object.assign(seen[`${W} by ${H}`], { down, follows: placed(down) }); await op.evaluate(() => window.scrollTo(0, 0));
    }
    await ctx.close();
  }
  server.close();
  const phone = seen['320 by 568']; const laptop = seen['1280 by 560'];
  ok(`in a page-tall frame the scroll cue stands 14 pixels above the foot of what shows, follows it as the page around the frame scrolls, goes away when Next shows and comes back, and a tap on it brings Next into view, and since round one's screen read the same on a practice round after a wrong tap and on a story page, and on the laptop as the page scrolls (pass NF, EARMARKS A100; on a 320 by 568 phone the cue's bottom at ${phone.top.cue} for ${phone.top.want}, and at ${laptop.top.cue} for ${laptop.top.want} on a 1280 by 560 laptop at its zoom of ${laptop.top.zoom}; the fix undone, planted, caught: the cue ${phone.plantedBelow} pixels below what shows)`,
    phone.placed && phone.follows && phone.gone && phone.returns && phone.nextShown && phone.practicePlaced && phone.storyPlaced && laptop.placed && laptop.follows && laptop.top.zoom > 1 && phone.plantedBelow !== null && phone.plantedBelow > 1000, seen); }
// A tour replayed while What's new still waits (pass MB, the screen check): one pop-up at a time (pass HL), and the news
// opens when the tour ends.
{ const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } }); const rp = await ctx.newPage();
  await rp.goto(url);
  await rp.getByRole('button', { name: 'Create account' }).click();
  await rp.fill('input[placeholder="PIN"]', '2468'); await rp.fill('input[placeholder="PIN again"]', '2468');
  await rp.fill('input[placeholder="This device\'s name"]', 'Replay'); await rp.selectOption('select[aria-label="Your state"]', 'TX');
  await rp.getByRole('button', { name: 'Create account', exact: true }).click(); await rp.waitForTimeout(1500);
  await rp.getByRole('button', { name: 'Skip tour' }).click({ force: true }); await rp.waitForTimeout(1200);
  await rp.getByRole('button', { name: 'Backup now', exact: true }).first().click(); await rp.waitForTimeout(800);   // the news keeps waiting
  await rp.getByRole('button', { name: 'Show the first week tour again' }).first().click();
  await rp.waitForSelector('[aria-label="First week tour"]', { timeout: 5000 });
  let overlap = 0; for (let k = 0; k < 6; k++) { if (await rp.getByRole('dialog', { name: "What's new" }).count()) overlap++; await rp.waitForTimeout(250); }
  await rp.getByRole('button', { name: 'Skip tour' }).click({ force: true }); await rp.waitForTimeout(1200);
  const after = await rp.getByRole('dialog', { name: "What's new" }).count();
  ok("a tour replayed while What's new waits keeps one pop-up at a time, and the news opens when it ends (pass MB)", overlap === 0 && after === 1, { overlap, after });
  await ctx.close(); }
// A phone held sideways is asked to turn upright (Mikey, 2026-09-16; his answer to Q71, pass MR: "yeah, let's make users turn the
// phone upright ... Let's make sure it stays too. I was wondering why it stopped one day"). It stopped because its stylesheet rules
// sat inside a block with no selector, which the browser drops whole and silently, so the rule itself is read from the page's own
// stylesheets, and the ask is read on a phone held sideways (shown, covering the screen, in his words), a phone upright, a short
// laptop window and a tablet held sideways (none of them asked), and again on the phone after it is turned upright.
{ const asked = async (p) => p.evaluate(() => { const el = document.getElementById('edu-rotate'); if (!el) return { there: false }; const cs = getComputedStyle(el); const r = el.getBoundingClientRect(); const w = el.querySelector('p'); const k = el.querySelector('button'); const kr = k ? k.getBoundingClientRect() : null; return { there: true, shown: cs.display !== 'none' && cs.visibility !== 'hidden', covers: r.left <= 0 && r.top <= 0 && r.right >= window.innerWidth && r.bottom >= window.innerHeight, words: w ? w.textContent.trim() : '', keep: k ? k.textContent.trim() : null, keepTall: kr ? Math.round(kr.height) : 0, z: Number(cs.zIndex), inert: !!(document.getElementById('root') && document.getElementById('root').hasAttribute('inert')), hidden: !!(document.getElementById('root') && document.getElementById('root').getAttribute('aria-hidden') === 'true'), focused: !!k && document.activeElement === k }; });
  const ruleKept = async (p) => p.evaluate(() => { for (const sheet of document.styleSheets) { let rules = []; try { rules = [...sheet.cssRules]; } catch (e) { continue; } if (rules.some((r) => r.selectorText === '.edu-rotate.edu-rotate-on' && /flex/.test(r.style.display))) return true; } return false; });
  const open = async (opts) => { const ctx = await b.newContext(opts); const p = await ctx.newPage(); await p.goto(url); await p.waitForTimeout(700); return { ctx, p }; };
  const side = await open({ viewport: { width: 844, height: 390 }, screen: { width: 844, height: 390 }, hasTouch: true, isMobile: true });
  const sideAsk = await asked(side.p); const kept = await ruleKept(side.p);
  // A screen reader hears the ask with its link, and a keyboard sees where the link is (round three's screen read, pass MS: the ask
  // was a plain box, so a screen reader met the link with no words before it, and the link took the focus inside Chrome's square
  // black box). The ask is read as the browser's accessibility tree names it, and the link's ring with the focus-visible state forced,
  // since a focus a script moves only sometimes counts as a keyboard's: a rounded ring in the link's own green.
  const heard = await side.p.getByRole('alertdialog', { name: 'Please turn your phone upright.', exact: true }).count();
  const ringOf = async (p) => { const cdp = await p.context().newCDPSession(p); await cdp.send('DOM.enable'); await cdp.send('CSS.enable'); const { root } = await cdp.send('DOM.getDocument');
    const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: '#edu-rotate .edu-rotate-keep' }); if (!nodeId) return null;
    await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: ['focus-visible'] });
    const ring = await p.evaluate(() => { const k = document.querySelector('#edu-rotate .edu-rotate-keep'); const s = getComputedStyle(k); return { style: s.outlineStyle, width: s.outlineWidth, radius: s.borderTopLeftRadius, color: s.outlineColor, ink: s.color }; });
    await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: [] }); await cdp.detach(); return ring; };
  const ring = await ringOf(side.p);
  await side.p.setViewportSize({ width: 390, height: 844 }); await side.p.waitForTimeout(400);
  const turned = await asked(side.p); await side.ctx.close();
  // Keep going sideways (pass MS, Q74 (b)): a tap on the link under the words hides the ask, which stays hidden as the phone turns
  // and turns back, until the app is closed: a reload asks again.
  const stay = await open({ viewport: { width: 844, height: 390 }, screen: { width: 844, height: 390 }, hasTouch: true, isMobile: true });
  const beforeKeep = await asked(stay.p); await stay.p.getByRole('button', { name: 'Keep going sideways', exact: true }).tap(); await stay.p.waitForTimeout(300);
  const afterKeep = await asked(stay.p); await stay.p.setViewportSize({ width: 390, height: 844 }); await stay.p.waitForTimeout(300); await stay.p.setViewportSize({ width: 844, height: 390 }); await stay.p.waitForTimeout(400);
  const turnedBack = await asked(stay.p); await stay.p.reload(); await stay.p.waitForTimeout(700); const reloaded = await asked(stay.p); await stay.ctx.close();
  const up = await open({ viewport: { width: 390, height: 844 }, screen: { width: 390, height: 844 }, hasTouch: true, isMobile: true }); const upAsk = await asked(up.p); await up.ctx.close();
  const laptop = await open({ viewport: { width: 844, height: 390 }, screen: { width: 1440, height: 900 } }); const laptopAsk = await asked(laptop.p); await laptop.ctx.close();
  const tablet = await open({ viewport: { width: 1024, height: 768 }, screen: { width: 1024, height: 768 }, hasTouch: true, isMobile: true }); const tabletAsk = await asked(tablet.p); await tablet.ctx.close();
  // A short upright page on a touch screen whose browser calls the screen landscape (headless Chrome always does; pass MR, check.sh's
  // scroll-cue test found the ask covering its 360 by 480 lesson) is never asked either: the page itself must be wider than tall.
  const shortUp = await open({ viewport: { width: 360, height: 480 }, hasTouch: true }); const shortUpAsk = await asked(shortUp.p); const saysLandscape = await shortUp.p.evaluate(() => !!(screen.orientation && /landscape/.test(screen.orientation.type))); await shortUp.ctx.close();
  // A tablet held sideways whose window a keyboard or split view shortens to 400 pixels is a tablet still, told by its screen's short
  // side, and is never told to turn "your phone" (round one's code check, pass MR: the window's height had decided it).
  const keyboard = await open({ viewport: { width: 1024, height: 400 }, screen: { width: 1024, height: 768 }, hasTouch: true, isMobile: true }); const keyboardAsk = await asked(keyboard.p); await keyboard.ctx.close();
  ok('the ask to turn upright is a rule the browser keeps (read from the page\'s own stylesheets, Q71)', kept);
  ok('a phone held sideways is covered by the ask to turn upright, in Mikey\'s words (Q71)', sideAsk.there && sideAsk.shown && sideAsk.covers && sideAsk.words === 'Please turn your phone upright.' && sideAsk.z >= 9999, sideAsk);
  ok('the ask has a Keep going sideways link a finger can tap, which hides it as the phone turns and turns back, and a reload asks again (Q74)', beforeKeep.shown && beforeKeep.keep === 'Keep going sideways' && beforeKeep.keepTall >= 44 && !afterKeep.shown && !turnedBack.shown && reloaded.shown, { beforeKeep, afterKeep, turnedBack, reloaded });
  // While the ask shows, the app under it is inert and hidden from a screen reader and the link holds the focus; once the ask goes, by
  // the link or by turning upright, the app is back in reach (round one's screen check, pass MS: a keyboard or switch user tabbed
  // through five hidden controls before reaching the link).
  ok('while the ask shows the app under it is out of reach and the link has the focus, and the app comes back when the ask goes (pass MS)', sideAsk.inert && sideAsk.hidden && sideAsk.focused && beforeKeep.inert && beforeKeep.focused && !afterKeep.inert && !afterKeep.hidden && !turnedBack.inert && reloaded.inert && !turned.inert && !turned.hidden && !upAsk.inert, { sideAsk, beforeKeep, afterKeep, turnedBack, reloaded, turned, upAsk });
  ok('the ask is an alert dialog named by its words, and its link\'s keyboard ring is rounded and in its own green (round three\'s screen read, pass MS)', heard === 1 && !!ring && ring.style === 'solid' && ring.width === '2px' && parseFloat(ring.radius) >= 8 && ring.color === ring.ink, { heard, ring });
  ok('turned upright, the ask goes and the app shows (Q71)', turned.there && !turned.shown, turned);
  ok('a phone held upright, a short laptop window and a tablet held sideways are never asked (Q71)', upAsk.there && !upAsk.shown && laptopAsk.there && !laptopAsk.shown && tabletAsk.there && !tabletAsk.shown, { upAsk, laptopAsk, tabletAsk });
  ok('a short upright touch page is never asked, even where the browser calls its screen landscape (pass MR)', saysLandscape && shortUpAsk.there && !shortUpAsk.shown, { saysLandscape, shortUpAsk });
  ok('a tablet held sideways whose window a keyboard shortens is never asked to turn its phone (pass MR)', keyboardAsk.there && !keyboardAsk.shown, keyboardAsk); }
// Since pass NU (round one's screen read, MF2 and SC1): What's new's notes scroll inside its box and Got it and More Details stay at its
// foot, so on a phone held sideways (667 by 375, this page's own context with no touch, so no ask to turn upright) Got it shows whole
// as the pop-up opens, inside the box and the screen, where round one's copy had it 113 pixels below the box's foot, and the box with its
// padding counted and no foot of its own 42, both with the notes as they stood then. Since round two's records read: the notes as
// delivered were shortened after that, and with them Got it shows sideways with or without the foot, so the read is made twice, as the
// pop-up opens and with a long note planted in its list (a block whose notes run long, which the foot is for), taken out again after:
// without the foot the planted note puts Got it below the box, and this check fails.
{ const ctx2 = await b.newContext({ viewport: { width: 667, height: 375 } }); const p2 = await ctx2.newPage(); await p2.goto(url);
  await p2.getByRole('button', { name: 'Create account' }).click(); await p2.fill('input[placeholder="PIN"]', '2468'); await p2.fill('input[placeholder="PIN again"]', '2468');
  await p2.fill('input[placeholder="This device\'s name"]', 'Sideways'); await p2.selectOption('select[aria-label="Your state"]', 'CA');
  await p2.getByRole('button', { name: 'Create account', exact: true }).click();
  { const skip = p2.getByRole('button', { name: 'Skip tour' }); if (await skip.count()) await skip.click({ force: true }); }
  await p2.waitForTimeout(1600); if (await p2.getByText('Make your first backup soon').count()) { await p2.getByRole('button', { name: 'Later', exact: true }).first().click(); await p2.waitForTimeout(600); }
  const readSide = () => p2.evaluate(() => { const d = document.querySelector('[role="dialog"][aria-label="What\'s new"]'); if (!d) return null; const g = [...d.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Got it');
    const dr = d.getBoundingClientRect(); const gr = g && g.getBoundingClientRect(); return { box: [Math.round(dr.top), Math.round(dr.bottom)], got: gr ? [Math.round(gr.top), Math.round(gr.bottom)] : null, h: window.innerHeight }; });
  const inView = (x) => !!x && !!x.got && x.got[0] >= x.box[0] && x.got[1] <= Math.min(x.box[1], x.h) + 0.5;
  const side = await readSide();
  const planted = await p2.evaluate(() => { const ul = document.querySelector('[data-news-brief]'); if (!ul) return false; const li = document.createElement('li'); li.setAttribute('data-planted', '');
    li.textContent = 'A note that runs long, as a block of notes can, so the list grows taller than the box. '.repeat(6); ul.appendChild(li); return true; });
  await p2.waitForTimeout(300); const longSide = await readSide(); await p2.evaluate(() => document.querySelectorAll('[data-planted]').forEach((x) => x.remove()));
  ok("on a phone held sideways (667 by 375) What's new shows Got it whole as it opens, its notes scrolling above it, and with a long note planted in its list Got it stays in the box (pass NU, round one's screen read and round two's records read)", inView(side) && planted && inView(longSide), { side, longSide });
  await ctx2.close(); }
// What's new says that more notes follow (pass NX, EARMARKS A175, round one's screen read: on a phone held sideways the block's third note
// sat wholly below the notes' foot at 740 by 360, so the box looked complete, and showed only the tops of its letters at 667 by 375 and its
// first line, cut mid-sentence, at 844 by 390, in both themes, with nothing to say more followed). In each theme a touch phone held
// sideways opens What's new at 667 by 375, past the ask to turn upright (Keep going sideways), and is then turned to 740 by 360 and 844 by
// 390; at each size: while words run past the notes' foot a cue lies over it, and none shows when every word does; its words sit on the
// box's own color, 4.5 to 1 or better, under a fade from that color; it covers neither Got it nor More Details, lets a finger's touch
// through to the notes and is hidden from a screen reader; and its count is the notes no letter of which shows above it ("1 more note
// below"), or "More below" when what is left is the rest of a note already begun. A long note planted after the pop-up opens is counted at
// once (the list's size is watched); scrolled to their end, the cue goes and the last note shows whole. Turned upright (390 by 844), the
// notes as delivered show no cue, and the long note planted brings it, with the two thresholds pinned on both sides (below). The phones are
// three (one a theme, and one without ResizeObserver), turned rather than opened anew at each size, so the test stays well inside check.sh's limit
// (240 seconds since pass NX; a phone opened anew at each size had taken it to about 160 on a busy machine).
{ const newsRead = (p) => p.evaluate(() => {
    const d = document.querySelector('[role="dialog"][aria-label="What\'s new"]'); if (!d) return null;
    const sc = d.querySelector('[data-news-scroll]'); const s = sc.getBoundingClientRect(); const foot = s.top + sc.clientHeight;
    // How far the lowest word of the notes' scroll runs past its foot, read from every word's own box.
    const rects = []; const walk = document.createTreeWalker(sc, NodeFilter.SHOW_TEXT); let t;
    while ((t = walk.nextNode())) { if (!t.textContent.trim()) continue; const rg = document.createRange(); rg.selectNodeContents(t); for (const q of rg.getClientRects()) if (q.width > 0.5) rects.push(q); }
    const past = rects.length ? Math.max(...rects.map((q) => q.bottom)) - foot : null;
    const cue = d.querySelector('[data-news-more]'); if (!cue) return { past, cue: null };
    const parse = (c) => { const m = String(c).match(/rgba?\(([^)]+)\)/); if (!m) return null; const v = m[1].split(/[\s,/]+/).filter(Boolean).map(Number); return { r: v[0], g: v[1], b: v[2], a: v.length > 3 ? v[3] : 1 }; };
    const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; const lum = (c) => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
    const cr = cue.getBoundingClientRect(); const words = cue.querySelector('p'); const wcs = getComputedStyle(words); const fade = cue.firstElementChild; const fcs = getComputedStyle(fade);
    const ink = parse(wcs.color); const ground = parse(wcs.backgroundColor); const box = parse(getComputedStyle(d).backgroundColor);
    const ratio = ink && ground ? (Math.max(lum(ink), lum(ground)) + 0.05) / (Math.min(lum(ink), lum(ground)) + 0.05) : 0;
    const same = (a, b2) => !!a && !!b2 && a.r === b2.r && a.g === b2.g && a.b === b2.b;
    const stops = [...fcs.backgroundImage.matchAll(/rgba?\([^)]+\)/g)].map((m) => parse(m[0]));
    // Each note by its first line's letters: how far above the cue's top they begin.
    const above = [...sc.querySelectorAll('[data-news-brief] > li')].map((li) => { const rg = document.createRange(); rg.selectNodeContents(li); const first = [...rg.getClientRects()].find((q) => q.width > 0.5); return first ? cr.top - first.top : null; });
    const g = [...d.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Got it').getBoundingClientRect();
    const hit = document.elementFromPoint((cr.left + cr.right) / 2, (cr.top + cr.bottom) / 2);
    return { past, cue: { words: words.textContent.trim(), n: cue.getAttribute('data-news-more'), above, ratio: Math.round(ratio * 100) / 100, ground: same(ground, box) && ground.a === 1,
      fade: /linear-gradient/.test(fcs.backgroundImage) && stops.length === 2 && same(stops[0], box) && stops[0].a === 0 && same(stops[1], box) && stops[1].a === 1 && fade.getBoundingClientRect().height >= 8,
      hidden: cue.getAttribute('aria-hidden') === 'true', through: !!hit && !cue.contains(hit) && sc.contains(hit), clear: cr.bottom <= g.top + 0.5 && cr.top >= s.top - 0.5 && cr.bottom <= foot + 0.5 } };
  });
  // What a read says is wrong (an empty list when nothing is): a cue that must show and does not, or shows and must not; then the cue's own
  // look and its count, which may be any number between the notes surely not begun (no more than 2 pixels of their first line's letters show
  // above it) and those that may not be (no more than 6).
  const newsFaults = (m) => {
    if (!m || m.past === null) return ['no notes'];
    if (!m.cue) return m.past > 3 ? [`words run ${m.past.toFixed(1)} pixels past the notes' foot with no cue`] : [];
    if (m.past < -1) return ['a cue with every word showing'];
    const c = m.cue; const sure = c.above.filter((a) => a !== null && a <= 2).length; const maybe = c.above.filter((a) => a !== null && a < 6).length;
    const said = /^(\d+) more notes? below$/.exec(c.words); const n = said ? Number(said[1]) : c.words === 'More below' ? 0 : -1;
    return [n < 0 && `the cue says "${c.words}"`, n >= 0 && (n < sure || n > maybe) && `the cue counts ${n} where ${sure} to ${maybe} have not begun`, said && (Number(said[1]) === 1) !== !/notes/.test(c.words) && `"${c.words}"`,
      String(n) !== c.n && 'its count and its words differ', c.ratio < 4.5 && `its words ${c.ratio} to 1`, !c.ground && 'its words not on the box\'s own color', !c.fade && 'no fade above its words',
      !c.hidden && 'not hidden from a screen reader', !c.through && 'a touch on it stops there', !c.clear && 'it covers what lies below the notes'].filter(Boolean);
  };
  const plantLong = (p, times) => p.evaluate((k) => { const ul = document.querySelector('[data-news-brief]'); const li = document.createElement('li'); li.setAttribute('data-planted', ''); li.textContent = 'A note that runs long, as a block of notes can, so the list grows taller than the box. '.repeat(k); ul.appendChild(li); return true; }, times);
  const toEnd = (p) => p.evaluate(() => { const sc = document.querySelector('[data-news-scroll]'); sc.scrollTop = sc.scrollHeight; });
  // A plant or a scroll is heard within a frame or two (the list's size watched, the scroll heard), so a read waits 150 ms after one, and 300
  // after a turn of the window.
  const faults = []; const seen = []; let opened = 0;
  // A new touch phone at a size and in a theme, past the ask to turn upright where it is held sideways, an account made, What's new open;
  // noWatch takes the browser's ResizeObserver away before the page loads.
  const openNews = async (theme, w, h, noWatch = false) => {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, screen: { width: w, height: h }, hasTouch: true, isMobile: true });
    await ctx.addInitScript((t) => { try { localStorage.setItem('edusphere_v1_theme', t); } catch (e) { /* storage may be off */ } }, theme);
    if (noWatch) await ctx.addInitScript(() => { delete window.ResizeObserver; });
    const p = await ctx.newPage(); await p.goto(url); await p.waitForTimeout(700);
    const keep = p.getByRole('button', { name: 'Keep going sideways', exact: true }); const asked = w > h && (await keep.count()) === 1 && (await keep.isVisible()); if (asked) { await keep.tap(); await p.waitForTimeout(300); }
    await p.getByRole('button', { name: 'Create account' }).click(); await p.fill('input[placeholder="PIN"]', '2468'); await p.fill('input[placeholder="PIN again"]', '2468');
    await p.fill('input[placeholder="This device\'s name"]', 'Notes'); await p.selectOption('select[aria-label="Your state"]', 'CA');
    await p.getByRole('button', { name: 'Create account', exact: true }).click();
    { const skip = p.getByRole('button', { name: 'Skip tour' }); if (await skip.count()) await skip.click({ force: true }); }
    await p.waitForTimeout(1600); if (await p.getByText('Make your first backup soon').count()) { await p.getByRole('button', { name: 'Later', exact: true }).first().click(); }
    await p.waitForTimeout(900); const open = await newsRead(p); if (open) opened++; return { ctx, p, asked, open };
  };
  // At one size: the pop-up as it shows, then with a long note planted after it opened, then scrolled to the notes' end; then the plant taken
  // out and the notes put back at their top for the next size.
  const checkAt = async (p, at, now) => {
    seen.push({ at, past: now && now.past !== null ? Math.round(now.past) : null, cue: now && now.cue ? now.cue.words : null });
    for (const f of newsFaults(now)) faults.push(`${at}, as it shows: ${f}`);
    await plantLong(p, 6); await p.waitForTimeout(150); const long = await newsRead(p);
    if (!long || !long.cue) faults.push(`${at}: a long note planted and no cue`); for (const f of newsFaults(long)) faults.push(`${at}, a long note planted: ${f}`);
    await toEnd(p); await p.waitForTimeout(150); const end = await newsRead(p);
    if (!end || end.cue || end.past === null || end.past > -1) faults.push(`${at}: at the notes' end ${end && end.cue ? `the cue stays, "${end.cue.words}"` : `the last words ${end && end.past !== null ? end.past.toFixed(1) : '?'} pixels from the foot`}`);
    await p.evaluate(() => { document.querySelectorAll('[data-planted]').forEach((x) => x.remove()); document.querySelector('[data-news-scroll]').scrollTop = 0; }); await p.waitForTimeout(150);
  };
  for (const theme of ['dark', 'light']) {
    // Opened on a phone held sideways (667 by 375), then the window turned to the other two sideways sizes, the ask passed once.
    const { ctx, p, asked, open } = await openNews(theme, 667, 375); if (!asked) faults.push(`${theme}: no ask to turn upright to go past`);
    await checkAt(p, `${theme} 667x375`, open);
    for (const [w, h] of [[740, 360], [844, 390]]) { await p.setViewportSize({ width: w, height: h }); await p.waitForTimeout(300); await checkAt(p, `${theme} ${w}x${h}`, await newsRead(p)); }
    // Turned upright (390 by 844): every note shows and no cue does; the long note planted brings it.
    await p.setViewportSize({ width: 390, height: 844 }); await p.waitForTimeout(300); const at = `${theme} 390x844`;
    const up = await newsRead(p); if (!up || up.cue) faults.push(`${at}: ${up ? `a cue with every note showing, "${up.cue.words}"` : 'no pop-up'}`); for (const f of newsFaults(up)) faults.push(`${at}: ${f}`);
    await plantLong(p, 15); await p.waitForTimeout(150); const long = await newsRead(p); if (!long || !long.cue) faults.push(`${at}: a long note planted and no cue`); for (const f of newsFaults(long)) faults.push(`${at}, a long note planted: ${f}`);
    seen.push({ at, past: up && up.past !== null ? Math.round(up.past) : null, cue: up && up.cue ? up.cue.words : null, planted: long && long.cue ? long.cue.words : null });
    // The cue's two thresholds, each pinned on both sides with the long note planted (a line's letters sit about 3 pixels inside its box):
    // the note scrolled so its box ends 2 pixels past the foot, every letter showing, and no cue, then 7 past, its last letters cut, and a
    // cue; and the notes' foot raised (the box made shorter) so the note's box begins 3 pixels above the cue, no letter of it above, and it
    // is counted, then 12 above, its first letters' tops showing above the cue, and it is not.
    const placed = (pp) => pp.evaluate(() => { const sc = document.querySelector('[data-news-scroll]'); const foot = sc.getBoundingClientRect().top + sc.clientHeight; const r = document.querySelector('[data-planted]').getBoundingClientRect(); return { top: r.top - foot, bottom: r.bottom - foot }; });
    const scrollBy = (pp, y) => pp.evaluate((dy) => { document.querySelector('[data-news-scroll]').scrollTop += dy; }, y);
    const footUp = (pp, y) => pp.evaluate((dy) => { const d = document.querySelector('[role="dialog"][aria-label="What\'s new"]'); d.style.maxHeight = dy ? `${d.getBoundingClientRect().height - dy}px` : '85vh'; }, y);
    const edges = {};
    { const a1 = await placed(p); await scrollBy(p, a1.bottom - 2); await p.waitForTimeout(150); edges.whole = await newsRead(p); await scrollBy(p, -5); await p.waitForTimeout(150); edges.cut = await newsRead(p);
      await p.evaluate(() => { document.querySelector('[data-news-scroll]').scrollTop = 0; }); await p.waitForTimeout(150);
      const b2 = await placed(p); await footUp(p, -(b2.top + 35)); await p.waitForTimeout(150); edges.under = await newsRead(p); await footUp(p, 0); await p.waitForTimeout(150);
      const b3 = await placed(p); await footUp(p, -(b3.top + 44)); await p.waitForTimeout(150); edges.over = await newsRead(p); await footUp(p, 0); await p.waitForTimeout(150); }
    const said = (m) => (m && m.cue ? m.cue.words : null);
    if (!edges.whole || edges.whole.cue || edges.whole.past > -0.5) faults.push(`${at}: every letter showing (${edges.whole && edges.whole.past !== null ? edges.whole.past.toFixed(1) : '?'}), the cue "${said(edges.whole)}"`);
    if (!edges.cut || !edges.cut.cue) faults.push(`${at}: the last letters cut (${edges.cut && edges.cut.past !== null ? edges.cut.past.toFixed(1) : '?'}) and no cue`);
    if (said(edges.under) !== '1 more note below') faults.push(`${at}: the note's box 3 pixels above the cue, the cue "${said(edges.under)}"`);
    if (said(edges.over) !== 'More below') faults.push(`${at}: the note's box 12 pixels above the cue, the cue "${said(edges.over)}"`);
    for (const [k, m] of Object.entries(edges)) for (const f of newsFaults(m)) faults.push(`${at}, placed ${k}: ${f}`);
    await ctx.close();
  }
  // Where the browser has no ResizeObserver (before Safari 13.4): opened on a phone held sideways where the notes run past their foot,
  // the cue shows from the first draw; turned upright it goes, and turned back it comes again, each turn heard by the window's resize.
  // The size is read from the reads above, since each update's block is its own length (the build the final read of pass NX asked for
  // put the November 22 block into the page, which fits at 667 by 375 and 844 by 390 and runs past at 740 by 360): the sideways size
  // where the dark theme's read saw a cue, the notes furthest past, or a window 844 by 300, where any block runs past, if no sideways read
  // saw one. A cue the read saw, not the words' own reach, since the app shows the cue by the notes' box more than NEWS_PAST (4 pixels)
  // past the foot, so words 3 to 5 pixels past can stand with none (the second read of pass NX).
  const turned = {};
  const furthest = seen.filter((s) => s.at.startsWith('dark ') && s.at !== 'dark 390x844' && s.cue).sort((a, b) => b.past - a.past)[0];
  const [sideW, sideH] = furthest ? furthest.at.slice(5).split('x').map(Number) : [844, 300]; turned.size = `${sideW}x${sideH}`;
  { const { ctx, p, asked, open } = await openNews('dark', sideW, sideH, true); const at = 'no ResizeObserver';
    turned.watch = await p.evaluate(() => typeof window.ResizeObserver); if (turned.watch !== 'undefined') faults.push(`${at}: the browser still has one`); if (!asked) faults.push(`${at}: no ask to turn upright to go past`);
    turned.open = open && open.cue ? open.cue.words : null; if (!open || !open.cue) faults.push(`${at}: opened sideways and no cue (${open && open.past !== null ? open.past.toFixed(1) : '?'} pixels past the foot)`); for (const f of newsFaults(open)) faults.push(`${at}, opened sideways: ${f}`);
    await p.setViewportSize({ width: 390, height: 844 }); await p.waitForTimeout(300); const up = await newsRead(p); turned.up = up && up.cue ? up.cue.words : null;
    if (!up || up.cue) faults.push(`${at}: turned upright, ${up ? `the cue stays, "${turned.up}"` : 'no pop-up'}`); for (const f of newsFaults(up)) faults.push(`${at}, turned upright: ${f}`);
    await p.setViewportSize({ width: sideW, height: sideH }); await p.waitForTimeout(300); const back = await newsRead(p); turned.back = back && back.cue ? back.cue.words : null;
    if (!back || !back.cue) faults.push(`${at}: turned back sideways and no cue`); for (const f of newsFaults(back)) faults.push(`${at}, turned back: ${f}`);
    await ctx.close(); }
  ok(`on a phone held sideways, past the ask to turn upright, What's new says that more notes follow while any run past its notes' foot, at 667 by 375 as it opens and at 740 by 360 and 844 by 390 as the phone turns, in both themes, counts the notes not begun, and goes at the notes' end; turned upright with every note showing it shows none (pass NX, EARMARKS A175; ${opened} pop-ups opened, a long note planted at each size, the cue's two thresholds each placed on both sides, and a browser without ResizeObserver opened sideways at ${turned.size}, where the notes run past, and turned)`,
    opened === 3 && faults.length === 0, { faults: faults.slice(0, 8), seen, turned }); }
await b.close();
// What's new's cue leaves the notes' scrollbar uncovered where one is drawn beside them, as a laptop draws it (pass NX, EARMARKS A175). Playwright
// starts headless Chromium with --hide-scrollbars, so no scrollbar takes room in the browser above; this one is started without it, once that
// one is closed (one browser at a time), in a short window with no touch, as a laptop's. With a long note planted the notes scroll, their
// scrollbar takes its room, and the cue's right edge is read against the notes' own.
{ const lb = await chromium.launch({ ignoreDefaultArgs: ['--hide-scrollbars'] }); const lp = await (await lb.newContext({ viewport: { width: 667, height: 375 } })).newPage(); await lp.goto(url);
  await lp.getByRole('button', { name: 'Create account' }).click(); await lp.fill('input[placeholder="PIN"]', '2468'); await lp.fill('input[placeholder="PIN again"]', '2468');
  await lp.fill('input[placeholder="This device\'s name"]', 'Laptop'); await lp.selectOption('select[aria-label="Your state"]', 'CA');
  await lp.getByRole('button', { name: 'Create account', exact: true }).click();
  { const skip = lp.getByRole('button', { name: 'Skip tour' }); if (await skip.count()) await skip.click({ force: true }); }
  await lp.waitForTimeout(1600); if (await lp.getByText('Make your first backup soon').count()) { await lp.getByRole('button', { name: 'Later', exact: true }).first().click(); } await lp.waitForTimeout(900);
  const planted = await lp.evaluate(() => { const ul = document.querySelector('[data-news-brief]'); if (!ul) return false; const li = document.createElement('li'); li.setAttribute('data-planted', ''); li.textContent = 'A note that runs long, as a block of notes can, so the list grows taller than the box. '.repeat(6); ul.appendChild(li); return true; });
  await lp.waitForTimeout(400);
  const bar = await lp.evaluate(() => { const sc = document.querySelector('[data-news-scroll]'); const cue = document.querySelector('[data-news-more]'); if (!sc || !cue) return { sc: !!sc, cue: !!cue }; const s = sc.getBoundingClientRect(); const c = cue.getBoundingClientRect(); return { bar: sc.offsetWidth - sc.clientWidth, right: Math.round(c.right), edge: Math.round(s.left + sc.clientWidth) }; });
  await lb.close();
  ok("where the notes' scrollbar is drawn beside them, as on a laptop, What's new's cue that more notes follow leaves it uncovered (pass NX, EARMARKS A175)", planted && bar.bar > 0 && bar.right <= bar.edge, bar); }
console.log(`\n${pass} passed, ${fail} failed`);
process.exitCode = fail ? 1 : 0;   // never process.exit(): it can drop the last lines of a piped stdout (2026-09-23)
