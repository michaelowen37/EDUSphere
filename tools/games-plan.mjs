// Writes docs/GAMES-PLAN.md from the games themselves (2026-09-25), so the plan can never drift from what the app holds:
// every course and its games, the two ceilings the rules test holds, and where the new kinds stand.
// Run: node tools/games-plan.mjs
import { writeFileSync } from 'node:fs';
import * as L from '../src/logic.mjs';

const byId = new Map(L.GAMES.map((g) => [g.id, g]));
const kindOf = (id) => (byId.get(id) || {}).kind;
let repeats = 0; for (const gr of L.GRADES) { const ks = L.COURSES.filter((c) => c.grade === gr).flatMap((c) => (L.COURSE_GAMES[c.id] || []).map(kindOf)); repeats += ks.length - new Set(ks).size; }
const doubles = L.COURSES.filter((c) => { const ks = (L.COURSE_GAMES[c.id] || []).map(kindOf); return ks.length !== new Set(ks).size; }).map((c) => c.id);
const quick = Object.values(L.COURSE_GAMES).flat().filter((id) => kindOf(id) === 'sprint').length;
const kinds = new Set(L.GAMES.map((g) => g.kind));
const holders = (kind) => L.COURSES.filter((c) => (L.COURSE_GAMES[c.id] || []).some((id) => kindOf(id) === kind)).map((c) => c.title);
const rows = [];
for (const gr of L.GRADES) for (const c of L.COURSES.filter((x) => x.grade === gr)) rows.push(`| ${gr} | ${c.title} | ${(L.COURSE_GAMES[c.id] || []).map((id) => `${(byId.get(id) || { title: id }).title} (${kindOf(id)})`).join(', ')} |`);
const out = `# Games plan

Written by tools/games-plan.mjs from the app's own lists; run it again after any change to the games. Every course has its own game, or two, chosen to suit its subject and grade; finishing the course unlocks them. Inside a grade the same kind is avoided wherever today's kinds allow. A course that no game suits yet has a quick fire of its own lessons, and so does a history course whose only game is a map still waiting for its painting.

Starter, open from the first day: Star. Kinds of game: ${kinds.size}. Quick fires still standing in for a game: ${quick}. Kinds repeated inside a grade: ${repeats}. Courses holding two games of one kind: ${doubles.join(', ') || 'none'}. The rules test holds both numbers as ceilings, so each new kind must bring them down.

## New kinds, in order

Each new kind should make the course's idea the rule of the game, so playing is practicing. They replace quick fires and repeats first.

1. Sentence builder, for writing (built 2026-09-25): tap word tiles into a sentence that makes sense, then into one that says more. Held by ${holders('build').join(', ')}.
2. Fix it, for writing (built 2026-09-25): tap the one word, capital or mark that is wrong in a sentence, then read the rule. Held by ${holders('fix').join(', ')}.
3. Color mixer, for art: mix two paints to hit a target color, primaries to secondaries to tints and shades.
4. Debug the robot, for technology: a robot follows steps on a grid; find and fix the step that sends it the wrong way.
5. Timelines for every history grade, using the order kind with new decks.
6. A periodic table game for chemistry, so science 11 no longer holds two pairs games.
7. The reading courses' quick fires wait for a kind that practices reading itself, not only its questions.

## Every course and its games

| Grade | Course | Games |
|---|---|---|
${rows.join('\n')}
`;
writeFileSync(new URL('../docs/GAMES-PLAN.md', import.meta.url), out);
console.log(`games plan written: ${rows.length} courses, ${kinds.size} kinds, ${quick} quick fires, ${repeats} repeats, doubles ${doubles.join(', ') || 'none'}`);
