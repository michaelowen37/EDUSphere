// Copyright (c) 2026 iECHO, LLC. All rights reserved.
// -----------------------------------------------------------------------------------------------------------------
// A bank read blind (pass NQ, EARMARKS L26: the lead's blind-read scripts, put in the tree so no chat writes them again).
//
// In plain terms: since pass NJ every new bank is "scored blind, alone and in rounds as built": a child who does not listen, or does
// not understand, must not be right much more often than chance by a habit. Pass NP's lead found its first build of the prediction banks
// right about two times in three for a child who always tapped the same picture, and no one had looked until a person tried it. This
// tool plays the child who guesses by habit, over many questions of a bank, and says how often each habit is right, against chance.
//
// The habits (each is what a child could do without understanding the question; a choice the habit would tap that the question does not
// offer is tapped at random among the choices, which is how a real child would tap):
//   - always the first button;
//   - always the same choice (each choice value in turn; the best is reported and named);
//   - always a picture of one kind (the choice token's kind, the part before a colon or tilde: pic, icon, face, shape, word for a
//     plain word; among the choices of that kind one is tapped at random; the best kind is reported and named);
//   - for a bank whose questions have a story line: a child who heard only the story (taps at random among the choices the story names,
//     all of them when it names none) and a child who heard only the question (for each question, taps the choice most often right for
//     that same prompt across the bank, leaving the question itself out, ties at random), as pass NP's blind block defines them;
//   - for a bank whose questions draw a picture: a child who saw only the picture (the same, by the picture drawn);
//   - for a yes or no bank: the share of its answers that are Yes (a bank near 50 gives a habit nothing);
//   - for an order question (tap the pictures in the story's order): the child who taps from the top left, the first choices in the order
//     shown, against chance of one in the number of ways to order them (1 in 12 for two of four, 1 in 24 for three of four).
// Questions with no choices to tap (typed numbers, tracing) say so and are skipped.
// Mark, and its margin (each group of questions is marked against its own chance and count, and a starred cell is the one over its limit): a row is marked "<<" when a habit beats chance by more than a margin (unless BY_DESIGN holds it, below), the margin the rules test holds the pre-K
// banks to since passes NM and NP: two choices at most 6 points over chance (under 56 percent), three at most 9 (under 42), four at most
// 7 (under 32), and the same 6 for five or more, where no test bound exists; never less than three standard errors over chance (so a read
// of 300 seeds is not marked for noise), the standard error being the square root of chance times its opposite over the number of
// questions. Pass NP's own banks read 53.8 percent for two choices and 35.4 for three, as built, inside those bounds. An order question
// is marked at 20 percent, the test's bound. A Yes share is marked outside 40 to 60. A mark on the story only row is expected where the
// answer is in the story by design (pre-K 3's which one was a clue); the reader decides, and the lesson says which banks are so.
// By design, read once (pass NW, EARMARKS A157): a mark a reader has judged to be the lesson itself is named in BY_DESIGN below, with
// the share it read at and why, so later passes read the reason instead of judging the mark again. Its row prints "by design" in place
// of the mark and is counted apart; it is marked again as soon as any group shows one of the bank's right answers as a wrong choice, a
// group read leans past the share by the tool's own margin, or, where the entry names the choice it was judged on, a group's best same
// choice is another; and an entry whose row is under its limit in every group is named stale. Since pass NX (EARMARKS A180) each of
// these compares choices without their # tags, the marks a bank of two alike pictures puts on them (icon:star#0 is icon:star), and a
// share of 1 is taken, for a bank whose one answer is right on every question. Only "always the same choice" can be
// judged so, by the rule an entry stands on: no right answer ever a wrong choice, at the seeds and rounds read (so a yes or no bank, each
// answer the other's wrong choice, is never held). That rule is a tripwire for a change after a reader's
// judgment, never the judgment itself: a two-choice bank of k rows, each with its own right answer, reads 0.5 + 0.5/k on this row, over
// its limit for k up to 8, so many banks meet it (58 of the 135 p3- and p4- banks that leaned on this row in pass NW; since pass NX,
// with the tags read as one, 54 of the 131 pre-K banks over it at seeds 1 to 2,000 alone, and three of four grade 3 Philosophy banks
// whose ids start p3-; EARMARKS A180), and only a reader can say the habit is the lesson: pass NX's reader judged 42 of them by design
// and nine to grow, their marks waiting for a lesson pass.
// A group of fewer than 30 questions is not read ("-"). A heard-only-the-question read can fall below chance (0 for a group where each prompt
// is asked once and answered the same way, since the question's own answer is left out of the table); only a read above chance is a habit.
//
// Run: node tools/blind-read.mjs <bank id or module id ...> [--seeds 2000] [--rounds] [--rounds-n 1500]
//   a module id reads every bank of the module; --seeds is how many seeds each bank is read alone (generateQuestion at seeds 1 to N);
//   --rounds also reads the bank's questions in the rounds buildAttempt deals for its module, as the rules test does (--rounds-n rounds
//   each of: a first round, a later round that avoids the last two rounds' prompts, a triple dose, and a Quick Review).
// Prints, per bank, a table of habits by group (alone, first, later, dose, review) with the worst of them, the chance, the margin and a
// mark; then one summary line, "N banks read, M marked", since pass NW with ", K by design (BY_DESIGN)" and any stale by-design entries. Exit code 0 (it reports; the rules test and the reader decide), or 2 for an id that is neither a bank nor a module (named, and
// nothing is read for it).
// --selftest: made banks (not in logic): one whose answer is always its first choice reads 100 percent for the first button; a fair one
// reads near chance on every habit; a story that names its answer and a prompt that fixes it are caught by their rows; and one real
// pre-K bank runs, alone and in rounds. Since pass NW the by-design table too: every entry a bank the logic has, with the one habit the
// tool can judge, a share and a reason, a planted bad table named for each problem; the banks it names read by design at the tool's
// defaults; and made banks: a choice right whenever it is shown read by design at its share, marked again past the share's margin, at a
// small group's own count too, and when any right answer is shown as a wrong choice, in any group, whichever choice reads best, or when
// a group's best is not the choice an entry was judged on; a group under 30 questions left unread; an entry of another habit, or with no
// share, holding nothing; a mark on another row kept; an entry over a fair bank, or one that leans too little, named stale; and a whole
// read through a module id with a table of its own, its problems first and a bank with nothing to tap counted; and, since round two's
// read, each condition read in every group, one case for each tripping it alone, an entry naming its choice beside a group under 30
// questions held, an entry of the first button's habit holding nothing on a leaning same choice, and a best that is no choice named.
// Since pass NX: the banks readers judged by design, each with its entry and no other, each read by design at seeds 1 to 2,000 alone,
// and a sample of six in rounds at the tool's defaults (a whole read of the table in rounds takes many minutes, past step 3f's limit);
// made banks whose # twins hide a slip from whole strings, marked again, with near misses held; a best compared without its tag, in a
// read and in the table's own check, and a best given as a number still marking the row; and a share of 1 taken, one just over named.
// -----------------------------------------------------------------------------------------------------------------
import { pathToFileURL, fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

// The kind of a choice token: the part before a colon or tilde (pic:cat is pic, shape:circle~red is shape), word for a plain word.
export const kindOf = (c) => { const m = /^([a-z][a-z0-9-]*)[:~]/i.exec(String(c)); return m ? m[1].toLowerCase() : 'word'; };
// The words a choice token says, for finding it in a story: after the colon, without a tilde variant, hyphens as spaces; a plain word as it is.
const nameOf = (c) => { const x = String(c); const body = /^[a-z][a-z0-9-]*:/i.test(x) ? x.replace(/^[^:]*:/, '') : x; return body.split('~')[0].replace(/-/g, ' ').toLowerCase().trim(); };
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const isTap = (q) => q && Array.isArray(q.choices) && q.choices.length >= 2 && q.type !== 'order' && !q.pick && (typeof q.answer === 'string' || typeof q.answer === 'number');
const isOrder = (q) => q && Array.isArray(q.choices) && q.pick && q.type === 'order';
const same = (a, b) => String(a) === String(b);
// A choice read without its # tag (pass NX, EARMARKS A180, its reader's finding). A bank that shows two alike pictures tags them, as in
// icon:star#0 and icon:star#1, so the screen can tell the two buttons apart, but a child sees one picture twice; so wherever the by-design
// rule compares choices (slipsOf, a group's best against the choice an entry names, and checkByDesign's best), icon:star#0 is icon:star.
// Every # in the app's choices is such a tag, at a choice's end (eighteen banks deal them in pass NX).
export const withoutTag = (c) => String(c).replace(/#\d+$/, '');

// The margin over chance that marks a habit, in points, by chance level (see the header for where each number stands in the rules test).
export function marginFor(chance, n) {
  const base = chance >= 0.45 ? 0.06 : chance >= 0.3 ? 0.09 : chance >= 0.22 ? 0.07 : 0.06;
  const se = Math.sqrt(chance * (1 - chance) / Math.max(1, n));
  return Math.max(base, 3 * se);
}

// A leave-one-out read: for each question, tap the choice most often right for questions with the same key (this question left out),
// ties at random (counted as a share). Pass NP's "question only" read, by any key.
function leaveOneOut(qs, keyOf) {
  const table = new Map();
  for (const q of qs) { const k = keyOf(q); if (!table.has(k)) table.set(k, new Map()); const t = table.get(k); t.set(String(q.answer), (t.get(String(q.answer)) || 0) + 1); }
  let sum = 0;
  for (const q of qs) { const t = table.get(keyOf(q)); const score = (c) => (t.get(String(c)) || 0) - (same(c, q.answer) ? 1 : 0); const best = Math.max(...q.choices.map(score)); const tied = q.choices.filter((c) => score(c) === best); sum += tied.some((c) => same(c, q.answer)) ? 1 / tied.length : 0; }
  return sum / qs.length;
}

// Every habit's share right over one group of tap questions, with the chance, and the name of the best choice or kind.
export function readTaps(qs) {
  const n = qs.length; const chance = qs.reduce((s, q) => s + 1 / q.choices.length, 0) / n;
  const first = qs.filter((q) => same(q.choices[0], q.answer)).length / n;
  const values = [...new Set(qs.flatMap((q) => q.choices.map(String)))];
  let same1 = { share: 0, name: '' };
  for (const w of values) { const s = qs.reduce((t, q) => t + (q.choices.some((c) => same(c, w)) ? (same(q.answer, w) ? 1 : 0) : 1 / q.choices.length), 0) / n; if (s > same1.share) same1 = { share: s, name: w }; }
  const kinds = [...new Set(qs.flatMap((q) => q.choices.map(kindOf)))];
  let kind1 = { share: 0, name: '' };
  for (const k of kinds) { const s = qs.reduce((t, q) => { const of = q.choices.filter((c) => kindOf(c) === k); return t + (of.length ? (of.some((c) => same(c, q.answer)) ? 1 / of.length : 0) : 1 / q.choices.length); }, 0) / n; if (s > kind1.share) kind1 = { share: s, name: k }; }
  const out = { n, chance, first: { share: first }, sameChoice: same1, oneKind: kind1 };
  const storied = qs.filter((q) => typeof q.story === 'string' && q.story);
  if (storied.length === n) {
    out.storyOnly = { share: qs.reduce((t, q) => { const text = q.story.toLowerCase(); const named = q.choices.filter((c) => { const w = nameOf(c); return w && new RegExp('(?<![a-z])' + escape(w) + '(?![a-z])', 'i').test(text); }); const pool = named.length ? named : q.choices; return t + (pool.some((c) => same(c, q.answer)) ? 1 / pool.length : 0); }, 0) / n };
    out.questionOnly = { share: leaveOneOut(qs, (q) => q.prompt) };
  }
  if (qs.every((q) => q.visual)) out.pictureOnly = { share: leaveOneOut(qs, (q) => JSON.stringify(q.visual)) };
  if (qs.every((q) => ['Yes', 'No'].includes(String(q.answer)))) out.yesShare = { share: qs.filter((q) => q.answer === 'Yes').length / n };
  return out;
}

// The order read: the child who taps the first choices in the order shown, against chance of one over the ways to order them.
export function readOrders(qs) {
  const n = qs.length; const top = qs.filter((q) => q.choices.slice(0, q.pick).map(String).join(' | ') === String(q.answer)).length / n;
  const chance = qs.reduce((s, q) => { let ways = 1; for (let i = 0; i < q.pick; i++) ways *= q.choices.length - i; return s + 1 / ways; }, 0) / n;
  return { n, chance, top: { share: top } };
}

// Marks judged by design (pass NW, EARMARKS A157, from pass NR's reads; Claude's design). In these banks every question offers one of
// the lesson's own right acts beside one that is not, and no right answer is ever a wrong choice anywhere in the bank, so a child who
// always taps one right answer is right whenever it is shown: the habit is the lesson itself. Each entry names its bank, the habit (only
// sameChoice, the one row this tool can judge by design), the share its row read at the tool's defaults (seeds 1 to 2,000 alone and
// 1,500 rounds of each kind, its worst group) and why, and, where its reason names one choice, that choice (best), held as every read
// group's best. A fourth bank pass NR named, p4-plan-what, reads under its limit (34.6 percent at most, in pass NW), so it has no entry;
// an entry for a bank that no longer leans is named stale when the bank is read.
// Pass NX (EARMARKS A180) adds the 42 its reader judged by design among the 55 p3- and p4- banks pass NW found leaning on this row with
// no right answer ever a wrong choice (nx/reports/a180-fable.md in the pass's scratch folder), each share measured again at the tool's
// defaults and each held by design there, its reason in the reader's words, cut to one sentence and tightened only where it said more
// than the code does. The reader's other thirteen have none: ten it judged to grow (p3-ab-by-look, p3-learn-different, p3-learn-word-do,
// p3-talk-say-back, p3-talk-why, p4-fit-enough, p3-sent-topic, p4-words-new, p4-wyn-next and p4-wyn-last), for a lesson pass, and three
// that are grade 3 Philosophy banks, not pre-K (p3-wonder, p3-listen and p3-fair), for that course's review. Thirty-four of the 42 lean
// by arithmetic alone, as their reasons say: k rows, each with its own right answer, read 0.5 + 0.5/k with two choices and 1/3 + 2/(3k)
// with three.
export const BY_DESIGN = {
  'p3-talk-listen': { habit: 'sameChoice', share: 0.752, best: 'Listen', why: 'Listen, what the lesson teaches a child to do while a friend talks, answers two of its four questions and is never a wrong choice' },
  'p4-play-plan': { habit: 'sameChoice', share: 0.605, why: 'each of its five questions offers one of the lesson\'s ways to plan and play together beside one that is not, and no right answer is ever a wrong choice' },
  'p4-plan-together': { habit: 'sameChoice', share: 0.681, why: 'each of its three questions offers one of the lesson\'s kind things to do or say together beside one that is not, and no right answer is ever a wrong choice' },
  'p3-tap-one': { habit: 'sameChoice', share: 1, best: 'dots:1', why: 'one dot (dots:1) is the lesson\'s "one", shown beside a group of two or three on its single question, and the lesson\'s other banks (p3-tap-group, p3-more) show one dot as a wrong choice, so the habit fails in the round' },
  'p3-ab-look-alike': { habit: 'sameChoice', share: 0.753, why: 'the letter asked for by name is the lesson\'s A or B beside a look-alike (H, V, P or D), told apart by the lesson\'s own words (its lines on H and P); two rows, so 75 by arithmetic, and Tap the letter A beside B is p3-tap-ab\'s job' },
  'p4-real-middle': { habit: 'sameChoice', share: 0.478, why: 'the lesson teaches three fixed groups (tiny, middle-sized, huge) and each question shows one of each, so a middle-sized animal is right whenever shown; five answers, 46.7 by arithmetic, and p4-real-biggest shows the same animals as wrong choices' },
  'p4-steps-tips': { habit: 'sameChoice', share: 0.681, why: 'each of its three questions offers one of the lesson\'s three tips (listen to all three steps, say them to yourself, ask to hear it again) beside its opposite; three rows, 66.7 by arithmetic' },
  'p3-people-group': { habit: 'sameChoice', share: 0.483, why: 'one person beside two things (book, cake, bed), the lesson\'s own people and its own named things, so tapping the person is knowing; five answers, 46.7 by arithmetic, and the lesson\'s other banks show each person as a wrong choice' },
  'p3-need-enough': { habit: 'sameChoice', share: 0.607, why: 'each of five tellings that say just what is wrong stands beside Uh oh! or I cannot find it., the lesson\'s own two that do not, one of them longer than three of the answers; five answers, 60 by arithmetic' },
  'p3-need-who': { habit: 'sameChoice', share: 0.564, why: 'a grown-up the child knows (grandma, grandpa, teacher) beside the baby and the teddy bear, the lesson\'s own line on who can help and who cannot; three answers, 55.6 by arithmetic' },
  'p3-vfit-kind': { habit: 'sameChoice', share: 0.738, why: 'a kind voice, or the kind words Are you okay?, beside the big outside voice or Over here!, for asking a turn or for a sad friend, as the lesson\'s lines say; the big outside voice is right in p3-vfit-voice, so avoiding it fails in the round' },
  'p3-vfit-clear': { habit: 'sameChoice', share: 0.673, why: 'each of its three questions offers one of the lesson\'s ways to be understood (turn toward your friend, slowly and clearly) beside its opposite; three rows, 66.7 by arithmetic' },
  'p3-sent-more': { habit: 'sameChoice', share: 0.581, why: 'each row sets the sentence with its telling word beside the same sentence without it, the lesson\'s own pair (I see a dog, I see a big dog); eight rows, 56.3 by arithmetic, and the answer is the longer choice on every seed, which is what one more word is' },
  'p3-sent-word': { habit: 'sameChoice', share: 0.674, why: 'the word that tells more (big, little, red, yellow, brown) beside the name of the thing itself, which the question has just said, so the echo pulls toward the wrong one; five answers on seven rows' },
  'p3-more-one': { habit: 'sameChoice', share: 0.582, why: 'each row sets one cat beside one cats, the form we say and the form the lesson says we do not, for the thing drawn; seven rows, 57.1 by arithmetic' },
  'p4-sent-whole': { habit: 'sameChoice', share: 0.569, why: 'each row sets a whole sentence beside a part the lesson shows is not one, neither told by length (the longer is right on 51 percent); eight rows, 56.3 by arithmetic' },
  'p4-form-past': { habit: 'sameChoice', share: 0.575, why: 'each row sets the form we say for yesterday beside the form the lesson says we do not (played and play, ran and runned, went and goed), the same sentence; eight rows, 56.3 by arithmetic' },
  'p4-form-pronoun': { habit: 'sameChoice', share: 0.569, why: 'each row sets she, he, they or I beside her, him, them or me in the same sentence, the lesson\'s own pairs; eight rows, 56.3 by arithmetic' },
  'p4-form-agree': { habit: 'sameChoice', share: 0.635, why: 'each row sets the verb that fits one or two beside the one that does not for the picture drawn, and each form (runs and run, rolls and roll) is right on one row and wrong on another, so no form can be learned; four rows, 62.5 by arithmetic' },
  'p4-form-when': { habit: 'sameChoice', share: 0.57, why: 'each row sets what already happened beside the same sentence said for today, the lesson\'s own pairs; eight rows, 56.3 by arithmetic' },
  'p4-they-be': { habit: 'sameChoice', share: 0.607, why: 'each row sets am, is or are that fits beside the one the lesson says we do not say, with is and are each right and wrong across rows; five rows, 60 by arithmetic' },
  'p3-words-more': { habit: 'sameChoice', share: 0.593, why: 'each row sets a sentence beside the same one with a word or two fewer, which is all the lesson claims (when we add a word, a sentence has more words); six rows, 58.3 by arithmetic, and the longer to hear is right on every seed, as the lesson\'s claim makes it (pre-K 4 teaches the trap)' },
  'p3-part-first': { habit: 'sameChoice', share: 0.635, why: 'each row sets the word\'s first part beside its own end (duh and og), the lesson\'s own two parts; four rows, 62.5 by arithmetic, and og is the wrong choice on three questions in four, since frog, dog and log share it' },
  'p4-vfs-part': { habit: 'sameChoice', share: 0.755, why: 'each row sets the one very first sound beside the word\'s own two-sound first part (sss and sss-puh), the very contrast the lesson teaches; two answers, 75 by arithmetic, and p4-vfs-sound shows sss and fff as wrong choices' },
  'p3-draw-tool': { habit: 'sameChoice', share: 0.565, why: 'a crayon, a pencil or a marker beside two of a sock, a ball and a spoon, the lesson\'s own tools and its own three that are not; three answers, 55.6 by arithmetic' },
  'p4-tell-tool': { habit: 'sameChoice', share: 0.575, why: 'a crayon, a pencil or a marker beside two of a sock, a cup and a hat, the lesson\'s own tools and its own three that are not; three answers, 55.6 by arithmetic' },
  'p4-mark-start': { habit: 'sameChoice', share: 0.569, why: 'each row sets a sentence with its big first letter beside the same one with a small letter, the lesson\'s own pair; nine rows, 55.6 by arithmetic, under the limit, so it is over only by its draw' },
  'p3-print-read': { habit: 'sameChoice', share: 0.6, why: 'the words beside a picture of another thing, and words are what we read, the lesson\'s whole point; six prints, 58.3 by arithmetic, and the lesson\'s banks that ask for the picture show each print as a wrong choice' },
  'p3-space-which': { habit: 'sameChoice', share: 0.635, why: 'each row sets the writing with its spaces beside the same words bumped together, the lesson\'s own pair; four rows, 62.5 by arithmetic' },
  'p3-space-why': { habit: 'sameChoice', share: 0.765, why: 'either of the lesson\'s two reasons for a space (each word stands on its own, we can see where each word starts) beside a reason that says the opposite; two answers, 75 by arithmetic' },
  'p4-space-which': { habit: 'sameChoice', share: 0.455, why: 'the writing with a space between every word beside the same words with one space or every space missing, the lesson\'s own game; six rows, 44.4 by arithmetic' },
  'p3-look-real': { habit: 'sameChoice', share: 0.681, why: 'a real letter (M, S or B) beside a scribble or marks, the lesson\'s own contrast; three answers, 66.7 by arithmetic, and the lesson\'s other three banks show each letter as a wrong choice' },
  'p4-wyn-first': { habit: 'sameChoice', share: 0.476, why: 'the big first letter of the name shown, kept since pass NI (the lesson brief\'s item 28: the big first letter is what the lesson and IV.C.1 teach, and the other banks cannot be passed by it); five names, 46.7 by arithmetic' },
  'p4-wyn-right': { habit: 'sameChoice', share: 0.492, why: 'the name as the grown-up wrote it, which the picture shows, beside two tries with its letters mixed up, so matching it is the lesson\'s act; five names, 46.7 by arithmetic' },
  'p3-help-kind': { habit: 'sameChoice', share: 0.75, best: 'Are you okay?', why: 'each of its four questions offers one of the lesson\'s kind things to do or say beside an unkind one, and Are you okay?, the lesson\'s words for a sad friend and a sad grown-up, answers two' },
  'p3-help-grownup': { habit: 'sameChoice', share: 1, best: 'A grown-up', why: 'A grown-up, the lesson\'s one answer for every hard moment, kept by name since pass MM (SAME_KEPT in tests/logic.test.mjs, EARMARKS A31)' },
  'p3-help-ball': { habit: 'sameChoice', share: 0.755, best: 'Get a grown-up', why: 'each of its four questions offers the lesson\'s act for a fight over a ball beside grabbing, pushing, Mine! or taking the ball away, and Get a grown-up, the lesson\'s own step, answers two' },
  'p3-join-how': { habit: 'sameChoice', share: 0.604, why: 'each of its five questions offers one of the lesson\'s ways to join a game beside one that is not kind or not for the game; five rows, 60 by arithmetic' },
  'p3-join-not-now': { habit: 'sameChoice', share: 0.677, why: 'each of its three questions offers one of the lesson\'s three things to do after not now (play something else, ask again later, find another friend) beside grabbing, knocking down or pushing; three rows, 66.7 by arithmetic' },
  'p4-play-next': { habit: 'sameChoice', share: 0.673, why: 'each of its three questions offers the lesson\'s next friendly step beside a grab or go away!; three rows, 66.7 by arithmetic; the order itself is never asked, and no fair wrong choice could ask it (telling your name is never wrong)' },
  'p4-kind-words': { habit: 'sameChoice', share: 0.76, best: 'Are you okay?', why: 'each of its four questions offers one of the lesson\'s kind things to say beside an unkind one, and Are you okay? answers two' },
  'p4-help-friend': { habit: 'sameChoice', share: 0.675, why: 'each of its three questions offers one of the lesson\'s kind things to do beside laughing or walking away from a friend who needs help; three rows, 66.7 by arithmetic' },
  'p4-fix-problem': { habit: 'sameChoice', share: 0.71, best: 'Take turns choosing', why: 'each of its five questions offers one of the lesson\'s steps to fix a problem (say what it is, a fair way, a grown-up) beside one that is not, and Take turns choosing answers two' },
  'p4-play-start': { habit: 'sameChoice', share: 0.579, why: 'each of its seven questions offers one of the lesson\'s friendly ways to start beside a grab or a bossy line; seven rows, 57.1 by arithmetic' },
  'p4-play-body': { habit: 'sameChoice', share: 0.607, why: 'each of its five questions offers one of the lesson\'s ways a face and a body talk (listen, wave, a smile, take turns, nod) beside its opposite; five rows, 60 by arithmetic' },
};

// The table's own check (pass NW): every entry names a bank the logic has, the one habit the tool can judge by design, a share over 0
// and at most 1, and a reason. Returns each problem in words, and an empty list when there is none. Since pass NX a share of 1 is taken
// (Counting to three's p3-tap-one and Helping a friend's p3-help-grownup read 100.0 in every group, the habit right on every question):
// a read is never past 1, so at 1 the ceiling, the share plus the margin, holds every group, and such an entry is marked again only by a
// right answer shown as a wrong choice, a group whose best is not the choice it names, or, stale, a row under every limit.
export function checkByDesign(L, table = BY_DESIGN) {
  const problems = [];
  for (const [bank, e] of Object.entries(table)) {
    if (!Object.hasOwn(L.GENERATORS, bank)) problems.push(`BY_DESIGN names ${bank}, which is no bank`);
    if (!e || e.habit !== 'sameChoice') problems.push(`BY_DESIGN's ${bank} names the habit ${e && e.habit}, and only sameChoice can be judged by design`);
    if (!e || !(e.share > 0 && e.share <= 1)) problems.push(`BY_DESIGN's ${bank} gives the share ${e && e.share}, not one over 0 and at most 1`);
    if (!e || typeof e.why !== 'string' || !e.why.trim()) problems.push(`BY_DESIGN's ${bank} gives no reason`);
    // A best it names is a choice the bank offers in its first 40 seeds, each read without its # tag (pass NX); one that is not would
    // mark the row again on every read.
    if (e && e.best !== undefined && Object.hasOwn(L.GENERATORS, bank) && !(typeof e.best === 'string' && Array.from({ length: 40 }, (_, i) => L.generateQuestion(bank, i + 1)).some((q) => q && Array.isArray(q.choices) && q.choices.some((c) => withoutTag(c) === withoutTag(e.best))))) problems.push(`BY_DESIGN's ${bank} names the best ${e.best}, which is no choice of the bank at seeds 1 to 40`);
  }
  return problems;
}

// The bank's right answers shown as wrong choices, group by group (pass NW, round one's read): in each group, read or not, the questions
// that show as a wrong choice a value that is the answer to some question of the bank, in any group. A by-design row stands on none.
// Since pass NX each choice and each answer is read without its # tag (withoutTag), so a picture that is one question's answer and
// another's alike pair is a slip (Learning words' p3-learn-different met the rule only by its tags: its stars tagged #0 and #1 read
// as other choices than the star that was the answer). Only the question's own answer button, by its whole string, is not counted, so a
// twin of a question's own answer shown as a wrong button would be counted too (no bank deals one in pass NX).
export function slipsOf(groups) {
  const answers = new Set(groups.flatMap((g) => g.qs.filter(isTap).map((q) => withoutTag(q.answer))));
  return groups.map((g) => ({ name: g.name, n: g.qs.filter(isTap).filter((q) => q.choices.some((c) => answers.has(withoutTag(c)) && !same(c, q.answer))).length }));
}

const HABITS = [['first', 'always the first button'], ['sameChoice', 'always the same choice'], ['oneKind', 'always a picture of one kind'], ['storyOnly', 'heard only the story'], ['questionOnly', 'heard only the question'], ['pictureOnly', 'saw only the picture']];
const pc = (v) => (v === undefined || v === null ? '-' : (Math.round(v * 1000) / 10).toFixed(1));
// A by-design entry's share or ceiling as a reader reads it, and what is printed where an entry gives none (pass NW, round two's read).
const shareOf = (v) => (Number.isFinite(v) ? pc(v) : 'no share given');

// Reads one bank over its groups and returns the table's lines and how many marks it found.
// design: the bank's BY_DESIGN entry, or null; blindRead hands it in from its table (BY_DESIGN unless a table is given).
export function readBank(bank, groups, label = bank, design = null) {
  const lines = []; let marks = 0; let byDesign = 0; let stale = 0;
  const taps = groups.map((g) => ({ name: g.name, qs: g.qs.filter(isTap) })); const orders = groups.map((g) => ({ name: g.name, qs: g.qs.filter(isOrder) }));
  const asked = groups.reduce((s, g) => s + g.qs.length, 0);
  const tapAll = taps.reduce((s, g) => s + g.qs.length, 0); const ordAll = orders.reduce((s, g) => s + g.qs.length, 0);
  if (!asked) return { lines: [`bank ${label}: no questions`], marks: 0, byDesign: 0, stale: 0 };
  if (!tapAll && !ordAll) return { lines: [`bank ${label}: no choices to tap (${groups[0].qs[0] && groups[0].qs[0].type}); skipped`], marks: 0, byDesign: 0, stale: 0 };
  const slips = design ? slipsOf(groups) : [];
  const reads = taps.map((g) => (g.qs.length >= 30 ? { name: g.name, ...readTaps(g.qs) } : { name: g.name, n: g.qs.length, skipped: true }));
  const used = reads.filter((r) => !r.skipped);
  if (used.length) {
    // Each group is marked against its own chance and its own count (a read of 150 rounds is noisier than one of 2,000 seeds, and a
    // group's chance can differ, so one margin taken from the smallest group would mark the big groups too late, or too early).
    const limit = (r) => r.chance + marginFor(r.chance, r.n);
    lines.push(`bank ${label}: ${used[0].n} questions alone, chance ${pc(used[0].chance)} percent; marked above, by group: ${used.map((r) => `${r.name} ${pc(limit(r))} (${r.n})`).join(', ')}`);
    const head = ['habit'.padEnd(32), ...reads.map((r) => r.name.padStart(8)), 'worst'.padStart(8)]; lines.push('  ' + head.join(' '));
    for (const [key, text] of HABITS) {
      if (!used.some((r) => r[key])) continue;
      const cells = reads.map((r) => (r.skipped || !r[key] ? undefined : r[key].share)); const worst = Math.max(...cells.filter((v) => v !== undefined));
      const at = reads.findIndex((r, i) => cells[i] === worst); const named = reads[at][key].name ? ` (best: ${reads[at][key].name})` : '';
      // A story or picture row is marked above the same margins; by design it may be high, and the header says so. A cell over its own
      // group's limit is starred, and the row is marked.
      const over = reads.map((r, i) => cells[i] !== undefined && cells[i] > limit(r));
      // A row BY_DESIGN names for this bank (pass NW, EARMARKS A157) is held "by design" only on the one habit an entry can name, and only
      // while no group, read or not, shows one of the bank's right answers as a wrong choice, every group read is at most the share plus
      // the tool's margin at that group's count (the share standing in for chance), and, where the entry names the choice it was judged
      // on, that choice is every read group's best; each condition is written so a missing or broken value marks the row again (round
      // one's read). A row over no group's limit leaves the entry stale. Other rows are read as always.
      const judged = !!design && key === 'sameChoice' && design.habit === key;
      const again = !judged ? [] : [
        ...slips.filter((sl) => !(sl.n === 0)).map((sl) => `${sl.name} shows a right answer as a wrong choice on ${sl.n} questions`),
        ...reads.map((r, i) => { if (cells[i] === undefined) return ''; const cap = design.share + marginFor(design.share, r.n); return cells[i] <= cap ? '' : `${r.name} reads ${pc(cells[i])}, past ${shareOf(cap)}`; }).filter(Boolean),
        // The named choice is compared without its # tag on either side (pass NX), and only a best written as words can match, so a
        // broken best still marks the row again.
        ...(design.best === undefined ? [] : reads.filter((r, i) => cells[i] !== undefined && !(typeof design.best === 'string' && withoutTag(r[key].name) === withoutTag(design.best))).map((r) => `${r.name}'s best choice is ${r[key].name}, where the entry was judged on ${design.best}`)),
      ];
      const held = judged && over.some(Boolean) && !again.length;
      const mark = over.some(Boolean) && !held ? ' <<' : held ? ' by design' : ''; if (mark === ' <<') marks++; if (held) byDesign++;
      lines.push('  ' + [text.padEnd(32), ...cells.map((v, i) => (pc(v) + (over[i] ? '*' : '')).padStart(8)), pc(worst).padStart(8)].join(' ') + mark + named);
      if (held) lines.push(`  (by design, BY_DESIGN: ${design.why}; read at ${pc(design.share)}${design.best === undefined ? '' : ', judged on ' + design.best}; marked again past that by the margin, if one of the bank's right answers is ever a wrong choice${design.best === undefined ? '' : ', or if another choice reads best'})`);
      else if (judged && over.some(Boolean)) lines.push(`  (BY_DESIGN holds this row by design at ${shareOf(design.share)}, and it is marked again: ${again.join('; ')})`);
      else if (judged) { stale++; lines.push('  (BY_DESIGN names this row, and no group is over its limit now: the entry is stale and can come out)'); }
    }
    if (used.some((r) => r.yesShare)) { const cells = reads.map((r) => (r.skipped || !r.yesShare ? undefined : r.yesShare.share)); const lo = Math.min(...cells.filter((v) => v !== undefined)); const hi = Math.max(...cells.filter((v) => v !== undefined));
      const mark = lo < 0.4 || hi > 0.6 ? ' <<' : ''; if (mark) marks++; lines.push('  ' + ['Yes share of the answers'.padEnd(32), ...cells.map((v) => pc(v).padStart(8)), (pc(lo) + '-' + pc(hi)).padStart(8)].join(' ') + mark + ' (marked outside 40 to 60)'); }
    if (reads.some((r) => r.skipped)) lines.push('  (a group of fewer than 30 questions is not read: ' + reads.filter((r) => r.skipped).map((r) => `${r.name} ${r.n}`).join(', ') + ')');
  }
  if (ordAll) {
    const reads2 = orders.map((g) => (g.qs.length >= 30 ? { name: g.name, ...readOrders(g.qs) } : null));
    const usedO = reads2.filter(Boolean);
    if (usedO.length) { lines.push(`bank ${label} (tap in order): chance ${pc(usedO[0].chance)} percent, marked at 20.0 percent`);
      const worst = Math.max(...usedO.map((r) => r.top.share)); const mark = worst >= 0.2 ? ' <<' : ''; if (mark) marks++;
      lines.push('  ' + ['tapped from the top left'.padEnd(32), ...reads2.map((r) => (r ? pc(r.top.share) : '-').padStart(8)), pc(worst).padStart(8)].join(' ') + mark); }
  }
  return { lines, marks, byDesign, stale };
}

// The rounds buildAttempt deals for a module, as the rules test's blind blocks deal them (pass NM and NP): first rounds, later rounds
// that avoid the last two, triple doses, and Quick Reviews; returns, for each group, the rounds' questions.
export function roundsOf(L, moduleId, n) {
  const out = { first: [], later: [], dose: [], review: [] }; let p1 = [], p2 = [];
  for (let s = 1; s <= n; s++) {
    out.first.push(L.buildAttempt(moduleId, s, []).core);
    out.dose.push(L.buildAttempt(moduleId, s + 90000, [], { dose: 3, avoid: [...p1, ...p2] }).core);
    const a = L.buildAttempt(moduleId, s, [], { avoid: [...p1, ...p2] }); out.later.push(a.core); p2 = p1; p1 = a.core.map((q) => q.prompt);
    const lr = L.buildLightReview([], s, { moduleId, stage: 'first', missedKinds: [] }); if (lr) out.review.push(lr.core);
  }
  return out;
}

// Reads the named banks or modules.
export async function blindRead(L, ids, { seeds = 2000, rounds = false, roundsN = 1500, table = BY_DESIGN } = {}) {
  const out = [...checkByDesign(L, table)]; const unknown = []; let banks = 0; let marks = 0; let byDesign = 0; let stale = 0; const cache = new Map();
  for (const id of ids) {
    const mod = L.getModule && L.getModule(id);
    const list = L.GENERATORS[id] ? [[id, null]] : mod ? mod.generators.map((g) => [g, mod.id]) : null;
    if (!list) { out.push(`unknown bank or module id: ${id}`); unknown.push(id); continue; }
    for (const [bank, via] of list) {
      const groups = [{ name: 'alone', qs: Array.from({ length: seeds }, (_, i) => L.generateQuestion(bank, i + 1)) }];
      if (rounds) {
        const homes = via ? [via] : L.COURSES.flatMap((c) => c.modules).filter((m) => (m.generators || []).includes(bank)).map((m) => m.id);
        for (const home of homes.slice(0, 1)) { if (!cache.has(home)) cache.set(home, roundsOf(L, home, roundsN)); const R = cache.get(home);
          for (const k of ['first', 'later', 'dose', 'review']) groups.push({ name: k, qs: R[k].flatMap((r) => r.filter((q) => q.genId === bank)) }); }
      }
      const r = readBank(bank, groups, via ? `${bank} (module ${via})` : bank, Object.hasOwn(table, bank) ? table[bank] : null); banks++; marks += r.marks; byDesign += r.byDesign; stale += r.stale; out.push(...r.lines, '');
    }
  }
  out.push(`${banks} banks read, ${marks} marked` + (byDesign ? `, ${byDesign} by design (BY_DESIGN)` : '') + (stale ? `, ${stale} stale by-design ${stale === 1 ? 'entry' : 'entries'}` : ''));
  return { lines: out, banks, marks, byDesign, stale, unknown };
}

// The made banks the self-test reads (a small seeded random, so the self-test gives the same numbers every run).
function made(kind, n = 2000) {
  let a = 12345; const rnd = () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const POOL = ['pic:cat', 'pic:dog', 'icon:sun', 'icon:rain', 'face:happy', 'face:sad', 'Yes'].slice(0, 6);
  return Array.from({ length: n }, (_, i) => {
    const pickTwo = () => { const x = POOL[Math.floor(rnd() * POOL.length)]; let y = x; while (y === x) y = POOL[Math.floor(rnd() * POOL.length)]; return [x, y]; };
    const [x, y] = pickTwo(); const answer = rnd() < 0.5 ? x : y; const other = answer === x ? y : x;
    const shown = rnd() < 0.5 ? [answer, other] : [other, answer];
    if (kind === 'first') return { type: 'choice', prompt: 'Which one?', story: null, choices: [answer, other], answer };
    if (kind === 'fair') return { type: 'choice', prompt: 'Which one?', story: null, choices: shown, answer };
    if (kind === 'story') return { type: 'choice', prompt: 'Which one?', story: `Listen. The ${nameOf(answer)} was here.`, choices: shown, answer };
    // 'prompt': the prompt itself fixes the answer (each prompt always has the same answer).
    const fixed = POOL[i % POOL.length]; const other2 = POOL[(i + 1) % POOL.length]; const sh = rnd() < 0.5 ? [fixed, other2] : [other2, fixed];
    return { type: 'choice', prompt: `Tap the ${fixed}.`, story: 'Listen.', choices: sh, answer: fixed };
  });
}

// A made bank shaped like Talking with a friend's (pass NW): one question in every (half of them by default) offers Listen beside a wrong
// act, Listen the answer on each of them or, with wrongEvery, a wrong answer on every wrongEvery-th showing; the others offer one of ten
// other right acts beside its own wrong one, so no other choice leans.
function madeListen(n = 2000, wrongEvery = 0, every = 2) {
  let a = 777; const rnd = () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  return Array.from({ length: n }, (_, i) => {
    if (i % every === 0) { const answer = wrongEvery && (i / every) % wrongEvery === 0 ? 'Shout' : 'Listen'; return { type: 'choice', prompt: 'Your friend talks. What can you do?', story: null, choices: rnd() < 0.5 ? ['Listen', 'Shout'] : ['Shout', 'Listen'], answer }; }
    const k = Math.floor(rnd() * 10); return { type: 'choice', prompt: `Question ${k}`, story: null, choices: rnd() < 0.5 ? [`Right ${k}`, `Wrong ${k}`] : [`Wrong ${k}`, `Right ${k}`], answer: `Right ${k}` };
  });
}

async function selfTest() {
  let passed = 0, failed = 0; const ok = (name, cond, info) => { if (cond) { passed++; console.log('PASS - ' + name); } else { failed++; console.log('FAIL - ' + name + (info !== undefined ? '  ' + JSON.stringify(info).slice(0, 600) : '')); } };
  // 1. A bank whose answer is always its first choice reads 100 percent for the first button, and is marked.
  const first = readTaps(made('first')); const rb = readBank('made-first', [{ name: 'alone', qs: made('first') }]);
  ok('a made bank whose answer is always its first choice reads 100 percent for the first button and is marked', first.first.share === 1 && rb.marks >= 1 && rb.lines.some((l) => /always the first button\s+100\.0.*<</.test(l)), rb.lines);
  // 2. A fair made bank reads near chance on every habit and is not marked.
  const fair = readTaps(made('fair')); const rf = readBank('made-fair', [{ name: 'alone', qs: made('fair') }]);
  const near = [fair.first.share, fair.sameChoice.share, fair.oneKind.share, fair.questionOnly ? fair.questionOnly.share : fair.chance].every((v) => Math.abs(v - fair.chance) < 0.05);
  ok(`a fair made bank reads near chance (${pc(fair.chance)}) on the first button (${pc(fair.first.share)}), the same choice (${pc(fair.sameChoice.share)}) and one kind (${pc(fair.oneKind.share)}), and is not marked`, near && rf.marks === 0, { fair, lines: rf.lines });
  // 2b. Each group is marked against its own count: a 2,000-question group at 60 percent on the first button is over its own limit (about
  // 56), though a 40-question group beside it, whose limit is about 74, would hide it under one margin taken from the smallest group.
  const lean = made('first', 2000).map((q, i) => (i % 5 < 3 ? q : { ...q, choices: [q.choices[1], q.choices[0]] })); const tiny = made('fair', 40);
  const rl = readBank('made-lean', [{ name: 'alone', qs: lean }, { name: 'tiny', qs: tiny }]);
  const leanFirst = readTaps(lean).first.share; const shared = marginFor(0.5, 40); const own = marginFor(0.5, 2000);
  ok(`each group is marked against its own count: a bank reading ${pc(leanFirst)} on the first button in 2,000 questions is marked (its limit ${pc(0.5 + own)}), though one margin from a group of 40 (${pc(0.5 + shared)}) would pass it`, leanFirst > 0.5 + own && leanFirst < 0.5 + shared && rl.marks >= 1 && rl.lines.some((l) => /always the first button\s+\d+\.\d\*.*<</.test(l)) && /alone 5[0-9]\.\d \(2000\), tiny 7\d\.\d \(40\)/.test(rl.lines[0]), rl.lines);
  // 3. A story that names its answer is caught by the story only row; a prompt that fixes the answer by the question only row.
  const st = readTaps(made('story')); const rs = readBank('made-story', [{ name: 'alone', qs: made('story') }]);
  ok(`a made story that names its answer reads ${pc(st.storyOnly.share)} for a child who heard only the story, and is marked`, st.storyOnly.share > 0.95 && rs.lines.some((l) => /heard only the story.*<</.test(l)), rs.lines);
  const pr = readTaps(made('prompt')); const rp = readBank('made-prompt', [{ name: 'alone', qs: made('prompt') }]);
  ok(`a made prompt that fixes its answer reads ${pc(pr.questionOnly.share)} for a child who heard only the question, and is marked`, pr.questionOnly.share > 0.95 && rp.lines.some((l) => /heard only the question.*<</.test(l)), rp.lines);
  // 4. A made order bank tapped from the top left reads its chance, and a bank whose order is always the top left is marked.
  const ord = (top) => Array.from({ length: 400 }, (_, i) => { const items = ['icon:a', 'icon:b', 'icon:c', 'icon:d']; const ch = top ? items : [...items.slice(i % 4), ...items.slice(0, i % 4)]; return { type: 'order', pick: 2, prompt: 'Order', choices: ch, answer: top ? ch.slice(0, 2).join(' | ') : ch.slice(2, 4).join(' | '), story: null }; });
  const ro = readOrders(ord(true)); const rt = readBank('made-order-top', [{ name: 'alone', qs: ord(true) }]); const rn = readBank('made-order-fair', [{ name: 'alone', qs: ord(false) }]);
  ok('an order bank whose answer is the top left reads 100 percent and is marked; one that is not reads 0 and is not', ro.top.share === 1 && Math.abs(ro.chance - 1 / 12) < 1e-9 && rt.marks === 1 && rn.marks === 0, { rt: rt.lines, rn: rn.lines });
  // 5. A real pre-K bank runs, alone and in rounds, and reads near its chance on the first button.
  const L = await import(new URL('../src/logic.mjs', import.meta.url).href);
  const real = await blindRead(L, ['p3-next-guess'], { seeds: 600, rounds: true, roundsN: 150 });
  const text = real.lines.join('\n'); const row = /always the first button\s+([\d.]+)/.exec(text);
  ok(`one real pre-K bank (p3-next-guess, 600 seeds, 150 rounds of each kind) is read, alone and in rounds, and its first button is near chance (${row ? row[1] : '?'})`, real.banks === 1 && /alone\s+first\s+later\s+dose\s+review/.test(text) && row && Math.abs(Number(row[1]) - 50) < 8, text);
  console.log(real.lines.map((l) => '  ' + l).join('\n'));
  // 6. A module id reads each of its banks; an unknown id is said.
  const mod = await blindRead(L, ['what-happens-next', 'no-such-bank'], { seeds: 60 });
  ok('a module id reads every bank of the module, and an unknown id is named', mod.banks === L.getModule('what-happens-next').generators.length && mod.lines.some((l) => l.startsWith('unknown bank or module id: no-such-bank')), mod.lines.slice(-3));
  const cli = spawnSync(process.execPath, [fileURLToPath(import.meta.url), 'what-happens-next-typo', '--seeds', '60'], { encoding: 'utf8' }); const good = spawnSync(process.execPath, [fileURLToPath(import.meta.url), 'p3-next-check', '--seeds', '60'], { encoding: 'utf8' });
  ok('an unknown id is named and the command exits 2; a known bank exits 0', mod.unknown.length === 1 && cli.status === 2 && /unknown bank or module id: what-happens-next-typo/.test(cli.stdout) && good.status === 0, { status: cli.status, out: cli.stdout, good: good.status });
  // 7. The by-design table (pass NW, EARMARKS A157): every entry a bank the logic has, with the habit, share and reason the tool needs; a
  // planted table naming a bank that is not one, a habit the tool cannot judge, a share just over 1 (since pass NX, when a share of 1
  // is taken) and a blank reason names each problem.
  const probs = checkByDesign(L); const bad = checkByDesign(L, { 'no-such-bank': { habit: 'sameChoice', share: 0.6, why: 'made' }, 'p3-talk-listen': { habit: 'storyOnly', share: 1.001, why: ' ' }, 'p4-play-plan': { habit: 'sameChoice', share: 0, why: 5 }, 'p4-plan-together': { habit: 'sameChoice', share: 0.68, best: 'Nod', why: 'made' } });
  ok(`the by-design table names ${Object.keys(BY_DESIGN).length} banks the logic has, each with the habit, share and reason the tool needs; a planted bad table is named for each of its seven problems`, probs.length === 0 && Object.keys(BY_DESIGN).length >= 1 && bad.length === 7 && bad.some((p) => /p4-plan-together names the best Nod, which is no choice of the bank/.test(p)) && bad.some((p) => /no-such-bank, which is no bank/.test(p)) && bad.some((p) => /habit storyOnly/.test(p)) && bad.some((p) => /p3-talk-listen gives the share 1\.001, not one over 0 and at most 1$/.test(p)) && bad.some((p) => /p3-talk-listen gives no reason/.test(p)) && bad.some((p) => /p4-play-plan gives the share 0, not one over 0 and at most 1$/.test(p)) && bad.some((p) => /p4-play-plan gives no reason/.test(p)), { probs, bad });
  // 8. The banks it names read by design at the tool's defaults: since pass NX, every bank a reader judged by design has its entry and
  // every entry is a bank a reader judged so (pass NW's three and pass NX's 42, from its reader's judgment of A180's 55; the ten it judged
  // to grow and the three grade 3 Philosophy banks among those 55 have none), each reads by design at seeds 1 to 2,000 alone, none stale
  // and none marked again, and a sample reads by design in rounds too, at 1,500 rounds of each kind: pass NW's three and Helping a
  // friend's three, four of them naming their best and p3-help-grownup at 100.0 (Counting to three's rounds, about 8 seconds of the
  // self-test on a busy machine, are left to the read alone, where p3-tap-one is held at 1 as well). A whole read of the 45 in rounds took
  // 411 to 860 seconds in pass NX, on its shared two-CPU machine by the other agents' runs beside it, many times step 3f's limit of 60
  // seconds, so it is a reader's run (node tools/blind-read.mjs <the table's banks> --rounds), not the self-test's.
  // Each bank's own block of lines, from its first line to the blank line after it, so one bank's row is never read in the next one's.
  const blockIn = (r, b) => { const i = r.lines.findIndex((l) => l.startsWith(`bank ${b}:`)); const j = r.lines.indexOf('', i); return i < 0 ? [] : r.lines.slice(i, j < 0 ? undefined : j); };
  const JUDGED = ['p3-talk-listen', 'p4-play-plan', 'p4-plan-together', 'p3-tap-one', 'p3-ab-look-alike', 'p4-real-middle', 'p4-steps-tips', 'p3-people-group', 'p3-need-enough', 'p3-need-who', 'p3-vfit-kind', 'p3-vfit-clear', 'p3-sent-more', 'p3-sent-word', 'p3-more-one', 'p4-sent-whole', 'p4-form-past', 'p4-form-pronoun', 'p4-form-agree', 'p4-form-when', 'p4-they-be', 'p3-words-more', 'p3-part-first', 'p4-vfs-part', 'p3-draw-tool', 'p4-tell-tool', 'p4-mark-start', 'p3-print-read', 'p3-space-which', 'p3-space-why', 'p4-space-which', 'p3-look-real', 'p4-wyn-first', 'p4-wyn-right', 'p3-help-kind', 'p3-help-grownup', 'p3-help-ball', 'p3-join-how', 'p3-join-not-now', 'p4-play-next', 'p4-kind-words', 'p4-help-friend', 'p4-fix-problem', 'p4-play-start', 'p4-play-body'];
  const entered = Object.keys(BY_DESIGN); const alone = await blindRead(L, JUDGED);
  ok(`the ${JUDGED.length} banks readers judged by design each have an entry, every entry is one of them, and each reads by design at seeds 1 to 2,000 alone, none stale and none marked again (${alone.lines[alone.lines.length - 1]})`, JUDGED.every((b) => entered.includes(b)) && entered.every((b) => JUDGED.includes(b)) && alone.banks === JUDGED.length && alone.byDesign === JUDGED.length && alone.stale === 0 && JUDGED.every((b) => blockIn(alone, b).some((l) => /always the same choice.* by design/.test(l))) && !alone.lines.some((l) => /and it is marked again:/.test(l)), alone.lines.filter((l) => /^bank |always the same choice|BY_DESIGN/.test(l)));
  const SAMPLE = ['p3-talk-listen', 'p4-play-plan', 'p4-plan-together', 'p3-help-kind', 'p3-help-grownup', 'p3-help-ball'];
  const named = await blindRead(L, SAMPLE, { rounds: true });
  ok(`a sample of ${SAMPLE.length} entries reads by design at the tool's defaults in rounds as well, with no mark (${named.lines[named.lines.length - 1]})`, named.marks === 0 && named.byDesign === SAMPLE.length && named.stale === 0 && SAMPLE.every((b) => blockIn(named, b).some((l) => /always the same choice.* by design/.test(l))) && SAMPLE.every((b) => blockIn(named, b).some((l) => /^ {2}habit\s+alone\s+first\s+later\s+dose\s+review\s+worst$/.test(l))) && /, \d+ by design \(BY_DESIGN\)$/.test(named.lines[named.lines.length - 1]), named.lines);
  // 9. Made banks against made entries: a choice right whenever it is shown reads by design at its share, with no other row named by the
  // entry; past the share's margin it is marked again; shown once in ten as a wrong choice it is marked, though under the share; an entry
  // over a fair bank is stale; and a bank that leans on another row keeps that row's mark.
  const entry = (share) => ({ habit: 'sameChoice', share, why: 'made' }); const listen = madeListen(); const leanRead = readTaps(listen).sameChoice;
  const held = readBank('made-listen', [{ name: 'alone', qs: listen }], 'made-listen', entry(0.75));
  ok(`a made bank whose Listen is right whenever it is shown (${pc(leanRead.share)}, best: ${leanRead.name}) reads by design at its share, and no other row is named by the entry`, held.marks === 0 && held.byDesign === 1 && held.stale === 0 && held.lines.filter((l) => /BY_DESIGN/.test(l)).length === 1 && held.lines.some((l) => /always the same choice\s+\d+\.\d\*\s+\d+\.\d by design \(best: Listen\)/.test(l)), held.lines);
  const past = readBank('made-listen', [{ name: 'alone', qs: listen }], 'made-listen', entry(0.6));
  ok('the same bank held at a share of 60.0 is marked again, its read past the share by the margin', past.marks === 1 && past.byDesign === 0 && past.lines.some((l) => /always the same choice.*<</.test(l)) && past.lines.some((l) => /marked again: alone reads 7\d\.\d, past 66\.0/.test(l)), past.lines);
  const slip = madeListen(2000, 10); const slipRead = readTaps(slip).sameChoice; const slipN = slipsOf([{ name: 'alone', qs: slip }])[0].n; const wrongOnce = readBank('made-listen-slip', [{ name: 'alone', qs: slip }], 'made-listen-slip', entry(0.75));
  ok(`a made bank whose Listen is the wrong choice on one showing in ten, Shout right there and wrong beside every other Listen, shows a right answer as a wrong choice on ${slipN} questions, reads ${pc(slipRead.share)}, under its share's limit, and is marked, not held by design`, slipRead.name === 'Listen' && slipN === 1000 && slipRead.share < 0.75 && wrongOnce.marks === 1 && wrongOnce.byDesign === 0 && wrongOnce.lines.some((l) => /marked again: alone shows a right answer as a wrong choice on 1000 questions/.test(l)), wrongOnce.lines);
  const fairEntry = readBank('made-fair', [{ name: 'alone', qs: made('fair') }], 'made-fair', entry(0.75));
  ok('an entry over a made fair bank is named stale, with no mark and nothing by design', fairEntry.stale === 1 && fairEntry.marks === 0 && fairEntry.byDesign === 0 && fairEntry.lines.some((l) => /the entry is stale/.test(l)), fairEntry.lines);
  // A choice right every time it is shown, but shown on one question in twenty, leans under its limit: its entry is stale, never held.
  const rare = madeListen(2000, 0, 20); const rareRead = readTaps(rare).sameChoice; const rareEntry = readBank('made-listen-rare', [{ name: 'alone', qs: rare }], 'made-listen-rare', entry(0.75));
  ok(`an entry over a made bank whose right answers are never wrong choices but which leans under its limit (${pc(rareRead.share)}, best: ${rareRead.name}) is stale, never held by design`, slipsOf([{ name: 'alone', qs: rare }])[0].n === 0 && rareRead.share < 0.56 && rareEntry.stale === 1 && rareEntry.byDesign === 0 && rareEntry.marks === 0, rareEntry.lines);
  const firstEntry = readBank('made-first', [{ name: 'alone', qs: made('first') }], 'made-first', entry(0.75));
  ok('a made bank whose answer is always its first choice keeps the first button\'s mark under an entry for the same choice', firstEntry.marks >= 1 && firstEntry.lines.some((l) => /always the first button\s+100\.0.*<</.test(l)) && firstEntry.byDesign === 0, firstEntry.lines);
  // 10. Round one's read of pass NW: a right answer shown as a wrong choice anywhere breaks the rule, whichever choice reads best. Play
  // with a plan's five rows, each with its own right act, read by design; a sixth row showing Make a plan as the wrong choice marks it.
  const PLAN = [['Make a plan', 'Grab all the blocks'], ['What you will make', 'Who gets all the blocks'], ['Say it, and ask', 'Knock the house down'], ['Do your part', 'Do every part yourself'], ['Can you pass me a block?', 'Give me that!']];
  const planRows = (sixth) => Array.from({ length: 2000 }, (_, i) => { const k = i % (sixth ? 6 : 5); const [a, w] = k === 5 ? ['Say what you see', 'Make a plan'] : PLAN[k]; return { type: 'choice', prompt: `Plan ${k}`, story: null, choices: i % 2 ? [a, w] : [w, a], answer: a }; });
  const planOk = readBank('made-plan', [{ name: 'alone', qs: planRows(false) }], 'made-plan', entry(0.6)); const planSlip = readBank('made-plan-slip', [{ name: 'alone', qs: planRows(true) }], 'made-plan-slip', entry(0.6)); const planBest = readTaps(planRows(true)).sameChoice;
  ok(`five rows each with its own right act read by design; a sixth row showing Make a plan as a wrong choice is marked again though its best choice (${planBest.name}) is never wrong`, planOk.byDesign === 1 && planOk.marks === 0 && planBest.name !== 'Make a plan' && planSlip.marks === 1 && planSlip.byDesign === 0 && planSlip.lines.some((l) => /alone shows a right answer as a wrong choice on 333 questions/.test(l)), { planOk: planOk.lines, planSlip: planSlip.lines });
  // 11. Every group read by the rule: a clean read in three groups, the third under 30 questions and so unread, is held; a right answer
  // shown as a wrong choice only in a later group, one under its own limit, marks the row again.
  const threeHeld = readBank('made-three', [{ name: 'alone', qs: madeListen() }, { name: 'first', qs: madeListen(400) }, { name: 'small', qs: madeListen(20) }], 'made-three', entry(0.75));
  const laterQs = Array.from({ length: 400 }, (_, i) => (i % 20 === 0 ? { type: 'choice', prompt: 'Your friend talks. What can you do?', story: null, choices: i % 40 ? ['Listen', 'Wait your turn'] : ['Wait your turn', 'Listen'], answer: 'Wait your turn' } : { type: 'choice', prompt: `Question ${i % 10}`, story: null, choices: i % 2 ? [`Right ${i % 10}`, `Wrong ${i % 10}`] : [`Wrong ${i % 10}`, `Right ${i % 10}`], answer: `Right ${i % 10}` }));
  const laterRead = readTaps(laterQs); const laterSlip = readBank('made-later', [{ name: 'alone', qs: madeListen() }, { name: 'later', qs: laterQs }], 'made-later', entry(0.75));
  ok(`a clean read in three groups, one of 20 questions left unread, is held; a right answer shown as a wrong choice only in a later group reading ${pc(laterRead.sameChoice.share)}, under its own limit, marks the row again`, threeHeld.byDesign === 1 && threeHeld.marks === 0 && laterRead.sameChoice.share < laterRead.chance + marginFor(laterRead.chance, 400) && laterSlip.marks === 1 && laterSlip.lines.some((l) => /again: later shows a right answer as a wrong choice on 20 questions\)$/.test(l)), { threeHeld: threeHeld.lines, laterSlip: laterSlip.lines });
  // 12. A small group's ceiling is the share plus the margin at the group's own count, the share standing in for chance: in 40 questions
  // an entry at 75.0 holds a read of 90.0 (a flat 6 points would mark it) and marks one of 97.5 (chance's margin would hold it).
  const madeShown = (n, shown) => Array.from({ length: n }, (_, i) => (i < shown ? { type: 'choice', prompt: 'Your friend talks. What can you do?', story: null, choices: i % 2 ? ['Listen', 'Shout'] : ['Shout', 'Listen'], answer: 'Listen' } : { type: 'choice', prompt: `Question ${i}`, story: null, choices: i % 2 ? [`Right ${i}`, `Wrong ${i}`] : [`Wrong ${i}`, `Right ${i}`], answer: `Right ${i}` }));
  const small90 = readBank('made-small-90', [{ name: 'alone', qs: madeShown(40, 32) }], 'made-small-90', entry(0.75)); const small975 = readBank('made-small-975', [{ name: 'alone', qs: madeShown(40, 38) }], 'made-small-975', entry(0.75));
  ok(`in a group of 40 questions an entry at 75.0 holds a read of 90.0 and marks one of 97.5, its ceiling ${pc(0.75 + marginFor(0.75, 40))} the share plus the margin at the group's own count (a flat 6 points, 81.0, would mark the first, and chance's margin, ${pc(0.75 + marginFor(0.5, 40))}, would hold the second)`, readTaps(madeShown(40, 32)).sameChoice.share === 0.9 && readTaps(madeShown(40, 38)).sameChoice.share === 0.975 && small90.byDesign === 1 && small90.marks === 0 && small975.marks === 1 && small975.byDesign === 0, { small90: small90.lines, small975: small975.lines });
  // 13. An entry that names the choice it was judged on is marked again when a group's best is another; an entry of another habit holds
  // nothing (a first button at 100 percent stays marked); and an entry with no share is marked again rather than held.
  const otherBest = readBank('made-listen', [{ name: 'alone', qs: listen }], 'made-listen', { ...entry(0.75), best: 'Nod' });
  // Its own plant: a bank whose answer is always the first button and whose right answers are never wrong choices, so no other rule
  // marks the row and only the habit an entry may name keeps it from being held.
  const firstClean = Array.from({ length: 2000 }, (_, i) => ({ type: 'choice', prompt: `Question ${i}`, story: null, choices: [`Right ${i}`, `Wrong ${i}`], answer: `Right ${i}` }));
  const firstHabit = readBank('made-first-clean', [{ name: 'alone', qs: firstClean }], 'made-first-clean', { habit: 'first', share: 0.99, why: 'made' });
  const noShare = readBank('made-listen', [{ name: 'alone', qs: listen }], 'made-listen', { habit: 'sameChoice', why: 'made' });
  ok('an entry judged on Nod is marked again where Listen reads best; an entry of the first button\'s habit holds nothing; an entry with no share is marked again', otherBest.marks === 1 && otherBest.lines.some((l) => /alone's best choice is Listen, where the entry was judged on Nod/.test(l)) && firstHabit.marks >= 1 && firstHabit.byDesign === 0 && firstHabit.lines.some((l) => /always the first button\s+100\.0\*\s+100\.0 <</.test(l)) && noShare.marks === 1 && noShare.byDesign === 0, { otherBest: otherBest.lines, firstHabit: firstHabit.lines, noShare: noShare.lines });
  // 14. A whole read with a table of its own, through a module id: the table's problems first, the module's bank held by its own id's
  // entry, a bank with nothing to tap counted with numbers, an entry over a fair bank stale, and the summary saying each.
  const madeQs = { 'made-listen': madeListen(), 'made-fair': made('fair'), 'made-typed': Array.from({ length: 2000 }, (_, i) => ({ type: 'number', prompt: `What is ${i} and 1?`, story: null, answer: String(i + 1) })) };
  const fakeL = { GENERATORS: Object.fromEntries(Object.keys(madeQs).map((k) => [k, () => null])), generateQuestion: (id, seed) => madeQs[id][seed - 1], getModule: (id) => (id === 'made-module' ? { id, generators: ['made-listen'] } : null), COURSES: [] };
  const whole = await blindRead(fakeL, ['made-module', 'made-typed', 'made-fair'], { seeds: 2000, table: { 'made-listen': entry(0.75), 'made-fair': entry(0.75), 'no-such-made': entry(0.75) } });
  ok(`a whole read with a table of its own, through a module id, names the table's problem first, holds the module's bank by its own id, counts a bank with nothing to tap and names a stale entry (${whole.lines[whole.lines.length - 1]})`, whole.lines[0] === 'BY_DESIGN names no-such-made, which is no bank' && whole.banks === 3 && whole.marks === 0 && whole.byDesign === 1 && whole.stale === 1 && whole.lines.some((l) => l.startsWith('bank made-listen (module made-module):')) && whole.lines[whole.lines.length - 1] === '3 banks read, 0 marked, 1 by design (BY_DESIGN), 1 stale by-design entry', whole.lines);
  // 15. Round two's read of pass NW: every condition read in every group, each case tripping one condition alone. A right answer shown as
  // a wrong choice only in a group of 20 questions, left unread for its shares; a value that is the answer only in a later group and a
  // wrong choice in the first; a later group past its ceiling; a later group whose best is not the choice the entry names; and, held, an
  // entry naming its choice beside a group of 20 questions, whose best is never read.
  const g20slip = Array.from({ length: 20 }, (_, i) => ({ type: 'choice', prompt: 'Your friend talks. What can you do?', story: null, choices: i % 2 ? ['Listen', 'Wait your turn'] : ['Wait your turn', 'Listen'], answer: 'Wait your turn' }));
  const laterShout = Array.from({ length: 400 }, (_, i) => (i % 20 === 0 ? { type: 'choice', prompt: 'Your friend is far away. What can you do?', story: null, choices: i % 40 ? ['Shout', 'Run off'] : ['Run off', 'Shout'], answer: 'Shout' } : { type: 'choice', prompt: `Question ${i % 10}`, story: null, choices: i % 2 ? [`Right ${i % 10}`, `Wrong ${i % 10}`] : [`Wrong ${i % 10}`, `Right ${i % 10}`], answer: `Right ${i % 10}` }));
  const laterNod = Array.from({ length: 400 }, (_, i) => (i % 2 === 0 ? { type: 'choice', prompt: 'How can you show you listen?', story: null, choices: i % 4 ? ['Nod', 'Look away'] : ['Look away', 'Nod'], answer: 'Nod' } : { type: 'choice', prompt: `Question ${i % 10}`, story: null, choices: i % 4 === 1 ? [`Right ${i % 10}`, `Wrong ${i % 10}`] : [`Wrong ${i % 10}`, `Right ${i % 10}`], answer: `Right ${i % 10}` }));
  const caseA = readBank('made-a', [{ name: 'alone', qs: madeListen() }, { name: 'small', qs: g20slip }], 'made-a', entry(0.75));
  const caseB = readBank('made-b', [{ name: 'alone', qs: madeListen() }, { name: 'later', qs: laterShout }], 'made-b', entry(0.75));
  const caseC = readBank('made-c', [{ name: 'alone', qs: madeListen() }, { name: 'later', qs: madeShown(400, 380) }], 'made-c', entry(0.75));
  const caseD = readBank('made-d', [{ name: 'alone', qs: madeListen() }, { name: 'later', qs: laterNod }], 'made-d', { ...entry(0.75), best: 'Listen' });
  const caseHeld = readBank('made-held', [{ name: 'alone', qs: madeListen() }, { name: 'small', qs: madeListen(20) }], 'made-held', { ...entry(0.75), best: 'Listen' });
  const endsWith = (r, re) => r.lines.some((l) => re.test(l));
  ok('every condition is read in every group: a right answer shown wrong only in a group of 20, a value right only in a later group and wrong in the first, a later group past its ceiling and a later group whose best is not the choice named each mark the row again, alone; an entry naming its choice beside a group of 20 is held', caseA.marks === 1 && endsWith(caseA, /again: small shows a right answer as a wrong choice on 20 questions\)$/) && caseB.marks === 1 && endsWith(caseB, /again: alone shows a right answer as a wrong choice on 1000 questions\)$/) && caseC.marks === 1 && endsWith(caseC, /again: later reads 97\.5, past 81\.5\)$/) && caseD.marks === 1 && endsWith(caseD, /again: later's best choice is Nod, where the entry was judged on Listen\)$/) && caseHeld.byDesign === 1 && caseHeld.marks === 0, { caseA: caseA.lines, caseB: caseB.lines, caseC: caseC.lines, caseD: caseD.lines, caseHeld: caseHeld.lines });
  // 16. An entry of the first button's habit over a bank whose same choice leans, with no right answer ever wrong, holds nothing: the
  // entry's habit is read as well as the row's, so the same choice row stays marked.
  const caseE = readBank('made-e', [{ name: 'alone', qs: madeListen() }], 'made-e', { habit: 'first', share: 0.75, why: 'made' });
  ok('an entry of the first button\'s habit over a bank whose same choice leans holds nothing: the same choice row stays marked', caseE.marks === 1 && caseE.byDesign === 0 && caseE.lines.some((l) => /always the same choice\s+75\.0\*\s+75\.0 <</.test(l)), caseE.lines);
  // 17. Pass NX (EARMARKS A180, its reader's finding on Learning words' p3-learn-different): the by-design rule reads each choice without
  // its # tag, since two alike pictures tagged #0 and #1 are one picture to a child. Two made banks whose twin tags hide a slip from a
  // reading by whole strings, which finds none in either: one shaped like p3-learn-different (two alike tagged #0 and #1 beside an
  // untagged third, the answer, each picture the answer on some questions and the alike pair on others) and one shaped like the odd one
  // out banks (the answer tagged #2 too). Each shows a right answer as a wrong choice on every question and is marked again under an
  // entry, by that condition alone; their near misses, whose alike pairs are never an answer, are held. A twin of a question's own answer
  // shown as a wrong button is a slip too, the answer's own button alone set aside, by its whole string.
  const PICS = ['icon:star', 'icon:cup', 'icon:ball']; const NEVER = ['icon:sock', 'icon:hat']; const ORDERS = [[0, 1, 2], [2, 0, 1], [0, 2, 1]];
  const madeTwins = (answers, pairs, tagged) => Array.from({ length: 2000 }, (_, i) => { const b = answers[i % answers.length]; const others = pairs.filter((p) => p !== b); const a = others[Math.floor(i / answers.length) % others.length];
    const three = [`${a}#0`, `${a}#1`, tagged ? `${b}#2` : b]; return { type: 'choice', prompt: 'Tap the one that is different.', story: null, choices: ORDERS[Math.floor(i / 6) % 3].map((k) => three[k]), answer: three[2] }; });
  const wholeSlips = (qs) => { const a = new Set(qs.map((q) => String(q.answer))); return qs.filter((q) => q.choices.some((c) => a.has(String(c)) && String(c) !== String(q.answer))).length; };
  const twinPlain = madeTwins(PICS, PICS, false); const twinTagged = madeTwins(PICS, PICS, true); const nearPlain = madeTwins(PICS, NEVER, false); const nearTagged = madeTwins(PICS, NEVER, true);
  const ownTwin = Array.from({ length: 40 }, (_, i) => ({ type: 'choice', prompt: 'Tap the star.', story: null, choices: i % 2 ? ['icon:star#0', 'icon:star#1'] : ['icon:star#1', 'icon:star#0'], answer: 'icon:star#0' }));
  const twinRead = (qs, name) => readBank(name, [{ name: 'alone', qs }], name, entry(0.556)); const tP = twinRead(twinPlain, 'made-twins'); const tT = twinRead(twinTagged, 'made-twins-tagged'); const nP = twinRead(nearPlain, 'made-near'); const nT = twinRead(nearTagged, 'made-near-tagged');
  const slipLine = /BY_DESIGN holds this row by design at 55\.6, and it is marked again: alone shows a right answer as a wrong choice on 2000 questions\)$/;
  ok(`made banks whose # twins hide a slip (by whole strings none) show a right answer as a wrong choice on all 2,000 questions read without the tag, and are marked again under an entry (an untagged answer reading ${pc(readTaps(twinPlain).sameChoice.share)}, a tagged one ${pc(readTaps(twinTagged).sameChoice.share)}); their near misses, alike pairs never an answer, are held; and a twin of a question's own answer shown as a wrong button is a slip`, wholeSlips(twinPlain) === 0 && wholeSlips(twinTagged) === 0 && slipsOf([{ name: 'alone', qs: twinPlain }])[0].n === 2000 && slipsOf([{ name: 'alone', qs: twinTagged }])[0].n === 2000 && tP.marks === 1 && tP.byDesign === 0 && endsWith(tP, slipLine) && tT.marks === 1 && tT.byDesign === 0 && endsWith(tT, slipLine) && slipsOf([{ name: 'alone', qs: nearPlain }])[0].n === 0 && slipsOf([{ name: 'alone', qs: nearTagged }])[0].n === 0 && nP.byDesign === 1 && nP.marks === 0 && nT.byDesign === 1 && nT.marks === 0 && slipsOf([{ name: 'alone', qs: ownTwin }])[0].n === 40, { tP: tP.lines, tT: tT.lines, nP: nP.lines, nT: nT.lines });
  // 18. Pass NX: the choice an entry names is compared without its # tag too, in a read and in the table's own check, so an odd one out
  // bank's best, printed with its tag (item:circle-red#2), is the choice an entry names with or without it; another choice is still
  // marked again, and a best given as a number, not words, still marks the row again and is never held, as before the tag was read.
  const oddBest = madeTwins(['item:circle-red', 'item:circle-red', 'item:circle-blue'], ['item:square-green', 'item:triangle-yellow'], true);
  const bestRead = (best) => readBank('made-odd', [{ name: 'alone', qs: oddBest }], 'made-odd', { ...entry(0.778), best });
  const bPlain = bestRead('item:circle-red'); const bTagged = bestRead('item:circle-red#2'); const bOther = bestRead('item:circle-blue');
  const fives = Array.from({ length: 2000 }, (_, i) => { const k = i % 10; return i % 2 ? { type: 'choice', prompt: `Question ${k}`, story: null, choices: i % 4 === 1 ? [`Right ${k}`, `Wrong ${k}`] : [`Wrong ${k}`, `Right ${k}`], answer: `Right ${k}` } : { type: 'choice', prompt: 'Tap five.', story: null, choices: i % 4 ? ['5', `Wrong ${k}`] : [`Wrong ${k}`, '5'], answer: '5' }; });
  const fiveWords = readBank('made-five', [{ name: 'alone', qs: fives }], 'made-five', { ...entry(0.75), best: '5' }); const fiveNumber = readBank('made-five', [{ name: 'alone', qs: fives }], 'made-five', { ...entry(0.75), best: 5 });
  const oddL = { GENERATORS: { 'made-odd': () => null }, generateQuestion: (id, seed) => oddBest[seed - 1] };
  const oddOk = checkByDesign(oddL, { 'made-odd': { ...entry(0.778), best: 'item:circle-red' } }); const oddNo = checkByDesign(oddL, { 'made-odd': { ...entry(0.778), best: 'item:circle-green' } }); const oddTagged = checkByDesign(oddL, { 'made-odd': { ...entry(0.778), best: 'item:circle-red#2' } });   // a best named with its tag, as the tool prints it (round one's code read of pass NX)
  ok(`an odd one out bank whose best prints with its tag (${readTaps(oddBest).sameChoice.name}, ${pc(readTaps(oddBest).sameChoice.share)}) is held under an entry naming it without the tag or with it, and marked again under one naming another choice; the table's own check takes the untagged best and names one that is no choice; a best given as the number 5 marks the row again where the words '5' hold it`, readTaps(oddBest).sameChoice.name === 'item:circle-red#2' && slipsOf([{ name: 'alone', qs: oddBest }])[0].n === 0 && bPlain.byDesign === 1 && bPlain.marks === 0 && bTagged.byDesign === 1 && bTagged.marks === 0 && bOther.marks === 1 && endsWith(bOther, /marked again: alone's best choice is item:circle-red#2, where the entry was judged on item:circle-blue\)$/) && oddOk.length === 0 && oddTagged.length === 0 && oddNo.length === 1 && /made-odd names the best item:circle-green, which is no choice of the bank at seeds 1 to 40$/.test(oddNo[0]) && fiveWords.byDesign === 1 && fiveWords.marks === 0 && fiveNumber.marks === 1 && fiveNumber.byDesign === 0 && endsWith(fiveNumber, /marked again: alone's best choice is 5, where the entry was judged on 5\)$/), { bPlain: bPlain.lines, bTagged: bTagged.lines, bOther: bOther.lines, oddOk, oddNo, fiveWords: fiveWords.lines, fiveNumber: fiveNumber.lines });
  // 19. Pass NX: a share of 1 is taken and one just over it is named (p3-tap-one and p3-help-grownup read 100.0 in every group). At 1 the
  // ceiling, the share plus the margin, is past any read, so a made bank reading 100.0 in each of its groups is held; the same bank with
  // its one answer shown once as a wrong choice is marked again.
  const atOne = checkByDesign(L, { 'p3-tap-one': { habit: 'sameChoice', share: 1, best: 'dots:1', why: 'made' } }); const overOne = checkByDesign(L, { 'p3-tap-one': { habit: 'sameChoice', share: 1.001, best: 'dots:1', why: 'made' } });
  const oneDot = (slip) => Array.from({ length: 2000 }, (_, i) => { const other = `dots:${2 + Math.floor((i % 4) / 2)}`; if (slip && i === 1000) return { type: 'choice', prompt: 'Tap the group with two dots.', story: null, choices: ['dots:1', 'dots:2'], answer: 'dots:2' };
    return { type: 'choice', prompt: 'Tap the group with just one dot.', story: null, choices: i % 2 ? ['dots:1', other] : [other, 'dots:1'], answer: 'dots:1' }; });
  const oneHeld = readBank('made-one', [{ name: 'alone', qs: oneDot(false) }, { name: 'first', qs: oneDot(false).slice(0, 400) }], 'made-one', { ...entry(1), best: 'dots:1' });
  const oneSlip = readBank('made-one-slip', [{ name: 'alone', qs: oneDot(true) }, { name: 'first', qs: oneDot(false).slice(0, 400) }], 'made-one-slip', { ...entry(1), best: 'dots:1' });
  ok(`a share of 1 is taken and one just over it (1.001) is named; a made bank reading 100.0 in each group is held at 1, and marked again when its one answer is shown once as a wrong choice`, atOne.length === 0 && overOne.length === 1 && /p3-tap-one gives the share 1\.001, not one over 0 and at most 1$/.test(overOne[0]) && oneHeld.byDesign === 1 && oneHeld.marks === 0 && oneHeld.lines.some((l) => /always the same choice\s+100\.0\*\s+100\.0\*\s+100\.0 by design \(best: dots:1\)/.test(l)) && oneHeld.lines.some((l) => /read at 100\.0, judged on dots:1;/.test(l)) && oneSlip.marks === 1 && oneSlip.byDesign === 0 && endsWith(oneSlip, /and it is marked again: alone shows a right answer as a wrong choice on \d+ questions/), { atOne, overOne, oneHeld: oneHeld.lines, oneSlip: oneSlip.lines });
  console.log(`\n${passed} passed, ${failed} failed`);
  return failed ? 1 : 0;
}

if (process.argv[1] && process.argv[1].endsWith('blind-read.mjs')) {
  const args = process.argv.slice(2); const opt = (name, dflt) => { const i = args.indexOf(name); return i >= 0 ? Number(args[i + 1]) : dflt; };
  if (args.includes('--selftest')) process.exitCode = await selfTest();
  else {
    const flagValues = new Set(['--seeds', '--rounds-n']); const ids = args.filter((a, i) => !a.startsWith('--') && !flagValues.has(args[i - 1]));
    if (!ids.length) { console.log('usage: node tools/blind-read.mjs <bank id or module id ...> [--seeds 2000] [--rounds] [--rounds-n 1500] | --selftest'); process.exitCode = 2; }
    else { const L = await import(pathToFileURL(process.cwd() + '/src/logic.mjs').href); const r = await blindRead(L, ids, { seeds: opt('--seeds', 2000), rounds: args.includes('--rounds'), roundsN: opt('--rounds-n', 1500) }); console.log(r.lines.join('\n')); process.exitCode = r.unknown.length ? 2 : 0; }
  }
}
