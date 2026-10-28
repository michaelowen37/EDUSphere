// The Wise Human. Copyright (c) 2026. Source-available; not for reuse. See LICENSE.md.
// The reading lists' Details (pass MR, Mikey: "Maybe we can add a short conversational summary for each book and it could be a
// popup that shows after somebody clicks "Details."", with "incomplete horizontal lines between books"). In plain terms: an
// educator opens Reading Lists on a phone, opens each grade's list, and every book there has a Details button; one book in each
// list is opened, and its pop-up shows that book's title, its author and exactly its summary from BOOK_NOTES in src/logic.mjs.
// Got it, a tap on the dimmed page around the card and the Escape key each close it, taking turns. Between every two books sits
// a short rule that stops short of both sides of the list, and nothing on the screen runs past its right edge. Both themes.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const L = await import('../../src/logic.mjs');
let passed = 0, failed = 0; const ok = (name, cond, info) => { if (cond) { passed++; console.log('PASS - ' + name); } else { failed++; console.log('FAIL - ' + name + (info ? '  ' + JSON.stringify(info) : '')); } };
const pageUrl = new URL('./page.html', import.meta.url).href;
const grades = [...L.gradesWithCourses(), 'grown'].filter((g) => L.readingListFor(g).length);
const titleOf = (g) => (g === 'grown' ? 'For parents, educators and advanced readers' : L.gradeLabel(g));
// What a list shows (its books in order, how many have a Details button, its rules and whether each stops short of both sides),
// and what an open Details card shows; each is judged by the functions after it, which the planted faults below also run.
const readList = (page, grade) => page.evaluate((g) => { const list = document.querySelector(`[data-book-list="${g}"]`); if (!list) return null; const lb = list.getBoundingClientRect();
  const books = [...list.querySelectorAll('[data-book]')]; const rules = [...list.querySelectorAll('.edu-book-rule')].map((r) => r.getBoundingClientRect());
  return { books: books.map((b) => b.dataset.book), pills: books.filter((b) => b.querySelector('.edu-book-details')).length, rules: rules.length, short: rules.every((r) => r.left > lb.left + 4 && r.right < lb.right - 4 && r.height >= 0.5 && r.height <= 2) }; }, grade);
const listOk = (seen, want) => !!seen && seen.books.length === want.length && seen.books.every((t, i) => t === want[i]) && seen.pills === want.length && seen.rules === want.length - 1 && seen.short;
const readDialog = (page) => page.evaluate(() => { const d = document.querySelector('[data-book-detail]'); if (!d) return null; const r = d.getBoundingClientRect(); return { book: d.dataset.bookDetail, text: d.textContent, inside: r.left >= 0 && r.right <= window.innerWidth + 0.5, dialog: !!d.closest('[role="dialog"]') }; });
const dialogOk = (shown, t) => { const parts = L.bookParts(t); return !!shown && shown.book === t && shown.dialog && shown.inside && shown.text.includes(parts.title) && (!parts.by || shown.text.includes(`by ${parts.by}`)) && shown.text.includes(L.bookNote(t)); };
const browser = await chromium.launch();
for (const theme of ['light', 'dark']) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  await context.addInitScript((t) => { try { localStorage.setItem('edusphere_v1_theme', t); } catch (e) {} }, theme);
  const page = await context.newPage();
  await page.goto(pageUrl);
  await page.waitForFunction(() => window.__eduTest && window.__eduTest.screen === 'welcome');
  await page.getByRole('button', { name: 'Educator Login' }).click(); await page.waitForTimeout(300);
  await page.fill('input[placeholder="PIN"]', '2468'); await page.fill('input[placeholder="PIN again"]', '2468');
  await page.fill('input[placeholder="This device\'s name"]', 'Books'); await page.selectOption('select[aria-label="Your state"]', 'TX');
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await page.waitForFunction(() => window.__eduTest.screen === 'educator-pick'); await page.waitForTimeout(700);
  for (const name of ['Skip tour', 'Later', 'Got it', 'Close']) { const b = page.getByRole('button', { name, exact: true }); if (await b.count()) { await b.first().click({ force: true }); await page.waitForTimeout(200); } }
  await page.getByRole('button', { name: 'Reading Lists', exact: true }).first().click();
  await page.waitForFunction(() => window.__eduTest.screen === 'reading-lists');
  const rows = []; const opened = []; const closes = { 'Got it': 0, backdrop: 0, Escape: 0 }; const ways = ['Got it', 'backdrop', 'Escape'];
  for (const [k, g] of grades.entries()) {
    // Open this grade's list by its own header, named exactly (Grade 1's name is the start of Grade 10's).
    await page.evaluate((title) => { const b = [...document.querySelectorAll('button[aria-expanded]')].find((x) => x.querySelector('span') && x.querySelector('span').textContent === title); if (b && b.getAttribute('aria-expanded') !== 'true') b.click(); }, titleOf(g));
    await page.waitForTimeout(250);
    const want = L.readingListFor(g);
    const seen = await readList(page, g);
    rows.push({ g, ok: listOk(seen, want), seen: seen && { books: seen.books.length, pills: seen.pills, rules: seen.rules, short: seen.short }, want: want.length });
    // One book a list, a different place in each list: its Details, read whole, then closed one of three ways in turn.
    const t = want[(k * 7) % want.length]; const parts = L.bookParts(t); const note = L.bookNote(t);
    await page.locator(`[data-book-list="${g}"] [data-book="${t.replace(/"/g, '\\"')}"] .edu-book-details`).click();
    await page.waitForSelector('[data-book-detail]', { timeout: 3000 }).catch(() => {});
    const shown = await readDialog(page);
    const way = ways[k % 3];
    if (way === 'Got it') await page.locator('[data-book-detail]').getByRole('button', { name: 'Got it', exact: true }).click();
    else if (way === 'backdrop') await page.mouse.click(6, 6);
    else await page.keyboard.press('Escape');
    await page.waitForTimeout(250);
    const gone = (await page.locator('[data-book-detail]').count()) === 0; if (gone) closes[way] += 1;
    opened.push({ g, t, ok: dialogOk(shown, t) && gone, way, shown: shown && { book: shown.book, inside: shown.inside, hasNote: shown.text.includes(note) }, gone });
  }
  const wide = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
  ok(`${theme} theme: every list (${grades.length}) shows each of its books in order with a Details button, and a short rule between every two books that stops short of both sides`, rows.every((r) => r.ok), rows.filter((r) => !r.ok).slice(0, 4));
  ok(`${theme} theme: a book in every list opens its own summary under its title and author, inside the screen, and Got it, the dimmed page and Escape each close it`, opened.every((o) => o.ok) && ways.every((w) => closes[w] >= 1), { bad: opened.filter((o) => !o.ok).slice(0, 4), closes });
  ok(`${theme} theme: nothing on the reading lists runs past the screen's right edge`, wide);
  if (theme === 'light') {
    // The planted faults: a book's Details button taken away, and an open card showing another book's summary; each must fail.
    const g = grades[0]; const want = L.readingListFor(g); const t = want[0]; const other = L.bookNote(want[1]);
    await page.evaluate(([grade, book]) => { const b = document.querySelector(`[data-book-list="${grade}"] [data-book="${book}"] .edu-book-details`); if (b) b.remove(); }, [g, want[1]]);
    const missing = listOk(await readList(page, g), want);
    await page.locator(`[data-book-list="${g}"] [data-book="${t}"] .edu-book-details`).click(); await page.waitForSelector('[data-book-detail]');
    await page.evaluate((text) => { const ps = document.querySelectorAll('[data-book-detail] p'); ps[ps.length - 1].textContent = text; }, other);
    const swapped = dialogOk(await readDialog(page), t);
    ok('the reads fail a missing Details button and a card showing another book\'s summary', missing === false && swapped === false, { missing, swapped });
  }
  await context.close();
}
// On short phones (round one's screen check, pass MR: at 320 by 568 nearly every card began above the screen, and its Got it sat
// below it, with no way to scroll): the longest summaries open with the card's top on the screen, and Got it can be reached and
// tapped. The card that rose above the screen is the planted fault, held to the same read.
{ const longest = grades.flatMap((g) => L.readingListFor(g).map((t) => ({ g, t, n: (L.bookNote(t) || '').length + t.length }))).sort((a, b) => b.n - a.n).slice(0, 3);
  for (const [w, h] of [[320, 568], [360, 640]]) {
    const context = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: true }); const page = await context.newPage();
    await page.goto(pageUrl); await page.waitForFunction(() => window.__eduTest && window.__eduTest.screen === 'welcome');
    await page.getByRole('button', { name: 'Educator Login' }).click(); await page.waitForTimeout(300);
    await page.fill('input[placeholder="PIN"]', '2468'); await page.fill('input[placeholder="PIN again"]', '2468');
    await page.fill('input[placeholder="This device\'s name"]', 'Books'); await page.selectOption('select[aria-label="Your state"]', 'TX');
    await page.getByRole('button', { name: 'Create account', exact: true }).click();
    await page.waitForFunction(() => window.__eduTest.screen === 'educator-pick'); await page.waitForTimeout(700);
    for (const name of ['Skip tour', 'Later', 'Got it', 'Close']) { const b = page.getByRole('button', { name, exact: true }); if (await b.count()) { await b.first().click({ force: true }); await page.waitForTimeout(200); } }
    await page.getByRole('button', { name: 'Reading Lists', exact: true }).first().click(); await page.waitForFunction(() => window.__eduTest.screen === 'reading-lists');
    const reads = [];
    for (const { g, t } of longest) {
      await page.evaluate((title) => { const b = [...document.querySelectorAll('button[aria-expanded]')].find((x) => x.querySelector('span') && x.querySelector('span').textContent === title); if (b && b.getAttribute('aria-expanded') !== 'true') b.click(); }, titleOf(g));
      await page.waitForTimeout(250);
      await page.locator(`[data-book-list="${g}"] [data-book="${t.replace(/"/g, '\\"')}"] .edu-book-details`).click(); await page.waitForSelector('[data-book-detail]'); await page.waitForTimeout(300);
      const top = await page.evaluate(() => Math.round(document.querySelector('[data-book-detail]').getBoundingClientRect().top));
      const gotIt = page.locator('[data-book-detail]').getByRole('button', { name: 'Got it', exact: true });
      await gotIt.scrollIntoViewIfNeeded(); const box = await gotIt.boundingBox(); const reach = !!box && box.y >= 0 && box.y + box.height <= h + 1;
      await gotIt.click(); await page.waitForTimeout(250); const gone = (await page.locator('[data-book-detail]').count()) === 0;
      reads.push({ t, top, reach, gone });
    }
    ok(`at ${w} by ${h} the longest Details open with the card's top on the screen, and Got it can be scrolled to and tapped`, reads.every((r) => r.top >= 0 && r.reach && r.gone), reads);
    if (w === 320) { // the planted fault: the card pushed above the screen's top must fail the same read
      const { g, t } = longest[0]; await page.locator(`[data-book-list="${g}"] [data-book="${t.replace(/"/g, '\\"')}"] .edu-book-details`).click(); await page.waitForSelector('[data-book-detail]');
      await page.evaluate(() => { document.querySelector('[data-book-detail]').style.marginTop = '-160px'; }); await page.waitForTimeout(100);
      const top = await page.evaluate(() => Math.round(document.querySelector('[data-book-detail]').getBoundingClientRect().top));
      ok('the read fails a card pushed above the screen', top < 0, { top }); }
    await context.close();
  }
}
await browser.close();
console.log(`\n${passed} passed, ${failed} failed`);
process.exitCode = failed ? 1 : 0;   // never process.exit(): it can drop the last lines of a piped stdout (CLAUDE.md, 2026-09-23)
