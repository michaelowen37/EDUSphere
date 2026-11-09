// The Wise Human. Copyright (c) 2026. Source-available; not for reuse. See LICENSE.md.
// Questions, More Info, the Wonder pictures and the read-along, walked in the real page (pass MH, from Mikey's notes). In plain
// terms: a made-up educator walks the early years and the elementary levels in the dark theme on a laptop-sized screen and on a
// phone, and checks what Mikey asked for: the picture inside a question draws bigger while the answer buttons keep their size;
// More Info says why each wrong answer does not fit, naming the one just chosen, and opens by itself for a reader's wrong
// answer; the four Wonder voices each have a portrait in the cast's order and the closing card a rotating title; the pondering
// pictures sit inside the card around its words as line art (Mikey, 08:05), and the read-along lights the sentence being read,
// not the whole paragraph, in a light green that reads in the dark theme. Since the checks' second reads it also proves what a
// pre-reader hears after a wrong tap, the space under the Wonder cards, and a short phone's More Info opening at its top.
// Run: node tests/e2e/make-page.mjs && node tests/e2e/question-screens.mjs
import { createRequire } from 'node:module'; import { execSync } from 'node:child_process';
const G = execSync('npm root -g').toString().trim(); const { chromium } = createRequire(import.meta.url)(`${G}/playwright`);
const L = await import('../../src/logic.mjs');
// The lesson lines that show a big and a small shape side by side, read from the lessons themselves, so the pair checks below can
// say plainly when a split or a new line moves one (pass MR: Q70's split moved Two steps' pair to Two steps every day, and the
// walk timed out looking for a Next button that line 12 no longer had).
const sizedPairs = (id) => { const m = L.COURSES.flatMap((c) => c.modules).find((x) => x.id === id); const s = (m && ((m.lesson && m.lesson.script) || m.script)) || [];
  return s.map((ln, i) => (ln && ln.show && ln.show.kind === 'pair' && [ln.show.a, ln.show.b].every((v) => v && v.kind === 'shape') && [ln.show.a, ln.show.b].some((v) => v.size) ? i : -1)).filter((i) => i >= 0); };
let passed = 0, failed = 0; const ok = (name, cond, info) => { if (cond) { passed++; console.log('PASS - ' + name); } else { failed++; console.log('FAIL - ' + name + (info !== undefined ? '  ' + JSON.stringify(info).slice(0, 500) : '')); } };
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, hasTouch: true, reducedMotion: 'reduce' });
const errors = []; page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
await page.goto(new URL('./page.html', import.meta.url).href);
await page.waitForFunction(() => window.__eduTest && window.__eduTest.screen === 'welcome');
const screen = () => page.evaluate(() => window.__eduTest && window.__eduTest.screen);
const screenIs = (n) => page.waitForFunction((x) => window.__eduTest && window.__eduTest.screen === x, n, { timeout: 15000 });
const settle = () => page.waitForFunction(() => !window.__eduSettleUntil || Date.now() >= window.__eduSettleUntil, null, { timeout: 5000 }).catch(() => {});
const tapIf = async (name) => { const b = page.getByRole('button', { name, exact: true }); if (await b.count()) { await b.first().click({ force: true }); await page.waitForTimeout(250); return true; } return false; };
// Every word of what shows, measured against what it sits on (the dark theme check's rule: 4.5 to 1, 3 to 1 for large words).
const audit = () => page.evaluate(() => {
  const parse = (s) => { const m = String(s).match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[\s,\/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
  const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const lum = (c) => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
  const blend = (top, under) => ({ r: top.r * top.a + under.r * (1 - top.a), g: top.g * top.a + under.g * (1 - top.a), b: top.b * top.a + under.b * (1 - top.a), a: 1 });
  const ground = (el) => { const layers = []; let n = el; while (n && n.nodeType === 1) { const cs = getComputedStyle(n); if (cs.backgroundImage && cs.backgroundImage !== 'none') return null; const c = parse(cs.backgroundColor); if (c && c.a > 0) { layers.push(c); if (c.a >= 1) break; } n = n.parentElement; } return layers.reduceRight((acc, l) => blend(l, acc), { r: 255, g: 255, b: 255, a: 1 }); };
  const fails = []; const seen = new Set();
  const walker = document.createTreeWalker(document.querySelector('#root'), NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const t = walker.currentNode; const words = t.textContent.trim(); if (!words) continue;
    const el = t.parentElement; if (!el || seen.has(el) || el.closest('svg')) continue; seen.add(el);
    const box = el.getBoundingClientRect(); if (box.width < 1 || box.height < 1) continue;
    const cs = getComputedStyle(el); if (cs.visibility === 'hidden') continue;
    let n = el, faded = false; while (n && n.nodeType === 1) { if (parseFloat(getComputedStyle(n).opacity) < 0.9) { faded = true; break; } n = n.parentElement; } if (faded) continue;
    const fg = parse(cs.color); const g = ground(el); if (!fg || !g) continue;
    const f = fg.a < 1 ? blend(fg, g) : fg; const ratio = (Math.max(lum(f), lum(g)) + 0.05) / (Math.min(lum(f), lum(g)) + 0.05);
    const size = parseFloat(cs.fontSize); const bold = parseInt(cs.fontWeight, 10) >= 700;
    if (ratio < ((size >= 24 || (size >= 18.66 && bold)) ? 3 : 4.5)) fails.push(`${ratio.toFixed(2)} "${words.slice(0, 40)}"`);
  }
  return fails;
});
// An educator, then a walk-through of a level.
await page.getByRole('button', { name: 'Create account', exact: true }).first().click(); await screenIs('educator-setup');
await page.fill('input[placeholder="PIN"]', '2468'); await page.fill('input[placeholder="PIN again"]', '2468'); await page.fill('input[placeholder="This device\'s name"]', 'Screens'); await page.selectOption('select[aria-label="Your state"]', 'TX');
await page.getByRole('button', { name: 'Create account', exact: true }).click(); await screenIs('educator-pick'); await page.waitForTimeout(500);
for (const n of ['Skip tour', 'Later', 'Got it']) await tapIf(n);
const walk = async (label) => {
  await page.evaluate(() => window.__eduTest.goTo('educator-pick')); await page.waitForTimeout(300); for (const n of ['Skip tour', 'Later', 'Got it']) await tapIf(n);
  await page.getByLabel(label).first().click({ force: true }); await screenIs('overview'); await page.waitForTimeout(300); };
// A question shown as its module asks it (pass MN: a trace from kindergarten up carries the direction rule, so the module is named).
const show = async (gen, seed, mod = null) => { await page.evaluate(([g, s, m]) => window.__eduTest.showQuestion(g, s, m), [gen, seed, mod]); await screenIs('practice'); await page.waitForTimeout(600); return page.evaluate(() => window.__eduTest.question); };
await walk('Walk through early years');


// A shape's drawn box inside a row's cell: the drawing, not its cell, since a square fills about three quarters of its box.
const rowLook = () => page.evaluate(() => {
  const row = document.querySelector('[data-pattern-row]'); if (!row) return null;
  const cells = [...row.children].map((c) => c.getBoundingClientRect());
  const drawn = [...row.children].map((c) => (c.querySelector('rect, circle, polygon, path, ellipse') || c).getBoundingClientRect());
  return { n: cells.length, sizes: drawn.map((r) => Math.round(r.width)), lines: new Set(cells.map((r) => Math.round(r.top))).size, right: Math.max(...cells.map((r) => r.right)), left: Math.min(...cells.map((r) => r.left)), vw: window.innerWidth };
});

// 1. The question's own picture is bigger on a laptop, and the answer buttons keep their size (Mikey: "Please make the answer
//    choice buttons and corresponding images the size they were before and enlarge the lesson images instead").
{ const q = await show('p3-sort-red-blue', 11);
  const look = await rowLook();
  ok("on a laptop the question's row of shapes draws each shape 80 pixels or more across (about 37 before pass MH), on one line", look && look.n === 3 && look.sizes.every((w) => w >= 80) && look.lines === 1, look);
  // The buttons' pictures are drawn at 64 (69 with the page's 1.08 zoom), never the 1.7 times of the tiles Mikey sent back.
  const pics = await page.evaluate(() => [...document.querySelectorAll('button[data-choice]')].map((b) => { const s = b.querySelector('svg'); return s ? Math.round(s.getBoundingClientRect().width) : 0; }));
  ok('the answer buttons keep their pictures at the old size, 64 pixels drawn', pics.length === q.choices.length && pics.every((w) => w >= 60 && w <= 72), pics);
  const q2 = await show('p3-how-many', 11);
  const squares = await page.evaluate(() => { const row = document.querySelector('[data-pattern-row]'); const paper = row.closest('.edu-paper-picture'); const card = paper.parentElement.parentElement.getBoundingClientRect(); return { sizes: [...row.children].map((c) => Math.round((c.querySelector('rect, circle, polygon, path, ellipse') || c).getBoundingClientRect().width)), paper: Math.round(paper.getBoundingClientRect().width), card: Math.round(card.width) }; });
  ok('How many squares? draws its squares 80 pixels or more across, on a paper sized to them rather than the width of the card', q2.visual.kind === 'pattern' && squares.sizes.every((w) => w >= 80) && squares.paper < squares.card * 0.6, squares);
  // Since pass NC (EARMARKS A84) the picture to match draws at its answers' own size, so the one that is the same looks the same size.
  await show('pm-same-animals', 11);
  const same = await page.evaluate(() => { const p = document.querySelector('.edu-paper-picture svg'); const tiles = [...document.querySelectorAll('button[data-choice] svg')].map((s) => s.getBoundingClientRect().width); return { pic: p ? Math.round(p.getBoundingClientRect().width) : 0, tiles: tiles.map(Math.round) }; });
  ok('a picture to match among picture answers draws at its answers\' size, so the one that is the same never looks bigger or smaller (pass NC, EARMARKS A84)', same.pic > 0 && same.tiles.length >= 2 && same.tiles.every((w) => Math.abs(w - same.pic) <= 2), same);
  // A row of six never splits (the code and screen checks: five and one at every width before), from a small phone to a laptop.
  const six = [];
  for (const [w, h] of [[360, 740], [768, 1024], [1280, 900]]) { await page.setViewportSize({ width: w, height: h }); await show('pp-which-repeats', 2); six.push({ w, ...(await rowLook()) }); }
  ok('a pattern of six shapes stays on one line inside the screen at 360, 768 and 1280 pixels wide', six.every((x) => x.n === 6 && x.lines === 1 && x.left >= 0 && x.right <= x.w && x.sizes.every((s) => s >= 24)), six);
  await page.setViewportSize({ width: 390, height: 844 }); await show('p3-sort-red-blue', 11);
  const small = await rowLook();
  ok('on a phone the row of three draws each shape 42 pixels or more across, on one line, inside the screen', small.sizes.every((w) => w >= 42) && small.lines === 1 && small.right <= 390, small);
  // On a short phone (an iPhone SE, 375 by 667) the picture keeps its old size, so Check answer stays above the fold.
  await page.setViewportSize({ width: 375, height: 667 }); await show('p3-which-colour-four', 3);
  await page.locator('button[data-choice]').first().click(); await page.waitForTimeout(200);
  const fold = await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Check answer'); return b ? Math.round(b.getBoundingClientRect().bottom) : 9999; });
  ok('on a 375 by 667 phone Check answer sits above the fold', fold <= 667, fold);
  await page.setViewportSize({ width: 1280, height: 900 }); await page.waitForTimeout(300);
  // A pattern's shapes are drawn in the color its answers are in (found in pass MH: the row was always green).
  const pq = await show('pp-what-next', 4);
  const fills = await page.evaluate(() => { const fillOf = (svg) => { const s = svg && svg.querySelector('[fill]:not([fill="none"])'); return s ? s.getAttribute('fill') : null; }; return { row: fillOf(document.querySelector('[data-pattern-row] svg')), choice: fillOf(document.querySelector('button[data-choice] svg')) }; });
  ok("a pattern row is drawn in its answers' color", !!fills.row && fills.row === fills.choice, { fills, colour: pq.visual.colour }); }

// 2. The size lesson's three circles grow in order on a laptop (the code check: the middle one once drew bigger than the biggest).
{ await page.evaluate(() => window.__eduTest.openModule('big-bigger-biggest')); await page.waitForTimeout(900);
  const sizes = [];
  for (let k = 0; k < 3; k++) { sizes.push(await page.evaluate(() => { const s = document.querySelector('.edu-paper-picture svg, [data-lesson-step] svg'); return s ? Math.round(s.getBoundingClientRect().width) : 0; })); const next = page.getByLabel('Next', { exact: true }); if (await next.count()) { await next.first().click({ force: true }); await page.waitForTimeout(700); } }
  ok('Big, bigger, biggest draws its small, middle and big circles in that order of size, each grown for a laptop', sizes.length === 3 && sizes[0] > 0 && sizes[0] < sizes[1] && sizes[1] < sizes[2] && sizes[2] >= 190, sizes); }

// 3. A pre-reader's wrong tap: a reason that leaves the answer unsaid is heard; one that names it is not, since a young learner
//    tries again (RULES-AUDIT: nothing gives an answer away by sound), and waits in More Info after the right tap.
{ const heardAfterWrong = async (gen, seed, pickWrong) => {
    await page.evaluate(() => { window.__spoken = []; });
    const q = await show(gen, seed); const wrong = pickWrong(q);
    await settle(); await page.locator(`button[data-choice="${wrong}"]`).click(); await page.getByRole('button', { name: 'Check answer' }).click(); await page.waitForTimeout(500);
    return { q, wrong, said: await page.evaluate(() => window.__spoken.join(' | ')) }; };
  const fourSeed = (() => { for (let sd = 1; sd < 200; sd++) { const k = L.generateQuestion('p3-which-colour-four', sd); const w = k.choices.find((c) => c !== k.answer); if (k.choices.length === 4 && L.whyNotNamesAnswer(k, w)) return sd; } return 0; })();
  const gave = await heardAfterWrong('p3-which-colour-four', fourSeed, (q) => q.choices.find((c) => c !== q.answer && L.whyNotNamesAnswer(q, c)));
  ok('with three choices still open, a reason that names the answer is not said to a pre-reader; the old words are', fourSeed > 0 && gave.said.includes('Not that one.') && !gave.said.includes(gave.q.whyNot[gave.wrong].why), gave.said.slice(-200));
  ok('the wrong tap offers Try again', await tapIf('Try again'));
  const two = await heardAfterWrong('p3-sort-red-blue', 11, (q) => q.choices.find((c) => c !== q.answer));
  ok('in a two-choice question the reason is said, since only the answer is left', two.said.includes(two.q.whyNot[two.wrong].why), two.said.slice(-200));
  await tapIf('Try again');
  const seed = (() => { for (let sd = 1; sd < 80; sd++) { const k = L.generateQuestion('p3-help-kind', sd); const w = k.choices.find((c) => c !== k.answer); if (!L.whyNotNamesAnswer(k, w)) return sd; } return 0; })();
  const kind = await heardAfterWrong('p3-help-kind', seed, (q) => q.choices.find((c) => c !== q.answer));
  const why = `${kind.q.whyNot[kind.wrong].name} ${kind.q.whyNot[kind.wrong].why}`;
  ok('a reason that leaves the answer unsaid is said after the wrong tap, then Have another try', seed > 0 && kind.said.includes(why) && kind.said.indexOf('Have another try.', kind.said.indexOf(why)) > 0, kind.said.slice(-240)); }

// 4. More Info after a pre-reader's right answer: the choice tapped is named first, even when it was not first among the choices,
//    and the question's own picture sits at the top of the sheet.
{ const q = await show('p3-tap-picture', 5); const wrongs = q.choices.filter((c) => c !== q.answer); const last = wrongs[wrongs.length - 1];
  await settle(); await page.locator(`button[data-choice="${last}"]`).click(); await page.getByRole('button', { name: 'Check answer' }).click(); await page.waitForTimeout(400);
  await tapIf('Try again');
  await settle(); await page.locator(`button[data-choice="${q.answer}"]`).click(); await page.getByRole('button', { name: 'Check answer' }).click(); await page.waitForTimeout(500);
  const linkAt = await page.evaluate(() => { const l = document.querySelector('[data-more-info-link]'); const b = document.querySelector('[data-practice-next] button'); return l && b ? { link: Math.round(l.getBoundingClientRect().top), next: Math.round(b.getBoundingClientRect().bottom) } : null; });
  ok("after a pre-reader's right answer a More Info link waits under the next button, for the grown-up beside the child", (await page.locator('[data-more-info-link]').count()) === 1 && !!linkAt && linkAt.link >= linkAt.next, linkAt);
  await page.locator('[data-more-info-link]').click(); await page.waitForTimeout(400);
  const rows = await page.locator('[data-more-info-wrong]').evaluateAll((els) => els.map((e) => ({ c: e.getAttribute('data-more-info-wrong'), chosen: e.getAttribute('data-chosen'), text: e.textContent })));
  ok('More Info names the picture tapped first, though it came last among the choices, as the one you just chose', wrongs.length >= 2 && rows[0] && rows[0].c === last && rows[0].chosen === 'now' && rows[0].text.includes('which you just chose') && rows.slice(1).every((r) => !r.chosen), rows);
  const focus = await page.evaluate(() => document.activeElement && document.activeElement.textContent.trim());
  ok('the sheet puts the focus on Got it, so a screen reader starts inside it', focus === 'Got it', focus);
  const low = await audit(); ok('every word in the More Info sheet reads in the dark theme', low.length === 0, low.slice(0, 3));
  await page.keyboard.press('Escape'); await page.waitForTimeout(300);
  ok('Escape closes the sheet', (await page.getByRole('dialog', { name: 'More Info' }).count()) === 0);
  await show('p3-sort-red-blue', 11); await settle();
  const qq = await page.evaluate(() => window.__eduTest.question);
  await page.locator(`button[data-choice="${qq.answer}"]`).click(); await page.getByRole('button', { name: 'Check answer' }).click(); await page.waitForTimeout(400);
  await page.locator('[data-more-info-link]').click(); await page.waitForTimeout(400);
  ok("the sheet shows the question's own picture, which its reasons point at", (await page.locator('[data-more-info] [data-more-info-picture] [data-pattern-row]').count()) === 1);
  await tapIf('Got it'); ok('Got it closes the sheet', (await page.getByRole('dialog', { name: 'More Info' }).count()) === 0); }

// 4b. A pre-reader's next button on a short phone (pass MH, the alignment read): the reason after a wrong tap can push Try again
//     below the screen of a 375 by 667 or 360 by 640 phone, where a child who cannot read would never find it. Then the scroll
//     cue shows, as on the lesson and story pages, and a tap on it brings the button into view.
{ const nextAt = () => page.evaluate(() => { const b = document.querySelector('[data-practice-next] button'); if (!b) return null; const r = b.getBoundingClientRect(); return { bottom: Math.round(r.bottom), H: window.innerHeight, cue: !!document.querySelector('[data-scroll-cue]') }; });
  const seen = []; const retries = [];
  for (const [w, h] of [[375, 667], [360, 640]]) {
    await page.setViewportSize({ width: w, height: h }); await page.waitForTimeout(300);
    // Each case starts at the top of the page, as a child meets a new question (the second read of the late fixes: the cases
    // after a cue tap had been measured on a page already scrolled down, and a button half below the screen showed no cue).
    for (const [gen, seed, right] of [['p3-feel-name-face', 5, false], ['p3-help-who', 2, true], ['p3-tap-fewer', 3, true], ['p3-rhyme-yesno', 3, false]]) {
      const q = await show(gen, seed); await page.evaluate(() => (document.scrollingElement || document.documentElement).scrollTo(0, 0)); await page.waitForTimeout(200); const pick = right ? q.answer : q.choices.find((c) => c !== q.answer);
      await settle(); await page.locator(`button[data-choice="${pick}"]`).click(); await page.getByRole('button', { name: 'Check answer' }).click(); await page.waitForTimeout(1500);
      const a = await nextAt(); seen.push({ w, h, gen, after: right ? 'right' : 'wrong', ...a });
      if (a && a.cue) { await page.locator('[data-scroll-cue]').click(); await page.waitForTimeout(900); const b = await nextAt(); seen.push({ w, h, gen, after: 'cue tap', ...b });
        // A retry after the cue opens at the top of the question, its picture and speaker in view.
        if (!right && await tapIf('Try again')) { await page.waitForTimeout(300); retries.push({ w, gen, top: await page.evaluate(() => Math.round((document.scrollingElement || document.documentElement).scrollTop)) }); } }
    }
  }
  ok("on a short phone a pre-reader's next button is on the screen, or the scroll cue shows and a tap on it brings the button into view", seen.length >= 8 && seen.every((r) => r.bottom !== null && (r.bottom <= r.H || r.cue)) && seen.filter((r) => r.after === 'cue tap').every((r) => r.bottom <= r.H), seen);
  ok("a pre-reader's retry after the scroll cue opens at the top of the question", retries.length >= 1 && retries.every((r) => r.top === 0), retries);
  await page.setViewportSize({ width: 1280, height: 900 }); await page.waitForTimeout(300); }

// 4c. The groups that look like more, as a phone draws them (pass ML, the code check's second read: More Info squeezed a group into
//     a 64-pixel box, and the picture after a right tap shrank the long row's dots and not the close bunch's, the size cue the
//     lesson teaches past). In the buttons, the picture after the right tap and More Info, every dot or circle of one kind is one
//     size, and More Info draws them at a size a child can count. And a pre-reader who taps a choice on a short phone sees the
//     scroll cue when Check answer is below the screen.
{ const sizesIn = (sel) => page.evaluate((s) => [...document.querySelectorAll(s)].map((box) => [...box.querySelectorAll('circle')].map((c) => Math.round(c.getBoundingClientRect().width * 10) / 10).filter((w) => w > 2)), sel);
  const spread = (list) => { const all = list.flat(); return all.length ? Math.max(...all) / Math.min(...all) : 99; };
  const found = [];
  for (const [w, h] of [[360, 640], [320, 568]]) {
    await page.setViewportSize({ width: w, height: h }); await page.waitForTimeout(300);
    for (const seed of [14, 2]) {
      const q = await show('p4-looks-like-more', seed); const dots = /dots/.test(q.answer);
      const inButtons = await sizesIn('button[data-choice^="look:"]');
      await settle(); await page.locator(`button[data-choice="${q.answer}"]`).click(); await page.getByRole('button', { name: 'Check answer' }).click(); await page.waitForTimeout(1200);
      const explained = await sizesIn('[data-explain-picture]');
      let sheet = []; if (await tapIf('More Info')) { await page.waitForTimeout(700); sheet = await sizesIn('[data-more-info] [style*="grid"]'); await page.locator('[data-more-info-close] button').first().click({ force: true }).catch(() => {}); await page.waitForTimeout(300); }
      found.push({ w, seed, dots, buttons: inButtons.map((r) => r.length), buttonSpread: spread(inButtons), explainSpread: spread(explained), sheetSmallest: Math.min(...sheet.flat(), 99), sheetSpread: spread(sheet.filter((r) => r.length)) });
    }
  }
  const dotCases = found.filter((r) => r.dots);
  ok('a long row and a close bunch draw their dots one size in the buttons, after the right tap and in More Info, which draws them countable', dotCases.length >= 2 && dotCases.every((r) => r.buttonSpread <= 1.06 && r.explainSpread <= 1.06 && r.sheetSmallest >= 12 && r.sheetSpread <= 1.06), found);
  const cueSeen = [];
  await page.setViewportSize({ width: 375, height: 667 }); await page.waitForTimeout(300);
  for (const [gen, seed] of [['pm-same-things', 1], ['ps-find-match', 1], ['pm-different-vehicles', 2]]) {
    const q = await show(gen, seed); await page.evaluate(() => (document.scrollingElement || document.documentElement).scrollTo(0, 0)); await page.waitForTimeout(200);
    await settle(); await page.locator(`button[data-choice="${q.choices[0]}"]`).click(); await page.waitForTimeout(700);
    const at = await page.evaluate(() => { const b = [...document.querySelectorAll('[data-practice-next] button')].find((x) => /Check answer/.test(x.textContent)); if (!b) return null; const r = b.getBoundingClientRect(); return { bottom: Math.round(r.bottom), H: window.innerHeight, cue: !!document.querySelector('[data-scroll-cue]') }; });
    cueSeen.push({ gen, ...at });
  }
  ok('on a short phone, once a pre-reader taps a choice, Check answer is on the screen or the scroll cue shows', cueSeen.length === 3 && cueSeen.every((r) => r.bottom !== null && (r.bottom <= r.H || r.cue)), cueSeen);
  await page.setViewportSize({ width: 1280, height: 900 }); await page.waitForTimeout(300); }

// 5. A reader's wrong answer opens More Info by itself (Mikey: "It could be cool to have the popup show up automatically when a
//    wrong answer is selected too"), the one chosen first; on a 375 by 667 phone a tall sheet starts on screen and worded
//    choices are not squeezed into a narrow box.
{ await walk('Walk through elementary');
  // The setup line sits above its question since pass MH (the order the voice reads them), kept there by Mikey's answer to Q30.
  { const gen = Object.keys(L.GENERATORS).find((id) => { try { const k = L.generateQuestion(id, 3); return id.startsWith('r3-') && k.type === 'choice' && k.story; } catch (e) { return false; } });
    if (gen) await show(gen, 3);
    const order = await page.evaluate(() => { const st = document.querySelector('[data-question-setup]'); const qt = document.querySelector('[data-question-text]'); return st && qt ? { setup: Math.round(st.getBoundingClientRect().top), question: Math.round(qt.getBoundingClientRect().top) } : null; });
    ok('a setup line sits above its question on the practice screen', !!gen && !!order && order.setup < order.question, { gen, order }); }
  const q = await show('s3-which-state', 3); const wrongs = q.choices.filter((c) => c !== q.answer); const wrong = wrongs[wrongs.length - 1];
  await settle(); await page.getByRole('button', { name: wrong, exact: true }).first().click(); await page.getByRole('button', { name: 'Check answer' }).click(); await page.waitForTimeout(600);
  const first = await page.locator('[data-more-info-wrong]').first().getAttribute('data-more-info-wrong').catch(() => null);
  ok("a reader's wrong answer opens More Info by itself, the chosen answer first though it came last among the choices", wrongs.length >= 2 && first === wrong, { first, wrong, wrongs });
  await tapIf('Got it');
  await walk('Walk through middle school');
  // A short phone (360 by 640): the sheet opens at its top as it is, before anything scrolls it (the screen check's second read:
  // the focus on Got it once scrolled the title and the speaker off the top).
  await page.setViewportSize({ width: 360, height: 640 });
  const six = await show('wc6-culture-part', 1); const sixWrong = six.choices.filter((c) => c !== six.answer).pop();
  await settle(); await page.getByRole('button', { name: sixWrong, exact: true }).first().click(); await page.getByRole('button', { name: 'Check answer' }).click(); await page.waitForTimeout(700);
  const sheet = await page.evaluate(() => { const box = document.querySelector('[data-more-info]'); const title = box ? [...box.querySelectorAll('p')].find((p) => p.textContent.trim() === 'More Info') : null; const r = box ? box.getBoundingClientRect() : null; const boxed = [...document.querySelectorAll('[data-more-info-wrong]')].filter((row) => row.children.length > 1).length; return { top: r ? Math.round(r.top) : null, title: title ? Math.round(title.getBoundingClientRect().top) : null, tall: r ? Math.round(r.height) : 0, boxed, rows: document.querySelectorAll('[data-more-info-wrong]').length, answer: !!box && !!box.querySelector('[data-more-info-answer]') }; });
  ok('on a 360 by 640 phone a tall More Info sheet opens with its title and speaker on the screen', sheet.top !== null && sheet.top >= 0 && sheet.title >= 0 && sheet.tall > 600, sheet);
  ok('worded choices are named by their sentences alone, never broken into a narrow box, and the answer is named above its reason', sheet.rows === 5 && sheet.boxed === 0 && sheet.answer, sheet);
  await tapIf('Got it'); await page.setViewportSize({ width: 1280, height: 900 }); await page.waitForTimeout(300); }

// 6. The Wonder voices: four portraits in the cast's order, the question shown above each, a closing card under a rotating title,
//    and the pondering pictures inside the card, above and below its words and never beside them (Mikey, 08:05: "inside of the
//    card and around the text, not outside of the card"), drawn as line art in the card's own ink with nothing filled ("as if
//    you can see through them"), on a laptop and on a phone, around the Let's Wonder question too.
const ponder = () => page.evaluate(() => {
  const card = document.querySelector('[data-ponder-frame]'); if (!card) return null;
  const c = card.getBoundingClientRect(); const words = card.lastElementChild;
  const parts = [...words.querySelectorAll('p, button, textarea')].map((el) => el.getBoundingClientRect()).filter((r) => r.width > 0);
  const top = Math.min(...parts.map((r) => r.top)); const bottom = Math.max(...parts.map((r) => r.bottom));
  const ink = getComputedStyle(card.querySelector('[data-ponder-pictures]')).color; const text = getComputedStyle(words.querySelector('p')).color;
  const icons = [...card.querySelectorAll('[data-ponder-icon]')].map((el) => { const r = el.getBoundingClientRect(); const g = el.querySelector('g'); return { l: r.left, r: r.right, t: r.top, b: r.bottom, fill: g ? g.getAttribute('fill') : null, filled: [...el.querySelectorAll('[fill]')].filter((x) => x.getAttribute('fill') !== 'none').length }; });
  const inside = (a) => a.l >= c.left - 1 && a.r <= c.right + 1 && a.t >= c.top - 1 && a.b <= c.bottom + 1;
  return { n: icons.length, outside: icons.filter((a) => !inside(a)).length, beside: icons.filter((a) => a.b > top + 1 && a.t < bottom - 1).length,
    above: icons.filter((a) => a.b <= top + 1).length, below: icons.filter((a) => a.t >= bottom - 1).length, filled: icons.reduce((n, a) => n + a.filled, 0), lineArt: icons.every((a) => a.fill === 'none'), ink, text };
});
{ await walk('Walk through early years');
  await page.evaluate(() => window.__eduTest.openWonder('w-big-or-small', 'big-and-little')); await screenIs('wonder'); await page.waitForTimeout(600);
  const q1 = await ponder();
  ok("the Let's Wonder question holds six pondering pictures inside its card, above and below the words, none beside them", !!q1 && q1.n === 6 && q1.outside === 0 && q1.beside === 0 && q1.above >= 2 && q1.below >= 2, q1);
  ok('the pictures are line art in the card\'s own ink, nothing filled', !!q1 && q1.lineArt && q1.filled === 0 && q1.ink === q1.text, q1);
  // The card keeps its space below (the screen and code checks' second reads: the speaker once sat on its edge).
  const gapUnder = () => page.evaluate(() => { const card = document.querySelector('[data-ponder-frame]').getBoundingClientRect(); const next = [...document.querySelectorAll('button')].map((b) => b.getBoundingClientRect()).filter((r) => r.top >= card.bottom - 2).sort((a, b) => a.top - b.top)[0]; return next ? Math.round(next.top - card.bottom) : null; });
  const g1 = await gapUnder(); ok('the Let\'s Wonder card keeps at least 10 pixels of space above the speaker under it', g1 !== null && g1 >= 10, g1);
  await page.evaluate(() => window.__eduTest.openWonderVoices('w-big-or-small', 'big-and-little')); await screenIs('wonder-voices'); await page.waitForTimeout(600);
  const seen = [];
  for (let k = 0; k < 6; k++) {
    const card = await page.evaluate(() => ({ who: (document.querySelector('[data-wonder-portrait]') || {}).getAttribute ? document.querySelector('[data-wonder-portrait]').getAttribute('data-wonder-portrait') : null, asked: (document.querySelector('[data-wonder-asked]') || {}).textContent || '', closing: !!document.querySelector('[data-wonder-closing]'), title: (document.querySelector('[data-ponder-title]') || {}).textContent || '' }));
    seen.push(card);
    if (card.closing) break;
    await settle(); await page.getByLabel('Next', { exact: true }).first().click({ force: true }); await page.waitForTimeout(500);
  }
  const who = seen.filter((c) => c.who).map((c) => c.who);
  ok('a pre-reader meets four voices, each with a portrait, in the cast\'s order, with the question shown above', who.join(',') === 'Frederick,Chloe,Georgette,Mike' && seen.filter((c) => c.who).every((c) => c.asked.includes('Are you big or small?')), seen);
  const last = seen[seen.length - 1];
  ok('the closing card wears a title from the rotating list', last.closing && L.PONDER_TITLES.includes(last.title.trim()), last);
  const wide = await ponder();
  ok('on a laptop the closing card holds six pondering pictures inside it, above and below its words, none beside them', !!wide && wide.n === 6 && wide.outside === 0 && wide.beside === 0 && wide.above >= 2 && wide.below >= 2 && wide.lineArt && wide.filled === 0, wide);
  const g2 = await gapUnder(); ok('the closing card keeps at least 10 pixels of space above the speaker under it', g2 !== null && g2 >= 10, g2);
  const low = await audit(); ok('every word on the closing card reads in the dark theme', low.length === 0, low.slice(0, 3));
  await page.setViewportSize({ width: 390, height: 844 }); await page.waitForTimeout(500);
  const phone = await ponder();
  ok('on a phone the six pictures sit inside the card too, two or three above the words and the rest below', !!phone && phone.n === 6 && phone.outside === 0 && phone.beside === 0 && phone.above >= 2 && phone.above <= 3 && phone.above + phone.below === 6, phone);
  await page.setViewportSize({ width: 1280, height: 900 }); await page.waitForTimeout(300); }

// Round four's code check (pass MO): the Wonder's voice cards left mid-card by the device's back fall quiet (Frederick's card was
// said on over the overview to its end), with a stand-in voice that says a sentence a second, as section 7's does. Since pass MQ
// it takes two and a half seconds a sentence, since the young voice now rests between sentences (Mikey: "small pauses between
// sentences"): the letter pages below are closed while their second sentence is being said, so the close lands in a sentence.
{ await page.evaluate(() => { const q = []; let cur = null; let timer = null; window.__spoken = [];
    const next = () => { cur = q.shift() || null; if (!cur) return; const mine = cur; timer = setTimeout(() => { if (cur !== mine) return; cur = null; if (mine.onend) mine.onend({}); if (!cur) next(); }, 2500); };
    window.__curText = () => (cur ? cur.text : null);
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: { get speaking() { return !!cur; }, get pending() { return q.length > 0; }, cancel() { q.length = 0; if (timer) clearTimeout(timer); cur = null; }, getVoices() { return []; }, speak(u) { window.__spoken.push(u.text); q.push(u); if (!cur) next(); } } }); });
  await page.evaluate(() => window.__eduTest.openWonderVoices('w-big-or-small', 'big-and-little')); await screenIs('wonder-voices');
  await page.waitForFunction(() => window.speechSynthesis.speaking, null, { timeout: 5000 }).catch(() => {});
  const card = await page.evaluate(() => ({ said: window.__spoken.slice(), now: window.__curText() }));
  await page.evaluate(() => history.back()); await page.waitForTimeout(300);
  const after = await page.evaluate(() => ({ screen: window.__eduTest.screen, now: window.__curText() }));
  ok("the Wonder's voice cards left by the device's back fall quiet at once", !!card.now && card.said.length > 0 && after.screen !== 'wonder-voices' && !(after.now && card.said.includes(after.now)), { card, after });
  await page.waitForTimeout(300);
  // Round five's code check: a letter coloring page says its letters as it opens, and Close coloring left them being said over the
  // overview ("On the right is a lower case A." 0.8 seconds later).
  await page.evaluate(() => window.__eduTest.openColoring('letter-a')); await screenIs('coloring');
  // Its second sentence comes after the young voice's rest (pass MQ), so the page is closed once that sentence is being said.
  await page.waitForFunction(() => /lower case A/.test(window.__curText() || ''), null, { timeout: 9000 }).catch(() => {});
  const page1 = await page.evaluate(() => ({ said: window.__spoken.slice(), now: window.__curText() }));
  await page.getByRole('button', { name: 'Close coloring', exact: true }).click(); await page.waitForTimeout(300);
  const page2 = await page.evaluate(() => ({ screen: window.__eduTest.screen, now: window.__curText() }));
  ok('a letter coloring page closed falls quiet at once', !!page1.now && /lower case A/.test(page1.said.join(' ')) && page2.screen !== 'coloring' && !(page2.now && page1.said.includes(page2.now)), { page1, page2 });
  await page.waitForTimeout(300);
  // Closed in the rest between its two sentences (pass MQ): the rest's timer finds the page gone and says nothing more, so the
  // second sentence is never said over the overview.
  await page.evaluate(() => { window.__spoken.length = 0; window.__eduTest.openColoring('letter-a'); }); await screenIs('coloring');
  // The close is pressed inside the page the moment the rest is seen (round one's code check, pass MQ: a click sent from the test
  // after it spotted the rest could land in the next sentence, and fail falsely).
  const resting = await page.evaluate(() => new Promise((done) => { const t0 = Date.now(); const poll = setInterval(() => {
    if (window.__spoken.length === 1 && !window.__curText() && /capital A/.test(window.__spoken[0])) { clearInterval(poll); const b = document.querySelector('button[aria-label="Close coloring"]'); if (b) b.click(); done(!!b); }
    else if (Date.now() - t0 > 9000) { clearInterval(poll); done(false); } }, 10); }));
  await page.waitForTimeout(1500);
  const restClosed = await page.evaluate(() => ({ screen: window.__eduTest.screen, said: window.__spoken.slice(), now: window.__curText() }));
  ok('a letter coloring page closed in the rest between its sentences never says the next one', resting && restClosed.screen !== 'coloring' && restClosed.said.length === 1 && !restClosed.now, { resting, restClosed });
  await page.waitForTimeout(300);
  // Round six's code check: a letter page whose time runs out while it talks falls quiet too (the page closes itself then, so a hush
  // in Close coloring alone would leave its letters said over the overview); setColoringLeft brings the time's end near.
  // Since round eight's read the tap comes first: the page's next one-second tick after setColoringLeft(1) closes it, and a tap
  // that came after that tick would wait for a button that is gone.
  await page.evaluate(() => window.__eduTest.openColoring('letter-b')); await screenIs('coloring'); await page.waitForTimeout(200);
  await page.getByRole('button', { name: 'Say the letters again', exact: true }).click();
  // The time runs out while the second sentence is being said (pass MQ: it follows the first after the young voice's rest).
  await page.waitForFunction(() => /lower case B/.test(window.__curText() || ''), null, { timeout: 9000 }).catch(() => {});
  await page.evaluate(() => window.__eduTest.setColoringLeft(1));
  await page.waitForFunction(() => window.__eduTest.screen !== 'coloring', null, { timeout: 8000 }).catch(() => {});
  const page3 = await page.evaluate(() => ({ screen: window.__eduTest.screen, said: window.__spoken.slice() }));
  await page.waitForTimeout(300);
  const page4 = await page.evaluate(() => ({ screen: window.__eduTest.screen, now: window.__curText() }));
  ok('a letter coloring page whose time runs out while it talks falls quiet at once', page3.screen !== 'coloring' && /lower case B/.test(page3.said.join(' ')) && page4.screen !== 'coloring' && !(page4.now && /capital B|lower case B/.test(page4.now)), { page3, page4 });
  await page.waitForTimeout(300); }

// 7. The read-along lights the sentence being read, not the paragraph (Mikey: "I meant just the words (how they were before) but
//    the highlight color is supposed to make it easier to read.  It was hard to see before in dark theme"). A stand-in voice says
//    one sentence at a time, a second each, so the light can be watched moving from the first sentence to the next.
{ await page.evaluate(() => { const q = []; let cur = null; let timer = null; window.__spoken = []; window.__rates = [];
    const next = () => { cur = q.shift() || null; if (!cur) return; const mine = cur; timer = setTimeout(() => { if (cur !== mine) return; cur = null; if (mine.onend) mine.onend({}); if (!cur) next(); }, 1000); };
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: { get speaking() { return !!cur; }, get pending() { return q.length > 0; }, cancel() { q.length = 0; if (timer) clearTimeout(timer); cur = null; }, getVoices() { return []; }, speak(u) { window.__spoken.push(u.text); window.__rates.push(u.rate); q.push(u); if (!cur) next(); } } }); });
  await page.evaluate(() => window.__eduTest.openStory('colours'));
  const litNow = () => page.evaluate(() => { const els = [...document.querySelectorAll('[data-read-lit]')]; const el = els[0]; if (!el) return { n: 0 }; const par = el.closest('[data-story-par]'); return { n: els.length, text: el.textContent, par: par ? par.getAttribute('data-story-par') : null, parText: par ? par.textContent.trim() : '', bg: getComputedStyle(el).backgroundColor, display: getComputedStyle(el).display }; });
  await page.waitForFunction(() => { const el = document.querySelector('[data-read-lit]'); return !!el && !!el.closest('[data-story-par]'); }, null, { timeout: 15000 });
  const a = await litNow();
  ok('the read-along lights one sentence, inline, inside its paragraph, never the paragraph whole', a.n === 1 && a.display === 'inline' && /[.!?]$/.test(a.text.trim()) && a.parText.length > a.text.trim().length && a.parText.includes(a.text.trim()), a);
  ok('the lit words end at their own last letter, the space before the next sentence outside the light', a.text === a.text.trim(), JSON.stringify(a.text.slice(-6)));
  ok('in the dark theme the lit words sit on the light green that reads', a.bg === 'rgb(170, 216, 197)', a.bg);
  await page.waitForFunction((t) => { const el = document.querySelector('[data-read-lit]'); return !!el && el.textContent !== t; }, a.text, { timeout: 8000 }).catch(() => {});
  const b = await litNow();
  ok('the light moves on to the next sentence as the voice does', b.n === 1 && b.text !== a.text, { a: a.text, b: b.text });
  // The light fades from one sentence to the next in 150 ms, so the words are measured once it has settled.
  await page.waitForTimeout(400);
  const low = await audit(); ok('the lit sentence and every word around it read in the dark theme', low.length === 0, low.slice(0, 3));
  // Two pace taps in quick succession leave one reading, never two (the code and screen checks: every sentence was said twice).
  const before = await page.evaluate(() => window.__spoken.length);
  const pressed = await page.evaluate(() => { const b = document.querySelector('button[aria-label="Read slowly"]'); return b && b.getAttribute('aria-pressed') === 'true' ? 'slow' : 'normal'; });
  const [tap1, tap2] = pressed === 'slow' ? ['Read at the usual speed', 'Read slowly'] : ['Read slowly', 'Read at the usual speed'];
  await page.getByLabel(tap1).click({ force: true }); await page.getByLabel(tap2).click({ force: true }); await page.waitForTimeout(3500);
  const after = await page.evaluate((n) => window.__spoken.slice(n), before);
  const twice = after.filter((t, i) => after.indexOf(t) !== i);
  ok('two quick pace taps leave one reading going, no sentence said twice', after.length > 0 && twice.length === 0, after);
  await tapIf('Stop reading');
  // The title stays truly centered with the speaker, the snail and the hare to its right (Mikey: "Make sure the title stays true
  // to center and isn't pushed left."), measured on its words at 640 and 700 pixels wide.
  const centred = [];
  for (const w of [640, 700]) { await page.setViewportSize({ width: w, height: 900 }); await page.waitForTimeout(400);
    centred.push(await page.evaluate(() => { const h = document.querySelector('[data-story-head]'); const p = h && h.querySelector('p'); if (!p || !p.firstChild) return null; const r = document.createRange(); r.selectNodeContents(p); const t = r.getBoundingClientRect(); const c = h.getBoundingClientRect(); return { w: window.innerWidth, off: Math.round(Math.abs((t.left + t.right) / 2 - (c.left + c.right) / 2) * 10) / 10 }; })); }
  ok("the story's title stays centered in its card beside the speaker, the snail and the hare", centred.every((x) => x && x.off <= 2), centred);
  // j. On a narrow phone the snail and the hare sit either side of the gold speaker (pass MO, Mikey: "On narrow phone screens, we
  //    can move the snail and hair on both sides of the gold sound icon on top to create symmetry.  Keep the same on wider
  //    screens"): at 390 and 360 pixels the snail, the speaker and the hare sit in that order on one line above the title, the
  //    speaker centred on the card and the two the same distance from it; at 1280 the speaker, the snail and the hare stay to the
  //    right of the title, in that order, level with it.
  const heads = [];
  for (const w of [390, 360, 1280]) { await page.setViewportSize({ width: w, height: 900 }); await page.waitForTimeout(400);
    heads.push(await page.evaluate(() => { const h = document.querySelector('[data-story-head]'); if (!h) return null; const at = (el) => { const r = el.getBoundingClientRect(); return { l: r.left, r: r.right, t: r.top, b: r.bottom, c: (r.left + r.right) / 2, m: (r.top + r.bottom) / 2 }; };
      const sp = [...h.querySelectorAll('button')].find((b) => /Read the story to me|Stop reading/.test(b.getAttribute('aria-label') || '')); const sn = h.querySelector('[data-pace="slow"]'); const ha = h.querySelector('[data-pace="normal"]'); const ti = h.querySelector('p');
      if (!sp || !sn || !ha || !ti) return null; return { w: window.innerWidth, card: at(h), sp: at(sp), sn: at(sn), ha: at(ha), ti: at(ti) }; })); }
  const narrowHead = (x) => !!x && x.sn.r <= x.sp.l && x.sp.r <= x.ha.l && Math.abs(x.sp.c - x.card.c) <= 2 && Math.abs((x.sp.l - x.sn.r) - (x.ha.l - x.sp.r)) <= 1 && Math.abs((x.sp.c - x.sn.c) - (x.ha.c - x.sp.c)) <= 2 && x.sp.b <= x.ti.t && Math.abs(x.sn.m - x.sp.m) <= 1 && Math.abs(x.ha.m - x.sp.m) <= 1;
  const wideHead = (x) => !!x && x.sp.l >= x.ti.r - 2 && x.sp.r <= x.sn.l && x.sn.r <= x.ha.l && Math.abs(x.sp.m - x.ti.m) <= 12;
  ok("on a narrow phone the story's snail and hare sit either side of the gold speaker, centred above the title; from 640 pixels they stay to the title's right", narrowHead(heads[0]) && narrowHead(heads[1]) && wideHead(heads[2]), heads);
  await page.setViewportSize({ width: 1280, height: 900 }); await page.waitForTimeout(300);
  // The follow-scroll waits for the reader (Mikey: "The stories, as they are being read and words are highlighted, pulls me back
  // up the page when I scroll down and sit still."): on a phone, a wheel scroll down during the reading is never undone as the
  // voice moves on.
  await page.setViewportSize({ width: 390, height: 600 }); await page.waitForTimeout(300);
  await page.evaluate(() => (document.scrollingElement || document.documentElement).scrollTo(0, 0)); await page.waitForTimeout(300);
  await page.getByLabel('Read the story to me').first().click({ force: true });
  await page.waitForFunction(() => { const el = document.querySelector('[data-read-lit]'); return !!el && !!el.closest('[data-story-par]'); }, null, { timeout: 15000 });
  const top = () => page.evaluate(() => Math.round((document.scrollingElement || document.documentElement).scrollTop));
  const readingPar = () => page.evaluate(() => { const el = document.querySelector('[data-story-par][data-reading]'); return el ? Number(el.getAttribute('data-story-par')) : -1; });
  const p0 = await readingPar();
  await page.mouse.move(195, 300); await page.mouse.wheel(0, 900); await page.waitForTimeout(400);
  const y1 = await top();
  // The voice moves on to the next paragraph, which now sits above the screen: the old follow scrolled back up to it.
  await page.waitForFunction((p) => { const el = document.querySelector('[data-story-par][data-reading]'); return !!el && Number(el.getAttribute('data-story-par')) > p; }, p0, { timeout: 15000 }).catch(() => {});
  const p1 = await readingPar(); await page.waitForTimeout(900); const y2 = await top();
  ok('a reader who scrolls down during the reading is not pulled back up when the voice moves to the next paragraph', y1 > 100 && p1 > p0 && y2 >= y1 - 5, { y1, y2, p0, p1 });
  // Space on a focused pace button presses it and is not the reader scrolling (the second read of the late fixes: one Space on
  // the snail had stopped the following for the rest of the story): two paragraphs on, the one being read is on the screen.
  await tapIf('Stop reading'); await page.waitForTimeout(300);
  await page.evaluate(() => (document.scrollingElement || document.documentElement).scrollTo(0, 0)); await page.waitForTimeout(300);
  await page.getByLabel('Read the story to me').first().click({ force: true });
  await page.waitForFunction(() => !!document.querySelector('[data-story-par][data-reading]'), null, { timeout: 15000 });
  await page.locator('button[aria-label="Read slowly"]').first().focus(); await page.keyboard.press(' ');
  const s0 = await readingPar();
  await page.waitForFunction((p) => { const el = document.querySelector('[data-story-par][data-reading]'); return !!el && Number(el.getAttribute('data-story-par')) >= p + 2; }, s0, { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(900);
  const followed = await page.evaluate(() => { const el = document.querySelector('[data-story-par][data-reading]'); const r = el && el.getBoundingClientRect(); return r ? { par: Number(el.getAttribute('data-story-par')), top: Math.round(r.top), bottom: Math.round(r.bottom), H: innerHeight } : null; });
  ok('Space on a focused pace button never stops the page following the voice', !!followed && followed.par >= s0 + 2 && followed.bottom > 0 && followed.top < followed.H, { s0, followed });
  await tapIf('Stop reading'); await page.setViewportSize({ width: 1280, height: 900 }); await page.waitForTimeout(300); }

// 7b. The whole book waits for the reader too (the second read of the late fixes): Read the whole book to me scrolls to each
//     story the voice starts, and a reader who has scrolled the page is left where they are when the voice starts the next.
{ await page.setViewportSize({ width: 390, height: 600 }); await page.waitForTimeout(300);
  await page.evaluate(() => window.__eduTest.goTo('story-book')); await screenIs('story-book'); await page.waitForTimeout(800);
  await page.evaluate(() => (document.scrollingElement || document.documentElement).scrollTo(0, 0)); await page.waitForTimeout(300);
  const y = () => page.evaluate(() => Math.round((document.scrollingElement || document.documentElement).scrollTop));
  const storyNow = () => page.evaluate(() => { const m = document.body.innerText.match(/Reading story (\d+) of/); return m ? Number(m[1]) : 0; });
  await page.getByRole('button', { name: 'Read the whole book to me' }).first().click({ force: true });
  await page.waitForFunction(() => /Reading story 1 of/.test(document.body.innerText), null, { timeout: 15000 });
  await page.waitForTimeout(1500);
  await page.mouse.move(195, 300); await page.mouse.wheel(0, 700); await page.waitForTimeout(600);
  const y1 = await y();
  await page.waitForFunction(() => /Reading story 2 of/.test(document.body.innerText), null, { timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(1500); const y2 = await y(); const at = await storyNow();
  ok('the whole book never pulls back a reader who scrolled when the voice starts the next story', at >= 2 && y1 > 0 && Math.abs(y2 - y1) <= 5, { y1, y2, at });
  await tapIf('Stop reading'); await page.setViewportSize({ width: 1280, height: 900 }); await page.waitForTimeout(300); }

// 8. The light theme's Let's Wonder! title from 700 pixels (Q27, Mikey: "whatever you think is most visually appealing from a
//    modern and unique designer perspective"): it had shown nothing there since September 2026, since the wide screen's backing
//    reset the clip that draws the gradient in the letters. Switched to the light theme on the Classroom page, at 1280 wide it
//    shows its letters, and every color of the shimmer reads at 3 to 1 or better on the page.
{ await page.evaluate(() => window.__eduTest.goTo('educator-pick')); await page.waitForTimeout(400); for (const n of ['Skip tour', 'Later', 'Got it']) await tapIf(n);
  await page.getByLabel('Light theme').first().click({ force: true }); await page.waitForTimeout(400);
  await walk('Walk through early years');
  await page.evaluate(() => window.__eduTest.openWonderVoices('w-ants-elephant', 'count-to-5')); await page.waitForTimeout(400);
  await page.evaluate(() => window.__eduTest.goTo('wonder')); await page.waitForTimeout(700);
  const title = await page.evaluate(() => {
    const parse = (s) => (String(s).match(/[\d.]+/g) || []).map(Number); const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b); const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
    const h = [...document.querySelectorAll('h1')].find((x) => /Let's Wonder/.test(x.textContent)); if (!h) return null;
    let n = h.parentElement; let bg = null; while (n && n.nodeType === 1) { const c = parse(getComputedStyle(n).backgroundColor); if (c.length >= 3 && (c.length < 4 || c[3] >= 1)) { bg = c; break; } n = n.parentElement; }
    const stops = (getComputedStyle(h).backgroundImage.match(/rgba?\([^)]+\)/g) || []).map(parse);
    return { theme: document.documentElement.dataset.theme, screen: window.__eduTest.screen, stops: stops.length, clip: getComputedStyle(h).backgroundClip || getComputedStyle(h).webkitBackgroundClip, worst: stops.length ? Math.round(Math.min(...stops.map((x) => ratio(x, bg || [255, 255, 255]))) * 100) / 100 : 0 };
  });
  ok("in the light theme at 1280 the Let's Wonder! title shows its letters, every color of its shimmer at 3 to 1 or better", !!title && title.theme !== 'dark' && title.screen === 'wonder' && title.stops >= 3 && title.clip === 'text' && title.worst >= 3, title); }

// 9. Pass MI, from Mikey's notes, in the light theme the section above left on, at 1280 wide.
//    a. Q32 ("I agree with you"): the lit sentence is the same light green in the light theme.
{ await page.evaluate(() => { const q = []; let cur = null; let timer = null; window.__spoken = []; window.__rates = [];
    const next = () => { cur = q.shift() || null; if (!cur) return; const mine = cur; if (mine.onstart) mine.onstart({}); timer = setTimeout(() => { if (cur !== mine) return; cur = null; if (mine.onend) mine.onend({}); if (!cur) next(); }, 1000); };
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: { get speaking() { return !!cur; }, get pending() { return q.length > 0; }, cancel() { q.length = 0; if (timer) clearTimeout(timer); cur = null; }, getVoices() { return []; }, speak(u) { window.__spoken.push(u.text); window.__rates.push(u.rate); q.push(u); if (!cur) next(); } } }); });
  await page.evaluate(() => window.__eduTest.openStory('colours'));
  await page.waitForFunction(() => { const el = document.querySelector('[data-read-lit]'); return !!el && !!el.closest('[data-story-par]'); }, null, { timeout: 15000 }).catch(() => {});
  const lit = await page.evaluate(() => { const el = document.querySelector('[data-read-lit]'); return el ? { bg: getComputedStyle(el).backgroundColor, color: getComputedStyle(el).color, theme: document.documentElement.dataset.theme } : null; });
  ok('in the light theme the lit sentence takes the same light green as the dark theme, with dark words on it (Q32)', !!lit && lit.theme !== 'dark' && lit.bg === 'rgb(170, 216, 197)' && lit.color === 'rgb(22, 32, 27)', lit);
  await page.evaluate(() => window.speechSynthesis.cancel()); }
//    b. "the answer is repeated twice.  "Blue, blue" and "red, red"": a voice with a real speaking flag says a short word and is
//       done inside the 700 ms the old retry waited; the word is said once.
{ await page.evaluate(() => { const q = []; let cur = null; let timer = null; window.__spoken = [];
    const next = () => { cur = q.shift() || null; if (!cur) return; const mine = cur; if (mine.onstart) mine.onstart({}); timer = setTimeout(() => { if (cur !== mine) return; cur = null; if (mine.onend) mine.onend({}); if (!cur) next(); }, 150); };
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: { get speaking() { return !!cur; }, get pending() { return q.length > 0; }, cancel() { q.length = 0; if (timer) clearTimeout(timer); cur = null; }, getVoices() { return []; }, speak(u) { window.__spoken.push(u.text); (window.__ratesWord = window.__ratesWord || []).push(u.rate); q.push(u); if (!cur) next(); } } }); });
  await page.evaluate(() => { window.__spoken = []; window.__ratesWord = []; });
  const q = await show('p3-which-colour-four', 3); await page.waitForTimeout(2500);
  // The question itself is said in the young voice (pass MQ, round one's code check: nothing read a pre-reader's practice rate, so
  // taking practice out of the young voice's screens passed every browser test): its question shape's rate times YOUNG_RATE.
  const asked = await page.evaluate(() => { const k = window.__spoken.findIndex((t) => t.trim() === 'What color is this?'); return k >= 0 ? window.__ratesWord[k] : null; });
  ok('a pre-reader\'s question is said in the young voice, a little slower than the question shape\'s 0.9 (pass MQ)', typeof asked === 'number' && Math.abs(asked - 0.81) < 1e-6, asked);
  await page.evaluate(() => { window.__spoken = []; window.__ratesWord = []; });
  const word = q.choices.find((c) => c !== q.answer);
  await settle(); await page.locator(`button[data-choice="${word}"]`).click(); await page.waitForTimeout(1600);
  const said = await page.evaluate(() => window.__spoken.slice());
  ok(`a tapped word is said once, never twice ("Blue, blue"): ${word}`, said.filter((t) => t.trim().toLowerCase() === String(word).toLowerCase()).length === 1, said);
  // The story read on the snail in 9a has closed, and its slower pace closed with it (the alignment read): the word is said at
  // the one-word pace, 0.6, not three quarters of it.
  const rate = await page.evaluate((w) => { const k = window.__spoken.findIndex((t) => t.trim().toLowerCase() === String(w).toLowerCase()); return k >= 0 && window.__ratesWord ? window.__ratesWord[k] : null; }, word);
  ok('a story\'s slow pace does not outlive the story: the tapped word is said at its own pace', rate === 0.6, rate); }
//    c. The touch-screen warning (Mikey: "isolated by itself under the gold stars ... doesn't appear to be associated with any
//       particular module"): on a device with no touch screen a touch lesson opens a pop-up that names it, and nothing is left on
//       the page.
{ await page.evaluate(() => window.__eduTest.goHome && window.__eduTest.goHome()); await walk('Walk through early years');
  await page.evaluate(() => { window.__touchWas = { m: window.matchMedia, d: Object.getOwnPropertyDescriptor(Navigator.prototype, 'maxTouchPoints') }; Object.defineProperty(navigator, 'maxTouchPoints', { configurable: true, get: () => 0 }); const mm = window.matchMedia.bind(window); window.matchMedia = (qq) => (/pointer: coarse/.test(qq) ? { matches: false, media: qq, onchange: null, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent() { return false; } } : mm(qq)); });
  await page.evaluate(() => window.__eduTest.openModule('tracing-letters')); await page.waitForTimeout(700);
  const pop = await page.evaluate(() => { const el = document.querySelector('[data-touch-only]'); return el ? { text: el.textContent, screen: window.__eduTest.screen } : null; });
  ok('a touch lesson tapped on a laptop opens a pop-up on the overview that names it', !!pop && pop.screen === 'overview' && pop.text.includes('Tracing Letters needs a touch screen.') && pop.text.includes('An iPad or another large tablet with a stylus is best.'), pop);
  await page.getByRole('button', { name: 'Got it', exact: true }).first().click(); await page.waitForTimeout(400);
  const left = await page.evaluate(() => ({ pop: document.querySelectorAll('[data-touch-only]').length, stray: document.body.innerText.includes('This module needs a touch screen') }));
  ok('Got it closes it, and no warning is left at the foot of the page', left.pop === 0 && !left.stray, left);
  await page.evaluate(() => { delete navigator.maxTouchPoints; window.matchMedia = window.__touchWas.m; }); }
//    d. More Info read aloud (Mikey: "highlight those words when they are spoken too", "a delay between each description so it
//       isn't witching sentences too fast", "a little slower too for early learners"): a stand-in voice that times each line.
{ const q = await show('p3-tap-picture', 5);
  await settle(); await page.locator(`button[data-choice="${q.answer}"]`).click(); await page.getByRole('button', { name: 'Check answer' }).click(); await page.waitForTimeout(600);
  await page.locator('[data-more-info-link]').click(); await page.waitForTimeout(500);
  await page.evaluate(() => { const q2 = []; let cur = null; let timer = null; window.__lines = [];
    const next = () => { cur = q2.shift() || null; if (!cur) return; const mine = cur; const rec = { text: mine.text, rate: mine.rate, start: performance.now(), end: null }; window.__lines.push(rec); if (mine.onstart) mine.onstart({}); timer = setTimeout(() => { if (cur !== mine) return; cur = null; rec.end = performance.now(); if (mine.onend) mine.onend({}); if (!cur) next(); }, 300); };
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: { get speaking() { return !!cur; }, get pending() { return q2.length > 0; }, cancel() { q2.length = 0; if (timer) clearTimeout(timer); cur = null; }, getVoices() { return []; }, speak(u) { q2.push(u); if (!cur) next(); } } }); });
  const parts = await page.locator('[data-more-info-words]').evaluateAll((els) => els.length);
  // The question's own words may still be resting between sentences when More Info opens (the young voice, pass MQ), and a line said
  // then is cut off by More Info's reading: wait for the quiet and a rest's length, and read only what More Info says.
  await page.waitForFunction(() => !window.speechSynthesis.speaking && !window.speechSynthesis.pending, null, { timeout: 8000 }).catch(() => {}); await page.waitForTimeout(700);
  await page.evaluate(() => { window.__lines = []; });
  await page.locator('[data-more-info-speaker]').click();
  await page.waitForFunction(() => !!document.querySelector('[data-more-info] [data-read-lit]'), null, { timeout: 5000 }).catch(() => {});
  const first = await page.evaluate(() => { const el = document.querySelector('[data-more-info] [data-read-lit]'); const rows = [...document.querySelectorAll('[data-more-info-words]')]; return el ? { row: rows.findIndex((r) => r.contains(el)), bg: getComputedStyle(el).backgroundColor } : null; });
  ok('More Info read aloud lights the sentence being read, starting in the first row, in the light green', !!first && first.row === 0 && first.bg === 'rgb(170, 216, 197)', first);
  await page.waitForFunction(() => { const el = document.querySelector('[data-more-info] [data-read-lit]'); const rows = [...document.querySelectorAll('[data-more-info-words]')]; return !!el && rows.findIndex((r) => r.contains(el)) >= 1; }, null, { timeout: 8000 }).catch(() => {});
  const moved = await page.evaluate(() => { const el = document.querySelector('[data-more-info] [data-read-lit]'); const rows = [...document.querySelectorAll('[data-more-info-words]')]; return el ? rows.findIndex((r) => r.contains(el)) : -1; });
  ok('the light moves on to the next description as the voice does', moved >= 1, moved);
  await page.waitForFunction(() => window.__lines.length > 0 && window.__lines.every((l) => l.end !== null) && !document.querySelector('[data-more-info] [data-read-lit]'), null, { timeout: 30000 }).catch(() => {});
  const lines = await page.evaluate(() => window.__lines);
  const gaps = lines.slice(1).map((l, k) => Math.round(l.start - lines[k].end));
  const pauses = gaps.filter((g) => g >= 900).length; const quick = gaps.filter((g) => g < 900);
  // Inside one description, the young voice's short rest between its sentences (pass MQ, Mikey: "small pauses between sentences"),
  // about half a second, never a second's pause and never none.
  ok(`a pause of about a second sits between one description and the next, and a short rest between the sentences inside one (${parts} descriptions)`, parts >= 3 && pauses === parts - 1 && quick.every((g) => g >= 350 && g < 700), gaps);
  const base = [0.6, 0.9, 0.86, 0.1];
  // Exactly 0.85 of the voice's own pace: the story read before this put its snail back when it closed (the second read).
  ok('an early learner hears More Info a little slower: every line at 0.85 of its pace, with no story pace left over', lines.length >= parts && lines.every((l) => base.some((b) => Math.abs(l.rate - b * 0.85) < 0.002)), lines.map((l) => l.rate));
  await page.getByRole('button', { name: 'Got it', exact: true }).first().click(); await page.waitForTimeout(300); }

//    e. Letters and tracing (pass MM, round two's lesson check B and game check): a letter question prints no letter while the
//       voice can say it ("Tap the letter E." over E, S and B let a child match the printed capital), and the whole question with
//       no voice, for a grown-up to read; and the tracing pad shows every stroke's starting dot on top, T's stem included, which
//       the bar's guide had covered once the stem came first.
{ const DL = await import('../../src/logic.mjs');
  const qt = async () => (await page.locator('[data-question-text]').first().innerText()).trim();
  await show('pl-tap-letter', 1); const tapText = await qt();
  await show('pl-is-letter', 2); const isText = await qt();
  ok('a letter question prints "Tap the letter you hear." or "Is this the letter you hear?" while the voice can say the letter', tapText === 'Tap the letter you hear.' && isText === 'Is this the letter you hear?', [tapText, isText]);
  await page.evaluate(() => { window.__savedSS = window.speechSynthesis; Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: undefined }); });
  const q1 = await show('pl-tap-letter', 3); const noVoice = await qt();
  await page.evaluate(() => Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: window.__savedSS }));
  ok('with no voice a letter question prints whole, for a grown-up to read', noVoice === q1.prompt && /letter [A-Z]\.$/.test(noVoice), noVoice);
  // Q49 (pass MN, Mikey: "Q49 - Your recommendation "): one line's dot and arrow at a time, on top of every guide, the next line's
  // once a line is traced; in pre-K a line traced backward stays and nothing is said, and from kindergarten up it clears as the finger
  // lifts and the line under the pad and the voice say TRACE_BACK_WORDS until the finger starts the next line. A finger is drawn on
  // the real pad, point by point, as a child's would be. Since round one's screen check: the next line's dot sits on top of the ink
  // where that line starts on one already traced (L's foot at the end of its stem), and a closed line traced the other way from its
  // dot clears with words that name the arrow (the child did start at the dot).
  const padDots = () => page.evaluate(() => [...document.querySelectorAll('g[data-trace-start]')].map((g) => { const c = g.querySelector('circle'); const r = c.getBoundingClientRect(); const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return { line: g.getAttribute('data-trace-start'), onTop: !!top && (top === c || top.closest('g[data-trace-start]') === g) }; }));
  const padState = async () => ({ dots: await padDots(), ink: await page.locator('svg[aria-label^="Trace"] polyline').count(), note: (await page.locator('[data-trace-note]').first().textContent()).trim(), said: await page.evaluate(() => (window.__spoken || []).slice()) });
  const drawPts = async (pts) => { const b = await page.locator('svg[aria-label^="Trace"]').first().boundingBox(); const at = ([x, y]) => [b.x + (x / 100) * b.width, b.y + (y / 100) * b.height]; const [x0, y0] = at(pts[0]); await page.mouse.move(x0, y0); await page.mouse.down(); for (let i = 1; i < pts.length; i++) for (let k = 1; k <= 4; k++) { const [x, y] = at([pts[i - 1][0] + ((pts[i][0] - pts[i - 1][0]) * k) / 4, pts[i - 1][1] + ((pts[i][1] - pts[i - 1][1]) * k) / 4]); await page.mouse.move(x, y); } await page.mouse.up(); await page.waitForTimeout(300); };
  const drawLine = async (from, to) => { const b = await page.locator('svg[aria-label^="Trace"]').first().boundingBox(); const at = ([x, y]) => [b.x + (x / 100) * b.width, b.y + (y / 100) * b.height]; const [x0, y0] = at(from); await page.mouse.move(x0, y0); await page.mouse.down(); for (let k = 1; k <= 24; k++) { const [x, y] = at([from[0] + ((to[0] - from[0]) * k) / 24, from[1] + ((to[1] - from[1]) * k) / 24]); await page.mouse.move(x, y); } await page.mouse.up(); await page.waitForTimeout(300); };
  let seedT = 0; for (let s = 1; s < 300 && !seedT; s++) if (DL.generateQuestion('pl-trace-first', s).answer === 'T') seedT = s;
  // A stand-in voice of its own for both halves, which records every line, reports speaking and pending as a device voice does and
  // ends a line fast, put back when the check is done (pass MM's rule: a test that swaps the page's voice puts the page's own back).
  // Since round one's code check it is in place before the pre-K half, whose "nothing said" read an older recorder and could not fail.
  await page.evaluate(() => { window.__voiceBeforeTrace = window.speechSynthesis; window.__spoken = []; const q = []; let cur = null;
    let timer = null; const next = () => { cur = q.shift() || null; if (!cur) return; const u = cur; window.__spoken.push(u.text); if (u.onstart) u.onstart({}); timer = setTimeout(() => { timer = null; cur = null; if (u.onend) u.onend({}); next(); }, 20); };
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: { get speaking() { return !!cur; }, get pending() { return q.length > 0; }, cancel() { q.length = 0; cur = null; if (timer) { clearTimeout(timer); timer = null; } }, getVoices() { return []; }, speak(u) { q.push(u); if (!cur) next(); } } }); });
  await show('pl-trace-first', seedT, 'first-letter-tracing'); await page.waitForTimeout(600); await page.evaluate(() => { window.__spoken = []; }); const p0 = await padState();
  await drawLine([50, 15], [50, 85]); const p1 = await padState();
  await drawLine([80, 15], [20, 15]); const p2 = await padState();
  ok("Q49: pre-K's pad shows T's stem's dot alone, on top, then the bar's once the stem is traced, and keeps a bar traced backward with nothing said", seedT > 0 && JSON.stringify(p0.dots) === '[{"line":"0","onTop":true}]' && JSON.stringify(p1.dots) === '[{"line":"1","onTop":true}]' && p2.dots.length === 0 && p2.ink === 2 && p2.note === '' && !p2.said.includes(DL.TRACE_BACK_WORDS), { p0, p1, p2 });
  let seedL = 0; for (let s = 1; s < 300 && !seedL; s++) if (DL.generateQuestion('pl-trace-first', s).answer === 'L') seedL = s;
  await show('pl-trace-first', seedL, 'first-letter-tracing'); await page.waitForTimeout(300);
  const lStem = DL.TRACE_LETTERS.L.strokes[0]; await drawLine(lStem[0], lStem[lStem.length - 1]); const l1 = await padState();
  ok("Q49: once L's stem is traced, the foot's dot, at the stem's end under the child's ink, is drawn on top of the ink (round one's screen check: only a rim showed)", seedL > 0 && JSON.stringify(l1.dots) === '[{"line":"1","onTop":true}]' && l1.ink === 1, l1);
  let seedK = 0; for (let s = 1; s < 300 && !seedK; s++) if (DL.generateQuestion('rt-trace-easy', s).answer === 'T') seedK = s;
  const kq = await show('rt-trace-easy', seedK, 'tracing-letters'); await page.waitForTimeout(600); await page.evaluate(() => { window.__spoken = []; });
  await drawLine([50, 85], [50, 15]); const k1 = await padState();
  await drawLine([50, 15], [50, 85]); const k2 = await padState();
  await drawLine([20, 15], [80, 15]); const k3 = await padState();
  await page.getByRole('button', { name: 'Check answer' }).click({ force: true }); await page.waitForTimeout(500);
  const verdict = await page.evaluate(() => (document.querySelector('#root').innerText.match(/Correct|Let's trace it again/) || [''])[0]);
  await page.waitForTimeout(1000); const kLater = await padState();   // past speak()'s 700 ms retry
  let seedO = 0; for (let s = 1; s < 300 && !seedO; s++) if (DL.generateQuestion('rt-trace-round', s).answer === 'O') seedO = s;
  await show('rt-trace-round', seedO, 'tracing-letters'); await page.waitForTimeout(300); await page.evaluate(() => { window.__spoken = []; });
  const ring = DL.TRACE_LETTERS.O.strokes[0]; await drawPts(ring.slice().reverse()); const o1 = await padState();
  await drawPts(ring); await page.waitForTimeout(1000); const o2 = await padState();   // past speak()'s 700 ms retry
  await page.evaluate(() => Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: window.__voiceBeforeTrace }));
  ok('Q49: from kindergarten up an O traced the other way from its dot clears, and the words shown and said name the arrow; traced along the arrow it stays (round one\'s screen check)', seedO > 0 && o1.ink === 0 && o1.note === DL.TRACE_BACK_WORDS && /follow the arrow/.test(o1.note) && o1.said.filter((t) => t === DL.TRACE_BACK_WORDS).length === 1 && o2.said.filter((t) => t === DL.TRACE_BACK_WORDS).length === 1 && o2.ink === 1 && o2.note === '' && o2.dots.length === 0, { o1, o2 });
  ok('Q49: from kindergarten up a stem traced from the bottom clears as the finger lifts, its words show and are said, and go when the next line starts; traced from its dots, T is right', kq.checkDirection === true && k1.ink === 0 && k1.note === DL.TRACE_BACK_WORDS && k1.said.filter((t) => t === DL.TRACE_BACK_WORDS).length === 1 && kLater.said.filter((t) => t === DL.TRACE_BACK_WORDS).length === 1 && JSON.stringify(k1.dots) === '[{"line":"0","onTop":true}]' && k2.note === '' && JSON.stringify(k2.dots) === '[{"line":"1","onTop":true}]' && k3.dots.length === 0 && k3.ink === 2 && verdict === 'Correct', { k1, k2, k3, verdict }); }

//    f. A pre-reader's answer stays plain after a wrong tap, until the child gets it (round two's screen check, pass MM: it turned
//       green before the retry, so the retry could be answered by color), and at 320 pixels the lesson keeps Next on the screen,
//       its dots wrapping (thirteen pushed it past the edge).
{ const q = await show('p4-rhyme-pic', 1); const wrong = q.choices.find((c) => c !== q.answer);
  const borderOf = (c) => page.locator(`button[data-choice="${c}"]`).first().evaluate((b) => getComputedStyle(b).borderTopColor);
  await settle(); await page.locator(`button[data-choice="${wrong}"]`).first().click(); await page.getByRole('button', { name: 'Check answer' }).click(); await page.waitForTimeout(500);
  const answerAfterWrong = await borderOf(q.answer); const wrongAfter = await borderOf(wrong);
  await page.getByRole('button', { name: 'Try again' }).first().click(); await page.waitForTimeout(400);
  await page.locator(`button[data-choice="${q.answer}"]`).first().click(); await page.getByRole('button', { name: 'Check answer' }).click(); await page.waitForTimeout(500);
  const answerAfterRight = await borderOf(q.answer);
  // The right tap's border differs from the wrong tap's too (round three's screen check: with the answer never turning green, the
  // check passed, since a retry's red-brown differs from plain as well).
  ok("after a pre-reader's wrong tap the answer's button stays plain, and turns green once the child taps it", answerAfterWrong !== answerAfterRight && wrongAfter !== answerAfterWrong && answerAfterRight !== wrongAfter, { answerAfterWrong, wrongAfter, answerAfterRight });
  await page.setViewportSize({ width: 320, height: 568 });
  await page.evaluate(() => window.__eduTest.openModule('listen-for-rhymes')); await page.waitForFunction(() => window.__eduTest.screen === 'lesson'); await page.waitForTimeout(700);
  const nav = await page.evaluate(() => { const n = document.querySelector('[data-lesson-nav]'); const rs = [...n.children].map((c) => c.getBoundingClientRect()); return { right: Math.round(Math.max(...rs.map((r) => r.right))), vw: window.innerWidth, dots: document.querySelectorAll('[data-lesson-dots] span').length }; });
  ok('at 320 pixels the lesson keeps Next on the screen, its thirteen dots wrapping', nav.dots >= 12 && nav.right <= nav.vw, nav);
  // The dots' rows are balanced, none left alone on a row (pass MS, round one's screen check: Learning words' nine dots left one alone on a
  // second row at 320), read on this lesson's thirteen and Learning words' nine.
  const dotRows = () => page.evaluate(() => { const rows = {}; for (const d of document.querySelectorAll('[data-lesson-dots] > span')) { const y = Math.round(d.getBoundingClientRect().top); rows[y] = (rows[y] || 0) + 1; } return Object.values(rows); });
  const rhymeRows = await dotRows(); await page.evaluate(() => window.__eduTest.openModule('learning-words')); await page.waitForFunction(() => window.__eduTest.screen === 'lesson'); await page.waitForTimeout(500); const wordRows = await dotRows();
  const balanced = (r) => r.length >= 1 && (r.length === 1 || (Math.min(...r) > 1 && Math.max(...r) - Math.min(...r) <= 1));
  ok('at 320 pixels a lesson\'s dots wrap in balanced rows, none alone on a row (pass MS)', rhymeRows.length >= 2 && balanced(rhymeRows) && wordRows.length === 2 && balanced(wordRows), { rhymeRows, wordRows });
  // g. A run of single letters balances its rows (round three's alignment read: Big letters' last line, "A   B   C   D   E   M   S",
  //    left S alone on a row at 390 and at 768 pixels), and a lesson's Next half below a short phone's fold gets its scroll cue
  //    (the screen check: Trace a Big Letter's second line showed 24 to 32 of Next's 66 pixels at 375 by 667, with no cue). Since pass
  //    MZ's round two (the code check) the cue's part measures Next itself (data-lesson-next) at 375 by 505, and needs that Next more
  //    than a third under the fold: at 375 by 667 the row had come above it (EARMARKS A80), so the check could not fail, and it measured
  //    the whole row, dots included, which can drop under the fold while Next shows whole.
  const rows = [];
  for (const w of [390, 768, 320]) {
    await page.setViewportSize({ width: w, height: 844 }); await page.evaluate(() => window.__eduTest.openModule('big-letters')); await page.waitForFunction(() => window.__eduTest.screen === 'lesson'); await page.waitForTimeout(500);
    for (let i = 0; i < 8; i++) { await page.getByRole('button', { name: 'Next' }).first().click(); await page.waitForTimeout(120); }
    await page.waitForTimeout(900);
    // The page runs with motion off, so no letter is measured mid-swell (a swell grows its box).
    rows.push(await page.evaluate((width) => { const p = [...document.querySelectorAll('p')].find((x) => x.textContent.replace(/\s/g, '') === 'ABCDEMS'); if (!p) return { width, missing: true };
      const box = p.getBoundingClientRect(); const mid = box.left + box.width / 2; const per = {};
      for (const s of [...p.querySelectorAll('span')].filter((x) => x.textContent.trim())) { const r = s.getBoundingClientRect(); const t = Math.round(r.top); const row = per[t] || (per[t] = { n: 0, l: 1e9, r: -1e9 }); row.n += 1; row.l = Math.min(row.l, r.left); row.r = Math.max(row.r, r.right); }
      return { width, rows: Object.values(per).map((x) => x.n), off: +Math.max(...Object.values(per).map((x) => Math.abs((x.l + x.r) / 2 - mid))).toFixed(1) }; }, w)); }
  ok('a run of single letters never leaves one alone on a row (Big letters\' last line at 390, 768 and 320 pixels)', rows.every((r) => !r.missing && r.rows.every((n) => n > 1)), rows);
  // And every row of it is centred (round four's code read: non-breaking spaces stayed at a row's ends, so a second row sat about
  // 25 pixels off centre); a letter's own spacing after it leaves each row 3 pixels to the right at most.
  ok("every row of a run of single letters is centred (Big letters' last line at 390, 768 and 320 pixels)", rows.every((r) => !r.missing && r.rows.length >= 2 && r.off <= 4), rows);
  await page.setViewportSize({ width: 375, height: 505 }); await page.evaluate(() => window.__eduTest.openModule('first-letter-tracing')); await page.waitForFunction(() => window.__eduTest.screen === 'lesson'); await page.waitForTimeout(500);
  await page.getByRole('button', { name: 'Next', exact: true }).first().click(); await page.waitForTimeout(400); await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(1500);
  const cue = await page.evaluate(() => { const n = document.querySelector('[data-lesson-next]').getBoundingClientRect(); return { hidden: Math.round(n.bottom - window.innerHeight), height: Math.round(n.height), cue: !!document.querySelector('[data-scroll-cue]') }; });
  ok("a lesson's Next more than a third below a short phone's fold gets the scroll cue (First letter tracing's second line, 375 by 505)", cue.hidden > cue.height / 3 && cue.cue, cue);
  // h. The cue shows while a third of the lesson's row or more is below the fold, so it never sits on a Next that is nearly whole
  //    (round four's code read: shown for any part of the row, it covered the Next of More big letters' second line, 57 of whose 66
  //    pixels showed, and a tap there scrolled instead of moving on). Every line of the three tracing lessons, from the top, in both
  //    themes, since those lines are the dark theme's (the light theme's show 65 of 66 pixels); and since round five's code read
  //    Very First Steps' four feelings, whose eighth line hides 22.5 of 66 pixels in the dark and 17 in the light, so a cue at half
  //    the row or at a quarter fails too. Next is asked for by its exact name, since the cue's own label holds "next". Since pass MZ
  //    (round one's code and screen checks) the cue and this check measure Next itself (data-lesson-next), since the dots under the
  //    speaker make the row 91 to 106 pixels tall, and the screen is 375 by 505, since at 375 by 667 no line's Next crosses the fold any
  //    more (EARMARKS A80); at 505 these lessons' Nexts end 19 pixels under it (a quarter to a third, no cue) and 27 (a third to a half).
  await page.setViewportSize({ width: 375, height: 505 }); await page.waitForTimeout(300);
  const lines = [];
  for (const theme of ['light', 'dark']) {
  if (theme === 'dark') { await page.evaluate(() => window.__eduTest.goTo('educator-pick')); await page.waitForTimeout(300); for (const n of ['Skip tour', 'Later', 'Got it']) await tapIf(n);
    await page.getByLabel('Dark theme').first().click({ force: true }); await page.waitForTimeout(400); await walk('Walk through early years'); }
  for (const mod of ['first-letter-tracing', 'more-big-letters', 'trace-straight-letters', 'four-feelings']) {
    await page.evaluate((m) => window.__eduTest.openModule(m), mod); await page.waitForFunction(() => window.__eduTest.screen === 'lesson'); await page.waitForTimeout(500);
    for (let step = 0; step < 12; step++) {
      await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(1000);
      const at = await page.evaluate(() => { const nav = document.querySelector('[data-lesson-nav]'); const box = document.querySelector('[data-lesson-next]'); if (!nav || !box) return null; const r = box.getBoundingClientRect(); const next = [...nav.querySelectorAll('button')].pop(); const nr = next.getBoundingClientRect();
        const low = Math.min(nr.bottom, window.innerHeight) - 2; const hit = nr.top < window.innerHeight ? document.elementFromPoint(nr.left + nr.width / 2, (nr.top + low) / 2) : null;
        return { hidden: r.bottom - window.innerHeight, height: r.height, cue: !!document.querySelector('[data-scroll-cue]'), nextHit: !!hit && next.contains(hit) }; });
      if (!at) break; lines.push({ theme, mod, step, ...at, hidden: Math.round(at.hidden * 10) / 10 });
      if (!(await page.getByRole('button', { name: 'Next', exact: true }).count())) break; await page.getByRole('button', { name: 'Next', exact: true }).first().click(); await page.waitForTimeout(300); } } }
  const wrongCue = lines.filter((l) => l.cue !== (l.hidden > l.height / 3)); const covered = lines.filter((l) => !l.cue && l.hidden > 0 && !l.nextHit);
  ok("a lesson's scroll cue shows while a third of its Next is below a short phone's fold, and never sits on a Next that is nearly whole (375 by 505)", lines.length >= 40 && wrongCue.length === 0 && covered.length === 0 && lines.some((l) => l.hidden > 4 && !l.cue) && lines.some((l) => l.hidden / l.height > 0.25 && l.hidden / l.height < 1 / 3 && !l.cue) && lines.some((l) => l.hidden / l.height > 1 / 3 && l.hidden / l.height < 0.5 && l.cue), { lines: lines.length, wrongCue, covered, partHidden: lines.filter((l) => l.hidden > 0).map((l) => `${l.theme} ${l.mod} ${l.step}: ${l.hidden} of ${l.height}${l.cue ? ' cue' : ''}`) });
  //    And a short phone's layout holds while a browser's bars slide, and is decided again on another phone (pass MZ, round two's code
  //    check). Safari's bars sliding away on a 390 by 844 iPhone make the window 664 pixels tall, then 745, while the screen stays 844
  //    tall; bigScale read the window's own height, so a question's picture grew 12 percent, and its answers, Check answer and a
  //    lesson's Next moved 13 to 17 pixels under the child's finger. DevTools' own call makes that window, since Playwright's
  //    setViewportSize moves the screen with the window. A window set from 375 by 812 to 375 by 667, as a browser's device toolbar does
  //    when another phone is chosen (the screen's height changes too), kept the taller phone's 22-pixel words until then.
  { const cdp = await page.context().newCDPSession(page);
    const bars = (h) => cdp.send('Emulation.setDeviceMetricsOverride', { width: 390, height: h, deviceScaleFactor: 1, mobile: false, screenWidth: 390, screenHeight: 844 });
    const where = () => page.evaluate(() => { const t = document.querySelector('[data-question-text]'); const pic = t && t.nextElementSibling; const check = [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Check answer');
      const top = (el) => (el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : null);
      return { picture: pic ? Math.round(pic.getBoundingClientRect().height) : null, first: top(document.querySelector('[data-choice]')), check: top(check), next: top(document.querySelector('[data-lesson-next]')) }; });
    await bars(664); await page.evaluate(() => window.__eduTest.showQuestion('p3-feel-name-face', 1)); await page.waitForFunction(() => window.__eduTest.screen === 'practice'); await page.waitForTimeout(600);
    const q664 = await where(); await bars(745); await page.waitForTimeout(600); const q745 = await where();
    await bars(664); await page.evaluate(() => window.__eduTest.openModule('colours')); await page.waitForFunction(() => window.__eduTest.screen === 'lesson'); await page.waitForTimeout(600);
    const l664 = await where(); await bars(745); await page.waitForTimeout(600); const l745 = await where();
    await cdp.send('Emulation.clearDeviceMetricsOverride'); await cdp.detach();
    ok("a short phone's question and lesson hold still while a browser's bars slide away (390 by 664, then 745, the screen 844 tall): the question's picture, its first answer, Check answer and a lesson's Next stay where they were", q664.picture > 0 && q664.first !== null && q664.check !== null && l664.next !== null && JSON.stringify(q664) === JSON.stringify(q745) && JSON.stringify(l664) === JSON.stringify(l745), { q664, q745, l664, l745 });
    const words = () => page.evaluate(() => { const p = document.querySelector('.edu-rise p'); return p ? getComputedStyle(p).fontSize : null; });
    await page.setViewportSize({ width: 375, height: 812 }); await page.evaluate(() => window.__eduTest.openModule('four-feelings')); await page.waitForFunction(() => window.__eduTest.screen === 'lesson'); await page.waitForTimeout(600);
    const tall = await words(); await page.setViewportSize({ width: 375, height: 667 }); await page.waitForTimeout(600); const short = await words();
    ok("another phone chosen in a browser's device toolbar is decided again: a lesson's words are 22 pixels at 375 by 812, then 20 at 375 by 667", tall === '22px' && short === '20px', { tall, short }); }
  await page.setViewportSize({ width: 1280, height: 900 }); await page.waitForTimeout(300); }

// i. The sounds a lesson says (pass MO, Mikey's notes on Q51: "Sun.Sss..." "Just keeps saying the letter s for what seems like 40
//    times", fff the same, mmm "like moon", tuh "like the word two"). A stand-in voice that records every line it is handed, put in
//    after the page has loaded, and the app's own sounds as they are asked for (window.__eduSounds): First sounds' first five lines
//    ask for each sound in its place and hand the voice no sss, fff, mmm or tuh and no word after "start with" where a sound goes.
{ await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => { window.__voiceBeforeSounds = window.speechSynthesis; const q = []; let cur = null; window.__spoken = []; window.__eduSounds = [];
    const next = () => { cur = q.shift() || null; if (!cur) return; const u = cur; window.__spoken.push(u.text); if (u.onstart) u.onstart({}); setTimeout(() => { if (cur === u) cur = null; if (u.onend) u.onend({}); if (!cur) next(); }, 30); };
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: { get speaking() { return !!cur; }, get pending() { return q.length > 0; }, cancel() { q.length = 0; cur = null; }, getVoices() { return []; }, speak(u) { q.push(u); if (!cur) next(); } } }); });
  await page.evaluate(() => window.__eduTest.openModule('first-sounds')); await page.waitForFunction(() => window.__eduTest.screen === 'lesson');
  const heard = [];
  for (let line = 0; line < 5; line++) {
    await page.waitForTimeout(3500);
    heard.push(await page.evaluate(() => ({ spoken: window.__spoken.slice(), sounds: (window.__eduSounds || []).slice(), keys: (window.__eduSoundKeys || []).slice() })));
    await page.evaluate(() => { window.__spoken = []; window.__eduSounds = []; window.__eduSoundKeys = []; });
    await page.getByRole('button', { name: 'Next', exact: true }).first().click({ force: true });
  }
  const want = [['m', 'm'], ['s', 's'], ['t'], ['f'], ['m']];
  const handed = heard.flatMap((h) => h.spoken).join(' | ');
  ok("First sounds' first five lines play each sound in its place and hand the voice no sss, fff, mmm, tuh or word where a sound goes (pass MO, Q51)", heard.every((h, i) => JSON.stringify(h.sounds) === JSON.stringify(want[i])) && !/\b(s{3,}|f{3,}|m{3,}|tuh)\b/i.test(handed) && !/(start with|starts with|the sound) (moon|sun|fish)/i.test(handed) && /Tap and top both start with the same sound/.test(handed), heard);
  // The one-breath hiss where a child hears it (pass NC, round one's screen check, Q88): the clip's own key (window.__eduSoundKeys, its
  // sound, pace and breath), First sounds' line 2, outside the three phoneme lessons, playing sss in its two breaths, and The very first
  // sound's line 6, inside them (ONE_BREATH_LESSONS), playing each fff once; each lesson is the other's near miss.
  await page.evaluate(() => window.__eduTest.openModule('very-first-sound')); await page.waitForFunction(() => window.__eduTest.screen === 'lesson');
  for (let k = 0; k < 5; k++) { await page.waitForTimeout(400); if (k === 4) await page.evaluate(() => { window.__spoken = []; window.__eduSounds = []; window.__eduSoundKeys = []; }); await page.getByRole('button', { name: 'Next', exact: true }).first().click({ force: true }); }
  await page.waitForTimeout(4000); const vfsKeys = await page.evaluate(() => (window.__eduSoundKeys || []).slice());
  const twoBreaths = heard[1].keys.filter((k) => /^s(-|$)/.test(k)); const oneBreath = vfsKeys.filter((k) => /^f(-|$)/.test(k));
  ok('a lone hiss plays one breath in the three phoneme lessons and two breaths outside them, read from the clip each line asks for (pass NC, Q88; First sounds\' line 2 and The very first sound\'s line 6, each the other\'s near miss)', twoBreaths.length >= 2 && twoBreaths.every((k) => !k.endsWith('-once')) && oneBreath.length >= 2 && oneBreath.every((k) => k.endsWith('-once')), { firstSounds: heard[1].keys, veryFirst: vfsKeys });
  await page.evaluate(() => Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: window.__voiceBeforeSounds })); }
// k. The rabbit and the candle are seen on the paper in both themes (pass MO, Mikey's answer to Q54, "your call as long as it looks
//    visually appealing and sleek."): the rabbit's outline and the candle's, read from the drawings on the page, are 3 to 1 or more
//    against the paper they sit on, in the light theme and the dark, where until pass MO the light theme's rabbit had none and the
//    candle's read 1.8 to 1.
{ const outline = () => page.evaluate(() => {
    const parse = (s) => { const m = String(s).match(/rgba?\(([^)]+)\)/); if (m) { const p = m[1].split(/[\s,\/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2] }; } const h = String(s).match(/^#([0-9a-f]{6})$/i); return h ? { r: parseInt(h[1].slice(0, 2), 16), g: parseInt(h[1].slice(2, 4), 16), b: parseInt(h[1].slice(4, 6), 16) } : null; };
    const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; const lum = (c) => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
    const ratio = (a, b) => (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);
    const ground = (el) => { let n = el; while (n && n.nodeType === 1) { const c = parse(getComputedStyle(n).backgroundColor); if (c && !/rgba\([^)]*,\s*0\)/.test(getComputedStyle(n).backgroundColor)) return c; n = n.parentElement; } return { r: 255, g: 255, b: 255 }; };
    const out = {};
    for (const [name, sel] of [['rabbit', 'svg[aria-label$="rabbit"] ellipse'], ['candle', 'svg rect[stroke]']]) {
      const el = [...document.querySelectorAll(sel)].find((e) => (name === 'candle' ? e.getAttribute('height') === '46' : true)); if (!el) { out[name] = null; continue; }
      const stroke = parse(el.getAttribute('stroke') || getComputedStyle(el).stroke); out[name] = stroke ? +ratio(stroke, ground(el.closest('svg'))).toFixed(2) : 0; }
    return out; });
  const seen = {};
  for (const theme of ['light', 'dark']) {
    await page.evaluate(() => window.__eduTest.goTo('educator-pick')); await page.waitForTimeout(300); for (const n of ['Skip tour', 'Later', 'Got it']) await tapIf(n);
    const now = await page.evaluate(() => document.documentElement.getAttribute('data-theme') || 'light');
    if (now !== theme) { await page.getByLabel(theme === 'dark' ? 'Dark theme' : 'Light theme').first().click({ force: true }); await page.waitForTimeout(400); }
    await walk('Walk through early years');
    await show('pm-same-animals', 1); const a = await outline();
    await show('p4-feel-calm', 2); const b = await outline();
    seen[theme] = { rabbit: a.rabbit || b.rabbit, candle: b.candle || a.candle };
  }
  ok('the rabbit\'s outline and the candle\'s read 3 to 1 or more on the paper in both themes (Q54)', ['light', 'dark'].every((t) => seen[t] && seen[t].rabbit >= 3 && seen[t].candle >= 3), seen); }

// l. Follow the directions (pass MO, earmarks E12 and E13, Domain II): on a phone, a direction's pictures sit in a grid that fits
//    the screen, two columns for four and three for three or six; each tap puts its number on the picture where it is, a tap on
//    a numbered picture takes it back with every number after it, a tap past the last step does nothing, and Check waits for every
//    step; a wrong order says the direction again, turns every tapped picture clay alike and Try again clears them; the right order
//    is Correct. The gold badge's number reads on the gold in both themes.
{ await page.evaluate(() => { window.__voiceBeforeSteps = window.speechSynthesis; const q = []; let cur = null; let timer = null; window.__spoken = [];
    const next = () => { cur = q.shift() || null; if (!cur) return; const mine = cur; timer = setTimeout(() => { if (cur !== mine) return; cur = null; if (mine.onend) mine.onend({}); if (!cur) next(); }, 20); };
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: { get speaking() { return !!cur; }, get pending() { return q.length > 0; }, cancel() { q.length = 0; if (timer) clearTimeout(timer); cur = null; }, getVoices() { return []; }, speak(u) { window.__spoken.push(u.text); q.push(u); if (!cur) next(); } } }); });
  const badges = () => page.evaluate(() => [...document.querySelectorAll('[data-steps] button')].map((b) => ({ c: b.getAttribute('data-choice'), n: b.getAttribute('data-step'), badge: (b.querySelector('[data-step-badge]') || {}).textContent || null })));
  const checkOff = () => page.getByRole('button', { name: 'Check answer', exact: true }).isDisabled();
  const grid = () => page.evaluate(() => { const g = document.querySelector('[data-steps]'); if (!g) return null; const bs = [...g.querySelectorAll('button')].map((b) => b.getBoundingClientRect()); return { tracks: getComputedStyle(g).gridTemplateColumns.split(' ').filter(Boolean).length, cols: new Set(bs.map((r) => Math.round(r.left))).size, n: bs.length, right: Math.max(...bs.map((r) => r.right)), wide: document.documentElement.scrollWidth, view: innerWidth }; });
  const seen = {};
  for (const theme of ['light', 'dark']) {
    await page.evaluate(() => window.__eduTest.goTo('educator-pick')); await page.waitForTimeout(300); for (const n of ['Skip tour', 'Later', 'Got it']) await tapIf(n);
    const now = await page.evaluate(() => document.documentElement.getAttribute('data-theme') || 'light');
    if (now !== theme) { await page.getByLabel(theme === 'dark' ? 'Dark theme' : 'Light theme').first().click({ force: true }); await page.waitForTimeout(400); }
    await walk('Walk through early years');
    for (const w of [390, 360, 320]) {
      await page.setViewportSize({ width: w, height: 844 }); await page.waitForTimeout(200);
      for (const [gen, seed, cols] of [['p3-steps-things', 3, 2], ['p3-steps-colors', 2, 3], ['p4-steps-things', 3, 3]]) { await show(gen, seed); seen[`${theme} ${w} ${gen}`] = { ...(await grid()), want: cols }; }
    }
    await page.setViewportSize({ width: 390, height: 844 }); await page.waitForTimeout(200);
    const q = await show('p3-steps-things', 3); const steps = q.answer.split(' | '); const others = q.items.filter((x) => !steps.includes(x));
    const tap = (c) => page.locator(`[data-steps] button[data-choice="${c}"]`).click();
    const r = { theme };
    r.start = { off: await checkOff(), b: (await badges()).filter((x) => x.badge).length };
    await tap(steps[0]); r.one = { off: await checkOff(), b: await badges() };
    // A take-back of the second number keeps the first (round one's code check: a take-back that cleared every number passed).
    await tap(others[0]); await tap(others[0]); r.retake2 = { off: await checkOff(), b: await badges() };
    await tap(others[0]); await tap(others[1]); r.full = { off: await checkOff(), b: await badges() };
    await tap(steps[0]); r.back = { off: await checkOff(), b: (await badges()).filter((x) => x.badge).length };
    // The badge's number on its gold, measured while a badge shows.
    await tap(steps[1]);
    r.contrast = await page.evaluate(() => { const el = document.querySelector('[data-step-badge]'); if (!el) return 0; const parse = (s) => String(s).match(/\d+(\.\d+)?/g).slice(0, 3).map(Number); const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b); const cs = getComputedStyle(el); const a = lum(parse(cs.color)); const b = lum(parse(cs.backgroundColor)); return +((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toFixed(2); });
    await tap(steps[0]);
    r.placed = await page.evaluate(() => [...document.querySelectorAll('[data-steps] button[data-step]')].map((b) => getComputedStyle(b).borderTopColor));
    await page.evaluate(() => { window.__spoken = []; });
    await page.getByRole('button', { name: 'Check answer', exact: true }).click(); await page.waitForTimeout(600);
    r.wrong = await page.evaluate(() => ({ text: (document.querySelector('.edu-wobble') || {}).textContent || '', tiles: [...document.querySelectorAll('[data-steps] button[data-step]')].map((b) => getComputedStyle(b).borderTopColor), said: window.__spoken.join(' ') }));
    await tapIf('Try again'); await page.waitForTimeout(300);
    r.again = { off: await checkOff(), b: (await badges()).filter((x) => x.badge).length };
    for (const s of steps) await tap(s);
    await page.getByRole('button', { name: 'Check answer', exact: true }).click(); await page.waitForTimeout(600);
    r.right = await page.evaluate(() => (document.querySelector('.edu-cheer') || {}).textContent || '');
    // Check waits for all three steps of a three-step direction (pinned at pick 3, round one's code check).
    const q3 = await show('p4-steps-things', 3); const s3 = q3.answer.split(' | ');
    await tap(s3[0]); await tap(s3[1]); r.three = { two: await checkOff() }; await tap(s3[2]); r.three.all = await checkOff();
    seen[theme] = { r, q: { answer: q.answer, prompt: q.prompt } };
  }
  const sizes = Object.entries(seen).filter(([k]) => / \d+ /.test(k));
  ok('a direction\'s pictures fit a phone: two columns for four, three for three or six, and the page never scrolls sideways (390, 360 and 320 pixels, the grid\'s own tracks as well as its tiles)', sizes.length === 18 && sizes.every(([, g]) => g && g.cols === g.want && g.tracks === g.want && g.right <= g.view && g.wide <= g.view), sizes);
  for (const theme of ['light', 'dark']) { const { r, q } = seen[theme]; const s = q.answer.split(' | ');
    ok(`${theme}: Check waits for every step, and a tap puts its number on the picture where it is`, r.start.off && r.start.b === 0 && r.one.off && r.one.b.find((x) => x.c === s[0]).badge === '1' && r.one.b.filter((x) => x.badge).length === 1, r);
    ok(`${theme}: taking back the second number keeps the first, and Check waits for all three steps of a three-step direction`, r.retake2.off && r.retake2.b.filter((x) => x.badge).length === 1 && r.retake2.b.find((x) => x.c === s[0]).badge === '1' && r.three.two && !r.three.all, { retake2: r.retake2, three: r.three });
    ok(`${theme}: once every step is tapped Check opens, a tap past the last step does nothing, and a numbered picture tapped again takes back its number and every one after it`, !r.full.off && r.full.b.filter((x) => x.badge).length === 2 && r.back.b === 0 && r.back.off, r);
    ok(`${theme}: a wrong order says the direction again and turns every tapped picture clay alike, and Try again clears them`, r.wrong.text.includes(`Let's listen again. ${q.prompt}`) && r.wrong.said.includes(`Let's listen again. ${q.prompt}`) && r.wrong.tiles.length === 2 && new Set(r.wrong.tiles).size === 1 && r.placed.length === 2 && r.placed.every((c) => c !== r.wrong.tiles[0]) && r.again.off && r.again.b === 0, r.wrong);
    ok(`${theme}: the steps in order are Correct, and the badge's number reads 4.5 to 1 on its gold`, /^Correct/.test(r.right) && r.contrast >= 4.5, { right: r.right, contrast: r.contrast }); }
  // More Info's paper boxes in the dark theme (round two's code check: a shape there was drawn in the dark theme's mint, 1.6 to 1 on
  // the paper; round three's code check: no check read them): every drawn shape 3 to 1 or more on its box (shape and solid tokens;
  // a named color's own shape, Two ideas' looks kind, is Q56's).
  { const mode = await page.evaluate(() => document.documentElement.getAttribute('data-theme') || 'light');
    const qm = await show('p3-ideas-sizes', 1); await page.locator(`button[data-choice="${qm.answer}"]`).click(); await page.getByRole('button', { name: 'Check answer', exact: true }).click(); await page.waitForTimeout(600);
    await page.locator('[data-more-info-link]').first().click(); await page.waitForTimeout(500);
    const boxes = await page.evaluate(() => { const parse = (s) => (String(s).match(/\d+(\.\d+)?/g) || []).slice(0, 3).map(Number); const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b); const cr = (a, b) => { const x = lum(a); const y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
      const out = []; for (const box of document.querySelectorAll('[data-more-info-wrong] > div:first-child, [data-more-info-right] > div:first-child')) { const bg = parse(getComputedStyle(box).backgroundColor); let worst = 99; let read = 0;
        for (const el of box.querySelectorAll('svg path, svg circle, svg rect, svg polygon, svg ellipse')) { const f = getComputedStyle(el).fill; if (!f || !/^rgb/.test(f)) continue; read += 1; worst = Math.min(worst, cr(parse(f), bg)); }
        out.push({ read, worst: +worst.toFixed(2) }); }
      return out; });
    await tapIf('Got it'); await page.waitForTimeout(300);
    ok('More Info\'s paper boxes draw each shape 3 to 1 or more on the dark theme\'s paper', mode === 'dark' && boxes.length >= 3 && boxes.every((x) => x.read >= 1 && x.worst >= 3), { mode, boxes }); }
  // Round three's alignment read (pass MO): after two wrong orders the next step's picture wears the app's "go here" ring until it is
  // tapped, then the next one does, so a child who cannot hold three steps is never left stuck; before then no picture wears one
  // (until pass MP a wrong tap took the ring away until it was taken back; Q58, below).
  // Since round four's code check the ring is read where it shows, its computed ring and edge against a plain tile's (a mutant with
  // the ring and the green edge removed passed, its attribute, class and name kept), in both themes.
  for (const theme of ['light', 'dark']) {
    await page.evaluate(() => window.__eduTest.goTo('educator-pick')); await page.waitForTimeout(300); for (const n of ['Skip tour', 'Later', 'Got it']) await tapIf(n);
    const now = await page.evaluate(() => document.documentElement.getAttribute('data-theme') || 'light');
    if (now !== theme) { await page.getByLabel(theme === 'dark' ? 'Dark theme' : 'Light theme').first().click({ force: true }); await page.waitForTimeout(400); }
    await walk('Walk through early years');
    const qh = await show('p4-steps-things', 3); const st = qh.answer.split(' | '); const wrongOrder = [st[1], st[0], st[2]];
    const plainEdge = await page.evaluate(() => getComputedStyle(document.querySelector('[data-steps] button[data-choice]')).borderTopColor);
    const ringed = () => page.evaluate(() => [...document.querySelectorAll('[data-steps] button[data-hint]')].map((b) => { const cs = getComputedStyle(b); return { c: b.getAttribute('data-choice'), cls: b.className || '', label: b.getAttribute('aria-label') || '', shadow: cs.boxShadow, edge: cs.borderTopColor }; }));
    // Since round five's code check the ring is read by its color's strength and its spread, since a resting ring (alpha 0, 0 px),
    // the app's own, passed as shown.
    const ring = (s) => { const m = /rgba?\(\s*\d+,\s*\d+,\s*\d+(?:,\s*([\d.]+))?\)\s+0px\s+0px\s+0px\s+([\d.]+)px/.exec(s || ''); return !!m && (m[1] === undefined || Number(m[1]) >= 0.3) && Number(m[2]) >= 2; };
    const shows = (x) => ring(x.shadow) && x.edge !== plainEdge;
    const tapH = (c) => page.locator(`[data-steps] button[data-choice="${c}"]`).click();
    const h = { start: await ringed(), steps: [] };
    for (let k = 1; k <= 2; k++) { for (const c of wrongOrder) await tapH(c); await page.getByRole('button', { name: 'Check answer', exact: true }).click(); await page.waitForTimeout(500); h[`checked${k}`] = await ringed(); await tapIf('Try again'); await page.waitForTimeout(300); h[`again${k}`] = await ringed(); }
    // Since pass MP (Mikey's answer to Q58, "Q58 - A") a tap on another picture while the ring shows takes no number and gives it a
    // little wobble with a clay edge, and the ring stays where it is (until then the tap took the next number and the ring went away).
    await tapH(st[2]); h.offTrack = await ringed();
    h.offTap = await page.evaluate((c) => { const b = document.querySelector(`[data-steps] button[data-choice="${c}"]`); return { step: b.getAttribute('data-step'), nudged: b.hasAttribute('data-nudged'), cls: b.className || '', edge: getComputedStyle(b).borderTopColor }; }, st[2]);
    await page.waitForTimeout(700); h.settled = await page.evaluate((c) => document.querySelector(`[data-steps] button[data-choice="${c}"]`).hasAttribute('data-nudged'), st[2]);
    for (const c of st) { h.steps.push(await ringed()); await tapH(c); }
    h.done = await ringed();
    await page.getByRole('button', { name: 'Check answer', exact: true }).click(); await page.waitForTimeout(600);
    h.right = await page.evaluate(() => (document.querySelector('.edu-cheer') || {}).textContent || '');
    ok(`${theme}: after two wrong orders the next step's picture wears the "go here" ring, seen where it shows, until it is tapped, each step in turn, and none before then; a tap on another picture takes no number, wobbles, and leaves the ring (Q58)`, h.start.length === 0 && h.checked1.length === 0 && h.again1.length === 0 && h.checked2.length === 0 && h.again2.length === 1 && h.again2[0].c === st[0] && shows(h.again2[0]) && h.offTrack.length === 1 && h.offTrack[0].c === st[0] && shows(h.offTrack[0]) && h.offTap.step === null && h.offTap.nudged && /\bedu-wobble\b/.test(h.offTap.cls) && h.offTap.edge !== plainEdge && !h.settled
      && h.steps.length === 3 && h.steps.every((x, i) => x.length === 1 && x[0].c === st[i] && /\bedu-breathe\b/.test(x[0].cls) && /the next one to tap$/.test(x[0].label) && shows(x[0])) && h.done.length === 0 && /^Correct/.test(h.right), { theme, plainEdge, h });
    // Q56 (Mikey's answer, pass MP, "Q56 - A"): the yellow square on a question's tile wears its darker edge, in both themes, and its
    // fill is still the yellow the color lessons name.
    await show('p3-tap-yellow-green', 1);
    const yEdge = await page.evaluate(() => { const r = [...document.querySelectorAll('button[data-choice*="yellow"] svg path, button[data-choice*="yellow"] svg rect')].find((el) => (el.getAttribute('fill') || '').toUpperCase() === '#F0C93A'); return r ? { stroke: r.getAttribute('stroke'), width: Number(r.getAttribute('stroke-width')), fill: r.getAttribute('fill') } : null; });
    ok(`${theme}: Q56's yellow square wears its darker edge on a question's tile, its yellow unchanged`, !!yEdge && yEdge.stroke === '#9C7A14' && yEdge.width >= 3 && yEdge.fill === '#F0C93A', yEdge); }
  // Round one's screen check (pass MO): the badge sits on its picture's corner, clear of the drawing it numbers, at 320 and 390
  // pixels; the scroll cue waits until every step is tapped, since after one tap it pointed at a Check answer still closed (320 by
  // 568); a laptop keeps a direction's pictures together at a phone's size (Mikey's pass MH words: "small and separated by a lot of
  // space"); and a screen reader hears each picture by its own name, a tapped one with its number.
  const ink = () => page.evaluate(() => { const hits = []; let worst = 0;
    for (const b of document.querySelectorAll('[data-steps] button[data-step]')) { const badge = b.querySelector('[data-step-badge]'); if (!badge) { hits.push(`${b.getAttribute('data-choice')}: no badge`); continue; }
      const r = badge.getBoundingClientRect(); const cx = r.left + r.width / 2; const cy = r.top + r.height / 2; const rad = r.width / 2;
      for (const el of b.querySelectorAll('svg path, svg circle, svg ellipse, svg rect, svg polygon, svg polyline, svg line, img')) { if (badge.contains(el)) continue; const e = el.getBoundingClientRect(); if (e.width < 1 && e.height < 1) continue;
        const d = Math.hypot(Math.max(e.left - cx, 0, cx - e.right), Math.max(e.top - cy, 0, cy - e.bottom)); if (d < rad - 0.5) { worst = Math.max(worst, rad - d); hits.push(`${b.getAttribute('data-choice')} ${el.tagName}`); } } }
    return { worst: +worst.toFixed(1), hits: [...new Set(hits)] }; });
  const tapSteps = async (qq, n = 9) => { for (const s of qq.answer.split(' | ').slice(0, n)) await page.locator(`[data-steps] button[data-choice="${s}"]`).click(); };
  const cleared = {};
  for (const w of [320, 390]) { await page.setViewportSize({ width: w, height: 844 }); await page.waitForTimeout(200);
    for (const [gen, seed] of [['p4-steps-things', 3], ['p4-steps-faces', 2], ['p3-steps-colors', 2], ['p4-steps-sounds', 1], ['p4-steps-shapes', 1], ['p3-steps-sizes', 1]]) { await tapSteps(await show(gen, seed)); cleared[`${w} ${gen}`] = await ink(); } }
  ok('a direction\'s gold badge sits on its picture\'s corner, clear of the drawing it numbers (320 and 390 pixels)', Object.keys(cleared).length === 12 && Object.values(cleared).every((x) => x.hits.length === 0), cleared);
  // The lesson lines that teach the numbers, read against the drawing's own ink: every point of the badge's disc tested against each
  // shape's fill and stroke (round two's code check: no check read the lesson badges, and at a tile's padding of 4 a badge reached
  // the book's corner on a 320-pixel phone).
  const inkUnder = () => page.evaluate(() => { const out = [];
    for (const badge of document.querySelectorAll('[data-step-badge]')) { const tile = badge.parentElement; const r = badge.getBoundingClientRect(); const cx = r.left + r.width / 2; const cy = r.top + r.height / 2; const rad = r.width / 2 - 0.5; let hits = 0;
      for (const el of tile.querySelectorAll('svg path, svg circle, svg ellipse, svg rect, svg polygon, svg polyline, svg line')) { if (badge.contains(el)) continue; const cs = getComputedStyle(el); if (cs.display === 'none' || Number(cs.opacity) === 0) continue; const m = el.getScreenCTM(); if (!m) continue; const inv = m.inverse(); const fill = cs.fill !== 'none'; const stroke = cs.stroke !== 'none' && parseFloat(cs.strokeWidth) > 0;
        for (let y = Math.floor(cy - rad); y <= cy + rad; y += 1) for (let x = Math.floor(cx - rad); x <= cx + rad; x += 1) { if (Math.hypot(x - cx, y - cy) > rad) continue; const p = new DOMPoint(x, y).matrixTransform(inv); if ((fill && el.isPointInFill(p)) || (stroke && el.isPointInStroke(p))) hits += 1; } }
      out.push({ n: badge.textContent, hits }); }
    return out; });
  const lessonAt = async (mod, step) => { await page.evaluate((m) => window.__eduTest.openModule(m), mod); await page.waitForFunction(() => window.__eduTest.screen === 'lesson'); await page.waitForTimeout(400);
    for (let i = 0; i < step; i++) { await page.getByRole('button', { name: 'Next', exact: true }).first().click(); await page.waitForTimeout(150); }
    await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(600); };
  const lessonBadges = {};
  for (const w of [320, 390]) { await page.setViewportSize({ width: w, height: 844 }); await page.waitForTimeout(200);
    for (const [mod, n] of [['two-steps', 2], ['three-steps', 3]]) { await lessonAt(mod, 6); lessonBadges[`${w} ${mod}`] = { want: n, badges: await inkUnder() }; } }
  ok('a lesson line on the numbers shows its gold numbers clear of the drawings\' ink (320 and 390 pixels)', Object.keys(lessonBadges).length === 4 && Object.values(lessonBadges).every((x) => x.badges.length === x.want && x.badges.every((b) => b.hits === 0)), lessonBadges);
  await page.setViewportSize({ width: 320, height: 568 }); await page.waitForTimeout(250);
  const cueSeen = {};
  // Read after every tap short of the whole (round two's code check: read after one tap and after all, a cue at two of three passed).
  for (const [gen, seed] of [['p4-steps-faces', 2], ['p4-steps-sounds', 1]]) { const qq = await show(gen, seed); await page.evaluate(() => window.scrollTo(0, 0)); const st = qq.answer.split(' | '); const early = [];
    for (const s of st.slice(0, -1)) { await page.locator(`[data-steps] button[data-choice="${s}"]`).click(); await page.waitForTimeout(1300); early.push(await page.evaluate(() => !!document.querySelector('[data-scroll-cue]'))); }
    await page.locator(`[data-steps] button[data-choice="${st[st.length - 1]}"]`).click(); await page.waitForTimeout(1300);
    cueSeen[gen] = { early, ...(await page.evaluate(() => { const row = document.querySelector('[data-practice-next]'); return { cue: !!document.querySelector('[data-scroll-cue]'), below: !!row && row.getBoundingClientRect().bottom > window.innerHeight + 4 }; })) }; }
  ok('the scroll cue waits until every step is tapped, read after each tap, then shows while Check answer is below a short phone\'s fold (320 by 568)', Object.values(cueSeen).every((x) => x.early.length >= 2 && x.early.every((c) => !c) && x.cue === x.below) && Object.values(cueSeen).some((x) => x.below), cueSeen);
  // Two ideas' four corners sit two by two, a phone's width, and every corner and Check answer fit a short phone (round two's code
  // check: four full-width rows ended 30 pixels below a 375 by 667 phone's fold).
  await page.setViewportSize({ width: 375, height: 667 }); await page.waitForTimeout(250);
  const corners = {};
  for (const [gen, seed] of [['p3-ideas-looks', 1], ['p3-ideas-looks', 2], ['p3-ideas-sizes', 1], ['p3-ideas-sizes', 3]]) { await show(gen, seed); await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(300);
    corners[`${gen}#${seed}`] = await page.evaluate(() => { const bs = [...document.querySelectorAll('button[data-choice]')]; const g = bs[0] && bs[0].parentElement; const check = [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Check answer');
      return { n: bs.length, tracks: g ? getComputedStyle(g).gridTemplateColumns.split(' ').length : 0, lowest: Math.max(...bs.map((b) => b.getBoundingClientRect().bottom)), check: check ? check.getBoundingClientRect().bottom : 9999, vh: window.innerHeight }; }); }
  ok('Two ideas\' four corners sit two by two, and every corner and Check answer fit a short phone (375 by 667)', Object.values(corners).every((x) => x.n === 4 && x.tracks === 2 && x.lowest <= x.vh && x.check <= x.vh), corners);
  await page.setViewportSize({ width: 1280, height: 900 }); await page.waitForTimeout(250);
  const cap = {};
  for (const [gen, seed, most] of [['p4-steps-things', 3, 480], ['p3-steps-things', 3, 360]]) { await show(gen, seed); cap[gen] = { most, ...(await page.evaluate(() => { const g = document.querySelector('[data-steps]'); const r = g.getBoundingClientRect(); const p = g.parentElement.getBoundingClientRect(); const w = g.closest('.edu-wrap'); const z = (w && parseFloat(getComputedStyle(w).zoom)) || 1; return { zoom: z, width: Math.round(r.width / z), left: Math.round(r.left - p.left), right: Math.round(p.right - r.right) }; })) }; }
  for (const [gen, seed] of [['p3-ideas-looks', 1], ['p3-ideas-sizes', 1]]) { await show(gen, seed); cap[gen] = { most: 360, ...(await page.evaluate(() => { const g = document.querySelector('button[data-choice]').parentElement; const r = g.getBoundingClientRect(); const p = g.parentElement.getBoundingClientRect(); const w = g.closest('.edu-wrap'); const z = (w && parseFloat(getComputedStyle(w).zoom)) || 1; return { zoom: z, width: Math.round(r.width / z), left: Math.round(r.left - p.left), right: Math.round(p.right - r.right) }; })) }; }
  ok('on a laptop a direction\'s pictures and Two ideas\' four corners keep a phone\'s size, together and centred (1280 pixels, in the page\'s own zoomed units)', Object.keys(cap).length === 4 && Object.values(cap).every((x) => x.width <= x.most && Math.abs(x.left - x.right) <= 2), cap);
  await page.setViewportSize({ width: 390, height: 844 }); await page.waitForTimeout(200);
  const names = {};
  for (const [gen, seed] of [['p3-steps-colors', 2], ['p3-steps-sizes', 1], ['p4-steps-things', 3]]) { await tapSteps(await show(gen, seed), 1); names[gen] = await page.evaluate(() => [...document.querySelectorAll('[data-steps] button')].map((b) => b.getAttribute('aria-label') || '')); }
  for (const [gen, seed] of [['p3-ideas-looks', 1], ['p3-ideas-sizes', 1]]) { await show(gen, seed); names[gen] = await page.evaluate(() => [...document.querySelectorAll('button[data-choice]')].map((b) => b.getAttribute('aria-label') || '')); }
  ok('a screen reader hears each picture by its own name, and a tapped one with its number', Object.keys(names).length === 5 && Object.entries(names).every(([g, ls]) => ls.length >= 3 && ls.every(Boolean) && new Set(ls).size === ls.length && (!/steps/.test(g) || ls.filter((l) => /, number 1$/.test(l)).length === 1)), names);
  await page.evaluate(() => Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: window.__voiceBeforeSteps }));
  await page.setViewportSize({ width: 1280, height: 900 }); await page.waitForTimeout(300); }

// Round six's code check (pass MO): a lesson pair's two drawings stay apart in the dark theme at 320 pixels with motion on. Each half
// draws at 85 percent, but its drift (an entrance animation that holds its last frame) took that size, and nine pairs touched or
// overlapped by up to 1.8 pixels; the dark theme keeps the size on a wrapper the drift never reaches. Every pre-K lesson line that
// shows a big and a small shape side by side is measured by its drawings' ink once the drift has settled.
{ await page.evaluate(() => window.__eduTest.goTo('educator-pick')); await page.waitForTimeout(300); for (const n of ['Skip tour', 'Later', 'Got it']) await tapIf(n);
  if ((await page.evaluate(() => document.documentElement.getAttribute('data-theme') || 'light')) !== 'dark') { await page.getByLabel('Dark theme').first().click({ force: true }); await page.waitForTimeout(400); }
  await walk('Walk through early years');
  await page.setViewportSize({ width: 320, height: 844 }); await page.emulateMedia({ reducedMotion: 'no-preference' }); await page.waitForTimeout(300);
  const gapNow = () => page.evaluate(() => { const ink = (el) => { let box = null; for (const s of el.querySelectorAll('svg path, svg circle, svg rect, svg polygon, svg ellipse, svg polyline, svg line')) { const r = s.getBoundingClientRect(); if (!r.width && !r.height) continue; box = box ? { left: Math.min(box.left, r.left), right: Math.max(box.right, r.right) } : { left: r.left, right: r.right }; } return box; };
    const pairs = [...document.querySelectorAll('[data-pair]')].filter((p) => p.children.length === 2 && [...p.children].every((c) => c.querySelector('svg')));
    const gaps = [...pairs].map((p) => { const a = ink(p.children[0]); const b = ink(p.children[1]); return a && b ? Math.round((b.left - a.right) * 10) / 10 : null; }).filter((g) => g !== null);
    return gaps.length ? Math.min(...gaps) : null; });
  const LINES = { 'big-and-small': [0, 1, 2, 3], 'bigger-and-smaller': [0, 1, 2, 3], 'triangles-too': [5], 'big-and-little': [2], 'circle-and-square': [5], 'not-the-same': [4], 'same-and-different': [2], 'two-steps-more': [4], 'two-ideas': [6, 7, 8] };   // Two steps' line 12 is Two steps every day's line 4 since pass MR's split (Q70)
  const pairGaps = {};
  const stranded = Object.entries(LINES).flatMap(([m, s]) => s.filter((i) => !sizedPairs(m).includes(i)).map((i) => `${m} ${i}`));
  ok('every lesson line the pair checks walk still shows a big and a small shape (a split lesson cannot strand one)', stranded.length === 0, stranded);
  for (const [mod, steps] of Object.entries(LINES).map(([m, s]) => [m, s.filter((i) => sizedPairs(m).includes(i))]).filter(([, s]) => s.length)) {
    await page.evaluate((m) => window.__eduTest.openModule(m), mod); await page.waitForFunction(() => window.__eduTest.screen === 'lesson').catch(() => {}); await page.waitForTimeout(400);
    for (let i = 0; i <= Math.max(...steps); i++) { if (steps.includes(i)) { await page.waitForTimeout(1600); pairGaps[`${mod} ${i}`] = await gapNow(); } if (i < Math.max(...steps)) { await page.getByRole('button', { name: 'Next', exact: true }).first().click({ force: true }); await page.waitForTimeout(150); } } }
  await page.emulateMedia({ reducedMotion: 'reduce' }); await page.setViewportSize({ width: 1280, height: 900 }); await page.waitForTimeout(300);
  ok("in the dark theme at 320 pixels with motion on, every lesson pair of a big and a small shape keeps its drawings 6 pixels apart or more", Object.keys(pairGaps).length === 17 && Object.values(pairGaps).every((g) => g !== null && g >= 6), pairGaps);
  // Since Mikey's answer to Q59 (pass MO: "Q59 your recommendation is good") the light theme keeps the pair's 85 percent with motion
  // on too, so each drawing of a pair is the same width with motion on as with motion off (it had drawn about 18 percent wider).
  await page.evaluate(() => window.__eduTest.goTo('educator-pick')); await page.waitForTimeout(300); for (const n of ['Skip tour', 'Later', 'Got it']) await tapIf(n);
  if ((await page.evaluate(() => document.documentElement.getAttribute('data-theme') || 'light')) !== 'light') { await page.getByLabel('Light theme').first().click({ force: true }); await page.waitForTimeout(400); }
  await walk('Walk through early years'); await page.setViewportSize({ width: 390, height: 844 }); await page.waitForTimeout(300);
  const widthsNow = () => page.evaluate(() => [...document.querySelectorAll('[data-pair]')].filter((p) => p.children.length === 2).flatMap((p) => [...p.children].map((c) => { let l = Infinity; let r = -Infinity; for (const s of c.querySelectorAll('svg path, svg circle, svg rect, svg polygon, svg ellipse, svg polyline, svg line')) { const b = s.getBoundingClientRect(); if (!b.width && !b.height) continue; l = Math.min(l, b.left); r = Math.max(r, b.right); } return r > l ? Math.round((r - l) * 10) / 10 : null; })));
  const SAME = [['big-and-small', 0], ['two-steps-more', 4], ['two-ideas', 8]].filter(([m, i]) => sizedPairs(m).includes(i)); const sized = {};
  for (const motion of ['reduce', 'no-preference']) { await page.emulateMedia({ reducedMotion: motion }); await page.waitForTimeout(300);
    for (const [mod, step] of SAME) { await page.evaluate((m) => window.__eduTest.openModule(m), mod); await page.waitForFunction(() => window.__eduTest.screen === 'lesson').catch(() => {}); await page.waitForTimeout(400);
      for (let i = 0; i < step; i++) { await page.getByRole('button', { name: 'Next', exact: true }).first().click({ force: true }); await page.waitForTimeout(150); }
      await page.waitForTimeout(1600); sized[`${mod} ${step} ${motion}`] = await widthsNow(); } }
  await page.emulateMedia({ reducedMotion: 'reduce' }); await page.setViewportSize({ width: 1280, height: 900 }); await page.waitForTimeout(300);
  const same = SAME.map(([mod, step]) => { const off = sized[`${mod} ${step} reduce`] || []; const on = sized[`${mod} ${step} no-preference`] || []; return off.length === 2 && on.length === 2 && off.every((w, k) => !!w && !!on[k] && Math.abs(on[k] / w - 1) <= 0.02); });
  ok("in the light theme each drawing of a lesson pair is the same size with motion on as with motion off (Q59)", same.length === 3 && same.every(Boolean), sized); }

// A lesson's Say it again (pass MQ, round two's code read: since round one it reads the line again through the lesson's own reading, lit
// sentence by sentence and from its recording when there is one, and no test pressed it): a pre-reader's first line is read to its
// end, Say it again is pressed, and the first sentence is lit while the stand-in voice says it again (the old speak(line) lit nothing).
{ await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => { const q = []; let cur = null; let timer = null; window.__again = [];
    const next = () => { cur = q.shift() || null; if (!cur) return; const mine = cur; window.__again.push(mine.text); if (mine.onstart) mine.onstart({}); timer = setTimeout(() => { if (cur !== mine) return; cur = null; if (mine.onend) mine.onend({}); if (!cur) next(); }, 700); };
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: { get speaking() { return !!cur; }, get pending() { return q.length > 0; }, cancel() { q.length = 0; if (timer) clearTimeout(timer); cur = null; }, getVoices() { return []; }, speak(u) { q.push(u); if (!cur) next(); } } }); });
  await page.evaluate(() => window.__eduTest.openModule('learning-words')); await page.waitForFunction(() => window.__eduTest.screen === 'lesson');
  const first = L.readAloudScript(L.MODULES.find((m) => m.id === 'learning-words'))[0].say; const firstSentence = L.SENTENCE_BREAK ? String(first).split(L.SENTENCE_BREAK).filter(Boolean)[0] : first;
  const readOnce = await page.waitForFunction((s) => window.__again.some((t) => t.trim() === s.trim()) && !window.speechSynthesis.speaking && !window.speechSynthesis.pending && !document.querySelector('[data-read-lit]'), firstSentence, { timeout: 20000 }).then(() => true).catch(() => false);
  await page.waitForTimeout(600); await page.evaluate(() => { window.__again = []; });
  await page.getByRole('button', { name: 'Say it again' }).first().click({ force: true });
  const litAgain = await page.waitForFunction((s) => { const el = document.querySelector('[data-read-lit]'); return !!el && el.textContent.trim() === s.trim() && window.__again.some((t) => t.trim() === s.trim()); }, firstSentence, { timeout: 6000 }).then(() => true).catch(() => false);
  const seen = await page.evaluate(() => ({ said: window.__again.slice(0, 3), lit: (document.querySelector('[data-read-lit]') || {}).textContent || null }));
  ok("a lesson's Say it again reads the line again lit sentence by sentence, the first sentence lit as it is said (pass MQ, round two's code read)", readOnce && litAgain, { readOnce, litAgain, firstSentence, seen });
  await page.evaluate(() => window.speechSynthesis.cancel()); }

// The say-along (pass MS, Mikey's note on his answer to Q67: all the silly voices go to one word, the last one clear, and "it would be
// nice to see just the letters that are being pronounced be highlighted during this part so they can follow along easier"). A stand-in
// voice that takes about as long as a phone's voice (by letters and rate) and records each utterance's words, rate, pitch, volume and
// times; the strip's light is recorded as it changes. On Learning words' "different" line: the paragraph shows the line's own words
// and the strip the word; the voice says every sentence of the line in order, each form in its silly voice's own rate and pitch, none
// slowed by the young voice, and the calls in the young voice; the child's turn follows each form (sayAlongEcho); the light visits each
// syllable of a saying in order, the dot of each saying of four filled in turn. On its "match" line the chant plays the app's clap
// between its cheers. With no voice on the device the strip lists the calls for a grown-up to lead. Since pass MT the line is Mikey's
// own game (his answer to Q77): "Let's say it together!" said excited (sayOpen), five ways in his words, "Great job!" as a cheer and the
// clear one; each saying of the four silly voices in its own rate and pitch with a brief pause between, whispered twice with its pause,
// super fast one breath whose three sayings light in turn; and the match line's cheer plays a fan's whistle between its sayings and the
// crowd after the last. Since round one's screen check the
// voice takes 400 ms to begin each utterance, as a network voice can, and the light must wait for it (no syllable past a saying's
// first before the voice begins it); every saying of four times low and three times fast is lit through, the calls with no voice
// are one to a line, and at 320 pixels the strip's height and Next's place hold through the whole game.
{ await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => { window.__voiceBeforeSayAlong = window.speechSynthesis; });
  const install = () => page.evaluate(() => { const q = []; let cur = null; let timer = null; window.__sa = []; window.__eduSounds = []; window.__lits = []; const LATENCY = 400;
    // A silly way (a shape of its own, so not the young voice's plain 0.774 and 1.15) is timed as a phone says a word, about 62 ms a
    // letter at a rate of 1, near logic's guess (SAY_ALONG_SYLLABLE_MS); the other words go quicker, 20 ms a letter, to save time.
    const next = () => { cur = q.shift() || null; if (!cur) return; const mine = cur; const silly = !(Math.abs((mine.rate || 0) - 0.774) < 0.001 && Math.abs((mine.pitch || 0) - 1.15) < 0.001); const ms = Math.round((mine.text.length * (silly ? 62 : 20)) / (mine.rate || 1)) + 60; const rec = { text: mine.text, rate: mine.rate, pitch: mine.pitch, volume: mine.volume, at: Date.now(), ms }; window.__sa.push(rec);
      timer = setTimeout(() => { if (cur !== mine) return; rec.began = Date.now(); if (mine.onstart) mine.onstart({});
        timer = setTimeout(() => { if (cur !== mine) return; cur = null; rec.end = Date.now(); if (mine.onend) mine.onend({}); if (!cur) next(); }, ms); }, LATENCY); };
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: { get speaking() { return !!cur; }, get pending() { return q.length > 0; }, cancel() { q.length = 0; if (timer) clearTimeout(timer); cur = null; }, getVoices() { return []; }, speak(u) { q.push(u); if (!cur) next(); } } });
    const read = () => { const s = document.querySelector('[data-say-along]'); if (!s) return; const d = s.querySelector('[data-say-along-dots]'); const nx = document.querySelector('button[aria-label="Next"]'); const v = { t: Date.now(), word: s.getAttribute('data-say-along'), call: s.getAttribute('data-say-along-call'), lit: s.getAttribute('data-say-along-lit'), rep: s.getAttribute('data-say-along-rep'), dots: d ? d.getAttribute('data-say-along-dots') : null, h: Math.round(s.getBoundingClientRect().height), next: nx ? Math.round(nx.parentElement.getBoundingClientRect().top + window.scrollY) : null };
      const last = window.__lits[window.__lits.length - 1]; if (!last || ['word', 'call', 'lit', 'rep', 'dots'].some((f) => last[f] !== v[f])) window.__lits.push(v); };
    if (window.__saWatch) window.__saWatch.disconnect(); window.__saWatch = new MutationObserver(read); window.__saWatch.observe(document.body, { attributes: true, childList: true, subtree: true }); });
  // From the overview, so the wait for the lesson screen waits for this opening (pass MT: opened from a lesson already showing, the
  // first Next could land before the step went back to 0, and at 320 pixels the walk stopped a line short).
  const toStep = async (mod, step) => { await page.evaluate(() => window.__eduTest.goTo('overview')); await page.waitForFunction(() => window.__eduTest.screen === 'overview'); await page.evaluate((m) => window.__eduTest.openModule(m), mod); await page.waitForFunction(() => window.__eduTest.screen === 'lesson'); await page.waitForTimeout(150);
    // Each Next is pressed as the element itself and waits for the line to change (pass MT: at 320 by 640 pixels a say-along line's
    // strip puts Next across the fold, where the lesson's scroll cue sits over it, and a click at Next's place landed on the cue, so the
    // walk stopped a line short; pressing what the walk names, not a point on the screen, keeps the walk about the strip).
    const lineNow = () => page.evaluate(() => { const p = [...document.querySelectorAll('p')].find((x) => x.textContent.trim().length > 20 && !x.closest('[data-say-along]')); return p ? p.textContent.trim() : ''; });
    for (let i = 0; i < step; i++) { const was = await lineNow(); await page.getByRole('button', { name: 'Next', exact: true }).first().evaluate((b) => b.click());
      await page.waitForFunction((w) => { const p = [...document.querySelectorAll('p')].find((x) => x.textContent.trim().length > 20 && !x.closest('[data-say-along]')); return !!p && p.textContent.trim() !== w; }, was, { timeout: 4000 }).catch(() => {}); await page.waitForTimeout(120); } };
  const lineOf = (mod, step) => L.readAloudScript(L.MODULES.find((m) => m.id === mod))[step].say;
  // Played to its end: as many utterances from the line's first sentence on as the line has spoken pieces, the last one ended and the
  // voice quiet (a word said in several ways ends many utterances, so the last words alone would be met at the first way's end).
  const playOut = async (mod, step) => { const line = lineOf(mod, step); const want = L.speechPieces(line).filter((x) => !x.sound).map((x) => x.text.trim());
    const done = await page.waitForFunction((w) => { const t = window.__sa.map((x) => x.text.trim()); const from = t.lastIndexOf(w[0]); return from >= 0 && t.length - from >= w.length && !!window.__sa[from + w.length - 1].end && !window.speechSynthesis.speaking && !window.speechSynthesis.pending; }, want, { timeout: 90000 }).then(() => true).catch(() => false);
    const got = await page.evaluate(() => ({ sa: window.__sa.slice(), lits: window.__lits.slice(), sounds: (window.__eduSounds || []).slice() }));
    const from = got.sa.map((x) => x.text.trim()).lastIndexOf(want[0]); return { done, line, sa: from >= 0 ? got.sa.slice(from) : [], lits: got.lits, sounds: got.sounds }; };
  await install(); await toStep('learning-words', 5);
  const shown = await page.evaluate(() => { const s = document.querySelector('[data-say-along]'); const para = [...document.querySelectorAll('p')].find((p) => /A cup and a ball are different\./.test(p.textContent) && !p.closest('[data-say-along]')); return { word: s && s.getAttribute('data-say-along'), para: para ? para.textContent.trim() : null }; });
  const D = await playOut('learning-words', 5);
  const pieces = L.speechPieces(D.line).filter((x) => !x.sound); const forms = pieces.filter((x) => x.sayAlong);
  const voiceOf = (style) => L.SAY_ALONG_VOICES.find((v) => v.style === style);
  const deviceOf = (f) => { const v = voiceOf(f.sayAlong.style); return v.device[Math.min(f.sayAlong.rep, v.device.length - 1)]; };
  const near = (a, b) => typeof a === 'number' && Math.abs(a - b) < 1e-6;
  const said = D.sa.map((x) => x.text.trim());
  const inOrder = JSON.stringify(said) === JSON.stringify(pieces.map((x) => x.text.trim()));
  const shaped = forms.every((f) => { const u = D.sa[pieces.indexOf(f)]; const d = deviceOf(f); return !!u && near(u.rate, d.rate) && near(u.pitch, d.pitch) && (d.volume === undefined || near(u.volume, d.volume)); })
    && pieces.filter((x) => x.shape === 'sayOpen' || x.shape === 'cheer').length === 2 && pieces.filter((x) => x.shape === 'sayOpen' || x.shape === 'cheer').every((p) => { const u = D.sa[pieces.indexOf(p)]; const d = p.shape === 'sayOpen' ? L.SAY_ALONG_OPEN_SHAPE : { rate: 1.0, pitch: 1.45 }; return !!u && near(u.rate, d.rate) && near(u.pitch, d.pitch); });
  // The brief pauses between sayings (pass MT, Mikey: "the four times in a row should have brief pauses between each one too"): each
  // saying that asks for one is followed by the next no sooner than its pause, less 60 ms for the timers.
  const paused = pieces.filter((f) => f.pauseAfter).map((f) => { const k = pieces.indexOf(f); const u = D.sa[k]; const nx = D.sa[k + 1]; return nx && u && u.end ? { style: f.sayAlong.style, wait: nx.at - u.end, want: f.pauseAfter } : { style: f.sayAlong.style, wait: null, want: f.pauseAfter }; });
  const pausedOk = paused.length === 4 && paused.every((x) => x.wait !== null && x.wait >= x.want - 60 && x.wait <= x.want + 450);
  const calls = pieces.filter((x) => !x.sayAlong && x.shape === 'plain').every((p) => { const u = D.sa[pieces.indexOf(p)]; return !!u && near(u.rate, 0.86 * 0.9); });
  // The child's turn: after each form's last saying, the next words wait sayAlongEcho, less 60 ms for the timers.
  const turns = forms.filter((f) => f.echo).map((f) => { const k = pieces.indexOf(f); const u = D.sa[k]; const nx = D.sa[k + 1]; return nx && u && u.end ? { form: f.sayAlong.style, wait: nx.at - u.end, want: f.echo } : { form: f.sayAlong.style, wait: null, want: f.echo }; });
  const turned = turns.length === 6 && turns.slice(0, -1).every((x) => x.wait !== null && x.wait >= x.want - 60);
  // The light: each saying's syllables in order; the low voice's four sayings each lit with its dot.
  const lit = (call) => D.lits.filter((x) => x.word === 'different' && x.call === call && x.lit !== '').map((x) => `${x.rep}:${x.lit}`);
  const slowLit = lit('slow'); const whisperLit = lit('whisper'); const sillyLit = lit('silly'); const fastLit = lit('fast');
  const through = (n) => Array.from({ length: n }, (_, r) => [0, 1, 2].map((y) => `${r}:${y}`)).flat();
  const swept = JSON.stringify(slowLit) === JSON.stringify(through(1)) && JSON.stringify(whisperLit) === JSON.stringify(through(2)) && JSON.stringify(sillyLit) === JSON.stringify(through(4)) && JSON.stringify(fastLit) === JSON.stringify(through(3))
    && D.lits.filter((x) => x.call === 'silly').every((x) => x.dots === '4') && D.lits.filter((x) => x.call === 'fast').every((x) => x.dots === '3') && D.lits.filter((x) => x.call === 'slow').every((x) => x.dots === '0')
    && D.lits.some((x) => x.call === 'praise');
  // No syllable past a saying's first lights before the voice begins that saying (round one's screen check: the light ran from the
  // moment a saying was queued, through all of a short word before a slow-to-start voice said it).
  const early = []; forms.forEach((fm) => { const u = D.sa[pieces.indexOf(fm)]; if (!u || !u.began) { early.push(`${fm.sayAlong.style} ${fm.sayAlong.rep} never began`); return; }
    for (const x of D.lits) if (x.word === 'different' && x.call === fm.sayAlong.style && x.rep === String(fm.sayAlong.rep) && x.lit !== '' && x.lit !== '0' && x.t < u.began - 20 && x.t >= u.at) early.push(`${fm.sayAlong.style} ${x.rep}:${x.lit} at ${x.t - u.began} ms`); });
  ok("a say-along line shows its own words in the paragraph and the word in the strip; the voice says Mikey's game in order, the opener excited, each way at its own rate and pitch, the silly voices and the whisper with their brief pauses, the calls in the young voice and the praise as a cheer; the child's turn follows each way; and the light walks each syllable of each saying, super fast's three in one breath (pass MS; pass MT)",
    D.done && shown.word === 'different' && shown.para === 'Different means not the same. A cup and a ball are different.' && inOrder && shaped && pausedOk && calls && turned && swept && early.length === 0,
    { shaped, pausedOk, calls, turned, swept, early: early.slice(0, 6), done: D.done, shown, inOrder, paused, turns, slowLit, whisperLit, sillyLit, fastLit, said: said.slice(0, 18) });   // the yes-or-no parts first, so a cut detail still shows which (round one's code check)
  // The cheer (pass MT, in place of pass MS's chant and its clap): three cheers, a fan's whistle after each of the first two and the
  // crowd after the last, the app's own sounds.
  await install(); await toStep('learning-words', 1);
  const M = await playOut('learning-words', 1);
  const cheers = M.sa.map((x) => x.text.trim()); const at = cheers.indexOf("Now let's cheer it like we're at a big game!");
  const chant = at >= 0 && cheers.slice(at + 1, at + 4).every((x) => x === 'Match!') && JSON.stringify(M.sounds.filter((s) => s === 'whistle' || s === 'applause')) === JSON.stringify(['whistle', 'whistle', 'applause']);
  ok('a say-along cheer cheers its word three times with a fan\'s whistle between the cheers and the crowd after, the app\'s own sounds (pass MT)', M.done && chant, { done: M.done, cheers: cheers.slice(at, at + 5), sounds: M.sounds });
  // At 320 pixels the strip keeps its height and Next its place through the whole game (round one's screen check, pass MS: the cue took
  // two lines there and every call one, so Back, the dots and Next jumped 19 pixels as the first call showed, in 11 of the 34 lines).
  await page.setViewportSize({ width: 320, height: 640 }); await install(); await toStep('learning-words', 5);
  { const N = await playOut('learning-words', 5); const seen = N.lits.filter((x) => x.word === 'different');
    const hs = seen.map((x) => x.h).filter(Boolean); const ns = seen.map((x) => x.next).filter((y) => y !== null);
    const steady = N.done && hs.length > 10 && Math.max(...hs) - Math.min(...hs) <= 1 && ns.length > 10 && Math.max(...ns) - Math.min(...ns) <= 1;
    ok('at 320 pixels a say-along strip keeps its height and Next its place through the whole game (pass MS, round one\'s screen check)', steady, { done: N.done, heights: [...new Set(hs)], next: [...new Set(ns)], calls: [...new Set(seen.map((x) => x.call))] }); }
  await page.setViewportSize({ width: 390, height: 844 });
  // No voice on the device: the strip shows the cue, the word and every call in order, for a grown-up to lead.
  await page.evaluate(() => { if (window.__saWatch) window.__saWatch.disconnect(); Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: undefined }); });
  await toStep('learning-words', 5); await page.waitForTimeout(300);
  const quiet = await page.evaluate(() => { const s = document.querySelector('[data-say-along]'); const steps = s ? [...s.querySelectorAll('[data-say-along-step]')] : []; return { calls: steps.map((x) => x.textContent), lines: steps.map((x) => Math.round(x.getBoundingClientRect().top)), dots: !!(s && s.querySelector('[data-say-along-dots]')) }; });
  const wantCalls = L.sayAlongParts(lineOf('learning-words', 5)).filter((x) => x.role === 'call' || x.role === 'praise').map((x) => x.sentence);   // "Great job!" in its place since round one (pass MT)
  // One call to a line (round one's screen check: joined by dots, a call broke across two lines), each below the one before.
  ok('with no voice on the device, a say-along strip lists its calls in order, one to a line, for a grown-up to lead (pass MS)', JSON.stringify(quiet.calls) === JSON.stringify(wantCalls) && quiet.lines.every((y, k) => k === 0 || y > quiet.lines[k - 1]) && !quiet.dots, { quiet, wantCalls });
  // No fade on the light (round one's lesson check, pass MT): every syllable of the strip, and the lesson's sentences, carry no transition,
  // so ink and fill change in one frame in the dark theme too; a page given a 40 ms fade by a planted style fails.
  { const fadeless = () => page.evaluate(() => [...document.querySelectorAll('[data-say-along-syllable], [data-read-lit]')].every((x) => getComputedStyle(x).transitionDuration.split(',').every((d) => parseFloat(d) === 0)));
    const now = await fadeless(); await page.evaluate(() => { const st = document.createElement('style'); st.id = '__fadePlant'; st.textContent = '[data-say-along-syllable]{transition: background 40ms !important}'; document.head.appendChild(st); });
    const planted = await fadeless(); await page.evaluate(() => document.getElementById('__fadePlant').remove());
    ok('no syllable of a say-along strip fades in or out, so its ink and its fill change in one frame (pass MT; a planted 40 ms fade caught)', now && !planted, { now, planted }); }
  // The big word is named whole for a screen reader (round one's code check: an aria-label on a paragraph went unread; round two's:
  // nothing held it), as a picture of the word, its syllables hidden one by one.
  { const named = await page.locator('[data-say-along]').getByRole('img', { name: 'different', exact: true }).count();
    ok('a say-along strip names its big word whole for a screen reader, as a picture of the word (pass MS)', named === 1, { named }); }
  await page.evaluate(() => Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: window.__voiceBeforeSayAlong })); }

// The voices a lesson shows (pass MV, round one's screen check: no browser check played a manner, so the screens' wiring was held only
// by the source's own lines and the rules test's node:vm). A stand-in voice records each utterance's words, rate, pitch and loudness and
// when it was queued, began and ended, and the lesson's light is recorded as it changes. My voice goes up and down's line 2: every piece
// in order, the plain words in the young voice (0.774 and 1.15) and each manner sentence at its VOICE_MANNERS numbers slowed with them
// (YOUNG_RATE, 0.9), the child's turn after "Up high!" (mannerTurnMs, less 60 ms for the timers), and "Up high!" lit while it is said and
// through the turn. My voice tells more's line 5: the strong word a piece of its own in small letters at the strong voice's numbers, the
// words around it plain, its sentence lit while it is said. A question: "I see a dog." high and then low as the question appears and
// again from Hear it again, each sentence choice tapped, and the explanation after a right answer, each sentence in its manner. With no
// voice on the device, the setup prints the cue for the grown-up. Each check is proven on its own record doctored to the plain pitch, and
// the turn on one doctored short.
{ await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => { window.__voiceBeforeManners = window.speechSynthesis; });
  const install = () => page.evaluate(() => { const q = []; let cur = null; let timer = null; window.__mv = []; window.__mvLit = [];
    const next = () => { cur = q.shift() || null; if (!cur) return; const mine = cur; const ms = Math.round((String(mine.text).length * 30) / (mine.rate || 1)) + 60; const rec = { text: mine.text, rate: mine.rate, pitch: mine.pitch, volume: mine.volume, at: Date.now() }; window.__mv.push(rec);
      timer = setTimeout(() => { if (cur !== mine) return; rec.began = Date.now(); if (mine.onstart) mine.onstart({});
        timer = setTimeout(() => { if (cur !== mine) return; cur = null; rec.end = Date.now(); if (mine.onend) mine.onend({}); if (!cur) next(); }, ms); }, 120); };
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: { get speaking() { return !!cur; }, get pending() { return q.length > 0; }, cancel() { q.length = 0; if (timer) clearTimeout(timer); cur = null; }, getVoices() { return []; }, speak(u) { q.push(u); if (!cur) next(); } } });
    const read = () => { const el = document.querySelector('[data-read-lit]'); const v = { t: Date.now(), lit: el ? el.textContent.trim() : '' }; const last = window.__mvLit[window.__mvLit.length - 1]; if (!last || last.lit !== v.lit) window.__mvLit.push(v); };
    if (window.__mvWatch) window.__mvWatch.disconnect(); window.__mvWatch = new MutationObserver(read); window.__mvWatch.observe(document.body, { attributes: true, childList: true, subtree: true, characterData: true }); });
  const quiet = () => page.waitForFunction(() => { const ss = window.speechSynthesis; const t = Date.now(); if (ss.speaking || ss.pending) { window.__mvQuiet = null; return false; } if (!window.__mvQuiet) window.__mvQuiet = t; return t - window.__mvQuiet >= 500; }, null, { timeout: 30000, polling: 50 }).then(() => true).catch(() => false);
  const lineNow = () => page.evaluate(() => { const p = [...document.querySelectorAll('p')].find((x) => x.textContent.trim().length > 20 && !x.closest('[data-say-along]') && !x.hasAttribute('data-voice-note')); return p ? p.textContent.trim() : ''; });
  const toStep = async (mod, step) => { await page.evaluate(() => window.__eduTest.goTo('overview')); await page.waitForFunction(() => window.__eduTest.screen === 'overview'); await page.evaluate((m) => window.__eduTest.openModule(m), mod); await page.waitForFunction(() => window.__eduTest.screen === 'lesson'); await page.waitForTimeout(150);
    for (let i = 0; i < step; i++) { const was = await lineNow(); await page.getByRole('button', { name: 'Next', exact: true }).first().evaluate((b) => b.click());
      await page.waitForFunction((w) => { const p = [...document.querySelectorAll('p')].find((x) => x.textContent.trim().length > 20 && !x.closest('[data-say-along]') && !x.hasAttribute('data-voice-note')); return !!p && p.textContent.trim() !== w; }, was, { timeout: 4000 }).catch(() => {}); await page.waitForTimeout(120); } };
  const lineOf = (mod, step) => L.readAloudScript(L.MODULES.find((m) => m.id === mod))[step];
  const piecesOfLine = (line) => { const parts = String(line.say).split(L.SENTENCE_BREAK).filter(Boolean); return parts.flatMap((t, k) => L.speechPieces(t, { line: parts, at: k, voices: line.voices })).filter((p) => !p.sound); };
  // A line played to its end: its pieces' words from the first on, the last one ended and the voice quiet.
  const playOut = async (line) => { const want = piecesOfLine(line).map((p) => p.text.trim());
    const done = await page.waitForFunction((w) => { const t = window.__mv.map((x) => String(x.text).trim()); const from = t.lastIndexOf(w[0]); return from >= 0 && t.length - from >= w.length && !!window.__mv[from + w.length - 1].end && !window.speechSynthesis.speaking && !window.speechSynthesis.pending; }, want, { timeout: 60000 }).then(() => true).catch(() => false);
    const got = await page.evaluate(() => ({ mv: window.__mv.slice(), lits: window.__mvLit.slice() })); const from = got.mv.map((x) => String(x.text).trim()).lastIndexOf(want[0]);
    return { done, recs: from >= 0 ? got.mv.slice(from, from + want.length) : [], lits: got.lits }; };
  const near = (a, b) => typeof a === 'number' && typeof b === 'number' && Math.abs(a - b) < 1e-6;
  const Y = 0.9; const M = L.VOICE_MANNERS;   // YOUNG_RATE in ui.jsx; the manners' own numbers from logic
  const wantOf = (shape) => (/^said-/.test(shape) && M[shape.slice(5)] ? { rate: M[shape.slice(5)].device.rate * Y, pitch: M[shape.slice(5)].device.pitch, volume: M[shape.slice(5)].device.volume } : shape === 'plain' ? { rate: 0.86 * Y, pitch: 1.15 } : null);
  const heardAs = (recs, pieces) => pieces.length > 0 && recs.length === pieces.length && pieces.every((p, k) => { const u = recs[k]; const w = wantOf(p.shape); return !!u && String(u.text).trim() === p.text.trim() && (!w || (near(u.rate, w.rate) && near(u.pitch, w.pitch) && (w.volume === undefined ? u.volume === undefined : near(u.volume, w.volume)))); });
  const flatten = (recs) => recs.map((u) => ({ ...u, pitch: 1.15 }));   // the doctored record: every piece at the plain pitch
  const litAt = (lits, t) => (lits.filter((x) => x.t <= t).slice(-1)[0] || { lit: '' }).lit;
  await install();
  // My voice goes up and down, line 2: up high and down low, each with the child's turn after it.
  const lineA = lineOf('voice-up-and-down', 2); const pa = piecesOfLine(lineA); await toStep('voice-up-and-down', 2); const A = await playOut(lineA);
  const up = A.recs[pa.findIndex((p) => p.text === 'Up high!')]; const down = A.recs[pa.findIndex((p) => p.text === 'Down low.')]; const turnA = L.mannerTurnMs('Up high!', 'high');
  const turned = (u, d, ms) => !!u && !!d && !!u.end && d.at - u.end >= ms - 60;
  const litThrough = !!up && !!down && !!up.began && litAt(A.lits, up.began + 5) === 'Up high!' && A.lits.filter((x) => x.t > up.began + 5 && x.t < down.at - 30).every((x) => x.lit === 'Up high!') && litAt(A.lits, down.at - 30) === 'Up high!';
  ok("a lesson line that teaches a voice says each manner sentence in its manner in the real page, slowed with the young voice's words around it, waits for the child's turn after one and keeps it lit through the turn (pass MV, round one's screen check; a doctored record at the plain pitch and a short turn caught)",
    A.done && pa.map((p) => p.shape).join(',') === 'plain,said-high,said-low' && heardAs(A.recs, pa) && turned(up, down, turnA) && litThrough && !heardAs(flatten(A.recs), pa) && !turned(up, down && up && { ...down, at: up.end + turnA - 300 }, turnA),
    { done: A.done, heard: heardAs(A.recs, pa), turn: up && down && up.end ? down.at - up.end : null, want: turnA, litThrough, recs: A.recs.map((u) => [u.text, u.rate, u.pitch, u.volume]), lits: A.lits.slice(-6) });
  // My voice tells more, line 5: circle said strong, a piece of its own in small letters, the words around it plain, the sentence lit.
  const lineB = lineOf('voice-tells-more', 5); const pb = piecesOfLine(lineB); await toStep('voice-tells-more', 5); const B = await playOut(lineB);
  const strongAt = pb.findIndex((p) => p.shape === 'said-strong'); const sw = B.recs[strongAt]; const whole = (lineB.voices[0] || [])[0];
  const litB = !!sw && !!sw.began && litAt(B.lits, sw.began + 5) === whole;
  ok("a strong word is said in the real page as a piece of its own, in small letters, at the strong voice's rate, pitch and loudness slowed with the young voice, the words around it plain and its sentence lit while it is said (pass MV, round one's screen check; a doctored record at the plain pitch caught)",
    B.done && strongAt > 0 && pb[strongAt].text === 'circle' && heardAs(B.recs, pb) && litB && !heardAs(flatten(B.recs), pb), { done: B.done, heard: heardAs(B.recs, pb), litB, recs: B.recs.map((u) => [u.text, u.rate, u.pitch, u.volume]), lits: B.lits.slice(-6) });
  // A question: "I see a dog." high, then low, as it appears and from Hear it again; each sentence choice tapped; the explanation.
  const seedOf = (g, f) => { for (let s = 1; s < 300; s++) if (f(L.generateQuestion(g, s))) return s; return 0; };
  const mark = () => page.evaluate(() => window.__mv.length); const since = (n) => page.evaluate((k) => window.__mv.slice(k), n);
  // Words said to their end: every piece of them from the first on, recorded since the mark, the last one ended and the voice quiet (a
  // quiet half second is not enough, since the young voice rests between sentences).
  const sayOut = async (from, text, voices) => { const want = L.speechPieces(text, voices ? { voices } : {}).filter((p) => !p.sound).map((p) => p.text.trim());
    await page.waitForFunction(([f, w]) => { const t = window.__mv.slice(f).map((x) => String(x.text).trim()); const at = t.lastIndexOf(w[0]); return at >= 0 && t.length - at >= w.length && !!window.__mv[f + at + w.length - 1].end && !window.speechSynthesis.speaking && !window.speechSynthesis.pending; }, [from, want], { timeout: 30000, polling: 50 }).catch(() => {});
    return since(from); };
  const saidIn = (recs, text, manner) => { const u = recs.filter((x) => String(x.text).trim() === text).slice(-1)[0]; const w = wantOf(`said-${manner}`); return !!u && !!w && near(u.rate, w.rate) && near(u.pitch, w.pitch) && (w.volume === undefined ? u.volume === undefined : near(u.volume, w.volume)); };
  const tap = (c) => page.locator(`button[data-choice="${String(c).replace(/"/g, '\\"')}"]`).first().click();
  // Each shown from the overview: the screen says a question as it appears when the screen, its words or its place in the round changes,
  // and the high and the low questions have the same words at the same place.
  const fresh = async (g, s) => { await page.evaluate(() => window.__eduTest.goTo('overview')); await page.waitForFunction(() => window.__eduTest.screen === 'overview'); await quiet(); await show(g, s); };
  const asked = (k) => [k.story, k.prompt].filter(Boolean).join(' ');
  const heardQ = {}; const flatQ = {};
  for (const way of ['high', 'low']) { const s = seedOf('p3-tone-highlow', (k) => k.voices[0][1] === way); const k = L.generateQuestion('p3-tone-highlow', s); const sent = k.voices[0][0];
    let m0 = await mark(); await fresh('p3-tone-highlow', s); const first = await sayOut(m0, asked(k), k.voices);
    m0 = await mark(); await page.getByRole('button', { name: 'Hear it again', exact: true }).first().click(); const again = await sayOut(m0, asked(k), k.voices);
    heardQ[way] = !!s && saidIn(first, sent, way) && saidIn(again, sent, way); flatQ[way] = saidIn(flatten(first), sent, way); }
  const sa = seedOf('p3-tone-ask', (k) => k.choices.length === 2); const qa = L.generateQuestion('p3-tone-ask', sa); const m2 = await mark(); await fresh('p3-tone-ask', sa); await sayOut(m2, asked(qa), qa.voices);
  const taps = {}; for (const c of qa.choices) { const m0 = await mark(); await tap(c); taps[c] = saidIn(await sayOut(m0, c, qa.voices), c, L.mannerOf(c, qa.voices).manner); }
  { const m0 = await mark(); await tap(qa.answer); await sayOut(m0, qa.answer, qa.voices); }
  const m1 = await mark(); await page.getByRole('button', { name: 'Check answer', exact: true }).first().click(); const told = await sayOut(m1, `Correct. ${qa.explain}`, qa.voices);
  const explained = told.some((x) => String(x.text).trim() === 'Correct.') && saidIn(told, qa.answer, L.mannerOf(qa.answer, qa.voices).manner);
  ok("a question asked by ear says its sentence in its manner in the real page as it appears and from Hear it again, high and low, a tapped sentence choice in its own manner, and the explanation after a right answer the same way (pass MV, round one's screen check; a doctored record at the plain pitch caught)",
    heardQ.high && heardQ.low && !flatQ.high && !flatQ.low && Object.keys(taps).length === 2 && Object.values(taps).every(Boolean) && explained, { heardQ, flatQ, taps, explained, told: told.map((u) => [u.text, u.rate, u.pitch]).slice(0, 6) });
  // No voice on the device: the setup prints how its sentence is said, for the grown-up who reads it aloud.
  await page.evaluate(() => { if (window.__mvWatch) window.__mvWatch.disconnect(); Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: undefined }); });
  const sh = seedOf('p3-tone-highlow', (k) => k.voices[0][1] === 'high'); await show('p3-tone-highlow', sh);
  const printed = await page.evaluate(() => { const el = document.querySelector('[data-question-setup]'); return el ? el.textContent.trim() : null; });
  ok("with no voice on the device, a question asked by ear prints its cue after the sentence, for the grown-up who reads it aloud (pass MV, round one's screen check)", printed === L.printedQuestion(L.generateQuestion('p3-tone-highlow', sh), false).story && /\(For the grown-up: say it up high\.\)$/.test(String(printed)), { printed });
  await page.evaluate(() => Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: window.__voiceBeforeManners })); }

// A practice page's title stays centered beside its speaker at every phone width, whatever the module's title (Mikey's Q72 rule, round
// one's screen check, pass MR: the side columns were plain 1fr, so a long title's empty left column shrank to nothing while the speaker's
// kept its width, and 94 of the 675 titles sat more than 3 pixels left of center at 390 pixels, by up to 22 at 320). Every module
// title is put in the real row in turn; the planted fault puts the old columns back and must be caught.
{ const L2 = await import('../../src/logic.mjs'); const titles = [...new Set(L2.COURSES.flatMap((c) => c.modules.map((m) => L2.titleCase(m.title))))];
  const anyMod = L2.COURSES.flatMap((c) => c.modules).find((m) => m.generators && m.generators.length);
  // Under 360 pixels the title stands in FitText's span (pass NC, EARMARKS A72), so each trial title is written into that span, never over
  // it (writing over React's span broke the title row for the next screen), and fitted as FitText fits it, from 18 pixels down by halves to
  // 15 and then let wrap, in the room the row leaves it (the row less its two side columns at their least, 44 pixels each, and the two
  // gaps, since round two's code read); the fit is checked against FitText's own on the title the screen drew, so the copy here cannot
  // drift unseen.
  const readOff = (list) => page.evaluate((ts) => { const row = document.querySelector('[data-title-row]'); const p = row && row.querySelector('p'); if (!p) return null;
    const span = p.querySelector('[data-fit-text]'); const box = span || p; const was = box.textContent; const wasStyle = span ? span.getAttribute('style') : null;
    const fit = () => { const cs = getComputedStyle(row); const room = row.clientWidth - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0) - 2 * (44 + 8); span.style.whiteSpace = 'nowrap'; let f = 18; span.style.fontSize = `${f}px`;
      while (f > 15 && span.scrollWidth > room + 0.5) { f -= 0.5; span.style.fontSize = `${f}px`; }
      const tooWide = span.scrollWidth > room + 0.5; span.style.whiteSpace = tooWide ? 'normal' : 'nowrap'; span.style.overflowWrap = tooWide ? 'anywhere' : 'normal'; return { fs: f, wrap: tooWide }; };
    let mirror = null; if (span) { const drew = { fs: parseFloat(span.style.fontSize), wrap: span.style.whiteSpace === 'normal' }; const mine = fit(); mirror = mine.fs === drew.fs && mine.wrap === drew.wrap; span.setAttribute('style', wasStyle); }
    const rr = row.getBoundingClientRect(); const mid = (rr.left + rr.right) / 2; const bad = [];
    for (const t of ts) { box.textContent = t; if (span) fit(); const rg = document.createRange(); rg.selectNodeContents(box); const rs = [...rg.getClientRects()]; const l = Math.min(...rs.map((r) => r.left)); const rgt = Math.max(...rs.map((r) => r.right)); const off = (l + rgt) / 2 - mid; if (Math.abs(off) > 3) bad.push([t, +off.toFixed(1)]); }
    box.textContent = was; if (span) span.setAttribute('style', wasStyle); return { read: ts.length, bad: bad.length, first: bad.slice(0, 3), fitted: !!span, mirror }; }, list);
  const widths = [];
  for (const [w, h] of [[320, 568], [375, 667], [390, 844]]) { await page.setViewportSize({ width: w, height: h }); await show(anyMod.generators[0], 3, anyMod.id); widths.push({ w, ...(await readOff(titles)) }); }
  ok(`a practice page's title stays centered beside its speaker for every module title at 320, 375 and 390 pixels (${titles.length} titles; at 320 each fitted as FitText fits it, the copy of its fit matching FitText's own)`, widths.every((x) => x.read === titles.length && x.bad === 0) && widths[0].fitted === true && widths[0].mirror === true && !widths[1].fitted && !widths[2].fitted, widths);
  await page.setViewportSize({ width: 320, height: 568 }); await show(anyMod.generators[0], 3, anyMod.id);
  const plantedRow = await page.evaluate(() => { const row = document.querySelector('[data-title-row]'); if (!row) return false; row.dataset.plantWas = row.style.gridTemplateColumns; row.style.gridTemplateColumns = '1fr auto 1fr'; return true; });
  const planted = plantedRow ? await readOff(titles) : null;
  await page.evaluate(() => { const row = document.querySelector('[data-title-row]'); if (row && row.dataset.plantWas !== undefined) { row.style.gridTemplateColumns = row.dataset.plantWas; delete row.dataset.plantWas; } });
  ok('the read catches the old plain columns, which pushed long titles off center', planted && planted.bad > 0, planted);
  await page.setViewportSize({ width: 1280, height: 900 });
  // The layout read (tests/e2e/layout-check.mjs, check.sh 13g) sees words written straight into a centred row beside an icon: the
  // planted row, words and a 30-pixel button in a centred flex row, as "Wonder Questions" sat beside its i, is an offset; the same
  // words with the button hung outside them, as HeadWithInfo hangs it, are not.
  const { LAYOUT_SOURCE } = await import('./layout-check.mjs');
  const loose = await page.evaluate((src) => { const read = eval(`(${src})`); const host = document.createElement('div'); host.style.cssText = 'position:fixed;left:0;top:0;width:360px;background:#fff;z-index:99999'; document.body.appendChild(host);
    host.innerHTML = '<div id="lp1"><h1 style="display:flex;align-items:center;justify-content:center;margin:0;font-size:24px">Wonder Questions <button style="width:30px;height:30px;padding:0" aria-label="i"><svg width="20" height="20"></svg></button></h1></div>'
      + '<div id="lp2"><h1 style="text-align:center;margin:0;font-size:24px"><span style="position:relative;display:inline-block">Wonder Questions<span style="position:absolute;left:100%;top:50%;transform:translateY(-50%);margin-left:8px;line-height:0"><button style="width:30px;height:30px;padding:0" aria-label="i"><svg width="20" height="20"></svg></button></span></span></h1></div>';
    const bad = read('#lp1').filter((x) => x.kind === 'offset'); const good = read('#lp2').filter((x) => x.kind === 'offset'); host.remove(); return { bad: bad.length, good: good.length }; }, LAYOUT_SOURCE);
  ok('the layout read finds words written straight into a centred row pushed off center by an icon, and passes the same words with the icon hung outside them', loose.bad === 1 && loose.good === 0, loose);
  // Since round three of pass MR it reads a plain centered block too, where an info button (InfoButton's one letter, i) shares a
  // line with words: a link beside its i, as "Back to recommended courses" sat, and a paragraph whose last line ends in an i, as three
  // of the educator's paragraphs did, are offsets; the same link with its i hung as HeadWithInfo hangs it, and the same paragraph
  // with its i hung past the last word as EndInfo hangs it, are not.
  const blocks = await page.evaluate((src) => { const read = eval(`(${src})`); const host = document.createElement('div'); host.style.cssText = 'position:fixed;left:0;top:0;width:360px;background:#fff;z-index:99999;font-size:14px'; document.body.appendChild(host);
    const info = '<button style="width:18px;height:18px;padding:0;margin-left:8px;vertical-align:middle;border-radius:999px;font-size:12px;line-height:15px">i</button>';
    const hung = (inner) => `<span style="position:relative;display:inline-block">${inner}<span style="position:absolute;left:100%;top:50%;transform:translateY(-50%);line-height:0">${info}</span></span>`;
    const para = 'Order is chosen by student metrics. Stuck on a module? Frequent loop backs? Guessing or low confidence? To the top for';
    host.innerHTML = `<p id="lb1" style="text-align:center;margin:0"><button style="border:0;background:none;padding:0;font-size:13px">Back to recommended courses</button>${info}</p>`
      + `<p id="lb2" style="text-align:center;margin:0">${hung('<button style="border:0;background:none;padding:0;font-size:13px">Back to recommended courses</button>')}</p>`
      + `<p id="lb3" style="text-align:center;margin:0;padding:0 26px">${para} you. ${info}</p>`
      + `<p id="lb4" style="text-align:center;margin:0;padding:0 26px">${para} ${hung('you.')}</p>`;
    const n = (sel) => read(sel).filter((x) => x.kind === 'offset').length; const r = { link: n('#lb1'), linkHung: n('#lb2'), para: n('#lb3'), paraHung: n('#lb4') }; host.remove(); return r; }, LAYOUT_SOURCE);
  ok('the layout read finds a link and a paragraph\'s last line pushed off center by an i in a plain centered block, and passes both with the i hung outside them', blocks.link === 1 && blocks.linkHung === 0 && blocks.para === 1 && blocks.paraHung === 0, blocks); }

// One thing and a row in a stacked pair draw at one size, side by side (pass MW, from looking at One cat, two cats on a phone: "Here
// is one cup, and here are two cups." drew the two cups about 60 percent as wide as the one cup above, as if the lesson were about
// big and small). The row takes the pair's width, held to a row's width, and the one thing draws as a row of one, so at 320, 390
// and 1280 pixels, in both themes, each cup in the row draws between 90 and 110 percent of the one cup's width, the two cups' centres
// sit no more than 1.3 cups apart (round one's screen check: on a laptop they had sat 2 cups apart), every picture is a cup (so the
// line measured is the cup line), and with the motion on, after its drift, the sizes hold. Three planted faults must be caught on a
// laptop: the row's half back to wrapping its content (a cup too small), the pair's width cap gone (cups far apart) and the one
// cup's half squeezed (a cup too big beside it), each by its own bound.
{ const L3 = await import('../../src/logic.mjs'); const mod = L3.COURSES.flatMap((c) => c.modules).find((m) => m.id === 'one-cat-two-cats');
  const at = mod.lesson.script.findIndex((ln) => /^Here is one cup/.test(ln.say));
  // Measures the cup line's pair: each cup's width against the one cup's, the two cups' centres apart in cups, and every picture's
  // name; a plant changes one style on the page, is measured and is put back.
  const cups = (plant) => page.evaluate((p) => { const pair = [...document.querySelectorAll('[data-pair]')].find((x) => x.querySelector('.edu-row-pic')); if (!pair) return null;
    const [top, below] = pair.children; const undo = []; const set = (el, k, v) => { undo.push([el, k, el.style[k]]); el.style[k] = v; };
    if (p === 'wrapped') set(below, 'width', ''); if (p === 'uncapped') set(pair, 'maxWidth', 'none'); if (p === 'squeezed') set(top, 'width', '60%');
    const box = (el) => (el ? el.getBoundingClientRect() : { width: 0, left: 0 }); const oneSvg = top.querySelector('svg'); const twoSvgs = [...below.querySelectorAll('.edu-row-pic > div')].map((d) => d.querySelector('svg'));
    const one = box(oneSvg).width; const ws = twoSvgs.map((s) => box(s).width); const cs = twoSvgs.map((s) => box(s).left + box(s).width / 2);
    const r = { one: Math.round(one), two: ws.map(Math.round), least: one ? Math.min(...ws) / one : 0, most: one ? Math.max(...ws) / one : 99, spread: one && cs.length === 2 ? Math.abs(cs[1] - cs[0]) / one : 99, names: [oneSvg, ...twoSvgs].map((s) => s && s.getAttribute('aria-label')) };
    for (const [el, k, v] of undo.reverse()) el.style[k] = v; return r; }, plant);
  const toCups = async () => { await page.evaluate(() => window.__eduTest.openModule('one-cat-two-cats')); await page.waitForFunction(() => window.__eduTest.screen === 'lesson'); await page.waitForTimeout(400);
    for (let i = 0; i < at; i++) { await page.getByRole('button', { name: 'Next', exact: true }).first().click({ force: true }); await page.waitForTimeout(150); } };
  const real = {}; const planted = {};
  for (const theme of ['light', 'dark']) {
    await page.evaluate(() => window.__eduTest.goTo('educator-pick')); await page.waitForTimeout(300); for (const n of ['Skip tour', 'Later', 'Got it']) await tapIf(n);
    const now = await page.evaluate(() => document.documentElement.getAttribute('data-theme') || 'light');
    if (now !== theme) { await page.getByLabel(theme === 'dark' ? 'Dark theme' : 'Light theme').first().click({ force: true }); await page.waitForTimeout(400); }
    await walk('Walk through early years');
    for (const w of [320, 390, 1280]) { await page.setViewportSize({ width: w, height: 844 }); await page.waitForTimeout(300); await toCups(); await page.waitForTimeout(900); real[`${theme} ${w}`] = await cups(null);
      if (w === 1280 && theme === 'light') for (const p of ['wrapped', 'uncapped', 'squeezed']) planted[p] = await cups(p); }
  }
  await page.setViewportSize({ width: 390, height: 844 }); await page.emulateMedia({ reducedMotion: 'no-preference' }); await page.waitForTimeout(300); await toCups(); await page.waitForTimeout(1600); real['dark 390 motion'] = await cups(null);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const fine = (r) => r && r.two.length === 2 && r.least >= 0.9 && r.most <= 1.1 && r.spread <= 1.3 && r.names.length === 3 && r.names.every((n) => n === 'cup');
  ok(`at 320, 390 and 1280 pixels in both themes, and with the motion on, the two cups in One cat, two cats' stacked pair draw the one cup's size, side by side (line ${at}; a wrapped row, an uncapped pair and a squeezed cup planted and each caught)`, at >= 0 && Object.values(real).length === 7 && Object.values(real).every(fine) && planted.wrapped && planted.wrapped.least < 0.8 && planted.uncapped && planted.uncapped.spread > 1.3 && planted.squeezed && planted.squeezed.most > 1.1, { real, planted });
  await page.setViewportSize({ width: 1280, height: 900 }); await page.waitForTimeout(200); }

// A look is named with its picture for a screen reader (pass MW, round two's code read and the third read): Longer sentences draws a
// sleeping baby and a broken crayon, and each is named with its look, as a sleeping cat is (pictureLookName in ui.jsx), where until
// round two a screen reader heard only baby and crayon.
{ const L4 = await import('../../src/logic.mjs'); const m4 = L4.COURSES.flatMap((c) => c.modules).find((m) => m.id === 'longer-sentences');
  const lineOf = (name) => m4.lesson.script.findIndex((l) => JSON.stringify(l.show || '').includes(name)); const names = {};
  for (const [look, want] of [['baby~asleep', 'sleeping baby'], ['crayon~broken', 'broken crayon']]) { const at = lineOf(look);
    await page.evaluate(() => window.__eduTest.openModule('longer-sentences')); await page.waitForFunction(() => window.__eduTest.screen === 'lesson'); await page.waitForTimeout(400);
    for (let i = 0; i < at; i++) { await page.getByRole('button', { name: 'Next', exact: true }).first().click({ force: true }); await page.waitForTimeout(150); }
    await page.waitForTimeout(500); names[look] = { at, want, heard: await page.evaluate(() => [...document.querySelectorAll('svg[role="img"][aria-label]')].map((s) => s.getAttribute('aria-label'))) }; }
  ok("a picture's look is named with it for a screen reader: Longer sentences' sleeping baby and broken crayon (pass MW, round two's code read)", Object.values(names).every((n) => n.at >= 0 && n.heard.includes(n.want)), names); }

// A counting question's sentences are heard (pass MX, round two's code read: no browser test read a heard choice). With the page's
// voice, Words in a sentence's p3-words-same prints "Listen to the sentence." over two buttons that each say "Tap to hear", wear
// data-heard-choice and name their sentence to a screen reader; with no voice (the page's SpeechSynthesisUtterance taken away for the
// moment) its sentence and both choices print, as a grown-up reads them.
{ const look = () => page.evaluate(() => ({ heard: document.body.innerText.includes('Listen to the sentence.'), buttons: [...document.querySelectorAll('[data-choice]')].filter((b) => b.offsetParent)
    .map((b) => ({ choice: b.getAttribute('data-choice'), text: (b.textContent || '').trim(), heard: b.hasAttribute('data-heard-choice'), label: b.getAttribute('aria-label') })) }));
  await page.setViewportSize({ width: 390, height: 844 }); await page.waitForTimeout(200);
  await show('p3-words-same', 3, 'words-in-a-sentence'); const voiced = await look();
  await page.evaluate(() => { window.__heldUtterance = window.SpeechSynthesisUtterance; window.SpeechSynthesisUtterance = undefined; });
  await show('p3-words-same', 4, 'words-in-a-sentence'); await show('p3-words-same', 3, 'words-in-a-sentence'); const silent = await look();
  await page.evaluate(() => { window.SpeechSynthesisUtterance = window.__heldUtterance; delete window.__heldUtterance; });
  const voicedOk = voiced.heard && voiced.buttons.length === 2 && voiced.buttons.every((b) => b.heard && /Tap to hear/.test(b.text) && b.label === b.choice);
  const silentOk = !silent.heard && silent.buttons.length === 2 && silent.buttons.every((b) => !b.heard && b.text.includes(b.choice.replace(/[.!?]$/, '')));
  ok("a counting question's sentence choices say Tap to hear and name their sentence to a screen reader while the voice can speak, and print it with none (pass MX, round two's code read; p3-words-same)", voicedOk && silentOk, JSON.stringify({ voiced, silent }).slice(0, 600)); }

// 10. EARMARKS A76's browser check (pass NC, the screen read): the Wonder answer tiles, fitted together (FitTilesRow) with each word
//    whole (WordFit), never run past their row or the screen, never let a word past a tile's edge or under 13 pixels, and never split a
//    hyphenated word such as grown-up across two lines, read at 320, 340, 360, 375, 390 and 412 pixels wide in both themes on every early
//    question whose answers hold a hyphenated word, a word of nine letters or more, or eighteen letters in all, each width reached by
//    resizing as a phone turned or a window dragged would; the layout read still, transforms and motion off, since a tile the voice reads
//    grows a little on purpose. Its plants: a tile made 60 pixels wider than its column, and a grown-up let break in a narrow box.
{ const WIDE = L.WONDER.filter((w) => w.stage === 'early' && w.answerMode === 'pick' && w.options.some((o) => /-/.test(o) || o.length >= 18 || o.split(/\s+/).some((x) => x.length >= 9)));
  const WIDTHS = [320, 340, 360, 375, 390, 412];
  const tileFaults = (pg) => pg.evaluate(() => {
    const row = document.querySelector('.edu-wonder-answers'); if (!row) return ['no tiles'];
    const out = []; const vw = document.documentElement.clientWidth; const rr = row.getBoundingClientRect();
    if (rr.right > vw + 0.5 || rr.left < -0.5) out.push(`the row past the screen (${Math.round(rr.left)} to ${Math.round(rr.right)} of ${vw})`);
    for (const t of row.children) {
      const r = t.getBoundingClientRect(); const words = t.textContent.trim();
      if (r.right > rr.right + 0.5 || r.left < rr.left - 0.5) out.push(`"${words}" past its row`);
      // A tile's words past its edge, read on WordFit's own span whatever its overflow (round one's code check), as FitTilesRow measures.
      for (const el of t.querySelectorAll('[data-word-fit]')) if (el.scrollWidth > el.clientWidth + 0.5) out.push(`"${words}" past its tile's edge`);
      for (const el of t.querySelectorAll('span')) { const fs = parseFloat(getComputedStyle(el).fontSize); if (el.textContent.trim() && fs < 13 - 0.01) out.push(`"${words}" at ${fs} pixels`); }
      const walker = document.createTreeWalker(t, NodeFilter.SHOW_TEXT); let n;
      while ((n = walker.nextNode())) for (const m of n.textContent.matchAll(/[A-Za-z]+-[A-Za-z]+/g)) { const rg = document.createRange(); rg.setStart(n, m.index); rg.setEnd(n, m.index + m[0].length); const tops = new Set([...rg.getClientRects()].map((x) => Math.round(x.top))); if (tops.size > 1) out.push(`"${m[0]}" split across two lines`); }
    }
    return out; });
  const faults = []; let screens = 0; let plantPast = null; let plantSplit = null; let plantEdge = null; let plantSmall = null; let plantScreen = null;
  for (const theme of ['light', 'dark']) {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 800 }, hasTouch: true, reducedMotion: 'reduce' });
    await ctx.addInitScript((t) => { try { localStorage.setItem('edusphere_v1_theme', t); } catch (e) { /* none */ } }, theme);
    const pg = await ctx.newPage(); await pg.goto(new URL('./page.html', import.meta.url).href);
    const isScreen = (n) => pg.waitForFunction((x) => window.__eduTest && window.__eduTest.screen === x, n, { timeout: 15000 });
    const tap = async (name) => { const b = pg.getByRole('button', { name, exact: true }); if (await b.count()) { await b.first().click({ force: true }); await pg.waitForTimeout(250); } };
    await isScreen('welcome'); await pg.getByRole('button', { name: 'Create account', exact: true }).first().click(); await isScreen('educator-setup');
    await pg.fill('input[placeholder="PIN"]', '2468'); await pg.fill('input[placeholder="PIN again"]', '2468'); await pg.fill('input[placeholder="This device\'s name"]', 'Tiles'); await pg.selectOption('select[aria-label="Your state"]', 'TX');
    await pg.getByRole('button', { name: 'Create account', exact: true }).click(); await isScreen('educator-pick'); await pg.waitForTimeout(400);
    for (const n of ['Skip tour', 'Later', 'Got it']) await tap(n);
    await pg.getByLabel('Walk through early years').first().click({ force: true }); await isScreen('overview'); await pg.waitForTimeout(300);
    // The tiles' layout is read still: a tile the voice is reading grows a little (a scale the eye reads as the tile being said), which
    // is not where the layout puts it, so the check reads the page with transforms and motion off.
    await pg.addStyleTag({ content: '.edu-wonder-answers, .edu-wonder-answers * { transform: none !important; animation: none !important; transition: none !important; }' });
    for (const w of WIDE) {
      await pg.evaluate((id) => window.__eduTest.openWonder(id, 'big-and-little'), w.id); await isScreen('wonder');
      for (const width of WIDTHS) {
        await pg.setViewportSize({ width, height: 800 }); await pg.waitForTimeout(160); screens++;
        for (const f of await tileFaults(pg)) faults.push(`${theme} ${width} ${w.id}: ${f}`);
        // The plants, once each: a tile pushed past its row, and a hyphenated word let break inside a narrow box.
        if (plantPast === null) { await pg.evaluate(() => { const t = document.querySelector('.edu-wonder-answers').children[0]; window.__was = t.getAttribute('style') || ''; t.style.width = (t.offsetWidth + 60) + 'px'; }); plantPast = (await tileFaults(pg)).some((f) => f.includes('past its row')); await pg.evaluate(() => { const t = document.querySelector('.edu-wonder-answers').children[0]; t.setAttribute('style', window.__was); delete window.__was; }); }
        // Since round one's code check each other bound has its plant too: a tile's words set at 60 pixels on one line run past its edge, a
        // word set at 12 pixels is under 13, and the row pushed 400 pixels right runs past the screen; each put back as it was.
        if (plantEdge === null && width === 320) { const res = await pg.evaluate(() => { const s = document.querySelector('.edu-wonder-answers [data-word-fit]'); if (!s) return null; window.__was = s.getAttribute('style') || ''; s.style.fontSize = '60px'; s.style.whiteSpace = 'nowrap'; return true; }); plantEdge = !!res && (await tileFaults(pg)).some((f) => f.includes("past its tile's edge")); await pg.evaluate(() => { const s = document.querySelector('.edu-wonder-answers [data-word-fit]'); if (s && window.__was !== undefined) s.setAttribute('style', window.__was); delete window.__was; }); }
        if (plantSmall === null && width === 320) { const res = await pg.evaluate(() => { const s = [...document.querySelectorAll('.edu-wonder-answers span')].find((x) => x.textContent.trim()); if (!s) return null; window.__was = s.getAttribute('style') || ''; s.style.fontSize = '12px'; return true; }); plantSmall = !!res && (await tileFaults(pg)).some((f) => f.includes('at 12 pixels')); await pg.evaluate(() => { const s = [...document.querySelectorAll('.edu-wonder-answers span')].find((x) => x.textContent.trim()); if (s && window.__was !== undefined) s.setAttribute('style', window.__was); delete window.__was; }); }
        if (plantScreen === null && width === 320) { const res = await pg.evaluate(() => { const r = document.querySelector('.edu-wonder-answers'); if (!r) return null; window.__was = r.style.transform; r.style.setProperty('transform', 'translateX(400px)', 'important'); return true; }); plantScreen = !!res && (await tileFaults(pg)).some((f) => f.includes('the row past the screen')); await pg.evaluate(() => { const r = document.querySelector('.edu-wonder-answers'); if (r) { r.style.removeProperty('transform'); if (window.__was) r.style.transform = window.__was; } delete window.__was; }); }
        if (plantSplit === null && w.options.some((o) => /grown-up/.test(o))) { await pg.evaluate(() => { const s = [...document.querySelectorAll('.edu-wonder-answers span')].find((x) => /grown-up/.test(x.textContent) && !x.querySelector('span')); if (!s) return; window.__was = s.getAttribute('style') || ''; s.setAttribute('style', 'display: inline-block; width: 4ch; white-space: normal; word-break: break-all; font-size: 16px'); }); plantSplit = (await tileFaults(pg)).some((f) => f.includes('split across')); await pg.evaluate(() => { const s = [...document.querySelectorAll('.edu-wonder-answers span')].find((x) => /grown-up/.test(x.textContent) && !x.querySelector('span')); if (s && window.__was !== undefined) s.setAttribute('style', window.__was); delete window.__was; }); }
      }
      await pg.setViewportSize({ width: 375, height: 800 });
    }
    await ctx.close();
  }
  ok(`the Wonder answer tiles fit at 320, 340, 360, 375, 390 and 412 pixels wide in both themes: no tile past its row or the screen, no words past a tile's edge, none under 13 pixels, and no hyphenated word such as grown-up split across two lines (pass NC, EARMARKS A76; ${WIDE.length} early questions with a hyphenated or long answer, ${screens} screens; a tile pushed past its row, a grown-up let break, words set past a tile's edge, a word at 12 pixels and the row pushed past the screen, planted, caught)`, faults.length === 0 && WIDE.length >= 54 && screens === WIDE.length * 12 && plantPast === true && plantSplit === true && plantEdge === true && plantSmall === true && plantScreen === true, [...faults.slice(0, 6), `plants ${plantPast} ${plantSplit} ${plantEdge} ${plantSmall} ${plantScreen}`]);
}
// 11. EARMARKS A77's browser check (pass NC, the screen read): on a laptop a column of picture answers is a phone's width, centred
//    (PICTURE_COLUMN, 420 pixels), where each 69-pixel drawing had sat in a tile 737 pixels wide; read on three banks of pictures at 1280
//    and 1024 pixels wide in the theme the sections above left on; its plant, the column's width limit taken off, caught. Since round
//    one's lead run the width is read against 420 times the page's own zoom (a wide screen's 1.08 drew 454), and on a tablet held both
//    ways (820 by 1180 and 1024 by 768) as well as a laptop; the column's width has no theme of its own, so one theme is read. Since pass
//    ND's round one (the screen read: a 69-pixel sun in a 737-pixel tile) a column of writing as print stands in it too.
{ const column = () => page.evaluate(() => { const b = document.querySelector('button[data-choice]'); if (!b) return null; const grid = b.parentElement; const r = grid.getBoundingClientRect(); const card = grid.parentElement.getBoundingClientRect(); const wrap = document.querySelector('.edu-wrap'); const zoom = (wrap && parseFloat(getComputedStyle(wrap).zoom)) || 1; return { zoom, width: Math.round(r.width), centred: Math.abs((r.left + r.right) / 2 - (card.left + card.right) / 2) <= 1.5, tile: Math.round(b.getBoundingClientRect().width) }; });
  const read = [];
  for (const [g, w, h] of [['p3-snd-pic', 1280, 900], ['pm-same-things', 1280, 900], ['p4-vfs-pic', 1024, 768], ['p3-snd-pic', 820, 1180], ['p4-sbs-count', 1280, 900], ['p4-space-kind', 1280, 900], ['p4-space-which', 1280, 900]]) {
    await page.setViewportSize({ width: w, height: h }); await page.evaluate((gen) => window.__eduTest.showQuestion(gen, 1), g); await page.waitForFunction(() => window.__eduTest.screen === 'practice'); await page.waitForTimeout(300);
    read.push({ g, w, ...(await column()) }); }
  const plant = await page.evaluate(() => { const b = document.querySelector('button[data-choice]'); const grid = b.parentElement; window.__was = grid.style.maxWidth; grid.style.maxWidth = 'none'; return Math.round(grid.getBoundingClientRect().width); });
  await page.evaluate(() => { const grid = document.querySelector('button[data-choice]').parentElement; grid.style.maxWidth = window.__was; delete window.__was; });
  ok('on a laptop and a tablet a column of picture answers is a phone\'s width, centred, its tiles no wider than 420 pixels at the page\'s own zoom (pass NC, EARMARKS A77; three banks at 1280 by 900, 1024 by 768 and 820 by 1180, and since round one\'s screen check a column of dots, p4-sbs-count, at 1280 by 900, and since pass ND\'s a column of print, p4-space-kind and p4-space-which; the width limit taken off, planted, caught)', read.length === 7 && read.every((x) => x.width <= 420 * x.zoom + 1 && x.width >= 300 && x.centred && x.tile <= 420 * x.zoom + 1) && plant > 420 * read[read.length - 1].zoom + 1, { read, plant });
  await page.setViewportSize({ width: 1280, height: 900 }); }
// 12. Round one's screen check (pass NC): a run kept whole (data-whole) stays whole and inside its paragraph at rest, in a story's
//    paragraphs and in the reason after a wrong tap, at 320, 375 and 390 pixels wide, where "Peet, / suh." broke in Put the beats
//    together's story at rest and "Rab, / bit." in the reason (partsWhole kept a run only when it was the whole text); and the runs the
//    stories and reasons say are read kept. A voice that takes every line and says none keeps the story's paragraphs at rest. Its plants:
//    a kept span broken by a line break, and a run's span taken away, each caught.
{ const keptRead = () => page.evaluate(() => { const spans = [...document.querySelectorAll('[data-whole]')].filter((s) => s.offsetParent !== null);
    const out = (s) => { const p = s.closest('p') || s.parentElement; const pr = p.getBoundingClientRect(); return [...s.getClientRects()].some((r) => r.right > pr.right + 1 || r.left < pr.left - 1); };
    return { texts: spans.map((s) => s.textContent), broken: spans.filter((s) => s.getClientRects().length > 1).map((s) => s.textContent), outside: spans.filter(out).map((s) => s.textContent),
      seen: [...document.querySelectorAll('p')].filter((x) => x.offsetParent !== null).map((x) => x.textContent).join('\n') }; });
  // A run is kept when every saying of it in the screen's paragraphs is a kept span of its own (round two's code read: a run said twice in
  // a story passed with one saying kept).
  const runOff = (r, run) => { const said = r.seen.split(run).length - 1; return said === 0 || r.texts.filter((t) => t === run).length !== said; };
  await page.evaluate(() => { window.__voiceBeforeRest = window.speechSynthesis; Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: { speaking: false, pending: false, cancel() {}, getVoices() { return []; }, speak() {} } }); });
  const STORIES_KEPT = { 'put-beats-together': ['Peet, suh.', 'Rab, bit.'], 'clap-the-beats': ['Dye, nuh, sore.'], 'sounds-in-a-word': ['Puh, eye.', 'Shh, ooh.', 'Mmm, ooh, nnn.'], 'sound-by-sound': ['Cuh, eye, tuh.', 'Buh, oh, tuh.', 'Mmm, ooh, nnn.'], 'star-and-spoon': ['Puh, ig.'], 'dog-and-frog': ['Duh, og.'] };
  // A seed and a wrong choice whose reason says the run and is said to a pre-reader (it leaves the answer unsaid, or one choice is left).
  const reasonAt = (gen, run) => { for (let sd = 1; sd <= 120; sd++) { const q = L.generateQuestion(gen, sd); const w = q.choices.find((c) => c !== q.answer && q.whyNot && q.whyNot[c] && (q.whyNot[c].name + ' ' + q.whyNot[c].why).includes(run) && (q.choices.length === 2 || !L.whyNotNamesAnswer(q, c))); if (w) return [sd, w]; } return [0, null]; };
  const REASONS_KEPT = [['p4-beats-yesno', 'Rab, bit.'], ['p4-beats-blend', 'Um, brel, luh.'], ['p4-part-blend', 'Lll, og.']].map(([g, run]) => [g, run, ...reasonAt(g, run)]);
  // The spans read, as a floor at the count the code has (81 in pass NC: round two's code and screen read counted 81 in each theme, six
  // stories and three reasons at three widths, and the lead's run the same), so a run that stops being kept is caught even where no
  // story or reason above names it.
  const KEPT_FLOOR = 81;
  const off = []; let spans = 0; let screens = 0; let plantBroken = null; let plantGone = null;
  const plants = async (run) => {
    if (plantBroken === null) { plantBroken = await page.evaluate(() => { const s = [...document.querySelectorAll('[data-whole]')].find((x) => x.offsetParent !== null); if (!s) return null; const br = document.createElement('br'); br.setAttribute('data-plant-br', ''); s.insertBefore(br, s.lastChild); return true; }); plantBroken = !!plantBroken && (await keptRead()).broken.length > 0; await page.evaluate(() => { const b = document.querySelector('[data-plant-br]'); if (b) b.remove(); }); }
    if (plantGone === null) { const set = await page.evaluate((t) => { const s = [...document.querySelectorAll('[data-whole]')].find((x) => x.offsetParent !== null && x.textContent === t); if (!s) return false; const tx = document.createTextNode(s.textContent); s.replaceWith(tx); window.__plantKept = [s, tx]; return true; }, run); plantGone = set && runOff(await keptRead(), run);
      // The span goes back where it was, since React still holds it and the next screen's draw would fail on a page it no longer matches.
      await page.evaluate(() => { const k = window.__plantKept; if (k) { k[1].replaceWith(k[0]); delete window.__plantKept; } }); } };
  for (const width of [320, 375, 390]) {
    await page.setViewportSize({ width, height: 800 });
    for (const [id, runs] of Object.entries(STORIES_KEPT)) {
      await page.evaluate((m) => window.__eduTest.openStory(m), id); await screenIs('story'); await page.waitForTimeout(500);
      const r = await keptRead(); screens++; spans += r.texts.length;
      for (const x of r.broken) off.push(`${width} ${id}: "${x}" broken`); for (const x of r.outside) off.push(`${width} ${id}: "${x}" past its paragraph`);
      for (const run of runs) if (runOff(r, run)) off.push(`${width} ${id}: "${run}" not kept everywhere it is said`);
      if (width === 320 && (plantBroken === null || plantGone === null)) await plants(runs[0]);
    }
    for (const [gen, run, sd, wrong] of REASONS_KEPT) {
      if (!sd) { off.push(`${gen}: no seed whose reason says "${run}"`); continue; }
      await show(gen, sd); await settle(); await page.locator(`button[data-choice="${wrong}"]`).click(); await page.getByRole('button', { name: 'Check answer' }).click(); await page.waitForTimeout(500);
      const r = await keptRead(); screens++; spans += r.texts.length;
      for (const x of r.broken) off.push(`${width} ${gen}: "${x}" broken in the reason`); for (const x of r.outside) off.push(`${width} ${gen}: "${x}" past its paragraph in the reason`);
      if (runOff(r, run)) off.push(`${width} ${gen}: "${run}" not kept everywhere it is said, the reason included`);
      await tapIf('Try again');
    }
  }
  await page.evaluate(() => { Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: window.__voiceBeforeRest }); delete window.__voiceBeforeRest; });
  ok(`a run kept whole stays whole and inside its paragraph at rest, in six stories' paragraphs and in three banks' reasons after a wrong tap, at 320, 375 and 390 pixels wide, and the runs they say are kept wherever they are said (pass NC, round one's screen check; ${screens} screens, ${spans} spans read; a kept span broken and a run's span taken away, planted, caught)`, off.length === 0 && screens === 27 && spans >= KEPT_FLOOR && plantBroken === true && plantGone === true, { off: off.slice(0, 8), screens, spans, plantBroken, plantGone });
  await page.setViewportSize({ width: 1280, height: 900 }); }
// 13. EARMARKS A72 decided (pass NC, round one's screen check): at 320 by 568, before a pick, the scroll cue shows on a question exactly
//    when more than a third of its last answer is below the screen (32 of 2,412 question screens there had nothing pointing down), read on
//    the three banks the screen check named at seeds 1 to 6; and under 360 pixels the practice title is fitted in the room its row leaves
//    it, one line at 15 pixels or more where it fits at 15 (a title took two lines in 142 banks at 320), read at 320 and 340 (since round
//    two's code read, which found the title never shrank and pushed the speaker off the screen). Its plants: a cue put on a question whose
//    last answer is hidden by less than a third, the cue's mark taken off one more than a third hidden, a title let wrap at 18 pixels, and
//    the old fit, each caught.
{ await page.setViewportSize({ width: 320, height: 568 });
  const cueNow = () => page.evaluate(() => { const last = document.querySelector('[data-choice-last]'); if (!last) return null; const r = last.getBoundingClientRect(); return { hid: Math.max(0, Math.min(r.height, r.bottom - window.innerHeight)) / r.height, cue: !!document.querySelector('[data-scroll-cue]') }; });
  const cueWrong = (c) => !c || (c.cue && c.hid < 1 / 3 - 0.02) || (!c.cue && c.hid > 1 / 3 + 0.02);
  const cueOff = []; let read = 0; let shown = 0; let plantFake = null; let plantGone = null;
  for (const g of ['p4-vfs-sound', 'p4-tell-tells', 'p4-learn-not-rhyme']) for (let sd = 1; sd <= 6; sd++) {
    await show(g, sd); await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(500); const c = await cueNow(); read++;
    if (c && c.cue) shown++; if (cueWrong(c)) cueOff.push(`${g} seed ${sd}: ${c ? Math.round(c.hid * 100) + '% of the last answer hidden, the cue ' + (c.cue ? 'shown' : 'missing') : 'no last answer marked'}`);
    if (plantFake === null && c && !c.cue && c.hid < 1 / 3 - 0.02) { await page.evaluate(() => { const b = document.createElement('button'); b.setAttribute('data-scroll-cue', ''); b.setAttribute('data-plant', ''); document.body.appendChild(b); }); plantFake = cueWrong(await cueNow()); await page.evaluate(() => { const b = document.querySelector('[data-plant]'); if (b) b.remove(); }); }
    if (plantGone === null && c && c.cue && c.hid > 1 / 3 + 0.02) { await page.evaluate(() => { const b = document.querySelector('[data-scroll-cue]'); if (b) { b.removeAttribute('data-scroll-cue'); b.setAttribute('data-plant-cue', ''); } }); plantGone = cueWrong(await cueNow()); await page.evaluate(() => { const b = document.querySelector('[data-plant-cue]'); if (b) { b.removeAttribute('data-plant-cue'); b.setAttribute('data-scroll-cue', ''); } }); }
  }
  ok(`at 320 by 568, before a pick, the scroll cue shows exactly when more than a third of the last answer is below the screen (pass NC, EARMARKS A72; ${read} questions of three banks read, the cue on ${shown}; a cue put on a question whose last answer is hidden by less than a third, and one taken off a last answer more than a third hidden, caught)`, cueOff.length === 0 && read === 18 && shown >= 1 && plantFake === true && plantGone === true, { cueOff, shown, plantFake, plantGone });
  const prek = L.COURSES.filter((c) => /^PK/.test(c.grade) && c.readAloud).flatMap((c) => c.modules).filter((m) => (m.generators || []).length);
  const longest = [...prek].sort((a, b) => L.titleCase(b.title).length - L.titleCase(a.title).length).slice(0, 8);
  // Since round two's code read: under 360 pixels the title is fitted in the room its row leaves it, one line at 15 pixels or more where
  // it fits at 15 and wrapped at 15 where it does not (three titles take three lines at 320), inside its row, clear of the speaker, the
  // speaker inside the screen (in a plain
  // auto column FitText measured the title's own width, never shrank it, and pushed the speaker off the screen on 238 of 712 titles at
  // 320). Read at 320 and 340 on the eight pre-K lessons and the eight lessons of any course with the longest titles, drawn by the screen,
  // and on every module title written into the row and fitted as FitText fits it, the copy checked against FitText's own; the old fit,
  // which measured the title's own column in the old auto column, planted, caught.
  const allMods = L.COURSES.flatMap((c) => c.modules).filter((m) => (m.generators || []).length);
  const longAll = [...allMods].sort((a, b) => L.titleCase(b.title).length - L.titleCase(a.title).length).slice(0, 8);
  const drawnMods = [...new Map([...longest, ...longAll].map((m) => [m.id, m])).values()];
  const titleBox = () => page.evaluate(() => { const row = document.querySelector('[data-title-row]'); const p = row && row.querySelector('p'); const sp = row && row.querySelector('button'); const s = p && p.querySelector('[data-fit-text]'); if (!s || !sp) return null;
    const rg = document.createRange(); rg.selectNodeContents(s); const rs = [...rg.getClientRects()]; const rr = row.getBoundingClientRect(); const sr = sp.getBoundingClientRect(); const cs = getComputedStyle(row); const ss = getComputedStyle(s);
    const room = row.clientWidth - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0) - 2 * (44 + 8);
    const probe = document.createElement('span'); probe.style.cssText = 'position:absolute;left:-9999px;top:0;visibility:hidden;white-space:nowrap;font-size:15px'; probe.style.fontFamily = ss.fontFamily; probe.style.fontWeight = ss.fontWeight; probe.style.letterSpacing = ss.letterSpacing; probe.textContent = s.textContent; document.body.appendChild(probe); const at15 = probe.getBoundingClientRect().width; probe.remove();
    const fs = parseFloat(ss.fontSize); const lh = parseFloat(ss.lineHeight) || fs * 1.2; const l = Math.min(...rs.map((r) => r.left)); const rt = Math.max(...rs.map((r) => r.right));
    // The lines its words need at 15 pixels in the room, wrapped as FitText wraps (since the third read: a wrapped title is held to them).
    const wrap15 = document.createElement('span'); wrap15.style.cssText = `position:absolute;left:-9999px;top:0;visibility:hidden;display:block;white-space:normal;overflow-wrap:anywhere;font-size:15px;width:${room}px`; wrap15.style.fontFamily = ss.fontFamily; wrap15.style.fontWeight = ss.fontWeight; wrap15.style.letterSpacing = ss.letterSpacing; wrap15.style.lineHeight = ss.lineHeight; wrap15.textContent = s.textContent; document.body.appendChild(wrap15); const need = Math.round(wrap15.getBoundingClientRect().height / (parseFloat(ss.lineHeight) || 15 * 1.2)); wrap15.remove();
    return { fs, lines: Math.round((s.getBoundingClientRect().height / lh) * 10) / 10, need, fitsAt15: at15 <= room + 0.5, inRow: l >= rr.left - 1 && rt <= rr.right + 1, clear: rt <= sr.left + 1, speakerIn: sr.left >= -1 && sr.right <= window.innerWidth + 1 }; });
  const titleWrong = (b) => !b || b.fs < 15 - 0.01 || !b.inRow || !b.clear || !b.speakerIn || (b.fitsAt15 ? b.lines > 1.4 : b.lines < 1.6 || b.lines > b.need + 0.4 || b.fs > 15.01);
  const fitAll = (list, oldFit) => page.evaluate(([ts, old]) => { const row = document.querySelector('[data-title-row]'); const p = row && row.querySelector('p'); const sp = row && row.querySelector('button'); const span = p && p.querySelector('[data-fit-text]'); if (!span || !sp) return null;
    const was = span.textContent; const wasSpan = span.getAttribute('style'); const wasRow = row.style.gridTemplateColumns; const wasP = p.style.minWidth;
    if (old) { row.style.gridTemplateColumns = 'minmax(44px, 1fr) auto minmax(44px, 1fr)'; p.style.minWidth = ''; }
    const roomNow = () => { const host = old ? p : row; const cs = getComputedStyle(host); return host.clientWidth - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0) - (old ? 0 : 2 * (44 + 8)); };
    const fit = () => { const room = roomNow(); span.style.whiteSpace = 'nowrap'; let f = 18; span.style.fontSize = `${f}px`; while (f > 15 && span.scrollWidth > room + 0.5) { f -= 0.5; span.style.fontSize = `${f}px`; }
      const tooWide = span.scrollWidth > room + 0.5; span.style.whiteSpace = tooWide ? 'normal' : 'nowrap'; span.style.overflowWrap = tooWide ? 'anywhere' : 'normal'; return { f, tooWide }; };
    let mirror = null; if (!old) { const drew = { f: parseFloat(span.style.fontSize), tooWide: span.style.whiteSpace === 'normal' }; const mine = fit(); mirror = mine.f === drew.f && mine.tooWide === drew.tooWide; span.setAttribute('style', wasSpan); }
    const bad = []; let wrapped = 0;
    for (const t of ts) { span.textContent = t; if (fit().tooWide) wrapped++; const rg = document.createRange(); rg.selectNodeContents(span); const rs = [...rg.getClientRects()]; const rr = row.getBoundingClientRect(); const sr = sp.getBoundingClientRect();
      const l = Math.min(...rs.map((r) => r.left)); const rt = Math.max(...rs.map((r) => r.right)); if (l < rr.left - 1 || rt > rr.right + 1 || rt > sr.left + 1 || sr.left < -1 || sr.right > window.innerWidth + 1) bad.push(t); }
    span.textContent = was; span.setAttribute('style', wasSpan); row.style.gridTemplateColumns = wasRow; p.style.minWidth = wasP;
    return { read: ts.length, bad: bad.length, first: bad.slice(0, 3), wrapped, mirror }; }, [list, oldFit]);
  const titles = [...new Set(allMods.map((m) => L.titleCase(m.title)))];
  const titleOff = []; let plantWrap = null; let plantTall = null; let drawn = 0; const wrappedDrawn = []; const fitted = []; let plantOld = null;
  for (const w of [320, 340]) {
    await page.setViewportSize({ width: w, height: 568 });
    for (const m of drawnMods) {
      await show(m.generators[0], 1, m.id); await page.waitForTimeout(300); const b = await titleBox(); drawn++;
      if (titleWrong(b)) titleOff.push(`${w} ${m.id}: ${JSON.stringify(b)}`); else if (!b.fitsAt15) wrappedDrawn.push(`${w} ${m.id}`);
      // Its plants, each read by titleWrong itself and put back: a title that fits at 15 let wrap at 18 pixels, and a wrapped title squeezed
      // to more lines than its words need.
      const plantSpan = async (css) => { await page.evaluate((c) => { const sp = document.querySelector('[data-title-row] [data-fit-text]'); sp.dataset.plantWas = sp.getAttribute('style'); Object.assign(sp.style, c); }, css); const w2 = titleWrong(await titleBox()); await page.evaluate(() => { const sp = document.querySelector('[data-title-row] [data-fit-text]'); sp.setAttribute('style', sp.dataset.plantWas); delete sp.dataset.plantWas; }); return w2; };
      if (plantWrap === null && b && b.fitsAt15) plantWrap = await plantSpan({ whiteSpace: 'normal', fontSize: '18px', width: '120px' });
      if (plantTall === null && b && !b.fitsAt15) plantTall = await plantSpan({ width: '60px' });
    }
    fitted.push({ w, ...(await fitAll(titles, false)) });
    if (plantOld === null) { const o = await fitAll(titles, true); plantOld = !!o && o.bad > 0 ? o.bad : false; }
  }
  ok(`under 360 pixels the practice title is fitted in the room its row leaves it, one line at 15 pixels or more where it fits at 15 and wrapped at 15 where it does not, inside its row and clear of the speaker, the speaker inside the screen, at 320 and 340 pixels (pass NC, EARMARKS A72 and round two's code read; ${drawnMods.length} lessons with the longest titles drawn by the screen at each width, ${drawnMods.length * 2 - wrappedDrawn.length - titleOff.length} of those on one line; all ${titles.length} module titles fitted as FitText fits them, ${fitted.map((x) => x.wrapped + ' wrapped at ' + x.w).join(' and ')}, the copy of the fit matching FitText's own; a title let wrap at 18 pixels and a wrapped title squeezed to more lines than its words need caught, and the old fit, which measured the title's own column, planted, caught on ${plantOld} titles at 320)`,
    titleOff.length === 0 && drawn === drawnMods.length * 2 && drawnMods.length === 16 && plantWrap === true && plantTall === true && fitted.length === 2 && fitted.every((x) => x.read === titles.length && x.bad === 0 && x.mirror === true) && typeof plantOld === 'number' && plantOld > 0,
    { titleOff: titleOff.slice(0, 6), wrappedDrawn, fitted, plantWrap, plantTall, plantOld });
  await page.setViewportSize({ width: 1280, height: 900 }); }
// 14. EARMARKS A88's browser check (pass ND, the screen read): in a lesson on a tablet (820 by 1180) and a laptop (1280 by 800), in both
//    themes, a drawing beside its group of dots grows as two drawings do, where it had kept a phone's size: Sound by sound's coat beside
//    its three dots (line 9) draws at least 0.8 of the coat alone on line 8 (0.85 is a pair's own share), and each dot at least 1.4 times
//    its size on a phone in the same theme (they grow 1.69 to 1.87 times on a tablet, round two's code read found, more than the lesson's
//    scale of 1.45 this line once gave as the bar's reason, so the bar holds with room); on a phone (390 by 844) the coat keeps the size it had. Since
//    round one's screen read each dot is read as its own circle, since the dots' svg keeps its height while the drawing in it shrinks (it
//    read 45 pixels or more where a dot was 42.9 across in the dark theme on a tablet), and every read must be a number (a null passed the
//    phone's bounds). Its plants: the coat beside its dots drawn at the old share, and since round one the tablet's dots drawn at a phone's
//    size and the phone's coat drawn at the tablet's share, each caught.
{ const sizes = (pg) => pg.evaluate(() => { const svgs = [...document.querySelectorAll('svg')].filter((s) => !s.closest('button') && !s.closest('[data-lesson-nav]') && s.getBoundingClientRect().height > 20 && s.getBoundingClientRect().width > 20 && s.getBoundingClientRect().height < window.innerHeight * 0.6);
    const pair = document.querySelector('[data-pair]'); const inPair = pair ? svgs.filter((s) => pair.contains(s) && !/dots$/.test(s.getAttribute('aria-label') || '')) : [];
    const circles = pair ? [...pair.querySelectorAll('svg[aria-label$="dots"] circle')].map((c) => c.getBoundingClientRect().width) : [];
    return { alone: pair ? null : Math.max(0, ...svgs.map((s) => s.getBoundingClientRect().height)), drawing: inPair.length ? Math.round(inPair[0].getBoundingClientRect().height) : null, dots: circles.length ? +Math.max(...circles).toFixed(1) : null }; });
  const read = []; const phoneDots = {}; let plant = null; let plantDots = null; let plantPhone = null;
  for (const theme of ['light', 'dark']) for (const [w, h] of [[390, 844], [820, 1180], [1280, 800]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: true, reducedMotion: 'reduce' });
    await ctx.addInitScript((t) => { try { localStorage.setItem('edusphere_v1_theme', t); } catch (e) { /* none */ } }, theme);
    const pg = await ctx.newPage(); await pg.goto(new URL('./page.html', import.meta.url).href);
    const isScreen = (n) => pg.waitForFunction((x) => window.__eduTest && window.__eduTest.screen === x, n, { timeout: 15000 });
    const tap = async (name) => { const b = pg.getByRole('button', { name, exact: true }); if (await b.count()) { await b.first().click({ force: true }); await pg.waitForTimeout(250); } };
    await isScreen('welcome'); await pg.getByRole('button', { name: 'Create account', exact: true }).first().click(); await isScreen('educator-setup');
    await pg.fill('input[placeholder="PIN"]', '2468'); await pg.fill('input[placeholder="PIN again"]', '2468'); await pg.fill('input[placeholder="This device\'s name"]', 'Pairs'); await pg.selectOption('select[aria-label="Your state"]', 'TX');
    await pg.getByRole('button', { name: 'Create account', exact: true }).click(); await isScreen('educator-pick'); await pg.waitForTimeout(400);
    for (const n of ['Skip tour', 'Later', 'Got it']) await tap(n);
    await pg.getByLabel('Walk through early years').first().click({ force: true }); await isScreen('overview'); await pg.waitForTimeout(300);
    await pg.evaluate(() => window.__eduTest.openModule('sound-by-sound')); await pg.waitForTimeout(600);
    const next = async () => { await pg.locator('[data-lesson-nav] button[aria-label="Next"]').first().click({ force: true }); await pg.waitForTimeout(350); };
    for (let i = 1; i < 8; i++) await next();
    const alone = (await sizes(pg)).alone; await next(); const beside = await sizes(pg);
    read.push({ theme, w, alone: Math.round(alone), drawing: beside.drawing, dots: beside.dots });
    if (w === 390) phoneDots[theme] = beside.dots;
    await pg.evaluate(() => { window.__coat = () => [...document.querySelector('[data-pair]').querySelectorAll('svg')].find((x) => !/dots$/.test(x.getAttribute('aria-label') || '')); });
    // The coat at its old share on a tablet, caught.
    if (plant === null && w === 820) { await pg.evaluate(() => { const s = window.__coat(); window.__was = s.getAttribute('style') || ''; s.style.height = (s.getBoundingClientRect().height * (94 / 136)) + 'px'; });
      const pr = await sizes(pg); plant = pr.drawing < 0.8 * alone; await pg.evaluate(() => { const s = window.__coat(); s.setAttribute('style', window.__was); delete window.__was; }); }
    // The tablet's dots drawn at the phone's size in the same theme, caught.
    if (plantDots === null && w === 820 && phoneDots[theme]) { const set = await pg.evaluate((target) => { const s = document.querySelector('[data-pair] svg[aria-label$="dots"]'); const c = s && s.querySelector('circle'); if (!c) return false; window.__was = s.getAttribute('style') || ''; const cs = getComputedStyle(s); const d = c.getBoundingClientRect().width; s.style.width = (parseFloat(cs.width) * target / d) + 'px'; s.style.height = (parseFloat(cs.height) * target / d) + 'px'; return true; }, phoneDots[theme]);
      const pr = await sizes(pg); plantDots = set && !(pr.dots >= 1.4 * phoneDots[theme]); await pg.evaluate(() => { const s = document.querySelector('[data-pair] svg[aria-label$="dots"]'); s.setAttribute('style', window.__was); delete window.__was; }); }
    // The phone's coat drawn at the tablet's share of the coat alone, caught.
    if (plantPhone === null && w === 390) { await pg.evaluate((a) => { const s = window.__coat(); window.__was = s.getAttribute('style') || ''; const r = s.getBoundingClientRect(); const cs = getComputedStyle(s); const f = (a * 0.85) / r.height; s.style.height = (parseFloat(cs.height) * f) + 'px'; s.style.width = (parseFloat(cs.width) * f) + 'px'; }, alone);
      const pr = await sizes(pg); plantPhone = !(pr.drawing <= 0.8 * alone); await pg.evaluate(() => { const s = window.__coat(); s.setAttribute('style', window.__was); delete window.__was; }); }
    await ctx.close();
  }
  const num = (x) => typeof x === 'number' && x > 0; const grown = read.filter((x) => x.w >= 820); const phone = read.filter((x) => x.w === 390);
  ok(`in a lesson on a tablet and a laptop, in both themes, a drawing beside its group of dots grows as two drawings do: Sound by sound's coat beside its three dots draws at least 0.8 of the coat alone, each dot at least 1.4 times its size on a phone, and on a phone the coat keeps its size (pass ND, EARMARKS A88; ${read.map((x) => x.theme + ' ' + x.w + ': ' + x.drawing + ' of ' + x.alone + ', dots ' + x.dots).join('; ')}; the coat at its old share, the tablet's dots at a phone's size and the phone's coat at a tablet's share, planted, caught)`,
    read.length === 6 && read.every((x) => num(x.alone) && num(x.drawing) && num(x.dots)) && grown.every((x) => x.drawing >= 0.8 * x.alone && x.dots >= 1.4 * phoneDots[x.theme]) && phone.every((x) => x.drawing <= 0.8 * x.alone) && plant === true && plantDots === true && plantPhone === true, { read, plant, plantDots, plantPhone }); }
// 15. Round one's screen read (pass ND), in both themes. Writing as print stays on one line, inside its box, in every line of the two
//    spacing lessons at 320 by 568, on the question screen of every spacing bank at seeds 1 to 3 and in its More Info sheet at 320 and 390
//    pixels wide (print broke "I see the / big bus." in More Info's 240-pixel picture box, and five sentences at 320 in the dark theme). One letter beside a drawing in a lesson grows
//    with it on a tablet and a laptop, the letter 1.4 times its 44 pixels or more and the drawing at least 0.8 of a lone drawing's size,
//    while a phone keeps both (the jar beside J drew 94 pixels on a tablet, a phone's size). A Wonder prompt never splits a hyphenated word
//    at 320 to 412 pixels (grown-up broke as "grown- / up"). Its plants: More Info's picture box set 64 pixels wide, a lesson's print set
//    in a 64-pixel box, the letter set back to 44 pixels, and grown-up let break, each caught. Since round two's code read: the letter is
//    read as drawn, the box of its text against the phone's drawn letter in the same theme, where its font size had been read (the pair
//    draws at 0.85, so 64 pixels is drawn 54.4, and the plant set the very size the read read), with a transform the font size cannot see
//    planted; the print read's floors are the counts the code has (70 lesson prints, 204 on questions, 68 in 40 sheets), and a print kept
//    on one line but set past its box is planted for that bound alone; and the cards a pre-reader meets after a Wonder question, its voices
//    and its closing card with the question above them, keep a hyphenated word whole too (a voice card broke "a grown- / up can help you"
//    at 320), with a voice card's hyphenated word let break, planted. Since the third read a reader's screens too: grade 2's courses are
//    not read aloud and meet early questions, whose options printed bare ("A hug from a grown- / up" at 320), so the question with its
//    options and the voices with the closing card are read at the six widths in both themes, an option's word and a voice's let break.
{ const openAs = async (theme, w, h) => {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: true, reducedMotion: 'reduce' });
    await ctx.addInitScript((t) => { try { localStorage.setItem('edusphere_v1_theme', t); } catch (e) { /* none */ } }, theme);
    const pg = await ctx.newPage(); await pg.goto(new URL('./page.html', import.meta.url).href);
    const isScreen = (n) => pg.waitForFunction((x) => window.__eduTest && window.__eduTest.screen === x, n, { timeout: 15000 });
    const tap = async (name) => { const b = pg.getByRole('button', { name, exact: true }); if (await b.count()) { await b.first().click({ force: true }); await pg.waitForTimeout(250); } };
    await isScreen('welcome'); await pg.getByRole('button', { name: 'Create account', exact: true }).first().click(); await isScreen('educator-setup');
    await pg.fill('input[placeholder="PIN"]', '2468'); await pg.fill('input[placeholder="PIN again"]', '2468'); await pg.fill('input[placeholder="This device\'s name"]', 'Round one'); await pg.selectOption('select[aria-label="Your state"]', 'TX');
    await pg.getByRole('button', { name: 'Create account', exact: true }).click(); await isScreen('educator-pick'); await pg.waitForTimeout(400);
    for (const n of ['Skip tour', 'Later', 'Got it']) await tap(n);
    await pg.getByLabel('Walk through early years').first().click({ force: true }); await isScreen('overview'); await pg.waitForTimeout(300);
    return { ctx, pg, isScreen }; };
  const toLine = async (pg, mod, n) => { await pg.evaluate((m) => window.__eduTest.openModule(m), mod); await pg.waitForTimeout(600); for (let i = 1; i < n; i++) { await pg.locator('[data-lesson-nav] button[aria-label="Next"]').first().click({ force: true }); await pg.waitForTimeout(260); } };
  // Every [data-print] in scope: its fitted words on one line, and not past its box.
  const printRead = (pg, scope) => pg.evaluate((sc) => { const out = { n: 0, faults: [] }; for (const p of document.querySelectorAll(sc + ' [data-print]')) { const t = p.querySelector('[data-fit-text]') || p; const cs = getComputedStyle(t); const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.25; const lines = Math.round(t.getBoundingClientRect().height / lh); out.n += 1;
    if (lines !== 1) out.faults.push(`"${t.textContent}" on ${lines} lines`); if (t.scrollWidth > p.clientWidth + 0.5) out.faults.push(`"${t.textContent}" past its box`); } return out; }, scope);
  const faults = []; let lessonPrints = 0; let sheetPrints = 0; let sheets = 0; let questionPrints = 0; let plantSheet = null; let plantLesson = null; let plantPast = null;
  const SPACE = L.getModule('space-between-words').generators.concat(L.getModule('spaces-between-words').generators);
  for (const theme of ['light', 'dark']) {
    const { ctx, pg, isScreen } = await openAs(theme, 320, 568);
    for (const mod of ['space-between-words', 'spaces-between-words']) { await toLine(pg, mod, 1);
      for (let i = 1; i <= 14; i++) { const r = await printRead(pg, '#root'); lessonPrints += r.n; for (const f of r.faults) faults.push(`${theme} ${mod} line ${i}: ${f}`);
        if (plantLesson === null && r.n > 0) { await pg.evaluate(() => { const p = document.querySelector('[data-print]'); window.__was = p.parentElement.getAttribute('style') || ''; p.parentElement.style.width = '64px'; }); await pg.waitForTimeout(250); plantLesson = (await printRead(pg, '#root')).faults.length > 0; await pg.evaluate(() => { const p = document.querySelector('[data-print]'); p.parentElement.setAttribute('style', window.__was); delete window.__was; }); await pg.waitForTimeout(150); }
        // The past-its-box bound alone (round two's code read): every print kept on one line and set too large for its box, caught as past
        // its box and on no line count, since each plant above is caught by the line count.
        if (plantPast === null && r.n > 0) { const tag = await pg.addStyleTag({ content: '[data-print] [data-fit-text] { white-space: nowrap !important; font-size: 60px !important; line-height: normal !important; }' }); await pg.waitForTimeout(200);
          const pr = await printRead(pg, '#root'); plantPast = pr.faults.some((f) => f.endsWith('past its box')) && !pr.faults.some((f) => / on \d+ lines$/.test(f)); await tag.evaluate((n) => n.remove()); await pg.waitForTimeout(250); }
        const nx = pg.locator('[data-lesson-nav] button[aria-label="Next"]'); if (i === 14 || !(await nx.count())) break; await nx.first().click({ force: true }); await pg.waitForTimeout(260); } }
    // More Info at 320, then 390: a right answer, Check answer, the More Info link, and every print in its sheet.
    for (const width of [320, 390]) { await pg.setViewportSize({ width, height: 800 });
      for (const g of SPACE) { for (const seed of [3, 2, 1]) { await pg.evaluate(([x, s]) => window.__eduTest.showQuestion(x, s), [g, seed]); await isScreen('practice'); await pg.waitForTimeout(450);
          const r = await printRead(pg, '#root'); questionPrints += r.n; if (!r.n) faults.push(`${theme} ${width} ${g} seed ${seed}: no print on the question`); for (const f of r.faults) faults.push(`${theme} ${width} ${g} seed ${seed}: ${f}`); }
        const qq = await pg.evaluate(() => window.__eduTest.question); await pg.locator(`button[data-choice="${qq.answer.replace(/"/g, '\\"')}"]`).click(); await pg.getByRole('button', { name: 'Check answer' }).click(); await pg.waitForTimeout(400);
        const link = pg.locator('[data-more-info-link]'); if (!(await link.count())) { faults.push(`${theme} ${width} ${g}: no More Info`); continue; } await link.click(); await pg.waitForTimeout(400); sheets += 1;
        const r = await printRead(pg, '[data-more-info]'); sheetPrints += r.n; if (!r.n) faults.push(`${theme} ${width} ${g}: no print in More Info`); for (const f of r.faults) faults.push(`${theme} ${width} ${g}: ${f}`);
        if (plantSheet === null && width === 320 && theme === 'light') { const set = await pg.evaluate(() => { const b = document.querySelector('[data-more-info] [data-more-info-picture]'); if (!b || !b.querySelector('[data-print]') || b.querySelector('[data-print]').textContent.trim().length < 12) return false; window.__was = b.getAttribute('style') || ''; b.style.maxWidth = '64px'; return true; }); if (set) { await pg.waitForTimeout(250); plantSheet = (await printRead(pg, '[data-more-info]')).faults.length > 0; await pg.evaluate(() => { const b = document.querySelector('[data-more-info] [data-more-info-picture]'); b.setAttribute('style', window.__was); delete window.__was; }); } }
        await pg.keyboard.press('Escape'); await pg.waitForTimeout(250); } }
    await ctx.close(); }
  ok(`writing as print stays on one line, inside its box, in every line of the two spacing lessons at 320 by 568 and in More Info for every spacing bank at 320 and 390 pixels wide, in both themes (pass ND, round one's screen read; ${lessonPrints} lesson prints, ${questionPrints} on questions, ${sheets} sheets with ${sheetPrints} prints; More Info's picture box at 64 pixels and a lesson's print in a 64-pixel box, planted, caught, and since round two's code read a print on one line past its box, planted, caught)`,
    faults.length === 0 && lessonPrints >= 70 && questionPrints >= 204 && sheets === 4 * SPACE.length && sheetPrints >= 68 && plantSheet === true && plantLesson === true && plantPast === true, { faults: faults.slice(0, 8), lessonPrints, questionPrints, sheets, sheetPrints, plantSheet, plantLesson, plantPast });
  // One letter beside a drawing: Letters and sounds' line 7 (S beside the sun) against line 4's lone moon.
  const letterRead = (pg) => pg.evaluate(() => { const pair = document.querySelector('[data-pair]'); const svgs = [...document.querySelectorAll('svg')].filter((s) => !s.closest('button') && !s.closest('[data-lesson-nav]') && s.getBoundingClientRect().height > 20 && s.getBoundingClientRect().height < window.innerHeight * 0.6);
    if (!pair) return { alone: Math.round(Math.max(0, ...svgs.map((s) => s.getBoundingClientRect().height))) };
    const p = [...pair.querySelectorAll('p')].find((x) => /^[A-Z]$/.test(x.textContent.trim())); const d = svgs.find((s) => pair.contains(s));
    // The letter as drawn (round two's code read): the box of its text, which every scale and transform above it reaches, where its font size
    // sees none of them.
    let drawn = null; if (p) { const rg = document.createRange(); rg.selectNodeContents(p); drawn = +rg.getBoundingClientRect().height.toFixed(1); }
    return { letter: p ? parseFloat(getComputedStyle(p).fontSize) : null, drawn, drawing: d ? Math.round(d.getBoundingClientRect().height) : null }; });
  const letters = []; let plantLetter = null; let plantScale = null; const phoneDrawn = {};
  for (const theme of ['light', 'dark']) for (const [w, h] of [[390, 844], [820, 1180], [1280, 800]]) {
    const { ctx, pg } = await openAs(theme, w, h); await toLine(pg, 'letters-and-sounds', 4); const alone = (await letterRead(pg)).alone;
    for (let i = 4; i < 7; i++) { await pg.locator('[data-lesson-nav] button[aria-label="Next"]').first().click({ force: true }); await pg.waitForTimeout(300); }
    const r = await letterRead(pg); letters.push({ theme, w, alone, ...r }); if (w === 390) phoneDrawn[theme] = r.drawn;
    if (plantLetter === null && w === 820 && phoneDrawn[theme]) { await pg.evaluate(() => { const p = [...document.querySelector('[data-pair]').querySelectorAll('p')].find((x) => /^[A-Z]$/.test(x.textContent.trim())); window.__was = p.style.fontSize; p.style.fontSize = '44px'; }); const pr = await letterRead(pg); plantLetter = !(pr.drawn >= 1.4 * phoneDrawn[theme]); await pg.evaluate(() => { const p = [...document.querySelector('[data-pair]').querySelectorAll('p')].find((x) => /^[A-Z]$/.test(x.textContent.trim())); p.style.fontSize = window.__was; delete window.__was; }); }
    // A transform the font size cannot see (round two's code read), the letter drawn at 0.8 of its size, caught, its font size unchanged.
    if (plantScale === null && w === 820 && phoneDrawn[theme]) { await pg.evaluate(() => { const p = [...document.querySelector('[data-pair]').querySelectorAll('p')].find((x) => /^[A-Z]$/.test(x.textContent.trim())); window.__was = p.style.transform; p.style.transform = 'scale(0.8)'; }); const pr = await letterRead(pg); plantScale = pr.letter === r.letter && !(pr.drawn >= 1.4 * phoneDrawn[theme]); await pg.evaluate(() => { const p = [...document.querySelector('[data-pair]').querySelectorAll('p')].find((x) => /^[A-Z]$/.test(x.textContent.trim())); p.style.transform = window.__was; delete window.__was; }); }
    await ctx.close(); }
  const big = letters.filter((x) => x.w >= 820); const small = letters.filter((x) => x.w === 390);
  ok(`one letter beside a drawing in a lesson grows with it on a tablet and a laptop, in both themes, the letter drawn 1.4 times the phone's or more and the drawing at least 0.8 of a lone drawing's size, while a phone keeps both, its letter at 44 pixels (pass ND, round one's screen read, the letter read as drawn since round two's code read; ${letters.map((x) => x.theme + ' ' + x.w + ': ' + x.letter + ' drawn ' + x.drawn + ' and ' + x.drawing + ' of ' + x.alone).join('; ')}; the letter set back to 44 pixels, and drawn at 0.8 by a transform, planted, caught)`,
    letters.length === 6 && letters.every((x) => x.alone > 0 && x.letter > 0 && x.drawn > 0 && x.drawing > 0) && big.every((x) => phoneDrawn[x.theme] > 0 && x.drawn >= 1.4 * phoneDrawn[x.theme] && x.drawing >= 0.8 * x.alone) && small.every((x) => x.letter === 44 && x.drawing <= 0.8 * x.alone) && plantLetter === true && plantScale === true, { letters, phoneDrawn, plantLetter, plantScale });
  // A Wonder prompt's hyphenated words, whole, wherever the prompt prints.
  const HYPHENS = L.WONDER.filter((w) => w.stage === 'early' && /\S+-\S+/.test(w.prompt));
  const promptFaults = (pg, prompt) => pg.evaluate((pr) => { const out = []; const els = [...document.querySelectorAll('#root p')].filter((p) => p.textContent.trim() === pr.trim()); if (!els.length) return ['no prompt'];
    for (const el of els) { const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let n; while ((n = walker.nextNode())) for (const m of n.textContent.matchAll(/[A-Za-z]+-[A-Za-z]+/g)) { const rg = document.createRange(); rg.setStart(n, m.index); rg.setEnd(n, m.index + m[0].length); const tops = new Set([...rg.getClientRects()].map((x) => Math.round(x.top))); if (tops.size > 1) out.push(`"${m[0]}" split across two lines`); } } return out; }, prompt);
  const wonderFaults = []; let prompts = 0; let plantSplit = null;
  for (const theme of ['light', 'dark']) { const { ctx, pg, isScreen } = await openAs(theme, 375, 800);
    for (const w of HYPHENS) { await pg.evaluate((id) => window.__eduTest.openWonder(id, 'big-and-little'), w.id); await isScreen('wonder');
      for (const width of [320, 340, 360, 375, 390, 412]) { await pg.setViewportSize({ width, height: 800 }); await pg.waitForTimeout(160); prompts += 1; for (const f of await promptFaults(pg, w.prompt)) wonderFaults.push(`${theme} ${width} ${w.id}: ${f}`);
        if (plantSplit === null && width === 320) { const set = await pg.evaluate(() => { const s = document.querySelector('#root p [data-whole-word]'); if (!s) return false; window.__was = s.getAttribute('style') || ''; s.setAttribute('style', 'display: inline-block; width: 4ch; white-space: normal; word-break: break-all'); return true; }); plantSplit = set && (await promptFaults(pg, w.prompt)).some((f) => f.includes('split across')); await pg.evaluate(() => { const s = document.querySelector('#root p [data-whole-word]'); if (s) s.setAttribute('style', window.__was); delete window.__was; }); } } }
    await ctx.close(); }
  ok(`a Wonder prompt keeps a hyphenated word such as grown-up whole at 320, 340, 360, 375, 390 and 412 pixels wide in both themes (pass ND, round one's screen read; ${HYPHENS.length} early prompts, ${prompts} screens; grown-up let break, planted, caught)`, HYPHENS.length >= 5 && wonderFaults.length === 0 && prompts === HYPHENS.length * 12 && plantSplit === true, { wonderFaults: wonderFaults.slice(0, 6), prompts, plantSplit });
  // The cards a pre-reader meets after a Wonder question (round two's code read: 17 splits, "a grown- / up can help you" in a voice card at
  // 320, thank-you at 340 and 360 and hard-working in others, and a closing card at 320): every early question with a hyphenated word on a
  // card or in its question, read on its voice screens (openWonderVoices), each card that shows one, with the question above it, at the six
  // widths in both themes. Each card is checked to be the one expected before it is read, and every such card is read. Its plant: a voice
  // card's hyphenated word let break, caught.
  const HYPHEN = /[A-Za-z]+-[A-Za-z]+/;
  const CARDED = L.WONDER.filter((w) => w.stage === 'early' && (HYPHEN.test(w.prompt) || L.wonderPreReaderCards(w, 0).some((c) => HYPHEN.test(c.says || c.closing || ''))));
  const toRead = (w) => L.wonderPreReaderCards(w, 0).map((c, k) => HYPHEN.test(c.says || c.closing || '') || (k === 0 && HYPHEN.test(w.prompt)));
  const EXPECTED = CARDED.reduce((n, w) => n + toRead(w).filter(Boolean).length, 0);
  const cardFaults = (pg) => pg.evaluate(() => { const out = []; const els = [...document.querySelectorAll('[data-wonder-asked], [data-wonder-voice-card] p, [data-wonder-closing] p')]; if (els.length < 2) return ['no card'];
    for (const el of els) { const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let n; while ((n = walker.nextNode())) for (const m of n.textContent.matchAll(/[A-Za-z]+-[A-Za-z]+/g)) { const rg = document.createRange(); rg.setStart(n, m.index); rg.setEnd(n, m.index + m[0].length); const tops = new Set([...rg.getClientRects()].map((x) => Math.round(x.top))); if (tops.size > 1) out.push(`"${m[0]}" split across two lines`); } } return out; });
  const shownCard = (pg) => pg.evaluate(() => { const c = document.querySelector('[data-wonder-voice-card], [data-wonder-closing]'); return c ? c.textContent.replace(/\s+/g, ' ') : ''; });
  const cardFaultList = []; let cardsRead = 0; let cardScreens = 0; let plantCard = null;
  for (const theme of ['light', 'dark']) { const { ctx, pg, isScreen } = await openAs(theme, 375, 800);
    for (const w of CARDED) { const cards = L.wonderPreReaderCards(w, 0); const read = toRead(w); await pg.setViewportSize({ width: 375, height: 800 });
      await pg.evaluate((id) => window.__eduTest.openWonderVoices(id, 'big-and-little'), w.id); await isScreen('wonder-voices'); await pg.waitForTimeout(250);
      for (let k = 0; k < cards.length; k++) { const words = String(cards[k].says || cards[k].closing).replace(/\s+/g, ' ');
        if (!(await shownCard(pg)).includes(words)) { cardFaultList.push(`${theme} ${w.id} card ${k + 1}: not the card expected`); break; }
        if (read[k]) { cardsRead += 1;
          for (const width of [320, 340, 360, 375, 390, 412]) { await pg.setViewportSize({ width, height: 800 }); await pg.waitForTimeout(120); cardScreens += 1; for (const f of await cardFaults(pg)) cardFaultList.push(`${theme} ${width} ${w.id} card ${k + 1}: ${f}`);
            if (plantCard === null && width === 320 && cards[k].says && HYPHEN.test(cards[k].says)) { const set = await pg.evaluate(() => { const s = document.querySelector('[data-wonder-voice-card] p [data-whole-word]'); if (!s) return false; window.__was = s.getAttribute('style') || ''; s.setAttribute('style', 'display: inline-block; width: 4ch; white-space: normal; word-break: break-all'); return true; });
              plantCard = set && (await cardFaults(pg)).some((f) => f.includes('split across')); await pg.evaluate(() => { const s = document.querySelector('[data-wonder-voice-card] p [data-whole-word]'); if (s) s.setAttribute('style', window.__was); delete window.__was; }); } }
          await pg.setViewportSize({ width: 375, height: 800 }); await pg.waitForTimeout(80); }
        if (k < cards.length - 1) { await pg.getByLabel('Next', { exact: true }).first().click({ force: true }); await pg.waitForTimeout(250); } } }
    await ctx.close(); }
  ok(`the cards a pre-reader meets after a Wonder question, its voices and its closing card with the question above them, keep a hyphenated word such as grown-up whole at 320, 340, 360, 375, 390 and 412 pixels wide in both themes (pass ND, round two's code read; ${CARDED.length} early questions, ${cardsRead} cards read on ${cardScreens} screens; a voice card's hyphenated word let break, planted, caught)`,
    CARDED.length >= 25 && cardFaultList.length === 0 && cardsRead === 2 * EXPECTED && cardScreens === cardsRead * 6 && plantCard === true, { cardFaultList: cardFaultList.slice(0, 6), expected: EXPECTED, cardsRead, cardScreens, plantCard });
  // A reader's screens (the third read): grade 2's reading, numbers and writing courses are not read aloud and are dealt early Wonder
  // questions, so a reader meets the question with its options printed as buttons, and every voice with the closing card on one page.
  // Each is opened from a grade 2 lesson (vowel-teams), checked to be the question expected, and read at the six widths in both themes.
  // Its plants: an option's hyphenated word, and a reader's voice's, let break, each caught.
  const asReader = L.WONDER.filter((w) => w.stage === 'early' && (HYPHEN.test(w.prompt) || (w.answerMode === 'pick' && (w.options || []).some((o) => HYPHEN.test(o)))));
  const voicesReader = L.WONDER.filter((w) => w.stage === 'early' && ((w.perspectives || []).some((p) => HYPHEN.test(p.says)) || HYPHEN.test(w.closing || '')));
  const questionFaults = (pg) => pg.evaluate(() => { const out = []; const els = [...document.querySelectorAll('[data-wonder-question] p, [data-wonder-question] button')]; if (!els.length) return ['no question'];
    for (const el of els) { const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let n; while ((n = walker.nextNode())) for (const m of n.textContent.matchAll(/[A-Za-z]+-[A-Za-z]+/g)) { const rg = document.createRange(); rg.setStart(n, m.index); rg.setEnd(n, m.index + m[0].length); const tops = new Set([...rg.getClientRects()].map((x) => Math.round(x.top))); if (tops.size > 1) out.push(`"${m[0]}" split across two lines`); } } return out; });
  const readerFaults = []; let readerScreens = 0; let voiceScreens = 0; let plantOption = null; let plantReaderVoice = null;
  const breakIt = (sel) => `(() => { const s = document.querySelector(${JSON.stringify(sel)}); if (!s) return false; window.__was = s.getAttribute('style') || ''; s.setAttribute('style', 'display: inline-block; width: 4ch; white-space: normal; word-break: break-all'); return true; })()`;
  const mendIt = (sel) => `(() => { const s = document.querySelector(${JSON.stringify(sel)}); if (s) s.setAttribute('style', window.__was); delete window.__was; })()`;
  for (const theme of ['light', 'dark']) { const { ctx, pg, isScreen } = await openAs(theme, 375, 800);
    for (const w of asReader) { await pg.setViewportSize({ width: 375, height: 800 }); await pg.evaluate((id) => window.__eduTest.openWonder(id, 'vowel-teams'), w.id); await isScreen('wonder'); await pg.waitForTimeout(250);
      const shown = await pg.evaluate(() => ({ prompt: ((document.querySelector('[data-wonder-question] p') || {}).textContent || '').trim(), options: document.querySelectorAll('[data-wonder-question] button').length }));
      if (shown.prompt !== w.prompt.trim() || (w.answerMode === 'pick' && shown.options !== w.options.length)) { readerFaults.push(`${theme} ${w.id}: not the reader's question expected`); continue; }
      for (const width of [320, 340, 360, 375, 390, 412]) { await pg.setViewportSize({ width, height: 800 }); await pg.waitForTimeout(120); readerScreens += 1; for (const f of await questionFaults(pg)) readerFaults.push(`${theme} ${width} ${w.id} question: ${f}`);
        if (plantOption === null && width === 320 && (w.options || []).some((o) => HYPHEN.test(o))) { const set = await pg.evaluate(breakIt('[data-wonder-question] button [data-whole-word]')); plantOption = set && (await questionFaults(pg)).some((f) => f.includes('split across')); await pg.evaluate(mendIt('[data-wonder-question] button [data-whole-word]')); } } }
    for (const w of voicesReader) { await pg.setViewportSize({ width: 375, height: 800 }); await pg.evaluate((id) => window.__eduTest.openWonderVoices(id, 'vowel-teams'), w.id); await isScreen('wonder-voices'); await pg.waitForTimeout(250);
      const voices = await pg.evaluate(() => [...document.querySelectorAll('[data-wonder-voice-card] p')].map((p) => p.textContent.replace(/\s+/g, ' ')).join(' | '));
      if (!w.perspectives.every((p) => voices.includes(p.says.replace(/\s+/g, ' ')))) { readerFaults.push(`${theme} ${w.id}: not the reader's voices expected`); continue; }
      for (const width of [320, 340, 360, 375, 390, 412]) { await pg.setViewportSize({ width, height: 800 }); await pg.waitForTimeout(120); voiceScreens += 1; for (const f of await cardFaults(pg)) readerFaults.push(`${theme} ${width} ${w.id} voices: ${f}`);
        if (plantReaderVoice === null && width === 320 && w.perspectives.some((p) => HYPHEN.test(p.says))) { const set = await pg.evaluate(breakIt('[data-wonder-voice-card] p [data-whole-word]')); plantReaderVoice = set && (await cardFaults(pg)).some((f) => f.includes('split across')); await pg.evaluate(mendIt('[data-wonder-voice-card] p [data-whole-word]')); } } }
    await ctx.close(); }
  ok(`a reader's Wonder screens keep a hyphenated word such as grown-up whole at 320, 340, 360, 375, 390 and 412 pixels wide in both themes, the question with its options and the voices with the closing card (pass ND, the third read; ${asReader.length} questions on ${readerScreens} screens and ${voicesReader.length} voice pages on ${voiceScreens}; an option's word and a voice's let break, planted, caught)`,
    asReader.length >= 9 && voicesReader.length >= 30 && readerFaults.length === 0 && readerScreens === asReader.length * 12 && voiceScreens === voicesReader.length * 12 && plantOption === true && plantReaderVoice === true, { readerFaults: readerFaults.slice(0, 6), readerScreens, voiceScreens, plantOption, plantReaderVoice }); }
ok('no page errors along the way', errors.length === 0, errors);
await browser.close();
console.log(`\n${passed} passed, ${failed} failed`);
process.exitCode = failed ? 1 : 0;
