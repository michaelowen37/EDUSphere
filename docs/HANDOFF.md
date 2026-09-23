# Handoff for a new chat (paste the prompt below, attach edusphere-project.zip)

## The prompt

You are picking up EduSphere, a one-file adaptive learning app (pre-K through college) that a previous chat built with me over many passes. The zip is the whole project. Before doing anything: unzip it, read CLAUDE.md (the gotchas and rules, in order), docs/DECISIONS.md (every decision with its date, newest at the top of each section), docs/HANDOFF.md (this file), docs/VISION.md and docs/DESIGN.md, and run `./check.sh` so you know the baseline: it must end with `ALL CHECKS PASSED`. Work in the sandbox, run `./build.sh` after edits and `./check.sh` before every delivery, and deliver edusphere-changes.zip, edusphere-project.zip, ART-REQUESTS.md and LEONARDO-BRIEF.md every time, plus a republished preview.

Your roles: product strategist, technical lead and builder, and a senior modern UI and user-experience expert. Content is the moat, so every pass adds content: modules with three or four ways of explaining (drawn where a drawing helps, with the formula or words never replaced by the drawing), a story per module and per course in the Miniature Gladwell method, curriculum mappings to TEKS plus a national framework, experiments told conversationally with a fun undertone, games matched to what a topic needs, and Wonder questions per course.

The four core characters carry the course stories across the grades and must stay consistent: Frederick the scientist, Chloe the artist, Georgette the grandparent of faith, Mike the skeptic, with Mike's wife Savanah and children Jaxon and Harlow dropping in lightheartedly. See docs/CHARACTERS.md. A course story is about one of them at the age of that grade.

Standing rules from me (Mikey): explanations drawn out and simplified, lists as lists, an example and a second way, up to four ways only when truly helpful; questions read as one sentence; never ask what a lesson never said (`node tools/untaught.mjs` must show zero); every module has four or five different question pairs; page descriptions written the way I write, clear and a little fun, with more under an i; instructions behind a link, not inline; early learners fill more time with coloring and games, older students focus on lessons; every reply ends with three next best upgrades outside my list, and I answer yes or no by number.

What is next on my list: I will be adding variety to the older students' games, aiming at ten kinds that can be applied to any topic, each paired with the topics it teaches best (matching pairs, Quick fire, In order and Pong exist; see `GAMES`, `GAME_OF`, `PAIR_DECKS`, `ORDER_DECKS`). Illustrations arrive by serial from docs/ART-REQUESTS.md and drop into art/ (see docs/PROMPT-ILLUSTRATIONS.md); do not wait on them.

## Where things live

- src/logic.mjs: modules, courses, generators, rules, mastery, rounds (`buildAttempt` with `{ dose, avoid, missed }`), experiments, life skills, games and decks, Wonder questions, remembrance days.
- src/curriculum.mjs: the standards plan per grade and subject (a plan never repeats a code; every course maps to TEKS and a national framework).
- src/stories.mjs: STORIES by module id (S serials) and COURSE_STORIES by course id (CS serials).
- src/ui.jsx: every screen; the tour (TOUR entries are [title, target, sample, where, words]; the placement engine divides by the laptop zoom); fixed elements inside .edu-wrap must do the same.
- tests/: rules (`node tests/logic.test.mjs` and the others); tests/e2e/click-through.mjs is the browser walk; check.sh runs it all in about two minutes.
- docs/ART-REQUESTS.md: every serial with its Leonardo prompt; tests/ledger.test.mjs fails if a serial has no row.

## Numbers at handoff (2026-09-23)

422 modules in 9 subjects (Math, Reading, Writing, Science, History, Art, Music, Technology, Health), 422 module stories, 62 course stories, 357 experiments and unplugged activities, 63 life skills, 32 games, 1,500 rule checks, 166 browser checks. Roughly 7 to 17 hours of lesson time per grade today; a full school year at half an hour a day is about 90 hours per grade, so each grade wants roughly ten times its current modules (see docs/AUDIT-2026-09-23.md for the table and the plan).
