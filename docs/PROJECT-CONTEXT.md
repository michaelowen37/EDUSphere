# Project Context

For the claude.ai Project "The Wise Human". Written in pass MM (October 19, 2026), and updated in pass MN (October 20, 2026) for where the answered questions now live and how the pre-K earmarks are built, and in pass MO for the app's own speech sounds and a new way to answer. This is the short, slow-changing picture every chat in the Project should start with. The project zip is the source of truth: if anything here disagrees with the zip, the zip wins, and Claude says so. Claude tells Mikey when this file needs an update (a change to the vision, the roles, the plan or a standing preference); the state of the work lives in the zip, never here, so this file does not go stale between passes.

## 1. What we are building

The Wise Human (formerly EduSphere), by iECHO, LLC, "Where Knowledge Meets Wisdom": a mastery-based, adaptive learning app from pre-K 3 through college, for homeschool families and microschools, Texas first (the Texas Education Freedom Accounts vendor plan). One web page that works offline; nothing about a child leaves the device. Pre-K and kindergarten are free; later grades will open with signed license codes once licensing is switched on at launch.

The aim is understanding and wisdom, not memorization. Students learn better when they look forward to the material (Mikey's point in pass MM), so the app teaches through lessons that demonstrate, stories that make ideas stick, games whose rules are the lesson, celebrations, and Wonder questions that build judgment and resilience, while multiple examples, spaced repetition, mastery, wrong-answer explanations and educator reports make the learning last. Depth, quality and the student's experience come before speed (Mikey, October 19, 2026: "We don't need to lean too heavily in the 2 hour learning part of the vision; depth, quality of learning and student experience matter more.").

The moat is depth: every subject strand from pre-K to college, standards quoted from their published texts, a recurring cast that grows up with the learner, Wonder questions, a game for every course, large question banks, and an offline, private design. A few lessons are easy to copy; the whole connected system is not.

## 2. Roles

- **Mikey**: owner and product lead. He sets direction, reviews on his phone (and a Mac laptop in Chrome), generates the pictures (Leonardo) and the audio (ElevenLabs), commits to GitHub, and alone approves.
- **Claude**: product strategist, technical lead, curriculum writer, builder, tester and honest critic. Claude says plainly when something is wrong, uncertain or a bad idea, asks only questions that change the build, never hands back half a pass, and never flatters.

## 3. The two rules above all others

1. **Accuracy of absolutely everything**, whatever it costs in time or passes. Accuracy of what exists comes before new material. Standards are quoted word for word from published texts read in full; facts are checked against sources; numbers are computed in code; uncertainty is said, never guessed over; the newest research is taught, with older findings kept as history with their dates.
2. **The learner first.** When a house rule would make the learning or the experience worse, do the right thing for the learner, say so, and record the exception. Questions and examples are never reduced.

## 4. How the teaching works, as one system

- **Lesson**: shows before it tells. For a child who cannot read yet, the spoken script is the lesson, with a picture on every line. Every answer a question asks is taught first.
- **Practice round**: large banks, never a repeated question, every answer computed and re-derived by the tests. After an answer, More Info, written bank by bank as each course is reviewed (EARMARKS L10), says why each wrong choice does not fit and gives more right examples. A pre-reader answers by tapping, and since pass MO can follow a spoken direction by tapping pictures in order, each tap numbered.
- **Mastery**: a lesson is passed once, then earns its star on another day; memory checks and the Quick Review (a light look back weeks later) keep it alive. A child who keeps missing loops back to the lesson that comes before.
- **Stories**: a short story for every lesson (a pre-reader hears it as the reward for a passed round) and, for each course, a long story at the first celebration (every lesson passed) and a second at mastery (every star), each written as the review reaches the course (EARMARKS L1 and L9). Stories follow the miniature Gladwell method: a specific child, a real problem, a turn where common sense fails and the lesson's idea solves it, and a short moral.
- **The cast**: Frederick (the scientist), Chloe (the artist), Georgette (the grandparent of faith) and Mike (the skeptic) grow up across the grades, with Savanah, Jaxon and Harlow dropping in; one-off children fill the rest. The Wonder voices are the cast speaking as grown people, and the stories are flashbacks to how each came to see the world.
- **Wonder questions**: one for every two lessons, on philosophy, fallibilism, emotional resilience and reframing failure, answered by the four voices with no answer declared right; failure and hard-feelings questions come first after a rough patch.
- **Games**: every course owns a game that teaches its own idea. From pre-K 3 to grade 2 a course's game opens at its first celebration; from grade 3 up, when every lesson has its star (Mikey's answer to Q45).
- **Educators**: plain-English reports computed from an unchangeable record, Action Items, and every course's standards on a map.
- Science projects, life skills and reading lists keep growing wherever they fit. Thinkers to draw on, credited and never misquoted: Socrates, Aristotle, Marcus Aurelius, Viktor Frankl, Arthur C. Brooks (who matters most to Mikey), Naval Ravikant, David Deutsch, Karl Popper, the Dalai Lama, Brett Hall, Michael Singer, Rick Hanson and Chris Williamson.

## 5. Standards

Texas first (TEKS from the Texas Administrative Code or TEA; the 2022 Texas Prekindergarten Guidelines), with national frameworks beside them: Head Start's Early Learning Outcomes Framework, Common Core, the Council for Economic Education, the National Health Education Standards, AFNR, CSTA, the National Core Arts Standards, the College and Career Readiness Standards and Texas's ACGM for college courses. Read a standard in full in the agency's own text before citing it, quote it word for word (the pre-K texts are kept in docs/standards, and a test holds every pre-K quote to them), check the edition, cite a code taught in part as in part and say what waits, and log every expectation no lesson teaches yet in docs/EARMARKS.md.

## 6. Pictures and audio

Pictures matter in appearance and accuracy, and Mikey would always rather generate a picture than have Claude draw one when that gives the learner a better experience. He paints in Leonardo, with the model and settings docs/LEONARDO-PROMPTS.csv names and the cast's character references, from the ledger, docs/ART-REQUESTS.md, exported to docs/LEONARDO-PROMPTS.csv in his painting order. Prompts say what a picture shows, never what it lacks. Pre-K to grade 2 pictures carry no words; from grade 3 up a picture may carry one or two short scene words. A drawing that carries an exact count, time, letter or label a question depends on stays drawn by the app. Audio is ElevenLabs v4, with tags written into each story as its course is reviewed (docs/AUDIO-LEDGER.md). Until a line is recorded the device's voice says it, and since pass MO the app plays the speech sounds a lesson names itself (the hiss of s, the hum of m, the crisp t), the same on every device, since some voices spelled them as letters; a voice check page (tools/voice-check.mjs) lets Mikey hear them on his phone.

## 7. Mikey's standing preferences

- The light theme is frozen: it changes only at his word or as a fix a check asks for, and every change is recorded in docs/RULES-AUDIT.md section 8 for his review.
- The tour cards' words are his and never change (only a typo is fixed, and he is told). Wherever he supplies wording, use it exactly, and quote him exactly.
- Questions for him carry numbers (Q1 upward) that never change and are never reused. Each delivery lists every open question in full sentences for a phone reader with the app closed: where in the app, who meets it, what they see today, a concrete example, what each choice changes, and the recommendation with its reason. He answers by number.
- Wonder questions and edits ship without waiting for him and are quoted in DECISIONS for his later check.
- Writing: varied sentence lengths, conversational and explanatory, no em dashes, American spelling, colons rare and semicolons sparing; the early years are read aloud to a young child.
- Every structural or algorithm change goes into docs/RULES-AUDIT.md in the same pass; nothing there is deleted or changed without his approval.
- Never take a shortcut, even when the right way is slower or costs more.
- No Spanish course (he cannot review it).

## 8. How a chat works

- **Starting**: Mikey commits the last delivery, opens a new chat in this Project, uploads the latest edusphere-project.zip (or the last checkpoint zip if a pass stopped midway) and sends the message in docs/NEW-CHAT.md with "Committed through <pass>" and any answers by number. The zip is the repository; if it is missing, Claude asks for it before anything else.
- **Reading**: CLAUDE.md (the short manual), docs/NEW-CHAT.md (the current state, the open questions, how to start), docs/RULES-AUDIT.md (every rule and what enforces it), docs/EARMARKS.md (what is still to build), docs/INDEPENDENT-CHECKS.md (the checkers' briefs) and the latest docs/DECISIONS.md entry.
- **A pass**: one pass at a time. The standards are read online; the work is built; the fast tests and tools run; independent checks read it in layers on a frozen copy; real findings are applied and re-read; the docs are written; check.sh runs to ALL CHECKS PASSED; the zip is built and compared; a new preview is published; the files and a message with every open question go to Mikey, with what changed for future passes.
- **Not losing work**: a memory checkpoint after each patch, and checkpoint zips at each milestone and every two hours, which a new chat can pick up from. Claude says when a new chat is due (when the chat starts compacting or a program finishes).

## 9. How we keep it right (adopted in pass MM)

Effort goes where it holds most, top first:

1. **Structure**: one source of truth for every fact (logic decides, screens only draw; one list, never two copies kept in step by hand), so the easy change is the right change.
2. **Checks**: check.sh runs every test and the tools the tests call; the comparison tools, the ledgers' generators and the full game layout audit run on their own. A rule a machine can see becomes a test or a tool, proven failing on a real past mistake and its near misses; a mistake class seen twice gets a check (docs/MISTAKE-CLASSES.md ranks the kinds of mistake the checks have found).
3. **Prose**: CLAUDE.md, RULES-AUDIT and the briefs carry only what needs judgment, kept short and current; history is archived, never deleted.
4. **Review**: independent agents in layers (specialists, the alignment read, the final read, second reads of every fix), and Mikey last, who alone approves.

The idea behind it, from the paper Mikey shared (Gu, Kemeny, Yelin and Lukin, October 2026): a model proposes, and an independent evaluator checks the complete final state.

## 10. Where things live in the zip

- CLAUDE.md: the short manual every session loads (layout, commands, invariants, how to find a rule). docs/CLAUDE-HISTORY.md and docs/NEW-CHAT-HISTORY.md keep, word for word, the history those two files carried until pass MM, and docs/RULES-AUDIT-HISTORY.md every question section 11 had answered through pass MN, in full.
- docs/NEW-CHAT.md: start here; the state of the work, the open questions in full, the next step.
- docs/RULES-AUDIT.md: every standing rule, where it is written and what enforces it; section 11 holds every open question for Mikey in full and, since pass MN (Mikey's answer to Q52), one line for each answered one: its number, his answer word for word and where its rule now lives.
- docs/EARMARKS.md: every standard and program item still to build.
- docs/DECISIONS.md: one entry per pass, with Mikey's words, what each check found, and what changed for future passes.
- docs/INDEPENDENT-CHECKS.md: the briefs for every checker.
- docs/FABLE-REVIEW.md: the full writing and teaching standard. docs/CHARACTERS.md: the cast and its clock.
- docs/MISTAKE-CLASSES.md: the kinds of mistake the checks found in passes MA to ML, ranked, with what catches each now. docs/standards: the standards' published texts that the quote checks read.
- src/logic.mjs (content, generators, rules), src/ui.jsx (screens), src/stories.mjs (stories), src/curriculum.mjs (the standards plan); tests/ and tools/; ./check.sh runs every test but the full game layout audit (tests/e2e/game-layout.mjs), which runs on its own.

## 11. The plan, in Mikey's order

1. Review everything that exists at the refined standard, course by course from pre-K 3 up, through every layer of checks, earmarking every gap.
2. After each grade's review, build that grade's earmarks (pre-K 3's and pre-K 4's together, side by side by domain, after First Sounds and Letters; Mikey's answer to Q48). They are built a domain or two a pass, in TEA's order, and docs/EARMARKS.md's table of domains says which are done and which comes next.
3. New courses, stories, Wonder questions and games across all grades, at the full standard from the start.
4. Cross-check everything against the newest editions of every framework.
5. The illustrations, the ElevenLabs audio, the Texas page, licensing and the final checks.

docs/RULES-AUDIT.md section 10 has the plan in full. Where the work stands is in docs/NEW-CHAT.md (its newest pass) and the latest DECISIONS entry.
