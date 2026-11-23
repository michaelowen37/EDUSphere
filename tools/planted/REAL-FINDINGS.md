# The real findings of the planted set's scored reads (passes NQ and NX)

This file lists the defects of today's content that pass NQ's scored reads (EARMARKS L19) and the lesson read's critic found, with pass NX's round two at its end, each read against the project, since a finding whose words are not in the project was a plant. It names each finding's item beside the id of the set's entry that uses that item, which would tell a reader which item is a control and which a plant, so it lives here, beside the set: the build leaves tools/planted/ out of every copy (tools/planted/README.md), so no built copy carries this file, and no other record names these items beside an id. EARMARKS A154 gives the counts and points here.

The next lesson pass applies them first (A154), each fix read as any fix is, against the project, and each entry of the set whose item a fix changes is rewritten or retired (node tools/planted-set.mjs --check). A finding on a control that is not yet on that control's known list in set.json joins it before the next copy is built, unless its fix lands first (the README's rule for a real finding).

Each finding gives its item, what is wrong, the reads that found it (each report is in the pass's scratch folder, reports/sc-<brief>-<model>.md and critic-lesson-fable.md) and the fix a read gave, where one gave a fix.

**Applied in pass NR (November 16 and 17, 2026; EARMARKS A154, done).** Every finding below was fixed in pass NR before its new lessons: the three lessons' banks of the lesson brief (K01 to K03) by the lead, the stories and the two early Wonder questions (K05 to K07, K09, P09, P10, P12, P16) by the pass's Fable writer, each fix read again in the pass's rounds of reads; each entry of the set whose item a fix changed was rewritten (its correct words, known list and history), and node tools/planted-set.mjs --check found all 50 entries landing, with --selftest passing on every frozen copy of the pass. The findings are kept below as found.

## The lesson brief

**K01, Talking with a friend (pre-K 3, talk-with-a-friend).** Not yet on K01's known list.
- p3-talk-yesno asks "Is it kind to stand very close, right in your friend's face?", where the lesson says that is too close, never unkind. Found by the Fable lesson read (its should consider 9). Its fix: "Is right in your friend's face too close?" with Yes, which also helps the bank's balance.
- The reasons of p3-talk-listen and p3-talk-yesno say "two friends talking at once, so your friend could not finish", and "at once" and "finish" are in no line of the lesson, whose script says wait, do not talk at the same time, and when your friend stops. Found by the Sonnet lesson read (its should consider 6). Its fix: "so wait until your friend stops, and then it is your turn."

**K02, Play with a plan (pre-K 4, play-with-a-plan).**
- p4-plan-yesno answers Yes on about four seeds of five: four Yes rows to one No in P4_PLAN_YESNO, Yes on 477 of seeds 1 to 600 (79.5 percent). Found by all three lesson reads (Opus and Fable as must fix, Sonnet as should consider); on K02's known list. Each read's fix brings in No rows in the lesson's words, among them the Fable read's "Does a plan say only what one friend will do?" and "When the house is done, did only one friend make it?", each No, then the bank is scored blind again in built rounds.
- p4-play-plan's new-idea row gives "Listen to your friend's idea, too." as its More right answers, which answers another question and is said in no line. Found by the Opus lesson read (must fix 7; its fix: that row's More right answers null) and the Fable lesson read (should consider 6; its fix: "Then you and your friend agree on the new plan."); on K02's known list.
- p4-play-part's question alone gives its answer on every seed: each of its twelve prompts has one answer over seeds 1 to 4,000, since P4_PLAY_PARTS gives each part to one player (pass MO's code, which the newer blind-read rule reaches). Found by the critic (its must fix 3). Its fix: `const [scene, a, b] = pick(rng, P4_PLAY_PARTS); const [mine, theirs] = rng() < 0.5 ? [a, b] : [b, a];`, then the bank scored again, tools/question-pools.mjs run again and the rules test's block on the bank read. Not yet on K02's known list.

**K03, Animal sounds (pre-K 3, animal-sounds).** Not yet on K03's known list.
- Three of its six say-alongs, meow, ribbit and growl, take the tiny-mouse flavor ("like a tiny mouse") in a lesson where each animal has a sound of its own (quack, buzz and hoot take a whisper). Found by the Sonnet lesson read (should consider 11, growl alone; its fix: growl's flavors 'giant', 'whisper', 'silly', 'fast' and 'dough') and the critic (should consider 6, all three; its fix: the whisper).

## The story brief with the picture brief

**K05, Now I read to you (pre-K 3, S4205 to S4208).**
- Opal is two letters from Omar, who leads pre-K 4's A cup is not a hat. Pass NP kept the pair with its reason (a shared first sound only, in another course); the Opus story read found them alike by ear (the story brief's items 16 and 17; its must fix 10). Its fix: rename her throughout (it offered Ursula, with no early-years name within two letters of it). Not yet on K05's known list.
- The truck book she holds up comes from nowhere in the words, and the cow book is never put down (S4208 paints it closed on the sofa). Found by all three story reads (Opus and Sonnet as must fix, Fable as should consider); on K05's known list, whose note names two reads. The Opus read's fix: "She began every page at the top. Then she set the cow book down and fetched her truck book. Its wheels were at the bottom, the right way."
- S4208's dump truck has no only-marks written (the picture brief's item 3). Found by the Opus story read (must fix 13). Its fix: "a plain yellow dump truck, its only marks its windows and its wheels". Not yet on K05's known list.
- Her look, blond in a moss-green dress, shares a color with Harlow's sheet (C10; the picture brief's item 25). Found by the Opus story read (should consider f). Not yet on K05's known list.

**K06, The pointing job (pre-K 4, S4209 to S4212).** Not yet on K06's known list.
- The tugboat (S4209 to S4212) and S4212's gray ship have no only-marks written, and a tug or a ship invites a painted name. Found by the Opus story read (must fix 13, with the dump truck above). Its fix: "a plain red tugboat, its only marks its round windows" and "a big plain gray ship, its only marks its round windows".
- S4210 to S4212 paint "four rows of small dark squiggles", pretend writing in a letters course. Found by the Opus story read (should consider e; the Sonnet read called the squiggles clean). Its fix: "four rows of short, straight dark gray bars with small gaps between them".

**In plants' items: six findings, each on its plant's known list in set.json.** Each is a defect of the project's own words, in an item a plant uses; all six were found by the Opus story read.
- P09, Pancake letters (S4161 to S4164): S4163 and S4164 paint the O rings and X strips flat on a table with no overhead view, though they are the shapes taught (the picture brief's item 24; its must fix 12, whose fix adds "the table and its plates seen from directly above so that each shape reads true," after "on a kitchen table," with the same in each check note); the words never give the little O its hole (paragraph 1; its should consider b: "Next he gave Florence a little one with a hole."); and it repeats A cookie with a bite in the same course, a dad, a daughter, a letter snack and the girl eating her letter at the end (the story brief's item 21; its should consider i: keep it with the reason, or end with "and she held hers up beside his.").
- P10, The next tank (S4148 to S4151): its moral drops the lesson's "In lots of words" (its should consider a: "In lots of words, O says the sound at the start of octopus, and U the sound at the start of umbrella and up.").
- P12, Then what? (S4189 to S4192): Sylvie's look shares a color with Harlow's sheet (C10; the picture brief's item 25); a teal sundress passes the look tool's three readers (its should consider f).
- P16, Knock, knock (S4143 to S4147): its moral drops the lesson's "In lots of words" (its should consider a: "In lots of words, the letter A says the sound at the start of apple, E at the start of elephant, and I at the start of igloo.").

Not listed: the story reads' finding on a near miss's item, a second ball from nowhere. They met round one's wording of N05, not the project's sentence, which N05's own entry holds right (its correct field: the ball stays her own, as the story had it).

## The Wonder brief

**K07, w-early-new-way-home (ups and downs).** Not yet on K07's known list.
- The scientist's and the skeptic's short voices (Frederick's "Dad drove home on a street I did not know" and Mike's "Was Dad sure of the way? He was not!") are heard two cards apart, with Chloe's mom driving between them, and sound like one dad on one drive (the Wonder brief's items 9 and 22); Mike's "He was not!" puts a small fear to a three-year-old before its comfort (item 15). Found by the Fable Wonder read (should consider B). Its fix, Mike's short voice: "My uncle took a street he did not know. It ended at a fence! He laughed and turned around, and we still got home.", with "my uncle" for "my dad" in his long voice.

**K09, w-early-did-it-myself (feelings).** Not yet on K09's known list.
- The skeptic's short voice, "Did I do it all by myself?", and his long voice's "Did I really do it all by myself?" doubt the prompt's own words, all by yourself, and can sound like correcting the child (the Wonder brief's item 9). Found by the Fable Wonder read (should consider F; its fix: "I felt proud of my practice. Someone showed me how first, so I would thank them too!") and the Sonnet Wonder read (should consider 10; its fix: "I did it myself, and someone showed me how first. I feel proud, and I want to thank them too!").

## The code brief: each fixed in pass NQ

Engineer F fixed each, with a check that fails without it (DECISIONS, pass NQ's entry, engineer F's bullet), so none waits.
- weeklyNote (P25's item): its Next up came from every course in the app, by course id, not from an assigned course, so "Every assigned module is mastered." could not be said truly; and its rounds counted from before a reset, with Still practicing matched by title. Found by all three code reads (Next up, each as a must fix) and the Opus and Fable code reads (the reset and the titles, as should consider).
- EXPLANATIONS and CONFIDENCE_RULES, the confidence Key Words (P26's item): sentences that said more than computeConfidence and moduleStory do (a point lost for any question missed when it comes back, answers watched for being faster or slower). Found by the Opus code read (should consider 2 and 3) and the Sonnet code read (must fix 4).
- SpeakButton (P27's item): its stop canceled the voice with no try around it. Found by the Fable and Sonnet code reads (should consider).
- nextWonder (K12's item): docs/ALGORITHMS.md's Reflections paragraph, out of date (a count of rounds where nextWonder counts different modules, and an order of themes where it has six keys). Found by the Opus code read (should consider 7), settled as a real finding.

## Pass NX: round two of the lesson brief (November 22, 2026)

Round two of the set (EARMARKS L19, pass NX, a tools pass) read the 24 lessons of READ-LIST-lesson.md in two copies, seeds 2 and 3, in five scored runs (scores.json runs 14 to 18): R14, the Fable read in free form, seed 2; R15, the Fable read with the checklist, seed 3; R16, the critic of R14; R17, the Opus read, seed 3, launched as the free-form read but written in the checklist's form; and R18, the Opus read with the checklist, seed 2. Each report is kept whole beside this file, in tools/planted/reports/ (R14 measured-1-fable-s2-free.md, R15 measured-2-fable-s3-checklist.md, R16 critic-1-fable-s2.md, R17 measured-4-opus-s3-checklist.md and R18 measured-3-opus-s2-checklist.md), with every fix its reader gave; a finding is named here by its run and its number (MF a must fix, SC a should consider). The copies differ from the project only by the set's entries, so each finding below was read against the project: its words are in today's src/logic.mjs (generated at seeds 1 to 600 where a bank builds them), each lean was measured again in the project with tools/blind-read.mjs at seeds 1 to 2,000 alone (the figure given here), and a figure a reader measured in its copy says so. None was fixed in pass NX, which changed no lesson; the next lesson pass applies them first (EARMARKS A181), each fix read as any fix is, and each entry of the set whose item a fix changes rewritten or retired (node tools/planted-set.mjs --check). The controls' findings are on their known lists in set.json. Findings already on record say so: A178 (the one-word waits), A180 (the banks left to grow) and L11 (the same-as wording kept).

**talk-about-it (N11).**
- The off-topic replies are always "I want a glass of water." and "I like pizza.", so a child who knows those two answers p3-talk-say-back, p3-talk-why, p3-talk-about-yesno and p3-talk-feel without hearing the friend (p3-talk-say-back reads 100.0 by the question alone). R15 SC3, R16 MF1 and SC1, R17 MF11, R18 MF10; p3-talk-say-back and p3-talk-why are on A180's list to grow. R16 MF1 adds that a child's real need, a glass of water, is taught as the wrong thing to say.
- p3-talk-feel's reasons are circular ("has a tear rolling out, so it looks sad"). R16 MF2.

**voice-tells-more (P31).**
- p4-tone-yesno answers Yes on 5 of its 7 rows, 70.0 percent. R14 MF12, R15 SC14, R18 MF2, confirmed by R16.
- p4-tone-ask's asking rows are all inverted questions ("Do you have a dog?", "Is it raining?"), so the first word answers without the voice, where line 3 teaches that the same words ask or tell. R18 MF12.
- A happy voice "can be quick" (paragraph 3, lines 6 and 8, and a p4-tone-yesno explanation), where docs/ALGORITHMS.md and the code's note say the lessons claim a happy voice's pitch alone. R17 SC7, R18 SC7.
- Script line 9 holds two turns, the first not ending its line. R15 SC16.

**things-that-happen (N12).**
- p3-event-yesno answers Yes on 4 of its 6 rows, 68.4 percent, and its "Can you play on the slide at the park?" asks about ability. R14 SC1, R15 SC14, R16 MF4, R17 MF14, R18 MF20.
- Echoes by sound the rules test cannot hear, snowy and snow, rainy and rain, bedtime and bed, in p3-event-what, p3-event-tap and p3-event-name, and bedtime and bed in things-we-do's p4-act-use. R16 SC2, R17 SC4, R18 MF13.
- Line 1's "A birthday party is a happy day", which How do friends feel? reads against. R16 SC3.

**people-and-events (P36).**
- p3-people-yesno answers Yes on 5 of its 8 rows, 61.1 percent. R14 SC2, R15 SC14, R18 MF7.
- Line 5 names four helpers and draws three, without the grandpa. R17 SC13.

**good-friend (P07).**
- p4-good-yesno leans Yes, 59.5 percent (60.2 in rounds by R18). R14 SC2, R17 SC3, R18 MF20.
- p4-when-grownup's two "Should you get a grown-up when ...?" rows answer No, which teaches that getting a grown-up is wrong where line 10 says only that you do not need one; both reads ask "Do you need a grown-up when ...?". R15 SC6, R18 MF6. Its "... when a fight starts and you cannot stop it?" row answers itself. R17 SC3, R18 SC2.
- Words and scenes no line says: p4-kind-words' "falls in front of the class" (R14 SC10, R18 SC5); reasons in other lessons' words, "every feeling is okay to have" and "the biggest feelings" (R15 SC7, R18 SC5); wrong choices met first in practice, "Stop crying!", "Go away." and "Grab the ball" (R18 SC5).
- p4-good-yesno's More right answers "You can say, I will play with you." answers what to say, not whether an act is kind (R14 SC9), and "Is it kind to say, it is okay, I spill too?" drops its scene (R18 SC11).

**say-it-to-fit (P32).**
- p4-fit-voice: "A big outside voice" is the wrong choice in 5 of its 6 rows, so the question alone reads 84.4. R14 SC4, R15 SC11, R17 MF15, R18 MF15.
- p4-fit-enough: the answer is the longest choice on every seed (82.2), on A180's list to grow. R14 SC4, R15 SC11, R18 MF16; R16 SC8 adds that its wrong choices "It hurts." and "Uh oh." are a hurt child's first words.
- p4-fit-yesno's "can you" rows ask about ability ("When a baby is sleeping, can you use a whisper?"). R16 MF4, R17 SC5, R18 SC2 (and A178's one-word wait).
- p4-fit-why's wrong choices never change (R18 SC4), and the library setup's "where others read their books" carries the answer's reason (R18 SC8).

**join-in-play (N03) and help-a-friend (P03).**
- Faces the lessons never draw: p3-join-face offers the scared face and p3-help-who the mad face, with reasons by signs no line says. R14 SC5, R15 SC8, R16, R17 MF13. p3-help-who leans to the sad face (70.7) and p3-join-face too (60.5). R17 SC8, R18 SC3.
- join-in-play's line 9 sends a child to "play something else, like the slide" with no grown-up named. R14 SC12.
- p3-join-yesno leans Yes, 58.1 percent. R17 SC8, R18 MF20.
- help-a-friend: p3-help-ball's explanation opens on a wrong choice ("Pushing is not okay, because it hurts.") and gives no reason for the answer (R16 SC7); a More right answers line says "share the ball", which no line of the lesson says (R18 SC5); P-SE 5 is cited whole while line 6 says only "That is a problem." (R15 SC2); I.C.5 has no since-clause (R18 SC10).

**how-friends-feel (P34).**
- p4-new-feeling-moment: each row has one fixed wrong face and worried answers three of them, so it reads 67.5; "you call your teacher Grandma by mistake and your friends giggle" offers worried, which a child could fairly feel; class, doctor, Grandma and giggle are said in no line. R14 SC11, R17 SC14, R18 MF19 and SC5.
- Line 5 says "look at their face", where the brief's item 2 asks for turning toward a friend. R17 SC14.
- p4-friends-yesno's "Can you ask a friend how they feel?" asks about ability. R16 MF4, R18 SC2.
- p4-friend-feels leans to happy (60.8 by R18) and its puppy row's More right answers is a moral; p4-same-or-different deals P4_NEAR_FACES pairs beside the answer Different. R17 SC14, R18 SC3 and SC6.

**feelings-show (P33).**
- p4-feel-say's wrong choices are feelings a child could fairly have ("I feel sad" when a friend takes your crayon, "I feel mad" when your tower falls), and "I feel happy" is never a wrong choice (62.4). R15 SC12, R17 SC1, R18 MF18.

**things-we-do (P38).**
- Line 5 says lunchtime "like a big, sleepy giant" in a lesson that sets lunchtime against bedtime's sleep. R18 MF21.
- p4-act-yesno's "At the park, can you go down the slide?" asks about ability. R16 MF4, R17 SC4.
- Its fixed wrong choices (the bus's Kick and Cut, the park's Sleep and Cut) are not recorded. R18 SC4.

**taking-turns (P08) and please-and-thank-you (P02).**
- pk-turn-or-share keeps its choices in the prompt's order and 4 of its 7 rows answer Taking turns, so the first button reads 57.8. R14 SC3, R15 SC13, R17 SC2, R18 SC3.
- pk-turn-choice, which both lessons deal, asks about the slide, a book, a red crayon and a box of blocks, which pre-K 3's lesson never says. R15 SC4, R17 SC17, R18 SC5.
- Marks read as by design, for tools/blind-read.mjs's BY_DESIGN: pk-turn-choice (78.7), pk3-magic-word (75.5), ck-good-choice (67.2) and pk-while-waiting (67.3), each judged by design by R18 and in part by R15 SC12; R17 SC9 reads pk3-magic-word otherwise (no row sets Please against Thank you) and asks for a please row whose wrong choice is Thank you, so the lesson pass judges it.

**two-steps (P35).**
- p3-steps-yesno answers Yes 67.2 percent. R15 SC14.

**circle-and-square (N02).**
- p3-shape-thing's More right answers "A wheel is round too, so it rolls." names a wheel no line says or draws. R14 MF11, R18 SC6; R16 notes that R14's first fix would itself break the More right answers rule.
- The round answer leans: p3-shape-thing to the ball (66.3) and p3-shape-by-corners to the circle (58.9). R15 SC13, R17 SC11, R18 MF14.

**colours (N01) and red-and-blue (P01).**
- pc-colour-of-thing asks "What color is a blueberry?" with the answer blue, so the question says its answer. R16 MF5.
- Shapes named that no line of the lesson says: pc-same-colour's triangles, and red-and-blue's "the blue square" and "this triangle". R14 SC7, R15 SC5.
- p3-sort-red-blue's More right answers "A blue crayon would go with these too" names a crayon no line says. R16 SC5.
- pc-colour-of-thing leans to green (45.1 by R18), and pc-different-colour's odd one is blue or yellow on 1,351 of 2,000 (R18 SC3).
- "Tap the one that is the same color as this yellow one." names the picture it asks about, as circle-and-square's "the same shape as this square" and match-the-vehicles' "the same as this boat" do; EARMARKS L11 keeps this wording, so the lesson pass settles the conflict. R18 SC1.

**match-the-vehicles (P05).**
- pm-tap-vehicle: with two choices still open, a first wrong tap hears "... and a boat goes on the water.", the answer's sign. R15 SC9, R18 MF17.
- P-SCI 3 is cited in part without naming its "With increasing independence", as are its two pre-K 4 sister citations. R15 SC1, R17 SC6, R18 SC10.
- Its reasons' "so those two go together" uses words the script never says (R17 SC6); the kind of two alike and one different is never asked in a line (R15 SC10); the track and road rows' wrong choices never change (R18 SC4).

**helpers-all-around (P04).**
- ck-which-helper, which kindergarten shares, asks "Who teaches you at school?", where the lesson says a teacher helps you learn. R16 SC6, R17 SC12.

**which-came-first (P06).**
- The bank asks only "Which animal came first?", while the script teaches second and the citations name first and second. R14 SC6. P-ATL 8 is cited in part for "an increasing amount" (R17 SC16), and II.D.1's expressive half names no earmark (R18 SC10).

**animal-sounds (K03).** On K03's known list.
- p3-two-at-once says "at the same time" for sounds the voice plays one after another, and its prompt names the sound to tap, so the question alone answers it (100.0). R17 SC10, R18 SC9.

**play-with-a-plan (K02).** On K02's known list.
- p4-play-part's tea party, bus, one big picture and store are said in no line of the lesson. R16 SC10, R17 SC15, R18 SC5.
- p4-plan-what's two echo rows (the pizza shop, a block) say their answers' names: a listening check no record names, to record as kept or by design or ask another way. R14 SC8, R15 SC15.
- p4-plan-yesno's "Can pretend play have a plan too?" assumes its answer. R18 SC2.

**talk-with-a-friend (K01).** On K01's known list.
- p3-talk-yesno's "Can you take turns talking with your teacher too?" asks about ability and assumes its answer. R16 MF4, R18 SC2.

**Every pre-K yes or no bank on the list.** R18 SC2: nine of them still at their one-word waits (A178), and every triple dose deals two or more rows of each (A179).

**The set's own entry.** R17 MF6 found that near miss N01's wording names a thing no picture shows (the lesson brief's item 3): a defect of the entry, not of today's content, settled in R17's record as no false alarm; the entry is rewritten before the set's next lesson round (its history in set.json).
