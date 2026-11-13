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
// Since pass NF it reads more (EARMARKS A99 and A103):
// - every read-aloud course's lesson lines, not pre-K's alone: kindergarten's, grade 1's and grade 2's two read-aloud courses' too, every
//   line at both sizes in both themes (a line is quick to read, so none is sampled), the cue's floors counted for pre-K and for the rest;
// - the say-along word's size: on every strip that keeps room for the cue, the word is its full size, 9vw up to 32 pixels, wherever it
//   fits whole in the strip beside the cue, and a word wider than that fills it within 3 pixels (A103: it had given up 0.12 of a pixel
//   for each pixel of room even where it fitted, teacher 28.8 pixels to 24.4); the old rule put back in the page is planted and caught,
//   and the band is pinned on both sides on one strip, its room set so the word is half a pixel narrower than its box (it keeps its
//   size) and then a pixel wider (it shrinks and fits);
// - the story page (A99): every early-years story's page (each lesson story of a read-aloud course, pre-K to grade 2) and every read-aloud
//   course's long stories, with no voice, where the cue shows as the page opens and stays, at both sizes in both themes, no word of the
//   story under the cue (before the fix words lay under it on 150 of the 257 lesson stories at 320 by 568 and 78 at 375 by 667); the room
//   undone is planted and caught at about those counts; and with the voice on, a few stories whose voice leaves the cue showing when it
//   ends, read where the voice leaves the page;
// - the question before a pick (A99): every pre-K bank's question as it opens, read with its seeds as the feedback is, no word under the
//   cue that shows before a pick, with a near miss on the printed question.
// Run: node tests/e2e/make-page.mjs && node tests/e2e/cue-words.mjs
import { createRequire } from 'node:module'; import { execSync } from 'node:child_process';
const G = execSync('npm root -g').toString().trim(); const { chromium } = createRequire(import.meta.url)(`${G}/playwright`);
const L = await import('../../src/logic.mjs'); const S = await import('../../src/stories.mjs');
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
// Since pass NF (EARMARKS A99) a read-aloud story page's words: every word of its sheet, the title, the paragraphs and any caption.
const STORY_WORDS = '[data-read-aloud-story]';
// The stories read with the voice on (pass NF): lesson stories whose voice, read to its end at 320 by 568, leaves the cue showing, the
// page having followed the voice down to the last paragraph (in both themes when this was written), read where the voice leaves it. Three
// named of the 27 the scroll-cue engineer found so in one read of every story's end at 320 by 568 in the light theme (no word under the cue
// on any), since reading every story to its end would add about four minutes a run (round one's screen read).
const VOICE_END = ['more-or-fewer', 'sounds-in-a-word', 'earning-money-k'];
// Since round one's screen read (pass NF): the stories read while they read themselves, Bear hides and A card for Dad.
const VOICED_ROOM = ['hear-it-in-a-word', 'look-and-write'];
// The counts the code has, floors as the fold check's are (pass NE, read when this check was written): lines read in each pair (1102
// lines of 104 lessons), lines where the cue shows (48 at 320 by 568 in each theme since round two, 46 when it was written, none at 375 by 667, where the fold check holds every
// line's Next above the fold), questions read in each pair and where the cue shows after each tap. A lesson or a bank added raises a
// count and its floor follows in the same pass; a layout that moves a Next or a row moves a cue's count, and its floor follows that too.
// Since pass NF the floors are pass NF's counts: its lessons and banks (A104's words among them) brought the pre-K lines to 1130 and the
// questions read to 657 to 660, and the lines of every other read-aloud course are read too, so the lines and their cue are counted for
// pre-K and for the rest apart, and the pre-K cue at 375 by 667 stays a ceiling of none, which the fold check holds as well.
// Since pass NI (round two's whole read of RULES-AUDIT, which found them still pass NF's) the floors are pass NI's counts, read in three
// whole runs, the last two after round two's fixes (the third read's card change is on a screen with no voice, which this test does not read): its two lessons bring the pre-K lines to 1157, the questions read to 673 and 674 and
// the states the reach reads to 2954 and 3017 (2953 and 3016 in the first run, before round two's words); every count the same in both.
const FLOORS = {
  lines: { preK: 1157, rest: 1158 },
  // Pre-K at 375 by 667 none, a ceiling as well as a floor (round one's code read: a verdict that read no line could not fail).
  // Since round two's code read (pass NF) the states the reach reads in each theme are the counts the code has (they were held only above
  // 1,000; 2,895 in the light theme on round two's copy, 2,896 since round two's fixes), and the held stories read for the put-back are the
  // five lesson stories held at light 320 by 568.
  reach: { light: 2954, dark: 3017 }, putBacks: 5,
  cueLines: { preK: { 'light 320 by 568': 48, 'light 375 by 667': 0, 'dark 320 by 568': 48, 'dark 375 by 667': 0 }, rest: { 'light 320 by 568': 92, 'light 375 by 667': 0, 'dark 320 by 568': 106, 'dark 375 by 667': 0 } },
  screens: { 'light 320 by 568': 673, 'light 375 by 667': 673, 'dark 320 by 568': 674, 'dark 375 by 667': 674 },
  // The cue after a first wrong tap at 320 by 568 in the light theme was on 477 questions in one whole run of pass NF's copy and 479 in
  // three, so its floor is the lower.
  cueScreens: { wrong: { 'light 320 by 568': 489, 'light 375 by 667': 106, 'dark 320 by 568': 514, 'dark 375 by 667': 114 }, right: { 'light 320 by 568': 594, 'light 375 by 667': 298, 'dark 320 by 568': 602, 'dark 375 by 667': 298 } },
  // Since pass NF: the cue before a pick, the strips that keep room for the cue, the story pages read and those where the cue shows.
  pick: { 'light 320 by 568': 8, 'light 375 by 667': 0, 'dark 320 by 568': 13, 'dark 375 by 667': 0 },
  strips: { 'light 320 by 568': 9, 'light 375 by 667': 0, 'dark 320 by 568': 11, 'dark 375 by 667': 0 },
  // 275 on the merged copy, pass NF's two new lessons' stories with them (273 on the engineer's copy).
  stories: 277, storyCue: { 'light 320 by 568': 277, 'light 375 by 667': 277, 'dark 320 by 568': 277, 'dark 375 by 667': 277 },
  // The lines whose last two words are over 18 letters and spaces (A103 (c)).
  longPairs: 5,
};
// A floor of 0 is a ceiling as well (round one's code read, pass NF): at 375 by 667 the say-along strips that keep room, the cue before a
// pick and the cue on the other courses' lines read none, and a verdict that reads nothing there may not pass as a floor of none, as
// pre-K's lines at that size have held since pass NE (preKCueOk).
const zeroOr = (n, f) => (f === 0 ? n === 0 : n >= f);
// The plant's floors: with the fix undone, the lines and questions it finds words under the cue on, as many as the code before the fix
// had (pass NE: 22 lines at 320 by 568 in the light theme and 21 in the dark; 247 questions after a first wrong tap and 192 after the
// right one in the four, 191 since round one's code read changed the picture bank's draw), so a plant that stops finding them fails.
// Since round one's screen read a line's last two words are held together, so a pair moves to the last line with the room undone: 21 and 20.
// Since pass NF the counts its code has: pass NF's lessons and banks put pre-K's lines at 22 and 21 and the questions at 261 and 188 (the
// floor of 191 failed on pass NF's own copy before this pass's changes, 188 found), and the other courses' lines, the say-along words
// that fit beside the cue and the story pages are planted too.
// The other courses' lines planted are pass NE's own fix undone where no check read it (64 and 81 lines at 320 by 568); the say-along words
// planted are those that fit whole beside the cue (8 and 10), and the story pages planted are the pages with a word under the cue before
// pass NF, the lesson stories' 150 and 78 with the long stories' 16 and 14; on the merged copy, with pass NF's two new stories, 168 and 94.
// After a first wrong tap the merged copy's plant found 260 questions (131 at dark 320 by 568), where the engineer's copy, made before
// round one's content fixes, found 261 in four runs (132 there): round one's fixes changed 12 of the 671 questions read at dark 320 by 568
// (in Look and write's, Write it by its sounds' and Hear it in a word's banks), and the plant then finds 131 where it found 132 (round one's
// screen read: the cue's own count after a first wrong tap, 477 in pass NE's build, has read 479 in every run since).
// Since pass NI the plants' floors are its counts too, the same in its three runs: 268 questions after a first wrong tap and 194 after the
// right one, and 169 and 96 story pages in each theme, its two lessons' stories among them.
const PLANT_FLOORS = { lines: { 'light 320 by 568': 22, 'dark 320 by 568': 21 }, restLines: { 'light 320 by 568': 64, 'dark 320 by 568': 81 }, wrong: 268, right: 194, words: { 'light 320 by 568': 8, 'dark 320 by 568': 10 }, stories: { 'light 320 by 568': 169, 'light 375 by 667': 96, 'dark 320 by 568': 169, 'dark 375 by 667': 96 } };
// CUE_WORDS_ONLY=<lesson ids, comma-separated> reads only those lessons and their banks, for a focused look; it pins no floor.
const ONLY = (process.env.CUE_WORDS_ONLY || '').split(',').map((x) => x.trim()).filter(Boolean);
const early = L.COURSES.filter((c) => (c.grade === 'PK3' || c.grade === 'PK4') && c.readAloud);
// Since pass NF the lines of every read-aloud course, pre-K's first, each line as the screen draws it (readAloudScript).
const readAloud = [...early, ...L.COURSES.filter((c) => c.readAloud && !early.includes(c))];
const preKIds = new Set(early.flatMap((c) => c.modules).map((m) => m.id));
const lessons = readAloud.flatMap((c) => c.modules).filter((m) => m.lesson && L.readAloudScript(m).length && (!ONLY.length || ONLY.includes(m.id)));
const banks = [...new Set(early.flatMap((c) => c.modules).filter((m) => !ONLY.length || ONLY.includes(m.id)).flatMap((m) => m.generators))];
// Since pass NF the story pages: every lesson story of a read-aloud course and every long story of one, as the shelf opens them.
const stories = [...readAloud.flatMap((c) => c.modules).filter((m) => S.storyFor(m.id) && (!ONLY.length || ONLY.includes(m.id))).map((m) => ({ id: m.id, part: null })),
  ...(ONLY.length ? [] : readAloud.flatMap((c) => ['course', 'mastery'].filter((part) => S.longStoryFor(`${part}:${c.id}`)).map((part) => ({ id: c.id, part }))))];
// Since pass NF (EARMARKS A103 (c)) the lesson lines whose last two words are over 18 letters and spaces together (a line's own sentences,
// as the screen draws them, a say-along's left to its strip), the sizes they are read at, and the line that may end on one word alone, by
// lesson and line, with its reason: Open number lines' sixth ends on "seventy-three." at every width, and holding "before seventy-three."
// (21) left "comes" alone on the row above at every width and ran past the line beside the cue at 320 by 568 (lastTwoTogether in ui.jsx).
const sentencesOf = (text) => String(text || '').split(L.SENTENCE_BREAK).filter(Boolean);
const LONG_PAIRS = readAloud.flatMap((c) => c.modules).filter((m) => m.lesson).flatMap((m) => L.readAloudScript(m).map((step, i) => {
  const parts = L.sayAlongParts(sentencesOf(step.say)); const own = sentencesOf(step.say).filter((_, k) => !parts[k] || parts[k].role === 'say');
  const mm = /(\S+) (\S+)$/.exec((own[own.length - 1] || '').trim()); return mm && mm[1].length + mm[2].length + 1 > 18 ? { id: m.id, i } : null; }).filter(Boolean));
const PAIR_SIZES = [[320, 800], [340, 800], [360, 800], [375, 800], [390, 800], [412, 800], [320, 568], [375, 667]];
const LONE_KEPT = { 'open-number-lines 6': 'seventy-three.' };
const pairReads = [];
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
  // Since pass NF the words of a question before a pick: its setup, its printed question and its answers (a drawing's own words too).
  const PICK = '[data-question-setup], [data-question-text], button[data-choice]';
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
  // The cue's own rule, read on the page as it stands: a lesson's Next more than a third below, or any of a practice row below by 4 pixels,
  // and since pass NF a story's arrow with less than 24 pixels of it on the screen ('top', the cue's rule with neither whole nor hidden).
  const wants = (target, rule) => { const el = document.querySelector(target); if (!el) return null; const r = el.getBoundingClientRect();
    return rule === 'whole' ? r.bottom > innerHeight + 4 : rule === 'top' ? r.top > innerHeight - 24 : r.bottom - innerHeight > r.height / 3; };
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
  // Since pass NF (EARMARKS A103) the say-along word on a strip that keeps room for the cue: its size as drawn (its font, and its box drawn
  // at its laid-out width, so no transform hides a smaller word), its full size (9vw up to 32 pixels), its width, its box (the strip less
  // the room) and its width at full size, worked out from its width now, since only its letters scale (each syllable keeps a pixel of
  // padding at each side).
  const sayWord = () => { const s = document.querySelector('[data-say-along]'); const w = s && s.querySelector('p[role="img"]'); const holder = s && s.closest('[data-cue-room]');
    if (!w || !holder) return null; const room = parseFloat(holder.style.getPropertyValue('--cue-room')) || 0;
    const r = document.createRange(); r.selectNodeContents(w); const width = r.getBoundingClientRect().width; const font = parseFloat(getComputedStyle(w).fontSize);
    const full = Math.min(32, innerWidth * 0.09); const sides = 2 * w.children.length; const natural = (width - sides) * (full / font) + sides;
    return { word: s.getAttribute('data-say-along'), room, font, full, width, box: w.clientWidth, natural, scale: w.offsetWidth ? w.getBoundingClientRect().width / w.offsetWidth : 1 }; };
  // The plant for it: the rule before pass NF put back in the page (the word gives up 0.12 of a pixel for each pixel of room), read, and
  // taken away.
  const oldWord = () => { const s = document.createElement('style'); s.id = 'word-plant'; s.textContent = '[data-say-along] p[role="img"] { font-size: min(32px, 9vw - var(--cue-room, 0px) * 0.12) !important; }'; document.head.appendChild(s);
    const got = sayWord(); s.remove(); return got; };
  // One state read: the cue, the words under it, and with the room undone the words under it and whether the cue's rule still shows it.
  // Text fitted to its box (FitText: a print picture) fits itself again a frame after its box changes, so where a block holds any, the
  // plant's read and the read after it wait for that frame.
  const read = async (sel, target, rule) => {
    reach(); const now = under(sel); const st = { cue: now.cue, words: now.words, others: now.cue ? others(sel) : [], rooms: rooms(), over: now.cue ? overRoom() : [] };
    if (now.cue) {
      const fitted = !!document.querySelector('[data-cue-room] [data-fit-text]');
      if (rule === 'third') { st.lone = lone(); st.whole = whole(); }
      // Since pass NF a say-along word on a strip with room, and the same word under the rule before pass NF (planted).
      if (rule === 'third') { const w = sayWord(); if (w && w.room > 0) { st.word = w; st.wordPlanted = oldWord(); } }
      if (rule === 'top') st.pairs = storyPairs();   // a story page (round one's screen read, pass NF)
      plant(true); if (fitted) await painted(); st.planted = under(sel).words; st.stillWanted = wants(target, rule); if (rule === 'third') st.loneWithout = lone();
      plant(false); if (fitted) await painted(); st.back = rooms(); st.after = under(sel).words;
    }
    return st;
  };
  // Since pass NF (round one's code read): how far a block's words reach above its top or below its foot, at rest. keepCueRoom passes over a
  // block more than 40 pixels above or below the cue before reading its words (src/ui.jsx), which keeps every word it could need only while
  // no word reaches 40 pixels past its block's top or foot; every state read measures every block that keeps room, the largest kept with
  // where it was, and its near misses put a word 39 pixels and then 41 pixels below a block's foot.
  const reachOf = (el) => { const r = el.getBoundingClientRect(); let most = -Infinity; const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let t;
    while ((t = walk.nextNode())) for (const m of t.textContent.matchAll(/\S+/g)) { const g = document.createRange(); g.setStart(t, m.index); g.setEnd(t, m.index + m[0].length);
      for (const q of g.getClientRects()) if (q.width > 0 && q.height > 0) most = Math.max(most, r.top - q.top, q.bottom - r.bottom); }
    return most; };
  const reach = () => { let best = null; for (const el of document.querySelectorAll('[data-cue-room]')) { const v = reachOf(el); if (v > -Infinity && (!best || v > best.v)) best = { v: Math.round(v * 10) / 10, where: `${el.hasAttribute('data-story-par') ? 'a story paragraph' : el.hasAttribute('data-lesson-words') ? 'a lesson line' : el.querySelector('[data-say-along]') ? 'a say-along strip' : 'a feedback block'} on ${(window.__eduTest && window.__eduTest.screen) || '?'}` }; }
    if (best) { window.__cwReachN = (window.__cwReachN || 0) + 1; const seen = window.__cwReach; if (!seen || best.v > seen.v) window.__cwReach = best; } };
  const reachNear = () => { const el = [...document.querySelectorAll('[data-cue-room]')].find((b) => b.textContent.trim()); if (!el) return null;
    const s = document.createElement('span'); s.setAttribute('data-near-miss', ''); s.textContent = 'reach'; s.style.cssText = 'position: fixed; left: 0px; top: 0px; white-space: nowrap; font-size: 20px; line-height: 1;'; el.appendChild(s);
    const at = (below) => { s.style.top = '0px'; const g = document.createRange(); g.selectNodeContents(s.firstChild); const b = g.getClientRects()[0]; s.style.top = `${el.getBoundingClientRect().bottom + below - b.bottom}px`; return Math.round(reachOf(el) * 10) / 10; };
    const inside = at(39); const past = at(41); s.remove(); return { inside, past }; };
  // Since round one's screen read (pass NF): a story paragraph beside the cue never ends on one word alone where it had company without the
  // room (holdStoryPair in ui.jsx): each paragraph with room read for a lone last word, and each that holds a pair read with its text put
  // back as it was (the hold undone), which must leave its last word alone, and the hold put back.
  const rowAlone = (el) => { const tops = []; const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let t;
    while ((t = walk.nextNode())) for (const m of t.textContent.matchAll(/\S+/g)) { const r = document.createRange(); r.setStart(t, m.index); r.setEnd(t, m.index + m[0].length); const q = r.getClientRects()[0]; if (q) tops.push([q.top, m[0]]); }
    if (tops.length < 2) return ''; const last = tops[tops.length - 1][0]; const on = tops.filter(([y]) => Math.abs(y - last) <= 4); return on.length === 1 ? on[0][1] : ''; };
  const storyPairs = () => { const lone = []; const held = []; const caught = [];
    for (const p of document.querySelectorAll('[data-story-par]')) { if (!(parseFloat(p.style.getPropertyValue('--cue-room')) || 0)) continue;
      // A last word that is alone with no room too wraps as before, so a paragraph counts only where its room set back to none gives the
      // word company.
      const w = rowAlone(p); if (w) { const was = p.style.getPropertyValue('--cue-room'); p.style.setProperty('--cue-room', '0px'); const alone0 = rowAlone(p); p.style.setProperty('--cue-room', was); if (!alone0) lone.push(w); }
      const h = p.__cuePair; if (!h || !h.node.isConnected || h.node.textContent !== h.held) continue; held.push(p.getAttribute('data-story-par'));
      h.node.textContent = h.original; const without = rowAlone(p); h.node.textContent = h.held; if (without) caught.push(without); }
    return { lone, held, caught }; };
  const heldNow = () => [...document.querySelectorAll('[data-story-par]')].filter((p) => p.__cuePair && p.__cuePair.node.isConnected && p.__cuePair.node.textContent === p.__cuePair.held).map((p) => p.getAttribute('data-story-par')).join(' ');
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
    frames, read, nearMiss, rooms, under, reachNear, heldNow,
    // Since round one's screen read (pass NF): a story reading itself keeps no room. Opened as the shelf opens it with the voice on, read
    // 200 ms after it opens (inside StoryBody's 400 ms start window: no cue drawn and every room none) and two seconds into its reading.
    async storyReading(id, sel) {
      window.scrollTo(0, 0); const t0 = performance.now(); window.__eduTest.openStory(id);
      const sp = () => document.querySelector(`${sel} button[aria-label="Stop reading"]`);
      while (performance.now() - t0 < 200) await frames(1); const early = { cue: !!cueEl(), rooms: rooms() };
      let began = false; while (performance.now() - t0 < 4000) { await frames(1); if (sp()) { began = true; break; } }
      const t1 = performance.now(); while (performance.now() - t1 < 2000) await frames(1);
      return { began, early, reading: { cue: !!cueEl(), rooms: rooms(), still: !!sp() } };
    },
    // Since chain5 (pass NF): a reading stopped at the page's top, where the cue comes back and keeps room as on a page opened with no
    // voice, and begun again by a tap. Opened as the shelf opens it with the voice on, Stop reading tapped once the reading begins, the
    // cue and its room waited for (up to 1.5 seconds), and then the tap read as below.
    // Since round two's code read (pass NF): a held story's rooms and holds put back by the cue's own check. The page at rest, scrolled by
    // code to its foot (no touch, wheel, key or pointer, so the page's rooms may be decided again), the cue's own edu-cue-check sent there,
    // where the cue does not show and the check puts back the rooms as they stood, with their holds (ScrollCue's put-back), and scrolled
    // back to the top: the same rooms and holds as at rest, and no last word alone. Its plant, on the first: the same with the holds undone
    // at the foot after the check, as if the put-back gave back the room without its hold, read, caught, and the holds put back.
    async storyPutBack(plantIt) {
      const run = async (plant) => { const at = { rooms: rooms(), held: heldNow() };
        window.scrollTo(0, document.scrollingElement.scrollHeight); await frames(2); await painted(); const footCue = !!cueEl();
        window.dispatchEvent(new Event('edu-cue-check')); await frames(1); await painted(); const foot = { rooms: rooms(), held: heldNow() };
        const undone = []; if (plant) for (const p of document.querySelectorAll('[data-story-par]')) { const h = p.__cuePair; if (h && h.node.isConnected && h.node.textContent === h.held) { h.node.textContent = h.original; p.__cuePair = null; undone.push([p, h]); } }
        window.scrollTo(0, 0); await frames(2); await painted(); const back = { rooms: rooms(), held: heldNow(), cue: !!cueEl(), lone: storyPairs().lone };
        for (const [p, h] of undone) { h.node.textContent = h.held; p.__cuePair = h; } return { at, footCue, foot, back, undone: undone.length }; };
      const read = await run(false); return plantIt ? { ...read, planted: await run(true) } : read;
    },
    async storyStopTap(id, sel, plantIt) {
      window.scrollTo(0, 0); window.__eduTest.openStory(id); const t0 = performance.now();
      const sp = () => document.querySelector(`${sel} button[aria-label="Stop reading"]`); const anyRoom = (s) => String(s || '').split(' ').some((x) => x && x !== '0px');
      let began = false; while (performance.now() - t0 < 4000) { await frames(1); if (sp()) { began = true; break; } }
      if (!began) return { lost: true, before: { cue: !!cueEl(), rooms: rooms() } };
      sp().click(); const t1 = performance.now();
      while (performance.now() - t1 < 1500) { await frames(1); if (cueEl() && anyRoom(rooms())) break; }
      await painted(); return window.__cw.storyTapRead(sel, plantIt);
    },
    // And a reading begun by a tap where the cue had kept room: after a story's voice has ended (storyVoiced), the cue and its rooms read,
    // Read the story to me tapped, and two seconds into that reading no cue and every room none. Its plant, on the first such read: a
    // paragraph's room set to 23 pixels during the reading, read, caught, and taken away.
    async storyTapRead(sel, plantIt) {
      const before = { cue: !!cueEl(), rooms: rooms() }; const b = document.querySelector(`${sel} button[aria-label="Read the story to me"]`); if (!b) return { lost: true, before };
      b.click(); const t0 = performance.now(); const sp = () => document.querySelector(`${sel} button[aria-label="Stop reading"]`);
      let began = false; while (performance.now() - t0 < 3000) { await frames(1); if (sp()) { began = true; break; } }
      const t1 = performance.now(); while (performance.now() - t1 < 2000) await frames(1);
      const out = { before, began, reading: { cue: !!cueEl(), rooms: rooms(), still: !!sp() } };
      if (plantIt) { const p = document.querySelector('[data-story-par]'); if (p) { const was = p.style.getPropertyValue('--cue-room'); p.style.setProperty('--cue-room', '23px'); out.planted = rooms(); if (was) p.style.setProperty('--cue-room', was); else p.style.removeProperty('--cue-room'); } }
      const stop = sp(); if (stop) stop.click(); await frames(2); return out;
    },
    // Since pass NF (EARMARKS A103) the band of the say-along word's fit pinned on both sides, on a strip that keeps room: its room set so
    // its box is a pixel and a half wider than the word at full size (it keeps its size) and then a pixel narrower (it shrinks and fits),
    // each refitted as the app refits it (edu-refit), and its room put back.
    async wordNear() {
      const s = document.querySelector('[data-say-along]'); const holder = s && s.closest('[data-cue-room]'); const x0 = sayWord(); if (!holder || !x0 || !x0.room) return null;
      const was = holder.style.getPropertyValue('--cue-room'); const open = x0.box + x0.room;
      // Since pass NH (check.sh's first two runs): the page can set the room back between the plant and the read as its own refit runs (the
      // light theme's narrower box read 201 wide, the room gone, in both runs and never in the step run alone), so the plant is made again
      // until the box is the one asked for, up to eight times; a plant that never takes is read as it stands, so the check still fails.
      const at = async (box) => { let got = null;
        for (let k = 0; k < 8; k++) { holder.style.setProperty('--cue-room', `${open - box}px`); holder.dispatchEvent(new Event('edu-refit')); await painted(); got = sayWord(); if (got && Math.abs(got.box - box) <= 1) break; }
        return got; };
      const fits = await at(Math.ceil(x0.natural) + 1); const over = await at(Math.floor(x0.natural) - 1);
      holder.style.setProperty('--cue-room', was); holder.dispatchEvent(new Event('edu-refit')); await painted(); const back = sayWord();
      return { word: x0.word, natural: Math.round(x0.natural * 10) / 10, fits: { box: fits.box, font: fits.font, full: fits.full }, over: { box: over.box, font: over.font, width: Math.round(over.width * 10) / 10 }, back: Math.abs(back.font - x0.font) < 0.05 && back.room === x0.room,
        kept: Math.abs(fits.font - fits.full) < 0.05, shrank: over.font < over.full - 0.05 && over.width <= over.box + 0.5 };
    },
    // Since pass NF (EARMARKS A99) a story's page as the shelf opens it, a lesson story (screen story) or a course's long story (course-story),
    // read where the cue shows as the page opens, with the page's voice turned off by the caller, so the cue shows and stays; a page whose
    // arrow ends 40 pixels or more above the screen's foot is clear. Each page is checked to be the story named before it is read.
    async story(id, part, sel) {
      window.scrollTo(0, 0); const t0 = performance.now(); if (part) window.__eduTest.openCourseStory(id, part); else window.__eduTest.openStory(id);
      const named = () => { const sheet = document.querySelector(sel); if (!sheet || !document.querySelector('[data-story-next]')) return false;
        return part ? window.__eduTest.screen === 'course-story' && sheet.getAttribute('data-course-story-page') === id && sheet.getAttribute('data-course-story-kind') === part : window.__eduTest.screen === 'story' && window.__eduTest.moduleId === id; };
      let k = 0; for (; k < 400 && !named(); k++) await (k < 200 ? tick() : frames(1)); if (!named()) return { lost: true };
      window.scrollTo(0, 0); const how = await settle(t0, '[data-story-next]', 'top');
      return how === 'clear' ? { cue: false, words: [], others: [] } : read(sel, '[data-story-next]', 'top');
    },
    // Since pass NF (EARMARKS A103 (c)) a lesson's line reached by Next from the line it opens on, read for its last row (lone) and for
    // any word past the line's inner edges, and, planted, with the box that holds a long last pair set back to running words.
    async longPair(i, plantIt) {
      for (let k = 0; k < 60 && litDot() !== i; k++) { const b = document.querySelector('[data-lesson-nav] button[aria-label="Next"]'); if (litDot() < i && b) b.click(); await (k < 20 ? tick() : frames(1)); }
      if (litDot() !== i) return { lost: true };
      await painted(); const p = document.querySelector('[data-lesson-words]'); const cs = getComputedStyle(p); const pr = p.getBoundingClientRect();
      const left = pr.left + parseFloat(cs.paddingLeft); const right = pr.right - parseFloat(cs.paddingRight);
      const past = []; const walk = document.createTreeWalker(p, NodeFilter.SHOW_TEXT); let t;
      while ((t = walk.nextNode())) for (const m of t.textContent.matchAll(/\S+/g)) { const r = document.createRange(); r.setStart(t, m.index); r.setEnd(t, m.index + m[0].length); for (const q of r.getClientRects()) if (q.width > 0 && (q.right > right + 0.5 || q.left < left - 0.5)) past.push(m[0]); }
      const res = { lone: lone(), past, held: !!p.querySelector('[data-last-two]'), room: p.style.getPropertyValue('--cue-room') || '0px' };
      if (plantIt) { const s = document.createElement('style'); s.id = 'pair-plant'; s.textContent = '[data-last-two] { display: inline !important; }'; document.head.appendChild(s); await painted(); res.planted = lone(); s.remove(); await painted(); res.back = lone() === res.lone; }
      return res;
    },
    // Since pass NF (EARMARKS A99) a question opened again before a pick, where the cue shows, for the near misses on its printed question.
    async pickNear(gen, mid, seed) {
      window.scrollTo(0, 0); window.__eduTest.showQuestion(gen, seed, mid);
      for (let k = 0; k < 400; k++) { const x = window.__eduTest.question; if (x && x.genId === gen && x.seed === seed && window.__eduTest.screen === 'practice' && document.querySelector('[data-question-text]') && btn('Check answer')) break; await (k < 200 ? tick() : frames(1)); }
      window.scrollTo(0, 0); await painted(); return cueEl() ? nearMiss('[data-question-text]') : null;
    },
    // Since pass NF (EARMARKS A99) with the voice on: a story opened from the overview, read where its voice leaves the page when it ends
    // (the reading followed down the page; the cue then decides as it is drawn), at most 20 seconds of reading.
    async storyVoiced(id, sel) {
      window.scrollTo(0, 0); window.__eduTest.openStory(id);
      const sp = () => document.querySelector(`${sel} button[aria-label="Stop reading"], ${sel} button[aria-label="Read the story to me"]`);
      let began = false; const t0 = performance.now();
      while (performance.now() - t0 < 20000) { await frames(1); const b = sp(); if (b && b.getAttribute('aria-label') === 'Stop reading') began = true; if (began && b && b.getAttribute('aria-label') === 'Read the story to me') break; }
      if (!began || !sp() || sp().getAttribute('aria-label') !== 'Read the story to me') return { lost: true, began };
      await tick(); await painted(); return { ...(await read(sel, '[data-story-next]', 'top')), y: Math.round(scrollY) };
    },
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
      // Since pass NF the page goes to its top before the question opens, as a pre-reader's next question does (nextQuestion's scrollToTop,
      // before the new question is drawn), so the cue before a pick decides where the child first sees the question; the page left where
      // the last question's taps scrolled it, the cue decided there and showed or hid a frame after the scroll back up.
      window.scrollTo(0, 0); window.__eduTest.showQuestion(gen, seed, mid);
      let q = null; for (let k = 0; k < 400; k++) { const x = window.__eduTest.question; if (x && x.genId === gen && x.seed === seed && window.__eduTest.screen === 'practice' && document.querySelector('[data-practice-next]')) { q = x; break; } await (k < 200 ? tick() : frames(1)); }
      if (!q) return { lost: true };
      window.scrollTo(0, 0); await painted();
      if (q.type === 'trace' || !btn('Check answer')) return { trace: true };
      const right = q.type === 'choice' ? [q.answer] : q.answer.split(' | ');
      const wrong = q.type === 'choice' ? [q.choices.find((c) => c !== q.answer)] : [...right].reverse();
      // Since pass NF (EARMARKS A99) the question as it opens, before a pick: the cue that shows while more than a third of the last answer
      // is below the screen, and the words of the question's card (its setup, its printed question and its answers) under it.
      const res = { pick: q.type === 'choice' ? { cue: !!document.querySelector('[data-scroll-cue]'), ...under(PICK), wanted: wants('[data-choice-last]', 'third') } : null };
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
// Since pass NF: the say-along word's band in each theme, the near misses on a story's paragraph and on a question before a pick, and
// the stories read with the voice on.
const wordNears = {}; let nearStory = null; let nearPick = null; const voiced = []; const keptLone = [];
// Since round one's screen read (pass NF): story paragraphs with room that end alone, those that hold a pair and those whose hold undone
// leaves the word alone (by size and theme), the held stories read again, and the readings.
const storyHolds = {}; const heldStories = []; const heldAgain = []; const putBacks = []; const readingRooms = []; const tapReads = [];
// Since pass NF (round one's code read): the largest reach of a block's words past its top or foot in each theme, and its near misses.
const reachSeen = []; let nearReach = null;
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
    const r = report[combo.key] = { lines: 0, cueLines: 0, lineWords: [], linePlanted: [], lineMade: [], lineBack: [], lineLone: [], lineWhole: [], lost: [], screens: { wrong: 0, right: 0 }, cue: { wrong: 0, right: 0 }, words: { wrong: [], right: [] }, planted: { wrong: [], right: [] }, made: [], back: [], traces: 0,
      // Since pass NF: the lines of the other read-aloud courses apart from pre-K's, the say-along words on strips with room, the questions
      // before a pick and the story pages.
      restLines: 0, restCue: 0, restPlanted: [], strips: 0, wordFaults: [], wordPlanted: 0, wordFit: 0, pick: 0, pickWords: [], pickWanted: [], stories: 0, storyCue: 0, storyWords: [], storyOthers: [], storyPlanted: [], storyMade: [], storyBack: [] };
    let firstCue = null; let firstStrip = null;
    for (const m of lessons) {
      await page.evaluate((id) => { window.scrollTo(0, 0); window.__eduTest.openModule(id); }, m.id); await screenIs('lesson');
      const lines = await page.evaluate(([n, sel]) => window.__cw.lesson(n, 0, sel), [L.readAloudScript(m).length, LINE_WORDS]);
      const preK = preKIds.has(m.id);
      for (const x of lines) {
        const key = `${m.id} line ${x.i + 1}`;
        if (x.lost) { r.lost.push(key); continue; }
        if (preK) r.lines += 1; else r.restLines += 1; if (!x.cue) continue;
        if (preK) r.cueLines += 1; else r.restCue += 1; if (!firstCue && preK) firstCue = { id: m.id, i: x.i };
        if (x.words.length) r.lineWords.push(`${key}: ${x.words.join(' ')}`);
        for (const o of x.over || []) overRooms.push(`${combo.key} ${key}: ${o}`);
        if (x.planted.length) (preK ? r.linePlanted : r.restPlanted).push(`${key}: ${x.planted.join(' ')}`);
        // The say-along word (A103): its full size where it fits beside the cue, else its box filled; planted, the rule before pass NF.
        if (x.word) { r.strips += 1; const w = x.word; const fits = w.natural <= w.box + 0.5; if (fits) r.wordFit += 1;
          if (!(Math.abs(w.scale - 1) < 0.01 && (fits ? Math.abs(w.font - w.full) < 0.05 : w.width <= w.box + 0.5 && w.width >= w.box - 3))) r.wordFaults.push(`${key} "${w.word}": ${w.font.toFixed(2)} of ${w.full.toFixed(2)} pixels, ${w.width.toFixed(1)} wide in ${w.box}`);
          if (fits && x.wordPlanted && x.wordPlanted.font < x.wordPlanted.full - 0.05) r.wordPlanted += 1;
          if (!firstStrip) firstStrip = { id: m.id, i: x.i }; }
        if (!x.stillWanted) r.lineMade.push(`${key}: Next ${x.hidden} below`);
        if (x.back !== x.rooms || x.after.join(' ') !== x.words.join(' ')) r.lineBack.push(key);
        // Since pass NF a line LONE_KEPT names (A103 (c)) may end alone beside the cue too: Open number lines' sixth line keeps 201 pixels
        // beside the cue at 320 by 568, and "before seventy-three." is 205, so no room for the cue can keep the two together there.
        if (loneCaught(x)) (LONE_KEPT[`${m.id} ${x.i + 1}`] === x.lone ? keptLone : r.lineLone).push(`${combo.key} ${key}: "${x.lone}" alone`);
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
    // Since pass NF the say-along word's band, once in each theme, on the first strip that keeps room at 320 by 568 (wordNear).
    if (firstStrip && combo.w === 320) { await page.evaluate((id) => { window.scrollTo(0, 0); window.__eduTest.openModule(id); }, firstStrip.id); await screenIs('lesson');
      await page.evaluate(([n, sel]) => window.__cw.lesson(n, 0, sel), [firstStrip.i + 1, LINE_WORDS]);
      wordNears[theme] = { where: `${firstStrip.id} line ${firstStrip.i + 1}`, ...(await page.evaluate(() => window.__cw.wordNear())) }; }
    console.log(`${combo.key}: ${r.lines} pre-K lesson lines read, the cue on ${r.cueLines}; ${r.restLines} lines of the other read-aloud courses, the cue on ${r.restCue}; ${r.strips} say-along strips with room, ${secs()} s`);
    // Since pass NF (EARMARKS A99) the story pages, with the page's voice off, so the cue shows as each page opens and stays, as on a device
    // with no voice: every lesson story straight from the one before, and each long story from the overview, since its cue watches the
    // course alone and a course's two long stories would share one state.
    await page.evaluate(() => { window.__voice = window.speechSynthesis; Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: undefined }); });
    let firstStory = null;
    for (const s of stories) {
      if (s.part) { await page.evaluate(() => window.__eduTest.goTo('overview')); await screenIs('overview'); }
      const x = await page.evaluate(([id, part, sel]) => window.__cw.story(id, part, sel), [s.id, s.part, STORY_WORDS]);
      const key = s.part ? `${s.id} ${s.part} story` : `${s.id} story`;
      if (x.lost) { r.lost.push(key); continue; }
      r.stories += 1; if (!x.cue) continue; r.storyCue += 1; if (!firstStory) firstStory = s;
      if (x.words.length) r.storyWords.push(`${key}: ${x.words.join(' ')}`);
      if (x.others.length) r.storyOthers.push(`${key}: ${x.others.join(' ')}`);
      for (const o of x.over || []) overRooms.push(`${combo.key} ${key}: ${o}`);
      if (x.planted.length) r.storyPlanted.push(`${key}: ${x.planted.join(' ')}`);
      if (!x.stillWanted) r.storyMade.push(key);
      if (x.back !== x.rooms || x.after.join(' ') !== x.words.join(' ')) r.storyBack.push(key);
      if (x.pairs) { const h = storyHolds[combo.key] = storyHolds[combo.key] || { lone: [], held: 0, caught: 0 }; h.lone.push(...x.pairs.lone.map((w) => `${key}: "${w}"`)); h.held += x.pairs.held.length; h.caught += x.pairs.caught.length;
        if (x.pairs.held.length && combo.key === 'light 320 by 568' && !s.part) heldStories.push(s.id); }
    }
    // The held stories read again (light 320 by 568, up to six): the room and the hold as the page is first drawn, and 1.3 seconds later.
    if (combo.key === 'light 320 by 568') for (const id of heldStories.slice(0, 6)) {
      const a = await page.evaluate(([sid, sel]) => window.__cw.story(sid, null, sel), [id, STORY_WORDS]); const first = { rooms: a.rooms, held: await page.evaluate(() => window.__cw.heldNow()) };
      await page.waitForTimeout(1300); const later = await page.evaluate(() => ({ rooms: window.__cw.rooms(), held: window.__cw.heldNow() }));
      heldAgain.push({ id, first, later });
      // Since round two's code read (pass NF): the same page past the cue's last timed check, scrolled by code to its foot, the cue's own check
      // sent there, and scrolled back (storyPutBack); the hold undone at the foot planted on the first.
      await page.waitForTimeout(300); putBacks.push({ id, ...(await page.evaluate((pl) => window.__cw.storyPutBack(pl), !putBacks.length)) }); }
    // The near misses on a story's paragraph, once in each theme at 320 by 568, on the first story page with the cue.
    if (firstStory && combo.w === 320) { await page.evaluate(() => window.__eduTest.goTo('overview')); await screenIs('overview');
      await page.evaluate(([id, part, sel]) => window.__cw.story(id, part, sel), [firstStory.id, firstStory.part, STORY_WORDS]);
      nearStory = { ...(nearStory || {}), [theme]: await page.evaluate(() => window.__cw.nearMiss('[data-story-par]')) }; }
    await page.evaluate(() => { Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: window.__voice }); });
    await page.evaluate(() => window.__eduTest.goTo('overview')); await screenIs('overview');
    console.log(`${combo.key}: ${r.stories} story pages read with no voice, the cue on ${r.storyCue}, ${secs()} s`);
  }
  // Since pass NF (EARMARKS A103 (c)) every lesson line whose last two words are over 18 letters and spaces (LONG_PAIRS), at six phone
  // widths 800 tall (22-pixel words) and at 320 by 568 and 375 by 667 (20), each line opened at the top: its last row never one word alone
  // but where LONE_KEPT names it, with its reason, and alone there at every size read (a kept line that ends with company fails, so the
  // name is dropped when it does), no word past its line's inner edges, and on Counting to 120's fifth line at 320 by 800 the box that
  // holds its pair set back to running words, planted, caught.
  for (const [w, h] of PAIR_SIZES) { await page.setViewportSize({ width: w, height: h }); await page.waitForTimeout(150);
    for (const x0 of ONLY.length ? [] : LONG_PAIRS) {
      await page.evaluate((x) => { window.scrollTo(0, 0); window.__eduTest.openModule(x); }, x0.id); await screenIs('lesson');
      const x = await page.evaluate(([k, pl]) => window.__cw.longPair(k, pl), [x0.i, w === 320 && h === 800 && x0.id === 'counting-to-120']);
      pairReads.push({ theme, w, h, key: `${x0.id} ${x0.i + 1}`, ...x });
    } }
  // Since pass NF (EARMARKS A99) with the voice on, at 320 by 568: a few stories whose voice leaves the cue showing when it ends (VOICE_END),
  // each opened from the overview at the hare's pace and read where the voice leaves the page.
  await page.setViewportSize({ width: 320, height: 568 }); await page.waitForTimeout(300);
  await page.evaluate(() => { try { localStorage.setItem('edusphere-story-pace', 'normal'); } catch (e) { /* no storage */ } });
  for (const id of ONLY.length ? [] : VOICE_END) {
    await page.evaluate(() => window.__eduTest.goTo('overview')); await screenIs('overview');
    const x = await page.evaluate(([sid, sel]) => window.__cw.storyVoiced(sid, sel), [id, STORY_WORDS]);
    voiced.push({ theme, id, ...x });
    // Since round one's screen read (pass NF): Read the story to me tapped where the voice left the page.
    if (!x.lost) tapReads.push({ theme, id, ...(await page.evaluate(([sel, pl]) => window.__cw.storyTapRead(sel, pl), [STORY_WORDS, !tapReads.length])) });
  }
  for (const id of ONLY.length && !ONLY.some((x) => VOICED_ROOM.includes(x)) ? [] : VOICED_ROOM) {
    await page.evaluate(() => window.__eduTest.goTo('overview')); await screenIs('overview');
    readingRooms.push({ theme, id, ...(await page.evaluate(([sid, sel]) => window.__cw.storyReading(sid, sel), [id, STORY_WORDS])) });
    // Since chain5 (pass NF): the same story stopped at its top, where the cue keeps room, and begun again by a tap.
    await page.evaluate(() => window.__eduTest.goTo('overview')); await screenIs('overview');
    tapReads.push({ theme, id, stopped: true, ...(await page.evaluate(([sid, sel]) => window.__cw.storyStopTap(sid, sel, false), [id, STORY_WORDS])) });
  }
  await page.evaluate(() => window.__eduTest.goTo('overview')); await screenIs('overview');
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
    let firstCue = null; let firstPick = null;
    for (let b = 0; b < banks.length; b++) {
      const g = banks[b]; const home = homeOf(g);
      for (let seed = 1; seed <= SEEDS; seed++) {
        if (!sampled(b, seed, at)) continue;
        const x = await page.evaluate(([gen, mid, s, sel]) => window.__cw.bank(gen, mid, s, 0, sel), [g, home.id, seed, FEEDBACK]);
        if (x.lost) { r.lost.push(`${g} seed ${seed}`); continue; }
        if (x.trace) { r.traces += 1; continue; }
        // Since pass NF (EARMARKS A99) the question as it opens, before a pick: the cue where its rule shows it, and no word under it.
        if (x.pick) { if (x.pick.cue !== x.pick.wanted) r.pickWanted.push(`${g} seed ${seed}`);
          if (x.pick.cue) { r.pick += 1; if (x.pick.words.length) r.pickWords.push(`${g} seed ${seed}: ${x.pick.words.join(' ')}`); if (!firstPick) firstPick = { g, mid: home.id, seed }; } }
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
      if (nearPractice === null && combo.w === 320) nearPractice = await page.evaluate((sel) => window.__cw.nearMiss(sel), FEEDBACK);
      if (nearReach === null && combo.w === 320) nearReach = await page.evaluate(() => window.__cw.reachNear()); }
    // Since pass NF the near misses on a printed question before a pick, once in each theme at 320 by 568, on the first such question.
    if (firstPick && combo.w === 320) nearPick = { ...(nearPick || {}), [theme]: await page.evaluate(([gen, mid, s]) => window.__cw.pickNear(gen, mid, s), [firstPick.g, firstPick.mid, firstPick.seed]) };
    console.log(`${combo.key}: ${r.screens.wrong} questions read after a wrong tap and ${r.screens.right} after the right one, the cue on ${r.cue.wrong} and ${r.cue.right}; the cue before a pick on ${r.pick}, ${secs()} s`);
  }
  reachSeen.push({ theme, ...(await page.evaluate(() => ({ seen: window.__cwReach || null, n: window.__cwReachN || 0 }))) });
  await ctx.close();
}
// With motion on (a lesson card rises, a wrong tap's box wobbles, a right tap's box cheers): at 320 by 568 in the light theme, the first
// six lines with the cue and the first six questions with it after each tap, the room read two frames after each is drawn and again
// once it rests, 1.3 seconds later, must be the same, and no word may lie under the cue then.
const moving = []; let sayAgain = null; let lonePlant = null; const turned = []; let turnedPlant = null; let straight = null;
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
  const cueLines = []; for (const m of lessons) { if (cueLines.length >= 6) break; const lines = await (async () => { await page.evaluate((id) => { window.scrollTo(0, 0); window.__eduTest.openModule(id); }, m.id); await screenIs('lesson'); return page.evaluate(([n, sel]) => window.__cw.lesson(n, 0, sel), [L.readAloudScript(m).length, LINE_WORDS]); })();
    for (const x of lines) if (x.cue && cueLines.length < 6) cueLines.push({ id: m.id, i: x.i }); }
  for (const c of cueLines) {
    await page.evaluate((id) => { window.scrollTo(0, 0); window.__eduTest.openModule(id); }, c.id); await screenIs('lesson');
    const a = (await page.evaluate(([n, sel]) => window.__cw.lesson(n, 0, sel), [c.i + 1, LINE_WORDS]))[c.i];
    await page.waitForTimeout(1300); const b = await page.evaluate((sel) => ({ rooms: window.__cw.rooms(), ...window.__cw.under(sel) }), LINE_WORDS);
    moving.push({ where: `${c.id} line ${c.i + 1}`, first: a && a.rooms, rest: b.rooms, cue: b.cue, words: b.words });
  }
  // Since pass NF (EARMARKS A99) the first three lesson story pages with the cue, with motion on and no voice: their pictures slide in as
  // the page opens, and the room the paragraphs keep as the page is first drawn is the room they keep 1.3 seconds later, no word under it.
  await page.evaluate(() => { window.__voice = window.speechSynthesis; Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: undefined }); });
  for (const s of stories.filter((x) => !x.part)) { if (moving.filter((x) => / story$/.test(x.where)).length >= 3) break;
    const a = await page.evaluate(([id, sel]) => window.__cw.story(id, null, sel), [s.id, STORY_WORDS]); if (a.lost || !a.cue) continue;
    await page.waitForTimeout(1300); const b = await page.evaluate((sel) => ({ rooms: window.__cw.rooms(), ...window.__cw.under(sel) }), STORY_WORDS);
    moving.push({ where: `${s.id} story`, first: a.rooms, rest: b.rooms, cue: b.cue, words: b.words }); }
  await page.evaluate(() => { Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: window.__voice }); });
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
      const t0 = performance.now(); window.__t0 = t0; window.__turnAt = null; const onTurn = () => { if (window.__turnAt === null) window.__turnAt = Math.round(performance.now() - t0); }; window.addEventListener('resize', onTurn); check.click();
      (async () => { while (performance.now() - t0 < 1500) { await cw.frames(1); const box = document.querySelector('[data-feedback]'); const moves = !!box && box.getAnimations().some((a) => a.playState === 'running'); const u = cw.under(FB);
        window.__turn.push({ t: Math.round(performance.now() - t0), moves, cue: u.cue, words: u.words, rooms: cw.rooms() }); }
        if (window.__turnStop) { window.removeEventListener('edu-cue-check', window.__turnStop, { capture: true }); delete window.__turnStop; }
        window.removeEventListener('resize', onTurn); window.__turnDone = true; })();
      return 'ok'; }, [gen, homeOf(gen).id, FEEDBACK, stop]);
    if (ok !== 'ok') return { gen, ok };
    await page.waitForFunction(() => performance.now() - window.__t0 >= 200, null, { timeout: 5000 }); await page.setViewportSize({ width: 568, height: 320 });
    await page.waitForFunction(() => window.__turnDone, null, { timeout: 8000 });
    const s = await page.evaluate(() => window.__turn); const turnedAt = await page.evaluate(() => window.__turnAt);
    const restAt = (s.find((x) => !x.moves && x.t > 100) || {}).t;
    const after = restAt === undefined ? [] : s.filter((x) => x.t > restAt);
    return { gen, ok, restAt, turnedAt, frames: s.length, wobbled: s.some((x) => x.moves), changes: after.filter((x, i) => x.rooms !== (i ? after[i - 1] : s.find((y) => y.t === restAt)).rooms).map((x) => `${x.t} ms: ${x.rooms}`), under: after.filter((x) => x.cue && x.words.length).map((x) => `${x.t} ms: ${x.words.join(' ')}`) };
  };
  // Since pass NF the page records when it saw the turn (turnedAt), so each read holds that the turn came while the box moved, and a read
  // whose turn a busy machine let come after the box had stopped is read again, up to three times. In two of pass NF's whole runs the
  // plant caught nothing: the app's check 160 ms after the turn fell on a frame where the wobble stood straight, took the box for one at
  // rest and chose its room again before the box stopped, which turnsNow in ui.jsx ends, and the read below holds (straightRead).
  const duringWobble = async (gen, stop) => { let x = null; for (let k = 0; k < 3; k++) { x = await turnRead(gen, stop); if (x.ok !== 'ok' || (x.turnedAt !== null && x.restAt !== undefined && x.turnedAt < x.restAt)) break; } return x; };
  for (const gen of ['p4-soe-first', 'p4-soe-yesno', 'p4-wbs-first']) turned.push(await duringWobble(gen, false));
  turnedPlant = await duringWobble('p4-soe-first', true);
  // Since pass NF (turnsNow in ui.jsx) a box paused at the frame of its wobble where it stands straight, about 385 ms in (found to a quarter
  // of a millisecond, its angle read from the page), is still a moving box: the phone turned while it is paused there, the app's check
  // 160 ms later keeps the room chosen before the box's first frame, and once the wobble runs to its end the room is chosen at rest.
  const straightRead = async () => {
    await page.setViewportSize({ width: 320, height: 568 }); await page.waitForTimeout(400);
    const set = await page.evaluate(async ([gen, mid]) => {
      const cw = window.__cw; window.__eduTest.showQuestion(gen, 1, mid);
      let q = null; for (let k = 0; k < 400; k++) { const x = window.__eduTest.question; if (x && x.genId === gen && x.seed === 1 && window.__eduTest.screen === 'practice' && document.querySelector('[data-practice-next]')) { q = x; break; } await cw.frames(1); }
      if (!q) return null; window.scrollTo(0, 0); await cw.frames(2);
      const c = q.choices.find((x) => x !== q.answer); const b = [...document.querySelectorAll('button[data-choice]')].find((x) => x.getAttribute('data-choice') === c); if (!b) return null; b.click(); await cw.frames(1);
      const row = document.querySelector('[data-practice-next]'); if (row && row.getBoundingClientRect().bottom > innerHeight + 4) row.scrollIntoView({ block: 'end' });
      const check = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Check answer'); if (!check) return null; check.click(); await cw.frames(3);
      const box = document.querySelector('[data-feedback]'); const an = box && box.getAnimations().find((a) => a.animationName === 'edu-wobble'); if (!an) return null;
      an.pause(); let best = null;
      for (let t = 360; t <= 410; t += 0.25) { an.currentTime = t; const m = new DOMMatrixReadOnly(getComputedStyle(box).transform); const deg = Math.abs((Math.atan2(m.b, m.a) * 180) / Math.PI); if (!best || deg < best.deg) best = { t, deg }; }
      an.currentTime = best.t; window.__straight = an; return { at: best.t, deg: best.deg, before: cw.rooms() };
    }, ['p4-soe-first', homeOf('p4-soe-first').id]);
    if (!set) return null;
    await page.setViewportSize({ width: 568, height: 320 }); await page.waitForTimeout(500);
    const paused = await page.evaluate(() => window.__cw.rooms());
    await page.evaluate(() => window.__straight.play()); await page.waitForTimeout(800);
    const rest = await page.evaluate(() => { const box = document.querySelector('[data-feedback]'); return { rooms: window.__cw.rooms(), moving: !!box && box.getAnimations().some((a) => a.playState === 'running') }; });
    await page.setViewportSize({ width: 320, height: 568 });
    return { at: set.at, deg: Math.round(set.deg * 10000) / 10000, before: set.before, paused, rest: rest.rooms, restMoving: rest.moving };
  };
  straight = await straightRead();
  await page.setViewportSize({ width: 320, height: 568 });
  await ctx.close(); }
await browser.close();

// The verdicts.
for (const combo of COMBOS) {
  const r = report[combo.key];
  // Since pass NF the lines of every read-aloud course: pre-K's (the cue at 375 by 667 a ceiling of none) and the rest, each held to its floor.
  const preKCueOk = FLOORS.cueLines.preK[combo.key] === 0 ? r.cueLines === 0 : r.cueLines >= FLOORS.cueLines.preK[combo.key];
  ok(`no word of a lesson line, or of its say-along strip, lies under the scroll cue at ${combo.key} in the ${combo.theme} theme (${r.lines} pre-K lines and, since pass NF, ${r.restLines} lines of kindergarten's, grade 1's and grade 2's read-aloud courses, of ${lessons.length} lessons, read at the top of the page as each opens, each its own dot lit; the cue on ${r.cueLines} and ${r.restCue}, words under it on ${r.lineWords.length})`,
    r.lineWords.length === 0 && r.lost.filter((k) => / line /.test(k)).length === 0 && (!pin || (r.lines >= FLOORS.lines.preK && r.restLines >= FLOORS.lines.rest && preKCueOk && zeroOr(r.restCue, FLOORS.cueLines.rest[combo.key]))), { words: r.lineWords.slice(0, 8), lost: r.lost.slice(0, 4), lines: [r.lines, r.restLines], cue: [r.cueLines, r.restCue], floors: [FLOORS.lines, FLOORS.cueLines.preK[combo.key], FLOORS.cueLines.rest[combo.key]] });
  // Since pass NF (EARMARKS A103) the say-along word: its full size wherever it fits whole beside the cue, else filling its box.
  ok(`the say-along word keeps its full size wherever it fits whole in its strip beside the scroll cue, and a word wider than that fills it within 3 pixels, at ${combo.key} in the ${combo.theme} theme (EARMARKS A103; ${r.strips} strips keep room, the word fits whole on ${r.wordFit}; with the rule before pass NF put back, the word shrinks where it fits on ${r.wordPlanted}, planted, caught)`,
    r.wordFaults.length === 0 && r.wordPlanted === r.wordFit && (!pin || (zeroOr(r.strips, FLOORS.strips[combo.key]) && (combo.w !== 320 || r.wordPlanted >= PLANT_FLOORS.words[combo.key]))), { faults: r.wordFaults.slice(0, 6), strips: r.strips, fit: r.wordFit, planted: r.wordPlanted, floors: [FLOORS.strips[combo.key], PLANT_FLOORS.words[combo.key]] });
  // Since pass NF (EARMARKS A99) the story pages and the question before a pick.
  ok(`no word of a story page lies under the scroll cue at ${combo.key} in the ${combo.theme} theme, every early-years lesson story and every read-aloud course's long story opened with no voice, where the cue shows as the page opens and stays (EARMARKS A99; ${r.stories} pages read, the cue on ${r.storyCue}, words of the story under it on ${r.storyWords.length}${r.storyOthers.length ? `, other words on ${r.storyOthers.length}` : ''})`,
    r.storyWords.length === 0 && r.storyOthers.length === 0 && r.storyMade.length === 0 && r.storyBack.length === 0 && (!pin || (r.stories >= FLOORS.stories && r.storyCue >= FLOORS.storyCue[combo.key])), { words: r.storyWords.slice(0, 6), others: r.storyOthers.slice(0, 4), made: r.storyMade.slice(0, 4), back: r.storyBack.slice(0, 4), stories: r.stories, cue: r.storyCue, floors: [FLOORS.stories, FLOORS.storyCue[combo.key]] });
  ok(`no word of a question lies under the scroll cue before a pick at ${combo.key} in the ${combo.theme} theme, its setup, its printed question and its answers, the cue showing exactly where its rule says (EARMARKS A99; ${r.screens.wrong} questions read as each opens, the cue before a pick on ${r.pick}, words under it on ${r.pickWords.length})`,
    r.pickWords.length === 0 && r.pickWanted.length === 0 && (!pin || zeroOr(r.pick, FLOORS.pick[combo.key])), { words: r.pickWords.slice(0, 6), wanted: r.pickWanted.slice(0, 6), pick: r.pick, floor: FLOORS.pick[combo.key] });
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
// Since pass NF the same plant on the lines of the other read-aloud courses and on the story pages, each at the counts the code has.
const plantedRest = Object.fromEntries(COMBOS.map((c) => [c.key, report[c.key].restPlanted.length]));
const plantedStories = Object.fromEntries(COMBOS.map((c) => [c.key, report[c.key].storyPlanted.length]));
ok(`with the room undone in the page, words lie under the cue on ${plantedRest['light 320 by 568']} lines of the other read-aloud courses at 320 by 568 in the light theme and ${plantedRest['dark 320 by 568']} in the dark (A103), and on ${COMBOS.map((c) => `${plantedStories[c.key]} story pages at ${c.key}`).join(', ')} (A99): the plant is caught`,
  !pin || (COMBOS.every((c) => plantedStories[c.key] >= PLANT_FLOORS.stories[c.key]) && ['light 320 by 568', 'dark 320 by 568'].every((k) => plantedRest[k] >= PLANT_FLOORS.restLines[k])), { plantedRest, plantedStories, floors: { rest: PLANT_FLOORS.restLines, stories: PLANT_FLOORS.stories } });
ok(`the say-along word's band is pinned on both sides on a strip that keeps room, in each theme: its box a pixel and a half wider than the word at full size keeps it whole at full size, and a pixel narrower shrinks it to fit (${JSON.stringify(wordNears)})`,
  ['light', 'dark'].every((t) => (!pin && !wordNears[t]) || (!!wordNears[t] && wordNears[t].kept && wordNears[t].shrank && wordNears[t].back)), wordNears);
const noRoom = (s) => String(s || '').split(' ').filter(Boolean).every((x) => x === '0px'); const someRoom = (s) => !noRoom(s);
// The floors are the counts the code has (chain5, pass NF): six paragraphs held at 320 by 568 in each theme, none at 375 by 667, and five
// stories read again, the lesson stories of the six (the sixth, First Steps' long story, is a course story, read in the main pass).
const holdsAll = Object.values(storyHolds); const holdLight = storyHolds['light 320 by 568'] || { held: 0, caught: 0, lone: [] };
ok(`no story paragraph beside the scroll cue ends on one word alone that had company without the room: the cue's room holds its last two words together there, and only there (round one's screen read, pass NF; ${Object.entries(storyHolds).map(([k, h]) => `${k}: ${h.held} held, ${h.caught} alone with the hold undone`).join('; ')}; the held stories read again 1.3 seconds later, ${heldAgain.length}, the same room and hold)`,
  (!pin && !holdsAll.length) || (holdsAll.length === 4 && holdsAll.every((h) => h.lone.length === 0 && h.caught === h.held) && holdLight.held >= 6 && heldAgain.length >= 5 && heldAgain.every((x) => x.first.rooms === x.later.rooms && x.first.held === x.later.held && x.first.held !== '')), { lone: holdsAll.flatMap((h) => h.lone).slice(0, 6), holds: storyHolds, heldAgain: heldAgain.filter((x) => x.first.rooms !== x.later.rooms || x.first.held !== x.later.held || x.first.held === '').slice(0, 4) });
const putBackOk = (x) => !!x && x.at.held !== '' && x.footCue === false && x.back.cue && x.back.rooms === x.at.rooms && x.back.held === x.at.held && x.back.lone.length === 0;
const putPlant = (putBacks[0] || {}).planted;
ok(`a held story's room and its hold come back together when the cue's own check puts the rooms back: each held story at light 320 by 568, at rest, scrolled by code to its foot, the cue's check sent there and scrolled back, keeps the rooms and holds it had at rest and no last word alone (round two's code read, pass NF; ${putBacks.length} read: ${putBacks.map((x) => `${x.id} ${x.at ? x.at.held : 'lost'}`).join(', ')}; the holds undone at the foot, planted, caught: ${putPlant && putPlant.back ? putPlant.back.lone.join(' ') || 'none alone' : 'not read'})`,
  (!pin && !putBacks.length) || ((!pin || putBacks.length >= FLOORS.putBacks) && putBacks.length > 0 && putBacks.every(putBackOk) && !!putPlant && putPlant.undone > 0 && putPlant.back.lone.length > 0 && putPlant.back.held !== putPlant.at.held), { failed: putBacks.filter((x) => !putBackOk(x)).slice(0, 3), plant: putPlant });
ok(`a story that reads itself keeps no room for the cue while it reads: opened as the shelf opens it, no cue and no room 200 ms in, inside its start window, nor two seconds into its reading (round one's screen read, pass NF; ${readingRooms.length} read, ${VOICED_ROOM.length} in each theme)`,
  (!pin && !readingRooms.length) || (readingRooms.length === 2 * VOICED_ROOM.length && readingRooms.every((x) => x.began && !x.early.cue && noRoom(x.early.rooms) && !x.reading.cue && noRoom(x.reading.rooms) && x.reading.still)), readingRooms.filter((x) => !(x.began && !x.early.cue && noRoom(x.early.rooms) && !x.reading.cue && noRoom(x.reading.rooms) && x.reading.still)).slice(0, 4));
const tapWithRoom = tapReads.filter((x) => !x.lost && x.before.cue && someRoom(x.before.rooms)); const tapStopped = tapReads.filter((x) => x.stopped);
ok(`a reading begun by a tap gives back the room the cue kept: Read the story to me tapped where the voice left the page (VOICE_END) and where a reading was stopped at the page's top, the cue keeping room there (VOICED_ROOM; since chain5, pass NF), and two seconds into that reading no cue and every room none (round one's screen read, pass NF; ${tapReads.length} tapped, ${tapStopped.length} after a stop, ${tapWithRoom.length} where the cue had kept room; a room set during the reading, planted, caught)`,
  (!pin && !tapReads.length) || (tapReads.length === 2 * (VOICE_END.length + VOICED_ROOM.length) && tapStopped.length === 2 * VOICED_ROOM.length && tapStopped.every((x) => !x.lost && x.before.cue && someRoom(x.before.rooms)) && tapReads.every((x) => !x.lost && x.began && !x.reading.cue && noRoom(x.reading.rooms)) && !!tapReads[0].planted && someRoom(tapReads[0].planted)), tapReads.map((x) => ({ theme: x.theme, id: x.id, stopped: !!x.stopped, lost: !!x.lost, before: x.before, began: x.began, reading: x.reading })).slice(0, 10));
ok(`with the voice on, a story whose voice ends with the cue showing has no word under it where the voice leaves the page (${voiced.length} read at 320 by 568, ${VOICE_END.length} named in each theme of the 27 whose voice leaves the cue showing: ${voiced.map((x) => `${x.theme} ${x.id}${x.lost ? ' lost' : x.cue ? ' cue' : ' no cue'}`).join(', ')})`,
  (!pin && !voiced.length) || (voiced.length === 2 * VOICE_END.length && voiced.every((x) => !x.lost && x.cue && x.words.length === 0 && x.others.length === 0)), voiced.filter((x) => x.lost || !x.cue || x.words.length || x.others.length).slice(0, 4));
// Since pass NF (EARMARKS A103 (c)) the lines whose last two words are over 18 letters and spaces.
const loneReads = pairReads.filter((x) => x.lone); const pairPlants = pairReads.filter((x) => x.planted !== undefined);
const keptAlone = Object.entries(LONE_KEPT).map(([k, w]) => ({ k, reads: pairReads.filter((x) => x.key === k).length, alone: pairReads.filter((x) => x.key === k && x.lone === w).length }));
ok(`a lesson line whose last two words are over 18 letters and spaces never ends on one word alone at 320, 340, 360, 375, 390 and 412 by 800 or at 320 by 568 and 375 by 667, in either theme, but Open number lines' sixth line, kept by name with its reason and alone at every size read, and no word runs past its line (EARMARKS A103 (c); ${LONG_PAIRS.length} lines, ${pairReads.length} reads, ${pairReads.filter((x) => x.held).length} with the pair held as one box; the box set back to running words, planted, caught: ${pairPlants.map((x) => `${x.theme} "${x.planted}" alone`).join(', ')})`,
  (!pin && !pairReads.length) || ((!pin || (LONG_PAIRS.length >= FLOORS.longPairs && pairReads.length === LONG_PAIRS.length * PAIR_SIZES.length * 2)) && pairReads.every((x) => !x.lost && x.past.length === 0) && loneReads.every((x) => LONE_KEPT[x.key] === x.lone) && keptAlone.every((k) => k.reads > 0 && k.alone === k.reads)
    && pairPlants.length === 2 && pairPlants.every((x) => x.planted === 'fingers.' && !x.lone && x.back)), { lone: loneReads.filter((x) => LONE_KEPT[x.key] !== x.lone).slice(0, 6), past: pairReads.filter((x) => x.lost || x.past.length).slice(0, 6), kept: keptAlone, plants: pairPlants });
ok('the room comes back whole when the plant is taken away: every block its room again, and the words under the cue as before the plant', all((r) => [...r.lineBack, ...r.back]).length === 0, all((r) => [...r.lineBack, ...r.back]).slice(0, 8));
ok(`the room keeps a lesson line's wrap whole: on every line where the cue shows, its last word never left alone where it had company without the room (EARMARKS A82), but where LONE_KEPT names it (since pass NF: ${keptLone.length ? keptLone.join(', ') : 'none'}), and every speech part kept whole on one line inside its paragraph (since round two's code read a line's last two words parted and its room widened until its last word stood alone, planted, caught${lonePlant && lonePlant.got ? `: ${lonePlant.where}, "${lonePlant.got.lone}" alone at ${lonePlant.got.room} pixels` : ''})`, all((r) => [...r.lineLone, ...r.lineWhole]).length === 0 && ((!pin && !lonePlant) || (!!lonePlant && lonePlant.caught && lonePlant.back)), { found: all((r) => [...r.lineLone, ...r.lineWhole]).slice(0, 8), lonePlant });
ok('the room never makes the cue: wherever the cue shows, with the room undone its own rule still shows it (a lesson\'s Next more than a third below the screen, or any of a practice row below it)', all((r) => [...r.lineMade, ...r.made]).length === 0, all((r) => [...r.lineMade, ...r.made]).slice(0, 8));
// Since pass NF on a story's paragraph and on a printed question before a pick as well, in each theme.
const nearOk = (n) => !!n && n.leftClear && n.leftIn && n.topClear && n.topIn;
ok(`a word just clear of the cue passes and one pixel inside it is caught, at its left edge and at its top, on a lesson line in each theme and on a feedback box, and since pass NF on a story's paragraph and on a question before a pick in each theme (${JSON.stringify({ ...near, practice: nearPractice, story: nearStory, pick: nearPick })})`,
  ['light', 'dark'].every((t) => (!pin && !(near && near[t])) || (near && near[t] && near[t].leftClear && near[t].leftIn && near[t].topClear && near[t].topIn)) && ((!pin && !nearPractice) || (!!nearPractice && nearPractice.leftClear && nearPractice.leftIn && nearPractice.topClear && nearPractice.topIn))
    && ['light', 'dark'].every((t) => (!pin && !(nearStory && nearStory[t])) || (!!nearStory && nearOk(nearStory[t]))) && ['light', 'dark'].every((t) => (!pin && !(nearPick && nearPick[t])) || (!!nearPick && nearOk(nearPick[t]))), { near, nearPractice, nearStory, nearPick });
ok(`the cue decides as a state is drawn: the first line and the first question with the cue in each part read the same 1.3 seconds later, the same room and no word under the cue (${stable.length} read again)`, (!pin || stable.length >= 8) && stable.every((s) => s.same), stable.filter((s) => !s.same));
ok(`with motion on, the room chosen as a lesson line, a story page (since pass NF, ${moving.filter((x) => / story$/.test(x.where)).length} with no voice) or a feedback box is first drawn is the room it keeps once it rests, and no word lies under the cue then (${moving.length} read at 320 by 568 in the light theme; since round one's screen read each tap's feedback read every frame to 1.3 seconds, no room changing after the first frame and no word under the cue once the box rests)`, (!pin || (moving.length >= 13 && moving.filter((x) => / story$/.test(x.where)).length === 3)) && moving.every((x) => x.cue && x.first === x.rest && x.words.length === 0 && !(x.changes > 0) && (x.restFrames === undefined || x.restFrames > 0)), moving.filter((x) => !(x.cue && x.first === x.rest && x.words.length === 0 && !(x.changes > 0) && (x.restFrames === undefined || x.restFrames > 0))).slice(0, 6));
ok(`Say it again keeps the say-along strip's room for the cue: the row brought into view, the tap and a wheel back to the top, and no word of the strip under the cue (round one's screen read; ${sayAgain ? sayAgain.where + ', room ' + sayAgain.before + ' and then ' + sayAgain.after.room : 'no strip with room found'}; the strip's room set to none, planted, caught: ${sayAgain && sayAgain.planted ? sayAgain.planted.join(' ') : 'none'})`, (!pin && !sayAgain) || (!!sayAgain && sayAgain.after.cue && sayAgain.after.top < 4 && sayAgain.after.room === sayAgain.before && sayAgain.after.words.length === 0 && !!sayAgain.planted && sayAgain.planted.length > 0), sayAgain);
ok(`a page that changes while a feedback box moves leaves its lines still once the box rests: the phone turned 200 ms after a first wrong tap on ${turned.map((x) => x.gen).join(', ')}, every frame read to 1.5 seconds, no room changing after the box rests and no word under the cue then (the third read; edu-cue-check stopped, planted, caught: ${turnedPlant && turnedPlant.changes ? turnedPlant.changes.join('; ') : 'not read'})`,
  (!pin && !turned.length) || (turned.length === 3 && turned.every((x) => x.ok === 'ok' && x.wobbled && x.restAt !== undefined && x.turnedAt !== null && x.turnedAt < x.restAt && x.changes.length === 0 && x.under.length === 0) && !!turnedPlant && turnedPlant.ok === 'ok' && turnedPlant.turnedAt !== null && turnedPlant.turnedAt < turnedPlant.restAt && turnedPlant.changes.length > 0), { turned, turnedPlant });
// Since pass NF (turnsNow in ui.jsx) the straight frame of a wobble.
ok(`a box paused where its wobble stands straight is still moving: the phone turned while it is paused there keeps the room chosen before its first frame, and the room is chosen again only once the wobble has run to its end (pass NF; ${straight ? `paused at ${straight.at} ms, ${straight.deg} degrees from straight, the room ${straight.before} and then ${straight.paused} while paused, ${straight.rest} at rest` : 'not read'})`,
  (!pin && !straight) || (!!straight && straight.deg < 0.05 && straight.paused === straight.before && straight.rest !== straight.before && !straight.restMoving), straight);
ok(`no word of a block that keeps room for the cue reaches 40 pixels past the block's top or foot, so keepCueRoom's 40-pixel pass-over keeps every block that could hold a word under the cue (round one's code read, pass NF; ${reachSeen.map((x) => `${x.theme}: ${x.n} states read, the most ${x.seen ? `${x.seen.v} pixels, ${x.seen.where}` : 'none'}`).join('; ')}; a word 39 pixels below a block's foot read at ${nearReach ? nearReach.inside : '?'} and passed, one 41 below read at ${nearReach ? nearReach.past : '?'} and caught)`,
  (!pin && !reachSeen.length) || (reachSeen.length === 2 && reachSeen.every((x) => x.n >= FLOORS.reach[x.theme] && x.seen && x.seen.v < 40) && !!nearReach && nearReach.inside < 40 && nearReach.past >= 40), { reachSeen, nearReach });
ok(`every block's room is at most what the cue needs, how far its words reach into the cue's corner and its gap (round one's screen read: the lone-word guard grew rooms to two fifths of a line; ${overRooms.length} over)`, overRooms.length === 0, overRooms.slice(0, 8));
ok('no page error while the lines and questions were shown', errors.length === 0, errors.slice(0, 3));
if (otherWords.size) console.log(`NOTE - words outside the lesson line and the feedback box lie under the cue on ${otherWords.size} screens (the question or its answers; not this check's), first: ${[...otherWords].slice(0, 6).map(([k, w]) => `${k}: ${w}`).join('; ')}`);
console.log(`cue-words took ${secs()} s`);
console.log(`\n${passed} passed, ${failed} failed`);
process.exitCode = failed ? 1 : 0;
