// The Wise Human. Copyright (c) 2026. Source-available; not for reuse. See LICENSE.md.
// Every drawing on an answer tile reads at its edge (pass ND, EARMARKS A89, the screen read). Since pass MZ each pass measured the
// drawings its own new banks put on tiles (A83: the cat, the dog, the log, the moon...), never the whole course's, and in pass NC a
// tablet and a music note on two kindergarten banks read 1.25 and 1.03 to 1 on the dark theme's tile. In plain terms: every bank of
// every course is dealt at seeds 1 to 80, and every drawing it puts on an answer tile (a drawn icon, an animal, a feeling face, a
// colored shape or square, a coloring page's thumbnail, a shape, a solid, a die, a fair-shares picture, and since round one's code check
// a group of dots, a look of dots, a bar, a tower, a clock, a digital clock, tens, an array and writing as print) is shown on its tile in the
// real page, in the light theme and then the dark one, and shot alone, with every background up its ancestors made clear. Its edge is
// read against the theme's resting, right and wrong tiles (the tile's own colors, C.surface, C.greenSoft and C.claySoft), and since round
// two's code read its ruled-out tile, where a pre-reader's earlier wrong pick stays at full opacity after the answer (#EDEFEA, and in the
// dark theme #294035, since #2C4238, a hair lighter than the right tile, left the belt at 2.99 to 1 and three more drawings short): an edge pixel
// (opaque, within two device pixels of a clear one, at twice the size) reads on a tile when it, or an opaque pixel within eight device
// pixels of it (four on the screen, about two of the house's 3-unit outlines at a tile's 64 pixels, each 1.9 pixels), is 3 to 1 or better against
// the tile, since a dark outline on a dark tile melts into it and the eye takes the fill just inside it as the drawing's edge. A drawing
// reads when 95 percent of its edge reads on each of the four tiles. When this check was written 90 drawings fell short in one theme
// or both (107 of the 524 readings, 39 in the light theme and 68 in the dark; the camera's dark body on a dark tile read 0, the lake's
// pale land on a white one 0); pass ND edged every one, so every drawing is held to the bar and none waits. Its plant: the jar, which
// reads, its colors turned the tile's own, caught; and its near miss: the key's dark outline turned the dark tile's own color, its gold
// fill just inside reading, passed, as the eye reads it. Since round one's code check each threshold is pinned on both sides: R by the
// key's outline turned the dark tile's color at seven units wide, caught (at R 12 it would pass), beside the near miss above; the bar by
// two squares drawn in the page, one with a strip of its edge melted into the tile so about 92 percent reads (0.917, measured), caught, and one at about 96
// percent, passed. A blind spot, named: an edge pixel is opaque beside a clear one, so an edge that meets a translucent part (the sun's
// glow, a solid's soft shadow) is read where the opaque part ends. Only choice questions are read: an order question with pick draws
// the same icons, pictures, faces, items and shapes on its tiles, and at seeds 1 to 400 each of them is also on a choice tile.
import { createRequire } from 'node:module'; import { execSync } from 'node:child_process';
const G = execSync('npm root -g').toString().trim(); const { chromium } = createRequire(import.meta.url)(`${G}/playwright`);
const L = await import('../../src/logic.mjs');
let passed = 0, failed = 0; const ok = (name, cond, info) => { if (cond) { passed++; console.log('PASS - ' + name); } else { failed++; console.log('FAIL - ' + name + (info !== undefined ? '  ' + JSON.stringify(info).slice(0, 900) : '')); } };
// Every kind of answer a tile draws as a drawing (choiceFace in ui.jsx): until round one's code check the counted groups, the clocks, the
// writing and the looks of dots were left out as "read by their own checks", and none was; with them read, dots on a dark tile, bars on a
// light one and digital clocks on a dark one fell short.
const KINDS = ['icon', 'pic', 'face', 'item', 'swatch', 'art', 'shape', 'solid', 'dice', 'shares', 'dots', 'look', 'bar', 'tower', 'tens', 'array', 'clock', 'digital', 'print'];
const BAR = 0.95;
// Each theme's resting, right and wrong tiles, read from the page itself (round one's screen read: typed into the test, a changed greenSoft
// or claySoft would have been measured against the old color and passed): a resting tile's background, then a wrong tap and Check answer,
// the tile tapped, then Try again, the right tap and Check answer, the answer's tile, and since round two's code read the wrong tile once
// more, ruled out, as a pre-reader's earlier wrong pick stays after the answer. Its plant: every tile turned a grey in the page, read
// as that grey, and the jar read against it, caught.
const TILES = {};
const hexOf = (rgb) => { const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(String(rgb)); return m ? '#' + [m[1], m[2], m[3]].map((x) => Number(x).toString(16).padStart(2, '0')).join('').toUpperCase() : null; };
const tilesOf = async (page) => {
  const q = await page.evaluate(() => window.__eduTest.question); const wrong = q.choices.find((c) => c !== q.answer);
  const bg = (tok) => page.evaluate((t) => { const b = [...document.querySelectorAll('button[data-choice]')].find((x) => x.getAttribute('data-choice') === t); return b ? getComputedStyle(b).backgroundColor : null; }, tok);
  const resting = hexOf(await bg(wrong));
  await page.locator(`button[data-choice="${wrong}"]`).click(); await page.getByRole('button', { name: 'Check answer' }).click(); await page.waitForTimeout(600); const wrongTile = hexOf(await bg(wrong));
  const again = page.getByRole('button', { name: 'Try again', exact: true }); if (await again.count()) { await again.first().click(); await page.waitForTimeout(300); }
  await page.locator(`button[data-choice="${q.answer}"]`).click(); await page.getByRole('button', { name: 'Check answer' }).click(); await page.waitForTimeout(600); const right = hexOf(await bg(q.answer));
  const ruled = hexOf(await bg(wrong));
  return [resting, right, wrongTile, ruled];
};
const TILE_QUESTION = ['p3-sort-red-blue', 11];
// The counts the code has (as the fold check's FLOORS): how many drawings the banks put on tiles, read in each theme.
const FLOORS = { drawings: 468 };   // 262 when the check was written, 416 since round one's code check read every kind, 424 since pass NE, 432 since pass NF's new tile drawings (Hear it in a word's and A104's pictures, and Look and write's marks), 468 since pass NI's (Q, V and Y's six pictures, and Write your name's names in print, each order a try can take)
// Where each drawing first shows on a tile: a bank, a seed and its module, and the questions that show them all.
const where = new Map();
for (const c of L.COURSES) for (const m of c.modules) for (const g of [...new Set(m.generators || [])]) for (let s = 1; s <= 80; s++) {
  let q; try { q = L.generateQuestion(g, s); } catch (e) { continue; }
  if (!q || q.type !== 'choice' || !Array.isArray(q.choices)) continue;
  for (const ch of q.choices) { const t = String(ch); const k = /^([a-z]+):/.exec(t); if (!k || !KINDS.includes(k[1])) continue; const key = t.split('#')[0]; if (!where.has(key)) where.set(key, { gen: g, seed: s, mid: m.id, token: t }); }
}
const byQ = new Map(); for (const [key, w] of where) { const qk = w.gen + '|' + w.seed + '|' + w.mid; if (!byQ.has(qk)) byQ.set(qk, []); byQ.get(qk).push({ key, token: w.token }); }
// The reading, in the page: a shot of one drawing (a PNG, its background clear) and the share of its edge that reads on each tile.
const readEdge = (page, b64, tiles) => page.evaluate(async ([png, tl]) => {
  const img = new Image(); img.src = 'data:image/png;base64,' + png; await img.decode();
  const cv = document.createElement('canvas'); cv.width = img.width; cv.height = img.height; const cx = cv.getContext('2d'); cx.drawImage(img, 0, 0);
  const { data, width: W, height: H } = cx.getImageData(0, 0, img.width, img.height);
  const lin = (c) => { const v = c / 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  const lum = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const T = tl.map((t) => lum(...hex(t))); const cr = (l, t) => (Math.max(l, t) + 0.05) / (Math.min(l, t) + 0.05);
  const A = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? 0 : data[(y * W + x) * 4 + 3]);
  const LUM = new Float32Array(W * H); for (let k = 0; k < W * H; k++) LUM[k] = data[k * 4 + 3] >= 230 ? lum(data[k * 4], data[k * 4 + 1], data[k * 4 + 2]) : -1;
  const R = 8; let edge = 0; const good = T.map(() => 0);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (LUM[y * W + x] < 0) continue;
    let near = false; for (let dy = -2; dy <= 2 && !near; dy++) for (let dx = -2; dx <= 2; dx++) if (A(x + dx, y + dy) <= 25) { near = true; break; }
    if (!near) continue; edge += 1; const l = LUM[y * W + x];
    T.forEach((t, k) => { if (cr(l, t) >= 3) { good[k] += 1; return; }
      for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) { if (dx * dx + dy * dy > R * R) continue; const xx = x + dx; const yy = y + dy; if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue; const m = LUM[yy * W + xx]; if (m >= 0 && cr(m, t) >= 3) { good[k] += 1; return; } } });
  }
  return { edge, shares: good.map((g) => (edge ? g / edge : 0)) };
}, [b64, tiles]);
// The drawing on its tile, every background up its ancestors made clear (put back after the shot), shot alone at twice the size.
const shoot = async (page, token, plant = null) => {
  const handle = await page.evaluateHandle(([tok, pl]) => { const b = [...document.querySelectorAll('button[data-choice]')].find((e) => e.getAttribute('data-choice') === tok); if (!b || !b.firstElementChild) return null; const f = b.firstElementChild;
    window.__edgeWas = []; for (let e = f; e; e = e.parentElement) { window.__edgeWas.push([e, e.getAttribute('style')]); e.style.setProperty('background', 'transparent', 'important'); e.style.setProperty('box-shadow', 'none', 'important'); }
    window.__edgeWas.push([document.documentElement, document.documentElement.getAttribute('style')]); document.documentElement.style.setProperty('background', 'transparent', 'important');
    // A plant: every color of the drawing turned the tile's own ({ all: color }), or only its outlines ({ strokes: color }).
    if (pl) { window.__edgePlant = [...f.querySelectorAll('*')].map((n) => [n, n.getAttribute('fill'), n.getAttribute('stroke'), n.getAttribute('stroke-width')]); for (const n of f.querySelectorAll('*')) { if (pl.all && n.getAttribute('fill') && n.getAttribute('fill') !== 'none') n.setAttribute('fill', pl.all); const st = pl.all || pl.strokes; if (n.getAttribute('stroke') && n.getAttribute('stroke') !== 'none') { n.setAttribute('stroke', st); if (pl.width) n.setAttribute('stroke-width', String(pl.width)); } } }
    return f; }, [token, plant]);
  const el = handle.asElement(); if (!el) return null;
  const png = await el.screenshot({ omitBackground: true, animations: 'disabled' });
  await page.evaluate(() => { for (const [e, s] of window.__edgeWas || []) { if (s === null) e.removeAttribute('style'); else e.setAttribute('style', s); } delete window.__edgeWas;
    for (const [n, f, s, w] of window.__edgePlant || []) { if (f === null) n.removeAttribute('fill'); else n.setAttribute('fill', f); if (s === null) n.removeAttribute('stroke'); else n.setAttribute('stroke', s); if (w === null) n.removeAttribute('stroke-width'); else n.setAttribute('stroke-width', w); } delete window.__edgePlant; });
  return png.toString('base64');
};
const browser = await chromium.launch();
const errors = []; const read = {}; let plantTurned = null; let nearMelted = null; let plantWide = null; let barLow = null; let barHigh = null; let plantTiles = null; let plantGrey = null; let plantRuled = null;
// A square drawn in the page, white on a clear ground with a strip of its top edge (from its left corner, this many pixels long, deeper than
// R) painted the dark theme's resting tile's own color, as a PNG: the bar's two cases (round one's code check).
const SQUARE_MELT = { low: 70, high: 34 };
const square = (page, melt, tile) => page.evaluate(([m, t]) => { const cv = document.createElement('canvas'); cv.width = 240; cv.height = 240; const cx = cv.getContext('2d'); cx.fillStyle = '#FFFFFF'; cx.fillRect(20, 20, 200, 200); cx.fillStyle = t; cx.fillRect(20, 20, m, 14); return cv.toDataURL('image/png').split(',')[1]; }, [melt, tile]);
for (const theme of ['light', 'dark']) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, reducedMotion: 'reduce' });
  await ctx.addInitScript((t) => { try { localStorage.setItem('edusphere_v1_theme', t); } catch (e) { /* none */ } }, theme);
  const page = await ctx.newPage(); page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
  await page.goto(new URL('./page.html', import.meta.url).href);
  const screenIs = (n) => page.waitForFunction((x) => window.__eduTest && window.__eduTest.screen === x, n, { timeout: 15000 });
  const tap = async (name) => { const b = page.getByRole('button', { name, exact: true }); if (await b.count()) { await b.first().click({ force: true }); await page.waitForTimeout(250); } };
  await screenIs('welcome'); await page.getByRole('button', { name: 'Create account', exact: true }).first().click(); await screenIs('educator-setup');
  await page.fill('input[placeholder="PIN"]', '2468'); await page.fill('input[placeholder="PIN again"]', '2468'); await page.fill('input[placeholder="This device\'s name"]', 'Edges'); await page.selectOption('select[aria-label="Your state"]', 'TX');
  await page.getByRole('button', { name: 'Create account', exact: true }).click(); await screenIs('educator-pick'); await page.waitForTimeout(400);
  for (const n of ['Skip tour', 'Later', 'Got it']) await tap(n);
  await page.getByLabel('Walk through early years').first().click({ force: true }); await screenIs('overview'); await page.waitForTimeout(300);
  await page.evaluate(([g, s]) => window.__eduTest.showQuestion(g, s), TILE_QUESTION); await screenIs('practice'); await page.waitForTimeout(300); TILES[theme] = await tilesOf(page);
  if (theme === 'dark') { const tag = await page.addStyleTag({ content: 'button[data-choice] { background: #8A9086 !important; }' }); await page.evaluate(([g, s]) => window.__eduTest.showQuestion(g, s), TILE_QUESTION); await screenIs('practice'); await page.waitForTimeout(300);
    const planted = await tilesOf(page); await tag.evaluate((n) => n.remove()); plantTiles = planted.every((h) => h === '#8A9086') ? planted : false; }
  for (const [qk, list] of byQ) {
    const [gen, seed, mid] = qk.split('|');
    const shown = await page.evaluate(([g, s, m]) => window.__eduTest.showQuestion(g, Number(s), m), [gen, seed, mid]);
    if (!shown) { for (const x of list) read[theme + ' ' + x.key] = null; continue; }
    await screenIs('practice'); await page.waitForTimeout(150);
    for (const x of list) { const b64 = await shoot(page, x.token); read[theme + ' ' + x.key] = b64 ? await readEdge(page, b64, TILES[theme]) : null;
      // The plant, once, in the dark theme: the jar, which reads, its every color turned the resting tile's own, caught.
      if (plantTurned === null && theme === 'dark' && x.key === 'icon:jar') { const p = await shoot(page, x.token, { all: TILES.dark[0] }); const r = p ? await readEdge(page, p, TILES.dark) : null; plantTurned = !!r && Math.min(...r.shares) < BAR;
        // The tiles' plant: the jar, which reads on the page's tiles, read against the grey the page was made to show, caught.
        const g = plantTiles && b64 ? await readEdge(page, b64, plantTiles) : null; plantGrey = !!g && Math.min(...g.shares) < BAR; }
      // The ruled-out tile's plant, once, in the dark theme (round two's code read): the belt, which reads on the page's four tiles, read
      // against the old ruled-out tile, #2C4238, in the place of the page's, caught.
      if (plantRuled === null && theme === 'dark' && x.key === 'icon:belt' && b64) { const o = await readEdge(page, b64, [...TILES.dark.slice(0, 3), '#2C4238']); plantRuled = !!o && Math.min(...o.shares) < BAR; }
      // The near miss, once: the key's outline turned the dark tile's own color, its gold fill just inside, read as reading.
      if (nearMelted === null && theme === 'dark' && x.key === 'icon:key') { const p = await shoot(page, x.token, { strokes: TILES.dark[0] }); const r = p ? await readEdge(page, p, TILES.dark) : null; nearMelted = !!r && Math.min(...r.shares) >= BAR;
        // The second plant, R's other side: the key's outline turned the tile's color at seven units wide, wider than R reaches past, caught.
        const w = await shoot(page, x.token, { strokes: TILES.dark[0], width: 7 }); const rw = w ? await readEdge(page, w, TILES.dark) : null; plantWide = !!rw && Math.min(...rw.shares) < BAR; } }
  }
  // The bar's two cases, once, in the dark theme: a square about 92 percent of whose edge reads (0.917), caught, and one about 96 percent (0.962), passed.
  if (theme === 'dark') { const lo = await readEdge(page, await square(page, SQUARE_MELT.low, TILES.dark[0]), TILES.dark); const hi = await readEdge(page, await square(page, SQUARE_MELT.high, TILES.dark[0]), TILES.dark);
    const l = Math.min(...lo.shares); const h = Math.min(...hi.shares); barLow = l >= 0.9 && l < BAR ? l : -l; barHigh = h >= BAR && h < 0.99 ? h : -h; }
  await ctx.close();
}
await browser.close();
// The verdict: every drawing reads in both themes, as many as the code has, the plant caught and the near miss passed.
const lowest = (k) => (read[k] ? Math.min(...read[k].shares) : null);
const keys = Object.keys(read); const missing = keys.filter((k) => !read[k]);
const short = keys.filter((k) => read[k] && lowest(k) < BAR);
const perTheme = (t) => keys.filter((k) => k.startsWith(t + ' ') && read[k]).length;
ok(`every drawing a bank puts on an answer tile reads at its edge, 3 to 1 or better on ${Math.round(BAR * 100)} percent of it against the resting, right, wrong and ruled-out tiles, in the light theme (${perTheme('light')} drawings) and the dark theme (${perTheme('dark')}) (pass ND, EARMARKS A89; the key's outline turned the tile's color at seven units wide, caught; a square reading about 92 percent of its edge caught and one about 96 percent passed; the jar turned the tile's own colors, planted, caught, and the key's dark outline melted into the dark tile with its fill reading, passed)`,
  missing.length === 0 && short.length === 0 && perTheme('light') >= FLOORS.drawings && perTheme('dark') >= FLOORS.drawings && plantTurned === true && nearMelted === true && plantWide === true && barLow > 0 && barHigh > 0,
  { missing: missing.slice(0, 6), short: short.map((k) => k + ' ' + lowest(k).toFixed(3)).slice(0, 12), counts: [perTheme('light'), perTheme('dark')], plantTurned, nearMelted, plantWide, barLow, barHigh });
const tileSet = (t) => Array.isArray(TILES[t]) && TILES[t].length === 4 && TILES[t].every((h) => /^#[0-9A-F]{6}$/.test(h)) && new Set(TILES[t]).size === 4;
ok(`each theme's resting, right, wrong and ruled-out tiles are read from the page, not typed into the test (light ${(TILES.light || []).join(', ')}; dark ${(TILES.dark || []).join(', ')}; every tile turned grey in the page, read as that grey, and the jar caught on it; since round two's code read the belt read against the old ruled-out tile, #2C4238, planted, caught)`, tileSet('light') && tileSet('dark') && Array.isArray(plantTiles) && plantGrey === true && plantRuled === true, { TILES, plantTiles, plantGrey, plantRuled });
ok('no page errors along the way', errors.length === 0, errors);
console.log(`\n${passed} passed, ${failed} failed`);
process.exitCode = failed ? 1 : 0;   // never process.exit(): it can drop the last lines of a piped stdout (2026-09-23)
