// The Wise Human. Copyright (c) 2026. Source-available; not for reuse. See LICENSE.md.
// Every drawing on the dark theme's lesson paper reads at its edge (pass NE, EARMARKS A92, found by the screen reader who edged A89's
// drawings). In the dark theme a lesson's line and a question's own picture sit on a light green paper (C.paperBoard, #D9E6DC), drawn
// with the light palette; in the light theme that paper is white, a light answer tile's own color, and tests/e2e/tile-edges.mjs reads the
// same kinds on a light tile, but a drawing can differ by whether it sits on a tile (a bar's cells take an edge on a light tile that the
// light paper does not give them), so no check reads the light paper's own drawings, a blind spot named below (round two's code read
// found no fault there by hand: the light palette's gold reads 3.24 to 1 on white). Until this check nothing read the dark theme's. In plain terms: every read-aloud lesson is walked line by line
// (step.show, and each picture in a pair or a row), and every bank of every course is dealt at seeds 1 to 80 (each question's own
// picture, and its explanation's, which shows once the right answer is checked); every drawing found there (a drawn icon, an animal, a
// feeling face or a group of them, a colored shape, square or item, a coloring page's thing, a solid, a die, a domino, fair shares, dots,
// tens, an array, a ten-frame, a bar or a tower, a clock, a digital clock, a row of shapes, and a letter, a line or dots drawing
// themselves on their card) is shown on its paper in the real page, in the dark theme, a lesson's line through the lesson's own Next
// (window.__eduTest.openModule) and a question through window.__eduTest.showQuestion, and shot alone, every background up its ancestors
// made clear and a step's number and a stand-in's note hidden. A picture of several drawings (a group of faces, the bars, a row of
// shapes) has each different drawing shot alone. Its edge is read against the paper's own color, read from the page as tile-edges reads
// its tiles: an edge pixel (opaque, within two device pixels of a clear one, at twice the size) reads when it, or an opaque pixel within
// eight device pixels of it (four on the screen), is 3 to 1 or better against the paper, since an outline that melts into the paper is
// seen by the fill just inside it; a drawing reads when 95 percent of its edge reads. When this check was written 320 of its 1399
// drawings fell short: every tens (10) and array (59) and every bar and tower (225), all at 0, in the dark theme's own green and gold;
// every group of dots (10, 0.68 to 0.76), their lit side pale; the cone (0.93); and fifteen icons, the bubble, the wind and the ice (0
// each), the plate and plate~food (0.04), the shadow (0.20), the hill (0.34), the soil (0.53), the table (0.64), the space bar (0.70), the
// lamp (0.79), the flat rock (0.81), the boulder (0.88), the plant (0.90) and the speckled rock (0.90). Pass NE edged each in src/ui.jsx
// with the house's patterns, on the dark theme's paper only (dkPaper, or the paper flag PictureInner passes), so none waits. Its plant:
// the digital clock, which reads, its colors turned the paper's own, caught; its near miss: the clock's dark outline turned the paper's
// own color, its dark body just inside reading, passed, as the eye reads it; R's other side: that outline at seven units wide, wider
// than R reaches past, caught; the bar's two sides: two squares drawn in the page, one with a strip of its edge melted into the paper so
// about 92 percent reads, caught, and one at about 96 percent, passed; and the paper read from the page: every paper turned the dark
// theme's card color in the page, read as that color, and the clock caught on it. Left out by name, so a kind the code adds fails here
// until it is placed: writing (letters and print, words set in the paper's own green, 5.82 to 1 there; the dark theme check, step 12,
// reads one lesson's lit letters on that paper, and no check reads every lesson's) and a pair and a row (each picture in them is read on
// its own). Until pass NF the diagrams, charts, maps and number lines were left out by name too (EARMARKS A98).
// Since pass NF (EARMARKS A98) it reads three things more. First the diagrams, charts, maps and number lines (DIAGRAM_KINDS, 31 kinds),
// as a group of their own: a diagram reads as a drawing does, 3 to 1 on 95 percent of its edge against the paper, except that its guides
// are hidden for the shot, since a guide (the faint lines a bar graph and a point's grid draw to lead the eye, marked data-guide in
// src/ui.jsx) is drawn faint on purpose and is no edge a child must find; every guide is held to a guide's look (a bare line no wider than
// one unit) and to a kind GUIDED names, so a part a child must find cannot hide as one. Before pass NF's fixes 660 of the 2,773 diagrams
// fell short, in 13 of the 31 kinds: every map (0.000 to 0.002, its pale ground), every group of sets (0.000), the percent grid (0.038
// to 0.043), the periodic table (0.057 to 0.060), the point's grid (0.310 to 0.327, its faint lines and the gold lines to its axes),
// every bar graph (0.510 to 0.930, its faint lines), the cell (0.584 to 0.632), the day and night (0.585) and the light ray (0.571 to
// 0.689), the light palette's gold sun and rays, the balance (0.836 to 0.869, its stand), the two-way arrows (0.855 to 0.861), 85 of the
// 197 angles (0.811 to 0.948, the gold arc) and the beaker (0.906 to 0.949, the liquid's top); pass NF edged each in src/ui.jsx with the
// house's patterns on the dark theme's paper (paperGold, PAPER_GRAY, and a frame, a rule or a deeper shade of a part's own color) and
// marked the two grids' faint lines as guides, so none waits. Its plant: the day-and-night picture's deeper gold turned back to the
// light palette's gold in the page, as it drew before pass NF, caught; the guides' plants: the first bar graph read with its guides
// shown falls short (so the guides are what the rule leaves out), a bar marked a guide is caught by the guide's look, and a guide line
// 1.2 units wide is caught too. Second, More Info's paper boxes: every drawing a choice draws in a box (228 drawings in 176 sheets), shot
// alone in the real sheet, read against the box's own color read from the page; until pass NF the boxes drew through choiceFace with no
// paper flag, so their dots and the looks of dots had no rim (10 of them at 0.773, one at 0.932), and the baby (0.802, 0.831) and a small
// yellow square (0.932) were too fine at a box's size; its plant: a box's dots with their rim taken away, caught. Third, the paper's
// palette: a clock, a ten-frame and a fraction bar on the paper wear no color the dark theme's palette alone names (THEMES, read from
// src/ui.jsx), as every drawing on the paper is drawn in the light palette, B; until pass NF all three took the live palette there, a
// night-green face or cells on the light paper, which read at their edge and so no edge check could see; its plant: the first clock's
// face filled with the dark theme's surface, caught.
// Blind spots, named: an edge pixel is opaque beside a clear one, so a translucent part (a soft shadow, a bubble drawn at nine tenths)
// is read as its own color, not as it shows over the paper, and a part that meets it is read where the opaque part ends; and a drawing
// is read where it first shows, at that size, as tile-edges reads it on its tile; and the light theme's paper, whose drawings no check
// reads (above); and since pass NF a guide, whose own contrast no check reads; and the pictures a reader's lesson shows (its example, its
// other ways and its stories), which hold most of the diagram kinds DIAGRAMS draws and which no walk here reaches (EARMARKS A106); and the
// colors an icon takes from the live palette on the paper (IconPic's gold and green), which the palette's reading leaves to the icons'
// own edges (EARMARKS A107).
import { createRequire } from 'node:module'; import { execSync } from 'node:child_process'; import { readFileSync } from 'node:fs';
const G = execSync('npm root -g').toString().trim(); const { chromium } = createRequire(import.meta.url)(`${G}/playwright`);
const L = await import('../../src/logic.mjs');
let passed = 0, failed = 0; const ok = (name, cond, info) => { if (cond) { passed++; console.log('PASS - ' + name); } else { failed++; console.log('FAIL - ' + name + (info !== undefined ? '  ' + JSON.stringify(info).slice(0, 900) : '')); } };
// Every kind the paper draws as a drawing: the kinds an answer tile draws too (tile-edges' KINDS, its print aside), and the paper's own
// drawings of the same sort: a group of faces, a row of shapes, a ten-frame, a domino and a letter, a line or dots drawing themselves.
const KINDS = ['icon', 'pic', 'face', 'faces', 'item', 'swatch', 'art', 'shape', 'solid', 'dice', 'domino', 'shares', 'dots', 'tens', 'array', 'tenframe', 'bars', 'clock', 'digital', 'pattern', 'trace'];
// The diagrams, charts, maps and number lines (pass NF, EARMARKS A98; until then left out by name): read as a group of their own, as a
// drawing is read, except that a diagram's guides are hidden for the shot (GUIDED, below).
const DIAGRAM_KINDS = ['numberline', 'openline', 'sets', 'pans', 'joined', 'measure', 'tally', 'bargraph', 'picto', 'daynight', 'flow', 'sign', 'flag', 'map', 'compass', 'growthbars', 'loop', 'twoway', 'stack', 'bar', 'plot', 'groups', 'tri', 'para', 'percentgrid', 'angles', 'cell', 'alleles', 'periodic', 'beaker', 'lightray'];
// Left out, each by name (above): writing and the holders.
const WRITING = ['letters', 'print']; const HOLDERS = ['pair', 'row'];
const READ = [...KINDS, ...DIAGRAM_KINDS];
const placed = (k) => READ.includes(k) || WRITING.includes(k) || HOLDERS.includes(k);
const BAR = 0.95;
// A diagram's guides (pass NF): the faint lines a bar graph and a point's grid draw to lead the eye, marked data-guide in src/ui.jsx and
// hidden for the shot, since they are drawn faint on purpose and are no edge a child must find. A guide must look like one (a bare line,
// no fill, no wider than GUIDE_WIDEST of its picture's units) and sit in a kind GUIDED names, so a part a child must find cannot hide as one.
const GUIDED = ['bargraph', 'plot']; const GUIDE_WIDEST = 1;
const guideLook = (g) => g.tag === 'line' && (g.fill === null || g.fill === 'none') && Number(g.width) > 0 && Number(g.width) <= GUIDE_WIDEST;
// The paper's palette (pass NF): a clock, a ten-frame and a fraction bar on the paper draw in the light palette, B, as every drawing there
// does, so none wears a color the dark theme's own palette names and the light one does not (THEMES in src/ui.jsx, read from the source).
const PALETTE_KINDS = ['clock', 'tenframe', 'bar'];
const UI = readFileSync(new URL('../../src/ui.jsx', import.meta.url), 'utf8');
const themeHexes = (name) => { const i = UI.indexOf(`  ${name}: {\n    mode:`); const j = UI.indexOf('\n  },', i); return i < 0 || j < 0 ? new Set() : new Set([...UI.slice(i, j).matchAll(/#[0-9A-Fa-f]{6}\b/g)].map((m) => m[0].toUpperCase())); };
const LIGHT_OWN = themeHexes('light'); const DARK_OWN = [...themeHexes('dark')].filter((h) => !LIGHT_OWN.has(h));
const themeColor = (name, token) => { const m = new RegExp(`  ${name}: \\{\\n[\\s\\S]*?\\b${token}: '(#[0-9A-Fa-f]{6})'`).exec(UI); return m ? m[1].toUpperCase() : null; };
const DARK_SURFACE = themeColor('dark', 'surface'); const LIGHT_GOLD = themeColor('light', 'gold');
// The deeper gold a gold line takes on the dark theme's paper (paperGold in src/ui.jsx), read from the source for the sun's plant.
const DEEP_GOLD = ((/const paperGold = \(\) => \(C\.mode === 'dark' \? '(#[0-9A-Fa-f]{6})'/.exec(UI) || [])[1] || '').toUpperCase();
// The counts the code has (as the fold check's FLOORS): how many drawings the lessons and questions put on the paper, and of how many kinds;
// since pass NF how many diagrams, of how many kinds, how many guides they hold, how many drawings More Info's boxes draw in how many
// sheets, and how many clocks, ten-frames and fraction bars are read for their palette. The drawings were 1,399 when this check was written
// and are 1,405 by pass NF's count, with no fix of pass NF's among them.
const FLOORS = { drawings: 1405, kinds: 21, diagrams: 2773, diagramKinds: 31, guides: 2377, boxes: 228, sheets: 176, palette: 99 };
// A picture's fields that only place or size it (a pair's frame, a step's number, a lesson's caption) are no part of its drawing, and a
// name's #2 only tells two of one picture apart.
const LAYOUT = ['size', 'step', 'frame', 'snap', 'gap', 'grow', 'tight', 'align', 'caption', 'another'];
const leavesOf = (v) => (!v || typeof v !== 'object' || Array.isArray(v) ? [] : v.kind === 'pair' ? [...leavesOf(v.a), ...leavesOf(v.b)] : v.kind === 'row' ? (v.items || []).slice(0, 3).flatMap(leavesOf) : [v.kind ? v : { kind: 'item', ...v }]);
const keyOf = (v) => JSON.stringify(Object.fromEntries(Object.keys(v).filter((k) => !LAYOUT.includes(k)).sort().map((k) => [k, v[k]])), (k, x) => (typeof x === 'string' ? x.replace(/#\d+$/, '') : x));
const nameOf = (v) => { const n = v.name !== undefined ? String(v.name).replace(/#\d+$/, '') : null;
  if (['icon', 'pic', 'art', 'solid'].includes(v.kind)) return `${v.kind}:${n}`;
  if (v.kind === 'shape') return `shape:${n}${v.variant ? '~' + v.variant : ''}${v.colour ? ' ' + v.colour : ''}`;
  if (v.kind === 'face') return `face:${v.feeling}`;
  if (v.kind === 'swatch') return `swatch:${v.colour}`;
  if (v.kind === 'item') return `item:${v.shape}-${v.colour}${v.scale ? '-' + v.scale : ''}`;
  const words = Object.entries(v).filter(([k]) => k !== 'kind' && !LAYOUT.includes(k)).map(([, x]) => (typeof x === 'string' || typeof x === 'number' ? String(x) : Array.isArray(x) && x.every((s) => typeof s === 'string' || typeof s === 'number') ? x.join(',') : null)).filter((x) => x !== null);
  return v.kind + (words.length ? ':' + words.join(' ') : ''); };
// Where each drawing first shows on the paper: a lesson's line, or a bank's question at a seed (its own picture, or its explanation's).
const planned = new Map(); const lines = new Map(); const asks = new Map(); const unplaced = new Map(); const unread = [];
const note = (v, where, into = unplaced) => { for (const x of leavesOf(v)) if (!placed(x.kind) && !into.has(x.kind)) into.set(x.kind, where); };
for (const c of L.COURSES) if (c.readAloud) for (const m of c.modules) L.readAloudScript(m).forEach((st, i) => {
  note(st.show, `${m.id} line ${i + 1}`);
  const fresh = leavesOf(st.show).filter((v) => READ.includes(v.kind) && !planned.has(keyOf(v))); if (!fresh.length) return;
  for (const v of fresh) planned.set(keyOf(v), `${m.id} line ${i + 1}`);
  if (!lines.has(m.id)) lines.set(m.id, []); lines.get(m.id).push({ line: i, show: st.show });
});
for (const c of L.COURSES) for (const m of c.modules) for (const g of [...new Set(m.generators || [])]) for (let s = 1; s <= 80; s++) {
  let q; try { q = L.generateQuestion(g, s); } catch (e) { continue; } if (!q) continue;
  // An explanation's dots and bars are drawn on the answer's own green or clay box, not on the paper (the practice screen).
  for (const [part, v] of [['visual', q.visual], ['explain', q.explainVisual && !Array.isArray(q.explainVisual) && q.explainVisual.kind !== 'dots' ? q.explainVisual : null]]) {
    note(v, `${g} seed ${s}`);
    const fresh = leavesOf(v).filter((x) => READ.includes(x.kind) && !planned.has(keyOf(x))); if (!fresh.length) continue;
    // The explanation shows once the right answer is tapped and checked, which only a choice question has a tap for.
    if (part === 'explain' && q.type !== 'choice') { for (const x of fresh) unread.push(`${g} seed ${s}: ${nameOf(x)}, its explanation, on a ${q.type} question`); continue; }
    for (const x of fresh) planned.set(keyOf(x), `${g} seed ${s}${part === 'explain' ? ', its explanation' : ''}`);
    const qk = `${g}|${s}|${m.id}`; if (!asks.has(qk)) asks.set(qk, {}); asks.get(qk)[part] = true;
  }
}
// More Info's boxes (pass NF, EARMARKS A98): every drawing a choice draws there (the kinds a tile draws, writing aside), at the first choice
// question at seeds 1 to 80 whose sheet draws it in a box, a wrong choice with a reason of its own or the answer under why it fits
// (choiceInsight, as the sheet reads it after the right answer is checked). A choice of a kind no list names fails here until it is placed.
const BOX_KINDS = ['icon', 'pic', 'face', 'item', 'swatch', 'art', 'shape', 'solid', 'dice', 'shares', 'dots', 'look', 'bar', 'tower', 'tens', 'array', 'clock', 'digital'];
const BOX_WRITING = ['print'];
const boxPlanned = new Map(); const boxAsks = new Map(); const boxUnplaced = new Set();
for (const c of L.COURSES) for (const m of c.modules) for (const g of [...new Set(m.generators || [])]) for (let s = 1; s <= 80; s++) {
  let q; try { q = L.generateQuestion(g, s); } catch (e) { continue; } if (!q || q.type !== 'choice' || !Array.isArray(q.choices)) continue;
  const ins = L.choiceInsight(q, [], {}); if (!ins.any) continue;
  for (const t of [...ins.wrong.map((w) => w.choice), ...(ins.right ? [String(q.answer)] : [])]) {
    const k = /^([a-z]+):/.exec(t); if (!k) continue; if (!BOX_KINDS.includes(k[1])) { if (!BOX_WRITING.includes(k[1])) boxUnplaced.add(k[1]); continue; }
    const key = t.split('#')[0]; if (boxPlanned.has(key)) continue; boxPlanned.set(key, `${g} seed ${s}`);
    const qk = `${g}|${s}|${m.id}`; if (!boxAsks.has(qk)) boxAsks.set(qk, []); boxAsks.get(qk).push({ key, token: t });
  }
}
// The kinds' plant: a pair with a half of a kind no list names, caught by the same walk.
const plantedKinds = new Map(); note({ kind: 'pair', a: { kind: 'icon', name: 'cat' }, b: { kind: 'a kind of no name' } }, 'planted', plantedKinds); const plantKind = plantedKinds.has('a kind of no name');
const hexOf = (rgb) => { const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(String(rgb)); return m ? '#' + [m[1], m[2], m[3]].map((x) => Number(x).toString(16).padStart(2, '0')).join('').toUpperCase() : null; };
// The reading, in the page: a shot of one drawing (a PNG, its background clear) and the share of its edge that reads on each color.
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
// The papers a part of the screen holds, each paper's color and, for each picture on it in the order its visual names them (a pair's
// first half, then its second; a row's pictures from the left), the drawings it draws, each tagged for its shot.
const papersIn = (page, scope) => page.evaluate((sc) => {
  for (const e of document.querySelectorAll('[data-edge-i]')) e.removeAttribute('data-edge-i');
  const drawn = (el) => [...(el.matches('svg, img') ? [el] : []), ...el.querySelectorAll('svg, img')].filter((n) => !(n.parentElement && n.parentElement.closest('svg')));
  const slot = (s) => { const out = []; for (const k of s.children) { if (k.matches('[data-step-badge], [data-replace-note]')) continue;
    if (k.matches('[data-stand-in]') || /scale/.test(k.style.transform || '')) out.push(...slot(k));
    else if (k.matches('[data-pair]')) for (const h of k.children) out.push(...(h.matches('svg') ? [drawn(h)] : slot(h)));
    else if (k.matches('.edu-row-pic')) for (const cell of k.children) out.push(...slot(cell));
    else out.push(drawn(k)); } return out; };
  let n = 0;
  return [...document.querySelectorAll(sc)].map((p) => ({ paper: getComputedStyle(p).backgroundColor, leaves: slot(p).map((list) => list.map((d) => { d.setAttribute('data-edge-i', String(n)); return { i: n++, label: d.getAttribute('aria-label') || d.tagName.toLowerCase() }; })) }));
}, scope);
// The drawing on its paper, every background up its ancestors made clear and a step's number and a stand-in's note hidden (all put
// back after the shot), shot alone at twice the size. Since pass NF a diagram's guides (data-guide) are hidden too, unless the shot asks
// for them (guides: the guide plant's reading), and a drawing in More Info's sheet is shot with everything but it and its ancestors
// hidden (alone), since the sheet floats over the practice screen, which would show through the cleared backgrounds.
const shoot = async (page, i, plant = null, alone = false, guides = false) => {
  const handle = await page.evaluateHandle(([n, pl, al, gd]) => { const f = document.querySelector(`[data-edge-i="${n}"]`); if (!f) return null;
    window.__edgeWas = []; for (let e = f.parentElement; e; e = e.parentElement) { window.__edgeWas.push([e, e.getAttribute('style')]); e.style.setProperty('background', 'transparent', 'important'); e.style.setProperty('box-shadow', 'none', 'important'); }
    for (const b of document.querySelectorAll('[data-step-badge], [data-replace-note]')) { window.__edgeWas.push([b, b.getAttribute('style')]); b.style.setProperty('visibility', 'hidden', 'important'); }
    if (!gd) for (const g of f.querySelectorAll('[data-guide]')) { window.__edgeWas.push([g, g.getAttribute('style')]); g.style.setProperty('visibility', 'hidden', 'important'); }
    if (al) for (let e = f; e.parentElement; e = e.parentElement) for (const sib of e.parentElement.children) if (sib !== e) { window.__edgeWas.push([sib, sib.getAttribute('style')]); sib.style.setProperty('visibility', 'hidden', 'important'); }
    // A plant: every color of the drawing turned the paper's own ({ all: color }), or only its outlines ({ strokes: color }), or since
    // pass NF one color turned another wherever it fills or strokes ({ swap: [from, to] }).
    if (pl) { window.__edgePlant = [...f.querySelectorAll('*')].map((x) => [x, x.getAttribute('fill'), x.getAttribute('stroke'), x.getAttribute('stroke-width')]); for (const x of f.querySelectorAll('*')) { if (pl.swap) { for (const at of ['fill', 'stroke']) if ((x.getAttribute(at) || '').toUpperCase() === pl.swap[0]) x.setAttribute(at, pl.swap[1]); continue; } if (pl.all && x.getAttribute('fill') && x.getAttribute('fill') !== 'none') x.setAttribute('fill', pl.all); const st = pl.all || pl.strokes; if (x.getAttribute('stroke') && x.getAttribute('stroke') !== 'none') { x.setAttribute('stroke', st); if (pl.width) x.setAttribute('stroke-width', String(pl.width)); } } }
    return f; }, [i, plant, alone, guides]);
  const el = handle.asElement(); if (!el) return null;
  const png = await el.screenshot({ omitBackground: true, animations: 'disabled' });
  await page.evaluate(() => { for (const [e, s] of (window.__edgeWas || []).reverse()) { if (s === null) e.removeAttribute('style'); else e.setAttribute('style', s); } delete window.__edgeWas;
    for (const [x, f, s, w] of window.__edgePlant || []) { if (f === null) x.removeAttribute('fill'); else x.setAttribute('fill', f); if (s === null) x.removeAttribute('stroke'); else x.setAttribute('stroke', s); if (w === null) x.removeAttribute('stroke-width'); else x.setAttribute('stroke-width', w); } delete window.__edgePlant; });
  return png.toString('base64');
};
// A square drawn in the page, the paper's ink on a clear ground, with a strip of its top edge (from its left corner, this many pixels
// long, deeper than R) painted the paper's own color, as a PNG: the bar's two cases.
const SQUARE_MELT = { low: 70, high: 34 };
const square = (page, melt, ink, paper) => page.evaluate(([m, k, p]) => { const cv = document.createElement('canvas'); cv.width = 240; cv.height = 240; const cx = cv.getContext('2d'); cx.fillStyle = k; cx.fillRect(20, 20, 200, 200); cx.fillStyle = p; cx.fillRect(20, 20, m, 14); return cv.toDataURL('image/png').split(',')[1]; }, [melt, ink, paper]);
const INK = '#24291F'; const PLANT_PAPER = '#1D302A';   // the paper's ink (the light palette's), and the dark theme's card for the paper's plant
// A diagram's guides as drawn (pass NF): each one's element, fill and width in its picture's units, for the guide's look.
const guidesIn = (page, i) => page.evaluate((n) => { const f = document.querySelector(`[data-edge-i="${n}"]`); return f ? [...f.querySelectorAll('[data-guide]')].map((g) => ({ tag: g.tagName.toLowerCase(), fill: g.getAttribute('fill'), width: g.getAttribute('stroke-width') })) : []; }, i);
// Every color a drawing paints with, as the page computes it (pass NF), for the paper's palette.
const colorsIn = (page, i) => page.evaluate((n) => { const f = document.querySelector(`[data-edge-i="${n}"]`); const out = new Set(); if (!f) return [];
  for (const el of [f, ...f.querySelectorAll('*')]) { const cs = getComputedStyle(el); for (const c of [cs.fill, cs.stroke]) { const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(c || ''); if (m) out.add('#' + [m[1], m[2], m[3]].map((x) => Number(x).toString(16).padStart(2, '0')).join('').toUpperCase()); } }
  return [...out]; }, i);
const browser = await chromium.launch();
const errors = []; const read = {}; const missing = []; const papers = new Set(); let linesShown = 0; let questionsShown = 0;
let plantTurned = null; let nearMelted = null; let plantWide = null; let plantPaper = null; let plantDark = null; let barLow = null; let barHigh = null;
// Since pass NF: the guides read and any whose look or kind is not a guide's, the paper's palette read and any dark theme color found, and
// the new readings' plants, each a number once it has run (the sun's share with its deeper gold turned back, a bar graph's share with
// its guides shown, the guides a bar planted as one and a guide line planted wide add, the dark theme colors a clock planted with its
// face in the dark theme's surface wears, and a More Info box's dots' share with their rim taken away).
let guidesRead = 0; const badGuides = []; let paletteRead = 0; const darkOwn = [];
let plantSun = null; let guidesShown = null; let plantGuideBar = null; let plantGuideWide = null; let plantPalette = null; let plantRim = null;
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, reducedMotion: 'reduce' });
await ctx.addInitScript(() => { try { localStorage.setItem('edusphere_v1_theme', 'dark'); } catch (e) { /* none */ } });
const page = await ctx.newPage(); page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
await page.goto(new URL('./page.html', import.meta.url).href);
const screenIs = (n) => page.waitForFunction((x) => window.__eduTest && window.__eduTest.screen === x, n, { timeout: 15000 });
const tap = async (name) => { const b = page.getByRole('button', { name, exact: true }); if (await b.count()) { await b.first().click({ force: true }); await page.waitForTimeout(250); } };
await screenIs('welcome'); await page.getByRole('button', { name: 'Create account', exact: true }).first().click(); await screenIs('educator-setup');
await page.fill('input[placeholder="PIN"]', '2468'); await page.fill('input[placeholder="PIN again"]', '2468'); await page.fill('input[placeholder="This device\'s name"]', 'Paper'); await page.selectOption('select[aria-label="Your state"]', 'TX');
await page.getByRole('button', { name: 'Create account', exact: true }).click(); await screenIs('educator-pick'); await page.waitForTimeout(400);
for (const n of ['Skip tour', 'Later', 'Got it']) await tap(n);
await page.getByLabel('Walk through early years').first().click({ force: true }); await screenIs('overview'); await page.waitForTimeout(300);
// One paper's drawings not read before, each read against the paper's own color (read from the page).
const readPaper = async (scope, visual, where) => {
  const got = await papersIn(page, scope); const specs = leavesOf(visual);
  if (got.length !== 1 || got[0].leaves.length !== specs.length) { for (const v of specs) if (READ.includes(v.kind) && !read[keyOf(v)]) missing.push(`${where}: ${nameOf(v)} (${got.length} papers, ${got.length ? got[0].leaves.length : 0} pictures for ${specs.length})`); return; }
  const paper = hexOf(got[0].paper); papers.add(paper);
  for (let j = 0; j < specs.length; j++) { const v = specs[j]; if (!READ.includes(v.kind)) continue; const key = keyOf(v); if (read[key]) continue;
    const diagram = DIAGRAM_KINDS.includes(v.kind);
    const ds = got[0].leaves[j]; if (!ds.length) { missing.push(`${where}: ${nameOf(v)} draws nothing`); read[key] = { none: true }; continue; }
    const subs = new Map(); for (const d of ds) if (!subs.has(d.label)) subs.set(d.label, d);
    const one = subs.size === 1; read[key] = { group: !one };
    for (const [lab, d] of subs) { const b64 = await shoot(page, d.i); const r = b64 ? await readEdge(page, b64, [paper]) : null; const k = one ? key : `${key} › ${lab}`;
      read[k] = r ? { share: r.shares[0], name: one ? nameOf(v) : `${nameOf(v)} › ${lab}`, where, kind: v.kind, diagram } : null;
      if (!r) missing.push(`${where}: ${nameOf(v)} was not shot`);
      // A diagram's guides, each held to a guide's look and to a kind GUIDED names (pass NF).
      if (diagram) for (const g of await guidesIn(page, d.i)) { guidesRead += 1; if (!GUIDED.includes(v.kind) || !guideLook(g)) badGuides.push(`${where}: ${nameOf(v)}: a ${g.tag} ${g.width || ''} marked a guide`); }
      // The paper's palette (pass NF): a clock, a ten-frame or a fraction bar wears no color of the dark theme's own.
      if (PALETTE_KINDS.includes(v.kind)) { paletteRead += 1; const own = (await colorsIn(page, d.i)).filter((c) => DARK_OWN.includes(c)); if (own.length) darkOwn.push(`${where}: ${nameOf(v)} wears ${own.join(', ')}`); }
      // The diagrams' plant (pass NF), once, on the day-and-night picture, which reads: its deeper gold (the sun's edge and its rays) turned
      // back to the light palette's gold, as it was before pass NF, caught.
      if (plantSun === null && v.kind === 'daynight' && r && r.shares[0] >= BAR && DEEP_GOLD && LIGHT_GOLD) { const p = await shoot(page, d.i, { swap: [DEEP_GOLD, LIGHT_GOLD] }); const rp = p ? await readEdge(page, p, [paper]) : null; plantSun = rp ? rp.shares[0] : -1; }
      // The guides' plants (pass NF), once, on the first bar graph, which reads: read with its guides shown, it falls short, so the guides
      // are what the rule leaves out; a bar marked a guide, caught by the guide's look; and a guide line 1.2 units wide, caught (each put
      // back after its reading).
      if (guidesShown === null && v.kind === 'bargraph' && r && r.shares[0] >= BAR) {
        const gs = await shoot(page, d.i, null, false, true); const rg = gs ? await readEdge(page, gs, [paper]) : null; guidesShown = rg ? rg.shares[0] : -1;
        const marked = await page.evaluate((n) => { const f = document.querySelector(`[data-edge-i="${n}"]`); const bar = f && [...f.querySelectorAll('rect')].find((x) => x.getAttribute('fill') && x.getAttribute('fill') !== 'none' && !x.closest('svg svg')); if (!bar) return false; bar.setAttribute('data-guide', ''); bar.setAttribute('data-guide-plant', ''); return true; }, d.i);
        plantGuideBar = marked ? (await guidesIn(page, d.i)).filter((g) => !guideLook(g)).length : -1;
        await page.evaluate((n) => { const f = document.querySelector(`[data-edge-i="${n}"]`); for (const x of f ? f.querySelectorAll('[data-guide-plant]') : []) { x.removeAttribute('data-guide'); x.removeAttribute('data-guide-plant'); } }, d.i);
        const was = await page.evaluate((n) => { const f = document.querySelector(`[data-edge-i="${n}"]`); const l = f && f.querySelector('line[data-guide]'); if (!l) return null; const w = l.getAttribute('stroke-width'); l.setAttribute('stroke-width', '1.2'); l.setAttribute('data-guide-plant', ''); return w; }, d.i);
        plantGuideWide = was !== null ? (await guidesIn(page, d.i)).filter((g) => !guideLook(g)).length : -1;
        await page.evaluate(([n, w]) => { const f = document.querySelector(`[data-edge-i="${n}"]`); const l = f && f.querySelector('[data-guide-plant]'); if (l) { l.setAttribute('stroke-width', w); l.removeAttribute('data-guide-plant'); } }, [d.i, was]);
      }
      // The palette's plant (pass NF), once, on the first clock: its face filled with the dark theme's surface, as it drew before pass NF,
      // and the dark theme colors it then wears counted (put back after).
      if (plantPalette === null && v.kind === 'clock' && DARK_SURFACE) {
        const was = await page.evaluate(([n, c]) => { const f = document.querySelector(`[data-edge-i="${n}"]`); const face = f && f.querySelector('circle'); if (!face) return null; const w = face.getAttribute('fill'); face.setAttribute('fill', c); face.setAttribute('data-palette-plant', ''); return w; }, [d.i, DARK_SURFACE]);
        plantPalette = was !== null ? (await colorsIn(page, d.i)).filter((c) => DARK_OWN.includes(c)).length : -1;
        await page.evaluate(([n, w]) => { const f = document.querySelector(`[data-edge-i="${n}"]`); const face = f && f.querySelector('[data-palette-plant]'); if (face) { face.setAttribute('fill', w); face.removeAttribute('data-palette-plant'); } }, [d.i, was]);
      }
      // The plants, once, on the first digital clock that reads: its every color turned the paper's own, caught; its dark outline turned
      // the paper's color, the dark body just inside reading, passed; that outline at seven units wide, caught; and every paper turned the
      // dark theme's card color in the page, read as that color from the page, and the clock read against it, caught.
      if (plantTurned === null && v.kind === 'digital' && r && r.shares[0] >= BAR) {
        const p = await shoot(page, d.i, { all: paper }); const rp = p ? await readEdge(page, p, [paper]) : null; plantTurned = !!rp && rp.shares[0] < BAR;
        const m = await shoot(page, d.i, { strokes: paper }); const rm = m ? await readEdge(page, m, [paper]) : null; nearMelted = !!rm && rm.shares[0] >= BAR;
        const w = await shoot(page, d.i, { strokes: paper, width: 7 }); const rw = w ? await readEdge(page, w, [paper]) : null; plantWide = !!rw && rw.shares[0] < BAR;
        const tag = await page.addStyleTag({ content: `.edu-paper-picture { background: ${PLANT_PAPER} !important; }` });
        plantPaper = hexOf(await page.evaluate((sc) => { const p = document.querySelector(sc); return p ? getComputedStyle(p).backgroundColor : null; }, scope)); await tag.evaluate((n) => n.remove());
        const g = plantPaper ? await readEdge(page, b64, [plantPaper]) : null; plantDark = !!g && g.shares[0] < BAR;
      } }
  }
};
for (const [mid, list] of lines) {
  await page.evaluate((id) => window.__eduTest.openModule(id), mid);
  try { await page.waitForFunction((id) => window.__eduTest.screen === 'lesson' && window.__eduTest.moduleId === id, mid, { timeout: 15000 }); } catch (e) { for (const x of list) missing.push(`${mid} line ${x.line + 1}: the lesson did not open`); continue; }
  for (const x of list) {
    // Next, tapped until the line's own dot is lit (the lesson's dots, one for each line, data-lit on the line showing).
    const at = await page.evaluate(async (target) => { const lit = () => [...document.querySelectorAll('[data-lesson-dots] span')].findIndex((s) => s.hasAttribute('data-lit'));
      for (let t = 0; t < 300 && lit() < target; t++) { const b = document.querySelector('[data-lesson-next] button[aria-label="Next"]'); if (b) b.click(); await new Promise((r) => setTimeout(r, 0)); }
      return lit(); }, x.line);
    if (at !== x.line) { missing.push(`${mid} line ${x.line + 1}: line ${at + 1} shows`); continue; }
    linesShown += 1; await readPaper('.edu-rise .edu-paper-picture', x.show, `${mid} line ${x.line + 1}`);
  }
}
for (const [qk, parts] of asks) {
  const [gen, seed, mid] = qk.split('|'); const q = L.generateQuestion(gen, Number(seed));
  const shown = await page.evaluate(([g, s, m]) => window.__eduTest.showQuestion(g, Number(s), m), [gen, seed, mid]);
  if (!shown) { missing.push(`${gen} seed ${seed}: not shown`); continue; }
  try { await page.waitForFunction(([p, v]) => window.__eduTest.screen === 'practice' && window.__eduTest.question && window.__eduTest.question.prompt === p && JSON.stringify(window.__eduTest.question.visual || null) === v, [q.prompt, JSON.stringify(q.visual || null)], { timeout: 15000 }); } catch (e) { missing.push(`${gen} seed ${seed}: did not show`); continue; }
  questionsShown += 1;
  if (parts.visual) await readPaper('.edu-paper-picture:not([data-explain-picture] .edu-paper-picture)', q.visual, `${gen} seed ${seed}`);
  if (parts.explain) {
    // The explanation's picture shows once the answer is checked: the right answer tapped, then Check answer.
    await page.evaluate((a) => { const b = [...document.querySelectorAll('button[data-choice]')].find((x) => x.getAttribute('data-choice') === a); if (b) b.click(); }, String(q.answer));
    await page.getByRole('button', { name: 'Check answer' }).click();
    try { await page.waitForSelector('[data-explain-picture] .edu-paper-picture', { timeout: 5000 }); } catch (e) { missing.push(`${gen} seed ${seed}: its explanation did not show`); continue; }
    await readPaper('[data-explain-picture] .edu-paper-picture', q.explainVisual, `${gen} seed ${seed}, its explanation`);
  }
}
// More Info's boxes (pass NF, EARMARKS A98): each planned question shown, its right answer tapped and checked, and its sheet opened from
// the More Info link; then each planned choice's drawing in its paper box is shot alone and read against the box's own color, read from
// the page. The page is scrolled to its top first and the sheet waited on until it rests (it places itself again 150 ms after it opens),
// since a drawing in the fixed sheet, shot from a scrolled page, came out a few pixels off, with a box's border in the shot.
const boxes = {}; const boxMissing = []; const boxColors = new Set(); let sheets = 0;
for (const [qk, list] of boxAsks) {
  const [gen, seed, mid] = qk.split('|'); const q = L.generateQuestion(gen, Number(seed));
  const shown = await page.evaluate(([g, s, m]) => window.__eduTest.showQuestion(g, Number(s), m), [gen, seed, mid]);
  if (!shown) { boxMissing.push(`${gen} seed ${seed}: not shown`); continue; }
  try { await page.waitForFunction((p) => window.__eduTest.screen === 'practice' && window.__eduTest.question && window.__eduTest.question.prompt === p, q.prompt, { timeout: 15000 }); } catch (e) { boxMissing.push(`${gen} seed ${seed}: did not show`); continue; }
  const tapped = await page.evaluate((a) => { const b = [...document.querySelectorAll('button[data-choice]')].find((x) => x.getAttribute('data-choice') === a); if (b) b.click(); return !!b; }, String(q.answer));
  if (!tapped) { boxMissing.push(`${gen} seed ${seed}: no button for its answer`); continue; }
  try { await page.getByRole('button', { name: 'Check answer' }).click({ timeout: 5000 }); await page.waitForSelector('[data-more-info-link]', { timeout: 5000 }); await page.locator('[data-more-info-link]').first().click(); await page.waitForSelector('[data-more-info]', { timeout: 5000 }); } catch (e) { boxMissing.push(`${gen} seed ${seed}: its More Info did not open`); continue; }
  await page.evaluate(() => { window.scrollTo(0, 0); window.__sheetAt = null; window.__sheetStill = 0; });
  const rested = await page.waitForFunction(() => { const el = document.querySelector('[data-more-info]'); if (!el) return false; const r = el.getBoundingClientRect(); const at = [r.top, r.left, r.width, r.height].join(','); if (window.__sheetAt === at) window.__sheetStill += 1; else { window.__sheetAt = at; window.__sheetStill = 0; } return window.__sheetStill >= 6; }, null, { polling: 50, timeout: 8000 }).then(() => true).catch(() => false);
  if (!rested) { boxMissing.push(`${gen} seed ${seed}: its More Info never came to rest`); continue; }
  sheets += 1;
  for (const x of list) {
    // The choice's row (a wrong choice's, or the answer's), its paper box, and the drawings in the box, each tagged for its shot.
    const got = await page.evaluate(([tok, answer]) => { for (const e of document.querySelectorAll('[data-edge-i]')) e.removeAttribute('data-edge-i');
      const row = tok === answer ? document.querySelector('[data-more-info-right]') : [...document.querySelectorAll('[data-more-info-wrong]')].find((r) => r.getAttribute('data-more-info-wrong') === tok);
      const box = row && row.firstElementChild; if (!box) return null;
      const ds = [...box.querySelectorAll('svg, img')].filter((n) => !(n.parentElement && n.parentElement.closest('svg'))); let n = 0;
      return { bg: getComputedStyle(box).backgroundColor, leaves: ds.map((d) => { d.setAttribute('data-edge-i', String(n)); return { i: n++, label: d.getAttribute('aria-label') || d.tagName.toLowerCase() }; }) };
    }, [x.token, String(q.answer)]);
    if (!got || !got.leaves.length) { boxMissing.push(`${gen} seed ${seed}: ${x.key} has no drawing in a box`); continue; }
    const bg = hexOf(got.bg); boxColors.add(bg); const subs = new Map(); for (const d of got.leaves) if (!subs.has(d.label)) subs.set(d.label, d);
    for (const [lab, d] of subs) { const b64 = await shoot(page, d.i, null, true); const r = b64 ? await readEdge(page, b64, [bg]) : null; const k = subs.size === 1 ? x.key : `${x.key} › ${lab}`;
      boxes[k] = r ? { share: r.shares[0], where: `${gen} seed ${seed}` } : null; if (!r) boxMissing.push(`${gen} seed ${seed}: ${k} was not shot`);
      // More Info's plant, once, on the first group of dots, which reads: its rim taken away, as it drew before pass NF, caught.
      if (plantRim === null && /^dots:/.test(x.key) && r && r.shares[0] >= BAR) { const p = await shoot(page, d.i, { strokes: 'none' }, true); const rp = p ? await readEdge(page, p, [bg]) : null; plantRim = rp ? rp.shares[0] : -1; } }
  }
}
// The bar's two cases: a square about 92 percent of whose edge reads, caught, and one about 96 percent, passed.
const paperNow = [...papers][0] || '#D9E6DC';
const lo = await readEdge(page, await square(page, SQUARE_MELT.low, INK, paperNow), [paperNow]); const hi = await readEdge(page, await square(page, SQUARE_MELT.high, INK, paperNow), [paperNow]);
const l = lo.shares[0]; const h = hi.shares[0]; barLow = l >= 0.9 && l < BAR ? l : -l; barHigh = h >= BAR && h < 0.99 ? h : -h;
await ctx.close(); await browser.close();
// The verdict: every drawing reads, as many as the code has, the plants caught and the near miss passed; since pass NF every diagram
// too, its guides aside and each guide a guide's look, every drawing in More Info's boxes, and the paper's palette, each plant caught.
const all = Object.values(read).filter((r) => r && r.share !== undefined); const rows = all.filter((r) => !r.diagram); const short = rows.filter((r) => r.share < BAR); const kindsRead = new Set(rows.map((r) => r.kind));
const dRows = all.filter((r) => r.diagram); const dShort = dRows.filter((r) => r.share < BAR); const dKinds = new Set(dRows.map((r) => r.kind));
const bRows = Object.values(boxes).filter((r) => r && r.share !== undefined); const bShort = Object.entries(boxes).filter(([, r]) => r && r.share < BAR);
const caught = (x) => typeof x === 'number' && x >= 0 && x < BAR;
// How many fall short in each kind, for a failure's report.
const byKind = (list) => list.reduce((o, r) => ({ ...o, [r.kind]: (o[r.kind] || 0) + 1 }), {});
ok(`every drawing a lesson's line or a question's own picture puts on the dark theme's paper reads at its edge, 3 to 1 or better on ${Math.round(BAR * 100)} percent of it against the paper (${rows.length} drawings of ${kindsRead.size} kinds, first shown on ${linesShown} lesson lines and ${questionsShown} questions) (pass NE, EARMARKS A92; the digital clock turned the paper's own colors, planted, caught; its dark outline melted into the paper with its body reading, passed; that outline at seven units wide, caught; a square reading about 92 percent of its edge caught and one about 96 percent passed)`,
  missing.length === 0 && unread.length === 0 && short.length === 0 && rows.length >= FLOORS.drawings && kindsRead.size >= FLOORS.kinds && plantTurned === true && nearMelted === true && plantWide === true && barLow > 0 && barHigh > 0,
  { missing: missing.slice(0, 6), unread: unread.slice(0, 4), short: short.map((r) => `${r.name} ${r.share.toFixed(3)} (${r.where})`).slice(0, 12), counts: [rows.length, kindsRead.size], plantTurned, nearMelted, plantWide, barLow, barHigh });
ok(`the paper is read from the page, not typed into the test (${[...papers].join(', ')}; every paper turned the dark theme's card color, ${PLANT_PAPER}, in the page, read as that color, and the digital clock caught on it)`, papers.size === 1 && [...papers].every((x) => /^#[0-9A-F]{6}$/.test(x)) && plantPaper === PLANT_PAPER && plantDark === true, { papers: [...papers], plantPaper, plantDark });
ok(`every kind of picture a lesson's line or a question shows is read as a drawing or a diagram or left out by name (${KINDS.length} kinds read as drawings and ${DIAGRAM_KINDS.length} as diagrams since pass NF; writing, a pair and a row left out; a pair planted with a half of a kind no list names, caught)`, unplaced.size === 0 && plantKind === true, { unplaced: [...unplaced].slice(0, 6) });
ok(`every diagram, chart, map and number line a lesson's line or a question puts on the dark theme's paper reads at its edge as a drawing does, its guides aside, 3 to 1 or better on ${Math.round(BAR * 100)} percent of it against the paper (${dRows.length} diagrams of ${dKinds.size} kinds) (pass NF, EARMARKS A98; the day-and-night picture's deeper gold turned back to the light palette's gold, planted, caught at ${typeof plantSun === 'number' ? plantSun.toFixed(3) : plantSun})`,
  dShort.length === 0 && dRows.length >= FLOORS.diagrams && dKinds.size >= FLOORS.diagramKinds && caught(plantSun),
  { shortKinds: byKind(dShort), short: dShort.map((r) => `${r.name.slice(0, 80)} ${r.share.toFixed(3)} (${r.where})`).slice(0, 8), counts: [dRows.length, dKinds.size], plantSun });
ok(`every guide a diagram marks is a guide: a bare line no wider than ${GUIDE_WIDEST} unit, in a kind GUIDED names (${GUIDED.join(', ')}), hidden for the shot since it is drawn faint on purpose (${guidesRead} guides; pass NF; the first bar graph read with its guides shown fell short at ${typeof guidesShown === 'number' ? guidesShown.toFixed(3) : guidesShown}, so the guides are what the rule leaves out; a bar marked a guide, planted, caught; a guide line 1.2 units wide, planted, caught)`,
  badGuides.length === 0 && guidesRead >= FLOORS.guides && caught(guidesShown) && plantGuideBar === 1 && plantGuideWide === 1,
  { badGuides: badGuides.slice(0, 6), guidesRead, guidesShown, plantGuideBar, plantGuideWide });
ok(`every drawing in More Info's paper boxes reads at its edge, 3 to 1 or better on ${Math.round(BAR * 100)} percent of it against the box, whose color is the lesson's paper's, read from the page (${bRows.length} drawings in ${sheets} sheets, every kind a box draws read or left out by name) (pass NF, EARMARKS A98; a box's dots with their rim taken away, as before pass NF, planted, caught at ${typeof plantRim === 'number' ? plantRim.toFixed(3) : plantRim})`,
  boxMissing.length === 0 && bShort.length === 0 && boxUnplaced.size === 0 && bRows.length >= FLOORS.boxes && sheets >= FLOORS.sheets && boxColors.size === 1 && [...boxColors][0] === [...papers][0] && caught(plantRim),
  { missing: boxMissing.slice(0, 6), short: bShort.map(([k, r]) => `${k} ${r.share.toFixed(3)} (${r.where})`).slice(0, 16), unplaced: [...boxUnplaced], counts: [bRows.length, sheets], boxColors: [...boxColors], plantRim });
ok(`a clock, a ten-frame and a fraction bar on the dark theme's paper draw in the light palette, wearing no color of the dark theme's own (${paletteRead} read; ${DARK_OWN.length} colors THEMES names for the dark theme alone, read from src/ui.jsx) (pass NF, EARMARKS A98; a clock's face filled with the dark theme's surface, ${DARK_SURFACE}, as it drew before pass NF, planted, caught)`,
  darkOwn.length === 0 && paletteRead >= FLOORS.palette && DARK_OWN.length >= 20 && typeof plantPalette === 'number' && plantPalette >= 1,
  { darkOwn: darkOwn.slice(0, 6), paletteRead, plantPalette });
ok('no page errors along the way', errors.length === 0, errors);
console.log(`\n${passed} passed, ${failed} failed`);
process.exitCode = failed ? 1 : 0;   // never process.exit(): it can drop the last lines of a piped stdout (2026-09-23)
