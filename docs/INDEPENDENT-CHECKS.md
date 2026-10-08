# Independent checks

Mikey (pass LY): "More agents delegated specific tasks that cross check each other before delivery is perfect for my project where every little detail is critical." A check catches what the writer cannot see. This file holds the briefs, so every chat runs the same checks the same way. A check is a separate agent that has not seen the work being made. It reads, runs what it needs and reports; it never edits a project file.

## How the checks fit together

Five layers, each catching what the one before it cannot (pass LZ):

1. Tests and tools, on every pass: check.sh and the audits hold every rule a machine can see.
2. Specialists, one area each, run when a pass touches their area: the story brief, the story flow brief, the picture brief, the screen brief, the lesson brief, the Wonder brief, the game brief, the accuracy check and the code brief.
3. The alignment read, on every pass: one reader across the whole pass, holding the vision, design, accuracy and the educational goal at once, because specialists can pull against each other.
4. The final read, on every pass that changed what people read: the pass's own record against what was done.
5. Mikey: direction, taste and every approval. No agent approves anything for him; what needs his word is listed for him in DECISIONS and in RULES-AUDIT section 11.

An agent starts with no memory of the chat, so it knows only its brief and the files it is pointed to. That is why the briefs live here and name their sources. An agent can be wrong too (pass LY's coloring audit wanted flags an image model would miscount), so every finding is read against the source before it is applied. Each check takes a few minutes, so a pass runs the specialists its work touched, not all of them.

## Who checks each part of NEW-CHAT

Mikey asked (pass LZ) whether every main item on the start-chat doc can be delegated to a separate agent. Every section of docs/NEW-CHAT.md is covered below, and the one part no agent takes is Mikey's own role. Each check named here carries the item in its own brief below. The docs sync test fails when NEW-CHAT gains a section with no row here, when a row names no check, or when a row names a check with no brief in this file.

| NEW-CHAT section | Checked by |
|---|---|
| How to start a new chat | The final read: the steps and the new-chat message are current. |
| Where things stand | The final read: the pass's bullet against the diff and the tests. |
| The plan, in Mikey's order | The alignment read: the pass follows the plan's order, and what it finds is logged where the plan keeps it. |
| Earmarks | The lesson brief (a standard no lesson teaches is earmarked) and the final read (EARMARKS updated). |
| The vision | The alignment read. |
| Roles | Mikey decides, and no agent approves for him. The final read checks that his words are quoted exactly and that his open questions are listed. |
| The two rules above all others | The accuracy check (rule 1) and the alignment read (rule 2), with every specialist in its own area. |
| How the teaching works | The lesson brief (mastery, banks, taught before asked), the Wonder brief, the story brief and the story flow brief (stories and the cast), the game brief (games) and the alignment read (projects, life skills, reading lists and the thinkers). |
| Standards | The lesson brief: each code read in full in its published text and taught in its lesson. |
| Pictures and audio | The picture brief, and the story brief for audio tags. |
| Licensing and hosting | The code brief, with the license and standalone page tests. |
| House rules | The spelling and style tests, the story flow brief and the final read. |
| How a pass is delivered | check.sh and the final read. |
| When to start the next new chat | The final read. |

## When

- Every story batch, module stories and long stories: the story brief and, by a second agent, the story flow brief, after the stories tests pass.
- Every batch of pictures written to the ledger (story scenes, lesson paintings, coloring pages, images to try): the picture brief.
- Every change a child or an educator sees on a screen: the screen brief, with screenshots from the built page in both themes and at phone width.
- Every batch of lessons and question banks: the lesson brief; lessons written as connected prose also get the story flow brief.
- Every new or changed Wonder question: the Wonder brief.
- Every new or changed game: the game brief.
- Every pass that adds or changes a fact: the accuracy check.
- Every pass that changes code beyond content: the code brief.
- Every pass: the alignment read, after the specialists; then, on any pass that changed what people read, the final read before check.sh.
- Checks that do not depend on each other run at the same time (pass LY ran the coloring audit and the screen review in parallel).
- The final read doubles as the second read of a pass's earlier checks when it re-reads their fixes (pass LY).

## How

1. Prepare what the reviewer reads: a file with the new work beside what it must match (the lesson for a story, the rule and the levels for a coloring page, the diff with Mikey's own words and screenshots for a screen). Give paths, never pasted fragments.
2. Brief it from the matching section below. Ask for MUST FIX (each with the exact place, the problem and an exact fix), SHOULD CONSIDER, and CLEAN, under a word limit.
3. Read every finding against the source before acting. Apply the real ones; where one is wrong or a matter of taste, say so in DECISIONS.
4. Send the fixed work back for a second read. A second read found a new problem in pass LX, after sixteen fixes, and the fixes themselves can break a limit or a voice.
5. Record in the pass's DECISIONS entry what each check found and what was done.

## The story brief

Read each story against its lesson (paragraphs, key idea, script lines) and report on:
1. Plot: a real problem, a turn where common sense fails and the lesson's idea solves it, a resolution, and a short moral that restates the key idea.
2. Facts: only the facts the lesson teaches. A general fact is said by a grown-up, never by the narrator, except in the moral. Narration is in the past tense. The narrator never states a child's mistake as fact.
3. Logic and continuity, action by action: who is where, what they hold, how a thing got there, whether a character could know what they say.
4. Safety, read as a careful parent would: water, roads, heights, animals, running, small objects, strangers, weather (a far storm, its flash before its thunder), in the words and in the picture descriptions.
5. Pictures: each fits the paragraph it follows and shares a meaningful word with it; nothing needs letters or numbers drawn; a count the words give is named; a picture never contradicts the words.
6. The cast: a core character is the age the clock in docs/CHARACTERS.md gives for the grade, and a core-cast story fits that person's path toward the grown voice the Wonder questions give them (Mikey, pass LZ: "a sophisticated story that has flashbacks to their childhood to show how they developed the mindset they have today").
7. Audio: the tagged text strips back to the words exactly; tags sit at real turns; sound effects only for sounds the words name; the moral opens [slowly, warmly].
8. Course rules: no lead child in two stories of a course; the long story uses each idea as its lesson teaches it.

The prose itself, its rhythm and its colons, is the story flow brief's, read by another agent.

## The story flow brief

Mikey (pass LZ) noticed that no agent read "the flow of the story (varying lengths, natural conversational flow with little to no colons or semi colons)". A reader hunting for facts and safety stops hearing the rhythm, so a separate agent reads the prose alone, aloud in its head, the way a parent reads at bedtime. Run node tools/story-flow-audit.mjs first; the reader hears what the tool cannot. Report paragraph by paragraph:
1. The flow tool's rules are the floor (RULES-AUDIT section 3: no three sentences of six words or fewer in a row, no four in a row within three words of one length, no Then right after a Then). Beyond them, lengths vary on purpose, short, medium, long, medium (CLAUDE.md, story prose, 2026-09-28): flag by ear any stretch that sounds even or clipped, and any paragraph of short lines written to fit pictures.
2. Ideas connect the way people talk, with and, so, but, when and because, rather than a stack of short facts.
3. Little to no colons or semicolons: quote each one with the sentence rewritten without it.
4. A warm storyteller talking, not a textbook: plain words, real speech for each character's age, no stiff phrase, and no word repeated close by without a reason.
5. Openings vary: no three sentences in a row starting with the same word or name, except a refrain the story repeats on purpose.
6. The early years are read aloud to a young child: sentences of about eighteen words or fewer (a guideline since pass LE), words a young child knows or the lesson teaches, and a short, warm moral. The three-syllable guideline was retired in pass LY, though older lines in CLAUDE.md still name it.
7. Every rewrite it proposes keeps the lesson's facts and words, each picture beside its paragraph (rewords go through tools/stories/rewords.py), and the audio, which must still strip back to the words exactly.

## The picture brief

Read each scene and prompt in the ledger rows of the batch and report on:
1. Coloring pages: a scene with several things to color, never one object alone, at its level (tools/coloring-levels.mjs: pre-K 3 a few things in big roomy shapes, pre-K 4 a small scene, kindergarten a setting and simple patterns, grade 1 a detailed scene with patterns and a full background, grade 2 a rich scene with many small areas).
2. Lesson pages keep the lesson's idea; letter lessons show things that start with their letters.
3. Nothing needs letters, numbers or writing: clocks with plain faces, blank signs, buses, books, keyboards, phones, coins and magnets without marks, plain number-line marks.
4. Counts that matter are small, said in words, and carry a check note.
5. A page that stands in for a thing in lessons and questions (D4 flower, D5 rocket, D6 butterfly, G pages) keeps that thing the one big focal point, with nothing a question might ask a child to find instead.
6. Story scenes and paintings: the scene fits its paragraph or lesson line; the background word fits the scene (a dinner table is not on a town street); a character-sheet note ends the prompt, never the negative prompt.
7. Safety: a young child near water, a road or a height has a grown-up nearby, and a child waiting for a swing waits away from it.
8. National, state and historic flags (Mikey, pass LZ): left out where the picture can do without one; otherwise an accurate one, and "perhaps it can be waving in the wind or folded slightly to purposely obscure the pattern a little", so outdoors a flag may wave and indoors hang in soft folds, hiding part of its pattern. A simple flag a lesson teaches whole (the Texas flag on D81) may show whole with its check note, and a marker flag (a tug-of-war rope's, a race's checkered flag) is not a national flag. A flag's stars or band sit by the pole, and a hand over the heart is the right hand. An exact flag (counted stripes or stars, a flag of a past year, words on a flag), or a flag a page can do without but would be better with (Try D78), is a desired image that may or may not work: its hoped-for version goes under Images to try at the end of docs/ART-REQUESTS.md, beside a safe planned version. Where a story's words count stripes or stars, a folded flag would contradict them, so the planned picture leaves the count to the words. EARMARKS A5 lists the pictures waiting for this, and A6 the early-years pictures that depend on drawn letters, words or numerals (a prompt that asks for a letter while its negative prompt bans letters asks for what it forbids).

## The screen brief

Read the diff, Mikey's words and screenshots, and the new screenshots, and report on:
1. Does it do what he asked, in every place the change applies? Search the code for every other place it should reach.
2. Is it uncluttered, consistent across screens and readable in both themes (contrast of small or muted text)?
3. Robustness: matching rules, edge cases (one to six choices, long text at 360 pixels), spoken words, screen reader names and aria attributes, test hooks.
4. Tests: do the checks prove the behavior, or could one pass vacuously or fail for the wrong reason? The browser tests read textContent, which includes hidden text and the page's style text (its comments say Mikey, so a search for Mike can land there); visibility needs isVisible, and a search for words starts from a heading on the screen.
5. Content changed along the way (Wonder text needs Mikey's approval, pass IK).
6. Anything else a careful owner would want fixed.

## The lesson brief

Read each lesson and bank against its cited standards and report on:
1. Every cited code is taught in the lesson, in the learner's words, quoted from the published text read in full.
2. Every question asks only what the lesson says first (taught before asked), every answer is right (recompute it), and no wrong choice shares the asked property.
3. Explanations give the reason in whole sentences; the spoken script says every answer and picture its bank asks for; pictures show what the line names.
4. Facts are current and sourceable; nothing a lesson teaches contradicts another course.
5. Every expectation of a cited standard that no lesson teaches is earmarked in docs/EARMARKS.md, in the standard's own words, with the pass and Waiting.

## The Wonder brief

Read each new or changed Wonder question and its four voices and report on:
1. The theme: philosophy, fallibilism (we can be wrong, and that is how we learn), emotional resilience or the reframing of failure, with no answer declared right.
2. The voices in order, Frederick, Chloe, Georgette and Mike, each speaking from that person's grown mindset (Mikey, pass LZ: "All of the little experiences they had throughout life led them to either become a scientist, artist, grandparent of faith or skeptic"): Frederick from evidence and experiment, Chloe from what things look and feel like, Georgette from a faith that is personal and never a sermon, and Mike from doubt that tests an idea and holds it loosely. Each voice sounds like its person and no other.
3. Neutral on religion and non-belief: no voice argues another down.
4. Hard feelings: calming the body and absorbing distraction, never venting a feeling out (pass IX), with safe-messaging practice.
5. The early stages: the question and its choices make sense heard aloud from pre-K 3 to grade 2, with choices short enough to hold in mind, and the two short voices a pre-reader hears (simple) each speak in a young child's words and stay true to their person's way of seeing.
6. Thinkers: ideas paraphrased accurately and credited, and any quote exact.
7. Any edit to existing Wonder text is listed in DECISIONS for Mikey's approval (pass IK).
8. New questions are listed for approval and reach a student only after an educator approves them (pass IL).

## The game brief

Read each new or changed game and report on:
1. It teaches what its course teaches: its rule or deck comes from the course's lessons, said there before the game is played (passes IN and IO).
2. It plays on a phone and on a laptop: the board fits, taps and drags land (node tests/e2e/game-layout.mjs), and a game that moves opens behind its Begin cover.
3. The youngest games are wordless or spoken, and the first open game in a grade is a playful one.
4. The look of a card never gives its answer away (pass IY), and every answer is computed.
5. It is fun: a real goal, a reason to try again, and nothing that punishes a miss.

## The accuracy check

Rule 1 has its own reader whenever a pass adds or changes facts (lessons, stories, Wonder voices, game decks, banks, picture prompts). It lists every factual claim in the new words (a date, a number, a name, a scientific or historical fact, a quote, a law), checks each against a published source read online, recomputes every number, and reports each as confirmed (with its source), wrong (with the fix and its source) or unsure (to be said plainly or removed). The newest research comes first, with older findings kept as history with their dates (pass IG); a quote is exact and credited or not used; a statistic must be sourceable (pass IJ).

## The code brief

.claude/agents/reviewer.md, defined for this project on 2026-09-04 (DECISIONS, Working method: larger changes get a fresh-context review, gaps only), reads a code change against the rules in CLAUDE.md: hooks above the first return, no new storage calls, links, forms or outside scripts, no statistic a child must interpret, and an independent arithmetic check for new content. Also read for privacy (nothing about a child leaves the device; no photos, names or free text kept), security (safeJson, escaped markup, the Content Security Policy kept, no private key in the repository) and licensing (the free grades, and an educator's walk-through never gated). Run it on any pass that changes src, tools or tests beyond content.

## The alignment read

Mikey (pass LZ) asked for "overarching agents with the overall vision, design, accuracy and educational goal in mind to make sure everything aligns". One reader holds all four at once, because the specialists go deep in one area each and can pull against each other (a picture reader asks for more detail while a read-aloud reader asks for less). It reads docs/VISION.md, NEW-CHAT's vision, its two rules and how the teaching works, docs/DESIGN.md, the pass's DECISIONS entry, the diff, the specialists' reports and the screenshots, and reports on:
1. Vision: does the pass move the product toward understanding and wisdom rather than memorization, with lessons, stories, Wonder questions, games and memory checks pointing at the same ideas?
2. The learner: is anything harder, slower or more confusing for a child or an educator than before? Rule 2 wins over a house rule, and the exception is recorded.
3. Accuracy: did a fix trade accuracy for neatness (a rounded fact, a picture that now contradicts its words)?
4. Design: do new screens and pictures look and behave like the rest, in both themes, with the young learners' cues?
5. The educational goal: is every new idea taught before it is asked, said more than one way where the topic bears it, and tied to its standard?
6. Conflicts: where two specialists' fixes disagree, or the pass disagrees with something already decided (DECISIONS, RULES-AUDIT), name both sides; a matter of taste or direction goes to Mikey.
7. Drift: is every new rule written where it will be kept, a RULES-AUDIT row, a CLAUDE.md line, and a test wherever a machine can see it?
8. The plan: does the pass follow NEW-CHAT's plan in Mikey's order and the NEXT line of the newest pass, and is what it found logged where the plan keeps it (EARMARKS, DECISIONS)?
9. Growth: science projects, life skills, reading lists and the thinkers Mikey named, wherever the pass's material has room for them (NEW-CHAT, How the teaching works).

## The final read

Before check.sh, read the pass's DECISIONS entry, COMMIT-MESSAGE, WHATS-NEW block, NEW-CHAT (the pass's bullet, How to start a new chat and When to start the next new chat), EARMARKS and RULES-AUDIT section 11 against the diff and the test results: every claim true, every number right, nothing missing that Mikey would want to know, his own words quoted exactly, the new-chat message current, every earmark the pass found logged, and every question he has not answered listed for him.
