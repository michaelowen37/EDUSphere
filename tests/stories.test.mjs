// Every story belongs to a real module, fits its band's word limit, has a unique serial, names only
// the core cast, and reads like a story: at least three paragraphs, no em dashes.
import * as L from '../src/logic.mjs';
import { COURSE_STORIES, STORIES, STORY_WORD_LIMIT } from '../src/stories.mjs';
let pass = 0; let fail = 0;
const ok = (label, cond, detail = '') => { console.log((cond ? 'PASS' : 'FAIL') + ' - ' + label + (cond ? '' : '  ' + detail)); cond ? pass++ : fail++; };
const CORE = ['Mike', 'Chloe', 'Frederick', 'Georgette', 'Savanah', 'Jaxon', 'Harlow'];
const early = new Set(['PK3', 'PK4', 'K', '1', '2']);
const serials = Object.values(STORIES).flatMap((s) => [s.art, ...(s.more || []).map((m) => m.serial)]);
ok('every serial is unique and an S number', new Set(serials).size === serials.length && serials.every((s) => /^S\d+$/.test(s)));
for (const [id, s] of Object.entries(STORIES)) {
  const mod = L.getModule(id); const course = mod && L.getCourse(mod.courseId);
  ok(`${id}: the module exists`, !!course);
  if (!course) continue;
  const words = s.words.join(' ').split(/\s+/).length; const limit = early.has(course.grade) ? STORY_WORD_LIMIT.early : STORY_WORD_LIMIT.older;
  ok(`${id}: ${words} words is under ${limit}`, words <= limit);
  ok(`${id}: three or more paragraphs, a title, an alt line`, s.words.length >= 3 && !!s.title && !!s.alt);
  // The about line feeds the weekly note: "read “Title”, a story about {about}." It must read as a phrase there:
  // lowercase start (a name is fine), no closing punctuation, no "a story" of its own, no double spaces.
  if (s.about !== undefined) ok(`${id}: the about line reads inside the weekly note sentence`, typeof s.about === 'string' && s.about.length > 4 && !/[.!?]$/.test(s.about) && !/^(A|An|The) story/i.test(s.about) && !/  /.test(s.about) && (s.about[0] === s.about[0].toLowerCase() || /^[A-Z][a-z]*[, ]/.test(s.about)), JSON.stringify(s.about));
  ok(`${id}: no em dashes and no sentence over 32 words`, !s.words.some((p) => p.includes('\u2014')) && s.words.every((p) => p.split(/[.!?]\s/).every((sent) => sent.split(/\s+/).length <= 32)));
  ok(`${id}: cast names are core characters`, s.cast.every((n) => CORE.includes(n)));
  ok(`${id}: a where line only when the core cast is here, one short line`, !s.where || (s.cast.length > 0 && s.where.length <= 90 && !/\b(was|is|turned) (four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|\d+)\b/.test(s.where)));
  ok(`${id}: no ages in the text (they live in the art prompts)`, !/\b(Mike|Chloe|Frederick|Georgette|Savanah|Jaxon|Harlow) (was|is|turned) (four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|\d+)\b/.test(s.words.join(' ')));
  ok(`${id}: extra pictures point at a paragraph, never two back to back`, (s.more || []).every((m) => /^S\d+$/.test(m.serial) && m.alt && m.after >= 0 && m.after < s.words.length) && new Set((s.more || []).map((m) => m.after)).size === (s.more || []).length);
  ok(`${id}: at most two core characters in one story`, s.cast.length <= 2);
}
// Course stories: one longer story per course, still under the Gladwell ceiling for older readers, with three paragraphs and a scene.
for (const [id, cs] of Object.entries(COURSE_STORIES)) {
  const words = cs.words.join(' ').split(/\s+/).length;
  ok(`${id}: course story stays under 350 words and has three paragraphs, a title and a scene`, words <= 350 && cs.words.length === 3 && !!cs.title && !!cs.alt && /^CS\d+$/.test(cs.art), `${words} words`);
}
// Read-aloud rule for the early years (2026-09-23, Mikey): pre-K to grade 2 stories are spoken to five-year-olds, so no
// sentence runs past twelve words and no word past three syllables (vowel groups, a silent e dropped).
{
  const L = await import('../src/logic.mjs');
  const early = new Set(['PK3', 'PK4', 'K', '1', '2']);
  const syl = (w) => { const x = w.toLowerCase().replace(/[^a-z]/g, ''); if (!x) return 0; let n = (x.match(/[aeiouy]+/g) || []).length; if (/[^aeiouy]e$/.test(x) && !/le$/.test(x) && n > 1) n -= 1; return Math.max(1, n); };
  const bad = [];
  for (const m of L.MODULES) { const st = STORIES[m.id]; const c = L.getCourse(m.courseId); if (!st || !c || !early.has(c.grade)) continue;
    for (const par of st.words) for (const sent of par.split(/(?<=[.!?])\s+/)) { const ws = sent.split(/\s+/).filter(Boolean); if (ws.length > 12) bad.push(`${m.id}: ${ws.length} words`); for (const w of ws) if (syl(w) > 3) bad.push(`${m.id}: ${w}`); } }
  ok('early-years stories read aloud kindly: sentences of twelve words or fewer, words of three syllables or fewer', bad.length === 0, bad.slice(0, 6).join(' | '));
}
// Course stories spread the cast (2026-09-23, Mikey): in a grade's Let's Read list, two stories side by side never lead
// with the same core character, so nobody meets Georgette three times in a row.
{
  const L = await import('../src/logic.mjs');
  const lead = (title) => (/^(Mike|Chloe|Frederick|Georgette|Savanah)\b/.exec(title) || [])[1] || null;
  const bad = [];
  for (const g of L.GRADES) { const titles = L.spreadLeads(L.COURSES.filter((c) => c.grade === g && COURSE_STORIES[c.id]), (c) => COURSE_STORIES[c.id].title).map((c) => COURSE_STORIES[c.id].title); titles.forEach((t, i) => { if (i && lead(t) && lead(t) === lead(titles[i - 1])) bad.push(`${g}: ${titles[i - 1]} / ${t}`); }); }
  ok('course stories side by side never lead with the same core character, in the order Let\'s Read shows them', bad.length === 0, bad.join(' | '));
  const heavy = []; for (const g of L.GRADES) { const leads = L.COURSES.filter((c) => c.grade === g && COURSE_STORIES[c.id]).map((c) => lead(COURSE_STORIES[c.id].title)).filter(Boolean); const counts = {}; leads.forEach((n) => { counts[n] = (counts[n] || 0) + 1; }); for (const [n, k] of Object.entries(counts)) if (leads.length >= 3 && k > Math.ceil(leads.length / 2)) heavy.push(`${g}: ${n} ${k} of ${leads.length}`); }
  ok('no grade gives one core character more than half of its named course stories', heavy.length === 0, heavy.join(' | '));
}
// The story arc is a hard rule now (2026-09-23, Mikey): every module story has at least four beats, and a story from
// grade 3 up runs eighty words or more (the four-step arc), an early-years story twenty-five or more (the small arc).
{
  const L = await import('../src/logic.mjs');
  const bad = [];
  for (const m of L.MODULES) { const st = STORIES[m.id]; const c = L.getCourse(m.courseId); if (!st || !c) continue;
    const early = ['PK3', 'PK4', 'K', '1', '2'].includes(c.grade); const words = st.words.join(' ').split(/\s+/).filter(Boolean).length;
    if (st.words.length < 4 || words < (early ? 25 : 80)) bad.push(`${m.id}: ${st.words.length} paragraphs, ${words} words`); }
  ok('every module story keeps the arc: four beats, eighty words from grade 3 up, twenty-five in the early years', bad.length === 0, bad.slice(0, 5).join(' | '));
}
// Pictures spread through the story (2026-09-24, Mikey): a story done under the doubling program (three or more extra
// pictures: pre-K four in all, K to 2 five, grade 3 up six) keeps them on different paragraphs with one in each half.
{
  const bad = [];
  for (const [id, st] of Object.entries(STORIES)) { const more = st.more || []; if (more.length < 3) continue;
    const spots = new Set(more.map((m) => m.after)); const half = st.words.length / 2;
    if (spots.size < more.length || !more.some((m) => m.after < half) || !more.some((m) => m.after >= half)) bad.push(`${id}: after ${more.map((m) => m.after).join(',')}`); }
  ok('a story with six pictures spreads them through its paragraphs', bad.length === 0, bad.slice(0, 5).join(' | '));
}
console.log(`\n${pass} passed, ${fail} failed`);
process.exitCode = fail ? 1 : 0;   // never process.exit(): it can drop the last lines of a piped stdout (2026-09-23)
