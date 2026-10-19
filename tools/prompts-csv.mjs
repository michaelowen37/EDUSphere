// The Wise Human. Copyright (c) 2026. Source-available; not for reuse. See LICENSE.md.
// The art ledger as a spreadsheet for Leonardo sessions (2026-09-23, Mikey): one row per serial with the serial, where it goes,
// the scene, the prompt to paste, the character sheets to attach, the bans and the status. Since pass MK the rows come in the
// order Mikey paints them, with the model, the settings and each character reference's name (generationOrder, below).
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
// Since pass ML two of Mikey's answers live here too. Q42, "relax it for scene words only, from grade 3 up.": a picture from
// grade 3 up may carry a few large words that belong to its scene (a sign, a shop's name, a book's cover, a jersey), written in
// its prompt in double quotes and spelled out in its check note; its bans say 'text other than the scene words', and the fold
// names those words as the only writing (SCENE_WORDS_BAN, sceneWords). Q44, "run the trial, then move them if they pass": five
// coloring pages are painted first on Nano Banana 2.1 and on Lucid Origin, and the coloring pages move to Lucid Origin, painted
// last, unless the trial fails (COLORING_TRIAL, modelFor, trialRows).
// Run: node tools/prompts-csv.mjs > docs/LEONARDO-PROMPTS.csv
import { readFileSync } from 'node:fs';
import { MODULES, getCourse, GRADES, gradeLabel, MAPS } from '../src/logic.mjs';
import { levelOf } from './coloring-levels.mjs';

// The bans the ledger uses, grouped, each group with the sentence that says it.
const WRITING = ['text', 'words', 'letters', 'labels', 'numbers', 'logos', 'watermark', 'signature'];
const HANDS = ['extra fingers', 'extra limbs', 'deformed hands'];
const LINE_ART = ['shading', 'gray fill', 'color', 'gradients'];
const MAP_BANS = ['borders', 'country lines', 'state lines', 'roads', 'cities', 'flags'];
// Bans a single page carries, each with its own sentence (the flower page D4, the rocket D5, the butterfly D6), said as what the
// page shows: these pages stand in for things that questions ask about, so a stray flower or star matters.
const ONE_PAGE = { 'many flowers': 'This single flower is the only one on the page.', bouquet: null, stars: 'The sky is clear apart from the round moon.', flowers: 'The only plants are the leafy bush and the grass.' };
// Scene words (Mikey's answer to Q42, pass ML: "relax it for scene words only, from grade 3 up."). In plain terms: a picture
// for grade 3 or older may show a few large words that belong to its scene, such as the words on a shop's sign, a book's cover
// or a jersey. The prompt writes each one in double quotes, the way Leonardo's prompt guide asks for words in a picture (short,
// under about 25 characters), and the scene's check note spells it out, so the painting is read letter by letter before it is
// saved and painted again if a letter is wrong. Such a row's bans say this instead of 'text, words, letters'. A word that
// teaches, or that a question asks for (a letter in a reading lesson, a numeral, a count, a clock, a label on a diagram, a
// map's names), is never a scene word: the app draws it, where it is always right, can be read aloud and changes without
// repainting. Pre-K to grade 2 keep the old rule whole, since their lessons teach letters by their shapes to children learning
// to read. The ledger test holds every part of this.
export const SCENE_WORDS_BAN = 'text other than the scene words';
export const SCENE_WORDS_FROM = '3';   // the first grade whose pictures may carry scene words
// The words a prompt puts in double quotes, in order (only scene words are ever quoted in a prompt).
export const sceneWords = (text) => [...String(text).matchAll(/"([^"]+)"/g)].map((m) => m[1]);
// A list said as people say it: "A", "A and B", "A, B and C".
const listOf = (xs) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);
const KNOWN = new Set([...WRITING, ...HANDS, ...LINE_ART, ...MAP_BANS, ...Object.keys(ONE_PAGE), 'blurry', 'photorealistic skin', 'photorealism', 'jagged lines', 'broken outlines', 'tiny details', 'crowded scene', 'background scenery', 'sun', 'text other than the two letters', 'extra letters', SCENE_WORDS_BAN]);
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
    if (/^hands?$/.test(w) && (CLOCK_HAND.test(before) || (clock && /\b(two|its|both|the clock's|with)\s+(dark\s+|black\s+|thin\s+|red\s+)?$/i.test(before)) || /^-/.test(after) || /\bby\s+$/i.test(before))) continue;
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
  // A scene word (Q42): the quoted words are the only writing, spelled as quoted, and the rest stays wordless.
  else if (has(SCENE_WORDS_BAN)) out.push(`The only writing in the picture is ${listOf(sceneWords(subject).map((w) => `"${w}"`))}, spelled exactly so in large, plain letters.`, `The rest of the picture is wordless, ${told}.`);
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
  // A head-and-shoulders portrait (the Wonder voices, pass MH) shows no hands, so naming hands would only invite them in.
  const portrait = /head-and-shoulders/i.test(subject);
  if (HANDS.some(has) && person) out.push(portrait ? 'The head and shoulders look natural.' : 'Hands have five fingers, and bodies look natural.');
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
  return { prompt: [body, ...out].join(' '), sheets: note && person ? note[1].trim() : '', note: note ? note[1].trim() : '', bans, unknown: rest, person, words: has(SCENE_WORDS_BAN) ? sceneWords(subject) : [] };
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

// Generation day (Mikey, pass MK, October 18, 2026, for after the standards review): "I think we can create a \"character
// reference\" image and reuse that image for all future images pertaining to that particular character ... You can give each
// version of Mike a serial number like Mike - 1, Mike - 2, Mike -3 and Mike-4 ... If a scene has multiple core characters, label
// it with all appropriate reference images that would be needed.", "Let's group all of the core characters in a way that allows
// me to generate all images for one particular character before moving to the next character so I can keep my focus and not
// jump back and forth between characters.  Then, we can order the rest by grade so I can start at prek and work up." and "Can
// you identify the specific model in our spreadsheet of prompts for each image too?" In plain terms: the spreadsheet lists the
// pictures in the order he paints them, says which model and settings each takes, and names each character reference by its
// person and number. docs/LEONARDO-BRIEF.md (Generation day) has the whole plan.
//
// The cast in the order their pictures come, and each character sheet's reference name: one reference for each chapter of
// docs/CHARACTERS.md's clock the person appears in, numbered in age order. The numbers of references still to be made are kept
// for them (the brief lists them: Mike - 2, 3 and 5, Chloe - 3 and 5, Frederick - 2 and 5, Georgette - 2 and 4, Savanah - 1
// and 4), so a name never changes once given.
export const CAST_ORDER = ['Mike', 'Chloe', 'Frederick', 'Georgette', 'Savanah', 'Jaxon', 'Harlow'];
export const REFERENCE_NAMES = { C1: 'Mike - 1', C2: 'Mike - 4', C12: 'Chloe - 1', C3: 'Chloe - 2', C4: 'Chloe - 4', C13: 'Frederick - 1', C5: 'Frederick - 3', C6: 'Frederick - 4', C14: 'Georgette - 1', C11: 'Georgette - 3', C7: 'Savanah - 2', C8: 'Savanah - 3', C9: 'Jaxon - 1', C10: 'Harlow - 1' };
export const personOf = (sheet) => (REFERENCE_NAMES[sheet] ? REFERENCE_NAMES[sheet].split(' - ')[0] : null);
export const referenceLabel = (sheet) => (REFERENCE_NAMES[sheet] ? `${REFERENCE_NAMES[sheet]} (${sheet})` : sheet);
// The model every picture is made with (Mikey: "After I created the text above, I saw that there is now a Nano Banana 2.1 so
// that is the one I would use over Nano Banana 2"), one model for the whole set as the brief's rule 2 keeps it, and the settings
// by kind of picture in the app's own words, from Mikey's screenshots of Nano Banana 2.1's panel (pass MK): Image Dimensions
// 16:9, 1:1, 9:16 or Custom (so 4:3 and 3:2 are Custom; the story pages show every painting at 4:3, cropped to fill), at Small
// 1024, Medium 2048 or Large 4096; Style, which starts on Dynamic, set to None; Prompt Enhance, which starts on Auto, set to
// Off ("Prompts will not be modified"); Number of generations, one to four, five to eight on a paid plan; Private Mode On, a paid
// plan's switch, since with it off Leonardo's help page says "generations will be visible to the public". Leonardo's documentation adds up to
// six references, each at Low, Mid or High, and ten aspect ratios. A newer model on generation day is one edit here.
export const MODEL = 'Nano Banana 2.1';
// The coloring pages' model (Mikey's answer to Q44, pass ML: "run the trial, then move them if they pass"). In plain terms: a
// coloring page is black outlines on white and shares no look with the paintings, so it can come from Leonardo's own Lucid
// Origin, which Relaxed Generation keeps painting once every token, the rollover bank too, is spent; Nano Banana 2.1 always
// spends tokens. So five pages are painted first on both models, side by side (TRIAL_PAGES, one each for pre-K 3, pre-K 4,
// kindergarten and grade 2, chosen for a round shape that must close, a page that stands in for a thing, a count, fine detail
// with people and coins, and the letters A and a), and a page passes on Lucid Origin when every outline is clean and closed
// and nothing extra is on the page (docs/LEONARDO-BRIEF.md, The coloring trial). If they pass, every coloring page moves to
// Lucid Origin and is painted last, level by level, each with its level's approved trial page as a Style Reference so the
// outlines stay alike. COLORING_TRIAL holds the outcome, one for the scene pages (D and G) and one for the letter pages (L),
// since a letter's exact shape is a risk of its own: 'waiting' until Mikey reports the trial, then 'passed' or 'failed'; a
// kind that fails goes back to Nano Banana 2.1 in its old place, by grade. Changing one word here moves the whole spreadsheet.
export const COLORING_MODEL = 'Lucid Origin';
export const COLORING_TRIAL = { pages: 'waiting', letters: 'waiting' };
export const TRIAL_PAGES = ['D40', 'D5', 'D90', 'D140', 'L1'];
// The approved trial page each level's pages attach as a Style Reference (grade 1's first approved page serves grade 1).
export const TRIAL_REFERENCE = { PK3: 'D40', PK4: 'D5', K: 'D90', 2: 'D140', L: 'L1' };
export const coloringKind = (serial) => (/^L\d/.test(serial) ? 'letters' : /^[DG]\d/.test(serial) ? 'pages' : null);
// Whether a picture is a coloring page painted on Lucid Origin, last: yes until its kind's trial fails.
export const onLucid = (serial) => { const k = coloringKind(serial); return k ? COLORING_TRIAL[k] !== 'failed' : false; };
// The model a picture is made with, in the spreadsheet's words.
export function modelFor(serial) {
  const k = coloringKind(serial);
  if (!k || COLORING_TRIAL[k] === 'failed') return MODEL;
  return COLORING_TRIAL[k] === 'passed' ? COLORING_MODEL : `${COLORING_MODEL}, or ${MODEL} if the trial fails`;
}
// A coloring page's level for the Style Reference: its lesson's grade or its place in Let's Color, and L for a letter page.
const pageLevel = (serial, page) => (/^L\d/.test(serial) ? 'L' : levelOf(serial, page));
const RATIOS = [[1, 1], [2, 3], [3, 2], [3, 4], [4, 3], [4, 5], [5, 4], [9, 16], [16, 9], [21, 9]];
const nearestRatio = (w, h) => RATIOS.reduce((best, r) => (Math.abs(Math.log(r[0] / r[1] / (w / h))) < Math.abs(Math.log(best[0] / best[1] / (w / h))) ? r : best)).join(':');
const dimsFor = (ratio) => `${['16:9', '1:1', '9:16'].includes(ratio) ? ratio : `Custom ${ratio}`}, Medium`;   // a preset, or Custom
export function settingsFor(serial, refs = [], box = null, page = '') {
  const base = 'Style None, Prompt Enhance Off, Private Mode On';
  // A coloring page on Lucid Origin (Q44): Leonardo's page for the model lists Style None, Prompt Enhance, a Generation mode of
  // Fast or Ultra, and one Style Reference, with no negative prompt, so the folded prompt is pasted as it is; the page attaches
  // its level's approved trial page so the outlines of a level stay alike.
  if (onLucid(serial)) {
    const ref = TRIAL_REFERENCE[pageLevel(serial, page)];
    const look = ref ? `the approved ${ref} as a Style Reference at Mid` : 'the first approved page of its level as a Style Reference at Mid';
    return `${dimsFor('1:1')}, ${base}, Generation mode Fast, 4 generations; ${look}, so the outlines of a level stay alike`;
  }
  if (/^C\d/.test(serial)) return `${dimsFor('3:2')}, ${base}, 4 generations; once a person's first reference is approved, it is attached at High to make the others, so the person keeps one face, and the set's first approved reference goes at Mid on every other person's, so all seven share one look`;
  if (/^U\d/.test(serial)) return `${dimsFor('1:1')}, ${base}, 2 generations; the person's reference at High, and once one portrait passes, that portrait at Mid for the other three, since an approved painting would pull a flat portrait back to 3D`;
  if (/^(D|L|G)\d/.test(serial)) return `${dimsFor('1:1')}, ${base}, 4 generations`;
  if (/^M\d/.test(serial)) { const [w, h] = box ? [box[2] - box[0], box[3] - box[1]] : [1, 1]; return `${dimsFor(nearestRatio(w, h))}, ${base}, 2 generations, cropped to the map's own box (${w} by ${h} in MAPS) before its hit areas are traced`; }
  const look = 'one approved painting at Mid for the look';
  return refs.length ? `${dimsFor('4:3')}, ${base}, 2 generations; ${refs.length > 1 ? 'the references' : 'the reference'} at High, and ${look}` : `${dimsFor('4:3')}, ${base}, 2 generations; ${look}`;
}
// A picture's grade, from where it goes: a lesson or its coloring page (lesson-<module>), a module's story, or a course's long
// story; null for a Let's Color drawing or letter page, a map, the star and the Wonder portraits.
export function gradeOfWhere(where) {
  const id = String(where).replace(/^lesson-/, ''); const m = MODULES.find((x) => x.id === id);
  const c = m ? getCourse(m.courseId) : getCourse(id); return c ? c.grade : null;
}
// The order Mikey paints in: each person's references, then the pictures with that person alone, person by person in
// CAST_ORDER; then the pictures with two or more of the cast; then everything else by grade from pre-K 3 up; last, what has
// no grade (the Let's Color drawing and letter pages, the maps, the star). Within a group, by grade and then ledger order.
// Since pass ML (Q44) the coloring pages painted on Lucid Origin come after everything else, level by level from pre-K 3 to
// grade 2 and then the letter pages, since Relaxed Generation covers them only once the tokens are spent; and the group of
// pictures with no grade is named for what is left in it.
export const COLORING_LEVEL_ORDER = ['PK3', 'PK4', 'K', '1', '2', 'L'];
export function coloringGroupName() {
  const kinds = Object.keys(COLORING_TRIAL).filter((k) => COLORING_TRIAL[k] !== 'failed');
  const what = kinds.length === 2 ? 'Coloring and letter pages' : kinds[0] === 'letters' ? 'Letter pages' : 'Coloring pages';
  return `${what} on ${COLORING_MODEL}, painted last${kinds.some((k) => COLORING_TRIAL[k] === 'waiting') ? ' once the trial passes' : ''} (Q44)`;
}
export function noGradeGroupName() {
  const left = [COLORING_TRIAL.pages === 'failed' && "Let's Color drawing pages", COLORING_TRIAL.letters === 'failed' && 'letter pages', 'maps', COLORING_TRIAL.pages === 'failed' && 'the star'].filter(Boolean);
  return left.length === 1 ? 'No grade: the maps' : `No grade: ${listOf(left)}`;
}
export function generationOrder(rows) {
  const people = (r) => [...new Set(r.refs.map(personOf).filter(Boolean))];
  const gradeAt = (r) => { const i = GRADES.indexOf(String(r.grade)); return i < 0 ? GRADES.length : i; };
  const keyed = rows.map((r) => {
    if (onLucid(r.serial)) return { r, g: 2 * CAST_ORDER.length + 3, sub: COLORING_LEVEL_ORDER.indexOf(pageLevel(r.serial, r.where)), group: coloringGroupName() };
    const self = /^C\d/.test(r.serial) ? personOf(r.serial) : null; const who = people(r);
    if (self) return { r, g: 2 * CAST_ORDER.indexOf(self), sub: Number(REFERENCE_NAMES[r.serial].split(' - ')[1]), group: `${self}: references` };
    if (who.length === 1) return { r, g: 2 * CAST_ORDER.indexOf(who[0]) + 1, sub: gradeAt(r), group: who[0] };
    if (who.length > 1) return { r, g: 2 * CAST_ORDER.length, sub: gradeAt(r), group: 'Two or more of the cast' };
    return { r, g: 2 * CAST_ORDER.length + (r.grade ? 1 : 2), sub: gradeAt(r), group: r.grade ? gradeLabel(r.grade) : noGradeGroupName() };
  });
  return keyed.sort((a, b) => a.g - b.g || a.sub - b.sub || a.r.at - b.r.at);
}

// The trial's rows (Q44): each of TRIAL_PAGES whose kind is still waiting, once on each model, in the order the pages are listed.
export const TRIAL_GROUP = 'Coloring trial (Q44): five pages on Nano Banana 2.1 and on Lucid Origin, painted first and compared';
export function trialRows(rows) {
  const none = 'no reference, so the two models are compared on the words alone';
  return TRIAL_PAGES.filter((s) => COLORING_TRIAL[coloringKind(s)] === 'waiting').flatMap((s) => {
    const r = rows.find((x) => x.serial === s); if (!r) return [];
    return [{ r, group: TRIAL_GROUP, model: MODEL, settings: `${dimsFor('1:1')}, Style None, Prompt Enhance Off, Private Mode On, 4 generations; ${none}`, status: 'Trial' },
      { r, group: TRIAL_GROUP, model: COLORING_MODEL, settings: `${dimsFor('1:1')}, Style None, Prompt Enhance Off, Private Mode On, Generation mode Fast, 4 generations; ${none}`, status: 'Trial' }];
  });
}
// The spreadsheet as text, the header and one line per ledger row in generationOrder, after the trial's rows (the ledger test
// compares the file with it).
export function csvText(ledger, earmarks = '') {
  const cell = (t) => '"' + String(t).replace(/"/g, '""') + '"';
  const replan = replanSerials(earmarks);
  const boxOf = (serial) => { const m = Object.values(MAPS).find((x) => x.art === serial); return m ? m.box : null; };
  const rows = ledgerRows(ledger).map(([serial, where, scene, prompt, negative, status], at) => {
    const f = foldPrompt(prompt, negative); const refs = (f.sheets || '').split(/[,\s]+/).filter(Boolean);
    return { serial, where, scene, prompt: f.prompt, negative, refs, at, grade: gradeOfWhere(where), status: replan.has(serial) && status === 'Needed' ? 'Re-plan first (A6)' : status };
  });
  const out = [['order', 'group', 'serial', 'reference name', 'where', 'grade', 'scene', 'model', 'settings', 'references to attach', 'prompt (bans folded in)', 'bans (already in the prompt)', 'status'].map(cell).join(',')];
  // The coloring trial (Q44) comes first, while its outcome is waiting: each trial page twice, on Nano Banana 2.1 and then on
  // Lucid Origin, with no reference, so the two models are compared on the words alone. Its pages are not listed again later.
  const trial = trialRows(rows);
  const later = generationOrder(rows.filter((r) => !trial.some((t) => t.r === r)));
  [...trial, ...later].forEach(({ r, group, model, settings, status }, k) => {
    out.push([k + 1, group, r.serial, REFERENCE_NAMES[r.serial] || '', r.where, r.grade ? gradeLabel(r.grade) : '', r.scene, model || modelFor(r.serial), settings || settingsFor(r.serial, r.refs, boxOf(r.serial), r.where), r.refs.map(referenceLabel).join(', '), r.prompt, r.negative, status || r.status].map(cell).join(','));
  });
  return out.join('\n');
}

// The spreadsheet, when run on its own (the name check works from a folder with a space in its path, as iCloud Drive's has).
if (process.argv[1] && process.argv[1].endsWith('prompts-csv.mjs')) console.log(csvText(readFileSync('docs/ART-REQUESTS.md', 'utf8'), readFileSync('docs/EARMARKS.md', 'utf8')));
