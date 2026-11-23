# Lesson read, round two: 24 modules of pre-K 3 and pre-K 4

Reader: the lesson reader, on the frozen copy lr-b. Every module on READ-LIST-lesson.md was read: its citations, its script line by line with its pictures, and every bank over seeds 1 to 600 (every distinct row, each row's wrong choices, explanation, reasons and More right answers), with tools/blind-read.mjs run alone (2,000 seeds) and with --rounds on each module.

Three things the lead should know first.

- The round brief names lines 237 to 275 for the lesson brief. In this copy the brief runs from line 245 to line 282 (items 1 to 31 and a closing paragraph). I read 237 to 282 and How (58 to 75), whole.
- The checklist asks for 31 rows for each of 24 modules. Those 744 rows cannot fit under 3,000 words, so the findings and CLEAN are kept under about 2,000 words and the tables are terse.
- Not read whole: the published texts in docs/standards (I leaned on the coverage test, which passed, 386 of 386, so no quote was re-read word for word by me); EARMARKS rows E12 and E13 (first 2,500 characters of each); and the 215 order rows of two-steps and the 376 rows of patterns, which I recomputed by script (0 wrong in 3,000 and 4,000 seeds) and sampled by eye. The src/logic.mjs lines in the Opened list were read around the named row, not from end to end. I was given no task packet, so every finding's rule comes from the brief itself.

**Strongest objection before anything is called clean.** Ten single rows or lines are wrong in ways no test reads (the scripts test passes, 95 of 95), each a small slip inside an otherwise sound table. Faults of that kind hide wherever I read a template and not each row, so the two script-checked banks above, and the quotes, are the likeliest places for an eleventh.

## MUST FIX

1. **feelings-show, bank p4-feel-tells, the Rosa row (seed 1; src/logic.mjs line 36284).** The reason for the sad face says "tight fists can show you feel scared". Script line 2 and the row's own explanation say mad. Fix: `'tight fists can show you feel mad'`. (Items 3, 7.)
2. **red-and-blue, script line 4, the written lesson's third paragraph and P3_COLOR_MORE.red (lines 5090 and 22666).** "Fire trucks are always red, and so are apples." Some fire trucks are yellow, white or lime green, and apples are green and yellow too; the next line already says "often" of the sea. Fix, in all three places: "Fire trucks are often red, and so are many apples." (Items 4, 9, and 17's claim of always.)
3. **things-we-do, bank p4-act-yesno, seed 18 (line 31913).** "At art time, do you draw with it?" names nothing. Fix: "At art time, do you draw with a crayon?", and its reason "would mean you do not draw with a crayon at art time, but you do." (Items 2, 8.)
4. **people-and-events, bank p3-people-yesno, seed 20 (line 31389).** "Does a teacher help children learn at school?" has the reason "No would mean a teacher cannot read stories to the class, but a teacher can." Fix: "would mean a teacher does not help children learn at school, but a teacher does." (Items 7, 11.)
5. **please-and-thank-you, bank pk3-magic-word, seed 30 (line 36797).** "What do you say when someone hands you a cracker?" offers Thanks as the wrong choice, with "Saying thanks does not show you are glad". Thanks is a thank you. Fix: wrong choice `'Mine'`, reason "does not thank them, and thank you shows you are glad." (Items 2, 7.)
6. **two-steps, bank p3-steps-yesno, seed 14 (line 31142).** "Is it okay to hold your cup while you listen to both steps?" is answered No, with "Put your cup down" and "your hands stay still to listen". No line teaches it, and a child may fairly hold a cup and listen. Fix: replace the row with "Get a cup, and then get a spoon. Is getting the spoon the first step?", No, "No. The first step is, get a cup, and then the second step is, get a spoon.", "would mean getting the spoon is the first step, but the first step is, get a cup." The bank's Yes share stays 67 percent, so see SHOULD 14. (Items 2, 9, 18, and the brief's closing paragraph.)
7. **voice-tells-more, bank p4-tone-yesno, seed 4 (line 32172).** "When you talk with a doctor you have just met, do you look in their eyes?" Yes, "Look in their eyes, so they can understand you." Script line 10 says "turn toward them", and item 2 forbids asking for eye contact. Fix: "When you talk with a doctor you have just met, do you say your words slowly and clearly?", Yes, "Yes. Say your words slowly and clearly, and turn toward them, so they can understand you.", "would mean you do not say your words slowly and clearly, but slow, clear words help someone new understand you." (Item 2.)
8. **say-it-to-fit, bank p4-fit-yesno, seed 12 (line 31967).** "On the playground, can a friend far away hear your big outside voice?" asks about hearing, the very row the brief's closing paragraph names as wrong. Fix: "On the playground by the slide, does a big outside voice fit?", Yes, "Yes. On the playground by the slide, you can use a big outside voice, like, over here!", "would mean a big outside voice does not fit the playground, but it does." (Item 2 and the closing paragraph.)
9. **which-came-first, script line 5 (line 8268).** "Listen again. Quack, then meow. Now the duck came first." shows the cat alone. Fix: `show: { kind: 'pair', a: { kind: 'pic', name: 'duck' }, b: { kind: 'pic', name: 'cat' } }`. (Items 3, 10.)
10. **patterns, bank pp-which-repeats, every Yes row (line 22078; 48 of the 162 rows seen).** More right answers reads "Say each one out loud, and listen for the part that comes back.", a method. Fix: "Circle, square, circle, square repeats the same way each time, so it is a pattern." (Items 2, 9.)

## SHOULD CONSIDER

1. **match-the-vehicles, citation of P-SCI 3.** The quote opens "With increasing independence" and names "weight, sound, or texture"; the "in part" names only the measurement tools. Say it as Say it to fit's citation does: add "while sorting with increasing independence is the child's own (EARMARKS E13)". (Item 1.)
2. **help-a-friend, P-SE 5 cited whole.** "Begins to recognize and describe social problems": line 6 says only "That is a problem." Either add "You can say, we both want the ball." to line 6, or cite in part. Please and thank you's citation leans on it. (Item 1.)
3. **talk-about-it, banks p3-talk-say-back, p3-talk-about-yesno, p3-talk-why, p3-talk-feel.** The only off-topic replies are "I want a glass of water" and "I like pizza". A child who learns those two are wrong reads 100 percent in p3-talk-say-back (blind-read, heard only the question) and answers the other three the same way. Fix: also deal another row's right reply as the wrong choice ("What is its name?" after "I have a new hat!"), so the topic must be heard. (Items 16, 25.)
4. **Things a bank asks that no line of its lesson says.** taking-turns: pk-turn-choice asks the slide, a book, the red crayon and a box of blocks, and says "Taking turns works with the slide and a new book too"; add Please and thank you's line 6 ("Taking turns works with lots of things, like the slide, the swing and a new book.") to this script. play-with-a-plan: p4-play-part's bus, store, tea party and big picture; add one line ("A plan fits any game, a store, a bus or a tea party."). circle-and-square: p3-shape-thing's "A wheel is round too"; use "Many plates are round like a circle too." (Items 2, 9.)
5. **Words asked or named that no line says.** colours: pc-same-colour shows triangles and its reasons name them. red-and-blue: "Tap the blue square", "What color is this triangle?" (the script says only circle; add "a square and a triangle" to line 6, whose picture already draws them). helpers-all-around: "Who treats you when you are sick?" and "Who teaches you at school?" (say "helps you get well", "helps you learn"). (Items 2, 7, 17.)
6. **good-friend, p4-when-grownup seeds 18 and 20.** "Should you get a grown-up when ..." with No right teaches that fetching a grown-up is wrong. Ask "Do you need a grown-up when ...", as line 10 and the bank's other rows do. (Item 14.)
7. **Reasons in another lesson's words.** good-friend: p4-kind-words seed 1 ("every feeling is okay to have"), p4-when-grownup seed 9 ("the biggest feelings"); use "Grown-ups know how to help." voice-tells-more: p4-tone-feel's "a tear rolling out" and "a big smile" are First Steps' words, another course; say "The sad face is for a slow, soft, low voice." (Item 30.)
8. **Faces a bank offers that its lesson never draws.** help-a-friend p3-help-who (the mad face, and reasons by signs no line says); join-in-play p3-join-face seed 12 (the scared face). Draw them on a line, or offer only the faces drawn. (Items 11, 30.)
9. **match-the-vehicles, pm-tap-vehicle.** With three choices, a first wrong tap hears "The rocket goes up into space, and a boat goes on the water", the answer's sign while two are open. Say "The rocket goes up into space, so it is not the boat." (Item 7.)
10. **Kinds never asked in a line.** match-the-vehicles: two alike and one different among three. things-we-do: "At bedtime, what do you do?" and "Which one goes with bedtime?". (Items 21, 24, 31.)
11. **say-it-to-fit.** p4-fit-voice: A big outside voice is the wrong choice in 5 of 6 rows (84.4 percent by the question alone); offer a whisper for the classroom and an inside voice for the sleeping baby. p4-fit-enough: the answer is the longer choice on every seed (82.2; EARMARKS A180 names it). (Items 16, 17.)
12. **A right answer never offered as a wrong one.** feelings-show p4-feel-say: "I feel happy" (62.4 alone, 63.1 in doses). please-and-thank-you pk3-magic-word: Please and Thank you never stand against each other (75.7), so the bank never asks a child to tell them apart. (Item 25.)
13. **Leaning by place or thing.** taking-turns pk-turn-or-share: the first button reads 56.9 to 58.4 (choices in the prompt's order, 4 of 7 Taking turns); add one sharing row. circle-and-square p3-shape-thing: the ball reads 68.5. (Items 6, 26.)
14. **Yes shares, and questions about ability.** Marked: voice-tells-more p4-tone-yesno 70.0 to 71.8, two-steps p3-steps-yesno 65.7 to 67.9, things-that-happen p3-event-yesno 65.2 to 68.4, people-and-events p3-people-yesno 61.1 to 63.7, good-friend p4-good-yesno and join-in-play p3-join-yesno to 60.2. Leaning inside the bound: feelings-show p4-feel-okay 58.1, how-friends-feel 58.3, help-a-friend 57.9. Add taught No rows. Ability rows: "Can saying the steps ... help", "can you use a whisper", "Can you use words to say how you feel?", "Can you ask a friend how they feel?". (Item 18.)
15. **play-with-a-plan, p4-plan-what.** "Let's play pizza shop! What will you make?" and "can you pass me a block? What will your friend pass you?" say their answers' names. If this is a listening bank by design, record it. (Item 13.)
16. **voice-tells-more, script line 9.** Two turns in one line; the first does not end its line. Split it. (Item 21.)
17. **taking-turns, script line 7.** "Waiting can drive you bananas" is an idiom with no picture. Say "Waiting can feel hard, and that is okay." (Item 10.)

## CLEAN

- **No findings:** talk-with-a-friend, how-friends-feel (but its ability row), animal-sounds. things-that-happen is sound but for its Yes share.
- **Citations:** every Sources line names the 2027 recommendations; wherever a Head Start progression is quoted, a pre-K 3 lesson quotes 36 to 48 months and a pre-K 4 lesson 48 to 60; every sister lesson a citation names exists under that title; each "in part" I could check against the script says what the lines teach, but SHOULD 1 and 2.
- **Answers:** recomputed by script with 0 wrong: two-steps' three order banks, animal-sounds' four banks and which-came-first (answers, explanations, reasons, More right answers), and patterns' three banks, where no wrong choice also makes a pattern. Every other bank read row by row.
- **Fair wrong choices:** a book is never wrong for bedtime; a firefighter never wrong for keeping people safe; green never wrong for a lemon, a banana or the grass; watching first is a right answer in join-in-play; no near pair of faces is set against each other.
- **Say-along games** (eight vocabulary lessons): each follows a line ending on its word, five steps, "Great job!" and the clear one; no unsafe image.
- **Blind marks I judge to be the lesson, for BY_DESIGN:** pk-turn-choice, Take turns, 78.9; ck-good-choice, Help pick them up, 67.5; pk-while-waiting, Cheer for your friend, 67.3. Each row sets one of the lesson's kind acts beside an unkind one, and no right answer is ever a wrong choice. The "saw only the picture" 100s (fifteen banks), p3-talk-topic's story-only 100 and p3-two-at-once's question-only 100 are the question itself.
- Findings whose rule was in my packet: none, since no packet was given. Findings whose rule came from the brief alone: all 27.

## The tables

### feelings-show

| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | I.B.2.a, I.B.2.b, I.B.2.c, P-SE 8, P-SE 6; lines 0-12 |
| 2 | fine | 5 banks, seeds 1-600 |
| 3 | defect | p4-feel-tells seed 1: reason says tight fists show scared (MUST 1) |
| 4 | fine | no false fact found |
| 5 | fine | E13 or sister lessons named |
| 6 | fine | answer place even |
| 7 | defect | same row, More Info false (MUST 1) |
| 8 | fine | reads as one sentence |
| 9 | fine | examples, no tips |
| 10 | fine | line pictures match |
| 11 | fine | choices drawn; reasons on topic |
| 12 | fine | 2027 edition named |
| 13 | fine | no echo heard |
| 14 | fine | nothing unsafe |
| 15 | not applicable | no vocabulary code |
| 16 | fine | no voice taught; foils vary |
| 17 | not applicable | no grammar forms |
| 18 | defect | p4-feel-okay Yes 57.0-58.1 (SHOULD 14) |
| 19 | not applicable | no word parts |
| 20 | not applicable | no word sounds |
| 21 | fine | each kind modeled |
| 22 | not applicable | no first parts |
| 23 | fine | wrong pictures vary |
| 24 | fine | nothing told by look |
| 25 | defect | p4-feel-say: I feel happy never wrong, 63.1 (SHOULD 12) |
| 26 | fine | blind-read: 5 marks read |
| 27 | fine | blind-read --rounds read |
| 28 | not applicable | no letter names |
| 29 | not applicable | no end marks, letter sizes |
| 30 | fine | reasons use this lesson's signs |
| 31 | not applicable | no mirrored stories |

### match-the-vehicles

| Item | Verdict | Evidence |
|---|---|---|
| 1 | defect | P-SCI 3 "in part" names only the tools (SHOULD 1) |
| 2 | fine | 4 banks, seeds 1-600 |
| 3 | fine | explanations, line pictures read |
| 4 | fine | no false fact found |
| 5 | fine | E13 or sister lessons named |
| 6 | fine | answer place even |
| 7 | defect | pm-tap-vehicle: reason says the answer's sign, two open (SHOULD 9) |
| 8 | fine | reads as one sentence |
| 9 | fine | examples, no tips |
| 10 | fine | line pictures match |
| 11 | fine | choices drawn; reasons on topic |
| 12 | fine | 2027 edition named |
| 13 | fine | no echo heard |
| 14 | fine | nothing unsafe |
| 15 | not applicable | no vocabulary code |
| 16 | fine | no voice taught; foils vary |
| 17 | not applicable | no grammar forms |
| 18 | not applicable | no yes or no bank |
| 19 | not applicable | no word parts |
| 20 | not applicable | no word sounds |
| 21 | defect | odd one of three never modeled (SHOULD 10) |
| 22 | not applicable | no first parts |
| 23 | fine | wrong pictures vary |
| 24 | fine | nothing told by look |
| 25 | fine | no pattern found |
| 26 | fine | blind-read: 1 marks read |
| 27 | fine | blind-read --rounds read |
| 28 | not applicable | no letter names |
| 29 | not applicable | no end marks, letter sizes |
| 30 | not applicable | no story bank |
| 31 | not applicable | no mirrored stories |

### two-steps

| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | II.A.2, P-ATL 8; lines 0-10 |
| 2 | defect | p3-steps-yesno seed 14, hold your cup: untaught, unfair (MUST 6); order banks recomputed, 3,000 seeds |
| 3 | fine | explanations, line pictures read |
| 4 | fine | no false fact found |
| 5 | fine | E12 or sister lessons named |
| 6 | fine | answer place even |
| 7 | fine | reasons read, true |
| 8 | fine | reads as one sentence |
| 9 | defect | same row: reason's words in no line (MUST 6) |
| 10 | fine | line pictures match |
| 11 | fine | choices drawn; reasons on topic |
| 12 | fine | 2027 edition named |
| 13 | fine | no echo heard |
| 14 | fine | nothing unsafe |
| 15 | not applicable | no vocabulary code |
| 16 | fine | no voice taught; foils vary |
| 17 | not applicable | no grammar forms |
| 18 | defect | p3-steps-yesno Yes 65.7-67.9 (MUST 6, SHOULD 14) |
| 19 | not applicable | no word parts |
| 20 | not applicable | no word sounds |
| 21 | fine | each kind modeled |
| 22 | not applicable | no first parts |
| 23 | fine | wrong pictures vary |
| 24 | fine | nothing told by look |
| 25 | fine | no pattern found |
| 26 | fine | blind-read: 1 marks read |
| 27 | fine | blind-read --rounds read |
| 28 | not applicable | no letter names |
| 29 | not applicable | no end marks, letter sizes |
| 30 | not applicable | no story bank |
| 31 | not applicable | no mirrored stories |

### talk-with-a-friend

| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | I.A.1, I.C.1, II.B.2, P-SE 3, P-LC 4; lines 0-11 |
| 2 | fine | 5 banks, 22 rows; turn toward, never look |
| 3 | fine | explanations, line pictures read |
| 4 | fine | no false fact found |
| 5 | fine | E12 or sister lessons named |
| 6 | fine | answer place even |
| 7 | fine | reasons read, true |
| 8 | fine | reads as one sentence |
| 9 | fine | examples, no tips |
| 10 | fine | line pictures match |
| 11 | fine | choices drawn; reasons on topic |
| 12 | fine | 2027 edition named |
| 13 | fine | no echo heard |
| 14 | fine | nothing unsafe |
| 15 | not applicable | no vocabulary code |
| 16 | fine | no voice taught; foils vary |
| 17 | not applicable | no grammar forms |
| 18 | fine | p3-talk-yesno Yes 49.3-50.9 |
| 19 | not applicable | no word parts |
| 20 | not applicable | no word sounds |
| 21 | fine | each kind modeled |
| 22 | not applicable | no first parts |
| 23 | fine | wrong pictures vary |
| 24 | fine | nothing told by look |
| 25 | fine | no pattern found |
| 26 | fine | p3-talk-listen 75.2 held in BY_DESIGN |
| 27 | fine | blind-read --rounds read |
| 28 | not applicable | no letter names |
| 29 | not applicable | no end marks, letter sizes |
| 30 | not applicable | no story bank |
| 31 | not applicable | no mirrored stories |

### taking-turns

| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | I.C.5, I.B.1.a, I.C.6, I.B.2.c, P-SE 5, P-SE 3, P-SE 8, P-SE 7; lines 0-8 |
| 2 | fine | 5 banks, seeds 1-600 |
| 3 | fine | explanations, line pictures read |
| 4 | fine | no false fact found |
| 5 | fine | E13 or sister lessons named |
| 6 | defect | pk-turn-or-share first button 58.4 (SHOULD 13) |
| 7 | fine | reasons read, true |
| 8 | fine | reads as one sentence |
| 9 | defect | slide, book, crayon, blocks in no line (SHOULD 4) |
| 10 | defect | line 7 "drive you bananas" (SHOULD 17) |
| 11 | fine | choices drawn; reasons on topic |
| 12 | fine | 2027 edition named |
| 13 | fine | no echo heard |
| 14 | fine | nothing unsafe |
| 15 | not applicable | no vocabulary code |
| 16 | fine | no voice taught; foils vary |
| 17 | not applicable | no grammar forms |
| 18 | not applicable | no yes or no bank |
| 19 | not applicable | no word parts |
| 20 | not applicable | no word sounds |
| 21 | fine | each kind modeled |
| 22 | not applicable | no first parts |
| 23 | fine | wrong pictures vary |
| 24 | fine | nothing told by look |
| 25 | fine | no pattern found |
| 26 | fine | three same-choice marks judged by design (CLEAN) |
| 27 | fine | blind-read --rounds read |
| 28 | not applicable | no letter names |
| 29 | not applicable | no end marks, letter sizes |
| 30 | not applicable | no story bank |
| 31 | not applicable | no mirrored stories |

### which-came-first

| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | II.A.1, II.D.1, P-ATL 8, P-MATH 4, P-LC 1; lines 0-6 |
| 2 | fine | 1 bank, 30 rows, recomputed over 3,000 seeds |
| 3 | defect | line 5 says the duck, shows the cat (MUST 9) |
| 4 | fine | no false fact found |
| 5 | fine | E13 or sister lessons named |
| 6 | fine | answer place even |
| 7 | fine | reasons read, true |
| 8 | fine | reads as one sentence |
| 9 | fine | examples, no tips |
| 10 | defect | same line (MUST 9) |
| 11 | fine | choices drawn; reasons on topic |
| 12 | fine | 2027 edition named |
| 13 | fine | no echo heard |
| 14 | fine | nothing unsafe |
| 15 | fine | first and second played, lines 3-4 |
| 16 | fine | no voice taught; foils vary |
| 17 | not applicable | no grammar forms |
| 18 | not applicable | no yes or no bank |
| 19 | not applicable | no word parts |
| 20 | not applicable | no word sounds |
| 21 | fine | each kind modeled |
| 22 | not applicable | no first parts |
| 23 | fine | wrong pictures vary |
| 24 | fine | nothing told by look |
| 25 | fine | no pattern found |
| 26 | fine | blind-read: no mark |
| 27 | fine | blind-read --rounds read |
| 28 | not applicable | no letter names |
| 29 | not applicable | no end marks, letter sizes |
| 30 | not applicable | no story bank |
| 31 | not applicable | no mirrored stories |

### good-friend

| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | I.C.6, I.C.5, P-SE 7, P-SE 5, P-SE 4; lines 0-12 |
| 2 | fine | 5 banks, seeds 1-600 |
| 3 | fine | explanations, line pictures read |
| 4 | fine | no false fact found |
| 5 | fine | E13 or sister lessons named |
| 6 | fine | answer place even |
| 7 | fine | reasons read, true |
| 8 | fine | reads as one sentence |
| 9 | fine | examples, no tips |
| 10 | fine | line pictures match |
| 11 | fine | choices drawn; reasons on topic |
| 12 | fine | 2027 edition named |
| 13 | fine | no echo heard |
| 14 | defect | p4-when-grownup seeds 18, 20: "Should you get a grown-up" No (SHOULD 6) |
| 15 | not applicable | no vocabulary code |
| 16 | fine | no voice taught; foils vary |
| 17 | not applicable | no grammar forms |
| 18 | defect | p4-good-yesno Yes 59.5-60.2 (SHOULD 14) |
| 19 | not applicable | no word parts |
| 20 | not applicable | no word sounds |
| 21 | fine | each kind modeled |
| 22 | not applicable | no first parts |
| 23 | fine | wrong pictures vary |
| 24 | fine | nothing told by look |
| 25 | fine | no pattern found |
| 26 | fine | three BY_DESIGN marks still read |
| 27 | fine | blind-read --rounds read |
| 28 | not applicable | no letter names |
| 29 | not applicable | no end marks, letter sizes |
| 30 | defect | two reasons in another lesson's words (SHOULD 7) |
| 31 | not applicable | no mirrored stories |

### things-we-do

| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | II.D.1, P-LC 6; lines 0-12 |
| 2 | defect | p4-act-yesno seed 18 "draw with it" (MUST 3) |
| 3 | fine | explanations, line pictures read |
| 4 | fine | no false fact found |
| 5 | fine | E13 or sister lessons named |
| 6 | fine | answer place even |
| 7 | fine | reasons read, true |
| 8 | defect | same row: it names nothing (MUST 3) |
| 9 | fine | examples, no tips |
| 10 | fine | line pictures match |
| 11 | fine | choices drawn; reasons on topic |
| 12 | fine | 2027 edition named |
| 13 | fine | bus and park fair lists leave two foils |
| 14 | fine | nothing unsafe |
| 15 | fine | action, scissors, lunchtime played |
| 16 | fine | no voice taught; foils vary |
| 17 | not applicable | no grammar forms |
| 18 | fine | p4-act-yesno Yes 49.7-50.9 |
| 19 | not applicable | no word parts |
| 20 | not applicable | no word sounds |
| 21 | fine | each kind modeled |
| 22 | not applicable | no first parts |
| 23 | fine | wrong pictures vary |
| 24 | fine | nothing told by look |
| 25 | fine | no pattern found |
| 26 | fine | blind-read: 2 marks read |
| 27 | fine | blind-read --rounds read |
| 28 | not applicable | no letter names |
| 29 | not applicable | no end marks, letter sizes |
| 30 | not applicable | no story bank |
| 31 | defect | two kinds worked, never asked in a line (SHOULD 10) |

### colours

| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | V.D.1, II.D.1, VI.B.1, P-SCI 1; lines 0-8 |
| 2 | fine | 5 banks; red and green apart but by name (A11) |
| 3 | fine | explanations, line pictures read |
| 4 | fine | no false fact found |
| 5 | fine | E13 or sister lessons named |
| 6 | fine | answer place even |
| 7 | defect | pc-same-colour names triangles no line names (SHOULD 5) |
| 8 | fine | reads as one sentence |
| 9 | fine | examples, no tips |
| 10 | fine | line pictures match |
| 11 | fine | choices drawn; reasons on topic |
| 12 | fine | 2027 edition named |
| 13 | fine | no echo heard |
| 14 | fine | nothing unsafe |
| 15 | fine | four color words played |
| 16 | fine | no voice taught; foils vary |
| 17 | not applicable | no grammar forms |
| 18 | not applicable | no yes or no bank |
| 19 | not applicable | no word parts |
| 20 | not applicable | no word sounds |
| 21 | fine | each kind modeled |
| 22 | not applicable | no first parts |
| 23 | fine | wrong pictures vary |
| 24 | fine | nothing told by look |
| 25 | fine | no pattern found |
| 26 | fine | blind-read: 2 marks read |
| 27 | fine | blind-read --rounds read |
| 28 | not applicable | no letter names |
| 29 | not applicable | no end marks, letter sizes |
| 30 | not applicable | no story bank |
| 31 | not applicable | no mirrored stories |

### red-and-blue

| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | V.D.1, VI.B.1, II.D.1, P-SCI 1, P-SCI 3; lines 0-7 |
| 2 | defect | prompts say square, triangle; script says circle only (SHOULD 5) |
| 3 | fine | explanations, line pictures read |
| 4 | defect | line 4 "always red" (MUST 2) |
| 5 | fine | E12 or sister lessons named |
| 6 | fine | answer place even |
| 7 | fine | reasons read, true |
| 8 | fine | reads as one sentence |
| 9 | defect | red rows repeat the false line (MUST 2) |
| 10 | fine | line pictures match |
| 11 | fine | choices drawn; reasons on topic |
| 12 | fine | 2027 edition named |
| 13 | fine | no echo heard |
| 14 | fine | nothing unsafe |
| 15 | fine | red and blue played |
| 16 | fine | no voice taught; foils vary |
| 17 | not applicable | no grammar forms |
| 18 | not applicable | no yes or no bank |
| 19 | not applicable | no word parts |
| 20 | not applicable | no word sounds |
| 21 | fine | each kind modeled |
| 22 | not applicable | no first parts |
| 23 | fine | wrong pictures vary |
| 24 | fine | nothing told by look |
| 25 | fine | no pattern found |
| 26 | fine | blind-read: no mark |
| 27 | fine | blind-read --rounds read |
| 28 | not applicable | no letter names |
| 29 | not applicable | no end marks, letter sizes |
| 30 | not applicable | no story bank |
| 31 | not applicable | no mirrored stories |

### people-and-events

| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | II.D.1, VII.B.3, P-LC 7; lines 0-10 |
| 2 | fine | 5 banks, seeds 1-600 |
| 3 | fine | explanations, line pictures read |
| 4 | fine | no false fact found |
| 5 | fine | E12 or sister lessons named |
| 6 | fine | answer place even |
| 7 | defect | p3-people-yesno seed 20 reason off its question (MUST 4) |
| 8 | fine | reads as one sentence |
| 9 | fine | examples, no tips |
| 10 | fine | line pictures match |
| 11 | defect | same row (MUST 4) |
| 12 | fine | 2027 edition named |
| 13 | fine | no echo heard |
| 14 | fine | baby icon, no scene; grown-ups on line 6 |
| 15 | fine | six words played |
| 16 | fine | no voice taught; foils vary |
| 17 | not applicable | no grammar forms |
| 18 | defect | p3-people-yesno Yes 61.1-63.7 (SHOULD 14) |
| 19 | not applicable | no word parts |
| 20 | not applicable | no word sounds |
| 21 | fine | each kind modeled |
| 22 | not applicable | no first parts |
| 23 | fine | wrong pictures vary |
| 24 | fine | nothing told by look |
| 25 | fine | no pattern found |
| 26 | fine | p3-people-group in BY_DESIGN; others by arithmetic |
| 27 | fine | blind-read --rounds read |
| 28 | not applicable | no letter names |
| 29 | not applicable | no end marks, letter sizes |
| 30 | not applicable | no story bank |
| 31 | not applicable | no mirrored stories |

### help-a-friend

| Item | Verdict | Evidence |
|---|---|---|
| 1 | defect | P-SE 5 whole; "describe" has no line (SHOULD 2) |
| 2 | fine | 5 banks, seeds 1-600 |
| 3 | fine | explanations, line pictures read |
| 4 | fine | no false fact found |
| 5 | fine | E12 or sister lessons named |
| 6 | fine | answer place even |
| 7 | fine | reasons read, true |
| 8 | fine | reads as one sentence |
| 9 | fine | examples, no tips |
| 10 | fine | line pictures match |
| 11 | defect | p3-help-who mad face drawn in no line (SHOULD 8) |
| 12 | fine | 2027 edition named |
| 13 | fine | no echo heard |
| 14 | fine | nothing unsafe |
| 15 | not applicable | no vocabulary code |
| 16 | fine | no voice taught; foils vary |
| 17 | not applicable | no grammar forms |
| 18 | fine | p3-help-yesno Yes 57.0-57.9 |
| 19 | not applicable | no word parts |
| 20 | not applicable | no word sounds |
| 21 | fine | each kind modeled |
| 22 | not applicable | no first parts |
| 23 | fine | wrong pictures vary |
| 24 | fine | nothing told by look |
| 25 | fine | no pattern found |
| 26 | fine | three BY_DESIGN marks; sad face 70.7 by arithmetic |
| 27 | fine | blind-read --rounds read |
| 28 | not applicable | no letter names |
| 29 | not applicable | no end marks, letter sizes |
| 30 | defect | face signs in no line here (SHOULD 8) |
| 31 | not applicable | no mirrored stories |

### say-it-to-fit

| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | II.B.1, P-LC 3, P-LC 4; lines 0-12 |
| 2 | defect | p4-fit-yesno seed 12 asks about hearing (MUST 8) |
| 3 | fine | explanations, line pictures read |
| 4 | fine | no false fact found |
| 5 | fine | E13 or sister lessons named |
| 6 | fine | answer place even |
| 7 | fine | reasons read, true |
| 8 | fine | reads as one sentence |
| 9 | fine | examples, no tips |
| 10 | fine | line pictures match |
| 11 | fine | choices drawn; reasons on topic |
| 12 | fine | 2027 edition named |
| 13 | fine | voice, feel in ECHO_KEPT |
| 14 | fine | nothing unsafe |
| 15 | not applicable | no vocabulary code |
| 16 | defect | p4-fit-voice one foil in 5 of 6 rows, 84.4 (SHOULD 11) |
| 17 | defect | p4-fit-enough answer always longer, 82.2 (SHOULD 11) |
| 18 | defect | Yes 47.8-51.1; two ability rows (SHOULD 14) |
| 19 | not applicable | no word parts |
| 20 | not applicable | no word sounds |
| 21 | fine | each kind modeled |
| 22 | not applicable | no first parts |
| 23 | fine | wrong pictures vary |
| 24 | fine | nothing told by look |
| 25 | fine | no pattern found |
| 26 | fine | blind-read: 5 marks read |
| 27 | fine | blind-read --rounds read |
| 28 | not applicable | no letter names |
| 29 | not applicable | no end marks, letter sizes |
| 30 | not applicable | no story bank |
| 31 | not applicable | no mirrored stories |

### please-and-thank-you

| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | I.C.1, II.B.2, P-SE 2, P-SE 3, P-SE 5; lines 0-6 |
| 2 | defect | pk3-magic-word seed 30: Thanks marked wrong (MUST 5) |
| 3 | fine | explanations, line pictures read |
| 4 | fine | no false fact found |
| 5 | fine | E12 or sister lessons named |
| 6 | fine | answer place even |
| 7 | defect | same row, reason false (MUST 5) |
| 8 | fine | reads as one sentence |
| 9 | fine | examples, no tips |
| 10 | fine | line pictures match |
| 11 | fine | choices drawn; reasons on topic |
| 12 | fine | 2027 edition named |
| 13 | fine | no echo heard |
| 14 | fine | nothing unsafe |
| 15 | not applicable | no vocabulary code |
| 16 | fine | no voice taught; foils vary |
| 17 | not applicable | no grammar forms |
| 18 | not applicable | no yes or no bank |
| 19 | not applicable | no word parts |
| 20 | not applicable | no word sounds |
| 21 | fine | each kind modeled |
| 22 | not applicable | no first parts |
| 23 | fine | wrong pictures vary |
| 24 | fine | nothing told by look |
| 25 | defect | Please never set against Thank you, 75.7 (SHOULD 12) |
| 26 | fine | blind-read: 2 marks read |
| 27 | fine | blind-read --rounds read |
| 28 | not applicable | no letter names |
| 29 | not applicable | no end marks, letter sizes |
| 30 | not applicable | no story bank |
| 31 | not applicable | no mirrored stories |

### how-friends-feel

| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | I.D.1, P-SE 6; lines 0-11 |
| 2 | fine | 5 banks, 66 rows; no near-face pair seen |
| 3 | fine | explanations, line pictures read |
| 4 | fine | no false fact found |
| 5 | fine | E13 or sister lessons named |
| 6 | fine | answer place even |
| 7 | fine | reasons read, true |
| 8 | fine | reads as one sentence |
| 9 | fine | examples, no tips |
| 10 | fine | line pictures match |
| 11 | fine | choices drawn; reasons on topic |
| 12 | fine | 2027 edition named |
| 13 | fine | no echo heard |
| 14 | fine | nothing unsafe |
| 15 | not applicable | no vocabulary code |
| 16 | fine | no voice taught; foils vary |
| 17 | not applicable | no grammar forms |
| 18 | fine | p4-friends-yesno Yes 56.7-58.3 |
| 19 | not applicable | no word parts |
| 20 | not applicable | no word sounds |
| 21 | fine | each kind modeled |
| 22 | not applicable | no first parts |
| 23 | fine | wrong pictures vary |
| 24 | fine | nothing told by look |
| 25 | fine | no pattern found |
| 26 | fine | worried 68.4, happy 60.8 by arithmetic |
| 27 | fine | blind-read --rounds read |
| 28 | not applicable | no letter names |
| 29 | not applicable | no end marks, letter sizes |
| 30 | not applicable | no story bank |
| 31 | not applicable | no mirrored stories |

### play-with-a-plan

| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | I.C.4, P-SE 4; lines 0-8 |
| 2 | defect | p4-play-part settings in no line (SHOULD 4) |
| 3 | fine | explanations, line pictures read |
| 4 | fine | no false fact found |
| 5 | fine | E13 or sister lessons named |
| 6 | fine | answer place even |
| 7 | fine | reasons read, true |
| 8 | fine | reads as one sentence |
| 9 | fine | examples, no tips |
| 10 | fine | line pictures match |
| 11 | fine | choices drawn; reasons on topic |
| 12 | fine | 2027 edition named |
| 13 | defect | p4-plan-what prompts name their answers (SHOULD 15) |
| 14 | fine | nothing unsafe |
| 15 | not applicable | no vocabulary code |
| 16 | fine | no voice taught; foils vary |
| 17 | not applicable | no grammar forms |
| 18 | fine | p4-plan-yesno Yes 49.9-51.3 |
| 19 | not applicable | no word parts |
| 20 | not applicable | no word sounds |
| 21 | fine | each kind modeled |
| 22 | not applicable | no first parts |
| 23 | fine | wrong pictures vary |
| 24 | fine | nothing told by look |
| 25 | fine | no pattern found |
| 26 | fine | two BY_DESIGN marks still read |
| 27 | fine | blind-read --rounds read |
| 28 | not applicable | no letter names |
| 29 | not applicable | no end marks, letter sizes |
| 30 | not applicable | no story bank |
| 31 | not applicable | no mirrored stories |

### join-in-play

| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | I.C.3, P-SE 3, P-SE 4; lines 0-12 |
| 2 | fine | 5 banks; watching first is a right answer |
| 3 | fine | explanations, line pictures read |
| 4 | fine | no false fact found |
| 5 | fine | E12 or sister lessons named |
| 6 | fine | answer place even |
| 7 | fine | reasons read, true |
| 8 | fine | reads as one sentence |
| 9 | fine | examples, no tips |
| 10 | fine | line pictures match |
| 11 | defect | p3-join-face scared face drawn in no line (SHOULD 8) |
| 12 | fine | 2027 edition named |
| 13 | fine | no echo heard |
| 14 | fine | nothing unsafe |
| 15 | not applicable | no vocabulary code |
| 16 | fine | no voice taught; foils vary |
| 17 | not applicable | no grammar forms |
| 18 | defect | p3-join-yesno Yes 56.6-60.1 (SHOULD 14) |
| 19 | not applicable | no word parts |
| 20 | not applicable | no word sounds |
| 21 | fine | each kind modeled |
| 22 | not applicable | no first parts |
| 23 | fine | wrong pictures vary |
| 24 | fine | nothing told by look |
| 25 | fine | no pattern found |
| 26 | fine | blind-read: 2 marks read |
| 27 | fine | blind-read --rounds read |
| 28 | not applicable | no letter names |
| 29 | not applicable | no end marks, letter sizes |
| 30 | not applicable | no story bank |
| 31 | not applicable | no mirrored stories |

### voice-tells-more

| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | II.C.2, II.C.1; lines 0-11 |
| 2 | defect | p4-tone-yesno seed 4 teaches eye contact (MUST 7) |
| 3 | fine | explanations, line pictures read |
| 4 | fine | no false fact found |
| 5 | fine | E13 or sister lessons named |
| 6 | fine | answer place even |
| 7 | fine | reasons read, true |
| 8 | fine | reads as one sentence |
| 9 | fine | examples, no tips |
| 10 | fine | line pictures match |
| 11 | fine | choices drawn; reasons on topic |
| 12 | fine | 2027 edition named |
| 13 | fine | no echo heard |
| 14 | fine | nothing unsafe |
| 15 | not applicable | no vocabulary code |
| 16 | fine | turns announced; no loudness asked |
| 17 | not applicable | no grammar forms |
| 18 | defect | p4-tone-yesno Yes 70.0-71.8 (SHOULD 14) |
| 19 | not applicable | no word parts |
| 20 | not applicable | no word sounds |
| 21 | defect | line 9 holds two turns (SHOULD 16) |
| 22 | not applicable | no first parts |
| 23 | fine | wrong pictures vary |
| 24 | fine | nothing told by look |
| 25 | fine | no pattern found |
| 26 | fine | blind-read: 1 marks read |
| 27 | fine | blind-read --rounds read |
| 28 | not applicable | no letter names |
| 29 | not applicable | no end marks, letter sizes |
| 30 | defect | face signs from another course (SHOULD 7) |
| 31 | not applicable | no mirrored stories |

### circle-and-square

| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | V.B.1, P-MATH 9; lines 0-8 |
| 2 | fine | 5 banks, seeds 1-600 |
| 3 | fine | explanations, line pictures read |
| 4 | fine | square's sides equal; no rectangle beside it |
| 5 | fine | E12 or sister lessons named |
| 6 | fine | answer place even |
| 7 | fine | reasons read, true |
| 8 | fine | reads as one sentence |
| 9 | defect | a wheel is in no line (SHOULD 4) |
| 10 | fine | line pictures match |
| 11 | fine | choices drawn; reasons on topic |
| 12 | fine | 2027 edition named |
| 13 | fine | no echo heard |
| 14 | fine | nothing unsafe |
| 15 | not applicable | no vocabulary code |
| 16 | fine | no voice taught; foils vary |
| 17 | not applicable | no grammar forms |
| 18 | not applicable | no yes or no bank |
| 19 | not applicable | no word parts |
| 20 | not applicable | no word sounds |
| 21 | fine | each kind modeled |
| 22 | not applicable | no first parts |
| 23 | fine | wrong pictures vary |
| 24 | fine | nothing told by look |
| 25 | fine | no pattern found |
| 26 | defect | p3-shape-thing ball 68.5 (SHOULD 13) |
| 27 | fine | blind-read --rounds read |
| 28 | not applicable | no letter names |
| 29 | not applicable | no end marks, letter sizes |
| 30 | not applicable | no story bank |
| 31 | not applicable | no mirrored stories |

### talk-about-it

| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | II.B.2, P-LC 4; lines 0-9 |
| 2 | fine | 5 banks, seeds 1-600 |
| 3 | fine | explanations, line pictures read |
| 4 | fine | no false fact found |
| 5 | fine | E12 or sister lessons named |
| 6 | fine | answer place even |
| 7 | fine | reasons read, true |
| 8 | fine | reads as one sentence |
| 9 | fine | examples, no tips |
| 10 | fine | line pictures match |
| 11 | fine | choices drawn; reasons on topic |
| 12 | fine | 2027 edition named |
| 13 | fine | p3-talk-topic story names its topic, by design |
| 14 | fine | nothing unsafe |
| 15 | not applicable | no vocabulary code |
| 16 | defect | water and pizza the only wrong replies, 100 (SHOULD 3) |
| 17 | not applicable | no grammar forms |
| 18 | fine | p3-talk-about-yesno Yes 49.4-50.8 |
| 19 | not applicable | no word parts |
| 20 | not applicable | no word sounds |
| 21 | fine | each kind modeled |
| 22 | not applicable | no first parts |
| 23 | fine | wrong pictures vary |
| 24 | fine | nothing told by look |
| 25 | defect | same, four banks (SHOULD 3) |
| 26 | fine | blind-read: 6 marks read |
| 27 | fine | blind-read --rounds read |
| 28 | not applicable | no letter names |
| 29 | not applicable | no end marks, letter sizes |
| 30 | not applicable | no story bank |
| 31 | not applicable | no mirrored stories |

### patterns

| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | V.D.3, P-MATH 7; lines 0-10 |
| 2 | fine | 3 banks recomputed over 4,000 seeds |
| 3 | fine | explanations, line pictures read |
| 4 | fine | no false fact found |
| 5 | fine | E13 or sister lessons named |
| 6 | fine | answer place even |
| 7 | fine | reasons read, true |
| 8 | fine | reads as one sentence |
| 9 | defect | pp-which-repeats Yes rows: a tip (MUST 10) |
| 10 | fine | line pictures match |
| 11 | fine | choices drawn; reasons on topic |
| 12 | fine | 2027 edition named |
| 13 | fine | no echo heard |
| 14 | fine | nothing unsafe |
| 15 | not applicable | no vocabulary code |
| 16 | fine | no voice taught; foils vary |
| 17 | not applicable | no grammar forms |
| 18 | fine | pp-which-repeats Yes 49.2-49.9 |
| 19 | not applicable | no word parts |
| 20 | not applicable | no word sounds |
| 21 | fine | each kind modeled |
| 22 | not applicable | no first parts |
| 23 | fine | wrong pictures vary |
| 24 | fine | nothing told by look |
| 25 | fine | no pattern found |
| 26 | fine | blind-read: no mark |
| 27 | fine | blind-read --rounds read |
| 28 | not applicable | no letter names |
| 29 | not applicable | no end marks, letter sizes |
| 30 | not applicable | no story bank |
| 31 | not applicable | no mirrored stories |

### things-that-happen

| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | II.D.1, VII.A.3; lines 0-8 |
| 2 | fine | 5 banks, seeds 1-600 |
| 3 | fine | explanations, line pictures read |
| 4 | fine | no false fact found |
| 5 | fine | E12 or sister lessons named |
| 6 | fine | answer place even |
| 7 | fine | reasons read, true |
| 8 | fine | reads as one sentence |
| 9 | fine | examples, no tips |
| 10 | fine | line pictures match |
| 11 | fine | book never wrong for bedtime |
| 12 | fine | 2027 edition named |
| 13 | fine | no echo heard |
| 14 | fine | nothing unsafe |
| 15 | fine | birthday party, bedtime played |
| 16 | fine | no voice taught; foils vary |
| 17 | not applicable | no grammar forms |
| 18 | defect | p3-event-yesno Yes 65.2-68.4 (SHOULD 14) |
| 19 | not applicable | no word parts |
| 20 | not applicable | no word sounds |
| 21 | fine | each kind modeled |
| 22 | not applicable | no first parts |
| 23 | fine | wrong pictures vary |
| 24 | fine | nothing told by look |
| 25 | fine | no pattern found |
| 26 | fine | blind-read: 2 marks read |
| 27 | fine | blind-read --rounds read |
| 28 | not applicable | no letter names |
| 29 | not applicable | no end marks, letter sizes |
| 30 | not applicable | no story bank |
| 31 | not applicable | no mirrored stories |

### animal-sounds

| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | II.D.1, VI.C.1, P-SCI 1; lines 0-9 |
| 2 | fine | 4 banks recomputed over 3,000 seeds |
| 3 | fine | explanations, line pictures read |
| 4 | fine | no false fact found |
| 5 | fine | E12 or sister lessons named |
| 6 | fine | answer place even |
| 7 | fine | reasons read, true |
| 8 | fine | reads as one sentence |
| 9 | fine | examples, no tips |
| 10 | fine | line pictures match |
| 11 | fine | choices drawn; reasons on topic |
| 12 | fine | 2027 edition named |
| 13 | fine | no echo heard |
| 14 | fine | nothing unsafe |
| 15 | fine | six sound words played |
| 16 | fine | no voice taught; foils vary |
| 17 | not applicable | no grammar forms |
| 18 | not applicable | no yes or no bank |
| 19 | not applicable | no word parts |
| 20 | not applicable | no word sounds |
| 21 | fine | each kind modeled |
| 22 | not applicable | no first parts |
| 23 | fine | wrong pictures vary |
| 24 | fine | nothing told by look |
| 25 | fine | no pattern found |
| 26 | fine | p3-two-at-once prompt names its sound, by design |
| 27 | fine | blind-read --rounds read |
| 28 | not applicable | no letter names |
| 29 | not applicable | no end marks, letter sizes |
| 30 | not applicable | no story bank |
| 31 | not applicable | no mirrored stories |

### helpers-all-around

| Item | Verdict | Evidence |
|---|---|---|
| 1 | fine | VII.B.3, II.D.1; lines 0-8 |
| 2 | fine | 4 banks; firefighter never wrong for safe |
| 3 | fine | explanations, line pictures read |
| 4 | fine | no false fact found |
| 5 | fine | E13 or sister lessons named |
| 6 | fine | answer place even |
| 7 | fine | reasons read, true |
| 8 | fine | reads as one sentence |
| 9 | fine | examples, no tips |
| 10 | fine | line pictures match |
| 11 | fine | choices drawn; reasons on topic |
| 12 | fine | 2027 edition named |
| 13 | fine | no echo heard |
| 14 | fine | nothing unsafe |
| 15 | fine | five helper words played |
| 16 | fine | no voice taught; foils vary |
| 17 | defect | "treats", "teaches" in no line (SHOULD 5) |
| 18 | not applicable | no yes or no bank |
| 19 | not applicable | no word parts |
| 20 | not applicable | no word sounds |
| 21 | fine | each kind modeled |
| 22 | not applicable | no first parts |
| 23 | fine | wrong pictures vary |
| 24 | fine | nothing told by look |
| 25 | fine | no pattern found |
| 26 | fine | pk-helper-scene 42.8 in reviews only |
| 27 | fine | blind-read --rounds read |
| 28 | not applicable | no letter names |
| 29 | not applicable | no end marks, letter sizes |
| 30 | not applicable | no story bank |
| 31 | not applicable | no mirrored stories |

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
- bank p4-feel-does seeds 1-600
- bank p4-feel-tells seeds 1-600
- bank p4-feel-say seeds 1-600
- bank p4-feel-okay seeds 1-600
- bank p4-feel-calm seeds 1-600
- bank pm-same-vehicles seeds 1-600
- bank pm-different-vehicles seeds 1-600
- bank pm-vehicle-where seeds 1-600
- bank pm-tap-vehicle seeds 1-600
- bank p3-steps-things seeds 1-3000
- bank p3-steps-sounds seeds 1-3000
- bank p3-steps-say-them seeds 1-600
- bank p3-steps-which seeds 1-3000
- bank p3-steps-yesno seeds 1-600
- bank p3-talk-listen seeds 1-600
- bank p3-talk-turn seeds 1-600
- bank p3-talk-hi-bye seeds 1-600
- bank p3-talk-yesno seeds 1-600
- bank p3-talk-room seeds 1-600
- bank pk-turn-choice seeds 1-600
- bank ck-good-choice seeds 1-600
- bank pk-whose-turn seeds 1-600
- bank pk-turn-or-share seeds 1-600
- bank pk-while-waiting seeds 1-600
- bank p4-which-came-first seeds 1-3000
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
- bank pc-tap-colour seeds 1-600
- bank pc-name-colour seeds 1-600
- bank pc-same-colour seeds 1-600
- bank pc-different-colour seeds 1-600
- bank pc-colour-of-thing seeds 1-600
- bank p3-tap-red-blue seeds 1-600
- bank p3-which-colour seeds 1-600
- bank p3-sort-red-blue seeds 1-600
- bank p3-people-tap seeds 1-600
- bank p3-people-who seeds 1-600
- bank p3-people-yesno seeds 1-600
- bank p3-people-group seeds 1-600
- bank p3-people-grownup seeds 1-600
- bank p3-help-who seeds 1-600
- bank p3-help-kind seeds 1-600
- bank p3-help-grownup seeds 1-600
- bank p3-help-ball seeds 1-600
- bank p3-help-yesno seeds 1-600
- bank p4-fit-voice seeds 1-600
- bank p4-fit-why seeds 1-600
- bank p4-fit-say seeds 1-600
- bank p4-fit-enough seeds 1-600
- bank p4-fit-yesno seeds 1-600
- bank pk3-magic-word seeds 1-600
- bank p4-same-or-different seeds 1-600
- bank p4-friend-feels seeds 1-600
- bank p4-new-feeling-moment seeds 1-600
- bank p4-new-feeling-face seeds 1-600
- bank p4-friends-yesno seeds 1-600
- bank p4-play-plan seeds 1-600
- bank p4-play-part seeds 1-600
- bank p4-plan-yesno seeds 1-600
- bank p4-plan-together seeds 1-600
- bank p4-plan-what seeds 1-600
- bank p3-join-how seeds 1-600
- bank p3-join-yesno seeds 1-600
- bank p3-join-not-now seeds 1-600
- bank p3-join-face seeds 1-600
- bank p3-join-turn seeds 1-600
- bank p4-tone-ask seeds 1-600
- bank p4-tone-feel seeds 1-600
- bank p4-tone-strong seeds 1-600
- bank p4-tone-which seeds 1-600
- bank p4-tone-yesno seeds 1-600
- bank p3-tap-shape seeds 1-600
- bank p3-name-shape seeds 1-600
- bank p3-shape-by-corners seeds 1-600
- bank p3-shape-thing seeds 1-600
- bank p3-same-shape-any-size seeds 1-600
- bank p3-talk-say-back seeds 1-600
- bank p3-talk-topic seeds 1-600
- bank p3-talk-about-yesno seeds 1-600
- bank p3-talk-why seeds 1-600
- bank p3-talk-feel seeds 1-600
- bank pp-what-next seeds 1-4000
- bank pp-which-repeats seeds 1-4000
- bank pp-missing seeds 1-4000
- bank p3-event-what seeds 1-600
- bank p3-event-tap seeds 1-600
- bank p3-event-yesno seeds 1-600
- bank p3-event-name seeds 1-600
- bank p3-event-picture seeds 1-600
- bank p3-animal-sound seeds 1-3000
- bank p3-animal-says seeds 1-3000
- bank p3-animal-order seeds 1-3000
- bank p3-two-at-once seeds 1-3000
- bank ck-which-helper seeds 1-600
- bank ck-job-tool seeds 1-600
- bank pk-helper-where seeds 1-600
- bank pk-helper-scene seeds 1-600
- file READ-LIST-lesson.md
- file CLAUDE.md
- file CLAUDE-PART-2.md
- file CLAUDE-PART-3.md
- file docs/INDEPENDENT-CHECKS.md 58-75
- file docs/INDEPENDENT-CHECKS.md 237-282
- file docs/EARMARKS.md 19-19
- file docs/EARMARKS.md 27-27
- file docs/EARMARKS.md 152-152
- file docs/EARMARKS.md 172-172
- file src/logic.mjs 5090-5090
- file src/logic.mjs 8268-8268
- file src/logic.mjs 22078-22078
- file src/logic.mjs 22666-22666
- file src/logic.mjs 31142-31142
- file src/logic.mjs 31389-31389
- file src/logic.mjs 31913-31913
- file src/logic.mjs 31967-31967
- file src/logic.mjs 32172-32172
- file src/logic.mjs 36284-36284
- file src/logic.mjs 36497-36503
- file src/logic.mjs 36797-36797
- file tools/blind-read.mjs 1-60
- file tools/course-packet.mjs 1-95
- tool tools/blind-read.mjs
- tool tools/course-packet.mjs
- test tests/coverage.test.mjs
- test tests/scripts.test.mjs
