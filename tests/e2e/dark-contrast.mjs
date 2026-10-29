// The Wise Human. Copyright (c) 2026. Source-available; not for reuse. See LICENSE.md.
// The dark theme check (2026-09-24, Mikey): start dark, as every new device now does, visit every screen the app can
// be on, and fail if any word on it reads at less than the contrast the web's accessibility rules ask for (4.5 to 1,
// or 3 to 1 for large words). Paper screens must stay light, and the choice must survive a reload.
// Run: node tests/e2e/make-page.mjs && node tests/e2e/dark-contrast.mjs
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { readFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
let pass = 0, fail = 0;
const ok = (label, cond, detail = '') => { console.log((cond ? 'PASS' : 'FAIL') + ' - ' + label + (cond || !detail ? '' : '  ' + detail)); cond ? pass++ : fail++; };
const src = readFileSync('src/ui.jsx', 'utf8');
const screens = [...new Set([...src.matchAll(/setScreen\('([a-z-]+)'\)/g)].map((m) => m[1]))].filter((s) => !['welcome', 'loading', 'result', 'quick-result', 'placement-result', 'checkpoint-result', 'writing-sent', 'wonder-voices', 'wonder', 'practice', 'educator-pin', 'educator-setup'].includes(s));
const studentScreens = new Set(['overview', 'lesson', 'story', 'coloring', 'course-story', 'course-done', 'my-progress']);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 360, height: 780 }, reducedMotion: 'reduce', hasTouch: true });
const url = pathToFileURL('tests/e2e/page.html').href;
await page.goto(url);
await page.waitForFunction(() => window.__eduTest && window.__eduTest.screen === 'welcome');
await page.getByRole('button', { name: 'Create account' }).click();
await page.fill('input[placeholder="PIN"]', '2468'); await page.fill('input[placeholder="PIN again"]', '2468');
await page.fill('input[placeholder="This device\'s name"]', 'Sweep'); await page.selectOption('select[aria-label="Your state"]', 'TX');
await page.getByRole('button', { name: 'Create account', exact: true }).click();
await page.waitForFunction(() => window.__eduTest && window.__eduTest.screen === 'educator-pick');
for (const name of ['Skip tour', 'Later', 'Got it']) { const b = page.getByRole('button', { name }); if (await b.count()) { await b.first().click({ force: true }); await page.waitForTimeout(150); } }
// One student, so the report and the certificate have someone to be about.
await page.getByRole('button', { name: 'Add someone new' }).click(); await page.fill('input[placeholder="School-issued ID"]', 'S-1'); await page.getByRole('button', { name: /^Elementary/ }).click(); await page.getByRole('button', { name: 'Add', exact: true }).click(); await page.waitForTimeout(250);
for (const name of ['Done', 'Not now', 'Skip', 'Later', 'Got it']) { const b = page.getByRole('button', { name }); if (await b.count()) { await b.first().click({ force: true }); await page.waitForTimeout(100); } }
await page.getByRole('button', { name: 'Open report' }).first().click(); await page.waitForFunction(() => window.__eduTest && window.__eduTest.screen === 'educator-report');
// A saved note, so its date and its Edit and Remove links are measured too (pass JV: in the dark theme they were nearly invisible).
await page.locator('textarea[aria-label="Teacher note"]').first().fill('Reads well on the light card.'); await page.getByRole('button', { name: 'Save note' }).click(); await page.waitForTimeout(250);
await page.getByRole('button', { name: 'Back to Classroom' }).click(); await page.waitForFunction(() => window.__eduTest && window.__eduTest.screen === 'educator-pick');

// Every word on the screen, measured against what it actually sits on (backgrounds stacked up through its parents).
// A gradient counts as every color it passes through, and a word must read on the worst of them (the phone screenshots
// of 2026-09-24 showed light cards the old check had skipped). Words over a picture, inside a drawing, or on a faded
// (disabled) control are left to the eye.
const audit = () => page.evaluate(() => {
  const parse = (s) => { const m = String(s).match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[\s,\/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
  const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const lum = (c) => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
  const blend = (top, under) => ({ r: top.r * top.a + under.r * (1 - top.a), g: top.g * top.a + under.g * (1 - top.a), b: top.b * top.a + under.b * (1 - top.a), a: 1 });
  const under = (el) => {
    const layers = []; let n = el; let stops = null;
    while (n && n.nodeType === 1) {
      const cs = getComputedStyle(n); const img = cs.backgroundImage;
      if (img && img !== 'none') { if (/url\(/.test(img)) return null; const cols = (img.match(/rgba?\([^)]+\)/g) || []).map(parse).filter(Boolean); if (cols.length) { stops = cols; n = n.parentElement; break; } }
      const c = parse(cs.backgroundColor); if (c && c.a > 0) { layers.push(c); if (c.a >= 1) return [layers.reduceRight((acc, l) => blend(l, acc), { r: 255, g: 255, b: 255, a: 1 })]; }
      n = n.parentElement;
    }
    let floor = { r: 255, g: 255, b: 255, a: 1 };
    while (n && n.nodeType === 1) { const c = parse(getComputedStyle(n).backgroundColor); if (c && c.a >= 1) { floor = c; break; } n = n.parentElement; }
    return (stops || [null]).map((s) => { let base = s ? (s.a < 1 ? blend(s, floor) : s) : floor; for (let i = layers.length - 1; i >= 0; i--) base = blend(layers[i], base); return base; });
  };
  const fails = []; const seen = new Set();
  const walker = document.createTreeWalker(document.querySelector('#root'), NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const t = walker.currentNode; const words = t.textContent.trim(); if (!words) continue;
    const el = t.parentElement; if (!el || seen.has(el) || el.closest('svg')) continue; seen.add(el);
    const box = el.getBoundingClientRect(); if (box.width < 1 || box.height < 1) continue;
    const cs = getComputedStyle(el); if (cs.visibility === 'hidden') continue;
    let n = el, faded = false; while (n && n.nodeType === 1) { if (parseFloat(getComputedStyle(n).opacity) < 0.9) { faded = true; break; } n = n.parentElement; } if (faded) continue;
    const fg = parse(cs.color); const grounds = under(el); if (!fg || !grounds) continue;
    let ratio = 99, bg = grounds[0];
    for (const g of grounds) { const f = fg.a < 1 ? blend(fg, g) : fg; const r = (Math.max(lum(f), lum(g)) + 0.05) / (Math.min(lum(f), lum(g)) + 0.05); if (r < ratio) { ratio = r; bg = g; } }
    const size = parseFloat(cs.fontSize); const bold = parseInt(cs.fontWeight, 10) >= 700;
    if (ratio < ((size >= 24 || (size >= 18.66 && bold)) ? 3 : 4.5)) fails.push(`${ratio.toFixed(2)} "${words.slice(0, 36)}" ${cs.color} on rgb(${Math.round(bg.r)}, ${Math.round(bg.g)}, ${Math.round(bg.b)})`);
  }
  // A picker shows its chosen option's words on the picker itself, so every visible picker is measured too.
  for (const el of document.querySelectorAll('#root select')) {
    const box = el.getBoundingClientRect(); if (box.width < 1 || box.height < 1) continue;
    const cs = getComputedStyle(el); const fg = parse(cs.color); const own = parse(cs.backgroundColor); const grounds = own && own.a >= 1 ? [own] : under(el.parentElement); if (!fg || !grounds) continue;
    for (const g of grounds) { const r = (Math.max(lum(fg), lum(g)) + 0.05) / (Math.min(lum(fg), lum(g)) + 0.05); if (r < 4.5) { fails.push(`${r.toFixed(2)} picker "${(el.selectedOptions[0] || {}).textContent || ''}" ${cs.color}`); break; } }
  }
  return fails;
});
// An educator is signed out after a quiet minute (EDUCATOR_IDLE_MS), so the long walk taps an empty edge of the page as it goes.
const keepAlive = () => page.mouse.click(3, 300).catch(() => {});
// Into a walk-through: the tap is tried again, after any pop-up is closed, when the overview does not come within ten seconds
// (the screen check, pass MG: the early-years walk once never reached the overview, and passed when run again).
const walkInto = async (label) => {
  for (let k = 0; k < 3; k++) {
    await keepAlive(); await page.getByLabel(label).first().click({ force: true });
    if (await page.waitForFunction(() => window.__eduTest && window.__eduTest.screen === 'overview', null, { timeout: 10000 }).then(() => true).catch(() => false)) return;
    for (const name of ['Got it', 'Later', 'Skip tour', 'Close']) { const b = page.getByRole('button', { name, exact: true }); if (await b.count()) await b.first().click({ force: true }).catch(() => {}); }
    await page.evaluate(() => window.__eduTest.goTo('educator-pick')).catch(() => {}); await page.waitForTimeout(400);
  }
  throw new Error(`the ${label} walk-through never reached the overview`);
};
// On a wide screen the Classroom starts its laptop tour the first time it is shown, and the tour holds the page there,
// so the wide pass skips it the way an educator would.
const skipTour = async () => { const b = page.getByRole('button', { name: 'Skip tour' }); if (await b.count()) { await b.first().click({ force: true }); await page.waitForTimeout(200); } };
const themeNow = () => page.evaluate(() => document.documentElement.dataset.theme || 'light');
// A screen is measured once it has opened, waited for up to three seconds, and one that never opens fails (the alignment read and
// the final read, pass MG: a fixed 250 milliseconds skipped standards-map, experiments and certificate under load, silently).
const opened = (s) => page.waitForFunction((n) => window.__eduTest && window.__eduTest.screen === n, s, { timeout: 3000 }).then(async () => { await page.waitForTimeout(150); return true; }).catch(() => false);
// Dark is the default now (Mikey, 2026-09-24); the switch sits on the welcome page and at the top of the Classroom page.
ok('the Classroom page has the light and dark switch', (await page.getByRole('button', { name: 'Dark theme' }).count()) === 1 && (await page.getByRole('button', { name: 'Light theme' }).count()) === 1);
ok('a new device starts in the dark theme', (await themeNow()) === 'dark' && (await page.evaluate(() => getComputedStyle(document.querySelector('#root > div')).backgroundColor)) === 'rgb(20, 35, 30)');
const paper = new Set(['certificate', 'story-book', 'transcript']);
const check = async (s) => {
  const fails = await audit(); const t = await themeNow();
  if (paper.has(s)) ok(`${s} stays light for printing`, t === 'light', `theme ${t}`);
  else ok(`${s}: every word reads in the dark theme`, t === 'dark' && fails.length === 0, t !== 'dark' ? `theme ${t}` : `${fails.length} low: ${fails.slice(0, 4).join(' | ')}`);
};
await check('educator-pick');
// The Story Log loads its rows when its button is pressed, so it is opened the way an educator opens it.
const storyLog = page.getByRole('button', { name: 'Story Log', exact: true });
ok('the Story Log opens from the Classroom page', (await storyLog.count()) > 0);
if (await storyLog.count()) { await storyLog.first().click(); await page.waitForFunction(() => window.__eduTest && window.__eduTest.screen === 'story-log'); await page.waitForTimeout(250); await check('story-log'); await page.setViewportSize({ width: 1280, height: 900 }); await page.waitForTimeout(250); await check('story-log at 1280'); await page.setViewportSize({ width: 360, height: 780 }); await page.waitForTimeout(200); await page.evaluate(() => window.__eduTest.goTo('educator-pick')); await page.waitForTimeout(200); }
for (const s of screens.filter((x) => !studentScreens.has(x))) {
  await keepAlive(); await page.evaluate((name) => window.__eduTest.goTo(name), s); await page.waitForTimeout(250);
  if (await opened(s)) await check(s); else ok(`${s} opened from goTo within three seconds`, false);
  await page.evaluate(() => window.__eduTest.goTo('educator-pick')); await page.waitForTimeout(200);
}
// Wide screens (Mikey's laptop, 2026-09-24): loose words there sit on a backing plate, so every screen is checked again at 1280.
await page.setViewportSize({ width: 1280, height: 900 }); await page.waitForTimeout(250);
await check('educator-pick at 1280');
for (const s of screens.filter((x) => !studentScreens.has(x) && !paper.has(x))) {
  await keepAlive(); await page.evaluate((name) => window.__eduTest.goTo(name), s); await page.waitForTimeout(250);
  if (await opened(s)) await check(`${s} at 1280`); else ok(`${s} at 1280 opened from goTo within three seconds`, false);
  await page.evaluate(() => window.__eduTest.goTo('educator-pick')); await page.waitForTimeout(200); await skipTour();
}
// Printed (pass MS, round three's screen read): the report and the standards map, on a letter sheet, in both themes, every word
// measured against what it sits on as printed, a gradient's every color included. With background graphics on, the dark theme's
// report had printed its Key Words card's words in ink on a dark green gradient, which a rule clearing background colors left, and
// the printed map's dark backing behind Back to Classroom was found the same way in round one.
// Since round four's screen read the printed report is read for its Key Words' definitions too, every one of EXPLANATIONS on paper:
// only an open definition was drawn, so the eight words printed with none, while the report's folds had been said to print open.
const { EXPLANATIONS } = await import(new URL('../../src/logic.mjs', import.meta.url).href);
const squash = (t) => String(t || '').replace(/\s+/g, ' ').trim();
const printedWords = async (theme) => {
  for (const s of ['educator-report', 'standards-map']) {
    await keepAlive(); await page.evaluate((name) => window.__eduTest.goTo(name), s);
    if (!(await opened(s))) { ok(`${s} opened to be printed in the ${theme} theme`, false); continue; }
    await page.setViewportSize({ width: 816, height: 1056 }); await page.emulateMedia({ media: 'print' }); await page.waitForTimeout(200);
    const fails = await audit(); const onPaper = squash(await page.evaluate(() => document.body.innerText));
    await page.emulateMedia({ media: 'screen' }); await page.setViewportSize({ width: 1280, height: 900 }); await page.waitForTimeout(150);
    ok(`${s} printed in the ${theme} theme: every word reads on what it is printed on`, (await themeNow()) === theme && fails.length === 0, `${fails.length} low: ${fails.slice(0, 12).join(' | ')}`);
    if (s === 'educator-report') { const missing = EXPLANATIONS.filter((x) => !onPaper.includes(squash(x.plain))).map((x) => x.term);
      ok(`the report printed in the ${theme} theme carries every Key Word's definition (${EXPLANATIONS.length})`, EXPLANATIONS.length >= 8 && missing.length === 0, `missing: ${missing.join(', ')}`); }
    await page.evaluate(() => window.__eduTest.goTo('educator-pick')); await page.waitForTimeout(200); await skipTour();
  } };
await printedWords('dark');
await page.getByRole('button', { name: 'Light theme' }).first().click(); await page.waitForTimeout(250);
await printedWords('light');
await page.getByRole('button', { name: 'Dark theme' }).first().click(); await page.waitForTimeout(250);
ok('the Classroom page is dark again after the printed light theme', (await themeNow()) === 'dark');
await page.setViewportSize({ width: 360, height: 780 }); await page.waitForTimeout(250);
await walkInto('Walk through elementary');
await page.evaluate(() => window.__eduTest.openModule(window.__eduTest.visibleModuleIds()[0])); await page.waitForTimeout(400);
for (const s of [...screens.filter((x) => studentScreens.has(x) && x !== 'overview'), 'overview']) {
  await page.evaluate((name) => window.__eduTest.goTo(name), s); await page.waitForTimeout(300);
  if (await opened(s)) await check(s); else ok(`${s} opened from goTo within three seconds`, false);
}
// The drawings on the gold and green taps (pass MG, Mikey's answer to Q23, "change"): in the dark theme every drawing a filled
// tap carries (the arrow, the book, the star that starts practice) reads at 3 to 1 or better on what it sits on, the rule for a
// drawing that carries meaning, since a child who cannot read tells the taps apart by them; white read 2.25 to 1 on the gold
// and 2.06 on the green. Each drawing is measured against its nearest painted background (the surprise book's star sits on a
// badge of its own), and a tap counts when its fill is the dark theme's gold or green.
const tapInk = () => page.evaluate(() => {
  const parse = (s) => (String(s).match(/[\d.]+/g) || []).map(Number); const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b); const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const fills = ['rgb(217, 164, 65)', 'rgb(124, 195, 166)'];
  const under = (el) => { let n = el.parentElement; while (n && n.nodeType === 1) { const c = parse(getComputedStyle(n).backgroundColor); if (c.length >= 3 && (c.length < 4 || c[3] >= 1)) return c; n = n.parentElement; } return [255, 255, 255]; };
  const out = [];
  for (const b of document.querySelectorAll('button')) {
    if (!b.offsetParent || !fills.includes(getComputedStyle(b).backgroundColor)) continue;
    for (const el of b.querySelectorAll('svg path, svg circle')) for (const prop of ['stroke', 'fill']) {
      const v = getComputedStyle(el)[prop]; if (!v || v === 'none' || !/rgb/.test(v)) continue; const c = parse(v); if (c.length > 3 && c[3] === 0) continue;
      out.push({ label: b.getAttribute('aria-label'), prop, color: v, ratio: Math.round(ratio(c, under(el)) * 100) / 100 });
    }
  }
  return out;
});
// Lit letters on the paper (pass MD, Mikey: "Whatever you think about the highlighted letter question"): a letters picture
// lights the part its line names, and the almond paper took the logo gold at 2.66 to 1, under the 3 to 1 large letters need,
// while every walk above is a reader's and never met one. So A and B, a pre-reader's lesson, is opened in an Early years
// walk-through, stepped to its Apple line, and measured: the lit A itself, read from the page, and every other word with it.
{ await keepAlive(); await page.evaluate(() => window.__eduTest.goHome()); await page.waitForTimeout(300);
  await walkInto('Walk through early years');
  await page.evaluate(() => window.__eduTest.openModule('a-and-b')); await page.waitForTimeout(500);
  const next = page.getByLabel('Next'); if (await next.count()) { await next.first().click(); await page.waitForTimeout(400); }
  const lit = page.locator('[data-lit]').first();
  const look = (await lit.count()) ? await lit.evaluate((el) => {
    const parse = (s) => (String(s).match(/[\d.]+/g) || []).map(Number); const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
    let n = el.parentElement; let bg = null; let found = null; while (n && n.nodeType === 1) { const c = parse(getComputedStyle(n).backgroundColor); if (c.length >= 3 && (c.length < 4 || c[3] >= 1)) { bg = c; found = n; break; } n = n.parentElement; }
    const fg = parse(getComputedStyle(el).color); const a = lum(fg), b = lum(bg || [255, 255, 255]);
    return { text: el.textContent, color: getComputedStyle(el).color, bg: bg && bg.join(','), onPaper: !!found && found === el.closest('.edu-paper-picture'), ratio: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05), size: parseFloat(getComputedStyle(el).fontSize) };
  }) : null;
  // The paper itself must be the background measured: a missing paper would leave the dark card, where the deeper gold passes
  // at 3.6, or white, where it passes at 3.86 (the screen check, pass MD, and its second read).
  ok('a lit letter on the paper reads at 3 to 1 or better in the dark theme', (await themeNow()) === 'dark' && look && look.text === 'A' && look.onPaper && look.size >= 24 && look.ratio >= 3, JSON.stringify(look));
  await check('lesson with lit letters (A and B)');
  const inkNext = await tapInk();
  ok('in the dark theme the arrow on the green Next tap reads at 3 to 1 or better on its fill (Q23)', inkNext.some((x) => x.label === 'Next') && inkNext.every((x) => x.ratio >= 3), JSON.stringify(inkNext.filter((x) => x.ratio < 3).slice(0, 3)));
  for (let n = 0; n < 16 && !(await page.getByLabel('Start practice').count()); n++) { await page.getByLabel('Next').first().click({ force: true }); await page.waitForTimeout(120); }
  const inkStar = await tapInk();
  ok('the star on the gold tap that starts practice reads at 3 to 1 or better too (Q23)', inkStar.some((x) => x.label === 'Start practice') && inkStar.every((x) => x.ratio >= 3), JSON.stringify(inkStar.filter((x) => x.ratio < 3).slice(0, 3)));
  await page.evaluate(() => window.__eduTest.goTo('course-done')); await page.waitForTimeout(500);
  const inkBook = await tapInk();
  ok("the book on the course-finished page's gold tap reads at 3 to 1 or better (Q23)", (await page.evaluate(() => window.__eduTest.screen)) === 'course-done' && inkBook.some((x) => /^(Hear|Read) the (next )?story of /.test(x.label || '')) && inkBook.every((x) => x.ratio >= 3), JSON.stringify(inkBook.filter((x) => x.ratio < 3).slice(0, 3)));
  await check('course-done in an early years walk-through');
  await page.evaluate(() => window.__eduTest.goHome()); await page.waitForTimeout(300);
  await walkInto('Walk through elementary'); }
// A ruled-out answer on the dark board stays visible (2026-09-29, Mikey): answer a practice question wrong, tap Try again,
// and the greyed choice must keep its ink apart from its background at seven-tenths or more.
{ await keepAlive(); await page.evaluate(() => window.__eduTest.goTo('overview')); await page.waitForTimeout(300);
  // The first unlocked early module: open it, go from its lesson to practice, and wait for a question to appear.
  for (const id of ['count-to-3', 'one-and-two', 'washing-hands', 'tell-and-show', 'wants-needs-and-choices']) {
    await page.evaluate((mid) => window.__eduTest.openModule(mid), id); await page.waitForTimeout(500);
    const sc = await page.evaluate(() => window.__eduTest.screen);
    // A read-aloud lesson can run several spoken lines (since pass JP every lesson speaks all of its teaching), so step
    // through them with Next until the Start practice star appears.
    if (sc === 'lesson') { for (let n = 0; n < 12 && !(await page.getByLabel('Start practice').count()); n++) { const next = page.getByLabel('Next'); if (!(await next.count())) break; await next.first().click(); await page.waitForTimeout(150); }
      const start = page.getByLabel('Start practice'); if (await start.count()) { await start.first().click(); await page.waitForTimeout(500); } }
    if ((await page.evaluate(() => window.__eduTest.screen)) === 'practice') break;
    await page.evaluate(() => window.__eduTest.goTo('overview')); await page.waitForTimeout(200);
  }
  const q0 = await page.evaluate(() => (window.__eduTest && window.__eduTest.question) || null);
  if (q0 && q0.choices && q0.type !== 'number') {
    const wrong = q0.choices.find((c) => c !== q0.answer); const m = /^dots:(\d+)$/.exec(wrong || '');
    const el = m ? page.locator(`button:has(svg[aria-label="${m[1]} dots"])`).first() : page.getByRole('button', { name: wrong, exact: true }).first();
    await el.click(); await page.getByRole('button', { name: 'Check answer' }).click(); await page.waitForTimeout(200);
    const again = page.getByRole('button', { name: 'Try again' }); if (await again.count()) { await again.click(); await page.waitForTimeout(200); }
    const look = await el.evaluate((node) => { const cs = getComputedStyle(node); return { opacity: Number(cs.opacity), color: cs.color, bg: cs.backgroundColor }; });
    ok('a ruled-out answer stays readable on the dark board', look.opacity >= 0.7 && look.color !== look.bg && look.bg === 'rgb(44, 66, 56)', JSON.stringify(look));
  } else ok('a ruled-out answer stays readable on the dark board', false, `no choice question on the practice screen: ${JSON.stringify(q0 && q0.type)}`);
  await page.evaluate(() => window.__eduTest.goTo('overview')); await page.waitForTimeout(200); }
// The colorful rows on the courses page, opened one at a time: they keep their color and their words stay readable. With motion
// off (this check asks for less motion) each strip shows the whole rainbow at once (pass MG, Mikey: "I don't like the gold
// dropdowns as much as the old multi-colored dropdowns"; frozen, the drifting wash had stopped on its gold end).
const checkStrips = async (where, expected) => {
  const seen = [];
  for (const label of ["Let's Color", "Let's Play", "Let's Read"]) {
    const b = page.getByRole('button', { name: label }).first(); if (!(await b.count())) continue;
    const wash = await b.evaluate((el) => { const cs = getComputedStyle(el); return { size: cs.backgroundSize, stops: (cs.backgroundImage.match(/rgb\(/g) || []).length, motion: matchMedia('(prefers-reduced-motion: reduce)').matches, theme: document.documentElement.getAttribute('data-theme'), sparkles: [...el.querySelectorAll('.edu-sparkle')].filter((s) => getComputedStyle(s).display !== 'none').length }; });
    ok(`${label} (${where}) shows the whole rainbow at once with motion off in the dark theme, never one gold end, and no still sparkle`, wash.motion && wash.theme === 'dark' && wash.size === '100% 100%' && wash.stops >= 6 && wash.sparkles === 0, JSON.stringify(wash));
    await b.click(); await page.waitForTimeout(300);
    ok(`${label} (${where}) opens in the dark theme with readable words`, (await audit()).length === 0, (await audit()).slice(0, 3).join(' | '));
    if (label === "Let's Color" && /early/.test(where)) {
      const tiles = await b.evaluate((el) => { const box = el.parentElement; const ring = (t) => { const m = getComputedStyle(t).boxShadow.match(/(-?[\d.]+)px\s+(-?[\d.]+)px\s+(-?[\d.]+)px\s+(-?[\d.]+)px/); return !!m && Number(m[4]) >= 3; };
        const ready = [...box.querySelectorAll('button.edu-breathe')].filter((t) => !t.disabled); return { ready: ready.length, ringed: ready.filter(ring).length }; });
      ok("Let's Color's ready pictures wear the still green ring too, with motion off", tiles.ready >= 3 && tiles.ringed === tiles.ready, JSON.stringify(tiles));
    }
    await b.click().catch(() => {}); await page.waitForTimeout(200);
    seen.push(label);
  }
  ok(`every strip ${where} is measured: ${expected.join(', ')}`, seen.join('|') === expected.join('|'), seen.join(', '));
};
await checkStrips("in a reader's walk-through", ["Let's Play", "Let's Read"]);
// Games are played on a paper board in both themes (Mikey's laptop, 2026-09-24): three games whose boards carry words.
for (const title of ['Quick fire: math', 'Space shooter: gases', 'In order: how things happen']) {   // the space shooter took the place of Solid or liquid, which left grade 7 science (pass IN)
  await keepAlive(); await page.evaluate(() => window.__eduTest.goTo('overview')); await page.waitForTimeout(300);
  const lp = page.getByRole('button', { name: "Let's Play" }).first(); if ((await lp.getAttribute('aria-expanded')) !== 'true') { await lp.click(); await page.waitForTimeout(300); }
  const g = page.getByRole('button', { name: new RegExp(title, 'i') }).first();
  if (!(await g.count())) { ok(`${title} is listed in Let's Play`, false); continue; }
  await g.click(); await page.waitForTimeout(900);
  ok(`${title}: the words on its board read in the dark theme`, (await audit()).length === 0, (await audit()).slice(0, 3).join(' | '));
}
// A young learner's course list (Mikey, 2026-09-24): the page knows a young learner is there, every group with something
// ready breathes, and inside an open group every ready module's button invites a tap.
await keepAlive(); await page.evaluate(() => window.__eduTest.goTo('educator-pick')); await page.waitForTimeout(250);
const early = page.getByLabel(/Walk through early/i);
ok('the Classroom page offers an early years walkthrough', (await early.count()) > 0);
if (await early.count()) {
  await walkInto('Walk through early years'); await page.waitForTimeout(300);
  const ringed = () => page.evaluate(() => { const ring = (b) => { const m = getComputedStyle(b).boxShadow.match(/rgba?\(([^)]+)\)\s+(-?[\d.]+)px\s+(-?[\d.]+)px\s+(-?[\d.]+)px\s+(-?[\d.]+)px/); if (!m) return false; const a = m[1].split(',').map(Number)[3]; return Number(m[5]) >= 3 && (a === undefined || a >= 0.3); };
    const g = [...document.querySelectorAll('button[aria-expanded]')].filter((b) => b.style.getPropertyValue('--beat') !== '');
    return { groups: g.length, beats: g.filter((b) => b.style.getPropertyValue('--beat') === '1').length, rings: g.filter((b) => b.style.getPropertyValue('--beat') === '1' && ring(b)).length, openRinged: g.filter((b) => b.getAttribute('aria-expanded') === 'true' && ring(b)).length, open: g.filter((b) => b.getAttribute('aria-expanded') === 'true').length }; });
  const r0 = await ringed();
  ok('a young learner sees every group with something ready breathing, its green ring still on with motion off (pass MG, the screen check)', (await page.evaluate(() => document.documentElement.dataset.young)) === '1' && r0.groups >= 2 && r0.beats === r0.groups && r0.rings === r0.groups, JSON.stringify(r0));
  await page.evaluate(() => { const b = [...document.querySelectorAll('button[aria-expanded]')].find((x) => x.style.getPropertyValue('--beat') === '1'); if (b) b.click(); }); await page.waitForTimeout(400);
  const r1 = await ringed();
  ok('an open group wears no ring', r1.open === 1 && r1.openRinged === 0, JSON.stringify(r1));
  const pulses = await page.locator('.edu-mod-card .edu-pulse').count(); const cardsNow = await page.locator('.edu-mod-card').count();
  ok('inside the open group every ready module invites a tap', pulses >= 2 && pulses === cardsNow, `${pulses} of ${cardsNow} pulsing`);
  ok('the open group still reads in the dark theme', (await audit()).length === 0, (await audit()).slice(0, 3).join(' | '));
  await page.evaluate(() => { const b = document.querySelector('button[aria-expanded="true"]'); if (b) b.click(); }); await page.waitForTimeout(300);
  await checkStrips('in an early years walk-through', ["Let's Color", "Let's Play", "Let's Read"]);
  // The Let's Wonder! title a pre-reader sees on every Wonder question (pass MG): the sweep above never opens a Wonder screen, and
  // there the light theme's deep green read 2.66 to 1. Every color its shimmer passes through must read at 3 to 1 on the page.
  await page.evaluate(() => window.__eduTest.openWonderVoices('w-ants-elephant', 'count-to-5')); await page.waitForTimeout(400);
  await page.evaluate(() => window.__eduTest.goTo('wonder')); await page.waitForTimeout(700);
  for (const [w, tall] of [[360, 780], [1280, 900]]) {
  await page.setViewportSize({ width: w, height: tall }); await page.waitForTimeout(400);
  const title = await page.evaluate(() => {
    const parse = (s) => (String(s).match(/[\d.]+/g) || []).map(Number); const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b); const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
    const h = [...document.querySelectorAll('h1')].find((x) => /Let's Wonder/.test(x.textContent)); if (!h) return null;
    let n = h.parentElement; let bg = null; while (n && n.nodeType === 1) { const c = parse(getComputedStyle(n).backgroundColor); if (c.length >= 3 && (c.length < 4 || c[3] >= 1)) { bg = c; break; } n = n.parentElement; }
    const stops = (getComputedStyle(h).backgroundImage.match(/rgba?\([^)]+\)/g) || []).map(parse);
    return { screen: window.__eduTest.screen, stops: stops.length, clip: getComputedStyle(h).backgroundClip, worst: Math.round(Math.min(...stops.map((s) => ratio(s, bg || [255, 255, 255]))) * 100) / 100 };
  });
  ok(`the Let's Wonder! title at ${w} shows its letters and reads at 3 to 1 or better on every color of its shimmer in the dark theme`, !!title && title.screen === 'wonder' && title.stops >= 3 && title.clip === 'text' && title.worst >= 3, JSON.stringify(title));
  }
  await page.setViewportSize({ width: 360, height: 780 }); await page.waitForTimeout(300);
  await page.evaluate(() => window.__eduTest.goTo('overview')); await page.waitForTimeout(300);
}
await page.reload(); await page.waitForFunction(() => window.__eduTest && window.__eduTest.screen);
ok('the app is still dark after it reloads', (await themeNow()) === 'dark');
await page.evaluate(() => window.__eduTest.goTo('welcome')); await page.waitForTimeout(250);
await page.getByRole('button', { name: 'Light theme' }).click(); await page.waitForTimeout(250);
ok('the sun on the welcome page turns the app light', (await themeNow()) === 'light');
await page.reload(); await page.waitForFunction(() => window.__eduTest && window.__eduTest.screen);
ok('the light choice is remembered after a reload', (await themeNow()) === 'light');
await page.evaluate(() => window.__eduTest.goTo('welcome')); await page.waitForTimeout(250);
await page.getByRole('button', { name: 'Dark theme' }).click(); await page.waitForTimeout(250);
ok('the moon turns it dark again', (await themeNow()) === 'dark');
await page.setViewportSize({ width: 1280, height: 900 }); await page.waitForTimeout(300);
ok('the welcome page reads in the dark theme at 1280', (await audit()).length === 0, (await audit()).slice(0, 3).join(' | '));
await browser.close();
console.log(`\n${pass} passed, ${fail} failed`);
process.exitCode = fail ? 1 : 0;
