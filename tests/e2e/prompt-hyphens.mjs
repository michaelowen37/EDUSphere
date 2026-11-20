// The Wise Human. Copyright (c) 2026. Source-available; not for reuse. See LICENSE.md.
// A question's printed words keep a hyphenated word whole (pass NV, round one's screen read, its MUST FIX 2): the printed question was the
// one learner text drawn without wholeHyphens, so its balanced lines broke "Do you need a grown- / up to say kind words to a sad friend?"
// at 320 to 364 pixels, and the read's sweep found 33 pre-K prompts in 9 banks breaking at a hyphen somewhere from 320 to 440 pixels, 31
// of them older than the pass. In plain terms: as a child the educator added, on the test page with its 8-pixel margin taken off (the
// product's widths, as tests/e2e/fold-check.mjs reads them), every pre-K question whose prompt holds a hyphenated word (each bank at
// seeds 1 to 400) is shown through the app's own screen (window.__eduTest.showQuestion), and at every 8 pixels from 320 to 440, in both
// themes, no hyphenated word of the printed question ([data-question-text]) runs across two lines; a heard question that prints none of
// the words it asks ("Is what you hear the very first sound of the word?") is counted apart. Scrollbars are hidden, as a phone's lie over
// the page, so each width is the line's own. Plant, last, since it writes into a line React draws: Being a good friend's "Do you need a
// grown-up to say kind words to a sad friend?" written into the line as plain text, as it was printed before the fix, must break at its
// hyphen at some width from 320 to 440 in steps of 2.
// Run: ./build.sh && node tests/e2e/make-page.mjs && node tests/e2e/prompt-hyphens.mjs
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const L = await import('../../src/logic.mjs');
let passed = 0, failed = 0;
const ok = (name, cond, info) => { if (cond) { passed++; console.log('PASS - ' + name); } else { failed++; console.log('FAIL - ' + name + (info !== undefined ? '  ' + JSON.stringify(info).slice(0, 900) : '')); } };

// Every pre-K prompt with a hyphenated word, once, with a bank, a seed and a module that deal it.
const HYPHEN = /\w-\w/;
const prompts = new Map();
for (const c of L.COURSES.filter((x) => x.grade === 'PK3' || x.grade === 'PK4')) for (const m of c.modules) for (const g of m.generators) {
  for (let s = 1; s <= 400; s++) { let q; try { q = L.generateQuestion(g, s); } catch (e) { break; } if (q && q.prompt && HYPHEN.test(q.prompt) && !prompts.has(q.prompt)) prompts.set(q.prompt, { g, s, m: m.id }); } }
const list = [...prompts.entries()];
const WIDTHS = Array.from({ length: 16 }, (_, i) => 320 + i * 8);

// Each hyphenated word of an element that runs across two lines, read from its own text's boxes.
const BROKEN = (el) => { if (!el) return ['no question line']; const out = []; const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let n;
  while ((n = walk.nextNode())) for (const m of n.textContent.matchAll(/\S*\w-\w\S*/g)) { const r = document.createRange(); r.setStart(n, m.index); r.setEnd(n, m.index + m[0].length);
    const tops = [...r.getClientRects()].map((x) => Math.round(x.top)); if (tops.length && Math.max(...tops) - Math.min(...tops) > 4) out.push(m[0]); }
  return out; };

// A child the educator added, signed in, as the fold check and the screen read meet the questions (no walk-through notes).
async function childPage(browser, theme) {
  const ctx = await browser.newContext({ viewport: { width: 320, height: 740 }, hasTouch: true, reducedMotion: 'reduce' });
  await ctx.addInitScript((t) => { try { localStorage.setItem('edusphere_v1_theme', t); } catch (e) { /* the theme stays the default */ } }, theme);
  const page = await ctx.newPage(); const errors = []; page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
  await page.goto(new URL('page.html', import.meta.url).href); await page.addStyleTag({ content: 'body { margin: 0 !important; } html { scrollbar-width: none; } ::-webkit-scrollbar { display: none; }' });
  const screenIs = (n) => page.waitForFunction((x) => window.__eduTest && window.__eduTest.screen === x, n, { timeout: 20000 });
  const tapIf = async (name) => { const b = page.getByRole('button', { name, exact: true }); if (await b.count()) { await b.first().click({ force: true }); await page.waitForTimeout(250); } };
  await screenIs('welcome');
  await page.getByRole('button', { name: 'Create account', exact: true }).first().click(); await screenIs('educator-setup');
  await page.fill('input[placeholder="PIN"]', '2468'); await page.fill('input[placeholder="PIN again"]', '2468'); await page.fill('input[placeholder="This device\'s name"]', 'Words'); await page.selectOption('select[aria-label="Your state"]', 'TX');
  await page.getByRole('button', { name: 'Create account', exact: true }).click(); await screenIs('educator-pick');
  for (let k = 0; k < 8; k++) { await page.waitForTimeout(400); for (const n of ['Skip tour', 'Later', 'Got it']) await tapIf(n); }
  await page.getByRole('button', { name: 'Add someone new' }).first().click(); await page.waitForTimeout(300);
  await page.fill('input[placeholder="School-issued ID"]', 'H-1'); await page.getByRole('button', { name: /^Early years/ }).first().click(); await page.waitForTimeout(200);
  await page.getByRole('button', { name: 'Add', exact: true }).click(); await page.waitForTimeout(500); await tapIf('Later');
  await page.getByRole('button', { name: 'Home' }).first().click(); await page.waitForTimeout(500);
  await page.getByRole('button', { name: /H-1$/ }).first().click(); await page.waitForTimeout(900); await tapIf('Later');
  await screenIs('overview');
  return { ctx, page, errors, screenIs };
}
const drawn = (page) => page.evaluate(() => new Promise((res) => { const f = () => new Promise((r) => requestAnimationFrame(() => r())); f().then(f).then(f).then(() => setTimeout(res, 30)); }));

const browser = await chromium.launch();
let plantBroke = null; const errorsAll = [];
try {
  for (const theme of ['light', 'dark']) {
    const { ctx, page, errors, screenIs } = await childPage(browser, theme); const breaks = []; let shown = 0; let unprinted = 0;
    for (const [prompt, { g, s, m }] of list) {
      await page.setViewportSize({ width: 320, height: 740 });
      await page.evaluate(([gg, ss, mm]) => window.__eduTest.showQuestion(gg, ss, mm), [g, s, m]); await screenIs('practice'); await drawn(page);
      const printed = await page.evaluate(() => { const el = document.querySelector('[data-question-text]'); return el ? el.textContent : null; });
      if (printed === null) { breaks.push({ prompt, at: 'no question line' }); continue; } if (!HYPHEN.test(printed)) { unprinted += 1; continue; } shown += 1;
      for (const w of WIDTHS) { await page.setViewportSize({ width: w, height: 740 }); await drawn(page);
        const found = await page.evaluate(`(${BROKEN.toString()})(document.querySelector('[data-question-text]'))`); if (found.length) breaks.push({ prompt, w, found }); }
    }
    ok(`every pre-K question whose printed words hold a hyphenated word keeps it whole at every 8 pixels from 320 to 440, in the ${theme} theme (${list.length} prompts with one, at least the 53 the code has: ${shown} printed with it and read, ${unprinted} heard questions that print none of the words they ask)`,
      list.length >= 53 && shown >= 48 && shown + unprinted === list.length && breaks.length === 0, breaks.slice(0, 6));
    // The plant, last on the light page: Being a good friend's "Do you need a grown-up to say kind words to a sad friend?" written into
    // the line as plain text, as it was printed before the fix, read at every 2 pixels from 320 to 440.
    if (theme === 'light') { const PLANT = 'Do you need a grown-up to say kind words to a sad friend?'; const at = prompts.get(PLANT); plantBroke = [];
      if (at) { await page.setViewportSize({ width: 320, height: 740 }); await page.evaluate(([gg, ss, mm]) => window.__eduTest.showQuestion(gg, ss, mm), [at.g, at.s, at.m]); await screenIs('practice'); await drawn(page);
        await page.evaluate((p) => { document.querySelector('[data-question-text]').textContent = p; }, PLANT);
        for (let w = 320; w <= 440; w += 2) { await page.setViewportSize({ width: w, height: 740 }); await drawn(page); const found = await page.evaluate(`(${BROKEN.toString()})(document.querySelector('[data-question-text]'))`); if (found.length) plantBroke.push(w); } } }
    errorsAll.push(...errors); await ctx.close();
  }
} finally { await browser.close(); }
ok(`the plant: Being a good friend's "Do you need a grown-up to say kind words to a sad friend?" written into the question line as plain text, as it was printed before pass NV, breaks at its hyphen (at ${plantBroke && plantBroke.length ? plantBroke.join(', ') : 'no width'} of 320 to 440 in steps of 2), so the measure can see a break`, Array.isArray(plantBroke) && plantBroke.length > 0, plantBroke);
ok('no page error while the questions were shown', errorsAll.length === 0, errorsAll.slice(0, 3));
console.log(`${passed} passed, ${failed} failed`); process.exitCode = failed ? 1 : 0;
