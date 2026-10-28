// The Wise Human. Copyright (c) 2026. Source-available; not for reuse. See LICENSE.md.
// Words inside pictures stay readable (pass MR, the light-theme pass, from Mikey's answer to Q72: "I never want this to happen
// anywhere in the app and try to correct every example I find."). In plain terms: many pictures are drawn diagrams with words in
// them (axis numbers, a cell's parts, a timeline's years, a caption under a grid). This reads every one of them, the question
// pictures in the real app on a phone, every lesson picture drawn the way the app draws it, and (since round two of pass MR)
// every different question picture over 300 seeds drawn the same way, in the light theme and the dark, for four faults:
//   - a word past the picture's edge, which is cut off;
//   - two words on top of each other, which cannot be read;
//   - a drawn line running through a word (only the line drawn on top counts, so a word in a box that covers a line is fine,
//     and a word with a white outline, the way a map writes over a coastline, is meant to sit on lines);
//   - a word too faint against what is under it (less than 3 to 1, the large-text floor), such as white words that ran off
//     their sign onto the white page, or the dark theme's cream ink on a light picture.
// Every word is read a twelfth wider than this machine draws it, grown away from where it is anchored, since a phone's font runs
// wider than the test machine's. Proven on the copy before pass MR, where it failed the coordinate grid's x-axis numbers (drawn at
// 104 of the picture's 100 units, so no reader ever saw them), the percent grid's caption, the beaker's line, nineteen lesson
// pictures with words past the edge or piled up (the timelines' last years, the bars' fifth bar, "heat" in a reaction, a map's
// "Plymouth, 1620"), ten with a line through a word ("equilibrium" on the supply line, "sin" on the circle), the triangles'
// "height 2" crossed by a slanted side, a number line's "-10-9-8", the dictionary sign whose white words ran off it, and the
// periodic table's symbols, cream on pastel in the dark theme; the planted cases below prove it fails each fault.
// Run with tsx (check.sh does), since the lesson pictures are drawn from the built app's own components.
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const L = await import('../../src/logic.mjs');
let passed = 0, failed = 0; const ok = (name, cond, info) => { if (cond) { passed++; console.log('PASS - ' + name); } else { failed++; console.log('FAIL - ' + name + (info ? '  ' + JSON.stringify(info) : '')); } };
const pageUrl = new URL('./page.html', import.meta.url).href;
const WIDER = 1 / 12;   // how much wider a phone may draw a word than this machine does
const FAINT = 3;        // the least contrast a word in a picture may have against what is under it

// The read, run inside a page over every picture the selector finds. It returns one line per fault, named by the picture's
// data-pic (a lesson picture) or its label (a question picture).
function readPictures([sel, wider, faintest]) {
  const res = [];
  const rgb = (c) => { const m = /rgba?\(([\d.]+), ([\d.]+), ([\d.]+)(?:, ([\d.]+))?\)/.exec(c || ''); return m ? [Number(m[1]) / 255, Number(m[2]) / 255, Number(m[3]) / 255, m[4] === undefined ? 1 : Number(m[4])] : null; };
  const lum = (c) => { const f = (v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4); return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)]; return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  // A line counts only if it is drawn plainly: a pale or see-through one (a grid) may pass under words.
  const plain = (s) => { const cs = getComputedStyle(s); if (cs.stroke === 'none' || parseFloat(cs.strokeWidth) === 0 || Number(cs.strokeOpacity) < 0.35 || Number(cs.opacity) < 0.35) return false; const c = rgb(cs.stroke); return !!c && c[3] >= 0.35 && 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2] <= 0.8; };
  // What a point of a word sits on: the topmost filled shape there, or else the page behind the picture.
  const behind = (svg) => { let n = svg; while (n && n !== document.documentElement) { const c = rgb(getComputedStyle(n).backgroundColor); if (c && c[3] > 0.5) return c; n = n.parentElement; } return [1, 1, 1, 1]; };
  const under = (els, svg) => { for (const el of els) { if (el === svg || !svg.contains(el) || ['text', 'tspan', 'line', 'polyline'].includes(el.tagName)) continue; const cs = getComputedStyle(el); if (cs.fill === 'none' || Number(cs.fillOpacity) < 0.5 || Number(cs.opacity) < 0.5) continue; const c = rgb(cs.fill); if (c && c[3] >= 0.5) return c; } return behind(svg); };
  for (const svg of document.querySelectorAll(sel)) {
    if (svg.getBoundingClientRect().width < 120) continue;
    svg.scrollIntoView({ block: 'center' });
    const sb = svg.getBoundingClientRect(); const holder = svg.closest('[data-pic]'); const name = holder ? holder.dataset.pic : (svg.getAttribute('aria-label') || 'a picture');
    const texts = [...svg.querySelectorAll('text')].filter((t) => t.textContent.trim()).map((t) => { const b = t.getBoundingClientRect(); const grow = b.width * wider; const anchor = getComputedStyle(t).textAnchor;
      return { el: t, t: t.textContent, b, l: b.left - (anchor === 'start' ? 0 : anchor === 'end' ? grow : grow / 2), r: b.right + (anchor === 'start' ? grow : anchor === 'end' ? 0 : grow / 2) }; }).filter((x) => x.b.width > 0);
    for (const x of texts) if (x.l < sb.left - 0.5 || x.r > sb.right + 0.5 || x.b.top < sb.top - 0.5 || x.b.bottom > sb.bottom + 0.5) res.push(`${name}: past the edge: "${x.t}"`);
    for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++) { const a = texts[i], b = texts[j]; if (Math.min(a.r, b.r) - Math.max(a.l, b.l) > 1 && Math.min(a.b.bottom, b.b.bottom) - Math.max(a.b.top, b.b.top) > 1) res.push(`${name}: over each other: "${a.t}" and "${b.t}"`); }
    // Lines and contrast: points across each word's middle, where its letters are, are hit-tested against the shapes alone.
    const shapes = [...svg.querySelectorAll('line, path, polyline, polygon, circle, ellipse, rect')];
    const keep = new Map([[svg, svg.style.pointerEvents], ...shapes.map((s) => [s, s.style.pointerEvents]), ...texts.map((x) => [x.el, x.el.style.pointerEvents])]);
    svg.style.pointerEvents = 'none'; for (const s of shapes) s.style.pointerEvents = 'visiblePainted'; for (const x of texts) x.el.style.pointerEvents = 'none';
    for (const x of texts) {
      const outlined = (x.el.getAttribute('stroke') || '').toUpperCase() === '#FFFFFF';   // outlined in white: written to sit on lines
      const ink = rgb(getComputedStyle(x.el).fill); let line = false; let least = 99;
      for (let yi = 0; yi < 4; yi++) for (let xi = 0; xi < 12; xi++) {
        const px = x.b.left + x.b.width * (0.06 + 0.08 * xi); const py = x.b.top + x.b.height * (0.3 + 0.15 * yi);
        const els = document.elementsFromPoint(px, py);
        if (ink) least = Math.min(least, ratio(ink, under(els, svg)));
        const top = els.find((el) => el !== svg && svg.contains(el) && el.tagName !== 'text' && el.tagName !== 'tspan');
        if (!outlined && !line && top && plain(top) && typeof top.isPointInStroke === 'function' && top.getScreenCTM()) { const p = new DOMPoint(px, py).matrixTransform(top.getScreenCTM().inverse()); if (top.isPointInStroke(p)) line = true; }
      }
      if (line) res.push(`${name}: a line through "${x.t}"`);
      if (!outlined && least < faintest) res.push(`${name}: too faint (${least.toFixed(1)} to 1): "${x.t}"`);
    }
    for (const [el, v] of keep) el.style.pointerEvents = v;
  }
  return res;
}
const read = (page, sel) => page.evaluate(readPictures, [sel, WIDER, FAINT]);

const browser = await chromium.launch();

// 1. Every question bank whose picture is a diagram, in the real app on a phone, in each theme.
const NOT_DIAGRAMS = new Set(['icon', 'pic', 'art', 'shape', 'item', 'swatch', 'dots', 'pattern', 'row', 'pair', 'face', 'letters', 'trace', 'tenframe', 'solid']);
const banks = [];
for (const id of Object.keys(L.GENERATORS)) { let q; try { q = L.generateQuestion(id, 1); } catch (e) { continue; } const v = q.visual; if (v && v.kind && !NOT_DIAGRAMS.has(v.kind)) banks.push(id); }
const openApp = async (theme) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  await context.addInitScript((t) => { try { localStorage.setItem('edusphere_v1_theme', t); } catch (e) {} }, theme);
  const page = await context.newPage();
  await page.goto(pageUrl);
  await page.waitForFunction(() => window.__eduTest && window.__eduTest.screen === 'welcome');
  await page.getByRole('button', { name: 'Educator Login' }).click(); await page.waitForTimeout(300);
  await page.fill('input[placeholder="PIN"]', '2468'); await page.fill('input[placeholder="PIN again"]', '2468');
  await page.fill('input[placeholder="This device\'s name"]', 'Words'); await page.selectOption('select[aria-label="Your state"]', 'TX');
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await page.waitForFunction(() => window.__eduTest.screen === 'educator-pick'); await page.waitForTimeout(700);
  for (const name of ['Skip tour', 'Later', 'Got it', 'Close']) { const b = page.getByRole('button', { name, exact: true }); if (await b.count()) { await b.first().click({ force: true }); await page.waitForTimeout(200); } }
  await page.getByRole('button', { name: 'Walk through high school and beyond' }).first().click({ force: true }).catch(() => {});
  await page.waitForFunction(() => window.__eduTest.screen === 'overview', null, { timeout: 15000 }).catch(() => {});
  return { context, page };
};
for (const theme of ['light', 'dark']) {
  const { context, page } = await openApp(theme);
  const bad = []; let shown = 0;
  for (const id of banks) {
    const opened = await page.evaluate((g) => window.__eduTest.showQuestion(g, 1), id); if (opened === false) continue;
    await page.waitForTimeout(250); shown += 1;
    for (const p of await read(page, 'svg[role="img"]')) bad.push(`${id}: ${p}`);
  }
  ok(`every word in a question's diagram, in the ${theme} theme, is inside its picture, clear of the other words and of the lines, and plain to see (${shown} banks read)`, shown >= 100 && bad.length === 0, bad.slice(0, 8));
  if (theme === 'light') {
    // The planted faults: a word moved past the picture's edge, and one laid over another, each in a picture on the screen.
    await page.evaluate(() => window.__eduTest.showQuestion('m5-read-point', 1)); await page.waitForTimeout(300);
    await page.evaluate(() => { const svg = document.querySelector('svg[role="img"]'); const t = svg.querySelector('text'); t.setAttribute('y', '108'); });
    const edge = await read(page, 'svg[role="img"]');
    await page.evaluate(() => window.__eduTest.showQuestion('m5-read-point', 2)); await page.waitForTimeout(300);
    await page.evaluate(() => { const svg = document.querySelector('svg[role="img"]'); const [a, b] = svg.querySelectorAll('text'); b.setAttribute('x', a.getAttribute('x')); b.setAttribute('y', a.getAttribute('y')); });
    const over = await read(page, 'svg[role="img"]');
    ok('the read fails a word moved past the edge and two words laid over each other', edge.some((x) => x.includes('past the edge')) && over.some((x) => x.includes('over each other')), { edge, over });
  }
  await context.close();
}

// 2. Every lesson picture that is a diagram (examples, other ways, script lines, stories), drawn by the built app's own
// components in each theme's colors on that theme's paper: a copy of the built file names them for this test (with the question
// banks, for section 3), and each is drawn once per different set of settings.
const outDir = new URL('./out/', import.meta.url);
mkdirSync(outDir, { recursive: true });
const copy = new URL('./diagram-pictures.jsx', outDir);
writeFileSync(copy, readFileSync(new URL('../../dist/edusphere-prototype.jsx', import.meta.url), 'utf8') + '\nexport { DIAGRAMS, PictureInner, COURSES, STORIES, C, THEMES, generateQuestion, GENERATORS };\n');
const U = await import(copy.href);
// A picture section 1 would count as a diagram, or a pair with such a half; a diagram is drawn by its own component, any other
// kind by PictureInner, the function that draws every picture in the app (round three of pass MR: sections 2 and 3 had read the
// kinds in DIAGRAMS alone, so a number line's, a triangle's, a clock's and the periodic table's words were read at seed 1 only,
// and a lesson's not at all).
const readable = (v) => !!v && !Array.isArray(v) && typeof v.kind === 'string' && (v.kind === 'pair' ? [v.a, v.b].some((h) => h && typeof h.kind === 'string' && !NOT_DIAGRAMS.has(h.kind)) : !NOT_DIAGRAMS.has(v.kind));
const drawOne = (v) => (U.DIAGRAMS[v.kind] ? React.createElement(U.DIAGRAMS[v.kind], v) : React.createElement(U.PictureInner, { visual: v }));
const found = []; const seen = new Set();
const walk = (o, where, depth = 0) => { if (!o || typeof o !== 'object' || depth > 12) return; if (Array.isArray(o)) { o.forEach((x) => walk(x, where, depth + 1)); return; }
  if (readable(o)) { const key = JSON.stringify(o); if (!seen.has(key)) { seen.add(key); found.push({ where, props: o }); } }
  for (const v of Object.values(o)) if (v && typeof v === 'object') walk(v, where, depth + 1); };
for (const c of U.COURSES) for (const m of c.modules || []) walk(m.lesson, m.id);
walk(U.STORIES, 'stories');
const lessonPage = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
for (const theme of ['light', 'dark']) {
  Object.assign(U.C, U.THEMES[theme]);   // the live palette, the way the theme switch sets it
  const cells = found.map((f, i) => `<div class="cell" data-pic="${f.where} (${f.props.kind} ${i})">${renderToStaticMarkup(drawOne(f.props))}</div>`).join('');
  await lessonPage.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>body { margin: 0; padding: 12px 16px; background: ${U.THEMES[theme].paperBoard}; } .cell { width: 358px; margin: 0 0 12px; }</style></head><body>${cells}</body></html>`);
  const lessonBad = await read(lessonPage, '.cell svg');
  ok(`every word in a lesson's diagram, in the ${theme} theme, is inside its picture, clear of the other words and of the lines, and plain to see (${found.length} pictures of ${new Set(found.map((f) => f.props.kind)).size} kinds read)`, found.length >= 500 && lessonBad.length === 0, lessonBad.slice(0, 8));
}
Object.assign(U.C, U.THEMES.light);
// The planted faults, on the dark theme's page: a cell's name moved onto the cell's wall, and a sign whose white words outgrow it.
const plant = async (kind, needs, change) => { await lessonPage.evaluate(([k, nd, ch]) => { const cell = [...document.querySelectorAll('.cell')].find((c) => c.dataset.pic.includes(`(${k} `) && c.querySelector(nd)); cell.dataset.planted = '1'; new Function('svg', ch)(cell.querySelector('svg')); }, [kind, needs, change]); const r = await read(lessonPage, '[data-planted] svg'); await lessonPage.evaluate(() => { for (const c of document.querySelectorAll('[data-planted]')) delete c.dataset.planted; }); return r; };
const onLine = await plant('cell', 'svg text', "const t = [...svg.querySelectorAll('text')].find((x) => x.textContent === 'wall'); t.setAttribute('x', '43'); t.setAttribute('text-anchor', 'middle');");
const offSign = await plant('sign', 'svg rect', "const r = svg.querySelector('rect'); r.setAttribute('x', '70'); r.setAttribute('width', '20');");
const pale = await plant('cell', 'svg text', "for (const t of svg.querySelectorAll('text')) t.setAttribute('fill', '#F1EDE4');");
ok('the read fails a word moved onto a line, white words run off their sign, and cream words on light paper', onLine.some((x) => x.includes('a line through "wall"')) && offSign.some((x) => x.includes('too faint')) && pale.some((x) => x.includes('too faint')), { onLine, offSign, pale });

// 3. Every different question picture over 300 seeds (round two of pass MR, the code check: section 1 reads each bank's picture
// at seed 1 alone, so the triangle bank's other 292 triangles were never read, nor the pictures More Info shows again or an
// explanation's). Every bank is dealt seeds 1 to 300, as the independent test deals them, and every different picture its
// questions show (the question's own, which More Info shows again, and its explanation's) that section 1 counts as a diagram is
// drawn by the built app's own components on each theme's card, inside the paper the dark theme lays under a picture (Picture
// in ui.jsx), and read as section 2 reads the lesson pictures. Since round three, that is every kind outside NOT_DIAGRAMS, not
// only the kinds in DIAGRAMS: number lines, pictographs, bar models, a triangle's and a parallelogram's measures, arrays, clocks,
// the periodic table and tens are drawn by PictureInner, as the app draws them, and so is a pair with such a half (the test-tools
// helper's note: until then they were read at seed 1 alone, in section 1). Every different picture is read, with no cap. They go 40 to a
// page, since the read slows as a page grows (800 to a page took twice as long as 300, and 40 is quicker still), and each
// page is drawn here while the browser reads the one before; the whole file then takes about three and a half minutes here.
// Proven on round two's build of 02:51, where it failed g10-triangle-angle (129 triangles, 131 in the dark theme, ran past
// the picture with their "?"), g10-supplementary (11 angles of about 150 degrees or more, the "?" crossed by the second line)
// and s11-angle-out (18 rays under about 38 degrees, their "in" and "out" crossed by the rays).
const dealt = new Map(); const dealtSeen = new Set();   // each bank's different pictures, in the order its seeds deal them
for (const id of Object.keys(U.GENERATORS)) for (let seed = 1; seed <= 300; seed++) {
  let q; try { q = U.generateQuestion(id, seed); } catch (e) { continue; }
  for (const [v, whose] of [[q.visual, ''], [q.explainVisual, ', its explanation']]) {
    if (!readable(v)) continue;
    const key = JSON.stringify(v); if (dealtSeen.has(key)) continue; dealtSeen.add(key);
    if (!dealt.has(id)) dealt.set(id, []);
    dealt.get(id).push({ where: `${id} seed ${seed}${whose}`, props: v });
  }
}
const qPictures = [...dealt.values()].flat(); const PAGE = 40;
for (const theme of ['light', 'dark']) {
  Object.assign(U.C, U.THEMES[theme]); const T = U.THEMES[theme];
  // The dark theme's paper under a picture, as Picture lays it (paperBoard, rounded, 4 by 10 pixels in, the light palette's
  // ink); the light theme draws a picture straight on the card.
  const paper = theme === 'dark' ? `background: ${T.paperBoard}; border-radius: 12px; padding: 4px 10px; color: ${U.THEMES.light.ink};` : '';
  const draw = (list) => list.map((f) => `<div class="cell" data-pic="${f.where} (${f.props.kind})"><div style="${paper}">${renderToStaticMarkup(drawOne(f.props))}</div></div>`).join('');
  const bad = []; let wide = 0; const wordySmall = []; let cells = draw(qPictures.slice(0, PAGE));
  for (let i = 0; i < qPictures.length; i += PAGE) {
    await lessonPage.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>body { margin: 0; padding: 12px 16px; background: ${T.surface}; } .cell { width: 358px; margin: 0 0 12px; }</style></head><body>${cells}</body></html>`);
    // The read passes over a picture under 120 pixels wide as an icon (the dice, a pencil and its clips), so each picture is
    // counted as read or as small, and a small one that holds words fails, since its words would never be read.
    const sized = await lessonPage.evaluate(() => { const r = { wide: 0, wordy: [] }; for (const c of document.querySelectorAll('.cell')) { if ([...c.querySelectorAll('svg')].some((s) => s.getBoundingClientRect().width >= 120)) r.wide += 1; else if ([...c.querySelectorAll('text')].some((t) => t.textContent.trim())) r.wordy.push(c.dataset.pic); } return r; });
    wide += sized.wide; wordySmall.push(...sized.wordy);
    const reading = read(lessonPage, '.cell svg');
    await new Promise((r) => setTimeout(r, 25));   // the read reaches the browser before the next page is drawn here
    cells = draw(qPictures.slice(i + PAGE, i + 2 * PAGE));
    bad.push(...await reading);
  }
  // A fault is named by its bank and seed; the first of each bank's is shown, with how many that bank has.
  const byBank = {}; for (const b of bad) { const id = b.split(' ')[0]; if (!byBank[id]) byBank[id] = { faults: 0, first: b }; byBank[id].faults += 1; }
  ok(`every word in every different question picture over 300 seeds (the question's own, which More Info shows again, and its explanation's), in the ${theme} theme, is inside its picture, clear of the other words and of the lines, and plain to see (${wide} pictures of ${dealt.size} banks read, ${qPictures.length - wide} more drawn as small icons)`,
    wide >= 3000 && dealt.size >= 35 && wordySmall.length === 0 && bad.length === 0, { drawn: qPictures.length, read: wide, smallWithWords: wordySmall.slice(0, 8), faults: byBank });
}
Object.assign(U.C, U.THEMES.light);

// 4. No question's picture shows its own answer (round three of pass MR, the alignment read: the light ray's question, "At what angle
// does it bounce off?", printed "54° out" on its picture beside choices of 54, 36 and 108 degrees, as the grid had printed the point
// a question asked for before this pass hid it). Every bank is dealt seeds 1 to 300, and where the answer is a number, the words of
// the question's own picture are read (drawn to markup here, no browser): the picture may not hold that number more often than the
// question's own words do (so a triangle whose base equals its height, both given, passes). The banks whose picture is a scale or the
// data the child reads the answer from are named below with the reason, each for the case it covers only; a light ray planted with
// its answer shown must fail.
const READ_FROM_PICTURE = {
  'g1-between': ['a number line whose numbers the child reads'], 'g6-opposite': ['a number line whose numbers the child reads'],
  'ol1-farther-right': ['a number line whose numbers and points the child reads'], 'ol1-count-on': ['a number line the child counts along'],
  'ol1-greater-of-two': ['a number line whose points the child compares'], 'g6-temperature': ['a thermometer whose scale the child reads'],
  'dg1-read-bar': ['a bar graph whose axis the child reads'], 'dg1-bar-more': ['a bar graph whose axis the child reads'], 'dg1-bar-total': ['a bar graph whose axis the child reads'],
  'g7-what-percent': ['the two counts the percent is worked out from, when both are 50 of 100', (q) => q.visual.a === q.visual.b],
  'g7-percent-of': ['the grid\'s own hundred, when the answer is 100 (25% of 400)', (q) => q.answer === '100'],
};
const answerNumber = (a) => { const m = /^\s*(-?\d+(?:\.\d+)?)\s*(?:degrees|°|%|percent)?\s*$/.exec(String(a)); return m ? m[1] : null; };
// A number counts where it stands whole: not inside a longer number, a decimal or a negative one, though a sentence's full stop may follow.
const timesIn = (text, n) => (text.match(new RegExp(`(^|[^\\d.\\-])${n.replace(/[.-]/g, '\\$&')}(?!\\d|\\.\\d)`, 'g')) || []).length;
const pictureWords = (v) => [...renderToStaticMarkup(drawOne(v)).matchAll(/<text[^>]*>([\s\S]*?)<\/text>/g)].map((m) => m[1].replace(/<[^>]+>/g, '')).join(' | ');
const showsAnswer = (q, v) => { const n = answerNumber(q.answer); if (n === null || !v || Array.isArray(v) || typeof v.kind !== 'string') return null;
  const words = pictureWords(v); if (!words) return null;
  return timesIn(words, n) > timesIn(`${q.story || ''} ${q.prompt || ''}`, n) ? `"${q.prompt}" (answer ${q.answer}): its picture says ${words.slice(0, 90)}` : null; };
const shown = {}; let readQs = 0;
for (const id of Object.keys(U.GENERATORS)) for (let seed = 1; seed <= 300; seed++) {
  let q; try { q = U.generateQuestion(id, seed); } catch (e) { continue; }
  if (!answerNumber(q.answer) || !q.visual || Array.isArray(q.visual)) continue;
  let why; try { why = showsAnswer(q, q.visual); } catch (e) { continue; } readQs += 1;
  const pass = READ_FROM_PICTURE[id]; if (!why || (pass && (!pass[1] || pass[1](q)))) continue;
  if (!shown[id]) shown[id] = { questions: 0, first: `seed ${seed}: ${why}` }; shown[id].questions += 1;
}
const plantQ = U.generateQuestion('s11-angle-out', 1);
const planted = showsAnswer(plantQ, { ...plantQ.visual, out: true });
ok(`no question's picture shows its own answer, over 300 seeds of every bank (${readQs} questions with a number for an answer read, ${Object.keys(READ_FROM_PICTURE).length} banks named as read from their picture), and a light ray planted with its angle out shown fails`,
  readQs >= 20000 && Object.keys(shown).length === 0 && !!planted && plantQ.visual.out === false, { shown, planted });

await browser.close();
console.log(`\n${passed} passed, ${failed} failed`);
process.exitCode = failed ? 1 : 0;   // never process.exit(): it can drop the last lines of a piped stdout (CLAUDE.md, 2026-09-23)
