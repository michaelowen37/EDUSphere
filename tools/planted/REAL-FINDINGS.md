# The real findings of pass NQ's scored reads

This file lists the defects of today's content that pass NQ's scored reads (EARMARKS L19) and the lesson read's critic found, each read against the project, since a finding whose words are not in the project was a plant. It names each finding's item beside the id of the set's entry that uses that item, which would tell a reader which item is a control and which a plant, so it lives here, beside the set: the build leaves tools/planted/ out of every copy (tools/planted/README.md), so no built copy carries this file, and no other record names these items beside an id. EARMARKS A154 gives the counts and points here.

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
