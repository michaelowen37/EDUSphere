# Start here: a new chat for The Wise Human

Written 2026-10-02 (pass HX), when the question-bank program finished. Mikey asked that every new chat carry the whole project: the vision, the plan, the roles, the standards and every preference. This file is that carry-over. Read it first, then the latest entry in docs/DECISIONS.md, then docs/HANDOFF.md.

## How to start a new chat

1. Commit the last delivered zip on GitHub first, using docs/COMMIT-MESSAGE.md, so the new chat starts with a fresh commit message.
2. Open a new chat inside the claude.ai Project "The Wise Human".
3. Upload the latest delivered edusphere-project.zip. A new chat starts with an empty workspace; the zip is the repository.
4. Send: "New chat for The Wise Human. Unzip the project, read docs/NEW-CHAT.md and the latest DECISIONS entry, then continue. Committed through <pass>."
5. Optional and helpful: add this file to the Project's knowledge, so every chat in the Project sees it before the first message.

## Where things stand (pass IR)

- 118 courses, 603 modules in 15 subjects, 99 long stories, 148 games in 57 kinds; every module fills its practice round without repeating a question, and every prompt in every bank is under its length limit.
- Mikey committed through HY and opened the Project's first new chat, which delivered passes HZ to IR; Mikey committed through IL. Confirm with him what is committed, and start the commit message fresh after each commit he reports.
- Next, in order: the question review program (docs/QUESTION-REVIEW.md: every question read by hand, grade by grade (pre-K in pass IC, kindergarten in ID, grades 1 and 2 in IE, grades 3 to 5 in IF, grades 6 to 8 in IG and IH, grades 9 and 10 in IH, grades 11 and 12 in II, college in IJ, early and growing Wonder questions in IK, teen and grown in IL; games first look in IM, the space shooter in IN, every game matched to its course in IO, swipe cards in IP, drag to the box in IQ, streaks everywhere in IR; the Wonder pool program next), then the Wonder questions and game cards); the approved college courses (General Psychology PSYC 2301 first, then ECON 2301, SPCH 1315, PHIL 1301, ARTS 1301, MUSI 1306, AGRI 1131, ENGL 1301, BIOL 1308); health science (Principles of Health Science) and engineering; then the pictures program (pre-K and kindergarten first), the audio program, and the launch items. Not Spanish: Mikey cannot review it.

## The vision

The Wise Human (formerly EduSphere), by iECHO, LLC, tagline "Where Knowledge Meets Wisdom": a mastery-based, adaptive learning app from pre-K 3 through college that teaches understanding and wisdom, not memorization. Students learn through lessons that demonstrate, stories that make ideas stick, Wonder questions that build judgment and resilience, games, and memory checks that keep knowledge alive. docs/VISION.md holds the longer statement.

- Audience: homeschool families and microschools, Texas first, through the Texas Education Freedom Accounts vendor plan (docs/TEFA-PLAN.md).
- The moat is depth: every subject strand from kindergarten to grade 12 and college, standards alignment checked against published texts, a recurring cast that grows up with the learner, Wonder questions, a new game for every course, large question banks and an offline, private design. A few lessons are easy to copy; the whole connected system is not.

## Roles

- Mikey: owner and product lead, with Savanah (RDCS) as product owner. He sets direction, reviews on his phone, generates the pictures and the audio, and commits to GitHub.
- Claude: product strategist, technical lead, curriculum writer, builder and tester, and an honest critic. Claude says plainly when something is wrong, uncertain or a bad idea, asks only questions that change the build, and never hands back half a pass.

## The two rules above all others

1. Accuracy of absolutely everything, whatever it costs in time or passes. Standards are quoted only from published texts read online in full before citing. Facts, dates and figures are checked twice; numbers are computed in code wherever possible. Uncertainty is stated, never guessed over. Mistakes are owned, fixed and recorded in docs/DECISIONS.md.
2. Educational quality and the learner's flow come first. When a house rule would make the learning or the experience worse, do the right thing for the learner, say so plainly, and record the exception. Mikey's example: the youngest two-way modules grew past five different questions because more examples teach better. Adding questions, examples or variety is welcome whenever it improves learning; reducing them is not: a practice round never gets shorter.

## How the teaching works

- Mastery per module, a placement check, quick checks to skip what a student knows, and memory checks that revisit mastered modules over time (spaced repetition).
- Large question banks: no practice round ever repeats a question (questionKey in logic.mjs), every module holds at least its round length plus two different questions, every round is full length, and the rules tests enforce all three. Every answer must be taught in its lesson (tools/untaught.mjs).
- Wonder questions: one for every two modules. Themes are philosophy, fallibilism (we can be wrong, and that is how we learn), emotional resilience and the reframing of failure. Each is answered by four voices, a scientist, an artist, a grandparent of faith and a skeptic. After a failed module or several misses, failure and tough-feelings questions come first. No student sees the same question more than twice, and the pools must hold enough for years. Early learners hear them aloud and tap an answer.
- Stories: one short story for every module and one long story for every course. Short stories run 100 to 200 words with five pictures for early learners, 240 to 350 words with six pictures from grade 3; long stories run 400 to 460 words in eight paragraphs with six pictures. They follow the Miniature Gladwell Method: a specific person with a concrete problem, a friction point common sense cannot solve, the concept as the tool, and a zoom out to a universal truth. Write with varied sentence lengths, short ones that hit and long ones that carry, in an active, conversational voice, with one sensory detail and the "so what?" test.
- The cast grows up with the learner. Four core characters mature across the grades into their ways of thinking: Frederick the scientist, Chloe the artist, Georgette the grandparent of faith, and Mike the skeptic and fallibilist. Three side characters appear at random: Savanah, Mike's wife; and their children Jaxon and Harlow. Never bunch stories about the same character together; mix in many one-off characters; keep cultural sensitivity. docs/CHARACTERS.md holds their descriptions. Stories never show students in romance.
- Games: a new kind of game for every course, for variety (docs/GAMES-PLAN.md).
- Keep growing, pass after pass: science projects, life skills and reading lists, wherever they fit.
- Thinkers Mikey enjoys: Socrates, Aristotle, Marcus Aurelius, Viktor Frankl, Arthur C. Brooks, Naval Ravikant, David Deutsch, Karl Popper, the Dalai Lama, Brett Hall, Michael Singer (The Untethered Soul), Rick Hanson (Hardwiring Happiness) and Chris Williamson (the Modern Wisdom podcast). Let their mindsets, outlooks and research steer Wonder questions, stories and lessons. Quoting is optional; any quote must be exact, checked and credited, and no one's words are ever invented. Their books sit on the reading lists where they fit (pass HY).
- Arthur Brooks matters most to Mikey, and two of his ideas are worth carrying into the work. Boredom: Brooks argues that boredom switches on the brain's default mode network, which turns the mind toward questions of meaning and purpose, so filling every gap with a phone crowds meaning out; his practice is phone-free stretches, none in the bedroom and none in the first hour after waking. Hemispheric lateralization, drawn from the neuroscientist Iain McGilchrist: the left hemisphere handles complicated how questions, the right handles complex why questions of meaning, and Brooks argues phones pull people toward left-hemisphere living. Teach both as Brooks's and McGilchrist's arguments, framed honestly: the hemispheres do specialize in some functions, but the popular idea of left-brained and right-brained people is not supported by the evidence, and McGilchrist's larger thesis is debated among neuroscientists.

## Standards

Texas Essential Knowledge and Skills first, read from TEA or the Texas Administrative Code, with national frameworks beside them: Common Core, the Council for Economic Education, the National Health Education Standards, AFNR for agriculture, CSTA for computer science, the National Core Arts Standards, the Texas Prekindergarten Guidelines, ELOF, the College and Career Readiness Standards, and Texas's college course guide (ACGM) for college courses, plus any other reputable authority that fits. Cite only what was read complete. Human sexuality instruction is consent-gated (Texas Education Code 28.004).

## Pictures and audio

- Pictures matter in appearance and in accuracy. Mikey would always rather generate an image than have Claude draw one, whenever that gives the learner a better experience; Claude's drawings are placeholders. He generates in Leonardo (model Nano Banana 2) with the house template: "[Core Subject Concept], [Playful Modifier]. Style: Clean 3D vector illustration, vibrant and engaging color palette, minimalist background, balanced lighting. Professional educational graphic style, clear focal point, uncluttered layout, [Visual Anchor]." Text, words, letters and labels always go in the negative prompt.
- The illustration and prompt ledger is docs/ART-REQUESTS.md, with every picture's serial (S for story pictures, CS for long-story pictures, D for coloring pages) and its prompt, exported to docs/LEONARDO-PROMPTS.csv. Mikey generates, uploads and names the serial; Claude places it. docs/LEONARDO-BRIEF.md has the details.
- Audio: ElevenLabs, Creator plan first. Story text gets captions and v4 audio tags, a slice per pass once the pictures begin, with placeholders until then.

## Licensing and hosting

Pre-K and kindergarten are free; the paid grades open with signed license codes checked offline. The private key never goes in any repository. Licensing stays switched off (LICENSING_LAUNCHED) until launch. docs/LICENSING-AND-HOSTING.md and docs/TEFA-PLAN.md hold the details.

## House rules

No em dashes anywhere a user can see; American spelling; quick-check prompts under 70 characters; every sentence 32 words or fewer and key ideas 28 or fewer; teaching text drawn out, one idea per line, with worked examples; young learners' lessons demonstrate rather than describe; clean, readable, secure code with a plain-English header comment on every block; when Mikey supplies wording, use it exactly.

## How a pass is delivered

Diff the workspace against the last delivered zip, read the commit message and the latest DECISIONS entry, do one pass, run ./check.sh detached (it takes about ten minutes) until it ends ALL CHECKS PASSED, write the DECISIONS, WHATS-NEW, HANDOFF and COMMIT-MESSAGE updates, zip the project, publish the preview to https://claude.ai/artifact/YBgDctfRHJ2bZLCnAz33qr with the planet favicon, and present the files. Save progress to the Project's memory often. CLAUDE.md and docs/RUNBOOK.md hold the full steps.

## When to start the next new chat

Claude says so when a program has just finished, every check passes, and ideally Mikey has committed, and updates this file at that moment.
