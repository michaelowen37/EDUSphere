// The scroll cue on a phone (2026-10-04, pass KA, Mikey's phone screenshots). In plain terms: in a pre-reader's lesson on a
// phone, the row with Next and the star can sit below the screen, where a child who cannot read does not know to look. This
// opens the pre-K lesson First marks on a 360 by 440 touch screen, a small phone with its browser bars and keyboard tray showing (360 by 480 until pass MZ, when the
// speaker moved into the Back/Next row and the row came on screen there; not isMobile: the test page has no viewport tag, so a
// mobile emulation would lay it out 980 pixels wide) through the educator's walk-through and checks that three
// pulsing arrows show at the bottom while the row is out of sight, that a tap brings the row on screen, and that the arrows
// then go away; then that they come back when the next line starts at the top.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
let passed = 0, failed = 0; const ok = (name, cond, info) => { if (cond) { passed++; console.log('PASS - ' + name); } else { failed++; console.log('FAIL - ' + name + (info ? '  ' + JSON.stringify(info) : '')); } };
const pageUrl = new URL('./page.html', import.meta.url).href;
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 360, height: 440 }, hasTouch: true });
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
  const nx = document.querySelector('[data-lesson-next]'); const nr = nx ? nx.getBoundingClientRect() : null;
  const badge = [...document.querySelectorAll('[role="status"]')].find((x) => /Walkthrough Mode/.test(x.textContent));
  return { nextBottom: nr ? Math.round(nr.bottom) : null, nextH: nr ? Math.round(nr.height) : null, navTop: r ? Math.round(r.top) : null, navBottom: r ? Math.round(r.bottom) : null, H: window.innerHeight, cue: !!cue, arrows: cue ? cue.querySelectorAll('.edu-chevron').length : 0, cueBottom: cue ? Math.round(cue.getBoundingClientRect().bottom) : null, cueLeft: cue ? Math.round(cue.getBoundingClientRect().left) : null, W: window.innerWidth, badgeTop: badge ? Math.round(badge.getBoundingClientRect().top) : null, badgeBottom: badge ? Math.round(badge.getBoundingClientRect().bottom) : null };
});
let m = await look();
ok('on a phone the lesson opens with more than a third of its Next below the screen (the case Mikey photographed)', m.nextBottom !== null && m.nextBottom - m.H > m.nextH / 3, m);
ok('the scroll cue shows at the bottom of the screen with three arrows', m.cue && m.arrows === 3 && m.cueBottom <= m.H, m);
ok('the cue sits in the bottom right corner, clear of the speaker button in the middle', m.cue && m.cueLeft > m.W / 2, m);
await page.locator('[data-scroll-cue]').click({ force: true }); await page.waitForTimeout(1200);
m = await look();
ok('a tap on the cue brings the Next row on screen, clear of the Walkthrough Mode tab hanging from the top of the frame (pass MR)', m.navTop !== null && m.navBottom <= m.H + 1 && m.navTop >= 0 && m.badgeTop !== null && m.badgeTop <= 1 && m.navTop >= m.badgeBottom, m);
ok('the cue goes away once the Next row shows', !m.cue, m);
await page.getByRole('button', { name: 'Next', exact: true }).first().click({ force: true }); await page.waitForTimeout(1500);
m = await look();
ok('on the next line the cue comes back whenever a third of Next is out of sight again', m.nextBottom - m.H > m.nextH / 3 ? m.cue : !m.cue, m);
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
  // Steps by the words on the card (pass MJ: a tap 250 ms after the last one was sometimes lost under load, so the check measured
  // the line before its own and failed now and then): Next until the card says the line, up to twenty taps.
  const toLine = async (re) => { for (let k = 0; k < 20; k++) { const said = await page.evaluate(() => (document.querySelector('.edu-rise p') || {}).textContent || ''); if (re.test(said)) return true; await page.getByRole('button', { name: 'Next', exact: true }).first().click({ force: true }); await page.waitForTimeout(300); } return false; };
  await toLine(/Three dots, when spread far apart/);
  await page.waitForTimeout(700);
  const rows = await page.evaluate(() => [...document.querySelectorAll('svg[role="img"]')].filter((s) => /^[35] dots$/.test(s.getAttribute('aria-label') || '')).map((s) => ({ label: s.getAttribute('aria-label'), w: Math.round(s.getBoundingClientRect().width), dot: Math.min(...[...s.querySelectorAll('circle')].map((c) => c.getBoundingClientRect().width)) })));
  const long = rows.find((x) => x.label === '3 dots'); const short = rows.find((x) => x.label === '5 dots');
  ok('on a 360-pixel phone the long row is clearly longer than the short row, and its dots are no smaller than the short row\'s', longAt > 0 && longAt < at && !!long && !!short && long.w >= short.w * 1.25 && long.dot >= short.dot - 0.5, { longAt, long, short });
  await toLine(/Three circles, when drawn big, take up lots of room/);
  await page.waitForTimeout(700);
  const trap = await page.evaluate(() => { const rows = [...document.querySelectorAll('svg[role="img"]')].filter((s) => /^[35] circles$/.test(s.getAttribute('aria-label') || '')); return rows.map((s) => { const r = s.getBoundingClientRect(); const items = [...s.querySelectorAll(':scope > svg')].map((k) => k.getBoundingClientRect()); return { label: s.getAttribute('aria-label'), top: r.top, span: items.length ? items[items.length - 1].right - items[0].left : 0, each: items.length ? items[0].width : 0, n: items.length }; }); });
  const big = trap.find((x) => x.label === '3 circles'); const little = trap.find((x) => x.label === '5 circles');
  ok('on a phone the size trap draws its big circles at least two and a half times as wide as the little ones, stacked, the big row no longer than the little row', at > 0 && !!big && !!little && big.n === 3 && little.n === 5 && big.each >= 2.5 * little.each && big.top < little.top && big.span <= little.span + 0.5 && big.each >= 50, { at, big, little }); }
// The course-finished page on a short phone (pass MG, the screen check): at 375 by 667, an iPhone SE or 8, Return Home sits below
// the screen while the voice says to tap the green button at the bottom, so the cue shows, and a tap brings the button into view.
{ await page.setViewportSize({ width: 375, height: 667 }); await page.evaluate(() => window.__eduTest.goTo('course-done')); await page.waitForFunction(() => window.__eduTest.screen === 'course-done'); await page.waitForTimeout(1500);
  const home = () => page.evaluate(() => { const b = document.querySelector('[data-course-done-home]'); const r = b ? b.getBoundingClientRect() : null; const badge = [...document.querySelectorAll('[role="status"]')].find((x) => /Walkthrough Mode/.test(x.textContent)); return { top: r ? Math.round(r.top) : null, bottom: r ? Math.round(r.bottom) : null, H: window.innerHeight, cue: !!document.querySelector('[data-scroll-cue]'), book: !!document.querySelector('[data-course-story-book]'), badgeTop: badge ? Math.round(badge.getBoundingClientRect().top) : null, badgeBottom: badge ? Math.round(badge.getBoundingClientRect().bottom) : null }; });
  let h = await home();
  ok('on a short phone the course-finished page opens with Return Home below the screen, and the scroll cue shows', h.book && h.top !== null && h.top > h.H - 24 && h.cue, h);
  if (h.cue) { await page.locator('[data-scroll-cue]').click({ force: true }); await page.waitForTimeout(1200); }
  h = await home();
  ok('a tap on the cue brings Return Home into view, clear of the Walkthrough Mode tab at the top (pass MR), and the cue goes away', h.top !== null && h.top >= 0 && h.bottom <= h.H + 1 && !h.cue && h.badgeTop !== null && h.badgeTop <= 1 && h.top >= h.badgeBottom, h);
  // The same at 360 by 640 and in a laptop's 1366 by 657 browser window, and never at 390 by 844, where the button shows; and a
  // course with no long story, whose button sits mid-page, shows no cue and its guide names no place (the screen check's second read).
  for (const [w, tall, want] of [[360, 640, true], [1366, 657, true], [390, 844, false]]) {
    await page.setViewportSize({ width: w, height: tall }); await page.evaluate(() => window.__eduTest.goTo('overview')); await page.waitForTimeout(300);
    await page.evaluate(() => window.__eduTest.goTo('course-done')); await page.waitForFunction(() => window.__eduTest.screen === 'course-done'); await page.waitForTimeout(1500);
    h = await home(); ok(`at ${w} by ${tall} the cue shows exactly when Return Home is below the screen`, h.book && h.cue === want && (h.top > h.H - 24) === want, h);
  }
  // The course is the first read-aloud course with no long story, read from the stories themselves (pass MM: First Sounds and
  // Letters, the course this check used, gained two, so its page shows a book now).
  const L0 = await import('../../src/logic.mjs'); const S0 = await import('../../src/stories.mjs');
  const bare = (L0.COURSES.find((c) => c.readAloud && !S0.COURSE_STORIES[c.id] && !S0.MASTERY_STORIES[c.id]) || {}).id;
  ok('a read-aloud course with no long story is left for this check (retire it once every course has one)', !!bare, bare);
  await page.setViewportSize({ width: 375, height: 667 }); await page.evaluate(() => { window.__spoken = []; window.__eduTest.goTo('overview'); }); await page.waitForTimeout(300);
  await page.evaluate((id) => window.__eduTest.goTo('course-done', id), bare); await page.waitForFunction(() => window.__eduTest.screen === 'course-done'); await page.waitForTimeout(1500);
  h = await home(); const said = await page.evaluate(() => (window.__spoken || []).join(' '));
  ok('a course with no long story shows Return Home on a short phone with no cue, and its guide names no place', !h.book && !h.cue && h.bottom <= h.H && said.includes('Tap the green button to go home.') && !said.includes('at the bottom'), { h, said }); }
// A lesson's next line opens at its top (pass NY, round one's screen read, its M1): on a short phone, and on one held sideways, a tap on
// the scroll cue scrolls the page down to Next, and Next and Go back had left it scrolled, so the next line opened with its card's top,
// and its picture, above the screen (How do friends feel?'s line 7 at 320 by 568 opened 62 pixels up; held sideways, Can I play too?'s
// lines 3 to 9 opened 22 to 112 up). After every line whose cue shows, its cue tapped and then Next, the new line's card top is at 0 or
// below, at 320 by 568 on How do friends feel? and at 667 by 375 on Can I play too? (Keep going sideways tapped first, as a grown-up
// who cannot turn the phone does), and after the cue and Go back the line opens at its top too. Its plant is the scroll taken out of
// the two buttons in a copy of the screens, which tools/undo-alone.mjs runs with this test (pass NY's fix engineer's log).
{ const cardTop = () => page.evaluate(() => { const nav = document.querySelector('[data-lesson-nav]'); const card = nav && nav.previousElementSibling; return card ? Math.round(card.getBoundingClientRect().top) : null; });
  const cueShows = () => page.evaluate(() => !!document.querySelector('[data-scroll-cue]'));
  const opened = []; const back = [];
  for (const [W, H, id] of [[320, 568, 'how-friends-feel'], [667, 375, 'join-in-play']]) {
    await page.setViewportSize({ width: W, height: H }); await page.waitForTimeout(300);
    const keep = page.locator('#edu-rotate.edu-rotate-on .edu-rotate-keep'); if (await keep.count()) { await keep.click(); await page.waitForTimeout(200); }
    await page.evaluate(() => window.__eduTest.goTo('overview')); await page.waitForTimeout(300);
    await page.evaluate((m) => window.__eduTest.openModule(m), id); await page.waitForFunction(() => window.__eduTest.screen === 'lesson'); await page.waitForTimeout(900);
    let backRead = false;
    for (let step = 0; step < 16; step++) {
      const next = page.getByRole('button', { name: 'Next', exact: true }); if (!(await next.count())) break;
      const cue = await cueShows();
      if (cue) { await page.locator('[data-scroll-cue]').click({ force: true }); await page.waitForTimeout(700); }
      // Once a size, on a line past the first whose cue shows: Go back after the cue, read, then Next again to this line.
      if (cue && step > 0 && !backRead) { backRead = true; await page.getByRole('button', { name: 'Go back', exact: true }).first().click({ force: true }); await page.waitForTimeout(900);
        back.push({ size: `${W}x${H}`, id, line: step, top: await cardTop() });
        await page.getByRole('button', { name: 'Next', exact: true }).first().click({ force: true }); await page.waitForTimeout(900);
        if (await cueShows()) { await page.locator('[data-scroll-cue]').click({ force: true }); await page.waitForTimeout(900); } }
      await page.getByRole('button', { name: 'Next', exact: true }).first().click({ force: true }); await page.waitForTimeout(700);
      if (cue) opened.push({ size: `${W}x${H}`, id, line: step + 2, top: await cardTop() });
    }
  }
  const above = [...opened, ...back].filter((x) => x.top === null || x.top < 0);
  console.log(`  (lines opened after a cue's tap: ${opened.map((x) => `${x.size} ${x.id} line ${x.line} at ${x.top}`).join('; ')}; after Go back: ${back.map((x) => `${x.size} line ${x.line} at ${x.top}`).join('; ')})`);
  ok('after the scroll cue\'s tap, Next and Go back open the next line at its top, its card at 0 or below, at 320 by 568 and held sideways at 667 by 375 (pass NY, round one\'s screen read, M1)',
    above.length === 0 && opened.filter((x) => x.size === '320x568').length >= 1 && opened.filter((x) => x.size === '667x375').length >= 5 && back.length === 2, { above, opened: opened.length, back }); }
// Every face in a group of faces is one size (pass NY, round one's screen read, its M2): three faces sit two above and one below, the
// last spanning both columns, and in the dark theme's narrower paper at 320 by 568 the two above shrank to their columns (100 pixels)
// while the one below kept its 120. Every lesson line that draws a group of faces, read from the lessons, is opened at 320 by 568 in the
// test page's own dark theme, and each group's faces are one width, within a pixel. Plant: the lone face's cell given its old width
// (the whole row, 100 percent) on the first group of three, in the page, caught.
{ await page.setViewportSize({ width: 320, height: 568 }); await page.waitForTimeout(300);
  const L1 = await import('../../src/logic.mjs');
  const grids = []; for (const m of L1.MODULES) ((m.lesson && m.lesson.script) || []).forEach((l, i) => { if (l.show && l.show.kind === 'faces') grids.push([m.id, i, (l.show.feelings || []).length]); });
  // Each face's cell by its laid-out width (offsetWidth), which the faces' grow-in animation, a scale, never changes: this walk runs with
  // motion on, and a face's drawn box mid-animation reads smaller.
  const widths = () => page.evaluate(() => [...document.querySelectorAll('[data-faces]')].map((g) => [...g.children].map((c) => c.offsetWidth)));
  const read = []; let plant = null;
  // Each lesson walked once, from its first line to its last group, reading each group on its own line (the lit dot says the line).
  for (const id of [...new Set(grids.map(([g]) => g))]) {
    await page.evaluate(() => window.__eduTest.goTo('overview')); await page.waitForTimeout(150);
    await page.evaluate((m) => window.__eduTest.openModule(m), id); await page.waitForFunction(() => window.__eduTest.screen === 'lesson'); await page.waitForTimeout(400);
    let at = 0;
    for (const [, line, n] of grids.filter(([g]) => g === id)) {
      for (; at < line; at++) { await page.getByRole('button', { name: 'Next', exact: true }).first().click({ force: true }); await page.waitForTimeout(150); }
      await page.waitForFunction((k) => { const dots = [...document.querySelectorAll('[data-lesson-dots] span')]; return dots.findIndex((d) => d.hasAttribute('data-lit')) === k; }, line, { timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(250);
      const w = await widths(); read.push({ id, line, n, w });
    if (n % 2 && plant === null) { plant = await page.evaluate(() => { const g = document.querySelector('[data-faces]'); const last = g && g.lastElementChild; if (!last) return null; last.style.width = '100%';
      const ws = [...g.children].map((c) => c.offsetWidth); last.style.width = ''; return ws; }); }
    }
  }
  const uneven = read.filter((r) => r.w.length !== 1 || r.w[0].length !== r.n || Math.max(...r.w[0]) - Math.min(...r.w[0]) > 1);
  const theme = await page.evaluate(() => document.documentElement.dataset.theme);
  console.log(`  (groups of faces at 320 by 568, ${theme}: ${read.map((r) => `${r.id} ${r.line} [${(r.w[0] || []).join(',')}]`).join('; ')}; planted: [${(plant || []).join(',')}])`);
  ok('every face in a group of faces is one size at 320 by 568 in the dark theme, a lone last face as wide as the faces above it (pass NY, round one\'s screen read, M2); planted, the lone face given the whole row, caught',
    theme === 'dark' && read.length === grids.length && grids.length >= 10 && grids.filter(([, , n]) => n % 2).length >= 4 && uneven.length === 0 && !!plant && Math.max(...plant) - Math.min(...plant) > 1, { uneven, plant, theme }); }
// A quick Next during the cue's glide keeps the cue (pass NY, round two's screen read, its M2). With motion on, a tap on the scroll cue
// glides the page down to Next, and a child who taps Next before the glide ends opens the next line where the glide's last frames left
// the page, a few pixels below its top. The cue's re-check read Next with the words' room for the cue taken out, where it showed
// enough, put the room back and left the cue off: How do friends feel?'s line 7 at 320 by 568 opened 6 to 13 pixels down, Next 68 to
// 79 percent hidden, the words narrowed for a cue that never came (16 of 18 such taps in the read). Read as the read found it, on the
// built index.html as a phone (its own viewport line, touch, light theme), since this test's page lays out otherwise and its line 7
// leaves Next in view: line 6's cue is tapped, then Next as soon as its middle shows, after 0, 10, 20 and 40 ms; 1.6 seconds later the
// cue shows wherever more than a third of Next is hidden, and at least one tap left the page below its top with Next so hidden, so the
// case is met. Its plant is the re-check's second read taken out of ScrollCue in a copy of the screens, which tools/undo-alone.mjs runs
// with this test.
{ const ctx = await browser.newContext({ viewport: { width: 320, height: 568 }, screen: { width: 320, height: 568 }, hasTouch: true, isMobile: true });
  await ctx.addInitScript(() => { try { localStorage.setItem('edusphere_v1_theme', 'light'); } catch (e) { /* none */ } });
  const pg = await ctx.newPage(); await pg.goto(new URL('../../index.html', import.meta.url).href); await pg.waitForTimeout(900);
  const screenIs = (n) => pg.waitForFunction((x) => window.__eduTest && window.__eduTest.screen === x, n, { timeout: 20000 });
  const tapIf = async (name) => { const b = pg.getByRole('button', { name, exact: true }); if (await b.count() && await b.first().isVisible()) { await b.first().click({ force: true }); await pg.waitForTimeout(300); } };
  await pg.getByRole('button', { name: 'Create account' }).first().click(); await screenIs('educator-setup');
  await pg.fill('input[placeholder="PIN"]', '2468'); await pg.fill('input[placeholder="PIN again"]', '2468'); await pg.fill('input[placeholder="This device\'s name"]', 'Quick'); await pg.selectOption('select[aria-label="Your state"]', 'TX');
  await pg.getByRole('button', { name: 'Create account', exact: true }).click(); await screenIs('educator-pick'); await pg.waitForTimeout(800);
  for (const n of ['Skip tour', 'Later', 'Got it', 'Later', 'Got it']) await tapIf(n);
  await pg.getByRole('button', { name: 'Walk through early years' }).first().click({ force: true }); await screenIs('overview'); await pg.waitForTimeout(500); await tapIf('Later');
  const lit = () => pg.evaluate(() => [...document.querySelectorAll('[data-lesson-dots] span')].findIndex((s) => s.hasAttribute('data-lit')));
  const nextAt = () => pg.evaluate(() => { const e = document.querySelector('[data-lesson-nav] button[aria-label="Next"]').getBoundingClientRect(); return { x: e.left + e.width / 2, y: e.top + e.height / 2, shows: e.top + e.height / 2 < innerHeight }; });
  const read = () => pg.evaluate(() => { const r = document.querySelector('[data-lesson-next]').getBoundingClientRect(); return { y: Math.round(scrollY), hidden: Math.round(Math.max(0, Math.min(1, (r.bottom - innerHeight) / r.height)) * 100) / 100, cue: !!document.querySelector('[data-scroll-cue]') }; });
  const tries = [];
  for (const wait of [0, 10, 20, 40]) {
    await pg.evaluate(() => window.__eduTest.goTo('overview')); await screenIs('overview'); await pg.waitForTimeout(300);
    await pg.evaluate(() => window.__eduTest.openModule('how-friends-feel')); await screenIs('lesson'); await pg.waitForTimeout(1200);
    for (let i = 0; i < 5; i++) { await pg.evaluate(() => document.querySelector('[data-lesson-nav] button[aria-label="Next"]').click()); await pg.waitForTimeout(150); }
    for (let k = 0; k < 30 && (await lit()) !== 5; k++) await pg.waitForTimeout(100);
    await pg.evaluate(() => window.scrollTo(0, 0)); await pg.waitForTimeout(1700);
    const c = await pg.evaluate(() => { const e = document.querySelector('[data-scroll-cue]'); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
    if (!c) { tries.push({ wait, note: 'no cue on line 6' }); continue; }
    await pg.touchscreen.tap(c.x, c.y);
    for (let k = 0; k < 80 && !(await nextAt()).shows; k++) await pg.waitForTimeout(5);
    if (wait) await pg.waitForTimeout(wait);
    const n = await nextAt(); const yTap = await pg.evaluate(() => Math.round(scrollY));
    await pg.touchscreen.tap(n.x, n.y); await pg.waitForTimeout(1600);
    tries.push({ wait, yTap, line: (await lit()) + 1, ...(await read()) });
  }
  await ctx.close();
  const lost = tries.filter((x) => x.line !== 7 || (x.hidden > 1 / 3 && !x.cue)); const met = tries.filter((x) => x.y > 0 && x.hidden > 1 / 3);
  console.log(`  (quick Next during the cue's glide, How do friends feel? line 6 at 320 by 568: ${tries.map((x) => x.note || `after ${x.wait} ms tapped at ${x.yTap}, line ${x.line} ${x.y} down, Next ${Math.round(x.hidden * 100)} percent hidden, cue ${x.cue ? 'shown' : 'none'}`).join('; ')})`);
  ok('a quick Next during the scroll cue\'s glide opens the next line with the cue showing while more than a third of Next is hidden, How do friends feel?\'s line 7 at 320 by 568 with motion on, on the built page as a phone (pass NY, round two\'s screen read, M2)',
    tries.length === 4 && lost.length === 0 && met.length >= 1, { tries }); }
// Next and Go back in the claude.ai preview's page-tall frame (pass NY, round two's screen read, its M1): the app in a frame 5,000 pixels
// tall under a 120-pixel header, served from another origin as the preview's is, the window a short laptop's; the window never scrolls
// inside the frame, so what shows is the band the page around it shows. Next and Go back had asked only the window to scroll, so once
// the page around had moved to reach Next, the next line opened with its card's top above the screen (12 of 24 lines at 1280 by 480 and
// 19 of 24 at 800 by 450). How do friends feel?'s first five lines at 1280 by 480: before each Next, the page around is scrolled to bring
// Next into view when it is not, and the next line's card top is then on the screen, at 0 or below; Go back after the last is read the
// same way; at least two lines needed the page around moved, so the case is met. Its plant is scrollToTop(false) put back in the two
// buttons in a copy of the screens, which tools/undo-alone.mjs runs with this test.
{ const http = await import('node:http'); const { readFileSync } = await import('node:fs');
  const html = readFileSync(new URL('./page.html', import.meta.url));
  const server = http.createServer((req, res) => { res.writeHead(200, { 'content-type': 'text/html' }); if (req.url.startsWith('/tall')) res.end(`<!doctype html><meta charset="utf-8"><body style="margin:0"><div style="height:120px"></div><iframe id="app" sandbox="allow-scripts allow-same-origin allow-forms" style="border:0;width:100%;height:5000px;display:block" src="http://127.0.0.1:${server.address().port}/page.html"></iframe><div style="height:600px"></div></body>`); else res.end(html); });
  await new Promise((r) => server.listen(0, r)); const port = server.address().port;
  const W = 1280, H = 480;
  const ctx = await browser.newContext({ viewport: { width: W, height: 1000 } }); const op = await ctx.newPage();
  await op.goto(`http://localhost:${port}/tall`);
  const fr = op.frames().find((x) => x.url().includes('127.0.0.1'));
  await fr.waitForFunction(() => window.__eduTest && window.__eduTest.screen === 'welcome', null, { timeout: 20000 });
  await fr.getByRole('button', { name: 'Educator Login' }).click(); await op.waitForTimeout(300);
  await fr.fill('input[placeholder="PIN"]', '2468'); await fr.fill('input[placeholder="PIN again"]', '2468');
  await fr.fill('input[placeholder="This device\'s name"]', 'Tall'); await fr.selectOption('select[aria-label="Your state"]', 'TX');
  await fr.getByRole('button', { name: 'Create account', exact: true }).click();
  await fr.waitForFunction(() => window.__eduTest.screen === 'educator-pick', null, { timeout: 20000 }); await op.waitForTimeout(700);
  for (const name of ['Skip tour', 'Later', 'Got it', 'Close']) { const b = fr.getByRole('button', { name, exact: true }); if (await b.count()) { await b.first().click({ force: true }); await op.waitForTimeout(200); } }
  await fr.getByRole('button', { name: 'Walk through early years' }).first().click({ force: true });
  await fr.waitForFunction(() => window.__eduTest.screen === 'overview', null, { timeout: 20000 }); await op.waitForTimeout(500);
  await op.setViewportSize({ width: W, height: H }); await op.evaluate(() => window.scrollTo(0, 0)); await op.waitForTimeout(500);
  await fr.evaluate(() => window.__eduTest.openModule('how-friends-feel')); await fr.waitForFunction(() => window.__eduTest.screen === 'lesson', null, { timeout: 20000 }); await op.waitForTimeout(1200);
  const lit = () => fr.evaluate(() => [...document.querySelectorAll('[data-lesson-dots] span')].findIndex((s) => s.hasAttribute('data-lit')));
  const onScreen = async (sel) => { const b = await fr.evaluate((s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return { top: r.top, bottom: r.bottom, x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, sel); if (!b) return null;
    const y = await op.evaluate(() => window.scrollY); return { x: b.x, y: 120 + b.y - y, top: 120 + b.top - y, bottom: 120 + b.bottom - y }; };
  const cardTop = async () => { const top = await fr.evaluate(() => { const nav = document.querySelector('[data-lesson-nav]'); const c = nav && nav.previousElementSibling; return c ? c.getBoundingClientRect().top : null; }); const y = await op.evaluate(() => window.scrollY); return top === null ? null : Math.round(120 + top - y); };
  const opened = [];
  const press = async (label, to) => {
    let b = await onScreen(`[data-lesson-nav] button[aria-label="${label}"]`); let moved = false;
    if (b && (b.bottom > H - 4 || b.top < 0)) { await op.evaluate((dy) => window.scrollBy(0, dy), Math.round(b.bottom > H - 4 ? b.bottom - H + 12 : b.top - 12)); await op.waitForTimeout(400); moved = true; b = await onScreen(`[data-lesson-nav] button[aria-label="${label}"]`); }
    await op.mouse.click(b.x, b.y); for (let k = 0; k < 40 && (await lit()) !== to; k++) await op.waitForTimeout(100); await op.waitForTimeout(700);
    opened.push({ label, line: to + 1, moved, top: await cardTop() }); };
  for (let i = 0; i < 4; i++) await press('Next', i + 1);
  await press('Go back', 3);
  await ctx.close(); server.close();
  const above = opened.filter((x) => x.top === null || x.top < 0);
  console.log(`  (in the page-tall frame at ${W} by ${H}: ${opened.map((x) => `${x.label} to line ${x.line}${x.moved ? ' after the page around moved' : ''}, card top at ${x.top}`).join('; ')})`);
  ok('in the claude.ai preview\'s page-tall frame at 1280 by 480, Next and Go back open a line with its card\'s top on the screen after the page around the frame has moved to reach them (pass NY, round two\'s screen read, M1)',
    opened.length === 5 && above.length === 0 && opened.filter((x) => x.moved).length >= 2, { opened }); }
await browser.close();
console.log(`\n${passed} passed, ${failed} failed`);
process.exitCode = failed ? 1 : 0;
