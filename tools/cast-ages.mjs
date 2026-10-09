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
const NUM = '(two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|twenty-\\w+|thirty|forty|fifty|sixty|seventy|eighty|ninety|\\d+)';
const NOT_AN_AGE = '(?! (minutes|hours|days|weeks|months|years? (ago|later|earlier|before)|o\'clock|feet|inches|miles|times|dollars|cents|points|pages|meters|steps|laps|pounds|people|students|kids|children|friends|blocks|cookies|apples|percent|out of))';
// Each pattern is one common way English states a person's age: Mike was eight, eight-year-old Mike, Mike, eight, when Mike was
// eight, at eight Mike, Mike's eighth birthday is left out on purpose (a birthday names an event, and A8's microscope is one).
const PATTERNS = [
  new RegExp(`\\b${NAMES}( was| is| turned|, who was|, now)( only| just| almost| nearly| barely)? ${NUM}\\b${NOT_AN_AGE}`, 'i'),
  new RegExp(`\\b${NUM}-year-old ${NAMES}\\b`, 'i'),
  new RegExp(`\\b${NAMES}, ${NUM},`, 'i'),
  new RegExp(`\\bwhen ${NAMES} was ${NUM}\\b${NOT_AN_AGE}`, 'i'),
  new RegExp(`\\bat ${NUM}, ${NAMES}\\b`, 'i'),
  new RegExp(`\\b${NAMES}\\b[^.!?]{0,40}\\b${NUM} years old\\b`, 'i'),
  // Found by the code check in pass MB: "The summer she turned seventeen, Savanah", "Mike had just turned nine",
  // "Savanah, then seventeen,", "At nine years old, Mike".
  new RegExp(`\\bturned ${NUM}\\b${NOT_AN_AGE}[^.!?]{0,30}\\b${NAMES}\\b`, 'i'),
  new RegExp(`\\b${NAMES} had( just| only)? turned ${NUM}\\b`, 'i'),
  new RegExp(`\\b${NAMES}, (then|now|only|just|barely|almost) ${NUM},`, 'i'),
  new RegExp(`\\bat ${NUM} years old, ${NAMES}\\b`, 'i'),
];
// The phrases in a story's words that state a core character's age (empty when none does).
export function agePhrases(words) {
  const text = [].concat(words || []).join(' ');
  const found = PATTERNS.map((re) => (text.match(re) || [])[0]).filter(Boolean);
  // One statement can match two patterns (When Mike was nine is also Mike was nine): keep the longer wording once.
  return found.filter((x, i) => !found.some((y, j) => j !== i && y.length > x.length && y.toLowerCase().includes(x.toLowerCase())) && found.indexOf(x) === i);
}
// The clock in docs/CHARACTERS.md, by chapter, for the reader's side-by-side check.
export const CLOCK = {
  early: 'children, 3 to 8 (Georgette in her fifties)',
  elementary: 'teens, 12 to 16 (Georgette in her sixties)',
  middle: 'young adults, 17 to 22, Frederick 20 (Georgette in her sixties)',
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
// . (does not), so a run of habit shows at a glance.
export function castAges(L, ST) {
  const order = (c) => L.GRADES.indexOf(c.grade);
  const rows = []; const longs = [];
  for (const c of [...L.COURSES].sort((a, b) => order(a) - order(b))) {
    for (const m of c.modules) { const s = ST.STORIES[m.id]; if (!s) continue; const a = agePhrases(s.words); if (a.length) rows.push({ kind: 'module story', id: m.id, grade: c.grade, title: s.title, phrases: a }); }
    const cs = ST.COURSE_STORIES[c.id];
    if (cs) { const a = agePhrases(cs.words); longs.push(a.length ? 'A' : '.'); if (a.length) rows.push({ kind: 'long story', id: c.id, grade: c.grade, title: cs.title, phrases: a }); }
  }
  const runs = longs.join('').split('.').map((r) => r.length);
  return { rows, longPattern: longs.join(''), longTotal: longs.length, longStating: longs.filter((x) => x === 'A').length, longestRun: Math.max(0, ...runs) };
}

// The report, when run on its own.
if (import.meta.url === `file://${process.argv[1]}`) {
  const L = await import('../src/logic.mjs'); const ST = await import('../src/stories.mjs');
  const r = castAges(L, ST);
  const out = [];
  out.push('# Core-cast ages in story text');
  out.push('');
  out.push('Generated by tools/cast-ages.mjs (pass MB). Mikey: "I think the ages and relatives are okay to mention in stories but keep the age part at a minimum.  It\'s actually good to state the age periodically just not consistently.  Relatives, no restriction anymore."');
  out.push('');
  out.push(`${r.longStating} of ${r.longTotal} long stories state a core character's age; the longest run of them in grade order is ${r.longestRun}. tests/stories.test.mjs holds the long stories to at most one in three and no run longer than three, and module stories to the same one in three of those with the core cast.`);
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
