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
