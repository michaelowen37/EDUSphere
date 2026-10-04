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
  return { navTop: r ? Math.round(r.top) : null, navBottom: r ? Math.round(r.bottom) : null, H: window.innerHeight, cue: !!cue, arrows: cue ? cue.querySelectorAll('.edu-chevron').length : 0, cueBottom: cue ? Math.round(cue.getBoundingClientRect().bottom) : null, cueLeft: cue ? Math.round(cue.getBoundingClientRect().left) : null, W: window.innerWidth };
});
let m = await look();
ok('on a phone the lesson opens with its Next row below the screen (the case Mikey photographed)', m.navTop !== null && m.navTop > m.H, m);
ok('the scroll cue shows at the bottom of the screen with three arrows', m.cue && m.arrows === 3 && m.cueBottom <= m.H, m);
ok('the cue sits in the bottom right corner, clear of the speaker button in the middle', m.cue && m.cueLeft > m.W / 2, m);
await page.locator('[data-scroll-cue]').click({ force: true }); await page.waitForTimeout(1200);
m = await look();
ok('a tap on the cue brings the Next row on screen', m.navTop !== null && m.navBottom <= m.H + 1 && m.navTop >= 0, m);
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
await browser.close();
console.log(`\n${passed} passed, ${failed} failed`);
process.exitCode = failed ? 1 : 0;
