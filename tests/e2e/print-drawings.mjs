// Copyright (c) 2026 iECHO, LLC. All rights reserved.
// A print question's drawings, read in the built page (pass NX, EARMARKS L35, from round three's screen read of pass NR, its should
// consider 4: the screen brief's item 4 asks a check to read the thing itself, never a copy of its values written into the test).
// In plain terms, two things the rules test held only by copies:
//   1. Each word a drawing prints (DRAWN_WORDS: STOP, MILK, Sam, OPEN, CRAYONS, the notes' words and the word card's cat) stays inside
//      its outline. The rules test's part 55 holds each word's textLength to a table of rooms typed into the test (ROOM), so a drawing
//      whose outline shrank would pass it as long as the table kept the old number. Here each word is read where the page draws it, on
//      the first tile that shows each drawing with words, at each size and in each theme (a tile draws the same drawing wherever
//      it shows; the sizes below read every tile), on every lesson line that shows one and on every question's
//      and explanation's picture that shows one, in both themes: the word is shot alone and its painted letters' box read from its
//      pixels (every pixel at least half opaque); then the drawing is shot again with the word in one color, its outline's line in a
//      second and every other shape of the drawing in a third, and the word's room is the space its outline's line closes around it.
//      Its outline is the innermost shape with a line around it whose box holds the word's middle (the carton's outline, the name
//      card, the door's sign, the stop sign's white rim, the crayon box, the note, the word card); a shape whose box holds the whole word
//      is the ground it is printed on (the carton's blue band, the stop sign's red, the door's window) and is left out; every other
//      shape, and the drawing's other word, must stay out of the room around the word. The word reads when its box, grown by
//      WORD_MARGIN units on every side, holds nothing but its room: no line of its outline, nothing outside it and no other shape (the
//      note's heart beside "you"). WORD_MARGIN is 1.5 units, three quarters of the two units inside its outline that RULES-AUDIT's
//      row on a word a drawing prints gives each word's fitted width, since a box read from pixels is read to about a third of a unit
//      here (a screen of four device pixels to its pixel, at 69 pixels for the drawing's 100 units); the least room any word has,
//      when this was written, is Sam's 2.22 units on Words all around us's line 6, where its name card's corners round in, and MILK's
//      2.38 in DejaVu Sans Bold on a tile at 84 pixels (the label gives the least of each run).
//      Each word is read a second time in DejaVu Sans Bold, the face in which MILK ran 47.2 units in the carton's 45 before it was
//      fitted (the same row), on a tile at 84 pixels and, for a drawing no tile shows (the note about dogs, the word card), on its first
//      lesson line, so a word whose fit rests on this machine's own face fails too. Every word the drawings print must be read, on a
//      tile or on the paper, in each theme, and each must be the words DRAWN_WORDS gives its drawing.
//   2. Every picture of a print question draws at a print drawing's size, 84 pixels, 69 on a short phone (RULES-AUDIT's row on the
//      picture to match, since pass NR: choiceFace and printTiles), which only part 55's pin of choiceFace's source text held. Here
//      every screen (each set of choices with its answer, at its first seed of 1 to 2,000) of every bank that puts a drawing with
//      words on a tile, found from the lessons' own banks (Words all around us's has and which, Draw and tell's and Write to tell's
//      which job, and Print tells us something's which print), is shown at 390 by 844 (not a short phone: 84) and at 375 by 667 and
//      320 by 568 (short phones, under 720 pixels tall: 69), with the test page's margin taken off as the product has none, in both
//      themes, and each tile's drawing is read by its drawn box (getBoundingClientRect, which a transform cannot hide): on a screen
//      with a drawing with words, every tile's drawing is that size, within SIZE_SLACK; on a screen with none (Draw and tell's and
//      Write to tell's job questions without the stop sign), the rule says nothing and every tile's drawing is one size, so still no
//      answer stands out by its box.
// Plants, each in the page, read by the same judge as the live read and put back after, each beside its near miss. The words: MILK
// grown to DejaVu Sans Bold's own 47.2 units, caught; MILK with no textLength read in DejaVu Sans Bold (the mistake before pass NR's
// fit), caught (this machine's own face draws it inside, which the label gives); the carton's outline drawn 3 units narrower on each
// side, the word and the ROOM table as they were, caught, and half a unit, passed; the carton's band cut short, so MILK hangs off its
// ground, caught; the carton's outline drawn dashed, so its line closes no room, caught; Sam moved 4 units up into its card's top,
// caught, and half a unit, passed; the cubby's coat hook moved just off Sam's top left corner, past the ends of its sides, caught;
// OPEN grown past its sign though still inside the door's window, which an outline read from the wrong shape would pass, caught; the
// note's heart moved 5 units into "you", caught, and 2 units, passed; "you" moved up onto "I love" with the fold line between them
// taken away, caught; a crayon moved across the crayon box's line, passed, since a shape over an outline's line leaves no hole in the
// room; the bound pinned where it stands, MILK grown from its own live read to 1 unit of room, half a unit under WORD_MARGIN, caught,
// and to 2 units, half a unit over it, passed; MILK's text changed in the page, caught; and the words read with one drawing's reads
// left out, caught by the count; and every words plant must change at least one node of its drawing, one aimed at nothing read as not
// run. The sizes, on a Words all around us screen with the tree: every picture without words at an icon's 64 pixels and the print
// drawings alone at 84 (three banks' answers stood out by their size so until round one's screen read of pass NR), caught; every tile
// at 64 (choiceFace's old line), caught; the tree at 84 by its attributes but drawn at 0.76 by a transform, caught; the tree at 84.4
// pixels, passed, and at 84.6, caught (the slack's two sides); and on a Write to tell screen with no stop sign, one drawing 20 pixels
// larger than the others, caught, and 0.4 larger, passed.
// Blind spots, named: a tile is read at rest, never in its right, wrong or ruled-out state; More Info's boxes draw the same drawings
// at three fifths of a tile and are not opened here (paper-edges reads them for their edges); an outline is found by its box, so a
// shape whose line does not close (an open curve) leaves the word no room and fails it; and a ground is a shape whose box holds the
// whole word, read by its box, not by its fill.
import { createRequire } from 'node:module'; import { execSync } from 'node:child_process';
const G = execSync('npm root -g').toString().trim(); const { chromium } = createRequire(import.meta.url)(`${G}/playwright`);
const L = await import('../../src/logic.mjs');
let passed = 0, failed = 0; const ok = (name, cond, info) => { if (cond) { passed++; console.log('PASS - ' + name); } else { failed++; console.log('FAIL - ' + name + (info !== undefined ? '  ' + JSON.stringify(info).slice(0, 1200) : '')); } };
const WORD_MARGIN = 1.5;   // units of the drawing's 100: how far every word keeps from its outline's line and from every other shape
const SIZE_SLACK = 0.5;    // pixels: how far a tile's drawn box may be from the rule's size
const DSF = 4;             // device pixels to a pixel, so a word's box is read to about a third of a unit at 69 pixels
const FACE = "'DejaVu Sans'";
// The rule's sizes (RULES-AUDIT's row on the picture to match, DESIGN's things with words on them): 84 pixels where the phone is not
// short, 69 on a short phone (shortPhone in ui.jsx: under 720 pixels tall and under 700 wide).
const SIZES = [{ w: 390, h: 844, px: 84 }, { w: 375, h: 667, px: 69 }, { w: 320, h: 568, px: 69 }];

// The drawings that print words, by their look (milk~carton), and whether a choice or a picture shows one.
const DRAWN = L.DRAWN_WORDS; const lookOf = (name) => String(name).split('#')[0];
const printIcon = (c) => /^icon:/.test(String(c)) && !!DRAWN[lookOf(String(c).slice(5))];
const showsPrint = (v) => !!v && typeof v === 'object' && ((v.kind === 'icon' && !!DRAWN[lookOf(v.name)]) || [v.a, v.b, ...(Array.isArray(v.items) ? v.items : [])].some(showsPrint));
// Every place a lesson's bank shows one, from seeds 1 to 80 of every bank of every course (as tile-edges finds its drawings): a bank
// that puts one on an answer tile, and a bank whose question's or explanation's picture shows one; each with its first lesson.
const tileBanks = new Map(); const pictureAt = new Map();
for (const c of L.COURSES) for (const m of c.modules) for (const g of [...new Set(m.generators || [])]) for (let s = 1; s <= 80; s++) {
  let q; try { q = L.generateQuestion(g, s); } catch (e) { break; } if (!q) continue;
  if (q.type === 'choice' && Array.isArray(q.choices) && q.choices.some(printIcon) && !tileBanks.has(g)) tileBanks.set(g, m.id);
  for (const [part, v] of [['visual', q.visual], ['explain', q.explainVisual && !Array.isArray(q.explainVisual) ? q.explainVisual : null]]) {
    if (!showsPrint(v) || (part === 'explain' && q.type !== 'choice')) continue; const key = `${g}|${part}|${JSON.stringify(v)}`; if (!pictureAt.has(key)) pictureAt.set(key, { g, s, mid: m.id, part }); }
}
// Each tile bank's screens: each set of choices with its answer, at its first seed of 1 to 2,000.
const screenKey = (q) => `${q.choices.slice().sort().join(',')}>${q.answer}`;
const screens = []; for (const [g, mid] of tileBanks) { const first = new Map(); for (let s = 1; s <= 2000; s++) { const k = screenKey(L.generateQuestion(g, s)); if (!first.has(k)) first.set(k, s); } for (const s of first.values()) screens.push({ g, mid, s }); }
// The lesson lines that show one, as the lesson numbers them (readAloudScript, the lesson's own dots).
const lines = new Map(); for (const c of L.COURSES) if (c.readAloud) for (const m of c.modules) L.readAloudScript(m).forEach((st, i) => { if (showsPrint(st.show)) { if (!lines.has(m.id)) lines.set(m.id, []); lines.get(m.id).push(i); } });
// The counts the code has (as the other browser tests' FLOORS): five tile banks, their 65 screens, 26 lesson lines, eleven pictures
// (the question's own picture of four banks and the explanation of two), and the eight drawings' ten words.
const FLOORS = { banks: 5, screens: 65, lines: 26, pictures: 11, words: 10 };

// --- The reads, in the page ---
// Ready a drawing for a shot (mode 'alone': its word i alone, in red; mode 'room': the word in red, its outline's line in green with no
// fill, and every other painted shape and word of the drawing in blue, its ground hidden), every background up its ancestors made clear,
// with an optional plant (attributes or styles set on the drawing's own elements by a selector) and an optional face for its words. All
// it changes is kept in window.__wordUndo and put back by unready, so the nodes the page's own code keeps are never replaced. The word's
// box, in the drawing's own units, comes from the 'alone' shot; the outline and each shape's box are read in the same units (their
// geometry's box, half their line outside it, through their screen transforms against the drawing's).
const ready = (page, svg, i, mode, box, face, plant) => page.evaluate(([el, ti, md, wb, fc, pl]) => {
  const undo = []; window.__wordUndo = undo;
  const keep = (n, names) => { const was = names.map((a) => [a, n.getAttribute(a)]); undo.push(() => { for (const [a, v] of was) { if (v === null) n.removeAttribute(a); else n.setAttribute(a, v); } }); };
  el.scrollIntoView({ block: 'center' });
  for (let e = el; e; e = e.parentElement) { keep(e, ['style']); e.style.setProperty('background', 'transparent', 'important'); e.style.setProperty('box-shadow', 'none', 'important'); }
  keep(document.documentElement, ['style']); document.documentElement.style.setProperty('background', 'transparent', 'important');
  // The plant, first, so the reads below see the drawing as planted, with the fewest nodes any part of it changed, so a plant that
  // finds nothing to change is known (every plant must have run, the code brief since pass NC).
  let matched = pl && pl.length ? Infinity : null;
  for (const p of pl || []) { const nodes = [...el.querySelectorAll(p.sel)]; matched = Math.min(matched, nodes.length);
    for (const n of nodes) { keep(n, [...Object.keys(p.attrs || {}), 'style']); for (const [a, v] of Object.entries(p.attrs || {})) { if (v === null) n.removeAttribute(a); else n.setAttribute(a, v); } for (const [k, v] of Object.entries(p.style || {})) n.style.setProperty(k, v, 'important'); } }
  const texts = [...el.querySelectorAll('text')]; const T = texts[ti];
  const shapes = [...el.querySelectorAll('rect, path, circle, ellipse, polygon, polyline, line')];
  const painted = (n) => { const cs = getComputedStyle(n); return cs.fill !== 'none' || (cs.stroke !== 'none' && parseFloat(cs.strokeWidth) > 0); };
  const lined = (n) => { const cs = getComputedStyle(n); return cs.stroke !== 'none' && parseFloat(cs.strokeWidth) > 0; };
  for (const n of el.querySelectorAll('*')) { keep(n, ['style']); n.style.setProperty('visibility', 'hidden', 'important'); }
  if (fc) for (const t of texts) t.style.setProperty('font-family', fc, 'important');
  const show = (n, color, fill, line) => { n.style.setProperty('visibility', 'visible', 'important'); for (const k of ['opacity', 'fill-opacity', 'stroke-opacity']) n.style.setProperty(k, '1', 'important');
    n.style.setProperty('fill', fill ? color : 'none', 'important'); n.style.setProperty('stroke', line ? color : 'none', 'important'); };
  if (md === 'alone') { show(T, '#FF0000', true, false); return { matched }; }
  const toRoot = el.getScreenCTM().inverse();
  const boxOf = (n) => { const b = n.getBBox(); const m = toRoot.multiply(n.getScreenCTM()); const cs = getComputedStyle(n); const hw = lined(n) ? parseFloat(cs.strokeWidth) / 2 : 0;
    const pts = [[b.x - hw, b.y - hw], [b.x + b.width + hw, b.y - hw], [b.x - hw, b.y + b.height + hw], [b.x + b.width + hw, b.y + b.height + hw]].map(([x, y]) => [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f]);
    return { l: Math.min(...pts.map((p) => p[0])), r: Math.max(...pts.map((p) => p[0])), t: Math.min(...pts.map((p) => p[1])), b: Math.max(...pts.map((p) => p[1])) }; };
  const area = (b) => (b.r - b.l) * (b.b - b.t); const mx = (wb.l + wb.r) / 2; const my = (wb.t + wb.b) / 2;
  // The outline: the innermost shape with a line whose box holds the word's middle.
  const around = shapes.filter((n) => painted(n) && lined(n)).map((n) => [n, boxOf(n)]).filter(([, b]) => b.l <= mx && mx <= b.r && b.t <= my && my <= b.b).sort((x, y) => area(x[1]) - area(y[1]));
  const outline = around.length ? around[0][0] : null;
  let grounds = 0; let others = 0;
  for (const n of shapes) { if (n === outline || !painted(n)) continue; const b = boxOf(n); if (b.l <= wb.l && b.r >= wb.r && b.t <= wb.t && b.b >= wb.b) { grounds += 1; continue; } others += 1; const cs = getComputedStyle(n); show(n, '#0000FF', cs.fill !== 'none', lined(n)); }
  for (const t of texts) if (t !== T) { others += 1; show(t, '#0000FF', true, false); }
  show(T, '#FF0000', true, false); if (outline) show(outline, '#00FF00', false, true);
  return { outline: outline ? outline.tagName : null, grounds, others, matched };
}, [svg, i, mode, box, face, plant]);
const unready = (page) => page.evaluate(() => { for (const f of (window.__wordUndo || []).reverse()) f(); delete window.__wordUndo; });
// A shot's pixels, read in the page: each pixel at least half opaque is the word's (red), the outline's (green) or another shape's (blue),
// and any other color (a part of the screen over the drawing) is left out. 'alone' gives the word's box; 'room' gives, in device pixels,
// whether the room the outline closes around the word's middle runs out to the shot's edge (the room is bounded by the outline's line and
// by every other shape, so a shape over the outline's line leaves no hole in it), and how far the word's box can grow before it meets a
// pixel outside that room or another shape's (its clearance), on every side and at its corners.
const pixels = (page, b64, mode) => page.evaluate(async ([png, md]) => {
  const img = new Image(); img.src = 'data:image/png;base64,' + png; await img.decode();
  const cv = document.createElement('canvas'); cv.width = img.width; cv.height = img.height; const cx = cv.getContext('2d'); cx.drawImage(img, 0, 0);
  const { data, width: W, height: H } = cx.getImageData(0, 0, img.width, img.height); const kind = new Uint8Array(W * H);
  for (let k = 0; k < W * H; k++) { if (data[k * 4 + 3] < 128) continue; const r = data[k * 4], g = data[k * 4 + 1], b = data[k * 4 + 2];
    kind[k] = r >= 160 && g <= 96 && b <= 96 ? 1 : g >= 160 && r <= 96 && b <= 96 ? 2 : b >= 160 && r <= 96 && g <= 96 ? 3 : 0; }
  let x0 = W, x1 = -1, y0 = H, y1 = -1; for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (kind[y * W + x] === 1) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  if (x1 < 0) return { W, H, none: true };
  if (md === 'alone') return { W, H, x0, x1, y0, y1 };
  const room = new Uint8Array(W * H); const start = Math.round((y0 + y1) / 2) * W + Math.round((x0 + x1) / 2); let open = kind[start] >= 2; const stack = open ? [] : [start]; if (!open) room[start] = 1;
  while (stack.length) { const p = stack.pop(); const x = p % W; const y = (p - x) / W; if (x === 0 || y === 0 || x === W - 1 || y === H - 1) open = true;
    for (const [q, okq] of [[p - 1, x > 0], [p + 1, x < W - 1], [p - W, y > 0], [p + W, y < H - 1]]) if (okq && !room[q] && kind[q] < 2) { room[q] = 1; stack.push(q); } }
  let clear = Infinity; const side = { left: Infinity, right: Infinity, top: Infinity, bottom: Infinity };
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const k = y * W + x; if (room[k]) continue;
    const dx = Math.max(x0 - x, 0, x - x1); const dy = Math.max(y0 - y, 0, y - y1); clear = Math.min(clear, Math.max(dx, dy) - 1);
    if (y >= y0 && y <= y1) { if (x < x0) side.left = Math.min(side.left, x0 - x - 1); if (x > x1) side.right = Math.min(side.right, x - x1 - 1); }
    if (x >= x0 && x <= x1) { if (y < y0) side.top = Math.min(side.top, y0 - y - 1); if (y > y1) side.bottom = Math.min(side.bottom, y - y1 - 1); } }
  return { W, H, x0, x1, y0, y1, open, clear, side };
}, [b64, mode]);
// One word of a drawing: its two shots, its outline's room, and its clearance in the drawing's units (a negative one crosses into what
// it must keep clear of). A plant is put in before each shot and taken out after it.
const readWord = async (page, svg, i, face = null, plant = null) => {
  const first = await ready(page, svg, i, 'alone', null, face, plant); const a = await pixels(page, (await svg.screenshot({ omitBackground: true, animations: 'disabled' })).toString('base64'), 'alone'); await unready(page);
  const planted = plant ? (first ? first.matched : 0) : null;
  if (a.none) return { none: true, planted };
  const vb = await page.evaluate((el) => { const v = el.viewBox && el.viewBox.baseVal; return v && v.width ? [v.x, v.y, v.width, v.height] : [0, 0, 100, 100]; }, svg);
  const unit = vb[2] / a.W; const box = { l: vb[0] + a.x0 * unit, r: vb[0] + (a.x1 + 1) * unit, t: vb[1] + a.y0 * unit, b: vb[1] + (a.y1 + 1) * unit };
  const info = await ready(page, svg, i, 'room', box, face, plant); const b = await pixels(page, (await svg.screenshot({ omitBackground: true, animations: 'disabled' })).toString('base64'), 'room'); await unready(page);
  const u = (v) => (Number.isFinite(v) ? Math.round(v * unit * 100) / 100 : null);
  return { planted, outline: info && info.outline, open: !!b.open, clear: b.none ? null : u(b.clear), side: b.none ? null : Object.fromEntries(Object.entries(b.side).map(([k, v]) => [k, u(v)])), box: [box.l, box.r, box.t, box.b].map((v) => Math.round(v * 100) / 100) };
};
// The judge, one for every live read and every plant: a word reads when an outline closes a room around it and its box, grown by
// WORD_MARGIN, meets nothing but that room.
const reads = (r) => !!r && !r.none && !!r.outline && !r.open && r.clear !== null && r.clear >= WORD_MARGIN;
// A plant ran when every part of it changed at least one of the drawing's nodes.
const ran = (r) => !!r && r.planted > 0;
// A drawing's words as the page draws them, each against the words DRAWN_WORDS gives its look (a drawing on the paper is known by them).
const wordsOf = (page, svg) => page.evaluate((el) => [...el.querySelectorAll('text')].map((t) => t.textContent), svg);
const sameWords = (look, words) => !!DRAWN[look] && DRAWN[look].length === words.length && DRAWN[look].every((w, i) => w === words[i]);
const lookByWords = (words) => Object.keys(DRAWN).find((k) => sameWords(k, words)) || null;
// A tile's drawing and its drawn box, read at rest: every tile of the screen, its token and the box of the drawing on it.
const tileBoxes = (page) => page.evaluate(() => [...document.querySelectorAll('button[data-choice]')].map((b) => { const s = b.querySelector('svg'); const r = s ? s.getBoundingClientRect() : null; return { tok: b.getAttribute('data-choice'), w: r ? r.width : null, h: r ? r.height : null }; }));
// The sizes' judge, one for every live read and every plant: on a screen with a drawing with words, every tile's drawing is the rule's
// size within SIZE_SLACK each way; on a screen with none, every tile's drawing is one size within the same slack.
const sizeFaults = (tiles, px) => { const print = tiles.some((t) => printIcon(t.tok)); const bad = [];
  if (tiles.some((t) => t.w === null)) bad.push('a tile with no drawing');
  else if (print) { for (const t of tiles) if (Math.abs(t.w - px) > SIZE_SLACK || Math.abs(t.h - px) > SIZE_SLACK) bad.push(`${t.tok} ${t.w.toFixed(2)} by ${t.h.toFixed(2)}`); }
  else { const ws = tiles.flatMap((t) => [t.w, t.h]); if (Math.max(...ws) - Math.min(...ws) > SIZE_SLACK) bad.push('not one size: ' + tiles.map((t) => t.tok + ' ' + t.w.toFixed(2)).join(', ')); }
  return bad; };

// --- The walk ---
const browser = await chromium.launch(); const errors = [];
const wordReads = []; const sizeReads = []; const unknown = []; const unshown = []; const plants = {};
for (const theme of ['light', 'dark']) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: DSF, hasTouch: true, reducedMotion: 'reduce' });
  await ctx.addInitScript((t) => { try { localStorage.setItem('edusphere_v1_theme', t); } catch (e) { /* none */ } }, theme);
  const page = await ctx.newPage(); page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
  await page.goto(new URL('./page.html', import.meta.url).href);
  const screenIs = (n) => page.waitForFunction((x) => window.__eduTest && window.__eduTest.screen === x, n, { timeout: 15000 });
  const tap = async (name) => { const b = page.getByRole('button', { name, exact: true }); if (await b.count()) { await b.first().click({ force: true }); await page.waitForTimeout(250); } };
  await screenIs('welcome'); await page.getByRole('button', { name: 'Create account', exact: true }).first().click(); await screenIs('educator-setup');
  await page.fill('input[placeholder="PIN"]', '2468'); await page.fill('input[placeholder="PIN again"]', '2468'); await page.fill('input[placeholder="This device\'s name"]', 'Print'); await page.selectOption('select[aria-label="Your state"]', 'TX');
  await page.getByRole('button', { name: 'Create account', exact: true }).click(); await screenIs('educator-pick'); await page.waitForTimeout(400);
  for (const n of ['Skip tour', 'Later', 'Got it']) await tap(n);
  await page.getByLabel('Walk through early years').first().click({ force: true }); await screenIs('overview'); await page.waitForTimeout(300);
  await page.addStyleTag({ content: 'body { margin: 0 !important; }' });
  // A question shown and waited on until the page shows it (its prompt and its choices).
  const showQ = async (g, s, mid) => { const q = L.generateQuestion(g, s); if (!(await page.evaluate(([a, b, c]) => window.__eduTest.showQuestion(a, b, c), [g, s, mid]))) return null;
    try { await page.waitForFunction(([p, ch]) => window.__eduTest.screen === 'practice' && window.__eduTest.question && window.__eduTest.question.prompt === p && JSON.stringify(window.__eduTest.question.choices || null) === ch, [q.prompt, JSON.stringify(q.choices || null)], { timeout: 15000 }); } catch (e) { return null; }
    await page.waitForTimeout(150); return q; };
  // Each drawing with words in a part of the screen, as element handles, with its words; marked while read so each is found again.
  const drawingsIn = async (scope) => { const n = await page.evaluate((sc) => { let k = 0; for (const s of document.querySelectorAll(`${sc} svg`)) if (s.querySelector('text')) { s.setAttribute('data-word-read', String(k)); k += 1; } return k; }, scope);
    const out = []; for (let k = 0; k < n; k++) { const h = await page.$(`svg[data-word-read="${k}"]`); out.push(h); } return out; };
  const unmark = () => page.evaluate(() => { for (const s of document.querySelectorAll('svg[data-word-read]')) s.removeAttribute('data-word-read'); });
  // Every word of one drawing, in the page's face and, when asked, in DejaVu Sans Bold too.
  const readDrawing = async (svg, look, where, withFace) => { const words = await wordsOf(page, svg);
    if (!look || !sameWords(look, words)) { unknown.push(`${theme} ${where}: ${look || 'a drawing'} prints ${JSON.stringify(words)}`); return; }
    for (let i = 0; i < words.length; i++) { wordReads.push({ theme, where, look, i, word: words[i], face: 'page', r: await readWord(page, svg, i) });
      if (withFace) wordReads.push({ theme, where, look, i, word: words[i], face: 'DejaVu', r: await readWord(page, svg, i, FACE) }); } };
  const faceRead = new Set();
  // 1 and 2, on the tiles: every screen of every print bank at each size; each drawing's words at each size once, the first time it shows.
  for (const sz of SIZES) {
    await page.setViewportSize({ width: sz.w, height: sz.h }); await page.waitForTimeout(300); const cfg = `${theme} ${sz.w} by ${sz.h}`; const wordsRead = new Set();
    for (const sc of screens) {
      const q = await showQ(sc.g, sc.s, sc.mid); if (!q) { unshown.push(`${cfg} ${sc.g} seed ${sc.s}`); continue; }
      const tiles = await tileBoxes(page); sizeReads.push({ cfg, px: sz.px, g: sc.g, s: sc.s, tiles, faults: sizeFaults(tiles, sz.px) });
      for (const c of q.choices) if (printIcon(c) && !wordsRead.has(c)) { wordsRead.add(c); const svg = await page.$(`button[data-choice="${c}"] svg`); const look = lookOf(c.slice(5));
        const withFace = sz.px === 84 && !faceRead.has(look); if (withFace) faceRead.add(look); await readDrawing(svg, look, `${cfg} tile ${c}`, withFace); }
      // The plants, once, in the light theme at 390 by 844, on the screens they need (below).
      if (theme === 'light' && sz.w === 390) await plantOn(page, q, sc, tileBoxes, sz.px);
    }
  }
  await page.setViewportSize({ width: 390, height: 844 }); await page.waitForTimeout(300);
  // The lesson lines: each lesson opened and Next tapped until the line's own dot is lit, then every drawing with words on its card (the
  // line's card, .edu-rise, holds its picture in both themes; .edu-paper-picture, the dark theme's paper, is the dark theme's alone).
  for (const [mid, list] of lines) {
    await page.evaluate((id) => window.__eduTest.openModule(id), mid);
    try { await page.waitForFunction((id) => window.__eduTest.screen === 'lesson' && window.__eduTest.moduleId === id, mid, { timeout: 15000 }); } catch (e) { for (const i of list) unshown.push(`${theme} ${mid} line ${i + 1}: the lesson did not open`); continue; }
    for (const i of list) {
      const at = await page.evaluate(async (target) => { const lit = () => [...document.querySelectorAll('[data-lesson-dots] span')].findIndex((s) => s.hasAttribute('data-lit'));
        for (let t = 0; t < 300 && lit() < target; t++) { const b = document.querySelector('[data-lesson-next] button[aria-label="Next"]'); if (b) b.click(); await new Promise((r) => setTimeout(r, 0)); }
        return lit(); }, i);
      if (at !== i) { unshown.push(`${theme} ${mid} line ${i + 1}: line ${at + 1} shows`); continue; }
      await page.waitForTimeout(350); const svgs = await drawingsIn('.edu-rise'); if (!svgs.length) unshown.push(`${theme} ${mid} line ${i + 1}: no drawing with words`);
      for (const svg of svgs) { const look = lookByWords(await wordsOf(page, svg)); const withFace = !!look && !faceRead.has(look); if (withFace) faceRead.add(look); await readDrawing(svg, look, `${theme} ${mid} line ${i + 1}`, withFace); }
      await unmark();
    }
  }
  // The question's own pictures and the explanations' that show one: the question shown, and for an explanation the right answer tapped
  // and checked first.
  for (const p of pictureAt.values()) {
    const q = await showQ(p.g, p.s, p.mid); if (!q) { unshown.push(`${theme} ${p.g} seed ${p.s}`); continue; }
    let scope = '[data-question-picture]';
    if (p.part === 'explain') { await page.evaluate((a) => { const b = [...document.querySelectorAll('button[data-choice]')].find((x) => x.getAttribute('data-choice') === a); if (b) b.click(); }, String(q.answer));
      await page.getByRole('button', { name: 'Check answer' }).click(); try { await page.waitForSelector('[data-explain-picture] svg', { timeout: 5000 }); } catch (e) { unshown.push(`${theme} ${p.g} seed ${p.s}: its explanation did not show`); continue; }
      scope = '[data-explain-picture]'; await page.waitForTimeout(300); }
    const svgs = await drawingsIn(scope); if (!svgs.length) unshown.push(`${theme} ${p.g} seed ${p.s} ${p.part}: no drawing with words`);
    for (const svg of svgs) await readDrawing(svg, lookByWords(await wordsOf(page, svg)), `${theme} ${p.g} seed ${p.s} ${p.part === 'explain' ? 'explanation' : 'picture'}`, false);
    await unmark();
  }
  await ctx.close();
}
await browser.close();

// The plants (see the head of this file), put in the page on the screens they need, in the light theme at 390 by 844, each read by the
// judge the live reads use, each put back before the next.
async function plantOn(page, q, sc, boxesOf, px) {
  const tile = (c) => page.$(`button[data-choice="${c}"] svg`);
  // The words' plants, each on the first screen that shows its drawing (the milk carton, the cubby, the door, the note, the crayon box).
  if (!plants.milk && q.choices.includes('icon:milk~carton')) {
    const svg = await tile('icon:milk~carton'); const live = await readWord(page, svg, 0);
    const word = [{ sel: 'text', attrs: { textLength: '47.2' } }]; const loose = [{ sel: 'text', attrs: { textLength: null, lengthAdjust: null } }];
    const narrow = (d) => [{ sel: 'rect[fill="none"]', attrs: { x: String(26 + d), width: String(48 - 2 * d) } }];
    // The bound's two sides, pinned where it stands: MILK grown, from its own live read, until its least room is 2 units (passed) and 1
    // unit (caught), half a unit over and under WORD_MARGIN's 1.5, so a bound moved either way fails one of them. Its box grows with its
    // fitted width (textLength 40, its letters stretched to it), on each side by half of what it gains.
    const inkW = live.box[1] - live.box[0]; const grownTo = (target) => [{ sel: 'text', attrs: { textLength: String(Math.round(40 * (inkW + 2 * (live.clear - target)) / inkW * 100) / 100) } }];
    plants.milk = { live, grown: await readWord(page, svg, 0, null, word), looseHere: await readWord(page, svg, 0, null, loose), looseFace: await readWord(page, svg, 0, FACE, loose), fittedFace: await readWord(page, svg, 0, FACE),
      narrow: await readWord(page, svg, 0, null, narrow(3)), narrowNear: await readWord(page, svg, 0, null, narrow(0.5)),
      offBand: await readWord(page, svg, 0, null, [{ sel: 'rect[fill="#2F6FB0"]', attrs: { height: '14' } }]),
      // The carton's outline drawn dashed: its line no longer closes a room around MILK, though every dash is as far from it as before.
      dashed: await readWord(page, svg, 0, null, [{ sel: 'rect[fill="none"]', attrs: { 'stroke-dasharray': '6 6' } }]),
      above: await readWord(page, svg, 0, null, grownTo(2)), below: await readWord(page, svg, 0, null, grownTo(1)),
      // A plant aimed at no node of the drawing, which the guard on every plant must read as one that did not run.
      dead: await readWord(page, svg, 0, null, [{ sel: 'rect[fill="#ABCDEF"]', attrs: { x: '0' } }]) };
    // A word's text changed in the page: its drawing no longer prints DRAWN_WORDS's words.
    plants.text = await page.evaluate((el) => { const t = el.querySelector('text'); const was = t.textContent; t.textContent = 'MILKS'; const words = [...el.querySelectorAll('text')].map((x) => x.textContent); t.textContent = was; return words; }, svg);
  }
  if (!plants.sam && q.choices.includes('icon:cubby~name')) { const svg = await tile('icon:cubby~name');
    // The cubby's coat hook, made small (0.7 units round), moved just off Sam's top left corner, about 0.8 units from it, with as much
    // room left past the ends of its top and its left side, where only the clearance at the word's corners sees it, at any size a tile
    // draws (a hook of its own size, 2.2 round, stood about 1.4 units off, under the bound by a pixel at 84 and over it at 64).
    plants.sam = { up: await readWord(page, svg, 0, null, [{ sel: 'text', attrs: { y: '24.5' } }]), upNear: await readWord(page, svg, 0, null, [{ sel: 'text', attrs: { y: '28' } }]),
      corner: await readWord(page, svg, 0, null, [{ sel: 'circle[fill="#5A5F55"]', attrs: { cx: '32.3', cy: '14.8', r: '0.7' } }]) }; }
  if (!plants.open && q.choices.includes('icon:door~open')) { const svg = await tile('icon:door~open');
    plants.open = { grown: await readWord(page, svg, 0, null, [{ sel: 'text', attrs: { textLength: '51' } }]) }; }
  if (!plants.heart && q.choices.includes('icon:note~love')) { const svg = await tile('icon:note~love'); const heart = (d) => [{ sel: 'path[fill="#D9473B"]', attrs: { transform: `translate(${-d} 0)` } }];
    // The note's other word: "you" moved up onto "I love", the fold line between them taken away, so only the other word is in its room.
    plants.heart = { into: await readWord(page, svg, 1, null, heart(5)), near: await readWord(page, svg, 1, null, heart(2)),
      words: await readWord(page, svg, 1, null, [{ sel: 'line', attrs: { stroke: 'none' } }, { sel: 'text:nth-of-type(2)', attrs: { y: '50' } }]) }; }
  // The near miss for a shape over an outline's line: the crayon box's red crayon moved left across the box's line, which a room bounded by
  // the outline's line alone would leak through.
  if (!plants.crayon && q.choices.includes('icon:box~crayons')) { const svg = await tile('icon:box~crayons');
    plants.crayon = { over: await readWord(page, svg, 0, null, [{ sel: 'path[fill="#D9473B"]', attrs: { transform: 'translate(-14 0)' } }]) }; }
  // The sizes' plants: on the first Words all around us screen with the tree, and the first Write to tell screen with no stop sign.
  const setSvg = (c, attrs, style) => page.evaluate(([cc, a, st]) => { const s = document.querySelector(`button[data-choice="${cc}"] svg`); if (!s) return; window.__sizeUndo = window.__sizeUndo || [];
    const was = ['width', 'height', 'style'].map((k) => [k, s.getAttribute(k)]); window.__sizeUndo.push(() => { for (const [k, v] of was) { if (v === null) s.removeAttribute(k); else s.setAttribute(k, v); } });
    for (const [k, v] of Object.entries(a || {})) s.setAttribute(k, v); for (const [k, v] of Object.entries(st || {})) s.style.setProperty(k, v, 'important'); }, [c, attrs, style]);
  const unset = () => page.evaluate(() => { for (const f of (window.__sizeUndo || []).reverse()) f(); window.__sizeUndo = []; });
  const tried = async (fn) => { await fn(); await page.waitForTimeout(50); const t = await boxesOf(page); await unset(); return sizeFaults(t, px); };
  if (!plants.sizes && sc.g === 'p3-around-has' && q.choices.includes('icon:tree')) {
    const plain = q.choices.filter((c) => !printIcon(c));
    plants.sizes = { alone: await tried(async () => { for (const c of plain) await setSvg(c, { width: '64', height: '64' }); }),
      old: await tried(async () => { for (const c of q.choices) await setSvg(c, { width: '64', height: '64' }); }),
      hidden: await tried(() => setSvg('icon:tree', null, { transform: 'scale(0.76)' })),
      inside: await tried(() => setSvg('icon:tree', { width: '84.4', height: '84.4' })), outside: await tried(() => setSvg('icon:tree', { width: '84.6', height: '84.6' })) };
  }
  if (!plants.plain && sc.g === 'p4-tell-job' && !q.choices.some(printIcon)) {
    const at = (await boxesOf(page))[0].w; plants.plain = { one: await tried(() => setSvg(q.choices[0], { width: String(at + 20), height: String(at + 20) })), near: await tried(() => setSvg(q.choices[0], { width: String(at + 0.4), height: String(at + 0.4) })) };
  }
}

// --- The verdicts ---
// 2. The sizes: every screen of every print bank read at every size in both themes, each as the rule asks, and every plant caught.
const sizeBad = sizeReads.filter((x) => x.faults.length); const banksRead = new Set(sizeReads.map((x) => x.g));
const cfgs = new Set(sizeReads.map((x) => x.cfg)); const withPrint = sizeReads.filter((x) => x.tiles.some((t) => printIcon(t.tok))).length;
// Both of the rule's sizes, 84 and 69, read in each theme, so a size left out of SIZES cannot pass unread.
const bothSizes = ['light', 'dark'].every((t) => [84, 69].every((px) => sizeReads.some((x) => x.px === px && x.cfg.startsWith(t + ' '))));
const P = plants.sizes || {}; const N = plants.plain || {};
const sizePlants = !!plants.sizes && !!plants.plain && P.alone.length > 0 && P.old.length > 0 && P.hidden.length > 0 && P.inside.length === 0 && P.outside.length > 0 && N.one.length > 0 && N.near.length === 0;
ok(`every picture of a print question draws at a print drawing's size, 84 pixels at 390 by 844 and 69 on a short phone (375 by 667 and 320 by 568), read in the page by its drawn box, within ${SIZE_SLACK} pixels, and every tile of a screen with no drawing with words at one size, in both themes (${tileBanks.size} banks: ${[...tileBanks.keys()].join(', ')}; ${screens.length} screens, ${sizeReads.length} reads, ${withPrint} with a drawing with words; planted: the print drawings alone at 84, caught, every tile at 64, caught, the tree drawn at 0.76 by a transform its attributes hide, caught, the tree at 84.4 pixels, passed, and at 84.6, caught, and on a screen with no drawing with words one drawing 20 pixels larger, caught, and 0.4 larger, passed)`,
  tileBanks.size >= FLOORS.banks && screens.length >= FLOORS.screens && sizeReads.length === screens.length * SIZES.length * 2 && cfgs.size === SIZES.length * 2 && bothSizes && banksRead.size === tileBanks.size && sizeBad.length === 0 && sizePlants,
  { caught: plants.sizes && plants.plain ? { alone: P.alone.length > 0, old: P.old.length > 0, hidden: P.hidden.length > 0, inside: P.inside.length > 0, outside: P.outside.length > 0, one: N.one.length > 0, near: N.near.length > 0 } : 'not planted', bothSizes, banks: tileBanks.size, screens: screens.length,
    bad: sizeBad.slice(0, 6).map((x) => [x.cfg, x.g, x.s, x.faults]), reads: sizeReads.length, unshown: unshown.slice(0, 6), plants });
// 1. The words: every word of every drawing read in both themes, inside its room by WORD_MARGIN, in the page's face and in DejaVu Sans Bold.
const wordBad = wordReads.filter((x) => !reads(x.r)); const least = {}; for (const x of wordReads) { const k = `${x.word} (${x.face === 'page' ? 'this machine' : 'DejaVu Sans Bold'})`; if (x.r && x.r.clear !== null && (!least[k] || x.r.clear < least[k].clear)) least[k] = { clear: x.r.clear, where: x.where }; }
// Every word DRAWN_WORDS gives read in each theme, on a tile or on the paper, in the page's face and in DejaVu Sans Bold.
const allWords = Object.entries(DRAWN).flatMap(([look, ws]) => ws.map((w, i) => `${look} ${i}`));
const covered = (list) => ['light', 'dark'].every((t) => ['page', 'DejaVu'].every((f) => allWords.every((k) => list.some((x) => x.theme === t && x.face === f && `${x.look} ${x.i}` === k))));
// The lesson lines and pictures read, in each theme apart.
const placesIn = (t, re) => new Set(wordReads.filter((x) => x.theme === t && re.test(x.where)).map((x) => x.where)).size;
const linesRead = ['light', 'dark'].map((t) => placesIn(t, / line \d+$/)); const picturesRead = ['light', 'dark'].map((t) => placesIn(t, /(picture|explanation)$/));
const M = plants.milk || {}; const S = plants.sam || {}; const O = plants.open || {}; const H = plants.heart || {}; const K = plants.crayon || {};
const plantReads = [M.grown, M.looseHere, M.looseFace, M.narrow, M.narrowNear, M.offBand, M.dashed, M.above, M.below, S.up, S.upNear, S.corner, O.grown, H.into, H.near, H.words, K.over];
const wordPlants = !!plants.milk && !!plants.sam && !!plants.open && !!plants.heart && !!plants.crayon && plantReads.every(ran) && !ran(M.dead) && !reads(M.dashed) && !reads(H.words) && reads(K.over)
  && !reads(M.grown) && !reads(M.looseFace) && reads(M.fittedFace) && !reads(M.narrow) && reads(M.narrowNear) && !reads(M.offBand)
  && reads(M.above) && M.above.clear < WORD_MARGIN + 1 && !reads(M.below) && M.below.clear >= WORD_MARGIN - 1
  && !reads(S.up) && reads(S.upNear) && !reads(S.corner) && !reads(O.grown) && !reads(H.into) && reads(H.near)
  && Array.isArray(plants.text) && !sameWords('milk~carton', plants.text) && covered(wordReads) && !covered(wordReads.filter((x) => x.look !== 'note~dogs'));
const leastLine = Object.entries(least).sort((a, b) => a[1].clear - b[1].clear).slice(0, 4).map(([k, v], n) => k + ' ' + v.clear + ' units' + (n ? '' : ' (' + v.where + ')')).join(', ');
ok(`each word a drawing prints stays inside its outline, read in the page: its painted box, grown by ${WORD_MARGIN} units, holds only the room its outline closes around it, clear of every other shape, in both themes, on the first tile that shows each drawing with words at each of the print questions' sizes, 84 and 69 pixels, on every lesson line and every question's and explanation's picture that shows one, and in DejaVu Sans Bold too (${wordReads.length} reads of the ${allWords.length} words, ${linesRead.join(' and ')} lesson lines and ${picturesRead.join(' and ')} pictures in the light and dark themes; the least room: ${leastLine}; planted: MILK at DejaVu Sans Bold's 47.2 units, caught; MILK with no textLength, caught in DejaVu Sans Bold (${M.looseHere ? M.looseHere.clear : '?'} units in this machine's face); the carton's outline 3 units narrower each side, the table unchanged, caught, and half a unit, passed; MILK off its band, caught; the carton's outline dashed, so it closes no room, caught; Sam 4 units up into its card, caught, and half a unit, passed; the cubby's coat hook just off Sam's corner, caught; OPEN past its sign inside the door's window, caught; the note's heart 5 units into "you", caught, and 2, passed; "you" moved onto "I love" with the fold line taken away, caught; a crayon moved across the crayon box's line, passed; MILK grown to ${M.above ? M.above.clear : '?'} and ${M.below ? M.below.clear : '?'} units, passed and caught; MILK's text changed in the page, caught; the reads with the note about dogs left out, short; and every plant changed the drawing, one aimed at nothing read as not run)`,
  wordBad.length === 0 && unknown.length === 0 && unshown.length === 0 && covered(wordReads) && linesRead.every((n) => n >= FLOORS.lines) && picturesRead.every((n) => n >= FLOORS.pictures) && allWords.length >= FLOORS.words && wordPlants,
  { caught: plants.milk && plants.sam && plants.open && plants.heart && plants.crayon ? Object.fromEntries(Object.entries({ grown: M.grown, looseFace: M.looseFace, fittedFace: M.fittedFace, narrow: M.narrow, narrowNear: M.narrowNear, offBand: M.offBand, dashed: M.dashed, above: M.above, below: M.below, up: S.up, upNear: S.upNear, corner: S.corner, open: O.grown, heartInto: H.into, heartNear: H.near, words: H.words, crayon: K.over }).map(([k, r]) => [k, !reads(r)])) : 'not planted',
    ran: plants.milk && plants.sam && plants.open && plants.heart && plants.crayon ? plantReads.every(ran) && !ran(M.dead) : 'not planted', text: Array.isArray(plants.text) ? !sameWords('milk~carton', plants.text) : 'not planted', covered: covered(wordReads), dogsLeftOut: !covered(wordReads.filter((x) => x.look !== 'note~dogs')),
    bad: wordBad.slice(0, 6).map((x) => [x.where, x.word, x.face, x.r]), unknown: unknown.slice(0, 4), unshown: unshown.slice(0, 6), lines: linesRead, pictures: picturesRead, plants });
ok('no page errors along the way', errors.length === 0, errors);
console.log(`\n${passed} passed, ${failed} failed`);
process.exitCode = failed ? 1 : 0;   // never process.exit(): it can drop the last lines of a piped stdout (2026-09-23)
