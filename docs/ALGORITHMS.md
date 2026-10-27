# The algorithms, in plain terms

Everything numerical the product does, explained so that a person, or a model, can
check it against the code in `src/logic.mjs`. Where a number is a choice rather than a
law, it says so.

## The record

The only stored truth is a list of events per student: `lesson_viewed`,
`attempt_completed`, `wonder_answered`, `courses_enabled`, `progress_reset`,
`module_reset`, `looped_back`. Events are only ever appended. Every number on every
screen is recomputed from this list each time. A reset is an event too: derivations
ignore what came before the latest reset, but nothing is deleted.

## Questions

Each module names a list of generators. A generator takes a seeded random source and
returns one question: a prompt, the choices, the answer, and an explanation, all
computed by arithmetic. The seed comes from the time the round started, so two
students, or the same student twice, get different numbers. The test suite runs every
generator through 300 seeds and re-derives the answer independently from the question's
own words, so a generator whose answer is ever wrong cannot ship.

A round is `questions` core questions (default 5, settable per module) plus, once
anything earlier is mastered, one memory-check question from an earlier module.

## Mastery

A round counts as mastered when `coreCorrect >= toMaster` (default 4 of 5, settable
per module). Mastery is per round, never accumulated across rounds. For pre-reader
courses, a student retries a wrong answer until right, and `correct` records whether
they were right first time, so retrying does not inflate mastery.

## What is open

A module is open when every gating prerequisite is mastered. Prerequisites are the
module before it in its course plus anything in its `requires` list, which may cross
courses and grades. A prerequisite from another course gates only when that course is
assigned to the student; placement above it is the educator's call. Loop-back still
uses the full list. The graph is checked for missing links and loops; a loop would lock a
student out forever.

## Loop-back

After `LOOP_BACK_AFTER` (2) failed rounds in a row on a module, the nearest
prerequisite is reopened for a check and the student is offered it as the one thing to
do. A `looped_back` event records it. Re-passing the prerequisite clears the routing.
The number 2 is a judgement: one miss is normal, three is too long to wait.

## Confidence, 1 to 5

Starts at 1 once a module has been practiced. Mastered adds 2. Latest round perfect
adds 1. Either eight correct answers in a row, or at least 80 percent on two or more
memory checks, adds 1. Capped at 5. Two or more wrong answers under four seconds add a
"guessing?" note. All four numbers are judgements chosen to be easy to explain.

## Timing

Every answer records milliseconds from the question appearing to the answer being
checked. The report compares the median of the latest round against the student's
median everywhere else. A latest round under 60 percent of their usual pace is called
out, and combined with quick wrong answers is read as guessing.

## Memory checks and spaced repetition

Once a module is mastered, its questions reappear as the extra question in later
rounds of the same course. They never affect the gate. Their results feed the
confidence score and the transcript. The spacing is currently "whenever a later round
happens"; a true interval schedule (days, then weeks) is the next step and belongs
here when built.

## Reflections

A reflection is offered after every `WONDER_EVERY` (2) finished rounds, pass or fail,
since the last one was answered. Each question carries a theme (world, failure,
feelings, ups-and-downs); the theme met longest ago comes first, and after a failed
round the failure, feelings and ups-and-downs questions jump the queue. The pool is every approved question written for this course or for
this course's stage (early, growing, teen, grown), so courses share a pool. The one
answered longest ago comes first, and never-answered ones come before those, so the
questions rotate rather than repeat. Pre-readers only ever draw questions that carry a
short spoken two-voice version. No question is offered more than `WONDER_MAX_REPEATS`
(2) times to one student; when every question in the pool has reached that, the
reflection is skipped. A pre-reader's round that finishes a course goes to the course-finished page, which ends at home
(pass MF), so a reflection due after that round waits for the next finished round; it stays due (Mikey kept it in
pass MG, Q25: "keep it"). A pre-reader hears the question and its choices, taps one, and then hears its two short
voices and, since pass MG (Q10), its closing line, one card each (wonderPreReaderCards).
Since pass MH every early question carries four short voices, so a pre-reader hears all four, Frederick, Chloe,
Georgette and Mike, and then the closing line, one card each; the closing card's title is PONDER_TITLES[n], picked by
ponderTitle from the question and the number of Wonder questions the child has answered, so one visit always shows the
same title and the next question another.

## More Info: why a wrong choice does not fit (pass MH)

A choice question may carry whyNot, for each wrong choice its name and why it does not fit, and alsoRight, more right
examples. choiceInsight(q, picked, before) puts the choice just tapped first and the others after it; whyNotClause names
the tap: "which you just chose" for this tap, "which you chose once before too" when it was also tapped on one earlier
visit to this very question, and "which you have chosen a few times now" after two or more; a choice tapped only on earlier
visits is "which you chose once before", or "which you have chosen before" after two or more. choiceHistory(events, q) finds those earlier taps in the active log only, skips any round at or before
the lesson's own latest reset, and counts an earlier round only when the question made again from its seed has this
question's questionKey, so the same words over another setup are another question. A pre-reader's wrong taps before the
right one are kept with the result as missed (missedPicks: only choices the question offered, each once, never a tracing
or anything typed). After a wrong tap a pre-reader hears the reason and "Have another try." (preReaderWrongWords), unless
two or more choices are still open and the reason names something of the answer the question has not said itself
(whyNotNamesAnswer: the answer's words, numbers as words, sizes and their kin both ways, plurals, a letter by its
capital); then "Not that one. Have another try.", since a voice never answers a retry for the child. Since pass MJ it is also
held back while it names another wrong picture still open that the question did not name (whyNotNamesOpenWrong: "Block
rhymes with rock" leaves only the answer), and since pass MK while a twin of the tapped picture (the same picture twice, or the same shape in another look) is
still open, since any reason the tapped one gets rules out its twin; the reason waits in More Info.

## Two celebrations a course (pass MH)

courseCompletedBy(progress, course, event) is true for the round whose pass first completes a course, every lesson
passed once: a round that passes a lesson never passed before when every other lesson has been, or a Quick Review's clear
fresh try on a lesson moved past and never passed. A lesson placed by a quick check, or starred by a review, completes
nothing, since placing is not doing every lesson; a course completed that way opens its long story on the shelf without a
party. courseFinishedBy is the round that earns the last star, as before. courseCelebrationStage names the stage a round
earned, complete or mastered (mastered when both happen at once), and celebrationStory picks the story: the course's long
story for the first, its next long story (MASTERY_STORIES) for the second, or the first again while it has none.

## Placement (designed, not yet built)

An educator supplies a starting level. The check begins there, steps up on success and
down on struggle, runs per subject, never asks about prerequisites already implied by a
pass higher up, stops after about a dozen questions, places one notch conservatively,
and its recommendations are applied immediately so a new student never faces a blank
screen. It is skippable.

## The class view

Each student's need score: 3 per module they are stuck on (two or more misses in a row
with no pass since), 2 per loop back, 2 per module with a guessing flag, 1 per
mastered module whose confidence is 2 or less, 2 if assigned work has never been
started, and 1 plus one per week idle (capped at 3 extra) after seven days without
practice. Five or more is "needs help now", two to four is "keep an eye on". The
weights are judgements, chosen so a stuck student always outranks an idle one.

## Tracing

A letter is a list of strokes (its lines), each a list of points on a 100 by 100 grid. A
drawing matches when every sampled point along every stroke has a drawn point within 14
grid units, and at least 70 percent of the drawn points lie within 20 units of the
letter. The first rule forgives wobble but not a wrong shape; the second rejects a
scribble that happens to cover everything. A numbered dot picture must also be joined in
order: dot 1 reached before dot 2, and so on.

One line at a time (pass MN, Mikey's answer to Q49, Claude's (d)). The pad shows one
line's starting dot and arrow at a time, in the order the lesson's demo draws them, and
the next line's dot and arrow appear once a line is traced (traceLineState). Each point
of ink belongs to the line it is tracing: a finger touching down goes with the line whose
dot is nearest, and it stays with that line through a wobble where two lines meet,
handing over only when another line has been nearer by more than 4 units for 3 points in
a row. Without that, small a's circle would cover its short stem, which lies within 14
units of it, and the pad would never show the stem's dot. In pre-K the order is guided
and nothing fails. From kindergarten up, a line traced only from its end back to its
start does not count: the pad clears it the moment the finger lifts and the voice says
"Start at the green dot and follow the arrow." (a closed line traced the other way starts
at its dot, so the words name the arrow too). traceMatches holds the same rule for a lift
the pad never heard. The order of the lines is never failed, at any grade.

How a line's direction is read (traceDirections). The finger's places along a line,
smoothed over five points (fewer at a run's two ends), are split into pieces wherever the
finger turns back more than 10 units along it; less is a wobble. A place that leaps more
than 12 units along the line beyond the finger's own step starts a new piece, and when the
finger goes over to another line, the points at the end of its run that were already
nearer the new line go with it. A line counts as traced one way once the pieces that run
that way in one stroke of the finger cover half of its judged length together (since
round two's code check: a sway at a sharp corner cut a forward line into pieces, none of
which reached half alone), a closed line's stretches counted once a lap (since round
four's code read: O traced the other way a third of the way, off the line and back over
the same stretch, had counted twice and read as over half). A finger that touches down on
a dot two lines share is taken to the line it moves along next: its first point more than
4 units from the dot, past any rest or one-unit wobble there (rounds four and five: a
resting finger repeats its first point, and the pad keeps whole units). A stretch of a line within 4 units of another line is not judged, since
either line could be meant there, and a line with less than 12 judged units (the dot of
i) is never judged. A piece that turns straight back along the line the finger just went
forward on is a retrace, the way n, m and h go back up their stem to start a hump, never a
line traced from its end. A line is cleared only when it was traced backward and never
forward. These numbers were tried on every shape with traces drawn forward, reversed, in
one stroke of the finger, with handwriting's retraces, overshooting a dot, colored back
and forth and wobbling up to 5 units, and no forward trace was ever cleared; since round
one's code check also at a finger's paces (3 units a point is an ordinary pace, 12 or more
a flick). At one pace the first version cleared a closed shape traced there and back,
passed a line traced quickly from its end, and stuck the pad's next dot on eleven shapes;
the rules test holds all three at four paces each: forward traces with every point
jittered, line by line and there and back, at 1.5, 3, 5 and 8 units a point; every judged
line traced from its end at 1.5, 3, 5 and 13; and the next dot at 1.5, 3, 4 and 8. Jitter
point by point never cuts a corner, so since round two's code check the rules test also
traces the curve the pad draws (strokeSegments, in logic) with a smooth sway, as a child's
finger moves: five units at 1.5, 3, 5, 8, 12 and 16 units a point, four with every point
jittered at 8, 12 and 16, and the next dot with a three-unit sway at 8, 12 and 16. A few
lines traced from their end with a three- to four-unit wobble still pass (q's and a's
short stems, z, A), since telling them from a wobble would fail forward traces.

Rounds (pass MN, Mikey's answer to Q50, Claude's (b)). A round traces every letter, mark
or shape its lesson teaches before any comes again, where before each trace picked its
letter at random, and a longer round traces them once a set (a triple dose of three
letters, three sets). A Quick Review of a lesson that mixes traces and choices keeps a
round's share, three traces and two choices. Each of First Sounds and Letters' three tracing rounds is three traces,
one of each of its lesson's letters, and two choice questions among the same three: the
letter the voice says, and the letter found by its lines ("Which letter goes down, then
across the bottom?"). The two ask about two different letters while they can, in a round
and in its Quick Review, so the second is never answered by the first (round one's screen
check: 212 of its 600 rounds, and 177 of the rules test's 600, asked one letter twice);
every other lesson draws as before. A new set of traces never opens with the letter just
traced, so one letter never comes twice in a row while another can, in a round, a triple
dose or a Quick Review, which traces in sets the same way (round two's code check: "i k t
t i" in a round; round four's alignment read: "k i t t k" in a Quick Review); and, as in a
round, a Quick Review's trace bank with nothing new hands its turn to the lesson's other
trace banks (round five's code read: "r m k z r").

## Backups

A backup is the roster, every record, and the educator's settings, in one JSON file
with a version number. Restore merges: students by ID, events joined without
duplicates, settings unioned. Restore can only ever add. A fixture file from each
format version is kept in `tests/fixtures` and must restore forever.

## Memory checks (updated 2026-09-13)

The review question in a round is drawn from any module the student has mastered, in any
course. Six times in ten it comes from an earlier module in the same course; otherwise
from anywhere mastered. It never affects mastery of the current module. Mastery v2 (see
DECISIONS.md) will raise this to two checks per round and add a cumulative checkpoint
round after every fourth module.

## Checkpoints (2026-09-14)

After every fourth passed module (checkpointDue), buildCheckpoint draws eight questions from
passed modules (cycling through them, never repeating a question). makeCheckpointEvent records
per-module results. refresherIds returns modules missed in the latest checkpoint and not passed
since; computeConfidence counts checkpoint misses with memory-check misses, and a return that
is half missed or worse costs one point. A checkpoint never changes a pass or a star.

## The Quick Review and Move Forward (passes LF to LR; called the light review, then the quick look back, before pass LP)

The fourth exposure. A lesson is met in the lesson, in the practice that masters it, in memory checks inside later rounds (labeled "A question from an earlier module" since pass LQ, so they are not mistaken for this), and in the Quick Review weeks later, which decides whether the lesson is worth teaching again. Every rule here is held by tests; the full rules and the exact words on screen are in docs/RULES-AUDIT.md sections 7a and 7b, and tests/docs-sync.test.mjs fails if either doc stops matching the code.

**Schedule** (`lightReviewState(events, moduleId)` gives each lesson a stage and a due time):
- first: 21 calendar days after the lesson's star (LIGHT_REVIEW_FIRST_DAYS). Calendar days, not days logged in (Mikey, pass LK), because forgetting runs on the calendar.
- done: after a review passed clearly (four or five of five); no more reviews.
- retry: after a review nearly passed (three of five), another review 7 days later (LIGHT_REVIEW_RETRY_DAYS), opening with the kinds of question missed.
- reopened: after a review missed (two or fewer); nothing is due until the lesson is passed again, which earns a new star and restarts the schedule.
- moved: after Move Forward on a lesson stuck after its review; closed, with the star, the gate and the memory checks standing.
- fresh: a lesson moved past before it was mastered comes back 21 calendar days after the move; a clear pass earns the star (deriveProgress), a near pass retries 7 days later, a miss tries again 21 days later.

**The queue** (`lightReviewQueue`, `lightReviewDay`, `lightReviewDue`): every review that has come due waits, oldest first, counted as due from the start of its day, for lessons the student can see. At most two a day (LIGHT_REVIEWS_PER_DAY = 2): whenever two are due both are offered at the start of the day and taken back to back; a third waits for the next day. A day the student does not open the app costs nothing.

**The student's day.** When a review is due the overview opens on the start-of-day card, "First, A Quick Review" (or "One More Quick Review" for the second of two after a break), naming the module or both modules, with the speaker icon for an early learner and an x to exit; the lessons appear when the reviews are done. A review is five questions from the lesson's own bank with no repeats, headed "Quick Review" over "Question 1 of 5". The result never says fail.

**Stuck, two kinds, one ladder** (`lightReviewStuck` after a missed review, `neverMasteredStuck` for a lesson never mastered): counted from the missed review or from the last pass on the lesson, two misses (the app then loops back to the lesson before it), then two more misses with no pass in between. A lesson with nothing before it to loop back to is stuck after four misses. Until then the app works alone and the educator is not asked.

**Move Forward** (from the Action Item popup; `actionStuckItems` lists both kinds, one item at a time, stuck lessons before papers): one `moved_forward` event, nothing rewritten. After a review: the review closes; the star, the gate and the memory checks stand. Before mastery: no star (`perModule.movedPast`); the gate counts the lesson, so the lessons after it open (`moduleStatuses`; the gate also follows course order); the lesson stays on the student's list, open to practice, and returns as a fresh try. There is no switch to turn reviews off (Mikey, pass LF).

**What the educator reads** (Mikey's style: explanatory, varied sentence lengths, no jargon; titles in title case): `lightReviewHistory` lists every review, every Move Forward and every lesson stuck now, each with its date, newest first; the report shows the newest two, with a History link for the rest, and the section stays once it appears. `weeklyNote` adds the entries dated within the note's own seven days, and only those, as plain paragraphs under "Practice reviews:" in the same note as the week's other lines. `classView` (Who Needs Help) weighs a lesson stuck after a review like any stuck lesson, a reopened lesson like one miss, and notes a lesson moved past instead of calling it stuck.

## The space shooter (pass MI, Mikey: "go until failure")

Chips keep coming until the player's three ships are gone. Each chip falls a little faster than the one before: 0.16 board units a frame (a sixtieth of a second) at first, 0.006 more a chip to about 0.6 at chip 73, then 0.002 more a chip with no ceiling, so even the steadiest hand meets a speed it cannot keep up with. Chips come about 70 frames apart at first (70 frames less 1.2 for each chip already started, so 68.8 after the first), never closer than 30, and at most three fall at once, so early on a chip can wait longer than its gap. A ship is lost when a chip that fits the rule gets past the ship's line or a shot hits a chip that does not fit. Every five fitting chips hit is a new wave, and the best is how many were hit. A chip never starts in line with a chip of the other kind (the two sit wholly side by side with a gap of one unit), and a chip that does not fit never starts in a flying shot's lane, the ship's or where it is gliding. Why: the owner asked for a game that runs until failure and never asks a child to wait for a wrong chip to pass before taking the right one. Since pass MK (Mikey's answer to Q39, "both"), an older student starts further up the ramp, as if 5 chips had fallen for each grade above grade 2, up to 20 from grade 6 (shipStartFor, by the oldest grade among the student's courses), so a grade 6 student's first chips fall in about 5.7 seconds where grade 2's take about 9.9; and every tenth fitting chip hit brings back a lost ship, never past three (SHIP_BACK_EVERY), so a game turns more on speed than on one early slip. The rules test plays it (src/logic.mjs: shipStep and the rest), from grade 6's start too.

## A quick check that completes a course (pass MI, Mikey's answer to Q37)

A passed quick check places its lesson. When that lesson was the course's last one not yet passed, the course is completed, and the quick check's result offers the same celebration as a round, once, with the course's long story. A subject placement that clears whole grades does not celebrate, and a lesson passed before completes nothing new.

## The app's own speech sounds (pass MO, Mikey's notes on Q51)

A device's voice cannot say a speech sound alone: handed "sss" it may spell the letter, and handed "tuh" it may say "two", as it
did on Mikey's phone. So the app makes the sounds a lesson asks a child to hear itself, and the voice says only the words around
them. speechPieces(text) cuts a line into pieces, in order: the voice's words, each sound, and each rhyme ending a voice says badly
alone. A sound is a held sound written as three or more of one of the letters m, n, s, f, z, r or l (mmm, Sss), or a crisp stop
written tuh, puh, cuh or kuh; an all-capital run such as FFFFFF, a color, is never a sound. A word said slowly ("Mmm-at") is its
held sound and then the whole word, Mat, since a voice handed the rest of a word alone says it as a word of its own; a rest that
starts with h keeps its sounds apart (Sss-huh is sss and then huh, since s and h said together are heard as sh); a word stretched
at its end (Busss) is the word and then its sound; and a run of sounds (Mmm-a-puh) is each part in turn. The rhyme endings: ig is
handed to the voice as igg, and at is said as a word of its own where a line names it as an ending (after end or ends in or with,
after "sound," or after a word that ends in at), so "look at the cat" keeps its little word. The voiced stops (buh, duh and guh),
juh, huh, wuh and shh stay with the voice, which said buh and duh well on Mikey's phone. heardForm reads a line as a child hears
it, the line's own words, and since pass MO no word is added to a sound.

The sounds are made from numbers by soundClipSamples, 32,000 samples a second, the same on every device and every time: a seeded
noise source for the hisses and the bursts, and for the voiced sounds a woman's voice near 210 cycles a second (falling 5 percent
over the sound and wavering very slightly, five times a second, so it sounds breathed), shaped by the mouth's or the nose's
resonances. A held sound lasts 0.85 seconds, or 1.1 on the snail's slower pace, rising over 0.07 seconds and falling over 0.16,
so it never clicks. Since pass MP sss, fff and zzz are instead two breaths of 0.32 seconds with 0.13 of quiet between (0.4 and 0.17
on the snail), from Mikey's notes on Q51 ("fragments like sss sss sun"). sss is a hiss from about 4,000 to 9,500 cycles a second
whose loudest part sits near 6,500, high in the range where an s peaks; fff is a softer, flatter hiss from about 1,500 to 7,500;
zzz is the voice's buzz, a low hum near 230, with the hiss pulsing over it, more buzz than hiss since pass MP (he heard "static
behind it"); mmm and nnn are a hum through the nose, strongest near 280, with mmm's dip near 950 and nnn's near
1,750, which is what tells them apart; lll and rrr are the voice held in their mouth shapes, rrr's third resonance low, near
1,650, which is what makes an r sound like r. A crisp stop is 0.03 seconds of quiet, the burst as the tongue or lips let go (t
high, near 5,200; p low, under about 1,200; k in the middle, near 2,100), a short breath after it and, since pass MP, a tenth of a
second of a soft, voiced uh running out of the breath, softer than the burst, so the lessons' tuh, puh and cuh are heard rather
than "a tap on the rim of a drum" (Mikey of row 8), about 0.19 seconds in all (k 0.20; 0.14 and 0.16 before the uh).
Since pass MP the app also makes, for the voice check page alone until Mikey has heard them and chosen (TRIAL_SOUNDS, Q60), the
five short vowels (0.42 seconds each, 0.55 on the snail), buh, duh, guh and juh (the voice's low hum while the lips or tongue are
closed, the release and a short uh), and the endings ig, og and at made whole (the vowel gliding toward the closing consonant and
its release, with no uh after it); each vowel's resonances follow measured American English vowels in a woman's voice, and how
each is made is written beside it in logic.mjs.
soundClipWav wraps a sound as a small WAV file (16-bit, one channel); 'quiet' is a twentieth of a second of silence. These are the
app's own stand-ins until the sounds are recorded (EARMARKS A41).

The screens play them (ui.jsx). One audio element plays every sound, and the first tap, key or touch anywhere plays the quiet one,
which a phone needs before a page may play sound. sayPieces hands the voice its words together up to the next sound, so they flow
as one line, plays the sound once the voice has finished them, and goes on with the words after it; a sound that cannot play ends
at once, and none holds a reading up longer than 1.7 seconds. A newer line cancels the voice and stops the sound (speak,
speakSequence), and voiceTalking counts a sound playing as the voice still talking, so the read-along's light and the voice's one
retry wait for it. The rules test measures every sound against these numbers; tools/voice-check.mjs builds a page from the same
code with 50 numbered rows for Mikey to hear on his phone (Q51; since pass MP rows 33 to 50 hold the sounds made for the page alone, Q60). The retry asks once more when the voice never started, and since
round two's code check each send is its own attempt, so the retry retires the try it replaces; a watch moves a line on when the
voice drops a batch's end event (after 1.2 seconds of quiet, or 1.5 if it never began); and leaving a round hushes it through
hushSpeech, whose cancel waits a tick and is skipped when a newer line has already spoken, so the next screen never speaks straight
after a cancel. Since round three's code check every reader's stop is that hush, a reading whose first words the voice dropped is
asked once more after 700 ms, sayPieces lights no piece past its batch, a story's watch waits for two seconds of quiet before it
ends a reading, and the result and a finished course are hushed when they are left; since round four's code check the Wonder's
voice cards are hushed too, a piece's end counts every piece before it in its batch as ended (a voice says its queue in order, though it may lose an end),
a piece that starts is the one lit, and the voice check page asks a row once more as speak() does; since round five's code check a coloring page is hushed when
it is left, and a piece the voice will not take counts only itself, since the pieces before it are still queued; since round six's code check it tells no one it began, and an end moves the light and the place only once every piece before it has ended, to the next piece not yet ended. The rules test runs this code in
node:vm on a fake clock against a voice that drops what Chrome drops.

## Following directions (pass MO, earmarks E12 and E13, Domain II)

A direction is an order question with pick, the number of steps (stepsQuestion in logic.mjs): two steps in pre-K 3's Two steps,
three in pre-K 4's Three steps. Its items are the steps' pictures and a few others, shuffled, but never with the steps first and in
their own order, since a child who tapped from the left would then pass without listening; its answer is the steps joined in order
with " | ", which checkAnswer compares with the taps, as for every order question. The screen draws the items in a grid that fits
a phone, two columns for four pictures and three for three or six; each tap puts its number on the picture in a gold badge, a tap
on a numbered picture takes back its number and every number after it, a tap past the last step does nothing, and Check answer
waits until every step is tapped. A wrong order hears "Let's listen again." and the direction once more (preReaderWrongWords),
turns every tapped picture clay alike, so the retry cannot be answered by color, and Try again clears the numbers; only the right
order turns them green. The directions name things the lessons say (askedNames reads each step a direction names by its picture
and holds the lesson to saying it), never red beside green, and a rectangle is asked for as the long rectangle, since a square is
a rectangle too. Since round one's screen check the gold badge sits on the picture's corner, half off its tile, so it never covers the
drawing (StepBadge, which also draws the numbers on a lesson line that teaches them); the scroll cue waits until every step is
tapped; on a laptop the grid keeps a phone's size (360 pixels for four pictures, 480 for three or six); and each tile tells a screen
reader its picture's name and, once tapped, its number. Since round three's alignment read a direction never leaves a child stuck:
after two wrong orders (misses, which only a new question resets) the next step's picture wears the app's green "go here" ring
(edu-breathe, still and full with motion off) and a green edge until it is tapped, then the next one does, while the taps so far are
the direction's own; a wrong tap took the ring away until it was taken back, until pass MP: since Mikey's answer to Q58 ("Q58 - A")
a tap on any other picture while the ring shows takes no number and wobbles a moment with a clay edge (0.6 seconds, shown with motion
off too), and the ring stays where it is, so the child always finishes the direction; a numbered picture still takes its number
back. Mastery is unchanged, since a pre-reader's result is right the first time or not.

## A game's welcome and a story's breaths (pass MP, Mikey's game and story notes)

A game's welcome (gameIntro in logic.mjs, GameIntro and makeDemoHands in ui.jsx) waits 450 ms for the board to settle, then says
its lines one at a time while each line's act plays, the next line waiting for both and then 350 ms more (INTRO_GAP). A line no
voice says (a muted device, a browser with no voice) stays up for about three words a second and never under 1.2 seconds
(introReadMs), and a line a voice said quickly keeps its caption up for at least six tenths of that. The pointer glides to a tap in
0.62 seconds and to a look in 0.65, carries a dragged piece at about 3 ms a pixel (0.42 to 1.3 seconds), waits 0.65 seconds beside a
key it shows before pressing it, and waits up to 2.6 seconds for a board to mark its next move (4 seconds for the space shooter's chip);
a target outside the part of the screen the pointer may use (above Skip's bar while it floats; in a page-tall frame, what the page
around it shows) is scrolled to that part's middle first, and the pointer waits until the page has stopped (three frames at one
place, 1.2 seconds at most) and 0.12 seconds more (0.06 with less motion asked for). When the pointer asks a game's question it
waits for the game's voice to finish, 7 seconds at most. Once the welcome has gone, by itself or by any way out, Begin is brought
back into what shows the same way (scrollShown): its cover's top 8 pixels under the top of what shows, or Begin itself centred when
that would leave it below; and after Begin, the board's top, if it sits above what shows. Only a visit that had a welcome scrolls. As the welcome ends, a
scroll its pointer started is stopped where the page is (an instant scroll to the same place ends a smooth one); GamePad then waits
until what shows has stopped moving (three frames at one place, 1.2 seconds at most) before it reads, and while the Instructions
pop-up is open it waits for the pop-up to close. The browser's scroll anchoring is off from the welcome's end until GamePad has read the
board after Begin, so a board in play taller or shorter than its welcome's leaves the page where it was, and the board's top where
Begin's was; in play it is back on, holding the answers still under a child's finger when a question above what shows changes
length.

The welcome plays a round of its own (demoRoundFor): a game's round number decides what it deals, so of rounds 500 to 1,499 the
welcome takes the first whose answered items (one for each line that taps, drags or presses a key, three at most, demoItemCount)
are none of the items the child meets in round 1, the child's first (its whole first board where a board shows all of itself at
once, as Buckets and a deck's Pairs do); where none is clear, as for the smallest decks (Spot It's four pictures, In order:
civilizations' three sets, Fraction twins' five pairs and the fractions scale's five amounts), it takes the round whose items the
child meets latest, and Pay the Price takes a round whose first price shows the big coin its welcome names. The rounds are worked
out ahead of time into DEMO_ROUNDS by node tools/demo-rounds.mjs, which the rules test holds to the search, so opening a game
never searches. A deck dealt in
steps deals set k of round r at r times its step plus k, round the deck (DEAL_STEP: 1 for In order and Sentence builder, 2 for
Find the evidence and Spot It, 3 for Debug the robot, Fix it and Teach the Robot, 5 for Walk the Robot).

A story read aloud breathes (storyGap and storyPause in ui.jsx): 0.65 seconds after its title (a full second on the snail), a
quarter second between paragraphs (0.55 on the snail), and on the snail a third of a second between sentences; the snail reads at
0.65 of the hare's pace (SNAIL_RATE; a recorded clip at 0.72), and two of the app's sounds in a row are 0.2 seconds apart
(SOUND_GAP_MS). A finished game's gold star fades after 2.2 seconds (DONE_STAR_MS).
