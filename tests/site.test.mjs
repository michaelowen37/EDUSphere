// The standalone page (index.html), the one GitHub Pages serves. Opens it in a real browser, signs in as an educator, adds a student,
// reloads the page, and checks the student is still there. That is the whole promise of
// local-first: what you did survives a reload because it lives in the browser's storage.
import { createRequire } from 'node:module'; import { execSync } from 'node:child_process'; import { pathToFileURL } from 'node:url';
const G = execSync('npm root -g').toString().trim(); const { chromium } = createRequire(import.meta.url)(`${G}/playwright`);
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 390, height: 844 } }); const page = await ctx.newPage();
const errors = []; page.on('pageerror', (e) => errors.push(String(e)));
const url = pathToFileURL('index.html').href;
await page.goto(url);
await page.getByRole('button', { name: 'Create account' }).click();
await page.fill('input[placeholder="PIN"]', '2468');
await page.fill('input[placeholder="PIN again"]', '2468');
await page.fill('input[placeholder="This device\'s name"]', 'Front desk');
await page.selectOption('select[aria-label="Your state"]', 'CA');
await page.getByRole('button', { name: 'Create account', exact: true }).click();
{ const skip = page.getByRole('button', { name: 'Skip tour' }); if (await skip.count()) await skip.click({ force: true }); }
{ const later = page.getByRole('button', { name: 'Later' }); if (await later.count()) await later.click(); }
// The what's-new pop-up appears once per build on the real page; dismiss it the way an educator would.
{ const got = page.getByRole('button', { name: 'Got it' }); if (await got.count()) await got.click(); }
await page.getByRole('button', { name: 'Add someone new' }).click();
await page.fill('input[placeholder="School-issued ID"]', 'S-777');
await page.getByRole('button', { name: /^Elementary/ }).click();
await page.getByRole('button', { name: 'Add', exact: true }).click();
await page.waitForTimeout(300);
const before = await page.textContent('#root');
await page.reload();
await page.waitForTimeout(800);
const after = await page.textContent('#root');
let pass = 0, fail = 0;
const ok = (name, cond) => { if (cond) { pass++; console.log('PASS -', name); } else { fail++; console.log('FAIL -', name); } };
ok('the standalone page runs and a student can be added', before.includes('S-777'));
ok('what was done survives a reload, because it lives in the browser', after.includes('S-777'));
const createOffered = (await page.getByRole('button', { name: 'Create account' }).count()) > 0;
ok('the account, device name and state are remembered too', !createOffered);
ok('no browser errors on the standalone page', errors.length === 0);
await b.close();
console.log(`\n${pass} passed, ${fail} failed`);
process.exitCode = fail ? 1 : 0;   // never process.exit(): it can drop the last lines of a piped stdout (2026-09-23)
