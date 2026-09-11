#!/usr/bin/env bash
# The one check to run after ANY change. Ends with "ALL CHECKS PASSED" or a failure.
set -u
cd "$(dirname "$0")"
fail=0
echo "1/10 rules tests";  node tests/logic.test.mjs | tail -1 | tee /tmp/edu_t.txt; grep -q " 0 failed" /tmp/edu_t.txt || fail=1
echo "2/10 curriculum coverage"; node tests/coverage.test.mjs | grep -E 'FAIL|NOTE|passed' | tee /tmp/edu_c.txt; grep -q " 0 failed" /tmp/edu_c.txt || fail=1
echo "3/10 spelling and style"; node tests/spelling.test.mjs | tail -1 | tee /tmp/edu_sp.txt; grep -q " 0 failed" /tmp/edu_sp.txt || fail=1
echo "4/10 lesson lines and pictures"; node tests/scripts.test.mjs | tail -1 | tee /tmp/edu_sc.txt; grep -q " 0 failed" /tmp/edu_sc.txt || fail=1
echo "5/10 old backups still restore"; node tests/backup-forever.test.mjs | tail -1 | tee /tmp/edu_b.txt; grep -q " 0 failed" /tmp/edu_b.txt || fail=1
echo "6/10 build";        ./build.sh || fail=1
echo "7/10 render smoke"; npx tsx tests/render.smoke.test.mjs 2>&1 | grep -v "^    at " | tail -1 | tee /tmp/edu_s.txt; grep -q "^PASS" /tmp/edu_s.txt || fail=1
echo "8/10 syntax";       tsc --noEmit --allowJs --jsx preserve --target es2022 --module esnext --moduleResolution bundler dist/edusphere-prototype.jsx 2>&1 | grep -v "Cannot find module 'react'" | tee /tmp/edu_x.txt; [ -s /tmp/edu_x.txt ] && fail=1
echo "9/10 browser click-through (about a minute)"; node tests/e2e/make-page.mjs >/dev/null && timeout 240 node tests/e2e/click-through.mjs 2>&1 | tail -1 | tee /tmp/edu_e.txt; grep -q " 0 failed" /tmp/edu_e.txt || fail=1
echo "10/10 standalone page keeps its data"; timeout 120 node tests/site.test.mjs 2>&1 | tail -1 | tee /tmp/edu_site.txt; grep -q " 0 failed" /tmp/edu_site.txt || fail=1
if [ "$fail" = 0 ]; then echo "ALL CHECKS PASSED"; else echo "CHECKS FAILED - read the lines above"; exit 1; fi
