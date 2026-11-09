// Copyright (c) 2026 iECHO, LLC. All rights reserved.
// Two people who look alike, read by machine (pass MX, round two's content read). A pre-K child meets a new grown-up or friend in
// almost every lesson, and the picture rows of docs/ART-REQUESTS.md write each person's look out in words for Leonardo. Every pass
// since MO has had a check find a new person who looked like someone a lesson or two away (Arun's red sweater a lesson after Otto's
// red jacket, a third light-haired boy in orange, and in pass MX Gran's tangerine coat a lesson after a white-haired grandma's
// marigold sweater), each found by a person reading, so the trust pyramid asks for a machine.
// How it reads: in every pre-K story and painting row (S and P serials), each person the prompt names (a small girl, a grandma, a
// dad, a man...) is read for the color of their hair (the color just before the hair or its style, so "black hair streaked with
// silver" is black) and the color of what they wear (the first garment after it, "in a long sapphire-blue coat" being blue), each
// put in a family (tangerine, marigold and peach are all orange). Two people of one kind (girl, boy, woman, man) in different
// lessons of the same course or the course before it echo when both families match and the looks are not the same look: the same
// look again is one person met again (Mia and Sam in several lessons), which is how the course reuses its people.
// Run: node tools/look-echoes.mjs     every echo, oldest rows first, for a reader; tests/ledger.test.mjs holds a new row to none
import { readFileSync } from 'node:fs';
import { COURSES } from '../src/logic.mjs';

// The kinds of person a prompt names, and the group each belongs to (a teacher is left out, since the word says nobody's age; the
// man of a man bun is a hairstyle, never a second man, since the third read found Dex's dad read as no one).
const ROLE = /\b(small |little |young |older |tall |)(boy|girl|grandma|grandpa|mom|dad|man|woman|grandmother|grandfather|gran)\b(?!'s| bun)/g;
const GROUP = { boy: 'boy', girl: 'girl', grandma: 'woman', grandmother: 'woman', gran: 'woman', mom: 'woman', woman: 'woman', grandpa: 'man', grandfather: 'man', dad: 'man', man: 'man' };
// Where a look begins after the person word: with, who has, a comma before either, an age (an older girl of about eight with) or a
// teacher (a woman teacher with).
const INTRO = /^(?:,? who has|,? with| of about \w+ with| teacher with)\b/;
// Color families, first match wins, so a compound word is read before its parts (reddish-brown is red, white-blond is blond).
export const HAIR_FAMILIES = [['red', /\b(?:red|reddish-brown|reddish|ginger|auburn|copper|strawberry-blond)\b/], ['brown', /\b(?:honey-brown|light-brown|dark-brown|light brown|dark brown|chestnut)\b/],
  ['blond', /\b(?:blond|blonde|white-blond|golden|sandy|honey|flaxen)\b/], ['gray', /\b(?:gray|grey|white|silver|steel-gray|salt-and-pepper|snowy)\b/],
  ['black', /\b(?:black|jet-black|dark)\b/], ['brown', /\b(?:brown)\b/], ['none', /\b(?:bald|shaved head)\b/]];
export const CLOTHING_FAMILIES = [['red', /\b(?:red|cherry-red|cherry|crimson|scarlet|tomato|cranberry|maroon|brick|burgundy|wine)\b/],
  ['orange', /\b(?:orange|tangerine|marigold|pumpkin|pumpkin-orange|peach|apricot|amber|rust|copper)\b/], ['yellow', /\b(?:yellow|mustard|lemon|sunflower|gold|goldenrod|butter|canary|ochre)\b/],
  ['green', /\b(?:green|forest-green|lime-green|olive|mint|sage|lime|emerald|seafoam|jade|kelly)\b/], ['teal', /\b(?:teal|turquoise|aqua|cyan)\b/],
  ['blue', /\b(?:blue|navy|cobalt|cobalt-blue|sky-blue|sapphire|sapphire-blue|royal-blue|denim|cornflower|indigo|slate-blue)\b/],
  ['purple', /\b(?:purple|plum|lilac|lavender|violet|periwinkle|grape|mauve)\b/], ['pink', /\b(?:pink|rose|fuchsia|magenta|coral|salmon|blush|raspberry|berry)\b/],
  ['brown', /\b(?:brown|tan|camel|camel-brown|khaki|beige|chocolate|mocha|caramel)\b/], ['gray', /\b(?:gray|grey|charcoal|slate|heather)\b/],
  ['white', /\b(?:white|cream|ivory)\b/], ['black', /\b(?:black)\b/]];
const GARMENTS = 't-shirt|shirt|sweater|cardigan|hoodie|sundress|dress|pinafore|jacket|coat|vest|polo|blouse|pajamas|jumpsuit|overalls|onesie|romper|henley|fleece|sweatshirt|bathrobe|robe|parka|raincoat|poncho|jumper|tunic|top';
const CLOTHING = new RegExp('\\b(?:in|into|wearing|and) (?:an? |her |his )?((?:[a-z]+(?:-[a-z]+)* ){0,3}?)(' + GARMENTS + ')\\b');
const HAIR_WORDS = /hair|haircut|bob|ponytail|pigtails|afro|curls|pixie|bun|braid|mohawk|puffs|mop|topknot|crew cut|buzz|locs|dreadlocks|twists|cornrows|bald|shaved head/;
const STYLE = /\b(?:long|short|curly|straight|wavy|bob|ponytail|pigtails|afro|curls|pixie|buns?|braids?|mohawk|puffs|mop|topknot|crew cut|buzz|locs|dreadlocks|twists|cornrows|bangs|spiky|loose|shoulder-length|chin-length|bald)\b/g;
const family = (table, text) => { for (const [name, re] of table) if (re.test(text)) return name; return null; };

// Every person a pre-K story or painting row begins a look for (a person word, then with or who has): its serial, lesson, course (and
// its place among the pre-K courses) and group, and, where the look can be read, its hair and clothing families and the look itself
// (the families with the hair's style words and the garment); a look begun that cannot be read (no hair word it knows, no color it
// knows, no garment) is returned with read false and why, so a test can hold a new row to none.
export function personReads(artText = readFileSync(new URL('../docs/ART-REQUESTS.md', import.meta.url), 'utf8'), courses = COURSES) {
  const prek = courses.filter((c) => /^PK/.test(c.grade)); const where = new Map();
  prek.forEach((c, place) => { for (const m of c.modules) where.set(m.id, { course: c.id, place }); });
  const out = [];
  for (const line of artText.split('\n')) { const cells = line.split('|').map((x) => x.trim()); if (!/^[SP]\d+$/.test(cells[1] || '') || !where.has(cells[2])) continue;
    const prompt = cells[4] || ''; const hits = []; let m; ROLE.lastIndex = 0;
    while ((m = ROLE.exec(prompt))) hits.push({ at: m.index, end: m.index + m[0].length, word: m[2] });
    hits.forEach((h, i) => { const seg = prompt.slice(h.end, i + 1 < hits.length ? hits[i + 1].at : h.end + 240);
      const intro = INTRO.exec(seg); if (!intro) return;
      const base = { serial: cells[1], module: cells[2], ...where.get(cells[2]), group: GROUP[h.word] };
      const worn = CLOTHING.exec(seg); const hairText = seg.slice(intro[0].length, worn ? worn.index : 120).replace(/\b[a-z]+-framed\b|\bglasses\b/g, ' ');
      const said = seg.slice(intro[0].length, worn ? worn.index + worn[0].length : 120).replace(/\s+/g, ' ').trim();
      if (!HAIR_WORDS.test(hairText)) { out.push({ ...base, read: false, why: 'no hair word', words: said }); return; }
      // The hair's own color is read before anything said after it (streaked with, tied with, under a hat, and bangs), so the eyes'
      // color or a bow's is never the hair's; a word joined by hyphens is one word (salt-and-pepper).
      const ownHair = hairText.split(/\s(?:streaked|tied|under|with|and|in)\s/)[0];
      const hair = family(HAIR_FAMILIES, ownHair); const clothing = worn ? family(CLOTHING_FAMILIES, worn[1]) : null;
      if (!hair || !clothing) { out.push({ ...base, read: false, why: !hair ? 'no hair color' : !worn ? 'no garment' : 'no clothing color', words: said }); return; }
      const style = (hairText.match(STYLE) || []).sort().join(' ');
      out.push({ ...base, read: true, hair, clothing, look: hair + ' ' + style + ' / ' + clothing + ' ' + worn[2], words: said }); }); }
  return out;
}
// The looks read, as before the third read.
export const personLooks = (artText, courses) => personReads(artText, courses).filter((x) => x.read);

// Every pair of looks of one group, in the same course or the course before it, whose hair and clothing families both match. Each look
// is read once per lesson. same says the two looks are one look (in two lessons, a person met again, or someone given another's look),
// and sameLesson says both are in one lesson (two people in one story who look alike).
export function lookPairs(looks = personLooks()) {
  const once = new Map(); for (const x of looks) { const key = x.module + '|' + x.group + '|' + x.look; if (!once.has(key)) once.set(key, x); }
  const xs = [...once.values()]; const pairs = [];
  for (let i = 0; i < xs.length; i++) for (let j = i + 1; j < xs.length; j++) { const a = xs[i]; const b = xs[j];
    if (a.group === b.group && Math.abs(a.place - b.place) <= 1 && a.hair === b.hair && a.clothing === b.clothing) pairs.push(Object.assign([a, b], { same: a.look === b.look, sameLesson: a.module === b.module })); }
  return pairs;
}
// The echoes a reader looks at: two looks that differ, in one lesson or two (the same look in two lessons is taken as a person met
// again, which the ledger test asks a new row to name).
export const lookEchoes = (looks = personLooks()) => lookPairs(looks).filter((p) => !p.same);

// Two people of one kind whose hair is written alike, whatever they wear (pass NC, round two's content read: Astrid's mom's long blond
// hair in a loose braid was S4039's mom's, and Emeka's short wavy black hair the boy's of S3987 and S161, which lookPairs passed since
// their clothing differed): the same hair family and the same style words, at least one of them, in the same course or the course
// before, the looks themselves differing. A beard, a goatee, a mustache, glasses, graying or freckles that one has and the other does
// not sets two apart (a dad with short brown hair and a beard beside one with short brown hair and glasses). The hair part is read
// trimmed, since a look keeps a space before its slash and "black " passed the style-word test with a color alone (round two's code
// read: 17 of the 47 pairs then waiting named no style).
const MARKS = /\b(?:beard|goatee|mustache|glasses|graying|freckles)\b/g;
export function hairPairs(looks = personLooks()) {
  const hairOf = (x) => x.look.split(' / ')[0].trim(); const marks = (x) => (x.words.match(MARKS) || []).sort().join(' ');
  const once = new Map(); for (const x of looks) { const key = x.module + '|' + x.group + '|' + x.look; if (!once.has(key)) once.set(key, x); }
  const xs = [...once.values()]; const pairs = [];
  for (let i = 0; i < xs.length; i++) for (let j = i + 1; j < xs.length; j++) { const a = xs[i]; const b = xs[j];
    if (a.group === b.group && Math.abs(a.place - b.place) <= 1 && a.look !== b.look && hairOf(a) === hairOf(b) && hairOf(a).includes(' ') && marks(a) === marks(b)) pairs.push(Object.assign([a, b], { sameLesson: a.module === b.module })); }
  return pairs;
}

// Hair near alike (pass ND, round one's story check): two people of one kind, in the same course or the course before, whose hair is
// the same color family and shares at least one style word that sets a look (a bob, pigtails, chin-length, curly, braids), since
// hairPairs asks for every style word alike and passed "a chin-length brown bob" beside "chin-length curly brown hair". The words
// short, long, straight and loose are too common to set a look alone, and freckles, which a picture this size hardly shows, never set
// two apart here; a beard, a goatee, a mustache, glasses or graying still do. Returns [a, b, shared words] for each pair.
const NEAR_COMMON = new Set(['short', 'long', 'straight', 'loose']);
// A style word in its forms is one word (pass ND, round two's alignment read: "short black curls" passed beside "short black curly hair").
const NEAR_FORMS = { curly: 'curls', braids: 'braid', buns: 'bun', dreadlocks: 'locs' };
const NEAR_MARKS = /\b(?:beard|goatee|mustache|glasses|graying)\b/g;
export function hairNearPairs(looks = personLooks()) {
  const styleOf = (x) => x.look.split(' / ')[0].trim().split(' ').slice(1).filter((w) => w && !NEAR_COMMON.has(w)).map((w) => NEAR_FORMS[w] || w); const marks = (x) => (x.words.match(NEAR_MARKS) || []).sort().join(' ');
  const once = new Map(); for (const x of looks) { const key = x.module + '|' + x.group + '|' + x.look; if (!once.has(key)) once.set(key, x); }
  const xs = [...once.values()]; const pairs = [];
  for (let i = 0; i < xs.length; i++) for (let j = i + 1; j < xs.length; j++) { const a = xs[i]; const b = xs[j];
    if (a.group !== b.group || Math.abs(a.place - b.place) > 1 || a.look === b.look || a.hair !== b.hair || marks(a) !== marks(b)) continue;
    const shared = styleOf(a).filter((w) => styleOf(b).includes(w)); if (shared.length) pairs.push([a, b, shared]); }
  return pairs;
}

if (process.argv[1] && process.argv[1].endsWith('look-echoes.mjs')) {
  const all = personReads(); const looks = all.filter((x) => x.read); const pairs = lookEchoes(looks);
  console.log(`${looks.length} looks read in pre-K story and painting rows, ${all.length - looks.length} begun that it cannot read; ${pairs.length} pairs of people who may look alike (one group, the same course or the course before, hair and clothing in the same color families):\n`);
  for (const p of pairs) console.log(`- ${p[0].group}, ${p[0].hair} hair, ${p[0].clothing}${p.sameLesson ? ', one lesson' : ''}: ${p[0].serial} (${p[0].module}) "${p[0].words}" and ${p[1].serial} (${p[1].module}) "${p[1].words}"`);
  console.log(`\nLooks begun that it cannot read:\n`);
  for (const x of all.filter((y) => !y.read)) console.log(`- ${x.serial} (${x.module}), ${x.group}, ${x.why}: "${x.words}"`);
}
