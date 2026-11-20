#!/usr/bin/env bash
# The one check to run after ANY change. Ends with "ALL CHECKS PASSED" or a failure.
set -u
cd "$(dirname "$0")"
fail=0
# Each browser step runs under a time limit through run (pass MT). A limit is there to catch a hang, not a slow machine (pass KU's
# rule), yet twice a limit set from an older, shorter run stopped a passing one: the click-through at 480 seconds in pass KU, and at
# 720 in pass MT, after 348 of its 354 checks, where its log read like a crash. run names a step stopped at its limit in plain words
# (the step's last line), and slow notes a step that used more than two thirds of its limit, so the limit is raised to about twice
# the step's time before it stops a passing run. Both kinds of line gather in the file slow_file names and print again just before
# the verdict. tests/docs-sync.test.mjs runs both helpers from this file, the click-through's 695 seconds of 720 among its cases.
slow_file=/tmp/edu_slow.txt; : > "$slow_file"
slow() { if [ $(($2 * 3)) -gt $(($3 * 2)) ]; then echo "NOTE: $1 took $2 of its $3 seconds; raise its limit in check.sh to about twice its time (pass MT)" >> "$slow_file"; fi; }
# Since pass NQ run also writes its command's exit code and its limit for the step's record (step, below), to a file, since run often
# sits in a pipeline, a subshell whose variables the main shell never sees.
run() { local name=$1 limit=$2 began=$SECONDS code; shift 2; timeout "$limit" "$@"; code=$?; echo "$code $limit" > "${step_run_file:-/dev/null}"
  if [ "$code" = 124 ]; then echo "TIMEOUT: $name was stopped at its $limit-second limit, a hang or a machine slower than the limit allows; read its last lines" | tee -a "$slow_file"
  else slow "$name" $((SECONDS - began)) "$limit"; fi; return "$code"; }
# check.sh's step times (pass NQ, EARMARKS L20): every step, plain or run under a limit, is timed, so a step's growth is seen and a raised
# limit carries its cause. step opens a step and echoes its name, as each step's own echo did before; the next step, or the end, closes
# it and records its name, its seconds, its limit and its command's exit code where run timed it, whether check.sh failed it (failed
# sets fail, as fail=1 did, and marks the step) and its summary line, the last line of the file the step tees, the line its verdict
# reads. While the steps run the record goes only to times_file in /tmp, never into the project, since a step reads the tree (pass MT's
# third run failed when a doc changed mid-run). Once the verdict line is printed, times_write hands the record to tools/check-times.mjs,
# which adds the run, newest first, to the file CHECK_TIMES_FILE names, and only then: since round one's code read of pass NQ (the lead's
# decision) a pass's own runs set it to the project's file (CHECK_TIMES_FILE=<the project>/docs/CHECK-TIMES.md ./check.sh), and a run
# without it, as a run in Mikey's folder is, says so on one line before the verdict and leaves docs/CHECK-TIMES.md as it was, since
# tools/update-from-zip.sh refuses while anything is uncommitted and another machine's times would mix with the pass machine's in the
# medians. The writer prints nothing, so the verdict stays the log's last line; if it cannot write, a NOTE says so and the verdict is
# printed again under it. finish ends the run. tests/docs-sync.test.mjs runs these helpers from this file on a fake run of three steps
# (one passing, one failing, one stopped at its limit), once with CHECK_TIMES_FILE naming a temporary file and once without it, and reads
# what each leaves.
times_file=/tmp/edu_times.txt; step_run_file=/tmp/edu_step_run.txt; times_log=/tmp/edu_times_write.log; step_name=''
printf 'began\t%s\t%s\n' "$(date +%s)" "$(date '+%Y-%m-%d %H:%M %Z')" > "$times_file"
step_end() { [ -n "$step_name" ] || return 0; local code='' limit='' line=''; if [ -s "$step_run_file" ]; then read -r code limit < "$step_run_file"; fi
  if [ -n "$step_summary" ] && [ -s "$step_summary" ]; then line=$(tail -n 1 "$step_summary"); fi
  printf 'step\t%s\t%s\t%s\t%s\t%s\t%s\n' "$step_name" "$((SECONDS - step_began))" "$limit" "$code" "$step_fail" "${line//$'\t'/ }" >> "$times_file"; step_name=''; }
step() { step_end; step_name=$1; step_summary=${2:-}; step_began=$SECONDS; step_fail=0; : > "$step_run_file"; echo "$1"; }
failed() { fail=1; step_fail=1; }
times_write() { step_end; printf 'ended\t%s\t%s\t%s\t%s\n' "$(date +%s)" "$(date '+%Y-%m-%d %H:%M %Z')" "$SECONDS" "$1" >> "$times_file"; [ -n "${CHECK_TIMES_FILE:-}" ] || return 0
  node tools/check-times.mjs --write "$times_file" --into "$CHECK_TIMES_FILE" > "$times_log" 2>&1 || { echo "NOTE: this run's step times were not written to $CHECK_TIMES_FILE; read $times_log"; echo "$1"; }; }
# The end of a run: the last step is closed first, so its seconds stop at its own end; a step stopped at its limit, or one past two
# thirds of it (run and slow, above), is named again; a run with no CHECK_TIMES_FILE says on one line that its times were not recorded,
# and why; then the verdict, the log's last line, and after it the run's step times (times_write). Its status is the verdict's.
finish() { step_end; [ -s "$slow_file" ] && cat "$slow_file"
  [ -n "${CHECK_TIMES_FILE:-}" ] || echo "NOTE: this run's step times were not recorded: CHECK_TIMES_FILE is not set, and only a pass's own runs set it, so a run outside a pass leaves docs/CHECK-TIMES.md as it was and its times out of the medians (its record is in $times_file)"
  if [ "$fail" = 0 ]; then verdict="ALL CHECKS PASSED"; else verdict="CHECKS FAILED - read the lines above"; fi
  echo "$verdict"; times_write "$verdict"; [ "$fail" = 0 ]; }
# The rules test runs in a heap of 4 GB: since pass NR its parts hold more than Node's default of about 2 GB, and pass NR's final run of
# 1:48 PM on November 17 stopped in this step at 1,043 seconds, out of memory, its last line a PASS line, so the step failed. A machine
# with less memory to give stops the same way.
step "1/13 rules tests" /tmp/edu_t.txt;  node --max-old-space-size=4096 tests/logic.test.mjs | tail -1 | tee /tmp/edu_t.txt; grep -q " 0 failed" /tmp/edu_t.txt || failed
step "2/13 curriculum coverage" /tmp/edu_c.txt; node tests/coverage.test.mjs | grep -E 'FAIL|NOTE|passed' | tee /tmp/edu_c.txt; grep -q " 0 failed" /tmp/edu_c.txt || failed
step "3/13 spelling and style" /tmp/edu_sp.txt; node tests/spelling.test.mjs | tail -1 | tee /tmp/edu_sp.txt; grep -q " 0 failed" /tmp/edu_sp.txt || failed
step "3b/13 the rules audit and algorithms match the code" /tmp/edu_ds.txt; node tests/docs-sync.test.mjs | tail -1 | tee /tmp/edu_ds.txt; grep -q " 0 failed" /tmp/edu_ds.txt || failed
# The pass packet (Q95, Mikey's answer in pass NH: "Q95 - A"), since pass NS (Q120, "Q120 - A") a task packet for each agent, read whole,
# in place of the lead's one packet: every copied line held to its file byte for byte, and a packet made with --all holding every line once.
step "3c/13 the pass packet copies its rows word for word" /tmp/edu_pp.txt; node tests/pass-packet.test.mjs | tail -1 | tee /tmp/edu_pp.txt; grep -q " 0 failed" /tmp/edu_pp.txt || failed
# The guard against a fix made by weakening (pass NQ, EARMARKS L20, Mikey's answer to Q113): a floor lowered, a pinned count lowered, a
# wait or a kept exception added, a limit raised or a step's count of checks fallen since the baseline (tests/fixtures/floor-baseline.json)
# fails unless the newest DECISIONS entry names it with its new value; its header says the form and how a pass's end sets the baseline.
step "3d/13 no floor, count, wait or limit loosened without its DECISIONS line" /tmp/edu_fg.txt; node tests/floor-guard.test.mjs | tail -1 | tee /tmp/edu_fg.txt; grep -q " 0 failed" /tmp/edu_fg.txt || failed
# The lead's scratch tools, in the tree since pass NQ (EARMARKS L26, Mikey's answer to Q113): the rules test's block runner and the
# blind read prove themselves on made cases, so a brief can name them and no chat builds them again (about four seconds together by the
# lead's measure). Since round one's code read of pass NQ each runs under a limit through run: the block runner's self-test took 4 seconds
# and the blind read's 3 on the pass's two-CPU machine beside a check.sh run with its browsers, so each limit is 60 seconds, many times its
# time, since about twice a few seconds would stop a passing run on a busy machine and a limit is there to catch a hang (pass KU's rule).
step "3e/13 the rules test's block runner proves itself" /tmp/edu_rb.txt; run "the block runner's self-test" 60 node tools/rules-block.mjs --selftest 2>&1 | tail -1 | tee /tmp/edu_rb.txt; grep -q " 0 failed" /tmp/edu_rb.txt || failed
step "3f/13 the blind read proves itself" /tmp/edu_br.txt; run "the blind read's self-test" 60 node tools/blind-read.mjs --selftest 2>&1 | tail -1 | tee /tmp/edu_br.txt; grep -q " 0 failed" /tmp/edu_br.txt || failed
# The planted-defect set (pass NQ, EARMARKS L19, Mikey's answer to Q113): its self-test builds a copy, checks every wording lands once,
# that no file of the set reaches the copy and no old words leak, and scores made reports as it must (about a minute and a half). Since
# round one's code read of pass NQ it runs under a limit through run: 147 seconds on the pass's two-CPU machine beside a check.sh run
# with its browsers (about 110 beside other jobs, the lead's measure), so its limit is 300, about twice its time (run, above).
step "3g/13 the planted-defect set builds, leaks nothing and scores as it must" /tmp/edu_pl.txt; run "the planted-defect set's self-test" 300 node tools/planted-set.mjs --selftest 2>&1 | tail -1 | tee /tmp/edu_pl.txt; grep -q " 0 failed" /tmp/edu_pl.txt || failed
step "4/13 lesson lines and pictures" /tmp/edu_sc.txt; node tests/scripts.test.mjs | tail -1 | tee /tmp/edu_sc.txt; grep -q " 0 failed" /tmp/edu_sc.txt || failed
step "5/13 stories" /tmp/edu_st.txt;      node tests/stories.test.mjs | tail -1 | tee /tmp/edu_st.txt; grep -q " 0 failed" /tmp/edu_st.txt || failed
step "5b/11 art ledger" /tmp/edu_le.txt;  node tests/ledger.test.mjs | tail -1 | tee /tmp/edu_le.txt; grep -q " 0 failed" /tmp/edu_le.txt || failed
step "5c/11 pictures" /tmp/edu_pi.txt;    node tests/pictures.test.mjs | tail -1 | tee /tmp/edu_pi.txt; grep -q " 0 failed" /tmp/edu_pi.txt || failed
step "6/13 old backups still restore" /tmp/edu_b.txt; node tests/backup-forever.test.mjs | tail -1 | tee /tmp/edu_b.txt; grep -q " 0 failed" /tmp/edu_b.txt || failed
step "6b/13 updating a folder from a delivered zip" /tmp/edu_up.txt; node tests/update-from-zip.test.mjs | tail -1 | tee /tmp/edu_up.txt; grep -q " 0 failed" /tmp/edu_up.txt || failed
step "7/13 build";        ./build.sh || failed
step "8/13 render smoke" /tmp/edu_s.txt; npx tsx tests/render.smoke.test.mjs 2>&1 | grep -E "^(PASS|FAIL)" | tail -1 | tee /tmp/edu_s.txt; grep -q "^PASS" /tmp/edu_s.txt || failed
step "9/13 syntax" /tmp/edu_x.txt;       tsc --noEmit --allowJs --jsx preserve --target es2022 --module esnext --moduleResolution bundler dist/edusphere-prototype.jsx 2>&1 | grep -v "Cannot find module 'react'" | tee /tmp/edu_x.txt; [ -s /tmp/edu_x.txt ] && failed
# The click-through keeps its whole log in /tmp/edu_click_through.log, so a failure can be read in full (pass HC).
# Its timeout was 720 seconds from pass KU (on a one-CPU sandbox the 308 checks took 539 seconds and the old 480 killed a passing
# run at check 271; the timeout is there to catch a hang, not a slow machine). In pass MT the 354 checks took about eleven and a
# half minutes run alone on a two-CPU machine, and the 720 stopped a passing run after 348 of them, so the limit is 1500 seconds,
# about twice its time (run, above).
step "10/13 browser click-through (about twelve minutes)" /tmp/edu_e.txt; node tests/e2e/make-page.mjs >/dev/null && run "the click-through" 1500 node tests/e2e/click-through.mjs > /tmp/edu_click_through.log 2>&1; tail -1 /tmp/edu_click_through.log | tee /tmp/edu_e.txt; grep -q " 0 failed" /tmp/edu_e.txt || failed
# The license codes in the browser (tests/e2e/license.mjs, a new check in pass DW): no record pass NQ found gives the time its 120-second
# limit was set from (check.sh's comments, DECISIONS, CLAUDE-HISTORY, RULES-AUDIT and its history were searched); its times are in
# docs/CHECK-TIMES.md from pass NQ on.
step "10/13 license codes in the browser" /tmp/edu_lic.txt; run "the license codes" 120 node tests/e2e/license.mjs 2>&1 | tail -1 | tee /tmp/edu_lic.txt; grep -q " 0 failed" /tmp/edu_lic.txt || failed
# Dragging with a desktop mouse (tests/e2e/drag.mjs, a new check in pass EF): no record pass NQ found gives the time its 150-second limit
# was set from (the same search); its times are in docs/CHECK-TIMES.md from pass NQ on.
step "10/13 dragging with a desktop mouse" /tmp/edu_drag.txt; run "dragging" 150 node tests/e2e/drag.mjs 2>&1 | tail -1 | tee /tmp/edu_drag.txt; grep -q " 0 failed" /tmp/edu_drag.txt || failed
# Changing the educator PIN (tests/e2e/educator.mjs, a new check in pass EH): no record pass NQ found gives the time its 120-second limit
# was set from (the same search); its times are in docs/CHECK-TIMES.md from pass NQ on.
step "10/13 changing the educator PIN" /tmp/edu_educator.txt; run "the educator PIN" 120 node tests/e2e/educator.mjs 2>&1 | tail -1 | tee /tmp/edu_educator.txt; grep -q " 0 failed" /tmp/edu_educator.txt || failed
# The first week tour, card by card: about three and a half minutes in pass MT's fourth run, past two thirds of the five minutes its
# limit was, so the limit is seven, about twice its time (run, above).
step "10/13 the first week tour, card by card, and pages that open at the top" /tmp/edu_tour.txt; run "the tour" 420 node tests/e2e/tour.mjs 2>&1 | tail -1 | tee /tmp/edu_tour.txt; grep -q " 0 failed" /tmp/edu_tour.txt || failed
# Since round three of pass MR the back sweep also reads every screen it lands on for words that spill or sit off center beside an
# icon (tests/e2e/layout-check.mjs), the games being read in 13g. No record pass NQ found gives the time its 200-second limit was set from
# (check.sh's comments, DECISIONS, CLAUDE-HISTORY, RULES-AUDIT and its history; the sweep is first named in DECISIONS' entry of the
# improvements built on 2026-09-04); its times are in docs/CHECK-TIMES.md from pass NQ on.
step "11/13 back button from every screen, and the words in their boxes on every screen it lands on" /tmp/edu_back.txt; run "the back sweep" 200 node tests/e2e/back-sweep.mjs 2>&1 | tail -1 | tee /tmp/edu_back.txt; grep -q " 0 failed" /tmp/edu_back.txt || failed
# The dark theme (tests/e2e/dark-contrast.mjs, a new check in pass CQ): no record pass NQ found gives the time its 200-second limit was
# set from (the same search); its times are in docs/CHECK-TIMES.md from pass NQ on.
step "12/13 dark theme: every word readable, paper screens light" /tmp/edu_dark.txt; run "the dark theme" 200 node tests/e2e/dark-contrast.mjs 2>&1 | tail -1 | tee /tmp/edu_dark.txt; grep -q " 0 failed" /tmp/edu_dark.txt || failed
# Since pass NF (EARMARKS A100) the standalone page check opens a lesson in a frame as tall as the page, on a phone and on a laptop, and
# reads where the scroll cue stands as the page around the frame scrolls: about 70 seconds where it took about 46, so its limit is 150.
step "13/13 standalone page keeps its data" /tmp/edu_site.txt; run "the standalone page" 150 node tests/site.test.mjs 2>&1 | tail -1 | tee /tmp/edu_site.txt; grep -q " 0 failed" /tmp/edu_site.txt || failed
# The scroll cue on a phone lesson (tests/e2e/scroll-cue.mjs, a new check in pass KA): no record pass NQ found gives the time its
# 120-second limit was set from (the same search); its times are in docs/CHECK-TIMES.md from pass NQ on.
step "13b/13 the scroll cue on a phone lesson" /tmp/edu_cue.txt; run "the scroll cue" 120 node tests/e2e/scroll-cue.mjs 2>&1 | tail -1 | tee /tmp/edu_cue.txt; grep -q " 0 failed" /tmp/edu_cue.txt || failed
# The quick look back and Action Items (tests/e2e/review-walk.mjs, a new check in pass LM): no record pass NQ found gives the time its
# 240-second limit was set from (the same search); its times are in docs/CHECK-TIMES.md from pass NQ on.
step "13c/13 the quick look back and Action Items, walked as a student and an educator" /tmp/edu_review.txt; run "the quick look back" 240 node tests/e2e/review-walk.mjs 2>&1 | tail -1 | tee /tmp/edu_review.txt; grep -q " 0 failed" /tmp/edu_review.txt || failed
# Game breaks, elective stories and an early learner's Let's Read (pass MB): about three minutes since pass MF (a reader's
# celebration and the cover shelf joined it), since a second read of a story must stay open STORY_REREAD_SECONDS with its
# end in view before it counts; the timeout was seven minutes, to catch a hang rather than a slow machine (pass KU's rule). It took
# about four and a quarter minutes in pass MT's fourth run, so the limit is ten, about twice its time (run, above).
step "13d/13 game breaks, elective stories and Let's Read, walked as a student and an educator" /tmp/edu_play.txt; run "play and read" 600 node tests/e2e/play-and-read.mjs 2>&1 | tail -1 | tee /tmp/edu_play.txt; grep -q " 0 failed" /tmp/edu_play.txt || failed
# Bigger question pictures with answer buttons kept their size, More Info, the Wonder portraits and pondering pictures, and the
# read-along's lit sentence (pass MH, from Mikey's notes): about a minute then, and since pass MO (the directions, the ring in both
# themes, the voice cards' back, the four corners, More Info's paper boxes) about five and a half minutes on its own, past the five
# its timeout was; the timeout was then twelve, to catch a hang rather than a slow machine (pass KU's rule). It took about nine and
# a half minutes in pass MT's fourth run, so the limit is twenty, about twice its time (run, above). Pass NC's sections (the one-breath
# keys, the Wonder tiles at six widths, the picture and dots columns, kept runs at rest, and the cue and the title at 320 and 340) took it
# to about sixteen minutes alone, so the limit is thirty-three. Pass ND's took it to about twenty-one minutes, and pass NE's two (section
# 16, a lesson's own letters and print at five tablet and laptop sizes, and section 17, a hyphenated word kept whole at six widths, each
# in both themes) about three and a half more, past two thirds of thirty-three, so the limit is fifty, about twice its time. Since round
# one's screen read section 18 (sixteen lesson lines' last words at six widths, in both themes) adds about two minutes alone (123
# seconds in round two's code read), and fifty minutes is still about twice the step's time. Pass NF's (section 16 widened, 16b, 16c and
# 16d, Q90's four colors and a counted row's edge as drawn) took it to 2,019 seconds in the pass's first full run, past two thirds of fifty
# minutes, so the limit is 4,000 seconds, about twice its time.
step "13e/13 question pictures, More Info, the Wonder pictures and the read-along" /tmp/edu_qs.txt; run "the question screens" 4000 node tests/e2e/question-screens.mjs 2>&1 | tail -1 | tee /tmp/edu_qs.txt; grep -q " 0 failed" /tmp/edu_qs.txt || failed
# A game's spoken welcome and its demonstration (pass MP, Mikey's notes of October 26, 2026): a tile opens on it, a child's own taps
# wait, the play clock waits, Begin, Skip, the round arrow, the Instructions link, the speaker, a visit after leaving, a computer's
# key press and numbers, and less motion; since round two two short screens played whole and the claude.ai preview's page-tall frame.
# About eight minutes at the test's pace (6 min 53 s and 7 min 50 s in pass MQ's runs, with its rows and rounds); since pass MS about
# twelve (9 min 52 s in its round two's run, and round three's block that watches eight walks reach their goals about two and a half
# more), so the timeout was twenty, to catch a hang rather than a slow machine (pass KU's rule). In pass MT's fourth run it took
# 13 min 26 s, past two thirds of that, so the limit is thirty, about twice its time (run, above).
step "13f/13 a game's welcome and its demonstration" /tmp/edu_intro.txt; run "the welcomes" 1800 node tests/e2e/game-intro.mjs 2>&1 | tail -1 | tee /tmp/edu_intro.txt; grep -q " 0 failed" /tmp/edu_intro.txt || failed
# Every game on the narrowest phone, in a typeface a tenth wider than the test browser's, and again after a wrong tap on every
# board that names its answer (pass MR, from Mikey's answer to Q72: "I never want this to happen anywhere in the app and try to
# correct every example I find."): a word that spills out of its box, or centered words an icon pushes off center, fails, and so
# does a game that never opens, a missed planted fault (a spilled tile and an off-center row, planted in the first game) or a
# wide typeface that is not really drawn. The games where no wrong tap can be made are listed, not failed. About four minutes;
# the timeout is ten. The full sweep at eight sizes is tools/layout-sweep.mjs on its own (its header says how).
step "13g/13 every game on the narrowest phone, in a wider font, after a wrong tap" /tmp/edu_layout.txt; run "the layout sweep" 600 node tools/layout-sweep.mjs --wide-font --wrong --sizes=320x568 > /tmp/edu_layout.log 2>&1; layout=$?; tail -1 /tmp/edu_layout.log | tee /tmp/edu_layout.txt; [ "$layout" = 0 ] && grep -q ": 0 problems" /tmp/edu_layout.txt || failed
# Every word in every drawn picture, the question pictures in the app, every lesson picture and every different picture a question
# bank draws over 300 seeds, in both themes (pass MR, the same answer of Mikey's): a word past its picture's edge, words on top of
# each other, a line through a word, or a word too faint against what is under it fails, and so does a question's picture that shows
# its own answer. About seven and a half minutes; the timeout is fifteen. It runs with tsx, since the lesson pictures are drawn from
# the built file.
step "13h/13 every word in every drawn picture, in both themes" /tmp/edu_words.txt; run "the drawn pictures' words" 900 npx tsx tests/e2e/diagram-words.mjs 2>&1 | tail -1 | tee /tmp/edu_words.txt; grep -q " 0 failed" /tmp/edu_words.txt || failed
# The reading lists' Details (pass MR, Mikey's books): every list's books in order, each with its Details button and a short rule
# between every two; one book a list opens exactly its summary under its title and author, and Got it, the dimmed page and Escape
# each close it; nothing runs past the screen's edge. Both themes, about forty seconds.
step "13i/13 the reading lists' Details, in both themes" /tmp/edu_books.txt; run "the reading lists' Details" 240 node tests/e2e/book-details.mjs 2>&1 | tail -1 | tee /tmp/edu_books.txt; grep -q " 0 failed" /tmp/edu_books.txt || failed
# Every read-aloud pre-K lesson line's Next and every pre-K bank's Check answer above a 375 by 667 phone's fold (pass MY, round one's
# screen check), the older ones waiting by name until pass MZ, in the light theme and then the dark one since round two's code read; since pass MZ
# every bank at six seeds as a child sees it, each line's row at two sizes and the scroll cue at 320 by 568, and since its round two
# every line with a painting again, with a stand-in painting in place: about 22 minutes beside another step (eighteen before the
# paintings, eleven before pass MZ), so its limit is about twice that. Since pass NE (its two lessons and ten banks, the scroll cue's
# room and the lone-word reads) about 26 minutes (1,539 seconds beside four readers, round two's code read), so 3,100 seconds.
step "13j/13 every pre-K line and question on a short phone, in both themes" /tmp/edu_fold.txt; run "the fold check" 3100 node tests/e2e/fold-check.mjs 2>&1 | tail -1 | tee /tmp/edu_fold.txt; grep -q " 0 failed" /tmp/edu_fold.txt || failed
# Every drawing a bank puts on an answer tile reads at its edge on the resting, right and wrong tiles of both themes (pass ND, EARMARKS
# A89, the screen read), none waiting, every kind of drawing read since round one's code check: about three minutes alone, so its limit of
# eight minutes is about twice its time beside another step. Since round three's screen read of pass NR its ink check (every tile's painted
# ink on Words all around us's thirty screens of which one has a word on it, or none, in both sizes and themes) took it to 326 seconds
# alone, past two thirds of eight minutes, so the limit is eleven minutes, about twice its time (pass MT).
step "13k/13 every drawing on an answer tile, at its edge, in both themes" /tmp/edu_edges.txt; run "the tile edges" 660 node tests/e2e/tile-edges.mjs 2>&1 | tail -1 | tee /tmp/edu_edges.txt; grep -q " 0 failed" /tmp/edu_edges.txt || failed
# Every drawing a lesson's line or a question's own picture puts on the dark theme's light paper reads at its edge (pass NE, EARMARKS A92,
# found by the screen read beyond A89's tiles; the light theme's paper is white, a light tile's color, which 13k reads), none waiting,
# and every kind a lesson or a question shows read or left out by name: about two and a half minutes alone, so its limit of five
# minutes was about twice its time. Since pass NF (EARMARKS A98) it reads the 31 kinds of diagram too, their guides aside, More Info's
# paper boxes and the paper's palette, about eight and a half minutes alone, so its limit is about twice that.
step "13l/13 every drawing on the dark theme's lesson paper, at its edge" /tmp/edu_paper.txt; run "the paper edges" 1030 node tests/e2e/paper-edges.mjs 2>&1 | tail -1 | tee /tmp/edu_paper.txt; grep -q " 0 failed" /tmp/edu_paper.txt || failed
# No word of a pre-K lesson line, its say-along strip or a practice round's feedback lies under the scroll cue on a short phone (pass NE,
# EARMARKS A63, the screen read): every read-aloud pre-K lesson line at 320 by 568 and 375 by 667 in both themes, and every pre-K bank
# after a first wrong tap and the right one, each of its six seeds in one of the four in turn, with the fix undone in the page caught on
# every screen where the cue shows: about four and a half minutes alone, and since round one's screen read, which added the feedback read
# every frame with the motion on and Say it again, about five and a half (330 seconds beside four readers; 278 alone since the third read's phone turned during a wobble), so its limit was eleven. Since pass NF (EARMARKS A99 and A103) it reads
# every read-aloud course's lines, the story pages with no voice and three with the voice, the questions before a pick, the say-along word
# and the long pairs too: 369 seconds alone on pass NF's merged copy (379 on the engineer's), so its limit was 760, about twice. Pass NJ's
# run took 510 of the 760 (its NOTE), so its limit is 1020, about twice that.
# Since pass NH the cue's words keep their whole log in /tmp/edu_cue_words.log, as the click-through does, since check.sh's first run of
# that pass ended 48 passed, 1 failed here, with the failing check's own line lost to tail, and the step run alone passed all 49.
step "13m/13 no word under the scroll cue on a short phone, in both themes" /tmp/edu_cuewords.txt; run "the cue's words" 1020 node tests/e2e/cue-words.mjs > /tmp/edu_cue_words.log 2>&1; tail -1 /tmp/edu_cue_words.log | tee /tmp/edu_cuewords.txt; grep -q " 0 failed" /tmp/edu_cuewords.txt || failed
# The grown-up's card on a device with no voice (Q91, Mikey's answer in pass NG: "Q91 - A"): the 24 letters banks show a card with the
# words to say until Ready, the words and the answers never on the screen together, in both themes, and at 320 by 568 (323 seconds alone
# after pass NG's round two, so its limit was 660). Since the third read it walks a phone held sideways too and sweeps the which-sound
# card's way back to its list across every width: 526 seconds alone, past two thirds of 660, so its limit is 1,000, about twice.
# Since pass NH (Q96 (a) and Q97 (a)) it walks 32 banks, where it walked 24, and reads the hiding kinds' cards standing alone: 639 seconds run
# alone, past 60 percent of the 1,000 it had, so its limit is 1,300, about twice its time (run, above).
# Since pass NI (Q98 (a), and Q, V and Y's five) it walks 44 banks: 862 seconds alone beside two reading agents, just under two thirds
# of the 1,300 it had, so its limit is 1,700, about twice.
# Since pass NK (A, E and I's, O and U's and Small letters' fourteen) it walks 58 banks: 1,310 seconds in check.sh's second run, past
# two thirds of the 1,700 it had, so its limit is 2,620, about twice.
step "13n/13 the grown-up's card on a device with no voice, in both themes" /tmp/edu_card.txt; run "the grown-up's card" 2620 node tests/e2e/grown-up-card.mjs 2>&1 | tail -1 | tee /tmp/edu_card.txt; grep -q " 0 failed" /tmp/edu_card.txt || failed
# A browser too old for the app (Q92, Mikey's answer in pass NG: "Q92 - B"): a note in place of the Loading word when the app cannot
# start, never when it can, and nothing in the page newer than the browsers the note names (204 seconds beside the rules test after pass
# NG's round two, so its limit is 420, about twice).
step "13o/13 a browser too old for the app sees a note, and the page uses nothing newer than it names" /tmp/edu_old.txt; run "the too-old note" 420 node tests/e2e/too-old.mjs 2>&1 | tail -1 | tee /tmp/edu_old.txt; grep -q " 0 failed" /tmp/edu_old.txt || failed
# A student signed out after fifteen quiet minutes (pass NJ, Mikey: "Maybe we should have students auto-logged out after a period of
# inactivity kind of like the instructors?"): a browser opened again within fifteen minutes brings the student back and after them does
# not, a note with no time brings no one back, and while the page is open the quiet minutes end the session on the next check, a tap
# starts them again, a page brought back into view ends it at once and the waking touch does nothing else. About a minute and a half
# alone, so its limit of four minutes is about twice its time beside another step.
step "13p/13 a student signed out after fifteen quiet minutes" /tmp/edu_idle.txt; run "the idle sign-out" 240 node tests/e2e/idle-signout.mjs 2>&1 | tail -1 | tee /tmp/edu_idle.txt; grep -q " 0 failed" /tmp/edu_idle.txt || failed
# A lesson's look, screen by screen (tools/lesson-look.mjs, pass NQ, EARMARKS L26): its self-test pictures one pre-K lesson's lines and
# two seeds of its banks at one size and theme from the page step 10 built, none blank and every one in its index. It took about
# 30 seconds run alone in pass NQ, so its limit is 60, about twice its time (run, above).
step "13q/13 a lesson's look proves itself, screen by screen" /tmp/edu_look.txt; run "a lesson's look" 60 node tools/lesson-look.mjs --selftest 2>&1 | tail -1 | tee /tmp/edu_look.txt; grep -q " 0 failed" /tmp/edu_look.txt || failed
# A question's printed words keep a hyphenated word whole (pass NV, round one's screen read: "Do you need a grown- / up to say kind
# words to a sad friend?" at 320 to 364 pixels, and 33 pre-K prompts somewhere from 320 to 440): every pre-K prompt with a hyphenated
# word, shown through the app's own screen at every 8 pixels from 320 to 440 in both themes, with its plain text planted. It took about
# 150 seconds run alone in pass NV, so its limit is 300, about twice its time (run, above).
step "13r/13 a question's printed words keep a hyphenated word whole" /tmp/edu_hyph.txt; run "the question's hyphenated words" 300 node tests/e2e/prompt-hyphens.mjs 2>&1 | tail -1 | tee /tmp/edu_hyph.txt; grep -q " 0 failed" /tmp/edu_hyph.txt || failed
# The run's end (finish, above): a step stopped at its limit, or one past two thirds of it, is named again, then the verdict, and after it
# the run's step times when CHECK_TIMES_FILE is set; the exit code is the verdict's, as before.
finish || exit 1
