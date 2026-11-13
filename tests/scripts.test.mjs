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
    { const shownPics = (show.kind === 'pair' ? [show.a, show.b] : show.kind === 'row' ? show.items : [show]).filter((h) => h && h.kind === 'pic').map((h) => String(h.name).split('~')[0]);   // a cat asleep is a cat (pass MW)
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
// A row inside a pair (pass MW, from looking at One cat, two cats in the real page, where "Here is one cup, and here are two cups."
// drew two cups and no one cup): only a stacked pair holds a row, since a side-by-side half is under half the card's width and its
// row would draw its pictures far smaller than the one beside it; the row holds two or three of a row's kinds, as a row alone does;
// and every icon or sign-in picture in it is named by its line, as in a row alone. The checks above read a pair's two halves and
// never looked inside a row there, so this one does, lesson lines and lesson examples alike, and four near misses prove it: an
// unnamed icon in the row, a row in a side-by-side pair, a row of four and a face in a row.
const nestedRowProblems = (line) => { const show = line.show; const said = String(line.say || '').toLowerCase(); const out = [];
  if (!show || show.kind !== 'pair') return out;
  for (const h of [show.a, show.b]) { if (!h || h.kind !== 'row') continue;
    if (!show.stack) out.push('a row in a side-by-side pair');
    const items = Array.isArray(h.items) ? h.items : [];
    if (!(items.length >= 2 && items.length <= 3 && items.every((x) => x && ['pic', 'shape', 'icon'].includes(x.kind)))) out.push('a row the screen cannot draw whole');
    for (const x of items) if (x && (x.kind === 'icon' || x.kind === 'pic') && !said.includes(String(x.name).split('~')[0])) out.push(`a ${x.name} it never names`); }
  return out; };
{ const real = []; let rows = 0;
  for (const mod of L.MODULES) { const ex = mod.lesson && mod.lesson.example; const lines = [...((mod.lesson && mod.lesson.script) || []), ...(ex ? [{ say: ex.caption || '', show: ex }] : [])];
    for (const line of lines) { const s = line.show; if (s && s.kind === 'pair') rows += [s.a, s.b].filter((h) => h && h.kind === 'row').length; for (const p of nestedRowProblems(line)) real.push(`${mod.id}: "${line.say}" shows ${p}`); } }
  const cup = { kind: 'icon', name: 'cup' }; const say = 'Here is one cup, and here are two cups.';
  const plants = [nestedRowProblems({ say, show: { kind: 'pair', stack: true, a: cup, b: { kind: 'row', items: [cup, { kind: 'icon', name: 'dog' }] } } }).includes('a dog it never names'),
    nestedRowProblems({ say, show: { kind: 'pair', a: cup, b: { kind: 'row', items: [cup, cup] } } }).includes('a row in a side-by-side pair'),
    nestedRowProblems({ say, show: { kind: 'pair', stack: true, a: cup, b: { kind: 'row', items: [cup, cup, cup, cup] } } }).includes('a row the screen cannot draw whole'),
    nestedRowProblems({ say: say + ' I am happy.', show: { kind: 'pair', stack: true, a: cup, b: { kind: 'row', items: [cup, { kind: 'face', feeling: 'happy' }] } } }).includes('a row the screen cannot draw whole'),
    nestedRowProblems({ say, show: { kind: 'pair', stack: true, a: cup, b: { kind: 'row', items: [cup, cup] } } }).length === 0];
  ok(`a row inside a lesson pair is in a stacked pair, holds what a row can draw, and names its pictures (${rows} rows read; four near misses caught, the right one passed)`, real.length === 0 && rows >= 12 && plants.every(Boolean), [...real.slice(0, 6), `near misses ${plants}`].join(' | ')); }
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
  ok('lessons and questions draw a thing, never its coloring page placeholder', ui.includes("<ColorThumb picture={visual.name} size={at(typeof visual.size === 'number' ? visual.size : 120)} thing />") && ui.includes("<ColorThumb picture={c.slice(4).split('#')[0]} size={Math.round(84 * k)} thing />") && ui.includes('const THING_LINE_ART = '));
}
// The stand-in note (pass LW, Mikey): his exact words, worn by a lesson line's drawing while its painting is on the way, by a
// story's drawn fallback and by a thing drawn in place of its coloring page; on a question only in a walk-through, where no
// child is answering, and once a picture (half of a pair never adds a second one; since pass MN round one's screen check a pair's
// two drawings grow on a wide screen in a lesson, big={wide}, and still add none; since pass NF, EARMARKS A101, big={bigHalf(v)}, a stacked
// pair's letters and the drawing stacked with them growing too, with lesson={lessonHalf(v)} for a stacked pair of writing inside one). Explanation pictures of every validated
// kind are drawn (pass LW; only bars and dots were).
{
  const ui = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8');
  ok('the stand-in note says exactly what Mikey asked', ui.includes(`const REPLACE_NOTE = "To be replaced with Mikey's provided image.";`) && (ui.match(/\{REPLACE_NOTE\}/g) || []).length === 1);
  ok('a lesson line whose painting is on the way, and a story drawn in its place, wear the note', ui.includes('<Picture visual={visual} animate animKey={animKey} note big lesson />') && ui.includes('<Picture visual={fallback} note />'));
  ok('a question shows the note only in a walk-through, and half of a pair never adds a second one', (ui.match(/note=\{record\.preview \? undefined : false\}/g) || []).length === 3 && ui.includes('<Picture visual={v} note={false} bare big={bigHalf(v)} lesson={lessonHalf(v)} />') && ui.includes("const standIn = !!(record && record.preview) && /^art:/.test(c) && thingStandIn("));
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
// Q90 (Mikey's answer, pass NF, "Q90 - A"): a thin edge of its own color on all four colors, in both themes, on the answer tiles and on a
// lesson's paper alike, darker where it sits on something light (white, the light theme's tiles, the dark theme's paper) and lighter on
// the dark theme's tiles, so the four read as one set. Until pass NF the yellow wore its darker edge everywhere and the dark theme's green
// on paper (Q56, pass MP), and since pass ND a color took an edge on a tile only where it read under 3 to 1 there (the light theme's green,
// the dark theme's red and blue), so on a light tile the yellow and the green were framed and the red and the blue flat (EARMARKS A94).
// In plain terms: swatchEdge is taken from ui.jsx and run, for each theme, on a tile and on paper, for each color, and every edge it
// gives is read: it is there (no color flat anywhere), it is the darker set on light places and the lighter set on dark tiles, it reads
// 3 to 1 or better on every surface it sits on (white, the light theme's resting, right, wrong and ruled-out tiles and the dark theme's
// paper for the darker set; the dark theme's resting, right, wrong and ruled-out tiles for the lighter set; THEMES and the ruled-out
// line read from the source, never typed), and it is a shade of its own color (its hue within 12 degrees of its fill's, darker or lighter
// than the fill as its set is, and 1.2 to 1 or more from it), while the four fills stay the colors the lessons name. The color square,
// the shapes and the Wonder answer's little square draw it, and a choice on an answer tile says it is on one. Near misses, each caught:
// the red's darker edge taken out (a red flat on a light tile), the lighter set used on the dark theme's paper too, the yellow's lighter
// edge the yellow's own fill, the blue's darker edge in green, the blue's lighter edge as deep as its fill, a color square on a tile that
// does not say so, the Wonder answer's square back to one translucent dark edge, and a dark tile in THEMES turned the red edge's color.
// Since round one's screen read a Wonder answer's square lit while the voice reads it is read on the read-along green (readLit's background,
// read from the source) in both themes: its edge the lit set, 3 to 1 or better there, darker than its fill and a shade of its own color,
// and the young Wonder row passes lit; near misses, each caught: a lit square on the tile's set (the lighter one in the dark theme), Q56's
// yellow as the lit yellow, and the row passing no lit.
{
  const ui = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8');
  const lumOf = (h) => { const v = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };
  const cr = (a, b) => { const x = lumOf(a); const y = lumOf(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const hueOf = (h) => { const [r, g, b] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255); const mx = Math.max(r, g, b); const mn = Math.min(r, g, b); const d = mx - mn; if (!d) return 0; const x = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; return (x * 60 + 360) % 360; };
  const hueGap = (a, b) => { const d = Math.abs(hueOf(a) - hueOf(b)) % 360; return Math.min(d, 360 - d); };
  const edgeProblems = (src) => {
    const bad = [];
    const grab = (re) => (src.match(re) || [])[0];
    const parts = [grab(/const SWATCH = \{[^}]*\};/), grab(/const SWATCH_EDGE = \{[^}]*\};/), grab(/const SWATCH_TILE_EDGE = \{[^}]*\};/), grab(/const SWATCH_LIT_EDGE = \{[^}]*\};/), grab(/function swatchEdge\([^)]*\) \{[\s\S]*?\n\}/)];
    if (parts.some((p) => !p)) return ['a color, an edge set or swatchEdge is missing from the source'];
    let run; try { run = new Function('C', parts.join('\n') + '\nreturn { SWATCH, SWATCH_EDGE, SWATCH_TILE_EDGE, swatchEdge };'); } catch (e) { return ['swatchEdge does not run: ' + e.message]; }
    const tones = (mode) => { const at = src.indexOf(`mode: '${mode}'`); const b = at < 0 ? '' : src.slice(at, src.indexOf('\n  },', at)); return Object.fromEntries(['surface', 'greenSoft', 'claySoft', 'paperBoard'].map((k) => [k, (b.match(new RegExp(`\\b${k}: '(#[0-9A-Fa-f]{6})'`)) || [])[1]])); };
    const lt = tones('light'); const dk = tones('dark'); const ruled = (src.match(/if \(ruledOut\) \{ bg = C\.mode === 'dark' \? '(#[0-9A-F]{6})' : '(#[0-9A-F]{6})';/) || []).slice(1);
    if ([...Object.values(lt), ...Object.values(dk), ...ruled].some((t) => !t) || ruled.length !== 2) return ['a tile or paper color is missing from THEMES or the ruled-out line'];
    const light = { white: '#FFFFFF', 'the light theme\'s resting tile': lt.surface, 'its right tile': lt.greenSoft, 'its wrong tile': lt.claySoft, 'its ruled-out tile': ruled[1], 'the dark theme\'s paper': dk.paperBoard };
    const dark = { 'the dark theme\'s resting tile': dk.surface, 'its right tile': dk.greenSoft, 'its wrong tile': dk.claySoft, 'its ruled-out tile': ruled[0] };
    const FILLS = { red: '#D9534F', blue: '#4A7FC1', yellow: '#F0C93A', green: '#5E9A62' };
    for (const mode of ['light', 'dark']) for (const tile of [true, false]) {
      const { SWATCH, SWATCH_EDGE, SWATCH_TILE_EDGE, swatchEdge } = run({ mode });
      for (const [name, fill] of Object.entries(FILLS)) {
        if (SWATCH[name] !== fill) { bad.push(`the lessons' ${name} changed to ${SWATCH[name]}`); continue; }
        const where = `${name} in the ${mode} theme on ${tile ? 'a tile' : 'paper'}`; const e = swatchEdge(fill, 4, tile);
        if (!e || !e.stroke || !(e.strokeWidth >= 3)) { bad.push(`${where} wears no edge`); continue; }
        const onDark = mode === 'dark' && tile; const want = (onDark ? SWATCH_TILE_EDGE : SWATCH_EDGE)[name];
        if (e.stroke !== want) bad.push(`${where} wears ${e.stroke}, not its ${onDark ? 'lighter' : 'darker'} edge ${want}`);
        for (const [place, t] of Object.entries(onDark ? dark : light)) if (cr(e.stroke, t) < 3) bad.push(`${where}: its edge ${e.stroke} reads ${cr(e.stroke, t).toFixed(2)} to 1 on ${place}`);
        if (hueGap(e.stroke, fill) > 12) bad.push(`${where}: its edge ${e.stroke} is not a shade of its own color (${hueGap(e.stroke, fill).toFixed(0)} degrees from it)`);
        if (onDark ? lumOf(e.stroke) <= lumOf(fill) : lumOf(e.stroke) >= lumOf(fill)) bad.push(`${where}: its edge is not ${onDark ? 'lighter' : 'darker'} than its fill`);
        if (cr(e.stroke, fill) < 1.2) bad.push(`${where}: its edge ${e.stroke} is hardly apart from its fill (${cr(e.stroke, fill).toFixed(2)} to 1)`);
      }
    }
    const litBg = (src.match(/const readLit = \(\) => \(\{ background: '(#[0-9A-Fa-f]{6})'/) || [])[1];
    if (!litBg) bad.push('readLit\'s background is missing from the source');
    else for (const mode of ['light', 'dark']) { const { swatchEdge } = run({ mode });
      for (const [name, fill] of Object.entries(FILLS)) { const e = swatchEdge(fill, 5, true, true); const where = `${name} lit in the ${mode} theme`;
        if (!e || !e.stroke) { bad.push(`${where} wears no edge`); continue; }
        if (cr(e.stroke, litBg) < 3) bad.push(`${where}: its edge ${e.stroke} reads ${cr(e.stroke, litBg).toFixed(2)} to 1 on the read-along green ${litBg}`);
        if (hueGap(e.stroke, fill) > 12) bad.push(`${where}: its edge ${e.stroke} is not a shade of its own color`);
        if (lumOf(e.stroke) >= lumOf(fill)) bad.push(`${where}: its edge is not darker than its fill`); } }
    if (!/<OptionSwatch colour=\{optionSwatch\(o\)\} size=\{30\} lit=\{wonderLit === i\} \/>/.test(src)) bad.push('the young Wonder row does not say which answer is lit');
    if (!/function Swatch\([^)]*\) \{[^\n]*\n[^\n]*\{\.\.\.swatchEdge\(SWATCH\[colour\], 4, tile\)\}/.test(src)) bad.push('the color square draws no edge');
    if (!/const edge = swatchEdge\(color, 4, tile\)/.test(src)) bad.push('the shapes draw no edge');
    if (!/function OptionSwatch\([^)]*\) \{[\s\S]{0,300}?\{\.\.\.swatchEdge\(SWATCH\[colour\], 5, true, lit\)\}/.test(src)) bad.push('the Wonder answer\'s square draws no edge of its own color');
    for (const part of ['<LookGroup token={c} k={k} tile={!paper} />', '<Swatch colour={c.slice(7)} size={Math.round(64 * k)} tile={!paper} />', '<Item spec={c.slice(5)} size={Math.round(64 * k)} tile={!paper} />']) if (!src.includes(part)) bad.push(`a choice on its tile does not say so: ${part.slice(0, 30)}`);
    return bad;
  };
  const real = edgeProblems(ui);
  const plants = [ui.replace(/(const SWATCH_EDGE = \{ )red: '#[0-9A-F]{6}', /, '$1'), ui.replace("C.mode === 'dark' && tile ? SWATCH_TILE_EDGE : SWATCH_EDGE)", "C.mode === 'dark' ? SWATCH_TILE_EDGE : SWATCH_EDGE)"),
    ui.replace(/(const SWATCH_TILE_EDGE = \{[^}]*yellow: ')#[0-9A-F]{6}/, '$1#F0C93A'), ui.replace(/(const SWATCH_EDGE = \{[^}]*blue: ')#[0-9A-F]{6}/, '$1#3D6B41'), ui.replace(/(const SWATCH_TILE_EDGE = \{[^}]*blue: ')#[0-9A-F]{6}/, '$1#4A7FC1'),
    ui.replace('<Swatch colour={c.slice(7)} size={Math.round(64 * k)} tile={!paper} />', '<Swatch colour={c.slice(7)} size={Math.round(64 * k)} />'), ui.replace('{...swatchEdge(SWATCH[colour], 5, true, lit)}', 'stroke="rgba(0,0,0,0.28)" strokeWidth="5"'),
    ui.replace("green: '#7CC3A6', greenSoft: '#22413A'", "green: '#7CC3A6', greenSoft: '#E8837F'"),
    ui.replace("(lit ? SWATCH_LIT_EDGE : C.mode", "(C.mode"), ui.replace(/(const SWATCH_LIT_EDGE = \{[^}]*yellow: ')#[0-9A-F]{6}/, '$1#9C7A14'), ui.replace(' lit={wonderLit === i} />', ' />')].map((src) => src !== ui && edgeProblems(src).length > real.length);
  ok('Q90: all four colors wear a thin edge of their own shade in both themes, on a tile and on paper, darker on light places and lighter on the dark theme\'s tiles, each 3 to 1 or better on every surface it sits on and the fills unchanged, and since round one\'s screen read a Wonder answer\'s square lit by the voice in the darker set with a deeper yellow, 3 to 1 or better on the read-along green (eleven near misses, each caught)', real.length === 0 && plants.length === 11 && plants.every(Boolean), [...real, `near misses ${plants}`].join(' | '));
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
// Say it together (pass MT, Mikey's answer to Q77, his game word for word; pass MS's cue that named the word, "Say different with me,
// in silly voices!", and its three to five ways are retired). Every opener ("Let's say it together!") is in one of the say-along lessons
// (SAY_ALONG_LESSONS) and opens a whole game that ends its line: five steps in order, each its call in Mikey's openings (First, Now,
// Now, Now, and Okay, let's try) and then the word said its way, one way a step from that step's slot, then "Great job!", then "One
// last time, nice and clear." and the word; the word is said in the line before the opener; its syllables are written for it and join
// to it; no two words of a lesson play the same five ways; a lesson of two games or more plays both flavors of the first, second and
// fifth steps and as many flavors of the silly third as it has games, up to all four; and every way is played somewhere. Learning words
// plays Mikey's own version on different, word for word. The device voice says each form as its way's shape (a saying a piece, in
// one shape or one a saying; super fast in one breath; a brief pause after each saying of the ways that ask for one; a cheer's whistle
// between its sayings and its crowd after), the opener excited (sayOpen) and the praise as a cheer, the child's turn after each form.
// The lesson screen hands the voice one sentence at a time, so its reading of a line, sentence by sentence with the line beside it, must
// hand the voice the same pieces as the whole line (pass MR's voices never reached a lesson's voice). And every pre-K lesson that cites
// a vocabulary outcome (the 2027 II.D.1 or II.D.2, or Head Start's P-LC 6) plays the game, but the older ones SAY_ALONG_WAITS names
// (Q77 (a): "give it to every new young vocabulary lesson from now on"). Each near miss below is caught. Since pass MU (Mikey's answer
// to Q81, "Q81 - A") the eight older ones play it too and SAY_ALONG_WAITS is empty: every pre-K vocabulary lesson plays the game, and a
// lesson let off by name, or one whose games are taken out, fails.
{ const ui = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8'); const { LEDGER_CSV, SAY_ALONG_TALK } = await import('../tools/audio-ledger.mjs');
  const ways = L.SAY_ALONG_VOICES.filter((v) => !v.last); const slots = [0, 1, 2, 3, 4].map((s) => ways.filter((v) => v.slot === s).map((v) => v.style));
  const asLesson = (say, pieces) => { const ss = String(say).split(L.SENTENCE_BREAK).filter(Boolean); return ss.flatMap((s, k) => pieces(s, { line: ss, at: k })); };
  const same = (a, b) => JSON.stringify(a.map(({ sentence, ...x }) => x)) === JSON.stringify(b.map(({ sentence, ...x }) => x));
  // Mikey's own words for the game on different (pass MT), the calls his and each saying the word: the line must end in exactly this.
  const MIKEY = "Let's say it together! First, let's say it slowly. Different. Now, let's whisper it twice. Different, different. Now let's say it four times using silly voices. Different! Different! Different! Different! Now let's say it three times super fast! Different, different, different! Okay, let's try stretching it out now. Different. Great job! One last time, nice and clear. Different.";
  // The eight older vocabulary lessons Q77 (a) left as they were (pass MT) play the game since Mikey's answer to Q81 (pass MU), so no
  // lesson waits: the list is held empty, so it can never grow by a quiet edit.
  const WAITING_NONE = [];
  const vocab = (m) => /II\.D\.[12]\b|P-LC [67]\b/.test([].concat(m.sources || []).join(' '));   // ELOF's vocabulary goals are P-LC 6 and 7 (round one's alignment read)
  const problems = (mods, { lessons = L.SAY_ALONG_LESSONS, waits = L.SAY_ALONG_WAITS, pieces = L.speechPieces, syllables = L.SAY_ALONG_SYLLABLES } = {}) => { const bad = []; const styles = new Set(); const used = new Set(); let n = 0; const lessonsWith = new Set(); let mikey = false;
    for (const m of mods) { const orders = new Map(); const heard = [0, 1, 2, 3, 4].map(() => new Set()); let games = 0;
      for (const [li, line] of (m.lesson.script || []).entries()) {
        const ss = String(line.say).split(L.SENTENCE_BREAK).filter(Boolean); const parts = L.sayAlongParts(ss);
        for (const [i, s] of ss.entries()) if (/^Let's say it\b.*together!$/.test(s.trim()) && parts[i].role !== 'open') bad.push(`${m.id} ${li}: "${s}" reads like the opener but opens no game`);
        for (const s of ss) if (/^Say [a-z ]+ with me, in silly voices!$/.test(s.trim())) bad.push(`${m.id} ${li}: pass MS's cue "${s}" is still said`);
        const whole = pieces(line.say); const read = asLesson(line.say, pieces);
        for (const [i, p] of parts.entries()) { if (p.role !== 'open') continue;
          n++; games++; lessonsWith.add(m.id); used.add(p.word);
          if (!lessons.includes(m.id)) bad.push(`${m.id} ${li}: a say-along outside the say-along lessons`);
          const game = parts.slice(i + 1);
          if (!game.every((x) => ['call', 'form', 'praise'].includes(x.role) && x.word === p.word)) bad.push(`${m.id} ${li}: the game for ${p.word} does not end its line`);
          const calls = game.filter((x) => x.role === 'call'); const steps = calls.filter((x) => !x.voice.last);
          if (calls.length !== 6 || !calls[5].voice.last || steps.some((x, k) => x.form !== k || x.voice.slot !== k)) bad.push(`${m.id} ${li}: ${p.word} does not play five steps in order and then the clear one`);
          const praiseAt = game.findIndex((x) => x.role === 'praise'); const clearAt = game.findIndex((x) => x.role === 'call' && x.voice.last);
          if (game.filter((x) => x.role === 'praise').length !== 1 || praiseAt !== clearAt - 1) bad.push(`${m.id} ${li}: ${p.word}'s "Great job!" is not said once, just before the clear one`);
          const key = steps.map((x) => x.voice.style).join(' '); if (orders.has(key)) bad.push(`${m.id} ${li}: ${p.word} plays ${key}, as ${orders.get(key)} does`); orders.set(key, p.word);
          steps.forEach((x) => { heard[x.voice.slot].add(x.voice.style); styles.add(x.voice.style); });
          const syl = syllables[p.word]; if (!syl || syl.join('') !== p.word) bad.push(`${m.id} ${li}: ${p.word}'s syllables (${syl ? syl.join('|') : 'none written'}) do not make the word`);
          // The line's own words end on the word, so the it of "Let's say it together!" is the word (round one's lesson check: in 29 of 34
          // lines the last thing a child heard was another word, a count or a thing in the picture).
          if (!(i > 0 && new RegExp(`\\b${p.word}[.!?]*$`, 'i').test(ss[i - 1].trim()))) bad.push(`${m.id} ${li}: ${p.word} is not the last word said before its opener`);
          if (m.id === 'learning-words' && p.word === 'different') mikey = ss.slice(i).join(' ') === MIKEY;
          // The opener excited, the praise a cheer, and each form as the device voice says it.
          const at = (sentence) => whole.filter((x) => x.sentence === ss.indexOf(sentence));
          if (!at(p.sentence).every((x) => x.shape === 'sayOpen')) bad.push(`${m.id} ${li}: the opener is not said excited (sayOpen)`);
          if (praiseAt >= 0 && !at(game[praiseAt].sentence).every((x) => x.shape === 'cheer')) bad.push(`${m.id} ${li}: "Great job!" is not said as a cheer`);
          for (const c of calls) { const v = c.voice; const fp = whole.filter((x) => x.inForm === `${c.form}-${p.word}`); const said = fp.filter((x) => !x.sound); const sounds = fp.filter((x) => x.sound);
            const shapeAt = (k) => (v.device.length > 1 ? `${v.style}${k + 1}` : v.style);
            const wantShapes = v.joined ? [v.style] : Array.from({ length: v.times }, (_, k) => shapeAt(k));
            const wantSounds = v.apart ? [...Array.from({ length: v.times - 1 }, () => v.between).filter(Boolean), ...(v.after ? [v.after] : [])] : [];
            const text = v.joined ? `${L.sayAlongForm(p.word, v).replace(/[.!?]+$/, '').split(/,\s*/).join(' ')}${v.end}` : L.sayAlongForm(p.word, v);
            const ok1 = JSON.stringify(said.map((x) => x.shape)) === JSON.stringify(wantShapes) && said.every((x) => x.sayAlong && x.sayAlong.word === p.word && x.sayAlong.style === v.style)
              && JSON.stringify(sounds.map((x) => x.sound)) === JSON.stringify(wantSounds) && (!v.between || fp.slice(0, -1).every((x, k) => (k % 2 === 1) === !!x.sound))
              && said.every((x, k) => (k < said.length - 1 && v.pause ? x.pauseAfter === v.pause : !x.pauseAfter)) && (!v.joined || said[0].sayAlong.joined === v.times)
              && fp.length > 0 && fp.slice(0, -1).every((x) => !x.echo) && fp[fp.length - 1].echo >= 700 && fp[fp.length - 1].echo <= 1800
              && said.map((x) => x.text).join(' ') === text;
            if (!ok1) bad.push(`${m.id} ${li}: the voice does not say ${p.word} ${v.style} as its way's shape (${JSON.stringify(fp.map((x) => x.sound || `${x.shape}${x.pauseAfter ? `+${x.pauseAfter}` : ''}`))})`); } }
        if (!same(read, whole)) bad.push(`${m.id} ${li}: read a sentence at a time, the line is said otherwise than whole`);
        if (whole.some((x) => x.sound && ['whistle', 'applause'].includes(x.sound) && x.inForm === undefined)) bad.push(`${m.id} ${li}: a cheer's sound outside a cheer`);
      }
      // A lesson's variety: both flavors of the first, second and fifth steps once it has two games, and as many silly thirds as games.
      if (games >= 2) { for (const s of [0, 1, 4]) if (heard[s].size < slots[s].length) bad.push(`${m.id} never plays ${slots[s].filter((w) => !heard[s].has(w)).join(', ')} at step ${s + 1}`);
        if (heard[2].size < Math.min(games, slots[2].length)) bad.push(`${m.id} plays ${heard[2].size} silly thirds in ${games} games`); }
      // Q77 (a): every pre-K lesson that cites a vocabulary outcome plays the game, but the older ones that wait by name.
      if (/^PK/.test(m.grade || '') && vocab(m) && !lessons.includes(m.id) && !waits.includes(m.id)) bad.push(`${m.id} cites a vocabulary outcome and plays no say-along (Q77 (a))`);
      if (m === mods[mods.length - 1] && JSON.stringify([...waits].sort()) !== JSON.stringify([...WAITING_NONE].sort())) bad.push(`SAY_ALONG_WAITS names lessons let off the game, where Q81 (a) gave it to all of them: ${waits}`);
    }
    for (const id of lessons) if (!lessonsWith.has(id) && mods.some((m) => m.id === id)) bad.push(`${id} plays no say-along`);
    if (!mikey) bad.push('Learning words\' different does not play Mikey\'s own version word for word');
    return { bad, styles, n, lessonsWith: [...lessonsWith], used }; };
  const graded = L.COURSES.flatMap((c) => c.modules.map((m) => ({ ...m, grade: c.grade })));
  const real = problems(graded);
  const stale = Object.keys(L.SAY_ALONG_SYLLABLES).filter((w) => !real.used.has(w));
  const waitsReal = L.SAY_ALONG_WAITS.filter((id) => !graded.some((m) => m.id === id && /^PK/.test(m.grade) && vocab(m)));
  const swap = (id, fn) => graded.map((m) => (m.id === id ? { ...m, lesson: { ...m.lesson, script: fn(m.lesson.script) } } : m));
  const edit = (id, from, to) => swap(id, (s) => s.map((l) => ({ ...l, say: l.say.replace(from, to) })));
  const game = (word, list) => L.sayAlong(word, list);
  // The pieces as pass MS said super fast, a saying a piece, and the four silly voices with no pause between: near misses below.
  const sayingApart = (ps) => ps.flatMap((p) => (p.sayAlong && p.sayAlong.joined ? p.text.replace(/!$/, '').split(' ').reduce((acc, w, k, all) => { const per = all.length / p.sayAlong.joined; if (k % per === 0) acc.push([]); acc[acc.length - 1].push(w); return acc; }, []).map((ws, k, all) => ({ ...p, text: `${ws.join(' ')}${k < all.length - 1 ? ',' : '!'}`, sayAlong: { ...p.sayAlong, rep: k, joined: undefined }, echo: k === all.length - 1 ? p.echo : undefined })) : [p]));
  const plants = [
    problems(edit('people-and-events', ' One last time, nice and clear. Grandpa.', '')),   // no clear saying: the opener opens no game
    problems(edit('people-and-events', 'Grandpa! Grandpa! Grandpa! Grandpa!', 'Grandpa! Grandpa! Grandpa!')),   // four silly voices said three
    problems(edit('people-and-events', 'One last time, nice and clear. Grandpa.', 'One last time, nice and clear. Grandpa. He is a grown-up.')),   // words after the game
    problems(edit('learning-words', game('same', ['slow', 'mouse', 'slide', 'fast', 'stretch']), game('same', ['slow', 'whisper', 'silly', 'fast', 'stretch']))),   // same plays different's ways
    problems(edit('learning-words', game('match', ['giant', 'mouse', 'chant', 'fast', 'dough']), game('match', ['giant', 'mouse', 'silly', 'fast', 'dough']))),   // the lesson never cheers: two silly thirds in three games
    problems(edit('learning-words', "Let's say it together! First, let's say it like a big, sleepy giant. Match.", "Let's say it all together! First, let's say it like a big, sleepy giant. Match.")),   // the opener in other words
    problems(edit('learning-words', game('different', ['slow', 'whisper', 'silly', 'fast', 'stretch']), game('different', ['slow', 'mouse', 'silly', 'fast', 'stretch']))),   // Mikey's version changed
    problems(edit('learning-words', 'Great job! One last time, nice and clear. Different.', 'One last time, nice and clear. Different.')),   // no praise
    problems(edit('words-go-together', /^[^]*?(Let's say it together! First, let's say it like a big, sleepy giant\. Clothes\.)/, '$1')),   // the word not said before its opener
    problems(edit('learning-words', 'so they match. Our word is same. ', 'so they match. ')),   // a line that ends on match before same's opener (round one)
    problems(graded, { lessons: L.SAY_ALONG_LESSONS.slice(1) }),   // a say-along outside the say-along lessons
    // A pre-K vocabulary lesson with no game (Q77 (a), and since pass MU Q81 (a)): Colors with its four games taken out, and out of the list.
    problems(swap('colours', (s) => s.map((l) => ({ ...l, say: l.say.replace(/ Our word is [a-z]+\. Let's say it together![^]*$/, '') }))), { lessons: L.SAY_ALONG_LESSONS.filter((x) => x !== 'colours') }),
    // A new pre-K lesson citing II.D.1 and playing no game, which only the Q77 (a) guard catches (the second read of round one, pass
    // MT: since round one's eight-lesson hold, the list without Colors fails that hold too, so it no longer proved the guard).
    problems([...graded, { id: 'new-vocab-pk4', grade: 'PK4', sources: ['Aligned with Texas Prekindergarten Guidelines (2027 recommendations) II.D.1'], lesson: { script: [{ say: 'This is a hat.' }] } }]),
    problems(graded, { waits: [...L.SAY_ALONG_WAITS, 'colours'] }),   // a lesson let off the game by name again (pass MT's round one: a ninth; since Q81 (a), any)
    problems(graded, { syllables: { ...L.SAY_ALONG_SYLLABLES, different: ['dif', 'fer', 'nt'] } }),   // syllables that do not make the word
    problems(graded, { pieces: (text, o) => L.speechPieces(text, o).map((x) => (x.shape === 'whisper' ? { ...x, shape: 'plain' } : x)) }),   // a whisper said plain
    problems(graded, { pieces: (text, o) => L.speechPieces(text, o).map((x) => (x.shape === 'sayOpen' ? { ...x, shape: 'plain' } : x)) }),   // the opener said plain
    problems(graded, { pieces: (text, o) => L.speechPieces(text, o).filter((x) => x.sound !== 'whistle') }),   // a cheer with no whistles
    problems(graded, { pieces: (text, o) => L.speechPieces(text, o).filter((x) => x.sound !== 'applause') }),   // a cheer with no crowd after it
    problems(graded, { pieces: (text, o) => sayingApart(L.speechPieces(text, o)) }),   // super fast a saying a piece, as pass MS said it
    problems(graded, { pieces: (text, o) => L.speechPieces(text, o).map(({ pauseAfter, ...x }) => x) }),   // no brief pauses between the silly voices
    problems(graded, { pieces: (text, o) => L.speechPieces(text, Array.isArray(o && o.line) ? {} : o) }),   // a sentence read without its line (pass MR's way)
  ].map((p) => p.bad.length > 0);
  ok(`every say-along is Mikey's game, "Let's say it together!", five steps each called in his openings, the line's own words ending on its word, "Great job!" and the clear one, ending its line, each way in its own shape on the device voice, the same read a sentence at a time, Learning words' different his own version, and every pre-K vocabulary lesson plays it, none waiting (Q77 (a), Q81 (a); ${real.n} words in ${real.lessonsWith.length} lessons, ${real.styles.size} ways; ${plants.length} near misses caught)`,
    real.bad.length === 0 && real.n >= 30 && real.styles.size === ways.length && L.SAY_ALONG_LESSONS.every((id) => real.lessonsWith.includes(id)) && stale.length === 0 && waitsReal.length === 0 && plants.every(Boolean), [...real.bad.slice(0, 6), `stale syllables ${stale}`, `waits not vocabulary lessons ${waitsReal}`, `plants ${plants}`, `lessons ${real.lessonsWith}`].join(' | '));
  // The device voice's shapes come from logic's ways (SAY_ALONG_SHAPES, with the opener's), each keeps its own pace for a young
  // learner, and each sounds apart from the clear one (a rate a fifth apart, a pitch three tenths apart, or a softer volume); Mikey's
  // numbers: slowly three times as drawn out as pass MS's (its rate a third of 0.48), whispered slower than pass MS's whisper but
  // quicker than slowly, super fast quicker than pass MS's 1.85, the four silly voices four pitches, some above and some below the clear
  // one, at four paces, the clear one at the young voice's ordinary pace (0.86 times 0.9), and the opener higher than the plain words;
  // the slide steps down and the bounce goes high, low, high, low. The recorded voice's ledger row for each form carries its way's tag
  // (each silly voice its own, two of them the British and the Australian accent in the same voice), the opener, the calls and the
  // praise their own; and the lesson shows its not-final note in a panel under its buttons.
  const by = (s) => L.SAY_ALONG_VOICES.find((v) => v.style === s); const clear = by('clear');
  const apart = ways.every((v) => v.device.every((d, k) => (v.style === 'slide' && k === 1) || Math.abs(d.rate - clear.device[0].rate) >= 0.2 || Math.abs(d.pitch - clear.device[0].pitch) >= 0.3 || (d.volume !== undefined && d.volume <= 0.6)));   // the slide's middle step passes the clear voice's pitch on its way down
  const silly = by('silly').device; const mikeyNumbers = Math.abs(by('slow').device[0].rate - 0.48 / 3) < 1e-9 && by('whisper').device[0].rate < 0.8 && by('whisper').device[0].rate > by('slow').device[0].rate && by('fast').device[0].rate > 1.85 && by('fast').joined
    && new Set(silly.map((d) => d.pitch)).size === 4 && new Set(silly.map((d) => d.rate)).size === 4 && silly.some((d) => d.pitch > clear.device[0].pitch) && silly.some((d) => d.pitch < clear.device[0].pitch) && by('silly').pause > 0
    && Math.abs(clear.device[0].rate - 0.86 * 0.9) < 0.01 && L.SAY_ALONG_OPEN_SHAPE.pitch > 1.15;
  const slide = by('slide').device; const steps = slide.length === by('slide').times && slide.every((d, k) => k === 0 || d.pitch < slide[k - 1].pitch);
  const bounce = by('bounce').device; const bounced = bounce.length === 4 && bounce.every((d, k) => (k % 2 === 0 ? d.pitch > 1.5 : d.pitch < 0.6));
  // Since pass MV the voices a lesson shows (VOICE_MANNERS) are spread in after the say-along's, each named said-, so neither takes the
  // other's place nor a base shape's (MANNER_SHAPES; the rules test's manners case reads their shapes and directions).
  const shaped = ui.includes('const SAY_ALONG_SHAPES = { sayOpen: SAY_ALONG_OPEN_SHAPE, ...Object.fromEntries(SAY_ALONG_VOICES.flatMap(') && /const SPEECH_SHAPES = \{[^;]*\.\.\.SAY_ALONG_SHAPES, \.\.\.MANNER_SHAPES \};/.test(ui) && ui.includes("const OWN_PACE_SHAPES = ['key', 'cheer', ...Object.keys(SAY_ALONG_SHAPES)];") && !/const OWN_PACE_SHAPES = [^;]*MANNER_SHAPES/.test(ui);   // since round one's screen check (pass MV) the young voice slows a manner with its words
  const baseShapes = ((/const SPEECH_SHAPES = \{([^;]*)\.\.\.SAY_ALONG_SHAPES, \.\.\.MANNER_SHAPES \};/.exec(ui) || [])[1] || '').match(/\b([a-z]+): \{/g) || []; const base = baseShapes.map((x) => x.replace(/: \{$/, ''));
  const wayShapes = (vs) => ['sayOpen', ...vs.flatMap((v) => (v.device.length === 1 ? [v.style] : v.device.map((_, k) => `${v.style}${k + 1}`)))];
  const apartFromBase = base.length >= 5 && base.includes('cheer') && !wayShapes(L.SAY_ALONG_VOICES).some((s) => base.includes(s)) && wayShapes(L.SAY_ALONG_VOICES.map((v) => (v.style === 'chant' ? { ...v, style: 'cheer' } : v))).some((s) => base.includes(s));
  const rowsOf = LEDGER_CSV.split('\n');
  const tagged = L.MODULES.every((m) => (m.lesson.script || []).every((l) => L.sayAlongParts(l.say).every((p) => p.role === 'say' || rowsOf.some((r) => r.includes(`${p.role === 'form' ? (p.voice.tags && p.voice.tags[p.rep]) || p.voice.tag : SAY_ALONG_TALK[p.role]} ${p.sentence}`)))))
    && by('silly').tags.length === 4 && by('silly').tags.some((t) => /British accent, the same voice/.test(t)) && by('silly').tags.some((t) => /Australian accent, the same voice/.test(t)) && /excited/.test(SAY_ALONG_TALK.open) && /playful/.test(SAY_ALONG_TALK.call);
  // Since round one's screen check (pass MV) a lesson that shows voices a phone cannot truly make carries the panel too.
  const noted = ui.includes("const playfulLesson = script.some((l) => sayAlongParts(l.say).some((p) => p.role === 'open') || (Array.isArray(l.voices) && l.voices.length));") && ui.includes('{playfulLesson ? <VoiceNote near keys={lineKeys} /> : <VoiceNote keys={lineKeys} />}');
  ok('each way has its own shape and pace on the device, never named like a speech shape the app already has (a way named cheer overrode every welcome\'s HAVE FUN cheer; near miss caught), apart from the clear one, by Mikey\'s numbers (slowly a third of pass MS\'s rate, a slower whisper, super fast quicker and in one breath, four silly voices at four pitches and paces with pauses between, the clear one at the young voice\'s pace, the opener excited), the slide stepping down and the bounce high and low; each form its own tag in the recording ledger, the accents in the same voice; and the lesson its not-final note', apart && apartFromBase && mikeyNumbers && steps && bounced && shaped && tagged && noted, `apart ${apart}, base ${apartFromBase} (${base}), numbers ${mikeyNumbers}, steps ${steps}, bounced ${bounced}, shaped ${shaped}, tagged ${tagged}, noted ${noted}`);
  // The strip under the line (SayAlongStrip): the lesson shows the line's own words in the paragraph and the say-along's in the strip,
  // the strip only on a line with an opener, and the lesson tells it each piece's start and end; "Great job!" shows while it is said.
  // Since pass NE the strip sits in a wrapper that keeps its room for the scroll cue outside its key (round one's screen read).
  const strip = ui.includes("{lineParts.some((x) => x.role === 'open') && <div data-cue-room=\"\" style={{ paddingRight: 'var(--cue-room, 0px)' }}><SayAlongStrip key={`${lessonStep}-${replays}`} parts={lineParts} lit={litSentence} /></div>}")
    && ui.includes(".filter(({ i }) => !lineParts[i] || lineParts[i].role === 'say')") && ui.includes("{ together: true, voices: currentLessonVoices, onPieceEnd: (i, k, piece) => sayAlongBus.emit({ type: 'end', i, piece }) }")
    && ui.includes("const shownLabel = voiced && call ? call.sentence : voiced && praise ? praise.sentence : open.sentence;");
  ok('a say-along line shows its own words in the paragraph and the game in the strip under it, which the voice tells of each piece', strip, `strip ${strip}`);
  // Since round two's code read (pass NE), and the third read: a practice round's feedback box that turns or swells (a wrong tap's wobble,
  // a right tap's cheer) keeps the room for the scroll cue chosen before its first frame, and its own animation's end (edu-cue-check)
  // decides again (clearCueRoom in src/ui.jsx), which holds while each animation's first and last frames are at rest. Plants: the wobble's
  // first frame turned 2 degrees, and the cheer's last frame swelled, each caught. How long they last no longer matters (the third read: a
  // cheer of 1.3 seconds passed cue-words), since the animation's own end decides.
  const keyframesOf = (src, name) => { const i = src.indexOf('@keyframes ' + name + ' {'); if (i < 0) return null; const s = src.indexOf('{', i); let d = 0, j = s; for (; j < src.length; j++) { if (src[j] === '{') d++; else if (src[j] === '}' && --d === 0) break; } return src.slice(s + 1, j); };
  const frameAtRest = (src, name, ends) => { const body = keyframesOf(src, name); if (body === null) return false;
    for (const m of body.matchAll(/([^{}]+)\{([^}]*)\}/g)) { const sel = m[1].split(',').map((x) => x.trim()); if (!ends.some((e) => sel.includes(e))) continue;
      const t = (/transform:\s*([^;]+)/.exec(m[2]) || [])[1]; if (!t || t.trim() === 'none') return true;
      return [...t.matchAll(/(\w+)\(([^)]*)\)/g)].every(([, fn, arg]) => arg.split(',').every((x) => parseFloat(x) === (/^scale/.test(fn) ? 1 : 0))); }
    return true; };
  const feedbackRests = (src) => src.includes("className={wasCorrect ? 'edu-cheer' : 'edu-wobble'}") && ['edu-wobble', 'edu-cheer'].every((n) => frameAtRest(src, n, ['0%', 'from']) && frameAtRest(src, n, ['100%', 'to']));
  const turnedFirst = ui.replace('@keyframes edu-wobble { 0%, 100% { transform: translateX(0) rotate(0deg); }', '@keyframes edu-wobble { 0% { transform: translateX(0) rotate(-2deg); } 100% { transform: translateX(0) rotate(0deg); }');
  const swelledLast = ui.replace('@keyframes edu-cheer { 0%, 100% { transform: translateY(0) scale(1); }', '@keyframes edu-cheer { 0% { transform: translateY(0) scale(1); } 100% { transform: translateY(0) scale(1.05); }');
  ok("a feedback box that wobbles or cheers starts and ends at rest, so the room chosen before its first frame is its resting room and its own animation's end decides again (round two's code read and the third read, pass NE; the wobble's first frame turned 2 degrees and the cheer's last frame swelled, planted, caught)", feedbackRests(ui) && turnedFirst !== ui && swelledLast !== ui && !feedbackRests(turnedFirst) && !feedbackRests(swelledLast), JSON.stringify({ now: feedbackRests(ui), turned: feedbackRests(turnedFirst), swelled: feedbackRests(swelledLast) }));
  // No fade on a read-along light (round one's lesson check, pass MT): the ink turns at once, so a fading fill left a word dark on the
  // dark card or pale on green at every change; the strip's syllables, LIT_WORDS and the lesson's sentences change ink and fill in one
  // frame. Near miss: the strip as first built, with its 40 ms fade.
  // Since the second read of round one, every line that lights with readLit() is read too, so a Wonder choice being read (its fill
  // faded over 200 ms while its ink turned at once) or a lit sentence's unlit side fades nowhere; near miss: the Wonder button's fade.
  const litLineFades = (src) => src.split('\n').some((l) => /readLit\(\)[^\n]*transition: '[^']*background/.test(l) || /transition: '[^']*background[^\n]*readLit\(\)/.test(l));
  const fades = (src) => /const LIT_WORDS = \{[^}]*transition/.test(src) || /data-say-along-syllable=\{k\} style=\{[^\n]*transition: 'background/.test(src) || /litSentence === i \? \{ \.\.\.readLit\(\), \.\.\.LIT_WORDS \} : \{[^}]*transition/.test(src) || litLineFades(src);
  const wonderAt = ui.indexOf('data-wonder-lit=');
  const wonderFade = wonderAt > 0 ? ui.slice(0, wonderAt) + ui.slice(wonderAt).replace("transition: 'transform 200ms'", "transition: 'transform 200ms, background 200ms'") : ui;
  ok('no read-along light fades: the strip\'s syllables, LIT_WORDS, the lesson\'s and every lit sentence and a Wonder choice being read change ink and fill in one frame (round one and its second read, pass MT; two near misses caught)', !fades(ui) && fades(ui.replace("...LIT_WORDS, transition: 'none', margin: 0", "...LIT_WORDS, transition: 'background 40ms', margin: 0")) && wonderFade !== ui && fades(wonderFade), `fades ${fades(ui)}`);
  // The light's timing (logic): a piece lights each syllable once, in order, inside the time the voice is guessed to take, a word of one
  // syllable whole; a way said in one breath lights every saying in turn, a little ahead (SAY_ALONG_JOINED_LEAD); the child's turn
  // sits between 0.7 and 1.8 seconds.
  const timed = ways.concat([clear]).every((v) => Object.values(L.SAY_ALONG_SYLLABLES).every((syl) => { const real = syl.filter((s) => s !== ' ').length;
    return Array.from({ length: v.joined ? 1 : v.times }, (_, r) => r).every((r) => { const line = L.sayAlongTimeline(syl, v, r); const est = L.sayAlongEstimateMs(syl, v, r);
      const reps = v.joined ? v.times : 1;
      return line.length === real * reps && line.every((x, k) => (v.joined ? x.rep === Math.floor(k / real) : x.rep === r) && (k === 0 || x.at >= line[k - 1].at) && x.until > x.at && x.until <= est + 1) && line[0].at === 0; }) && L.sayAlongEcho(syl, v) >= 700 && L.sayAlongEcho(syl, v) <= 1800; }));
  ok('the say-along light reaches each syllable in order inside the time the voice is guessed to take, super fast\'s three sayings in turn, and the child\'s turn is 0.7 to 1.8 seconds', timed, `timed ${timed}`);
  // The pace the light learns from the voice (logic's sayAlongPaceNext since round one's code check, pass MS): two fifths of the way to
  // what a saying took over its guess, between half and 2.2 times the guess, left alone for a saying too short to measure or of one
  // syllable; since pass MT kept for each shape too (sayAlongLearn): a shape's first heard saying sets its own pace, later ones move it
  // two fifths, between a quarter and four times, and only a rate a phone says as asked (0.4 to 1.6) moves the pace of all, which a shape
  // not yet heard starts from. The screen keeps the paces for the visit and takes each saying's from logic.
  const P = L.sayAlongPaceNext; const near = (x, y) => Math.abs(x - y) < 1e-9; const Lp = L.sayAlongLearn; const Of = L.sayAlongPaceOf;
  const dif = ['dif', 'fer', 'ent'];
  const paced = near(P(1, 2000, 1000), 1.4) && near(P(1, 500, 1000), 0.8) && P(1, 100000, 1000) === 2.2 && P(0.6, 151, 100000) === 0.5 && P(1.3, 150, 1000) === 1.3 && P(1.3, 900, 0) === 1.3
    && P(1, 2000, 1000, ['match']) === 1 && near(P(1, 2000, 1000, dif), 1.4)
    && Of({}, 'slow') === 1 && near(Lp({}, 'slow', 0.16, 1000, 3000, dif).slow, 1 / 3) && Lp({}, 'slow', 0.16, 1000, 3000, dif).all === undefined && near(Lp({ slow: 0.5 }, 'slow', 0.16, 900, 3000, dif).slow, 0.42)
    && Lp({}, 'slow', 0.16, 600, 3000, dif).slow === 0.25 && Lp({}, 'slow', 0.16, 100, 3000, dif).slow === undefined && Lp({}, 'slow', 0.16, 4000, 1000, dif).slow === 4 && Lp({}, 'slow', 0.16, 5000, 1000, dif).slow === 4
    && Lp({}, 'x', 1.6, 1200, 1000, dif).all !== undefined && Lp({}, 'x', 1.7, 1200, 1000, dif).all === undefined && Lp({}, 'x', 0.4, 1200, 1000, dif).all !== undefined && Lp({}, 'x', 0.39, 1200, 1000, dif).all === undefined
    && (() => { const sv = L.SAY_ALONG_VOICES.find((v) => v.style === 'silly'); const f = L.SAY_ALONG_VOICES.find((v) => v.style === 'fast'); const a1 = L.sayAlongShapeOf({ shape: 'silly2' }, sv, 1); const a2 = L.sayAlongShapeOf({ shape: 'fast' }, f, 0); const a3 = L.sayAlongShapeOf(null, f, 0); return a1.shape === 'silly2' && a1.rate === sv.device[1].rate && a2.shape === 'fast' && a2.rate === 2.2 && a3.shape === 'fast'; })()
    && ui.includes('const { shape, rate } = sayAlongShapeOf(ev.piece, v, rep);') && near(Lp({}, 'whisper', 0.45, 1200, 1000, dif).all, 1.08) && near(Of({ all: 1.2 }, 'giant'), 1.2) && Lp({}, 'fast', 2.2, 900, 1000, ['toys']).fast === undefined
    && ui.includes('sayAlongPaces = sayAlongLearn(sayAlongPaces, started.current.shape, started.current.rate, took, started.current.est, started.current.syllables);') && ui.includes('const k = sayAlongPaceOf(sayAlongPaces, shape);') && /if \(started\.current\.heard\) \{ const took/.test(ui) && ui.includes('if (!sayAlongStartsHeard) timers.current.push(setTimeout(() => run(false), 700));') && !/sayAlongPace = /.test(ui)
    && (ui.match(/started\.current = \{ at: (?:Date\.now\(\)|null), est, i: ev\.i, rep, heard(?:: false)?, syllables: part\.syllables, shape, rate \};/g) || []).length === 2 && ui.includes('if (ev.begun === true) sayAlongStartsHeard = true;') && ui.includes('if (ev.begun !== false) { run(true); return; }');
  ok('the say-along light learns the voice\'s pace by logic\'s rules, for each shape and for all, from heard sayings of two syllables or more (pass MS, round one\'s code check and round three\'s reads; pass MT, a pace a shape)', paced, `paced ${paced}`);
  // Every say-along line in its lessons' order, as a phone's voice says it (a piece's letters at 40, 62 and 80 ms a letter over its
  // rate, and 120 ms more), through logic's timeline, estimate and paces: every piece's last syllable lights before the voice ends it,
  // but a shape's first saying of two syllables or more on the visit, which has only the pace of all to go by; and the same on a phone
  // that holds a rate between 0.5 and 2 (a floor and a ceiling), where the slow way takes a third of its guess. Near misses: the one pace
  // of pass MS for every shape, which on that phone leaves the slow ways short about half the time (31, 31 and 27 of their sayings at
  // the three paces; round one's alignment read corrected "every time", and super fast is not among them); and the one-breath light at
  // the full guess, which leaves super fast's last syllable short on baby, birthday party and animals.
  { const lines = []; for (const id of L.SAY_ALONG_LESSONS) { const mod = L.COURSES.flatMap((c) => c.modules).find((m) => m.id === id); L.readAloudScript(mod).forEach((s) => { if (L.sayAlongParts(s.say).some((x) => x.role === 'open')) lines.push(s.say); }); }
    const split = (x) => String(x).split(L.SENTENCE_BREAK).filter((y) => y.trim());
    const short = (perChar, { clamp = false, rule = 'shape', lead = true, otherLead = true } = {}) => { let paces = {}; let pace = 1; let late = 0; let cold = 0; let n = 0;
      for (const say of lines) { const texts = split(say); for (const p of texts.flatMap((x, k) => L.speechPieces(x, { line: texts, at: k }))) { if (!p.sayAlong) continue; n += 1;
        const sa = p.sayAlong; const v = L.SAY_ALONG_VOICES.find((x) => x.style === sa.style); const d = v.device[Math.min(sa.rep, v.device.length - 1)]; const r = clamp ? Math.max(0.5, Math.min(2, d.rate)) : d.rate;
        const took = Math.round((p.text.replace(/[^A-Za-z]/g, '').length * perChar) / r) + 120; const tl = L.sayAlongTimeline(sa.syllables, v, sa.rep); const est = L.sayAlongEstimateMs(sa.syllables, v, sa.rep);
        const sh = L.sayAlongShapeOf(p, v, sa.rep); const k = (rule === 'shape' ? Of(paces, sh.shape) : pace) * (v.joined && !lead ? 1 / L.SAY_ALONG_JOINED_LEAD : 1) * (!v.joined && !otherLead ? 1 / L.SAY_ALONG_LEAD : 1); const multi = sa.syllables.filter((s) => s !== ' ').length > 1;
        if (tl[tl.length - 1].at * k >= took) { if (multi && rule === 'shape' && !(paces[sh.shape] > 0)) cold += 1; else late += 1; }
        if (rule === 'shape') paces = Lp(paces, sh.shape, sh.rate, took, est, sa.syllables); else pace = P(pace, took, est, sa.syllables); } }
      return { late, cold, n }; };
    const paces = [40, 62, 80]; const now = paces.flatMap((c) => [short(c), short(c, { clamp: true })]);
    const before = paces.map((c) => short(c, { clamp: true, rule: 'one' })); const full = paces.map((c) => short(c, { lead: false }));
    // A voice quicker than the three paces (30 ms a letter, on a phone that says every rate): the other ways' lead, SAY_ALONG_LEAD, keeps
    // every saying lit in time, and the full guess leaves some late (round one's code check, pass MU: police officer slid, three).
    const quick = short(30); const quickFull = short(30, { otherLead: false });
    ok(`every say-along saying's last syllable lights before a phone's voice ends it, but a shape's first on the visit, over every line in order at 40, 62 and 80 ms a letter, on a phone that says every rate and on one that holds rates between 0.5 and 2, and at 30 ms a letter on the first (${lines.length} lines, ${now[0].n} pieces; pass MS's one pace left ${before.map((x) => x.late).join(', ')} short on the second, the full guess ${full.map((x) => x.late).join(', ')} on the first, and at 30 ms the other ways' full guess ${quickFull.late})`,
      lines.length >= 30 && now.every((x) => x.late === 0 && x.cold <= 6 && x.n > 250) && before.every((x) => x.late > 6) && full.some((x) => x.late > 0) && quick.late === 0 && quickFull.late > 0, JSON.stringify({ now, before, full, quick, quickFull })); }
  // A say-along lesson's citations never say a child is not asked to say its words, which the game asks for (round one's lesson check,
  // pass MU: Listen and tap's and Animal sounds' II.D.1 said so after the game came to them); near miss: the words planted back.
  { const saysNotAsked = (mods) => mods.filter((m) => L.SAY_ALONG_LESSONS.includes(m.id) && (m.sources || []).some((s) => /\bnot asked to (say|use|repeat)\b/i.test(s))).map((m) => m.id);
    const planted = L.MODULES.map((m) => (m.id === 'animal-sounds' ? { ...m, sources: [...m.sources, 'in part, since a child here understands the words for their sounds and is not asked to say them'] } : m));
    ok("no say-along lesson's citation says a child is not asked to say its words (pass MU, round one's lesson check; the near miss caught)", saysNotAsked(L.MODULES).length === 0 && saysNotAsked(planted).includes('animal-sounds'), saysNotAsked(L.MODULES).join(',')); }
  // The voice check page's say-along rows are lesson lines word for word, as the page says (round one's code check, pass MS: nothing
  // held them, so a lesson edit would have left the page saying an old line); near miss: a row with a call changed.
  { const { VOICE_CHECK_ROWS } = await import('../tools/voice-check.mjs'); const lines = new Set(); for (const c of L.COURSES.filter((x) => x.readAloud)) for (const m of c.modules) for (const l of L.readAloudScript(m)) lines.add(l.say);
    const rows = VOICE_CHECK_ROWS.filter((r) => r.text && r.text.includes("Let's say it together!")); const stale = rows.filter((r) => !lines.has(r.text)).map((r) => r.n);
    const nearRow = rows.length ? rows[rows.length - 1].text.replace("Now, let's whisper it twice.", "Now, let's whisper it two times.") : '';
    const allWays = new Set(rows.flatMap((r) => L.sayAlongParts(r.text).filter((x) => x.role === 'call').map((x) => x.voice.style)));
    ok(`the voice check page's say-along rows are lesson lines word for word, Mikey's own among them, every way played on one (${rows.length} rows; near miss caught)`, rows.length >= 6 && stale.length === 0 && rows.some((r) => r.text.endsWith(MIKEY)) && allWays.size === L.SAY_ALONG_VOICES.length && !lines.has(nearRow), `stale rows ${stale.join(', ')}, ways ${[...allWays]}`);
    // Its rows with voices too (pass MV, round one's code check: rows 73 to 84 were held to nothing): each a lesson line with the same
    // voices, or a question of My voice tells more, its setup and prompt with its voices; near miss: row 79 with its tell marked ask.
    const lineVoices = new Map(); for (const m of L.MODULES) for (const l of m.lesson.script || []) if (l.voices) lineVoices.set(l.say, JSON.stringify(l.voices));
    const asked = new Set(); for (let sd = 1; sd <= 400; sd++) { const q = L.generateQuestion('p4-tone-feel', sd); asked.add(JSON.stringify([`${q.story} ${q.prompt}`, q.voices])); }
    const matches = (r) => lineVoices.get(r.text) === JSON.stringify(r.voices) || asked.has(JSON.stringify([r.text, r.voices]));
    const voiced = VOICE_CHECK_ROWS.filter((r) => r.voices); const off = voiced.filter((r) => !matches(r)).map((r) => r.n); const row79 = voiced.find((r) => r.n === 79);
    ok(`the voice check page's rows with voices are lesson lines or My voice tells more's questions word for word, with their voices (pass MV, ${voiced.length} rows; near miss caught)`, voiced.length >= 12 && off.length === 0 && !!row79 && !matches({ ...row79, voices: row79.voices.map((e) => [e[0], 'ask']) }), `rows off ${off.join(', ')}`); }
  // logic's plain rate, which times a strong sentence's turn, is the screens' plain voice's (pass MV).
  { const uiText = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8'); const lg = readFileSync(new URL('../src/logic.mjs', import.meta.url), 'utf8');
    const uiPlain = (/plain: \{ rate: ([\d.]+),/.exec(uiText) || [])[1]; const lgPlain = (/const MANNER_PLAIN_RATE = ([\d.]+);/.exec(lg) || [])[1];
    ok('the child\'s turn after a strong sentence times its plain words at the screens\' plain rate (pass MV)', !!uiPlain && uiPlain === lgPlain, `${uiPlain} ${lgPlain}`);
    // And every turn at the young voice's pace, as every line with voices is said (round two's code read).
    const uiYoung = (/const YOUNG_RATE = ([\d.]+);/.exec(uiText) || [])[1]; const lgYoung = (/const MANNER_YOUNG_RATE = ([\d.]+);/.exec(lg) || [])[1];
    ok('the child\'s turn after a sentence is timed at the young voice\'s pace, the screens\' own (pass MV, round two)', !!uiYoung && uiYoung === lgYoung, `${uiYoung} ${lgYoung}`); }
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
  // The voices a lesson shows (pass MV, VOICE_MANNERS): every line's and every pre-K question's voices name a sentence of their own words
  // (a line's sentence, or the setup's last sentence or a choice for a question, each standing once where it is said), a manner the table
  // has, an ask sentence ending in a question mark and a tell in a full stop, and a strong sentence has one word in capitals, the word its
  // question's answer names; near misses: a voices entry for a sentence the line does not say, an unknown manner, a strong sentence in
  // small letters, an entry that is not a list, a third slot that is not a turn, and since round one's code check a question's prompt named
  // in its voices, its heard sentence said twice, a tell marked ask and a strong question keyed to the other word (a near miss since round
  // two's alignment read, which found the clause held and no case trying it). Since round two too: a line that asks the child to say it
  // back (Your turn, Now you try, like me) carries a turn, and only such a line (near misses: My voice goes up and down's line 9 without
  // its turn, and since the third read A voice to fit the place's first line given one it does not ask for), and a question asks by ear only by pitch, pace, a question's lift, telling's fall or a strong word, never loudness alone
  // (high, low, ask, tell, strong, happy, sad; near miss: a heard sentence whispered).
  { const ss = (t) => String(t || '').split(L.SENTENCE_BREAK).filter((x) => x.trim()).map((x) => x.trim());
    const once = (list, t) => list.filter((x) => x === String(t).trim()).length === 1;
    const bad = (said, entries) => (entries || []).filter((e) => !Array.isArray(e) || !once(said, e[0]) || !L.VOICE_MANNERS[e[1]] || (e[2] !== undefined && e[2] !== 'turn') || (e[1] === 'strong' && !L.strongWordOf(e[0])) || (e[1] === 'ask' && !/\?$/.test(String(e[0]).trim())) || (e[1] === 'tell' && !/\.$/.test(String(e[0]).trim())));
    // A question's sentence said in a manner is its setup's last sentence or one of its choices, once in its words (round one's code check:
    // any sentence of the story or the prompt was accepted, so the prompt said high, or the heard sentence said twice, passed).
    const heardIn = (q) => { const story = ss(q.story); const words = [...story, ...ss(q.prompt)]; const choices = (q.choices || []).map(String); return (q.voices || []).filter((e) => !(Array.isArray(e) && ((story.length && story[story.length - 1] === String(e[0]).trim() && once(words, e[0])) || once(choices, e[0])))); };
    const asksTurn = (l) => /\b(Your turn|Now you try|like me)\b/.test(l.say) !== l.voices.some((e) => Array.isArray(e) && e[2] === 'turn');
    const lines = []; for (const m of L.MODULES) (m.lesson.script || []).forEach((l, i) => { if (l.voices) { for (const e of bad(ss(l.say), l.voices)) lines.push(`${m.id} line ${i}: ${JSON.stringify(e)}`); if (asksTurn(l)) lines.push(`${m.id} line ${i}: a turn asked for and none given, or one given unasked`); } });
    const BY_EAR = ['high', 'low', 'ask', 'tell', 'strong', 'happy', 'sad']; const loudOnly = (q) => (q.voices || []).some((e) => !BY_EAR.includes(e[1]));
    const keyedWrong = (q) => { const sw = ((q.voices || []).find((e) => e[1] === 'strong') || [])[0]; return !!sw && /strong\?$/.test(q.prompt) && String(q.answer).toLowerCase() !== String(L.strongWordOf(sw) || '').toLowerCase(); };
    const asks = []; const banks = [...new Set(L.MODULES.filter((m) => /^PK/.test(String((L.COURSES.find((c) => c.id === m.courseId) || {}).grade))).flatMap((m) => m.generators || []))];
    for (const g of banks) for (let s = 1; s <= 200; s++) { let q; try { q = L.generateQuestion(g, s); } catch (e) { break; } if (!q.voices) continue; const said = [...ss(q.story), ...ss(q.prompt), ...(q.choices || []).map(String)];
      for (const e of bad(said, q.voices)) asks.push(`${g} seed ${s}: ${JSON.stringify(e)}`);
      for (const e of heardIn(q)) asks.push(`${g} seed ${s}: not its setup's last sentence or a choice, once: ${JSON.stringify(e)}`);
      if (keyedWrong(q)) asks.push(`${g} seed ${s}: answer`);
      if (loudOnly(q)) asks.push(`${g} seed ${s}: asks by loudness alone`);
      if (q.voices.some((e) => e[1] === 'strong') && /\b[A-Z]{2,}\b/.test(String(q.printedStory || q.story || ''))) asks.push(`${g} seed ${s}: the screen prints the strong word in capitals`); }
    const used = L.MODULES.filter((m) => (m.lesson.script || []).some((l) => l.voices)).map((m) => m.id);
    const hl = L.generateQuestion('p3-tone-highlow', 1);
    const nearMiss = bad(['Shh, the baby is sleeping.'], [['Shh, the baby sleeps.', 'whisper']]).length === 1 && bad(['Over here!'], [['Over here!', 'shout']]).length === 1 && bad(['I want the red circle.'], [['I want the red circle.', 'strong']]).length === 1 && bad(['Up high!'], [['Up high!', 'high', 'turn']]).length === 0
      && bad(['Up high!'], ['Up high!']).length === 1 && bad(['Up high!'], [['Up high!', 'high', 'again']]).length === 1 && bad(['It is a ball.'], [['It is a ball.', 'ask']]).length === 1
      && heardIn({ ...hl, voices: [...hl.voices, [hl.prompt, 'high']] }).length === 1 && heardIn({ ...hl, story: `${hl.story} ${hl.voices[0][0]}` }).length === 1 && heardIn(hl).length === 0
      && ((st) => keyedWrong({ ...st, answer: st.choices.find((c) => c !== st.answer) }) && !keyedWrong(st))(L.generateQuestion('p3-tone-strong', 1))
      && ((l9) => !!l9 && !asksTurn(l9) && asksTurn({ ...l9, voices: l9.voices.map((e) => e.slice(0, 2)) }))(L.MODULES.find((m) => m.id === 'voice-up-and-down').lesson.script[9])
      && ((l0) => !!l0 && !asksTurn(l0) && asksTurn({ ...l0, voices: l0.voices.map((e) => [e[0], e[1], 'turn']) }))(L.MODULES.find((m) => m.id === 'voice-to-fit').lesson.script[0])
      && loudOnly({ ...hl, voices: [[hl.voices[0][0], 'whisper']] }) && !loudOnly(hl);
    ok(`every line's and every pre-K question's voices name a sentence of their own once, a question's its setup's last sentence or a choice, a manner the table has with its end mark, a strong sentence one word in capitals that the screen prints small and its question keyed to it, a turn exactly where a line asks for one, and nothing asked by loudness alone (pass MV; ${used.length} lessons show voices; twelve near misses)`, lines.length === 0 && asks.length === 0 && used.length >= 3 && nearMiss, [...lines, ...asks].slice(0, 6).join(' | ')); }
  // A question asked by ear prints the same setup whatever its answer while the device can speak (pass MV, round two's alignment read:
  // p4-tone-feel printed the happy sentence with "!" and the sad one with ".", the end mark matching the face on every seed; with no voice
  // the grown-up's cue must say how, so it differs): over 400 seeds of every bank with voices (since the third read; it read three), the
  // printed setups of one heard sentence's answers, its end mark and its capitals aside, are one (a strong sentence's two answers are one
  // sentence in small letters); near miss: the feelings bank's own questions with their printed setup taken off.
  { const EAR = Object.keys(L.GENERATORS).filter((g) => { for (let s = 1; s <= 20; s++) { try { if (L.generateQuestion(g, s).voices) return true; } catch (e) { return false; } } return false; });
    const keyOf = (q) => String(q.voices[0][0]).replace(/[.!?]$/, '').toLowerCase();
    const alike = (qs) => { const by = new Map(); for (const q of qs) { const k = `${q.__g}|${keyOf(q)}`; if (!by.has(k)) by.set(k, { printed: new Set(), answers: new Set() }); const b = by.get(k); b.printed.add(L.printedQuestion(q, true).story); b.answers.add(q.answer); }
      const both = [...by.values()].filter((b) => b.answers.size > 1); return { both: both.length, apart: both.filter((b) => b.printed.size > 1).length }; };
    const qs = EAR.flatMap((g) => Array.from({ length: 400 }, (_, i) => ({ ...L.generateQuestion(g, i + 1), __g: g }))).filter((q) => Array.isArray(q.voices) && q.voices.length === 1);
    const now = alike(qs); const plant = alike(qs.filter((q) => q.__g === 'p4-tone-feel').map((q) => { const { printedStory, ...rest } = q; return rest; }));
    ok(`a question asked by ear prints the same setup whatever its answer while the device can speak, so the screen holds no sign of it (pass MV, round two's alignment read; ${EAR.length} banks with voices, ${now.both} heard sentences with both answers; near miss caught)`, EAR.length >= 8 && now.both >= 18 && now.apart === 0 && plant.apart > 0, JSON.stringify({ banks: EAR.length, now, plant })); }
  const LESSON_FLOW_WAITS = { 'red-and-blue': 1, 'find-the-match': 1, 'big-and-small': 1, 'one-and-two': 1, 'more-or-fewer': 5, 'first-marks': 1, 'yellow-and-green': 1, 'triangles-too': 2, 'big-and-little': 1, 'one-more-one-fewer': 27, 'join-in-play': 2, 'talk-with-a-friend': 4, 'talk-about-it': 4, 'rhymes-with-pictures': 7, 'circle-and-square': 2, 'a-and-b': 4, 'not-the-same': 1, 'listen-and-tap-pictures': 4, 'animal-sounds': 1, 'two-steps': 2, 'two-steps-more': 3, 'two-ideas': 2, 'two-ideas-more': 6, 'learning-words': 1, 'count-and-sort-words': 2, 'people-and-events': 1, 'colours': 1, 'same-and-different': 1, 'match-the-vehicles': 2, 'match-the-things': 1, 'match-the-water-animals': 1, 'match-the-land-animals': 3, 'match-the-shapes': 1, 'match-the-solids': 2, 'more-and-fewer-5': 2, 'bigger-and-smaller': 2, 'patterns': 12, 'count-to-3': 5, 'connect-the-dots': 1, 'taking-turns': 3, 'big-bigger-biggest': 2, 'helpers-all-around': 1, 'feelings-show': 3, 'how-friends-feel': 1, 'good-friend': 3, 'play-together': 1, 'listen-for-rhymes': 2, 'first-sounds': 1, 'which-came-first': 3, 'which-came-second': 5, 'big-letters': 1, 'first-letter-tracing': 1, 'more-big-letters': 2, 'trace-straight-letters': 3, 'three-steps': 1, 'three-steps-more': 3, 'more-learning-words': 2, 'sort-and-shape-words': 3, 'words-go-together': 1 };
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
// Every look a picture names is drawn (pass MW, round two's code read: with 'crayon~broken' taken out of ICON_LOOKS and 'cat~asleep'
// out of StudentPicture's faces, the crayon drew whole and the cat drew nothing, and every check passed). An icon's look (name~look)
// must be a key of ICON_LOOKS and a drawn animal's a key of StudentPicture's faces, both read from ui.jsx, for every lesson line's
// picture in every course and every pre-K question's pictures over sixty seeds. Near miss: crayon~melted, a look nothing draws.
{ const ui = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8');
  const keysIn = (from, to) => { const a = ui.indexOf(from); const b = a < 0 ? -1 : ui.indexOf(to, a + from.length); return new Set(a < 0 || b < 0 ? [] : [...ui.slice(a, b).matchAll(/'([a-z-]+~[a-z-]+)':/g)].map((m) => m[1])); };
  const iconLooks = keysIn('const ICON_LOOKS = {', '\n};'); const faceLooks = keysIn('const faces = {', '\n  };');
  const named = []; const walk = (v, where) => { if (!v) return; if (typeof v === 'string') { const m = /^(icon|pic):([a-z-]+~[a-z-]+)$/.exec(v); if (m) named.push([m[1], m[2], where]); return; }
    if (Array.isArray(v)) { v.forEach((x) => walk(x, where)); return; } if (typeof v !== 'object') return;
    if ((v.kind === 'icon' || v.kind === 'pic') && /~/.test(String(v.name || ''))) named.push([v.kind, v.name, where]);
    for (const k of ['a', 'b', 'items', 'show', 'visual', 'explainVisual', 'choices']) if (v[k]) walk(v[k], where); };
  for (const c of L.COURSES) for (const m of c.modules) for (const [i, line] of ((m.lesson && m.lesson.script) || []).entries()) walk(line.show, m.id + ' line ' + i);
  const prekBanks = new Set(L.COURSES.filter((c) => c.grade === 'PK3' || c.grade === 'PK4').flatMap((c) => c.modules.flatMap((m) => m.generators || [])));
  for (const b of prekBanks) for (let s = 1; s <= 60; s++) { let q; try { q = L.generateQuestion(b, s); } catch (e) { continue; } walk([q.visual, q.explainVisual, q.choices], b); }
  const undrawn = (list) => list.filter(([kind, name]) => !(kind === 'icon' ? iconLooks : faceLooks).has(name)).map(([kind, name, where]) => kind + ':' + name + ' (' + where + ')');
  const missing = [...new Set(undrawn(named))]; const plant = undrawn([['icon', 'crayon~melted', 'plant']]).length === 1;
  ok('every look a lesson line or a pre-K question names is drawn: an icon\'s in ICON_LOOKS, a drawn animal\'s in StudentPicture\'s faces (pass MW, round two\'s code read; ' + named.length + ' named, ' + iconLooks.size + ' icon looks and ' + faceLooks.size + ' animal looks drawn; near miss caught)', named.length >= 10 && iconLooks.size >= 4 && faceLooks.size >= 1 && missing.length === 0 && plant, missing.slice(0, 5).join(', ')); }
// The audio ledger carries what Eleven needs (pass MW, Mikey: "I'm not reviewing any more audio for now since it's kind of
// pointless.  Makes more sense to review it after Eleven Labs.  Just be sure to add emphasis tags and descriptions within the audio
// ledger for Eleven."): every row has a description that reads as words; every sound the app makes itself has a row of its own (each
// speech sound a lesson plays, the five short vowels on trial and the cheer's whistle and crowd), a speech sound sent as its phonetic
// symbols in double quotes (ElevenLabs' IPA rules) in the young voice and a sound effect as a prompt with its seconds (0.5 to 30, the
// endpoint's range), its influence (0 to 1) and two takes or more for Mikey to pick; no lesson clip sends a speech sound as letters
// (no piece the app's voice would play as a sound is left in its words) and each sound in it is its row's symbols, quoted; the nine
// runs of sounds that blend into a word, pinned by key since round one's code check, each send their vowel as a sound; the
// say-along's word is in capitals in the sentence that names it, in every game; a line's stress list names words the line says,
// each in capitals in its clip; every manner has its words; and the generator sends a sound effect to the sound-effects endpoint,
// never to the voice, and a sound alone, with no neighbor's words. Each check has a near miss run through the function the real
// check uses: a clip with sss left as letters, a game's word left small, a run with its vowel left a letter, a stress word the line
// never says, a stress word whose clip says it small beside a longer word in capitals (RUNS for run), a stress word of two letters (he), the generator as pass MV left it (every row to the voice), a sound row with its description taken off or reading
// undefined, a whistle of 45 seconds, a speech sound in the main voice, and a manner with no words.
{ const { LEDGER_CSV, elevenSentence, MANNER_HEARD, QUICK, isLetterNamed, soundsWritten, BEATS_NOT_LETTERS } = await import('../tools/audio-ledger.mjs'); const G = await import('../tools/audio-generate.mjs');
  const rows = G.parseCsv(LEDGER_CSV); const byKey = new Map(rows.map((r) => [r.key, r])); const strip = (t) => String(t).replace(/\[[^\]]*\]\s*/g, '');
  const described = (rs) => rs.filter((r) => !(String(r.description).trim().length > 20) || /—/.test(r.description) || /\bundefined\b|\bNaN\b|\bnull\b/.test(r.description)).map((r) => r.key);
  const noDesc = described(rows); const noDescPlant = described([...rows.slice(0, 5), { ...byKey.get('sound-whistle'), description: '' }, { ...byKey.get('sound-m'), description: byKey.get('sound-m').description + ' Then: undefined.' }]);
  const cheer = [...new Set(L.SAY_ALONG_VOICES.flatMap((v) => [v.between, v.after]).filter(Boolean))];
  // One sound's row read against SOUND_RECORDINGS: a speech sound in the young voice ending in its quoted symbols, a sound effect a
  // prompt (no tag) with its seconds, influence and takes in range.
  const soundProblem = (name, r) => { const rec = L.SOUND_RECORDINGS[name]; if (!rec || !r) return `${name}: no row`;
    if (rec.kind === 'speech sound' && !(r.kind === 'speech sound' && r.voice === 'young' && r.text.endsWith(L.ipaQuoted(rec.ipa)) && /^\/[^/]+\/(, \/[^/]+\/)?$/.test(rec.ipa) && Number(r.takes) >= 2)) return `${name}: speech row ${r.text}`;
    if (rec.kind === 'sound effect' && !(r.kind === 'sound effect' && r.voice === 'none' && !r.text.startsWith('[') && Number(r.seconds) >= 0.5 && Number(r.seconds) <= 30 && Number(r.influence) >= 0 && Number(r.influence) <= 1 && Number(r.takes) >= 2)) return `${name}: effect row`;
    return null; };
  const soundBad = [...Object.keys(L.SPEECH_SOUNDS), ...Object.keys(L.TRIAL_SOUNDS), ...cheer].map((n) => soundProblem(n, byKey.get(`sound-${n}`))).filter(Boolean);
  const soundPlants = [soundProblem('whistle', { ...byKey.get('sound-whistle'), seconds: '45' }), soundProblem('m', { ...byKey.get('sound-m'), voice: 'main' }), soundProblem('m', { ...byKey.get('sound-m'), text: byKey.get('sound-m').text.replace(/"/g, '') })];
  // Every lesson clip: no written speech sound left (read by the app's own speechPieces, on trial), every sound its row's symbols.
  const lessonRows = rows.filter((r) => r.kind === 'lesson line');
  const asLetters = (rs) => rs.filter((r) => L.speechPieces(strip(r.text), { trial: true }).some((x) => x.sound)).map((r) => r.key);
  const leftAsLetters = asLetters(lessonRows); const plantLetters = asLetters([{ ...byKey.get('first-sounds-5-0'), text: '[warm and gentle, drawing out key words] Sun and sock both start with sss.' }]);
  // A blended run's vowel: no vowel letter set off by commas is left in the words a run sends (round one's code check).
  const vowelLeft = (text) => /(^|,\s)[aeiou](?=[,.!?])/i.test(strip(text));
  const RUNS = ['read-the-word-3-2', 'read-the-word-5-2', 'read-the-word-6-2', 'read-the-word-7-2', 'read-the-word-7-5', 'sh-ch-th-1-2', 'sh-ch-th-2-2', 'sh-ch-th-4-2', 'silent-e-1-2'];
  // Pass NC's runs of a word's sounds (Sss, oh, puh; tuh and eye), a long vowel said as a word of its own after a sound, which the ledger
  // sends as its sound with its goal and never as the word (a run whose oh is left as the word, planted, caught).
  // Since round one: Sounds in a word's game (two lines after its line 4) and Sound by sound's Kite. and Coat. before their runs.
  const NC_RUNS = ['sounds-in-a-word-0-2', 'sounds-in-a-word-0-3', 'sounds-in-a-word-3-0', 'sounds-in-a-word-6-1', 'sounds-in-a-word-7-0', 'sounds-in-a-word-7-1', 'sounds-in-a-word-8-1', 'sounds-in-a-word-9-1', 'sounds-in-a-word-10-2', 'sounds-in-a-word-12-0', 'sounds-in-a-word-13-1', 'sound-by-sound-0-2', 'sound-by-sound-1-1', 'sound-by-sound-1-2', 'sound-by-sound-2-0', 'sound-by-sound-3-1', 'sound-by-sound-4-1', 'sound-by-sound-5-2', 'sound-by-sound-6-1', 'sound-by-sound-8-0', 'sound-by-sound-9-3', 'sound-by-sound-9-5', 'sound-by-sound-11-0', 'sound-by-sound-12-2'];
  const vowelWordLeft = (text) => /(?:^|[\s,])(?:oh|eye|ooh)(?=[,.!?\s])/i.test(strip(text));
  const wordSmall = (text, word) => !text.includes(word.toUpperCase()); const plantSmall = wordSmall('[warm and gentle, drawing out key words] Our word is red.', 'red');
  let missed = 0; const runKeys = []; const runVowels = []; let games = 0; const small = []; const stressBad = []; let stressed = 0; const sentencesOf = (t) => String(t || '').split(L.SENTENCE_BREAK).filter(Boolean);
  // A line's stress list: each word or phrase is said in the line, and the line's clips carry it in capitals.
  // Since round two each stress word is read whole in its clips, every saying of it in capitals (RUNS had passed for run), and a
  // single word of one or two letters is never a stress word, since two capitals can be read as letters (round one kept am, us, it
  // and ok small; round two found HE): the phrase it starts is stressed instead, he kicks.
  const stressProblem = (line, clips) => (line.stress || []).filter((w) => { const pat = String(w).trim().split(/\s+/).join('\\s+'); const whole = new RegExp('(?<![A-Za-z])' + pat + '(?![A-Za-z])', 'gi');
    const said = clips.flatMap((t) => [...strip(t || '').matchAll(whole)].map((m) => m[0]));
    return (!/\s/.test(String(w).trim()) && String(w).trim().length < 3) || !new RegExp('(?<![A-Za-z])' + pat + '(?![A-Za-z])', 'i').test(line.say) || said.length === 0 || said.some((m) => m !== m.toUpperCase()); });
  for (const c of L.COURSES) for (const m of c.modules) {
    const lines = c.readAloud ? L.readAloudScript(m) : (m.lesson && m.lesson.script ? m.lesson.script : []);
    lines.forEach((line, li) => { const parts = L.sayAlongParts(sentencesOf(line.say)); const open = parts.findIndex((x) => x.role === 'open');
      const wordAt = open > 0 ? parts.slice(0, open).map((x, k) => (x.role === 'say' ? k : -1)).filter((k) => k >= 0).pop() : -1;
      // Since round one (pass NC) a one-breath lesson's line is read as the ledger reads it, every hiss one breath (ONE_BREATH_LESSONS).
      parts.forEach((p, si) => { if (p.role !== 'say') return; const e = elevenSentence(p.sentence, { voices: line.voices, word: si === wordAt ? parts[open].word : null, stress: line.stress || [], once: L.ONE_BREATH_LESSONS.includes(m.id) });
        missed += e.missed.length; const row = byKey.get(`${m.id}-${li}-${si}`);
        if (e.run) { runKeys.push(`${m.id}-${li}-${si}`); if (!row || vowelLeft(row.text)) runVowels.push(`${m.id}-${li}-${si}`); }
        if (!row || e.sounds.some((n) => !row.text.includes(L.ipaQuoted((e.run || e.once) && L.SOUND_RECORDINGS[n].one ? L.SOUND_RECORDINGS[n].one : L.SOUND_RECORDINGS[n].ipa)))) missed += 1;
        if (si === wordAt) { games += 1; if (!row || wordSmall(row.text, parts[open].word)) small.push(`${m.id}-${li}-${si}`); } });
      if ((line.stress || []).length) { stressed += 1; const clips = parts.map((p, si) => (byKey.get(`${m.id}-${li}-${si}`) || {}).text); for (const w of stressProblem(line, clips)) stressBad.push(`${m.id} ${li}: ${w}`); } });
  }
  const plantVowel = vowelLeft('[warm and gentle, a preschool teacher saying each speech sound alone, one after another, slowly] "/kʰ/", a, "/nː/".');
  const plantStress = stressProblem({ say: 'Here is one cup, and here are two cups.', stress: ['balls'] }, ['[warm and gentle, drawing out key words] Here is one cup, and here are two CUPS.']).length === 1
    && stressProblem({ say: 'One dog runs, and two dogs run.', stress: ['runs', 'run'] }, ['[warm and gentle, drawing out key words] One dog RUNS, and two dogs run.']).length === 1
    && stressProblem({ say: 'We say he kicks it to Mia.', stress: ['he'] }, ['[warm and gentle, drawing out key words] We say HE kicks it to Mia.']).length === 1;
  // The generator: what each kind of row is sent as, and the old way caught.
  const sendBad = (request, rs) => { const bad = []; const nb = G.withNeighbors(rs);
    for (const r of nb) { const q = request(r, { voice: 'MAIN', voiceYoung: 'YOUNG' });
      if (r.kind === 'sound effect' && !(/\/v1\/sound-generation$/.test(q.url) && q.body.model_id === 'eleven_text_to_sound_v3' && q.body.text === r.text && q.body.duration_seconds === Number(r.seconds) && q.body.prompt_influence === Number(r.influence) && q.takes >= 2)) bad.push(`${r.key} effect`);
      if (r.kind === 'speech sound' && !(/text-to-speech\/YOUNG$/.test(q.url) && q.takes >= 2 && !q.body.previous_text && !q.body.next_text)) bad.push(`${r.key} speech`);
      if (!G.SOUND_KINDS.includes(r.kind) && !(/text-to-speech\//.test(q.url) && q.takes === 1)) bad.push(`${r.key} words`); }
    return bad; };
  const sample = [...rows.filter((r) => G.SOUND_KINDS.includes(r.kind)), ...rows.filter((r) => r.kind === 'lesson line').slice(0, 30)];
  const genBad = sendBad(G.requestFor, sample);
  const oldWay = (r, { voice, voiceYoung }) => ({ url: `https://api.elevenlabs.io/v1/text-to-speech/${r.voice === 'young' ? voiceYoung : voice}`, body: { text: r.text, model_id: 'eleven_v4' }, takes: 1 });
  const oldCaught = sendBad(oldWay, sample).length > 0;
  // Every manner a lesson can show has a few words for whoever makes its clip (VOICE_MANNERS against MANNER_HEARD).
  const mannersMissing = (heard) => Object.keys(L.VOICE_MANNERS).filter((k) => !(typeof heard[k] === 'string' && heard[k].length > 8));
  const mannersBad = mannersMissing(MANNER_HEARD); const { whisper, ...withoutWhisper } = MANNER_HEARD; const plantManners = mannersMissing(withoutWhisper).length === 1;
  // What the child does in a turn, as each turn row's description says it (pass NI, the story writer's note and the lead's read of every
  // turn row): "says it back" told the voice to wait for a sentence said back where a turn asked the child to draw in the air, tell or ask a
  // grown-up, write their name, answer a question or say something of their own. A turn row saying "says it back" is a sentence the child
  // says after the voice; a turn that draws, tells, asks a grown-up, writes or answers names it. Read here from each row's own sentence, not
  // from the tool's wording; the old default, on Look and write's air drawing and Write your name's question, planted, caught.
  // Since round one's code read (pass NI) a word taken apart by name too (Take the word tie apart), which the tool reads as taking it apart.
  const TURN_NAMES = [[/\bdraw it in the air\b/i, 'draws it in the air'], [/\btell a grown-up\b/i, 'tells a grown-up'], [/\bwrite it under theirs\b/i, 'writes their name'], [/\bask a grown-up to write your name\b/i, 'asks a grown-up'], [/\btake the word \w+ apart\b/i, 'takes it apart']];
  const turnOff = (r) => { const d = r.description; if (!/then the child /.test(d)) return null; const sen = strip(r.text).trim();
    for (const [re, says] of TURN_NAMES) if (re.test(sen) && !d.includes(says)) return `${r.key}: "${sen}" not named as ${says}`;
    if (/then the child says it back/.test(d) && (/\?$/.test(sen) || /\bsay\b/i.test(sen) || TURN_NAMES.some(([re]) => re.test(sen)))) return `${r.key}: "${sen}" heard as said back`;
    return null; };
  const turnRows = rows.filter((r) => r.kind === 'lesson line' && /then the child /.test(r.description));
  const turnBad = turnRows.map(turnOff).filter(Boolean);
  const turnPlants = [['look-and-write-5-1', 'draws it in the air in a turn of their own'], ['write-your-name-7-1', 'answers in a turn of their own'], ['sounds-in-a-word-11-1', 'takes it apart in a turn of their own', 'answers in a turn of their own']].map(([k, was, now = 'says it back']) => byKey.get(k) && byKey.get(k).description.includes(was) && turnOff({ ...byKey.get(k), description: byKey.get(k).description.replace(was, now) }) !== null);
  // A voice sound a story uses as a sound, and a run of letters spelled aloud, are named in the row's description (pass NI, the story
  // check): S4135's "Yuh!" and "Yuh, yuh, yarn!" had no sound direction, since the tool named a voice sound only beside the app's own
  // sounds, and Eleven can read "Yuh!" as "Yeah!"; and "H, e, c, t, o, r" was named as the letter H alone, where a lone e can come out as
  // "eh". Read here from each row's own words: a voice sound after says, said, starts with or ends with, alone as a sentence, or in a
  // short run that ends on a word; a run of three or more single letters set off by commas. The old gate (Bear hides' S4127-5, "Wuh! W
  // says wuh!", unnamed) and the old letter rule (S4139-6 naming H alone), planted, caught.
  const EARLY_STORY = rows.filter((r) => ['story', 'long story', 'next long story'].includes(r.kind) && r.voice === 'young');
  const voiceSoundOff = (r) => { const t = strip(r.text); const off = [];
    for (const [k, v] of Object.entries(L.VOICE_SOUNDS)) { const used = [new RegExp(`\\b(?:says?|said|starts? with|ends? with)\\s+${k}\\b`, 'i'), new RegExp(`(?:^|[.!?]\\s+)${k}[.!]`, 'i'), new RegExp(`\\b${k},\\s+(?:${k},\\s+)*[A-Za-z]+[.!]`, 'i'), new RegExp(`\\b[A-Za-z]+,\\s+${k},\\s+[A-Za-z]+[.!]`, 'i')].some((re) => re.test(t));
      if (used && !new RegExp(`\\b${k}, ${v.short.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i').test(r.description)) off.push(`${r.key}: ${k} used as a sound, not named`); }
    return off; };
  // Since the second story read (pass NI): every letter of a run in the order it is spelled, a repeated one too (S338-1's "S, h, e, l, l"
  // had been named S, H, E and L), and a run inside a sung clip (its tags say singing) sung, each letter clear, where "Say" sat over a song.
  const spellOff = (r) => { const t = strip(r.text); const off = []; const sung = /\[[^\]]*\bsing(?:s|ing)?\b[^\]]*\]/i.test(r.text);
    for (const m of t.matchAll(/(?<![A-Za-z'])[A-Za-z](?:(?:,\s+(?:and\s+)?|\s+and\s+)[A-Za-z](?![A-Za-z'])){2,}/g)) { const want = m[0].replace(/\band\b/g, '').match(/[A-Za-z]/g).map((l) => l.toUpperCase());
      const said = new RegExp(`${sung ? 'Sing' : 'Say'} the letters? ([A-Z](?:, [A-Z])*(?: and [A-Z])?) by (?:their|its) names?, one at a time${sung ? ', each one clear' : ''}`).exec(r.description); const named = said ? said[1].split(/, | and /) : [];
      if (!named.join('').includes(want.join(''))) off.push(`${r.key}: "${m[0]}" spelled, ${named.join('') || 'none'} named one at a time${sung ? ' and sung' : ''}`); }
    return off; };
  const soundRowsBad = EARLY_STORY.flatMap(voiceSoundOff); const spellRowsBad = EARLY_STORY.flatMap(spellOff);   // a story's own description (lettersNamed: its capitals and a spelled run's letters, a lone small letter outside a run not yet); a lesson line sends its key letters and the letter A by name (elevenSentence), its other small letters bare until EARMARKS A127
  const s4127 = byKey.get('S4127-5'); const s4139 = byKey.get('S4139-6');
  const soundPlant = s4127 && voiceSoundOff({ ...s4127, description: s4127.description.replace(/ Say each sound written as letters as the sound itself, never as letters: Wuh, the w of wet, a short wuh\./, '') }).length > 0 && voiceSoundOff(s4127).length === 0;
  const spellPlant = s4139 && spellOff({ ...s4139, description: s4139.description.replace(/Say the letters H, E, C, T, O and R by their names, one at a time\./, 'Say the letter H by its name.') }).length > 0 && spellOff(s4139).length === 0;
  // Since round two's code read: the tool's own form for a voice sound alone as a sentence ("Yuh! she said."), which no row needed alone, is
  // held by the tool's output (the form taken out, the sound goes unnamed), and an interjection asked as a question ("Huh? said Dad.")
  // is a word, left; a story that means an interjection writes it as a question.
  const { soundsWritten: sw } = await import('../tools/audio-ledger.mjs');
  const aloneForm = sw('Yuh! she said.').toLowerCase().includes('yuh, ' + L.VOICE_SOUNDS.yuh.short) && sw('Huh? said Dad.') === '';
  // The second story read's two (pass NI): S338-1's repeated L dropped, and the alphabet song's S278-4 asked to say its letters, each caught.
  const s338 = byKey.get('S338-1'); const s278 = byKey.get('S278-4');
  const spellPlants2 = !!s338 && !!s278 && spellOff(s338).length === 0 && spellOff(s278).length === 0
    && spellOff({ ...s338, description: s338.description.replace('S, H, E, L and L', 'S, H, E and L') }).length > 0 && spellOff({ ...s278, description: s278.description.replace(' Sing the letters', ' Say the letters').replace(', one at a time, each one clear', ', one at a time') }).length > 0;
  ok(`every early story row names a voice sound it uses as a sound, and a run of letters it spells aloud, each letter said one at a time (pass NI, the story check; ${EARLY_STORY.length} early story rows; Bear hides' unnamed wuh, Whose lunch?'s H alone, a spelled run's repeated L dropped and a sung run asked to be said, planted, caught; since round two the tool names "Yuh! she said." and leaves "Huh? said Dad.")`,
    soundRowsBad.length === 0 && spellRowsBad.length === 0 && soundPlant && spellPlant && spellPlants2 && aloneForm && EARLY_STORY.length >= 1000, JSON.stringify({ soundRowsBad: soundRowsBad.slice(0, 6), spellRowsBad: spellRowsBad.slice(0, 6), soundPlant, spellPlant, aloneForm, n: EARLY_STORY.length }));
  ok(`every turn row of the audio ledger names what the child does: a question answered, something said, an air drawing, a grown-up told or asked, a name written, a word taken apart by name, and "says it back" only for a sentence said back (pass NI; ${turnRows.length} turn rows; the old default on an air drawing and on a question, and a word taken apart by name called an answer, planted, caught)`,
    turnBad.length === 0 && turnRows.length >= 100 && turnPlants.every(Boolean), JSON.stringify({ turnBad: turnBad.slice(0, 6), n: turnRows.length, turnPlants }));
  // Round one's fixes, each held since round two's code read (each could be undone with every check passing): the letter A named as
  // a letter is its name in IPA and the article is not; a sentence of sounds alone is never a blend, a run with a vowel is; eleven_v3
  // gets no neighbors' words and eleven_v4 does; --sfx-model reaches a sound effect's request; and every story paragraph whose tags ask
  // for speed, every story with a fraction and every cheer's saying carries its note. Each the real function, with a near miss.
  const letterA = (s) => elevenSentence(s).text.includes(L.ipaQuoted('/eɪ/'));
  const lettersHeld = letterA('Apple starts with A.') && letterA('In A B C, A comes first.') && letterA('This is big A and small a.') && !letterA('A dog runs.') && !letterA('A T, dripping a little!') && !letterA('I have a hat.')
    && letterA('The letters a, e, i, o and u are the vowels.') && letterA('A starts at its top point.') && !letterA('Cuh, a, nnn.');
  const blendHeld = elevenSentence('Sss, sss, sss.').run === false && elevenSentence('Cuh, a, nnn.').run === true;
  const nbRows = G.withNeighbors(lessonRows.slice(0, 3)); const v3 = G.requestFor(nbRows[1], { voice: 'MAIN', voiceYoung: 'YOUNG', model: 'eleven_v3' }); const v4 = G.requestFor(nbRows[1], { voice: 'MAIN', voiceYoung: 'YOUNG' });
  const stitchHeld = !v3.body.previous_text && !v3.body.next_text && !!(v4.body.previous_text || v4.body.next_text);
  const sfxHeld = G.requestFor(byKey.get('sound-whistle'), { voice: 'MAIN', voiceYoung: 'YOUNG', sfxModel: 'X' }).body.model_id === 'X';
  const STORY_KINDS = ['story', 'long story', 'next long story'];
  const notesMissing = (rs) => rs.filter((r) => (STORY_KINDS.includes(r.kind) && QUICK.test(r.text) && !/quick on purpose/.test(r.description))
    || (STORY_KINDS.includes(r.kind) && /\b\d+\/\d+\b/.test(strip(r.text)) && !/never as a date/.test(r.description))
    || (/\[cheering like an excited fan/.test(r.text) && !/The voice alone/.test(r.description))).map((r) => r.key);
  // Since the third read, the notes round two added: every early story paragraph or title whose words name a letter (isLetterNamed,
  // less BEATS_NOT_LETTERS; since pass NE's round two a letter with 's too, as the tool reads it) says so, and no other does; every one with a sound written as letters (soundsWritten) says so; the four
  // tags QUICK took in round two carry the note, and a sound's tag does not; and Buh and buh are named once.
  const EARLY = ['PK3', 'PK4', 'K', '1', '2']; const STORY_ROWS = [...STORY_KINDS, 'story title', 'long story title', 'next long story title'];
  // Since pass NI (the story check) a run of three or more single letters set off by commas or a last and ("c, v, x", "s, j and y") names
  // letters too, small ones included, as the ledger's lettersNamed reads it.
  const namesLetter = (r) => { const s = strip(r.text); const skip = BEATS_NOT_LETTERS[r.group] || []; return [...s.matchAll(/[A-Za-z][A-Za-z'-]*/g)].some((m) => { const t = m[0].replace(/'s$/, ''); return t.length === 1 && isLetterNamed(s, m.index, m.index + 1, t) && !skip.includes(t.toUpperCase()); }) || /(?<![A-Za-z'])[A-Za-z](?:(?:,\s+(?:and\s+)?|\s+and\s+)[A-Za-z](?![A-Za-z'])){2,}/.test(s); };
  const storyNotesOff = (rs) => rs.filter((r) => STORY_ROWS.includes(r.kind) && EARLY.includes(r.grade) && (namesLetter(r) !== /S(?:ay|ing) the letter/.test(r.description) || (soundsWritten(strip(r.text)) !== '') !== /Say each sound written as letters/.test(r.description))).map((r) => r.key);
  const storyOff = storyNotesOff(rows); const plantStory = storyNotesOff([{ ...byKey.get('S305-3'), description: byKey.get('S305-3').description.replace(/ Say the letters?[^.]*\./, '') }, { ...byKey.get('S200-1'), description: byKey.get('S200-1').description.replace(/ Say each sound written as letters[^.]*\./, '') }]).length === 2;
  // Since round two's content read (pass NE): a letter with 's ("At the end of N's name") is a letter named, its 's taken off before it is
  // read, so S4119-6 asks for D's name and N's, where it asked for D's alone (lettersNamed in tools/audio-ledger.mjs, and namesLetter above);
  // the reading that keeps the 's, rebuilt, planted, caught.
  { const lettersOf = (s, keepS) => [...new Set([...s.matchAll(/[A-Za-z][A-Za-z'-]*/g)].map((m) => [m, keepS ? m[0] : m[0].replace(/'s$/, '')]).filter(([m, t]) => t.length === 1 && isLetterNamed(s, m.index, m.index + 1, t)).map(([, t]) => t.toUpperCase()))];
    const s4119 = strip(byKey.get('S4119-6').text); const now = lettersOf(s4119); const kept = lettersOf(s4119, true);
    ok(`the audio ledger reads a letter with 's as a letter named, so a clip that says "At the end of N's name" asks for N's name (round two's content read, pass NE: S4119-6 asks for ${now.join(' and ')}; the 's kept, planted, caught: ${kept.join(' and ')})`, now.join() === 'D,N' && /Say the letters D and N by their names\./.test(byKey.get('S4119-6').description) && kept.join() === 'D', JSON.stringify({ now, kept, description: byKey.get('S4119-6').description.slice(0, 200) })); }
  const quickHeld = ['S4007-7', 'S3659-1', 'S305-4', 'S335-4'].every((k) => /quick on purpose/.test(byKey.get(k).description)) && !QUICK.test('[quick footsteps]') && (byKey.get('S200-1').description.match(/\bbuh, /gi) || []).length === 1;
  const notesBad = notesMissing(rows); const quickRow = rows.find((r) => STORY_KINDS.includes(r.kind) && QUICK.test(r.text));
  const plantNotes = notesMissing([{ ...quickRow, description: quickRow.description.replace('quick on purpose', 'calm') }, { ...byKey.get('S2942-2'), description: '' }]).length === 2;
  const heldBad = [lettersHeld || 'letter A', blendHeld || 'blend', stitchHeld || 'eleven_v3 neighbors', sfxHeld || '--sfx-model'].filter((x) => x !== true);
  const heldPlants = !letterA('I have a hat.') && G.requestFor(byKey.get('sound-whistle'), { voice: 'MAIN', voiceYoung: 'YOUNG' }).body.model_id !== 'X';
  // The ledger asks for one breath wherever the app plays one, and two where it plays two (pass NC, round two's code read: the check
  // above read the tool's own once, and found "/sː/" inside "/sː/", "/sː/", so a ledger asking two breaths everywhere passed it). Each line
  // part is read by the app's own speechPieces, its once from this test's own list of the three phoneme lessons (and since pass ND the
  // three letters lessons, Letters and sounds, Hear it in the name and At the end of the name, each teaching one sound for one letter),
  // its own lists of runs
  // (RUNS and NC_RUNS) and any run the app marks; each hiss is counted in its own form with its goal right before its symbols, one breath
  // where the app plays one and two where it plays two; no line of one breath is directed as two ("Fff." had been, the lead found applying
  // it); every early story row names each hiss as the app plays it, and every sound of a run of a word's sounds (S4079-5's shh and ooh,
  // which round one fixed with no check). Each fault the read planted in the tool is planted here in a row, and caught.
  // Since pass NE Start or end of the name and Write it by its sounds too, by the same reason (Claude's design), and since pass NF Hear
  // it in a word, which says C's name starts with sss beside C's own cuh. Since pass NI Q, V and Y, by the same reason: V's vvv is held
  // as fff is, and its lesson sets van beside fan.
  const ONE = ['sounds-in-a-word', 'very-first-sound', 'sound-by-sound', 'letters-and-sounds', 'hear-it-in-the-name', 'end-of-the-name', 'start-or-end', 'write-by-sounds', 'hear-it-in-a-word', 'q-v-and-y'];
  const HISS = Object.keys(L.SOUND_RECORDINGS).filter((n) => L.SOUND_RECORDINGS[n].one);
  const oneForm = (n) => L.goalTag(L.SOUND_RECORDINGS[n].goalOne) + ' ' + L.ipaQuoted(L.SOUND_RECORDINGS[n].one);
  const twoForm = (n) => L.goalTag(L.SOUND_RECORDINGS[n].goal) + ' ' + L.ipaQuoted(L.SOUND_RECORDINGS[n].ipa);
  const times = (t, sub) => String(t).split(sub).length - 1;
  const breathsOf = (mid, key, sentence) => { const run = RUNS.includes(key) || NC_RUNS.includes(key); const ps = L.speechPieces(sentence, { trial: true, ...(ONE.includes(mid) ? { once: true } : {}) }).filter((x) => x.sound && HISS.includes(x.sound));
    return HISS.map((n) => ({ n, one: ps.filter((x) => x.sound === n && (x.once || run)).length, two: ps.filter((x) => x.sound === n && !(x.once || run)).length })).filter((x) => x.one || x.two); };
  const breathOff = (row, want) => { if (!row) return ['no row']; const off = want.filter((w) => times(row.text, oneForm(w.n)) !== w.one || times(row.text, twoForm(w.n)) !== w.two).map((w) => `${w.n} once ${times(row.text, oneForm(w.n))} of ${w.one}, twice ${times(row.text, twoForm(w.n))} of ${w.two}`);
    if (want.some((w) => w.one) && /two short breaths/.test(row.text)) off.push('a line of one breath directed as two short breaths');
    if (want.some((w) => w.two) && /as one short breath/.test(row.text)) off.push('a line of two breaths directed as one breath'); return off; };
  const breathBad = []; const breathAt = {}; let breathParts = 0; let breathOnce = 0; let breathTwice = 0;
  for (const c of L.COURSES) for (const m of c.modules) {
    const lines = c.readAloud ? L.readAloudScript(m) : (m.lesson && m.lesson.script ? m.lesson.script : []);
    lines.forEach((line, li) => L.sayAlongParts(sentencesOf(line.say)).forEach((p, si) => { if (p.role !== 'say') return; const key = `${m.id}-${li}-${si}`; const want = breathsOf(m.id, key, p.sentence); if (!want.length) return;
      breathParts += 1; breathAt[key] = want; for (const w of want) { breathOnce += w.one; breathTwice += w.two; } for (const o of breathOff(byKey.get(key), want)) breathBad.push(`${key}: ${o}`); }));
  }
  const swapped = (key, from, to) => ({ ...byKey.get(key), text: byKey.get(key).text.split(from).join(to) });
  const breathPlants = [breathOff(swapped('sounds-in-a-word-3-1', oneForm('s'), twoForm('s')), breathAt['sounds-in-a-word-3-1'] || []).length > 0,
    breathOff(swapped('first-sounds-5-0', twoForm('s'), oneForm('s')), breathAt['first-sounds-5-0'] || []).length > 0,
    breathOff(swapped('read-the-word-7-5', oneForm('s'), twoForm('s')), breathAt['read-the-word-7-5'] || []).length > 0,
    breathOff(swapped('very-first-sound-1-3', L.SOUND_RECORDINGS.f.howOne, L.SOUND_RECORDINGS.f.how), breathAt['very-first-sound-1-3'] || []).length > 0,
    breathOff(swapped('first-sounds-1-1', L.SOUND_RECORDINGS.s.how, L.SOUND_RECORDINGS.s.howOne), breathAt['first-sounds-1-1'] || []).length > 0];
  const STORY_ALL = ['story', 'story title', 'long story', 'long story title', 'next long story', 'next long story title'];
  const storyBreathOff = (r) => { const off = []; const ps = L.speechPieces(strip(r.text), { trial: true, ...(ONE.includes(r.source) ? { once: true } : {}) });
    for (const n of HISS) { const mine = ps.filter((x) => x.sound === n); if (!mine.length) continue; const short = L.SOUND_RECORDINGS[n].short; const shortOne = short.replace(/, twice$/, ', once');
      if (mine.some((x) => x.once) && !r.description.includes(shortOne)) off.push(`${n} played once, not named once`);
      if (mine.some((x) => !x.once) && !r.description.includes(short)) off.push(`${n} played twice, not named twice`);
      if (mine.every((x) => x.once) && r.description.includes(short)) off.push(`${n} played once, named twice`); }
    for (const sen of strip(r.text).split(L.SENTENCE_BREAK)) { if (!L.namesWordSounds(sen)) continue;
      for (const t of sen.toLowerCase().match(/[a-z]+/g) || []) { const v = Object.hasOwn(L.VOWEL_WORDS, t) ? L.VOWEL_WORDS[t] : Object.hasOwn(L.VOICE_SOUNDS, t) ? L.VOICE_SOUNDS[t] : null; if (v && !r.description.includes(v.short)) off.push(`${t} said in a run, not named`); } }
    return off; };
  const storyBreathBad = rows.filter((r) => STORY_ALL.includes(r.kind)).flatMap((r) => storyBreathOff(r).map((o) => `${r.key}: ${o}`));
  // The floors are the counts the code has (pass ND, round one's code read: 52, 17 and 4 stood against 69, 38 and 10; since pass NI,
  // with Q, V and Y's lines, 78 parts, 49 of one breath and 36 of two, and with its story, I spy on the rug, 15 story rows; round one's
  // code read found the floor at 14, under the count, and the story named by its first draft's title).
  const BREATH_FLOORS = { parts: 78, once: 49, twice: 36, storyRows: 15 };
  const storyOnceRows = rows.filter((r) => STORY_ALL.includes(r.kind) && ONE.includes(r.source) && L.speechPieces(strip(r.text), { trial: true, once: true }).some((x) => x.sound && HISS.includes(x.sound))).map((r) => r.key);
  const storyPlants = [storyBreathOff({ ...byKey.get('S4087-1'), description: byKey.get('S4087-1').description.split(', once').join(', twice') }).length > 0,
    storyBreathOff({ ...byKey.get('S4079-5'), description: byKey.get('S4079-5').description.replace(' Shh, the sh of ship, held;', '') }).length > 0];
  ok(`the audio ledger asks for one breath wherever the app plays one and two where it plays two (pass NC, round two's code read): ${breathParts} line parts with a hiss, ${breathOnce} hisses of one breath and ${breathTwice} of two, each counted in its own form with its goal before it; no line of one breath directed as two; every early story row's hisses named as the app plays them (${storyOnceRows.length} rows of the ${ONE.length} one-breath lessons) and every sound of a run of a word's sounds named; two breaths in a lesson of one, one breath in a lesson of two, a run's hiss as two breaths, "Fff." directed as two breaths, a lone sss of two breaths directed as one (the third read), a story's once as twice and S4079-5's shh dropped, planted, each caught`,
    breathBad.length === 0 && breathParts >= BREATH_FLOORS.parts && breathOnce >= BREATH_FLOORS.once && breathTwice >= BREATH_FLOORS.twice && breathPlants.every(Boolean) && storyBreathBad.length === 0 && storyOnceRows.length >= BREATH_FLOORS.storyRows && storyPlants.every(Boolean) && JSON.stringify(L.ONE_BREATH_LESSONS) === JSON.stringify(ONE),
    { breathBad: breathBad.slice(0, 8), breathParts, breathOnce, breathTwice, breathPlants, storyBreathBad: storyBreathBad.slice(0, 8), storyOnceRows, storyPlants });
  ok(`the audio ledger carries what Eleven needs: a description on all ${rows.length} rows, a row for each of the app's ${Object.keys(L.SPEECH_SOUNDS).length + Object.keys(L.TRIAL_SOUNDS).length + cheer.length} own sounds, no lesson clip sending a speech sound as letters (${lessonRows.length} read), the nine runs of sounds sent with their vowels as sounds and pass NC's ${NC_RUNS.length} runs of a word's sounds with their long vowels sent as sounds too, the say-along's word in capitals in all ${games} games, ${stressed} lines' stressed words in capitals, every manner described, and the generator sending a sound effect to the sound-effects endpoint and a sound alone (pass MW; every near miss caught)`,
    noDesc.length === 0 && noDescPlant.length === 2 && soundBad.length === 0 && soundPlants.every(Boolean) && leftAsLetters.length === 0 && plantLetters.length === 1 && missed === 0 && JSON.stringify(runKeys) === JSON.stringify([...RUNS, ...NC_RUNS]) && runVowels.length === 0 && NC_RUNS.every((k) => byKey.get(k) && !vowelWordLeft(byKey.get(k).text)) && vowelWordLeft(byKey.get('sounds-in-a-word-3-0').text.replace('"/oʊ/"', 'oh')) && plantVowel && games >= 77 && small.length === 0 && plantSmall && stressed >= 15 && stressBad.length === 0 && plantStress && heldBad.length === 0 && heldPlants && notesBad.length === 0 && plantNotes && storyOff.length === 0 && plantStory && quickHeld && genBad.length === 0 && oldCaught && mannersBad.length === 0 && plantManners,
    `no description ${noDesc.slice(0, 5).join(', ')}; plant ${noDescPlant.length}; sounds ${soundBad.join(' | ')}; sound plants ${soundPlants.map(Boolean)}; as letters ${leftAsLetters.slice(0, 5).join(', ')}; plant ${plantLetters.length}; missed ${missed}; runs ${runKeys.join(', ')}; vowels left ${runVowels.join(', ')}; plant ${plantVowel}; games ${games}; small ${small.join(', ')}; stressed ${stressed} ${stressBad.join(', ')} plant ${plantStress}; held ${heldBad.join(', ')} plants ${heldPlants}; notes ${notesBad.slice(0, 5).join(', ')} plant ${plantNotes}; story notes ${storyOff.slice(0, 5).join(', ')} plant ${plantStory} quick ${quickHeld}; generator ${genBad.slice(0, 5).join(', ')}; old caught ${oldCaught}; manners ${mannersBad.join(', ')} plant ${plantManners}`); }
// Every speech sound the ledger sends has its goal right before it (pass MX, Mikey: "Since Eleven doesn't document a sound said alone
// like "/sː/", those rows in the ledger can include a short descriptor which can also be pasted into Eleven which describes what we are
// trying to achieve."): in every row, each sound's quoted symbols follow its own goal tag (a sound said twice, sss, fff or zzz, has
// one goal for the pair, and in a run of sounds that blend, the goal for one breath), no goal stands without its sound, and the
// letter A named as a letter ("/eɪ/") takes none, since it is a name, a word the guide documents. Each goal is a direction for the
// voice (it opens with saying, since ElevenLabs' guide warns a tag can be taken for a sound effect), short, and names the word the
// sound is heard in; every row with a goal says what the bracket is in its description; and the generator sends the goals, or with
// --no-goals the same text without them, every symbol kept. The near misses, through the same functions: a sound row with its goal
// taken off, a lesson line with m's goal before the s sound, and a goal written as a sound to make. Since round one's audio check a
// goal names no letter and writes no noise as letters, so a goal read aloud never says a letter's name ("the m sound of moon",
// "a steady rrr"), no part of one has the form of a sound effect (an article, a thing and an -ing word, as the stories test reads
// them: p's "the lips popping open once"), and where two or more words follow a sound's symbols the line's own direction comes again
// before them, since a tag carries forward across the line; each with a near miss.
{ const { LEDGER_CSV } = await import('../tools/audio-ledger.mjs'); const G = await import('../tools/audio-generate.mjs');
  const rows = G.parseCsv(LEDGER_CSV); const byKey = new Map(rows.map((r) => [r.key, r]));
  const pairs = []; for (const r of Object.values(L.SOUND_RECORDINGS)) { if (r.kind !== 'speech sound') continue; pairs.push([L.goalTag(r.goal), L.ipaQuoted(r.ipa)]); if (r.one) pairs.push([L.goalTag(r.goalOne), L.ipaQuoted(r.one)]); }
  for (const v of Object.values(L.VOICE_SOUNDS)) pairs.push([L.goalTag(v.goal), L.ipaQuoted(v.ipa)]);
  // A long vowel a run says as a word of its own (pass NC's oh, eye and ooh) follows its own goal too.
  for (const v of Object.values(L.VOWEL_WORDS)) pairs.push([L.goalTag(v.goal), L.ipaQuoted(v.ipa)]);
  pairs.sort((a, b) => b[1].length - a[1].length);
  const unpaired = (text) => { let t = String(text); for (const [g, ipa] of pairs) t = t.split(g + ' ' + ipa).join('#'); const sounds = (t.match(/"\/[^/"]+\/"/g) || []).filter((x) => x !== '"/eɪ/"'); const goals = L.SOUND_GOAL_TAGS.filter((g) => t.includes(g)); return sounds.length + goals.length; };
  const goalRows = rows.filter((r) => L.SOUND_GOAL_TAGS.some((g) => r.text.includes(g)));
  const off = rows.filter((r) => unpaired(r.text) > 0).map((r) => r.key);
  const noteOff = (r) => !/tells Eleven what the sound should be/.test(r.description);
  const noNote = goalRows.filter(noteOff).map((r) => r.key);
  const aGoalOff = (r) => L.SOUND_GOAL_TAGS.some((g) => r.text.includes(g + ' "/eɪ/"'));
  const letterA = rows.filter((r) => r.text.includes('"/eɪ/"')); const aWithGoal = letterA.filter(aGoalOff).map((r) => r.key);
  const goalWords = (g) => g.replace(/^\[|\]$/g, '');
  const FX_FORM = /^(?:a|an|the|two|three|some)\s[^,\]]*\b\w+ing\b/i;
  const directionBad = (tags) => tags.filter((g) => { const w = goalWords(g); return !/^saying /.test(w) || w.split(/\s+/).length > 16 || !/\b(?:of|start of|end of) [a-z]+\b/.test(w)
    || /\bthe [a-z]{1,2} (?:sound|of)\b/.test(w) || /\b([a-z])\1\1+\b|\bshh\b/.test(w) || w.split(/,\s*/).slice(1).some((part) => FX_FORM.test(part)); });
  const dirBad = directionBad(L.SOUND_GOAL_TAGS);
  const sent = (r, noGoals) => G.requestFor(G.withNeighbors([r])[0], { voice: 'MAIN', voiceYoung: 'YOUNG', noGoals }).body.text;
  // The generator sends a row's text whole, and with --no-goals the same text without its goals, every symbol kept. A sender is
  // passed in, so the near misses below run through this same function.
  const genOff = (r, send) => { const withG = send(r, false); const without = send(r, true); const ipa = (t) => (t.match(/"\/[^/"]+\/"/g) || []).join(' ');
    return withG !== r.text || L.SOUND_GOAL_TAGS.some((g) => without.includes(g)) || ipa(without) !== ipa(r.text); };
  const genBad = goalRows.filter((r) => genOff(r, sent)).map((r) => r.key);
  const sm = byKey.get('sound-m'); const fs = byKey.get('first-sounds-1-2');
  const plants = [unpaired(sm.text.replace(L.goalTag(L.SOUND_RECORDINGS.m.goal) + ' ', '')) > 0, unpaired(fs.text.replace(L.goalTag(L.SOUND_RECORDINGS.s.goal), L.goalTag(L.SOUND_RECORDINGS.m.goal))) > 0, directionBad(['[a snake hissing for a second]']).length === 1];
  const opening = (t) => { const m = /^\[[^\]]+\]/.exec(t); return m ? m[0] : ''; };
  // Each sound group that two or more words follow (due) and those without the line's own direction before the words (miss).
  const backScan = (t) => { const dir = opening(t); let due = 0; let miss = 0;
    for (const g of L.SOUND_GOAL_TAGS) { let from = 0; for (;;) { const at = t.indexOf(g, from); if (at < 0) break; from = at + g.length;
      const sym = /^ ("\/[^/"]+\/")(?:, \1)*/.exec(t.slice(from)); if (!sym) continue; const rest = t.slice(from + sym[0].length);
      const nextAt = Math.min(rest.length, ...L.SOUND_GOAL_TAGS.map((x) => rest.indexOf(x)).filter((i) => i >= 0)); const seg = rest.slice(0, nextAt);
      const words = (seg.replace(/\[[^\]]*\]/g, ' ').replace(/"\/[^/"]+\/"/g, ' ').match(/[A-Za-z]+/g) || []).length;
      if (words >= 2) { due++; if (!seg.replace(/^[,.;!?]*\s*/, '').startsWith(dir)) miss++; } } }
    return { due, miss }; };
  const backMissing = (t) => backScan(t).miss;
  // Since round two's code read the direction comes again exactly as often as it is due, so never at a clip's end, and each goal
  // row's description names its own key in the remake step; a direction put after a line's last sound, and a description naming
  // another row's key (--only S95), are the near misses.
  const dirCount = (t) => { const dir = opening(t); return dir ? t.split(dir).length - 1 : 0; };
  const backOff = (t) => dirCount(t) !== 1 + backScan(t).due;
  const ownKeyOff = (r) => !String(r.description).includes('--only ' + r.key + ' --no-goals');
  const lessonRows = goalRows.filter((r) => r.kind === 'lesson line'); const noBack = lessonRows.filter((r) => backMissing(r.text) > 0).map((r) => r.key);
  const dirOff = lessonRows.filter((r) => backOff(r.text)).map((r) => r.key); const keyOff = goalRows.filter(ownKeyOff).map((r) => r.key);
  const backs = lessonRows.filter((r) => /comes again after a sound/.test(r.description)).length;
  const ls = byKey.get('letter-sounds-1-0'); const lsDir = opening(ls.text); const lsCut = ls.text.slice(0, ls.text.lastIndexOf(lsDir)) + ls.text.slice(ls.text.lastIndexOf(lsDir) + lsDir.length + 1);
  plants.push(directionBad(['[saying just the m sound of moon, a steady hum]']).length === 1, directionBad(['[saying just the first sound of red, a steady rrr]']).length === 1,
    directionBad(['[saying just the first sound of pan, the lips popping open once]']).length === 1, backMissing(lsCut) > 0 && backMissing(ls.text) === 0);
  // Each goal names its own sound (round one's code check), in the test's own words: the word a sound starts, or the ending it is.
  const GOAL_OWN = { m: 'first sound of moon', n: 'first sound of net', s: 'first sound of sun', f: 'first sound of fan', z: 'first sound of zoo', r: 'first sound of red', l: 'first sound of lion', t: 'first sound of tap', p: 'first sound of pan', k: 'first sound of cat', b: 'first sound of ball', d: 'first sound of dog', g: 'first sound of go', j: 'first sound of jam', ig: 'ending of pig', og: 'ending of dog', at: 'ending of cat', fr: 'first part of frog', fl: 'first part of flower', st: 'first part of star', sp: 'first part of spoon', tr: 'first part of tree', a: 'first sound of apple', e: 'first sound of egg', i: 'first sound of igloo', o: 'first sound of octopus', u: 'first sound of up', huh: 'first sound of hat', wuh: 'first sound of wet', chuh: 'first sound of chair', shh: 'first sound of ship', ks: 'sounds at the end of six', x: 'last part of box',
    // Since pass NI (pre-K 4's V, Q and Y): the app's vvv, and the voice's yuh and kwuh.
    v: 'first sound of van', yuh: 'first sound of yes', kwuh: 'first two sounds of queen',
    // Since round one's code check (pass NC) the long vowels a run says as words, by the test's own words and their own IPA.
    oh: 'middle sound of boat', eye: 'middle sound of kite', ooh: 'middle sound of moon' };
  const VOWEL_IPA = { oh: '/oʊ/', eye: '/aɪ/', ooh: '/uː/' };
  const ownOff = (recs, voices, vowels = L.VOWEL_WORDS) => { const out = [];
    for (const [name, v] of Object.entries(vowels)) if (!GOAL_OWN[name] || !String(v.goal).includes(GOAL_OWN[name]) || v.ipa !== VOWEL_IPA[name]) out.push(name);
    if (Object.keys(vowels).sort().join() !== Object.keys(VOWEL_IPA).sort().join()) out.push('the vowel words changed');
    for (const [name, r] of Object.entries(recs)) { if (r.kind !== 'speech sound') continue; const want = GOAL_OWN[name];
      if (!want || !String(r.goal).includes(want)) out.push(name); if (r.one && !(String(r.goalOne).includes(want) && /\btwice\b/.test(r.goal) && /\bonce\b/.test(r.goalOne))) out.push(name + ' one'); }
    for (const [name, v] of Object.entries(voices)) if (!GOAL_OWN[name] || !String(v.goal).includes(GOAL_OWN[name])) out.push(name);
    // Both ways (pass NI, round one's code read: the table was read only by the code's own keys, so a sound the code dropped, the voice's
    // yuh or kwuh, was never missed): every sound the table names is still one the app sends with its goal.
    for (const name of Object.keys(GOAL_OWN)) if (!(recs[name] && recs[name].kind === 'speech sound') && !Object.hasOwn(voices, name) && !Object.hasOwn(vowels, name)) out.push(name + ' gone');
    return out; };
  const swap = (o, x, y, field = 'goal') => ({ ...o, [x]: { ...o[x], [field]: o[y][field] }, [y]: { ...o[y], [field]: o[x][field] } });
  const ownWrong = ownOff(L.SOUND_RECORDINGS, L.VOICE_SOUNDS);
  plants.push(ownOff(swap(L.SOUND_RECORDINGS, 'm', 'n'), L.VOICE_SOUNDS).length > 0, ownOff(swap(L.SOUND_RECORDINGS, 'd', 'og'), L.VOICE_SOUNDS).length > 0,
    ownOff({ ...L.SOUND_RECORDINGS, s: { ...L.SOUND_RECORDINGS.s, goal: L.SOUND_RECORDINGS.s.goalOne, goalOne: L.SOUND_RECORDINGS.s.goal } }, L.VOICE_SOUNDS).length > 0, ownOff(L.SOUND_RECORDINGS, swap(L.VOICE_SOUNDS, 'huh', 'wuh')).length > 0,
    ownOff(L.SOUND_RECORDINGS, L.VOICE_SOUNDS, swap(L.VOWEL_WORDS, 'oh', 'eye')).length > 0, ownOff(L.SOUND_RECORDINGS, L.VOICE_SOUNDS, swap(L.VOWEL_WORDS, 'oh', 'eye', 'ipa')).length > 0,
    // Since pass NI: the voice's yuh and kwuh dropped from the code, each caught by the table's own key.
    ['yuh', 'kwuh'].every((k) => ownOff(L.SOUND_RECORDINGS, Object.fromEntries(Object.entries(L.VOICE_SOUNDS).filter(([n]) => n !== k))).includes(k + ' gone')));
  // The place marks: a word in capitals that a goal also names is capped outside the goal, never inside it.
  const { elevenSentence } = await import('../tools/audio-ledger.mjs');
  const ogGoal = L.goalTag(L.SOUND_RECORDINGS.og.goal); const capped = [elevenSentence('Dog ends with og.', { stress: ['dog'] }).text, elevenSentence('Dog and log end with og.', { word: 'dog' }).text];
  const marksHeld = capped.every((t) => t.includes(ogGoal) && /\bDOG\b/.test(t.replace(ogGoal, '')));
  // noNote, aWithGoal and the generator, each with a near miss through its own function: a row whose description lost its note, a
  // letter A given huh's goal, a sender that ignores --no-goals, and one whose --no-goals drops the symbols with the goals.
  const noteMiss = noteOff({ ...fs, description: fs.description.replace('tells Eleven what the sound should be', '') });
  const aMiss = aGoalOff({ text: L.goalTag(L.VOICE_SOUNDS.huh.goal) + ' "/eɪ/"' });
  const genKeepsGoals = genOff(sm, (r) => sent(r, false));
  const genDropsSymbols = genOff(sm, (r, noGoals) => noGoals ? sent(r, true).replace(/"\/[^/"]+\/"/g, '') : sent(r, false));
  plants.push(noteMiss, aMiss, genKeepsGoals, genDropsSymbols, backOff(ls.text + ' ' + lsDir), ownKeyOff({ ...ls, description: String(ls.description).split('--only ' + ls.key + ' ').join('--only S95 ') }));
  const lessonGoals = goalRows.filter((r) => r.kind === 'lesson line').length; const soundGoals = goalRows.filter((r) => r.kind === 'speech sound').length;
  ok(`every speech sound the ledger sends follows its own goal, Mikey's short descriptor for Eleven (${soundGoals} sound rows and ${lessonGoals} lesson lines; ${L.SOUND_GOAL_TAGS.length} goals, each a direction for the voice naming its own sound by its word, no letter and no sound effect; the line's own direction again after a sound in ${backs} lines; the letter A in ${letterA.length} lines without one; --no-goals keeps every symbol; ${plants.length} near misses caught)`,
    off.length === 0 && soundGoals === rows.filter((r) => r.kind === 'speech sound').length && lessonGoals >= 45 && noNote.length === 0 && aWithGoal.length === 0 && letterA.length >= 20 && dirBad.length === 0 && genBad.length === 0 && noBack.length === 0 && dirOff.length === 0 && keyOff.length === 0 && backs >= 20 && ownWrong.length === 0 && marksHeld && plants.every(Boolean),
    `unpaired ${off.slice(0, 6).join(', ')}; no note ${noNote.slice(0, 4).join(', ')}; A with a goal ${aWithGoal.join(', ')}; directions ${dirBad.join(' | ')}; generator ${genBad.slice(0, 4).join(', ')}; no direction back ${noBack.slice(0, 4).join(', ')}; direction not as often as due ${dirOff.slice(0, 4).join(', ')}; remake step without its own key ${keyOff.slice(0, 4).join(', ')}; goals on the wrong sound ${ownWrong.join(', ')}; marks held ${marksHeld}; plants ${plants}`); }
// An id is defined once (pass MX): She, he and they's yes or no first took the id p4-fit-yesno, which Say it to fit's bank already had,
// and Object.assign(GENERATORS, ...) let the new bank replace the old one with no error, as a second key of the same name in the rules
// test's PREK_DERIVE replaced its derivation; a module id is global for the same reason (pass GL). Every generator key in src/logic.mjs
// and every derivation key in tests/logic.test.mjs's PREK_DERIVE is read from the source, and a key written twice fails; the near miss
// is the source with Say it to fit's yes or no written again. Since round one's code check an id written with a factory call
// ('pm-same-animals': themedSame(...)) is read too, every id the source builds from a name (pl-hear-, pl-lines-, k5-, k10-, wr-) keeps
// to that name's pattern and no written id takes one, and the near misses add a second themedSame id, a written k5- id and a
// derivation written twice.
{ const src = readFileSync(new URL('../src/logic.mjs', import.meta.url), 'utf8'); const rules = readFileSync(new URL('./logic.test.mjs', import.meta.url), 'utf8');
  const twice = (keys) => { const seen = new Map(); for (const k of keys) seen.set(k, (seen.get(k) || 0) + 1); return [...seen].filter(([, n]) => n > 1).map(([k]) => k); };
  // Since round two's code read a key written rng => (no parentheses) and a key after another on one line are read too.
  const genKeys = (t) => [...t.matchAll(/(?:^[ \t]+|[{,][ \t]*)'([a-z0-9][a-z0-9-]*)': (?:\(rng\b|rng\s*=>|[A-Za-z_]\w*\()/gm)].map((m) => m[1]);
  const BUILT = /^(?:pl-(?:hear|lines)-|k(?:5|10)-|wr-)/;
  const deriveBlock = rules.slice(rules.indexOf('const PREK_DERIVE = {'), rules.indexOf('\n};', rules.indexOf('const PREK_DERIVE = {')));
  // Since pass NF (round one's code read) a derivation key is read wherever it stands on a line, as a generator key is: PREK_DERIVE writes
  // five keys to a line, and the reader that read only a key at a line's start read 251 of 280, eight of pass NF's ten never.
  const deriveKeysOf = (b) => [...b.matchAll(/(?:^[ \t]+|[{,][ \t]*)'([a-z0-9][a-z0-9-]*)': \(q\)/gm)].map((m) => m[1]); const deriveKeys = deriveKeysOf(deriveBlock);
  const gens = genKeys(src); const genTwice = twice(gens); const deriveTwice = twice(deriveKeys);
  const built = Object.keys(L.GENERATORS).filter((k) => !gens.includes(k)); const builtOk = built.every((k) => BUILT.test(k)) && !gens.some((k) => BUILT.test(k));
  const plant = twice(genKeys(src + "\n  'p4-fit-yesno': (rng) => null,\n")).includes('p4-fit-yesno') && twice(genKeys(src + "\n  'pm-same-animals': themedSame(MATCH_THEMES.animals),\n")).includes('pm-same-animals')
    && genKeys("\n  'k5-more': (rng) => null,\n").some((k) => BUILT.test(k)) && twice([...deriveKeys, 'p4-they-yesno']).includes('p4-they-yesno')
    && twice(genKeys(src + "\n  'p4-fit-yesno': rng => null,\n")).includes('p4-fit-yesno') && twice(genKeys(src + "\n  'zz-one': (rng) => null, 'p4-fit-yesno': (rng) => null,\n")).includes('p4-fit-yesno')
    && twice(deriveKeysOf(deriveBlock.replace("'p4-hiw-yesno': (q) => nfSaysIt(q),", "'p4-hiw-yesno': (q) => nfSaysIt(q), 'p4-hiw-pic': (q) => null,"))).includes('p4-hiw-pic');
  ok(`every generator id in src/logic.mjs and every derivation in the rules test is defined once (${gens.length} written generators, factory calls among them, and ${built.length} built from a name's pattern; ${deriveKeys.length} derivations, every key read wherever it stands on a line since pass NF; seven near misses caught)`, gens.length > 1700 && deriveKeys.length >= 280 && genTwice.length === 0 && deriveTwice.length === 0 && builtOk && built.length > 0 && plant, `generators twice ${genTwice.join(', ')}; derivations twice ${deriveTwice.join(', ')}; built off pattern ${built.filter((k) => !BUILT.test(k)).slice(0, 5).join(', ')}; plant ${plant}`); }
// A run of beats said (rab, bit) is a sentence of its own after its word said alone (story flow item 12, pass MY: inside a sentence
// its first beat is heard as a word or a pause, "but" or "um", and a word beside it as one more beat), in every lesson line, every
// early-years story paragraph, every early Wonder question and every question of the beats banks; and every ledger row that is a run
// asks for its word in short, even beats, a voice the lesson shows (a turn's telling voice) included, and is never asked drawn out
// (round two's code read: the turn rows got "[telling, the voice falling at the end] Dye, nuh, sore."). A line and a row planted.
{ const { LEDGER_CSV } = await import('../tools/audio-ledger.mjs'); const { STORIES } = await import('../src/stories.mjs');
  const RUNS = Object.keys(L.BEAT_RUNS); const sentences = (t) => String(t || '').split(L.SENTENCE_BREAK).map((s) => s.trim()).filter(Boolean);
  const inside = (t) => sentences(t).filter((s) => RUNS.some((r) => new RegExp('\\b' + r + '\\b', 'i').test(s)) && !RUNS.includes(s.replace(/[.!?]$/, '').toLowerCase()));
  const heard = []; for (const c of L.COURSES.filter((x) => x.readAloud)) for (const m of c.modules) for (const line of ((m.lesson && m.lesson.script) || [])) heard.push([m.id, line.say]);
  for (const [id, st] of Object.entries(STORIES)) { const m = L.getModule(id); const c = m && L.COURSES.find((x) => x.id === m.courseId); if (c && c.readAloud) for (const p of st.words || []) heard.push([id + ' story', p]); }
  for (const w of (L.WONDER || []).filter((x) => x.stage === 'early')) heard.push([w.id, [w.prompt, ...(w.simple || []).map((s) => s.says)].join(' ')]);
  for (const g of ['p4-beats-count', 'p4-beats-find', 'p4-beats-blend', 'p4-beats-more', 'p4-beats-same', 'p4-beats-yesno', 'p4-blend-heard', 'p4-blend-yesno', 'p4-blend-beats', 'p4-blend-pair']) for (let s = 1; s <= 400; s++) { const q = L.generateQuestion(g, s); heard.push([g + ' ' + s, [q.story, q.prompt, q.explain, ...Object.values(q.whyNot || {}).map((e) => e.why)].filter(Boolean).join(' ')]); }
  const off = heard.flatMap(([id, t]) => inside(t).map((s) => id + ': ' + s));
  const rows = LEDGER_CSV.split('\n').slice(1).map((r) => { const cells = [...r.matchAll(/"((?:[^"]|"")*)"/g)].map((m) => m[1].replace(/""/g, '"')); return { key: cells[0], text: cells[7] || '', description: cells[8] || '' }; });
  const runRows = rows.filter((r) => RUNS.includes(r.text.replace(/\[[^\]]*\]\s*/g, '').trim().replace(/[.!?]$/, '').toLowerCase()));
  const rowOff = (r) => !/said slowly in (?:two|three|four) short, even beats\]/.test(r.text) || /drawing out/.test(r.description);
  const badRows = runRows.filter(rowOff).map((r) => r.key);
  const planted = inside('Then he drummed his own name slowly, Cal, lum, boom, boom.').length === 1 && inside('Callum. Cal, lum.').length === 0
    && rowOff({ text: '[telling, the voice falling at the end] Dye, nuh, sore.', description: 'Lesson line 10.' }) && rowOff({ text: '[warm and gentle, umbrella said slowly in three short, even beats] Um, brel, luh.', description: 'a warm, gentle teacher\'s voice for a young child, drawing out the key words.' });
  // The booms' note reaches only a story whose booms the child counts (the third read: it had reached The big boom's thunder and a
  // parade drum); every row with it is A birthday drum's, and a row of another story with it is caught.
  const { BOOMS_COUNTED, BOOMS_NOTE } = await import('../tools/audio-ledger.mjs');
  const allRows = LEDGER_CSV.split('\n').slice(1).map((r) => { const cells = [...r.matchAll(/"((?:[^"]|"")*)"/g)].map((m) => m[1].replace(/""/g, '"')); return { key: cells[0], source: cells[2], description: cells[8] || '' }; });
  const boomsOff = (list) => list.filter((r) => r.description.includes(BOOMS_NOTE.trim()) && !BOOMS_COUNTED.has(r.source)).map((r) => r.key);
  const boomRows = allRows.filter((r) => r.description.includes(BOOMS_NOTE.trim())).length;
  ok(`the booms' note reaches only a story whose booms the child counts (${boomRows} rows, all A birthday drum's; a thunder row with it planted and caught)`, boomsOff(allRows).length === 0 && boomRows >= 3 && boomsOff([{ key: 'S3882-2', source: 'four-feelings', description: 'told calm.' + BOOMS_NOTE }]).length === 1, boomsOff(allRows).join(', '));
  ok(`a run of beats is a sentence of its own in every heard lesson line, early story, early Wonder question and beats question, and every ledger row that is a run asks for even beats and never a drawn-out voice (${heard.length} texts and ${runRows.length} rows read; a run inside a sentence and two rows planted and caught)`, off.length === 0 && badRows.length === 0 && runRows.length >= 10 && planted, JSON.stringify({ off: off.slice(0, 4), badRows }));
  // Words that sound almost the same (pass MZ, round two's code check: the direction reached only a row that said both words of a pair,
  // and missed the clips a child compares, "Cat." then "Hat."): every row of the two lessons on them, a lesson line, a story paragraph
  // or a title, that says a word of a pair asks for it said clearly, its start crisp, naming the word it must never sound like (both
  // words, when it says both), and none of their lesson lines that says one is drawn out. The pairs are logic's (NS_PAIRS). A row
  // without the direction is planted and caught. The floor is the count of such rows since pass MZ.
  const { NEAR_PAIRS_LESSONS } = await import('../tools/audio-ledger.mjs');
  const NEAR_ROWS_FLOOR = 69;   // the rows of the two lessons that say a word of a pair, since pass MZ's round two
  const fullRows = LEDGER_CSV.split('\n').slice(1).map((r) => { const cells = [...r.matchAll(/"((?:[^"]|"")*)"/g)].map((m) => m[1].replace(/""/g, '"')); return { key: cells[0], kind: cells[1], source: cells[2], text: cells[7] || '', description: cells[8] || '' }; });
  const pairWords = (r) => { const low = r.text.replace(/\[[^\]]*\]/g, ' ').toLowerCase(); const has = (w) => new RegExp('\\b' + w + 's?\\b').test(low); return L.NS_PAIRS.filter(([a, b]) => has(a) || has(b)).map(([a, b]) => [a, b, has(a), has(b)]); };
  const nearOff = (list) => list.flatMap((r) => { const want = pairWords(r).map(([a, b, hasA, hasB]) => (hasA && hasB ? `Say ${a} and ${b} clearly, each start crisp` : `Say ${hasA ? a : b} clearly, its start crisp, so it never sounds like ${hasA ? b : a}.`));
    const missing = want.filter((w) => !r.description.includes(w)); if (want.length && r.kind === 'lesson line' && /drawing out/.test(r.text)) missing.push('drawn out');
    return missing.map((w) => r.key + ': ' + w); });
  const nearRows = fullRows.filter((r) => NEAR_PAIRS_LESSONS.has(r.source)); const nearSaying = nearRows.filter((r) => pairWords(r).length).length;
  const plantNear = nearOff([{ key: 'cat-or-hat-0-1', kind: 'lesson line', source: 'cat-or-hat', text: '[warm and gentle, each word said clearly, its first sound crisp] Cat.', description: 'Lesson line 1.' }]).length === 1
    && nearOff([{ key: 'cat-or-hat-0-1', kind: 'lesson line', source: 'cat-or-hat', text: '[warm and gentle, drawing out key words] Cat.', description: 'Say cat clearly, its start crisp, so it never sounds like hat.' }]).length === 1;
  ok(`every ledger row of the lessons on words that sound almost the same that says a word of a pair asks for it said clearly, naming the word it must never sound like, and none of their lesson lines is drawn out (${nearSaying} of their ${nearRows.length} rows; a row without the direction and a drawn-out row planted and caught)`, L.NS_PAIRS.length === 6 && nearOff(nearRows).length === 0 && nearSaying >= NEAR_ROWS_FLOOR && plantNear, nearOff(nearRows).slice(0, 6).join(' | '));
}
// A turn to think of a word, to put beats or words together, or to take a word apart ends its line (pass NA, round one's code check:
// nothing waits after a line's last turn, so the child has until Next, where a wait after a turn inside a line is the say-back wait,
// 1.2 seconds; since round two's final read the turns of Two words make one too). Three plants: a blend turn with its answer after it,
// Two words make one's line 4 as pass MY wrote it, and a think turn with a sentence after it (round two's code read). Clap the beats' clap turn asks no such thing and keeps its wait, timed by its beats.
{ const asks = /\bthink of (?:a|another) word\b|\bput (?:these|them|the)\b[^.]*\btogether\b|\btake (?:one|it) apart\b/i;
  const late = (l) => { const t = (l.voices || []).filter((e) => Array.isArray(e) && e[2] === 'turn'); return t.length > 0 && asks.test(l.say) && !l.say.trim().endsWith(String(t[t.length - 1][0]).trim()); };
  let read = 0; const bad = [];
  for (const m of L.MODULES) ((m.lesson && m.lesson.script) || []).forEach((l, i) => { if ((l.voices || []).some((e) => Array.isArray(e) && e[2] === 'turn') && asks.test(l.say)) read += 1; if (late(l)) bad.push(m.id + ' line ' + (i + 1)); });
  const plants = [{ say: 'Now you try, and put these beats together. Rab, bit. Rabbit!', voices: [['Rab, bit.', 'tell', 'turn']] }, { say: 'Now you try, and put these two words together. Sun. Flower. Sunflower!', voices: [['Flower.', 'tell', 'turn']] }, { say: 'Now you try. Sun starts with sss. Think of another word that starts like sun, and say it. Did you think of one?', voices: [['Think of another word that starts like sun, and say it.', 'tell', 'turn']] }];
  ok(`a turn to think of a word, put beats or words together, or take a word apart ends its line (pass NA; ${read} turns read; three plants with a sentence after the turn caught)`, bad.length === 0 && read >= 10 && plants.every(late), bad.join(', ') + ' read ' + read); }
// Huh beside an ending the app plays (pass NB, round one's story flow check): "Huh, at." is a speech sound and an ending, so huh goes to
// Eleven in IPA with its goal, as it does beside sss; the tool had needed another sound it matches by name and sent "Huh," as letters,
// which Eleven reads as the word. The near miss is that row as it was sent.
{ const { elevenSentence } = await import('../tools/audio-ledger.mjs');
  const huhSent = (t) => t.includes(L.goalTag(L.VOICE_SOUNDS.huh.goal)) && t.includes(L.ipaQuoted(L.VOICE_SOUNDS.huh.ipa)) && !/\bHuh\b/.test(t);
  const now = ['Hat. Huh, at.', 'The first part of hat is huh, and hat ends with at, just like cat.'].map((t) => elevenSentence(t).text);
  const old = '[warm and gentle, drawing out key words] Huh, ' + L.goalTag(L.SOUND_RECORDINGS.at.goal) + ' ' + L.ipaQuoted(L.SOUND_RECORDINGS.at.ipa) + '.';
  ok('huh beside an ending the app plays goes to Eleven as a speech sound, in IPA with its goal (pass NB; "Huh, at." sent as letters caught)', now.every(huhSent) && !huhSent(old), now.join(' | '));
  // A story row's description names huh with the app's sounds (round one's story check's fifth consider; the old description planted).
  const { soundsWritten } = await import('../tools/audio-ledger.mjs'); const told = soundsWritten('Mmm, at, mat, and huh, at, hat!'); const huhTold = (d) => d.includes('huh, ' + L.VOICE_SOUNDS.huh.short);
  ok('a story row\'s description names huh with the app\'s own sounds it is said beside, and no row without them (pass NB, round one\'s story check; the old description caught)', huhTold(told) && !huhTold(told.replace('; huh, ' + L.VOICE_SOUNDS.huh.short, '')) && soundsWritten('Huh? said Grandpa.') === '', told); }
// Since round two's alignment and content reads (pass NF) the marks drawing, the picture Look and write's "Is this a real letter? No" rests
// on, holds no closed shape of three points with its middle point above the other two: its triangle, two slanted sides meeting at the top
// with a bar across, fit Listen and point's own words for A ("Its two slanted sides lean in and meet at the top, with a bar across."), so it
// is gone and the top row centered. Every path of the drawing is read, each part a move starts. Plant: the drawing as round one left it.
{ const ui = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8'); const marksOf = (src) => src.split('\n').find((l) => l.trim().startsWith('marks: <g>')) || '';
  const peaks = (line) => [...line.matchAll(/ d="([^"]+)"/g)].flatMap((m) => m[1].split(/(?=M)/)).filter((part) => /Z\s*$/.test(part.trim())).map((part) => [...part.matchAll(/(-?[\d.]+)[ ,](-?[\d.]+)/g)].map((p) => [Number(p[1]), Number(p[2])]))
    .filter((pts) => pts.length === 3 && pts[1][1] < pts[0][1] && pts[1][1] < pts[2][1]);
  const marks = marksOf(ui); const old = marks.replace('</g><path d="M32 57', '<path d="M70 44 L74 30 L78 44 Z" /></g><path d="M32 57');
  ok(`the marks drawing holds no closed three-point shape with its point at the top, the triangle that fit the letter A's own words (round two's alignment and content reads, pass NF; ${[...marks.matchAll(/ d="/g)].length} paths read; the triangle put back as round one left it, planted, caught)`, marks.length > 0 && peaks(marks).length === 0 && old !== marks && peaks(old).length === 1, JSON.stringify(peaks(marks))); }
// Every opener of a story page sets the voice's state as it opens it (pass NF, round one's screen read and the advisor's read of its fix):
// a read-aloud story opened with the voice off drew the scroll cue for StoryBody's 400 ms start window and kept its room for the whole
// reading. The browser checks open stories through window.__eduTest, so the screen's own openers are read here: every line that opens
// the story or course-story screen sets setStoryVoiceOn on that line, but the reader lesson's View story, which opens a reader course's
// story, a page with no voice of its own. Plant: My Stories' button with its voice state taken out, caught.
// Since round two's code read (pass NF) every setScreen call is read with its argument whole (its parentheses balanced, its strings
// skipped), since the check read only lines with a literal and a refresh opened a read-aloud story through setScreen(where.screen), the
// where-note's restore, drawing the cue for about 370 ms: the openers are the calls whose argument holds 'story' or 'course-story'
// anywhere (a ternary's arm too) and the restore, and each sets the voice's state between itself and the opener before it on its line.
// Every call whose argument is a name is named here with what it opens (r.screen, an educator screen the idle PIN or Change state left;
// up, the device's back, which never returns a story; where.screen, the restore; name, the test hook), so a new one fails until it is
// read, and so does a call whose argument is neither a string, a name nor a choice of two strings. Plants: My Stories' button and the
// restore each with its voice state taken out, an arm that opens a story with none, and a new name, each caught.
{ const ui = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8');
  const callsOf = (src) => { const out = []; let at = 0;
    while ((at = src.indexOf('setScreen(', at)) >= 0) { const from = at + 'setScreen('.length; let depth = 1; let k = from;
      while (k < src.length && depth > 0) { const ch = src[k]; if (ch === "'" || ch === '"' || ch === '`') { k++; while (k < src.length && src[k] !== ch) { if (src[k] === '\\') k++; k++; } }
        else if (ch === '(') depth++; else if (ch === ')') depth--; k++; }
      out.push({ arg: src.slice(from, k - 1).trim(), at, end: k, line: src.slice(0, at).split('\n').length }); at = k; }
    return out; };
  const READER = "noteStoryOpen(mod.id, 'lesson');"; const NAMED = ['r.screen', 'up', 'where.screen', 'name']; const STORY = /'(?:story|course-story)'/;
  const formOf = (a) => (/^'[^']*'$/.test(a) ? 'string' : /^[\w$.]+$/.test(a) ? 'name' : /^[^?]+\?\s*'[^']*'\s*:\s*'[^']*'$/.test(a) ? 'choice' : 'other');
  const readOf = (src) => { const calls = callsOf(src); const lines = src.split('\n'); const openers = calls.filter((c) => STORY.test(c.arg) || c.arg === 'where.screen');
    const unset = openers.filter((c) => { const start = src.lastIndexOf('\n', c.at) + 1; const prev = openers.filter((o) => o.at < c.at && o.at >= start).pop();
      return !src.slice(prev ? prev.end : start, c.at).includes('setStoryVoiceOn(') && !lines[c.line - 1].includes(READER); }).map((c) => c.line);
    const names = calls.filter((c) => formOf(c.arg) === 'name').map((c) => c.arg); const odd = calls.filter((c) => formOf(c.arg) === 'other' || (formOf(c.arg) === 'name' && !NAMED.includes(c.arg))).map((c) => `${c.arg} at ${c.line}`);
    return { calls: calls.length, openers: openers.length, unset, names, odd }; };
  const myStories = "setStoryVoiceOn(canSpeak() && !!(getCourse((getModule(r.moduleId) || {}).courseId) || {}).readAloud); setScreen('story');";
  const RESTORE = "if (where.screen === 'story') setStoryVoiceOn(canSpeak() && !!(getCourse(known.courseId) || {}).readAloud); setScreen(where.screen);";
  const ARM = "setScreen(storyLogFrom === 'report' ? 'educator-report' : 'educator-pick');";
  const now = readOf(ui); const plants = [ui.replace(myStories, "setScreen('story');"), ui.replace(RESTORE, 'setScreen(where.screen);'), ui.replace(ARM, "setScreen(storyLogFrom === 'report' ? 'story' : 'educator-pick');"), ui.replace('setScreen(up);', 'setScreen(back);')];
  const [p1, p2, p3, p4] = plants.map(readOf);
  ok(`every opener of a story page sets the voice's state as it opens it, so a read-aloud story draws no cue in its start window (pass NF, round one's screen read; since round two's code read every setScreen call read whole, ${now.calls} calls: ${now.openers} openers, the where-note's restore among them, the reader lesson's View story named, and the names ${now.names.join(', ')}; planted and caught: My Stories' button and the restore without their voice state, an arm that opens a story without it, and a new name)`,
    now.openers >= 9 && now.unset.length === 0 && now.odd.length === 0 && NAMED.every((n) => now.names.includes(n)) && now.names.length === NAMED.length && plants.every((p) => p !== ui)
    && p1.unset.length === 1 && p2.unset.length === 1 && p3.unset.length === 1 && p4.odd.length === 1, JSON.stringify({ unset: now.unset, odd: now.odd, names: now.names, plants: [p1.unset, p2.unset, p3.unset, p4.odd] })); }
// A picture of a whole page is named as one (pass NH, round two's whole read of RULES-AUDIT: section 9's row on pictures of a screen
// was held by the doc alone, and two tests took whole-page pictures unnamed). Every fullPage: true in tests/ and tools/ carries the words
// "a picture of a whole page" on its line or the line above, since such a picture draws what is pinned to the screen where the screen
// stood. Near miss: a planted whole-page picture with no note, caught.
{ const { readdirSync, statSync } = await import('node:fs'); const files = [];
  const walk = (dir) => { for (const f of readdirSync(new URL(dir, import.meta.url))) { if (f === 'out' || f === 'node_modules' || f === 'art') continue; const rel = dir + f; const st = statSync(new URL(rel, import.meta.url)); if (st.isDirectory()) walk(rel + '/'); else if (/\.(mjs|js|py)$/.test(f)) files.push(rel); } };
  walk('./'); walk('../tools/');
  const unnamed = (name, text) => { const lines = text.split('\n'); return lines.map((l, i) => (/fullPage:\s*true|full_page\s*=\s*True/.test(l) && !/a picture of a whole page/i.test(l + ' ' + (lines[i - 1] || '')) ? `${name}:${i + 1}` : null)).filter(Boolean); };
  const found = files.flatMap((f) => unnamed(f, readFileSync(new URL(f, import.meta.url), 'utf8')));
  const named = files.filter((f) => /fullPage:\s*true/.test(readFileSync(new URL(f, import.meta.url), 'utf8'))).length;
  const plant = unnamed('plant', "await page.screenshot({ path: 'x.png', full" + "Page: true });");   // split, so this line is not one
  ok(`every whole-page picture a test or tool takes is named as one (pass NH; ${named} files take one; an unnamed one, planted, caught)`, found.length === 0 && named >= 2 && plant.length === 1, found.join(', ')); }
console.log(`\n${pass} passed, ${fail} failed`);
process.exitCode = fail ? 1 : 0;   // never process.exit(): it can drop the last lines of a piped stdout (2026-09-23)
