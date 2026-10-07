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
reflection is skipped.

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

A letter is a list of strokes, each a list of points on a 100 by 100 grid. A drawing
matches when, for every stroke in order, every sampled point along it has a drawn
point within 14 grid units, and at least 70 percent of the drawn points lie within 20
units of the letter. The first rule forgives wobble but not a wrong shape; the second
rejects a scribble that happens to cover everything.

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

## The light review, the fourth exposure (2026-10-06, pass LF, Mikey's L2)

A lesson is met four times: the lesson, the practice that earns its star, the memory checks
that bring it back inside later rounds, and a short review that arrives without warning
three weeks after the star (`LIGHT_REVIEW_FIRST_DAYS`, 21), five questions from the
lesson's own bank at the same difficulty (`buildLightReview`), no repeats. The outcomes
(`lightReviewOutcome`): four or five right is a clear pass, and no further review is
planned; three right is a bare pass, so another short review comes a week later
(`LIGHT_REVIEW_RETRY_DAYS`, 7) and opens with the kinds of question that were missed; two or
fewer is a fail, so the lesson is reopened and reassigned (a full round again, its story
offered), nothing is due for it until it is passed again, and the new star restarts the
schedule. A fail also names the lessons it builds on (`probeIds`: the mastered
prerequisites of the reopened lesson) for the next rounds' memory checks to favor, because
a slip this deep usually starts one step earlier. The review's five answers count toward
the confidence score exactly as memory checks do. Nothing is shown to the child as a
failure, and no pass or star is ever rewritten. There is no switch (Mikey, pass LF): the
review helps, and the student card has enough on it. A child who cannot get past a reopened
lesson is not left there. Once the app's own ladder has run, two misses on the reopened
lesson, a loop back to the lesson before it, and two more misses with no pass between
(`lightReviewStuck`, `stuckAfterReviewIds`), the educator's page says so in a sentence and
offers one action, move the student forward, which appends a `moved_forward` event
(`makeMovedForwardEvent`). That closes the review for the lesson (its state becomes `moved`,
it leaves the reviewing list, nothing more is due for it) and touches nothing else: the star
stands, the gate stands, and the lesson stays in the memory checks, so a later slip still
shows. A new star after that restarts the schedule like any star. One a day (Mikey, pass LI): every review that has fallen due waits in a queue, oldest first (`lightReviewQueue`), and `lightReviewDue` offers the first only if none was taken that calendar day (`LIGHT_REVIEWS_PER_DAY`), so ten lessons mastered in one day become ten days of one review each. When one is due it opens the student's day: the overview shows only it, with Start, until it is done. The queue holds only lessons the student can see. Calendar days, not days logged in (Mikey, pass LK): forgetting runs on the calendar. On a busy day, more than seven waiting counting any taken that day (`LIGHT_REVIEW_BACKLOG`), a second review is allowed (`LIGHT_REVIEWS_BUSY_DAY`), never a third, and the two are taken back to back at the start of the day, both shown on the start-of-day card, with the lessons following when both are done (Mikey, pass LL, in place of pass LK's review, lesson, review; `lightReviewDay`). The record is one event
per review, `light_review_completed`, with
each question's kind and prompt, so the educator's sentence can name what was missed. One
review is offered at a time, the longest overdue first (`lightReviewDue`). The three weeks
and the week are judgements taken from the forgetting curve: long enough for a weak memory
to fade, short enough to repair it cheaply.
