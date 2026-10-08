// The Wise Human. Copyright (c) 2026. Source-available; not for reuse. See LICENSE.md.
// Coloring page levels (pass LY, Mikey). In plain terms: every Leonardo coloring page is a scene with several things to
// color, never one object alone on blank paper, and the pages grow more intricate as the child grows, the way the
// connect-the-dots pictures do. A lesson page (D28 on) takes the level of its lesson's grade. A drawing page (D1 to D27)
// or a better page (G) takes the level of where it sits in Let's Color, which a child unlocks simplest first, one picture
// for each lesson passed. Each level has one style line and one negative prompt, and the scene itself (what is in the
// picture) is written by hand in the ledger. Letter pages (L) keep their own fixed design, a capital, its lowercase and
// circles to color, and are not on this ladder.
// The ledger test checks every D and G row against this file, and
//   node tools/coloring-levels.mjs --write
// rewrites the style and the negative prompt of every D and G row in docs/ART-REQUESTS.md from it, keeping each scene.
import { readFileSync, writeFileSync } from 'node:fs';
import { COLORING_PICTURES, MODULES, getCourse } from '../src/logic.mjs';
import { COLOR_PAGES } from '../src/stories.mjs';

const BASE_NEGATIVE = 'text, words, letters, numbers, shading, gray fill, color, gradients, watermark, signature, blurry, jagged lines, broken outlines';
// One style line and one negative prompt per level, simplest first. Pre-K pages keep big roomy shapes a small hand can fill;
// from kindergarten each page gains a setting, patterns and smaller areas, until grade 2 asks for a rich, detailed scene.
export const COLORING_LEVELS = {
  PK3: { name: 'pre-K 3', style: "Style: crisp black and white line art for a young child's coloring book, extra thick clean black outlines, big simple rounded shapes with roomy spaces to color, a simple scene with a few things to color, white insides, plain white background, no shading.", negative: `${BASE_NEGATIVE}, tiny details, crowded scene, photorealism` },
  PK4: { name: 'pre-K 4', style: "Style: crisp black and white line art for a young child's coloring book, thick clean black outlines, simple friendly shapes, a small scene with several things to color, white insides, plain white background, no shading.", negative: `${BASE_NEGATIVE}, tiny details, crowded scene, photorealism` },
  K: { name: 'kindergarten', style: "Style: crisp black and white line art for a children's coloring book, bold clean black outlines, a fuller scene with many things to color, a setting around them, a few simple patterns such as stripes and dots, white insides, no shading.", negative: `${BASE_NEGATIVE}, tiny details, photorealism` },
  1: { name: 'grade 1', style: "Style: crisp black and white line art for a children's coloring book, clean black outlines of medium weight, a detailed scene with many things to color, patterns on clothes and objects, a full background, white insides, no shading.", negative: `${BASE_NEGATIVE}, photorealism` },
  2: { name: 'grade 2', style: "Style: crisp black and white line art for a children's coloring book, clean fine black outlines, a rich detailed scene with many small areas to color, patterns and textures throughout, a full background, white insides, no shading.", negative: `${BASE_NEGATIVE}, photorealism` },
};
// Drawing pages by where they sit among Let's Color's drawings (the letter pages between them are not counted). At one
// picture a lesson, a pre-K 3 child reaches about the ninth drawing and a pre-K 4 child about the twenty-second; the rest
// arrive in kindergarten and the grades after it, the last four being the busiest.
export const DRAWING_BANDS = [[8, 'PK3'], [21, 'PK4'], [30, 'K'], [34, '1'], [Infinity, '2']];
// A page that also stands in for a thing in lessons and questions keeps that thing the one focal point, and its negative
// prompt keeps out what a question might ask a child to find instead (a star on the rocket page, a flower on the butterfly's).
export const EXTRA_NEGATIVE = { D4: 'many flowers, bouquet', D5: 'stars', D6: 'flowers' };

const DRAWINGS = COLORING_PICTURES.filter((p) => !p.startsWith('letter-'));
const LESSON_LEVEL = Object.fromEntries(Object.entries(COLOR_PAGES).map(([mid, [serial]]) => {
  const m = MODULES.find((x) => x.id === mid); const c = m && getCourse(m.courseId); return [serial, c ? String(c.grade) : null];
}));
// A page's level: its lesson's grade, or its band in Let's Color by its page id (the ledger's Page column).
export function levelOf(serial, page) {
  if (LESSON_LEVEL[serial]) return LESSON_LEVEL[serial];
  const at = DRAWINGS.indexOf(page);
  return at < 0 ? null : DRAWING_BANDS.find(([last]) => at <= last)[1];
}
export function stylesFor(serial, page) {
  const lv = COLORING_LEVELS[levelOf(serial, page)];
  return lv ? { level: levelOf(serial, page), style: lv.style, negative: lv.negative + (EXTRA_NEGATIVE[serial] ? `, ${EXTRA_NEGATIVE[serial]}` : '') } : null;
}
// A ledger row: | serial | page | scene | prompt | negative | status |
export const ROW = /^\| ((?:D|G)\d+) \| (.*?) \| (.*?) \| (.*?) \| (.*?) \| (\w+) \|$/;

if (process.argv.includes('--write')) {
  const path = new URL('../docs/ART-REQUESTS.md', import.meta.url);
  let rewritten = 0;
  const out = readFileSync(path, 'utf8').split('\n').map((line) => {
    const m = ROW.exec(line); if (!m) return line;
    const [, serial, page, scene, prompt, , status] = m; const s = stylesFor(serial, page);
    if (!s) throw new Error(`${serial} (${page}) has no level`);
    const at = prompt.indexOf(', Style:'); if (at < 0) throw new Error(`${serial}: the prompt has no Style line`);
    rewritten++;
    return `| ${serial} | ${page} | ${scene} | ${prompt.slice(0, at)}, ${s.style} | ${s.negative} | ${status} |`;
  });
  writeFileSync(path, out.join('\n'));
  console.log(`${rewritten} coloring rows written`);
}
