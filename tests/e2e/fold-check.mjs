// The Wise Human. Copyright (c) 2026. Source-available; not for reuse. See LICENSE.md.
// Every pre-K lesson line and question fits a short phone (pass MY, round one's screen check). Two words make one's last line put its
// Start practice star 22 pixels under a 375 by 667 phone's fold, with no scroll cue, and Check answer sat under the fold on every seed
// of two new banks, and no browser test read either: question-screens names its banks by hand, and the screen brief measured only
// what a pass changed. In plain terms: on a 375 by 667 phone, in the light theme and then the dark one, with the test page's voice
// on, every line of every read-aloud pre-K lesson is shown, and its Next button (the Start practice star on the last line) must end
// above the fold; and every pre-K bank is shown, and Check answer must end above the fold (DESIGN: "Check answer
// never drops below the fold on a short phone."). Both themes, since neither is always the taller: the light theme's words sit a few
// pixels lower on some lines, and the dark theme's paper pads a picture four pixels each way, so 13 lines and banks sat under the
// fold in the dark theme alone (round two's code read, pass MY). A line or a bank that sat under the fold before this check waited by
// name in FOLD_WAITS with the lower of its two bottoms, so it failed if it moved lower, and a new one is held to the fold; a wait that
// names nothing the check reads, or a line now above the fold in both themes, fails too, so a fixed line drops its wait. Since pass MZ
// (EARMARKS A80) none waits: all 107 ended above the fold in both themes, so the list is empty, and a line under the fold fails. A planted
// line and a planted question in each theme, each the first that ends within 120 pixels above the fold and is pushed 120 pixels down,
// so it crosses the fold, are caught (a push from higher up stays above the fold and proves nothing: the first bank ends at 480).
// Since pass MZ's round one (the code and screen checks) it reads three things more, each with its plant:
// - every bank at seeds 1 to 6, not seed 1 alone, and as a child sees it: a learner the educator adds, not the walk-through, which
//   marks a picture still waiting for its painting with a note under the question's picture (30 pixels) and inside each picture
//   answer (22 to 28 pixels), notes a child never sees. In the walk-through's dark theme pm-same-things' and pm-different-things'
//   fifth seeds ended Check answer at 684 and 677; for a child they end above the fold. An educator previewing may scroll a little.
// - each line's row holding together: Back, the speaker and Next with level tops, the lesson's dots centred under the speaker, and no
//   dot alone on a row, at 375 by 667 and at 320 by 568.
// - each line again at 320 by 568, the smallest phone the app is drawn for, where the scroll cue must show exactly when more than a
//   third of Next is below the screen, so it never sits on a Next two thirds of which show (round one: measured on the whole row, the
//   speaker and its dots included, it sat on a Next wholly shown on 10 lines) and never leaves a child without it.
// Since round two (the code check): its floors are the counts the code has (FLOORS), where guesses had let a lost lesson pass; a line
// whose own dot is not lit fails, so a walk that fell behind could never measure one line under another's name; the walk-through's
// notes are seen before a child's are counted, so a count that could see none fails; and every line with a painting is read again with
// a stand-in painting in place (the last part), since the test page has none and the painting's cap and corners went unread.
// Run: node tests/e2e/make-page.mjs && node tests/e2e/fold-check.mjs
import { createRequire } from 'node:module'; import { execSync } from 'node:child_process';
const G = execSync('npm root -g').toString().trim(); const { chromium } = createRequire(import.meta.url)(`${G}/playwright`);
const L = await import('../../src/logic.mjs');
const VH = 667;
// The smallest phone the cue is read on (pass MZ): 320 by 568, the first iPhone SE's screen.
const SMALL = { width: 320, height: 568 };
// How many seeds of each bank a child's view is read at (pass MZ, round one's code check: seed 1 alone missed two).
const SEEDS = 6;
// What this check reads, as floors at the counts the code has (round two's code check, pass MZ: floors of 800 lines and 300 banks were
// guesses): since pass ND 1074 lines of 102 lessons, each read at two sizes; 427 banks at six seeds each; the lines whose Next is more than a
// third below a 320 by 568 screen, where the cue shows (39 in the light theme, 39 in the dark: round two's content read moved it off Letters and sounds'
// line 5 and onto its line 8 and Hear it in the name's line 8); 112 lines that show a painting; the speech parts
// kept whole on a line at both sizes (192); and the sentences lit in turn at both sizes (4968) (pass ND's five lessons, Letters and sounds,
// Hear it in the name, At the end of the name, Space between words and Spaces between words, fourteen lines each, with twenty-five banks;
// round two's code read found the floors still pass NC's, under which those lessons and banks could have dropped out of the read unnoticed;
// pass NC's floors were 1004 lines of 97 lessons, 402 banks, a cue on 35 and 35 lines, 111 lines with a painting and 4624 sentences lit, from
// pass NC's five lessons, since round one Sounds in a
// word's fourteen lines and The very first sound's fourteen, Sound by sound's thirteen, Draw and tell's thirteen and Write to tell's fourteen, with
// twenty-five banks; pass NB's floors were 936 lines, 377 banks, a cue on 35 and 34 lines and 106 lines with a painting; before them, pass
// NA's 895 lines of 89 lessons, 362 banks and 103 lines with a painting, from pass NA's three lessons, Sun and sock's fourteen lines since round one and the other two's thirteen, fifteen banks and a painting each, with
// Clap the beats two lines shorter, and since round two Two words make one two lines longer, its two turns each ending a line, the cue
// still on none of its lines at 320 by 568; pass MZ's floors were 855 lines of 86 lessons, 347 banks, a cue on 35 and 33 lines and 100 lines with
// a painting). A lesson or a bank
// added raises a count, and its floor follows in the same pass; a layout that moves a Next changes the cue's count, and its floor follows
// that too, once the cue's own rule has passed on every line.
const FLOORS = { lines: 1074, banks: 427, cue: { light: 39, dark: 39 }, paintings: 112, whole: 192, lit: 4968 };
// EARMARKS A82 decided (pass NC, round one's screen check): at 320 by 568 no pre-K lesson line ends on one lone word (25 of the 69 lines
// past six lines did, where a browser balances nothing), a line past six lines wrapping pretty (LessonWords in ui.jsx). A line that
// must end alone is named here by lesson and line with the reason; a wait for a line that no longer ends alone fails.
const LONE_WAITS = {
  'helpers-all-around line 1': 'Mikey\'s say-along ends the line on its word said alone ("One last time, nice and clear. Firefighter."), a sentence of one word that stands alone wherever it falls',
  'say-it-to-fit line 11': 'pretty leaves "happened." alone at 320; the line is older than pass NC, and its rewording waits for the next screen read (EARMARKS A82)',
  'opposites-and-same line 8': 'pretty leaves "eyes." alone at 320; the line is older than pass NC, and its rewording waits for the next screen read (EARMARKS A82)',
};
// The lines and banks that sat under the fold when this check was written (pass MY: 86 lines of 40 lessons and 21 banks, in either
// theme, none of pass MX's or MY's lessons, 107 waits in all), each by lesson and line (counted from 1) or by bank with the lower of its
// two bottoms, waited here for its lesson's next screen read (EARMARKS A80). Pass MZ fixed them all, so none waits: the speaker moved
// into the row of Back and Next, with the lesson's dots under it (about 80 pixels on every line); a short phone (under 720 pixels tall
// and 700 wide) draws a lesson's card, its words and a question's card a little tighter, a one-picture answer beside a picture or among
// three or more at 0.82 of its size, a painting at most 180 pixels tall and the drawing of a letter tracing itself 196 pixels square;
// and Same and opposite's line about angry, afraid and glad, 956 pixels before, is two lines. The 107 keys stand in pass MY's copy of
// this file; a line that must wait again is named here with its bottom and the reason in a comment beside it, and a question by its
// bank and seed ('p3-near-tap seed 4').
export const FOLD_WAITS = {};
let passed = 0, failed = 0; const ok = (name, cond, info) => { if (cond) { passed++; console.log('PASS - ' + name); } else { failed++; console.log('FAIL - ' + name + (info !== undefined ? '  ' + JSON.stringify(info).slice(0, 900) : '')); } };
const over = (key, bottom) => bottom !== null && bottom > VH && !(FOLD_WAITS[key] !== undefined && bottom <= FOLD_WAITS[key] + 2);
// Every line and bank this check reads, with its bottom in each theme, so a wait is held to what is still under the fold.
const seen = new Map(); const note = (theme, key, bottom) => { if (!seen.has(key)) seen.set(key, {}); seen.get(key)[theme] = bottom; };
const early = L.COURSES.filter((c) => (c.grade === 'PK3' || c.grade === 'PK4') && c.readAloud);
const lessons = early.flatMap((c) => c.modules).filter((m) => m.lesson && Array.isArray(m.lesson.script) && m.lesson.script.length);
const banks = [...new Set(early.flatMap((c) => c.modules.flatMap((m) => m.generators)))];
// The cue's rule, read from what the page shows (pass MZ): wrong when it shows while a third of Next or less is below the screen, or
// is missing while more is; 1.5 pixels either way of the third is left to rounding.
const cueWrong = (c) => !!c && ((c.cue && c.bottom - c.H <= c.height / 3 - 1.5) || (!c.cue && c.bottom - c.H > c.height / 3 + 1.5));
const browser = await chromium.launch();
for (const theme of ['light', 'dark']) {
  const ctx = await browser.newContext({ viewport: { width: 375, height: VH }, hasTouch: true, reducedMotion: 'reduce' });
  await ctx.addInitScript((t) => { try { localStorage.setItem('edusphere_v1_theme', t); } catch (e) { /* no storage */ } }, theme);
  const page = await ctx.newPage();
  const errors = []; page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
  await page.goto(new URL('./page.html', import.meta.url).href);
  const screenIs = (n) => page.waitForFunction((x) => window.__eduTest && window.__eduTest.screen === x, n, { timeout: 15000 });
  const tapIf = async (name) => { const b = page.getByRole('button', { name, exact: true }); if (await b.count()) { await b.first().click({ force: true }); await page.waitForTimeout(250); return true; } return false; };
  await screenIs('welcome');
  await page.getByRole('button', { name: 'Create account', exact: true }).first().click(); await screenIs('educator-setup');
  await page.fill('input[placeholder="PIN"]', '2468'); await page.fill('input[placeholder="PIN again"]', '2468'); await page.fill('input[placeholder="This device\'s name"]', 'Fold'); await page.selectOption('select[aria-label="Your state"]', 'TX');
  await page.getByRole('button', { name: 'Create account', exact: true }).click(); await screenIs('educator-pick'); await page.waitForTimeout(500);
  for (const n of ['Skip tour', 'Later', 'Got it']) await tapIf(n);
  await page.getByLabel('Walk through early years').first().click({ force: true }); await screenIs('overview'); await page.waitForTimeout(400);
  // Which line shows: the dot the app marks lit (data-lit; the lesson's dots, one per line), read from the app since round two's code
  // check, where a color told apart from the rest named no line on a lesson of two.
  const stepOf = () => page.evaluate(() => [...document.querySelectorAll('[data-lesson-dots] span')].findIndex((s) => s.hasAttribute('data-lit')));
  // Where a control ends on the page, in pixels from its top (null when it is not there).
  const bottomOf = (sel) => page.evaluate((s) => { const b = document.querySelector(s); if (!b) return null; const r = b.getBoundingClientRect(); return Math.round(r.bottom + window.scrollY); }, sel);
  const NAV = '[data-lesson-nav] button[aria-label="Next"], [data-lesson-nav] button[aria-label="Start practice"]';
  // Check answer's bottom on the page, and how many stand-in notes the screen shows (a child's screen shows none).
  const CHECK = () => page.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Check answer'); if (!b) return null; const r = b.getBoundingClientRect(); return { bottom: Math.round(r.bottom + window.scrollY), notes: document.querySelectorAll('[data-replace-note]').length }; });
  // Waits until what was just asked for has been drawn: three frames (the app's state, then its drawing, then the cue's own check,
  // which runs on the frame after a resize), any picture still loading, and a little more.
  const drawn = () => page.evaluate(() => new Promise((res) => { const frame = () => new Promise((r) => requestAnimationFrame(() => r())); frame().then(frame).then(frame).then(() => Promise.all([...document.images].filter((i) => !i.complete).map((i) => new Promise((r) => { i.addEventListener('load', r, { once: true }); i.addEventListener('error', r, { once: true }); })))).then(() => setTimeout(res, 30)); }));
  // The row's faults (pass MZ): tops more than 1.5 pixels apart, a row of dots more than 1.5 pixels off the speaker's middle, or a
  // dot alone on a row of its own.
  const rowFaults = () => page.evaluate(() => {
    const nav = document.querySelector('[data-lesson-nav]'); if (!nav) return ['no row'];
    const back = nav.querySelector('button[aria-label="Go back"]'); const speaker = nav.querySelector('[data-lesson-middle] > :first-child'); const next = nav.querySelector('[data-lesson-next] button');
    const dots = [...nav.querySelectorAll('[data-lesson-dots] span')];
    if (!back || !speaker || !next || !dots.length) return ['a part of the row is missing'];
    const faults = []; const tops = [back, speaker, next].map((el) => el.getBoundingClientRect().top);
    if (Math.max(...tops) - Math.min(...tops) > 1.5) faults.push(`tops ${tops.map(Math.round).join('/')}`);
    const sr = speaker.getBoundingClientRect(); const middle = (sr.left + sr.right) / 2;
    const rows = new Map(); for (const d of dots) { const r = d.getBoundingClientRect(); const k = Math.round(r.top); if (!rows.has(k)) rows.set(k, []); rows.get(k).push(r); }
    for (const [k, rs] of rows) { const c = (Math.min(...rs.map((r) => r.left)) + Math.max(...rs.map((r) => r.right))) / 2; if (Math.abs(c - middle) > 1.5) faults.push(`the dots at ${k} centred at ${Math.round(c)}, the speaker at ${Math.round(middle)}`); }
    if (dots.length > 1 && [...rows.values()].some((rs) => rs.length === 1)) faults.push(`a dot alone on a row (${[...rows.values()].map((rs) => rs.length).join('+')})`);
    return faults;
  });
  // The cue as the page shows it at the size it is at: Next's bottom and height, the screen's height, and whether the cue shows.
  const readCue = async () => { await drawn(); return page.evaluate(() => { const nx = document.querySelector('[data-lesson-next]'); if (!nx) return null; const b = nx.getBoundingClientRect(); return { bottom: Math.round(b.bottom), height: Math.round(b.height), H: window.innerHeight, cue: !!document.querySelector('[data-scroll-cue]') }; }); };
  // Speech parts kept whole (pass NC, EARMARKS A82's browser check): every span partsWhole keeps (data-whole) on the line shown is one
  // line's piece, a blend, a run of a word's parts or sounds, a word said slowly or a run of beats; and the line's breaks are the same with
  // each of its sentences lit in turn as with none lit (A86's browser check: the light's room once moved them), each word's line read by
  // its top, the light the app's own (litStyle from the test hook) and the plant the old padding.
  // Since round one's code check a kept span also sits inside its paragraph's box, within a pixel, since a span kept whole can never break
  // but can run off the card (the first run rule kept counts and patterns whole, which ran past the card at 320 to 412).
  const wholeRead = async () => page.evaluate(() => { const spans = [...document.querySelectorAll('[data-whole]')].filter((s) => s.offsetParent !== null);
    const out = (s) => { const p = s.closest('p') || s.parentElement; const pr = p.getBoundingClientRect(); return [...s.getClientRects()].some((r) => r.right > pr.right + 1 || r.left < pr.left - 1); };
    return { n: spans.length, broken: spans.filter((s) => s.getClientRects().length > 1).map((s) => s.textContent), outside: spans.filter(out).map((s) => s.textContent) }; });
  // Each sentence of the line lit in turn with the app's own light (litStyle) against none lit; and the plant, the old padding.
  const lightEach = (style) => page.evaluate((given) => { const p = document.querySelector('[data-lesson-words]'); const lit = given || (window.__eduTest && window.__eduTest.litStyle); if (!p || !lit) return null;
    // Since round one's screen check each word is read by its place, its left and its top, so a word the light moved along its line
    // is caught as well as one it moved to another line; the message gives the words each line holds.
    const sig = () => { const tops = []; const places = []; const walk = document.createTreeWalker(p, NodeFilter.SHOW_TEXT); let t; while ((t = walk.nextNode())) { for (const m of t.textContent.matchAll(/\S+/g)) { const r = document.createRange(); r.setStart(t, m.index); r.setEnd(t, m.index + m[0].length); const rect = r.getClientRects()[0]; if (rect) { tops.push(Math.round(rect.top)); places.push(Math.round(rect.left) + ':' + Math.round(rect.top)); } } } const lines = []; let at = null; for (const y of tops) { if (at === null || Math.abs(y - at) > 4) { lines.push(0); at = y; } lines[lines.length - 1]++; } return lines.join(',') + ' @ ' + places.join(' '); };
    const spans = [...p.children].filter((s) => s.tagName === 'SPAN'); const was = spans.map((s) => s.getAttribute('style'));
    spans.forEach((s) => s.setAttribute('style', 'background: transparent')); const base = sig(); const off = [];
    spans.forEach((s, i) => { Object.assign(s.style, lit); const got = sig(); if (got !== base) off.push(`sentence ${i + 1}: ${base.split(' @ ')[0]} unlit, ${got.split(' @ ')[0]} lit${got.split(' @ ')[0] === base.split(' @ ')[0] ? ', a word moved along its line' : ''}`); s.setAttribute('style', 'background: transparent'); });
    spans.forEach((s, i) => (was[i] === null ? s.removeAttribute('style') : s.setAttribute('style', was[i]))); return { n: spans.length, off }; }, style || null);
  const OLD_LIGHT = { background: '#AAD8C5', color: '#16201B', borderRadius: '5px', padding: '1px 2px', margin: '0 -2px', boxDecorationBreak: 'clone', webkitBoxDecorationBreak: 'clone' };
  const wholeOff = []; let wholeSeen = 0; let plantWhole = null; let plantOutside = null; const reflowOff = []; let reflowRead = 0; let plantReflow = null;
  const readWhole = async (key) => { const w = await wholeRead(); wholeSeen += w.n; for (const t of w.broken) wholeOff.push(`${key}: "${t}" broken`); for (const t of w.outside) wholeOff.push(`${key}: "${t}" past its paragraph`);
    if (plantOutside === null && w.n > 0) { const set = await page.evaluate(() => { const s = [...document.querySelectorAll('[data-whole]')].find((x) => x.offsetParent !== null); if (!s) return null; window.__wasText = s.textContent; s.textContent = 'One, two, three, four, five, six, seven, eight, nine, ten, eleven, twelve.'; return true; }); const after = await wholeRead(); plantOutside = !!set && after.outside.length > w.outside.length; await page.evaluate(() => { const s = [...document.querySelectorAll('[data-whole]')].find((x) => x.offsetParent !== null && x.textContent.startsWith('One, two, three, four')); if (s && window.__wasText !== undefined) s.textContent = window.__wasText; delete window.__wasText; }); }
    if (plantWhole === null && w.n > 0) { plantWhole = await page.evaluate(() => { const s = [...document.querySelectorAll('[data-whole]')].find((x) => x.offsetParent !== null); if (!s) return null; const br = document.createElement('br'); br.setAttribute('data-plant-br', ''); s.insertBefore(br, s.lastChild); return true; }); const after = await wholeRead(); plantWhole = plantWhole && after.broken.length > w.broken.length; await page.evaluate(() => { const b = document.querySelector('[data-plant-br]'); if (b) b.remove(); }); }
    const each = await lightEach(); if (each) { reflowRead += each.n; for (const o of each.off) reflowOff.push(`${key}: ${o}`); }
    if (plantReflow !== true && each && each.n > 0) { const old = await lightEach(OLD_LIGHT); if (old && old.off.length) plantReflow = true; } };
  // Every read-aloud pre-K lesson, line by line.
  const lineOff = []; const lineWaits = []; let linesRead = 0; let plantLine = null; let plantLit = null;
  const rowOff = []; let rowsRead = 0; let plantTops = null; let plantMiddle = null; let plantAlone = null;
  const cueOff = []; let cueLines = 0; let cueShown = 0; let plantFake = null; let plantGone = null;
  // The lesson line's words at 320 by 568, line by line: how many lines, and whether the last holds one word alone; the plant, once, on
  // the first line past six lines that ends alone when set back to balance, puts its wrap back as the app set it.
  const loneRead = () => page.evaluate(() => { const p = document.querySelector('[data-lesson-words]'); if (!p) return null; const tops = []; const words = [];
    const walk = document.createTreeWalker(p, NodeFilter.SHOW_TEXT); let t; while ((t = walk.nextNode())) for (const m of t.textContent.matchAll(/\S+/g)) { const r = document.createRange(); r.setStart(t, m.index); r.setEnd(t, m.index + m[0].length); const rect = r.getClientRects()[0]; if (rect) { tops.push(Math.round(rect.top)); words.push(m[0]); } }
    const lines = []; let at = null; tops.forEach((y, i) => { if (at === null || Math.abs(y - at) > 4) { lines.push([]); at = y; } lines[lines.length - 1].push(words[i]); });
    const last = lines[lines.length - 1] || []; return { lines: lines.length, alone: lines.length > 1 && last.length === 1 ? last[0] : null, wrap: p.style.textWrap }; });
  const loneOff = []; const loneSeen = new Set(); let loneLines = 0; let plantLone = null;
  for (const m of lessons) {
    await page.evaluate((id) => window.__eduTest.openModule(id), m.id); await screenIs('lesson'); await page.waitForTimeout(500);
    for (let i = 0; i < m.lesson.script.length; i++) {
      for (let t = 0; t < 40 && (await stepOf()) !== i; t++) { if (t % 10 === 9) await page.locator('[data-lesson-nav] button[aria-label="Next"]').first().click({ force: true }).catch(() => {}); await page.waitForTimeout(100); }
      await page.waitForTimeout(150);
      const key = `${m.id} line ${i + 1}`; const bottom = await bottomOf(NAV); linesRead += bottom === null ? 0 : 1; note(theme, key, bottom);
      // The line measured is the line named: its own dot is lit (round two's code check). The plant, once, on the first lesson of two
      // lines or more: the lit mark moved to the next dot, and put back.
      const shows = await stepOf(); if (shows !== i) lineOff.push(`${key}: its own dot is not lit (line ${shows + 1} shows)`);
      if (plantLit === null && m.lesson.script.length >= 2 && shows === i) {
        await page.evaluate(() => { const s = [...document.querySelectorAll('[data-lesson-dots] span')]; const at = s.findIndex((x) => x.hasAttribute('data-lit')); window.__plantLitAt = at; s[at].removeAttribute('data-lit'); s[(at + 1) % s.length].setAttribute('data-lit', ''); });
        plantLit = (await stepOf()) !== i;
        await page.evaluate(() => { const s = [...document.querySelectorAll('[data-lesson-dots] span')]; for (const x of s) x.removeAttribute('data-lit'); s[window.__plantLitAt].setAttribute('data-lit', ''); delete window.__plantLitAt; });
      }
      if (over(key, bottom)) lineOff.push(`${key}: ${bottom}`); else if (bottom > VH) lineWaits.push(key);
      // The plant, once, on the first line whose Next ends within 120 pixels above the fold: its card pushed 120 pixels down puts the
      // Next under the fold, and the check must catch it.
      if (plantLine === null && bottom !== null && bottom > VH - 120 && bottom <= VH - 10) {
        plantLine = await page.evaluate(() => { const card = document.querySelector('.edu-rise'); if (!card) return null; const d = document.createElement('div'); d.style.height = '120px'; card.prepend(d); return true; });
        const pushed = await bottomOf(NAV); plantLine = plantLine && over('planted line', pushed); await page.evaluate(() => { const card = document.querySelector('.edu-rise'); if (card && card.firstChild && card.firstChild.style && card.firstChild.style.height === '120px') card.firstChild.remove(); });
      }
      // The row at 375 by 667, and its plants once, on the first line with nine dots or more: the speaker pushed 6 pixels down, the
      // dots pushed 16 pixels right, and the dots let wrap unbalanced in a box one dot too narrow, which leaves the last alone. Each
      // plant keeps the style it changes and puts it back as it was, since the row stays on the page from line to line and the app
      // sets some of those styles itself (the dots' width and balanced wrap).
      for (const f of await rowFaults()) rowOff.push(`${key} (375): ${f}`); rowsRead++; await readWhole(`${key} (375)`);
      if (plantTops === null && m.lesson.script.length >= 9) {
        const plant = async (sel, changes, word) => {
          await page.evaluate(([s, ch]) => { const el = document.querySelector(s); window.__plantWas = Object.fromEntries(Object.keys(ch).map((k) => [k, el.style[k]])); for (const [k, v] of Object.entries(ch)) el.style[k] = v === 'one dot too narrow' ? `${(el.children.length - 1) * 15 + 2}px` : v; }, [sel, changes]);
          const got = (await rowFaults()).some((f) => f.includes(word));
          await page.evaluate((s) => { const el = document.querySelector(s); Object.assign(el.style, window.__plantWas); delete window.__plantWas; }, sel);
          return got;
        };
        plantTops = await plant('[data-lesson-middle] > :first-child', { marginTop: '6px' }, 'tops');
        plantMiddle = await plant('[data-lesson-dots]', { paddingLeft: '16px' }, 'centred');
        plantAlone = await plant('[data-lesson-dots]', { textWrap: 'wrap', width: 'one dot too narrow' }, 'alone');
        const after = await rowFaults(); if (after.length) rowOff.push(`${key}: the row did not come back after the plants: ${after.join('; ')}`);
      }
      // The same line at 320 by 568: the row again, and the scroll cue against the share of Next below the screen.
      await page.setViewportSize(SMALL); const c = await readCue();
      for (const f of await rowFaults()) rowOff.push(`${key} (320): ${f}`); rowsRead++; await readWhole(`${key} (320)`);
      const lone = await loneRead(); if (lone) { loneLines++; if (lone.alone && !LONE_WAITS[key]) loneOff.push(`${key}: "${lone.alone}" alone on its last line of ${lone.lines}`); if (lone.alone) loneSeen.add(key); }
      if (plantLone === null && lone && lone.lines > 6 && !lone.alone) {
        await page.evaluate(() => { const p = document.querySelector('[data-lesson-words]'); window.__loneWas = p.style.textWrap; p.style.textWrap = 'balance'; });
        const set = await loneRead(); if (set && set.alone) plantLone = true;
        await page.evaluate(() => { const p = document.querySelector('[data-lesson-words]'); p.style.textWrap = window.__loneWas; delete window.__loneWas; }); }
      if (c) { cueLines++; if (c.cue) cueShown++; if (cueWrong(c)) cueOff.push(`${key}: ${c.bottom - c.H} of Next's ${c.height} pixels below the screen, the cue ${c.cue ? 'shown' : 'missing'}`); }
      // The cue's plants, once each: a cue put over a Next wholly shown, and the cue's mark taken off while a third of Next is hidden.
      if (plantFake === null && c && !c.cue && c.bottom <= c.H) {
        await page.evaluate(() => { const b = document.createElement('button'); b.setAttribute('data-scroll-cue', ''); b.setAttribute('data-plant', ''); b.style.cssText = 'position: fixed; right: 14px; bottom: 14px; width: 58px; height: 70px;'; document.body.appendChild(b); });
        plantFake = cueWrong(await readCue()); await page.evaluate(() => { const b = document.querySelector('[data-plant]'); if (b) b.remove(); });
      }
      if (plantGone === null && c && c.cue && !cueWrong(c)) {
        await page.evaluate(() => { const b = document.querySelector('[data-scroll-cue]'); if (b) { b.removeAttribute('data-scroll-cue'); b.setAttribute('data-plant-cue', ''); } });
        plantGone = cueWrong(await readCue()); await page.evaluate(() => { const b = document.querySelector('[data-plant-cue]'); if (b) { b.removeAttribute('data-plant-cue'); b.setAttribute('data-scroll-cue', ''); } });
      }
      await page.setViewportSize({ width: 375, height: VH }); await drawn();
      if (i < m.lesson.script.length - 1) await page.locator('[data-lesson-nav] button[aria-label="Next"]').first().click({ force: true }).catch(() => {});
    }
  }
  ok(`every line of every read-aloud pre-K lesson ends its Next, or its Start practice star, above a 375 by 667 phone's fold in the ${theme} theme (${linesRead} lines of ${lessons.length} lessons read, each its own dot lit; ${lineWaits.length} older lines waiting by name; a line pushed 120 pixels down, and a line whose own dot is not lit, caught)`, lineOff.length === 0 && linesRead >= FLOORS.lines && plantLine === true && plantLit === true, { lineOff, plantLine, plantLit });
  ok(`every line's row holds together at 375 by 667 and 320 by 568 in the ${theme} theme: Back, the speaker and Next with level tops, the dots centred under the speaker, no dot alone on a row (${rowsRead} rows read; a speaker pushed 6 pixels down, dots pushed 16 pixels right and a dot left alone caught)`, rowOff.length === 0 && rowsRead >= FLOORS.lines * 2 && plantTops === true && plantMiddle === true && plantAlone === true, { rowOff: rowOff.slice(0, 12), plantTops, plantMiddle, plantAlone });
  ok(`at 320 by 568 the scroll cue shows on a lesson line exactly when more than a third of Next is below the screen in the ${theme} theme, so it never sits on a Next two thirds of which show (${cueLines} lines read, the cue on ${cueShown}; a cue put over a Next wholly shown and a cue taken away from a Next a third hidden caught)`, cueOff.length === 0 && cueLines >= FLOORS.lines && cueShown >= FLOORS.cue[theme] && plantFake === true && plantGone === true, { cueOff: cueOff.slice(0, 12), plantFake, plantGone });
  ok(`every speech part kept whole on a pre-K lesson line stays on one line at 375 by 667 and 320 by 568 in the ${theme} theme, a blend, a run of a word's parts or sounds, a word said slowly and a run of beats, and inside its paragraph (pass NC, EARMARKS A82; ${wholeSeen} spans read; a span broken in two and a span run past its paragraph, planted, caught)`, wholeOff.length === 0 && wholeSeen >= FLOORS.whole && plantWhole === true && plantOutside === true, { off: wholeOff.slice(0, 4), seen: wholeSeen, floor: FLOORS.whole, plantWhole, plantOutside });
  const loneStale = Object.keys(LONE_WAITS).filter((k) => !loneSeen.has(k));
  ok(`no pre-K lesson line ends on one lone word at 320 by 568 in the ${theme} theme, a line past six lines wrapping pretty (pass NC, EARMARKS A82; ${loneLines} lines read; ${Object.keys(LONE_WAITS).length} lines that must end alone named with their reasons, none stale; a long line set back to balance ended alone and was caught)`, loneOff.length === 0 && loneStale.length === 0 && loneLines >= FLOORS.lines && plantLone === true, { loneOff: loneOff.slice(0, 8), loneStale, plantLone });
  ok(`every pre-K lesson line breaks the same with each of its sentences lit in turn as with none lit, at 375 by 667 and 320 by 568 in the ${theme} theme, so the reading light never moves the words, each word read by its place (pass NC, EARMARKS A86; ${reflowRead} sentences lit; the old padding, planted, moved the words and was caught)`, reflowOff.length === 0 && reflowRead >= FLOORS.lit && plantReflow === true, reflowOff.slice(0, 4));
  // The questions as a child sees them (pass MZ, round one's code check): an early-years learner the educator adds, opened from the
  // educator's own page, so no question shows a stand-in note.
  // First the near miss for that count (round two's code check): the walk-through shows its notes, and pm-same-things' fifth seed,
  // whose pictures wait for paintings, read there, must show some, so a count that could see none fails.
  const pmHome = early.flatMap((c) => c.modules).find((m) => m.generators.includes('pm-same-things'));
  await page.evaluate((mid) => window.__eduTest.showQuestion('pm-same-things', 5, mid), pmHome.id); await screenIs('practice'); await drawn();
  const walkNotes = ((await CHECK()) || { notes: 0 }).notes;
  await page.evaluate(() => window.__eduTest.goHome()); await screenIs('educator-pick'); await page.waitForTimeout(400);
  for (const n of ['Skip tour', 'Later', 'Got it']) await tapIf(n);
  await page.getByRole('button', { name: 'Add someone new' }).first().click(); await page.waitForTimeout(300);
  await page.fill('input[placeholder="School-issued ID"]', 'F-1'); await page.getByRole('button', { name: /^Early years/ }).first().click(); await page.waitForTimeout(200);
  await page.getByRole('button', { name: 'Add', exact: true }).click(); await page.waitForTimeout(500); await tapIf('Later');
  await page.getByRole('button', { name: 'Home' }).first().click(); await page.waitForTimeout(500);
  await page.getByRole('button', { name: /F-1$/ }).first().click(); await page.waitForTimeout(900); await tapIf('Later');
  await screenIs('overview');
  const childView = await page.evaluate(() => ![...document.querySelectorAll('[role="status"]')].some((x) => /Walkthrough Mode/.test(x.textContent)));
  // Every pre-K bank at seeds 1 to 6, as its own lesson asks it.
  const bankOff = []; const bankWaits = []; let banksRead = 0; let screensRead = 0; let notesSeen = 0; const skipped = []; let plantBank = null;
  for (const g of banks) {
    const home = early.flatMap((c) => c.modules).find((m) => m.generators.includes(g));
    for (let seed = 1; seed <= SEEDS; seed++) {
      await page.evaluate(([gen, s, mid]) => window.__eduTest.showQuestion(gen, s, mid), [g, seed, home.id]); await screenIs('practice'); await drawn();
      const got = await CHECK();
      // A bank with no Check answer is a tracing kind, which the child finishes by drawing; every seed of it is the same kind.
      if (got === null) { const q = await page.evaluate(() => window.__eduTest.question && window.__eduTest.question.type); skipped.push(`${g} (${q})`); break; }
      if (seed === 1) banksRead += 1;
      screensRead += 1; notesSeen += got.notes; const key = `${g} seed ${seed}`; const bottom = got.bottom; note(theme, key, bottom);
      if (over(key, bottom)) bankOff.push(`${key}: ${bottom}`); else if (bottom > VH) bankWaits.push(key);
      // The plant, once, on the first question whose Check answer ends within 120 pixels above the fold: its question pushed 120 pixels
      // down puts Check answer under the fold, and the check must catch it.
      if (plantBank === null && bottom > VH - 120 && bottom <= VH - 10) {
        await page.evaluate(() => { const t = document.querySelector('[data-question-text]'); if (t) { const d = document.createElement('div'); d.style.height = '120px'; d.setAttribute('data-plant', ''); t.before(d); } });
        const pushed = await CHECK(); plantBank = over('planted question', pushed && pushed.bottom); await page.evaluate(() => { const d = document.querySelector('[data-plant]'); if (d) d.remove(); });
      }
    }
  }
  const notTrace = skipped.filter((s) => !/\(trace\)$/.test(s));
  ok(`the questions are read as a child sees them in the ${theme} theme: a learner the educator added, with no Walkthrough Mode tab and no stand-in note on any of ${screensRead} questions (the walk-through's ${walkNotes} notes on pm-same-things' fifth seed seen first)`, childView && notesSeen === 0 && screensRead > 0 && walkNotes > 0, { childView, notesSeen, walkNotes });
  ok(`every pre-K bank's Check answer ends above a 375 by 667 phone's fold for a child in the ${theme} theme, at seeds 1 to ${SEEDS} (${banksRead} banks and ${screensRead} questions read, ${skipped.length} tracing banks with no Check answer passed over; ${bankWaits.length} older questions waiting by name; a question pushed 120 pixels down caught)`, bankOff.length === 0 && notTrace.length === 0 && banksRead >= FLOORS.banks && screensRead >= FLOORS.banks * SEEDS && plantBank === true, { bankOff, notTrace, plantBank });
  ok(`no page error while the lessons and questions were shown in the ${theme} theme`, errors.length === 0, errors.slice(0, 3));
  await ctx.close();
}
// A painting on a lesson line (pass MZ, round two's code check: the rules audit said this check held a painting's cap and corners, but the
// test page has no paintings, so every line drew the drawing that waits for one). Each painting a read-aloud pre-K lesson line shows is put
// in place as a 1200 by 900 stand-in, made by the browser itself and listed in window.__eduArt as the built site lists Mikey's files, in a
// copy of the test page in tests/e2e/out/painted, which the check removes when it is done. On a 375 by 667 phone, in both themes, each
// such line must end its Next above the fold and draw its painting no taller than 180 pixels, in a box of the painting's own shape with
// rounded corners, so the corners are the painting's. A painting let grow to 300 pixels, and one stretched to the card's width, are
// planted on the first line and caught.
{ const { mkdirSync, writeFileSync, readFileSync, rmSync } = await import('node:fs');
  const out = new URL('./out/painted/', import.meta.url); rmSync(out, { recursive: true, force: true }); mkdirSync(new URL('./art/stories/', out), { recursive: true });
  writeFileSync(new URL('./page.html', out), readFileSync(new URL('./page.html', import.meta.url)));
  const painted = lessons.flatMap((m) => ((m.lesson && m.lesson.pictures) || []).filter((p) => typeof p.step === 'number' && p.serial).map((p) => ({ m, step: p.step, serial: p.serial })));
  const maker = await browser.newPage();
  const webp = await maker.evaluate(() => { const c = document.createElement('canvas'); c.width = 1200; c.height = 900; const x = c.getContext('2d'); const g = x.createLinearGradient(0, 0, 1200, 900); g.addColorStop(0, '#9cc9a8'); g.addColorStop(1, '#e8d9a8'); x.fillStyle = g; x.fillRect(0, 0, 1200, 900); return c.toDataURL('image/webp', 0.8); });
  await maker.close(); const bytes = Buffer.from(webp.split(',')[1], 'base64');
  for (const x of painted) writeFileSync(new URL(`./art/stories/${x.serial}.webp`, out), bytes);
  for (const theme of ['light', 'dark']) {
    const ctx = await browser.newContext({ viewport: { width: 375, height: VH }, hasTouch: true, reducedMotion: 'reduce' });
    await ctx.addInitScript(([t, art]) => { try { localStorage.setItem('edusphere_v1_theme', t); } catch (e) { /* no storage */ } window.__eduArt = art; }, [theme, painted.map((x) => x.serial)]);
    const page = await ctx.newPage(); const errors = []; page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
    await page.goto(new URL('./page.html', out).href);
    const screenIs = (n) => page.waitForFunction((x) => window.__eduTest && window.__eduTest.screen === x, n, { timeout: 15000 });
    const tapIf = async (name) => { const b = page.getByRole('button', { name, exact: true }); if (await b.count()) { await b.first().click({ force: true }); await page.waitForTimeout(250); return true; } return false; };
    await screenIs('welcome');
    await page.getByRole('button', { name: 'Create account', exact: true }).first().click(); await screenIs('educator-setup');
    await page.fill('input[placeholder="PIN"]', '2468'); await page.fill('input[placeholder="PIN again"]', '2468'); await page.fill('input[placeholder="This device\'s name"]', 'Paint'); await page.selectOption('select[aria-label="Your state"]', 'TX');
    await page.getByRole('button', { name: 'Create account', exact: true }).click(); await screenIs('educator-pick'); await page.waitForTimeout(500);
    for (const n of ['Skip tour', 'Later', 'Got it']) await tapIf(n);
    await page.getByLabel('Walk through early years').first().click({ force: true }); await screenIs('overview'); await page.waitForTimeout(400);
    const lit = () => page.evaluate(() => [...document.querySelectorAll('[data-lesson-dots] span')].findIndex((s) => s.hasAttribute('data-lit')));
    // The painting's box and the image inside it, once it has loaded and been drawn, and where Next ends on the page.
    const look = (serial) => page.evaluate((s) => new Promise((res) => {
      const go = () => { const img = document.querySelector(`img[data-lesson-picture="${s}"]`); const nx = document.querySelector('[data-lesson-next]'); if (!img || !nx) { res(null); return; } const b = img.getBoundingClientRect();
        res({ h: b.height, ratio: b.width / b.height, natural: img.naturalWidth ? img.naturalWidth / img.naturalHeight : 0, radius: getComputedStyle(img).borderRadius, next: Math.round(nx.getBoundingClientRect().bottom + window.scrollY) }); };
      const img = document.querySelector(`img[data-lesson-picture="${s}"]`);
      if (img && !img.complete) { img.addEventListener('load', () => requestAnimationFrame(() => requestAnimationFrame(go)), { once: true }); img.addEventListener('error', go, { once: true }); } else requestAnimationFrame(() => requestAnimationFrame(go)); }), serial);
    const faults = (r) => (!r ? ['no painting'] : [...(r.natural ? [] : ['not loaded']), ...(r.next > VH ? [`Next ends at ${r.next}`] : []), ...(r.h > 180.5 ? [`${Math.round(r.h)} pixels tall`] : []),
      ...(r.natural && Math.abs(r.ratio - r.natural) > 0.02 ? [`its box ${r.ratio.toFixed(2)} wide for each pixel tall, the painting ${r.natural.toFixed(2)}`] : []), ...(r.radius === '12px' ? [] : [`corners ${r.radius}`])]);
    const paintOff = []; let read = 0; let plantTall = null; let plantWide = null;
    for (const x of painted) {
      await page.evaluate((id) => window.__eduTest.openModule(id), x.m.id); await screenIs('lesson'); await page.waitForTimeout(300);
      for (let i = 0; i < x.step; i++) { await page.locator('[data-lesson-nav] button[aria-label="Next"]').first().click({ force: true }).catch(() => {}); await page.waitForTimeout(90); }
      for (let t = 0; t < 30 && (await lit()) !== x.step; t++) await page.waitForTimeout(100);
      await page.evaluate(() => window.scrollTo(0, 0));
      const key = `${x.m.id} line ${x.step + 1} (${x.serial})`;
      if ((await lit()) !== x.step) { paintOff.push(`${key}: its own dot is not lit`); continue; }
      const r = await look(x.serial); read += r && r.natural ? 1 : 0; for (const f of faults(r)) paintOff.push(`${key}: ${f}`);
      if (plantTall === null && r && r.natural) {
        const planted = async (style) => {
          await page.evaluate(([s, st]) => { const img = document.querySelector(`img[data-lesson-picture="${s}"]`); window.__plantWas = Object.fromEntries(Object.keys(st).map((k) => [k, img.style[k]])); Object.assign(img.style, st); }, [x.serial, style]);
          const got = faults(await look(x.serial)).length > 0;
          await page.evaluate((s) => { const img = document.querySelector(`img[data-lesson-picture="${s}"]`); Object.assign(img.style, window.__plantWas); delete window.__plantWas; }, x.serial);
          return got; };
        plantTall = await planted({ maxHeight: '300px' }); plantWide = await planted({ width: '100%', objectFit: 'contain' });
        const after = faults(await look(x.serial)); if (after.length) paintOff.push(`${key}: the painting did not come back after the plants: ${after.join('; ')}`);
      }
    }
    ok(`with each painting in place, every read-aloud pre-K lesson line that shows one ends its Next above a 375 by 667 phone's fold in the ${theme} theme, its painting at most 180 pixels tall in a box of its own shape with rounded corners (${read} lines read; a painting grown to 300 pixels and one stretched to the card's width caught)`, paintOff.length === 0 && read >= FLOORS.paintings && plantTall === true && plantWide === true && errors.length === 0, { paintOff: paintOff.slice(0, 10), plantTall, plantWide, errors: errors.slice(0, 2) });
    await ctx.close();
  }
  rmSync(out, { recursive: true, force: true });
}
// A wait names a line or bank this check reads that is still under the fold in a theme (round two's code read: a wait for a line that
// was fixed, or a key mistyped, never failed); a wait for a lesson that is not there is planted.
const unknownOf = (waits) => Object.keys(waits).filter((k) => !seen.has(k));
const stale = Object.keys(FOLD_WAITS).filter((k) => seen.has(k) && Object.values(seen.get(k)).every((b) => b === null || b <= VH));
const plantedWait = unknownOf({ ...FOLD_WAITS, 'no-such-lesson line 1': 700 }).length === unknownOf(FOLD_WAITS).length + 1;
ok(`every wait names a line or bank this check reads that is still under the fold in a theme (${Object.keys(FOLD_WAITS).length} waits; a wait for a lesson that is not there caught)`, unknownOf(FOLD_WAITS).length === 0 && stale.length === 0 && plantedWait, { unknown: unknownOf(FOLD_WAITS), stale });
// FOLD_REPORT=<file> writes every line and bank under the fold in either theme, with its bottom in each, for a reader filling FOLD_WAITS.
if (process.env.FOLD_REPORT) { const { writeFileSync } = await import('node:fs'); writeFileSync(process.env.FOLD_REPORT, JSON.stringify(Object.fromEntries([...seen].filter(([, b]) => Object.values(b).some((x) => x !== null && x > VH))), null, 1)); }
await browser.close();
console.log(`\n${passed} passed, ${failed} failed`);
process.exitCode = failed ? 1 : 0;
