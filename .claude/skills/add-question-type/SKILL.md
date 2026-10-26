---
name: add-question-type
description: Add a new practice question type (generator) to EduSphere, with its independent test. Use whenever a module needs more variety.
---
# Add a question type

Every generator is a function `(rng) => question` that uses only the seeded
random helpers, so the same seed always makes the same question. Copy this
template into `GENERATORS` in `src/logic.mjs` (or into `makeCountingGenerators`
for the counting course) and fill in the blanks:

```js
'm2-example': (rng) => {
  const { n: a, d: b } = pickSimpleFraction(rng);   // or randInt(rng, min, max)
  const k = randInt(rng, 2, 4);
  const correct = frac(a * k, b * k);
  return {
    type: 'choice',                                  // or 'number' (learner types a whole number)
    story: null,                                     // one short setup line, or null
    prompt: `Which fraction equals ${a}/${b}?`,      // one sentence in natural words (CLAUDE.md rule 8: no length limit, a 400-character guard)
    choices: buildFractionChoices(rng, correct, [frac(a + k, b + k), frac(a, b * k)]),  // null for type 'number'
    answer: fracText(correct),                       // a string; for 'number', String(wholeNumber)
    explain: `Multiply top and bottom by ${k}.`,     // computed from the numbers, never typed as a fact
    visual: null,                                    // { parts, shaded } or { kind: 'dots', count } or null
    explainVisual: [{ parts: b, shaded: a, label: `${a}/${b}` }],  // labeled bars, or null
  };
},
```

Steps:
1. Add the generator with a new id (`m1-`, `m2-`, `m3-` for the fraction modules; `k5-`/`k10-` via the counting factory).
2. Add the id to the module's `generators` list.
3. Add an independent check in `tests/logic.test.mjs`, section 1, next to the others. It must recompute the answer from the question text or numbers WITHOUT using the generator's own answer, e.g.
   `if (genId === 'm2-example') { const [a, b] = nums[0].split('/').map(Number); if (!L.fracEqual(L.frac(a, b), parse(q.answer))) problems.push('example: answer not equivalent'); }`
4. Run `./check.sh`. The 300-seed loop will now cover the new type. It must end with `ALL CHECKS PASSED`.
5. Rules to keep: choices contain the answer exactly once; no two choices are the same amount; prompt is one sentence; nothing in `explain` is a fact you typed — it is built from the numbers.

For a pre-reader (a course with readAloud), an answer is tapped, never typed (pass MO):
- type 'choice' with picture tokens (`icon:cup`, `pic:fox`, `item:square-blue`, `face:happy`, `dots:4`; `describeChoice` names each one), with `whyNot` (each wrong choice's reason) and `alsoRight` (More right answers: another right answer to the question as asked, or a true example of the same idea in the lesson's words, never advice; an empty list when there is none);
- type 'trace' (a letter or a line, `TRACE_LETTERS`);
- a direction, type 'order' with `pick` (made by `stepsQuestion`: tap the pictures in the order the words say).
Every name and word a question asks is said in its own lesson's spoken script first (askedNames, DIRECTION_WORDS), and a question that combines two ideas shows all four corners. docs/RULES-AUDIT.md section 6 holds these rows (Follow the directions, all four corners, More right answers, a picture answer's name for a screen reader); read them before you add a pre-reader kind, and add its re-derivation to `tests/logic.test.mjs`.
