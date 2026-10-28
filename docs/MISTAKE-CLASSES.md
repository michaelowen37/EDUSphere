# Mistake classes

The kinds of mistake the independent checks found in passes MA to ML, read from docs/DECISIONS.md (lines 3054 to 3926) in pass MM's review of the workflow, at Mikey's word ("If you can run the entire vision, rules, decisions, claude.md etc through these ideas to improve our workflow, please do."). 35 classes, ranked by the passes a class came back in times its harm (3: false, unsafe or unfair to a child; 2: teaching quality, or a test's or a record's integrity; 1: a look, or rework). The prototype counts come from read-only scripts the review ran on pass ML's copy, and the file names are pass ML's.

How to use it: the trust pyramid (RULES-AUDIT section 9) puts a new rule first in the code, then in a test or a tool proven failing on a real past mistake, then in a brief. A class the checks find in two passes gets its check in the pass that finds it the second time (EARMARKS L16): when a pass meets one of the classes below that still waits, it builds the proposed check (or a better one), proves it failing on the evidence at the end of this file, and marks the class here. The last column says what pass MM built.

## (a) Top 15

| Class, in rank order | Passes | Strongest check in pass ML | Machine? | Proposed check | Since pass MM |
|---|---|---|---|---|---|
| 1. Unsafe scene or experiment for a young child | 10: all but MI, MK (12 of 14 with MM and MN) | test for pre-K 3 experiments only (tests/logic.test.mjs) and Wonder outdoors; stories, pictures: brief | partly | Read the experiments' choking list in every pre-K story paragraph and ledger row; fail a hit SAFETY_READ does not list with a reason. Prototype: 8 story hits, all already read. Near misses: "big red beads" (listed); a ball "as big as an orange". FP low; a broad hazard list hit 159 benign paragraphs. | Since pass MM, for choking: the stories test reads its list in every pre-K story and picture row, and a hit passes only with its reason in SAFETY_READ, and since round two every pre-K lesson's own lines too. Since pass MN, for pictures: the stories test reads every early-years picture row for a child near a height, water or a road with no grown-up in the prompt, passing a hit only with its reason in HEIGHT_READ (kindergarten to grade 2's 31 wait by name, EARMARKS A38). Water, height, roads and night in a story's words, and night in a picture, stay the briefs'. Since pass MO (round one's story and accuracy checks): a car in a story's words, a three-year-old who "hopped in" to Grandma's car alone, buckled into his car seat by his dad; the story brief reads the words for it. Round two's story check found that fix put his winter coat under the car seat's harness (the AAP: no bulky coat under it), so the story ends at the door: a safety fix is read again for what it brings in. |
| 2. Wrong or overgeneralized fact | 9: all but ME, MI, MK | brief | partly | List unhedged generic sentences ("A bird has wings, so it can fly") in early lines and short voices; fail one not signed off with its source. Prototype: 200 in early lesson lines, 23 in reviewed courses. Near misses: "Many frogs are green"; "A triangle has three sides". A reading list, not a verdict. | Waiting; since pass MO, for one fact the checks met twice: a square is a rectangle too, so no pre-K question asks for the rectangle by that word alone while a square is on the screen (tests/logic.test.mjs; pass ML had met it in an explanation, MO in a direction). Pass MO's round one also met a habit said to help at an age the evidence does not reach (saying steps to yourself, shown from five) and an opinion told as fact ("more fun with a plan"), both hedged, and a brief line. Since round three the square and the rectangle are read in every grade's kinds (Letters' What a word means and grade 1's Read the word had set the word rectangle against a drawn square), the third time this slip was found (pass ML, then rounds one and three of pass MO). Round four found it a fourth time (What a word means' does-it-match, grade 1's Joining shapes), and the check reads both. Pass MP met it in the games' written help, which the new welcomes said aloud (the soil jar's seventy percent sand, a dot for every coin where a big coin fills five, "a question about you", "every guess"), and in a benefit no study supports at that age ("stretch your working memory"); the game brief now reads a game's help with its welcome, and a benefit a game claims for its evidence. Pass MQ: a snail said to walk (now crept along like a snail), and a hat offered as wrong for a snowy place though its own explanation says people wear one there (civics-k, an older bank, found in passing). |
| 3. Record misstates its source (count, claim, quote) | 12: all | test, partial (tests/docs-sync.test.mjs) | yes for counts; partly for quotes | Fill every number and heading pass in HANDOFF, NEW-CHAT, RULES-AUDIT and EARMARKS from code, as tools/audit-sentences.mjs does (final reads corrected A22's hand-written count in MH, MK and ML); quote Mikey only from his saved messages. DECISIONS history is never regenerated. | Waiting; since pass MO, in part: HANDOFF's serial numbers are read against the ledger's last serials by the docs sync test (round three found them a pass behind, as pass LX had). Pass MP's round two met it as a record sentence quoted as Mikey's (Q63 called the MB entry's words his rule), a never the code's two smallest decks break, and ALGORITHMS still giving pass MO's sounds; the final read's brief now traces every quote called his to his own message and reads a never against the code's exceptions. Round three met it four times in round two's own records: Begin's ring given 5.8 to 1 for the border colour alone (3.8 as shown, at the ripple's strongest), a caption called three lines tall that keeps its longest line's height, a scroll's 0.42 seconds the code never waits, and an open question missing from NEW-CHAT's list; the screen brief now measures a ring or glow as shown. Round five met it in a question for Mikey: Q66's example tapped Ben when Ava held the stick, where Ben is the right answer, and its count of the games choice (a) reaches was round three's narrower one; the final read's brief now tries a question's example against the code. Pass MQ: a code comment said the rules test read the duck's and the bee's outline, and no test did (round one's code check; p30 holds it now); and E12 and E13, until written after the freeze, said what the new citations had taught still waited. Round two: two new citations said only events wait, where the earmark they cite says events and actions beyond the helpers' jobs; p37t's label promised a [pause] at the turn and a voice for each speaker and read neither; and the pass's own run scripts logged exit 0 for two click-through runs that had crashed. Rounds three to five: Q69's count of games came out narrower than the code three times (37 in 11 kinds, then 41 in 13 once Build a sentence and Green Flag or Red Flag were found, then 42 in 14 once round five read Split the Search's line in the tool's own list; Big and Small called pre-K's, where it is kindergarten's), the second pass in which a question's reach was counted by hand (pass MP's Q66), so tools/game-colors.mjs now takes such counts from the code; Q70's choice (c) said seven lessons where its words reached nine; a record read a report's P1, counted from zero, as the first paragraph; and a record said the review status was written before it was. Round six: Q72's example, never tried, said the next tap could land on the tile below the one meant, where Grow the Plant's five tiles sit in one row, the second pass in which a question's example went untried (pass MP's Q66), so whoever writes one now names the line of code or the measurement it rests on and the final read runs it again (INDEPENDENT-CHECKS); and three places still said the voice check page rests where a lesson rests, where a lesson rests between its texts. Round seven: round five's docs read named three light-theme changes the delivery left out and wrote words for one, and only that one went in, so Find the Tool's taller tiles on 360- and 375-pixel phones stayed out of the delivery's every change; a finding is applied whole since (INDEPENDENT-CHECKS' How, step 3). |
| 4. A fix broke something else | 12: all | brief (second reads) | partly | tools/field-diff.mjs: every data field changed since the frozen copy must be declared by the pass (MH dropped 40 long voices; MB nearly lost 144 rows); rerun every falling ceiling after each round. Near misses: a declared rewrite; a regenerated CSV. | Since pass MM, in part: tools/content-snapshot.mjs and tools/content-diff.mjs list every keyed item a pass changed since the frozen copy, outside its scope first, and the final read starts from that list (every bank read to 6,400 seeds, or to 76,800 for one of fewer than 1,000 questions). A declared list that a test holds waits. Pass MP's round three met it as a refactor: moving the pointer's scroll out to share it carried an offset one caller needed into every page, and the pointer rested under the floating Skip on a phone held sideways (found by the sweep and the fourth round's read); the welcome test now reads where every centred target lands. Pass MQ, rounds three and four: p45 lightened three icons for the dark theme's tiles and lowered them on its paper (the cactus to 2.93, the hat's crown to 2.43); p48's rest before a sentence start left the Quick Review card's spoken lesson name, lowered by lowerTitle, with no rest before it, and left the voice check page, built from the same code, resting where speak() no longer does. Each is held by a test since (the rules test). |
| 5. Citation and teaching disagree | 8: all but MF, MG, MH, MI | test, plans against citations (tests/coverage.test.mjs); brief | partly | Citations as data (taught and waiting sentences, teaching lines), "in part" generated; fail "whole" with a sentence waiting, or a taught sentence sharing no word with its line (ME's "up to five" counted to four). FP moderate; "taught" stays a judgment. | Since pass MM, in part: every pre-K quote is held to docs/standards word for word (class 9). Citations as data wait. Pass MQ: four older citations still said taking turns in conversations, or an expressive half, waits after the pass taught it (Please and thank you, Can I play too?, Big and little, Colours), a Head Start citation left out the one rule of volume its lesson teaches, and Helpers all around's undersold the actions and tools it teaches; the lesson brief now reads every citation of a code the pass teaches or reads anew (item 11). Round two: four older pre-K 4 II.D.1 citations still said the rest of the words waits after the pass taught the connections and the helpers' words (Colours, Big, bigger, biggest, Which came first?, Second and last). |
| 6. Test that could pass vacuously | 11: MB to ML | brief (broken by hand in a copy) | yes | Lint: an ok() asserting an empty failure list also asserts how much it read (prototype: 147 of 227 do not, among 1,547), a falling list; and tools/mutate.mjs, mutations paired with the title each must fail. Near misses: an empty list asserted beside a count read; a fixed literal table. | Since pass MM, in part: every pre-K question's checks run again on mutants (each wrong choice as the key) and must catch every one. The ok() lint and mutations for the other checks wait. Round five: a wait's check taps as the wait lifts (a 1 ms wait had passed), and a threshold is pinned on both sides (a cue at a half or a quarter had passed). Pass MO's round three: a widened advice pattern passed the line it was widened for, a word list left out the words a kind says (first, second, last, long, face), a numbers check never counted the steps, and a speech check passed a hush without its own ticket's check, each proven failing once fixed. Round four: speech case c passed a hush without its cancel (it read the voice only at four seconds) and section (l)'s ring check a ring with no ring (it read an attribute, a class and a name), so each reads what the child meets, the voice quiet 10 ms after the hush and the ring's computed style. Round five: round four's pace case passed a fix without its cascade, the feelings check two near misses in other words and never an "I feel X" answer, and the ring check a resting ring, so each reads every half of its fix, every way its family is asked, and a sign's strength. Round six: round five's three More right answers checks held the removed lines' words and passed 28 of 29 planted near misses, so the checks run on their own planted lines inside the rules test; and t1 passed a catch that never counted the thrown piece (the sound 1.47 seconds late), so it reads the sound's time. Round seven: round six's checks still held words more than the rule (21 of the 71 planted lines wrong, rewordings in every family), so they read what a line opens with and its said form; a check holds the forms it names. Round eight: the whyNot rule's own-size denial passed one that left out the color ("is not a big square." for a big red square), so the color is optional in it. Round nine: the whyNot rule passed "is not the big red square." and the app's own comparative swapped onto the other choice ("so it is not the smaller one."), so it is one function run on 25 planted reasons; and the animation check passed an inline animation set by a condition, so it reads one, on ten plants. Pass MP: the welcome's question check counted a question said before the welcome began, and passed with the pointer's press removed (the code check), so it counts only while the pointer asks, proven on the code before the fix; every new pause, round and self-test check of the pass was proven failing first. Pass MP's round two met it twice in the welcome's browser test: Skip during the pointer's ask passed a copy with round one's fault put back (its tap could land after the ask, and the voice was tried before the late hush came back), and Hold It in Mind's words passed with the hold taken out (the line began before the words would hide anyway); each now presses in the ask's own frame and waits past the code's last step, or reads the count of four, proven on the planted copies. Round three met it twice more: the rounds table's check held DEMO_ROUNDS to the search and passed with demoRoundFor's table line taken out, so it now writes a round into the table and reads it back, and takes a game out and reads the search's round; and Begin's ring check read its colour, width and animation's name and would have passed a ripple stuck at nothing, so it reads the ring's strength over a cycle, past half, and 0.85 still with less motion; each proven failing on the planted copy. Pass MQ, round two's code read: the duck's and the bee's outline passed with the head's outline moved to the beak; y12 passed with a slack of 3 or 3,000 ms; Find the Letter's young backstop and the lesson's Say it again passed every test when reverted (each now read; proof/p44). Rounds three and four: p48's own case read part of its rule (More Info's old pause, and digits or brackets dropped from startsSentence, each passed it); the click-through read Find the Tool's job from the whole page, whose text since p41 holds the hidden copy of every question; and game-intro's tile check read the tiles and not their words' ink (a stethoscope past its tile passed). Each reads the whole since; p48's case and game-intro's tile ink were proven on planted copies (proof/p53, proof/p55t), and the click-through's job check has no planted proof yet. Round five: game-intro's new Grow the Plant round passed on a phone held sideways with no right answer given, its taps landing below the window and each plant counted before its tap; and the voice check page's self-test passed a 200 ms rest inside a sentence. Each fails its near miss since (the screen read's planted build at both sizes, round five's code read's run, noted in proof/p55t; a sixth planted page). |
| 7. New rule or finding left unrecorded | 11: MB to ML | test, existence only (tests/docs-sync.test.mjs) | partly | Fail a file changed since the frozen copy but missing from For future passes, a CLAUDE.md line of this pass with no RULES-AUDIT row, a Not taken item with no earmark, Q number or reason. | Waiting. Pass MP met it as light-theme looks that followed from Mikey's game notes (the speaker under every game, the speakers beside spoken questions) with no row in RULES-AUDIT section 8 until the screen check asked; recorded, and Q64 asked the one he did not decide (he kept the ring in pass MQ, "Q64 - It's actually okay as is"). Round two met it again: a round-one finding half applied (Teach the Robot's rule, now taught in tech-6), RULES-AUDIT section 2's map without a bullet since pass MM, and three looks credited to Mikey that Claude had extended from his Which Sense notes, now recorded as Claude's. Round three found a rule of Mikey's lost with no record: the ask to turn a sideways phone upright (2026-09-16) has not shown since some pass before MP, its stylesheet rule in a block the browser drops, and no test or row held it (Q71). |
| 8. Heard cue gives the answer away | 7: MC MD ME MH MJ MK ML | test (tests/logic.test.mjs) | yes | Architecture: build each read-aloud reason from the tapped choice's own attributes, never free text; one test: after any wrong tap, two or more open choices fit every word heard. | In part: a reason, and since round three a question, is read as the voice says it (heardForm, SOUND_CARRIERS, speechPieces), and a letter the screen does not print counts as named; the architecture waits. Pass MP met it in a game's words: Pairs examples that were pairs the board deals (round one's fractions and roots welcomes, round two's science help); the scripts test now holds every Pairs line to its deck, written and said. |
| 9. Standard not quoted whole, verbatim, right band | 7: MA MB MD ME MJ MK ML | test for two wordings (tests/logic.test.mjs) | yes | Architecture: docs/standards/*.json holds each code's text by band, source and date; fail a quote that is not it or an exact run of its sentences. | Since pass MM, for pre-K: docs/standards keeps the published texts and the coverage test holds every pre-K quote to them. Kindergarten up waits, as each age's texts are kept. |
| 10. Asked or heard before the script says it | 7: MB MC MD ME MF MJ ML | test (tests/logic.test.mjs; tests/scripts.test.mjs) | partly | Grow scripts.test.mjs's counting phrases into a concept list (corners, takes up more room, real life) that explanations and reasons must find on a spoken line; a full vocabulary diff is noise (56, 29, 42 hits, mostly picture names). | Waiting; since pass MO askedNames reads a question's setup line and a direction's colors and shapes (round one's lesson and code checks: Two ideas named its answer in the setup, and Two steps asked for yellow and green, words no lesson in their chain said; kindergarten's Sorting asked for the rectangle group), with a rules case for each and the scripts test holding every reviewed lesson. Pass MQ: a question asked "Which one is a person?" where the script said only people, "teach" and a triangle's three sides were in questions and reasons no line said, and the face reasons used signs no line of the course said (round one's lesson check, each now said on a line). Round two: a circle's reason said round, a choice said shout over your friend, and a reason said the word itself, none in the script (now said, or reworded). |
| 11. Retired wording lingers | 10: all but ME, MK | tests per wording (tests/docs-sync.test.mjs; tests/logic.test.mjs) | yes | Architecture: docs/RETIRED.json (pattern, pass, scopes, waiting ids), one test reading every scope for every entry, folding the one-off checks in. | Waiting; since pass MO, for one rule: a listener's eyes on the speaker, which pass KD retired and passes KF and MO found again (I wonder; grade 3's Listening and asking, its stories and two picture rows), is read for in every lesson, question, story and picture prompt (tests/logic.test.mjs). Pass MP met it in comments: the snail's pace still "three quarters" and the welcome's clip keys in an older form, both corrected after the code check. Pass MQ: older citations still said "waits for a lesson" for what the pass now teaches (class 5). |
| 12. Low contrast or legibility | 10: all but MB, ME | test, dark-theme words (tests/e2e/dark-contrast.mjs; tests/scripts.test.mjs) | yes | A static test of every ink and ground pair for drawings, chips and game states in both themes (3 to 1 non-text), and a lint barring C. tokens in paper components; the misses were drawings (1.1, 1.37, 1.50). | Waiting. Pass MP met it in an edge added for contrast: Q56's green edge, drawn on the dark theme's answer tiles too, read 2.2 to 1 there, where the plain fill read 4.2; the green's edge is now for the paper alone, as Q56 asked, held by the scripts test with near misses. Pass MQ, round two's lesson read: the coat, the hat and the cactus read 2.2 to 3.0 to 1 on the dark theme's answer tiles (lightened in the dark theme alone). Round three: that fix reached the dark theme's paper too, and the rain drawing read 2.54 to 1 there (both fixed for the paper and held by the rules test; the icons' palette on the dark theme waits by name, EARMARKS A54). Round five: the lightened fills read 2.89 to 2.95 on a right answer's green tile (a shade lighter since, the rules case reading all three tiles), and the cloud and the snow, which draw the rain's cloud, kept its old grey on the paper (fixed with it). |
| 13. Narrator states a finding, rule or answer | 9: all but MG, MI, MJ | brief (RULES-AUDIT: doc only) | partly | Stories have no quotation marks, so no machine tells narration from speech: mark speech in the data, then fail narration exclaiming an answer word or stating a present-tense rule. Prototype: 11 in reviewed courses, the narrator's "A match!" (The other mitten) beside Grandma's untagged "Let's find more!". Near misses: "Leo ran out to play"; "Mom said to count". | Waiting. Pass MQ: Who am I?'s narrator said "baby brother" before Noor guessed baby (round one's story flow check; now "little brother", the clue's own word). |
| 14. More settled by look | 6: MA MB MF MH MJ ML | test (tests/logic.test.mjs, regex; tests/e2e/question-screens.mjs; tests/e2e/scroll-cue.mjs) | yes | The regex needs a size word, so "The cookie bowl had more" (MJ) and "the longer row has more" (MF) passed; flag any container or row that has more with no count in its sentence, and check one dot size on every comparison picture. | Waiting. A kin of it in pass MO: a question of two ideas whose answer was the one choice most like the others, answered by look alone on every seed; the rules test holds the four corners. |
| 15. Moral out of step with the spoken lesson | 8: all but ME, MG, MI, MK | none (story brief; MB declined a test) | partly | A moral shares 80 percent of its content words with readAloudScript, exceptions falling. Prototype: 7 of 39 reviewed morals fail, 46 of 161 elsewhere. Near misses: "Same shape, same hole." (listed); Who Said That?'s deliberate paraphrase. | Since pass MM: the stories test holds every read-aloud module story's moral to its script (a sentence of four words or more word for word, or four in five of its content words), the reviewed paraphrases kept by name and the rest waiting by name. |

## (b) The other classes

- Words a child hears wrongly or was never taught (8: MC MD ME MF MG MH MJ ML, and MN, MO and MQ since; tests/logic.test.mjs; tests/stories.test.mjs): one lexicon over all early heard text. Since pass MO (Mikey's Q51 notes) no held sound, crisp stop or ig reaches the voice, each the app's own sound or a respelling, and no sounded-out run hands the voice a vowel letter alone (ten grade 1 runs wait, EARMARKS A42), both by test. And since the proofs of pass MO's round one the scripts test reads a read-aloud lesson by its spoken script alone, since a word its paragraphs said and its script did not passed (EARMARKS A44: kindergarten's Big and small letters says 6 of the 26 letters it asks). Since pass MN the stories test fails almost or nearly before a past verb in an early-years story ("Gabe almost giggled" came back from pass MD), safe-online-k waiting. Pass MQ: a wrong reply's name ending in a full stop made the voice say "I want a cup of juice." and then a fragment (now "Saying, I want a glass of water, is not ..."), "How many tells you to count." was heard as a question that broke off, "look at my shoes" inside an if as an order to the child, and "cried Noor" as crying.
- Wonder voice off its person or repeating another (8: MA MB MF MG MH MJ MK ML; tests/logic.test.mjs): flag shared content and borrowed frames (prototype: 7 pairs, 3 borrowings, about half real).
- Layout that does not fit (10: MA MB MD ME MF MG MH MI ML MQ; tests/e2e/question-screens.mjs): one overflow and next-control sweep at four sizes. Pass MQ: Find the Tool's stethoscope ran 28 pixels past the board on a 320 phone, on the boards that dealt it, and Which Sense's and Find the Tool's answer boxes moved 30 pixels as a right answer's line took two lines (game-intro reads both through whole rounds since).
- Checked in one condition only (7: MB MC ME MG MH MI MK, and MN, MO and MQ since; brief; pass MO: the voice check page spoke straight after a cancel, which a phone's browser drops, and a line stopped before its sound when a voice dropped a batch's end event; the page now waits and runs a self-test from the rules test, and the sequencer watches for a dropped end; round two's code check ran the speech code in node:vm against a voice that drops what Chrome drops and found that watch playing a dropped try beside the retry, so the rules test runs it so): one browser harness across theme, motion and width, with a voice that reports speaking. Since pass MM the lesson cue's check reads both themes (written for the light one first, it passed the old code, since the lines it was wrong on were the dark theme's), Find the Letter's waits are checked with a voice that never ends a line, and the checks have been run from a folder with a space in its path. Since pass MN the trace checks sway along the drawn curve, since jitter on the line through a shape's points (one condition of a finger) passed a forward trace a sway cleared. Since round three of pass MO every reader of speech is run beside the next words, not only the practice hush: a reader's stop cancelled the voice in the tick the next line was sent, and that line's first sentence was lost; and a stand-in voice is read for faults of its own (the rules test's started an utterance twice when an end handler queued the next words). Since round four the ring is read in both themes, and the Wonder's voice cards are left by the device's back, a way out the round three hush had missed; and since round five a coloring page is closed and listened to, the one screen that speaks as it opens that rounds three and four had missed. Since round six a drawing's size is read with motion on as well as off (an animation's transform had taken a lesson pair's 85 percent), and since round eight the scripts test reads ui.jsx for an element that wears an animation its className or inline style names, which moves transform, beside a transform of its own (Buckets' chip shook half its size off its spot while it wobbled, older than the pass), which a screenshot with motion off never shows. Pass MP's round two met two fixes checked apart: Skip floating at a short screen's foot and the pointer's scroll that brought a target only to that foot, so the pointer worked under Skip; the browser test now plays the whole welcome at both short sizes and reads where every step rests. The second read met it once more in the claude.ai preview on a laptop, a frame as tall as the page, where the window is never short: Skip and the pointer read the window, and the welcome is now walked in such a frame too. Round three's second read met it twice more: the welcome was checked while it played and never once it had gone (its pointer left the page scrolled to the closing speaker, Begin out of sight in 28 of 59 welcomes in the frame and 15 on a phone held sideways), so the browser test and the sweep now read Begin, and the board's top after Begin, once the welcome has gone; and a wrong move's sign was checked with motion on only (the wobble stops with less motion, and thirty games then showed nothing), so the welcome test taps a wrong answer with less motion asked for and reads the still edge. Round four met it twice more: Begin was read only after a welcome that ended by itself, and a Skip or Instructions pressed while the page still moved left Begin and the pop-up out of the frame's view; and a board whose size changes as play begins moved the page by Chrome's scroll anchoring. The welcome test now presses both ways out while the page around the frame is seen moving, and plays Pay It Off, taller in play than in its welcome. Pass MQ: the spoken row was read on a computer only, and game-layout opens each game's first board alone.
- A person's look missing or changing (8: MD MF MG MH MJ MK ML MQ, twice; tests/ledger.test.mjs): a LOOKS table per story, held verbatim in each row. Pass MO met it again: Arun's dad had a beard and no hair in four rows, and Lola nearly matched pre-K 3's Esme in the same plot; in round two Arun nearly matched Otto, the lesson before his in the same course, and two more near matches across courses (Anika and Jade, Keoni and Sam), found by listing every pre-K child's look from the ledger. Pass MQ met its other face: four new people looked like a child a lesson or two away in their course (Noor like Splash's Nell, Kofi like Gus, Mateo with Kai's hair, Hana's dad in Asha's dad's gray), and a check's own suggested fix would have made two more alike; the story brief reads every new look against the course and the course before it (item 10). Round two: the fixes themselves gave a new boy Mike at four's haircut and Frederick at four's striped shirt, a new grown-up grown Mike's face, and a teacher the A and B grandma's look; the story brief reads the core cast's sheets too since.
- Folded prompt says the wrong thing (7: MC ME MF MG MJ MK ML; tests/ledger.test.mjs): an explicit people field per row. Since pass MO a story row's style anchor is its course subject's, by test (round one's picture check: twelve Reading rows took Math's anchor, the slip pass MM made on the long stories, so its second time), and a check note asks only for what its prompt paints (the picture brief).
- Even, clipped or repeated runs (7: MA MB MC MD ME MK ML; tests/stories.test.mjs): add repeated first words.
- Game not doing what its words promise (7: MA MB MC MI MJ MK ML; tests/logic.test.mjs; tests/e2e/drag.mjs): each promise phrase mapped to a browser assertion. Pass MP met it as its welcomes said each game's help aloud: round one found nineteen kinds' lines that did not match their boards, and round two Step on the Circles' "turns red" over a clay edge and Teach the Robot's rule, which its course never taught (now taught); since pass MP tools/intro-sweep.mjs plays one game of every kind through its welcome, and a step that finds nothing or rests out of sight is a miss. Round three found round two's own word, "wobbles", promising a sign that stops where less motion is asked for: a line now names the sign a board shows either way where it has one (the path's red-brown edge, Find the Letter's dashed ring), and with motion off every button or card that would have wobbled wears a still red-brown edge and Spot It's and Teach the Robot's pieces a ring; round four found the first wording of that, "every wobble", claiming more than the code did, since the boards drawn in SVG keep their own signs.
- Audio tags off the floor (7: MB ME MH MJ MK ML MQ, twice; tests/stories.test.mjs): sound tags name sounds the words name. Since pass MM the stories test counts each story's sound effects, one to three (a tag that names a thing making its sound). Pass MQ: the pass's five new stories gave no speaker a voice of their own and had no [pause], though ELEVEN-V4-AUDIO-TAGS has asked for both since pass MP; the stories test holds both for every early story from S3931 on, and on its first run it found the fix had missed one [pause]. Round two: four mood tags inside a speaker's words dropped the voice the turn had given them.
- Cast canon contradicted (6: MA MC MF MG MH MI; tests/stories.test.mjs): CHARACTERS as data.
- Line and picture disagree (7: MB MC MD ME MK ML MQ; tests/scripts.test.mjs): every named thing drawn, not one shared word. Pass MQ: a short-sleeved shirt stood for a coat, three shape cards for a whiteboard and a steaming mug for juice, and four answers (a boat, a bus, a spoon and a wall) were never drawn in their lessons; the scripts test reads every picture in a pair or a row since this pass (A49).
- Field nothing reads, or a silent tool (6: MC MF MH MJ MK ML; tests/logic.test.mjs): a key schema per picture kind (507 pairs over 105 kinds) naming the nearest key. Since pass MM the rules test parses every tool, reads one course's packet for each lesson's example drawing (it read a field no example has), and fails a test or tool that makes a file path from a URL's pathname (a folder with a space in its path, as in pass MC).
- Light theme changed unrecorded (5: MG MH MJ MK ML; doc): a pixel diff, each change tied to a RULES-AUDIT row.
- Wrong choice a child could fairly call right (5: MB MD ME MH ML, and MO and MQ since; tests/logic.test.mjs): one ALSO_FITS table for every generator. Pass MQ: Tap the picture for an event offered the book for bedtime and a birthday party and the bed for story time (27, 29 and 19 of seeds 1 to 400); the rules test's own list of pictures a child could fairly tap fails the bank if one comes back.
- A reason that does not fit its question (1: MQ; tests/logic.test.mjs since MQ): one reason line shared by every Yes or every No of a bank was heard after questions it did not fit ("Yes would mean they do, but they do not." after "Are glad and happy opposites?"; "No would mean it is not, but it is." after "Can you take turns talking with your teacher too?"). Each row now carries its own reason, and the rules test asks a reason in Domain II's yes-or-no banks to name a word of its own question, proven failing on the 900 such reasons of round one's frozen copy.
- A fix that brings a mistake of its own (2: MO, three times in round one, and MQ, in both rounds; the second reads and the tests): the car seat round one gave Arun put his winter coat under its harness, the watch for a dropped end let a try the voice had dropped play on beside the retry, and the hush made the next screen's speak a cancel-then-speak, each found by round two's second read, which is why every fix gets one. The briefs read a fix again for what it brings in. Round three found three more: the four corners' fourth reason, "so it fits neither idea", a word and a corner the lesson never had; round two's fewer line for More and fewer, whose reason three against three would give too; and Coat, then door's open front door, at which the bell round two added rang. A widened check can miss what it was widened for: round two's advice pattern passed the very line it was written to catch, and its own proof log said so, so a proof log is read before a check is called done. Round nine: round one's watch for a lost end and round three's retry of dropped first words, both right for a phone, read play-and-read's stand-in voice, stopped once by a cancel, as words it dropped, so a read meant to stop short ran on to the end and counted; no full check had run since the pass began, and check.sh found it at delivery. A change to how the app reads aloud runs every browser test that drives a voice before the next round. Pass MQ: an open toy box written "with no lid" went over the ledger's ceiling on prompts that say what a picture is not, three new yes-or-no reasons ran to 19 and 20 words, the voices' rewrite missed one story's [pause], and the young voice the pass itself added rested after a reading's last text; the first three were caught by tests the moment they ran, the fourth by the code check. Round two: the look fixes brought core characters' looks, p39t's longer wait left the stale note it waited for, and the sunshine fix broke the word on most phones, and p41's cap on a welcome line that never ends took the tests' pace of 0, so in every test no welcome line waited for its voice (found reading the code before round three; game-intro reads the cap since).
- A heading whose lines are not what it promises (1: MO; tests/logic.test.mjs since MO): More right answers held advice on how to answer in thirteen kinds of pre-K banks (ML's "count to be sure", MN's "Think about what your friend likes.", MO's "Listen for both ideas"; round one's screen check found ten, round two's lesson check three more, a method told as a line); a rules check holds every generator to it. A reading list beyond it: a heading over a list is read for what each line is. Pass MO met a stomp offered as never happy (a verse of If You're Happy and You Know It) in two banks, one of them pass MN's, and a shy child's walking away offered as unkind. Round three found five more lines that said what to do or how to check (the little slide, asking a friend, looking at a face, and the size kinds' "Lay two crayons ..." and "Stand back to back ...") and a rule stated under a question with one answer (Let's play together's "Each friend does a part of the plan."). Round four found two more under a question about a feeling (How do friends feel?'s friend rows, what to do), and a scan of every question about one feeling five more (three morals in Can I play too?, a line about big feelings, a comfort), so a second rules check holds that family: a line names the feeling, its signs or another fair one.
- A doc that says a step is done before it is (1: MO; tests/docs-sync.test.mjs since MO, for HANDOFF's numbers): DECISIONS said the voice check page was published again with the pass's last speech code and the generated ledgers rerun, while the live page was round one's and REVIEW-LEDGER had not been rerun; and HANDOFF's serial numbers were a pass behind, as pass LX once found them, so the docs sync test reads them against the ledger. A step is written down once it is done, or as a placeholder filled when it is. Round eight found it again (the entry said the voice check page was republished while the live page was round four's build), so that line waited as a placeholder too until the page was published again and read back at delivery.
- Rule decided on the screen (6: MC MD ME MG MH MQ; tests/scripts.test.mjs): lint ui.jsx filtering course, story or event lists. Pass MQ: which screens get the young voice was a list only the screens read, and taking practice out of it passed every test (round one's code check); it is youngVoiceOn in logic since, read part by part by the rules test.
- Code state: stale closure, race, stored verdict (6: MB MD ME MH MI MQ; tests/scripts.test.mjs): a hooks dependency lint. Pass MQ: closing a game left a rest set, so the voice still counted as talking (round one's code check).
- Surface shortcut or surface variety (4: MA MB MC ML; tests/logic.test.mjs): fail a kind a trivial strategy answers 95 percent of the time. Prototype: grade 1's ql1-fact always puts its answer in the middle. Since pass MM the rules test fails a bank whose answer sits in one place 95 percent of the time over 300 seeds, and lists by name the banks whose answer never changes, and those whose answer leans to one place, 70 percent with two choices or 55 with more (EARMARKS A31); and a read-aloud question never prints the letter it asks for while the voice can say it (printedQuestion).
- Red against green (3: MB MK ML; tests/logic.test.mjs): every grade, and game states by lightness.
- Explanation hands the question back (3: MB MD MH; tests/logic.test.mjs): flag one whose content words all sit in its prompt.

## (c) Judgment that stays in the briefs

Mikey's intent misread (4: MD ME MF MH), and the verdicts behind the lists above: a fact beyond its shape (dates, sources, product steps), water, height and night in a scene, whether a moral or a citation truly teaches, a story's turn, a Wonder voice's depth, a picture's framing, visual regressions.

## (d) Regressions, and what tests changed

The same fix more than once: answer-leaking reasons, five patches in four passes (MH, MJ, MK twice, ML); unequal dots in the long row and size trap (MA, MH, ML); a check placed after its loop's skip (MD, MG, MQ); ink on the dark theme's paper (MA, MD, MH, MI, MJ); the tag floor (five tags in MH and MJ; loosened and restored within ML); speak()'s retry, logged in MD, declined in MG, heard by Mikey in MI ("Blue, blue") since the test voice never reported speaking.

Tests that ended their class: Overlay (MB), layout as variety (MA), ages (MC), careers (MG), no "actually" (MH). Tests that did not (the passes it came back in): the bigger-group regex (MF, MJ), the hands fold (MF, ML), the leak predicates (MJ, MK, ML), the tag floor (MK, ML), red against green in pre-K 3 only (ML), the For future passes existence check (MC, MF, MG, MH, ML), the tools' run-alone guard (MF, ML). The moral rule, whose test MB declined, came back in six later passes. A test that reads a whole population for a structural property ends a class; one that matches a wording or a sub-case moves it to the next wording.

## (e) The evidence, class by class

Each quote is word for word from docs/DECISIONS.md, at most 20 words, with the line it sits on (DECISIONS only grows at its end, so the lines hold).

### C1 narrator states a fact, finding, rule or answer (9 passes)
- MA (line 3073): "had no speaker, so the narrator stated a rule (now Mike says it)"
- MB (line 3129): "a grown-up to say each rule, and no general fact in the narrator's voice"
- MC (line 3189): "The B Hunt's narrator stated B's shape and each find"
- MD (line 3269): "the fight half of the rule said only by the narrator"
- ME (line 3310): "the narrator stating a general fact (Grandma says "Three words that rhyme!" now)"
- MF (line 3366): "The story check found Two Plates telling which plate had more before Ana counted"
- MH (line 3690): "Chloe's mistake moved into her own voice"
- MK (line 3823): "the narrator solved The apple puzzle's trap"
- ML (line 3879): "the narrator called the train a match"

### C2 moral or story out of step with the spoken lesson (8 passes)
- MA (line 3076): "Find the Match's story taught the same size"
- MB (line 3144): "three morals fell behind in two passes"
- MC (line 3189): "his sister gives the clues, and the moral is the key idea"
- MD (line 3269): "the story printed under I.B.2.b naming only scared"
- MF (line 3396): "a pre-reader's moral echoes the spoken script, not a paragraph a pre-reader never hears"
- MH (line 3690): "the moral's "Say your feeling's name", the spoken line"
- MJ (line 3792): "The big boom's "Feelings have names ... Say its name" says "Say your feeling's name""
- ML (line 3879): "its moral said "The same means just alike", which no script line says"

### C3 even, clipped or repeated runs, across breaks too (7 passes)
- MA (line 3069): "its paragraph 5 joined every idea with and"
- MB (line 3130): "three even runs across page breaks and a few grown-up phrases"
- MC (line 3205): "Will It Roll?'s six She and It openings broken"
- MD (line 3269): ""down" three times, three paragraphs opening with Owen"
- ME (line 3310): "a second said-tag for one speaker in the cracker story"
- MK (line 3823): "four runs of short sentences crossed a paragraph break, which the flow tool reads only inside a paragraph"
- ML (line 3885): "round one's fixes had made three even stretches across a paragraph break"

### C4 audio tags off the floor (6 passes)
- MB (line 3137): "four sound effects the words never name are gone"
- ME (line 3310): "a clap tag before the clap"
- MH (line 3703): "the picnic's extra [softly] tag (five tags on one paragraph, over the two to four)"
- MJ (line 3799): "the tag floor was written and held by no test"
- MK (line 3823): "one proud moment takes one tag"
- ML (line 3906): "four more of First Steps' two-sentence paragraphs keep one tag"

### C5 cast canon contradicted (6 passes)
- MA (line 3090): "gives Mike a daughter old enough to take a class on how people work"
- MC (line 3214): "named a start that CHARACTERS gives to the microscope"
- MF (line 3351): "a teacher of forty years, a sixth-grade teacher of thirty-one, and a nurse of forty"
- MG (line 3472): "psychology-college disagreeing with psychology-9"
- MH (line 3579): "Georgette's stand-in portrait looked younger than Frederick's"
- MI (line 3741): "The picture check found Frederick then read as the oldest and Georgette young"

### C6 citation and teaching disagree (whole, in part, untaught, uncited) (8 passes)
- MA (line 3062): "was cited by both size lessons and taught by neither"
- MB (line 3125): "never sorted though it cited sorting"
- MC (line 3189): "never named a circle or a square though its book page cites both"
- MD (line 3267): "I.C.6's in-part reason naming the wrong gap"
- ME (line 3308): "V.B.1 and V.B.2 cited whole for a lesson that added and took away exactly one"
- MJ (line 3791): "codes cited whole that the lessons teach in part now say what waits"
- MK (line 3822): "Which One Is Different? cites P-SCI 3 in part"
- ML (line 3876): "P-MATH 8 was cited where nothing is measured"

### C7 standard text not quoted whole, verbatim, from the right band or source (7 passes)
- MA (line 3057): "The math plan's PK3.V.E.1 quoted the pre-K 4 outcome"
- MB (line 3122): "quoted II.A.1 with words that match no published text"
- MD (line 3268): "Cornell LII and Justia print an earlier subsection naming 2025-2026 that TEA's revisions struck"
- ME (line 3309): "P-MATH 6's cell quoted as if it were one sentence"
- MJ (line 3797): "P-SCI 1's in part missed its middle sentence"
- MK (line 3822): "The last paraphrased Head Start progressions ("which for three-year-olds means") are quoted"
- ML (line 3876): "no citation quoted its 48 to 60 month progression, five cut V.E.1 short without saying in part"

### C8 a heard cue gives the answer away (7 passes)
- MC (line 3197): "A tapped letter said its name, so "Tap the letter A" beside H could be passed by ear"
- MD (line 3267): "the name-it questions answerable by echo"
- ME (line 3308): "the more-or-fewer question answered by its heard words"
- MH (line 3551): "The screen check found reasons that name the answer (87 of the 320 wrong taps it sampled)"
- MJ (line 3791): "a pre-reader's heard reason gave the retry away by naming the other wrong picture"
- MK (line 3822): "which rules out the other alike picture and leaves only the answer (all 936 such taps)"
- ML (line 3889): "named all three animals, so a first wrong tap heard "and a snail is tiny" while two were open"

### C9 answerable by a surface shortcut, or variety only on the surface (4 passes)
- MA (line 3086): "1,976 of 3,000 triple-dose sets repeated a counting task"
- MB (line 3125): "Circle and Square's 16 were 4 tasks recolored, every round repeating one"
- MC (line 3213): "A was the middle tile of every sign word"
- ML (line 3878): "Patterns could be passed without reading a pattern"

### C10 a wrong choice a child could fairly call right (5 passes)
- MB (line 3134): ""Tap the one we cut into slices to eat" could offer the fish or the bird"
- MD (line 3267): "the laugh question fair to a child who plays Ring Around the Rosie"
- ME (line 3314): "the wall icon (a grid of gray stones) offered beside the rock icon (one gray stone)"
- MH (line 3578): "set happy as the wrong face in five of its six moments"
- ML (line 3878): "Firefighter was a wrong answer to "Who keeps people safe on the street?""

### C11 asked or heard before the spoken script says it (7 passes)
- MB (line 3125): "it never said "listen to the word, then find its picture", its key idea's second half"
- MC (line 3207): "look-alike lines before the questions"
- MD (line 3267): ""What do you do next?" leaning on a step never given"
- ME (line 3314): "the odd-one task asked before a line modeled it"
- MF (line 3383): "which the untaught tool skips at seven words"
- MJ (line 3791): "every More and Fewer explanation said count past while only an unheard paragraph did"
- ML (line 3878): "The words heard after an answer are on script lines"

### C12 a line and its picture disagree (6 passes)
- MB (line 3125): "named the moon and a cloud over a picture of the sun and a fish side by side"
- MC (line 3198): "`highlight: 0` on A and B's lines lit nothing"
- MD (line 3267): "the ball shown three lines running"
- ME (line 3308): "stacking three over two while the line named a one-dot group"
- MK (line 3822): "showed Bear alone with its B lit while the voice said "start with A""
- ML (line 3878): "Thirteen lines had no picture"

### C13 a wrong or overgeneralized fact (9 passes)
- MA (line 3063): ""Falling rain looks like lines" (rain falls as drops, USGS)"
- MB (line 3125): ""A bird has wings, so it can fly" (penguins and kiwis cannot)"
- MC (line 3206): "Antarctica painted green on the world map"
- MD (line 3268): "It corrected Chrome on Android's menu"
- MF (line 3381): "a Wonder voice that put an 18 percent mortgage in 1980"
- MG (line 3475): "both careers skipping a degree"
- MH (line 3696): "two Wonder facts wrong for the newest research"
- MJ (line 3790): "says a tear sometimes rolls out, never that every sad face has one"
- ML (line 3876): "Texas Parks and Wildlife calls the box turtle a dry-land turtle"

### C14 words a young child hears wrongly or was never taught (9 passes; MN since the review)
- MC (line 3217): "TEA and SEA, which sound like the letters T and C, left the sign words"
- MD (line 3269): ""almost grabbed the ball and ran off" heard as running off"
- ME (line 3309): ""found more. Moon and spoon." heard as a spoon found on the path"
- MF (line 3367): "a garden path in sexual-health-6's first paragraph"
- MG (line 3476): "and the word cross, which no early lesson teaches"
- MH (line 3695): "bee, heard as the letter B, taken out of A and B"
- MJ (line 3792): ""at recess" is "at playtime" (a pre-K word)"
- ML (line 3879): "Bea became Lucy (a voice says Bea as bee"
- MN (line 4046): "Gabe "wanted to giggle", where "almost giggled" is heard as giggling at an embarrassed friend"

### C15 more settled by look, in words or drawings (6 passes)
- MA (line 3060): "More and Fewer taught more as the bigger group"
- MB (line 3125): "drew the shape to match larger than its twin"
- MF (line 3381): "kindergarten's Picture Graphs, which said the longer row has more without the condition that makes it true"
- MH (line 3564): "90 apart shrank the long row's dots below the short row's on a 360-pixel phone"
- MJ (line 3792): "ended its count "The cookie bowl had more", which pairs the big bowl with more"
- ML (line 3878): "One, two, three explained "The bigger group has more." (A7)"

### C16 red against green, or hue alone, tells two things apart (3 passes)
- MB (line 3145): "the commit message claimed red is never set against green, which holds in pre-K 3 only"
- MK (line 3835): "the apple rows painted the green apple "pale yellow-green""
- ML (line 3876): "in one question in six the answer and a wrong choice differed only by red and green"

### C17 a person's look missing or different across rows (7 passes)
- MD (line 3270): "found the people without a fixed look and the bedroom scenes without night"
- MF (line 3370): "asked for one look for every person across a story's pictures"
- MG (line 3472): "painting Savanah from her thirties-and-coat sheet with no age written"
- MH (line 3710): "got ages but not written-out looks, so A22 stays at 130"
- MJ (line 3793): "one look per person in nine stories"
- MK (line 3824): "Twenty-two picture rows wrote no look for their people (EARMARKS A26)"
- ML (line 3880): "no module story wrote a look for anyone"

### C18 the folded prompt says the wrong thing (not, writing, hands) (7 passes)
- MC (line 3206): "the fold said "Hands have five fingers" over about 85 pictures with no person"
- ME (line 3311): "P134 as a picture book that a model would letter"
- MF (line 3377): "no person word where no one is drawn"
- MG (line 3481): "CS474 still invited writing"
- MJ (line 3793): "prompts say what is there, never what is not"
- MK (line 3824): "Where is the cloud?'s picture cards are drawings only"
- ML (line 3888): "P111's "two black hands" read as a person's"

### C19 an unsafe scene or experiment for a young child (12 passes; MM and MN since the review)
- MA (line 3068): "three three-year-olds were alone in a park"
- MB (line 3139): "a three-year-old alone with her eyes shut by a pond"
- MC (line 3189): "an acorn fits the CPSC small-parts cylinder"
- MD (line 3256): "the bed across the room from the window"
- ME (line 3309): "D240's fruit bowl inviting grapes (dropped)"
- MF (line 3383): "the pre-K 3 choking check made to read a small block, cube or toy"
- MG (line 3442): "(a look at the sky now means the sun is in view)"
- MH (line 3703): "a careful parent keeps a three-year-old out of long grass, where ticks wait"
- MJ (line 3790): "judged a choking hazard by whether a thing is "too big to swallow""
- ML (line 3887): "no grown-up had been placed with three four-year-olds at night"
- MM (line 3958): "a grown-up beside every child at the beach and the porch"
- MN (line 4047): "S3908 and S3910 put a four-year-old at and on a tall slide with no grown-up"

### C20 a Wonder voice off its person, or repeating another (8 passes)
- MA (line 3064): "w-big-or-small's scientist declared a right answer"
- MB (line 3128): "Georgette had no faith of her own; Mike tested nothing"
- MF (line 3383): "a Georgette voice that called her "the smallest boy in my class""
- MG (line 3476): "nine that must change and ten worth changing"
- MH (line 3697): "five Mike lines whose doubt landed on Georgette's line before them"
- MJ (line 3793): "w-big-or-small's Chloe made Frederick's point a second time"
- MK (line 3824): "Frederick and Chloe made one point in the same words"
- ML (line 3890): ""feel like ... to me" is Chloe's"

### C21 low contrast or legibility (10 passes)
- MA (line 3071): "The rabbit's pale fur vanished on the dark theme's almond paper (1.1 to 1)"
- MC (line 3217): "the best badge's mint ink was 2.00 to 1 on its white chip in the dark theme"
- MD (line 3271): "drawn in the dark theme's light ink on yellow (1.37 to 1, a blank disc"
- MF (line 3364): "Celebrate! in white on the light theme's gold at 3.24 to 1"
- MG (line 3470): "the breathing ring gone with motion off"
- MH (line 3693): "the light What you see with no contrast"
- MI (line 3751): "under Begin the light palette's olive gray sat on the dark theme's light green paper"
- MJ (line 3799): "left a sorted shape at 2.7 to 1"
- MK (line 3824): "the yellow shapes were 1.50 to 1 on their cells"
- ML (line 3891): "the light theme's wrong-tap reason and game titles below the contrast guideline (Q47)"

### C22 the frozen light theme changed without a record (5 passes)
- MG (line 3485): "the resting lesson page's fix touching the light theme with no record of it"
- MH (line 3516): "a bolder, bigger title in the light theme, a change nobody had asked for"
- MJ (line 3799): "the Red and Blue game's and the kite's new looks change the light theme too"
- MK (line 3824): "These change the light theme's look of nine games"
- ML (line 3915): "Light-theme changes, recorded in RULES-AUDIT section 8 for Mikey's review, all fixes a check asked for"

### C23 layout does not fit a screen size (9 passes)
- MA (line 3071): "five shapes wrapped at 360 pixels"
- MB (line 3140): "pop-ups in a page-tall frame still opened at the frame's top the first time"
- MD (line 3271): "the third face alone in the left column"
- ME (line 3312): "the confetti lining the card's top edge"
- MF (line 3364): "the cover shelf one to a row at 360 pixels"
- MG (line 3470): "Return home below the screen on short phones while the voice named it"
- MH (line 3693): "Check answer pushed to the fold at 375 by 667"
- MI (line 3760): "the ship's count running into its ships"
- ML (line 3890): "an animal had filled 45 percent of a laptop's card"

### C24 checked in one condition only (width, motion, voice, frame, cap) (8 passes; MN since the review)
- MB (line 3115): "every check of it ran at phone width"
- MC (line 3217): "the pass's own screenshots used reduced motion, which holds the wash at its yellow end"
- ME (line 3312): "the celebration skipped on a two-review day"
- MG (line 3415): "with motion off the drifting rainbow froze on its first color, the gold end"
- MH (line 3534): "The screen check measured contrast, the fold and overlaps, mostly at phone width"
- MI (line 3747): "The test page's voice never reported speaking, so no test had seen it"
- MK (line 3836): "round one's screenshots were all taken with motion off"
- MN (line 4065): "since jitter on the line through a stroke's points never cuts a corner"

### C25 a rule decided on the screen instead of in logic (5 passes)
- MC (line 3193): "The Let's Play filter in ui.jsx kept only the kinds older lists had before pass FS"
- MD (line 3272): "the heard list partly decided on the screen"
- ME (line 3296): "found the old pick could land on a locked lesson"
- MG (line 3488): "the read-aloud result's "Well done! That was the whole course." is still written in ui.jsx"
- MH (line 3694): "the story list decided on the screen"

### C26 code state: stale closure, race, read before declared, stored verdict (5 passes)
- MB (line 3140): "The elective count stored a verdict made as the story opened"
- MD (line 3272): "the auto-read calling the first render's toggle"
- ME (line 3312): "the test hook's effect missing moduleId"
- MH (line 3694): "failed tracings stored with a pre-reader's missed picks (privacy)"
- MI (line 3753): "wrote back the state of the moment the game opened"

### C27 a field or table nothing reads, or a tool that silently does nothing (6 passes)
- MC (line 3199): "Two tools wrote nothing when run from a folder with a space in its path"
- MF (line 3365): "the new ledger check expecting a character-note form the ledger never writes"
- MH (line 3575): "named their color `color`, which the drawing never reads"
- MJ (line 3787): "read story pictures by the wrong field"
- MK (line 3819): "it printed line.visual, which no line has"
- ML (line 3891): "the coloring levels tool, which wrote when prompts-csv imported it"

### C28 a game does not do what its words promise, or teaches nothing of its course (7 passes)
- MA (line 3065): "Connect the Dots never said a number, though the lesson says count as you go"
- MB (line 3128): "Catch the Hexagons (grade 1) had never drawn a hexagon"
- MC (line 3194): "A course with one game spent it on day one"
- MI (line 3762): "the words saying shields while the board drew ships"
- MJ (line 3793): "boxes were one gray dashed outline though the voice says "the red box""
- MK (line 3824): "promise "A wrong step turns red", while the board showed a pale peach fill"
- ML (line 3881): "taught nothing First Steps teaches"

### C29 the record misstates its source (a count, a claim, a quote) (12 passes)
- MA (line 3086): "More and Fewer's bank read 38 where this record says 20"
- MB (line 3145): "the record said every new check had been broken in a copy, and only most were"
- MC (line 3219): "a test this record claimed and nobody had written"
- MD (line 3273): "two of Mikey's quotes not verbatim"
- ME (line 3314): "What's new promising a gold book for every finished course"
- MF (line 3382): "Mikey's Q8 words misquoted in this entry"
- MG (line 3485): ""thirteen" places for cross (eleven"
- MH (line 3708): "37 situation questions in seven kinds, not 37 kinds (four places)"
- MI (line 3767): "#16201B on #AAD8C5 is 10.6 to 1, not 9.45"
- MJ (line 3800): "a CLAUDE.md line of this pass that claimed both rules read every kind"
- MK (line 3839): "RULES-AUDIT named a test of the young tile that did not exist"
- ML (line 3894): "A22 reads 118 of 230, not 229"

### C30 a test that could pass vacuously or reads less than it claims (11 passes)
- MB (line 3136): "its first check passed with the old bug back"
- MC (line 3218): "a copy of them typed into the test had passed with the strip broken"
- MD (line 3271): "tests that could pass vacuously"
- ME (line 3312): "a check that passed when the arrow merely went home"
- MF (line 3364): "counting picture elements passed with a wrong path"
- MG (line 3471): "it sat after the loop's skip for instruction lines, the bug pass MD fixed for faces"
- MH (line 3693): "question-screens checks that could not fail"
- MI (line 3761): "play-and-read's quick check answering under two seconds a question (a guess, so no celebration)"
- MJ (line 3801): "when a tap was lost under load, measured the line before its own"
- MK (line 3822): "the test had missed because it read only pictures by name"
- ML (line 3891): "the click-through's game check that dropped taps could pass"

### C31 a fix that broke something else, caught by a later read (12 passes)
- MA (line 3066): "My first dot change drew the bigger group's dots smaller, a size cue"
- MB (line 3139): "(it would have undone 144 rows)"
- MC (line 3213): "the first quiet rule silenced the one answer a question named, so silence marked the answer"
- MD (line 3267): "found the push row's explanation still saying stop, please"
- ME (line 3314): "the young ring changed on every pre-reader screen by the second read's border-radius inherit and unseen"
- MF (line 3373): "a reader's Quick Review that earned a course's last star said Back to my lessons and opened the celebration"
- MG (line 3416): "its first fix made the title a bar with no letters on screens 700 pixels and wider"
- MH (line 3576): "A scripted rewrite of the short voices dropped the long voices of 40 early questions"
- MI (line 3768): "which crashed every story screen and nothing else"
- MJ (line 3799): "the tear fix reached only the written paragraph"
- MK (line 3836): "Step on the Circles' new wrong-step wobble threw the chip out of its cell"
- ML (line 3888): "three rows round one's own wording broke"

### C32 a retired wording or changed fact lingers elsewhere (10 passes)
- MA (line 3068): "pass KF says a retired idea is searched for in every long story in the same pass"
- MB (line 3142): "(pass KF: a retired wording is searched for in the same pass)"
- MC (line 3208): "sixteen about lines still stated a removed age"
- MD (line 3273): "the report's Mastered definition carrying two texts of which the stale one won"
- MF (line 3382): "pass ME's news block still describing the arrow"
- MG (line 3485): "Georgette retired in the teens chapter and still teaching in the children's"
- MH (line 3707): "four places still described the setup line under the question"
- MI (line 3766): "answered questions still called open in docs, comments and a test"
- MJ (line 3799): "the story brief still said the moral opens [slowly, warmly]"
- ML (line 3905): "still said 454 words and "a picture can be any size", which round two had taken out"

### C33 a new rule or finding left unrecorded (audit row, earmark, For future passes) (11 passes)
- MB (line 3142): "two rules of this pass had no RULES-AUDIT row"
- MC (line 3219): "three new rules had no RULES-AUDIT row"
- MD (line 3273): "two screen findings set aside and logged nowhere"
- ME (line 3314): "the two new standing rules (the near rhymes; a re-derivation reads an explanation's words) with no RULES-AUDIT row"
- MF (line 3382): "the For future passes bullet missing CHARACTERS.md and the story brief's third rule"
- MG (line 3485): "second-read findings neither applied nor recorded"
- MH (line 3693): "two decisions unrecorded (the setup line's order, the first long story at completion)"
- MI (line 3766): "his instruction for the readers' longer Wonder voices sat only in a screens row"
- MJ (line 3799): "so a RULES-AUDIT row records them as fixes the game check asked for"
- MK (line 3839): "get a RULES-AUDIT row and a CLAUDE.md line, since a reader holds them, not a machine"
- ML (line 3894): "two notes kept only in this entry are earmarked"

### C34 an explanation hands the question back, or a composed sentence reads broken (3 passes)
- MB (line 3125): "A and B's explanations said the question back"
- MD (line 3267): "three explanations that handed the question back"
- MH (line 3553): "The older kinds' sentences read as broken English until the alignment read caught them"

### C35 Mikey's intent misread (4 passes)
- MD (line 3273): ""masters" where the code means a passed round"
- ME (line 3314): "his "skip/return back" read as skip without asking (Q22)"
- MF (line 3330): "reading the rows changed that judgment"
- MH (line 3509): "I'm assuming you mistakenly misinterpreted my text"
