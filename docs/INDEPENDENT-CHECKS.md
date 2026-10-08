# Independent checks

Mikey (pass LY): "More agents delegated specific tasks that cross check each other before delivery is perfect for my project where every little detail is critical." A check catches what the writer cannot see. This file holds the briefs, so every chat runs the same checks the same way. A check is a separate agent that has not seen the work being made. It reads, runs what it needs and reports; it never edits a project file.

## When

- Every story batch, module stories and long stories: the story brief, after the stories tests pass.
- Every batch of pictures written to the ledger (story scenes, lesson paintings, coloring pages): the picture brief.
- Every change a child or an educator sees on a screen: the screen brief, with screenshots from the built page in both themes and at phone width.
- Every batch of lessons and question banks: the lesson brief.
- Before check.sh, on any pass that changed what people read: the final read.
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
6. Read-aloud and flow for the early years: sentences of about eighteen words or fewer; no three sentences in a row of six words or fewer (one-word sentences and the moral are exempt); no four in a row within three words of one length; no two sentences in a row starting with Then; American spelling; no em dashes.
7. Audio: the tagged text strips back to the words exactly; tags sit at real turns; sound effects only for sounds the words name; the moral opens [slowly, warmly].
8. Course rules: no lead child in two stories of a course; the long story uses each idea as its lesson teaches it.

## The picture brief

Read each scene and prompt in the ledger rows of the batch and report on:
1. Coloring pages: a scene with several things to color, never one object alone, at its level (tools/coloring-levels.mjs: pre-K 3 a few things in big roomy shapes, pre-K 4 a small scene, kindergarten a setting and simple patterns, grade 1 a detailed scene with patterns and a full background, grade 2 a rich scene with many small areas).
2. Lesson pages keep the lesson's idea; letter lessons show things that start with their letters.
3. Nothing needs letters, numbers or writing: clocks with plain faces, blank signs, buses, books, keyboards, phones, coins and magnets without marks, plain number-line marks. Flags with exact star and stripe counts stay out unless a check note names the count to see before saving.
4. Counts that matter are small, said in words, and carry a check note.
5. A page that stands in for a thing in lessons and questions (D4 flower, D5 rocket, D6 butterfly, G pages) keeps that thing the one big focal point, with nothing a question might ask a child to find instead.
6. Story scenes and paintings: the scene fits its paragraph or lesson line; the background word fits the scene (a dinner table is not on a town street); a character-sheet note ends the prompt, never the negative prompt.
7. Safety: a young child near water, a road or a height has a grown-up nearby, and a child waiting for a swing waits away from it.

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

## The final read

Before check.sh, read the pass's DECISIONS entry, COMMIT-MESSAGE, WHATS-NEW block and NEW-CHAT bullet against the diff and the test results: every claim true, every number right, nothing missing that Mikey would want to know, his own words quoted exactly.
