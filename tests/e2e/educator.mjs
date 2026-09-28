// Educator housekeeping on the backup page (2026-09-26, Mikey: a Change PIN link under Start over). A wrong current PIN
// and mismatched new PINs are refused in plain words; a good change saves, and the new PIN opens the educator side.
import { createRequire } from 'node:module'; import { pathToFileURL } from 'node:url';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
let passed = 0, failed = 0; const ok = (name, cond) => { if (cond) { passed++; console.log('PASS - ' + name); } else { failed++; console.log('FAIL - ' + name); } };
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const text = () => page.evaluate(() => document.body.innerText);
await page.goto(pathToFileURL(new URL('./page.html', import.meta.url).pathname).href);
await page.waitForFunction(() => window.__eduTest && window.__eduTest.screen === 'welcome');
await page.getByRole('button', { name: 'Create account' }).click(); await page.waitForTimeout(300);
await page.fill('input[placeholder="PIN"]', '2468'); await page.fill('input[placeholder="PIN again"]', '2468');
await page.fill('input[placeholder="This device\'s name"]', 'G'); await page.selectOption('select[aria-label="Your state"]', 'TX');
await page.getByRole('button', { name: 'Create account', exact: true }).click();
await page.waitForFunction(() => window.__eduTest.screen === 'educator-pick'); await page.waitForTimeout(500);
for (const name of ['Skip tour', 'Later', 'Got it']) { const b = page.getByRole('button', { name }); if (await b.count()) { await b.first().click({ force: true }); await page.waitForTimeout(150); } }
await page.evaluate(() => window.__eduTest.goTo('backup')); await page.waitForTimeout(400);
const t0 = await text();
ok('the Change PIN link sits under Start over', t0.indexOf('Change PIN') > t0.indexOf('Start over as a new educator') && t0.indexOf('Start over as a new educator') > 0);
await page.getByRole('button', { name: 'Change PIN' }).click(); await page.waitForTimeout(200);
const fill = async (a, b, c) => { await page.fill('input[placeholder="Current PIN"]', a); await page.fill('input[placeholder="New PIN"]', b); await page.fill('input[placeholder="New PIN again"]', c); await page.getByRole('button', { name: 'Save new PIN' }).click(); await page.waitForTimeout(250); };
await fill('1111', '1357', '1357');
ok('a wrong current PIN is refused', (await text()).includes('That is not the current PIN.'));
await fill('2468', '1357', '1358');
ok('two new PINs that differ are refused', (await text()).includes('The two new PINs do not match.'));
await fill('2468', '135', '135');
ok('a new PIN under four digits is refused', (await text()).includes('The new PIN needs at least four digits.'));
await fill('2468', '1357', '1357');
ok('a good change is saved and says so', (await text()).includes('Your PIN is changed.'));
await page.evaluate(() => window.__eduTest.goTo('educator-pin')); await page.waitForTimeout(300);
await page.fill('input[placeholder="PIN"]', '2468'); await page.waitForTimeout(300);
const oldStillOut = await page.evaluate(() => window.__eduTest.screen === 'educator-pin');
await page.fill('input[placeholder="PIN"]', ''); await page.waitForTimeout(100);
await page.fill('input[placeholder="PIN"]', '1357'); await page.waitForTimeout(400);
ok('the old PIN no longer opens the educator side, and the new one does', oldStillOut && (await page.evaluate(() => window.__eduTest.screen)) !== 'educator-pin');
await browser.close();
console.log(`${passed} passed, ${failed} failed`); process.exitCode = failed ? 1 : 0;
