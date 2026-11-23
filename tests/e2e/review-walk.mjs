// The quick look back and Action Items, walked in the real page (pass LM; Mikey asked for the feature to be tested as a
// student in every outcome and as an educator). In plain terms: a made-up educator adds two students, a test-only hook gives
// them weeks of history, and the walk then signs in as each side and clicks through what a real person would see.
import { createRequire } from 'node:module'; import { execSync } from 'node:child_process';
const G = execSync('npm root -g').toString().trim(); const { chromium } = createRequire(import.meta.url)(`${G}/playwright`);
let passed = 0, failed = 0; const ok = (name, cond, info) => { if (cond) { passed++; console.log('PASS - ' + name); } else { failed++; console.log('FAIL - ' + name + (info ? '  ' + JSON.stringify(info).slice(0, 300) : '')); } };
const shots = process.argv[2] || null;
const browser = await chromium.launch(); const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, reducedMotion: 'reduce' });
const errors = []; page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
await page.goto(new URL('./page.html', import.meta.url).href);
const screen = () => page.evaluate(() => window.__eduTest && window.__eduTest.screen);
const screenIs = (n) => page.waitForFunction((x) => window.__eduTest && window.__eduTest.screen === x, n, { timeout: 15000 });
const text = async () => (await page.evaluate(() => document.body.innerText)).replace(/\s+/g, ' ');
const snap = async (name) => { if (shots) await page.screenshot({ path: `${shots}/${name}.png` }); };
const tapIf = async (name) => { const b = page.getByRole('button', { name, exact: true }); if (await b.count()) { await b.first().click(); await page.waitForTimeout(300); return true; } return false; };
// A width read as a phone lays it out (pass NX): the test page keeps the browser's 8-pixel body margin and draws a 15-pixel scrollbar beside
// the page, so its column is up to 31 pixels narrower than the product's at the same width (pass NU's rule: a wrap is read on index.html or
// with the margin taken off). While a check holds this, the margin is off and the scrollbar is drawn over the page, so a width here is the
// product's width on a phone; put back after with phoneOff.
const phoneOn = () => page.addStyleTag({ content: 'body { margin: 0 !important; } ::-webkit-scrollbar { display: none; }' });
const phoneOff = (tag) => tag.evaluate((el) => el.remove());
// Where a block's words break, read from each word's own box (pass NX): its lines, how many words its last line holds, and the last word of
// every line but the last.
const breaksOf = (sel) => page.evaluate((s) => {
  const el = document.querySelector(s); if (!el) return null; const words = []; const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let t;
  while ((t = walk.nextNode())) for (const m of t.textContent.matchAll(/[^\s\u00a0]+/g)) { const rg = document.createRange(); rg.setStart(t, m.index); rg.setEnd(t, m.index + m[0].length); const r = [...rg.getClientRects()].find((q) => q.width > 0.5); if (r) words.push({ w: m[0], top: Math.round(r.top) }); }
  const tops = [...new Set(words.map((x) => x.top))].sort((a, b) => a - b); const on = (top) => words.filter((x) => x.top === top);
  return { lines: tops.length, onLast: tops.length ? on(tops[tops.length - 1]).length : 0, ends: tops.slice(0, -1).map((top) => on(top).slice(-1)[0].w), text: el.textContent.replace(/\u00a0/g, ' ') };
}, sel);
// An educator and two students.
await page.getByRole('button', { name: 'Create account', exact: true }).first().click(); await screenIs('educator-setup');
await page.fill('input[placeholder="PIN"]', '2468'); await page.fill('input[placeholder="PIN again"]', '2468'); await page.fill('input[placeholder="This device\'s name"]', 'Walk'); await page.selectOption('select[aria-label="Your state"]', 'TX');
await page.getByRole('button', { name: 'Create account', exact: true }).click(); await screenIs('educator-pick'); await page.waitForTimeout(500);
await tapIf('Skip tour'); await tapIf('Later');
for (const id of ['S-77', 'S-88']) {
  await page.getByRole('button', { name: 'Add someone new' }).first().click(); await page.waitForTimeout(300);
  await page.fill('input[placeholder="School-issued ID"]', id); await page.getByRole('button', { name: /^Early years/ }).first().click(); await page.waitForTimeout(200);
  await page.getByRole('button', { name: 'Add', exact: true }).click(); await page.waitForTimeout(500); await tapIf('Later');
}
const s77 = await page.evaluate(() => window.__eduTest.seedHistory('S-77', { due: 3 }));
const s88 = await page.evaluate(() => window.__eduTest.seedHistory('S-88', { stuck: true, paper: true }));
ok('the hook seeds three lessons due for S-77 and a stuck lesson and a paper for S-88', s77 && s77.due.length === 3 && s88 && !!s88.stuck && !!s88.paper, { s77, s88 });
await page.waitForTimeout(800);
// The educator side: two Action Items, one at a time.
ok('only S-88 carries the link, and it counts two items', (await page.getByRole('button', { name: '2 Action Items' }).count()) === 1 && (await page.getByRole('button', { name: 'Action Item', exact: true }).count()) === 0);
await page.getByRole('button', { name: '2 Action Items' }).click(); await page.waitForTimeout(400); await snap('1-popup-stuck');
let t = await text();
ok('the popup shows the stuck lesson first, "1 of 2", in Mikey\'s wording, with Move Forward', /1 of 2/.test(t) && /S-88 cannot seem to get past/.test(t) && /You can still move S-88 forward by clicking below/.test(t) && (await page.getByRole('button', { name: 'Move Forward' }).count()) === 1);
// The Action Item card's close is a 44 by 44 target in its top right corner, clear of the card's title and its count (pass NX, round one's
// screen read: it was 27 by 24 pixels, under the 44 a finger needs, EARMARKS A36's rule); a close set back to its old size is planted, caught.
const closeRead = () => page.evaluate(() => {
  const card = document.querySelector('[role="dialog"][aria-label="Action Item"]'); const x = card && card.querySelector('button[aria-label="Close"]'); if (!x) return null;
  const c = card.getBoundingClientRect(); const r = x.getBoundingClientRect(); const over = (a, b) => Math.min(a.right, b.right) - Math.max(a.left, b.left) > 0.5 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 0.5;
  const words = [...card.querySelectorAll('p')].filter((p) => /^(Action Item|\d+ of \d+)$/.test(p.textContent.trim())).map((p) => { const rg = document.createRange(); rg.selectNodeContents(p); return rg.getBoundingClientRect(); });
  // The corner is the inside of the card's border (its 3-pixel red border), where the close is placed.
  const inRight = c.left + card.clientLeft + card.clientWidth; const inTop = c.top + card.clientTop;
  return { w: Math.round(r.width), h: Math.round(r.height), corner: Math.abs(inRight - r.right) <= 2 && Math.abs(r.top - inTop) <= 2, clear: words.length === 2 && words.every((q) => !over(q, r)) };
});
const closeOk = (x) => !!x && x.w >= 44 && x.h >= 44 && x.corner && x.clear;
const closeNow = await closeRead();
const closeSmall = await page.evaluate(() => { const x = document.querySelector('[role="dialog"][aria-label="Action Item"] button[aria-label="Close"]'); window.__closeWas = x.getAttribute('style'); x.style.width = '27px'; x.style.height = '24px'; return true; }) && !closeOk(await closeRead());
await page.evaluate(() => { document.querySelector('[role="dialog"][aria-label="Action Item"] button[aria-label="Close"]').setAttribute('style', window.__closeWas); delete window.__closeWas; });
ok("the Action Item card's close is a 44 by 44 target in its top right corner, clear of its title and its count (pass NX, round one's screen read; its old 27 by 24 planted, caught)", closeOk(closeNow) && closeSmall, { closeNow, closeSmall });
await page.getByRole('button', { name: 'Move Forward' }).click(); await page.waitForTimeout(600); await snap('2-popup-paper');
t = await text();
ok('Move Forward brings up the paper as "2 of 2", with Review', /2 of 2/.test(t) && /S-88 has submitted a paper for review\./.test(t) && (await page.getByRole('button', { name: 'Review' }).count()) === 1);
// The paper's sentence keeps its last two words together (pass NX, round one's screen read: "S-1 has submitted a paper for / review." at 320
// to 340 pixels wide): read at every width from 320 to 440 in steps of 2 as a phone lays it out, its last line never holds one word; the
// sentence drawn with a plain space before its last word is planted, caught.
{ const tag = await phoneOn(); const lone = []; let read = 0;
  for (let w = 320; w <= 440; w += 2) { await page.setViewportSize({ width: w, height: 844 }); await page.waitForTimeout(60); const b = await breaksOf('[role="dialog"][aria-label="Action Item"] p:not([data-action-step]):nth-of-type(n+2)'); if (b && /submitted a paper for review\./.test(b.text)) { read++; if (b.lines > 1 && b.onLast < 2) lone.push(w); } }
  await page.setViewportSize({ width: 320, height: 844 }); await page.waitForTimeout(100);
  const plant = await page.evaluate(() => { const p = [...document.querySelectorAll('[role="dialog"][aria-label="Action Item"] p')].find((x) => /submitted/.test(x.textContent)); if (!p) return null; window.__paperWas = p.innerHTML; p.textContent = p.textContent.replace(/\u00a0/g, ' '); return true; });
  const planted = await breaksOf('[role="dialog"][aria-label="Action Item"] p:not([data-action-step]):nth-of-type(n+2)');
  await page.evaluate(() => { const p = [...document.querySelectorAll('[role="dialog"][aria-label="Action Item"] p')].find((x) => /submitted/.test(x.textContent)); if (p && window.__paperWas !== undefined) p.innerHTML = window.__paperWas; delete window.__paperWas; });
  await page.setViewportSize({ width: 390, height: 844 }); await phoneOff(tag); await page.waitForTimeout(200);
  ok(`the paper's sentence never leaves its last word alone on a line at any width from 320 to 440 (pass NX, round one's screen read; ${read} widths read, its old plain space planted at 320, caught)`, read === 61 && lone.length === 0 && !!plant && !!planted && /submitted a paper for review\./.test(planted.text) && planted.lines > 1 && planted.onLast === 1, { read, lone, planted }); }
await page.getByRole('button', { name: 'Review' }).click(); await screenIs('educator-report'); await page.waitForTimeout(500); await snap('3-report');
t = await text();
ok('Review opens the report with the paper waiting for a mark', /favorite animal/.test(t));
ok('the report\'s Practice Reviews card names the student as typed (S-88) and leaves out the action line', /Practice Reviews/.test(t) && !/clicking below/.test(t) && /You moved S-88 forward on/.test(t), t.slice(Math.max(0, t.indexOf('Practice Reviews')), t.indexOf('Practice Reviews') + 400));
await tapIf('Back'); await page.waitForTimeout(500); if ((await screen()) !== 'educator-pick') { await page.evaluate(() => window.__eduTest.goTo && window.__eduTest.goTo('educator-pick')); await page.waitForTimeout(500); }
ok('back in the classroom, the link counts what is left', (await page.getByRole('button', { name: 'Action Item', exact: true }).count()) === 1);
// The student side: two reviews back to back at the start of the day.
await page.getByRole('button', { name: 'Home' }).first().click(); await page.waitForTimeout(500);
await page.getByRole('button', { name: /S-77$/ }).first().click(); await page.waitForTimeout(800); await tapIf('Later');
t = await text(); await snap('4-start-of-day');
ok('the day opens on the quick look backs, two of them, both named', /First, A Quick Review/.test(t) && (await page.locator('[data-light-review-count="2"]').count()) === 1);
const answer = async (rightCount) => {
  for (let k = 0; k < 5; k++) {
    const q = await page.evaluate(() => window.__eduTest.question); if (!q) break;
    const pick = k < rightCount ? q.answer : q.choices.find((c) => c !== q.answer);
    await page.locator(`button[data-choice="${String(pick).replace(/"/g, '\\"')}"]`).first().click(); await page.waitForTimeout(150);
    await tapIf('Check answer');
    // A young learner's wrong answer gets "Have another try" (the first try is what counts): try again, then answer.
    if (await tapIf('Try again')) { await page.locator(`button[data-choice="${String(q.answer).replace(/"/g, '\\"')}"]`).first().click(); await page.waitForTimeout(150); await tapIf('Check answer'); }
    const next = page.getByRole('button', { name: /Next question|See results|Finish/ }).first(); if (await next.count()) { await next.click(); await page.waitForTimeout(250); }
    if ((await screen()) !== 'practice') break;
  }
};
await page.getByRole('button', { name: 'Start', exact: true }).click(); await page.waitForTimeout(500);
ok('Start opens the first review on the practice screen, Quick Review over Question 1 of 5', (await screen()) === 'practice' && /Quick Review\s*Question 1 of 5/.test(await text()));
await answer(5); await page.waitForTimeout(500); t = await text(); await snap('5-result-clear');
ok('a clear pass reads Mikey\'s line and offers the next review straight away', (await screen()) === 'light-review-result' && /well\. That one is yours to keep!/.test(t) && (await page.getByRole('button', { name: 'Next' }).count()) === 1 && !/fail/i.test(t));
await page.getByRole('button', { name: 'Next', exact: true }).click(); await page.waitForTimeout(500);
await answer(2); await page.waitForTimeout(500); t = await text(); await snap('6-result-fail');
ok('a fail never says fail, reads Mikey\'s line, and goes back to the lessons', (await screen()) === 'light-review-result' && /is worth another visit\. It's open again on your list so you can go back through it any time\./.test(t) && !/\bfail/i.test(t) && (await page.getByRole('button', { name: 'Back to my lessons' }).count()) === 1);
await page.getByRole('button', { name: 'Back to my lessons' }).click(); await page.waitForTimeout(600); t = await text(); await snap('7-overview');
ok('the lessons follow, with no third review that day', (await screen()) === 'overview' && !/quick look back/i.test(t.split('Open again')[0].slice(0, 400)) && (await page.locator('[data-light-review-card]').count()) === 0);
// A young learner's lessons sit inside skill groups that open with a tap; open them the way a child would.
let seenLine = false; const heads = page.locator('button[aria-expanded]'); const nHeads = await heads.count();
for (let g = 0; g < nHeads && !seenLine; g++) { const h = heads.nth(g); if ((await h.getAttribute('aria-expanded')) === 'false') { await h.click(); await page.waitForTimeout(200); } seenLine = /You've mastered this once before but one of your reviews prompted a refresher\. Go through it once more, story and all, when you're ready\./.test(await text()); }
t = await text(); await snap('8-overview-open');
ok('the failed lesson carries Mikey\'s reopened line', /You've mastered this once before but one of your reviews prompted a refresher\. Go through it once more, story and all, when you're ready\./.test(t));
// The Quick Review card's exit and its title (pass NX, EARMARKS A176, round one's screen read: the exit's × sat on the last letter of
// "First, A Quick Review" at 320 and 340 pixels wide and of "One More Quick Review" at 360 and 375, in both themes, with the motion on
// and off, and the second title left "Review" alone on its last line up to 348). S-99 has two reviews due, so her card shows the first
// title as her day opens and, once she has taken the first review, left and come back, the second. Each is read in both themes, with
// the motion still and moving (the card's rise ended, its transform kept), at every width from 320 to 440 in steps of 2, laid out as a
// phone lays it out (phoneOn): the exit's tap box never meets a letter of the title, its × keeps at least 12 pixels from every letter
// (14.9 at the least when this was written), it is a 44 by 44 target in the card's top right corner, the title stays centered in the
// card, its last line never holds one word and no line ends on the one-letter word A (a title that wraps reads "First, / A Quick Review"
// and "One More / Quick Review"); and at 320 by 568 the card's Start shows whole. Planted with the first title, each caught: the
// exit moved 40 pixels in from the corner at 380 (where the title runs on one line to the corner's edge), and at 320 the exit set back
// to its old 27 by 25, the title drawn with plain spaces ("Review" alone) and with only its last two words held ("First, A / Quick Review").
const cardRead = () => page.evaluate(() => {
  const card = document.querySelector('[data-light-review-card]'); if (!card) return null;
  const h1 = card.querySelector('h1'); const x = card.querySelector('button[aria-label="Exit"]'); if (!h1 || !x) return null;
  const box = (r) => ({ l: r.left, r: r.right, t: r.top, b: r.bottom });
  const gap = (a, b) => { const dx = Math.max(0, a.l - b.r, b.l - a.r); const dy = Math.max(0, a.t - b.b, b.t - a.b); return dx > 0 && dy > 0 ? Math.hypot(dx, dy) : Math.max(dx, dy); };
  const over = (a, b) => Math.min(a.r, b.r) - Math.max(a.l, b.l) > 0.5 && Math.min(a.b, b.b) - Math.max(a.t, b.t) > 0.5;
  const words = []; const walk = document.createTreeWalker(h1, NodeFilter.SHOW_TEXT); let t;
  while ((t = walk.nextNode())) for (const m of t.textContent.matchAll(/[^\s\u00a0]+/g)) { const rg = document.createRange(); rg.setStart(t, m.index); rg.setEnd(t, m.index + m[0].length); const r = [...rg.getClientRects()].find((q) => q.width > 0.5); if (r) words.push({ w: m[0], r: box(r) }); }
  const glyphOf = document.createRange(); glyphOf.selectNodeContents(x); const glyph = box(glyphOf.getBoundingClientRect()); const tap = box(x.getBoundingClientRect());
  const tops = [...new Set(words.map((q) => Math.round(q.r.t)))].sort((a, b) => a - b); const on = (top) => words.filter((q) => Math.round(q.r.t) === top);
  const c = card.getBoundingClientRect(); const left = Math.min(...words.map((q) => q.r.l)); const right = Math.max(...words.map((q) => q.r.r));
  const start = [...card.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Start'); const s = start ? start.getBoundingClientRect() : null;
  return { title: h1.textContent.replace(/\u00a0/g, ' '), lines: tops.length, onLast: tops.length ? on(tops[tops.length - 1]).length : 0, ends: tops.slice(0, -1).map((top) => on(top).slice(-1)[0].w),
    touch: words.some((q) => over(tap, q.r)), glyphGap: Math.min(...words.map((q) => gap(glyph, q.r))), tap: [Math.round(tap.r - tap.l), Math.round(tap.b - tap.t)],
    corner: Math.abs(c.left + card.clientLeft + card.clientWidth - tap.r) <= 2 && Math.abs(tap.t - c.top - card.clientTop) <= 2, offCenter: Math.abs((left + right) / 2 - (c.left + c.right) / 2), start: s ? [Math.round(s.top), Math.round(s.bottom)] : null, H: window.innerHeight };
});
// What a read says is wrong, in words (an empty list when nothing is).
const cardFaults = (m) => (!m ? ['no card'] : [m.touch && "the exit's tap box meets the title", m.glyphGap < 12 && `the × ${m.glyphGap.toFixed(1)} pixels from the title`, (m.tap[0] < 44 || m.tap[1] < 44) && `the exit ${m.tap.join(' by ')}`,
  !m.corner && 'the exit off the corner', m.offCenter > 1.5 && `the title ${m.offCenter.toFixed(1)} pixels off center`, m.lines > 1 && m.onLast < 2 && 'its last word alone', m.ends.some((w) => w.replace(/[^A-Za-z]/g, '').length === 1) && `a line ending on ${m.ends.join('/')}`].filter(Boolean));
{ await page.evaluate(() => window.__eduTest.goTo('educator-pick')); await screenIs('educator-pick'); await page.waitForTimeout(400); await tapIf('Got it');
  await page.getByRole('button', { name: 'Add someone new' }).first().click(); await page.waitForTimeout(300);
  await page.fill('input[placeholder="School-issued ID"]', 'S-99'); await page.getByRole('button', { name: /^Early years/ }).first().click(); await page.waitForTimeout(200);
  await page.getByRole('button', { name: 'Add', exact: true }).click(); await page.waitForTimeout(500); await tapIf('Later');
  const s99 = await page.evaluate(() => window.__eduTest.seedHistory('S-99', { due: 2 }));
  // Her day, in a theme chosen on the classroom page (the switch is there), as she signs in.
  const dayIn = async (theme) => { await page.evaluate(() => window.__eduTest.goTo('educator-pick')); await screenIs('educator-pick'); await page.waitForTimeout(400); await tapIf('Got it');
    await page.getByLabel(theme === 'dark' ? 'Dark theme' : 'Light theme').first().click({ force: true }); await page.waitForTimeout(300);
    await page.getByRole('button', { name: 'Home' }).first().click(); await page.waitForTimeout(500); await page.getByRole('button', { name: /S-99$/ }).first().click(); await page.waitForTimeout(900); await tapIf('Later'); };
  const faults = []; const titles = new Set(); const starts = []; let reads = 0; let least = Infinity; let plants = null;
  const sweep = async (label) => {
    const tag = await phoneOn();
    for (const motion of ['reduce', 'no-preference']) {
      await page.emulateMedia({ reducedMotion: motion }); await page.waitForTimeout(motion === 'reduce' ? 200 : 700);   // a rise started by the change has ended
      for (let w = 320; w <= 440; w += 2) { await page.setViewportSize({ width: w, height: 900 }); await page.waitForTimeout(50); const m = await cardRead(); reads++; if (m) { titles.add(m.title); least = Math.min(least, m.glyphGap); } for (const f of cardFaults(m)) faults.push(`${label} ${motion} ${w}: ${f}`); }
      await page.setViewportSize({ width: 320, height: 568 }); await page.waitForTimeout(150); const m = await cardRead(); starts.push({ label, motion, start: m && m.start, H: m && m.H });
    }
    await page.emulateMedia({ reducedMotion: 'reduce' }); await page.setViewportSize({ width: 390, height: 844 }); await phoneOff(tag); await page.waitForTimeout(200);
  };
  await dayIn('dark'); await sweep('first, dark'); await dayIn('light'); await sweep('first, light');
  // The plants with the first title, each put back after: the exit moved in at 380, where the title runs on one line to the corner's
  // edge (at 320 it wraps into the card's middle, where a moved exit meets nothing), the rest at 320.
  { const tag = await phoneOn();
    const plant = async (how, width) => { await page.setViewportSize({ width, height: 900 }); await page.waitForTimeout(150); await page.evaluate((h) => { const card = document.querySelector('[data-light-review-card]'); const x = card.querySelector('button[aria-label="Exit"]'); const h1 = card.querySelector('h1');
      window.__was = { x: x.getAttribute('style'), h1: h1.innerHTML };
      if (h === 'in') x.style.right = '40px'; else if (h === 'small') { x.style.width = '27px'; x.style.height = '25px'; } else if (h === 'plain') h1.textContent = h1.textContent.replace(/\u00a0/g, ' '); else if (h === 'two') h1.textContent = h1.textContent.replace(/\u00a0/, ' '); }, how);
      const m = await cardRead(); await page.evaluate(() => { const card = document.querySelector('[data-light-review-card]'); card.querySelector('button[aria-label="Exit"]').setAttribute('style', window.__was.x); card.querySelector('h1').innerHTML = window.__was.h1; delete window.__was; });
      return cardFaults(m); };
    plants = { in: await plant('in', 380), small: await plant('small', 320), plain: await plant('plain', 320), two: await plant('two', 320), after: cardFaults(await cardRead()) };
    await page.setViewportSize({ width: 390, height: 844 }); await phoneOff(tag); await page.waitForTimeout(200); }
  // The first review taken, then away and back: the card says One More Quick Review.
  await page.getByRole('button', { name: 'Start', exact: true }).click(); await page.waitForTimeout(500); await answer(5); await page.waitForTimeout(500);
  const firstDone = (await screen()) === 'light-review-result';
  await dayIn('light'); await sweep('again, light'); await dayIn('dark'); await sweep('again, dark');
  const caught = !!plants && plants.after.length === 0 && plants.in.some((f) => /tap box|×/.test(f)) && plants.small.some((f) => /exit 27 by 25/.test(f)) && plants.plain.some((f) => /alone/.test(f)) && plants.two.some((f) => /ending on/.test(f));
  ok(`the Quick Review card's exit keeps clear of its title, both titles, in both themes, motion still and moving, at every width from 320 to 440 (pass NX, EARMARKS A176; ${reads} screens read, the × at least ${least.toFixed(1)} pixels from the title; the exit moved in, its old size and the title's two old wraps planted, each caught)`,
    !!s99 && s99.due.length === 2 && firstDone && reads === 488 && titles.size === 2 && titles.has('First, A Quick Review') && titles.has('One More Quick Review') && faults.length === 0 && caught, { s99, firstDone, reads, titles: [...titles], faults: faults.slice(0, 8), plants });
  ok("at 320 by 568 the Quick Review card's Start shows whole under either title, in both themes, motion still and moving (pass NX)", starts.length === 8 && starts.every((x) => !!x.start && x.start[0] >= 0 && x.start[1] <= x.H), starts); }
ok('no page errors along the way', errors.length === 0, errors);
await browser.close();
console.log(`\n${passed} passed, ${failed} failed`);
process.exitCode = failed ? 1 : 0;   // never process.exit() (CLAUDE.md, 2026-09-23)
