# Question review

Mikey asked (October 2, 2026, after pass IA) for a review of every question and answer in the app, so that each one makes sense when a person reads it, in a conversational voice that never sounds robotic. This file tracks that program.

## How a question is read

The practice screen shows a question in this order: the module title, the question in bold, its setup line under it, any picture, the choices, and after answering, the explanation. So a question must make sense when read first. It points at its setup with this (What is wrong with this argument?), never that; it is a whole question, never a fragment (The model?); and its explanation is a sentence that teaches, never a label or a repeat of the answer. Quick fire shows the setup above the question, and this reads well there too.

## The tools

- `node tools/question-review.mjs --grade K` prints every question of a grade in screen order: Q the question, S the setup line, A the answer, X the other choices, E the explanation. Computed banks show a few versions of each pattern; the checks read all of them.
- `node tools/question-review.mjs --flags` lists every question the wording checks flag: a fragment ending, a hanging word, that pointing at a setup the student has not reached, 1 meters, a 8, a label for an explanation, or an explanation that repeats the answer.
- The rules test holds the flagged count at WORDING_FLAG_LIMIT, which may only fall.

## Status

| Part | Status |
|---|---|
| Wording checks across all 1,344 banks (9,352 patterns) | Pass IB: 1,060 flagged, fixed down to 13 |
| Pre-K 3 and pre-K 4 read-through | Next |
| Kindergarten | To do |
| Grades 1 and 2 | To do |
| Grades 3 to 5 | To do |
| Grades 6 to 8 | To do (includes grade 7 weak-evidence explanations) |
| Grades 9 to 12 | To do (includes grade 9 credibility and grade 12 star-stage explanations) |
| College | To do |
| Wonder questions (264, four voices each) | To do |
| Game cards with words (Myth or Fact, Valid or Not, and others) | To do |

## What a read-through checks

Every fact and every answer, read against its lesson; one clearly right answer, with choices a student could believe; no choice that gives the answer away by grammar; whole, conversational questions with varied rhythm; explanations that teach in a sentence or two; and anything a check cannot see.
