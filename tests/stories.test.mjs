// Every story belongs to a real module, fits its band's word limit, has a unique serial, names only
// the core cast, and reads like a story: at least three paragraphs, no em dashes.
import * as L from '../src/logic.mjs';
import { STORIES, STORY_WORD_LIMIT } from '../src/stories.mjs';
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
  ok(`${id}: extra pictures point at a paragraph`, (s.more || []).every((m) => /^S\d+$/.test(m.serial) && m.alt && m.after >= 0 && m.after < s.words.length));
  ok(`${id}: at most two core characters in one story`, s.cast.length <= 2);
}
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
