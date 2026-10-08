// The quick look back and Action Items, walked in the real page (pass LM; Mikey asked for the feature to be tested as a
// student in every outcome and as an educator). In plain terms: a made-up educator adds two students, a test-only hook gives
// them weeks of history, and the walk then signs in as each side and clicks through what a real person would see.
import { createRequire } from 'node:module'; import { pathToFileURL } from 'node:url'; import { execSync } from 'node:child_process';
const G = execSync('npm root -g').toString().trim(); const { chromium } = createRequire(import.meta.url)(`${G}/playwright`);
let passed = 0, failed = 0; const ok = (name, cond, info) => { if (cond) { passed++; console.log('PASS - ' + name); } else { failed++; console.log('FAIL - ' + name + (info ? '  ' + JSON.stringify(info).slice(0, 300) : '')); } };
const shots = process.argv[2] || null;
const browser = await chromium.launch(); const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, reducedMotion: 'reduce' });
const errors = []; page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
await page.goto(pathToFileURL(new URL('./page.html', import.meta.url).pathname).href);
const screen = () => page.evaluate(() => window.__eduTest && window.__eduTest.screen);
const screenIs = (n) => page.waitForFunction((x) => window.__eduTest && window.__eduTest.screen === x, n, { timeout: 15000 });
const text = async () => (await page.evaluate(() => document.body.innerText)).replace(/\s+/g, ' ');
const snap = async (name) => { if (shots) await page.screenshot({ path: `${shots}/${name}.png` }); };
const tapIf = async (name) => { const b = page.getByRole('button', { name, exact: true }); if (await b.count()) { await b.first().click(); await page.waitForTimeout(300); return true; } return false; };
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
await page.getByRole('button', { name: 'Move Forward' }).click(); await page.waitForTimeout(600); await snap('2-popup-paper');
t = await text();
ok('Move Forward brings up the paper as "2 of 2", with Review', /2 of 2/.test(t) && /S-88 has submitted a paper for review\./.test(t) && (await page.getByRole('button', { name: 'Review' }).count()) === 1);
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
ok('no page errors along the way', errors.length === 0, errors);
await browser.close();
console.log(`\n${passed} passed, ${failed} failed`);
process.exitCode = failed ? 1 : 0;   // never process.exit() (CLAUDE.md, 2026-09-23)
