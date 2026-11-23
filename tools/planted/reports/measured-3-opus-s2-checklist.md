(Saved word for word by the lead as it arrived, about 11:03 PM CST, November 22, 2026: lesson-read-3, Opus 5.5, copy lr-a (seed 2), checklist form. Harness count 614,845 tokens (its last context), 107 tool uses, about 42.1 minutes. Its note: the harness refused its write to /tmp/lesson-read-3/report.md, so it gave the report as text; its working notes are in /tmp/lesson-read-3/notes.md. Its summary, before the report: "I read all 24 modules (120 banks, 2,000 seeds each, alone and in rounds). There are 22 MUST FIX. The worst: feelings-show tells a child "tight fists can show you feel scared". voice-tells-more asks for eye contact, and its yes or no bank leans Yes at 70 percent. two-steps marks foot-tapping wrong. red-and-blue says "The sea is always blue". please-and-thank-you marks "Thanks" wrong. Several banks can be answered without understanding them: two phrases answer four talk-about-it banks 100 percent, and "and"/"but" or the first word answer others. All quotes and plan rows check out.")

# Lesson read, round 3: report

Read list: the 24 modules of READ-LIST-lesson.md (120 bank reads, 2,000 seeds each, alone and in rounds with tools/blind-read.mjs --rounds). Brief: docs/INDEPENDENT-CHECKS.md 237-275 holds items 1 to 27 only; items 28 to 31 and the pass NV note sit at 277-282, and I read them too, so the brief's named range should be 237-282. How 58-75 and CLAUDE.md with its parts two and three read whole. Quotes were checked by my own script against docs/standards, and every module's citations against its plan rows in src/curriculum.mjs both ways (all 24 match). docs/DECISIONS.md is not in this copy, so nothing that item 13 says goes in DECISIONS could be read. The 744 table lines the checklist asks for take this report past the brief's 3,000 words; the findings above them are kept short.

## Strongest objection

Feelings and what we do teaches a wrong fact. On "How might Rosa feel when her hands make tight fists?" (p4-feel-tells, seed 1, all 262 of 2,000 such questions), a child who taps the sad face hears "The sad face has a tear rolling out, and tight fists can show you feel scared." Line 2, the explanation and More right answers all say tight fists show mad. A close second: My voice tells more asks "do you look in their eyes?" and marks No wrong, against the house rule to turn toward a person.

## MUST FIX

1. **feelings-show, p4-feel-tells, the tight-fists row (seed 1).** The sad face's reason names scared. Fix: "...and tight fists can show you feel mad." (items 3, 4, 7)
2. **voice-tells-more, p4-tone-yesno.** (a) "When you talk with a doctor you have just met, do you look in their eyes?" (Yes, seed 4) asks for eye contact, where item 2 (pass MO) has a child turn toward a person, and line 10 and the II.C.1 citation say "turn toward them". Its No reason ("you look away") also makes looking away wrong (NV note). (b) Yes answers 5 of 7 rows: 70.0 alone, 71.8 in doses. Fix: make that row "...do you say your words very fast?" (No), explaining "Say your words slowly and clearly, and turn toward them." Turn "Can the same words ask or tell?" into "Do the same words always tell?" (No). That leaves 3 Yes and 4 No. (items 2, 18)
3. **two-steps, p3-steps-yesno, "Is it okay to tap your feet while you listen to both steps?"** (No, seed 9). No line says to keep your feet still, and the row marks wrong a child who moves in order to listen. Fix: "Tap the moon, and then tap the sun. Do you tap the moon first?" (Yes), and "Do you listen to both steps before you start?" becomes "Do you start before you hear both steps?" (No). (items 2, 9, 14, 23)
4. **red-and-blue, line 5 and paragraph 3: "The sea is always blue".** This is untrue, and it repeats as More right answers on every blue row of p3-tap-red-blue and p3-which-colour. Fix: "The sea is often blue". (items 4, 17, 29)
5. **please-and-thank-you, pk3-magic-word, "What do you say when someone hands you a cracker?"** (seed 30). "Thanks" is marked wrong with the reason "Saying thanks does not show you are glad". Fix: use the foil "Nothing", with the Grandma row's reason. (items 2, 4, 7, 11, 17)
6. **good-friend, p4-when-grownup, "Should you get a grown-up when you want to play blocks and your friend wants to play ball?" and "...when you and your friend can find a game you both like?"** (both No, seeds 20 and 18). "Should... No" teaches that getting help is wrong, where line 10 says only "you do not need to". Fix: "Do you need a grown-up when...?" (items 2, 14)
7. **people-and-events, p3-people-yesno.** (a) The reason for No on "Is a baby very little?" (seed 7) is "No would mean a baby cannot drink milk from a bottle". Fix: "No would mean a baby is not very little, but a baby is very little." (b) Yes answers 5 of 8 rows: 61.1 alone, 63.7 in first rounds and Quick Reviews. Fix: "Is a grandpa a grown-up?" becomes "Is a grandma very little?" (No). (items 7, 11, 18)
8. **things-we-do, p4-act-yesno, "At art time, do you draw with it?"** (seeds 18 and 27). The question has no picture, so "it" names nothing. Fix: "...do you draw with a crayon?", with the same words in its reason. (items 2, 8, 29)
9. **which-came-first, line 5, "Listen again. Quack, then meow. Now the duck came first."** It shows the cat alone. Fix: show the pair, duck then cat. (items 3, 10)
10. **talk-about-it, p3-talk-say-back, p3-talk-why, p3-talk-about-yesno, p3-talk-feel.** The lesson's two off-topic replies, "I want a glass of water." and "I like pizza.", always play the wrong part. A child who knows only those two phrases scores 100.0 on all four banks without hearing the friend. Fix: let each on-topic reply be another row's off-topic choice ("I like your tower!" after the hat), add such lines to the script, and deal them evenly. (items 16, 23, 25, 28, 31)
11. **how-friends-feel, p4-same-or-different.** Every "same" row joins the two feelings with "and" and every "different" row with "but" (1,987 and 2,013 of 4,000 seeds), so the conjunction gives the answer. Fix: use "and" in every row, as the explanations do. (items 13, 25)
12. **voice-tells-more, p4-tone-ask.** Every asking row is an inverted question ("Do you have a dog?", "Is it raining?"), so the first word answers 2,000 of 2,000 without the voice. Line 3 teaches that the same words ask or tell. Fix: make the asking rows "You have a dog?", "It is raining?", "The cat is asleep?" and "It is time for lunch?", said rising, and do the same for p4-tone-which's choices. (items 13, 16, 26)
13. **things-that-happen, p3-event-what, p3-event-tap and p3-event-name.** Echoes by sound that the rules test cannot hear: snowy and snow, rainy and rain, bedtime and bed. A child who taps the choice heard inside the question scores 66.9, 66.9 and 73.4 (three choices, limit 42), one rule answering three banks. ECHO_WAITS holds only p3-event-name, at 2. The same echo, bedtime and bed, gives 46.7 on things-we-do's p4-act-use. Fix: record each in ECHO_KEPT with its reason and a bound, or ask those rows by another sign the script says. (items 13, 25, 26, 28)
14. **circle-and-square, p3-shape-by-corners and p3-shape-thing.** The round answer is right on 1,332 and 1,311 of 2,000, so tapping the round one reads 66.6 and 65.5 (two choices, limit 56). The tool reads the circle and the little circle apart and shows 58.9. Fix: deal the corner rows as often as the round rows, and "Tap the one that rolls." at one row's weight (it holds 643 of 2,000). (items 25, 26)
15. **say-it-to-fit, p4-fit-voice.** "A big outside voice" is the wrong choice in 5 of 6 rows, so never tapping it reads 84.4. Fix: deal "A whisper" as the doctor's and the classroom's wrong choice (line 6, "not too soft"), and the playground row as often as the others. (items 16, 25)
16. **say-it-to-fit, p4-fit-enough.** The answer is the longer choice on every seed (always the knee: 82.2). Fix: add a wrong choice as long as the answer that tells neither where nor what happened: "It hurts, and I feel sad." (items 17, 25)
17. **match-the-vehicles, pm-tap-vehicle** (all rows, seed 1). With two choices still open, a wrong tap hears "...and a boat goes on the water.", the answer's sign. This is item 7's "and a snail is tiny" case. Its sister bank pm-vehicle-where hears "Not that one." Fix: say only what the tapped one is, or "Not that one." (item 7)
18. **feelings-show, p4-feel-say.** Its wrong choices are feelings a child could fairly have in the moment: "I feel sad" when a friend takes your crayon (seed 8), and "I feel mad" when your tower falls (seed 7). Also "I feel happy" is never a wrong choice (62.4 to 63.1). Fix: give the wrong choices as thunder sad, best friend sad, dog mad, Grandma mad, teddy happy, tower scared, crayon happy, toy scared, so each phrase answers two rows and is wrong in two. (items 2, 26)
19. **how-friends-feel, p4-new-feeling-moment.** Each of its 6 rows has one fixed wrong face, and worried answers 3 rows: 67.5 alone, 68.4 in first rounds and reviews. This is not by design, since worried is a wrong choice in one row. Fix: deal each row's wrong face from its fair set (happy, mad, or embarrassed against worried), keeping P4_NEAR_FACES apart. (items 2, 26, 27)
20. **Yes share outside 40 to 60** (item 18; A178's "held between 40 and 60 percent alone and in rounds"): p3-event-yesno 65.2 to 68.4, p4-good-yesno 59.5 to 60.2 and p3-join-yesno 56.6 to 60.1 (p4-tone-yesno and p3-people-yesno are above). Fixes: "Do you sleep in your bed at bedtime?" becomes "Do you blow out candles at bedtime?" (No). In p4-good-yesno, "Is it kind to say what the problem is" (the lesson never calls this kind) becomes a No row on a non-example in the script. In p3-join-yesno, drop one of the two asking rows.
21. **things-we-do, line 5.** "Lunchtime" is said "like a big, sleepy giant" in a lesson that sets lunchtime against bedtime's sleep and offers "Sleep" as wrong at lunchtime. Fix: "like a big, hungry giant". (item 15)
22. **patterns, pp-which-repeats.** More right answers on all 984 Yes questions of 2,000 is "Say each one out loud, and listen for the part that comes back.", a method. Fix: "Circle, square, triangle, circle, square, triangle repeats the same way each time, so it is a pattern." (item 9)

## SHOULD CONSIDER

1. **Naming the picture asked about.** "Tap the one that is the same color as this yellow one." (pc-same-colour), "...the same shape as this square" (p3-same-shape-any-size) and "...the same as this boat" (pm-same-vehicles) let the heard word answer (item 2). EARMARKS L11 records this merged wording, so this is a conflict for the lead to settle.
2. **A178 is not yet done for nine banks on this list**, each still at its one-word wait: p4-good-yesno 80.5 ("i"), p4-friends-yesno 85.7 ("do"), p4-feel-okay 85.2 ("mad"), p4-tone-yesno 85.4 ("sad"), p3-join-yesno 87.1 ("tower"), p3-steps-yesno 83.7 ("tap"), p3-help-yesno 85.7 ("sad"), p4-fit-yesno 89.0 ("can") and p3-event-yesno 84.4 ("when"). A179: every triple dose deals two or more rows of each yes or no bank; p4-good-yesno's spill topic comes both ways in 467 of 1,500 doses, p4-plan-yesno's blocks and pretend play in 172, and p4-when-grownup's fight in 86 (where "Can you... fix the problem together when... you cannot stop it?" also answers itself). Rows that ask about ability or assume their answer: "Can pretend play have a plan too?", "Can you take turns talking with your teacher too?", "Can you ask a friend how they feel?", and p4-fit-yesno's "can you" rows.
3. **Same-choice leans over the limit, not by design (a right answer is wrong elsewhere).** p3-help-who 70.7 (sad), p3-join-face 61.5 (sad), p4-friend-feels 60.8 (happy), p4-feel-tells 57.2 (mad is wrong once, happy three times: make Nia's wrong choice mad), p4-feel-okay 58.1, p4-friends-yesno 58.3 and p3-help-yesno 57.9 (Yes), pk-turn-or-share 58.4 ("Taking turns" always first, answering 4 of 7 rows: add a sharing row), p4-act-when and p4-act-use 45.2 (Read and the book), pc-colour-of-thing 45.1 (green), pc-different-colour (the odd one is blue or yellow on 1,351 of 2,000; reading without the #2 tag gives 47.7), pk-helper-scene 42.8 and p3-people-who 43.6. Where the fair lists force the lean, record the bound (item 27); otherwise balance the answers and wrong choices. p4-feel-does (57.2) and p4-feel-calm (57.8) sit at the 0.5 + 0.5/k floor for 8 and 7 rows.
4. **Wrong choices that never change, to record (item 13):** the bus (Kick and Cut, 249 each), the park (Sleep and Cut; the bed and the scissors), the track (the boat and the rocket), the road (the rocket and the boat), the colors of fruit, p3-people-who's doctor and teacher rows, and p4-fit-why.
5. **Words and scenes a script never says (items 2, 13, 23).** p4-kind-words "in front of the class"; p4-new-feeling-moment class, doctor, Grandma and giggle (and "call your teacher Grandma" offers worried, which a child could fairly feel there); p4-play-part's bus, store, tea party and picture scenes (no line asks "Who...?"); ck-which-helper "treats"; good-friend's reasons "every feeling is okay to have" and "calls your friend a name", and wrong choices met first in practice (Stop crying!, Go away., Grab the ball); p3-help-ball "share the ball"; pk-turn-choice in pre-K 3, where the crayons, the blocks and "share... at the same time" are said only in pre-K 4's Taking turns (join-in-play's "sharing is taught in Please and thank you" rests on a line that only names sharing).
6. **More right answers (item 9):** p4-friend-feels' puppy row is a moral; p4-new-feeling-moment's rows 2 and 3 give the answer face's signs; p3-shape-thing's "wheel" is never said.
7. **voice-tells-more:** "Happy. The voice was quick..." and line 8's "In a quick voice going up high" claim pace, where the code's own note (logic.mjs, about line 40951) says the lessons claim a happy voice's pitch alone (item 16).
8. **say-it-to-fit:** the library setup's "where others read their books" carries the answer's reason (item 16).
9. **p3-two-at-once:** "at the same time" is said one sound after the other, and the prompt names the sound (question alone 100), so it asks what p3-animal-sound asks (item 23).
10. **Citations.** match-the-vehicles' P-SCI 3 in part omits "With increasing independence" (items 1, 17). Form: voice-tells-more keeps the outcomes' final periods; help-a-friend's I.C.5 and red-and-blue's V.D.1 have no since-clause; help-a-friend's I.D.1 wait and which-came-first's II.D.1 expressive half name no earmark; things-we-do's II.D.1 names no home for describing words.
11. **Smaller points.** good-friend's spill explanation restates its answer (item 24), and "Is it kind to say, it is okay, I spill too?" drops its scene (item 8). taking-turns line 7, "drive you up the wall", is an idiom a four-year-old may take literally (CLAUDE.md plain words). colours line 5, "like many frogs", has no picture (item 10). pm-same-vehicles' reasons say where a vehicle goes, not its parts (item 7). p3-help-kind's "something soft to hold" points at the teddy (item 13).

**Marks I judge by design**, for the lead to add as entries (How item 4): pk-turn-choice 78.7 to 78.9 (Take turns answers 4 of 7 rows, and the two kind acts are never set against each other; this holds in taking-turns and in please-and-thank-you); pk3-magic-word 75.5 to 75.7 (Please and Thank you answer 5 rows each and are never wrong choices; 75 by arithmetic); ck-good-choice 67.2 to 67.5 (3 rows, 66.7 by arithmetic); pk-while-waiting 66.8 to 67.3 (3 answers in 3 places each, 66.7). The picture-only 100s on 15 banks and p3-talk-topic's story-only 100 are the question itself, not a habit.

## CLEAN

Every quote in the 24 modules' citations matches docs/standards in the edition and age band it names, and every module's citations and plan rows match both ways. The say-it-together games keep Mikey's shape, ending on the word, on the 30 words played. Red never stands beside green except where A11 exempts it. P4_NEAR_FACES pairs are never set against each other in p4-new-feeling-face. The talk lessons ask a child to turn toward a friend, and say "Children listen in different ways". Babies are held or asleep. Hugs are asked for first. "Get a grown-up" is never the wrong choice outside MUST FIX 6. The pattern banks never call a repeating row "No" (4,000 seeds). Answer places are near even in every bank, pk-turn-or-share aside.

## Tables

Key: na-L means no letters, letter names, beats or word sounds in the lesson; na-V means the lesson teaches no voice; na-G means no grammar or sentence forms; na-W means the lesson cites no vocabulary code (II.D.1, II.D.2, P-LC 6, P-LC 7); na-S means no story bank; na-Y means the lesson has no yes or no bank and no counting.

### good-friend
| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | quotes match; P-SE 4 in part matches E13 |
| 2 | defect | "Should you get a grown-up...?" (No); "in front of the class" untaught |
| 3 | defect | p4-help-friend's spill explanation restates the answer |
| 4 | fine | asking first agrees with kindergarten's My space |
| 5 | fine | P-SE 4's third sentence is in E13 |
| 6 | fine | answer places 1013/987 |
| 7 | fine | a reason for each wrong choice; two choices |
| 8 | defect | "it is okay, I spill too?" has no scene |
| 9 | defect | wrong choices met first in practice (Stop crying!, Grab the ball) |
| 10 | fine | no receptive code; the friend pairs |
| 11 | fine | its Taking turns pointers are true |
| 12 | fine | 2027 PK4 codes |
| 13 | fine | no echo the test misses |
| 14 | defect | getting help taught as wrong (MUST FIX 6) |
| 15 | not applicable | na-W |
| 16 | not applicable | na-V; wrong choices vary by row |
| 17 | not applicable | na-G |
| 18 | defect | p4-good-yesno 59.5 Yes; a fight row answers itself |
| 19 | not applicable | na-L |
| 20 | not applicable | na-L |
| 21 | fine | each kind worked in lines 1 to 11 |
| 22 | not applicable | na-L |
| 23 | defect | "class" is never said |
| 24 | fine | the explanations give the way |
| 25 | fine | the kind act is the lesson |
| 26 | fine | three by-design entries; Yes 52.0 |
| 27 | defect | p4-good-yesno 60.2 in rounds; spill topic in 467 doses |
| 28 | fine | no letters |
| 29 | fine | one answer each |
| 30 | defect | reasons use words the script never says |
| 31 | fine | no picture plays one part every time |

### things-we-do
| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | II.D.1 and P-LC 6 in part (E13) |
| 2 | defect | "draw with it" has no picture |
| 3 | fine | every answer said and drawn |
| 4 | fine | acts as children live them |
| 5 | fine | E13 |
| 6 | fine | places even |
| 7 | fine | reasons name the tapped one's act |
| 8 | defect | "it" names nothing |
| 9 | fine | silly questions shown first (lines 9, 10) |
| 10 | fine | receptive half cited |
| 11 | fine | reading never wrong at bedtime |
| 12 | fine | 2027 codes |
| 13 | defect | bedtime and bed by sound; fixed wrong choices not recorded |
| 14 | fine | nothing unsafe |
| 15 | defect | lunchtime said like a sleepy giant |
| 16 | not applicable | na-V |
| 17 | not applicable | na-G |
| 18 | fine | Yes 49.7 |
| 19 | not applicable | na-L |
| 20 | not applicable | na-L |
| 21 | fine | modeled in lines 4 and 9 to 11 |
| 22 | not applicable | na-L |
| 23 | fine | all words said |
| 24 | fine | the lesson's pairings |
| 25 | defect | Read and the book 45.2 |
| 26 | defect | not by design (a wrong choice at art time) |
| 27 | fine | rounds as alone |
| 28 | fine | one echo, one bank |
| 29 | defect | "it" has no referent |
| 30 | not applicable | na-S |
| 31 | fine | line 4 asks its question |

### how-friends-feel
| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | I.D.1 whole; P-SE 6 names prompting |
| 2 | defect | near-face pairs called different |
| 3 | fine | reasons in whole sentences |
| 4 | fine | true claims |
| 5 | fine | E13 |
| 6 | fine | places even |
| 7 | fine | sign-based reasons |
| 8 | fine | one sentence each |
| 9 | defect | a moral and face-sign tips |
| 10 | fine | faces named by their lines |
| 11 | fine | P150, P151 |
| 12 | fine | 2027 codes |
| 13 | defect | "and" and "but" give the answer |
| 14 | fine | nothing unsafe |
| 15 | not applicable | na-W |
| 16 | defect | one fixed wrong face per row |
| 17 | not applicable | na-G |
| 18 | defect | p4-friends-yesno 58.3; an ability row |
| 19 | not applicable | na-L |
| 20 | not applicable | na-L |
| 21 | fine | lines 0 to 10 |
| 22 | not applicable | na-L |
| 23 | defect | class, doctor and giggle unsaid |
| 24 | fine | worked in lines |
| 25 | defect | the conjunction |
| 26 | defect | worried 68.4; happy 60.8 |
| 27 | defect | the same in rounds |
| 28 | fine | no letters |
| 29 | fine | one answer each |
| 30 | not applicable | na-S |
| 31 | fine | answer faces vary |

### feelings-show
| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | I.B.2.a and b whole; three codes in part |
| 2 | defect | crayon: sad; tower: mad (fair feelings) |
| 3 | defect | the tight-fists reason |
| 4 | defect | contradicts line 2 |
| 5 | fine | E13 |
| 6 | fine | places even |
| 7 | defect | a reason untrue for its picture |
| 8 | fine | one sentence each |
| 9 | fine | non-examples on line 6 |
| 10 | fine | P148, P149 |
| 11 | fine | drawn as said |
| 12 | fine | 2027 codes |
| 13 | fine | no answer-only echo |
| 14 | fine | grown-up for the biggest feelings |
| 15 | not applicable | na-W |
| 16 | not applicable | na-V |
| 17 | not applicable | na-G |
| 18 | defect | p4-feel-okay 58.1 Yes |
| 19 | not applicable | na-L |
| 20 | not applicable | na-L |
| 21 | fine | each kind modeled |
| 22 | not applicable | na-L |
| 23 | fine | words said |
| 24 | fine | explanations give the way |
| 25 | fine | no other pattern |
| 26 | defect | "I feel happy" 63.1; mad 57.2 |
| 27 | defect | the same in rounds |
| 28 | fine | no letters |
| 29 | fine | one answer each |
| 30 | fine | reasons in the lesson's words |
| 31 | fine | no single-part picture |

### animal-sounds
| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | three codes in part (E12) |
| 2 | fine | answers right |
| 3 | fine | six animals said and drawn |
| 4 | fine | "many have a sound" |
| 5 | fine | E12 |
| 6 | fine | places even |
| 7 | fine | "says meow, not ribbit" |
| 8 | fine | one sentence each |
| 9 | fine | modeled first |
| 10 | fine | P101 |
| 11 | fine | no bear "near" |
| 12 | fine | 2027 codes |
| 13 | fine | none |
| 14 | fine | the bear kept away |
| 15 | fine | the game on six sound words |
| 16 | not applicable | na-V |
| 17 | not applicable | na-G |
| 18 | not applicable | na-Y |
| 19 | not applicable | na-L |
| 20 | not applicable | na-L |
| 21 | fine | order modeled on line 8 |
| 22 | not applicable | na-L |
| 23 | defect | "at the same time" is never heard |
| 24 | fine | modeled |
| 25 | fine | wrong choices vary |
| 26 | fine | picture-only 100 is the question |
| 27 | fine | rounds near chance |
| 28 | fine | no letters |
| 29 | fine | one answer each |
| 30 | not applicable | na-S |
| 31 | fine | each animal plays both parts |

### play-with-a-plan
| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | I.C.4 whole; P-SE 4 matches E13 |
| 2 | fine | answers right |
| 3 | fine | the plan is said |
| 4 | fine | true |
| 5 | fine | E13 |
| 6 | fine | places even |
| 7 | fine | a reason for each |
| 8 | fine | sentences |
| 9 | fine | the non-example on line 6 |
| 10 | fine | P156 |
| 11 | fine | pointers true |
| 12 | fine | 2027 codes |
| 13 | fine | none |
| 14 | fine | safe |
| 15 | not applicable | na-W |
| 16 | not applicable | na-V |
| 17 | not applicable | na-G |
| 18 | defect | "too" assumes Yes; topics asked both ways |
| 19 | not applicable | na-L |
| 20 | not applicable | na-L |
| 21 | defect | "Who...?" not modeled for new scenes |
| 22 | not applicable | na-L |
| 23 | defect | bus, store and tea party unsaid |
| 24 | defect | p4-play-part's kind is worked only for the house |
| 25 | fine | 50/50 |
| 26 | fine | two by-design entries |
| 27 | defect | blocks and pretend play in 172 doses |
| 28 | fine | no letters |
| 29 | fine | one answer each |
| 30 | not applicable | na-S |
| 31 | fine | parts swap |

### voice-tells-more
| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | II.C.2 whole (turns); II.C.1 in part |
| 2 | defect | asks for eye contact |
| 3 | fine | examples said as described |
| 4 | defect | happy "quick" against the code's note |
| 5 | fine | E13 |
| 6 | fine | places even |
| 7 | fine | reasons by pitch |
| 8 | fine | sentences |
| 9 | fine | modeled first |
| 10 | fine | P171 |
| 11 | fine | drawn as said |
| 12 | fine | 2027 codes |
| 13 | defect | Is and Do answer p4-tone-ask |
| 14 | fine | safe |
| 15 | not applicable | na-W |
| 16 | defect | a pace claim; asked by words, not by ear |
| 17 | fine | turns of the child's own (lines 5, 9) |
| 18 | defect | Yes 70.0 to 71.8 |
| 19 | not applicable | na-L |
| 20 | not applicable | na-L |
| 21 | fine | turns end their lines |
| 22 | fine | turns are not praised |
| 23 | fine | never loudness alone |
| 24 | fine | modeled |
| 25 | defect | the first word |
| 26 | defect | 100 by the first word |
| 27 | defect | 71.8 in doses |
| 28 | fine | no letters |
| 29 | fine | one answer each |
| 30 | not applicable | na-S |
| 31 | fine | print as said |

### taking-turns
| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | eight codes in part, each pointed |
| 2 | fine | answers right |
| 3 | fine | P120, P142 to P145 |
| 4 | fine | true |
| 5 | fine | E13 |
| 6 | defect | "Taking turns" always first, 58.4 |
| 7 | fine | a reason for each |
| 8 | fine | one sentence each |
| 9 | fine | shown first |
| 10 | fine | lines named |
| 11 | fine | drawn |
| 12 | fine | 2027 codes |
| 13 | fine | none |
| 14 | fine | safe |
| 15 | not applicable | na-W |
| 16 | not applicable | na-V |
| 17 | not applicable | na-G |
| 18 | not applicable | na-Y |
| 19 | not applicable | na-L |
| 20 | not applicable | na-L |
| 21 | fine | modeled |
| 22 | not applicable | na-L |
| 23 | fine | words said |
| 24 | fine | modeled |
| 25 | fine | the kind act is the lesson |
| 26 | fine | three marks by design (above) |
| 27 | fine | rounds as alone |
| 28 | fine | no letters |
| 29 | fine | one answer each |
| 30 | not applicable | na-S |
| 31 | fine | worked |

### join-in-play
| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | I.C.3 whole; P-SE 3 in part; P-SE 4 whole |
| 2 | fine | watching first is never a wrong choice |
| 3 | fine | P146, P147 |
| 4 | fine | true |
| 5 | fine | E12 |
| 6 | fine | places even |
| 7 | fine | a reason for each |
| 8 | fine | sentences |
| 9 | fine | shown first |
| 10 | fine | lines named |
| 11 | defect | its sharing pointer rests on a line that only names sharing |
| 12 | fine | 2027 codes |
| 13 | fine | ECHO_WAITS holds p3-join-how |
| 14 | fine | safe |
| 15 | not applicable | na-W |
| 16 | not applicable | na-V |
| 17 | not applicable | na-G |
| 18 | defect | Yes 60.1 in rounds |
| 19 | not applicable | na-L |
| 20 | not applicable | na-L |
| 21 | fine | modeled |
| 22 | not applicable | na-L |
| 23 | fine | words said |
| 24 | fine | modeled |
| 25 | fine | none |
| 26 | defect | sad 61.5 in p3-join-face |
| 27 | defect | the same in rounds |
| 28 | fine | no letters |
| 29 | fine | one answer each |
| 30 | not applicable | na-S |
| 31 | fine | worked |

### two-steps
| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | II.A.2 and P-ATL 8 whole |
| 2 | defect | the feet row is untaught |
| 3 | fine | every step drawn |
| 4 | fine | true |
| 5 | fine | none waiting |
| 6 | fine | top-left order not marked |
| 7 | fine | "the second step, not the first" |
| 8 | fine | sentences |
| 9 | defect | the feet rule is met first in practice |
| 10 | fine | numbered taps shown |
| 11 | fine | drawn |
| 12 | fine | 2027 codes |
| 13 | fine | none |
| 14 | defect | marks a child who moves to listen wrong |
| 15 | not applicable | na-W |
| 16 | not applicable | na-V |
| 17 | not applicable | na-G |
| 18 | fine | Yes 51.2 |
| 19 | not applicable | na-L |
| 20 | not applicable | na-L |
| 21 | fine | line 6 models numbering |
| 22 | not applicable | na-L |
| 23 | defect | "feet" is never said |
| 24 | fine | modeled |
| 25 | fine | none |
| 26 | fine | not marked |
| 27 | fine | not marked |
| 28 | fine | no letters |
| 29 | fine | one answer each |
| 30 | not applicable | na-S |
| 31 | fine | worked |

### colours
| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | three codes in part; VI.B.1 whole |
| 2 | defect | pc-same-colour names its color (L11) |
| 3 | fine | P102 to P105, P135, P136 |
| 4 | fine | "many" hedges |
| 5 | fine | E13 |
| 6 | fine | A11 exemption recorded |
| 7 | fine | "Not that one." heard where due |
| 8 | fine | sentences |
| 9 | fine | shown first |
| 10 | defect | "like many frogs" has no picture |
| 11 | fine | no green banana |
| 12 | fine | 2027 codes |
| 13 | defect | the color named; fixed wrong choices |
| 14 | fine | safe |
| 15 | fine | the game on four colors |
| 16 | not applicable | na-V |
| 17 | not applicable | na-G |
| 18 | not applicable | na-Y |
| 19 | not applicable | na-L |
| 20 | not applicable | na-L |
| 21 | fine | modeled |
| 22 | not applicable | na-L |
| 23 | fine | words said |
| 24 | fine | modeled |
| 25 | defect | the odd color is blue or yellow on 1,351 |
| 26 | defect | green 45.1 |
| 27 | fine | as alone |
| 28 | fine | no letters |
| 29 | fine | one answer each |
| 30 | not applicable | na-S |
| 31 | fine | worked |

### help-a-friend
| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | quotes match; I.C.5 has no since-clause (form) |
| 2 | fine | fair wrong choices |
| 3 | fine | P154, P130, P131 |
| 4 | fine | the hug is asked for first |
| 5 | fine | E12 holds I.D.1 (not named) |
| 6 | fine | places even |
| 7 | fine | the tear, not the turned mouth |
| 8 | fine | sentences |
| 9 | defect | "share the ball" in More right answers |
| 10 | fine | lines named |
| 11 | fine | drawn |
| 12 | fine | 2027 codes |
| 13 | defect | "something soft to hold" points at the teddy |
| 14 | fine | the grown-up is never wrong |
| 15 | not applicable | na-W |
| 16 | not applicable | na-V |
| 17 | not applicable | na-G |
| 18 | defect | Yes 57.9 |
| 19 | not applicable | na-L |
| 20 | not applicable | na-L |
| 21 | fine | modeled |
| 22 | not applicable | na-L |
| 23 | fine | words said |
| 24 | fine | modeled |
| 25 | fine | none |
| 26 | defect | sad 70.7 in p3-help-who |
| 27 | defect | the same in rounds |
| 28 | fine | no letters |
| 29 | fine | one answer each |
| 30 | not applicable | na-S |
| 31 | fine | worked |

### helpers-all-around
| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | VII.B.3 and II.D.1 in part (E13) |
| 2 | defect | "treats" is untaught here |
| 3 | fine | P121 to P124, P140, P141 |
| 4 | fine | accurate jobs |
| 5 | fine | E13 |
| 6 | fine | places even |
| 7 | fine | "a different job" |
| 8 | fine | sentences |
| 9 | fine | shown first |
| 10 | fine | lines named |
| 11 | fine | the firefighter is kept off the street rows |
| 12 | fine | 2027 codes |
| 13 | fine | none |
| 14 | fine | safe |
| 15 | fine | the game on five words |
| 16 | not applicable | na-V |
| 17 | not applicable | na-G |
| 18 | not applicable | na-Y |
| 19 | not applicable | na-L |
| 20 | not applicable | na-L |
| 21 | fine | modeled |
| 22 | not applicable | na-L |
| 23 | defect | "treats" |
| 24 | fine | modeled |
| 25 | fine | none |
| 26 | defect | Firefighter 42.8 in reviews |
| 27 | defect | reviews only |
| 28 | fine | no letters |
| 29 | fine | one answer each |
| 30 | not applicable | na-S |
| 31 | fine | worked |

### circle-and-square
| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | V.B.1 and P-MATH 9 in part |
| 2 | defect | "as this square" names it (L11) |
| 3 | fine | P16 shows the ball beside its circle |
| 4 | fine | true |
| 5 | fine | pointed to Triangles and Rectangles |
| 6 | fine | places even |
| 7 | fine | corners named |
| 8 | fine | sentences |
| 9 | defect | "wheel" in More right answers |
| 10 | fine | P98 |
| 11 | fine | drawn |
| 12 | fine | 2027 codes |
| 13 | defect | the shape named |
| 14 | fine | safe |
| 15 | not applicable | na-W |
| 16 | not applicable | na-V |
| 17 | not applicable | na-G |
| 18 | not applicable | na-Y |
| 19 | not applicable | na-L |
| 20 | not applicable | na-L |
| 21 | fine | modeled |
| 22 | not applicable | na-L |
| 23 | fine | words said |
| 24 | fine | modeled |
| 25 | defect | round answers 66.6 and 65.5 |
| 26 | defect | the tool reads 58.9 |
| 27 | defect | the same in rounds |
| 28 | fine | no letters |
| 29 | fine | SHAPE_NEVER held; no oval in pre-K 3 |
| 30 | not applicable | na-S |
| 31 | fine | worked |

### people-and-events
| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | VII.B.3 whole; two codes in part |
| 2 | fine | answers right |
| 3 | fine | all six said and drawn |
| 4 | fine | true |
| 5 | fine | E12 |
| 6 | fine | places even |
| 7 | defect | the baby reason names milk |
| 8 | fine | sentences |
| 9 | fine | shown first |
| 10 | fine | P161 |
| 11 | defect | a yes or no reason off its question |
| 12 | fine | 2027 codes |
| 13 | defect | fixed wrong choices not recorded |
| 14 | fine | the baby is held |
| 15 | fine | the game on six words |
| 16 | not applicable | na-V |
| 17 | not applicable | na-G |
| 18 | defect | Yes 61.1 to 63.7 |
| 19 | not applicable | na-L |
| 20 | not applicable | na-L |
| 21 | fine | modeled |
| 22 | not applicable | na-L |
| 23 | fine | words said |
| 24 | fine | modeled |
| 25 | fine | none |
| 26 | defect | 43.6 |
| 27 | defect | 63.7 in rounds |
| 28 | fine | no letters |
| 29 | fine | one answer each |
| 30 | not applicable | na-S |
| 31 | fine | worked |

### match-the-vehicles
| Item | Verdict | Evidence |
|---|---|---|
| 1 | defect | P-SCI 3 in part omits independence |
| 2 | defect | "this boat" names it (L11) |
| 3 | fine | P107 |
| 4 | fine | true |
| 5 | fine | E13 |
| 6 | fine | places even |
| 7 | defect | the heard answer's sign |
| 8 | fine | sentences |
| 9 | fine | shown first |
| 10 | fine | lines named |
| 11 | fine | no toy car on the track |
| 12 | fine | 2027 codes |
| 13 | defect | fixed wrong choices on the track and road rows |
| 14 | fine | safe |
| 15 | not applicable | na-W |
| 16 | not applicable | na-V |
| 17 | not applicable | na-G |
| 18 | not applicable | na-Y |
| 19 | not applicable | na-L |
| 20 | not applicable | na-L |
| 21 | fine | modeled |
| 22 | not applicable | na-L |
| 23 | fine | words said |
| 24 | fine | modeled |
| 25 | fine | none |
| 26 | fine | 51.5 rides the #2 tag |
| 27 | fine | as alone |
| 28 | fine | no letters |
| 29 | fine | one answer each |
| 30 | not applicable | na-S |
| 31 | fine | worked |

### talk-with-a-friend
| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | five codes in part, each pointed |
| 2 | fine | turn toward, not look at |
| 3 | fine | P162, P165 |
| 4 | fine | true |
| 5 | fine | E12 |
| 6 | fine | places even |
| 7 | fine | a reason for each |
| 8 | fine | sentences |
| 9 | fine | shown first |
| 10 | fine | the ball comparison drawn |
| 11 | fine | drawn |
| 12 | fine | 2027 codes |
| 13 | fine | ECHO_WAITS |
| 14 | fine | safe |
| 15 | not applicable | na-W |
| 16 | not applicable | na-V |
| 17 | fine | turns taught as turns |
| 18 | defect | "too" assumes Yes |
| 19 | not applicable | na-L |
| 20 | not applicable | na-L |
| 21 | fine | modeled |
| 22 | not applicable | na-L |
| 23 | fine | words said |
| 24 | fine | modeled |
| 25 | fine | none |
| 26 | fine | by-design entry |
| 27 | fine | as alone |
| 28 | fine | no letters |
| 29 | fine | one answer each |
| 30 | not applicable | na-S |
| 31 | fine | worked |

### red-and-blue
| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | V.D.1 has no since-clause (form) |
| 2 | fine | red beside blue only |
| 3 | fine | P13, P88, P89 |
| 4 | defect | "The sea is always blue" |
| 5 | fine | E12 |
| 6 | fine | places even |
| 7 | fine | "red, not blue like the sky" |
| 8 | fine | sentences |
| 9 | fine | sorting shown on line 6 |
| 10 | fine | lines named |
| 11 | fine | drawn |
| 12 | fine | 2027 codes |
| 13 | fine | none |
| 14 | fine | safe |
| 15 | fine | the game on red and blue |
| 16 | not applicable | na-V |
| 17 | defect | an "always" claim |
| 18 | not applicable | na-Y |
| 19 | not applicable | na-L |
| 20 | not applicable | na-L |
| 21 | fine | modeled |
| 22 | not applicable | na-L |
| 23 | fine | words said |
| 24 | fine | modeled |
| 25 | fine | none |
| 26 | fine | picture-only is the question |
| 27 | fine | as alone |
| 28 | fine | no letters |
| 29 | defect | a rule said of a set it is not true of |
| 30 | not applicable | na-S |
| 31 | fine | worked |

### say-it-to-fit
| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | II.B.1 and P-LC 3 whole; P-LC 4 in part |
| 2 | fine | answers right |
| 3 | fine | P168 |
| 4 | fine | true |
| 5 | fine | E13 |
| 6 | fine | places even |
| 7 | fine | a reason for each |
| 8 | fine | sentences |
| 9 | fine | shown first |
| 10 | fine | lines named |
| 11 | fine | the baby drawn asleep |
| 12 | fine | 2027 codes |
| 13 | defect | fixed wrong choices in p4-fit-why |
| 14 | fine | safe |
| 15 | not applicable | na-W |
| 16 | defect | the outside voice wrong 5 of 6; the library reason |
| 17 | defect | the answer is always the longer |
| 18 | defect | "can" 89.0; ability rows |
| 19 | not applicable | na-L |
| 20 | not applicable | na-L |
| 21 | fine | modeled |
| 22 | not applicable | na-L |
| 23 | fine | words said |
| 24 | fine | modeled |
| 25 | defect | 84.4 by avoiding one choice |
| 26 | defect | 82.2 and 84.4 |
| 27 | defect | the same in rounds |
| 28 | fine | no letters |
| 29 | fine | one answer each |
| 30 | not applicable | na-S |
| 31 | fine | worked |

### please-and-thank-you
| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | five codes in part, each pointed |
| 2 | defect | "Thanks" marked wrong |
| 3 | fine | P97 |
| 4 | defect | "thanks does not show you are glad" |
| 5 | fine | E12 |
| 6 | fine | places even |
| 7 | defect | an untrue reason |
| 8 | fine | sentences |
| 9 | fine | shown first |
| 10 | fine | lines named |
| 11 | defect | "thanks" as children live it |
| 12 | fine | 2027 codes |
| 13 | fine | none |
| 14 | fine | safe |
| 15 | not applicable | na-W |
| 16 | not applicable | na-V |
| 17 | defect | a polite form marked wrong |
| 18 | not applicable | na-Y |
| 19 | not applicable | na-L |
| 20 | not applicable | na-L |
| 21 | fine | modeled |
| 22 | not applicable | na-L |
| 23 | defect | pk-turn-choice's things unsaid here |
| 24 | fine | modeled |
| 25 | fine | none |
| 26 | fine | two marks by design (above) |
| 27 | fine | as alone |
| 28 | fine | no letters |
| 29 | fine | one answer each |
| 30 | not applicable | na-S |
| 31 | fine | worked |

### things-that-happen
| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | II.D.1 in part; VII.A.3 whole |
| 2 | fine | answers right |
| 3 | fine | all said and drawn |
| 4 | fine | true |
| 5 | fine | E12 |
| 6 | fine | places even |
| 7 | fine | a reason for each |
| 8 | fine | sentences |
| 9 | fine | shown first |
| 10 | fine | lines named |
| 11 | fine | the book never wrong at bedtime |
| 12 | fine | 2027 codes |
| 13 | defect | snowy and snow, rainy and rain, bedtime and bed |
| 14 | fine | safe |
| 15 | fine | the game on two words |
| 16 | not applicable | na-V |
| 17 | not applicable | na-G |
| 18 | defect | Yes 68.4 |
| 19 | not applicable | na-L |
| 20 | not applicable | na-L |
| 21 | fine | modeled |
| 22 | not applicable | na-L |
| 23 | fine | words said |
| 24 | fine | modeled |
| 25 | defect | 66.9 and 73.4 by the echo |
| 26 | defect | the same |
| 27 | defect | Yes 65.2 to 66.9 in rounds |
| 28 | defect | one rule answers three banks |
| 29 | fine | one answer each |
| 30 | not applicable | na-S |
| 31 | fine | worked |

### patterns
| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | V.D.3 and P-MATH 7 in part (E13) |
| 2 | fine | answers right |
| 3 | fine | P138, P117 |
| 4 | fine | true |
| 5 | fine | E13 |
| 6 | fine | places even |
| 7 | fine | "the gap needs a square" |
| 8 | fine | sentences |
| 9 | defect | a method in More right answers |
| 10 | fine | lines named |
| 11 | fine | drawn |
| 12 | fine | 2027 codes |
| 13 | fine | none |
| 14 | fine | safe |
| 15 | not applicable | na-W |
| 16 | not applicable | na-V |
| 17 | not applicable | na-G |
| 18 | fine | Yes 49.2 |
| 19 | not applicable | na-L |
| 20 | not applicable | na-L |
| 21 | fine | lines 1 to 5 ask and work it |
| 22 | not applicable | na-L |
| 23 | fine | words said |
| 24 | fine | modeled |
| 25 | fine | no "No" row repeats |
| 26 | fine | picture-only is the question |
| 27 | fine | as alone |
| 28 | fine | no letters |
| 29 | fine | no AAB row shown |
| 30 | not applicable | na-S |
| 31 | fine | worked |

### which-came-first
| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | five codes in part (E13) |
| 2 | fine | answers right |
| 3 | defect | line 5 shows the cat |
| 4 | fine | true |
| 5 | defect | II.D.1's expressive half names no earmark |
| 6 | fine | places even |
| 7 | fine | a reason for each |
| 8 | fine | sentences |
| 9 | fine | shown first |
| 10 | defect | line 5's picture |
| 11 | fine | drawn |
| 12 | fine | 2027 codes |
| 13 | fine | none |
| 14 | fine | safe |
| 15 | fine | the game on first and second |
| 16 | not applicable | na-V |
| 17 | not applicable | na-G |
| 18 | not applicable | na-Y |
| 19 | not applicable | na-L |
| 20 | not applicable | na-L |
| 21 | fine | modeled on lines 3 to 5 |
| 22 | not applicable | na-L |
| 23 | fine | words said |
| 24 | fine | modeled |
| 25 | fine | 50/50 |
| 26 | fine | not marked |
| 27 | fine | not marked |
| 28 | fine | no letters |
| 29 | fine | one answer each |
| 30 | not applicable | na-S |
| 31 | fine | worked |

### talk-about-it
| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | II.B.2 and P-LC 4 in part |
| 2 | fine | answers right |
| 3 | fine | all said |
| 4 | fine | true |
| 5 | fine | pointed |
| 6 | fine | places even |
| 7 | fine | "not about what your friend said" |
| 8 | fine | sentences |
| 9 | fine | shown first |
| 10 | fine | lines named |
| 11 | fine | drawn |
| 12 | fine | 2027 codes |
| 13 | fine | ECHO_WAITS |
| 14 | fine | safe |
| 15 | not applicable | na-W |
| 16 | defect | always the same two wrong replies |
| 17 | not applicable | na-G |
| 18 | fine | Yes 49.4 |
| 19 | not applicable | na-L |
| 20 | not applicable | na-L |
| 21 | fine | modeled |
| 22 | not applicable | na-L |
| 23 | defect | the wrong replies never vary |
| 24 | fine | modeled |
| 25 | defect | 100 on four banks |
| 26 | defect | the same |
| 27 | defect | the same |
| 28 | defect | one rule answers four banks |
| 29 | fine | one answer each |
| 30 | not applicable | na-S |
| 31 | defect | one part every time |

Packet: none was given for this read, so no finding's rule came from a packet. Every rule cited is in the brief's items 1 to 31 and its pass NV note, or in CLAUDE.md.

Opened
- module good-friend
- module things-we-do
- module how-friends-feel
- module feelings-show
- module animal-sounds
- module play-with-a-plan
- module voice-tells-more
- module taking-turns
- module join-in-play
- module two-steps
- module colours
- module help-a-friend
- module helpers-all-around
- module circle-and-square
- module people-and-events
- module match-the-vehicles
- module talk-with-a-friend
- module red-and-blue
- module say-it-to-fit
- module please-and-thank-you
- module things-that-happen
- module patterns
- module which-came-first
- module talk-about-it
- bank p4-kind-words seeds 1-2000
- bank p4-help-friend seeds 1-2000
- bank p4-when-grownup seeds 1-2000
- bank p4-fix-problem seeds 1-2000
- bank p4-good-yesno seeds 1-2000
- bank p4-act-thing seeds 1-2000
- bank p4-act-word seeds 1-2000
- bank p4-act-when seeds 1-2000
- bank p4-act-yesno seeds 1-2000
- bank p4-act-use seeds 1-2000
- bank p4-same-or-different seeds 1-4000
- bank p4-friend-feels seeds 1-2000
- bank p4-new-feeling-moment seeds 1-2000
- bank p4-new-feeling-face seeds 1-2000
- bank p4-friends-yesno seeds 1-2000
- bank p4-feel-does seeds 1-2000
- bank p4-feel-tells seeds 1-2000
- bank p4-feel-say seeds 1-2000
- bank p4-feel-okay seeds 1-2000
- bank p4-feel-calm seeds 1-2000
- bank p3-animal-sound seeds 1-2000
- bank p3-animal-says seeds 1-2000
- bank p3-animal-order seeds 1-2000
- bank p3-two-at-once seeds 1-2000
- bank p4-play-plan seeds 1-2000
- bank p4-play-part seeds 1-2000
- bank p4-plan-yesno seeds 1-2000
- bank p4-plan-together seeds 1-2000
- bank p4-plan-what seeds 1-2000
- bank p4-tone-ask seeds 1-2000
- bank p4-tone-feel seeds 1-2000
- bank p4-tone-strong seeds 1-2000
- bank p4-tone-which seeds 1-2000
- bank p4-tone-yesno seeds 1-2000
- bank pk-turn-choice seeds 1-2000
- bank ck-good-choice seeds 1-2000
- bank pk-whose-turn seeds 1-2000
- bank pk-turn-or-share seeds 1-2000
- bank pk-while-waiting seeds 1-2000
- bank p3-join-how seeds 1-2000
- bank p3-join-yesno seeds 1-2000
- bank p3-join-not-now seeds 1-2000
- bank p3-join-face seeds 1-2000
- bank p3-join-turn seeds 1-2000
- bank p3-steps-things seeds 1-2000
- bank p3-steps-sounds seeds 1-2000
- bank p3-steps-say-them seeds 1-2000
- bank p3-steps-which seeds 1-2000
- bank p3-steps-yesno seeds 1-2000
- bank pc-tap-colour seeds 1-2000
- bank pc-name-colour seeds 1-2000
- bank pc-same-colour seeds 1-2000
- bank pc-different-colour seeds 1-2000
- bank pc-colour-of-thing seeds 1-2000
- bank p3-help-who seeds 1-2000
- bank p3-help-kind seeds 1-2000
- bank p3-help-grownup seeds 1-2000
- bank p3-help-ball seeds 1-2000
- bank p3-help-yesno seeds 1-2000
- bank ck-which-helper seeds 1-2000
- bank ck-job-tool seeds 1-2000
- bank pk-helper-where seeds 1-2000
- bank pk-helper-scene seeds 1-2000
- bank p3-tap-shape seeds 1-2000
- bank p3-name-shape seeds 1-2000
- bank p3-shape-by-corners seeds 1-2000
- bank p3-shape-thing seeds 1-2000
- bank p3-same-shape-any-size seeds 1-2000
- bank p3-people-tap seeds 1-2000
- bank p3-people-who seeds 1-2000
- bank p3-people-yesno seeds 1-2000
- bank p3-people-group seeds 1-2000
- bank p3-people-grownup seeds 1-2000
- bank pm-same-vehicles seeds 1-2000
- bank pm-different-vehicles seeds 1-2000
- bank pm-vehicle-where seeds 1-2000
- bank pm-tap-vehicle seeds 1-2000
- bank p3-talk-listen seeds 1-2000
- bank p3-talk-turn seeds 1-2000
- bank p3-talk-hi-bye seeds 1-2000
- bank p3-talk-yesno seeds 1-2000
- bank p3-talk-room seeds 1-2000
- bank p3-tap-red-blue seeds 1-2000
- bank p3-which-colour seeds 1-2000
- bank p3-sort-red-blue seeds 1-2000
- bank p4-fit-voice seeds 1-2000
- bank p4-fit-why seeds 1-2000
- bank p4-fit-say seeds 1-2000
- bank p4-fit-enough seeds 1-2000
- bank p4-fit-yesno seeds 1-2000
- bank pk3-magic-word seeds 1-2000
- bank p3-event-what seeds 1-2000
- bank p3-event-tap seeds 1-2000
- bank p3-event-yesno seeds 1-2000
- bank p3-event-name seeds 1-2000
- bank p3-event-picture seeds 1-2000
- bank pp-what-next seeds 1-2000
- bank pp-which-repeats seeds 1-4000
- bank pp-missing seeds 1-2000
- bank p4-which-came-first seeds 1-2000
- bank p3-talk-say-back seeds 1-2000
- bank p3-talk-topic seeds 1-2000
- bank p3-talk-about-yesno seeds 1-2000
- bank p3-talk-why seeds 1-2000
- bank p3-talk-feel seeds 1-2000
- file READ-LIST-lesson.md
- file CLAUDE.md
- file CLAUDE-PART-2.md
- file CLAUDE-PART-3.md
- file docs/INDEPENDENT-CHECKS.md 58-75
- file docs/INDEPENDENT-CHECKS.md 237-282
- file docs/DECISIONS.md
- file docs/standards/README.md
- file docs/standards/tea-pk3-2027-recommended.txt
- file docs/standards/tea-pk4-2027-recommended.txt
- file docs/standards/elof-preschool-lc-lit-atl-pmp.txt
- file docs/standards/elof-preschool-math-sci-se.txt
- file docs/standards/elof-preschool-indicators-se.txt
- file docs/EARMARKS.md 19-19
- file docs/EARMARKS.md 27-27
- file docs/EARMARKS.md 101-101
- file docs/EARMARKS.md 152-152
- file docs/EARMARKS.md 319-320
- file docs/RULES-AUDIT.md 635-635
- file src/logic.mjs 5889-5893
- file src/logic.mjs 21985-22012
- file src/logic.mjs 36497-36497
- file src/logic.mjs 38800-38860
- file src/logic.mjs 40940-40975
- file src/curriculum.mjs 415-440
- file src/curriculum.mjs 780-830
- file tests/logic.test.mjs 5422-5422
- file tests/logic.test.mjs 7973-7984
- file tools/course-packet.mjs
- file tools/blind-read.mjs 1-111
- tool tools/blind-read.mjs
