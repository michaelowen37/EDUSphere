(Saved word for word by the lead as it arrived, about 10:40 PM CST, November 22, 2026: lesson-read-1, Fable 5.2, copy lr-a (seed 2), the brief as written. Harness count 373,895 tokens (its last context), 60 tool uses, about 12.6 minutes. Its note: the harness refused its write to /tmp/lesson-read-1/report.md, so it gave the report as text.)

# Lesson read, round one: report

Copy read: /home/claude/lr-a (paths below are from its top). All 24 modules of READ-LIST-lesson.md and their banks were read: citations, written lesson, spoken script line by line with its pictures and paintings, and every bank generated over seeds 1 to 600 (every distinct question, the union of its wrong choices, every reason and what is heard after a wrong tap). The combinatorial banks were also recomputed from their own words over 3,000 to 6,000 seeds. Every bank was scored with tools/blind-read.mjs alone at 1,000 seeds; I did not run it with --rounds, and no rules test block was run.

## Strongest objection

The banks' tables carry one-off wrong facts that every test passes because the tests re-derive answers, not words. Ten of the 24 lessons have at least one line a child hears that is false, untaught, or against a standing rule: a reason that says tight fists show scared, a wrong choice ("Thanks") that is a right answer, a question that asks about "it" with nothing shown, a yes or no that teaches eye contact with a stranger where the script says turn toward them, and a yes or no that marks tapping your feet while listening as wrong, which no line teaches. Nothing below should be called clean until those are fixed.

## MUST FIX

1. **feelings-show, bank p4-feel-tells, src/logic.mjs line 36284** (every seed of "How might Rosa feel when her hands make tight fists?", for example seed 1). The reason for the sad face says "The sad face has a tear rolling out, and tight fists can show you feel scared." The answer is the mad face and the lesson says tight fists go with mad. Fix: "...and tight fists can show you feel mad."

2. **please-and-thank-you, bank pk3-magic-word, line 36797** (seed 30, "What do you say when someone hands you a cracker?"). The wrong choice is "Thanks", with the reason "Saying thanks does not show you are glad, and thank you does." Thanks is a right answer and the reason is false. Fix: wrong choice "Mine", reason "Saying mine does not thank them, and thank you shows you are glad." (the form the bank's other rows use).

3. **voice-tells-more, bank p4-tone-yesno, line 32172** (seed 4). "When you talk with a doctor you have just met, do you look in their eyes?" Yes, "Look in their eyes, so they can understand you." The script (line 10) and the II.C.1 citation both say turn toward them; the house rule is turn toward, never look at, since eye contact distresses some autistic children. Fix: "When you talk with a doctor you have just met, do you turn toward them?" / "Yes. Turn toward them, and say your words slowly and clearly, so they can understand you." / reason "would mean you turn away from someone new, but turning toward them helps them understand you."

4. **two-steps, bank p3-steps-yesno, line 31142** (seed 9). "Is it okay to tap your feet while you listen to both steps?" No, "Keep your feet still while you listen." No line of the script says anything about feet or keeping still (taught before asked), and it is not true that a child cannot listen while moving; it brings back the listening-body rule the project retired. Fix: replace the row with one the script teaches and that keeps the bank at three Yes and three No: "Do you do the second step first?" / No / "No. Do the steps in order, first one step, and then the other." / "would mean you start with the second step, but you do them in order." The test file names the old prompt once (tests/logic.test.mjs); change it there too.

5. **things-we-do, bank p4-act-yesno, line 31913** (seed 18). "At art time, do you draw with it?" The question shows no picture and no setup, so "it" names nothing; the explanation says a crayon. Fix: "At art time, do you draw with a crayon?" and the reason "would mean you do not draw with a crayon at art time, but you do." The test file names the old prompt once.

6. **people-and-events, bank p3-people-yesno, line 31389** (seed 7, "Is a baby very little?"). The reason for No is "No would mean a baby cannot drink milk from a bottle, but a baby can." A yes or no reason names what its own question asks. Fix: "No would mean a baby is not very little, but a baby is."

7. **red-and-blue, lines 5082 and 5091 (written lesson and script line 5) and line 22666 (More right answers of p3-tap-red-blue and p3-which-colour)**. "The sea is always blue, and so are a bluebird's wings." The sea is often gray or green; the same lesson hedges "Many fire trucks" and "many apples", and pre-K 4's Colors says "the sky on a sunny day". An always that is false. Fix in all three places: "The sea often looks blue, and a bluebird's wings are blue."

8. **taking-turns, lines 7861 and 7872 (written lesson and script line 7)**. "Waiting can drive you up the wall, and that is okay." An idiom a four-year-old hears literally (walls, driving), in a read-aloud lesson held to very simple words; the I.B.2.c citation itself calls it "a hard feeling while waiting". Fix both: "Waiting can feel hard, and that is okay."

9. **which-came-first, script line 5, line 8268**. "Listen again. Quack, then meow. Now the duck came first." shows only the cat. The picture shows the animal the line says did not come first, and not the duck it names. Fix: show the pair, duck first: `{ kind: 'pair', a: { kind: 'pic', name: 'duck' }, b: { kind: 'pic', name: 'cat' } }`.

10. **helpers-all-around, bank ck-which-helper, line 36105** (seed 12). "Who treats you when you are sick?" The script never says treats ("helps sick and hurt people get well"), and to a four-year-old a treat is a sweet. The sister bank pk-helper-scene already asks it in the lesson's words. Fix: "Who helps you get well when you are sick?"

11. **circle-and-square, bank p3-shape-thing, line 22749** (seed 2, "Tap the one that rolls."). More right answers says "A wheel is round too, so it rolls." No line says or draws a wheel; More right answers is a true example in the lesson's words. Fix: "A block has flat sides and corners, so it does not roll." or drop the line. (Of the twelve, this is the one I hold least firmly as a must; it may be an older line.)

12. **voice-tells-more, bank p4-tone-yesno, balance**. Five of its seven rows answer Yes; blind-read reads 70.4 percent Yes at 1,000 seeds (marked, outside 40 to 60), so a child who always taps Yes passes most rounds. Fix with item 3 in hand: turn one Yes row into a No, for example replace "Does a happy voice often go up high?" with "Is a happy voice often slow, soft and low?" / No / "No. A happy voice often goes up high, and it can be quick." / "would mean a happy voice is slow and low, but it often goes up high." That gives four Yes and three No.

## SHOULD CONSIDER

1. **things-that-happen, p3-event-yesno**: four of six rows answer Yes (67.3 percent, marked). Add or turn a row, for example "Does snow fall on a rainy day?" / No / "No. On a rainy day, rain falls. Snow falls on a snowy day."
2. **people-and-events, p3-people-yesno** (61.1 percent Yes, marked) and **good-friend, p4-good-yesno** (60.3, marked): each one row from balance.
3. **taking-turns, pk-turn-or-share**: its two choices always stand in the prompt's order (Taking turns, Sharing) and four of seven rows answer Taking turns, so the first button is right 57.8 percent (marked). Add a sharing row from the script (two friends share one ball) or shuffle the buttons.
4. **say-it-to-fit, p4-fit-voice**: "A big outside voice" is the wrong choice in five of six rows; a child who never taps it scores 84.3 percent (2,000 seeds, my own count, not the tool's). Offer "A whisper" as the wrong voice for the classroom and the doctor's office rows, which the script's "not too loud and not too soft" supports. **p4-fit-enough**: the answer is the longest choice on every seed (100 percent) and blind-read marks "My knee hurts. I fell on the slide." at 83.4. I judge the same-choice mark by design at 83.4, since telling enough is the lesson and no right answer is ever a wrong choice, but the length could be evened with a long vague choice the script supports ("Uh oh. It hurts.").
5. **join-in-play, p3-join-face** (seed 12) offers the scared face and **help-a-friend, p3-help-who** (seeds 1 and 4) the mad face; neither lesson draws that face, and their reasons use signs (wide-open eyes, eyebrows that squeeze down) the scripts never say. Both lean on Happy, sad, mad and scared. Either draw the face in one line, or use the happy face, which each lesson draws.
6. **which-came-first**: the script teaches second and plays the say-along on it, and the II.D.1 and P-MATH 4 citations name "first and second", but the one bank asks only "Which animal came first?" (3,000 of 3,000 seeds). Ask second as pre-K 3's p3-animal-order does, or narrow the citations to the word taught and not asked.
7. **colours, pc-same-colour** and **red-and-blue, p3-tap-red-blue and p3-which-colour**: questions and reasons name a triangle (and in Red and blue a square) that the lesson's script never names; each is its course's first lesson. The shape word never decides the answer, so "the red one" would do, or name the shapes in the sorting line.
8. **play-with-a-plan, p4-plan-what**: two of three rows are answered by the echo alone ("let's play pizza shop! What will you make?", "can you pass me a block? What will your friend pass you?"). It reads as a listening check by design; record it with the kept echoes if so. Its reason says "The slice of pizza", while the lesson and the choice's own name say the pizza (also talk-about-it, p3-talk-topic).
9. **good-friend, p4-good-yesno** (seed 6): under "Is it kind to ask a worried friend, can I hold your hand?", More right answers says "You can say, I will play with you.", which answers what to say, not whether an act is kind. Suggest "Saying, I will play with you, is kind too."
10. **good-friend, p4-kind-words** (seed 4) asks about a friend who "falls in front of the class", words only How do friends feel? says; the lesson's own line is "falls and gets hurt", where it teaches getting a grown-up. A child could fairly answer that row with the grown-up rule.
11. **how-friends-feel, p4-new-feeling-moment** (seed 14): "you call your teacher Grandma by mistake and your friends giggle" offers the worried face as the wrong choice; a child may fairly feel worried there. The happy face would be a cleaner wrong choice. The bank's best single choice reads 66.1 (face:worried, marked).
12. **join-in-play, script line 9**: "You can play something else, like the slide" could add "with a grown-up near", by the rule that a young lesson sends no child somewhere alone.

## CLEAN

- Citations: every quoted Head Start sentence sits on the cited goal and the right age row for its grade (36 to 48 for pre-K 3, 48 to 60 for pre-K 4), and every TEA code's words match its number in the 2027 texts in docs/standards (checked by script against the kept texts, which I searched and did not read line by line). Every lesson a citation says another part "is taught in" exists at that grade. The "in part" clauses I read name what the scripts leave out; no citation names a person.
- Recomputed clean (answer, explanation, every reason, More right answers): animal-sounds, all four banks; two-steps' order, say-them and which banks; p4-play-part; patterns' three banks (period, gap, non-patterns, three-item rows included); p4-which-came-first; colours' and red-and-blue's banks, with red never set against green where color alone decides (the tap and name banks ask a color by name, which EARMARKS A11 exempts); match-the-vehicles' same and different banks; circle-and-square's tap, name, corners and same-shape banks; p4-new-feeling-face and p4-same-or-different, with no near pair of faces set against each other in a face question and every face reason opening with that face's own sign.
- Read whole and found sound: good-friend's grown-up bank, play-with-a-plan's script and its other banks, help-a-friend (a hug is asked for first, a call for help is never wrong), talk-with-a-friend, talk-about-it, match-the-vehicles, animal-sounds, patterns' script, things-we-do's four other banks (fair lists hold: no book wrong at bedtime, no bed wrong at story time), say-it-to-fit's script (the sleeping baby is drawn asleep), every painting's alt against its line, and the say-along games' shape and endings.
- Safety: no baby alone in a painting (P161 has the grandma holding it), and walking away is a wrong choice only from a friend who needs help.

## Limits of this read

- blind-read ran alone only, not in rounds. Of its marks I judged one by design (p4-fit-enough, above); the other marked "always the same choice" rows in two-choice social banks I did not judge.
- I was given no task packet, so every finding rests on the lesson brief (docs/INDEPENDENT-CHECKS.md lines 237 to 275) and the manual; none on a RULES-AUDIT or EARMARKS row, apart from EARMARKS A11, which I opened for the red and green rule.
- No screen was opened; pictures were read from the script's data and the paintings' alt text, not drawn. src/logic.mjs was read through the generators' output and by search, not line by line; the standards texts by script.
- I cannot tell which of these lines are new this pass and which are older; each is reported as it stands in the copy.

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
- bank p4-kind-words seeds 1-600
- bank p4-help-friend seeds 1-600
- bank p4-when-grownup seeds 1-600
- bank p4-fix-problem seeds 1-600
- bank p4-good-yesno seeds 1-600
- bank p4-act-thing seeds 1-600
- bank p4-act-word seeds 1-600
- bank p4-act-when seeds 1-600
- bank p4-act-yesno seeds 1-600
- bank p4-act-use seeds 1-600
- bank p4-same-or-different seeds 1-4000
- bank p4-friend-feels seeds 1-600
- bank p4-new-feeling-moment seeds 1-600
- bank p4-new-feeling-face seeds 1-4000
- bank p4-friends-yesno seeds 1-600
- bank p4-feel-does seeds 1-600
- bank p4-feel-tells seeds 1-600
- bank p4-feel-say seeds 1-600
- bank p4-feel-okay seeds 1-600
- bank p4-feel-calm seeds 1-600
- bank p3-animal-sound seeds 1-3000
- bank p3-animal-says seeds 1-3000
- bank p3-animal-order seeds 1-3000
- bank p3-two-at-once seeds 1-3000
- bank p4-play-plan seeds 1-600
- bank p4-play-part seeds 1-4000
- bank p4-plan-yesno seeds 1-600
- bank p4-plan-together seeds 1-600
- bank p4-plan-what seeds 1-600
- bank p4-tone-ask seeds 1-600
- bank p4-tone-feel seeds 1-600
- bank p4-tone-strong seeds 1-600
- bank p4-tone-which seeds 1-600
- bank p4-tone-yesno seeds 1-1000
- bank pk-turn-choice seeds 1-600
- bank ck-good-choice seeds 1-600
- bank pk-whose-turn seeds 1-600
- bank pk-turn-or-share seeds 1-1000
- bank pk-while-waiting seeds 1-600
- bank p3-join-how seeds 1-600
- bank p3-join-yesno seeds 1-600
- bank p3-join-not-now seeds 1-600
- bank p3-join-face seeds 1-600
- bank p3-join-turn seeds 1-600
- bank p3-steps-things seeds 1-4000
- bank p3-steps-sounds seeds 1-4000
- bank p3-steps-say-them seeds 1-4000
- bank p3-steps-which seeds 1-4000
- bank p3-steps-yesno seeds 1-600
- bank pc-tap-colour seeds 1-4000
- bank pc-name-colour seeds 1-4000
- bank pc-same-colour seeds 1-4000
- bank pc-different-colour seeds 1-4000
- bank pc-colour-of-thing seeds 1-4000
- bank p3-help-who seeds 1-600
- bank p3-help-kind seeds 1-600
- bank p3-help-grownup seeds 1-600
- bank p3-help-ball seeds 1-600
- bank p3-help-yesno seeds 1-600
- bank ck-which-helper seeds 1-600
- bank ck-job-tool seeds 1-600
- bank pk-helper-where seeds 1-600
- bank pk-helper-scene seeds 1-600
- bank p3-tap-shape seeds 1-4000
- bank p3-name-shape seeds 1-4000
- bank p3-shape-by-corners seeds 1-4000
- bank p3-shape-thing seeds 1-600
- bank p3-same-shape-any-size seeds 1-4000
- bank p3-people-tap seeds 1-600
- bank p3-people-who seeds 1-600
- bank p3-people-yesno seeds 1-1000
- bank p3-people-group seeds 1-600
- bank p3-people-grownup seeds 1-600
- bank pm-same-vehicles seeds 1-4000
- bank pm-different-vehicles seeds 1-4000
- bank pm-vehicle-where seeds 1-600
- bank pm-tap-vehicle seeds 1-600
- bank p3-talk-listen seeds 1-600
- bank p3-talk-turn seeds 1-600
- bank p3-talk-hi-bye seeds 1-600
- bank p3-talk-yesno seeds 1-600
- bank p3-talk-room seeds 1-600
- bank p3-tap-red-blue seeds 1-4000
- bank p3-which-colour seeds 1-4000
- bank p3-sort-red-blue seeds 1-4000
- bank p4-fit-voice seeds 1-2000
- bank p4-fit-why seeds 1-600
- bank p4-fit-say seeds 1-600
- bank p4-fit-enough seeds 1-2000
- bank p4-fit-yesno seeds 1-600
- bank pk3-magic-word seeds 1-600
- bank p3-event-what seeds 1-600
- bank p3-event-tap seeds 1-600
- bank p3-event-yesno seeds 1-1000
- bank p3-event-name seeds 1-600
- bank p3-event-picture seeds 1-600
- bank pp-what-next seeds 1-6000
- bank pp-which-repeats seeds 1-6000
- bank pp-missing seeds 1-6000
- bank p4-which-came-first seeds 1-4000
- bank p3-talk-say-back seeds 1-600
- bank p3-talk-topic seeds 1-600
- bank p3-talk-about-yesno seeds 1-600
- bank p3-talk-why seeds 1-600
- bank p3-talk-feel seeds 1-600
- file READ-LIST-lesson.md
- file CLAUDE.md
- file CLAUDE-PART-2.md
- file CLAUDE-PART-3.md
- file docs/INDEPENDENT-CHECKS.md 58-75
- file docs/INDEPENDENT-CHECKS.md 237-275
- file docs/EARMARKS.md 152-152
- file src/logic.mjs 8262-8268
- file tests/logic.test.mjs 7973-7984
- tool tools/blind-read.mjs
- tool tools/course-packet.mjs

Findings whose rule was in my packet: none, since no packet was given. Findings whose rule came from the lesson brief and the manual alone: MUST FIX 1 to 12 and SHOULD CONSIDER 1 to 12.

Nothing from memory was used in this report, and nothing new worth saving to memory came up beyond the report itself.
