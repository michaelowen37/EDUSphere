// The Wise Human. Copyright (c) 2026. Source-available; not for reuse. See LICENSE.md.
// The voice check (pass MO, for Mikey's Q51). In plain terms: a small page that says the lesson sounds and lines exactly the way
// the app does, so Mikey can listen on his own phone and answer by number. The page is built from the app's own code, not a copy
// of it: the part of src/logic.mjs that decides how a line is said and makes the speech sounds, and the part of src/ui.jsx that
// picks the phone's voice, plays the sounds and says a line's pieces in turn. So what the page plays is what a lesson plays. Its
// third list holds the choices only the phone's voice can settle (how it says ig, at, buh and the rest), each with a number. Since
// pass MP (Mikey's answer to Q57 and his notes on Q51) a fourth list plays the sounds the app has made for no lesson yet (the five
// short vowels, buh, duh, guh and juh, and the endings ig, og and at), and a fifth says lesson lines on trial, as a lesson would say
// them with those sounds, so he hears them before any lesson uses them; a row he must hear again says so under its words.
// Since pass MQ (Mikey's answer to Q60, "Q60 - B") the lessons say buh, duh, guh, juh, ig, og and at with the app's own sounds, so the
// lesson rows play them and rows 38 to 48 are lesson rows, while the five vowels (rows 33 to 37, 49 and 50) stay on trial; Q51 is
// closed until the recorded voice (Mikey: "let's just earmark this for later when we upload the eleven audio"), so the page names no
// open question and stays as a reference, organized as he liked it ("I can reasonably listen within the artifact since you have it
// nicely organized"). A lesson row is said in the young voice a pre-reader hears since pass MQ: a little slower, with a rest between
// sentences. Since pass MS (Mikey's note on his answer to Q67: all the silly voices go to one word, the last saying clear) the say-it-
// with-me rows say a whole say-along, one word in many voices, with the child's turn after each way and a clap between a chant's
// cheers; rows 51 to 57, pass MR's one voice a word, are retired, and their numbers are not used again. Since pass MT (Mikey's answer
// to Q77, his game: "Let's say it together!", five ways each called in his openings, "Great job!" and the clear one, his own words on
// different and Claude's flavors on the other words) rows
// 58 to 63 are retired with the lines they said, and row 64, the clap, with it (Mikey: "the claps in row 64 don't sound like real
// claps"); rows 65 and 66 play the cheer's new sounds, a fan's whistle and the crowd, and rows 67 to 72 six lesson lines of the new game.
// Since pass MU (Mikey's notes on rows 39 to 44, 65 and 66: a click in duh and guh, odd sounds with juh, ig, og and at, the whistle cut
// off too quickly, the clapping like static) those rows play the remade sounds, and their notes say so. Since pass MV (the standards
// review of Domain II's II.C and pre-K 3's voice to fit the place) rows 73 to 84 play the voices a lesson shows (VOICE_MANNERS): a
// whisper, an inside voice, a big outside voice, a kind, soft voice, up high and down low with the child's turn after each, a question
// going up and telling going down, a word said strong, the same words asking and telling, the same words happy and sad, and one
// question's heard sentence, each line word for word as its lesson says it and each row's voices handed to speechPieces as the
// lesson hands them.
// Run: node tools/voice-check.mjs   (writes dist/voice-check.html, published as its own small page when Mikey listens again, after the
// ElevenLabs recordings, since pass MW; dist stays out of git)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const logic = readFileSync(new URL('../src/logic.mjs', import.meta.url), 'utf8');
const ui = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8');
// A stretch of a source file, from one marker up to the next; a marker that has moved stops the tool rather than build a page that
// no longer matches the app.
const slice = (text, from, to, name) => { const a = text.indexOf(from); const b = a < 0 ? -1 : text.indexOf(to, a); if (a < 0 || b < 0) throw new Error(`voice-check: ${name} has moved; update the markers`); return text.slice(a, b); };
const speechLogic = slice(logic, '// ---------- The sounds a lesson says (pass MO', 'export function whyNotNamesAnswer', 'the speech logic').replace(/^export /gm, '');
const speechScreens = slice(ui, '// Read text aloud with the browser\'s built-in voice.', '\nfunction speak(text, opts = {}) {', 'the speech screens');

// The rows, numbered once and for good, so an answer such as "13 fine, 22 spelled" always means the same row.
export const VOICE_CHECK_ROWS = [
  { group: 'The app\'s own sounds, the same on every phone' },
  // Pass MP: rows 1, 2 and 5 come in two short breaths (Mikey: "split the sound into fragments like sss sss sun"), and rows 8 to 10
  // end in a short, soft uh (his "like a tap on the rim of a drum").
  { n: 1, kind: 'sound', sound: 's', label: 'sss, as in sun', note: 'New in pass MP: two short hisses, sss, sss.' }, { n: 2, kind: 'sound', sound: 'f', label: 'fff, as in fan', note: 'New in pass MP: two short breaths, fff, fff.' },
  { n: 3, kind: 'sound', sound: 'm', label: 'mmm, as in moon' }, { n: 4, kind: 'sound', sound: 'n', label: 'nnn, as in nut' },
  { n: 5, kind: 'sound', sound: 'z', label: 'zzz, as in zip', note: 'New in pass MP: two short buzzes, with more voice and less hiss.' }, { n: 6, kind: 'sound', sound: 'l', label: 'lll, as in lion' },
  { n: 7, kind: 'sound', sound: 'r', label: 'rrr, as in run' }, { n: 8, kind: 'sound', sound: 't', label: 't, as in top (written tuh)', note: 'New in pass MP: a short, soft uh after the t.' },
  { n: 9, kind: 'sound', sound: 'p', label: 'p, as in pig (written puh)', note: 'New in pass MP: a short, soft uh after the p.' }, { n: 10, kind: 'sound', sound: 'k', label: 'c, as in cat (written cuh)', note: 'New in pass MP: a short, soft uh after the c.' },
  { group: 'Lesson lines, as the app says them now' },
  { n: 11, kind: 'line', text: 'Moon. Mmm. The word moon starts with the sound mmm.' },
  { n: 12, kind: 'line', text: 'Sun. Sss. The word sun starts with the sound sss.', note: 'Hear again: the new sss of row 1.' },
  { n: 13, kind: 'line', text: 'Tap and top both start with the same sound, tuh. They begin alike.', note: 'Hear again: the new tuh of row 8.' },
  { n: 14, kind: 'line', text: 'Fan starts with fff, so it begins differently from tap and top.', note: 'Hear again: the new fff of row 2.' },
  { n: 15, kind: 'line', text: 'Moon and map both start with mmm.' },
  { n: 16, kind: 'line', text: 'Sun and fun both end with un, and pig and wig both end with ig.', note: 'Since pass MQ: the app plays ig itself (row 42).' },
  { n: 17, kind: 'line', text: 'Cat and dog do not rhyme. One ends in at, and the other ends in og.', note: 'Since pass MQ: the app plays at and og itself (rows 44 and 43).' },
  { n: 18, kind: 'line', text: 'Hat ends with at and big ends with ig, so they do not rhyme.', note: 'Since pass MQ: the app plays at and ig itself.' },
  { n: 19, kind: 'line', text: 'Ball, bed and bear all start with buh.', note: 'The three words said one by one, slowly (pass MP), and since pass MQ the app\'s own buh (row 38).' },
  { n: 20, kind: 'line', text: 'Dog, duck and door all start with duh.', note: 'The three words said one by one, slowly (pass MP), and since pass MQ the app\'s own duh (row 39).' },
  { n: 21, kind: 'line', text: 'Say it slowly, said the teacher, and listen to how it starts. Sss-am, said Sam slowly. Sss! he said, and he hissed like a snake.' },
  { group: 'How a phone\'s voice says these on its own (no lesson hands them to it since pass MQ)' },
  { n: 22, kind: 'say', text: 'igg', label: 'ig, handed to the voice as igg (what the app did until pass MQ)' },
  { n: 23, kind: 'say', text: 'ihg', label: 'ig, handed to the voice as ihg' },
  { n: 24, kind: 'say', text: 'ig', label: 'ig, as written (what spelled it out before)' },
  { n: 25, kind: 'say', text: 'One ends in at, and the other ends in og.', label: 'the at in the middle of the line, as before', note: 'Since pass MP the words said show here, above what the row is for.' },
  { n: 26, kind: 'say', text: 'at', label: 'at, said as a word of its own (what the app did until pass MQ)' },
  { n: 27, kind: 'say', text: 'buh', label: 'buh, the voice\'s b' }, { n: 28, kind: 'say', text: 'duh', label: 'duh, the voice\'s d' },
  { n: 29, kind: 'say', text: 'guh', label: 'guh, the voice\'s g' }, { n: 30, kind: 'say', text: 'juh', label: 'juh, the voice\'s j' },
  { n: 31, kind: 'say', text: 'tuh', label: 'tuh as the voice says it (heard as "two" before)' },
  // Row 32 (round three's alignment read): a grade 1 line as a lesson says it today, its vowel handed to the voice alone (EARMARKS
  // A42), so it is heard before Q51 is called done; Mikey's answer to Q57, (a), brought the app's own vowels to rows 33 to 37 and 49.
  { group: 'A grade 1 line, its vowel said by the phone\'s voice alone' },   // the vowels stay on trial since Mikey's answer to Q60 (pass MQ; EARMARKS A42)
  { n: 32, kind: 'line', text: 'Read this word the same way. C says cuh, a says the sound at the start of apple, and n says nnn. Cuh, a, nnn. Can.', note: 'Each letter named on its own, slowly (C, A, N), with the app\'s cuh (pass MP). Its vowel is still the voice\'s, since the vowels wait; row 49 has the app\'s.' },
  // Pass MP (Mikey's answer to Q57, "Q57 - A", and his rows 16 to 20 and 27 to 30): sounds the app made for no lesson; since pass MQ
  // (his answer to Q60) the lessons say rows 38 to 44, and the vowels wait.
  { group: 'Short vowels the app makes, in no lesson yet' },
  { n: 33, kind: 'sound', sound: 'a', label: 'a, as in apple (the short a)' }, { n: 34, kind: 'sound', sound: 'e', label: 'e, as in egg' },
  { n: 35, kind: 'sound', sound: 'i', label: 'i, as in igloo' }, { n: 36, kind: 'sound', sound: 'o', label: 'o, as in octopus' },
  { n: 37, kind: 'sound', sound: 'u', label: 'u, as in up' },
  { group: 'Sounds the app makes, in the lessons since pass MQ' },
  { n: 38, kind: 'sound', sound: 'b', label: 'buh, as in ball', note: 'Pass MU: its b starts and ends a little more softly, as the d and g now do; otherwise as you heard it.' },
  { n: 39, kind: 'sound', sound: 'd', label: 'duh, as in dog', note: 'New in pass MU: a gentler d that runs straight into its uh, and the uh much louder. Tell Claude if the d now sounds too soft beside the uh.' }, { n: 40, kind: 'sound', sound: 'g', label: 'guh, as in goat', note: 'New in pass MU: a gentler g that runs straight into its uh, and the uh much louder. Tell Claude if the g now sounds too soft beside the uh.' },
  { n: 41, kind: 'sound', sound: 'j', label: 'juh, as in jam', note: 'New in pass MU: a gentler j whose hush starts with it and runs into its uh, and the uh louder.' }, { n: 42, kind: 'sound', sound: 'ig', label: 'ig, as in pig', note: 'New in pass MU: a much softer g at the end, and the i louder, as loud as the vowels above.' },
  { n: 43, kind: 'sound', sound: 'og', label: 'og, as in dog', note: 'New in pass MU: a much softer g at the end.' }, { n: 44, kind: 'sound', sound: 'at', label: 'at, as in cat', note: 'New in pass MU: a much softer t at the end.' },
  { group: 'Lesson lines with those sounds, as a lesson says them since pass MQ' },
  { n: 45, kind: 'line', text: 'Ball, bed and bear all start with buh.' },
  { n: 46, kind: 'line', text: 'Dog, duck and door all start with duh.' },
  { n: 47, kind: 'line', text: 'Sun and fun both end with un, and pig and wig both end with ig.' },
  { n: 48, kind: 'line', text: 'Cat and dog do not rhyme. One ends in at, and the other ends in og.' },
  { group: 'Lines on trial: a sounded-out word with the app\'s own short vowel' },
  { n: 49, kind: 'trial', text: 'Read this word the same way. C says cuh, a says the sound at the start of apple, and n says nnn. Cuh, a, nnn. Can.' },
  { n: 50, kind: 'trial', text: 'Read this one. D says duh, o says the sound at the start of octopus, and g says guh. Duh, o, guh. Dog.' },
  // Pass MT (Mikey's answer to Q77, word for word in DECISIONS MT, and his note on row 64: "maybe a longer session of claps or cheers
  // with whistling in place of the claps would work"): six lesson lines word for word, each one word said together five ways, so every
  // way is heard at least once (row 67 is his own version, Learning words' different), and the two sounds of a cheer. Rows 58 to 64
  // (pass MS: the cue that named the word, and the clap) are retired with what they played.
  { group: 'Say it together (Q77, pass MT): one word, five silly ways, as a lesson says it' },
  { n: 65, kind: 'sound', sound: 'whistle', label: 'a fan\'s whistle, between a cheer\'s sayings', note: 'New in pass MU: drawn out to nine tenths of a second on one breath, swelling and fading as a real whistle does.' },
  { n: 66, kind: 'sound', sound: 'applause', label: 'the crowd, clapping and whistling after a cheer\'s last saying', note: 'New in pass MU: 44 people clapping in a small hall for two and a half seconds, with two whistles from the crowd.' },
  { n: 67, kind: 'line', text: 'Different means not the same. A cup and a ball are different. Let\'s say it together! First, let\'s say it slowly. Different. Now, let\'s whisper it twice. Different, different. Now let\'s say it four times using silly voices. Different! Different! Different! Different! Now let\'s say it three times super fast! Different, different, different! Okay, let\'s try stretching it out now. Different. Great job! One last time, nice and clear. Different.', note: 'New in pass MT: your version, word for word (Learning words).' },
  { n: 68, kind: 'line', text: 'Match means find one that is the same. This cup matches this cup. Our word is match. Let\'s say it together! First, let\'s say it like a big, sleepy giant. Match. Now, let\'s squeak it twice, like a tiny mouse! Match, match! Now let\'s cheer it like we\'re at a big game! Match! Match! Match! Now let\'s say it three times super fast! Match, match, match! Okay, let\'s try stretching it out like play dough now. Match. Great job! One last time, nice and clear. Match.', note: 'New in pass MT: like a sleepy giant, a tiny mouse, the cheer with its whistles and its crowd, and play dough (Learning words).' },
  { n: 69, kind: 'line', text: 'Same means just alike. A red circle and a red circle are the same, so they match. Our word is same. Let\'s say it together! First, let\'s say it slowly. Same. Now, let\'s squeak it twice, like a tiny mouse! Same, same! Now let\'s slide it down, from high to low. Same, same, same. Now let\'s say it three times super fast! Same, same, same! Okay, let\'s try stretching it out now. Same. Great job! One last time, nice and clear. Same.', note: 'New in pass MT: the slide, high to low over three sayings, and a word of one syllable (Learning words).' },
  { n: 70, kind: 'line', text: 'This is a grandma. A grandma is the mom of your mom or your dad. A grandma can help take care of you. Our word is grandma. Let\'s say it together! First, let\'s say it like a big, sleepy giant. Grandma. Now, let\'s whisper it twice. Grandma, grandma. Now let\'s bounce it, up high and down low! Grandma! Grandma! Grandma! Grandma! Now let\'s say it three times super fast! Grandma, grandma, grandma! Okay, let\'s try stretching it out like play dough now. Grandma. Great job! One last time, nice and clear. Grandma.', note: 'New in pass MT: bounced up high and down low, a word of two syllables (Words for people).' },
  { n: 71, kind: 'line', text: 'A birthday party is a happy day, often with a cake that has candles to blow out. Our word is birthday party. Let\'s say it together! First, let\'s say it slowly. Birthday party. Now, let\'s squeak it twice, like a tiny mouse! Birthday party, birthday party! Now let\'s cheer it like we\'re at a big game! Birthday party! Birthday party! Birthday party! Now let\'s say it three times super fast! Birthday party, birthday party, birthday party! Okay, let\'s try stretching it out like play dough now. Birthday party. Great job! One last time, nice and clear. Birthday party.', note: 'New in pass MT: two words said as one, cheered (Things that happen).' },
  { n: 72, kind: 'line', text: 'At bedtime, you put on your pajamas and sleep in your bed. Our word is bedtime. Let\'s say it together! First, let\'s say it like a big, sleepy giant. Bedtime. Now, let\'s whisper it twice. Bedtime, bedtime. Now let\'s slide it down, from high to low. Bedtime, bedtime, bedtime. Now let\'s say it three times super fast! Bedtime, bedtime, bedtime! Okay, let\'s try stretching it out now. Bedtime. Great job! One last time, nice and clear. Bedtime.', note: 'New in pass MT: a quiet word, a sleepy giant, whispered and slid (Things that happen).' },
  // Pass MV: the voices a lesson shows (VOICE_MANNERS), lines word for word from A voice to fit the place (rows 73 to 76), My voice
  // goes up and down (77 to 81) and My voice tells more (82 and 83), and one of its questions (84).
  { group: 'Voices a lesson shows (pass MV): soft and big, kind, up and down, asking and telling, a strong word, happy and sad' },
  { n: 73, kind: 'line', text: 'Your voice can be quiet, and your voice can be big. Listen. This is a whisper. Shh, the baby is sleeping.', voices: [['Shh, the baby is sleeping.', 'whisper']], note: 'New in pass MV: the last sentence as a whisper, slow and soft. Some phones say every row at one loudness; the recording will truly whisper.' },
  { n: 74, kind: 'line', text: 'In the classroom, use an inside voice, not too loud and not too soft, when you talk with your teacher. This is an inside voice. May I have a crayon, please?', voices: [['May I have a crayon, please?', 'inside']], note: 'New in pass MV: the last sentence in an inside voice.' },
  { n: 75, kind: 'line', text: 'On the playground, by the slide, you can use a big outside voice, so a friend far away can hear you. This is a big outside voice. Over here!', voices: [['Over here!', 'outside']], note: 'New in pass MV: the last words as a big outside voice, bright and high, since a phone\'s voice cannot truly call.' },
  { n: 76, kind: 'line', text: 'Your voice can sound kind too. When a friend is sad, use a kind, soft voice. Are you okay?', voices: [['Are you okay?', 'kind']], note: 'New in pass MV: the last sentence kind and soft.' },
  { n: 77, kind: 'line', text: 'Now say it like me, up high for the bird, and down low for the bear. Up high! Down low.', voices: [['Up high!', 'high', 'turn'], ['Down low.', 'low', 'turn']], note: 'New in pass MV: up high, a pause for the child to say it back, then down low and a pause.' },
  { n: 78, kind: 'line', text: 'When we ask a question, our voice often goes up at the end. Is it a ball?', voices: [['Is it a ball?', 'ask']], note: 'New in pass MV: the question going up at the end.' },
  { n: 79, kind: 'line', text: 'When we tell, our voice often goes down at the end. It is a ball.', voices: [['It is a ball.', 'tell']], note: 'New in pass MV: the telling going down at the end.' },
  { n: 80, kind: 'line', text: 'We can say one word strong, to show it matters most. I want the RED circle, not the blue one.', voices: [['I want the RED circle, not the blue one.', 'strong']], note: 'New in pass MV: red said strong, slower and higher, the other words as usual.' },
  { n: 81, kind: 'line', text: 'Now I\'ll say the other word strong. I want the red CIRCLE, not the red square.', voices: [['I want the red CIRCLE, not the red square.', 'strong']], note: 'New in pass MV: circle said strong.' },
  { n: 82, kind: 'line', text: 'The same words can ask a question or tell you something. You have a dog? With the voice going up at the end, it asks. You have a dog. With the voice going down, it tells.', voices: [['You have a dog?', 'ask'], ['You have a dog.', 'tell']], note: 'New in pass MV: the same words asked and told. A phone\'s voice may lift a question with a telling\'s words only a little; the recording will lift it clearly.' },
  { n: 83, kind: 'line', text: 'The same words can sound happy or sad. We are going home! In a quick voice going up high, that sounds happy. We are going home. In a slow, low voice, that sounds sad. So listen to how something is said, and you can tell if someone feels happy or sad.', voices: [['We are going home!', 'happy'], ['We are going home.', 'sad']], note: 'New in pass MV: the same words happy, quick and high, then sad, slow, soft and low.' },
  { n: 84, kind: 'line', text: 'Listen to how it is said. The bus is here. How does it sound?', voices: [['The bus is here.', 'sad']], note: 'New in pass MV: a question from My voice tells more, its sentence said sad; a child answers with a happy or a sad face.' },
];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// A row shows the words it says (a line, a trial line, or what a single row hands the voice, in quotes; round three's wording of row
// 25 showed only what the row was for, and Mikey wrote "The audio does not match the text"), then what it is for and anything new.
const rowWords = (r) => (r.kind === 'line' || r.kind === 'trial' ? '<q>' + esc(r.text) + '</q>' : r.kind === 'say' ? '<q>' + esc(r.text) + '</q><small>' + esc(r.label) + '</small>' : esc(r.label));
const rowsHtml = VOICE_CHECK_ROWS.map((r) => (r.group
  ? `<h2>${esc(r.group)}</h2>`
  : `<button type="button" class="row" id="row-${r.n}" data-n="${r.n}"><span class="num">${r.n}</span><span class="words">${rowWords(r)}${r.note ? '<small class="note">' + esc(r.note) + '</small>' : ''}</span><span class="play" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22"><path d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 010 7M18 6a8.5 8.5 0 010 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></span></button>`)).join('\n');

// The page's script: the app's own speech code, then the page's part. Kept as its own string so the rules test can run it in
// node:vm (voiceCheckSelfTest, below) and see that the page holds the functions it calls and says a line as the app does.
export const VOICE_CHECK_SCRIPT = `${speechLogic}
${speechScreens}
// The page's own part: tap a row and it plays, the way a lesson would; a new tap stops what was playing.
const ROWS = ${JSON.stringify(VOICE_CHECK_ROWS.filter((r) => !r.group))};
// A browser with no voice (an app's built-in browser, as on Mikey's phone in pass MO, where only rows 1 to 10 played) is told so at
// the top, with the way to hear every row, in one notice, the voice line hidden then (round one's screen check: the two said the
// same thing twice): at once when the browser cannot speak at all, and since round one's code check also when it has the speech
// feature but still no voice to speak with a moment after the page opens, or when a row's words never begin even after the row
// asks once more, which is what a voice with no voices does.
let noWords = false;
const showVoice = () => { const v = pickVoice(); const none = !canSpeak() || noWords; const el = document.getElementById('voice'); if (el) { el.hidden = none; el.textContent = v ? 'Your phone\\'s voice: ' + v.name + ' (' + v.lang + ')' : 'Your phone\\'s voice: its default voice'; }
  const box = document.getElementById('novoice'); if (box) box.hidden = !none; };
const noVoiceAfterAll = () => { if (!noWords) { noWords = true; showVoice(); } };
// The notice goes again when a voice turns up after all (round two's second read: a phone's list of voices can come after the
// first second and a half, as Android Chrome's often does, and the notice had stayed while rows spoke): when the list arrives
// with a voice in it, or when a row's words begin.
const voiceAfterAll = () => { if (noWords) { noWords = false; showVoice(); } };
const voicesArrived = () => { try { if (window.speechSynthesis.getVoices().length > 0) voiceAfterAll(); } catch (e) { /* no voice list to read */ } showVoice(); };
showVoice(); if (window.speechSynthesis && 'onvoiceschanged' in window.speechSynthesis) window.speechSynthesis.onvoiceschanged = voicesArrived;
setTimeout(() => { try { if (canSpeak() && window.speechSynthesis.getVoices().length === 0) noVoiceAfterAll(); } catch (e) { /* no voice list to read */ } }, 1500);
let lit = null;
const light = (n) => { if (lit) lit.classList.remove('playing'); lit = n ? document.getElementById('row-' + n) : null; if (lit) lit.classList.add('playing'); };
// As speak() does (CLAUDE.md's speech line, round one's code check): a voice still talking, or a sound still playing, is stopped
// first and the row starts 80 ms later, if no newer tap has come, since a phone's browser drops words spoken straight after a
// cancel; a quiet voice starts at once. A row the voice says alone takes the plain shape a lesson gives it (igg and at are said
// in their sentence's shape). As speak() does (round four's code check), a row whose first words a phone dropped (a page's first
// words, on some phones) is asked once more if nothing began within 700 ms, each send its own attempt, so the dropped try is retired.
const play = (row) => {
  const ticket = ++speechTicket; const ss = window.speechSynthesis; let began = false; let attempt = 0;
  light(row.n); const done = () => { if (ticket === speechTicket) light(null); };
  const start = () => {
    if (ticket !== speechTicket) return;
    if (row.kind === 'sound') { began = true; playSound(row.sound, done); return; }
    const pieces = row.kind === 'line' ? speechPieces(row.text, row.voices ? { voices: row.voices } : {}) : row.kind === 'trial' ? speechPieces(row.text, { trial: true }) : [{ text: row.text, shape: 'plain', sentence: 0 }];   // a row's voices (pass MV) as a lesson hands them
    if (!canSpeak() && pieces.some((p) => !p.sound)) { began = true; done(); return; }
    const mine = attempt; speechAlive = []; const voice = pickVoice();
    // A lesson row is said in the young voice a pre-reader hears since pass MQ (a little slower, a rest between sentences); a row of
    // one word the voice is handed alone is said as before. The rest comes before a piece that starts a sentence, by the app's own
    // restBefore (round three's alignment read, pass MQ), so row 21's "Sss! he said" runs on, as speak() says a line; a lesson reads
    // each sentence as its own text and would rest there, so the rules test holds every lesson line to having no such cut.
    const young = row.kind !== 'say';
    sayPieces(pieces, 0, { alive: () => ticket === speechTicket && mine === attempt, utter: (u, piece) => { shapeVoice(u, piece, voice, 1, young); try { u.addEventListener('start', voiceAfterAll); } catch (e) { /* an utterance that cannot listen */ } }, onBegin: () => { began = true; }, onDone: done, pause: young ? restBefore(YOUNG_PAUSE_MS) : null });
  };
  if ((ss && (ss.speaking || ss.pending)) || soundPlaying) { try { if (ss) ss.cancel(); } catch (e) { /* nothing to stop */ } stopSound(); setTimeout(start, 80); } else start();
  setTimeout(() => { if (!began && ticket === speechTicket && ss && ss.speaking === false && ss.pending === false && !soundPlaying) { attempt += 1; try { ss.cancel(); } catch (e) { /* as above */ } setTimeout(start, 80);
    setTimeout(() => { if (!began && ticket === speechTicket && !soundPlaying) noVoiceAfterAll(); }, 1500); } }, 700);
};
document.querySelectorAll('.row').forEach((b) => b.addEventListener('click', () => play(ROWS.find((r) => r.n === Number(b.dataset.n)))));
`;

export const VOICE_CHECK_HTML = `<title>Wise Human Voice Check</title>
<meta name="claude:viewport-fit-sides" content="cover">
<style>
/* One column of numbered rows to tap, in The Wise Human's own greens and golds and the system face it uses. */
:root { --bg: #F5F7F1; --surface: #FFFFFF; --ink: #24291F; --muted: #5C6355; --line: #DCE3D6; --green: #2F5D4F; --gold: #B8862B; --gold-soft: #F7EAD1; --on-gold: #24291F; --font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --bg: #14231E; --surface: #1D302A; --ink: #F1EDE3; --muted: #B3C1B9; --line: #34503F; --green: #7CC3A6; --gold: #D9A441; --gold-soft: #233B31; --on-gold: #0E1A16; color-scheme: dark; } }
:root[data-theme="dark"] { --bg: #14231E; --surface: #1D302A; --ink: #F1EDE3; --muted: #B3C1B9; --line: #34503F; --green: #7CC3A6; --gold: #D9A441; --gold-soft: #233B31; --on-gold: #0E1A16; color-scheme: dark; }
body { background: var(--bg); color: var(--ink); font-family: var(--font); font-size: 16px; line-height: 1.45; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); padding-block: 20px 40px; }
main { max-width: 640px; margin: 0 auto; display: grid; gap: 10px; }
h1 { font-size: 24px; margin: 0; text-wrap: balance; color: var(--green); }
h2 { font-size: 13px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); margin: 18px 0 2px; font-weight: 700; }
.intro { margin: 0; color: var(--ink); max-width: 62ch; }
.voice { margin: 0; font-size: 14px; color: var(--muted); }
.row { display: grid; grid-template-columns: 40px 1fr 44px; gap: 12px; align-items: center; width: 100%; text-align: left; font: inherit; color: var(--ink); background: var(--surface); border: 1.5px solid var(--line); border-radius: 14px; padding: 12px 12px 12px 10px; cursor: pointer; }
.row:focus-visible { outline: 3px solid var(--gold); outline-offset: 2px; }
.row .num { font-variant-numeric: tabular-nums; font-weight: 700; font-size: 17px; color: var(--green); text-align: center; }
.row .words { min-width: 0; }
.row q { quotes: none; }
.row small { display: block; margin-top: 4px; font-size: 14px; color: var(--muted); }
.row small.note { color: var(--green); font-weight: 600; }
.novoice { margin: 0; padding: 12px 14px; border-radius: 14px; background: var(--gold-soft); border: 2px solid var(--gold); color: var(--ink); }
.row .play { width: 44px; height: 44px; border-radius: 999px; display: inline-flex; align-items: center; justify-content: center; background: var(--gold-soft); color: var(--ink); border: 2px solid var(--gold); }
.row.playing { border-color: var(--gold); }
.row.playing .play { background: var(--gold); color: var(--on-gold); }
.foot { font-size: 14px; color: var(--muted); margin: 14px 0 0; }
@media (prefers-reduced-motion: no-preference) { .row { transition: border-color 150ms; } }
</style>
<main>
<h1>Voice check</h1>
<p class="intro">Tap a row to hear it, with the sound on. The sounds in the first list and in the lists from row 33 are made by the app, so every phone plays the same ones. The words are your phone's own voice, a placeholder until the recorded voice. Tell Claude the numbers that sound wrong, and how, whenever you like. A green note under a row says what changed in pass MP, MQ, MR, MS, MT, MU or MV. Inside an app's preview, such as Claude's app on a phone, the phone's own voice may say nothing while the app's sounds still play; open this page's link in Safari or Chrome to hear every row.</p>
<p class="voice" id="voice">Your phone's voice: finding it...</p>
<p class="novoice" id="novoice" hidden>This browser has no voice, so only the app's own sounds play here: rows 1 to 10, 33 to 44, 65 and 66. To hear every row, open this page's link in Safari or Chrome rather than inside another app.</p>
${rowsHtml}
<p class="foot">Built from the app's own speech code, so a lesson says each line the way this page does.</p>
</main>
<script>
${VOICE_CHECK_SCRIPT}</script>
`;
// The page's self-test (round one's code check, pass MO): its script run in node:vm with a stand-in window, voice and audio, then
// the functions it calls are looked for, its speech is held to the app's, and since round two's code check every row is played and
// heard, row by row; it returns the problems found. The rules test calls it, so code that moves out of a slice fails a test rather
// than building a silent page.
export async function voiceCheckSelfTest(L, script = VOICE_CHECK_SCRIPT) {
  const vm = await import('node:vm');
  // A stand-in window on a fake clock: a voice that says what it is handed in turn and records it, and an audio element that records
  // what it plays (round two's code check: the self-test never played a row, so a slice that lost soundUrl passed while the page's
  // first row threw).
  let now = 0; let seq = 0; const timers = []; const log = []; let queue = []; let blobs = 0; let lastCancel = -100; const rates = []; let deafUntil = -1;
  // Each utterance's pitch and loudness beside its rate (pass MV, round one's code check: with only the rate recorded, a page that gave
  // a voice up high the plain pitch passed).
  const pitches = []; const volumes = [];
  // When each piece starts and ends, voice and sound alike, in the order they play (pass MQ, round one's code check), so a row's
  // rests between sentences can be measured.
  const marks = [];
  const later = (fn, ms, every = 0) => { const id = ++seq; timers.push({ id, at: now + Math.max(0, Number(ms) || 0), fn, every }); return id; };
  const clear = (id) => { const i = timers.findIndex((t) => t.id === id); if (i >= 0) timers.splice(i, 1); };
  const tick = (ms) => { const end = now + ms; while (timers.length) { timers.sort((x, y) => x.at - y.at || x.id - y.id); const t = timers[0]; if (t.at > end) break; now = t.at; if (t.every) t.at += t.every; else timers.shift(); t.fn(); } now = end; };
  // Each utterance is started once, though an end handler may queue the next words itself (round three's code check).
  const startNext = () => { const u = queue[0]; if (!u || u.__started) return; u.__started = true; later(() => { if (queue[0] !== u) return; log.push(`say ${u.text}`); marks.push({ t: now, k: 's' }); if (u.onstart) u.onstart({}); later(() => { if (queue[0] !== u) return; queue.shift(); marks.push({ t: now, k: 'e' }); if (u.onend) u.onend({}); startNext(); }, 50); }, 5); };
  // As the rules test's voice does, what is spoken within 4 ms of a cancel is dropped, with no events (a phone's browser does so),
  // and, since round four, what is spoken before deafUntil (a voice not ready yet, which drops a page's first words).
  const ss = { get speaking() { return queue.length > 0; }, get pending() { return queue.length > 1; }, cancel() { lastCancel = now; const old = queue; queue = []; for (const u of old) later(() => { if (u.onerror) u.onerror({}); }, 1); },
    speak(u) { if (now - lastCancel < 4 || now < deafUntil) { log.push(`dropped ${u.text}`); return; } rates.push(u.rate); pitches.push(u.pitch); volumes.push(u.volume); queue.push(u); if (queue.length === 1) startNext(); }, getVoices() { return []; } };
  function Audio() { const a = { src: '', onended: null, onerror: null, t: 0, play() { log.push(`sound ${a.src}`); marks.push({ t: now, k: 's' }); a.t = later(() => { marks.push({ t: now, k: 'e' }); if (a.onended) a.onended(); }, 100); return Promise.resolve(); }, pause() { clear(a.t); } }; return a; }
  const el = () => ({ textContent: '', classList: { add() {}, remove() {} }, addEventListener() {}, dataset: {} });
  function SpeechSynthesisUtterance(t) { this.text = t; }
  const win = { speechSynthesis: ss, addEventListener() {}, Audio, SpeechSynthesisUtterance };
  const ctx = vm.createContext({ window: win, document: { getElementById: () => el(), querySelectorAll: () => [] }, console, setTimeout: (f, ms) => later(f, ms), clearTimeout: clear, setInterval: (f, ms) => later(f, ms, ms), clearInterval: clear, Date: { now: () => now },
    URL: { createObjectURL: () => `blob:${++blobs}` }, Blob: function Blob() {}, SpeechSynthesisUtterance, navigator: { userAgent: 'node' } });
  const problems = [];
  try { vm.runInContext(`${script}\nglobalThis.__vc = { speechPieces, soundClipWav, sayPieces, playSound, stopSound, pickVoice, canSpeak, shapeVoice, play, SPEECH_SHAPES, YOUNG_RATE: typeof YOUNG_RATE === 'number' ? YOUNG_RATE : null, YOUNG_PAUSE_MS: typeof YOUNG_PAUSE_MS === 'number' ? YOUNG_PAUSE_MS : null, startsSentence: typeof startsSentence === 'function' ? startsSentence : null, OWN_PACE_SHAPES: typeof OWN_PACE_SHAPES !== 'undefined' ? OWN_PACE_SHAPES : null };`, ctx); }
  catch (e) { problems.push(`the page's script does not run: ${e && e.message}`); return problems; }
  const vc = ctx.__vc || {};
  for (const name of ['speechPieces', 'soundClipWav', 'sayPieces', 'playSound', 'stopSound', 'pickVoice', 'canSpeak', 'shapeVoice', 'play']) if (typeof vc[name] !== 'function') problems.push(`the page has no ${name}`);
  if (!problems.length) {
    for (const r of VOICE_CHECK_ROWS.filter((x) => x.kind === 'line' || x.kind === 'trial')) { const o = r.kind === 'trial' ? { trial: true } : r.voices ? { voices: r.voices } : {}; if (JSON.stringify(vc.speechPieces(r.text, o)) !== JSON.stringify(L.speechPieces(r.text, o))) problems.push(`row ${r.n} is said otherwise on the page`); }
    // Every sound a row plays is one the app makes (pass MP: the trial rows' sounds, and the new sound rows', are made, never silent).
    for (const r of VOICE_CHECK_ROWS.filter((x) => x.kind === 'sound')) { const w = vc.soundClipWav(r.sound); if (!w || w.length < 1000) problems.push(`row ${r.n}'s sound ${r.sound} is not made`); }
    for (const r of VOICE_CHECK_ROWS.filter((x) => x.kind === 'trial')) for (const p of L.speechPieces(r.text, { trial: true })) if (p.sound && !vc.soundClipWav(p.sound)) problems.push(`row ${r.n}'s sound ${p.sound} is not made`);
    // The notice for a browser with no voice names exactly the rows that are sounds (round one's code check, pass MT: it still named
    // row 64, retired with the clap).
    { const soundRows = VOICE_CHECK_ROWS.filter((x) => x.kind === 'sound' || x.kind === 'trialSound').map((x) => x.n); const m = /only the app's own sounds play here: ([^.]*)\./.exec(VOICE_CHECK_HTML); const named = []; if (m) for (const part of m[1].split(/, | and /)) { const r = /^rows? (\d+)(?: to (\d+))?$/.exec(part.trim()) || /^(\d+)(?: to (\d+))?$/.exec(part.trim()); if (r) for (let n = Number(r[1]); n <= Number(r[2] || r[1]); n++) named.push(n); }
      if (!m || JSON.stringify(named) !== JSON.stringify(soundRows)) problems.push(`the no-voice notice names rows ${named.join(',')}, not the sound rows ${soundRows.join(',')}`); }
    for (const s of ['s', 'm', 't', 'whistle', 'applause']) { const a = vc.soundClipWav(s); const b = L.soundClipWav(s); if (!a || !b || a.length !== b.length || a.some((v, i) => v !== b[i])) problems.push(`the page's ${s} is not the app's`); }
    // Every row played, as a tap plays it: a sound row plays one of the app's clips, a line row hands the voice the line's words with
    // its sounds between them, in order, and a single row hands it its own text.
    // Each row from quiet, over a line still playing (row 12, 200 ms in) and over a sound still playing (row 1, 50 ms in), as a tap
    // during another row plays it; a single row in the plain shape (rate 0.86).
    const rows = VOICE_CHECK_ROWS.filter((x) => !x.group); const row12 = rows.find((x) => x.n === 12); const row1 = rows.find((x) => x.n === 1);
    for (const r of rows) for (const [before, wait] of [[null, 0], [row12, 200], [row1, 50]]) {
      const where = before ? ` over row ${before.n}` : '';
      try { if (before) { vc.play(before); tick(wait); } log.length = 0; rates.length = 0; pitches.length = 0; volumes.length = 0; marks.length = 0; win.__eduSounds = []; vc.play(r); tick(40000); } catch (e) { problems.push(`row ${r.n}${where} throws: ${e && e.message}`); continue; }
      // A row's voices (pass MV) are handed on as the page hands them.
      const piecesOf = (row) => L.speechPieces(row.text, row.kind === 'trial' ? { trial: true } : row.voices ? { voices: row.voices } : {});
      const want = r.kind === 'sound' ? ['sound'] : r.kind === 'line' || r.kind === 'trial' ? piecesOf(r).map((p) => (p.sound ? 'sound' : `say ${p.text}`)) : [`say ${r.text}`];
      const got = log.map((x) => (x.startsWith('sound blob:') ? 'sound' : x));
      if (JSON.stringify(got) !== JSON.stringify(want)) problems.push(`row ${r.n}${where} plays ${JSON.stringify(got)}, not ${JSON.stringify(want)}`);
      // Which sound, by name, as playSound records each one asked for (round one's code check, pass MP: every sound was counted as
      // "sound", so a page whose sound rows all played sss, or whose row 45 played duh for buh, showed no problem).
      const wantSounds = r.kind === 'sound' ? [r.sound] : r.kind === 'line' || r.kind === 'trial' ? piecesOf(r).filter((p) => p.sound).map((p) => p.sound) : [];
      if (JSON.stringify(win.__eduSounds || []) !== JSON.stringify(wantSounds)) problems.push(`row ${r.n}${where} plays the sounds ${JSON.stringify(win.__eduSounds)}, not ${JSON.stringify(wantSounds)}`);
      if (r.kind === 'say' && !(rates.length === 1 && Math.abs(rates[0] - 0.86) < 1e-9)) problems.push(`row ${r.n}${where} is said at the rate ${rates.join(', ')}, not the plain shape's 0.86`);
      // Since round four's code check a line row is said piece by piece at its own shape's rate, as a lesson says it (a page that said
      // every line in the plain shape passed, row 32's "Can." at 0.86 where a lesson says it at 0.6); since pass MQ in the young voice,
      // every piece but a word at play a little slower (YOUNG_RATE), as a pre-reader's lesson says it; since pass MR a piece in a
      // shape with a pace of its own (OWN_PACE_SHAPES: a word at play and the say-it-with-me voices, a whisper or super fast) keeps
      // that pace, as the app's shapeVoice does, and a page without the list fails rather than guess it.
      if ((r.kind === 'line' || r.kind === 'trial') && vc.SPEECH_SHAPES) { if (!Array.isArray(vc.OWN_PACE_SHAPES)) { problems.push('the page has no OWN_PACE_SHAPES'); continue; }
        // Since pass MV a voice a lesson shows (a said- shape) is held to logic's own VOICE_MANNERS, so a page whose copy of the table
        // drifted fails, and every piece's pitch and loudness are held as its rate is (a shape with no loudness leaves the voice's own).
        const shapeOf = (p) => (/^said-/.test(p.shape) && L.VOICE_MANNERS[p.shape.slice(5)] ? L.VOICE_MANNERS[p.shape.slice(5)].device : vc.SPEECH_SHAPES[p.shape] || vc.SPEECH_SHAPES.plain);
        const voiced = piecesOf(r).filter((p) => !p.sound);
        const wantRates = voiced.map((p) => shapeOf(p).rate * (vc.OWN_PACE_SHAPES.includes(p.shape) ? 1 : vc.YOUNG_RATE || NaN));
        if (rates.length !== wantRates.length || rates.some((x, i) => Math.abs(x - wantRates[i]) > 1e-9)) problems.push(`row ${r.n}${where} is said at the rates ${rates.join(', ')}, not its pieces' ${wantRates.join(', ')}`);
        const wantPitches = voiced.map((p) => shapeOf(p).pitch); const wantVolumes = voiced.map((p) => shapeOf(p).volume);
        if (pitches.length !== wantPitches.length || pitches.some((x, i) => typeof x !== 'number' || Math.abs(x - wantPitches[i]) > 1e-9)) problems.push(`row ${r.n}${where} is said at the pitches ${pitches.join(', ')}, not its pieces' ${wantPitches.join(', ')}`);
        if (volumes.length !== wantVolumes.length || volumes.some((x, i) => (wantVolumes[i] === undefined ? x !== undefined : typeof x !== 'number' || Math.abs(x - wantVolumes[i]) > 1e-9))) problems.push(`row ${r.n}${where} is said at the loudness ${volumes.map(String).join(', ')}, not its pieces' ${wantVolumes.map(String).join(', ')}`); }
    }
    // And its rests (pass MQ, round one's code check: a page that handed sayPieces no pause passed every check above): played from
    // quiet, a line or trial row waits at least YOUNG_PAUSE_MS after a piece before the next one when that one starts a new sentence,
    // as a pre-reader's lesson does; and since round three's alignment read (p48) only when that piece starts a sentence by the app's
    // own startsSentence, with no rest before a piece the sentence rule cut off inside one (row 21's "he said", after "Sss!").
    for (const r of rows.filter((x) => x.kind === 'line' || x.kind === 'trial')) {
      if (typeof vc.YOUNG_PAUSE_MS !== 'number') { problems.push('the page has no YOUNG_PAUSE_MS'); break; }
      if (typeof vc.startsSentence !== 'function') { problems.push('the page has no startsSentence'); break; }
      try { tick(2000); log.length = 0; marks.length = 0; vc.play(r); tick(40000); } catch (e) { problems.push(`row ${r.n}'s rests throw: ${e && e.message}`); continue; }
      const ps = L.speechPieces(r.text, r.kind === 'trial' ? { trial: true } : r.voices ? { voices: r.voices } : {}); const starts = marks.filter((m) => m.k === 's').map((m) => m.t); const ends = marks.filter((m) => m.k === 'e').map((m) => m.t);
      if (starts.length !== ps.length || ends.length !== ps.length) { problems.push(`row ${r.n} plays ${starts.length} pieces, not ${ps.length}`); continue; }
      for (let i = 1; i < ps.length; i++) { const gap = starts[i] - ends[i - 1];
        // A say-along (pass MS): a form's sayings keep together, a cheer's sayings and sounds and the slide's steps a few
        // milliseconds apart, but for the brief pause a way asks after a saying (pauseAfter, pass MT: the four silly voices, bounced,
        // whispered and squeaked twice), which is kept, and the piece that ends a form is followed by the child's turn (its echo).
        if (ps[i - 1].inForm !== undefined && ps[i].inForm === ps[i - 1].inForm) { const want = ps[i - 1].pauseAfter || 0; if (gap > want + 100 || gap < want - 20) { problems.push(`row ${r.n} rests ${gap} ms before "${ps[i].text}", inside a say-along's sayings, where its way pauses ${want} ms`); break; } continue; }
        if (ps[i - 1].echo) { if (!(gap >= ps[i - 1].echo)) { problems.push(`row ${r.n} waits ${gap} ms after "${ps[i - 1].text}", not the child's turn of ${ps[i - 1].echo} ms`); break; } continue; }
        if (ps[i].sentence === ps[i - 1].sentence) continue; const opens = vc.startsSentence(ps[i]);
        // No rest inside a sentence means none at all (round five's code read: a page resting 200 ms there passed a check for 450):
        // pieces run on within a few milliseconds, two sounds side by side a fifth of a second apart.
        if (opens ? !(gap >= vc.YOUNG_PAUSE_MS) : gap > (ps[i].sound && ps[i - 1].sound ? 250 : 100)) { problems.push(`row ${r.n} rests ${gap} ms before "${ps[i].text}", ${opens ? `not ${vc.YOUNG_PAUSE_MS}` : 'inside its sentence'}`); break; } }
    }
    // A voice not ready yet drops a row's first words (some phones drop a page's first words): the row is asked once more, and each
    // piece is said once (round four's code check: play() had no retry, where speak() has).
    for (const r of rows.filter((x) => x.kind !== 'sound')) {
      try { tick(2000); log.length = 0; deafUntil = now + 50; vc.play(r); tick(40000); deafUntil = -1; } catch (e) { deafUntil = -1; problems.push(`row ${r.n} after dropped first words throws: ${e && e.message}`); continue; }
      const want = r.kind === 'line' || r.kind === 'trial' ? L.speechPieces(r.text, r.kind === 'trial' ? { trial: true } : r.voices ? { voices: r.voices } : {}).map((p) => (p.sound ? 'sound' : `say ${p.text}`)) : [`say ${r.text}`];
      const got = log.filter((x) => !x.startsWith('dropped ')).map((x) => (x.startsWith('sound blob:') ? 'sound' : x));
      if (JSON.stringify(got) !== JSON.stringify(want)) problems.push(`row ${r.n} after dropped first words plays ${JSON.stringify(got)}, not ${JSON.stringify(want)}`);
    }
  }
  return problems;
}
// Written only when this file is the one being run (its own name, read with endsWith, so a folder with a space still works).
if (process.argv[1] && process.argv[1].endsWith('voice-check.mjs')) {
  mkdirSync(new URL('../dist/', import.meta.url), { recursive: true });
  writeFileSync(new URL('../dist/voice-check.html', import.meta.url), VOICE_CHECK_HTML);
  console.log(`dist/voice-check.html written (${VOICE_CHECK_ROWS.filter((r) => !r.group).length} rows, ${Math.round(VOICE_CHECK_HTML.length / 1024)} KB)`);
}
