// The Wise Human. Copyright (c) 2026. Source-available; not for reuse. See LICENSE.md.
// No word under the scroll cue (pass NE, EARMARKS A63). Since pass MV each screen check found the round button with three arrows, fixed in
// a short phone's bottom right corner while the button a child needs next is below what shows, lying on words its comment said it never
// covers: a long lesson line's last words, and in practice the reason after a first wrong tap and the explanation after the right one (in
// pass ND's own read, after a first wrong tap at 320 by 568 on 25 of its 150 screens in the light theme and 19 in the dark, and after the
// right tap at 375 by 667 on 5 and 10). Since pass NE the words make room for it (keepCueRoom in ui.jsx), and this check holds it.
// In plain terms: at 320 by 568 and 375 by 667, in the light theme and then the dark one, every line of every read-aloud pre-K lesson is
// opened at the top of the page, as a line opens, and wherever the cue shows, each word of the line and of its say-along strip (a call
// the voice has not reached yet is read too, since it shows in turn) is read where it rests, each text node's words read with a Range and
// their boxes laid over the cue's own box: a word that overlaps it fails. Then, as a child sees them (a learner the educator adds, as the
// fold check reads them), every pre-K bank's question is answered with a first wrong tap and, after Try again, with the right one, Check
// answer brought into view first the way the cue brings it when any of its row is below the screen, and the words of the feedback box
// are read the same way wherever the cue shows.
// What it samples: a lesson line is quick to read, so every line is read at both sizes in both themes; a question takes longer, so each
// of a bank's six seeds (1 to 6) is read in one of the four pairs of a size and a theme, in turn (the pair whose place in COMBOS is the
// bank's place among the banks plus the seed, four apart), so every bank is read at both sizes in both themes and every one of its six
// questions once (about four and a half minutes on a two-CPU machine). CUE_WORDS_FULL=1 reads every question in all four, four times as many.
// Its proofs, each a number the check reads, never a message: the plant is the fix undone in the page, each block's room set back to none
// by a style that outranks it and its wrap chosen again, on every screen where the cue shows, which must find words under the cue on about
// as many screens as the earmark counted before the fix (PLANT_FLOORS); the near misses are a word put just clear of the cue's left edge
// and of its top, which pass, and the same word one pixel inside each, which are caught, so the band is pinned on both sides. And three
// things the fix promises: the room never makes the cue (on every screen where it shows, with the room undone the cue's own rule still
// shows it); the cue decides as a state is drawn, so a screen read again 1.3 seconds later reads the same (the first screen with the cue
// in each part); and with motion on, where a lesson card rises and a feedback box wobbles or cheers, the room chosen as a state is first
// drawn is the room it keeps once it rests, and no word sits under the cue then (a few screens at 320 by 568 in the light theme).
// Its floors are the counts the code has (FLOORS), so a lesson, a bank or a cue that drops out of the read fails.
// Run: node tests/e2e/make-page.mjs && node tests/e2e/cue-words.mjs
import { createRequire } from 'node:module'; import { execSync } from 'node:child_process';
const G = execSync('npm root -g').toString().trim(); const { chromium } = createRequire(import.meta.url)(`${G}/playwright`);
const L = await import('../../src/logic.mjs');
let passed = 0, failed = 0; const ok = (name, cond, info) => { if (cond) { passed++; console.log('PASS - ' + name); } else { failed++; console.log('FAIL - ' + name + (info !== undefined ? '  ' + JSON.stringify(info).slice(0, 900) : '')); } };
const began = Date.now(); const secs = () => Math.round((Date.now() - began) / 1000);
const FULL = process.env.CUE_WORDS_FULL === '1';
const SEEDS = 6;
// The two short phones the app is drawn for (the first iPhone SE, and the SE and 8), each theme, in the order they are read.
const COMBOS = ['light', 'dark'].flatMap((theme) => [[320, 568], [375, 667]].map(([w, h]) => ({ theme, w, h, key: `${theme} ${w} by ${h}` })));
// The words read: a lesson line's own words and its say-along strip; a practice round's feedback box (its own mark since pass NE, and
// on the practice screen the one box that wobbles or cheers, so the check reads the code from before the fix as well).
const LINE_WORDS = '[data-lesson-words], [data-say-along]';
const FEEDBACK = '[data-feedback], div.edu-wobble, div.edu-cheer';
// The counts the code has, floors as the fold check's are (pass NE, read when this check was written): lines read in each pair (1102
// lines of 104 lessons), lines where the cue shows (48 at 320 by 568 in each theme since round two, 46 when it was written, none at 375 by 667, where the fold check holds every
// line's Next above the fold), questions read in each pair and where the cue shows after each tap. A lesson or a bank added raises a
// count and its floor follows in the same pass; a layout that moves a Next or a row moves a cue's count, and its floor follows that too.
const FLOORS = {
  lines: 1102,
  // At 375 by 667 none, a ceiling as well as a floor (round one's code read: a verdict that read no line could not fail).
  cueLines: { 'light 320 by 568': 48, 'light 375 by 667': 0, 'dark 320 by 568': 48, 'dark 375 by 667': 0 },
  screens: { 'light 320 by 568': 643, 'light 375 by 667': 643, 'dark 320 by 568': 644, 'dark 375 by 667': 644 },
  cueScreens: { wrong: { 'light 320 by 568': 476, 'light 375 by 667': 92, 'dark 320 by 568': 484, 'dark 375 by 667': 101 }, right: { 'light 320 by 568': 572, 'light 375 by 667': 280, 'dark 320 by 568': 574, 'dark 375 by 667': 287 } },
};
// The plant's floors: with the fix undone, the lines and questions it finds words under the cue on, as many as the code before the fix
// had (pass NE: 22 lines at 320 by 568 in the light theme and 21 in the dark; 247 questions after a first wrong tap and 192 after the
// right one in the four, 191 since round one's code read changed the picture bank's draw), so a plant that stops finding them fails.
// Since round one's screen read a line's last two words are held together, so a pair moves to the last line with the room undone: 21 and 20.
const PLANT_FLOORS = { lines: { 'light 320 by 568': 21, 'dark 320 by 568': 20 }, wrong: 247, right: 191 };
// CUE_WORDS_ONLY=<lesson ids, comma-separated> reads only those lessons and their banks, for a focused look; it pins no floor.
const ONLY = (process.env.CUE_WORDS_ONLY || '').split(',').map((x) => x.trim()).filter(Boolean);
const early = L.COURSES.filter((c) => (c.grade === 'PK3' || c.grade === 'PK4') && c.readAloud);
const lessons = early.flatMap((c) => c.modules).filter((m) => m.lesson && Array.isArray(m.lesson.script) && m.lesson.script.length && (!ONLY.length || ONLY.includes(m.id)));
const banks = [...new Set(early.flatMap((c) => c.modules).filter((m) => !ONLY.length || ONLY.includes(m.id)).flatMap((m) => m.generators))];
const pin = ONLY.length === 0;   // the floors hold for a whole run only
const homeOf = (g) => early.flatMap((c) => c.modules).find((m) => m.generators.includes(g));
// Pass ND's own banks, the screens its read counted (25 of 150 and 19 after a first wrong tap at 320 by 568; 5 and 10 after the right tap
// at 375 by 667), so a full run can set the plant beside the earmark's counts.
const ND_LESSONS = ['letters-and-sounds', 'hear-it-in-the-name', 'end-of-the-name', 'space-between-words', 'spaces-between-words'];
const ndBanks = new Set(early.flatMap((c) => c.modules).filter((m) => ND_LESSONS.includes(m.id)).flatMap((m) => m.generators));
const sampled = (bankAt, seed, comboAt) => FULL || (bankAt + seed) % COMBOS.length === comboAt;

// The reader, put in the page before the app loads. Everything it reads is read in one go, between two frames, so nothing moves under it.
function reader() {
  const frames = (n) => new Promise((res) => { const f = (k) => (k <= 0 ? res() : requestAnimationFrame(() => f(k - 1))); f(n); });
  // A task's turn (a tap's update is committed by then) and a frame drawn with its resize observers run.
  const tick = () => new Promise((res) => { const c = new MessageChannel(); c.port1.onmessage = () => res(); c.port2.postMessage(0); });
  const painted = () => new Promise((res) => requestAnimationFrame(() => setTimeout(res, 0)));
  const cueEl = () => document.querySelector('[data-scroll-cue]');
  // The words of the blocks the selector names that overlap the cue's box, each word read with a Range over its text node.
  const under = (sel) => {
    const cue = cueEl(); if (!cue) return { cue: false, words: [] };
    const c = cue.getBoundingClientRect(); const words = [];
    for (const scope of document.querySelectorAll(sel)) {
      const walk = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT); let t;
      while ((t = walk.nextNode())) for (const m of t.textContent.matchAll(/\S+/g)) {
        const r = document.createRange(); r.setStart(t, m.index); r.setEnd(t, m.index + m[0].length);
        for (const q of r.getClientRects()) if (q.width > 0 && q.height > 0 && q.right > c.left && q.left < c.right && q.bottom > c.top && q.top < c.bottom) { words.push(m[0]); break; }
      }
    }
    return { cue: true, words };
  };
  // Words elsewhere on the screen under the cue (the question, its answers), reported and never failed: they are not this check's.
  const others = (sel) => { const cue = cueEl(); const wrap = document.querySelector('.edu-wrap'); if (!cue || !wrap) return [];
    const c = cue.getBoundingClientRect(); const out = []; const walk = document.createTreeWalker(wrap, NodeFilter.SHOW_TEXT); let t;
    while ((t = walk.nextNode())) { const el = t.parentElement; if (!el || el.closest(sel) || el.closest('[data-scroll-cue]')) continue;
      for (const m of t.textContent.matchAll(/\S+/g)) { const r = document.createRange(); r.setStart(t, m.index); r.setEnd(t, m.index + m[0].length);
        for (const q of r.getClientRects()) if (q.width > 0 && q.height > 0 && q.right > c.left && q.left < c.right && q.bottom > c.top && q.top < c.bottom) { out.push(m[0]); break; } } }
    return out; };
  // The plant: every block's room set back to none by a style that outranks the app's, and each block told to choose its wrap again,
  // as the app tells it (edu-refit); taken away the same way.
  const plant = (on) => {
    const had = document.getElementById('cue-plant');
    if (on && !had) { const s = document.createElement('style'); s.id = 'cue-plant'; s.textContent = '[data-cue-room] { --cue-room: 0px !important; }'; document.head.appendChild(s); }
    if (!on && had) had.remove();
    for (const el of document.querySelectorAll('[data-cue-room]')) el.dispatchEvent(new Event('edu-refit'));
  };
  // The cue's own rule, read on the page as it stands: a lesson's Next more than a third below, or any of a practice row below by 4 pixels.
  const wants = (target, rule) => { const el = document.querySelector(target); if (!el) return null; const r = el.getBoundingClientRect();
    return rule === 'whole' ? r.bottom > innerHeight + 4 : r.bottom - innerHeight > r.height / 3; };
  const rooms = () => [...document.querySelectorAll('[data-cue-room]')].map((el) => el.style.getPropertyValue('--cue-room') || '0px').join(' ');
  // Since round one's screen read: a block's room is at most what the cue needs, how far the block's inner edge reaches past the cue's
  // left edge less the 6-pixel gap (CUE_GAP), by a pixel; the lone-word guard had grown rooms to two fifths of a line.
  const overRoom = () => { const cue = cueEl(); if (!cue) return []; const c = cue.getBoundingClientRect(); const out = [];
    for (const el of document.querySelectorAll('[data-cue-room]')) { const room = parseFloat(el.style.getPropertyValue('--cue-room')) || 0; if (!room) continue;
      const r = el.getBoundingClientRect(); const need = r.right - (parseFloat(getComputedStyle(el).borderRightWidth) || 0) - (c.left - 6);
      if (room > need + 1) out.push(`${Math.round(room)} of ${Math.round(need)}`); }
    return out; };
  // The fold check's two rules a room could move, read here in the state the room makes (EARMARKS A82): a lesson line's last line never
  // holds one word alone, read by each word's top as the fold check reads it, and every speech part kept whole (data-whole) stays on one
  // line and inside its paragraph.
  const lone = () => { const p = document.querySelector('[data-lesson-words]'); if (!p) return null; const tops = []; const walk = document.createTreeWalker(p, NodeFilter.SHOW_TEXT); let t;
    while ((t = walk.nextNode())) for (const m of t.textContent.matchAll(/\S+/g)) { const r = document.createRange(); r.setStart(t, m.index); r.setEnd(t, m.index + m[0].length); const q = r.getClientRects()[0]; if (q) tops.push([Math.round(q.top), m[0]]); }
    const lines = []; let at = null; for (const [y, w] of tops) { if (at === null || Math.abs(y - at) > 4) { lines.push([]); at = y; } lines[lines.length - 1].push(w); }
    const last = lines[lines.length - 1] || []; return lines.length > 1 && last.length === 1 ? last[0] : ''; };
  const whole = () => { const p = document.querySelector('[data-lesson-words]'); if (!p) return []; const pr = p.getBoundingClientRect();
    return [...p.querySelectorAll('[data-whole]')].filter((s) => s.getClientRects().length > 1 || [...s.getClientRects()].some((r) => r.right > pr.right + 1 || r.left < pr.left - 1)).map((s) => s.textContent); };
  // One state read: the cue, the words under it, and with the room undone the words under it and whether the cue's rule still shows it.
  // Text fitted to its box (FitText: a print picture) fits itself again a frame after its box changes, so where a block holds any, the
  // plant's read and the read after it wait for that frame.
  const read = async (sel, target, rule) => {
    const now = under(sel); const st = { cue: now.cue, words: now.words, others: now.cue ? others(sel) : [], rooms: rooms(), over: now.cue ? overRoom() : [] };
    if (now.cue) {
      const fitted = !!document.querySelector('[data-cue-room] [data-fit-text]');
      if (rule === 'third') { st.lone = lone(); st.whole = whole(); }
      plant(true); if (fitted) await painted(); st.planted = under(sel).words; st.stillWanted = wants(target, rule); if (rule === 'third') st.loneWithout = lone();
      plant(false); if (fitted) await painted(); st.back = rooms(); st.after = under(sel).words;
    }
    return st;
  };
  // The near misses: a word put inside the first block, fixed, its right edge half a pixel left of the cue's left edge and then one pixel
  // inside it, and its bottom half a pixel above the cue's top and then one pixel inside; each read by the same reading as the words.
  const nearMiss = (sel) => {
    const cue = cueEl(); const scope = document.querySelector(sel); if (!cue || !scope) return null;
    const c = cue.getBoundingClientRect();
    const s = document.createElement('span'); s.setAttribute('data-near-miss', ''); s.textContent = 'clear';
    s.style.cssText = 'position: fixed; left: 0px; top: 0px; white-space: nowrap; font-size: 20px; line-height: 1;'; scope.appendChild(s);
    const box = () => { const r = document.createRange(); r.selectNodeContents(s.firstChild); return r.getClientRects()[0]; };
    const place = (right, bottom) => { s.style.left = '0px'; s.style.top = '0px'; const b = box(); s.style.left = `${right - b.right}px`; s.style.top = `${bottom - b.bottom}px`; };
    const caught = () => under(sel).words.includes('clear');
    const mid = c.top + c.height / 2 + 8; const x = c.left + c.width / 2 + 12;
    place(c.left - 0.5, mid); const leftClear = !caught();
    place(c.left + 1, mid); const leftIn = caught();
    place(x, c.top - 0.5); const topClear = !caught();
    place(x, c.top + 1); const topIn = caught();
    s.remove();
    return { leftClear, leftIn, topClear, topIn };
  };
  // A state is read once the tap that made it is committed and a frame is drawn, since the cue decides as a state is drawn (pass NE);
  // a state whose target (a lesson's Next, a practice row) ends 40 pixels or more above the screen's foot, where the cue cannot show at
  // rest, is not read further ('clear'). Where the cue still disagrees with its own rule after the frame, as the code before pass NE did
  // for 60 milliseconds, the state is read once its first timed check has run (110 milliseconds after the tap), so the check reads that
  // code where it rests too.
  const settle = async (t0, target, rule) => {
    await tick(); const el = document.querySelector(target); if (!el) return 'lost';
    if (el.getBoundingClientRect().bottom < innerHeight - 40) return 'clear';
    await painted(); const w = wants(target, rule);
    if (w !== null && !!cueEl() !== w) { while (performance.now() - t0 < 110) await frames(1); await painted(); }
    return 'read';
  };
  const btn = (txt) => [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === txt);
  const litDot = () => [...document.querySelectorAll('[data-lesson-dots] span')].findIndex((s) => s.hasAttribute('data-lit'));
  window.__cw = {
    frames, read, nearMiss, rooms, under,
    // Since round two's code read: the plant for the verdict that the room keeps a lesson line's wrap whole. On a line where the cue shows,
    // its no-break spaces set back to spaces and its room widened two pixels at a time from its own, up to two fifths of its width, until
    // its last word stands alone, each width chosen again as the app chooses it (edu-refit); read as read() reads, with no room as well.
    async loneRoomPlant() {
      const p = document.querySelector('[data-lesson-words]'); const blk = p && p.closest('[data-cue-room]'); if (!blk) return null;
      const was = blk.style.getPropertyValue('--cue-room') || '0px'; const nb = []; const w = document.createTreeWalker(p, NodeFilter.SHOW_TEXT); let t;
      while ((t = w.nextNode())) if (t.textContent.includes('\u00a0')) { nb.push([t, t.textContent]); t.textContent = t.textContent.replace(/\u00a0/g, ' '); }
      const set = async (px) => { blk.style.setProperty('--cue-room', px); blk.dispatchEvent(new Event('edu-refit')); await painted(); };
      await set('0px'); const without = lone(); let got = null;
      if (!without) for (let px = parseFloat(was) || 0; px <= blk.clientWidth * 0.4 && !got; px += 2) { await set(`${px}px`); const l = lone(); if (l) got = { room: px, lone: l }; }
      for (const [x, s] of nb) x.textContent = s; await set(was);
      return { parted: nb.length, without, got, back: (blk.style.getPropertyValue('--cue-room') || '0px') === was };
    },
    // A lesson's lines, each read where the line opens at the top of the page; its own dot lit, so the line read is the line named.
    async lesson(n, wait, sel) {
      const out = []; let t0 = performance.now();
      for (let i = 0; i < n; i++) {
        for (let k = 0; k < 120 && litDot() !== i; k++) await (k < 20 ? tick() : frames(1));
        if (litDot() !== i) { out.push({ i, lost: true }); break; }
        const how = wait ? (await painted(), 'read') : await settle(t0, '[data-lesson-next]', 'third'); if (wait) await new Promise((r) => setTimeout(r, wait));
        const nx = document.querySelector('[data-lesson-next]').getBoundingClientRect();
        const strip = document.querySelector('[data-say-along]'); const holder = strip && strip.closest('[data-cue-room]');
        out.push({ i, hidden: Math.round(nx.bottom - innerHeight), stripRoom: holder ? holder.style.getPropertyValue('--cue-room') || '0px' : null, ...(how === 'clear' ? { cue: false, words: [], others: [] } : await read(sel, '[data-lesson-next]', 'third')) });
        if (i < n - 1) { const b = document.querySelector('[data-lesson-nav] button[aria-label="Next"]'); t0 = performance.now(); if (b) b.click(); }
      }
      return out;
    },
    // A bank's question at a seed: a first wrong tap (the first wrong answer in the buttons' order, or a direction tapped backward),
    // then Try again and the right tap; before each Check answer its row is brought into view as the cue brings it when any of it is
    // below the screen. A tracing question has no Check answer and is passed over.
    async bank(gen, mid, seed, wait, sel) {
      window.__eduTest.showQuestion(gen, seed, mid);
      let q = null; for (let k = 0; k < 400; k++) { const x = window.__eduTest.question; if (x && x.genId === gen && x.seed === seed && window.__eduTest.screen === 'practice' && document.querySelector('[data-practice-next]')) { q = x; break; } await (k < 200 ? tick() : frames(1)); }
      if (!q) return { lost: true };
      window.scrollTo(0, 0); await painted();
      if (q.type === 'trace' || !btn('Check answer')) return { trace: true };
      const right = q.type === 'choice' ? [q.answer] : q.answer.split(' | ');
      const wrong = q.type === 'choice' ? [q.choices.find((c) => c !== q.answer)] : [...right].reverse();
      const res = {};
      for (const [tap, picks] of [['wrong', wrong], ['right', right]]) {
        for (const c of picks) { const b = [...document.querySelectorAll('button[data-choice]')].find((x) => x.getAttribute('data-choice') === c); if (b) b.click(); await tick(); }
        const row = document.querySelector('[data-practice-next]'); if (row && row.getBoundingClientRect().bottom > innerHeight + 4) row.scrollIntoView({ block: 'end' });
        const check = btn('Check answer'); if (!check) { res[tap] = { lost: true }; break; }
        // wait 'frames' (since round one's screen read): the first frame's state, then every frame to 1.3 seconds, the rooms against the first
        // frame's and the words under the cue in each frame where the feedback box has stopped moving.
        const each = wait === 'frames'; const t0 = performance.now(); check.click(); const how = wait && !each ? (await painted(), 'read') : await settle(t0, '[data-practice-next]', 'whole'); if (wait && !each) await new Promise((r) => setTimeout(r, wait));
        res[tap] = how === 'clear' ? { cue: false, words: [], others: [] } : await read(sel, '[data-practice-next]', 'whole');
        if (each && res[tap].cue) { const r0 = rooms(); let changes = 0; const restWords = new Set(); let restFrames = 0; const t1 = performance.now();
          while (performance.now() - t1 < 1300) { await frames(1); if (rooms() !== r0) changes += 1; const box = document.querySelector('[data-feedback]');
            if (box && !box.getAnimations().some((a) => a.playState === 'running')) { restFrames += 1; for (const w of under(sel).words) restWords.add(w); } }
          Object.assign(res[tap], { frameChanges: changes, restWords: [...restWords], restFrames, restRooms: rooms() }); }
        if (tap === 'wrong') { const again = btn('Try again'); if (again) again.click(); await tick(); await painted(); }
      }
      return res;
    },
  };
}
const readerSource = `(${reader.toString()})()`;

const browser = await chromium.launch();
const errors = []; const report = {}; const nd = { wrong: { read: 0, cue: 0, planted: 0 }, right: { read: 0, cue: 0, planted: 0 } };
let near = null; let nearPractice = null; const stable = []; const otherWords = new Map(); const overRooms = [];
// A lesson line's last word alone where it had company with no room: the wrap-whole verdict's rule, for the lines and for its plant.
const loneCaught = (x) => !!x.lone && !x.loneWithout;
for (const theme of ['light', 'dark']) {
  const ctx = await browser.newContext({ viewport: { width: 320, height: 568 }, hasTouch: true, reducedMotion: 'reduce' });
  await ctx.addInitScript((t) => { try { localStorage.setItem('edusphere_v1_theme', t); } catch (e) { /* no storage */ } }, theme);
  await ctx.addInitScript(readerSource);
  const page = await ctx.newPage(); page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
  await page.goto(new URL('./page.html', import.meta.url).href);
  const screenIs = (n) => page.waitForFunction((x) => window.__eduTest && window.__eduTest.screen === x, n, { timeout: 15000 });
  const tapIf = async (name) => { const b = page.getByRole('button', { name, exact: true }); if (await b.count()) { await b.first().click({ force: true }); await page.waitForTimeout(250); return true; } return false; };
  await screenIs('welcome');
  await page.getByRole('button', { name: 'Create account', exact: true }).first().click(); await screenIs('educator-setup');
  await page.fill('input[placeholder="PIN"]', '2468'); await page.fill('input[placeholder="PIN again"]', '2468'); await page.fill('input[placeholder="This device\'s name"]', 'Cue'); await page.selectOption('select[aria-label="Your state"]', 'TX');
  await page.getByRole('button', { name: 'Create account', exact: true }).click(); await screenIs('educator-pick'); await page.waitForTimeout(500);
  for (const n of ['Skip tour', 'Later', 'Got it']) await tapIf(n);
  // The lessons, in the educator's walk-through of the early years, as the fold check reads them: every line at each size.
  await page.getByLabel('Walk through early years').first().click({ force: true }); await screenIs('overview'); await page.waitForTimeout(400);
  for (const combo of COMBOS.filter((c) => c.theme === theme)) {
    await page.setViewportSize({ width: combo.w, height: combo.h }); await page.waitForTimeout(500);
    const r = report[combo.key] = { lines: 0, cueLines: 0, lineWords: [], linePlanted: [], lineMade: [], lineBack: [], lineLone: [], lineWhole: [], lost: [], screens: { wrong: 0, right: 0 }, cue: { wrong: 0, right: 0 }, words: { wrong: [], right: [] }, planted: { wrong: [], right: [] }, made: [], back: [], traces: 0 };
    let firstCue = null;
    for (const m of lessons) {
      await page.evaluate((id) => { window.scrollTo(0, 0); window.__eduTest.openModule(id); }, m.id); await screenIs('lesson');
      const lines = await page.evaluate(([n, sel]) => window.__cw.lesson(n, 0, sel), [m.lesson.script.length, LINE_WORDS]);
      for (const x of lines) {
        const key = `${m.id} line ${x.i + 1}`;
        if (x.lost) { r.lost.push(key); continue; }
        r.lines += 1; if (!x.cue) continue;
        r.cueLines += 1; if (!firstCue) firstCue = { id: m.id, i: x.i };
        if (x.words.length) r.lineWords.push(`${key}: ${x.words.join(' ')}`);
        for (const o of x.over || []) overRooms.push(`${combo.key} ${key}: ${o}`);
        if (x.planted.length) r.linePlanted.push(`${key}: ${x.planted.join(' ')}`);
        if (!x.stillWanted) r.lineMade.push(`${key}: Next ${x.hidden} below`);
        if (x.back !== x.rooms || x.after.join(' ') !== x.words.join(' ')) r.lineBack.push(key);
        if (loneCaught(x)) r.lineLone.push(`${key}: "${x.lone}" alone`);
        for (const w of x.whole || []) r.lineWhole.push(`${key}: "${w}"`);
        for (const w of x.others) otherWords.set(`${combo.key} ${key}`, w);
      }
    }
    // Read again 1.3 seconds after it opens: the first line with the cue, which must read the same (the cue decides as a line is drawn).
    if (firstCue) { await page.evaluate((id) => { window.scrollTo(0, 0); window.__eduTest.openModule(id); }, firstCue.id); await screenIs('lesson');
      const fast = await page.evaluate(([n, sel]) => window.__cw.lesson(n, 0, sel), [firstCue.i + 1, LINE_WORDS]); await page.evaluate((id) => { window.scrollTo(0, 0); window.__eduTest.openModule(id); }, firstCue.id); await screenIs('lesson');
      const slow = await page.evaluate(([n, sel]) => window.__cw.lesson(n, 1300, sel), [firstCue.i + 1, LINE_WORDS]);
      const a = fast[firstCue.i]; const b = slow[firstCue.i];
      stable.push({ where: `${combo.key} ${firstCue.id} line ${firstCue.i + 1}`, same: !!a && !!b && a.cue && b.cue && a.rooms === b.rooms && a.words.length === 0 && b.words.length === 0 });
      // The near misses, once in each theme, on that line at 320 by 568.
      if (combo.w === 320) { const n = await page.evaluate((sel) => window.__cw.nearMiss(sel), LINE_WORDS); near = { ...(near || {}), [theme]: n }; } }
    console.log(`${combo.key}: ${r.lines} lesson lines read, the cue on ${r.cueLines}, ${secs()} s`);
  }
  // The questions as a child sees them: a learner the educator adds, opened from the educator's own page (no stand-in notes).
  await page.setViewportSize({ width: 375, height: 667 }); await page.waitForTimeout(300);
  await page.evaluate(() => window.__eduTest.goHome()); await screenIs('educator-pick'); await page.waitForTimeout(400);
  for (const n of ['Skip tour', 'Later', 'Got it']) await tapIf(n);
  await page.getByRole('button', { name: 'Add someone new' }).first().click(); await page.waitForTimeout(300);
  await page.fill('input[placeholder="School-issued ID"]', 'C-1'); await page.getByRole('button', { name: /^Early years/ }).first().click(); await page.waitForTimeout(200);
  await page.getByRole('button', { name: 'Add', exact: true }).click(); await page.waitForTimeout(500); await tapIf('Later');
  await page.getByRole('button', { name: 'Home' }).first().click(); await page.waitForTimeout(500);
  await page.getByRole('button', { name: /C-1$/ }).first().click(); await page.waitForTimeout(900); await tapIf('Later');
  await screenIs('overview');
  for (const combo of COMBOS.filter((c) => c.theme === theme)) {
    const at = COMBOS.indexOf(combo); const r = report[combo.key];
    await page.setViewportSize({ width: combo.w, height: combo.h }); await page.waitForTimeout(500);
    let firstCue = null;
    for (let b = 0; b < banks.length; b++) {
      const g = banks[b]; const home = homeOf(g);
      for (let seed = 1; seed <= SEEDS; seed++) {
        if (!sampled(b, seed, at)) continue;
        const x = await page.evaluate(([gen, mid, s, sel]) => window.__cw.bank(gen, mid, s, 0, sel), [g, home.id, seed, FEEDBACK]);
        if (x.lost) { r.lost.push(`${g} seed ${seed}`); continue; }
        if (x.trace) { r.traces += 1; continue; }
        for (const tap of ['wrong', 'right']) {
          const s = x[tap]; if (!s || s.lost) { r.lost.push(`${g} seed ${seed} ${tap}`); continue; }
          r.screens[tap] += 1; if (!s.cue) continue;
          r.cue[tap] += 1; if (!firstCue) firstCue = { g, mid: home.id, seed };
          const key = `${g} seed ${seed}`;
          if (s.words.length) r.words[tap].push(`${key}: ${s.words.join(' ')}`);
          for (const o of s.over || []) overRooms.push(`${combo.key} ${key} ${tap}: ${o}`);
          if (s.planted.length) r.planted[tap].push(`${key}: ${s.planted.join(' ')}`);
          if (!s.stillWanted) r.made.push(`${key} ${tap}`);
          if (s.back !== s.rooms || s.after.join(' ') !== s.words.join(' ')) r.back.push(`${key} ${tap}`);
          for (const w of s.others) otherWords.set(`${combo.key} ${key} ${tap}`, w);
          if (ndBanks.has(g) && ((tap === 'wrong' && combo.w === 320) || (tap === 'right' && combo.w === 375))) { nd[tap].cue += 1; if (s.planted.length) nd[tap].planted += 1; }
        }
        if (ndBanks.has(g)) { if (combo.w === 320) nd.wrong.read += 1; else nd.right.read += 1; }
      }
    }
    // The first question with the cue, read again 1.3 seconds after each Check answer, must read the same; and the near misses once.
    if (firstCue) { const fast = await page.evaluate(([gen, mid, s, sel]) => window.__cw.bank(gen, mid, s, 0, sel), [firstCue.g, firstCue.mid, firstCue.seed, FEEDBACK]);
      const slow = await page.evaluate(([gen, mid, s, sel]) => window.__cw.bank(gen, mid, s, 1300, sel), [firstCue.g, firstCue.mid, firstCue.seed, FEEDBACK]);
      for (const tap of ['wrong', 'right']) { const a = fast[tap]; const b = slow[tap]; if (a && a.cue) stable.push({ where: `${combo.key} ${firstCue.g} seed ${firstCue.seed} ${tap}`, same: !!b && b.cue && a.rooms === b.rooms && a.words.length === 0 && b.words.length === 0 }); }
      if (nearPractice === null && combo.w === 320) nearPractice = await page.evaluate((sel) => window.__cw.nearMiss(sel), FEEDBACK); }
    console.log(`${combo.key}: ${r.screens.wrong} questions read after a wrong tap and ${r.screens.right} after the right one, the cue on ${r.cue.wrong} and ${r.cue.right}, ${secs()} s`);
  }
  await ctx.close();
}
// With motion on (a lesson card rises, a wrong tap's box wobbles, a right tap's box cheers): at 320 by 568 in the light theme, the first
// six lines with the cue and the first six questions with it after each tap, the room read two frames after each is drawn and again
// once it rests, 1.3 seconds later, must be the same, and no word may lie under the cue then.
const moving = []; let sayAgain = null; let lonePlant = null; const turned = []; let turnedPlant = null;
{ const ctx = await browser.newContext({ viewport: { width: 320, height: 568 }, hasTouch: true });
  await ctx.addInitScript(() => { try { localStorage.setItem('edusphere_v1_theme', 'light'); } catch (e) { /* no storage */ } });
  await ctx.addInitScript(readerSource);
  const page = await ctx.newPage(); page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
  await page.goto(new URL('./page.html', import.meta.url).href);
  const screenIs = (n) => page.waitForFunction((x) => window.__eduTest && window.__eduTest.screen === x, n, { timeout: 15000 });
  const tapIf = async (name) => { const b = page.getByRole('button', { name, exact: true }); if (await b.count()) { await b.first().click({ force: true }); await page.waitForTimeout(250); return true; } return false; };
  await screenIs('welcome');
  await page.getByRole('button', { name: 'Create account', exact: true }).first().click(); await screenIs('educator-setup');
  await page.fill('input[placeholder="PIN"]', '2468'); await page.fill('input[placeholder="PIN again"]', '2468'); await page.fill('input[placeholder="This device\'s name"]', 'Moving'); await page.selectOption('select[aria-label="Your state"]', 'TX');
  await page.getByRole('button', { name: 'Create account', exact: true }).click(); await screenIs('educator-pick'); await page.waitForTimeout(500);
  for (const n of ['Skip tour', 'Later', 'Got it']) await tapIf(n);
  await page.getByLabel('Walk through early years').first().click({ force: true }); await screenIs('overview'); await page.waitForTimeout(400);
  const cueLines = []; for (const m of lessons) { if (cueLines.length >= 6) break; const lines = await (async () => { await page.evaluate((id) => { window.scrollTo(0, 0); window.__eduTest.openModule(id); }, m.id); await screenIs('lesson'); return page.evaluate(([n, sel]) => window.__cw.lesson(n, 0, sel), [m.lesson.script.length, LINE_WORDS]); })();
    for (const x of lines) if (x.cue && cueLines.length < 6) cueLines.push({ id: m.id, i: x.i }); }
  for (const c of cueLines) {
    await page.evaluate((id) => { window.scrollTo(0, 0); window.__eduTest.openModule(id); }, c.id); await screenIs('lesson');
    const a = (await page.evaluate(([n, sel]) => window.__cw.lesson(n, 0, sel), [c.i + 1, LINE_WORDS]))[c.i];
    await page.waitForTimeout(1300); const b = await page.evaluate((sel) => ({ rooms: window.__cw.rooms(), ...window.__cw.under(sel) }), LINE_WORDS);
    moving.push({ where: `${c.id} line ${c.i + 1}`, first: a && a.rooms, rest: b.rooms, cue: b.cue, words: b.words });
  }
  // Since round two's code read: the wrap-whole verdict's plant, on these lines in turn until one is caught (loneRoomPlant, above): its
  // last two words parted and its room widened until its last word stands alone, where with no room it does not.
  for (const c of cueLines) { if (lonePlant && lonePlant.caught) break;
    await page.evaluate((id) => { window.scrollTo(0, 0); window.__eduTest.openModule(id); }, c.id); await screenIs('lesson');
    await page.evaluate(([n, sel]) => window.__cw.lesson(n, 0, sel), [c.i + 1, LINE_WORDS]);
    const p = await page.evaluate(() => window.__cw.loneRoomPlant());
    lonePlant = { where: `${c.id} line ${c.i + 1}`, ...(p || {}), caught: !!p && loneCaught({ lone: p.got && p.got.lone, loneWithout: p.without }) };
  }
  // Since round one's screen read each tap's feedback is read every frame from the tap to 1.3 seconds (bank's wait 'frames'): the first
  // frame's rooms against every later frame's, and the words under the cue in every frame once the box rests; the first frame against
  // 1.3 seconds later had missed the room lost while the box wobbled. The pass NE banks first, where the reader found it, then the rest.
  const g0 = [...banks.filter((g) => /^p4-(soe|wbs)-/.test(g)), ...banks.filter((g) => !/^p4-(soe|wbs)-/.test(g)).slice(0, 120)]; let found = 0;
  for (const g of g0) { if (found >= 6) break; const x = await page.evaluate(([gen, mid, sel]) => window.__cw.bank(gen, mid, 1, 'frames', sel), [g, homeOf(g).id, FEEDBACK]);
    if (!x.wrong || !x.wrong.cue) continue; found += 1;
    for (const tap of ['wrong', 'right']) if (x[tap] && x[tap].cue) moving.push({ where: `${g} seed 1 ${tap}`, first: x[tap].rooms, rest: x[tap].restRooms, cue: true, words: x[tap].restWords || ['(not read)'], changes: x[tap].frameChanges, restFrames: x[tap].restFrames }); }
  // 2. Say it again on a line whose strip keeps room (round one's screen read: the strip was drawn anew and lost its room under the finger).
  // The row brought into view as a finger must, the tap, a wheel back to the top; then the wrapper's room set to none, planted.
  for (const m of lessons.filter((x) => x.lesson.script.some((l) => /Let's say it together!/.test(l.say || '')))) { if (sayAgain) break; await page.evaluate((id) => { window.scrollTo(0, 0); window.__eduTest.openModule(id); }, m.id); await screenIs('lesson');
    const lines = await page.evaluate(([n, sel]) => window.__cw.lesson(n, 0, sel), [m.lesson.script.length, LINE_WORDS]);
    // The first strip with room whose big word lies under the cue with that room set to none (read before the tap), so the plant can
    // catch: the word stays while the call above it changes as the voice says the line again (a call caught at rest can be gone after).
    const strips = lines.filter((x) => x.cue && x.stripRoom && x.stripRoom !== '0px'); let at = null;
    for (const c of strips) { await page.evaluate((id) => { window.scrollTo(0, 0); window.__eduTest.openModule(id); }, m.id); await screenIs('lesson');
      await page.evaluate(([n, sel]) => window.__cw.lesson(n, 0, sel), [c.i + 1, LINE_WORDS]);
      const bare = await page.evaluate(() => { const s = document.querySelector('[data-say-along]'); const w = s && s.closest('[data-cue-room]'); if (!w) return []; const was = w.style.getPropertyValue('--cue-room'); w.style.setProperty('--cue-room', '0px'); const u = window.__cw.under('[data-say-along] [role="img"]').words; w.style.setProperty('--cue-room', was); return u; });
      if (bare.length) { at = c; break; } }
    if (!at) continue;
    const before = await page.evaluate(() => { const s = document.querySelector('[data-say-along]'); const w = s && s.closest('[data-cue-room]'); return w ? w.style.getPropertyValue('--cue-room') || '0px' : null; });
    await page.evaluate(() => document.querySelector('[data-lesson-nav]').scrollIntoView({ block: 'end' })); await page.waitForTimeout(300);
    await page.getByRole('button', { name: 'Say it again', exact: true }).first().click(); await page.waitForTimeout(500);
    await page.mouse.move(160, 200); await page.mouse.wheel(0, -3000); await page.waitForTimeout(700);
    const after = await page.evaluate(() => { const s = document.querySelector('[data-say-along]'); const w = s && s.closest('[data-cue-room]'); return { room: w ? w.style.getPropertyValue('--cue-room') || '0px' : null, top: Math.round(window.scrollY), ...window.__cw.under('[data-say-along]') }; });
    const planted = await page.evaluate(() => { const s = document.querySelector('[data-say-along]'); const w = s && s.closest('[data-cue-room]'); if (!w) return null; const was = w.style.getPropertyValue('--cue-room'); w.style.setProperty('--cue-room', '0px'); const u = window.__cw.under('[data-say-along] [role="img"]').words; w.style.setProperty('--cue-room', was); return u; });
    sayAgain = { where: `${m.id} line ${at.i + 1}`, before, after, planted }; }
  // 3. Since the third read: the page changed while the box moves. A first wrong tap at seed 1 of three of pass NE's banks, the phone
  //    turned to 568 by 320 200 ms after Check answer, while the box still wobbles, and every frame read to 1.5 seconds: once the box's
  //    animation has ended, the rooms change in the frame it rests (its own animation's end decides, edu-cue-check) and never after, and
  //    no word lies under the cue then. Plant: a capturing listener that stops edu-cue-check, so the room changes again at the 1,200 ms
  //    check, about 650 ms after the box stopped, caught.
  const turnRead = async (gen, stop) => {
    await page.setViewportSize({ width: 320, height: 568 }); await page.waitForTimeout(400);
    const ok = await page.evaluate(async ([gen, mid, FB, stop]) => {
      const cw = window.__cw; window.__turn = []; window.__turnDone = false;
      if (stop) { window.__turnStop = (e) => e.stopImmediatePropagation(); window.addEventListener('edu-cue-check', window.__turnStop, { capture: true }); }
      window.__eduTest.showQuestion(gen, 1, mid);
      let q = null; for (let k = 0; k < 400; k++) { const x = window.__eduTest.question; if (x && x.genId === gen && x.seed === 1 && window.__eduTest.screen === 'practice' && document.querySelector('[data-practice-next]')) { q = x; break; } await cw.frames(1); }
      if (!q) return 'lost'; window.scrollTo(0, 0); await cw.frames(2);
      const c = q.choices.find((x) => x !== q.answer); const b = [...document.querySelectorAll('button[data-choice]')].find((x) => x.getAttribute('data-choice') === c); if (!b) return 'no choice'; b.click(); await cw.frames(1);
      const row = document.querySelector('[data-practice-next]'); if (row && row.getBoundingClientRect().bottom > innerHeight + 4) row.scrollIntoView({ block: 'end' });
      const check = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Check answer'); if (!check) return 'no check';
      const t0 = performance.now(); window.__t0 = t0; check.click();
      (async () => { while (performance.now() - t0 < 1500) { await cw.frames(1); const box = document.querySelector('[data-feedback]'); const moves = !!box && box.getAnimations().some((a) => a.playState === 'running'); const u = cw.under(FB);
        window.__turn.push({ t: Math.round(performance.now() - t0), moves, cue: u.cue, words: u.words, rooms: cw.rooms() }); }
        if (window.__turnStop) { window.removeEventListener('edu-cue-check', window.__turnStop, { capture: true }); delete window.__turnStop; }
        window.__turnDone = true; })();
      return 'ok'; }, [gen, homeOf(gen).id, FEEDBACK, stop]);
    if (ok !== 'ok') return { gen, ok };
    await page.waitForFunction(() => performance.now() - window.__t0 >= 200, null, { timeout: 5000 }); await page.setViewportSize({ width: 568, height: 320 });
    await page.waitForFunction(() => window.__turnDone, null, { timeout: 8000 });
    const s = await page.evaluate(() => window.__turn);
    const restAt = (s.find((x) => !x.moves && x.t > 100) || {}).t;
    const after = restAt === undefined ? [] : s.filter((x) => x.t > restAt);
    return { gen, ok, restAt, frames: s.length, wobbled: s.some((x) => x.moves), changes: after.filter((x, i) => x.rooms !== (i ? after[i - 1] : s.find((y) => y.t === restAt)).rooms).map((x) => `${x.t} ms: ${x.rooms}`), under: after.filter((x) => x.cue && x.words.length).map((x) => `${x.t} ms: ${x.words.join(' ')}`) };
  };
  for (const gen of ['p4-soe-first', 'p4-soe-yesno', 'p4-wbs-first']) turned.push(await turnRead(gen, false));
  turnedPlant = await turnRead('p4-soe-first', true);
  await page.setViewportSize({ width: 320, height: 568 });
  await ctx.close(); }
await browser.close();

// The verdicts.
for (const combo of COMBOS) {
  const r = report[combo.key];
  ok(`no word of a lesson line, or of its say-along strip, lies under the scroll cue at ${combo.key} in the ${combo.theme} theme (${r.lines} lines of ${lessons.length} lessons read at the top of the page as each opens, each its own dot lit; the cue on ${r.cueLines}, words under it on ${r.lineWords.length})`,
    r.lineWords.length === 0 && r.lost.filter((k) => / line /.test(k)).length === 0 && (!pin || (r.lines >= FLOORS.lines && (FLOORS.cueLines[combo.key] === 0 ? r.cueLines === 0 : r.cueLines >= FLOORS.cueLines[combo.key]))), { words: r.lineWords.slice(0, 8), lost: r.lost.slice(0, 4), lines: r.lines, cue: r.cueLines, floors: [FLOORS.lines, FLOORS.cueLines[combo.key]] });
  for (const tap of ['wrong', 'right']) {
    ok(`no word of the feedback box lies under the scroll cue after ${tap === 'wrong' ? 'a first wrong tap' : 'the right tap'} at ${combo.key} in the ${combo.theme} theme (${r.screens[tap]} questions read${FULL ? ', every bank at seeds 1 to 6' : ', every bank at its seeds in turn'}; the cue on ${r.cue[tap]}, words under it on ${r.words[tap].length})`,
      r.words[tap].length === 0 && (!pin || (r.screens[tap] >= FLOORS.screens[combo.key] && r.cue[tap] >= FLOORS.cueScreens[tap][combo.key])), { words: r.words[tap].slice(0, 8), screens: r.screens[tap], cue: r.cue[tap], floors: [FLOORS.screens[combo.key], FLOORS.cueScreens[tap][combo.key]] });
  }
  ok(`at ${combo.key} in the ${combo.theme} theme no lesson line or question was lost along the way, and the tracing banks with no Check answer were passed over (${r.traces})`, r.lost.length === 0 && (!pin || r.traces > 0), r.lost.slice(0, 6));
}
const all = (f) => COMBOS.flatMap((c) => f(report[c.key]));
const plantedLines = Object.fromEntries(COMBOS.map((c) => [c.key, report[c.key].linePlanted.length]));
const plantedScreens = { wrong: all((r) => r.planted.wrong).length, right: all((r) => r.planted.right).length };
const plantedEach = COMBOS.map((c) => `${c.key} ${report[c.key].planted.wrong.length} and ${report[c.key].planted.right.length}`).join(', ');
ok(`with the fix undone in the page (every block's room set back to none, its wrap chosen again), words lie under the cue on ${plantedLines['light 320 by 568']} lesson lines at 320 by 568 in the light theme and ${plantedLines['dark 320 by 568']} in the dark, on ${plantedScreens.wrong} questions after a first wrong tap and ${plantedScreens.right} after the right one in the four (${plantedEach})${FULL ? `; on pass ND's own banks after a first wrong tap at 320 by 568 on ${nd.wrong.planted} of ${nd.wrong.read} questions, and after the right tap at 375 by 667 on ${nd.right.planted} of ${nd.right.read} (the earmark: 25 and 19 of 150, 5 and 10)` : ''}: the plant is caught`,
  !pin || (plantedLines['light 320 by 568'] >= PLANT_FLOORS.lines['light 320 by 568'] && plantedLines['dark 320 by 568'] >= PLANT_FLOORS.lines['dark 320 by 568'] && plantedScreens.wrong >= PLANT_FLOORS.wrong && plantedScreens.right >= PLANT_FLOORS.right), { plantedLines, plantedScreens, floors: PLANT_FLOORS, nd: FULL ? nd : undefined });
ok('the room comes back whole when the plant is taken away: every block its room again, and the words under the cue as before the plant', all((r) => [...r.lineBack, ...r.back]).length === 0, all((r) => [...r.lineBack, ...r.back]).slice(0, 8));
ok(`the room keeps a lesson line's wrap whole: on every line where the cue shows, its last word never left alone where it had company without the room (EARMARKS A82), and every speech part kept whole on one line inside its paragraph (since round two's code read a line's last two words parted and its room widened until its last word stood alone, planted, caught${lonePlant && lonePlant.got ? `: ${lonePlant.where}, "${lonePlant.got.lone}" alone at ${lonePlant.got.room} pixels` : ''})`, all((r) => [...r.lineLone, ...r.lineWhole]).length === 0 && ((!pin && !lonePlant) || (!!lonePlant && lonePlant.caught && lonePlant.back)), { found: all((r) => [...r.lineLone, ...r.lineWhole]).slice(0, 8), lonePlant });
ok('the room never makes the cue: wherever the cue shows, with the room undone its own rule still shows it (a lesson\'s Next more than a third below the screen, or any of a practice row below it)', all((r) => [...r.lineMade, ...r.made]).length === 0, all((r) => [...r.lineMade, ...r.made]).slice(0, 8));
ok(`a word just clear of the cue passes and one pixel inside it is caught, at its left edge and at its top, on a lesson line in each theme and on a feedback box (${JSON.stringify({ ...near, practice: nearPractice })})`,
  ['light', 'dark'].every((t) => (!pin && !(near && near[t])) || (near && near[t] && near[t].leftClear && near[t].leftIn && near[t].topClear && near[t].topIn)) && ((!pin && !nearPractice) || (!!nearPractice && nearPractice.leftClear && nearPractice.leftIn && nearPractice.topClear && nearPractice.topIn)), { near, nearPractice });
ok(`the cue decides as a state is drawn: the first line and the first question with the cue in each part read the same 1.3 seconds later, the same room and no word under the cue (${stable.length} read again)`, (!pin || stable.length >= 8) && stable.every((s) => s.same), stable.filter((s) => !s.same));
ok(`with motion on, the room chosen as a lesson line or a feedback box is first drawn is the room it keeps once it rests, and no word lies under the cue then (${moving.length} read at 320 by 568 in the light theme; since round one's screen read each tap's feedback read every frame to 1.3 seconds, no room changing after the first frame and no word under the cue once the box rests)`, (!pin || moving.length >= 10) && moving.every((x) => x.cue && x.first === x.rest && x.words.length === 0 && !(x.changes > 0) && (x.restFrames === undefined || x.restFrames > 0)), moving.filter((x) => !(x.cue && x.first === x.rest && x.words.length === 0 && !(x.changes > 0) && (x.restFrames === undefined || x.restFrames > 0))).slice(0, 6));
ok(`Say it again keeps the say-along strip's room for the cue: the row brought into view, the tap and a wheel back to the top, and no word of the strip under the cue (round one's screen read; ${sayAgain ? sayAgain.where + ', room ' + sayAgain.before + ' and then ' + sayAgain.after.room : 'no strip with room found'}; the strip's room set to none, planted, caught: ${sayAgain && sayAgain.planted ? sayAgain.planted.join(' ') : 'none'})`, (!pin && !sayAgain) || (!!sayAgain && sayAgain.after.cue && sayAgain.after.top < 4 && sayAgain.after.room === sayAgain.before && sayAgain.after.words.length === 0 && !!sayAgain.planted && sayAgain.planted.length > 0), sayAgain);
ok(`a page that changes while a feedback box moves leaves its lines still once the box rests: the phone turned 200 ms after a first wrong tap on ${turned.map((x) => x.gen).join(', ')}, every frame read to 1.5 seconds, no room changing after the box rests and no word under the cue then (the third read; edu-cue-check stopped, planted, caught: ${turnedPlant && turnedPlant.changes ? turnedPlant.changes.join('; ') : 'not read'})`,
  (!pin && !turned.length) || (turned.length === 3 && turned.every((x) => x.ok === 'ok' && x.wobbled && x.restAt !== undefined && x.changes.length === 0 && x.under.length === 0) && !!turnedPlant && turnedPlant.ok === 'ok' && turnedPlant.changes.length > 0), { turned, turnedPlant });
ok(`every block's room is at most what the cue needs, how far its words reach into the cue's corner and its gap (round one's screen read: the lone-word guard grew rooms to two fifths of a line; ${overRooms.length} over)`, overRooms.length === 0, overRooms.slice(0, 8));
ok('no page error while the lines and questions were shown', errors.length === 0, errors.slice(0, 3));
if (otherWords.size) console.log(`NOTE - words outside the lesson line and the feedback box lie under the cue on ${otherWords.size} screens (the question or its answers; not this check's), first: ${[...otherWords].slice(0, 6).map(([k, w]) => `${k}: ${w}`).join('; ')}`);
console.log(`cue-words took ${secs()} s`);
console.log(`\n${passed} passed, ${failed} failed`);
process.exitCode = failed ? 1 : 0;
