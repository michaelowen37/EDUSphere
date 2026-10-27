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
- More Info (pass MH, Mikey: "a discrete link that says "More Info""): after an answer a quiet text button opens a sheet over the page (one Overlay); it opens a sheet inside the app, so it is not a link in the sense of the Touch and reading line below, which keeps out addresses that leave the app (the alignment read). For a reader it sits under the explanation, and for a pre-reader under the next button, since it is for the grown-up beside the child, with a ScrollCue pointing at the next button while a short phone hides any of it; a pre-reader's retry and next question open at the top of the question. The sheet: the question's own picture at the top, so a reason that says "this one" points at something; Why not the others?, why each wrong choice does not fit, the one just tapped first, with "which you just chose", "which you chose once before too" or "which you have chosen a few times now", and "which you chose once before" or "which you have chosen before" for a choice tapped only on earlier visits; Why this one fits; then More right answers. It opens by itself after a reader's wrong answer. A choice that is a word longer than three letters is named by its sentence alone, decided once for the whole sheet; its top can always be scrolled to on a phone; Got it takes the focus without scrolling, Escape closes it, and every sheet has a Read it to me speaker, so a pre-reader can hear it.

## Pre-reader screens
- A lesson is one spoken line at a time from `lesson.script`, always showing a worked example before stating the rule. The picture animates in step with the audio. Controls are large round taps with drawn icons, centred, and the one that invites the next tap pulses.
- Status is a drawn symbol: gold star finished, green ring ready, padlock locked. No score lines, no explanatory sentences.
- A pre-reader result screen shows a row of stars for the score, one spoken line (said as the screen opens, and again by the speaker), a speaker button and a single large arrow. Well done goes forward to the next module; not yet goes round again through the lesson. There is never a menu of choices, but a small back arrow always lets a child leave. Since pass MD the first passed round of a lesson with a story shows an open book in the arrow's place, and the story's own page reads itself aloud with a round speaker, the snail and the hare, and one large arrow that rests while the voice reads and carries on where the round left off. Since pass ME the round that earns a read-aloud course's last star goes on to a course-finished page: confetti that falls and rests, a landing star, the course named aloud, the words on a plate of the card's color, a prominent gold book that reads the course's long story on the same kind of self-reading page, and a smaller arrow that skips. Since pass MF the page ends at home, and since pass MG on one wide Return home button across the bottom, words and no drawing (Mikey: "No home icon, just a home button across the bottom"), in place of pass MF's gold house; the voice names both taps ("Tap the gold book to hear it, or tap the green button at the bottom to go home."), the one sentence the page says and does not show, and the story the book opens ends on the same button, a reader's story page too. On a short screen a scroll cue points at the button, and a page with no long story yet says only "Tap the green button to go home.", since there the button sits mid-page. From grade 6 up the page's line is calmer, "Well done. You finished" and the course's name (pass MG, Q24).
- After a Wonder question a pre-reader hears its two short voices one card at a time and then, since pass MG (Q10), its closing line on one more card, the closing card a reader sees, spoken as it appears.
- Since pass MH (Mikey: "We can also use all four voices, even for the early learners.") a pre-reader hears all four short voices, Frederick, Chloe, Georgette and Mike, one card at a time, then the closing card. Each voice card shows the person's name at the top, the label under it, the portrait under both and the words below (Mikey's layout), with the question small, muted and italic above the card ("It can be discrete."). The closing card wears a title that changes from one question to the next (Let's Ponder!, Let's Reflect!, A Question for You and thirteen more).
- A wrong tap tells a pre-reader why that choice does not fit, then "Have another try." (pass MH), unless the reason would answer the retry while two or more choices are still open, by naming the answer or, since pass MJ, another wrong picture still open, or, since pass MK, while a twin of the tapped picture is open; then the old "Not that one. Have another try." Since pass MM a reason is read as the voice says it (a held sound with its carrier word, a word said slowly run into its own letters), and a letter the screen does not print counts as named, since the line after a wrong tap is printed for the grown-up. Since pass MO no word is added to a held sound, which the app plays itself between the voice's words, so a line is heard as its own words.
- A pre-reader's letter question prints "the letter you hear" while the voice can say the letter, and a heard rhyme prints neither of its words, since a printed capital or spelling is a shape a child can match; with no voice the whole question prints, for a grown-up to read (printedQuestion, pass MM).
- The module a pre-reader should open carries a thicker border and a soft green glow, and its button pulses, so nobody has to read to find where to go.
- Letters swell one at a time as they are named. Dots drift in one at a time. Both are paced to the audio.
- A tracing lesson never shows a still letter or a count of dots. It shows the stroke drawing itself (`TraceDemo`, picture kind `trace`): the gray guide, the start dot and arrow exactly as on the practice pad, then green ink that draws each stroke in turn, rests, and draws again. Dot pictures show their numbered dots and join them. A gold pen dot rides the tip of the ink (SVG motion, no script). "Say it again" replays the drawing with the voice. After two misses on the same trace, the same demonstration appears above the practice pad with "Watch first. Then trace it." Under reduced motion the finished shape simply sits there and the pen is left out. The scripts test insists every touch lesson has one.
- A wrong answer offers Try again rather than Next, and the wrong choice greys out; a pre-reader's answer turns green only when the child taps it (pass MM), so the retry stays the child's own. Correct answers cheer, wrong ones wobble. All animation stops under reduced-motion settings.

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
- With motion off, the dark theme's colorful strips (Let's Color, Let's Read, Let's Play) show the whole rainbow at once, still, since frozen mid-drift they showed only the gold end (pass MG). With motion off the dark theme also keeps the soft green ring, still, around what a young learner can tap (the breathing course groups, the shelf's books, the coloring and game tiles), whose resting frame has none, and hides the strips' sparkles, which would sit as still white dots. Moving or still, and at every width, the dark theme draws the Let's Wonder! title from its own mint to the gold, since the light theme's deep green read 2.66 to 1 on the dark page, and from 700 pixels it sets back the title's text clip, which a wide screen's backing behind loose words wiped (pass MG). The light theme kept its look until Mikey answered Q27 (pass MH: it matches the dark theme in all five), except that a resting lesson coloring page now rests in both themes, as its sibling tiles always did.
- The paper under every drawing in the dark theme (questions, the result's pictures, lessons, games, coloring) is a very light green, #D9E6DC, since white and then almond were harsh against the dark page (pass MH, Mikey: "maybe a very light green to match the theme ... Keep this concept in mind across all features in the app."); a single picture sits on paper sized to it, not a strip as wide as the card.
- The read-along's light (pass MH): the sentence being read, hugging its words, the space after it outside the light; in the dark theme the light green #AAD8C5 under the ink #16201B, and since Mikey's answer to Q32 (pass MI) the same light green in the light theme.
- Since pass MH the light theme matches the dark with motion off (Q27: the whole rainbow with a lighter purple under the strips' words, the ring kept still, the sparkles hidden, the Let's Wonder! title from green to the deeper gold #A67A26 and shown from 700 pixels), and its speaker drawing takes #A67A26 (Q29), both at Mikey's word.
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
- Pictures on a tablet or laptop (pass MH): the question's own picture and the lesson pictures grow 1.45 times from 700 pixels wide (when the screen is at least 600 tall) and 1.12 times on a tall phone, while the answer buttons and their pictures keep their size; a row of shapes stays together on one line; a drawing that shows sizes keeps them in order; Check answer never drops below the fold on a short phone.
- A story read aloud (pass MH): the snail and the rabbit sit in the story card to the right of the title, which stays truly centered, beside a speaker of their size; a tap changes the pace without stopping the reading; the page follows the voice until the reader scrolls (Space on the snail or the hare presses it and is not a scroll), and not again until the voice reaches a paragraph on the screen; Read the whole book to me waits for the reader the same way. On a phone narrower than 640 pixels (pass MO, Mikey: "On narrow phone screens, we can move the snail and hair on both sides of the gold sound icon on top to create symmetry.  Keep the same on wider screens") the snail, the gold speaker and the hare sit in one row centred above the title, the speaker in the middle; from 640 pixels the row is as it was.
- The pondering pictures (pass MH, Mikey's notes and pictures): six line drawings in the card's own ink, no fill, inside the Let's Wonder question card and the closing card, two or three in a band above the words and the rest below, never beside them, at uneven places, sizes and angles, each falling or rising in once and then still (still from the start with motion off), so the words keep the card's whole width.

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
- Since pass MH the statement (the setup line) comes first and the question under it, the order the voice reads them and
  Quick fire shows them (CLAUDE.md, Setup lines, again). Mikey kept it there (Q30, pass MI); the line above is the order before
  pass MH. Pre-K 3's situation questions are one sentence now, and the rest will be merged where that reads better, as each grade is reviewed (EARMARKS L11).
- A wrong answer is followed by one sentence about the answer the student chose, when the choices are named
  kinds (appeals, flaws, ironies).

Model lessons in this style: multi-step equations, rhetorical appeals, claims and reasons, the main idea.
Older lessons are being brought up to this standard as they are touched; any lesson edited from now on
must be written this way.

## Pass MI (Mikey's notes)

- More Info read aloud: the sentence being read is lit in the light green, as a story's is; a pause between explanations (0.7 seconds, 1 second for an early learner) and, for an early learner, a voice a little slower (0.85).
- The lit sentence is the light green (#AAD8C5, words #16201B) in both themes since Q32.
- A lesson that needs a touch screen, tapped on a laptop, says so in a pop-up that names it, on the overview, with Got it.
- Quiet words on a game's paper in the dark theme take paperMuted, a deep green gray (#3A4A40), never the light palette's olive gray.
- The space shooter's board shows the hits, then a small ship for each of the three left, the wave in the middle and the rule on the right; its end card names the hits, the wave reached and the best ("A new best!" when this game set it), and its tile shows the best as hits.

## Pass MO (Mikey's notes)

- The story head on a narrow phone: the snail, the gold speaker and the hare in one row centred above the title, the speaker in the middle (Touch and reading, above).
- The rabbit and the candle (Q54, "your call as long as it looks visually appealing and sleek."): the rabbit wears its soft brown outline (#8C7A5B, a shade deeper since round one's screen check, #857356, so it reads 3 to 1 on every name picture's tint) in both themes, with soft pink inner ears drawn behind its head, and the candle's body a slate outline (#76828B), wherever they are drawn, so neither fades into white paper.
- A lesson's sounds are the app's own: the voice says the words, and the held sounds and crisp stops play between them; nothing on the screen changes.
- Follow the directions (a pre-reader's new way to answer): the pictures sit in a grid that fits a phone, two columns for four and three for three or six; each tap puts its number on the picture where it is, in a gold badge with dark ink (C.onGold), so the order shows without words; a numbered picture tapped again takes back its number and every one after it; Check answer waits for every step; a wrong order turns every tapped picture clay alike and says the direction again, and only the right order turns them green.
- The chair is drawn from the front, a slatted back over a seat and four legs, since the side view read as a capital H (round one's picture check).
- Since round three: after two wrong orders a direction's next picture wears the app's green "go here" ring (edu-breathe) and a green edge until it is tapped; the chair's back legs are a lighter brown (#A26B32), like its front legs; Two ideas' four corners keep a phone's width on a laptop.
- Since round two: a lesson line's gold numbers sit in tiles like practice's, on the line before's own pictures; Two ideas' four corners sit two by two, a phone's width; and More Info's paper boxes draw shapes in the paper's green in the dark theme.
- Since round one's screen check: the gold badge sits on the picture's top left corner, half off its tile, never over the drawing; on a laptop the directions grid keeps a phone's size, centred; a lesson line that teaches the numbers shows them on its pictures with the same badge; a tower is three of the block icon's blocks stacked; and a picture answer tells a screen reader its name.

## Pass MP (Mikey's notes)

- A game's welcome: the board plays itself under a pointer, a hand on a touch screen and an arrow with a mouse, while each line is said, and the line shows as a quiet caption under the board, as tall as the welcome's longest line, three lines at least, so nothing below it moves. Skip is a small pill under the caption, and when its row is out of the window (a short screen) a copy floats at the window's foot in a bar on the surface's color with the line being said beside it, as tall as the welcome's longest line there too, while the caption keeps its place, clear, so a floating Skip never sits on the words (round three's second read); the pointer never rests under the bar. Once the welcome has gone, Begin is brought back into what shows, and after Begin the board's top, read once the page has stopped moving (a scroll the welcome started stops as it ends) and, when the Instructions pop-up is open, once it closes; the browser does not move the page while Begin gives way to the board (scroll anchoring off until the board has been read). A key the welcome presses is drawn at the board's top corner, a white key with a dark edge, pressed down as the board takes it.
- Begin ends every welcome, on the board's own paper and at the board's size, so the page does not jump. It pulses like every button that invites the next tap, and for a young learner sends out the soft ring every two seconds, in the paper's deep green (#2F5D4F): as shown, at the ripple's strongest, 3.8 to 1 on white and 3.3 on the dark theme's paper, and 4.2 and 3.6 still with less motion asked for, where the app's bright ring would read 2.0 and 1.7. A game that moves says so under it.
- With less motion asked for, a wrong move's wobble gives way to a still sign for the same moment: a red-brown dashed edge (B.clay, 3 px, 2 px out) on a button or a card, on Spot It's picture a dashed ring like its green one for a found piece, and on Teach the Robot's a solid ring, since its dashed rings are the robot's guesses; the path's squares, the letters, the dots and the map show their clay edge or fill either way. A welcome or help line names the sign a board shows either way when it has one (a wrong step "gets a red-brown edge"); a line that says "wobbles" names what most devices show, and the still edge stands in where motion is off (round three's second read).
- The speaker under every game reads the instructions again. A borderless speaker sits beside a spoken question (Which Sense, Spot It, Share the Cookies, Grow the Plant and Find the Tool, and Find the Letter's own speaker drawn the same); a device with no voice shows none. Numbers 1 to 5 under the answers of a game a number key answers show only with a keyboard, in the paper's muted ink.
- A finished game's gold star fades after a moment, and the Begin line keeps its own paper, so neither covers words.
- Yellow shapes and color squares wear a thin darker edge, and the lessons' green a deeper green edge on the dark theme's paper (Q56). A direction's picture tapped out of turn wobbles with a clay edge (Q58).
- The owl has ear tufts, the plate is a plate seen from above with a rim and a blue band, and the red block is the block for play.
- A story read aloud breathes: after its title, between paragraphs and, on the snail, between sentences; the snail reads at 0.65 of the hare's pace.
