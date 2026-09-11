// A promise kept as a test: a backup file made today must restore on every future
// version of EduSphere. Never edit or delete a fixture. When the format changes, add a
// new fixture alongside the old ones and make the code read both.
import { readFileSync, readdirSync } from 'node:fs';
import * as L from '../src/logic.mjs';

let pass = 0, fail = 0;
const ok = (name, cond) => { if (cond) { pass++; console.log('PASS -', name); } else { fail++; console.log('FAIL -', name); } };

const files = readdirSync('tests/fixtures').filter((f) => /^backup-v\d+-.*\.json$/.test(f)).sort();
ok('at least one backup fixture exists', files.length >= 1);
for (const f of files) {
  const data = JSON.parse(readFileSync(`tests/fixtures/${f}`, 'utf8'));
  ok(`${f}: still passes the safety check`, L.checkBackup(data) === null);
  const empty = { roster: L.emptyRoster(), records: [], wonderReview: L.emptyWonderReview(), covered: L.emptyCoveredSkills() };
  const merged = L.mergeBackup(empty, data);
  ok(`${f}: every student comes back`, merged.roster.students.length === data.roster.students.length);
  ok(`${f}: every record comes back with all its events`, merged.records.every((r) => data.records.find((x) => x.name === r.name).events.length === r.events.length));
  ok(`${f}: the report can still be built from a restored record`, merged.records.every((r) => L.buildReport(r.name, r.events).modules.length > 0));
  ok(`${f}: mastery is preserved after restore`, L.deriveProgress(merged.records.find((r) => r.name === 's_1042').events).masteredIds.includes('count-to-5'));
  ok(`${f}: educator settings come back`, merged.wonderReview.approved.length > 0 && merged.covered.covered.length > 0);
  ok(`${f}: pictures and levels survive`, merged.roster.students.some((st) => st.picture === 'fox' && st.level === 'early'));
}
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
