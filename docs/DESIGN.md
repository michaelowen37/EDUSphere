# EduSphere — design and layout rules

Read with CLAUDE.md. These rules keep every screen consistent.

## Screens and their order
Welcome → Overview → Lesson → Practice → Result → (Wonder → Voices) → back to Overview.
Learner extras: My progress. Educator: PIN → Learners → Report.
A finished course (pass ME; every course since pass MF): Result → (the lesson's reward story) → Course finished → Home, the course's long story a gold book on the way; a reader reaches it with Celebrate! on the result.

## Overview layout
- Subjects are stacked vertically at identical width, in alphabetical order, so ten subjects look as tidy as two. Each row shows the subject, "n of m" and a thin gold progress bar. One subject opens at a time and its modules appear underneath. A course title only appears when a subject holds more than one course.
- Module row: "Module n", title, tagline, a status pill (Ready / Locked / Mastered), best score if practiced, one button (Open / Practice again). Locked rows explain why in one sentence.

## Educator report layout
- Order: back link, student name, plain-English summary paragraph, 'Assigned now' as a bulleted list, 'Recommended courses' with 'Show other courses' revealing 'Optional courses', one collapsible section per assigned course showing its modules, 'What these words mean', 'Raw data' behind a disclosure, then 'Reset all progress'. There is no grade picker: the progress sections mirror whatever is ticked above.
- A module row shows only its name and state. 'View progress for this module' opens an overlay telling the module's story in conversational sentences: reads, practices, each attempt, pace against their usual pace, what the platform will do next, and the confidence score. Raw figures sit in one small grey line at the bottom. Resetting a module always asks for confirmation first.
- A learner's result screen talks to them: 'Great job!' or 'Good try!' followed by a sentence naming what they mastered and what comes next. Never a score line.
- Students are picked from a list on the welcome screen and never typed. The roster screen is where an admin adds, renames, hides, restores and merges them.

## Overlays
- Reviewing one item out of a long list opens over the page with a close button in the top right, rather than expanding in place. Expanding in place is fine for a handful of rows and becomes endless scrolling once there are dozens.

## Pre-reader screens
- A lesson is one spoken line at a time from `lesson.script`, always showing a worked example before stating the rule. The picture animates in step with the audio. Controls are large round taps with drawn icons, centred, and the one that invites the next tap pulses.
- Status is a drawn symbol: gold star finished, green ring ready, padlock locked. No score lines, no explanatory sentences.
- A pre-reader result screen shows a row of stars for the score, one spoken line (said as the screen opens, and again by the speaker), a speaker button and a single large arrow. Well done goes forward to the next module; not yet goes round again through the lesson. There is never a menu of choices, but a small back arrow always lets a child leave. Since pass MD the first passed round of a lesson with a story shows an open book in the arrow's place, and the story's own page reads itself aloud with a round speaker, the snail and the hare, and one large arrow that rests while the voice reads and carries on where the round left off. Since pass ME the round that earns a read-aloud course's last star goes on to a course-finished page: confetti that falls and rests, a landing star, the course named aloud, the words on a plate of the card's color, a prominent gold book that reads the course's long story on the same kind of self-reading page, and a smaller arrow that skips. Since pass MF the page ends at home, and since pass MG on one wide Return home button across the bottom, words and no drawing (Mikey: "No home icon, just a home button across the bottom"), in place of pass MF's gold house; the voice names both taps ("Tap the gold book to hear it, or tap the green button at the bottom to go home."), the one sentence the page says and does not show, and the story the book opens ends on the same button, a reader's story page too. On a short screen a scroll cue points at the button, and a page with no long story yet says only "Tap the green button to go home.", since there the button sits mid-page. From grade 6 up the page's line is calmer, "Well done. You finished" and the course's name (pass MG, Q24).
- After a Wonder question a pre-reader hears its two short voices one card at a time and then, since pass MG (Q10), its closing line on one more card, the closing card a reader sees, spoken as it appears.
- The module a pre-reader should open carries a thicker border and a soft green glow, and its button pulses, so nobody has to read to find where to go.
- Letters swell one at a time as they are named. Dots drift in one at a time. Both are paced to the audio.
- A tracing lesson never shows a still letter or a count of dots. It shows the stroke drawing itself (`TraceDemo`, picture kind `trace`): the gray guide, the start dot and arrow exactly as on the practice pad, then green ink that draws each stroke in turn, rests, and draws again. Dot pictures show their numbered dots and join them. A gold pen dot rides the tip of the ink (SVG motion, no script). "Say it again" replays the drawing with the voice. After two misses on the same trace, the same demonstration appears above the practice pad with "Watch first. Then trace it." Under reduced motion the finished shape simply sits there and the pen is left out. The scripts test insists every touch lesson has one.
- A wrong answer offers Try again rather than Next, and the wrong choice greys out. Correct answers cheer, wrong ones wobble. All animation stops under reduced-motion settings.

## Words
- Writing style for anything a person reads: vary the sentence length so the rhythm feels natural. Five words, then eight, then four reads far better than three short sentences in a row. Explain in very simple terms, write complete sentences rather than fragments, and never use an em dash.
- Do not repeat the same noun many times on one screen. The roster screen is titled "My Classroom"; its buttons read "Add", "Rename", "Hide", and the empty state says "Nobody here yet."
- Say "practice", never "practice set". A course is named first with its grade and subject in brackets: Fractions (Grade 3 - Math), Counting (KG - Math). In a sentence, grades are spoken: "Kindergarten math", "third grade reading".
- Sentence case everywhere. Buttons say the action: "Practice this", "Check answer", "Next question", "See results".
- Learner screens: plain words, no percentages or statistics. Educator screens: numbers with definitions.
- A question is a gray setup line plus one bold sentence. Feedback is "Correct" or "Not quite. The answer is …" followed by the explanation.

## Page frame
- Every screen sits inside a bold pine-green frame (6px, square corners) that runs to the edge of the viewport — the app's outer edge, matching the logo's green.

## Color and type (values in `ui.jsx` under `C`)
- Background sage-white, cards white, text warm charcoal, primary pine green, mastery gold, needs-practice clay. One font family (system sans); hierarchy by size and weight only.
- Green = progress and correct; gold = mastered; clay = needs practice. Never red for a child's mistake.
- The fraction bar (parts shaded of a whole) is the one signature visual: lessons, questions, explanations, and progress all use it.
- Words on a gold fill take onGold, a dark ink in both themes, since white on the light theme's gold reads 3.24 to 1 (pass MF, Celebrate!). The drawings on the round taps (the gold arrow, book and practice star, and the green arrow) are graphics, which need 3 to 1: white reaches 3.24 on the light theme's gold and 7.5 on its green, but only 2.25 on the dark theme's gold and 2.06 on its green, so since pass MG (Mikey, Q23: "change") they take C.onAccent, white in the light theme and dark ink in the dark (7.93 and 8.67 to 1).
- With motion off, the dark theme's colorful strips (Let's Color, Let's Read, Let's Play) show the whole rainbow at once, still, since frozen mid-drift they showed only the gold end (pass MG). With motion off the dark theme also keeps the soft green ring, still, around what a young learner can tap (the breathing course groups, the shelf's books, the coloring and game tiles), whose resting frame has none, and hides the strips' sparkles, which would sit as still white dots. Moving or still, and at every width, the dark theme draws the Let's Wonder! title from its own mint to the gold, since the light theme's deep green read 2.66 to 1 on the dark page, and from 700 pixels it sets back the title's text clip, which a wide screen's backing behind loose words wiped (pass MG). The light theme keeps its look until Mikey answers Q27, except that a resting lesson coloring page now rests in both themes, as its sibling tiles always did.
- Planned: dark theme toggle (educator default dark, learner default light); Lexend or Atkinson Hyperlegible when a font can be bundled.

## Logo
- The mark is a sphere of short arcs with the wordmark inside it, so it works as a square tile (app icon, favicon, website header) as well as a header logo. Verified legible down to a 45px icon.
- Sphere: each arc is a real circle on a real sphere, projected from the front, so the curves agree with one another; only the front face is drawn. Density and weight increase toward the lower right (light from the upper left) and thin slightly toward the bottom. About one arc in eight is gold. Three short gold flecks fill the open space on the left. One gold arc sits under the wordmark, bowing upward — the opposite direction to the sweeps above it.
- Wordmark: EDU in pine green above Sphere in gold, same size, overlapping slightly, sitting just below center and left of center. Rounded edges come from stroking each letter with its own color; Sphere carries a background-colored halo so the overlap stays clean.
- Letters are stored as outlines (`WORDMARK_GLYPHS` in `logic.mjs`), not as a font name, so the logo renders identically on every device. The current outlines are a geometric bold face standing in for a licensed brand font — before production, replace them with an open-licensed rounded face (Nunito, Quicksand, or Baloo). Replacing the outlines is a contained change; nothing else moves.
- Geometry lives in `logic.mjs`: `layoutWord`, `buildSphereArcs`, `buildSphereFlecks`, `buildAccentArc`. `Logo` in `ui.jsx` draws it; `docs/logo.svg` is an exported standalone copy. Change the numbers there, never by hand-editing paths, and re-export `docs/logo.svg` when the mark changes.

## Touch and reading
- Buttons at least 46px tall; picture and letter choices large and centered; no links on learner screens; nothing typed in read-aloud courses.
- No animation that is required to understand a screen; respect reduced-motion settings.

## Session start prompt (paste at the start of every session)
Read CLAUDE.md first. All changes must follow CLAUDE.md, docs/DECISIONS.md, docs/DESIGN.md, and the matching skill in .claude/skills/. For anything bigger than a one-sentence change, list the files and rules it touches before editing. Finish with ./check.sh and paste its last line. Do not change existing lines of CLAUDE.md without my approval; adding is fine.

## Writing style

Standard American spelling throughout (color, favorite, center, recognize, gray, math, practice, canceled). Contractions are welcome. A test enforces the spelling and a few style rules on every user-facing string.

## Teaching text (the rule from 2026-09-13)

Every lesson, key idea, explanation and result line is written to be read by a student who is
meeting the idea for the first time, and is rendered through one small markup:

- A newline starts a new line. One idea per line. Extra scrolling is fine.
- `**bold**` marks the thing the eye should land on: the variable, the number being moved, the module name.
- A line wrapped in `[[ ]]` is centered, bold, and given air above and below. Every equation and every
  key phrase goes on such a line, never inside a sentence.
- Explanations walk the steps one per line: "First, you ... to get: **result**", "Then, you ...".
- Lessons repeat themselves on purpose, the way a patient tutor does, and end with the shape of the answer
  (`[[x = answer]]`, `[[Claim = The Point]]`). Write it the way Malcolm Gladwell would explain it to a
  younger student: a concrete case first, the rule after, and the same idea said twice in two ways.
- On a question screen the question comes first, then the statement it is about, both centered, and every
  choice is centered in its button.
- A wrong answer is followed by one sentence about the answer the student chose, when the choices are named
  kinds (appeals, flaws, ironies).

Model lessons in this style: multi-step equations, rhetorical appeals, claims and reasons, the main idea.
Older lessons are being brought up to this standard as they are touched; any lesson edited from now on
must be written this way.
