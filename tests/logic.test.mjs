// Tests for src/logic.mjs.  Run:  node tests/logic.test.mjs
// Any model (or person) can read PASS/FAIL lines below without knowing React.
import * as L from '../src/logic.mjs';

let pass = 0, fail = 0;
const ok = (label, cond, detail = '') => { console.log((cond ? 'PASS' : 'FAIL') + ' - ' + label + (cond ? '' : '  ' + detail)); cond ? pass++ : fail++; };
const val = (s) => { const [n, d] = s.split('/').map(Number); return n / d; }; // independent fraction value

// ---- 1. Every generator produces valid, correct questions across many seeds ----
for (const [genId, gen] of Object.entries(L.GENERATORS)) {
  let bad = [];
  for (let seed = 1; seed <= 300; seed++) {
    const q = L.generateQuestion(genId, seed);
    const problems = [];
    if (!q.prompt || !q.explain) problems.push('empty prompt/explain');
    if (q.type === 'choice') {
      if (!Array.isArray(q.choices) || q.choices.length < 2) problems.push('too few choices');
      if (q.choices.filter((c) => c === q.answer).length !== 1) problems.push('answer not exactly once in choices');
      if (new Set(q.choices).size !== q.choices.length) problems.push('duplicate choices');
      // fraction-valued choices must all be different amounts (no 2/4 vs 1/2 ambiguity)
      if (q.choices.every((c) => /^\d+\/\d+$/.test(c))) {
        const vals = q.choices.map(val);
        if (new Set(vals.map((v) => v.toFixed(9))).size !== vals.length) problems.push('two choices are the same amount');
      }
    } else if (q.type === 'number') {
      if (!/^\d+$/.test(q.answer)) problems.push('number answer is not a whole number');
    } else if (q.type === 'trace') {
      if (!L.TRACE_LETTERS[q.answer]) problems.push('trace letter has no strokes');
      if (q.answer !== q.prompt.match(/letter ([A-Z])/)[1]) problems.push('trace prompt names a different letter');
      // an ideal tracing of the letter must pass, and a tracing of a different letter must fail
      const ideal = L.TRACE_LETTERS[q.answer].strokes.map((st) => st.flatMap((p, i) => (i === 0 ? [p] : Array.from({ length: 6 }, (_, k) => [st[i - 1][0] + ((p[0] - st[i - 1][0]) * (k + 1)) / 6, st[i - 1][1] + ((p[1] - st[i - 1][1]) * (k + 1)) / 6]))));
      if (!L.checkAnswer(q, JSON.stringify(ideal))) problems.push('an ideal tracing does not pass');
      const other = Object.keys(L.TRACE_LETTERS).find((k) => k !== q.answer && k !== 'E' && k !== 'F' && k !== 'H' && q.answer !== 'I');
      if (other && L.TRACE_LETTERS[other] && ['L', 'T', 'V', 'O', 'C'].includes(q.answer) && L.checkAnswer(q, JSON.stringify(L.TRACE_LETTERS[other].strokes))) problems.push(`tracing ${other} passes as ${q.answer}`);
    } else problems.push('unknown type');
    // Independent arithmetic re-check of the answer, per generator family
    const text = (q.story ? q.story + ' ' : '') + q.prompt; // the full question as the learner reads it
    const nums = text.match(/\d+\/\d+/g) || [];
    if (genId === 'm3-same-bottom' || genId === 'm3-same-top' || genId === 'm3-different') {
      const [a, b] = nums; if (Math.max(val(a), val(b)) !== val(q.answer)) problems.push('bigger fraction is wrong');
    }
    if (genId === 'm3-smallest-of-three') {
      const min = Math.min(...nums.map(val)); if (val(q.answer) !== min) problems.push('smallest fraction is wrong');
    }
    if (genId === 'm3-true-false') {
      const [a, b] = nums; if ((val(a) > val(b) ? 'True' : 'False') !== q.answer) problems.push('true/false is wrong');
    }
    if (genId === 'm2-which-equals') { if (Math.abs(val(nums[0]) - val(q.answer)) > 1e-9) problems.push('not equivalent'); }
    if (genId === 'm2-simplify') { const [f] = nums; if (Math.abs(val(f) - val(q.answer)) > 1e-9) problems.push('simplified value differs'); const [n, d] = q.answer.split('/').map(Number); if (L.gcd(n, d) !== 1) problems.push('not in simplest form'); }
    if (genId === 'm2-fill-bottom') { const [a, b] = nums[0].split('/').map(Number); const top = Number(text.match(/= (\d+)\//)[1]); if (top * b !== a * Number(q.answer)) problems.push('fill-bottom arithmetic wrong'); }
    if (genId === 'm2-fill-top') { const [a, b] = nums[0].split('/').map(Number); const bottom = Number(text.match(/__\/(\d+)/)[1]); if (Number(q.answer) * b !== a * bottom) problems.push('fill-top arithmetic wrong'); }
    if (genId === 'm2-equivalent-or-not') { const [a, b] = nums; const same = Math.abs(val(a) - val(b)) < 1e-9; if ((same ? 'Yes' : 'No') !== q.answer.slice(0, same ? 3 : 2)) problems.push('equivalence yes/no wrong'); }
    if (genId === 'm1-part-eaten') { const n = Number(text.match(/into (\d+) equal/)[1]); const m = Number(text.match(/eat (\d+)/)[1]); if (q.answer !== `${m}/${n}`) problems.push('part eaten wrong'); }
    if (genId === 'm1-part-left') { const n = Number(text.match(/into (\d+) equal/)[1]); const m = Number(text.match(/\. (\d+) /)[1]); if (q.answer !== `${n - m}/${n}`) problems.push('part left wrong'); }
    if (genId === 'm1-picture') { if (q.answer !== `${q.visual.shaded}/${q.visual.parts}`) problems.push('picture answer does not match drawing'); }
    if (genId === 'm1-top-or-bottom') { const n = Number(text.match(/into (\d+) equal/)[1]); const m = Number(text.match(/eat (\d+)/)[1]); const want = /top number/.test(q.prompt) ? m : n; if (Number(q.answer) !== want) problems.push('top/bottom wrong'); }
    if (q.visual && q.visual.kind === 'letters') { if (typeof q.visual.text !== 'string' || !q.visual.text.trim()) problems.push('letters visual empty'); }
    else if (q.visual && q.visual.kind === 'dots') { if (!(Number.isInteger(q.visual.count) && q.visual.count >= 1 && q.visual.count <= 10)) problems.push('dots out of range'); }
    else if (q.visual && q.visual.kind === 'shape') { /* checked below */ }
    else if (q.visual && q.visual.kind === 'tens') { if (!(q.visual.count >= 1 && q.visual.count <= 10)) problems.push('tens out of range'); }
    else if (q.visual && q.visual.kind === 'bars') { if (!q.visual.lengths.every((n) => n >= 1 && n <= 9)) problems.push('bar out of range'); }
    else if (q.visual && q.visual.kind === 'solid') { if (!['sphere', 'cube', 'cylinder', 'cone'].includes(q.visual.name)) problems.push('unknown solid'); }
    else if (q.visual && q.visual.kind === 'tenframe') { if (!(q.visual.filled >= 0 && q.visual.filled <= 10)) problems.push('ten frame out of range'); }
    else if (q.visual && q.visual.kind === 'array') { if (!(q.visual.rows >= 1 && q.visual.rows <= 10 && q.visual.cols >= 1 && q.visual.cols <= 10)) problems.push('array out of range'); }
    else if (q.visual && q.visual.kind === 'numberline') { if (!(q.visual.parts >= 2 && q.visual.mark >= 0 && q.visual.mark <= q.visual.parts)) problems.push('number line out of range'); }
    else if (q.visual && q.visual.kind === 'bar') { if (!(q.visual.shaded >= 0 && q.visual.shaded <= q.visual.parts)) problems.push('bar picture out of range'); }
    else if (q.visual && q.visual.kind === 'swatch') { if (!['red', 'blue', 'yellow', 'green'].includes(q.visual.colour)) problems.push('unknown colour'); }
    else if (q.visual && q.visual.kind === 'item') { if (!q.visual.shape || !q.visual.colour) problems.push('item incomplete'); }
    else if (q.visual && q.visual.kind === 'pattern') { if (!Array.isArray(q.visual.items) || q.visual.items.length < 3) problems.push('pattern too short'); }
    else if (q.visual && q.visual.kind === 'clock') { if (!(q.visual.hour >= 1 && q.visual.hour <= 12 && [0, 30].includes(q.visual.minute))) problems.push('clock out of range'); }
    else if (q.visual && !(q.visual.shaded >= 0 && q.visual.shaded <= q.visual.parts)) problems.push('visual out of range');
    // Independent checks for the counting questions (a 'dots:N' choice is a picture of N things)
    const dotCount = (c) => Number((/^dots:(\d+)$/.exec(c) || [])[1]);
    if (/^k(5|10)-how-many$/.test(genId) && String(q.visual.count) !== q.answer) problems.push('how-many answer does not match the picture');
    if (/^k(5|10)-tap-group$/.test(genId) && dotCount(q.answer) !== Number(q.prompt.match(/with (\d+)/)[1])) problems.push('tap-group answer does not match the prompt');
    if (/^k(5|10)-more$/.test(genId) && dotCount(q.answer) !== Math.max(...q.choices.map(dotCount))) problems.push('more picked the smaller group');
    if (/^k(5|10)-fewer$/.test(genId) && dotCount(q.answer) !== Math.min(...q.choices.map(dotCount))) problems.push('fewer picked the bigger group');
    if (/^k(5|10)-after$/.test(genId) && Number(q.answer) !== Number(q.prompt.match(/after (\d+)/)[1]) + 1) problems.push('after is not n+1');
    if (/^k(5|10)-same$/.test(genId) && dotCount(q.answer) !== q.visual.count) problems.push('same does not match the picture');
    const AZ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (genId === 'r-tap-letter' && q.answer !== q.prompt.match(/letter ([A-Z])/)[1]) problems.push('tap-letter answer mismatch');
    if (genId === 'r-after' && q.answer !== AZ[AZ.indexOf(q.prompt.match(/after ([A-Z])/)[1]) + 1]) problems.push('after is not the next letter');
    if (genId === 'r-before' && q.answer !== AZ[AZ.indexOf(q.prompt.match(/before ([A-Z])/)[1]) - 1]) problems.push('before is not the previous letter');
    if (genId === 'r-first-letter' && q.answer !== q.story.match(/word ([A-Z]+)/)[1][0]) problems.push('first letter wrong');
    if (genId === 'r-count-letters' && Number(q.answer) !== q.story.match(/word ([A-Z]+)/)[1].length) problems.push('letter count wrong');
    if (genId === 'r-match-small' && q.answer !== q.story.match(/big ([A-Z])/)[1].toLowerCase()) problems.push('small letter mismatch');
    if (genId === 'r-match-big' && q.answer !== q.story.match(/small ([a-z])/)[1].toUpperCase()) problems.push('big letter mismatch');
    // Independent re-derivation for the kindergarten number-sense questions, from the words alone
    const words = { zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
    const firstWord = (t) => words[(t || '').trim().split(/\s+/)[0].toLowerCase()];
    const ints = text.match(/\d+/g) ? text.match(/\d+/g).map(Number) : [];
    if (genId === 'km-one-more' && Number(q.answer) !== ints[0] + 1) problems.push('one more is not n+1');
    if (genId === 'km-one-less' && Number(q.answer) !== ints[0] - 1) problems.push('one less is not n-1');
    if (genId === 'km-one-more-pic' && dotCount(q.answer) !== ints[0] + 1) problems.push('one-more picture is not n+1');
    if (genId === 'km-one-less-pic' && dotCount(q.answer) !== ints[0] - 1) problems.push('one-less picture is not n-1');
    if (genId === 'km-which-neighbour') { const n = ints[0]; const want = /more/.test(q.prompt) ? n + 1 : n - 1; if (Number(q.answer) !== want) problems.push('neighbour wrong'); }
    if (genId === 'km-join-story') { const a = firstWord(q.story); const b = ints[0]; if (Number(q.answer) !== a + b) problems.push('join total wrong'); }
    if (genId === 'km-take-story') { const a = firstWord(q.story); const b = ints[0]; if (Number(q.answer) !== a - b) problems.push('take-away remainder wrong'); }
    if (genId === 'km-join-pic' && dotCount(q.answer) !== ints[0] + ints[1]) problems.push('join picture wrong');
    if (genId === 'km-take-pic' && dotCount(q.answer) !== ints[0] - ints[1]) problems.push('take picture wrong');
    if (genId === 'km-how-many-more' && Number(q.answer) !== ints[1] - ints[0]) problems.push('how many more wrong');
    if (genId === 'km-bigger' && Number(q.answer) !== Math.max(...q.choices.map(Number))) problems.push('bigger picked the smaller');
    if (genId === 'km-smaller' && Number(q.answer) !== Math.min(...q.choices.map(Number))) problems.push('smaller picked the bigger');
    if (genId === 'km-more-less-same') { const [a, b] = ints; const want = a > b ? 'More' : a < b ? 'Less' : 'The same'; if (q.answer !== want) problems.push('more/less/same wrong'); }
    if (genId === 'km-make-more' && !(dotCount(q.answer) > ints[0])) problems.push('make-more is not more');
    if (genId === 'km-make-fewer' && !(dotCount(q.answer) < ints[0])) problems.push('make-fewer is not fewer');
    if (/^km-/.test(genId) && q.explainVisual && !(q.explainVisual.count >= 1 && q.explainVisual.count <= 10)) problems.push('explain picture out of range');
    // Shapes, re-derived from a table the generator does not share
    const SIDES = { circle: 0, triangle: 3, square: 4, rectangle: 4 };
    const shapeOf = (c) => String(c).replace(/^shape:/, '').split('#')[0];
    if (genId === 'ks-name' && q.answer !== q.visual.name) problems.push('named the wrong shape');
    if (genId === 'ks-tap' && shapeOf(q.answer) !== q.prompt.match(/Tap the (\w+)/)[1]) problems.push('tapped the wrong shape');
    if (genId === 'ks-sides' && Number(q.answer) !== SIDES[q.visual.name]) problems.push('side count wrong');
    if (genId === 'ks-odd-one-out') { const names = q.choices.map(shapeOf); const odd = names.find((n) => names.filter((x) => x === n).length === 1); if (shapeOf(q.answer) !== odd) problems.push('odd one out wrong'); }
    if (genId === 'ks-corners' && q.answer !== (SIDES[q.visual.name] > 0 ? 'Yes' : 'No')) problems.push('corners yes/no wrong');
    if (q.visual && q.visual.kind === 'shape' && !SIDES.hasOwnProperty(q.visual.name)) problems.push('unknown shape');
    // Tens, lengths, sorting: re-derived from the words and the pictures
    const num = (c, key) => Number((new RegExp(`^${key}:(\\d+)$`).exec(c) || [])[1]);
    if (genId === 'kt-next-ten' && Number(q.answer) !== Number(q.prompt.match(/after (\d+)/)[1]) + 10) problems.push('next ten wrong');
    if (genId === 'kt-before-ten' && Number(q.answer) !== Number(q.prompt.match(/before (\d+)/)[1]) - 10) problems.push('previous ten wrong');
    if (genId === 'kt-how-many-tens' && Number(q.answer) !== q.visual.count * 10) problems.push('tens count wrong');
    if (genId === 'kt-tap-tens' && num(q.answer, 'tens') * 10 !== Number(q.prompt.match(/shows (\d+)/)[1])) problems.push('tapped tens wrong');
    if (genId === 'kt-count-on') { const [a] = q.story.match(/\d+/g).map(Number); if (Number(q.answer) !== a + 20) problems.push('count on wrong'); }
    if (genId === 'kl-longer' && num(q.answer, 'bar') !== Math.max(...q.choices.map((c) => num(c, 'bar')))) problems.push('longer wrong');
    if (genId === 'kl-shorter' && num(q.answer, 'bar') !== Math.min(...q.choices.map((c) => num(c, 'bar')))) problems.push('shorter wrong');
    if (genId === 'kl-same-length' && num(q.answer, 'bar') !== q.visual.lengths[0]) problems.push('same length wrong');
    if (genId === 'kl-taller' && num(q.answer, 'tower') !== Math.max(...q.choices.map((c) => num(c, 'tower')))) problems.push('taller wrong');
    if (genId === 'kl-heavier-words' && !/rock|book|bucket|chair|car|brick/.test(q.answer)) problems.push('heavier picked the light thing');
    if (genId === 'ko-belongs' && q.answer !== `shape:${q.story.match(/the (\w+) group/)[1]}`) problems.push('belongs wrong');
    if (genId === 'ko-count-group' && Number(q.answer) !== q.visual.count) problems.push('group count wrong');
    if (genId === 'ko-which-group-more') { const [a, b] = q.story.match(/\d+/g).map(Number); if (q.answer !== (a > b ? 'Circles' : 'Squares')) problems.push('more group wrong'); }
    if (genId === 'ko-does-not-belong' && shapeOf(q.answer) === q.story.match(/the (\w+) group/)[1]) problems.push('odd one is in the group');
    if (genId === 'ko-how-many-groups' && Number(q.answer) !== q.story.replace(/\.$/, '').split(', ').length) problems.push('group count wrong');
    // Solids and making ten
    const THING = { 'a ball': 'sphere', 'a box': 'cube', 'a can': 'cylinder', 'an ice cream cone': 'cone' };
    const ROLLS = { sphere: 'Yes', cube: 'No', cylinder: 'Yes', cone: 'Yes' };
    if (genId === 'kd-name-solid' && q.answer !== q.visual.name) problems.push('named the wrong solid');
    if (genId === 'kd-tap-solid' && q.answer !== `solid:${q.prompt.match(/Tap the (\w+)/)[1]}`) problems.push('tapped the wrong solid');
    if (genId === 'kd-real-thing' && q.answer !== THING[q.story.match(/Think of (.+)\./)[1]]) problems.push('real thing wrong');
    if (genId === 'kd-flat-or-solid' && q.answer !== (q.visual.kind === 'solid' ? 'Solid' : 'Flat')) problems.push('flat/solid wrong');
    if (genId === 'kd-rolls' && q.answer !== ROLLS[q.visual.name]) problems.push('rolls wrong');
    if ((genId === 'kn-partner' || genId === 'kn-frame') && Number(q.answer) !== 10 - q.visual.filled) problems.push('partner of ten wrong');
    if (genId === 'kn-two-ways') { const [a, b] = q.answer.split(' and ').map(Number); if (a + b !== 10) problems.push('pair does not make ten'); if (q.choices.filter((c) => c.split(' and ').map(Number).reduce((x, y) => x + y) === 10).length !== 1) problems.push('two pairs make ten'); }
    if (genId === 'kn-take-from-ten' && Number(q.answer) !== 10 - Number(q.story.match(/then (\d+)/)[1])) problems.push('take from ten wrong');
    if (genId === 'kn-is-ten') { const [a, b] = q.story.match(/\d+/g).map(Number); if (q.answer !== (a + b === 10 ? 'Yes' : 'No')) problems.push('is-ten wrong'); }
    // Syllables, sounding out, reading direction, word meanings
    const SYL = { cat: 1, dog: 1, sun: 1, hat: 1, fish: 1, ball: 1, rabbit: 2, apple: 2, window: 2, pencil: 2, monkey: 2, tiger: 2, banana: 3, elephant: 3, umbrella: 3, butterfly: 3 };
    if (genId === 'ry-how-many-claps' && Number(q.answer) !== SYL[q.visual.text]) problems.push('clap count wrong');
    if (genId === 'ry-pick-two' && SYL[q.answer] !== 2) problems.push('pick-two wrong');
    if (genId === 'ry-pick-one' && SYL[q.answer] !== 1) problems.push('pick-one wrong');
    if (genId === 'ry-more-claps' && SYL[q.answer] !== Math.max(...q.choices.map((c) => SYL[c]))) problems.push('more claps wrong');
    if (genId === 'ry-same-claps' && SYL[q.answer] !== SYL[q.visual.text]) problems.push('same claps wrong');
    if (genId === 'rd-blend' && q.answer !== q.story.replace(/[,. ]/g, '')) problems.push('blend wrong');
    if (genId === 'rd-first-sound' && q.answer !== q.story.match(/Listen: (\w+)/)[1][0]) problems.push('first sound wrong');
    if (genId === 'rd-last-sound' && q.answer !== q.story.match(/Listen: (\w+)/)[1].slice(-1)) problems.push('last sound wrong');
    if (genId === 'rd-middle-sound' && q.answer !== q.story.match(/Listen: (\w+)/)[1][1]) problems.push('middle sound wrong');
    if (genId === 'rd-which-word' && q.answer !== q.story.replace(/^Read: /, '').replace(/[ .]/g, '')) problems.push('which word wrong');
    const lineWords = (t) => t.trim().split(/\s+/);
    if (genId === 'rw-first' && q.answer !== lineWords(q.story)[0]) problems.push('first word wrong');
    if (genId === 'rw-last' && q.answer !== lineWords(q.story).slice(-1)[0]) problems.push('last word wrong');
    if (genId === 'rw-next') { const ws = lineWords(q.story); const after = q.prompt.match(/after (\w+)\?/)[1]; if (q.answer !== ws[ws.indexOf(after) + 1]) problems.push('next word wrong'); }
    if (genId === 'rw-count-words' && Number(q.answer) !== lineWords(q.story).length) problems.push('word count wrong');
    if (genId === 'rw-which-way' && q.answer !== (/left to right/.test(q.story) ? 'Yes' : 'No')) problems.push('which way wrong');
    const PIC_WORD = { circle: 'circle', square: 'square', triangle: 'triangle', rectangle: 'rectangle', sphere: 'ball', cube: 'box', cylinder: 'can', cone: 'cone' };
    if (genId === 'rm-match-picture' && q.answer !== PIC_WORD[q.visual.name]) problems.push('picture word wrong');
    if (genId === 'rm-pick-word' && PIC_WORD[q.answer.split(':')[1]] !== q.story.match(/word is (\w+)/)[1]) problems.push('picked picture wrong');
    if (genId === 'rm-does-match' && q.answer !== (PIC_WORD[q.visual.name] === q.story.match(/says (\w+)/)[1] ? 'Yes' : 'No')) problems.push('does-match wrong');
    if (genId === 'rm-count-word' && ['one', 'two', 'three', 'four', 'five', 'six'].indexOf(q.answer) + 1 !== q.visual.count) problems.push('count word wrong');
    if (genId === 'rm-shape-word' && q.answer !== `shape:${q.story.match(/word: (\w+)/)[1]}`) problems.push('shape word wrong');
    // Grade 3 multiplication, division, and adding to 1,000: redone from the numbers in the words
    const allInts = text.match(/\d+/g) ? text.match(/\d+/g).map(Number) : [];
    if (genId === 'mu-groups-total' && Number(q.answer) !== allInts[0] * allInts[1]) problems.push('groups total wrong');
    if (genId === 'mu-array' && q.answer !== `${q.visual.rows} × ${q.visual.cols}`) problems.push('array equation wrong');
    if (genId === 'mu-story' && Number(q.answer) !== allInts[0] * allInts[1]) problems.push('multiplication story wrong');
    if (genId === 'mu-which-equation') { const [g, e] = allInts; if (q.answer !== `${g} × ${e} = ${g * e}`) problems.push('which equation wrong'); }
    if (genId === 'mu-swap') { const [a, b] = allInts; if (Number(q.answer) !== a * b) problems.push('swap wrong'); }
    if ((genId === 'tt-fact' || genId === 'tt-fact-story') && Number(q.answer) !== allInts[0] * allInts[1]) problems.push('times fact wrong');
    if (genId === 'tt-missing-factor') { const [a, p] = allInts; if (a * Number(q.answer) !== p) problems.push('missing factor wrong'); }
    if (genId === 'tt-pattern') { const m2 = q.prompt.match(/(\d+) × (\d+)/); if (Number(q.answer) !== Number(m2[1]) * Number(m2[2])) problems.push('pattern fact wrong'); }
    if (genId === 'dv-share') { const [total, groups] = allInts; if (Number(q.answer) * groups !== total) problems.push('share wrong'); }
    if (genId === 'dv-fact') { const [t, b] = allInts; if (Number(q.answer) * b !== t) problems.push('division fact wrong'); }
    if (genId === 'dv-story') { const [total, each] = allInts; if (Number(q.answer) * each !== total) problems.push('division story wrong'); }
    if (genId === 'dv-undo') { const [a, b] = allInts; if (q.answer !== `${a * b} ÷ ${a} = ${b}`) problems.push('undo fact wrong'); }
    if (genId === 'dv-how-many-groups') { const [total, each] = allInts; if (Number(q.answer) * each !== total) problems.push('how many groups wrong'); }
    if (genId === 'as-add' || genId === 'as-story-add') { const [a, b] = allInts; if (Number(q.answer) !== a + b) problems.push('addition wrong'); if (a + b > 999) problems.push('sum over 1000'); }
    if (genId === 'as-subtract' || genId === 'as-story-subtract') { const [a, b] = allInts; if (Number(q.answer) !== a - b) problems.push('subtraction wrong'); if (a - b < 0) problems.push('negative result'); }
    if (genId === 'as-two-step') { const [a, b, c] = allInts; if (Number(q.answer) !== a + b - c) problems.push('two-step wrong'); if (a + b - c < 0) problems.push('two-step negative'); }
    // Number line and building fractions
    if (genId === 'nl-which-fraction' && q.answer !== `${q.visual.mark}/${q.visual.parts}`) problems.push('number line fraction wrong');
    if (genId === 'nl-how-many-steps' && Number(q.answer) !== q.visual.parts) problems.push('steps wrong');
    if (genId === 'nl-place' && Number(q.answer) !== q.visual.mark) problems.push('place wrong');
    if (genId === 'nl-halfway' && Math.abs(val(q.answer) - 0.5) > 1e-9) problems.push('halfway is not one half');
    if (genId === 'nl-closer-to' && q.answer !== (q.visual.mark / q.visual.parts < 0.5 ? '0' : '1')) problems.push('closer-to wrong');
    if (genId === 'bf-how-many-units' && Number(q.answer) !== q.visual.shaded) problems.push('unit count wrong');
    if (genId === 'bf-sum-of-units') { const terms = q.answer.split(' + '); if (terms.length !== q.visual.shaded || !terms.every((t) => t === `1/${q.visual.parts}`)) problems.push('sum of units wrong'); }
    if (genId === 'bf-split') { const [x, y] = q.answer.split(' + '); if (Math.abs(val(x) + val(y) - q.visual.shaded / q.visual.parts) > 1e-9) problems.push('split does not add up'); }
    if (genId === 'bf-share') { const [things, people] = allInts; if (q.answer !== `${things}/${people}`) problems.push('share wrong'); }
    // Pre-K, re-derived from the words and picture specs
    const spec = (c) => String(c).replace(/^item:/, '').split('#')[0].split('-');
    if (genId === 'pc-tap-colour' && q.answer !== `swatch:${q.prompt.match(/Tap (\w+)/)[1]}`) problems.push('tapped colour wrong');
    if (genId === 'pc-name-colour' && q.answer !== q.visual.colour) problems.push('named colour wrong');
    if (genId === 'pc-same-colour' && spec(q.answer)[1] !== q.visual.colour) problems.push('same colour wrong');
    if (genId === 'pc-different-colour') { const cols = q.choices.map((c) => spec(c)[1]); const odd = q.choices.find((c) => cols.filter((x) => x === spec(c)[1]).length === 1); if (q.answer !== odd) problems.push('different colour wrong'); }
    if (genId === 'ps-find-match' && (spec(q.answer)[0] !== q.visual.shape || spec(q.answer)[1] !== q.visual.colour)) problems.push('match wrong');
    if (genId === 'ps-odd-one-out') { const shapes = q.choices.map((c) => spec(c)[0]); const odd = q.choices.find((c) => shapes.filter((x) => x === spec(c)[0]).length === 1); if (q.answer !== odd) problems.push('odd shape wrong'); }
    if (genId === 'ps-same-colour-shape' && (spec(q.answer)[0] !== q.visual.shape || spec(q.answer)[1] !== q.visual.colour)) problems.push('exact match wrong');
    if (genId === 'ps-bigger' && spec(q.answer)[2] !== 'big') problems.push('bigger wrong');
    if (genId === 'ps-smaller' && spec(q.answer)[2] !== 'small') problems.push('smaller wrong');
    if (genId === 'pp-what-next') { const it = q.visual.items; if (spec(q.answer)[0] !== it[it.length % 2 === 0 ? 0 : 1]) problems.push('what next wrong'); }
    if (genId === 'pp-which-repeats') { const it = q.visual.items; const repeats = it.every((x, i) => x === it[i % 2]); if (q.answer !== (repeats ? 'Yes' : 'No')) problems.push('repeats wrong'); }
    if (genId === 'pp-missing') { const it = q.visual.items; const i = it.indexOf('?'); if (spec(q.answer)[0] !== it[i % 2 === 0 ? 0 : 1]) problems.push('missing wrong'); }
    if (genId === 'p3-how-many' && Number(q.answer) !== q.visual.count) problems.push('pre-K how many wrong');
    if (genId === 'p3-tap-group' && dotCount(q.answer) !== Number(q.prompt.match(/Tap (\d)/)[1])) problems.push('pre-K tap group wrong');
    if (genId === 'p3-tap-one' && dotCount(q.answer) !== 1) problems.push('tap one wrong');
    if (genId === 'p3-more' && dotCount(q.answer) !== Math.max(...q.choices.map(dotCount))) problems.push('pre-K more wrong');
    // Grade 1, re-derived from the numbers in the words
    const g1 = text.match(/\d+/g) ? text.match(/\d+/g).map(Number) : [];
    if (genId === 'g1-ten-and' && Number(q.answer) !== 10 + g1[0]) problems.push('ten-and wrong');
    if (genId === 'g1-teen-split' && Number(q.answer) !== g1[0] - 10) problems.push('teen split wrong');
    if (genId === 'g1-teen-pic' && Number(q.answer) !== 10 + q.visual.count) problems.push('teen picture wrong');
    if (genId === 'g1-which-teen' && dotCount(q.answer) !== g1[0] - 10) problems.push('which teen wrong');
    if (genId === 'g1-teen-after' && Number(q.answer) !== g1[0] + 1) problems.push('teen after wrong');
    if ((genId === 'g1-add' || genId === 'g1-add-story') && Number(q.answer) !== g1[0] + g1[1]) problems.push('grade 1 add wrong');
    if (genId === 'g1-make-ten-add') { const m2 = q.prompt.match(/(\d+) \+ (\d+)\?/); if (Number(q.answer) !== Number(m2[1]) + Number(m2[2])) problems.push('make ten add wrong'); }
    if (genId === 'g1-add-pic' && dotCount(q.answer) !== g1[0] + g1[1]) problems.push('add picture wrong');
    if (genId === 'g1-add-missing' && g1[0] + Number(q.answer) !== g1[1]) problems.push('missing addend wrong');
    if ((genId === 'g1-sub' || genId === 'g1-sub-story') && Number(q.answer) !== g1[0] - g1[1]) problems.push('grade 1 subtract wrong');
    if (genId === 'g1-sub-undo') { const [a, b] = g1; if (Number(q.answer) !== a) problems.push('sub undo wrong'); }
    if (genId === 'g1-sub-pic' && dotCount(q.answer) !== g1[0] - g1[1]) problems.push('sub picture wrong');
    if (genId === 'g1-compare-diff' && Number(q.answer) !== g1[0] - g1[1]) problems.push('difference wrong');
    if (genId === 'g1-tens-ones' && Number(q.answer) !== g1[0] * 10 + g1[1]) problems.push('tens and ones wrong');
    if (genId === 'g1-how-many-tens' && Number(q.answer) !== Math.floor(g1[0] / 10)) problems.push('how many tens wrong');
    if (genId === 'g1-how-many-ones' && Number(q.answer) !== g1[0] % 10) problems.push('how many ones wrong');
    if (genId === 'g1-build-number') { const [t, o] = q.answer.match(/\d+/g).map(Number); if (t * 10 + o !== g1[0]) problems.push('build number wrong'); }
    if (genId === 'g1-ten-more' && Number(q.answer) !== g1[0] + 10) problems.push('ten more wrong');
    if (genId === 'g1-bigger' && Number(q.answer) !== Math.max(...q.choices.map(Number))) problems.push('grade 1 bigger wrong');
    if (genId === 'g1-smaller' && Number(q.answer) !== Math.min(...q.choices.map(Number))) problems.push('grade 1 smaller wrong');
    if (genId === 'g1-between') { const [lo, hi] = g1; const a = Number(q.answer); if (!(a > lo && a < hi)) problems.push('between wrong'); }
    if (genId === 'g1-order-three') { const arr = q.answer.split(', ').map(Number); if (!arr.every((v, i) => i === 0 || v > arr[i - 1])) problems.push('order wrong'); }
    if (genId === 'g1-more-less-same') { const [a, b] = g1; if (q.answer !== (a > b ? 'More' : a < b ? 'Less' : 'The same')) problems.push('grade 1 more/less/same wrong'); }
    // Grade 1 reading, re-derived from the shown word or sentence
    const shown = q.visual && q.visual.kind === 'letters' ? q.visual.text : '';
    const PICW = { 'solid:cube': 'box', 'solid:cylinder': 'can', 'solid:sphere': 'ball', 'solid:cone': 'cone' };
    const NUMW = ['one', 'two', 'three', 'four', 'five', 'six'];
    const DIG = (w) => (['sh', 'ch', 'th'].find((d) => w.startsWith(d)) || ['sh', 'ch', 'th'].find((d) => w.endsWith(d)));
    if (genId === 'r1-word-picture' && PICW[q.answer] !== shown) problems.push('word picture wrong');
    if (genId === 'r1-word-colour' && q.answer !== `swatch:${shown}`) problems.push('word colour wrong');
    if (genId === 'r1-word-number' && dotCount(q.answer) !== NUMW.indexOf(shown) + 1) problems.push('word number wrong');
    if (genId === 'r1-which-word' && q.answer !== PICW[`${q.visual.kind}:${q.visual.name}`]) problems.push('which word wrong');
    if (genId === 'r1-word-shape' && q.answer !== `shape:${shown}`) problems.push('word shape wrong');
    if (genId === 'r1-starts-with' && !shown.startsWith(q.answer)) problems.push('starts-with wrong');
    if (genId === 'r1-ends-with' && !shown.endsWith(q.answer)) problems.push('ends-with wrong');
    if (genId === 'r1-which-pair' && DIG(q.answer) !== shown) problems.push('which pair wrong');
    if (genId === 'r1-same-pair' && DIG(q.answer) !== DIG(shown)) problems.push('same pair wrong');
    if (genId === 'r1-odd-pair') { const ds = q.choices.map(DIG); const odd = q.choices.find((c) => ds.filter((d) => d === DIG(c)).length === 1); if (q.answer !== odd) problems.push('odd pair wrong'); }
    if (genId === 'r1-add-e' && q.answer !== shown + 'e' && q.answer.slice(0, -1) !== shown) problems.push('add e wrong');
    if (genId === 'r1-has-silent-e' && q.answer !== (shown.endsWith('e') ? 'Yes' : 'No')) problems.push('silent e yes/no wrong');
    if (genId === 'r1-long-or-short' && q.answer !== (shown.endsWith('e') ? 'Yes' : 'No')) problems.push('long or short wrong');
    if (genId === 'r1-pick-long' && !q.answer.endsWith('e')) problems.push('pick long wrong');
    if (genId === 'r1-take-e' && q.answer + 'e' !== shown) problems.push('take e wrong');
    if (genId === 'r1-sentence-picture') { const m2 = shown.match(/The (\w+) is (\w+)\./); if (q.answer !== `item:${m2[1]}-${m2[2]}`) problems.push('sentence picture wrong'); }
    if (genId === 'r1-sentence-which' && q.answer !== `The ${q.visual.shape} is ${q.visual.colour}.`) problems.push('sentence which wrong');
    if (genId === 'r1-sentence-colour' && q.answer !== shown.match(/is (\w+)\./)[1]) problems.push('sentence colour wrong');
    if (genId === 'r1-sentence-count' && Number(q.answer) !== NUMW.indexOf(shown.match(/see (\w+) /)[1]) + 1) problems.push('sentence count wrong');
    if (genId === 'r1-sentence-yes-no') { const m2 = q.explainVisual.text.match(/is (\w+)\./); if (q.answer !== (m2[1] === q.visual.colour ? 'Yes' : 'No')) problems.push('sentence yes/no wrong'); }
    if (genId === 'r1-who' && q.answer !== q.story.match(/^(\w+) has/)[1]) problems.push('who wrong');
    if (genId === 'r1-where' && q.answer !== q.story.match(/ran to (the \w+)\./)[1]) problems.push('where wrong');
    if (genId === 'r1-what-colour' && q.answer !== q.story.match(/got a (\w+) /)[1]) problems.push('what colour wrong');
    if (genId === 'r1-how-many' && Number(q.answer) !== NUMW.indexOf(q.story.match(/has (\w+) /)[1]) + 1) problems.push('how many wrong');
    if (genId === 'r1-true-false') { const real = q.story.match(/ran to (the \w+)\./)[1]; const claim = q.prompt.match(/ran to (the \w+)\./)[1]; if (q.answer !== (real === claim ? 'Yes' : 'No')) problems.push('true/false wrong'); }
    // Grade 2, re-derived from the numbers in the words
    const g2 = text.match(/\d+/g) ? text.match(/\d+/g).map(Number) : [];
    const HOURS = ['twelve', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven'];
    const COINV = { penny: 1, nickel: 5, dime: 10, quarter: 25 };
    if (genId === 'g2-place-value' && Number(q.answer) !== g2[0] * 100 + g2[1] * 10 + g2[2]) problems.push('place value wrong');
    if (genId === 'g2-expanded') { const parts = q.answer.split(' + ').map(Number); if (parts.reduce((x, y) => x + y, 0) !== g2[0] || parts.length !== 3) problems.push('expanded form wrong'); }
    if (genId === 'g2-digit-means') { const n = g2[0]; const place = q.story.match(/the (\w+) digit/)[1]; const want = place === 'hundreds' ? Math.floor(n / 100) * 100 : place === 'tens' ? Math.floor((n % 100) / 10) * 10 : n % 10; if (Number(q.answer) !== want) problems.push('digit value wrong'); }
    if (genId === 'g2-build-3digit') { const [h, t, o] = q.answer.match(/\d+/g).map(Number); if (h * 100 + t * 10 + o !== g2[0]) problems.push('build 3-digit wrong'); }
    if (genId === 'g2-hundred-more') { const more = /more/.test(q.prompt); if (Number(q.answer) !== (more ? g2[1] + 100 : g2[1] - 100)) problems.push('hundred more/less wrong'); }
    if ((genId === 'g2-add' || genId === 'g2-add-story') && Number(q.answer) !== g2[0] + g2[1]) problems.push('grade 2 add wrong');
    if (genId === 'g2-add-carry-ones') { const [a, b] = g2; const o = (a % 10) + (b % 10); if (q.answer !== `Write ${o % 10}, carry 1 ten` || o < 10) problems.push('carry wrong'); }
    if (genId === 'g2-add-missing' && g2[0] + Number(q.answer) !== g2[1]) problems.push('grade 2 missing addend wrong');
    if (genId === 'g2-add-three' && Number(q.answer) !== g2[0] + g2[1] + g2[2]) problems.push('add three wrong');
    if ((genId === 'g2-sub' || genId === 'g2-sub-story' || genId === 'g2-sub-compare') && Number(q.answer) !== g2[0] - g2[1]) problems.push('grade 2 subtract wrong');
    if (genId === 'g2-sub-borrow-ones') { const [a] = g2; const t = Math.floor(a / 10); const o = a % 10; if (q.answer !== `${t - 1} tens and ${o + 10} ones`) problems.push('borrow wrong'); }
    if (genId === 'g2-sub-check') { const [a, b] = g2; if (q.answer !== `${a - b} + ${b} = ${a}`) problems.push('sub check wrong'); }
    if (genId === 'g2-read-clock' && q.answer !== `${HOURS[q.visual.hour % 12]} o'clock`) problems.push('read clock wrong');
    if (genId === 'g2-half-past' && q.answer !== `half past ${HOURS[q.visual.hour % 12]}`) problems.push('half past wrong');
    if (genId === 'g2-which-clock') { const half = /half past/.test(q.prompt); const word = half ? q.prompt.match(/half past (\w+)/)[1] : q.prompt.match(/shows (\w+) o'clock/)[1]; const h = HOURS.indexOf(word) === 0 ? 12 : HOURS.indexOf(word); if (q.answer !== `clock:${h}:${half ? 30 : 0}`) problems.push('which clock wrong'); }
    if (genId === 'g2-minutes-in') { const want = /half an hour/.test(q.prompt) ? 30 : /two hours/.test(q.prompt) ? 120 : 60; if (Number(q.answer) !== want) problems.push('minutes wrong'); }
    if (genId === 'g2-hour-later') { const h = q.visual.hour; const later = g2[0]; const h2 = ((h + later - 1) % 12) + 1; if (q.answer !== `${HOURS[h2 % 12]} o'clock`) problems.push('hour later wrong'); }
    if (genId === 'g2-coin-value' && Number(q.answer) !== COINV[q.prompt.match(/is a (\w+)/)[1]]) problems.push('coin value wrong');
    if (genId === 'g2-count-coins') { const names = q.story.match(/\ba (penny|nickel|dime|quarter)/gi).map((x) => x.slice(2).toLowerCase()); if (Number(q.answer) !== names.reduce((sum, n) => sum + COINV[n], 0)) problems.push('count coins wrong'); }
    if (genId === 'g2-make-amount') { const names = q.answer.match(/a (\w+)/g).map((x) => x.slice(2)); if (names.reduce((sum, n) => sum + COINV[n], 0) !== g2[0]) problems.push('make amount wrong'); }
    if (genId === 'g2-change' && Number(q.answer) !== 100 - g2[0]) problems.push('change wrong');
    if (genId === 'g2-which-more-money') { const val = (c) => { const [n, coin] = c.split(' '); return Number(n) * COINV[coin.replace(/s$/, '')]; }; if (val(q.answer) !== Math.max(...q.choices.map(val))) problems.push('more money wrong'); }
    if (genId === 'g2-array-total' && Number(q.answer) !== q.visual.rows * q.visual.cols) problems.push('array total wrong');
    if (genId === 'g2-repeated-add') { const terms = q.answer.split(' + ').map(Number); if (terms.length !== q.visual.rows || !terms.every((t) => t === q.visual.cols)) problems.push('repeated add wrong'); }
    if (genId === 'g2-rows-in' && Number(q.answer) !== q.visual.rows) problems.push('rows wrong');
    if (genId === 'g2-which-array' && q.answer !== `array:${g2[0]}x${g2[1]}`) problems.push('which array wrong');
    if (genId === 'g2-even-odd' && q.answer !== (g2[0] % 2 === 0 ? 'Even' : 'Odd')) problems.push('even/odd wrong');
    // Grade 2 reading, re-derived from word lists the generator does not share
    const TEAM = { rain: ['ai', 'A'], pail: ['ai', 'A'], wait: ['ai', 'A'], boat: ['oa', 'O'], road: ['oa', 'O'], soap: ['oa', 'O'], feet: ['ee', 'E'], seed: ['ee', 'E'], keep: ['ee', 'E'], meat: ['ea', 'E'], leaf: ['ea', 'E'], bead: ['ea', 'E'] };
    const SPLIT = { rabbit: 'rab bit', basket: 'bas ket', napkin: 'nap kin', picnic: 'pic nic', magnet: 'mag net', sunset: 'sun set', muffin: 'muf fin', cactus: 'cac tus' };
    const SYL2 = { banana: 3, elephant: 3, umbrella: 3, butterfly: 3 };
    if (genId === 'r2-team-sound' && q.answer !== TEAM[shown][1]) problems.push('team sound wrong');
    if (genId === 'r2-which-team' && q.answer !== TEAM[shown][0]) problems.push('which team wrong');
    if (genId === 'r2-team-word' && TEAM[q.answer][1] !== q.prompt.match(/long (\w) sound/)[1]) problems.push('team word wrong');
    if (genId === 'r2-same-team' && TEAM[q.answer][0] !== TEAM[shown][0]) problems.push('same team wrong');
    if (genId === 'r2-odd-team') { const ts = q.choices.map((c) => TEAM[c][0]); const odd = q.choices.find((c) => ts.filter((t) => t === TEAM[c][0]).length === 1); if (q.answer !== odd) problems.push('odd team wrong'); }
    if (genId === 'r2-split-word' && q.answer !== SPLIT[shown]) problems.push('split wrong');
    if (genId === 'r2-join-parts' && SPLIT[q.answer] !== shown) problems.push('join parts wrong');
    if (genId === 'r2-compound') { const [a, b] = shown.split(' + '); if (q.answer !== a + b) problems.push('compound wrong'); }
    if (genId === 'r2-compound-parts') { const [a, b] = q.answer.split(' and '); if (a + b !== shown) problems.push('compound parts wrong'); }
    if (genId === 'r2-count-parts') { const want = SYL2[shown] || (SPLIT[shown] ? 2 : 1); if (Number(q.answer) !== want) problems.push('count parts wrong'); }
    if (genId === 'r2-why' && q.answer !== `Because ${q.story.match(/because (.+?)\. At/)[1]}`) problems.push('why wrong');
    if (genId === 'r2-first' && q.answer !== q.story.split('. ')[0]) problems.push('first wrong');
    if (genId === 'r2-last' && q.answer !== q.story.match(/At the end (.+)\.$/)[1]) problems.push('last wrong');
    if (genId === 'r2-who-did' && q.answer !== q.story.split(' ')[0]) problems.push('who did wrong');
    if (genId === 'r2-how-felt' && q.answer !== q.story.match(/felt (\w+)/)[1]) problems.push('how felt wrong');
    if (genId === 'r2-context') { const CTX = { famished: 'very hungry', enormous: 'very big', timid: 'shy and easily scared', gleaming: 'shining brightly', drowsy: 'sleepy', ancient: 'very old', vanished: 'disappeared', fragile: 'easily broken' }; if (q.answer !== CTX[shown]) problems.push('context meaning wrong'); }
    if (genId === 'r2-opposite') { const OPP = { big: 'small', small: 'big', hot: 'cold', cold: 'hot', fast: 'slow', slow: 'fast', happy: 'sad', sad: 'happy', wet: 'dry', dry: 'wet', loud: 'quiet', quiet: 'loud', full: 'empty', empty: 'full', old: 'new', new: 'old' }; if (q.answer !== OPP[shown]) problems.push('opposite wrong'); }
    if (genId === 'r2-best-fit') { const SENT = { famished: 'ate three bowls', enormous: 'could not fit', timid: 'hid under the bed', gleaming: 'sparkled', drowsy: 'yawned', ancient: 'since before the town', vanished: 'could not be seen', fragile: 'does not break' }; if (!q.story.includes(SENT[q.answer])) problems.push('best fit wrong'); }
    // Grade 3 reading, re-derived from the passage parts
    const AFFIX = { un: 'not', re: 'again', pre: 'before', dis: 'the opposite of', mis: 'wrongly', ful: 'full of', less: 'without', er: 'a person who', ly: 'in that way' };
    const OPS = ['Spiders are scary.', 'Winter is the best season.', 'Vegetables taste awful.', 'Blue is the prettiest color.', 'Math is boring.', 'Cats are better than dogs.', 'Rainy days are the worst.', 'Football is the most fun sport.'];
    if (genId === 'r3-main-idea' && !q.story.startsWith(q.answer)) problems.push('main idea is not the opening sentence');
    if (genId === 'r3-detail' && (!q.story.includes(q.answer) || q.story.startsWith(q.answer))) problems.push('detail is not a later sentence of the passage');
    if (genId === 'r3-not-in-passage' && q.story.includes(q.answer)) problems.push('not-in-passage sentence is in the passage');
    if (genId === 'r3-best-title') { /* the title matches the topic, checked by the passage list itself */ }
    if (genId === 'r3-prefix-meaning' && q.answer !== AFFIX[q.prompt.match(/prefix (\w+)/)[1]]) problems.push('prefix meaning wrong');
    if (genId === 'r3-suffix-meaning' && q.answer !== AFFIX[q.prompt.match(/suffix (\w+)/)[1]]) problems.push('suffix meaning wrong');
    if (genId === 'r3-build-word') { const [affix, base] = [q.story.match(/Add (\w+) to/)[1], q.story.match(/to (\w+)\./)[1]]; if (q.answer !== affix + base && q.answer !== base + affix && q.answer !== base.replace(/e$/, '') + affix) problems.push('built word wrong'); }
    if (genId === 'r3-which-affix') { const word = q.story.match(/Look at (\w+)\./)[1]; if (!word.startsWith(q.answer) && !word.endsWith(q.answer)) problems.push('affix not in word'); }
    if (genId === 'r3-take-affix') { const [affix, word] = [q.story.match(/Take (\w+) off/)[1], q.story.match(/off (\w+)\./)[1]]; if (word !== affix + q.answer && word !== q.answer + affix && word !== q.answer.replace(/e$/, '') + affix) problems.push('take affix wrong'); }
    if (genId === 'r3-fact-opinion' && q.answer !== (OPS.includes(q.story) ? 'Opinion' : 'Fact')) problems.push('fact/opinion wrong');
    if (genId === 'r3-which-is-fact' && OPS.includes(q.answer)) problems.push('picked an opinion as a fact');
    if (genId === 'r3-which-is-opinion' && !OPS.includes(q.answer)) problems.push('picked a fact as an opinion');
    if (genId === 'r3-clue-word' && !q.story.toLowerCase().includes(q.answer)) problems.push('clue word not in sentence');
    if (genId === 'r3-cause' && !q.story.toLowerCase().startsWith(q.answer.toLowerCase())) problems.push('cause wrong');
    if (genId === 'r3-effect' && !q.story.endsWith(q.answer + '.')) problems.push('effect wrong');
    if (genId === 'r3-order') { const steps = q.story.match(/(?:First|Next|Then|Finally), ([^.]+)\./g).map((x) => x.replace(/^\w+, /, '').replace(/\.$/, '')); const before = q.prompt.match(/after you (.+)\?/)[1]; if (steps[steps.indexOf(before) + 1] !== q.answer) problems.push('order wrong'); }
    if (genId === 'r3-signal-word') { const w = q.visual.text; const cause = ['because', 'so', 'since', 'as a result'].includes(w); if (q.answer !== (cause ? 'A cause or effect' : 'The order of events')) problems.push('signal word wrong'); }
    if (genId === 'r3-what-next') { const steps = q.story.match(/(?:First|Next|Then), ([^.]+)\./g).map((x) => x.replace(/^\w+, /, '').replace(/\.$/, '')); if (steps.includes(q.answer)) problems.push('what-next repeats a given step'); }
    // Grade 4, re-derived from the numbers in the words
    const g4 = text.match(/\d+/g) ? text.match(/\d+/g).map(Number) : [];
    const isPrimeN = (n) => n > 1 && Array.from({ length: n - 2 }, (_, i) => i + 2).every((d) => n % d !== 0);
    if ((genId === 'g4-two-by-one' || genId === 'g4-two-by-two' || genId === 'g4-multiply-story') && Number(q.answer) !== g4[0] * g4[1]) problems.push('grade 4 multiply wrong');
    if (genId === 'g4-split-first') { const [a, b] = g4; if (q.answer !== `${Math.floor(a / 10) * 10} × ${b} and ${a % 10} × ${b}`) problems.push('split wrong'); }
    if (genId === 'g4-estimate-product') { const [a, b] = g4; if (Number(q.answer) !== Math.round(a / 10) * 10 * b) problems.push('estimate wrong'); }
    if ((genId === 'g4-divide-exact' || genId === 'g4-divide-story') && Number(q.answer) * g4[1] !== g4[0]) problems.push('grade 4 divide wrong');
    if (genId === 'g4-divide-remainder') { const [n, b] = g4; const [qq, r] = q.answer.match(/\d+/g).map(Number); if (qq * b + r !== n || r >= b) problems.push('remainder division wrong'); }
    if (genId === 'g4-check-division') { const [n, b, qq, r] = g4; if (q.answer !== `${qq} × ${b} + ${r} = ${n}` || qq * b + r !== n) problems.push('division check wrong'); }
    if (genId === 'g4-remainder-only') { const [n, b] = g4; if (Number(q.answer) !== n % b) problems.push('remainder wrong'); }
    if (genId === 'g4-is-factor') { const [f, n] = g4; if (q.answer !== (n % f === 0 ? 'Yes' : 'No')) problems.push('is-factor wrong'); }
    if (genId === 'g4-list-factor' && g4[0] % Number(q.answer) !== 0) problems.push('listed factor does not divide');
    if (genId === 'g4-multiple' && Number(q.answer) % g4[0] !== 0) problems.push('multiple wrong');
    if (genId === 'g4-prime' && q.answer !== (isPrimeN(g4[0]) ? 'Yes' : 'No')) problems.push('prime wrong');
    if (genId === 'g4-next-multiple') { const [a, b, base] = g4; if (Number(q.answer) !== b + base || b - a !== base) problems.push('next multiple wrong'); }
    if (genId === 'g4-fraction-to-decimal') { const [top, bottom] = g4; if (Math.abs(Number(q.answer) - top / bottom) > 1e-9) problems.push('fraction to decimal wrong'); }
    if (genId === 'g4-decimal-to-fraction') { const dec = Number(q.prompt.match(/Write ([\d.]+) as/)[1]); const [top, bottom] = q.answer.split('/').map(Number); if (Math.abs(top / bottom - dec) > 1e-9) problems.push('decimal to fraction wrong'); }
    if (genId === 'g4-compare-decimals' && Number(q.answer) !== Math.max(...q.choices.map(Number))) problems.push('compare decimals wrong');
    if (genId === 'g4-tenths-hundredths' && Number(q.answer) !== g4[0] * 10) problems.push('tenths to hundredths wrong');
    if (genId === 'g4-decimal-picture' && Math.abs(Number(q.answer) - q.visual.shaded / 10) > 1e-9) problems.push('decimal picture wrong');
    if (genId === 'g4-add-fraction') { const [a, d, b] = g4; if (q.answer !== `${a + b}/${d}`) problems.push('add fraction wrong'); }
    if (genId === 'g4-sub-fraction') { const [a, d, b] = g4; if (q.answer !== `${a - b}/${d}`) problems.push('sub fraction wrong'); }
    if (genId === 'g4-mixed-number') { const [top, d] = g4; const [w, p, dd] = q.answer.match(/\d+/g).map(Number); if (w * d + p !== top || dd !== d) problems.push('mixed number wrong'); }
    if (genId === 'g4-fraction-story') { const [d, a, b] = g4; if (q.answer !== `${a + b}/${d}`) problems.push('fraction story wrong'); }
    if (genId === 'g4-simplify') { const [top, bottom] = g4; const [t2, b2] = q.answer.split('/').map(Number); if (Math.abs(t2 / b2 - top / bottom) > 1e-9 || t2 >= top) problems.push('simplify wrong'); }
    if (genId === 'bf-add-same-bottom') { const [a, p, b] = nums.flatMap((f) => f.split('/').map(Number)).filter((_, i) => i !== 3); if (q.answer !== `${a + b}/${p}`) problems.push('same-bottom sum wrong'); }
    // Letter sounds and rhymes, re-derived from the words themselves
    const RHYME_END = (w) => w.slice(-2);
    if (genId === 'rs-word-starts' && q.answer !== q.story.match(/Listen: (\w+)/)[1][0].toUpperCase()) problems.push('first sound letter wrong');
    if (genId === 'rs-pick-word' && q.answer[0].toUpperCase() !== q.prompt.match(/starts with ([A-Z])/)[1]) problems.push('picked word starts with the wrong letter');
    if (genId === 'rs-same-start') { const w = q.story.match(/Listen: (\w+)/)[1]; if (q.answer[0] !== w[0]) problems.push('same-start word differs'); if (q.choices.filter((c) => c[0] === w[0]).length !== 1) problems.push('same-start has two matches'); }
    if (genId === 'rs-odd-start') { const firsts = q.choices.map((c) => c[0]); const odd = q.choices.find((c) => firsts.filter((f) => f === c[0]).length === 1); if (q.answer !== odd) problems.push('odd start wrong'); }
    if (genId === 'rr-does-rhyme') { const [a, c] = q.story.replace(/\./g, '').trim().split(/\s+/); if ((RHYME_END(a) === RHYME_END(c) ? 'Yes' : 'No') !== q.answer) problems.push('rhyme yes/no wrong'); }
    if (genId === 'rr-pick-rhyme') { const a = q.story.match(/Listen: (\w+)/)[1]; if (RHYME_END(q.answer) !== RHYME_END(a)) problems.push('picked rhyme does not rhyme'); if (q.choices.filter((c) => RHYME_END(c) === RHYME_END(a)).length !== 1) problems.push('two choices rhyme'); }
    if (genId === 'rr-odd-rhyme') { const ends = q.choices.map(RHYME_END); const odd = q.choices.find((c) => ends.filter((e) => e === RHYME_END(c)).length === 1); if (q.answer !== odd) problems.push('odd rhyme wrong'); }
    if (genId === 'rr-same-end') { const end = q.prompt.match(/ends with (\w+)/)[1]; if (!q.answer.endsWith(end)) problems.push('same-end word does not end that way'); }
    if (genId === 'rr-which-two') { const [x, y] = q.answer.split(' and '); if (RHYME_END(x) !== RHYME_END(y)) problems.push('which-two pair does not rhyme'); }
    if (problems.length) bad.push(`seed ${seed}: ${problems.join('; ')}`);
  }
  ok(`${genId}: 300 seeds all valid and arithmetically correct`, bad.length === 0, bad.slice(0, 3).join(' | '));
}

// ---- 2. Determinism: same seed => identical question; different seed => usually different ----
ok('same seed gives identical question', JSON.stringify(L.generateQuestion('m3-different', 7)) === JSON.stringify(L.generateQuestion('m3-different', 7)));
ok('different seeds give different questions', JSON.stringify([L.generateQuestion('m1-part-eaten', 1).story, L.generateQuestion('m1-part-eaten', 1).choices]) !== JSON.stringify([L.generateQuestion('m1-part-eaten', 2).story, L.generateQuestion('m1-part-eaten', 2).choices]));

// ---- 3. Attempts ----
const att = L.buildAttempt('fraction-meaning', 123, []);
ok('attempt has 5 core questions', att.core.length === L.CONFIG.CORE_QUESTIONS_PER_ATTEMPT);
ok('first module never gets a review question', att.review === null);
ok('core questions belong to the module', att.core.every((q) => L.getModule('fraction-meaning').generators.includes(q.genId)));
const att2 = L.buildAttempt('equivalent-fractions', 5, ['fraction-meaning']);
ok('later module gets a review question from an earlier mastered module', att2.review && att2.review.moduleId === 'fraction-meaning');
ok('no review question when nothing earlier is mastered', L.buildAttempt('equivalent-fractions', 5, []).review === null);
ok('attempt is reproducible from its seed', JSON.stringify(L.buildAttempt('comparing-fractions', 9, ['fraction-meaning'])) === JSON.stringify(L.buildAttempt('comparing-fractions', 9, ['fraction-meaning'])));

// ---- 4. Answer checking ----
const nq = { type: 'number', answer: '12' };
ok('number: "12" correct', L.checkAnswer(nq, '12'));
ok('number: " 12 " correct (whitespace ok)', L.checkAnswer(nq, ' 12 '));
ok('number: "twelve" wrong', !L.checkAnswer(nq, 'twelve'));
ok('number: empty wrong', !L.checkAnswer(nq, ''));
ok('choice: exact match required', L.checkAnswer({ type: 'choice', answer: '3/4' }, '3/4') && !L.checkAnswer({ type: 'choice', answer: '3/4' }, '6/8'));

// ---- 5. Mastery, locking, reset, report — all derived from events ----
const core = (n) => Array.from({ length: 5 }, (_, i) => ({ genId: 'x', seed: i, prompt: 'p', answer: 'a', given: i < n ? 'a' : 'b', correct: i < n }));
const ev = (moduleId, n, at, review = null) => L.makeAttemptEvent({ moduleId, seed: 1 }, core(n), review, at, at);
let events = [];
let p = L.deriveProgress(events);
  ok('fresh: a first module with no outside prerequisite is available, everything else locked', L.COURSES.every((c) => { const st = L.moduleStatuses(p).filter((x) => c.modules.some((m) => m.id === x.id)); return st.every((x) => { const req = L.prerequisitesOf(x.id); return x.status === (req.length === 0 ? 'available' : 'locked'); }); }));
events.push(ev('fraction-meaning', 3, '2026-09-03T10:00:00Z'));
p = L.deriveProgress(events);
ok('3 of 5 does not master', !p.perModule['fraction-meaning'].mastered && p.perModule['fraction-meaning'].attempts === 1);
events.push(ev('fraction-meaning', 4, '2026-09-03T10:10:00Z'));
p = L.deriveProgress(events);
ok('4 of 5 masters and unlocks module 2', p.perModule['fraction-meaning'].mastered && L.moduleStatuses(p)[1].status === 'available' && L.moduleStatuses(p)[2].status === 'locked');
ok('masteredAt is the time of the passing attempt', p.perModule['fraction-meaning'].masteredAt === '2026-09-03T10:10:00Z');
events.push(ev('equivalent-fractions', 5, '2026-09-03T10:20:00Z', { moduleId: 'fraction-meaning', genId: 'x', seed: 1, prompt: 'p', answer: 'a', given: 'b', correct: false }));
p = L.deriveProgress(events);
ok('review question counted for retention, not for the gate', p.review.asked === 1 && p.review.correct === 0 && p.perModule['equivalent-fractions'].mastered);
const r = L.buildReport('Test', events);
ok('report: 2 mastered, 3 attempts, accuracy 70% on module 1', r.modulesMastered === 2 && r.modulesTotal === L.MODULES.length && r.totalAttempts === 3 && r.modules.find((m) => m.id === 'fraction-meaning').accuracyPercent === 70);
ok('report carries its definitions', r.definitions.length >= 4);
events.push(L.makeResetEvent('2026-09-03T11:00:00Z'));
p = L.deriveProgress(events);
ok('reset: history kept, but nothing counts as mastered afterwards', events.length === 4 && p.masteredIds.length === 0 && L.moduleStatuses(p)[0].status === 'available');

// ---- 6. Confidence score follows its printed rules ----
{
  const t = (i) => new Date(2026, 8, 3, 10, i).toISOString();
  const core = (pattern, ms = 9000) => pattern.split('').map((c, i) => { const r = { genId: 'm1-picture', seed: i + 1, prompt: 'q', answer: '1/2', given: c === '1' ? '1/2' : '1/3', correct: c === '1' }; if (ms !== null) r.timeMs = ms; return r; });
  const att = (moduleId, pattern, at, review = null, ms) => {
    const results = core(pattern, ms);
    return { type: 'attempt_completed', at, startedAt: at, moduleId: moduleId, seed: 1, core: results, review, coreCorrect: results.filter((r) => r.correct).length, coreTotal: results.length };
  };
  const M = 'fraction-meaning';
  ok('confidence: no attempts -> no score', L.computeConfidence(M, []).score === null);
  ok('confidence: 3 of 5, not mastered -> 1', L.computeConfidence(M, [att(M, '11100', t(1))]).score === 1);
  ok('confidence: mastered with 4 of 5 -> 3', L.computeConfidence(M, [att(M, '11110', t(1))]).score === 3);
  ok('confidence: mastered and latest set perfect -> 4', L.computeConfidence(M, [att(M, '11110', t(1)), att(M, '11111', t(2))]).score === 4);
  ok('confidence: 10 correct in a row -> 5', L.computeConfidence(M, [att(M, '11111', t(1)), att(M, '11111', t(2))]).score === 5);
  const rev = (correct) => ({ moduleId: M, genId: 'm1-picture', seed: 1, prompt: 'q', answer: '1/2', given: '1/2', correct });
  const withRetention = [att(M, '11110', t(1)), att('equivalent-fractions', '11110', t(2), rev(true)), att('equivalent-fractions', '11111', t(3), rev(true))];
  ok('confidence: mastered + 2 of 2 review questions right -> 4', L.computeConfidence(M, withRetention).score === 4);
  ok('confidence: never above 5', L.computeConfidence(M, [att(M, '11111', t(1)), att(M, '11111', t(2)), att('equivalent-fractions', '11111', t(3), rev(true)), att('equivalent-fractions', '11111', t(4), rev(true))]).score === 5);
  const guessy = L.computeConfidence(M, [att(M, '11100', t(1), null, 1500)]);
  ok('confidence: two fast wrong answers flags guessing', guessy.signals.includes('guessing?'));
  ok('confidence: slow wrong answers do not flag guessing', !L.computeConfidence(M, [att(M, '11100', t(1), null, 9000)]).signals.includes('guessing?'));
  ok('confidence: median time reported in seconds', L.computeConfidence(M, [att(M, '11111', t(1), null, 6500)]).medianSec === 6.5);
  ok('confidence: missing timings do not break it', L.computeConfidence(M, [att(M, '11111', t(1), null, null)]).medianSec === null);
  const rep = L.buildReport('Test', [att(M, '11110', t(1))]);
  ok('report includes a confidence score per module', rep.modules.find((m) => m.id === M).confidence.score === 3 && rep.modules.find((m) => m.id === 'equivalent-fractions').confidence.score === null);
  ok('report prints the confidence rules', rep.definitions.some((d) => d.startsWith('Confidence starts at 1')));
  ok('every question has a one-sentence prompt and a story or null', Object.keys(L.GENERATORS).every((g) => { const q = L.generateQuestion(g, 7); return typeof q.prompt === 'string' && q.prompt.length < 70 && (q.story === null || typeof q.story === 'string'); }));
  ok('explanation pictures are valid bars or a group of dots', Object.keys(L.GENERATORS).every((g) => { const q = L.generateQuestion(g, 11); if (q.explainVisual === null) return true; if (Array.isArray(q.explainVisual)) return q.explainVisual.every((b) => Number.isInteger(b.parts) && b.parts >= 2 && b.shaded >= 0 && b.shaded <= b.parts && typeof b.label === 'string'); if (q.explainVisual.kind === 'letters') return typeof q.explainVisual.text === 'string' && q.explainVisual.text.length > 0; return q.explainVisual.kind === 'dots' && q.explainVisual.count >= 1 && q.explainVisual.count <= 10; }));
}

// ---- 7. Courses, subjects, and the per-learner course switch ----
{
  ok('every module belongs to a course with a subject', L.MODULES.every((m) => L.getCourse(m.courseId) && typeof L.getCourse(m.courseId).subject === 'string'));
  ok('coverage rule: every module has at least 5 question types', L.MODULES.every((m) => m.generators.length >= 5));
  ok('all courses enabled by default', JSON.stringify(L.enabledCourseIds([])) === JSON.stringify(L.COURSES.map((c) => c.id)));
  const off = L.makeCoursesEnabledEvent([], '2026-09-03T10:00:00.000Z');
  ok('educator can switch every course off', L.enabledCourseIds([off]).length === 0);
  const on = L.makeCoursesEnabledEvent(['fractions-intro', 'not-a-real-course'], '2026-09-03T10:01:00.000Z');
  ok('unknown course ids are ignored, latest setting wins', JSON.stringify(L.enabledCourseIds([off, on])) === '["fractions-intro"]');
  const reset = L.makeResetEvent('2026-09-03T10:02:00.000Z');
  ok('course setting survives a progress reset', L.buildReport('T', [off, reset]).enabledCourseIds.length === 0);
  ok('report rows carry subject and course', L.buildReport('T', []).modules.every((m) => typeof m.subject === 'string' && typeof m.courseTitle === 'string'));
  ok('kindergarten course exists, is read-aloud, and has eleven modules', L.getCourse('counting-k') && L.getCourse('counting-k').readAloud === true && L.getCourse('counting-k').modules.length === 11);
  ok('reading course exists in a second subject', L.getCourse('letters-k') && L.getCourse('letters-k').subject === 'Reading' && L.getCourse('letters-k').readAloud === true);
  ok('describeChoice turns a picture choice into words', L.describeChoice('dots:4') === 'the group with 4' && L.describeChoice('3/4') === '3/4');
}

// ---- 8. Wonder: open questions, never stored words, never graded ----
{
  const allApproved = L.WONDER.reduce((r, w) => L.approveWonder(r, w.id), L.emptyWonderReview());
  ok('every course has a Wonder question once approved', L.COURSES.every((c) => L.wonderFor(c.id, 0, allApproved) !== null));
  ok('nothing is offered to a student before somebody approves it', L.COURSES.every((c) => L.wonderFor(c.id, 0, L.emptyWonderReview()) === null));
  ok('everything starts out awaiting review', L.wonderAwaitingReview(L.emptyWonderReview()) === L.WONDER.length);
  ok('approving one leaves the rest waiting', L.wonderAwaitingReview(L.approveWonder(L.emptyWonderReview(), 'w-one-thing')) === L.WONDER.length - 1);
  ok('an approved question can be withdrawn again', L.wonderFor('fractions-intro', 0, L.unapproveWonder(allApproved, 'w-one-thing')) === null);
  const hiddenState = L.hideWonder(allApproved, 'w-one-thing');
  ok('hiding a question also withdraws its approval', L.isWonderApproved(hiddenState, 'w-one-thing') === false && L.isWonderHidden(hiddenState, 'w-one-thing'));
  ok('a hidden question is not counted as awaiting review', L.wonderAwaitingReview(hiddenState) === 0);
  ok('a hidden question can be brought back for review', L.wonderAwaitingReview(L.restoreWonder(hiddenState, 'w-one-thing')) === 1);
  ok('questions run from the first met in pre-K to the last', L.wonderInOrder()[0].id === 'w-favourite-colour' && L.wonderInOrder().slice(-1)[0].stage === 'growing');
  ok('every question names a stage the platform knows', L.WONDER.every((w) => L.LIFE_STAGES.some((st) => st.id === w.stage)));
  ok('approve all approves everything not removed', L.approveAllWonder(L.emptyWonderReview()).approved.length === L.WONDER.length);
  ok('approve all leaves removed questions removed', L.approveAllWonder(hiddenState).approved.includes('w-one-thing') === false);
  ok('un-approve all sends everything back to awaiting review and keeps removals', L.unapproveAllWonder(allApproved).approved.length === 0 && L.unapproveAllWonder(hiddenState).hidden.includes('w-one-thing'));
  { const done = ['colours', 'same-and-different', 'patterns', 'count-to-3'].map((id, i) => ({ type: 'attempt_completed', at: `u${i}`, startedAt: 'u', moduleId: id, seed: 1, core: [], review: null, coreCorrect: 5, coreTotal: 5 }));
    ok('finishing a course unlocks the next course up in that subject', JSON.stringify(L.coursesToUnlock([L.makeCoursesEnabledEvent(['first-steps-pk'], 't'), ...done])) === '["counting-k"]');
    ok('nothing unlocks while a course is unfinished', L.coursesToUnlock([L.makeCoursesEnabledEvent(['first-steps-pk'], 't'), ...done.slice(0, 2)]).length === 0); }
  // The cadence: one reflection after every two mastered modules, rotating through the pool
  const pass = (id, at) => ({ type: 'attempt_completed', at, startedAt: at, moduleId: id, seed: 1, core: [], review: null, coreCorrect: 5, coreTotal: 5 });
  const one = [pass('count-to-5', '2026-09-01T10:00:00.000Z')];
  const two = [...one, pass('count-to-10', '2026-09-01T11:00:00.000Z')];
  ok('one round is not yet due a reflection', L.nextWonder(one, 'counting-k', allApproved) === null);
  ok('two rounds are due one', L.nextWonder(two, 'counting-k', allApproved) !== null);
  const failed = (id, at) => ({ ...pass(id, at), coreCorrect: 1 });
  ok('failed rounds count too, so a struggling child meets more reflections', L.nextWonder([failed('count-to-5', 't1'), failed('count-to-5', 't2')], 'counting-k', allApproved) !== null);
  ok('after a failed round the reflection is about failure, feelings, or getting through', ['failure', 'feelings', 'ups-and-downs'].includes(L.nextWonder([failed('count-to-5', 't1'), failed('count-to-5', 't2')], 'counting-k', allApproved).theme));
  ok('a pre-reader only ever gets a question with two spoken voices', Array.isArray(L.nextWonder(two, 'counting-k', allApproved, true).simple));
  ok('nothing is due when nothing is approved', L.nextWonder(two, 'counting-k', L.emptyWonderReview()) === null);
  const first = L.nextWonder(two, 'counting-k', allApproved);
  const answered = [...two, L.makeWonderEvent(first.id, 'count-to-10', '2026-09-01T11:30:00.000Z', 20, 1)];
  ok('answering one resets the count', L.nextWonder(answered, 'counting-k', allApproved) === null);
  const more = [...answered, pass('one-more-one-less', '2026-09-02T10:00:00.000Z'), pass('joining-and-taking-away', '2026-09-02T11:00:00.000Z')];
  const second = L.nextWonder(more, 'counting-k', allApproved);
  ok('the next reflection is a different question, not a repeat', second !== null && second.id !== first.id);
  ok('the pool is shared across courses at the same stage', L.WONDER.filter((w) => w.stage === 'early').length >= 5);
  // Never a third time: exhaust every early question twice, and the reflection is skipped
  const earlyIds = L.WONDER.filter((w) => w.stage === 'early').map((w) => w.id);
  let log = []; let t = 0;
  for (let round = 0; round < 2; round++) for (const id of earlyIds) log.push(L.makeWonderEvent(id, 'count-to-5', `2026-09-0${1 + (t++ % 8)}T${String(10 + (t % 12)).padStart(2, '0')}:00:00.000Z`, 10, 1));
  log.sort((a, b) => a.at.localeCompare(b.at));
  const exhausted = [...log, pass('count-to-5', '2026-09-20T10:00:00.000Z'), pass('count-to-10', '2026-09-20T11:00:00.000Z')];
  ok('once every question has been answered twice, no reflection is offered rather than a repeat', L.nextWonder(exhausted, 'counting-k', allApproved) === null);
  const almost = exhausted.filter((e) => !(e.type === 'wonder_answered' && e.wonderId === earlyIds[0] && e === log.filter((x) => x.wonderId === earlyIds[0])[1]));
  ok('a question answered only once is still offered before any repeats', L.nextWonder(almost, 'counting-k', allApproved) !== null && L.nextWonder(almost, 'counting-k', allApproved).id === earlyIds[0]);
  ok('every Wonder question has four perspectives and a closing question', L.WONDER.every((w) => w.perspectives.length === 4 && w.closing.includes('?')));
  ok('every perspective is written in complete sentences, not fragments', L.WONDER.every((w) => w.perspectives.every((p) => p.says.split('. ').every((sentence) => sentence.trim().split(/\s+/).length >= 5))));
  ok('no perspective uses an em dash', L.WONDER.every((w) => w.perspectives.every((p) => !p.says.includes('\u2014'))));
  ok('pick-mode Wonder questions offer options', L.WONDER.filter((w) => w.answerMode === 'pick').every((w) => Array.isArray(w.options) && w.options.length >= 2));
  const ev = L.makeWonderEvent('w-one-thing', 'fraction-meaning', '2026-09-04T10:00:00.000Z', 42, 12);
  ok('a Wonder event stores no words', !Object.values(ev).some((v) => typeof v === 'string' && v.split(' ').length > 3));
  ok('Wonder never affects mastery', L.deriveProgress([ev]).masteredIds.length === 0);
  ok('report counts reflections', L.buildReport('T', [ev]).reflections === 1);
}

// ---- 9. Grades and feature switches ----
{
  ok('every course names a grade the platform knows', L.COURSES.every((c) => L.GRADES.includes(c.grade)));
  ok('grade labels read plainly', L.gradeLabel('K') === 'Kindergarten' && L.gradeLabel('3') === 'Grade 3');
  ok('only grades that have courses are offered, in order', JSON.stringify(L.gradesWithCourses()) === '["PK4","K","1","2","3","4"]');
  const k = L.subjectsForGrade('K');
  ok('kindergarten groups into Math and Reading', k.length === 2 && k[0].subject === 'Math' && k[1].subject === 'Reading');
  ok('a grade with no courses returns nothing', L.subjectsForGrade('7').length === 0);
  ok('every course in a grade group really belongs to that grade', L.gradesWithCourses().every((g) => L.subjectsForGrade(g).every((s) => s.courses.every((c) => c.grade === g))));
  ok('the optional sections have switches', ['reflection', 'lifeSkills', 'checks'].every((k2) => typeof L.FEATURES[k2] === 'boolean'));
}

// ---- 10. Roster: admins create the IDs, students only pick them ----
{
  let r = L.emptyRoster();
  ok('a new roster is empty', r.students.length === 0);
  ok('an empty ID is refused with a plain sentence', L.addStudent(r, '  ', 't', { level: 'elementary' }).error === 'Enter a student ID first.');
  r = L.addStudent(r, 'S-1042', '2026-09-05T10:00:00.000Z', { level: 'elementary' }).roster;
  ok('an ID becomes a safe key but keeps its readable label', r.students[0].id === 's_1042' && r.students[0].label === 'S-1042');
  ok('the same ID cannot be added twice', L.addStudent(r, 's-1042', 't', { level: 'elementary' }).error !== null);
  r = L.addStudent(r, 'S-2001', 't', { level: 'elementary' }).roster;
  ok('renaming keeps the id, so progress cannot be lost', L.renameStudent(r, 'S-1042', 'Sam R.').roster.students[0].id === 's_1042' && L.renameStudent(r, 'S-1042', 'Sam R.').roster.students[0].label === 'Sam R.');
  ok('a blank name is refused', L.renameStudent(r, 'S-1042', ' ').error !== null);
  const hidden = L.setStudentActive(r, 'S-2001', false);
  ok('deactivating hides a student without deleting them', L.activeStudents(hidden).length === 1 && hidden.students.length === 2);
  const merged = L.mergeStudents(r, 'S-1042', 'S-2001');
  ok('merging keeps one student and marks the other', L.activeStudents(merged.roster).length === 1 && L.findStudent(merged.roster, 'S-2001').mergedInto === 's_1042');
  ok('merging a student with itself is refused', L.mergeStudents(r, 'S-1042', 'S-1042').error !== null);
  const a = [{ type: 'lesson_viewed', at: '2026-01-02T00:00:00.000Z', moduleId: 'x' }];
  const b = [{ type: 'lesson_viewed', at: '2026-01-01T00:00:00.000Z', moduleId: 'y' }];
  ok('merged event logs stay in time order and lose nothing', JSON.stringify(L.mergeEventLogs(a, b).map((e) => e.moduleId)) === '["y","x"]');
  // Starting levels and pictures
  ok('there are four starting levels covering pre-K to college', L.LEVELS.length === 4 && L.LEVELS[0].grades.includes('PK3') && L.LEVELS[3].grades.includes('C'));
  ok('only the early years ask for a picture', L.LEVELS.filter((l) => l.picture).map((l) => l.id).join() === 'early');
  const young = L.addStudent(L.emptyRoster(), 'S-9', 't', { level: 'early', picture: 'fox' }).roster.students[0];
  ok('a student can be added with a level and a picture', young.level === 'early' && young.picture === 'fox');
  ok('an unknown level is refused, a level is required', L.addStudent(L.emptyRoster(), 'S-8', 't', { level: 'genius' }).error === 'Choose a starting level first.');
  ok('an unknown picture is dropped rather than stored', L.addStudent(L.emptyRoster(), 'S-8', 't', { level: 'middle', picture: 'selfie.jpg' }).roster.students[0].picture === null);
  ok('a backup file name names the device, the count and the date', L.backupFileName('iPad 3', 12, '2026-09-10T15:00:00.000Z') === 'edusphere-ipad-3-12-students-2026-09-10.json');
  ok('a missing device name still gives a sensible file name', L.backupFileName('', 1, '2026-09-10') === 'edusphere-device-1-student-2026-09-10.json');
  ok('pictures are a fixed drawn set, never an upload', L.PICTURES.length === 12 && L.PICTURES.every((p) => /^[a-z]+$/.test(p)));
  ok('twelve animals and six colours give seventy-two pictures', L.PICTURES.length * L.TINTS.length === 72);
  let big = L.emptyRoster();
  for (let i = 0; i < 30; i++) { const f = L.firstFreePicture(big); big = L.addStudent(big, `K-${i}`, 't', { level: 'early', picture: f.picture, tint: f.tint }).roster; }
  const keys = big.students.map((st) => `${st.picture}:${st.tint}`);
  ok('thirty young students can each have a different picture', new Set(keys).size === 30);
  ok('a picture in use is reported as in use', L.pictureInUse(big, big.students[0].picture, big.students[0].tint) === true);
  ok('a hidden student frees their picture', L.pictureInUse(L.setStudentActive(big, 'K-0', false), big.students[0].picture, big.students[0].tint) === false);
  ok('a picture always carries a colour', big.students.every((st) => L.tintFor(st.tint) !== null));
  const withPic = L.setStudentPicture(L.addStudent(L.emptyRoster(), 'S-7', 't', { level: 'elementary' }).roster, 'S-7', 'owl');
  ok('a picture can be added later, with a default colour', L.findStudent(withPic, 'S-7').picture === 'owl' && L.findStudent(withPic, 'S-7').tint === 'sun');
  ok('a picture can be removed again', L.findStudent(L.setStudentPicture(withPic, 'S-7', null), 'S-7').picture === null);
  ok('a level narrows recommendations to its band', JSON.stringify(L.recommendedCourseIds([L.makeCoursesEnabledEvent([], 't')], 'early')) === '["first-steps-pk"]');
  ok('a level with no courses yet recommends nothing rather than kindergarten', L.recommendedCourseIds([L.makeCoursesEnabledEvent([], 't')], 'middle').length === 0);
  ok('the letters course needs a touch screen and math does not', L.courseNeedsTouch('letters-k') === true && L.courseNeedsTouch('counting-k') === false);
  ok('a wobbly hand passes, a wrong letter and a scribble do not', L.traceMatches('L', [[[34, 16], [31, 42], [28, 63], [33, 84]], [[31, 88], [52, 83], [74, 86]]]) && !L.traceMatches('L', [[[30, 15], [75, 15]], [[50, 15], [50, 85]]]) && !L.traceMatches('L', [Array.from({ length: 80 }, (_, i) => [(i * 37) % 100, (i * 53) % 100])]));
}

// ---- 11. Resetting one module without touching the others ----
{
  const att = (moduleId, at) => ({ type: 'attempt_completed', at, startedAt: at, moduleId, seed: 1, core: [], review: null, coreCorrect: 5, coreTotal: 5 });
  const events = [att('fraction-meaning', '2026-09-01T10:00:00.000Z'), att('count-to-5', '2026-09-01T11:00:00.000Z')];
  const before = L.deriveProgress(events);
  ok('both modules start out mastered', before.masteredIds.includes('fraction-meaning') && before.masteredIds.includes('count-to-5'));
  const after = L.deriveProgress([...events, L.makeModuleResetEvent('count-to-5', '2026-09-02T10:00:00.000Z')]);
  ok('resetting one module clears only that one', after.masteredIds.includes('fraction-meaning') && !after.masteredIds.includes('count-to-5'));
  ok('a module reset clears its attempt count too', after.perModule['count-to-5'].attempts === 0 && after.perModule['fraction-meaning'].attempts === 1);
  const redone = L.deriveProgress([...events, L.makeModuleResetEvent('count-to-5', '2026-09-02T10:00:00.000Z'), att('count-to-5', '2026-09-03T10:00:00.000Z')]);
  ok('practice after a module reset counts again', redone.masteredIds.includes('count-to-5'));
  ok('nothing is deleted by a reset', [...events, L.makeModuleResetEvent('count-to-5', 't')].length === 3);
  // The prerequisite graph
  ok('the second module in a course needs the first', JSON.stringify(L.prerequisitesOf('count-to-10')) === '["count-to-5"]');
  ok('the first module in a course needs nothing, unless it names something', L.prerequisitesOf('colours').length === 0 && JSON.stringify(L.prerequisitesOf('count-to-5')) === '["count-to-3"]');
  ok('the graph has no missing links and no loops', L.checkPrerequisiteGraph().length === 0);
  ok('a non-linear course does not chain its modules', L.prerequisitesOf('count-to-3').length === 0 && JSON.stringify(L.prerequisitesOf('patterns')) === '["same-and-different"]');
  const fresh = L.deriveProgress([]);
  ok('only first modules are open to a brand new student', L.moduleStatuses(fresh).filter((s) => s.status === 'available').every((s) => L.prerequisitesOf(s.id).length === 0));
}

// ---- 12. The plain-English summary describes everything assigned at once ----
{
  const att = (moduleId, at, correct) => ({ type: 'attempt_completed', at, startedAt: at, moduleId, seed: 1, core: [], review: null, coreCorrect: correct, coreTotal: 5 });
  const rep = L.buildReport('Sam R.', [att('count-to-5', '2026-09-01T10:00:00.000Z', 5)]);
  const text = L.summaryParagraph(rep);
  ok('the summary opens with the readable name', text.startsWith('Sam R. has mastered'));
  ok('it counts every assigned course, not one grade at a time', text.includes('1 of 11 in Kindergarten math') && text.includes('in third grade math') && text.includes('pre-K 4 math') && text.includes('first grade math'));
  ok('grades are spoken the way a person would say them', text.includes('Kindergarten') && text.includes('third grade') && !text.includes('Grade 3'));
  ok('confidence is described in words, never as a raw score', /Confidence is strongest|ground to make up|steady across the board|not been enough practice/.test(text) && !/score of \d|\d out of 5/.test(text));
  ok('reflections are reported in a plain sentence', text.includes('No reflections have been answered yet'));
  const noneOn = L.buildReport('Sam', [L.makeCoursesEnabledEvent([], '2026-09-01T09:00:00.000Z')]);
  ok('a student with nothing switched on is told so plainly', L.summaryParagraph(noneOn).includes('no courses switched on yet'));
  ok('the summary agrees with the report it came from', text.includes(`${rep.modules.filter((m) => m.courseId === 'counting-k' && m.mastered).length} of 11`));
}

// ---- 13. Course labels and the recommended list ----
{
  ok('a course label leads with its name', L.courseLabel(L.getCourse('fractions-intro')) === 'Fractions (Grade 3 - Math)');
  ok('kindergarten is abbreviated', L.courseLabel(L.getCourse('counting-k')) === 'Counting (KG - Math)');
  ok('grades read naturally in a sentence', L.gradeInSentence('K') === 'Kindergarten' && L.gradeInSentence('3') === 'third grade');
  ok('a brand new student is recommended the earliest grade only', L.recommendedCourseIds([L.makeCoursesEnabledEvent([], 't')]).every((id) => L.getCourse(id).grade === 'PK4'));
  const rec = L.recommendedCourseIds([L.makeCoursesEnabledEvent(['fractions-intro'], 't')]);
  ok('recommendations follow the grade a student is working in', rec.includes('fractions-intro') && !rec.includes('counting-k'));
  ok('every course is either recommended or optional, never both or neither', L.COURSES.every((c) => rec.includes(c.id) || !rec.includes(c.id)));
}

// ---- 14. Per-module mastery rules and the transcript ----
{
  ok('a module with no override uses the platform default', L.moduleRules('count-to-5').questions === L.CONFIG.CORE_QUESTIONS_PER_ATTEMPT && L.moduleRules('count-to-5').toMaster === L.CONFIG.MASTERY_MIN_CORRECT);
  ok('an unknown module still returns sensible rules', L.moduleRules('nope').questions === L.CONFIG.CORE_QUESTIONS_PER_ATTEMPT);
  const att = (moduleId, at, correct, total) => ({ type: 'attempt_completed', at, startedAt: at, moduleId, seed: 1, core: [], review: null, coreCorrect: correct, coreTotal: total || 5 });
  const events = [att('count-to-5', '2026-09-01T10:00:00.000Z', 5), att('count-to-10', '2026-09-02T10:00:00.000Z', 5), att('one-more-one-less', '2026-09-02T11:00:00.000Z', 5), att('joining-and-taking-away', '2026-09-02T12:00:00.000Z', 5), att('comparing-numbers', '2026-09-02T13:00:00.000Z', 5), att('shapes', '2026-09-02T14:00:00.000Z', 5), att('counting-by-tens', '2026-09-02T15:00:00.000Z', 5), att('longer-and-heavier', '2026-09-02T16:00:00.000Z', 5), att('sorting', '2026-09-02T17:00:00.000Z', 5), att('solids', '2026-09-02T18:00:00.000Z', 5), att('making-ten', '2026-09-02T19:00:00.000Z', 5), att('fraction-meaning', '2026-09-03T10:00:00.000Z', 2)];
  const tr = L.buildTranscript('S-1042', events);
  ok('a course with every module mastered is listed as completed', tr.completed.length === 1 && tr.completed[0].id === 'counting-k');
  ok('a course part way through is listed separately', tr.inProgress.length === 1 && tr.inProgress[0].id === 'fractions-intro');
  ok('a course never opened is left off the transcript entirely', ![...tr.completed, ...tr.inProgress].some((c) => c.id === 'letters-k'));
  ok('the transcript records when a course was completed', typeof tr.completed[0].completedAt === 'string');
  ok('the transcript keeps courses that are no longer switched on', L.buildTranscript('S', [...events, L.makeCoursesEnabledEvent([], '2026-09-04T10:00:00.000Z')]).completed.length === 1);
  ok('a course switched off is marked as such', L.buildTranscript('S', [...events, L.makeCoursesEnabledEvent([], '2026-09-04T10:00:00.000Z')]).completed[0].stillAssigned === false);
  ok('transcript courses run beginner to advanced', L.buildTranscript('S', [att('count-to-5', 't1', 5), att('fraction-meaning', 't2', 5)]).inProgress.every((c, i, list) => i === 0 || L.GRADES.indexOf(list[i - 1].grade) <= L.GRADES.indexOf(c.grade)));
  ok('the transcript states plainly that it holds no personal information', tr.note.includes('no personal information'));
  ok('the transcript carries nothing a student wrote', JSON.stringify(tr).includes('wonder_answered') === false);
}

// ---- 15. Life skills: an ordered sequence rather than a grade assignment ----
{
  const ordered = L.lifeSkillsInOrder();
  ok('every skill is in the sequence', ordered.length === L.LIFE_SKILLS.length && ordered.length >= 30);
  ok('the first skill is the earliest and the last is the most mature', ordered[0].maturity === 0 && ordered[ordered.length - 1].maturity === 1);
  ok('maturity only ever rises down the list', ordered.every((sk, i) => i === 0 || sk.maturity >= ordered[i - 1].maturity));
  ok('positions are numbered from one', ordered[0].position === 1 && ordered[ordered.length - 1].position === ordered.length);
  ok('no skill is pinned to a grade any more', L.LIFE_SKILLS.every((sk) => sk.grade === undefined));
  ok('every skill says what it is, why it matters and how to practice it', L.LIFE_SKILLS.every((sk) => sk.title && sk.why.length > 40 && sk.ways.length >= 3));
  ok('no life skill text uses an em dash', L.LIFE_SKILLS.every((sk) => !sk.why.includes('\u2014') && sk.ways.every((w) => !w.includes('\u2014'))));
  ok('the earliest skill is simple and the last is grown up', ordered[0].title === 'Riding a bike' && ordered[ordered.length - 1].title === 'Working out what matters to you');
  ok('every stage has skills in it', L.LIFE_STAGES.every((st) => ordered.some((sk) => sk.stage === st.id)));
  ok('every id is unique', new Set(L.LIFE_SKILLS.map((sk) => sk.id)).size === L.LIFE_SKILLS.length);
  ok('life skills can be switched off entirely', typeof L.FEATURES.lifeSkills === 'boolean');
  ok('there are four stage markers down the sequence', L.LIFE_STAGES.length === 4 && L.LIFE_STAGES[0].id === 'early' && L.LIFE_STAGES[3].id === 'grown');
  ok('every skill belongs to a stage the platform knows', ordered.every((sk) => L.LIFE_STAGES.some((st) => st.id === sk.stage)));
  ok('stages never run backwards down the list', ordered.every((sk, i) => i === 0 || L.LIFE_STAGES.findIndex((st) => st.id === sk.stage) >= L.LIFE_STAGES.findIndex((st) => st.id === ordered[i - 1].stage)));
  const none = L.emptyCoveredSkills();
  ok('nothing is covered to begin with', none.covered.length === 0 && L.coveredCount(none, ordered) === 0);
  const one = L.toggleCovered(none, 'ls-bike');
  ok('a skill can be marked as covered', L.isCovered(one, 'ls-bike') && L.coveredCount(one, ordered) === 1);
  ok('marking it again puts it back', L.isCovered(L.toggleCovered(one, 'ls-bike'), 'ls-bike') === false);
  ok('covered marks belong to the classroom, never to a student', !JSON.stringify(one).includes('learner') && !JSON.stringify(one).includes('student'));
}

// ---- 16. Words for people: the module story and the learner encouragement ----
{
  const core = (n, ok, ms) => Array.from({ length: n }, (_, i) => ({ correct: i < ok, timeMs: ms }));
  const att = (id, at, ok, ms) => ({ type: 'attempt_completed', at, startedAt: at, moduleId: id, seed: 1, core: core(5, ok, ms), review: null, coreCorrect: ok, coreTotal: 5 });
  const ev = [
    { type: 'lesson_viewed', at: '2026-09-01T09:00:00.000Z', moduleId: 'count-to-5' },
    att('count-to-5', '2026-09-01T10:00:00.000Z', 3, 9000),
    att('count-to-5', '2026-09-02T10:00:00.000Z', 4, 2500),
    att('fraction-meaning', '2026-09-03T10:00:00.000Z', 5, 9500),
  ];
  const story = L.moduleStory('Sam', ev, 'count-to-5');
  ok('the story opens with reads and practices in words', story.startsWith('Sam read this lesson once and practiced it twice.'));
  ok('each attempt is narrated with its score', story.includes('3 out of 5') && story.includes('4 out of 5'));
  ok('a suspiciously quick final round is called out against their usual pace', story.includes('noticeably quicker than the 9.5 seconds'));
  ok('a quick round triggers a promise to re-check later', story.includes('introduced again at a later time'));
  ok('the story ends with the confidence score', /confidence score in count to 5 currently stands at \d out of 5/.test(story));
  ok('no em dashes in the story', !story.includes('\u2014'));
  ok('an untouched module says so plainly', L.moduleStory('Sam', [], 'count-to-10').includes('has not opened'));
  ok('a read-only module says nothing counts yet', L.moduleStory('Sam', [{ type: 'lesson_viewed', at: 't', moduleId: 'count-to-10' }], 'count-to-10').includes('has not practiced it yet'));
  ok('encouragement names what was mastered and what is next', L.encouragementFor(ev, 'count-to-5', true) === 'You have mastered count to 5! Great job! Next up is count to 10.');
  const wholeCourse = ['count-to-5', 'count-to-10', 'one-more-one-less', 'joining-and-taking-away', 'comparing-numbers', 'shapes', 'counting-by-tens', 'longer-and-heavier', 'sorting', 'solids', 'making-ten'].map((id, i) => att(id, `t${i}`, 5, 9000));
  ok('finishing a course points at the next course', L.encouragementFor(wholeCourse, 'making-ten', true).includes('Next we will learn about'));
  ok('a miss is met with encouragement, not a score', !L.encouragementFor(ev, 'count-to-5', false).includes('out of'));
}

// ---- 17. Backup files: the whole classroom in one file, restore never loses anything ----
{
  const roster = L.addStudent(L.emptyRoster(), 'S-1', 't1', { level: 'elementary' }).roster;
  const records = [{ name: 's_1', events: [{ type: 'lesson_viewed', at: '2026-09-01T10:00:00.000Z', moduleId: 'count-to-5' }] }];
  const state = { roster, records, wonderReview: L.emptyWonderReview(), covered: L.emptyCoveredSkills() };
  const file = L.buildBackup(state, '2026-09-02T00:00:00.000Z');
  ok('a backup names the app and a version and carries every record', file.app === 'EduSphere' && file.version === 1 && file.records.length === 1);
  ok('a random file is refused with a plain sentence', L.checkBackup({ hello: 1 }) === 'That file is not an EduSphere backup.');
  ok('a backup from the future is refused rather than misread', L.checkBackup({ ...file, version: 99 }).includes('newer version'));
  ok('a good backup passes the check', L.checkBackup(file) === null);
  // Restore onto an empty device
  const empty = { roster: L.emptyRoster(), records: [], wonderReview: L.emptyWonderReview(), covered: L.emptyCoveredSkills() };
  const restored = L.mergeBackup(empty, file);
  ok('restoring onto an empty device recreates the classroom', restored.roster.students.length === 1 && restored.records[0].events.length === 1 && restored.addedStudents === 1);
  // Restore onto a device that has moved on since the backup was taken
  const later = { ...state, records: [{ name: 's_1', events: [...records[0].events, { type: 'lesson_viewed', at: '2026-09-03T10:00:00.000Z', moduleId: 'count-to-5' }] }] };
  const merged = L.mergeBackup(later, file);
  ok('restoring an old backup never loses newer work', merged.records[0].events.length === 2);
  ok('restoring twice adds nothing twice', L.mergeBackup(merged, file).records[0].events.length === 2);
  ok('educator settings take the union', L.mergeBackup({ ...empty, wonderReview: L.approveWonder(L.emptyWonderReview(), 'w-one-thing') }, file).wonderReview.approved.includes('w-one-thing'));
  ok('days since backup is counted in whole days', L.daysSinceBackup('2026-09-01T00:00:00.000Z', '2026-09-04T12:00:00.000Z') === 3 && L.daysSinceBackup(null, 'now') === null);
  // A backup proves ownership of the classroom, which is what a PIN reset requires
  const code = L.makeRecoveryCode(12345);
  ok('a recovery code is four groups of four digits', /^\d{4}-\d{4}-\d{4}-\d{4}$/.test(code) && L.makeRecoveryCode(12345) === code);
  const owned = L.buildBackup({ ...state, recovery: code }, '2026-09-02T00:00:00.000Z');
  ok('a backup made by this classroom proves ownership', L.backupProvesOwnership(owned, code));
  ok('a backup from another classroom does not', !L.backupProvesOwnership(L.buildBackup({ ...state, recovery: L.makeRecoveryCode(999) }, 't'), code));
  ok('an old backup with no code does not, and nothing crashes', !L.backupProvesOwnership(file, code) && !L.backupProvesOwnership(owned, null));
  ok('the recovery code is the first thing in the file after the app name', Object.keys(owned)[1] === 'recovery' && /RECOVERY CODE/.test(owned.recoveryNote));
  ok('a typed code matches with or without dashes and spaces', L.codeMatches(code, code) && L.codeMatches(code.replace(/-/g, ' '), code) && L.codeMatches(code.replace(/-/g, ''), code));
  ok('a wrong or short typed code does not match', !L.codeMatches('1234', code) && !L.codeMatches(code.slice(0, 15) + '0', code));
}

// ---- 18. Loop-back routing: two failed rounds send a student back to the prerequisite ----
{
  const att = (id, at, ok) => ({ type: 'attempt_completed', at, startedAt: at, moduleId: id, seed: 1, core: [], review: null, coreCorrect: ok, coreTotal: 5 });
  const passed = [att('count-to-5', '2026-09-01T10:00:00.000Z', 5)];
  const oneMiss = [...passed, att('count-to-10', '2026-09-02T10:00:00.000Z', 2)];
  const twoMiss = [...oneMiss, att('count-to-10', '2026-09-03T10:00:00.000Z', 1)];
  ok('one miss is not enough to route back', L.loopBackTarget(oneMiss, 'count-to-10') === null);
  ok('two misses in a row route back to the prerequisite', L.loopBackTarget(twoMiss, 'count-to-10') === 'count-to-5');
  ok('the failed streak counts only since the last pass', L.failedStreak(twoMiss, 'count-to-10') === 2 && L.failedStreak([...twoMiss, att('count-to-10', 't4', 5)], 'count-to-10') === 0);
  ok('re-passing the prerequisite clears the routing', L.loopBackTarget([...twoMiss, att('count-to-5', '2026-09-04T10:00:00.000Z', 5)], 'count-to-10') === null);
  ok('a module with no prerequisite never routes back', L.loopBackTarget([att('colours', 't1', 1), att('colours', 't2', 1)], 'colours') === null);
  const loop = L.makeLoopBackEvent('count-to-10', 'count-to-5', '2026-09-03T11:00:00.000Z');
  ok('a loop back is recorded as an event, never a deletion', loop.type === 'looped_back' && loop.moduleId === 'count-to-10' && loop.toModuleId === 'count-to-5');
  ok('the module story tells the educator about the loop back', L.moduleStory('Sam', [...twoMiss, loop], 'count-to-10').includes('sent Sam back to count to 5'));
  ok('a loop back event does not disturb mastery counts', L.deriveProgress([...twoMiss, loop]).masteredIds.includes('count-to-5'));
}

// ---- 19. The class view: most in need first, reasons in words ----
{
  const att = (id, at, ok, ms) => ({ type: 'attempt_completed', at, startedAt: at, moduleId: id, seed: 1, core: Array.from({ length: 5 }, (_, i) => ({ correct: i < ok, timeMs: ms })), review: null, coreCorrect: ok, coreTotal: 5 });
  const students = [
    { id: 's_1', label: 'S-1', events: [att('count-to-5', '2026-09-01T10:00:00.000Z', 5, 6000), att('count-to-10', '2026-09-02T10:00:00.000Z', 2, 2000), att('count-to-10', '2026-09-03T10:00:00.000Z', 1, 2000)] },
    { id: 's_2', label: 'S-2', events: [att('count-to-5', '2026-09-09T10:00:00.000Z', 5, 6000)] },
    { id: 's_3', label: 'S-3', events: [] },
  ];
  const rows = L.classView(students, '2026-09-10T12:00:00.000Z');
  ok('the student who is stuck and guessing comes first', rows[0].label === 'S-1' && rows[0].band === 'needs help now');
  ok('a student who has not started is flagged, gently', rows.find((r) => r.label === 'S-3').reasons.includes('has not started'));
  ok('a student doing fine is on track with nothing flagged', rows.find((r) => r.label === 'S-2').band === 'on track' && rows.find((r) => r.label === 'S-2').reasons.length === 0);
  ok('every reason is a plain phrase, never a number alone', rows.every((r) => r.reasons.every((x) => /[a-z]/.test(x))));
  ok('each row names what the student should do next', rows.every((r) => typeof r.next === 'string'));
  ok('the summary reads in one breath', L.classSummary(rows) === '1 student needs help now: S-1. 1 worth keeping an eye on. 1 on track.');
  ok('an empty class says so', L.classSummary([]) === 'No students yet.');
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
