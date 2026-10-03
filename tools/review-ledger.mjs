// The writing review ledger (2026-10-03, pass JE, Mikey: "let's earmark all modules, stories, images, games etc for review").
// In plain terms: lists everything a reader meets, in the order Fable reviews it, marks what has been reviewed so far (from
// docs/review-status.json), and counts the colons in each lesson and story, since Mikey asked for far fewer of them, so the
// count before and after a rewrite is easy to see. Run: node tools/review-ledger.mjs > docs/REVIEW-LEDGER.md
import { readFileSync } from 'node:fs';
import { COURSES, GAMES, COURSE_GAMES, WONDER } from '../src/logic.mjs';
import { STORIES, COURSE_STORIES } from '../src/stories.mjs';

const reviewed = (() => { try { return JSON.parse(readFileSync(new URL('../docs/review-status.json', import.meta.url), 'utf8')).reviewed || {}; } catch (e) { return {}; } })();
const flat = (v) => (typeof v === 'string' ? v : Array.isArray(v) ? v.map(flat).join(' ') : v && typeof v === 'object' ? Object.values(v).map(flat).join(' ') : '');
const colons = (v) => (flat(v).match(/(?<!\d):(?!\d)/g) || []).length;            // 3:30 and 1:2 are not counted
const cell = (s) => String(s == null ? '' : s).replace(/\|/g, '/').replace(/\s+/g, ' ').trim();
const done = (key) => (reviewed[key] ? `yes (${cell(reviewed[key])})` : '');
// College first, then grade 12 down to pre-K: the older the reader, the more the lesson has to explain.
const rank = (g) => { const s = String(g); if (/^c/i.test(s)) return 0; if (/^\d+$/.test(s)) return 13 - Number(s); if (/^k$/i.test(s)) return 13; return 14 + (/3/.test(s) ? 1 : 0); };
const courses = [...COURSES].sort((a, b) => rank(a.grade) - rank(b.grade) || (b.elective ? 1 : 0) - (a.elective ? 1 : 0));
const rows = []; for (const c of courses) for (const m of c.modules) rows.push({ c, m, st: STORIES[m.id] });
const flagged = ['Saving, investing and risk', 'Scarcity, trade and markets', 'The communication process', 'Communication and audience'];
const moduleRow = ({ c, m, st }) => `| ${done(`module:${m.id}`)} | ${cell(c.grade)} | ${cell(c.title)} | ${cell(m.title)} (\`${m.id}\`) | ${colons(m.lesson)} | ${st ? cell(st.title) + ' (' + st.art + ')' : 'none'} | ${st ? colons(st.words || st.paragraphs || '') : ''} | ${[...new Set(m.generators || [])].join(', ')} |`;
const head = '| Reviewed | Grade | Course | Module | Lesson colons | Story | Story colons | Question banks |\n|---|---|---|---|---|---|---|---|';
const gameCourse = {}; for (const [cid, ids] of Object.entries(COURSE_GAMES || {})) for (const id of [].concat(ids)) (gameCourse[id] ||= []).push(cid);
const wonders = Array.isArray(WONDER) ? WONDER : Object.values(WONDER || {});
const keys = [...rows.map((r) => `module:${r.m.id}`), ...Object.keys(COURSE_STORIES).map((id) => `course-story:${id}`), ...GAMES.map((g) => `game:${g.id}`), ...wonders.map((w, i) => `wonder:${w.id || i}`)];
const lessonColons = rows.reduce((a, r) => a + colons(r.m.lesson), 0); const storyColons = rows.reduce((a, r) => a + (r.st ? colons(r.st.words || r.st.paragraphs || '') : 0), 0) + Object.values(COURSE_STORIES).reduce((a, s) => a + colons(s.words || s.paragraphs || ''), 0);
console.log(`# Review ledger

Generated ${new Date().toISOString().slice(0, 10)} by tools/review-ledger.mjs. What Mikey wants from the review is in docs/FABLE-REVIEW.md; this file is the work list, in order. To mark an item reviewed, add its key to "reviewed" in docs/review-status.json with the pass that did it (keys look like module:saving-investing-and-risk, course-story:econ-9, game:dots-kite, wonder:w-grown-the-rumor), then run the tool again.

Reviewed so far: ${keys.filter((k) => reviewed[k]).length} of ${keys.length} items (${rows.length} modules with their lessons, stories and question banks, ${Object.keys(COURSE_STORIES).length} long stories, ${GAMES.length} games and ${wonders.length} Wonder questions). Colons today: ${lessonColons} in lessons and ${storyColons} in stories (times like 3:30 and ratios are not counted). Pictures are reviewed through docs/ART-REQUESTS.md as they are painted; a rewritten story keeps each picture beside the paragraph it shows.

## 1. Start here: the modules Mikey named on October 3, 2026

${head}
${rows.filter((r) => flagged.includes(r.m.title)).map(moduleRow).join('\n')}

## 2. Every module, in review order (college first, then grade 12 down to pre-K)

${head}
${rows.map(moduleRow).join('\n')}

## 3. Long course stories

| Reviewed | Grade | Course | Story | Colons |
|---|---|---|---|---|
${courses.filter((c) => COURSE_STORIES[c.id]).map((c) => { const s = COURSE_STORIES[c.id]; return `| ${done(`course-story:${c.id}`)} | ${cell(c.grade)} | ${cell(c.title)} | ${cell(s.title)} (${s.art}) | ${colons(s.words || s.paragraphs || '')} |`; }).join('\n')}

## 4. Games

| Reviewed | Game | Kind | Course |
|---|---|---|---|
${GAMES.map((g) => `| ${done(`game:${g.id}`)} | ${cell(g.title)} (\`${g.id}\`) | ${cell(g.kind)} | ${cell((gameCourse[g.id] || []).join(', '))} |`).join('\n')}

## 5. Wonder questions

| Reviewed | Id | Question |
|---|---|---|
${wonders.map((w, i) => `| ${done(`wonder:${w.id || i}`)} | \`${w.id || i}\` | ${cell(w.question || w.q || w.prompt || w.text || flat(w).slice(0, 120))} |`).join('\n')}`);
