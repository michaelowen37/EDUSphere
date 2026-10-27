// The Wise Human. Copyright (c) 2026. Source-available; not for reuse. See LICENSE.md.
// The round each game's welcome plays (pass MP, round two's second read). In plain terms: a game's welcome plays a round of its own
// while the child watches, chosen so the answers the pointer shows are not the ones the child then meets (demoRoundSearch in
// src/logic.mjs). Searching for it as a game opens froze one game's page for 400 ms, so the answers are worked out here, ahead of
// time, and written into src/logic.mjs as DEMO_ROUNDS; the rules test fails whenever the table and the search disagree (a deck or a
// welcome changed), and says to run this tool again.
// Run: node tools/demo-rounds.mjs          (prints the table and whether src/logic.mjs holds it)
//      node tools/demo-rounds.mjs --write  (writes it between the DEMO_ROUNDS markers in src/logic.mjs)
import { readFileSync, writeFileSync } from 'node:fs';
import * as L from '../src/logic.mjs';

// The table, one game a line in the games' own order, so a change shows as a change of one line.
export function demoRoundsBlock() {
  const lines = L.GAMES.map((g) => `  '${g.id}': ${L.demoRoundSearch(g)},`);
  return `export const DEMO_ROUNDS = {\n${lines.join('\n')}\n};`;
}
// The table as src/logic.mjs holds it now, between its markers.
export function heldBlock(src) {
  const a = src.indexOf('// DEMO_ROUNDS:start'); const b = src.indexOf('// DEMO_ROUNDS:end');
  if (a < 0 || b < a) return null;
  const from = src.indexOf('\n', a) + 1;
  return src.slice(from, b).replace(/\n$/, '');
}
// Runs only when it is the file being run (its own name, read with endsWith, so a folder with a space in its path still works).
const runAlone = !!process.argv[1] && process.argv[1].endsWith('demo-rounds.mjs');
if (runAlone) {
  const url = new URL('../src/logic.mjs', import.meta.url);
  const src = readFileSync(url, 'utf8'); const block = demoRoundsBlock(); const held = heldBlock(src);
  if (held === null) { console.log('src/logic.mjs has no DEMO_ROUNDS markers'); process.exitCode = 1; }
  else if (process.argv.includes('--write')) {
    const a = src.indexOf('// DEMO_ROUNDS:start'); const from = src.indexOf('\n', a) + 1; const b = src.indexOf('// DEMO_ROUNDS:end');
    writeFileSync(url, `${src.slice(0, from)}${block}\n${src.slice(b)}`);
    console.log(`DEMO_ROUNDS written: ${L.GAMES.length} games`);
  } else {
    console.log(block);
    console.log(held === block ? '\nsrc/logic.mjs holds this table.' : '\nsrc/logic.mjs holds a different table: run node tools/demo-rounds.mjs --write');
  }
}
