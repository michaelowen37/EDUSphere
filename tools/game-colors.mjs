// The Wise Human. Copyright (c) 2026. Source-available; not for reuse. See LICENSE.md.
// Where a color shows in the games (pass MQ, round four's docs read). In plain terms: a question for Mikey about a sign the games
// show (Q66's red-brown edge, Q69's red-brown marks) needs the count of games the sign meets, and three times a count made by hand
// came out narrower than the code (pass MP's Q66, and Q69 twice in pass MQ, which missed Build a sentence and Green Flag or Red
// Flag). This tool takes the count from the code: for every kind of game in GAME_OF (src/ui.jsx), the component that draws it,
// whether its pieces wobble on a wrong move (a wobbling button or card wears the red-brown dashed edge since Mikey's answer to Q66),
// each line of the component that uses the color, and the games of that kind with the grades of the courses they belong to
// (COURSE_GAMES). What each use means (a wrong piece, a mark at rest, a right move) stays a person's reading, line by line; the list
// makes sure no game is left out of it. The rules test holds the tool to every kind and every game.
// Run: node tools/game-colors.mjs [a pattern for the color; the red-brown by default: B.clay, C.clay or #B9634A]
import { readFileSync } from 'node:fs';
import * as L from '../src/logic.mjs';

export const RED_BROWN = 'B\\.clay|C\\.clay|#B9634A';

// The kinds, their components and spans, and each line that uses the color. A component's span runs from its own `function` line
// to the next top-level function, as the file lays them out; a comment line is left out, since it names a color it does not draw.
export function gameColors(pattern = RED_BROWN, ui = readFileSync(new URL('../src/ui.jsx', import.meta.url), 'utf8')) {
  const lines = ui.split('\n');
  const gameOf = lines.find((l) => l.startsWith('const GAME_OF = {')) || '';
  const comps = [...gameOf.matchAll(/(\w+): (\w+Game)\b/g)].map((m) => ({ kind: m[1], comp: m[2] }));
  // A game with a board of its own beside its kind's (GamePad's \`const Game = game.kind === 'spot' && game.spot === 'letters' ?
  // FindLetterGame : ...\`, Find the Letter since pass MM) is its own row, so its board is read too and its game is not counted twice.
  const own = [...ui.matchAll(/game\.kind === '(\w+)' && game\.(\w+) === '(\w+)' \? (\w+Game)/g)].map((m) => ({ kind: m[1], key: m[2], value: m[3], comp: m[4] }));
  for (const o of own) comps.push({ kind: `${o.kind} (${o.key} ${o.value})`, comp: o.comp, base: o.kind, test: (g) => g[o.key] === o.value });
  const ownOf = (g) => own.some((o) => g.kind === o.kind && g[o.key] === o.value);
  const starts = new Map(); lines.forEach((l, i) => { const m = l.match(/^function (\w+)\(/); if (m) starts.set(m[1], i); });
  const sorted = [...starts.values()].sort((a, b) => a - b);
  const color = new RegExp(pattern);
  // The courses each game opens in, for its grades.
  const home = new Map(); for (const [cid, ids] of Object.entries(L.COURSE_GAMES || {})) for (const id of ids) home.set(id, [...(home.get(id) || []), cid]);
  const gradeOf = (gid) => [...new Set((home.get(gid) || []).map((cid) => (L.COURSES.find((c) => c.id === cid) || {}).grade).filter(Boolean))];
  return comps.map(({ kind, comp, base, test }) => {
    const s = starts.has(comp) ? starts.get(comp) : -1;
    const e = s < 0 ? -1 : (sorted.find((x) => x > s) ?? lines.length);
    const body = s < 0 ? [] : lines.slice(s, e);
    const uses = body.map((l, j) => ({ line: s + j + 1, text: l.trim() })).filter((x) => color.test(x.text) && !x.text.startsWith('//') && !x.text.startsWith('/*') && !x.text.startsWith('*'));
    const games = L.GAMES.filter((g) => (base ? g.kind === base && test(g) : g.kind === kind && !ownOf(g))).map((g) => ({ id: g.id, title: g.title, grades: gradeOf(g.id) }));
    return { kind, comp, found: s >= 0, from: s + 1, to: e, wobbles: body.some((l) => l.includes('edu-wobble')), uses, games };
  });
}

// Written only when this file is the one being run (its own name, read with endsWith, so a folder with a space still works).
if (process.argv[1] && process.argv[1].endsWith('game-colors.mjs')) {
  const pattern = process.argv[2] || RED_BROWN;
  const rows = gameColors(pattern);
  const label = (g) => (g === 'K' ? 'K' : g === 'C' ? 'college' : g.startsWith('PK') ? `pre-K ${g.slice(2)}` : `grade ${g}`);
  console.log(`Where /${pattern}/ shows in the games: every kind in GAME_OF, its component, whether it wobbles, the lines that use the color, and its games\n`);
  for (const r of rows.filter((x) => x.uses.length)) {
    console.log(`${r.kind} (${r.comp}, lines ${r.from} to ${r.to}${r.wobbles ? ', wobbles' : ''}): ${r.games.length} game${r.games.length === 1 ? '' : 's'}, ${r.games.map((g) => `${g.title} [${g.id}${g.grades.length ? `, ${g.grades.map(label).join(' and ')}` : ''}]`).join('; ')}`);
    for (const u of r.uses) console.log(`    ${u.line}: ${u.text.slice(0, 220)}`);
  }
  const used = rows.filter((x) => x.uses.length); const missing = rows.filter((x) => !x.found);
  console.log(`\n${used.length} of ${rows.length} kinds use the color, ${used.reduce((n, r) => n + r.games.length, 0)} games; ${rows.filter((x) => !x.uses.length).length} kinds do not${missing.length ? `; no component found for ${missing.map((x) => x.kind).join(', ')}` : ''}.`);
}
