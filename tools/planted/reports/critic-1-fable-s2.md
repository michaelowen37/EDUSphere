# Lesson critic: report on round-report-a.md (copy /home/claude/lr-a)

Line numbers are src/logic.mjs unless said. Counts are my own over seeds 1 to 1,500 (2,000 for shares) unless a tool is named. No rules test block was run.

## MUST FIX (added)

1. **talk-about-it, script line 3 (line 5578), paragraph 2 (5570), TK_OFF_TOPIC (31397), and banks p3-talk-say-back, p3-talk-topic, p3-talk-about-yesno, p3-talk-why, p3-talk-feel (every seed that uses it, e.g. seeds 1, 5, 8, 24, 30).** The lesson's stock wrong thing to say is "I want a glass of water." A three-year-old is told it is not what to say, that Yes is wrong, and that it makes a friend sad (p3-talk-feel seed 5: the sad face). It is a child stating a need. The same course teaches the opposite on both sides: Please and thank you (lesson 10) models "May I have a glass of water, please?", and Say what you need (lesson 19, the very next) teaches a thirsty child to say it (tests/logic.test.mjs line 128). Nothing in RULES-AUDIT or EARMARKS records it as kept. Fix: an off-topic line that states no need. Line 3: "If you say, I see a bus, that is not about the puppy. It is about something else." with `{ kind: 'icon', name: 'bus' }`; paragraph: "If you say, I see a bus, or, I like pizza, ..."; TK_OFF_TOPIC `['I see a bus.', 'I like pizza.']`; p3-talk-topic's wrong picture the bus ("The bus is not what your friend is talking about."); p3-talk-why's "To ask for a glass of water" becomes "To talk about a bus" ("Talking about a bus is not about the puppy, what your friend said."); the test tables that name the old words change with it.

2. **talk-about-it, bank p3-talk-feel, line 31710 (all 12 questions, e.g. seeds 1 and 5).** Every More Info reason is a circle: "The sad face has a tear rolling out, so it looks sad." / "The happy face has a big smile, so it looks happy." It gives no reason against the answer (brief item 7); sister banks do ("...and being listened to can make a friend happy", p3-join-face). Fix: for a happy answer, "The sad face has a tear rolling out, and a friend who knows you listened may feel happy."; for a sad answer, "The happy face has a big smile, and a friend who thinks you did not listen may feel sad."

3. **patterns, bank pp-which-repeats, line 22078 (every Yes question, e.g. seeds 1, 2, 5, 7; 49 percent of seeds).** More right answers says "Say each one out loud, and listen for the part that comes back." That is a method, which brief items 2 and 9 bar from More right answers in any words. The report calls this bank clean. Fix: "Clap, stomp, clap, stomp repeats the same way each time, so it is a pattern too."

4. **Yes or no rows that ask about ability (RULES-AUDIT line 307: a yes or no bank "never asks about ability", which a child who cannot answers No truthfully; brief item 18; no test holds it).** Fix each, with its test table row:
   - say-it-to-fit, p4-fit-yesno (line 31967, seed 14): "Can you use words to say how you feel?" with "No would mean you cannot use words..., but you can." A child who does not speak is told they can. Fix: "Do we use words to say how we feel?" / "Yes. We use words to say how we feel, like, I feel happy!" / "No would mean we do not use words to say how we feel, but we do."
   - same bank, seeds 8 and 12: "When a baby is sleeping, can you use a whisper?" becomes "When a baby is sleeping, does a whisper fit?"; "On the playground, can you use a big outside voice?" becomes "On the playground, does a big outside voice fit?" (the bank's own form at seed 20), reasons "No would mean a whisper does not fit..., but it does."
   - things-that-happen, p3-event-yesno (line 31383, seed 4): "Can you play on the slide at the park?" becomes "Is the slide at the park?" / "Yes. The slide is at the park, where you can play on it." / "No would mean the slide is not at the park, but it is."
   - things-we-do, p4-act-yesno (line 31913, seed 14): "At the park, can you go down the slide?" becomes "Does the slide go with the park?" / "Yes. At the park, you can kick a ball and go down the slide." / "No would mean the slide does not go with the park, but it does."
   - talk-with-a-friend, p3-talk-yesno (line 31403, seed 14) "Can you take turns talking with your teacher too?" and how-friends-feel, p4-friends-yesno (line 36353, seed 2) "Can you ask a friend how they feel?": reword to "Do you take turns talking with your teacher too?" and "Does asking a friend how they feel help you know?".

5. **colours, bank pc-colour-of-thing, lines 23200 and 23221 (seed 14, 190 of 1,500).** "What color is a blueberry?" with the answer "blue": the question says its answer (brief item 13; the echo test reads whole words, so blueberry passes it). Fix: take 'a blueberry' out of LU_THING_COLOURS (and the test's luColour and luUnripe), keeping "A blueberry is blue too." as More right answers under the sky; blue is still asked by "the sky on a sunny day".

## SHOULD CONSIDER (added)

1. **talk-about-it, p3-talk-about-yesno and p3-talk-feel.** The reply alone decides every question: the two stock replies are No and the sad face on 100 percent of seeds, any other reply Yes and happy, so the friend's sentence is never needed. blind-read cannot see it (both sentences sit in one setup) and marks p3-talk-say-back 100.0 on the question alone. Offer an on-topic reply from another row as the off-topic one ("I made a tower!" answered by "I like your hat!"), so each sentence is right somewhere and wrong elsewhere. EARMARKS A180 already holds p3-talk-say-back and p3-talk-why "to grow"; these two belong with them.
2. **things-that-happen, p3-event-what, p3-event-tap, p3-event-picture (seeds 1, 9, 14).** "What falls on a snowy day?" the snow; "...on a rainy day?" the rain; "Where do you sleep at bedtime?" the bed. The sound of the question carries the answer, and rain is never offered beside snow. ECHO_WAITS (tests line 7984) lists only p3-event-name. Record them as kept echoes in DECISIONS, or offer the rain beside the snow.
3. **things-that-happen, script line 1 and p3-event-yesno seed 14.** "A birthday party is a happy day" and "No would mean a birthday party is not a happy day, but it is." Pre-K 4's How do friends feel? teaches that the same thing makes one friend happy and another not (brief item 4). Suggest "can be a happy day" and "Is a birthday party often a happy day?".
4. **Answers told by length (brief item 17).** The answer is the one longest choice on 79.5 percent of seeds in p3-join-how, 79.1 in p4-fix-problem, 76.6 in p4-kind-words, 73.1 in p3-help-kind and p3-help-ball. The report names only p4-fit-enough. Lengthen one wrong choice a bank ("Say, go away, I am playing").
5. **red-and-blue, p3-sort-red-blue, line 22732 (every seed).** More right answers: "A blue crayon would go with these too" (and red). No line of the script says crayon; same rule as the report's MUST FIX 11. Fix: "A bluebird's wings would go with these too, because they are blue." / "A strawberry would go with these too, because it is red."
6. **helpers-all-around, ck-which-helper, line 36105 (seed 6).** "Who teaches you at school?" answers Teacher by its sound, and the script says "helps you learn". Fix: "Who helps you learn at school?"
7. **help-a-friend, p3-help-ball, line 36210 (seed 1).** The explanation opens on the wrong choice and gives no reason for the answer: "Pushing is not okay, because it hurts. Keep your hands to yourself, and get a grown-up." Fix: "Get a grown-up, who can help you take turns. Keep your hands to yourself, because pushing hurts."
8. **say-it-to-fit, p4-fit-enough and p4-fit-yesno seed 6.** "It hurts." and "Uh oh." are the wrong choices, a hurt child's first words. The question asks which tells "just what is wrong", so it is not a call for help marked wrong, but the explanation could say so: add "Saying it hurts is a good start. Then say where."
9. **match-the-vehicles, script line 6 (line 7499).** "When you see two cars go by on your street" names no grown-up; add "with your grown-up", as the report's SHOULD CONSIDER 12 does for the slide.
10. **play-with-a-plan, p4-play-part.** Four of its six scenes (bus and bell, store, tea party, one big picture) are never said in the script, which says only the house and the pizza shop (brief item 2). Add one line that names another game, or keep the two scenes taught.

## Findings of the read that are false

None is false as to the line; I checked each of the 12 MUST FIX and 12 SHOULD CONSIDER against the copy and each line reads as reported. Three notes on fixes and weight:

- MUST FIX 11: its first fix ("A block has flat sides and corners, so it does not roll.") would itself break the More right answers rule, since a non-example is neither another right answer nor an example of rolling. Take its second (drop the line), or "A plate is round like a circle too."
- MUST FIX 7: RULES-AUDIT line 180 already gives the house wording, "The sea is often blue"; use it.
- SHOULD CONSIDER 5 is understated: brief item 11 says every wrong choice is drawn somewhere in its lesson, so the undrawn scared and mad faces are a rule breach, not a matter of taste.
- MUST FIX 12 and SHOULD CONSIDER 1 confirmed by tools/blind-read.mjs (70.0 and 68.4 percent Yes at 2,000 seeds).

Not added, because a record already holds it: p4-tone-ask and p4-tone-which asking by word order (EARMARKS line 205); one-word yes or no leans (EARMARKS line 319, ONE_WORD_WAITS); p4-feel-say's face deciding between two fair feelings (comment above P4_FEEL_SAY, line 36289).

Limits: the combinatorial banks were read only in their first distinct questions (ranges below); citations were read for sense and for cited lesson titles (all exist at their grade), not word for word against docs/standards; no screen was opened; the lesson brief was read to its item 20 (lines 245 to 268), the rest of line 269 and items after it not reached; CLAUDE.md and its parts were not opened.

## Opened

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
- bank p4-kind-words seeds 1-1500
- bank p4-help-friend seeds 1-1500
- bank p4-when-grownup seeds 1-1500
- bank p4-fix-problem seeds 1-1500
- bank p4-good-yesno seeds 1-1500
- bank p4-act-thing seeds 1-1500
- bank p4-act-word seeds 1-1500
- bank p4-act-when seeds 1-1500
- bank p4-act-yesno seeds 1-1500
- bank p4-act-use seeds 1-1500
- bank p4-same-or-different seeds 1-1500
- bank p4-friend-feels seeds 1-1500
- bank p4-new-feeling-moment seeds 1-1500
- bank p4-new-feeling-face seeds 1-4
- bank p4-friends-yesno seeds 1-1500
- bank p4-feel-does seeds 1-1500
- bank p4-feel-tells seeds 1-1500
- bank p4-feel-say seeds 1-1500
- bank p4-feel-okay seeds 1-1500
- bank p4-feel-calm seeds 1-1500
- bank p3-animal-sound seeds 1-4
- bank p3-animal-says seeds 1-4
- bank p3-animal-order seeds 1-5
- bank p3-two-at-once seeds 1-5
- bank p4-play-plan seeds 1-1500
- bank p4-play-part seeds 1-82
- bank p4-plan-yesno seeds 1-1500
- bank p4-plan-together seeds 1-1500
- bank p4-plan-what seeds 1-1500
- bank p4-tone-ask seeds 1-1500
- bank p4-tone-feel seeds 1-1500
- bank p4-tone-strong seeds 1-1500
- bank p4-tone-which seeds 1-1500
- bank p4-tone-yesno seeds 1-2000
- bank pk-turn-choice seeds 1-1500
- bank ck-good-choice seeds 1-1500
- bank pk-whose-turn seeds 1-1500
- bank pk-turn-or-share seeds 1-1500
- bank pk-while-waiting seeds 1-1500
- bank p3-join-how seeds 1-2000
- bank p3-join-yesno seeds 1-1500
- bank p3-join-not-now seeds 1-1500
- bank p3-join-face seeds 1-1500
- bank p3-join-turn seeds 1-1500
- bank p3-steps-things seeds 1-2
- bank p3-steps-sounds seeds 1-2
- bank p3-steps-say-them seeds 1-4
- bank p3-steps-which seeds 1-4
- bank p3-steps-yesno seeds 1-1500
- bank pc-tap-colour seeds 1-12
- bank pc-name-colour seeds 1-12
- bank pc-same-colour seeds 1-2
- bank pc-different-colour seeds 1-8
- bank pc-colour-of-thing seeds 1-3000
- bank p3-help-who seeds 1-1500
- bank p3-help-kind seeds 1-2000
- bank p3-help-grownup seeds 1-1500
- bank p3-help-ball seeds 1-2000
- bank p3-help-yesno seeds 1-1500
- bank ck-which-helper seeds 1-1500
- bank ck-job-tool seeds 1-1500
- bank pk-helper-where seeds 1-1500
- bank pk-helper-scene seeds 1-1500
- bank p3-tap-shape seeds 1-8
- bank p3-name-shape seeds 1-11
- bank p3-shape-by-corners seeds 1-7
- bank p3-shape-thing seeds 1-1500
- bank p3-same-shape-any-size seeds 1-7
- bank p3-people-tap seeds 1-1500
- bank p3-people-who seeds 1-1500
- bank p3-people-yesno seeds 1-1500
- bank p3-people-group seeds 1-1500
- bank p3-people-grownup seeds 1-1500
- bank pm-same-vehicles seeds 1-12
- bank pm-different-vehicles seeds 1-8
- bank pm-vehicle-where seeds 1-1500
- bank pm-tap-vehicle seeds 1-12
- bank p3-talk-listen seeds 1-1500
- bank p3-talk-turn seeds 1-1500
- bank p3-talk-hi-bye seeds 1-1500
- bank p3-talk-yesno seeds 1-1500
- bank p3-talk-room seeds 1-1500
- bank p3-tap-red-blue seeds 1-8
- bank p3-which-colour seeds 1-8
- bank p3-sort-red-blue seeds 1-8
- bank p4-fit-voice seeds 1-1500
- bank p4-fit-why seeds 1-1500
- bank p4-fit-say seeds 1-1500
- bank p4-fit-enough seeds 1-1500
- bank p4-fit-yesno seeds 1-1500
- bank pk3-magic-word seeds 1-1500
- bank p3-event-what seeds 1-1500
- bank p3-event-tap seeds 1-1500
- bank p3-event-yesno seeds 1-2000
- bank p3-event-name seeds 1-1500
- bank p3-event-picture seeds 1-1500
- bank pp-what-next seeds 1-7
- bank pp-which-repeats seeds 1-7
- bank pp-missing seeds 1-7
- bank p4-which-came-first seeds 1-5
- bank p3-talk-say-back seeds 1-2000
- bank p3-talk-topic seeds 1-1500
- bank p3-talk-about-yesno seeds 1-2000
- bank p3-talk-why seeds 1-2000
- bank p3-talk-feel seeds 1-2000
- file READ-LIST-lesson.md
- file docs/INDEPENDENT-CHECKS.md 55-75
- file docs/INDEPENDENT-CHECKS.md 245-268
- file docs/RULES-AUDIT.md 180-180
- file docs/RULES-AUDIT.md 208-208
- file docs/RULES-AUDIT.md 214-214
- file docs/RULES-AUDIT.md 307-307
- file docs/EARMARKS.md 152-152
- file docs/EARMARKS.md 205-205
- file docs/EARMARKS.md 319-319
- file src/logic.mjs 23221-23232
- file src/logic.mjs 36286-36296
- file tools/blind-read.mjs 120-175
- file tools/course-packet.mjs 18-80
- tool tools/blind-read.mjs
