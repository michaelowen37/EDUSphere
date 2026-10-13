// The Wise Human. Copyright (c) 2026. Source-available; not for reuse. See LICENSE.md.
// Core-cast ages in story text (pass MB). Mikey: "I think the ages and relatives are okay to mention in stories but keep the
// age part at a minimum.  It's actually good to state the age periodically just not consistently.  Relatives, no restriction
// anymore." So a story may say Frederick was eight, now and then, never as a habit. This tool finds every story whose words
// state a core character's age, lists them in grade order beside the age the clock in docs/CHARACTERS.md gives that chapter
// (a story may be a flashback to a younger age, so a younger age is a question for the reader, not an error), and counts how
// often the long stories do it. tests/stories.test.mjs holds the counts with the same function.
//
// Run: node tools/cast-ages.mjs > docs/CAST-AGES.md
const CAST = ['Mike', 'Chloe', 'Frederick', 'Georgette', 'Savanah', 'Jaxon', 'Harlow'];
const NAMES = `(${CAST.join('|')})`;
// Compound numbers come first (pass MC): an alternation takes the first that matches, so twenty ahead of twenty-three made the
// report say twenty for a story that says twenty-three.
const NUM = '((?:twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)-\\w+|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|\\d+)';
const NOT_AN_AGE = '(?! (minutes|hours|days|weeks|months|years? (ago|later|earlier|before)|o\'clock|feet|inches|miles|times|dollars|cents|points|pages|meters|steps|laps|pounds|people|students|kids|children|friends|blocks|cookies|apples|percent|out of))';
// Each pattern is one common way English states a person's age: Mike was eight, eight-year-old Mike, Mike, eight, when Mike was
// eight, at eight Mike, Mike's eighth birthday is left out on purpose (a birthday names an event, and A8's microscope is one).
const PATTERNS = [
  new RegExp(`\\b${NAMES}( was| is| turned|, who was|, now)( only| just| almost| nearly| barely)? ${NUM}\\b(?!-)${NOT_AN_AGE}`, 'i'),
  new RegExp(`\\b${NUM}-year-old ${NAMES}\\b`, 'i'),
  new RegExp(`\\b${NAMES}, ${NUM}(,| and\\b)`, 'i'),
  new RegExp(`\\bwhen ${NAMES} was ${NUM}\\b(?!-)${NOT_AN_AGE}`, 'i'),
  new RegExp(`\\bat ${NUM}, ${NAMES}\\b`, 'i'),
  new RegExp(`\\b${NAMES}\\b[^.!?]{0,40}\\b${NUM} years old\\b`, 'i'),
  // Found by the code check in pass MB: "The summer she turned seventeen, Savanah", "Mike had just turned nine",
  // "Savanah, then seventeen,", "At nine years old, Mike".
  new RegExp(`\\bturned ${NUM}\\b(?!-)${NOT_AN_AGE}[^.!?]{0,30}\\b${NAMES}\\b`, 'i'),
  new RegExp(`\\b${NAMES} had( just| only)? turned ${NUM}\\b`, 'i'),
  new RegExp(`\\b${NAMES}, (then|now|only|just|barely|almost) ${NUM},`, 'i'),
  new RegExp(`\\bat ${NUM} years old, ${NAMES}\\b`, 'i'),
];
// Since pass MC (the story check found six ages the patterns above missed, among them "She was eighteen.", "came to the city at
// eighteen" and "by fifteen she was selling"): an age said with he or she, or with at or by, counts when the person it belongs to
// is a core character, read from the nearest name before it. That name is a cast name anywhere, or a capitalized word inside a
// sentence (a sentence's first word may be any word), so "He was eight" after "her cousin Nico" is Nico's, and "at eighteen"
// after "Savanah came to the city" is hers. A clock time is not an age (at nine o'clock, at eight in the morning).
const TIME_AFTER = "(?! (o'clock|in the (morning|evening|afternoon)|at night|that (morning|night|evening|afternoon)|sharp|a\\.m\\.|p\\.m\\.|thirty|fifteen|forty-five))";
// Ages in stories are written in words, so these read number words only; an age ends a phrase (a comma, a stop, or he, she, when,
// and, with, years old after it), so "at four spots" and "by eight years" are counts, and a price is never an age.
const NUMW = NUM.replace('|\\d+)', ')');
const AGE_END = '(?=[,.;!?]| (he|she|when|and|with|years old)\\b)';
const BY_CONTEXT = [
  new RegExp(`\\b(he|she) (was|turned|had turned)( only| just| almost| nearly| barely)? ${NUMW}\\b(?!-)${NOT_AN_AGE}${TIME_AFTER}${AGE_END}`, 'gi'),
  new RegExp(`(?<!(price|prices|cost|costs|priced|multiplied|divided|times|one|${NUMW.slice(1, -1)}) )\\b(at|by) ${NUMW}\\b(?!-)${NOT_AN_AGE}${TIME_AFTER}${AGE_END}`, 'gi'),   // never a price, a product or a size (three by four)
  // The story check's second read: "aged nine" and "a girl of nine", the form the pictures' own lines use, after a cast name.
  new RegExp(`\\baged ${NUMW}\\b(?!-)${NOT_AN_AGE}`, 'gi'),
  new RegExp(`\\ba (boy|girl|man|woman|teenager|teen|child|kid) of ${NUMW}\\b(?!-)${NOT_AN_AGE}`, 'gi'),
];
function nameBefore(text) {
  const sentences = text.split(/(?<=[.!?])\s+/);
  for (let i = sentences.length - 1; i >= 0; i -= 1) {
    const words = [...sentences[i].matchAll(/\b[A-Z][a-z]+\b/g)];
    for (let j = words.length - 1; j >= 0; j -= 1) {
      const w = words[j][0]; const first = sentences[i].slice(0, words[j].index).trim() === '';
      if (CAST.includes(w)) return w;
      if (!first) return w;   // a capitalized word inside a sentence is a name, and it is not the cast's
    }
  }
  return null;
}
// The phrases in a story's words that state a core character's age (empty when none does).
export function agePhrases(words) {
  const text = [].concat(words || []).join(' ');
  const found = PATTERNS.map((re) => (text.match(re) || [])[0]).filter(Boolean);
  for (const re of BY_CONTEXT) for (const m of text.matchAll(re)) if (CAST.includes(nameBefore(text.slice(0, m.index)) || '')) found.push(m[0]);
  // One statement can match two patterns (When Mike was nine is also Mike was nine): keep the longer wording once.
  return found.filter((x, i) => !found.some((y, j) => j !== i && y.length > x.length && y.toLowerCase().includes(x.toLowerCase())) && found.indexOf(x) === i);
}
// The clock in docs/CHARACTERS.md, by chapter, for the reader's side-by-side check.
export const CLOCK = {
  early: 'children, 3 to 8 (Georgette in her fifties)',
  elementary: 'teens, 12 to 16 (Georgette in her sixties)',
  middle: 'young adults, 17 to 22, Frederick 20 (Georgette in her late sixties to seventies)',
  high: 'adults, Mike and Savanah with Jaxon (6) and Harlow (3) (Georgette in her seventies)',
  college: 'fifties, Frederick emeritus (Georgette very old)',
};
export function chapterOf(grade) {
  if (['PK3', 'PK4', 'K', '1', '2'].includes(grade)) return 'early';
  if (['3', '4', '5'].includes(grade)) return 'elementary';
  if (['6', '7', '8'].includes(grade)) return 'middle';
  if (['9', '10', '11', '12'].includes(grade)) return 'high';
  return 'college';
}
// Every story that states a core character's age, in grade order, and the long stories as a string of A (states one) and
// . (does not), so a run of habit shows at a glance. byChapter counts the long stories of each chapter and those that state an
// age, since Mikey asked for "a similar ratio throughout all of the grades" (pass MC).
export function castAges(L, ST) {
  const order = (c) => L.GRADES.indexOf(c.grade);
  const rows = []; const longs = []; const byChapter = {};
  for (const c of [...L.COURSES].sort((a, b) => order(a) - order(b))) {
    for (const m of c.modules) { const s = ST.STORIES[m.id]; if (!s) continue; const a = agePhrases(s.words); if (a.length) rows.push({ kind: 'module story', id: m.id, grade: c.grade, title: s.title, phrases: a }); }
    const cs = ST.COURSE_STORIES[c.id];
    if (cs) { const a = agePhrases(cs.words); longs.push(a.length ? 'A' : '.'); if (a.length) rows.push({ kind: 'long story', id: c.id, grade: c.grade, title: cs.title, phrases: a });
      const ch = chapterOf(c.grade); byChapter[ch] = byChapter[ch] || { total: 0, stating: 0 }; byChapter[ch].total += 1; if (a.length) byChapter[ch].stating += 1; }
  }
  const runs = longs.join('').split('.').map((r) => r.length);
  return { rows, byChapter, longPattern: longs.join(''), longTotal: longs.length, longStating: longs.filter((x) => x === 'A').length, longestRun: Math.max(0, ...runs) };
}

// The report, when run on its own.
if (process.argv[1] && process.argv[1].endsWith('cast-ages.mjs')) {
  const L = await import('../src/logic.mjs'); const ST = await import('../src/stories.mjs');
  const r = castAges(L, ST);
  const out = [];
  out.push('# Core-cast ages in story text');
  out.push('');
  out.push('Generated by tools/cast-ages.mjs (pass MB). Mikey: "I think the ages and relatives are okay to mention in stories but keep the age part at a minimum.  It\'s actually good to state the age periodically just not consistently.  Relatives, no restriction anymore."');
  out.push('');
  out.push('Mikey, pass MC, when 33 of 105 long stories stated one: "I think we should have half of that number for the 105 stories and keep a similar ratio throughout all of the grades/long stories".');
  out.push('');
  out.push(`${r.longStating} of ${r.longTotal} long stories state a core character's age; the longest run of them in grade order is ${r.longestRun}. tests/stories.test.mjs holds the long stories to at most one in six and never two in a row, every chapter with six or more long stories to at least one and at most one in five, and module stories with the core cast to one in six.`);
  out.push('');
  out.push('| Chapter | Long stories | State an age |');
  out.push('|---|---|---|');
  for (const ch of ['early', 'elementary', 'middle', 'high', 'college']) { const b = r.byChapter[ch] || { total: 0, stating: 0 }; out.push(`| ${CLOCK[ch]} | ${b.total} | ${b.stating} |`); }
  out.push('');
  out.push('Long stories in grade order, A where the words state an age:');
  out.push('');
  out.push('`' + r.longPattern + '`');
  out.push('');
  out.push('A younger age than the clock can be a flashback (Mikey, pass LZ: the stories show how each came to see the world); a story brief reads each against its chapter and against the other stories of its course.');
  out.push('');
  out.push('| Grade | Story | Kind | What the words say | The clock for this chapter |');
  out.push('|---|---|---|---|---|');
  for (const x of r.rows) out.push(`| ${x.grade} | ${x.title} (${x.id}) | ${x.kind} | ${x.phrases.join('; ')} | ${CLOCK[chapterOf(x.grade)]} |`);
  console.log(out.join('\n'));
}
