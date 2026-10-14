// Every spoken lesson line must make sense with the picture beside it, and read like a
// person talking rather than a list of words. This checks all of them.
import * as L from '../src/logic.mjs';
import { readFileSync } from 'node:fs';

let pass = 0, fail = 0;
const ok = (name, cond, detail = '') => { if (cond) { pass++; console.log('PASS -', name); } else { fail++; console.log('FAIL -', name, detail); } };
const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety', 'hundred'];
const nameOnly = (sentence) => /^[A-Za-z]$/.test(sentence) || NUMBER_WORDS.includes(sentence.toLowerCase()) || /^[A-Za-z]([, ]+[A-Za-z])+$/.test(sentence);

const fragments = []; const mismatches = [];
for (const mod of L.MODULES) {
  for (const line of mod.lesson.script || []) {
    // Natural speech: at least one real sentence of four or more words, unless the line only names letters or counts aloud.
    const sentences = line.say.split(/[.!?]+/).map((x) => x.trim()).filter(Boolean);
    if (!sentences.every(nameOnly) && Math.max(...sentences.map((x) => x.split(/\s+/).length)) < 4) fragments.push(`${mod.id}: ${line.say}`);
    // The picture matches the words.
    const said = line.say.toLowerCase();
    const show = line.show;
    if (!show) continue;
    // Feeling faces (pass MD): a face, a grid of faces or a pair of them shows only feelings the words name, and a grid holds
    // two to four faces, which the screen draws two to a row. A face is never a word to read, so this runs before the skip for
    // instruction lines below (the code check, pass MD: a Say or Tap line could show a face it never names).
    { const faces = show.kind === 'face' ? [show.feeling] : show.kind === 'faces' ? (show.feelings || []) : show.kind === 'pair' ? [show.a, show.b].filter((h) => h && h.kind === 'face').map((h) => h.feeling) : [];
      for (const f of faces) if (!new RegExp(`\\b${f}\\b`).test(said)) mismatches.push(`${mod.id}: "${line.say}" shows a ${f} face`);
      if (show.kind === 'faces' && !(Array.isArray(show.feelings) && show.feelings.length >= 2 && show.feelings.length <= 4)) mismatches.push(`${mod.id}: "${line.say}" shows a grid of faces the screen cannot draw`); }
    // A highlight names the part to light ('first' or a spelling): 0 lights nothing (pass MC found A and B's words unlit).
    if (show.kind === 'letters' && show.highlight !== undefined && (typeof show.highlight !== 'string' || !show.highlight)) mismatches.push(`${mod.id}: "${line.say}" lights nothing (highlight ${JSON.stringify(show.highlight)})`);
    // The size trap (pass MF, Mikey's Q6; pass MG, Mikey: "Can we make the big circles even larger for more contrast and
    // impact?"): a pair of two counted rows whose line names big and little draws the big things at least twice as wide as the
    // little ones, and the big row no longer than the little row, so size is the one cue that looks like more (a row's length
    // is its cells and its gaps, 8 unless the row names its own, as CountRow in ui.jsx draws it). It runs before the skip for
    // instruction lines below, since the trap's second line ("Count each group...") shows the same pair (the code check, pass MG:
    // read after the skip, that line could go back to small circles and pass, the bug pass MD fixed for faces).
    if (show.kind === 'pair' && [show.a, show.b].every((h) => h && h.kind === 'pattern' && h.size) && /\bbig\b/.test(said) && /\blittle\b/.test(said)) {
      const len = (h) => Math.max(h.frame || 5, h.items.length) * h.size + (Math.max(h.frame || 5, h.items.length) - 1) * (h.gap || 8);
      const [big, little] = show.a.size >= show.b.size ? [show.a, show.b] : [show.b, show.a];
      if (!(big.size >= 2 * little.size && len(big) <= len(little))) mismatches.push(`${mod.id}: "${line.say}" draws a size trap whose big things are not twice as big, or whose big row is the longer`);
    }
    // A row (pass MA) holds two or three things drawn at one scale: ui.jsx draws only the first three, so a fourth would vanish
    // without a word, and only a sign-in animal, a shape or an icon has the size the row scales by.
    if (show.kind === 'row' && !(Array.isArray(show.items) && show.items.length >= 2 && show.items.length <= 3 && show.items.every((h) => h && ['pic', 'shape', 'icon'].includes(h.kind)))) mismatches.push(`${mod.id}: "${line.say}" shows a row the screen cannot draw whole`);
    // A counted row (pass MA): one to five shapes with no missing piece, and beside dots in a pair, the dots' own cell of 34. This
    // and the row check run before the instruction skip too, since the size trap's second line ("Count each group...") shows
    // counted rows (the code check's second read, pass MG: six little circles there passed every test).
    { const parts = show.kind === 'pair' ? [show.a, show.b] : [show]; const counted = parts.filter((h) => h && h.kind === 'pattern' && h.size);
      if (counted.some((h) => !(h.items.length >= 1 && h.items.length <= 5 && !h.items.includes('?')) || (parts.some((x) => x && x.kind === 'dots') && h.size !== 34))) mismatches.push(`${mod.id}: "${line.say}" shows a counted row the screen cannot line up`); }
    // An instruction ("Read this word", "Find the one that matches") shows the thing to act on,
    // which must not be spoken in a reading lesson. Only lines that describe what is shown are matched word for word.
    if (/^(read|find|look|listen|touch|say|tap|sound|count|start|try|watch|now|what)\b/i.test(line.say.trim())) continue;
    if (show.kind === 'letters') {
      const words = show.text.split(' ').filter(Boolean);
      const spelled = words.every((w) => w.length > 1 && /^[a-z]+$/.test(w)) && words.join('').length >= 3 && new Set(words.map((w) => w.length)).size === 1 && words.length >= 2 && !words.some((w) => said.includes(w));
      // a word shown must be said; a single letter shown must be said as a letter; split syllables must appear joined
      const fine = words.every((w) => said.includes(w.toLowerCase()) || (w.length === 1 && new RegExp(`\\b${w.toLowerCase()}\\b`).test(said))) || said.replace(/[^a-z]/g, '').includes(words.join('').toLowerCase()) || spelled;
      if (!fine) mismatches.push(`${mod.id}: "${line.say}" shows "${show.text}"`);
      // A highlight lights the same part of every word (the at in cat and hat), or, since pass MC, one letter among single letters
      // when the line names it (This is the letter H, over A and H), so the voice and the gold letter point at the same shape.
      const oneLetter = words.every((w) => w.length === 1) && words.filter((w) => w === show.highlight).length === 1 && new RegExp(`\\bletter ${show.highlight}\\b`).test(line.say);
      if (show.highlight && show.highlight !== 'first' && !oneLetter && !words.every((w) => w.toLowerCase().includes(show.highlight.toLowerCase()))) mismatches.push(`${mod.id}: highlight "${show.highlight}" is not in every word of "${show.text}"`);
    }
    if (show.kind === 'trace') {
      const t = show.text; const def = L.TRACE_LETTERS[t];
      if (!def) mismatches.push(`${mod.id}: "${line.say}" shows an unknown trace ${t}`);
      else {
        const fine = def.line ? /down|across|wav|zig|round|circle|line/.test(said) : t.startsWith('shape-') ? said.includes(t.slice(6)) : def.dots ? (/dot|picture/.test(said) || said.includes(t)) : (new RegExp(`\\b${t.toLowerCase()}\\b`).test(said) || /number|letter|line|arrow/.test(said));
        if (!fine) mismatches.push(`${mod.id}: "${line.say}" shows ${t} drawing itself`);
      }
    }
    if (show.kind === 'shape' && !said.includes(show.name)) mismatches.push(`${mod.id}: "${line.say}" shows a ${show.name}`);
    if (show.kind === 'icon' && !said.includes(show.name)) mismatches.push(`${mod.id}: "${line.say}" shows a ${show.name}`);
    if (show.kind === 'solid' && !said.includes(show.name) && !said.includes({ sphere: 'ball', cube: 'block', cylinder: 'can', cone: 'cone', box: 'box', prism: 'prism' }[show.name])) mismatches.push(`${mod.id}: "${line.say}" shows a ${show.name}`);   // box and prism (pass KY)
    // Every sign-in animal the words name must be on screen too, so a line never mentions a creature the child cannot see.
    { const shownPics = (show.kind === 'pair' ? [show.a, show.b] : show.kind === 'row' ? show.items : [show]).filter((h) => h && h.kind === 'pic').map((h) => h.name);
      if (shownPics.length) { const named = L.PICTURES.filter((n) => new RegExp(`\\b${n}s?\\b`).test(said)); const missing = named.filter((n) => !shownPics.includes(n)); if (missing.length) mismatches.push(`${mod.id}: "${line.say}" names ${missing.join(', ')} but shows ${shownPics.join(', ')}`); } }
    // A pair is two pictures side by side; each half must be named by the words, by its own kind.
    const halves = show.kind === 'pair' ? [show.a, show.b] : show.kind === 'row' ? show.items : [show];   // a row (pass MA) is read like a pair
    for (const h of halves) {
      if (show.kind === 'pair' && !h.kind && !said.includes(h.shape)) mismatches.push(`${mod.id}: "${line.say}" shows a ${h.shape}`);
      if (h.kind === 'swatch' && !said.includes(h.colour)) mismatches.push(`${mod.id}: "${line.say}" shows ${h.colour}`);
      if (h.kind === 'item' && !said.includes(h.shape) && !said.includes(h.colour)) mismatches.push(`${mod.id}: "${line.say}" shows a ${h.colour} ${h.shape}`);
      if (h.kind === 'dots' && !(said.includes(NUMBER_WORDS[h.count]) || said.includes(String(h.count)) || /count|one, two|more|less|fewer|away|left|dots|tap|group/.test(said))) mismatches.push(`${mod.id}: "${line.say}" shows ${h.count} dots`);
      if ((show.kind === 'pair' || show.kind === 'row') && h.kind === 'shape' && !said.includes(h.name)) mismatches.push(`${mod.id}: "${line.say}" shows a ${h.name}`);
    }
  }
}
// Questions too: in every read-aloud course, the picture beside a question must be named or
// pointed at by the words, so what a child sees and hears agree.
const THING = { sphere: 'ball', cube: 'block', cylinder: 'can', cone: 'cone', box: 'box', prism: 'prism' };   // the two prisms are named by their own words (pass KY)
const deictic = /\b(this|it|these|those|the picture|the word|the group|the shape|the letter|the letters|the array|the line|the frame|the clock|the sentence|the story|here)\b/i;
const qbad = [];
for (const c of L.COURSES.filter((x) => x.readAloud)) for (const m of c.modules) for (const g of new Set(m.generators)) for (let seed = 1; seed <= 40; seed++) {
  const q = L.generateQuestion(g, seed); const v = q.visual; if (!v) continue;
  const text = `${q.story || ''} ${q.prompt}`.toLowerCase();
  let fine = deictic.test(text);
  if (!fine) {
    if (v.kind === 'letters') { const words = v.text.split(' ').filter((w) => w !== '?'); const singles = words.every((w) => w.length === 1); fine = singles ? words.some((w) => /^[a-z0-9]$/i.test(w) && new RegExp(`\\b${w.toLowerCase()}\\b`).test(text)) : words.every((w) => text.includes(w.toLowerCase())); }   // a sign like + or = is never a word to find (pass LB)
    else if (v.kind === 'shape' || v.kind === 'solid') fine = text.includes(v.name) || (v.kind === 'solid' && text.includes(THING[v.name]));
    else if (v.kind === 'swatch') fine = text.includes(v.colour);
    else if (v.kind === 'icon') fine = text.includes(v.name);
    else if (v.kind === 'dots') fine = text.includes(NUMBER_WORDS[v.count]) || text.includes(String(v.count)) || /how many|count/.test(text);
    else if (v.kind === 'tens') fine = text.includes(String(v.count * 10)) || /how many|count|tens/.test(text);
    else if (v.kind === 'tenframe') fine = /ten|frame|make 10|empty|spaces|left|more/.test(text) || text.includes(String(v.filled));
    else if (v.kind === 'pair') fine = [v.a, v.b].every((h) => (h.kind ? text.includes(h.colour || '') || text.includes(h.shape || h.name || '') || (h.kind === 'dots' && (text.includes(NUMBER_WORDS[h.count]) || /more|fewer|how many|count/.test(text))) : text.includes(h.shape)));
    else if (v.kind === 'item') fine = text.includes(v.shape) || text.includes(v.colour);
    else if (v.kind === 'face') fine = text.includes(v.feeling);   // pass MD
    else if (v.kind === 'pattern') fine = v.counting ? (/how many|count/.test(text) || text.includes(v.items[0])) : /pattern|next|missing|repeat/.test(text); // a counting row (pass HT) is counted like dots
    else if (v.kind === 'bars' || v.kind === 'bar') fine = /line|long|short|bar|same/.test(text) || (v.shaded !== undefined && text.includes(String(v.shaded)));
    else fine = true;
  }
  if (!fine && !qbad.some((x) => x.startsWith(g + ':'))) qbad.push(`${g}: "${q.story || ''} ${q.prompt}" shows ${JSON.stringify(v)}`);
}
// Lesson pictures in read-aloud courses (pass JP): a pre-reader meets the lesson one spoken line at a time, so every
// painting belongs to one line (its step) and shares a word with it, the way a story picture shares a word with its paragraph.
const stem = (w) => w.replace(/'s$/, '').replace(/s$/, '');
const wordsOf = (t) => new Set((String(t).toLowerCase().match(/[a-z']{4,}/g) || []).map(stem));
const artBad = [];
for (const c of L.COURSES.filter((x) => x.readAloud)) for (const m of c.modules) for (const pic of (m.lesson && m.lesson.pictures) || []) {
  const line = L.readAloudScript(m)[pic.step];
  if (!Number.isInteger(pic.step) || !line) { artBad.push(`${m.id} ${pic.serial}: no spoken line (step ${pic.step})`); continue; }
  const said = wordsOf(line.say); if (![...wordsOf(pic.alt)].some((w) => said.has(w))) artBad.push(`${m.id} ${pic.serial}: "${pic.alt}" shares no word with "${line.say}"`);
}
ok('every lesson picture in a read-aloud course belongs to a spoken line that names it', artBad.length === 0, '\n  ' + artBad.join('\n  '));
// Taught before asked, for pictures and letters (pass JR): a question that asks for a picture or a letter by name (Tap
// the moon, What letter does bee start with?) asks for something its lesson must have said. Held for every module at
// the full standard (docs/review-status.json); tools/untaught.mjs lists the rest for the passes still to come.
const reviewedIds = Object.keys(JSON.parse(readFileSync(new URL('../docs/review-status.json', import.meta.url), 'utf8')).reviewed).filter((k) => k.startsWith('module:')).map((k) => k.slice(7));
const namesBad = new Set();
for (const id of reviewedIds) { const m = L.getModule(id); if (!m) continue;
  const raw = [...m.lesson.paragraphs, m.lesson.keyIdea, (m.lesson.example || {}).caption || '', ...L.readAloudScript(m).map((s) => s.say)].join(' '); const low = raw.toLowerCase();
  for (const g of new Set(m.generators)) for (let seed = 1; seed <= 60; seed++) for (const w of L.askedNames(L.generateQuestion(g, seed))) {
    if (!(/^[A-Z]$/.test(w) ? new RegExp(`\\b${w}\\b`).test(raw) : new RegExp(`\\b${w}`).test(low))) namesBad.add(`${id}: ${w}`);
  } }
ok('every picture or letter a reviewed lesson\'s questions ask for by name is said in that lesson', namesBad.size === 0, [...namesBad].join(', '));
// Taught before asked, for tracing (pass JT): every line, shape or letter a reviewed lesson's questions ask a child to
// trace is traced in that lesson first (First strokes once asked for waves and zigzags it never drew). Connect the dots
// pictures are exempt: the skill there is the order of the numbers, which one picture teaches.
const traceBad = new Set();
for (const id of reviewedIds) { const m = L.getModule(id); if (!m || !m.needsTouch) continue;
  const shown = new Set((m.lesson.script || []).filter((s) => s.show && s.show.kind === 'trace').map((s) => s.show.text));
  for (const g of new Set(m.generators)) for (let seed = 1; seed <= 60; seed++) { const q = L.generateQuestion(g, seed);
    if (q.type === 'trace' && q.traceKind !== 'dots' && !(L.TRACE_LETTERS[q.answer] || {}).dots && !shown.has(q.answer)) traceBad.add(`${id}: ${q.answer}`); } }
ok('every line, shape or letter a reviewed lesson asks a child to trace is traced in that lesson first', traceBad.size === 0, [...traceBad].join(', '));
// Every tracing lesson shows the stroke drawing itself, never a static letter or a count of dots (Mikey, 2026-09-14).
const traced = L.MODULES.filter((m) => m.needsTouch && m.lesson.script);
ok('every touch lesson shows a stroke drawing itself', traced.length > 0 && traced.every((m) => m.lesson.script.some((line) => line.show && line.show.kind === 'trace')), traced.filter((m) => !m.lesson.script.some((line) => line.show && line.show.kind === 'trace')).map((m) => m.id).join(', '));
// Round shapes are drawn round (pass KA, Mikey's phone screenshot): a circle once showed eight corners and the wave looked
// like a zigzag, because straight lines joined the points a finger passes. These carry `curve`, so the app draws them smooth.
const ROUND = ['O', 'C', 'o', 'c', '0', '6', '8', 'line-circle', 'line-wave', 'shape-circle'];
const flatRound = ROUND.filter((k) => !(L.TRACE_LETTERS[k] && Array.isArray(L.TRACE_LETTERS[k].curve)));
ok('every round trace shape is drawn as a curve', flatRound.length === 0, flatRound.join(', '));
ok('every spoken lesson line reads like a person talking', fragments.length === 0, '\n  ' + fragments.slice(0, 12).join('\n  '));
ok('every young-learner question names or points at its picture', qbad.length === 0, '\n  ' + qbad.slice(0, 12).join('\n  '));
ok('every lesson picture matches the words spoken over it', mismatches.length === 0, '\n  ' + mismatches.slice(0, 12).join('\n  '));
// A thing to look at is drawn (pass LU): every picture a lesson shows or a question offers as art has a line drawing in
// src/ui.jsx, so while its Leonardo coloring page is on the way a lesson or a question draws it instead of a placeholder card.
{
  const ui = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8');
  const from = ui.indexOf('const COLORING_ART = {'); const block = ui.slice(from, ui.indexOf('\n};', from));
  const drawn = new Set([...block.matchAll(/^  '?([a-z-]+)'?: \[$/gm)].map((m) => m[1]));
  const used = new Set(Object.values(L.MATCH_THEMES).filter((th) => th.kind === 'art').flatMap((th) => th.items));
  const walk = (v) => { if (!v || typeof v !== 'object') return; if (v.kind === 'art' && v.name) used.add(v.name); walk(v.a); walk(v.b); };
  for (const m of L.MODULES) {
    for (const line of (m.lesson && m.lesson.script) || []) walk(line.show);
    walk(m.lesson && m.lesson.example);
    for (const g of new Set(m.generators)) for (let seed = 1; seed <= 20; seed++) { const q = L.generateQuestion(g, seed); walk(q.visual); walk(q.explainVisual); for (const c of q.choices || []) if (/^art:/.test(c)) used.add(c.slice(4).split('#')[0]); }
  }
  const missing = [...used].filter((n) => !drawn.has(n));
  ok('every picture a lesson or a question shows as art has a line drawing to fall back on', used.size >= 10 && missing.length === 0, missing.join(', '));
  ok('lessons and questions draw a thing, never its coloring page placeholder', ui.includes("<ColorThumb picture={visual.name} size={at(120)} thing />") && ui.includes("<ColorThumb picture={c.slice(4).split('#')[0]} size={Math.round(84 * k)} thing />") && ui.includes('const THING_LINE_ART = '));
}
// The stand-in note (pass LW, Mikey): his exact words, worn by a lesson line's drawing while its painting is on the way, by a
// story's drawn fallback and by a thing drawn in place of its coloring page; on a question only in a walk-through, where no
// child is answering, and once a picture (half of a pair never adds a second one). Explanation pictures of every validated
// kind are drawn (pass LW; only bars and dots were).
{
  const ui = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8');
  ok('the stand-in note says exactly what Mikey asked', ui.includes(`const REPLACE_NOTE = "To be replaced with Mikey's provided image.";`) && (ui.match(/\{REPLACE_NOTE\}/g) || []).length === 1);
  ok('a lesson line whose painting is on the way, and a story drawn in its place, wear the note', ui.includes('<Picture visual={visual} animate animKey={animKey} note big />') && ui.includes('<Picture visual={fallback} note />'));
  ok('a question shows the note only in a walk-through, and half of a pair never adds a second one', (ui.match(/note=\{record\.preview \? undefined : false\}/g) || []).length === 3 && ui.includes('<Picture visual={v} note={false} bare />') && ui.includes("const standIn = !!(record && record.preview) && /^art:/.test(c) && thingStandIn("));
  ok('the note decides a thing is a stand-in the same way the drawing does', ui.includes('const pageSerial = thing && DRAWN_PAGES[picture] ? DRAWN_PAGES[picture][0] : null;') && ui.includes('if (!page || !THING_LINE_ART[picture]) return false;'));
  ok('every explanation picture kind the rules test validates reaches the screen', ui.includes(`q.explainVisual.kind !== 'dots' && <div data-explain-picture="" style={{ marginTop: 8 }}><Picture visual={q.explainVisual}`));
}
// Better pages (pass LX, Mikey): the star keeps its own drawing, marked as a stand-in in lessons, questions and its coloring
// page, until its Leonardo page G1 is saved; then the page replaces it everywhere.
{
  const ui = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8');
  ok('the star waits for its Leonardo page, drawn and marked, never a placeholder', ui.includes("const BETTER_PAGES = { star: ['G1',") && ui.includes('[...Object.keys(DRAWN_PAGES), ...Object.keys(BETTER_PAGES)]') && ui.includes('const page = DRAWN_PAGES[picture] || BETTER_PAGES[picture];') && ui.includes('if (betterPainted(serial)) COLORING_ART[pic] =') && ui.includes('{BETTER_PAGES[picture] && !betterPainted(BETTER_PAGES[picture][0]) && <ReplaceNote'));
}
// Wonder voices by name (pass LY, Mikey): every place a Wonder voice shows or is read aloud goes through the person, so no
// screen can fall back to 'A scientist'.
{
  const ui = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8');
  // Since pass MG a pre-reader's cards are spoken through wonderCardSpoken in logic, which says each voice with wonderVoiceSpoken,
  // so the screen's spoken voices are counted through either, and logic's one must use the named form.
  { const logicSrc = readFileSync(new URL('../src/logic.mjs', import.meta.url), 'utf8'); const cardFn = logicSrc.slice(logicSrc.indexOf('export function wonderCardSpoken'), logicSrc.indexOf('export function wonderSpokenParts'));
    ok('every Wonder voice on screen is shown and spoken by name', !/\{(p|v)\.voice\}<\/(p|span)>/.test(ui) && !ui.includes('`${v.voice}:`') && (ui.match(/<VoiceName /g) || []).length >= 4 && (ui.match(/wonderVoiceSpoken\(|wonderCardSpoken\(/g) || []).length >= 3 && cardFn.includes('wonderVoiceSpoken(card.voice)') && !ui.includes('${v.voice}. ') && !ui.includes('${p.voice} says')); }
}
// No white drawing on a gold or green tap (pass MG, Mikey's answer to Q23, "change"): read from the source, every element filled
// with C.gold or C.green holds no white up to that element's end, so the shelf's cover badge and the result and story arrows are
// held as well as the three taps the dark walk measures (the code check: those three were the only ones a test reached).
{ const ui = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8');
  const filled = /background: (?:[^,}]*\? )?C\.(?:gold|green)\b[^,}]*[,}]/g;
  const white = /['"]#(?:fff|ffffff)['"]|['"]white['"]|\bB\.onAccent\b|rgba?\(\s*255\s*,\s*255\s*,\s*255\b/i;
  const hits = [...ui.matchAll(filled)];
  const bad = hits.filter((m) => { const rest = ui.slice(m.index, m.index + 1500); const end = rest.search(/<\/(?:button|span|a|div|label|p)>/); return white.test(rest.slice(0, end < 0 ? 1500 : end)); }).map((m) => ui.slice(0, m.index).split('\n').length);
  ok('no drawing on a gold or green tap is white (Q23)', hits.length >= 20 && bad.length === 0, `filled ${hits.length}, white at lines ${bad.join(',')}`); }
// A best score sticks (pass MI, the game check): the play clock's save, its time-up and a game's score build the saved play state
// from colorStateNow (the latest), never from the colorState a closure caught when the game opened; and quiet words on a game's
// paper (the Begin line, the shooter's, Catch's and Quick fire's end lines) take paperMuted, whose dark value reads 4.5 to 1 or
// better on the dark theme's paper (Mikey: the line under Begin looked oddly colored).
{ const ui = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8');
  const clock = ui.slice(ui.indexOf('const id = setInterval(() => setColorLeft((n) => {'), ui.indexOf('return () => clearInterval(id);', ui.indexOf('const id = setInterval(() => setColorLeft((n) => {')));
  const score = ui.slice(ui.indexOf('onScore={(value, better, extra = null) => {'), ui.indexOf('}} name={displayName}', ui.indexOf('onScore={(value, better, extra = null) => {')));
  ok('the play clock and a game\'s score build the saved play state from the latest (colorStateNow), and the time-up keeps the best', clock.length > 100 && score.length > 100 && !/\.\.\.colorState[,\[]|colorState\[coloring\]/.test(clock + score) && /colorStateNow\.current/.test(clock) && /colorStateNow\.current/.test(score) && /\.\.\.\(latest\[coloring\] \|\| \{\}\), left: playSecs/.test(clock));
  const dark = (ui.match(/const paperMuted = \(\) => \(C\.mode === 'dark' \? '(#[0-9A-F]{6})'/) || [])[1]; const paper = (ui.match(/mode: 'dark',[\s\S]*?paperBoard: '(#[0-9A-F]{6})'/) || [])[1];
  const lum = (hex) => { const v = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };
  const ratio = dark && paper ? (Math.max(lum(dark), lum(paper)) + 0.05) / (Math.min(lum(dark), lum(paper)) + 0.05) : 0;
  const lines = ['The game starts moving when you tap Begin.', 'before your last ship was gone.', 'Time. Tap the round arrow to go again.', 'caught</p>'];
  const muted = lines.filter((w) => { const at = ui.indexOf(w); const open = ui.lastIndexOf('<p', at); return at < 0 || !ui.slice(open, at).includes('paperMuted()'); });
  ok('quiet words on a game\'s paper take paperMuted, which reads 4.5 to 1 or better on the dark theme\'s paper', ratio >= 4.5 && muted.length === 0, `${ratio.toFixed(2)} ${muted.join(' | ')}`); }
// The finished course's words (pass MG, Mikey's answer to Q24, "calmer") come from logic wherever a screen shows them, so the
// grade 6 and up line can never drift back to the party's on one screen (the code check: a typed-in result line passed every test).
{ const ui = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8');
  const lines = [...ui.matchAll(/data-course-finished-line=""[^>]*>\{([^}]+)\}/g)].map((m) => m[1].trim());
  // Since pass MI (Mikey's answer to Q37, "celebrate") a quick check that completes a course shows the line too.
  ok("every reader result screen (a round, a Quick Review and, since pass MI, a quick check) takes the finished course's line from logic, and no screen types the party's words itself", lines.length === 3 && lines.every((x) => /^courseFinishedWords\((?:rc(?:, reviewStage)?|course(?:, stage)?|qcCourse, qcStage)\)\.result$/.test(x)) && !ui.includes('That was the whole course!') && !ui.includes('That was every lesson in the course') && !/['`"]Hooray! You (finished|did|passed|earned)/.test(ui) && ui.includes('courseFinishedWords(cc, stage).cheer'), JSON.stringify(lines)); }
// Since pass MH a course celebrates twice, and the words of both come from logic (courseFinishedWords with its stage).
// A result keeps a tracing as whether it was traced, never the strokes a child's finger drew (pass MH, the code check's second
// read): read from the source, every result the practice screen builds takes `kept`, which holds no stroke for a trace question.
{ const ui = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8');
  const rows = [...ui.matchAll(/const result = \{ genId: q\.genId[^\n]*/g)].map((m) => m[0]);
  const loose = rows.filter((r) => !r.includes('given: kept,') && !r.includes("given: 'I do not know',"));
  ok('a result never keeps the strokes of a tracing, only whether it was traced, and the where-note never holds them either', rows.length >= 2 && loose.length === 0 && rows.some((r) => r.includes('given: kept,')) && ui.includes("const kept = q.type === 'trace' ? (correct ? 'traced' : 'not traced') : String(given);") && ui.includes("given: q && q.type === 'trace' ? '' : given,"), JSON.stringify(loose.map((r) => r.slice(0, 160)))); }
// An eraser is the paper (pass MH, the alignment read): kept as 'paper' and drawn in the paper's own color, so the dark theme's
// light green paper never takes white streaks (white only where strokes multiply over a painted page, where white leaves the art).
{ const ui = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8');
  ok("an eraser stroke is kept as the paper and drawn in the paper's color", ui.includes("eraser ? { colour: 'paper', width: eraser") && ui.includes("stroke={st.colour === 'paper' || st.colour === '#FFFFFF' ? (parts.some((p) => p.t === 'art') ? '#FFFFFF' : C.paperBoard) : st.colour}") && !ui.includes("eraser ? { colour: '#FFFFFF'"));
  // The name page's letters are the paper too, as the thumbnail draws them, so an erased letter matches an untouched one; and a
  // coloring mask's backdrop is white, which in a mask means fully shown, so every crayon keeps its full color in the dark theme
  // (the code check's second read of the late fixes: the paper's light green let only about 88 percent through).
  const backs = [...ui.matchAll(/<mask id="edu-(?:name|edge)-guard"[\s\S]*?<rect x="-60" y="-60" width="220" height="220" fill=([^ ]+) \/>/g)].map((m) => m[1]);
  ok("the name page's letters are drawn in the paper's color, and both coloring masks let every crayon through whole", ui.includes('fontWeight="700" fill={C.paperBoard} stroke="#2E2E2E" strokeWidth={n.size * 0.055}') && backs.length === 2 && backs.every((b) => b === '"#FFFFFF"'), JSON.stringify(backs)); }
// Nothing in the app component's body reads a state declared lower down (pass MI, the late fixes: a ref set in the body above
// moduleId's useState line crashed every story screen, and only where its && reached moduleId, so the smoke test, which draws the
// first screen, never saw it; question-screens found it). Read here: the body's own lines (two spaces in), a state's first value,
// a plain value that is not a function, every ref or variable set in the body, and every hook's dependency list, with strings
// and property names left out. A function's body may read later states, since it runs after the render that defines it.
{ const ui = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8');
  const start = ui.indexOf('function EduSphereScreens('); const lines = ui.slice(start, ui.indexOf('\n}\n', start)).split('\n');
  const declared = new Map();
  lines.forEach((line, i) => { const m = line.match(/^  const \[(\w+), (\w+)\] = useState\b/); if (m) { declared.set(m[1], i); declared.set(m[2], i); } });
  const strip = (t) => t.replace(/\/\/.*$/, '').replace(/'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`/g, "''").replace(/\.\s*[A-Za-z_$][\w$]*/g, '');
  const early = new Set();
  lines.forEach((raw, i) => {
    if (!/^  \S/.test(raw) || /^  \/\//.test(raw)) return;
    const line = strip(raw); const parts = []; let m;
    if ((m = line.match(/^  const \[\w+, \w+\] = useState\((.*)$/))) parts.push(m[1]);
    if ((m = line.match(/^  const (?:\w+|\{[^}]*\}|\[[^\]]*\]) = (.*)$/)) && !/^(?:\([^)]*\)|\w+)\s*=>|^async\b|^function\b|^useCallback\(/.test(m[1])) parts.push(m[1]);
    for (const r of line.matchAll(/(?:^  |;\s*)\w+ = ([^;]*)/g)) parts.push(r[1]);
    if ((m = line.match(/^  \}?\)?,\s*(\[[^\]]*\])\);?\s*$/))) parts.push(m[1]);
    if ((m = line.match(/^  (?:const \w+ = )?use(?:Effect|Memo|LayoutEffect|Callback)\(.*,\s*(\[[^\]]*\])\);\s*$/))) parts.push(m[1]);
    for (const p of parts) for (const id of p.match(/[A-Za-z_$][\w$]*/g) || []) { const at = declared.get(id); if (at !== undefined && at > i) early.add(`${id} (body line ${i}, declared on ${at})`); }
  });
  ok("the app component's body reads no state above the line that declares it", declared.size > 300 && early.size === 0, [...early].slice(0, 6).join('; ')); }
console.log(`\n${pass} passed, ${fail} failed`);
process.exitCode = fail ? 1 : 0;   // never process.exit(): it can drop the last lines of a piped stdout (2026-09-23)
