import { readFileSync } from 'node:fs';
// Tests for src/logic.mjs.  Run:  node tests/logic.test.mjs
// Any model (or person) can read PASS/FAIL lines below without knowing React.
import * as L from '../src/logic.mjs';
import { briefNews, recentNews, newestNews } from '../tools/whats-new.mjs'; // What's new short notes and history (pass HL)

let pass = 0, fail = 0;
// The choice token a shown shape picture would have (pass MB): Circle and Square's same-shape kind must offer another look.
const csTokenOf = (v) => (v && v.kind === 'shape' ? (v.variant ? `shape:${v.name}~${v.variant}` : `shape:${v.name}`) : '');
const ok = (label, cond, detail = '') => { console.log((cond ? 'PASS' : 'FAIL') + ' - ' + label + (cond ? '' : '  ' + detail)); cond ? pass++ : fail++; };
const val = (s) => { const [n, d] = s.split('/').map(Number); return n / d; }; // independent fraction value

// ---- 1. Every generator produces valid, correct questions across many seeds ----
const whenAnswers = new Map(); // event story -> the years it has been answered with, across every course
// The parts of a picture that only lay it out (pass MA): a frame, a snap, a gap, a stack and a cell size in pixels, taken out
// of every part of the picture (a pair's halves, a row's items, anything nested), so only what is drawn is left.
const LAYOUT_KEYS = ['frame', 'snap', 'gap', 'stack'];
const layoutFree = (v) => (Array.isArray(v) ? v.map(layoutFree) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).filter(([k, x]) => !LAYOUT_KEYS.includes(k) && !(k === 'size' && typeof x === 'number')).map(([k, x]) => [k, layoutFree(x)])) : v);
// The pre-K 3 kinds whose questions say why each wrong choice does not fit (pass MH): every kind the two pre-K 3 courses use,
// read from their own module lists, so a kind added to either course is held to it at once (the checks are near the other
// pre-K 3 checks below; a tracing kind has no choices and is passed over there).
const P3_NOTED = new Set(L.COURSES.filter((c) => ['very-first-steps-pk3', 'listen-and-point-pk3', 'first-steps-pk', 'first-sounds-pk'].includes(c.id)).flatMap((c) => c.modules.flatMap((m) => m.generators)));   // First Steps since pass ML, First Sounds and Letters since pass MM (EARMARKS L10)
const WN_BAD = []; const WN_KINDS = new Set();   // what those checks found, and the kinds they read, for their own line after the loop
// The pre-K banks (pass MM): every generator a pre-K 3 or pre-K 4 lesson deals from. Each is read on mutants too, and on more seeds.
const PREK_BANKS = new Set(L.COURSES.filter((c) => c.grade === 'PK3' || c.grade === 'PK4').flatMap((c) => c.modules.flatMap((m) => m.generators)));
// A mutant (pass MM): the same question with a wrong answer key. A choice question takes each wrong choice in turn as its answer,
// that choice's More Info row moving to the old answer so More Info's shape stays whole; a tracing names another shape of its
// family. The words, pictures and explanation stay as generated, so only a check that works the answer out again catches it.
const mutantsOf = (q) => {
  if (q.type === 'choice' && Array.isArray(q.choices)) return q.choices.filter((c) => c !== q.answer).map((w) => {
    const m = { ...q, answer: w }; if (q.whyNot && typeof q.whyNot === 'object') { const wn = { ...q.whyNot }; const moved = wn[w]; delete wn[w]; wn[q.answer] = moved; m.whyNot = wn; } return m; });
  if (q.type === 'trace') { const fam = (k) => (/^\d$/.test(k) ? 'num' : /^[A-Z]$/.test(k) ? 'upper' : /^[a-z]$/.test(k) ? 'lower' : /^(line|shape)-/.test(k) ? k.split('-')[0] : 'picture');
    const alt = Object.keys(L.TRACE_LETTERS).find((k) => k !== q.answer && fam(k) === fam(q.answer)); return alt ? [{ ...q, answer: alt }] : []; }
  if (q.type === 'number') return [{ ...q, answer: String(Number(q.answer) + 1) }];
  // A direction of steps (pass MO): its steps backward, and its first step swapped for a picture that is not a step.
  if (q.type === 'order' && q.pick) { const s = String(q.answer).split(' | '); const other = (q.items || []).find((x) => !s.includes(x));
    return [[...s].reverse().join(' | '), ...(other ? [[other, ...s.slice(1)].join(' | ')] : [])].map((answer) => ({ ...q, answer })); }
  return [];
};
const PREK_UNCAUGHT = new Map(); let prekMutants = 0; let prekQuestions = 0; const PREK_SEEDS = new Map();
// The pre-K banks no check below worked out again until pass MM, each answer derived here from what the child sees and hears. A
// choice's token is what draws it (shape:square:big is the big square, item:circle-red the red circle), so reading the size or
// color from the token reads the drawing. Helpers, tools, good choices and turns come from First Steps' own lessons.
const lessonWords = (id) => { const m = L.MODULES.find((x) => x.id === id); return m ? [...m.lesson.paragraphs, ...m.lesson.script.map((l) => l.say)].join(' ').toLowerCase() : ''; };
const HELPER_KEYS = [['hose', 'Firefighter'], ['fires', 'Firefighter'], ['stethoscope', 'Doctor'], ['sick', 'Doctor'], ['whiteboard', 'Teacher'], ['school', 'Teacher'], ['mail truck', 'Mail carrier'], ['letters', 'Mail carrier'], ['street', 'Police officer']];
const onlyOne = (list) => (list.length === 1 ? list[0] : null);
const sizeOf = { biggest: 'big', smallest: 'small', 'middle-sized': 'medium', big: 'big', little: 'small' };
const lineOf = { 'a line across': 'line-across', 'a line down': 'line-down', 'a circle': 'line-circle', 'a zigzag': 'line-zigzag', 'a wavy line': 'line-wave' };
const sameAs = (q) => { const m = /^Tap the one that is the same as this (\w+)\.$/.exec(q.prompt); return m && q.visual && q.visual.name === m[1] ? onlyOne(q.choices.filter((c) => c === q.visual.kind + ':' + q.visual.name)) : null; };
const oddOne = (q) => (q.prompt === 'Find the two that are the same, then tap the one that is different.' ? onlyOne(q.choices.filter((c) => q.choices.filter((d) => d.split('#')[0] === c.split('#')[0]).length === 1)) : null);
// The tracing lessons' letters and each letter's lines as their spoken lines say them (pass MN, Q50), this test's own table.
const TRACED_P4 = { first: ['L', 'T', 'O'], more: ['I', 'H', 'E'], ltf: ['L', 'T', 'F'] };
const LINES_P4 = { L: 'goes down, then across the bottom', T: 'goes down the middle, then one line across the top', O: 'goes around to the left, all the way back to where it started', I: 'is one line, straight down', H: 'is two lines down, then a bridge across the middle', E: 'has a line down and three lines across', F: 'is a line down, then two lines across' };
// Pass MO: each animal's sound, and each grown-up's direction's steps in order, this test's own tables for Domain II's directions.
const MO_SAYS = { meow: 'cat', quack: 'duck', buzz: 'bee', ribbit: 'frog', hoot: 'owl', growl: 'bear' };
const MO_ROUTINES = { 'Get your hat, and then go to the door.': ['hat', 'door'], 'Get a book, and then sit in your chair.': ['book', 'chair'], 'Get your teddy, and then get into bed.': ['teddy', 'bed'], 'Get a cup, and then get a spoon.': ['cup', 'spoon'],
  'Get a cup, get a spoon, and then sit in your chair.': ['cup', 'spoon', 'chair'], 'Put your block away, get your hat, and then go to the door.': ['block', 'hat', 'door'], 'Get your hat, get your ball, and then go down the slide.': ['hat', 'ball', 'slide'], 'Get your book, get your teddy, and then get into bed.': ['book', 'teddy', 'bed'] };
const moRoutine = (q, places) => { const steps = MO_ROUTINES[(q.story || '').replace(/^Listen\. /, '')]; const at = places.indexOf((/^What do you do (first|second|last)\?$/.exec(q.prompt) || [])[1]);
  return steps && at >= 0 && steps.length === places.length && q.choices.length === steps.length && steps.every((x) => q.choices.includes(`icon:${x}`)) ? `icon:${steps[at]}` : null; };
// Domain II's vocabulary and pre-K 3's turns of a conversation (pass MQ, earmarks E12 and E13): the test's own tables, each written
// from the lessons' lines, never read from logic.mjs.
const MQ_PEOPLE = ['baby', 'teacher', 'doctor', 'grandma', 'grandpa'];
const MQ_WHO = { 'Who is very little and drinks milk from a bottle?': 'baby', 'Who helps children learn at school?': 'teacher', 'Who helps you get well when you are sick?': 'doctor', 'Who is the mom of your mom or your dad?': 'grandma', 'Who is the dad of your mom or your dad?': 'grandpa' };
const MQ_EVENT_WHAT = { 'What has candles to blow out at a birthday party?': 'cake', 'Where do you sleep at bedtime?': 'bed', 'What falls from the clouds on a rainy day?': 'rain', 'What falls on a snowy day?': 'snow', 'What does someone read to you at story time?': 'book', 'What can you play on at the park?': 'slide' };
const MQ_EVENT_TAP = { 'a birthday party': 'cake', bedtime: 'bed', 'a rainy day': 'rain', 'a snowy day': 'snow', 'story time': 'book', 'the park': 'slide' };
// Pictures a child could fairly tap for an event (pass MQ, round one's lesson check), so never offered as wrong: a bedtime story is
// read in bed, a book can be a birthday present, and rain and snow can fall in one storm.
const MQ_EVENT_ALSO = { bed: ['book'], book: ['bed'], cake: ['book'], rain: ['snow'], snow: ['rain'] };
const MQ_PEOPLE_YESNO = { 'Is a baby very little?': 'Yes', 'Is a baby a grown-up?': 'No', 'Is a grandma a grown-up?': 'Yes', 'Is a grandpa a grown-up?': 'Yes', 'Is a grandpa very little?': 'No', 'Does a doctor help you get well when you are sick?': 'Yes', 'Does a teacher help children learn at school?': 'Yes', 'Does a baby help children learn at school?': 'No' };
const MQ_SIDES = { 'Which shape has three sides?': 'triangle', 'Which shape has three corners?': 'triangle', 'Which shape has four sides?': 'square', 'Which shape has four corners?': 'square', 'Which shape has no corners?': 'circle' };
const MQ_TALK_LISTEN = { 'What can you do while your friend is talking?': 'Listen', 'Your friend is talking. When is it your turn to talk?': 'When your friend stops', 'How can you show your friend you are listening?': 'Nod and smile', 'Your friend is telling you about a puppy. What can you do?': 'Listen' };
const MQ_SAY_BACK = { 'Your friend says, I have a new puppy dog!': 'What is its name?', 'Your friend says, I made a tower!': 'I like your tower!', 'Your friend says, I went to the park!': 'What did you play?', 'Your friend says, I have a new hat!': 'I like your hat!' };
const MQ_TALK_YESNO = { 'Is it kind to talk at the same time as your friend?': 'No', 'Is it kind to wait until your friend stops talking?': 'Yes', 'Is it kind to listen while your friend talks?': 'Yes', 'Can you take turns talking with your teacher too?': 'Yes', "Is it kind to stand very close, right in your friend's face?": 'No', 'Is it kind to shout while your friend is talking?': 'No' };
const MQ_RHYME_END = { cat: 'at', hat: 'at', dog: 'og', log: 'og', frog: 'og', moon: 'oon', spoon: 'oon', bear: 'air', chair: 'air', sock: 'ock', block: 'ock', rock: 'ock', ball: 'all', wall: 'all' };
const MQ_MEANS = { 'Your teacher says, count the blocks.': 'Say one number for each block', 'Your teacher says, sort the blocks by color.': 'Put them into groups by color', 'Your teacher says, find a sock that matches.': 'Find a sock just like it', 'Your teacher says, trace the letter.': 'Go over its lines with your finger', 'Your teacher says, find a pair of socks.': 'Find two socks that match' };
const MQ_SHAPE_WORDS = { 'Which shape has three corners?': 'triangle', 'Which shape has no corners?': 'circle', 'Which shape has two long sides and two short sides?': 'rectangle', 'Which shape has four sides that are all the same length?': 'square' };
const MQ_GROUP = { 'pic:cat': 'animals', 'pic:duck': 'animals', 'pic:bear': 'animals', 'pic:owl': 'animals', 'pic:frog': 'animals', 'pic:fox': 'animals', 'icon:hat': 'clothes', 'icon:sock': 'clothes', 'icon:coat': 'clothes', 'icon:ball': 'toys', 'icon:teddy': 'toys', 'icon:block': 'toys', 'icon:tree': 'plants', 'icon:flower': 'plants', 'icon:cactus': 'plants', 'art:car': 'vehicles', 'art:train': 'vehicles', 'art:boat': 'vehicles', 'icon:bus': 'vehicles' };
const MQ_GROUP_ASK = { 'Which one is an animal?': 'animals', 'Which one is clothes, something you wear?': 'clothes', 'Which one is a toy?': 'toys', 'Which one is a plant?': 'plants', 'Which one is a vehicle?': 'vehicles' };
const MQ_OPPOSITE = { hot: 'cold', cold: 'hot', fast: 'slow', slow: 'fast', day: 'night' };
const MQ_IS = { 'icon:ice': ['cold'], 'icon:snow': ['cold'], 'icon:fire': ['hot'], 'icon:sun': ['hot', 'day'], 'art:rocket': ['fast'], 'art:car': ['fast'], 'pic:snail': ['slow'], 'pic:turtle': ['slow'], 'icon:moon': ['night'] };
const MQ_SAME_FACE = { glad: 'happy', angry: 'mad', afraid: 'scared' };
const MQ_GROUP_YESNO = { 'Do a hat and a sock go in the same group?': 'Yes', 'Do a cat and a ball go in the same group?': 'No', 'Do a tree and a flower go in the same group?': 'Yes', 'Do a bus and a coat go in the same group?': 'No', 'Are hot and cold opposites?': 'Yes', 'Are glad and happy opposites?': 'No', 'Are fast and slow opposites?': 'Yes', 'Do large and big mean the same?': 'Yes' };
const mqOne = (q, ok) => { const hits = (q.choices || []).filter(ok); return hits.length === 1 ? hits[0] : null; };
const PREK_DERIVE = {
  // Learning words (pre-K 3): the one just like the picture shown; the one not like the two alike; whether the counted row holds the
  // number asked; the one in the group's color; and the shape the lesson says has those sides or corners.
  'p3-learn-match': (q) => { const v = q.visual || {}; if (q.prompt !== 'Tap the one that matches this one.') return null; const want = v.kind === 'icon' ? `icon:${v.name}` : v.kind === 'item' ? `item:${v.shape}-${v.colour}` : null; return want && q.choices.includes(want) ? want : null; },
  'p3-learn-different': (q) => { if (q.prompt !== 'Tap the one that is different.') return null; const base = (c) => c.split('#')[0]; return mqOne(q, (c) => q.choices.filter((d) => base(d) === base(c)).length === 1); },
  'p3-learn-count': (q) => { const m = /^(?:Is|Are) there (one|two|three|four) (circle|square|triangle)s?\?$/.exec(q.prompt); const s = /^Count the (circle|square|triangle)s\.$/.exec(q.story || ''); const v = q.visual || {};
    if (!m || !s || m[2] !== s[1] || v.kind !== 'pattern' || !(v.items || []).every((x) => x === m[2])) return null; return ['one', 'two', 'three', 'four'].indexOf(m[1]) + 1 === v.items.length ? 'Yes' : 'No'; },
  'p3-learn-sort': (q) => { const m = /^Sort by color\. These (red|blue) ones are a group\.$/.exec(q.story || ''); return m && (q.visual || {}).colour === m[1] ? mqOne(q, (c) => new RegExp(`^item:[a-z]+-${m[1]}$`).test(c)) : null; },
  'p3-learn-sides': (q) => (MQ_SIDES[q.prompt] ? `shape:${MQ_SIDES[q.prompt]}` : null),
  // People and events (pre-K 3): a person by name and by what they do or are, an event's thing by what happens there and by the
  // event's name, yes or no about a person, and the one person among things.
  'p3-people-tap': (q) => { const m = /^Tap the (baby|teacher|doctor|grandma|grandpa)\.$/.exec(q.prompt); return m ? `icon:${m[1]}` : null; },
  'p3-people-who': (q) => (MQ_WHO[q.prompt] ? `icon:${MQ_WHO[q.prompt]}` : null),
  'p3-event-what': (q) => (MQ_EVENT_WHAT[q.prompt] ? `icon:${MQ_EVENT_WHAT[q.prompt]}` : null),
  'p3-event-tap': (q) => { const m = /^Tap the picture for (.+)\.$/.exec(q.prompt); const a = m && MQ_EVENT_TAP[m[1]];
    return a && !q.choices.some((c) => (MQ_EVENT_ALSO[a] || []).includes(c.replace(/^icon:/, ''))) ? `icon:${a}` : null; },
  'p3-people-yesno': (q) => MQ_PEOPLE_YESNO[q.prompt] || null,
  'p3-people-group': (q) => (q.prompt === 'Which one is a person?' ? mqOne(q, (c) => MQ_PEOPLE.includes(c.replace(/^icon:/, ''))) : null),
  // Talking with a friend (pre-K 3): what to do while a friend talks, whose turn by who just stopped, the reply about what was said,
  // hi or bye, and yes or no about each rule.
  'p3-talk-listen': (q) => MQ_TALK_LISTEN[q.prompt] || null,
  'p3-talk-turn': (q) => { const m = q.prompt === 'Whose turn is it now?' && /^You and (your friend|your teacher|Grandma) are taking turns talking, and (you|your friend|your teacher|Grandma) just stopped talking\.$/.exec(q.story || '');
    if (!m || !(m[2] === 'you' || m[2] === m[1])) return null; return m[2] === 'you' ? (m[1] === 'Grandma' ? "Grandma's turn" : `${m[1].charAt(0).toUpperCase()}${m[1].slice(1)}'s turn`) : 'Your turn'; },
  'p3-talk-say-back': (q) => (q.prompt === 'What can you say back?' ? MQ_SAY_BACK[q.story] || null : null),
  'p3-talk-hi-bye': (q) => ({ 'What can you say to start talking with a friend?': 'Hi!', 'What can you say when you are done talking?': 'Bye!' })[q.prompt] || null,
  'p3-talk-yesno': (q) => MQ_TALK_YESNO[q.prompt] || null,
  // More learning words (pre-K 4): the one that fits all three words, the one that rhymes with the group's word, what the teacher's
  // word asks, the one just like the picture shown, and the shape the lesson says has those sides or corners.
  'p4-learn-three': (q) => { const m = /^Tap the (small|big) (red|blue|yellow) (circle|square|triangle)\.$/.exec(q.prompt); return m ? `item:${m[3]}-${m[2]}-${m[1]}` : null; },
  'p4-learn-sort-rhyme': (q) => { const m = /^Which one goes in the group that rhymes with (\w+)\?$/.exec(q.prompt); const end = m && MQ_RHYME_END[m[1]]; const word = (c) => c.replace(/^(?:pic|icon):/, '');
    return end && (q.story || '').includes(`rhyme with ${m[1]},`) ? mqOne(q, (c) => MQ_RHYME_END[word(c)] === end) : null; },
  'p4-learn-means': (q) => (q.prompt === 'What do you do?' ? MQ_MEANS[q.story] || null : null),
  'p4-learn-pair': (q) => { const v = q.visual || {}; return q.prompt === 'Tap the one that makes a pair with this one.' && v.kind === 'item' ? `item:${v.shape}-${v.colour}` : null; },
  'p4-learn-shape-words': (q) => (MQ_SHAPE_WORDS[q.prompt] ? `shape:${MQ_SHAPE_WORDS[q.prompt]}` : null),
  // Words that go together (pre-K 4): the one in the group asked, the one whose group the other three do not share, the opposite way,
  // the face or size a word means, and yes or no about two words.
  'p4-group-which': (q) => { const g = MQ_GROUP_ASK[q.prompt]; return g ? mqOne(q, (c) => MQ_GROUP[c] === g) : null; },
  'p4-group-odd': (q) => (q.prompt === 'Which one does not go with the others?' && q.choices.length === 4 ? mqOne(q, (c) => q.choices.filter((d) => MQ_GROUP[d] === MQ_GROUP[c]).length === 1) : null),
  'p4-opposite': (q) => { const m = /^Tap the one that is the opposite of (hot|cold|fast|slow|day|big|small)\.$/.exec(q.prompt); if (!m) return null;
    if (m[1] === 'big' || m[1] === 'small') return mqOne(q, (c) => c.endsWith(m[1] === 'big' ? '-small' : '-big'));
    return mqOne(q, (c) => (MQ_IS[c] || []).includes(MQ_OPPOSITE[m[1]])); },
  'p4-same-meaning': (q) => { const f = /^Tap the face that looks (glad|angry|afraid)\.$/.exec(q.prompt); if (f) return `face:${MQ_SAME_FACE[f[1]]}`;
    const s = /^Tap the large (circle|square|triangle)\.$/.exec(q.prompt); return s ? mqOne(q, (c) => c.startsWith(`item:${s[1]}-`) && c.endsWith('-big')) : null; },
  'p4-group-yesno': (q) => MQ_GROUP_YESNO[q.prompt] || null,
  // Follow the directions and two ideas (pass MO, earmarks E12 and E13, Domain II part one): each answer from the words with this
  // test's own tables, the steps in the order the words say them, the step in the place a routine question asks, and what fits both
  // ideas of one sentence.
  'p3-steps-things': (q) => { const m = /^Tap the (\w+), and then tap the (\w+)\.$/.exec(q.prompt); return m ? `icon:${m[1]} | icon:${m[2]}` : null; },
  'p3-steps-sounds': (q) => { const m = /^Tap the one that says (\w+), and then tap the one that says (\w+)\.$/.exec(q.prompt); return m && MO_SAYS[m[1]] && MO_SAYS[m[2]] ? `pic:${MO_SAYS[m[1]]} | pic:${MO_SAYS[m[2]]}` : null; },
  'p3-steps-colors': (q) => { const m = /^Tap the (red|blue|yellow|green) one, and then tap the (red|blue|yellow|green) one\.$/.exec(q.prompt); const form = (/^item:(\w+)-/.exec((q.items || [])[0]) || [])[1];
    return m && form && q.items.every((x) => x.startsWith(`item:${form}-`)) && !(q.items.some((x) => x.endsWith('-red')) && q.items.some((x) => x.endsWith('-green'))) ? `item:${form}-${m[1]} | item:${form}-${m[2]}` : null; },
  'p3-steps-sizes': (q) => { const m = /^Tap the (big|little) (circle|square), and then tap the (big|little) (circle|square)\.$/.exec(q.prompt); const z = (w) => (w === 'little' ? 'small' : 'big'); return m ? `shape:${m[2]}:${z(m[1])} | shape:${m[4]}:${z(m[3])}` : null; },
  'p3-steps-routine': (q) => moRoutine(q, ['first', 'second']),
  'p4-steps-things': (q) => { const m = /^Tap the (\w+), then the (\w+), and then the (\w+)\.$/.exec(q.prompt); return m ? m.slice(1).map((x) => `icon:${x}`).join(' | ') : null; },
  'p4-steps-faces': (q) => { const m = /^Tap the (happy|sad|mad|scared) face, then the (happy|sad|mad|scared) face, and then the (happy|sad|mad|scared) face\.$/.exec(q.prompt); return m ? m.slice(1).map((x) => `face:${x}`).join(' | ') : null; },
  'p4-steps-shapes': (q) => { const m = /^Tap the (circle|square|triangle|long rectangle), then the (circle|square|triangle|long rectangle), and then the (circle|square|triangle|long rectangle)\.$/.exec(q.prompt); return m ? m.slice(1).map((x) => `shape:${x.replace('long ', '')}`).join(' | ') : null; },
  'p4-steps-sounds': (q) => { const m = /^Tap the one that says (\w+), then the one that says (\w+), and then the one that says (\w+)\.$/.exec(q.prompt); return m && m.slice(1).every((x) => MO_SAYS[x]) ? m.slice(1).map((x) => `pic:${MO_SAYS[x]}`).join(' | ') : null; },
  'p4-steps-routine': (q) => moRoutine(q, ['first', 'second', 'last']),
  'p3-ideas-looks': (q) => { const m = /^Listen\. It is (?:a (circle|square|triangle), and it is (red|blue|yellow|green)|(red|blue|yellow|green), and it is a (circle|square|triangle))\.$/.exec(q.story || ''); return m ? `item:${m[1] || m[4]}-${m[2] || m[3]}` : null; },
  'p3-ideas-sizes': (q) => { const m = /^Listen\. It is (?:a (circle|square|triangle), and it is (big|little)|(big|little), and it is a (circle|square|triangle))\.$/.exec(q.story || ''); return m ? `shape:${m[1] || m[4]}:${(m[2] || m[3]) === 'little' ? 'small' : 'big'}` : null; },
  'p3-ideas-who-has': (q) => { const m = /^Listen\. The (\w+) has a (\w+), and the (\w+) has a (\w+)\.$/.exec(q.story || ''); const t = (/^Who has the (\w+)\?$/.exec(q.prompt) || [])[1]; return m && t && m[2] !== m[4] ? (t === m[2] ? `pic:${m[1]}` : t === m[4] ? `pic:${m[3]}` : null) : null; },
  'p3-ideas-feels': (q) => { const m = /^Listen\. (\w+) feels (\w+), and (\w+) feels (\w+)\.$/.exec(q.story || ''); const who = (/^How does (\w+) feel\?$/.exec(q.prompt) || [])[1]; return m && who && m[1] !== m[3] ? (who === m[1] ? `face:${m[2]}` : who === m[3] ? `face:${m[4]}` : null) : null; },
  'p3-ideas-yesno': (q) => { const m = /^Listen\. The (\w+) is (\w+), and the (\w+) is (\w+)\.$/.exec(q.story || ''); const a = /^Is the (\w+) (\w+)\?$/.exec(q.prompt); if (!m || !a || m[1] === m[3] || m[2] === m[4]) return null;
    const does = a[1] === m[1] ? m[2] : a[1] === m[3] ? m[4] : null; return does && [m[2], m[4]].includes(a[2]) ? (does === a[2] ? 'Yes' : 'No') : null; },
  // Q50 (pass MN): the letter heard is the one the voice names, and a letter by its lines is the one letter of the lesson's three
  // whose lines the question says; both ask among exactly the lesson's three letters.
  ...Object.fromEntries(Object.entries(TRACED_P4).flatMap(([k, ls]) => [
    [`pl-hear-${k}`, (q) => { const m = /^Tap the letter ([A-Z])\.$/.exec(q.prompt); return m && ls.includes(m[1]) && q.choices.length === 3 && ls.every((x) => q.choices.includes(x)) && q.printed === 'Tap the letter you hear.' ? m[1] : null; }],
    [`pl-lines-${k}`, (q) => { const m = /^Which letter (.+)\?$/.exec(q.prompt); const hit = m ? ls.filter((x) => LINES_P4[x] === m[1]) : []; return hit.length === 1 && q.choices.length === 3 && ls.every((x) => q.choices.includes(x)) ? hit[0] : null; }],
  ])),
  'p3-tap-red-blue': (q) => { const m = /^Tap the (red|blue) (\w+)\.$/.exec(q.prompt); return !m ? null : m[2] === 'one' ? 'swatch:' + m[1] : 'item:' + m[2] + '-' + m[1]; },
  'p3-which-colour': (q) => { const m = /^What color is this( (\w+))?\?$/.exec(q.prompt); return m && q.visual && (m[2] ? q.visual.kind === 'item' && q.visual.shape === m[2] : q.visual.kind === 'swatch') ? q.visual.colour : null; },
  'p3-which-colour-four': (q) => (q.prompt === 'What color is this?' && q.visual && q.visual.kind === 'swatch' ? q.visual.colour : null),
  'p3-tap-any-colour': (q) => { const m = /^Tap the (\w+) one\.$/.exec(q.prompt); return m ? 'swatch:' + m[1] : null; },
  'p3-tap-count': (q) => { const m = /^Tap (one dot|two dots)\.$/.exec(q.prompt); return m ? 'dots:' + (m[1] === 'one dot' ? 1 : 2) : null; },
  'p3-name-three-shapes': (q) => (q.prompt === 'What shape is this?' && q.visual && q.visual.kind === 'shape' ? q.visual.name : null),
  ...Object.fromEntries(['pk4-tap-biggest', 'pk4-tap-smallest', 'pk4-tap-middle', 'pk3-tap-big', 'pk3-tap-little'].map((g) => [g, (q) => { const m = /^Tap the ([\w-]+) one\.$/.exec(q.prompt); return m && sizeOf[m[1]] ? onlyOne(q.choices.filter((c) => c.split(':')[2] === sizeOf[m[1]])) : null; }])),
  'pk-whose-turn': (q) => { const m = /^(\w+) had a turn and is done, so whose turn is next\?$/.exec(q.prompt); return m ? onlyOne(q.choices.filter((c) => c !== m[1])) : null; },
  'ck-job-tool': (q) => onlyOne([...new Set(HELPER_KEYS.filter(([k]) => q.prompt.toLowerCase().includes(k)).map(([, job]) => job))]),
  'ck-which-helper': (q) => onlyOne([...new Set(HELPER_KEYS.filter(([k]) => q.prompt.toLowerCase().includes(k)).map(([, job]) => job))]),
  'ck-good-choice': (q) => onlyOne(q.choices.filter((c) => lessonWords('taking-turns').includes(c.toLowerCase()))),
  ...Object.fromEntries(['p3-trace-mark', 'pd-trace-line'].map((g) => [g, (q) => { const m = /^Draw (a line across|a line down|a circle|a zigzag|a wavy line)\. Start at the dot\.$/.exec(q.prompt); return m ? lineOf[m[1]] : null; }])),
  ...Object.fromEntries(['animals', 'vehicles', 'things', 'water', 'land', 'shape', 'solid'].flatMap((s) => [['pm-same-' + s, sameAs], ['pm-different-' + s, oddOne]])),
};
// A More Info reason never says a choice is not what it is (pass MO): not by its own color, size or shape (round four's code check:
// "The green circle is not green, and it is not a circle." passed, since a denied color left no color to read), nor by the whole
// choice (round five's: "is not a green circle."), its size as said (round six's: "is not small."), a denial that leaves out the
// color (round eight's read: "is not a big square." for a big red square), the article the or a size or color before one (round
// nine's read: "is not the big red square.", "is not a little one."), or the choice's own rank against the others (round nine's
// read: "takes up more room, so it is not the smaller one." passed under the smaller choice, the app's own reason for the other
// choice swapped onto it). One function, run on every pre-K 3 choice in the main loop and on its planted reasons just below.
const WN_SAID = { small: 'little', big: 'big', medium: 'middle-sized' }; const WN_RANK = { small: 1, medium: 2, big: 3 };
const whyDeniesOwn = (c, choices, why) => {
  const item = /^item:([a-z]+)-([a-z]+)(?:-([a-z]+))?(?:#\d+)?$/.exec(c); const swatch = /^swatch:([a-z]+)$/.exec(c); const sized = /^shape:([a-z]+):(big|medium|small)$/.exec(c);
  const sizeOf = (x) => (/(?:-|:)(small|medium|big)(?:#\d+)?$/.exec(x) || [])[1];
  const A = '(?:an?|the)'; const sz = item ? item[3] : sized ? sized[2] : null; const S = sz ? `(?:${sz}|${WN_SAID[sz]})` : null;
  // The choice's rank: the smaller one when every other choice is bigger, the bigger one when every other is smaller.
  const others = (choices || []).filter((x) => x !== c).map((x) => WN_RANK[sizeOf(x)]).filter(Boolean);
  const rel = sz && others.length && others.every((r) => r > WN_RANK[sz]) ? 'smaller' : sz && others.length && others.every((r) => r < WN_RANK[sz]) ? 'bigger' : null;
  const own = item ? [item[2], item[3], item[3] && WN_SAID[item[3]], `${A} ${item[1]}`, `${A} ${S ? `(?:${S} )?` : ''}(?:${item[2]} )?${item[1]}`, `${A} ${S ? `(?:${S} (?:${item[2]} )?|${item[2]} )` : `${item[2]} `}one`, rel && `the ${rel} one`]
    : sized ? [sized[2], WN_SAID[sized[2]], `${A} ${sized[1]}`, `${A} ${S} ${sized[1]}`, `${A} ${S} one`, rel && `the ${rel} one`] : swatch ? [swatch[1], `${A} ${swatch[1]} one`] : [];
  return own.some((w) => w && new RegExp(`\\bnot ${w}\\b`).test(why)); };
// Its planted reasons: the near misses rounds six, eight and nine found, each must be failed, and fair reasons beside them, each must
// pass (the live "takes up less room, so it is not the bigger one." among them).
{ const PLANTED = [
    ['keep', 'item:circle-green-big', 'is not a little green circle.', []], ['keep', 'item:circle-green-big', 'is not little, and it is not a square.', []],
    ['catch', 'item:square-red-small', 'is not small.', []], ['catch', 'item:square-red-small', 'is not a little red square.', []],
    ['catch', 'item:circle-green', 'is not a green circle.', []], ['catch', 'shape:circle:small', 'is not small.', []],
    ['catch', 'shape:circle:small', 'is not a little circle.', []], ['keep', 'shape:circle:big', 'is not little, and it is not a square.', []],
    ['catch', 'swatch:green', 'is not green.', []],
    ['catch', 'item:square-red-big', 'is not a big square.', []], ['catch', 'item:circle-green-small', 'is not a little circle, and it is not blue.', []],
    ['catch', 'item:circle-green-small', 'is not a small circle.', []], ['keep', 'item:square-red-big', 'is not a little square.', []],
    ['keep', 'item:circle-green-small', 'is not a big circle, and it is not red.', []], ['keep', 'item:circle-green-small', 'is not a red circle.', []],
    ['keep', 'item:square-red-big', 'is not a big circle.', []],
    ['catch', 'item:square-red-big', 'is not the big red square.', ['item:square-red-big', 'item:circle-blue-small']],
    ['catch', 'item:square-red-big', 'is not a big red one.', ['item:square-red-big', 'item:square-red-small']],
    ['catch', 'shape:circle:small', 'is not the little circle.', ['shape:circle:small', 'shape:circle:big']],
    ['catch', 'shape:circle:small', 'is not a little one.', ['shape:circle:small', 'shape:circle:big']],
    ['catch', 'item:circle-green-small', 'takes up more room, so it is not the smaller one.', ['item:circle-green-big', 'item:circle-green-small']],
    ['keep', 'item:circle-green-small', 'takes up less room, so it is not the bigger one.', ['item:circle-green-big', 'item:circle-green-small']],
    ['keep', 'item:square-red-big', 'is not a big blue square.', ['item:square-red-big']],
    ['keep', 'item:square-red-big', 'is not the little square.', ['item:square-red-big']],
    ['keep', 'item:square-red', 'is not the one that matches.', ['item:square-red']]];
  const wrong = PLANTED.filter(([want, c, why, ch]) => whyDeniesOwn(c, ch, why) !== (want === 'catch'));
  ok(`a More Info reason that says a choice is not its own color, size, shape or rank is caught, and a fair one passes (${PLANTED.length} planted reasons)`, wrong.length === 0 && PLANTED.length === 25, wrong.map((w) => `${w[0]} ${w[1]} "${w[2]}"`).join(' | ')); }
// Every explanation that holds a capital initial, kept as the main loop reads each bank, for the sentence rule's reviewed names
// (round four's code read, pass MN).
const INITIAL_EXPLAINS = new Set();
for (const [genId, gen] of Object.entries(L.GENERATORS)) {
  let bad = [];
  // A question's layout never makes it a new question (pass MA): questions that ask the same thing, with the same answer and
  // the same things drawn, are one task whatever frame, snap, gap, stack or cell size draws them, or a bank counts its layout
  // as variety (the same-number row's frame followed its wrong answer, and More and Fewer's bank read 38 for 20).
  const tasks = new Map();
  // Every check a question takes, as one function of the question (pass MM), so the same checks read a pre-K question's mutants
  // below. live is false for a mutant, which then records nothing outside its own list of problems; wn is the part of that list
  // that More Info's checks found, which does not count as catching a wrong answer key.
  const check = (seed, q, live) => {
    let wnAll = [];
    if (live && q.prompt === 'When did this happen?' && q.story) { if (!whenAnswers.has(q.story)) whenAnswers.set(q.story, new Set()); whenAnswers.get(q.story).add(q.answer); }
    const problems = [];
    if (!q.prompt || !q.explain) problems.push('empty prompt/explain');
    if (q.type === 'choice') {
      if (!Array.isArray(q.choices) || q.choices.length < 2) problems.push('too few choices');
      if (q.choices.filter((c) => c === q.answer).length !== 1) problems.push('answer not exactly once in choices');
      if (new Set(q.choices).size !== q.choices.length) problems.push('duplicate choices');
      // fraction-valued choices must all be different amounts (no 2/4 vs 1/2 ambiguity)
      if (q.choices.every((c) => /^\d+\/\d+$/.test(c))) {
        const vals = q.choices.map(val);
        if (new Set(vals.map((v) => v.toFixed(9))).size !== vals.length) problems.push('two choices are the same amount');
      }
    } else if (q.type === 'number') {
      if (!/^\d+$/.test(q.answer)) problems.push('number answer is not a whole number');
    } else if (q.type === 'trace') {
      if (!L.TRACE_LETTERS[q.answer]) problems.push('trace letter has no strokes');
      if (q.traceKind === 'dots') { if (!q.prompt.includes(q.answer)) problems.push('dots prompt names a different picture'); }
      else if (q.traceKind === 'line') { if (!q.answer.startsWith('line-')) problems.push('line trace names a non-line'); }
      else if (q.traceKind === 'shape') { if (!q.prompt.includes(q.answer.slice(6))) problems.push('shape trace names a different shape'); }
      else if (q.traceKind === 'number') { if (q.answer !== q.prompt.match(/number (\d)/)[1]) problems.push('number trace prompt names a different number'); }
      else if (q.answer !== q.prompt.match(/letter ([A-Za-z])/)[1]) problems.push('trace prompt names a different letter');
      // an ideal tracing of the letter must pass, and a tracing of a different letter must fail
      const ideal = L.TRACE_LETTERS[q.answer].strokes.map((st) => st.flatMap((p, i) => (i === 0 ? [p] : Array.from({ length: 6 }, (_, k) => [st[i - 1][0] + ((p[0] - st[i - 1][0]) * (k + 1)) / 6, st[i - 1][1] + ((p[1] - st[i - 1][1]) * (k + 1)) / 6]))));
      if (!L.checkAnswer(q, JSON.stringify(ideal))) problems.push('an ideal tracing does not pass');
      const other = Object.keys(L.TRACE_LETTERS).find((k) => k !== q.answer && /^[A-Z]$/.test(k) && k !== 'E' && k !== 'F' && k !== 'H' && q.answer !== 'I');
      if (other && L.TRACE_LETTERS[other] && ['L', 'T', 'V', 'O', 'C'].includes(q.answer) && L.checkAnswer(q, JSON.stringify(L.TRACE_LETTERS[other].strokes))) problems.push(`tracing ${other} passes as ${q.answer}`);
    } else if (q.type === 'order' && q.pick) {
      // A direction of steps (pass MO): more pictures than steps, six at most, each once; the answer is pick of them in the order the
      // words say, never the first pictures in order, and only that order is judged right.
      const steps = String(q.answer).split(' | ');
      if (!Array.isArray(q.items) || q.items.length <= q.pick || q.items.length > 6) problems.push('a direction needs more pictures than steps, six at most');
      if (new Set(q.items).size !== q.items.length) problems.push('order pieces repeat');
      if (steps.length !== q.pick || new Set(steps).size !== steps.length || !steps.every((x) => q.items.includes(x))) problems.push('a direction\'s steps are not its pictures');
      if (q.items.slice(0, q.pick).join(' | ') === q.answer) problems.push('the steps come first and in order');
      if (!L.checkAnswer(q, q.answer) || L.checkAnswer(q, [...steps].reverse().join(' | ')) || L.checkAnswer(q, q.items.slice(0, q.pick).join(' | '))) problems.push('order judging wrong');
      // The explanation names each step in the answer's order, by the test's own reading of each step (round one's code check, pass
      // MO: "the spoon first, and then the cup" passed every check).
      { const word = (t) => { let m; if ((m = /^item:(\w+)-(\w+)$/.exec(t))) return `${m[2]} ${m[1]}`; if ((m = /^shape:(\w+):(big|small)$/.exec(t))) return `${m[2] === 'small' ? 'little' : 'big'} ${m[1]}`; if ((m = /^face:(\w+)$/.exec(t))) return `${m[1]} face`; if ((m = /^(?:icon|pic|shape):(\w+)$/.exec(t))) return m[1]; return null; };
        const ex = String(q.explain || '').toLowerCase(); let at = -1;
        for (const t of steps) { const w = word(t); const i = w ? ex.indexOf(w, at + 1) : -1; if (i < 0) { problems.push('a direction\'s explanation does not name its steps in order'); break; } at = i; } }
    } else if (q.type === 'order') {
      if (!Array.isArray(q.items) || q.items.length < 3) problems.push('order needs three or more pieces');
      if (new Set(q.items).size !== q.items.length) problems.push('order pieces repeat');
      if ([...q.items].sort().join('|') !== q.answer.split(' | ').sort().join('|')) problems.push('order answer is not the same pieces');
      if (q.items.join(' | ') === q.answer) problems.push('order already in order');
      if (!L.checkAnswer(q, q.answer) || L.checkAnswer(q, q.items.join(' | '))) problems.push('order judging wrong');
    } else if (q.type === 'writing') {
      if (!q.prompt || q.prompt.length < 20) problems.push('writing prompt too short');
      if (!Array.isArray(q.checklist) || q.checklist.length < 3) problems.push('writing needs a checklist of three or more');
      if (!(q.minWords > 0)) problems.push('writing needs a word target');
      if (L.checkAnswer(q, 'anything at all')) problems.push('writing must never be auto-judged');
    } else problems.push('unknown type');
    // Independent arithmetic re-check of the answer, per generator family
    const text = (q.story ? q.story + ' ' : '') + q.prompt; // the full question as the learner reads it
    const nums = text.match(/\d+\/\d+/g) || [];
    if (genId === 'm3-same-bottom' || genId === 'm3-same-top' || genId === 'm3-different') {
      const [a, b] = nums; if (Math.max(val(a), val(b)) !== val(q.answer)) problems.push('bigger fraction is wrong');
    }
    if (genId === 'm3-smallest-of-three') {
      const min = Math.min(...nums.map(val)); if (val(q.answer) !== min) problems.push('smallest fraction is wrong');
    }
    if (genId === 'm3-true-false') {
      const [a, b] = nums; if ((val(a) > val(b) ? 'True' : 'False') !== q.answer) problems.push('true/false is wrong');
    }
    if (genId === 'm2-which-equals') { if (Math.abs(val(nums[0]) - val(q.answer)) > 1e-9) problems.push('not equivalent'); }
    if (genId === 'm2-simplify') { const [f] = nums; if (Math.abs(val(f) - val(q.answer)) > 1e-9) problems.push('simplified value differs'); const [n, d] = q.answer.split('/').map(Number); if (L.gcd(n, d) !== 1) problems.push('not in simplest form'); }
    if (genId === 'm2-fill-bottom') { const [a, b] = nums[0].split('/').map(Number); const top = Number(text.match(/= (\d+)\//)[1]); if (top * b !== a * Number(q.answer)) problems.push('fill-bottom arithmetic wrong'); }
    if (genId === 'm2-fill-top') { const [a, b] = nums[0].split('/').map(Number); const bottom = Number(text.match(/__\/(\d+)/)[1]); if (Number(q.answer) * b !== a * bottom) problems.push('fill-top arithmetic wrong'); }
    if (genId === 'm2-equivalent-or-not') { const [a, b] = nums; const same = Math.abs(val(a) - val(b)) < 1e-9; if ((same ? 'Yes' : 'No') !== q.answer.slice(0, same ? 3 : 2)) problems.push('equivalence yes/no wrong'); }
    if (genId === 'm1-part-eaten') { const n = Number(text.match(/into (\d+) equal/)[1]); const m = Number(text.match(/eat (\d+)/)[1]); if (q.answer !== `${m}/${n}`) problems.push('part eaten wrong'); }
    if (genId === 'm1-part-left') { const n = Number(text.match(/into (\d+) equal/)[1]); const m = Number(text.match(/\. (\d+) /)[1]); if (q.answer !== `${n - m}/${n}`) problems.push('part left wrong'); }
    if (genId === 'm1-picture') { if (q.answer !== `${q.visual.shaded}/${q.visual.parts}`) problems.push('picture answer does not match drawing'); }
    if (genId === 'm1-top-or-bottom') { const n = Number(text.match(/into (\d+) equal/)[1]); const m = Number(text.match(/eat (\d+)/)[1]); const want = /top number/.test(q.prompt) ? m : n; if (Number(q.answer) !== want) problems.push('top/bottom wrong'); }
    if (q.visual && q.visual.kind === 'letters') { if (typeof q.visual.text !== 'string' || !q.visual.text.trim()) problems.push('letters visual empty'); if (q.visual.highlight !== undefined && (typeof q.visual.highlight !== 'string' || !q.visual.highlight)) problems.push('letters highlight is not a string, so it lights nothing'); }
    else if (q.visual && q.visual.kind === 'dots') { if (!(Number.isInteger(q.visual.count) && q.visual.count >= 1 && q.visual.count <= 10)) problems.push('dots out of range'); }
    else if (q.visual && q.visual.kind === 'shape') { /* checked below */ }
    else if (q.visual && q.visual.kind === 'tens') { if (!(q.visual.count >= 1 && q.visual.count <= 10)) problems.push('tens out of range'); }
    else if (q.visual && q.visual.kind === 'bars') { if (!q.visual.lengths.every((n) => n >= 1 && n <= 9)) problems.push('bar out of range'); }
    else if (q.visual && q.visual.kind === 'solid') { if (!['sphere', 'cube', 'cylinder', 'cone', 'box', 'prism'].includes(q.visual.name)) problems.push('unknown solid'); }   // box and prism: the two prisms (pass KY)
    // Grade 1 geometry pictures (pass KY): a cut shape names a shape, a cut the screen draws and a shaded count within its
    // pieces; a joined figure is one the screen draws.
    else if (q.visual && q.visual.kind === 'shares') { const cuts = { none: 1, half: 2, 'half-across': 2, 'half-slant': 2, fourths: 4, 'fourths-strips': 4, 'fourths-x': 4, 'unequal-two': 2, 'unequal-four': 4 }; if (!(['circle', 'square', 'rectangle'].includes(q.visual.shape) && cuts[q.visual.cut] && Number.isInteger(q.visual.shaded) && q.visual.shaded >= 0 && q.visual.shaded <= cuts[q.visual.cut] && !(q.visual.shape === 'circle' && q.visual.cut === 'fourths-strips'))) problems.push('shares picture out of range'); }
    // The equal sign (pass LB): a level balance names what sits on each pan.
    else if (q.visual && q.visual.kind === 'pans') { if (!(typeof q.visual.left === 'string' && typeof q.visual.right === 'string' && q.visual.left.trim() && q.visual.right.trim())) problems.push('balance picture incomplete'); }
    // Grade 1 number sense pictures (pass LA): a dice face, a domino, equal sets and an open number line.
    else if (q.visual && q.visual.kind === 'dice') { if (!(Number.isInteger(q.visual.pips) && q.visual.pips >= 1 && q.visual.pips <= 6)) problems.push('dice out of range'); }
    else if (q.visual && q.visual.kind === 'domino') { if (!([q.visual.a, q.visual.b].every((v) => Number.isInteger(v) && v >= 1 && v <= 6))) problems.push('domino out of range'); }
    else if (q.visual && q.visual.kind === 'sets') { if (!(Number.isInteger(q.visual.groups) && q.visual.groups >= 1 && q.visual.groups <= 12 && [2, 5, 10].includes(q.visual.each))) problems.push('sets out of range'); }
    else if (q.visual && q.visual.kind === 'openline') { const v = q.visual; if (!(Number.isInteger(v.from) && Number.isInteger(v.to) && v.from < v.to && v.to <= 120 && Array.isArray(v.labels) && v.labels.every((x) => x >= v.from && x <= v.to) && Array.isArray(v.dots) && v.dots.every((d) => d.at >= v.from && d.at <= v.to))) problems.push('open number line out of range'); }
    // Grade 1 measurement and data pictures (pass KZ): a measured object, a digital clock, tally marks and a bar graph.
    else if (q.visual && q.visual.kind === 'measure') { if (!(['pencil', 'crayon', 'ribbon', 'straw'].includes(q.visual.object) && Number.isInteger(q.visual.units) && q.visual.units >= 1 && q.visual.units <= 9 && ['cube', 'clip'].includes(q.visual.unit) && [null, undefined, 'gaps', 'overlap'].includes(q.visual.flaw) && [null, undefined, 'clip'].includes(q.visual.second) && !(q.visual.second && (q.visual.unit !== 'cube' || q.visual.units % 2)))) problems.push('measure picture out of range'); }
    else if (q.visual && q.visual.kind === 'digital') { if (!(q.visual.hour >= 1 && q.visual.hour <= 12 && [0, 30].includes(q.visual.minute))) problems.push('digital clock out of range'); }
    else if (q.visual && q.visual.kind === 'tally') { if (!(Array.isArray(q.visual.rows) && q.visual.rows.length >= 1 && q.visual.rows.length <= 3 && q.visual.rows.every((r) => typeof r.icon === 'string' && Number.isInteger(r.count) && r.count >= 0 && r.count <= 12))) problems.push('tally picture out of range'); }
    else if (q.visual && q.visual.kind === 'bargraph') { if (!(Array.isArray(q.visual.rows) && q.visual.rows.length >= 2 && q.visual.rows.length <= 3 && q.visual.rows.every((r) => typeof r.icon === 'string' && Number.isInteger(r.count) && r.count >= 0 && r.count <= 6))) problems.push('bar graph out of range'); }
    else if (q.visual && q.visual.kind === 'joined') { if (!['square-2tri', 'rect-2tri', 'triangle-2tri', 'rhombus-2tri', 'rect-2sq', 'rect-3sq', 'square-4sq', 'square-4tri', 'triangle-4tri', 'trapezoid-3tri', 'hexagon-6tri', 'hexagon-2trap'].includes(q.visual.figure)) problems.push('unknown joined figure'); }
    else if (q.visual && q.visual.kind === 'tenframe') { if (!(q.visual.filled >= 0 && q.visual.filled <= 10)) problems.push('ten frame out of range'); }
    else if (q.visual && q.visual.kind === 'sign') { if (!(typeof q.visual.text === 'string' && q.visual.text && /^#[0-9A-Fa-f]{6}$/.test(q.visual.color))) problems.push('sign incomplete'); }   // pass KW: a road sign with its words and color
    else if (q.visual && q.visual.kind === 'map') { if (!(typeof q.visual.region === 'string' && Array.isArray(q.visual.spots))) problems.push('map incomplete'); }
    else if (q.visual && q.visual.kind === 'pair') { if (![q.visual.a, q.visual.b].every((h) => h && (h.kind || h.shape) && (h.kind !== 'dots' || (h.count >= 1 && h.count <= 10)) && (h.kind !== 'tenframe' || (h.filled >= 0 && h.filled <= 10)) && (h.kind !== 'tens' || (h.count >= 1 && h.count <= 10)))) problems.push('pair visual incomplete or out of range'); }   // pass KT: a ten and some more, side by side
    else if (q.visual && q.visual.kind === 'array') { if (!(q.visual.rows >= 1 && q.visual.rows <= 10 && q.visual.cols >= 1 && q.visual.cols <= 10)) problems.push('array out of range'); }
    else if (q.visual && q.visual.kind === 'numberline' && q.visual.parts !== undefined) { if (!(q.visual.parts >= 2 && q.visual.mark >= 0 && q.visual.mark <= q.visual.parts)) problems.push('number line out of range'); }
    else if (q.visual && q.visual.kind === 'bar') { if (!(q.visual.shaded >= 0 && q.visual.shaded <= q.visual.parts)) problems.push('bar picture out of range'); }
    else if (q.visual && q.visual.kind === 'swatch') { if (!['red', 'blue', 'yellow', 'green'].includes(q.visual.colour)) problems.push('unknown colour'); }
    else if (q.visual && q.visual.kind === 'item') { if (!q.visual.shape || !q.visual.colour) problems.push('item incomplete'); }
    else if (q.visual && q.visual.kind === 'pattern') { if (!Array.isArray(q.visual.items) || (q.visual.counting ? q.visual.items.length < 1 : q.visual.items.length < 3)) problems.push('pattern too short'); } // a counting row (pass HS) may hold one shape
    else if (q.visual && q.visual.kind === 'clock') { if (!(q.visual.hour >= 1 && q.visual.hour <= 12 && [0, 15, 30, 45].includes(q.visual.minute))) problems.push('clock out of range'); }
    else if (q.visual && q.visual.kind === 'picto') { if (!(Array.isArray(q.visual.rows) && q.visual.rows.length >= 2 && q.visual.rows.length <= 3 && q.visual.rows.every((r) => typeof r.icon === 'string' && Number.isInteger(r.count) && r.count >= 0 && r.count <= 6))) problems.push('picture graph out of range'); }   // pass KL: two or three rows of up to six pictures
    else if (q.visual && q.visual.kind === 'icon') { if (!['sun', 'moon', 'cloud', 'rain', 'snow', 'plant', 'tree', 'flower', 'fish', 'bird', 'rock', 'drop', 'ice', 'fire', 'magnet', 'clip', 'nail', 'cup', 'bus', 'dog', 'hat', 'bed', 'fan', 'soil', 'ball', 'block', 'teddy', 'sock', 'spoon', 'log', 'book', 'glass', 'flashlight', 'lamp', 'shadow', 'pebble', 'boulder', 'speckled', 'flatrock', 'penny', 'wall', 'gravel', 'bricks', 'window', 'nickel', 'dime', 'quarter', 'table', 'hill', 'map', 'globe', 'mountain', 'river', 'lake', 'ocean', 'cactus', 'coat', 'candle', 'cake', 'fridge', 'washer', 'phone', 'tablet', 'pencil', 'doctor', 'shot', 'comb', 'mosquito', 'plate', 'peanut', 'helmet', 'booster', 'belt', 'bubble', 'stop', 'slide', 'knife', 'scissors', 'screwdriver', 'house', 'bottle', 'cigarette', 'camera', 'music', 'search', 'keyboard', 'space', 'backspace', 'save', 'printer', 'chair', 'bulb', 'board', 'star', 'door'].includes(String(q.visual.name).split('~')[0])) problems.push('unknown icon'); }
    else if (q.visual && (q.visual.kind === 'pic' || q.visual.kind === 'art')) { if (!q.visual.name) problems.push('picture incomplete'); }
    else if (q.visual && q.visual.kind === 'face') { if (!['happy', 'sad', 'mad', 'scared', 'worried', 'embarrassed'].includes(q.visual.feeling)) problems.push('a face with a feeling the screen cannot draw'); }   // pass MD; worried and embarrassed since pass MN
    else if (q.visual && q.visual.kind === 'numberline') { if (!(q.visual.from < q.visual.to && (q.visual.marks || [q.visual.mark]).every((v) => v === null || v === undefined || (v >= q.visual.from && v <= q.visual.to)))) problems.push('number line out of range'); }
    else if (q.visual && (q.visual.kind === 'tri' || q.visual.kind === 'para')) { if (!(q.visual.base > 0 && (q.visual.height === '?' || q.visual.height > 0))) problems.push('shape measures missing'); }
    else if (q.visual && q.visual.kind === 'cell') { if (typeof q.visual.highlight !== 'string') problems.push('cell visual needs a highlight'); }
    else if (q.visual && q.visual.kind === 'percentgrid') { if (!(q.visual.shaded >= 0 && q.visual.shaded <= 100)) problems.push('percent grid out of range'); }
    else if (q.visual && q.visual.kind === 'groups') { if (!(Number.isInteger(q.visual.a) && Number.isInteger(q.visual.b) && q.visual.a >= 0 && q.visual.b >= 0)) problems.push('groups out of range'); }
    else if (q.visual && q.visual.kind === 'angles') { if (!(['vertical', 'supplementary', 'triangle'].includes(q.visual.type) && q.visual.given > 0 && q.visual.given < 180)) problems.push('angles out of range'); }
    else if (q.visual && q.visual.kind === 'lightray') { if (!(q.visual.angle > 0 && q.visual.angle < 90)) problems.push('light ray out of range'); }
    else if (q.visual && q.visual.kind === 'alleles') { if (!/^[Bb]{2}$/.test(q.visual.pair)) problems.push('alleles malformed'); }
    else if (q.visual && q.visual.kind === 'beaker') { if (!(q.visual.moles > 0 && q.visual.liters > 0)) problems.push('beaker out of range'); }
    else if (q.visual && q.visual.kind === 'periodic') { if (!((q.visual.highlight || []).every((s) => typeof s === 'string' && s.length) && (q.visual.period === null || q.visual.period === undefined || (q.visual.period >= 1 && q.visual.period <= 7)) && (q.visual.group === null || q.visual.group === undefined || (q.visual.group >= 1 && q.visual.group <= 18)))) problems.push('periodic visual out of range'); }
    else if (q.visual && q.visual.kind === 'plot') { if (!(q.visual.fn !== 'point' || (q.visual.px >= 0 && q.visual.px <= 6 && q.visual.py >= 0 && q.visual.py <= 6))) problems.push('plot point out of range'); }
    else if (q.visual && !(q.visual.shaded >= 0 && q.visual.shaded <= q.visual.parts)) problems.push('visual out of range');
    // A face choice (pass MD) is one of the feelings FeelingFace draws (four, and since pass MN worried and embarrassed), and a
    // pair of faces shows two of them.
    if ((q.choices || []).some((c) => /^face:/.test(String(c)) && !['happy', 'sad', 'mad', 'scared', 'worried', 'embarrassed'].includes(String(c).slice(5)))) problems.push('a face choice names a feeling the screen cannot draw');
    if (q.visual && q.visual.kind === 'pair' && [q.visual.a, q.visual.b].some((h) => h && h.kind === 'face' && !['happy', 'sad', 'mad', 'scared', 'worried', 'embarrassed'].includes(h.feeling))) problems.push('a pair shows a face the screen cannot draw');
    // Independent checks for the counting questions (a 'dots:N' choice is a picture of N things)
    const dotCount = (c) => Number((/^dots:(\d+)$/.exec(c) || [])[1]);
    if (/^k(5|10)-how-many$/.test(genId) && String(q.visual.count) !== q.answer) problems.push('how-many answer does not match the picture');
    if (/^k(5|10)-tap-group$/.test(genId) && dotCount(q.answer) !== Number(q.prompt.match(/with (\d+)/)[1])) problems.push('tap-group answer does not match the prompt');
    if (/^k(5|10)-more$/.test(genId) && dotCount(q.answer) !== Math.max(...q.choices.map(dotCount))) problems.push('more picked the smaller group');
    if (/^k(5|10)-fewer$/.test(genId) && dotCount(q.answer) !== Math.min(...q.choices.map(dotCount))) problems.push('fewer picked the bigger group');
    if (/^k(5|10)-after$/.test(genId) && Number(q.answer) !== Number(q.prompt.match(/after (\d+)/)[1]) + 1) problems.push('after is not n+1');
    if (/^k(5|10)-same$/.test(genId) && dotCount(q.answer) !== q.visual.count) problems.push('same does not match the picture');
    const AZ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (genId === 'r-tap-letter' && q.answer !== q.prompt.match(/letter ([A-Z])/)[1]) problems.push('tap-letter answer mismatch');
    if (genId === 'r-after' && q.answer !== AZ[AZ.indexOf(q.prompt.match(/after ([A-Z])/)[1]) + 1]) problems.push('after is not the next letter');
    if (genId === 'r-before' && q.answer !== AZ[AZ.indexOf(q.prompt.match(/before ([A-Z])/)[1]) - 1]) problems.push('before is not the previous letter');
    if (genId === 'r-first-letter' && q.answer !== q.story.match(/word ([A-Z]+)/)[1][0]) problems.push('first letter wrong');
    if (genId === 'r-count-letters' && Number(q.answer) !== q.story.match(/word ([A-Z]+)/)[1].length) problems.push('letter count wrong');
    if (genId === 'r-match-small' && q.answer !== q.story.match(/big ([A-Z])/)[1].toLowerCase()) problems.push('small letter mismatch');
    if (genId === 'r-match-big' && q.answer !== q.story.match(/small ([a-z])/)[1].toUpperCase()) problems.push('big letter mismatch');
    // Independent re-derivation for the kindergarten number-sense questions, from the words alone
    const words = { zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
    const firstWord = (t) => words[(t || '').trim().split(/\s+/)[0].toLowerCase()];
    const ints = text.match(/\d+/g) ? text.match(/\d+/g).map(Number) : [];
    if (genId === 'km-one-more' && Number(q.answer) !== ints[0] + 1) problems.push('one more is not n+1');
    if (genId === 'km-one-less' && Number(q.answer) !== ints[0] - 1) problems.push('one less is not n-1');
    if (genId === 'km-one-more-pic' && dotCount(q.answer) !== ints[0] + 1) problems.push('one-more picture is not n+1');
    if (genId === 'km-one-less-pic' && dotCount(q.answer) !== ints[0] - 1) problems.push('one-less picture is not n-1');
    if (genId === 'km-which-neighbour') { const n = ints[0]; const want = /more/.test(q.prompt) ? n + 1 : n - 1; if (Number(q.answer) !== want) problems.push('neighbour wrong'); }
    if (genId === 'km-join-story') { const a = firstWord(q.story); const b = ints[0]; if (Number(q.answer) !== a + b) problems.push('join total wrong'); }
    if (genId === 'km-take-story') { const a = firstWord(q.story); const b = ints[0]; if (Number(q.answer) !== a - b) problems.push('take-away remainder wrong'); }
    if (genId === 'km-join-pic' && dotCount(q.answer) !== ints[0] + ints[1]) problems.push('join picture wrong');
    if (genId === 'km-take-pic' && dotCount(q.answer) !== ints[0] - ints[1]) problems.push('take picture wrong');
    if (genId === 'km-how-many-more' && Number(q.answer) !== ints[1] - ints[0]) problems.push('how many more wrong');
    if (genId === 'km-bigger' && Number(q.answer) !== Math.max(...q.choices.map(Number))) problems.push('bigger picked the smaller');
    if (genId === 'km-smaller' && Number(q.answer) !== Math.min(...q.choices.map(Number))) problems.push('smaller picked the bigger');
    if (genId === 'km-more-less-same') { const [a, b] = ints; const want = a > b ? 'More' : a < b ? 'Fewer' : 'The same'; if (q.answer !== want) problems.push('more/fewer/same wrong'); }
    if (genId === 'km-make-more' && !(dotCount(q.answer) > ints[0])) problems.push('make-more is not more');
    if (genId === 'km-make-fewer' && !(dotCount(q.answer) < ints[0])) problems.push('make-fewer is not fewer');
    if (/^km-/.test(genId) && q.explainVisual && !(q.explainVisual.count >= 1 && q.explainVisual.count <= 10)) problems.push('explain picture out of range');
    // Shapes, re-derived from a table the generator does not share
    const SIDES = { circle: 0, triangle: 3, square: 4, rectangle: 4, rhombus: 4, hexagon: 6, trapezoid: 4 };   // rhombus, hexagon and trapezoid: grade 1 (pass KY)
    const shapeOf = (c) => String(c).replace(/^shape:/, '').split('#')[0].split('~')[0];
    if (genId === 'ks-name' && q.answer !== q.visual.name) problems.push('named the wrong shape');
    if (genId === 'ks-tap' && shapeOf(q.answer) !== q.prompt.match(/Tap the (\w+)/)[1]) problems.push('tapped the wrong shape');
    if (genId === 'ks-sides' && Number(q.answer) !== SIDES[q.visual.name]) problems.push('side count wrong');
    if (genId === 'ks-odd-one-out') { const names = q.choices.map(shapeOf); const odd = names.find((n) => names.filter((x) => x === n).length === 1); if (shapeOf(q.answer) !== odd) problems.push('odd one out wrong'); }
    if (genId === 'ks-corners' && q.answer !== (SIDES[q.visual.name] > 0 ? 'Yes' : 'No')) problems.push('corners yes/no wrong');
    if (q.visual && q.visual.kind === 'shape' && !SIDES.hasOwnProperty(q.visual.name)) problems.push('unknown shape');
    // Grade 1 geometry (pass KY), re-derived from tables the generators do not share. A look after a tilde never changes a shape.
    const VERTICES = { circle: 0, triangle: 3, square: 4, rectangle: 4, rhombus: 4, hexagon: 6 };
    const SIDE_WORD = { no: 0, three: 3, four: 4, six: 6 };
    const ALSO = { square: ['rectangle', 'rhombus'] };   // names also true of a shape, never a wrong choice for it
    if (genId === 'f1-name') { if (q.answer !== q.visual.name) problems.push('grade 1 named the wrong shape'); if ((ALSO[q.visual.name] || []).some((n) => q.choices.includes(n))) problems.push('a name also true of the shape is offered as wrong'); }
    if (genId === 'f1-tap') { const want = q.prompt.match(/Tap the (\w+)\./)[1]; if (shapeOf(q.answer) !== want) problems.push('grade 1 tapped the wrong shape'); if (q.choices.map(shapeOf).filter((n) => n !== want).some((n) => (ALSO[n] || []).includes(want))) problems.push('a shape that is also the asked name is shown as wrong'); }
    if (genId === 'f1-sides' && Number(q.answer) !== SIDES[q.visual.name]) problems.push('grade 1 side count wrong');
    if (genId === 'f1-vertices' && Number(q.answer) !== VERTICES[q.visual.name]) problems.push('vertex count wrong');
    if (genId === 'f1-still') { const still = /^Is it still a (\w+)\?$/.exec(q.prompt); const want = still ? (still[1] === (q.visual.name || q.visual.shape) ? 'Yes' : 'No') : (/^Is it a square\?$/.test(q.prompt) && q.visual.name !== 'square' ? 'No' : null); if (q.answer !== want) problems.push('still-a-shape wrong'); }
    if (genId === 'f1-what-counts') { const defining = ['Its number of sides', 'Its number of vertices'].includes(q.answer); if (defining !== /can change/.test(q.prompt)) problems.push('what counts wrong'); }
    if (genId === 'f1-tap-by-sides') { const m2 = /with (no|three|four|six) /.exec(q.prompt); const n = SIDE_WORD[m2[1]]; const names = q.choices.map(shapeOf); if (SIDES[shapeOf(q.answer)] !== n || names.filter((x) => SIDES[x] === n).length !== 1) problems.push('tap by sides wrong'); }
    if (genId === 'f1-odd-one-out') { const names = q.choices.map(shapeOf); const odd = names.find((n) => names.filter((x) => x === n).length === 1); const pair = names.find((n) => n !== odd); if (shapeOf(q.answer) !== odd) problems.push('grade 1 odd one out wrong'); if ((ALSO[odd] || []).includes(pair)) problems.push('the odd one is also the pair shape'); }
    if (genId === 'f1-special') { const want = /^Is this square a (rhombus|rectangle) too\?$/.test(q.prompt) ? 'Yes' : /^Is this (rhombus|rectangle) a square\?$/.test(q.prompt) ? 'No' : null; if (q.answer !== want) problems.push('special shape wrong'); }
    const SOLID_LABEL = { sphere: 'sphere', cube: 'cube', box: 'rectangular prism', prism: 'triangular prism', cylinder: 'cylinder', cone: 'cone' };
    const SOLID_FACES = { sphere: 0, cube: 6, box: 6, prism: 5, cylinder: 2, cone: 1 }; const SOLID_VERT = { sphere: 0, cube: 8, box: 8, prism: 6, cylinder: 0 };
    const FACE_OF = { cube: 'square', box: 'rectangle', prism: 'triangle', cylinder: 'circle', cone: 'circle' };
    const THING_SOLID = { 'A ball': 'sphere', 'A globe': 'sphere', 'A toy block': 'cube', 'A cereal box': 'rectangular prism', 'A book': 'rectangular prism', 'A brick': 'rectangular prism', 'A camping tent': 'triangular prism', 'A wedge of cheese': 'triangular prism', 'A soup can': 'cylinder', 'A drum': 'cylinder', 'An ice cream cone': 'cone', 'A party hat': 'cone' };
    const solidOf = (c) => String(c).replace(/^solid:/, '').split('#')[0];
    if (genId === 'so1-name') { if (q.answer !== SOLID_LABEL[q.visual.name]) problems.push('named the wrong solid'); if (q.visual.name === 'cube' && q.choices.includes('rectangular prism')) problems.push('rectangular prism offered as wrong for a cube'); }
    if (genId === 'so1-tap') { const want = q.prompt.match(/Tap the (.+)\./)[1]; if (SOLID_LABEL[solidOf(q.answer)] !== want) problems.push('tapped the wrong solid'); if (want === 'rectangular prism' && q.choices.includes('solid:cube')) problems.push('a cube shown as wrong for a rectangular prism'); }
    if (genId === 'so1-faces' && Number(q.answer) !== SOLID_FACES[q.visual.name]) problems.push('face count wrong');
    if (genId === 'so1-vertices' && Number(q.answer) !== SOLID_VERT[q.visual.name]) problems.push('solid vertex count wrong');
    if (genId === 'so1-face-shape') { if (shapeOf(q.answer) !== FACE_OF[q.visual.name]) problems.push('face shape wrong'); if (q.visual.name === 'cube' && q.choices.includes('shape:rectangle')) problems.push('rectangle offered as wrong for a cube face'); }
    if (genId === 'so1-real') { const thing = q.prompt.match(/^(.+) is shaped like which solid\?$/)[1]; if (q.answer !== THING_SOLID[thing]) problems.push('real thing solid wrong'); }
    if (genId === 'so1-special') { const want = /^Is this cube a rectangular prism too\?$/.test(q.prompt) ? 'Yes' : /^(Is this rectangular prism a cube|Is this triangular prism a rectangular prism|Does this sphere have any flat faces)\?$/.test(q.prompt) ? 'No' : null; if (q.answer !== want) problems.push('special solid wrong'); }
    if (genId === 'so1-prism-faces' && Number(q.answer) !== (/triangles\?$/.test(q.prompt) ? 2 : 3)) problems.push('prism faces wrong');
    if (genId === 'so1-which-solid') { const want = /circle faces and a curved/.test(q.prompt) ? 'cylinder' : /no flat faces/.test(q.prompt) ? 'sphere' : /comes to a point/.test(q.prompt) ? 'cone' : /two triangle faces/.test(q.prompt) ? 'triangular prism' : /all squares/.test(q.prompt) ? 'cube' : 'rectangular prism'; if (q.answer !== want) problems.push('which solid wrong'); }
    const JOIN = { 'square-2tri': ['Two triangles', 'square', 2], 'triangle-2tri': ['Two triangles', 'triangle', 2], 'rect-2tri': ['Two triangles', 'rectangle', 2], 'rhombus-2tri': ['Two triangles', 'rhombus', 2], 'rect-2sq': ['Two squares', 'rectangle', 2], 'rect-3sq': ['Three squares', 'rectangle', 3], 'square-4sq': ['Four squares', 'square', 4], 'square-4tri': ['Four triangles', 'square', 4], 'triangle-4tri': ['Four triangles', 'triangle', 4], 'trapezoid-3tri': ['Three triangles', 'trapezoid', 3], 'hexagon-6tri': ['Six triangles', 'hexagon', 6], 'hexagon-2trap': ['Two trapezoids', 'hexagon', 2] };
    const makes = (label, result) => Object.values(JOIN).some(([l, r]) => l === label && r === result);
    if (genId === 'j1-made-what') { const [, r] = JOIN[q.visual.figure]; if (q.answer !== r) problems.push('joined result wrong'); if ((ALSO[r] || []).some((n) => q.choices.includes(n))) problems.push('a name also true of the joined shape is offered as wrong'); }
    if (genId === 'j1-how-many' && Number(q.answer) !== JOIN[q.visual.figure][2]) problems.push('joined piece count wrong');
    if (genId === 'j1-which-pieces') { const [l, r] = JOIN[q.visual.figure]; if (q.answer !== l) problems.push('joined pieces wrong'); if (q.choices.filter((c) => c !== l).some((c) => makes(c, r))) problems.push('a wrong piece set can make the same shape'); }
    if (genId === 'j1-tap-result') { const want = /two squares/.test(q.prompt) || /three squares/.test(q.prompt) ? 'rectangle' : /four squares/.test(q.prompt) ? 'square' : /three triangles/.test(q.prompt) ? 'trapezoid' : 'hexagon'; if (shapeOf(q.answer) !== want) problems.push('tap result wrong'); }
    // Since round six (pass MO) the question asks which pieces made the shape in the lesson, since other pieces can make it another way
    // (six triangles, three triangles and two right trapezoids each make a rectangle), and the old "can make" wording is a problem.
    if (genId === 'j1-more-ways') { const mw = /made an? (\w+) in the lesson\?$/.exec(q.prompt || ''); if (!mw) problems.push('more ways asks what can make a shape, and other pieces can make it another way'); else { const t = mw[1]; if (!makes(q.answer, t) || q.choices.filter((c) => c !== q.answer).some((c) => makes(c, t))) problems.push('more ways wrong'); } }
    if (genId === 'j1-can') { const m2 = /^Can (.+) make a (\w+)\?$/.exec(q.prompt); const label = m2[1].replace(/^\w/, (c) => c.toUpperCase()); const want = makes(label, m2[2]) ? 'Yes' : 'No'; if (q.answer !== want) problems.push('can make wrong'); }
    // Listen and Point (pass LS): sounds and pictures re-derived from the words.
    const lsSounds = { cat: 'meow', duck: 'quack', bee: 'buzz', frog: 'ribbit', owl: 'hoot', bear: 'growl', dog: 'woof', bird: 'tweet' };
    if (genId === 'p3-animal-says' && q.answer !== lsSounds[q.prompt.match(/the (\w+) say/)[1]]) problems.push('animal says wrong');
    if (genId === 'p3-animal-sound' && lsSounds[String(q.answer).replace('pic:', '')] !== q.prompt.match(/says (\w+)\./)[1]) problems.push('animal sound wrong');
    if (genId === 'p3-tap-picture' && q.answer !== 'icon:' + q.prompt.match(/Tap the (\w+)\./)[1]) problems.push('picture wrong');
    // Very First Steps' feelings (pass MD, earmark E12 part one): every bank re-derived from its words and pictures with tables of
    // the test's own. A face choice is its feeling; the moments are the lesson's own (playing with a friend, a balloon floating away,
    // a grabbed toy, a boom of thunder, and the body clues for mad and scared); a wrong face is never the asked feeling, and in a
    // moment it is never a feeling a child could fairly have there too. Since pass MH (EARMARKS A23, the alignment read) it is not
    // always happy: each moment names the wrong faces that are fair to offer (a lost balloon and a grabbed toy keep happy, since sad
    // and mad both fit them), and the bank check below holds happy to at most half the moments.
    { const fe = (c) => (/^face:([a-z]+)$/.exec(String(c)) || [])[1];
      const mdOthers = (q.choices || []).filter((c) => c !== q.answer);
      // Since pass MH a moment is said inside its question (How might Ana feel when her balloon floats away?), so the moment
      // and the friend's name are read from the prompt, and there is no setup line.
      const MD_MOMENT = [[/ is playing with (his|her) friend$/, 'happy', ['sad']], [/ (his|her) balloon floats away$/, 'sad', ['happy']], [/ someone grabs (his|her) toy$/, 'mad', ['happy']], [/ (he|she) hears a big boom of thunder$/, 'scared', ['happy', 'mad']], [/ (his|her) face feels hot and (his|her) hands make tight fists$/, 'mad', ['happy', 'sad']], [/ (his|her) heart is beating fast and (he|she) wants to hide$/, 'scared', ['happy', 'mad']]];
      if (genId === 'p3-feel-tap-face') { const f = (q.prompt.match(/^Tap the (happy|sad|mad|scared) face\.$/) || [])[1]; if (!f || fe(q.answer) !== f || mdOthers.length !== 1 || !fe(mdOthers[0]) || fe(mdOthers[0]) === f) problems.push('feeling face wrong'); }
      if (genId === 'p3-feel-name-face') { const f = q.visual && q.visual.feeling; if (q.prompt !== 'How does this face feel?' || !f || q.answer.toLowerCase() !== f || mdOthers.some((c) => c.toLowerCase() === f)) problems.push('face named wrong'); }
      if (genId === 'p3-feel-moment') { const mm = /^How might ([A-Z][a-z]+) feel when (.+)\?$/.exec(q.prompt) || []; const hit = MD_MOMENT.find(([re]) => re.test(' ' + (mm[2] || '')));
        if (!mm[1] || !hit || q.story !== null || fe(q.answer) !== hit[1] || mdOthers.length !== 1 || !hit[2].includes(fe(mdOthers[0]))) problems.push('feeling moment wrong'); }
      if (genId === 'p3-feel-okay') { const want = /^Is it okay to feel (sad|mad|scared)\?$/.test(q.prompt) ? 'Yes' : /^Is it okay to (hit|push) when you feel mad\?$/.test(q.prompt) ? 'No' : null; if (!want || q.answer !== want || [...q.choices].sort().join() !== 'No,Yes') problems.push('feeling okay wrong'); }
      // A name-it question shows the face and never says its feeling (the lesson check, pass MD): the answer names the face
      // shown, and the wrong choice names another feeling, never happy and never the one shown.
      if (genId === 'p3-feel-calm') { const shown = q.visual && q.visual.kind === 'face' ? q.visual.feeling : null;
        // The big feeling and the slow breath are said inside the questions since pass MH.
        const want = q.prompt === 'Who can you find to help when your feeling is very big?' ? 'Your grown-up' : q.prompt === 'What can help your very big feeling get smaller?' ? 'A slow breath' : q.prompt === 'When your face looks like this, what can you say?' && shown ? `I feel ${shown}` : /smell as you breathe in slowly\?$/.test(q.prompt) ? 'icon:flower' : /blow out as you breathe out slowly\?$/.test(q.prompt) ? 'icon:candle' : null;
        const nameIt = /what can you say\?$/.test(q.prompt);
        if (!want || q.answer !== want || mdOthers.includes(want) || mdOthers.length !== 1 || (nameIt && (!/^I feel (sad|mad|scared)$/.test(mdOthers[0]) || /\b(happy|sad|mad|scared)\b/.test(`${q.story || ''} ${q.prompt}`)))) problems.push('calming wrong'); }
      // The friend who may need help: happy is the wrong face only where the question asks who might need help; a friend who
      // looks sad or scared is told from another face that needs reading (the lesson check, pass MD).
      if (genId === 'p3-help-who') { const want = /looks sad\.$/.test(q.prompt) ? ['sad'] : /looks scared\.$/.test(q.prompt) ? ['scared'] : /might need help\.$/.test(q.prompt) ? ['sad', 'scared'] : [];
        const foil = mdOthers.length === 1 ? fe(mdOthers[0]) : null; const fair = /might need help\.$/.test(q.prompt) ? foil === 'happy' : !!foil && foil !== 'happy' && foil !== fe(q.answer);
        if (!want.includes(fe(q.answer)) || !fair) problems.push('friend who needs help wrong'); }
      const MD_KIND = ['Are you okay?', 'Sit beside your friend', 'Bring a teddy to hug']; const MD_UNKIND = ['Go away', 'Walk away', 'Laugh at your friend'];
      if (genId === 'p3-help-kind' && (!MD_KIND.includes(q.answer) || mdOthers.length !== 1 || !MD_UNKIND.includes(mdOthers[0]))) problems.push('kind act wrong');
      if (genId === 'p3-help-grownup' && (q.answer !== 'A grown-up' || mdOthers.length !== 1 || !['A toy', 'Nobody', 'The ball'].includes(mdOthers[0]))) problems.push('grown-up wrong');
      // The ball (the lesson check, pass MD): stop, please answers a grab, a grown-up answers a fight, and a grown-up helps you
      // both get to play by helping you take turns. Since pass MH each moment is said inside its question.
      if (genId === 'p3-help-ball') { const want = /^What can you say when .*\bgrab/.test(q.prompt) ? 'Stop, please' : /^How can a grown-up help you both get to play when /.test(q.prompt) ? 'Help you take turns' : /^What can you do when .*(fight starts|grabs)/.test(q.prompt) ? 'Get a grown-up' : null; if (!want || q.answer !== want || mdOthers.length !== 1 || q.story !== null) problems.push('ball fight wrong'); }
      if (genId === 'p3-help-yesno') { const want = /^Is it kind to (ask a sad friend if they are okay|sit beside a friend who is sad|ask your sad grown-up, can I give you a hug)\?$/.test(q.prompt) || q.prompt === 'Should you get a grown-up when a friend is hurt?' ? 'Yes' : /^Is it kind to laugh at a friend who falls and gets hurt\?$|^Is it kind to laugh at a friend who is scared\?$|^Is it okay to push when you both want one ball\?$/.test(q.prompt) ? 'No' : null; if (!want || q.answer !== want) problems.push('kind or not wrong'); }
    }
    // Domain I of pre-K 3 and pre-K 4 (pass MN, earmarks E12 and E13 side by side): every bank re-derived from its words and
    // pictures with tables of this test's own, never the generator's. A kind act is one the lessons say, and the wrong one an act
    // they call unkind or a thing that does not fit the game; a yes or a no comes from what the question asks; a feeling comes
    // from the moment's words, and its wrong face is one the moment could not fairly show; a turn is the one who did not just go;
    // a friend's feeling comes from what the friend likes or thinks, never from what you like.
    { const fe = (c) => (/^face:([a-z]+)$/.exec(String(c)) || [])[1]; const others = (q.choices || []).filter((c) => c !== q.answer); const one = others.length === 1 ? others[0] : null;
      const MN_KIND = { 'p3-join-how': [['Watch the game', 'Can I play too?', 'icon:block', 'Listen to the idea', 'Do you want to play with me?'], ['Grab their blocks', 'Move over!', 'icon:ball', 'Say, my way only!', 'Go away']],
        'p3-join-not-now': [['Play something else', 'Ask again', 'Find another friend'], ['Knock their tower down', 'Grab their blocks', 'Push your friends']],
        'p4-feel-calm': [['A slow breath', 'Count to five', 'icon:teddy', 'Your grown-up', 'Your words', 'icon:flower', 'icon:candle'], ['Throwing a toy', 'Hit a friend', 'icon:ball', 'Nobody', 'A toy to throw', 'icon:candle', 'icon:flower']],
        'p4-kind-words': [['It is okay. I spill too.', 'I will play with you.', 'Are you okay?'], ['Ha ha, you spilled!', 'Go away.', 'Stop crying!', 'Ha ha, you fell!']],
        'p4-help-friend': [['Help wipe it up', 'Ask, can I hold your hand?', 'Sit beside your friend'], ['Point and laugh', 'Walk away', 'Laugh at your friend']],
        'p4-fix-problem': [['Take turns choosing', 'Find a game you both like', 'We want different games', 'A grown-up'], ['Grab the ball', 'Only you choose', 'Say, you are not my friend', 'You are mean', 'Nobody']] };
      if (MN_KIND[genId]) { const [good, bad] = MN_KIND[genId]; if (!good.includes(q.answer) || !one || !bad.includes(one) || q.story !== null) problems.push('kind act wrong'); }
      // The pretend breath: in with the flower, out with the candle; and the ask for a problem friends cannot fix is a grown-up.
      if (genId === 'p4-feel-calm' && /breathe (in|out) slowly\?$/.test(q.prompt) && q.answer !== (/breathe in/.test(q.prompt) ? 'icon:flower' : 'icon:candle')) problems.push('breath wrong');
      if (genId === 'p4-fix-problem' && (/cannot fix it\. Who can help\?$/.test(q.prompt) !== (q.answer === 'A grown-up') || /say what the problem is\?$/.test(q.prompt) !== (q.answer === 'We want different games'))) problems.push('problem fix wrong');
      const MN_YES = { 'p3-join-yesno': [/can I play too\?$|^Is it okay when your friends say, not now\?$|do you want to play with me\?$|^Should you watch the game first /, /knock down your friends|grab your friends|is a ball a good thing to bring\?$/],
        'p4-feel-okay': [/^Is it okay to feel (mad|scared)\?$|^Is it okay to cry when you feel sad\?$|^Is it okay to ask for a hug /, /^Is it okay to (hit|throw a toy|push a friend) when you feel mad\?$/],
        'p4-friends-yesno': [/^Can two friends feel different |^Is it okay to feel (worried|embarrassed)\?$|^Can you ask a friend how they feel\?$/, /^Do friends always (like|feel) the same |^Does a piece of cake make every friend happy\?$/],
        'p4-when-grownup': [/ when (your friend falls and gets hurt|a fight starts and you cannot stop it|your friend is very sad and cannot stop crying)\?$/, / when you and your friend can (take turns choosing the game|find a game you both like)\?$/],
        'p4-good-yesno': [/^Is it kind to (say, it is okay|ask a worried friend, can I hold your hand|say what the problem is)/, /^Is it kind to laugh |^Is it fair if only you choose /] };
      if (MN_YES[genId]) { const [yes, no] = MN_YES[genId]; const want = yes.test(q.prompt) ? 'Yes' : no.test(q.prompt) ? 'No' : null; if (!want || q.answer !== want || [...q.choices].sort().join() !== 'No,Yes') problems.push('yes or no wrong'); }
      // Each moment's feeling and the wrong faces fair to offer with it.
      const MN_MOMENT = { 'p3-join-face': [[/knocks down their tower/, 'sad', ['happy']], [/grabs their blocks/, 'mad', ['scared', 'happy']], [/say, yes, come and play/, 'happy', ['mad', 'sad']], [/nobody will play with/, 'sad', ['happy']], [/listen to her idea/, 'happy', ['sad', 'mad']]],
        'p4-feel-tells': [[/jumps and claps/, 'happy', ['sad']], [/stomps his feet/, 'mad', ['scared', 'happy']], [/hides and holds on tight/, 'scared', ['mad', 'happy']], [/cries and wants a hug/, 'sad', ['happy']], [/gives his friend a high five/, 'happy', ['scared', 'sad', 'mad']], [/make tight fists/, 'mad', ['sad', 'happy']], [/hides from a loud noise/, 'scared', ['happy']], [/cries because he lost his teddy/, 'sad', ['happy']]],
        'p4-new-feeling-moment': [[/first day at a new school/, 'worried', ['mad']], [/spill your milk/, 'embarrassed', ['happy']], [/Grandma by mistake/, 'embarrassed', ['worried']], [/go to the doctor/, 'worried', ['embarrassed']], [/grown-up is late/, 'worried', ['embarrassed']], [/falls down in front of the class/, 'embarrassed', ['happy']]] };
      if (MN_MOMENT[genId]) { const hit = MN_MOMENT[genId].filter(([re]) => re.test(q.prompt)); if (hit.length !== 1 || fe(q.answer) !== hit[0][1] || !one || !hit[0][2].includes(fe(one))) problems.push('feeling moment wrong'); }
      // What a feeling can make you do: the act's own feeling, said on the lesson's first four lines, and a wrong act of another.
      if (genId === 'p4-feel-does') { const ACT = { 'Jump and clap': 'happy', Smile: 'happy', 'Want a hug': 'sad', Cry: 'sad', 'Stomp your feet': 'mad', 'Stomp his feet': 'mad', 'Make tight fists': 'mad', 'Hold on tight': 'scared', Hide: 'scared' };
        const f = (/feels? (happy|sad|mad|scared)\?$/.exec(q.prompt) || [])[1]; if (!f || ACT[q.answer] !== f || !one || !ACT[one] || ACT[one] === f) problems.push('feeling act wrong'); }
      // A feeling's name for the face shown, which the words never say.
      if (genId === 'p4-feel-say') { const f = q.visual && q.visual.kind === 'face' ? q.visual.feeling : null; if (!f || q.answer !== `I feel ${f}` || !one || !/^I feel (happy|sad|mad|scared)$/.test(one) || one === q.answer || /\b(happy|sad|mad|scared)\b/.test(q.prompt)) problems.push('feeling name wrong'); }
      // Worried and embarrassed by the face: tap the face named, or name the face shown.
      if (genId === 'p4-new-feeling-face') { const tap = (/^Tap the (\w+) face\.$/.exec(q.prompt) || [])[1]; const shown = q.visual && q.visual.kind === 'face' ? q.visual.feeling : null;
        const want = tap ? `face:${tap}` : q.prompt === 'How does this face feel?' && shown ? shown[0].toUpperCase() + shown.slice(1) : null; if (!want || q.answer !== want || !one || one === want) problems.push('new feeling face wrong');
        // Two faces a child can fairly take for each other are never set against each other (the test's own pairs, rounds one to four).
        const NEAR = [['scared', 'embarrassed'], ['sad', 'embarrassed'], ['sad', 'worried'], ['scared', 'worried']]; const fa = tap || shown; const fw = fe(one) || String(one || '').toLowerCase();
        if (NEAR.some((p) => p.includes(fa) && p.includes(fw))) problems.push('two faces a child can fairly confuse set against each other'); }
      // Two feelings the same or different, read from the words, with the two faces drawn as the words say them.
      if (genId === 'p4-same-or-different') { const m = /^You feel (\w+), and your friend feels (\w+)\. Are your feelings the same, or different\?$/.exec(q.prompt) || [];
        if (!m[1] || q.answer !== (m[1] === m[2] ? 'The same' : 'Different') || !q.visual || q.visual.a.feeling !== m[1] || q.visual.b.feeling !== m[2]) problems.push('same or different wrong'); }
      // A friend's own feeling: what the friend likes and gets, or how the friend sees the big slide, never what you like.
      // Since round one a friend's dislike is said outright (liking pizza is not disliking cake), and only a stated like or dislike
      // decides the feeling.
      if (genId === 'p4-friend-feels') { const likes = (/your friend likes (\w+)/.exec(q.prompt) || [])[1]; const dislikes = (/your friend does not like (\w+)/.exec(q.prompt) || [])[1]; const gets = (/Your friend gets (?:a piece of |to pet a )?(\w+)/.exec(q.prompt) || [])[1]; const puppy = gets === 'puppy' ? 'dogs' : gets;
        const want = /your friend thinks it is too tall/.test(q.prompt) ? 'scared' : /^Your friend loves the big slide/.test(q.prompt) ? 'happy' : likes && puppy && likes === puppy ? 'happy' : dislikes && puppy && dislikes === puppy ? 'sad' : null;
        if (!want || fe(q.answer) !== want || !one || fe(one) === want) problems.push('friend feeling wrong'); }
      // A yes or no explanation leads with its own answer, and a face's explanation says the sign the test's own table gives it (round
      // one's code check: a face look swapped for another face's, or a Yes explained with No, passed).
      if (['p3-join-yesno', 'p3-help-yesno', 'p4-feel-okay', 'p4-friends-yesno', 'p4-when-grownup', 'p4-good-yesno', 'p4-play-yesno', 'p3-ideas-yesno'].includes(genId) && !(q.answer === 'Yes' ? /^Yes\b/ : /^No\b/).test(q.explain || '')) problems.push('yes or no explanation leads with the other answer');
      { const LOOK_T = { happy: 'It has a big smile.', sad: 'A tear rolls out.', mad: 'Its eyebrows squeeze down.', scared: 'Its eyes open wide.', worried: 'It has a wiggly mouth.', embarrassed: 'Its eyes look down.' };
        const shownFace = genId === 'p4-feel-say' && q.visual ? q.visual.feeling : genId === 'p4-new-feeling-face' ? (q.visual ? q.visual.feeling : (/^Tap the (\w+) face\.$/.exec(q.prompt) || [])[1]) : null;
        if (shownFace && !(q.explain || '').includes(LOOK_T[shownFace])) problems.push('a face explained by another face\'s sign'); }
      // Let's play together (pass MO, earmark E13): a way to start, a sign or a word that builds a friendship, and a plan, each from
      // the test's own lists, the answer a kind or friendly way and the wrong choice an unkind or bossy one; each answer kept to the
      // question that asks it, so a row's answer moved to another row's question is caught.
      const MO_KIND = { 'p4-play-start': [[/^What can you do first to start playing /, 'Smile and say hi', 'Grab their toy'], [/What can you ask about the game\?$/, 'What are you making?', 'Give me your blocks!'], [/kind thing can you say about your friend's tower\?$/, 'I like your tower!', 'My tower is better!'], [/^What can you say to ask a new friend to play\?$/, 'Do you want to play with me?', 'Play with me now!'], [/^Ana wants to tell a new friend her name\./, 'Hi, I am Ana.', 'Go away.'], [/says, no thanks\. What can you do\?$/, 'Ask another friend', 'Grab the toy'], [/^You get to school and see your teacher\. What can you say\?$/, 'Good morning!', 'Give me the crayons!']],
        'p4-play-body': [[/your hand to say hi\?$/, 'Wave', 'Push'], [/show your friend you are listening\?$/, 'Nod your head', 'Shout while your friend talks'], [/^What can you do when your friend talks\?$/, 'Listen', 'Say, stop talking!'], [/I am happy to play with you, without any words\?$/, 'A smile', 'A push'], [/both get a turn to talk\?$/, 'Take turns talking', 'Only you talk'], [/how can you show you had fun\?$/, 'Give a high five', 'Say, I did it all!']],
        'p4-play-plan': [[/build a house with blocks\. What can you do first\?$/, 'Make a plan', 'Grab all the blocks'], [/^What does a plan say\?$/, 'What you will make, and who does each part', 'Who gets all the blocks'], [/a new idea for the game\. What can you do\?$/, 'Say it, and ask, is that okay?', 'Knock the house down'], [/your friend builds the roof\. What can you do\?$/, 'Do your part', 'Do every part yourself'], [/ask your friend for a block\?$/, 'Can you pass me a block?', 'Give me that!']] };
      if (MO_KIND[genId]) { const hit = MO_KIND[genId].filter(([re]) => re.test(q.prompt)); if (hit.length !== 1 || q.answer !== hit[0][1] || one !== hit[0][2] || q.story !== null) problems.push('play together row wrong'); }
      if (genId === 'p4-play-yesno') { const want = /^Is a smile and a hi |^Is it okay when a new friend says, no thanks\?$|^Can a plan say who does each part\?$|^Can you say good morning to your teacher\?$|^Can a wave say hi /.test(q.prompt) ? 'Yes' : /^Is it kind to (grab|shout) |^Is it playing together if one friend does every part\?$/.test(q.prompt) ? 'No' : null;
        if (!want || q.answer !== want || [...q.choices].sort().join() !== 'No,Yes') problems.push('play together yes or no wrong'); }
      // Who does which part: the asked part, turned to the you form with the test's own table, belongs to you when the plan says
      // you do it and to your friend when the plan says your friend does it, and to exactly one of you.
      if (genId === 'p4-play-part') { const BASE = { builds: 'build', makes: 'make', brings: 'bring', pours: 'pour', passes: 'pass', drives: 'drive', rings: 'ring', draws: 'draw', sells: 'sell', buys: 'buy' };
        const m = /^Who (\w+) (.+)\?$/.exec(q.prompt) || []; const base = BASE[m[1]]; const story = q.story || '';
        const mine = base && new RegExp(`(?:^|, and )(?:Y|y)ou ${base} ${m[2]}\\b`).test(story.replace(/^You and your friend [^.]+\. /, '')); const theirs = m[1] && new RegExp(`(?:Y|y)our friend ${m[1]} ${m[2]}\\b`).test(story);
        const want = mine && !theirs ? 'You' : theirs && !mine ? 'Your friend' : null; if (!want || q.answer !== want || [...q.choices].sort().join() !== 'You,Your friend') problems.push('plan part wrong'); }
      // Two ideas (pass MO): of the four shapes, one fits both ideas, one only the color or the size, one only the shape and one
      // neither (since round one's lesson check: with three, the answer was the one choice like each other one, so a child could tap
      // it by look alone); who has which thing and how each friend feels offer exactly the two the sentence names.
      if (genId === 'p3-ideas-looks' || genId === 'p3-ideas-sizes') { const look = (x) => { const m = /^item:(\w+)-(\w+)$/.exec(x) || /^shape:(\w+):(\w+)$/.exec(x); return m ? [m[1], m[2]] : [null, null]; };
        const [f, k] = look(q.answer); const rest = (q.choices || []).filter((x) => x !== q.answer).map(look);
        // Two shapes and two colors or sizes only (round two's code check: a fourth in a third shape and a third color passed, the
        // answer again the one like two others); and the screen draws them two by two (corners).
        const all = [[f, k], ...rest];
        if (rest.length !== 3 || !rest.some(([f2, k2]) => f2 !== f && k2 === k) || !rest.some(([f2, k2]) => f2 === f && k2 !== k) || !rest.some(([f2, k2]) => f2 !== f && k2 !== k) || new Set(all.map(([a]) => a)).size !== 2 || new Set(all.map(([, b]) => b)).size !== 2 || new Set(all.map(String)).size !== 4 || q.corners !== true) problems.push('two ideas wrong choices are not the other three corners'); }
      if (genId === 'p3-ideas-who-has') { const m = /^Listen\. The (\w+) has a \w+, and the (\w+) has a \w+\.$/.exec(q.story || ''); if (!m || [...q.choices].sort().join() !== [`pic:${m[1]}`, `pic:${m[2]}`].sort().join()) problems.push('who has offers the wrong animals'); }
      if (genId === 'p3-ideas-feels') { const m = /^Listen\. \w+ feels (\w+), and \w+ feels (\w+)\.$/.exec(q.story || ''); if (!m || m[1] === m[2] || [...q.choices].sort().join() !== [`face:${m[1]}`, `face:${m[2]}`].sort().join()) problems.push('how each feels offers the wrong faces'); }
      // Whose turn now: the one who did not just go.
      if (genId === 'p3-join-turn') { const want = /, and your friend just /.test(q.prompt) ? 'Your turn' : /, and you just /.test(q.prompt) ? "Your friend's turn" : null; if (!want || q.answer !== want || [...q.choices].sort().join() !== "Your friend's turn,Your turn") problems.push('turn wrong'); }
    }
    // One more and one fewer (pass ME, earmark E12 part two): the count in the words plus or minus one, re-derived with the test's
    // own number words; the picture shows the count before the change, and a wrong group is never the answer's count.
    { const NW = { one: 1, two: 2, three: 3, four: 4, five: 5 }; const dc = (c) => Number((String(c).match(/^dots:(\d+)$/) || [])[1]);
      // Since pass MJ the two group kinds ask in one sentence (than these three dots), so their count is read from the question.
      const n0 = NW[((q.story || '').match(/^Here (?:is|are) (\w+) dots?\./) || (q.prompt || '').match(/than (?:this|these) (\w+) dots?\.$/) || [])[1]];
      if (/^p3-(one-more-group|one-fewer-group)$/.test(genId) && (q.story || !((n0 === 1 && /than this one dot\.$/.test(q.prompt)) || (n0 > 1 && /than these \w+ dots\.$/.test(q.prompt))))) problems.push('this or these wrong');
      if (/^p3-(add-one|take-one|more-or-fewer-now)$/.test(genId) && ((n0 === 1 && !/^Here is one dot\./.test(q.story)) || (n0 > 1 && !/^Here are /.test(q.story)))) problems.push('here is or here are wrong');
      const omOthers = (q.choices || []).filter((c) => c !== q.answer);
      if (genId === 'p3-add-one' && (!n0 || !/One more dot comes\.$/.test(q.story) || dc(q.answer) !== n0 + 1 || q.visual.count !== n0 || omOthers.length !== 1 || omOthers.some((c) => dc(c) === n0 + 1) || q.explainVisual.count !== n0 + 1)) problems.push('add one wrong');
      if (genId === 'p3-take-one' && (!n0 || !/One dot goes away\.$/.test(q.story) || dc(q.answer) !== n0 - 1 || q.visual.count !== n0 || omOthers.length !== 1 || omOthers.some((c) => dc(c) === n0 - 1) || q.explainVisual.count !== n0 - 1)) problems.push('take one wrong');
      if (genId === 'p3-more-or-fewer-now') { const want = /We add one dot\.$/.test(q.story || '') ? 'More' : /One dot goes away\.$/.test(q.story || '') ? 'Fewer' : null; if (/\b(more|fewer)\b/i.test(q.story || '')) problems.push('the heard words hand over the answer'); const numWord = (k) => ['zero', 'one', 'two', 'three', 'four', 'five'][k]; if (n0 && want && q.explain !== (want === 'More' ? `We added one dot, so there are more dots now. ${numWord(n0)[0].toUpperCase()}${numWord(n0).slice(1)} and one more is ${numWord(n0 + 1)}.` : `One dot went away, so there are fewer dots now. ${numWord(n0)[0].toUpperCase()}${numWord(n0).slice(1)} take away one is ${numWord(n0 - 1)}.`)) problems.push('the more-or-fewer explanation sums wrong'); if (!n0 || !want || q.answer !== want || [...q.choices].sort().join() !== 'Fewer,More' || q.visual.count !== n0 || q.explainVisual.count !== (want === 'More' ? n0 + 1 : n0 - 1)) problems.push('more or fewer now wrong'); }
      if (genId === 'p3-one-more-group' && (!n0 || dc(q.answer) !== n0 + 1 || omOthers.length !== 1 || omOthers.some((c) => dc(c) === n0 + 1) || q.visual.count !== n0 || !(q.explainVisual && q.explainVisual.kind === 'pair' && q.explainVisual.stack && q.explainVisual.a.count === n0 + 1 && q.explainVisual.b.count === n0))) problems.push('one more group wrong');
      if (genId === 'p3-one-fewer-group' && (!n0 || dc(q.answer) !== n0 - 1 || omOthers.length !== 1 || omOthers.some((c) => dc(c) === n0 - 1) || q.visual.count !== n0 || !(q.explainVisual && q.explainVisual.kind === 'pair' && q.explainVisual.stack && q.explainVisual.a.count === n0 && q.explainVisual.b.count === n0 - 1))) problems.push('one fewer group wrong');
      // The explanation counts to the answer, one word a dot (the lesson check's second read: a count that stopped short or ran past passed).
      if (/^p3-(add-one|take-one|one-more-group|one-fewer-group)$/.test(genId)) { const up = ((q.explain || '').match(/\. (One(?:, \w+)*)\.$/) || [])[1]; if (!up || up.split(', ').length !== dc(q.answer) || up.split(', ').join(' ') !== ['One', 'two', 'three', 'four', 'five'].slice(0, dc(q.answer)).join(' ')) problems.push('the explanation counts wrong'); }
    }
    // Words that rhyme (pass ME, earmark E12 part two): the test's own rhyme families; the answer rhymes with the asked word and
    // a wrong picture never does; the pair a yes-or-no question shows is the pair its prompt names; the odd one is the one whose
    // ending no other choice shares.
    { const RH = { ball: 'all', wall: 'all', dog: 'og', log: 'og', frog: 'og', cat: 'at', hat: 'at', moon: 'oon', spoon: 'oon', sock: 'ock', block: 'ock', rock: 'ock', bear: 'air', chair: 'air', bee: 'ee', tree: 'ee' };
      const nameOf = (c) => String(c).replace(/^(?:icon|pic):/, ''); const rhOthers = (q.choices || []).filter((c) => c !== q.answer);
      const NEAR = { og: ['ock'], ock: ['og', 'all'], all: ['ock'] };   // dog and sock sound close for many Texas speakers, and the wall and rock icons look alike, so neither is the other's wrong choice
      if (/^p3-rhyme-/.test(genId)) { const names = [...(q.choices || []).filter((c) => /^(?:icon|pic):/.test(String(c))).map(nameOf), ...(q.visual && q.visual.kind === 'pair' ? [q.visual.a.name, q.visual.b.name] : []), ...(q.visual && q.visual.kind !== 'pair' && q.visual.name ? [q.visual.name] : []), ...((q.prompt.match(/^Do (\w+) and (\w+) rhyme\?$/) || []).slice(1))]; if (names.some((n) => !RH[n])) problems.push('a rhyme picture the table does not know'); const rimes = new Set(names.map((n) => RH[n])); if ([...rimes].some((r) => (NEAR[r] || []).some((x) => rimes.has(x)))) problems.push('a near rhyme offered against its neighbor'); }
      if (genId === 'p3-rhyme-tap' || genId === 'p3-rhyme-listen') { const w = (q.prompt.match(/rhymes with (\w+)\.$/) || [])[1];
        if (!w || !RH[w] || RH[nameOf(q.answer)] !== RH[w] || nameOf(q.answer) === w || rhOthers.length !== 1 || rhOthers.some((c) => RH[nameOf(c)] === RH[w]) || (genId === 'p3-rhyme-tap' ? !(q.visual && q.visual.name === w && q.story === (w === 'moon' ? 'This is the moon.' : `This is a ${w}.`)) : q.visual !== null || !q.prompt.startsWith('Listen. '))) problems.push('rhyme tap wrong');
        // The explanation names the rhyme and the odd one by their own names (the lesson check's second read).
        if (w && !(String(q.explain).startsWith(`${w[0].toUpperCase()}${w.slice(1)} and ${nameOf(q.answer)} rhyme.`) && String(q.explain).endsWith(`does not rhyme with ${w}.`) && rhOthers.every((c) => String(q.explain).includes(`${nameOf(c)[0].toUpperCase()}${nameOf(c).slice(1)} does not rhyme`)))) problems.push('the rhyme explanation names the wrong picture'); }
      if (genId === 'p3-rhyme-yesno') { const m2 = q.prompt.match(/^Do (\w+) and (\w+) rhyme\?$/); const want = m2 && RH[m2[1]] === RH[m2[2]] ? 'Yes' : 'No';
        if (!m2 || m2[1] === m2[2] || q.answer !== want || [...q.choices].sort().join() !== 'No,Yes' || !(q.visual && q.visual.kind === 'pair' && q.visual.a.name === m2[1] && q.visual.b.name === m2[2])) problems.push('rhyme yes-no wrong');
        // The explanation says yes or no as the answer does, and names the two words asked (the final read: three kinds had no words check).
        if (m2 && q.explain !== (want === 'Yes' ? `Yes, they rhyme. ${m2[1][0].toUpperCase()}${m2[1].slice(1)} and ${m2[2]} sound the same at the end.` : `No, they do not rhyme. ${m2[1][0].toUpperCase()}${m2[1].slice(1)} and ${m2[2]} do not sound the same at the end.`)) problems.push('the yes-or-no explanation says the wrong thing'); }
      if (genId === 'p3-rhyme-odd') { const names = q.choices.map(nameOf); const odd = names.filter((n) => names.filter((x) => RH[x] === RH[n]).length === 1); if (names.length !== 3 || odd.length !== 1 || nameOf(q.answer) !== odd[0]) problems.push('rhyme odd one wrong');
        // The explanation names the two that rhyme and the odd one by their own names.
        const pair = names.filter((n) => n !== odd[0]); const cap = (s) => `${s[0].toUpperCase()}${s.slice(1)}`; const m3 = String(q.explain).match(/^(\w+) and (\w+) rhyme\. /); const said = m3 ? [m3[1].toLowerCase(), m3[2]] : []; if (odd.length === 1 && !([...said].sort().join() === [...pair].sort().join() && String(q.explain).endsWith(`${cap(odd[0])} does not sound the same at the end, so it does not rhyme with them.`))) problems.push('the odd-one explanation names the wrong picture'); }
    }
    // Listen and Point (pass MB): every bank re-derived from its words and pictures with tables of the test's own (the lesson
    // brief found five of the course's eight kinds had none).
    { const mbShape = (c) => String(c).replace(/^(?:item|shape|icon):/, '').split(/[-~#]/)[0];
      const mbOthers = (q.choices || []).filter((c) => c !== q.answer);
      const ROUND = ['ball', 'plate']; const CORNERS = ['block', 'window'];
      if (genId === 'p3-tap-shape') { const want = (q.prompt.match(/^Tap the (circle|square)\.$/) || [])[1]; if (!want || mbShape(q.answer) !== want || mbOthers.some((c) => mbShape(c) === want)) problems.push('tap shape wrong'); }
      if (genId === 'p3-name-shape' && (q.answer !== q.visual.name || !['circle', 'square'].includes(q.answer))) problems.push('name shape wrong');
      if (genId === 'p3-shape-by-corners') { const want = /four corners/.test(q.prompt) ? 'square' : 'circle'; if (mbShape(q.answer) !== want || mbOthers.some((c) => mbShape(c) === want)) problems.push('shape by corners wrong'); }
      if (genId === 'p3-shape-thing') { const a = mbShape(q.answer); const w = mbShape(mbOthers[0]); const round = /round like a circle/.test(q.prompt); const corners = /corners like a square/.test(q.prompt); const rolls = /rolls\.$/.test(q.prompt);
        if ((round && (!ROUND.includes(a) || ROUND.includes(w))) || (corners && (!CORNERS.includes(a) || CORNERS.includes(w))) || (rolls && (a !== 'ball' || w === 'ball' || w === 'plate')) || (!round && !corners && !rolls)) problems.push('shape thing wrong'); }
      if (genId === 'p3-same-shape-any-size') { if (mbShape(q.answer) !== q.visual.name || mbShape(mbOthers[0]) === q.visual.name || q.answer === csTokenOf(q.visual)) problems.push('same shape wrong'); }
      if (genId === 'p3-tap-ab' && q.answer !== (q.prompt.match(/^Tap the letter ([AB])\.$/) || [])[1]) problems.push('tap letter wrong');
      if (genId === 'p3-name-ab' && q.answer !== q.visual.text.charAt(0).toUpperCase()) problems.push('name letter wrong');
      // A and B by their looks (pass MC), from the test's own table: A's slanted sides meet at the top, B has two round bumps,
      // and each look-alike is the one the description rules out (H straight sides, V meeting at the bottom, P and D one bump).
      const MC_LOOK = { 'Tap the letter with two slanted sides that meet at the top.': 'A', 'Tap the letter with two round bumps on one side.': 'B' };
      const MC_TWINS = { A: ['H', 'V'], B: ['P', 'D'] };
      // Each look-alike is told apart in the explanation by its own look (pass MC, the lesson check's second suggestion).
      const MC_WHY = { H: /stand up straight and never meet/, V: /meet at the bottom, and it has no bar/, P: /just one bump/, D: /just one bump/ };
      const mcTwinSaid = () => mbOthers.length === 1 && MC_WHY[mbOthers[0]] && MC_WHY[mbOthers[0]].test(q.explain);
      if (genId === 'p3-ab-by-look' && (q.answer !== MC_LOOK[q.prompt] || mbOthers.length !== 1 || !MC_TWINS[q.answer].includes(mbOthers[0]) || !mcTwinSaid())) problems.push('letter by its look wrong');
      if (genId === 'p3-ab-look-alike') { const L = ((q.story || '').match(/^One of these is the letter ([AB]), and the other only looks a little like it\.$/) || [])[1];
        if (!L || q.answer !== L || q.prompt !== `Tap the letter ${L}.` || mbOthers.length !== 1 || !MC_TWINS[L].includes(mbOthers[0]) || !mcTwinSaid()) problems.push('look-alike letter wrong'); }
      // A or B inside a sign word (pass MC): the word said in the setup is the word shown, its letters are the choices in order,
      // each once, and the asked letter is in it exactly once.
      if (genId === 'p3-ab-in-word') { const w = ((q.story || '').match(/^Here is the word ([a-z]+), the way a sign shows it\.$/) || [])[1]; const L = (q.prompt.match(/^Tap the letter ([AB])\.$/) || [])[1];
        if (!w || !L || !q.visual || q.visual.text !== w.toUpperCase() || q.choices.join('') !== q.visual.text || new Set(q.choices).size !== q.choices.length || q.answer !== L || q.choices.filter((c) => c === L).length !== 1) problems.push('letter in a sign word wrong'); }
      if (genId === 'p3-odd-one') { const shown = `item:${q.visual.shape}-${q.visual.colour}`; if (q.answer === shown || mbOthers[0] !== shown || q.visual.size !== 64 || mbShape(q.answer) === q.visual.shape || String(q.answer).split('-')[1] === q.visual.colour) problems.push('odd one wrong'); }
      if (['p3-odd-color', 'p3-odd-shape', 'p3-odd-size'].includes(genId)) {
        const base = (c) => String(c).split('#')[0].replace(/^item:/, ''); const same = mbOthers.map(base);
        const [as, ac, az] = base(q.answer).split('-'); const [ss, sc, sz] = (same[0] || '').split('-');
        const by = { 'p3-odd-color': 'color', 'p3-odd-shape': 'shape', 'p3-odd-size': 'size' }[genId];
        const differs = { shape: as !== ss, color: ac !== sc, size: (az || '') !== (sz || '') };
        if (same.length !== 2 || same[0] !== same[1] || !differs[by] || Object.entries(differs).some(([k, v]) => k !== by && v)) problems.push('odd by ' + by + ' wrong');
        if (by === 'color' && [ac, sc].sort().join() === 'green,red') problems.push('red against green'); }
      if (genId === 'p3-sort-out') { const ac = String(q.answer).split('-')[1]; if (ac === q.visual.colour || String(mbOthers[0]).split('-')[1] !== q.visual.colour || mbShape(q.answer) !== mbShape(mbOthers[0])) problems.push('sort out wrong'); }
      if (genId === 'p3-tap-by-clue') { const T = { 'shines in the day': 'sun', 'swims in the water': 'fish', 'grows tall, with a trunk': 'tree', 'grows on a plant': 'flower', 'we drink from': 'cup', 'floats high in the sky': 'cloud', 'falls from the clouds': 'rain', 'has wings': 'bird', 'we cut into slices to eat': 'pizza' };
        const clue = q.prompt.replace(/^Tap the one (that )?/, '').replace(/\.$/, ''); const want = T[clue];
        if (!want || q.answer !== 'icon:' + want || mbOthers.includes('icon:' + want) || (/sky/.test(clue) && mbOthers.some((c) => ['icon:sun', 'icon:moon', 'icon:bird'].includes(c))) || (/shines/.test(clue) && mbOthers.includes('icon:moon')) || (/slices/.test(clue) && mbOthers.some((c) => ['icon:fish', 'icon:bird'].includes(c)))) problems.push('tap by clue wrong'); }
      if (genId === 'p3-up-or-down') { const up = /up in the sky/.test(q.prompt); const SKY = ['icon:sun', 'icon:moon', 'icon:cloud'];
        if (up ? (!SKY.includes(q.answer) || mbOthers.some((c) => SKY.includes(c) || ['icon:bird', 'icon:rain', 'icon:tree'].includes(c))) : (q.answer !== 'icon:fish' || mbOthers.some((c) => ['icon:rain', 'icon:cup', 'icon:fish', 'icon:bird', 'icon:flower'].includes(c)))) problems.push('up or down wrong'); }
      if (genId === 'p3-animal-order') { const m = (q.story || '').match(/^Listen\. (\w+), then (\w+)\.$/); const w = (q.prompt.match(/hear (first|second)\?$/) || [])[1];
        if (!m || !w || lsSounds[String(q.answer).replace('pic:', '')] !== (w === 'first' ? m[1].toLowerCase() : m[2])) problems.push('animal order wrong'); }
      if (genId === 'p3-two-at-once') { const ws = (q.prompt.match(/says (\w+)\.$/) || [])[1];
        if (lsSounds[String(q.answer).replace('pic:', '')] !== ws || !q.choices.every((c) => (q.story || '').includes(lsSounds[c.replace('pic:', '')])) || q.choices.includes('pic:bear')) problems.push('two at once wrong'); }
    }
    // Why each wrong answer does not fit (pass MH, Mikey: "explanations for each wrong answer too", the tapped one named as the
    // one the child chose, and "other examples of correct answers after the explanations"). Every pre-K 3 choice question
    // carries whyNot, one entry for each wrong choice and none for the answer: a name that opens a sentence with a capital and
    // a why that goes on in lower case to a period, so both "name why" and "name, which you just chose, why" read as English,
    // eighteen words at most together (a pre-reader hears the line before "Have another try"), and no colon, semicolon, dash
    // or quotation mark. alsoRight is up to three whole sentences of twenty words or fewer. Each picture's name, and how its
    // why begins, are re-derived from the picture's own token with this test's own words, so neither can disagree with the
    // drawing: a red name on a blue circle, a smile on the sad face, three corners on a square, quack for the cat.
    if (P3_NOTED.has(genId) && q.type === 'choice') {
      const wnp = []; if (live) WN_KINDS.add(genId); const wn = q.whyNot; const wnWrongs = (q.choices || []).filter((c) => c !== q.answer);
      const WN_MARKS = /[:;\u2014\u2013"\u201C\u201D\u2018\u2019]|(^|[^A-Za-z])'|'(?![A-Za-z])/;   // an apostrophe inside a word (a friend's toy) is fine
      const wnCount = (t) => String(t).trim().split(/\s+/).length;
      const wnHas = (name, w) => new RegExp(`\\b${w}\\b`, 'i').test(name);
      const WN_NUM = ['zero', 'one', 'two', 'three', 'four', 'five'];
      // Sad by its tear (the lesson check, pass MH): the mad face's mouth turns down too, so the mouth never tells sad from mad.
      // Worried by its wiggly mouth and embarrassed by its eyes that look down (pass MN): the sad face's eyebrows rise in the middle
      // as the worried face's do, and the happy face has pink cheeks as the embarrassed face does.
      const WN_SIGN = { happy: 'a big smile', sad: 'a tear rolling out', mad: 'eyebrows that squeeze down', scared: 'wide-open eyes', worried: 'a wiggly mouth', embarrassed: 'eyes that look down' };
      const WN_FACE = Object.fromEntries(Object.entries(WN_SIGN).map(([f, sign]) => [f, `has ${sign}`]));
      // A shape's why opens on its corners, or, for a square or a long rectangle beside the other, on its sides (pass ML).
      // Since pass MQ the vocabulary lessons' words for a shape too (Learning words, More learning words): a triangle "has three sides
      // and three corners", a circle "is round, with no straight sides and no corners", a long rectangle "has two long sides".
      const WN_SHAPE = { circle: ['is round, with no corners', 'is round, with no straight sides and no corners'], square: ['has four corners', 'has four sides'], triangle: ['has three corners', 'has three sides and three corners'], rectangle: ['has four corners', 'is long', 'has two long sides and two short sides'] };
      const WN_LOOK = { small: 'little', thin: 'thin', wide: null, turned: null };   // a square turned on its corner, an upside-down triangle; the lesson never says wide
      const WN_SAYS = { cat: 'meow', duck: 'quack', bee: 'buzz', frog: 'ribbit', owl: 'hoot', bear: 'growl' };
      const WN_LETTER = { A: 'has slanted sides', B: 'has two round bumps', H: 'has a bar too', V: 'has sides that meet at the bottom', P: 'has just one bump', D: 'has just one bump' };
      // Pre-K 4's seven letters, each by the words its Big letters line gives it (pass MM).
      // Since pass MN (Q50) the tracing lessons' six letters too, each by its lines as the tracing lessons and Find the Letter say them.
      const WN_LETTER_P4 = { A: 'has two slanted sides and a bar across the middle', B: 'has two round bumps', C: 'is curved, like a cookie with a bite out of it', D: 'has a straight line and one big curve', E: 'has a line down and three lines across', M: 'has two pointy hills', S: 'is curvy, like a snake', L: 'goes down, then across the bottom', T: 'goes down the middle, then one line across the top', O: 'goes around to the left, all the way back to where it started', I: 'is one line, straight down', H: 'is two lines down, then a bridge across the middle', F: 'is a line down, then two lines across' };
      if (!wn || typeof wn !== 'object') wnp.push('a pre-K 3 choice question has no whyNot');
      else {
        if (Object.prototype.hasOwnProperty.call(wn, q.answer)) wnp.push('whyNot has an entry for the answer');
        for (const c of wnWrongs) if (!wn[c]) wnp.push(`whyNot has no entry for the wrong choice ${c}`);
        for (const k of Object.keys(wn)) if (!wnWrongs.includes(k)) wnp.push(`whyNot has an entry for ${k}, which is not a wrong choice`);
        for (const [c, e] of Object.entries(wn)) {
          if (!e || typeof e.name !== 'string' || typeof e.why !== 'string') { wnp.push(`whyNot for ${c} is not a name and a why`); continue; }
          const line = `${e.name} ${e.why}`; const off = (what) => wnp.push(`whyNot ${what} for ${c}: ${line}`);
          if (!/^[A-Z]/.test(e.name)) off('name does not start with a capital');
          if (!/^[a-z]/.test(e.why) || !/\.$/.test(e.why)) off('why does not start in lower case and end with a period');
          if (wnCount(line) > 18) off('line is over 18 words');
          if (WN_MARKS.test(e.name) || WN_MARKS.test(e.why)) off('line has a colon, semicolon, dash or quotation mark');
          // The name and the start of the why, from the choice's own token.
          const item = /^item:([a-z]+)-([a-z]+)(?:-([a-z]+))?(?:#\d+)?$/.exec(c); const pic = /^(?:pic|icon):([a-z]+)(?:#\d+)?$/.exec(c); const dots = /^dots:(\d+)$/.exec(c);
          const face = /^face:([a-z]+)$/.exec(c); const swatch = /^swatch:([a-z]+)$/.exec(c); const shape = /^shape:([a-z]+)(?:~([a-z]+))?(?:#\d+)?$/.exec(c);
          const art = /^(?:art|solid):([a-z]+)(?:#\d+)?$/.exec(c); const look = /^look:(dots|circles)-(\d)-(long|close|big|little)$/.exec(c);
          if (art && !wnHas(e.name, art[1])) off('name is not its own picture');
          if (look) { const lookSaid = { long: 'long', close: 'close', big: 'big', little: 'little' }[look[3]]; if (!wnHas(e.name, WN_NUM[Number(look[2])]) || !wnHas(e.name, lookSaid)) off('name is not its own group and look'); }
          const sized = /^shape:([a-z]+):(big|medium|small)$/.exec(c); const bar = /^(bar|tower):(\d+)$/.exec(c);
          // A color the reason says the choice is not is no color given to it (Two ideas' fourth corner, round three: "is not yellow,
          // and it is not a triangle.").
          const firstColor = (e.why.replace(/\bnot (?:red|blue|yellow|green)\b/g, '').match(/\b(red|blue|yellow|green)\b/) || [])[1];
          if (item && /^p3-odd-/.test(genId)) { if (e.name !== 'This one') off('name names a shape or color its lesson does not teach'); }
          else if (item && genId === 'p3-sort-out') { if (e.name !== `The ${item[2]} one`) off('name is not its own color'); }
          else if (item) { if (!wnHas(e.name, item[1]) || !wnHas(e.name, item[2]) || (item[3] && !wnHas(e.name, item[3]))) off('name is not its own color and shape'); }
          if (item) { if (firstColor && firstColor !== item[2]) off('why gives it another color'); }
          // A reason never says a choice is not what it is: whyDeniesOwn, above the main loop (pass MO, rounds four to nine).
          if (whyDeniesOwn(c, q.choices, e.why)) off('why says it is not its own color, size or shape');
          if (swatch) { if (!wnHas(e.name, swatch[1])) off('name is not its own color'); if (firstColor && firstColor !== swatch[1]) off('why gives it another color'); }
          if (pic) { if (!wnHas(e.name, pic[1])) off('name is not its own picture'); if (/^p3-(animal-sound|animal-order|two-at-once)$/.test(genId) && !e.why.startsWith(`says ${WN_SAYS[pic[1]]}`)) off('why gives the animal another sound'); }
          if (dots) { const n = Number(dots[1]); if (!wnHas(e.name, WN_NUM[n]) || !wnHas(e.name, n === 1 ? 'dot' : 'dots')) off('name is not its own count'); }
          if (face) { if (!wnHas(e.name, face[1])) off('name is not its own feeling'); if (!e.why.startsWith(WN_FACE[face[1]])) off('why gives the face another sign'); }
          for (const m of e.why.matchAll(/\b(?:a|the) (happy|sad|mad|scared|worried|embarrassed) face has ([^,.]+)/g)) if (m[2] !== WN_SIGN[m[1]]) off(`why gives a ${m[1]} face another sign`);
          // The face shown is the question's own picture where it has one (the calm rows say I feel sad, so the answer cannot
          // name it; the code check's second read), else a feeling-word answer; a "goes with" part names the tapped feeling's sign,
          // and a friend's look its own sign (the lesson check's second read: the mouth crept back into two places unseen).
          { const shown = q.visual && q.visual.kind === 'face' ? q.visual.feeling : /^(happy|sad|mad|scared|worried|embarrassed)$/i.test(String(q.answer)) ? String(q.answer).toLowerCase() : null; const m = /this face has ([^,.]+)/.exec(e.why);
            if (m && shown && m[1] !== WN_SIGN[shown] && !(shown === 'sad' && m[1] === 'a tear')) off('why gives the face shown another sign');
            const GOES = { happy: 'a big smile', sad: 'a tear', mad: 'eyebrows that squeeze down', scared: 'wide-open eyes' };
            const gw = /^goes with ([^,.]+)/.exec(e.why); const felt = /I feel (happy|sad|mad|scared)/.exec(c); if (gw && felt && gw[1] !== GOES[felt[1]]) off('why gives the tapped feeling another sign');
            const friend = /a (sad|scared) friend(?: has|'s) ([^,.]+)/.exec(e.why); if (friend && !((friend[1] === 'sad' && friend[2] === 'a tear rolling out') || (friend[1] === 'scared' && friend[2] === 'eyes open wide'))) off('why gives a friend another sign'); }
          if (/^(Happy|Sad|Mad|Scared|Worried|Embarrassed)$/.test(c)) { const m = /(?:would|can) show ([^,.]+)/.exec(e.why); if (m && m[1] !== WN_SIGN[c.toLowerCase()]) off('why gives the named feeling another sign'); }
          if (shape) { if (!wnHas(e.name, shape[1]) || (shape[2] && WN_LOOK[shape[2]] && !wnHas(e.name, WN_LOOK[shape[2]]))) off('name is not its own shape and look'); if (!(WN_SHAPE[shape[1]] || []).some((s) => e.why.startsWith(s))) off('why gives the shape another look'); }
          if (sized) { const rank = { small: 1, medium: 2, big: 3 }; const others = q.choices.filter((x) => x !== c).map((x) => rank[x.split(':')[2]]);
            const size = /^p4-/.test(genId) ? (others.every((r) => r > rank[sized[2]]) ? 'smaller' : 'bigger') : { big: 'big', medium: 'middle', small: 'little' }[sized[2]];
            if (!wnHas(e.name, sized[1]) || !wnHas(e.name, size)) off('name is not its own shape and size'); }
          if (bar) { const others = q.choices.filter((x) => x !== c).map((x) => Number(x.split(':')[1])); const how = others.every((v) => v > Number(bar[2])) ? 'shorter' : bar[1] === 'bar' ? 'longer' : 'taller';
            if (!wnHas(e.name, bar[1] === 'bar' ? 'line' : 'tower') || !wnHas(e.name, how)) off('name is not its own line or tower'); }
          // A letter by name only where the A and B lesson names it; any other is the other letter (the lesson check, pass MH).
          if (/^[A-Z]$/.test(c) && /^pl-/.test(genId)) { if (e.name !== `The letter ${c}`) off('name is not its own letter'); if (e.why !== `${WN_LETTER_P4[c]}.`) off('why gives the letter another look'); }
          else if (/^[A-Z]$/.test(c)) { if (e.name !== (['A', 'B', 'H', 'P'].includes(c) ? `The letter ${c}` : 'This letter')) off('name is not its own letter'); if (!e.why.startsWith(WN_LETTER[c] || 'is not ')) off('why gives the letter another look'); }
          // Is this the letter named? Yes means the named letter, and the reason gives the shown letter's own sign; No means
          // another letter, and the reason gives the named letter's sign (pass MM, in plain words since round two).
          if (genId === 'pl-is-letter') { const asked = (q.prompt.match(/^Is this the letter ([A-Z])\?$/) || [])[1]; const want = c === 'Yes' ? `means it is ${asked}, but it ${WN_LETTER_P4[q.visual.text]}.` : `means another letter, but it ${WN_LETTER_P4[asked]}.`; if (e.why !== want) off('why is not the shown letter\'s own sign'); }
          if (/^(red|blue|yellow|green|circle|square|triangle|Happy|Sad|Mad|Scared|Worried|Embarrassed|meow|quack|buzz|ribbit|hoot|growl)$/.test(c) && !wnHas(e.name, c)) off('name is not its own word');
          if (/^(Yes|No|More|Fewer)$/.test(c) && e.name !== c) off('name is not its own word');
          if (/^[123]$/.test(c) && e.name !== ['One', 'Two', 'Three'][Number(c) - 1]) off('name is not its own number');
        }
      }
      if (!Array.isArray(q.alsoRight) || q.alsoRight.length > 3) wnp.push('alsoRight is not a list of up to three sentences');
      else for (const a of q.alsoRight) if (typeof a !== 'string' || wnCount(a) > 20 || !/^[A-Z]/.test(a) || !/[.!]$/.test(a) || WN_MARKS.test(a)) wnp.push(`an alsoRight sentence is out of shape: ${a}`);
      // A situation and its question read as one sentence (pass MH, Mikey: What is a kind thing to do when your friend looks
      // sad?): these kinds have no setup line, and each prompt is one question.
      if (/^(pk3-magic-word|pk-turn-choice|p3-help-kind|p3-help-grownup|p3-help-ball|p3-feel-moment|p3-feel-calm)$/.test(genId) && (q.story !== null || !/^[A-Z][^.?!]*\?$/.test(q.prompt))) wnp.push('a merged question kept a setup line or is not one question');
      // Please or thank you, and turns or sharing, re-derived from the moment the question now says.
      // (Answer checks, not More Info's, since pass MM, so a mutant's wrong key counts as caught by them.)
      if (genId === 'pk3-magic-word' && q.answer !== (/ when you (would like|want|need) /.test(q.prompt) ? 'Please' : 'Thank you')) problems.push('magic word wrong for the moment');
      if (genId === 'pk-turn-choice' && q.answer !== (/ both want the /.test(q.prompt) ? 'Take turns' : 'Share it')) problems.push('turns or sharing wrong for the moment');
      problems.push(...wnp); wnAll = wnp; if (wnp.length && live) WN_BAD.push(`${genId} seed ${seed}: ${wnp[0]}`);
    }
    // Very First Steps (pass LN): sizes, dots and colors re-derived from the tokens.
    const lnRank = { small: 1, medium: 2, big: 3 }; const lnRankOf = (c) => lnRank[String(c).split(':')[2]]; const lnDots = (c) => Number(String(c).split(':')[1]);
    if (genId === 'pk3-tap-middle' && !String(q.answer).endsWith(':medium')) problems.push('middle size wrong');
    if (genId === 'pk3-tap-biggest' && !q.choices.every((c) => lnRankOf(c) <= lnRankOf(q.answer))) problems.push('biggest wrong');
    if (genId === 'pk3-tap-littlest' && !q.choices.every((c) => lnRankOf(c) >= lnRankOf(q.answer))) problems.push('littlest wrong');
    if (genId === 'p4-tap-bigger' && !q.choices.every((c) => lnRankOf(c) <= lnRankOf(q.answer))) problems.push('bigger wrong');
    if (genId === 'p4-tap-smaller' && !q.choices.every((c) => lnRankOf(c) >= lnRankOf(q.answer))) problems.push('smaller wrong');
    // First Steps part one (pass LU): each new kind re-derived from its words with tables the generators do not share.
    const luColour = { 'a strawberry': 'red', 'a stop sign': 'red', 'the sky on a sunny day': 'blue', 'a blueberry': 'blue', 'a banana': 'yellow', 'a lemon': 'yellow', 'the grass': 'green', 'a pickle': 'green' };
    if (genId === 'pc-colour-of-thing' && q.answer !== luColour[(q.prompt.match(/^What color is (.+)\?$/) || [])[1]]) problems.push('color of a thing wrong');
    const luGoes = { 'goes on the water': 'boat', 'goes up into space': 'rocket', 'runs on a track': 'train', 'drives on the road': 'car' };
    if (genId === 'pm-vehicle-where' && q.answer !== 'art:' + luGoes[(q.prompt.match(/^Which one (.+)\?$/) || [])[1]]) problems.push('vehicle place wrong');
    const luHas = { 'has wings': 'butterfly', 'has petals': 'flower', 'has points': 'star', 'has arms and legs': 'robot', 'has a string': 'balloon' };
    if (genId === 'pm-thing-part') { const k = (q.prompt.match(/^Which one (.+)\?$/) || [])[1]; if (q.answer !== 'art:' + luHas[k]) problems.push('thing part wrong'); if (k === 'has points' && q.choices.includes('art:flower')) problems.push('a pointed flower offered against the star'); if (k === 'has arms and legs' && q.choices.includes('art:butterfly')) problems.push('a butterfly, which has legs, offered against the robot'); }
    const luEars = { 'has long ears': 'rabbit', 'has round ears': 'bear', 'has pointy ears': 'fox', 'has no legs and slides along on one foot': 'snail' };
    if (genId === 'pm-land-ears') { const k = (q.prompt.match(/^Which one (.+)\?$/) || [])[1]; if (q.answer !== 'pic:' + luEars[k]) problems.push('ears wrong'); if (k === 'has pointy ears' && ['pic:cat', 'pic:rabbit'].some((c) => q.choices.includes(c))) problems.push('another pointy-eared animal offered as wrong'); if (k === 'has pointy ears' && q.choices.includes('pic:owl')) problems.push('the owl, whose drawing wears ear tufts since pass MP, offered against pointy ears'); if (k === 'has round ears' && q.choices.includes('pic:rabbit')) problems.push('the rabbit offered against round ears'); }
    const luCorners = { 'has three corners': 'triangle', 'has no corners': 'circle', 'has four sides that are all the same length': 'square', 'has two long sides and two short sides': 'rectangle' };
    if (genId === 'pm-shape-corners' && q.answer !== 'shape:' + luCorners[(q.prompt.match(/^Which shape (.+)\?$/) || [])[1]]) problems.push('corners wrong');
    // Wrong choices a child could fairly call right, kept out since pass ML (the lesson checks): an unripe or dry color for a fruit
    // or the grass, a toy car for the track and the drawn train for the road, a flower for wings, a butterfly or a robot for a
    // string, and the snail, whose feelers stand up like ears, for long ears.
    const luUnripe = { 'a strawberry': ['green'], 'a blueberry': ['green'], 'a banana': ['green'], 'a lemon': ['green'], 'the grass': ['yellow'], 'a pickle': ['yellow'] };
    if (genId === 'pc-colour-of-thing' && (luUnripe[(q.prompt.match(/^What color is (.+)\?$/) || [])[1]] || []).some((c) => q.choices.includes(c))) problems.push('an unripe or dry color offered as wrong');
    if (genId === 'pm-vehicle-where') { const k = (q.prompt.match(/^Which one (.+)\?$/) || [])[1]; if (k === 'runs on a track' && q.choices.includes('art:car')) problems.push('a car offered against the track'); if (k === 'drives on the road' && q.choices.includes('art:train')) problems.push('the drawn train offered against the road'); }
    if (genId === 'pm-thing-part') { const k = (q.prompt.match(/^Which one (.+)\?$/) || [])[1]; if (k === 'has wings' && q.choices.includes('art:flower')) problems.push('a flower offered against wings'); if (k === 'has a string' && ['art:butterfly', 'art:robot'].some((c) => q.choices.includes(c))) problems.push('a butterfly or a robot offered against a string'); }
    if (genId === 'pm-land-ears' && /^Which one has long ears\?$/.test(q.prompt) && q.choices.includes('pic:snail')) problems.push('the snail offered against long ears');
    const luLike = { 'a can': 'cylinder', 'an ice cream cone': 'cone', 'a ball': 'sphere', 'a block': 'cube' };
    if (genId === 'pm-solid-like' && q.answer !== 'solid:' + luLike[(q.prompt.match(/^Which shape is like (.+)\?$/) || [])[1]]) problems.push('solid like wrong');
    if (genId === 'pm-solid-do' && (q.answer !== (/roll/.test(q.prompt) ? 'solid:sphere' : 'solid:cube') || q.choices.some((c) => !['solid:sphere', 'solid:cube'].includes(c)))) problems.push('solid do wrong');
    if (genId === 'pm-water-facts') { const want = /breathes air|bigger/.test(q.prompt) ? 'pic:whale' : /under the water|smaller/.test(q.prompt) ? 'pic:fish' : null; if (q.answer !== want || q.choices.some((c) => !['pic:whale', 'pic:fish'].includes(c))) problems.push('water fact wrong'); }
    // A group that looks like more (pass ML, A7): the answer is the group with more, or fewer, by count alone, whatever it looks like.
    if (genId === 'p4-looks-like-more') { const cnt = (t) => Number((/^look:(?:dots|circles)-(\d)-/.exec(t) || [])[1]); const looks = q.choices.map((t) => (/-(long|close|big|little)$/.exec(t) || [])[1]).sort().join();
      const want = /with more\.$/.test(q.prompt) ? q.choices.find((t) => cnt(t) === Math.max(...q.choices.map(cnt))) : /with fewer\.$/.test(q.prompt) ? q.choices.find((t) => cnt(t) === Math.min(...q.choices.map(cnt))) : null;
      if (q.choices.length !== 2 || cnt(q.choices[0]) === cnt(q.choices[1]) || !['close,long', 'big,little'].includes(looks) || q.answer !== want) problems.push('looks like more wrong'); }
    if (['pm-tap-vehicle', 'pm-tap-water', 'pm-tap-shape'].includes(genId)) { const nm = (q.prompt.match(/^Tap the (\w+)\.$/) || [])[1]; if (String(q.answer).split(':')[1] !== nm) problems.push('tapped the wrong picture'); if (nm === 'rectangle' && q.choices.includes('shape:square')) problems.push('a square offered as wrong for a rectangle'); }
    const luN = (c) => Number(String(c).split(':')[1]); const luTwo = () => Array.isArray(q.choices) && q.choices.length === 2 && luN(q.choices[0]) !== luN(q.choices[1]) && q.choices.every((c) => luN(c) >= 1 && luN(c) <= 5);
    if (genId === 'p4-tap-more-5' && !(luTwo() && q.choices.every((c) => luN(c) <= luN(q.answer)))) problems.push('more up to five wrong');
    if (genId === 'p4-tap-fewer-5' && !(luTwo() && q.choices.every((c) => luN(c) >= luN(q.answer)))) problems.push('fewer up to five wrong');
    if (genId === 'p4-more-close' && !(luTwo() && q.choices.every((c) => luN(c) <= luN(q.answer)) && Math.abs(luN(q.choices[0]) - luN(q.choices[1])) === 1)) problems.push('close more wrong');
    if (genId === 'p4-fewer-close' && !(luTwo() && q.choices.every((c) => luN(c) >= luN(q.answer)) && Math.abs(luN(q.choices[0]) - luN(q.choices[1])) === 1)) problems.push('close fewer wrong');
    // First Steps part two (pass LV): re-derived from the words with tables the generators do not share.
    const lvSize = { bee: 1, snail: 1, cat: 2, rabbit: 2, duck: 2, owl: 2, fox: 2, bear: 3, whale: 3 };
    const lvPics = () => (q.choices || []).map((c) => String(c).replace(/^pic:/, ''));
    const lvNamed = () => (`${q.story || ''} ${q.prompt || ''}`.match(/\b(bee|snail|cat|rabbit|duck|owl|fox|bear|whale)\b/g) || []);   // named in the question itself since pass ML
    if (genId === 'p4-real-bigger') { const p = lvPics(); const want = /bigger/.test(q.prompt) ? (lvSize[p[0]] > lvSize[p[1]] ? p[0] : p[1]) : (lvSize[p[0]] < lvSize[p[1]] ? p[0] : p[1]); if (p.length !== 2 || lvSize[p[0]] === lvSize[p[1]] || q.answer !== 'pic:' + want || lvNamed().join() !== [...p].sort().join()) problems.push('real bigger wrong'); }
    if (genId === 'p4-real-biggest') { const p = lvPics(); const want = p.find((x) => lvSize[x] === (/biggest/.test(q.prompt) ? 3 : 1)); if (p.length !== 3 || new Set(p.map((x) => lvSize[x])).size !== 3 || q.answer !== 'pic:' + want || lvNamed().join() !== [...p].sort().join()) problems.push('real biggest wrong'); }
    if (genId === 'p4-real-middle') { const p = lvPics(); if (p.length !== 3 || new Set(p.map((x) => lvSize[x])).size !== 3 || q.answer !== 'pic:' + p.find((x) => lvSize[x] === 2) || lvNamed().join() !== [...p].sort().join()) problems.push('real middle wrong'); }
    if (genId === 'p4-how-many-3') { const n = q.visual.kind === 'dots' ? q.visual.count : q.visual.items.length; if (q.answer !== String(n) || n < 1 || n > 3 || q.choices.join() !== '1,2,3') problems.push('how many to three wrong'); }
    const lvTurns = { 'Ana goes down the slide, and then Sam goes down.': 'Taking turns', 'Sam swings while Ana waits, and then Ana swings.': 'Taking turns', 'Sam reads the book first, and then Ana reads it.': 'Taking turns', 'Ana plays the drum, and then she hands it to Sam to play.': 'Taking turns', 'Ana and Sam build one tower together at the same time.': 'Sharing', 'Ana and Sam color with one box of crayons at the same time.': 'Sharing', 'Two friends eat crackers from one bowl at the same time.': 'Sharing' };
    if (genId === 'pk-turn-or-share' && q.answer !== lvTurns[q.story]) problems.push('turns or sharing wrong');
    const lvWaitGood = ['Take a slow breath', 'Count to ten', 'Cheer for your friend'];
    if (genId === 'pk-while-waiting' && !(lvWaitGood.includes(q.answer) && q.choices.length === 2 && q.choices.filter((c) => lvWaitGood.includes(c)).length === 1)) problems.push('while waiting wrong');
    const lvWorks = { 'Who works at a fire station?': 'Firefighter', "Who works at a doctor's office or a hospital?": 'Doctor', 'Who works at a school?': 'Teacher', 'Who works at the post office?': 'Mail carrier', 'Who works at a police station?': 'Police officer' };
    if (genId === 'pk-helper-where' && (q.answer !== lvWorks[q.prompt] || new Set(q.choices).size !== 3)) problems.push('helper place wrong');
    const lvScene = { 'Who comes to put out the fire when smoke and flames are coming from a house?': 'Firefighter', 'Who rides on a fire truck that rushes down the street with its siren on?': 'Firefighter', 'Who helps you get well when you are sick with a fever?': 'Doctor', 'Who checks your arm and helps it heal when you hurt it?': 'Doctor', 'Who helps you learn your letters at school?': 'Teacher', 'Who reads a story to your class?': 'Teacher', 'Who brings the birthday card Grandma sent you to your home?': 'Mail carrier', 'Who brings a package to your house?': 'Mail carrier', 'Who helps keep people and cars safe on a busy street?': 'Police officer' };
    if (genId === 'pk-helper-scene' && (q.answer !== lvScene[q.prompt] || new Set(q.choices).size !== 3)) problems.push('helper scene wrong');
    // A firefighter is never the wrong one where the lessons say a firefighter does it too: keeping people safe, and the sick or
    // hurt, which most fire calls are (pass ML, the lesson check).
    if (['pk-helper-scene', 'pk-helper-where', 'ck-which-helper', 'ck-job-tool'].includes(genId) && q.answer !== 'Firefighter' && q.choices.includes('Firefighter') && /safe|sick|hurt|well|heal|stethoscope/.test(q.prompt)) problems.push('a firefighter offered as wrong where firefighters help too');
    // A square is a rectangle too (pass JW), so a matching question never sets the two side by side (pass ML).
    // Every kind of every grade (round three, pass MO): the word rectangle asked while a drawn square is offered, or a drawn square
    // shown while the word rectangle is offered, would have two right answers, since a square is a rectangle too ("the long
    // rectangle" names the one that is not a square).
    // Since round five's content read item pictures count too, and the which-pieces question in both its wordings; since round six's
    // content read any question that opens Which pieces and names a rectangle, and "Can ... make a rectangle?" answered No for every
    // set of triangles, squares or trapezoids, since each can make one ("Which pieces make up a rectangle?" and the six triangles had
    // passed); since round seven's content read any What or Which question about pieces or shapes, or Tap the pieces, that names a
    // rectangle, never this rectangle or the long rectangle, and two to eight pieces ("What pieces can make a rectangle?" and "Can five
    // squares make a rectangle?" had passed).
    { const bare = (t) => /\brectangles?\b/i.test(String(t).replace(/\blong rectangles?\b/gi, '')); const drawnSquare = (c) => /^(?:shape|item):square\b/.test(String(c));
      const asked = String(q.answer).split(' | ').some((a) => /^(?:shape|item):rectangle\b/.test(a)) && bare(`${q.story || ''} ${q.prompt || ''} ${q.visual && q.visual.kind === 'letters' ? q.visual.text : ''}`);
      const shownSquare = !!q.visual && ((q.visual.kind === 'shape' && q.visual.name === 'square') || (q.visual.kind === 'item' && q.visual.shape === 'square'));
      // Round four's content read: a drawn square said not to match the word rectangle, and the pieces of a square offered as wrong for
      // a rectangle.
      const saidNo = shownSquare && bare(`${q.story || ''} ${q.prompt || ''}`) && q.answer === 'No';
      const piecesQ = /^(?:Which|What)\b[^?]*\b(?:pieces|shapes)\b[^?]*\?$|^Tap the (?:pieces|shapes)\b/i.test(q.prompt || '') && !/\bthis\b/i.test(q.prompt || '') && bare(q.prompt || '');
      const squarePieces = (piecesQ && (q.choices || []).some((c) => c !== q.answer && /^(?:Two triangles|Four squares|Four triangles)$/i.test(c)))
        || (/^Can (?:two|three|four|five|six|seven|eight) (?:triangles|squares|trapezoids) make a rectangle\?$/i.test(q.prompt || '') && q.answer === 'No');
      if ((asked && [...(q.choices || []), ...(q.items || [])].some(drawnSquare)) || (shownSquare && (q.choices || []).includes('rectangle')) || saidNo || squarePieces) problems.push('a square and a rectangle offered where both are right (a square is a rectangle too)'); }
    if (['pm-same-shape', 'pm-different-shape'].includes(genId) && q.choices.some((c) => /^shape:square/.test(c)) && q.choices.some((c) => /^shape:rectangle/.test(c))) problems.push('a square set against a rectangle');
    if (genId === 'p3-tap-more' && !q.choices.every((c) => lnDots(c) <= lnDots(q.answer))) problems.push('more dots wrong');
    if (genId === 'p3-tap-fewer' && !q.choices.every((c) => lnDots(c) >= lnDots(q.answer))) problems.push('fewer dots wrong');
    if (genId === 'p3-tap-colour-item' && String(q.answer).split('-')[1] !== q.prompt.match(/Tap the (\w+) one/)[1]) problems.push('colour item wrong');
    if (genId === 'p3-tap-three-shapes' && String(q.answer).replace('shape:', '').split('~')[0] !== q.prompt.match(/Tap the (\w+)\./)[1]) problems.push('three shapes wrong');
    // Very First Steps read by the layered checks (pass MA): each new or widened kind re-derived from its tokens and words.
    if ((genId === 'p3-tap-more' || genId === 'p3-tap-fewer') && !(q.choices.length === 2 && q.choices.every((c) => lnDots(c) >= 1 && lnDots(c) <= 5) && lnDots(q.choices[0]) !== lnDots(q.choices[1]))) problems.push('more or fewer outside one to five');
    if (genId === 'p3-same-number') { const n = q.visual.items.length; const wrongs = q.choices.filter((c) => c !== q.answer); if (q.answer !== `dots:${n}` || n < 2 || n > 5 || wrongs.length !== 1 || lnDots(wrongs[0]) === n || lnDots(wrongs[0]) < 1 || lnDots(wrongs[0]) > 5 || !q.visual.items.every((x) => x === q.visual.items[0]) || !q.prompt.includes(q.visual.items[0])) problems.push('same number wrong'); }
    const maItem = (c) => { const m = /^item:([a-z]+)-([a-z]+)$/.exec(String(c)); return m ? { shape: m[1], colour: m[2] } : null; };
    if (genId === 'p3-sort-red-blue' || genId === 'p3-sort-yellow-green') { const two = genId === 'p3-sort-red-blue' ? ['red', 'blue'] : ['yellow', 'green']; const [x, y] = q.choices.map(maItem); const ans = maItem(q.answer); if (!x || !y || x.shape !== y.shape || x.colour === y.colour || ans.colour !== q.visual.colour || !two.includes(x.colour) || !two.includes(y.colour)) problems.push('sort by color wrong'); }
    if (genId === 'p3-find-match') { const ans = maItem(q.answer); const w = maItem(q.choices.find((c) => c !== q.answer)); const differs = Number(ans.shape !== w.shape) + Number(ans.colour !== w.colour); if (ans.shape !== q.visual.shape || ans.colour !== q.visual.colour || differs !== 1) problems.push('find the match wrong'); if (ans.shape === w.shape && [ans.colour, w.colour].sort().join() === 'green,red') problems.push('red against green, the only difference (pass MB)'); }
    // Yellow or green (the code check): the prompt names the color, and the shape when there is one; the answer is that thing,
    // and the only other choice is the same thing in the other color.
    if (genId === 'p3-tap-yellow-green') { const m = /^Tap the (yellow|green)(?: (circle|square|triangle))?(?: one)?\.$/.exec(q.prompt); const other = m && (m[1] === 'yellow' ? 'green' : 'yellow'); const want = m && (m[2] ? `item:${m[2]}-${m[1]}` : `swatch:${m[1]}`); const alt = m && (m[2] ? `item:${m[2]}-${other}` : `swatch:${other}`); if (!m || q.answer !== want || q.choices.length !== 2 || !q.choices.includes(want) || !q.choices.includes(alt)) problems.push('yellow or green wrong'); }
    // The counts said in the reasons and drawn under them (the code check): an off-by-one in the number words, or a picture of
    // other groups, would pass every check above.
    const maW = ['', 'one', 'two', 'three', 'four', 'five'];
    if (genId === 'p3-tap-more' || genId === 'p3-tap-fewer') { const [hi, lo] = q.choices.map(lnDots).sort((a, b) => b - a); const head = genId === 'p3-tap-more' ? `${maW[hi]} dots are more than ${maW[lo]} dot` : `${maW[lo]} ${lo === 1 ? 'dot is' : 'dots are'} fewer than ${maW[hi]} dots`; const drawn = [q.explainVisual.a.count, q.explainVisual.b.count].sort((a, b) => b - a).join(); if (!q.explain.toLowerCase().startsWith(head) || !q.explain.includes(`count past ${maW[lo]} to get to ${maW[hi]}`) || drawn !== [hi, lo].join()) problems.push('more or fewer explanation miscounts'); }
    if (genId === 'p3-same-number') { const n = q.visual.items.length; const run = maW.slice(1, n + 1).join(', '); if (!q.explain.startsWith(`There are ${maW[n]} ${q.visual.items[0]}s and ${maW[n]} dots. Count them, ${run}, and ${run}.`) || q.explainVisual.b.count !== n || q.explainVisual.a.items.length !== n) problems.push('same number explanation miscounts'); }
    // A counted row (pass MA) is drawn by CountRow on DotGroup's grid: one to five shapes with no missing piece, and in a pair
    // beside dots, the dots' own cell of 34, or the row and its dots would not line up (the code check).
    { const ev = q.explainVisual && q.explainVisual.kind === 'pair' ? [q.explainVisual.a, q.explainVisual.b] : [];
      const rows = [q.visual, ...ev].filter((v) => v && v.kind === 'pattern' && v.size);
      if (rows.some((v) => !(v.items.length >= 1 && v.items.length <= 5 && !v.items.includes('?')))) problems.push('counted row the screen cannot draw');
      if (ev.some((h) => h && h.kind === 'dots') && ev.some((h) => h && h.kind === 'pattern' && h.size && h.size !== 34)) problems.push('counted row off its dots'); }
    if (genId === 'pm-same-animals' && !/, and they look just alike\.$/.test(q.explain)) problems.push('same animals explanation gives no reason');
    if (/^pm-same-(vehicles|things|water|land|shape|solid)$/.test(genId) && !/, just the same, so they match\.$/.test(q.explain)) problems.push('same explanation gives no reason');
    if (/^pm-different-(vehicles|things|water|land|shape|solid)$/.test(genId) && !/ is not the same as the \w+, so it is different\.$/.test(q.explain)) problems.push('different explanation gives no reason');
    // One sentence (EARMARKS L11, pass ML): First Steps' situation and matching questions carry no setup line.
    if (/^(pc-same-colour|pc-different-colour|ps-find-match|ps-odd-one-out|ps-same-colour-shape|pm-same-\w+|pm-different-\w+|p4-more-close|p4-fewer-close|p4-real-bigger|p4-real-biggest|p4-real-middle|pk-while-waiting|pk-helper-scene|ck-good-choice)$/.test(genId) && (q.story !== null || !/^[A-Z][^.?!]*[.?]$/.test(q.prompt))) problems.push('a merged question kept a setup line or is not one sentence');
    if (genId === 'pm-different-animals' && !/ is not the same as the \w+, so it is the odd one out\.$/.test(q.explain)) problems.push('odd animal explanation gives no reason');
    // Grade 1 equations and word problems (pass LB), re-derived by working out each side of the number sentence in the words.
    const sideValue = (t) => { const toks = t.trim().split(/\s+/); let v = Number(toks[0]); for (let i = 1; i < toks.length; i += 2) v = toks[i] === '+' ? v + Number(toks[i + 1]) : v - Number(toks[i + 1]); return v; };
    const eqOf = (t) => (String(t).match(/(?:\d+|\?)(?: [-+] (?:\d+|\?))* = (?:\d+|\?)(?: [-+] (?:\d+|\?))*/) || [null])[0];
    if (genId === 'eq1-true-false') { const [l, r] = eqOf(q.prompt).split(' = '); if (q.answer !== (sideValue(l) === sideValue(r) ? 'Yes' : 'No')) problems.push('true or false wrong'); }
    if (genId === 'eq1-missing-four' || (genId === 'eq1-turn-around' && / = /.test(q.prompt))) { const eq = eqOf(q.prompt); const filled = eq.replace('?', q.answer); const [l, r] = filled.split(' = '); if (sideValue(l) !== sideValue(r)) problems.push('missing number does not balance'); }
    if (genId === 'eq1-turn-around' && !/ = /.test(q.prompt)) { const [a, b] = q.prompt.match(/\d+/g).map(Number); if (Number(q.answer) !== a + b) problems.push('turn-around sum wrong'); }
    if (genId === 'eq1-three') { const ns = q.prompt.match(/\d+/g).map(Number); if (Number(q.answer) !== ns[0] + ns[1] + ns[2]) problems.push('three addends wrong'); }
    if (genId === 'eq1-first-two') { const [a, b] = q.answer.match(/\d+/g).map(Number); if (a + b !== 10) problems.push('first two do not make ten'); }
    if (genId === 'eq1-make-ten') { if (sideValue(q.answer) !== 10 || q.choices.filter((c) => c !== q.answer).some((c) => sideValue(c) === 10)) problems.push('make ten wrong'); }
    if (genId === 'eq1-balance') { const [a, b] = q.prompt.match(/\d+/g).map(Number); if (Number(q.answer) !== a + b) problems.push('balance side wrong'); }
    if (genId === 'eq1-which-true') { const [l, r] = q.answer.split(' = '); if (sideValue(l) !== sideValue(r) || q.choices.filter((c) => c !== q.answer).some((c) => { const [x, y] = c.split(' = '); return sideValue(x) === sideValue(y); })) problems.push('which true wrong'); }
    if (genId === 'ns1-story-to-sentence' || genId === 'ns1-picture') { const [l, r] = q.answer.split(' = '); if (sideValue(l) !== sideValue(r)) problems.push('story sentence wrong'); const ns = (q.story || '').match(/\d+/g); if (genId === 'ns1-story-to-sentence' && ns && !(q.answer.startsWith(`${ns[0]} `) && q.answer.includes(` ${ns[1]} `))) problems.push('story numbers not used'); if (genId === 'ns1-picture' && sideValue(l) !== q.visual.a.filled + q.visual.b.filled) problems.push('picture sentence wrong'); }
    if (genId === 'ns1-sentence-to-story') { const [l, r] = eqOf(q.prompt).split(' = '); if (sideValue(l) !== sideValue(r)) problems.push('sentence story equation wrong'); }
    if (genId === 'ns1-count-on' || genId === 'ns1-doubles') { const ns = q.prompt.match(/\d+/g).map(Number); if (Number(q.answer) !== ns[ns.length - 2] + ns[ns.length - 1]) problems.push('count on or double wrong'); }
    if (genId === 'ns1-which-operation' && q.answer !== (/got \d+ more/.test(q.story) ? 'Add' : 'Take away')) problems.push('which operation wrong');
    if (genId === 'ns1-missing-in-story') { const ns = q.story.match(/\d+/g).map(Number); const want = /start with/.test(q.prompt) ? ns[1] - ns[0] : ns[0] - ns[1]; if (Number(q.answer) !== want) problems.push('missing in story wrong'); }
    if (genId === 'ns1-how-many-more') { const [a, b] = q.story.match(/\d+/g).map(Number); if (Number(q.answer) !== a - b) problems.push('how many more wrong'); }
    // Grade 1 number sense (pass LA), re-derived from the picture or the words.
    const NUMW1 = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };
    if (genId === 'ql1-dice' && Number(q.answer) !== q.visual.pips) problems.push('dice count wrong');
    if (genId === 'ql1-tenframe' && Number(q.answer) !== q.visual.filled) problems.push('ten frame count wrong');
    if (genId === 'ql1-empty' && Number(q.answer) !== 10 - q.visual.filled) problems.push('empty spaces wrong');
    if (genId === 'ql1-domino' && Number(q.answer) !== q.visual.a + q.visual.b) problems.push('domino total wrong');
    if (genId === 'ql1-two-dice' && Number(q.answer) !== q.visual.a.pips + q.visual.b.pips) problems.push('two dice total wrong');
    if (genId === 'ql1-tap-dice') { const w = q.prompt.match(/shows (\w+)\./)[1]; if (q.answer !== `dice:${NUMW1[w]}`) problems.push('tapped the wrong dice'); }
    if (genId === 'ql1-fact') { const want = /two rows of how many/.test(q.prompt) ? 'Three' : /fill a whole ten frame/.test(q.prompt) ? 'Ten' : 'Five'; if (q.answer !== want) problems.push('quick look fact wrong'); }
    if (genId === 'ql1-faster' && q.answer !== 'See the pattern') problems.push('quick way wrong');
    const numsIn = (t) => (String(t).match(/\d+/g) || []).map(Number);
    if (genId === 'ct1-next' && Number(q.answer) !== numsIn(q.prompt)[0] + 1) problems.push('count on wrong');
    if (genId === 'ct1-before' && Number(q.answer) !== numsIn(q.prompt)[0] - 1) problems.push('count back wrong');
    if (genId === 'ct1-fill-forward' && Number(q.answer) !== numsIn(q.prompt)[2] + 1) problems.push('fill forward wrong');
    if (genId === 'ct1-fill-backward' && Number(q.answer) !== numsIn(q.prompt)[2] - 1) problems.push('fill backward wrong');
    if (genId === 'ct1-skip') { const [a, b, c] = numsIn(q.prompt); if (b - a !== c - b || Number(q.answer) !== c + (b - a)) problems.push('skip count wrong'); }
    if (genId === 'ct1-total' && Number(q.answer) !== q.visual.groups * q.visual.each) problems.push('skip total wrong');
    if (genId === 'ct1-greater' && !(Number(q.answer) > numsIn(q.prompt)[0] && q.choices.filter((c) => c !== q.answer).every((c) => Number(c) <= numsIn(q.prompt)[0]))) problems.push('greater than wrong');
    if (genId === 'ct1-less' && !(Number(q.answer) < numsIn(q.prompt)[0] && q.choices.filter((c) => c !== q.answer).every((c) => Number(c) >= numsIn(q.prompt)[0]))) problems.push('less than wrong');
    if (genId === 'ct1-which-count') { const by = { twos: 2, fives: 5, tens: 10 }[q.prompt.match(/by (\w+)\?/)[1]]; const step = (c) => { const n = numsIn(c); return n[1] - n[0]; }; if (step(q.answer) !== by || q.choices.filter((c) => c !== q.answer).some((c) => step(c) === by)) problems.push('which count wrong'); }
    if (genId === 'ol1-dot' && Number(q.answer) !== q.visual.dots[0].at) problems.push('dot number wrong');
    if (genId === 'ol1-between' && Number(q.answer) !== numsIn(q.prompt)[0] + 1) problems.push('between wrong');
    if (genId === 'ol1-order') { const want = numsIn(q.story).sort((a, b) => a - b).join(', '); if (q.answer !== want) problems.push('order wrong'); }
    if (genId === 'ol1-which-dot') { const v = numsIn(q.prompt)[0]; const d = q.visual.dots.find((x) => x.at === v); if (!d || q.answer !== d.name) problems.push('which dot wrong'); }
    if (genId === 'ol1-right' && q.answer !== (/greater/.test(q.prompt) ? 'To the right' : 'To the left')) problems.push('right or left wrong');
    if (genId === 'ol1-farther-right' && Number(q.answer) !== Math.max(...numsIn(q.prompt))) problems.push('farther right wrong');
    if (genId === 'ol1-count-on') { const n = numsIn(q.prompt)[0]; const k = NUMW1[q.prompt.match(/count on (\w+) along/)[1]]; if (Number(q.answer) !== n + k) problems.push('count on line wrong'); }
    if (genId === 'ol1-greater-of-two' && Number(q.answer) !== Math.max(...numsIn(q.story))) problems.push('greater of two wrong');
    // Grade 1 measurement and data (pass KZ), re-derived from the picture or the words.
    const barOf = (c) => Number(String(c).replace(/^bar:/, ''));
    if (genId === 'ml1-how-long' && Number(q.answer) !== q.visual.units) problems.push('how long wrong');
    if (genId === 'ml1-number-and-unit' && q.answer !== `${q.visual.units} ${q.visual.unit === 'cube' ? 'cubes' : 'paper clips'}`) problems.push('number and unit wrong');
    if (genId === 'ml1-which-count' && q.answer !== (/bigger/.test(q.prompt) ? 'The paper clips' : 'The cubes')) problems.push('which count wrong');
    if (genId === 'ml1-good-measure' && q.answer !== (q.visual.flaw ? 'No' : 'Yes')) problems.push('good measure wrong');
    if (genId === 'ml1-longest') { const ls = q.choices.map(barOf); if (barOf(q.answer) !== (/longest/.test(q.prompt) ? Math.max(...ls) : Math.min(...ls))) problems.push('longest ribbon wrong'); }
    if (genId === 'ml1-middle') { const ls = q.choices.map(barOf).sort((a, b) => a - b); if (barOf(q.answer) !== ls[1]) problems.push('middle ribbon wrong'); }
    if (genId === 'ml1-indirect') { const m2 = /^The (\w+) is longer than the (\w+)\. The \w+ is longer than the (\w+)\./.exec(q.story); if (q.answer !== (/longer/.test(q.prompt) ? `The ${m2[1]}` : `The ${m2[3]}`)) problems.push('indirect compare wrong'); }
    const HOURS1 = ['twelve', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven'];
    const cap1 = (t) => t.charAt(0).toUpperCase() + t.slice(1);
    const tw = (h, m) => (m === 30 ? `Half past ${HOURS1[h % 12]}` : `${cap1(HOURS1[h % 12])} o'clock`);
    if ((genId === 'tm1-oclock' || genId === 'tm1-half-past' || genId === 'tm1-hand-between') && q.answer !== tw(q.visual.hour, q.visual.minute)) problems.push('grade 1 clock reading wrong');
    if (genId === 'tm1-which-clock') { const half = /half past/.test(q.prompt); const word = half ? q.prompt.match(/half past (\w+)/)[1] : q.prompt.match(/shows (\w+) o'clock/)[1]; const h = HOURS1.indexOf(word) === 0 ? 12 : HOURS1.indexOf(word); if (q.answer !== `clock:${h}:${half ? 30 : 0}`) problems.push('grade 1 which clock wrong'); }
    if (genId === 'tm1-hands' && q.answer !== (/hour hand/.test(q.prompt) ? 'The short hand' : 'The long hand')) problems.push('hands wrong');
    if (genId === 'tm1-up-or-down' && q.answer !== (/straight up/.test(q.story) ? 'O\'clock' : 'Half past')) problems.push('up or down wrong');
    if (genId === 'tm1-digital-read' && q.answer !== tw(q.visual.hour, q.visual.minute)) problems.push('digital read wrong');
    if (genId === 'tm1-match-digital' && q.answer !== `digital:${q.visual.hour}:${q.visual.minute}`) problems.push('match digital wrong');
    if (genId === 'tm1-minutes' && Number(q.answer) !== (/half an hour/.test(q.prompt) ? 30 : 60)) problems.push('minutes wrong');
    if (genId === 'tm1-write-digital') { const half = /half past/.test(q.prompt); const word = half ? q.prompt.match(/half past (\w+)/)[1] : q.prompt.match(/How is (\w+) o'clock/)[1]; const h = HOURS1.indexOf(word) === 0 ? 12 : HOURS1.indexOf(word); if (q.answer !== `${h}:${half ? '30' : '00'}`) problems.push('write digital wrong'); }
    if ((genId === 'dg1-count-tally' || genId === 'dg1-tally-to-graph') && Number(q.answer) !== q.visual.rows[0].count) problems.push('tally count wrong');
    if (genId === 'dg1-fives' && Number(q.answer) !== Math.floor(q.visual.rows[0].count / 5)) problems.push('tally groups wrong');
    if (genId === 'dg1-read-bar') { const names = { ball: 'balls', teddy: 'teddy bears', block: 'blocks', dog: 'dogs', fish: 'fish', bird: 'birds', sun: 'sunny days', rain: 'rainy days', snow: 'snowy days' }; const row = q.visual.rows.find((r) => q.prompt.includes(`How many ${names[r.icon]} `)); if (!row || Number(q.answer) !== row.count) problems.push('read bar wrong'); }
    if (genId === 'dg1-bar-most') { const sorted = [...q.visual.rows].sort((x, y) => y.count - x.count); const want = /fewest/.test(q.prompt) ? sorted[2] : sorted[0]; if (q.answer !== `icon:${want.icon}`) problems.push('bar most wrong'); }
    if (genId === 'dg1-bar-more') { const [a, b] = q.visual.rows.map((r) => r.count); if (Number(q.answer) !== Math.abs(a - b)) problems.push('bar more wrong'); }
    if (genId === 'dg1-bar-total' && Number(q.answer) !== q.visual.rows.reduce((t, r) => t + r.count, 0)) problems.push('bar total wrong');
    if (genId === 'dg1-graph-question' && !/most|fewest|in all/.test(q.answer)) problems.push('graph question wrong');
    const FAIR2 = ['half', 'half-across', 'half-slant']; const FAIR4 = ['fourths', 'fourths-strips', 'fourths-x'];
    const cutOf = (c) => String(c).split(':')[2];
    if (genId === 'h1-halves-yes-no' && q.answer !== (FAIR2.includes(q.visual.cut) ? 'Yes' : 'No')) problems.push('halves yes/no wrong');
    if (genId === 'h1-fourths-yes-no' && q.answer !== (FAIR4.includes(q.visual.cut) ? 'Yes' : 'No')) problems.push('fourths yes/no wrong');
    if (genId === 'h1-how-many-shares' && Number(q.answer) !== (FAIR2.includes(q.visual.cut) ? 2 : 4)) problems.push('fair share count wrong');
    if (genId === 'h1-name-share' && q.answer !== (FAIR2.includes(q.visual.cut) ? 'One half' : 'One fourth')) problems.push('share name wrong');
    if (genId === 'h1-tap-shows') { const halves = /halves\.$/.test(q.prompt); const fair = halves ? FAIR2 : FAIR4; if (!fair.includes(cutOf(q.answer)) || q.choices.filter((c) => c !== q.answer).some((c) => fair.includes(cutOf(c)))) problems.push('tap shows wrong'); }
    if (genId === 'h1-bigger') { const halfEater = q.story.match(/(\w+) eats one half/)[1]; const fourthEater = q.story.match(/(\w+) eats one fourth/)[1]; if (q.answer !== (/bigger/.test(q.prompt) ? halfEater : fourthEater)) problems.push('bigger share wrong'); }
    if (genId === 'h1-make-whole' && Number(q.answer) !== (/halves/.test(q.prompt) ? 2 : 4)) problems.push('make whole wrong');
    if (genId === 'h1-quarter' && q.answer !== (/one fourth\?$/.test(q.prompt) ? 'One quarter' : 'One fourth')) problems.push('quarter name wrong');
    if (genId === 'h1-fair-yes-no' && q.answer !== (['unequal-two', 'unequal-four'].includes(q.visual.cut) ? 'No' : 'Yes')) problems.push('fair yes/no wrong');
    // Tens, lengths, sorting: re-derived from the words and the pictures
    const num = (c, key) => Number((new RegExp(`^${key}:(\\d+)$`).exec(c) || [])[1]);
    if (genId === 'kt-next-ten' && Number(q.answer) !== Number(q.prompt.match(/after (\d+)/)[1]) + 10) problems.push('next ten wrong');
    if (genId === 'kt-before-ten' && Number(q.answer) !== Number(q.prompt.match(/before (\d+)/)[1]) - 10) problems.push('previous ten wrong');
    if (genId === 'kt-how-many-tens' && Number(q.answer) !== q.visual.count * 10) problems.push('tens count wrong');
    if (genId === 'kt-tap-tens' && num(q.answer, 'tens') * 10 !== Number(q.prompt.match(/shows (\d+)/)[1])) problems.push('tapped tens wrong');
    if (genId === 'kt-count-on') { const [a] = q.story.match(/\d+/g).map(Number); if (Number(q.answer) !== a + 20) problems.push('count on wrong'); }
    if (genId === 'kl-longer' && num(q.answer, 'bar') !== Math.max(...q.choices.map((c) => num(c, 'bar')))) problems.push('longer wrong');
    if (genId === 'kl-shorter' && num(q.answer, 'bar') !== Math.min(...q.choices.map((c) => num(c, 'bar')))) problems.push('shorter wrong');
    if (genId === 'kl-same-length' && num(q.answer, 'bar') !== q.visual.lengths[0]) problems.push('same length wrong');
    if (genId === 'kl-taller' && num(q.answer, 'tower') !== Math.max(...q.choices.map((c) => num(c, 'tower')))) problems.push('taller wrong');
    if (genId === 'kl-heavier-words' && !/rock|book|bucket|chair|car|brick/.test(q.answer)) problems.push('heavier picked the light thing');
    if (genId === 'ko-belongs' && q.answer !== `shape:${q.story.match(/the (\w+) group/)[1]}`) problems.push('belongs wrong');
    if (genId === 'ko-count-group' && Number(q.answer) !== (q.visual.items ? q.visual.items.length : q.visual.count)) problems.push('group count wrong');
    if (genId === 'ko-which-group-more') { const [a, b] = q.story.match(/\d+/g).map(Number); if (q.answer !== (a > b ? 'Circles' : 'Squares')) problems.push('more group wrong'); }
    if (genId === 'ko-does-not-belong' && shapeOf(q.answer) === q.story.match(/the (\w+) group/)[1]) problems.push('odd one is in the group');
    if (genId === 'ko-how-many-groups' && Number(q.answer) !== q.story.replace(/\.$/, '').split(', ').length) problems.push('group count wrong');
    // Solids and making ten
    const THING = { 'a ball': 'sphere', 'a block': 'cube', 'a can': 'cylinder', 'an ice cream cone': 'cone' };
    const ROLLS = { sphere: 'Yes', cube: 'No', cylinder: 'Yes', cone: 'Yes' };
    if (genId === 'kd-name-solid' && q.answer !== q.visual.name) problems.push('named the wrong solid');
    if (genId === 'kd-tap-solid' && q.answer !== `solid:${q.prompt.match(/Tap the (\w+)/)[1]}`) problems.push('tapped the wrong solid');
    if (genId === 'kd-real-thing' && q.answer !== THING[q.prompt.match(/What solid shape is (.+)\?/)[1]] /* pass ID: the thing is named in the question */) problems.push('real thing wrong');
    if (genId === 'kd-flat-or-solid' && q.answer !== (q.visual.kind === 'solid' ? 'Solid' : 'Flat')) problems.push('flat/solid wrong');
    if (genId === 'kd-rolls' && q.answer !== ROLLS[q.visual.name]) problems.push('rolls wrong');
    if ((genId === 'kn-partner' || genId === 'kn-frame') && Number(q.answer) !== 10 - q.visual.filled) problems.push('partner of ten wrong');
    if (genId === 'kn-two-ways') { const [a, b] = q.answer.split(' and ').map(Number); if (a + b !== 10) problems.push('pair does not make ten'); if (q.choices.filter((c) => c.split(' and ').map(Number).reduce((x, y) => x + y) === 10).length !== 1) problems.push('two pairs make ten'); }
    if (genId === 'kn-take-from-ten' && Number(q.answer) !== 10 - Number(q.story.match(/then (\d+)/)[1])) problems.push('take from ten wrong');
    // Pass JX: capacity, the flat parts of solids, and no square set against a rectangle in sorting (a square is a special rectangle).
    if (genId === 'kl-holds-more' && !/bucket|bowl|bathtub|pitcher|teapot|backpack/.test(q.answer)) problems.push('holds more picked the smaller thing');
    if (genId === 'kd-flat-face' && q.answer !== (q.visual.name === 'cube' ? 'shape:square' : 'shape:circle')) problems.push('flat part wrong');
    if (['ko-belongs', 'ko-does-not-belong', 'ko-how-many-groups'].includes(genId) && /square/.test(`${q.story} ${q.choices.join(' ')}`) && /rectangle/.test(`${q.story} ${q.choices.join(' ')}`)) problems.push('a square and a rectangle sorted apart');
    if (genId === 'kn-is-ten') { const [a, b] = q.story.match(/\d+/g).map(Number); if (q.answer !== (a + b === 10 ? 'Yes' : 'No')) problems.push('is-ten wrong'); }
    // Syllables, sounding out, reading direction, word meanings
    const SYL = { cat: 1, dog: 1, sun: 1, hat: 1, fish: 1, ball: 1, rabbit: 2, apple: 2, window: 2, pencil: 2, monkey: 2, tiger: 2, banana: 3, elephant: 3, umbrella: 3, butterfly: 3 };
    if (genId === 'ry-how-many-claps' && Number(q.answer) !== SYL[q.visual.text]) problems.push('clap count wrong');
    if (genId === 'ry-pick-two' && SYL[q.answer] !== 2) problems.push('pick-two wrong');
    if (genId === 'ry-pick-one' && SYL[q.answer] !== 1) problems.push('pick-one wrong');
    if (genId === 'ry-more-claps' && SYL[q.answer] !== Math.max(...q.choices.map((c) => SYL[c]))) problems.push('more claps wrong');
    if (genId === 'ry-same-claps' && SYL[q.answer] !== SYL[q.story.replace(/\.$/, '').toLowerCase()]) problems.push('same claps wrong');
    if (genId === 'rd-blend' && q.answer !== q.visual.text.replace(/ /g, '')) problems.push('blend wrong');   // pass JV: the setup names the letters
    if (genId === 'rd-first-sound' && q.answer !== q.story.replace(/\.$/, '').toLowerCase()[0]) problems.push('first sound wrong');
    if (genId === 'rd-last-sound' && q.answer !== q.story.replace(/\.$/, '').toLowerCase().slice(-1)) problems.push('last sound wrong');
    if (genId === 'rd-middle-sound' && q.answer !== q.story.replace(/\.$/, '').toLowerCase()[1]) problems.push('middle sound wrong');
    if (genId === 'rd-which-word' && q.answer !== q.visual.text.replace(/ /g, '')) problems.push('which word wrong');
    const lineWords = (t) => t.trim().split(/\s+/);
    if (genId === 'rw-first' && q.answer !== lineWords(q.story)[0]) problems.push('first word wrong');
    if (genId === 'rw-last' && q.answer !== lineWords(q.story).slice(-1)[0]) problems.push('last word wrong');
    if (genId === 'rw-next') { const ws = lineWords(q.story); const after = q.prompt.match(/after the word (\w+)\?/)[1]; /* pass IB: right after the word the? */ if (q.answer !== ws[ws.indexOf(after) + 1]) problems.push('next word wrong'); }
    if (genId === 'rw-count-words' && Number(q.answer) !== lineWords(q.story).length) problems.push('word count wrong');
    if (genId === 'rw-which-way' && q.answer !== (/left to right/.test(q.story) ? 'Yes' : 'No')) problems.push('which way wrong');
    const PIC_WORD = { circle: 'circle', square: 'square', triangle: 'triangle', rectangle: 'rectangle', sphere: 'ball', cube: 'box', cylinder: 'can', cone: 'cone' };
    if (genId === 'rm-match-picture' && q.answer !== PIC_WORD[q.visual.name]) problems.push('picture word wrong');
    if (genId === 'rm-pick-word' && PIC_WORD[q.answer.split(':')[1]] !== q.story.match(/word is (\w+)/)[1]) problems.push('picked picture wrong');
    if (genId === 'rm-does-match' && q.answer !== (PIC_WORD[q.visual.name] === q.story.match(/says (\w+)/)[1] ? 'Yes' : 'No')) problems.push('does-match wrong');
    if (genId === 'rm-count-word' && ['one', 'two', 'three', 'four', 'five', 'six'].indexOf(q.answer) + 1 !== q.visual.count) problems.push('count word wrong');
    if (genId === 'rm-shape-word' && q.answer !== `shape:${q.story.match(/word:? (\w+)/)[1]}`) problems.push('shape word wrong');
    // Grade 3 multiplication, division, and adding to 1,000: redone from the numbers in the words
    const allInts = text.match(/\d+/g) ? text.match(/\d+/g).map(Number) : [];
    if (genId === 'mu-groups-total' && Number(q.answer) !== allInts[0] * allInts[1]) problems.push('groups total wrong');
    if (genId === 'mu-array' && q.answer !== `${q.visual.rows} × ${q.visual.cols}`) problems.push('array equation wrong');
    if (genId === 'mu-story' && Number(q.answer) !== allInts[0] * allInts[1]) problems.push('multiplication story wrong');
    if (genId === 'mu-which-equation') { const [g, e] = allInts; if (q.answer !== `${g} × ${e} = ${g * e}`) problems.push('which equation wrong'); }
    if (genId === 'mu-swap') { const [a, b] = allInts; if (Number(q.answer) !== a * b) problems.push('swap wrong'); }
    if ((genId === 'tt-fact' || genId === 'tt-fact-story') && Number(q.answer) !== allInts[0] * allInts[1]) problems.push('times fact wrong');
    if (genId === 'tt-missing-factor') { const [a, p] = allInts; if (a * Number(q.answer) !== p) problems.push('missing factor wrong'); }
    if (genId === 'tt-pattern') { const m2 = q.prompt.match(/(\d+) × (\d+)/); if (Number(q.answer) !== Number(m2[1]) * Number(m2[2])) problems.push('pattern fact wrong'); }
    if (genId === 'dv-share') { const [total, groups] = allInts; if (Number(q.answer) * groups !== total) problems.push('share wrong'); }
    if (genId === 'dv-fact') { const [t, b] = allInts; if (Number(q.answer) * b !== t) problems.push('division fact wrong'); }
    if (genId === 'dv-story') { const [total, each] = allInts; if (Number(q.answer) * each !== total) problems.push('division story wrong'); }
    if (genId === 'dv-undo') { const [a, b] = allInts; if (q.answer !== `${a * b} ÷ ${a} = ${b}`) problems.push('undo fact wrong'); }
    if (genId === 'dv-how-many-groups') { const [total, each] = allInts; if (Number(q.answer) * each !== total) problems.push('how many groups wrong'); }
    if (genId === 'as-add' || genId === 'as-story-add') { const [a, b] = allInts; if (Number(q.answer) !== a + b) problems.push('addition wrong'); if (a + b > 999) problems.push('sum over 1000'); }
    if (genId === 'as-subtract' || genId === 'as-story-subtract') { const [a, b] = allInts; if (Number(q.answer) !== a - b) problems.push('subtraction wrong'); if (a - b < 0) problems.push('negative result'); }
    if (genId === 'as-two-step') { const [a, b, c] = allInts; if (Number(q.answer) !== a + b - c) problems.push('two-step wrong'); if (a + b - c < 0) problems.push('two-step negative'); }
    // Number line and building fractions
    if (genId === 'nl-which-fraction' && q.answer !== `${q.visual.mark}/${q.visual.parts}`) problems.push('number line fraction wrong');
    if (genId === 'nl-how-many-steps' && Number(q.answer) !== q.visual.parts) problems.push('steps wrong');
    if (genId === 'nl-place' && Number(q.answer) !== q.visual.mark) problems.push('place wrong');
    if (genId === 'nl-halfway' && Math.abs(val(q.answer) - 0.5) > 1e-9) problems.push('halfway is not one half');
    if (genId === 'nl-closer-to' && q.answer !== (q.visual.mark / q.visual.parts < 0.5 ? '0' : '1')) problems.push('closer-to wrong');
    if (genId === 'bf-how-many-units' && Number(q.answer) !== q.visual.shaded) problems.push('unit count wrong');
    if (genId === 'bf-sum-of-units') { const terms = q.answer.split(' + '); if (terms.length !== q.visual.shaded || !terms.every((t) => t === `1/${q.visual.parts}`)) problems.push('sum of units wrong'); }
    if (genId === 'bf-split') { const [x, y] = q.answer.split(' + '); if (Math.abs(val(x) + val(y) - q.visual.shaded / q.visual.parts) > 1e-9) problems.push('split does not add up'); }
    if (genId === 'bf-share') { const [things, people] = allInts; if (q.answer !== `${things}/${people}`) problems.push('share wrong'); }
    // Pre-K, re-derived from the words and picture specs
    const spec = (c) => String(c).replace(/^item:/, '').split('#')[0].split('-');
    if (genId === 'pc-tap-colour' && q.answer !== `swatch:${q.prompt.match(/Tap (?:the )?(\w+)/)[1]}`) problems.push('tapped colour wrong');
    if (genId === 'pc-name-colour' && q.answer !== q.visual.colour) problems.push('named colour wrong');
    if (genId === 'pc-same-colour' && spec(q.answer)[1] !== q.visual.colour) problems.push('same colour wrong');
    if (genId === 'pc-different-colour') { const cols = q.choices.map((c) => spec(c)[1]); const odd = q.choices.find((c) => cols.filter((x) => x === spec(c)[1]).length === 1); if (q.answer !== odd) problems.push('different colour wrong'); }
    if (genId === 'ps-find-match' && (spec(q.answer)[0] !== q.visual.shape || spec(q.answer)[1] !== q.visual.colour)) problems.push('match wrong');
    if (genId === 'ps-odd-one-out') { const shapes = q.choices.map((c) => spec(c)[0]); const odd = q.choices.find((c) => shapes.filter((x) => x === spec(c)[0]).length === 1); if (q.answer !== odd) problems.push('odd shape wrong'); }
    if (genId === 'ps-same-colour-shape' && (spec(q.answer)[0] !== q.visual.shape || spec(q.answer)[1] !== q.visual.colour)) problems.push('exact match wrong');
    if (genId === 'ps-bigger' && spec(q.answer)[2] !== 'big') problems.push('bigger wrong');
    if (genId === 'ps-smaller' && spec(q.answer)[2] !== 'small') problems.push('smaller wrong');
    if (genId === 'pp-what-next') { const it = q.visual.items; if (spec(q.answer)[0] !== it[it.length % 2 === 0 ? 0 : 1]) problems.push('what next wrong'); }
    if (genId === 'pp-which-repeats') { const it = q.visual.items; const repeats = [2, 3].some((p) => it.every((x, i) => x === it[i % p])); if (q.answer !== (repeats ? 'Yes' : 'No')) problems.push('repeats wrong'); }
    if (genId === 'pp-missing') { const it = q.visual.items; const i = it.indexOf('?'); if (spec(q.answer)[0] !== it.find((x, j) => j % 2 === i % 2 && x !== '?')) problems.push('missing wrong'); }
    if (genId === 'p3-how-many' && Number(q.answer) !== (q.visual.counting ? q.visual.items.length : q.visual.count)) problems.push('pre-K how many wrong'); // dots or a counting row (pass HS)
    if (genId === 'p3-tap-group' && dotCount(q.answer) !== Number(q.prompt.match(/Tap (?:the group of )?(\d)/)[1])) problems.push('pre-K tap group wrong');
    if (genId === 'p3-tap-one' && dotCount(q.answer) !== 1) problems.push('tap one wrong');
    if (genId === 'p3-more' && dotCount(q.answer) !== Math.max(...q.choices.map(dotCount))) problems.push('pre-K more wrong');
    // Grade 1, re-derived from the numbers in the words
    const g1 = text.match(/\d+/g) ? text.match(/\d+/g).map(Number) : [];
    if (genId === 'g1-ten-and' && Number(q.answer) !== 10 + g1[0]) problems.push('ten-and wrong');
    if (genId === 'g1-teen-split' && Number(q.answer) !== g1[0] - 10) problems.push('teen split wrong');
    if (genId === 'g1-teen-pic' && Number(q.answer) !== 10 + (q.visual.b || q.visual).count) problems.push('teen picture wrong');
    if (genId === 'g1-which-teen' && dotCount(q.answer) !== g1[0] - 10) problems.push('which teen wrong');
    if (genId === 'g1-teen-after' && Number(q.answer) !== g1[0] + 1) problems.push('teen after wrong');
    if ((genId === 'g1-add' || genId === 'g1-add-story') && Number(q.answer) !== g1[0] + g1[1]) problems.push('grade 1 add wrong');
    if (genId === 'g1-make-ten-add') { const m2 = q.prompt.match(/(\d+) \+ (\d+)\?/); if (Number(q.answer) !== Number(m2[1]) + Number(m2[2])) problems.push('make ten add wrong'); }
    if (genId === 'g1-add-pic' && dotCount(q.answer) !== g1[0] + g1[1]) problems.push('add picture wrong');
    if (genId === 'g1-add-missing' && g1[0] + Number(q.answer) !== g1[1]) problems.push('missing addend wrong');
    if ((genId === 'g1-sub' || genId === 'g1-sub-story') && Number(q.answer) !== g1[0] - g1[1]) problems.push('grade 1 subtract wrong');
    if (genId === 'g1-sub-undo') { const [a, b] = g1; if (Number(q.answer) !== a) problems.push('sub undo wrong'); }
    if (genId === 'g1-sub-pic' && dotCount(q.answer) !== g1[0] - g1[1]) problems.push('sub picture wrong');
    if (genId === 'g1-compare-diff' && Number(q.answer) !== g1[0] - g1[1]) problems.push('difference wrong');
    if (genId === 'g1-tens-ones' && Number(q.answer) !== g1[0] * 10 + g1[1]) problems.push('tens and ones wrong');
    if (genId === 'g1-how-many-tens' && Number(q.answer) !== Math.floor(g1[0] / 10)) problems.push('how many tens wrong');
    if (genId === 'g1-how-many-ones' && Number(q.answer) !== g1[0] % 10) problems.push('how many ones wrong');
    if (genId === 'g1-build-number') { const [t, o] = q.answer.match(/\d+/g).map(Number); const target = Number(q.prompt.match(/\d+/)[0]); if (t * 10 + o !== target) problems.push('build number wrong'); }
    if (genId === 'g1-ten-more' && Number(q.answer) !== g1[0] + 10) problems.push('ten more wrong');
    // Pass KT: the kinds added at the full standard, each re-derived from the numbers in the words.
    if (genId === 'g1-add-start' && Number(q.answer) + g1[0] !== g1[1]) problems.push('missing start wrong');
    if (genId === 'g1-sub-missing' && g1[0] - Number(q.answer) !== g1[1]) problems.push('missing take-away wrong');
    if (genId === 'g1-sub-start' && Number(q.answer) - g1[0] !== g1[1]) problems.push('missing start of take-away wrong');
    if (genId === 'g1-ten-less' && Number(q.answer) !== g1[0] - 10) problems.push('ten less wrong');
    if (genId === 'g1-tens-plus' && Number(q.answer) !== g1[0] + g1[1]) problems.push('tens plus wrong');
    if (genId === 'g1-other-way') { const [t, o] = q.answer.match(/\d+/g).map(Number); const target = Number(q.prompt.match(/\d+/)[0]); if (t * 10 + o !== target || o < 10) problems.push('other way wrong'); }
    if (genId === 'g1-more-less-same') { const [a, b] = g1; if (q.answer !== (a > b ? 'Greater than' : a < b ? 'Less than' : 'Equal to')) problems.push('greater, less or equal wrong'); }
    if (genId === 'g1-which-sign') { const [a, b] = g1; if (q.answer !== (a > b ? '>' : a < b ? '<' : '=')) problems.push('comparison sign wrong'); }
    if (genId === 'g1-bigger' && Number(q.answer) !== Math.max(...q.choices.map(Number))) problems.push('grade 1 bigger wrong');
    if (genId === 'g1-smaller' && Number(q.answer) !== Math.min(...q.choices.map(Number))) problems.push('grade 1 smaller wrong');
    if (genId === 'g1-between') { const [lo, hi] = g1; const a = Number(q.answer); if (!(a > lo && a < hi)) problems.push('between wrong'); }
    if (genId === 'g1-order-three') { const arr = q.answer.split(', ').map(Number); if (!arr.every((v, i) => i === 0 || v > arr[i - 1])) problems.push('order wrong'); }
    // Grade 1 reading, re-derived from the shown word or sentence
    const shown = q.visual && q.visual.kind === 'letters' ? q.visual.text : '';
    const PICW = { 'solid:cube': 'box', 'solid:cylinder': 'can', 'pic:cat': 'cat', 'pic:fox': 'fox', 'icon:sun': 'sun', 'icon:dog': 'dog', 'icon:hat': 'hat', 'icon:bed': 'bed', 'icon:cup': 'cup', 'icon:bus': 'bus', 'icon:fan': 'fan', 'icon:log': 'log', 'icon:map': 'map' };   // pass KU: closed-syllable words with pictures
    const NUMW = ['one', 'two', 'three', 'four', 'five', 'six'];
    const DIG = (w) => (['sh', 'ch', 'th'].find((d) => w.startsWith(d)) || ['sh', 'ch', 'th'].find((d) => w.endsWith(d)));
    if (genId === 'r1-word-picture' && PICW[q.answer] !== shown) problems.push('word picture wrong');
    if (genId === 'r1-word-colour' && q.answer !== `swatch:${shown}`) problems.push('word colour wrong');
    if (genId === 'r1-word-number' && dotCount(q.answer) !== NUMW.indexOf(shown) + 1) problems.push('word number wrong');
    if (genId === 'r1-which-word' && q.answer !== PICW[`${q.visual.kind}:${q.visual.name}`]) problems.push('which word wrong');
    if (genId === 'r1-word-shape' && q.answer !== `shape:${shown}`) problems.push('word shape wrong');
    if (genId === 'r1-starts-with' && !shown.startsWith(q.answer)) problems.push('starts-with wrong');
    if (genId === 'r1-ends-with' && !shown.endsWith(q.answer)) problems.push('ends-with wrong');
    if (genId === 'r1-which-pair' && DIG(q.answer) !== shown) problems.push('which pair wrong');
    if (genId === 'r1-same-pair' && DIG(q.answer) !== DIG(shown)) problems.push('same pair wrong');
    if (genId === 'r1-odd-pair') { const ds = q.choices.map(DIG); const odd = q.choices.find((c) => ds.filter((d) => d === DIG(c)).length === 1); if (q.answer !== odd) problems.push('odd pair wrong'); }
    if (genId === 'r1-add-e' && q.answer !== shown + 'e' && q.answer.slice(0, -1) !== shown) problems.push('add e wrong');
    if (genId === 'r1-has-silent-e' && q.answer !== (shown.endsWith('e') ? 'Yes' : 'No')) problems.push('silent e yes/no wrong');
    if (genId === 'r1-long-or-short' && q.answer !== (shown.endsWith('e') ? 'Yes' : 'No')) problems.push('long or short wrong');
    if (genId === 'r1-pick-long' && !q.answer.endsWith('e')) problems.push('pick long wrong');
    if (genId === 'r1-take-e' && q.answer + 'e' !== shown) problems.push('take e wrong');
    if (genId === 'r1-sentence-picture') { const m2 = shown.match(/The (\w+) is (\w+)\./); if (q.answer !== `item:${m2[1]}-${m2[2]}`) problems.push('sentence picture wrong'); }
    if (genId === 'r1-sentence-which' && q.answer !== `The ${q.visual.shape} is ${q.visual.colour}.`) problems.push('sentence which wrong');
    if (genId === 'r1-sentence-colour' && q.answer !== shown.match(/is (\w+)\./)[1]) problems.push('sentence colour wrong');
    if (genId === 'r1-sentence-count' && Number(q.answer) !== NUMW.indexOf(shown.match(/see (\w+) /)[1]) + 1) problems.push('sentence count wrong');
    if (genId === 'r1-sentence-yes-no') { const m2 = q.explainVisual.text.match(/is (\w+)\./); if (q.answer !== (m2[1] === q.visual.colour ? 'Yes' : 'No')) problems.push('sentence yes/no wrong'); }
    if (genId === 'r1-who' && q.answer !== q.story.match(/^(\w+) has/)[1]) problems.push('who wrong');
    if (genId === 'r1-end-mark' && q.answer !== shown.slice(-1)) problems.push('end mark wrong');
    if (genId === 'r1-order-events') { const m2 = q.story.match(/^First (.+?)\. Then (.+?)\. Last (.+?)\.$/); const want = /first\?$/.test(q.prompt) ? m2[1] : m2[3]; if (q.answer.toLowerCase() !== want.toLowerCase()) problems.push('order of events wrong'); }
    if (genId === 'r1-where' && q.answer !== q.story.match(/ran to (the \w+)\./)[1]) problems.push('where wrong');
    if (genId === 'r1-what-colour' && q.answer !== q.story.match(/got a (\w+) /)[1]) problems.push('what colour wrong');
    if (genId === 'r1-how-many' && Number(q.answer) !== NUMW.indexOf(q.story.match(/has (\w+) /)[1]) + 1) problems.push('how many wrong');
    if (genId === 'r1-true-false') { const real = q.story.match(/ran to (the \w+)\./)[1]; const claim = q.prompt.match(/run to (the \w+)\?/)[1]; /* the question reads: In the story, did the dog run to the hill? (pass IB) */ if (q.answer !== (real === claim ? 'Yes' : 'No')) problems.push('true/false wrong'); }
    // Grade 2, re-derived from the numbers in the words
    const g2 = text.match(/\d+/g) ? text.match(/\d+/g).map(Number) : [];
    const HOURS = ['twelve', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven'];
    const COINV = { penny: 1, nickel: 5, dime: 10, quarter: 25 };
    if (genId === 'g2-place-value' && Number(q.answer) !== g2[0] * 100 + g2[1] * 10 + g2[2]) problems.push('place value wrong');
    if (genId === 'g2-expanded') { const parts = q.answer.split(' + ').map(Number); if (parts.reduce((x, y) => x + y, 0) !== g2[0] || parts.length !== 3) problems.push('expanded form wrong'); }
    if (genId === 'g2-digit-means') { const n = g2[0]; const place = text.match(/the (\w+) digit/)[1]; /* pass IE: the place is named in the question */ const want = place === 'hundreds' ? Math.floor(n / 100) * 100 : place === 'tens' ? Math.floor((n % 100) / 10) * 10 : n % 10; if (Number(q.answer) !== want) problems.push('digit value wrong'); }
    if (genId === 'g2-build-3digit') { const [h, t, o] = q.answer.match(/\d+/g).map(Number); if (h * 100 + t * 10 + o !== g2[0]) problems.push('build 3-digit wrong'); }
    if (genId === 'g2-hundred-more') { const more = /more/.test(q.prompt); if (Number(q.answer) !== (more ? g2[1] + 100 : g2[1] - 100)) problems.push('hundred more/less wrong'); }
    if ((genId === 'g2-add' || genId === 'g2-add-story') && Number(q.answer) !== g2[0] + g2[1]) problems.push('grade 2 add wrong');
    if (genId === 'g2-add-carry-ones') { const [a, b] = g2; const o = (a % 10) + (b % 10); if (q.answer !== `Write ${o % 10}, carry 1 ten` || o < 10) problems.push('carry wrong'); }
    if (genId === 'g2-add-missing' && g2[0] + Number(q.answer) !== g2[1]) problems.push('grade 2 missing addend wrong');
    if (genId === 'g2-add-three' && Number(q.answer) !== g2[0] + g2[1] + g2[2]) problems.push('add three wrong');
    if ((genId === 'g2-sub' || genId === 'g2-sub-story' || genId === 'g2-sub-compare') && Number(q.answer) !== g2[0] - g2[1]) problems.push('grade 2 subtract wrong');
    if (genId === 'g2-sub-borrow-ones') { const [a] = g2; const t = Math.floor(a / 10); const o = a % 10; if (q.answer !== `${t - 1} tens and ${o + 10} ones`) problems.push('borrow wrong'); }
    if (genId === 'g2-sub-check') { const [a, b] = g2; if (q.answer !== `${a - b} + ${b} = ${a}`) problems.push('sub check wrong'); }
    if (genId === 'g2-read-clock' && q.answer !== `${HOURS[q.visual.hour % 12]} o'clock`) problems.push('read clock wrong');
    if (genId === 'g2-half-past' && q.answer !== `half past ${HOURS[q.visual.hour % 12]}`) problems.push('half past wrong');
    if (genId === 'g2-which-clock') { const half = /half past/.test(q.prompt); const word = half ? q.prompt.match(/half past (\w+)/)[1] : q.prompt.match(/shows (\w+) o'clock/)[1]; const h = HOURS.indexOf(word) === 0 ? 12 : HOURS.indexOf(word); if (q.answer !== `clock:${h}:${half ? 30 : 0}`) problems.push('which clock wrong'); }
    if (genId === 'g2-minutes-in') { const want = /half an hour/.test(q.prompt) ? 30 : /two hours/.test(q.prompt) ? 120 : 60; if (Number(q.answer) !== want) problems.push('minutes wrong'); }
    if (genId === 'g2-hour-later') { const h = q.visual.hour; const later = g2[0]; const h2 = ((h + later - 1) % 12) + 1; if (q.answer !== `${HOURS[h2 % 12]} o'clock`) problems.push('hour later wrong'); }
    if (genId === 'g2-coin-value' && Number(q.answer) !== COINV[q.prompt.match(/is a (\w+)/)[1]]) problems.push('coin value wrong');
    if (genId === 'g2-count-coins') { const names = q.story.match(/\ba (penny|nickel|dime|quarter)/gi).map((x) => x.slice(2).toLowerCase()); if (Number(q.answer) !== names.reduce((sum, n) => sum + COINV[n], 0)) problems.push('count coins wrong'); }
    if (genId === 'g2-make-amount') { const names = q.answer.match(/a (\w+)/g).map((x) => x.slice(2)); if (names.reduce((sum, n) => sum + COINV[n], 0) !== g2[0]) problems.push('make amount wrong'); }
    if (genId === 'g2-change' && Number(q.answer) !== 100 - g2[0]) problems.push('change wrong');
    if (genId === 'g2-which-more-money') { const val = (c) => { const [n, coin] = c.split(' '); return Number(n) * COINV[coin.replace(/ies$/, 'y').replace(/s$/, '')]; /* pass IE: pennies */ }; if (val(q.answer) !== Math.max(...q.choices.map(val))) problems.push('more money wrong'); }
    if (genId === 'g2-array-total' && Number(q.answer) !== q.visual.rows * q.visual.cols) problems.push('array total wrong');
    if (genId === 'g2-repeated-add') { const terms = q.answer.split(' + ').map(Number); if (terms.length !== q.visual.rows || !terms.every((t) => t === q.visual.cols)) problems.push('repeated add wrong'); }
    if (genId === 'g2-rows-in' && Number(q.answer) !== q.visual.rows) problems.push('rows wrong');
    if (genId === 'g2-which-array' && q.answer !== `array:${g2[0]}x${g2[1]}`) problems.push('which array wrong');
    if (genId === 'g2-even-odd' && q.answer !== (g2[0] % 2 === 0 ? 'Even' : 'Odd')) problems.push('even/odd wrong');
    // Grade 2 reading, re-derived from word lists the generator does not share
    const TEAM = { rain: ['ai', 'A'], pail: ['ai', 'A'], wait: ['ai', 'A'], boat: ['oa', 'O'], road: ['oa', 'O'], soap: ['oa', 'O'], feet: ['ee', 'E'], seed: ['ee', 'E'], keep: ['ee', 'E'], meat: ['ea', 'E'], leaf: ['ea', 'E'], bead: ['ea', 'E'] };
    const SPLIT = { rabbit: 'rab bit', basket: 'bas ket', napkin: 'nap kin', picnic: 'pic nic', magnet: 'mag net', sunset: 'sun set', muffin: 'muf fin', cactus: 'cac tus' };
    const SYL2 = { banana: 3, elephant: 3, umbrella: 3, butterfly: 3 };
    if (genId === 'r2-team-sound' && q.answer !== TEAM[shown][1]) problems.push('team sound wrong');
    if (genId === 'r2-which-team' && q.answer !== TEAM[shown][0]) problems.push('which team wrong');
    if (genId === 'r2-team-word' && TEAM[q.answer][1] !== q.prompt.match(/long (\w) sound/)[1]) problems.push('team word wrong');
    if (genId === 'r2-same-team' && TEAM[q.answer][0] !== TEAM[shown][0]) problems.push('same team wrong');
    if (genId === 'r2-odd-team') { const ts = q.choices.map((c) => TEAM[c][0]); const odd = q.choices.find((c) => ts.filter((t) => t === TEAM[c][0]).length === 1); if (q.answer !== odd) problems.push('odd team wrong'); }
    if (genId === 'r2-split-word' && q.answer !== SPLIT[shown]) problems.push('split wrong');
    if (genId === 'r2-join-parts' && SPLIT[q.answer] !== shown) problems.push('join parts wrong');
    if (genId === 'r2-compound') { const [a, b] = shown.split(' + '); if (q.answer !== a + b) problems.push('compound wrong'); }
    if (genId === 'r2-compound-parts') { const [a, b] = q.answer.split(' and '); if (a + b !== shown) problems.push('compound parts wrong'); }
    if (genId === 'r2-count-parts') { const want = SYL2[shown] || (SPLIT[shown] ? 2 : 1); if (Number(q.answer) !== want) problems.push('count parts wrong'); }
    if (genId === 'r2-why' && q.answer !== `Because ${q.story.match(/because (.+?)\. At/)[1]}`) problems.push('why wrong');
    if (genId === 'r2-first' && q.answer !== q.story.split('. ')[0]) problems.push('first wrong');
    if (genId === 'r2-last' && q.answer !== q.story.match(/At the end (.+)\.$/)[1]) problems.push('last wrong');
    if (genId === 'r2-who-did' && q.answer !== q.story.split(' ')[0]) problems.push('who did wrong');
    if (genId === 'r2-how-felt' && q.answer !== q.story.match(/felt (\w+)/)[1]) problems.push('how felt wrong');
    if (genId === 'r2-context') { const CTX = { famished: 'very hungry', enormous: 'very big', timid: 'shy and easily scared', gleaming: 'shining brightly', drowsy: 'sleepy', ancient: 'very old', vanished: 'disappeared', fragile: 'easily broken' }; if (q.answer !== CTX[shown]) problems.push('context meaning wrong'); }
    if (genId === 'r2-opposite') { const OPP = { big: 'small', small: 'big', hot: 'cold', cold: 'hot', fast: 'slow', slow: 'fast', happy: 'sad', sad: 'happy', wet: 'dry', dry: 'wet', loud: 'quiet', quiet: 'loud', full: 'empty', empty: 'full', old: 'new', new: 'old' }; if (q.answer !== OPP[shown]) problems.push('opposite wrong'); }
    if (genId === 'r2-best-fit') { const SENT = { famished: 'ate three bowls', enormous: 'could not fit', timid: 'hid under the bed', gleaming: 'sparkled', drowsy: 'yawned', ancient: 'since before the town', vanished: 'could not be seen', fragile: 'does not break' }; if (!q.story.includes(SENT[q.answer])) problems.push('best fit wrong'); }
    // Grade 3 reading, re-derived from the passage parts
    const AFFIX = { un: 'not', re: 'again', pre: 'before', dis: 'the opposite of', mis: 'wrongly', ful: 'full of', less: 'without', er: 'a person who', ly: 'in that way' };
    const OPS = ['Spiders are scary.', 'Winter is the best season.', 'Vegetables taste awful.', 'Blue is the prettiest color.', 'Math is boring.', 'Cats are better than dogs.', 'Rainy days are the worst.', 'Football is the most fun sport.'];
    if (genId === 'r3-main-idea' && !q.story.startsWith(q.answer)) problems.push('main idea is not the opening sentence');
    if (genId === 'r3-detail' && (!q.story.includes(q.answer) || q.story.startsWith(q.answer))) problems.push('detail is not a later sentence of the passage');
    if (genId === 'r3-not-in-passage' && q.story.includes(q.answer)) problems.push('not-in-passage sentence is in the passage');
    if (genId === 'r3-best-title') { /* the title matches the topic, checked by the passage list itself */ }
    if (genId === 'r3-prefix-meaning' && q.answer !== AFFIX[q.prompt.match(/prefix (\w+)/)[1]]) problems.push('prefix meaning wrong');
    if (genId === 'r3-suffix-meaning' && q.answer !== AFFIX[q.prompt.match(/suffix (\w+)/)[1]]) problems.push('suffix meaning wrong');
    if (genId === 'r3-build-word') { const [affix, base] = [q.story.match(/Add (\w+) to/)[1], q.story.match(/to (\w+)\./)[1]]; if (q.answer !== affix + base && q.answer !== base + affix && q.answer !== base.replace(/e$/, '') + affix) problems.push('built word wrong'); }
    if (genId === 'r3-which-affix') { const word = q.story.match(/Look at (\w+)\./)[1]; if (!word.startsWith(q.answer) && !word.endsWith(q.answer)) problems.push('affix not in word'); }
    if (genId === 'r3-take-affix') { const [affix, word] = [q.story.match(/Take (\w+) off/)[1], q.story.match(/off (\w+)\./)[1]]; if (word !== affix + q.answer && word !== q.answer + affix && word !== q.answer.replace(/e$/, '') + affix) problems.push('take affix wrong'); }
    if (genId === 'r3-fact-opinion' && q.answer !== (OPS.includes(q.story) ? 'Opinion' : 'Fact')) problems.push('fact/opinion wrong');
    if (genId === 'r3-which-is-fact' && OPS.includes(q.answer)) problems.push('picked an opinion as a fact');
    if (genId === 'r3-which-is-opinion' && !OPS.includes(q.answer)) problems.push('picked a fact as an opinion');
    if (genId === 'r3-clue-word' && !q.story.toLowerCase().includes(q.answer)) problems.push('clue word not in sentence');
    if (genId === 'r3-cause' && !q.story.toLowerCase().startsWith(q.answer.toLowerCase())) problems.push('cause wrong');
    if (genId === 'r3-effect' && !q.story.endsWith(q.answer + '.')) problems.push('effect wrong');
    if (genId === 'r3-order') { const steps = q.story.match(/(?:First|Next|Then|Finally), ([^.]+)\./g).map((x) => x.replace(/^\w+, /, '').replace(/\.$/, '')); const before = q.prompt.match(/after you (.+)\?/)[1]; if (steps[steps.indexOf(before) + 1] !== q.answer) problems.push('order wrong'); }
    if (genId === 'r3-signal-word') { const w = q.visual.text; const cause = ['because', 'so', 'since', 'as a result'].includes(w); if (q.answer !== (cause ? 'A cause or effect' : 'The order of events')) problems.push('signal word wrong'); }
    if (genId === 'r3-what-next') { const steps = q.story.match(/(?:First|Next|Then), ([^.]+)\./g).map((x) => x.replace(/^\w+, /, '').replace(/\.$/, '')); if (steps.includes(q.answer)) problems.push('what-next repeats a given step'); }
    // Grade 4, re-derived from the numbers in the words
    const g4 = text.match(/\d+/g) ? text.match(/\d+/g).map(Number) : [];
    const isPrimeN = (n) => n > 1 && Array.from({ length: n - 2 }, (_, i) => i + 2).every((d) => n % d !== 0);
    if ((genId === 'g4-two-by-one' || genId === 'g4-two-by-two' || genId === 'g4-multiply-story') && Number(q.answer) !== g4[0] * g4[1]) problems.push('grade 4 multiply wrong');
    if (genId === 'g4-split-first') { const [a, b] = g4; if (q.answer !== `${Math.floor(a / 10) * 10} × ${b} and ${a % 10} × ${b}`) problems.push('split wrong'); }
    if (genId === 'g4-estimate-product') { const [a, b] = g4; if (Number(q.answer) !== Math.round(a / 10) * 10 * b) problems.push('estimate wrong'); }
    if ((genId === 'g4-divide-exact' || genId === 'g4-divide-story') && Number(q.answer) * g4[1] !== g4[0]) problems.push('grade 4 divide wrong');
    if (genId === 'g4-divide-remainder') { const [n, b] = g4; const [qq, r] = q.answer.match(/\d+/g).map(Number); if (qq * b + r !== n || r >= b) problems.push('remainder division wrong'); }
    if (genId === 'g4-check-division') { const [n, b, qq, r] = g4; if (q.answer !== `${qq} × ${b} + ${r} = ${n}` || qq * b + r !== n) problems.push('division check wrong'); }
    if (genId === 'g4-remainder-only') { const [n, b] = g4; if (Number(q.answer) !== n % b) problems.push('remainder wrong'); }
    if (genId === 'g4-is-factor') { const [f, n] = g4; if (q.answer !== (n % f === 0 ? 'Yes' : 'No')) problems.push('is-factor wrong'); }
    if (genId === 'g4-list-factor' && g4[0] % Number(q.answer) !== 0) problems.push('listed factor does not divide');
    if (genId === 'g4-multiple' && Number(q.answer) % g4[0] !== 0) problems.push('multiple wrong');
    if (genId === 'g4-prime' && q.answer !== (isPrimeN(g4[0]) ? 'Yes' : 'No')) problems.push('prime wrong');
    if (genId === 'g4-next-multiple') { const [a, b, base] = g4; if (Number(q.answer) !== b + base || b - a !== base) problems.push('next multiple wrong'); }
    if (genId === 'g4-fraction-to-decimal') { const [top, bottom] = g4; if (Math.abs(Number(q.answer) - top / bottom) > 1e-9) problems.push('fraction to decimal wrong'); }
    if (genId === 'g4-decimal-to-fraction') { const dec = Number(q.prompt.match(/Write ([\d.]+) as/)[1]); const [top, bottom] = q.answer.split('/').map(Number); if (Math.abs(top / bottom - dec) > 1e-9) problems.push('decimal to fraction wrong'); }
    if (genId === 'g4-compare-decimals' && Number(q.answer) !== Math.max(...q.choices.map(Number))) problems.push('compare decimals wrong');
    if (genId === 'g4-tenths-hundredths' && Number(q.answer) !== g4[0] * 10) problems.push('tenths to hundredths wrong');
    if (genId === 'g4-decimal-picture' && Math.abs(Number(q.answer) - q.visual.shaded / 10) > 1e-9) problems.push('decimal picture wrong');
    if (genId === 'g4-add-fraction') { const [a, d, b] = g4; if (q.answer !== `${a + b}/${d}`) problems.push('add fraction wrong'); }
    if (genId === 'g4-sub-fraction') { const [a, d, b] = g4; if (q.answer !== `${a - b}/${d}`) problems.push('sub fraction wrong'); }
    if (genId === 'g4-mixed-number') { const [top, d] = g4; const [w, p, dd] = q.answer.match(/\d+/g).map(Number); if (w * d + p !== top || dd !== d) problems.push('mixed number wrong'); }
    if (genId === 'g4-fraction-story') { const [d, a, b] = g4; if (q.answer !== `${a + b}/${d}`) problems.push('fraction story wrong'); }
    if (genId === 'g4-simplify') { const [top, bottom] = g4; const [t2, b2] = q.answer.split('/').map(Number); if (Math.abs(t2 / b2 - top / bottom) > 1e-9 || t2 >= top) problems.push('simplify wrong'); }
    if (genId === 'bf-add-same-bottom') { const [a, p, b] = nums.flatMap((f) => f.split('/').map(Number)).filter((_, i) => i !== 3); if (q.answer !== `${a + b}/${p}`) problems.push('same-bottom sum wrong'); }
    // Letter sounds and rhymes, re-derived from the words themselves
    const RHYME_END = (w) => w.slice(-2);
    if (genId === 'rs-word-starts' && q.answer !== q.story.replace(/\.$/, '').toLowerCase()[0].toUpperCase()) problems.push('first sound letter wrong');
    if (genId === 'pl-tap-letter' && q.answer !== q.prompt.match(/letter (\w)/)[1]) problems.push('pre-K tap letter wrong');
    // Grade 5 math, re-derived from the prompt
    if (genId === 'g5-add-decimals') { const [a, b] = q.prompt.match(/[\d.]+/g).map(Number); if (Math.abs(a + b - Number(q.answer)) > 0.001) problems.push('decimal sum wrong'); }
    if (genId === 'g5-subtract-decimals') { const [a, b] = q.prompt.match(/[\d.]+/g).map(Number); if (Math.abs(a - b - Number(q.answer)) > 0.001) problems.push('decimal difference wrong'); }
    if (genId === 'g5-decimal-money') { const [a, b] = q.story.match(/[\d.]+/g).map(Number); if (Math.abs(a + b - Number(q.answer.replace('$', ''))) > 0.001) problems.push('money sum wrong'); }
    if (genId === 'g5-multiply-fractions') { const [a, b, c, d] = q.prompt.match(/\d+/g).map(Number); const [t, m] = q.answer.split('/').map(Number); if (a * c * m !== b * d * t) problems.push('fraction product wrong'); }
    if (genId === 'g5-fraction-of-whole') { const [n, c, d] = q.prompt.match(/\d+/g).map(Number); const parts = q.answer.split('/').map(Number); const val = parts.length === 2 ? parts[0] / parts[1] : parts[0]; if (Math.abs(val - n * c / d) > 0.0001) problems.push('fraction of whole wrong'); }
    if (genId === 'g5-divide-2digit') { const [n, d] = q.prompt.match(/\d+/g).map(Number); if (n / d !== Number(q.answer)) problems.push('two-digit quotient wrong'); }
    if (genId === 'g5-divide-check') { const [n, d, qn] = q.story.match(/\d+/g).map(Number); if (!q.answer.startsWith(`${d} x ${qn} = ${n}`)) problems.push('division check wrong'); }
    if (genId === 'g5-divide-remainder') { const [n, d] = q.prompt.match(/\d+/g).map(Number); const [qn, r] = q.answer.match(/\d+/g).map(Number); if (qn * d + r !== n || r >= d) problems.push('remainder wrong'); }
    if (genId === 'g5-volume') { const [l, w, h] = q.story.match(/\d+/g).map(Number); if (Number(q.answer.match(/\d+/)[0]) !== l * w * h) problems.push('volume wrong'); }
    if (genId === 'g5-missing-side') { const [v, l, w] = q.story.match(/\d+/g).map(Number); if (Number(q.answer.match(/\d+/)[0]) * l * w !== v) problems.push('missing side wrong'); }
    if (genId === 'g5-volume-layers') { const [layer, h] = q.story.match(/\d+/g).map(Number); if (Number(q.answer) !== layer * h) problems.push('layers wrong'); }
    if (genId === 'g5-order-ops') { const [a, b, c] = q.prompt.match(/\d+/g).map(Number); if (Number(q.answer) !== a + b * c) problems.push('order of operations wrong'); }
    if (genId === 'g5-brackets') { const [a, b, c] = q.prompt.match(/\d+/g).map(Number); if (Number(q.answer) !== (a + b) * c) problems.push('brackets wrong'); }
    // College math, re-derived from the prompt
    if (genId === 'gc-mean') { const vals = q.story.split(', ').map(Number); if (Math.abs(Number(q.answer) - vals.reduce((a, b) => a + b, 0) / vals.length) > 0.06) problems.push('mean wrong'); }
    if (genId === 'gc-median') { const vals = q.story.split(', ').map(Number).sort((a, b) => a - b); if (Number(q.answer) !== vals[Math.floor(vals.length / 2)]) problems.push('median wrong'); }
    if (genId === 'gc-mode') { const vals = q.story.split(', ').map(Number); const counts = {}; vals.forEach((v) => { counts[v] = (counts[v] || 0) + 1; }); const best = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0]; if (q.answer !== best) problems.push('mode wrong'); }
    if (genId === 'gc-range') { const vals = q.story.split(', ').map(Number); if (Number(q.answer) !== Math.max(...vals) - Math.min(...vals)) problems.push('range wrong'); }
    if (genId === 'gc-more-spread') { const [a, b] = q.story.split('\n').map((line) => line.replace(/^Set [AB]: /, '').split(', ').map(Number)); const ra = Math.max(...a) - Math.min(...a); const rb = Math.max(...b) - Math.min(...b); if (q.answer !== (ra > rb ? 'Set A' : 'Set B')) problems.push('spread wrong'); }
    if (genId === 'gc-simple-probability') { const [red, blue] = q.story.match(/\d+/g).map(Number); const [t, m] = q.answer.split('/').map(Number); if (t * (red + blue) !== red * m) problems.push('probability wrong'); }
    if (genId === 'gc-not-probability') { const [red, blue] = q.story.match(/\d+/g).map(Number); const [t, m] = q.answer.split('/').map(Number); if (t * (red + blue) !== blue * m) problems.push('not probability wrong'); }
    if (genId === 'gc-two-independent') { const [a, b] = q.story.match(/1\/(\d+)/g).map((x) => Number(x.slice(2))); if (q.answer !== `1/${a * b}`) problems.push('two independent wrong'); }
    if (genId === 'gc-compound-amount') { const [principal, rate] = q.story.replace(/,/g, '').match(/\d+/g).map(Number); const years = Number(q.prompt.match(/\d+/)[0]); if (Number(q.answer.replace(/,/g, '').match(/\d+/)[0]) !== Math.round(principal * (1 + rate / 100) ** years)) problems.push('compound amount wrong'); }
    if (genId === 'gc-simple-vs-compound') { const [principal, rate, years] = q.story.replace(/,/g, '').match(/\d+/g).map(Number); const diff = Math.round(principal * (1 + rate / 100) ** years) - (principal + principal * rate / 100 * years); if (Number(q.answer.replace(/,/g, '').match(/\d+/)[0]) !== diff) problems.push('simple vs compound wrong'); }
    if (genId === 'gc-years-to-grow') { const target = Number(q.prompt.match(/\d+/)[0]); if (Number(q.answer.match(/\d+/)[0]) !== Math.log2(target) * 10) problems.push('years to grow wrong'); }
    // History: a dated fact is always followed by its story, so a wrong answer teaches something.
    if (/^h\d+-/.test(genId) && ['When?', 'In what year?', 'What happened that year?', 'What happened then?', 'What was it, and when?'].includes(q.prompt) && !q.explain.includes('\n')) problems.push('dated fact has no story');
    // History, re-derived from the fixed facts
    if (/^h1[01]-.*-year$/.test(genId) || genId === 'h10-rome-year' || genId === 'h10-medieval-year' || genId === 'h10-rev-year' || genId === 'h10-war-year') { const years = { 'Rome becomes a republic': '509 BC', 'Caesar crosses the Rubicon': '49 BC', 'Caesar is killed': '44 BC', 'Augustus becomes the first emperor': '27 BC', 'Rome falls in the west': '476 AD', 'The Black Death arrives in Europe': '1347', 'The Renaissance begins in Italy': 'about 1400', 'Gutenberg\'s printing press': 'about 1450', 'Rome falls in the west and feudal Europe begins': '476', 'The American Revolution declares independence': '1776', 'The French Revolution begins': '1789', 'France executes its king': '1793', 'Napoleon becomes emperor': '1804', 'The First World War begins': '1914', 'The First World War ends': '1918', 'Hitler comes to power in Germany': '1933', 'Germany invades Poland and the Second World War begins': '1939', 'Pearl Harbor brings the United States in': '1941', 'The Second World War ends': '1945', 'The transcontinental railroad is finished': '1869', 'Food and drug safety laws pass': '1906', 'Standard Oil is broken up': '1911', 'The income tax and direct election of senators': '1913', 'The 19th Amendment: women win the vote': '1920', 'The stock market crashes': '1929', 'A quarter of workers are unemployed and the New Deal begins': '1933', 'Social Security is created': '1935', 'Pearl Harbor, December 7': '1941', 'D-Day, June 6': '1944', 'Germany surrenders in May and Japan in August': '1945', 'The country apologizes for the internment of Japanese Americans': '1988', 'Sputnik': '1957', 'The Cuban Missile Crisis': '1962', 'Americans land on the moon': '1969', 'The Berlin Wall falls': '1989', 'The Soviet Union dissolves': '1991', 'Brown v. Board of Education': '1954', 'The Montgomery bus boycott': '1955', 'The March on Washington': '1963', 'The Civil Rights Act': '1964', 'The Voting Rights Act': '1965', 'Dr. King is assassinated': '1968', 'The September 11 attacks': '2001', 'The war in Iraq begins': '2003', 'The financial crisis': '2008', 'Barack Obama becomes the first Black president': '2009', 'The pandemic closes schools and businesses': '2020' }; const key = q.story.replace(/\.$/, ''); if (years[key] !== undefined && q.answer !== years[key]) problems.push('year wrong'); }
    if (['h4-tx-year', 'h4-rev-year', 'h4-union-year', 'h8-republic-year', 'h8-crisis-year'].includes(genId)) { const years = { 'San Antonio is founded': 1718, 'Mexico wins independence from Spain': 1821, 'Texas declares independence': 1836, 'Texas becomes the 28th state': 1845, 'The Alamo falls after a thirteen-day siege': 1836, 'Texans win at San Jacinto in eighteen minutes': 1836, 'Texans rise against Mexico': 1835, 'The Republic of Texas joins the United States': 1845, 'Texas becomes a state': 1845, 'Texas joins the Confederacy': 1861, 'Juneteenth: slavery ends in Texas': 1865, 'Oil at Spindletop': 1901, 'Washington takes office': 1789, 'Jefferson buys Louisiana': 1803, 'A second war with Britain begins': 1812, 'The Monroe Doctrine': 1823, 'Andrew Jackson is elected': 1828, 'The Missouri Compromise': 1820, 'The Compromise of 1850': 1850, 'The Kansas-Nebraska Act': 1854, 'The Dred Scott decision': 1857, 'Lincoln is elected': 1860 }; if (Number(q.answer) !== years[q.story.replace(/\.$/, '')]) problems.push('year wrong'); }
    if (genId === 'h8-amendment-year') { const y = { '13th': 1865, '14th': 1868, '15th': 1870 }[q.story.match(/(1[345]th)/)[1]]; if (Number(q.answer) !== y) problems.push('amendment year wrong'); }
    if (genId === 'h5-event-year' || genId === 'h5-west-year' || genId === 'h5-war-year') { const years = { 'The Stamp Act taxes paper': 1765, 'British soldiers fire on a crowd in Boston': 1770, 'Colonists dump tea into Boston Harbor': 1773, 'Shots at Lexington and Concord': 1775, 'The Declaration of Independence': 1776, 'The Louisiana Purchase doubles the country': 1803, 'Lewis and Clark set out for the Pacific': 1804, 'Gold is found in California': 1848, 'The country stretches from ocean to ocean': 1850, 'The war begins at Fort Sumter': 1861, 'The Emancipation Proclamation and Gettysburg': 1863, 'The Confederacy surrenders and the 13th Amendment ends slavery': 1865 }; if (Number(q.answer) !== years[q.story.replace(/\.$/, '')]) problems.push('year wrong'); }
    // Grade 12 government and economics, re-derived from the story
    if (genId === 'g12-two-thirds') { const n = Number(q.story.match(/\d+/)[0]); if (Number(q.answer) !== Math.ceil(2 * n / 3)) problems.push('two thirds wrong'); }
    if (genId === 'g12-override-votes') { const [total, yes] = q.story.match(/\d+/g).map(Number); if (q.answer !== (yes >= Math.ceil(2 * total / 3) ? 'Yes' : 'No')) problems.push('override wrong'); }
    if (genId === 'g12-electors') { const reps = Number(q.story.match(/has (\d+)/)[1]); if (Number(q.answer) !== reps + 2) problems.push('electors wrong'); }
    if (genId === 'g12-presidential-year') { const y = Number(q.story.match(/\d+/)[0]); if (q.answer !== (y % 4 === 0 ? 'Presidential' : 'Midterm')) problems.push('election year wrong'); }
    if (genId === 'g12-how-many') { const table = { 'members of the House of Representatives': 435, senators: 100, 'senators from each state': 2, 'justices on the Supreme Court': 9, "years in a President's term": 4, "years in a senator's term": 6, "years in a representative's term": 2, 'terms a President may serve': 2 }; const asked = { 'How many members does the House of Representatives have?': 435, 'How many senators are there?': 100, 'How many senators does each state have?': 2, 'How many justices sit on the Supreme Court?': 9, "How many years are in a President's term?": 4, "How many years are in a senator's term?": 6, "How many years are in a representative's term?": 2, 'How many terms may a President serve?': 2 }; const what = q.prompt.replace(/^How many /, '').replace(/\?$/, ''); if (Number(q.answer) !== (asked[q.prompt] ?? table[what])) problems.push('count wrong'); }
    if (genId === 'e12-opportunity-cost') { const nums = q.story.match(/\d+/g).map(Number); if (Number(q.answer) !== (nums.length > 1 ? Math.min(...nums) : nums[0])) problems.push('opportunity cost wrong'); }
    if (genId === 'e12-equilibrium-price') { const line = q.story.split('\n').find((l) => { const [, d, s] = l.match(/want (\d+) and sellers offer (\d+)/); return d === s; }); if (Number(q.answer) !== Number(line.match(/At (\d+)/)[1])) problems.push('equilibrium wrong'); }
    if (genId === 'e12-shortage-or-surplus') { const [a, b] = q.story.match(/\d+/g).map(Number); if (q.answer !== (a > b ? 'Shortage' : 'Surplus')) problems.push('shortage wrong'); }
    if (genId === 'e12-revenue') { const [qty, price] = q.story.match(/\d+/g).map(Number); if (Number(q.answer) !== qty * price) problems.push('revenue wrong'); }
    if (genId === 'e12-profit') { const [r, c] = q.story.match(/\d+/g).map(Number); if (Number(q.answer) !== r - c) problems.push('profit wrong'); }
    if (genId === 'e12-simple-interest') { const [p, r] = q.story.match(/\d+/g).map(Number); const y = Number(q.prompt.match(/\d+/)[0]); if (Number(q.answer) !== p * r * y / 100) problems.push('simple interest wrong'); }
    if (genId === 'e12-growth-rate') { const [last, now] = q.story.match(/\d+/g).map(Number); if (Number(q.answer) !== (now - last) / last * 100) problems.push('growth wrong'); }
    if (genId === 'e12-price-after-inflation') { const [r, old] = q.story.match(/\d+/g).map(Number); if (Number(q.answer) !== old * (100 + r) / 100) problems.push('inflation wrong'); }
    if (genId === 'e12-unemployment-rate') { const [w, u] = q.story.match(/\d+/g).map(Number); if (Number(q.answer) !== u / (w + u) * 100) problems.push('unemployment wrong'); }
    if (genId === 'e12-budget-left') { const [i, r, f, o] = q.story.match(/\d+/g).map(Number); if (Number(q.answer) !== i - r - f - o || i - r - f - o <= 0) problems.push('budget wrong'); }
    if (genId === 'e12-percent-of-income') { const [i, pct] = q.story.match(/\d+/g).map(Number); if (Number(q.answer) !== i * pct / 100) problems.push('percent of income wrong'); }
    if (genId === 'e12-rule-of-72') { const rate = Number(q.story.match(/\d+/)[0]); if (Number(q.answer) !== 72 / rate) problems.push('rule of 72 wrong'); }
    if (genId === 'e12-card-interest') { const [apr, bal] = q.story.match(/\d+/g).map(Number); if (Number(q.answer) !== bal * apr / 1200) problems.push('card interest wrong'); }
    // College history and grade 2 maps, re-derived from the story
    if (genId === 'hc-which-century') { const y = Number(q.story.match(/\d+/)[0]); if (Number(q.answer) !== Math.floor((y - 1) / 100) + 1) problems.push('century wrong'); }
    if (genId === 'hc-years-between') { const [a, b] = q.story.match(/\d+/g).map(Number); const bc = /BC/.test(q.story); if (Number(q.answer) !== (bc ? a + b - 1 : b - a)) problems.push('years between wrong'); }
    if (genId === 'hc-earlier') { const [a, b] = q.story.match(/\d+/g).map(Number); if (q.answer !== `${Math.max(a, b)} BC`) problems.push('earlier wrong'); }
    if (genId === 'hc-which-decade') { const y = Number(q.story.match(/\d+/)[0]); if (Number(q.answer) !== Math.floor(y / 10) * 10) problems.push('decade wrong'); }
    if (genId === 'c2-blocks-walked') { const [a, b] = q.story.match(/\d+/g).map(Number); if (Number(q.answer) !== a + b) problems.push('blocks wrong'); }
    if (genId === 'ck-more-votes') { const [a, b] = q.choices.map((c) => Number(c.split(':')[1])); if (q.answer !== `dots:${Math.max(a, b)}` || a === b) problems.push('more votes wrong'); }
    if (genId === 'c2-weeks-to-save') { const [price, per] = q.story.match(/\d+/g).map(Number); if (Number(q.answer) !== price / per) problems.push('weeks to save wrong'); }
    // Kindergarten to grade 3 civics, re-derived from the story
    if (genId === 'c2-vote-winner') { const [a, b] = q.story.match(/\d+/g).map(Number); if (q.answer !== (a > b ? 'Pizza' : 'Tacos')) problems.push('vote winner wrong'); }
    if (genId === 'c2-vote-margin' || genId === 'c3-vote-margin') { const [a, b] = q.story.match(/\d+/g).map(Number); if (Number(q.answer) !== Math.abs(a - b)) problems.push('vote margin wrong'); }
    if (genId === 'c2-money-left' || genId === 'c3-money-left') { const [have, spend] = q.story.match(/\d+/g).map(Number); if (Number(q.answer) !== have - spend) problems.push('money left wrong'); }
    if (genId === 'c3-can-afford') { const [have, a, b] = q.story.match(/\d+/g).map(Number); if (q.answer !== (a + b <= have ? 'Yes' : 'No')) problems.push('afford wrong'); }
    if (genId === 'c3-vote-winner') { const nums = q.story.match(/\d+/g).map(Number); const total = nums[0]; const zoo = q.story.indexOf('zoo') < q.story.indexOf('museum') ? nums[1] : nums[2]; if (!(zoo > total / 2)) problems.push('zoo must hold the majority'); }
    if (genId === 'c2-earlier-year') { const [a, b] = q.choices.map(Number); if (Number(q.answer) !== Math.min(a, b)) problems.push('earlier year wrong'); }
    if (genId === 'c1-count-coins') { const n = ['two', 'three', 'four', 'five'].indexOf(q.story.match(/^(\w+) /)[1].toLowerCase()) + 2; const cents = /dime/.test(q.story) ? 10 : /nickel/.test(q.story) ? 5 : 1; if (Number(q.answer) !== n * cents) problems.push('coins wrong'); }   // pass KW: the setup now reads Here are three dimes
    // Explanations read cleanly too: no sentence runs past 45 words, a run-on guard (pass JG) (the second run-on check).
    for (const sent of String(q.explain || '').replace(/\[\[|\]\]|\*\*/g, '').split('\n').flatMap((x) => x.split(L.SENTENCE_BREAK))) { if (sent.trim().split(/\s+/).filter(Boolean).length > 45) problems.push(`explanation sentence over 32 words: ${sent.trim().slice(0, 40)}`); }
    // Nor does one end at a person's initial, a middle one or one of a run, which the screen would print on a line of its own (round
    // four's code read, pass MN: ps-learn's explanation printed "B.", "F." and "Skinner showed it..." on three lines).
    for (const said of [q.explain, q.story, q.prompt, ...(Array.isArray(q.alsoRight) ? q.alsoRight : []), ...Object.values(q.whyNot || {}).map((w) => w && w.why)].filter((x) => typeof x === 'string')) { const ps = said.replace(/\[\[|\]\]|\*\*/g, '').split('\n').flatMap((x) => x.split(L.SENTENCE_BREAK)).map((x) => x.trim()).filter(Boolean);
      if (ps.some((p, i) => i + 1 < ps.length && (/\b[A-Z][a-z]+ [A-Z]\.$|\b[A-Z]\. [A-Z]\.$/.test(p) || (/(?:^|[\s("“])[A-Z]\.$/.test(p) && /^[A-Z]\.(?:\s|$)/.test(ps[i + 1]))))) problems.push('a sentence the voice can say ends at an initial');
      if (live && /\b[A-Z]\.\s/.test(said)) INITIAL_EXPLAINS.add(said); }
    // Science facts carry a story after the answer (the story rule, applied centrally)
    if (L.SCIENCE_WHY_GENERATORS.includes(genId) && !q.explain.includes('\n')) problems.push('science fact has no story');
    // Grades 6, 7 and 9 social studies, re-derived from the story
    if (genId === 'wc6-hemisphere') { const [, ns, ew] = q.story.match(/degrees ([NS]), \d+ degrees ([EW])/); if (q.answer !== `${ns === 'N' ? 'Northern' : 'Southern'} and ${ew === 'E' ? 'Eastern' : 'Western'}`) problems.push('hemisphere wrong'); }
    if (genId === 'wc6-gdp-per-person') { const [gdp, people] = q.story.match(/\d+/g).map(Number); if (Number(q.answer) !== gdp * 1000 / people) problems.push('gdp per person wrong'); }
    if (genId === 'wc6-density' || genId === 'wg9-density') { const m = q.story.match(/([\d.]+) (million|thousand)? ?people on ([\d.]+)/); const people = Number(m[1]) * (m[2] === 'million' ? 1000 : 1); const area = Number(m[3]); if (Number(q.answer) !== people / area) problems.push('density wrong'); }
    if (genId === 'wc6-more-crowded') { const [a, b] = q.story.match(/\d+/g).map(Number); if (q.answer !== (a > b ? 'Town A' : 'Town B')) problems.push('crowded wrong'); }
    if (genId === 'tx7-herd-math') { const [head, price] = q.story.match(/\d+/g).map(Number); if (Number(q.answer) !== head * price) problems.push('herd wrong'); }
    if (genId === 'wg9-lapse') { const [base, m] = q.story.match(/\d+/g).map(Number); if (Number(q.answer) !== base - 6 * (m / 1000)) problems.push('lapse wrong'); }
    if (genId === 'wg9-map-scale') { const [, per, cm] = q.story.match(/1 centimeter stands for (\d+) kilometers. Two towns are (\d+)/).map(Number); if (Number(q.answer) !== per * cm) problems.push('scale wrong'); }
    if (genId === 'wg9-time-zones') { const [a, b] = q.story.match(/\d+/g).map(Number); if (Number(q.answer) !== (b - a) / 15) problems.push('time zone wrong'); }
    if (genId === 'wg9-natural-increase') { const [births, deaths] = q.story.match(/\d+/g).map(Number); if (Number(q.answer) !== births - deaths) problems.push('increase wrong'); }
    if (genId === 'wg9-urban-share') { const [total, urban] = q.story.match(/\d+/g).map(Number); if (Number(q.answer) !== urban / total * 100) problems.push('urban share wrong'); }
    if (genId === 'wg9-trade-balance') { const [exp, imp] = q.story.match(/\d+/g).map(Number); if (Number(q.answer) !== exp - imp) problems.push('trade balance wrong'); }
    // Science, re-derived from the fixed lists
    if (genId === 's6-density') { const [m, v] = q.story.match(/\d+/g).map(Number); if (Number(q.answer.match(/\d+/)[0]) * v !== m) problems.push('density wrong'); }
    if (genId === 's6-float-or-sink') { const d = Number(q.story.match(/about ([\d.]+)/)[1]); if (q.answer !== (d < 1 ? 'Floats' : 'Sinks')) problems.push('float wrong'); }
    if (genId === 's7-tenth-rule') { const base = Number(q.story.replace(/,/g, '').match(/\d+/)[0]); if (Number(q.answer.replace(/,/g, '').match(/\d+/)[0]) * 10 !== base) problems.push('tenth rule wrong'); }
    if (genId === 's8-read-slope') { const [d, t] = q.story.match(/\d+/g).map(Number); if (Number(q.answer.match(/\d+/)[0]) * t !== d) problems.push('slope read wrong'); }
    if (genId === 's8-which-older') { const [a, b] = q.story.match(/layer (\d+)/g).map((x) => Number(x.slice(6))); if (q.answer !== `The one in layer ${Math.max(a, b)}`) problems.push('older layer wrong'); }
    if (genId === 's11-momentum') { const [m, v] = q.story.match(/\d+/g).map(Number); if (Number(q.answer.match(/\d+/)[0]) !== m * v) problems.push('momentum wrong'); }
    if (genId === 's11-after-collision') { const [m, v] = q.story.match(/\d+/g).map(Number); if (Number(q.answer.match(/\d+/)[0]) !== v) problems.push('collision wrong'); }
    if (genId === 's11-same-momentum') { const [truck, v, ball] = q.story.match(/\d+/g).map(Number); if (Number(q.answer.match(/[\d.]+/)[0]) * ball !== truck * v) problems.push('same momentum wrong'); }
    if (genId === 's11-work') { const [f, d] = q.story.match(/\d+/g).map(Number); if (Number(q.answer.match(/\d+/)[0]) !== f * d) problems.push('work wrong'); }
    if (genId === 's11-power') { const [w, t] = q.story.match(/\d+/g).map(Number); if (Number(q.answer.match(/\d+/)[0]) * t !== w) problems.push('power wrong'); }
    if (genId === 's11-angle-out') { const a = Number(q.story.match(/\d+/)[0]); if (Number(q.answer.match(/\d+/)[0]) !== a) problems.push('angle wrong'); }
    if (genId === 's11-series-resistance') { const [a, b] = q.story.match(/\d+/g).map(Number); if (Number(q.answer.match(/\d+/)[0]) !== a + b) problems.push('series resistance wrong'); }
    if (genId === 's12-layer-order') { const order = ['Crust', 'Mantle', 'Outer core', 'Inner core']; const i = order.findIndex((x) => q.prompt.toLowerCase().includes(`the ${x.toLowerCase()}?`)); if (i < 0 || q.answer !== order[i + 1]) problems.push('layer order wrong'); }
    if (genId === 's12-redshift' && q.answer !== 'Galaxy B') problems.push('redshift wrong');
    if (genId === 's9-chromosome-count') { const full = Number(q.story.match(/\d+/)[0]); const meiosis = /meiosis/.test(q.story); if (Number(q.answer) !== (meiosis ? full / 2 : full)) problems.push('chromosome count wrong'); }
    if (genId === 's9-codon-count') { const letters = Number(q.story.match(/\d+/)[0]); if (Number(q.answer) * 3 !== letters) problems.push('codon count wrong'); }
    if (genId === 's10-molar-mass') { const masses = { 'H₂O': 18, 'CO₂': 44, 'NaCl': 58.5, 'CH₄': 16, 'O₂': 32, 'NH₃': 17, 'MgO': 40 }; const f = q.story.split(',')[0]; if (Number(q.answer.match(/[\d.]+/)[0]) !== masses[f]) problems.push('molar mass wrong'); }
    if (genId === 's10-grams-in-moles') { const mass = Number(q.story.match(/of (\d+) grams/)[1]); const n = Number(q.prompt.match(/\d+/)[0]); if (Number(q.answer.match(/\d+/)[0]) !== mass * n) problems.push('grams wrong'); }
    if (genId === 's10-moles-from-grams') { const [mass, grams] = q.story.match(/\d+/g).map(Number); if (Number(q.answer) * mass !== grams) problems.push('moles wrong'); }
    if (genId === 's10-boyle') { const [v1, one, v2] = q.story.match(/\d+/g).map(Number); if (Number(q.answer.match(/\d+/)[0]) * v2 !== v1) problems.push('boyle wrong'); }
    if (genId === 's10-molarity') { const [moles, liters] = q.story.match(/[\d.]+/g).map(Number); if (Math.abs(Number(q.answer.match(/[\d.]+/)[0]) * liters - moles) > 0.001) problems.push('molarity wrong'); }
    if (genId === 's11-speed') { const [d, t] = q.story.match(/\d+/g).map(Number); if (Number(q.answer.match(/\d+/)[0]) * t !== d) problems.push('speed wrong'); }
    if (genId === 's11-acceleration') { const [v0, v1, t] = q.story.match(/\d+/g).map(Number); if (Number(q.answer.match(/\d+/)[0]) * t !== v1 - v0) problems.push('acceleration wrong'); }
    if (genId === 's11-potential') { const [m, h] = q.story.match(/\d+/g).map(Number); if (Number(q.answer.match(/\d+/)[0]) !== m * 10 * h) problems.push('potential wrong'); }
    if (genId === 's11-kinetic') { const [m, v] = q.story.match(/\d+/g).map(Number); if (Number(q.answer.match(/\d+/)[0]) !== m * v * v / 2) problems.push('kinetic wrong'); }
    if (genId === 's11-wave-speed') { const [wl, f] = q.story.match(/\d+/g).map(Number); if (Number(q.answer.match(/\d+/)[0]) !== wl * f) problems.push('wave speed wrong'); }
    if (genId === 's11-wavelength-from') { const f = Number(q.story.match(/frequency of (\d+)/)[1]); if (Number(q.answer.match(/[\d.]+/)[0]) * f !== 340) problems.push('wavelength wrong'); }
    if (genId === 's11-current') { const [v, r] = q.story.match(/\d+/g).map(Number); if (Number(q.answer.match(/\d+/)[0]) * r !== v) problems.push('current wrong'); }
    if (genId === 's11-resistance') { const [v, i] = q.story.match(/\d+/g).map(Number); if (Number(q.answer.match(/\d+/)[0]) * i !== v) problems.push('resistance wrong'); }
    if (genId === 's11-voltage') { const [i, r] = q.story.match(/\d+/g).map(Number); if (Number(q.answer.match(/\d+/)[0]) !== i * r) problems.push('voltage wrong'); }
    if (genId === 's9-pair-letter') { const L = q.story.match(/letter ([ATCG])/)[1]; const pair = { A: 'T', T: 'A', C: 'G', G: 'C' }; if (q.answer !== pair[L]) problems.push('base pair wrong'); }
    if (genId === 's9-complement') { const strand = q.story.replace('Strand: ', '').split(' '); const pair = { A: 'T', T: 'A', C: 'G', G: 'C' }; if (q.answer !== strand.map((x) => pair[x]).join(' ')) problems.push('complement wrong'); }
    if (genId === 's9-shows-trait') { const combo = q.story.match(/has (\w\w)\./)[1]; if ((combo === 'bb' ? 'Blue' : 'Brown') !== q.answer) problems.push('trait shown wrong'); }
    if (genId === 's9-closer-relative' && q.answer !== 'Species X') problems.push('closer relative wrong');
    if (genId === 's10-count-atoms') { const mm = q.story.match(/^(\d+)/); const mult = Number(mm[1]); const atom = q.prompt.match(/many (\w+) atoms/)[1]; const sub = { hydrogen: { '2H₂O': 2, '4NH₃': 3, '2CH₄': 4 }, oxygen: { '2H₂O': 1, '3CO₂': 2 }, carbon: { '3CO₂': 1 }, chlorine: { '2NaCl': 1 } }[atom][q.story]; if (Number(q.answer) !== mult * sub) problems.push('atom count wrong'); }
    if (genId === 's10-acid-or-base') { const ph = Number(q.story.match(/pH of about (\d+)/)[1]); if (q.answer !== (ph < 7 ? 'Acid' : ph === 7 ? 'Neutral' : 'Base')) problems.push('acid or base wrong'); }
    if (genId === 's10-how-many-times') { const [low, high] = q.story.match(/pH (\d+)/g).map((x) => Number(x.slice(3))); if (Number(q.answer.match(/\d+/)[0]) !== 10 ** (high - low)) problems.push('ten times wrong'); }
    if (genId === 's10-metal-or-not') { const el = (q.prompt.match(/^Is (\w+) a metal/) || [])[1]; const metals = ['iron', 'copper', 'sodium', 'gold', 'aluminum']; if (!el || (metals.includes(el) ? 'Metal' : 'Nonmetal') !== q.answer) problems.push('metal wrong'); }
    if (genId === 's8-f-equals-ma') { const [m, a] = q.story.match(/\d+/g).map(Number); if (Number(q.answer.match(/\d+/)[0]) !== m * a) problems.push('force wrong'); }
    if (genId === 's8-mass-conserved') { const [a, b] = q.story.match(/\d+/g).map(Number); if (Number(q.answer.match(/\d+/)[0]) !== a + b) problems.push('conservation wrong'); }
    if (genId === 's8-more-mass') { const [light] = q.story.match(/\d+/g).map(Number); if (q.answer !== `The ${light} kg ball`) problems.push('more mass wrong'); }
    if (genId === 's8-atomic-number') { const n = Number(q.story.match(/\d+/)[0]); const table = { 1: 'hydrogen', 2: 'helium', 6: 'carbon', 7: 'nitrogen', 8: 'oxygen', 10: 'neon' }; if (q.answer !== table[n]) problems.push('atomic number wrong'); }
    if (genId === 's8-biggest-of') { const order = ['the moon', 'the Earth', 'the solar system', 'the Milky Way', 'the universe']; const best = [...q.choices].sort((x, y) => order.indexOf(y) - order.indexOf(x))[0]; if (q.answer !== best) problems.push('biggest wrong'); }
    if (genId === 's4-will-it-light') { const broken = /not connected|switch open|rubber|dead battery/.test(q.story); if ((broken ? 'No' : 'Yes') !== q.answer) problems.push('circuit wrong'); }
    if (genId === 's4-conductor-or-insulator') { const metal = /copper|iron|aluminum|steel/.test(q.prompt); /* pass IB: the material is named in the question */ if ((metal ? 'Conductor' : 'Insulator') !== q.answer) problems.push('conductor wrong'); }
    if (genId === 's5-next-stage') { const cycle = ['evaporation', 'condensation', 'precipitation', 'collection']; const i = cycle.findIndex((x) => q.story.includes(x)); if (q.answer.toLowerCase() !== cycle[(i + 1) % 4]) problems.push('next stage wrong'); }
    if (genId === 's5-moon-phase') { const i = ['none of', 'half of', 'all of'].findIndex((x) => q.story.includes(x)); if (q.answer !== ['new moon', 'half moon', 'full moon'][i]) problems.push('moon phase wrong'); }
    if (genId === 's6-count-kinds') { const kinds = (q.story.match(/[A-Z]/g) || []).length; if (Number(q.answer) !== kinds) problems.push('count kinds wrong'); }
    if (genId === 's6-element-or-compound') { const kinds = (q.story.split(',')[0].match(/[A-Z]/g) || []).length; if ((kinds === 1 ? 'Element' : 'Compound') !== q.answer) problems.push('element or compound wrong'); }
    if (genId === 's3-next-season') { const seasons = ['spring', 'summer', 'fall', 'winter']; const i = seasons.findIndex((x) => q.story.includes(x)); if (q.answer !== seasons[(i + 1) % 4]) problems.push('next season wrong'); }
    if (genId === 's6-warm-to-cool' && q.answer !== 'From the stone into the water') problems.push('heat direction wrong');
    // Grade 12 math, re-derived from the prompt
    if (genId === 'g12-shift-direction') { const k = Number(q.story.match(/\d+/)[0]); const dir = /f\(x\) \+/.test(q.story) ? 'Up' : /f\(x\) -/.test(q.story) ? 'Down' : /f\(x - /.test(q.story) ? 'Right' : 'Left'; if (q.answer !== `${dir} ${k}`) problems.push('shift direction wrong'); }
    if (genId === 'g12-shifted-point') { const [x, y] = q.story.match(/\((-?\d+), (-?\d+)\)/).slice(1).map(Number); const mm = q.story.match(/f\(x ([+-]) (\d+)\) ([+-]) (\d+)/); const nx = x + (mm[1] === '-' ? 1 : -1) * Number(mm[2]); const ny = y + (mm[3] === '+' ? 1 : -1) * Number(mm[4]); if (q.answer !== `(${nx}, ${ny})`) problems.push('shifted point wrong'); }
    if (genId === 'g12-write-shift') { const [h, k] = q.prompt.match(/\d+/g).map(Number); if (q.answer !== `(x - ${h})² + ${k}`) problems.push('write shift wrong'); }
    if (genId === 'g12-compose-value') { const [m, c] = q.story.match(/\d+/g).map(Number); const x = Number(q.prompt.match(/\d+/)[0]); if (Number(q.answer) !== m * x * x + c) problems.push('compose value wrong'); }
    if (genId === 'g12-compose-order') { const [m, c] = q.story.match(/\d+/g).map(Number); const x = Number(q.prompt.match(/\d+/)[0]); if (Number(q.answer) !== (m * x + c) ** 2) problems.push('compose order wrong'); }
    if (genId === 'g12-unit-value') { const angle = Number(q.prompt.match(/\d+/)[0]); const fn = /sin/.test(q.prompt) ? 'sin' : 'cos'; const table = { 0: { cos: '1', sin: '0' }, 30: { cos: '√3/2', sin: '1/2' }, 45: { cos: '√2/2', sin: '√2/2' }, 60: { cos: '1/2', sin: '√3/2' }, 90: { cos: '0', sin: '1' } }; if (q.answer !== table[angle][fn]) problems.push('unit value wrong'); }
    if (genId === 'g12-quadrant-sign') { const angle = Number(q.prompt.match(/\d+/)[0]); const fn = /sin/.test(q.prompt) ? 'sin' : 'cos'; const positive = fn === 'sin' ? angle < 180 : angle > 270; if (q.answer !== (positive ? 'Positive' : 'Negative')) problems.push('quadrant sign wrong'); }
    if (genId === 'g12-half-life-left') { const [start, hl] = q.story.match(/\d+/g).map(Number); const t = Number(q.prompt.match(/\d+/)[0]); if (Number(q.answer.match(/\d+/)[0]) !== start / 2 ** (t / hl)) problems.push('half life left wrong'); }
    if (genId === 'g12-half-lives-count') { const [hl] = q.story.match(/\d+/g).map(Number); const t = Number(q.prompt.match(/\d+/)[0]); if (Number(q.answer) * hl !== t) problems.push('half lives count wrong'); }
    if (genId === 'g12-end-behavior') { const mm = q.story.match(/^(-?\d+)x\^(\d+)/); const lead = Number(mm[1]); const power = Number(mm[2]); const even = power % 2 === 0; const expected = even ? (lead > 0 ? 'Both ends go up' : 'Both ends go down') : (lead > 0 ? 'Down on the left, up on the right' : 'Up on the left, down on the right'); if (q.answer !== expected) problems.push('end behavior wrong'); }
    if (genId === 'g12-leading-term') { const mm = q.story.match(/([-+]) (\d+)x\^(\d+)/); if (q.answer !== `${mm[1] === '-' ? '-' : ''}${mm[2]}x^${mm[3]}`) problems.push('leading term wrong'); }
    // Grade 11 math, re-derived from the prompt
    if (genId === 'g11-quadratic-roots') { const [b, c] = q.story.match(/\d+/g).map(Number); const [lo, hi] = q.answer.match(/\d+/g).map(Number); if (lo + hi !== b || lo * hi !== c) problems.push('quadratic roots wrong'); }
    if (genId === 'g11-discriminant') { const mm = q.story.match(/^(\d*)x² \+ (\d+)x \+ (\d+)/); const a = mm[1] ? Number(mm[1]) : 1; const b = Number(mm[2]); const c = Number(mm[3]); if (Number(q.answer) !== b * b - 4 * a * c) problems.push('discriminant wrong'); }
    if (genId === 'g11-how-many-roots') { const d = Number(q.story.match(/-?\d+/)[0]); if (q.answer !== (d > 0 ? 'Two' : d === 0 ? 'One' : 'None')) problems.push('root count wrong'); }
    if (genId === 'g11-multiply-binomials') { const [p, qq] = q.prompt.match(/\d+/g).map(Number); if (q.answer !== `x² + ${p + qq}x + ${p * qq}`) problems.push('binomial product wrong'); }
    if (genId === 'g11-middle-term') { const [p, qq] = q.story.match(/\d+/g).map(Number); if (Number(q.answer) !== p + qq) problems.push('middle term wrong'); }
    if (genId === 'g11-square-binomial') { const [p] = q.prompt.match(/\d+/g).map(Number); if (q.answer !== `x² + ${2 * p}x + ${p * p}`) problems.push('square binomial wrong'); }
    if (genId === 'g11-arithmetic-term') { const seq = q.story.match(/\d+/g).map(Number); const n = Number(q.prompt.match(/\d+/)[0]); if (Number(q.answer) !== seq[0] + (n - 1) * (seq[1] - seq[0])) problems.push('arithmetic term wrong'); }
    if (genId === 'g11-geometric-term') { const seq = q.story.match(/\d+/g).map(Number); const n = Number(q.prompt.match(/\d+/)[0]); if (Number(q.answer) !== seq[0] * (seq[1] / seq[0]) ** (n - 1)) problems.push('geometric term wrong'); }
    if (genId === 'g11-sequence-kind') { const seq = q.story.split(', ').map(Number); if (q.answer !== (seq[1] - seq[0] === seq[2] - seq[1] ? 'Arithmetic' : 'Geometric')) problems.push('sequence kind wrong'); }
    if (genId === 'g11-log-value') { const [b, y] = q.prompt.match(/\d+/g).map(Number); if (b ** Number(q.answer) !== y) problems.push('log value wrong'); }
    if (genId === 'g11-exp-to-log') { const [b, e, y] = q.story.match(/\d+/g).map(Number); if (q.answer !== `log base ${b} of ${y} = ${e}`) problems.push('exp to log wrong'); }
    if (genId === 'g11-log-to-exp') { const [b, y, e] = q.story.match(/\d+/g).map(Number); if (q.answer !== `${b}^${e} = ${y}`) problems.push('log to exp wrong'); }
    if (genId === 'g11-absolute-solve') { const [k, d] = q.story.match(/\d+/g).map(Number); if (q.answer !== `x = ${k + d} or x = ${k - d}`) problems.push('absolute solve wrong'); }
    if (genId === 'g11-absolute-value-of') { const n = Number(q.prompt.match(/-?\d+/)[0]); if (Number(q.answer) !== Math.abs(n)) problems.push('absolute value wrong'); }
    if (genId === 'g11-absolute-none') { if (q.answer !== (/= -\d/.test(q.story) ? 'None' : 'Two')) problems.push('absolute none wrong'); }
    // Grade 10 math, re-derived from the prompt
    if (genId === 'g10-vertical-angle') { const [a] = q.story.match(/\d+/g).map(Number); if (Number(q.answer.match(/\d+/)[0]) !== a) problems.push('vertical angle wrong'); }
    if (genId === 'g10-supplementary') { const [a] = q.story.match(/\d+/g).map(Number); if (Number(q.answer.match(/\d+/)[0]) !== 180 - a) problems.push('supplementary wrong'); }
    if (genId === 'g10-triangle-angle') { const [a, b] = q.story.match(/\d+/g).map(Number); if (Number(q.answer.match(/\d+/)[0]) !== 180 - a - b) problems.push('triangle angle wrong'); }
    if (genId === 'g10-scale-factor') { const [small, big] = q.story.match(/\d+/g).map(Number); if (Number(q.answer) * small !== big) problems.push('scale factor wrong'); }
    if (genId === 'g10-missing-side') { const [a, b, ak] = q.story.match(/\d+/g).map(Number); if (Number(q.answer) * a !== b * ak) problems.push('missing side wrong'); }
    if (genId === 'g10-shadow') { const [stick, shadow, treeShadow] = q.story.match(/\d+/g).map(Number); if (Number(q.answer.match(/\d+/)[0]) * shadow !== stick * treeShadow) problems.push('shadow wrong'); }
    if (genId === 'g10-translate') { const nums = q.story.match(/-?\d+/g).map(Number); const [x, y] = nums; const dx = (/left/.test(q.story) ? -1 : 1) * nums[2]; const dy = (/down/.test(q.story) ? -1 : 1) * nums[3]; if (q.answer !== `(${x + dx}, ${y + dy})`) problems.push('translate wrong'); }
    if (genId === 'g10-reflect') { const [x, y] = q.story.match(/-?\d+/g).map(Number); const overY = /y-axis/.test(q.story); if (q.answer !== (overY ? `(${-x}, ${y})` : `(${x}, ${-y})`)) problems.push('reflect wrong'); }
    if (genId === 'g10-rotate') { const [x, y] = q.story.match(/-?\d+/g).map(Number); if (q.answer !== `(${-y}, ${x})`) problems.push('rotate wrong'); }
    if (genId === 'g10-sine') { const [a, b, c] = q.story.match(/\d+/g).map(Number); if (q.answer !== `${a}/${c}`) problems.push('sine wrong'); }
    if (genId === 'g10-cosine') { const [a, b, c] = q.story.match(/\d+/g).map(Number); if (q.answer !== `${b}/${c}`) problems.push('cosine wrong'); }
    if (genId === 'g10-tangent') { const [a, b] = q.story.match(/\d+/g).map(Number); if (q.answer !== `${a}/${b}`) problems.push('tangent wrong'); }
    if (genId === 'g10-sector-fraction') { const [angle] = q.story.match(/\d+/g).map(Number); const [t, m] = q.answer.split('/').map(Number); if (t * 360 !== angle * m) problems.push('sector fraction wrong'); }
    if (genId === 'g10-arc-length') { const [r, angle] = q.story.match(/\d+/g).map(Number); if (Math.abs(Number(q.answer) - 2 * 3.14 * r * angle / 360) > 0.01) problems.push('arc length wrong'); }
    if (genId === 'g10-sector-area') { const [r, angle] = q.story.match(/\d+/g).map(Number); if (Math.abs(Number(q.answer) - 3.14 * r * r * angle / 360) > 0.01) problems.push('sector area wrong'); }
    // Grade 9 math, re-derived from the prompt
    if (genId === 'g9-both-sides') { const [a, c, b, d] = q.prompt.match(/\d+/g).map(Number); const x = Number(q.answer); if (a * x + c !== b * x + d) problems.push('both sides wrong'); }
    if (genId === 'g9-distribute-solve') { const [a, b, total] = q.prompt.match(/\d+/g).map(Number); if (a * (Number(q.answer) + b) !== total) problems.push('distribute solve wrong'); }
    if (genId === 'g9-evaluate-function') { const mm = q.story.match(/f\(x\) = (\d+)x ([+-]) (\d+)/); const m = Number(mm[1]); const c = (mm[2] === '-' ? -1 : 1) * Number(mm[3]); const x = Number(q.prompt.match(/\d+/)[0]); if (Number(q.answer) !== m * x + c) problems.push('evaluate function wrong'); }
    if (genId === 'g9-find-input') { const [m, c] = q.story.match(/\d+/g).map(Number); const out = Number(q.prompt.match(/= (\d+)/)[1]); if (m * Number(q.answer) + c !== out) problems.push('find input wrong'); }
    if (genId === 'g9-is-function') { const inputs = [...q.story.matchAll(/\((\d+), \d+\)/g)].map((mm) => mm[1]); if ((new Set(inputs).size === inputs.length ? 'Yes' : 'No') !== q.answer) problems.push('is function wrong'); }
    if (genId === 'g9-system-substitute') { const mm = q.story.match(/y = x \+ (\d+) and y = (\d+)x ([+-]) (\d+)/); const a = Number(mm[1]); const m = Number(mm[2]); const c = (mm[3] === '-' ? -1 : 1) * Number(mm[4]); const [x, y] = q.answer.match(/\d+/g).map(Number); if (y !== x + a || y !== m * x + c) problems.push('system wrong'); }
    if (genId === 'g9-check-pair') { const mm = q.story.match(/y = x \+ (\d+) and y = (\d+)x ([+-]) (\d+)/); const a = Number(mm[1]); const m = Number(mm[2]); const c = (mm[3] === '-' ? -1 : 1) * Number(mm[4]); const [px, py] = q.prompt.match(/\d+/g).map(Number); if (((py === px + a && py === m * px + c) ? 'Yes' : 'No') !== q.answer) problems.push('check pair wrong'); }
    if (genId === 'g9-factor-pair') { const [b, c] = q.story.match(/\d+/g).slice(1).map(Number); const [p, qq] = q.answer.match(/\d+/g).map(Number); if (p * qq !== c || p + qq !== b) problems.push('factor pair wrong'); }
    if (genId === 'g9-factor-trinomial') { const [b, c] = q.prompt.match(/\d+/g).slice(1).map(Number); const [p, qq] = q.answer.match(/\d+/g).map(Number); if (p * qq !== c || p + qq !== b) problems.push('factor trinomial wrong'); }
    if (genId === 'g9-zeros') { const [lo, hi] = q.story.match(/\d+/g).map(Number); if (q.answer !== `x = -${lo} or x = -${hi}`) problems.push('zeros wrong'); }
    if (genId === 'g9-linear-or-exponential') { const seq = q.story.split(', ').map(Number); const linear = seq[1] - seq[0] === seq[2] - seq[1]; if ((linear ? 'Linear' : 'Exponential') !== q.answer) problems.push('linear or exponential wrong'); }
    if (genId === 'g9-growth-value') { const [start, rate] = q.story.match(/\d+/g).map(Number); const t = Number(q.prompt.match(/\d+/)[0]); if (Number(q.answer) !== start * rate ** t) problems.push('growth value wrong'); }
    if (genId === 'g9-next-term') { const seq = q.story.match(/\d+/g).map(Number); if (Number(q.answer) * seq[1] !== seq[2] * seq[2]) problems.push('next term wrong'); }
    // Grade 8 math, re-derived from the prompt
    if (genId === 'g8-slope-points') { const [x1, y1, x2, y2] = q.story.match(/-?\d+/g).map(Number); if (Number(q.answer) * (x2 - x1) !== y2 - y1) problems.push('slope from points wrong'); }
    if (genId === 'g8-slope-from-equation') { const m = Number(q.story.match(/y = (-?\d+)x/)[1]); if (Number(q.answer) !== m) problems.push('slope from equation wrong'); }
    if (genId === 'g8-intercept-from-equation') { const mm = q.story.match(/x ([+-]) (\d+)/); const b = (mm[1] === '-' ? -1 : 1) * Number(mm[2]); if (Number(q.answer) !== b) problems.push('intercept wrong'); }
    if (genId === 'g8-power-value') { const [base, e] = q.prompt.match(/\d+/g).map(Number); if (Number(q.answer) !== base ** e) problems.push('power value wrong'); }
    if (genId === 'g8-multiply-powers') { const [base, a, base2, b] = q.prompt.match(/\d+/g).map(Number); if (q.answer !== `${base}^${a + b}`) problems.push('multiply powers wrong'); }
    if (genId === 'g8-divide-powers') { const [base, a, base2, b] = q.prompt.match(/\d+/g).map(Number); if (q.answer !== `${base}^${a - b}`) problems.push('divide powers wrong'); }
    if (genId === 'g8-zero-negative-power') { const [base, e] = q.prompt.match(/\d+/g).map(Number); if (/\^0/.test(q.prompt) ? q.answer !== '1' : q.answer !== `1/${base ** e}`) problems.push('zero or negative power wrong'); }
    if (genId === 'g8-square-root') { const [sq] = q.prompt.match(/\d+/g).map(Number); if (Number(q.answer) ** 2 !== sq) problems.push('square root wrong'); }
    if (genId === 'g8-square-of') { const [n] = q.prompt.match(/\d+/g).map(Number); if (Number(q.answer) !== n * n) problems.push('square of wrong'); }
    if (genId === 'g8-root-between') { const [n] = q.prompt.match(/\d+/g).map(Number); const [lo, hi] = q.answer.match(/\d+/g).map(Number); if (!(lo * lo < n && n < hi * hi && hi === lo + 1)) problems.push('root between wrong'); }
    if (genId === 'g8-hypotenuse') { const [a, b] = q.story.match(/\d+/g).map(Number); if (Number(q.answer) ** 2 !== a * a + b * b) problems.push('hypotenuse wrong'); }
    if (genId === 'g8-missing-leg') { const [c, a] = q.story.match(/\d+/g).map(Number); if (Number(q.answer) ** 2 !== c * c - a * a) problems.push('missing leg wrong'); }
    if (genId === 'g8-is-right-triangle') { const [a, b, c] = q.story.match(/\d+/g).map(Number); if ((a * a + b * b === c * c ? 'Yes' : 'No') !== q.answer) problems.push('right triangle check wrong'); }
    if (genId === 'g8-to-scientific') { const shown = Number(q.prompt.match(/[\d,]+/)[0].replace(/,/g, '')); const mm = q.answer.match(/(\d+)\.(\d+) x 10\^(\d+)/); const val = (Number(mm[1]) + Number(mm[2]) / 10) * 10 ** Number(mm[3]); if (Math.abs(val - shown) > 0.5) problems.push('to scientific wrong'); }
    if (genId === 'g8-from-scientific') { const mm = q.prompt.match(/(\d+)\.(\d+) x 10\^(\d+)/); if (Number(q.answer.replace(/,/g, '')) !== Math.round((Number(mm[1]) + Number(mm[2]) / 10) * 10 ** Number(mm[3]))) problems.push('from scientific wrong'); }
    if (genId === 'g8-compare-scientific') { const parts = [...q.prompt.matchAll(/(\d+) x 10\^(\d+)/g)].map((mm) => [Number(mm[1]), Number(mm[2])]); const bigger = parts[0][1] > parts[1][1] ? `${parts[0][0]} x 10^${parts[0][1]}` : `${parts[1][0]} x 10^${parts[1][1]}`; if (q.answer !== bigger) problems.push('compare scientific wrong'); }
    // Grade 7 math, re-derived from the prompt
    if (genId === 'g7-unit-rate') { const [n, total] = q.story.match(/\d+/g).map(Number); if (Number(q.answer.match(/\d+/)[0]) * n !== total) problems.push('unit rate wrong'); }
    if (genId === 'g7-solve-proportion') { const [a, b] = q.story.match(/\d+/g).map(Number); const [c] = q.prompt.match(/\d+/g).map(Number); if (Number(q.answer.match(/\d+/)[0]) * a !== b * c) problems.push('proportion wrong'); }
    if (genId === 'g7-is-proportional') { const [a, b, c, d] = q.story.match(/\d+/g).map(Number); if ((a * d === b * c ? 'Yes' : 'No') !== q.answer) problems.push('proportional check wrong'); }
    if (genId === 'g7-percent-of') { const [pct, base] = q.prompt.match(/\d+/g).map(Number); if (Number(q.answer) !== base * pct / 100) problems.push('percent of wrong'); }
    if (genId === 'g7-discount') { const [price, pct] = q.story.match(/\d+/g).map(Number); if (Number(q.answer.match(/\d+/)[0]) !== price - price * pct / 100) problems.push('discount wrong'); }
    if (genId === 'g7-what-percent') { const [part, base] = q.story.match(/\d+/g).map(Number); if (Number(q.answer.match(/\d+/)[0]) * base !== part * 100) problems.push('what percent wrong'); }
    if (genId === 'g7-add-integers') { const [a, b] = q.prompt.match(/-?\d+/g).map(Number); if (Number(q.answer) !== a + b) problems.push('add integers wrong'); }
    if (genId === 'g7-subtract-integers') { const [a, b] = q.prompt.match(/-?\d+/g).map(Number); if (Number(q.answer) !== a - b) problems.push('subtract integers wrong'); }
    if (genId === 'g7-two-step') { const [m, c, total] = q.prompt.match(/\d+/g).map(Number); if (m * Number(q.answer) + c !== total) problems.push('two step wrong'); }
    if (genId === 'g7-two-step-subtract') { const [m, c, total] = q.prompt.match(/\d+/g).map(Number); if (m * Number(q.answer) - c !== total) problems.push('two step subtract wrong'); }
    if (genId === 'g7-first-step') { const [m, c] = q.story.match(/\d+/g).map(Number); if (q.answer !== `Subtract ${c} from both sides`) problems.push('first step wrong'); }
    if (genId === 'g7-circumference') { const [d] = q.story.match(/\d+/g).map(Number); if (Math.abs(Number(q.answer) - 3.14 * d) > 0.01) problems.push('circumference wrong'); }
    if (genId === 'g7-circle-area') { const [r] = q.story.match(/\d+/g).map(Number); if (Math.abs(Number(q.answer) - 3.14 * r * r) > 0.01) problems.push('circle area wrong'); }
    if (genId === 'g7-radius-or-diameter') { const [n] = q.story.match(/\d+/g).map(Number); const askD = /diameter\?/.test(q.prompt); if (Number(q.answer) !== (askD ? n * 2 : n / 2)) problems.push('radius or diameter wrong'); }
    // Grade 6 math, re-derived from the prompt
    if (genId === 'g6-simplify-ratio') { const [a, b] = q.prompt.match(/\d+/g).map(Number); const [x, y] = q.answer.split(':').map(Number); if (a * y !== b * x) problems.push('ratio simplify wrong'); }
    if (genId === 'g6-scale-ratio') { const [a, b] = q.story.match(/\d+/g).map(Number); const [ak] = q.prompt.match(/\d+/g).map(Number); if (Number(q.answer) * a !== b * ak) problems.push('ratio scale wrong'); }
    if (genId === 'g6-ratio-from-words') { const [a, b] = q.story.match(/\d+/g).map(Number); if (q.answer !== `${a}:${b}`) problems.push('ratio words wrong'); }
    if (genId === 'g6-whole-by-fraction') { const [n, one, d] = q.prompt.match(/\d+/g).map(Number); if (Number(q.answer) !== n * d) problems.push('whole by fraction wrong'); }
    if (genId === 'g6-divide-by-fraction') { const [a, b, c, d] = q.prompt.match(/\d+/g).map(Number); const parts = q.answer.split('/').map(Number); const val = parts.length === 2 ? parts[0] / parts[1] : parts[0]; if (Math.abs(val - (a / b) / (c / d)) > 0.0001) problems.push('divide by fraction wrong'); }
    if (genId === 'g6-compare-negatives') { const [a, b] = q.prompt.match(/-?\d+/g).map(Number); if (Number(q.answer) !== Math.min(a, b)) problems.push('compare negatives wrong'); }
    if (genId === 'g6-opposite') { const [n] = q.prompt.match(/-?\d+/g).map(Number); if (Number(q.answer) !== -n) problems.push('opposite wrong'); }
    if (genId === 'g6-order-negatives') { const nums = q.story.match(/-?\d+/g).map(Number); if (q.answer !== [...nums].sort((x, y) => x - y).join(', ')) problems.push('order negatives wrong'); }
    if (genId === 'g6-temperature') { const [st, dr] = q.story.match(/-?\d+/g).map(Number); if (Number(q.answer.match(/-?\d+/)[0]) !== st - dr) problems.push('temperature wrong'); }
    if (genId === 'g6-triangle-area') { const [b, h] = q.story.match(/\d+/g).map(Number); if (Number(q.answer.match(/\d+/)[0]) !== b * h / 2) problems.push('triangle area wrong'); }
    if (genId === 'g6-parallelogram-area') { const [b, h] = q.story.match(/\d+/g).map(Number); if (Number(q.answer.match(/\d+/)[0]) !== b * h) problems.push('parallelogram area wrong'); }
    if (genId === 'g6-missing-height') { const [area, b] = q.story.match(/\d+/g).map(Number); if (Number(q.answer) * b !== 2 * area) problems.push('missing height wrong'); }
    if (genId === 'g6-solve-add') { const [p, qv] = q.prompt.match(/\d+/g).map(Number); if (Number(q.answer) + p !== qv) problems.push('solve add wrong'); }
    if (genId === 'g6-solve-multiply') { const [p, qv] = q.prompt.match(/\d+/g).map(Number); if (Number(q.answer) * p !== qv) problems.push('solve multiply wrong'); }
    if (genId === 'g6-check-solution') { const [claimed, p, qv] = q.story.match(/\d+/g).map(Number); if ((claimed + p === qv ? 'Yes' : 'No') !== q.answer) problems.push('check solution wrong'); }
    if (genId === 'r5-pov' && (q.answer === 'First person') !== /\b(I|we|my|me|our)\b/.test(q.story)) problems.push('point of view wrong');
    // Grade 4 reading, re-derived from the fixed lists
    if (genId === 'r4-simile-or-metaphor' && (q.answer === 'Simile') !== /\b(like|as)\b/.test(q.story)) problems.push('simile or metaphor wrong');
    if (genId === 'r4-find-figurative' && !/\b(like|as|was a|is a|were a)\b/.test(q.answer)) problems.push('figurative pick wrong');
    // Pre-K 4's letters (pass MM): Is this the letter named? Yes exactly when the letter shown is the one named; and a letter asked
    // by its look is the one letter on the board with that look, the other two sharing none of it.
    if (genId === 'pl-is-letter') { const asked = (q.prompt.match(/^Is this the letter ([A-Z])\?$/) || [])[1]; if (!asked || q.answer !== (asked === q.visual.text ? 'Yes' : 'No')) problems.push('pre-K is-this-the-letter wrong'); }
    if (genId === 'pl-letter-look') { const P4_LOOK = { A: 'has two slanted sides and a bar across the middle', B: 'has two round bumps', C: 'is curved, like a cookie with a bite out of it', D: 'has a straight line and one big curve', E: 'has a line down and three lines across', M: 'has two pointy hills', S: 'is curvy, like a snake' }; const ALIKE = { A: ['M'], B: ['D', 'S'], C: ['B', 'D', 'S'], D: ['B', 'C', 'S'], E: [], M: ['A'], S: ['B', 'C', 'D'] };
      const look = (q.prompt.match(/^Which letter (.+)\?$/) || [])[1]; const L = Object.keys(P4_LOOK).find((k) => P4_LOOK[k] === look);
      if (!L || q.answer !== L || q.choices.length !== 3 || !q.choices.includes(L) || q.choices.some((c) => c !== L && (ALIKE[L].includes(c) || !P4_LOOK[c]))) problems.push('pre-K letter by its look wrong'); }
    if (genId === 'rs-pick-word' && q.answer[0].toUpperCase() !== q.prompt.match(/starts with ([A-Z])/)[1]) problems.push('picked word starts with the wrong letter');
    if (genId === 'rs-same-start') { const w = q.story.replace(/\.$/, '').toLowerCase(); if (q.answer[0] !== w[0]) problems.push('same-start word differs'); if (q.choices.filter((c) => c[0] === w[0]).length !== 1) problems.push('same-start has two matches'); }
    if (genId === 'rs-odd-start') { const firsts = q.choices.map((c) => c[0]); const odd = q.choices.find((c) => firsts.filter((f) => f === c[0]).length === 1); if (q.answer !== odd) problems.push('odd start wrong'); }
    if (genId === 'rr-does-rhyme') { const [a, c] = q.story.replace(/\./g, '').trim().toLowerCase().split(/\s+/); /* pass IC: the setup shows Pup. Cup. */ if ((RHYME_END(a) === RHYME_END(c) ? 'Yes' : 'No') !== q.answer) problems.push('rhyme yes/no wrong'); }
    if (genId === 'rr-pick-rhyme') { const a = q.story.replace(/\.$/, '').toLowerCase(); if (RHYME_END(q.answer) !== RHYME_END(a)) problems.push('picked rhyme does not rhyme'); if (q.choices.filter((c) => RHYME_END(c) === RHYME_END(a)).length !== 1) problems.push('two choices rhyme'); }
    if (genId === 'rr-odd-rhyme') { const ends = q.choices.map(RHYME_END); const odd = q.choices.find((c) => ends.filter((e) => e === RHYME_END(c)).length === 1); if (q.answer !== odd) problems.push('odd rhyme wrong'); }
    if (genId === 'rr-same-end') { const end = q.prompt.match(/ends with (\w+)/)[1]; if (!q.answer.endsWith(end)) problems.push('same-end word does not end that way'); }
    // First Sounds and Letters' listening kinds (pass MM, lesson check A), each re-derived from this test's own tables of how each
    // picture's name starts and ends and which animal makes each sound, never the generator's; the order kinds had no re-derivation.
    if (genId === 'p4-does-rhyme') { const [, a, c] = /^Listen\. Do (\w+) and (\w+) rhyme\?$/.exec(q.prompt); if ((RHYME_END(a) === RHYME_END(c) ? 'Yes' : 'No') !== q.answer || a === c || q.visual) problems.push('heard rhyme wrong, or shown'); }
    if (genId === 'p4-rhyme-pic' || genId === 'p4-rhyme-three') { const END = { ball: 'all', wall: 'all', dog: 'og', log: 'og', frog: 'og', cat: 'at', hat: 'at', moon: 'oon', spoon: 'oon', sock: 'ock', block: 'ock', rock: 'ock', bear: 'air', chair: 'air' }; const nm = (x) => String(x).split(':')[1]; const ends = q.choices.map((x) => END[nm(x)]);
      if (genId === 'p4-rhyme-pic' ? (END[nm(q.answer)] !== END[q.visual.name] || ends.filter((e) => e === END[q.visual.name]).length !== 1) : (ends.filter((e) => e === END[nm(q.answer)]).length !== 1 || new Set(ends).size !== 2)) problems.push('picture rhyme wrong'); }
    if (genId === 'p4-start-pic' || genId === 'p4-start-odd-pic') { const START = { moon: 'm', map: 'm', sun: 's', sock: 's', fish: 'f', fan: 'f', fox: 'f', ball: 'b', bed: 'b', bear: 'b', dog: 'd', duck: 'd', door: 'd', table: 't', turtle: 't' }; const nm = (x) => String(x).split(':')[1]; const st = q.choices.map((x) => START[nm(x)]);
      if (genId === 'p4-start-pic' ? (START[nm(q.answer)] !== START[q.visual.name] || st.filter((s) => s === START[q.visual.name]).length !== 1 || new Set(st).size !== 3) : (st.filter((s) => s === START[nm(q.answer)]).length !== 1 || new Set(st).size !== 2)) problems.push('picture first sound wrong'); }
    if (genId === 'p4-which-came-first' || genId === 'p4-which-came-second') { const SAYS = { meow: 'cat', quack: 'duck', buzz: 'bee', ribbit: 'frog', hoot: 'owl', growl: 'bear' }; const heard = (q.prompt.match(/[A-Za-z]+(?=, then|\. Which)/g) || []).map((w) => SAYS[w.toLowerCase()]); const at = (/came (first|second|last)\?$/.exec(q.prompt) || [])[1];
      const want = at === 'first' ? heard[0] : at === 'second' ? heard[1] : heard[heard.length - 1]; if (!want || q.answer !== 'pic:' + want || !q.explain.endsWith(' the ' + want + '.') || q.choices.length !== heard.length) problems.push('sound order wrong'); }
    if (genId === 'rr-which-two') { const [x, y] = q.answer.split(' and '); if (RHYME_END(x) !== RHYME_END(y)) problems.push('which-two pair does not rhyme'); }
    // The pre-K banks' own derivations (pass MM, above the loop): the answer must be what the question shows and says.
    if (PREK_DERIVE[genId]) { const want = PREK_DERIVE[genId](q); if (want === null || want !== q.answer) problems.push(`the answer is not what the question shows and says (${want})`); }
    if (live) { const k = L.questionKey({ ...q, visual: layoutFree(q.visual) }); if (!tasks.has(k)) tasks.set(k, new Set()); tasks.get(k).add(L.questionKey(q)); }
    return { problems, wn: wnAll };
  };
  // Seeds 1 to 300 for every bank; a pre-K bank doubles its seeds while the last half still makes a new question (pass MM), up to
  // 76,800, and each new question's mutants must all be caught. Rhyme time's heard rhymes go furthest: 740 questions since round
  // two (870 before), the last new one at seed 13,973, so the bank reads 38,400.
  const prek = PREK_BANKS.has(genId); const seen = new Set(); let lastNew = 0; let limit = 300; const missed = [];
  for (let seed = 1; seed <= limit; seed++) {
    const q = L.generateQuestion(genId, seed);
    const { problems } = check(seed, q, true);
    if (problems.length) bad.push(`seed ${seed}: ${problems.join('; ')}`);
    if (!prek) continue;
    const key = L.questionKey(q);
    if (!seen.has(key)) { seen.add(key); lastNew = seed; prekQuestions += 1;
      for (const m of mutantsOf(q)) { prekMutants += 1; const r = check(seed, m, false); if (r.problems.length === r.wn.length) { missed.push(`seed ${seed} keyed ${m.answer}`); break; } } }
    if (seed === limit && lastNew > limit / 2 && limit < 76800) limit *= 2;
  }
  if (prek) { PREK_SEEDS.set(genId, [limit, lastNew]); if (missed.length) PREK_UNCAUGHT.set(genId, missed); if (lastNew > limit / 2) bad.push(`still making new questions at seed ${lastNew} of ${limit}`); }
  { const split = [...tasks.values()].filter((keys) => keys.size > 1).length; if (split) bad.push(`${split} tasks drawn more than one way, so the bank counts layout as variety`); }
  ok(`${genId}: ${limit === 300 ? '300 seeds' : 'seeds 1 to ' + limit + ', until the last half made no new question,'} all valid and arithmetically correct`, bad.length === 0, bad.slice(0, 3).join(' | '));
}
// A yes-or-no reason fits its own question (pass MQ, round one's lesson check): "Yes would mean they do, but they do not." was heard
// after "Are glad and happy opposites?", and "No would mean it is not, but it is." after "Can you take turns talking with your
// teacher too?". In Domain II's yes-or-no banks, what the wrong answer would mean names a word of the question it answers.
{ const STOP = new Set(['would', 'mean', 'they', 'that', 'this', 'with', 'your', 'then', 'there', 'does', 'have', 'what', 'when', 'were']);
  const words = (s) => (String(s).toLowerCase().match(/[a-z']{4,}/g) || []).filter((w) => !STOP.has(w)); const off = [];
  for (const g of ['p3-people-yesno', 'p3-talk-yesno', 'p4-group-yesno']) for (let s = 1; s <= 300; s++) { const q = L.generateQuestion(g, s); const asked = new Set(words(q.prompt));
    for (const e of Object.values(q.whyNot || {})) if (!words(e.why).some((w) => asked.has(w))) off.push(`${g}: "${q.prompt}" ${e.name} ${e.why}`); }
  ok('a yes-or-no reason in Domain II\'s banks names a word of its own question (pass MQ)', off.length === 0, [...new Set(off)].slice(0, 3).join(' | ')); }
// No bank keeps its answer in one place (pass MM, the workflow review): over 300 seeds no button holds the answer 95 percent of the
// time, or a child could pass by tapping it every time (grade 1's Which number is greater? always listed the greater number second).
// And a bank of several different questions whose answer never changes teaches the answer, not the idea: those are kept by name
// with the reason the one answer is the lesson, or wait by name for their course's review (EARMARKS A31). Both lists only fall.
{ const inCourse = new Set(L.COURSES.flatMap((c) => c.modules.flatMap((m) => (L.MODULES.find((x) => x.id === m.id) || { generators: [] }).generators)));
  const SAME_KEPT = { 'p3-help-grownup': 'Very First Steps\' one answer for every hard moment is the lesson: get a grown-up' };
  const SAME_WAITING = ['s1-living-needs', 's2-magnet-pulls', 'gc-same-mean', 's3-what-stops-it', 's6-warm-to-cool', 's6-remove-a-link', 's9-closer-relative', 's11-steady-speed', 's12-single-day', 's12-where-elements', 's12-redshift', 'c3-vote-winner', 'ml1-why-differ', 'r-count-letters'];
  const placed = []; const leaning = []; const same = []; let banks = 0;
  for (const g of Object.keys(L.GENERATORS)) { if (!inCourse.has(g)) continue;
    const at = new Map(); const keys = new Set(); const answers = new Set(); let n = 0; let most = 0;
    for (let s = 1; s <= 300; s++) { const q = L.generateQuestion(g, s); if (q.type !== 'choice' || !Array.isArray(q.choices) || q.choices.length < 2) continue; n += 1; most = Math.max(most, q.choices.length); const i = q.choices.indexOf(q.answer); at.set(i, (at.get(i) || 0) + 1); keys.add(L.questionKey(q)); answers.add(String(q.answer)); }
    if (n < 50) continue; banks += 1;
    const share = Math.max(...at.values()) / n;
    if (share >= 0.95) placed.push(g); else if (share >= (most === 2 ? 0.7 : 0.55)) leaning.push(g);
    if (keys.size >= 2 && answers.size === 1) same.push(g); }
  ok(`no choice bank keeps its answer in one place, so tapping one button every time never passes (${banks} banks, 300 seeds each)`, banks >= 1200 && placed.length === 0, placed.join(', '));
  // A bank whose answer leans to one place (round two's code check, pass MM): 70 percent of the time with two choices, or 55
  // with three or more, lets a child who always taps that place pass most rounds. Those found wait by name for their course's
  // review (EARMARKS A31), and the list only falls.
  const LEANING_WAITING = ['s1-undo', 'f1-still', 's1-need-or-not', 'kd-rolls', 'so1-special', 'h1-fair-yes-no', 'ks-corners', 'sk-living-or-not', 's9-shows-trait', 's7-which-shows', 'ko-how-many-groups', 'eq1-meaning', 'rw-count-words'];
  const newLean = leaning.filter((g) => !LEANING_WAITING.includes(g)); const leanGone = LEANING_WAITING.filter((g) => !leaning.includes(g));
  ok(`no choice bank leans to one place, 70 percent of the time with two choices or 55 with more, but the ${LEANING_WAITING.length} that wait for their course's review; the list only falls`, newLean.length === 0 && leanGone.length === 0, `leaning, not listed: ${newLean.join(', ')}; listed, no longer leaning: ${leanGone.join(', ')}`);
  const unlisted = same.filter((g) => !SAME_KEPT[g] && !SAME_WAITING.includes(g)); const stale = [...Object.keys(SAME_KEPT), ...SAME_WAITING].filter((g) => !same.includes(g));
  ok(`a bank of several questions whose answer never changes is kept with its reason (${Object.keys(SAME_KEPT).length}) or waits for its course's review (${SAME_WAITING.length}); both lists only fall`, unlisted.length === 0 && stale.length === 0, `not listed: ${unlisted.join(', ')}; answers change now, so off the list: ${stale.join(', ')}`); }
// The pre-K banks' answers are derived again (pass MM): every question a pre-K bank can make, keyed wrong in every way it could
// be, is caught by a check that works the answer out from what the child sees and hears, not by More Info's. A new pre-K bank
// with no such check fails here at once.
// The helper words that derive which helper or tool are First Steps' own: each sits in one sentence of Helpers all around with its
// helper (pass MM), so the derivation above cannot drift from what the lesson says.
{ const sentences = lessonWords('helpers-all-around').split(/(?<=[.!?])\s+/);
  const off = HELPER_KEYS.filter(([k, job]) => !sentences.some((s) => s.includes(k) && s.includes(job.toLowerCase().split(' ')[0]) && s.includes(job.toLowerCase().split(' ').slice(-1)[0].slice(0, 6))));
  ok('the words that tell which helper or tool is meant are each in a sentence of First Steps\' Helpers all around that names that helper', off.length === 0 && HELPER_KEYS.length === 9, off.map((x) => x.join(' ')).join(', ')); }
// The floor reads how much was read: 3,043 questions when the check was written, 2,909 since round two's lesson check (pass MM)
// took the near-rhyme No pairs, "up" and the tuh pictures out of First Sounds and Letters.
ok(`every pre-K bank's answer is derived again: each of its questions keyed wrong is caught (${PREK_BANKS.size} banks, ${prekQuestions} questions, ${prekMutants} mutants)`, PREK_UNCAUGHT.size === 0 && PREK_BANKS.size >= 140 && prekQuestions >= 2850, [...PREK_UNCAUGHT.entries()].map(([g, m]) => `${g} (${m.length}: ${m[0]})`).join(' | '));
// Why each wrong answer does not fit (pass MH): the pre-K 3 checks above, on a line of their own, over every choice kind the
// two pre-K 3 courses use (70 when pass MH wrote them; the two tracing kinds have no choices).
ok(`every pre-K 3 and First Steps choice question says why each wrong choice does not fit, with more right examples (${WN_KINDS.size} kinds, 300 seeds each at least)`, WN_BAD.length === 0 && WN_KINDS.size >= 125, WN_BAD.slice(0, 3).join(' | '));
{ // More Info's smart words (pass MH, Mikey: "Maybe the explanation text can be "smart text" and show that it knows which wrong
  // answer was selected.  In a future visit to the module it can slightly change to "which you've chosen once before""). The words
  // follow what was tapped now and how often the same wrong answer to the same question was tapped on earlier visits.
  ok('the smart words name the choice tapped now and the earlier visits, and say nothing about a choice never tapped',
    L.whyNotClause(true, 0) === 'which you just chose' && L.whyNotClause(true, 1) === 'which you chose once before too' && L.whyNotClause(true, 3) === 'which you have chosen a few times now'
    && L.whyNotClause(false, 1) === 'which you chose once before' && L.whyNotClause(false, 2) === 'which you have chosen before' && L.whyNotClause(false, 0) === '');
  const q = L.generateQuestion('p3-sort-red-blue', 7); const wrongC = q.choices.find((c) => c !== q.answer);
  ok('a why-not line reads as one sentence with or without the smart words', L.whyNotSentence(q.whyNot[wrongC], 'which you just chose') === `${q.whyNot[wrongC].name}, which you just chose, ${q.whyNot[wrongC].why}` && L.whyNotSentence(q.whyNot[wrongC]) === `${q.whyNot[wrongC].name} ${q.whyNot[wrongC].why}`);
  // The record: two earlier rounds where this question was answered wrong with the same choice, one a reader's first answer and
  // one a pre-reader's missed tap, and one round of a different question that must not count.
  const res = (extra) => ({ genId: q.genId, seed: 7, prompt: q.prompt, answer: q.answer, correct: false, ...extra });
  const events = [
    { type: 'attempt_completed', at: '2026-10-01T10:00:00.000Z', core: [res({ given: wrongC })] },
    { type: 'attempt_completed', at: '2026-10-02T10:00:00.000Z', core: [res({ given: q.answer, missed: [wrongC] })] },
    { type: 'attempt_completed', at: '2026-10-03T10:00:00.000Z', core: [{ ...res({ given: wrongC }), prompt: 'Something else?' }] },
  ];
  const hist = L.choiceHistory(events, q);
  ok('the history counts each earlier wrong tap of this very question, a reader\'s answer and a pre-reader\'s missed tap alike', hist[wrongC] === 2 && Object.keys(hist).length === 1, JSON.stringify(hist));
  const now = L.choiceInsight(q, wrongC, hist);
  ok('More Info puts the tapped choice first, with the words for a choice tapped before too', now.any && now.wrong[0].choice === wrongC && now.wrong[0].chosenNow && now.wrong[0].text.includes('which you have chosen a few times now') && now.right === q.explain && now.more.length >= 1, now.wrong[0] && now.wrong[0].text);
  const later = L.choiceInsight(q, null, hist);
  ok('after a right answer it still names the earlier wrong taps, as once before or before', later.wrong[0].text.includes('which you have chosen before') && !later.wrong[0].chosenNow);
  const fresh = L.choiceInsight(q, null, {});
  ok('a child who never tapped a wrong answer reads every reason plainly', fresh.wrong.length === q.choices.length - 1 && fresh.wrong.every((w) => !/which you/.test(w.text)));
  // A young learner tries again, so the voice never gives the answer away (the screen check, pass MH; RULES-AUDIT, nothing gives
  // an answer away by sound). Since the lesson check's second read a reason is held back only while two or more choices are still
  // open and it names something of the answer the question has not said: in a two-choice question the tapped one is ruled out
  // and only the answer is left, so its reason is said (this one names blue, and is said).
  ok('in a two-choice question the reason is said after the wrong tap, since only the answer is left', L.whyNotNamesAnswer(q, wrongC) === true && q.choices.length === 2 && L.preReaderWrongWords(q, wrongC, [wrongC]) === `${L.whyNotSentence(q.whyNot[wrongC])} Have another try.` && L.preReaderWrongWords({ ...q, whyNot: null }, wrongC) === 'Not that one. Have another try.');
  { const four = (() => { for (let sd = 1; sd < 200; sd++) { const k = L.generateQuestion('p3-which-colour-four', sd); const w = k.choices.find((c) => c !== k.answer); if (k.choices.length === 4 && L.whyNotNamesAnswer(k, w)) return [k, w]; } return [null, null]; })();
    const [fq, fw] = four; const others = fq ? fq.choices.filter((c) => c !== fq.answer) : [];
    ok('with three choices still open, a reason that names the answer\'s color is held back; with one left, it is said', !!fq && L.preReaderWrongWords(fq, fw, [fw]) === 'Not that one. Have another try.' && L.preReaderWrongWords(fq, others[2], others) === `${L.whyNotSentence(fq.whyNot[others[2]])} Have another try.`); }
  { const cloud = (() => { for (let sd = 1; sd < 400; sd++) { const k = L.generateQuestion('p3-tap-picture', sd); if (k.answer === 'icon:cloud') return k; } return null; })();
    const cw = cloud && cloud.choices.find((c) => c !== cloud.answer);
    ok('a reason that only repeats what the question asked is said (Tap the cloud: you are looking for the cloud)', !!cloud && cloud.choices.length === 3 && L.preReaderWrongWords(cloud, cw, [cw]).endsWith('Have another try.') && !L.preReaderWrongWords(cloud, cw, [cw]).startsWith('Not that one')); }
  { const letter = (why, prompt = 'Which letter has a bar?') => L.whyNotNamesAnswer({ type: 'choice', choices: ['A', 'B', 'C'], answer: 'A', prompt, whyNot: { B: { name: 'The letter B', why } } }, 'B');
    ok('a letter is read by its capital: the letter A counts, the little word a does not, and a letter the prompt names is not news', letter('has two round bumps, and A has a bar.') && !letter('has two round bumps, a shape with no bar.') && !letter('has two round bumps, and A has a bar.', 'Tap the letter A.')); }
  { const big = (() => { for (let sd = 1; sd < 300; sd++) { const k = L.generateQuestion('pk3-tap-biggest', sd); const w = k.choices.find((c) => c !== k.answer && /medium/.test(c)); if (w) return [k, w]; } return [null, null]; })();
    ok('a size the question already said with its kin (Tap the biggest one: the big one) is not news', !!big[0] && L.whyNotNamesAnswer(big[0], big[1]) === false); }
  { const kind = (() => { for (let sd = 1; sd < 60; sd++) { const k = L.generateQuestion('p3-help-kind', sd); const w = k.choices.find((c) => c !== k.answer); if (!L.whyNotNamesAnswer(k, w)) return [k, w]; } return [null, null]; })();
    ok('a reason that leaves the answer unsaid is heard, then the invitation to try again', !!kind[0] && L.preReaderWrongWords(kind[0], kind[1]) === `${L.whyNotSentence(kind[0].whyNot[kind[1]])} Have another try.`); }
  // A reason that names another wrong picture still open is held back too (pass MJ, the lesson check: "The rabbit looks just like
  // the other rabbit, so those two go together." ruled out the other rabbit and left only the answer; "Block rhymes with rock" the
  // same). Read here without the logic's helper: every read-aloud course's choice kinds, 120 seeds each, every first wrong tap in a
  // question of three or more choices, and the words heard must name no other open wrong picture the question did not name.
  // Since pass MK an open twin of the tapped picture counts as named, whatever the words (the lesson check: "This one is just like
  // one of the others, so those two are the same." ruled out the twin in Which One Is Different? and left only the answer).
  { const said = (t) => ' ' + String(t).toLowerCase().replace(/[^a-z0-9]+/g, ' ') + ' ';
    const nameOf = (c) => { const m = String(c).split('#')[0].match(/^(?:pic|icon):(.+)$/); return m ? m[1].replace(/-/g, ' ').toLowerCase() : null; };
    const gens = [...new Set(L.COURSES.filter((c) => c.readAloud).flatMap((c) => c.modules.flatMap((m) => m.generators || [])))];
    const leaks = []; let read = 0;
    for (const g of gens) for (let sd = 1; sd <= 120; sd++) {
      let q; try { q = L.generateQuestion(g, sd); } catch (e) { continue; }
      if (!q || q.type !== 'choice' || !q.whyNot || (q.choices || []).length < 3) continue;
      for (const w of q.choices.filter((c) => c !== q.answer)) {
        const heard = said(L.heardForm(L.preReaderWrongWords(q, w, [w]))); read += 1; const asked = said(L.heardForm((q.story || '') + ' ' + (q.prompt || '')));
        for (const o of q.choices.filter((c) => c !== q.answer && c !== w)) { const n = nameOf(o); if (n && n !== nameOf(q.answer) && heard.includes(' ' + n + ' ') && !asked.includes(' ' + n + ' ')) leaks.push(`${g}#${sd} ${w}: ${n}`);
          if (String(o).split(/[#~]/)[0] === String(w).split(/[#~]/)[0] && heard !== said('Not that one. Have another try.')) leaks.push(`${g}#${sd} ${w}: its twin, still open`); }
      }
    }
    ok('a pre-reader never hears a reason that names another wrong picture still open (the rabbit and its twin, block and rock)', read > 500 && leaks.length === 0, `${read} taps; ${leaks.slice(0, 5).join('; ')}`);
    const twin = L.generateQuestion('pm-different-animals', 1); const rabbit = twin.choices.find((c) => c !== twin.answer);
    const askThis = (shown) => L.askedNames({ type: 'choice', prompt: 'Tap the one that is the same as this rabbit.', choices: ['pic:rabbit', 'pic:fox'], answer: 'pic:rabbit', visual: { kind: 'pic', name: shown } });
    ok('a name said as this <name> labels the question\'s own picture only when the picture shows it; with a fox shown, rabbit is asked', askThis('rabbit').length === 0 && askThis('fox').join() === 'rabbit');
    // A question's whole words are read, and a direction's colors count (pass MO, round one's lesson and code checks: Two ideas named
    // the answer in its setup line and Two steps asked for yellow and green, and no check saw either).
    ok('askedNames reads a question\'s setup line and a direction\'s colors and shapes, and a step told by its sound names no picture',
      L.askedNames({ type: 'order', pick: 2, prompt: 'Tap the yellow one, and then tap the green one.', answer: 'item:circle-yellow | item:circle-green', items: ['item:circle-green', 'item:circle-blue', 'item:circle-yellow'] }).sort().join() === 'green,yellow'
      && L.askedNames({ type: 'choice', story: 'Listen. It is a triangle, and it is green.', prompt: 'Tap the one that fits both ideas.', answer: 'item:triangle-green', choices: ['item:triangle-green', 'item:circle-green', 'item:triangle-blue', 'item:circle-blue'] }).sort().join() === 'green,triangle'
      && L.askedNames({ type: 'order', pick: 2, prompt: 'Tap the one that says meow, and then tap the one that says quack.', answer: 'pic:cat | pic:duck', items: ['pic:duck', 'pic:bee', 'pic:cat'] }).length === 0);
    { const odd = L.generateQuestion('p3-odd-color', 3); const twins = odd.choices.filter((c) => c !== odd.answer);
      ok('in Which One Is Different? a tap on one of the two alike pictures hears the plain invitation while its twin is open, and the reason once both are tapped', twins.length === 2 && twins[0].split('#')[0] === twins[1].split('#')[0] && L.preReaderWrongWords(odd, twins[0], [twins[0]]) === 'Not that one. Have another try.' && L.whyNotNamesOpenWrong(odd, twins[0], [odd.answer, twins[1]]) === true && L.preReaderWrongWords(odd, twins[1], twins) === `${L.whyNotSentence(odd.whyNot[twins[1]])} Have another try.`); }
    // A look after ~ makes a twin too (the second read): two triangles that differ only by their look, beside a square.
    { const looks = { type: 'choice', prompt: 'Tap the one that is different.', choices: ['shape:triangle~thin', 'shape:triangle~turned', 'shape:square'], answer: 'shape:square', whyNot: { 'shape:triangle~thin': { name: 'This one', why: 'is a triangle, just like the other one.' }, 'shape:triangle~turned': { name: 'This one', why: 'is a triangle, just like the other one.' } } };
      ok('two triangles that differ only by their look are twins: a tap on one hears the plain invitation while the other is open', L.preReaderWrongWords(looks, 'shape:triangle~thin', ['shape:triangle~thin']) === 'Not that one. Have another try.' && L.preReaderWrongWords(looks, 'shape:triangle~turned', ['shape:triangle~thin', 'shape:triangle~turned']).startsWith('This one is a triangle')); }
    ok('so after tapping one of the two alike animals the child hears the plain invitation, and the reason waits in More Info', twin.choices.length === 3 && L.preReaderWrongWords(twin, rabbit, [rabbit]) === 'Not that one. Have another try.' && L.whyNotNamesOpenWrong(twin, rabbit, twin.choices.filter((c) => c !== rabbit)) === true); }
  // A question that names every picture it shows ("Which is the smallest in real life, a cat, a snail or a whale?") has said every
  // name, so whyNotNamesAnswer lets a reason name the answer, and the reason then tells it by its sign ("and a snail is tiny");
  // pass ML's second lesson read heard 120 such lines. In every read-aloud kind, a question of three or more pictures it names
  // never hears the answer named while two are open (the leak check above reads only the other wrong pictures).
  { const said = (t) => ' ' + String(t).toLowerCase().replace(/[^a-z0-9]+/g, ' ') + ' ';
    const nameOf = (c) => { const m = String(c).split('#')[0].match(/^(?:pic|icon):(.+)$/); return m ? m[1].replace(/-/g, ' ').toLowerCase() : null; };
    const gens = [...new Set(L.COURSES.filter((c) => c.readAloud).flatMap((c) => c.modules.flatMap((m) => m.generators || [])))];
    const leaks = []; let read = 0;
    for (const g of gens) for (let sd = 1; sd <= 120; sd++) {
      let q; try { q = L.generateQuestion(g, sd); } catch (e) { continue; }
      if (!q || q.type !== 'choice' || !q.whyNot || (q.choices || []).length < 3) continue;
      const asked = said((q.story || '') + ' ' + (q.prompt || '')); const names = q.choices.map(nameOf);
      if (names.some((n) => !n || !asked.includes(' ' + n + ' '))) continue;
      const ans = nameOf(q.answer);
      for (const w of q.choices.filter((c) => c !== q.answer)) { const heard = said(L.heardForm(L.preReaderWrongWords(q, w, [w]))); read += 1; if ([ans, ans + 's'].some((n) => heard.includes(' ' + n + ' '))) leaks.push(`${g}#${sd} ${w}`); }
    }
    ok('a question that names every picture it shows never hears the answer named in a reason while two are open (a cat, a snail or a whale)', read > 100 && leaks.length === 0, `${read} taps; ${leaks.slice(0, 5).join('; ')}`); }
  // As the voice says it (pass MM, round two's screen check): a held sound is heard with its carrier word ("mmm" as the start of
  // moon), so in every read-aloud kind of three or more choices, a first wrong tap never hears the answer's picture named, as the
  // voice says the reason, unless the question named it first ("and map starts with mmm" named the moon while it was open).
  { const said = (t) => ' ' + String(t).toLowerCase().replace(/[^a-z0-9]+/g, ' ') + ' ';
    const nameOf = (c) => { const m = String(c).split('#')[0].match(/^(?:pic|icon):(.+)$/); return m ? m[1].replace(/-/g, ' ').toLowerCase() : null; };
    const gens = [...new Set(L.COURSES.filter((c) => c.readAloud).flatMap((c) => c.modules.flatMap((m) => m.generators || [])))];
    const leaks = []; let read = 0;
    for (const g of gens) for (let sd = 1; sd <= 120; sd++) {
      let q; try { q = L.generateQuestion(g, sd); } catch (e) { continue; }
      if (!q || q.type !== 'choice' || !q.whyNot || (q.choices || []).length < 3) continue;
      const ans = nameOf(q.answer); if (!ans) continue; const asked = said(L.heardForm((q.story || '') + ' ' + (q.prompt || '')));
      if (asked.includes(' ' + ans + ' ')) continue;
      for (const w of q.choices.filter((c) => c !== q.answer)) { const heard = said(L.heardForm(L.preReaderWrongWords(q, w, [w]))); read += 1; if ([ans, ans + 's'].some((n) => heard.includes(' ' + n + ' '))) leaks.push(`${g}#${sd} ${w}`); }
    }
    ok('a pre-reader never hears the answer\'s picture named after a wrong tap, the reason read as the voice says it, held sounds and all (since pass MO a sound has no word added to it)', read > 2000 && leaks.length === 0 && L.heardForm('map starts with mmm.') === 'map starts with mmm.', `${read} taps; ${leaks.slice(0, 5).join('; ')}`); }
  // A square is a rectangle too, so no pre-K question asks for "the rectangle" by that word alone while a square is on the screen
  // (pass MO, round one's accuracy check: Three steps' "Tap the rectangle, then the circle, and then the triangle." over a square
  // and a rectangle had two right answers in 101 of 400 seeds; the second pass to find a square-is-a-rectangle slip, after ML's
  // below). Every pre-K kind over 300 seeds, its words, choices and items read; "the long rectangle" passes.
  { const gens = [...new Set(L.COURSES.filter((c) => c.grade === 'PK3' || c.grade === 'PK4').flatMap((c) => c.modules.flatMap((m) => m.generators || [])))];
    const bad = []; let read = 0;
    const asksBare = (t) => /\brectangles?\b/i.test(String(t).replace(/\blong rectangles?\b/gi, ''));
    for (const g of gens) for (let sd = 1; sd <= 300; sd++) { let q; try { q = L.generateQuestion(g, sd); } catch (e) { continue; } if (!q) continue; read += 1;
      const shown = [...(q.choices || []), ...(q.items || []), q.visual ? JSON.stringify(q.visual) : ''].join(' ');
      if (/square/.test(shown) && asksBare(`${q.story || ''} ${q.prompt || ''}`)) { bad.push(`${g}#${sd}: ${q.prompt}`); break; } }
    const near = asksBare('Tap the rectangle, then the circle.') && !asksBare('Tap the long rectangle, then the circle.');
    ok(`no pre-K question asks for the rectangle by that word alone while a square is on the screen (${read} questions read)`, read > 20000 && near && bad.length === 0, bad.slice(0, 4).join(' | ')); }
  // A square is a rectangle (TEKS K.6A), so no First Steps sentence says a rectangle has two long sides; the one the lessons show is
  // the long rectangle (pass ML, the second lesson read: an explanation and two More Info rows still said it).
  { const fs = L.COURSES.find((c) => c.id === 'first-steps-pk'); const bad = [];
    for (const g of [...new Set(fs.modules.flatMap((m) => m.generators || []))]) for (let sd = 1; sd <= 300; sd++) {
      let q; try { q = L.generateQuestion(g, sd); } catch (e) { continue; } if (!q) continue;
      const texts = [q.explain || '', ...(q.alsoRight || []), ...Object.values(q.whyNot || {}).map((w) => L.whyNotSentence(w))];
      for (const t of texts) if (/\ba rectangle has two long/i.test(t)) { bad.push(`${g}#${sd}: ${t}`); break; } }
    ok('no First Steps explanation or More Info row says a rectangle has two long sides (a square is a rectangle too)', bad.length === 0, bad.slice(0, 3).join(' | ')); }
  // The groups that look like more as they are drawn (pass ML, the code check's second read): both rows of dots at one size, the
  // long row longer than the close bunch, the big circles at least 1.4 times as wide as the little ones, and every group within
  // a phone's 250-unit button, so no row shrinks and the other not.
  { const wide = (v) => v.kind === 'dots' ? v.frame * v.size + (v.frame - 1) * v.gap : v.frame * v.size + (v.frame - 1) * (v.gap || 8); const bad = [];
    for (let n = 2; n <= 5; n++) for (let m = 2; m <= 5; m++) { if (n === m) continue;
      const lg = L.lookVisual(`look:dots-${n}-long`); const cl = L.lookVisual(`look:dots-${m}-close`); const bg = L.lookVisual(`look:circles-${n}-big`); const li = L.lookVisual(`look:circles-${m}-little`);
      if (!(lg.size && lg.size === cl.size)) bad.push(`dots ${n},${m}: sizes ${lg.size} and ${cl.size}`);
      if (!(wide(lg) > wide(cl))) bad.push(`dots ${n},${m}: long ${wide(lg)} not longer than close ${wide(cl)}`);
      if (!(bg.size >= 1.4 * li.size)) bad.push(`circles ${n},${m}: big ${bg.size} against little ${li.size}`);
      for (const [k, v] of [['long', lg], ['close', cl], ['big', bg], ['little', li]]) if (wide(v) > 250) bad.push(`${k} ${n},${m}: ${wide(v)} wide`); }
    ok('the groups that look like more keep one dot size, the long row longer, big circles 1.4 times the little ones, and fit a 250-unit button', bad.length === 0, bad.slice(0, 4).join('; ')); }
  { const named = (answer, picked, why) => L.whyNotNamesAnswer({ type: 'choice', choices: [answer, picked], answer, prompt: 'Tap one.', whyNot: { [picked]: { name: 'That one', why } } }, picked);
    ok('the answer is named by a number word, a size word or a plural just as by its own word, and a word both choices share names nothing',
      named('dots:4', 'dots:3', 'is fewer than four dots.') && named('shape:circle:big', 'shape:circle:small', 'is smaller than the bigger one.') && named('item:square-blue', 'item:circle-blue', 'is round, and these are squares.')
      && !named('item:square-blue', 'item:square-red', 'is the same shape, but it is red.') && !named('Bring a teddy to hug', 'Laugh at your friend', 'can make a scared friend feel sad too, so it is not kind.')); }
  // The wrong taps a result keeps (the code check, pass MH): only choices the question offered, never the answer or a tracing.
  { const tq = { type: 'choice', choices: ['a', 'b', 'c'], answer: 'a' };
    ok('a result keeps only offered wrong choices, each once, and nothing from a tracing or a typed answer', JSON.stringify(L.missedPicks(tq, ['b', 'b', 'c', 'a', 'zzz'])) === '["b","c"]' && L.missedPicks({ type: 'trace', answer: 'x' }, ['[[[20,90],[22,89]]]']).length === 0 && L.missedPicks(null, ['b']).length === 0); }
  // The history forgets a reset, and counts only the very same question (the code check, pass MH).
  { const reset = [{ type: 'attempt_completed', at: '2026-10-01T10:00:00.000Z', moduleId: 'm', core: [res({ given: wrongC })] }, { type: 'progress_reset', at: '2026-10-02T10:00:00.000Z' }];
    const modReset = [{ type: 'attempt_completed', at: '2026-10-01T10:00:00.000Z', moduleId: 'red-and-blue', core: [res({ given: wrongC })] }, { type: 'module_reset', at: '2026-10-02T10:00:00.000Z', moduleId: 'red-and-blue' }];
    ok('a progress reset or the lesson\'s own reset clears the earlier wrong taps', Object.keys(L.choiceHistory(reset, q)).length === 0 && Object.keys(L.choiceHistory(modReset, q)).length === 0);
    const otherReset = [{ type: 'attempt_completed', at: '2026-10-01T10:00:00.000Z', moduleId: 'red-and-blue', core: [res({ given: wrongC })] }, { type: 'module_reset', at: '2026-10-02T10:00:00.000Z', moduleId: 'one-and-two' }];
    ok('another lesson\'s reset leaves the count alone', L.choiceHistory(otherReset, q)[wrongC] === 1);
    const word = (() => { for (let a = 1; a < 200; a++) { const x = L.generateQuestion('p3-ab-in-word', a); for (let b = a + 1; b < 200; b++) { const y = L.generateQuestion('p3-ab-in-word', b); if (x.prompt === y.prompt && x.answer === y.answer && L.questionKey(x) !== L.questionKey(y)) return [x, y]; } } return null; })();
    const wrongX = word && word[1].choices.find((c) => c !== word[1].answer);
    ok('a question with the same words over another setup is not the same question', !!word && Object.keys(L.choiceHistory([{ type: 'attempt_completed', at: '2026-10-01T10:00:00.000Z', core: [{ genId: word[0].genId, seed: word[0].seed, prompt: word[0].prompt, answer: word[0].answer, given: wrongX }] }], word[1])).length === 0); }
  { const wrongFaces = new Map(); for (let seed = 1; seed <= 300; seed++) { const q = L.generateQuestion('p3-feel-moment', seed); wrongFaces.set(q.prompt, q.choices.find((c) => c !== q.answer)); }
    const happy = [...wrongFaces.values()].filter((c) => c === 'face:happy').length;
    ok('in How might ... feel? the wrong face is happy in at most half the moments, so a child who avoids the smile cannot pass by it (EARMARKS A23)', wrongFaces.size >= 6 && happy * 2 <= wrongFaces.size, `${happy} of ${wrongFaces.size}`); }
  ok('lowerTitle keeps New before a name and lowers it before a common word (Massachusetts belonged to New England)', L.lowerTitle('New England') === 'New England' && L.lowerTitle('New York') === 'New York' && L.lowerTitle('New ocean floor forms') === 'new ocean floor forms' && L.generateQuestion('h5-colony-region', 1) && Array.from({ length: 60 }, (_, i) => L.generateQuestion('h5-colony-region', i + 1).explain).every((e) => !/\bnew England\b/.test(e)));
  ok('a question with nothing to add shows no More Info', L.choiceInsight({ type: 'choice', choices: ['1', '2'], answer: '1', explain: 'One.' }, '2', {}).any === false && L.choiceInsight({ type: 'number', answer: '3' }).any === false);
  // Every row of every More Info sheet reads as whole sentences (pass MH, the alignment read): the older banks' notes had read
  // "The southern colonies, which you just chose, is not the answer here. The southern colonies: big farms and slavery." So over
  // many seeds of every choice kind that shows the sheet, each row's sentences start with a capital and none hangs on a colon.
  { const bad = []; let kinds = 0;
    for (const id of Object.keys(L.GENERATORS)) {
      let shown = false;
      for (let seed = 1; seed <= 120 && bad.length < 5; seed++) {
        let q; try { q = L.generateQuestion(id, seed); } catch (e) { break; }
        if (!q || q.type !== 'choice' || !(q.whyNot || q.choiceNotes)) break;
        const wrong = q.choices.map(String).find((c) => c !== String(q.answer));
        const ins = L.choiceInsight(q, wrong, { [wrong]: 1 }); if (!ins.any) continue; shown = true;
        for (const w of ins.wrong) for (const sen of w.text.split(/(?<=[.!?])\s+/)) if (!/^[A-Z0-9]/.test(sen) || /:\s/.test(sen)) bad.push(`${id} ${seed}: ${sen}`);
        // Why this one fits and More right answers are rows of the sheet too (the second read of the late fixes: "The President:
        // the executive branch. Carries out the laws." sat under the reasons), read line by line, bold marks aside, a list line
        // ("• **Ethos:** ...") excepted.
        for (const row of [ins.right, ...ins.more]) for (const line of String(row || '').split(/\n+/)) { const t = line.replace(/\*\*/g, '').trim(); if (!t || /^\u2022 /.test(t)) continue; for (const sen of t.split(/(?<=[.!?])\s+/)) if (!/^[A-Z0-9]/.test(sen) || /:\s/.test(sen)) bad.push(`${id} ${seed}: ${sen}`); }
      }
      if (shown) kinds += 1;
    }
    ok('every row of every More Info sheet (why not, why it fits and more right answers) reads as whole sentences, each starting with a capital and none hanging on a colon', kinds >= 100 && bad.length === 0, `${kinds} kinds; ${bad.slice(0, 3).join(' | ')}`); }
}
{ const twice = [...whenAnswers].filter(([, years]) => years.size > 1).map(([story, years]) => `${story} -> ${[...years].join('/')}`);
  ok('no event is told with two different years anywhere in the bank', twice.length === 0, twice.slice(0, 5).join(' | ')); }

// ---- 2. Determinism: same seed => identical question; different seed => usually different ----
ok('same seed gives identical question', JSON.stringify(L.generateQuestion('m3-different', 7)) === JSON.stringify(L.generateQuestion('m3-different', 7)));
ok('different seeds give different questions', JSON.stringify([L.generateQuestion('m1-part-eaten', 1).story, L.generateQuestion('m1-part-eaten', 1).choices]) !== JSON.stringify([L.generateQuestion('m1-part-eaten', 2).story, L.generateQuestion('m1-part-eaten', 2).choices]));

// ---- 3. Attempts ----
const att = L.buildAttempt('fraction-meaning', 123, []);
ok('attempt has 5 core questions', att.core.length === L.CONFIG.CORE_QUESTIONS_PER_ATTEMPT);
ok('first module never gets a review question', att.review === null);
ok('core questions belong to the module', att.core.every((q) => L.getModule('fraction-meaning').generators.includes(q.genId)));
const att2 = L.buildAttempt('equivalent-fractions', 5, ['fraction-meaning']);
ok('later module gets a review question from an earlier mastered module', att2.review && att2.review.moduleId === 'fraction-meaning');
ok('no review question when nothing earlier is mastered', L.buildAttempt('equivalent-fractions', 5, []).review === null);
ok('attempt is reproducible from its seed', JSON.stringify(L.buildAttempt('comparing-fractions', 9, ['fraction-meaning'])) === JSON.stringify(L.buildAttempt('comparing-fractions', 9, ['fraction-meaning'])));

// ---- 4. Answer checking ----
const nq = { type: 'number', answer: '12' };
ok('number: "12" correct', L.checkAnswer(nq, '12'));
ok('number: " 12 " correct (whitespace ok)', L.checkAnswer(nq, ' 12 '));
ok('number: "twelve" wrong', !L.checkAnswer(nq, 'twelve'));
ok('number: empty wrong', !L.checkAnswer(nq, ''));
ok('choice: exact match required', L.checkAnswer({ type: 'choice', answer: '3/4' }, '3/4') && !L.checkAnswer({ type: 'choice', answer: '3/4' }, '6/8'));

// ---- 5. Mastery, locking, reset, report — all derived from events ----
const core = (n) => Array.from({ length: 5 }, (_, i) => ({ genId: 'x', seed: i, prompt: 'p', answer: 'a', given: i < n ? 'a' : 'b', correct: i < n }));
const ev = (moduleId, n, at, review = null) => L.makeAttemptEvent({ moduleId, seed: 1 }, core(n), review, at, at);
let events = [];
let p = L.deriveProgress(events);
  ok('fresh: a first module with no outside prerequisite is available, everything else locked', L.COURSES.every((c) => { const st = L.moduleStatuses(p).filter((x) => c.modules.some((m) => m.id === x.id)); return st.every((x) => { const req = L.prerequisitesOf(x.id); return x.status === (req.length === 0 ? 'available' : 'locked'); }); }));
events.push(ev('fraction-meaning', 3, '2026-09-03T10:00:00Z'));
p = L.deriveProgress(events);
ok('3 of 5 does not master', !p.perModule['fraction-meaning'].mastered && p.perModule['fraction-meaning'].attempts === 1);
events.push(ev('fraction-meaning', 4, '2026-09-03T10:10:00Z'));
p = L.deriveProgress(events);
ok('4 of 5 masters and unlocks module 2', p.perModule['fraction-meaning'].mastered && L.moduleStatuses(p)[1].status === 'available' && L.moduleStatuses(p)[2].status === 'locked');
ok('masteredAt is the time of the passing attempt', p.perModule['fraction-meaning'].masteredAt === '2026-09-03T10:10:00Z');
events.push(ev('equivalent-fractions', 5, '2026-09-03T10:20:00Z', { moduleId: 'fraction-meaning', genId: 'x', seed: 1, prompt: 'p', answer: 'a', given: 'b', correct: false }));
p = L.deriveProgress(events);
ok('review question counted for retention, not for the gate', p.review.asked === 1 && p.review.correct === 0 && p.perModule['equivalent-fractions'].mastered);
const r = L.buildReport('Test', events);
ok('report: 2 mastered, 3 attempts, accuracy 70% on module 1', r.modulesMastered === 2 && r.modulesTotal === L.MODULES.length && r.totalAttempts === 3 && r.modules.find((m) => m.id === 'fraction-meaning').accuracyPercent === 70);
ok('report carries its definitions', r.definitions.length >= 4);
events.push(L.makeResetEvent('2026-09-03T11:00:00Z'));
p = L.deriveProgress(events);
ok('reset: history kept, but nothing counts as mastered afterwards', events.length === 4 && p.masteredIds.length === 0 && L.moduleStatuses(p)[0].status === 'available');

// ---- 6. Confidence score follows its printed rules ----
{
  const t = (i) => new Date(2026, 8, 3, 10, i).toISOString();
  const core = (pattern, ms = 9000) => pattern.split('').map((c, i) => { const r = { genId: 'm1-picture', seed: i + 1, prompt: 'q', answer: '1/2', given: c === '1' ? '1/2' : '1/3', correct: c === '1' }; if (ms !== null) r.timeMs = ms; return r; });
  const att = (moduleId, pattern, at, review = null, ms) => {
    const results = core(pattern, ms);
    return { type: 'attempt_completed', at, startedAt: at, moduleId: moduleId, seed: 1, core: results, review, coreCorrect: results.filter((r) => r.correct).length, coreTotal: results.length };
  };
  const M = 'fraction-meaning';
  ok('confidence: no attempts -> no score', L.computeConfidence(M, []).score === null);
  ok('confidence: 3 of 5, not mastered -> 1', L.computeConfidence(M, [att(M, '11100', t(1))]).score === 1);
  ok('confidence: mastered with 4 of 5 -> 3', L.computeConfidence(M, [att(M, '11110', t(1))]).score === 3);
  ok('confidence: mastered and latest set perfect -> 4', L.computeConfidence(M, [att(M, '11110', t(1)), att(M, '11111', t(2))]).score === 4);
  ok('confidence: 10 correct in a row -> 5', L.computeConfidence(M, [att(M, '11111', t(1)), att(M, '11111', t(2))]).score === 5);
  const rev = (correct) => ({ moduleId: M, genId: 'm1-picture', seed: 1, prompt: 'q', answer: '1/2', given: '1/2', correct });
  const withRetention = [att(M, '11110', t(1)), att('equivalent-fractions', '11110', t(2), rev(true)), att('equivalent-fractions', '11111', t(3), rev(true))];
  ok('confidence: mastered + 2 of 2 review questions right -> 4', L.computeConfidence(M, withRetention).score === 4);
  ok('confidence: never above 5', L.computeConfidence(M, [att(M, '11111', t(1)), att(M, '11111', t(2)), att('equivalent-fractions', '11111', t(3), rev(true)), att('equivalent-fractions', '11111', t(4), rev(true))]).score === 5);
  const guessy = L.computeConfidence(M, [att(M, '11100', t(1), null, 1500)]);
  ok('confidence: two fast wrong answers flags guessing', guessy.signals.includes('guessing?'));
  ok('confidence: slow wrong answers do not flag guessing', !L.computeConfidence(M, [att(M, '11100', t(1), null, 9000)]).signals.includes('guessing?'));
  ok('confidence: median time reported in seconds', L.computeConfidence(M, [att(M, '11111', t(1), null, 6500)]).medianSec === 6.5);
  ok('confidence: missing timings do not break it', L.computeConfidence(M, [att(M, '11111', t(1), null, null)]).medianSec === null);
  const rep = L.buildReport('Test', [att(M, '11110', t(1))]);
  ok('report includes a confidence score per module', rep.modules.find((m) => m.id === M).confidence.score === 3 && rep.modules.find((m) => m.id === 'equivalent-fractions').confidence.score === null);
  ok('report prints the confidence rules', rep.definitions.some((d) => d.startsWith('Confidence starts at 1')));
  ok('every question has a one-sentence prompt and a story or null', Object.keys(L.GENERATORS).every((g) => { const q = L.generateQuestion(g, 7); return typeof q.prompt === 'string' && (q.story === null || typeof q.story === 'string'); }));
  ok('explanation pictures are valid bars or a group of dots', Object.keys(L.GENERATORS).every((g) => { const q = L.generateQuestion(g, 11); if (q.explainVisual === null) return true; if (Array.isArray(q.explainVisual)) return q.explainVisual.every((b) => Number.isInteger(b.parts) && b.parts >= 2 && b.shaded >= 0 && b.shaded <= b.parts && typeof b.label === 'string'); if (q.explainVisual.kind === 'letters') return typeof q.explainVisual.text === 'string' && q.explainVisual.text.length > 0; if (q.explainVisual.kind === 'numberline') return q.explainVisual.from < q.explainVisual.to && (q.explainVisual.marks || []).every((v) => v >= q.explainVisual.from && v <= q.explainVisual.to); if (q.explainVisual.kind === 'tri') return q.explainVisual.base > 0 && q.explainVisual.height > 0; if (q.explainVisual.kind === 'percentgrid') return q.explainVisual.shaded >= 0 && q.explainVisual.shaded <= 100; if (q.explainVisual.kind === 'pic') return typeof q.explainVisual.name === 'string' && q.explainVisual.name.length > 0; if (q.explainVisual.kind === 'pair') return [q.explainVisual.a, q.explainVisual.b].every((h) => h && typeof h.kind === 'string' && (h.name || h.colour || h.shape || h.count)); return q.explainVisual.kind === 'dots' && q.explainVisual.count >= 1 && q.explainVisual.count <= 10; }));
}

// ---- 7. Courses, subjects, and the per-learner course switch ----
{
  ok('every module belongs to a course with a subject', L.MODULES.every((m) => L.getCourse(m.courseId) && typeof L.getCourse(m.courseId).subject === 'string'));
  ok('coverage rule: every module has at least 5 question types, except writing which is one piece per round', L.MODULES.every((m) => m.generators.length >= 5 || (L.getCourse(m.courseId) || {}).educatorMarked));
  ok('all courses enabled by default', JSON.stringify(L.enabledCourseIds([])) === JSON.stringify(L.COURSES.map((c) => c.id)));
  const off = L.makeCoursesEnabledEvent([], '2026-09-03T10:00:00.000Z');
  ok('educator can switch every course off', L.enabledCourseIds([off]).length === 0);
  const on = L.makeCoursesEnabledEvent(['fractions-intro', 'not-a-real-course'], '2026-09-03T10:01:00.000Z');
  ok('unknown course ids are ignored, latest setting wins', JSON.stringify(L.enabledCourseIds([off, on])) === '["fractions-intro"]');
  const reset = L.makeResetEvent('2026-09-03T10:02:00.000Z');
  ok('course setting survives a progress reset', L.buildReport('T', [off, reset]).enabledCourseIds.length === 0);
  ok('report rows carry subject and course', L.buildReport('T', []).modules.every((m) => typeof m.subject === 'string' && typeof m.courseTitle === 'string'));
  ok('kindergarten course exists, is read-aloud, and has sixteen modules', L.getCourse('counting-k') && L.getCourse('counting-k').readAloud === true && L.getCourse('counting-k').modules.length === 16);   // fourteen plus coins and picture graphs (pass KL)
  ok('reading course exists in a second subject', L.getCourse('letters-k') && L.getCourse('letters-k').subject === 'Reading' && L.getCourse('letters-k').readAloud === true);
  ok('describeChoice turns a picture choice into words', L.describeChoice('dots:4') === 'the group with 4' && L.describeChoice('3/4') === '3/4');
  // Since pass MO (round one's code check: a direction in a reader's review printed "icon:hat | icon:ball"): pictures, colored
  // shapes and color squares are named in words, and an order's answer is said one step after another.
  ok('describeChoice names a picture, a colored shape and a color square, and describeAnswer says an order step by step', L.describeChoice('icon:hat') === 'the hat' && L.describeChoice('pic:cat#2') === 'the cat' && L.describeChoice('item:circle-red') === 'the red circle' && L.describeChoice('swatch:blue') === 'the blue one'
    && L.describeAnswer({ type: 'order', answer: 'icon:hat | icon:ball' }) === 'the hat, then the ball' && L.describeAnswer({ type: 'choice', answer: 'dots:3' }) === 'the group with 3');
}

// ---- 8. Wonder: open questions, never stored words, never graded ----
{
  const allApproved = L.WONDER.reduce((r, w) => L.approveWonder(r, w.id), L.emptyWonderReview());
  ok('every course has a Wonder question once approved', L.COURSES.every((c) => L.wonderFor(c.id, 0, allApproved) !== null));
  ok('nothing is offered to a student before somebody approves it', L.COURSES.every((c) => L.wonderFor(c.id, 0, L.emptyWonderReview()) === null));
  ok('everything starts out awaiting review', L.wonderAwaitingReview(L.emptyWonderReview()) === L.WONDER.length);
  ok('approving one leaves the rest waiting', L.wonderAwaitingReview(L.approveWonder(L.emptyWonderReview(), 'w-one-thing')) === L.WONDER.length - 1);
  ok('an approved question can be withdrawn again', L.wonderFor('fractions-intro', 0, L.unapproveWonder(allApproved, 'w-one-thing')) === null);
  const hiddenState = L.hideWonder(allApproved, 'w-one-thing');
  ok('hiding a question also withdraws its approval', L.isWonderApproved(hiddenState, 'w-one-thing') === false && L.isWonderHidden(hiddenState, 'w-one-thing'));
  ok('a hidden question is not counted as awaiting review', L.wonderAwaitingReview(hiddenState) === 0);
  ok('a hidden question can be brought back for review', L.wonderAwaitingReview(L.restoreWonder(hiddenState, 'w-one-thing')) === 1);
  ok('questions run from the first met in pre-K to the last', L.wonderInOrder()[0].stage === 'early' && L.wonderInOrder().slice(-1)[0].stage === 'grown');
  ok('every question names a stage the platform knows', L.WONDER.every((w) => L.LIFE_STAGES.some((st) => st.id === w.stage)));
  ok('approve all approves everything not removed', L.approveAllWonder(L.emptyWonderReview()).approved.length === L.WONDER.length);
  ok('approve all leaves removed questions removed', L.approveAllWonder(hiddenState).approved.includes('w-one-thing') === false);
  ok('un-approve all sends everything back to awaiting review and keeps removals', L.unapproveAllWonder(allApproved).approved.length === 0 && L.unapproveAllWonder(hiddenState).hidden.includes('w-one-thing'));
  { const done = ['colours', 'same-and-different', 'match-the-vehicles', 'match-the-things', 'match-the-water-animals', 'match-the-land-animals', 'match-the-shapes', 'match-the-solids', 'more-and-fewer-5', 'bigger-and-smaller', 'patterns', 'count-to-3', 'first-strokes', 'connect-the-dots', 'draw-the-shapes', 'taking-turns', 'big-bigger-biggest', 'helpers-all-around', 'feelings-show', 'how-friends-feel', 'good-friend', 'play-together'].map((id, i) => ({ type: 'attempt_completed', at: `u${i}`, startedAt: 'u', moduleId: id, seed: 1, core: [], review: null, coreCorrect: 5, coreTotal: 5 }));
    ok('finishing a course unlocks the next course up in that subject', JSON.stringify(L.coursesToUnlock([L.makeCoursesEnabledEvent(['first-steps-pk'], 't'), ...done])) === '["counting-k"]');
    ok('nothing unlocks while a course is unfinished', L.coursesToUnlock([L.makeCoursesEnabledEvent(['first-steps-pk'], 't'), ...done.slice(0, 2)]).length === 0); }
  // The cadence: one reflection after every two mastered modules, rotating through the pool
  const pass = (id, at) => ({ type: 'attempt_completed', at, startedAt: at, moduleId: id, seed: 1, core: [], review: null, coreCorrect: 5, coreTotal: 5 });
  const one = [pass('count-to-5', '2026-09-01T10:00:00.000Z')];
  const two = [...one, pass('count-to-10', '2026-09-01T11:00:00.000Z')];
  ok('one round is not yet due a reflection', L.nextWonder(one, 'counting-k', allApproved) === null);
  ok('two rounds are due one', L.nextWonder(two, 'counting-k', allApproved) !== null);
  const failed = (id, at) => ({ ...pass(id, at), coreCorrect: 1 });
  ok('failed rounds count too, so a struggling child meets more reflections', L.nextWonder([failed('count-to-5', 't1'), failed('count-to-10', 't2')], 'counting-k', allApproved) !== null);
  ok('two rounds of the same module count as one module, so it is not yet due', L.nextWonder([pass('count-to-5', 't1'), pass('count-to-5', 't2')], 'counting-k', allApproved) === null);
  ok('after a failed round the reflection is about failure, feelings, or getting through', ['failure', 'feelings', 'ups-and-downs'].includes(L.nextWonder([failed('count-to-5', 't1'), failed('count-to-10', 't2')], 'counting-k', allApproved).theme));
  ok('a pre-reader only ever gets a question with its short spoken voices (four since pass MH)', Array.isArray(L.nextWonder(two, 'counting-k', allApproved, true).simple));
  ok('nothing is due when nothing is approved', L.nextWonder(two, 'counting-k', L.emptyWonderReview()) === null);
  const first = L.nextWonder(two, 'counting-k', allApproved);
  const answered = [...two, L.makeWonderEvent(first.id, 'count-to-10', '2026-09-01T11:30:00.000Z', 20, 1)];
  ok('answering one resets the count', L.nextWonder(answered, 'counting-k', allApproved) === null);
  const more = [...answered, pass('one-more-one-less', '2026-09-02T10:00:00.000Z'), pass('joining-and-taking-away', '2026-09-02T11:00:00.000Z')];
  const second = L.nextWonder(more, 'counting-k', allApproved);
  ok('the next reflection is a different question, not a repeat', second !== null && second.id !== first.id);
  ok('the pool is shared across courses at the same stage', L.WONDER.filter((w) => w.stage === 'early').length >= 5);
  // Never a third time: exhaust every early question twice, and the reflection is skipped
  const earlyIds = L.WONDER.filter((w) => w.stage === 'early').map((w) => w.id);
  let log = []; let t = 0;
  for (let round = 0; round < 2; round++) for (const id of earlyIds) log.push(L.makeWonderEvent(id, 'count-to-5', `2026-09-0${1 + (t++ % 8)}T${String(10 + (t % 12)).padStart(2, '0')}:00:00.000Z`, 10, 1));
  log.sort((a, b) => a.at.localeCompare(b.at));
  const exhausted = [...log, pass('count-to-5', '2026-09-20T10:00:00.000Z'), pass('count-to-10', '2026-09-20T11:00:00.000Z')];
  ok('once every question has been answered twice, no reflection is offered rather than a repeat', L.nextWonder(exhausted, 'counting-k', allApproved) === null);
  const almost = exhausted.filter((e) => !(e.type === 'wonder_answered' && e.wonderId === earlyIds[0] && e === log.filter((x) => x.wonderId === earlyIds[0])[1]));
  ok('a question answered only once is still offered before any repeats', L.nextWonder(almost, 'counting-k', allApproved) !== null && L.nextWonder(almost, 'counting-k', allApproved).id === earlyIds[0]);
  ok('every Wonder question has four perspectives and a closing question', L.WONDER.every((w) => w.perspectives.length === 4 && w.closing.includes('?')));
  ok('the game that opens first is a playful one: Pong leads a list of decks and quick fires', (() => { const deck = { id: 'a', kind: 'pairs' }, quick = { id: 'b', kind: 'sprint' }, pong = { id: 'c', kind: 'pong' }; const out = L.funFirst([deck, quick, pong]); return out[0] === pong && out.length === 3 && out[1] === deck && out[2] === quick; })());
  ok('a list with nothing playful keeps its order', (() => { const a = { id: 'a', kind: 'pairs' }, b = { id: 'b', kind: 'evidence' }; const out = L.funFirst([a, b]); return out[0] === a && out[1] === b; })());
  ok('every perspective is written in complete sentences, not fragments', L.WONDER.every((w) => w.perspectives.every((p) => p.says.split('. ').every((sentence) => sentence.trim().split(/\s+/).length >= 5))));
  ok('no perspective uses an em dash', L.WONDER.every((w) => w.perspectives.every((p) => !p.says.includes('\u2014'))));
  ok('pick-mode Wonder questions offer options', L.WONDER.filter((w) => w.answerMode === 'pick').every((w) => Array.isArray(w.options) && w.options.length >= 2));
  { // Pass IS: a child who cannot read yet hears the question and then every choice, in order, with Or before the last.
    const spokenEarly = L.WONDER.filter((w) => w.stage === 'early' && w.answerMode === 'pick' && Array.isArray(w.simple));
    ok('a pre-reader hears the Wonder question and then every choice, in order', spokenEarly.length > 0 && spokenEarly.every((w) => { const p = L.wonderSpokenParts(w); return p.length === w.options.length + 1 && p[0] === w.prompt && w.options.every((o, i) => p[i + 1].includes(o)) && p[p.length - 1].startsWith('Or '); }));
    // Pass MH (Mikey: "We can also use all four voices, even for the early learners.  We don't need to restrict them to two."):
    // every question a pre-reader can meet carries four short voices in the cast's order, Frederick, Chloe, Georgette and Mike,
    // each one person (wonderVoice), short enough to hear whole and ending like a sentence.
    const CAST = ['Frederick', 'Chloe', 'Georgette', 'Mike'];
    const offOrder = spokenEarly.filter((w) => !(w.simple.length === 4 && w.simple.every((v, i) => (L.wonderVoice(v.voice) || {}).name === CAST[i] && /[.?!]$/.test(v.says) && v.says.split(/\s+/).length <= 24))).map((w) => w.id);
    ok('the four voices a pre-reader hears come in the cast\'s order, are short and end like sentences', spokenEarly.length >= 90 && offOrder.length === 0, offOrder.join(', '));
    // Mikey's own lines for the size question, word for word (pass MH).
    { const big = L.WONDER.find((w) => w.id === 'w-big-or-small');
      ok('the size question\'s scientist and artist speak in Mikey\'s words', !!big && big.simple[0].says === 'Technically, you are bigger than a mouse and smaller than a horse.' && big.simple[1].says === 'I think, when you are next to a mountain, everyone feels small.'); }
    // Pass MG (Mikey's answer to Q10, "yes"): after the two voices a pre-reader meets the question's closing line on a card of its
    // own, spoken as it is, so the last thought reaches a child who cannot read; each voice is spoken by name and label first.
    const reachable = L.WONDER.filter((w) => Array.isArray(w.simple));
    ok('every question a pre-reader can meet ends on its closing line, after its four short voices', reachable.length > 0 && reachable.every((w) => { const cards = L.wonderPreReaderCards(w); return cards.length === w.simple.length + 1 && cards[cards.length - 1].closing === w.closing && cards.slice(0, -1).every((c, i) => c.voice === w.simple[i].voice && c.says === w.simple[i].says); }));
    // Since pass MH the closing card carries a rotating title (Mikey's seven first, word for word), spoken before the line with
    // a pause after a title that has no end mark of its own; the title depends on the question and the number answered.
    const endMark = (t) => (/[.!?]$/.test(t) ? t : `${t}.`);
    ok('the closing card is spoken as its title and then its line word for word, and a voice card by its name, its label and its words', reachable.every((w) => { const cards = L.wonderPreReaderCards(w, 3); const last = cards[cards.length - 1]; return L.PONDER_TITLES.includes(last.title) && last.title === L.ponderTitle(w, 3) && L.wonderCardSpoken(last) === `${endMark(last.title)} ${w.closing}` && L.wonderCardSpoken(cards[0]) === `${L.wonderVoiceSpoken(cards[0].voice)}: ${cards[0].says}`; }) && L.wonderCardSpoken(null) === '' && L.wonderPreReaderCards(null).length === 0);
    ok('the closing titles begin with Mikey\'s seven, word for word, and there are at least sixteen', L.PONDER_TITLES.length >= 16 && ["Let's Ponder!", "Let's Reflect!", 'A Question for You', 'One More Thought', 'One Last Thought', 'One More', "Here's One"].every((t, i) => L.PONDER_TITLES[i] === t) && new Set(L.PONDER_TITLES).size === L.PONDER_TITLES.length);
    { const w0 = L.WONDER.find((w) => w.id === 'w-big-or-small'); const seen = new Set(Array.from({ length: L.PONDER_TITLES.length }, (_, n) => L.ponderTitle(w0, n)));
      ok('the title changes from one answered question to the next, and the same visit always shows the same title', seen.size === L.PONDER_TITLES.length && L.ponderTitle(w0, 5) === L.ponderTitle(w0, 5) && L.ponderTitle(w0, 5) !== L.ponderTitle(w0, 6)); }
    ok('only the questions with four short voices reach a pre-reader, and each has a closing line short enough to hear whole', reachable.every((w) => w.stage === 'early' && typeof w.closing === 'string' && w.closing.split(/\s+/).length <= 24));
    // Pass MG (the Wonder check): an early question uses the lessons' own feeling word, mad, never cross, and an early closing
    // or short voice that sends a child outside names a grown-up. A shadow or the sky with no outside word stays with the Wonder brief.
    const earlyAll = L.WONDER.filter((w) => w.stage === 'early');
    const wordsOf = (w) => [w.prompt, w.closing, ...(w.options || []), ...(w.simple || []).map((v) => v.says), ...w.perspectives.map((p) => p.says)];
    const crossIds = earlyAll.filter((w) => wordsOf(w).some((t) => /\bcross\b/i.test(t))).map((w) => w.id);
    ok('no early Wonder question says cross for a feeling, since the lessons teach mad', earlyAll.length >= 90 && crossIds.length === 0, crossIds.join(', '));
    // Pass MH (the Wonder second read): a short voice a pre-reader hears never says actually, anywhere in the line, since it
    // sounds like correcting the child's answer or the voice before it; the writer's scan of openings missed one mid-line.
    const actuallyIds = earlyAll.filter((w) => (w.simple || []).some((v) => /\bactually\b/i.test(v.says))).map((w) => w.id);
    ok('no short voice a pre-reader hears says actually', actuallyIds.length === 0, actuallyIds.join(', '));
    const aloneIds = earlyAll.filter((w) => [w.closing, ...(w.simple || []).map((v) => v.says)].some((t) => /\boutside\b(?! the lines)|\boutdoors\b/i.test(t) && !/\bgrown-up\b/i.test(t))).map((w) => w.id);
    ok('an early closing or short voice that sends a child outside names a grown-up', aloneIds.length === 0, aloneIds.join(', '));
    ok('every Wonder question has its own id', new Set(L.WONDER.map((w) => w.id)).size === L.WONDER.length);
    ok('every Wonder question carries a theme the rotation knows', L.WONDER.every((w) => Object.keys(L.WONDER_THEMES).includes(w.theme || 'world')));
  }
  { // Pass LY (Mikey): the four voices are the core cast by name, each with the label for how they see things.
    ok('the four Wonder voices are Frederick the Scientist, Chloe the Artist, Georgette the Grandparent of Faith and Mike the Skeptic',
      L.WONDER_VOICES.map((v) => `${v.name}|${v.role}`).join(',') === 'Frederick|The Scientist,Chloe|The Artist,Georgette|The Grandparent of Faith,Mike|The Skeptic');
    const order = L.WONDER.filter((w) => w.perspectives.map((p) => (L.wonderVoice(p.voice) || {}).name).join() !== 'Frederick,Chloe,Georgette,Mike').map((w) => w.id);
    ok('every Wonder question gives its four perspectives to Frederick, Chloe, Georgette and Mike, in that order', order.length === 0, order.join(', '));
    const lost = L.WONDER.filter((w) => (w.simple || []).some((v) => !L.wonderVoice(v.voice))).map((w) => w.id);
    ok('every short voice a pre-reader hears is one of the four', lost.length === 0, lost.join(', '));
    ok('a voice is read aloud by name and label', L.wonderVoiceSpoken('An artist says') === 'Chloe, the artist, says' && L.wonderVoiceSpoken('A grandparent says') === 'Georgette, the grandparent of faith, says' && L.wonderVoiceSpoken('A scientist') === 'Frederick, the scientist, says');
    ok('answer choices sit in even columns: four make two by two, up to three share a row, an odd five stacks', L.evenColumns(4) === 2 && L.evenColumns(3) === 3 && L.evenColumns(2) === 2 && L.evenColumns(1) === 1 && L.evenColumns(6) === 3 && L.evenColumns(5) === 1);
    ok('a list with a long answer stacks one a row, and short ones share', L.chipColumns(['Sometimes', 'Always', 'Never']) === 1 && L.chipColumns(['Yes', 'No', 'Not sure']) === 3 && L.chipColumns(['Red', 'Blue', 'Yellow', 'Green']) === 2);
    ok('a voice label names exactly one person or none', L.wonderVoice('A scientist') && L.wonderVoice('A grandparent of faith says').name === 'Georgette' && L.wonderVoice('A builder') === null && L.wonderVoice("A scientist's grandparent says") === null);
    const longest = L.WONDER.filter((w) => w.answerMode === 'pick').flatMap((w) => w.options).filter((o) => o.length > 40);
    ok('every Wonder answer fits one chip on a phone (forty characters or fewer)', longest.length === 0, longest.join(' | '));
  }
  { // Pass IX: no Wonder voice tells a child to vent a feeling out (give it somewhere to go, stomp it out, squeeze or punch a
    // pillow). The evidence supports calming the body and absorbing distraction (Bushman 2002; Kjaervik and Bushman 2024;
    // Drake and Winner 2013). Prompts may still ask about the myth; only the voices are read.
    const VENTING = /somewhere to go|out of your body|squeeze a pillow|stomp (it |out )|let (it|your anger|the anger|your feelings) out|punch(ing)? a pillow/i;
    const voices = L.WONDER.flatMap((w) => [...w.perspectives.map((p) => p.says), ...(w.simple || []).map((v) => v.says)]);
    ok('no Wonder voice recommends venting a feeling out', voices.every((t) => !VENTING.test(t)), voices.filter((t) => VENTING.test(t)).join(' | '));
  }
  { // Pass IT (Mikey's screenshots): every picture a lesson or a question names has a drawing, so none falls back to a grey circle.
    const uiSrc = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8'); const logicSrc = readFileSync(new URL('../src/logic.mjs', import.meta.url), 'utf8');
    const iconBody = uiSrc.slice(uiSrc.indexOf('function IconPic('), uiSrc.indexOf('}[name] ||', uiSrc.indexOf('function IconPic(')));
    const drawn = new Set([...iconBody.matchAll(/^\s{4}([a-z]+): </gm)].map((m) => m[1])); const named = new Set();
    for (const m of logicSrc.matchAll(/icon:([a-z]+)/g)) named.add(m[1]); for (const m of logicSrc.matchAll(/kind: 'icon', name: '([a-z]+)'/g)) named.add(m[1]);
    for (const id of Object.keys(L.GENERATORS)) for (let s = 1; s <= 30; s++) { let q; try { q = L.generateQuestion(id, s); } catch (e) { break; } for (const c of [...(q.choices || []), ...String(q.answer).split(' | ')]) if (typeof c === 'string' && c.startsWith('icon:')) named.add(c.slice(5).split(/[:#~]/)[0]); for (const v of [q.visual, q.explainVisual]) if (v && v.kind === 'icon') named.add(String(v.name).split('~')[0]); }
    const missing = [...named].filter((n) => !drawn.has(n));
    ok('every icon a lesson or question names has a drawing', named.size > 10 && missing.length === 0, missing.join(', '));
    ok('the moon is drawn as a crescent, not two arcs that cancel out', /moon: <path d="M66 16A34 34 0 0 0 66 84A40 40 0 0 1 66 16Z"/.test(iconBody));
  }
  { // Pass IT: lesson titles read naturally inside sentences.
    ok('a lesson title that starts with a doing word reads naturally', L.teachPhrase('Count to 10') === 'counting to 10' && L.goalPhrase('Count to 10') === 'how to count to 10' && L.teachPhrase('Spend, save and share') === 'spending, saving and sharing' && L.teachPhrase('Compare and contrast') === 'comparing and contrasting' && L.teachPhrase('Find the match') === 'finding the match');
    ok('question, sentence and topic titles read naturally too', L.goalPhrase('How plants grow') === 'how plants grow' && L.teachPhrase('Sound is a vibration') === 'that sound is a vibration' && L.goalPhrase('Shapes') === 'about shapes');
    ok('every lesson title gives a phrase that keeps a capital only for a name', L.COURSES.flatMap((c) => c.modules).every((m) => { const t = L.teachPhrase(m.title); const g = L.goalPhrase(m.title); return t && g && (!/^[A-Z][a-z]/.test(t) || L.lowerTitle(m.title).charAt(0) === m.title.charAt(0)) && !/  /.test(t + g); }) && L.teachPhrase('Big and small') === 'big and small' && L.lowerTitle('Big Bang') === 'Big Bang');
    const at = (d) => new Date(Date.now() - d * 86400000).toISOString();
    const rnd = (id, d, flags) => ({ type: 'attempt_completed', at: at(d), startedAt: at(d), moduleId: id, seed: d, core: flags.map((c) => ({ correct: c })), review: null, coreCorrect: flags.filter(Boolean).length, coreTotal: flags.length });
    const ids = L.COURSES.find((c) => c.id === 'counting-k').modules.slice(0, 3).map((m) => m.id);
    const note = L.weeklyNote('Sam', [L.makeCoursesEnabledEvent(['counting-k'], at(9)), rnd(ids[0], 3, [true, true, true, true, true]), rnd(ids[1], 2, [true, false, false, true, false]), rnd(ids[2], 1, [true, true, false, true, true])], new Date().toISOString());
    ok('the weekly note names each lesson once, each on its own line', ids.every((id) => note.split(L.getModule(id).title).length - 1 <= 1) && !note.includes('working on'), note.replace(/\n/g, ' / '));
  }
  const ev = L.makeWonderEvent('w-one-thing', 'fraction-meaning', '2026-09-04T10:00:00.000Z', 42, 12);
  ok('a Wonder event stores no words', !Object.values(ev).some((v) => typeof v === 'string' && v.split(' ').length > 3));
  ok('Wonder never affects mastery', L.deriveProgress([ev]).masteredIds.length === 0);
  ok('report counts reflections', L.buildReport('T', [ev]).reflections === 1);
}

// ---- 9. Grades and feature switches ----
{
  ok('every course names a grade the platform knows', L.COURSES.every((c) => L.GRADES.includes(c.grade)));
  ok('grade labels read plainly', L.gradeLabel('K') === 'Kindergarten' && L.gradeLabel('3') === 'Grade 3');
  ok('only grades that have courses are offered, in order', JSON.stringify(L.gradesWithCourses()) === '["PK3","PK4","K","1","2","3","4","5","6","7","8","9","10","11","12","C"]');
  const k = L.subjectsForGrade('K');
  // Health joined kindergarten on 2026-09-23; it sorts last.
  ok('kindergarten groups into Math, Reading, Science, History, Art, Technology, Health, Economics, Philosophy, Psychology, Speech, Agriculture and Business, in that order (business joined K in pass HH)', k.length === 13 && k[12].subject === 'Business' && k[0].subject === 'Math' && k[1].subject === 'Reading' && k[2].subject === 'Science' && k[3].subject === 'History' && k[4].subject === 'Art' && k[5].subject === 'Technology' && k[6].subject === 'Health' && k[7].subject === 'Economics' && k[8].subject === 'Philosophy' && k[9].subject === 'Psychology' && k[10].subject === 'Speech' && k[11].subject === 'Agriculture');
  ok('every grade now has courses', L.subjectsForGrade('PK3').length === 2);
  ok('science runs from kindergarten to grade 12', ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].every((g) => L.subjectsForGrade(g).some((x) => x.subject === 'Science')));
  ok('pre-K 3 is never a starter; a new early-years student begins at pre-K 4', L.recommendedCourseIds([L.makeCoursesEnabledEvent([], 't')], 'early').every((id) => L.getCourse(id).grade === 'PK4'));
  ok('every course in a grade group really belongs to that grade', L.gradesWithCourses().every((g) => L.subjectsForGrade(g).every((s) => s.courses.every((c) => c.grade === g))));
  ok('the optional sections have switches', ['reflection', 'lifeSkills', 'checks'].every((k2) => typeof L.FEATURES[k2] === 'boolean'));
}

// ---- 10. Roster: admins create the IDs, students only pick them ----
{
  let r = L.emptyRoster();
  ok('a new roster is empty', r.students.length === 0);
  ok('an empty ID is refused with a plain sentence', L.addStudent(r, '  ', 't', { level: 'elementary' }).error === 'Enter a student ID first.');
  r = L.addStudent(r, 'S-1042', '2026-09-05T10:00:00.000Z', { level: 'elementary' }).roster;
  ok('an ID becomes a safe key but keeps its readable label', r.students[0].id === 's_1042' && r.students[0].label === 'S-1042');
  ok('the same ID cannot be added twice', L.addStudent(r, 's-1042', 't', { level: 'elementary' }).error !== null);
  // A PIN is four digits chosen by the educator, or nothing; Wonder questions are on unless switched off.
  ok('a PIN must be four digits', L.cleanPin('1234') === '1234' && L.cleanPin('123') === null && L.cleanPin('12a4') === null && L.cleanPin('') === null);
  ok('a bad PIN while adding is refused with a plain sentence', L.addStudent(r, 'S-2', 't', { level: 'elementary', pin: '12' }).error === 'A PIN is 4 digits.');
  { const added = L.addStudent(r, 'S-2', 't', { level: 'elementary', pin: '4321', wonder: false }).roster; const st = L.findStudent(added, 'S-2');
    ok('a PIN and the Wonder switch are kept on the student', st.pin === '4321' && st.wonder === false && L.wonderOnFor(st) === false);
    ok('the right PIN opens the record and a wrong one does not', L.pinMatches(st, '4321') && !L.pinMatches(st, '0000') && L.pinMatches(L.findStudent(added, 'S-1042'), ''));
    ok('a PIN can be changed or removed, and Wonder switched back on', L.findStudent(L.setStudentPin(added, 'S-2', '9999'), 'S-2').pin === '9999' && L.findStudent(L.setStudentPin(added, 'S-2', null), 'S-2').pin === null && L.wonderOnFor(L.findStudent(L.setStudentWonder(added, 'S-2', true), 'S-2')));
    ok('Wonder questions are on for a student added without saying', L.wonderOnFor(L.findStudent(added, 'S-1042')));
  }
  // My Classroom order: youngest band first, then by name, unless an educator has dragged the cards.
  { const mk = (label, level, order) => ({ id: label.toLowerCase(), label, level, active: true, ...(order === undefined ? {} : { order }) });
    const list = [mk('Zed', 'early'), mk('Amy', 'middle'), mk('Bob', 'early'), mk('Cal', 'elementary')];
    ok('the classroom sorts by band, then name', L.classroomOrder(list).map((s) => s.label).join(' ') === 'Bob Zed Cal Amy');
    const dragged = L.setClassroomOrder({ version: 1, students: list }, ['cal', 'zed', 'bob', 'amy']).students;
    ok('a dragged order is kept, and a new student joins at the end', L.classroomOrder([...dragged, mk('New', 'early')]).map((s) => s.label).join(' ') === 'Cal Zed Bob Amy New');
  }
  r = L.addStudent(r, 'S-2001', 't', { level: 'elementary' }).roster;
  ok('renaming keeps the id, so progress cannot be lost', L.renameStudent(r, 'S-1042', 'Sam R.').roster.students[0].id === 's_1042' && L.renameStudent(r, 'S-1042', 'Sam R.').roster.students[0].label === 'Sam R.');
  ok('a blank name is refused', L.renameStudent(r, 'S-1042', ' ').error !== null);
  ok('a name of thirty characters fits', L.renameStudent(r, 'S-1042', 'Very Very Long Name (Grade 3)!').error === null && L.NAME_MAX === 30);
  ok('pre-K 3 has the two magic words as a module', L.getModule('please-and-thank-you') && L.generateQuestion('pk3-magic-word', 3).choices.length === 2);
  // Grade 7 carries every one of the TEKS 7.1B significant dates somewhere in its questions.
  { const years = new Set(); for (const m of L.getCourse('history-7').modules) for (const g of new Set(m.generators)) for (let seed = 1; seed <= 60; seed++) { const q = L.generateQuestion(g, seed); for (const y of (JSON.stringify([q.story, q.answer, q.choices]).match(/\b1[5-9]\d\d\b/g) || [])) years.add(y); }
    ok('grade 7 asks about all eight 7.1B dates: 1519, 1718, 1821, 1836, 1845, 1861, 1876, 1901', ['1519', '1718', '1821', '1836', '1845', '1861', '1876', '1901'].every((y) => years.has(y))); }
  // The same holds where the TEKS name points of reference: grade 8 (8.1B) and US history since 1877 (11.2B).
  { const yearsOf = (cid) => { const years = new Set(); for (const m of L.getCourse(cid).modules) for (const g of new Set(m.generators)) for (let seed = 1; seed <= 60; seed++) { const q = L.generateQuestion(g, seed); for (const y of (JSON.stringify([q.story, q.answer, q.choices]).match(/\b1[5-9]\d\d\b|\b20[0-2]\d\b/g) || [])) years.add(y); } return years; };
    const y8 = yearsOf('history-8'); const y11 = yearsOf('history-11');
    ok('grade 8 asks about all six 8.1B dates: 1607, 1620, 1776, 1787, 1803, 1861', ['1607', '1620', '1776', '1787', '1803', '1861'].every((y) => y8.has(y)));
    ok('grade 11 asks about all ten 11.2B turning points', ['1898', '1914', '1918', '1929', '1939', '1945', '1957', '1968', '1969', '1991', '2001', '2008'].every((y) => y11.has(y)));
    const y10 = new Set(); for (const m of L.getCourse('history-10').modules) for (const g of new Set(m.generators)) for (let seed = 1; seed <= 60; seed++) { const q = L.generateQuestion(g, seed); for (const y of (JSON.stringify([q.story, q.answer, q.choices]).match(/\b\d{3,4}\b/g) || [])) y10.add(y); }
    ok('grade 10 asks about a turn in every TEKS period: river valleys, classical, post-classical, connecting hemispheres, revolutions, the twentieth century', ['8000', '509', '476', '1347', '1492', '1760', '1914'].every((y) => y10.has(y))); }
  ok('every course with reference dates exists and lists at least six', Object.entries(L.REFERENCE_DATES).every(([cid, list]) => L.getCourse(cid) && list.length >= 6));
  ok('a name of thirty-one characters is refused with a plain sentence', L.renameStudent(r, 'S-1042', 'A'.repeat(31)).error === 'Names can be up to 30 characters.');
  ok('the same cap holds when a student is added', L.addStudent(r, 'B'.repeat(31), 't', { level: 'elementary' }).error === 'Names can be up to 30 characters.' && L.addStudent(r, 'B'.repeat(30), 't', { level: 'elementary' }).error === null);
  ok('subjects sort Math, Reading, Writing, Science, History, then the rest', L.sortSubjects(['History', 'Science', 'Art', 'Math', 'Writing', 'Reading', 'Math']).join(',') === 'Math,Reading,Writing,Science,History,Art');
  const hidden = L.setStudentActive(r, 'S-2001', false);
  ok('deactivating hides a student without deleting them', L.activeStudents(hidden).length === 1 && hidden.students.length === 2);
  const merged = L.mergeStudents(r, 'S-1042', 'S-2001');
  ok('merging keeps one student and marks the other', L.activeStudents(merged.roster).length === 1 && L.findStudent(merged.roster, 'S-2001').mergedInto === 's_1042');
  ok('merging a student with itself is refused', L.mergeStudents(r, 'S-1042', 'S-1042').error !== null);
  const a = [{ type: 'lesson_viewed', at: '2026-01-02T00:00:00.000Z', moduleId: 'x' }];
  const b = [{ type: 'lesson_viewed', at: '2026-01-01T00:00:00.000Z', moduleId: 'y' }];
  ok('merged event logs stay in time order and lose nothing', JSON.stringify(L.mergeEventLogs(a, b).map((e) => e.moduleId)) === '["y","x"]');
  // Starting levels and pictures
  ok('there are four starting levels covering pre-K to college', L.LEVELS.length === 4 && L.LEVELS[0].grades.includes('PK3') && L.LEVELS[3].grades.includes('C'));
  ok('only the early years ask for a picture', L.LEVELS.filter((l) => l.picture).map((l) => l.id).join() === 'early');
  const young = L.addStudent(L.emptyRoster(), 'S-9', 't', { level: 'early', picture: 'fox' }).roster.students[0];
  ok('a student can be added with a level and a picture', young.level === 'early' && young.picture === 'fox');
  ok('an unknown level is refused, a level is required', L.addStudent(L.emptyRoster(), 'S-8', 't', { level: 'genius' }).error === 'Choose a starting level first.');
  ok('an unknown picture is dropped rather than stored', L.addStudent(L.emptyRoster(), 'S-8', 't', { level: 'middle', picture: 'selfie.jpg' }).roster.students[0].picture === null);
  ok('a backup file name names the device, the count, the date and the time', /^wise-human-ipad-3-12-students-\d{1,2}-\d{1,2}-2026-\d{1,2}-\d{2}(am|pm)\.json$/.test(L.backupFileName('iPad 3', 12, '2026-09-10T15:00:00.000Z')));
  ok('a backup file says when it was saved in plain words, in the device\'s own time zone', /^[A-Z][a-z]+day, [A-Z][a-z]+ \d{1,2}, \d{4} at \d{1,2}:\d{2} [AP]M .+/.test(L.describeMoment('2026-09-12T05:35:00.000Z')) && L.buildBackup({ roster: { students: [] }, records: [], wonderReview: null, covered: [], deviceName: 'x', recovery: null }, '2026-09-12T05:35:00.000Z').saved === L.describeMoment('2026-09-12T05:35:00.000Z'));
  ok('the stamp reads month, day, year, then the time', L.backupStamp(new Date(2026, 8, 11, 22, 43).toISOString()) === '9-11-2026-10-43pm' && L.backupStamp(new Date(2026, 0, 5, 0, 7).toISOString()) === '1-5-2026-12-07am');
  ok('a missing device name still gives a sensible file name', /^wise-human-device-1-student-/.test(L.backupFileName('', 1, '2026-09-10T15:00:00.000Z')));
  ok('pictures are a fixed drawn set, never an upload', L.PICTURES.length === 12 && L.PICTURES.every((p) => /^[a-z]+$/.test(p)));
  ok('twelve animals and six colours give seventy-two pictures', L.PICTURES.length * L.TINTS.length === 72);
  let big = L.emptyRoster();
  for (let i = 0; i < 30; i++) { const f = L.firstFreePicture(big); big = L.addStudent(big, `K-${i}`, 't', { level: 'early', picture: f.picture, tint: f.tint }).roster; }
  const keys = big.students.map((st) => `${st.picture}:${st.tint}`);
  ok('thirty young students can each have a different picture', new Set(keys).size === 30);
  ok('a picture in use is reported as in use', L.pictureInUse(big, big.students[0].picture, big.students[0].tint) === true);
  ok('a hidden student frees their picture', L.pictureInUse(L.setStudentActive(big, 'K-0', false), big.students[0].picture, big.students[0].tint) === false);
  ok('a picture always carries a colour', big.students.every((st) => L.tintFor(st.tint) !== null));
  const withPic = L.setStudentPicture(L.addStudent(L.emptyRoster(), 'S-7', 't', { level: 'elementary' }).roster, 'S-7', 'owl');
  ok('a picture can be added later, with a default colour', L.findStudent(withPic, 'S-7').picture === 'owl' && L.findStudent(withPic, 'S-7').tint === 'sun');
  ok('a picture can be removed again', L.findStudent(L.setStudentPicture(withPic, 'S-7', null), 'S-7').picture === null);
  ok('a level narrows recommendations to its band', JSON.stringify(L.recommendedCourseIds([L.makeCoursesEnabledEvent([], 't')], 'early')) === '["first-steps-pk","first-sounds-pk"]');
  // The band under a name on the login screen only moves up when everything below it is mastered.
  { const early = L.getCourse('counting-k').modules.map((m) => m.id);
    const assigned = [L.makeCoursesEnabledEvent(['counting-k', 'fractions-intro'], '2026-09-15T09:00:00.000Z')];
    ok('a student with early years work unfinished reads Early years', L.bandTitle(assigned) === 'Early years');
    // Two clean passes on different days master a module; the same for every early years module.
    const pass = (id, at) => ({ type: 'attempt_completed', at, startedAt: at, moduleId: id, seed: 1, core: Array.from({ length: L.moduleRules(id).questions }, () => ({ correct: true, timeMs: 9000 })), review: null, coreCorrect: L.moduleRules(id).questions, coreTotal: L.moduleRules(id).questions });
    const finished = [...assigned, ...early.flatMap((id, i) => [pass(id, `2026-09-${10 + (i % 5)}T10:00:00.000Z`), pass(id, `2026-09-${20 + (i % 5)}T10:00:00.000Z`)])];
    ok('it reads Elementary once every early years module is mastered', L.bandTitle(finished) === 'Elementary');
    ok('a student with no early years work assigned reads Elementary at once', L.bandTitle([L.makeCoursesEnabledEvent(['fractions-intro'], 't')]) === 'Elementary');
    ok('the college course reads College, and nothing assigned reads nothing', L.bandTitle([L.makeCoursesEnabledEvent(['history-college'], 't')]) === 'College' && L.bandTitle([L.makeCoursesEnabledEvent([], 't')]) === ''); }
  // Coloring is play: one picture from the start, another for every course finished, and it is never a module.
  { const ev = [L.makeCoursesEnabledEvent(['counting-k'], '2026-09-15T09:00:00.000Z')];
    ok('one coloring picture is there from the start', L.coloringUnlocked(ev) === 1);
    const passes = L.getCourse('counting-k').modules.flatMap((m, i) => { const at = `2026-09-${10 + (i % 5)}T10:00:00.000Z`; const n = L.moduleRules(m.id).questions; return [{ type: 'attempt_completed', at, startedAt: at, moduleId: m.id, seed: 1, core: Array.from({ length: n }, () => ({ correct: true, timeMs: 9000 })), review: null, coreCorrect: n, coreTotal: n }]; });
    ok('every module passed adds one', L.coloringUnlocked([...ev, ...passes]) === 1 + L.getCourse('counting-k').modules.length);
    ok('a coloring picture is never a module and never a course, and there are plenty', !L.MODULES.some((m) => L.COLORING_PICTURES.includes(m.id)) && L.COLORING_PICTURES.length >= 20 && L.COLORING_PICTURES[0] === 'ball'); }
  // A module passed today is waiting for another day: a young learner's screen sets it aside until then.
  { const n = L.moduleRules('count-to-5').questions;
    const pass = (at) => ({ type: 'attempt_completed', at, startedAt: at, moduleId: 'count-to-5', seed: 1, core: Array.from({ length: n }, () => ({ correct: true, timeMs: 9000 })), review: null, coreCorrect: n, coreTotal: n });
    const once = [L.makeCoursesEnabledEvent(['counting-k'], '2026-09-16T08:00:00.000Z'), pass('2026-09-16T09:00:00.000Z')];
    ok('a module passed today waits for another day', L.waitingForAnotherDay(once, 'count-to-5', '2026-09-16T18:00:00.000Z'));
    ok('the next day it is back to be passed again', !L.waitingForAnotherDay(once, 'count-to-5', '2026-09-17T08:00:00.000Z'));
    ok('a module never passed is not waiting, and a mastered one is done', !L.waitingForAnotherDay(once, 'count-to-10', '2026-09-16T18:00:00.000Z') && !L.waitingForAnotherDay([...once, pass('2026-09-17T09:00:00.000Z')], 'count-to-5', '2026-09-17T18:00:00.000Z')); }
  // A coloring break is noted for the educator, and stays out of progress and the transcript.
  { const ev = [L.makeCoursesEnabledEvent(['counting-k'], '2026-09-16T09:00:00.000Z'), L.makeColoredEvent('house', '2026-09-16T10:00:00.000Z'), L.makeColoredEvent('star', '2026-09-16T10:30:00.000Z')];
    ok('coloring breaks are counted for the report', L.coloringBreaks(ev) === 2 && L.buildReport('S-8', ev).coloringBreaks === 2);
    ok('a coloring break is no kind of progress', L.deriveProgress(ev).masteredIds.length === 0 && L.deriveProgress(ev).passedIds.length === 0 && L.buildReport('S-8', ev).totalAttempts === 0);
    ok('the transcript never mentions coloring', !JSON.stringify(L.buildTranscript('S-8', ev)).toLowerCase().includes('color')); }
  // Game breaks and elective stories (pass MB, Mikey): a game session leaves a played event the way a coloring break does, a
  // story read to its end again leaves a story_reread, and the report's summary carries his words for both under the coloring line.
  { const t = (h) => `2026-09-16T${String(h).padStart(2, '0')}:00:00.000Z`;
    const n = L.moduleRules('count-to-5').questions;
    const pass = (at) => ({ type: 'attempt_completed', at, startedAt: at, moduleId: 'count-to-5', seed: 1, core: Array.from({ length: n }, () => ({ correct: true, timeMs: 9000 })), review: null, coreCorrect: n, coreTotal: n });
    const base = [L.makeCoursesEnabledEvent(['counting-k'], t(8)), L.makeColoredEvent('house', t(9)), L.makePlayedEvent('dots-house', t(9)), L.makePlayedEvent('dots-kite', t(10))];
    ok('game breaks are counted for the report, and are no kind of progress and never on the transcript', L.gameBreaks(base) === 2 && L.buildReport('S-8', base).gameBreaks === 2 && L.coloringBreaks(base) === 1 && L.deriveProgress(base).masteredIds.length === 0 && !JSON.stringify(L.buildTranscript('S-8', base)).toLowerCase().includes('play'));
    ok('a first read is never elective, from a shelf or a lesson', !L.rereadIsElective(base, 'count-to-5', 'shelf') && !L.rereadIsElective(base, 'count-to-5', 'lesson') && !L.rereadIsElective(base, 'course:counting-k', 'shelf'));
    const read = [...base, L.makeStoryReadEvent('count-to-5', t(11)), L.makeStoryReadEvent('course:counting-k', t(11))];
    ok('a later read from a shelf is elective, and a course story always is', L.rereadIsElective(read, 'count-to-5', 'shelf') && L.rereadIsElective(read, 'course:counting-k', 'shelf') && L.rereadIsElective(read, 'course:counting-k', 'lesson'));
    const mastered = [...read, pass('2026-09-14T10:00:00.000Z'), pass('2026-09-15T10:00:00.000Z')].sort((a, b) => String(a.at).localeCompare(String(b.at)));
    ok('a later read on the way to practice counts only once the lesson is mastered', L.deriveProgress(mastered).masteredIds.includes('count-to-5') && !L.rereadIsElective(read, 'count-to-5', 'lesson') && L.rereadIsElective(mastered, 'count-to-5', 'lesson'));
    // A lesson a Quick Review reopened asks for its story again ("story and all"), so a read from its lesson is not elective.
    { const early = [L.makeCoursesEnabledEvent(['counting-k'], '2026-07-01T08:00:00.000Z'), L.makeStoryReadEvent('count-to-5', '2026-07-01T09:00:00.000Z'), pass('2026-07-01T10:00:00.000Z'), pass('2026-07-02T10:00:00.000Z')];
      const review = L.buildLightReview(early, 9, { moduleId: 'count-to-5', stage: 'first', missedKinds: [] });
      const reopened = review ? [...early, L.makeLightReviewEvent(review, [1, 0, 0, 0, 0].map((c) => ({ correct: !!c })), '2026-07-30T10:00:00.000Z', '2026-07-30T10:02:00.000Z')] : early;
      ok('a lesson reopened by a Quick Review takes its story as asked, not elective', !!review && L.reviewingIds(reopened).includes('count-to-5') && !L.rereadIsElective(reopened, 'count-to-5', 'lesson') && L.rereadIsElective(reopened, 'count-to-5', 'shelf')); }
    // A loop back sends the student to the lesson before, story and all, until it is passed again: that read is asked for.
    { const pre = L.prerequisitesOf('count-to-10'); const A = pre[pre.length - 1]; const nA = L.moduleRules(A).questions; const n10 = L.moduleRules('count-to-10').questions;
      const r = (id, at, right, k) => ({ type: 'attempt_completed', at, startedAt: at, moduleId: id, seed: 1, core: Array.from({ length: k }, (_, i) => ({ correct: i < right, timeMs: 9000 })), review: null, coreCorrect: right, coreTotal: k });
      const ev = [L.makeCoursesEnabledEvent(['counting-k'], '2026-09-01T08:00:00.000Z'), L.makeStoryReadEvent(A, '2026-09-01T09:00:00.000Z'), r(A, '2026-09-01T10:00:00.000Z', nA, nA), r(A, '2026-09-02T10:00:00.000Z', nA, nA), r('count-to-10', '2026-09-03T10:00:00.000Z', 0, n10), r('count-to-10', '2026-09-03T11:00:00.000Z', 0, n10), L.makeLoopBackEvent('count-to-10', A, '2026-09-03T12:00:00.000Z')];
      ok('a lesson a loop back sends the student to takes its story as asked, until it is passed again', L.loopBackTarget(ev.slice(0, -1), 'count-to-10') === A && !L.rereadIsElective(ev, A, 'lesson') && L.rereadIsElective(ev, A, 'shelf') && L.rereadIsElective([...ev, r(A, '2026-09-03T13:00:00.000Z', nA, nA)], A, 'lesson')); }
    ok('Since you last looked counts game breaks beside pictures', L.changesSince(base, t(8)).played === 2);
    const full = [...mastered, L.makeStoryRereadEvent('count-to-5', t(13)), L.makeStoryRereadEvent('course:counting-k', t(14)), L.makeStoryRereadEvent('count-to-5', t(15))];
    const lines = L.summaryPlayLines(L.buildReport('S-8', full));
    ok("the summary's play lines are the coloring line, then Mikey's game and story lines, word for word", lines.map((x) => x.key).join() === 'coloring,games,stories'
      && lines[0].text === 'Coloring breaks taken: 1. Coloring is play; it is never marked and never appears on the transcript.'
      && lines[1].text === "Game breaks taken: 2. Playing is still learning as concepts are woven into objectives but these are never marked on a student's transcript."
      && lines[2].text === "Elective stories: 3. Every module pairs with a short story and every course with a long. After these stories unlock, they're available to re-read. 3 represents how many times S-8 has read through a story more times than required.", lines);
    ok('a play or reading line with nothing to count is left out', L.summaryPlayLines(L.buildReport('S-8', [L.makeCoursesEnabledEvent(['counting-k'], t(8))])).length === 0 && L.summaryPlayLines(L.buildReport('S-8', base)).map((x) => x.key).join() === 'coloring,games');
    ok('a story is read to its end and open a while before it counts', L.STORY_REREAD_SECONDS >= 10);
    // Every read to the end of a story read before is logged as a fact, where it was opened and when (pass MB, the code check's
    // second read); whether it was more than required is worked out from the log as it stood when the story was opened, so a read
    // from a lesson not yet mastered is in the log and never counted, and the same read after mastery counts.
    { const d = (day, h) => `2026-09-${String(day).padStart(2, '0')}T${String(h).padStart(2, '0')}:00:00.000Z`;
      const ev = [L.makeCoursesEnabledEvent(['counting-k'], d(10, 8)), L.makeStoryReadEvent('count-to-5', d(10, 9)), L.makeStoryRereadEvent('count-to-5', d(10, 11), 'lesson', d(10, 10)),
        pass(d(11, 10)), pass(d(12, 10)), L.makeStoryRereadEvent('count-to-5', d(13, 11), 'lesson', d(13, 10))];
      ok('a read from a lesson before it is mastered is logged and not counted, and one after mastery counts', ev.filter((e) => e.type === 'story_reread').length === 2 && L.electiveStoryReads(ev) === 1 && L.electiveStoryReads(ev.slice(0, 3)) === 0 && ev[2].from === 'lesson' && ev[2].openedAt === d(10, 10)); }
    // Where a story is opened from is what the count rests on, so the screens are read too (the screen check's second read): the
    // lesson's View story notes 'lesson', and every shelf (Let's Read, My Stories, a finished course's Let's Read!) notes 'shelf'.
    // A read-aloud round's reward story (pass MD) notes nothing: it is always the story's first read, so it clears the watch.
    { const ui = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8'); const calls = [...ui.matchAll(/noteStoryOpen\(([^,]+), '(\w+)'\)/g)].map((m) => [m[1], m[2]]);
      ok("a lesson's View story notes its story as opened from the lesson, and every shelf as from a shelf", calls.filter(([, f]) => f === 'lesson').map(([id]) => id).join() === 'mod.id' && calls.filter(([, f]) => f === 'shelf').length >= 4 && calls.every(([, f]) => ['lesson', 'shelf'].includes(f)), calls); }
    ok('the weekly note counts the games beside the coloring', /S-8 colored a picture\./.test(L.weeklyNote('S-8', base, t(18))) && /S-8 played 2 games\./.test(L.weeklyNote('S-8', base, t(18))));
    // A game watched only through its welcome (pass MQ, Mikey's answer to Q63: "Q63 - A"): a visit closed before Begin is logged
    // with begun false, as a fact of the visit, and no count of game breaks takes it in: the report's line, Since you last looked
    // and the weekly note. A visit logged before pass MQ has no begun and counts as it always did. The cases are sharp enough to
    // catch the two near misses beside them: a count that ignores begun, and one that also drops the old visits that never had it.
    { const welcomeOnly = [...base, L.makePlayedEvent('dots-kite', t(11), false)];
      const oldVisit = [...base, { type: 'played', at: t(12), game: 'dots-house' }];
      ok('a game closed before Begin is logged with begun false and counted in no game break (Q63)', welcomeOnly[welcomeOnly.length - 1].begun === false && L.makePlayedEvent('dots-kite', t(11)).begun === true
        && L.gameBreaks(welcomeOnly) === 2 && L.buildReport('S-8', welcomeOnly).gameBreaks === 2 && L.changesSince(welcomeOnly, t(8)).played === 2 && /S-8 played 2 games\./.test(L.weeklyNote('S-8', welcomeOnly, t(18))),
        { breaks: L.gameBreaks(welcomeOnly), since: L.changesSince(welcomeOnly, t(8)).played });
      ok('a game visit logged before pass MQ, with no begun, still counts as a game break', L.gameBreaks(oldVisit) === 3 && L.buildReport('S-8', oldVisit).gameBreaks === 3 && L.changesSince(oldVisit, t(8)).played === 3 && /S-8 played 3 games\./.test(L.weeklyNote('S-8', oldVisit, t(18))));
      const NEAR = { 'a count that ignores begun': (e) => !!e && e.type === 'played', 'a count that drops the old visits': (e) => !!e && e.type === 'played' && e.begun === true };
      const caught = Object.entries(NEAR).filter(([, f]) => welcomeOnly.filter(f).length !== 2 || oldVisit.filter(f).length !== 3).map(([name]) => name);
      ok('the game-break cases catch both near misses of the count, and the real count passes them', caught.length === 2 && welcomeOnly.filter(L.isGameBreak).length === 2 && oldVisit.filter(L.isGameBreak).length === 3, caught); } }
  // Pre-K is grouped by skill on the student's screen; every skill named is one the order knows.
  { const preK = L.COURSES.filter((c) => c.grade === 'PK3' || c.grade === 'PK4').flatMap((c) => c.modules);
    ok('every pre-K module names the skill it practises', preK.every((m) => m.skill && L.SKILL_ORDER.includes(m.skill)));
    const preKIds = new Set(preK.map((m) => m.id));
    ok('no other module carries a skill label', !L.MODULES.filter((m) => !preKIds.has(m.id)).some((m) => m.skill)); }
  // Every full-screen pop-up is one Overlay (pass MB, the alignment read): a hand-made fixed box centers in a page-tall frame and
  // follows the page as it scrolls on educator screens, and thirteen were missed once, so a full-screen fixed style (all four
  // sides at 0, in any order, or inset 0) anywhere but inside Overlay fails here.
  { const uiSrc = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8');
    const start = uiSrc.indexOf('function Overlay('); const end = start < 0 ? -1 : uiSrc.indexOf('\nfunction ', start + 1);
    const full = [...uiSrc.matchAll(/position: 'fixed'/g)].filter((m) => { const body = uiSrc.slice(uiSrc.lastIndexOf('{', m.index), uiSrc.indexOf('}', m.index));
      return /\binset: 0\b/.test(body) || ['top', 'right', 'bottom', 'left'].every((side) => new RegExp(`\\b${side}: 0\\b`).test(body)); });
    const outside = full.filter((m) => m.index < start || m.index > end).map((m) => uiSrc.slice(0, m.index).split('\n').length);
    ok('every full-screen pop-up is drawn by Overlay, never by a fixed box of its own (pass MB)', start > 0 && full.length >= 1 && outside.length === 0, `full-screen fixed styles outside Overlay at lines ${outside.join(', ')}`); }
  // Experiments for the youngest (pass MB, the accuracy check read all 116 early-years ideas as a careful parent would): the
  // Science Experiment Ideas page keeps its safety line, and no pre-K 3 idea uses something a three-year-old can choke on (the
  // AAP's choking list and the CPSC small-parts cylinder; foods such as nuts, grapes and popcorn stay away until four).
  { const uiSrc = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8');
    ok('the Science Experiment Ideas page keeps its safety line: balloons and small things can choke, and an inch or two of water can drown (pass MB)', /data-experiments-safety[^>]*>[^<]*balloons can choke[^<]*inch or two of water/.test(uiSrc));
    const choke = /\b(coins?|pennies|penny|buttons?|corks?|pebbles?|marbles?|beads?|raisins?|grapes?|popcorn|peanuts?|nuts?|balloons?|small toys?)\b/i;
    const sized = /\b(?:small|smaller|little|tiny|mini)\s+(?:\w+\s+)?(?:blocks?|cubes?|toys?|balls?|rocks?|stones?|shapes?|pieces?|cars?|animals?)\b/i;   // small things must say they are too big to swallow (pass MF, the second read)
    const bad = L.experimentsFor('PK3').filter((e) => { const t = [e.title, e.ask, e.do, e.see, e.tell].filter(Boolean).join(' '); return choke.test(t) || (sized.test(t) && !(/too big to swallow|nothing small enough to swallow/i.test(t) && /toilet-paper tube/i.test(t))); }).map((e) => e.title);
    ok('no pre-K 3 experiment uses something a three-year-old can choke on (pass MB; AAP, CPSC)', L.experimentsFor('PK3').length >= 20 && bad.length === 0, bad.join(', ')); }
  // One listing for each idea (EARMARKS A12): pre-K 4 listed Rain in a Jar twice, in two wordings, until pass ML kept one. No
  // grade lists an experiment idea twice, by title or by question, but the repeats pass ML found in other grades, which wait for
  // their grades' reviews; the list only falls, so a repeat that is fixed and still listed fails too.
  { const WAITING = ['2:what does rain do to a hill?', '4:electromagnet', '4:water filter', '4:what did the owl eat?', '9:transpiration bags', '9:can you see dna?', '10:electrolysis of water', '10:conservation of mass', '10:which solutions conduct?', '11:projectile range', "11:hooke's law", '11:how fast is sound?', '12:half-life with coins', '12:star brightness and distance', '12:why do far stars look dim?'];
    const twice = []; for (const [g, list] of Object.entries(L.EXPERIMENTS)) for (const f of ['title', 'ask']) { const seen = new Set(); for (const e of list) { const k = `${g}:${e[f].toLowerCase()}`; if (seen.has(k) && !twice.includes(k)) twice.push(k); seen.add(k); } }
    ok('no grade lists one experiment idea twice, by title or by question, but the repeats waiting for their grades\' reviews, a list that only falls (EARMARKS A12)', twice.every((k) => WAITING.includes(k)) && WAITING.every((k) => twice.includes(k)) && L.experimentsFor('PK4').filter((e) => e.title === 'Rain in a jar').length === 1, twice.filter((k) => !WAITING.includes(k)).concat(WAITING.filter((k) => !twice.includes(k)).map((k) => 'fixed: ' + k)).join(', '));
    // Near repeats found by reading (pass ML, the final read): one idea under two titles with two questions, which the exact
    // match above cannot see. They wait for their grades' reviews too, and the list only falls: once one of a pair is gone,
    // take the pair off the list.
    const NEAR = [['10', 'Reaction rate and surface area', 'Rate and surface area'], ['11', "Ohm's law on the table", "Ohm's law"], ['12', 'Albedo test', 'Albedo']];
    const gone = NEAR.filter(([g, a, b]) => !(L.EXPERIMENTS[g] || []).some((e) => e.title === a) || !(L.EXPERIMENTS[g] || []).some((e) => e.title === b));
    ok('the near repeats found by reading, one idea under two titles, wait for their grades\' reviews, a second list that only falls (EARMARKS A12)', gone.length === 0, gone.map(([g, a, b]) => `fixed: ${g} ${a} / ${b}`).join(', ')); }
  // Red against green, every pre-K 3 kind (pass MB, the alignment read's second read): where only the color tells a wrong choice
  // from the answer, the two are never red and green, the most common color vision deficiency (MedlinePlus). Every pre-K 3
  // generator is sampled, so a new kind is held too; a question that asks for a color by its name is exempt (RULES-AUDIT 6).
  { const strip = (x) => String(x).replace(/red|green|blue|yellow/g, 'C').split('#')[0];
    const gens = [...new Set(L.COURSES.filter((c) => c.grade === 'PK3').flatMap((c) => c.modules).flatMap((m) => m.generators))];
    const bad = gens.filter((g) => { for (let s = 1; s <= 300; s += 1) { const q = L.generateQuestion(g, s);
      if (/\b(red|blue|yellow|green)\b|what color/i.test(q.prompt || '')) continue;
      const a = String(q.answer); const ac = (a.match(/red|green/) || [])[0]; if (!ac) continue;
      if ((q.choices || []).some((w) => w !== a && strip(w) === strip(a) && /red|green/.test(w) && !w.includes(ac))) return true; } return false; });
    ok('no pre-K 3 kind sets red against green where color alone decides (pass MB; asking for a color by its name is exempt)', gens.length >= 40 && bad.length === 0, bad.join(', ')); }
  { const strip = (x) => String(x).replace(/red|green|blue|yellow/g, 'C').split('#')[0];
    const NAMING = ['pc-tap-colour', 'pc-name-colour', 'pc-colour-of-thing']; const BY_COLOR = ['pc-same-colour', 'pc-different-colour'];
    const gens = [...new Set(L.COURSES.filter((c) => c.grade === 'PK4').flatMap((c) => c.modules).flatMap((m) => m.generators))].filter((g) => !NAMING.includes(g));
    const bad = gens.filter((g) => { for (let s = 1; s <= 3000; s += 1) { const q = L.generateQuestion(g, s); const a = String(q.answer); const cs = (q.choices || []).map(String);
      if (BY_COLOR.includes(g)) { const cols = cs.map((w) => (w.match(/red|green|blue|yellow/) || [])[0]); if (cols.includes('red') && cols.includes('green')) return true; continue; }
      const ac = (a.match(/red|green/) || [])[0]; if (!ac) continue;
      if (cs.some((w) => w !== a && strip(w) === strip(a) && /red|green/.test(w) && !w.includes(ac))) return true; } return false; });
    ok('no pre-K 4 kind sets red against green where color alone decides (EARMARKS A11, pass ML; asking for a color by its name is exempt)', gens.length >= 40 && bad.length === 0, bad.join(', ')); }
  ok('an elective is never recommended, only offered under other courses', !L.recommendedCourseIds([L.makeCoursesEnabledEvent([], 't')], 'elementary').some((id) => L.getCourse(id).elective) && L.COURSES.some((c) => c.elective));
  ok('a high school student starts on the grade 9 courses', JSON.stringify(L.recommendedCourseIds([L.makeCoursesEnabledEvent([], 't')], 'high')) === '["history-9","math-9","reading-9","science-9","writing-9"]');
  ok('the letters course and now the counting course both have a touch module', L.courseNeedsTouch('letters-k') === true && L.courseNeedsTouch('counting-k') === true && L.courseNeedsTouch('fractions-intro') === false);
  ok('a wobbly hand passes, a wrong letter and a scribble do not', L.traceMatches('L', [[[34, 16], [31, 42], [28, 63], [33, 84]], [[31, 88], [52, 83], [74, 86]]]) && !L.traceMatches('L', [[[30, 15], [75, 15]], [[50, 15], [50, 85]]]) && !L.traceMatches('L', [Array.from({ length: 80 }, (_, i) => [(i * 37) % 100, (i * 53) % 100])]));
  // Q49, Mikey's answer in pass MN ("Q49 - Your recommendation "): one line's dot and arrow at a time everywhere, and from kindergarten
  // up a line traced from its end back to its start is cleared and does not count. Every shape is traced the ways a child traces it,
  // finger points 1.5 units apart and rounded as the pad keeps them, with a slow wobble of 0, 3 and 5 units (a finger off its guide):
  // forward line by line, the whole shape in one stroke of the finger, the next line begun by going back along the last as n, m and
  // h go back up their stem, the lines in another order, a line begun before its dot and run past its end, and a line colored back
  // and forth; none may ever be cleared or fail. Each line traced from its end alone (with no wobble, where the reading is exact)
  // must be cleared, wherever the line is long enough to judge.
  { const pts = (st) => { const out = [st[0].slice()]; for (let i = 1; i < st.length; i++) { const [a, b] = [st[i - 1], st[i]]; const n = Math.max(2, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 1.5)); for (let k = 1; k <= n; k++) out.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n]); } return out; };
    const wob = (p, amp, ph) => p.map(([x, y], i) => [Math.round(x + amp * Math.sin(i / 7 + ph)), Math.round(y + amp * Math.sin(i / 9 + 2 * ph))]);
    const line = (a, b) => pts([a, b]).slice(1, -1);
    const shapes = Object.keys(L.TRACE_LETTERS).filter((k) => !L.TRACE_LETTERS[k].dots);
    const lifts = (k, paths) => { const kept = []; for (const p of paths) { const st = L.traceDirections(k, [...kept, p]); if (st.lastLineBackward) return false; kept.push(p); } return !L.traceDirections(k, kept).backwardOnly.some(Boolean); };
    const cleared = []; const missed = []; let tried = 0;
    for (const k of shapes) {
      const def = L.TRACE_LETTERS[k]; const fw = def.strokes.map(pts);
      const startsOn = (i) => i > 0 && fw[i - 1].some((q) => Math.hypot(q[0] - fw[i][0][0], q[1] - fw[i][0][1]) < 3);
      const back = (i) => { const prev = fw[i - 1]; let at = 0; prev.forEach((q, j) => { if (Math.hypot(q[0] - fw[i][0][0], q[1] - fw[i][0][1]) < Math.hypot(prev[at][0] - fw[i][0][0], prev[at][1] - fw[i][0][1])) at = j; }); return prev.slice(at).reverse(); };
      for (const [amp, ph] of [[0, 0], [3, 0.4], [3, 2.1], [5, 1.3], [5, 4.0]]) {
        const ways = { separate: fw, otherOrder: fw.slice().reverse(), overshoot: fw.map((p) => { const e = (a, b) => [a[0] + (a[0] - b[0]) * 1.2, a[1] + (a[1] - b[1]) * 1.2]; return [e(p[0], p[Math.min(3, p.length - 1)]), ...p, e(p[p.length - 1], p[Math.max(0, p.length - 4)])]; }), backAndForth: fw.map((p) => [...p, ...p.slice().reverse(), ...p]) };
        if (fw.length > 1) { const one = []; fw.forEach((p) => { if (one.length) one.push(...line(one[one.length - 1], p[0])); one.push(...p); }); ways.oneStroke = [one];
          const ret = fw.map((p, i) => (startsOn(i) ? [...back(i), ...p] : p)); ways.retrace = ret; ways.retraceOneStroke = [ret.flat()]; }
        for (const [way, paths] of Object.entries(ways)) { tried++; if (!lifts(k, paths.map((p) => wob(p, amp, ph)))) cleared.push(`${k} ${way} ${amp}`); }
      }
      // each line reversed alone, the lines before it traced forward: the reversed line, and only it, is cleared as its finger lifts
      def.strokes.forEach((_, r) => { const rev = fw.map((p, i) => (i === r ? p.slice().reverse() : p)).map((p) => wob(p, 0, 0)); const kept = []; let at = -1;
        for (let i = 0; i < rev.length; i++) { if (L.traceDirections(k, [...kept, rev[i]]).lastLineBackward) { at = i; break; } kept.push(rev[i]); }
        const want = /^(i|j) line 2$|^u line 2$/.test(`${k} line ${r + 1}`) ? -1 : r; if (at !== want) missed.push(`${k} line ${r + 1}: ${at < 0 ? 'not cleared' : `cleared line ${at + 1}`}`); });
    }
    ok(`Q49: no forward trace of any shape is ever cleared or fails, in seven ways and five wobbles (${tried} traces of ${shapes.length} shapes)`, tried > 1500 && cleared.length === 0, cleared.slice(0, 8).join(', '));
    // A line too short to judge (the dot of i or j) and u's second line, whose judged part is the 5 units below where it runs back over
    // its first, are never judged; every other line traced from its end is.
    ok('Q49: every line long enough to judge, traced from its end back to its start, is cleared as the finger lifts, and no other (the dot of i and j and the end of u never are)', missed.length === 0, missed.slice(0, 10).join(', '));
    ok('Q49: the words a cleared line hears, which name the arrow, since a closed line traced the other way starts at its dot (round one\'s screen check)', L.TRACE_BACK_WORDS === 'Start at the green dot and follow the arrow.');
    // One line's dot at a time: the pad shows the first line not yet traced, and none once all are.
    const order = shapes.every((k) => { const fw = L.TRACE_LETTERS[k].strokes.map(pts); if (L.traceLineState(k, []).next !== 0) return false; for (let i = 0; i < fw.length; i++) if (L.traceLineState(k, fw.slice(0, i + 1)).next !== (i + 1 < fw.length ? i + 1 : -1)) return false; return true; });
    ok('Q49: the pad shows the first line not yet traced, line by line, and no dot once every line is traced', order);
    // T traced with its stem from the bottom: pre-K's check passes it (the order and direction are guided, never failed), a
    // kindergarten check does not; the connect-the-dots rule is untouched.
    const tUp = [pts([[50, 85], [50, 15]]), pts([[20, 15], [80, 15]])];
    ok('Q49: a line traced only from its end fails from kindergarten up and passes in pre-K', L.traceMatches('T', tUp) && !L.traceMatches('T', tUp, 14, { direction: true }) && L.traceMatches('T', [pts([[50, 15], [50, 85]]), pts([[20, 15], [80, 15]])], 14, { direction: true }));
    // The rule goes by the module a question comes from: Draw the shapes (pre-K 4) and Tracing shapes (kindergarten) share their bank.
    const pk = L.buildAttempt('draw-the-shapes', 3, []).core; const kk = L.buildAttempt('tracing-shapes', 3, []).core; const g1 = L.buildAttempt('writing-numbers', 3, []).core; const dots = L.buildAttempt('connect-the-dots', 3, []).core;
    const flagged = (core) => core.filter((q) => q.type === 'trace').every((q) => q.checkDirection === true);
    ok('Q49: a trace from kindergarten up carries the direction rule, and a pre-K trace or a connect-the-dots picture does not, whichever bank it comes from', flagged(kk) && flagged(g1) && pk.every((q) => !q.checkDirection) && dots.every((q) => !q.checkDirection) && L.traceChecksDirection('tracing-letters') && !L.traceChecksDirection('first-letter-tracing'));
    const kq = kk.find((q) => q.answer === 'shape-square') || L.moduleQuestion('kn-trace-shape', 1, 'tracing-shapes'); const sq = L.TRACE_LETTERS[kq.answer].strokes.map(pts);
    ok('Q49: checkAnswer reads the question\'s own rule: a shape traced the other way round fails from kindergarten up and passes in pre-K', L.checkAnswer(kq, JSON.stringify(sq)) && !L.checkAnswer(kq, JSON.stringify(sq.map((p) => p.slice().reverse()))) && L.checkAnswer({ ...kq, checkDirection: undefined }, JSON.stringify(sq.map((p) => p.slice().reverse()))));
    // And every builder makes its questions as their module asks them: a memory check, a Quick Review and a checkpoint from a
    // kindergarten tracing lesson carry the rule too.
    const lr = L.buildLightReview([], 5, { moduleId: 'tracing-letters', stage: 'first', missedKinds: [] });
    ok('Q49: a Quick Review of a kindergarten tracing lesson carries the rule on every trace', lr && lr.core.filter((q) => q.type === 'trace').length >= 2 && flagged(lr.core)); }
  // Q49 at a finger's paces (pass MN, round one's code check). The pad keeps a finger's points as they come: about 1.5 units apart when
  // a child goes slowly, 3 at an ordinary pace (about 480 pixels a second on a 320-pixel pad) and 12 or more on a flick, and a finger
  // jitters point by point rather than in one smooth sway. At one pace with a smooth sway the checks above passed three faults: one
  // lap of a closed shape could read as no lap at all (O traced round and back over itself was cleared, and failed), a line traced
  // from its end at an ordinary pace or a flick passed (k's slant at 3 units, z's top line at 5, T's stem flicked upward), and the
  // pad's next dot stuck on eleven shapes (E showed its top bar's dot after each of its lines). Every shape is traced again at four
  // paces, each point jittered by up to two units from a seeded draw, line by line and there and back.
  { const seeded = (n) => { let s = n >>> 0; return () => { s = (Math.imul(s, 1103515245) + 12345) >>> 0; return s / 4294967296; }; };
    const at = (st, sp) => { const out = [st[0].slice()]; for (let i = 1; i < st.length; i++) { const [a, b] = [st[i - 1], st[i]]; const n = Math.max(2, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / sp)); for (let k = 1; k <= n; k++) out.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n]); } return out; };
    const jit = (p, amp, rnd) => p.map(([x, y]) => [Math.round(x + (rnd() * 2 - 1) * amp), Math.round(y + (rnd() * 2 - 1) * amp)]);
    const exact = (p) => p.map(([x, y]) => [Math.round(x), Math.round(y)]);
    const shapes = Object.keys(L.TRACE_LETTERS).filter((k) => !L.TRACE_LETTERS[k].dots);
    const lifts = (k, paths) => { const kept = []; for (const p of paths) { if (L.traceDirections(k, [...kept, p]).lastLineBackward) return false; kept.push(p); } return !L.traceDirections(k, kept).backwardOnly.some(Boolean); };
    const cleared = []; let tried = 0;
    for (const k of shapes) for (const sp of [1.5, 3, 5, 8]) for (let t = 0; t < 3; t++) { const rnd = seeded(7919 * Math.round(sp * 10) + 31 * t + k.charCodeAt(0)); const fw = L.TRACE_LETTERS[k].strokes.map((st) => at(st, sp));
      for (const [way, paths] of Object.entries({ separate: fw, thereAndBack: fw.map((p) => [...p, ...p.slice().reverse()]) })) { tried++; if (!lifts(k, paths.map((p) => jit(p, 2, rnd)))) cleared.push(`${k} ${way} ${sp}`); } }
    ok(`Q49 at four paces: no forward trace, line by line or there and back with every point jittered, is ever cleared or fails (${tried} traces of ${shapes.length} shapes at 1.5, 3, 5 and 8 units a point)`, tried >= 1700 && cleared.length === 0, cleared.slice(0, 8).join(', '));
    const missed = [];
    for (const sp of [1.5, 3, 5, 13]) for (const k of shapes) { const def = L.TRACE_LETTERS[k]; const fw = def.strokes.map((st) => exact(at(st, sp)));
      def.strokes.forEach((_, r) => { const rev = fw.map((p, i) => (i === r ? p.slice().reverse() : p)); const kept = []; let hit = -1;
        for (let i = 0; i < rev.length; i++) { if (L.traceDirections(k, [...kept, rev[i]]).lastLineBackward) { hit = i; break; } kept.push(rev[i]); }
        const want = /^(i|j) line 2$|^u line 2$/.test(`${k} line ${r + 1}`) ? -1 : r; if (hit !== want) missed.push(`${sp}: ${k} line ${r + 1}`); }); }
    ok('Q49 at four paces: every line long enough to judge, traced from its end at 1.5, 3, 5 or 13 units a point, is cleared as the finger lifts, and no other line is', missed.length === 0, missed.slice(0, 10).join(', '));
    const stuck = [];
    for (const sp of [1.5, 3, 4, 8]) for (const k of shapes) { const fw = L.TRACE_LETTERS[k].strokes.map((st) => exact(at(st, sp)));
      for (let i = 0; i < fw.length; i++) if (L.traceLineState(k, fw.slice(0, i + 1)).next !== (i + 1 < fw.length ? i + 1 : -1)) { stuck.push(`${sp}: ${k} after line ${i + 1}`); break; } }
    ok("Q49 at four paces: the pad's next dot moves on as each line is traced, at 1.5, 3, 4 and 8 units a point", stuck.length === 0, stuck.slice(0, 10).join(', '));
    // A smooth sway across the line, as a child's finger moves along the guide it sees (round two's code check: per-point jitter on
    // the line through a stroke's points never cuts a corner, and it passed even at 16 units, while a sway of four or five units along
    // the drawn curve, at a star's or a W's sharp corners, split a forward line into pieces none of which reached half, so it was
    // cleared; and without tracePieces' whole-run hand-over a flick there and back on 4 or p was cleared). The guide is the pad's own
    // curve (strokeSegments), walked at a pace, swayed, and rounded as the pad keeps a finger's points.
    const sway = (p, amp, period, phase) => { let s = 0; return p.map(([x, y], i) => { if (i > 0) s += Math.hypot(x - p[i - 1][0], y - p[i - 1][1]); const a = p[Math.max(0, i - 1)]; const b = p[Math.min(p.length - 1, i + 1)]; const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; const off = amp * Math.sin(phase + (2 * Math.PI * s) / period); return [x - ((b[1] - a[1]) / len) * off, y + ((b[0] - a[0]) / len) * off]; }); };
    const guidePts = (k, i, sp) => { const def = L.TRACE_LETTERS[k]; const dense = [def.strokes[i][0].slice()];
      for (const [p0, c1, c2, p1] of L.strokeSegments(def.strokes[i], L.cornersOf(def, i))) { const n = Math.max(4, Math.ceil(Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) * 5));
        for (let j = 1; j <= n; j++) { const t = j / n; const u = 1 - t; dense.push(c1 ? [0, 1].map((d) => u * u * u * p0[d] + 3 * u * u * t * c1[d] + 3 * u * t * t * c2[d] + t * t * t * p1[d]) : [p0[0] + (p1[0] - p0[0]) * t, p0[1] + (p1[1] - p0[1]) * t]); } }
      const out = [dense[0]]; let acc = 0; for (let j = 1; j < dense.length; j++) { acc += Math.hypot(dense[j][0] - dense[j - 1][0], dense[j][1] - dense[j - 1][1]); if (acc >= sp) { out.push(dense[j]); acc = 0; } } if (acc > 0) out.push(dense[dense.length - 1]); return out; };
    const swayed = []; let swTried = 0;
    for (const [amp, jitter, paces] of [[5, 0, [1.5, 3, 5, 8, 12, 16]], [4, 2, [8, 12, 16]]]) for (const k of shapes) for (const sp of paces) for (let t = 0; t < 4; t++) {
      const rnd = seeded(104729 * Math.round(sp * 10) + 97 * t + k.charCodeAt(0) * 13 + (k.length > 1 ? k.charCodeAt(1) : 0)); const jr = seeded(7 + t * 31 + Math.round(sp * 7));
      const fw = L.TRACE_LETTERS[k].strokes.map((_, i) => guidePts(k, i, sp)); const period = 25 + Math.floor(rnd() * 40); const phase = rnd() * Math.PI * 2;
      const ways = { thereAndBack: fw.map((p) => [...p, ...p.slice().reverse()]), backAndForth: fw.map((p) => { const n = p.length; return [...p.slice(0, Math.max(2, Math.round(n * 0.7))), ...p.slice(Math.round(n * 0.15), Math.round(n * 0.7)).reverse(), ...p.slice(Math.round(n * 0.15))]; }) };
      for (const [way, paths] of Object.entries(ways)) { swTried++; if (!lifts(k, paths.map((p) => sway(p, amp, period, phase).map(([x, y]) => [Math.round(x + (jr() * 2 - 1) * jitter), Math.round(y + (jr() * 2 - 1) * jitter)])))) swayed.push(`${k} ${way} ${sp} sway ${amp}`); } }
    ok(`Q49 with a child's sway along the drawn guide: no forward trace, there and back or colored back and forth, swaying five units (or four with jitter at a quick finger's pace), is ever cleared or fails (${swTried} traces at 1.5 to 16 units a point)`, swTried >= 5000 && swayed.length === 0, swayed.slice(0, 8).join(', '));
    const stuckSway = [];
    for (const sp of [8, 12, 16]) for (const k of shapes) for (let t = 0; t < 5; t++) { const rnd = seeded(15485863 + 101 * t + 7 * sp + k.charCodeAt(0) * 7 + (k.length > 1 ? k.charCodeAt(1) : 0)); const period = 25 + Math.floor(rnd() * 40); const phase = rnd() * Math.PI * 2;
      const fw = L.TRACE_LETTERS[k].strokes.map((st) => sway(at(st, sp), 3, period, phase).map(([x, y]) => [Math.round(x), Math.round(y)]));
      for (let i = 0; i < fw.length; i++) if (L.traceLineState(k, fw.slice(0, i + 1)).next !== (i + 1 < fw.length ? i + 1 : -1)) { stuckSway.push(`${sp}: ${k} after line ${i + 1}`); break; } }
    ok("Q49 with a child's sway: the pad's next dot moves on as each line is traced with a three-unit sway at 8, 12 and 16 units a point", stuckSway.length === 0, stuckSway.slice(0, 10).join(', '));
    // A finger that rests on its touch-down repeats its first point, and the lines that share the dot are told apart by its first move
    // past the rest (round four's code read: 4's stem, there and back at 18 units a point from the dot it shares with the slant, was
    // read as the slant and cleared once the first point came twice).
    { const rested = []; let restTried = 0;
      // ...and a rest a unit over, which the pad's whole units can report (round five's code read: 4's stem went to its slant again).
      const RESTS = [[], [[0, 0]], [[0, 0], [0, 0]], [[0, 0], [0, 0], [0, 0], [0, 0]], ...[[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1], [2, 0], [-2, -1], [2, -2], [1, -3]].map((o) => [[0, 0], o])];   // a unit over, and since round six two or three (a rule cut at 1.5 or 2 units passed one-unit rests)
      for (const k of ['4', 'E', 'F', 'A', 'N', 'M', 'B', 'D', 'P', 'R', 'p']) for (const sp of [14, 16, 18, 20, 24]) for (const [ri, rest] of RESTS.entries()) { restTried++;
        const paths = L.TRACE_LETTERS[k].strokes.map((st) => { const p = exact(at(st, sp)); const tb = [...p, ...p.slice().reverse().slice(1)]; return [...rest.map(([dx, dy]) => [tb[0][0] + dx, tb[0][1] + dy]), ...tb]; }); if (!lifts(k, paths)) rested.push(`${k} ${sp} rest ${ri}`); }
      ok(`Q49: a touch-down on a dot two lines share goes to the line the finger moves along past a rest (${restTried} traces: 11 shapes there and back at 14 to 24 units a point, resting 0 to 4 points or one to three units over)`, restTried === 880 && rested.length === 0, rested.slice(0, 6).join(', ')); }
    // A closed line's stretches are counted once a lap: O traced the other way a third of the way or so, off the line and back over
    // the same stretch, is under half and stays (round four's code read: it read 0.55 to 0.65 and was cleared), while a whole lap the
    // other way still clears.
    { let kept = 0; let laps = 0; let tried = 0; const out = (p, r) => { const nn = Math.hypot(p[0] - 50, p[1] - 50) || 1; return [p[0] + ((p[0] - 50) / nn) * r, p[1] + ((p[1] - 50) / nn) * r]; };
      // Five paces, each point jittered by up to two units (round five's code read: one pace with no jitter read too little).
      for (const sp of [1.5, 3, 5, 8, 13]) { const g = guidePts('O', 0, sp); const n = g.length; const rnd = seeded(31337 + Math.round(sp * 10)); const jt = (p) => p.map(([x, y]) => [Math.round(x + (rnd() * 2 - 1) * 2), Math.round(y + (rnd() * 2 - 1) * 2)]);
        for (const [b, c, d] of [[0.4, 0.9, 0.65], [0.3, 0.95, 0.7], [0.35, 0.85, 0.6]]) { tried++; const back = g.slice().reverse().slice(0, Math.round(n * b)); const re = g[Math.round(n * c)];
          const path = jt([...back, out(back[back.length - 1], 12), out(back[back.length - 1], 25), out(re, 25), out(re, 12), ...g.slice(Math.round(n * d), Math.round(n * c) + 1).reverse()]); if (!L.traceDirections('O', [path]).lastLineBackward) kept++; }
        if (L.traceDirections('O', [jt(g.slice().reverse())]).lastLineBackward) laps++; }
      ok(`Q49: a closed line's stretches count once a lap, so O traced the other way a third of the way or so, off the line and back, stays, and a whole lap the other way clears (${kept} of ${tried} kept, ${laps} of 5 laps cleared, at five paces with jitter)`, tried === 15 && kept === 15 && laps === 5); }
    // The rule goes by each trace's own module in every builder, both ways round (round one's code check: only the Quick Review was
    // asserted, and a memory check, a checkpoint, a placement probe or a quick check made another way still passed).
    const memo = (mid, mastered) => Array.from({ length: 20 }, (_, i) => L.buildAttempt(mid, i + 1, mastered)).flatMap((a) => [a.review, a.review2]).filter((r) => r && r.question.type === 'trace');
    const kFromPk = memo('tracing-letters', ['draw-the-shapes']); const pkFromK = memo('draw-the-shapes', ['tracing-shapes']);
    const passed = (id, i) => ({ type: 'attempt_completed', at: `2026-10-0${1 + (i % 9)}T10:00:00.000Z`, startedAt: 'u', moduleId: id, seed: 1, core: [], review: null, coreCorrect: 5, coreTotal: 5 });
    const events = ['tracing-letters', 'draw-the-shapes', 'tracing-shapes', 'first-letter-tracing'].map(passed);
    const ruleOk = (qs) => { const tr = qs.filter((q) => q.type === 'trace'); return tr.length > 0 && tr.every((q) => !!q.checkDirection === L.traceChecksDirection(q.fromModuleId)); };
    const cps = Array.from({ length: 20 }, (_, s) => L.buildCheckpoint(events, s + 1)).filter(Boolean).flatMap((c) => c.core);
    const kc = L.getCourse('letters-k'); const pc = L.getCourse('first-sounds-pk');
    const probes = [...Array.from({ length: 20 }, (_, s) => L.buildPlacementProbe(kc.subject, 'K', s + 1)), ...Array.from({ length: 20 }, (_, s) => L.buildPlacementProbe(pc.subject, 'PK4', s + 1))].filter(Boolean).flatMap((c) => c.core);
    const quick = [...Array.from({ length: 5 }, (_, s) => L.buildQuickCheck('tracing-letters', s + 1)), ...Array.from({ length: 5 }, (_, s) => L.buildQuickCheck('first-letter-tracing', s + 1))].flatMap((c) => c.core);
    const marks = Array.from({ length: 10 }, (_, s) => L.buildAttempt('first-marks', s + 1, []).core).flat();
    ok('Q49: a memory check, a checkpoint, a placement probe and a quick check make every trace as its own module asks it, both ways round, and pre-K 3 keeps any direction', kFromPk.length > 0 && kFromPk.every((r) => !r.question.checkDirection) && pkFromK.length > 0 && pkFromK.every((r) => r.question.checkDirection === true) && ruleOk(cps) && ruleOk(probes) && ruleOk(quick) && !L.traceChecksDirection('first-marks') && marks.some((q) => q.type === 'trace') && marks.every((q) => !q.checkDirection), `memory ${kFromPk.length} and ${pkFromK.length}; checkpoint ${ruleOk(cps)}, probe ${ruleOk(probes)}, quick ${ruleOk(quick)}`); }
  // Q50, Mikey's answer in pass MN ("Q50 - Your recommendation "): each of First Sounds and Letters' three tracing rounds traces every
  // letter of its lesson once and asks two choice questions among the same three letters, the letter heard and the letter by its lines;
  // and every tracing round traces each letter, mark or shape its lesson teaches before any comes again (kindergarten's too).
  { const LESSONS = { 'first-letter-tracing': ['L', 'T', 'O'], 'more-big-letters': ['I', 'H', 'E'], 'trace-straight-letters': ['L', 'T', 'F'] }; const off = [];
    for (const [mid, ls] of Object.entries(LESSONS)) for (let seed = 1; seed <= 200; seed++) { const core = L.buildAttempt(mid, seed, []).core; const traced = core.filter((q) => q.type === 'trace').map((q) => q.answer).sort().join('');
      const hear = core.filter((q) => /^Tap the letter [A-Z]\.$/.test(q.prompt)); const lines = core.filter((q) => /^Which letter /.test(q.prompt));
      if (core.length !== 5 || traced !== ls.slice().sort().join('') || hear.length !== 1 || lines.length !== 1) off.push(`${mid} ${seed}: ${core.map((q) => q.answer).join(' ')}`); }
    ok('Q50: every round of the three tracing lessons traces each of its three letters once and asks the letter heard and the letter by its lines (600 rounds)', off.length === 0, off.slice(0, 4).join(' | '));
    // The letter heard and the letter by its lines are two different letters (round one's screen check: 212 of its 600 rounds, and 177
    // of this test's 600, asked one letter twice, the second answered by the first), in a round and in a Quick Review.
    const echo = []; for (const mid of Object.keys(LESSONS)) for (let seed = 1; seed <= 200; seed++) { const ch = L.buildAttempt(mid, seed, []).core.filter((q) => q.type !== 'trace'); if (ch.length !== 2 || ch[0].answer === ch[1].answer) echo.push(`${mid} ${seed}: ${ch.map((q) => q.answer).join(' ')}`);
      const lr = L.buildLightReview([], seed, { moduleId: mid, stage: 'first', missedKinds: [] }); const lc = lr ? lr.core.filter((q) => q.type !== 'trace') : []; if (lc.length !== 2 || lc[0].answer === lc[1].answer) echo.push(`review ${mid} ${seed}: ${lc.map((q) => q.answer).join(' ')}`); }
    ok('Q50: a tracing round and its Quick Review ask their two choice questions about two different letters (600 rounds, 600 reviews)', echo.length === 0, echo.slice(0, 4).join(' | '));
    const banks = Object.keys(LESSONS).map((mid) => { const m = L.MODULES.find((x) => x.id === mid); const keys = new Set(); for (const g of new Set(m.generators)) for (let s = 1; s <= 300; s++) keys.add(L.questionKey(L.generateQuestion(g, s))); return keys.size; });
    ok('Q50: each tracing lesson holds nine distinct questions, three traces and three of each choice kind', banks.every((n) => n === 9), banks.join(','));
    // Every tracing round elsewhere: no trace twice while its bank has another the round has not traced.
    const repeats = [];
    for (const m of L.MODULES) { const tg = [...new Set(m.generators)].filter((g) => L.generateQuestion(g, 1).type === 'trace'); if (!tg.length) continue;
      const pool = new Set(tg.flatMap((g) => Array.from({ length: 300 }, (_, s) => L.generateQuestion(g, s + 1).answer)));
      for (let seed = 1; seed <= 40; seed++) { const traced = L.buildAttempt(m.id, seed, []).core.filter((q) => q.type === 'trace').map((q) => q.answer); const twice = traced.filter((a, i) => traced.indexOf(a) !== i);
        if (twice.length && new Set(traced).size < Math.min(traced.length, pool.size)) { repeats.push(`${m.id} ${seed}: ${traced.join(' ')}`); break; } } }
    ok('Q50: no tracing round traces a letter, mark or shape twice while one it has not traced remains (every tracing lesson, 40 rounds each)', repeats.length === 0, repeats.slice(0, 4).join(' | '));
    // Nor one letter twice in a row, in a round, a triple dose or a Quick Review, while its lesson has another (round two's code check:
    // a new set opened with the letter just traced, "i k t t i", in 136 of 1,000 rounds and 474 of 1,000 triple doses; round four's
    // alignment read: a Quick Review had no sets, "k i t t k", in 188 of 1,000 reviews).
    const inRow = []; let rowsRead = 0; const reviewRow = []; let reviewsRead = 0;
    for (const m of L.MODULES) { const tg = [...new Set(m.generators)].filter((g) => L.generateQuestion(g, 1).type === 'trace'); if (!tg.length) continue;
      const pool = new Set(tg.flatMap((g) => Array.from({ length: 300 }, (_, s) => L.generateQuestion(g, s + 1).answer))); if (pool.size < 2) continue;
      for (let seed = 1; seed <= 40; seed++) { for (const dose of [1, 3]) { rowsRead++; const tr = L.buildAttempt(m.id, seed, [], dose > 1 ? { dose } : {}).core.filter((q) => q.type === 'trace').map((q) => q.answer);
          if (tr.some((a, i) => i > 0 && a === tr[i - 1])) { inRow.push(`${m.id} ${seed}${dose > 1 ? ' x3' : ''}: ${tr.join(' ')}`); } }
        const lr = L.buildLightReview([], seed, { moduleId: m.id, stage: 'first', missedKinds: [] }); if (lr) { reviewsRead++; const rt = lr.core.filter((q) => q.type === 'trace').map((q) => q.answer); if (rt.some((a, i) => i > 0 && a === rt[i - 1]) || (() => { let set = new Set(); return rt.some((a) => { if (set.has(a)) { if (set.size < pool.size) return true; set = new Set(); } set.add(a); return false; }); })()) reviewRow.push(`${m.id} ${seed}: ${rt.join(' ')}`); } } }
    ok(`Q50: no tracing round or triple dose traces one letter twice in a row while its lesson has another (${rowsRead} rounds)`, rowsRead >= 1000 && inRow.length === 0, inRow.slice(0, 4).join(' | '));
    // (and since round five's code read every letter before any comes again: a review of a lesson whose letters are split across
    // banks traced "r m k z r", since its exhausted bank never handed its turn to the others; since round six set by set, as a round
    // is read, since a count of letters let "i t i k t" pass)
    ok(`Q50: no Quick Review of a tracing lesson traces one letter twice in a row, or one again while another is untraced, while its lesson has another (${reviewsRead} reviews)`, reviewsRead >= 1000 && reviewRow.length === 0, reviewRow.slice(0, 4).join(' | '));
    // A Quick Review keeps a round's share, three traces of the three letters and two choices, over 30 seeds of each lesson, missed kinds
    // first or not (round one: one seed was read, and the reviews traced one letter or two of five, since each kind came once in turn);
    // and a triple dose keeps its nine traces, three sets of the three letters (round one's code check: past the first set its letters
    // came at random).
    const qr = []; const dose = [];
    for (const [mid, ls] of Object.entries(LESSONS)) for (let seed = 1; seed <= 30; seed++) { const missedKinds = seed % 3 === 0 ? [L.MODULES.find((x) => x.id === mid).generators[3]] : seed % 3 === 1 ? [L.MODULES.find((x) => x.id === mid).generators[0]] : [];
      const lr = L.buildLightReview([], seed, { moduleId: mid, stage: 'first', missedKinds }); const lt = lr ? lr.core.filter((q) => q.type === 'trace').map((q) => q.answer).sort().join('') : '';
      if (!lr || lr.core.length !== 5 || lt !== ls.slice().sort().join('')) qr.push(`${mid} ${seed}: ${lr ? lr.core.map((q) => q.answer).join(' ') : 'none'}`);
      const core = L.buildAttempt(mid, seed, [], { dose: 3 }).core; const tr = core.filter((q) => q.type === 'trace').map((q) => q.answer);
      if (core.length !== 15 || tr.length !== 9 || [0, 3, 6].some((i) => tr.slice(i, i + 3).sort().join('') !== ls.slice().sort().join(''))) dose.push(`${mid} ${seed}: ${tr.join(' ')}`); }
    ok('Q50: a Quick Review of a tracing lesson traces its three letters once each and asks two choices (90 reviews, missed kinds first or not)', qr.length === 0, qr.slice(0, 4).join(' | '));
    ok('Q50: a triple dose of a tracing lesson keeps nine traces, three sets of its three letters, among fifteen questions (90 rounds)', dose.length === 0, dose.slice(0, 4).join(' | ')); }
}

// ---- 11. Resetting one module without touching the others ----
{
  const att = (moduleId, at) => ({ type: 'attempt_completed', at, startedAt: at, moduleId, seed: 1, core: [], review: null, coreCorrect: 5, coreTotal: 5 });
  const events = [att('fraction-meaning', '2026-09-01T10:00:00.000Z'), att('count-to-5', '2026-09-01T11:00:00.000Z')];
  const before = L.deriveProgress(events);
  ok('both modules start out mastered', before.masteredIds.includes('fraction-meaning') && before.masteredIds.includes('count-to-5'));
  const after = L.deriveProgress([...events, L.makeModuleResetEvent('count-to-5', '2026-09-02T10:00:00.000Z')]);
  ok('resetting one module clears only that one', after.masteredIds.includes('fraction-meaning') && !after.masteredIds.includes('count-to-5'));
  ok('a module reset clears its attempt count too', after.perModule['count-to-5'].attempts === 0 && after.perModule['fraction-meaning'].attempts === 1);
  const redone = L.deriveProgress([...events, L.makeModuleResetEvent('count-to-5', '2026-09-02T10:00:00.000Z'), att('count-to-5', '2026-09-03T10:00:00.000Z')]);
  ok('practice after a module reset counts again', redone.masteredIds.includes('count-to-5'));
  ok('nothing is deleted by a reset', [...events, L.makeModuleResetEvent('count-to-5', 't')].length === 3);
  // The prerequisite graph
  ok('the second module in a course needs the first', JSON.stringify(L.prerequisitesOf('count-to-10')) === '["count-to-5"]');
  ok('the first module in a course needs nothing, unless it names something', L.prerequisitesOf('colours').length === 0 && JSON.stringify(L.prerequisitesOf('count-to-5')) === '["count-to-3"]');
  ok('the graph has no missing links and no loops', L.checkPrerequisiteGraph().length === 0);
  ok('a non-linear course does not chain its modules', L.prerequisitesOf('count-to-3').length === 0 && JSON.stringify(L.prerequisitesOf('patterns')) === '["same-and-different"]');
  // A student placed at grade 3 without grade 2 is not locked out of grade 3 reading
  { const fresh = L.deriveProgress([]);
    const placed = L.moduleStatuses(fresh, ['reading-3', 'fractions-intro', 'multiplication-3']);
    ok('a first module whose only prerequisite lives in an unassigned course opens', placed.find((x) => x.id === 'main-idea').status === 'available');
    ok('the same module stays locked when the earlier course is assigned too', L.moduleStatuses(fresh, ['reading-2', 'reading-3']).find((x) => x.id === 'main-idea').status === 'locked');
    ok('in-course chains still hold', placed.find((x) => x.id === 'fact-or-opinion').status === 'locked');
    ok('without an assignment list every prerequisite gates, as before', L.moduleStatuses(fresh).find((x) => x.id === 'main-idea').status === 'locked'); }
  const fresh = L.deriveProgress([]);
  ok('only first modules are open to a brand new student', L.moduleStatuses(fresh).filter((s) => s.status === 'available').every((s) => L.prerequisitesOf(s.id).length === 0));
}

// ---- 12. The plain-English summary describes everything assigned at once ----
{
  const att = (moduleId, at, correct) => ({ type: 'attempt_completed', at, startedAt: at, moduleId, seed: 1, core: [], review: null, coreCorrect: correct, coreTotal: 5 });
  const rep = L.buildReport('Sam R.', [att('count-to-5', '2026-09-01T10:00:00.000Z', 5)]);
  const text = L.summaryParagraph(rep);
  ok('the summary opens with the readable name', text.startsWith('Sam R. has mastered'));
  ok('it counts every assigned course, not one grade at a time', text.includes('1 of 16 in Kindergarten math') && text.includes('in third grade math') && text.includes('pre-K 4 math') && text.includes('first grade math'));
  ok('grades are spoken the way a person would say them', text.includes('Kindergarten') && text.includes('third grade') && !text.includes('Grade 3'));
  ok('confidence is described in words, never as a raw score', /Confidence is strongest|ground to make up|steady across the board|not been enough practice/.test(text) && !/score of \d|\d out of 5/.test(text));
  ok('reflections are reported in a plain sentence', text.includes('No reflection questions have been answered yet'));
  const noneOn = L.buildReport('Sam', [L.makeCoursesEnabledEvent([], '2026-09-01T09:00:00.000Z')]);
  ok('a student with nothing switched on is told so plainly', L.summaryParagraph(noneOn).includes('no courses switched on yet'));
  ok('the summary agrees with the report it came from', text.includes(`${rep.modules.filter((m) => m.courseId === 'counting-k' && m.mastered).length} of 16`));
}

// ---- 13. Course labels and the recommended list ----
{
  ok('an elective band shows its short names: Kinder on a fold, KG in a row', L.electiveBand('K').title === 'Kinder to Grade 2' && L.courseLabel(L.getCourse('speech-k')).includes('(KG to Grade 2 - Speech)') && L.courseGradeLabel(L.getCourse('speech-k')) === 'Kinder to Grade 2' && L.courseLabel(L.getCourse('speech-3')).includes('(Grades 3 to 5 - Speech)'));
  ok('a course label leads with its name', L.courseLabel(L.getCourse('fractions-intro')) === 'Fractions (Grade 3 - Math)');
  ok('kindergarten is abbreviated', L.courseLabel(L.getCourse('counting-k')) === 'Counting (KG - Math)');
  ok('grades read naturally in a sentence', L.gradeInSentence('K') === 'Kindergarten' && L.gradeInSentence('3') === 'third grade');
  ok('a brand new student is recommended the earliest grade only', L.recommendedCourseIds([L.makeCoursesEnabledEvent([], 't')]).every((id) => L.getCourse(id).grade === 'PK4'));
  const rec = L.recommendedCourseIds([L.makeCoursesEnabledEvent(['fractions-intro'], 't')]);
  ok('recommendations follow the grade a student is working in', rec.includes('fractions-intro') && !rec.includes('counting-k'));
  ok('every course is either recommended or optional, never both or neither', L.COURSES.every((c) => rec.includes(c.id) || !rec.includes(c.id)));
}

// ---- 14. Per-module mastery rules and the transcript ----
{
  ok('a module with no override uses the platform default', L.moduleRules('count-to-5').questions === L.CONFIG.CORE_QUESTIONS_PER_ATTEMPT && L.moduleRules('count-to-5').toMaster === L.CONFIG.MASTERY_MIN_CORRECT);
  ok('an unknown module still returns sensible rules', L.moduleRules('nope').questions === L.CONFIG.CORE_QUESTIONS_PER_ATTEMPT);
  const att = (moduleId, at, correct, total) => ({ type: 'attempt_completed', at, startedAt: at, moduleId, seed: 1, core: [], review: null, coreCorrect: correct, coreTotal: total || 5 });
  const events = [att('count-to-5', '2026-09-01T10:00:00.000Z', 5), att('count-to-10', '2026-09-02T10:00:00.000Z', 5), att('tracing-numbers', '2026-09-02T10:30:00.000Z', 5), att('tracing-shapes', '2026-09-02T10:40:00.000Z', 5), att('one-more-one-less', '2026-09-02T11:00:00.000Z', 5), att('joining-and-taking-away', '2026-09-02T12:00:00.000Z', 5), att('comparing-numbers', '2026-09-02T13:00:00.000Z', 5), att('shapes', '2026-09-02T14:00:00.000Z', 5), att('counting-by-tens', '2026-09-02T15:00:00.000Z', 5), att('longer-and-heavier', '2026-09-02T16:00:00.000Z', 5), att('sorting', '2026-09-02T17:00:00.000Z', 5), att('solids', '2026-09-02T18:00:00.000Z', 5), att('making-ten', '2026-09-02T19:00:00.000Z', 5), att('more-and-fewer-10', '2026-09-02T19:30:00.000Z', 5), att('coins-k', '2026-09-02T19:30:00.000Z', 5), att('picture-graphs-k', '2026-09-02T19:30:00.000Z', 5), att('fraction-meaning', '2026-09-03T10:00:00.000Z', 2)];
  const tr = L.buildTranscript('S-1042', events);
  ok('a course with every module mastered is listed as completed', tr.completed.length === 1 && tr.completed[0].id === 'counting-k');
  ok('a course part way through is listed separately', tr.inProgress.length === 1 && tr.inProgress[0].id === 'fractions-intro');
  ok('a course never opened is left off the transcript entirely', ![...tr.completed, ...tr.inProgress].some((c) => c.id === 'letters-k'));
  ok('the transcript records when a course was completed', typeof tr.completed[0].completedAt === 'string');
  ok('the transcript keeps courses that are no longer switched on', L.buildTranscript('S', [...events, L.makeCoursesEnabledEvent([], '2026-09-04T10:00:00.000Z')]).completed.length === 1);
  ok('a course switched off is marked as such', L.buildTranscript('S', [...events, L.makeCoursesEnabledEvent([], '2026-09-04T10:00:00.000Z')]).completed[0].stillAssigned === false);
  ok('transcript courses run beginner to advanced', L.buildTranscript('S', [att('count-to-5', 't1', 5), att('fraction-meaning', 't2', 5)]).inProgress.every((c, i, list) => i === 0 || L.GRADES.indexOf(list[i - 1].grade) <= L.GRADES.indexOf(c.grade)));
  ok('the transcript states plainly that it holds no personal information', tr.note.includes('no personal information'));
  ok('the transcript carries nothing a student wrote', JSON.stringify(tr).includes('wonder_answered') === false);
}

// ---- 15. Life skills: an ordered sequence rather than a grade assignment ----
{
  const ordered = L.lifeSkillsInOrder();
  ok('every skill is in the sequence', ordered.length === L.LIFE_SKILLS.length && ordered.length >= 30);
  ok('the first skill is the earliest and the last is the most mature', ordered[0].maturity === 0 && ordered[ordered.length - 1].maturity === 1);
  ok('maturity only ever rises down the list', ordered.every((sk, i) => i === 0 || sk.maturity >= ordered[i - 1].maturity));
  ok('positions are numbered from one', ordered[0].position === 1 && ordered[ordered.length - 1].position === ordered.length);
  ok('no skill is pinned to a grade any more', L.LIFE_SKILLS.every((sk) => sk.grade === undefined));
  ok('every skill says what it is, why it matters and how to practice it', L.LIFE_SKILLS.every((sk) => sk.title && sk.why.length > 40 && sk.ways.length >= 3));
  ok('no life skill text uses an em dash', L.LIFE_SKILLS.every((sk) => !sk.why.includes('\u2014') && sk.ways.every((w) => !w.includes('\u2014'))));
  ok('the earliest skill is simple and the last is grown up', ordered[0].title === 'Riding a bike' && ordered[ordered.length - 1].title === 'Working out what matters to you');
  ok('every stage has skills in it', L.LIFE_STAGES.every((st) => ordered.some((sk) => sk.stage === st.id)));
  ok('every id is unique', new Set(L.LIFE_SKILLS.map((sk) => sk.id)).size === L.LIFE_SKILLS.length);
  ok('life skills can be switched off entirely', typeof L.FEATURES.lifeSkills === 'boolean');
  ok('there are four stage markers down the sequence', L.LIFE_STAGES.length === 4 && L.LIFE_STAGES[0].id === 'early' && L.LIFE_STAGES[3].id === 'grown');
  ok('every skill belongs to a stage the platform knows', ordered.every((sk) => L.LIFE_STAGES.some((st) => st.id === sk.stage)));
  ok('stages never run backwards down the list', ordered.every((sk, i) => i === 0 || L.LIFE_STAGES.findIndex((st) => st.id === sk.stage) >= L.LIFE_STAGES.findIndex((st) => st.id === ordered[i - 1].stage)));
  const none = L.emptyCoveredSkills();
  ok('nothing is covered to begin with', none.covered.length === 0 && L.coveredCount(none, ordered) === 0);
  const one = L.toggleCovered(none, 'ls-bike');
  ok('a skill can be marked as covered', L.isCovered(one, 'ls-bike') && L.coveredCount(one, ordered) === 1);
  ok('marking it again puts it back', L.isCovered(L.toggleCovered(one, 'ls-bike'), 'ls-bike') === false);
  ok('covered marks belong to the classroom, never to a student', !JSON.stringify(one).includes('learner') && !JSON.stringify(one).includes('student'));
}

// ---- 16. Words for people: the module story and the learner encouragement ----
{
  const core = (n, ok, ms) => Array.from({ length: n }, (_, i) => ({ correct: i < ok, timeMs: ms }));
  const att = (id, at, ok, ms) => ({ type: 'attempt_completed', at, startedAt: at, moduleId: id, seed: 1, core: core(5, ok, ms), review: null, coreCorrect: ok, coreTotal: 5 });
  const ev = [
    { type: 'lesson_viewed', at: '2026-09-01T09:00:00.000Z', moduleId: 'count-to-5' },
    att('count-to-5', '2026-09-01T10:00:00.000Z', 3, 9000),
    att('count-to-5', '2026-09-02T10:00:00.000Z', 4, 2500),
    att('fraction-meaning', '2026-09-03T10:00:00.000Z', 5, 9500),
  ];
  const story = L.moduleStory('Sam', ev, 'count-to-5');
  ok('the story opens with reads and practices in words', story.startsWith('Sam read through this lesson once and practiced it twice.'));
  ok('each attempt is narrated with its score', story.includes('3 out of 5') && story.includes('4 out of 5'));
  ok('a suspiciously quick final round is called out against their usual pace', story.includes('noticeably quicker than the 9.5 seconds'));
  ok('a quick round triggers a promise to re-check later', story.includes('introduced again at a later time'));
  ok('the story ends with the confidence score', /confidence score in count to 5 currently stands at \d out of 5/.test(story));
  ok('no em dashes in the story', !story.includes('\u2014'));
  ok('an untouched module says so plainly', L.moduleStory('Sam', [], 'count-to-10').includes('has not opened'));
  ok('a read-only module says nothing counts yet', L.moduleStory('Sam', [{ type: 'lesson_viewed', at: 't', moduleId: 'count-to-10' }], 'count-to-10').includes('has not practiced it yet'));
  ok('encouragement names what was mastered and what is next', L.encouragementFor(ev, 'count-to-5', true) === 'You have mastered **count to 5!** Way to go!\nNext up is **count to 10.**');
  const wholeCourse = ['count-to-5', 'count-to-10', 'tracing-numbers', 'one-more-one-less', 'tracing-shapes', 'joining-and-taking-away', 'comparing-numbers', 'shapes', 'counting-by-tens', 'longer-and-heavier', 'sorting', 'solids', 'making-ten', 'more-and-fewer-10', 'coins-k', 'picture-graphs-k'].map((id, i) => att(id, `t${i}`, 5, 9000));
  ok('finishing a course points at the next course', L.encouragementFor(wholeCourse, 'making-ten', true).includes('Next we will learn about'));
  ok('a miss is met with encouragement, not a score', !L.encouragementFor(ev, 'count-to-5', false).includes('out of'));
}

// ---- 17. Backup files: the whole classroom in one file, restore never loses anything ----
{
  const roster = L.addStudent(L.emptyRoster(), 'S-1', 't1', { level: 'elementary' }).roster;
  const records = [{ name: 's_1', events: [{ type: 'lesson_viewed', at: '2026-09-01T10:00:00.000Z', moduleId: 'count-to-5' }] }];
  const state = { roster, records, wonderReview: L.emptyWonderReview(), covered: L.emptyCoveredSkills() };
  const file = L.buildBackup(state, '2026-09-02T00:00:00.000Z');
  ok('a backup names the app and a version and carries every record', file.app === 'The Wise Human' && file.version === 1 && file.records.length === 1);
  ok('a random file is refused with a plain sentence', L.checkBackup({ hello: 1 }) === 'That file is not a backup from The Wise Human.');
  ok('a backup from the future is refused rather than misread', L.checkBackup({ ...file, version: 99 }).includes('newer version'));
  ok('a good backup passes the check', L.checkBackup(file) === null);
  // Restore onto an empty device
  const empty = { roster: L.emptyRoster(), records: [], wonderReview: L.emptyWonderReview(), covered: L.emptyCoveredSkills() };
  const restored = L.mergeBackup(empty, file);
  ok('restoring onto an empty device recreates the classroom', restored.roster.students.length === 1 && restored.records[0].events.length === 1 && restored.addedStudents === 1);
  // Restore onto a device that has moved on since the backup was taken
  const later = { ...state, records: [{ name: 's_1', events: [...records[0].events, { type: 'lesson_viewed', at: '2026-09-03T10:00:00.000Z', moduleId: 'count-to-5' }] }] };
  const merged = L.mergeBackup(later, file);
  ok('restoring an old backup never loses newer work', merged.records[0].events.length === 2);
  ok('restoring twice adds nothing twice', L.mergeBackup(merged, file).records[0].events.length === 2);
  ok('educator settings take the union', L.mergeBackup({ ...empty, wonderReview: L.approveWonder(L.emptyWonderReview(), 'w-one-thing') }, file).wonderReview.approved.includes('w-one-thing'));
  ok('days since backup is counted in whole days', L.daysSinceBackup('2026-09-01T00:00:00.000Z', '2026-09-04T12:00:00.000Z') === 3 && L.daysSinceBackup(null, 'now') === null);
  // A backup proves ownership of the classroom, which is what a PIN reset requires
  const code = L.makeRecoveryCode(12345);
  ok('a recovery code is four groups of four digits', /^\d{4}-\d{4}-\d{4}-\d{4}$/.test(code) && L.makeRecoveryCode(12345) === code);
  const owned = L.buildBackup({ ...state, recovery: code }, '2026-09-02T00:00:00.000Z');
  ok('a backup made by this classroom proves ownership', L.backupProvesOwnership(owned, code));
  ok('a backup from another classroom does not', !L.backupProvesOwnership(L.buildBackup({ ...state, recovery: L.makeRecoveryCode(999) }, 't'), code));
  ok('an old backup with no code does not, and nothing crashes', !L.backupProvesOwnership(file, code) && !L.backupProvesOwnership(owned, null));
  ok('the recovery code is the first thing in the file after the app name', Object.keys(owned)[1] === 'recovery' && /RECOVERY CODE/.test(owned.recoveryNote));
  ok('a typed code matches with or without dashes and spaces', L.codeMatches(code, code) && L.codeMatches(code.replace(/-/g, ' '), code) && L.codeMatches(code.replace(/-/g, ''), code));
  ok('a wrong or short typed code does not match', !L.codeMatches('1234', code) && !L.codeMatches(code.slice(0, 15) + '0', code));
}

// ---- 18. Loop-back routing: two failed rounds send a student back to the prerequisite ----
{
  const att = (id, at, ok) => ({ type: 'attempt_completed', at, startedAt: at, moduleId: id, seed: 1, core: [], review: null, coreCorrect: ok, coreTotal: 5 });
  const passed = [att('count-to-5', '2026-09-01T10:00:00.000Z', 5)];
  const oneMiss = [...passed, att('count-to-10', '2026-09-02T10:00:00.000Z', 2)];
  const twoMiss = [...oneMiss, att('count-to-10', '2026-09-03T10:00:00.000Z', 1)];
  ok('one miss is not enough to route back', L.loopBackTarget(oneMiss, 'count-to-10') === null);
  ok('two misses in a row route back to the prerequisite', L.loopBackTarget(twoMiss, 'count-to-10') === 'count-to-5');
  ok('the failed streak counts only since the last pass', L.failedStreak(twoMiss, 'count-to-10') === 2 && L.failedStreak([...twoMiss, att('count-to-10', 't4', 5)], 'count-to-10') === 0);
  ok('re-passing the prerequisite clears the routing', L.loopBackTarget([...twoMiss, att('count-to-5', '2026-09-04T10:00:00.000Z', 5)], 'count-to-10') === null);
  ok('a module with no prerequisite never routes back', L.loopBackTarget([att('colours', 't1', 1), att('colours', 't2', 1)], 'colours') === null);
  const loop = L.makeLoopBackEvent('count-to-10', 'count-to-5', '2026-09-03T11:00:00.000Z');
  ok('a loop back is recorded as an event, never a deletion', loop.type === 'looped_back' && loop.moduleId === 'count-to-10' && loop.toModuleId === 'count-to-5');
  ok('the module story tells the educator about the loop back', L.moduleStory('Sam', [...twoMiss, loop], 'count-to-10').includes('Sam was sent back to count to 5'));
  ok('a loop back event does not disturb mastery counts', L.deriveProgress([...twoMiss, loop]).masteredIds.includes('count-to-5'));
}

// ---- 18b. The quick check: one module, five questions, placed but never mastered ----
{
  const at = '2026-09-14T10:00:00.000Z';
  const events = [L.makeCoursesEnabledEvent(['history-8'], '2026-09-14T09:00:00.000Z')];
  const check = L.buildQuickCheck('founding-documents', 7);
  ok('a quick check is five questions from the module, one per generator slot, no lesson', check.quickCheck && check.core.length === 5 && check.core.every((q) => q.fromModuleId === 'founding-documents') && check.review === null);
  ok('the same seed gives the same check', JSON.stringify(L.buildQuickCheck('founding-documents', 7).core.map((q) => q.prompt)) === JSON.stringify(check.core.map((q) => q.prompt)));
  ok('the next module offers it; a spoken course and Writing never do', L.quickCheckAllowed(events, 'founding-documents') && !L.quickCheckAllowed(events, 'count-to-5') && !L.quickCheckAllowed(events, L.COURSES.find((c) => c.subject === 'Writing').modules[0].id));
  const res = (n, ms) => Array.from({ length: 5 }, (_, i) => ({ correct: i < n, timeMs: ms }));
  const passEv = L.makeQuickCheckEvent('founding-documents', res(4, 9000), at);
  ok('four of five at a normal pace passes', passEv.type === 'quick_check' && passEv.passed && passEv.right === 4 && !passEv.guessed);
  ok('three of five does not pass', !L.makeQuickCheckEvent('founding-documents', res(3, 9000), at).passed);
  const rushed = L.makeQuickCheckEvent('founding-documents', res(5, 900), at);
  ok('five of five with every answer under two seconds is too fast to count', rushed.guessed && !rushed.passed);
  const placed = L.makeQuickPlacedEvent('founding-documents', at);
  const after = [...events, passEv, placed];
  const p = L.deriveProgress(after).perModule['founding-documents'];
  ok('a passed check places the module: passed for gating, never mastered', p.placed && p.passed && !p.mastered && L.moduleStatuses(L.deriveProgress(after), ['history-8']).find((x) => x.id === 'early-republic').status === 'available');
  ok('a quick-check placement never counts as the placement check for the subject', !L.placementDone(after, 'History'));
  ok('the link is one try per module', !L.quickCheckAllowed(after, 'founding-documents') && !L.quickCheckAllowed([...events, L.makeQuickCheckEvent('founding-documents', res(2, 9000), at)], 'founding-documents'));
  ok('the report row and the module story tell the educator', L.buildReport('S-9', after).modules.find((m) => m.id === 'founding-documents').quickCheck.right === 4 && L.moduleStory('S-9', after, 'founding-documents').includes('took the quick check') && L.moduleStory('S-9', after, 'founding-documents').includes('4 of 5'));
  const missStory = L.moduleStory('S-9', [...events, L.makeQuickCheckEvent('founding-documents', res(2, 9000), at), { type: 'attempt_completed', at: '2026-09-14T11:00:00.000Z', startedAt: '2026-09-14T11:00:00.000Z', moduleId: 'founding-documents', seed: 1, core: res(5, 8000), review: null, coreCorrect: 5, coreTotal: 5 }], 'founding-documents');
  ok('a missed check is named in the story and never counts as a miss for the loop back', missStory.includes('first tried the quick check') && L.failedStreak([...events, L.makeQuickCheckEvent('founding-documents', res(2, 9000), at)], 'founding-documents') === 0);
}

// ---- 18c. Teacher notes: on the log, so they survive resets and ride in backups ----
{
  const at = '2026-09-15T10:00:00.000Z';
  const note = L.makeNoteEvent('  Reads well aloud; shy in groups.  ', at);
  const events = [L.makeCoursesEnabledEvent(['history-8'], '2026-09-15T09:00:00.000Z'), note];
  ok('a note is an event with its text trimmed', note.type === 'note' && note.text === 'Reads well aloud; shy in groups.' && L.teacherNotes(events).length === 1 && L.teacherNotes(events)[0].text === note.text);
  ok('the report carries the notes, newest first', L.buildReport('S-6', [...events, L.makeNoteEvent('Second', '2026-09-16T10:00:00.000Z')]).notes.map((n) => n.text).join('|') === 'Second|Reads well aloud; shy in groups.');
  ok('a removed note is gone from the report and its removal stays on the log', L.buildReport('S-6', [...events, L.makeNoteRemovedEvent(note.noteId, '2026-09-16T10:00:00.000Z')]).notes.length === 0);
  // An edit is the old note removed and a new one written, in one save: the log keeps both, the report shows one.
  const edited = [...events, L.makeNoteRemovedEvent(note.noteId, '2026-09-16T09:00:00.000Z'), L.makeNoteEvent('Reads well aloud; joining group work now.', '2026-09-16T09:00:00.000Z')];
  ok('an edited note replaces the old one on the report and leaves both events on the log', L.teacherNotes(edited).length === 1 && L.teacherNotes(edited)[0].text === 'Reads well aloud; joining group work now.' && edited.filter((e) => e.type === 'note').length === 2);
  ok('a reset keeps the notes', L.teacherNotes([...events, L.makeResetEvent ? L.makeResetEvent('2026-09-17T10:00:00.000Z') : { type: 'reset', at: '2026-09-17T10:00:00.000Z' }]).length === 1);
}

// ---- 19. The class view: most in need first, reasons in words ----
{
  const att = (id, at, ok, ms) => ({ type: 'attempt_completed', at, startedAt: at, moduleId: id, seed: 1, core: Array.from({ length: 5 }, (_, i) => ({ correct: i < ok, timeMs: ms })), review: null, coreCorrect: ok, coreTotal: 5 });
  const students = [
    { id: 's_1', label: 'S-1', events: [att('count-to-5', '2026-09-01T10:00:00.000Z', 5, 6000), att('count-to-10', '2026-09-02T10:00:00.000Z', 2, 2000), att('count-to-10', '2026-09-03T10:00:00.000Z', 1, 2000)] },
    { id: 's_2', label: 'S-2', events: [att('count-to-5', '2026-09-09T10:00:00.000Z', 5, 6000)] },
    { id: 's_3', label: 'S-3', events: [] },
  ];
  const rows = L.classView(students, '2026-09-10T12:00:00.000Z');
  ok('the student who is stuck and guessing comes first', rows[0].label === 'S-1' && rows[0].band === 'needs help now');
  // Connect the dots is joined in order: the same points touched out of sequence is not the exercise.
  { const inOrder = [[[22, 22], [50, 22], [78, 22], [78, 50], [78, 78], [50, 78], [22, 78], [22, 50], [22, 22]]];
    const outOfOrder = [[[22, 22], [22, 78], [78, 78], [78, 22], [22, 22], [50, 22], [78, 50], [50, 78], [22, 50]]];
    ok('a square joined in order is accepted', L.traceMatches('square', inOrder));
    ok('the same dots joined backwards is not', !L.traceMatches('square', outOfOrder)); }
  ok('a student who has not started is flagged, gently', rows.find((r) => r.label === 'S-3').reasons.some((x) => x.endsWith('has not started')));
  // One failed round, nothing else: the row says so instead of "nothing to flag" (Mikey's test student, 2026-09-14).
  const oneMiss = { id: 's_4', label: 'S-4', events: [att('count-to-5', '2026-09-09T10:00:00.000Z', 2, 6000)] };
  const missRow = L.classView([oneMiss], '2026-09-10T12:00:00.000Z')[0];
  ok('one missed round is named, with its score, and what a second miss would bring', missRow.reasons.some((r) => r.includes('S-4 failed the last round of **Count to 5** (2 of 5 right, 1 attempt)') && r.includes('second miss')));
  ok('a class row names the stage the student is working in, without disturbing its attention band', rows.every((r) => typeof r.stage === 'string') && rows.every((r) => ['needs help now', 'keep an eye on', 'on track'].includes(r.band)));
  ok('the next module is named, not stringified', rows.every((r) => !r.nextTitle.includes('[object')) && rows.some((r) => r.nextTitle.length > 0));
  ok('every class row carries the practice line the report summary shows', missRow.practice === 'Practice so far: 1 round, 0 passed.\nTried but not passed yet: **Count to 5** (best score 2 out of 5, 1 attempt).' && rows.find((r) => r.label === 'S-3').practice === '');
  const quickEvents = [L.makeCoursesEnabledEvent(['history-8'], '2026-09-09T09:00:00.000Z'), L.makeQuickCheckEvent('founding-documents', Array.from({ length: 5 }, (_, i) => ({ correct: i < 2, timeMs: 9000 })), '2026-09-09T10:00:00.000Z')];
  const quickRow = L.classView([{ id: 's_5', label: 'S-5', events: quickEvents }], '2026-09-10T12:00:00.000Z')[0];
  ok('a missed quick check shows on the class view practice line as a try to skip', quickRow.practice.includes('**The Founding Documents** (quick check 2 out of 5)') && quickRow.missedQuickChecks === 1 && missRow.missedQuickChecks === 0);
  const notedRow = L.classView([{ id: 's_7', label: 'S-7', events: [...quickEvents, L.makeNoteEvent('Older note', '2026-09-08T10:00:00.000Z'), L.makeNoteEvent('Shy in groups; reads well aloud.\nSecond line.', '2026-09-09T11:00:00.000Z')] }], '2026-09-10T12:00:00.000Z')[0];
  ok('a class row carries the first line of the latest note', notedRow.note === 'Shy in groups; reads well aloud.' && missRow.note === '');
  ok('a class row carries every note for searching, first lines and full text', notedRow.notesAll.join('|') === 'Shy in groups; reads well aloud.|Older note' && notedRow.notesText.includes('Older note') && notedRow.notesText.includes('Second line.'));
  ok('a middle-sized shape choice is described in words', L.describeChoice('shape:triangle:medium') === 'the middle-sized triangle');
  // Since pass MO a plain shape is named too (the star), where it was left as its token (round one's code check: a reader saw
  // "icon:hat | icon:ball").
  ok('a big or small shape choice is described in words', L.describeChoice('shape:circle:big') === 'the big circle' && L.describeChoice('shape:square:small') === 'the little square' && L.describeChoice('shape:star') === 'the star' && L.describeChoice('shape:rectangle') === 'the long rectangle');
  const passedQuick = [...quickEvents.slice(0, 1), L.makeQuickCheckEvent('early-republic', Array.from({ length: 5 }, () => ({ correct: true, timeMs: 9000 })), '2026-09-09T10:00:00.000Z'), L.makeQuickPlacedEvent('early-republic', '2026-09-09T10:00:00.000Z')];
  ok('a passed quick check shows as a module skipped', L.practiceLine(L.buildReport('S-5', passedQuick)).line.includes('Skipped by quick check: The Early Republic'));
  ok('a module skipped by quick check is placed and carries the passed check, so paper can tell it from mastery', (() => { const m = L.buildReport('S-5', passedQuick).modules.find((x) => x.id === 'early-republic'); return m.placed && !m.mastered && m.quickCheck && m.quickCheck.passed; })());
  ok('the stuck reason reads "best 1 of 5", never "best 1 of 5 of 5"', !rows[0].reasons.some((r) => /of \d+ of \d+/.test(r)) && rows[0].reasons.some((r) => r.includes('best score 2 out of 5')));
  const missSummary = L.summaryParagraph(L.buildReport('S-4', [L.makeCoursesEnabledEvent(['counting-k'], '2026-09-09T09:00:00.000Z'), ...oneMiss.events]));
  ok('the report summary names practice so far and what was tried but not passed', missSummary.includes('Practice so far: 1 round, 0 passed.') && missSummary.includes('Tried but not passed yet: Count to 5 (best attempt 2 out of 5, 1 try).'));
  const missParts = L.summaryParts(L.buildReport('S-4', [L.makeCoursesEnabledEvent(['counting-k'], '2026-09-09T09:00:00.000Z'), ...oneMiss.events]));
  ok('the summary parts hand the screen each tried module as a link, and keep it out of the prose', missParts.tried.length === 1 && missParts.tried[0].id === 'count-to-5' && missParts.tried[0].detail === 'best attempt 2 out of 5, 1 try' && missParts.tried[0].subject === 'Math' && !missParts.rest.includes('Tried but not passed') && missParts.rest.includes('Practice so far: 1 round, 0 passed.'));
  ok('a student doing fine is on track and the reason says how quick they were', rows.find((r) => r.label === 'S-2').band === 'on track' && /on track/.test(rows.find((r) => r.label === 'S-2').reasons.join(' ')));
  { const quick = { id: 'q', label: 'Q', events: [att('count-to-5', '2026-09-09T10:00:00.000Z', 5, 6000)] };
    const slow = { id: 's', label: 'S', events: [att('count-to-5', '2026-09-08T10:00:00.000Z', 2, 6000), att('count-to-5', '2026-09-08T11:00:00.000Z', 3, 6000), att('count-to-5', '2026-09-09T10:00:00.000Z', 5, 6000)] };
    const ordered = L.classView([quick, slow], '2026-09-10T12:00:00.000Z');
    ok('among students on track, the one who needed more tries comes first', ordered[0].label === 'S' && ordered[0].band === 'on track' && /took about 3.0 rounds per module/.test(ordered[0].reasons.join(' '))); }
  ok('every reason is a plain phrase, never a number alone', rows.every((r) => r.reasons.every((x) => /[a-z]/.test(x))));
  ok('each row names what the student should do next', rows.every((r) => typeof r.next === 'string'));
  ok('the summary explains the order, then counts', L.classSummary(rows).startsWith('Students on top could use a bit more guidance than those on bottom.') && L.classSummary(rows).endsWith('\n1 student needs help now (S-1). 1 student worth keeping an eye on. 1 on track.'));
  ok('an empty class says so', L.classSummary([]) === 'No students yet.');
  ok("Who Needs Help explains its order in Mikey's words, word for word (pass MB)", L.classSummary(rows).startsWith('Students on top could use a bit more guidance than those on bottom. Guessing, low confidence, multiple failed attempts and unusually slow progression pushes a student higher up the list.\n'));
  ok('September 11 and Veterans Day are remembered in any year, and ordinary days are not', L.remembranceFor('2026-09-11').id === 'september-11' && L.remembranceFor('2031-11-11').id === 'veterans-day' && !L.isRemembranceDay('2026-09-12') && !L.isRemembranceDay('2026-11-09'));
  ok('Memorial Day is the last Monday of May', L.remembranceFor('2026-05-25').id === 'memorial-day' && L.remembranceFor('2027-05-31').id === 'memorial-day' && !L.isRemembranceDay('2026-05-18') && !L.isRemembranceDay('2026-05-26'));
  ok('every remembrance card has a title and three or four plain lines', L.REMEMBRANCE_DAYS.every((d) => d.title && d.lines.length >= 3 && d.lines.length <= 4 && d.lines.every((l) => l.length > 30)));   // four lines in Mikey's words (2026-09-23)
  // Writing, marked by the educator
  { const wq = L.generateQuestion('wr4-topic-paragraph', 2);
    const sent = L.makeWritingEvent('topic-sentences', wq.prompt, 'Dogs make good pets. They are easy to feed. They love a walk. They sit with you.', [{ item: 'x', ticked: true }], '2026-09-14T10:00:00.000Z', '2026-09-14T10:05:00.000Z');
    ok('a sent piece is pending and counts as an attempt, not a pass', L.pendingWritings([sent]).length === 1 && L.deriveProgress([sent]).perModule['topic-sentences'].attempts === 1 && !L.deriveProgress([sent]).perModule['topic-sentences'].passed && L.deriveProgress([sent]).perModule['topic-sentences'].pendingWriting === true);
    const met = L.makeWritingMark('topic-sentences', sent.at, true, '', '2026-09-14T15:00:00.000Z');
    const pg = L.deriveProgress([sent, met]);
    ok('a mark that meets the bar is a pass on the day it was marked', pg.perModule['topic-sentences'].passed && pg.perModule['topic-sentences'].passes === 1 && !pg.perModule['topic-sentences'].mastered && L.pendingWritings([sent, met]).length === 0);
    const notYet = L.makeWritingMark('topic-sentences', sent.at, false, '', '2026-09-14T15:00:00.000Z');
    ok('not yet clears the waiting state without a pass', !L.deriveProgress([sent, notYet]).perModule['topic-sentences'].passed && L.pendingWritings([sent, notYet]).length === 0);
    const sent2 = L.makeWritingEvent('topic-sentences', wq.prompt, 'A second paragraph, a day later, with a topic sentence first and reasons after it.', [], '2026-09-15T10:00:00.000Z', '2026-09-15T10:05:00.000Z');
    const met2 = L.makeWritingMark('topic-sentences', sent2.at, true, '', '2026-09-15T12:00:00.000Z');
    ok('two pieces that meet the bar on different days earn the star', L.deriveProgress([sent, met, sent2, met2]).perModule['topic-sentences'].mastered === true);
    ok('a pass opens the next writing module', L.moduleStatuses(L.deriveProgress([sent, met]), ['writing-4']).find((x) => x.id === 'opinion-paragraph').status === 'available');
    ok('the module story tells the writing record', L.moduleStory('x', [sent, met], 'topic-sentences').includes('marked as meeting the bar')); }
  { const oq = L.generateQuestion('ord-numbers-100', 5); const nums = oq.answer.split(' | ').map(Number);
    ok('an order question is judged as a sequence', L.checkAnswer(oq, oq.answer) && !L.checkAnswer(oq, oq.items.join(' | ')) && nums.every((n, i) => i === 0 || n > nums[i - 1])); }
  // Placement check
  { ok('placement grades follow the band and skip spoken and hidden courses', JSON.stringify(L.placementGrades('Math', 'middle')) === '["6","7","8"]' && JSON.stringify(L.placementGrades('Reading', 'elementary')) === '["3","4","5"]' && JSON.stringify(L.placementGrades('Math', 'early')) === '["2"]');
    const probe = L.buildPlacementProbe('Math', '6', 11);
    ok('a probe is four questions from that grade and subject', probe.core.length === 4 && probe.core.every((q) => { const c = L.getCourse(L.getModule(q.fromModuleId).courseId); return c.grade === '6' && c.subject === 'Math'; }));
    ok('three of four clears a grade, two does not', L.placementCleared([{ correct: true }, { correct: true }, { correct: true }, { correct: false }]) && !L.placementCleared([{ correct: true }, { correct: true }, { correct: false }, { correct: false }]));
    const out = L.placementOutcome('Math', 'middle', ['6', '7']);
    ok('clearing two grades starts the student at the third and places past everything below it', out.startGrade === '8' && out.startCourseIds.join() === 'math-8' && ['ratios', 'fraction-meaning'].every((id) => out.clearedModuleIds.includes(id)) && !out.clearedModuleIds.includes('slope'));
    { const down = L.placementOutcome('Math', 'high', ['7'], '8'); ok('a high school student who clears grade 7 after failing 9 and 8 starts at grade 8 with everything below placed past', down.startGrade === '8' && down.startCourseIds.join() === 'math-8' && down.clearedModuleIds.includes('ratios') && !down.clearedModuleIds.includes('slope')); }
    const top = L.placementOutcome('Math', 'middle', ['6', '7', '8']);
    ok('clearing every grade in the band starts at the top of the band', top.startGrade === '8');
    const ev = [L.makePlacementEvent('Math', '8', out.clearedModuleIds, '2026-09-14T09:00:00.000Z')];
    const pg = L.deriveProgress(ev);
    ok('placed modules are passed for gating and never mastered', pg.passedIds.length === out.clearedModuleIds.length && pg.masteredIds.length === 0 && pg.perModule['ratios'].placed === true);
    ok('a placed module opens the ones after it', L.moduleStatuses(pg, ['math-8']).find((x) => x.id === 'slope').status === 'available');
    ok('placement is recorded per subject', L.placementDone(ev, 'Math') && !L.placementDone(ev, 'Reading'));
    ok('the report rows and story say placed past', L.buildReport('x', ev).modules.find((m) => m.id === 'ratios').placed === true && L.moduleStory('x', ev, 'ratios').includes('placement check placed past')); }
  // Cumulative checkpoint
  { const passOn = (id, i) => L.makeAttemptEvent({ moduleId: id, seed: 1 }, [1, 1, 1, 1, 1].map(() => ({ correct: true })), null, `2026-09-14T10:0${i}:00.000Z`, `2026-09-14T10:0${i}:30.000Z`);
    const three = ['fraction-meaning', 'equivalent-fractions', 'comparing-fractions'].map(passOn);
    ok('no checkpoint before four modules are passed', L.checkpointDue(three) === null);
    const four = [...three, passOn('fractions-on-a-line', 3)];
    ok('a checkpoint is due at four passed modules', L.checkpointDue(four) && L.checkpointDue(four).atCount === 4);
    const cp = L.buildCheckpoint(four, 5);
    ok('a checkpoint has eight questions drawn from passed modules only', cp.core.length === 8 && cp.core.every((q) => four.some((e) => e.moduleId === q.fromModuleId)));
    ok('a checkpoint never repeats a question', new Set(cp.core.map((q) => q.story + '|' + q.prompt)).size === 8);
    const done = L.makeCheckpointEvent(cp, cp.core.map((q, i) => ({ correct: i !== 2, given: 'x' })), '2026-09-14T11:00:00.000Z', '2026-09-14T11:05:00.000Z');
    const after = [...four, done];
    ok('a finished checkpoint is not offered again for the same count', L.checkpointDue(after) === null);
    ok('a missed checkpoint question marks that module for a refresher', L.refresherIds(after).length === 1 && L.refresherIds(after)[0] === cp.core[2].fromModuleId);
    ok('the pass and the star are kept after a miss', L.deriveProgress(after).passedIds.length === 4);
    const again = [...after, L.makeAttemptEvent({ moduleId: cp.core[2].fromModuleId, seed: 1 }, [1, 1, 1, 1, 1].map(() => ({ correct: true })), null, '2026-09-14T12:00:00.000Z', '2026-09-14T12:00:30.000Z')];
    ok('passing the module again clears the refresher', L.refresherIds(again).length === 0);
    ok('a checkpoint miss lowers confidence like a missed memory check', L.computeConfidence(cp.core[2].fromModuleId, after).score < L.computeConfidence(cp.core[2].fromModuleId, four).score);
    ok('the report flags the refresher and the module story explains it', L.buildReport('x', after).modules.find((m) => m.id === cp.core[2].fromModuleId).refresher === true && L.moduleStory('x', after, cp.core[2].fromModuleId).includes('missed in the last checkpoint'));
  }
  // Memory checks can come from any mastered module in any course
  { const mastered = ['fraction-meaning', 'count-to-5', 'letter-names']; const seen = new Set();
    for (let seed = 1; seed <= 60; seed++) { const a = L.buildAttempt('equivalent-fractions', seed, mastered); if (a.review) seen.add(a.review.moduleId); }
    ok('memory checks draw from the same course and from other courses', seen.has('fraction-meaning') && [...seen].some((id) => id !== 'fraction-meaning')); }
  { const mastered = ['fraction-meaning', 'count-to-5', 'letter-names']; let both = 0; let distinct = true;
    for (let seed = 1; seed <= 40; seed++) { const a = L.buildAttempt('equivalent-fractions', seed, mastered); if (a.review && a.review2) { both += 1; if (a.review.moduleId === a.review2.moduleId) distinct = false; } }
    ok('a round carries two memory checks from two different passed modules', both === 40 && distinct); }
  { const a = L.buildAttempt('equivalent-fractions', 3, ['fraction-meaning']);
    ok('with one passed module there is one memory check, not a repeat', a.review && !a.review2); }
  { const ev = [L.makeAttemptEvent({ moduleId: 'count-to-10', seed: 1 }, [{ correct: true }, { correct: true }, { correct: true }, { correct: true }, { correct: true }], { moduleId: 'count-to-5', correct: true }, 't0', 't1', { moduleId: 'letter-names', correct: false })];
    const pr = L.deriveProgress(ev);
    ok('both memory checks count in the review tally', pr.review.asked === 2 && pr.review.correct === 1); }
  // Course search: every typed word must appear, and grades are matched every way they are said
  ok('"grade 1 math" finds the two grade 1 math courses and nothing else', L.COURSES.filter((c) => L.matchesCourseSearch(c, 'grade 1 math')).map((c) => c.id).join() === 'numbers-1,shapes-1');   // two courses since pass LC
  ok('"1st grade" and "first grade" find the same courses', JSON.stringify(L.COURSES.filter((c) => L.matchesCourseSearch(c, '1st grade')).map((c) => c.id)) === JSON.stringify(L.COURSES.filter((c) => L.matchesCourseSearch(c, 'first grade')).map((c) => c.id)) && L.COURSES.some((c) => L.matchesCourseSearch(c, '1st grade')));
  ok('"math" finds every math course', L.COURSES.filter((c) => L.matchesCourseSearch(c, 'math')).length === L.COURSES.filter((c) => c.subject === 'Math').length);
  ok('"kinder reading" narrows to kindergarten reading', L.COURSES.filter((c) => L.matchesCourseSearch(c, 'kinder reading')).map((c) => c.id).join() === 'letters-k');
  ok('a word from a title works too', L.COURSES.filter((c) => L.matchesCourseSearch(c, 'fractions')).map((c) => c.id).includes('fractions-intro'));
  ok('an empty search matches everything', L.COURSES.every((c) => L.matchesCourseSearch(c, '  ')));
  ok('"pre k" typed as two words finds the pre-K courses, and "pr" already does', L.COURSES.filter((c) => L.matchesCourseSearch(c, 'pre k')).every((c) => c.grade.startsWith('PK')) && L.COURSES.filter((c) => L.matchesCourseSearch(c, 'pre k')).length === L.COURSES.filter((c) => c.grade.startsWith('PK')).length && L.COURSES.filter((c) => L.matchesCourseSearch(c, 'pr')).some((c) => c.grade.startsWith('PK')));
  ok('a search matches letter by letter as it is typed', L.COURSES.filter((c) => L.matchesCourseSearch(c, 'ki')).some((c) => c.grade === 'K') && L.COURSES.filter((c) => L.matchesCourseSearch(c, 'k')).length > 0);
  // The student's own summary
  { const ids = L.getCourse('fractions-intro').modules.map((m) => m.id); const p5 = (id, at, c) => ({ type: 'attempt_completed', at, startedAt: at, moduleId: id, seed: 1, core: [], review: null, coreCorrect: c, coreTotal: 5 });
    ok('a student with no rounds is told the easy first step', L.studentSummary([], ids)[0].includes('Open a module and try one'));
    ok('mastery is named and what it unlocks is explained', L.studentSummary([p5('fraction-meaning', 't1', 5)], ids).join(' ').includes('Because you know what a fraction means, **equivalent fractions** is open'));
    ok('a run of misses is framed as where learning happens', L.studentSummary([p5('fraction-meaning', 't1', 5), p5('equivalent-fractions', 't2', 1), p5('equivalent-fractions', 't3', 2), p5('equivalent-fractions', 't4', 1)], ids).join(' ').includes('A wrong answer shows you exactly what to learn next'));
    ok('a run of wins is named as a streak', L.studentSummary([p5('fraction-meaning', 't1', 5), p5('equivalent-fractions', 't2', 5), p5('comparing-fractions', 't3', 5)], ids).join(' ').includes('streak: 3 rounds mastered in a row'));
    ok('the summary is at least three sentences once there is anything to say', L.studentSummary([p5('fraction-meaning', 't1', 5)], ids).length >= 3); }
}

{ // Pictures are not recycled: no two lessons share an identical example picture (captions aside).
  const seen = new Map();
  // Dots, swatches and traced strokes are the concept itself (three dots is three), so those may repeat; drawings may not.
  for (const m of L.MODULES) { const ex = m.lesson.example; if (!ex || ['dots', 'swatch', 'trace'].includes(ex.kind)) continue; const key = JSON.stringify({ ...ex, caption: undefined }); seen.set(key, [...(seen.get(key) || []), m.id]); }
  const dup = [...seen.entries()].filter(([, ids]) => ids.length > 1);
  ok('no two lessons share an identical example picture', dup.length === 0, dup.map(([k, ids]) => `${k.slice(0, 40)} -> ${ids.join(',')}`).join(' | '));
}
{ // Grade completion counts mastered, placed-past and quick-check-passed modules, and only courses the student was given.
  const evs = [L.makeCoursesEnabledEvent(['counting-k'], 't')]; const ids = L.enabledCourseIds(evs);
  ok('a grade with nothing mastered is not complete', !L.gradeCompleted(evs, 'K', ids));
  const done = L.getCourse('counting-k').modules.map((m) => ({ type: 'placed', at: 't2', moduleIds: [m.id] }));
  ok('a grade whose every given module was placed past is complete', L.gradeCompleted([...evs, ...done], 'K', ids));
  ok('a grade whose courses were never given is not complete', !L.gradeCompleted([...evs, ...done], '1', ids));
  ok('completedGrades lists it once', JSON.stringify(L.completedGrades([...evs, ...done])) === '["K"]');
  let r = L.addStudent(L.emptyRoster(), 'S-9', 't', { level: 'early' }).roster;
  r = L.setCertificateState(r, 'S-9', 'K', 'skipped');
  ok('a skipped certificate is remembered and pending ones are the rest', L.certificatesPending(L.findStudent(r, 'S-9'), ['K', '1']).join() === '1');
}
{ // Taught before asked: a ratchet on tools/untaught.mjs. History is clean; the rest may only shrink.
  const STOP = new Set(['yes', 'no', 'true', 'false', 'same', 'different', 'more', 'fewer', 'less', 'bigger', 'smaller', 'both', 'neither', 'none', 'all']);
  const wordy = (a) => typeof a === 'string' && !/\d/.test(a) && a.trim().split(/\s+/).length <= 3 && !STOP.has(a.toLowerCase().replace(/[.!]$/, '')) && !/^(dots|shape|item|pic|art|icon|swatch|letters|solid|face):/.test(a) && a.length > 1;
  const untaught = (m) => { const ex = m.lesson.example || {}; const taught = [...m.lesson.paragraphs, m.lesson.keyIdea, ex.caption || '', ex.formula || '', ex.text || '', ...(m.lesson.script || []).map((x) => x.say)].join(' ').toLowerCase();
    for (const g of new Set(m.generators)) for (let seed = 1; seed <= 40; seed++) { const q = L.generateQuestion(g, seed); if (q.type !== 'choice' || !wordy(q.answer)) continue; const a = String(q.answer).toLowerCase().replace(/[.!]$/, ''); if (!taught.includes(a) && !`${q.story || ''} ${q.prompt || ''}`.toLowerCase().includes(a)) return true; } return false; };
  const flagged = L.MODULES.filter((m) => L.getCourse(m.courseId).subject !== 'Reading' && untaught(m)); const history = flagged.filter((m) => ['History', 'Science'].includes(L.getCourse(m.courseId).subject));
  ok('every history and science question asks only what its lesson said', history.length === 0, history.map((m) => m.id).join(','));
  ok('no lesson, in any subject, lets a question ask a recall answer it never said', flagged.length === 0, flagged.map((m) => m.id).join(','));
  ok('a wrong answer can point back to its lesson sentence', /halogens/i.test(L.taughtLine('periodic-table', 'Halogens') || '') && L.taughtLine('fraction-meaning', '3/4') === null);
}
{ // Stories met: one line per module, first opening counts, nothing about the child.
  const evs = [L.makeStoryReadEvent('cells', '2026-09-20T10:00:00.000Z'), L.makeStoryReadEvent('cells', '2026-09-21T10:00:00.000Z'), L.makeStoryReadEvent('ratios', '2026-09-22T10:00:00.000Z')];
  const read = L.storiesRead(evs);
  ok('a story is listed once, at its first opening', read.length === 2 && read[0].moduleId === 'cells' && read[0].at.startsWith('2026-09-20'));
  ok('a story event carries only the module and the time', Object.keys(L.makeStoryReadEvent('cells', 't')).sort().join() === 'at,moduleId,type');
}
{ // The story as a reward (pass MD, Mikey: "They can play after the lesson as a reward like you mentioned."): in a read-aloud
  // course the first passed round of a lesson with a story earns it, once (a passed round, four of five right first time; the
  // star waits for another day); a story already read is never due again.
  const due = (evs, o) => L.rewardStoryDue(evs, 'red-and-blue', o);
  const all = { passed: true, readAloud: true, hasStory: true };
  ok('the reward is due after a passed round of a read-aloud lesson whose story was never read', due([], all) === true);
  ok('it is not due after a round that was not passed', due([], { ...all, passed: false }) === false);
  ok('it is not due outside a read-aloud course, where View story already comes before practice', due([], { ...all, readAloud: false }) === false);
  ok('it is not due for a lesson with no story', due([], { ...all, hasStory: false }) === false);
  ok('it is due once: a story read before is never offered as a reward again', due([L.makeStoryReadEvent('red-and-blue', '2026-10-01T10:00:00.000Z')], all) === false
    && due([L.makeStoryReadEvent('find-the-match', '2026-10-01T10:00:00.000Z')], all) === true);
  // Every read-aloud course's lessons: the rule asks for a story the screen can open (STORIES), so a lesson with none never shows a book.
  const { STORIES: RW_STORIES } = await import('../src/stories.mjs');
  const raLessons = L.COURSES.filter((c) => c.readAloud).flatMap((c) => c.modules);
  const withStory = raLessons.filter((m) => RW_STORIES[m.id]);
  // The count is what this line tests (the code check, pass MD: an every() over hasStory: true could never fail); the screen
  // asks the rule with the story the screen can open, so a lesson with none never shows a book.
  ok('the read-aloud courses carry lesson stories to give as rewards (every lesson but tracing pages and a few others)', withStory.length >= 150, `${withStory.length} of ${raLessons.length}`);
  { const ui = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8');
    ok("the screen asks for the reward with the story it can open, and the reward is never watched as a read again", /rewardStoryDue\(record\.events, mod\.id, \{ passed: mastered, readAloud: true, hasStory: !!storyFor\(mod\.id\) \}\)/.test(ui) && /const openRewardStory = \(\) => \{ storyReading\.current = null;/.test(ui)); }
  // An early learner's heard lesson stories (pass MD, the code and screen checks): newest first, a read to the end counting as
  // heard again, only lessons of the courses given that have a story, never a course story and never one not heard, and since
  // pass ME every one of them (Mikey, Q18: "all"), grouped by course for the shelf. Real courses, not a hand-made order.
  const vfs = L.getCourse('very-first-steps-pk3'); const day = (d) => `2026-10-${String(d).padStart(2, '0')}T10:00:00.000Z`;
  const heard = [L.makeStoryReadEvent('find-the-match', day(2)), L.makeStoryReadEvent('red-and-blue', day(3)), L.makeStoryReadEvent('course:very-first-steps-pk3', day(4)), L.makeStoryRereadEvent('find-the-match', day(5), 'shelf', day(5))];
  ok("an early learner's heard lesson stories come newest first, a read again counting, never a course story and never one not heard", L.heardModuleStories(heard.slice(0, 3), [vfs]).join() === 'red-and-blue,find-the-match' && L.heardModuleStories(heard, [vfs]).join() === 'find-the-match,red-and-blue', L.heardModuleStories(heard, [vfs]));
  ok('only the lessons of the courses given, and only those with a story, are listed', L.heardModuleStories(heard, []).length === 0 && L.heardModuleStories(heard, [vfs], (id) => id !== 'red-and-blue').join() === 'find-the-match');
  const nine = vfs.modules.filter((m) => RW_STORIES[m.id]).slice(0, 9).map((m, i) => L.makeStoryReadEvent(m.id, day(i + 1)));
  ok("every story heard stays on the shelf, newest first (Mikey, Q18: all), and nothing in the code caps it", nine.length === 9 && L.heardModuleStories(nine, [vfs]).join() === nine.slice().reverse().map((e) => e.moduleId).join() && !/HEARD_STORIES_SHOWN/.test(readFileSync(new URL('../src/logic.mjs', import.meta.url), 'utf8')));
  // The groups: the course with the newest story first, its stories newest first inside it; a story of a course not given is
  // left out, and a course with nothing heard has no group.
  const lap = L.getCourse('listen-and-point-pk3'); const lapStory = lap.modules.find((m) => RW_STORIES[m.id]).id;
  const mixed = [...nine.slice(0, 2), L.makeStoryReadEvent(lapStory, day(3)), L.makeStoryReadEvent(nine[2].moduleId, day(4))];
  const groups = L.heardStoryGroups(mixed, [vfs, lap]);
  ok('the shelf groups the heard stories by course, the course with the newest story first and newest first inside it', groups.map((g) => `${g.courseId}:${g.moduleIds.join('+')}`).join('|') === `very-first-steps-pk3:${nine[2].moduleId}+${nine[1].moduleId}+${nine[0].moduleId}|listen-and-point-pk3:${lapStory}`, groups);
  ok('a group holds only stories of a course given, and a course with nothing heard has no group', L.heardStoryGroups(mixed, [lap]).map((g) => g.courseId).join() === 'listen-and-point-pk3' && L.heardStoryGroups(nine, [vfs, lap]).length === 1);
  // The surprise-me book (pass MF, Mikey's Q18 "good idea"): the pick is from the list given, never the story read last while
  // another is there, every story reachable by some chance, and with one story that one; nothing with none.
  { const three = ['find-the-match', 'red-and-blue', 'big-and-little'];
    const picks = new Set(Array.from({ length: 200 }, (_, i) => L.pickSurpriseStory(three, i / 200, null)));
    ok('the surprise book picks from the heard stories, and every one of them can come up', [...picks].every((id) => three.includes(id)) && picks.size === 3, [...picks]);
    const avoided = Array.from({ length: 200 }, (_, i) => L.pickSurpriseStory(three, i / 200, 'red-and-blue'));
    ok('the surprise book never reads the story it read last while another is there', avoided.every((id) => id !== 'red-and-blue') && new Set(avoided).size === 2, [...new Set(avoided)]);
    ok('with two stories the pick is always the other one, with one story that one, and with none nothing', L.pickSurpriseStory(['a', 'b'], 0.9, 'a') === 'b' && L.pickSurpriseStory(['a', 'b'], 0.1, 'b') === 'a' && L.pickSurpriseStory(['a'], 0.5, 'a') === 'a' && L.pickSurpriseStory([], 0.5, null) === null);
    ok('a chance at either edge, or none at all, still lands on a story', L.pickSurpriseStory(three, 1, null) === 'big-and-little' && L.pickSurpriseStory(three, 0, null) === 'find-the-match' && three.includes(L.pickSurpriseStory(three, NaN, null)));
    ok('the shelf shows the surprise book from two heard stories, a number the screen reads from logic', L.SURPRISE_BOOK_FROM === 2 && /SURPRISE_BOOK_FROM/.test(readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8')));
    // The cover shelf (Q18): a group shows as covers only once every story in it is painted.
    const painted = new Set(['find-the-match', 'red-and-blue']);
    ok('a group of heard stories shows as covers only when every story in it is painted, never with one missing or none at all', L.coverShelfReady(['find-the-match', 'red-and-blue'], (id) => painted.has(id)) === true && L.coverShelfReady(three, (id) => painted.has(id)) === false && L.coverShelfReady([], () => true) === false && L.coverShelfReady(['find-the-match']) === false); }
  // A course is finished when every lesson has its star (Q17), and a round finishes it only when the star it earned was the last.
  const ids = vfs.modules.map((m) => m.id);
  const att = (id, at, marks = [1, 1, 1, 1, 1]) => L.makeAttemptEvent({ moduleId: id, seed: 1 }, marks.map((c) => ({ correct: !!c, ms: 3000 })), null, at, at);
  const starred = ids.flatMap((id) => [att(id, '2026-10-01T10:00:00.000Z'), att(id, '2026-10-02T10:00:00.000Z')]);
  const butLast = starred.slice(0, -1); const lastRound = starred[starred.length - 1];
  const before = L.deriveProgress(butLast); const after = L.deriveProgress(starred);
  ok('a course is finished when every lesson is mastered, not while the last star waits for another day', !L.isCourseFinished(before.masteredIds, vfs) && L.isCourseFinished(after.masteredIds, vfs) && !L.isCourseFinished(after.masteredIds, null));
  ok('the round that earned the last star finishes the course, and no other round does', L.courseFinishedBy(after, vfs, lastRound) === true && L.courseFinishedBy(before, vfs, butLast[butLast.length - 1]) === false);
  const again = att(ids[0], '2026-10-03T10:00:00.000Z');
  ok('a round on a lesson that already had its star finishes nothing, so a finished course is celebrated once', L.courseFinishedBy(L.deriveProgress([...starred, again]), vfs, again) === false);
  const sameDay = att(ids[ids.length - 1], '2026-10-01T11:00:00.000Z');   // the last lesson passed again on the day of its first pass: the star still waits
  ok('a pass that leaves the star for another day finishes nothing', L.courseFinishedBy(L.deriveProgress([...butLast, sameDay]), vfs, sameDay) === false);
  // The course to go on to (pass ME): a locked grade 1 course listed first is skipped; a lesson passed today is skipped for the next
  // open one; no kindergarten while any pre-K lesson is unmastered, and kindergarten once every one is; Math before Reading at
  // one grade. The courses are the real ones, the statuses the real moduleStatuses over seeded events.
  { const fs = L.getCourse('first-steps-pk'); const sounds = L.getCourse('first-sounds-pk'); const kc = L.getCourse('counting-k'); const n1 = L.getCourse('numbers-1');
    const enabled = ['numbers-1', 'first-steps-pk', 'first-sounds-pk', 'counting-k']; const shown = [n1, fs, sounds, kc];
    const now = '2026-10-12T12:00:00.000Z'; const stars = (c, d1, d2) => c.modules.flatMap((m) => [att(m.id, d1), att(m.id, d2)]);
    const pick = (events, courses, courseId) => { const p = L.deriveProgress(events); const r = L.nextCourseToStart(courseId, courses, L.moduleStatuses(p, enabled), events, now); return r ? [r.course.id, r.module.id] : null; };
    const fsDone = stars(fs, '2026-10-01T10:00:00.000Z', '2026-10-02T10:00:00.000Z');
    const soundsFirst = [...sounds.modules].sort((a, b) => a.order - b.order);
    ok('after First Steps the pick skips the grade 1 course the finish switched on, whose lessons are locked, and lands on First Sounds\' first lesson', JSON.stringify(pick(fsDone, shown, 'first-steps-pk')) === JSON.stringify(['first-sounds-pk', soundsFirst[0].id]));
    const passedToday = [...fsDone, att(soundsFirst[0].id, '2026-10-12T09:00:00.000Z')];
    ok('a lesson passed today waits for its star, so the pick goes on to the lesson its pass opened', JSON.stringify(pick(passedToday, shown, 'first-steps-pk')) === JSON.stringify(['first-sounds-pk', soundsFirst[1].id]));
    const passedYesterday = [...fsDone, att(soundsFirst[0].id, '2026-10-11T09:00:00.000Z')];
    ok('a lesson passed on another day is open to pass again', JSON.stringify(pick(passedYesterday, shown, 'first-steps-pk')) === JSON.stringify(['first-sounds-pk', soundsFirst[0].id]));
    const allPreKToday = [...fsDone, ...sounds.modules.map((m) => att(m.id, '2026-10-12T09:00:00.000Z'))];
    ok('while a pre-K lesson is unmastered the pick never reaches kindergarten, even with nothing open in pre-K today', pick(allPreKToday, shown, 'first-steps-pk') === null);
    const allPreKDone = [...fsDone, ...stars(sounds, '2026-10-03T10:00:00.000Z', '2026-10-04T10:00:00.000Z')];
    const kcFirst = [...kc.modules].sort((a, b) => a.order - b.order).find((m) => L.moduleStatuses(L.deriveProgress(allPreKDone), enabled).find((s) => s.id === m.id).status === 'available');
    ok('with every pre-K lesson starred, kindergarten opens, before the locked grade 1 course', !!kcFirst && JSON.stringify(pick(allPreKDone, shown, 'first-sounds-pk')) === JSON.stringify(['counting-k', kcFirst.id]));
    const fsFirst = [...fs.modules].sort((a, b) => a.order - b.order)[0];
    ok('at one grade Math comes before Reading, the screen\'s own order, whatever order the courses are listed in', JSON.stringify(pick([], [sounds, fs], 'none')) === JSON.stringify(['first-steps-pk', fsFirst.id]));
    // Grade order with the pre-K rule out of the way: a kindergarten lesson passed two days ago is open again, and comes before
    // the grade 1 lesson that pass opened, however the courses are listed.
    const sk = L.getCourse('science-k'); const s1 = L.getCourse('science-1'); const skFirst = [...sk.modules].sort((a, b) => a.order - b.order)[0]; const s1First = [...s1.modules].sort((a, b) => a.order - b.order)[0];
    const kPassed = [...allPreKDone, att(skFirst.id, '2026-10-10T09:00:00.000Z')];
    const pickK = (courses) => { const p = L.deriveProgress(kPassed); const r = L.nextCourseToStart('first-sounds-pk', courses, L.moduleStatuses(p, [...enabled, 'science-k', 'science-1']), kPassed, now); return r ? [r.course.id, r.module.id] : null; };
    ok('the youngest grade with an open lesson comes first, however the courses are listed', L.moduleStatuses(L.deriveProgress(kPassed), [...enabled, 'science-k', 'science-1']).find((x) => x.id === s1First.id).status === 'available' && JSON.stringify(pickK([s1, sk])) === JSON.stringify(['science-k', skFirst.id]) && JSON.stringify(pickK([sk, s1])) === JSON.stringify(['science-k', skFirst.id]));
    ok('a course the screen does not show is never picked', pick(fsDone, [n1, fs], 'first-steps-pk') === null); }
  // A last star earned by a Quick Review's fresh try (after a Move Forward on a lesson never mastered) finishes the course too.
  const lastId = ids[ids.length - 1]; const moved = L.makeMovedForwardEvent ? L.makeMovedForwardEvent(lastId, '2026-10-03T10:00:00.000Z') : { type: 'moved_forward', at: '2026-10-03T10:00:00.000Z', moduleId: lastId };
  const fresh = { type: 'light_review_completed', at: '2026-10-25T10:00:00.000Z', moduleId: lastId, stage: 'fresh', outcome: 'clear', correct: 5, total: 5, results: [] };
  const byReview = L.deriveProgress([...butLast.filter((e) => e.moduleId !== lastId), moved, fresh]);
  ok('a clear fresh try that earns the last star finishes the course (the review\'s result screen celebrates it)', byReview.perModule[lastId].mastered && L.courseFinishedBy(byReview, vfs, fresh) === true);
  // The words for a finished course (pass MG, Mikey's answer to Q24, "calmer"): Hooray through grade 5, a calmer Well done from
  // grade 6 up, college included, with the reader's result line calm to match; every read-aloud course hears Hooray.
  { const byGrade = (g) => L.COURSES.find((c) => c.grade === g && !c.elective) || L.COURSES.find((c) => c.grade === g);
    const g5 = byGrade('5'); const g6 = byGrade('6'); const col = byGrade('C');
    const w5 = L.courseFinishedWords(g5); const w6 = L.courseFinishedWords(g6); const wc = L.courseFinishedWords(col); const wv = L.courseFinishedWords(vfs);
    ok('a finished course through grade 5 says Hooray, the whole course and its name in title case, with a lively result line', !!g5 && w5.cheer === `Hooray! You finished the whole course, ${L.titleCase(g5.title)}!` && w5.result === 'That was the whole course!' && !w5.calm && wv.cheer.startsWith('Hooray!'));
    ok('from grade 6 up, college too, the line is calmer: Well done, and the course by name (Q24)', !!g6 && !!col && w6.cheer === `Well done. You finished ${L.titleCase(g6.title)}.` && wc.cheer === `Well done. You finished ${L.titleCase(col.title)}.` && w6.result === 'That was the whole course.' && w6.calm && wc.calm);
    ok('every read-aloud course is younger than grade 6, so every child who hears the page hears the party', L.COURSES.filter((c) => c.readAloud).every((c) => !L.courseFinishedWords(c).calm));
    ok('the calm line starts at grade 6 exactly, the band electives of grades 6 to 8 included', L.CALM_CHEER_FROM === '6' && L.COURSES.filter((c) => L.GRADES.indexOf(c.grade) >= L.GRADES.indexOf('6')).every((c) => L.courseFinishedWords(c).calm) && L.COURSES.filter((c) => L.GRADES.indexOf(c.grade) < L.GRADES.indexOf('6')).every((c) => !L.courseFinishedWords(c).calm)); }
  // Two celebrations a course (pass MH, Mikey: "Even for early readers, they should be launched into the long story at the end of
  // a completed course (both 1st and 2nd time on different days)" and "I saw an arrow and not an unlocked long story"): the round
  // that passes the course's last unpassed lesson, and the round that earns its last star, each open a long story.
  { const once = ids.map((id) => att(id, '2026-10-01T10:00:00.000Z'));
    const butLastOnce = once.slice(0, -1); const lastOnce = once[once.length - 1];
    const pOnce = L.deriveProgress(once); const pBefore = L.deriveProgress(butLastOnce);
    ok('a course is completed when every lesson is passed once, and not one lesson sooner', L.isCourseCompleted(pOnce.passedIds, vfs) && !L.isCourseCompleted(pBefore.passedIds, vfs) && !L.isCourseCompleted(pOnce.passedIds, null));
    ok('the round whose pass was the course\'s last first pass completes it, and no other round does', L.courseCompletedBy(pOnce, vfs, lastOnce) === true && L.courseCompletedBy(pBefore, vfs, butLastOnce[butLastOnce.length - 1]) === false);
    const againSameDay = att(ids[0], '2026-10-01T12:00:00.000Z');
    ok('a pass of a lesson passed before completes nothing, so the first celebration comes once', L.courseCompletedBy(L.deriveProgress([...once, againSameDay]), vfs, againSameDay) === false);
    const other = L.COURSES.find((c) => c.id !== vfs.id && c.modules.length);
    ok('a round of another course never completes this one', L.courseCompletedBy(pOnce, other, lastOnce) === false);
    // A lesson starred by a Quick Review after a Move Forward, or placed by a quick check, was passed before its first round, so
    // that round completes nothing (the browser walk found the first: the course celebrated a second time).
    const lastId0 = ids[ids.length - 1]; const movedAt = '2026-10-03T10:00:00.000Z'; const freshAt = '2026-10-25T10:00:00.000Z';
    const reviewed = [...once.slice(0, -1), { type: 'moved_forward', at: movedAt, moduleId: lastId0 }, { type: 'light_review_completed', at: freshAt, moduleId: lastId0, stage: 'fresh', outcome: 'clear', correct: 5, total: 5, results: [] }];
    const laterRound = att(lastId0, '2026-10-27T10:00:00.000Z');
    const placedFirst = [...once.slice(0, -1), { type: 'placed', at: '2026-10-02T10:00:00.000Z', moduleIds: [lastId0] }];
    const afterPlaced = att(lastId0, '2026-10-04T10:00:00.000Z');
    const freshEvent = reviewed[reviewed.length - 1];
    ok('a Quick Review\'s clear fresh try on the last lesson never passed completes the course, the first celebration', L.courseCompletedBy(L.deriveProgress(reviewed), vfs, freshEvent) === true && L.courseCelebrationStage(L.deriveProgress(reviewed), vfs, freshEvent) === 'complete');
    ok('a first round on a lesson already starred by a review, or placed by a quick check, completes nothing', L.courseCompletedBy(L.deriveProgress([...reviewed, laterRound]), vfs, laterRound) === false && L.courseCompletedBy(L.deriveProgress([...placedFirst, afterPlaced]), vfs, afterPlaced) === false);
    // A quick check that completes a course celebrates (pass MI, Mikey's answer to Q37: "celebrate"): the placed event its pass
    // appends is the first finish when it placed the course's last lesson not yet passed.
    const qcEvent = { type: 'placed', at: '2026-10-02T09:00:00.000Z', subject: vfs.subject, startGrade: null, moduleIds: [lastId0], quickCheck: true };
    const pQuick = L.deriveProgress([...once.slice(0, -1), qcEvent]);
    ok("a quick check that places the course's last unpassed lesson completes it, the first celebration (Q37)", L.courseCompletedByQuickCheck(pQuick, vfs, qcEvent) === true && L.courseCelebrationStage(pQuick, vfs, qcEvent) === 'complete');
    const subjectPlaced = { ...qcEvent, quickCheck: false };
    ok('a quick check that leaves a lesson unpassed, a subject placement, a lesson passed before and another course celebrate nothing', L.courseCelebrationStage(L.deriveProgress([...once.slice(0, -2), qcEvent]), vfs, qcEvent) === null && L.courseCelebrationStage(L.deriveProgress([...once.slice(0, -1), subjectPlaced]), vfs, subjectPlaced) === null && L.courseCompletedByQuickCheck(L.deriveProgress([...once, qcEvent]), vfs, qcEvent) === false && L.courseCompletedByQuickCheck(pQuick, other, qcEvent) === false);
    ok('the stage is complete at the first finish, mastered at the last star, and none for any other round', L.courseCelebrationStage(pOnce, vfs, lastOnce) === 'complete' && L.courseCelebrationStage(after, vfs, lastRound) === 'mastered' && L.courseCelebrationStage(L.deriveProgress([...starred, again]), vfs, again) === null && L.courseCelebrationStage(pBefore, vfs, butLastOnce[butLastOnce.length - 1]) === null);
    // The story each celebration opens, and the line that brings it in.
    const cs1 = L.celebrationStory('x', 'complete', { hasFirst: true, hasSecond: true }); const cs2 = L.celebrationStory('x', 'mastered', { hasFirst: true, hasSecond: true });
    const cs3 = L.celebrationStory('x', 'mastered', { hasFirst: true, firstRead: true }); const cs4 = L.celebrationStory('x', 'mastered', { hasFirst: true, firstRead: false });
    ok('the first celebration opens the first long story; the second opens the next one, or the first again said as again only once it was read', cs1.id === 'course:x' && cs1.line === 'Here is its story.' && cs2.id === 'mastery:x' && cs2.line === 'Here is a new story.' && cs3.id === 'course:x' && cs3.line === 'Here is its story again.' && cs4.line === 'Here is its story.' && L.celebrationStory('x', 'complete', {}) === null && L.celebrationStory('x', 'mastered', { hasSecond: true }).id === 'mastery:x');
    // The rows a shelf and the Story Log show: the first opens with every lesson passed, the next with every star.
    const first = (id) => (id === vfs.id ? { title: 'One' } : null); const next = (id) => (id === vfs.id ? { title: 'Two' } : null);
    const rowsAt = (p, preview = false) => L.longStoryRows([vfs, other], p, first, next, preview).map((r) => `${r.id}:${r.unlocked ? 'open' : r.left + r.unit}`).join(' ');
    ok('the shelf\'s long-story rows open the first story at the first finish and the next one at the last star, each counting what is left', rowsAt(L.deriveProgress([])) === `course:${vfs.id}:${ids.length}pass mastery:${vfs.id}:${ids.length}master` && rowsAt(pOnce) === `course:${vfs.id}:open mastery:${vfs.id}:${ids.length}master` && rowsAt(after) === `course:${vfs.id}:open mastery:${vfs.id}:open` && rowsAt(L.deriveProgress([]), true) === `course:${vfs.id}:open mastery:${vfs.id}:open`, rowsAt(pOnce));
    ok('an early learner\'s shelf lists only the open rows, decided in logic (the code check)', L.longStoryRows([vfs, other], pOnce, first, next, false, true).map((r) => r.id).join(' ') === `course:${vfs.id}` && L.longStoryRows([vfs], L.deriveProgress([]), first, next, false, true).length === 0);
    ok('a course with no next long story shows only its first, and one with no long story shows none', L.longStoryRows([vfs], pOnce, first).length === 1 && L.longStoryRows([other], pOnce, first, next).length === 0);
    ok('a long story\'s read id names its kind and its course', L.isLongStoryId('course:abc') && L.isLongStoryId('mastery:abc') && !L.isLongStoryId('count-to-5') && !L.isLongStoryId('course:') && L.longStoryCourseId('mastery:very-first-steps-pk3') === 'very-first-steps-pk3' && L.longStoryCourseId('count-to-5') === null);
    // The words of each celebration.
    const g5 = L.COURSES.find((c) => c.grade === '5' && !c.elective); const g6 = L.COURSES.find((c) => c.grade === '6' && !c.elective);
    const t = (c) => L.titleCase(c.title);
    ok('the first celebration says every lesson: did for a child who hears it, passed for a reader, calm from grade 6', L.courseFinishedWords(vfs, 'complete').cheer === `Hooray! You did every lesson in ${t(vfs)}!` && L.courseFinishedWords(g5, 'complete').cheer === `Hooray! You passed every lesson in ${t(g5)}!` && L.courseFinishedWords(g6, 'complete').cheer === `Well done. You passed every lesson in ${t(g6)}.` && L.courseFinishedWords(g5, 'complete').result === 'That was every lesson in the course!' && L.courseFinishedWords(g6, 'complete').result === 'That was every lesson in the course.');
    ok('the second says every star to a child who hears it, the whole course to a reader, and is the default', L.courseFinishedWords(vfs, 'mastered').cheer === `Hooray! You earned every star in ${t(vfs)}!` && L.courseFinishedWords(vfs).cheer === L.courseFinishedWords(vfs, 'mastered').cheer && L.courseFinishedWords(g5).cheer === `Hooray! You finished the whole course, ${t(g5)}!`);
    // The Story Log reads the same rows, each with when it was first read.
    const enabledVfs = [L.makeCoursesEnabledEvent([vfs.id], '2026-09-30T10:00:00.000Z')];
    const log = L.storyLogAvailable([...enabledVfs, ...once, L.makeStoryReadEvent(`course:${vfs.id}`, '2026-10-01T11:00:00.000Z')], () => null, first, next);
    const byId = Object.fromEntries(log.longs.map((l) => [l.moduleId, l]));
    ok('the Story Log lists the first long story open and read and the next one locked with its stars to earn', byId[`course:${vfs.id}`].unlocked && byId[`course:${vfs.id}`].at === '2026-10-01T11:00:00.000Z' && !byId[`mastery:${vfs.id}`].unlocked && byId[`mastery:${vfs.id}`].left === ids.length && byId[`mastery:${vfs.id}`].unit === 'master' && byId[`mastery:${vfs.id}`].at === null);
    ok('a shelf read of either long story is the student\'s own choice, an elective read', L.rereadIsElective([L.makeStoryReadEvent(`mastery:${vfs.id}`, '2026-10-02T10:00:00.000Z')], `mastery:${vfs.id}`, 'lesson') === true); }
}
ok('no pairs deck repeats a card, so every card has exactly one twin', Object.entries(L.PAIR_DECKS).every(([, deck]) => { const texts = deck.flat(); return new Set(texts).size === texts.length && deck.every((pr) => pr.length === 2); }), Object.entries(L.PAIR_DECKS).filter(([, deck]) => { const texts = deck.flat(); return new Set(texts).size !== texts.length; }).map(([k]) => k).join(','));
// Variety: every module that is not a tracing page yields at least four different questions across many seeds,
// so a repeat round is not the same round; a triple dose is three times the questions at the same scaled bar.
{
  const thin = L.MODULES.filter((m) => !m.generators.some((g) => /trace|mark/.test(g))).map((m) => { const set = new Set(); for (let s = 1; s <= 80; s++) { const q = L.generateQuestion(m.generators[s % m.generators.length], s * 7919 + 13); set.add(`${q.story}|${q.prompt}|${q.answer}`); } return [m.id, set.size]; }).filter(([, n]) => n < 4);
  ok('every non-tracing module has at least four different questions', thin.length === 0, thin.map(([id, n]) => `${id}:${n}`).join(','));
  const a = L.buildAttempt('fraction-meaning', 5, [], { dose: 3 });
  ok('a triple dose asks three times the questions', a.core.length === L.moduleRules('fraction-meaning').questions * 3 && a.dose === 3);
  const ev = { type: 'attempt_completed', moduleId: 'fraction-meaning', coreCorrect: 11, coreTotal: 15 };
  ok('a triple dose keeps the same bar, scaled', !L.isMasteredAttempt(ev) && L.isMasteredAttempt({ ...ev, coreCorrect: 12 }));
  const avoid = L.buildAttempt('sound', 9, [], { avoid: ['What makes a sound?'] });
  ok('a round avoids the prompts of the last rounds when it can', !avoid.core.some((q) => q.prompt === 'What makes a sound?'));
}
{
  // The memory check favors a mastered module with recent misses: over many seeds it is chosen far more often than chance.
  const mastered = ['count-to-10', 'shapes', 'sorting'].filter((id) => L.getModule(id));
  if (mastered.length >= 2) {
    const target = mastered[0]; let hits = 0; const N = 60;
    for (let s = 1; s <= N; s++) { const a = L.buildAttempt('making-ten', s, mastered, { missed: { [target]: 3 } }); if (a.review && a.review.moduleId === target) hits += 1; }
    ok('the memory check favors the most-missed mastered module', hits >= N * 0.45, `${hits} of ${N}`);
  }
  const ev = [{ type: 'attempt_completed', at: new Date().toISOString(), moduleId: 'sound', core: [{ correct: false }, { correct: true }], review: { moduleId: 'life-cycles', correct: false } }];
  const miss = L.recentMisses(ev);
  ok('recent misses count core and memory-check misses by module', miss.sound === 1 && miss['life-cycles'] === 1);
}
ok('remembrance days fire on their dates and stay quiet otherwise', L.remembranceFor('2026-05-25').id === 'memorial-day' && L.remembranceFor('2026-11-11').id === 'veterans-day' && L.remembranceFor('2026-09-11').id === 'september-11' && !L.remembranceFor('2026-05-18') && !L.remembranceFor('2026-03-03'));
{
  // Every read-aloud lesson yields a script with at least one spoken line and at least one card to show.
  const bad = L.MODULES.filter((m) => (L.getCourse(m.courseId) || {}).readAloud).map((m) => [m.id, L.readAloudScript(m)]).filter(([, sc]) => !sc.length || !sc.some((st) => st.say && st.say.trim()) || !sc.some((st) => st.show));
  ok('every read-aloud lesson has a script with a spoken line and a shown card', bad.length === 0, bad.map(([id]) => id).join(','));
}
ok('older students get longer rounds at the same bar', L.moduleRules('fraction-meaning').questions === 5 && L.moduleRules('ratios').questions === 8 && L.moduleRules('ratios').toMaster === 7 && L.moduleRules('functions').questions === 10 && L.moduleRules('functions').toMaster === 8 && L.buildAttempt('functions', 3, []).core.length === 10);
{
  // Let's Play rules (2026-09-23, Mikey): dots never overlap, connect-the-dots pictures grow down the list, the early
  // list never puts two of a kind side by side, and older students' games are spread so the kinds take turns.
  const close = Object.entries(L.DOT_SHAPES).map(([k, pts]) => [k, L.dotsTooClose(pts)]).filter(([, bad]) => bad.length);
  ok('no connect-the-dots picture has two dots closer than the gap', close.length === 0, close.map(([k, bad]) => `${k}:${JSON.stringify(bad)}`).join(' '));
  // The lessons' and questions' numbered dot pictures too (pass ML, the lesson check: the fish put dots 3 and 6 on one point, so
  // their numbers printed over each other): every TRACE_LETTERS picture with dots, its closing point left out.
  { const traced = Object.entries(L.TRACE_LETTERS).filter(([, d]) => d.dots).map(([k, d]) => { const pts = d.strokes[0]; const open = pts.length > 1 && pts[0][0] === pts[pts.length - 1][0] && pts[0][1] === pts[pts.length - 1][1] ? pts.slice(0, -1) : pts; return [k, L.dotsTooClose(open)]; }).filter(([, bad]) => bad.length);
    ok('no numbered dot picture in a lesson or question has two dots closer than the gap (pass ML)', traced.length === 0, traced.map(([k, bad]) => `${k}:${JSON.stringify(bad)}`).join(' ')); }
  // Patterns that no cue answers (pass ML, the lesson check): what comes next and what is missing are not always the row's first
  // shape, and rows that repeat and rows that do not each come with two kinds of shape and with three.
  { const first = { next: new Set(), missing: new Set() }; const kinds = { Yes: new Set(), No: new Set() }; const noStart = new Set();
    for (let s = 1; s <= 400; s++) { const n = L.generateQuestion('pp-what-next', s); first.next.add(String(n.answer).split('-')[0].replace('item:', '') === n.visual.items[0]);
      const m = L.generateQuestion('pp-missing', s); const it = m.visual.items; first.missing.add(String(m.answer).split('-')[0].replace('item:', '') === (it[0] === '?' ? it[1] : it[0]));
      const r = L.generateQuestion('pp-which-repeats', s); kinds[r.answer].add(new Set(r.visual.items).size); if (r.answer === 'No' && new Set(r.visual.items).size === 2) noStart.add(r.visual.items[0] === r.visual.items[1]); }
    ok('a pattern question cannot be passed by the row\'s first shape or by its kinds of shape (pass ML)', first.next.size === 2 && first.missing.size === 2 && kinds.Yes.has(2) && kinds.Yes.has(3) && kinds.No.has(2) && kinds.No.has(3) && noStart.size === 2, JSON.stringify({ next: [...first.next], missing: [...first.missing], yes: [...kinds.Yes], no: [...kinds.No], twoShapeNoStartsWithTwoAlike: [...noStart] })); }
  const dotGames = L.GAMES.filter((g) => g.kind === 'dots');
  ok('every dots game draws a listed picture and none is the name', dotGames.every((g) => L.DOT_SHAPES[g.shape]) && !dotGames.some((g) => g.shape === 'name'));
  const counts = dotGames.map((g) => L.DOT_SHAPES[g.shape].length);
  ok('connect-the-dots pictures get more dots down the list', counts.every((n, i) => i === 0 || n >= counts[i - 1]), counts.join(','));
  const early = L.gamesFor('2');   // what the oldest young learner sees, in list order
  ok('the early games never put two of a kind side by side', early.every((g, i) => i === 0 || g.kind !== early[i - 1].kind), early.map((g) => g.kind[0]).join(''));
  // The kinds that suit any older student (decks, Pong, Quick fire, order, and rule, jump, map and balance games not for the
  // youngest), the pool these spreading checks read. Since pass MC playList also lists every game of an older student's own
  // courses; the Let's Play block below walks that whole list for every course.
  const older = L.GAMES.filter((g) => g.deck || g.kind === 'pong' || g.kind === 'sprint' || g.kind === 'order' || ((g.rule || g.jump || g.map || g.balance) && !g.young));
  // Rule decks (2026-09-23): two named groups, nothing in both, every word short enough for a chip, and every rule game names one.
  const deckBad = Object.entries(L.RULE_DECKS).flatMap(([id, d]) => [...(d.a.items.length < 4 || d.b.items.length < 4 ? [`${id} is short`] : []), ...d.a.items.filter((x) => d.b.items.includes(x)).map((x) => `${id} has ${x} in both`), ...[...d.a.items, ...d.b.items].filter((x) => !/^shape:/.test(x) && x.length > 11).map((x) => `${id}: ${x} is too long`)]);
  ok('every rule deck has two clean groups of short chips', deckBad.length === 0, deckBad.join(', '));
  ok('every rule game names a rule deck and the kinds are catch, path, buckets or ship', L.GAMES.filter((g) => g.rule).every((g) => L.RULE_DECKS[g.rule] && ['catch', 'path', 'buckets', 'ship'].includes(g.kind)));
  // The space shooter runs until failure (pass MI, Mikey: "let's make the objects being shot speed up gradually and keep going,
  // even past the 10 rounds it's set to now.  I want them to basically go until failure.  That said, we probably shouldn't have a
  // correct object immediately over an incorrect one ... Then the high score would say how far they were able to get before
  // failing."). The test plays it: a careful player aims at the lowest chip that fits and fires; an idle one never taps. Its own
  // seeded random stands in for the screen's.
  { const seeded = (seed) => () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const sp = Array.from({ length: 400 }, (_, k) => L.shipSpeed(k)); const gp = Array.from({ length: 400 }, (_, k) => L.shipGap(k));
    ok('each chip falls a little faster than the one before, with no ceiling, and comes a little sooner, down to half a second', sp[0] === 0.16 && sp.every((v, k) => k === 0 || v > sp[k - 1]) && Math.abs(sp[73] - 0.598) < 1e-9 && sp[399] > 1.2 && gp[0] === 70 && gp.every((v, k) => k === 0 || v <= gp[k - 1]) && gp[399] === 30);
    ok('a wave for every five fitting chips hit, and three shields', L.shipWave(0) === 1 && L.shipWave(4) === 1 && L.shipWave(5) === 2 && L.shipWave(23) === 5 && L.SHIP_SHIELDS === 3);
    // Mikey's answer to Q39 (pass MK, "both"): an older student starts further up the ramp, five chips a grade above grade 2 up to
    // twenty from grade 6, so a grade 6 student's first chip falls in about six seconds where grade 2's takes about ten.
    const fall = (start) => { const g = L.newShipGame(start); const r = seeded(5); let f = 0; while (!g.live.length && f < 100) { L.shipStep(g, 1, r, L.ruleDeck('even-odd')); f += 1; } return g.live.length ? 95 / g.live[0].speed / 60 : null; };
    ok('older students start the shooter faster: none before grade 3, five chips a grade, twenty from grade 6, and grade 6\'s first chip falls in about six seconds where grade 2\'s takes about ten',
      ['PK3', 'K', '1', '2', '3', '4', '5', '6', '9', 'C', 'Z', null].map(L.shipStartFor).join() === '0,0,0,0,5,10,15,20,20,20,0,0' && Math.abs(fall(0) - 9.9) < 0.2 && Math.abs(fall(L.shipStartFor('6')) - 5.7) < 0.3,
      [fall(0), fall(L.shipStartFor('6'))].join(' and '));
    ok('the play list and the shooter go by the same grade, the oldest of the student\'s courses', L.topGrade([{ grade: 'K' }, { grade: '6' }, { grade: '2' }]) === '6' && L.topGrade([]) === 'PK3');
    // A lost ship comes back on every tenth fitting chip hit, never past three (a chip and a shot set up to meet in one step).
    const backAt = (hits, shields) => { const g = L.newShipGame(); g.hits = hits; g.shields = shields; g.live = [{ id: 1, text: '4', yes: true, x: 50, y: 60, speed: 0 }]; g.shots = [{ id: 2, x: 50, y: 61 }]; g.spawnAt = 1e9; const h = L.shipStep(g, 1, seeded(3), L.ruleDeck('even-odd')); return [g.hits, g.shields, h.map((x) => x.kind).join('+')].join(' '); };
    ok('a lost ship comes back on every tenth fitting chip hit, and a player with all three keeps three', backAt(9, 2) === '10 3 hit+back' && backAt(19, 1) === '20 2 hit+back' && backAt(9, 3) === '10 3 hit' && backAt(10, 2) === '11 2 hit' && L.SHIP_BACK_EVERY === 10,
      [backAt(9, 2), backAt(19, 1), backAt(9, 3), backAt(10, 2)].join(' | '));
    // The end card names a new best only when the game beats the best before it (the second read: a tie said "A new best!").
    const bw = [[5, null], [0, null], [7, 7], [8, 7], [3, 7], [1, 1], [0, 4]].map(([h, b]) => L.shipBestWords(h, b));
    ok('the space shooter names a new best only when it beats the best before the game, never on a tie', bw.join('|') === 'A new best!||Your best is 7 hits.|A new best!|Your best is 7 hits.|Your best is 1 hit.|Your best is 4 hits.', bw.join('|'));
    const decks = [...new Set(L.GAMES.filter((g) => g.kind === 'ship').map((g) => g.rule))];
    const short = []; const endless = []; const early = []; const idleWrong = []; let blocked = 0; let slower = 0;
    for (const rule of decks) { const deck = L.ruleDeck(rule);
      for (let seed = 1; seed <= 24; seed++) {
        // 120,000 frames, since pass MK's ship back every ten hits makes this tireless player's games about a seventh longer (about
        // 65,000 frames at the most, where 60,000 held them before); a child's game ends far sooner.
        const rnd = seeded(seed * 97 + 1); const s = L.newShipGame(); let frames = 0;
        while (!s.over && frames < 120000) {
          const target = s.live.filter((it) => it.yes && it.y < 80 && it.y > 2).sort((a, b) => b.y - a.y)[0];
          if (target) { s.target = target.x; s.fire = true; }
          const happened = L.shipStep(s, 1, rnd, deck); frames += 1;
          if (s.spawned <= 150 && happened.some((h) => h.kind === 'wrong')) early.push(`${rule}#${seed}`);
          for (const a of s.live) for (const b of s.live) { if (a.yes && !b.yes && a.y <= 84 && b.y <= 84 && Math.abs(a.x - b.x) < Math.max(L.shipChipHalf(a.text), L.shipChipHalf(b.text)) + 2) blocked += 1; if (b.id > a.id && b.speed < a.speed) slower += 1; }
        }
        if (s.hits < 100) short.push(`${rule}#${seed}:${s.hits}`);
        if (!s.over || s.shields !== 0) endless.push(`${rule}#${seed}`);
        const idle = L.newShipGame(); const r2 = seeded(seed * 13 + 5); let f2 = 0; const lost = [];
        while (!idle.over && f2 < 20000) { lost.push(...L.shipStep(idle, 1, r2, deck).filter((h) => h.kind !== 'hit').map((h) => h.kind)); f2 += 1; }
        if (!(idle.over && idle.hits === 0 && lost.length === L.SHIP_SHIELDS && lost.every((k) => k === 'past'))) idleWrong.push(`${rule}#${seed}`);
      } }
    ok('a careful player keeps going far past the old round of ten, past a hundred fitting chips every time', short.length === 0 && decks.length >= 3, short.join(', '));
    ok('and still every game ends, the last shield gone, since the chips keep getting faster', endless.length === 0, endless.join(', '));
    ok('a chip never starts straight above or below a chip of the other kind still in play: each middle stays clear of the other', blocked === 0, blocked);
    ok('a careful player never hits a wrong chip in the first 150, since no wrong chip starts in line with a fitting one or a flying shot', early.length === 0, early.join(', '));
    ok('a chip that starts later is never slower than one before it', slower === 0, slower);
    ok('with nobody playing, the game ends when three fitting chips have got past, and no wrong chip is ever counted', idleWrong.length === 0, idleWrong.join(', '));
    // Started where grade 6 starts (Q39), the careful player still meets no wrong chip in its first 150 and passes a hundred hits.
    const g6 = [];
    for (const rule of decks) { const deck = L.ruleDeck(rule);
      for (let seed = 1; seed <= 8; seed++) { const rnd = seeded(seed * 71 + 3); const s = L.newShipGame(L.shipStartFor('6')); let frames = 0; let wrong = 0;
        while (!s.over && s.hits < 100 && frames < 60000) { const tg = s.live.filter((it) => it.yes && it.y < 80 && it.y > 2).sort((a, b) => b.y - a.y)[0]; if (tg) { s.target = tg.x; s.fire = true; } if (L.shipStep(s, 1, rnd, deck).some((h) => h.kind === 'wrong') && s.spawned <= 170) wrong += 1; frames += 1; }
        if (s.hits < 100 || wrong) g6.push(`${rule}#${seed}:${s.hits}${wrong ? ' wrong' : ''}`); } }
    ok('started where grade 6 starts, the careful player meets no wrong chip in its first 150 and passes a hundred hits', g6.length === 0, g6.join(', '));
    // A child's play (the game check, pass MI): a tap lands anywhere across the chip aimed at, a second quick tap fires again,
    // and a slow device moves the game three frames a step. None of it may cost a ship to a chip that does not fit, in the first
    // 150 chips; a shot that hits nothing just flies off.
    const childWrong = []; const slowShort = [];
    for (const rule of decks) { const deck = L.ruleDeck(rule);
      for (let seed = 1; seed <= 16; seed++) {
        const rnd = seeded(seed * 31 + 7); const hand = seeded(seed * 53 + 11); const s = L.newShipGame(); let frames = 0; let aimed = null; let again = 0;
        while (!s.over && frames < 9000 && s.spawned <= 150) {
          const target = s.live.filter((it) => it.yes && it.y < 80 && it.y > 2).sort((a, b) => b.y - a.y)[0];
          if (target && target.id !== aimed) { aimed = target.id; s.target = target.x + (hand() * 2 - 1) * 0.85 * L.shipChipHalf(target.text); s.fire = true; again = 8; }
          else if (again > 0 && (again -= 1) === 0) s.fire = true;   // the second quick tap
          if (L.shipAdvance(s, 3, rnd, deck).some((h) => h.kind === 'wrong')) childWrong.push(`${rule}#${seed}`);
          frames += 3;
        }
        const quick = L.newShipGame(); const r3 = seeded(seed * 97 + 1); let f3 = 0;
        while (!quick.over && f3 < 12000) { const tg = quick.live.filter((it) => it.yes && it.y < 80 && it.y > 2).sort((a, b) => b.y - a.y)[0]; if (tg) { quick.target = tg.x; quick.fire = true; } L.shipAdvance(quick, 3, r3, deck); f3 += 3; }
        if (quick.hits < 100) slowShort.push(`${rule}#${seed}:${quick.hits}`);
      } }
    ok("a child's taps, anywhere across the chip aimed at and tapped twice, never lose a ship to a chip that does not fit", childWrong.length === 0, childWrong.slice(0, 6).join(', '));
    ok('on a slow device, three frames a step, the careful player still passes a hundred fitting chips: no shot slips through a chip', slowShort.length === 0, slowShort.join(', ')); }
  // Every shape a rule deck names is drawn as itself (pass MB, the game check): SvgChip drew hexagons and rhombuses as its
  // fallback triangle, so grade 1's Catch the Hexagons scored triangles as hexagons. The triangle is the only shape the fallback may draw.
  { const uiSrc = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8');
    // Since the second read: the corners live in one table, CHIP_CORNERS, read here as data, so a shape counts as drawn only when
    // the table holds it with the right number of corners (a broken name or gate can no longer pass by mentioning the shape).
    const at = uiSrc.indexOf('const CHIP_CORNERS = {'); const table = at < 0 ? {} : Function('return ' + uiSrc.slice(at + 'const CHIP_CORNERS = '.length, uiSrc.indexOf('};', at) + 1))();
    const SIDES = { triangle: 3, rhombus: 4, hexagon: 6, pentagon: 5, trapezoid: 4, octagon: 8 };
    const named = [...new Set(Object.values(L.RULE_DECKS).flatMap((d) => [...d.a.items, ...d.b.items]).filter((x) => /^shape:/.test(x)).map((x) => x.split(':')[1]))];
    const undrawn = named.filter((n) => !['circle', 'square', 'diamond'].includes(n) && !(table[n] && table[n].length === SIDES[n]));
    ok('every shape a rule deck names has its own drawing in SvgChip, with its own number of corners', named.length >= 4 && Object.keys(table).length >= 3 && undrawn.length === 0, undrawn.join(', ')); }
  ok("Listen and Point owns Step on the Circles, circles against squares in the same four colors, and Very First Steps owns Red and Blue (pass MB)", (L.COURSE_GAMES['listen-and-point-pk3'] || []).join() === 'path-circles' && (L.COURSE_GAMES['very-first-steps-pk3'] || []).includes('sort-color') && L.RULE_DECKS['circle-square'].a.items.every((x) => /^shape:circle:/.test(x)) && L.RULE_DECKS['circle-square'].b.items.every((x) => /^shape:square:/.test(x)) && L.RULE_DECKS['circle-square'].a.items.map((x) => x.split(':')[2]).join() === L.RULE_DECKS['circle-square'].b.items.map((x) => x.split(':')[2]).join());
  ok('older lists take a rule, jump or map game only when it is not for the youngest', L.GAMES.filter((g) => (g.jump || g.map || g.balance) && !g.young).every((g) => L.GRADES.indexOf(g.minGrade) >= L.GRADES.indexOf('3')));
  ok('the older list holds at least ten kinds of game', new Set(older.map((g) => g.kind)).size >= 10, [...new Set(older.map((g) => g.kind))].join(','));
  // Frog jumps (2026-09-23): every deck's questions land on a tick of its own line, over many seeds.
  const jumpBad = Object.entries(L.JUMP_DECKS).flatMap(([id, d]) => { const out = []; const rng = L.makeRng ? L.makeRng(7) : null; for (let sd = 1; sd <= 200; sd += 1) { let x = sd * 2654435761 % 4294967296; const r = () => { x = (x * 1664525 + 1013904223) % 4294967296; return x / 4294967296; }; const q = d.make(r); const steps = Math.round((q.answer - d.lo) / d.step); if (q.answer < d.lo || q.answer > d.hi || Math.abs(d.lo + steps * d.step - q.answer) > 1e-9 || q.from < d.lo || q.from > d.hi) out.push(`${id}: ${q.ask} = ${q.answer}`); } return out; });
  ok('every frog jump lands on a tick of its line', jumpBad.length === 0, jumpBad.slice(0, 4).join(', '));
  ok('every map region is a polygon of at least four points with a name, and every map game names a map', Object.values(L.MAPS).every((m) => m.regions.length >= 4 && m.regions.every((r) => (r.parts || [r.points]).every((pts) => pts.length >= 4) && r.name)) && L.GAMES.filter((g) => g.map).every((g) => L.MAPS[g.map]));
  ok('the oceans and the hemispheres draw the continents behind them', Array.isArray(L.MAPS.oceans.land) && L.MAPS.oceans.land.length === 6 && Array.isArray(L.MAPS.hemispheres.land));
  // A region's corners never sit inside another region of the same map (Europe and the states must tile, not overlap).
  const overlapBad = ['europe', 'us-states', 'asia', 'africa', 'south-america'].flatMap((id) => { const rs = L.MAPS[id].regions; const out = []; rs.forEach((a, i) => rs.forEach((b, j) => { if (i !== j && (a.parts || [a.points]).some((pa) => pa.some((pt) => (b.parts || [b.points]).some((pb) => L.insidePolygon(pb, pt[0] + 0.01, pt[1] + 0.01))))) out.push(`${id}: ${a.id} in ${b.id}`); })); return out; });
  ok('Europe, Asia, Africa and South America hold twelve countries each, the states map twenty-five, and no region corner lies inside another', [L.MAPS.europe, L.MAPS.asia, L.MAPS.africa, L.MAPS['south-america']].every((m) => m.regions.length === 12) && L.MAPS['us-states'].regions.length === 25 && overlapBad.length === 0, overlapBad.slice(0, 6).join(', '));
  ok('a point in the top left of the world is in the Northern and Western hemispheres only', L.insidePolygon(L.MAPS.hemispheres.regions[0].points, 20, 10) && L.insidePolygon(L.MAPS.hemispheres.regions[2].points, 20, 10) && !L.insidePolygon(L.MAPS.hemispheres.regions[1].points, 20, 10));
  ok('a point is found inside its own region and not in another', L.insidePolygon(L.MAPS.continents.regions[3].points, 50, 34) && !L.insidePolygon(L.MAPS.continents.regions[2].points, 50, 34));
  ok('every map has an art serial, and the world maps share one', L.MAP_SERIALS.every((x) => /^M\d+$/.test(x)) && L.MAPS.oceans.art === L.MAPS.continents.art);
  // Balance the scale: every target a deck makes can be built from its tray, over many seeds.
  const balBad = Object.entries(L.BALANCE_DECKS).flatMap(([id, d]) => { const out = []; for (let sd = 1; sd <= 200; sd += 1) { let x = sd * 2654435761 % 4294967296; const r = () => { x = (x * 1664525 + 1013904223) % 4294967296; return x / 4294967296; }; const t = d.make(r); if (!L.balanceReachable(d.weights, t.value)) out.push(`${id}: ${t.show}`); } return out; });
  ok('every balance target can be made from its weights', balBad.length === 0, balBad.slice(0, 4).join(', '));
  ok('a balance game names a deck, and the young one is for the youngest only', L.GAMES.filter((g) => g.balance).every((g) => L.BALANCE_DECKS[g.balance]) && L.GAMES.filter((g) => g.balance && g.young).every((g) => L.GRADES.indexOf(g.minGrade) <= L.GRADES.indexOf('2')));
  const spread = L.spreadKinds(older);
  ok('spreading keeps every game exactly once', spread.length === older.length && new Set(spread.map((g) => g.id)).size === older.length);
  const grade5 = L.spreadKinds(L.gamesFor('5').filter((g) => (g.deck || g.kind === 'pong' || g.kind === 'sprint' || g.kind === 'order') && (!g.courseId || g.courseId === 'science-5')));
  ok('a grade 5 list alternates kinds with no run longer than two', grade5.every((g, i) => i < 2 || !(g.kind === grade5[i - 1].kind && g.kind === grade5[i - 2].kind)), grade5.map((g) => g.kind[0]).join(''));
  const runs = spread.reduce((acc, g, i) => (i && g.kind === spread[i - 1].kind ? [...acc.slice(0, -1), acc[acc.length - 1] + 1] : [...acc, 1]), []);
  ok('even the full walk-through list never runs one kind more than five deep', Math.max(...runs) <= 5, runs.join(','));
  ok('titles of the early games are capitalized words', early.every((g) => g.title.split(' ').filter((w) => !['and', 'the', 'on'].includes(w)).every((w) => /^[A-Z]/.test(w))), early.map((g) => g.title).join(' | '));
}
// A game for every course (2026-09-24, Mikey, pass CO). Every course has at least one game its grade can play and students
// can see today; every game belongs to one course or is the starter; a course's games are different kinds; a new student
// has the starter and the first game open and nothing else; a course's quick fire draws only on that course's lessons.
// The two counts below are ceilings: new kinds must bring them down, never up (docs/GAMES-PLAN.md lists what to build).
{
  const ids = new Set(L.GAMES.map((g) => g.id)); const kindOf = (id) => L.GAMES.find((g) => g.id === id).kind;
  const attached = Object.values(L.COURSE_GAMES).flat();
  ok('every course has at least one game, and every one of them exists', L.COURSES.every((c) => (L.COURSE_GAMES[c.id] || []).length > 0) && attached.every((id) => ids.has(id)));
  ok('every game belongs to exactly one course or is the starter', L.GAMES.every((g) => attached.filter((id) => id === g.id).length + (L.STARTER_GAMES.includes(g.id) ? 1 : 0) === 1));
  ok('a course only gets games its grade can play', L.COURSES.every((c) => L.COURSE_GAMES[c.id].every((id) => { const g = L.GAMES.find((x) => x.id === id); return !g.minGrade || L.GRADES.indexOf(g.minGrade) <= L.GRADES.indexOf(c.grade); })));
  // Since pass MQ two more near misses: a young game closing with the older line, and a grade 3 game with the young one (Q65).
  // Every game's welcome (pass MP, Mikey: "I think games can have the instruction audio play automatically when entering the page",
  // in a conversational way, his Which Sense example, with "an animation playing the game at the same time to show how it works"):
  // every game has one, opening "Welcome to" its title and closing with his line, the speaker named; each line's act is one the
  // pointer knows (GAME_INTRO_ACTS), a keyboard line is a key act and only a key act needs a keyboard; the words keep the app's
  // rules (whole sentences, no dash, colon or semicolon, no "click" on a touch screen, no "?!"); the speaker's words leave the
  // keyboard lines out where there is no keyboard; and each line's clip key is its words and its voice, the same words in the same
  // voice one key, and two different lines never one. Its near misses beside it: a welcome with an act the pointer does not know, a
  // keyboard line that is not a key act, a line with a colon, and two lines given one key.
  { const introProblems = (games, introOf) => { const bad = []; const keyOf = new Map();
      for (const g of games) { const lines = introOf(g); const last = lines[lines.length - 1];
        if (lines.length < 3) bad.push(`${g.id}: ${lines.length} lines`);
        if (!lines[0] || !lines[0].say.startsWith(`Welcome to ${L.spokenTitle(g.title)}`)) bad.push(`${g.id}: does not open with its welcome`);
        // Since pass MQ (Mikey's answer to Q65, "Q65 - B") the youngest games close with "To hear this again, tap the speaker. Have
        // fun!" and grade 3 up with his own line.
        const closing = L.gameBand(g) === 'early' ? L.GAME_INTRO_CLOSING_YOUNG : L.GAME_INTRO_CLOSING;
        if (!last || last.say !== closing || last.act !== 'speaker') bad.push(`${g.id}: does not close with the speaker line`);
        for (const l of lines) {
          if (!L.GAME_INTRO_ACTS.includes(l.act)) bad.push(`${g.id}: unknown act ${l.act}`);
          if (!!l.keys !== (l.act === 'key')) bad.push(`${g.id}: a keyboard line that is not a key act, or a key act that is not a keyboard line`);
          if (/[—–:;]|\?!|\bclick/i.test(l.say) || /\s{2}/.test(l.say) || !/[.!?]$/.test(l.say)) bad.push(`${g.id}: ${l.say}`);
          const was = keyOf.get(l.key); if (was && was !== l.say) bad.push(`${g.id}: two lines share the key ${l.key}`); keyOf.set(l.key, l.say);
        }
      }
      return bad; };
    const real = introProblems(L.GAMES, (g) => L.gameIntro(g));
    const kinds = [...new Set(L.GAMES.map((g) => g.kind))].filter((k) => !L.GAME_INTRO_KINDS.includes(k));
    const words = L.GAMES.every((g) => L.gameIntroWords(g) === L.gameIntro(g).filter((l) => !l.keys).map((l) => l.say).join(' ') && L.gameIntroWords(g, { keys: true }) === L.gameIntro(g).map((l) => l.say).join(' '));
    const sense = L.GAMES.find((g) => g.id === 'sense-psychology-k'); const kite = L.GAMES.find((g) => g.id === 'dots-kite'); const pairs = L.GAMES.find((g) => g.id === 'pairs-shapes');
    const shared = L.gameIntro(kite).at(-1).key === L.gameIntro(pairs).at(-1).key && L.gameIntro(kite).at(-1).key !== L.gameIntro(L.GAMES.find((g) => g.id === 'evidence-reading-3')).at(-1).key;
    const plant = (change) => introProblems([sense], (g) => change(L.gameIntro(g).map((l) => ({ ...l })))).length > 0;
    const older = L.GAMES.find((g) => g.id === 'evidence-reading-3');
    const caught = [plant((ls) => { ls[1].act = 'wave'; return ls; }), plant((ls) => { ls[2].keys = true; return ls; }), plant((ls) => { ls[1].say = 'Listen: then tap.'; return ls; }), plant((ls) => { ls[2].key = ls[1].key; return ls; }),
      plant((ls) => { ls[ls.length - 1].say = L.GAME_INTRO_CLOSING; return ls; }),
      introProblems([older], (g) => { const ls = L.gameIntro(g).map((l) => ({ ...l })); ls[ls.length - 1].say = L.GAME_INTRO_CLOSING_YOUNG; return ls; }).length > 0];
    ok(`every game has a welcome: its own words, acts the pointer knows, the closing speaker line, and a clip key for each line by its words and voice (${L.GAMES.length} games; shared lines one key across games of a voice; each near miss caught)`, real.length === 0 && kinds.length === 0 && words && shared && caught.every(Boolean), [...real.slice(0, 6), kinds.join(', '), `words ${words}`, `shared ${shared}`, `near misses ${caught}`].join(' | ')); }
  // The round a game's welcome plays (pass MP, round one's code and game checks): the pointer's answers are never among the first
  // three items the child then meets in round 1, game by game, for every game whose round deals a run of items; a deck too small
  // for that (a child plays all of it in a round or two) takes the round whose items the child meets latest, and those games are
  // named here, so a new small deck is seen. The items are read through gameItems, which deals by the boards' own functions (the
  // scripts test holds the boards to them). Proven on the round every game played before (977: fifty games' pointers answered one
  // of the child's first three items, Debug the robot's very first program among them), and on round 1 itself, which every game
  // with a run of items must fail, so a game whose items the check could not see would show. Since round two's second read a board
  // that shows all of itself at once (Buckets' chips, a deck's Pairs) is held clear of the child's whole first board, not only its
  // first three, and Fraction twins, whose five pairs are on every board, joins the small decks.
  { const WHOLE = ['buckets', 'pairs'];
    const firstOf = (g) => L.gameItems(g, 1, WHOLE.includes(g.kind) ? 99 : 3);
    const leaks = (roundOf) => L.GAMES.filter((g) => { const first = firstOf(g); if (!first) return false; return L.gameItems(g, roundOf(g), Math.min(3, L.demoItemCount(g))).some((x) => first.includes(x)); }).map((g) => g.id);
    const withItems = L.GAMES.filter((g) => L.gameItems(g, 1, 3));
    const now = leaks((g) => L.demoRoundFor(g)); const SMALL = ['order-history-6', 'pairs-fractions', 'spot-arts-k'];
    // A small deck's round is the best the search range offers: no round from DEMO_FROM on puts its items later in round 1.
    const latest = (g, r) => { const all = L.gameItems(g, 1, 99); return Math.min(...L.gameItems(g, r, Math.min(3, L.demoItemCount(g))).map((x) => { const at = all.indexOf(x); return at < 0 ? Infinity : at; })); };
    const bestOf = (g) => { let b = -1; for (let r = L.DEMO_FROM; r < L.DEMO_FROM + 1000; r++) b = Math.max(b, latest(g, r)); return b; };
    const smallBest = SMALL.every((id) => { const g = L.GAMES.find((x) => x.id === id); return !!g && latest(g, L.demoRoundFor(g)) === bestOf(g); });
    const old = leaks(() => 977); const self = leaks(() => 1);
    const sure = ['debug-tech-3', 'walk-tech-k', 'fix-writing-7', 'order-history-4', 'mix-art-3', 'reason-philosophy-6', 'recall-psychology-6', 'teach-tech-6'].every((id) => old.includes(id));
    const counts = L.demoItemCount(L.GAMES.find((g) => g.id === 'sense-psychology-k')) === 3 && L.demoItemCount(L.GAMES.find((g) => g.id === 'walk-tech-k')) === 1 && L.demoItemCount(L.GAMES.find((g) => g.id === 'share-philosophy-k')) === 1;
    const wholeOld = ['buckets-noun-verb', 'buckets-mammals', 'buckets-need-want', 'pairs-science-6'].every((id) => old.includes(id) || leaks(() => 500).includes(id));
    ok(`every game's welcome plays a round whose answers are none of the first three the child meets, or of the whole first board where it shows at once (${withItems.length} games deal items; the three smallest decks take the round whose items the child meets latest; caught on round 977, on round 500 and on round 1)`, JSON.stringify([...now].sort()) === JSON.stringify(SMALL) && smallBest && old.length >= 40 && sure && wholeOld && self.length === withItems.length && counts, { now, old: old.length, self: self.length, withItems: withItems.length, smallBest, sure, wholeOld, counts }); }
  // The welcome's rounds as a table (round two's second read: the fractions scale searched all 1,000 rounds as the game opened, a
  // 400 ms freeze): DEMO_ROUNDS holds every game's round as demoRoundSearch finds it, so a child's tap never searches; a game missing
  // from it, or a round that differs, fails here until node tools/demo-rounds.mjs --write writes it again. Pay the Price's round shows
  // the big coin its welcome names (a first price of five or more), and a near miss, a table one round off, is caught. demoRoundFor is
  // held to the table too (round three's second read: with its table line taken out the check above still passed, and the fractions
  // scale searched again as it opened): a round written into the table is the round it gives, and a game taken out of the table gets
  // the search's round.
  { const table = L.DEMO_ROUNDS; const ids = L.GAMES.map((g) => g.id);
    const differs = (t) => ids.filter((id) => t[id] !== L.demoRoundSearch(L.GAMES.find((g) => g.id === id))).concat(Object.keys(t).filter((id) => !ids.includes(id)));
    const real = differs(table); const plant = differs({ ...table, 'walk-tech-k': table['walk-tech-k'] + 1 }).length > 0;
    const pay = L.GAMES.find((g) => g.id === 'pay-econ-k'); const showsCoin = L.payPrices(L.demoRoundFor(pay))[0].price >= 5;
    const fr = L.GAMES.find((g) => g.id === 'balance-fractions'); const held = table[fr.id];
    table[fr.id] = held + 7; const readsTable = L.demoRoundFor(fr) === held + 7;
    delete table[fr.id]; const searchesMissing = L.demoRoundFor(fr) === L.demoRoundSearch(fr);
    table[fr.id] = held;
    ok(`every game's welcome round is in DEMO_ROUNDS, as the search finds it, and demoRoundFor reads it, so opening a game never searches (${ids.length} games; fix: node tools/demo-rounds.mjs --write; the near miss caught; a game missing from the table still gets the search's round), and Pay the Price's shows the big coin`, real.length === 0 && plant && showsCoin && readsTable && searchesMissing, JSON.stringify({ differs: real.slice(0, 8), plant, showsCoin, readsTable, searchesMissing })); }
  // A welcome on a device with no voice (round two's second read, pass MP): a line that asks the child to listen, or names the voice,
  // has a second wording for the caption (quiet) that asks for neither, since nothing will be said and the board shows the words;
  // the speaker lines are left out there already. Near miss: Which Sense's listening line without its quiet wording.
  { const listens = (t) => /\b(listen|voice)\b/i.test(t);
    const quietProblems = (intro) => L.GAMES.flatMap((g) => intro(g).filter((l) => l.act !== 'speaker' && l.act !== 'replay' && listens(l.say) && !/listening/i.test(l.say) && (!l.quiet || listens(l.quiet) || /\bhear\b/i.test(l.quiet))).map((l) => `${g.id}: ${l.say}`));
    const real = quietProblems(L.gameIntro); const plant = quietProblems((g) => L.gameIntro(g).map((l) => (/^Simply listen/.test(l.say) ? { ...l, quiet: undefined } : l))).length > real.length;
    const counted = L.GAMES.flatMap((g) => L.gameIntro(g)).filter((l) => l.quiet).length;
    ok(`every welcome line that asks a child to listen has a wording for a device with no voice that does not (${counted} lines across the games; the near miss caught)`, real.length === 0 && counted >= 5 && plant, real.slice(0, 5)); }
  // The multiples of 3 that Times tables to 10 names (round two's second read added the line; round three's second read asked for its
  // arithmetic to be checked, the code brief's item 3): the numbers it lists are 3 times 1 to 3 times 10, worked out here, and they are
  // the multiples Catch the multiples of 3 deals, whose other numbers, 1 to 29, are none of them a multiple of 3. Near miss: the line
  // with 21 left out.
  { const tt = L.COURSES.flatMap((c) => c.modules).find((m) => m.id === 'times-tables');
    const named = (text) => { const m = /The multiples of 3 in the table to 10 are ([\d, and]+)\./.exec(text); return m ? m[1].split(/,\s*|\s+and\s+/).map((x) => x.trim()).filter(Boolean).map(Number) : null; };
    const said = tt ? named(tt.lesson.paragraphs.join(' ')) : null;
    const times = Array.from({ length: 10 }, (_, k) => 3 * (k + 1));
    const deck = L.ruleDeck('multiples-3');
    const same = (a, b) => !!a && !!b && a.length === b.length && a.every((x, i) => x === b[i]);
    const plant = !same(named('The multiples of 3 in the table to 10 are 3, 6, 9, 12, 15, 18, 24, 27 and 30.'), times);
    const others = deck.b.items.map(Number);
    ok('Times tables to 10 names the multiples of 3 as 3 times 1 to 3 times 10, the multiples Catch the multiples of 3 deals, and its other numbers, 1 to 29, hold none (the near miss caught)', same(said, times) && same(deck.a.items.map(Number), times) && others.every((n) => n % 3 !== 0) && Math.min(...others) === 1 && Math.max(...others) === 29 && plant, JSON.stringify({ said, deckA: deck.a.items, others: [Math.min(...others), Math.max(...others)], plant })); }
  // Mikey's own words for Which Sense, kept as he wrote them where the app does what he said (his example: "Welcome to 'Which
  // Sense!'  This game is designed to help you explore your five senses.  Simply listen to the question then select the sense that
  // most accurately fits."), and the keyboard line only on a keyboard.
  { const sense = L.GAMES.find((g) => g.id === 'sense-psychology-k'); const said = L.gameIntro(sense).map((l) => l.say);
    ok('Which Sense welcomes in Mikey\'s words: his opening, his "Simply listen to the question" and his number line, which needs a keyboard', said[0] === 'Welcome to Which Sense! This game is designed to help you explore your five senses.' && said[1] === 'Simply listen to the question, then select the sense that most accurately fits.' && L.gameIntro(sense).some((l) => l.keys && /type a number from 1 to 5/.test(l.say)) && !L.gameIntroWords(sense).includes('number from 1 to 5')); }
  ok('every course has a game students can see today, not only a map waiting for its painting', L.COURSES.every((c) => L.COURSE_GAMES[c.id].some((id) => kindOf(id) !== 'map')));
  const twoOfAKind = L.COURSES.filter((c) => new Set(L.COURSE_GAMES[c.id].map(kindOf)).size < L.COURSE_GAMES[c.id].length).length;
  ok('no course holds two games of one kind (the element pairs left physics for the periodic table, 2026-09-25)', twoOfAKind === 0, `${twoOfAKind}`);
  // Look Closely (pass ML, the game check; Find the Match until its second read): every picture it deals is one a First Steps lesson line draws, every board of
  // three pairs holds two of each of three pictures, one couple of them almost alike (a fox and a cat, or a whale and a
  // fish), never a square with a rectangle, and the course's game is it.
  {
    const deck = L.PAIR_PICS['first-steps']; const drawn = new Set();
    const walk = (v) => { if (!v || typeof v !== 'object') return; if (Array.isArray(v)) { v.forEach(walk); return; } if (v.kind && v.name) drawn.add(`${v.kind}:${v.name}`); Object.values(v).forEach(walk); };
    L.getCourse('first-steps-pk').modules.forEach((m) => (L.MODULES.find((x) => x.id === m.id).lesson.script || []).forEach((line) => walk(line.show)));
    const undrawn = deck.pics.filter((t) => !drawn.has(t));
    let bad = 0; const couples = new Set();
    for (let r = 0; r < 400; r++) {
      const cards = L.pairPicsBoard('first-steps', r, 3); const kinds = [...new Set(cards)];
      const couple = deck.almost.find(([a, b]) => kinds.includes(a) && kinds.includes(b)); if (couple) couples.add(couple.join('+'));
      if (cards.length !== 6 || kinds.length !== 3 || !kinds.every((t) => cards.filter((c) => c === t).length === 2 && deck.pics.includes(t)) || !couple || (kinds.includes('shape:square') && kinds.includes('shape:rectangle'))) bad++;
    }
    const game = L.GAMES.find((g) => g.id === 'pairs-first-steps');
    ok('Look Closely deals only pictures First Steps\' lines draw, and every board holds an almost-alike couple (a fox and a cat, or a whale and a fish)', undrawn.length === 0 && bad === 0 && couples.size === 2 && game && game.young && !game.deck && L.COURSE_GAMES['first-steps-pk'].join() === 'pairs-first-steps,dots-fish', `undrawn ${undrawn.join(',')}; bad boards ${bad}; couples ${[...couples].join(' ')}`);
  }
  // The Fish (pass MM, round one's game check): it moved from First Sounds and Letters, which does not teach counting, to First
  // Steps, whose Connect the Dots counts to ten and names a fish, so it has ten dots where it had eleven.
  ok('the Fish is First Steps\' second game, with ten dots, the count Connect the Dots teaches', L.DOT_SHAPES.fish.length === 10 && L.COURSE_GAMES['first-steps-pk'].includes('dots-fish') && L.gameCourse('dots-fish') === 'first-steps-pk', L.DOT_SHAPES.fish.length);
  // Find the Letter (pass MM, First Sounds and Letters' game): only the thirteen capitals the course's letter lessons draw; five a
  // board, exactly two of L, T and F on every board; three different asks, each on its board; no letter asked twice in a round;
  // the same round for the same seed. The voice's shape words are the course's own (Big Letters' More Info reasons for its seven,
  // the tracing lessons' paragraphs, word for word, for the other six), and every line says "the letter" before a name, so the
  // voice never reads A as the word "a".
  {
    const lessons = L.getCourse('first-sounds-pk').modules.map((m) => L.MODULES.find((x) => x.id === m.id)).filter((m) => /letter|trac/.test(m.id));
    const drawn = new Set(); lessons.forEach((m) => (m.lesson.script || []).forEach(({ show: s }) => { if (s && (s.kind === 'letters' || s.kind === 'trace')) String(s.text).split(/\s+/).filter((t) => /^[A-Z]$/.test(t)).forEach((t) => drawn.add(t)); }));
    const traced = ['pl-trace-first', 'pl-trace-more', 'pl-trace-ltf'].flatMap((g) => Array.from({ length: 30 }, (_, s) => L.generateQuestion(g, s + 1).explain));
    const text = lessons.flatMap((m) => [...m.lesson.paragraphs, ...(m.lesson.script || []).map((l) => l.say)]).concat(traced).join(' ');
    const reasons = new Set(); for (let s = 1; s <= 300; s++) { const q = L.generateQuestion('pl-tap-letter', s); Object.values(q.whyNot || {}).forEach((w) => reasons.add(w.why)); }
    const reasonText = [...reasons].join(' ');
    const ownWords = L.SPOT_LETTERS.filter((x) => { const w = L.letterShapeWords(x); return !!w && (text.includes(`${x} ${w}`) || reasonText.includes(`${w}.`)); });
    const lines = L.SPOT_LETTERS.flatMap((x) => [['ask', x], ['hint', x], ['right', x], ['wrong', x, x === 'B' ? 'D' : 'B'], ['wrong-again', x, x === 'M' ? 'A' : 'M']]);
    const badLines = lines.filter(([m, x, t]) => { const said = L.letterSpotLine(m, x, t); return !said || !said.includes(`the letter ${x}`) || (t && !said.includes(`the letter ${t}`)) || said.split(/\s+/).length > 24 || ![...said.matchAll(/\b[A-Z]\b/g)].every((m) => said.slice(Math.max(0, m.index - 11), m.index) === 'the letter '); });
    let bad = 0; const asked = new Set(); const shown = new Set();
    for (let seed = 0; seed < 500; seed++) {
      const r = L.letterSpotRound(seed); const all = r.flatMap((b) => b.asks);
      if (r.length !== L.LETTER_SPOT_BOARDS || all.length !== 12 || new Set(all).size !== 12 || JSON.stringify(L.letterSpotRound(seed)) !== JSON.stringify(r)) bad++;
      for (const b of r) { b.asks.forEach((x) => asked.add(x)); b.letters.forEach((x) => shown.add(x));
        if (b.letters.length !== 5 || new Set(b.letters).size !== 5 || !b.letters.every((x) => L.SPOT_LETTERS.includes(x)) || b.letters.filter((x) => L.SPOT_LETTERS_ALIKE.includes(x)).length !== 2 || b.asks.length !== 3 || new Set(b.asks).size !== 3 || !b.asks.every((x) => b.letters.includes(x)) || ((b.asks.includes('E') || b.asks.includes('F')) && !(b.letters.includes('E') && b.letters.includes('F')))) bad++; }
    }
    const game = L.GAMES.find((g) => g.id === 'spot-first-sounds');
    ok('Find the Letter deals only the thirteen capitals First Sounds and Letters\' lessons draw, five a board with two of L, T and F, E beside F when either is asked, three asks on the board, none twice in a round', [...drawn].sort().join('') === [...L.SPOT_LETTERS].sort().join('') && L.SPOT_LETTERS.length === 13 && bad === 0 && asked.size === 13 && shown.size === 13, `drawn ${[...drawn].sort().join('')}; bad ${bad}`);
    ok('Find the Letter says each letter\'s shape in the course\'s own words, and every line says "the letter" before a name', ownWords.length === 13 && badLines.length === 0, `own words for ${ownWords.join('')}; lines ${badLines.map((l) => l.join(' ')).join(', ')}`);
    ok('Find the Letter is First Sounds and Letters\' only game, a young spot game with the letters board', !!game && game.kind === 'spot' && game.spot === 'letters' && game.young && !game.minGrade && L.COURSE_GAMES['first-sounds-pk'].join() === 'spot-first-sounds');
  }
  let repeats = 0; for (const gr of L.GRADES) { const ks = L.COURSES.filter((c) => c.grade === gr).flatMap((c) => L.COURSE_GAMES[c.id].map(kindOf)); repeats += ks.length - new Set(ks).size; }
  ok('kinds repeated inside a grade stay at or under 10 (new kinds, timelines, the periodic table and find the evidence, 2026-09-25; world capitals in world geography, 2026-10-02)', repeats <= 10, `${repeats}`);
  // Since pass MC the first game on the list opens on day one only when its course owns another game on the list (or it is a
  // starter, or Mikey's exception), so a kindergartner with Counting and Letters, two courses of one game each, starts with the
  // starters alone and each course still has its game to unlock.
  const list = L.GAMES.filter((g) => ['counting-k', 'letters-k'].includes(L.gameCourse(g.id)) || L.STARTER_GAMES.includes(g.id));
  const fresh = L.unlockedGameIds([], list);
  ok('a new student has the starters open, and nothing from an unfinished course whose only game it is', [...fresh].every((id) => L.STARTER_GAMES.includes(id)) && list.filter((g) => !L.STARTER_GAMES.includes(g.id)).every((g) => !fresh.has(g.id)));
  // A read-aloud question never prints the letter it asks for while the voice can say it (pass MM, round two's lesson check B and
  // game check: "Is this the letter M?" over the big M, and "Tap the letter E." over E, S and B, let a child match the printed
  // capital and master Big Letters knowing no name). Over 300 seeds of every read-aloud choice bank, what printedQuestion prints
  // with a voice holds no lone capital that is the answer, and a Yes or No question about a shown letter prints no lone capital
  // at all. Kept with its reason: Which word do we read first?, whose answer I is a word of the sentence it shows. Waiting by
  // name for kindergarten's review: Letters' three. Both lists only fall.
  { const KEPT = { 'rw-first': 'the answer I is a word of the shown sentence, read in order, not a letter found by its name' };
    const WAITING = ['r-tap-letter', 'r-match-big', 'rw-which-way'];
    const gens = new Set(L.COURSES.filter((c) => c.readAloud).flatMap((c) => c.modules.flatMap((m) => (L.MODULES.find((x) => x.id === m.id) || { generators: [] }).generators)));
    const leaks = new Set(); let read = 0;
    for (const g of gens) for (let s = 1; s <= 300; s++) { const q = L.generateQuestion(g, s); if (q.type !== 'choice') continue; read += 1;
      const p = L.printedQuestion(q, true); const caps = [...[p.story, p.prompt].filter(Boolean).join(' ').matchAll(/\b([A-Z])\b/g)].map((m) => m[1]);
      const shown = q.visual && q.visual.kind === 'letters' ? String(q.visual.text).split(/\s+/).filter((t) => /^[A-Za-z]$/.test(t)) : [];
      if ((/^[A-Z]$/.test(String(q.answer)) && caps.includes(String(q.answer))) || (['Yes', 'No'].includes(q.answer) && shown.length && caps.length)) leaks.add(g); }
    const fullAgain = L.printedQuestion(L.generateQuestion('pl-tap-letter', 1), false).prompt === L.generateQuestion('pl-tap-letter', 1).prompt;
    const unlisted = [...leaks].filter((g) => !KEPT[g] && !WAITING.includes(g)); const stale = [...Object.keys(KEPT), ...WAITING].filter((g) => !leaks.has(g));
    ok(`a read-aloud question never prints the letter it asks for while the voice can say it, and prints it whole with no voice (${read} questions read; ${Object.keys(KEPT).length} kept, ${WAITING.length} waiting for kindergarten)`, read >= 20000 && fullAgain && unlisted.length === 0 && stale.length === 0, `prints its letter: ${unlisted.join(', ')}; listed but clean: ${stale.join(', ')}`); }
  // The read-aloud banks, for the four checks below (pass MM, round three).
  const RA_GENS = [...new Set(L.COURSES.filter((c) => c.readAloud).flatMap((c) => c.modules.flatMap((m) => m.generators || [])))];
  // A heard rhyme prints neither of its words while the voice can say them (round three's lesson check, pass MM): "Listen. Do pup
  // and cup rhyme?" printed whole, and each family spells its ending one way, so matching letters answered all 740.
  // Since round four's code read the two words of a "Do they rhyme?" setup ("Mat. Hat.") are read too, and a letters picture with
  // the printed words: kindergarten's rr-does-rhyme prints both and waits by name for its review (EARMARKS A16); the list only falls.
  { let read = 0; const leaks = new Set(); const WAITING = ['rr-does-rhyme'];
    for (const g of RA_GENS) for (let s = 1; s <= 300; s++) { let q; try { q = L.generateQuestion(g, s); } catch (e) { continue; } if (!q || q.type !== 'choice') continue;
      const m = String(q.prompt).match(/\bDo ([a-z]+) and ([a-z]+) rhyme\?/i) || (/^Do they rhyme\?$/.test(String(q.prompt)) && String(q.story || '').match(/^([A-Za-z]+)\. ([A-Za-z]+)\.$/)); if (!m) continue; read += 1;
      const p = L.printedQuestion(q, true); const shown = q.visual && q.visual.kind === 'letters' ? q.visual.text : '';
      if (new RegExp(`\\b(${m[1]}|${m[2]})\\b`, 'i').test(`${p.story || ''} ${p.prompt || ''} ${shown}`)) leaks.add(g); }
    const unlisted = [...leaks].filter((g) => !WAITING.includes(g)); const stale = WAITING.filter((g) => !leaks.has(g));
    ok(`a heard rhyme prints neither of its words while the voice can say them (${read} questions read; ${WAITING.length} waiting for kindergarten)`, read >= 800 && unlisted.length === 0 && stale.length === 0, `prints them: ${unlisted.join(', ')}; listed but clean: ${stale.join(', ')}`); }
  // The line after a wrong tap is printed for the grown-up, so it never prints a capital the question hides while two choices are
  // open (round three's lesson check: "This letter is not B, and B has two round bumps." printed the B of Listen and Point's "Tap
  // the letter you hear." over T, U and B, 32 first taps of p3-ab-in-word).
  { let taps = 0; const leaks = [];
    for (const g of RA_GENS) for (let s = 1; s <= 120; s++) { let q; try { q = L.generateQuestion(g, s); } catch (e) { continue; }
      if (!q || q.type !== 'choice' || (q.choices || []).length < 3 || !/^[A-Z]$/.test(String(q.answer))) continue;
      const p = L.printedQuestion(q, true); const cap = new RegExp(`\\b${q.answer}\\b`); if (cap.test(`${p.story || ''} ${p.prompt || ''}`)) continue;
      for (const w of q.choices.filter((c) => c !== q.answer)) { taps += 1; if (cap.test(L.preReaderWrongWords(q, w, [w]).slice(1))) leaks.push(`${g}#${s} ${w}`); } }
    ok(`the line after a wrong tap never prints a capital the question hides while two choices are open (${taps} taps read)`, taps >= 500 && leaks.length === 0, leaks.slice(0, 5).join('; ')); }
  // A question as heard never names its answer through a word the voice adds (round three's screen check, pass MM: kindergarten's
  // "M says mmm. Which word starts with M?" was heard "M says mmm...moon" over dog, pig and moon, and waited for kindergarten's
  // review). Since pass MO the app plays each sound itself and adds no word to it (Mikey's notes on Q51), so none waits; the check
  // stays, so a sound said with a word on it cannot come back unseen.
  { const WAITING = []; const leaks = new Set(); let read = 0;
    const nameOf = (c) => { const m = String(c).split('#')[0].match(/^(?:pic|icon):(.+)$/); return m ? m[1].replace(/-/g, ' ').toLowerCase() : /^[a-z]+$/i.test(String(c)) && String(c).length > 1 ? String(c).toLowerCase() : null; };
    const words = (t) => ' ' + String(t).toLowerCase().replace(/[^a-z0-9]+/g, ' ') + ' ';
    for (const g of RA_GENS) for (let s = 1; s <= 200; s++) { let q; try { q = L.generateQuestion(g, s); } catch (e) { continue; } if (!q || q.type !== 'choice') continue;
      const ans = nameOf(q.answer); if (!ans) continue; read += 1; const asked = `${q.story || ''} ${q.prompt || ''}`;
      if (words(L.heardForm(asked)).includes(` ${ans} `) && !words(asked).includes(` ${ans} `)) leaks.add(g); }
    const unlisted = [...leaks].filter((g) => !WAITING.includes(g)); const stale = WAITING.filter((g) => !leaks.has(g));
    ok(`a question as heard never names its answer through a word the voice adds (${read} questions read; none waiting since pass MO)`, read >= 5000 && unlisted.length === 0 && stale.length === 0, `names it: ${unlisted.join(', ')}; listed but clean: ${stale.join(', ')}`); }
  // The sounds a lesson says (pass MO, Mikey's notes on Q51: on his phone "Sun. Sss." was the letter s "for what seems like 40
  // times", fff the letter f, mmm "like moon", tuh "like the word two", ig spelled out and the at of "ends in at" "almost like et").
  // Every story, every read-aloud lesson line and every read-aloud question's words (setup, prompt, explanation, More Info and what a
  // pre-reader hears after a wrong tap), as speechPieces hands them over: no piece the voice says holds a held sound (three of one
  // held letter) or a crisp stop's tuh, puh, cuh or kuh, each being a sound the app plays, and none holds ig, which is handed as igg
  // on a piece of its own. Proven failing on pass MN's speechPieces, which handed the voice forty-four s's and "un".
  { const S3 = await import('../src/stories.mjs'); const texts = [];
    for (const table of [S3.STORIES, S3.COURSE_STORIES, S3.MASTERY_STORIES]) for (const st of Object.values(table)) for (const w of [].concat(st.words || [])) texts.push(w);
    for (const c of L.COURSES.filter((x) => x.readAloud)) for (const m of c.modules) { try { for (const line of L.readAloudScript(m)) texts.push(typeof line === 'string' ? line : line.say || line.text || ''); } catch (e) { /* no script */ } }
    for (const g of RA_GENS) for (let s = 1; s <= 60; s++) { let q; try { q = L.generateQuestion(g, s); } catch (e) { continue; } if (!q) continue;
      texts.push(q.story || '', q.prompt || '', q.explain || '', ...(q.alsoRight || []));
      for (const w of Object.keys(q.whyNot || {})) { texts.push(L.whyNotSentence(q.whyNot[w])); try { texts.push(L.preReaderWrongWords(q, w, [w])); } catch (e) { /* not a choice */ } } }
    // Since pass MQ (Mikey's answer to Q60, "Q60 - B") buh, duh, guh and juh, and the endings ig, og and at, are the app's own sounds
    // in every lesson too, so neither reaches the voice (ig had been handed as igg, at alone, og inside its sentence).
    const bad = []; let sounds = 0; let rimes = 0; const kinds = new Set();
    for (const t of texts) for (const x of L.speechPieces(t)) {
      if (x.sound) { sounds += 1; kinds.add(x.sound); if (['ig', 'og', 'at'].includes(x.sound)) rimes += 1; if (!L.SPEECH_SOUNDS[x.sound]) bad.push(`unknown sound ${x.sound}`); continue; }
      const said = String(x.text).split(/[^A-Za-z-]+/).flatMap((w) => w.split('-')).filter(Boolean);
      if (said.some((w) => L.soundOfNotation(w))) bad.push(`a sound handed to the voice: ${String(x.text).slice(0, 60)}`);
      if (said.some((w) => /^(?:ig|og|igg)$/i.test(w))) bad.push(`an ending handed to the voice: ${String(x.text).slice(0, 60)}`);
      if (/([A-Za-z])\1{3,}/.test(x.text) && !/[A-Z]{4,}/.test(x.text)) bad.push(`a run of one letter handed to the voice: ${String(x.text).slice(0, 60)}`);
    }
    ok(`no held sound, crisp stop, voiced stop or rhyme ending reaches the device voice; each is the app's own sound (${texts.length} texts, ${sounds} sounds of ${kinds.size} kinds, ${rimes} endings)`, bad.length === 0 && sounds >= 300 && kinds.size >= 13 && rimes >= 20 && ['b', 'd', 'g', 'ig', 'og', 'at'].every((k) => kinds.has(k)), bad.slice(0, 6).join(' | ')); }
  // Mikey's Q51 lines, piece by piece (pass MO): a sound is a piece of its own and no word is added to it; a word said slowly is its
  // held sound and then the whole word; a word stretched at its end is the word and then its sound; a run of sounds is each part in
  // turn; ig is respelled; an at after "ends in" stands alone and "look at" keeps its little word; buh, duh, shh, hmm, a color code
  // and ordinary hyphenated words are the voice's, untouched. Since pass MQ (Mikey's answer to Q60) ig, og and an at that names an
  // ending are the app's own sounds, and so are buh, duh, guh and juh; shh, hmm, huh, a color code and ordinary hyphenated words
  // stay the voice's, and so does a vowel letter alone in a run, which waits on trial (EARMARKS A42).
  { const say = (t) => L.speechPieces(t).map((x) => (x.sound ? `[${x.sound}]` : x.text.trim())).join('|');
    const cases = [
      ['Sun. Sss. The word sun starts with the sound sss.', 'Sun.|[s]|The word sun starts with the sound|[s]'],
      ['Moon. Mmm. The word moon starts with the sound mmm.', 'Moon.|[m]|The word moon starts with the sound|[m]'],
      ['Tap and top both start with the same sound, tuh. They begin alike.', 'Tap and top both start with the same sound,|[t]|They begin alike.'],
      ['Fan starts with fff, so it begins differently from tap and top.', 'Fan starts with|[f]|, so it begins differently from tap and top.'],
      ['Moon and map both start with mmm.', 'Moon and map both start with|[m]'],
      ['Sun and fun both end with un, and pig and wig both end with ig.', 'Sun and fun both end with un, and pig and wig both end with|[ig]'],
      ['Cat and dog do not rhyme. One ends in at, and the other ends in og.', 'Cat and dog do not rhyme.|One ends in|[at]|, and the other ends in|[og]'],
      ['Hat ends with at and sun ends with un, so they do not rhyme.', 'Hat ends with|[at]|and sun ends with un, so they do not rhyme.'],
      ['So Rosa said them slowly, cat, at, and dog, og.', 'So Rosa said them slowly, cat,|[at]|, and dog,|[og]'],
      ['These two words end with the same sound, at. They rhyme.', 'These two words end with the same sound,|[at]|They rhyme.'],
      ['Look at the cat. She sat at the table.', 'Look at the cat.|She sat at the table.'],
      ['Mmm-at. Mmm, like moon! she said. Mat!', '[m]|Mat|[m]|, like moon!|she said.|Mat!'],
      ['Sss-am, said Sam slowly. Sss! he said.', '[s]|Sam|, said Sam slowly.|[s]|he said.'],
      ['S, h, e, l, l. Sss-huh. That was not shell.', 'S, h, e, l, l.|[s]|huh|That was not shell.'],
      ['Then came bus. Busss. The last sound was sss, a hiss like a snake.', 'Then came bus.|Bus|[s]|The last sound was|[s]|, a hiss like a snake.'],
      ['Mmm-a-puh, mmm-a-puh, map!', '[m]|a|[p]|[m]|a|[p]|, map!'],
      ['C-U-P was cuh-uh-puh, cup.', 'C-U-P was|[k]|uh|[p]|, cup.'],
      // Pass MP: a list of example words is said one word at a time (Mikey: "Ball, bed and bear should be spaced out a little
      // more"), and a letter named before says or makes is a piece of its own (his note on row 32: "the letter a is just easily
      // missed"); a list that is not about sounds, and a letter that labels something, are read as before.
      ['Ball, bed and bear all start with buh.', 'Ball|bed|and bear|all start with|[b]'],
      ['Sock, block and rock all rhyme. Bear and chair rhyme.', 'Sock|block|and rock|all rhyme.|Bear and chair rhyme.'],
      ['“Cat, mat and bat all end in at!” said Pat.', 'Cat|mat|and bat|all end in|[at]|!” said Pat.'],
      ['Water, oxygen and warmth start a seed.', 'Water, oxygen and warmth start a seed.'],
      ['In cap, the a says aa, but in cape, the a says its name, ay.', 'In cap,|the A|says aa, but in cape,|the A|says its name, ay.'],
      ['C says cuh, a says the sound at the start of apple, and n says nnn.', 'C|says|[k]|A|says the sound at the start of apple, and|N|says|[n]'],
      ['Dog ends with guh, the sound G makes.', 'Dog ends with|[g]|, the sound|G|makes.'],
      ['Jam starts with juh. H says huh.', 'Jam starts with|[j]|H|says huh.'],
      ['Read this word the same way. Cuh, a, nnn. Can.', 'Read this word the same way.|[k]|, a,|[n]|Can.'],
      ['Here is what source B says, with source D\'s objection.', 'Here is what source B says, with source D\'s objection.'],
      ['Shh, said Mom. Hmmm, said Dad. FFFFFF is white on a well-known T-shirt.', 'Shh, said Mom.|Hmmm, said Dad.|FFFFFF is white on a well-known T-shirt.'],
      ['L says lll, and r says rrr. Z says zzz, and n says nnn.', 'L|says|[l]|, and|R|says|[r]|Z|says|[z]|, and|N|says|[n]'],
      ['How many votes is that, at least?', 'How many votes is that, at least?'],
    ];
    const wrong = cases.filter(([t, want]) => say(t) !== want).map(([t, want]) => `${t} => ${say(t)} (want ${want})`);
    // The listed words and the named letters take the word-at-play shape, held slowly and a little higher.
    const keyed = L.speechPieces('Ball, bed and bear all start with buh.').slice(0, 3).every((p) => p.shape === 'key') && L.speechPieces('C says cuh, a says the sound at the start of apple.').filter((p) => /^[CA]$/.test(p.text)).every((p) => p.shape === 'key');
    if (!keyed) wrong.push('a listed word or a named letter is not in the word-at-play shape');
    // On trial (the voice check page's trial rows, pass MP): the app's buh, duh, guh and juh, its ig, og and at, and a vowel letter
    // alone in a run of sounds as the app's short vowel; never in a lesson (the test above holds every lesson to SPEECH_SOUNDS).
    // Since pass MQ the lessons take all of them but the vowels (Q60), so on trial only a lone vowel differs from a lesson.
    const tryIt = (t) => L.speechPieces(t, { trial: true }).map((x) => (x.sound ? `[${x.sound}]` : x.text.trim())).join('|');
    const trials = [
      ['Ball, bed and bear all start with buh.', 'Ball|bed|and bear|all start with|[b]'],
      ['Cat and dog do not rhyme. One ends in at, and the other ends in og.', 'Cat and dog do not rhyme.|One ends in|[at]|, and the other ends in|[og]'],
      ['Read this word the same way. Cuh, a, nnn. Can.', 'Read this word the same way.|[k]|[a]|[n]|Can.'],
      ['Mmm-a-puh, mmm-a-puh, map!', '[m]|[a]|[p]|[m]|[a]|[p]|, map!'],
      ['Pig and wig both end with ig. Look at the cat.', 'Pig and wig both end with|[ig]|Look at the cat.'],
    ];
    for (const [t, want] of trials) if (tryIt(t) !== want) wrong.push(`on trial ${t} => ${tryIt(t)} (want ${want})`);
    if (!Object.keys(L.TRIAL_SOUNDS).every((k) => L.soundClipSamples(k) && !L.SPEECH_SOUNDS[k])) wrong.push('a trial sound is not made, or is already a lesson\'s');
    const heard = L.heardForm('map starts with mmm.') === 'map starts with mmm.' && L.heardForm('Mmm-at.') === 'Mmm Mat.' && L.heardForm('Busss.') === 'Bus sss.' && L.heardForm('Sss-huh.') === 'Sss huh.' && L.heardForm('A well-known T-shirt.') === 'A well-known T-shirt.';
    ok('Mikey\'s Q51 lines are said in pieces: each sound the app\'s own with no word added, a word said slowly as its sound and then the word, the endings ig, og and at and the voiced stops the app\'s own since Q60, and the rest the voice\'s', wrong.length === 0 && heard, wrong.slice(0, 4).join(' || ')); }
  // A sounded-out run never hands the voice a vowel letter alone (pass MO, found while the app's sounds were built; CLAUDE.md's
  // pass JV line: a voice reads a lone letter as its name, so "Cuh, a, puh." is heard "cuh, ay, puh", never the a of apple). Every
  // story and every read-aloud lesson line, sentence by sentence: a vowel letter set off by commas or hyphens beside a sound
  // written as a sound (cuh, duh, nnn, shh, ks) fails, unless it waits by name for grade 1's review (EARMARKS A42), a list that
  // only falls. A vowel named as a letter ("a says the sound at the start of apple", "the letters a, e, i, o and u"), the article
  // before a word ("sss, a hiss like a snake") and a vowel's name said as its long sound ("Cuh, ay, puh.") pass.
  { const S5 = await import('../src/stories.mjs');
    const sounded = (w) => !!w && (/^(?:[bcdfghjklmnpqrstvwxyz]{1,2}uh|([a-z])\1{2,}|shh|ks)$/i.test(w) || !!L.soundOfNotation(w));
    const loneVowels = (sentence) => { const toks = [...String(sentence).matchAll(/[A-Za-z]+/g)].map((m) => ({ w: m[0], at: m.index, end: m.index + m[0].length })); const s = String(sentence);
      return toks.filter((k, i) => { if (!/^[aeiou]$/i.test(k.w)) return false; const before = s.slice(0, k.at).replace(/\s+$/, ''); const after = s.slice(k.end).replace(/^\s+/, '');
        const setOff = (before === '' || /[,-]$/.test(before)) && (after === '' || /^[,.!?-]/.test(after)); return setOff && (sounded((toks[i - 1] || {}).w) || sounded((toks[i + 1] || {}).w)); }).length; };
    const WAITING_A42 = new Set(['reading-1/read-the-word: Cuh, a, nnn.', 'reading-1/read-the-word: Duh, o, guh.', 'reading-1/read-the-word: Huh, a, tuh.', 'reading-1/read-the-word: Rrr, e, duh.', 'reading-1/read-the-word: Sss, i, ks.',
      'reading-1/sh-ch-th: Shh, i, puh.', 'reading-1/sh-ch-th: Fff, i, shh.', 'reading-1/sh-ch-th: Mmm, u, and the chair sound.', 'reading-1/silent-e: Cuh, a, puh.', 'story read-the-word: Mmm-a-puh, mmm-a-puh, map!']);
    const found = new Set(); let read = 0;
    const look = (where, text) => { for (const sentence of String(text || '').split(L.SENTENCE_BREAK)) { if (!sentence.trim()) continue; read += 1; if (loneVowels(sentence.trim())) found.add(`${where}: ${sentence.trim()}`); } };
    for (const c of L.COURSES.filter((x) => x.readAloud)) for (const m of c.modules) { let lines = []; try { lines = L.readAloudScript(m); } catch (e) { /* no script */ } for (const line of lines) look(`${c.id}/${m.id}`, typeof line === 'string' ? line : line.say || line.text || ''); }
    for (const table of [S5.STORIES, S5.COURSE_STORIES, S5.MASTERY_STORIES]) for (const [id, st] of Object.entries(table)) for (const w of [].concat(st.words || [])) look(`story ${id}`, w);
    const unlisted = [...found].filter((k) => !WAITING_A42.has(k)); const stale = [...WAITING_A42].filter((k) => !found.has(k));
    const near = ['C says cuh, a says the sound at the start of apple, and t says tuh.', 'Bus ends with sss, a hiss like a snake, so bus ends with S.', 'The letters a, e, i, o and u are the vowels.', 'Cuh, ay, puh.', 'E. Li. Jah.'].every((x) => x.split(L.SENTENCE_BREAK).every((y) => loneVowels(y) === 0))
      && ['Cuh, a, puh.', 'Mmm-a-puh, map!', 'Sss, i, ks.', 'Mmm, u, and the chair sound.', 'Buh, e, duh.'].every((x) => loneVowels(x) === 1);
    ok(`no sounded-out run hands the voice a vowel letter alone, ten grade 1 runs waiting by name (EARMARKS A42; ${read} sentences read)`, read > 20000 && near && unlisted.length === 0 && stale.length === 0, `new: ${unlisted.join(' | ')}; listed but clean: ${stale.join(' | ')}; near misses ${near}`); }
  // The voice check page runs the app's own speech code (round one's code check, pass MO): its script, run in node:vm, holds every
  // function it calls, says each lesson row as the app does and plays the app's own sounds, so code that moves out of the page's
  // slices fails here rather than building a page that plays nothing.
  // Since round one's code check (pass MP) each row's sounds are read by name, beside two planted pages it must catch: every sound
  // row playing sss, and the trial rows playing duh for buh (each passed when a sound was read only as "a sound"). Since pass MQ the
  // lessons say buh (Q60), so the second plant has the lesson rows play duh for buh (rows 19 and 45 must be caught), and a third has
  // the trial rows play the e of egg for the short a (row 49), and since round one's code check a fourth has no rests between sentences. Since p52 (pass MQ) a fifth plant hands the lesson rows the page's old
  // pause, a rest before every new sentence piece, which row 21 must catch ("Sss! he said": no rest inside a sentence, as p48 rules), and since round five a sixth, a 200 ms rest there.
  { const VC = await import('../tools/voice-check.mjs'); const problems = await VC.voiceCheckSelfTest(L);
    const plantA = VC.VOICE_CHECK_SCRIPT.replace("playSound(row.sound, done)", "playSound('s', done)"); const plantB = VC.VOICE_CHECK_SCRIPT.replace("row.kind === 'line' ? speechPieces(row.text)", "row.kind === 'line' ? speechPieces(row.text).map((p) => (p.sound === 'b' ? { ...p, sound: 'd' } : p))");
    const plantC = VC.VOICE_CHECK_SCRIPT.replace("speechPieces(row.text, { trial: true })", "speechPieces(row.text, { trial: true }).map((p) => (p.sound === 'a' ? { ...p, sound: 'e' } : p))");
    const plantD = VC.VOICE_CHECK_SCRIPT.replace('pause: young ? restBefore(YOUNG_PAUSE_MS) : null', 'pause: null');   // no rests (pass MQ, round one's code check)
    const plantE = VC.VOICE_CHECK_SCRIPT.replace('pause: young ? restBefore(YOUNG_PAUSE_MS) : null', 'pause: young ? () => YOUNG_PAUSE_MS : null');   // a rest inside a sentence (p52)
    const plantF = VC.VOICE_CHECK_SCRIPT.replace('pause: young ? restBefore(YOUNG_PAUSE_MS) : null', 'pause: young ? (next) => (startsSentence(next) ? YOUNG_PAUSE_MS : 200) : null');   // a short rest inside one (round five)
    const caughtB = plantB !== VC.VOICE_CHECK_SCRIPT ? await VC.voiceCheckSelfTest(L, plantB) : [];
    const caught = plantA !== VC.VOICE_CHECK_SCRIPT && plantB !== VC.VOICE_CHECK_SCRIPT && plantC !== VC.VOICE_CHECK_SCRIPT && (await VC.voiceCheckSelfTest(L, plantA)).length > 0 && caughtB.some((x) => /row 45/.test(x)) && caughtB.some((x) => /row 19/.test(x)) && (await VC.voiceCheckSelfTest(L, plantC)).some((x) => /row 49/.test(x)) && plantD !== VC.VOICE_CHECK_SCRIPT && (await VC.voiceCheckSelfTest(L, plantD)).some((x) => / rests \d+ ms before /.test(x))
      && plantE !== VC.VOICE_CHECK_SCRIPT && (await VC.voiceCheckSelfTest(L, plantE)).some((x) => /^row 21 rests \d+ ms before "he said, and he hissed like a snake\.", inside its sentence$/.test(x))
      && plantF !== VC.VOICE_CHECK_SCRIPT && (await VC.voiceCheckSelfTest(L, plantF)).some((x) => /^row 21 rests \d+ ms before "he said, and he hissed like a snake\.", inside its sentence$/.test(x));
    ok(`the voice check page runs the app's own speech code, its rows said as the app says them and each sound played by name (${VC.VOICE_CHECK_ROWS.filter((r) => r.kind === 'line').length} lines; six planted pages caught, the fourth with no rests between sentences, the fifth and sixth with a rest inside one, 450 and 200 ms)`, problems.length === 0 && caught, problems.join('; ') || `plants caught ${caught}`); }
  // The sounds themselves (pass MO), measured: the same samples every time; a held sound 0.85 seconds (1.1 on the snail), a crisp
  // stop under a quarter of a second; no click at either end; loud enough to hear and never clipped; and each one's energy where
  // that sound's is (sss high, its loudest part near 6,500 cycles a second, fff spread out and softer, zzz a hiss over a buzz, mmm and
  // nnn a low hum with their dips apart, rrr's low third resonance, and the bursts of t, p and k high, low and in the middle). The WAV
  // file is 16-bit, one channel, 32,000 samples a second. Proven failing on copies with sss low-passed, a stop's burst swapped and
  // a hold of 0.5.
  // Since pass MP (Mikey's notes on Q51 and his answer to Q57): sss, fff and zzz are two breaths of 0.32 seconds (0.4 on the snail)
  // with a true quiet of 0.13 (0.17) between; t, p and k end in a short, soft uh, voiced, quieter than the burst; and the sounds made
  // for the voice check page alone are measured too: the five short vowels 0.42 seconds (0.55 on the snail), each one's first two
  // resonances within 160 cycles a second of its own (a 860 and 2,050; e 610 and 2,330; i 480 and 2,370; o 910 and 1,390; u 750
  // and 1,430); buh, duh, guh and juh a low hum first, then the release, then an uh softer than the release; and ig, og and at a
  // vowel with its own resonances, a closing quiet, then the release. The check is a function, run on the app's sounds and on
  // planted near misses beside it (a held hiss with no gap, o's sound given for a, an uh louder than the t's burst, a b with no hum
  // before it, an ig whose vowel is e's), each of which it must catch.
  { const fft = (re) => { const n = re.length; const im = new Float64Array(n); for (let i = 1, j = 0; i < n; i++) { let bit = n >> 1; for (; j & bit; bit >>= 1) j ^= bit; j ^= bit; if (i < j) { [re[i], re[j]] = [re[j], re[i]]; } }
      for (let len = 2; len <= n; len <<= 1) { const ang = (-2 * Math.PI) / len; for (let i = 0; i < n; i += len) for (let k = 0; k < len / 2; k++) { const wr = Math.cos(ang * k); const wi = Math.sin(ang * k); const a = i + k; const b2 = a + len / 2; const xr = re[b2] * wr - im[b2] * wi; const xi = re[b2] * wi + im[b2] * wr; re[b2] = re[a] - xr; im[b2] = im[a] - xi; re[a] += xr; im[a] += xi; } }
      return Array.from({ length: n / 2 }, (_, k) => re[k] * re[k] + im[k] * im[k]); };
    const R = L.SOUND_RATE;
    const spectrum = (x, from, len) => { const n = 8192; const re = new Float64Array(n); for (let i = 0; i < Math.min(len, n); i++) re[i] = x[from + i] || 0; const P = fft(re); const tot = P.reduce((a, v) => a + v, 0) || 1;
      const band = (lo, hi) => P.reduce((a, v, k) => { const f = (k * R) / n; return f >= lo && f < hi ? a + v : a; }, 0) / tot;
      const sm = P.map((_, k) => { let s = 0; for (let j = Math.max(0, k - 15); j <= Math.min(P.length - 1, k + 15); j++) s += P[j]; return s; }); const peak = (sm.indexOf(Math.max(...sm)) * R) / n;
      const peakIn = (lo, hi) => { let best = -1; let at = 0; for (let k = Math.ceil((lo * n) / R); k <= Math.floor((hi * n) / R); k++) if (sm[k] > best) { best = sm[k]; at = k; } return (at * R) / n; };
      return { band, peak, peakIn }; };
    const rms = (x) => Math.sqrt(x.reduce((a, v) => a + v * v, 0) / x.length);
    const rmsOf = (x, from, to) => { let q = 0; for (let i = from; i < to; i++) q += x[i] * x[i]; return Math.sqrt(q / Math.max(1, to - from)); };
    const frames = (x) => { const e = []; for (let i = 0; i + 160 <= x.length; i += 160) e.push(rmsOf(x, i, i + 160)); return e; };   // 5 ms each
    const VOWEL_AT = { a: [860, 2050], e: [610, 2330], i: [480, 2370], o: [910, 1390], u: [750, 1430] };
    const vowelOff = (sp, v) => { const [f1, f2] = VOWEL_AT[v]; const p1 = sp.peakIn(300, 1100); const p2 = sp.peakIn(1150, 2700); return Math.abs(p1 - f1) > 160 || Math.abs(p2 - f2) > 160 ? `${Math.round(p1)} and ${Math.round(p2)}` : null; };
    const soundProblems = (get) => {
      const held = (s) => { const x = get(s); return { x, sp: spectrum(x, s === 's' || s === 'f' || s === 'z' ? Math.round(0.05 * R) : (x.length >> 1) - 4096, 8192) }; };
      const S = Object.fromEntries(['s', 'f', 'z', 'm', 'n', 'l', 'r'].map((s) => [s, held(s)]));
      const shape = [];
      for (const s of ['m', 'n', 's', 'f', 'z', 'l', 'r', 't', 'p', 'k', 'a', 'e', 'i', 'o', 'u', 'b', 'd', 'g', 'j', 'ig', 'og', 'at']) {
        const x = get(s); const y = get(s); const slow = get(s, { slow: true });
        if (!x) { shape.push(`${s} is not made`); continue; }
        const peak = Math.max(...x.map(Math.abs)); const ends = Math.max(...[...x.slice(0, 16), ...x.slice(-16)].map(Math.abs)); const secs = x.length / R; const slowSecs = slow.length / R;
        const same = x.length === y.length && x.every((v, i) => v === y[i]);
        if (!same) shape.push(`${s} changes from one call to the next`);
        const want = 'mnlr'.includes(s) ? [0.85, 1.1] : 'sfz'.includes(s) ? [0.77, 0.97] : 'aeiou'.includes(s) ? [0.42, 0.55] : null;
        if (want ? Math.abs(secs - want[0]) > 0.001 || Math.abs(slowSecs - want[1]) > 0.001 : secs < 0.1 || secs > (s.length > 1 ? 0.45 : 0.3)) shape.push(`${s} lasts ${secs.toFixed(3)}s`);
        if (peak > 0.9 || peak < 0.15) shape.push(`${s} peaks at ${peak.toFixed(2)}`);
        if (ends > 0.02) shape.push(`${s} starts or ends with a click (${ends.toFixed(3)})`);
        if (want && rms(x) < 0.03) shape.push(`${s} is too quiet (${rms(x).toFixed(3)})`);
      }
      // Two breaths with a true quiet between (Mikey: "split the sound into fragments like sss sss sun").
      for (const s of ['s', 'f', 'z']) { const x = get(s); const one = Math.round(0.32 * R); const gap = Math.round(0.13 * R);
        if (Math.max(...x.slice(one + 200, one + gap - 200).map(Math.abs)) > 0.005 || rmsOf(x, 2000, one - 2000) < 0.03 || rmsOf(x, one + gap + 2000, 2 * one + gap - 2000) < 0.03) shape.push(`${s} is not two breaths with a quiet between`); }
      const stop = (s) => { const x = get(s); const lead = Math.round(0.03 * R); return { lead: Math.max(...x.slice(0, lead).map(Math.abs)), sp: spectrum(x, lead, Math.round((s === 'k' ? 0.016 : 0.008) * R)) }; };
      const T = stop('t'); const P = stop('p'); const K = stop('k');
      // The uh after a crisp stop: voiced (most of its energy under 1,000 cycles a second) and softer than the burst.
      // The burst is the first loud moment after the quiet lead, the uh the loudest moment from 45 ms after it.
      const uhAfter = (s) => { const x = get(s); const e = frames(x); const burst = Math.max(0, e.findIndex((v) => v > 0.05)); const from = burst + 9; const tail = e.slice(from); const at = from + tail.indexOf(Math.max(...tail)); return { burst: Math.max(...e.slice(burst, burst + 3)), uh: e[at], low: spectrum(x, at * 160, 1600).band(0, 1000) }; };
      const uhs = ['t', 'p', 'k'].map(uhAfter);
      // A voiced stop: a low hum first, then the release, then an uh softer than the release.
      const voicedStop = (s) => { const x = get(s); const e = frames(x); const burst = e.indexOf(Math.max(...e)); const lead = spectrum(x, 0, Math.round(0.04 * R)); const tail = e.slice(burst + 3);
        return burst >= 6 && rmsOf(x, 0, Math.round(0.03 * R)) > 0.005 && lead.band(0, 600) >= 0.9 && Math.max(...tail) < e[burst] * 0.8 && spectrum(x, (burst + 3 + tail.indexOf(Math.max(...tail))) * 160, 1600).band(0, 1000) >= 0.6; };
      // A rime: its vowel's resonances, a closing quiet, then the release.
      const rime = (s, v) => { const x = get(s); const sp = spectrum(x, Math.round(0.05 * R), Math.round(0.15 * R)); const e = frames(x); const quiet = e.slice(53, 60); const after = e.slice(60);
        return !vowelOff(sp, v) && Math.max(...quiet) < 0.03 && Math.max(...after) > 0.1; };
      const where = [
        ['sss high, in the range where an s peaks', S.s.sp.band(4000, 16000) >= 0.85 && S.s.sp.band(0, 2000) <= 0.02 && S.s.sp.peak >= 5500 && S.s.sp.peak <= 8000],
        ['fff spread out, flat and softer than sss', S.f.sp.band(1500, 16000) >= 0.9 && [2000, 3000, 4000, 5000, 6000, 7000, 8000].every((lo) => S.f.sp.band(lo, lo + 1000) <= 0.2) && rms(S.f.x) < rms(S.s.x)],
        ['zzz a hiss over a buzz', S.z.sp.band(0, 500) >= 0.2 && S.z.sp.band(4000, 16000) >= 0.2],
        ['mmm and nnn a low hum, their dips apart', S.m.sp.band(0, 1000) >= 0.98 && S.n.sp.band(0, 1000) >= 0.98 && S.m.sp.band(800, 1100) < S.n.sp.band(800, 1100) && S.n.sp.band(1600, 1900) < S.m.sp.band(1600, 1900)],
        ['lll and rrr voiced and low, rrr\'s third resonance low', S.l.sp.band(0, 1500) >= 0.98 && S.r.sp.band(0, 1500) >= 0.98 && S.r.sp.band(1400, 1900) > 3 * S.l.sp.band(1400, 1900)],
        ['t, p and k a quiet moment, then a burst high, low and in the middle', T.lead === 0 && P.lead === 0 && K.lead === 0 && T.sp.band(4000, 16000) >= 0.8 && P.sp.band(0, 2000) >= 0.6 && T.sp.peak > 4000 && P.sp.peak < 1500 && K.sp.peak >= 1600 && K.sp.peak <= 2800],
        ['t, p and k end in a short, soft uh, voiced and quieter than the burst', uhs.every((u) => u.uh > 0.015 && u.uh < u.burst * 0.6 && u.low >= 0.5)],
        ...['a', 'e', 'i', 'o', 'u'].map((v) => { const x = get(v); const off = vowelOff(spectrum(x, Math.round(0.08 * R), Math.round(0.26 * R)), v); return [`the vowel ${v} has its own resonances${off ? ` (found ${off})` : ''}`, !off]; }),
        ...['b', 'd', 'g', 'j'].map((s) => [`${s} is a low hum, the release and a soft uh`, voicedStop(s)]),
        ['ig, og and at are a vowel, a closing quiet and the release', rime('ig', 'i') && rime('og', 'o') && rime('at', 'a')],
      ].filter(([, okay]) => !okay).map(([what]) => what);
      return [...shape, ...where];
    };
    const real = soundProblems((s, o) => L.soundClipSamples(s, o));
    // The near misses, each a copy of one sound changed the way a mistake would change it, and each must be caught.
    const plant = (name, change) => soundProblems((s, o) => change(s, o) || L.soundClipSamples(s, o)).length > 0 ? null : name;
    const loud = (x, from, g) => { const y = Float32Array.from(x); for (let i = from; i < y.length; i++) y[i] *= g; return y; };
    const missed = [
      plant('a held hiss with no gap', (s, o) => { if (s !== 's') return null; const x = Float32Array.from(L.soundClipSamples('s', o)); const one = Math.round((o && o.slow ? 0.4 : 0.32) * R); const gap = Math.round((o && o.slow ? 0.17 : 0.13) * R); for (let i = one; i < one + gap; i++) x[i] = x[i - gap]; return x; }),
      plant('o\'s sound given for a', (s, o) => (s === 'a' ? L.soundClipSamples('o', o) : null)),
      plant('an uh louder than the t\'s burst', (s, o) => (s === 't' ? loud(L.soundClipSamples('t', o), Math.round(0.065 * R), 6) : null)),
      plant('a b with no hum before it', (s, o) => { if (s !== 'b') return null; const x = Float32Array.from(L.soundClipSamples('b', o)); for (let i = 0; i < Math.round(0.044 * R); i++) x[i] = 0; return x; }),
      plant('an ig whose vowel is e\'s', (s, o) => { if (s !== 'ig') return null; const x = Float32Array.from(L.soundClipSamples('ig', o)); const e = L.soundClipSamples('e', o); for (let i = 0; i < Math.round(0.24 * R); i++) x[i] = e[i + Math.round(0.05 * R)]; return x; }),
    ].filter(Boolean);
    const wav = L.soundClipWav('s'); const dv = new DataView(wav.buffer); const tag = (o) => String.fromCharCode(...wav.slice(o, o + 4));
    const file = tag(0) === 'RIFF' && tag(8) === 'WAVE' && dv.getUint16(22, true) === 1 && dv.getUint32(24, true) === R && dv.getUint16(34, true) === 16 && dv.getUint32(40, true) === L.soundClipSamples('s').length * 2;
    const quiet = L.soundClipSamples('quiet'); const nothing = L.soundClipSamples('buh') === null && L.soundClipWav('x') === null;
    ok('the app\'s own sounds: the same every time, the right length, no click, never clipped, each one\'s energy where that sound\'s is, and a playable WAV; since pass MP sss, fff and zzz in two breaths, an uh after t, p and k, and the vowels, voiced stops and endings made for the voice check page, each near miss caught', real.length === 0 && missed.length === 0 && file && quiet.length === Math.round(0.05 * R) && quiet.every((v) => v === 0) && nothing, [...real, ...missed.map((m) => `missed: ${m}`)].join('; ')); }
  // A title before a name never ends a sentence (pass MN, round one's story flow check, and the code it led to): every split of the
  // app's words into sentences keeps Mr., Mrs., Ms., Dr. and Jr. inside their sentence (SENTENCE_BREAK). Until then a kindergarten
  // lesson printed "we honor Dr." on a line of its own, the voice was handed "Ms." alone as a held word at play, and the read-along
  // lit "Mr." as a sentence. Every story and every lesson's words, key idea and script, as spoken (speechPieces) and as printed
  // (formatTeachingText), and the read-along's and the audio ledger's splits, read from their source.
  { const S4 = await import('../src/stories.mjs'); const texts = [];
    for (const table of [S4.STORIES, S4.COURSE_STORIES, S4.MASTERY_STORIES]) for (const st of Object.values(table)) for (const w of [].concat(st.words || [])) texts.push(w);
    for (const m of L.MODULES) { const ls = m.lesson || {}; for (const t of [...(ls.paragraphs || []), ls.keyIdea || '', ...(ls.script || []).map((x) => x.say || '')]) texts.push(t); }
    // A title, since round two's code check a middle initial (Stephen F.), and since round four's code read two initials of a run
    // (B. F.), or a lone initial before a piece that starts with one (B. then F.).
    const TITLE_END = /\b(?:Mr|Mrs|Ms|Dr|Jr)\.$|\b[A-Z][a-z]+ [A-Z]\.$|\b[A-Z]\. [A-Z]\.$/;
    const runCut = (parts) => parts.some((p, i) => i + 1 < parts.length && /(?:^|[\s("“])[A-Z]\.$/.test(p.trim()) && /^[A-Z]\.(?:\s|$)/.test(parts[i + 1].trim()));
    const cut = texts.filter((t) => { const sp = L.speechPieces(t).map((p) => p.text); const ln = String(L.formatTeachingText(t)).split('\n'); return sp.some((p) => TITLE_END.test(p.trim())) || ln.some((line) => TITLE_END.test(line.trim())) || runCut(sp) || runCut(ln); });
    const titled = texts.filter((t) => /\b(?:Mr|Mrs|Ms|Dr|Jr)\. [A-Z]/.test(t)).length;
    const ui = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8'); const ledger = readFileSync(new URL('../tools/audio-ledger.mjs', import.meta.url), 'utf8');
    const unit = L.speechPieces('Ms. Reyes held up a jar. But his teacher, Mr. Beto, sat down.').length === 2 && L.speechPieces('I saw Mr. Beto. He waved.').length === 2 && !L.formatTeachingText('We honor Dr. King. He worked hard.').includes('Dr.\n')
      && L.speechPieces('We remember Christopher Columbus, Stephen F. Austin and José Antonio Navarro. They shaped Texas.').length === 2 && !L.formatTeachingText('The city is named for Stephen F. Austin, the Father of Texas. Many people live there.').includes('F.\n') && 'Start with B. Next he tried H.'.split(L.SENTENCE_BREAK).length === 2
      && L.speechPieces('Behaviorism, extended by B. F. Skinner\'s work, led for decades. Then minds came back.').length === 2 && !/(B|F)\.\n/.test(L.formatTeachingText('Operant conditioning follows it: B. F. Skinner showed it from the 1930s. Rewards grow a behavior.'))
      && 'W. E. B. Du Bois wrote it. He was first.'.split(L.SENTENCE_BREAK).length === 2 && 'He read "W. E. B. Du Bois" aloud. Then he sat.'.split(L.SENTENCE_BREAK).length === 2 && 'E. Li. Jah.'.split(L.SENTENCE_BREAK).length === 3;
    const tools = ['story-flow', 'cast-ages', 'question-review'].every((t) => readFileSync(new URL(`../tools/${t}.mjs`, import.meta.url), 'utf8').includes('(?<!\\b(?:Mr|Mrs|Ms|Dr|Jr)\\.)(?<!\\b[A-Z][a-z]+ [A-Z]\\.)(?<!\\b[A-Z]\\. [A-Z]\\.)(?!(?<=(?:^|[\\s("“])[A-Z]\\.)\\s+[A-Z]\\.(?:\\s|$))'));
    // Every place the rule joins two pieces at an initial lies inside a name on this reviewed list, so a capital and a period that end a
    // real sentence ("Big A. Small a.") never join two sentences unnoticed (round four's code read); add a name only once it is read.
    const NAMES = ['Stephen F. Austin', 'John B. Watson', 'Edward T. Hall', 'B. F. Skinner'];
    const G = new RegExp(L.SENTENCE_BREAK.source, 'g'); const strays = []; let joins = 0;
    for (const t of [...texts, ...INITIAL_EXPLAINS]) { const real = new Set([...t.matchAll(G)].map((m) => m.index));
      const inName = (i) => NAMES.some((n) => { for (let at = t.indexOf(n); at >= 0; at = t.indexOf(n, at + 1)) if (at < i && i < at + n.length) return true; return false; });
      for (const m of t.matchAll(/(?<=[.!?])\s+/g)) { if (real.has(m.index) || /\b(?:Mr|Mrs|Ms|Dr|Jr)\.$/.test(t.slice(0, m.index))) continue; joins++; if (!inName(m.index)) strays.push(t.slice(Math.max(0, m.index - 30), m.index + 20)); } }
    ok(`every place the sentence rule joins at an initial is inside a reviewed name (${joins} joins read, ${INITIAL_EXPLAINS.size} question texts with an initial among them)`, joins >= 30 && INITIAL_EXPLAINS.size >= 400 && strays.length === 0, strays.slice(0, 4).join(' | '));
    ok(`a title before a name, a middle initial or a run of initials never ends a sentence, spoken, printed or lit, here and in the tools' copies of the rule (${titled} lines with a title read)`, unit && tools && titled >= 15 && cut.length === 0 && /function sentencesOf\(text\) \{ return String\(text \|\| ''\)\.split\(SENTENCE_BREAK\)/.test(ui) && /split\(SENTENCE_BREAK\)/.test(ledger), cut.slice(0, 4).map((t) => t.slice(0, 60)).join(' | ')); }
  // A tapped answer says itself for a pre-reader only when hearing it gives nothing away (pass MC, the lesson check: tapping each
  // letter until a voice said A passed "Tap the letter A" by ear, and the first try still counted). Every read-aloud bank is
  // sampled: no single letter or picture speaks, a word answer still does, and whether a choice speaks never depends on which
  // choice is right (the second read: a rule that hushed the one answer a question named made the silence itself the answer).
  { const leaks = []; let words = 0;
    for (const c of L.COURSES.filter((x) => x.readAloud)) for (const m of c.modules) for (const g of new Set(m.generators)) for (let sd = 1; sd <= 60; sd += 1) {
      const q = L.generateQuestion(g, sd); if (!q || q.type !== 'choice' || !Array.isArray(q.choices)) continue;
      // A lone letter is a shape to name when the other choices are letters too (quiet), and a word to hear when a longer word
      // stands beside it (a, I among see and dog: it speaks).
      const amongWords = q.choices.some((o) => !String(o).includes(':') && String(o).length > 1);
      for (const ch of q.choices) { const sp = L.choiceSpeaks(q, ch);
        if (sp && /^[A-Za-z]$/.test(String(ch)) && !amongWords) leaks.push(`${g}: the letter ${ch} speaks among letters`);
        if (!sp && /^[A-Za-z]$/.test(String(ch)) && amongWords) leaks.push(`${g}: the word ${ch} is silent among words`);
        if (sp && String(ch).includes(':')) leaks.push(`${g}: the picture ${ch} speaks`);
        if (q.choices.some((other) => L.choiceSpeaks({ ...q, answer: other }, ch) !== sp)) leaks.push(`${g}: whether ${ch} speaks depends on the answer`);
        if (sp) words += 1; } }
    ok('a tapped answer never hands itself over by voice: no letter or picture speaks, words still do, and the right answer changes nothing', leaks.length === 0 && words > 100, [...new Set(leaks)].slice(0, 6).join(' | '));
    const ui = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8');
    ok('the practice screen asks choiceSpeaks before a tapped answer speaks', /if \(choiceSpeaks\(q, c\)\) speak\(c\)/.test(ui) && !/if \(!c\.includes\(':'\)\) speak\(c\)/.test(ui)); }
  // A sign word's asked letter sits in more than one place across the bank (the lesson check's second read: A was the middle tile
  // in every A question, so the place could stand in for the letter).
  { const at = { A: new Set(), B: new Set() };
    for (let sd = 1; sd <= 400; sd += 1) { const q = L.generateQuestion('p3-ab-in-word', sd); at[q.answer].add(q.choices.indexOf(q.answer)); }
    // No sign word sounds like a letter's name (the screen check: "Here is the word sea" with no C on screen).
    const NAME_SOUNDS = ['bee', 'sea', 'see', 'tea', 'pea', 'eye', 'you', 'why', 'are', 'owe', 'jay', 'kay', 'gee', 'cue', 'ewe', 'ex'];
    const said = new Set(); for (let sd = 1; sd <= 400; sd += 1) said.add(((L.generateQuestion('p3-ab-in-word', sd).story || '').match(/word ([a-z]+),/) || [])[1]);
    { const offered = new Set(); const take = (t) => { for (const m of String(t).matchAll(/\b([A-Za-z]+),? (?:starts|start) with [AB]\b/g)) offered.add(m[1].toLowerCase()); for (const m of String(t).matchAll(/so does ([a-z]+)/g)) offered.add(m[1]); for (const m of String(t).matchAll(/([A-Za-z]+) and ([a-z]+) start with/g)) { offered.add(m[1].toLowerCase()); offered.add(m[2]); } };
      for (const g of ['p3-tap-ab', 'p3-name-ab', 'p3-ab-by-look', 'p3-ab-in-word', 'p3-ab-look-alike']) for (let sd = 1; sd <= 300; sd++) { const k = L.generateQuestion(g, sd); const w = /What letter does ([a-z]+) start with/.exec(k.prompt); if (w) offered.add(w[1]); (k.alsoRight || []).forEach(take); }
      const ab = L.COURSES.flatMap((c) => c.modules).find((m) => m.id === 'a-and-b'); ab.lesson.script.forEach((x) => take(x.say)); ab.lesson.paragraphs.forEach(take);
      const ST = await import('../src/stories.mjs'); ST.STORIES['a-and-b'].words.forEach(take);
      ok('no word a letter lesson offers as an example sounds like a letter\'s name, in its questions, its lines or its story', offered.size >= 8 && ![...offered].some((w) => NAME_SOUNDS.includes(w)), [...offered].join(' ')); }
    { let bad = 0; for (let sd = 1; sd <= 3000; sd++) { const k = L.generateQuestion('p3-tap-picture', sd); if (k.answer === 'icon:cloud' && k.choices.includes('icon:rain')) bad++; }
      ok('the rain picture, a cloud with drops, is never a wrong answer to Tap the cloud', bad === 0, bad); }
    ok('in a sign word the asked letter is sometimes first, sometimes not, for A and for B, and no word sounds like a letter', at.A.size >= 2 && at.B.size >= 2 && at.A.has(0) && at.B.has(0) && ![...said].some((w) => NAME_SOUNDS.includes(w)) && said.size >= 12, JSON.stringify({ A: [...at.A], B: [...at.B], said: [...said] })); }
  // A Head Start progression is quoted or its parts named, never retold as what it means for three-year-olds (pass MK, the lesson
  // check: the last such paraphrases, "which for three-year-olds means", were Listen and Point's, and one dropped the second half
  // of P-LC 1). It reads that one wording; other retellings are the lesson brief's to find. The seven Very First Steps citations
  // that still named their progressions' parts without quoting them (Find the Match, Match the Animals, One and Two, More and
  // Fewer, One More and One Fewer, Three Dots, Please and Thank You; EARMARKS E12) quote them since pass ML.
  { const said = L.MODULES.flatMap((m) => (m.sources || []).map((s) => [m.id, s])).filter(([, s]) => /Head Start/.test(s) && /for (?:three|four|five)-year-olds,? (?:it |which )?(?:means|begins)\b/.test(s));
    ok('no Head Start citation retells a progression as what it means for three-year-olds (a paraphrase)', said.length === 0, said.map(([id]) => id).join(', ')); }
  // A pre-K 4 citation quotes its 48 to 60 month progression (pass ML, First Steps' review): every Head Start goal a reviewed
  // pre-K 4 lesson cites names that band, the one its children are in (pass MK's First Steps named it in none of its twenty,
  // ten of them bare codes such as "Goal P-MATH 8.", which round four's read found the first version missed). First Sounds and
  // Letters joined the list in pass MM, with its review.
  { const REVIEWED_PK4 = ['first-steps-pk', 'first-sounds-pk']; const missing = []; let goals = 0;
    for (const cid of REVIEWED_PK4) for (const m of L.getCourse(cid).modules) { const mod = L.MODULES.find((x) => x.id === m.id);
      for (const s of (mod.sources || []).filter((x) => /Head Start/.test(x))) { const cited = [...s.matchAll(/(P-[A-Z]+ \d+)\b/g)];   // a bare code too (Goal P-MATH 8.)
        cited.forEach((g, i) => { goals += 1; const part = s.slice(g.index, i + 1 < cited.length ? cited[i + 1].index : s.length); if (!/48 to 60 month/.test(part)) missing.push(`${m.id} ${g[1]}`); }); } }
    ok(`every Head Start goal a reviewed pre-K 4 lesson cites names its 48 to 60 month progression (${goals} citations)`, goals >= 20 && missing.length === 0, missing.join(', ')); }
  // Let's Play as a child sees it (pass MC, from Mikey's answer on the day-one game: "I think that's a good setup as long as the
  // rest of the courses unlock a new game."). playList is the list the screen draws. For every course, enrolled alone and with
  // its whole grade, as the young learner or older student who takes it: every game the course owns is on the list once its map
  // is painted (the older list had dropped 32 courses' games, even from a walk-through), something is open on day one, and finishing the course opens a
  // game that was not open on day one, for every course but Listen and Point, whose Step on the Circles is Mikey's exception.
  { const allMapArt = Object.values(L.MAPS).map((m) => m.art);
    const missing = []; const noNew = []; const nothing = []; const front = [];
    for (const c of L.COURSES) {
      const young = L.stageForGrade(c.grade) === 'early';
      for (const [how, ids] of [['alone', [c.id]], ['with its grade', L.COURSES.filter((x) => x.grade === c.grade).map((x) => x.id)]]) {
        const courses = L.COURSES.filter((x) => ids.includes(x.id));
        const painted = L.playList({ courses, young, mapArt: allMapArt }); const own = L.COURSE_GAMES[c.id] || [];
        own.filter((id) => !painted.some((g) => g.id === id)).forEach((id) => missing.push(`${c.id} ${how}: ${id}`));
        const list = L.playList({ courses, young }); const open = L.unlockedGameIds([], list);
        if (!list.some((g) => open.has(g.id))) nothing.push(`${c.id} ${how}`);
        if (list.length && !open.has(list[0].id)) front.push(`${c.id} ${how}: ${list[0].id}`);
        if (!L.DAY_ONE_EXCEPTIONS.some((id) => own.includes(id)) && !own.some((id) => list.some((g) => g.id === id) && !open.has(id))) noNew.push(`${c.id} ${how}`);
      }
    }
    ok('every game a course owns is on the Let\'s Play list of a student who takes it (a map once it is painted)', missing.length === 0, missing.slice(0, 8).join(' | '));
    ok('every student has a game open on day one', nothing.length === 0, nothing.slice(0, 8).join(' | '));
    ok('finishing any course but Listen and Point opens a game that was not open on day one', noNew.length === 0, noNew.slice(0, 8).join(' | '));
    // The code check (pass MC): with the old funFirst back, 37 lists led with a locked tile and every test above still passed.
    ok('the first game on every list is open on day one, never a locked tile', front.length === 0, front.slice(0, 8).join(' | '));
    ok('funFirst puts the most playful game that may lead in front, and with none allowed keeps the order', (() => { const deck = { id: 'a', kind: 'pairs' }, pong = { id: 'c', kind: 'pong' }; return L.funFirst([deck, pong], (g) => g !== pong)[0] === deck && L.funFirst([deck, pong])[0] === pong && L.funFirst([deck, pong], () => false)[0] === deck; })());
    const early = (id) => L.getCourse(id); const vfsOnly = L.playList({ courses: [early('very-first-steps-pk3')], young: false });
    ok('a child whose courses are all early-years keeps the young list after finishing the last one, so its games stay', vfsOnly.some((g) => g.id === 'dots-kite') && vfsOnly.some((g) => g.id === 'sort-color'));
    const mixed = L.playList({ courses: [early('very-first-steps-pk3'), early('business-3')], young: true });
    ok('a young learner\'s list draws only on the early-years courses the screens show', !mixed.some((g) => g.id === 'savejar-business-3' || g.id === 'pong') && mixed.some((g) => g.id === 'dots-kite'));
    const k2 = L.playList({ courses: [early('counting-k'), early('letters-k')], young: true });
    // A child with an early-years course and an older one keeps the early course's games once the older list takes over (the code
    // check's second read: Very First Steps beside Money That Works had left Pong and the price game alone).
    const pastEarly = L.playList({ courses: [L.getCourse('very-first-steps-pk3'), L.getCourse('econ-3')], young: false }).map((g) => g.id);
    ok('a child past the early years keeps the games of the early courses still assigned, beside the older course\'s', (L.COURSE_GAMES['very-first-steps-pk3'] || []).every((id) => pastEarly.includes(id)) && (L.COURSE_GAMES['econ-3'] || []).every((id) => pastEarly.includes(id)) && pastEarly.includes('pong'), pastEarly.join(','));
    // The line under Let's Play (pass MC) sits in its own strip outside the moving wash, only for a reader, and its colors pass
    // 4.5 to 1 in both themes (the screen check measured 2.74 to 1 on the wash in the light theme); a best badge on its white chip
    // draws with the paper palette (mint on white was 2.00 to 1 in the dark theme).
    { const ui = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8');
      // The wash under the strip is the fold's body, marked data-fold-body="play" since pass MH (soft wash in the dark theme).
      const at = ui.indexOf('data-play-strip'); const wash = ui.indexOf('data-fold-body="play"', at);
      const cond = ui.slice(ui.lastIndexOf('{open &&', at), at);
      const tok = (theme, key) => (ui.match(new RegExp(`${theme}: \\{[\\s\\S]*?\\b${key}: '(#[0-9A-Fa-f]{6})'`)) || [])[1];
      // The strip's own colors, read from its code: each is written as "C.mode === 'dark' ? '<dark>' : C.<light token>".
      const strip = ui.slice(at, ui.indexOf('</div>', at)); const pick = (prop) => (strip.match(new RegExp(`${prop}: C\\.mode === 'dark' \\? '(#[0-9A-Fa-f]{6})' : C\\.(\\w+)`)) || []).slice(1);
      const [bgDark, bgLight] = pick('background'); const [inkDark, inkLight] = pick('color');
      const lum = (hex) => { const v = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };
      const ratio = (a, b) => (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);
      const light = bgLight && inkLight ? ratio(tok('light', bgLight), tok('light', inkLight)) : 0; const dark = bgDark && inkDark ? ratio(bgDark, inkDark) : 0;
      ok('the Let\'s Play line sits in its own strip, for readers only, at 4.5 to 1 or better in both themes, and a best badge uses paper ink', at > 0 && wash > at && /!youngLearner/.test(cond) && light >= 4.5 && dark >= 4.5 && /data-best-badge style=\{\{[^}]*color: B\.green/.test(ui), JSON.stringify({ light: light.toFixed(2), dark: dark.toFixed(2) })); }
    // A tool that runs on its own checks its own file name with endsWith (the code check, pass MC): comparing import.meta.url with
    // `file://${process.argv[1]}` fails from a folder with a space in its path, as iCloud Drive's has, and the tool then writes
    // nothing, so `node tools/prompts-csv.mjs > docs/LEONARDO-PROMPTS.csv` would have emptied the file.
    { const { readdirSync } = await import('node:fs'); const toolDir = new URL('../tools/', import.meta.url);
      const toolFiles = readdirSync(toolDir).filter((f) => f.endsWith('.mjs'));
      const urlCompare = toolFiles.filter((f) => /import\.meta\.url\s*===\s*`file:\/\/\$\{process\.argv\[1\]\}`/.test(readFileSync(new URL(f, toolDir), 'utf8')));
      const alone = toolFiles.filter((f) => /process\.argv\[1\]/.test(readFileSync(new URL(f, toolDir), 'utf8')));
      const wrongName = alone.filter((f) => !readFileSync(new URL(f, toolDir), 'utf8').includes(`process.argv[1].endsWith('${f}')`));
      ok('every tool that runs on its own checks its own name with endsWith, never import.meta.url against the path', urlCompare.length === 0 && wrongName.length === 0 && alone.length >= 4, [...urlCompare, ...wrongName].join(', '));
      // A tool with a --write flag writes only when it is the file being run (pass ML, the code check): tools/prompts-csv.mjs
      // imports tools/coloring-levels.mjs, whose writer ran on any --write in the command line.
      const writers = toolFiles.filter((f) => /process\.argv\.includes\('--write'\)/.test(readFileSync(new URL(f, toolDir), 'utf8')));
      // The flag must sit on the guard's own line or inside the block the guard opens, not merely somewhere in the file (round
      // four's read): a tool that guarded its printing but wrote on any --write would have passed the first version.
      const insideGuard = (src, f) => { const guard = `process.argv[1].endsWith('${f}')`; const blocks = [];
        for (let g = src.indexOf(guard); g >= 0; g = src.indexOf(guard, g + 1)) { const open = src.indexOf('{', g); let depth = 0;
          for (let k = open; k >= 0 && k < src.length; k++) { if (src[k] === '{') depth += 1; else if (src[k] === '}') { depth -= 1; if (depth === 0) { blocks.push([g, k]); break; } } } }
        return [...src.matchAll(/process\.argv\.includes\('--write'\)/g)].every((m) => blocks.some(([a, b]) => a < m.index && m.index < b) || src.slice(src.lastIndexOf('\n', m.index) + 1, src.indexOf('\n', m.index)).includes(guard)); };
      const unguarded = writers.filter((f) => !insideGuard(readFileSync(new URL(f, toolDir), 'utf8'), f));
      ok('a tool with a --write flag writes only when it is the file being run, never when another tool imports it', writers.length >= 2 && unguarded.length === 0, unguarded.join(', '));
      // Every tool parses (pass MM, round four): an apostrophe inside a single-quoted string broke tools/content-diff.mjs, and nothing
      // in check.sh runs the comparison tools, so the rules test asks node to parse each one, those in tools/sweeps too since round
      // four's code read, each path made with fileURLToPath (a URL's pathname keeps a space as %20, so from a folder with a space in
      // its path every tool was listed as broken).
      const { spawnSync } = await import('node:child_process'); const { fileURLToPath } = await import('node:url');
      const allTools = readdirSync(toolDir, { recursive: true }).map(String).filter((f) => f.endsWith('.mjs'));
      const broken = allTools.filter((f) => spawnSync(process.execPath, ['--check', fileURLToPath(new URL(f, toolDir))], { encoding: 'utf8' }).status !== 0);
      ok(`every tool parses (${allTools.length} tools)`, allTools.length >= 29 && broken.length === 0, broken.join(', '));
      // A file path comes from a URL by fileURLToPath (round four's code read, pass MM): a URL's pathname keeps a space as %20, so the
      // parse check above listed every tool as broken from a folder with a space in its path, as iCloud Drive's has, and nine browser
      // tests opened no page. It is the second time a folder's space broke the checks (pass MC's tools wrote nothing), so every test
      // and tool is read, and a pathname is only compared or cut for its name.
      const testDir = new URL('./', import.meta.url); const PATHNAME = new RegExp('[.]path' + 'name(?![.](?:endsWith|split)[(])');
      const scripts = [...readdirSync(testDir, { recursive: true }).map(String).filter((f) => f.endsWith('.mjs') && !f.startsWith('e2e/out/')).map((f) => new URL(f, testDir)), ...allTools.map((f) => new URL(f, toolDir))];
      // A pathname taken out of a URL by destructuring too (round five's code read: it passed the first version).
      const PATHNAME_OUT = new RegExp('[{,]\\s*path' + 'name\\s*[,}:]');
      const byPath = scripts.filter((u) => { const t = readFileSync(u, 'utf8'); return PATHNAME.test(t) || PATHNAME_OUT.test(t); }).map((u) => fileURLToPath(u).split('/').slice(-2).join('/'));
      ok(`no test or tool makes a file path from a URL's pathname (${scripts.length} files read)`, scripts.length >= 50 && byPath.length === 0, byPath.join(', '));
      // The course packet prints each lesson's example drawing (round four's code read, pass MM): it read a field no example has, so
      // all 662 Example picture lines were blank, and Second and last's new row showed only as a changed item. A silent tool is the
      // second this pass (the comparison above, EARMARKS L16), so one course's packet is read for it.
      const pk = spawnSync(process.execPath, [fileURLToPath(new URL('course-packet.mjs', toolDir)), 'first-sounds-pk'], { encoding: 'utf8' });
      const exLines = String(pk.stdout).split('\n').filter((l) => l.startsWith('Example picture:'));
      // And what a wrong trace hears, which no choice's reason carries (round four's content read).
      const traceLines = String(pk.stdout).split('\n').filter((l) => l.startsWith('  A wrong trace hears: '));
      ok(`the course packet prints each lesson's example drawing and what a wrong trace hears (${exLines.length} drawings and ${traceLines.length} traces in First Sounds and Letters)`, pk.status === 0 && exLines.length >= 8 && exLines.every((l) => /"kind":"\w+"/.test(l)) && exLines.some((l) => /"owl".*"bee".*"frog"/.test(l)) && traceLines.length >= 3 && traceLines.every((l) => /Let's trace it again\. Start at the dot\.$/.test(l)), `${exLines.filter((l) => !/"kind":"\w+"/.test(l)).length} blank of ${exLines.length}; ${traceLines.length} trace lines`); }
    ok('a game once played stays open, even when it no longer leads the list', L.unlockedGameIds([L.makePlayedEvent('maze-small', '2026-10-01T10:00:00Z')], k2).has('maze-small') && !L.unlockedGameIds([], k2).has('maze-small'));
    // Q63 changed what counts as a break, never what opens a game: a game opened and closed before Begin stays on the list as before.
    ok('a game opened and closed before its Begin stays open on the list (Q63 counts breaks, not openings)', L.unlockedGameIds([L.makePlayedEvent('maze-small', '2026-10-01T10:00:00Z', false)], k2).has('maze-small'));
    // Every game's best badge says what it counts (the code check: timed games read "best 42"). Each game's onScore call in
    // ui.jsx decides its unit: ticks are seconds, so the kind must be in BEST_SECONDS; another low count takes a word or no badge.
    { const ui = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8'); const lines = ui.split('\n'); let fn = null; const units = {};
      lines.forEach((l) => { const f = l.match(/^function (\w+)\(/); if (f) fn = f[1]; const m = l.match(/onScore\(([^,]+), '(low|high)'/); if (m && fn) units[fn] = `${m[1].trim()}:${m[2]}`; });
      const gameOf = Object.fromEntries([...ui.match(/const GAME_OF = \{([\s\S]*?)\};/)[1].matchAll(/(\w+): (\w+)/g)].map((m) => [m[1], m[2]]));
      const setOf = (name) => { const m = ui.match(new RegExp(`const ${name} = new Set\\(\\[([^\\]]*)\\]\\)`)); return new Set(m ? [...m[1].matchAll(/'(\w+)'/g)].map((x) => x[1]) : []); };
      const secs = setOf('BEST_SECONDS'); const none = setOf('BEST_NONE'); const wordsAt = ui.indexOf('const BEST_WORDS = {'); const words = new Set([...ui.slice(wordsAt, ui.indexOf('};', wordsAt)).matchAll(/(\w+): \[/g)].map((m) => m[1]));
      const wrong = Object.entries(gameOf).filter(([kind, comp]) => { const u = units[comp]; if (!u) return false; const [what, dir] = u.split(':'); if (/^ticks/.test(what)) return !secs.has(kind); if (dir === 'low') return !words.has(kind) && !none.has(kind); return secs.has(kind); });
      // Build the Fund keeps its best in dollars, and a year that saves nothing ends below zero (the code check's second read
      // found "best -1737" waiting), so it shows no badge, like Pay It Off.
      // Since pass MI a high count may take a word too, where the number alone would not say what it counts (the shooter's hits).
      ok('every game\'s best badge names what it counts: seconds for a timed game, a word or no badge for any other low count, none for dollars, and hits for the shooter', secs.size >= 40 && wrong.length === 0 && ['fund', 'loan', 'price'].every((k) => none.has(k)) && words.has('ship'), wrong.map(([k, c]) => `${k} (${units[c]})`).join(', ')); }
    const lp = L.playList({ courses: [L.getCourse('listen-and-point-pk3')], young: true });
    ok("Mikey's day-one exception holds: a pre-K child with Listen and Point can play Step on the Circles from day one", lp[0] && lp[0].id === 'path-circles' && L.unlockedGameIds([], lp).has('path-circles'));
    const vfs = L.playList({ courses: [L.getCourse('very-first-steps-pk3')], young: true }); const vfsOpen = L.unlockedGameIds([], vfs);
    ok('Very First Steps opens its kite on day one and still unlocks Red and Blue', vfsOpen.has('dots-kite') && !vfsOpen.has('sort-color'));
    // Q46 (pass MM, Mikey: "your recommendation"): a Wonder answer that names a color the lessons teach as a square carries that
    // square beside its word; today that is only "Which color makes you happiest?", and no other answer gets one.
    { const fav = L.WONDER.find((w) => w.id === 'w-favourite-colour');
      const marked = L.WONDER.filter((w) => (w.options || []).some((o) => L.optionSwatch(o)));
      ok('Q46: the four color answers of Which color makes you happiest? each carry their color\'s square, and no other Wonder answer does', !!fav && fav.options.map(L.optionSwatch).join() === 'red,blue,yellow,green' && marked.map((w) => w.id).join() === 'w-favourite-colour' && L.optionSwatch('Purple') === null && L.optionSwatch('Yes') === null && L.optionSwatch('') === null); }
    // Q45 (pass MM, Mikey: "Q45 - yes C"): from pre-K 3 to grade 2 a course's own game opens at its first celebration, when every
    // lesson is passed once; from grade 3 up it still waits for every star. Rounds on two days: the first passes, the second stars.
    { const passRound = (moduleId, at) => ({ type: 'attempt_completed', at, startedAt: at, moduleId, seed: 1, core: [], review: null, coreCorrect: 5, coreTotal: 5 });
      const fsk = L.getCourse('first-steps-pk'); const fsList = L.playList({ courses: [fsk], young: true });
      const once = fsk.modules.map((m) => passRound(m.id, '2026-10-20T10:00:00.000Z'));
      const bus = L.getCourse('business-3'); const busList = L.playList({ courses: [bus], young: false });
      const bOnce = bus.modules.map((m) => passRound(m.id, '2026-10-20T10:00:00.000Z')); const bTwice = [...bOnce, ...bus.modules.map((m) => passRound(m.id, '2026-10-21T10:00:00.000Z'))];
      ok("Q45: First Steps' Look Closely opens when every lesson is passed once, the first celebration, and not one lesson sooner", L.isCourseCompleted(L.deriveProgress(once).passedIds, fsk) && !L.isCourseFinished(L.deriveProgress(once).masteredIds, fsk) && L.unlockedGameIds(once, fsList).has('pairs-first-steps') && !L.unlockedGameIds(once.slice(0, -1), fsList).has('pairs-first-steps'));
      ok("Q45: from grade 3 up a course's game still waits for every star (Fill the Jar stays locked after one pass of every lesson and opens after the second day's)", !L.unlockedGameIds(bOnce, busList).has('savejar-business-3') && L.isCourseFinished(L.deriveProgress(bTwice).masteredIds, bus) && L.unlockedGameIds(bTwice, busList).has('savejar-business-3'));
      ok('Q45: every course from pre-K 3 to grade 2 opens its game at the first pass, and no course from grade 3 up does', L.COURSES.every((c) => L.gameOpensAtFirstPass(c) === ['PK3', 'PK4', 'K', '1', '2'].includes(c.grade)));
      const fsLocked = fsList.filter((g) => !L.unlockedGameIds([], fsList).has(g.id)); const busLocked = busList.filter((g) => !L.unlockedGameIds([], busList).has(g.id));
      ok('the locked-game line says what opens the locked tiles: finishing for an early-years course, mastering from grade 3 up, and both when both are locked', fsLocked.length > 0 && busLocked.length > 0 && L.playLockedNote(fsLocked) === 'Finishing every module within a course unlocks a new game.' && L.playLockedNote(busLocked) === 'Mastering every module within a course unlocks a new game.' && /^Finishing .*\. From grade 3 up, .*mastered\.$/.test(L.playLockedNote([...fsLocked, ...busLocked])) && L.playLockedNote([]) === null && L.playLockedNote(L.GAMES.filter((g) => L.STARTER_GAMES.includes(g.id))) === null); }
    const older = L.playList({ courses: [L.getCourse('business-3')], young: false });
    ok('an older student sees the starter Pong open and their course\'s own game, Fill the Jar, waiting', older.some((g) => g.id === 'pong') && L.unlockedGameIds([], older).has('pong') && older.some((g) => g.id === 'savejar-business-3') && !L.unlockedGameIds([], older).has('savejar-business-3')); }
  const qf = L.GAMES.filter((g) => g.course);
  ok('a course quick fire draws only on its own course, and always has questions', qf.length > 0 && qf.every((g) => { const pool = L.sprintPool(L.MODULES, g); return pool.length > 0 && pool.length === L.sprintPool(L.MODULES.filter((m) => m.courseId === g.course), g).length; }));
}

// Sentence builder and fix it (2026-09-25): every sentence is pinned at both ends, and every mistake is findable.
{
  const endMark = /[.!?]$/;
  const pinned = (s) => { const w = s.split(' '); return /^[A-Z]/.test(w[0]) && w.filter((x) => /^[A-Z]/.test(x) && x !== 'I').length === 1 && w.filter((x) => endMark.test(x)).length === 1 && endMark.test(w[w.length - 1]) && !/  /.test(s); };
  ok('every sentence builder set has a short and a longer sentence, each with one capital first word and one end mark last', Object.values(L.BUILD_DECKS).every((d) => d.length >= 5 && d.every((s) => pinned(s.base) && pinned(s.more) && s.more.split(' ').length > s.base.split(' ').length)));
  ok('every fix it sentence names a wrong word that appears exactly once, and its fix reads as a whole sentence', Object.values(L.FIX_DECKS).every((d) => d.length >= 5 && d.every((it) => { const w = it.text.split(' '); return w.filter((x) => x === it.word).length === 1 && it.fixed && it.fixed !== it.word && endMark.test(it.text) && endMark.test(w.map((x) => (x === it.word ? it.fixed : x)).join(' ')) && it.why && it.why.length > 10; })));
  ok('every sentence builder and fix it game has its deck and a course', L.GAMES.filter((g) => g.kind === 'build' || g.kind === 'fix').length === 6 && L.GAMES.filter((g) => g.kind === 'build').every((g) => L.BUILD_DECKS[g.deck]) && L.GAMES.filter((g) => g.kind === 'fix').every((g) => L.FIX_DECKS[g.deck]) && L.GAMES.filter((g) => g.kind === 'build' || g.kind === 'fix').every((g) => Object.values(L.COURSE_GAMES).some((ids) => ids.includes(g.id))));
}


// Color mixer (2026-09-25): every pair of a deck's pots makes something, and every color to make has exactly one recipe.
{
  const decks = Object.values(L.MIX_DECKS);
  ok('every pair of a color mixer deck\'s pots mixes to a named color with a rule', decks.every((d) => d.pots.every((a) => d.pots.every((b) => { const m = L.mixOf(a, b); return m && m.name && /^#[0-9A-F]{6}$/.test(m.hex) && m.note; }))));
  ok('every color mixer target is made by exactly one pair of its pots and has a swatch', decks.every((d) => d.targets.every((t) => { let n = 0; for (let i = 0; i < d.pots.length; i++) for (let j = i + 1; j < d.pots.length; j++) if (L.mixOf(d.pots[i], d.pots[j]).name === t) n += 1; return n === 1 && L.MIX_COLORS[t]; }) && d.targets.length >= 5));
  ok('the wheel mixes right: two primaries a secondary, white a tint, black a shade, across the wheel brown', L.mixOf('red', 'yellow').name === 'orange' && L.mixOf('yellow', 'blue').name === 'green' && L.mixOf('blue', 'red').name === 'violet' && L.mixOf('red', 'white').name === 'pink' && L.mixOf('blue', 'black').name === 'navy' && L.mixOf('red', 'green').name === 'brown' && L.mixOf('yellow', 'violet').name === 'brown' && L.mixOf('blue', 'orange').name === 'brown' && L.mixOf('orange', 'red').name === 'red-orange');
  ok('the two color mixer games belong to the two art courses', L.COURSE_GAMES['art-3'][0] === 'mix-art-3' && L.COURSE_GAMES['art-4'][0] === 'mix-art-4' && L.GAMES.filter((g) => g.kind === 'mix').every((g) => L.MIX_DECKS[g.deck]));
}


// Debug the robot (2026-09-25): each program fails as written, and exactly one single-step change brings the robot home.
{
  const check = (deck, turns) => deck.every((p) => { const cmds = turns ? ['F', 'L', 'R'] : ['U', 'D', 'L', 'R']; const prog = p.program.split(''); if (L.runRobot(p, prog, turns).home) return false; let fixes = 0; for (let j = 0; j < prog.length; j++) for (const c of cmds) { if (c === prog[j]) continue; const t = prog.slice(); t[j] = c; const r = L.runRobot(p, t, turns); if (r.home && !r.crash) fixes += 1; } return fixes === 1 && prog.every((c) => cmds.includes(c)) && p.rocks.every(([a, b]) => !(a === p.goal[0] && b === p.goal[1]) && !(a === p.start[0] && b === p.start[1])); });
  ok('every arrows robot has a bug that exactly one single change fixes', L.ROBOT_DECKS.arrows.length >= 6 && check(L.ROBOT_DECKS.arrows, false));
  ok('every turns robot has a bug that exactly one single change fixes', L.ROBOT_DECKS.turns.length >= 6 && check(L.ROBOT_DECKS.turns, true));
  ok('the robot stops at the edge and at a rock, and turns in place', L.runRobot({ start: [0, 0], goal: [1, 0], rocks: [] }, ['L'], false).crash === 'edge' && L.runRobot({ start: [0, 0], goal: [2, 0], rocks: [[1, 0]] }, ['R'], false).crash === 'rock' && L.runRobot({ start: [2, 2, 0], goal: [3, 2], rocks: [] }, ['R', 'F'], true).home === true);
  { // Walk the Robot (pass FS): every walk has a path of five steps or fewer through the rocks, found here by a breadth-first search.
    const shortest = (p) => { const rock = new Set(p.rocks.map(([a, b]) => `${a},${b}`)); const seen = new Set([`${p.start[0]},${p.start[1]}`]); let ring = [[p.start[0], p.start[1]]]; for (let d = 0; d <= 8; d++) { if (ring.some(([x, y]) => x === p.goal[0] && y === p.goal[1])) return d; const next = []; for (const [x, y] of ring) for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) { const nx = x + dx; const ny = y + dy; const key = `${nx},${ny}`; if (nx < 0 || ny < 0 || nx > 4 || ny > 4 || rock.has(key) || seen.has(key)) continue; seen.add(key); next.push([nx, ny]); } ring = next; } return Infinity; };
    const walks = L.ROBOT_DECKS.walk;
    ok('every robot walk for the youngest reaches its star in five steps or fewer, with nothing on the start or the star', walks.length >= 8 && walks.every((p) => shortest(p) >= 2 && shortest(p) <= 5 && p.rocks.every(([a, b]) => !(a === p.goal[0] && b === p.goal[1]) && !(a === p.start[0] && b === p.start[1]) && a >= 0 && b >= 0 && a <= 4 && b <= 4)), walks.map(shortest).join(','));
    ok('the walk game belongs to computer science K to 2 and is for the youngest', L.COURSE_GAMES['tech-k'].includes('walk-tech-k') && L.GAMES.find((g) => g.id === 'walk-tech-k').young === true && !L.GAMES.find((g) => g.id === 'walk-tech-k').deck);
  }
  { // Eight Switches (pass FU): six different numbers a round, 0 to 255, the same on every device, and never two plain powers of two in a row.
    const rounds = [1, 2, 3, 7, 12].map((r) => L.bitsTargets(r));
    ok('every switches round has six different numbers within a byte, the same every time', rounds.every((t) => t.length === 6 && new Set(t).size === 6 && t.every((n) => Number.isInteger(n) && n >= 0 && n <= 255)) && JSON.stringify(L.bitsTargets(3)) === JSON.stringify(L.bitsTargets(3)) && JSON.stringify(rounds[0]) !== JSON.stringify(rounds[1]));
    ok('two plain powers of two never come in a row, so the switches have to be added', rounds.every((t) => t.every((n, i) => i === 0 || !((n & (n - 1)) === 0 && (t[i - 1] & (t[i - 1] - 1)) === 0))));
    ok('the switches game belongs to computer science 9 to 12 with eight switches', L.COURSE_GAMES['tech-9'].includes('bits-tech-9') && L.GAMES.find((g) => g.id === 'bits-tech-9').bits === 8 && !L.GAMES.find((g) => g.id === 'bits-tech-9').deck);
  }
  { // Teach the Robot (pass FT): every board starts with two wrong guesses or more and is right after five lessons or fewer, teaching the first wrong fruit each time.
    const boards = L.TEACH_DECKS.fruit;
    const walk = (b) => { let known = b.given.slice(); let n = 0; let first = -1; for (;;) { const g = L.teachGuesses(b, known); const wrong = b.items.map((it, i) => i).filter((i) => !known.includes(i) && g[i] !== b.items[i][2]); if (first < 0) first = wrong.length; if (!wrong.length) return { first, n }; known.push(wrong[0]); n += 1; if (n > 8) return { first, n }; } };
    const apart = (b) => b.items.every((a, i) => b.items.every((c, j) => i === j || (a[0] - c[0]) ** 2 + (a[1] - c[1]) ** 2 >= 100));
    ok('every teach board holds twelve fruits of two kinds, apart from each other, with one given example of each', boards.length >= 4 && boards.every((b) => b.items.length === 12 && apart(b) && b.given.length === 2 && b.items[b.given[0]][2] !== b.items[b.given[1]][2] && b.items.every(([x, y, kind]) => x >= 5 && x <= 95 && y >= 5 && y <= 95 && ['apple', 'banana'].includes(kind))));
    ok('every teach board starts wrong at least twice and is right after five lessons or fewer', boards.every((b) => { const r = walk(b); return r.first >= 2 && r.n >= 1 && r.n <= 5; }), boards.map((b) => JSON.stringify(walk(b))).join(' '));
    ok('the teach game belongs to the plain AI course and names its boards with its own key', L.COURSE_GAMES['tech-6'].includes('teach-tech-6') && L.GAMES.find((g) => g.id === 'teach-tech-6').teach === 'fruit' && !L.GAMES.find((g) => g.id === 'teach-tech-6').deck);
  }
  { // Pay the Price (pass FV): every price is payable exactly with two fives and five ones, and a round's four prices differ from the next round's.
    const payable = (n) => [0, 1, 2].some((f) => n - 5 * f >= 0 && n - 5 * f <= 5);
    ok('every price on the pay table can be counted out with two fives and five ones', [1, 2, 3, 4, 5, 6, 7, 8].every((r) => L.payPrices(r).length === 4 && L.payPrices(r).every((it) => it.price >= 3 && it.price <= 15 && payable(it.price) && typeof it.item === 'string')));
    ok('the pay game belongs to economics K to 2 and is for the youngest', L.COURSE_GAMES['econ-k'].includes('pay-econ-k') && L.GAMES.find((g) => g.id === 'pay-econ-k').young === true && !L.GAMES.find((g) => g.id === 'pay-econ-k').deck);
  }
  { // Set the Price (pass FW): four stands a round, twelve customers each with a top price from 1 to 8, and some price that makes a profit on every stand.
    ok('every stand has a price that earns a profit and a top price for each of twelve customers', [1, 2, 3, 4, 5, 6].every((r) => L.priceStands(r).length === 4 && L.priceStands(r).every((st) => st.tops.length === 12 && st.tops.every((t) => t >= 1 && t <= 8) && [1, 2, 3, 4, 5, 6, 7, 8].some((pr) => L.standProfit(st, pr).profit > 0))));
    ok('profit is price times buyers minus the fixed cost and the cost per cup', L.standProfit({ tops: [1, 4, 4, 8], fixed: 3, each: 1 }, 4).profit === 4 * 3 - 3 - 3 && L.standProfit({ tops: [1, 4, 4, 8], fixed: 3, each: 1 }, 9).buyers === 0);
    ok('the price game belongs to economics 3 to 5 and names its stands with its own key', L.COURSE_GAMES['econ-3'].includes('price-econ-3') && L.GAMES.find((g) => g.id === 'price-econ-3').price === 'stand' && !L.GAMES.find((g) => g.id === 'price-econ-3').deck);
  }
  { // Pay It Off (pass FX): four loans a round; the smallest payment beats the first month's interest, the largest clears the loan within twelve months.
    const clears = (plan, payment, months) => { let bal = plan.principal; for (let m = 0; m < months; m++) { const r = L.loanMonth(bal, plan.rate, payment); bal = r.balance; if (r.paid) return true; } return false; };
    ok('every loan plan can be paid off: the biggest payment clears it in twelve months and the smallest still shrinks it', [1, 2, 3, 4, 5].every((r) => L.loanPlans(r).length === 4 && L.loanPlans(r).every((pl) => pl.payments.length === 3 && pl.payments[0] < pl.payments[1] && pl.payments[1] < pl.payments[2] && pl.payments[0] > L.loanMonth(pl.principal, pl.rate, 0).interest && clears(pl, pl.payments[2], 12))));
    ok('a month adds interest on the balance and takes the payment off', JSON.stringify(L.loanMonth(1000, 2, 250)) === JSON.stringify({ interest: 20, balance: 770, paid: false }) && L.loanMonth(200, 2, 250).paid === true);
    ok('the loan game belongs to economics 6 to 8 and names its plans with its own key', L.COURSE_GAMES['econ-6'].includes('loan-econ-6') && L.GAMES.find((g) => g.id === 'loan-econ-6').loan === 'plans' && !L.GAMES.find((g) => g.id === 'loan-econ-6').deck);
  }
  { // Build the Fund (pass FY): a year's surprises never exceed what steady saving can cover, so saving the room every month ends in the black.
    ok('every fund year has four surprises that steady saving covers, and saving nothing ends in debt', [1, 2, 3, 4, 5].every((r) => { const y = L.fundYear(r); const hits = y.months.filter((m) => m.surprise > 0); let st = { fund: 0, loan: 0, spent: 0 }; let none = { fund: 0, loan: 0, spent: 0 }; y.months.forEach((m) => { st = L.fundMonth({ ...st, room: y.room }, y.room, m); none = L.fundMonth({ ...none, room: y.room }, 0, m); }); return hits.length === 4 && y.total <= y.room * 12 && st.loan === 0 && st.fund === y.room * 12 - y.total && none.loan > y.total; }));
    ok('the fund game belongs to personal finance 9 to 12 and names its year with its own key', L.COURSE_GAMES['econ-9'].includes('fund-econ-9') && L.GAMES.find((g) => g.id === 'fund-econ-9').fund === 'year' && !L.GAMES.find((g) => g.id === 'fund-econ-9').deck);
  }
  { // Split the Search (pass FZ): every board is 32 sorted, distinct values with the target on it, and binary search finds any target in six looks.
    const looks = (b) => { let lo = 0; let hi = b.values.length - 1; let n = 0; const t = b.values[b.target]; while (lo <= hi) { const mid = Math.floor((lo + hi) / 2); n += 1; if (b.values[mid] === t) return n; if (b.values[mid] < t) lo = mid + 1; else hi = mid - 1; } return Infinity; };
    ok('every search board is sorted and distinct with its target on it, and binary search finds it in six looks or fewer', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].every((seed) => { const b = L.searchBoard(seed); return b.values.length === 32 && new Set(b.values).size === 32 && b.values.every((v, i) => i === 0 || v > b.values[i - 1]) && b.target >= 0 && b.target < 32 && looks(b) <= 6; }));
    ok('the search game belongs to college computer science and names its board with its own key', L.COURSE_GAMES['tech-college'].includes('search-tech-college') && L.GAMES.find((g) => g.id === 'search-tech-college').search === 32 && !L.GAMES.find((g) => g.id === 'search-tech-college').deck);
  }
  { // Spot It (pass GE): every ask fits exactly one piece of its picture, pieces stay apart, and every kind and color is one the lesson names.
    const kinds = ['circle', 'square', 'triangle', 'zigzag', 'curve', 'straight']; const colors = ['red', 'yellow', 'blue', 'orange', 'green', 'purple'];
    ok('every Spot It picture has five pieces of known kinds and colors, kept apart, and asks that each fit exactly one piece', L.SPOT_SCENES.length >= 4 && L.SPOT_SCENES.every((sc) => sc.parts.length === 5 && sc.parts.every((p) => kinds.includes(p[0]) && colors.includes(p[1])) && sc.parts.every((a, i) => sc.parts.every((b, j) => i === j || (a[2] - b[2]) ** 2 + (a[3] - b[3]) ** 2 >= 18 * 18)) && sc.asks.length === 3 && sc.asks.every((ask) => sc.parts.filter((p) => L.spotMatches(p, ask)).length === 1)));
    ok('the spot game belongs to art and music K to 2 and is for the youngest', L.COURSE_GAMES['arts-k'].includes('spot-arts-k') && L.GAMES.find((g) => g.id === 'spot-arts-k').young === true && !L.GAMES.find((g) => g.id === 'spot-arts-k').deck);
  }
  { // What Comes Next (pass GF): every round shows a form twice, cut inside its second showing, and the answer is the piece the form puts next.
    ok('every pattern round follows its form and its answer is among the three choices', [1, 2, 3, 4, 5, 6].every((r) => L.patternRounds(r).length === 5 && L.patternRounds(r).every((q) => { const seq = q.form.toUpperCase().split(''); const map = {}; seq.forEach((l, i) => { if (!map[l]) map[l] = q.shown[i]; }); const full = seq.concat(seq).map((l) => map[l]); return q.shown.length > seq.length && q.shown.every((p, i) => p === full[i]) && q.answer === full[q.shown.length] && q.choices.length === 3 && q.choices.includes(q.answer) && new Set(q.choices).size === 3; })));
    ok('the pattern game belongs to art and music 3 to 5 and names its forms with its own key', L.COURSE_GAMES['arts-3'].includes('pattern-arts-3') && L.GAMES.find((g) => g.id === 'pattern-arts-3').pattern === 'forms' && !L.GAMES.find((g) => g.id === 'pattern-arts-3').deck);
  }
  { // Shape the Sound (pass GG): every plan can be matched, a flat line never matches a plan with a crescendo or a decrescendo, and the rule reads each marking.
    const build = (plan) => { const out = []; plan.forEach((m, i) => { const prev = i ? out[i - 1] : 3; out.push(m === 'piano' ? 1 : m === 'forte' ? 6 : m === 'crescendo' ? Math.min(6, Math.max(prev + 1, 2)) : Math.max(1, Math.min(prev - 1, 5))); }); return out; };
    ok('every dynamics plan is six markings that its own built line matches, and a flat line fails it', L.DYNAMICS_PLANS.every((plan) => plan.length === 6 && plan.every((m) => ['piano', 'forte', 'crescendo', 'decrescendo'].includes(m)) && L.dynamicsMatch(build(plan), plan) && !L.dynamicsMatch([3, 3, 3, 3, 3, 3], plan)) && [0, 1, 2, 3, 4].every((r) => [0, 1, 2, 3].every((k) => L.DYNAMICS_PLANS.includes(L.dynamicsPlan(r, k)))));
    ok('the shape game belongs to art and music 6 to 8 and names its plans with its own key', L.COURSE_GAMES['arts-6'].includes('shape-arts-6') && L.GAMES.find((g) => g.id === 'shape-arts-6').shape === 'dynamics' && !L.GAMES.find((g) => g.id === 'shape-arts-6').deck);
  }
  { // Build the Chord (pass GH): every chord stacks four then three half steps (major) or three then four (minor), every round names five distinct chords from the list, and the game belongs to arts-9.
    const step = (a, b) => (L.CHORD_NOTES.indexOf(b) - L.CHORD_NOTES.indexOf(a) + 12) % 12;
    ok('every chord in the list obeys the triad arithmetic', L.CHORD_LIST.every(([r, q]) => { const n = L.chordNotes(r, q); return n[0] === r && step(n[0], n[1]) === (q === 'major' ? 4 : 3) && step(n[1], n[2]) === (q === 'major' ? 3 : 4) && step(n[0], n[2]) === 7; }));
    ok('every chord round names five distinct chords with their notes', [1, 2, 3, 4, 5].every((r) => { const rs = L.chordRounds(r); return rs.length === 5 && new Set(rs.map((c) => c.root + c.quality)).size === 5 && rs.every((c) => c.notes.length === 3 && c.notes.join() === L.chordNotes(c.root, c.quality).join()); }));
    ok('the chord game belongs to art and music 9 to 12 and names its triads with its own key', L.COURSE_GAMES['arts-9'].includes('chord-arts-9') && L.GAMES.find((g) => g.id === 'chord-arts-9').chord === 'triads' && !L.GAMES.find((g) => g.id === 'chord-arts-9').deck);
  }
  { // Valid or Not (pass GI): the form decides validity, every round mixes forms, and every argument's three lines are built from its pair.
    ok('every argument round follows its form, and the two valid forms are exactly modus ponens and modus tollens', [1, 2, 3, 4, 5].every((r) => { const qs = L.argumentRounds(r); return qs.length === 6 && qs.every((q) => q.lines.length === 3 && q.lines[0].startsWith('If ') && q.lines[2].startsWith('So ') && q.valid === (q.form === 'modus ponens' || q.form === 'modus tollens')); }) && L.ARGUMENT_FORMS.filter((f) => f.valid).map((f) => f.name).sort().join(',') === 'modus ponens,modus tollens');
    ok('the valid game belongs to philosophy 9 to 12 and names its forms with its own key', L.COURSE_GAMES['philosophy-9'].includes('valid-philosophy-9') && L.GAMES.find((g) => g.id === 'valid-philosophy-9').valid === 'forms' && !L.GAMES.find((g) => g.id === 'valid-philosophy-9').deck);
  }
  { // Reason or Not (pass GJ): a reason supports a claim exactly when it is one of that claim's own, and every round mixes both kinds.
    ok('every reason round marks a reason as support exactly when it belongs to the claim, and mixes both kinds', [1, 2, 3, 4, 5, 6].every((r) => { const qs = L.reasonRounds(r); return qs.length === 6 && qs.every((q) => { const own = L.CLAIM_REASONS.find((c) => c[0] === q.claim)[1]; return q.supports === own.includes(q.reason); }); }) && [1, 2, 3, 4, 5, 6].some((r) => L.reasonRounds(r).some((q) => q.supports)) && [1, 2, 3, 4, 5, 6].some((r) => L.reasonRounds(r).some((q) => !q.supports)));
    ok('the reason game belongs to philosophy 6 to 8 and names its claims with its own key', L.COURSE_GAMES['philosophy-6'].includes('reason-philosophy-6') && L.GAMES.find((g) => g.id === 'reason-philosophy-6').reason === 'claims' && !L.GAMES.find((g) => g.id === 'reason-philosophy-6').deck);
  }
  { // Sort the Because (pass GK): every round offers exactly two real reasons, the claim's own, among four, and the fakes come from the shared pile.
    ok('every because round has four options with exactly two real ones, the claim\'s own, and two fakes from the pile', [1, 2, 3, 4, 5, 6].every((r) => { const qs = L.becauseRounds(r); return qs.length === 5 && qs.every((q) => { const own = L.BECAUSE_CLAIMS.find((c) => c[0] === q.claim)[1]; return q.options.length === 4 && q.options.filter((o) => o.real).length === 2 && q.options.every((o) => (o.real ? own.includes(o.text) : L.BECAUSE_FAKES.includes(o.text))) && new Set(q.options.map((o) => o.text)).size === 4; }); }));
    // Pass IY: the look of a card never gives its answer away, and Valid or Not never stacks two negatives in a line.
    { // Pass JA: ( ) are parentheses and [ ] are brackets, as American math, TEKS 5.4 and Common Core 5.OA.A.1 name them.
      // Any other bracket in a lesson, question, deck or story must be the square kind, named as such.
      const files = ['../src/logic.mjs', '../src/stories.mjs'].map((f) => readFileSync(new URL(f, import.meta.url), 'utf8'));
      const bad = files.flatMap((s) => [...s.matchAll(/(?<!g5-)\bbrackets?\b/gi)].map((m) => s.slice(Math.max(0, m.index - 70), m.index + 70)).filter((w) => !/square brackets|parentheses and brackets/i.test(w)));
      ok('every lesson, question, deck and story calls ( ) parentheses, and brackets only ever means [ ]', bad.length === 0, bad.slice(0, 3).join(' | '));
      ok('grade 5 practice asks a question with two levels of grouping, brackets outside', [1, 2, 3, 4, 5, 6].every((s) => { const q = L.generateQuestion('g5-two-levels', s); const m = /^(\d+) x \[(\d+) - \((\d+) \+ (\d+)\)\] = \?$/.exec(q.prompt); return m && Number(q.answer) === m[1] * (m[2] - m[3] - m[4]) && Number(q.answer) > 0 && new Set(q.choices).size === q.choices.length; }));
    }
    ok('every Sort the Because choice starts with Because, real or fake, so the form never gives the answer away', [...L.BECAUSE_CLAIMS.flatMap((c) => c[1]), ...L.BECAUSE_FAKES].every((s) => /^Because \S/.test(s)));
    ok('no Valid or Not line stacks two negatives, and none says it is not the case that', [1, 2, 3, 4, 5, 6, 7, 8].every((r) => L.argumentRounds(r).every((q) => q.lines.every((l) => (l.match(/\bnot\b/g) || []).length < 2 && !/not the case/.test(l)))));
    ok('the because game belongs to philosophy 3 to 5 and names its claims with its own key', L.COURSE_GAMES['philosophy-3'].includes('because-philosophy-3') && L.GAMES.find((g) => g.id === 'because-philosophy-3').because === 'claims' && !L.GAMES.find((g) => g.id === 'because-philosophy-3').deck);
  }
  { // Share the Cookies (pass GL): every round divides evenly, says its numbers, and the rounds use both two and three plates.
    ok('every share round divides its cookies evenly among its plates and says so', [1, 2, 3, 4, 5].every((r) => { const qs = L.shareRounds(r); return qs.length === 4 && qs.every((q) => q.cookies === q.plates * q.each && q.each >= 1 && q.say.startsWith(`${q.cookies} cookies`) && q.say.includes(`${q.plates} plates`)); }) && new Set(L.shareRounds(1).map((q) => q.plates)).size === 2);
    ok('the share game belongs to philosophy K to 2 and is for the youngest', L.COURSE_GAMES['philosophy-k'].includes('share-philosophy-k') && L.GAMES.find((g) => g.id === 'share-philosophy-k').young === true && !L.GAMES.find((g) => g.id === 'share-philosophy-k').deck);
  }
  { // Mean, Median, Mode (pass GM): every round's answer is the true statistic of its scores, whole, and sits among four distinct choices.
    const stat = (sc, ask) => { const so = [...sc].sort((a, b) => a - b); return ask === 'mean' ? sc.reduce((a, b) => a + b, 0) / sc.length : ask === 'median' ? so[2] : so.find((v, i) => so.indexOf(v) !== i); };
    ok('every stat round asks for a real average of its scores and offers four distinct choices with the answer among them', [1, 2, 3, 4, 5].every((r) => { const qs = L.statRounds(r); return qs.length === 6 && qs.every((q) => q.scores.length === 5 && Number.isInteger(q.answer) && stat(q.scores, q.ask) === q.answer && q.choices.length === 4 && new Set(q.choices).size === 4 && q.choices.includes(q.answer)); }) && new Set(L.statRounds(1).map((q) => q.ask)).size === 3);
    // Since pass MP (round one's accuracy check: the repeated score was always the middle one, so the median was always the mode in
    // all 18,000 rounds) the mean, the median and the mode of every round are three different numbers, so each rule gives its own.
    ok('every stat round\'s mean, median and mode are three different numbers', Array.from({ length: 400 }, (_, r) => r).every((r) => L.statRounds(r).every((q) => new Set(['mean', 'median', 'mode'].map((a) => stat(q.scores, a))).size === 3)));
    ok('the stat game belongs to psychology 9 to 12 and names its scores with its own key', L.COURSE_GAMES['psychology-9'].includes('stat-psychology-9') && L.GAMES.find((g) => g.id === 'stat-psychology-9').stat === 'scores' && !L.GAMES.find((g) => g.id === 'stat-psychology-9').deck);
  }
  { // Hold It in Mind (pass GN): five distinct words shown, four distinct choices, and exactly one of them from the list.
    ok('every recall round shows five distinct words and offers four distinct choices with exactly one from the list', [1, 2, 3, 4, 5].every((r) => { const qs = L.recallRounds(r); return qs.length === 5 && qs.every((q) => q.shown.length === 5 && new Set(q.shown).size === 5 && q.choices.length === 4 && new Set(q.choices).size === 4 && q.choices.filter((w) => q.shown.includes(w)).length === 1 && q.shown.includes(q.answer) && q.choices.includes(q.answer) && q.shown.every((w) => L.RECALL_WORDS.includes(w))); }));
    ok('the recall game belongs to psychology 6 to 8 and names its words with its own key', L.COURSE_GAMES['psychology-6'].includes('recall-psychology-6') && L.GAMES.find((g) => g.id === 'recall-psychology-6').recall === 'words' && !L.GAMES.find((g) => g.id === 'recall-psychology-6').deck);
  }
  { // Name the Feeling (pass GO): every round shows each of the six feelings once, with four distinct choices that hold the answer.
    ok('every feeling round names each feeling once with four distinct choices holding the answer', [1, 2, 3, 4, 5].every((r) => { const qs = L.feelingRounds(r); return qs.length === 6 && new Set(qs.map((q) => q.answer)).size === 6 && qs.every((q) => L.FEELINGS.includes(q.answer) && q.choices.length === 4 && new Set(q.choices).size === 4 && q.choices.includes(q.answer) && q.choices.every((c) => L.FEELINGS.includes(c))); }));
    ok('the face game belongs to psychology 3 to 5 and names its feelings with its own key', L.COURSE_GAMES['psychology-3'].includes('face-psychology-3') && L.GAMES.find((g) => g.id === 'face-psychology-3').face === 'feelings' && !L.GAMES.find((g) => g.id === 'face-psychology-3').deck);
  }
  { // Which Sense (pass GP): every round asks each sense once, and every thing belongs to exactly one sense.
    ok('every sense round asks each of the five senses once with a thing that belongs to it', [1, 2, 3, 4, 5].every((r) => { const qs = L.senseRounds(r); return qs.length === 5 && new Set(qs.map((q) => q.sense)).size === 5 && qs.every((q) => L.SENSE_THINGS.filter((t) => t[0] === q.thing).length === 1 && L.SENSE_THINGS.find((t) => t[0] === q.thing)[1] === q.sense); }));
    ok('the sense game belongs to psychology K to 2 and is for the youngest', L.COURSE_GAMES['psychology-k'].includes('sense-psychology-k') && L.GAMES.find((g) => g.id === 'sense-psychology-k').young === true && !L.GAMES.find((g) => g.id === 'sense-psychology-k').deck);
  }
  { // Cut the Fillers (pass GQ): every line carries two or three fillers from the list, its count matches, and the clean words come back in order.
    ok('every filler round carries counted fillers from the list and a clean line underneath', [1, 2, 3, 4, 5].every((r) => { const qs = L.fillerRounds(r); return qs.length === 5 && qs.every((q) => { const f = q.tokens.filter((t) => t.filler); return f.length === q.fillers && f.length >= 2 && f.length <= 3 && f.every((t) => L.FILLERS.includes(t.text)) && L.CLEAN_LINES.includes(q.tokens.filter((t) => !t.filler).map((t) => t.text).join(' ')); }); }));
    ok('the filler game belongs to speech 9 to 12 and names its lines with its own key', L.COURSE_GAMES['speech-9'].includes('filler-speech-9') && L.GAMES.find((g) => g.id === 'filler-speech-9').filler === 'lines' && !L.GAMES.find((g) => g.id === 'filler-speech-9').deck);
  }
  { // Fit the Room (pass GR): six lines a round, no room more than twice, every answer among the four rooms and every line from the list.
    ok('every room round offers six listed lines with their rooms among the four choices', [1, 2, 3, 4, 5].every((r) => { const qs = L.roomRounds(r); return qs.length === 6 && new Set(qs.map((q) => q.line)).size === 6 && L.ROOMS.every((room) => qs.filter((q) => q.answer === room).length <= 2) && qs.every((q) => q.choices.length === 4 && q.choices.includes(q.answer) && L.ROOM_LINES.some(([line, room]) => line === q.line && room === q.answer)); }));
    ok('the room game belongs to speech 6 to 8 and names its lines with its own key', L.COURSE_GAMES['speech-6'].includes('room-speech-6') && L.GAMES.find((g) => g.id === 'room-speech-6').room === 'lines' && !L.GAMES.find((g) => g.id === 'room-speech-6').deck);
  }
  { // Ask the Right Question (pass GS): six rounds from the list, each with four distinct questions holding the relevant one.
    ok('every ask round offers six listed things said with four questions holding the relevant one', [1, 2, 3, 4, 5].every((r) => { const qs = L.askRounds(r); return qs.length === 6 && new Set(qs.map((q) => q.said)).size === 6 && qs.every((q) => q.choices.length === 4 && new Set(q.choices).size === 4 && q.choices.includes(q.answer) && L.ASK_ROUNDS.some((a) => a.said === q.said && a.good === q.answer && a.off.every((o) => q.choices.includes(o)))); }));
    ok('the ask game belongs to speech 3 to 5 and names its topics with its own key', L.COURSE_GAMES['speech-3'].includes('ask-speech-3') && L.GAMES.find((g) => g.id === 'ask-speech-3').ask === 'topics' && !L.GAMES.find((g) => g.id === 'ask-speech-3').deck);
  }
  { // Whose Turn Next (pass GT): six holders a round, never the same holder twice in a row, and the answer is always the next friend around the circle.
    ok('every turn round names the next friend around the circle for six holders', [1, 2, 3, 4, 5].every((r) => { const qs = L.turnRounds(r); return qs.length === 6 && qs.every((q, i) => q.holder >= 0 && q.holder < 4 && q.answer === L.TURN_FRIENDS[(q.holder + 1) % 4] && (i === 0 || q.holder !== qs[i - 1].holder)); }));
    ok('the turn game belongs to speech K to 2, is marked young and names its friends with its own key', L.COURSE_GAMES['speech-k'].includes('turn-speech-k') && L.GAMES.find((g) => g.id === 'turn-speech-k').young === true && L.GAMES.find((g) => g.id === 'turn-speech-k').turn === 'friends' && !L.GAMES.find((g) => g.id === 'turn-speech-k').deck);
  }
  { // Read the Jar (pass GU): six samples a round, each adding to 100 percent, every answer following the one texture rule, and all three textures present.
    ok('every jar round has six samples adding to 100 with answers that follow the texture rule and all three textures present', [1, 2, 3, 4, 5].every((r) => { const qs = L.jarRounds(r); return qs.length === 6 && qs.every((q) => q.sand + q.silt + q.clay === 100 && q.sand >= 0 && q.silt >= 0 && q.clay >= 0 && q.answer === L.jarTexture(q.sand, q.silt, q.clay) && q.choices.length === 3 && q.choices.includes(q.answer)) && L.JAR_TEXTURES.every((t) => qs.some((q) => q.answer === t)); }));
    ok('the jar game belongs to agriculture 9 to 12 and names its textures with its own key', L.COURSE_GAMES['agriculture-9'].includes('jar-agriculture-9') && L.GAMES.find((g) => g.id === 'jar-agriculture-9').jar === 'textures' && !L.GAMES.find((g) => g.id === 'jar-agriculture-9').deck);
    ok('the soil-sample and farm-profit questions compute their answers', [...Array(40).keys()].every((i) => { const a = L.generateQuestion('ag-soil', i); const b = L.generateQuestion('ag-farm', i); const okA = !a.story || (() => { const n = a.story.match(/\d+/g).map(Number); return a.answer === `${100 - n[0] - n[1] - n[2]} percent`; })(); const okB = !b.story || (() => { const n = b.story.match(/\d+/g).map(Number); return b.answer === `$${n[2] - n[0] - n[1]}`; })(); return okA && okB; }));
  }
  { // Who Gains (pass GX): six listed cases a round, no relationship more than twice, the four names as choices, every answer from the list.
    ok('every relation round offers six listed cases with their answers among the four names', [1, 2, 3, 4, 5].every((r) => { const qs = L.relationRounds(r); return qs.length === 6 && new Set(qs.map((q) => q.line)).size === 6 && L.FARM_RELATIONS.every((n) => qs.filter((q) => q.answer === n).length <= 2) && qs.every((q) => q.choices.length === 4 && q.choices.includes(q.answer) && L.RELATION_CASES.some(([line, answer]) => line === q.line && answer === q.answer)); }));
    ok('the relation game belongs to agriculture 6 to 8 and names its cases with its own key', L.COURSE_GAMES['agriculture-6'].includes('relation-agriculture-6') && L.GAMES.find((g) => g.id === 'relation-agriculture-6').relation === 'cases' && !L.GAMES.find((g) => g.id === 'relation-agriculture-6').deck);
    ok('the hen-project profit questions compute their answers', [...Array(40).keys()].every((i) => { const q = L.generateQuestion('a6-project', i); if (!q.story) return true; const n = q.story.match(/\d+/g).map(Number); return q.answer === `$${n[2] - n[0] - n[1]}`; }));
  }
  { // Will It Sprout? (pass HB): six seeds a round; a seed sprouts exactly when it has water, air and warmth, light never decides it;
    // every round has both answers and at least one seed that sprouts in the dark.
    ok('every sprout round follows the water, air and warmth rule, with a seed that sprouts in the dark', [1, 2, 3, 4, 5].every((r) => { const qs = L.sproutRounds(r); return qs.length === 6 && qs.every((q) => q.answer === (q.water && q.air && q.warm ? 'yes' : 'no')) && qs.some((q) => q.answer === 'yes' && !q.light) && qs.some((q) => q.answer === 'no'); }));
    ok('the sprout game belongs to agriculture 3 to 5 and names its seeds with its own key', L.COURSE_GAMES['agriculture-3'].includes('sprout-agriculture-3') && L.GAMES.find((g) => g.id === 'sprout-agriculture-3').sprout === 'seeds' && !L.GAMES.find((g) => g.id === 'sprout-agriculture-3').deck);
    ok('the squash-tally questions compute their answers', [...Array(40).keys()].every((i) => { const q = L.generateQuestion('ag3-tiny', i); if (!q.story) return true; const n = q.story.match(/\d+/g).map(Number); return q.answer === String(n[0] + n[1] + n[2]); }));
  }
  { // Grow the Plant (pass HC): four rounds, each a listed plant with five distinct pictures, the three needs and two toys from the list.
    ok('every grow round shows all three plant problems, each plant needing one of them (pass IV)', [1, 2, 3, 4, 5, 6].every((r) => { const qs = L.growRounds(r); return qs.every((q) => L.GROW_NEEDS.includes(q.need) && q.items.includes(q.need)) && L.GROW_NEEDS.every((n) => qs.some((q) => q.need === n)); }) && L.GROW_NEEDS.every((n) => L.GROW_PROBLEMS[n] && L.GROW_PROBLEMS[n].say.endsWith('.')));
    ok('every grow round holds the three needs and two different toys for a listed plant', [1, 2, 3, 4, 5].every((r) => { const qs = L.growRounds(r); return qs.length === 4 && qs.every((q) => L.GROW_PLANTS.includes(q.plant) && q.items.length === 5 && new Set(q.items).size === 5 && L.GROW_NEEDS.every((n) => q.items.includes(n)) && q.items.filter((i) => L.GROW_TOYS.includes(i)).length === 2); }));
    ok('the grow game belongs to agriculture K to 2, is marked young and names its needs with its own key', L.COURSE_GAMES['agriculture-k'].includes('grow-agriculture-k') && L.GAMES.find((g) => g.id === 'grow-agriculture-k').young === true && L.GAMES.find((g) => g.id === 'grow-agriculture-k').grow === 'needs' && !L.GAMES.find((g) => g.id === 'grow-agriculture-k').deck);
  }
  { // The Better Deal (pass HF): six items a round, never a tie, and the answer is always the offer that saves more.
    ok('every better-deal round names the offer that saves more, with no ties', [1, 2, 3, 4, 5].every((r) => { const qs = L.dealRounds(r); return qs.length === 6 && new Set(qs.map((q) => q.what)).size === 6 && qs.every((q) => q.off < q.price && Number.isInteger(L.dealSaving(q.price, q.pct)) && L.dealSaving(q.price, q.pct) !== q.off && q.answer === (L.dealSaving(q.price, q.pct) > q.off ? q.pctLabel : q.offLabel)); }));
    ok('the better-deal game belongs to business 6 to 8 with its own key', L.COURSE_GAMES['business-6'].includes('deal-business-6') && L.GAMES.find((g) => g.id === 'deal-business-6').deal === 'offers' && !L.GAMES.find((g) => g.id === 'deal-business-6').deck);
    ok('the middle school money banks compute their sales tax, register, net worth and deal answers', [...Array(80).keys()].every((i) => { const e = L.generateQuestion('bz6-earn', i); const b = L.generateQuestion('bz6-bank', i); const s = L.generateQuestion('bz6-start', i); const okE = !e.story || !e.story.includes('sales tax') || e.answer === `$${((Number(e.story.match(/\$(\d+)/)[1]) * 10825) / 10000).toFixed(2)}`; const nb = b.story ? b.story.match(/\d+/g).map(Number) : null; const okB = !nb || b.answer === `$${nb[0] + nb[1] - nb[2] - nb[3]}`; const ns = s.story && s.story.startsWith('A $') ? s.story.match(/\d+/g).map(Number) : null; const okS = !ns || s.answer === (ns[0] * ns[1] / 100 > ns[2] ? `${ns[1]} percent off` : `$${ns[2]} off`); return okE && okB && okS && new Set(e.choices).size === e.choices.length && new Set(b.choices).size === b.choices.length; }));
  }
  { // Break Even (pass HD): six businesses a round, every answer a whole number equal to fixed costs over what each sale leaves, four distinct positive choices.
    ok('every break-even round has whole-number answers from the one rule and four distinct choices', [1, 2, 3, 4, 5].every((r) => { const qs = L.breakevenRounds(r); return qs.length === 6 && new Set(qs.map((q) => q.what)).size === 6 && qs.every((q) => Number.isInteger(q.answer) && q.answer === L.breakevenUnits(q.fixed, q.price, q.cost) && q.price > q.cost && q.choices.length === 4 && new Set(q.choices).size === 4 && q.choices.includes(q.answer) && q.choices.every((c) => Number.isInteger(c) && c > 0)); }));
    ok('the break-even game belongs to business 9 to 12 and names its businesses with its own key', L.COURSE_GAMES['business-9'].includes('breakeven-business-9') && L.GAMES.find((g) => g.id === 'breakeven-business-9').breakeven === 'businesses' && !L.GAMES.find((g) => g.id === 'breakeven-business-9').deck);
    ok('the money bank computes its break-even and net-pay answers', [...Array(60).keys()].every((i) => { const q = L.generateQuestion('bz-money', i); if (!q.story) return true; const n = q.story.match(/\d+/g).map(Number); if (q.prompt.startsWith('How many tacos')) return q.answer === String(n[0] / (n[1] - n[2])) && q.choices.length === 4 && new Set(q.choices).size === 4; return q.answer === `$${n[0] * n[1] - n[2]}` && new Set(q.choices).size === 4; }));
  }
  { // Fill the Jar (pass HG): six goals a round, every answer the goal divided by the weekly amount, four distinct positive choices.
    ok('every fill-the-jar round divides evenly and has four distinct choices', [1, 2, 3, 4, 5].every((r) => { const qs = L.savejarRounds(r); return qs.length === 6 && new Set(qs.map((q) => q.what)).size === 6 && qs.every((q) => Number.isInteger(q.answer) && q.answer === L.savejarWeeks(q.goal, q.weekly) && q.choices.length === 4 && new Set(q.choices).size === 4 && q.choices.includes(q.answer) && q.choices.every((c) => c > 0)); }));
    ok('the jar game belongs to business 3 to 5 and names its goals with its own key', L.COURSE_GAMES['business-3'].includes('savejar-business-3') && L.GAMES.find((g) => g.id === 'savejar-business-3').savejar === 'goals' && !L.GAMES.find((g) => g.id === 'savejar-business-3').deck);
    ok('the jar and stand banks compute their weeks and profits', [...Array(80).keys()].every((i) => { const a = L.generateQuestion('bz3-jars', i); const b = L.generateQuestion('bz3-stand', i); const okA = !a.story || (() => { const n = a.story.match(/\d+/g).map(Number); return a.answer === `${n[0] / n[1]} weeks` && new Set(a.choices).size === 4; })(); const okB = !b.story || (() => { const n = b.story.match(/\d+/g).map(Number); return b.answer === `$${n[0] - n[0] * n[2] / 100 - n[3]}` && new Set(b.choices).size === 4; })(); return okA && okB; }));
  }
  { // Flow diagrams (pass HG, Mikey's screenshots): every flow diagram in every lesson keeps each label inside its box.
    const flows = []; for (const c of L.COURSES) for (const m of c.modules) { const ex = m.lesson.example; if (!ex) continue; if (ex.kind === 'flow') flows.push(ex.steps); const others = Array.isArray(ex.another) ? ex.another : (ex.another ? [ex.another] : []); for (const a of others) if (a && a.visual && a.visual.kind === 'flow') flows.push(a.visual.steps); }
    const bad = flows.filter((steps) => { const lay = L.flowLayout(steps); if (lay.dir === 'row') return steps.some((t) => String(t).length > 12); return lay.boxes.some((bx) => bx.lines.length > 2 || bx.lines.some((ln) => ln.length * bx.size * L.FLOW_CHAR_EM > bx.w - 8 + 1e-9) || bx.lines.length * bx.size * 1.2 > bx.h - 2 + 1e-9); });
    ok('every flow diagram in every lesson keeps each label inside its box', flows.length > 100 && bad.length === 0);
    ok('a flow of short labels keeps its row, and a long label turns it into a column', L.flowLayout(['seed', 'seedling', 'plant']).dir === 'row' && L.flowLayout(['one cow', 'the herd', 'the herd, the grass, the egrets', 'plus soil, water and weather']).dir === 'column');
  }
  { // Tools for the Job (pass HH): each round asks all six jobs once, each with its own tool and two others, three distinct pictures.
    ok('every tools-for-the-job round asks each job once with its right tool among three', [1, 2, 3, 4, 5].every((r) => { const qs = L.toolRounds(r); return qs.length === 6 && new Set(qs.map((q) => q.job)).size === 6 && qs.every((q) => L.TOOL_JOBS.find((t) => t[0] === q.job)[1] === q.answer && q.choices.length === 3 && new Set(q.choices).size === 3 && q.choices.includes(q.answer)); }));
    ok('the tools game belongs to business K to 2, is marked young, and names its jobs with its own key', L.COURSE_GAMES['business-k'].includes('tool-business-k') && L.GAMES.find((g) => g.id === 'tool-business-k').young === true && L.GAMES.find((g) => g.id === 'tool-business-k').tool === 'jobs');
    ok('the K to 2 money banks compute their saving and making sums', [...Array(80).keys()].every((i) => { for (const g of ['bzk-save', 'bzk-make']) { const q = L.generateQuestion(g, i); if (!q.story) continue; const n = (q.story.match(/\d+/g) || []).map(Number); if (g === 'bzk-make' && q.answer !== `${n[0] + n[1]} dollars`) return false; if (g === 'bzk-save') { const each = q.story.includes('one dollar') ? 1 : 2; const weeks = Number(q.prompt.match(/\d+/)[0]); if (q.answer !== `${each * weeks} dollars`) return false; } if (new Set(q.choices).size !== 3) return false; } return true; }));
  }
  { // Sort the Ledger (pass HK): six accounts a round, two from each side of the balance sheet, each on its true side.
    ok('every ledger round deals two accounts from each side, each on its true side', [1, 2, 3, 4, 5].every((r) => { const qs = L.ledgerRounds(r); return qs.length === 6 && new Set(qs.map((q) => q.item)).size === 6 && L.LEDGER_SIDES.every((side) => qs.filter((q) => q.answer === side).length === 2) && qs.every((q) => L.LEDGER_ITEMS.find((it) => it[0] === q.item)[1] === q.answer); }));
    { // Pass JD: college Public Speaking, built on ACGM SPCH 1315, with its own game.
      const c = L.COURSES.find((x) => x.id === 'speech-college');
      ok('college Public Speaking has four lessons at grade C', !!c && c.grade === 'C' && c.subject === 'Speech' && c.elective === true && c.modules.length === 4, c ? c.modules.map((m) => m.id).join(',') : 'missing');
      ok('Cite It or Not belongs to college speech and deals three of each a round', (L.COURSE_GAMES['speech-college'] || []).includes('cite-speech-college') && [1, 2, 3, 7, 12].every((r) => { const d = L.citeRounds(r); return d.length === 6 && d.filter((x) => x.answer === 'cite').length === 3 && new Set(d.map((x) => x.text)).size === 6 && d.every((x) => x.why); }));
      ok('every Cite It or Not card gives the lesson\'s reason', L.CITE_CARDS.length === 14 && L.CITE_CARDS.every(([, a, w]) => (a === 'cite' ? /source|credit|names/i : /common knowledge|own/i).test(w)));
    }
    { // Pass JC: college macroeconomics, built on ACGM ECON 2301, with its own game.
      const c = L.COURSES.find((x) => x.id === 'macroeconomics-college');
      ok('college macroeconomics has four lessons at grade C', !!c && c.grade === 'C' && c.subject === 'Economics' && c.elective === true && c.modules.length === 4, c ? c.modules.map((m) => m.id).join(',') : 'missing');
      ok('In GDP or Not belongs to college macroeconomics and deals three of each a round', (L.COURSE_GAMES['macroeconomics-college'] || []).includes('gdp-macroeconomics-college') && [1, 2, 3, 7, 12].every((r) => { const d = L.gdpRounds(r); return d.length === 6 && d.filter((x) => x.answer === 'in').length === 3 && new Set(d.map((x) => x.text)).size === 6 && d.every((x) => x.why); }));
      ok('every In GDP or Not card is new production or names why it is left out', L.GDP_CARDS.length === 14 && L.GDP_CARDS.filter((x) => x[1] === 'in').length === 7 && L.GDP_CARDS.filter((x) => x[1] === 'out').every(([t, , w]) => /used|stock|check|flour|home|made in|counted/i.test(t + ' ' + w)));
    }
    { // Pass JB: college General Psychology, built on ACGM PSYC 2301, with its own game.
      const c = L.COURSES.find((x) => x.id === 'psychology-college');
      ok('college General Psychology has four lessons at grade C', !!c && c.grade === 'C' && c.subject === 'Psychology' && c.elective === true && c.modules.length === 4, c ? c.modules.map((m) => m.id).join(',') : 'missing');
      ok('Cause or Correlation belongs to college psychology and deals three experiments and three correlations a round', (L.COURSE_GAMES['psychology-college'] || []).includes('cause-psychology-college') && [1, 2, 3, 7, 12].every((r) => { const d = L.causeRounds(r); return d.length === 6 && d.filter((x) => x.answer === 'experiment').length === 3 && new Set(d.map((x) => x.text)).size === 6 && d.every((x) => x.why); }));
      ok('every Cause or Correlation experiment names chance, and no correlation does', L.CAUSE_STUDIES.every(([t, a]) => (a === 'experiment') === /random|coin flip|by chance/i.test(t)), L.CAUSE_STUDIES.filter(([t, a]) => (a === 'experiment') !== /random|coin flip|by chance/i.test(t)).map((x) => x[0]).join(' | '));
    }
    ok('the ledger game belongs to college business and names its accounts with its own key', L.COURSE_GAMES['business-college'].includes('ledger-business-college') && L.GAMES.find((g) => g.id === 'ledger-business-college').ledger === 'accounts');
    ok('the college accounting bank computes owners\' equity and the current ratio', [...Array(80).keys()].every((i) => { const q = L.generateQuestion('bzc-money', i); if (!q.story) return true; const n = q.story.match(/\d+/g).map(Number); if (new Set(q.choices).size !== 4 || !q.choices.includes(q.answer)) return false; if (q.prompt.includes('equity')) return q.answer === `$${n[0] - n[2]},000`; return Number(q.answer) === n[0] / n[2]; }));
  }
  { // What's new (pass HL, Mikey): short notes are cut at the first colon or first sentence, naturally, and never inside a price or an abbreviation.
    ok("a What's new note is shortened at its first colon or its first sentence", briefNews('Finishing the course unlocks Grow the Plant, a new kind of game for small hands: water, sunshine and soil grow the plant.') === 'Finishing the course unlocks Grow the Plant, a new kind of game for small hands.' && briefNews('Two new Wonder questions wait. The strand is complete.') === 'Two new Wonder questions wait.' && briefNews('A one-sentence note stays whole.') === 'A one-sentence note stays whole.');
    ok("a short note never cuts a price or an abbreviation", briefNews('Prices like $4.95 and the U.S. economy stay whole.') === 'Prices like $4.95 and the U.S. economy stay whole.');
    const doc = '## October 1, 2026 (newer)\n\n- New one: detail.\n\n## September 30, 2026 (older)\n\n- Old one.\n'; const h = recentNews(doc, 6);
    ok('the More Details history lists the newest update first, with its title and full notes', h.length === 2 && h[0].date === 'October 1, 2026' && h[0].title === 'newer' && h[0].items[0] === 'New one: detail.');
    // The pop-up shows each note cut at its first sentence, so a note whose first period sits inside a quotation would leave the
    // quote open on screen (pass MK, the final read: `the voice now says "Not that one.`). Every short note closes what it opens.
    { const news = newestNews(readFileSync(new URL('../docs/WHATS-NEW.md', import.meta.url), 'utf8')); const open = news.brief.filter((b) => (b.match(/"/g) || []).length % 2 === 1 || (b.match(/\u201C/g) || []).length !== (b.match(/\u201D/g) || []).length);
      ok("every short note in the newest What's new block closes the quotation marks it opens", news.brief.length >= 2 && open.length === 0, open.join(' | ')); }
  }
  { // Read the Label (pass HM): six comparisons, two for each nutrient, the asked-for difference at least its gap, and the answer the better label.
    const gap = { sodium: 80, 'added sugars': 3, fiber: 2 };
    ok('every label round compares two foods fairly and names the better one', [1, 2, 3, 4, 5].every((r) => { const qs = L.labelRounds(r); return qs.length === 6 && L.LABEL_NUTRIENTS.every(([n]) => qs.filter((q) => q.nutrient === n).length === 2) && qs.every((q) => { const d = q.a[q.nutrient] - q.b[q.nutrient]; if (Math.abs(d) < gap[q.nutrient]) return false; const aBetter = q.goal === 'less' ? d < 0 : d > 0; return q.answer === (aBetter ? 'A' : 'B'); }); }));
    ok('the label game belongs to health 6 to 8 and names its foods with its own key', L.COURSE_GAMES['health-6'].includes('label-health-6') && L.GAMES.find((g) => g.id === 'label-health-6').label === 'foods');
    ok('the health food bank computes the sodium in several servings', [...Array(80).keys()].every((i) => { const q = L.generateQuestion('hl6-food', i); if (!q.story) return true; const per = Number(q.story.match(/\d+/)[0]); const n = Number(q.prompt.match(/\d+/)[0]); return q.answer === `${per * n} milligrams` && new Set(q.choices).size === q.choices.length && q.choices.length >= 3; }));
  }
  { // Push to the Beat (pass HN): the pace comes from the gaps between taps, and only 100 to 120 a minute is just right.
    const taps = (gap, n = 12) => Array.from({ length: n }, (_, i) => i * gap);
    ok('the CPR pace is measured from the gaps between taps', L.cprRate(taps(500)) === 120 && L.cprRate(taps(545)) === 110 && L.cprRate(taps(600)) === 100 && L.cprRate([0]) === 0);
    ok('only 100 to 120 compressions a minute is just right', L.cprVerdict(99) === 'too slow' && L.cprVerdict(100) === 'just right' && L.cprVerdict(120) === 'just right' && L.cprVerdict(121) === 'too fast' && L.CPR_TARGET.low === 100 && L.CPR_TARGET.high === 120);
    ok('the CPR game belongs to high school health and names its compressions with its own key', L.COURSE_GAMES['health-9'].includes('cpr-health-9') && L.GAMES.find((g) => g.id === 'cpr-health-9').cpr === 'compressions');
    ok('the high school food bank computes the calories in a whole bag', [...Array(80).keys()].every((i) => { const q = L.generateQuestion('hl9-food', i); if (!q.story) return true; const n = q.story.match(/\d+/g).map(Number); return q.answer === String(n[0] * n[1]) && new Set(q.choices).size === 4; }));
  }
  { // Green Flag or Red Flag (pass HO): eight behaviors a round, four of each flag, each with its true flag.
    ok('every green-or-red round deals four of each flag, each with its true flag', [1, 2, 3, 4, 5].every((r) => { const qs = L.greenredRounds(r); return qs.length === 8 && new Set(qs.map((q) => q.behavior)).size === 8 && qs.filter((q) => q.answer === 'green').length === 4 && qs.every((q) => L.GREENRED_CARDS.find((c) => c[0] === q.behavior)[1] === q.answer); }));
    ok('the green-or-red game belongs to the reproductive and sexual health elective', L.COURSE_GAMES['sexual-health-6'].includes('greenred-sexual-health-6') && L.GAMES.find((g) => g.id === 'greenred-sexual-health-6').greenred === 'behaviors');
    ok('the reproductive and sexual health course is an elective, so it appears only when an educator assigns it', L.COURSES.find((c) => c.id === 'sexual-health-6').elective === true);
  }
  { // The human sexuality elective (pass HO): it asks for consent, and its Wonder questions never leave it.
    const hs = L.COURSES.find((c) => c.id === 'sexual-health-6'); const gated = L.WONDER.filter((w) => w.courseIds.includes('sexual-health-6'));
    const plain = L.WONDER.find((w) => w.stage === 'teen' && w.courseIds.includes('health-6'));
    ok('the human sexuality elective is an elective that asks for a parent\'s consent', !!hs && hs.elective === true && hs.consent === 'human-sexuality');
    ok('its Wonder questions appear only inside it, while other questions still follow the stage', gated.length === 2 && gated.every((w) => !L.wonderAllowed(w, 'health-6', 'teen') && !L.wonderAllowed(w, 'psychology-6', 'teen') && L.wonderAllowed(w, 'sexual-health-6', 'teen')) && !!plain && L.wonderAllowed(plain, 'psychology-6', 'teen'));
  }
  { // The high school human sexuality elective (pass HP): consent, gated Wonder questions, and a fair Myth or Fact deal.
    const hs9 = L.COURSES.find((c) => c.id === 'sexual-health-9'); const gated9 = L.WONDER.filter((w) => w.courseIds.includes('sexual-health-9'));
    ok('the high school human sexuality elective asks for consent and keeps its Wonder questions inside it', !!hs9 && hs9.elective === true && hs9.consent === 'human-sexuality' && gated9.length === 2 && gated9.every((w) => !L.wonderAllowed(w, 'health-9', 'grown') && L.wonderAllowed(w, 'sexual-health-9', 'grown')));
    ok('every Myth or Fact round deals three myths and three facts, each with a reason', [1, 2, 3, 4, 5].every((r) => { const qs = L.mythfactRounds(r); return qs.length === 6 && new Set(qs.map((q) => q.text)).size === 6 && qs.filter((q) => q.answer === 'myth').length === 3 && qs.every((q) => (q.answer === 'myth' || q.answer === 'fact') && q.why.length > 10); }));
    ok('the Myth or Fact game belongs to the high school human sexuality elective', L.COURSE_GAMES['sexual-health-9'].includes('mythfact-sexual-health-9') && L.GAMES.find((g) => g.id === 'mythfact-sexual-health-9').mythfact === 'statements');
  }
  { // No repeated questions (pass HR, Mikey's screenshots): a round never asks the same question twice, and the number of
    // modules whose banks are smaller than their round may only fall. When a bank grows, lower SHORT_POOL_LIMIT to match.
    const SHORT_POOL_LIMIT = 0; // the program is finished (pass HX): every module must fill its round
    const repeats = []; for (const c of L.COURSES) for (const m of c.modules) for (const seed of [1, 2, 3]) { const core = L.buildAttempt(m.id, seed, []).core.filter((q) => q.type !== 'trace'); if (new Set(core.map((q) => L.questionKey(q))).size !== core.length) repeats.push(m.id); }
    ok('no practice round, in any module, asks the same question twice', repeats.length === 0);
    // No reduction in questions (Mikey, pass HX): every module's round is full length, never shortened.
    const shortRounds = []; for (const c of L.COURSES) for (const m of c.modules) for (const seed of [1, 2, 3]) if (L.buildAttempt(m.id, seed, []).core.length < L.moduleRules(m.id).questions) shortRounds.push(m.id);
    ok('every practice round, in every module, is full length', shortRounds.length === 0);
    const QP = await import('../tools/question-pools.mjs'); const short = QP.shortPools(200);
    ok(`no new module has fewer different questions than its round (at most ${SHORT_POOL_LIMIT}, now ${short.length})`, short.length <= SHORT_POOL_LIMIT);
    { const src = (await import('node:fs')).readFileSync(new URL('../src/logic.mjs', import.meta.url), 'utf8'); const keys = [...src.matchAll(/^  '([a-z0-9-]+)': \(rng\) => \{/gm)].map((m) => m[1]); const twice = keys.filter((k, i) => keys.indexOf(k) !== i);
      ok('no question bank is defined twice, so an edit can never land on an unused copy', twice.length === 0); }
    ok('the two agriculture banks from the screenshots fill a ten-question round', QP.poolSize(['ag-scope']) >= 12 && QP.poolSize(['ag-animals']) >= 12);
    // Pass IU (Mikey: the same question and answer twice in one Animal sounds round): a new wrong choice does not make a question new.
    ok('a repeat is the same question and answer, whatever the wrong choices', L.questionKey({ prompt: 'Tap the cup.', answer: 'icon:cup', choices: ['icon:cup', 'icon:sun'] }) === L.questionKey({ prompt: 'Tap the cup.', answer: 'icon:cup', choices: ['icon:moon', 'icon:cup'] }) && L.questionKey({ prompt: 'Tap the cup.', answer: 'icon:cup' }) !== L.questionKey({ prompt: 'Tap the cup.', answer: 'icon:sun' }));
    ok('an Animal sounds round never asks for the same animal twice', [1, 2, 3, 4, 5, 6, 7, 8].every((seed) => { const core = L.buildAttempt('animal-sounds', seed, []).core; return new Set(core.map((q) => `${q.prompt}|${q.answer}`)).size === core.length; }));
  }
  { // No prompt runs past 400 characters (pass JE, Mikey: "we probably don't need a hard 70 character limit"). The 70 and 110
    // limits are gone, so questions can carry the context and flow they need; this guard only catches a pasted paragraph.
    const QP = await import('../tools/question-pools.mjs'); const longs = QP.longPrompts(200, 400);
    ok(`no prompt in any bank runs past 400 characters (now ${longs.length} over${longs.length ? ': ' + longs.slice(0, 3).map((r) => r.generator).join(', ') : ''})`, longs.length === 0);
  }
  { // Questions that read well (pass IB, Mikey): the wording checks in tools/question-review.mjs find questions that end in a
    // fragment, lean on a setup they come before, leave a word hanging, say 1 meters or a 8, or explain with a label or by
    // repeating the answer. The read-through passes fix the rest by hand; this count may only fall.
    const WORDING_FLAG_LIMIT = 0; // pass IB: 13 explanations that only repeat their answer (grades 7, 9 and 12)
    const QR = await import('../tools/question-review.mjs'); const flagged = QR.flaggedQuestions(150);
    ok(`no new question reads badly to the wording checks (at most ${WORDING_FLAG_LIMIT}, now ${flagged.length})`, flagged.length <= WORDING_FLAG_LIMIT);
  }
  ok('the two robot games sit in the two programming courses beside their first games', L.COURSE_GAMES['tech-3'].includes('debug-tech-3') && L.COURSE_GAMES['tech-5'].includes('debug-tech-5') && L.GAMES.filter((g) => g.kind === 'debug').every((g) => L.ROBOT_DECKS[g.deck]));
}


// History timelines (2026-09-25): every dated set runs strictly forward in time, with a date for every event.
{
  const decks = ['texas4', 'cultures6', 'us8', 'world10', 'us11', 'gov12'];
  ok('every history timeline set has five events, a date for each, and runs strictly forward', decks.every((k) => L.ORDER_DECKS[k] && L.ORDER_DECKS[k].length >= 3 && L.ORDER_DECKS[k].every((s) => s.steps.length === 5 && (!s.years || (s.years.length === 5 && s.when.length === 5 && s.years.every((y, i) => i === 0 || y > s.years[i - 1]))))));
  ok('every history timeline game sits in its history course beside its map', ['history-4', 'history-6', 'history-8', 'history-10', 'history-11', 'government-12'].every((c) => L.COURSE_GAMES[c].some((id) => { const g = L.GAMES.find((x) => x.id === id); return g && g.kind === 'order' && decks.includes(g.deck); }) && L.COURSE_GAMES[c].some((id) => id.startsWith('map-'))));
}


// The periodic table (2026-09-25): the data is right, every question has exactly one answer on the table.
{
  const P = L.PTABLE; const at = (sym) => P.find((e) => e.sym === sym);
  ok('the table holds the main groups of periods 1 to 5, numbers rising left to right in each period, symbols and names unique', P.length === 34 && new Set(P.map((e) => e.sym)).size === 34 && new Set(P.map((e) => e.name)).size === 34 && [1, 2, 3, 4, 5].every((per) => { const row = P.filter((e) => e.period === per).sort((a, b) => a.group - b.group); return row.every((e, i) => i === 0 || e.z > row[i - 1].z); }));
  ok('known elements sit where they belong', at('Na').z === 11 && at('Na').group === 1 && at('Na').period === 3 && at('Cl').z === 17 && at('Cl').group === 17 && at('He').group === 18 && at('He').period === 1 && at('Kr').z === 36 && at('Sn').z === 50 && at('Sn').group === 14 && at('I').z === 53 && at('Xe').period === 5 && at('Ga').z === 31 && at('Ga').group === 13);
  ok('hydrogen is not called an alkali metal, and the families read right', L.ptableFamily(at('H')) === null && L.ptableFamily(at('K')) === 'alkali metal' && L.ptableFamily(at('Ca')) === 'alkaline earth metal' && L.ptableFamily(at('Br')) === 'halogen' && L.ptableFamily(at('Ar')) === 'noble gas' && L.ptableFact(at('Na')) === 'Na is sodium: 11 protons, group 1, period 3, an alkali metal.');
  const fits = (q) => P.filter((e) => (q.kind === 'name' ? q.ask === `Tap ${e.name}.` : q.kind === 'protons' ? q.ask.includes(` ${e.z} proton`) : q.kind === 'place' ? q.ask.includes(`group ${e.group}, period ${e.period}.`) : L.ptableFamily(e) && q.ask === `Tap the ${L.ptableFamily(e)} in period ${e.period}.`));
  ok('every periodic table question over sixty rounds has exactly one element that fits, and it is the answer', Array.from({ length: 60 }, (_, r) => L.ptableQuestions(r)).every((qs) => qs.length === 8 && new Set(qs.map((q) => q.z)).size === 8 && qs.every((q) => { const f = fits(q); return f.length === 1 && f[0].z === q.z; })));
  ok('the periodic table game belongs to chemistry, and physics no longer holds two pairs games', L.COURSE_GAMES['science-10'].includes('ptable-science-10') && !L.COURSE_GAMES['science-11'].includes('pairs-elements'));
}


// Find the evidence (2026-09-25): every passage is whole sentences, its answer is one of them, and each reading course
// that had a quick fire now has this game instead.
{
  const decks = Object.values(L.EVIDENCE_DECKS);
  ok('every evidence passage has four or five whole sentences, a question, one answer among them and a reason', decks.length === 4 && decks.every((d) => d.length >= 6 && d.every((it) => it.text.length >= 4 && it.text.length <= 5 && it.text.every((s) => /^[A-Z"]/.test(s) && /[.!?]"?$/.test(s)) && new Set(it.text).size === it.text.length && /\?$/.test(it.ask) && Number.isInteger(it.answer) && it.answer >= 0 && it.answer < it.text.length && it.why && it.why.length > 10)));
  ok('the nine reading courses that held quick fires now hold find the evidence', ['reading-3', 'reading-4', 'reading-5', 'reading-8', 'reading-9', 'reading-10', 'reading-11', 'reading-12', 'reading-college'].every((c) => L.COURSE_GAMES[c].length === 1 && L.COURSE_GAMES[c][0] === `evidence-${c}` && L.EVIDENCE_DECKS[L.GAMES.find((g) => g.id === `evidence-${c}`).deck]));
}


// Security pass (2026-09-25): parsing drops prototype keys; wrong PIN tries rest the box on every fifth.
{
  const parsed = L.safeJson('{"a":1,"__proto__":{"polluted":true},"nested":{"constructor":{"prototype":{"x":1}},"b":2}}');
  ok('safeJson keeps ordinary data and drops __proto__, constructor and prototype keys at every depth', parsed.a === 1 && parsed.nested.b === 2 && !Object.prototype.hasOwnProperty.call(parsed, '__proto__') && !Object.prototype.hasOwnProperty.call(parsed.nested, 'constructor') && ({}).polluted === undefined);
  ok('safeJson returns null for text that is not JSON', L.safeJson('not json') === null && L.safeJson('') === null);
  let s = { failures: 0, lockUntil: 0 }; const t0 = 1000000;
  for (let i = 0; i < 4; i++) s = L.pinLockAfterFailure(s, t0);
  const fourOk = L.pinLockLeft(s, t0) === 0; s = L.pinLockAfterFailure(s, t0);
  const firstRest = L.pinLockLeft(s, t0) === 30 && L.pinLockLeft(s, t0 + 30001) === 0;
  for (let i = 0; i < 5; i++) s = L.pinLockAfterFailure(s, t0 + 40000);
  const secondRest = L.pinLockLeft(s, t0 + 40000) === 60;
  let big = { failures: 0, lockUntil: 0 }; for (let i = 0; i < 60; i++) big = L.pinLockAfterFailure(big, t0);
  ok('four wrong PIN tries do nothing, the fifth rests the box 30 seconds, the tenth 60, and the rest never passes 15 minutes', fourOk && firstRest && secondRest && L.pinLockLeft(big, t0) === 900);
}


// License codes (2026-09-25): pre-K and kindergarten are free; a signed code opens grade 1 and up for one child's year.
{
  const { readFileSync } = await import('node:fs');
  const devKey = JSON.parse(readFileSync(new URL('./fixtures/dev-license-private.json', import.meta.url), 'utf8'));
  const code = await L.makeLicenseCode(devKey, { id: 'TX-0001', name: 'Frederick', year: '2026-27', until: '2027-07-31' });
  const good = await L.checkLicenseCode(code, new Date('2026-10-01T12:00:00'));
  ok('a signed code checks out with its details', good.ok === true && good.id === 'TX-0001' && good.name === 'Frederick' && good.year === '2026-27' && good.until === '2027-07-31');
  const [head, payload, sig] = code.split('.');
  const forged = btoa(JSON.stringify({ id: 'TX-0001', name: 'Frederick', year: '2026-27', until: '2099-12-31' })).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  ok('an edited code is refused', (await L.checkLicenseCode(`${head}.${forged}.${sig}`, new Date('2026-10-01T12:00:00'))).ok === false);
  ok('a code past its last day is refused, and says so', (await L.checkLicenseCode(code, new Date('2027-08-01T09:00:00'))).reason === 'That code ended on 2027-07-31.');
  ok('text that is not a code is refused kindly', (await L.checkLicenseCode('hello')).ok === false && (await L.checkLicenseCode('')).ok === false);
  const otherPair = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']);
  const otherPriv = await crypto.subtle.exportKey('jwk', otherPair.privateKey);
  ok('a code signed with any other key is refused', (await L.checkLicenseCode(await L.makeLicenseCode(otherPriv, { id: 'X', name: 'Y', year: '2026-27', until: '2027-07-31' }), new Date('2026-10-01'))).ok === false);
  ok('pre-K 3, pre-K 4 and kindergarten courses are free, grade 1 and up are not', L.COURSES.filter(L.courseIsFree).length > 0 && L.COURSES.every((c) => L.courseIsFree(c) === ['PK3', 'PK4', 'K'].includes(c.grade)) && L.COURSES.filter(L.courseIsFree).reduce((n, c) => n + c.modules.length, 0) === 165);   // 86 plus computer science (FS), economics (FV), art and music (GE), philosophy (GL), psychology (GP) and speech (GT), four modules each, plus the five kindergarten science modules of earmark E1 (pass KK) the two Counting modules of earmark E2 (pass KL) the seven Me and my community modules of earmark E3 (passes KM and KN) the seven Taking care of me modules of earmark E4 (passes KO and KP) the four Tell, show, step and repeat modules of earmark E5 (passes KQ and KR) and the five Letters tracing modules of earmark E6 (pass KS), plus the two Very First Steps feelings modules of earmark E12 (pass MD) and its One more and one fewer and Listen and Point's Words that rhyme (pass ME), plus Very First Steps' Can I play too? and First Steps' three feelings lessons of earmarks E12 and E13 (pass MN), plus First Steps' Let's play together of earmark E13 and Listen and Point's Two steps and Two ideas and First Sounds and Letters' Three steps of earmarks E12 and E13 (pass MO), plus Listen and Point's Learning words and People and events, Very First Steps' Talking with a friend, and First Sounds and Letters' More learning words and Words that go together of earmarks E12 and E13 (pass MQ)
  const mixed = ['counting-k', 'reading-3', 'letters-k'];
  ok('without a license only the free courses open; with one, all of them do', JSON.stringify(L.openCourseIds(mixed, false)) === JSON.stringify(['counting-k', 'letters-k']) && L.openCourseIds(mixed, true).length === 3);
  ok('the app carries a public key only, marked as the development key until launch', !('d' in L.LICENSE_PUBLIC_KEY) && L.LICENSE_KEY_IS_DEVELOPMENT === true);
}


// Mikey's Wonder rules (2026-09-28): one reflection per two modules worked; after a failed round or several misses in
// a row, reframing failure and handling feelings come first, even ahead of questions never seen; never a third time;
// and every stage holds more than enough, even for a student who struggles often.
{
  const approvedAll = L.approveAllWonder(L.emptyWonderReview());
  const at = (h) => `2026-09-01T${String(h).padStart(2, '0')}:00:00.000Z`;
  const round = (id, h, correctFlags) => ({ type: 'attempt_completed', at: at(h), startedAt: at(h), moduleId: id, seed: 1, core: correctFlags.map((c) => ({ correct: c })), review: null, coreCorrect: correctFlags.filter(Boolean).length, coreTotal: correctFlags.length });
  const good = [true, true, true, true, true];
  const passedButShaky = [true, false, false, false, true];
  const failedRound = [false, false, true, false, false];
  const comfortTheme = (w) => w && (w.theme === 'failure' || w.theme === 'feelings');
  // Every early question answered once, so no question is unseen except none; then a failure must still pick comfort first.
  const everyWorldOnce = L.WONDER.filter((w) => w.stage === 'early' && w.theme === 'world').map((w, i) => L.makeWonderEvent(w.id, 'count-to-5', at(1) + i, 30, 5));
  const worldUnseen = [round('count-to-5', 2, good), round('count-to-10', 3, failedRound)];
  ok('after a failed round a failure or feelings question comes first', comfortTheme(L.nextWonder(worldUnseen, 'counting-k', approvedAll)));
  ok('three misses in a row inside a passed round also count as a rough patch', L.missStreak(round('m', 1, passedButShaky)) === 3 && comfortTheme(L.nextWonder([round('count-to-5', 2, good), round('count-to-10', 3, passedButShaky)], 'counting-k', approvedAll)));
  const comfortSeenOnce = L.WONDER.filter((w) => w.stage === 'early' && comfortTheme(w)).map((w, i) => ({ ...L.makeWonderEvent(w.id, 'count-to-5', at(4), 30, 5), at: `2026-09-01T04:00:${String(i).padStart(2, '0')}.000Z` }));
  const afterFail = [...comfortSeenOnce, round('count-to-5', 6, good), round('count-to-10', 7, failedRound)];
  ok('a rough patch still picks a comfort question over a world question never seen', comfortTheme(L.nextWonder(afterFail, 'counting-k', approvedAll)));
  const calm = [round('count-to-5', 2, good), round('count-to-10', 3, good)];
  ok('with no rough patch, the rotation is unchanged and a question is still due after two modules', L.nextWonder(calm, 'counting-k', approvedAll) !== null);
  const twice = (w) => [L.makeWonderEvent(w.id, 'm', at(1), 30, 5), L.makeWonderEvent(w.id, 'm', at(2), 30, 5)];
  const onlyOne = { version: 1, approved: ['w-fell-off-bike'], hidden: [] };
  ok('a question answered twice is never offered a third time', L.nextWonder([...twice({ id: 'w-fell-off-bike' }), round('count-to-5', 3, good), round('count-to-10', 4, failedRound)], 'counting-k', onlyOne) === null);
  // Enough for years: at one reflection per two modules, each stage's pool (each question twice) covers the stage half
  // again, and its failure and feelings questions alone cover three reflections in four.
  for (const stage of ['early', 'growing', 'teen', 'grown']) {
    const modules = L.COURSES.filter((c) => L.stageForGrade(c.grade) === stage).reduce((n, c) => n + c.modules.length, 0);
    const need = Math.ceil(modules / L.WONDER_EVERY);
    const pool = L.WONDER.filter((w) => w.stage === stage);
    const comfort = pool.filter(comfortTheme);
    ok(`${stage}: ${pool.length} questions cover ${need} reflections half again`, pool.length * L.WONDER_MAX_REPEATS >= Math.ceil(need * 1.5));
    ok(`${stage}: ${comfort.length} failure and feelings questions cover three reflections in four`, comfort.length * L.WONDER_MAX_REPEATS >= Math.ceil(need * 0.75));
  }
  const spokenComfort = L.WONDER.filter((w) => w.stage === 'early' && Array.isArray(w.simple) && comfortTheme(w));
  ok('pre-readers have spoken failure and feelings questions for three early reflections in four', spokenComfort.length * L.WONDER_MAX_REPEATS >= Math.ceil(0.75 * L.COURSES.filter((c) => L.stageForGrade(c.grade) === 'early').reduce((n, c) => n + c.modules.length, 0) / L.WONDER_EVERY));
}

// Explanations stand on their own (pass JO, Mikey: review the explanatory quality too). A learner hears or reads the
// explanation after a wrong answer, so it says the answer and the reason in whole sentences instead of continuing a
// thought ("And in good shape."). Checked for the grades read by hand so far, pre-K through grade 1.
{
  const early = L.COURSES.filter((c) => ['PK3', 'PK4', 'K', '1'].includes(String(c.grade)));
  const bad = [];
  for (const c of early) for (const m of c.modules) for (const g of [...new Set(m.generators)]) for (let s = 1; s < 80; s++) {
    let q; try { q = L.generateQuestion(g, s * 7919); } catch (e) { continue; }
    if (/^(And|But|Then|Or|So|If not)\b/.test(String(q.explain || '')) && !/claps?\.$/.test(String(q.explain))) { bad.push(`${g}: ${q.explain}`); break; }   // clapped syllables (But ter fly) are not a thought
  }
  ok('early-years explanations never start in the middle of a thought', bad.length === 0, bad.slice(0, 6).join(' | '));
}

// ---------------------------------------------------------------------
// The light review, the fourth exposure (pass LF): the schedule, the three outcomes, what a fail reopens and probes,
// and the sentences an educator reads, in Mikey's approved wording.
// ---------------------------------------------------------------------
{
  const iso = (d) => new Date(Date.UTC(2026, 9, d, 15, 0, 0)).toISOString();
  const pass = (moduleId, day) => L.makeAttemptEvent({ moduleId, seed: 1 }, [1, 1, 1, 1, 1].map(() => ({ correct: true, ms: 3000 })), null, iso(day), iso(day));
  const star = (moduleId, d1, d2) => [pass(moduleId, d1), pass(moduleId, d2)];
  const events = [...star('teen-numbers', 1, 2), ...star('adding-to-20', 3, 4)];
  const st = L.lightReviewState(events, 'teen-numbers');
  ok('a star starts the schedule, first review three weeks later', st.stage === 'first' && st.dueAt === new Date(new Date(iso(2)).getTime() + 21 * 86400000).toISOString());
  ok('an unstarred lesson has no review', L.lightReviewState(events, 'subtracting-to-20').stage === 'none');
  ok('nothing is due before three weeks', L.lightReviewDue(events, iso(20)) === null);
  ok('after three weeks the review is due, the oldest star first', L.lightReviewDue(events, iso(24)).moduleId === 'teen-numbers');
  const due = L.lightReviewDue(events, iso(24));
  const review = L.buildLightReview(events, 7, due);
  ok('a light review is five questions from the lesson\'s own bank, no repeats', review.core.length === 5 && review.core.every((q) => L.getModule('teen-numbers').generators.includes(q.genId)) && new Set(review.core.map((q) => L.questionKey(q))).size === 5 && review.lightReview.stage === 'first');
  const clear = L.makeLightReviewEvent(review, [1, 1, 1, 1, 0].map((c) => ({ correct: !!c })), iso(24), iso(24));
  ok('four of five is a clear pass and ends the schedule', clear.outcome === 'clear' && L.lightReviewState([...events, clear], 'teen-numbers').stage === 'done' && L.lightReviewDue([...events, clear], iso(60)) === null || L.lightReviewDue([...events, clear], iso(60)).moduleId !== 'teen-numbers');
  const bare = L.makeLightReviewEvent(review, [1, 1, 1, 0, 0].map((c) => ({ correct: !!c })), iso(24), iso(24));
  const afterBare = L.lightReviewState([...events, bare], 'teen-numbers');
  ok('three of five is a bare pass: a retry in a week that opens with the missed kinds', bare.outcome === 'bare' && afterBare.stage === 'retry' && afterBare.dueAt === new Date(new Date(iso(24)).getTime() + 7 * 86400000).toISOString() && afterBare.missedKinds.length === 2);
  const retry = L.buildLightReview([...events, bare], 9, { moduleId: 'teen-numbers', stage: 'retry', missedKinds: afterBare.missedKinds });
  ok('the longest-overdue lesson is reviewed first (the other star fell due before the retry)', L.lightReviewDue([...events, bare], iso(32)).moduleId === 'adding-to-20');
  ok('the retry asks the missed kinds first', retry.lightReview.stage === 'retry' && retry.core[0].genId === afterBare.missedKinds[0] && retry.core[1].genId === afterBare.missedKinds[1]);
  const fail = L.makeLightReviewEvent(review, [1, 0, 0, 0, 0].map((c) => ({ correct: !!c })), iso(24), iso(24));
  const afterFail = [...events, fail];
  ok('two or fewer is a fail: the lesson is reopened and nothing is due until it is passed again', fail.outcome === 'fail' && L.lightReviewState(afterFail, 'teen-numbers').stage === 'reopened' && L.reviewingIds(afterFail).includes('teen-numbers') && (L.lightReviewDue(afterFail, iso(90)) || {}).moduleId !== 'teen-numbers');
  ok('a fail never rewrites the star', L.deriveProgress(afterFail).perModule['teen-numbers'].mastered === true);
  ok('a fail probes the mastered prerequisites of the reopened lesson, the ones the summary names', JSON.stringify(L.probeIds([...afterFail, ...star('making-ten', 5, 6)])) === JSON.stringify(L.prerequisitesOf('teen-numbers').filter((id) => ['making-ten'].includes(id))) && L.prerequisitesOf('teen-numbers').length >= 1);
  ok('every lesson maps to its prerequisites, in its course or across courses', L.MODULES.every((m) => Array.isArray(L.prerequisitesOf(m.id)) && L.prerequisitesOf(m.id).every((id) => L.getModule(id))));
  const passedAgain = [...afterFail, ...star('teen-numbers', 30, 31)];
  ok('passing a reopened lesson again restarts the schedule from the new star', L.lightReviewState(passedAgain, 'teen-numbers').stage === 'first' && L.reviewingIds(passedAgain).length === 0);
  // Stuck after a failed review (no switch; Mikey, pass LF): the ladder is two misses, a loop back, two more misses.
  const miss = (moduleId, day) => L.makeAttemptEvent({ moduleId, seed: 1 }, [0, 0, 0, 1, 1].map((c) => ({ correct: !!c, ms: 3000 })), null, iso(day), iso(day));
  const twoMisses = [...afterFail, miss('teen-numbers', 25), miss('teen-numbers', 26)];
  ok('two misses alone are not stuck; the app loops back first', L.lightReviewStuck(twoMisses, 'teen-numbers') === null && L.stuckAfterReviewIds(twoMisses).length === 0);
  const looped = [...twoMisses, L.makeLoopBackEvent('teen-numbers', L.prerequisitesOf('teen-numbers').slice(-1)[0], iso(26)), ...star(L.prerequisitesOf('teen-numbers').slice(-1)[0], 27, 27), miss('teen-numbers', 28)];
  ok('one miss after the loop back is still not stuck', L.lightReviewStuck(looped, 'teen-numbers') === null);
  const stuck = [...looped, miss('teen-numbers', 29)];
  const stuckInfo = L.lightReviewStuck(stuck, 'teen-numbers');
  ok('two misses, a loop back and two more misses is stuck, with the rounds and the lesson looped to', stuckInfo && stuckInfo.rounds === 4 && stuckInfo.loopedTo === L.prerequisitesOf('teen-numbers').slice(-1)[0] && L.stuckAfterReviewIds(stuck).includes('teen-numbers'));
  ok('a pass on the reopened lesson clears stuck', L.lightReviewStuck([...stuck, pass('teen-numbers', 30)], 'teen-numbers') === null);
  const sStuck = L.lightReviewSentences(stuck, 'S-77');
  ok('the stuck sentence, in Mikey\'s wording, says the score, the rounds, the loop back and that the lesson keeps its star', sStuck.length === 1 && /cannot seem to get past \*Teen Numbers\*/.test(sStuck[0]) && /scored one out of five on their practice review/.test(sStuck[0]) && /four rounds at it without a pass and one of those rounds was after looping back to \*Making Ten\*/.test(sStuck[0]) && /keep its star/.test(sStuck[0]) && !/clicking below/.test(sStuck[0]));
  ok('the popup version adds the line that points at the Move forward button, the summary version leaves it out', /You can still move S-77 forward by clicking below\./.test(L.stuckSentence(stuck, 'teen-numbers', 'S-77')) && !/clicking below/.test(L.stuckSentence(stuck, 'teen-numbers', 'S-77', { action: false })) && L.lightReviewSentences(stuck, 'S-77', 3, { action: true })[0] === L.stuckSentence(stuck, 'teen-numbers', 'S-77'));
  const moved = [...stuck, L.makeMovedForwardEvent('teen-numbers', iso(30))];
  const stMoved = L.lightReviewState(moved, 'teen-numbers');
  ok('moving forward closes the review: not reviewing, nothing due, the star untouched', stMoved.stage === 'moved' && L.reviewingIds(moved).length === 0 && L.stuckAfterReviewIds(moved).length === 0 && (L.lightReviewDue(moved, iso(120)) || {}).moduleId !== 'teen-numbers' && L.deriveProgress(moved).perModule['teen-numbers'].mastered === true);
  ok('the lesson stays in the memory checks after moving forward', L.deriveProgress(moved).masteredIds.includes('teen-numbers'));
  const sMoved = L.lightReviewSentences(moved, 'S-77');
  ok('the moved sentence names the day, the loop back, and that the lesson keeps flowing through memory checks', sMoved.length === 1 && /You moved S-77 forward on \*Teen Numbers\* on October 30/.test(sMoved[0]) && /loop back to \*/.test(sMoved[0]) && /continue to flow through infrequent memory checks/.test(sMoved[0]));
  { const h = L.lightReviewHistory(moved, 'S-77');
    ok('the history lists each review and each Move Forward with its date, newest first', h.length === 2 && h[0].kind === 'moved' && h[1].kind === 'fail' && h.every((x) => !!x.at) && String(h[0].at) > String(h[1].at) && /^You moved S-77 forward/.test(h[0].text));
    const hs = L.lightReviewHistory(stuck, 'S-77');
    ok('a lesson stuck right now is in the history too, without the action line', hs.length === 2 && hs[0].kind === 'stuck' && !/clicking below/.test(hs[0].text));
    const note = L.weeklyNote('S-77', moved, iso(31));
    ok('the weekly note carries the week\'s practice reviews and Move Forward', /Practice reviews:/.test(note) && /You moved S-77 forward on \*\*Teen Numbers\*\*/.test(note));
    const later = L.weeklyNote('S-77', moved, iso(32));
    ok('the weekly note carries only that week\'s practice reviews (the Move Forward of day 30, not the review of day 24)', /You moved S-77 forward/.test(later) && !/took a short practice review of/.test(later));
    ok('Who Needs Help lists a lesson stuck after its practice review', JSON.stringify(L.classView([{ id: 's-77', label: 'S-77', events: stuck }], iso(30))).includes('since a practice review reopened it')); }
  // A lesson never mastered (Mikey, pass LQ): the ladder, Move Forward without a star, the gate, the fresh try, the record.
  { const pre = L.prerequisitesOf('teen-numbers').slice(-1)[0];
    const nv = [...star(pre, 1, 2), miss('teen-numbers', 3), miss('teen-numbers', 4), L.makeLoopBackEvent('teen-numbers', pre, iso(4).replace('T15', 'T16')), pass(pre, 5), miss('teen-numbers', 6)];
    ok('a never-mastered lesson is not stuck before the ladder has run', L.neverMasteredStuck(nv, 'teen-numbers') === null);
    const nv2 = [...nv, miss('teen-numbers', 7)]; const ns = L.neverMasteredStuck(nv2, 'teen-numbers');
    ok('two misses, a loop back and two more misses on a lesson never mastered is stuck', !!ns && ns.rounds === 4 && ns.loopedTo === pre && L.neverMasteredStuckIds(nv2).includes('teen-numbers'));
    const sn = L.neverStuckSentence(nv2, 'teen-numbers', 'S-77');
    ok('its sentence offers Move Forward and says the lesson stays on the list', /^S-77 cannot seem to master \*Teen Numbers\*\. They have had four rounds at it without a pass and one of those rounds was after looping back to/.test(sn) && /clicking below/.test(sn) && L.actionStuckItems(nv2, 'S-77').some((x) => x.moduleId === 'teen-numbers'));
    const nmv = [...nv2, L.makeMovedForwardEvent('teen-numbers', iso(8))]; const pr = L.deriveProgress(nmv).perModule['teen-numbers'];
    ok('Move Forward on a lesson never mastered gives no star, and it is not stuck any more', pr.mastered === false && pr.movedPast === true && L.neverMasteredStuck(nmv, 'teen-numbers') === null && L.movedPastIds(nmv).includes('teen-numbers'));
    const stOf = (evs) => (L.moduleStatuses(L.deriveProgress(evs), ['teen-numbers', 'adding-to-20']).find((x) => x.id === 'adding-to-20') || {}).status;
    ok('Move Forward opens the next lesson (Adding to 20 comes after Teen Numbers)', stOf(nv2) === 'locked' && stOf(nmv) === 'available');
    ok('a lesson moved past comes back as a fresh-try review three weeks later', L.lightReviewQueue(nmv, iso(30)).some((x) => x.moduleId === 'teen-numbers' && x.stage === 'fresh') && !L.lightReviewQueue(nmv, iso(28)).some((x) => x.moduleId === 'teen-numbers'));
    const fr = L.buildLightReview(nmv, 3, L.lightReviewQueue(nmv, iso(30)).find((x) => x.moduleId === 'teen-numbers'));
    const fclear = [...nmv, L.makeLightReviewEvent(fr, [1, 1, 1, 1, 1].map((c) => ({ correct: !!c })), iso(30), iso(30))];
    ok('a clear fresh try earns the star', L.deriveProgress(fclear).perModule['teen-numbers'].mastered === true);
    const ffail = [...nmv, L.makeLightReviewEvent(fr, [1, 0, 0, 0, 0].map((c) => ({ correct: !!c })), iso(30), iso(30))];
    ok('a missed fresh try leaves the lesson open and comes back again in three weeks', L.deriveProgress(ffail).perModule['teen-numbers'].mastered === false && L.lightReviewState(ffail, 'teen-numbers').stage === 'fresh' && String(L.lightReviewState(ffail, 'teen-numbers').dueAt) > iso(50));
    const hn = L.lightReviewHistory(ffail, 'S-77');
    ok('the history logs the move past and the fresh try, with dates', hn.some((x) => x.kind === 'moved' && /before it was mastered/.test(x.text) && !!x.at) && hn.some((x) => x.kind === 'fail' && /fresh-try practice review/.test(x.text)));
    const cvj = JSON.stringify(L.classView([{ id: 's-77', label: 'S-77', events: nmv }], iso(9)));
    ok('Who Needs Help notes the move past and no longer calls the lesson stuck', /was moved past/.test(cvj) && !/is stuck on \*\*Teen Numbers\*\*/.test(cvj)); }
  ok('a new star after moving forward restarts the schedule like any star', L.lightReviewState([...moved, ...star('teen-numbers', 40, 41)], 'teen-numbers').stage === 'first');
  // Two a day at most, oldest first, offered together at the start of the day and taken back to back (Mikey, passes LI to
  // LM): three lessons starred on one day give two reviews on the day they fall due and the third the next day.
  { const ids = ['teen-numbers', 'adding-to-20', 'subtracting-to-20']; const many = ids.flatMap((id) => star(id, 1, 2));
    const at = (d, h) => iso(d).replace('T15', 'T' + String(h).padStart(2, '0'));
    const q = L.lightReviewQueue(many, at(24, 10)); const day0 = L.lightReviewDay(many, at(24, 10));
    ok('three due: the start-of-day card offers two from the start, oldest first', q.length === 3 && day0.next.length === 2 && day0.next[0].moduleId === q[0].moduleId && day0.next[1].moduleId === q[1].moduleId && day0.done.length === 0);
    const first = L.lightReviewDue(many, at(24, 10)); const r1 = L.buildLightReview(many, 5, first);
    const done1 = [...many, L.makeLightReviewEvent(r1, [1, 1, 1, 1, 1].map((c) => ({ correct: !!c })), at(24, 10), at(24, 10))];
    const second = L.lightReviewDue(done1, at(24, 10));
    ok('the second follows straight after the first, with no lesson round in between', !!second && second.moduleId === q[1].moduleId && second.todayCount === 1);
    const r2 = L.buildLightReview(done1, 6, second);
    const done2 = [...done1, L.makeLightReviewEvent(r2, [1, 1, 1, 1, 1].map((c) => ({ correct: !!c })), at(24, 11), at(24, 11))];
    ok('never a third review in a day', L.lightReviewDue(done2, at(24, 20)) === null && L.lightReviewDay(done2, at(24, 20)).next.length === 0);
    ok('the third comes the next day', (L.lightReviewDue(done2, at(25, 9)) || {}).moduleId === q[2].moduleId);
    const one = star('teen-numbers', 1, 2);
    ok('one due: the card offers just that one', L.lightReviewDay(one, at(24, 10)).next.length === 1);
    ok('a review is offered from the start of its day, not from the hour its three weeks run out', !!L.lightReviewDue(one, at(23, 6)) && L.lightReviewDue(one, at(22, 20)) === null);
    ok('a lesson outside the allowed list does not hold up the queue', (L.lightReviewDue(many, at(24, 10), [q[2].moduleId]) || {}).moduleId === q[2].moduleId); }
  // The memory check favors the probed lessons after a failed review (pass LH): with probe set, most rounds' first check comes from it.
  { const mastered = ['count-to-10', 'making-ten', 'teen-numbers', 'one-more-one-less']; let hits = 0; for (let s = 1; s <= 40; s++) { const a = L.buildAttempt('adding-to-20', s, mastered, { probe: ['making-ten'] }); if (a.review && a.review.moduleId === 'making-ten') hits++; }
    ok('memory checks favor the lessons a failed quick look back probes', hits >= 20); }
  const sClear = L.lightReviewSentences([...events, L.makeLightReviewEvent(review, [1, 1, 1, 1, 1].map((c) => ({ correct: !!c })), iso(23), iso(23))], 'S-77');
  ok('the clear-pass sentence, in Mikey\'s style, names the gap, the score and that no further review is planned', sClear[0] === 'S-77 took a short five-question practice review of *Teen Numbers* three weeks after mastering it, without any warning, and scored five out of five. That lesson is holding, so no further review is planned.');
  const sBare = L.lightReviewSentences([...events, bare], 'S-77');
  ok('the bare-pass sentence names the two kinds of questions missed', /^S-77 took a short practice review of \*Teen Numbers\* and scored three out of five\. They are keeping the idea but it is not yet firm, so another short review comes in a week\. We will start that review with the two kinds of questions S-77 missed, ".+" and ".+"\.$/.test(sBare[0]));
  const sFail = L.lightReviewSentences([...events, L.makeLightReviewEvent(review, [1, 1, 0, 0, 0].map((c) => ({ correct: !!c })), iso(33), iso(33))], 'S-77');
  ok('the fail sentence reads in Mikey\'s words', /^S-77 took a short practice review of \*Teen Numbers\* four weeks after mastering it and scored two out of five\. This prompted us to reopen and reassign the lesson as well as restructure the memory checks in a way that probes S-77's understanding of the prerequisites\. Depending on how this goes, there's a chance of additional lessons reopening\.$/.test(sFail[0]));
  ok('a light review counts toward confidence like a memory check', L.computeConfidence('teen-numbers', [...events, clear]).reviewsAsked === 5);
}

// Groups are compared by counting or matching, never as "the bigger group" (pass MA, from the independent checks: More and Fewer
// said "More means the bigger group" while Big and Small says bigger means taking up more room, which teaches a three-year-old to
// judge how many by space, the error pass JW's rule guards against). Every lesson line, paragraph and key idea, every module
// and long story, and sixty questions of every bank a lesson uses are read; a plate, bowl, pile, basket or jar that is big or
// little and has more counts too (the code check). Pre-K 4's More and Fewer and One, Two, Three still say it and are fixed when the sweep
// reaches them (docs/EARMARKS.md A7); the waiting list may only shrink, and the check fails once a waiting lesson is fixed and
// still listed. Pass ML fixed both, so the list is empty.
{
  const WAITING = new Set([]);
  // The claims themselves (more means the bigger group, the bigger group of berries has more), not every use of the words: grade 1
  // counting on (one count for each one in the smaller group) compares numbers already counted, which is fine.
  const SAYS_BIGGER_GROUP = /\b(bigger|smaller) group( of \w+)? (has|is|had|was) (more|fewer)\b|\b(more|fewer) (means|is) the (bigger|smaller) group\b|\b(big|bigger|larger|little|small|smaller) (group|pile|plate|bowl|basket|jar)s?( of \w+)? (has|have|had) (more|fewer)\b/i;
  const { STORIES: MA_STORIES, COURSE_STORIES: MA_COURSE_STORIES, MASTERY_STORIES: MA_NEXT_STORIES } = await import('../src/stories.mjs');
  const words = (m) => [...(m.lesson.paragraphs || []), m.lesson.keyIdea || '', ...((m.lesson.script || []).map((x) => x.say)), ...((MA_STORIES[m.id] || {}).words || [])].join(' ');
  const bad = new Set();
  for (const m of L.MODULES) {
    if (SAYS_BIGGER_GROUP.test(words(m))) bad.add(m.id);
    for (const g of new Set(m.generators)) for (let s = 1; s <= 60; s++) { const q = L.generateQuestion(g, s * 7919); if (SAYS_BIGGER_GROUP.test(q.explain || '')) bad.add(m.id); }
  }
  // The long stories too (pass KF: a retired idea is searched for in every long story in the same pass).
  for (const [cid, cs] of Object.entries(MA_COURSE_STORIES)) if (SAYS_BIGGER_GROUP.test((cs.words || []).join(' '))) bad.add(`long story of ${cid}`);
  for (const [cid, cs] of Object.entries(MA_NEXT_STORIES)) if (SAYS_BIGGER_GROUP.test((cs.words || []).join(' '))) bad.add(`next long story of ${cid}`);   // pass MH
  const unexpected = [...bad].filter((id) => !WAITING.has(id)); const fixed = [...WAITING].filter((id) => !bad.has(id));
  ok('no lesson or explanation calls the group with more the bigger group (pre-K 4 since pass ML)', unexpected.length === 0 && fixed.length === 0, `new: ${unexpected.join(', ')}; fixed, so take off the list: ${fixed.join(', ')}`);
}

// Words on a gold fill (pass MF, the screen checks: Celebrate! was white on the light theme's gold, 3.24 to 1): onGold is read from
// the theme tokens in src/ui.jsx itself and must reach 4.5 to 1 on gold in both themes, the bar for words of 16 pixels.
{
  const ui = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8');
  const block = (name) => { const at = ui.indexOf(`  ${name}: {`, ui.indexOf('const THEMES = {')); return ui.slice(at, ui.indexOf('\n  },', at)); };
  const hex = (b, key) => ((b.match(new RegExp(`\\b${key}: '(#[0-9A-Fa-f]{6})'`)) || [])[1]);
  const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  const lum = (h) => { const [r, g, b] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b); };
  const ratio = (a, b) => { const x = lum(a); const y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const pairs = ['light', 'dark'].map((t) => { const b = block(t); return { t, gold: hex(b, 'gold'), on: hex(b, 'onGold') }; });
  ok('words on gold (onGold) reach 4.5 to 1 in both themes, read from the theme tokens', pairs.every((p) => p.gold && p.on && ratio(p.gold, p.on) >= 4.5), JSON.stringify(pairs.map((p) => ({ ...p, ratio: p.gold && p.on ? ratio(p.gold, p.on).toFixed(2) : null }))));
  // Q47 (pass MM, Mikey: "B"): red-brown words take clayInk, which reaches 4.5 to 1 on the pale pink strip, the page and white in
  // the light theme, while the dark theme's clayInk is its clay; no style colors a word with clay itself; and the light theme's
  // title shimmer never dips under 3 to 1 on the page, worked out over its whole cycle the way a browser blends it.
  { const lightB = block('light'); const darkB = block('dark'); const ink = hex(lightB, 'clayInk');
    const onLight = ['claySoft', 'bg', 'surface'].map((k) => ratio(ink, hex(lightB, k)));
    ok('Q47: red-brown words (clayInk) reach 4.5 to 1 on the pink strip, the page and white in the light theme, and the dark theme keeps its clay', !!ink && onLight.every((r) => r >= 4.5) && hex(darkB, 'clayInk') === hex(darkB, 'clay') && hex(lightB, 'clay') === '#B9634A', onLight.map((r) => r.toFixed(2)).join(' '));
    const wordClay = ui.split('\n').map((l, i) => [i + 1, l]).filter(([, l]) => /\bcolor: (?:[^,}]*?\? )?[^,}]*?\bC\.clay\b(?!Soft|Ink)/.test(l) || /review: \[C\.claySoft, C\.clay\]/.test(l));
    ok('Q47: no word is colored with clay itself (a color property or the review tag names clayInk)', wordClay.length === 0 && (ui.match(/C\.clayInk/g) || []).length >= 25, wordClay.map(([n]) => n).join(', '));
    const day = (ui.match(/@keyframes edu-rainbow-day \{([^\n]*)\}\s*\n/) || [])[1] || '';
    const stops = [...day.matchAll(/#([0-9A-Fa-f]{6})/g)].map((m) => `#${m[1]}`); const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
    const lumv = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b); const page = lum(hex(lightB, 'bg')); let low = 99;
    for (let i = 0; i + 1 < stops.length; i++) { const a = rgb(stops[i]); const b = rgb(stops[i + 1]); for (let t = 0; t <= 1.0001; t += 0.02) { const c = a.map((v, k) => v + (b[k] - v) * t); const x = lumv(c); low = Math.min(low, (Math.max(x, page) + 0.05) / (Math.min(x, page) + 0.05)); } }
    ok('Q47: the light theme\'s title shimmer stays at 3 to 1 or better on the page at every moment of its cycle, and only the light theme takes it', stops.length === 6 && low >= 3 && /html:not\(\[data-theme="dark"\]\) \.edu-rainbow \{ animation-name: edu-rainbow-day; \}/.test(ui), `${stops.join(' ')} lowest ${low.toFixed(2)}`); }
}

// Pass MO (round one's screen check): More right answers holds right answers and true examples of the same idea, never advice on
// how to answer ("Listen for both ideas, and find the one that fits them both."; "Big is not the same as more, so count to be
// sure."; "Think about what your friend likes."), since the heading promises answers.
// Since round two's lesson check it reads a method told as a line too ("Line the groups up, one with one, ..."; "so look at the
// face and the color too").
// Since round two's code check it reads a few more forms ("Look closely before you tap."; "Count each one."; saying the steps to
// yourself), while "keep your hands to yourself", a right answer, still passes.
// Since round three it reads a line that opens with Line ... up in any words (round two's `Line (?:the|them) up` missed "Line the
// groups up", the very line it was added for, and round three's proof showed it), Look at, Lay or Stand (the size kinds' methods,
// "Lay two crayons side by side ..." and "Stand back to back ...").
// Since round four it reads any line that opens with a way of working, Line, Count, Put, Match, Pair, Compare, Check, Try, Find or
// Start, so the next form is caught before a reader has to find it ("Count the dots one by one."; "Put the two side by side."); no
// line in the app opens so today. Since round five's code check Point, Touch, Use, Slide, Move and Tap too, since "Point to each dot
// as you count.", "Touch each dot and say its number." and "Use your finger to count each one." had passed.
{ const ADVICE = /^(?:Listen (?:to|for) (?:both|all)|Think about|Remember to|Keep (?:them|it) |Line\b|Count\b|Look closely|Look at\b|Lay\b|Stand\b|Put\b|Match\b|Pair\b|Compare\b|Check\b|Try\b|Find\b|Start\b|Point\b|Touch\b|Use\b|Slide\b|Move\b|Tap\b)|to be sure|keep them both in your mind|\bso look at\b|before you tap|\bsay (?:it|them|the steps) to yourself\b|\blook closely\b/i; const bad = new Set();
  for (const id of Object.keys(L.GENERATORS)) for (let s = 1; s <= 60; s++) { let q; try { q = L.generateQuestion(id, s); } catch (e) { break; } for (const m of q.alsoRight || []) if (ADVICE.test(m)) bad.add(`${id}: ${m}`); }
  ok('no More right answers line is advice on how to answer', bad.size === 0, [...bad].join(' | '));
  for (const t of ['Count the dots one by one.', 'Put the two side by side, and the longer one reaches farther.', 'Line them up.', 'Match each dot with one star.', 'Point to each dot as you count.', 'Touch each dot and say its number.', 'Use your finger to count each one.'])
    ok(`the advice pattern reads a way of working: ${t}`, ADVICE.test(t));
  for (const t of ['keep your hands to yourself', 'Hold up two fingers, one, two.', 'A big blue square fits both ideas too.']) ok(`the advice pattern passes a right answer: ${t}`, !ADVICE.test(t));
}
// More right answers under a question about one feeling (pass MO, round four): round three replaced a line there that said what to
// do ("You can both go down the little slide, one after the other.") and round four two more ("You can stay with your friend and say,
// it is okay."; "You can ask your friend if he is okay."), each found by reading, and a scan then found five more, morals and a
// comfort ("Bringing a block for the tower is kind."; "Everyone makes mistakes like that sometimes."). A line there is another right
// answer or a true example of the same feeling: it names that feeling or one of the lessons' signs of it, and never says what to do;
// How do friends feel?'s different-likes kind teaches that friends feel differently about one thing, so its lines may name two
// feelings or the word different, and Can I play too?'s face rows may name the other feeling its lesson says the moment can bring ("It
// can make your friends sad or mad."); and under "Is it okay to feel X?" a line names X, its signs or every feeling. A question is
// about one feeling when its answer is a feeling (an "I feel X" too) and its prompt asks how someone feels, names that feeling or
// shows that face ("Tap the friend who might need help." asks about needing help). Since round five's content read the check is
// stricter: it passed a planted "You can ask your embarrassed friend if he is okay.", an offered wrong feeling and an unfitting one,
// and never read "When your face looks like this, what can you say?", whose lines named the wrong choice ("You can say the name of
// other feelings too, like I feel mad or I feel scared." over a sad face whose wrong choice was I feel mad).
// Since round six (pass MO) the More right answers checks below are one function, moreRightProblems(L), run on the app and on the
// checks' own planted near misses just after them, so a check narrowed later still catches what it was made for.
const moreRightProblems = (L) => { const r = {};
{ const FEELINGS = ['happy', 'sad', 'mad', 'scared', 'worried', 'embarrassed'];
  const SIGNS = { happy: /\bsmil|\bjump|\bclap|\bhigh five/i, sad: /\btears?\b|\bcr(?:y|ies|ying)\b|mouth (?:may )?turns? down|\bwants? a hug\b/i,
    mad: /\bhot\b|tight fists|\bstomp|eyebrows (?:may )?squeeze/i, scared: /heart (?:beat|beats|beating)|\bhide\b|eyes (?:may )?open wide|wide-open eyes|hold(?:ing)? on tight/i,
    worried: /wiggly mouth|eyebrows that go up/i, embarrassed: /pink cheeks|cheeks (?:can|may) turn pink|eyes that look down|hide (?:your|his|her) face/i };
  // Since round five's code check the other fair feeling is the lesson's own pair, sad or mad, and a different-likes line says feel or
  // like different (a planted "helps nobody feel worried." and "different turns on the little slide." had passed). Since round six's
  // code check feel or like and different in any order ("Your friend likes different things than you do." had failed), and what to
  // do with could or should, Give, Help and Hold too ("Give your sad friend a hug." had passed); "can be" and "can have" are fair.
  const TWO = new Set(['p4-friend-feels']); const OTHER_FAIR = new Set(['p3-join-face']); const PAIRED = { sad: ['mad'], mad: ['sad'] };
  // Since round six's content read what to do is read in any opening (round five's pattern held only the removed lines' words: "Ask a
  // sad friend if they are okay." and "When you feel worried, tell your grown-up." passed), and "You can say, I feel X" is a right
  // answer under "what can you say?". "What might you do when you feel X?" is read too: its lines name that feeling's own signs, the
  // lesson's acts and looks, never what to do ("You can choose a kind way and say, I feel mad." sat under it).
  const DOES = /^(?:(?:He|She|You|They) (?:can|could|should) (?!feel\b|be\b|have\b)|(?:Ask|Tell|Use|Find|Get|Take|Say|Bring|Sit|Give|Hug|Help|Hold|Breathe|Keep|Play|Go|Share)\b|When [^,]+, (?:(?:you|he|she|they) (?:can|could|should) (?!feel\b|be\b|have\b)|(?:ask|tell|use|find|get|take|say|bring|sit|give|hug|help|hold|breathe|keep|play|go|share)\b))|\b(?:grown-up|teacher) can help\b|\bkind\b/i;
  const CALMING = /\bkind way\b|\buse (?:your|her|his|their) words\b|\bslow breath\b|\bcount(?:ing)? to\b/i;
  // Since round seven's content read a line opens with who or what it is about (read again after a When or At clause), never with a
  // verb that tells the child what to do in words the list above lacks ("Talk to your grown-up when you feel worried." had passed),
  // and a grown-up or teacher who helps is a comfort, not the feeling ("Your grown-up is there to help when you feel worried.").
  const SUBJECT = /^(?:You|Your|He|His|She|Her|They|Their|A|An|The|Every|Everyone|Friends?|Two|Mad|Sad|Scared|Happy|Worried|Embarrassed|Wide-open|Tight|[A-Z][a-z]+ing)\b/;
  const opensWith = (m) => { const h = m.replace(/^(?:When|At) [^,]+, /, ''); return SUBJECT.test(h.charAt(0).toUpperCase() + h.slice(1)); };
  const COMFORT = /\b(?:grown-ups?|teachers?)\b[^.]*\bhelps?\b|\bhelps?\b[^.]*\b(?:grown-ups?|teachers?)\b/i;
  const strip = (x) => String(x || '').replace(/^face:|^I feel /i, '').toLowerCase();
  const bad = new Set(); let read = 0;
  for (const id of Object.keys(L.GENERATORS)) for (let s = 1; s <= 120; s++) { let q; try { q = L.generateQuestion(id, s); } catch (e) { break; }
    const more = q.alsoRight || []; if (!more.length) continue;
    const a = strip(q.answer); const okay = /^Is it okay to feel (\w+)\?$/.exec(q.prompt || ''); const mightDo = /^What might (?:you|your friend) do when (?:you|he|she|they) feels? (\w+)\?$/i.exec(q.prompt || '');
    const shown = !!q.visual && q.visual.kind === 'face' && q.visual.feeling === a;
    const asks = FEELINGS.includes(a) && (/\bfeel\b/i.test(q.prompt || '') || new RegExp(`\\b${a}\\b`, 'i').test(q.prompt || '') || shown);
    const feel = okay ? okay[1].toLowerCase() : mightDo ? mightDo[1].toLowerCase() : asks ? a : null; if (!feel || !SIGNS[feel]) continue; read += 1;
    const offered = (q.choices || []).map(strip);
    for (const m of more) { const named = FEELINGS.filter((f) => new RegExp(`\\b${f}\\b`, 'i').test(m));
      const wrongNamed = !TWO.has(id) && named.some((f) => f !== feel && offered.includes(f));
      const about = named.includes(feel) || SIGNS[feel].test(m) || (okay && /\bevery feeling\b/i.test(m))
        || (OTHER_FAIR.has(id) && named.some((f) => (PAIRED[feel] || []).includes(f) && !offered.includes(f))) || (TWO.has(id) && (named.length >= 2 || /\b(?:feels?|likes?)\b[^.]*\bdifferent\b/i.test(m)));
      const saysIt = /\bcan you say\b/i.test(q.prompt || '') && new RegExp(`^You can (?:also )?say, I feel ${feel}\\b`, 'i').test(m);
      if (!opensWith(m) || COMFORT.test(m) || (mightDo ? (!SIGNS[feel].test(m) || CALMING.test(m)) : ((DOES.test(m) && !saysIt) || wrongNamed || !about))) bad.add(`${id}: ${q.prompt} | ${m}`); } }
  r.feeling = { bad, read }; }
// Round five's content read (pass MO): under a question that asks what to say, a line says something, and under one that asks what to
// bring, it brings something ("What is a kind thing to say when your friend looks sad?" had "You can sit beside your friend, too.",
// and "What can you say when you want to play with your friends?" "You can bring something for the game, ..."); a question whose
// answer is a feeling's name is the check above's. And under a yes or no about an act, a No is never answered with the kind act in its
// place or what to do, nor "Is it okay when ...?" with what to do ("Is it kind to knock down your friends' tower?" had "Bringing a
// block for the tower is kind.", the moral round four took off the face row; the lesson pairs them, "Grabbing your friends' blocks is
// not kind, and knocking down their tower is not kind.", so a No gives another act that is not kind).
// Since round six's content read: what she, he or they can say, and what you can ask, are read; a line under what to say says, asks or
// tells something, never only the word words or says ("Kind words help friends feel happy." passed on words); a thing brought is
// never one not to bring; under a No the kind, fair, good or right act in any words ("Taking turns with the ball is fair." passed),
// "Is it okay if" and "is a ball a good thing to bring?" read too; and under a Yes about an act, never an act that is not kind.
{ const KIND_INSTEAD = /(?<!because )\byou can\b|\bis (?:a |the )?(?:kind|fair|good|right)\b|\bkinder\b|\bcan help\b|\bshows you care\b|\binstead\b|^(?:Take|Get|Ask|Say|Play|Bring|Share|Find|Use|Listen|Wait|Sit)\b/i; const askBad = new Set(); const noBad = new Set(); const yesBad = new Set(); let asked = 0; let noRead = 0; let yesRead = 0;
  for (const id of Object.keys(L.GENERATORS)) for (let s = 1; s <= 120; s++) { let q; try { q = L.generateQuestion(id, s); } catch (e) { break; }
    const p = q.prompt || ''; const more = q.alsoRight || []; if (!more.length) continue;
    const yesNo = /^(?:Yes|No)$/.test(String(q.answer));
    // Since round six's code check what anyone named can say or ask, and do or should too ("What can Ana say?").
    const sayQ = !yesNo && (/\b(?:kind thing to say|(?:can|could|do|should) (?:you|she|he|they) say)\b/i.test(p) || /\b(?:can|could|do|should) [A-Z][a-z]+ say\b/.test(p)) && !/^I feel /.test(String(q.answer));
    const askQ = !yesNo && (/\b(?:can|could|do|should) (?:you|she|he|they) ask\b/i.test(p) || /\b(?:can|could|do|should) [A-Z][a-z]+ ask\b/.test(p));
    const bringQ = !yesNo && /\bcan you bring\b/i.test(p);
    // Since round seven's content read a said form, the verb then a comma or the words a saying goes on with ("A hug can say you care,
    // too." passed on say), and a thing brought is never the question's own wrong choice ("You can bring a ball for the tower, too.").
    if (sayQ || askQ || bringQ) { asked += 1; for (const m of more) if ((sayQ && !/\b(?:say|saying|ask|asks|asking|tell|tells|telling)\b(?:,| (?:if|to|for|please|thank|sorry|hi|good|your|friends?)\b)/i.test(m)) || (askQ && !/\bask(?:s|ing)?\b(?:,| (?:if|to|for|friends?|your)\b)|\bplease\b|\bcan (?:I|you|we)\b/i.test(m)) || (bringQ && ((q.choices || []).filter((c) => c !== q.answer).some((c) => new RegExp(`\\b${String(c).replace(/^(?:icon|pic):/, '')}s?\\b`, 'i').test(m)) || !/\bbring (?:a|an|the|some|your)\b|\bgood thing to bring\b/i.test(m) || /\b(?:not|never)\b/i.test(m)))) askBad.add(`${id}: ${p} | ${m}`); }
    const ACT = /^(?:Is it (?:kind|okay|fair) (?:to|if)|Is it playing together if|Should you get a grown-up|Do you need a grown-up)\b|\bis an? [\w ]+ a good thing to\b/;
    const noAct = q.answer === 'No' && ACT.test(p);
    // Since round seven's content read a Yes's line names nothing unkind, unfair or that makes a friend sad in other words either
    // ("Grabbing their blocks is unkind." passed), and a No's line has no so or but clause, where the kind act comes back ("Hitting is
    // not okay either, so take turns with the ball.").
    if (q.answer === 'Yes' && ACT.test(p)) { yesRead += 1; for (const m of more) if (/\bnot (?:kind|okay|fair)\b|\bun(?:kind|fair)\b|\bmakes? (?:your |a |the )?(?:friends?|someone)(?: feel)? (?:sad|mad|scared)\b|\bcan make (?:your |a |the )?(?:friends?|someone)(?: feel)? (?:sad|mad|scared)\b/i.test(m)) yesBad.add(`${id}: ${p} | ${m}`); }
    const okayWhen = /^Is it okay when\b/.test(p);
    // Since round six's code check a No is answered with another act that is not kind, okay or fair, or a time you do not need a
    // grown-up, the way the lessons pair them, not only by a line free of kind words ("would be kind." passed).
    const NOT_KIND = /\b(?:is|are) not (?:a )?(?:kind|okay|fair)\b|\bdo not need\b/i;
    if (noAct || okayWhen) { noRead += 1; for (const m of more) if (KIND_INSTEAD.test(m) || (noAct && (!NOT_KIND.test(m) || /\b(?:so|but)\b/i.test(m)))) noBad.add(`${id}: ${p} | ${m}`); } }
  r.say = { bad: askBad, read: asked }; r.no = { bad: noBad, read: noRead }; r.yes = { bad: yesBad, read: yesRead }; }
// Round six's content read (pass MO): three more families no check read. Under a question that asks what you can do, say, ask or
// bring, a line answers it, never only with a reason why ("Listening to a friend's idea can make your friend happy." sat under "What
// can you do when your friend has an idea for the game?"); under a question that asks who, a line names a person ("A hug from your
// grown-up can help, too." sat under "Who can you get when a feeling is very big?"); and under "Tap the friend who ...", a line never
// says what to do.
{ const REASON = /\b(?:can make|makes?|helps?) (?:your |a |the )?(?:friends?|everyone)(?: feel)? (?:happy|sad|mad|scared|worried|embarrassed|better|worse)\b/i;
  // Since round seven's content read the good choice, what is fair, whose turn it is, what can help and how a grown-up can help are
  // read too, and a reason is read in two
  // more forms: one whose subject is the answer's own act ("Listening shows your friend you care." under Listen to the idea), and
  // one that says what it lets you do ("Taking turns lets you both get to play." under whose turn it is).
  const WHAT = /\b(?:what|how) (?:kind thing )?(?:else )?can (?:you|she|he|they)\b|\bkind thing to (?:say|do)\b|\bgood choice\b|\bwhat is fair\b|\bwhose turn\b|\bwhat can help\b|\bhow can (?:a |your )?(?:grown-up|teacher) help\b/i;
  const LETS = /\blets? (?:you|everyone|both|each|your friends?)\b/i;
  const PERSON = /^(?:(?:A|An|The|Your|Another) )?(?:[a-z-]+ )?(?:grown-ups?|teachers?|mail carriers?|firefighters?|doctors?|police officers?|nurses?|friends?|moms?|dads?|parents?|helpers?|grandmas?|grandpas?)\b/i;
  const DOES = /^(?:(?:He|She|You|They) (?:can|could|should) (?!feel\b|be\b|have\b)|(?:Ask|Tell|Use|Find|Get|Take|Say|Bring|Sit|Give|Hug|Help|Hold|Breathe|Keep|Play|Go|Share)\b|When [^,]+, (?:(?:you|he|she|they) (?:can|could|should) (?!feel\b|be\b|have\b)|(?:ask|tell|use|find|get|take|say|bring|sit|give|hug|help|hold|breathe|keep|play|go|share)\b))|\b(?:grown-up|teacher) can help\b|\bkind\b/i;
  const whyBad = new Set(); const whoBad = new Set(); const tapBad = new Set(); let whatRead = 0; let whoRead = 0; let tapRead = 0;
  for (const id of Object.keys(L.GENERATORS)) for (let s = 1; s <= 120; s++) { let q; try { q = L.generateQuestion(id, s); } catch (e) { break; }
    const p = q.prompt || ''; const more = q.alsoRight || []; if (!more.length) continue; const yesNo = /^(?:Yes|No)$/.test(String(q.answer));
    if (!yesNo && WHAT.test(p)) { whatRead += 1; const ger = (() => { const w = String(q.answer).split(/[ ,]/)[0]; if (!/^[A-Z][a-z]+$/.test(w)) return null; const g = /[^aeiou][aeiou][bdgmnpt]$/.test(w.toLowerCase()) && !/^(?:Listen|Visit|Open)$/.test(w) ? w + w.slice(-1) + 'ing' : w.replace(/e$/, '') + 'ing'; return g; })();
      for (const m of more) if (REASON.test(m) || LETS.test(m) || (ger && new RegExp(`^${ger}\\b[^.]*\\b(?:can make|makes?|helps?|shows?|lets?|is (?:kind|fair|good))\\b`).test(m))) whyBad.add(`${id}: ${p} | ${m}`); }
    if (/(?:^|\. )Who\b[^.?]*\?$/.test(p)) { whoRead += 1; for (const m of more) if (!PERSON.test(m)) whoBad.add(`${id}: ${p} | ${m}`); }
    // Since round seven's content read a Tap the friend who line opens with who it is about ("Stay with a sad friend, and say, it is
    // okay." passed).
    if (/^Tap the friend who\b/.test(p)) { tapRead += 1; for (const m of more) if (DOES.test(m) || !/^(?:A|An|The|Your|Her|His|Their|He|She|They|Friends?)\b/.test(m)) tapBad.add(`${id}: ${p} | ${m}`); } }
  r.why = { bad: whyBad, read: whatRead }; r.who = { bad: whoBad, read: whoRead }; r.tap = { bad: tapBad, read: tapRead }; }
  return r; };
{ const live = moreRightProblems(L); const show = (c) => `${c.read} questions read; ${[...c.bad].join(' | ')}`;
  ok('every More right answers line under a question about one feeling names that feeling, its signs or another fair one', live.feeling.bad.size === 0 && live.feeling.read > 500, show(live.feeling));
  ok('every More right answers line under a question that asks what to say, ask or bring says, asks or brings something', live.say.bad.size === 0 && live.say.read > 20, show(live.say));
  ok('a No about an act is never answered under More right answers with the kind act in its place or what to do', live.no.bad.size === 0 && live.no.read > 20, show(live.no));
  ok('a Yes about an act is never answered under More right answers with an act that is not kind or okay', live.yes.bad.size === 0 && live.yes.read > 20, show(live.yes));
  ok('a More right answers line under what you can do, say, ask or bring answers it, never only with a reason why', live.why.bad.size === 0 && live.why.read > 100, show(live.why));
  ok('a More right answers line under a question that asks who names a person', live.who.bad.size === 0 && live.who.read > 50, show(live.who));
  ok('a More right answers line under "Tap the friend who" never says what to do', live.tap.bad.size === 0 && live.tap.read > 20, show(live.tap));
  // The checks' own near misses (round six): each line is added under the questions whose prompt its pattern matches, and a check
  // must fail every line marked catch and pass every line marked keep. The catch lines are the readers' finds in other words (round
  // four's "Ask a sad friend if they are okay.", round five's "When you feel worried, tell your grown-up."); the keep lines are fair
  // ones a check once failed or could fail ("You can feel worried ...", "You can say, I feel mad, and tell what is wrong.").
  const PLANTS = [
    ['p4-feel-say', /crayon/, 'You can say, I feel mad, and tell what is wrong.', 'keep'],
    ['p4-new-feeling-moment', /doctor/, 'You can feel worried on the first day at a new school, too.', 'keep'],
    ['p3-feel-okay', /feel scared\?/, 'Everyone feels scared sometimes, and that is okay.', 'keep'],
    ['p3-help-who', /looks sad/, 'Ask a sad friend if they are okay.', 'catch'],
    ['p4-feel-say', /grabs your toy/, 'When you feel mad, use your words.', 'catch'],
    ['p4-new-feeling-moment', /new school/, 'Your grown-up can help when you feel worried.', 'catch'],
    ['p3-feel-calm', /looks like this/, 'When you feel scared, sad or mad, find your grown-up for a hug.', 'catch'],
    ['p4-friends-yesno', /feel worried\?/, 'When you feel worried, tell your grown-up.', 'catch'],
    ['p3-join-face', /knocks down/, 'Being kind keeps your friends from feeling sad.', 'catch'],
    ['p3-help-kind', /friend is crying/, 'Kind words help a crying friend feel better.', 'catch'],
    ['p4-kind-words', /looks sad/, 'A smile says you care, too.', 'catch'],
    ['p3-join-how', /can you bring/, 'Do not bring a ball, which can knock the tower down.', 'catch'],
    ['p3-help-ball', /tries to grab/, 'Keep your hands to yourself, and use your words.', 'catch'],
    ['p4-play-start', /Ana wants/, 'She can wave and give a high five.', 'catch'],
    ['p4-play-start', /can you ask about the game/, 'You can wave, too.', 'catch'],
    ['p3-join-yesno', /knock down your/, 'Bringing a block for the tower is the kind thing to do.', 'catch'],
    ['p4-play-yesno', /grab a new friend/, 'Ask to play instead.', 'catch'],
    ['p3-help-yesno', /push when you both/, 'Taking turns with the ball is fair.', 'catch'],
    ['p4-good-yesno', /only you choose/, 'Taking turns choosing is fair.', 'catch'],
    ['p3-join-yesno', /say, not now/, 'Play something else, and ask again later.', 'catch'],
    ['p3-join-yesno', /a ball a good thing/, 'A block is the right thing to bring instead.', 'catch'],
    ['p3-join-yesno', /can I play too\?$/, 'Grabbing their blocks is not kind.', 'catch'],
    ['p4-feel-calm', /Who can you get/, 'A slow breath can help, too.', 'catch'],
    ['p3-help-who', /might need help/, 'You can bring a teddy to hug.', 'catch'],
    ['p4-feel-does', /you feel mad/, 'You can say sorry, too.', 'catch'],
    ['p3-help-grownup', /falls down/, 'You can sit beside your friend.', 'catch'],
    ['p4-feel-does', /you feel happy/, 'You can share a happy feeling with a high five, too.', 'keep'],
    ['p4-feel-does', /she feels mad/, 'She can take a slow breath until she feels calm.', 'catch'],
    ['p4-feel-does', /he feels sad/, 'He might want a hug, too.', 'keep'],
    ['p4-play-start', /tower\?$/, 'Kind words can make your friend happy.', 'catch'],
    ['p4-play-plan', /ask your friend for a block/, 'You can say, please pass me a block.', 'keep'],
    ['p4-play-start', /ask about the game/, 'You can say, what a tall tower!', 'catch'],
    ['p3-join-yesno', /a ball a good thing/, 'Bring a block instead.', 'catch'],
    ['p4-good-yesno', /it is okay, I spill too/, 'Laughing at a friend is not kind.', 'catch'],
    ['p3-help-grownup', /falls down/, 'A teacher is a grown-up who can help, and so is your grown-up at home.', 'keep'],
    ['pk-helper-where', /fire station/, 'A firefighter puts out fires and helps keep people safe.', 'keep'],
    ['p3-help-who', /looks sad/, 'Sit beside a sad friend.', 'catch'],
    ['p4-new-feeling-moment', /falls down in front of the class/, 'Ask your embarrassed friend if he is okay.', 'catch'],
    ['p3-help-who', /looks sad/, 'Give your sad friend a hug.', 'catch'],
    ['p4-friend-feels', /./, 'Your friend likes different things than you do.', 'keep'],
    ['p4-friend-feels', /./, 'Two friends can feel two different ways about one slide.', 'keep'],
    ['p4-friend-feels', /./, 'You can take different turns on the little slide.', 'catch'],
    ['p4-kind-words', /looks sad/, 'Saying, I am here for you, is kind too.', 'keep'],
    ['p3-join-how', /can you bring/, 'You can ask your friends if you can play too as you bring it.', 'catch'],
    ['p3-join-yesno', /knock down your/, 'You could help build the tower.', 'catch'],
    ['p3-join-yesno', /knock down your/, 'Building the tower together would be kind.', 'catch'],
    ['p4-feel-okay', /throw a toy/, 'Hitting is not okay either, because you can hurt someone.', 'keep'],
    ['p4-friends-yesno', /feel worried\?/, 'Talk to your grown-up when you feel worried.', 'catch'],
    ['p4-new-feeling-moment', /new school/, 'Your grown-up is there to help when you feel worried.', 'catch'],
    ['p4-new-feeling-moment', /new school/, 'Let your teacher know when you feel worried.', 'catch'],
    ['p3-help-who', /looks sad/, 'Stay with a sad friend, and say, it is okay.', 'catch'],
    ['p3-help-who', /looks sad/, 'Smile at a sad friend.', 'catch'],
    ['p3-help-who', /might need help/, 'Stay beside the friend who needs help.', 'catch'],
    ['p3-feel-okay', /^Is it okay to feel mad\?$/, 'Stop and breathe when you feel mad, and that is okay.', 'catch'],
    ['p4-feel-does', /you feel mad/, 'When your eyebrows squeeze down, find your grown-up.', 'catch'],
    ['p4-feel-does', /you feel scared/, 'When you want to hide, ask your grown-up for a hug.', 'catch'],
    ['p4-kind-words', /looks sad/, 'A hug can say you care, too.', 'catch'],
    ['p4-play-start', /tower\?$/, 'Saying kind words shows you care.', 'catch'],
    ['p4-play-start', /ask about the game/, 'Asking about the game shows you care.', 'catch'],
    ['p3-join-how', /can you bring/, 'You can bring a ball for the tower, too.', 'catch'],
    ['p3-help-yesno', /push when you both/, 'Hitting is not okay either, so take turns with the ball.', 'catch'],
    ['p3-join-yesno', /knock down your/, 'Grabbing blocks is not kind, but building together is.', 'catch'],
    ['p3-join-yesno', /can I play too\?$/, 'Grabbing their blocks is unkind.', 'catch'],
    ['p3-join-yesno', /can I play too\?$/, 'Grabbing their blocks can make your friends sad.', 'catch'],
    ['p3-join-how', /idea for the game/, 'Listening to an idea can make your friend feel good.', 'catch'],
    ['p3-join-how', /idea for the game/, 'Listening shows your friend you care.', 'catch'],
    ['p3-join-how', /idea for the game/, 'Listening to a friend\'s idea can make a new friend happy.', 'catch'],
    ['p4-feel-does', /you feel mad/, 'You might make tight fists, too.', 'keep'],
    ['p3-feel-okay', /^Is it okay to feel mad\?$/, 'You might feel mad when someone grabs your toy, and that is okay.', 'keep'],
    ['p4-feel-okay', /throw a toy/, 'Pushing is not okay either, because it can hurt your friend.', 'keep'],
    ['p3-join-turn', /whose turn/, 'Taking turns lets you both get to play.', 'catch'],
  ];
  const ids = new Set(PLANTS.map(([g]) => g)); const placed = new Map(PLANTS.map(([, , line]) => [line, 0]));
  const planted = moreRightProblems({ GENERATORS: Object.fromEntries(Object.entries(L.GENERATORS).filter(([id]) => ids.has(id))),
    generateQuestion: (id, s) => { const q = L.generateQuestion(id, s); const add = PLANTS.filter(([g, re]) => g === id && re.test(q.prompt || '')).map(([, , line]) => line);
      for (const line of add) placed.set(line, placed.get(line) + 1); return add.length ? { ...q, alsoRight: [...(q.alsoRight || []), ...add] } : q; } });
  const flagged = (line) => Object.values(planted).some((c) => [...c.bad].some((b) => b.endsWith(`| ${line}`)));
  const wrong = PLANTS.filter(([, , line, want]) => !placed.get(line) || flagged(line) !== (want === 'catch'));
  ok(`the More right answers checks catch every planted near miss and pass every fair line (${PLANTS.length} lines, each planted)`, wrong.length === 0, wrong.map(([g, , line, want]) => `${want} ${g} (${placed.get(line)} planted): ${line}`).join(' | ')); }
// A listener's body is never a fixed rule (pass KD: Truesdale, who named whole body listening, calls it a tool, not a rule, and wrote
// that its eye-contact part should be changed or dropped for autistic children; Social Thinking teaches listening with brain and
// body). Pass KF found the old rule in I wonder, and round three's alignment read (pass MO) in grade 3's Listening and asking, its
// story, its course's long story and two picture rows, so a check reads every line of the content and the picture ledger for it
// (a comment that tells the history is skipped).
{ const RULE = /\beyes (?:are |stay )?on the (?:speaker|person|teacher)\b|\bevery eye on\b|\byour eyes look at the person\b/i; const bad = [];
  for (const f of ['src/logic.mjs', 'src/stories.mjs', 'docs/ART-REQUESTS.md']) readFileSync(new URL('../' + f, import.meta.url), 'utf8').split('\n').forEach((line, i) => { if (!/^\s*\/\//.test(line) && RULE.test(line)) bad.push(`${f}:${i + 1}`); });
  ok('no lesson, question, story or picture prompt teaches eyes on the speaker as listening', bad.length === 0, bad.join(', ')); }
// Pass MO (round one's screen check): the rabbit's outline reads 3 to 1 or better on white, on every name picture's tint, and on
// the dark theme's paper and tiles (the brown #8C7A5B read 2.9 on the lilac and berry tints).
{ const ui = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8');
  const fur = (ui.match(/const fur = \{ stroke: '(#[0-9A-Fa-f]{6})'/) || [])[1];
  const dark = ui.slice(ui.indexOf("mode: 'dark'"), ui.indexOf('\n  },', ui.indexOf("mode: 'dark'")));
  const tone = (key) => (dark.match(new RegExp(`\\b${key}: '(#[0-9A-Fa-f]{6})'`)) || [])[1];
  const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  const lum = (h) => { const [r, g, b] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b); };
  const ratio = (a, b) => { const x = lum(a); const y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const grounds = [['white', '#FFFFFF'], ...L.TINTS.map((t) => [t.id, t.color]), ['dark paper', tone('paperBoard')], ['dark tile', tone('surface')]];
  const low = fur ? grounds.map(([k, g]) => [k, g ? +ratio(fur, g).toFixed(2) : 0]).filter(([, r]) => r < 3) : [['no outline found', 0]];
  ok('the rabbit\'s outline reads 3 to 1 or better on white, on every name picture\'s tint and on the dark theme\'s paper and tiles', grounds.length === 9 && low.length === 0, JSON.stringify(low));
  // Pass MQ (Mikey's answer to Q62, "Q62 - A"): the duck and the bee wear a deeper-gold outline, read the same way, on the duck's
  // body and head and the bee's body and both wings; Q56's #9C7A14 and a drawing with no outline fail the same reading.
  const lowFor = (c) => (c ? grounds.map(([k, g]) => [k, g ? +ratio(c, g).toFixed(2) : 0]).filter(([, r]) => r < 3) : [['no outline found', 0]]);
  const gild = (ui.match(/const gild = \{ stroke: '(#[0-9A-Fa-f]{6})'/) || [])[1];
  const animal = (name) => (ui.match(new RegExp(`\\n\\s+${name}: <g>(.*)\\n`)) || [])[1] || '';
  // Counted on the shapes the label names, by their fills (round two's code read, pass MQ: counting the outline anywhere on the line
  // let the head's outline move to the beak, or a wing's to a stripe): the duck's body and head, the bee's body and its two wings.
  const on = (line, fill) => (line.match(new RegExp(`fill="${fill}" \\{\\.\\.\\.gild\\}`, 'g')) || []).length;
  const worn = { duckBodyHead: on(animal('duck'), '#F0D45C'), beeBody: on(animal('bee'), '#E2B83A'), beeWings: on(animal('bee'), '#DCE9F5') };
  const nearMisses = [lowFor('#9C7A14').length > 0, lowFor(null).length > 0];
  // The coat's, the hat's and the cactus' fills (pass MQ, p45 and round three's screen read): the dark theme's lighter fills read 3 to 1
  // or better on its answer tile, the light theme's on the dark theme's light paper, where lesson and More Info pictures sit (p45 had
  // lightened them there too, the cactus to 2.93 and the hat's crown to 2.43); IconPic lightens only on a tile, and an answer's tile
  // asks for it; and the rain's deeper grey and blue on that paper read 3 to 1 or better (2.54 and 2.96 before).
  // Since round five's code read, on a resting, a right (greenSoft) and a wrong (claySoft) tile.
  { const pairs = [...ui.matchAll(/\{dk \? '(#[0-9A-Fa-f]{6})' : '(#[0-9A-Fa-f]{6})'\}/g)].map((m) => ({ dark: m[1], light: m[2] }));
    const tileLow = pairs.filter((p) => ['surface', 'greenSoft', 'claySoft'].some((k) => ratio(p.dark, tone(k)) < 3)); const paperLow = pairs.filter((p) => ratio(p.light, tone('paperBoard')) < 3);
    const gated = /const dk = C\.mode === 'dark' && tile; const dkPaper = C\.mode === 'dark' && !tile;/.test(ui) && /\/\^icon:\/\.test\(c\) \? <IconPic name=\{c\.slice\(5\)\} size=\{Math\.round\(64 \* k\)\} tile=\{!paper\} \/>/.test(ui);
    const rain = ui.match(/rain: <g>[^\n]*stroke=\{dkPaper \? '(#[0-9A-Fa-f]{6})' : grey\}[^\n]*stroke=\{dkPaper \? '(#[0-9A-Fa-f]{6})' : blue\}/) || [];
    const rainOk = rain.length === 3 && ratio(rain[1], tone('paperBoard')) >= 3 && ratio(rain[2], tone('paperBoard')) >= 3;
    // The cloud and the snow draw the rain's cloud, and take its colors on the dark paper (round five's code read).
    const cloud = ui.match(/\n\s+cloud: <path[^\n]*stroke=\{dkPaper \? '(#[0-9A-Fa-f]{6})' : grey\}/) || []; const snow = ui.match(/\n\s+snow: <g>[^\n]*stroke=\{dkPaper \? '(#[0-9A-Fa-f]{6})' : grey\}[^\n]*stroke=\{dkPaper \? '(#[0-9A-Fa-f]{6})' : blue\}/) || [];
    const twinsOk = cloud.length === 2 && snow.length === 3 && cloud[1] === rain[1] && snow[1] === rain[1] && snow[2] === rain[2];
    ok('the coat, the hat and the cactus read 3 to 1 or better on the dark theme\'s answer tiles and on its light paper, lightened on a tile alone (on a resting, a right and a wrong tile), and the rain, the cloud and the snow on that paper too (pass MQ, rounds three and five)', pairs.length >= 4 && tileLow.length === 0 && paperLow.length === 0 && gated && rainOk && twinsOk, JSON.stringify({ pairs: pairs.length, tileLow, paperLow, gated, rain: rain.slice(1), cloud: cloud.slice(1), snow: snow.slice(1) })); }
  // The spoken row (round three's screen read, pass MQ): where the device can speak, the speaker's column keeps a speaker's 40 pixels
  // while the speaker hides after a right answer, so the row never drops (Share the Cookies' plates rose 13 pixels on a laptop, Grow
  // the Plant's tiles 16), and the hidden copy that measures the round's lines keeps no height, so no code can scroll the board into it.
  ok('a spoken row keeps a speaker\'s height while its speaker hides, and its measuring copy keeps none (pass MQ, round three\'s screen read)', /<div style=\{\{ justifySelf: 'start', display: 'flex', alignItems: 'center', minHeight: canSpeak\(\) \? 40 : 0 \}\}>\{speaker\}<\/div>/.test(ui) && /ref=\{measureRef\} aria-hidden="true" style=\{\{ position: 'absolute', left: 0, top: 0, height: 0, overflow: 'hidden',/.test(ui));
  ok('the duck\'s and the bee\'s outline reads 3 to 1 or better on white, every name picture\'s tint and the dark theme\'s paper and tiles, on the duck\'s body and head and the bee\'s body and wings, and Q56\'s yellow edge or no outline would not pass (pass MQ, Q62)', grounds.length === 9 && lowFor(gild).length === 0 && worn.duckBodyHead === 2 && worn.beeBody === 1 && worn.beeWings === 2 && nearMisses.every(Boolean), JSON.stringify({ gild, low: lowFor(gild), worn, nearMisses }));
}

// Pass MO (round two's code check): the device voice from ui.jsx's own speech code, run in node:vm on a fake clock against a voice
// modelled on what the code's comments say Chrome does (an utterance queued in the tick of a cancel is dropped, with no events). A
// first try the voice drops is asked again by speak()'s retry, and each piece of the line is said once (the watch for a dropped
// end had let the dropped try play on beside the retry); a round left in the same tick as the next screen speaks starts that
// screen's words a beat later, not after the retry (the hush cancelled in that tick, a cancel-then-speak); and a round left with
// nothing after it falls quiet.
{ const vm = await import('node:vm');
  const ui = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8'); const lg = readFileSync(new URL('../src/logic.mjs', import.meta.url), 'utf8');
  const cut = (t, a, b) => { const i = t.indexOf(a); const j = i < 0 ? -1 : t.indexOf(b, i); return i < 0 || j < 0 ? '' : t.slice(i, j); };
  const src = cut(lg, '// ---------- The sounds a lesson says (pass MO', 'export function whyNotNamesAnswer').replace(/^export /gm, '') + '\n' + cut(ui, "// Read text aloud with the browser's built-in voice.", '// One button for every read-aloud spot.');
  // opts.loseEnd(text) loses that utterance's end event (it is said, but the voice never reports its end), as some phones do.
  const run = (dropFirst, script, until, opts = {}) => {
    let now = 0; let seq = 0; const timers = []; const log = []; let queue = []; let spoke = 0; let lastCancel = -100; let blobs = 0;
    const later = (fn, ms, every = 0) => { const id = ++seq; timers.push({ id, at: now + Math.max(0, Number(ms) || 0), fn, every }); return id; };
    const clear = (id) => { const i = timers.findIndex((t) => t.id === id); if (i >= 0) timers.splice(i, 1); };
    // Each utterance is started once (round three: an end handler that queued the next words itself, as a reading's does, had the
    // stand-in start them twice, once from the new words and once after the handler).
    const startNext = () => { const u = queue[0]; if (!u || u.__started) return; u.__started = true; later(() => { if (queue[0] !== u) return; u.__began = true; log.push({ at: now, say: u.text, rate: u.rate }); if (u.onstart) u.onstart({}); later(() => { if (queue[0] !== u) return; queue.shift(); if (u.onend && !(opts.loseEnd && opts.loseEnd(u.text))) u.onend({}); startNext(); }, 120 + 8 * u.text.length); }, opts.startMs || 5); };
    // opts.lateSpeaking (pass MQ): a voice that reports neither speaking nor pending until an utterance truly starts.
    const ss = { get speaking() { return opts.lateSpeaking ? queue.some((u) => u.__began) : queue.length > 0; }, get pending() { return opts.lateSpeaking ? false : queue.length > 1; }, getVoices() { return []; },
      cancel() { lastCancel = now; const old = queue; queue = []; for (const u of old) later(() => { if (u.onerror) u.onerror({ error: 'interrupted' }); }, 1); },
      speak(u) { if (opts.throwOn && opts.throwOn(u.text)) throw new Error('the voice would not take it'); spoke += 1; if ((dropFirst && spoke === 1) || now - lastCancel < 4) { log.push({ at: now, dropped: u.text }); return; } queue.push(u); if (queue.length === 1) startNext(); } };
    function Audio() { const a = { src: '', onended: null, onerror: null, t: 0, play() { log.push({ at: now, sound: a.src }); a.t = later(() => { if (a.onended) a.onended(); }, 300); return Promise.resolve(); }, pause() { clear(a.t); } }; return a; }
    const ctx = vm.createContext({ window: { speechSynthesis: ss, Audio, addEventListener() {} }, console, setTimeout: (f, ms) => later(f, ms), clearTimeout: clear, setInterval: (f, ms) => later(f, ms, ms), clearInterval: clear, Date: { now: () => now }, Math, JSON, Promise, Uint8Array, DataView, ArrayBuffer, Float64Array, Float32Array, Int16Array, SENTENCE_BREAK: L.SENTENCE_BREAK, URL: { createObjectURL: () => `blob:${++blobs}` }, Blob: function Blob() {}, SpeechSynthesisUtterance: function SpeechSynthesisUtterance(t) { this.text = t; } });
    let api = null;
    try { vm.runInContext(`${src}\nglobalThis.__speech = { speak, hushSpeech, speechPieces, speakSequence, voiceTalking, setYoungVoice, speechYoung, YOUNG_RATE, YOUNG_PAUSE_MS, SPEECH_SHAPES, voiceBackstopMs, startsSentence };`, ctx); api = ctx.__speech; } catch (e) { return { log, error: e.message, ss }; }
    script(api, (fn, ms) => later(fn, ms), () => now);   // the fake clock's time, for a script that notes when something came
    // An error thrown inside a timer is a fault of the code under test, kept in the log rather than stopping the run.
    while (timers.length) { timers.sort((x, y) => x.at - y.at || x.id - y.id); const t = timers[0]; if (t.at > until) break; now = t.at; if (t.every) t.at += t.every; else timers.shift(); try { t.fn(); } catch (e) { log.push({ at: now, threw: String(e && e.message) }); } }
    return { log, api, ss };
  };
  const LINE = 'Sun. Sss. The word sun starts with the sound sss.';
  const a = run(true, (api) => api.speak(LINE), 9000);
  const pieces = a.api ? a.api.speechPieces(LINE) : []; const says = a.log.filter((e) => e.say).map((e) => e.say);
  ok("speak() asks a voice that dropped its first try again, and says each piece of the line once (Sun. Sss. ...)", !a.error && pieces.length === 4 && pieces.filter((p) => !p.sound).every((p) => says.filter((x) => x === p.text).length === 1) && a.log.filter((e) => e.sound).length === pieces.filter((p) => p.sound).length, a.error || JSON.stringify(a.log));
  const NEXT = 'Well done. Tap the green button to go home.';
  const b = run(false, (api, later) => { api.speak('Correct. First the hat, and then the ball, just as the words said.'); later(() => { api.hushSpeech(); api.speak(NEXT); }, 400); }, 5000);
  const first = b.log.find((e) => e.say === 'Well done.');
  ok('leaving a round as the next screen speaks starts its words a beat later, once, never after the retry', !b.error && !!first && first.at - 400 < 250 && b.log.filter((e) => e.say === 'Well done.').length === 1 && b.log.filter((e) => e.say === 'Tap the green button to go home.').length === 1, b.error || JSON.stringify(b.log));
  // The voice is read quiet 10 ms after the hush (round four's code check: a hush without its cancel let "First the hat, ..." play
  // to its end, and the case passed, since that sentence had begun before the hush and the voice was quiet by 4 seconds).
  let cTalking = null;
  const c = run(false, (api, later) => { api.speak('Correct. First the hat, and then the ball, just as the words said.'); later(() => api.hushSpeech(), 250); later(() => { cTalking = api.voiceTalking(); }, 260); }, 4000);
  ok('leaving a round with nothing after it falls quiet', !c.error && cTalking === false && !c.ss.speaking && !c.log.some((e) => e.say && e.at > 260), c.error || JSON.stringify({ log: c.log, cTalking }));
  // Round three's code check (pass MO): a reader's stop beside the next reader's words in one tick (a lesson's Next, a story left
  // for a lesson), with the voice still speaking and with it quiet, and beside a question's speak (Start practice): the next words
  // are said once, a beat after the old line's cancel at most, and the first sentence is never lost (the stop cancelled in that tick,
  // a cancel-then-speak, and "This is a square." was dropped).
  const seqOf = (api, texts) => api.speakSequence(texts, () => {}, () => {});
  const OLD = ['This is a circle.', 'It has no corners.']; const NEW = ['This is a square.', 'It has four sides.'];
  const d = run(false, (api, later) => { const stop = seqOf(api, OLD); later(() => { stop(); seqOf(api, NEW); }, 300); }, 6000);
  const e1 = run(false, (api, later) => { const stop = seqOf(api, OLD); later(() => { stop(); seqOf(api, NEW); }, 3000); }, 8000);
  const f = run(false, (api, later) => { const stop = seqOf(api, OLD); later(() => { stop(); api.speak('Tap the hat, and then tap the ball.'); }, 300); }, 6000);
  const once = (r, text, after, within) => { const at = r.log.filter((x) => x.say === text); return at.length === 1 && at[0].at - after < within && !r.log.some((x) => x.dropped === text) && !r.log.some((x) => x.threw); };
  ok("a reader's stop beside the next reading's words says them once, a beat later at most, the voice speaking or quiet", !d.error && !e1.error && once(d, 'This is a square.', 300, 250) && once(d, 'It has four sides.', 300, 2000) && once(e1, 'This is a square.', 3000, 250), d.error || e1.error || JSON.stringify({ speaking: d.log, quiet: e1.log }));
  ok("a reader's stop beside a question's words says the question once, a beat later, never after the retry", !f.error && once(f, 'Tap the hat, and then tap the ball.', 300, 250), f.error || JSON.stringify(f.log));
  // A reading whose first words the voice drops (the page's first words, on some phones) is asked once more, from where it was, and
  // each sentence is said once (speakSequence had no retry, and the watch moved on).
  const g = run(true, (api) => seqOf(api, NEW), 6000);
  ok('a reading whose first sentence the voice drops is asked once more, and each sentence is said once', !g.error && g.log.filter((x) => x.say === 'This is a square.').length === 1 && g.log.filter((x) => x.say === 'It has four sides.').length === 1, g.error || JSON.stringify(g.log));
  // A hush with the voice already quiet lets the next screen's words through (a hush without its own ticket's check cancelled them:
  // "Well done! You earned a story!" was never said); a hush during a sound stops the sound at once.
  const h = run(false, (api, later) => { api.speak('Correct.'); later(() => { api.hushSpeech(); api.speak('Well done! You earned a story!'); }, 2500); }, 6000);
  ok("a hush with the voice quiet lets the next screen's words through, once", !h.error && h.log.filter((x) => x.say === 'Well done!').length === 1 && h.log.filter((x) => x.say === 'You earned a story!').length === 1, h.error || JSON.stringify(h.log));
  let talking = null;
  // "Sun." ends at about 157 ms and its sss plays for 300 ms, so a hush at 250 ms lands inside the sound.
  const i1 = run(false, (api, later) => { api.speak(LINE); later(() => { api.hushSpeech(); talking = api.voiceTalking(); }, 250); }, 5000);
  const soundAt = i1.log.filter((x) => x.sound).map((x) => x.at);
  ok('a hush during a sound stops the sound at once, and nothing after it plays', !i1.error && soundAt.length === 1 && soundAt[0] < 250 && talking === false && !i1.log.some((x) => (x.say || x.sound) && x.at > 250), i1.error || JSON.stringify({ log: i1.log, talking }));
  // A voice that loses a batch's last end still moves the line on, its sound and the words after it said (sayPieces' watch), and a
  // lost end earlier in a batch never throws (the last end named a piece past the batch).
  const j = run(false, (api) => api.speak(LINE), 9000, { loseEnd: (t) => t === 'Sun.' });
  ok('a voice that loses a batch\'s last end still moves the line on, its sounds and the words after them said', !j.error && j.log.filter((x) => x.sound).length === 2 && j.log.some((x) => x.say === (pieces.filter((p) => !p.sound)[1] || {}).text) && !j.log.some((x) => x.threw), j.error || JSON.stringify(j.log));
  const k1 = run(false, (api) => api.speakSequence(['Bear. Chair. Bear and chair rhyme.'], () => {}, () => {}), 9000, { loseEnd: (t) => t === 'Bear.' });
  ok('a lost end earlier in a batch never throws, and the reading goes on', !k1.error && !k1.log.some((x) => x.threw) && k1.log.some((x) => x.say === 'Bear and chair rhyme.'), k1.error || JSON.stringify(k1.log));
  // Round four's code check (pass MO): a voice that loses the ends inside a batch, and a pace change while its last sentence is said,
  // says only that sentence again, never the ones already said whole, and the light sits on the sentence being said (the place stayed
  // on the first piece, so "Lena had six blocks. She stacked them high." was said twice).
  const LENA = 'Lena had six blocks. She stacked them high. The tower wobbled.'; let lit = null; let litAtChange = null;
  const m1 = run(false, (api, later) => { const stop = api.speakSequence([LENA], (i, s) => { lit = s; }, () => {}); later(() => { litAtChange = lit; stop.setNudge(-1); }, 700); }, 9000, { loseEnd: (t) => t !== 'The tower wobbled.' });
  ok('a pace change after a voice lost the ends inside a batch says no sentence already said whole again, and the light is on the sentence being said', !m1.error && !m1.log.some((x) => x.threw) && m1.log.filter((x) => x.say === 'Lena had six blocks.').length === 1 && m1.log.filter((x) => x.say === 'She stacked them high.').length === 1 && m1.log.filter((x) => x.say === 'The tower wobbled.').length === 2 && litAtChange === 2, m1.error || JSON.stringify({ log: m1.log, litAtChange }));
  // Round five's code check: that case read the light once, on the batch's last sentence, and never waited for the batch's end, so a
  // start that lit the next piece and a fix without its cascade both passed; the light is read mid-batch, and after lost inner ends
  // the next text follows the last sentence's end at once, that sentence said once though the pace changes after it.
  let litMid = null;
  const p1 = run(false, (api, later) => { api.speakSequence([LENA], (i, s) => { lit = s; }, () => {}); later(() => { litMid = lit; }, 400); }, 9000, { loseEnd: (t) => t !== 'The tower wobbled.' });
  ok('the light is on the sentence being said, mid-batch, after the voice lost an end', !p1.error && litMid === 1, p1.error || String(litMid));
  const p2 = run(false, (api, later) => { const stop = api.speakSequence([LENA, 'Then it fell down.'], () => {}, () => {}); later(() => stop.setNudge(-1), 1000); }, 9000, { loseEnd: (t) => t !== 'The tower wobbled.' });
  const nx = p2.log.find((x) => x.say === 'Then it fell down.');
  ok('after lost inner ends the next text follows at once, and the last sentence is said once', !p2.error && p2.log.filter((x) => x.say === 'The tower wobbled.').length === 1 && !!nx && nx.at < 1000, p2.error || JSON.stringify(p2.log));
  const SAM = 'Sam said it slowly. Sam. Sss.';
  const t1 = run(false, (api) => api.speak(SAM), 6000, { throwOn: (t) => t === 'Sam.' });
  const samAt = t1.log.find((x) => x.say === 'Sam said it slowly.'); const sssAt = t1.log.find((x) => x.sound);
  // Since round six's code check the sound follows the words' end at once (a catch that never counted the thrown piece passed, the
  // sound 1.47 seconds late, after the watch), and a thrown middle piece never moves the light or the place past the pieces still
  // queued, with a voice that starts 800 ms late (the catch had lit the third sentence while the first was said, and a pace change
  // then started past it, "Lena had six blocks." never said).
  ok("a piece the voice will not take never lets the next sound play over the words still queued", !t1.error && !!samAt && !!sssAt && sssAt.at >= samAt.at + 120 + 8 * 'Sam said it slowly.'.length && sssAt.at < samAt.at + 120 + 8 * 'Sam said it slowly.'.length + 100, t1.error || JSON.stringify(t1.log));
  const lits2 = []; const t2 = run(false, (api, later) => { const stop = api.speakSequence([LENA], (i, s) => { lits2.push(s); }, () => {}); later(() => stop.setNudge(-1), 300); }, 9000, { throwOn: (t) => t === 'She stacked them high.', startMs: 800 });
  ok('a piece the voice will not take never moves the light or the place past the pieces still queued', !t2.error && t2.log.filter((x) => x.say === 'Lena had six blocks.').length === 1 && lits2[1] === 0 && !lits2.includes(1), t2.error || JSON.stringify({ log: t2.log, lits2 }));
  // A reader's stop that is no longer the newest still hushes (round four's code check: a stop that hushed only when its own ticket
  // was the newest left the Wonder's Say it again talking after the X, "No." said after it).
  let staleTalking = null;
  const n1 = run(false, (api, later) => { const stop = seqOf(api, OLD); later(() => api.speak('No. It is not the same as yours.'), 2500); later(() => stop(), 2900); later(() => { staleTalking = api.voiceTalking(); }, 2910); }, 6000);
  ok("a reader's stop that is no longer the newest still hushes the words said since", !n1.error && staleTalking === false && !n1.log.some((x) => (x.say || x.sound) && x.at > 2900) && n1.log.some((x) => x.say === 'No.'), n1.error || JSON.stringify({ log: n1.log, staleTalking }));
  // Pass MP's pauses (round one's code check): a story's breath between sentences on the snail (opts.pause), the gap after a title
  // and after a paragraph (opts.gap, a function of the text just read), and a fifth of a second between two sounds (SOUND_GAP_MS).
  // A pace change in any of them starts with what comes next, never the sentence, title or sound just said (the place still named
  // it, and "Ana had a plate." and "Two Plates." were said twice); a stop in one says nothing more; a voice that loses an end
  // before one goes on, each sentence said once; and the snail's breath falls beside a sound too ("Bus." then sss had come 5 ms apart).
  const onceEach = (r, texts) => texts.every((t) => r.log.filter((x) => x.say === t).length === 1);
  const LENA3 = ['Lena had six blocks.', 'She stacked them high.', 'The tower wobbled.'];
  const q1 = run(false, (api, later) => { const stop = api.speakSequence([LENA], () => {}, () => {}, [], { pause: () => 330 }); later(() => stop.setNudge(-1), 450); }, 9000);
  const q2 = run(false, (api, later) => { const stop = api.speakSequence(['Two Plates.', 'Ana had a plate.'], () => {}, () => {}, [], { gap: (i) => (i === 0 ? 650 : 250) }); later(() => stop.setNudge(-1), 400); }, 9000);
  const q3 = run(false, (api, later) => { const stop = api.speakSequence(['Ana had a plate.', 'It was red.', 'She ate.'], () => {}, () => {}, [], { gap: () => 550, pause: () => 330 }); later(() => stop.setNudge(-1), 600); }, 9000);
  // Since pass MQ buh is the app's own sound too (Q60), so "Buh! Sss! Mmm!" is three sounds, and the pace change and the stop fall in
  // the fifth of a second between the first two (buh plays from 0 to 300 ms on the stand-in, sss from 500).
  const q4 = run(false, (api, later) => { const stop = api.speakSequence(['Buh! Sss! Mmm!'], () => {}, () => {}); later(() => stop.setNudge(-1), 400); }, 9000);
  ok('a pace change in a pause, the gap after a title or a paragraph, or between two sounds says nothing already said again', !q1.error && !q2.error && !q3.error && !q4.error && onceEach(q1, LENA3) && onceEach(q2, ['Two Plates.', 'Ana had a plate.']) && onceEach(q3, ['Ana had a plate.', 'It was red.', 'She ate.']) && q4.log.filter((x) => x.sound).length === 3, q1.error || q2.error || q3.error || q4.error || JSON.stringify({ q1: q1.log, q2: q2.log, q3: q3.log, q4: q4.log }).slice(0, 900));
  const s1 = run(false, (api, later) => { const stop = api.speakSequence([LENA], () => {}, () => {}, [], { pause: () => 330 }); later(() => stop(), 450); }, 9000);
  const s2 = run(false, (api, later) => { const stop = api.speakSequence(['Two Plates.', 'Ana had a plate.'], () => {}, () => {}, [], { gap: () => 650 }); later(() => stop(), 400); }, 9000);
  const s3 = run(false, (api, later) => { const stop = api.speakSequence(['Buh! Sss! Mmm!'], () => {}, () => {}); later(() => stop(), 400); }, 9000);
  ok('a stop in a pause, a gap or between two sounds says nothing more', !s1.error && !s2.error && !s3.error && !s1.log.some((x) => (x.say || x.sound) && x.at > 450) && !s2.log.some((x) => (x.say || x.sound) && x.at > 400) && !s3.log.some((x) => (x.say || x.sound) && x.at > 400), JSON.stringify({ s1: s1.log, s2: s2.log, s3: s3.log }).slice(0, 700));
  const l1 = run(false, (api) => api.speakSequence([LENA], () => {}, () => {}, [], { pause: () => 330 }), 12000, { loseEnd: (t) => t === 'Lena had six blocks.' });
  const l2 = run(false, (api) => api.speakSequence(['Two Plates.', 'Ana had a plate.'], () => {}, () => {}, [], { gap: () => 650 }), 12000, { loseEnd: (t) => t === 'Two Plates.' });
  ok('a voice that loses an end before a pause or a gap goes on, each sentence said once', !l1.error && !l2.error && onceEach(l1, LENA3) && onceEach(l2, ['Two Plates.', 'Ana had a plate.']) && !l1.log.some((x) => x.threw), JSON.stringify({ l1: l1.log, l2: l2.log }).slice(0, 700));
  const b1 = run(false, (api) => api.speakSequence(['Bus. Sss! Sun starts with sss.'], () => {}, () => {}, [], { pause: () => 330 }), 9000);
  const busAt = (b1.log.find((x) => x.say === 'Bus.') || {}).at; const sounds = b1.log.filter((x) => x.sound).map((x) => x.at); const sunAt = (b1.log.find((x) => x.say === 'Sun starts with') || b1.log.find((x) => /^Sun starts with/.test(x.say || '')) || {}).at;
  const g1 = run(false, (api) => api.speak('Buh! Sss! Mmm!'), 9000); const gs = g1.log.filter((x) => x.sound).map((x) => x.at);
  // The young voice (pass MQ, Mikey: "For the younger learners whose questions/lessons are spoken to them.   I think the speed of the
  // sentences can slow a little bit with small pauses between sentences"): with the page asking for it, speak() says each sentence
  // on its own, a rest of YOUNG_PAUSE_MS after the one before ends, at YOUNG_RATE of its shape's rate, while a word at play keeps its
  // own; an open game's word comes first (a game for an older learner reads in the usual voice over a young page, and the page's
  // choice comes back when the game closes); speakSequence rests between texts and between sentences too, unless the caller names its
  // own rests or young false (a story); the voice counts as talking through a rest, and a hush ends it; and a pace change, a stop and
  // a lost end in a young rest say nothing twice and nothing after the stop. Each case failed on pass MP's speech code, which had no
  // young voice (proof in the pass's scratch folder).
  const AN2 = ['Ana had a plate.', 'It was red.'];
  const y1 = run(false, (api) => { api.setYoungVoice('page', true); api.speak('Ana had a plate. It was red.'); }, 6000);
  const y1a = (y1.log.find((x) => x.say === AN2[0]) || {}); const y1b = (y1.log.find((x) => x.say === AN2[1]) || {});
  const y1Shapes = y1.api ? y1.api.SPEECH_SHAPES : null; const young = y1.api ? y1.api.YOUNG_RATE : NaN; const rest = y1.api ? y1.api.YOUNG_PAUSE_MS : NaN;
  const y1ok = !y1.error && typeof y1a.at === 'number' && typeof y1b.at === 'number' && y1b.at - (y1a.at + 120 + 8 * AN2[0].length) >= rest && y1Shapes && Math.abs(y1a.rate - y1Shapes.plain.rate * young) < 1e-9 && young < 1 && rest >= 300;
  const y2 = run(false, (api) => { api.setYoungVoice('page', true); api.speak('Red! This is red.'); }, 6000);
  const y2ok = !y2.error && y1Shapes && Math.abs(((y2.log.find((x) => x.say === 'Red!') || {}).rate) - y1Shapes.key.rate) < 1e-9 && Math.abs(((y2.log.find((x) => x.say === 'This is red.') || {}).rate) - y1Shapes.plain.rate * young) < 1e-9;
  let owners = null;
  const y3 = run(false, (api) => { api.setYoungVoice('page', true); const a = api.speechYoung(); api.setYoungVoice('game', false); const b = api.speechYoung(); api.setYoungVoice('game', null); const c = api.speechYoung(); api.setYoungVoice('page', false); api.setYoungVoice('game', true); const d = api.speechYoung(); api.setYoungVoice('game', null); owners = [a, b, c, d, api.speechYoung()]; api.speak('Ana had a plate. It was red.'); }, 6000);
  const y3a = (y3.log.find((x) => x.say === AN2[0]) || null); const y3b = (y3.log.find((x) => x.say === AN2[1]) || null);
  const y3ok = !y3.error && JSON.stringify(owners) === JSON.stringify([true, false, true, true, false]) && !!y3a && !!y3b && y1Shapes && Math.abs(y3a.rate - y1Shapes.plain.rate) < 1e-9 && y3b.at - (y3a.at + 120 + 8 * AN2[0].length) < 50;
  const y4 = run(false, (api) => { api.setYoungVoice('page', true); api.speakSequence(AN2, () => {}, () => {}); }, 6000);
  const y4a = (y4.log.find((x) => x.say === AN2[0]) || {}); const y4b = (y4.log.find((x) => x.say === AN2[1]) || {});
  const y5 = run(false, (api) => { api.setYoungVoice('page', true); api.speakSequence(AN2, () => {}, () => {}, [], { young: false }); }, 6000);
  const y5a = (y5.log.find((x) => x.say === AN2[0]) || {}); const y5b = (y5.log.find((x) => x.say === AN2[1]) || {});
  const y45ok = !y4.error && !y5.error && y4b.at - (y4a.at + 120 + 8 * AN2[0].length) >= rest && y5b.at - (y5a.at + 120 + 8 * AN2[0].length) < 50 && Math.abs(y5a.rate - y1Shapes.plain.rate) < 1e-9;
  let resting = null; let hushed = null;
  const y6 = run(false, (api, later) => { api.setYoungVoice('page', true); api.speak('Ana had a plate. It was red.'); later(() => { resting = api.voiceTalking(); }, 5 + 120 + 8 * AN2[0].length + 100); later(() => { api.hushSpeech(); hushed = api.voiceTalking(); }, 5 + 120 + 8 * AN2[0].length + 150); }, 6000);
  const y6ok = !y6.error && resting === true && hushed === false && !y6.log.some((x) => x.say === AN2[1]);
  const pauseAt = 5 + 120 + 8 * AN2[0].length + 150;   // inside the rest after the first sentence
  const y7 = run(false, (api, later) => { api.setYoungVoice('page', true); const stop = api.speakSequence(['Ana had a plate. It was red. She ate.'], () => {}, () => {}); later(() => stop.setNudge(-1), pauseAt); }, 9000);
  const y8 = run(false, (api, later) => { api.setYoungVoice('page', true); const stop = api.speakSequence(['Ana had a plate. It was red. She ate.'], () => {}, () => {}); later(() => stop(), pauseAt); }, 9000);
  const y9 = run(false, (api) => { api.setYoungVoice('page', true); api.speakSequence(['Ana had a plate. It was red. She ate.'], () => {}, () => {}); }, 12000, { loseEnd: (t) => t === 'Ana had a plate.' });
  const AN3 = ['Ana had a plate.', 'It was red.', 'She ate.'];
  const y789ok = !y7.error && !y8.error && !y9.error && onceEach(y7, AN3) && !y8.log.some((x) => (x.say || x.sound) && x.at > pauseAt) && onceEach(y9, AN3);
  ok('the young voice: each sentence on its own after a rest, a little slower but a word at play, an open game\'s word first, the reading and its texts rested unless a caller says otherwise, talking through a rest, and a pace change, a stop and a lost end in a rest saying nothing twice', y1ok && y2ok && y3ok && y45ok && y6ok && y789ok,
    JSON.stringify({ y1ok, y2ok, y3ok, y45ok, y6ok, y789ok, owners, y1: y1.log, y7: y7.log, y8: y8.log, y9: y9.log, err: y1.error || y2.error || y3.error || y4.error || y5.error || y6.error || y7.error || y8.error || y9.error }).slice(0, 900));
  // The young voice's rests, read further (pass MQ, round one's code check, where each of these near misses passed the checks above):
  // a gap between one text and the next counts as talking, and a young reading says it is done when its last text ends, never a rest
  // later (a young game's welcome lines had been 1,150 ms apart, not INTRO_GAP's 700); a newer line clears an old rest, so a short
  // word said in a rest leaves nothing talking once it ends; and a rest counts as talking for 60 ms past its end, so a voice that
  // reports nothing until it truly starts the next sentence is not taken for silence at the rest's end.
  let gapTalking = null; let doneAt = null; let afterNew = null; let atRestEnd = null;
  const y10 = run(false, (api, later, clock) => { api.setYoungVoice('page', true); api.speakSequence(AN2, () => {}, () => { doneAt = clock(); }); later(() => { gapTalking = api.voiceTalking(); }, 5 + 120 + 8 * AN2[0].length + 100); }, 6000);
  const y10b = y10.log.find((x) => x.say === AN2[1]) || {}; const y10end = typeof y10b.at === 'number' ? y10b.at + 120 + 8 * AN2[1].length : NaN;
  const inRest = 5 + 120 + 8 * AN2[0].length + 100;
  const y11 = run(false, (api, later) => { api.setYoungVoice('page', true); api.speak('Ana had a plate. It was red.'); later(() => api.speak('Blue.', { young: false }), inRest); later(() => { afterNew = api.voiceTalking(); }, inRest + 5 + 120 + 8 * 'Blue.'.length + 30); }, 6000);
  const restEnd = 5 + 120 + 8 * AN2[0].length + 450;
  const y12 = run(false, (api, later) => { api.setYoungVoice('page', true); api.speak('Ana had a plate. It was red.'); later(() => { atRestEnd = api.voiceTalking(); }, restEnd + 2); }, 6000, { lateSpeaking: true });
  const y10ok = !y10.error && gapTalking === true && typeof doneAt === 'number' && doneAt - y10end >= 0 && doneAt - y10end < 50;
  const y11ok = !y11.error && afterNew === false && !y11.log.some((x) => x.say === AN2[1]);
  const y12ok = !y12.error && atRestEnd === true && onceEach(y12, AN2);
  ok('the young voice\'s rests: a gap between texts counts as talking and none follows the last text, a newer line clears an old rest, and a rest counts as talking until the next sentence truly starts (pass MQ, round one\'s code check)', y10ok && y11ok && y12ok,
    JSON.stringify({ y10ok, y11ok, y12ok, gapTalking, doneAt, y10end, afterNew, atRestEnd, err: y10.error || y11.error || y12.error }).slice(0, 600));
  // Two more near misses of those rests (round two's code read, pass MQ, each passed the cases above): a newer reading clears an old
  // rest as a newer line does (speakSequence without its own clear passed y11, which tries speak() alone); and the 60 ms slack is
  // read on both sides, a voice that starts 40 ms late still talking 35 ms past the rest, and nothing talking 150 ms after the line's
  // last sentence ends (a slack of 3 ms, or of 3,000 ms, passed y12, which reads 2 ms past the rest).
  let seqAfter = null; let late35 = null; let afterEnd = null;
  const y13 = run(false, (api, later) => { api.setYoungVoice('page', true); api.speak('Ana had a plate. It was red.'); later(() => api.speakSequence(['Blue.'], () => {}, () => {}, [], { young: false }), inRest); later(() => { seqAfter = api.voiceTalking(); }, inRest + 5 + 120 + 8 * 'Blue.'.length + 30); }, 6000);
  const y14a = run(false, (api) => { api.setYoungVoice('page', true); api.speak('Ana had a plate. It was red.'); }, 6000, { lateSpeaking: true, startMs: 40 });
  const y14first = y14a.log.find((x) => x.say === AN2[0]) || {}; const y14second = y14a.log.find((x) => x.say === AN2[1]) || {};
  const restEnd40 = (y14first.at || 0) + 120 + 8 * AN2[0].length + rest; const lineEnd40 = (y14second.at || 0) + 120 + 8 * AN2[1].length;
  const y14 = run(false, (api, later) => { api.setYoungVoice('page', true); api.speak('Ana had a plate. It was red.'); later(() => { late35 = api.voiceTalking(); }, restEnd40 + 35); later(() => { afterEnd = api.voiceTalking(); }, lineEnd40 + 150); }, 6000, { lateSpeaking: true, startMs: 40 });
  const y13ok = !y13.error && seqAfter === false && !y13.log.some((x) => x.say === AN2[1]);
  const y14ok = !y14a.error && !y14.error && typeof y14first.at === 'number' && typeof y14second.at === 'number' && late35 === true && afterEnd === false && onceEach(y14, AN2);
  ok('a newer reading clears an old young rest too, and a rest counts as talking for a voice 40 ms late but not 150 ms after the line ends (pass MQ, round two\'s code read)', y13ok && y14ok,
    JSON.stringify({ y13ok, y14ok, seqAfter, late35, afterEnd, restEnd40, lineEnd40, err: y13.error || y14a.error || y14.error }).slice(0, 600));
  // Find the Letter's backstop (round two's code read, pass MQ: right in the game since round one, yet reverting it passed every test;
  // pass MM's round two had found the same backstop cutting a slow voice's line short): read with the speech code, for every right
  // letter's line the course deals. An older learner's is a real voice's pace, 1.2 seconds and 100 ms a letter; the young voice's
  // covers each letter's share at YOUNG_RATE and a rest after each sentence. The old formula (the plain one, young or not) fails.
  { let plainMs = null; let youngMs = null; const rights = L.SPOT_LETTERS.map((x) => L.letterSpotLine('right', x));
    const bz = run(false, (api) => { plainMs = rights.map((t) => api.voiceBackstopMs(t)); api.setYoungVoice('page', true); youngMs = rights.map((t) => api.voiceBackstopMs(t)); }, 0);
    const sents = (t) => String(t).split(L.SENTENCE_BREAK).filter(Boolean).length;
    const plainOk = !!plainMs && plainMs.every((ms, i) => ms === 1200 + rights[i].length * 100);
    const youngOk = !!youngMs && young < 1 && rest > 0 && youngMs.every((ms, i) => ms >= 1200 + (rights[i].length * 100) / young + rest * sents(rights[i]) - 1e-6 && sents(rights[i]) >= 2);
    ok("Find the Letter's backstop is a real voice's pace for an older learner, and covers each right letter's line at the young voice's pace with its rests (pass MQ, round two's code read)", !bz.error && rights.length === 13 && rights.every((t) => /^Yes, that is the letter [A-Z]\. It /.test(t)) && plainOk && youngOk && /const backstop = voiceBackstopMs;/.test(ui),
      JSON.stringify({ err: bz.error, plainOk, youngOk, plainMs: (plainMs || []).slice(0, 3), youngMs: (youngMs || []).slice(0, 3) })); }
  // Which screens get the young voice (pass MQ, round one's code check: taking practice out of the screens' list passed every test,
  // and the browser tests too): youngVoiceOn in logic, read part by part, and the page and an open game wired to it in ui.jsx.
  { const ON = (screen, readAloud, youngLearner) => L.youngVoiceOn({ screen, readAloud, youngLearner });
    const nine = ['lesson', 'practice', 'result', 'wonder', 'wonder-voices', 'course-done', 'light-review-result', 'checkpoint-result', 'quick-result'];
    const parts = { list: JSON.stringify([...L.YOUNG_VOICE_SCREENS].sort()) === JSON.stringify([...nine].sort()), readAloud: nine.every((s) => ON(s, true, false) === true),
      notReadAloud: nine.every((s) => ON(s, false, false) === false), stories: ['story', 'course-story', 'story-book', 'story-log'].every((s) => ON(s, true, true) === false),
      early: ['overview', 'coloring'].every((s) => ON(s, false, true) === true && ON(s, true, false) === false),
      page: /React\.useLayoutEffect\(\(\) => \{ setYoungVoice\('page', youngVoiceOn\(\{ screen, readAloud, youngLearner \}\)\); \}, \[readAloud, screen, youngLearner\]\);/.test(ui),
      game: /React\.useLayoutEffect\(\(\) => \{ setYoungVoice\('game', !!young\); return \(\) => setYoungVoice\('game', null\); \}, \[young\]\);/.test(ui),
      gameGetsLearner: /<GamePad key=\{coloring\}[^\n]*young=\{youngLearner\}/.test(ui) };
    ok('the young voice reads on the nine screens of a read-aloud course and an early learner\'s overview and Let\'s Color, never a story\'s, and the page and an open game ask youngVoiceOn and the game\'s learner (pass MQ, round one\'s code check)', Object.values(parts).every(Boolean), JSON.stringify(parts)); }
  // A welcome's rest between the sentences of a line (pass MQ, Mikey: "the cadence should be slow enough that a sentence can be
  // properly absorbed before jumping into the next sentence"): GameIntro hands its line to speakSequence with a pause, every age.
  const w1 = run(false, (api) => { api.speakSequence(['Welcome to Kite! This game helps you count in order.'], () => {}, () => {}, [], { intro: true, pause: () => 450 }); }, 6000);
  const w1a = (w1.log.find((x) => x.say === 'Welcome to Kite!') || {}); const w1b = (w1.log.find((x) => x.say === 'This game helps you count in order.') || {});
  // A rest only before a piece that starts a sentence (round three's alignment read, pass MQ: the young voice rested 450 ms inside
  // "What number makes 7 + 2 = 2 + ? true?" and "7 + ? = 8", where the sentence rule cuts at a "?" that stands for a number): those
  // halves run on, by speak() and by speakSequence(), and "Hi! And your friend says, hi!" keeps its rest before "And".
  { const QN = 'What number makes 7 + 2 = 2 + ? true?'; const SUM = '7 + ? = 8'; const HI = 'Hi! And your friend says, hi!';
    const gapIn = (r, a, b) => { const x = r.log.find((e) => e.say === a); const y = r.log.find((e) => e.say === b); return x && y ? y.at - (x.at + 120 + 8 * a.length) : null; };
    const r1 = run(false, (api) => { api.setYoungVoice('page', true); api.speak(QN); }, 6000);
    const r2 = run(false, (api) => { api.setYoungVoice('page', true); api.speakSequence([SUM], () => {}, () => {}); }, 6000);
    const r3 = run(false, (api) => { api.setYoungVoice('page', true); api.speak(HI); }, 6000);
    const r4 = run(false, (api) => { api.setYoungVoice('page', true); api.speakSequence([HI], () => {}, () => {}); }, 6000);
    const g = { q: gapIn(r1, 'What number makes 7 + 2 = 2 + ?', 'true?'), sum: gapIn(r2, '7 + ?', '= 8'), hi: gapIn(r3, 'Hi!', 'And your friend says, hi!'), hiSeq: gapIn(r4, 'Hi!', 'And your friend says, hi!') };
    // Every half of the rule (pass MQ, round four's code read): a sentence that starts with a digit or a bracket keeps its rest, as
    // thousands of young explanations do ("Correct. 16 is a ten and 6 more.", an explanation's [[11 − 5 = 6]] line), and More Info's
    // young reading hands its pause through restBefore; each half was planted out and passed every case above.
    { const D16 = 'Correct. 16 is a ten and 6 more.'; const BR = 'Take the smaller from the bigger. [[11 − 5 = 6]]';
      const r5 = run(false, (api) => { api.setYoungVoice('page', true); api.speak(D16); }, 6000);
      const r6 = run(false, (api) => { api.setYoungVoice('page', true); api.speak(BR); }, 6000);
      const h = { digit: gapIn(r5, 'Correct.', '16 is a ten and 6 more.'), bracket: gapIn(r6, 'Take the smaller from the bigger.', '[[11 − 5 = 6]]'), moreInfo: /young: false, \.\.\.\(young \? \{ pause: restBefore\(YOUNG_PAUSE_MS\) \} : \{\}\) \}\);/.test(ui) };
      ok('the young voice keeps its rest before a sentence that starts with a digit or a bracket, and More Info\'s young reading rests by restBefore (pass MQ, round four\'s code read)', ![r5, r6].some((r) => r.error) && h.digit !== null && h.digit >= rest && h.bracket !== null && h.bracket >= rest && h.moreInfo, JSON.stringify(h)); }
    // The Quick Review card's spoken line for a young learner (round four's code read, pass MQ): the lesson's name starts a sentence
    // with its capital, so the rest before it holds; lowered, "...long ago. count to 5." ran on with no rest.
    ok('the Quick Review card\'s spoken line starts the lesson\'s name with its capital, so the young voice rests before it (pass MQ, round four\'s code read)', /const lbSay = [^\n]*\(lbTwo \? lbList\[0\]\.title \+ ', then ' \+ lowerTitle\(lbList\[1\]\.title\) \+ '\. ' : lbMod\.title \+ '\. '\) \+ lbTail;/.test(ui));
    // No read-aloud lesson line and no game's welcome line is cut by the sentence rule before a piece that does not start a sentence
    // (round four's code read, pass MQ): a lesson reads each sentence as its own text and the young rest falls at every cut, and the
    // audio ledger keys each piece as its own clip, so "Washington, D.C. is ..." in a lesson would rest in the middle of its sentence.
    // There are none today; the planted lines show the check would see one. It reads by the app's own startsSentence.
    { const r0 = run(false, () => {}, 0); const opens = r0.api && typeof r0.api.startsSentence === 'function' ? r0.api.startsSentence : () => true;
      const cutsIn = (say) => { const parts = String(say || '').split(L.SENTENCE_BREAK).filter((x) => x.trim()); const out = []; for (let i = 1; i < parts.length; i++) { const first = L.speechPieces(parts[i])[0]; if (!opens(first || { text: parts[i] })) out.push(`${parts[i - 1].slice(-24)} | ${parts[i].slice(0, 24)}`); } return out; };
      const cuts = []; for (const c of L.COURSES.filter((x) => x.readAloud)) for (const m of c.modules) for (const line of L.readAloudScript(m)) for (const x of cutsIn(line.say)) cuts.push(`${m.id}: ${x}`);
      for (const g of L.GAMES) for (const line of L.gameIntro(g)) for (const x of cutsIn(line.say)) cuts.push(`welcome ${g.id}: ${x}`);
      const near = !!(r0.api && r0.api.startsSentence) && cutsIn('Make a pair! two socks make one.').length === 1 && cutsIn('We live near Washington, D.C. and we like it there.').length === 1 && cutsIn('Make a pair! Two socks make one.').length === 0;
      ok('no read-aloud lesson line or game welcome is cut by the sentence rule before a piece that does not start a sentence, where the young rest would fall inside it (pass MQ, round four\'s code read)', cuts.length === 0 && near, `${cuts.slice(0, 5).join('; ')}; near misses ${near}`); }
    ok('the young voice rests only before a piece that starts a sentence: no rest inside a question cut at a missing number\'s "?", the rest kept before "And" (pass MQ, round three\'s alignment read)', ![r1, r2, r3, r4].some((r) => r.error) && g.q !== null && g.q < 60 && g.sum !== null && g.sum < 60 && g.hi !== null && g.hi >= rest && g.hiSeq !== null && g.hiSeq >= rest, JSON.stringify(g)); }
  ok("a welcome's line rests between its sentences, for every age", !w1.error && typeof w1a.at === 'number' && w1b.at - (w1a.at + 120 + 8 * 'Welcome to Kite!'.length) >= 450 && /pause: restBefore\(INTRO_PAUSE_MS\)/.test(ui) && /const INTRO_PAUSE_MS = \d{3};/.test(ui) && /speak\(gameIntroWords\(game, \{ keys: hasKeyboard\(\) \}\), \{ pause: INTRO_PAUSE_MS \}\)/.test(ui), JSON.stringify(w1.log).slice(0, 400));
  ok("the snail's breath falls beside a sound too, and two sounds side by side wait a fifth of a second", !b1.error && !g1.error && typeof busAt === 'number' && sounds.length === 2 && typeof sunAt === 'number' && sounds[0] - (busAt + 120 + 8 * 'Bus.'.length) >= 330 && sunAt - (sounds[0] + 300) >= 330 && gs.length === 3 && gs[1] - (gs[0] + 300) >= 200 && gs[2] - (gs[1] + 300) >= 200, JSON.stringify({ b1: b1.log, g1: g1.log }).slice(0, 700));
}

// Where a color shows in the games (pass MQ, round four's docs read): tools/game-colors.mjs takes a question's count of games from
// the code, since counts made by hand came out narrower than the code in pass MP's Q66 and twice in pass MQ's Q69 (Build a sentence
// and Green Flag or Red Flag were missed). It finds every kind's component and Find the Letter's own board, counts every game once,
// finds red-brown in the two kinds the hand counts missed, and reports a renamed component as not found.
{ const T = await import('../tools/game-colors.mjs'); const rows = T.gameColors(); const ids = rows.flatMap((r) => r.games.map((g) => g.id));
  const kinds = new Set(L.GAMES.map((g) => g.kind)); const red = (k) => { const r = rows.find((x) => x.kind === k); return !!r && r.uses.length > 0; };
  const renamed = T.gameColors(T.RED_BROWN, readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8').replace('function BuildGame(', 'function BuildGameX('));
  const near = renamed.some((r) => r.kind === 'build' && !r.found);
  ok(`tools/game-colors.mjs finds every kind's component and Find the Letter's own board, counts every game once (${ids.length}), and finds red-brown in Build a sentence and Green Flag or Red Flag (pass MQ, round four's docs read)`, rows.every((r) => r.found) && ids.length === L.GAMES.length && new Set(ids).size === ids.length && [...kinds].every((k) => rows.some((r) => r.kind === k)) && rows.some((r) => r.comp === 'FindLetterGame' && r.games.length === 1) && red('build') && red('greenred') && near, JSON.stringify({ rows: rows.length, missing: rows.filter((r) => !r.found).map((r) => r.kind), games: ids.length, of: L.GAMES.length, near }));
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exitCode = fail ? 1 : 0;   // never process.exit(): it can drop the last lines of a piped stdout (2026-09-23)
