// The Wise Human. Copyright (c) 2026. Source-available; not for reuse. See LICENSE.md.
// The art ledger as a spreadsheet for Leonardo sessions (2026-09-23, Mikey): one row per serial in ledger order with the serial,
// where it goes, the scene, the prompt to paste, the character sheets to attach, the bans and the status.
//
// Since pass MC the prompt is ready for Nano Banana 2, the model Mikey paints with in Leonardo. That model has no negative prompt
// (Leonardo's page for it lists none), so the ledger's negative prompt would never reach it. Mikey: "Yeah, let's fold into the
// prompt." foldPrompt turns each row's bans into closing sentences of the prompt, said the way Google advises for this model:
// "Use positive framing: Describe what you want, not what you don't want (e.g. "empty street" instead of "no cars")." (The
// ultimate Nano Banana prompting guide, Google Cloud Blog, March 6, 2026, which covers Nano Banana 2.) So the sentences describe
// the picture as it should be: wordless, told through shapes and color, crisp outlines on white, sunlight from beyond the
// frame. A picture card, a poster or a mural still shows its drawing: "every surface plain and unmarked", the first wording,
// would have blanked the cards a story turns on (the story check's second read, pass MC). None of them says no, not, never or without (the ledger test reads them).
// Hands and skin are said only where the subject names a person, since the model draws what the words name and a clock's hands
// or a fox's face are not a person's. A ban this file does not know is kept word for word in a last "Do not include" sentence,
// so nothing is ever dropped (the ledger test holds those at none). The character-sheet note (Character: C1.) leaves the prompt
// for its own column, since Nano Banana 2 takes the sheet as an image reference and might letter the note into the picture.
// A long story's pictures all carry its character's note, even a picture of a jar of soil, so the column names the sheet only
// when the scene shows a person: attached to a scene with no one in it, a sheet would put the character there.
// A row EARMARKS A6 lists, a picture that asks for drawn letters, words or numerals, carries the status "Re-plan first (A6)",
// since its folded prompt would ask for the writing and forbid it at once. docs/ART-REQUESTS.md keeps both columns as they are.
// Run: node tools/prompts-csv.mjs > docs/LEONARDO-PROMPTS.csv
import { readFileSync } from 'node:fs';

// The bans the ledger uses, grouped, each group with the sentence that says it.
const WRITING = ['text', 'words', 'letters', 'labels', 'numbers', 'logos', 'watermark', 'signature'];
const HANDS = ['extra fingers', 'extra limbs', 'deformed hands'];
const LINE_ART = ['shading', 'gray fill', 'color', 'gradients'];
const MAP_BANS = ['borders', 'country lines', 'state lines', 'roads', 'cities', 'flags'];
// Bans a single page carries, each with its own sentence (the flower page D4, the rocket D5, the butterfly D6), said as what the
// page shows: these pages stand in for things that questions ask about, so a stray flower or star matters.
const ONE_PAGE = { 'many flowers': 'This single flower is the only one on the page.', bouquet: null, stars: 'The sky is clear apart from the round moon.', flowers: 'The only plants are the leafy bush and the grass.' };
const KNOWN = new Set([...WRITING, ...HANDS, ...LINE_ART, ...MAP_BANS, ...Object.keys(ONE_PAGE), 'blurry', 'photorealistic skin', 'photorealism', 'jagged lines', 'broken outlines', 'tiny details', 'crowded scene', 'background scenery', 'sun', 'text other than the two letters', 'extra letters']);
// A person in the subject (the words before "Style:"). The hands and skin sentences go only where a person is drawn, because
// Nano Banana 2 draws what the words name: told about hands, a clock or a fox might grow some. So the test leans toward
// leaving a person out (a missed person only loses one helpful sentence) and reads these words:
// - a person by kind, role or tie (a boy, a coach, a class cheering, a crossing guard, a finger tracing a line). Pronouns are
//   left out, since his, her and its also name animals and things, and so are names (a prompt says "a boy", as the ledger asks);
// - a mother, father, family or baby, unless an animal follows it (a mother duck) or "its" comes before it;
// - a class or a team, only when it does something (a class singing, the whole class at the zoo, a small team at laptops),
//   not a class garden, a team name or vowel teams;
// - a hand, unless it is a clock's (the short hand, the hour hand, a clock's two hands) or the word means something else
//   (hand-drawn, by hand);
// - a face, only a person's (his face, her face, their faces), never a clock face, a cliff face, a cube's flat face or a
//   drawn smiling face;
// - a person named in a label (sorted by artist) does not count, and neither does a person's thing (a grown-up's big shoe, a
//   child's drawing), unless it is a part of the body (a little boy's toes), nor an angle's neighbors.
// The accuracy check's second read (pass MC) found the possessive: a counted picture of exactly two shoes had been told about
// hands and bodies.
const PEOPLE = 'boys?|girls?|m[ae]n|wom[ae]n|child|children|schoolchildren|kids?|baby|babies|infants?|toddlers?|teens?|teenagers?|' +
  'persons?|people|humans?|grown-ups?|adults?|parents?|grandparents?|students?|teachers?|graders?|mom|moms|mother|dad|dads|father|' +
  'grandma|grandmother|grandpa|grandfather|family|daughters?|sons?|siblings?|friends?|classmates?|farmers?|ranchers?|cowboys?|' +
  'vaqueros?|doctors?|nurses?|dentists?|surgeons?|patients?|workers?|technicians?|engineers?|builders?|carpenters?|crowd|guests?|' +
  'customers?|shoppers?|cashiers?|clerks?|tellers?|bankers?|merchants?|traders?|sellers?|buyers?|vendors?|shopkeepers?|owners?|' +
  'riders?|fishers?|fishermen|colonists?|settlers?|pioneers?|immigrants?|guards?|knights?|lords?|weavers?|players?|scientists?|' +
  'researchers?|assistants?|soldiers?|airmen|king|queen|chef|cooks?|bakers?|pilots?|sailors?|captains?|lookouts?|coach|coaches|' +
  'drivers?|artists?|sisters?|brothers?|uncle|aunt|cousins?|neighbors?|rangers?|firefighters?|officers?|sheriffs?|astronauts?|' +
  'explorers?|climbers?|hikers?|campers?|president|governor|mayor|judges?|jurors?|lawyers?|lawmakers?|senators?|citizens?|voters?|' +
  'members?|statesm[ae]n|historians?|professors?|principals?|librarians?|docents?|tutors?|counselors?|volunteers?|strangers?|' +
  'readers?|writers?|authors?|reporters?|photographers?|architects?|illustrators?|vets?|musicians?|singers?|drummers?|dancers?|' +
  'athletes?|runners?|swimmers?|crew|audience|priests?|monks?|friars?|nuns?|painters?|coders?|grocers?|interns?|registrars?|' +
  'paramedics?|sonographers?|families|new hires?|insurance agents?|someone|anyone|fingers?|thumbs?|hands?|faces?|class|teams?|' +
  'cardiologists?|mail carriers?|toy makers?|apprentices?|electricians?|scouts?|wife|wives|husbands?';   // pass MF, the picture check
const PERSON = new RegExp(`\\b(${PEOPLE})\\b`, 'gi');
const ANIMALS = 'duck|ducks|ducklings?|hen|hens|bird|birds|cat|cats|dog|dogs|fox|foxes|cow|cows|calf|calves|horse|horses|foal|' +
  'sheep|lambs?|goat|goats|bear|bears|cubs?|deer|rabbit|rabbits|frog|frogs|fish|whale|whales|owl|owls|pig|pigs|elephant|' +
  'elephants|lion|lions|wolf|wolves|bee|bees|ant|ants|turtle|turtles|penguin|penguins|seal|seals|monkey|monkeys|mouse|mice|' +
  'squirrel|squirrels|swan|swans|goose|geese|chicken|chickens|chicks?|robin|robins|spider|spiders|snail|snails|butterfly|' +
  'butterflies|beaver|beavers|otter|otters|koala|koalas|kangaroo|kangaroos|puppy|puppies|kitten|kittens|hamsters?';
const ANIMAL_AFTER = new RegExp(`^\\s+(of\\s+)?(an?\\s+)?(${ANIMALS})\\b`, 'i');
const CLOCK_HAND = /\b(short|long|hour|minute|second|big|little)\s+(dark\s+|black\s+|thin\s+|red\s+)?$/i;
const BODY_AFTER = /^['’]s\s+(\w+\s+){0,2}(hands?|fingers?|thumbs?|toes|feet|foot|face|faces|arms?|legs?|knees?|shoulders?|head|hair|eyes|nose|mouth|ears?|lap|palms?|smile|cheeks?|wrists?)\b/i;
export function hasPerson(subject) {
  const text = subject.replace(/\b(labeled|marked|sorted|grouped) by \w+/gi, '');
  const clock = /\bclocks?\b|\bwatch(es)?\b/i.test(text);
  for (const m of text.matchAll(PERSON)) {
    const w = m[0].toLowerCase(); const after = text.slice(m.index + m[0].length); const before = text.slice(0, m.index);
    // A mother duck, its family, a baby bird: an animal's.
    if (/^(mother|father|family|mom|dad|parents?|baby|babies)$/.test(w) && (ANIMAL_AFTER.test(after) || /\bits\s+$/i.test(before))) continue;
    // A family kitchen or a family photo: no one in it.
    if (w === 'family' && /^\s+(kitchen|log|photo|photos|tree|room|car|recipe|farm|business|name|garden|home|house)\b/i.test(after)) continue;
    // A class or a team doing something counts; a class garden, a team name or vowel teams do not.
    if (w === 'class' && !/^(\s+(\w+ing|at|with|of|on|in|ready)\b|\s*[,.]|\s*$)/i.test(after)) continue;
    if (/^teams?$/.test(w) && !/^\s+(\w+ing|at|with|of|on|in|ready)\b/i.test(after)) continue;
    // A clock's hands, and hand-drawn or by hand.
    if (/^hands?$/.test(w) && (CLOCK_HAND.test(before) || (clock && /\b(two|its|both|the clock's|with)\s+$/i.test(before)) || /^-/.test(after) || /\bby\s+$/i.test(before))) continue;
    // A word joined to the next by a hyphen names a thing, not a person (a child-sized plate, a man-made lake; pass MF, the
    // picture check's second read: P62's plate drew a hands sentence).
    if (/^-\w/.test(after)) continue;
    // A person's thing is not a person (a grown-up's big shoe), though a person's hand, toes or face is.
    if (/^['’]s\b/.test(after) && !BODY_AFTER.test(after)) continue;
    if (/^neighbors?$/.test(w) && /\bits\s+$/i.test(before)) continue;
    // A face is a person's only when it is his, her or their face.
    if (/^faces?$/.test(w) && !/\b(his|her|their|your|someone's|person's)\s+$/i.test(before)) continue;
    return true;
  }
  return false;
}

// The words of a ledger prompt that say what the picture is not ("no lily flowers", "not touching it"). Google's guide for the model
// asks for what the picture is instead ("empty street" instead of "no cars"), so the ledger test holds the number of such prompts
// as a ceiling that only falls: the picture check rewrites them as it reads each grade's rows (EARMARKS A13).
export function saysNot(prompt) {
  const body = String(prompt).replace(/\s*Character: [C\d, ]+\.\s*$/, '');
  const m = body.match(/[^,.]*\b(no|not|never|without)\b[^,.]*/i);
  return m ? m[0].trim() : null;
}

// The prompt for Nano Banana 2 and the character sheets its note named.
export function foldPrompt(prompt, negative) {
  const bans = String(negative || '').split(',').map((x) => x.trim()).filter(Boolean);
  const has = (x) => bans.includes(x);
  const note = /\s*Character: ([C\d, ]+)\.\s*$/.exec(prompt);
  const body = note ? prompt.slice(0, note.index).trim() : prompt.trim();
  const subject = body.split(/\s*Style:/)[0];
  const out = [];
  // Writing. A letter page keeps its two letters, and a picture whose bans leave letters out keeps the letters its scene names.
  // A coloring page tells its scene in outlines, everything else in shapes and color.
  const told = LINE_ART.some(has) ? 'telling everything through clean outlines' : 'telling everything through shapes and color';
  if (has('text other than the two letters')) out.push('The only marks on the page are the two letters themselves.');
  else if (has('text') || has('letters')) out.push(`The picture is wordless, ${told}.`);
  else if (WRITING.some(has)) out.push(`Apart from the letters the scene names, the picture is wordless, ${told}.`);
  // Line art for coloring pages.
  if (LINE_ART.some(has)) out.push('It is crisp black outline art on pure white, every shape left empty and white for coloring.');
  const lines = [has('jagged lines') && 'smooth', has('broken outlines') && 'unbroken and closed'].filter(Boolean);
  if (lines.length) out.push(`Every outline is ${lines.join(', ')}.`);
  if (has('tiny details')) out.push('The shapes are big and simple, large enough for a small child to color.');
  if (has('crowded scene')) out.push('The scene is roomy, with space around each thing.');
  if (has('background scenery')) out.push('The background is plain white.');
  // Quality and people.
  if (has('blurry')) out.push('Every edge is sharp and clean.');
  const person = hasPerson(subject);
  if (HANDS.some(has) && person) out.push('Hands have five fingers, and bodies look natural.');
  if (has('photorealistic skin') && person) out.push('Skin is smooth and stylized like the rest of the illustration.');
  if (has('photorealism')) out.push('Every part of it is a drawn illustration.');
  // Maps and the sun.
  // A continent keeps its islands (National Geographic: a continent usually includes the islands associated with it), so the
  // sentence names the natural features rather than calling the land unbroken (the accuracy check's second read, pass MC).
  if (MAP_BANS.some(has)) out.push('The land shows only natural features, such as coastlines, islands, mountains, lakes and rivers.');
  if (has('sun')) out.push('The sunlight comes from beyond the edge of the picture.');
  for (const [ban, sentence] of Object.entries(ONE_PAGE)) if (has(ban) && sentence) out.push(sentence);
  // Anything else, word for word.
  const rest = bans.filter((x) => !KNOWN.has(x));
  if (rest.length) out.push(`Do not include: ${rest.join(', ')}.`);
  return { prompt: [body, ...out].join(' '), sheets: note && person ? note[1].trim() : '', note: note ? note[1].trim() : '', bans, unknown: rest, person };
}

// Every ledger row, planned rows and tries alike, as [serial, where, scene, prompt, negative, status].
export function ledgerRows(ledger) {
  const rows = [];
  for (const line of ledger.split('\n')) {
    // A row under Images to try (pass LZ) goes in under its serial with its own status (Try), so a Leonardo session sees the
    // hoped-for version of a picture under the same serial as the planned one.
    const m = /^\| ((?:CS|[A-Z])\d+) \| (.*?) \| (.*?) \| (.*?) \| (.*?) \| (\w+) \|$/.exec(line)
      || /^\| Try ((?:CS|[A-Z])\d+) \| (.*?) \| (.*?) \| (.*?) \| (.*?) \| (\w+) \|$/.exec(line);
    if (m) { rows.push(m.slice(1)); continue; }
    // A character sheet's row has no where column (| C1 | Mike, age 4 | prompt | negative | status |); since pass MC it is listed
    // too, as a character sheet, since the sheets are painted in the same Leonardo sessions and need their bans folded as well.
    const c = /^\| (C\d+) \| (.*?) \| (.*?) \| (.*?) \| (\w+) \|$/.exec(line);
    if (c) rows.push([c[1], 'character sheet', c[2], c[3], c[4], c[5]]);
  }
  return rows;
}

// The pictures EARMARKS A6 lists, which depend on drawn letters, words or numerals and wait to be planned around things.
export function replanSerials(earmarks) {
  const at = earmarks.indexOf('A6, by course and module'); if (at < 0) return new Set();
  const end = earmarks.indexOf('\n## ', at);
  return new Set([...earmarks.slice(at, end < 0 ? undefined : end).matchAll(/\b(?:CS|S|P|D)\d+\b/g)].map((m) => m[0]));
}

// The spreadsheet as text, the header and one line per ledger row (the ledger test compares the file with it).
export function csvText(ledger, earmarks = '') {
  const cell = (t) => '"' + String(t).replace(/"/g, '""') + '"';
  const replan = replanSerials(earmarks);
  const out = [['serial', 'where', 'scene', 'prompt for Nano Banana 2 (bans folded in)', 'character sheets to attach', 'bans (already in the prompt)', 'status'].map(cell).join(',')];
  for (const [serial, where, scene, prompt, negative, status] of ledgerRows(ledger)) {
    const f = foldPrompt(prompt, negative);
    out.push([serial, where, scene, f.prompt, f.sheets, negative, replan.has(serial) && status === 'Needed' ? 'Re-plan first (A6)' : status].map(cell).join(','));
  }
  return out.join('\n');
}

// The spreadsheet, when run on its own (the name check works from a folder with a space in its path, as iCloud Drive's has).
if (process.argv[1] && process.argv[1].endsWith('prompts-csv.mjs')) console.log(csvText(readFileSync('docs/ART-REQUESTS.md', 'utf8'), readFileSync('docs/EARMARKS.md', 'utf8')));
