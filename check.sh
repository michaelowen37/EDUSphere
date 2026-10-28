#!/usr/bin/env bash
# The one check to run after ANY change. Ends with "ALL CHECKS PASSED" or a failure.
set -u
cd "$(dirname "$0")"
fail=0
echo "1/13 rules tests";  node tests/logic.test.mjs | tail -1 | tee /tmp/edu_t.txt; grep -q " 0 failed" /tmp/edu_t.txt || fail=1
echo "2/13 curriculum coverage"; node tests/coverage.test.mjs | grep -E 'FAIL|NOTE|passed' | tee /tmp/edu_c.txt; grep -q " 0 failed" /tmp/edu_c.txt || fail=1
echo "3/13 spelling and style"; node tests/spelling.test.mjs | tail -1 | tee /tmp/edu_sp.txt; grep -q " 0 failed" /tmp/edu_sp.txt || fail=1
echo "3b/13 the rules audit and algorithms match the code"; node tests/docs-sync.test.mjs | tail -1 | tee /tmp/edu_ds.txt; grep -q " 0 failed" /tmp/edu_ds.txt || fail=1
echo "4/13 lesson lines and pictures"; node tests/scripts.test.mjs | tail -1 | tee /tmp/edu_sc.txt; grep -q " 0 failed" /tmp/edu_sc.txt || fail=1
echo "5/13 stories";      node tests/stories.test.mjs | tail -1 | tee /tmp/edu_st.txt; grep -q " 0 failed" /tmp/edu_st.txt || fail=1
echo "5b/11 art ledger";  node tests/ledger.test.mjs | tail -1 | tee /tmp/edu_le.txt; grep -q " 0 failed" /tmp/edu_le.txt || fail=1
echo "5c/11 pictures";    node tests/pictures.test.mjs | tail -1 | tee /tmp/edu_pi.txt; grep -q " 0 failed" /tmp/edu_pi.txt || fail=1
echo "6/13 old backups still restore"; node tests/backup-forever.test.mjs | tail -1 | tee /tmp/edu_b.txt; grep -q " 0 failed" /tmp/edu_b.txt || fail=1
echo "6b/13 updating a folder from a delivered zip"; node tests/update-from-zip.test.mjs | tail -1 | tee /tmp/edu_up.txt; grep -q " 0 failed" /tmp/edu_up.txt || fail=1
echo "7/13 build";        ./build.sh || fail=1
echo "8/13 render smoke"; npx tsx tests/render.smoke.test.mjs 2>&1 | grep -E "^(PASS|FAIL)" | tail -1 | tee /tmp/edu_s.txt; grep -q "^PASS" /tmp/edu_s.txt || fail=1
echo "9/13 syntax";       tsc --noEmit --allowJs --jsx preserve --target es2022 --module esnext --moduleResolution bundler dist/edusphere-prototype.jsx 2>&1 | grep -v "Cannot find module 'react'" | tee /tmp/edu_x.txt; [ -s /tmp/edu_x.txt ] && fail=1
# The click-through keeps its whole log in /tmp/edu_click_through.log, so a failure can be read in full (pass HC).
# Its timeout is 720 seconds (pass KU): on a one-CPU sandbox the 308 checks took 539 seconds and the old 480 killed a passing
# run at check 271; the timeout is there to catch a hang, not a slow machine.
echo "10/13 browser click-through (six to nine minutes)"; node tests/e2e/make-page.mjs >/dev/null && timeout 720 node tests/e2e/click-through.mjs > /tmp/edu_click_through.log 2>&1; tail -1 /tmp/edu_click_through.log | tee /tmp/edu_e.txt; grep -q " 0 failed" /tmp/edu_e.txt || fail=1
echo "10/13 license codes in the browser"; timeout 120 node tests/e2e/license.mjs 2>&1 | tail -1 | tee /tmp/edu_lic.txt; grep -q " 0 failed" /tmp/edu_lic.txt || fail=1
echo "10/13 dragging with a desktop mouse"; timeout 150 node tests/e2e/drag.mjs 2>&1 | tail -1 | tee /tmp/edu_drag.txt; grep -q " 0 failed" /tmp/edu_drag.txt || fail=1
echo "10/13 changing the educator PIN"; timeout 120 node tests/e2e/educator.mjs 2>&1 | tail -1 | tee /tmp/edu_educator.txt; grep -q " 0 failed" /tmp/edu_educator.txt || fail=1
echo "10/13 the first week tour, card by card, and pages that open at the top"; timeout 300 node tests/e2e/tour.mjs 2>&1 | tail -1 | tee /tmp/edu_tour.txt; grep -q " 0 failed" /tmp/edu_tour.txt || fail=1
# Since round three of pass MR the back sweep also reads every screen it lands on for words that spill or sit off center beside an
# icon (tests/e2e/layout-check.mjs), the games being read in 13g.
echo "11/13 back button from every screen, and the words in their boxes on every screen it lands on"; timeout 200 node tests/e2e/back-sweep.mjs 2>&1 | tail -1 | tee /tmp/edu_back.txt; grep -q " 0 failed" /tmp/edu_back.txt || fail=1
echo "12/13 dark theme: every word readable, paper screens light"; timeout 200 node tests/e2e/dark-contrast.mjs 2>&1 | tail -1 | tee /tmp/edu_dark.txt; grep -q " 0 failed" /tmp/edu_dark.txt || fail=1
echo "13/13 standalone page keeps its data"; timeout 120 node tests/site.test.mjs 2>&1 | tail -1 | tee /tmp/edu_site.txt; grep -q " 0 failed" /tmp/edu_site.txt || fail=1
echo "13b/13 the scroll cue on a phone lesson"; timeout 120 node tests/e2e/scroll-cue.mjs 2>&1 | tail -1 | tee /tmp/edu_cue.txt; grep -q " 0 failed" /tmp/edu_cue.txt || fail=1
echo "13c/13 the quick look back and Action Items, walked as a student and an educator"; timeout 240 node tests/e2e/review-walk.mjs 2>&1 | tail -1 | tee /tmp/edu_review.txt; grep -q " 0 failed" /tmp/edu_review.txt || fail=1
# Game breaks, elective stories and an early learner's Let's Read (pass MB): about three minutes since pass MF (a reader's
# celebration and the cover shelf joined it), since a second read of a story must stay open STORY_REREAD_SECONDS with its
# end in view before it counts; the timeout is seven minutes, to catch a hang rather than a slow machine (pass KU's rule).
echo "13d/13 game breaks, elective stories and Let's Read, walked as a student and an educator"; timeout 420 node tests/e2e/play-and-read.mjs 2>&1 | tail -1 | tee /tmp/edu_play.txt; grep -q " 0 failed" /tmp/edu_play.txt || fail=1
# Bigger question pictures with answer buttons kept their size, More Info, the Wonder portraits and pondering pictures, and the
# read-along's lit sentence (pass MH, from Mikey's notes): about a minute then, and since pass MO (the directions, the ring in both
# themes, the voice cards' back, the four corners, More Info's paper boxes) about five and a half minutes on its own, past the five
# its timeout was; the timeout is twelve, to catch a hang rather than a slow machine (pass KU's rule).
echo "13e/13 question pictures, More Info, the Wonder pictures and the read-along"; timeout 720 node tests/e2e/question-screens.mjs 2>&1 | tail -1 | tee /tmp/edu_qs.txt; grep -q " 0 failed" /tmp/edu_qs.txt || fail=1
# A game's spoken welcome and its demonstration (pass MP, Mikey's notes of October 26, 2026): a tile opens on it, a child's own taps
# wait, the play clock waits, Begin, Skip, the round arrow, the Instructions link, the speaker, a visit after leaving, a computer's
# key press and numbers, and less motion; since round two two short screens played whole and the claude.ai preview's page-tall frame.
# About eight minutes at the test's pace (6 min 53 s and 7 min 50 s in pass MQ's runs, with its rows and rounds); the timeout is fifteen.
echo "13f/13 a game's welcome and its demonstration"; timeout 900 node tests/e2e/game-intro.mjs 2>&1 | tail -1 | tee /tmp/edu_intro.txt; grep -q " 0 failed" /tmp/edu_intro.txt || fail=1
# Every game on the narrowest phone, in a typeface a tenth wider than the test browser's, and again after a wrong tap on every
# board that names its answer (pass MR, from Mikey's answer to Q72: "I never want this to happen anywhere in the app and try to
# correct every example I find."): a word that spills out of its box, or centered words an icon pushes off center, fails, and so
# does a game that never opens, a missed planted fault (a spilled tile and an off-center row, planted in the first game) or a
# wide typeface that is not really drawn. The games where no wrong tap can be made are listed, not failed. About four minutes;
# the timeout is ten. The full sweep at eight sizes is tools/layout-sweep.mjs on its own (its header says how).
echo "13g/13 every game on the narrowest phone, in a wider font, after a wrong tap"; timeout 600 node tools/layout-sweep.mjs --wide-font --wrong --sizes=320x568 > /tmp/edu_layout.log 2>&1; layout=$?; tail -1 /tmp/edu_layout.log | tee /tmp/edu_layout.txt; [ "$layout" = 0 ] && grep -q ": 0 problems" /tmp/edu_layout.txt || fail=1
# Every word in every drawn picture, the question pictures in the app, every lesson picture and every different picture a question
# bank draws over 300 seeds, in both themes (pass MR, the same answer of Mikey's): a word past its picture's edge, words on top of
# each other, a line through a word, or a word too faint against what is under it fails, and so does a question's picture that shows
# its own answer. About seven and a half minutes; the timeout is fifteen. It runs with tsx, since the lesson pictures are drawn from
# the built file.
echo "13h/13 every word in every drawn picture, in both themes"; timeout 900 npx tsx tests/e2e/diagram-words.mjs 2>&1 | tail -1 | tee /tmp/edu_words.txt; grep -q " 0 failed" /tmp/edu_words.txt || fail=1
# The reading lists' Details (pass MR, Mikey's books): every list's books in order, each with its Details button and a short rule
# between every two; one book a list opens exactly its summary under its title and author, and Got it, the dimmed page and Escape
# each close it; nothing runs past the screen's edge. Both themes, about forty seconds.
echo "13i/13 the reading lists' Details, in both themes"; timeout 240 node tests/e2e/book-details.mjs 2>&1 | tail -1 | tee /tmp/edu_books.txt; grep -q " 0 failed" /tmp/edu_books.txt || fail=1
if [ "$fail" = 0 ]; then echo "ALL CHECKS PASSED"; else echo "CHECKS FAILED - read the lines above"; exit 1; fi
