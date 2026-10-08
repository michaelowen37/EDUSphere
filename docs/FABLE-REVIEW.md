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
2. Teaching quality. The lesson says why, not only what, and connects its ideas into one system (what causes what, how the pieces fit). It gives one clear example a learner can picture, at the right level for the grade, and teaches everything its questions ask. Since pass LE (Mikey): the same idea is shown from up to four angles, other ways of looking at it with pictures that change with them, where the topic bears it, and never an awkward angle to satisfy a count; most question kinds apply the idea to new numbers, words or pictures, so a screenshot of the lesson does not answer them.
3. Writing style. Natural sentences that flow, as in the Scarcity sample (pass JF): no colons or semicolons, warm plain words, no robotic runs, and the read-aloud limits for the early years. Since pass LE (Mikey) the read-aloud limits (eighteen words a sentence, and three syllables a word until pass LY retired that one) are guidelines against scrolling, kept when a longer sentence or word carries educational value or another rule needs it; the stories test reports them as a note.
4. Titles. Clear, accurate and inviting, shown in title case. In summary text a course or module title is in title case and emphasized, like a book title (pass LE).
5. Questions. Each reads as a natural sentence, with a setup line wherever the question needs a situation; distractors are mistakes a learner could really make; the answer is taught in the lesson.
6. Explanations. Each says the answer and the reason in whole sentences, so it makes sense read aloud or seen after a wrong answer, never a fragment that only continues the answer ("And in good shape."). A rule now checks this for pre-K to grade 1.
7. Stories. A real problem, a turn and a resolution; the lesson's facts and no others; one tense; smooth read aloud.
8. Pictures. A lesson picture (P serial) wherever seeing the real thing teaches more than words, such as landmarks, plant parts, instruments and the moon's shapes; story picture prompts match the story; every prompt follows Mikey's template, and a real place is checked against a photo. Since pass KZ (Mikey): whenever an app-drawn shape, diagram, coloring page or any other image would look better generated with Leonardo, add it to the ledger instead of drawing it, and keep a drawing only when it looks pleasant, sleek and accurate; a drawing that carries an exact count, time or length the question depends on stays drawn, and the real thing beside it becomes a painting on a line that states no count. Since pass LE (Mikey) the five pictures a story are a judgment, fewer when a picture adds nothing, more when it helps; and a generated picture is preferred over a drawing whenever it would look better (pass KZ).
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

## Learned in pass LE (the rules audit rewritten, the limits made guidelines)

- A rule's reason decides its strength: the eighteen-word sentence exists so a young reader is not scrolling, so it is a guideline a longer sentence can outweigh, and the test now reports it instead of failing. A rule with a reason that admits no exception (an answer must be taught before it is asked, a count in a painting must not contradict the lesson) stays a hard test.
- The audit itself is the rule most worth keeping: whenever Mikey changes the app's structure or an algorithm, the change goes into docs/RULES-AUDIT.md in the same pass, and nothing there is deleted or changed without his approval.

## Learned in pass LK (a sample drawn by the real code)

- A sample built by hand to look like a real screen drifts: the LI tour sample missed the Merge link and the Wonder pill and was laid out differently, and Mikey saw all three at a glance. Feed made-up data through the real component instead, with taps switched off, and the sample can never differ from the page.
- Count a daily allowance against the day as it started, not as it stands: finishing the first review shrinks the queue, and a rule that rechecked the live queue would cancel the second review the backlog asked for.

## Learned in pass LZ (Mikey's notes before a new chat)

- The Wonder voices are the cast grown up, and the stories are the flashbacks (Mikey: "It's like a sophisticated story that has flashbacks to their childhood to show how they developed the mindset they have today"). Write a core-cast story knowing the grown voice it leads to.
- A reader looking for facts and safety stops hearing rhythm, so story flow gets its own reader (docs/INDEPENDENT-CHECKS.md, the story flow brief).
- An overarching reader sees what specialists cannot: two fixes that pull against each other, or a pass that drifts from the vision. In this pass it caught a rule I had written in Mikey's name that his words only offered as a perhaps.
- A national flag a picture needs may wave outdoors or hang in folds indoors, so part of its pattern is hidden; an exact flag is a try beside a safe picture, and where the words count stripes or stars, the picture leaves the count to the words.
- A sweep that stops at the first screen of results is not a sweep: read every row a search returns.
- When sources disagree on a fact, the words say only what they agree on, and DECISIONS names the sources (the Gonzales flag, pass LZ).
- A prompt that asks for a letter while its negative prompt bans letters asks for what it forbids; a picture that needs a letter is planned around things instead (a hand, a crayon, a trail in the sand).

## Learned in pass LY (pictures at the child's level, and voices with names)

- A coloring page is a scene with several things to color, never one object alone, and it grows more intricate with the child. A rule that lives only in the decisions log is lost: this one was decided in September and every planned page still shared one style line for every age. Put a rule where a test can see it.
- Before adding things to a picture, read what it stands in for. A flower on the butterfly page would make "which one has petals?" ambiguous; stars around the rocket would answer "which one has points?".
- Anything with writing on it attracts garbled text in a generated picture (clocks, signs, buses, books, keyboards, phones, coins, the N and S on magnets, number lines): plain faces, blank signs and a check note.
- Flags with exact star and stripe counts stay out of generated pictures unless a check note names the count to see before saving.
- A young child near water, a road or a height has a grown-up nearby, in pictures as in stories.
- Name the voices. Frederick in a story and Frederick in a Wonder question are one person, and the label says how he sees.
- Try a layout fix on every case it touches, not only the one in the screenshot: equal columns fixed four color chips and would have broken ninety-three three-answer questions on a phone.
- The browser tests read textContent, which includes hidden text and the page's style text (its comments say Mikey, so a search for Mike landed in the CSS); a check that something is hidden asks isVisible, and a search for words starts from a heading on the screen.
- A large set needs a reader who has not seen it: the coloring audit found 203 pages to change in 238.

## Learned in pass LX (safe scenes, and a second read after the fixes)

- Read every scene as a careful parent would. The first drafts had a girl waiting beside a moving swing, four-year-olds at a creek's edge and a child at the window in a storm close by; a bench, a park and a far-off storm kept every plot.
- Physical order matters to a child who knows it: lightning flashes before its thunder.
- Continuity is checked action by action. The words put the pile on a flat rock before a picture shows it there; a star's line comes back to a dot only if a dot was made; Grandma holds the card on her birthday, not in a classroom she was never in; one handful from two bowls of single colors cannot come out mixed.
- In a long story the children are the heroes, so they use the ideas, and a grown-up still says each rule (The last number tells how many, said Georgette).
- A line drawing has no color, so a lesson line beside one asks about its shape.
- A page the app draws can wait for Mikey's better page out of sight: keep the drawing, mark it, and let the saved file switch it everywhere (a G page), where a missing page (a D page) shows a placeholder card.
- Read the ledger rows a batch writes, not only the stories. A character note had been landing in the negative prompt, and one background per story put a dinner table on a town street; each row's prompt, background and negative prompt are checked against its scene.
- Fixes can break a limit or a voice. One fix took a story past the early years' 200 words, and another dropped a she said, which turned Georgette's rule into the narrator's; check lengths after every round and give the fixed batch a second read.

## Learned in pass LW (stories with a turn, and a second reader)

- A matching story needs a pair that looks like a match and is not. A pond where every animal came in twos had nothing go wrong; a red train beside a red car, a whale beside a fish and a fox's pointy ears on the fence each make the child look again.
- A narrator never says a child's mistake as fact. Same color, same stripes, a match! belongs to Finn (said Finn), and There it is! to Ivy, so the story never teaches the wrong match.
- A general fact inside a past-tense story is said by a grown-up (A train runs on a track, said Grandpa), so the narration keeps one tense and the fact has a voice.
- A solid is not a flat shape. A round block is a cylinder or a sphere, not a circle, and a triangle block has six corners (its top has three). A colors story that needs circles and squares sorts flat foam shapes.
- Tell things apart the way the lesson does. A balloon is light and has a string; floating is not in the lesson, only a helium balloon floats, and light things do not float.
- When the words give a count (three strawberries in a row, four in a bunch), the picture's prompt names it, so a painting can be checked against the story before it is saved.
- Read each scene for a young child's safety, not only the plot: the porch light goes on at dusk, and a grown-up opens the door after a fox has passed.
- A reader who has not seen the writing finds what the writer cannot: the independent check found eight things to fix in nine stories. Give every story batch one.
- A field a generator makes is checked on the screen, not only in the rules test: 34 kinds of question made explanation pictures that were validated every run and never drawn.

## Learned in pass LV (read the citation against the lesson)

- A citation is a promise about what the lesson teaches. Both size lessons cited V.D.1, which compares heights or lengths, and taught only the room a thing takes up; they now teach taller and longer too. Read the cited text against the lesson, not only the code against the plan.
- A count lesson asks every number it counts to: One, Two, Three had no question that asked for three.
- A setup line that names things in a random order counts every order as a new question, so the bank looks bigger than the variety a child meets (369 was really 69). Name them in a fixed order and shuffle only the pictures.
- Compare only what is clearly different. A bear and a whale are never set against each other, because the smallest whales are about the size of a big bear; the size groups the lessons name keep every comparison safe.
- A kind shared with another course is not widened for one course: the helper and good-choice kinds are kindergarten's too, so pre-K's new facts got kinds of their own.

## Learned in pass LU (banks that grow)

- A question is the same question when its words, picture and answer match, whatever the wrong choices (questionKey), so shuffling distractors never deepens a bank. It grows with new words, pictures or answers, and the best of those apply the lesson's own facts: where a boat goes, which shape is like a can, which animal has long ears.
- A property question needs wrong choices that do not share the property. A cat also has pointy ears, a butterfly has legs, a square is a special rectangle from kindergarten on, and a cylinder rolls too, so each is kept out of the choices for that question, and the rules test checks it.
- An everyday pair is not always the same. A left shoe and a right shoe match as a pair but are mirror images, so a lesson that defines the same as alike in shape, color and size uses two crayons from one box instead.
- Check that a bank can ask the lesson's own example: the lesson compared five dots with two, and the old generator never could. Widening it to every pair up to five closed the gap.
- "It does not look like the car" is not a comparison to a real thing, but the picture-candidate tool counted it as one. Say "It is not the same as the car" and the tool's list stays a list of real comparisons.
- The scripts test reads a line against its picture: a line that names an animal must show it, and a picture of squares needs the word square. Plan a line and its picture together.
- A new rules check is only as good as its failure: break what it guards on purpose, in a copy, and watch it fail before trusting its pass.
- A change made for one screen can quietly break another that shares its pictures: when the coloring pages moved to Leonardo, the matching questions' rocket, butterfly and flower became blank cards, and only screenshots of a real practice round showed it. Look at the questions in the real page, not only the lesson.

## Learned in pass LT (stories that are stories)

- A story's pictures can never carry letters: every Leonardo prompt bans text, so a story about letters is drawn with the things the letters start (a ball, a bee, an apple, an acorn) and the letters stay in the words. The old A and B story hung on a banner its pictures could not show.
- The lesson's facts and no others reaches a story's nouns too. A cow that moos and a dog card were true but untaught; with the lesson's own animals and pictures, the story becomes one more meeting with what the questions ask.
- A demonstration is not a story. A child tapping three cards in order has no problem and no turn; give the idea a moment where common sense fails (a word with no card) and let the idea solve it (the thing is up in the sky).
- Read a scene for what it models, not only what it says: a child with closed eyes belongs on a hay bale, not at the edge of a pond, and a grown-up is the one who takes a ball out of the water.

## Learned in pass LS (look before you name)

- A picture name in a lesson line is only as good as the drawing behind it: the animal drawings have no dog and the bird is an icon, so two new lines drew blank. The real-page screenshot caught it before delivery; check the drawing set before writing a line or a bank around a picture.
- A title is centered against the screen, not against what is left of a row: balance an icon on one side with an empty column on the other.

## Learned in pass LJ (one feature, one place)

- A feature whose rules are spread across logic, screens, sentences and the tour gets its own section in the rules audit, and the sentences there are generated from the code, never retyped, so the audit cannot drift from the screens.
- A cap fixes a burst but can starve a backlog: one review a day solved ten-in-a-day, and the same rule falls behind any student who masters more than one lesson a day. Check every rate limit against the rate that feeds it.

## Learned in pass LI (one quick look back a day, and a plain tour card)

- A schedule that is right for one lesson can be wrong for a day: ten lessons mastered together made ten reviews due together. A per-day cap with a queue fixes it, and the right test asks what a busy student's calendar looks like, not one lesson's.
- A tour card should look like the page it explains. The three-picture collage over a blurred page read as busy to Mikey; the real classroom with made-up students, one of them glowing, says the same thing in the same visual language as the other ten cards.
- Screenshots taken with reduced motion freeze animations: the tour's orbiting gold dot shows as a still circle at a corner, which is not a bug.

## Learned in pass LD (the rules audit)

- A standard enforced per module can pass a whole grade while a course-level rule goes unmet. The ledger listed long stories only where they existed, so no grade 1 course was ever marked as lacking one. A ledger must list what is required, not what is present: every course is a long-story row now, done or not.
- Claude keeps nothing between chats and loses the early part of a long chat as it goes; a rule survives only where it is written, and reliably only where a check runs it. docs/RULES-AUDIT.md says, for every rule, which of those it is. The work ahead is to move doc-only rules into checks, one at a time, as each comes up.

## Learned in pass LC (the grade 1 math course split in two)

- A course that outgrows its title can be split along the standard's own strands, and the split is cheap when modules carry their own ids and prerequisites: move the module list, give the new course a game and a Wonder question (the rules test requires one per course), and update the two tests that name the course. The plan is per grade and subject, so no plan row moves.
- A silent replace in a docs patch is a bug that lives for passes: the plan's source line kept saying the grade 1 codes were still earmarked for two passes because two patches replaced a string that was not there and did not say so. Every replace asserts its count, including the ones that only touch a comment or a source line.
- Title case is applied where the title is shown, not where it is stored: course lists had been showing the stored sentence case while headings showed title case, which read as an inconsistency to Mikey. Wherever a stored title is printed, it goes through titleCase.

## Learned in pass LB (earmark E7 part three (b), grade 1 equations and word problems)

- A course title is checked at the end of an earmark, not the start: Numbers to 20 was right for six modules and wrong for nineteen, so it became Numbers, shapes and measuring once every grade 1 math expectation had a lesson. A retitle touches one string in logic.mjs and one in the click-through test; the review ledger and games plan regenerate.
- A lesson picture reused from an older grade carries its own words: the algebra balance says to do the same to both pans, which a first grader has not met. A grade 1 version of a picture gets its own drawing rather than a prop that hides a caption.
- A question mark written as a blank after a space (= ? + 2) reads to the spelling test as stray punctuation. Lesson prose says a missing number; the picture carries the question mark; a prompt builds the sentence at run time.
- A number sentence written in single digits is not a word to spell out letter by letter: the letters picture shows it on one line when it holds a digit or a sign.

## Learned in pass LA (earmark E7 part three (a), grade 1 number sense)

- A picture drawn on the lesson card must use the paper palette (#2E2E2E ink, white, B.green), never the theme's ink: the first number line came out near-white on the light card in the dark theme, and only the real-page screenshot showed it. Every new drawing is screenshotted in the built page before delivery for this reason.
- A `letters` show in a read-aloud lesson must be said as written (a numeral shown is a numeral said); when the line says number words, show an open number line or another picture instead.
- When two helpers share a name across banks, the later one shadows nothing but breaks the earlier one's calls if a blanket rename touches them; rename within the new block only, by its own banner, and run the whole rules test before moving on.
- Names of dots on a number line are staggered when two sit close, or they overprint (70 and 73 read as 7073).

## Learned in pass KZ (earmark E7 part two, grade 1 measurement and data)

- The untaught tool lists six missing answers per module and stops. A clock bank can ask twenty-four time phrases, and the report showed six, so a lesson that fixes the six it names is still short; read the module count in the heading, run the check again after the fix, and teach the whole set (two lines that count around the clock, once for o'clock and once for half past).
- A spoken explanation that says a digit twice ("zero zero") trips the doubled-word flag and sounds like a stutter; say what the digits mean ("two zeros", "three zero, thirty minutes").
- Choices read as capitalized wholes, so a helper that writes time phrases returns them capitalized, and a prompt or explanation that embeds one lowercases it. The rules test's own copy of the helper follows the same rule.
- A lesson line added above a painting's line moves the painting's step; the scripts test catches the drift (the painting then shares no word with its line), so re-check every `pictures:` step after inserting lines.
- A drawing that carries an exact count, time or length the question depends on is never replaced by a painting, however much better the painting would look, because a painted count can disagree with the words; the real thing beside it is the painting, on a line that states no count (P83 to P87).
- When a turn fails mid-pass and the sandbox keeps the work, read every lesson and sample every bank before building on them. The reading found a plural slip, a lowercase sentence start, an awkward question and a drifted painting that no test had caught.

## Learned in pass KY (earmark E7 part one, grade 1 geometry)

- An inclusive definition has to hold in the questions, not only the lesson. Once a lesson says a square is a special rectangle and a special rhombus, no question may offer rectangle or rhombus as a wrong name for a square, or show a square as a wrong picture when a rectangle or a rhombus is asked for, and the same for a cube among rectangular prisms. Tables of what is also true (ALSO_TRUE_OF, IS_ALSO, SOLID_ALSO) carry the rule, and the rules test checks it on every seed.
- A question that shows the thing it asks about can give the answer away. "A camping tent is shaped like which solid?" beside a drawing of the triangular prism is no question at all, so a real-thing recall question shows no picture.
- Where books disagree, do not ask. A cone's point is a vertex in some first grade books and not in others, so the lesson says the cone comes to a point and no question counts its vertices.
- A drawing for a lesson line is drawn for paper. The cut shapes first used the theme's own surface and ink colors and showed as black pieces with white seams in the dark theme, where every diagram sits on the almond board; the paper palette (white pieces, dark seams, the light theme's green) reads in both themes. Look at every new drawing in the real built page, in the theme the test page uses.
- The same pieces can make different shapes, so a "which pieces make this" question must exclude every piece set that can make the asked shape, not only the one drawn, and a yes-or-no about joining is only safe when the no is plainly impossible (straight-sided pieces never make a circle; two, three or four squares never make a triangle).

## Learned in pass KX (grade 1 Beat, high, low, loud, soft)

- A plan can cite a real section with the wrong letters: both grade 1 music codes pointed at expectations about voices and instrument families while their text described the beat and pitch. Read the lettered expectation the code names, not the text the plan wrote beside it.
- The fine arts sections run in threes (art, music, theatre per grade): §117.103 is kindergarten music and §117.106 is grade 1 music. Check the section number against the subchapter list before reading.
- A standard that names the words to use (allegro/largo, forte/piano) is taught by using those words, so a grade 1 lesson can say forte and piano as long as it says loud and soft with them.
- An older-grade lesson left inside a read-aloud course (prose with example.another and no script) is not at the full standard even when its facts are right; write the script and let the prose follow it.
- Fixed-question banks for the early years are written as whole, capitalized answers, never lowercase fragments, because the child reads the choice as a sentence of its own.

## Learned in pass KW (grade 1 Our community)

- A bank can already ask what another subject's earmark lists (coins counted in a social studies lesson while the math earmark waits to build them). Teach it where the bank asks it, cite it from the other plan, and narrow the earmark, rather than build it twice.
- A lesson can cite a code and teach only its examples (signs, under the purpose of rules and laws). Teach the purpose first, then the examples, and say so in the title.
- A popular story about a symbol (the bell rang for freedom) is not a fact. Say what can be checked: the word cast on the bell, the crack, the gift from France.
- A question setup like Three dimes becomes a sentence a child hears (Here are three dimes), and the rules test that re-derives the arithmetic follows the new words.
- A compass rose, a road sign and a map are question pictures now, validated like the rest; a sign carries its words and its color.

## Learned in pass KV (grade 1 Sky, water and living things)

- A plan's header can name the current edition while its codes come from the old one, and a code can exist in no edition at all. Read the section the header names, in full, and check that every code and its words are there; the grade 1 science plan had none of its three codes in the 2021 text.
- A grade can lose a topic when a standard is rewritten. The 2021 Texas grade 1 science standard has no Sun and Moon expectation (grade 2 has it), so a lesson that teaches them cites the recurring theme it serves (patterns, 1.5A) and the national expectation that fits (NGSS 1-ESS1-1), and says so in its source line.
- A bank at the bare minimum (six different questions for a round of five) is not at the full standard even if the pools report is clean; grow it from the script, kind by kind, until a child meets different questions each round.
- A young-learner question that shows an icon names it in its own words (a drop of water, over a fire, in the freezer of the fridge), and a question with no natural name for its picture shows none.
- A toy pictured as a teddy is called a toy in the question, not a toy dog, so the words and the picture agree.

## Learned in pass KU (grade 1 Reading words and sentences)

- A reading course shows the word and speaks the instruction, so a lesson without a script reads its paragraphs out, letter names and formulas included (b + o + x = box). Every sound in a script is said by its anchor word or a sound the voice can hold (mmm, sss), and a bare pair (sh, ch, th) is asked by its anchor word (the same two-letter sound as shell), never as letters a voice would name.
- A decoding bank must hold only words the course has taught how to decode. Read the word asked boat, car, tree, cone, ball and fish under a lesson about sounding out closed syllables; a word that needs a vowel team, an r-controlled syllable, a silent e or a digraph waits for its lesson.
- A plan row's words are the standard's words. "Ask and answer questions about a text" was no code of 110.3; the lesson teaches 1.6I, 1.7C, 1.8B, 1.8C and 1.8D, and is cited to those.
- A tracing lesson's any-letter question asks only the letters that lesson traces; the other families have their own lessons. Every stroke the pad draws is said (the u's short line down), and a story about tracing is about the letters its lesson traces.
- No story child leads two stories in one course (pass JX's rule holds in reading too): Kai, Ana and Sam each led two here.
- A phonics rule is taught with its exceptions named at the child's level (most words ending in e; have and come do not), so nothing has to be unlearned.

## Learned in pass KT (grade 1 Numbers to 20, the first grade 1 course)

- A read-aloud course from an earlier pass can have no script at all; the first grade lessons read their paragraphs out. Write the script first and the paragraphs to match, as pre-K and kindergarten were done.
- A plan can paraphrase a code into something weaker than the standard asks (1.2B without "in more than one way", 1.3B without its unknowns). Quote the code in full, then check the lesson against every clause.
- A symbol a voice would read aloud (>, <, =) is taught on a line that starts with Look, so the scripts test treats the shown sign as the thing to act on and the voice says its name instead; the choices for a sign question are the signs themselves, drawn large, and a tapped sign stays silent.
- A story's real object must truly come in the count the lesson uses. An egg carton holds a dozen in most kitchens, so a box of ten juice pouches became the ten.
- A story that describes a stroke order is checked against TRACE_LETTERS, as the lessons are: The Five drew the five down first, and the app draws it across the top first.
- A question that shows a ten and some more shows both (a pair of a ten frame and dots), and the rules test validates the pair, so what a child sees never disagrees with what the voice says.

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
