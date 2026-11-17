// Copyright (c) 2026 iECHO, LLC. All rights reserved.
// -----------------------------------------------------------------------------------------------------------------
// A bank read blind (pass NQ, EARMARKS L26: the lead's blind-read scripts, put in the tree so no chat writes them again).
//
// In plain terms: since pass NJ every new bank is "scored blind, alone and in rounds as built": a child who does not listen, or does
// not understand, must not be right much more often than chance by a habit. Pass NP's lead found its first build of the prediction banks
// right about two times in three for a child who always tapped the same picture, and no one had looked until a person tried it. This
// tool plays the child who guesses by habit, over many questions of a bank, and says how often each habit is right, against chance.
//
// The habits (each is what a child could do without understanding the question; a choice the habit would tap that the question does not
// offer is tapped at random among the choices, which is how a real child would tap):
//   - always the first button;
//   - always the same choice (each choice value in turn; the best is reported and named);
//   - always a picture of one kind (the choice token's kind, the part before a colon or tilde: pic, icon, face, shape, word for a
//     plain word; among the choices of that kind one is tapped at random; the best kind is reported and named);
//   - for a bank whose questions have a story line: a child who heard only the story (taps at random among the choices the story names,
//     all of them when it names none) and a child who heard only the question (for each question, taps the choice most often right for
//     that same prompt across the bank, leaving the question itself out, ties at random), as pass NP's blind block defines them;
//   - for a bank whose questions draw a picture: a child who saw only the picture (the same, by the picture drawn);
//   - for a yes or no bank: the share of its answers that are Yes (a bank near 50 gives a habit nothing);
//   - for an order question (tap the pictures in the story's order): the child who taps from the top left, the first choices in the order
//     shown, against chance of one in the number of ways to order them (1 in 12 for two of four, 1 in 24 for three of four).
// Questions with no choices to tap (typed numbers, tracing) say so and are skipped.
// Mark, and its margin (each group of questions is marked against its own chance and count, and a starred cell is the one over its limit): a row is marked "<<" when a habit beats chance by more than a margin, the margin the rules test holds the pre-K
// banks to since passes NM and NP: two choices at most 6 points over chance (under 56 percent), three at most 9 (under 42), four at most
// 7 (under 32), and the same 6 for five or more, where no test bound exists; never less than three standard errors over chance (so a read
// of 300 seeds is not marked for noise), the standard error being the square root of chance times its opposite over the number of
// questions. Pass NP's own banks read 53.8 percent for two choices and 35.4 for three, as built, inside those bounds. An order question
// is marked at 20 percent, the test's bound. A Yes share is marked outside 40 to 60. A mark on the story only row is expected where the
// answer is in the story by design (pre-K 3's which one was a clue); the reader decides, and the lesson says which banks are so.
// A group of fewer than 30 questions is not read ("-"). A heard-only-the-question read can fall below chance (0 for a group where each prompt
// is asked once and answered the same way, since the question's own answer is left out of the table); only a read above chance is a habit.
//
// Run: node tools/blind-read.mjs <bank id or module id ...> [--seeds 2000] [--rounds] [--rounds-n 1500]
//   a module id reads every bank of the module; --seeds is how many seeds each bank is read alone (generateQuestion at seeds 1 to N);
//   --rounds also reads the bank's questions in the rounds buildAttempt deals for its module, as the rules test does (--rounds-n rounds
//   each of: a first round, a later round that avoids the last two rounds' prompts, a triple dose, and a Quick Review).
// Prints, per bank, a table of habits by group (alone, first, later, dose, review) with the worst of them, the chance, the margin and a
// mark; then one summary line, "N banks read, M marked". Exit code 0 (it reports; the rules test and the reader decide), or 2 for an id that is neither a bank nor a module (named, and
// nothing is read for it).
// --selftest: made banks (not in logic): one whose answer is always its first choice reads 100 percent for the first button; a fair one
// reads near chance on every habit; a story that names its answer and a prompt that fixes it are caught by their rows; and one real
// pre-K bank runs, alone and in rounds.
// -----------------------------------------------------------------------------------------------------------------
import { pathToFileURL, fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

// The kind of a choice token: the part before a colon or tilde (pic:cat is pic, shape:circle~red is shape), word for a plain word.
export const kindOf = (c) => { const m = /^([a-z][a-z0-9-]*)[:~]/i.exec(String(c)); return m ? m[1].toLowerCase() : 'word'; };
// The words a choice token says, for finding it in a story: after the colon, without a tilde variant, hyphens as spaces; a plain word as it is.
const nameOf = (c) => { const x = String(c); const body = /^[a-z][a-z0-9-]*:/i.test(x) ? x.replace(/^[^:]*:/, '') : x; return body.split('~')[0].replace(/-/g, ' ').toLowerCase().trim(); };
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const isTap = (q) => q && Array.isArray(q.choices) && q.choices.length >= 2 && q.type !== 'order' && !q.pick && (typeof q.answer === 'string' || typeof q.answer === 'number');
const isOrder = (q) => q && Array.isArray(q.choices) && q.pick && q.type === 'order';
const same = (a, b) => String(a) === String(b);

// The margin over chance that marks a habit, in points, by chance level (see the header for where each number stands in the rules test).
export function marginFor(chance, n) {
  const base = chance >= 0.45 ? 0.06 : chance >= 0.3 ? 0.09 : chance >= 0.22 ? 0.07 : 0.06;
  const se = Math.sqrt(chance * (1 - chance) / Math.max(1, n));
  return Math.max(base, 3 * se);
}

// A leave-one-out read: for each question, tap the choice most often right for questions with the same key (this question left out),
// ties at random (counted as a share). Pass NP's "question only" read, by any key.
function leaveOneOut(qs, keyOf) {
  const table = new Map();
  for (const q of qs) { const k = keyOf(q); if (!table.has(k)) table.set(k, new Map()); const t = table.get(k); t.set(String(q.answer), (t.get(String(q.answer)) || 0) + 1); }
  let sum = 0;
  for (const q of qs) { const t = table.get(keyOf(q)); const score = (c) => (t.get(String(c)) || 0) - (same(c, q.answer) ? 1 : 0); const best = Math.max(...q.choices.map(score)); const tied = q.choices.filter((c) => score(c) === best); sum += tied.some((c) => same(c, q.answer)) ? 1 / tied.length : 0; }
  return sum / qs.length;
}

// Every habit's share right over one group of tap questions, with the chance, and the name of the best choice or kind.
export function readTaps(qs) {
  const n = qs.length; const chance = qs.reduce((s, q) => s + 1 / q.choices.length, 0) / n;
  const first = qs.filter((q) => same(q.choices[0], q.answer)).length / n;
  const values = [...new Set(qs.flatMap((q) => q.choices.map(String)))];
  let same1 = { share: 0, name: '' };
  for (const w of values) { const s = qs.reduce((t, q) => t + (q.choices.some((c) => same(c, w)) ? (same(q.answer, w) ? 1 : 0) : 1 / q.choices.length), 0) / n; if (s > same1.share) same1 = { share: s, name: w }; }
  const kinds = [...new Set(qs.flatMap((q) => q.choices.map(kindOf)))];
  let kind1 = { share: 0, name: '' };
  for (const k of kinds) { const s = qs.reduce((t, q) => { const of = q.choices.filter((c) => kindOf(c) === k); return t + (of.length ? (of.some((c) => same(c, q.answer)) ? 1 / of.length : 0) : 1 / q.choices.length); }, 0) / n; if (s > kind1.share) kind1 = { share: s, name: k }; }
  const out = { n, chance, first: { share: first }, sameChoice: same1, oneKind: kind1 };
  const storied = qs.filter((q) => typeof q.story === 'string' && q.story);
  if (storied.length === n) {
    out.storyOnly = { share: qs.reduce((t, q) => { const text = q.story.toLowerCase(); const named = q.choices.filter((c) => { const w = nameOf(c); return w && new RegExp('(?<![a-z])' + escape(w) + '(?![a-z])', 'i').test(text); }); const pool = named.length ? named : q.choices; return t + (pool.some((c) => same(c, q.answer)) ? 1 / pool.length : 0); }, 0) / n };
    out.questionOnly = { share: leaveOneOut(qs, (q) => q.prompt) };
  }
  if (qs.every((q) => q.visual)) out.pictureOnly = { share: leaveOneOut(qs, (q) => JSON.stringify(q.visual)) };
  if (qs.every((q) => ['Yes', 'No'].includes(String(q.answer)))) out.yesShare = { share: qs.filter((q) => q.answer === 'Yes').length / n };
  return out;
}

// The order read: the child who taps the first choices in the order shown, against chance of one over the ways to order them.
export function readOrders(qs) {
  const n = qs.length; const top = qs.filter((q) => q.choices.slice(0, q.pick).map(String).join(' | ') === String(q.answer)).length / n;
  const chance = qs.reduce((s, q) => { let ways = 1; for (let i = 0; i < q.pick; i++) ways *= q.choices.length - i; return s + 1 / ways; }, 0) / n;
  return { n, chance, top: { share: top } };
}

const HABITS = [['first', 'always the first button'], ['sameChoice', 'always the same choice'], ['oneKind', 'always a picture of one kind'], ['storyOnly', 'heard only the story'], ['questionOnly', 'heard only the question'], ['pictureOnly', 'saw only the picture']];
const pc = (v) => (v === undefined || v === null ? '-' : (Math.round(v * 1000) / 10).toFixed(1));

// Reads one bank over its groups and returns the table's lines and how many marks it found.
export function readBank(bank, groups, label = bank) {
  const lines = []; let marks = 0;
  const taps = groups.map((g) => ({ name: g.name, qs: g.qs.filter(isTap) })); const orders = groups.map((g) => ({ name: g.name, qs: g.qs.filter(isOrder) }));
  const asked = groups.reduce((s, g) => s + g.qs.length, 0);
  const tapAll = taps.reduce((s, g) => s + g.qs.length, 0); const ordAll = orders.reduce((s, g) => s + g.qs.length, 0);
  if (!asked) return { lines: [`bank ${label}: no questions`], marks: 0 };
  if (!tapAll && !ordAll) return { lines: [`bank ${label}: no choices to tap (${groups[0].qs[0] && groups[0].qs[0].type}); skipped`], marks: 0 };
  const reads = taps.map((g) => (g.qs.length >= 30 ? { name: g.name, ...readTaps(g.qs) } : { name: g.name, n: g.qs.length, skipped: true }));
  const used = reads.filter((r) => !r.skipped);
  if (used.length) {
    // Each group is marked against its own chance and its own count (a read of 150 rounds is noisier than one of 2,000 seeds, and a
    // group's chance can differ, so one margin taken from the smallest group would mark the big groups too late, or too early).
    const limit = (r) => r.chance + marginFor(r.chance, r.n);
    lines.push(`bank ${label}: ${used[0].n} questions alone, chance ${pc(used[0].chance)} percent; marked above, by group: ${used.map((r) => `${r.name} ${pc(limit(r))} (${r.n})`).join(', ')}`);
    const head = ['habit'.padEnd(32), ...reads.map((r) => r.name.padStart(8)), 'worst'.padStart(8)]; lines.push('  ' + head.join(' '));
    for (const [key, text] of HABITS) {
      if (!used.some((r) => r[key])) continue;
      const cells = reads.map((r) => (r.skipped || !r[key] ? undefined : r[key].share)); const worst = Math.max(...cells.filter((v) => v !== undefined));
      const at = reads.findIndex((r, i) => cells[i] === worst); const named = reads[at][key].name ? ` (best: ${reads[at][key].name})` : '';
      // A story or picture row is marked above the same margins; by design it may be high, and the header says so. A cell over its own
      // group's limit is starred, and the row is marked.
      const over = reads.map((r, i) => cells[i] !== undefined && cells[i] > limit(r)); const mark = over.some(Boolean) ? ' <<' : ''; if (mark) marks++;
      lines.push('  ' + [text.padEnd(32), ...cells.map((v, i) => (pc(v) + (over[i] ? '*' : '')).padStart(8)), pc(worst).padStart(8)].join(' ') + mark + named);
    }
    if (used.some((r) => r.yesShare)) { const cells = reads.map((r) => (r.skipped || !r.yesShare ? undefined : r.yesShare.share)); const lo = Math.min(...cells.filter((v) => v !== undefined)); const hi = Math.max(...cells.filter((v) => v !== undefined));
      const mark = lo < 0.4 || hi > 0.6 ? ' <<' : ''; if (mark) marks++; lines.push('  ' + ['Yes share of the answers'.padEnd(32), ...cells.map((v) => pc(v).padStart(8)), (pc(lo) + '-' + pc(hi)).padStart(8)].join(' ') + mark + ' (marked outside 40 to 60)'); }
    if (reads.some((r) => r.skipped)) lines.push('  (a group of fewer than 30 questions is not read: ' + reads.filter((r) => r.skipped).map((r) => `${r.name} ${r.n}`).join(', ') + ')');
  }
  if (ordAll) {
    const reads2 = orders.map((g) => (g.qs.length >= 30 ? { name: g.name, ...readOrders(g.qs) } : null));
    const usedO = reads2.filter(Boolean);
    if (usedO.length) { lines.push(`bank ${label} (tap in order): chance ${pc(usedO[0].chance)} percent, marked at 20.0 percent`);
      const worst = Math.max(...usedO.map((r) => r.top.share)); const mark = worst >= 0.2 ? ' <<' : ''; if (mark) marks++;
      lines.push('  ' + ['tapped from the top left'.padEnd(32), ...reads2.map((r) => (r ? pc(r.top.share) : '-').padStart(8)), pc(worst).padStart(8)].join(' ') + mark); }
  }
  return { lines, marks };
}

// The rounds buildAttempt deals for a module, as the rules test's blind blocks deal them (pass NM and NP): first rounds, later rounds
// that avoid the last two, triple doses, and Quick Reviews; returns, for each group, the rounds' questions.
export function roundsOf(L, moduleId, n) {
  const out = { first: [], later: [], dose: [], review: [] }; let p1 = [], p2 = [];
  for (let s = 1; s <= n; s++) {
    out.first.push(L.buildAttempt(moduleId, s, []).core);
    out.dose.push(L.buildAttempt(moduleId, s + 90000, [], { dose: 3, avoid: [...p1, ...p2] }).core);
    const a = L.buildAttempt(moduleId, s, [], { avoid: [...p1, ...p2] }); out.later.push(a.core); p2 = p1; p1 = a.core.map((q) => q.prompt);
    const lr = L.buildLightReview([], s, { moduleId, stage: 'first', missedKinds: [] }); if (lr) out.review.push(lr.core);
  }
  return out;
}

// Reads the named banks or modules.
export async function blindRead(L, ids, { seeds = 2000, rounds = false, roundsN = 1500 } = {}) {
  const out = []; const unknown = []; let banks = 0; let marks = 0; const cache = new Map();
  for (const id of ids) {
    const mod = L.getModule && L.getModule(id);
    const list = L.GENERATORS[id] ? [[id, null]] : mod ? mod.generators.map((g) => [g, mod.id]) : null;
    if (!list) { out.push(`unknown bank or module id: ${id}`); unknown.push(id); continue; }
    for (const [bank, via] of list) {
      const groups = [{ name: 'alone', qs: Array.from({ length: seeds }, (_, i) => L.generateQuestion(bank, i + 1)) }];
      if (rounds) {
        const homes = via ? [via] : L.COURSES.flatMap((c) => c.modules).filter((m) => (m.generators || []).includes(bank)).map((m) => m.id);
        for (const home of homes.slice(0, 1)) { if (!cache.has(home)) cache.set(home, roundsOf(L, home, roundsN)); const R = cache.get(home);
          for (const k of ['first', 'later', 'dose', 'review']) groups.push({ name: k, qs: R[k].flatMap((r) => r.filter((q) => q.genId === bank)) }); }
      }
      const r = readBank(bank, groups, via ? `${bank} (module ${via})` : bank); banks++; marks += r.marks; out.push(...r.lines, '');
    }
  }
  out.push(`${banks} banks read, ${marks} marked`);
  return { lines: out, banks, marks, unknown };
}

// The made banks the self-test reads (a small seeded random, so the self-test gives the same numbers every run).
function made(kind, n = 2000) {
  let a = 12345; const rnd = () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const POOL = ['pic:cat', 'pic:dog', 'icon:sun', 'icon:rain', 'face:happy', 'face:sad', 'Yes'].slice(0, 6);
  return Array.from({ length: n }, (_, i) => {
    const pickTwo = () => { const x = POOL[Math.floor(rnd() * POOL.length)]; let y = x; while (y === x) y = POOL[Math.floor(rnd() * POOL.length)]; return [x, y]; };
    const [x, y] = pickTwo(); const answer = rnd() < 0.5 ? x : y; const other = answer === x ? y : x;
    const shown = rnd() < 0.5 ? [answer, other] : [other, answer];
    if (kind === 'first') return { type: 'choice', prompt: 'Which one?', story: null, choices: [answer, other], answer };
    if (kind === 'fair') return { type: 'choice', prompt: 'Which one?', story: null, choices: shown, answer };
    if (kind === 'story') return { type: 'choice', prompt: 'Which one?', story: `Listen. The ${nameOf(answer)} was here.`, choices: shown, answer };
    // 'prompt': the prompt itself fixes the answer (each prompt always has the same answer).
    const fixed = POOL[i % POOL.length]; const other2 = POOL[(i + 1) % POOL.length]; const sh = rnd() < 0.5 ? [fixed, other2] : [other2, fixed];
    return { type: 'choice', prompt: `Tap the ${fixed}.`, story: 'Listen.', choices: sh, answer: fixed };
  });
}

async function selfTest() {
  let passed = 0, failed = 0; const ok = (name, cond, info) => { if (cond) { passed++; console.log('PASS - ' + name); } else { failed++; console.log('FAIL - ' + name + (info !== undefined ? '  ' + JSON.stringify(info).slice(0, 600) : '')); } };
  // 1. A bank whose answer is always its first choice reads 100 percent for the first button, and is marked.
  const first = readTaps(made('first')); const rb = readBank('made-first', [{ name: 'alone', qs: made('first') }]);
  ok('a made bank whose answer is always its first choice reads 100 percent for the first button and is marked', first.first.share === 1 && rb.marks >= 1 && rb.lines.some((l) => /always the first button\s+100\.0.*<</.test(l)), rb.lines);
  // 2. A fair made bank reads near chance on every habit and is not marked.
  const fair = readTaps(made('fair')); const rf = readBank('made-fair', [{ name: 'alone', qs: made('fair') }]);
  const near = [fair.first.share, fair.sameChoice.share, fair.oneKind.share, fair.questionOnly ? fair.questionOnly.share : fair.chance].every((v) => Math.abs(v - fair.chance) < 0.05);
  ok(`a fair made bank reads near chance (${pc(fair.chance)}) on the first button (${pc(fair.first.share)}), the same choice (${pc(fair.sameChoice.share)}) and one kind (${pc(fair.oneKind.share)}), and is not marked`, near && rf.marks === 0, { fair, lines: rf.lines });
  // 2b. Each group is marked against its own count: a 2,000-question group at 60 percent on the first button is over its own limit (about
  // 56), though a 40-question group beside it, whose limit is about 74, would hide it under one margin taken from the smallest group.
  const lean = made('first', 2000).map((q, i) => (i % 5 < 3 ? q : { ...q, choices: [q.choices[1], q.choices[0]] })); const tiny = made('fair', 40);
  const rl = readBank('made-lean', [{ name: 'alone', qs: lean }, { name: 'tiny', qs: tiny }]);
  const leanFirst = readTaps(lean).first.share; const shared = marginFor(0.5, 40); const own = marginFor(0.5, 2000);
  ok(`each group is marked against its own count: a bank reading ${pc(leanFirst)} on the first button in 2,000 questions is marked (its limit ${pc(0.5 + own)}), though one margin from a group of 40 (${pc(0.5 + shared)}) would pass it`, leanFirst > 0.5 + own && leanFirst < 0.5 + shared && rl.marks >= 1 && rl.lines.some((l) => /always the first button\s+\d+\.\d\*.*<</.test(l)) && /alone 5[0-9]\.\d \(2000\), tiny 7\d\.\d \(40\)/.test(rl.lines[0]), rl.lines);
  // 3. A story that names its answer is caught by the story only row; a prompt that fixes the answer by the question only row.
  const st = readTaps(made('story')); const rs = readBank('made-story', [{ name: 'alone', qs: made('story') }]);
  ok(`a made story that names its answer reads ${pc(st.storyOnly.share)} for a child who heard only the story, and is marked`, st.storyOnly.share > 0.95 && rs.lines.some((l) => /heard only the story.*<</.test(l)), rs.lines);
  const pr = readTaps(made('prompt')); const rp = readBank('made-prompt', [{ name: 'alone', qs: made('prompt') }]);
  ok(`a made prompt that fixes its answer reads ${pc(pr.questionOnly.share)} for a child who heard only the question, and is marked`, pr.questionOnly.share > 0.95 && rp.lines.some((l) => /heard only the question.*<</.test(l)), rp.lines);
  // 4. A made order bank tapped from the top left reads its chance, and a bank whose order is always the top left is marked.
  const ord = (top) => Array.from({ length: 400 }, (_, i) => { const items = ['icon:a', 'icon:b', 'icon:c', 'icon:d']; const ch = top ? items : [...items.slice(i % 4), ...items.slice(0, i % 4)]; return { type: 'order', pick: 2, prompt: 'Order', choices: ch, answer: top ? ch.slice(0, 2).join(' | ') : ch.slice(2, 4).join(' | '), story: null }; });
  const ro = readOrders(ord(true)); const rt = readBank('made-order-top', [{ name: 'alone', qs: ord(true) }]); const rn = readBank('made-order-fair', [{ name: 'alone', qs: ord(false) }]);
  ok('an order bank whose answer is the top left reads 100 percent and is marked; one that is not reads 0 and is not', ro.top.share === 1 && Math.abs(ro.chance - 1 / 12) < 1e-9 && rt.marks === 1 && rn.marks === 0, { rt: rt.lines, rn: rn.lines });
  // 5. A real pre-K bank runs, alone and in rounds, and reads near its chance on the first button.
  const L = await import(new URL('../src/logic.mjs', import.meta.url).href);
  const real = await blindRead(L, ['p3-next-guess'], { seeds: 600, rounds: true, roundsN: 150 });
  const text = real.lines.join('\n'); const row = /always the first button\s+([\d.]+)/.exec(text);
  ok(`one real pre-K bank (p3-next-guess, 600 seeds, 150 rounds of each kind) is read, alone and in rounds, and its first button is near chance (${row ? row[1] : '?'})`, real.banks === 1 && /alone\s+first\s+later\s+dose\s+review/.test(text) && row && Math.abs(Number(row[1]) - 50) < 8, text);
  console.log(real.lines.map((l) => '  ' + l).join('\n'));
  // 6. A module id reads each of its banks; an unknown id is said.
  const mod = await blindRead(L, ['what-happens-next', 'no-such-bank'], { seeds: 60 });
  ok('a module id reads every bank of the module, and an unknown id is named', mod.banks === L.getModule('what-happens-next').generators.length && mod.lines.some((l) => l.startsWith('unknown bank or module id: no-such-bank')), mod.lines.slice(-3));
  const cli = spawnSync(process.execPath, [fileURLToPath(import.meta.url), 'what-happens-next-typo', '--seeds', '60'], { encoding: 'utf8' }); const good = spawnSync(process.execPath, [fileURLToPath(import.meta.url), 'p3-next-check', '--seeds', '60'], { encoding: 'utf8' });
  ok('an unknown id is named and the command exits 2; a known bank exits 0', mod.unknown.length === 1 && cli.status === 2 && /unknown bank or module id: what-happens-next-typo/.test(cli.stdout) && good.status === 0, { status: cli.status, out: cli.stdout, good: good.status });
  console.log(`\n${passed} passed, ${failed} failed`);
  return failed ? 1 : 0;
}

if (process.argv[1] && process.argv[1].endsWith('blind-read.mjs')) {
  const args = process.argv.slice(2); const opt = (name, dflt) => { const i = args.indexOf(name); return i >= 0 ? Number(args[i + 1]) : dflt; };
  if (args.includes('--selftest')) process.exitCode = await selfTest();
  else {
    const flagValues = new Set(['--seeds', '--rounds-n']); const ids = args.filter((a, i) => !a.startsWith('--') && !flagValues.has(args[i - 1]));
    if (!ids.length) { console.log('usage: node tools/blind-read.mjs <bank id or module id ...> [--seeds 2000] [--rounds] [--rounds-n 1500] | --selftest'); process.exitCode = 2; }
    else { const L = await import(pathToFileURL(process.cwd() + '/src/logic.mjs').href); const r = await blindRead(L, ids, { seeds: opt('--seeds', 2000), rounds: args.includes('--rounds'), roundsN: opt('--rounds-n', 1500) }); console.log(r.lines.join('\n')); process.exitCode = r.unknown.length ? 2 : 0; }
  }
}
