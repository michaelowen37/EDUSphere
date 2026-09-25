#!/usr/bin/env bash
# The one check to run after ANY change. Ends with "ALL CHECKS PASSED" or a failure.
set -u
cd "$(dirname "$0")"
fail=0
echo "1/12 rules tests";  node tests/logic.test.mjs | tail -1 | tee /tmp/edu_t.txt; grep -q " 0 failed" /tmp/edu_t.txt || fail=1
echo "2/12 curriculum coverage"; node tests/coverage.test.mjs | grep -E 'FAIL|NOTE|passed' | tee /tmp/edu_c.txt; grep -q " 0 failed" /tmp/edu_c.txt || fail=1
echo "3/12 spelling and style"; node tests/spelling.test.mjs | tail -1 | tee /tmp/edu_sp.txt; grep -q " 0 failed" /tmp/edu_sp.txt || fail=1
echo "4/12 lesson lines and pictures"; node tests/scripts.test.mjs | tail -1 | tee /tmp/edu_sc.txt; grep -q " 0 failed" /tmp/edu_sc.txt || fail=1
echo "5/12 stories";      node tests/stories.test.mjs | tail -1 | tee /tmp/edu_st.txt; grep -q " 0 failed" /tmp/edu_st.txt || fail=1
echo "5b/11 art ledger";  node tests/ledger.test.mjs | tail -1 | tee /tmp/edu_le.txt; grep -q " 0 failed" /tmp/edu_le.txt || fail=1
echo "5c/11 pictures";    node tests/pictures.test.mjs | tail -1 | tee /tmp/edu_pi.txt; grep -q " 0 failed" /tmp/edu_pi.txt || fail=1
echo "6/12 old backups still restore"; node tests/backup-forever.test.mjs | tail -1 | tee /tmp/edu_b.txt; grep -q " 0 failed" /tmp/edu_b.txt || fail=1
echo "7/12 build";        ./build.sh || fail=1
echo "8/12 render smoke"; npx tsx tests/render.smoke.test.mjs 2>&1 | grep -E "^(PASS|FAIL)" | tail -1 | tee /tmp/edu_s.txt; grep -q "^PASS" /tmp/edu_s.txt || fail=1
echo "9/12 syntax";       tsc --noEmit --allowJs --jsx preserve --target es2022 --module esnext --moduleResolution bundler dist/edusphere-prototype.jsx 2>&1 | grep -v "Cannot find module 'react'" | tee /tmp/edu_x.txt; [ -s /tmp/edu_x.txt ] && fail=1
echo "10/12 browser click-through (about a minute)"; node tests/e2e/make-page.mjs >/dev/null && timeout 240 node tests/e2e/click-through.mjs 2>&1 | tail -1 | tee /tmp/edu_e.txt; grep -q " 0 failed" /tmp/edu_e.txt || fail=1
echo "11/12 back button from every screen"; timeout 200 node tests/e2e/back-sweep.mjs 2>&1 | tail -1 | tee /tmp/edu_back.txt; grep -q " 0 failed" /tmp/edu_back.txt || fail=1
echo "12/12 standalone page keeps its data"; timeout 120 node tests/site.test.mjs 2>&1 | tail -1 | tee /tmp/edu_site.txt; grep -q " 0 failed" /tmp/edu_site.txt || fail=1
if [ "$fail" = 0 ]; then echo "ALL CHECKS PASSED"; else echo "CHECKS FAILED - read the lines above"; exit 1; fi
