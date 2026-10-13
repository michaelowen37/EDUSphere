---
name: story-based-learning
description: Write or edit a story for a module: the Miniature Gladwell arc, the word limits, the core cast rules and the art serial. Use whenever a story is added to src/stories.mjs.
---
# Story-based learning

Stories live in `src/stories.mjs`, one per module id, written ahead of time (the app is static and offline). A reader's lesson offers View story in place of Practice this, and the story screen ends with Practice this; a pre-reader's story (a read-aloud course, pre-K 3 to grade 2) comes as the reward of the first passed round of its lesson (pass MD, Mikey): it reads itself aloud and one big arrow goes on, then it waits in an early learner's Let's Read, and a grown-up can also open it from the Story Log or the printed book; a course's long story (COURSE_STORIES) opens from Let's Read once the course is finished. Each story screen has Read the story to me.

## The Miniature Gladwell Method (Mikey's rule, verbatim in spirit)

Every story follows the 4-step arc of conceptual revelation:
1. **The Specific Human Anchor (the hook).** A relatable character facing a highly specific, concrete problem. Never start with an abstract definition.
2. **The Friction Point (the complication).** A roadblock common sense cannot solve. Stuck, curious, or desperate.
3. **The Micro-Insight (the turning point).** The module's idea is the tool that solves the problem.
4. **The Macro-Takeaway (the echo).** Zoom out to a universal truth. Leave a sense of wonder.

Tone: counter-intuitive curiosity ("Why can a ladybug climb glass but a lizard slips?"); the camera zoom (sensory close-up, then the sharp wide explanation); conversational authority (active voice, short sentences, rhetorical questions, the reader as a fellow explorer).

Checklist before shipping: the "So what?" test (without the story, would the question feel dry?), one specific sound, texture or visual (that anchors the illustration), and pacing: under 200 words for pre-K to grade 2, under 350 for everyone else. No em dashes. A 45-word run-on guard (pass JG; it was 32), and about eighteen words a sentence in the early years as a guideline (pass LE).

## Cast

Ages and relatives (Mikey, pass MB): "I think the ages and relatives are okay to mention in stories but keep the age part at a minimum.  It's actually good to state the age periodically just not consistently.  Relatives, no restriction anymore." So a story may name a core character's relatives freely (his uncle, Mike's wife, Frederick's dad), and may state a core character's age now and then, never as a habit. Since pass MC (Mikey, when 33 of 105 long stories stated one: "I think we should have half of that number for the 105 stories and keep a similar ratio throughout all of the grades/long stories") that is at most one long story in six, never two in a row in grade order, every chapter of six or more long stories with at least one and at most one in five, and at most one in six module stories with the core cast (tests/stories.test.mjs; `node tools/cast-ages.mjs > docs/CAST-AGES.md` lists them). Before adding an age, run the tool and choose a story whose neighbors in grade order state none. An about line never states an age, since the weekly note and the Story Log print it. A stated age fits the clock in `docs/CHARACTERS.md` or is plainly a flashback to a younger age (pass LZ), and agrees with every other story about that person (Frederick's microscope came at seven). Until pass MB this paragraph said never to write an age or a family tie into the text; the older long stories that did are within the new rule. Ages also live in the art prompts, where the illustrator needs them. A story may carry more than one picture: `more: [{ serial, alt, after }]` places an extra one after the paragraph at that index.

Read `docs/CHARACTERS.md` first. The core cast appears only where the idea deserves them; most stories belong to someone else or to no one. At most one new core character per story. Savanah, Jaxon and Harlow: wholesome scenes only. Georgette is the godmother of Mike's uncle.

Flashbacks and memories (Mikey, pass MG, Q3: "yes, it's good and your someth more idea is did good too"): a story about Mike, Chloe, Frederick or Georgette, at any age, may show one small moment that helped build the grown voice their Wonder answers speak with, and a later story may show a grown core character, Savanah too, remembering a moment an earlier story shows, one line at the right turn, never a retelling, after that story in grade order, agreeing with it and with the clock (the first two: speech-6's Georgette remembering the paper hat of writing-3, and psychology-college's Savanah remembering the two signs of psychology-9; an opening that recalls what no earlier story shows, like philosophy-3's, is backstory, not a memory). Careers are paths, not labels (Mikey, pass MG: "Savanah isn't always CTO.  She gets there through hard work and starts in customer service."; "Georgette works up to history teacher through her fascination with history"): write a working life at the step the story's chapter has reached, from the path in `docs/CHARACTERS.md`, which skips no real step a reader could ask about (a degree, a license), though a story's one line that looks back may sum the steps up, and search every story about that person, and its picture rows, when a step changes.

## Adding a story

1. Add an entry to `STORIES` in `src/stories.mjs`: `title`, `art` (the next free S serial), `cast` (core names only), `alt` (one sentence describing the picture), `words` (3 to 6 paragraphs).
2. Add its row to `docs/ART-REQUESTS.md` with a prompt in the Leonardo template and the character sheet it should reference.
3. `node tests/stories.test.mjs` checks the module exists, the limits, the serial, and the cast names.
