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
import { createRequire } from 'node:module'; import { pathToFileURL } from 'node:url'; import { execSync } from 'node:child_process';
const G = execSync('npm root -g').toString().trim(); const { chromium } = createRequire(import.meta.url)(`${G}/playwright`);
const L = await import('../../src/logic.mjs');
let passed = 0, failed = 0; const ok = (name, cond, info) => { if (cond) { passed++; console.log('PASS - ' + name); } else { failed++; console.log('FAIL - ' + name + (info !== undefined ? '  ' + JSON.stringify(info).slice(0, 500) : '')); } };
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, hasTouch: true, reducedMotion: 'reduce' });
const errors = []; page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
await page.goto(pathToFileURL(new URL('./page.html', import.meta.url).pathname).href);
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
const show = async (gen, seed) => { await page.evaluate(([g, s]) => window.__eduTest.showQuestion(g, s), [gen, seed]); await screenIs('practice'); await page.waitForTimeout(600); return page.evaluate(() => window.__eduTest.question); };
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

// 5. A reader's wrong answer opens More Info by itself (Mikey: "It could be cool to have the popup show up automatically when a
//    wrong answer is selected too"), the one chosen first; on a 375 by 667 phone a tall sheet starts on screen and worded
//    choices are not squeezed into a narrow box.
{ await walk('Walk through elementary');
  // The setup line sits above its question since pass MH (the order the voice reads them; Q30 asks Mikey whether it stays).
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

ok('no page errors along the way', errors.length === 0, errors);
await browser.close();
console.log(`\n${passed} passed, ${failed} failed`);
process.exitCode = failed ? 1 : 0;
