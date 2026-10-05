# The writing review

Written 2026-10-03 (pass JE) from Mikey's review of the newest lessons on his Mac. Mikey first planned for Fable 5.1 to do the rewrite. After the Opus sample in pass JF he asked Opus to carry on ("You can continue editing each lesson, story, title, question etc."), starting with pre-K and working up (pass JG). The file keeps its name so older notes still point here; it says plainly what he wants, whichever model does the work. Read it with docs/NEW-CHAT.md before the first rewrite. The work list, in order, is docs/REVIEW-LEDGER.md.

## What Mikey said, in his words

- "It reads robotically and has grammatical issues."
- "It reads as if it is just a bulleted list of facts rather than flowing nicely, looking at information from various perspectives and truly focusing on getting an idea across. Sounds more like it's attempting to check a box that the fact was presented."
- "I don't care if long explanatory text increases length, the ability to truly learn the information is priority. Not shooting for memorization."
- "Maybe lessons can read like stories and be more explanatory with greater context. We want thorough understanding not merely mapping to and crossing off of standards."
- "The stories are written a little better but are just kind of off a little. Maybe make them sound even more natural. The varying sentence length is good but the constant use of colons, odd starting points and assumptions."
- "We can cut back a lot on colons in our writing and cut back a little with semi colons too."
- "Maybe an example or short explanation can be added to some of these questions for context? Only the early learners need shorter questions but even those should prioritize context and flow over character limits."

## Why the old writing came out this way

The house rules and the pace produced it. Teaching text was written one idea per line. A test requires every quiz answer to appear in the lesson, which rewarded naming terms over explaining them. Prompts were capped at 70 characters. Each pass shipped a whole course in one turn, and no check measured whether a lesson reads well. Pass JE lifted the prompt cap and rewrote the house rule. Keep the good parts of the old rules (every answer is taught before it is asked, key ideas stay at 28 words a sentence) and drop the habits.

## What good looks like

### Lessons, grade 3 and up

- Explain the idea as a system. Say what it is, why it exists, how its parts connect, where it shows up in a reader's life, and what goes wrong without it, in the order a curious person would ask.
- Write connected paragraphs, the way a good teacher talks, never a stack of one-line facts. Length is welcome when it buys understanding.
- Show the idea from more than one side. Give a worked example with real context, an everyday comparison, and the view of someone who would see it differently.
- Define a word in the sentence where it first matters, then use it again so it sticks.
- Every answer in the module's question bank is still taught in the lesson (tools/untaught.mjs), but taught by explaining it, never by listing it.
- Colons rarely, semicolons sparingly. A colon joining two thoughts is usually two sentences, or one sentence with "because".

### Early years, pre-K to grade 2

Short, spoken, and shown rather than told, as now, but natural. Context and flow come before length.

### Questions

- Ask in natural, complete sentences, the way a teacher would say them aloud. Write answers the way a person would say them.
- Give context when a question needs it, with a short example or the bank entry's setup line (returned as `story`). There is no character limit now. A 400-character guard only catches a pasted paragraph.
- Never trade accuracy for flow. Mikey's own example shows the trap. "As prices rise, what happens to demand? It falls." mixes up the exact idea the course teaches. A rising price lowers the quantity demanded, a move along the curve. A fall in demand means the whole curve shifted because something else changed, like income or tastes. A version that flows and stays right is "When the price of something rises, what usually happens to the amount people want to buy? It falls." In the same way, "Which word best describes when supply equals demand?" reads well but blurs the idea, so ask "What do economists call the price where the amount buyers want matches the amount sellers offer?"
- Mikey's other examples, to fix first: the production possibilities frontier question about the frontier moving outward (it needs a picture in words of what moved and why), "Comparing the benefit and cost of one more unit" (too blunt; give a small example, such as deciding whether to bake one more batch of cookies), "Where quantity supplied equals quantity demanded is called what" (sounds machine-made), and the lesson line "A cold snap raises demand for heaters while a new factory raises their supply: the quantity sold rises for sure, and the price depends on which shift is bigger." (explain each shift in its own sentence, then what the two do together).

### Stories

- A natural voice, varied sentence lengths and few colons. Open where a reader can follow, not on an odd detail.
- Never assume the reader knows something. "Adam Smith opened the Wealth of Nations" never says it is a book, Smith's 1776 book about what makes nations rich, and a line about "the day the transmission goes" assumes a car-repair idiom. Say what a thing is the first time it appears, and let the story grow when that is what it takes. The pin factory deserves the room.
- Keep the Miniature Gladwell arc, the cast rules and the true-story checks (every fact verified by web). Keep every picture beside the paragraph it shows (the art audit); a rewritten paragraph may need its picture's caption and prompt updated in docs/ART-REQUESTS.md.

## Sentence length

Mikey checked ElevenLabs' Eleven v4 page (his screenshots, 2026-10-03). It sets no sentence-length limit, takes up to 10,000 characters in one generation and stitches longer pieces together, and uses inline tags such as [pause], [long pause], [whispers], [excited] and [sighs] where older models used SSML breaks. So audio never shortens a sentence. Write each sentence as long as its thought needs. The only reader whose sentence length still matters is a pre-reader listening, and even there flow and clarity come first. The tests keep a 45-word run-on guard for stories and explanations (it was 32), the eighteen-word read-aloud rule for early-years stories, and 28 words for each sentence of a key idea.

## Audio tags

When a story is read, write its audio tags in the same pass (Mikey, pass JH). A story's `audio` field in src/stories.mjs is its words with Eleven v4 tags in square brackets and nothing else changed, and readers never see it. Use sound effects sparingly, one to three a story, where the story already names the sound (a splash, a moo, footsteps in snow). Use feeling and delivery tags where a line turns ([puzzled], [whispers], [sighs], [delighted]), and end an early-years story's closing lesson line with [slowly, warmly]. Questions are spoken warm, pleasant and mildly upbeat, never over-excited. Young learners hear words drawn out and stressed the way a favorite preschool teacher says them; older learners hear a warm, engaging voice that never talks down. Then run node tools/audio-ledger.mjs > docs/AUDIO-LEDGER.md. Mikey also welcomes more paintings wherever a picture would teach a lesson better; log each one in docs/ART-REQUESTS.md (the lesson screen will need a painting slot the first time one is used).

## How to work

1. One small batch a pass. Three or four modules (lesson, story and questions together), more for the early years. Slow is the point.
2. For each module, read the lesson, the story and the bank, then rewrite them together. Check every fact by web, with the newest research and older findings kept as history with their date. Read every sentence aloud.
3. Keep the standards citations exactly as they are unless one is wrong. Keep the bank at least as large as it is, since questions are never reduced, and keep every answer taught.
4. Mark each item in docs/review-status.json with the pass name, then run node tools/review-ledger.mjs > docs/REVIEW-LEDGER.md. The ledger's colon counts show the change.
5. Deliver the pass the usual way (docs/NEW-CHAT.md and CLAUDE.md), and say in the DECISIONS entry what changed in each module.
6. Mikey approved the voice after the JF sample. Keep showing him each batch, and change course when he says so.
7. New courses after the review (PHIL 1301 and the rest) are written this way from the start.
8. Read docs/PICTURE-CANDIDATES.md (node tools/picture-candidates.mjs) for the modules in the batch, and give each comparison its picture where seeing the real thing teaches more than the words.

## Learned in pass JF, from the first rewritten module

- The screen used to break every lesson paragraph into one sentence per line (formatTeachingText), which is a large part of why lessons read like checklists. Set `prose: true` on every rewritten lesson so its paragraphs stay whole, and put each key term in bold (**term**) where it is defined.
- Scarcity, trade and markets (college macroeconomics: the lesson, the story S3596 and the bank macro-markets) is the first rewrite and the reference for the new style. Read it before writing, and change it too if Mikey asks.
- A question that needs a situation gets a setup line, the bank entry's fifth item, and its prompt names the setup with "this". The untaught check reads answers of three words or fewer, so those words must appear in the lesson's paragraphs or key idea (for example "it falls" and "it moves outward").
- A short story may run to 350 words. If one truly needs more room, ask Mikey before raising STORY_WORD_LIMIT.

## The tour

Never change the words on the tour cards (Mikey, pass JI). The pages behind them come from the live lessons and titles, so look at them when a rewrite touches what they show, such as the fraction lesson behind card 2 or the sample students' modules.

## Order

Mikey's order (pass JG): pre-K first, then kindergarten, grades 1 to 12 and college, course by course, core courses before electives. docs/REVIEW-LEDGER.md lists every module in that order, then the long stories, the games and the Wonder questions. The three other modules Mikey named in his first review (Saving, investing and risk; The communication process; Communication and audience) come up in their grades.

## The full standard (pass JO, Mikey: more than grammar, accuracy, colons and audio)

Mikey asked whether the review covers writing style, explanatory quality and context in the lessons, titles, questions, answers and stories, and pictures that add value. Passes JG to JN did not, fully: they were a first pass, fixing facts, punctuation and story flow and writing audio tags, with some explanation fixes, but they did not rewrite lessons for teaching quality or add lesson pictures (the app had no lesson picture slot until pass JO). Those items are marked "firstPass" in docs/review-status.json, and the full standard goes back over them, starting again at pre-K. An item counts as reviewed only when all nine of these are done.

1. Accuracy. Every fact checked against a source; nothing a learner will have to unlearn later; the numbers inside a story add up.
2. Teaching quality. The lesson says why, not only what, and connects its ideas into one system (what causes what, how the pieces fit). It gives one clear example a learner can picture, at the right level for the grade, and teaches everything its questions ask.
3. Writing style. Natural sentences that flow, as in the Scarcity sample (pass JF): no colons or semicolons, warm plain words, no robotic runs, and the read-aloud limits for the early years.
4. Titles. Clear, accurate and inviting, shown in title case.
5. Questions. Each reads as a natural sentence, with a setup line wherever the question needs a situation; distractors are mistakes a learner could really make; the answer is taught in the lesson.
6. Explanations. Each says the answer and the reason in whole sentences, so it makes sense read aloud or seen after a wrong answer, never a fragment that only continues the answer ("And in good shape."). A rule now checks this for pre-K to grade 1.
7. Stories. A real problem, a turn and a resolution; the lesson's facts and no others; one tense; smooth read aloud.
8. Pictures. A lesson picture (P serial) wherever seeing the real thing teaches more than words, such as landmarks, plant parts, instruments and the moon's shapes; story picture prompts match the story; every prompt follows Mikey's template, and a real place is checked against a photo.
9. Audio. Eleven v4 tags in every story.

## Learned in pass JP, the first full-standard batch (pre-K 3)

- For a pre-reader the spoken script is the lesson. The read-aloud screen shows one line at a time with its picture, and the paragraphs and key idea never reach the child, so the review rewrites the script first and the paragraphs to match. Every word the questions use must be spoken in the script: More once asked for fewer and never said the word.
- Forty read-aloud lessons have no script. Since pass JP they speak every paragraph and then the caption, far better than the single caption they spoke before, but a lesson written for the ear is better still. Write each one a script when the review reaches it.
- A lesson picture in a read-aloud lesson names its spoken line (step) and shares a word with it.
- Anchor an early idea to something that is truly so (yellow like a banana, not like the sun), and never model something unsafe, even in passing.
- Explanations say the answer and the reason in the lesson's own words (This one is red, like a strawberry; The big circle takes up more room, so it is bigger).

## Learned in pass JV (kindergarten Letters)

- Write every sound a voice will say as the sound or by its anchor word (cuh; the sound at the start of apple). A voice reads a bare letter as its name, so "C, a, t" was heard as see, ay, tee, which never blends into cat. Check scripts, setups, explanations and stories for this, not only lessons about sounds.
- Describe a traced letter the way the app draws it (TRACE_LETTERS), and check the drawing too: six letters were drawn from the bottom while their lessons said down.
- When a lesson cannot show everything its questions ask without becoming too long for its learners, split the asking across lessons by family rather than lengthen the lesson, say so plainly, and record it. Each round's review question keeps earlier lessons in practice.

## Pictures beside comparisons (pass JV, Mikey)

Mikey's example: the pre-K 3 Triangles lesson says a slice of pizza is almost a triangle, and a slice beside the triangle shows it at a glance. Whenever a lesson compares an idea to a real thing (almost a triangle like a pizza slice, a cone like an ice cream cone, red like a strawberry), part 8 asks whether a picture of the real thing beside the idea would teach more than the words. For young learners it usually would. Do both halves: give the line a drawn pair now when the app can draw the thing (show a pair, the real thing and the idea, adding a drawing if one is missing), and log a P painting in docs/ART-REQUESTS.md with the real thing and the idea side by side. A painting replaces the drawn pair on that line once Mikey uploads it. docs/PICTURE-CANDIDATES.md lists every early-years lesson line that compares and has no picture yet; read its rows for each module in the batch, and widen the tool to older grades when the review reaches them.

## Learned in pass JW (kindergarten Counting, part one)

- Check that every wrong choice is truly wrong when one category sits inside another. A square is a special rectangle (TEKS K.6A), so a square shown with rectangle offered as a wrong answer was a question with two right answers, and the old lesson taught a child something to unlearn.
- Check a story's way of solving its problem, not only its facts. Two boys settled who had more blocks by which row was longer, the exact mistake young children make (Piaget's number conservation); matching in pairs or counting is the honest way.
- In the early years an explanation gives its reason in the lesson's own counting words: Four dots are more than two dots, because you count past two to get to four.
- A real thing beside a shape is worth a line of its own, with a drawn pair now (add the drawing if the app lacks it, as the door and the window were) and a P painting logged for it.

## Learned in pass JX (kindergarten Counting, part two)

- When a standard names something with "including" (TEKS K.7A's capacity, K.6C's flat parts of solids) and the course never teaches it, teach it and give it a question kind of its own. A citation alone claims coverage the learner never got.
- A picture beside a counting question shows the things being counted (a group of squares, not dots standing in for them).
- Comparing length or height needs a fair start, both lines starting at the same place and both towers on the same floor, and the lesson says so.
- Before naming a one-off child in a story, read the names in the course's other stories. Five Counting stories gave their lead a name another Counting story already used.
- A comparison line gets its painting logged even when the app can draw the pair (P23), so docs/PICTURE-CANDIDATES.md never grows in a pass.

## Learned in pass JY (kindergarten Looking at the world)

- Check which edition of a standard is in force before checking its codes. Kindergarten science cited 2017 codes after the 2021 standards replaced them, and a code can name a different skill in each edition (K.9A was living and nonliving in 2017, and it is day and night in 2021).
- Test a definition against every example its bank uses. "It does not eat, so it is not living" was true of ice and untrue of every plant in the same bank.
- When a standard lists what must be taught (the five needs of a plant in K.12A), teach the whole list, each item true at the child's level (nutrients are not food, since a plant makes its own).

## Learned in pass JZ (kindergarten Me and my community)

- An explanation that says the question back teaches nothing (Who teaches you at school? A teacher teaches you at school). Say what the person does or why the answer is right.
- Read every example against its caption. Two more disagreed (four dots captioned five votes, a cup captioned a drop of water).
- Keep each claim true as said. Nobody must have an apple; an apple is a need because it is food, and that reason also tells it from candy.
- When the review finds a standard no lesson teaches, earmark it in docs/EARMARKS.md, the one list since pass KD, rather than build it (Mikey: accuracy of what exists comes first).

## Learned in pass KB (Taking care of me, and the trace arrow)

- A plan's source line can name the right section while its codes come from somewhere else. Read each code's words in the named section; the kindergarten health codes K.1A and K.1B were not in §115.12 at all.
- A read-aloud lesson without a script reads its paragraphs out. Write it a script for the ear when the review reaches it, as this pass did for all four.
- When a picture follows a curve, place what sits on it along the drawn curve, not along a straight tangent (the trace arrow).

## Learned in pass KC (kindergarten computer science)

- Read a code's subsection letter too. In the 2022 Technology Applications sections, (b) is the introduction and (c) holds the knowledge and skills, and a paragraph with a single expectation, such as 126.1(c)(2), takes no letter.
- A read-aloud lesson without a script reads its paragraphs over one picture; write the script so each line shows what it says.

## Learned in pass KD (I can listen, I can say)

- Check a social skill against how its own experts teach it today, not only against the standard. Whole body listening (Truesdale, 1990) had become a rule that marked a child who listens looking down as wrong; its creator calls it a tool, not a rule, and its publisher now teaches listening with brain and body. The brain is the listener, the body helps, and children listen in different ways.
- A clipped word written for a voice is usually another word (do, di, fun). Teach the end of a word by the words its last sound tells apart (cat, cap, can), never by spelling the clipped word.
- Keep idioms out of early-years lines (kind words open doors), and never make a feeling the wrong answer (crying, or a waaa among the choices). Say the feeling is okay and what words can still do.
- When a cited standard has lettered parts (SL.K.1.a and SL.K.1.b), read them and teach each part the lesson claims.
- A course's long story often repeats its lessons' mistakes; read it when the lessons change, even before section 2 of the ledger reaches it.
- Every earmark goes in docs/EARMARKS.md and that pass's DECISIONS entry, nowhere else.

## Learned in pass KE (kindergarten Me and my mind)

- Read each citation against the lesson, not only against the published text. Two codes were quoted exactly and taught nowhere (the meaning of goals, daily physical activity); a citation a lesson does not teach is a claim the learner never gets.
- When a standard names a count the world has outgrown (the five senses), teach the count the standard asks for and tell the truth beside it, so nothing has to be unlearned later.
- For feelings, the clue comes before the name. A child identifies a feeling by what the body does (hot and tight, shaky with a fast heart) and only then can say what it is called.
- Quote a national framework from its own document (CASEL's 2020 SEL Framework), never from the paraphrase that reached the plan.

## Learned in pass KF (kindergarten I wonder)

- A word a lesson uses about a person in history is a fact to check like a date. Plato was called Socrates's friend; he was his student, and the story said it too.
- When a pass retires a rule a learner was taught (listening with your ears and your eyes, pass KD), search every lesson and long story for the old wording in the same pass. I wonder had it twice.
- An example that shows a rule should say which part of the rule it passes or fails (a blue shirt is not about going outside; Tuesday has nothing to do with apples), or the child only hears that one is silly.

## Learned in pass KG (kindergarten Needs, wants, work and saving)

- A national framework has editions too. The Council for Economic Education's third edition (2025) replaced the 2010 standards the project cites, with new numbers and new words; check the newest edition before quoting any framework, as pass JY learned for TEKS.
- A computed question's explanation is read like any other. Colons hid in the sums (a deposit puts in, a withdrawal takes out: 8 take away 3 is 5).
- When a long story says a rule the lesson never does (a trade works when both want what the other has), the lesson gets it; the story is not where a child is taught.
- A sad feeling after a choice is part of the lesson, not a flaw in the child; name it as normal.

## Learned in pass KH (kindergarten On the farm)

- An earmark can be covered by a course in another subject. The science earmark listed the plant and animal codes, and the agriculture course had mapped every one of them; read every plan that cites the section before building anything from the list.
- A fact settled in one course must hold in every course. Looking at the world stopped calling nutrients food in pass JY, and From seed to plant still did; grep every lesson for a corrected claim in the pass that corrects it.
- A bank at the round's bare minimum (five questions for a five-question round) is a bank to grow, since no round can vary.

## Learned in pass KI (kindergarten Money and me)

- Two courses on the same strand say the same things in the same words. The business course and the economics course both teach goods and services, banks and income; a child who meets both should hear one voice.
- A thing a lesson names, it also says what it is. A food bank and an animal shelter were named for a five-year-old who may know neither.
- A computed question's words are checked like any other (one dollar, two dollars), and a bank whose setups the rules read for numbers never carries a wordy setup.

## Learned in pass KS (earmark E6, the last twenty letters)

- A letter's strokes are drawn the way handwriting is taught, not the way the font draws it: a ball-and-stick a with the font's two-story a switched off underneath, bumps that start from the top dot, tails that stay on the pad.
- On the tracing pad, 90 degrees is the bottom and -90 the top; an arc around the bottom from left to right runs from 180 to 0, and the first U went over the top. Every new letter gets an ideal-trace check and a screenshot in the built page.
- A story's audio is rebuilt from its words by a script after any trim, never edited as a second copy by hand; the tagged-words test catches the drift, but rebuilding avoids it.

## Learned in pass KR (earmark E5 part two, kindergarten technology)

- Check a new icon in the real built page, not only the icon sheet: the sheet renderer in /tmp cannot draw parts built with a map (the keyboard's keys, the comb's teeth), while the app draws them. build.sh, then tests/e2e/make-page.mjs, then a Playwright screenshot of the lesson step.
- A hands-on standard (keys, saving, posture) is still teachable by voice and picture: name the key, say what it does, show it, and let the practice be the lesson itself, which is an app.
- A design process for a five-year-old is a story with a failed test in the middle; the fix is the lesson, and a failed test is a clue in the story because information has four syllables.

## Learned in pass KQ (earmark E5 part one, kindergarten technology)

- An earmark written during a review pass can undercount: KC listed one unmapped code of 126.1(c) and there were ten. When an earmark comes due, read the whole section against the plan again before building, and widen the earmark in writing.
- A teacher's name with a period (Ms. Lin) splits a sentence for the flow audit and the read-aloud count; Miss Lin reads the same and keeps the sentence whole.
- Everything and information have four syllables; a kindergarten story says every picture and facts.
- A lesson about searching teaches the check, not just the search: a device brings back what it finds, right or wrong, so the story's first answer is wrong (thirty feet) and the class checks two more pages.

## Learned in pass KP (earmark E4 part two, kindergarten health)

- Body safety for a five-year-old is taught the way child-safety educators teach it, plainly and without fear: your body is yours, the swimsuit rule, a safe grown-up never asks you to keep a secret from your parents, it is never your fault, and keep telling until someone helps. It is abuse prevention, not human sexuality instruction, so it is not consent-gated.
- A story about danger shows the stop, never the act: Noah holds the pill to his mouth and stops; nobody drinks from the can; the hat stays on.
- A standard half taught in another course is narrowed, not duplicated: the online situations that call for a trusted adult went into Safe and kind online, with the health code in its sources and a plan row pointing there.
- An icon key is a word the line says (stop, bottle, cigarette, house); a made-up compound (handstop, pillbottle, nosmoke) fails the picture rule and sounds wrong read aloud.

## Learned in pass KO (earmark E4 part one, kindergarten health)

- A health claim for a five-year-old is checked against the agency that owns it (the CDC for lice, ticks and vaccines, USDA MyPlate for portions, the FDA's allergen list) and said at the child's level without being softened into something false: lice are no shame, and a hurt brain may not heal the way a scraped knee does.
- A law's threshold (a booster until eight unless four feet nine) is said as big enough in a kindergarten lesson, with the code cited in the comment, so the lesson stays true in every family's car without a number a child cannot use.
- An icon's key must be a word the spoken line says naturally; belt, not seatbelt, since the lesson says seat belt.
- Remembered and emergency have four syllables; the read-aloud rule shapes even a 911 story's closing line.
- A national framework's edition is checked before a new module cites it (the NHES third edition, 2024); when it has not been read in full, map under the row already there and log the move as an accuracy item, never quote a number from memory.

## Learned in pass KN (earmark E3 part two, places, families and technology)

- Teach religion and family shape as things each family decides, name several and the choice of none, and keep every painting free of a default: P57's prompt asks for no religious symbols so that no family's way is painted as the way.
- A place name with four syllables (Colorado) cannot appear in a kindergarten story under the read-aloud rule, so the lesson names the river and the story says a river; the same rule turns technology into tools in a closing line.
- When a geographic name is contested on current maps (the Gulf), teach the idea (the sea along our coast) and leave the dispute to a later grade.
- A patch that writes one file before asserting an anchor in the next can half-apply; guard each file's part on its own, so a rerun finishes the rest without repeating the first.

## Learned in pass KM (earmark E3 part one, kindergarten social studies)

- Quoted text is not ours to tidy. The Texas pledge keeps its semicolon and the United States pledge its capitals, because a child who learns them will say and later read the real words.
- Check a quoted law's latest enacted text, not only the version everyone recites. Bills to add words to the Texas pledge were filed in 2021 and 2023; the enacted text found still ends at indivisible, and the entry says so rather than guessing.
- A three-syllable rule shapes a story's plot. Indivisible and invisible are both four syllables or more, so the pledge story's mishearing had to be a three-syllable pair (library for liberty).
- A prompt that ends in an abbreviation (Stephen F. Austin) reads as two sentences to the wording check; say the name without the initial in a prompt, and keep the full name in the lesson.
- A scene icon can carry a word the line says (table, hill), so the picture rule holds without a label; a name like overunder that no sentence can say fails it.
- When a standard names four required figures, four paintings is right even though lessons usually carry three, and a figure with no true likeness (Columbus) gets a scene, not a face.

## Learned in pass KL (earmark E2, kindergarten coins and picture graphs)

- Check an earmark's whole section, not only the earmarked codes. The file said the math graphs were missing; reading 19 TAC 111.2 code by code found K.4 (coins by name) in no plan and no lesson, and K.5 cited with a letter it does not have.
- A picture whose count matters is kept out of the Leonardo prompt (P44 shows rows of toys with no counts), because a painted count that disagrees with the lesson would teach the wrong thing.
- When two drawn things differ only by size (a dime and a quarter), draw them to one scale and show them side by side, and give each a second difference a child can feel (a reeded edge against a smooth one).
- A screenshot taken before a pair's second half has drifted in shows one picture; wait for the animation before judging a rendered lesson.
- A line that compares two real things (ridges like a dime) reads as a picture candidate; say the same as instead when both things are already pictured.

## Learned in pass KK (earmark E1, five new kindergarten science modules)

- A national framework's assessment boundary can exclude the very thing a code seems to cover. NGSS K-PS2-1 (pushes and pulls) says in its boundary that it excludes non-contact pushes or pulls such as those produced by magnets, so a magnet lesson cites 3-PS2-3 with a note, never K-PS2-1. Read the boundary and the clarification statement, not only the performance expectation.
- Build a new module's wrong answers the way the review checks old ones. Sand puts out a fire, so it cannot be a wrong answer to what puts out a fire; most kitchen spoons and soda cans are not pulled by a magnet, so "metal" is never the rule, iron is.
- Draw every new icon, render the set to one sheet, and look at it before delivering. A penny's profile read like a letter R, and a shadow drawn as a patch under the feet did not sit on the side away from the sun; both were only visible in the picture.
- A one-off story child's name is checked against every story in the course before it is used (pass JX's rule holds for new stories too), and a new early-years story is counted before it is trusted: four of five ran a few words over the limit.

## Learned in pass KJ (kindergarten Looking and listening)

- Read every "including" in a standard against the lesson. The art standard names form and balance, and the lesson had five of its seven words.
- When the world's grown-up count differs from the child's (four instrument families, three in the lesson), name the grown-up pieces inside the child's groups, so nothing has to be unlearned.
- A rule settled in one course (listening is your brain on the words, pass KD) is applied in every course that says how to listen, the audience rule here included.
