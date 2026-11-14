// Copyright (c) 2026 iECHO, LLC. All rights reserved.
// The counts a pass's records state, filled in from the code (pass NK, Mikey's answer to Q102: "B is okay, only if you think this
// doesn't introduce risk that would lead to reduced accuracy or quality. You can offer more suggestions if you find any later."). In
// plain terms: a pass that adds a lesson changes the module count in NEW-CHAT, HANDOFF and the Project Context, and readers had found the
// one copy left at the old count again and again. Each such count in the records that describe the app as it stands now is written
// between two markers, <!-- n:modules -->729<!-- /n -->, which show nothing when the page is read, and this tool works every count out
// from the code and rewrites the number between them. DECISIONS is history (each entry states the counts of its own day) and is never
// read or written here. tests/docs-sync.test.mjs holds every marker to the number this tool works out, and every pointer
// (<!-- points-to: docs/FILE.md | words -->, a short line that sends a reader to the one place a fact is written) to words that are there.
// Run: node tools/record-counts.mjs            the counts, and every marker that is out of date (it exits 1 if one is)
//      node tools/record-counts.mjs --write    rewrites the number of every marker that is out of date
import { readFileSync, writeFileSync } from 'node:fs';

// The records that describe the app as it stands now, the only files whose markers this tool reads and writes.
export const RECORD_DOCS = ['docs/NEW-CHAT.md', 'docs/HANDOFF.md', 'docs/PROJECT-CONTEXT.md', 'docs/RULES-AUDIT.md'];
export const COUNT_MARK = /<!-- n:([A-Za-z]+) -->([^<]*)<!-- \/n -->/g;
export const POINTER = /<!-- points-to: ([^|>]+?) \| ([^>]+?) -->/g;

// Every count a marker may name, worked out from the code.
export async function recordCounts() {
  const L = await import('../src/logic.mjs'); const S = await import('../src/stories.mjs');
  return {
    courses: L.COURSES.length, modules: L.MODULES.length, subjects: new Set(L.COURSES.map((c) => c.subject)).size,
    moduleStories: Object.keys(S.STORIES).length, courseStories: Object.keys(S.COURSE_STORIES).length, nextStories: Object.keys(S.MASTERY_STORIES).length,
    lifeSkills: L.LIFE_SKILLS.length, games: L.GAMES.length, gameKinds: new Set(L.GAMES.map((g) => g.kind)).size,
    wonder: L.WONDER.length, wonderEarly: L.WONDER.filter((w) => w.stage === 'early').length,
    coloringPages: Object.keys(S.COLOR_PAGES).length, banks: Object.keys(L.GENERATORS).length,
  };
}
// The markers of one text that are out of date: each with its count's name, the number written and the number the code gives (want is
// undefined for a name the tool does not know).
export function staleMarks(text, counts) {
  return [...String(text).matchAll(COUNT_MARK)].filter((m) => String(counts[m[1]]) !== m[2]).map((m) => ({ key: m[1], was: m[2], want: counts[m[1]] }));
}
// The text with every known marker's number brought up to date.
export function freshMarks(text, counts) {
  return String(text).replace(COUNT_MARK, (all, key) => (counts[key] === undefined ? all : `<!-- n:${key} -->${counts[key]}<!-- /n -->`));
}

if (process.argv[1] && process.argv[1].endsWith('record-counts.mjs')) {
  const counts = await recordCounts(); const write = process.argv.includes('--write'); let left = 0;
  console.log(JSON.stringify(counts, null, 1));
  for (const f of RECORD_DOCS) {
    const url = new URL('../' + f, import.meta.url); const text = readFileSync(url, 'utf8'); const stale = staleMarks(text, counts);
    for (const s of stale) console.log(`${f}: ${s.key} written ${s.was}, the code gives ${s.want === undefined ? 'no such count' : s.want}`);
    if (write && stale.some((s) => s.want !== undefined)) { writeFileSync(url, freshMarks(text, counts)); console.log(`${f}: rewritten`); }
    left += staleMarks(write ? readFileSync(url, 'utf8') : text, counts).length;
  }
  if (left) process.exitCode = 1;
}
