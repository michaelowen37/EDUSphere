// The audio ledger (2026-10-04, pass JH, Mikey). In plain terms: every clip the app can play in a recorded voice, with the exact
// words to send to ElevenLabs' Eleven v4 model, its audio tags, and the file name the app already looks for (audio/<key>.mp3).
// Stories play paragraph by paragraph, so each paragraph is a clip (S95-0 is a story's title, S95-1 its first paragraph);
// pre-reader lessons play sentence by sentence (red-and-blue-0-1 is the lesson's line 0, sentence 1). Tags shape the voice and
// never reach the screen: a story may carry hand-written tags in its `audio` field (src/stories.mjs), and every clip starts with
// the voice direction for its age band. Every clip, and every whole story, stays far under Eleven v4's 10,000 characters.
// Since pass MW (Mikey: "I'm not reviewing any more audio for now since it's kind of pointless.  Makes more sense to review it after
// Eleven Labs.  Just be sure to add emphasis tags and descriptions within the audio ledger for Eleven.  It will be easier to test
// later within the artifact instead of opening several browsers and hunting down sounds.") every row also says in plain words what
// the clip should sound like (description), for whoever makes it and for the listening in the app once it is made; a lesson line
// asks Eleven to stress what the app's own voice stresses, in capitals, which Eleven v4 reads as emphasis ("Capitalization increases
// emphasis", ElevenLabs' best practices), and to say each of the app's speech sounds in the phonetic alphabet between slashes and in
// double quotes, as the guide asks of IPA in a text (documented for words and names, and "results can still vary by voice and
// phrase", so every clip with a sound is heard before use); and the app's own sounds have rows of their own (sound-<name>, SOUND_RECORDINGS in logic.mjs): a speech sound
// for the voice, and the cheer's whistle and crowd for ElevenLabs' sound effects, each with the seconds, the influence and the number
// of takes tools/audio-generate.mjs asks for.
// Run: node tools/audio-ledger.mjs > docs/AUDIO-LEDGER.md   (it also writes docs/AUDIO-LEDGER.csv, which tools/audio-generate.mjs reads)
import { writeFileSync } from 'node:fs';
import { COURSES, readAloudScript, SENTENCE_BREAK, GAMES, gameIntro, gameBand, cheerTagged, sayAlongParts, storyTitleSpoken, mannerOf, VOICE_MANNERS, speechPieces, SOUND_RECORDINGS, SPEECH_SOUNDS, TRIAL_SOUNDS, SAY_ALONG_VOICES, soundOfNotation, VOICE_SOUNDS, ipaQuoted, goalTag, SOUND_GOAL_TAGS, BEAT_RUNS, NS_PAIRS, VOWEL_WORDS, namesWordSounds, ONE_BREATH_LESSONS } from '../src/logic.mjs';
// The voice's own sounds' symbols live in logic.mjs since round one's code check (one source); the ledger keeps its old export.
export { VOICE_SOUNDS };
import { STORIES, COURSE_STORIES, MASTERY_STORIES } from '../src/stories.mjs';

// Voices by age (Mikey, pass JH). The directions are short on purpose: one opens every clip, and ElevenLabs counts tags as characters.
// Voices by age (Mikey, pass JH): warm and pleasant everywhere, never over-excited; young learners hear words drawn out and
// stressed the way a favorite preschool teacher says them; older learners hear a warm, engaging voice that never talks down.
const band = (g) => { const s = String(g); if (/^pk/i.test(s) || /^k$/i.test(s) || s === '1' || s === '2') return 'early'; if (['3', '4', '5'].includes(s)) return 'elementary'; if (['6', '7', '8'].includes(s)) return 'middle'; return 'older'; };
export const DIRECTION = {
  early: '[warm and gentle, drawing out key words]',
  // A story for the youngest (pass MP, Mikey: "Here is a video with great story telling cadence for early learners.  It's nice and calm
  // and slow and she does a great job using different voices for different characters.", a picture book read aloud on the Story
  // Time channel): calm and unhurried, and a voice of its own for each character who speaks; kept short, since every early story
  // clip carries it (round one's accuracy check counted the longer first wording at about 50,000 more characters), and a story's
  // own [pause] tags give the pauses.
  earlyStory: '[calm and unhurried, a voice for each character]',
  elementary: '[warm and friendly]',
  middle: '[warm and natural]',
  older: '[warm, conversational]',
  title: '[warm]',
  question: '[warm, pleasant, mildly upbeat]',
  game: '[warm, playful and upbeat]',
  // A game's welcome from grade 3 up (round two's alignment read, pass MP): upbeat and engaging, as Mikey asked ("exciting and fun"),
  // without the playful read the youngest hear, since older learners hear a voice that never talks down (pass JH).
  gameMain: '[warm, upbeat and engaging]',
};
const sentencesOf = (t) => String(t || '').split(SENTENCE_BREAK).filter(Boolean);   // the same split the app uses (src/ui.jsx, SENTENCE_BREAK since pass MN)
// The say-along's own words, as the recorded voice is asked to say them (pass MT, Mikey's answer to Q77): his opener "(In an excited
// and emphasized voice)", the calls in his "playful conversational tone", and the praise.
export const SAY_ALONG_TALK = { open: '[excited, with big emphasis]', call: '[playful and conversational, like a favorite preschool teacher]', praise: '[delighted, cheering]' };
// Each voice direction in plain words, for the descriptions (pass MW).
export const VOICE_WORDS = {
  early: "a warm, gentle teacher's voice for a young child, drawing out the key words",
  // A line that is a run of beats (BEAT_RUNS) is never drawn out, since each beat is short and even (pass MY, round two).
  earlyBeats: "a warm, gentle teacher's voice for a young child",
  // Nor is a lesson line that says a word of a near pair (NEAR_DIRECTION, pass MZ, round two's code check).
  earlyNear: "a warm, gentle teacher's voice for a young child, each word said clearly",
  earlyStory: 'told calm and unhurried to a young child, with a voice of its own for each character who speaks, the same each time',
  elementary: 'a warm, friendly voice', middle: 'a warm, natural voice', older: 'a warm, conversational voice that never talks down',
  game: 'warm, playful and upbeat, for a young player', gameMain: 'warm, upbeat and engaging, never talking down',
};
// How each voice a lesson shows should sound, in plain words (VOICE_MANNERS; the rules test holds every manner to an entry).
export const MANNER_HEARD = {
  whisper: 'as a real whisper, breathy, with no full voice', inside: 'in a calm, everyday inside voice, not too loud and not too soft',
  outside: 'calling out in a big outside voice, as to a friend far away across a playground', kind: 'in a kind, soft, gentle voice',
  high: 'way up high, like a little bird', low: 'way down low, like a big bear', ask: 'as a question, the voice rising at the end',
  tell: 'as telling, the voice falling at the end', happy: 'happily, bright and up high', sad: 'sadly, slow, soft and low',
  strong: 'with the word in capitals strong, louder and a little slower, and the rest as usual',
};
// A pattern's special characters escaped, so a word or a sound is matched as written.
const escapeRe = (t) => String(t).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// A table's own entry, or null (round one's code check: the word constructor read Object's own constructor from a plain table).
const ownOf = (table, key) => (Object.hasOwn(table, key) ? table[key] : null);
// A token written as a sound (the A42 check's own rule in tests/logic.test.mjs): a consonant or two and uh, a letter written three
// times or more, shh or ks, or a sound the app knows.
const sounded = (w) => !!w && (/^(?:[bcdfghjklmnpqrstvwxyz]{1,2}uh|([a-z])\1{2,}|shh|ks)$/i.test(w) || !!soundOfNotation(w));
// What Eleven is asked to say for one sentence of a lesson line (pass MW), read from the pieces the app's own voice says it in
// (speechPieces, on trial, so a vowel letter in a run of sounds is its sound): each of the app's speech sounds in the phonetic
// alphabet between slashes and in double quotes, as ElevenLabs asks of IPA in a text (SOUND_RECORDINGS' and VOICE_SOUNDS' symbols,
// ipaQuoted; the guide documents IPA for words and names, so each clip with a sound is heard before use); each word the app's voice
// draws out inside a longer sentence (a word of a list that starts or ends alike, "Dog, log and frog all rhyme.") in capitals, which
// Eleven reads as emphasis; a letter named as a letter as its capital, which Eleven is expected to say by its name (undocumented, so
// each such clip is heard before use), and since round one the letter A, which could be read as the word a, as its name in the
// phonetic alphabet, since round two wherever it is not the article (isLetterNamed: "/eɪ/" says, Apple starts with "/eɪ/", but
// A dog runs.); the lesson's word in the say-along's
// sentence that names it ("Our word is RED.") in capitals; and since round one each word a line asks to stress (its stress list,
// for the ledger alone: the word that changes, dogs, kicked, buses) in capitals wherever the sentence says it. A sentence said in a
// manner keeps its words (its tag says how; a strong word is already in capitals). missed lists any piece not found in the words,
// which the scripts test holds to none.
// A letter named as a letter (pass MW, round two's code read: fifteen lesson lines that teach letters sent a bare A, "Apple starts
// with A."), read by one rule in a lesson line, a story and a title: any lone capital but I; A unless it is the article, which starts a
// sentence or follows a comma and comes before a word, a letter included ("A T, dripping a little!", round two's lead), but not a word
// that tells what the letter does or has (and, or, is, was, says, sounds, starts, comes, has, makes, looks, goes, stands, ends or
// begins: "A starts at its top point.", the third read); and a small a after the, an, letter or letters, big, small or little, or
// before a comma or a stop, or before and or or and another letter ("The letters a, e, i, o and u", "The a is short", the third
// read). A vowel set off among speech sounds is a sound, not a letter, which elevenSentence decides first. w is the one-letter word
// found at [at, end) in s.
export function isLetterNamed(s, at, end, w) {
  if (w === 'a') return /\b(?:the|an|letters?|big|small|little)\s+$/i.test(s.slice(0, at)) || /^(?:[,.!?;:]|\s+(?:and|or)\s+[a-z](?![A-Za-z]))/.test(s.slice(end));
  if (!/^[A-Z]$/.test(w) || w === 'I') return false;
  if (w !== 'A') return true;
  const nextWord = (/^\s*([A-Za-z][A-Za-z-]*)/.exec(s.slice(end)) || [])[1] || '';
  const article = /(^|[.!?,:]\s+|^\s*)$/.test(s.slice(0, at)) && nextWord.length > 0 && !/^(?:and|or|is|was|says|sounds|starts|comes|has|makes|looks|goes|stands|ends|begins)$/i.test(nextWord);
  return !article;
}
export function elevenSentence(sentence, { voices = null, word = null, stress = [], once = false } = {}) {
  const s = String(sentence); const out = { text: s, sounds: [], stressed: [], letters: [], missed: [], onlySounds: false, voiceSounds: [], vowelWords: [], run: false, once: false };
  if (mannerOf(s, voices)) return out;
  const words = s.replace(/[.!?]+$/, '').trim().split(/\s+/).filter(Boolean);
  const pieces = speechPieces(s, { trial: true }); const edits = []; let cursor = 0;
  const find = (text, from) => { const m = new RegExp('(?<![A-Za-z])' + escapeRe(text) + '(?![A-Za-z])', 'i').exec(s.slice(from)); return m ? { at: from + m.index, len: m[0].length } : null; };
  for (const piece of pieces) {
    if (piece.sound) {
      const rec = ownOf(SOUND_RECORDINGS, piece.sound); const f = find(piece.text, cursor);
      if (!rec || !rec.ipa || !f) { out.missed.push(piece.text); continue; }
      edits.push({ ...f, put: rec.ipa, ipa: true, name: piece.sound, goal: rec.goal }); out.sounds.push(piece.sound); cursor = f.at + f.len; continue;
    }
    if (piece.shape === 'key' && words.length > 1) {
      const f = find(piece.text, cursor); if (!f) { out.missed.push(piece.text); continue; }
      const found = s.slice(f.at, f.at + f.len); const lead = /^(?:the|and)\s+/i.exec(found); const rest = lead ? found.slice(lead[0].length) : found;
      const isA = rest.toUpperCase() === 'A';   // the letter A as its name, since a capital A alone can be read as the word a
      edits.push({ ...f, put: (lead ? lead[0] : '') + (isA ? '/eɪ/' : rest.toUpperCase()), ipa: isA });
      (rest.length === 1 ? out.letters : out.stressed).push(rest.toUpperCase()); cursor = f.at + f.len; continue;
    }
    const plain = String(piece.text).trim(); const at = plain ? s.indexOf(plain, cursor) : -1; if (at >= 0) cursor = at + plain.length;
  }
  // Then the tokens the pieces leave to the voice: huh, wuh, shh and ks where the sentence uses sounds; the letter A named as a
  // letter wherever it is not the article (isLetterNamed, above), a small a among sounds left to the next rule; and a vowel letter set off by commas or hyphens beside a sound, which the lesson means as
  // its short sound (the A42 rule: "Huh, a, tuh." is hat), never as the letter's name, as the device voice says it today (EARMARKS A42).
  const toks = [...s.matchAll(/[A-Za-z]+/g)].map((m) => ({ w: m[0], at: m.index, end: m.index + m[0].length }));
  const covered = (k) => edits.some((e) => k.at < e.at + e.len && e.at < k.end);
  const usesSounds = out.sounds.length > 0 || toks.some((k) => sounded(k.w));
  let vowelRun = false;
  toks.forEach((k, i) => {
    if (covered(k)) return;
    // A long vowel the voice says as a word (pass NC, VOWEL_WORDS), set off by a comma or an and right after a speech sound in a run of a
    // word's sounds (Buh, oh, tuh; shh and ooh), is that vowel's sound, never the word oh or eye, so it goes in the phonetic alphabet with
    // its goal; an exclamation (Oh, look!) or a body's eye is left as it is.
    const vw = ownOf(VOWEL_WORDS, k.w.toLowerCase()); const prev = toks[i - 1] && /^and$/i.test(toks[i - 1].w) ? toks[i - 2] : toks[i - 1];
    if (vw && prev && (sounded(prev.w) || covered(prev)) && /^\s*(?:,\s*|,?\s+and\s+)$/i.test(s.slice(prev.end, k.at))) { edits.push({ at: k.at, len: k.end - k.at, put: vw.ipa, ipa: true, goal: vw.goal }); out.vowelWords.push(k.w.toLowerCase()); return; }
    const vs = ownOf(VOICE_SOUNDS, k.w.toLowerCase());
    // Since round one's story flow check a voice sound beside the app's own sounds counts them too (Huh, at), not only another sound
    // the tool matches by name: "Huh, at." had sent Huh as letters, which Eleven reads as the word.
    if (vs && usesSounds && (out.sounds.length > 0 || toks.some((o) => o !== k && sounded(o.w)) || namesWordSounds(s))) { edits.push({ at: k.at, len: k.end - k.at, put: vs.ipa, ipa: true, goal: vs.goal }); out.voiceSounds.push(k.w.toLowerCase()); return; }
    if ((k.w === 'A' || (k.w === 'a' && !(usesSounds && [toks[i - 1], toks[i + 1]].some((o) => o && sounded(o.w))))) && isLetterNamed(s, k.at, k.end, k.w)) { edits.push({ at: k.at, len: 1, put: '/eɪ/', ipa: true }); out.letters.push('A'); return; }
    if (!/^[aeiou]$/i.test(k.w)) return;
    const before = s.slice(0, k.at).replace(/\s+$/, ''); const after = s.slice(k.end).replace(/^\s+/, '');
    const setOff = (before === '' || /[,-]$/.test(before)) && (after === '' || /^[,.!?-]/.test(after));
    if (setOff && (sounded((toks[i - 1] || {}).w) || sounded((toks[i + 1] || {}).w))) { edits.push({ at: k.at, len: 1, put: SOUND_RECORDINGS[k.w.toLowerCase()].ipa, ipa: true, name: k.w.toLowerCase(), goal: SOUND_RECORDINGS[k.w.toLowerCase()].goal }); out.sounds.push(k.w.toLowerCase()); vowelRun = true; }
  });
  // A run of sounds that blend into a word says each sound once: sss, fff and zzz one held breath there (SOUND_RECORDINGS' one). A run
  // holds a vowel's sound among other sounds ("Cuh, a, nnn."); a sentence of sounds alone with no vowel ("Sss, sss, sss.") is no blend,
  // and keeps its two breaths each, as the app plays it (round one's code check).
  const soundsOnly = words.every((w) => sounded(w.replace(/[^A-Za-z]/g, '')) || /^[aeiou]$/i.test(w.replace(/[^A-Za-z]/g, '')));
  const vowelPiece = pieces.some((x) => x.sound && /^[aeiou]$/.test(x.sound));
  // Since pass NC a sentence that names a word's sounds with a long vowel the voice says (Sss, oh, puh) is a run too (namesWordSounds), so
  // its hiss is one breath, as the app plays it there (onceInRun).
  out.run = vowelRun || namesWordSounds(s) || (vowelPiece && soundsOnly && pieces.filter((x) => x.sound).length > 1);
  // Since round one's lesson check (pass NC) a phoneme lesson's line asks for one breath for every hiss (once: ONE_BREATH_LESSONS), as
  // the app plays it there, where a child counts a word's sounds.
  out.once = out.run || !!once;
  if (out.once) for (const e of edits) { const rec = e.name ? ownOf(SOUND_RECORDINGS, e.name) : null; if (rec && rec.one) { e.put = rec.one; e.goal = rec.goalOne; } }
  // Since pass MX a sound's goal goes right before its symbols (goalTag); a mark holds its place until the capitals are written, so a
  // stress word or the say-along's word is never capped inside a goal (dog, in og's goal).
  const goalsAt = []; let text = s;
  for (const e of [...edits].sort((a, b) => b.at - a.at)) { let put = e.ipa ? ipaQuoted(e.put) : e.put; if (e.goal) { put = '\u0001' + goalsAt.length + '\u0002' + put; goalsAt.push(goalTag(e.goal)); } text = text.slice(0, e.at) + put + text.slice(e.at + e.len); }
  if (word) {
    const re = new RegExp('(?<![A-Za-z])' + String(word).split(/\s+/).map(escapeRe).join('\\s+') + '(?![A-Za-z])', 'gi'); const all = [...text.matchAll(re)];
    if (all.length) { const last = all[all.length - 1]; text = text.slice(0, last.index) + last[0].toUpperCase() + text.slice(last.index + last[0].length); out.stressed.push(last[0].toUpperCase()); } else out.missed.push(word);
  }
  for (const w of stress || []) {
    const re = new RegExp('(?<![A-Za-z])' + String(w).split(/\s+/).map(escapeRe).join('\\s+') + '(?![A-Za-z])', 'gi'); let hit = false;
    text = text.replace(re, (m) => { hit = true; return m.toUpperCase(); });
    if (hit && !out.stressed.includes(String(w).toUpperCase())) out.stressed.push(String(w).toUpperCase());
  }
  text = text.replace(/\u0001(\d+)\u0002/g, (m, i) => goalsAt[Number(i)] + ' '); out.goals = goalsAt.length;
  out.text = text; out.onlySounds = words.length > 0 && words.every((w) => { const bare = w.replace(/[^A-Za-z]/g, ''); return sounded(bare) || (out.run && /^[aeiou]$/i.test(bare)); });
  return out;
}
// A row's description of its sounds, capitals and letters (pass MW), in plain words.
const soundLine = (n, once) => { const r = SOUND_RECORDINGS[n]; return once && r.one ? r.one + ' ' + r.short.replace(/, twice$/, ', once') : r.ipa + ' ' + r.short; };
const soundsSaid = (e, key, back) => { const all = [...new Set(e.sounds)].map((n) => soundLine(n, e.once || e.run)).concat([...new Set(e.voiceSounds || [])].map((n) => VOICE_SOUNDS[n].ipa + ' ' + VOICE_SOUNDS[n].short)).concat([...new Set(e.vowelWords || [])].map((n) => VOWEL_WORDS[n].ipa + ' ' + VOWEL_WORDS[n].short));
  return all.length ? ' Each sound in the phonetic alphabet between slashes (sent in double quotes, as ElevenLabs asks) is said as a sound, never as letters: ' + all.join('; ') + '.' + (e.run ? ' The sounds blend into a word, so each is said once.' : e.once && e.sounds.some((n) => SOUND_RECORDINGS[n] && SOUND_RECORDINGS[n].one) ? ' In this lesson a child counts a word\'s sounds, so a hiss is one breath, said once.' : '') + goalSaid(key, back) : ''; };
// What a row's description says of the goals (pass MX), with the row's own key, since the generator skips a clip already made: a take
// that reads a goal aloud is deleted and made again as it is (the generator makes only what is missing), and if the new take fails
// too, it is deleted as well before the generator runs with the voices used before and --only <key> --no-goals, so no other row loses
// its goals (round one's audio check; round two's code read ran it and found the failed retake skipped). back says whether the
// line's own direction comes again after a sound (directionBack, below).
const goalSaid = (key, back) => " The bracket just before each sound's symbols tells Eleven what the sound should be (Mikey, pass MX)" + (back ? ", and the line's own direction comes again after a sound, before the words that follow it, since a tag carries forward across the line" : '') + '. If a take reads a bracket aloud or sounds like a sound effect, delete that take and run the generator again, which makes only what is missing; if the new take fails too, delete it as well and run ELEVENLABS_API_KEY=... node tools/audio-generate.mjs with the voices you used before and --only ' + key + ' --no-goals (pasting into ElevenLabs, leave out each bracket before a sound).';
// Since round one's audio check (pass MX): a tag's delivery carries forward across the line (ElevenLabs' tags list: "When you add a
// tag, its emotion carries forward across the line, meaning you only need to introduce another tag when you want the delivery to
// shift."), so where two or more words follow a sound's symbols before the next goal or the line's end, the line's own direction
// comes again before them, and the words go back to the voice the line opened with. Between the sounds of a run, or with one word
// between two sounds ("Not ... , not ..."), nothing is put in; a sound's group is its symbol and the same symbol again (sss said
// twice), so the letter A's name after a sound ("/eɪ/") is a word that follows it.
export function directionBack(text, direction) {
  let out = ''; let rest = String(text);
  for (;;) {
    const hits = SOUND_GOAL_TAGS.map((g) => [rest.indexOf(g), g]).filter(([i]) => i >= 0).sort((a, b) => a[0] - b[0]);
    if (!hits.length) return out + rest;
    const [at, g] = hits[0]; const after = rest.slice(at + g.length);
    const sym = /^ ("\/[^/"]+\/")(?:, \1)*/.exec(after); if (!sym) return out + rest;
    const end = at + g.length + sym[0].length; out += rest.slice(0, end); rest = rest.slice(end);
    const next = SOUND_GOAL_TAGS.map((t) => rest.indexOf(t)).filter((i) => i >= 0); const upTo = next.length ? Math.min(...next) : rest.length;
    const words = (rest.slice(0, upTo).replace(/"\/[^/"]+\/"/g, ' ').match(/[A-Za-z]+/g) || []).length;
    if (words >= 2) { const lead = /^[,.;!?]*\s*/.exec(rest)[0]; out += lead + direction + ' '; rest = rest.slice(lead.length); }
  }
}
const stressSaid = (e) => { const many = e.stressed.length > 1 || e.stressed.some((w) => /\s/.test(w)); const letters = [...new Set(e.letters)];
  const stress = e.stressed.length ? ' Stress the word' + (many ? 's' : '') + ' in capitals (' + e.stressed.join(', ') + ').' : '';
  const named = letters.length ? ' ' + letters.join(', ') + (letters.length > 1 ? ' are letters' : ' is a letter') + ', said by name' + (letters.includes('A') && e.text.includes('/eɪ/') ? ', the letter A written as its name, /eɪ/' : '') + '.' : '';
  return stress + named; };
// A say-along way's tag in plain words (one source: SAY_ALONG_VOICES), its brackets taken off.
const tagWords = (tag) => String(tag).replace(/^\[|\]$/g, '');
const rows = [];
// A row: its key, kind, source, grade, the words for Eleven, the screen's words, its group, and since pass MW its description and,
// for a sound effect, its seconds and influence, and for a sound, the takes to make.
const add = (key, kind, source, grade, text, plain, group, description = '', extra = {}) => rows.push({ key, kind, source, grade: String(grade), voice: extra.voice || (band(grade) === 'early' ? 'young' : 'main'), text, plain, group, description, seconds: extra.seconds ?? '', influence: extra.influence ?? '', takes: extra.takes ?? '' });
// A story's title and paragraphs in plain words (pass MW).
// A title's description, and since round one the sounds an early-years title writes as letters (Buh and sss), as a paragraph's.
// Since the third read a title names its letters too ("The small a sits low.").
function titleSaid(title, grade = null, art = null) { const sounds = grade && band(grade) === 'early' ? soundsWritten(title) + lettersNamed(title, BEATS_NOT_LETTERS[art] || []) : '';
  return 'The title of the story "' + title + '", said warmly, as a title is read aloud.' + sounds; }
// A tag that asks a stretch of a story to go quickly (round one's audio accuracy check; since round two's code read, quick and,
// out of breath and faster too, as in [slowly, then faster], and never [quick footsteps], a sound).
export const QUICK = /\[[^\]]*\b(?:rushed|hurried|quickly|quick and|breathless|out of breath|faster)\b[^\]]*\]/i;
// The sounds a story's words write as letters (Sss, buh, mmm), named for whoever makes the clip, each once however it is capitalized
// (round two's code read: Buh and buh were named twice).
export const soundsWritten = (words, { once = false } = {}) => { const seen = new Map();
  // Since pass NC a phoneme lesson's story says each hiss once (once: ONE_BREATH_LESSONS), as the app plays it there.
  const shortOf = (x) => { const r = SOUND_RECORDINGS[x.sound]; return once && r.one ? r.short.replace(/, twice$/, ', once') : r.short; };
  for (const x of speechPieces(String(words), { trial: true, ...(once ? { once: true } : {}) })) if (x.sound && ownOf(SOUND_RECORDINGS, x.sound) && !seen.has(x.text.toLowerCase())) seen.set(x.text.toLowerCase(), x.text + ', ' + shortOf(x));
  // Since round one's story check a sentence that names a word's sounds (Shh, ooh.) has its voice sounds and vowel words named though the
  // paragraph has none of the app's own sounds: S4079-5 had no sound direction, and Eleven might have played a hush and a wondering ooh.
  const runs = String(words).split(SENTENCE_BREAK).some((sentence) => namesWordSounds(sentence));
  // A voice sound said beside the app's own sounds is a sound too (pass NB, round one's story check: "Mmm, at, mat, and huh, at, hat!"
  // named mmm, at and sss but not huh, which Eleven may read as the questioning word), named after the app's sounds.
  if (seen.size || runs) for (const [k, v] of Object.entries(VOICE_SOUNDS)) { const m = new RegExp(`\\b${k}\\b`, 'i').exec(String(words)); if (m && !seen.has(k)) seen.set(k, m[0] + ', ' + v.short); }
  // Since pass NI (the story check): a voice sound a paragraph uses as a sound is named though the paragraph has none of the app's own
  // sounds, after says, said, starts with or ends with ("Y's name starts with wuh"), standing alone as a sentence ("Yuh!"), or in a short
  // run that ends on a word ("Yuh, yuh, yarn!", "Queen, kwuh, quilt!"), since Eleven can read "Yuh!" as "Yeah!" at a story's turn; a
  // voice sound asked as a question ("Huh?") or opening a longer sentence ("Shh, the baby is sleeping.") is a word, and left.
  for (const [k, v] of Object.entries(VOICE_SOUNDS)) { if (seen.has(k)) continue; const t = String(words);
    const asSound = [new RegExp(`\\b(?:says?|said|starts? with|ends? with)\\s+${k}\\b`, 'i'), new RegExp(`(?:^|[.!?]\\s+)${k}[.!]`, 'i'), new RegExp(`\\b${k},\\s+(?:${k},\\s+)*[A-Za-z]+[.!]`, 'i'), new RegExp(`\\b[A-Za-z]+,\\s+${k},\\s+[A-Za-z]+[.!]`, 'i')].some((r) => r.test(t));
    const m = asSound ? new RegExp(`\\b${k}\\b`, 'i').exec(t) : null; if (m) seen.set(k, m[0] + ', ' + v.short); }
  // Since pass NC a long vowel a sentence sets off in a run of a word's sounds (Buh, oh, tuh. Boat!) is named too, read sentence by sentence.
  if (seen.size || runs) for (const sentence of String(words).split(SENTENCE_BREAK)) if (namesWordSounds(sentence)) for (const [k, v] of Object.entries(VOWEL_WORDS)) { const m = new RegExp(`(?:[A-Za-z]+)\\s*(?:,\\s*|\\s+and\\s+)(${k})\\b`, 'i').exec(sentence); if (m && !seen.has(k)) seen.set(k, m[1] + ', ' + v.short); }
  const sounds = [...seen.values()];
  return sounds.length ? ' Say each sound written as letters as the sound itself, never as letters: ' + sounds.join('; ') + '.' : ''; };
// The letters a story names as letters (round two's code read: "C says cuh, A says the sound at the start of apple"), said by their
// names; a story keeps its words, so its description says how, the letter A above all, which a voice can read as the word a. skip
// leaves out a capital that is not a letter there (BEATS_NOT_LETTERS).
export const lettersNamed = (words, skip = [], { sung = false } = {}) => { const s = String(words); const found = [];
  // Since pass NE (round two's content read) a letter with 's ("At the end of N's name") is a letter named too, its 's taken off first.
  for (const m of s.matchAll(/[A-Za-z][A-Za-z'-]*/g)) { const tok = m[0].replace(/'s$/, ''); if (tok.length === 1 && isLetterNamed(s, m.index, m.index + 1, tok) && !skip.includes(tok.toUpperCase())) found.push(tok.toUpperCase()); }
  // Since pass NI (the story check): a run of three or more single letters set off by commas, small ones too ("H, e, c, t, o, r", a
  // name spelled aloud, or "L, T and F"), names every letter in it, said one at a time, since a lone small e can come out as "eh".
  // The run's letters come first, in the order they are spelled, and a run's last letter may follow and alone ("a, d, g and q").
  // Since the second story read (pass NI): a run keeps every letter it spells, a repeated one too ("S, h, e, l, l" is S, H, E, L and L,
  // where the set of its letters had dropped the second L), each run once, the row's other letters after it; and a run inside a sung
  // clip (sung: its tags say singing, as the alphabet song's do) asks for the letters sung, each one clear, where "Say" sat over a song.
  let spelled = false; const runs = [];
  for (const m of s.matchAll(/(?<![A-Za-z'])[A-Za-z](?:(?:,\s+(?:and\s+)?|\s+and\s+)[A-Za-z](?![A-Za-z'])){2,}/g)) { spelled = true; const r = []; for (const l of m[0].replace(/\band\b/g, '').match(/[A-Za-z]/g)) if (!skip.includes(l.toUpperCase())) r.push(l.toUpperCase()); if (r.length && !runs.some((x) => x.join() === r.join())) runs.push(r); }
  const run = runs.flat(); const ls = [...run, ...[...new Set(found)].filter((l) => !run.includes(l))]; if (!ls.length) return '';
  const list = ls.length > 1 ? ls.slice(0, -1).join(', ') + ' and ' + ls[ls.length - 1] : ls[0];
  return (sung && spelled ? ' Sing the letter' : ' Say the letter') + (ls.length > 1 ? 's ' : ' ') + list + ' by ' + (ls.length > 1 ? 'their names' : 'its name') + (spelled ? (sung ? ', one at a time, each one clear' : ', one at a time') : '') + (ls.includes('A') ? ', A as ay, never the word a' : '') + '.'; };
// A word said in its beats (pass MY, round one's story check): each run of beats a row's words say ("Um, brel, luh.") is that word said
// slowly, each beat even and a little word of its own, and um, umbrella's first beat, is never a hesitation, nor bah, banana's, a sigh.
// What the child does in a turn (pass MY): puts words or beats together, takes a word apart, or says a word slowly and claps once for
// each beat, where the line asks it (Now you try, and put these two words together.), and otherwise says the words back. Since pass MZ
// (round two's code check) also points to the one said, says same or different, or finds the silly word, as Cat or hat? and Same word or
// different? ask, where "says it back" had told the voice to wait for the wrong thing.
// Since pass NI (the story writer's note and the lead's read of every turn row): a turn that asks the child to draw in the air, to tell or ask
// a grown-up, or to write their name says so, a question's turn says the child answers, a turn that asks the child to say something says
// the child says it, and "says it back" is left for a sentence the child says after the voice; a word taken apart by name (Take the word
// tie apart) is a word taken apart. The scripts test reads every turn row's description against its sentence. A turn is read from the
// sentence the turn follows, so the ask-a-grown-up turn matches Look and write's line, whose turn follows that sentence, and none of Write
// your name's, whose line asks it first and ends on writing the name under theirs (round one's code read).
const turnSaid = (say, sentence = '') => (/\bput (?:these|them)\b[^.]*\btogether\b/i.test(say) ? ', then the child puts them together in a turn of their own' : /\btake (?:one|it|the word \w+) apart\b/i.test(say) ? ', then the child takes it apart in a turn of their own' : /\bclap once for each beat\b/i.test(say) ? ', then the child says it slowly and claps once for each beat in a turn of their own' : /\bpoint to the one\b/i.test(say) ? ', then the child points to the one they heard, in a turn of their own' : /\bsay same or different\b/i.test(say) ? ', then the child says same or different, in a turn of their own' : /\bfind the silly word\b/i.test(say) ? ', then the child finds the silly word, in a turn of their own'
  : /\bdraw it in the air\b/i.test(sentence) ? ', then the child draws it in the air in a turn of their own' : /\btell a grown-up\b/i.test(sentence) ? ', then the child tells a grown-up in a turn of their own' : /\bwrite it under theirs\b/i.test(sentence) ? ', then the child writes their name under the grown-up\'s, on paper, in a turn of their own'
  : /\bask a grown-up to write your name\b/i.test(sentence) ? ', then the child asks a grown-up to write their name and looks at it, in a turn of their own' : /\?\s*$/.test(sentence) ? ', then the child answers in a turn of their own' : /\bsay\b/i.test(sentence) ? ', then the child says it in a turn of their own' : ', then the child says it back');
// A sentence that is only a run of beats ("Um, brel, luh.") is asked for as that word said slowly in short, even beats (round one's story
// flow check: the early direction's "drawing out key words" invited a long ummm), the word named, never a letter.
const BEAT_COUNT_WORDS = ['', 'one', 'two', 'three', 'four'];
// beatRunPart is the words alone, so a voice a lesson shows (a turn's telling voice) can take them too (round two's code read).
const beatRunPart = (sentence) => { const s = String(sentence).trim().replace(/[.!?]$/, '').toLowerCase(); const word = BEAT_RUNS[s]; return word ? word + ' said slowly in ' + BEAT_COUNT_WORDS[s.split(', ').length] + ' short, even beats' : null; };
const beatRunOf = (sentence) => { const p = beatRunPart(sentence); return p ? '[warm and gentle, ' + p + ']' : null; };
// In a story whose booms the child counts by ear (BOOMS_COUNTED, by lesson: A birthday drum), each is the word boom said once, short and
// even (round two's content read); a story where a boom is thunder or a parade drum keeps its own tags (the third read).
export const BOOMS_COUNTED = new Set(['clap-the-beats']);
export const BOOMS_NOTE = ' Each boom is the word boom said once, short and even, since the child counts the booms by ear.';
const boomsSaid = (text, moduleId) => (BOOMS_COUNTED.has(moduleId) && /\bboom\b/i.test(String(text)) ? BOOMS_NOTE : '');
// Words that sound almost the same (pass MZ, round one's story check): in the lessons and stories on telling them apart (NEAR_PAIRS_LESSONS,
// by lesson: Cat or hat? and Same word or different?), a row that says both words of a pair (hat and cat, rock and sock) asks for each
// said clearly, its start crisp, since the child tells the two apart by ear and a soft start could make them one. Since round two's code
// check a row that says one word of a pair asks the same of it, naming the word it must never sound like, since the clips a child
// compares are most often a word said alone ("Cat." then "Hat."), and a story's title too; a lesson line that says one is asked for
// clearly (NEAR_DIRECTION), never drawn out, since drawing a word out can blur the very first sound that tells the pair apart; and the
// pairs are logic's own (NS_PAIRS), where the ledger had kept a copy. The scripts test holds every such row.
export const NEAR_PAIRS_LESSONS = new Set(['cat-or-hat', 'same-word-or-different']);
export const NEAR_DIRECTION = '[warm and gentle, each word said clearly, its first sound crisp]';
const nearIn = (text, moduleId) => { if (!NEAR_PAIRS_LESSONS.has(moduleId)) return []; const low = String(text).toLowerCase(); const has = (w) => new RegExp('\\b' + w + 's?\\b').test(low);
  return NS_PAIRS.filter(([a, b]) => has(a) || has(b)).map(([a, b]) => [a, b, has(a), has(b)]); };
const nearSaid = (text, moduleId) => nearIn(text, moduleId).map(([a, b, hasA, hasB]) => (hasA && hasB ? ' Say ' + a + ' and ' + b + ' clearly, each start crisp, since the child tells the two words apart by ear.' : ' Say ' + (hasA ? a : b) + ' clearly, its start crisp, so it never sounds like ' + (hasA ? b : a) + '.')).join('');
const BEAT_NOTES = { um: ' Um is its first beat, never a hesitation.', bah: ' Bah is its first beat, never a sigh.' };
const beatsSaid = (text) => Object.entries(BEAT_RUNS).filter(([run]) => new RegExp('\\b' + run + '\\b', 'i').test(String(text))).map(([run, word]) => ' The beats ' + run + ' are ' + word + ' said slowly, each beat even and a little word of its own.' + (BEAT_NOTES[run.split(', ')[0]] || '')).join('');
// A capital a story uses as something other than a letter, by its picture serial (the third read): Elijah's name clapped in beats,
// E. Li. Jah., whose E starts his name and is not the letter.
export const BEATS_NOT_LETTERS = { S302: ['E'] };
// A paragraph's description (pass MW): its place, its voice, and since round one what a listener should know before rejecting a
// right take: a stretch its tags ask to go quickly, a fraction (25/100, which a voice can read as a date), a sound written as letters
// (buh, sss, mmm), which the story's own words keep (EARMARKS A41), and since round two a letter named as a letter.
// A clip whose tags say it is sung ([singing the alphabet song], [singing], [singing, building]; the second story read, pass NI).
const SUNG = /\[[^\]]*\bsing(?:s|ing)?\b[^\]]*\]/i;
function storySaid(story, i, grade, moduleId) { const n = (story.words || []).length; const audio = (story.audio && story.audio[i]) || ''; const words = story.words[i] || '';
  const quick = QUICK.test(audio) ? ' Where its tags ask for a quicker pace (rushed, hurried, quickly, quick, breathless, out of breath or faster), that part is quick on purpose, and the telling settles back to calm after it.' : '';
  const fractions = [...new Set(words.match(/\b\d+\/\d+\b/g) || [])]; const fraction = fractions.length ? ' Read ' + fractions.join(' and ') + ' as the story means ' + (fractions.length > 1 ? 'them' : 'it') + ', never as a date.' : '';
  const sound = band(grade) === 'early' ? soundsWritten(words, { once: ONE_BREATH_LESSONS.includes(moduleId) }) + lettersNamed(words, BEATS_NOT_LETTERS[story.art] || [], { sung: SUNG.test(audio) }) : '';
  return '"' + story.title + '", paragraph ' + (i + 1) + ' of ' + n + ': ' + (band(grade) === 'early' ? VOICE_WORDS.earlyStory : VOICE_WORDS[band(grade)]) + (story.audio ? ', following its hand-written tags' : '') + '.' + quick + fraction + sound + beatsSaid(words) + boomsSaid(words, moduleId) + nearSaid(words, moduleId); }
// Pre-K first, then up (the review's order), so the ledger reads in the order the review tags it.
const rank = (g) => { const s = String(g); if (/^pk3$/i.test(s)) return 0; if (/^pk/i.test(s)) return 1; if (/^k$/i.test(s)) return 2; if (/^\d+$/.test(s)) return 2 + Number(s); return 15; };
const courses = [...COURSES].sort((a, b) => rank(a.grade) - rank(b.grade) || (a.elective ? 1 : 0) - (b.elective ? 1 : 0));
for (const c of courses) {
  for (const m of c.modules) {
    const st = STORIES[m.id];
    if (st) {
      // A title that is a run of beats (grade 2's "Rab, bit") is asked for in its even beats too (round two).
      const titleRun = beatRunPart(st.title); const titleDirection = titleRun ? DIRECTION.title.replace(/\]$/, ', ' + titleRun + ']') : DIRECTION.title;
      add(`${st.art}-0`, 'story title', m.id, c.grade, `${titleDirection} ${storyTitleSpoken(st.title)}`, storyTitleSpoken(st.title), st.art, titleSaid(st.title, c.grade, st.art) + beatsSaid(st.title) + nearSaid(st.title, m.id));
      st.words.forEach((p, i) => add(`${st.art}-${i + 1}`, 'story', m.id, c.grade, `${band(c.grade) === 'early' ? DIRECTION.earlyStory : DIRECTION[band(c.grade)]} ${(st.audio && st.audio[i]) || p}`, p, st.art, storySaid(st, i, c.grade, m.id)));
    }
    // A read-aloud lesson speaks readAloudScript's lines (pass JP: paragraphs too when it has no script), keyed by step as the app plays them.
    // Since pass MS (Mikey's note on Q67) each saying of a say-along word is a clip of its own, asked for in its own voice alone
    // ([whispers], [in a deep, silly voice] and the rest, SAY_ALONG_VOICES' tags), with no early direction beside it, since a clip that
    // is only the word said one way has no other words to draw out (EARMARKS A55, which pass MR's cue at a line's end had raised); the
    // chant's claps are the app's own, played between its sayings. The calls and the cue kept the early direction until pass MT (below).
    // Since pass MT (Mikey's answer to Q77: the game "will sound better with Eleven when we add playful, interesting and silly audio
    // tags") the opener is asked excited and emphasized, each call playful and conversational, "Great job!" delighted, and a way whose
    // sayings differ gives each saying its own tag (the four silly voices: low, high, an Australian accent and a British one, low first
    // since round one, the same voice, as he asked; bounced, up high and down low); the cheer's whistles are the app's own, played
    // between its sayings, and its crowd after the last. Since pass MV a sentence a line says in a manner (a whisper, a voice up high,
    // a word said strong; VOICE_MANNERS) is asked for in that manner's tag alone, since the young direction's drawn-out key words would
    // pull against a whisper or a quick, happy voice.
    // Since pass MW each row also carries its description, and a sentence of the line's own words is sent as elevenSentence makes it:
    // its sounds in the phonetic alphabet, the words the app's voice draws out in capitals, and the say-along's word in the sentence
    // that names it, the line's last sentence of its own words before the opener ("Our word is red."). A sentence of sounds alone
    // ("Mmm.", "Cuh, a, nnn.") is asked for as sounds, in the speech sounds' own direction.
    const said = (line, part) => (part.role === 'say' ? mannerOf(part.sentence, line.voices) : null);
    (c.readAloud ? readAloudScript(m) : (m.lesson && m.lesson.script ? m.lesson.script : [])).forEach((line, li) => {
      const parts = sayAlongParts(sentencesOf(line.say)); const open = parts.findIndex((x) => x.role === 'open');
      const wordAt = open > 0 ? parts.slice(0, open).map((x, k) => (x.role === 'say' ? k : -1)).filter((k) => k >= 0).pop() : -1;
      const where = `Lesson "${m.title}", line ${li + 1}`;
      parts.forEach((part, si) => {
        const key = `${m.id}-${li}-${si}`; const manner = said(line, part);
        if (part.role === 'form') {
          const tag = (part.voice.tags && part.voice.tags[part.rep]) || part.voice.tag; const last = !part.voice.apart || part.rep === part.voice.times - 1;   // a way said in one sentence (whispered twice) is its own last
          const after = part.voice.apart && part.voice.between && !last ? ` Then the app plays a fan's whistle (sound-${part.voice.between}).` : part.voice.apart && part.voice.after && last ? ` Then the app plays the crowd (sound-${part.voice.after}).` : '';
          const alone = part.voice.between || part.voice.after ? ' The voice alone, with no crowd or whistle in the clip: the app plays those itself.' : '';   // round one's accuracy check: a tag can be taken for a sound effect
          add(key, 'lesson line', m.id, c.grade, `${tag} ${part.sentence}`, part.sentence, `${m.id}-lesson`, `${where}: the say-it-together game's word ${part.word}, said this way: ${tagWords(tag)}.${alone}${after}${last ? ' Then the child copies it.' : ''}`);
        } else if (part.role !== 'say') {
          const heard = { open: "the say-it-together game's opener, Mikey's words, said excited and emphasized", call: "a call of the say-it-together game, playful and conversational, like a favorite preschool teacher", praise: "the game's praise before its last saying, delighted, like a cheer" }[part.role];
          add(key, 'lesson line', m.id, c.grade, `${SAY_ALONG_TALK[part.role]} ${part.sentence}`, part.sentence, `${m.id}-lesson`, `${where}: ${heard}.`);
        } else if (manner) {
          const runPart = beatRunPart(part.sentence); const mannerTag = runPart ? VOICE_MANNERS[manner.manner].tag.replace(/\]$/, ', ' + runPart + ']') : VOICE_MANNERS[manner.manner].tag;
          add(key, 'lesson line', m.id, c.grade, `${mannerTag} ${part.sentence}`, part.sentence, `${m.id}-lesson`, `${where}: said ${MANNER_HEARD[manner.manner]}${manner.turn ? turnSaid(line.say, part.sentence) : ''}.${beatsSaid(part.sentence)}${nearSaid(part.sentence, m.id)}`);
        } else {
          const e = elevenSentence(part.sentence, { voices: line.voices, word: si === wordAt ? parts[open].word : null, stress: line.stress || [], once: ONE_BREATH_LESSONS.includes(m.id) });
          const beatRun = beatRunOf(part.sentence);
          const near = nearIn(part.sentence, m.id).length > 0;   // a word of a near pair: said clearly, never drawn out (round two's code check)
          // A line that is one sound alone takes that sound's own direction, and in a lesson of one breath (or a run) a hiss's one-breath
          // direction, beside its one-breath goal (pass NC, round two's code read: "Fff." asked for two breaths and one in one clip).
          const alone = e.sounds.length === 1 ? SOUND_RECORDINGS[e.sounds[0]] : null;
          const direction = e.onlySounds ? (alone ? (e.once && alone.howOne ? alone.howOne : alone.how) : '[warm and gentle, a preschool teacher saying each speech sound alone, one after another, slowly]') : beatRun ? beatRun : near ? NEAR_DIRECTION : DIRECTION.early;
          const said = directionBack(e.text, direction);
          add(key, 'lesson line', m.id, c.grade, `${direction} ${said}`, part.sentence, `${m.id}-lesson`, `${where}: ${e.onlySounds ? 'speech sounds said alone, slowly and clearly' : beatRun ? VOICE_WORDS.earlyBeats : near ? VOICE_WORDS.earlyNear : VOICE_WORDS.early}.${soundsSaid(e, key, said !== e.text)}${stressSaid(e)}${beatsSaid(part.sentence)}${nearSaid(part.sentence, m.id)}`);
        }
      });
    });
  }
  // A course's long story, and since pass MH its next one (MASTERY_STORIES), keyed by each story's own main picture serial.
  for (const [cs, kind] of [[COURSE_STORIES[c.id], 'long story'], [MASTERY_STORIES[c.id], 'next long story']]) {
    if (!cs) continue;
    add(`${cs.art}-0`, `${kind} title`, c.id, c.grade, `${DIRECTION.title} ${storyTitleSpoken(cs.title)}`, storyTitleSpoken(cs.title), cs.art, titleSaid(cs.title, c.grade, cs.art));
    (cs.words || []).forEach((p, i) => add(`${cs.art}-${i + 1}`, kind, c.id, c.grade, `${band(c.grade) === 'early' ? DIRECTION.earlyStory : DIRECTION[band(c.grade)]} ${(cs.audio && cs.audio[i]) || p}`, p, cs.art, storySaid(cs, i, c.grade)));
  }
}
// The games' welcomes (pass MP, Mikey: "With Eleven, we can make this game audio exciting and fun"): each line a clip, keyed by its
// words and its voice (gameIntro), so a line many games share is one row and one recording, in the group of the first game that
// says it (the group is what tools/audio-generate.mjs stitches a clip to its neighbors by, so a game's lines are told as one);
// the youngest games' lines in the young voice with the playful direction, and the rest in the main voice, upbeat and engaging (since
// round two's alignment read; every line shared by games of both voices is two rows, one in each). --only game makes them all.
// Since pass MQ (Mikey: "the cadence should be slow enough that a sentence can be properly absorbed before jumping into the next
// sentence.   I noticed that the sentences are spoken quickly back to back so a short pause, doesn't need to be too long, could be
// beneficial.") a line of two or more sentences rests between them in the recording too, a [pause] tag where one sentence ends and
// the next begins (the app rests between them itself on the device's voice, and between lines either way), since a recorded line is
// one clip; the tag never reaches the screen, and the clip's key, made from its words, is unchanged.
// Since pass MR a sentence that ends in a cheer, Mikey's "But most importantly, HAVE FUN!!!", asks for [excited] before the cheer (cheerTagged).
const restedLine = (say) => sentencesOf(say).map(cheerTagged).join(' [pause] ');
{ const seen = new Set(); const sharedBy = new Map();
  for (const g of GAMES) for (const line of gameIntro(g)) { if (!sharedBy.has(line.key)) sharedBy.set(line.key, []); sharedBy.get(line.key).push(g.title); }
  for (const g of GAMES) for (const line of gameIntro(g)) {
    if (seen.has(line.key)) continue; seen.add(line.key);
    const titles = sharedBy.get(line.key); const games = titles.length > 1 ? `${titles.length} games, ${titles[0]} first` : titles[0];
    const rests = sentencesOf(line.say).length > 1 ? ', resting briefly at each [pause]' : '';
    add(line.key, line.keys ? 'game welcome (keyboard)' : 'game welcome', g.id, gameBand(g) === 'early' ? 'K' : g.minGrade, `${gameBand(g) === 'early' ? DIRECTION.game : DIRECTION.gameMain} ${restedLine(line.say)}`, line.say, `game-${g.id}`, `A line of the spoken welcome of ${games}: ${gameBand(g) === 'early' ? VOICE_WORDS.game : VOICE_WORDS.gameMain}${rests}.`);
  } }
// The app's own sounds (pass MW, SOUND_RECORDINGS): every speech sound a lesson plays and the five short vowels on trial, said by the
// young voice in the phonetic alphabet, and the cheer's whistle and crowd from ElevenLabs' sound effects (Q82 (a)), each with the
// takes tools/audio-generate.mjs makes for Mikey to pick by ear (it never names a take audio/<key>.mp3 itself). Their group is
// sounds, and the generator sends them alone, with no words before or after.
{ const cheer = SAY_ALONG_VOICES.flatMap((v) => [v.between, v.after]).filter(Boolean);
  for (const name of [...Object.keys(SPEECH_SOUNDS), ...Object.keys(TRIAL_SOUNDS), ...new Set(cheer)]) {
    const r = SOUND_RECORDINGS[name]; if (!r) continue;
    if (r.kind === 'sound effect') add(`sound-${name}`, 'sound effect', 'sounds', 'PK3', r.text, '', 'sounds', r.heard, { voice: 'none', seconds: r.seconds, influence: r.influence, takes: r.takes });
    else add(`sound-${name}`, 'speech sound', 'sounds', 'PK3', r.text, '', 'sounds', `${r.heard}${goalSaid('sound-' + name, false)} If no take says it right, record it yourself and turn it into the lesson voice with ElevenLabs' Voice Changer (EARMARKS A41).`, { takes: r.takes });
  } }
const csv = (v) => `"${String(v).replace(/"/g, '""')}"`;
// The app's own sounds as a table for the markdown, one row each.
const soundTable = () => rows.filter((r) => r.kind === 'speech sound' || r.kind === 'sound effect').map((r) => '| ' + [r.key, r.kind, r.text.replace(/\|/g, '/'), r.description.replace(/\|/g, '/'), r.seconds || 'as said', r.takes].join(' | ') + ' |').join('\n');
// The CSV this tool writes, exported so the docs sync test can hold docs/AUDIO-LEDGER.csv to the code (pass MN, round three: round
// one's words stayed in it after the lessons changed, and tools/audio-generate.mjs records from it). It writes only when run alone,
// read by its own name with endsWith, so a folder with a space in its path still works and an import writes nothing.
// Since pass MW four more columns follow the text: the description, and a sound's seconds, influence and takes (empty elsewhere).
export const LEDGER_CSV = ['key,kind,source,grade,voice,group,characters,text,description,seconds,influence,takes', ...rows.map((r) => [r.key, r.kind, r.source, r.grade, r.voice, r.group, r.text.length, r.text, r.description, r.seconds, r.influence, r.takes].map(csv).join(','))].join('\n') + '\n';
const runAlone = !!process.argv[1] && process.argv[1].endsWith('audio-ledger.mjs');
if (runAlone) writeFileSync(new URL('../docs/AUDIO-LEDGER.csv', import.meta.url), LEDGER_CSV);
const longest = Math.max(...rows.map((r) => r.text.length));
const groups = new Map(); for (const r of rows) groups.set(r.group, (groups.get(r.group) || 0) + r.text.length);
const tagged = Object.values(STORIES).filter((s) => s.audio).length + Object.values(COURSE_STORIES).filter((s) => s.audio).length + Object.values(MASTERY_STORIES).filter((s) => s.audio).length;
const chars = rows.reduce((a, r) => a + r.text.length, 0);
// The markdown docs/AUDIO-LEDGER.md holds, exported as the CSV is so the docs sync test can hold that file to the code too (pass MX,
// round two's alignment read: its bullet kept an example the code had changed), and printed only when the tool is run alone.
export const LEDGER_MD = `# Audio ledger

Generated ${new Date().toLocaleDateString('en-CA', { timeZone: 'America/Chicago' })} by tools/audio-ledger.mjs. Every clip the app can play in a recorded voice is a row of docs/AUDIO-LEDGER.csv: its key (the file name, audio/<key>.mp3, that the app already looks for), its group (the story or lesson it belongs to) and the words with their Eleven v4 audio tags. ${rows.length} clips, ${chars.toLocaleString('en-US')} characters in all; the longest clip is ${longest} characters and the longest whole story ${Math.max(...[...groups].filter(([g]) => !/-lesson$|^game-|^sounds$/.test(g)).map(([, n]) => n)).toLocaleString('en-US')}, far under Eleven v4's 10,000 a request (the longest lesson's lines come to ${Math.max(...[...groups].filter(([g]) => /-lesson$/.test(g)).map(([, n]) => n)).toLocaleString('en-US')} in all, each line a request of its own). ${tagged} stories carry hand-written tags so far (the writing review adds them course by course); the rest open with their age band's voice direction only.

## How to make the audio

The quickest way is one command. tools/audio-generate.mjs reads the CSV and, for each clip not yet in audio/, asks Eleven v4 (model eleven_v4) to speak the tagged words, passing the words before and after (previous_text and next_text) so a story sounds like one steady telling, and saves audio/<key>.mp3. It skips clips that already exist, so it can be stopped and started again. The app plays recorded clips in place of the device voice as soon as every clip of a story or lesson line is present; until then it keeps the device voice.

    ELEVENLABS_API_KEY=your-key node tools/audio-generate.mjs --voice <voice id> --voice-young <voice id for pre-K to grade 2>
    (add --only S95 for one story, --limit 50 to try a few, --dry-run to see what would be sent, --model to name another speech
    model, which takes no neighbors' words if it is eleven_v3, and --sfx-model to name another sound effects model)

Pasting into the ElevenLabs app works too, clip by clip, with Eleven v4 chosen as the model and the text column as written (older models, such as Multilingual v2 and Flash and Turbo v2.5, do not read the bracketed tags), and each file saved as <key>.mp3.

The app's own sounds are rows too (since pass MW, below): \`--only sounds\` makes them alone, a few takes of each in audio/takes (<key>-1.mp3 and on), and the take that sounds right is copied to audio/<key>.mp3, the name the app will look for. A speech sound is spoken by the young voice from its phonetic symbols; a sound effect is made by ElevenLabs' sound effects (model eleven_text_to_sound_v3, or another with --sfx-model) from its text, a prompt describing the sound, for its seconds and influence, never sent to the voice; its description says what to listen for and is never sent.

## Emphasis, sounds and descriptions (pass MW)

Mikey, opening pass MW: "I'm not reviewing any more audio for now since it's kind of pointless.  Makes more sense to review it after Eleven Labs.  Just be sure to add emphasis tags and descriptions within the audio ledger for Eleven.  It will be easier to test later within the artifact instead of opening several browsers and hunting down sounds." So the ledger now carries everything the recordings need, and the listening happens later, in the app itself, once the clips are made.

- **Descriptions.** Every row's description column says in plain words what the clip should sound like: the voice for its age, the way a say-it-together saying is said, the voice a lesson shows, the sounds in it, the words to stress. It is for whoever makes the clip and for the listening in the app; Eleven is sent the text column of every row, and a sound effect's text is the prompt that describes the sound, while its description says what to listen for and is never sent.
- **Emphasis.** Eleven v4 reads capitals as emphasis (ElevenLabs' best practices: "Capitalization increases emphasis"). A lesson line asks for it where the app's own voice draws a word out inside a longer sentence (each word of a list that starts or ends alike: "DOG, LOG and FOG all end with "/ɑɡ/"."), on the say-it-together game's word in the sentence that names it ("Our word is RED."), and on a word a lesson says strong ("I want the RED circle, not the blue one."); a letter named as a letter is its capital, which Eleven is expected to say by its name (undocumented, so each such clip is heard before use), and the letter A, which a voice can read as the word a, is its name in the phonetic alphabet, "/eɪ/", wherever it is not the article; a story names its letters in its description. ${rows.filter((r) => r.kind === 'lesson line' && (/Stress the word/.test(r.description) || r.text.startsWith(VOICE_MANNERS.strong.tag))).length} lesson clips ask for a stressed word, a line's stress list among them (since round one, the words that change in the pass's four lessons: two DOGS, KICKED). The screen never shows the capitals of a list word, the say-along's word, a stressed word or a letter; a word said strong is in capitals on the screen too, as the lesson writes it.
- **Speech sounds.** Eleven v4 reads the phonetic alphabet "Enclosed in forward slashes" and "Wrapped in double quotes when passed as a string parameter" (its best practices, IPA with Eleven v4), so every speech sound a lesson line writes as letters (sss, tuh, buh, the ending ig) is sent as its symbols in quotes ("/sː/", "/tʰ/", "/bə̆/", "/ɪɡ/"), and a vowel letter set off beside sounds in a run that blends into a word is sent as its short sound ("Cuh, a, nnn." is "/kʰ/", "/æ/", "/nː/"), never as the letter's name; ${rows.filter((r) => r.kind === 'lesson line' && /between slashes/.test(r.description)).length} lesson clips hold one. The guide documents IPA "for names, technical terms, and other words" and says "results can still vary by voice and phrase"; a sound said alone is not documented, so each clip's description names its sounds, every take is heard before it is used, and where a sentence's sound comes out wrong, the sentence is cut at the sound and the sound's own take (sound-<name>) is played between its parts, as the app does today, or the sound is recorded and turned into the lesson voice with the Voice Changer (EARMARKS A41). The stories' sounds stay as their words write them, named in each paragraph's description.
- **A goal before every sound (pass MX).** Mikey: "Since Eleven doesn't document a sound said alone like "/sː/", those rows in the ledger can include a short descriptor which can also be pasted into Eleven which describes what we are trying to achieve.  Since it is an AI, it allows for some explanatory text and might be able to provide a better output knowing the goal." So each speech sound's symbols follow a short direction in square brackets that says what the sound should be ("${goalTag(SOUND_RECORDINGS.m.goal)} ${ipaQuoted(SOUND_RECORDINGS.m.ipa)}"), in the sound's own row and in every lesson line that says it, ${rows.filter((r) => r.kind === 'lesson line' && /tells Eleven what the sound should be/.test(r.description)).length} lesson clips in all; pasting the text column, or the generator sending it, gives Eleven the goal with the symbols. ElevenLabs' guide for Eleven v4 says "Because Eleven v4 is trained to generate both vocal delivery styles and sound effects, a tag can occasionally be interpreted as a request for a sound effect rather than a delivery instruction (or vice versa)." and "Writing tags that clearly describe the voice quality you want (e.g. [low, gravelly voice] rather than something that could be read as a sound cue) helps the model deliver what you intended.", so every goal opens with saying, what the voice does, and names its sound by the word it starts or ends ("the first sound of moon"), never by a letter, and none is written as a sound effect of its own ([a snake hissing]), though some name the noise the voice makes (a hum, a hiss, a buzz); ElevenLabs' launch page for Eleven v4 gives the idea in its own words, saying users "can also add specific instructions on how to say certain phrases". A tag carries forward across the line (its tags list: "When you add a tag, its emotion carries forward across the line, meaning you only need to introduce another tag when you want the delivery to shift."), so where two or more words follow a sound, the line's own direction comes again before them. The guide documents no tag for a sound alone, so every take is heard before use; a take that reads a bracket aloud or sounds like a sound effect is deleted and made again as it is (the generator makes only what is missing), and if the new take fails too, it is deleted as well and made with tools/audio-generate.mjs, the voices used before and --only <its key> --no-goals, which sends the same text without the goals (the generator skips every clip already on disk, so the failed take goes first, and --only keeps every other row's goals). The letter A named as a letter ("/eɪ/") takes none, since it is a name, a word the guide documents.
- **The app's own sounds.** Each sound the app makes itself today has a row of its own, below: what Eleven is asked for, and what to listen for when picking a take.

## The app's own sounds

| Key | Kind | Eleven is asked for | What to listen for | Seconds | Takes |
|---|---|---|---|---|---|
${soundTable()}

## Characters by age band

ElevenLabs counts characters, tags included, so this is the size of each part of the job.

| Band | Clips | Characters |
|---|---|---|
${['early', 'elementary', 'middle', 'older'].map((b) => { const rs = rows.filter((r) => band(r.grade) === b); return `| ${{ early: 'Pre-K to grade 2', elementary: 'Grades 3 to 5', middle: 'Grades 6 to 8', older: 'Grades 9 to college' }[b]} | ${rs.length} | ${rs.reduce((a, r) => a + r.text.length, 0).toLocaleString('en-US')} |`; }).join('\n')}

## Voices

| Who | Direction at the start of each clip |
|---|---|
| Pre-K to grade 2, and every pre-reader lesson line | ${DIRECTION.early} |
| A story for pre-K to grade 2 (since pass MP) | ${DIRECTION.earlyStory} |
| A lesson line that says a word of a near pair, in Cat or hat? and Same word or different? (since pass MZ) | ${NEAR_DIRECTION} |
| Grades 3 to 5 | ${DIRECTION.elementary} |
| Grades 6 to 8 | ${DIRECTION.middle} |
| Grades 9 to college | ${DIRECTION.older} |
| Story titles | ${DIRECTION.title} |
| Questions (when the app plays them; next in the audio work) | ${DIRECTION.question} |
| Game welcomes for pre-K to grade 2 (since pass MP, in the young voice) | ${DIRECTION.game} |
| Game welcomes from grade 3 up (since pass MP) | ${DIRECTION.gameMain} |

Questions stay warm, pleasant and mildly upbeat, never over-excited. Young learners hear words drawn out and stressed the way a favorite preschool teacher says them; older learners hear a warm, engaging voice that never talks down to them (Mikey, pass JH).

## Clips by kind

| Kind | Clips |
|---|---|
${[...new Set(rows.map((r) => r.kind))].map((k) => `| ${k} | ${rows.filter((r) => r.kind === k).length} |`).join('\n')}

## Stories with hand-written tags

${Object.entries(STORIES).filter(([, s]) => s.audio).map(([id, s]) => `### ${s.title} (${s.art}, ${id})\n\n${s.audio.map((p, i) => `- ${s.art}-${i + 1}: ${p}`).join('\n')}`).join('\n\n')}
`;
if (runAlone) console.log(LEDGER_MD);
