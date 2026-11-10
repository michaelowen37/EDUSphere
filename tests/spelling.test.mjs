// Every word a student or educator reads uses standard American spelling, and a few
// house style rules hold everywhere. This scans the prose inside src/logic.mjs and
// src/ui.jsx: string literals that contain a space (identifiers and keys have none).
import { readFileSync } from 'node:fs';

let pass = 0, fail = 0;
const ok = (name, cond, detail = '') => { if (cond) { pass++; console.log('PASS -', name); } else { fail++; console.log('FAIL -', name, detail); } };

// British spellings and the American form, as whole-word patterns.
const BRITISH = [
  [/\bcolou?r(s|ed|ing|ful|less)?\b/gi, 'color', /\bcolour/i], [/\bfavourite(s)?\b/gi, 'favorite', /favourite/i],
  [/\bcentre(s|d)?\b/gi, 'center', /centre/i], [/\b(recogni|organi|apologi|reali|memori|emphasi|categori)s(e|es|ed|ing)\b/g, '-ize', /(recogni|organi|apologi|reali|memori|emphasi|categori)s(e|es|ed|ing)\b/],
  [/\bneighbour(s|hood|ing)?\b/gi, 'neighbor', /neighbour/i], [/\bhonour(s|ed|able)?\b/gi, 'honor', /honour/i], [/\bbehaviour(s|al)?\b/gi, 'behavior', /behaviour/i],
  [/\bhumour\b/gi, 'humor', /humour/i], [/\blabour\b/gi, 'labor', /labour/i], [/\bflavour(s)?\b/gi, 'flavor', /flavour/i],
  [/\bgrey\b/gi, 'gray', /\bgrey\b/i], [/\bprogramme(s)?\b/gi, 'program', /\bprogramme(s)?\b/i], [/\bmaths\b/gi, 'math', /\bmaths\b/i],
  [/\blearnt\b/gi, 'learned', /\blearnt\b/i], [/\bspelt\b/gi, 'spelled', /\bspelt\b/i], [/\bwhilst\b/gi, 'while', /\bwhilst\b/i],
  [/\btravell(ing|ed|er)\b/gi, 'traveling', /travell/i], [/\bcancelled\b/gi, 'canceled', /cancelled/i], [/\bpractis(e|es|ed|ing)\b/gi, 'practice', /practis/i],
  [/\banalys(e|es|ed|ing)\b/gi, 'analyze', /analys(e|es|ed|ing)\b/i], [/\bdefence\b/gi, 'defense', /defence/i], [/\bcatalogue\b/gi, 'catalog', /catalogue/i],
  [/\bmould\b/gi, 'mold', /mould/i], [/\bplough\b/gi, 'plow', /plough/i], [/\btyre(s)?\b/gi, 'tire', /\btyre/i], [/\bpyjamas\b/gi, 'pajamas', /pyjamas/i],
  [/\bcheque\b/gi, 'check', /cheque/i], [/\bkerb\b/gi, 'curb', /\bkerb\b/i], [/\baluminium\b/gi, 'aluminum', /aluminium/i], [/\bmum\b/gi, 'mom', /\bmum\b/i],
  [/\bstorey\b/gi, 'story', /storey/i], [/\bjewellery\b/gi, 'jewelry', /jewellery/i], [/\brubbish\b/gi, 'trash', /rubbish/i], [/\bfootpath\b/gi, 'sidewalk', /footpath/i],
];

// Prose strings: single-quoted, double-quoted, or template literals, that contain a space.
function proseStrings(source) {
  const out = [];
  const re = /'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g;
  let m;
  while ((m = re.exec(source))) { const t = m[1] ?? m[2] ?? m[3]; if (t && (t.includes(' ') || (/^[A-Za-z]+$/.test(t) && t.length > 3))) out.push(t); }
  return out;
}

// Since pass NE a run of single letters may set its letters two spaces apart (Start or end of the name's close, P  D  N  X, since three
// spaces wrapped it onto two rows in the dark theme's paper at 375 pixels): a run's gaps are layout, not prose, so the run is set aside
// as an id is, and a double space in a sentence beside it is still caught (the plant after the loop).
const LETTER_RUN = /\bkind: 'letters', text: '[A-Za-z](?: +[A-Za-z])+'/g;
for (const file of ['src/logic.mjs', 'src/ui.jsx']) {
  const src = readFileSync(file, 'utf8');
  // Comments are for developers and may quote anything; strip them so only prose is checked.
  // Identifiers are code, not prose: strip id fields, module id lists and requires lists before scanning.
  const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1').replace(/\b(id|courseId|moduleId|toModuleId): '[^']*'/g, '').replace(/\b(requires|moduleIds|courseIds|generators): \[[^\]]*\]/g, '').replace(/\bSAY_ALONG_(?:LESSONS|WAITS) = \[[^\]]*\]/g, '').replace(LETTER_RUN, '');   // the say-along's module id lists (pass MT), and a run of letters (pass NE)
  const strings = proseStrings(code);
  for (const [pattern, american, detect] of BRITISH) {
    const hits = strings.filter((t) => detect.test(t.replace(/\$\{[^}]*\}/g, 'X'))).slice(0, 3);
    ok(`${file}: no British spelling where American is ${american}`, hits.length === 0, hits.map((h) => JSON.stringify(h.slice(0, 60))).join(' | '));
  }
  ok(`${file}: no em dashes in prose`, !strings.some((t) => t.includes('\u2014')), strings.filter((t) => t.includes('\u2014')).slice(0, 2).join(' | '));
  ok(`${file}: no double spaces in prose`, !strings.some((t) => /\S  \S/.test(t)), strings.filter((t) => /\S  \S/.test(t)).slice(0, 2).join(' | '));
  const plain = (t) => t.replace(/\$\{[^}]*\}/g, 'X');
  const isProse = (t) => !/@media|@keyframes|\{ *[a-z-]+ *:/.test(t) && !/\+ \?|= \?|\? =|÷ \?|× \?|as \?/.test(t) && t.trim() !== '?';
  const spaced = (t) => isProse(t) && (/ [,.;:!?]/.test(plain(t)));
  ok(`${file}: no space before punctuation`, !strings.some((t) => spaced(t) && !/\.\.\./.test(t)), strings.filter((t) => spaced(t) && !/\.\.\./.test(t)).slice(0, 2).map((t) => JSON.stringify(t.slice(0, 60))).join(' | '));
}
{ const sample = "{ say: 'Four  letters.', show: { kind: 'letters', text: 'P  D  N  X' } }"; const left = proseStrings(sample.replace(LETTER_RUN, ''));
  ok('a run of single letters spaced two apart is layout, set aside, while a double space in the sentence beside it is still caught (pass NE; the sentence planted beside P  D  N  X)', left.length === 1 && /\S  \S/.test(left[0]) && !left.some((t) => t.includes('P  D'))); }
// Since pass NE (pass ND's delivery found What's new's line on the dark theme's ruled-out answer saying grey, while this test read only
// src/logic.mjs and src/ui.jsx): the stories' prose and docs/WHATS-NEW.md, which educators read in the What's new pop-up and on its More
// Details page, are read by the same list, with no em dash and no double space. The stories' keys (STORIES['colours'], 'tech-college':)
// are names, not prose, so they are set aside. Each read has a plant of the slip it found (catalogue in the college story's title, grey
// in What's new), caught.
const proseSlips = (strings) => { const hits = []; for (const [, american, detect] of BRITISH) for (const t of strings) if (detect.test(t.replace(/\$\{[^}]*\}/g, 'X'))) hits.push(american + ': ' + t.slice(0, 50));
  for (const t of strings) { if (t.includes('\u2014')) hits.push('em dash: ' + t.slice(0, 50)); if (/\S  \S/.test(t)) hits.push('double space: ' + t.slice(0, 50)); } return hits; };
const storyStrings = (src) => proseStrings(src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1').replace(/STORIES\[(['"])[^'"]*\1\]/g, '').replace(/(['"])[a-z0-9-]+\1\s*:/g, ''));
{ const src = readFileSync('src/stories.mjs', 'utf8'); const slips = proseSlips(storyStrings(src)); const planted = src.replace("title: 'Chloe and the catalog of", "title: 'Chloe and the catalogue of");
  ok('src/stories.mjs: no British spelling where the house writes American, no em dash and no double space in prose (pass NE; the college story\'s old catalogue, planted, caught)', slips.length === 0 && planted !== src && proseSlips(storyStrings(planted)).length > slips.length, slips.slice(0, 3).join(' | ')); }
{ const news = readFileSync('docs/WHATS-NEW.md', 'utf8').split('\n'); const slips = proseSlips(news); const planted = news.map((l) => l.replace('stays visible behind its gray,', 'stays visible behind its grey,'));
  ok('docs/WHATS-NEW.md: no British spelling where the house writes American, no em dash and no double space (pass NE; its line of pass GA with grey, planted, caught)', slips.length === 0 && planted.join('\n') !== news.join('\n') && proseSlips(planted).length > slips.length, slips.slice(0, 3).join(' | ')); }
// Teaching text reads cleanly: a key idea is short sentences, never one long one, and every
// line of a lesson that is a sentence starts with a capital and ends with a mark. Centered
// [[ ]] lines, equations and connector words like "becomes" are not sentences and are skipped.
const L = await import('../src/logic.mjs');
const strip = (t) => t.replace(/\*\*/g, '');
const isEquation = (t) => /[=<>×÷+]/.test(t) || /^\d+[\/.]\d+/.test(t) || /^[^a-z]*$/.test(t);
const runOn = [], noEnd = [], lower = [];
for (const m of L.MODULES) {
  for (const sentence of strip(m.lesson.keyIdea || '').replace(/\[\[|\]\]/g, '').split('\n').flatMap((x) => x.split(L.SENTENCE_BREAK))) {
    if (sentence.trim().split(/\s+/).length > 28) runOn.push(`${m.id}: ${sentence.trim().slice(0, 50)}`);
  }
  for (const paragraph of m.lesson.paragraphs || []) for (const raw of paragraph.split('\n')) {
    let t = raw.trim(); if (!t) continue;
    const centered = /^\[\[.*\]\]$/.test(t); t = strip(t.replace(/^\[\[|\]\]$/g, '')).trim();
    if (centered || isEquation(t) || t.split(/\s+/).length < 3) continue;
    if (!/[.!?:)"\u201d'\u2019]$/.test(t)) noEnd.push(`${m.id}: ${t.slice(0, 50)}`);
    if (/^[a-z]/.test(t)) lower.push(`${m.id}: ${t.slice(0, 50)}`);
  }
}
ok('no key idea runs a sentence past 28 words', runOn.length === 0, runOn.slice(0, 3).join(' | '));
ok('every lesson sentence ends with a mark', noEnd.length === 0, noEnd.slice(0, 3).join(' | '));
ok('every lesson sentence starts with a capital', lower.length === 0, lower.slice(0, 3).join(' | '));
console.log(`\n${pass} passed, ${fail} failed`);
process.exitCode = fail ? 1 : 0;   // never process.exit(): it can drop the last lines of a piped stdout (2026-09-23)
