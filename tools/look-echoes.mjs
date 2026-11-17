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
// look again is one person met again (Mia and Sam in several lessons), which is how the course reuses its people. Since pass NF (EARMARKS
// A97) the course before it in its own subject counts too (pre-K 4's First Sounds and Letters is read against pre-K 3's Listen and point,
// as well as against First Steps, the course one place before it in COURSES), since a child meets the subject's people a year apart.
// Since pass NQ (Mikey's answer to Q114, "Q114 - A": "Count skin, hairstyle and garment too, so two people set apart by any of them no
// longer count as alike") each look is also read for its skin (the words just before "skin", put in a family, SKIN_FAMILIES), its
// hairstyle (the style words) and its garment (the garment word, plain synonyms joined), and two people echo only when their hair and
// clothing families, their hairstyle and their garment all match and their skin does not set them apart: anything that differs sets
// two people apart, since a child tells people apart by their whole look. Skin is written in the rows from pass NI's serials on (Mikey's
// answer to Q99) and in an older row as its lesson is read again; a look whose skin is not written has skin null, which never sets two
// people apart. The hair readings (hairPairs, hairNearPairs) still read hair alone, whatever the clothing, and skin joins the marks that
// set two people apart there.
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
// Skin families (pass NQ, Mikey's answer to Q114, "Q114 - A"), first match wins, so a compound is read before its parts (light tan is
// light, before tan; light brown is tan, before brown). Three, each a skin a small child names in one word: light (pale white, fair,
// light, and light tan, a light skin with a little warmth, which beside fair or light a child sees as one light skin), tan (tan,
// olive-toned tan and light brown, between the two), and brown (medium, warm, deep and dark brown). Two people in two families differ at
// a glance; two in one family read alike, and where that was in doubt the families were joined, since fewer, broader families keep the
// check strict (pale white beside light tan, and medium brown beside deep brown, are the widest steps inside one family). A skin written
// in words no family names is read as unwritten, which never sets two apart, and the ledger test holds every pre-K row's skin to a family.
export const SKIN_FAMILIES = [['light', /\blight[- ]tan\b/], ['tan', /\b(?:light[- ]brown|olive-toned|olive)\b/],
  ['brown', /\b(?:medium[- ]brown|warm[- ]brown|deep[- ]brown|dark[- ]brown)\b/], ['tan', /\btan\b/], ['brown', /\b(?:brown|dark|deep)\b/],
  ['light', /\b(?:pale|white|fair|light|peach|ivory|rosy)\b/]];
// The words that say a look's skin: up to three words just before "skin", from the last word that joins them to the hair or the face
// ("short black twists and warm brown skin" is warm brown, "a boy with olive-toned tan skin" olive-toned tan); null when no skin is written.
const skinWordsOf = (text) => { const m = /((?:[a-z]+(?:-[a-z]+)*,? ){1,3})skin\b/.exec(String(text).toLowerCase()); if (!m) return null;
  const words = m[1].trim().split(' '); let i = words.length; while (i > 0 && !/^(?:and|with|has|her|his|a|an)$|,$/.test(words[i - 1])) i--; return words.slice(i).join(' ') || null; };
const GARMENTS = 't-shirt|shirt|sweater|cardigan|hoodie|sundress|dress|pinafore|jacket|coat|vest|polo|blouse|pajamas|jumpsuit|overalls|onesie|romper|henley|fleece|sweatshirt|bathrobe|robe|parka|raincoat|poncho|jumper|tunic|top';
const CLOTHING = new RegExp('\\b(?:in|into|wearing|and) (?:an? |her |his )?((?:[a-z]+(?:-[a-z]+)* ){0,3}?)(' + GARMENTS + ')\\b');
// A garment named by two words for the same thing is one garment (pass NQ, Q114 (a)): a bathrobe is a robe. Only plain synonyms join; a
// kind of a garment keeps its own word (a sundress beside a dress, a raincoat beside a coat, a t-shirt beside a shirt), and jumper joins
// neither, since it is a sweater in British English and a pinafore in American English. The pre-K rows today write bathrobe and never
// robe, so no pair turns on it.
const GARMENT_SAME = { bathrobe: 'robe' };
const HAIR_WORDS = /hair|haircut|bob|ponytail|pigtails|afro|curls|pixie|bun|braid|mohawk|puffs|mop|topknot|crew cut|buzz|locs|dreadlocks|twists|cornrows|bald|shaved head/;
const STYLE = /\b(?:long|short|curly|straight|wavy|bob|bowl|fade|ponytail|pigtails|afro|curls|pixie|buns?|braids?|mohawk|puffs|mop|topknot|crew cut|buzz|locs|dreadlocks|twists|cornrows|bangs|spiky|loose|shoulder-length|chin-length|bald)\b/g;
const family = (table, text) => { for (const [name, re] of table) if (re.test(text)) return name; return null; };

// Every person a pre-K story or painting row begins a look for (a person word, then with or who has): its serial, lesson, course (and
// its place among the pre-K courses) and group, and, where the look can be read, its hair and clothing families and the look itself
// (the families with the hair's style words and the garment); a look begun that cannot be read (no hair word it knows, no color it
// knows, no garment) is returned with read false and why, so a test can hold a new row to none. Since pass NQ (Q114 (a)) a look read
// also keeps its hairstyle (the style words, as the look holds them), its garment (the garment word, plain synonyms joined), its skin
// family (null when no skin is written, or when the words name no family) and skinWords, the words that say its skin (null when none).
export function personReads(artText = readFileSync(new URL('../docs/ART-REQUESTS.md', import.meta.url), 'utf8'), courses = COURSES) {
  const prek = courses.filter((c) => /^PK/.test(c.grade)); const where = new Map();
  prek.forEach((c, place) => { for (const m of c.modules) where.set(m.id, { course: c.id, place, subject: c.subject, grade: c.grade }); });
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
      // color or a bow's is never the hair's; a word joined by hyphens is one word (salt-and-pepper). Since pass NQ a piece that says
      // the skin is passed over, so a look that writes its skin first ("warm brown skin and short black hair") keeps its hair black.
      const ownHair = hairText.split(/\s(?:streaked|tied|under|with|and|in)\s/).find((piece) => !/\bskin\b/.test(piece)) || '';
      const hair = family(HAIR_FAMILIES, ownHair); const clothing = worn ? family(CLOTHING_FAMILIES, worn[1]) : null;
      if (!hair || !clothing) { out.push({ ...base, read: false, why: !hair ? 'no hair color' : !worn ? 'no garment' : 'no clothing color', words: said }); return; }
      const style = (hairText.match(STYLE) || []).sort().join(' ');
      // The skin is read from the look's own words before its garment, where every row writes it (pass NQ, Q114 (a)).
      const skinWords = skinWordsOf(seg.slice(intro[0].length, worn.index)); const skin = skinWords ? family(SKIN_FAMILIES, skinWords) : null;
      out.push({ ...base, read: true, hair, clothing, hairstyle: style, garment: GARMENT_SAME[worn[2]] || worn[2], skin, skinWords, look: hair + ' ' + style + ' / ' + clothing + ' ' + worn[2], words: said }); }); }
  return out;
}
// The looks read, as before the third read.
export const personLooks = (artText, courses) => personReads(artText, courses).filter((x) => x.read);
// Two looks a child could meet near together (EARMARKS A97, pass NF): in the same course, the course one place before it in COURSES, or the
// course of the same subject in the other pre-K grade (Listen and point and First Sounds and Letters, Very first steps and First Steps).
export const coursesNear = (a, b) => Math.abs(a.place - b.place) <= 1 || (a.subject === b.subject && a.grade !== b.grade);
// The reading through pass NE, the same course or the one place before it in COURSES, which the ledger test's older checks keep, since their
// waiting counts and named pairs were taken by it (the wide reading's own check holds a new row to none and counts the older pairs only it finds).
export const coursesBefore = (a, b) => Math.abs(a.place - b.place) <= 1;

// Skin sets two people apart only when both are written and their families differ (pass NQ, Q114 (a)): a skin not written, in the rows
// before pass NI or in words no family names, never does, so a person met again in a row that now writes their skin is still one look.
const skinApart = (a, b) => !!a.skin && !!b.skin && a.skin !== b.skin;
// A hairstyle is its style words, a word in its forms one word (curly and curls, as hairNearPairs reads them since pass ND) and a word
// said twice once, so "short black curls" and "short curly black hair" are one hairstyle (pass NQ, Q114 (a)).
const hairstyleOf = (x) => [...new Set(String(x.hairstyle || '').split(' ').filter(Boolean).map((w) => NEAR_FORMS[w] || w))].sort().join(' ');
// Each look once per lesson: the same person in every picture of a story is one look. Two people of one lesson whose looks are written
// alike but whose skin differs stay two (pass NQ), so neither is lost to the other's look.
const oncePerLesson = (looks) => { const once = new Map(); for (const x of looks) { const key = x.module + '|' + x.group + '|' + x.look + '|' + x.skin; if (!once.has(key)) once.set(key, x); } return [...once.values()]; };

// Every pair of looks of one group, near together by near (coursesNear unless a caller says otherwise), whose hair and clothing families
// both match, and since pass NQ (Mikey's answer to Q114, "Q114 - A") whose hairstyle and garment match too and whose skin does not set
// them apart: two people set apart by any of these no longer count as alike. Each look is read once per lesson. same says the two looks
// are one look (in two lessons, a person met again, or someone given another's look), and sameLesson says both are in one lesson (two
// people in one story who look alike).
export function lookPairs(looks = personLooks(), near = coursesNear) {
  const xs = oncePerLesson(looks); const pairs = [];
  for (let i = 0; i < xs.length; i++) for (let j = i + 1; j < xs.length; j++) { const a = xs[i]; const b = xs[j];
    if (a.group === b.group && near(a, b) && a.hair === b.hair && a.clothing === b.clothing && hairstyleOf(a) === hairstyleOf(b) && a.garment === b.garment && !skinApart(a, b)) pairs.push(Object.assign([a, b], { same: a.look === b.look, sameLesson: a.module === b.module })); }
  return pairs;
}
// The echoes a reader looks at: two looks that differ, in one lesson or two (the same look in two lessons is taken as a person met
// again, which the ledger test asks a new row to name).
export const lookEchoes = (looks = personLooks(), near = coursesNear) => lookPairs(looks, near).filter((p) => !p.same);

// Two people of one kind whose hair is written alike, whatever they wear (pass NC, round two's content read: Astrid's mom's long blond
// hair in a loose braid was S4039's mom's, and Emeka's short wavy black hair the boy's of S3987 and S161, which lookPairs passed since
// their clothing differed): the same hair family and the same style words, at least one of them, in the same course or the course
// before, the looks themselves differing. A beard, a goatee, a mustache, glasses, graying or freckles that one has and the other does
// not sets two apart (a dad with short brown hair and a beard beside one with short brown hair and glasses). The hair part is read
// trimmed, since a look keeps a space before its slash and "black " passed the style-word test with a color alone (round two's code
// read: 17 of the 47 pairs then waiting named no style). Clothing and garment stay out of it on purpose, whatever Q114 (a) counts in
// lookPairs, since Astrid's mom's long blond braid echoed S4039's mom's in a coral blouse beside a sky-blue sweater. Since pass NQ skin
// joins the marks that set two people apart (two skins written in two families), since a child tells two people with the same hair apart
// by their skin: Claude's reading of Q114 (a) for the hair checks (Mikey's answer, "Q114 - A").
const MARKS = /\b(?:beard|goatee|mustache|glasses|graying|freckles)\b/g;
export function hairPairs(looks = personLooks(), near = coursesNear) {
  const hairOf = (x) => x.look.split(' / ')[0].trim(); const marks = (x) => (x.words.match(MARKS) || []).sort().join(' ');
  const xs = oncePerLesson(looks); const pairs = [];
  for (let i = 0; i < xs.length; i++) for (let j = i + 1; j < xs.length; j++) { const a = xs[i]; const b = xs[j];
    if (a.group === b.group && near(a, b) && a.look !== b.look && hairOf(a) === hairOf(b) && hairOf(a).includes(' ') && marks(a) === marks(b) && !skinApart(a, b)) pairs.push(Object.assign([a, b], { sameLesson: a.module === b.module })); }
  return pairs;
}

// Hair near alike (pass ND, round one's story check): two people of one kind, near together by near (as lookPairs reads it), whose hair is
// the same color family and shares at least one style word that sets a look (a bob, pigtails, chin-length, curly, braids), since
// hairPairs asks for every style word alike and passed "a chin-length brown bob" beside "chin-length curly brown hair". The words
// short, long, straight and loose are too common to set a look alone, and freckles, which a picture this size hardly shows, never set
// two apart here; a beard, a goatee, a mustache, glasses or graying still do, and since pass NQ skin does, two skins written in two
// families (Claude's reading of Q114 (a) for the hair checks, as in hairPairs). Returns [a, b, shared words] for each pair.
const NEAR_COMMON = new Set(['short', 'long', 'straight', 'loose']);
// A style word in its forms is one word (pass ND, round two's alignment read: "short black curls" passed beside "short black curly hair").
// Since pass NQ lookPairs reads a hairstyle's words by it too (hairstyleOf).
const NEAR_FORMS = { curly: 'curls', braids: 'braid', buns: 'bun', dreadlocks: 'locs' };
const NEAR_MARKS = /\b(?:beard|goatee|mustache|glasses|graying)\b/g;
export function hairNearPairs(looks = personLooks(), near = coursesNear) {
  const styleOf = (x) => x.look.split(' / ')[0].trim().split(' ').slice(1).filter((w) => w && !NEAR_COMMON.has(w)).map((w) => NEAR_FORMS[w] || w); const marks = (x) => (x.words.match(NEAR_MARKS) || []).sort().join(' ');
  const xs = oncePerLesson(looks); const pairs = [];
  for (let i = 0; i < xs.length; i++) for (let j = i + 1; j < xs.length; j++) { const a = xs[i]; const b = xs[j];
    if (a.group !== b.group || !near(a, b) || a.look === b.look || a.hair !== b.hair || marks(a) !== marks(b) || skinApart(a, b)) continue;
    const shared = styleOf(a).filter((w) => styleOf(b).includes(w)); if (shared.length) pairs.push([a, b, shared]); }
  return pairs;
}

// The command line, for a reader (since pass NQ it says the skin, hairstyle and garment it counts, Q114 (a)): every echo with what the
// two share, the skin families it read, the hair readings' counts, any skin written in words no family names, and the looks it cannot read.
if (process.argv[1] && process.argv[1].endsWith('look-echoes.mjs')) {
  const all = personReads(); const looks = all.filter((x) => x.read); const pairs = lookEchoes(looks);
  const skins = {}; for (const x of looks) if (x.skin) skins[x.skin] = (skins[x.skin] || 0) + 1;
  const skinSaid = Object.entries(skins).map(([k, n]) => `${k} ${n}`).join(', ') || 'none';
  console.log(`${looks.length} looks read in pre-K story and painting rows, ${all.length - looks.length} begun that it cannot read. Since pass NQ (Mikey's answer to Q114, "Q114 - A") two people count as alike only when their hair and clothing color families, their hairstyle (the style words) and their garment all match and their skin does not set them apart; skin is read in ${looks.filter((x) => x.skinWords).length} looks (${skinSaid}) and unwritten in the rest, which never sets two apart. ${pairs.length} pair${pairs.length === 1 ? '' : 's'} of people who may look alike (one group, the same course, the course before or after it, or the course of the same subject in the other pre-K grade):\n`);
  const skinOf = (x) => (x.skin ? `${x.skin} skin` : 'skin unwritten');
  for (const p of pairs) console.log(`- ${p[0].group}, ${p[0].hair} hair${hairstyleOf(p[0]) ? ' (' + hairstyleOf(p[0]) + ')' : ''}, ${p[0].clothing} ${p[0].garment}, ${skinOf(p[0])} and ${skinOf(p[1])}${p.sameLesson ? ', one lesson' : ''}: ${p[0].serial} (${p[0].module}) "${p[0].words}" and ${p[1].serial} (${p[1].module}) "${p[1].words}"`);
  console.log(`\nThe hair readings, whatever the clothing (skin sets two apart there too since pass NQ): ${hairPairs(looks).length} pair${hairPairs(looks).length === 1 ? '' : 's'} whose hair is written alike (hairPairs), ${hairNearPairs(looks).length} that share a style word and a hair color (hairNearPairs).`);
  const unplaced = looks.filter((x) => x.skinWords && !x.skin);
  console.log(`\nSkin written in words no skin family names (read as unwritten):${unplaced.length ? '\n' : ' none.'}`);
  for (const x of unplaced) console.log(`- ${x.serial} (${x.module}), ${x.group}: "${x.skinWords} skin"`);
  console.log(`\nLooks begun that it cannot read:\n`);
  for (const x of all.filter((y) => !y.read)) console.log(`- ${x.serial} (${x.module}), ${x.group}, ${x.why}: "${x.words}"`);
}
