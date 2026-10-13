// The scroll cue on a phone (2026-10-04, pass KA, Mikey's phone screenshots). In plain terms: in a pre-reader's lesson on a
// phone, the row with Next and the star can sit below the screen, where a child who cannot read does not know to look. This
// opens the pre-K lesson First marks on a 360 by 480 touch screen, the part a small phone shows under its browser bars (not isMobile: the test page has no viewport tag, so a
// mobile emulation would lay it out 980 pixels wide) through the educator's walk-through and checks that three
// pulsing arrows show at the bottom while the row is out of sight, that a tap brings the row on screen, and that the arrows
// then go away; then that they come back when the next line starts at the top.
import { createRequire } from 'node:module'; import { pathToFileURL } from 'node:url';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
let passed = 0, failed = 0; const ok = (name, cond, info) => { if (cond) { passed++; console.log('PASS - ' + name); } else { failed++; console.log('FAIL - ' + name + (info ? '  ' + JSON.stringify(info) : '')); } };
const pageUrl = pathToFileURL(new URL('./page.html', import.meta.url).pathname).href;
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 360, height: 480 }, hasTouch: true });
const page = await context.newPage();
await page.goto(pageUrl);
await page.waitForFunction(() => window.__eduTest && window.__eduTest.screen === 'welcome');
// An educator account, then the walk-through of the early years, which opens a pre-reader's overview with nothing saved.
await page.getByRole('button', { name: 'Educator Login' }).click(); await page.waitForTimeout(300);
await page.fill('input[placeholder="PIN"]', '2468'); await page.fill('input[placeholder="PIN again"]', '2468');
await page.fill('input[placeholder="This device\'s name"]', 'Cue'); await page.selectOption('select[aria-label="Your state"]', 'TX');
await page.getByRole('button', { name: 'Create account', exact: true }).click();
await page.waitForFunction(() => window.__eduTest.screen === 'educator-pick'); await page.waitForTimeout(700);
for (const name of ['Skip tour', 'Later', 'Got it', 'Close']) { const b = page.getByRole('button', { name, exact: true }); if (await b.count()) { await b.first().click({ force: true }); await page.waitForTimeout(200); } }
await page.getByRole('button', { name: 'Walk through early years' }).first().click({ force: true });
await page.waitForFunction(() => window.__eduTest.screen === 'overview'); await page.waitForTimeout(500);
await page.evaluate(() => window.__eduTest.openModule('first-marks'));
await page.waitForFunction(() => window.__eduTest.screen === 'lesson'); await page.waitForTimeout(1500);
const look = () => page.evaluate(() => {
  const nav = document.querySelector('[data-lesson-nav]'); const cue = document.querySelector('[data-scroll-cue]');
  const r = nav ? nav.getBoundingClientRect() : null;
  const badge = [...document.querySelectorAll('[role="status"]')].find((x) => /Walkthrough Mode/.test(x.textContent));
  return { navTop: r ? Math.round(r.top) : null, navBottom: r ? Math.round(r.bottom) : null, H: window.innerHeight, cue: !!cue, arrows: cue ? cue.querySelectorAll('.edu-chevron').length : 0, cueBottom: cue ? Math.round(cue.getBoundingClientRect().bottom) : null, cueLeft: cue ? Math.round(cue.getBoundingClientRect().left) : null, W: window.innerWidth, badgeTop: badge ? Math.round(badge.getBoundingClientRect().top) : null };
});
let m = await look();
ok('on a phone the lesson opens with its Next row below the screen (the case Mikey photographed)', m.navTop !== null && m.navTop > m.H, m);
ok('the scroll cue shows at the bottom of the screen with three arrows', m.cue && m.arrows === 3 && m.cueBottom <= m.H, m);
ok('the cue sits in the bottom right corner, clear of the speaker button in the middle', m.cue && m.cueLeft > m.W / 2, m);
await page.locator('[data-scroll-cue]').click({ force: true }); await page.waitForTimeout(1200);
m = await look();
ok('a tap on the cue brings the Next row on screen, above the Walkthrough Mode badge', m.navTop !== null && m.navBottom <= m.H + 1 && m.navTop >= 0 && m.badgeTop !== null && m.navBottom <= m.badgeTop, m);
ok('the cue goes away once the Next row shows', !m.cue, m);
await page.getByRole('button', { name: 'Next', exact: true }).first().click({ force: true }); await page.waitForTimeout(1500);
m = await look();
ok('on the next line the cue comes back whenever the row is out of sight again', m.navTop > m.H ? m.cue : !m.cue, m);
// The arrow beside each start dot sits on its stroke (pass KB, Mikey's phone screenshot: a stray mark beside the circle). In
// First marks, Tracing shapes and Tracing numbers, every line's drawing is checked: the arrow's tip must lie inside the gray
// guide stroke, which SVG can test directly (isPointInStroke uses the guide's own width).
const arrowsOnLine = () => page.evaluate(() => [...document.querySelectorAll('svg[role="img"]')].filter((s) => /drawing itself$/.test(s.getAttribute('aria-label') || '')).map((s) => {
  const guide = s.querySelector('path[stroke-width="9"]'); const arrow = s.querySelector('[data-trace-arrow]');
  if (!guide || !arrow) return null;
  // The tip must sit on the stroke's middle (within 1.5 units) and the whole arrowhead inside the ink's width (6), so nothing
  // pokes out once the ink covers it (pass KB: a chevron wider than the ink left two bumps on the circle in Mikey's screenshot).
  const inside = (pt, w) => { guide.setAttribute('stroke-width', String(w)); const r = guide.isPointInStroke(new DOMPoint(pt.x, pt.y)); guide.setAttribute('stroke-width', '9'); return r; };
  const [w1, tip, w2] = [0, 1, 2].map((k) => arrow.points.getItem(k));
  return { label: s.getAttribute('aria-label'), curved: / C /.test(guide.getAttribute('d')), on: inside(tip, 3) && inside(w1, 6) && inside(w2, 6) };
}).filter(Boolean));
const seen = []; let curved = 0;
for (const id of ['first-marks', 'tracing-shapes', 'tracing-numbers']) {
  await page.evaluate((m) => window.__eduTest.openModule(m), id); await page.waitForFunction(() => window.__eduTest.screen === 'lesson'); await page.waitForTimeout(900);
  for (let step = 0; step < 14; step++) {
    for (const r of await arrowsOnLine()) { seen.push({ id, ...r }); if (r.curved) curved++; }
    const next = page.getByRole('button', { name: 'Next', exact: true }); if (!(await next.count())) break;
    await next.first().click({ force: true }); await page.waitForTimeout(700);
  }
}
const off = seen.filter((r) => !r.on);
console.log(`checked ${seen.length} start arrows, ${curved} of them on curves`);
ok('every start arrow in the tracing lessons sits on its stroke, curves included', seen.length >= 12 && curved >= 4 && off.length === 0, { checked: seen.length, curved, off });
// The size trap on a 360-pixel phone (pass MG, Mikey's screenshot of More and Fewer: "Can we make the big circles even larger for
// more contrast and impact?"): the line with three big circles over five little ones, read on the page as drawn. Each big
// circle is at least two and a half times as wide as a little one, the two rows stacked, and the big row no longer than the
// little row, so size alone looks like more; before pass MF's fix the two groups sat side by side at 13 and 11 pixels.
{ await page.evaluate(() => window.__eduTest.openModule('more-or-fewer')); await page.waitForFunction(() => window.__eduTest.screen === 'lesson'); await page.waitForTimeout(700);
  const L = await import('../../src/logic.mjs'); const script = L.readAloudScript(L.getModule('more-or-fewer')); const at = script.findIndex((s) => /Three circles, when drawn big, take up lots of room/.test(s.say));
  // On the way, the long row (pass MH, Mikey's words: "Three dots, when spread far apart, create a row that appears long."): the
  // long row is clearly longer than the short row, and its dots are never drawn smaller than the short row's, which would make
  // size a cue (the lesson check's second read: 90 apart shrank them on a narrow phone, so they sit 74 apart).
  const longAt = script.findIndex((s) => /Three dots, when spread far apart/.test(s.say));
  for (let step = 0; step < longAt; step++) { await page.getByRole('button', { name: 'Next', exact: true }).first().click({ force: true }); await page.waitForTimeout(250); }
  await page.waitForTimeout(700);
  const rows = await page.evaluate(() => [...document.querySelectorAll('svg[role="img"]')].filter((s) => /^[35] dots$/.test(s.getAttribute('aria-label') || '')).map((s) => ({ label: s.getAttribute('aria-label'), w: Math.round(s.getBoundingClientRect().width), dot: Math.min(...[...s.querySelectorAll('circle')].map((c) => c.getBoundingClientRect().width)) })));
  const long = rows.find((x) => x.label === '3 dots'); const short = rows.find((x) => x.label === '5 dots');
  ok('on a 360-pixel phone the long row is clearly longer than the short row, and its dots are no smaller than the short row\'s', longAt > 0 && longAt < at && !!long && !!short && long.w >= short.w * 1.25 && long.dot >= short.dot - 0.5, { longAt, long, short });
  for (let step = longAt; step < at; step++) { await page.getByRole('button', { name: 'Next', exact: true }).first().click({ force: true }); await page.waitForTimeout(250); }
  await page.waitForTimeout(700);
  const trap = await page.evaluate(() => { const rows = [...document.querySelectorAll('svg[role="img"]')].filter((s) => /^[35] circles$/.test(s.getAttribute('aria-label') || '')); return rows.map((s) => { const r = s.getBoundingClientRect(); const items = [...s.querySelectorAll(':scope > svg')].map((k) => k.getBoundingClientRect()); return { label: s.getAttribute('aria-label'), top: r.top, span: items.length ? items[items.length - 1].right - items[0].left : 0, each: items.length ? items[0].width : 0, n: items.length }; }); });
  const big = trap.find((x) => x.label === '3 circles'); const little = trap.find((x) => x.label === '5 circles');
  ok('on a phone the size trap draws its big circles at least two and a half times as wide as the little ones, stacked, the big row no longer than the little row', at > 0 && !!big && !!little && big.n === 3 && little.n === 5 && big.each >= 2.5 * little.each && big.top < little.top && big.span <= little.span + 0.5 && big.each >= 50, { at, big, little }); }
// The course-finished page on a short phone (pass MG, the screen check): at 375 by 667, an iPhone SE or 8, Return Home sits below
// the screen while the voice says to tap the green button at the bottom, so the cue shows, and a tap brings the button into view.
{ await page.setViewportSize({ width: 375, height: 667 }); await page.evaluate(() => window.__eduTest.goTo('course-done')); await page.waitForFunction(() => window.__eduTest.screen === 'course-done'); await page.waitForTimeout(1500);
  const home = () => page.evaluate(() => { const b = document.querySelector('[data-course-done-home]'); const r = b ? b.getBoundingClientRect() : null; const badge = [...document.querySelectorAll('[role="status"]')].find((x) => /Walkthrough Mode/.test(x.textContent)); return { top: r ? Math.round(r.top) : null, bottom: r ? Math.round(r.bottom) : null, H: window.innerHeight, cue: !!document.querySelector('[data-scroll-cue]'), book: !!document.querySelector('[data-course-story-book]'), badgeTop: badge ? Math.round(badge.getBoundingClientRect().top) : null }; });
  let h = await home();
  ok('on a short phone the course-finished page opens with Return Home below the screen, and the scroll cue shows', h.book && h.top !== null && h.top > h.H - 24 && h.cue, h);
  if (h.cue) { await page.locator('[data-scroll-cue]').click({ force: true }); await page.waitForTimeout(1200); }
  h = await home();
  ok('a tap on the cue brings Return Home into view, above the Walkthrough Mode badge, and the cue goes away', h.top !== null && h.top >= 0 && h.bottom <= h.H + 1 && !h.cue && h.badgeTop !== null && h.bottom <= h.badgeTop, h);
  // The same at 360 by 640 and in a laptop's 1366 by 657 browser window, and never at 390 by 844, where the button shows; and a
  // course with no long story, whose button sits mid-page, shows no cue and its guide names no place (the screen check's second read).
  for (const [w, tall, want] of [[360, 640, true], [1366, 657, true], [390, 844, false]]) {
    await page.setViewportSize({ width: w, height: tall }); await page.evaluate(() => window.__eduTest.goTo('overview')); await page.waitForTimeout(300);
    await page.evaluate(() => window.__eduTest.goTo('course-done')); await page.waitForFunction(() => window.__eduTest.screen === 'course-done'); await page.waitForTimeout(1500);
    h = await home(); ok(`at ${w} by ${tall} the cue shows exactly when Return Home is below the screen`, h.book && h.cue === want && (h.top > h.H - 24) === want, h);
  }
  await page.setViewportSize({ width: 375, height: 667 }); await page.evaluate(() => { window.__spoken = []; window.__eduTest.goTo('overview'); }); await page.waitForTimeout(300);
  await page.evaluate(() => window.__eduTest.goTo('course-done', 'first-sounds-pk')); await page.waitForFunction(() => window.__eduTest.screen === 'course-done'); await page.waitForTimeout(1500);
  h = await home(); const said = await page.evaluate(() => (window.__spoken || []).join(' '));
  ok('a course with no long story shows Return Home on a short phone with no cue, and its guide names no place', !h.book && !h.cue && h.bottom <= h.H && said.includes('Tap the green button to go home.') && !said.includes('at the bottom'), { h, said }); }
await browser.close();
console.log(`\n${passed} passed, ${failed} failed`);
process.exitCode = failed ? 1 : 0;
