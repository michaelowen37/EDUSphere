// Dragging with a desktop mouse (2026-09-26, Mikey: on a desktop nothing dragged, though a long press looked as if it
// would). A mouse drag moves a piece; it still moves when the browser refuses pointer capture, as Safari can; and the
// browser's own drag of anything inside a game board is stopped, so it cannot cancel the game's drag. Since pass MK it also
// plays Step on the Circles: a wrong step, its wobble inside the cell, a tap two cells away and a cut corner.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
let passed = 0, failed = 0; const ok = (name, cond) => { if (cond) { passed++; console.log('PASS - ' + name); } else { failed++; console.log('FAIL - ' + name); } };
const browser = await chromium.launch();
// Every tap waits out the page's settle window (pass JM): a new screen asks for its top again at 80 and 320 ms, and a tap whose
// scroll lands inside that window is undone before it arrives. The app marks the window's end in window.__eduSettleUntil.
function settleTaps(pg) { const proto = Object.getPrototypeOf(pg.locator('body')); if (proto.__settleWrapped) return; const click = proto.click; proto.click = async function (...a) { await this.page().waitForFunction(() => !window.__eduSettleUntil || Date.now() >= window.__eduSettleUntil, null, { timeout: 5000 }).catch(() => {}); return click.apply(this, a); }; proto.__settleWrapped = true; }
async function setup(refuseCapture) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  if (refuseCapture) await page.addInitScript(() => { Element.prototype.setPointerCapture = function () { throw new Error('refused'); }; });
  settleTaps(page);
  await page.goto(new URL('./page.html', import.meta.url).href);
  await page.waitForFunction(() => window.__eduTest && window.__eduTest.screen === 'welcome');
  await page.getByRole('button', { name: 'Create account' }).click(); await page.waitForTimeout(300);
  await page.fill('input[placeholder="PIN"]', '2468'); await page.fill('input[placeholder="PIN again"]', '2468');
  await page.fill('input[placeholder="This device\'s name"]', 'G'); await page.selectOption('select[aria-label="Your state"]', 'TX');
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await page.waitForFunction(() => window.__eduTest.screen === 'educator-pick'); await page.waitForTimeout(500);
  for (const name of ['Skip tour', 'Later', 'Got it']) { const b = page.getByRole('button', { name }); if (await b.count()) { await b.first().click({ force: true }); await page.waitForTimeout(150); } }
  await page.getByLabel(/Walk through early years/i).first().click({ force: true });
  await page.waitForFunction(() => window.__eduTest.screen === 'overview');
  // The new screen asks for its top again at 80 and 320 ms, so the first tap waits for that (pass JK: the settle-scroll race
  // twice sent the Let's Play tap to the wrong spot, and the games list never opened).
  await page.waitForTimeout(400);
  return page;
}
// Since pass MP a game opened from its tile plays its welcome first, its board playing itself and taking no hand of a child's: the
// test skips it and taps Begin, as a child who knows the game would, then drags on the game's own board.
async function openGame(page, title) {
  await page.getByRole('button', { name: "Let's Play" }).first().click({ force: true }); await page.waitForTimeout(400);
  await page.getByRole('button', { name: title }).first().click({ force: true }); await page.waitForTimeout(700);
  const skip = page.getByRole('button', { name: 'Skip the instructions' }); if (await skip.count()) { await skip.first().click({ force: true }); await page.waitForTimeout(300); }
  const begin = page.getByRole('button', { name: 'Begin', exact: true }); if (await begin.count()) { await begin.first().click({ force: true }); await page.waitForTimeout(600); }
}
async function dragFirst(page) {
  const box = page.locator('.edu-game-box').first(); const item = box.locator('[style*="cursor: grab"]').first();
  const b = await item.boundingBox(); const bb = await box.boundingBox(); const before = await item.evaluate((el) => el.style.left + ' ' + el.style.top);
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.mouse.down(); await page.waitForTimeout(250);
  for (let k = 1; k <= 10; k++) { await page.mouse.move(b.x + b.width / 2 + (bb.x + bb.width * 0.25 - b.x - b.width / 2) * k / 10, b.y + b.height / 2 + (bb.y + bb.height * 0.8 - b.y - b.height / 2) * k / 10); await page.waitForTimeout(25); }
  const mid = await item.evaluate((el) => el.style.left + ' ' + el.style.top);
  await page.mouse.up(); await page.waitForTimeout(300);
  return { before, mid };
}
let page = await setup(false);
await openGame(page, 'Play Big and Small');
let r = await dragFirst(page);
ok('a desktop mouse drags a piece across the board', r.mid !== r.before && r.mid.startsWith('25%'));
ok('the board turns off selection for every browser, Safari included', await page.locator('.edu-game-box').first().evaluate((el) => el.style.userSelect === 'none' && el.style.webkitUserSelect === 'none'));
const prevented = await page.locator('.edu-game-box').first().evaluate((el) => { const ev = new Event('dragstart', { bubbles: true, cancelable: true }); (el.firstElementChild || el).dispatchEvent(ev); return ev.defaultPrevented; });
ok('the browser cannot start its own drag inside a game board', prevented === true);
await page.close();
page = await setup(true);
await openGame(page, 'Play Red and Blue');
r = await dragFirst(page);
ok('a drag still works when the browser refuses pointer capture, as Safari can', r.mid !== r.before && r.mid.startsWith('25%'));
// The student cards on the Classroom page (2026-09-26, Mikey: this is the drag he meant). Press and hold a card with the
// mouse, move it below the others, and let go: the order changes and stays.
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(new URL('./page.html', import.meta.url).href);
  await page.waitForFunction(() => window.__eduTest && window.__eduTest.screen === 'welcome');
  await page.getByRole('button', { name: 'Create account' }).click(); await page.waitForTimeout(300);
  await page.fill('input[placeholder="PIN"]', '2468'); await page.fill('input[placeholder="PIN again"]', '2468');
  await page.fill('input[placeholder="This device\'s name"]', 'G'); await page.selectOption('select[aria-label="Your state"]', 'TX');
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await page.waitForFunction(() => window.__eduTest.screen === 'educator-pick'); await page.waitForTimeout(500);
  for (const name of ['Skip tour', 'Later', 'Got it']) { const b = page.getByRole('button', { name }); if (await b.count()) { await b.first().click({ force: true }); await page.waitForTimeout(150); } }
  for (const id of ['S-3001', 'S-3002', 'S-3003']) {
    await page.getByRole('button', { name: 'Add someone new' }).first().click(); await page.waitForTimeout(200);
    await page.fill('input[placeholder="School-issued ID"]', id);
    await page.getByRole('button', { name: /^Elementary/ }).first().click();
    await page.getByRole('button', { name: 'Add', exact: true }).click(); await page.waitForTimeout(400);
  }
  const order = () => page.evaluate(() => { const t = document.body.innerText; return ['S-3001', 'S-3002', 'S-3003'].map((id) => [id, t.indexOf(id)]).sort((a, b) => a[1] - b[1]).map((x) => x[0]).join(' '); });
  const before = await order();
  const first = await page.getByText('S-3001', { exact: true }).first().boundingBox();
  const last = await page.getByText('S-3003', { exact: true }).first().boundingBox();
  await page.mouse.move(first.x + first.width / 2, first.y + first.height / 2); await page.mouse.down(); await page.waitForTimeout(650);
  const target = last.y + last.height + 120;
  for (let k = 1; k <= 12; k++) { await page.mouse.move(first.x + first.width / 2, first.y + first.height / 2 + (target - first.y - first.height / 2) * k / 12); await page.waitForTimeout(30); }
  const lifted = await page.evaluate(() => [...document.querySelectorAll('div')].some((d) => /translateY\((?!0px)/.test(d.style.transform || '')));
  await page.mouse.up(); await page.waitForTimeout(700);
  const after = await order();
  ok('a held student card follows a desktop mouse', lifted === true);
  ok('letting go below the others moves the student to the end', before === 'S-3001 S-3002 S-3003' && after === 'S-3002 S-3003 S-3001');
  const stored = await page.evaluate(async () => { const r = JSON.parse((await window.storage.get('edusphere_v1_roster')).value); return r.students.filter((x) => typeof x.order === 'number').sort((x, y) => x.order - y.order).map((x) => x.label).join(' '); });
  ok('the new order is saved with the classroom', stored === 'S-3002 S-3003 S-3001');
  await page.close();
}
// Step on the Circles (pass MK, the game check and its second read). A wrong step wears a clay edge while its chip wobbles
// inside its own cell (the page's 9px wobble, read in the board's 100 units, had swung the chip about 30 pixels, out of its
// cell); a tap on a circle two steps away does nothing, even with a small slip of the finger, since the young instructions say
// one at a time; and a finger that cuts a corner, even through the wrong cell, steps the dot through the right cell between, so
// a whole board dragged that way reaches Done. These pages run with motion on, so the wobble is measured as it moves.
{
  const page = await setup(false);
  await page.evaluate(() => window.__eduTest.openColoring('play:path-circles')); await page.waitForTimeout(900);
  const begin = page.getByRole('button', { name: 'Begin', exact: true }); if (await begin.count()) { await begin.first().click({ force: true }); await page.waitForTimeout(300); }
  const N = 5; const top = 6, s = 94 / N, left = (100 - N * s) / 2;
  // The board as drawn: every cell's middle on screen, and whether its chip is a circle (the star's corner counts as right).
  const board = () => page.evaluate(() => [...document.querySelectorAll('.edu-game-box svg > g')].map((g) => { const r = g.querySelector('rect').getBoundingClientRect(); return { yes: !!g.querySelector(':scope > g > circle, :scope > g > path'), x: r.x + r.width / 2, y: r.y + r.height / 2 }; }));
  const at = (cells, r, c) => cells[r * N + c];
  // The dot's trail, read from the drawn line in board units and turned back into cells.
  const trail = async () => (await page.evaluate(() => document.querySelector('.edu-game-box svg polyline').getAttribute('points'))).trim().split(/\s+/).map((p) => p.split(',').map(Number)).map(([x, y]) => `${Math.round((y - top - s / 2) / s)},${Math.round((x - left - s / 2) / s)}`).join(' > ');
  const newRound = async () => { await page.getByLabel('Play again').first().click({ force: true }); await page.waitForTimeout(250); };
  // Each case starts on a fresh board, so one case's dot never carries into the next.
  const find = async (want) => { for (let k = 0; k < 60; k++) { await newRound(); const cells = await board(); if (want(cells)) return cells; } return null; };
  // A wrong step beside the dot: every frame for a second, the cell's edge, the chip's wobble and whether the chip is inside its cell.
  { const cells = await find((cs) => !at(cs, 0, 1).yes || !at(cs, 1, 0).yes);
    const [wr, wc] = !at(cells, 0, 1).yes ? [0, 1] : [1, 0]; const cell = at(cells, wr, wc);
    await page.mouse.move(cell.x, cell.y); await page.mouse.down();
    const frames = await page.evaluate(([r, c, n]) => new Promise((done) => { const g = document.querySelectorAll('.edu-game-box svg > g')[r * n + c]; const rect = g.querySelector('rect'); const chip = g.querySelector(':scope > g'); const out = []; const t0 = performance.now();
      const step = () => { const t = performance.now() - t0; const cb = chip.getBoundingClientRect(); const rb = rect.getBoundingClientRect();
        out.push({ wob: chip.classList.contains('edu-wobble-chip'), sw: rect.getAttribute('stroke-width'), inside: cb.left >= rb.left - 0.5 && cb.right <= rb.right + 0.5 && cb.top >= rb.top - 0.5 && cb.bottom <= rb.bottom + 0.5 });
        if (t < 1000) requestAnimationFrame(step); else done(out); };
      requestAnimationFrame(step); }), [wr, wc, N]);
    await page.mouse.up(); await page.waitForTimeout(100);
    const on = frames.filter((f) => f.wob); const last = frames[frames.length - 1];
    ok('a wrong step wears the clay edge while its chip wobbles, and both clear after it', on.length > 5 && frames.some((f) => f.sw === '1.6') && last.sw === '0.5' && !last.wob);
    ok('the wrong step\'s chip stays inside its own cell in every frame of its wobble', on.length > 5 && frames.every((f) => f.inside));
    ok('a wrong step leaves the dot where it was', (await trail()) === '0,0'); }
  // A tap on a circle diagonal to the dot, then a press there with a small slip; then, on a fresh board, a drag from the dot across the corner.
  { const cells = await find((cs) => at(cs, 1, 1).yes && (at(cs, 0, 1).yes || at(cs, 1, 0).yes));
    const d = at(cells, 1, 1); const o = at(cells, 0, 0);
    await page.mouse.move(d.x, d.y); await page.mouse.down(); await page.waitForTimeout(60); await page.mouse.up(); await page.waitForTimeout(150);
    const tapped = await trail();
    await page.mouse.move(d.x - 2, d.y - 1); await page.mouse.down(); await page.mouse.move(d.x + 2, d.y + 1, { steps: 3 }); await page.waitForTimeout(40); await page.mouse.up(); await page.waitForTimeout(150);
    const slipped = await trail();
    ok('a tap on a circle two steps away leaves the dot where it was, with or without a small slip of the finger', tapped === '0,0' && slipped === '0,0'); }
  { const cells = await find((cs) => at(cs, 1, 1).yes && (at(cs, 0, 1).yes || at(cs, 1, 0).yes));
    const d = at(cells, 1, 1); const o = at(cells, 0, 0);
    await page.mouse.move(o.x, o.y); await page.mouse.down(); await page.mouse.move(d.x, d.y, { steps: 2 }); await page.waitForTimeout(60); await page.mouse.up(); await page.waitForTimeout(150);
    ok('a finger dragged from the dot across a corner steps the dot through the right cell between', /^0,0 > (0,1|1,0) > 1,1$/.test(await trail())); }
  // A corner cut through the wrong cell: the wrong cell flashes, and the dot still steps through the right one.
  { const cells = await find((cs) => at(cs, 1, 1).yes && at(cs, 0, 1).yes !== at(cs, 1, 0).yes);
    const d = at(cells, 1, 1); const o = at(cells, 0, 0); const wrongMid = at(cells, 0, 1).yes ? at(cells, 1, 0) : at(cells, 0, 1);
    await page.mouse.move(o.x, o.y); await page.mouse.down(); await page.mouse.move(wrongMid.x, wrongMid.y, { steps: 3 }); await page.waitForTimeout(60);
    const flashed = await page.evaluate(() => [...document.querySelectorAll('.edu-game-box svg > g > rect')].some((r) => r.getAttribute('stroke-width') === '1.6'));
    await page.mouse.move(d.x, d.y, { steps: 3 }); await page.waitForTimeout(80); await page.mouse.up(); await page.waitForTimeout(150);
    ok('a finger that cuts a corner through the wrong cell flashes it, then steps the dot through the right cell between', flashed && (await trail()) === `0,0 > ${at(cells, 0, 1).yes ? '0,1' : '1,0'} > 1,1`); }
  // A whole board, dragged along a path of circles found breadth first, every corner cut.
  { await newRound(); const cells = await board(); const key = (r, c) => `${r},${c}`;
    const prev = new Map([[key(0, 0), null]]); const q = [[0, 0]];
    while (q.length) { const [r, c] = q.shift(); for (const [dr, dc] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) { const R = r + dr, C2 = c + dc; if (R < 0 || C2 < 0 || R >= N || C2 >= N || prev.has(key(R, C2)) || !at(cells, R, C2).yes) continue; prev.set(key(R, C2), [r, c]); q.push([R, C2]); } }
    const path = []; let cur = [N - 1, N - 1]; while (cur) { path.unshift(cur); cur = prev.get(key(...cur)); }
    const fingers = [path[0]]; for (let i = 1; i < path.length; i++) { const nxt = path[i + 1]; const lastF = fingers[fingers.length - 1]; if (nxt && Math.abs(nxt[0] - lastF[0]) === 1 && Math.abs(nxt[1] - lastF[1]) === 1) { fingers.push(nxt); i++; } else fingers.push(path[i]); }
    const o = at(cells, 0, 0); await page.mouse.move(o.x, o.y); await page.mouse.down();
    for (const [r, c] of fingers.slice(1)) { const t = at(cells, r, c); await page.mouse.move(t.x, t.y, { steps: 2 }); await page.waitForTimeout(40); }
    await page.mouse.up(); await page.waitForTimeout(400);
    ok('a whole board dragged with every corner cut reaches Done', path[0][0] === 0 && fingers.length < path.length && (await page.locator('.edu-game-box [aria-label="Done"]').count()) === 1); }
  await page.close();
}
await browser.close();
console.log(`${passed} passed, ${failed} failed`); process.exitCode = failed ? 1 : 0;
