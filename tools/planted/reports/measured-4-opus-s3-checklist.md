# Lesson read 4: the lesson brief, checklist form

The copy read: /home/claude/lr-b. The items: the 24 modules of READ-LIST-lesson.md and their 105 banks.

## How this read was done

- The round brief's range for the lesson brief (lines 237 to 275) ends at item 27, so I also read items 28 to 31 and the pass NV note (lines 277 to 282).
- I generated every bank at seeds 1 to 2,000: every key, wrong choice and reason, the words heard after a first wrong tap, and the printed words. I scored each bank with tools/blind-read.mjs, alone and with --rounds.
- A script checked every quote and code against docs/standards, and the plan rows against the citations both ways.
- This copy's DECISIONS.md is a stub, so kept echoes and narrower vocabulary plays could not be checked. Item 10's look at TEA's page is the pass's own step (L17).
- The checklist's 744 table rows push this report past 3,000 words.

**Strongest objection.** Red and blue teaches a false fact, "Fire trucks and apples are always red." P3_COLOR_MORE then carries it, under More right answers, to every pre-K 3 question that asks red (MF5). Close behind: My voice tells more asks a child to look a new grown-up in the eyes, which goes against its own line and the house's rule (MF10). Six yes-or-no banks either lean past 60 percent Yes or answer with a row that no line teaches.

## MUST FIX

1. **feelings-show, p4-feel-tells, the Rosa row** (P4_FEEL_TELLS, src/logic.mjs 36284; seed 1).
   - Problem: the sad face's reason, heard on a first wrong tap, is "The sad face has a tear rolling out, and tight fists can show you feel scared." The lesson (line 2) and the row's own explanation say tight fists show mad.
   - Fix: change its fifth field to 'tight fists can show you feel mad'.
   - Items 3, 7, 30.
2. **two-steps, p3-steps-yesno** (STEPS_YESNO_P3, 31142; seed 14).
   - Problem: the row "Is it okay to hold your cup while you listen to both steps?" answers No, "your hands stay still to listen". No line says this, although the table's comment says every row is answered by its lesson. Holding a cup does not stop a child listening. The bank also answers Yes 67.2 percent alone and 65.7 to 67.9 in rounds (4 Yes, 2 No).
   - Fix: replace the row with ['Get a cup, and then get a spoon. Is getting the spoon the first step?', 'No', 'No. The first step is, get a cup, and the second step is, get a spoon.', 'would mean getting the spoon is the first step, but the first step is, get a cup.'].
   - Fix: turn the listen row into ['Do you start before you listen to both steps?', 'No', 'No. Listen to both steps before you start, and then do them in order.', 'would mean you start before you hear both steps, but you listen to both first.']. That gives 3 Yes and 3 No.
   - Items 2, 12, 18, 26, 27.
3. **which-came-first, script line 5** (8268).
   - Problem: "Listen again. Quack, then meow. Now the duck came first." is shown over the cat alone. The cat is the animal the line does not name and that did not come first.
   - Fix: show { kind: 'pair', a: { kind: 'pic', name: 'duck' }, b: { kind: 'pic', name: 'cat' } }.
   - Items 3, 10.
4. **things-we-do, p4-act-yesno** (TW_YESNO, 31913; seed 18).
   - Problem: "At art time, do you draw with it?" has no picture, so "it" names nothing. Its reason repeats "draw with it".
   - Fix: prompt 'At art time, do you draw with a crayon?'; reason 'would mean you do not draw with a crayon at art time, but you do.'
   - Items 2, 8.
5. **red-and-blue: "always red"**.
   - Problem: the sentence stands in paragraph 3 (5082), in script line 4 (5090) and in P3_COLOR_MORE.red (22666), which every pre-K 3 bank that asks red shows under More right answers. Apples are often green or yellow, and some fire trucks are yellow or lime. The same lesson says the sea is "often" blue.
   - Fix: "Fire trucks and apples are often red." and "Fire trucks are often red, and so are apples."
   - Items 4, 9, 17, 29.
6. **colours, script line 5 and paragraph 2** (7442).
   - Problem: "a pickle is green, like many frogs" compares the color to a real thing that P136 (a lemon and a pickle) does not show. tools/picture-candidates.mjs does not read "like many", so docs/PICTURE-CANDIDATES.md cannot list the line.
   - Fix: drop ", like many frogs" in both places, or add a small green frog to P136's prompt.
   - Item 10.
7. **people-and-events, p3-people-yesno** (PE_YESNO, 31389; seed 20).
   - Problem: under "Does a teacher help children learn at school?", the reason for a No tap is "No would mean a teacher cannot read stories to the class", which answers a different question. The bank also answers Yes 61.1 percent alone and up to 63.7 in rounds (5 Yes, 3 No).
   - Fix: reason 'would mean a teacher does not help children learn at school, but a teacher does.'
   - Fix: add two No rows the lines answer: ['Is a book a person?', 'No', 'No. A book is a thing, not a person.', 'would mean a book is a person, but a book is a thing.'] and ['Is a grandma very little?', 'No', 'No. A grandma is a grown-up, and a baby is very little.', 'would mean a grandma is very little, but a grandma is a grown-up.'].
   - Items 11, 18, 26, 27.
8. **please-and-thank-you, pk3-magic-word** (36797; seed 30).
   - Problem: "What do you say when someone hands you a cracker?" offers "Thanks" as the wrong choice beside "Thank you", with the reason "Saying thanks does not show you are glad". Thanks is a kind thank-you, so the reason is untrue.
   - Fix: make the wrong choice 'Please', with the reason 'is for asking, and when someone gives you something, thank you shows you are glad.' That also asks the lesson's own difference (SC9).
   - Items 2, 7.
9. **say-it-to-fit, p4-fit-yesno** (FV_YESNO, 31967; seed 12).
   - Problem: "On the playground, can a friend far away hear your big outside voice?" asks about hearing. The fair-bank row (RULES-AUDIT 307) reads hearing as ability, and pass NV removed this kind of row from pre-K 3's sister bank (comment above 32128).
   - Fix: ['On the playground, do you use a big outside voice to call a friend far away?', 'Yes', 'Yes. On the playground, a big outside voice helps a friend far away hear you.', 'would mean you do not use a big outside voice on the playground, but you do.'].
   - Problem: "Can you use words to say how you feel?" (seed 14) asks about ability. A child who signs or uses a device answers No truthfully.
   - Fix: 'Do the words, I feel happy, say how you feel?'
   - Item 18 and the pass NV note.
10. **voice-tells-more, p4-tone-yesno** (TN4_YESNO, 32172; seed 4).
    - Problem: "When you talk with a doctor you have just met, do you look in their eyes?" answers Yes, with "No would mean you look away from someone new". Line 10 says "turn toward them", the brief never asks for eye contact (item 2), and the reason makes looking away wrong. The bank also answers Yes 70.0 percent alone and 70.2 to 71.8 in rounds (5 Yes, 2 No).
    - Fix: replace the row with ['When you talk with a doctor you have just met, do you say your words fast and all at once?', 'No', 'No. Say your words slowly and clearly, and turn toward them, so they can understand you.', 'would mean fast words help someone new understand you, but slow, clear words do.'].
    - Fix: add ['Does a happy voice often go slow, soft and low?', 'No', 'No. A sad voice is often slow, soft and low, and a happy voice often goes up high.', 'would mean a happy voice is slow and low, but it often goes up high.']. That gives 4 Yes and 4 No.
    - Items 2, 18, 26, 27.
11. **talk-about-it, the say-back, yes-or-no, feel and why banks**.
    - Problem: every off-topic reply is the glass of water or the pizza. A child who has learned that those two are wrong answers every question without hearing what the friend said. p3-talk-say-back reads 100.0 for a child who hears only "What can you say back?" (blind-read, every group). In p3-talk-about-yesno and p3-talk-feel the answer is No, or sad, exactly when the reply is water or pizza (100 percent by my count over seeds 1 to 2,000).
    - Fix: also deal another friend's on-topic reply as a wrong choice and as No rows. For "I made a tower!", offer "I like your hat!"; add "Your friend says, I made a tower! You say, What is its name? Is that about the tower?" (No), with its feel row answered sad. The reason: "is about something else, not the tower".
    - Items 2, 16, 23, 25 to 28.
12. **patterns, pp-which-repeats** (22078).
    - Problem: every Yes row's More right answers line is "Say each one out loud, and listen for the part that comes back." That is a tip, which RULES-AUDIT row 296 never allows there. The rules test's ADVICE pattern (tests/logic.test.mjs, about line 11706) has no such form, so no check can see it.
    - Fix: 'Circle, square, triangle, circle, square, triangle repeats the same way each time, so it is a pattern.'
    - Item 9.
13. **help-a-friend, p3-help-who, and join-in-play, p3-join-face: faces the lessons never show** (seeds 1 and 4; seed 12).
    - Problem: p3-help-who offers the mad face (510 of 2,000 questions), with "The mad face has eyebrows that squeeze down". No line of Helping a friend draws or names mad. p3-join-face offers the scared face under "someone grabs their blocks" (383 of 2,000), and no line of Can I play too? draws or names scared.
    - Fix: give p3-help-who's sad and scared rows the happy face (line 9) as their other wrong choice.
    - Fix: give the grabbed-blocks row the happy face as its wrong choice (line 8). Keep sad out, since a grabbed toy can make a child sad.
    - Items 2, 7, 11, 18, 25.
14. **things-that-happen, p3-event-yesno**.
    - Problem: it answers Yes 68.4 percent alone and 65.2 to 66.9 in rounds (4 of 6 rows), and "Can you play on the slide at the park?" (seed 4) asks about ability.
    - Fix: 'Do you play on the slide at the park?'
    - Fix: add ['Do you blow out candles at bedtime?', 'No', 'No. At bedtime, you put on your pajamas and sleep in your bed. Candles go on a birthday cake.', 'would mean you blow out candles at bedtime, but candles go on a birthday cake.'] and ['Is a birthday party when rain falls from the clouds?', 'No', 'No. A birthday party is a happy day, often with a cake. Rain falls on a rainy day.', 'would mean a birthday party is when rain falls, but that is a rainy day.'].
    - Items 18, 26, 27.
15. **say-it-to-fit, p4-fit-voice**.
    - Problem: "A big outside voice" is the wrong choice in five of six rows and the answer in the sixth. A child who never taps it is right 84.4 percent of the time while hearing only "Which voice fits?", and 65.4 to 84.3 in rounds. This is item 16's case: a child who scores by avoiding one choice.
    - Fix: give the classroom and doctor's office rows "A whisper" as their wrong choice. Its reason, in line 6's words: "A whisper is too soft for the classroom, so use an inside voice, not too loud and not too soft."
    - Fix: add a second playground row, "Your friend is by the sandbox, and you call, over here! Which voice fits?" (A big outside voice, against An inside voice).
    - Items 16, 25 to 27.

## SHOULD CONSIDER

1. **feelings-show, p4-feel-say.** The tower row offers "I feel mad" and the crayon row offers "I feel sad", feelings those moments can fairly bring (item 2). "I feel happy" is never wrong (63.1 in doses). Make "I feel happy" the wrong choice in those two rows.
2. **taking-turns, pk-turn-or-share.** The choices keep the question's order and 4 of 7 rows answer taking turns, so the first button reads 57.8 alone and 58.4 in rounds. Add a sharing row from line 3.
3. **good-friend.** p4-good-yesno leans Yes (59.5, and 60.2 in rounds); add ['Is it kind to say, ha ha, you spilled?', 'No', ...]. p4-when-grownup's "...when a fight starts and you cannot stop it?" gives its own answer (item 18); replace it with "Do you need a grown-up when your friend spills a little milk?" (No).
4. **things-we-do.** In "Which one goes with bedtime?", the bed echoes "bedtime" (item 13); record it as kept. "At the park, can you go down the slide?" asks about ability; say "do you".
5. **say-it-to-fit.** "When a baby is sleeping, can you use a whisper?" should say "do you use", as pre-K 3's pass NV fix does.
6. **match-the-vehicles.** P-SCI 3's "With increasing independence" is not named in part (item 1); its two pre-K 4 sister citations have the same gap. The reason "so those two go together" uses words the script never says; use "so those two match".
7. **voice-tells-more.** Paragraph 3, lines 6 and 8, and a TN4_YESNO explanation say a happy voice "can be quick". docs/ALGORITHMS.md (about line 762) says the lessons claim pitch alone (item 16).
8. **Leaning face and yes or no banks.** p3-help-who leans to the sad face (70.7), p3-join-face to sad (61.5), and p3-join-yesno answers Yes 60.1 in first rounds. Grow each by a row its lesson answers.
9. **please-and-thank-you, pk3-magic-word.** No row sets Please against Thank you, so tapping the kind word always answers. After MF8, add a please row whose wrong choice is Thank you.
10. **animal-sounds, p3-two-at-once.** The question alone answers it (100). It says "at the same time" for sounds the voice plays one after another (item 23), and no line works the kind (items 21, 24, 31).
11. **circle-and-square.** p3-shape-thing leans to the ball (68.5); add "Tap the one that does not roll." (line 7). p3-shape-by-corners asks for the circle in 4 rows of 7 (58.9).
12. **helpers-all-around, CIV_HELPERS** (36105, shared with kindergarten). Ask "Who helps you get well when you are sick?" for "treats", a word no line says (and a treat is a sweet), and "Who helps you learn at school?" for "teaches", which echoes Teacher.
13. **people-and-events.** Line 5 names four helpers but draws three, without the grandpa. p3-people-grownup reads 58.4 in doses.
14. **how-friends-feel.** Line 5 says "look at their face", where item 2 asks for "turn toward". p4-same-or-different draws P4_NEAR_FACES pairs beside the answer Different. p4-friend-feels leans to happy (60.8) and p4-new-feeling-moment to worried (68.4).
15. **play-with-a-plan, p4-play-part.** The bus, store, tea party and big-picture plans are said in no line (items 2, 23).
16. **which-came-first.** P-ATL 8 is cited in part for "an increasing amount", a degree word that makes no part (item 1). The module deals one bank five times.
17. **please-and-thank-you.** The shared pk-turn-choice asks about a red crayon and a box of blocks, which no line of this lesson says (item 2).

## By design (my judgments, for BY_DESIGN)

- **Odd-one-out screens.** pm-different-vehicles (51.5) and pc-different-colour (56.4): one kind shows alone and one twice.
- **Kind act beside the lesson's non-examples.** pk-turn-choice (78.9), ck-good-choice (67.5), pk-while-waiting (67.3) and p4-fit-enough (82.2).
- **Arithmetic for 7 or 8 rows.** p4-feel-does, p4-feel-tells and p4-feel-calm (57.2 to 57.8).
- **Fair exclusions.** Read and the book in p4-act-when and p4-act-use (45.2; reading also fits bedtime, lunch and the park). Green in pc-colour-of-thing (45.1; unripe fruit is green). The grandma in p3-people-who (43.6).
- **Picture or story is the question.** The 100s on red-and-blue's banks, pm-same-vehicles, pc-name-colour, pc-same-colour, p4-feel-say, p4-act-word, p3-name-shape, p3-same-shape-any-size, p3-animal-says, the pp- banks, p4-same-or-different and p3-talk-topic.
- **Not by design.** The leans in MF11, MF15 and SC1 to SC3, SC8, SC9, SC11 and SC14.

## CLEAN

- **Citations.** Every quote matched its standard word for word. Plan rows and citations agree both ways, and "in part" matches the 2027 map apart from SC6 and SC16.
- **Child's-world exclusions.** They hold: red and green apart (A11); the toy car off the track question, the plate off "rolls", the book off bedtime, and grandparents and firefighters where they also fit.
- **More Info reasons.** They are held back while the answer or a twin is open.
- **Safety.** Calls for help are taught as right, and every painting with a young child has a grown-up near.
- **The rest.** The say-along games are in their shape. Printed words give nothing away. No near faces are set against each other in a face question.

No packet was given. Every rule cited is in the lesson brief; MF9, MF12 and SC6 also lean on RULES-AUDIT rows 296 and 307.

## Checklist tables (items 1 to 31, read-list order)

### feelings-show

| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | quotes exact; parts named |
| 2 | defect | SC1 tower, crayon rows |
| 3 | defect | MF1 Rosa reason says scared |
| 4 | fine | hug asked for, feel-okay |
| 5 | fine | waits earmarked |
| 6 | fine | places even, seeds 1-2000 |
| 7 | defect | MF1 reason untrue for tight fists |
| 8 | fine | reads as one sentence |
| 9 | fine | signs under say (RA row 296) |
| 10 | fine | P148, P149; all faces named |
| 11 | fine | every choice drawn |
| 12 | fine | 2027 texts |
| 13 | fine | no echo found |
| 14 | fine | grown-up near |
| 15 | not applicable | no vocabulary code |
| 16 | fine | no voice taught |
| 17 | not applicable | no grammar |
| 18 | fine | feel-okay Yes 58.1, 4 to 3 |
| 19 | not applicable | no word parts |
| 20 | not applicable | no word sounds |
| 21 | fine | kinds worked in lines |
| 22 | not applicable | no first parts |
| 23 | fine | question words said |
| 24 | fine | kinds modeled |
| 25 | fine | no seed pattern |
| 26 | defect | SC1 I feel happy 62.4 |
| 27 | defect | SC1 63.1 in doses |
| 28 | not applicable | no letters |
| 29 | fine | rules fit their sets |
| 30 | defect | MF1 reason not lesson's |
| 31 | fine | no story bank |

### match-the-vehicles

| Item | Verdict | Evidence |
|---|---|---|
| 1 | defect | SC6 independence not named |
| 2 | fine | car kept off track question |
| 3 | fine | reasons whole; pictures named |
| 4 | fine | no false fact found |
| 5 | fine | waits earmarked |
| 6 | fine | places even, seeds 1-2000 |
| 7 | defect | SC6 go together, held back |
| 8 | fine | reads as one sentence |
| 9 | fine | More right fair or empty |
| 10 | fine | P107 boat and rocket |
| 11 | fine | every choice drawn |
| 12 | fine | 2027 texts |
| 13 | fine | matching echo by nature |
| 14 | fine | grown-up near |
| 15 | not applicable | no vocabulary code |
| 16 | fine | no voice taught |
| 17 | not applicable | no grammar |
| 18 | fine | no yes or no bank |
| 19 | not applicable | no word parts |
| 20 | not applicable | no word sounds |
| 21 | fine | kinds worked in lines |
| 22 | not applicable | no first parts |
| 23 | fine | question words said |
| 24 | fine | kinds modeled |
| 25 | fine | no seed pattern |
| 26 | fine | different 51.5 by design |
| 27 | fine | rounds under limits |
| 28 | not applicable | no letters |
| 29 | defect | SC6 go together unsaid |
| 30 | fine | no story bank |
| 31 | fine | no story bank |

### two-steps

| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | quotes exact; parts named |
| 2 | defect | MF2 cup row untaught |
| 3 | fine | reasons whole; pictures named |
| 4 | fine | no false fact found |
| 5 | fine | waits earmarked |
| 6 | fine | top-left order 0.0 |
| 7 | fine | wrong order hears direction |
| 8 | fine | reads as one sentence |
| 9 | fine | More right fair or empty |
| 10 | fine | receptive cited; pictures named |
| 11 | fine | every choice drawn |
| 12 | defect | MF2 row in no line |
| 13 | fine | no echo found |
| 14 | fine | grown-up near |
| 15 | not applicable | no vocabulary code |
| 16 | fine | no voice taught |
| 17 | not applicable | no grammar |
| 18 | defect | MF2 Yes 67.2 |
| 19 | not applicable | no word parts |
| 20 | not applicable | no word sounds |
| 21 | fine | say-them on line 3 |
| 22 | not applicable | no first parts |
| 23 | fine | question words said |
| 24 | fine | kinds modeled |
| 25 | fine | no seed pattern |
| 26 | defect | MF2 Yes 67.2 alone |
| 27 | defect | MF2 Yes 67.9 rounds |
| 28 | not applicable | no letters |
| 29 | fine | rules fit their sets |
| 30 | fine | no story bank |
| 31 | fine | no story bank |

### talk-with-a-friend

| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | quotes exact; parts named |
| 2 | fine | turn toward, never look at |
| 3 | fine | reasons whole; pictures named |
| 4 | fine | no false fact found |
| 5 | fine | waits earmarked |
| 6 | fine | places even, seeds 1-2000 |
| 7 | fine | reasons true, held back |
| 8 | fine | reads as one sentence |
| 9 | fine | More right fair or empty |
| 10 | fine | bubble beside P165 |
| 11 | fine | every choice drawn |
| 12 | fine | 2027 texts |
| 13 | fine | no echo found |
| 14 | fine | grown-up near |
| 15 | not applicable | no vocabulary code |
| 16 | fine | no voice taught |
| 17 | not applicable | no grammar |
| 18 | fine | Yes 50.6; teacher row permission |
| 19 | not applicable | no word parts |
| 20 | not applicable | no word sounds |
| 21 | fine | kinds worked in lines |
| 22 | not applicable | no first parts |
| 23 | fine | question words said |
| 24 | fine | kinds modeled |
| 25 | fine | no seed pattern |
| 26 | fine | talk-listen BY_DESIGN 75.2 |
| 27 | fine | rounds under limits |
| 28 | not applicable | no letters |
| 29 | fine | rules fit their sets |
| 30 | fine | no story bank |
| 31 | fine | no story bank |

### taking-turns

| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | quotes exact; parts named |
| 2 | fine | walk away from friend fair |
| 3 | fine | P120, P142 to P145 |
| 4 | fine | count to ten fits waiting |
| 5 | fine | waits earmarked |
| 6 | defect | SC2 fixed order, 4 to 3 |
| 7 | fine | reasons true, held back |
| 8 | fine | reads as one sentence |
| 9 | fine | More right fair or empty |
| 10 | fine | receptive cited; pictures named |
| 11 | fine | every choice drawn |
| 12 | fine | 2027 texts |
| 13 | fine | no echo found |
| 14 | fine | waiting child by teacher, P120 |
| 15 | not applicable | no vocabulary code |
| 16 | fine | no voice taught |
| 17 | not applicable | no grammar |
| 18 | fine | no yes or no bank |
| 19 | not applicable | no word parts |
| 20 | not applicable | no word sounds |
| 21 | fine | kinds worked in lines |
| 22 | not applicable | no first parts |
| 23 | fine | question words said |
| 24 | fine | kinds modeled |
| 25 | fine | no seed pattern |
| 26 | defect | SC2 first button 57.8 |
| 27 | defect | SC2 58.4 rounds; others by design |
| 28 | not applicable | no letters |
| 29 | fine | rules fit their sets |
| 30 | fine | no story bank |
| 31 | fine | no story bank |

### which-came-first

| Item | Verdict | Evidence |
|---|---|---|
| 1 | defect | SC16 P-ATL 8 degree word |
| 2 | fine | asked words in script |
| 3 | defect | MF3 line 5 shows cat |
| 4 | fine | no false fact found |
| 5 | fine | waits earmarked |
| 6 | fine | places even, seeds 1-2000 |
| 7 | fine | reasons true, held back |
| 8 | fine | reads as one sentence |
| 9 | fine | More right fair or empty |
| 10 | defect | MF3 cat not named |
| 11 | fine | every choice drawn |
| 12 | fine | 2027 texts |
| 13 | fine | no echo found |
| 14 | fine | grown-up near |
| 15 | fine | first, second played |
| 16 | fine | no voice taught |
| 17 | not applicable | no grammar |
| 18 | fine | no yes or no bank |
| 19 | not applicable | no word parts |
| 20 | not applicable | no word sounds |
| 21 | fine | kinds worked in lines |
| 22 | not applicable | no first parts |
| 23 | fine | question words said |
| 24 | fine | kinds modeled |
| 25 | fine | no seed pattern |
| 26 | fine | 0 marked |
| 27 | fine | rounds under limits |
| 28 | not applicable | no letters |
| 29 | fine | rules fit their sets |
| 30 | fine | no story bank |
| 31 | defect | SC16 one bank five times |

### good-friend

| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | quotes exact; parts named |
| 2 | fine | walk away from worried friend fair |
| 3 | fine | reasons whole; pictures named |
| 4 | fine | asks before holding hand |
| 5 | fine | waits earmarked |
| 6 | fine | places even, seeds 1-2000 |
| 7 | fine | reasons true, held back |
| 8 | fine | reads as one sentence |
| 9 | fine | More right fair or empty |
| 10 | fine | P152, P153 |
| 11 | fine | every choice drawn |
| 12 | fine | 2027 texts |
| 13 | fine | no echo found |
| 14 | fine | grown-up near |
| 15 | not applicable | no vocabulary code |
| 16 | fine | no voice taught |
| 17 | not applicable | no grammar |
| 18 | defect | SC3 Yes 60.2; K3 own answer |
| 19 | not applicable | no word parts |
| 20 | not applicable | no word sounds |
| 21 | fine | kinds worked in lines |
| 22 | not applicable | no first parts |
| 23 | fine | question words said |
| 24 | fine | kinds modeled |
| 25 | fine | no seed pattern |
| 26 | defect | SC3 Yes 59.5; 3 BY_DESIGN |
| 27 | defect | SC3 60.2 rounds |
| 28 | not applicable | no letters |
| 29 | fine | rules fit their sets |
| 30 | fine | no story bank |
| 31 | fine | no story bank |

### things-we-do

| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | quotes exact; parts named |
| 2 | defect | MF4 draw with it |
| 3 | fine | reasons whole; pictures named |
| 4 | fine | no false fact found |
| 5 | fine | waits earmarked |
| 6 | fine | places even, seeds 1-2000 |
| 7 | fine | reasons true, held back |
| 8 | defect | MF4 it names nothing |
| 9 | fine | More right fair or empty |
| 10 | fine | P166 art time |
| 11 | fine | book kept off bedtime |
| 12 | fine | 2027 texts |
| 13 | defect | SC4 bed in bedtime |
| 14 | fine | grown-up near |
| 15 | fine | action, scissors, lunchtime |
| 16 | fine | no voice taught |
| 17 | not applicable | no grammar |
| 18 | defect | SC4 can you go down |
| 19 | not applicable | no word parts |
| 20 | not applicable | no word sounds |
| 21 | fine | kinds worked in lines |
| 22 | not applicable | no first parts |
| 23 | fine | question words said |
| 24 | fine | kinds modeled |
| 25 | fine | no seed pattern |
| 26 | fine | Read, book 45.2 by design |
| 27 | fine | rounds under limits |
| 28 | not applicable | no letters |
| 29 | fine | rules fit their sets |
| 30 | fine | no story bank |
| 31 | fine | no story bank |

### colours

| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | quotes exact; parts named |
| 2 | fine | red, green apart (A11) |
| 3 | fine | reasons whole; pictures named |
| 4 | fine | no false fact found |
| 5 | fine | waits earmarked |
| 6 | fine | places even, seeds 1-2000 |
| 7 | fine | reasons true, held back |
| 8 | fine | reads as one sentence |
| 9 | fine | More right fair or empty |
| 10 | defect | MF6 like many frogs |
| 11 | fine | every choice drawn |
| 12 | fine | 2027 texts |
| 13 | fine | no echo found |
| 14 | fine | grown-up near |
| 15 | fine | four color words played |
| 16 | fine | no voice taught |
| 17 | not applicable | no grammar |
| 18 | fine | no yes or no bank |
| 19 | not applicable | no word parts |
| 20 | not applicable | no word sounds |
| 21 | fine | kinds worked in lines |
| 22 | not applicable | no first parts |
| 23 | fine | question words said |
| 24 | fine | kinds modeled |
| 25 | fine | no seed pattern |
| 26 | fine | green 45.1, odd 56.4 by design |
| 27 | fine | rounds under limits |
| 28 | not applicable | no letters |
| 29 | fine | rules fit their sets |
| 30 | fine | no story bank |
| 31 | fine | no story bank |

### red-and-blue

| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | quotes exact; parts named |
| 2 | fine | asked words in script |
| 3 | fine | reasons whole; pictures named |
| 4 | defect | MF5 always red, false |
| 5 | fine | waits earmarked |
| 6 | fine | places even, seeds 1-2000 |
| 7 | fine | reasons true, held back |
| 8 | fine | reads as one sentence |
| 9 | defect | MF5 More right repeats it |
| 10 | fine | lines 0, 1 on candidates list |
| 11 | fine | every choice drawn |
| 12 | fine | 2027 texts |
| 13 | fine | no echo found |
| 14 | fine | grown-up near |
| 15 | fine | red, blue played |
| 16 | fine | no voice taught |
| 17 | defect | MF5 an always claim |
| 18 | fine | no yes or no bank |
| 19 | not applicable | no word parts |
| 20 | not applicable | no word sounds |
| 21 | fine | kinds worked in lines |
| 22 | not applicable | no first parts |
| 23 | fine | question words said |
| 24 | fine | kinds modeled |
| 25 | fine | no seed pattern |
| 26 | fine | picture is the question |
| 27 | fine | rounds under limits |
| 28 | not applicable | no letters |
| 29 | defect | MF5 rule not true of set |
| 30 | fine | no story bank |
| 31 | fine | no story bank |

### people-and-events

| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | quotes exact; parts named |
| 2 | fine | grandparents off doctor, teacher |
| 3 | defect | SC13 line 5 lacks grandpa |
| 4 | fine | no false fact found |
| 5 | fine | waits earmarked |
| 6 | fine | places even, seeds 1-2000 |
| 7 | fine | reasons true, held back |
| 8 | fine | reads as one sentence |
| 9 | fine | More right fair or empty |
| 10 | fine | receptive cited; pictures named |
| 11 | defect | MF7 reason asks other question |
| 12 | fine | 2027 texts |
| 13 | fine | no echo found |
| 14 | fine | baby held by grandma, P161 |
| 15 | fine | six words played |
| 16 | fine | no voice taught |
| 17 | not applicable | no grammar |
| 18 | defect | MF7 Yes 61.1 |
| 19 | not applicable | no word parts |
| 20 | not applicable | no word sounds |
| 21 | fine | kinds worked in lines |
| 22 | not applicable | no first parts |
| 23 | fine | question words said |
| 24 | fine | kinds modeled |
| 25 | fine | no seed pattern |
| 26 | defect | MF7 Yes; grandma 43.6 by design |
| 27 | defect | MF7 63.7; grownup 58.4 dose |
| 28 | not applicable | no letters |
| 29 | fine | rules fit their sets |
| 30 | fine | no story bank |
| 31 | fine | no story bank |

### help-a-friend

| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | quotes exact; parts named |
| 2 | defect | MF13 mad face unsaid |
| 3 | fine | reasons whole; pictures named |
| 4 | fine | asks before a hug |
| 5 | fine | waits earmarked |
| 6 | fine | places even, seeds 1-2000 |
| 7 | defect | MF13 mad's sign untaught |
| 8 | fine | reads as one sentence |
| 9 | fine | More right fair or empty |
| 10 | fine | P154, P130, P131 |
| 11 | defect | MF13 mad face undrawn |
| 12 | fine | 2027 texts |
| 13 | fine | no echo found |
| 14 | fine | stop, please taught right |
| 15 | not applicable | no vocabulary code |
| 16 | fine | no voice taught |
| 17 | not applicable | no grammar |
| 18 | defect | MF13 picture lesson never draws |
| 19 | not applicable | no word parts |
| 20 | not applicable | no word sounds |
| 21 | fine | kinds worked in lines |
| 22 | not applicable | no first parts |
| 23 | fine | question words said |
| 24 | fine | kinds modeled |
| 25 | defect | MF13 picture undrawn |
| 26 | defect | SC8 sad 70.7 |
| 27 | fine | 3 BY_DESIGN; yes 57.9 |
| 28 | not applicable | no letters |
| 29 | fine | rules fit their sets |
| 30 | fine | no story bank |
| 31 | fine | no story bank |

### say-it-to-fit

| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | quotes exact; parts named |
| 2 | fine | asked words in script |
| 3 | fine | reasons whole; pictures named |
| 4 | fine | no false fact found |
| 5 | fine | waits earmarked |
| 6 | fine | places even, seeds 1-2000 |
| 7 | fine | reasons true, held back |
| 8 | fine | reads as one sentence |
| 9 | fine | More right fair or empty |
| 10 | fine | P168 by the slide |
| 11 | fine | every choice drawn |
| 12 | fine | 2027 texts |
| 13 | fine | feel echoes unavoidable |
| 14 | fine | sleeping baby in its icon |
| 15 | not applicable | no vocabulary code |
| 16 | defect | MF15 big voice wrong 5 of 6 |
| 17 | not applicable | no grammar |
| 18 | defect | MF9 hearing, words rows |
| 19 | not applicable | no word parts |
| 20 | not applicable | no word sounds |
| 21 | fine | kinds worked in lines |
| 22 | not applicable | no first parts |
| 23 | fine | question words said |
| 24 | fine | kinds modeled |
| 25 | defect | MF15 avoid one choice |
| 26 | defect | MF15 question only 84.4 |
| 27 | defect | MF15 65.4 to 84.3 |
| 28 | not applicable | no letters |
| 29 | fine | rules fit their sets |
| 30 | fine | no story bank |
| 31 | fine | no story bank |

### please-and-thank-you

| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | quotes exact; parts named |
| 2 | defect | MF8 Thanks fits |
| 3 | fine | reasons whole; pictures named |
| 4 | fine | no false fact found |
| 5 | fine | waits earmarked |
| 6 | fine | places even, seeds 1-2000 |
| 7 | defect | MF8 reason untrue |
| 8 | fine | reads as one sentence |
| 9 | fine | More right fair or empty |
| 10 | fine | P97 slide turns |
| 11 | fine | every choice drawn |
| 12 | fine | 2027 texts |
| 13 | fine | no echo found |
| 14 | fine | grown-up near |
| 15 | not applicable | no vocabulary code |
| 16 | fine | no voice taught |
| 17 | not applicable | no grammar |
| 18 | fine | no yes or no bank |
| 19 | not applicable | no word parts |
| 20 | not applicable | no word sounds |
| 21 | fine | kinds worked in lines |
| 22 | not applicable | no first parts |
| 23 | defect | SC17 crayons, blocks unsaid |
| 24 | fine | kinds modeled |
| 25 | fine | no seed pattern |
| 26 | defect | SC9 kind word 100 |
| 27 | defect | SC9 75.7 rounds |
| 28 | not applicable | no letters |
| 29 | fine | rules fit their sets |
| 30 | fine | no story bank |
| 31 | fine | no story bank |

### how-friends-feel

| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | quotes exact; parts named |
| 2 | defect | SC14 look at their face |
| 3 | fine | reasons whole; pictures named |
| 4 | fine | no false fact found |
| 5 | fine | waits earmarked |
| 6 | fine | places even, seeds 1-2000 |
| 7 | fine | reasons true, held back |
| 8 | fine | reads as one sentence |
| 9 | fine | More right fair or empty |
| 10 | fine | P150, P151 |
| 11 | fine | every choice drawn |
| 12 | fine | 2027 texts |
| 13 | fine | no echo found |
| 14 | fine | grown-up near |
| 15 | not applicable | no vocabulary code |
| 16 | fine | no voice taught |
| 17 | not applicable | no grammar |
| 18 | fine | Yes 56.7, 4 to 3 |
| 19 | not applicable | no word parts |
| 20 | not applicable | no word sounds |
| 21 | fine | kinds worked in lines |
| 22 | not applicable | no first parts |
| 23 | fine | question words said |
| 24 | fine | kinds modeled |
| 25 | fine | no seed pattern |
| 26 | defect | SC14 60.8 and 68.4 |
| 27 | defect | SC14 68.4 rounds |
| 28 | not applicable | no letters |
| 29 | fine | rules fit their sets |
| 30 | fine | no story bank |
| 31 | fine | no story bank |

### play-with-a-plan

| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | quotes exact; parts named |
| 2 | defect | SC15 bus, store unsaid |
| 3 | fine | reasons whole; pictures named |
| 4 | fine | no false fact found |
| 5 | fine | waits earmarked |
| 6 | fine | places even, seeds 1-2000 |
| 7 | fine | reasons true, held back |
| 8 | fine | reads as one sentence |
| 9 | fine | More right fair or empty |
| 10 | fine | P156 block house |
| 11 | fine | every choice drawn |
| 12 | fine | split keeps plan words |
| 13 | fine | plan-what echoes by design |
| 14 | fine | grown-up near |
| 15 | not applicable | no vocabulary code |
| 16 | fine | no voice taught |
| 17 | not applicable | no grammar |
| 18 | fine | Yes 50.9 |
| 19 | not applicable | no word parts |
| 20 | not applicable | no word sounds |
| 21 | fine | kinds worked in lines |
| 22 | not applicable | no first parts |
| 23 | defect | SC15 scenes unsaid |
| 24 | fine | kinds modeled |
| 25 | fine | no seed pattern |
| 26 | fine | 2 BY_DESIGN, 0 marked |
| 27 | fine | rounds under limits |
| 28 | not applicable | no letters |
| 29 | fine | rules fit their sets |
| 30 | fine | no story bank |
| 31 | fine | no story bank |

### join-in-play

| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | quotes exact; parts named |
| 2 | defect | MF13 scared face unsaid |
| 3 | fine | reasons whole; pictures named |
| 4 | fine | no false fact found |
| 5 | fine | waits earmarked |
| 6 | fine | places even, seeds 1-2000 |
| 7 | fine | reasons true, held back |
| 8 | fine | reads as one sentence |
| 9 | fine | More right fair or empty |
| 10 | fine | P146, P147 |
| 11 | defect | MF13 scared face undrawn |
| 12 | fine | 2027 texts |
| 13 | fine | no echo found |
| 14 | fine | grown-up near |
| 15 | not applicable | no vocabulary code |
| 16 | fine | no voice taught |
| 17 | not applicable | no grammar |
| 18 | defect | MF13; SC8 Yes 60.1 |
| 19 | not applicable | no word parts |
| 20 | not applicable | no word sounds |
| 21 | fine | kinds worked in lines |
| 22 | not applicable | no first parts |
| 23 | fine | question words said |
| 24 | fine | kinds modeled |
| 25 | defect | MF13 picture undrawn |
| 26 | defect | SC8 join-face 61.5 |
| 27 | defect | SC8 Yes 60.1 rounds |
| 28 | not applicable | no letters |
| 29 | fine | rules fit their sets |
| 30 | fine | no story bank |
| 31 | fine | no story bank |

### voice-tells-more

| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | quotes exact; parts named |
| 2 | defect | MF10 look in their eyes |
| 3 | fine | reasons whole; pictures named |
| 4 | defect | SC7 happy pace claimed |
| 5 | fine | waits earmarked |
| 6 | fine | print drops ! and capitals |
| 7 | fine | reasons true, held back |
| 8 | fine | reads as one sentence |
| 9 | fine | More right fair or empty |
| 10 | fine | P171 park gate |
| 11 | fine | every choice drawn |
| 12 | fine | 2027 texts |
| 13 | fine | no echo found |
| 14 | fine | grown-up near |
| 15 | not applicable | no vocabulary code |
| 16 | defect | SC7 pace vs reviews |
| 17 | not applicable | no grammar |
| 18 | defect | MF10 Yes 70.0 |
| 19 | not applicable | no word parts |
| 20 | not applicable | no word sounds |
| 21 | fine | turns announced, carried |
| 22 | not applicable | no first parts |
| 23 | fine | question words said |
| 24 | fine | kinds modeled |
| 25 | fine | no seed pattern |
| 26 | defect | MF10 Yes 70.0 alone |
| 27 | defect | MF10 rounds over 60 |
| 28 | not applicable | no letters |
| 29 | fine | rules fit their sets |
| 30 | fine | no story bank |
| 31 | fine | no story bank |

### circle-and-square

| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | quotes exact; parts named |
| 2 | fine | plate kept off rolls |
| 3 | fine | P16 ball by circle |
| 4 | fine | no false fact found |
| 5 | fine | waits earmarked |
| 6 | fine | places even, seeds 1-2000 |
| 7 | fine | reasons true, held back |
| 8 | fine | reads as one sentence |
| 9 | fine | More right fair or empty |
| 10 | fine | P98 plate, window |
| 11 | fine | every choice drawn |
| 12 | fine | 2027 texts |
| 13 | fine | no echo found |
| 14 | fine | grown-up near |
| 15 | not applicable | no vocabulary code |
| 16 | fine | no voice taught |
| 17 | not applicable | no grammar |
| 18 | fine | no yes or no bank |
| 19 | not applicable | no word parts |
| 20 | not applicable | no word sounds |
| 21 | fine | kinds worked in lines |
| 22 | not applicable | no first parts |
| 23 | fine | question words said |
| 24 | fine | kinds modeled |
| 25 | fine | no seed pattern |
| 26 | defect | SC11 ball 68.5, circle 58.9 |
| 27 | defect | SC11 68.5 rounds |
| 28 | not applicable | no letters |
| 29 | fine | no rhombus or oval pairs |
| 30 | fine | no story bank |
| 31 | fine | no story bank |

### talk-about-it

| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | quotes exact; parts named |
| 2 | defect | MF11 same wrong replies |
| 3 | fine | reasons whole; pictures named |
| 4 | fine | no false fact found |
| 5 | fine | waits earmarked |
| 6 | fine | places even, seeds 1-2000 |
| 7 | fine | reasons true, held back |
| 8 | fine | reads as one sentence |
| 9 | fine | More right fair or empty |
| 10 | fine | ball drawn for comparison |
| 11 | fine | every choice drawn |
| 12 | fine | 2027 texts |
| 13 | fine | topic echo by design |
| 14 | fine | grown-up near |
| 15 | not applicable | no vocabulary code |
| 16 | defect | MF11 wrong always water, pizza |
| 17 | not applicable | no grammar |
| 18 | fine | Yes 49.4 |
| 19 | not applicable | no word parts |
| 20 | not applicable | no word sounds |
| 21 | fine | kinds worked in lines |
| 22 | not applicable | no first parts |
| 23 | defect | MF11 wrongs never vary |
| 24 | fine | kinds modeled |
| 25 | defect | MF11 reply alone answers |
| 26 | defect | MF11 question only 100 |
| 27 | defect | MF11 100 in rounds |
| 28 | defect | MF11 one rule, four banks |
| 29 | fine | rules fit their sets |
| 30 | fine | no story bank |
| 31 | fine | no story bank |

### patterns

| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | quotes exact; parts named |
| 2 | fine | asked words in script |
| 3 | fine | reasons whole; pictures named |
| 4 | fine | no false fact found |
| 5 | fine | waits earmarked |
| 6 | fine | places even, seeds 1-2000 |
| 7 | fine | reasons true, held back |
| 8 | fine | reads as one sentence |
| 9 | defect | MF12 tip under More right |
| 10 | fine | P138, P117 |
| 11 | fine | every choice drawn |
| 12 | fine | 2027 texts |
| 13 | fine | no echo found |
| 14 | fine | grown-up near |
| 15 | not applicable | no vocabulary code |
| 16 | fine | no voice taught |
| 17 | not applicable | no grammar |
| 18 | fine | which-repeats Yes 49.2 |
| 19 | not applicable | no word parts |
| 20 | not applicable | no word sounds |
| 21 | fine | kinds worked in lines |
| 22 | not applicable | no first parts |
| 23 | fine | question words said |
| 24 | fine | kinds modeled |
| 25 | fine | no seed pattern |
| 26 | fine | picture is the question |
| 27 | fine | rounds under limits |
| 28 | not applicable | no letters |
| 29 | fine | rules fit their sets |
| 30 | fine | no story bank |
| 31 | fine | no story bank |

### things-that-happen

| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | quotes exact; parts named |
| 2 | fine | book kept off bedtime |
| 3 | fine | reasons whole; pictures named |
| 4 | fine | no false fact found |
| 5 | fine | waits earmarked |
| 6 | fine | places even, seeds 1-2000 |
| 7 | fine | reasons true, held back |
| 8 | fine | reads as one sentence |
| 9 | fine | More right fair or empty |
| 10 | fine | receptive cited; pictures named |
| 11 | fine | every choice drawn |
| 12 | fine | 2027 texts |
| 13 | fine | no echo found |
| 14 | fine | grown-up near |
| 15 | fine | two of six events played |
| 16 | fine | no voice taught |
| 17 | not applicable | no grammar |
| 18 | defect | MF14 Yes 68.4; can you |
| 19 | not applicable | no word parts |
| 20 | not applicable | no word sounds |
| 21 | fine | kinds worked in lines |
| 22 | not applicable | no first parts |
| 23 | fine | question words said |
| 24 | fine | kinds modeled |
| 25 | fine | no seed pattern |
| 26 | defect | MF14 Yes 68.4 |
| 27 | defect | MF14 rounds over 60 |
| 28 | not applicable | no letters |
| 29 | fine | rules fit their sets |
| 30 | fine | no story bank |
| 31 | fine | no story bank |

### animal-sounds

| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | quotes exact; parts named |
| 2 | fine | asked words in script |
| 3 | fine | reasons whole; pictures named |
| 4 | fine | no false fact found |
| 5 | fine | waits earmarked |
| 6 | fine | places even, seeds 1-2000 |
| 7 | fine | reasons true, held back |
| 8 | fine | reads as one sentence |
| 9 | fine | More right fair or empty |
| 10 | fine | P101 duck and dog |
| 11 | fine | every choice drawn |
| 12 | fine | 2027 texts |
| 13 | fine | no echo found |
| 14 | fine | grown-up near |
| 15 | fine | six sounds played |
| 16 | fine | no voice taught |
| 17 | not applicable | no grammar |
| 18 | fine | no yes or no bank |
| 19 | not applicable | no word parts |
| 20 | not applicable | no word sounds |
| 21 | defect | SC10 two at once unworked |
| 22 | not applicable | no first parts |
| 23 | defect | SC10 same time not heard |
| 24 | defect | SC10 kind not modeled |
| 25 | fine | no seed pattern |
| 26 | defect | SC10 question only 100 |
| 27 | fine | rounds under limits |
| 28 | not applicable | no letters |
| 29 | fine | rules fit their sets |
| 30 | fine | no story bank |
| 31 | defect | SC10 kind not asked |

### helpers-all-around

| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | quotes exact; parts named |
| 2 | defect | SC12 treats unsaid |
| 3 | fine | P121 to P124, P140, P141 |
| 4 | fine | no false fact found |
| 5 | fine | waits earmarked |
| 6 | fine | places even, seeds 1-2000 |
| 7 | fine | reasons true, held back |
| 8 | fine | reads as one sentence |
| 9 | fine | More right fair or empty |
| 10 | fine | receptive cited; pictures named |
| 11 | fine | every choice drawn |
| 12 | fine | 2027 texts |
| 13 | defect | SC12 teaches, Teacher |
| 14 | fine | grown-up near |
| 15 | fine | five helpers played |
| 16 | fine | no voice taught |
| 17 | not applicable | no grammar |
| 18 | fine | no yes or no bank |
| 19 | not applicable | no word parts |
| 20 | not applicable | no word sounds |
| 21 | fine | kinds worked in lines |
| 22 | not applicable | no first parts |
| 23 | defect | SC12 treats unsaid |
| 24 | fine | kinds modeled |
| 25 | fine | no seed pattern |
| 26 | fine | firefighter 42.8 review, mild |
| 27 | fine | rounds under limits |
| 28 | not applicable | no letters |
| 29 | fine | rules fit their sets |
| 30 | fine | no story bank |
| 31 | fine | no story bank |

## Opened

Opened
- module feelings-show
- module match-the-vehicles
- module two-steps
- module talk-with-a-friend
- module taking-turns
- module which-came-first
- module good-friend
- module things-we-do
- module colours
- module red-and-blue
- module people-and-events
- module help-a-friend
- module say-it-to-fit
- module please-and-thank-you
- module how-friends-feel
- module play-with-a-plan
- module join-in-play
- module voice-tells-more
- module circle-and-square
- module talk-about-it
- module patterns
- module things-that-happen
- module animal-sounds
- module helpers-all-around
- bank p4-feel-does seeds 1-2000
- bank p4-feel-tells seeds 1-2000
- bank p4-feel-say seeds 1-2000
- bank p4-feel-okay seeds 1-2000
- bank p4-feel-calm seeds 1-2000
- bank pm-same-vehicles seeds 1-2000
- bank pm-different-vehicles seeds 1-2000
- bank pm-vehicle-where seeds 1-2000
- bank pm-tap-vehicle seeds 1-2000
- bank p3-steps-things seeds 1-2000
- bank p3-steps-sounds seeds 1-2000
- bank p3-steps-say-them seeds 1-2000
- bank p3-steps-which seeds 1-2000
- bank p3-steps-yesno seeds 1-2000
- bank p3-talk-listen seeds 1-2000
- bank p3-talk-turn seeds 1-2000
- bank p3-talk-hi-bye seeds 1-2000
- bank p3-talk-yesno seeds 1-2000
- bank p3-talk-room seeds 1-2000
- bank pk-turn-choice seeds 1-2000
- bank ck-good-choice seeds 1-2000
- bank pk-whose-turn seeds 1-2000
- bank pk-turn-or-share seeds 1-2000
- bank pk-while-waiting seeds 1-2000
- bank p4-which-came-first seeds 1-2000
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
- bank pc-tap-colour seeds 1-2000
- bank pc-name-colour seeds 1-2000
- bank pc-same-colour seeds 1-2000
- bank pc-different-colour seeds 1-2000
- bank pc-colour-of-thing seeds 1-2000
- bank p3-tap-red-blue seeds 1-2000
- bank p3-which-colour seeds 1-2000
- bank p3-sort-red-blue seeds 1-2000
- bank p3-people-tap seeds 1-2000
- bank p3-people-who seeds 1-2000
- bank p3-people-yesno seeds 1-2000
- bank p3-people-group seeds 1-2000
- bank p3-people-grownup seeds 1-2000
- bank p3-help-who seeds 1-2000
- bank p3-help-kind seeds 1-2000
- bank p3-help-grownup seeds 1-2000
- bank p3-help-ball seeds 1-2000
- bank p3-help-yesno seeds 1-2000
- bank p4-fit-voice seeds 1-2000
- bank p4-fit-why seeds 1-2000
- bank p4-fit-say seeds 1-2000
- bank p4-fit-enough seeds 1-2000
- bank p4-fit-yesno seeds 1-2000
- bank pk3-magic-word seeds 1-2000
- bank p4-same-or-different seeds 1-2000
- bank p4-friend-feels seeds 1-2000
- bank p4-new-feeling-moment seeds 1-2000
- bank p4-new-feeling-face seeds 1-2000
- bank p4-friends-yesno seeds 1-2000
- bank p4-play-plan seeds 1-2000
- bank p4-play-part seeds 1-2000
- bank p4-plan-yesno seeds 1-2000
- bank p4-plan-together seeds 1-2000
- bank p4-plan-what seeds 1-2000
- bank p3-join-how seeds 1-2000
- bank p3-join-yesno seeds 1-2000
- bank p3-join-not-now seeds 1-2000
- bank p3-join-face seeds 1-2000
- bank p3-join-turn seeds 1-2000
- bank p4-tone-ask seeds 1-2000
- bank p4-tone-feel seeds 1-2000
- bank p4-tone-strong seeds 1-2000
- bank p4-tone-which seeds 1-2000
- bank p4-tone-yesno seeds 1-2000
- bank p3-tap-shape seeds 1-2000
- bank p3-name-shape seeds 1-2000
- bank p3-shape-by-corners seeds 1-2000
- bank p3-shape-thing seeds 1-2000
- bank p3-same-shape-any-size seeds 1-2000
- bank p3-talk-say-back seeds 1-2000
- bank p3-talk-topic seeds 1-2000
- bank p3-talk-about-yesno seeds 1-2000
- bank p3-talk-why seeds 1-2000
- bank p3-talk-feel seeds 1-2000
- bank pp-what-next seeds 1-2000
- bank pp-which-repeats seeds 1-2000
- bank pp-missing seeds 1-2000
- bank p3-event-what seeds 1-2000
- bank p3-event-tap seeds 1-2000
- bank p3-event-yesno seeds 1-2000
- bank p3-event-name seeds 1-2000
- bank p3-event-picture seeds 1-2000
- bank p3-animal-sound seeds 1-2000
- bank p3-animal-says seeds 1-2000
- bank p3-animal-order seeds 1-2000
- bank p3-two-at-once seeds 1-2000
- bank ck-which-helper seeds 1-2000
- bank ck-job-tool seeds 1-2000
- bank pk-helper-where seeds 1-2000
- bank pk-helper-scene seeds 1-2000
- file READ-LIST-lesson.md
- file CLAUDE.md
- file CLAUDE-PART-2.md
- file CLAUDE-PART-3.md
- file docs/INDEPENDENT-CHECKS.md 58-75
- file docs/INDEPENDENT-CHECKS.md 237-282
- file docs/DECISIONS.md
- file docs/HANDOFF.md 1-6
- file docs/EARMARKS.md 1-4
- file docs/EARMARKS.md 27-39
- file docs/EARMARKS.md 43-43
- file docs/EARMARKS.md 152-152
- file docs/RULES-AUDIT.md 296-296
- file docs/RULES-AUDIT.md 307-307
- file docs/ALGORITHMS.md 755-764
- file docs/standards/README.md 1-12
- file docs/standards/tea-pk3-2027-recommended.txt
- file docs/standards/tea-pk4-2027-recommended.txt
- file docs/standards/tea-pk4-2022-domains-1-5-10.txt 18-21
- file docs/standards/elof-preschool-lc-lit-atl-pmp.txt
- file docs/standards/elof-preschool-math-sci-se.txt
- file docs/standards/elof-preschool-indicators-se.txt
- file src/curriculum.mjs 637-649
- file src/logic.mjs 5082-5090
- file src/logic.mjs 7433-7442
- file src/logic.mjs 8240-8275
- file src/logic.mjs 22660-22668
- file src/logic.mjs 22072-22080
- file src/logic.mjs 31135-31142
- file src/logic.mjs 31389-31389
- file src/logic.mjs 31913-31913
- file src/logic.mjs 31962-31967
- file src/logic.mjs 32120-32132
- file src/logic.mjs 32160-32180
- file src/logic.mjs 36100-36120
- file src/logic.mjs 36265-36330
- file src/logic.mjs 36717-36728
- file src/logic.mjs 36780-36800
- file src/logic.mjs 41609-41640
- file tests/logic.test.mjs 11705-11711
- file tools/course-packet.mjs
- file tools/blind-read.mjs 1-57
- tool tools/blind-read.mjs
- tool tools/picture-candidates.mjs
