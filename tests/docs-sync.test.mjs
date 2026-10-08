// The rules audit and the algorithms note never drift from the code (pass LR, Mikey: "never forget"). In plain terms: it
// checks that the educator sentences listed in docs/RULES-AUDIT.md are exactly what the code writes today, that both docs
// state the review timings the code uses, and that every student-facing phrase the audit quotes is still on screen.
import { readFileSync } from 'node:fs';
import * as L from '../src/logic.mjs';
import { sentencesBlock } from '../tools/audit-sentences.mjs';
let passed = 0; let failed = 0;
const ok = (name, cond, info) => { if (cond) { passed++; console.log('PASS - ' + name); } else { failed++; console.log('FAIL - ' + name + (info ? '  ' + info : '')); } };
const audit = readFileSync(new URL('../docs/RULES-AUDIT.md', import.meta.url), 'utf8');
const algo = readFileSync(new URL('../docs/ALGORITHMS.md', import.meta.url), 'utf8');
const ui = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8');
const a = audit.indexOf('<!-- sentences:start'); const b = audit.indexOf('<!-- sentences:end -->');
ok('the rules audit lists the Quick Review sentences exactly as the code writes them (fix: node tools/audit-sentences.mjs --write)', a >= 0 && b > a && audit.slice(a, b + '<!-- sentences:end -->'.length) === sentencesBlock());
for (const [doc, name] of [[audit, 'rules audit'], [algo, 'algorithms note']]) {
  ok(`the ${name} states the first review at ${L.LIGHT_REVIEW_FIRST_DAYS} calendar days`, doc.includes(`${L.LIGHT_REVIEW_FIRST_DAYS} calendar days`));
  ok(`the ${name} states the near-pass retry at ${L.LIGHT_REVIEW_RETRY_DAYS} days`, doc.includes(`${L.LIGHT_REVIEW_RETRY_DAYS} days later`));
  ok(`the ${name} states ${L.LIGHT_REVIEWS_PER_DAY} reviews a day`, doc.includes(`LIGHT_REVIEWS_PER_DAY = ${L.LIGHT_REVIEWS_PER_DAY}`));
}
// Words a student or educator reads, quoted in the audit; each must still be in the code and in the audit.
const WORDS = [
  'First, A Quick Review', 'One More Quick Review', "Five quick review questions from a module you've mastered long ago.", 'Your lessons come right after!',
  'That one is yours to keep!', 'We will look back at it once more soon.', "It's open again on your list so you can go back through it any time.",
  "You've mastered this once before but one of your reviews prompted a refresher.", 'You moved on from this one for now. It will come back later for a fresh try.',
  'A question from an earlier module', 'Practice Reviews are impromptu quizzes that appear weeks after a student masters a concept.',
  'Review quizzes are capped at two per day and students will never see a PASS or FAIL.', 'Move Forward',
];
// The four Wonder voices (pass LY, Mikey's words): each name and label is in the code and in the rules audit.
{
  const logic = readFileSync(new URL('../src/logic.mjs', import.meta.url), 'utf8');
  for (const w of ["name: 'Frederick', role: 'The Scientist'", "name: 'Chloe', role: 'The Artist'", "name: 'Georgette', role: 'The Grandparent of Faith'", "name: 'Mike', role: 'The Skeptic'"]) {
    const [, n, r] = w.match(/name: '(.*)', role: '(.*)'/);
    ok(`the Wonder voice ${n}, ${r}, is in the code and in the rules audit`, logic.includes(w) && audit.includes(`${n} (${r})`));
  }
}
// Every part of the start-chat doc has a check (pass LZ, Mikey: can every main item on it be delegated to a separate agent?):
// each section of docs/NEW-CHAT.md has a row in the map in docs/INDEPENDENT-CHECKS.md, every row names a check, and every
// check named has its brief there, so a section added to NEW-CHAT without a check, or a check without a brief, fails here.
{
  const newChat = readFileSync(new URL('../docs/NEW-CHAT.md', import.meta.url), 'utf8');
  const checks = readFileSync(new URL('../docs/INDEPENDENT-CHECKS.md', import.meta.url), 'utf8');
  const sections = [...newChat.matchAll(/^## (.+)$/gm)].map((m) => m[1].replace(/\s*\([^)]*\)$/, '').trim());
  const at = checks.indexOf('## Who checks each part of NEW-CHAT');
  const map = at < 0 ? '' : checks.slice(at, checks.indexOf('\n## ', at + 5));
  const rows = [...map.matchAll(/^\| ([^|]+?) \| ([^|]+?) \|$/gm)].map((m) => [m[1].trim(), m[2]]).filter(([name]) => name !== 'NEW-CHAT section');
  const unmapped = sections.filter((s) => !rows.some(([name]) => name === s));
  ok('every section of NEW-CHAT has a row in the checks map (docs/INDEPENDENT-CHECKS.md)', sections.length >= 10 && unmapped.length === 0, unmapped.join('; '));
  const NAMES = /[Tt]he (story flow brief|story brief|picture brief|screen brief|lesson brief|Wonder brief|game brief|code brief|accuracy check|alignment read|final read)/g;
  const bare = rows.filter(([, who]) => [...who.matchAll(NAMES)].length === 0).map(([name]) => name);
  const named = new Set(rows.flatMap(([, who]) => [...who.matchAll(NAMES)].map((m) => m[1])));
  const missing = [...named].filter((n) => !new RegExp(`^## The ${n}$`, 'm').test(checks));
  ok('every row of the checks map names a check, and every check it names has its brief', named.size >= 8 && bare.length === 0 && missing.length === 0, [...bare, ...missing].join('; '));
}
for (const w of WORDS) ok(`on screen and in the rules audit: "${w}"`, ui.includes(w) && audit.includes(w), (ui.includes(w) ? '' : 'missing from src/ui.jsx; ') + (audit.includes(w) ? '' : 'missing from the rules audit'));
console.log(`\n${passed} passed, ${failed} failed`);
process.exitCode = failed ? 1 : 0;   // never process.exit(): it can drop the last lines of a piped stdout (CLAUDE.md, 2026-09-23)
