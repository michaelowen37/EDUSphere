// The Wise Human. Copyright (c) 2026. Source-available; not for reuse. See LICENSE.md.
// The voice check (pass MO, for Mikey's Q51). In plain terms: a small page that says the lesson sounds and lines exactly the way
// the app does, so Mikey can listen on his own phone and answer by number. The page is built from the app's own code, not a copy
// of it: the part of src/logic.mjs that decides how a line is said and makes the speech sounds, and the part of src/ui.jsx that
// picks the phone's voice, plays the sounds and says a line's pieces in turn. So what the page plays is what a lesson plays. Its
// third list holds the choices only the phone's voice can settle (how it says ig, at, buh and the rest), each with a number.
// Run: node tools/voice-check.mjs   (writes dist/voice-check.html, which is published as its own small page; dist stays out of git)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const logic = readFileSync(new URL('../src/logic.mjs', import.meta.url), 'utf8');
const ui = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8');
// A stretch of a source file, from one marker up to the next; a marker that has moved stops the tool rather than build a page that
// no longer matches the app.
const slice = (text, from, to, name) => { const a = text.indexOf(from); const b = a < 0 ? -1 : text.indexOf(to, a); if (a < 0 || b < 0) throw new Error(`voice-check: ${name} has moved; update the markers`); return text.slice(a, b); };
const speechLogic = slice(logic, '// ---------- The sounds a lesson says (pass MO', 'export function whyNotNamesAnswer', 'the speech logic').replace(/^export /gm, '');
const speechScreens = slice(ui, '// Read text aloud with the browser\'s built-in voice.', '\nfunction speak(text) {', 'the speech screens');

// The rows, numbered once and for good, so an answer such as "13 fine, 22 spelled" always means the same row.
export const VOICE_CHECK_ROWS = [
  { group: 'The app\'s own sounds, the same on every phone' },
  { n: 1, kind: 'sound', sound: 's', label: 'sss, as in sun' }, { n: 2, kind: 'sound', sound: 'f', label: 'fff, as in fan' },
  { n: 3, kind: 'sound', sound: 'm', label: 'mmm, as in moon' }, { n: 4, kind: 'sound', sound: 'n', label: 'nnn, as in nut' },
  { n: 5, kind: 'sound', sound: 'z', label: 'zzz, as in zip' }, { n: 6, kind: 'sound', sound: 'l', label: 'lll, as in lion' },
  { n: 7, kind: 'sound', sound: 'r', label: 'rrr, as in run' }, { n: 8, kind: 'sound', sound: 't', label: 't, as in top (written tuh)' },
  { n: 9, kind: 'sound', sound: 'p', label: 'p, as in pig (written puh)' }, { n: 10, kind: 'sound', sound: 'k', label: 'c, as in cat (written cuh)' },
  { group: 'Lesson lines, as the app says them now' },
  { n: 11, kind: 'line', text: 'Moon. Mmm. The word moon starts with the sound mmm.' },
  { n: 12, kind: 'line', text: 'Sun. Sss. The word sun starts with the sound sss.' },
  { n: 13, kind: 'line', text: 'Tap and top both start with the same sound, tuh. They begin alike.' },
  { n: 14, kind: 'line', text: 'Fan starts with fff, so it begins differently from tap and top.' },
  { n: 15, kind: 'line', text: 'Moon and map both start with mmm.' },
  { n: 16, kind: 'line', text: 'Sun and fun both end with un, and pig and wig both end with ig.' },
  { n: 17, kind: 'line', text: 'Cat and dog do not rhyme. One ends in at, and the other ends in og.' },
  { n: 18, kind: 'line', text: 'Hat ends with at and big ends with ig, so they do not rhyme.' },
  { n: 19, kind: 'line', text: 'Ball, bed and bear all start with buh.' },
  { n: 20, kind: 'line', text: 'Dog, duck and door all start with duh.' },
  { n: 21, kind: 'line', text: 'Say it slowly, said the teacher, and listen to how it starts. Sss-am, said Sam slowly. Sss! he said, and he hissed like a snake.' },
  { group: 'Choices only your phone\'s voice can settle' },
  { n: 22, kind: 'say', text: 'igg', label: 'ig, handed to the voice as igg (what the app does now)' },
  { n: 23, kind: 'say', text: 'ihg', label: 'ig, handed to the voice as ihg' },
  { n: 24, kind: 'say', text: 'ig', label: 'ig, as written (what spelled it out before)' },
  { n: 25, kind: 'say', text: 'One ends in at, and the other ends in og.', label: 'the at in the middle of the line, as before' },
  { n: 26, kind: 'say', text: 'at', label: 'at, said as a word of its own (what the app does now)' },
  { n: 27, kind: 'say', text: 'buh', label: 'buh, the voice\'s b' }, { n: 28, kind: 'say', text: 'duh', label: 'duh, the voice\'s d' },
  { n: 29, kind: 'say', text: 'guh', label: 'guh, the voice\'s g' }, { n: 30, kind: 'say', text: 'juh', label: 'juh, the voice\'s j' },
  { n: 31, kind: 'say', text: 'tuh', label: 'tuh as the voice says it (heard as "two" before)' },
  // Row 32 (round three's alignment read): a grade 1 line as a lesson says it today, its vowel handed to the voice alone (EARMARKS
  // A42), so it is heard before Q51 is called done; Q57 asks when grade 1's vowels are fixed.
  { group: 'For Q57: a grade 1 line, its vowel said by the phone\'s voice alone' },
  { n: 32, kind: 'line', text: 'Read this word the same way. C says cuh, a says the sound at the start of apple, and n says nnn. Cuh, a, nnn. Can.' },
];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const rowsHtml = VOICE_CHECK_ROWS.map((r) => (r.group
  ? `<h2>${esc(r.group)}</h2>`
  : `<button type="button" class="row" id="row-${r.n}" data-n="${r.n}"><span class="num">${r.n}</span><span class="words">${r.kind === 'line' ? '<q>' + esc(r.text) + '</q>' : esc(r.label)}</span><span class="play" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22"><path d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 010 7M18 6a8.5 8.5 0 010 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></span></button>`)).join('\n');

// The page's script: the app's own speech code, then the page's part. Kept as its own string so the rules test can run it in
// node:vm (voiceCheckSelfTest, below) and see that the page holds the functions it calls and says a line as the app does.
export const VOICE_CHECK_SCRIPT = `${speechLogic}
${speechScreens}
// The page's own part: tap a row and it plays, the way a lesson would; a new tap stops what was playing.
const ROWS = ${JSON.stringify(VOICE_CHECK_ROWS.filter((r) => !r.group))};
const showVoice = () => { const v = pickVoice(); const el = document.getElementById('voice'); if (el) el.textContent = v ? 'Your phone\\'s voice: ' + v.name + ' (' + v.lang + ')' : (canSpeak() ? 'Your phone\\'s voice: its default voice' : 'This browser cannot speak, so only the app\\'s own sounds will play.'); };
showVoice(); if (window.speechSynthesis && 'onvoiceschanged' in window.speechSynthesis) window.speechSynthesis.onvoiceschanged = showVoice;
let lit = null;
const light = (n) => { if (lit) lit.classList.remove('playing'); lit = n ? document.getElementById('row-' + n) : null; if (lit) lit.classList.add('playing'); };
// As speak() does (CLAUDE.md's speech line, round one's code check): a voice still talking, or a sound still playing, is stopped
// first and the row starts 80 ms later, if no newer tap has come, since a phone's browser drops words spoken straight after a
// cancel; a quiet voice starts at once. A row the voice says alone takes the plain shape a lesson gives it (igg and at are said
// in their sentence's shape). As speak() does (round four's code check), a row whose first words a phone dropped (a page's first
// words, on some phones) is asked once more if nothing began within 700 ms, each send its own attempt, so the dropped try is retired.
const play = (row) => {
  const ticket = ++speechTicket; const ss = window.speechSynthesis; let began = false; let attempt = 0;
  light(row.n); const done = () => { if (ticket === speechTicket) light(null); };
  const start = () => {
    if (ticket !== speechTicket) return;
    if (row.kind === 'sound') { began = true; playSound(row.sound, done); return; }
    const pieces = row.kind === 'line' ? speechPieces(row.text) : [{ text: row.text, shape: 'plain', sentence: 0 }];
    if (!canSpeak() && pieces.some((p) => !p.sound)) { began = true; done(); return; }
    const mine = attempt; speechAlive = []; const voice = pickVoice();
    sayPieces(pieces, 0, { alive: () => ticket === speechTicket && mine === attempt, utter: (u, piece) => shapeVoice(u, piece, voice), onBegin: () => { began = true; }, onDone: done });
  };
  if ((ss && (ss.speaking || ss.pending)) || soundPlaying) { try { if (ss) ss.cancel(); } catch (e) { /* nothing to stop */ } stopSound(); setTimeout(start, 80); } else start();
  setTimeout(() => { if (!began && ticket === speechTicket && ss && ss.speaking === false && ss.pending === false && !soundPlaying) { attempt += 1; try { ss.cancel(); } catch (e) { /* as above */ } setTimeout(start, 80); } }, 700);
};
document.querySelectorAll('.row').forEach((b) => b.addEventListener('click', () => play(ROWS.find((r) => r.n === Number(b.dataset.n)))));
`;

export const VOICE_CHECK_HTML = `<title>Wise Human Voice Check</title>
<meta name="claude:viewport-fit-sides" content="cover">
<style>
/* One column of numbered rows to tap, in The Wise Human's own greens and golds and the system face it uses. */
:root { --bg: #F5F7F1; --surface: #FFFFFF; --ink: #24291F; --muted: #5C6355; --line: #DCE3D6; --green: #2F5D4F; --gold: #B8862B; --gold-soft: #F7EAD1; --on-gold: #24291F; --font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --bg: #14231E; --surface: #1D302A; --ink: #F1EDE3; --muted: #B3C1B9; --line: #34503F; --green: #7CC3A6; --gold: #D9A441; --gold-soft: #233B31; --on-gold: #0E1A16; color-scheme: dark; } }
:root[data-theme="dark"] { --bg: #14231E; --surface: #1D302A; --ink: #F1EDE3; --muted: #B3C1B9; --line: #34503F; --green: #7CC3A6; --gold: #D9A441; --gold-soft: #233B31; --on-gold: #0E1A16; color-scheme: dark; }
body { background: var(--bg); color: var(--ink); font-family: var(--font); font-size: 16px; line-height: 1.45; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); padding-block: 20px 40px; }
main { max-width: 640px; margin: 0 auto; display: grid; gap: 10px; }
h1 { font-size: 24px; margin: 0; text-wrap: balance; color: var(--green); }
h2 { font-size: 13px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); margin: 18px 0 2px; font-weight: 700; }
.intro { margin: 0; color: var(--ink); max-width: 62ch; }
.voice { margin: 0; font-size: 14px; color: var(--muted); }
.row { display: grid; grid-template-columns: 40px 1fr 44px; gap: 12px; align-items: center; width: 100%; text-align: left; font: inherit; color: var(--ink); background: var(--surface); border: 1.5px solid var(--line); border-radius: 14px; padding: 12px 12px 12px 10px; cursor: pointer; }
.row:focus-visible { outline: 3px solid var(--gold); outline-offset: 2px; }
.row .num { font-variant-numeric: tabular-nums; font-weight: 700; font-size: 17px; color: var(--green); text-align: center; }
.row .words { min-width: 0; }
.row q { quotes: none; }
.row .play { width: 44px; height: 44px; border-radius: 999px; display: inline-flex; align-items: center; justify-content: center; background: var(--gold-soft); color: var(--ink); border: 2px solid var(--gold); }
.row.playing { border-color: var(--gold); }
.row.playing .play { background: var(--gold); color: var(--on-gold); }
.foot { font-size: 14px; color: var(--muted); margin: 14px 0 0; }
@media (prefers-reduced-motion: no-preference) { .row { transition: border-color 150ms; } }
</style>
<main>
<h1>Voice check</h1>
<p class="intro">Tap a row to hear it, with the sound on. The sounds in the first list are made by the app, so every phone plays the same ones. The words are your phone's own voice. Tell Claude the numbers that sound wrong, and how.</p>
<p class="voice" id="voice">Your phone's voice: finding it...</p>
${rowsHtml}
<p class="foot">Built from the app's own speech code, so a lesson says each line the way this page does.</p>
</main>
<script>
${VOICE_CHECK_SCRIPT}</script>
`;
// The page's self-test (round one's code check, pass MO): its script run in node:vm with a stand-in window, voice and audio, then
// the functions it calls are looked for, its speech is held to the app's, and since round two's code check every row is played and
// heard, row by row; it returns the problems found. The rules test calls it, so code that moves out of a slice fails a test rather
// than building a silent page.
export async function voiceCheckSelfTest(L) {
  const vm = await import('node:vm');
  // A stand-in window on a fake clock: a voice that says what it is handed in turn and records it, and an audio element that records
  // what it plays (round two's code check: the self-test never played a row, so a slice that lost soundUrl passed while the page's
  // first row threw).
  let now = 0; let seq = 0; const timers = []; const log = []; let queue = []; let blobs = 0; let lastCancel = -100; const rates = []; let deafUntil = -1;
  const later = (fn, ms, every = 0) => { const id = ++seq; timers.push({ id, at: now + Math.max(0, Number(ms) || 0), fn, every }); return id; };
  const clear = (id) => { const i = timers.findIndex((t) => t.id === id); if (i >= 0) timers.splice(i, 1); };
  const tick = (ms) => { const end = now + ms; while (timers.length) { timers.sort((x, y) => x.at - y.at || x.id - y.id); const t = timers[0]; if (t.at > end) break; now = t.at; if (t.every) t.at += t.every; else timers.shift(); t.fn(); } now = end; };
  // Each utterance is started once, though an end handler may queue the next words itself (round three's code check).
  const startNext = () => { const u = queue[0]; if (!u || u.__started) return; u.__started = true; later(() => { if (queue[0] !== u) return; log.push(`say ${u.text}`); if (u.onstart) u.onstart({}); later(() => { if (queue[0] !== u) return; queue.shift(); if (u.onend) u.onend({}); startNext(); }, 50); }, 5); };
  // As the rules test's voice does, what is spoken within 4 ms of a cancel is dropped, with no events (a phone's browser does so),
  // and, since round four, what is spoken before deafUntil (a voice not ready yet, which drops a page's first words).
  const ss = { get speaking() { return queue.length > 0; }, get pending() { return queue.length > 1; }, cancel() { lastCancel = now; const old = queue; queue = []; for (const u of old) later(() => { if (u.onerror) u.onerror({}); }, 1); },
    speak(u) { if (now - lastCancel < 4 || now < deafUntil) { log.push(`dropped ${u.text}`); return; } rates.push(u.rate); queue.push(u); if (queue.length === 1) startNext(); }, getVoices() { return []; } };
  function Audio() { const a = { src: '', onended: null, onerror: null, t: 0, play() { log.push(`sound ${a.src}`); a.t = later(() => { if (a.onended) a.onended(); }, 100); return Promise.resolve(); }, pause() { clear(a.t); } }; return a; }
  const el = () => ({ textContent: '', classList: { add() {}, remove() {} }, addEventListener() {}, dataset: {} });
  function SpeechSynthesisUtterance(t) { this.text = t; }
  const win = { speechSynthesis: ss, addEventListener() {}, Audio, SpeechSynthesisUtterance };
  const ctx = vm.createContext({ window: win, document: { getElementById: () => el(), querySelectorAll: () => [] }, console, setTimeout: (f, ms) => later(f, ms), clearTimeout: clear, setInterval: (f, ms) => later(f, ms, ms), clearInterval: clear, Date: { now: () => now },
    URL: { createObjectURL: () => `blob:${++blobs}` }, Blob: function Blob() {}, SpeechSynthesisUtterance, navigator: { userAgent: 'node' } });
  const problems = [];
  try { vm.runInContext(`${VOICE_CHECK_SCRIPT}\nglobalThis.__vc = { speechPieces, soundClipWav, sayPieces, playSound, stopSound, pickVoice, canSpeak, shapeVoice, play, SPEECH_SHAPES };`, ctx); }
  catch (e) { problems.push(`the page's script does not run: ${e && e.message}`); return problems; }
  const vc = ctx.__vc || {};
  for (const name of ['speechPieces', 'soundClipWav', 'sayPieces', 'playSound', 'stopSound', 'pickVoice', 'canSpeak', 'shapeVoice', 'play']) if (typeof vc[name] !== 'function') problems.push(`the page has no ${name}`);
  if (!problems.length) {
    for (const r of VOICE_CHECK_ROWS.filter((x) => x.kind === 'line')) if (JSON.stringify(vc.speechPieces(r.text)) !== JSON.stringify(L.speechPieces(r.text))) problems.push(`row ${r.n} is said otherwise on the page`);
    for (const s of ['s', 'm', 't']) { const a = vc.soundClipWav(s); const b = L.soundClipWav(s); if (!a || !b || a.length !== b.length || a.some((v, i) => v !== b[i])) problems.push(`the page's ${s} is not the app's`); }
    // Every row played, as a tap plays it: a sound row plays one of the app's clips, a line row hands the voice the line's words with
    // its sounds between them, in order, and a single row hands it its own text.
    // Each row from quiet, over a line still playing (row 12, 200 ms in) and over a sound still playing (row 1, 50 ms in), as a tap
    // during another row plays it; a single row in the plain shape (rate 0.86).
    const rows = VOICE_CHECK_ROWS.filter((x) => !x.group); const row12 = rows.find((x) => x.n === 12); const row1 = rows.find((x) => x.n === 1);
    for (const r of rows) for (const [before, wait] of [[null, 0], [row12, 200], [row1, 50]]) {
      const where = before ? ` over row ${before.n}` : '';
      try { if (before) { vc.play(before); tick(wait); } log.length = 0; rates.length = 0; vc.play(r); tick(6000); } catch (e) { problems.push(`row ${r.n}${where} throws: ${e && e.message}`); continue; }
      const want = r.kind === 'sound' ? ['sound'] : r.kind === 'line' ? L.speechPieces(r.text).map((p) => (p.sound ? 'sound' : `say ${p.text}`)) : [`say ${r.text}`];
      const got = log.map((x) => (x.startsWith('sound blob:') ? 'sound' : x));
      if (JSON.stringify(got) !== JSON.stringify(want)) problems.push(`row ${r.n}${where} plays ${JSON.stringify(got)}, not ${JSON.stringify(want)}`);
      if (r.kind === 'say' && !(rates.length === 1 && Math.abs(rates[0] - 0.86) < 1e-9)) problems.push(`row ${r.n}${where} is said at the rate ${rates.join(', ')}, not the plain shape's 0.86`);
      // Since round four's code check a line row is said piece by piece at its own shape's rate, as a lesson says it (a page that said
      // every line in the plain shape passed, row 32's "Can." at 0.86 where a lesson says it at 0.6).
      if (r.kind === 'line' && vc.SPEECH_SHAPES) { const wantRates = L.speechPieces(r.text).filter((p) => !p.sound).map((p) => (vc.SPEECH_SHAPES[p.shape] || vc.SPEECH_SHAPES.plain).rate);
        if (rates.length !== wantRates.length || rates.some((x, i) => Math.abs(x - wantRates[i]) > 1e-9)) problems.push(`row ${r.n}${where} is said at the rates ${rates.join(', ')}, not its pieces' ${wantRates.join(', ')}`); }
    }
    // A voice not ready yet drops a row's first words (some phones drop a page's first words): the row is asked once more, and each
    // piece is said once (round four's code check: play() had no retry, where speak() has).
    for (const r of rows.filter((x) => x.kind !== 'sound')) {
      try { tick(2000); log.length = 0; deafUntil = now + 50; vc.play(r); tick(8000); deafUntil = -1; } catch (e) { deafUntil = -1; problems.push(`row ${r.n} after dropped first words throws: ${e && e.message}`); continue; }
      const want = r.kind === 'line' ? L.speechPieces(r.text).map((p) => (p.sound ? 'sound' : `say ${p.text}`)) : [`say ${r.text}`];
      const got = log.filter((x) => !x.startsWith('dropped ')).map((x) => (x.startsWith('sound blob:') ? 'sound' : x));
      if (JSON.stringify(got) !== JSON.stringify(want)) problems.push(`row ${r.n} after dropped first words plays ${JSON.stringify(got)}, not ${JSON.stringify(want)}`);
    }
  }
  return problems;
}
// Written only when this file is the one being run (its own name, read with endsWith, so a folder with a space still works).
if (process.argv[1] && process.argv[1].endsWith('voice-check.mjs')) {
  mkdirSync(new URL('../dist/', import.meta.url), { recursive: true });
  writeFileSync(new URL('../dist/voice-check.html', import.meta.url), VOICE_CHECK_HTML);
  console.log(`dist/voice-check.html written (${VOICE_CHECK_ROWS.filter((r) => !r.group).length} rows, ${Math.round(VOICE_CHECK_HTML.length / 1024)} KB)`);
}
