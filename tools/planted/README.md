# The planted-defect set

EARMARKS L19, built in pass NQ. Read this before changing the set or running a scored read.

## What it is

Every independent read (docs/INDEPENDENT-CHECKS.md) is one sample of what a reader notices, and the model map (RULES-AUDIT section 9) gives each read to a model as a best guess. The set turns that guess into a measurement. It holds real past mistakes, each taken from the evidence in docs/MISTAKE-CLASSES.md with its DECISIONS line and written in new words into an item other than the one it first hit, beside clean items (controls) and items changed correctly that only sit close to a class (near misses). A reader of one brief reads a built copy as it would read any round, its report is scored by the tool, and the scores pile up so readers and models can be compared over weeks.

Its files are these.

- `tools/planted-set.mjs`, the tool (build a copy, score a report, check the set, test itself).
- `tools/planted/set.json`, the set. Each entry has an id (P plants, K controls, N near misses), its kind, class and harm (plants only, 3 for false, unsafe or unfair to a child, 2 for teaching quality or a test's integrity, 1 for a look or a rework), its brief, the item a reader would name, a short line of what the item is, one or more wordings (each with its edits, every find occurring once in today's file, and the words a catch would use), its origin (the class and the DECISIONS line with a few of its words, and for a near miss the past mistake it sits beside), what makes it a defect or why it is correct (with the house rule and where that rule is written), a fix, a near miss's trap words, what a round changed in it and why (history), a control's known real defects of today's content (known), and the tests it passed on built copies. The set's retired list keeps each id taken out, with why; an id is never used again.
- `tools/planted/scores.json`, one record per scored report.
- `tools/planted/set-r1.json`, the set as round one of pass NQ read it (its copies were built at seed 1 before round one's fixes), with round one's fixed catch words, for scoring round one's reports only. Never build a copy from it.
- `tools/planted/REAL-FINDINGS.md`, the real defects of today's content that scored reads found, each with its item beside the id of the entry that uses the item, which is why it lives here and in no copied record (EARMARKS A154 gives their counts and points to it).

At pass NQ's end the set holds 50 entries for four briefs: the lesson brief (8 plants, 3 near misses, 3 controls), the story brief with the picture brief (9, 2, 3), the Wonder brief (6, 2, 3) and the code brief (7, 1, 3); N04 and N08 are retired. Plants are weighted to the worst harms and to the kinds only judgment finds. Every plant passes every test, since a plant a test catches measures the test, not the reader.

## Why it is kept out of every file a reader loads

A reader who meets the set, or any sign that a copy is a test, reads differently, and the score then means nothing. So the set never reaches a copy. The build leaves out this tool and all of `tools/planted/`, every path .gitignore names (the pages tests/e2e/make-page.mjs makes hold every item as it stood, and leaked 110 times in round one of pass NQ until they were left out), and drops the check.sh step that runs the self-test with the comment block above it, then rewrites every generated doc from the planted source (the ledgers, the prompt sheets, the story audits and the rest, each by its own tool), and puts a one-line stub in place of the files that quote content word for word and that no test the copy must pass reads (docs/DECISIONS.md, the three histories and the built page). Then it reads every file of the copy for each planted item's old words and fails, naming the file, if any is still there.

Keep the set's words out of everything a reader may see: a brief, a read list, a record, a handoff, a chat with a reader. The set lives in the project, so a scored read is always run on a built copy, never on the project.

## How to build a copy

```
node tools/planted-set.mjs --build <out dir> --seed <N>
```

The out dir must not exist yet and must sit outside the project. The build takes under a minute: it copies the project, plants the wording the seed picks for each entry, rewrites the generated docs, stubs the histories and the page, checks for leaks, and writes one read list per brief at the copy's top (READ-LIST-lesson.md, READ-LIST-story.md, READ-LIST-wonder.md, READ-LIST-code.md). Each read list names its items the way the coverage receipt does (`- module <id>`, `- story <S serials>`, `- wonder <id>`, `- file <file> <from>-<to>` for a function, given whole as new code since the copy has no diff), in the seed's order, with a short line of what each is, and nothing that says which is which.

Write the seed down in the lead's own notes (never in the copy), since scoring needs it. `--variant K` forces wording K for every entry that has one, the way the set's own tests try every wording; a scored read uses a seed alone.

After a build, run the light tests in the copy (scripts, stories, spelling, ledger, coverage, pictures). After a change to the set, run the whole rules test once too, under the heavy lock, detached with a log. The docs sync test is not run on a copy, since its records are stubbed. The page is not built in a copy. If a read needs it, build it there (under the heavy lock); it is built from the planted source, so it holds no old words.

## How a scored read is briefed

As a round brief like any other. Name the frozen copy as the project to read and its READ-LIST for the brief as the round's items new this pass, give the brief's own text from docs/INDEPENDENT-CHECKS.md and the usual agent file, and ask for the usual report (MUST FIX, SHOULD CONSIDER, CLEAN and the Opened list). Give it the tool budget a real round of that brief gets.

Never say the copy is a test, planted, seeded or scored, never name the set, L19 or this tool, and never say how many findings to expect. One reader reads one brief. The four briefs may run side by side on one copy. Keep the reader's model and the tokens its run used.

## How to score a report

Save the report to a file, then run

```
node tools/planted-set.mjs --score <report file> --brief <lesson|story|wonder|code> --model <name> --tokens <n> --seed <N>
```

Give the seed the copy was built with (and `--variant` if it had one); `--score` refuses to run without `--seed`. A copy built before the set changed is scored with the set it was built from: `--set <file>` (round one's: `--set tools/planted/set-r1.json --seed 1`), run in a tree whose source is the one that copy was built from (round one's copies came from the tree before the merge, nq-base), since a finding that names a function only by a line number is matched by the line spans of the tree it is scored in. Keep a set file for each round whose wordings changed after it was read. The tool reads the report's MUST FIX and SHOULD CONSIDER items, each with every line and bullet under it (a numbered head's Place, Problem and Fix belong to it), and gives each finding to the items its bold title names, else its first line, else its text (a finding names its own item first and others only to compare). An item is named by its module or Wonder id, a story's title or S serials, a function's name or a file and line inside it, or an alias the set gives. A finding counts as a catch only when it also uses the plant's words: one pattern of two or more words, or two different patterns (one word alone is not enough, since an unrelated complaint uses common words). A finding whose head (its bold title or first line) names no item and whose text names two or more (the batch's looks, names read by ear) is about how items stand together: it counts for a plant only by its words and never makes a false alarm. A name with a capital letter (a lesson's title, a function's name) is matched as written, so a title that is a common word is not found in a sentence that only uses the word. It prints each entry's outcome, every finding that matches no entry and the totals.

- A plant is caught as must fix, caught as should consider, missed, or needs a look.
- A control or a near miss is clean, a false alarm (named in a must fix), a soft false alarm (in a should consider), or needs a look. A finding on a control's known real defect is listed apart, never a false alarm.
- A finding that matches no entry is read by the lead, since it may be a real defect in today's content, and goes to the usual triage.
- The totals are given by count and weighted by harm, with harm 3 apart.

A finding that names an item in words the set does not foresee, or uses an entry's words without naming an item, is "needs a look". The lead reads it and settles it by hand in that run's record in scores.json, changing only the outcome. A false alarm on a control is read the same way: a control is an item read as new, and today's content has real defects of its own (round one of pass NQ found two that several readers named alike, now in K02's and K05's known list). A false alarm that is a real defect is settled as "real finding", sent to the pass's triage, and added to the control's known list (or the defect fixed in the project) before the next build. The result is appended to scores.json unless `--no-save` is given. A difference of two or three catches in thirty is noise, so compare readers and models over many runs, never on one read.

L19's independent critic (a Fable agent shown a read's report and the copy, asked what the read did not open and which of its findings are false) is scored the same way: save its added findings as a report, score it with `--model` naming it as the critic (for example `--model "Fable 5.2 critic"`), and count the harm-3 plants it catches that the read it followed missed, and the false alarms it adds. It is kept only if it adds catches of the worst harms.

## How to rotate the set

Give every scored read a new seed (one more than the last in scores.json). The seed picks one wording for each entry and shuffles each read list, so a later run is not the same test. Every harm-3 plant has at least two wordings, and more wordings can be added to any entry.

## How to grow the set

1. Take a real past mistake from MISTAKE-CLASSES's evidence, with its DECISIONS line, and write it in new words into an item it did not first hit. Give it the next id in its series (an id is never reused) and every field the others have.
2. Each find occurs exactly once in today's file and is not inside its replace. A story's change goes into its words and its audio line alike, a picture's into its ledger row and its alt, and a table a test pins word for word changes in step, as a pass's own lead would write both.
3. Choose items a reader can read cleanly. Wonder items come from the newer early questions and story items from pass NI on, since older ones would draw true findings of rules written since, and lesson plants keep out of pass NP's lessons, which the rules test pins line by line.
4. Give each wording catch words in the scorer's form: the first two or more plain words a catch would quote or use, then more patterns of two or more words, and single words only where two of them together could only describe this defect. Leave out the item's own names and ordinary content words, since every finding about the item holds them. A near miss's trap words follow the same form.
5. Run `node tools/planted-set.mjs --check`, build with `--variant 1` and `--variant 2` (and more if an entry has more wordings), run the light tests on each copy and the whole rules test once on each under the heavy lock. Read the browser tests (tests/e2e) for each plant, since a browser test that would catch it measures the test too (round one: a touch-screen check and a stored-reflection check each saw a code plant's first wording). A plant a test catches is reworked or replaced. Write the tests each entry passed in its tests field.
6. Run `node tools/planted-set.mjs --selftest`.

When content changes under an entry, `--check` (and the self-test in check.sh) names the wording that no longer lands. Rewrite that entry against today's file, or retire it: remove it and add its id to set.json's retired list with why. A near miss a reader rightly flags under another rule of its brief is not clean, so it is reworded or retired the same way (round one retired two).

## The rule for records

A DECISIONS entry, a brief, a handoff or any record describes a scored run only by entry ids and counts (for example, "P07 missed; 21 of 30 plants caught as must fix; one false alarm on K04"), never by an entry's words, its item or its place. scores.json keeps exactly that much: for each run, the brief, the model, the tokens, the seed, the report's file name, the totals and each entry's outcome by id.

## The self-test

```
node tools/planted-set.mjs --selftest
```

About two minutes, light (no rules test, no browser). It checks that every wording of every entry lands once, that a build at seed 1 in a temporary folder plants every edit, carries no file of the set and no check.sh line for it, and leaks nothing, that each read list names every entry of its brief once and says nothing of which is which, that a leak planted in a doc is caught, that seed 2 rotates the set, and that three made reports score as they must for each brief (one naming every plant, every one caught with no false alarm; one flagging a control, one false alarm; an empty one, nothing). It reads a report in the Fable lesson read's shape (a numbered head with Place, Problem and Fix bullets), names every wording of every plant and near miss beside three fixed unrelated complaints and requires needs a look for each, never a catch, drops a made check.sh's step with its comment block, reads .gitignore against what a copy leaves out (and a path added to it, planted), and refuses a relative out dir inside the project. Each guard of the set catches the slip it guards against, planted (a find that occurs twice, an edit a later edit undoes, a find inside its replace, a near miss flagged in its trap words, a read list that says planted). It ends with a line "N passed, M failed".
