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
  await show('pm-same-animals', 11);
  const same = await page.evaluate(() => { const p = document.querySelector('.edu-paper-picture svg'); return p ? Math.round(p.getBoundingClientRect().width) : 0; });
  ok('a picture to match among picture answers keeps its old size, so the one that is the same never looks bigger (110 pixels)', same >= 100 && same <= 120, same);
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
// said on over the overview to its end), with a stand-in voice that says a sentence a second, as section 7's does.
{ await page.evaluate(() => { const q = []; let cur = null; let timer = null; window.__spoken = [];
    const next = () => { cur = q.shift() || null; if (!cur) return; const mine = cur; timer = setTimeout(() => { if (cur !== mine) return; cur = null; if (mine.onend) mine.onend({}); if (!cur) next(); }, 1000); };
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
  await page.waitForFunction(() => window.speechSynthesis.speaking, null, { timeout: 5000 }).catch(() => {});
  const page1 = await page.evaluate(() => ({ said: window.__spoken.slice(), now: window.__curText() }));
  await page.getByRole('button', { name: 'Close coloring', exact: true }).click(); await page.waitForTimeout(300);
  const page2 = await page.evaluate(() => ({ screen: window.__eduTest.screen, now: window.__curText() }));
  ok('a letter coloring page closed falls quiet at once', !!page1.now && /lower case A/.test(page1.said.join(' ')) && page2.screen !== 'coloring' && !(page2.now && page1.said.includes(page2.now)), { page1, page2 });
  await page.waitForTimeout(300);
  // Round six's code check: a letter page whose time runs out while it talks falls quiet too (the page closes itself then, so a hush
  // in Close coloring alone would leave its letters said over the overview); setColoringLeft brings the time's end near.
  // Since round eight's read the tap comes first: the page's next one-second tick after setColoringLeft(1) closes it, and a tap
  // that came after that tick would wait for a button that is gone.
  await page.evaluate(() => window.__eduTest.openColoring('letter-b')); await screenIs('coloring'); await page.waitForTimeout(200);
  await page.getByRole('button', { name: 'Say the letters again', exact: true }).click();
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
  const q = await show('p3-which-colour-four', 3); await page.waitForTimeout(2500); await page.evaluate(() => { window.__spoken = []; window.__ratesWord = []; });
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
  ok(`a pause of about a second sits between one description and the next, and none inside one (${parts} descriptions)`, parts >= 3 && pauses === parts - 1 && quick.every((g) => g < 300), gaps);
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
  // g. A run of single letters balances its rows (round three's alignment read: Big letters' last line, "A   B   C   D   E   M   S",
  //    left S alone on a row at 390 and at 768 pixels), and a lesson's Next half below a short phone's fold gets its scroll cue
  //    (the screen check: Trace a Big Letter's second line showed 24 to 32 of Next's 66 pixels at 375 by 667, with no cue).
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
  await page.setViewportSize({ width: 375, height: 667 }); await page.evaluate(() => window.__eduTest.openModule('first-letter-tracing')); await page.waitForFunction(() => window.__eduTest.screen === 'lesson'); await page.waitForTimeout(500);
  await page.getByRole('button', { name: 'Next' }).first().click(); await page.waitForTimeout(400); await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(1500);
  const cue = await page.evaluate(() => { const n = document.querySelector('[data-lesson-nav]').getBoundingClientRect(); return { navBottom: Math.round(n.bottom), vh: window.innerHeight, cue: !!document.querySelector('[data-scroll-cue]') }; });
  ok("a lesson's Next half below a short phone's fold gets the scroll cue (375 by 667)", cue.navBottom <= cue.vh || cue.cue, cue);
  // h. The cue shows while a third of the lesson's row or more is below the fold, so it never sits on a Next that is nearly whole
  //    (round four's code read: shown for any part of the row, it covered the Next of More big letters' second line, 57 of whose 66
  //    pixels showed, and a tap there scrolled instead of moving on). Every line of the three tracing lessons, from the top, in both
  //    themes, since those lines are the dark theme's (the light theme's show 65 of 66 pixels); and since round five's code read
  //    Very First Steps' four feelings, whose eighth line hides 22.5 of 66 pixels in the dark and 17 in the light, so a cue at half
  //    the row or at a quarter fails too. Next is asked for by its exact name, since the cue's own label holds "next".
  const lines = [];
  for (const theme of ['light', 'dark']) {
  if (theme === 'dark') { await page.evaluate(() => window.__eduTest.goTo('educator-pick')); await page.waitForTimeout(300); for (const n of ['Skip tour', 'Later', 'Got it']) await tapIf(n);
    await page.getByLabel('Dark theme').first().click({ force: true }); await page.waitForTimeout(400); await walk('Walk through early years'); }
  for (const mod of ['first-letter-tracing', 'more-big-letters', 'trace-straight-letters', 'four-feelings']) {
    await page.evaluate((m) => window.__eduTest.openModule(m), mod); await page.waitForFunction(() => window.__eduTest.screen === 'lesson'); await page.waitForTimeout(500);
    for (let step = 0; step < 12; step++) {
      await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(1000);
      const at = await page.evaluate(() => { const nav = document.querySelector('[data-lesson-nav]'); if (!nav) return null; const r = nav.getBoundingClientRect(); const next = [...nav.querySelectorAll('button')].pop(); const nr = next.getBoundingClientRect();
        const low = Math.min(nr.bottom, window.innerHeight) - 2; const hit = nr.top < window.innerHeight ? document.elementFromPoint(nr.left + nr.width / 2, (nr.top + low) / 2) : null;
        return { hidden: r.bottom - window.innerHeight, height: r.height, cue: !!document.querySelector('[data-scroll-cue]'), nextHit: !!hit && next.contains(hit) }; });
      if (!at) break; lines.push({ theme, mod, step, ...at, hidden: Math.round(at.hidden * 10) / 10 });
      if (!(await page.getByRole('button', { name: 'Next', exact: true }).count())) break; await page.getByRole('button', { name: 'Next', exact: true }).first().click(); await page.waitForTimeout(300); } } }
  const wrongCue = lines.filter((l) => l.cue !== (l.hidden > l.height / 3)); const covered = lines.filter((l) => !l.cue && l.hidden > 0 && !l.nextHit);
  ok("a lesson's scroll cue shows while a third of its row is below a short phone's fold, and never sits on a Next that is nearly whole (375 by 667)", lines.length >= 40 && wrongCue.length === 0 && covered.length === 0 && lines.some((l) => l.hidden > 4 && !l.cue) && lines.some((l) => l.hidden / l.height > 0.25 && l.hidden / l.height < 1 / 3 && !l.cue) && lines.some((l) => l.hidden / l.height > 1 / 3 && l.hidden / l.height < 0.5 && l.cue), { lines: lines.length, wrongCue, covered, partHidden: lines.filter((l) => l.hidden > 0).map((l) => `${l.theme} ${l.mod} ${l.step}: ${l.hidden} of ${l.height}${l.cue ? ' cue' : ''}`) });
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
    heard.push(await page.evaluate(() => ({ spoken: window.__spoken.slice(), sounds: (window.__eduSounds || []).slice() })));
    await page.evaluate(() => { window.__spoken = []; window.__eduSounds = []; });
    await page.getByRole('button', { name: 'Next', exact: true }).first().click({ force: true });
  }
  const want = [['m', 'm'], ['s', 's'], ['t'], ['f'], ['m']];
  const handed = heard.flatMap((h) => h.spoken).join(' | ');
  ok("First sounds' first five lines play each sound in its place and hand the voice no sss, fff, mmm, tuh or word where a sound goes (pass MO, Q51)", heard.every((h, i) => JSON.stringify(h.sounds) === JSON.stringify(want[i])) && !/\b(s{3,}|f{3,}|m{3,}|tuh)\b/i.test(handed) && !/(start with|starts with|the sound) (moon|sun|fish)/i.test(handed) && /Tap and top both start with the same sound/.test(handed), heard);
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
  const LINES = { 'big-and-small': [0, 1, 2, 3], 'bigger-and-smaller': [0, 1, 2, 3], 'triangles-too': [5], 'big-and-little': [2], 'circle-and-square': [5], 'not-the-same': [4], 'same-and-different': [2], 'two-steps': [12], 'two-ideas': [6, 7, 8] };
  const pairGaps = {};
  for (const [mod, steps] of Object.entries(LINES)) {
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
  const SAME = [['big-and-small', 0], ['two-steps', 12], ['two-ideas', 8]]; const sized = {};
  for (const motion of ['reduce', 'no-preference']) { await page.emulateMedia({ reducedMotion: motion }); await page.waitForTimeout(300);
    for (const [mod, step] of SAME) { await page.evaluate((m) => window.__eduTest.openModule(m), mod); await page.waitForFunction(() => window.__eduTest.screen === 'lesson').catch(() => {}); await page.waitForTimeout(400);
      for (let i = 0; i < step; i++) { await page.getByRole('button', { name: 'Next', exact: true }).first().click({ force: true }); await page.waitForTimeout(150); }
      await page.waitForTimeout(1600); sized[`${mod} ${step} ${motion}`] = await widthsNow(); } }
  await page.emulateMedia({ reducedMotion: 'reduce' }); await page.setViewportSize({ width: 1280, height: 900 }); await page.waitForTimeout(300);
  const same = SAME.map(([mod, step]) => { const off = sized[`${mod} ${step} reduce`] || []; const on = sized[`${mod} ${step} no-preference`] || []; return off.length === 2 && on.length === 2 && off.every((w, k) => !!w && !!on[k] && Math.abs(on[k] / w - 1) <= 0.02); });
  ok("in the light theme each drawing of a lesson pair is the same size with motion on as with motion off (Q59)", same.length === 3 && same.every(Boolean), sized); }

ok('no page errors along the way', errors.length === 0, errors);
await browser.close();
console.log(`\n${passed} passed, ${failed} failed`);
process.exitCode = failed ? 1 : 0;
