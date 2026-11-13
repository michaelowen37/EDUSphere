// The Wise Human. Copyright (c) 2026. Source-available; not for reuse. See LICENSE.md.
// The grown-up's card, walked in the real page (Q91, Mikey's answer in pass NG: "Q91 - A"; EARMARKS A96). In plain terms: on a
// device with no voice, a grown-up reads each question aloud, and the letters banks GROWN_UP_CARD_BANKS names (24 in pass NG, 32 in
// pass NH, 44 since pass NI) show, where their answers go, a card with the words to say and a Ready button. This walks every one at seeds 1 and 2 in both themes on a
// 375 by 667 phone, and each at seed 1 on a 320 by 568 phone and on a phone held sideways (667 by 375), in both themes, and checks, as
// a child and a grown-up meet it:
//   - before Ready the card shows its words (the whole question as grownUpCard gives it, and a which-sound question's sounds in the
//     buttons' order) and no answer and no Check answer show; the card's Ready ends above the phone's fold, and every word on the
//     card reads 4.5 to 1 on what it sits on;
//   - after Ready the card is gone and the answers show, with what cardQuestion prints above them, and nothing printed in the
//     question's card beside the answers holds a word the card added (the sound or word to say); a which-sound question's buttons
//     show their numbers, 1 and 2 or 1, 2 and 3, in the card's order and never a sound;
//   - Show the words again brings the card back and hides the answers, and the card and the answers are never on the screen
//     together at any step; after a wrong tap among three answers the reason holds none of the card's added words either (among two,
//     one answer is left, so the reason may say the sound, as a device with a voice prints it);
//   - with a voice no card shows, and with no voice a letters bank off the list (Letters and sounds' picture bank) prints whole as before;
//   - since round one's reads (pass NG): Ready is the plain button, never the pulsing one a child is taught to tap; "tap Ready." holds
//     together; every run of small l's on the card and in the reason draws in a serif type (a small l and a capital I are one bar in
//     the app's type); no line of the reason starts with a lone capital; a which-sound question's numbered buttons stand in one row;
//     Ready hands the keyboard's focus to the first answer and the words again hand it back to Ready; and at 320 by 568, wherever
//     Ready sits below the fold the scroll cue shows and a tap on it brings Ready into view, and after Ready the question's setup (or,
//     with none, its question) is on the screen, never scrolled above it.
// Near misses, each planted in the page and caught: the card's words put back beside the answers after Ready, a card left showing beside
// the answers, and Ready's own scroll taken away. Since round two's code read (pass NG): after a pick, Show the words again leaves one
// cue at most, the one to Ready; every reason holding a run of l's is counted (a floor); and a reason whose run sits inside a kept span
// ("Lll, og." and "Fff-lll", in two first-parts lessons, with a voice) draws it in the serif type inside the same span. Since the third
// read (pass NG): after the cue's tap Ready sits 28 pixels above the screen's foot and after Ready the question's first line 12 pixels
// below its top (11 or more), at 320 by 568 and sideways; a which-sound card's sound lines stand at one height (the serif run's line
// height taken away, planted, caught); and its way back to the list holds the link's name by no-break spaces and on one line at every
// width (round two's sentence, planted, caught). Since pass NI's round two screen read every hyphenated word on the nine cards that
// print one stands on one row at 320 by 568 in both themes (the hold's nowrap taken away on Q, V and Y's picture card at seed 10,
// planted, breaks Yo-yo at its hyphen, caught). Since the third read the after line's way back starts its own row on the picture,
// word and which-sound cards at 375 by 667 and 320 by 568 (drawn inline, planted, it starts mid-row, caught).
// Since pass NH (Mikey's answers "Q96 - A" and "Q97 - A"): the 32 banks, the eight letter-name kinds of A and B, Big letters and the
// tracing lessons among them; and in the thirteen kinds whose picture or letter hides while the card is up (GROWN_UP_CARD_HIDES), the
// question card shows the grown-up's card alone before Ready, with no picture, no letter and no print, and again with Show the words
// again, while after Ready it shows the picture and the question alone, with no setup line. Near miss, planted in the page and caught:
// the letter's picture put back beside the card. Since round one's reads (pass NH): a which-sound card's sounds stand right under its
// words and its line on after Ready follows them; the twelve hiding kinds whose card stops before the question say to read it after Ready
// (the card's first line, or a which-sound card's line after its list, worked out here from the question), and the sign word card to read
// the words above the sign (round two's final read); and a card of Trace more big letters that says "Tap the letter I." draws the I in the
// serif type, and a card without it none.
// Since pass NI (Mikey's answer "Q98 - A"): the 39 banks, the seven picture kinds beside a letter among them, each a hiding kind, its card
// saying the pictures' names alone and asking the grown-up to read the question after Ready; Write it by its sounds' word card asks for the
// words above the two letters, its line on what they are for printed there after Ready. A picture kind's reason after a wrong tap names
// the picture tapped ("The ball does not start with juh."), one of the names its card said, which points at no answer still open, so the
// reason's check reads the card's other added words. With no voice a bank of a letters lesson off the list (Look and write's real
// letter, since every letters bank is on it) shows no card and prints its whole question. Q, V and Y (pass NI) add five banks, 44 in all:
// its which-sound, picture and yes or no kinds hide their letter (23 hiding kinds, 22 of whose cards ask the grown-up to read the question
// after Ready), and its letter and first-letter kinds ask for a letter by its name, as the older ones do.
// Since pass NI's round one screen read: the eight picture cards (the seven picture kinds and Q, V and Y's) say only to read them aloud and
// tap Ready in their first line, and under their names to read the question (the word card, the words above the letters) and then point
// to each picture and say its name again, since the pictures show only after Ready, with no names; and Check answer ends above a 375 by 667
// phone's fold after Ready on all 44 banks at seeds 1 to 6, in both themes, read as a child the educator added sees them, with the test
// page's own margin taken off so the count is the product's (Show the words again stood between the answers and Check answer, and on
// Write it by its sounds' word kind pushed it under the fold on every seed in the dark theme; that place, planted, is caught).
// Run: node tests/e2e/make-page.mjs && node tests/e2e/grown-up-card.mjs
import { createRequire } from 'node:module'; import { execSync } from 'node:child_process';
const G = execSync('npm root -g').toString().trim(); const { chromium } = createRequire(import.meta.url)(`${G}/playwright`);
const L = await import('../../src/logic.mjs');
let passed = 0, failed = 0;
const ok = (name, cond, info) => { if (cond) { passed++; console.log('PASS - ' + name); } else { failed++; console.log('FAIL - ' + name + (info !== undefined ? '  ' + JSON.stringify(info).slice(0, 600) : '')); } };
const words = (t) => String(t || '').toLowerCase().match(/[a-z']+/g) || [];
const FRAME = new Set(['a', 'an', 'the', 'is', 'this', 'that', 'these', 'those', 'letter', 'letters', 'two', 'now', 'listen', 'to', 'at', 'look', 'word', 'name', 'and', 'sound', 'let\'s', 'write', 'by', 'its', 'sounds']);
// What a device with a voice prints is its printedStory, or its story where it has none (since pass NH: the sign word kind prints its story
// with a voice, and since round one's fixes after Ready with none too, so its words are no words the card added).
// Since pass NI Write it by its sounds' word kind prints its first sentence after Ready with no voice (what the two letters are for, read
// by this test's own rule), which names no letter, sound or word to say, so its words are no words the card added either.
const wordSetup = (q) => (q.genId === 'p4-wbs-word' ? (/^(These two letters are for the first sound and the last sound of a word\.) Now listen to these /.exec(q.story) || [])[1] || '' : '');
const heardWords = (q) => { const shown = words(q.visual && q.visual.kind === 'letters' ? q.visual.text : ''); const printed = words(L.printedQuestion(q, true).story || '').concat(words(wordSetup(q)));
  return [...new Set(words(q.story).filter((x) => !printed.includes(x) && !shown.includes(x) && !FRAME.has(x)))]; };
const flat = (t) => String(t || '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();

const browser = await chromium.launch();
const pageErrors = [];
// One educator's walk-through of the early years, so a question can be shown by its bank and seed (window.__eduTest.showQuestion).
async function openPage(theme) {
  const page = await browser.newPage({ viewport: { width: 375, height: 667 }, hasTouch: true, reducedMotion: 'reduce' });
  page.on('pageerror', (e) => pageErrors.push(`${theme}: ${String(e).slice(0, 160)}`));   // any error the page throws while the card works
  await page.addInitScript((t) => { try { localStorage.setItem('edusphere_v1_theme', t); } catch (e) { /* storage may be off */ } }, theme);
  await page.goto(new URL('./page.html', import.meta.url).href);
  const screenIs = (n) => page.waitForFunction((x) => window.__eduTest && window.__eduTest.screen === x, n, { timeout: 60000 });
  const tapIf = async (name) => { const b = page.getByRole('button', { name, exact: true }); if (await b.count()) { await b.first().click({ force: true }); await page.waitForTimeout(250); } };
  await screenIs('welcome');
  await page.getByRole('button', { name: 'Create account', exact: true }).first().click(); await screenIs('educator-setup');
  await page.fill('input[placeholder="PIN"]', '2468'); await page.fill('input[placeholder="PIN again"]', '2468'); await page.fill('input[placeholder="This device\'s name"]', 'Card'); await page.selectOption('select[aria-label="Your state"]', 'TX');
  await page.getByRole('button', { name: 'Create account', exact: true }).click(); await screenIs('educator-pick'); await page.waitForTimeout(400);
  for (const n of ['Skip tour', 'Later', 'Got it']) await tapIf(n);
  await page.getByLabel('Walk through early years').first().click({ force: true }); await screenIs('overview'); await page.waitForTimeout(300);
  return page;
}
// The test page speaks through a stand-in voice; taking it away is a device with no voice, as the other browser tests do it.
const noVoice = (page) => page.evaluate(() => { if (!window.__voiceKept) window.__voiceKept = window.speechSynthesis; Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: undefined }); });
const withVoice = (page) => page.evaluate(() => { if (window.__voiceKept) Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: window.__voiceKept }); });
const show = async (page, g, seed) => {
  await page.evaluate(([x, s]) => window.__eduTest.showQuestion(x, s), [g, seed]);
  await page.waitForFunction(() => window.__eduTest.screen === 'practice', null, { timeout: 15000 }); await page.waitForTimeout(350);
};
// What shows now: the card and its words, the answers and their faces, the question card's own print (its setup and question, and any
// other text in it but the card's and the answers'), Check answer, and the Ready button's bottom on the page.
const state = (page) => page.evaluate(() => {
  const vis = (el) => { if (!el) return false; const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const card = document.querySelector('[data-grown-up-card]');
  const choices = [...document.querySelectorAll('[data-choice]')].filter(vis);
  const ready = document.querySelector('[data-card-ready]');
  const qCard = document.querySelector('[data-question-card]');
  let beside = '';
  if (qCard) { const w = document.createTreeWalker(qCard, NodeFilter.SHOW_TEXT); while (w.nextNode()) { const t = w.currentNode; const el = t.parentElement; if (!el || el.closest('[data-grown-up-card]') || el.closest('[data-choice]') || !vis(el)) continue; beside += ' ' + t.textContent; } }
  const feedback = document.querySelector('[data-feedback]');
  return { card: vis(card), say: card ? (card.querySelector('[data-card-say]') || {}).textContent : null, sounds: card ? [...card.querySelectorAll('[data-card-sounds] p')].map((p) => p.textContent) : [],
    choices: choices.map((b) => ({ value: b.getAttribute('data-choice'), face: b.textContent.trim(), number: b.querySelector('[data-card-number]') ? b.querySelector('[data-card-number]').getAttribute('data-card-number') : null })),
    setup: (document.querySelector('[data-question-setup]') || {}).textContent || null, prompt: (document.querySelector('[data-question-text]') || {}).textContent || '',
    check: [...document.querySelectorAll('button')].some((b) => b.textContent.trim() === 'Check answer' && vis(b)), again: vis(document.querySelector('[data-card-again]')),
    readyBottom: ready && vis(ready) ? Math.round(ready.getBoundingClientRect().bottom) : null, beside, feedback: feedback ? feedback.textContent : '',
    // since round one's reads (pass NG)
    readyPulse: !!(ready && ready.querySelector('button') && /edu-pulse/.test(ready.querySelector('button').className)),
    how: (document.querySelector('[data-card-how]') || {}).textContent || null,
    ells: [...document.querySelectorAll('[data-grown-up-card] [data-ell], [data-feedback] [data-ell]')].map((e) => ({ t: e.textContent, serif: /Georgia|serif/.test(getComputedStyle(e).fontFamily) && !/sans-serif/.test(getComputedStyle(e).fontFamily) })),
    cardText: card ? card.textContent : '', focused: document.activeElement ? (document.activeElement.getAttribute('data-choice') !== null ? 'choice:' + document.activeElement.getAttribute('data-choice') : document.activeElement.closest('[data-card-ready]') ? 'ready' : document.activeElement.tagName) : null,
    numberTops: [...document.querySelectorAll('[data-choice]')].filter((b) => b.querySelector('[data-card-number]')).map((b) => Math.round(b.getBoundingClientRect().top)),
    cue: !!document.querySelector('[data-scroll-cue]'),
    // since pass NH: what else shows in the question card beside the grown-up's card (words, a drawing or a picture), and the question's picture
    others: qCard ? [...qCard.querySelectorAll('*')].filter((el) => !el.closest('[data-grown-up-card]') && vis(el) && (/^(svg|img|canvas)$/i.test(el.tagName) || [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()))).map((el) => `${el.tagName}:${(el.textContent || '').trim().slice(0, 24)}`) : ['no question card'],
    picture: vis(document.querySelector('[data-question-picture]')),
    // since pass NI's round one screen read: a card's line after its names or sounds, and Check answer's bottom on the page less the page's
    // own top margin (the test page keeps the browser's 8 pixels; the product has none), so the count is the product's
    after: (document.querySelector('[data-card-after]') || {}).textContent || null,
    checkBottom: (() => { const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Check answer' && vis(x)); if (!b) return null; return Math.round(b.getBoundingClientRect().bottom + window.scrollY - (parseFloat(getComputedStyle(document.body).marginTop) || 0)); })(),
    setupTop: (() => { const t = document.querySelector('[data-question-setup]') || document.querySelector('[data-question-text]'); return t ? Math.round(t.getBoundingClientRect().top) : null; })() };
});
// Every run of small l's in a text, as ellRuns finds them, and whether every lone capital of a text keeps the word before it.
const ellsIn = (t) => L.ellRuns(t).filter((x, i) => i % 2);
const lonesHeld = (t) => !/\w [A-Z](?=[\s.,?!]|$)/.test(String(t));
// Every word on the card against what it sits on, by the dark theme check's rule (4.5 to 1; 3 to 1 for large words).
const cardContrast = (page) => page.evaluate(() => {
  const parse = (s) => { const m = String(s).match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[\s,\/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
  const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const lum = (c) => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
  const ground = (el) => { for (let n = el; n && n.nodeType === 1; n = n.parentElement) { const c = parse(getComputedStyle(n).backgroundColor); if (c && c.a > 0.9) return c; } return { r: 255, g: 255, b: 255, a: 1 }; };
  const card = document.querySelector('[data-grown-up-card]'); if (!card) return ['no card'];
  const fails = []; const w = document.createTreeWalker(card, NodeFilter.SHOW_TEXT);
  while (w.nextNode()) { const el = w.currentNode.parentElement; if (!w.currentNode.textContent.trim() || !el) continue; const cs = getComputedStyle(el); const fg = parse(cs.color); const g = ground(el);
    const ratio = (Math.max(lum(fg), lum(g)) + 0.05) / (Math.min(lum(fg), lum(g)) + 0.05); const size = parseFloat(cs.fontSize); const bold = parseInt(cs.fontWeight, 10) >= 700;
    if (ratio < ((size >= 24 || (size >= 18.66 && bold)) ? 3 : 4.5)) fails.push(`${ratio.toFixed(2)} "${w.currentNode.textContent.trim().slice(0, 30)}"`); }
  return fails;
});

const banks = [...L.GROWN_UP_CARD_BANKS];
for (const theme of ['light', 'dark']) {
  const page = await openPage(theme); await noVoice(page);
  const faults = { before: [], after: [], numbers: [], again: [], together: [], fold: [], contrast: [], reason: [], ready: [], ells: [], focus: [], row: [], alone: [] }; let ellReasons = 0; let hidden = 0; let asking = 0; let pictureCards = 0;
  for (const g of banks) for (const seed of [1, 2]) {
    const q = L.generateQuestion(g, seed); const card = L.grownUpCard(q); const want = L.cardQuestion(q); const wantUp = L.cardQuestion(q, true);
    // What the voice would have said that a device with a voice never prints: the words of the whole setup that its printed setup
    // leaves out, less the letter the question shows in its own picture and the words that only frame a sentence (the sound to
    // hear, the word or the name to hear). A which-sound question's own sounds are its choices, read by the numbers check.
    const added = heardWords(q);
    const where = `${g} s${seed}`;
    await show(page, g, seed);
    // Before Ready: the card and its words, no answers, no Check answer, Ready above the fold, every word readable.
    let s = await state(page);
    if (!s.card || s.choices.length || s.check || flat(s.say) !== flat(card.say) || flat(s.prompt) !== wantUp.prompt || (wantUp.story && flat(s.setup) !== wantUp.story)) faults.before.push({ where, s: { card: s.card, n: s.choices.length, check: s.check, say: s.say, prompt: s.prompt } });
    // Since pass NH (Q97 (a)): a hiding kind's card stands alone in the question card, no picture, no letter and no print beside it.
    if (card.hides) { hidden += 1; if (s.others.length || s.picture || s.setup !== null) faults.alone.push({ where, step: 'before Ready', others: s.others, picture: s.picture }); }
    if (card.sounds && JSON.stringify(s.sounds) !== JSON.stringify(card.sounds.map((x, i) => `Button ${i + 1}, ${x}.`))) faults.numbers.push({ where, sounds: s.sounds });
    if (s.readyBottom === null || s.readyBottom > 667) faults.fold.push({ where, bottom: s.readyBottom });
    // Since round one's screen read (pass NH): a hiding card whose words do not hold the question the voice asks tells the grown-up to read
    // it after Ready, in its first line, or a which-sound card in its line on after Ready (read below), worked out here from the question.
    { const asks = card.hides && !flat(card.say).includes(flat(q.prompt)); if (asks) asking += 1;
      // Since round two's final read: the sign word card, whose setup prints only after Ready, says to read the words above the sign; and
      // since pass NI the two letters' word card the words above the letters (this test's own table of the two).
      const above = g === 'p3-ab-in-word' ? 'sign' : g === 'p4-wbs-word' ? 'letters' : null;
      // Since pass NI's round one screen read a picture card (its answers pictures) says only to read it and tap Ready, and in its line
      // after its names what to do after Ready, worked out here from the question.
      const pictures = card.hides && !card.sounds && q.choices.every((c) => /^(?:icon|pic|art):/.test(String(c))); if (pictures) pictureCards += 1;
      const how = pictures ? 'Read this aloud, then tap\u00A0Ready.' : above ? `Read this aloud, then tap\u00A0Ready and read the words above the\u00A0${above}.` : asks && !card.sounds ? 'Read this aloud, then tap\u00A0Ready and read the\u00A0question.' : 'Read this aloud, then tap\u00A0Ready.';
      const afterWant = pictures ? `After Ready, read ${above ? 'the words above the letters' : 'the question'}, then point to each picture and say its name again. To see the names again, tap Show the words again, under Check answer.` : null;
      if (s.readyPulse || s.how !== how || (pictures ? flat(s.after) !== afterWant : !card.sounds && s.after !== null)) faults.ready.push({ where, pulse: s.readyPulse, how: s.how, want: how, after: s.after }); }
    { const want2 = ellsIn(s.cardText); const got = s.ells.map((e) => e.t); if (JSON.stringify(got) !== JSON.stringify(want2) || s.ells.some((e) => !e.serif)) faults.ells.push({ where, want: want2, got: s.ells }); }
    if (!lonesHeld(s.say)) faults.ells.push({ where, lone: s.say });
    const low = await cardContrast(page); if (low.length) faults.contrast.push({ where, low });
    if (s.card && s.choices.length) faults.together.push({ where, step: 'before Ready' });
    // After Ready: the answers, the same print above them, none of the card's added words beside them, and numbers for sounds.
    await page.locator('[data-card-ready] button').click(); await page.waitForTimeout(200);
    s = await state(page);
    if (s.card || s.choices.length !== q.choices.length || !s.again || flat(s.prompt) !== want.prompt) faults.after.push({ where, card: s.card, n: s.choices.length, again: s.again });
    // After Ready a hiding kind shows its picture and its question alone, with no setup line.
    // (The sign word kind prints its setup after Ready, since round one's code read in pass NH: its words name no letter and point at the sign.)
    if (card.hides && (!s.picture === !!q.visual || (s.setup === null ? null : flat(s.setup)) !== (want.story ? flat(want.story) : null))) faults.alone.push({ where, step: 'after Ready', picture: s.picture, setup: s.setup });
    if (added.some((x) => words(s.beside).includes(x))) faults.after.push({ where, beside: flat(s.beside), added });
    if (card.sounds && (s.choices.some((c, i) => c.number !== String(i + 1) || c.face !== String(i + 1)) || s.choices.some((c) => card.sounds.includes(c.face)))) faults.numbers.push({ where, faces: s.choices.map((c) => c.face) });
    if (card.sounds && new Set(s.numberTops).size !== 1) faults.row.push({ where, tops: s.numberTops });
    if (s.focused !== `choice:${q.choices[0]}`) faults.focus.push({ where, step: 'after Ready', focused: s.focused });
    if (s.card && s.choices.length) faults.together.push({ where, step: 'after Ready' });
    // Show the words again: the card is back and the answers are gone; Ready again.
    await page.locator('[data-card-again]').click(); await page.waitForTimeout(200);
    s = await state(page);
    if (!s.card || s.choices.length) faults.again.push({ where, card: s.card, n: s.choices.length });
    if (card.hides && (s.others.length || s.picture)) faults.alone.push({ where, step: 'words again', others: s.others, picture: s.picture });
    if (s.focused !== 'ready') faults.focus.push({ where, step: 'words again', focused: s.focused });
    if (s.card && s.choices.length) faults.together.push({ where, step: 'words again' });
    await page.locator('[data-card-ready] button').click(); await page.waitForTimeout(200);
    // A wrong tap: the reason prints none of the card's added words (the printed reason a device with a voice shows).
    const wrong = q.choices.find((c) => c !== q.answer);
    await page.locator(`[data-choice="${wrong}"]`).first().click(); await page.getByRole('button', { name: 'Check answer', exact: true }).click(); await page.waitForTimeout(250);
    s = await state(page);
    // Only where two or more answers are still open after the tap is the retry still a question (a yes or no, or any two answers,
    // leaves one), so only there may the reason not print a word the card added; it is always shown. Since pass NI the reason may name the
    // picture tapped (a picture kind's card said the pictures' names), which points at no answer still open.
    const tapped = words(q.whyNot && q.whyNot[wrong] ? q.whyNot[wrong].name : '');
    if (!s.feedback || (q.choices.length >= 3 && added.some((x) => !tapped.includes(x) && words(s.feedback).includes(x)))) faults.reason.push({ where, feedback: flat(s.feedback), added });
    if (!lonesHeld(s.feedback)) faults.reason.push({ where, lone: s.feedback });
    { const want2 = ellsIn(s.feedback); const got = s.ells.map((e) => e.t); if (want2.length) ellReasons += 1; if (JSON.stringify(got) !== JSON.stringify(want2) || s.ells.some((e) => !e.serif)) faults.ells.push({ where, step: 'reason', want: want2, got: s.ells }); }
    if (s.card) faults.together.push({ where, step: 'after a wrong tap' });
  }
  ok(`${theme}: before Ready each of the ${banks.length} banks shows the grown-up's card with its words and no answers or Check answer, at seeds 1 and 2 (Q91 (a); Q96 (a); Q98 (a))`, faults.before.length === 0 && banks.length === 44, faults.before.slice(0, 3));
  ok(`${theme}: in the kinds whose picture or letter hides (${hidden} questions), the card stands alone before Ready and with the words again, and after Ready the picture and the question show with no setup line but the two kinds' own (Q97 (a); Q98 (a))`, faults.alone.length === 0 && hidden === 2 * L.GROWN_UP_CARD_HIDES.size && hidden === 2 * 23, faults.alone.slice(0, 3));
  ok(`${theme}: Ready shows the answers under the same print, with Show the words again, and no word the card added prints beside them`, faults.after.length === 0, faults.after.slice(0, 3));
  ok(`${theme}: a which-sound card lists its sounds in the buttons' order, and its buttons show their numbers, never a sound`, faults.numbers.length === 0, faults.numbers.slice(0, 3));
  ok(`${theme}: Show the words again brings the card back and hides the answers`, faults.again.length === 0, faults.again.slice(0, 3));
  ok(`${theme}: the card and the answers are never on the screen together, before Ready, after it, with the words again or after a wrong tap`, faults.together.length === 0, faults.together.slice(0, 3));
  ok(`${theme}: the card's Ready ends above a 375 by 667 phone's fold on all ${banks.length} banks`, faults.fold.length === 0, faults.fold.slice(0, 3));
  ok(`${theme}: the eight picture cards (${pictureCards} questions) say under their names to read the question, or the words above the letters, then point to each picture and say its name again (pass NI's round one screen read)`, pictureCards === 16, pictureCards);
  ok(`${theme}: Ready is the plain button, never the pulsing one, "tap Ready." holds together, and the ${asking} cards whose words stop before the question say to read it after Ready (the two letters' word card the words above them)`, faults.ready.length === 0 && asking === 2 * 22, faults.ready.slice(0, 3));
  ok(`${theme}: every run of small l's on the card and in the reason draws in a serif type (${ellReasons} reasons hold one), and no lone capital starts a line of the card's words`, faults.ells.length === 0 && ellReasons >= 2, faults.ells.slice(0, 3));
  ok(`${theme}: Ready hands the focus to the first answer, and Show the words again hands it back to Ready`, faults.focus.length === 0, faults.focus.slice(0, 3));
  ok(`${theme}: a which-sound question's numbered buttons stand in one row`, faults.row.length === 0, faults.row.slice(0, 3));
  ok(`${theme}: every word on the card reads 4.5 to 1 (3 to 1 when large) on what it sits on`, faults.contrast.length === 0, faults.contrast.slice(0, 3));
  ok(`${theme}: after a wrong tap among three answers the reason prints none of the words the card added, every reason shows, and none starts a line with a lone capital`, faults.reason.length === 0, faults.reason.slice(0, 3));
  if (theme === 'light') {
    // With a voice no card shows on these banks; with no voice a letters bank off the list prints whole, as before pass NG.
    await withVoice(page); const voiced = [];
    for (const g of ['p3-ls-letter', 'p3-ls-sound', 'p4-name-yesno', 'p3-look-name']) { await show(page, g, 1); const s = await state(page); if (s.card || !s.choices.length) voiced.push(g);
      // Since pass NH's round one code read: a hiding kind with a voice keeps its picture and its setup, as before the pass.
      if (L.GROWN_UP_CARD_HIDES.has(g) && (!s.picture || s.setup === null)) voiced.push(`${g}: picture ${s.picture}, setup ${s.setup}`); }
    ok('with a voice the letters banks show their answers and no card, and a hiding kind its picture and its setup', voiced.length === 0, voiced);
    // Since pass NI every letters bank is on the list, so the bank off it is Look and write's real letter, which asks by sight.
    await noVoice(page); await show(page, 'p3-look-real', 1); const off = await state(page); const offQ = L.generateQuestion('p3-look-real', 1); const whole = L.printedQuestion(offQ, false);
    ok("with no voice a bank of a letters lesson off the list (Look and write's real letter) shows no card and prints its whole question for the grown-up", !L.GROWN_UP_CARD_BANKS.has('p3-look-real') && !off.card && off.choices.length === offQ.choices.length && flat(off.setup) === whole.story && flat(off.prompt) === whole.prompt, { card: off.card, setup: off.setup, prompt: off.prompt });
    // Near miss 1: the card's words put back beside the answers after Ready (a line added to the question card) is caught.
    await show(page, 'p3-ls-letter', 1); await page.locator('[data-card-ready] button').click(); await page.waitForTimeout(200);
    const q1 = L.generateQuestion('p3-ls-letter', 1); const added1 = heardWords(q1);
    await page.evaluate((say) => { const p = document.createElement('p'); p.textContent = say; p.setAttribute('data-plant', ''); document.querySelector('[data-question-text]').after(p); }, L.grownUpCard(q1).say);
    const planted = await state(page); await page.evaluate(() => document.querySelectorAll('[data-plant]').forEach((n) => n.remove()));
    ok("near miss: the card's words planted beside the answers after Ready are caught", added1.length > 0 && added1.some((x) => words(planted.beside).includes(x)), { added1, beside: flat(planted.beside) });
    // Near miss 2: a card left showing beside the answers (its node kept and shown after Ready) is caught.
    await show(page, 'p3-ls-sound', 1);
    await page.evaluate(() => { const c = document.querySelector('[data-grown-up-card]'); window.__keptCard = c.cloneNode(true); });
    await page.locator('[data-card-ready] button').click(); await page.waitForTimeout(200);
    await page.evaluate(() => { const k = window.__keptCard; k.setAttribute('data-plant', ''); document.querySelector('[data-question-text]').after(k); });
    const both = await state(page); await page.evaluate(() => document.querySelectorAll('[data-plant]').forEach((n) => n.remove()));
    ok('near miss: a card planted to show beside the answers is caught', both.card && both.choices.length > 0);
    // Near miss 3 (since pass NH, Q97 (a)): the letter's picture put back beside a hiding kind's card (its node kept from after Ready and
    // put in the question card above the card with Show the words again) is caught.
    await show(page, 'p4-name-yesno', 1); if (await page.locator('[data-card-again]').count()) { await page.locator('[data-card-again]').click(); await page.waitForTimeout(200); }
    await page.locator('[data-card-ready] button').click(); await page.waitForTimeout(200);
    await page.evaluate(() => { window.__keptPicture = document.querySelector('[data-question-picture]').cloneNode(true); });
    await page.locator('[data-card-again]').click(); await page.waitForTimeout(200);
    await page.evaluate(() => { const k = window.__keptPicture; k.setAttribute('data-plant', ''); document.querySelector('[data-grown-up-card]').before(k); });
    const beside = await state(page); await page.evaluate(() => document.querySelectorAll('[data-plant]').forEach((n) => n.remove()));
    ok("near miss: the letter's picture planted beside a hiding kind's card is caught", beside.card && beside.others.length > 0, beside.others);
  }
  await page.close();
}
// Check answer above the fold after Ready (pass NI's round one screen read): on a 375 by 667 phone, in both themes, as a child the educator
// added sees the question (no Walkthrough Mode tab), every one of the 44 banks at seeds 1 to 6 is shown with no voice, Ready is tapped, and
// Check answer must end above the fold, its bottom read with the test page's own margin taken off (the fold check reads the same with a
// voice). Near miss: Show the words again put back between the answers and Check answer, where round one had it, on Write it by its
// sounds' word kind at seed 2, caught.
async function openChild(theme) {
  const page = await openPage(theme);
  const screenIs = (n) => page.waitForFunction((x) => window.__eduTest && window.__eduTest.screen === x, n, { timeout: 60000 });
  const tapIf = async (name) => { const b = page.getByRole('button', { name, exact: true }); if (await b.count()) { await b.first().click({ force: true }); await page.waitForTimeout(250); } };
  await page.evaluate(() => window.__eduTest.goHome()); await screenIs('educator-pick'); await page.waitForTimeout(400);
  for (const n of ['Skip tour', 'Later', 'Got it']) await tapIf(n);
  await page.getByRole('button', { name: 'Add someone new' }).first().click(); await page.waitForTimeout(300);
  await page.fill('input[placeholder="School-issued ID"]', 'C-1'); await page.getByRole('button', { name: /^Early years/ }).first().click(); await page.waitForTimeout(200);
  await page.getByRole('button', { name: 'Add', exact: true }).click(); await page.waitForTimeout(500); await tapIf('Later');
  await page.getByRole('button', { name: 'Home' }).first().click(); await page.waitForTimeout(500);
  await page.getByRole('button', { name: /C-1$/ }).first().click(); await page.waitForTimeout(900); await tapIf('Later');
  await screenIs('overview');
  return page;
}
const homeOf = (g) => (L.COURSES.flatMap((c) => c.modules).find((m) => (m.generators || []).includes(g)) || {}).id;
for (const theme of ['light', 'dark']) {
  const page = await openChild(theme); await noVoice(page);
  const child = await page.evaluate(() => ![...document.querySelectorAll('[role="status"]')].some((x) => /Walkthrough Mode/.test(x.textContent)));
  const under = []; let read = 0; let highest = 0; let planted = null;
  for (const g of banks) for (let seed = 1; seed <= 6; seed++) {
    await page.evaluate(([x, s, mid]) => window.__eduTest.showQuestion(x, s, mid), [g, seed, homeOf(g)]);
    await page.waitForFunction(() => window.__eduTest.screen === 'practice' && !!document.querySelector('[data-card-ready] button'), null, { timeout: 15000 });
    await page.locator('[data-card-ready] button').click(); await page.waitForTimeout(150);
    const s = await state(page); read += 1;
    if (s.checkBottom === null || s.checkBottom > 667) under.push({ where: `${g} s${seed}`, bottom: s.checkBottom }); else highest = Math.max(highest, s.checkBottom);
    // The plant, once: the link put back where round one had it, at the foot of the question's card under the answers, on the word kind
    // at seed 2 (on the product page as a child sees it, 673 in the light theme and 693 in the dark, by the screen read and the lead's
    // probe), and then put back under Check answer, where the page draws it.
    if (g === 'p4-wbs-word' && seed === 2) {
      await page.evaluate(() => { const link = document.querySelector('[data-card-again]'); const card = document.querySelector('[data-question-card]'); if (link && card) card.appendChild(link.closest('p')); });
      planted = (await state(page)).checkBottom;
      await page.evaluate(() => { const link = document.querySelector('[data-card-again]'); const next = document.querySelector('[data-practice-next]'); if (link && next) next.after(link.closest('p')); });
    }
  }
  ok(`${theme}: after Ready, Check answer ends above a 375 by 667 phone's fold on all 44 banks at seeds 1 to 6, read as a child sees them (${read} questions, the lowest ending at ${highest}; Show the words again at the foot of the question's card, where round one had it, planted on the word kind, caught at ${planted})`,
    child && read === 6 * banks.length && banks.length === 44 && under.length === 0 && planted !== null && planted > 667, { child, under: under.slice(0, 4), planted });
  await page.close();
}
// A 320 by 568 phone (since round one's reads, pass NG): wherever Ready sits below the fold the scroll cue shows and a tap on it brings
// Ready into view, and after Ready the question's setup (or its question) is on the screen; the numbers' row holds there too.
// Since round two's screen read (pass NG), in both themes: wherever the cue shows beside the card, no word of the card sits under it or
// within CUE_GAP (6 pixels) of it, since the card's words keep room for it as the reason does.
const cueClear = (page) => page.evaluate(() => { const cue = document.querySelector('[data-scroll-cue]'); const card = document.querySelector('[data-grown-up-card]'); if (!cue || !card) return [];
  const c = cue.getBoundingClientRect(); const gap = 6; const hits = []; const w = document.createTreeWalker(card, NodeFilter.SHOW_TEXT);
  while (w.nextNode()) { const t = w.currentNode; const re = /\S+/g; let m; while ((m = re.exec(t.textContent))) { const rg = document.createRange(); rg.setStart(t, m.index); rg.setEnd(t, m.index + m[0].length);
    for (const r of rg.getClientRects()) if (r.right > c.left - gap && r.left < c.right + gap && r.bottom > c.top - gap && r.top < c.bottom + gap) hits.push(m[0]); } }
  return hits; });
// Since the third read's screen read the walk runs sideways too (667 by 375), where the cue's tap had left the question's first line 2 to 4
// pixels from the screen's top: after Ready the question's first line keeps its 12 pixels (11 or more), and after the cue's tap Ready sits
// 28 pixels above the screen's foot (25 to 31), never flush on it.
for (const [W, H] of [[320, 568], [667, 375]]) for (const theme of ['light', 'dark']) { const page = await openPage(theme); await noVoice(page); await page.setViewportSize({ width: W, height: H }); await page.waitForTimeout(300);
  // Sideways, a touch screen first asks to turn the phone upright (pass MS, Q74); a grown-up who cannot turn it taps Keep going sideways.
  const keep = page.locator('#edu-rotate.edu-rotate-on .edu-rotate-keep'); if (await keep.count()) { await keep.click(); await page.waitForTimeout(200); }
  const short = { cue: [], after: [], row: [], again: [], room: [] }; let below = 0; const size = `${W} by ${H}`;
  for (const g of banks) {
    const q = L.generateQuestion(g, 1); const card = L.grownUpCard(q); const where = `${g} s1`;
    await show(page, g, 1); await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(700);
    let s = await state(page);
    // Below the fold by the cue's own rule for a full-width row (whole): more than 4 pixels of it under the screen's foot.
    if (s.readyBottom > H + 4) { below += 1;
      if (s.cue) { const under = await cueClear(page); if (under.length) short.room.push({ where, under }); }
      if (!s.cue) short.cue.push({ where, bottom: s.readyBottom });
      // Since the third read: the cue's tap leaves Ready 28 pixels above the screen's foot (its scroll margin), never flush on it.
      else { await page.locator('[data-scroll-cue]').click(); await page.waitForTimeout(500); s = await state(page); if (s.readyBottom > H - 25 || s.readyBottom < H - 31) short.cue.push({ where, step: 'after the cue', bottom: s.readyBottom }); } }
    else if (s.cue) short.cue.push({ where, cueWithReadyShown: s.readyBottom });
    await page.locator('[data-card-ready] button').click(); await page.waitForTimeout(250);
    s = await state(page);
    if (s.setupTop === null || s.setupTop < 11 || s.focused !== `choice:${q.choices[0]}`) short.after.push({ where, top: s.setupTop, focused: s.focused });
    if (card.sounds && new Set(s.numberTops).size !== 1) short.row.push({ where, tops: s.numberTops });
    // After a pick, Show the words again: one cue at most, the one to Ready, and a tap on it brings Ready into view.
    await page.locator('[data-choice]').first().click(); await page.waitForTimeout(150); await page.locator('[data-card-again]').click(); await page.waitForTimeout(700);
    s = await state(page); const cues = await page.locator('[data-scroll-cue]').count();
    if (cues > 1 || (s.readyBottom > H + 4 && cues !== 1)) short.again.push({ where, cues, bottom: s.readyBottom });
    else if (cues === 1) { await page.locator('[data-scroll-cue]').click(); await page.waitForTimeout(500); s = await state(page); if (s.readyBottom > H - 25) short.again.push({ where, step: 'after the cue', bottom: s.readyBottom }); }
  }
  ok(`${theme}, ${size}: wherever Ready sits below the fold (${below} of the ${banks.length} at seed 1) the scroll cue shows, and a tap on it brings Ready into view 28 pixels above the screen's foot; where it shows, no cue`, short.cue.length === 0 && below > 0, short.cue.slice(0, 3));
  ok(`${theme}, ${size}: wherever the cue shows beside the card, no word of the card sits under it or within 6 pixels of it`, short.room.length === 0, short.room.slice(0, 3));
  ok(`${theme}, ${size}: after Ready the question's first line is on the screen 11 pixels or more below its top, and the first answer has the focus`, short.after.length === 0, short.after.slice(0, 3));
  ok(`${theme}, ${size}: a which-sound question's numbered buttons stand in one row`, short.row.length === 0, short.row.slice(0, 3));
  ok(`${theme}, ${size}: after a pick, Show the words again leaves one cue at most, the one to Ready, and its tap brings Ready into view`, short.again.length === 0, short.again.slice(0, 3));
  if (theme === 'dark' || W !== 320) { await page.close(); continue; }   // the planted tall page below reads Ready's own scroll, the same in both themes and sizes, once
  // Ready's own scroll, held where the page's own end cannot do its work. With the numbers in a row the answers are short, and the page,
  // shorter after Ready, scrolls back by itself (in pass NG no kind at seed 1 left its question above the screen with Ready's scroll
  // taken away; the screen read's case, Start or end of the name's which-sound at seed 4, had three full-width bars). So a tall space
  // is planted below the page, where a longer page would sit, and the page is scrolled until the question's setup is 40 pixels above
  // the screen with Ready still on it, as a grown-up who scrolled to Ready leaves it. There Ready brings the question into view, and
  // with its scroll taken away (scrollIntoView made to do nothing) the question stays above the screen, the near miss, caught. Since the
  // third read's screen read the page is also scrolled until the setup's first line sits 5 pixels below the screen's top, inside its
  // 12-pixel margin, where Ready's scroll ran only for a line above the screen: Ready brings it down to its margin (11 or more), and with
  // its scroll taken away it stays at 5, caught (the lead undid the margin's condition alone in a copy of the page, and this failed).
  const guard = { kept: 0, lost: 0, n: 0 }; const inside = { kept: 0, lost: 0, n: 0 };
  for (const g of banks) for (const take of [false, true]) for (const at of [-40, 5]) {
    // A question readied once comes back readied (its card's key is the round's, the place's and the question's), so Show the words
    // again brings its card back, as a grown-up would.
    await show(page, g, 1); if (await page.locator('[data-card-again]').count()) { await page.locator('[data-card-again]').click(); await page.waitForTimeout(200); }
    const placed = await page.evaluate(([t, a]) => { const sp = document.createElement('div'); sp.setAttribute('data-plant', ''); sp.style.height = '900px'; document.body.appendChild(sp);
      // A hiding kind prints nothing above its card until Ready (pass NH, Q97 (a)), so its card's top stands where its question will.
      window.scrollTo(0, 0); const q = document.querySelector('[data-question-setup]') || document.querySelector('[data-question-text]') || document.querySelector('[data-grown-up-card]'); const top = q.getBoundingClientRect().top; window.scrollTo(0, top - a);
      const r = document.querySelector('[data-card-ready]').getBoundingClientRect(); window.__keptScroll = Element.prototype.scrollIntoView; if (t) Element.prototype.scrollIntoView = function () {};
      return r.top >= 0 && r.bottom <= window.innerHeight && Math.abs(q.getBoundingClientRect().top - a) < 1; }, [take, at]);
    if (placed) { await page.locator('[data-card-ready] button').click(); await page.waitForTimeout(250);
      // Since the third read: Ready's scroll leaves 12 pixels above the question (its scroll margin), never its first line at the screen's top.
      const st = await state(page); const box = at < 0 ? guard : inside;
      if (!take) { box.n += 1; if (st.setupTop !== null && st.setupTop >= 11) box.kept += 1; } else if (st.setupTop !== null && st.setupTop < (at < 0 ? 0 : 11)) box.lost += 1; }
    await page.evaluate(() => { Element.prototype.scrollIntoView = window.__keptScroll; document.querySelectorAll('[data-plant]').forEach((n) => n.remove()); });
  }
  ok(`320 by 568, a tall page planted below and the question scrolled above the screen with Ready on it: Ready brings the question into view on all ${guard.n} kinds where that fits`, guard.n > 0 && guard.kept === guard.n, guard);
  ok(`near miss: with Ready's scroll taken away there, the question stays above the screen on ${guard.lost} of them, and is caught`, guard.lost === guard.n && guard.n > 0, guard);
  ok(`320 by 568, the question's first line 5 pixels below the screen's top, inside its 12-pixel margin, with Ready on the screen: Ready brings it down to its margin on all ${inside.n} kinds where that fits (with Ready's scroll taken away it stays there on ${inside.lost}, caught)`, inside.n > 0 && inside.kept === inside.n && inside.lost === inside.n, inside);
  await page.close(); }
// The serif run's own line height (since the third read's screen read): on At the end of the name's which-sound card, whose list holds
// "Button 2, lll.", every sound line stands at one height; with the runs' line height taken away, planted, the run's line grows, caught.
{ const page = await openPage('light'); await noVoice(page); await show(page, 'p4-end-sound', 1); if (await page.locator('[data-card-again]').count()) { await page.locator('[data-card-again]').click(); await page.waitForTimeout(200); }
  const heights = () => page.evaluate(() => [...document.querySelectorAll('[data-card-sounds] p')].map((p) => Math.round(p.getBoundingClientRect().height * 10) / 10));
  const even = await heights(); const hasRun = await page.evaluate(() => !!document.querySelector('[data-card-sounds] [data-ell]'));
  await page.evaluate(() => document.querySelectorAll('[data-card-sounds] [data-ell]').forEach((e) => { e.style.lineHeight = ''; })); const planted = await heights();
  ok("a which-sound card's sound lines stand at one height where one holds a run of l's (its line height taken away, planted, caught)", hasRun && new Set(even).size === 1 && new Set(planted).size > 1, { even, planted });
  // The way back to the list (since the third read's screen read, where round two's "Show the words again brings this list back." split
  // the name, "Show the words / again" at 320 and "Show the / words again" at 375): the which-sound card says "To see this list again,
  // tap Show the words again.", the link's name held by no-break spaces, as "tap Ready." is (pinned: in pass NG the new sentence's own
  // wrap keeps the name whole at every width even with plain spaces, so the spaces are held against a change of type or room). At
  // every width from 320 to 1280, every 4 pixels, on a 568-pixel-tall screen (where the cue keeps its room at the narrow widths), the
  // name stands on one line; round two's sentence, planted, splits it, caught, so the sweep can see a split where there is one.
  const NAME = 'Show the words again';
  const said = await page.evaluate(() => { const el = [...document.querySelectorAll('[data-grown-up-card] p')].find((x) => /this list again/.test(x.textContent)); return el ? el.textContent : null; });
  const nameLines = () => page.evaluate((name) => { const el = [...document.querySelectorAll('[data-grown-up-card] p')].find((x) => /Show.the.words.again/.test(x.textContent)); if (!el) return 0;
    // Since the third read the line's way back is a block of its own, so the name is looked for in every text node of the line.
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let node = null; let at = -1; let t;
    while ((t = walker.nextNode())) { const i = t.data.replace(/\u00A0/g, ' ').indexOf(name); if (i >= 0) { node = t; at = i; break; } }
    if (!node) return 0; const rg = document.createRange(); rg.setStart(node, at); rg.setEnd(node, at + name.length);
    const tops = [...rg.getClientRects()].filter((r) => r.width > 0).map((r) => r.top).sort((a, b) => a - b);
    return tops.length ? 1 + tops.slice(1).filter((t, i) => t - tops[i] > 4).length : 0; }, NAME);
  const sweep = async (stopAtSplit) => { const split = []; for (let w = 320; w <= 1280; w += 4) { await page.setViewportSize({ width: w, height: 568 }); await page.waitForTimeout(60);
    const n = await nameLines(); if (n !== 1) { split.push({ w, lines: n }); if (stopAtSplit) break; } } return split; };
  const held = await sweep(false);
  await page.evaluate(() => { const el = [...document.querySelectorAll('[data-grown-up-card] p')].find((x) => /this list again/.test(x.textContent)); if (el) el.textContent = 'After Ready, point to each button and say its sound. Show the words again brings this list back.'; });
  const plain = await sweep(true);
  // Since pass NH (Q97 (a), round one's code read) the line follows the list and asks for each sound again after Ready, since the grown-up
  // reads the list aloud before Ready; the list stands right under the card's words, read below.
  const order = await page.evaluate(() => { const card = document.querySelector('[data-grown-up-card]'); const say = card.querySelector('[data-card-say]'); const list = card.querySelector('[data-card-sounds]'); const after = card.querySelector('[data-card-after]');
    return !!(say && list && after) && say.compareDocumentPosition(list) === Node.DOCUMENT_POSITION_FOLLOWING && list.compareDocumentPosition(after) === Node.DOCUMENT_POSITION_FOLLOWING && say.nextElementSibling === list; });
  ok("a which-sound card's sounds stand right under its words and the line on what to do after Ready follows them (pass NH, Q97 (a))", order, order);
  // Since round one's screen read (pass NH) the line says to read the question first, which prints only after Ready.
  ok('a which-sound card says to read the question after Ready and "To see this list again, tap Show the words again, under Check answer.", the name held by no-break spaces and on one line at every width from 320 to 1280 (round two\'s sentence, planted, splits it, caught)',
    said === 'After Ready, read the question, then point to each button and say its sound again. To see this list again, tap Show the words again, under Check answer.' && held.length === 0 && plain.length > 0, { said, nbsp: String(said).includes(' '), held: held.slice(0, 3), plain });
  await page.close(); }
// A reason whose run of l's sits inside a span partsWhole keeps whole (since round two's code read, pass NG): ellsIn draws the run in the
// serif type inside the same span, with a voice, as every reason after a wrong tap does ("Lll, og." in Put the beats together's first
// parts, kept whole as a run, and "Fff-lll" in Star and spoon's, kept whole as a blend).
{ const page = await openPage('light'); const kept = [];
  for (const [g, seed, wrong, sel] of [['p4-part-blend', 1, 'icon:log', '[data-whole]'], ['p4-part-first', 1, 'fff-lll', ':is([data-whole], [data-whole-word])']]) {
    await show(page, g, seed); await page.locator(`[data-choice="${wrong}"]`).first().click(); await page.getByRole('button', { name: 'Check answer', exact: true }).click(); await page.waitForTimeout(300);
    const r = await page.evaluate((x) => { const e = document.querySelector(`[data-feedback] ${x} [data-ell]`); if (!e) return null; const cs = getComputedStyle(e); return { t: e.textContent, font: cs.fontFamily, lineHeight: cs.lineHeight, size: cs.fontSize }; }, sel);
    // since the third read, the run's own line height is its size (1), so its line is no taller than the others
    if (!r || !/lll/i.test(r.t) || /sans-serif/.test(r.font) || !/Georgia|serif/.test(r.font) || r.lineHeight !== r.size) kept.push({ g, r }); }
  ok("with a voice, a reason's run of l's inside a kept span draws in the serif type inside that span (two first-parts lessons)", kept.length === 0, kept);
  await page.close(); }
// The letter I on the card (since round one's screen read, pass NH): a card of Trace more big letters that says "Tap the letter I." draws
// the I in the serif type, marked data-letter-i, since in the sans-serif type it is a small l's bar and the tiles that would tell them
// apart wait for Ready; a card without the letter I draws none.
{ const page = await openPage('light'); await noVoice(page);
  const seeds = [...Array(60).keys()].map((i) => i + 1); const sayOf = (s) => L.grownUpCard(L.generateQuestion('pl-hear-more', s)).say;
  const seedI = seeds.find((s) => /letter I\./.test(sayOf(s))); const seedH = seeds.find((s) => !/\bI\b/.test(sayOf(s)));
  const read = () => page.evaluate(() => [...document.querySelectorAll('[data-grown-up-card] [data-letter-i]')].map((e) => ({ t: e.textContent, serif: /Georgia|serif/.test(getComputedStyle(e).fontFamily) && !/sans-serif/.test(getComputedStyle(e).fontFamily) })));
  // Since round two's code read: the letter I is marked data-letter-i alone, never data-ell, so the check of the runs of l's reads the runs alone.
  await show(page, 'pl-hear-more', seedI); const withI = await read(); const ellOnI = await page.evaluate(() => document.querySelectorAll('[data-grown-up-card] [data-ell]').length);
  await show(page, 'pl-hear-more', seedH); const withoutI = await read();
  ok(`Trace more big letters' card draws the letter I in the serif type (seed ${seedI}), marked as the letter and not as a run of l's, and a card without it draws none (seed ${seedH})`, !!seedI && !!seedH && withI.length === 1 && withI[0].t === 'I' && withI[0].serif && ellOnI === 0 && withoutI.length === 0, { withI, ellOnI, withoutI });
  await page.close(); }
// The way back on a row of its own (pass NI's third read, its screen read, as round two's had asked): the after line's second sentence,
// "To see the names again, tap Show the words again, under Check answer.", starts its own row, below the first sentence's full stop, on
// the picture card, the word card and the which-sound card, at 375 by 667 and 320 by 568 in both themes; with its row taken away (the
// span drawn inline), planted on Q, V and Y's picture card at 375 by 667, the sentence starts mid-row beside the full stop, caught.
{ const CASES = [['p4-qvy-pic', 1], ['p4-wbs-word', 1], ['p4-end-sound', 1]];
  const rows = (page) => page.evaluate(() => { const p = document.querySelector('[data-grown-up-card] [data-card-after]'); if (!p) return null;
    const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT); let n; let dot = null; let to = null;
    while ((n = walker.nextNode()) && !to) { const i = n.data.indexOf('To see'); if (i >= 0) { to = [n, i]; break; } const j = n.data.lastIndexOf('.'); if (j >= 0) dot = [n, j]; }
    if (!to || !dot) return null; const top = ([t, i], len) => { const rg = document.createRange(); rg.setStart(t, i); rg.setEnd(t, i + len); const r = [...rg.getClientRects()].filter((x) => x.width > 0)[0]; return r ? Math.round(r.top) : null; };
    return { to: top(to, 2), dot: top(dot, 1) }; });
  const midRow = []; let read = 0; let planted = null;
  for (const theme of ['light', 'dark']) for (const [W, H] of [[375, 667], [320, 568]]) {
    const page = await openPage(theme); await noVoice(page); await page.setViewportSize({ width: W, height: H }); await page.waitForTimeout(300);
    for (const [g, seed] of CASES) { await show(page, g, seed); if (await page.locator('[data-card-again]').count()) { await page.locator('[data-card-again]').click(); await page.waitForTimeout(200); }
      await page.waitForTimeout(150); const r = await rows(page); read += 1; if (!r || r.to === null || r.dot === null || !(r.to > r.dot + 2)) midRow.push({ theme, size: `${W} by ${H}`, where: `${g} s${seed}`, r }); }
    if (theme === 'light' && W === 375) { await show(page, 'p4-qvy-pic', 1); if (await page.locator('[data-card-again]').count()) { await page.locator('[data-card-again]').click(); await page.waitForTimeout(200); }
      await page.evaluate(() => { const sp = document.querySelector('[data-card-again-line]'); if (sp) sp.style.display = 'inline'; }); await page.waitForTimeout(150); planted = await rows(page); }
    await page.close(); }
  ok(`the after line's way back starts its own row on the picture, word and which-sound cards at 375 by 667 and 320 by 568 in both themes (${read} cards read)`, midRow.length === 0 && read === 12, midRow.slice(0, 3));
  ok('near miss: with the way back drawn inline on p4-qvy-pic seed 1 at 375 by 667, it starts mid-row beside the full stop, caught', !!planted && planted.to !== null && planted.to === planted.dot, planted); }
// A hyphenated word on the card stays whole (pass NI's round two screen read: the card read "Now listen to / these three. Yo- / yo."
// on Q, V and Y's picture kind at seeds 10 and 12 at 320 by 568, in both themes, before cardWords held it): on every card that read
// found printing one (p4-qvy-pic seeds 2, 3, 4, 10 and 12, p4-qvy-first 2, p4-soe-letter 4, p4-soe-yesno 4 and p4-soe-sound 1), at 320
// by 568 in both themes, each hyphenated word on the card stands on one row; with the hold's nowrap taken away on p4-qvy-pic seed 10,
// planted, Yo-yo breaks at its hyphen, caught, so the read can see a break where there is one.
{ const CASES = [['p4-qvy-pic', 2], ['p4-qvy-pic', 3], ['p4-qvy-pic', 4], ['p4-qvy-pic', 10], ['p4-qvy-pic', 12], ['p4-qvy-first', 2], ['p4-soe-letter', 4], ['p4-soe-yesno', 4], ['p4-soe-sound', 1]];
  const rowsOf = (page) => page.evaluate(() => [...document.querySelectorAll('[data-grown-up-card] [data-whole-word]')].map((el) => ({ w: el.textContent, rows: new Set([...el.getClientRects()].filter((r) => r.width > 0).map((r) => Math.round(r.top))).size })));
  const broken = []; const none = []; let read = 0; let planted = null;
  for (const theme of ['light', 'dark']) { const page = await openPage(theme); await noVoice(page); await page.setViewportSize({ width: 320, height: 568 }); await page.waitForTimeout(300);
    for (const [g, seed] of CASES) {
      await show(page, g, seed); if (await page.locator('[data-card-again]').count()) { await page.locator('[data-card-again]').click(); await page.waitForTimeout(200); }
      await page.waitForTimeout(150); const rows = await rowsOf(page); read += rows.length;
      if (!rows.some((r) => /-/.test(r.w))) none.push(`${theme} ${g} s${seed}`);
      for (const r of rows) if (r.rows !== 1) broken.push({ theme, where: `${g} s${seed}`, ...r });
    }
    if (theme === 'light') { await show(page, 'p4-qvy-pic', 10); if (await page.locator('[data-card-again]').count()) { await page.locator('[data-card-again]').click(); await page.waitForTimeout(200); }
      await page.evaluate(() => document.querySelectorAll('[data-grown-up-card] [data-whole-word]').forEach((el) => { el.style.whiteSpace = 'normal'; })); await page.waitForTimeout(150);
      planted = (await rowsOf(page)).filter((r) => /^yo-yo/i.test(r.w)); }
    await page.close(); }
  ok(`320 by 568, both themes: every hyphenated word on the nine cards that print one stands on one row (${read} words read), each card holding one`, broken.length === 0 && none.length === 0 && read >= 20, { broken: broken.slice(0, 3), none });   // 20, the count the code has (the third read's code read)
  ok('near miss: with the hold\'s nowrap taken away on p4-qvy-pic seed 10, Yo-yo breaks at its hyphen, caught', !!planted && planted.length > 0 && planted.some((r) => r.rows > 1), planted); }
await browser.close();
ok('the page threw no error while the card was shown, readied, brought back and answered, in either theme', pageErrors.length === 0, pageErrors.slice(0, 3));
console.log(`\n${passed} passed, ${failed} failed`);
process.exitCode = failed ? 1 : 0;   // never process.exit(): it can drop the last lines of a piped stdout (2026-09-23)
