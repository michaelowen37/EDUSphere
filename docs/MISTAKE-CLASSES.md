# Mistake classes

The kinds of mistake the independent checks found in passes MA to ML, read from docs/DECISIONS.md (lines 3054 to 3926) in pass MM's review of the workflow, at Mikey's word ("If you can run the entire vision, rules, decisions, claude.md etc through these ideas to improve our workflow, please do."). 35 classes, ranked by the passes a class came back in times its harm (3: false, unsafe or unfair to a child; 2: teaching quality, or a test's or a record's integrity; 1: a look, or rework). The prototype counts come from read-only scripts the review ran on pass ML's copy, and the file names are pass ML's.

How to use it: the trust pyramid (RULES-AUDIT section 9) puts a new rule first in the code, then in a test or a tool proven failing on a real past mistake, then in a brief. A class the checks find in two passes gets its check in the pass that finds it the second time (EARMARKS L16): when a pass meets one of the classes below that still waits, it builds the proposed check (or a better one), proves it failing on the evidence at the end of this file, and marks the class here. The last column says what pass MM built.

## (a) Top 15

| Class, in rank order | Passes | Strongest check in pass ML | Machine? | Proposed check | Since pass MM |
|---|---|---|---|---|---|
| 1. Unsafe scene or experiment for a young child | 10: all but MI, MK | test for pre-K 3 experiments only (tests/logic.test.mjs) and Wonder outdoors; stories, pictures: brief | partly | Read the experiments' choking list in every pre-K story paragraph and ledger row; fail a hit SAFETY_READ does not list with a reason. Prototype: 8 story hits, all already read. Near misses: "big red beads" (listed); a ball "as big as an orange". FP low; a broad hazard list hit 159 benign paragraphs. | Since pass MM, for choking: the stories test reads its list in every pre-K story and picture row, and a hit passes only with its reason in SAFETY_READ, and since round two every pre-K lesson's own lines too. Water, height, roads and night stay the briefs'. |
| 2. Wrong or overgeneralized fact | 9: all but ME, MI, MK | brief | partly | List unhedged generic sentences ("A bird has wings, so it can fly") in early lines and short voices; fail one not signed off with its source. Prototype: 200 in early lesson lines, 23 in reviewed courses. Near misses: "Many frogs are green"; "A triangle has three sides". A reading list, not a verdict. | Waiting. |
| 3. Record misstates its source (count, claim, quote) | 12: all | test, partial (tests/docs-sync.test.mjs) | yes for counts; partly for quotes | Fill every number and heading pass in HANDOFF, NEW-CHAT, RULES-AUDIT and EARMARKS from code, as tools/audit-sentences.mjs does (final reads corrected A22's hand-written count in MH, MK and ML); quote Mikey only from his saved messages. DECISIONS history is never regenerated. | Waiting. |
| 4. A fix broke something else | 12: all | brief (second reads) | partly | tools/field-diff.mjs: every data field changed since the frozen copy must be declared by the pass (MH dropped 40 long voices; MB nearly lost 144 rows); rerun every falling ceiling after each round. Near misses: a declared rewrite; a regenerated CSV. | Since pass MM, in part: tools/content-snapshot.mjs and tools/content-diff.mjs list every keyed item a pass changed since the frozen copy, outside its scope first, and the final read starts from that list (every bank read to 6,400 seeds, or to 76,800 for one of fewer than 1,000 questions). A declared list that a test holds waits. |
| 5. Citation and teaching disagree | 8: all but MF, MG, MH, MI | test, plans against citations (tests/coverage.test.mjs); brief | partly | Citations as data (taught and waiting sentences, teaching lines), "in part" generated; fail "whole" with a sentence waiting, or a taught sentence sharing no word with its line (ME's "up to five" counted to four). FP moderate; "taught" stays a judgment. | Since pass MM, in part: every pre-K quote is held to docs/standards word for word (class 9). Citations as data wait. |
| 6. Test that could pass vacuously | 11: MB to ML | brief (broken by hand in a copy) | yes | Lint: an ok() asserting an empty failure list also asserts how much it read (prototype: 147 of 227 do not, among 1,547), a falling list; and tools/mutate.mjs, mutations paired with the title each must fail. Near misses: an empty list asserted beside a count read; a fixed literal table. | Since pass MM, in part: every pre-K question's checks run again on mutants (each wrong choice as the key) and must catch every one. The ok() lint and mutations for the other checks wait. Round five: a wait's check taps as the wait lifts (a 1 ms wait had passed), and a threshold is pinned on both sides (a cue at a half or a quarter had passed). |
| 7. New rule or finding left unrecorded | 11: MB to ML | test, existence only (tests/docs-sync.test.mjs) | partly | Fail a file changed since the frozen copy but missing from For future passes, a CLAUDE.md line of this pass with no RULES-AUDIT row, a Not taken item with no earmark, Q number or reason. | Waiting. |
| 8. Heard cue gives the answer away | 7: MC MD ME MH MJ MK ML | test (tests/logic.test.mjs) | yes | Architecture: build each read-aloud reason from the tapped choice's own attributes, never free text; one test: after any wrong tap, two or more open choices fit every word heard. | In part: a reason, and since round three a question, is read as the voice says it (heardForm, SOUND_CARRIERS, speechPieces), and a letter the screen does not print counts as named; the architecture waits. |
| 9. Standard not quoted whole, verbatim, right band | 7: MA MB MD ME MJ MK ML | test for two wordings (tests/logic.test.mjs) | yes | Architecture: docs/standards/*.json holds each code's text by band, source and date; fail a quote that is not it or an exact run of its sentences. | Since pass MM, for pre-K: docs/standards keeps the published texts and the coverage test holds every pre-K quote to them. Kindergarten up waits, as each age's texts are kept. |
| 10. Asked or heard before the script says it | 7: MB MC MD ME MF MJ ML | test (tests/logic.test.mjs; tests/scripts.test.mjs) | partly | Grow scripts.test.mjs's counting phrases into a concept list (corners, takes up more room, real life) that explanations and reasons must find on a spoken line; a full vocabulary diff is noise (56, 29, 42 hits, mostly picture names). | Waiting. |
| 11. Retired wording lingers | 10: all but ME, MK | tests per wording (tests/docs-sync.test.mjs; tests/logic.test.mjs) | yes | Architecture: docs/RETIRED.json (pattern, pass, scopes, waiting ids), one test reading every scope for every entry, folding the one-off checks in. | Waiting. |
| 12. Low contrast or legibility | 10: all but MB, ME | test, dark-theme words (tests/e2e/dark-contrast.mjs; tests/scripts.test.mjs) | yes | A static test of every ink and ground pair for drawings, chips and game states in both themes (3 to 1 non-text), and a lint barring C. tokens in paper components; the misses were drawings (1.1, 1.37, 1.50). | Waiting. |
| 13. Narrator states a finding, rule or answer | 9: all but MG, MI, MJ | brief (RULES-AUDIT: doc only) | partly | Stories have no quotation marks, so no machine tells narration from speech: mark speech in the data, then fail narration exclaiming an answer word or stating a present-tense rule. Prototype: 11 in reviewed courses, the narrator's "A match!" (The other mitten) beside Grandma's untagged "Let's find more!". Near misses: "Leo ran out to play"; "Mom said to count". | Waiting. |
| 14. More settled by look | 6: MA MB MF MH MJ ML | test (tests/logic.test.mjs, regex; tests/e2e/question-screens.mjs; tests/e2e/scroll-cue.mjs) | yes | The regex needs a size word, so "The cookie bowl had more" (MJ) and "the longer row has more" (MF) passed; flag any container or row that has more with no count in its sentence, and check one dot size on every comparison picture. | Waiting. |
| 15. Moral out of step with the spoken lesson | 8: all but ME, MG, MI, MK | none (story brief; MB declined a test) | partly | A moral shares 80 percent of its content words with readAloudScript, exceptions falling. Prototype: 7 of 39 reviewed morals fail, 46 of 161 elsewhere. Near misses: "Same shape, same hole." (listed); Who Said That?'s deliberate paraphrase. | Since pass MM: the stories test holds every read-aloud module story's moral to its script (a sentence of four words or more word for word, or four in five of its content words), the reviewed paraphrases kept by name and the rest waiting by name. |

## (b) The other classes

- Words a child hears wrongly or was never taught (8: MC MD ME MF MG MH MJ ML; tests/logic.test.mjs; tests/stories.test.mjs): one lexicon over all early heard text.
- Wonder voice off its person or repeating another (8: MA MB MF MG MH MJ MK ML; tests/logic.test.mjs): flag shared content and borrowed frames (prototype: 7 pairs, 3 borrowings, about half real).
- Layout that does not fit (9: MA MB MD ME MF MG MH MI ML; tests/e2e/question-screens.mjs): one overflow and next-control sweep at four sizes.
- Checked in one condition only (7: MB MC ME MG MH MI MK; brief): one browser harness across theme, motion and width, with a voice that reports speaking. Since pass MM the lesson cue's check reads both themes (written for the light one first, it passed the old code, since the lines it was wrong on were the dark theme's), Find the Letter's waits are checked with a voice that never ends a line, and the checks have been run from a folder with a space in its path.
- A person's look missing or changing (7: MD MF MG MH MJ MK ML; tests/ledger.test.mjs): a LOOKS table per story, held verbatim in each row.
- Folded prompt says the wrong thing (7: MC ME MF MG MJ MK ML; tests/ledger.test.mjs): an explicit people field per row.
- Even, clipped or repeated runs (7: MA MB MC MD ME MK ML; tests/stories.test.mjs): add repeated first words.
- Game not doing what its words promise (7: MA MB MC MI MJ MK ML; tests/logic.test.mjs; tests/e2e/drag.mjs): each promise phrase mapped to a browser assertion.
- Audio tags off the floor (6: MB ME MH MJ MK ML; tests/stories.test.mjs): sound tags name sounds the words name. Since pass MM the stories test counts each story's sound effects, one to three (a tag that names a thing making its sound).
- Cast canon contradicted (6: MA MC MF MG MH MI; tests/stories.test.mjs): CHARACTERS as data.
- Line and picture disagree (6: MB MC MD ME MK ML; tests/scripts.test.mjs): every named thing drawn, not one shared word.
- Field nothing reads, or a silent tool (6: MC MF MH MJ MK ML; tests/logic.test.mjs): a key schema per picture kind (507 pairs over 105 kinds) naming the nearest key. Since pass MM the rules test parses every tool, reads one course's packet for each lesson's example drawing (it read a field no example has), and fails a test or tool that makes a file path from a URL's pathname (a folder with a space in its path, as in pass MC).
- Light theme changed unrecorded (5: MG MH MJ MK ML; doc): a pixel diff, each change tied to a RULES-AUDIT row.
- Wrong choice a child could fairly call right (5: MB MD ME MH ML; tests/logic.test.mjs): one ALSO_FITS table for every generator.
- Rule decided on the screen (5: MC MD ME MG MH; tests/scripts.test.mjs): lint ui.jsx filtering course, story or event lists.
- Code state: stale closure, race, stored verdict (5: MB MD ME MH MI; tests/scripts.test.mjs): a hooks dependency lint.
- Surface shortcut or surface variety (4: MA MB MC ML; tests/logic.test.mjs): fail a kind a trivial strategy answers 95 percent of the time. Prototype: grade 1's ql1-fact always puts its answer in the middle. Since pass MM the rules test fails a bank whose answer sits in one place 95 percent of the time over 300 seeds, and lists by name the banks whose answer never changes, and those whose answer leans to one place, 70 percent with two choices or 55 with more (EARMARKS A31); and a read-aloud question never prints the letter it asks for while the voice can say it (printedQuestion).
- Red against green (3: MB MK ML; tests/logic.test.mjs): every grade, and game states by lightness.
- Explanation hands the question back (3: MB MD MH; tests/logic.test.mjs): flag one whose content words all sit in its prompt.

## (c) Judgment that stays in the briefs

Mikey's intent misread (4: MD ME MF MH), and the verdicts behind the lists above: a fact beyond its shape (dates, sources, product steps), water, height and night in a scene, whether a moral or a citation truly teaches, a story's turn, a Wonder voice's depth, a picture's framing, visual regressions.

## (d) Regressions, and what tests changed

The same fix more than once: answer-leaking reasons, five patches in four passes (MH, MJ, MK twice, ML); unequal dots in the long row and size trap (MA, MH, ML); a check placed after its loop's skip (MD, MG); ink on the dark theme's paper (MA, MD, MH, MI, MJ); the tag floor (five tags in MH and MJ; loosened and restored within ML); speak()'s retry, logged in MD, declined in MG, heard by Mikey in MI ("Blue, blue") since the test voice never reported speaking.

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

### C14 words a young child hears wrongly or was never taught (8 passes)
- MC (line 3217): "TEA and SEA, which sound like the letters T and C, left the sign words"
- MD (line 3269): ""almost grabbed the ball and ran off" heard as running off"
- ME (line 3309): ""found more. Moon and spoon." heard as a spoon found on the path"
- MF (line 3367): "a garden path in sexual-health-6's first paragraph"
- MG (line 3476): "and the word cross, which no early lesson teaches"
- MH (line 3695): "bee, heard as the letter B, taken out of A and B"
- MJ (line 3792): ""at recess" is "at playtime" (a pre-K word)"
- ML (line 3879): "Bea became Lucy (a voice says Bea as bee"

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

### C19 an unsafe scene or experiment for a young child (10 passes)
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

### C24 checked in one condition only (width, motion, voice, frame, cap) (7 passes)
- MB (line 3115): "every check of it ran at phone width"
- MC (line 3217): "the pass's own screenshots used reduced motion, which holds the wash at its yellow end"
- ME (line 3312): "the celebration skipped on a two-review day"
- MG (line 3415): "with motion off the drifting rainbow froze on its first color, the gold end"
- MH (line 3534): "The screen check measured contrast, the fold and overlaps, mostly at phone width"
- MI (line 3747): "The test page's voice never reported speaking, so no test had seen it"
- MK (line 3836): "round one's screenshots were all taken with motion off"

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
