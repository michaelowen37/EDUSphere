# check.sh's step times

check.sh writes this file at the end of every run a pass makes, after its verdict line, and nobody edits it by hand (pass NQ, EARMARKS L20): a pass's own runs name it in CHECK_TIMES_FILE (CHECK_TIMES_FILE=<the project>/docs/CHECK-TIMES.md ./check.sh), and a run without it, as a run in Mikey's folder is, records nothing here, so his folder stays as the zip left it and another machine's times never mix with the pass machine's in the medians. Each run is a short dated table, newest first: when the run began and ended, its verdict and its minutes in all, then one row for each step, with the step's name as check.sh echoes it, its seconds, its time limit where it runs under one (check.sh's run), the share of that limit it used, its status (passed, failed, or stopped at its limit, with its command's exit code where that was not 0) and its summary line, the line its verdict reads. The twelve newest runs are kept whole; older runs are folded into one table at the end, each step's median seconds over the runs folded, with every folded run's seconds kept beside it so the median stays exact as more runs fold in, and the file stays small.

tools/check-times.mjs reads it and prints, step by step, its seconds over the runs recorded, its median, and a flag where the newest run is more than a quarter over the median of the runs before it or past two thirds of its limit (check.sh's slow rule), so a step's growth is seen and a raised limit carries its cause. tests/floor-guard.test.mjs reads the newest run's limits and each step's count of checks from its newest passing run. Nothing is written here while the steps run, since a step reads the tree (pass MT's third run failed when a doc changed mid-run); a run on a frozen copy of the project writes into the file CHECK_TIMES_FILE names, the project's when the lead sets it so.

A step whose seconds say not recorded was not measured: the oldest run, pass NP's final run, was written here in pass NQ from its DECISIONS entry, with the counts that entry lists and the limits check.sh had then.

## Run of 2026-11-23 01:53 CST

Began 2026-11-23 01:53 CST and ended 2026-11-23 05:16 CST, 203 minutes in all. Verdict: ALL CHECKS PASSED.

| Step | Seconds | Limit | Share of limit | Status | Summary line |
|---|---|---|---|---|---|
| 1/13 rules tests | 998 |  |  | passed | 3320 passed, 0 failed |
| 2/13 curriculum coverage | 0 |  |  | passed | 386 passed, 0 failed |
| 3/13 spelling and style | 2 |  |  | passed | 80 passed, 0 failed |
| 3b/13 the rules audit and algorithms match the code | 30 |  |  | passed | 143 passed, 0 failed |
| 3c/13 the pass packet copies its rows word for word | 2 |  |  | passed | 56 passed, 0 failed |
| 3d/13 no floor, count, wait or limit loosened without its DECISIONS line | 4 |  |  | passed | 24 passed, 0 failed |
| 3e/13 the rules test's block runner proves itself | 5 | 60 | 8% | passed | 12 passed, 0 failed |
| 3f/13 the blind read proves itself | 8 | 60 | 13% | passed | 28 passed, 0 failed |
| 3g/13 the planted-defect set builds, leaks nothing and scores as it must | 130 | 300 | 43% | passed | 41 passed, 0 failed |
| 3h/13 the undo-alone tool proves itself | 9 | 60 | 15% | passed | 33 passed, 0 failed |
| 3i/13 the ripple read's manifest proves itself | 4 | 60 | 7% | passed | 67 passed, 0 failed (4 seconds) |
| 3j/13 the usage count by model proves itself | 1 | 60 | 2% | passed | 27 passed, 0 failed |
| 4/13 lesson lines and pictures | 19 |  |  | passed | 95 passed, 0 failed |
| 5/13 stories | 1 |  |  | passed | 6975 passed, 0 failed |
| 5b/11 art ledger | 3 |  |  | passed | 48 passed, 0 failed |
| 5c/11 pictures | 0 |  |  | passed | 2 passed, 0 failed |
| 6/13 old backups still restore | 0 |  |  | passed | 21 passed, 0 failed |
| 6b/13 updating a folder from a delivered zip | 1 |  |  | passed | 25 passed, 0 failed |
| 7/13 build | 5 |  |  | passed | no summary line |
| 8/13 render smoke | 4 |  |  | passed | PASS - artifact loads and renders its first screen (63687 chars of HTML) |
| 9/13 syntax | 4 |  |  | passed | no summary line |
| 10/13 browser click-through (about twelve minutes) | 535 | 1500 | 36% | passed | 374 passed, 0 failed |
| 10/13 license codes in the browser | 9 | 120 | 8% | passed | 7 passed, 0 failed |
| 10/13 dragging with a desktop mouse | 33 | 150 | 22% | passed | 14 passed, 0 failed |
| 10/13 changing the educator PIN | 19 | 120 | 16% | passed | 13 passed, 0 failed |
| 10/13 the first week tour, card by card, and pages that open at the top | 201 | 420 | 48% | passed | 130 passed, 0 failed |
| 11/13 back button from every screen, and the words in their boxes on every screen it lands on | 32 | 200 | 16% | passed | 25 passed, 0 failed |
| 12/13 dark theme: every word readable, paper screens light | 54 | 200 | 27% | passed | 86 passed, 0 failed |
| 13/13 standalone page keeps its data | 108 | 240 | 45% | passed | 30 passed, 0 failed |
| 13b/13 the scroll cue on a phone lesson | 40 | 120 | 33% | passed | 16 passed, 0 failed |
| 13c/13 the quick look back and Action Items, walked as a student and an educator | 78 | 240 | 33% | passed | 18 passed, 0 failed |
| 13d/13 game breaks, elective stories and Let's Read, walked as a student and an educator | 250 | 600 | 42% | passed | 93 passed, 0 failed |
| 13e/13 question pictures, More Info, the Wonder pictures and the read-along | 2656 | 5400 | 49% | passed | 150 passed, 0 failed |
| 13f/13 a game's welcome and its demonstration | 795 | 1800 | 44% | passed | 79 passed, 0 failed |
| 13g/13 every game on the narrowest phone, in a wider font, after a wrong tap | 200 | 600 | 33% | passed | 160 games at 1 sizes (160 opened, wide font, 43 read after a wrong tap): 0 problems |
| 13h/13 every word in every drawn picture, in both themes | 334 | 900 | 37% | passed | 9 passed, 0 failed |
| 13i/13 the reading lists' Details, in both themes | 35 | 240 | 15% | passed | 10 passed, 0 failed |
| 13j/13 every pre-K line and question on a short phone, in both themes | 1861 | 3100 | 60% | passed | 23 passed, 0 failed |
| 13k/13 every drawing on an answer tile, at its edge, in both themes | 320 | 660 | 48% | passed | 5 passed, 0 failed |
| 13l/13 every drawing on the dark theme's lesson paper, at its edge | 584 | 1030 | 57% | passed | 8 passed, 0 failed |
| 13m/13 no word under the scroll cue on a short phone, in both themes | 501 | 1020 | 49% | passed | 49 passed, 0 failed |
| 13n/13 the grown-up's card on a device with no voice, in both themes | 1694 | 2620 | 65% | passed | 79 passed, 0 failed |
| 13o/13 a browser too old for the app sees a note, and the page uses nothing newer than it names | 191 | 420 | 45% | passed | 36 passed, 0 failed |
| 13p/13 a student signed out after fifteen quiet minutes | 92 | 240 | 38% | passed | 15 passed, 0 failed |
| 13q/13 a lesson's look proves itself, screen by screen | 31 | 60 | 52% | passed | 11 passed, 0 failed |
| 13r/13 a question's printed words keep a hyphenated word whole | 157 | 300 | 52% | passed | 4 passed, 0 failed |
| 13s/13 a print question's drawings: each word inside its outline and each picture at its size, in both themes | 137 | 300 | 46% | passed | 3 passed, 0 failed |

## Run of 2026-11-19 09:04 CST

Began 2026-11-19 09:04 CST and ended 2026-11-19 12:28 CST, 203 minutes in all. Verdict: ALL CHECKS PASSED.

| Step | Seconds | Limit | Share of limit | Status | Summary line |
|---|---|---|---|---|---|
| 1/13 rules tests | 1260 |  |  | passed | 3320 passed, 0 failed |
| 2/13 curriculum coverage | 1 |  |  | passed | 386 passed, 0 failed |
| 3/13 spelling and style | 1 |  |  | passed | 80 passed, 0 failed |
| 3b/13 the rules audit and algorithms match the code | 34 |  |  | passed | 136 passed, 0 failed |
| 3c/13 the pass packet copies its rows word for word | 1 |  |  | passed | 54 passed, 0 failed |
| 3d/13 no floor, count, wait or limit loosened without its DECISIONS line | 5 |  |  | passed | 24 passed, 0 failed |
| 3e/13 the rules test's block runner proves itself | 5 | 60 | 8% | passed | 11 passed, 0 failed |
| 3f/13 the blind read proves itself | 3 | 60 | 5% | passed | 9 passed, 0 failed |
| 3g/13 the planted-defect set builds, leaks nothing and scores as it must | 108 | 300 | 36% | passed | 40 passed, 0 failed |
| 4/13 lesson lines and pictures | 24 |  |  | passed | 93 passed, 0 failed |
| 5/13 stories | 2 |  |  | passed | 6975 passed, 0 failed |
| 5b/11 art ledger | 3 |  |  | passed | 48 passed, 0 failed |
| 5c/11 pictures | 0 |  |  | passed | 2 passed, 0 failed |
| 6/13 old backups still restore | 0 |  |  | passed | 21 passed, 0 failed |
| 6b/13 updating a folder from a delivered zip | 1 |  |  | passed | 25 passed, 0 failed |
| 7/13 build | 6 |  |  | passed | no summary line |
| 8/13 render smoke | 5 |  |  | passed | PASS - artifact loads and renders its first screen (63687 chars of HTML) |
| 9/13 syntax | 4 |  |  | passed | no summary line |
| 10/13 browser click-through (about twelve minutes) | 541 | 1500 | 36% | passed | 373 passed, 0 failed |
| 10/13 license codes in the browser | 9 | 120 | 8% | passed | 7 passed, 0 failed |
| 10/13 dragging with a desktop mouse | 31 | 150 | 21% | passed | 14 passed, 0 failed |
| 10/13 changing the educator PIN | 20 | 120 | 17% | passed | 13 passed, 0 failed |
| 10/13 the first week tour, card by card, and pages that open at the top | 203 | 420 | 48% | passed | 130 passed, 0 failed |
| 11/13 back button from every screen, and the words in their boxes on every screen it lands on | 32 | 200 | 16% | passed | 25 passed, 0 failed |
| 12/13 dark theme: every word readable, paper screens light | 55 | 200 | 28% | passed | 86 passed, 0 failed |
| 13/13 standalone page keeps its data | 84 | 150 | 56% | passed | 28 passed, 0 failed |
| 13b/13 the scroll cue on a phone lesson | 41 | 120 | 34% | passed | 16 passed, 0 failed |
| 13c/13 the quick look back and Action Items, walked as a student and an educator | 24 | 240 | 10% | passed | 14 passed, 0 failed |
| 13d/13 game breaks, elective stories and Let's Read, walked as a student and an educator | 256 | 600 | 43% | passed | 93 passed, 0 failed |
| 13e/13 question pictures, More Info, the Wonder pictures and the read-along | 2624 | 4000 | 66% | passed | 149 passed, 0 failed |
| 13f/13 a game's welcome and its demonstration | 796 | 1800 | 44% | passed | 79 passed, 0 failed |
| 13g/13 every game on the narrowest phone, in a wider font, after a wrong tap | 201 | 600 | 34% | passed | 160 games at 1 sizes (160 opened, wide font, 43 read after a wrong tap): 0 problems |
| 13h/13 every word in every drawn picture, in both themes | 331 | 900 | 37% | passed | 9 passed, 0 failed |
| 13i/13 the reading lists' Details, in both themes | 35 | 240 | 15% | passed | 10 passed, 0 failed |
| 13j/13 every pre-K line and question on a short phone, in both themes | 1857 | 3100 | 60% | passed | 23 passed, 0 failed |
| 13k/13 every drawing on an answer tile, at its edge, in both themes | 317 | 660 | 48% | passed | 4 passed, 0 failed |
| 13l/13 every drawing on the dark theme's lesson paper, at its edge | 595 | 1030 | 58% | passed | 8 passed, 0 failed |
| 13m/13 no word under the scroll cue on a short phone, in both themes | 504 | 1020 | 49% | passed | 49 passed, 0 failed |
| 13n/13 the grown-up's card on a device with no voice, in both themes | 1706 | 2620 | 65% | passed | 79 passed, 0 failed |
| 13o/13 a browser too old for the app sees a note, and the page uses nothing newer than it names | 191 | 420 | 45% | passed | 36 passed, 0 failed |
| 13p/13 a student signed out after fifteen quiet minutes | 92 | 240 | 38% | passed | 15 passed, 0 failed |
| 13q/13 a lesson's look proves itself, screen by screen | 30 | 60 | 50% | passed | 11 passed, 0 failed |
| 13r/13 a question's printed words keep a hyphenated word whole | 156 | 300 | 52% | passed | 4 passed, 0 failed |

## Run of 2026-11-19 05:00 CST

Began 2026-11-19 05:00 CST and ended 2026-11-19 08:22 CST, 202 minutes in all. Verdict: CHECKS FAILED - read the lines above.

| Step | Seconds | Limit | Share of limit | Status | Summary line |
|---|---|---|---|---|---|
| 1/13 rules tests | 1125 |  |  | passed | 3320 passed, 0 failed |
| 2/13 curriculum coverage | 1 |  |  | passed | 386 passed, 0 failed |
| 3/13 spelling and style | 1 |  |  | passed | 80 passed, 0 failed |
| 3b/13 the rules audit and algorithms match the code | 29 |  |  | passed | 135 passed, 0 failed |
| 3c/13 the pass packet copies its rows word for word | 2 |  |  | passed | 54 passed, 0 failed |
| 3d/13 no floor, count, wait or limit loosened without its DECISIONS line | 4 |  |  | passed | 24 passed, 0 failed |
| 3e/13 the rules test's block runner proves itself | 5 | 60 | 8% | passed | 11 passed, 0 failed |
| 3f/13 the blind read proves itself | 2 | 60 | 3% | passed | 9 passed, 0 failed |
| 3g/13 the planted-defect set builds, leaks nothing and scores as it must | 98 | 300 | 33% | passed | 40 passed, 0 failed |
| 4/13 lesson lines and pictures | 20 |  |  | passed | 93 passed, 0 failed |
| 5/13 stories | 1 |  |  | passed | 6975 passed, 0 failed |
| 5b/11 art ledger | 2 |  |  | passed | 48 passed, 0 failed |
| 5c/11 pictures | 1 |  |  | passed | 2 passed, 0 failed |
| 6/13 old backups still restore | 0 |  |  | passed | 21 passed, 0 failed |
| 6b/13 updating a folder from a delivered zip | 1 |  |  | passed | 25 passed, 0 failed |
| 7/13 build | 5 |  |  | passed | no summary line |
| 8/13 render smoke | 3 |  |  | passed | PASS - artifact loads and renders its first screen (63687 chars of HTML) |
| 9/13 syntax | 4 |  |  | passed | no summary line |
| 10/13 browser click-through (about twelve minutes) | 537 | 1500 | 36% | passed | 373 passed, 0 failed |
| 10/13 license codes in the browser | 9 | 120 | 8% | passed | 7 passed, 0 failed |
| 10/13 dragging with a desktop mouse | 31 | 150 | 21% | passed | 14 passed, 0 failed |
| 10/13 changing the educator PIN | 18 | 120 | 15% | passed | 13 passed, 0 failed |
| 10/13 the first week tour, card by card, and pages that open at the top | 201 | 420 | 48% | passed | 130 passed, 0 failed |
| 11/13 back button from every screen, and the words in their boxes on every screen it lands on | 32 | 200 | 16% | passed | 25 passed, 0 failed |
| 12/13 dark theme: every word readable, paper screens light | 54 | 200 | 27% | passed | 86 passed, 0 failed |
| 13/13 standalone page keeps its data | 82 | 150 | 55% | passed | 28 passed, 0 failed |
| 13b/13 the scroll cue on a phone lesson | 40 | 120 | 33% | passed | 16 passed, 0 failed |
| 13c/13 the quick look back and Action Items, walked as a student and an educator | 24 | 240 | 10% | passed | 14 passed, 0 failed |
| 13d/13 game breaks, elective stories and Let's Read, walked as a student and an educator | 254 | 600 | 42% | passed | 93 passed, 0 failed |
| 13e/13 question pictures, More Info, the Wonder pictures and the read-along | 2629 | 4000 | 66% | passed | 149 passed, 0 failed |
| 13f/13 a game's welcome and its demonstration | 796 | 1800 | 44% | passed | 79 passed, 0 failed |
| 13g/13 every game on the narrowest phone, in a wider font, after a wrong tap | 202 | 600 | 34% | passed | 160 games at 1 sizes (160 opened, wide font, 43 read after a wrong tap): 0 problems |
| 13h/13 every word in every drawn picture, in both themes | 356 | 900 | 40% | passed | 9 passed, 0 failed |
| 13i/13 the reading lists' Details, in both themes | 36 | 240 | 15% | passed | 10 passed, 0 failed |
| 13j/13 every pre-K line and question on a short phone, in both themes | 1860 | 3100 | 60% | passed | 23 passed, 0 failed |
| 13k/13 every drawing on an answer tile, at its edge, in both themes | 324 | 660 | 49% | passed | 4 passed, 0 failed |
| 13l/13 every drawing on the dark theme's lesson paper, at its edge | 631 | 1030 | 61% | passed | 8 passed, 0 failed |
| 13m/13 no word under the scroll cue on a short phone, in both themes | 531 | 1020 | 52% | failed, exit code 1 | 46 passed, 3 failed |
| 13n/13 the grown-up's card on a device with no voice, in both themes | 1721 | 2620 | 66% | passed | 79 passed, 0 failed |
| 13o/13 a browser too old for the app sees a note, and the page uses nothing newer than it names | 194 | 420 | 46% | passed | 36 passed, 0 failed |
| 13p/13 a student signed out after fifteen quiet minutes | 92 | 240 | 38% | passed | 15 passed, 0 failed |
| 13q/13 a lesson's look proves itself, screen by screen | 31 | 60 | 52% | passed | 11 passed, 0 failed |
| 13r/13 a question's printed words keep a hyphenated word whole | 158 | 300 | 53% | passed | 4 passed, 0 failed |

## Run of 2026-11-18 18:42 CST

Began 2026-11-18 18:42 CST and ended 2026-11-18 21:56 CST, 194 minutes in all. Verdict: ALL CHECKS PASSED.

| Step | Seconds | Limit | Share of limit | Status | Summary line |
|---|---|---|---|---|---|
| 1/13 rules tests | 892 |  |  | passed | 3320 passed, 0 failed |
| 2/13 curriculum coverage | 1 |  |  | passed | 386 passed, 0 failed |
| 3/13 spelling and style | 1 |  |  | passed | 80 passed, 0 failed |
| 3b/13 the rules audit and algorithms match the code | 25 |  |  | passed | 135 passed, 0 failed |
| 3c/13 the pass packet copies its rows word for word | 1 |  |  | passed | 54 passed, 0 failed |
| 3d/13 no floor, count, wait or limit loosened without its DECISIONS line | 4 |  |  | passed | 24 passed, 0 failed |
| 3e/13 the rules test's block runner proves itself | 3 | 60 | 5% | passed | 11 passed, 0 failed |
| 3f/13 the blind read proves itself | 2 | 60 | 3% | passed | 9 passed, 0 failed |
| 3g/13 the planted-defect set builds, leaks nothing and scores as it must | 87 | 300 | 29% | passed | 40 passed, 0 failed |
| 4/13 lesson lines and pictures | 18 |  |  | passed | 93 passed, 0 failed |
| 5/13 stories | 1 |  |  | passed | 6975 passed, 0 failed |
| 5b/11 art ledger | 2 |  |  | passed | 48 passed, 0 failed |
| 5c/11 pictures | 1 |  |  | passed | 2 passed, 0 failed |
| 6/13 old backups still restore | 0 |  |  | passed | 21 passed, 0 failed |
| 6b/13 updating a folder from a delivered zip | 0 |  |  | passed | 25 passed, 0 failed |
| 7/13 build | 5 |  |  | passed | no summary line |
| 8/13 render smoke | 4 |  |  | passed | PASS - artifact loads and renders its first screen (63687 chars of HTML) |
| 9/13 syntax | 3 |  |  | passed | no summary line |
| 10/13 browser click-through (about twelve minutes) | 533 | 1500 | 36% | passed | 373 passed, 0 failed |
| 10/13 license codes in the browser | 8 | 120 | 7% | passed | 7 passed, 0 failed |
| 10/13 dragging with a desktop mouse | 30 | 150 | 20% | passed | 14 passed, 0 failed |
| 10/13 changing the educator PIN | 19 | 120 | 16% | passed | 13 passed, 0 failed |
| 10/13 the first week tour, card by card, and pages that open at the top | 197 | 420 | 47% | passed | 130 passed, 0 failed |
| 11/13 back button from every screen, and the words in their boxes on every screen it lands on | 32 | 200 | 16% | passed | 25 passed, 0 failed |
| 12/13 dark theme: every word readable, paper screens light | 53 | 200 | 27% | passed | 86 passed, 0 failed |
| 13/13 standalone page keeps its data | 80 | 150 | 53% | passed | 28 passed, 0 failed |
| 13b/13 the scroll cue on a phone lesson | 40 | 120 | 33% | passed | 16 passed, 0 failed |
| 13c/13 the quick look back and Action Items, walked as a student and an educator | 23 | 240 | 10% | passed | 14 passed, 0 failed |
| 13d/13 game breaks, elective stories and Let's Read, walked as a student and an educator | 249 | 600 | 42% | passed | 93 passed, 0 failed |
| 13e/13 question pictures, More Info, the Wonder pictures and the read-along | 2591 | 4000 | 65% | passed | 149 passed, 0 failed |
| 13f/13 a game's welcome and its demonstration | 796 | 1800 | 44% | passed | 79 passed, 0 failed |
| 13g/13 every game on the narrowest phone, in a wider font, after a wrong tap | 201 | 600 | 34% | passed | 160 games at 1 sizes (160 opened, wide font, 43 read after a wrong tap): 0 problems |
| 13h/13 every word in every drawn picture, in both themes | 334 | 900 | 37% | passed | 9 passed, 0 failed |
| 13i/13 the reading lists' Details, in both themes | 36 | 240 | 15% | passed | 10 passed, 0 failed |
| 13j/13 every pre-K line and question on a short phone, in both themes | 1872 | 3100 | 60% | passed | 23 passed, 0 failed |
| 13k/13 every drawing on an answer tile, at its edge, in both themes | 323 | 660 | 49% | passed | 4 passed, 0 failed |
| 13l/13 every drawing on the dark theme's lesson paper, at its edge | 611 | 1030 | 59% | passed | 8 passed, 0 failed |
| 13m/13 no word under the scroll cue on a short phone, in both themes | 514 | 1020 | 50% | passed | 49 passed, 0 failed |
| 13n/13 the grown-up's card on a device with no voice, in both themes | 1709 | 2620 | 65% | passed | 79 passed, 0 failed |
| 13o/13 a browser too old for the app sees a note, and the page uses nothing newer than it names | 192 | 420 | 46% | passed | 36 passed, 0 failed |
| 13p/13 a student signed out after fifteen quiet minutes | 91 | 240 | 38% | passed | 15 passed, 0 failed |
| 13q/13 a lesson's look proves itself, screen by screen | 30 | 60 | 50% | passed | 11 passed, 0 failed |

## Run of 2026-11-18 08:00 CST

Began 2026-11-18 08:00 CST and ended 2026-11-18 11:09 CST, 189 minutes in all. Verdict: ALL CHECKS PASSED.

| Step | Seconds | Limit | Share of limit | Status | Summary line |
|---|---|---|---|---|---|
| 1/13 rules tests | 900 |  |  | passed | 3319 passed, 0 failed |
| 2/13 curriculum coverage | 0 |  |  | passed | 386 passed, 0 failed |
| 3/13 spelling and style | 1 |  |  | passed | 80 passed, 0 failed |
| 3b/13 the rules audit and algorithms match the code | 26 |  |  | passed | 134 passed, 0 failed |
| 3c/13 the pass packet copies its rows word for word | 1 |  |  | passed | 54 passed, 0 failed |
| 3d/13 no floor, count, wait or limit loosened without its DECISIONS line | 4 |  |  | passed | 24 passed, 0 failed |
| 3e/13 the rules test's block runner proves itself | 4 | 60 | 7% | passed | 11 passed, 0 failed |
| 3f/13 the blind read proves itself | 2 | 60 | 3% | passed | 9 passed, 0 failed |
| 3g/13 the planted-defect set builds, leaks nothing and scores as it must | 102 | 300 | 34% | passed | 40 passed, 0 failed |
| 4/13 lesson lines and pictures | 20 |  |  | passed | 93 passed, 0 failed |
| 5/13 stories | 1 |  |  | passed | 6975 passed, 0 failed |
| 5b/11 art ledger | 2 |  |  | passed | 48 passed, 0 failed |
| 5c/11 pictures | 0 |  |  | passed | 2 passed, 0 failed |
| 6/13 old backups still restore | 0 |  |  | passed | 21 passed, 0 failed |
| 6b/13 updating a folder from a delivered zip | 1 |  |  | passed | 25 passed, 0 failed |
| 7/13 build | 5 |  |  | passed | no summary line |
| 8/13 render smoke | 3 |  |  | passed | PASS - artifact loads and renders its first screen (63169 chars of HTML) |
| 9/13 syntax | 4 |  |  | passed | no summary line |
| 10/13 browser click-through (about twelve minutes) | 533 | 1500 | 36% | passed | 373 passed, 0 failed |
| 10/13 license codes in the browser | 9 | 120 | 8% | passed | 7 passed, 0 failed |
| 10/13 dragging with a desktop mouse | 31 | 150 | 21% | passed | 14 passed, 0 failed |
| 10/13 changing the educator PIN | 18 | 120 | 15% | passed | 13 passed, 0 failed |
| 10/13 the first week tour, card by card, and pages that open at the top | 200 | 420 | 48% | passed | 130 passed, 0 failed |
| 11/13 back button from every screen, and the words in their boxes on every screen it lands on | 32 | 200 | 16% | passed | 25 passed, 0 failed |
| 12/13 dark theme: every word readable, paper screens light | 51 | 200 | 26% | passed | 85 passed, 0 failed |
| 13/13 standalone page keeps its data | 79 | 150 | 53% | passed | 25 passed, 0 failed |
| 13b/13 the scroll cue on a phone lesson | 41 | 120 | 34% | passed | 16 passed, 0 failed |
| 13c/13 the quick look back and Action Items, walked as a student and an educator | 24 | 240 | 10% | passed | 14 passed, 0 failed |
| 13d/13 game breaks, elective stories and Let's Read, walked as a student and an educator | 247 | 600 | 41% | passed | 91 passed, 0 failed |
| 13e/13 question pictures, More Info, the Wonder pictures and the read-along | 2611 | 4000 | 65% | passed | 149 passed, 0 failed |
| 13f/13 a game's welcome and its demonstration | 791 | 1800 | 44% | passed | 79 passed, 0 failed |
| 13g/13 every game on the narrowest phone, in a wider font, after a wrong tap | 201 | 600 | 34% | passed | 160 games at 1 sizes (160 opened, wide font, 43 read after a wrong tap): 0 problems |
| 13h/13 every word in every drawn picture, in both themes | 259 | 900 | 29% | passed | 9 passed, 0 failed |
| 13i/13 the reading lists' Details, in both themes | 35 | 240 | 15% | passed | 10 passed, 0 failed |
| 13j/13 every pre-K line and question on a short phone, in both themes | 1858 | 3100 | 60% | passed | 23 passed, 0 failed |
| 13k/13 every drawing on an answer tile, at its edge, in both themes | 322 | 660 | 49% | passed | 4 passed, 0 failed |
| 13l/13 every drawing on the dark theme's lesson paper, at its edge | 608 | 1030 | 59% | passed | 8 passed, 0 failed |
| 13m/13 no word under the scroll cue on a short phone, in both themes | 496 | 1020 | 49% | passed | 49 passed, 0 failed |
| 13n/13 the grown-up's card on a device with no voice, in both themes | 1491 | 2620 | 57% | passed | 75 passed, 0 failed |
| 13o/13 a browser too old for the app sees a note, and the page uses nothing newer than it names | 189 | 420 | 45% | passed | 36 passed, 0 failed |
| 13p/13 a student signed out after fifteen quiet minutes | 91 | 240 | 38% | passed | 15 passed, 0 failed |
| 13q/13 a lesson's look proves itself, screen by screen | 29 | 60 | 48% | passed | 11 passed, 0 failed |

## Run of 2026-11-17 14:12 CST

Began 2026-11-17 14:12 CST and ended 2026-11-17 17:25 CST, 194 minutes in all. Verdict: ALL CHECKS PASSED.

| Step | Seconds | Limit | Share of limit | Status | Summary line |
|---|---|---|---|---|---|
| 1/13 rules tests | 1022 |  |  | passed | 3318 passed, 0 failed |
| 2/13 curriculum coverage | 1 |  |  | passed | 386 passed, 0 failed |
| 3/13 spelling and style | 1 |  |  | passed | 80 passed, 0 failed |
| 3b/13 the rules audit and algorithms match the code | 25 |  |  | passed | 131 passed, 0 failed |
| 3c/13 the pass packet copies its rows word for word | 1 |  |  | passed | 45 passed, 0 failed |
| 3d/13 no floor, count, wait or limit loosened without its DECISIONS line | 2 |  |  | passed | 15 passed, 0 failed |
| 3e/13 the rules test's block runner proves itself | 4 | 60 | 7% | passed | 11 passed, 0 failed |
| 3f/13 the blind read proves itself | 2 | 60 | 3% | passed | 9 passed, 0 failed |
| 3g/13 the planted-defect set builds, leaks nothing and scores as it must | 110 | 300 | 37% | passed | 40 passed, 0 failed |
| 4/13 lesson lines and pictures | 21 |  |  | passed | 93 passed, 0 failed |
| 5/13 stories | 1 |  |  | passed | 6975 passed, 0 failed |
| 5b/11 art ledger | 2 |  |  | passed | 48 passed, 0 failed |
| 5c/11 pictures | 1 |  |  | passed | 2 passed, 0 failed |
| 6/13 old backups still restore | 0 |  |  | passed | 21 passed, 0 failed |
| 6b/13 updating a folder from a delivered zip | 0 |  |  | passed | 25 passed, 0 failed |
| 7/13 build | 6 |  |  | passed | no summary line |
| 8/13 render smoke | 4 |  |  | passed | PASS - artifact loads and renders its first screen (63169 chars of HTML) |
| 9/13 syntax | 4 |  |  | passed | no summary line |
| 10/13 browser click-through (about twelve minutes) | 539 | 1500 | 36% | passed | 373 passed, 0 failed |
| 10/13 license codes in the browser | 9 | 120 | 8% | passed | 7 passed, 0 failed |
| 10/13 dragging with a desktop mouse | 31 | 150 | 21% | passed | 14 passed, 0 failed |
| 10/13 changing the educator PIN | 19 | 120 | 16% | passed | 13 passed, 0 failed |
| 10/13 the first week tour, card by card, and pages that open at the top | 203 | 420 | 48% | passed | 130 passed, 0 failed |
| 11/13 back button from every screen, and the words in their boxes on every screen it lands on | 32 | 200 | 16% | passed | 25 passed, 0 failed |
| 12/13 dark theme: every word readable, paper screens light | 52 | 200 | 26% | passed | 85 passed, 0 failed |
| 13/13 standalone page keeps its data | 78 | 150 | 52% | passed | 25 passed, 0 failed |
| 13b/13 the scroll cue on a phone lesson | 41 | 120 | 34% | passed | 16 passed, 0 failed |
| 13c/13 the quick look back and Action Items, walked as a student and an educator | 24 | 240 | 10% | passed | 14 passed, 0 failed |
| 13d/13 game breaks, elective stories and Let's Read, walked as a student and an educator | 252 | 600 | 42% | passed | 91 passed, 0 failed |
| 13e/13 question pictures, More Info, the Wonder pictures and the read-along | 2628 | 4000 | 66% | passed | 149 passed, 0 failed |
| 13f/13 a game's welcome and its demonstration | 794 | 1800 | 44% | passed | 79 passed, 0 failed |
| 13g/13 every game on the narrowest phone, in a wider font, after a wrong tap | 202 | 600 | 34% | passed | 160 games at 1 sizes (160 opened, wide font, 43 read after a wrong tap): 0 problems |
| 13h/13 every word in every drawn picture, in both themes | 343 | 900 | 38% | passed | 9 passed, 0 failed |
| 13i/13 the reading lists' Details, in both themes | 36 | 240 | 15% | passed | 10 passed, 0 failed |
| 13j/13 every pre-K line and question on a short phone, in both themes | 1866 | 3100 | 60% | passed | 23 passed, 0 failed |
| 13k/13 every drawing on an answer tile, at its edge, in both themes | 319 | 660 | 48% | passed | 4 passed, 0 failed |
| 13l/13 every drawing on the dark theme's lesson paper, at its edge | 623 | 1030 | 60% | passed | 8 passed, 0 failed |
| 13m/13 no word under the scroll cue on a short phone, in both themes | 519 | 1020 | 51% | passed | 49 passed, 0 failed |
| 13n/13 the grown-up's card on a device with no voice, in both themes | 1480 | 2620 | 56% | passed | 69 passed, 0 failed |
| 13o/13 a browser too old for the app sees a note, and the page uses nothing newer than it names | 192 | 420 | 46% | passed | 36 passed, 0 failed |
| 13p/13 a student signed out after fifteen quiet minutes | 92 | 240 | 38% | passed | 15 passed, 0 failed |
| 13q/13 a lesson's look proves itself, screen by screen | 29 | 60 | 48% | passed | 11 passed, 0 failed |

## Run of 2026-11-16 08:18 CST

Began 2026-11-16 08:18 CST and ended 2026-11-16 11:29 CST, 191 minutes in all. Verdict: CHECKS FAILED - read the lines above.

| Step | Seconds | Limit | Share of limit | Status | Summary line |
|---|---|---|---|---|---|
| 1/13 rules tests | 853 |  |  | passed | 3244 passed, 0 failed |
| 2/13 curriculum coverage | 0 |  |  | passed | 386 passed, 0 failed |
| 3/13 spelling and style | 1 |  |  | passed | 80 passed, 0 failed |
| 3b/13 the rules audit and algorithms match the code | 22 |  |  | passed | 125 passed, 0 failed |
| 3c/13 the pass packet copies its rows word for word | 1 |  |  | passed | 45 passed, 0 failed |
| 3d/13 no floor, count, wait or limit loosened without its DECISIONS line | 7 |  |  | passed | 9 passed, 0 failed |
| 3e/13 the rules test's block runner proves itself | 2 |  |  | passed | 8 passed, 0 failed |
| 3f/13 the blind read proves itself | 2 |  |  | passed | 7 passed, 0 failed |
| 3g/13 the planted-defect set builds, leaks nothing and scores as it must | 85 |  |  | failed | 21 passed, 1 failed |
| 4/13 lesson lines and pictures | 17 |  |  | passed | 88 passed, 0 failed |
| 5/13 stories | 1 |  |  | passed | 6939 passed, 0 failed |
| 5b/11 art ledger | 3 |  |  | passed | 48 passed, 0 failed |
| 5c/11 pictures | 0 |  |  | passed | 2 passed, 0 failed |
| 6/13 old backups still restore | 1 |  |  | passed | 21 passed, 0 failed |
| 6b/13 updating a folder from a delivered zip | 0 |  |  | passed | 25 passed, 0 failed |
| 7/13 build | 5 |  |  | passed | no summary line |
| 8/13 render smoke | 4 |  |  | passed | PASS - artifact loads and renders its first screen (63169 chars of HTML) |
| 9/13 syntax | 3 |  |  | passed | no summary line |
| 10/13 browser click-through (about twelve minutes) | 526 | 1500 | 35% | passed | 366 passed, 0 failed |
| 10/13 license codes in the browser | 9 | 120 | 8% | passed | 7 passed, 0 failed |
| 10/13 dragging with a desktop mouse | 31 | 150 | 21% | passed | 14 passed, 0 failed |
| 10/13 changing the educator PIN | 8 | 120 | 7% | passed | 12 passed, 0 failed |
| 10/13 the first week tour, card by card, and pages that open at the top | 200 | 420 | 48% | passed | 130 passed, 0 failed |
| 11/13 back button from every screen, and the words in their boxes on every screen it lands on | 33 | 200 | 17% | passed | 25 passed, 0 failed |
| 12/13 dark theme: every word readable, paper screens light | 52 | 200 | 26% | passed | 85 passed, 0 failed |
| 13/13 standalone page keeps its data | 79 | 150 | 53% | passed | 25 passed, 0 failed |
| 13b/13 the scroll cue on a phone lesson | 40 | 120 | 33% | passed | 16 passed, 0 failed |
| 13c/13 the quick look back and Action Items, walked as a student and an educator | 24 | 240 | 10% | passed | 14 passed, 0 failed |
| 13d/13 game breaks, elective stories and Let's Read, walked as a student and an educator | 249 | 600 | 42% | passed | 91 passed, 0 failed |
| 13e/13 question pictures, More Info, the Wonder pictures and the read-along | 2647 | 4000 | 66% | passed | 149 passed, 0 failed |
| 13f/13 a game's welcome and its demonstration | 797 | 1800 | 44% | passed | 79 passed, 0 failed |
| 13g/13 every game on the narrowest phone, in a wider font, after a wrong tap | 203 | 600 | 34% | passed | 160 games at 1 sizes (160 opened, wide font, 43 read after a wrong tap): 0 problems |
| 13h/13 every word in every drawn picture, in both themes | 361 | 900 | 40% | passed | 9 passed, 0 failed |
| 13i/13 the reading lists' Details, in both themes | 35 | 240 | 15% | passed | 10 passed, 0 failed |
| 13j/13 every pre-K line and question on a short phone, in both themes | 1848 | 3100 | 60% | passed | 23 passed, 0 failed |
| 13k/13 every drawing on an answer tile, at its edge, in both themes | 276 | 480 | 58% | passed | 3 passed, 0 failed |
| 13l/13 every drawing on the dark theme's lesson paper, at its edge | 661 | 1030 | 64% | passed | 8 passed, 0 failed |
| 13m/13 no word under the scroll cue on a short phone, in both themes | 545 | 1020 | 53% | passed | 49 passed, 0 failed |
| 13n/13 the grown-up's card on a device with no voice, in both themes | 1489 | 2620 | 57% | passed | 69 passed, 0 failed |
| 13o/13 a browser too old for the app sees a note, and the page uses nothing newer than it names | 190 | 420 | 45% | passed | 36 passed, 0 failed |
| 13p/13 a student signed out after fifteen quiet minutes | 91 | 240 | 38% | passed | 15 passed, 0 failed |
| 13q/13 a lesson's look proves itself, screen by screen | 30 | 60 | 50% | passed | 8 passed, 0 failed |

## Run of 2026-11-16 02:14 CST

Began 2026-11-16 02:14 CST and ended 2026-11-16 05:21 CST, about 187 minutes in all. Verdict: ALL CHECKS PASSED. Seeded in pass NQ from pass NP's DECISIONS entry (its check.sh bullet): its seconds were not measured, its counts are those the entry lists, and its limits are check.sh's as pass NP delivered it.

| Step | Seconds | Limit | Share of limit | Status | Summary line |
|---|---|---|---|---|---|
| 1/13 rules tests | not recorded |  |  | passed | 3243 passed, as DECISIONS gives it |
| 2/13 curriculum coverage | not recorded |  |  | passed | passed; DECISIONS gives no count |
| 3/13 spelling and style | not recorded |  |  | passed | passed; DECISIONS gives no count |
| 3b/13 the rules audit and algorithms match the code | not recorded |  |  | passed | 122 passed, as DECISIONS gives it |
| 3c/13 the pass packet copies its rows word for word | not recorded |  |  | passed | 45 passed, as DECISIONS gives it |
| 4/13 lesson lines and pictures | not recorded |  |  | passed | 85 passed, as DECISIONS gives it |
| 5/13 stories | not recorded |  |  | passed | 6939 passed, as DECISIONS gives it |
| 5b/11 art ledger | not recorded |  |  | passed | passed; DECISIONS gives no count |
| 5c/11 pictures | not recorded |  |  | passed | passed; DECISIONS gives no count |
| 6/13 old backups still restore | not recorded |  |  | passed | passed; DECISIONS gives no count |
| 6b/13 updating a folder from a delivered zip | not recorded |  |  | passed | passed; DECISIONS gives no count |
| 7/13 build | not recorded |  |  | passed | passed; DECISIONS gives no count |
| 8/13 render smoke | not recorded |  |  | passed | passed; DECISIONS gives no count |
| 9/13 syntax | not recorded |  |  | passed | passed; DECISIONS gives no count |
| 10/13 browser click-through (about twelve minutes) | not recorded | 1500 |  | passed | 366 passed, as DECISIONS gives it |
| 10/13 license codes in the browser | not recorded | 120 |  | passed | passed; DECISIONS gives no count |
| 10/13 dragging with a desktop mouse | not recorded | 150 |  | passed | passed; DECISIONS gives no count |
| 10/13 changing the educator PIN | not recorded | 120 |  | passed | passed; DECISIONS gives no count |
| 10/13 the first week tour, card by card, and pages that open at the top | not recorded | 420 |  | passed | passed; DECISIONS gives no count |
| 11/13 back button from every screen, and the words in their boxes on every screen it lands on | not recorded | 200 |  | passed | 25 passed, as DECISIONS gives it |
| 12/13 dark theme: every word readable, paper screens light | not recorded | 200 |  | passed | passed; DECISIONS gives no count |
| 13/13 standalone page keeps its data | not recorded | 150 |  | passed | passed; DECISIONS gives no count |
| 13b/13 the scroll cue on a phone lesson | not recorded | 120 |  | passed | passed; DECISIONS gives no count |
| 13c/13 the quick look back and Action Items, walked as a student and an educator | not recorded | 240 |  | passed | passed; DECISIONS gives no count |
| 13d/13 game breaks, elective stories and Let's Read, walked as a student and an educator | not recorded | 600 |  | passed | passed; DECISIONS gives no count |
| 13e/13 question pictures, More Info, the Wonder pictures and the read-along | not recorded | 4000 |  | passed | 149 passed, as DECISIONS gives it |
| 13f/13 a game's welcome and its demonstration | not recorded | 1800 |  | passed | 79 passed, as DECISIONS gives it |
| 13g/13 every game on the narrowest phone, in a wider font, after a wrong tap | not recorded | 600 |  | passed | 160 games with no problem, as DECISIONS gives it |
| 13h/13 every word in every drawn picture, in both themes | not recorded | 900 |  | passed | passed; DECISIONS gives no count |
| 13i/13 the reading lists' Details, in both themes | not recorded | 240 |  | passed | passed; DECISIONS gives no count |
| 13j/13 every pre-K line and question on a short phone, in both themes | not recorded | 3100 |  | passed | 23 passed, as DECISIONS gives it |
| 13k/13 every drawing on an answer tile, at its edge, in both themes | not recorded | 480 |  | passed | 3 passed, as DECISIONS gives it |
| 13l/13 every drawing on the dark theme's lesson paper, at its edge | not recorded | 1030 |  | passed | 8 passed, as DECISIONS gives it |
| 13m/13 no word under the scroll cue on a short phone, in both themes | not recorded | 1020 |  | passed | 49 passed, as DECISIONS gives it |
| 13n/13 the grown-up's card on a device with no voice, in both themes | not recorded | 2620 |  | passed | 69 passed, as DECISIONS gives it |
| 13o/13 a browser too old for the app sees a note, and the page uses nothing newer than it names | not recorded | 420 |  | passed | passed; DECISIONS gives no count |
| 13p/13 a student signed out after fifteen quiet minutes | not recorded | 240 |  | passed | passed; DECISIONS gives no count |
