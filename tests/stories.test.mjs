// Every story belongs to a real module, fits its band's word limit, has a unique serial, names only
// the core cast, and reads like a story: at least three paragraphs, no em dashes.
import * as L from '../src/logic.mjs';
import { COURSE_STORIES, MASTERY_STORIES, STORIES, STORY_WORD_LIMIT, COLOR_PAGES } from '../src/stories.mjs';
// Every long story, the first of each course and since pass MH the next one its mastery opens (MASTERY_STORIES), as
// [course id, story, label] so a check names which one failed.
const LONG_ENTRIES = [...Object.entries(COURSE_STORIES).map(([id, s]) => [id, s, id]), ...Object.entries(MASTERY_STORIES).map(([id, s]) => [id, s, `mastery:${id}`])];
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
  ok(`${id}: no em dashes and no sentence over 45 words (a run-on guard; Eleven v4 sets no limit, pass JG)`, !s.words.some((p) => p.includes('\u2014')) && s.words.every((p) => p.split(/[.!?]\s/).every((sent) => sent.split(/\s+/).length <= 45)));
  ok(`${id}: cast names are core characters`, s.cast.every((n) => CORE.includes(n)));
  ok(`${id}: a where line only when the core cast is here, one short line`, !s.where || (s.cast.length > 0 && s.where.length <= 90 && !/\b(was|is|turned) (four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|\d+)\b/.test(s.where)));
  ok(`${id}: extra pictures point at a paragraph, never two back to back`, (s.more || []).every((m) => /^S\d+$/.test(m.serial) && m.alt && m.after >= 0 && m.after < s.words.length) && new Set((s.more || []).map((m) => m.after)).size === (s.more || []).length);
  ok(`${id}: at most two core characters in one story`, s.cast.length <= 2);
}
// Core-cast ages in story text (pass MB, Mikey: "I think the ages and relatives are okay to mention in stories but keep the age
// part at a minimum.  It's actually good to state the age periodically just not consistently.  Relatives, no restriction
// anymore."). Pass MC, when 33 of 105 long stories stated one (Mikey: "I think we should have half of that number for the 105
// stories and keep a similar ratio throughout all of the grades/long stories"): at most one long story in six states a core
// character's age, never two in a row in grade order; every chapter of the clock with six or more long stories has at least
// one and at most one in five, so the ages come periodically through all the grades; and at most one in six module stories
// with the core cast. tools/cast-ages.mjs > docs/CAST-AGES.md lists them for the story brief, beside the clock in
// docs/CHARACTERS.md.
{ const { castAges, agePhrases } = await import('../tools/cast-ages.mjs');
  const r = castAges(L, { STORIES, COURSE_STORIES, MASTERY_STORIES });
  ok(`core-cast ages stay occasional: ${r.longStating} of ${r.longTotal} long stories state one, at most one in six`, r.longStating * 6 <= r.longTotal, r.longPattern);
  ok(`no habit: no two long stories in a row state a core character's age (longest run ${r.longestRun})`, r.longestRun <= 1, r.longPattern);
  const chapters = Object.entries(r.byChapter).filter(([, b]) => b.total >= 6);
  ok(`a similar ratio in every chapter: each with six or more long stories states an age in at least one and at most one in five (${Object.entries(r.byChapter).map(([k, b]) => `${k} ${b.stating} of ${b.total}`).join(', ')})`, chapters.length >= 4 && chapters.every(([, b]) => b.stating >= 1 && b.stating * 5 <= b.total));
  const withCast = Object.values(STORIES).filter((x) => (x.cast || []).length);
  const stating = withCast.filter((x) => agePhrases(x.words).length);
  ok(`core-cast ages stay occasional in module stories: ${stating.length} of ${withCast.length} with the core cast state one, at most one in six`, stating.length * 6 <= withCast.length);
  // An about line states no age (pass MC, the story check): the weekly note and the Story Log print it as a list, where a
  // habit shows most ("a story about eighteen-year-old Georgette"). The finder reads it with the story's first cast name in
  // front, so "a junior counselor at seventeen" counts as Savanah's, and a camper's age or "twenty weeks" does not.
  const aboutAge = (x) => agePhrases([`${(x.cast || [])[0] || ''} ${x.about || ''}`]);
  const aboutAges = [...LONG_ENTRIES.map(([, x, label]) => [label, x]), ...Object.entries(STORIES)].filter(([, x]) => aboutAge(x).length).map(([id, x]) => `${id}: ${x.about}`);
  ok('no story\'s about line states a core character\'s age', aboutAges.length === 0 && aboutAge({ cast: ['Savanah'], about: 'a junior counselor at seventeen, a camper' }).length === 1 && aboutAge({ cast: ['Frederick'], about: 'eight-year-old Frederick, an ant farm' }).length === 1 && aboutAge({ cast: ['Chloe'], about: 'a week minding an eight-year-old, a jar' }).length === 0, aboutAges.slice(0, 4).join(' | '));
  ok('the age finder reads the usual ways an age is said, and not a count or a time', agePhrases(['Frederick was eight and loved ants.']).length === 1 && agePhrases(['Eight-year-old Chloe painted.']).length === 1 && agePhrases(['When Mike was nine, he built a ramp.']).length === 1 && agePhrases(['Mike was ten minutes late.']).length === 0 && agePhrases(['Chloe was two steps behind.']).length === 0 && agePhrases(['Frederick had eight jars.']).length === 0 && agePhrases(['The summer she turned seventeen, Savanah left the farm.']).length === 1 && agePhrases(['Savanah, then seventeen, left.']).length === 1 && agePhrases(['Mike was 100 percent sure.']).length === 0 && (agePhrases(['Frederick was twenty-three and a student.'])[0] || '').endsWith('twenty-three'));
  // The forms the finder learned in pass MC (the story check's first and second reads), each in a sentence the stories use, and
  // the counts, times, sizes and prices it must leave alone.
  const ages = ['Georgette read the letter twice. She was eighteen.', 'Savanah came to the city at eighteen with a print shop job.', 'The first thing Savanah ever sold was an egg, and by fifteen she was selling twelve dozen a week.', 'The director gave Savanah, eighteen and a junior counselor, the hour.', 'At twenty, Frederick knew not to trust a fast number.', 'Chloe, at seventeen, had a job.', 'Chloe, a girl of nine, painted the wall.', 'Mike, aged nine, built a ramp.'];
  const notAges = ['Psychology came from her cousin Nico. He was eight and loved trains.', 'Frederick set jars at four spots along the creek.', 'Mike was the youngest by eight years.', 'Georgette opened the shop at nine in the morning.', 'Mike was twenty-five minutes late.', 'Chloe cut a card three by four.', 'Savanah sold apples at two dollars a pound.'];
  // One overcount pass MC accepted: a clock hour after a cast name reads as an age (no story says one, and an overcount errs
  // toward fewer ages), so a writer who meets it here rewords the sentence.
  ok('the finder counts a clock hour after a cast name as an age, an overcount pass MC accepted', agePhrases(['Savanah woke at six.']).length === 1);
  ok('the finder reads every form of a stated age the stories use, and none of the counts, times, sizes or prices', ages.every((t) => agePhrases([t]).length === 1) && notAges.every((t) => agePhrases([t]).length === 0), [...ages.filter((t) => agePhrases([t]).length !== 1), ...notAges.filter((t) => agePhrases([t]).length)].join(' | ')); }
// Careers (pass MF, Mikey: Q13 "No, she is a CTO for a medical equipment company."; Q15 "a history teacher only"): no story
// with Savanah in its cast gives her a sonographer's work, and none with Georgette makes her a nurse, in its words, its about
// line or its picture lines. The alignment read: a career is a fact a machine can read, so a later edit cannot quietly undo it.
// The second read: a story names its person in its words as often as in its cast, and a nurse sentence may say she, so the check
// reads every story that names Savanah or Georgette anywhere and fails any sentence that makes someone in it a nurse.
{ const told = (x) => [x.about || '', x.alt || '', ...(x.words || []), ...(x.more || []).map((m) => m.alt || '')].join(' ');
  const sonographer = (t) => /sonograph/i.test(t);
  const nurse = (t) => /\b(?:was|had been|worked as|became|retired as)\s+(?:a|an|the)\s+(?:\w+\s+)?nurse\b|\bnursing\b/i.test(t);
  const names = (x, n) => (x.cast || []).includes(n) || new RegExp(`\\b${n}\\b`).test(told(x));
  const bad = [...LONG_ENTRIES.map(([id, x]) => [id, x]), ...Object.entries(STORIES)].filter(([, x]) => (names(x, 'Savanah') && sonographer(told(x))) || (names(x, 'Georgette') && nurse(told(x)))).map(([id]) => id);
  ok('no story makes Savanah a sonographer or Georgette a nurse (pass MF, Q13 and Q15)', bad.length === 0 && sonographer('Savanah was a cardiac sonographer.') && nurse('Georgette had been a nurse for forty years.') && nurse('She had been a nurse for forty years.') && !nurse('Georgette volunteered beside Nurse Okafor.'), bad.join(', '));
  // The path (pass MG, Mikey: "Savanah isn't always CTO.  She gets there through hard work and starts in customer service."):
  // she is the chief technology officer only from the adult chapter on (grades 9 to 12, and college), never in a story of an
  // earlier chapter, whose clock has her a child, a teen on the farm or a young woman starting out (docs/CHARACTERS.md).
  const chief = (t) => /chief tech\w* officer|chief of technology|technology chief|head of technology|\bC\.?T\.?O\b/i.test(t);
  const gradeOf = (id) => { const c = L.getCourse(id) || L.getCourse((L.getModule(id) || {}).courseId); return c ? c.grade : null; };
  const early = (id) => !['9', '10', '11', '12', 'C'].includes(gradeOf(id));
  const tooSoon = [...LONG_ENTRIES.map(([id, x]) => [id, x]), ...Object.entries(STORIES)].filter(([id, x]) => names(x, 'Savanah') && chief(told(x)) && early(id)).map(([id]) => id);
  ok('Savanah is a chief technology officer only from the adult chapter on, since she works her way up from customer service (pass MG)', tooSoon.length === 0 && chief('Savanah was the chief technology officer of a company.') && chief('the technology chief of a company') && chief('the chief technical officer') && chief('head of technology') && chief('the C.T.O.') && !chief('a first job in customer service') && early('sexual-health-6') && !early('psychology-9') && !early('psychology-college'), tooSoon.join(', '));
}
// Course stories: one longer story per course, still under the Gladwell ceiling for older readers, with three paragraphs and a scene.
// The next long stories (pass MH) are always doubled, belong to a course that has its first long story, and carry serials of
// their own: no CS serial is used twice across both kinds.
ok('every next long story belongs to a real course that has its first long story', Object.keys(MASTERY_STORIES).every((id) => L.getCourse(id) && COURSE_STORIES[id]), Object.keys(MASTERY_STORIES).filter((id) => !L.getCourse(id) || !COURSE_STORIES[id]).join(','));
{ const longSerials = LONG_ENTRIES.flatMap(([, s]) => [s.art, ...(s.more || []).map((m) => m.serial)]);
  ok('every long-story picture serial is a CS number used once, across both kinds of long story', new Set(longSerials).size === longSerials.length && longSerials.every((x) => /^CS\d+$/.test(x)), longSerials.filter((x, i) => longSerials.indexOf(x) !== i).join(',')); }
for (const [, cs, id] of LONG_ENTRIES) {
  const words = cs.words.join(' ').split(/\s+/).length;
  // A long story is either the original (three paragraphs, under 350 words) or doubled (2026-09-24, Mikey): six or more
  // paragraphs of 400 to 460 words, with five more pictures after five different paragraphs, spread over both halves. The floor
  // is held since pass MC, when an edit that took two ages out left reading-college at 398 and only docs/STORY-LENGTH.md saw it.
  const doubled = words > 350 || id.startsWith('mastery:'); const af = (cs.more || []).map((m) => m.after); const half = cs.words.length / 2;
  ok(`${id}: course story has a title, a scene and its length (three paragraphs under 350 words, or doubled to six or more, 400 to 460)`, (doubled ? words >= 400 && words <= 460 && cs.words.length >= 6 : words <= 350 && cs.words.length === 3) && !!cs.title && !!cs.alt && /^CS\d+$/.test(cs.art), `${words} words`);
  if (doubled) ok(`${id}: a doubled long story has five more pictures after five different paragraphs in both halves`, af.length === 5 && new Set(af).size === 5 && af.some((a) => a < half) && af.some((a) => a >= half) && af.every((a) => a >= 0 && a < cs.words.length) && cs.more.every((m) => /^CS\d+$/.test(m.serial) && m.alt), af.join(','));
}
// Read-aloud rule for the early years (2026-09-23, Mikey): pre-K to grade 2 stories are spoken to five-year-olds, so no
// sentence runs past eighteen words (twelve until 2026-09-28, when Mikey asked for flowing, varied sentences over clipped
// ones; eighteen still fits one breath) and no word past three syllables (vowel groups, a silent e dropped).
{
  const L = await import('../src/logic.mjs');
  const early = new Set(['PK3', 'PK4', 'K', '1', '2']);
  const bad = [];
  for (const m of L.MODULES) { const st = STORIES[m.id]; const c = L.getCourse(m.courseId); if (!st || !c || !early.has(c.grade)) continue;
    for (const par of st.words) for (const sent of par.split(L.SENTENCE_BREAK)) { const ws = sent.split(/\s+/).filter(Boolean); if (ws.length > 18) bad.push(`${m.id}: ${ws.length} words`); } }
  // Since pass LE (Mikey) the eighteen-word sentence and the three-syllable word are guidelines, kept when a longer sentence or
  // word carries educational value or another rule needs it, so this reports rather than fails; the writer judges each one.
  // Since pass LY (Mikey: "The three syllables rule is really not a big deal") syllables are no longer counted; words are
  // chosen for meaning, and a lesson's own word is always right.
  console.log(`NOTE - early-years stories over the read-aloud guideline (sentences past eighteen words): ${bad.length}${bad.length ? ' (' + bad.slice(0, 6).join(' | ') + ')' : ''}`);
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
// Coloring pages from lessons (2026-09-24, Mikey): exactly one page for every pre-K to grade 2 lesson and none for older
// ones, serials D28 upward with no gaps or repeats, a plain scene with no numbers in it, and the listing rule: a page shows
// only when its lesson is passed and its art exists.
{
  const earlyIds = L.MODULES.filter((m) => ['PK3', 'PK4', 'K', '1', '2'].includes((L.getCourse(m.courseId) || {}).grade)).map((m) => m.id);
  const pageIds = Object.keys(COLOR_PAGES); const serials = Object.values(COLOR_PAGES).map(([s]) => s);
  ok('every early-years lesson has one coloring page and no older lesson has one', pageIds.length === earlyIds.length && earlyIds.every((id) => COLOR_PAGES[id]), `${pageIds.length} pages, ${earlyIds.length} lessons`);
  ok('lesson coloring pages run D28 upward with no gaps or repeats', serials.every((s, i) => s === `D${28 + i}`), serials.slice(0, 3).join(','));
  ok('every lesson coloring page has a plain scene with no numbers in it', Object.values(COLOR_PAGES).every(([, scene]) => scene && !/\d/.test(scene) && scene.split(/\s+/).length >= 4));
  const first = earlyIds[0]; const has = (s) => s === COLOR_PAGES[first][0];
  ok('a lesson page shows only once its lesson is passed and its art exists', L.lessonColorPages([], has, COLOR_PAGES).length === 0 && L.lessonColorPages([first], has, COLOR_PAGES).join() === `lesson-${first}` && L.lessonColorPages([earlyIds[1]], has, COLOR_PAGES).length === 0);
  ok('a lesson page is titled by its lesson', L.pictureTitle(`lesson-${first}`) === L.MODULES.find((m) => m.id === first).title);
}

// Early-years stories flow (2026-09-28, Mikey): every story from pre-K 3 to grade 2 reads the way a picture book reads
// aloud, connected and varied, never a run of clipped lines. The rules are the flow audit's; this holds them at zero.
{
  const L = await import('../src/logic.mjs');
  const { flowFlags } = await import('../tools/story-flow.mjs');
  const early = new Set(['PK3', 'PK4', 'K', '1', '2']);
  const bad = [];
  for (const m of L.MODULES) { const st = STORIES[m.id]; const c = L.getCourse(m.courseId); if (!st || !c || !early.has(c.grade)) continue;
    st.words.forEach((p, i) => { const f = flowFlags(p, { moral: i === st.words.length - 1 }); if (f.flags.length) bad.push(`${m.id} paragraph ${i + 1}: ${f.flags.join(', ')}`); }); }
  ok('early-years stories flow: no paragraph reads robotic (choppy, monotone, then then)', bad.length === 0, bad.slice(0, 6).join(' | '));
}

// Every story lists on the Story Log and pages into the book with its pictures (2026-09-28, Mikey, pass FR). The Story Log
// asks logic (storyLogAvailable, recentReads) what a student has, and the book asks logic (bookPages) for its pages, so
// this test walks every course the way the screens do: a fresh student sees every module story unread and every long
// story locked; reading one moves it to Read and to Most recent, newest first; and the book, paged twice (nothing painted,
// everything painted), holds every paragraph exactly once, in order, with each picture on the same sheet as its
// paragraph, and no sheet fuller than the paper.
{
  const L = await import('../src/logic.mjs');
  const S = await import('../src/stories.mjs');
  const fresh = L.storyLogAvailable([], S.storyFor, S.courseStoryFor, S.masteryStoryFor);
  const shortIds = new Set(fresh.shorts.map((s) => s.moduleId)); const longIds = new Set(fresh.longs.map((l) => l.courseId));
  const missingShort = Object.keys(STORIES).filter((id) => !shortIds.has(id));
  ok('a fresh student\'s Story Log lists every module story, each unread', missingShort.length === 0 && fresh.shorts.every((s) => s.at === null) && fresh.shorts.length === Object.keys(STORIES).length, missingShort.slice(0, 5).join(','));
  const missingLong = Object.keys(COURSE_STORIES).filter((id) => !longIds.has(id));
  // Since pass MH a first long story counts the lessons still to pass and a next one the lessons still to master.
  const longReadIds = new Set(fresh.longs.map((l) => l.moduleId)); const missingNext = Object.keys(MASTERY_STORIES).filter((id) => !longReadIds.has(`mastery:${id}`));
  ok('a fresh student\'s Story Log lists every long story, the first and the next, each locked with every lesson still to pass or to master', missingLong.length === 0 && missingNext.length === 0 && fresh.longs.every((l) => !l.unlocked && l.at === null && l.left === L.getCourse(l.courseId).modules.length && l.left > 0 && l.unit === (l.kind === 'mastery' ? 'master' : 'pass')), [...missingLong, ...missingNext].slice(0, 5).join(','));
  ok('every long story belongs to a real course with modules', Object.keys(COURSE_STORIES).every((id) => L.getCourse(id) && L.getCourse(id).modules.length > 0), Object.keys(COURSE_STORIES).filter((id) => !L.getCourse(id)).join(','));
  ok('every story shows a title on the Story Log', Object.values(STORIES).every((st) => L.titleCase(st.title).trim().length > 0) && LONG_ENTRIES.every(([, st]) => String(st.title).trim().length > 0));
  // Reading moves a story: first opening counts, Most recent is today's reading or the last three, newest first.
  const ids = Object.keys(STORIES).slice(0, 5); const cid = Object.keys(COURSE_STORIES)[0];
  const evs = ids.map((id, i) => L.makeStoryReadEvent(id, `2026-09-0${i + 1}T10:00:00.000Z`)).concat([L.makeStoryReadEvent(ids[0], '2026-09-09T10:00:00.000Z'), L.makeStoryReadEvent(`course:${cid}`, '2026-09-10T10:00:00.000Z')]);
  const after = L.storyLogAvailable(evs, S.storyFor, S.courseStoryFor);
  ok('a story read moves to Read at its first opening, and a long story read is marked read', ids.every((id) => (after.shorts.find((s) => s.moduleId === id) || {}).at) && (after.shorts.find((s) => s.moduleId === ids[0]) || {}).at === '2026-09-01T10:00:00.000Z' && after.shorts.filter((s) => s.at).length === 5 && !!(after.longs.find((l) => l.courseId === cid) || {}).at);
  const recent = L.recentReads(evs, new Date('2026-09-20T12:00:00.000Z'));
  ok('Most recent with nothing read today is the last three stories opened, newest first', recent.length === 3 && recent[0].moduleId === `course:${cid}` && recent[1].moduleId === ids[4] && recent[2].moduleId === ids[3], recent.map((r) => r.moduleId).join(','));
  const today = new Date(); const stamp = new Date(today.getTime() - 60000).toISOString();
  const todays = L.recentReads(evs.concat([L.makeStoryReadEvent(Object.keys(STORIES)[6], stamp)]), today);
  ok('Most recent shows today\'s reading when there is any', todays.length === 1 && todays[0].at === stamp, todays.map((r) => r.moduleId).join(','));
  // The book, twice over: nothing painted (pairs of short stories share a sheet) and everything painted (every story on
  // sheets of its own). A page is a part of one story: its paragraphs run in order with no gap, every picture's paragraph
  // is on that page, the first page carries the title and main picture, and the sheet is never fuller than the paper.
  const P = L.PRINT_PAGE; const bad = []; let pages = 0; let courses = 0;
  const checkStory = (label, st, parts, painted) => {
    if (!parts.length) { bad.push(`${label}: no pages`); return; }
    let next = 0;
    parts.forEach((part, k) => {
      if (part.head !== (k === 0)) bad.push(`${label}: page ${k + 1} ${part.head ? 'repeats the title' : 'has no title'}`);
      if (part.from !== next || part.to < part.from) bad.push(`${label}: page ${k + 1} runs ${part.from} to ${part.to}, expected to start at ${next}`);
      if (part.used > P.room + 0.001) bad.push(`${label}: page ${k + 1} needs ${part.used} inches of ${P.room}`);
      next = part.to + 1;
    });
    if (next !== st.words.length) bad.push(`${label}: pages end at paragraph ${next} of ${st.words.length}`);
    // Every picture lands on the page of its own paragraph: no paragraph is parted from its picture.
    for (const m of st.more || []) { const page = parts.findIndex((p) => m.after >= p.from && m.after <= p.to); if (page < 0) bad.push(`${label}: picture ${m.serial} after paragraph ${m.after} is on no page`); }
  };
  for (const c of L.COURSES) {
    const chapters = c.modules.map((m) => ({ m, st: STORIES[m.id] })).filter((x) => x.st); const cs = COURSE_STORIES[c.id] || null; const ms = MASTERY_STORIES[c.id] || null;
    if (!chapters.length && !cs) continue;
    courses += 1;
    for (const painted of [false, true]) {
      const { groups, csParts, msParts } = L.bookPages(chapters, cs, () => painted, ms);
      // Each chapter appears once, in course order, its parts on consecutive pages; two stories share a page only unpainted.
      const seen = groups.flatMap((g) => g.items.map((it) => it.i));
      const order = chapters.map((_, i) => i); const heads = groups.flatMap((g) => g.items.filter((it) => !it.part || it.part.head).map((it) => it.i));
      if (heads.join(',') !== order.join(',')) bad.push(`${c.id}${painted ? ' painted' : ''}: chapters ${heads.join(',')} for ${order.join(',')}`);
      if (painted && groups.some((g) => g.items.length > 1)) bad.push(`${c.id} painted: two stories on one sheet`);
      if (groups.some((g) => g.items.length > g.per || g.items.length === 0)) bad.push(`${c.id}${painted ? ' painted' : ''}: a sheet holds more than its share`);
      chapters.forEach((ch, i) => { const parts = groups.flatMap((g) => g.items.filter((it) => it.i === i).map((it) => it.part || { head: true, from: 0, to: ch.st.words.length - 1, used: 0 })); checkStory(`${c.id}/${ch.m.id}${painted ? ' painted' : ''}`, ch.st, parts, painted); });
      if (cs) checkStory(`${c.id}/long${painted ? ' painted' : ''}`, cs, csParts, painted);
      if (ms) checkStory(`${c.id}/next long${painted ? ' painted' : ''}`, ms, msParts, painted);
      if (!ms && msParts.length) bad.push(`${c.id}: pages for a next long story it does not have`);
      if (seen.length < chapters.length) bad.push(`${c.id}: ${seen.length} placements for ${chapters.length} chapters`);
      if (painted) pages += groups.length + csParts.length + msParts.length;
    }
  }
  ok(`every course's book pages every story with its pictures, painted or not (${courses} courses, ${pages} painted sheets)`, bad.length === 0 && courses === L.COURSES.filter((c) => c.modules.some((m) => STORIES[m.id]) || COURSE_STORIES[c.id]).length, bad.slice(0, 6).join(' | '));
  // A paragraph with its picture always fits a sheet of its own, so the book never has to part them.
  const tall = [];
  for (const [id, st] of [...Object.entries(STORIES), ...LONG_ENTRIES.map(([, v, label]) => [`long:${label}`, v])]) {
    st.words.forEach((par, i) => { const parts = L.printParts([par], [0], true); if (parts.length !== 1 || parts[0].used > P.room) tall.push(`${id} paragraph ${i + 1}: ${parts[0] ? parts[0].used : '?'} inches`); });
  }
  ok('every paragraph fits one sheet beside its picture, under the title and main painting', tall.length === 0, tall.slice(0, 5).join(' | '));
  // The book's last pages (pass MA): the state's standards each story serves fill as many sheets as they need, a story's
  // standards never split from its title, and no sheet is fuller than the room above its footer. Checked for every course in
  // both frameworks, since an educator's state picks which list prints. Before pass MA the list was one sheet, and pre-K 4
  // First Steps' list ran past its bottom.
  const { CURRICULUM } = await import('../src/curriculum.mjs');
  const overfull = []; let sheetsCounted = 0;
  for (const c of L.COURSES) for (const fw of ['TEKS', 'CCSS']) {
    const rows = c.modules.filter((m) => STORIES[m.id]).map((m, i) => ({ i, m, list: CURRICULUM.flatMap((e) => e.standards).filter((st) => st.framework === fw && (st.moduleIds || []).includes(m.id)) })).filter((r) => r.list.length);
    if (!rows.length) continue;
    const sheets = L.standardsSheets(rows); sheetsCounted += sheets.length;
    const placed = sheets.flatMap((sh) => sh.rows.map((r) => r.m.id));
    if (placed.join(',') !== rows.map((r) => r.m.id).join(',')) overfull.push(`${c.id} ${fw}: stories out of place`);
    sheets.forEach((sh, k) => { if (sh.used > L.STANDARDS_PAGE.room + 0.001) overfull.push(`${c.id} ${fw} sheet ${k + 1}: ${sh.used} inches of ${L.STANDARDS_PAGE.room}`); });
  }
  ok(`every course's standards pages fit their sheets (${sheetsCounted} sheets)`, overfull.length === 0, overfull.slice(0, 5).join(' | '));
}

// Audio tags (pass JH): a story's `audio` is its `words` with Eleven v4 tags added and nothing else changed, the words never
// carry a tag, and every story fits one Eleven v4 request (10,000 characters).
{
  const stripTags = (p) => String(p).replace(/\[[^\]]*\]\s*/g, '').replace(/\s+/g, ' ').trim();
  const all = Object.entries(STORIES);
  const tagged = all.filter(([, s]) => s.audio);
  ok(`tagged stories keep their words exactly (${tagged.length} tagged)`, tagged.every(([, s]) => s.audio.length === s.words.length && s.audio.every((p, i) => stripTags(p) === s.words[i].replace(/\s+/g, ' ').trim())));
  ok('no story shows a tag to readers', all.every(([, s]) => s.words.every((p) => !/[\[\]]/.test(p))));
  ok('every tag is a short phrase in one pair of brackets', tagged.every(([, s]) => s.audio.every((p) => (p.match(/\[[^\[\]]{1,60}\]/g) || []).length === (p.match(/\[/g) || []).length)));
  ok('every story fits one Eleven v4 request of 10,000 characters', all.every(([, s]) => (s.audio || s.words).join(' ').length + s.title.length < 9000));
  // Long stories carry tags too (pass LT): where a long story has audio, it is its words with tags and nothing else, its tags
  // are short phrases in one pair of brackets, no long story shows a tag to readers, and an early-years one closes [slowly, warmly].
  const longTagged = LONG_ENTRIES.filter(([, s]) => s.audio).map(([id, s]) => [id, s]);
  ok(`tagged long stories keep their words exactly (${longTagged.length} tagged)`, longTagged.length >= 2 && longTagged.every(([, s]) => s.audio.length === s.words.length && s.audio.every((p, i) => stripTags(p) === s.words[i].replace(/\s+/g, ' ').trim())));
  ok('every long-story tag is a short phrase in one pair of brackets, and no long story shows a tag to readers', longTagged.every(([, s]) => s.audio.every((p) => (p.match(/\[[^\[\]]{1,60}\]/g) || []).length === (p.match(/\[/g) || []).length)) && LONG_ENTRIES.every(([, s]) => s.words.every((p) => !/[\[\]]/.test(p))));
  ok('a tagged early-years long story closes [slowly, warmly]', longTagged.every(([id, s]) => { const c = L.getCourse(id); return !c || !early.has(c.grade) || /^\[slowly, warmly\]/.test(s.audio[s.audio.length - 1]); }));
}

// The tag floor (pass MJ, the alignment read): no paragraph carries more than four tags; Very First Steps' stories, read at the
// refined standard, leave no paragraph untagged and close on [slowly, warmly] alone; elsewhere the untagged paragraphs (55) and the
// early-years morals that are not [slowly, warmly] alone (14) may only fall, as each course is read. Since pass MK both pre-K 3
// courses are held (Listen and Point's next long story closed on [slowly, warmly] and then [gently]), and the morals are 13.
// Since pass ML First Steps is held the same way (the alignment read).
{ const UNTAGGED_LIMIT = 52; const MORALS_LIMIT = 13; const EARLY = new Set(['PK3', 'PK4', 'K', '1', '2']);
  const gradeOf = (id) => { const c = L.COURSES.find((x) => x.id === id || x.modules.some((m) => m.id === id)); return c ? c.grade : null; };
  const vfs = new Set(['very-first-steps-pk3', 'listen-and-point-pk3', 'first-steps-pk', 'first-sounds-pk'].flatMap((cid) => [`course:${cid}`, `mastery:${cid}`, ...((L.COURSES.find((c) => c.id === cid) || { modules: [] }).modules.map((m) => m.id))]));
  const all = [...Object.entries(STORIES).map(([id, s]) => [id, s, gradeOf(id)]), ...Object.entries(COURSE_STORIES).map(([id, s]) => [`course:${id}`, s, gradeOf(id)]), ...Object.entries(MASTERY_STORIES).map(([id, s]) => [`mastery:${id}`, s, gradeOf(id)])];
  const over = []; const untagged = []; const morals = []; const vfsBad = [];
  for (const [id, s, g] of all) {
    if (!s.audio) continue; const a = [].concat(s.audio);
    a.forEach((p, i) => { const n = (p.match(/\[[^\]]+\]/g) || []).length; if (n > 4) over.push(`${id} ${i}`); if (n === 0) { untagged.push(`${id} ${i}`); if (vfs.has(id)) vfsBad.push(`${id} ${i} untagged`); } });
    if (EARLY.has(g)) { const last = a[a.length - 1]; const tags = last.match(/\[[^\]]+\]/g) || []; if (!(tags.length === 1 && last.startsWith('[slowly, warmly]'))) { morals.push(id); if (vfs.has(id)) vfsBad.push(`${id} moral`); } }
  }
  ok('no story paragraph carries more than four tags, and the reviewed pre-K courses (pre-K 3\'s two, since pass ML First Steps and since pass MM First Sounds and Letters) leave none untagged and close on [slowly, warmly] alone', over.length === 0 && vfsBad.length === 0, [...over, ...vfsBad].slice(0, 6).join('; '));
  ok(`untagged paragraphs (${untagged.length}) and early-years morals not [slowly, warmly] alone (${morals.length}) stay at ${UNTAGGED_LIMIT} and ${MORALS_LIMIT} or fewer, falling as each course is read`, untagged.length <= UNTAGGED_LIMIT && morals.length <= MORALS_LIMIT, morals.slice(0, 6).join('; ')); }

// The tag floor's one beat (pass ML, the alignment read): "a paragraph of one beat, one sentence or one action and the line it
// leads to, takes one" (RULES-AUDIT section 4), and round two had read a sentence that turns at its and as two beats, so ten
// paragraphs of the reviewed pre-K courses carried two tags. In those courses a paragraph of one sentence, the moral aside,
// carries one tag at most; an action and the line it leads to is the story brief's to read.
{ const { sentencesOf } = await import('../tools/story-flow.mjs');
  const held = new Set(['very-first-steps-pk3', 'listen-and-point-pk3', 'first-steps-pk', 'first-sounds-pk'].flatMap((cid) => [`course:${cid}`, `mastery:${cid}`, ...((L.COURSES.find((c) => c.id === cid) || { modules: [] }).modules.map((m) => m.id))]));
  const all = [...Object.entries(STORIES), ...Object.entries(COURSE_STORIES).map(([id, s]) => [`course:${id}`, s]), ...Object.entries(MASTERY_STORIES).map(([id, s]) => [`mastery:${id}`, s])];
  const twoTags = []; let read = 0;
  for (const [id, s] of all) { if (!held.has(id) || !s.audio) continue; const a = [].concat(s.audio);
    s.words.forEach((w, i) => { if (i === s.words.length - 1 || sentencesOf(w).length !== 1) return; read += 1; if (((a[i] || '').match(/\[[^\]]+\]/g) || []).length > 1) twoTags.push(`${id} ${i + 1}`); }); }
  ok(`in the reviewed pre-K courses a paragraph of one sentence takes one tag, the tag floor's one beat (${read} read)`, read >= 10 && twoTags.length === 0, twoTags.join('; ')); }
// A one-off name a voice says like a letter's name (pass ML, the story check: Bea, heard as bee, the course's tiny animal, and as
// B, became Lucy in First Steps' Patterns). No early-years story names a child Bea, Dee, Jay, Kay, Elle, Vee or Zee.
{ const EARLY = new Set(['PK3', 'PK4', 'K', '1', '2']); const LETTERISH = /\b(Bea|Dee|Jay|Kay|Elle|Vee|Zee)\b/;
  const gradeOf = (id) => { const c = L.COURSES.find((x) => x.id === id || x.modules.some((m) => m.id === id)); return c ? c.grade : null; };
  const all = [...Object.entries(STORIES), ...Object.entries(COURSE_STORIES), ...Object.entries(MASTERY_STORIES)];
  const early = all.filter(([id]) => EARLY.has(gradeOf(id)));
  const named = early.filter(([, s]) => LETTERISH.test([s.title, s.about, ...(s.words || [])].join(' '))).map(([id]) => id);
  ok(`no early-years story names a child with a letter's name (Bea, Dee, Jay, Kay, Elle, Vee, Zee; ${early.length} read)`, early.length >= 200 && named.length === 0, named.join(', ')); }
// Short runs across a paragraph break (pass MK, the story check): the flow rules read inside a paragraph, so three short sentences
// could still run across a break. crossBreakRuns (tools/story-flow.mjs) finds them with the flow tool's own rules; pre-K 3 has
// none, and the early years' 15 may only fall (node tools/story-flow-audit.mjs lists them). 14 since pass ML (First Steps' read).
{ const { crossBreakRuns } = await import('../tools/story-flow.mjs'); const RUNS_LIMIT = 12; const EARLY = new Set(['PK3', 'PK4', 'K', '1', '2']);
  const gradeOf = (id) => { const c = L.COURSES.find((x) => x.id === id || x.modules.some((m) => m.id === id)); return c ? c.grade : null; };
  const all = [...Object.entries(STORIES).map(([id, s]) => [id, s]), ...Object.entries(COURSE_STORIES).map(([id, s]) => [id, s, `course:${id}`]), ...Object.entries(MASTERY_STORIES).map(([id, s]) => [id, s, `mastery:${id}`])];
  const runs = []; for (const [id, s, label] of all) { const g = gradeOf(id); if (EARLY.has(g)) for (const r of crossBreakRuns(s.words)) runs.push([g, `${label || id} ${r.map((i) => i + 1).join('-')}`]); }
  const pk3 = runs.filter(([g]) => g === 'PK3');
  ok(`short runs across a paragraph break: pre-K 3 has none, and the early years' ${runs.length} stay at ${RUNS_LIMIT} or fewer`, pk3.length === 0 && runs.length <= RUNS_LIMIT, [...pk3, ...runs].slice(0, 6).map(([g, x]) => `${g} ${x}`).join('; ')); }
// Even stretches and Then after Then across a paragraph break (pass ML, the story check's second read): the brief reads all three
// flow rules across a break, and crossBreakEven (tools/story-flow.mjs) is the tool for the other two. A course reviewed at the
// refined standard joins REVIEWED_FLOW and holds none; the rest of the early years stay under EVEN_LIMIT, which only falls.
{ const { crossBreakEven, sentencesOf } = await import('../tools/story-flow.mjs'); const EVEN_LIMIT = 65; const EARLY = new Set(['PK3', 'PK4', 'K', '1', '2']);
  const REVIEWED_FLOW = new Set(['very-first-steps-pk3', 'listen-and-point-pk3', 'first-steps-pk', 'first-sounds-pk']);
  const courseOf = (id) => L.COURSES.find((x) => x.id === id || x.modules.some((m) => m.id === id));
  const all = [...Object.entries(STORIES).map(([id, s]) => [id, s]), ...Object.entries(COURSE_STORIES).map(([id, s]) => [id, s, `course:${id}`]), ...Object.entries(MASTERY_STORIES).map(([id, s]) => [id, s, `mastery:${id}`])];
  const even = []; const held = [];
  for (const [id, s, label] of all) { const c = courseOf(id); if (!c || !EARLY.has(c.grade)) continue; for (const e of crossBreakEven(s.words)) { const row = `${label || id} ${e.rule} ${e.paras.map((i) => i + 1).join('-')}`; even.push(row); if (REVIEWED_FLOW.has(c.id)) held.push(row); } }
  ok(`even stretches and Then after Then across a paragraph break: the reviewed pre-K courses have none, and the early years' ${even.length} stay at ${EVEN_LIMIT} or fewer`, held.length === 0 && even.length <= EVEN_LIMIT, [...held, ...even].slice(0, 6).join('; '));
  // The tool's own near misses: the stretch round two found, and the same paragraphs once a sentence of the four is lengthened.
  const near = ['One.', 'The last number you say tells how many, said his teacher. You said three, so there are three stones in your row!', 'Mike put the rest back on the path where he found them. Back in class, he dropped his three in the counting jar.', 'Moral.'];
  const fixed = ['One.', near[1], 'Mike put all the rest back on the path, right where he had found them. Back in class, he dropped his three in the counting jar.', 'Moral.'];
  ok('crossBreakEven finds a stretch that crosses a break, and none once one sentence of it is lengthened', crossBreakEven(near).length === 1 && crossBreakEven(fixed).length === 0 && crossBreakEven(['Then we ran.', 'Then we sat down.', 'Moral.']).length === 1);
  // A title before a name never ends a sentence (pass MN, round one's story flow check): "Mr. Beto" was read as a break, so Can I play
  // too?'s twelve-word sentence counted as four and eight and hid an even stretch across its paragraph break.
  ok('the flow rules read "his teacher, Mr. Beto, sat down" as one sentence, and "I saw Mr. Beto. He waved." as two', sentencesOf('But his teacher, Mr. Beto, sat down beside him on the rug.').length === 1 && sentencesOf('I saw Mr. Beto. He waved.').length === 2 && sentencesOf('Ms. Reyes said the rule. Dr. King spoke.').length === 2); }

// No two stories share a title (pass MJ, the story check: pre-K 3's Two buckets shared kindergarten's, so the Story Log and the book
// listed two stories one name). Seven shared titles remain (EARMARKS A24); the number may only fall, and a renamed story comes off.
{ const SHARED_LIMIT = 7;
  const seen = new Map();
  const add = (title, id) => { const t = String(title).toLowerCase(); if (!seen.has(t)) seen.set(t, []); seen.get(t).push(id); };
  for (const [id, s] of Object.entries(STORIES)) add(s.title, id);
  for (const [id, s] of Object.entries(COURSE_STORIES)) add(s.title, `course:${id}`);
  for (const [id, s] of Object.entries(MASTERY_STORIES)) add(s.title, `mastery:${id}`);
  const shared = [...seen].filter(([, ids]) => ids.length > 1);
  ok(`no more than ${SHARED_LIMIT} story titles are shared by two stories, and none of pre-K 3's (EARMARKS A24)`, shared.length <= SHARED_LIMIT && !shared.some(([, ids]) => ids.some((id) => ['red-and-blue', 'course:very-first-steps-pk3', 'mastery:very-first-steps-pk3'].includes(id) || (L.MODULES.find((m) => m.id === id) || {}).id && L.COURSES.some((c) => c.grade === 'PK3' && c.modules.some((m) => m.id === id)))), shared.map(([t, ids]) => `${t}: ${ids.join(', ')}`).join('; ')); }

// A pre-reader's moral echoes the spoken lines (pass MM; the story brief, item 1: "A pre-reader hears the script, never the lesson's
// paragraphs, so a pre-reader's moral echoes the spoken lines"). Every read-aloud module story's moral says at least one sentence of
// its lesson's script word for word, or four in five of its content words (the small words left out, a plural read as its
// singular) are words the script says. Seven morals of the reviewed pre-K courses paraphrase, and each was read and kept, with its
// reason (MORAL_KEPT); the morals of courses not yet reviewed at the refined standard wait by name (MORAL_WAITING), to be read
// with their course. Both lists only fall: a moral that comes to echo its script leaves its list, and no other may miss.
{ const { sentencesOf } = await import('../tools/story-flow.mjs');
  const STOP = new Set('a an the and or but so to of in on at for with is are was were be it its this that these those you your we our i he she they them his her my me us do does did not no yes can will just one two three four five six seven eight nine ten each every then than as if when what which who how there here up out by from all some more'.split(' '));
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim();
  const content = (s) => norm(s).split(' ').filter((w) => w && !STOP.has(w)).map((w) => w.replace(/'s$/, '').replace(/(?<=..)s$/, ''));
  const MORAL_KEPT = {
    'first-marks': 'the lesson\'s own "Start at the dot", with "follow the line", what the tracing pad asks of the hand',
    'yellow-and-green': 'the lesson\'s banana and grass and "easy to see ... because the colors are different", said as "like" and "tell apart"',
    'big-and-little': 'the lesson\'s first two lines nearly word for word, then the story\'s own ending, how Lena knew her shoes',
    'one-more-one-fewer': 'the lesson\'s "Adding one makes more" and "Taking one away makes fewer", said as "one more" and "taken away"',
    'match-the-water-animals': 'the lesson\'s two whales and the whale and the fish, after "Look closely", the matching lessons\' own words',
    'match-the-shapes': 'the lesson\'s corners and sides, then the story\'s shape sorter, "Same shape, same hole"',
    'first-strokes': 'the lesson\'s "smooth" wave and "sharp points" zigzag, after "follow the line", what the tracing pad asks of the hand',
  };
  // tell-and-show (kindergarten technology) joined in round two, when a sentence of two words stopped counting as an echo.
  const MORAL_WAITING = ['tell-and-show', 'teen-numbers', 'subtracting-to-20', 'writing-numbers', 'quick-looks', 'counting-to-120', 'number-sentences-and-stories', 'solid-shapes-1', 'measuring-length', 'tallies-and-graphs', 'kinds-of-weather', 'hot-and-cold', 'kinds-of-rocks', 'our-flag-and-holidays', 'families-and-traditions', 'signs-around-town', 'then-and-now', 'producers-and-consumers', 'maps-of-our-town', 'saving-for-a-goal', 'my-listening-body', 'first-then-do', 'my-clear-voice', 'my-turn-and-kind-words', 'my-brain-and-senses', 'remember-it', 'i-wonder', 'plants-we-eat-k', 'seed-to-plant-k', 'farm-animals-k', 'a-day-on-the-farm-k', 'earning-money-k', 'wants-and-needs-k', 'save-spend-share-k', 'borrow-and-make-k', 'lines-shapes-and-colors', 'voices-and-instruments', 'hard-or-soft', 'magnets', 'habitats', 'shapes', 'more-and-fewer-10', 'letter-names', 'rhymes'];
  const REVIEWED = new Set(['very-first-steps-pk3', 'listen-and-point-pk3', 'first-steps-pk', 'first-sounds-pk']);
  const missed = []; let read = 0;
  for (const c of L.COURSES) { if (!c.readAloud) continue;
    for (const m0 of c.modules) { const m = L.MODULES.find((x) => x.id === m0.id); const s = STORIES[m.id]; if (!s) continue; read += 1;
      const script = L.readAloudScript(m).map((x) => x.say || '').join(' '); const heard = norm(script); const said = new Set(content(script));
      const moral = s.words[s.words.length - 1]; const cw = content(moral);
      // A sentence counts as the script's word for word only with four words or more, matched at word boundaries (round two's code
      // check: a substring test let a one-word moral, or a fragment of a script sentence, pass).
      const echoes = (x) => { const n = norm(x); return n.split(' ').length >= 4 && ` ${heard} `.includes(` ${n} `); };
      if (!sentencesOf(moral).some(echoes) && cw.filter((w) => said.has(w)).length < 0.8 * cw.length) missed.push([c.id, m.id]); } }
  const unlisted = missed.filter(([, id]) => !MORAL_KEPT[id] && !MORAL_WAITING.includes(id)).map(([c, id]) => `${c}/${id}`);
  const keptInReviewed = missed.filter(([c, id]) => MORAL_KEPT[id] && REVIEWED.has(c)).length;
  const stale = [...Object.keys(MORAL_KEPT), ...MORAL_WAITING].filter((id) => !missed.some(([, x]) => x === id));
  const waitingInReviewed = missed.filter(([c, id]) => MORAL_WAITING.includes(id) && REVIEWED.has(c)).map(([, id]) => id);
  ok(`every read-aloud moral echoes its lesson's spoken lines, or is kept with its reason (${keptInReviewed} in the reviewed pre-K courses) or waits for its course's review (${MORAL_WAITING.length}); both lists only fall`, read >= 190 && unlisted.length === 0 && stale.length === 0 && waitingInReviewed.length === 0 && keptInReviewed === Object.keys(MORAL_KEPT).length,
    `${read} read; missing a reason: ${unlisted.join(', ')}; echoing now, so off the list: ${stale.join(', ')}; waiting in a reviewed course: ${waitingInReviewed.join(', ')}`); }
// No pre-K story or picture puts something a young child can choke on within reach (pass MM, the workflow review: an unsafe scene
// for a young child came back in ten of the twelve passes from MA to ML, and only the pre-K 3 experiments were tested). The
// experiments' choking list (the AAP's, and the CPSC small-parts cylinder), with acorns, seeds, hard candy, cherry tomatoes, hot dogs,
// gum, magnets and batteries added, is read in every pre-K module story and long story and in every picture row of a pre-K lesson,
// story or coloring page; a coat's buttons are clothing, not a button. A hit passes only when SAFETY_READ lists it with the
// reason it is safe in that scene, and an entry nothing hits any more leaves the list.
{ const { readFileSync } = await import('node:fs');
  const CHOKE = /\b(coins?|pennies|penny|buttons?(?![-\w])|corks?|pebbles?|marbles?|beads?|raisins?|grapes?|popcorn|peanuts?|nuts?|balloons?|small toys?|acorns?|seeds?|hard cand(?:y|ies)|cherry tomato(?:es)?|hot dogs?|chewing gum|gum|magnets?|batter(?:y|ies))\b/gi;
  const item = (w) => { const x = w.toLowerCase(); return x.startsWith('batter') ? 'battery' : x === 'pennies' ? 'penny' : x.replace(/s$/, ''); };
  const SAFETY_READ = {
    'patterns bead': 'big beads for stringing a necklace, said big in the words and asked big in the pictures, a pre-K classroom material; Mom is there at the end',
    'a-and-b acorn': 'pointed at on the ground under the oak, never picked up; its picture asks for the acorn on the ground, not in his hand, his grandma beside him',
    'match-the-things balloon': 'a whole balloon, blown up, on a string, that Mom ties to a chair',
    'match-the-things small toy': 'a toy robot standing in the grass beside a butterfly, painted, never handled',
    'first-steps-pk battery': 'a battery lantern hanging on a hook at the tent door, never a loose battery',
    'circle-and-square small toy': 'a small toy ramp on the floor, far too big to swallow',
    'draw-the-shapes button': 'a button on a table, painted from above as a round shape found at home, never handled',
    'first-marks balloon': 'a balloon drawn on paper, the page a child colors',
    // A pre-K lesson's own lines, read since round two's code check (pass MM).
    'lesson:four-feelings balloon': 'a whole balloon floating away into the sky, out of reach, the reason a child feels sad',
    'lesson:a-and-b acorn': 'a word that starts with A, said and shown as a word, never an acorn in a child\'s hand',
    'lesson:match-the-things balloon': 'a whole balloon on its string, drawn beside a ball to be told apart',
    'lesson:patterns bead': 'big beads on a string, said big since pass MM wherever the lesson shows beads or asks a child to string them (the paragraph, line 9 and its painting P117; line 7 names beads among the patterns around us and shows shapes), a pre-K classroom material',
    'lesson:draw-the-shapes button': 'a button named for its round shape, a thing to find and look at, never handled',
  };
  const PREK = new Set(['PK3', 'PK4']); const courseOf = (id) => L.COURSES.find((c) => c.id === id || c.modules.some((m) => m.id === id));
  const hits = new Map(); let stories = 0; let rows = 0;
  const note = (subject, text, where) => { for (const m of text.matchAll(CHOKE)) { const k = `${subject} ${item(m[0])}`; if (!hits.has(k)) hits.set(k, where); } };
  for (const [id, s] of [...Object.entries(STORIES), ...Object.entries(COURSE_STORIES), ...Object.entries(MASTERY_STORIES)]) { const c = courseOf(id); if (!c || !PREK.has(c.grade)) continue; stories += 1; s.words.forEach((p, i) => note(id, p, `${id} paragraph ${i + 1}`)); }
  // Every pre-K lesson's own words too: paragraphs, key idea, example caption and spoken lines (round two's code check, pass MM).
  let lessons = 0;
  for (const c of L.COURSES.filter((x) => PREK.has(x.grade))) for (const m0 of c.modules) { const m = L.MODULES.find((x) => x.id === m0.id); const l = (m && m.lesson) || {}; lessons += 1;
    [...(l.paragraphs || []), l.keyIdea || '', (l.example && l.example.caption) || '', ...(l.script || []).map((x) => x.say || '')].forEach((t) => note(`lesson:${m.id}`, String(t), `${m.id}'s lesson`)); }
  for (const line of readFileSync(new URL('../docs/ART-REQUESTS.md', import.meta.url), 'utf8').split('\n')) {
    const m = /^\| ([A-Z]+\d+) \| ([\w-]+) \| ([^|]*) \| ([^|]*) \|/.exec(line); if (!m) continue; const subject = m[2].replace(/^lesson-/, ''); const c = courseOf(subject);
    if (!c || !PREK.has(c.grade)) continue; rows += 1; note(subject, `${m[3]} ${m[4]}`, `${m[1]}`); }
  const unread = [...hits.entries()].filter(([k]) => !SAFETY_READ[k]).map(([k, where]) => `${k} (${where})`);
  const stale = Object.keys(SAFETY_READ).filter((k) => !hits.has(k));
  ok(`no pre-K story, lesson or picture puts a choking hazard within reach unless its scene was read and its reason listed (${stories} stories, ${lessons} lessons, ${rows} picture rows, ${hits.size} hits read)`, stories >= 50 && lessons >= 45 && rows >= 300 && unread.length === 0 && stale.length === 0,
    `unread: ${unread.join(', ')}; listed but no longer there: ${stale.join(', ')}`); }

// A young child near a height, water or a road has a grown-up nearby, in pictures as in stories (FABLE-REVIEW; the picture brief's
// rule 7). Pass MN, round one: S3908 and S3910 put a four-year-old at and on a tall slide with no grown-up, and D244 two children at
// a slide's foot, the unsafe-scene class's twelfth pass in fourteen (docs/MISTAKE-CLASSES.md, rank 1; round two's story check found D60's
// child swinging high with no grown-up, whose reason covered only the slide behind, so D60 has a teacher on the bench since). Every early-years picture
// row, a story's, a lesson painting's, a long story's or a coloring page's, that names a child and a height, water or a road, and
// no grown-up in its prompt (what is painted: a check note's grown-up paints nobody), passes only when HEIGHT_READ gives the reason
// it is safe in that scene; kindergarten's to grade 2's wait by name for
// their courses' reviews, and both lists only fall.
{ const { readFileSync } = await import('node:fs');
  const RISK = /\b(slides?|ladders?|climb\w*|jungle gym|monkey bars|tree ?house|branch|pool|lake|river|pond|ocean|beach|creek|stream|waves?|road|street|crosswalk|parking lot|curb|cliff|rooftop|stairs)\b/i;
  const CHILD = /\b(child|children|boy|girl|kids?|baby|toddler)\b/i;
  const ADULT = /\b(grown-ups?|woman|man|teacher|mom|mother|dad|father|grandpa|grandma|grandmother|grandfather|parent|lifeguard|adult|aunt|uncle|coach|librarian|crossing guard)\b/i;
  const HEIGHT_READ = {
    S161: 'a road printed on a play mat, a toy on the playroom floor',
    S3859: 'a beach ball, a toy, on the playroom floor',
    S1462: 'climbing onto a swing seat a friend holds still, at no height',
    CS652: 'a river seen far below through a train window, the girl inside the train',
  };
  const WAITING_K2 = ['S222', 'S239', 'S263', 'S275', 'S314', 'S338', 'S380', 'S401', 'S407', 'S434', 'S1593', 'S1644', 'S1681', 'S1718', 'S2784', 'S2891', 'S3245', 'S3659', 'S3699', 'S3701', 'S3702', 'S3765', 'S3774', 'D78', 'D99', 'D114', 'D168', 'D176', 'D212', 'D235', 'P69'];
  const courseOf = (id) => L.COURSES.find((c) => c.id === id || c.modules.some((m) => m.id === id));
  const hits = []; let rows = 0;
  for (const line of readFileSync(new URL('../docs/ART-REQUESTS.md', import.meta.url), 'utf8').split('\n')) {
    const m = /^\| ([A-Z]+\d+) \| ([\w:-]+) \| ([^|]*) \| ([^|]*) \|/.exec(line); if (!m) continue; const c = courseOf(m[2].replace(/^lesson-/, ''));
    // The drawing pages D1 to D27 name no course and are colored by the youngest too, so they are read with the early years (round three's story check).
    const drawingPage = /^D(?:[1-9]|1\d|2[0-7])$/.test(m[1]);
    if (!drawingPage && (!c || !['PK3', 'PK4', 'K', '1', '2'].includes(c.grade))) continue; rows += 1; const prompt = m[4].split('Style:')[0]; const text = `${m[3]} ${prompt}`;
    if (RISK.test(text) && CHILD.test(text) && !ADULT.test(prompt)) hits.push(m[1]); }
  const unread = hits.filter((s) => !HEIGHT_READ[s] && !WAITING_K2.includes(s)); const stale = [...Object.keys(HEIGHT_READ), ...WAITING_K2].filter((s) => !hits.includes(s));
  // Its near misses: S3910 as round one found it, and as it is now, with his mom on the bench.
  const nearMiss = (t) => RISK.test(t) && CHILD.test(t) && !ADULT.test(t);
  const proven = nearMiss('A small girl cheering on the grass, well to one side of the slide, while a small boy zooms down a tall playground slide, cheerful and neat.') && !nearMiss('A small girl cheering on the grass while a small boy zooms down a tall playground slide, a woman watching from a park bench nearby.');
  ok(`a young child near a height, water or a road has a grown-up nearby in every early-years picture row, or its reason is read (${rows} rows read; ${Object.keys(HEIGHT_READ).length} pre-K reasons; ${WAITING_K2.length} of kindergarten to grade 2 waiting)`, rows >= 1400 && proven && unread.length === 0 && stale.length === 0, `unread: ${unread.join(', ')}; listed but no longer hit: ${stale.join(', ')}`); }

// "Almost" before a past-tense verb in an early-years story is heard as the act done (docs/MISTAKE-CLASSES.md, C14: pass MD's
// "almost grabbed the ball and ran off" was heard as running off, and pass MN's "Gabe almost giggled too" as giggling at an
// embarrassed friend, the act the lesson calls unkind; the story check, round one). A wish says it ("Gabe wanted to giggle too").
// Since round two's story check nearly is read with almost, and the past verbs that do not end in -ed a story tells (hid, sat, saw;
// since round three did, found, won, held, knew and felt), while a word that only ends in -ed (red, bed, seed) is not a verb.
// Kindergarten's Safe and kind online waits for its review ("Omar almost said it"), and the list only falls.
{ const ALMOST = /\b(?:almost|nearly) (?!(?:red|bed|shed|sled|seed|need|weed|speed|feed)\b)(?:[a-z]+ed|said|ran|took|fell|hit|went|threw|ate|broke|bit|got|gave|made|let|caught|slid|forgot|left|lost|tore|told|hid|sat|saw|had|came|stood|swung|did|found|won|held|knew|felt)\b/i;
  const ALMOST_WAITING = ['safe-online-k'];
  const EARLY = new Set(['PK3', 'PK4', 'K', '1', '2']); const courseOf = (id) => L.COURSES.find((c) => c.id === id || c.modules.some((m) => m.id === id));
  const hits = []; let read = 0;
  for (const [label, table] of [['', STORIES], ['course:', COURSE_STORIES], ['mastery:', MASTERY_STORIES]]) for (const [id, s] of Object.entries(table)) {
    const c = courseOf(id); if (!c || !EARLY.has(c.grade)) continue; read += 1; if (s.words.some((p) => ALMOST.test(p))) hits.push(label + id); }
  const unlisted = hits.filter((h) => !ALMOST_WAITING.includes(h)); const stale = ALMOST_WAITING.filter((h) => !hits.includes(h));
  const proven = ALMOST.test('Leo almost grabbed the ball and ran off.') && ALMOST.test('Gabe almost giggled too.') && ALMOST.test('Gabe nearly giggled too.') && ALMOST.test('Omar almost hid it.') && ALMOST.test('Kim almost found it.') && ['almost alike', 'nearly done', 'nearly time to go', 'almost red', 'almost bedtime', 'almost done', 'almost a triangle', 'almost all of them', 'almost the same', 'almost four', 'almost agreeing'].every((t) => !ALMOST.test(t));
  ok(`no early-years story says almost before a past-tense verb, which a young child hears as done (${read} stories read; ${ALMOST_WAITING.length} waiting for its course's review)`, read >= 220 && proven && unlisted.length === 0 && stale.length === 0, `says it: ${unlisted.join(', ')}; listed but clean: ${stale.join(', ')}`); }

// One to three sound effects a story (ELEVEN-V4-AUDIO-TAGS and RULES-AUDIT section 4; pass MM, round two's story check found four
// in Growl, then quack and five in The Rhyme Train). A sound effect is counted as a tag that names a thing making its sound, an
// article, the thing and an -ing word ([a bear growling], [a train whistle tooting, then a bell ringing twice]); one named with no
// article, as [wind whooshing], is the story brief's to count.
{ const FX = /^(?:a|an|the|two|three|some)\s[^,\]]*\b\w+ing\b/i; const over = []; let read = 0;
  for (const [kind, table] of [['', STORIES], ['course:', COURSE_STORIES], ['mastery:', MASTERY_STORIES]]) for (const [id, s] of Object.entries(table)) { if (!Array.isArray(s.audio)) continue; read += 1;
    let n = 0; for (const a of s.audio) for (const t of String(a).matchAll(/\[([^\]]+)\]/g)) if (FX.test(t[1]) && !/^a (?:little|bit)\b/i.test(t[1])) n += 1;
    if (n > 3) over.push(`${kind}${id} (${n})`); }
  ok(`no story has more than three sound effects (${read} stories with audio read)`, read >= 190 && over.length === 0, over.join(', ')); }

console.log(`\n${pass} passed, ${fail} failed`);
process.exitCode = fail ? 1 : 0;   // never process.exit(): it can drop the last lines of a piped stdout (2026-09-23)
