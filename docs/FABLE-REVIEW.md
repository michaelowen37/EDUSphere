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
