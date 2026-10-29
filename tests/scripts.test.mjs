// Every spoken lesson line must make sense with the picture beside it, and read like a
// person talking rather than a list of words. This checks all of them.
import * as L from '../src/logic.mjs';
import { readFileSync } from 'node:fs';

let pass = 0, fail = 0;
const ok = (name, cond, detail = '') => { if (cond) { pass++; console.log('PASS -', name); } else { fail++; console.log('FAIL -', name, detail); } };
const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety', 'hundred'];
const nameOnly = (sentence) => /^[A-Za-z]$/.test(sentence) || NUMBER_WORDS.includes(sentence.toLowerCase()) || /^[A-Za-z]([, ]+[A-Za-z])+$/.test(sentence);

const fragments = []; const mismatches = [];
// Lines whose start-with words wait for their grade's pass (EARMARKS A27): pre-K 4's Big letters says apple starts with A over
// the letter A alone, and kindergarten's Letter names says Jam starts with J over JAM with nothing lit. The list may only shrink,
// and a line fixed comes off it.
const START_WAITS = ['letter-names 4']; const startWaited = [];   // Big letters' apple has a line of its own since pass MM
// Drawn things inside a pair or a row that older lessons' lines never name (pass MQ; EARMARKS A49): each waits by module and name
// until its course's review names it or shows what the line says. The list may only shrink. Since round two's lesson read it holds
// the lone icon too, and the lines that open with an instruction word (Two steps' and Three steps' cups, spoons and chair on "Listen
// to both steps", Colours' coat on "Look at your clothes.").
const PAIR_PICTURE_WAITS = ['two-steps:cup', 'two-steps:spoon', 'three-steps:cup', 'three-steps:spoon', 'three-steps:chair', 'colours:coat', 'listen-and-tap-pictures:cup', 'listen-and-tap-pictures:bird', 'listen-and-tap-pictures:flower', 'two-steps:tree', 'sort-by-looks:ball', 'sort-by-looks:sock', 'kinds-of-rocks:flatrock', 'rocks-soil-and-water:drop', 'people-who-shaped-us:quarter', 'people-who-shaped-us:globe', 'land-water-and-weather:sun', 'land-water-and-weather:ocean', 'tools-that-help:fridge', 'tools-that-help:tablet', 'tools-that-help:ball', 'helpers-all-around:fire', 'helpers-all-around:doctor', 'helpers-all-around:whiteboard', 'helpers-all-around:plate', 'helpers-all-around:spoon', 'helpers-all-around:teddy', 'good-friend:block', 'good-friend:ball', 'longer-and-heavier:teacup'];
const pairPictureWaited = new Set();
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
    // A line that says which words start with a letter shows each word it names, first letters lit, and each starts with that
    // letter (pass MK, the lesson check: "Bear, boat and book start with B. Acorn and arrow start with A." showed only Bear, its B
    // lit while the voice said start with A). Since the second read the list may open a sentence or follow a comma inside one
    // (", and apple starts with A."), a line with nothing lit fails, and a pronoun (", and it starts with J.") is read for the
    // lighting alone, since it names no word to find. A line that waits for its grade's pass is in START_WAITS (EARMARKS A27).
    if (show.kind === 'letters') { const shown = show.text.split(/\s+/).filter(Boolean); const where = `${mod.id} ${(mod.lesson.script || []).indexOf(line)}`; const wrong = [];
      for (const m of line.say.matchAll(/(?:^|[.!?]\s+|,\s+(?:and\s+)?)([A-Za-z][a-z]+(?:, [a-z]+)*(?: and [a-z]+)?) starts? with ([A-Z])\b/g)) {
        if (!/^(?:it|this|that|they|these|those)$/i.test(m[1])) for (const w of m[1].toLowerCase().split(/, | and /)) { const hit = shown.find((x) => x.toLowerCase() === w); if (!hit) wrong.push(`${mod.id}: "${line.say}" says ${w} starts with ${m[2]} but shows "${show.text}"`); else if (hit[0].toUpperCase() !== m[2]) wrong.push(`${mod.id}: "${line.say}" shows ${hit}, which does not start with ${m[2]}`); }
        if (show.highlight !== 'first') wrong.push(`${mod.id}: "${line.say}" lights ${show.highlight || 'nothing'}, not each word's first letter`); }
      if (wrong.length) { if (START_WAITS.includes(where)) startWaited.push(where); else mismatches.push(...wrong); } }
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
    // A drawn icon, alone or in a pair or a row, and a drawn picture in a pair or a row, is named by its line (pass MQ). This runs
    // before the skip for instruction lines below (round two's lesson read, pass MQ: the skip came first, so "Listen for learning
    // words." showed a teacher it never named, and an unnamed cup added to that line passed), since the skip keeps a reading lesson
    // from speaking a printed word, and a drawn picture is never one. An older line waits by name (PAIR_PICTURE_WAITS, EARMARKS A49).
    { const drawn = show.kind === 'icon' ? [show] : show.kind === 'pair' ? [show.a, show.b] : show.kind === 'row' ? (show.items || []) : [];
      for (const h of drawn) {
        if (!h || !(h.kind === 'icon' || h.kind === 'art')) continue;
        const base = String(h.name).split('~')[0]; if (said.includes(base)) continue;
        const key = `${mod.id}:${base}`;
        if (PAIR_PICTURE_WAITS.includes(key)) pairPictureWaited.add(key); else mismatches.push(`${mod.id}: "${line.say}" shows a ${h.name} it never names`);
      } }
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
    // An icon's look after a ~ (pass MP: plate~food, the plate with its food groups; block~wood) is the same thing drawn another way;
    // the lone icon is read with the drawn pictures above the instruction skip (round two's lesson read, pass MQ).
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
      // A drawn icon or picture inside a pair or a row is read above the instruction skip (pass MQ).
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
    else if (v.kind === 'icon') fine = text.includes(String(v.name).split('~')[0]);
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
// Since pass MO (the proof of round one's checks: Two ideas with its triangle line removed passed, since the lesson's paragraphs
// still named the triangle) a read-aloud lesson with a spoken script is read by what the child hears, the script alone, since its
// paragraphs never reach a pre-reader (CLAUDE.md, spoken lessons). HEARD_WAITS lists the lessons whose script waits for their
// grade's review (EARMARKS A44); the list may only shrink, and a lesson fixed comes off it.
const HEARD_WAITS = ['big-and-small-letters']; const heardWaited = new Set();
for (const id of reviewedIds) { const m = L.getModule(id); if (!m) continue;
  const course = L.COURSES.find((c) => c.modules.some((x) => x.id === id)); const heard = !!(course && course.readAloud && (m.lesson.script || []).length);
  const oldRaw = [...m.lesson.paragraphs, m.lesson.keyIdea, (m.lesson.example || {}).caption || '', ...L.readAloudScript(m).map((s) => s.say)].join(' ');
  const raw = heard ? L.readAloudScript(m).map((s) => s.say).join(' ') : oldRaw; const low = raw.toLowerCase();
  // Whole words, a plural allowed, over 400 seeds since round two's lesson check (pass MO): a prefix let "bee" pass on "been", and 60
  // seeds never dealt Letters' U and X.
  for (const g of new Set(m.generators)) for (let seed = 1; seed <= 400; seed++) for (const w of L.askedNames(L.generateQuestion(g, seed))) {
    // A waiting lesson is still read the old way, by its paragraphs and script, so a name said in neither fails (round two's code
    // check, pass MO: the waits had skipped a waiting lesson whole).
    const said = (text, lower) => (/^[A-Z]$/.test(w) ? new RegExp(`\\b${w}\\b`).test(text) : new RegExp(`\\b${w}(?:s|es)?\\b`).test(lower));
    if (!said(raw, low)) { if (HEARD_WAITS.includes(id)) { heardWaited.add(id); if (!said(oldRaw, oldRaw.toLowerCase())) namesBad.add(`${id}: ${w}`); } else namesBad.add(`${id}: ${w}`); }
  } }
ok('every picture or letter a reviewed lesson\'s questions ask for by name is said in that lesson, in its spoken script for a pre-reader', namesBad.size === 0, [...namesBad].join(', '));
ok('the lessons whose spoken script waits for their grade (EARMARKS A44) still wait, and come off the list once fixed', HEARD_WAITS.every((id) => heardWaited.has(id)), HEARD_WAITS.filter((id) => !heardWaited.has(id)).join(', '));
// Since round two's lesson check (pass MO): a direction or a sentence of two ideas carries its answer in its words, so every word the
// directions' and two ideas' kinds can say (DIRECTION_WORDS, from their own lists) that a question says in its setup or prompt is
// said in its own lesson's spoken script, as a whole word, over 400 seeds; deleting Two ideas' sock and block line, or a sound
// line, had passed every check. Six lessons are read since pass MR split three of them (Q70): Two steps, Two steps every day, Two
// ideas, Who has what, Three steps and Three steps every day.
{ const bad = new Set(); const whole = (w, t) => new RegExp(`\\b${w}(?:s|es)?\\b`, 'i').test(t); let read = 0;
  for (const id of reviewedIds) { const m = L.getModule(id); if (!m || !m.generators.some((g) => /-(?:steps|ideas)-/.test(g))) continue; read += 1;
    const said = L.readAloudScript(m).map((s) => s.say).join(' ');
    for (const g of new Set(m.generators)) for (let seed = 1; seed <= 400; seed++) { const q = L.generateQuestion(g, seed); const heard = `${q.story || ''} ${q.prompt || ''}`;
      for (const w of L.DIRECTION_WORDS) if (whole(w, heard) && !whole(w, said)) bad.add(`${id}: ${w}`); } }
  ok('every word a direction or a sentence of two ideas says is said in its own lesson\'s spoken script first', read === 6 && L.DIRECTION_WORDS.length >= 40 && bad.size === 0, [...bad].join(', '));
}
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
// The waiting list only falls (pass MQ): every entry still waits on a line, so a fixed line takes its name off the list.
ok('the drawn things older lessons show without naming them wait by name, on every line, and every name on the list still waits', PAIR_PICTURE_WAITS.every((k) => pairPictureWaited.has(k)), PAIR_PICTURE_WAITS.filter((k) => !pairPictureWaited.has(k)).join(', '));
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
// child is answering, and once a picture (half of a pair never adds a second one; since pass MN round one's screen check a pair's
// two drawings grow on a wide screen in a lesson, big={wide}, and still add none). Explanation pictures of every validated
// kind are drawn (pass LW; only bars and dots were).
{
  const ui = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8');
  ok('the stand-in note says exactly what Mikey asked', ui.includes(`const REPLACE_NOTE = "To be replaced with Mikey's provided image.";`) && (ui.match(/\{REPLACE_NOTE\}/g) || []).length === 1);
  ok('a lesson line whose painting is on the way, and a story drawn in its place, wear the note', ui.includes('<Picture visual={visual} animate animKey={animKey} note big lesson />') && ui.includes('<Picture visual={fallback} note />'));
  ok('a question shows the note only in a walk-through, and half of a pair never adds a second one', (ui.match(/note=\{record\.preview \? undefined : false\}/g) || []).length === 3 && ui.includes('<Picture visual={v} note={false} bare big={wide} />') && ui.includes("const standIn = !!(record && record.preview) && /^art:/.test(c) && thingStandIn("));
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
// What a pre-reader hears after an answer leans only on words the spoken lesson said (pass MJ, the lesson check: every More and
// Fewer explanation said "because you count past three to get to four", while only a written paragraph, which a pre-reader never
// hears, said count past). Read here: each read-aloud lesson's questions over 60 seeds, their explanations and More Info reasons,
// for the counting phrases count past and count on, which the lesson's script must say whenever its questions do.
{ const PHRASES = ['count past', 'count on'];
  { const stale = START_WAITS.filter((x) => !startWaited.includes(x));
    ok('the two start-with lines that wait for their grades (EARMARKS A27) still wait, and come off the list once fixed', stale.length === 0, `fixed ${stale.join('; ')}`); }
  // Kindergarten's four wait for its sweep (EARMARKS A25); the list may only shrink, and a lesson fixed comes off it.
  const WAITING = ['comparing-numbers: count past', 'sorting: count past', 'more-and-fewer-10: count past', 'picture-graphs-k: count on'];
  const missing = [];
  for (const c of L.COURSES.filter((x) => x.readAloud)) for (const m of c.modules) {
    let script = ''; try { script = L.readAloudScript(m).map((l) => (typeof l === 'string' ? l : l.say || l.text || '')).join(' ').toLowerCase(); } catch (e) { continue; }
    const heard = new Set();
    for (const g of new Set(m.generators || [])) for (let sd = 1; sd <= 60; sd++) { let q; try { q = L.generateQuestion(g, sd); } catch (e) { continue; } if (!q) continue; const words = [q.explain || '', ...Object.values(q.whyNot || {}).map((e) => (L.whyNotSentence ? L.whyNotSentence(e) : ''))].join(' ').toLowerCase(); for (const p of PHRASES) if (words.includes(p)) heard.add(p); }
    for (const p of heard) if (!script.includes(p)) missing.push(`${m.id}: ${p}`);
  }
  const fresh = missing.filter((x) => !WAITING.includes(x)); const stale = WAITING.filter((x) => !missing.includes(x));
  ok('a counting phrase a pre-reader hears after an answer (count past, count on) is said in that lesson\'s spoken script, but for the four kindergarten lessons that wait (EARMARKS A25)', fresh.length === 0 && stale.length === 0, `new ${fresh.join('; ')} fixed ${stale.join('; ')}`); }
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
// A young path board shows no clock, so its tile shows no seconds; every shape chip on a game board wears the word chips' thin
// dark outline (pass MK, the game check; read from the source since the alignment read, when RULES-AUDIT named a test of them
// that did not exist).
{ const ui = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8'); const body = (ui.match(/function bestLine\(game, kept\) \{[\s\S]*?\n\}/) || [''])[0]; const chip = (ui.match(/function SvgChip\([\s\S]*?\n\}/) || [''])[0];
  ok("a young path game's Let's Play tile shows no seconds", /if \(game\.kind === 'path' && game\.young\) return null;[\s\S]*BEST_SECONDS\.has/.test(body));
  // Find the Letter (pass MM) keeps no score, so its tile shows none, though Spot It's tile keeps its seconds; it plays on a board
  // of its own, chosen where the game opens, and has a tile of its own; and the Fish, like the kite, says its name at the end.
  ok("Find the Letter's tile shows no best, its own board and tile are chosen for it, and the Fish says its name when its last dot joins", /if \(game\.kind === 'spot' && game\.spot === 'letters'\) return null;[\s\S]*BEST_SECONDS\.has/.test(body)
    && /const Game = game\.kind === 'spot' && game\.spot === 'letters' \? FindLetterGame : GAME_OF\[game\.kind\];/.test(ui) && /if \(game && game\.kind === 'spot' && game\.spot === 'letters'\) return <svg/.test(ui)
    && /const DOT_PICTURE_NAMES = \{ kite: 'A kite!', fish: 'A fish!' \};/.test(ui) && /done && game\.shape === 'fish' && <g data-fish-eye/.test(ui));
  ok('every shape chip on a game board wears a thin dark outline', /const edge = \{ stroke: '#2E2E2E', strokeWidth: 0\.6 \}/.test(chip) && (chip.match(/\{\.\.\.edge\}/g) || []).length === 4); }
// A connect-the-dots demo draws its numbers after the ink, each with a halo, so a finished picture shows every number its line
// counts (pass ML, the code check's second read: the finished house had hidden its 4 and 5, the star its 2, 5, 7 and 10).
{ const ui = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8'); const at = ui.indexOf('function TraceDemo('); const td = ui.slice(at, ui.indexOf('\n}\n', at));
  const ink = td.indexOf('className="edu-trace-draw"'); const nums = td.indexOf('key={`num-${i}`}');
  ok('a connect-the-dots demo draws its numbers after the ink, with a halo of the card\'s color', at > 0 && ink > 0 && nums > ink && /key=\{`num-\$\{i\}`\}[^\n]*stroke=\{C\.surface\}/.test(td)); }
// Look Closely's own tile (pass ML, round three): GameThumb draws a pics game as two cards with the fox and the cat, so a
// pre-reader can tell it from kindergarten's Pairs, whose tile is the cards alone.
{ const ui = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8'); const at = ui.indexOf('function GameThumb('); const body = ui.slice(at, ui.indexOf('\n}\n', at));
  ok('a pics game has a tile of its own, two cards with the fox and the cat', /game\.kind === 'pairs' && game\.pics\) return <svg data-pics-thumb=""/.test(body) && /\['fox', \d+\], \['cat', \d+\]/.test(body) && /<StudentPicture name=\{n\}/.test(body)); }
// Pass MO (round one's lesson and screen checks, and round two's story check): a lesson line that teaches a direction's numbers shows
// them on the line before's own pictures, where that line's direction lands its taps, each step from one up once and in the order the
// line before says them, every other picture without one, as practice draws it (StepBadge in a tile, in PictureInner's pair and row).
{ const ui = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8'); const bad = []; let read = 0;
  for (const mod of L.MODULES) { const script = mod.lesson.script || []; script.forEach((line, k) => { if (!/gets a number/i.test(line.say)) return; read += 1;
    const pics = (show) => (!show ? [] : show.kind === 'pair' ? [show.a, show.b] : show.kind === 'row' ? show.items || [] : []);
    const items = pics(line.show); const before = k > 0 ? script[k - 1] : null; const said = before ? before.say.toLowerCase() : '';
    // The direction is read from its first "tap", one step a name, and every step has its number (round three's content read: a
    // name's first "the" anywhere passed numbers in listing order under "Here are the book, the ball and the hat.", and Three steps
    // passed with its third number dropped); and the line's own words say which picture gets which number, as the row shows them.
    const steps = items.filter((v) => v && v.step).sort((a, b) => a.step - b.step);
    const from = said.search(/\btap\b/); const tapped = from < 0 ? [] : [...said.slice(from).matchAll(/\bthe (\w+)/g)].map((x) => x[1]);
    // A colored thing is named by its color (pass MR, round one's lesson check: Two steps every day's red one and blue one), and
    // a picture is told from another by its name, or its shape and color.
    const WORD = ['one', 'two', 'three', 'four']; const nm = (v) => v && (v.name || v.colour); const key = (v) => v && (v.name || [v.shape, v.colour].filter(Boolean).join('-'));
    const inOrder = steps.length >= 2 && steps.length === tapped.length && steps.every((v, i) => v.step === i + 1 && nm(v) === tapped[i])
      && steps.every((v) => new RegExp(`\\bthe ${nm(v)}(?: one${v.shape ? `| ${v.shape}` : ''})?(?: gets)? ${WORD[v.step - 1]}\\b`, 'i').test(line.say));
    const samePictures = !!before && JSON.stringify(items.map(key)) === JSON.stringify(pics(before.show).map(key));
    if (!inOrder || !samePictures) bad.push(`${mod.id} ${k}: "${line.say}"`); }); }
  ok('a lesson line that teaches a direction\'s numbers shows them on the line before\'s pictures, where its taps land, in order', read >= 2 && bad.length === 0 && (ui.match(/\{v\.step \? <StepBadge n=\{v\.step\} pal=\{B\} \/> : null\}/g) || []).length === 2 && (ui.match(/stepTile\(/g) || []).length >= 2, bad.join(' | '));
}
// An animation's transform takes the place of an element's own while it runs (pass MO): round six's code check found a lesson
// pair's 85 percent lost with motion on, its drift a transform, and round eight's read a Buckets chip that shook half its size off its
// spot while it wobbled, its centring transform given way to the wobble's (older than the pass). This reads ui.jsx with TypeScript's
// own parser (from npm root -g, the way the browser tests load Playwright): an element that wears an animation whose keyframes move
// transform, by a class its className names or by its inline animation, sets no transform of its own (a style key or an SVG
// attribute), unless every keyframes of that name starts and ends at that same transform (the read-along's lit letters rest at their
// own scale(1.12)). It reads the animations an element's className or inline style names. It does not see a class set from a
// variable, a transform in a spread or a style passed in, a rule whose selector list breaks across lines or reads a value before its
// animation, or an element a rule reaches by a tag (.edu-boot-word span), and the screen brief reads for those (round nine's read).
// The check runs on its own plants too.
{ const { execSync } = await import('node:child_process'); const { createRequire } = await import('node:module');
  const ts = createRequire(import.meta.url)(`${execSync('npm root -g').toString().trim()}/typescript`);
  const ui = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8');
  // A comma inside brackets (a cubic-bezier's) does not split a list of animations.
  const splitTop = (s) => { const out = []; let d = 0; let cur = ''; for (const ch of s) { if (ch === '(') d += 1; if (ch === ')') d -= 1; if (ch === ',' && d === 0) { out.push(cur); cur = ''; } else cur += ch; } out.push(cur); return out; };
  const animTransformProblems = (text) => {
    const inner = (open) => { let d = 0; for (let i = open; i < text.length; i += 1) { if (text[i] === '{') d += 1; else if (text[i] === '}') { d -= 1; if (d === 0) return text.slice(open + 1, i); } } return ''; };
    // Each keyframes that moves transform, with the transform it starts and ends at wherever it is written (null where a stop
    // leaves transform out, which keeps the element's own).
    const frames = new Map();
    for (const m of text.matchAll(/@keyframes\s+([A-Za-z][\w-]*)\s*\{/g)) { const body = inner(m.index + m[0].length - 1); if (!/\btransform\s*:/.test(body)) continue;
      const at = { start: null, end: null };
      for (const s of body.matchAll(/([^{}]+)\{([^{}]*)\}/g)) { const stops = s[1].split(',').map((x) => x.trim()); const t = /\btransform\s*:\s*([^;]+)/.exec(s[2]); const v = t ? t[1].trim() : null;
        if (stops.includes('0%') || stops.includes('from')) at.start = v; if (stops.includes('100%') || stops.includes('to')) at.end = v; }
      frames.set(m[1], [...(frames.get(m[1]) || []), at]); }
    // The classes whose rules run one, each read as the last class of a selector in the rule's list.
    const runs = new Map();
    for (const m of text.matchAll(/\{([^{}]*\banimation(?:-name)?\s*:[^{}]*)\}/g)) {
      const a = /\banimation(?:-name)?\s*:\s*([^;]+)/.exec(m[1]); const names = splitTop(a[1]).map((part) => part.trim().split(/\s+/).find((w) => frames.has(w))).filter(Boolean); if (!names.length) continue;
      const before = text.slice(0, m.index); const selector = before.slice(Math.max(before.lastIndexOf('}'), before.lastIndexOf('{'), before.lastIndexOf(';'), before.lastIndexOf('\n')) + 1);
      for (const part of selector.split(',')) { const cs = [...part.matchAll(/\.([A-Za-z][\w-]*)/g)]; if (cs.length) { const c = cs[cs.length - 1][1]; runs.set(c, [...new Set([...(runs.get(c) || []), ...names])]); } } }
    const byClass = [...runs].map(([c, ks]) => [new RegExp(`['"\`][^'"\`]*(?<![\\w-])${c}(?![\\w-])`), ks]);
    // An inline animation, its name in a string anywhere in its value, so one set by a condition is read too (round nine's read:
    // "animation: on ? 'edu-bob 2s' : 'none'" was not).
    const byInline = [...frames.keys()].map((k) => [new RegExp(`\\banimation(?:Name)?\\s*:[^,}]*?['"\`][^'"\`]*?(?<![\\w-])${k}(?![\\w-])`), k]);
    const sf = ts.createSourceFile('ui.jsx', text, ts.ScriptTarget.Latest, true, ts.ScriptKind.JSX);
    const flat = (s) => String(s).replace(/\s+/g, '');
    const bad = []; const kept = []; let worn = 0;
    const visit = (n) => {
      if (ts.isJsxOpeningElement(n) || ts.isJsxSelfClosingElement(n)) {
        let cls = ''; let style = null; let attr = null; let plant = '';
        for (const a of n.attributes.properties) { if (!ts.isJsxAttribute(a) || !a.initializer) continue; const k = a.name.getText(sf);
          if (k === 'className') cls = a.initializer.getText(sf); else if (k === 'style') style = a.initializer; else if (k === 'transform') attr = a.initializer; else if (k === 'data-plant') plant = a.initializer.getText(sf).replace(/['"]/g, ''); }
        const names = new Set(); const styleText = style ? style.getText(sf) : '';
        for (const [re, ks] of byClass) if (re.test(cls)) ks.forEach((k) => names.add(k));
        for (const [re, k] of byInline) if (re.test(styleText)) names.add(k);
        if (names.size) { worn += 1; let has = false; let own;
          const look = (e) => { if (ts.isPropertyAssignment(e) && e.name.getText(sf).replace(/['"]/g, '') === 'transform') { has = true; own = ts.isStringLiteral(e.initializer) || ts.isNoSubstitutionTemplateLiteral(e.initializer) ? e.initializer.text : undefined; } ts.forEachChild(e, look); };
          if (style) look(style);
          if (attr) { has = true; own = ts.isStringLiteral(attr) ? attr.text : undefined; }
          if (has) { const rests = own !== undefined && [...names].every((k) => frames.get(k).every((f) => flat(f.start ?? own) === flat(own) && flat(f.end ?? own) === flat(own)));
            (rests ? kept : bad).push(`line ${sf.getLineAndCharacterOfPosition(n.getStart(sf)).line + 1}${plant ? ` (${plant})` : ''}: <${n.tagName.getText(sf)}> wears ${[...names].join(', ')} and sets transform ${own === undefined ? '(not a plain string)' : own}`); } } }
      ts.forEachChild(n, visit); };
    visit(sf);
    return { bad, kept, worn };
  };
  const live = animTransformProblems(ui);
  ok('no element in ui.jsx wears an animation its className or inline style names that moves transform beside a transform of its own, unless the animation starts and ends at it (round six\'s lesson pairs, round eight\'s Buckets chip)', live.bad.length === 0 && live.worn >= 135 && live.kept.some((k) => /edu-stress/.test(k)), `${live.worn} worn, kept: ${live.kept.join(' | ')}; ${live.bad.join(' | ')}`);
  // Its near misses, written as they were in the code: round six's pair half (its 85 percent beside its drift) and round eight's
  // chip, a drawing turned by an SVG attribute and an inline animation must fail, and since round nine's read an inline animation
  // set by a condition and a class in a template literal, by a string inside it and by its own text (40 of the elements read wear
  // theirs so); the lit letter, a transform on a child and an animation that only fades must pass.
  const PLANTS = [['catch', 'pair', `<div data-plant="pair" className={animate ? 'edu-drift' : undefined} style={{ position: 'relative', transform: shrink && !inner ? 'scale(0.85)' : undefined }} />`],
    ['catch', 'chip', `<div data-plant="chip" className={wrong === ch.id ? 'edu-wobble' : undefined} style={{ position: 'absolute', transform: 'translate(-50%, -50%)', padding: '5px 9px' }} />`],
    ['catch', 'svg', `<g data-plant="svg" className="edu-sway" transform="translate(4 6)" />`],
    ['catch', 'inline', `<div data-plant="inline" style={{ animation: 'edu-bob 2s ease-in-out infinite', transform: 'scale(2)' }} />`],
    ['catch', 'condinline', `<div data-plant="condinline" style={{ animation: on ? 'edu-bob 2s ease-in-out infinite' : 'none', transform: 'scale(2)' }} />`],
    ['catch', 'template', `<div data-plant="template" className={\`edu-press\${bad ? ' edu-wobble' : ''}\`} style={{ position: 'absolute', transform: 'translate(-50%, -50%)' }} />`],
    ['catch', 'backtick', `<div data-plant="backtick" className={\`edu-breathe\${on ? ' edu-press' : ''}\`} style={{ transform: 'scale(2)' }} />`],
    ['keep', 'lit', `<span data-plant="lit" className={animate ? 'edu-stress' : undefined} style={{ display: 'inline-block', transform: 'scale(1.12)' }} />`],
    ['keep', 'child', `<div data-plant="child" className="edu-wobble"><div style={{ transform: 'translate(-50%, -50%)' }} /></div>`],
    ['keep', 'fade', `<div data-plant="fade" className="edu-note-in" style={{ transform: 'scale(2)' }} />`]];
  const planted = animTransformProblems(`${ui}\nconst __plants = () => (<>${PLANTS.map((p) => p[2]).join('')}</>);\n`);
  const wrongPlants = PLANTS.filter(([want, id]) => planted.bad.some((b) => b.includes(`(${id})`)) !== (want === 'catch')).map((p) => p[1]);
  ok('the animation and transform check fails each of its planted near misses and passes each fair one (10 plants: seven near misses it must fail and three fair ones it must pass)', wrongPlants.length === 0 && planted.bad.length === live.bad.length + 7, `wrong: ${wrongPlants.join(', ')}; ${planted.bad.join(' | ')}`);
}
// Every game's welcome can play its own board (pass MP, Mikey: "an animation playing the game at the same time to show how it
// works ... lining the animation up with the instructional audio"): read from each board's own source, every board takes the demo
// prop, and marks what its welcome's acts need: a tap or taps a data-demo-tap (or a Btn's mark, data-demo-next, or the shooter's
// data-demo-aim), a drag a data-demo-drag (its own, or DragCard's or SwipeCard's demo), a key data-demo-key, a follow
// data-demo-axis and data-demo-follow, and a replay, or a line that asks the question first, a ReplaySpeaker or data-demo-replay;
// and the pointer (makeDemoHands) handles every act the welcomes use. Its near misses beside it: Pairs with its tap mark taken out,
// Which Sense with no demo prop, Catch with its follow marks taken out, and a pointer that forgot drag. Since pass MS a line that
// names what it drags (picks) needs data-demo-what on its board's pieces and places; near miss: Sort with them taken out.
{
  const ui = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8');
  const introMarkProblems = (src) => {
    const go = src.slice(src.indexOf('const GAME_OF = {')); const ofKind = Object.fromEntries([...go.slice(0, go.indexOf('};')).matchAll(/(\w+): (\w+)/g)].map((m) => [m[1], m[2]]));
    const body = (name) => { const a = src.indexOf(`\nfunction ${name}(`); if (a < 0) return null; const b = src.indexOf('\nfunction ', a + 10); return src.slice(a, b < 0 ? undefined : b); };
    const hands = body('makeDemoHands') || ''; const bad = [];
    const NEEDS = { tap: /data-demo-tap|mark=\{|data-demo-next|data-demo-aim/, taps: /data-demo-tap|mark=\{|data-demo-next/, drag: /data-demo-drag|<DragCard[^>]*\bdemo\b|<SwipeCard[^>]*\bdemo\b/, key: /data-demo-key/, follow: /data-demo-axis[\s\S]*data-demo-follow|data-demo-follow[\s\S]*data-demo-axis/, replay: /<ReplaySpeaker|data-demo-replay/ };
    for (const act of L.GAME_INTRO_ACTS) if (act !== 'look' && !hands.includes(`act === '${act}'`) && !(act === 'look' && hands.includes("act === 'look'"))) bad.push(`the pointer does not know ${act}`);
    for (const g of L.GAMES) {
      const name = g.kind === 'spot' && g.spot === 'letters' ? 'FindLetterGame' : ofKind[g.kind]; const b = name && body(name);
      if (!b) { bad.push(`${g.id}: no board`); continue; }
      if (!/\bdemo = false\b/.test(b.split('\n')[1] || '')) bad.push(`${g.id}: ${name} takes no demo prop`);
      for (const l of L.gameIntro(g)) {
        if (NEEDS[l.act] && !NEEDS[l.act].test(b)) bad.push(`${g.id}: ${l.act} with nothing marked in ${name}`);
        // A line that names what it drags (picks, pass MS) needs its board to mark what each piece is and where each goes.
        if (l.picks && (b.match(/data-demo-what=/g) || []).length < 2) bad.push(`${g.id}: picks with no data-demo-what on its pieces and places in ${name}`);
        if (l.ask && !NEEDS.replay.test(b)) bad.push(`${g.id}: asks the question with no speaker beside it in ${name}`);
      }
    }
    return [...new Set(bad)];
  };
  const real = introMarkProblems(ui);
  const cut = (src, name, re) => { const a = src.indexOf(`\nfunction ${name}(`); const b = src.indexOf('\nfunction ', a + 10); return src.slice(0, a) + src.slice(a, b).replace(re, '') + src.slice(b); };
  const plants = [
    cut(ui, 'PairsGame', /data-demo-tap=\{[^}]*\}\}?|data-demo-tap/g),
    cut(ui, 'SenseGame', /, demo = false/),
    cut(ui, 'CatchGame', /data-demo-(axis|follow)/g),
    (() => { const a = ui.indexOf('\nfunction makeDemoHands('); const b = ui.indexOf('\nfunction ', a + 10); return ui.slice(0, a) + ui.slice(a, b).replace("act === 'drag'", "act === 'dragged'") + ui.slice(b); })(),
    cut(ui, 'SortGame', /data-demo-what=/g),
  ].map((src) => introMarkProblems(src).length > real.length);
  ok(`every game's board marks what its welcome's pointer needs, and the pointer knows every act (${L.GAMES.length} games; each near miss caught)`, real.length === 0 && plants.every(Boolean), [...real.slice(0, 8), `near misses ${plants}`].join(' | '));
}
// A young game that holds after a right answer (afterSaid) and keeps a clock stops the clock while it holds (pass MS, round one's
// code check: Spot It, Which Sense, Share the Cookies and Grow the Plant counted their holds, 2.2 seconds a right answer, so a best
// time from before the holds was out of reach, by 26 seconds in Spot It); the interval reads the hold from a ref. Near miss: Spot It
// with the clock that counts through its holds.
{ const ui = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8');
  const clockProblems = (src) => { const bad = []; let held = 0;
    for (const m of src.matchAll(/\nfunction (\w+Game)\(/g)) { const a = m.index; const b = src.indexOf('\nfunction ', a + 10); const body = src.slice(a, b < 0 ? undefined : b);
      if (!body.includes('afterSaid(') || !body.includes('setTicks((n) => n + 1)')) continue; held += 1;
      // The ref follows the very state the board's hold waits on, its afterSaid effect's own guard (round two's code check: a ref tied
      // to the wrong-tap nudge passed).
      const guard = (body.match(/useEffect\(\(\) => \{ if \(!(\w+)\) return undefined; return afterSaid\(/) || [])[1];
      if (!guard || !body.includes(`const holding = useRef(false); holding.current = !!${guard};`) || !/setInterval\(\(\) => \{ if \(!holding\.current\) setTicks\(\(n\) => n \+ 1\); \}, 1000\)/.test(body)) bad.push(m[1]); }
    return { bad, held }; };
  const real = clockProblems(ui); const spotAt = ui.indexOf('\nfunction SpotGame('); const spotEnd = ui.indexOf('\nfunction ', spotAt + 10);
  const plant = ui.slice(0, spotAt) + ui.slice(spotAt, spotEnd).replace('setInterval(() => { if (!holding.current) setTicks((n) => n + 1); }, 1000)', 'setInterval(() => setTicks((n) => n + 1), 1000)') + ui.slice(spotEnd);
  const plant2 = ui.slice(0, spotAt) + ui.slice(spotAt, spotEnd).replace('holding.current = !!cheer;', 'holding.current = !!nudge;') + ui.slice(spotEnd);
  ok(`every young game that holds after a right answer and keeps a clock stops it while it holds (${real.held} games; two near misses caught)`, real.held >= 4 && real.bad.length === 0 && clockProblems(plant).bad.includes('SpotGame') && clockProblems(plant2).bad.includes('SpotGame'), JSON.stringify(real)); }
// The chips a Buckets welcome drags are marked by logic's bucketDemoOrder over the chips not yet sorted, the rule the choice of its
// round reads too (pass MS, round one's code check: the board marked them by a find of its own, which agreed with logic only as
// written, and a change to either passed every test).
{ const ui = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8'); const a = ui.indexOf('\nfunction BucketsGame('); const b = ui.indexOf('\nfunction ', a + 10); const body = a < 0 ? '' : ui.slice(a, b);
  ok("Buckets marks the chips its welcome drags by logic's bucketDemoOrder, as the choice of its round does (pass MS, round one's code check)", /const demoOrder = demo \? bucketDemoOrder\(chips\.filter\(\(ch\) => placed\[ch\.id\] === undefined\)\) : \[\];/.test(body) && /demoOrder\.find\(\(ch\) => ch\.bin === bin\)/.test(body) && !/chips\.find\(\(ch\) => placed\[ch\.id\] === undefined && ch\.bin === bin\)/.test(body)); }
// How a board deals (pass MP, round one's code and game checks): every board that deals a run of items deals it through logic's
// own functions (dealIndex, mixOrder, mapOrder, jumpQuestions, balanceTargets, searchBoardAt), which the welcome's choice of round
// reads too (gameItems, demoRoundFor), and the welcome's board takes that round, so the rules test's check that the pointer's
// answers are none of the child's first three reads what the boards really deal. Near misses: a board that deals by its own sum
// again, and a welcome that plays one round for every game. Since round two's second read Buckets and Pairs deal here too (every
// Buckets welcome had dragged a chip the child's first board held), with a third near miss, Buckets dealing by its own sum again.
{
  const ui = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8');
  const BOARDS = { OrderGame: "dealIndex('order', round, k, deck.length)", EvidenceGame: "dealIndex('evidence', round, k, deck.length)", DebugGame: "dealIndex('debug', round, k, deck.length)", BuildGame: "dealIndex('build', round, k, deck.length)", FixGame: "dealIndex('fix', round, k, deck.length)", WalkGame: "dealIndex('walk', round, k, deck.length)", TeachGame: "dealIndex('teach', round, k, deck.length)", SpotGame: "dealIndex('spot', round, k, scenes.length)", MixGame: 'mixOrder(deck, round)', MapGame: 'mapOrder(map, round)', JumpGame: 'jumpQuestions(deck, round)', BalanceGame: 'balanceTargets(deck, round)', SearchGame: 'searchBoardAt(round, k, cards)', BucketsGame: 'bucketChips(deck, round)', PairsGame: 'pairCards(game, round)' };
  const dealProblems = (src) => {
    const bad = [];
    for (const [name, call] of Object.entries(BOARDS)) {
      const a = src.indexOf(`\nfunction ${name}(`); const b = a < 0 ? -1 : src.indexOf('\nfunction ', a + 10); const body = a < 0 ? '' : src.slice(a, b < 0 ? src.length : b);
      if (!body) { bad.push(`${name} is gone`); continue; }
      if (!body.includes(call)) bad.push(`${name} does not deal by ${call}`);
      if (/\[\(round[^\]]*%[^\]]*\]|lcg\(round \* (29|104729|7919) \+ (7|41|29|61|11|13)\)|searchBoard\(round \* 4/.test(body)) bad.push(`${name} deals by a sum of its own`);
    }
    if (!/const gameProps = \{ game, name, round: demoRoundFor\(game\),/.test(src)) bad.push("the welcome's board does not take its game's own round");
    return bad;
  };
  const real = dealProblems(ui);
  const plants = [ui.replace("deck[dealIndex('debug', round, k, deck.length)]", 'deck[(round * 3 + k) % deck.length]'), ui.replace('round: demoRoundFor(game),', 'round: 977,'), ui.replace('bucketChips(deck, round).map(', 'shuffle(lcg(round * 104729 + 11), deck.a.items).map(')].map((src) => dealProblems(src).length > real.length);
  ok(`every board that deals a run of items deals it by logic's own functions, and the welcome's board takes its game's own round (${Object.keys(BOARDS).length} boards; each near miss caught)`, real.length === 0 && plants.every(Boolean), [...real, `near misses ${plants}`].join(' | '));
}
// Q56 (Mikey's answer, pass MP, "Q56 - A"): every yellow shape and color square wears a thin darker edge in both themes, and the
// lessons' green wears one on the dark theme's paper, each edge 3 to 1 or better on white and on that paper, read from the source;
// the square and the shapes both draw it, and the fill stays the yellow the color lessons name. Since round one's screen check the
// green's edge is for the paper alone, as Q56 asked: a choice on the dark theme's answer tile tells its color squares, items and
// looks so (tile), where the green read 4.2 to 1 as it was and its edge 2.2. Near misses: an edge as pale as the yellow, a square
// that forgets its edge, a green edge drawn on the tiles too, and a color square on a tile that does not say it is on one.
{
  const ui = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8');
  const edgeProblems = (src) => {
    const hex = (re) => (src.match(re) || [])[1];
    const yellow = hex(/const SWATCH = \{[^}]*yellow: '(#[0-9A-F]{6})'/); const yEdge = hex(/const SWATCH_EDGE = \{ yellow: '(#[0-9A-F]{6})'/); const gEdge = hex(/const SWATCH_EDGE = \{[^}]*green: '(#[0-9A-F]{6})'/);
    const paper = hex(/mode: 'dark',[\s\S]*?paperBoard: '(#[0-9A-F]{6})'/);
    const lum = (h) => { const v = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };
    const cr = (a, b) => { const x = lum(a); const y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
    const bad = [];
    if (!yellow || !yEdge || !gEdge || !paper) return ['a color is missing from the source'];
    if (yellow !== '#F0C93A') bad.push(`the lessons' yellow changed to ${yellow}`);
    for (const [name, edge, on] of [['yellow on white', yEdge, '#FFFFFF'], ['yellow on the dark paper', yEdge, paper], ['green on the dark paper', gEdge, paper]]) if (cr(edge, on) < 3) bad.push(`${name} ${cr(edge, on).toFixed(2)} to 1`);
    if (!/function Swatch\([^)]*\) \{[^\n]*\n[^\n]*\{\.\.\.swatchEdge\(SWATCH\[colour\], 4, tile\)\}/.test(src)) bad.push('the color square draws no edge');
    if (!/const edge = swatchEdge\(color, 4, tile\)/.test(src)) bad.push('the shapes draw no edge');
    if (!/if \(fill === SWATCH\.green && C\.mode === 'dark' && !tile\)/.test(src)) bad.push("the dark theme's green wears its edge on the answer tiles too");
    for (const part of ['<LookGroup token={c} k={k} tile={!paper} />', '<Swatch colour={c.slice(7)} size={Math.round(64 * k)} tile={!paper} />', '<Item spec={c.slice(5)} size={Math.round(64 * k)} tile={!paper} />']) if (!src.includes(part)) bad.push(`a choice on its tile does not say so: ${part.slice(0, 30)}`);
    return bad;
  };
  const real = edgeProblems(ui);
  const plants = [ui.replace(/(const SWATCH_EDGE = \{ yellow: ')#[0-9A-F]{6}/, '$1#E8C24A'), ui.replace('{...swatchEdge(SWATCH[colour], 4, tile)}', ''), ui.replace("C.mode === 'dark' && !tile)", "C.mode === 'dark')"), ui.replace('<Swatch colour={c.slice(7)} size={Math.round(64 * k)} tile={!paper} />', '<Swatch colour={c.slice(7)} size={Math.round(64 * k)} />')].map((src) => edgeProblems(src).length > real.length);
  ok('Q56: every yellow shape and color square has its darker edge, and the dark theme\'s green on paper too, each 3 to 1 or better (each near miss caught)', real.length === 0 && plants.every(Boolean), [...real, `near misses ${plants}`].join(' | '));
}
// Pairs examples (round two's final read, pass MP): a Pairs game's welcome and its written help may give an example of a twin, but
// never a pair its own deck deals, and an example is one the course that owns the game teaches. Round one found one half and two
// fourths in Fraction twins' welcome (on every board) and port in the word roots' (on half of them); round two found the science
// decks' help naming density and mass over volume, which Science 6's board deals in three boards of four. Every Pairs line is read
// against its deck, written and said (1/2 as one half, 6 × 7 as six times seven), and every example in PAIR_EXAMPLES is held to its
// lines and to its course's lessons. Near misses: the science help as it was, Fraction twins' example as it was, and an example no
// lesson teaches.
{
  const ui = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8');
  const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const word = (n) => (n < 20 ? ONES[n] : TENS[Math.floor(n / 10)] + (n % 10 ? `-${ONES[n % 10]}` : ''));
  const PARTS = { 2: ['half', 'halves'], 3: ['third', 'thirds'], 4: ['fourth', 'fourths'], 6: ['sixth', 'sixths'], 8: ['eighth', 'eighths'] };
  // A card as a voice says it: a fraction in words, a times fact with times, a whole number in words.
  const said = (t) => String(t).replace(/\b(\d+)\/(\d+)\b/g, (m, a, b) => (PARTS[b] ? `${word(+a)} ${PARTS[b][+a === 1 ? 0 : 1]}` : m)).replace(/\s*×\s*/g, ' times ').replace(/\b\d{1,2}\b/g, (m) => word(+m));
  const has = (text, term) => { const t = String(term).trim(); if (!t) return false; const esc = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); return new RegExp(`(^|[^A-Za-z0-9/])${esc}($|[^A-Za-z0-9/])`, 'i').test(text); };
  const pairsIn = (text, deck) => (L.PAIR_DECKS[deck] || []).filter(([a, b]) => (has(text, a) && has(text, b)) || (has(text, said(a)) && has(text, said(b))));
  const helpOf = (src) => { const byDeck = (src.match(/const byDeck = \{([^\n]*)\};/) || [])[1] || ''; const science = (src.match(/startsWith\('science-'\) \? '([^']*)'/) || [])[1] || ''; return (deck) => { const m = new RegExp(`(?:^|[\\s,{])'?${deck}'?: '((?:[^'\\\\]|\\\\.)*)'`).exec(byDeck); return m ? m[1] : String(deck).startsWith('science-') ? science : 'Match each card to the one that belongs with it.'; }; };
  const owners = (gameId) => Object.entries(L.COURSE_GAMES).filter(([, ids]) => ids.includes(gameId)).map(([c]) => L.COURSES.find((x) => x.id === c)).filter(Boolean);
  const lessonText = (course) => JSON.stringify(course.modules.map((m) => m.lesson || {}));
  const pairGames = L.GAMES.filter((g) => g.kind === 'pairs' && g.deck);
  const problems = ({ src, welcome, examples }) => {
    const help = helpOf(src); const out = [];
    for (const g of pairGames) {
      const h = help(g.deck); const w = welcome(g);
      for (const [where, text] of [['help', h], ['welcome', w]]) for (const [a, b] of pairsIn(text, g.deck)) out.push(`${g.id}'s ${where} names ${a} and ${b}, a pair its deck deals`);
      const ex = examples[g.deck];
      if (ex) {
        if ((L.PAIR_DECKS[g.deck] || []).some(([a, b]) => (a === ex.shown[0] && b === ex.shown[1]) || (a === ex.shown[1] && b === ex.shown[0]))) out.push(`${g.id}'s example ${ex.shown.join(' and ')} is a pair its deck deals`);
        if (!ex.shown.every((t) => has(h, t))) out.push(`${g.id}'s help does not give its example ${ex.shown.join(' and ')}`);
        if (!ex.said.every((t) => has(w, t))) out.push(`${g.id}'s welcome does not say its example ${ex.said.join(' and ')}`);
        const courses = owners(g.id);
        if (!courses.length || !courses.every((c) => ex.shown.every((t) => has(lessonText(c), t) || has(lessonText(c), said(t))))) out.push(`${g.id}'s example ${ex.shown.join(' and ')} is not taught in ${courses.map((c) => c.id).join(', ') || 'a course that owns it'}`);
      }
    }
    return out;
  };
  const welcomeOf = (g) => L.gameIntro(g).map((l) => l.say).join(' ');
  const real = problems({ src: ui, welcome: welcomeOf, examples: L.PAIR_EXAMPLES });
  const plants = [
    problems({ src: ui.replace("'Match each science word to what it means.'", "'Match each science word to what it means: density and mass over volume.'"), welcome: welcomeOf, examples: L.PAIR_EXAMPLES }),
    problems({ src: ui, welcome: (g) => (g.deck === 'fractions' ? welcomeOf(g).replace('like one half and four eighths', 'like one half and two fourths') : welcomeOf(g)), examples: L.PAIR_EXAMPLES }),
    problems({ src: ui.replace('as scope and see go together', 'as xylo and wood go together'), welcome: (g) => (g.deck === 'roots' ? welcomeOf(g).replace('like scope, which means see', 'like xylo, which means wood') : welcomeOf(g)), examples: { ...L.PAIR_EXAMPLES, roots: { shown: ['xylo', 'wood'], said: ['xylo', 'wood'] } } }),
  ].map((p) => p.length > 0);
  ok(`every Pairs welcome and help names no pair its deck deals, and each example (${Object.keys(L.PAIR_EXAMPLES).join(', ')}) is in its lines and taught by its course (${pairGames.length} games read; each near miss caught)`, real.length === 0 && pairGames.length >= 15 && plants.every(Boolean), [...real, `near misses ${plants}`].join(' | '));
}
// Say it with me, in silly voices (pass MS; pass MR built Mikey's answer to Q67 as one voice a word, and he meant them for one word:
// "I was talking about applying all of that to a single spoken word ... The very last pronunciation can be a clearer more normal
// version."). Every cue ("Say different with me, in silly voices!") is in one of Q67's lessons (SAY_ALONG_LESSONS) and opens a whole
// game that ends its line: three to five silly ways, each its call and then the word said that way, none twice, and the clear one last;
// the word is said in the line before its cue; its syllables are written for it and join to it; no two words of a lesson play the same
// ways in the same order; every such lesson plays all eight silly voices; and the device voice says each form in its voice's shape
// (one piece, the slide in three steps down, the chant a piece a cheer with a clap between), the child's turn after it. The lesson
// screen hands the voice one sentence at a time, so its reading of a line, sentence by sentence with the line beside it, must hand the
// voice the same pieces as the whole line (pass MR's voices never reached a lesson's voice, only the voice check page). A sentence that
// reads like a cue but opens no game fails. Each near miss below is caught.
{ const ui = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8'); const { LEDGER_CSV } = await import('../tools/audio-ledger.mjs');
  const silly = L.SAY_ALONG_VOICES.filter((v) => !v.last).map((v) => v.style);
  const asLesson = (say, pieces) => { const ss = String(say).split(L.SENTENCE_BREAK).filter(Boolean); return ss.flatMap((s, k) => pieces(s, { line: ss, at: k })); };
  const same = (a, b) => JSON.stringify(a.map(({ sentence, ...x }) => x)) === JSON.stringify(b.map(({ sentence, ...x }) => x));
  const problems = (mods, { lessons = L.SAY_ALONG_LESSONS, pieces = L.speechPieces, syllables = L.SAY_ALONG_SYLLABLES } = {}) => { const bad = []; const styles = new Set(); const used = new Set(); let n = 0; const lessonsWith = new Set();
    for (const m of mods) { const orders = new Map(); const heard = new Set();
      for (const [li, line] of (m.lesson.script || []).entries()) {
        const ss = String(line.say).split(L.SENTENCE_BREAK).filter(Boolean); const parts = L.sayAlongParts(ss);
        for (const [i, s] of ss.entries()) if (/^Say (?!it\b|them\b)[a-z ]+ with me\b/.test(s) && parts[i].role !== 'open') bad.push(`${m.id} ${li}: "${s}" reads like a cue but opens no game`);   // older lines' "Say it with me, apple." are not cues
        const whole = pieces(line.say); const read = asLesson(line.say, pieces);
        for (const [i, p] of parts.entries()) { if (p.role !== 'open') continue;
          n++; lessonsWith.add(m.id); used.add(p.word);
          if (!lessons.includes(m.id)) bad.push(`${m.id} ${li}: a say-along outside Q67's lessons`);
          const game = parts.slice(i + 1);
          if (!game.every((x) => (x.role === 'call' || x.role === 'form') && x.word === p.word)) bad.push(`${m.id} ${li}: the game for ${p.word} does not end its line`);
          const calls = game.filter((x) => x.role === 'call'); const ways = calls.map((x) => x.voice.style); const sillyWays = ways.filter((w) => w !== 'clear');
          if (ways[ways.length - 1] !== 'clear' || ways.filter((w) => w === 'clear').length !== 1) bad.push(`${m.id} ${li}: ${p.word}'s clear saying is not last, once`);
          if (sillyWays.length < 3 || sillyWays.length > 5) bad.push(`${m.id} ${li}: ${p.word} plays ${sillyWays.length} silly ways, not three to five`);
          if (new Set(sillyWays).size !== sillyWays.length) bad.push(`${m.id} ${li}: ${p.word} plays a way twice`);
          const key = sillyWays.join(' '); if (orders.has(key)) bad.push(`${m.id} ${li}: ${p.word} plays ${key}, as ${orders.get(key)} does`); orders.set(key, p.word);
          sillyWays.forEach((w) => { heard.add(w); styles.add(w); });
          const syl = syllables[p.word]; if (!syl || syl.join('') !== p.word) bad.push(`${m.id} ${li}: ${p.word}'s syllables (${syl ? syl.join('|') : 'none written'}) do not make the word`);
          if (!new RegExp(`\\b${p.word}`, 'i').test(ss.slice(0, i).join(' '))) bad.push(`${m.id} ${li}: ${p.word} is not said on the line before its cue`);
          // Each form as the device voice says it: its pieces in its voice's shape, a clap only between a chant's cheers, the child's
          // turn on its last piece and on no other.
          for (const c of calls) { const v = c.voice; const fp = whole.filter((x) => x.inForm === `${c.form}-${p.word}`); const said = fp.filter((x) => !x.sound); const claps = fp.filter((x) => x.sound);
            // A saying a piece for every way said more than once, four times low and three times fast too since round one's screen check.
            const shapes = v.device.length > 1 ? v.device.map((_, k) => `${v.style}${k + 1}`) : Array.from({ length: v.times }, () => v.style);
            const ok1 = JSON.stringify(said.map((x) => x.shape)) === JSON.stringify(shapes) && said.every((x) => x.sayAlong && x.sayAlong.word === p.word && x.sayAlong.style === v.style)
              && claps.length === (v.apart ? v.times - 1 : 0) && claps.every((x) => x.sound === 'clap') && (!v.apart || fp.every((x, k) => (k % 2 === 1) === !!x.sound))
              && fp.length > 0 && fp.slice(0, -1).every((x) => !x.echo) && fp[fp.length - 1].echo >= 700 && fp[fp.length - 1].echo <= 1800
              && said.map((x) => x.text).join(' ') === L.sayAlongForm(p.word, v);
            if (!ok1) bad.push(`${m.id} ${li}: the voice does not say ${p.word} ${v.style} as its voice's shape (${JSON.stringify(fp.map((x) => x.shape))})`); } }
        if (!same(read, whole)) bad.push(`${m.id} ${li}: read a sentence at a time, the line is said otherwise than whole`);
        if (whole.some((x) => x.sound === 'clap' && x.inForm === undefined)) bad.push(`${m.id} ${li}: a clap outside a chant`);
      }
      if (lessons.includes(m.id) && silly.some((w) => !heard.has(w))) bad.push(`${m.id} never plays ${silly.filter((w) => !heard.has(w)).join(', ')}`);
    }
    for (const id of lessons) if (!lessonsWith.has(id) && mods.some((m) => m.id === id)) bad.push(`${id} plays no say-along`);
    return { bad, styles, n, lessonsWith: [...lessonsWith], used }; };
  const real = problems(L.MODULES);
  const stale = Object.keys(L.SAY_ALONG_SYLLABLES).filter((w) => !real.used.has(w));
  const swap = (id, fn) => L.MODULES.map((m) => (m.id === id ? { ...m, lesson: { ...m.lesson, script: fn(m.lesson.script) } } : m));
  // The pieces as they were through round one (pass MS): four times low and three times fast said as one piece, which round one's
  // screen check found the light could not follow; a near miss below.
  const sayingsInOneGo = (ps) => { const out = []; for (const p of ps) { const last = out[out.length - 1];
    if (last && p.sayAlong && last.sayAlong && last.inForm === p.inForm && ['low', 'fast'].includes(p.shape) && last.shape === p.shape) out[out.length - 1] = { ...last, text: `${last.text} ${p.text}`, echo: p.echo, sayAlong: { ...last.sayAlong, rep: 0 } }; else out.push(p); }
    return out; };
  const edit = (id, from, to) => swap(id, (s) => s.map((l) => ({ ...l, say: l.say.replace(from, to) })));
  const plants = [
    problems(edit('people-and-events', ' Now say it nice and clear. Grandpa.', '')),   // no clear saying: the cue opens no game
    problems(edit('people-and-events', 'Grandpa, grandpa, grandpa, grandpa!', 'Grandpa, grandpa, grandpa!')),   // four times said three
    problems(edit('people-and-events', 'Now say it nice and clear. Grandpa.', 'Now say it nice and clear. Grandpa. He is a grown-up.')),   // words after the game
    problems(edit('learning-words', L.sayAlong('same', ['slide', 'drawn', 'low']), L.sayAlong('same', ['whisper', 'slow', 'low', 'fast', 'drawn']))),   // same plays different's ways
    problems(edit('learning-words', L.sayAlong('match', ['chant', 'whisper', 'high', 'fast']), L.sayAlong('match', ['slow', 'whisper', 'high', 'fast']))),   // the lesson never chants
    problems(edit('learning-words', L.sayAlong('different', ['whisper', 'slow', 'low', 'fast', 'drawn']), L.sayAlong('different', ['whisper', 'slow', 'low', 'fast', 'drawn', 'high']))),   // six silly ways
    problems(edit('learning-words', L.sayAlong('different', ['whisper', 'slow', 'low', 'fast', 'drawn']), L.sayAlong('different', ['whisper', 'slow', 'whisper', 'fast', 'drawn']))),   // a way twice
    problems(edit('words-go-together', /^[^]*?(Say clothes with me)/, '$1')),   // the word not said before its cue
    problems(L.MODULES, { lessons: L.SAY_ALONG_LESSONS.slice(1) }),   // a say-along outside Q67's lessons
    problems(L.MODULES, { syllables: { ...L.SAY_ALONG_SYLLABLES, different: ['dif', 'fer', 'nt'] } }),   // syllables that do not make the word
    problems(L.MODULES, { pieces: (text, o) => L.speechPieces(text, o).map((x) => (x.shape === 'whisper' ? { ...x, shape: 'plain' } : x)) }),   // a whisper said plain
    problems(L.MODULES, { pieces: (text, o) => L.speechPieces(text, o).filter((x) => x.sound !== 'clap') }),   // a chant with no claps
    problems(L.MODULES, { pieces: (text, o) => sayingsInOneGo(L.speechPieces(text, o)) }),   // four times low and three times fast in one piece (round one's screen check)
    problems(L.MODULES, { pieces: (text, o) => L.speechPieces(text, Array.isArray(o && o.line) ? {} : o) }),   // a sentence read without its line (pass MR's way)
    problems(edit('learning-words', 'Say match with me, in silly voices!', 'Say match with me, in a silly voice!')),   // a cue in other words
  ].map((p) => p.bad.length > 0);
  ok(`every say-along is one word in three to five silly voices and then clear, ending its line, each way in its own shape on the device voice, the same read a sentence at a time, and every Q67 lesson plays all eight (${real.n} words in ${real.lessonsWith.length} lessons, ${real.styles.size} silly voices; ${plants.length} near misses caught)`,
    real.bad.length === 0 && real.n >= 30 && real.styles.size === silly.length && L.SAY_ALONG_LESSONS.every((id) => real.lessonsWith.includes(id)) && stale.length === 0 && plants.every(Boolean), [...real.bad.slice(0, 6), `stale syllables ${stale}`, `plants ${plants}`, `lessons ${real.lessonsWith}`].join(' | '));
  // The device voice's shapes come from logic's voices (SAY_ALONG_SHAPES), each keeps its own pace for a young learner, and each sounds
  // apart from the clear one on a device voice (a rate a fifth apart, a pitch three tenths apart, or a softer volume); the slide steps
  // down. The recorded voice's ledger row for each form carries only its voice's tag (EARMARKS A55); the cue and the calls keep the
  // young voice's direction. A lesson that plays it shows the not-final note in a panel under its buttons.
  const clear = L.SAY_ALONG_VOICES.find((v) => v.last);
  const apart = L.SAY_ALONG_VOICES.filter((v) => !v.last).every((v) => v.device.some((d) => Math.abs(d.rate - clear.device[0].rate) >= 0.2 || Math.abs(d.pitch - clear.device[0].pitch) >= 0.3 || (d.volume !== undefined && d.volume <= 0.6)));
  const slide = L.SAY_ALONG_VOICES.find((v) => v.style === 'slide'); const steps = slide && slide.device.length === slide.times && slide.device.every((d, k) => k === 0 || d.pitch < slide.device[k - 1].pitch);
  const shaped = ui.includes('const SAY_ALONG_SHAPES = Object.fromEntries(SAY_ALONG_VOICES.flatMap(') && /const SPEECH_SHAPES = \{[^;]*\.\.\.SAY_ALONG_SHAPES \};/.test(ui) && ui.includes("const OWN_PACE_SHAPES = ['key', 'cheer', ...Object.keys(SAY_ALONG_SHAPES)];");
  const rowsOf = LEDGER_CSV.split('\n'); const { DIRECTION } = await import('../tools/audio-ledger.mjs');
  const tagged = L.MODULES.every((m) => (m.lesson.script || []).every((l) => L.sayAlongParts(l.say).every((p) => p.role === 'say' || (p.role === 'form'
    ? rowsOf.some((r) => r.includes(`${p.voice.tag} ${p.sentence}`) && !r.includes(DIRECTION.early)) : rowsOf.some((r) => r.includes(`${DIRECTION.early} ${p.sentence}`))))));
  const noted = /const playfulLesson = script\.some\(\(l\) => sayAlongParts\(l\.say\)\.some\(\(p\) => p\.role === 'open'\)\);/.test(ui) && ui.includes('{playfulLesson ? <VoiceNote near keys={lineKeys} /> : <VoiceNote keys={lineKeys} />}');
  ok('each silly voice has its own shape and pace on the device, apart from the clear one, the slide stepping down; each form its own tag in the recording ledger; and the lesson its not-final note in a panel under its buttons', apart && steps && shaped && tagged && noted, `apart ${apart}, steps ${steps}, shaped ${shaped}, tagged ${tagged}, noted ${noted}`);
  // The strip under the line (SayAlongStrip): the lesson shows the line's own words in the paragraph and the say-along's in the strip,
  // the strip only on a line with a cue, and the lesson tells it each piece's start and end.
  const strip = ui.includes("{lineParts.some((x) => x.role === 'open') && <SayAlongStrip key={`${lessonStep}-${replays}`} parts={lineParts} lit={litSentence} />}")
    && ui.includes(".filter(({ i }) => !lineParts[i] || lineParts[i].role === 'say')") && ui.includes("{ together: true, onPieceEnd: (i, k, piece) => sayAlongBus.emit({ type: 'end', i, piece }) }");
  ok('a say-along line shows its own words in the paragraph and the game in the strip under it, which the voice tells of each piece', strip, `strip ${strip}`);
  // The light's timing (logic): a saying lights each syllable once, in order, inside the time the voice is guessed to take, a word of
  // one syllable whole; the child's turn sits between 0.7 and 1.8 seconds. Every piece is one saying since round one's screen check
  // (pass MS), so each saying's timeline is its own, named by its rep, and starts at 0.
  const timed = L.SAY_ALONG_VOICES.every((v) => Object.values(L.SAY_ALONG_SYLLABLES).every((syl) => { const real = syl.filter((s) => s !== ' ').length;
    return Array.from({ length: v.times }, (_, r) => r).every((r) => { const line = L.sayAlongTimeline(syl, v, r); const est = L.sayAlongEstimateMs(syl, v, r, false);
      return line.length === real && line.every((x, k) => x.rep === r && (k === 0 || x.at >= line[k - 1].at) && x.until > x.at && x.until <= est + 1) && line[0].at === 0; }) && L.sayAlongEcho(syl, v) >= 700 && L.sayAlongEcho(syl, v) <= 1800; }));
  ok('the say-along light reaches each syllable in order inside the time the voice is guessed to take, and the child\'s turn is 0.7 to 1.8 seconds', timed, `timed ${timed}`);
  // The pace the light learns from the voice (logic's sayAlongPaceNext since round one's code check, pass MS, which found the rule in
  // the screen with no test): two fifths of the way to what a form took over its guess, kept between half and 2.2 times the guess, and
  // left alone for a form too short to measure (150 ms or less) or with no guess; the screen takes its pace from it.
  const P = L.sayAlongPaceNext; const near = (x, y) => Math.abs(x - y) < 1e-9;
  // Since round three's screen read a saying of one syllable leaves the pace as it was (the word is lit whole), and the screen hands
  // the rule the saying's syllables, from a run the voice's own start began (a run the 700 ms guess began teaches nothing). Since round
  // four's code read the screen's half is read too, each part a plant had taken out with this test still passing: both of the strip's
  // started sayings carry their syllables (without them the one-syllable rule never applies), a reported start marks the visit's
  // voice as one that reports starts, and a heard start runs as heard (run(false) there would teach the pace nothing, ever).
  const paced = near(P(1, 2000, 1000), 1.4) && near(P(1, 500, 1000), 0.8) && P(1, 100000, 1000) === 2.2 && P(0.6, 151, 100000) === 0.5 && P(1.3, 150, 1000) === 1.3 && P(1.3, 900, 0) === 1.3
    && near([1, 2, 3, 4, 5, 6, 7, 8].reduce((p) => P(p, 1500, 1000), 1), 1.5 - 0.5 * Math.pow(0.6, 8)) && P(1, 2000, 1000, ['match']) === 1 && near(P(1, 2000, 1000, ['dif', 'fer', 'ent']), 1.4)
    && ui.includes('sayAlongPace = sayAlongPaceNext(sayAlongPace, took, started.current.est, started.current.syllables);') && /if \(started\.current\.heard\) \{ const took/.test(ui) && ui.includes('if (!sayAlongStartsHeard) timers.current.push(setTimeout(() => run(false), 700));') && !/sayAlongPace = Math\.max\(/.test(ui)
    && (ui.match(/started\.current = \{ at: (?:Date\.now\(\)|null), est, i: ev\.i, rep, heard(?:: false)?, syllables: part\.syllables \};/g) || []).length === 2 && ui.includes('if (ev.begun === true) sayAlongStartsHeard = true;') && ui.includes('if (ev.begun !== false) { run(true); return; }');
  ok('the say-along light learns the voice\'s pace by logic\'s rule, two fifths of the way a form at a time, between half and 2.2 times the guess, from heard sayings of two syllables or more (pass MS, round one\'s code check and round three\'s reads)', paced, `paced ${paced}`);
  // Every say-along line in its lessons' order, as a phone's voice says it (a piece's letters at 40, 62 and 80 ms a letter over its
  // voice's rate, and 120 ms more), through logic's timeline, estimate and pace rule (round three's screen read: the pace learned from
  // one-syllable words had run to its ceiling, and whisper and slow "Different." after match and same ended before their last
  // syllable lit, as did low's first "Vehicles,"): every saying's last syllable lights before the voice ends it. Near miss: the pace
  // learned from every saying, as before, which leaves some saying short at one of the three paces.
  { const lines = []; for (const id of L.SAY_ALONG_LESSONS) { const mod = L.COURSES.flatMap((c) => c.modules).find((m) => m.id === id); L.readAloudScript(mod).forEach((s) => { if (L.sayAlongParts(s.say).some((x) => x.role === 'open')) lines.push(s.say); }); }
    const split = (x) => String(x).split(L.SENTENCE_BREAK).filter((y) => y.trim());
    const short = (perChar, guard) => { let pace = 1; let miss = 0; let n = 0;
      for (const say of lines) { const texts = split(say); for (const p of texts.flatMap((x, k) => L.speechPieces(x, { line: texts, at: k }))) { if (!p.sayAlong) continue; n += 1;
        const sa = p.sayAlong; const v = L.SAY_ALONG_VOICES.find((x) => x.style === sa.style); const d = v.device[Math.min(sa.rep, v.device.length - 1)];
        const took = Math.round((p.text.length * perChar) / (d.rate || 1)) + 120; const tl = L.sayAlongTimeline(sa.syllables, v, sa.rep);
        if (tl[tl.length - 1].at * pace >= took) miss += 1; pace = P(pace, took, L.sayAlongEstimateMs(sa.syllables, v, sa.rep, false), guard ? sa.syllables : null); } }
      return { miss, n }; };
    const paces = [40, 62, 80]; const now = paces.map((c) => short(c, true)); const before = paces.map((c) => short(c, false));
    ok(`every say-along saying's last syllable lights before a phone's voice ends it, over every line in order at 40, 62 and 80 ms a letter (${lines.length} lines, ${now[0].n} sayings; the old pace rule left ${before.map((x) => x.miss).join(', ')} short) (pass MS, round three's screen read)`, lines.length >= 30 && now.every((x) => x.miss === 0 && x.n > 250) && before.some((x) => x.miss > 0), JSON.stringify({ now, before })); }
  // The two slow ways never side by side in one word's game (pass MS, round one's story flow and lesson checks: "Stretch it out
  // long." and then "Say it slowly." was the one flat moment, in lunchtime and bedtime); near miss: bedtime's old order.
  const slowPairs = (say) => { const calls = L.sayAlongParts(say).filter((p) => p.role === 'call'); const out = []; for (let k = 1; k < calls.length; k++) if (calls[k].word === calls[k - 1].word && ['drawn', 'slow'].includes(calls[k].voice.style) && ['drawn', 'slow'].includes(calls[k - 1].voice.style)) out.push(calls[k].word); return out; };
  const sideBySide = []; for (const c of L.COURSES.filter((x) => x.readAloud)) for (const m of c.modules) for (const l of L.readAloudScript(m)) for (const w of slowPairs(l.say)) sideBySide.push(`${m.id}: ${w}`);
  ok('no say-along plays its two slow ways, stretched out and slowly, side by side (pass MS, round one; near miss caught)', sideBySide.length === 0 && slowPairs(L.sayAlong('bedtime', ['whisper', 'drawn', 'slow', 'low'])).length === 1, sideBySide.join(', '));
  // The voice check page's say-along rows are lesson lines word for word, as the page says (round one's code check: nothing held them,
  // so a lesson edit would have left the page saying an old line); near miss: a row with its order changed.
  { const { VOICE_CHECK_ROWS } = await import('../tools/voice-check.mjs'); const lines = new Set(); for (const c of L.COURSES.filter((x) => x.readAloud)) for (const m of c.modules) for (const l of L.readAloudScript(m)) lines.add(l.say);
    const rows = VOICE_CHECK_ROWS.filter((r) => r.text && /with me, in silly voices!/.test(r.text)); const stale = rows.filter((r) => !lines.has(r.text)).map((r) => r.n);
    const nearRow = rows.length ? rows[rows.length - 1].text.replace('Whisper it.', 'Whisper it!') : '';
    ok(`the voice check page's say-along rows are lesson lines word for word (${rows.length} rows; near miss caught)`, rows.length >= 6 && stale.length === 0 && !lines.has(nearRow), `stale rows ${stale.join(', ')}`); }
}
// A story's title is said with its own end mark (pass MR, round one's story flow check): "Is it bedtime yet?" had been spoken as "Is it
// bedtime yet?." in sixteen titles, a statement with no question lift. The story screen, a long story's read-along and the audio ledger
// all say a title through storyTitleSpoken, and none adds its own period to a title.
{ const ui = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8'); const ledger = readFileSync(new URL('../tools/audio-ledger.mjs', import.meta.url), 'utf8');
  const own = /\$\{(?:story|st|cs)\.title\}\./.test(ui + ledger);
  const uses = (ui.match(/storyTitleSpoken\((?:story|st)\.title\)/g) || []).length === 2 && (ledger.match(/storyTitleSpoken\((?:st|cs)\.title\)/g) || []).length === 4;
  const said = L.storyTitleSpoken('Is it bedtime yet?') === 'Is it bedtime yet?' && L.storyTitleSpoken('Hat, ball, slide') === 'Hat, ball, slide.' && L.storyTitleSpoken('Up we go!') === 'Up we go!' && L.storyTitleSpoken(' Two baskets ') === 'Two baskets.';
  ok("a story's title is said with its own end mark, a question asked as a question, everywhere a title is said", !own && uses && said, `own period ${own}, uses ${uses}, said ${said}`); }
// A pre-K course's frameworks are named as what they are on the transcript (pass MR, round one's standards check): pre-K has no TEKS or
// Common Core, and its Texas codes are the 2027 recommendations', so "Texas Essential Knowledge and Skills" beside PK3.V.D.1 sent an
// educator to an adopted outcome of another meaning.
{ const ui = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8'); const { frameworkName } = await import('../src/curriculum.mjs');
  const named = frameworkName('TEKS', 'PK3') === 'Texas Prekindergarten Guidelines, 2027 recommendations, not yet adopted by TEA' && frameworkName('CCSS', 'PK4') === 'Head Start Early Learning Outcomes Framework' && frameworkName('TEKS', 'K') === 'Texas Essential Knowledge and Skills' && frameworkName('CCSS', '5') === 'Common Core State Standards';
  ok("the transcript names a pre-K course's frameworks as the guidelines and Head Start's framework, and a grade's as TEKS or the Common Core", named && /<strong>Standards satisfied<\/strong> \(\{frameworkName\(frameworkForState\(stateCode \|\| 'CA'\), c\.grade\)\}\)/.test(ui)); }
// A game head holds still through a board (round three of pass MR, the alignment read: Build the Fund's "Fund minus loan", the loan
// game's "Interest paid", Split the Search's "Looks so far" and Teach the Robot's "Lessons" changed with every tap outside HeadRoom,
// so on a narrow phone the head could wrap mid-round and drop the board, the fault HeadRoom was made for). Every value written in a
// game head's line (className "edu-game-head") sits inside a HeadRoom, which holds the room of its widest form, unless it is one of
// the values that change only between boards (ALGORITHMS: a sequence's title, a target, a stand's profit, a question's form). Its
// near misses: a planted head with a bare count fails, and the same head with the count in a HeadRoom passes.
{ const ui = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8');
  const BETWEEN_BOARDS = new Set(['seq.title', 'target', 'found', "done ? '' : q.form"]);
  const loose = (line) => { let t = line.replace(/<HeadRoom\b[^>]*>[\s\S]*?<\/HeadRoom>/g, '').replace(/<div className="edu-game-head" style=\{\{[^}]*\}\}>/, '');
    t = t.replace(/ style=\{\{[^}]*\}\}/g, '').replace(/ data-[a-z-]+=\{[^}]*\}/g, '').replace(/ className=\{[^}]*\}/g, '');
    return [...t.matchAll(/\{([^{}]*)\}/g)].map((m) => m[1].trim()).filter((e) => !e.startsWith('/*') && !BETWEEN_BOARDS.has(e)); };
  const heads = ui.split('\n').map((line, i) => ({ line, at: i + 1 })).filter((h) => h.line.includes('className="edu-game-head"'));
  const bare = heads.filter((h) => loose(h.line).length).map((h) => `line ${h.at}: ${loose(h.line).join(', ')}`);
  const plant = '      <div className="edu-game-head" style={{ fontSize: 14 }}><span>Looks so far: {total}</span><span><HeadRoom most="888s">{ticks}s</HeadRoom></span></div>';
  const held = plant.replace('{total}', '<HeadRoom start most="888">{total}</HeadRoom>');
  ok(`every value in a game head that changes during a board holds its room in a HeadRoom (${heads.length} heads read), and a planted bare count fails while the same count held passes`,
    heads.length >= 40 && bare.length === 0 && loose(plant).join() === 'total' && loose(held).length === 0, bare.join(' | ')); }
// A call for help is never taught as the wrong thing to say (pass MS, round one's lesson check: Say what you need taught "If you just
// say help, or uh oh, your teacher does not know what is wrong." and offered Help! as the answer that does not tell, while a young
// child is taught to call out for help): no read-aloud lesson line says that just saying help is not enough, and no read-aloud
// question offers Help! as a wrong choice or explains it away. Near misses: the old line, and a question offering Help! as wrong.
{ const helpLine = (say) => /\bjust say,? help\b/i.test(say) || /\bsaying,? help\b/i.test(say);
  // A question's prompt, setup and explanation are read too (round two's code check: round one's yes or no question was caught only by
  // its reason's words, and with them reworded it passed).
  const helpWrong = (q) => [q.prompt, q.story, q.explain].some((x) => typeof x === 'string' && helpLine(x)) || (q.choices || []).some((c) => /^help[.!]?$/i.test(String(c)) && c !== q.answer) || Object.values(q.whyNot || {}).some((w) => /\bsaying,? help\b/i.test(`${w.name} ${w.why}`));
  const lines = []; const asks = [];
  for (const c of L.COURSES.filter((x) => x.readAloud)) for (const m of c.modules) {
    for (const l of L.readAloudScript(m)) if (helpLine(l.say)) lines.push(m.id);
    for (const g of new Set(m.generators)) for (let seed = 1; seed <= 120; seed++) { const q = L.generateQuestion(g, seed); if (q && q.type === 'choice' && helpWrong(q)) { asks.push(`${g} ${seed}`); break; } }
  }
  const near = helpLine('If you just say help, or uh oh, your teacher does not know what is wrong.') && helpWrong({ choices: ['I am cold.', 'Help!'], answer: 'I am cold.', whyNot: { 'Help!': { name: 'Saying, help', why: 'does not tell what is wrong.' } } }) && helpWrong({ prompt: 'If you just say help, does your teacher know what is wrong?', choices: ['Yes', 'No'], answer: 'No', whyNot: {} });
  ok("no read-aloud lesson or question teaches a call for help as the wrong thing to say (pass MS, round one's lesson check; near misses caught)", lines.length === 0 && asks.length === 0 && near, `lines ${lines.join(', ')}; questions ${asks.join(', ')}`); }
// The young lessons read for flow (pass MS, round one's story flow check, the second pass to find lesson lines that read robotic,
// after pass MR's): tools/lesson-flow.mjs reads every read-aloud pre-K lesson by the story flow rules and one more, three sentences
// in a row that open with one word. Each older lesson's count of flags may only fall (LESSON_FLOW_WAITS, as pass MS found them;
// node tools/lesson-flow.mjs lists them, most of them counting runs and lists a lesson says on purpose, read when each course is
// next reviewed), and any other lesson, every lesson built from pass MS on, has none. Near misses: Say it to fit's first paragraph
// and Things we do's eighth line as round one read them (four sentences of 12, 12, 12 and 11 words; three sentences opening At).
{ const { lessonFlowFlags, youngLessons } = await import('../tools/lesson-flow.mjs');
  const LESSON_FLOW_WAITS = { 'red-and-blue': 1, 'find-the-match': 1, 'big-and-small': 1, 'one-and-two': 1, 'more-or-fewer': 5, 'first-marks': 1, 'yellow-and-green': 2, 'triangles-too': 2, 'big-and-little': 2, 'one-more-one-fewer': 27, 'join-in-play': 2, 'talk-with-a-friend': 4, 'talk-about-it': 4, 'rhymes-with-pictures': 7, 'circle-and-square': 2, 'a-and-b': 4, 'not-the-same': 1, 'listen-and-tap-pictures': 4, 'animal-sounds': 4, 'two-steps': 2, 'two-steps-more': 3, 'two-ideas': 2, 'two-ideas-more': 6, 'learning-words': 1, 'count-and-sort-words': 2, 'people-and-events': 1, 'colours': 3, 'same-and-different': 1, 'match-the-vehicles': 2, 'match-the-things': 1, 'match-the-water-animals': 1, 'match-the-land-animals': 3, 'match-the-shapes': 1, 'match-the-solids': 2, 'more-and-fewer-5': 2, 'bigger-and-smaller': 2, 'patterns': 12, 'count-to-3': 5, 'connect-the-dots': 1, 'taking-turns': 3, 'big-bigger-biggest': 3, 'helpers-all-around': 2, 'feelings-show': 3, 'how-friends-feel': 1, 'good-friend': 3, 'play-together': 1, 'listen-for-rhymes': 2, 'first-sounds': 1, 'which-came-first': 3, 'which-came-second': 5, 'big-letters': 1, 'first-letter-tracing': 1, 'more-big-letters': 2, 'trace-straight-letters': 3, 'three-steps': 1, 'three-steps-more': 3, 'more-learning-words': 2, 'sort-and-shape-words': 3, 'words-go-together': 1 };
  const all = youngLessons(); const over = all.map((x) => [x.mod.id, lessonFlowFlags(x.mod)]).filter(([id, f]) => f.length > (LESSON_FLOW_WAITS[id] || 0)).map(([id, f]) => `${id}: ${f.join('; ')}`);
  // A count that fell is written down at once, so it can never rise again unseen (round three's code read: a wait above a lesson's
  // count let it grow back), and a wait names a lesson that is still read.
  const staleOf = (W) => Object.entries(W).filter(([id, n]) => { const x = all.find((y) => y.mod.id === id); return !x || lessonFlowFlags(x.mod).length < n; }).map(([id, n]) => `${id} waits at ${n}`);
  const stale = staleOf(LESSON_FLOW_WAITS); const staleCaught = staleOf({ ...LESSON_FLOW_WAITS, patterns: LESSON_FLOW_WAITS.patterns + 1 }).some((s) => s.startsWith('patterns '));   // near miss: a wait one above its count
  const fit = all.find((x) => x.mod.id === 'say-it-to-fit'); const act = all.find((x) => x.mod.id === 'things-we-do');
  const oldFit = fit && { lesson: { ...fit.mod.lesson, paragraphs: ['We use words for many reasons. To ask for something, you can say, please pass the red crayon. To tell what happened, you can say, I made a tall tower! To ask a question, you can say, where does rain come from? To say how you feel, you can say, I feel happy! Or, I feel sad.', ...fit.mod.lesson.paragraphs.slice(1)] } };
  const oldAct = act && { lesson: { ...act.mod.lesson, script: act.mod.lesson.script.map((l, k) => (k === 7 ? { ...l, say: 'At story time, you read a book together. At bedtime, you sleep in your bed.' } : l)) } };
  const near = !!oldFit && !!oldAct && lessonFlowFlags(oldFit).some((f) => /monotone/.test(f)) && lessonFlowFlags(oldAct).some((f) => /open with "at"/.test(f));
  ok(`the young lessons read for flow: no lesson over its count as pass MS found it, none under it either (a fallen count is written down), and none in a lesson built since (${all.length} lessons; near misses caught)`, all.length >= 70 && over.length === 0 && stale.length === 0 && staleCaught && near, [...over, ...stale].join(' | ')); }
// A moment with a second wrong voice offers both in turn (pass MS, round two's code check: with its branch never taken, no check
// failed): across its seeds, p4-fit-voice offers each moment's every wrong voice the tables give it, the far-away friend both a whisper
// and an inside voice, and every other moment its one.
{ const offered = new Map();
  for (let seed = 1; seed <= 600; seed++) { const q = L.generateQuestion('p4-fit-voice', seed); const s = offered.get(q.story) || new Set(); for (const c of q.choices) if (c !== q.answer) s.add(c); offered.set(q.story, s); }
  const far = offered.get('Your friend is far away on the playground.') || new Set();
  ok('the far-away friend meets both wrong voices, a whisper and an inside voice, and each other moment its one (pass MS, round two)', offered.size === 6 && far.has('A whisper') && far.has('An inside voice') && far.size === 2 && [...offered].filter(([s]) => s !== 'Your friend is far away on the playground.').every(([, v]) => v.size === 1), JSON.stringify([...offered].map(([s, v]) => [s, [...v]]))); }
console.log(`\n${pass} passed, ${fail} failed`);
process.exitCode = fail ? 1 : 0;   // never process.exit(): it can drop the last lines of a piped stdout (2026-09-23)
