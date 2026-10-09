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
if (newsSeen.shown) newsSeen.text = await page.getByRole('dialog', { name: "What's new" }).textContent();
// More Details (pass HL, Mikey): the pop-up shows short notes and a centered link to a page with every note in full.
const details = { link: (await page.getByRole('button', { name: 'More Details' }).count()) === 1, text: '' };
if (details.link) { await page.getByRole('button', { name: 'More Details' }).click(); await page.waitForTimeout(300); details.text = await page.textContent('#root'); await page.getByRole('button', { name: 'Back to Classroom' }).click(); await page.waitForTimeout(300); }
{ const got = page.getByRole('button', { name: 'Got it' }); if (await got.count()) await got.click(); }
await page.waitForTimeout(200);
const newsGone = (await page.getByRole('dialog', { name: "What's new" }).count()) === 0;
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
ok("the What's new pop-up opens on a phone with the newest block in short notes, at most four", !!wantNews && newsSeen.shown && newsSeen.text.includes(wantNews.date) && wantNews.brief.slice(0, 4).every((t) => newsSeen.text.includes(t)) && newsGone);
ok('the backup reminder and What\'s new never open at the same time, so every button can be tapped', oneAtATime);
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
await b.close();
console.log(`\n${pass} passed, ${fail} failed`);
process.exitCode = fail ? 1 : 0;   // never process.exit(): it can drop the last lines of a piped stdout (2026-09-23)
