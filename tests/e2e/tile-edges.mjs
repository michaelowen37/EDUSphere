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
// Since round three's screen read of pass NR it also reads the painted ink of a print question's drawings on their tiles, at two phone sizes
// in each theme, so that in Words all around us's "Which one has a word on it?" and "Which one has no words on it?" no answer stands out by
// its size (below, at INK_BANK), and since pass NX (EARMARKS L35) by its width too.
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
const FLOORS = { drawings: 701 };   // 701 since round three's fixes of pass NR, the sitting dog (dog~sit) on Words all around us's tiles, read alone by the fix engineer after its fixes; 700 since pass NR, its two print lessons putting six more drawings on tiles (the milk carton, the cubby's name, the open door, the teacher's empty hands, the love note and the closed box of crayons; read alone after round three's fixes, the ripple read having found the floor still pass NP's); 694 since pass NP, its six lessons putting 31 more drawings on tiles (read alone after round three's fixes); 663 since pass NM, its three lessons putting six more drawings on tiles (read alone after round three's fixes); 262 when the check was written, 416 since round one's code check read every kind, 424 since pass NE, 432 since pass NF's new tile drawings (Hear it in a word's and A104's pictures, and Look and write's marks), 468 since pass NI's (Q, V and Y's six pictures, and Write your name's names in print, each order a try can take); 657 since pass NK, whose lessons put 189 more on tiles, the apple among them for the first time (it read 19.4 percent of its edge at 3 to 1 on the dark tiles until it took a light outline there), and round three's whole read of RULES-AUDIT found the floor still pass NI's
// Where each drawing first shows on a tile: a bank, a seed and its module, and the questions that show them all.
const where = new Map();
for (const c of L.COURSES) for (const m of c.modules) for (const g of [...new Set(m.generators || [])]) for (let s = 1; s <= 80; s++) {
  let q; try { q = L.generateQuestion(g, s); } catch (e) { continue; }
  if (!q || q.type !== 'choice' || !Array.isArray(q.choices)) continue;
  for (const ch of q.choices) { const t = String(ch); const k = /^([a-z]+):/.exec(t); if (!k || !KINDS.includes(k[1])) continue; const key = t.split('#')[0]; if (!where.has(key)) where.set(key, { gen: g, seed: s, mid: m.id, token: t }); }
}
const byQ = new Map(); for (const [key, w] of where) { const qk = w.gen + '|' + w.seed + '|' + w.mid; if (!byQ.has(qk)) byQ.set(qk, []); byQ.get(qk).push({ key, token: w.token }); }
// The painted ink of a print question's drawings (pass NR, round three's screen read, its MUST FIX 2). In plain terms: every tile of a
// question that shows a print drawing draws its picture in a box of one size (84 pixels, 69 on a short phone), but the ink inside the box
// differed: in Words all around us's "Which one has a word on it?" and "Which one has no words on it?" the print drawings stood 55 to 63
// pixels tall at 69 and the tree, the ball and the dog's face 36 to 48, so the answer was the one tall or the one short picture on all 2,000
// of seeds 1 to 2,000, and by its painted area the largest or the smallest on most. Here every screen that bank deals at seeds 1 to 2,000
// (each set of choices with its answer) is shown at 375 by 667 and at 320 by 568, in each theme, with the test page's margin taken off as
// the product has none, and each tile's drawing is shot alone, its box and the tile made clear as the edges' shots are, and read from its
// pixels: its height (the rows a pixel at least half opaque stands in), its width, and its painted area (every such pixel), in screen
// pixels. Over seeds 1 to 2,000, in each size and theme, the answer may be the one tallest picture, the one widest (since pass NX, EARMARKS
// L35), or the one largest by painted area or by the box its ink fills, where the question asks which one has a word on it, or the one
// shortest, narrowest or smallest where it asks which one has none, on no more than 45 percent of screens (chance is about a third); and the
// same the other way round, the tallest, widest or largest where it asks which one has none, since a cue that turned around would single
// out the answer as well. Plants, put in the page on a screen with the tree and the dog in each size and theme, those two tiles read again
// and the 2,000 seeds scored with their ink: the tree without its growth (PRINT_TILE_GROW in ui.jsx), the dog's face (as a tile in another
// bank draws it) in the sitting dog's place, and both, each caught. Until pass NX the width was read and held by no measure (pass NR's last
// short read found the answer the widest or narrowest its kind gives on 432 of 2,000 screens, 21.6 percent, and the other way on 667, 33.4,
// in every size and theme); it is held at the same 45 percent, since those reads sit inside it as the other three measures' do. Its plant,
// on a screen with the stop sign and the cubby (two of the answers where it asks for a word), in each size and theme: those two drawn
// WIDE_PLANT times as wide and as many times less tall about their middle, so their painted area and their box's area stay as they were
// and only their width and height move, read again and the 2,000 seeds scored with their ink, caught by the width alone (past the bound,
// the other three measures inside it both ways); its near miss, the same drawn WIDE_NEAR times as wide, passed by the live verdict; and,
// so the plant's own condition can fail, the same two drawn WIDE_PLANT times as wide at their own height, caught by more than the width
// (their painted area and their box's area grow with it), so a plant like that one proves nothing about the width's own bound.
const INK_BANK = 'p3-around-has'; const INK_MODULE = 'words-all-around'; const INK_SIZES = [[375, 667], [320, 568]]; const INK_BOUND = 0.45;
const inkKey = (q) => `${q.choices.slice().sort().join(',')}>${q.answer}`;
const INK_SEEDS = (() => { const first = new Map(); for (let s = 1; s <= 2000; s++) { const k = inkKey(L.generateQuestion(INK_BANK, s)); if (!first.has(k)) first.set(k, s); } return [...first.values()]; })();
const inkRead = {}; const inkPlant = {}; const inkWide = {};
// The width's plant and its near miss: how much wider the stop sign and the cubby are drawn, and as many times less tall (pass NX, above);
// drawn WIDE_PLANT times as wide at their own height, they are the plant that is not the width's alone.
const WIDE_PLANT = 1.2; const WIDE_NEAR = 1.05; const WIDE_TILES = ['icon:sign~stop', 'icon:cubby~name'];
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
// A tile's drawing alone for its ink (the print question's check above): its svg, every background up its ancestors made clear and put back
// after, as shoot does. A plant changes only what it puts back: ungrow takes the growth's transform off the drawing and sets it again after;
// markup hides the drawing and draws another in its box (the old dog's face, as another tile drew it), then takes it away, so the nodes the
// page's own code keeps are never replaced; and since pass NX wide, [across, down], draws the drawing that many times as wide and that many
// times as tall about the box's middle (a transform on its own first node, put back after): [WIDE_PLANT, 1 / WIDE_PLANT] keeps its painted
// area and its box's area as they were.
const shootInk = async (page, token, plant = null) => {
  const handle = await page.evaluateHandle(([tok, pl]) => { const b = [...document.querySelectorAll('button[data-choice]')].find((e) => e.getAttribute('data-choice') === tok); const svg = b && b.querySelector('svg'); if (!svg) return null;
    window.__inkWas = []; for (let e = svg; e; e = e.parentElement) { window.__inkWas.push([e, e.getAttribute('style')]); e.style.setProperty('background', 'transparent', 'important'); e.style.setProperty('box-shadow', 'none', 'important'); }
    window.__inkWas.push([document.documentElement, document.documentElement.getAttribute('style')]); document.documentElement.style.setProperty('background', 'transparent', 'important');
    window.__inkUndo = [];
    if (pl && pl.ungrow) for (const g of svg.querySelectorAll('[data-print-grow]')) { const t = g.getAttribute('transform'); g.removeAttribute('transform'); window.__inkUndo.push(() => g.setAttribute('transform', t)); }
    if (pl && pl.wide) { const own = svg.firstElementChild; const t = own.getAttribute('transform'); own.setAttribute('transform', 'translate(50 50) scale(' + pl.wide[0] + ' ' + pl.wide[1] + ') translate(-50 -50)' + (t ? ' ' + t : ''));
      window.__inkUndo.push(() => { if (t === null) own.removeAttribute('transform'); else own.setAttribute('transform', t); }); }
    if (pl && pl.markup) { const own = svg.firstElementChild; const was = own.getAttribute('style'); own.style.display = 'none'; const g = document.createElementNS('http://www.w3.org/2000/svg', 'g'); g.innerHTML = pl.markup; svg.appendChild(g);
      window.__inkUndo.push(() => { g.remove(); if (was === null) own.removeAttribute('style'); else own.setAttribute('style', was); }); }
    return svg; }, [token, plant]);
  const el = handle.asElement(); if (!el) return null;
  const png = await el.screenshot({ omitBackground: true, animations: 'disabled' });
  await page.evaluate(() => { for (const f of window.__inkUndo || []) f(); delete window.__inkUndo; for (const [e, s] of window.__inkWas || []) { if (s === null) e.removeAttribute('style'); else e.setAttribute('style', s); } delete window.__inkWas; });
  return png.toString('base64');
};
// The ink of one shot, in screen pixels: its height and width (the rows and columns holding a pixel at least half opaque) and its painted
// area (how many such pixels), each divided by the device's pixels to a screen pixel.
const readInk = (page, b64) => (b64 ? page.evaluate(async (png) => {
  const img = new Image(); img.src = 'data:image/png;base64,' + png; await img.decode();
  const cv = document.createElement('canvas'); cv.width = img.width; cv.height = img.height; const cx = cv.getContext('2d'); cx.drawImage(img, 0, 0);
  const { data, width: W, height: H } = cx.getImageData(0, 0, img.width, img.height); const d = window.devicePixelRatio || 1; let n = 0; let x0 = W; let x1 = -1; let y0 = H; let y1 = -1;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (data[(y * W + x) * 4 + 3] >= 128) { n += 1; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  return n ? { w: (x1 - x0 + 1) / d, h: (y1 - y0 + 1) / d, area: n / (d * d) } : null;
}, b64) : null);
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
  // The print question's ink (round three's screen read of pass NR), after the edges: the old dog's face as a tile draws it in this theme
  // (for the plant), then every screen of the bank at each phone size, with the test page's margin taken off.
  const dogAt = where.get('icon:dog'); let oldDog = null;
  if (dogAt && await page.evaluate(([g, s, m]) => window.__eduTest.showQuestion(g, Number(s), m), [dogAt.gen, dogAt.seed, dogAt.mid])) { await screenIs('practice'); await page.waitForTimeout(150);
    oldDog = await page.evaluate(() => { const b = [...document.querySelectorAll('button[data-choice]')].find((e) => e.getAttribute('data-choice') === 'icon:dog'); const s = b && b.querySelector('svg'); return s ? s.innerHTML : null; }); }
  await page.addStyleTag({ content: 'body { margin: 0 !important; }' });
  for (const [w, h] of INK_SIZES) {
    await page.setViewportSize({ width: w, height: h }); await page.waitForTimeout(300); const cfg = `${theme} ${w}x${h}`;
    for (const seed of INK_SEEDS) {
      if (!(await page.evaluate(([g, s, m]) => window.__eduTest.showQuestion(g, s, m), [INK_BANK, seed, INK_MODULE]))) continue; await screenIs('practice'); await page.waitForTimeout(150);
      const q = L.generateQuestion(INK_BANK, seed); const tiles = {};
      for (const c of q.choices) tiles[c] = await readInk(page, await shootInk(page, c));
      inkRead[`${cfg} ${inkKey(q)}`] = tiles;
      if (!inkWide[cfg] && WIDE_TILES.every((c) => q.choices.includes(c))) { inkWide[cfg] = { plant: {}, near: {}, flat: {} };
        for (const c of WIDE_TILES) { inkWide[cfg].plant[c] = await readInk(page, await shootInk(page, c, { wide: [WIDE_PLANT, 1 / WIDE_PLANT] })); inkWide[cfg].near[c] = await readInk(page, await shootInk(page, c, { wide: [WIDE_NEAR, 1 / WIDE_NEAR] }));
          inkWide[cfg].flat[c] = await readInk(page, await shootInk(page, c, { wide: [WIDE_PLANT, 1] })); } }
      if (!inkPlant[cfg] && q.choices.includes('icon:tree') && q.choices.includes('icon:dog~sit')) inkPlant[cfg] = { tree: await readInk(page, await shootInk(page, 'icon:tree', { ungrow: true })), dog: oldDog ? await readInk(page, await shootInk(page, 'icon:dog~sit', { markup: oldDog })) : null };
    }
  }
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
// The print question's ink: in each size and theme, over seeds 1 to 2,000, how often the answer is the one extreme its question's kind gives
// (and the other way round), by its height, its painted area, the box its ink fills and, since pass NX, its width, each seed scored with the
// ink read on its own screen; then the same with each plant's ink in the tree's or the dog's place.
const INK_MEASURES = { height: (v) => v.h, 'painted area': (v) => v.area, 'box area': (v) => v.w * v.h, width: (v) => v.w };
const inkRates = (cfg, swap = {}) => { const r = Object.fromEntries(Object.keys(INK_MEASURES).map((m) => [m, [0, 0]])); let n = 0; let unread = 0;
  for (let s = 1; s <= 2000; s++) { const q = L.generateQuestion(INK_BANK, s); const t = inkRead[`${cfg} ${inkKey(q)}`]; const ink = (c) => swap[c] || (t && t[c]);
    if (!t || q.choices.some((c) => !ink(c))) { unread += 1; continue; } n += 1; const big = !/no words/.test(q.prompt); const ai = q.choices.indexOf(q.answer);
    for (const [m, f] of Object.entries(INK_MEASURES)) { const vals = q.choices.map((c) => f(ink(c))); const a = vals[ai]; const o = vals.filter((_, i) => i !== ai); const most = o.every((x) => a > x); const least = o.every((x) => a < x);
      if (big ? most : least) r[m][0] += 1; if (big ? least : most) r[m][1] += 1; } }
  return { n, unread, r }; };
const inkCfgs = ['light', 'dark'].flatMap((t) => INK_SIZES.map(([w, h]) => `${t} ${w}x${h}`));
const inkNow = Object.fromEntries(inkCfgs.map((c) => [c, inkRates(c)]));
const inkWorst = (x) => Math.max(...Object.values(x.r).flat()) / (x.n || 1); const inkNatural = (x) => Math.max(...Object.values(x.r).map((v) => v[0])) / (x.n || 1);
const PLANTS = { 'the tree without its growth': (p) => ({ 'icon:tree': p.tree }), "the dog's face": (p) => ({ 'icon:dog~sit': p.dog }), 'both': (p) => ({ 'icon:tree': p.tree, 'icon:dog~sit': p.dog }) };
const inkPlanted = Object.fromEntries(inkCfgs.map((c) => [c, Object.fromEntries(Object.entries(PLANTS).map(([k, f]) => [k, inkPlant[c] && inkPlant[c].tree && inkPlant[c].dog ? inkRates(c, f(inkPlant[c])) : null]))]));
const inkPct = (k, n) => `${k} (${Math.round((1000 * k) / (n || 1)) / 10}%)`;
const inkLine = (c) => `${c.replace(/ (\d+)x(\d+)$/, ' $1 by $2')}: ${Object.entries(inkNow[c].r).map(([m, [a, b]]) => `${m} ${inkPct(a, inkNow[c].n)}, the other way ${b}`).join('; ')}`;
const inkPlants = inkCfgs.map((c) => Object.entries(inkPlanted[c]).map(([k, x]) => (x ? `${k} ${Math.round(1000 * inkNatural(x)) / 10}%` : `${k} not read`)).join(', ')).join(' | ');
ok(`no answer of a print question stands out by its painted ink (pass NR, round three's screen read, MUST FIX 2): in Words all around us's which one has a word on it, or none, every tile's drawing read from its pixels on all ${INK_SEEDS.length} screens of seeds 1 to 2,000, the answer is the one tallest, widest or largest where the question asks for a word, and the one shortest, narrowest or smallest where it asks for none, on at most ${Math.round(INK_BOUND * 100)} percent of the 2,000, and the other way round too (${inkCfgs.map(inkLine).join('; ')}); the old drawings put back in the page, the tree without its growth, the dog's face in the sitting dog's place and both, each caught in every size and theme (its worst way: ${inkPlants})`,
  inkCfgs.every((c) => inkNow[c].n === 2000 && inkNow[c].unread === 0 && inkWorst(inkNow[c]) <= INK_BOUND) && Object.keys(inkRead).length === INK_SEEDS.length * inkCfgs.length && INK_SEEDS.length >= 30
    && inkCfgs.every((c) => Object.values(inkPlanted[c]).every((x) => x && inkNatural(x) > INK_BOUND)),
  { now: Object.fromEntries(inkCfgs.map((c) => [c, inkNow[c]])), read: Object.keys(inkRead).length, plants: inkPlants });
// The width's plant, its near miss and the plant that is not the width's alone, each scored over the 2,000 seeds with its two drawings' ink
// in their places, in every size and theme: the plant trips the width alone (past the bound, the other three measures inside it both
// ways), the near miss passes the live verdict, and the drawings drawn wider at their own height are caught by more than the width.
const inkWideRates = Object.fromEntries(inkCfgs.map((c) => [c, inkWide[c] && WIDE_TILES.every((t) => inkWide[c].plant[t] && inkWide[c].near[t] && inkWide[c].flat[t]) ? { plant: inkRates(c, inkWide[c].plant), near: inkRates(c, inkWide[c].near), flat: inkRates(c, inkWide[c].flat) } : null]));
const widthAlone = (x) => !!x.r.width && Math.max(...x.r.width) / (x.n || 1) > INK_BOUND && Object.entries(x.r).filter(([m]) => m !== 'width').every(([, v]) => Math.max(...v) / (x.n || 1) <= INK_BOUND);
const wideWord = (x) => (x.r.width ? 'width ' + inkPct(Math.max(...x.r.width), x.n) : 'no width measure') + ', the worst of the other three ' + inkPct(Math.max(...Object.entries(x.r).filter(([m]) => m !== 'width').flatMap(([, v]) => v)), x.n);
const wideList = (k) => inkCfgs.map((c) => c + ': ' + (inkWideRates[c] ? wideWord(inkWideRates[c][k]) : 'not read')).join('; ');
ok(`no answer of a print question stands out by its width either (pass NX, EARMARKS L35): the ink check holds each drawing's width at the same ${Math.round(INK_BOUND * 100)} percent, and the stop sign and the cubby drawn ${WIDE_PLANT} times as wide and as many times less tall, their painted area and their box's area as they were, are caught by the width alone in every size and theme (${wideList('plant')}), and drawn ${WIDE_NEAR} times as wide, passed (${wideList('near')}); drawn ${WIDE_PLANT} times as wide at their own height they are caught, and not by the width alone, so that plant would prove nothing of its own (${wideList('flat')})`,
  inkCfgs.every((c) => inkWideRates[c] && ['plant', 'near', 'flat'].every((k) => inkWideRates[c][k].n === 2000) && widthAlone(inkWideRates[c].plant) && inkWorst(inkWideRates[c].near) <= INK_BOUND && inkWorst(inkWideRates[c].flat) > INK_BOUND && !widthAlone(inkWideRates[c].flat)),
  { wide: inkWideRates });
ok('no page errors along the way', errors.length === 0, errors);
console.log(`\n${passed} passed, ${failed} failed`);
process.exitCode = failed ? 1 : 0;   // never process.exit(): it can drop the last lines of a piped stdout (2026-09-23)
