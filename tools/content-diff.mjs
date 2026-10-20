// Copyright (c) 2026 iECHO, LLC. All rights reserved.
// -----------------------------------------------------------------------------------------------------------------
// Everything a child meets that changed between an earlier copy of the project and this one, course by course (pass MM).
//
// In plain terms: a pass means to change some courses and leave the rest alone, and a script that edits one course can
// touch another without anyone noticing (pass MH's four-voices script dropped forty Wonder questions' long voices, and
// only a full comparison caught it). The paper Mikey shared in pass MM makes the same point about checking: an independent
// evaluator checks the complete final state, not only the part that was meant to change. So this tool builds every course's
// review packet (tools/course-packet.mjs: each lesson, spoken script, every distinct question with its answer, explanation
// and More Info, each story with its pictures and audio, the long stories, the Wonder questions, the games and the ledger
// rows) twice, from the earlier copy and from this one, with the same packet code, and reports every course whose packet
// differs, with its changed lines. Courses named with --scope are the ones the pass meant to change; any other course
// that changed is listed first, under "Outside the pass's scope", so the final read can confirm each was meant.
//
// Since pass MM's verification report it also compares every keyed item (tools/content-snapshot.mjs): a packet reads at most 24
// questions of a kind from seeds 1 to 400 and leaves out about half the More Info sentences and explanations, the Wonder
// questions that name no course, the game decks, plan rows and course goals, so a wrong answer first made at seed 890 never showed.
// Both copies are snapshotted item by item and compared as sets of keys, and every item added, removed or changed is listed after
// the packets, outside the scope first, then the items that belong to no course, then the scope's own.
//
// Run: node tools/content-diff.mjs <earlier project folder> [--scope course-id,course-id] [--lines N] > report.md
// Every section is whole unless --lines caps it (round five, pass MM: at the old 400 lines a course, 740 and 210 identical printed
// lines filled two courses' sections, hiding the second's 32 changed wrong taps).
// (for example: node tools/content-diff.mjs /home/claude/base-ml --scope first-sounds-pk). Needs the diff program, which
// macOS and Linux both have. Exit code 0 always: it reports; the final read decides.
// -----------------------------------------------------------------------------------------------------------------
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const option = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };
const earlier = args.find((a) => !a.startsWith('--') && a !== option('--scope') && a !== option('--lines'));
if (process.argv[1] && process.argv[1].endsWith('content-diff.mjs')) {
  if (!earlier || !existsSync(join(earlier, 'src/logic.mjs'))) {
    console.log('usage: node tools/content-diff.mjs <earlier project folder> [--scope id,id] [--lines N]');
    process.exitCode = 1;
  } else {
    const scope = new Set((option('--scope') || '').split(',').filter(Boolean));
    const cap = Number(option('--lines') || Infinity);
    const here = resolve(fileURLToPath(new URL('..', import.meta.url)));
    const work = mkdtempSync(join(tmpdir(), 'content-diff-'));
    // The same packet code builds both sides, so a change in the packet tool itself never shows up as a change in content.
    const build = (root, out) => execFileSync(process.execPath, [join(here, 'tools/course-packet.mjs'), '--all', '--full', '--root', root, '--out', out], { stdio: ['ignore', 'ignore', 'inherit'], maxBuffer: 1 << 28 });
    build(resolve(earlier), join(work, 'before'));
    build(here, join(work, 'now'));
    const ids = [...new Set([...readdirSync(join(work, 'before')), ...readdirSync(join(work, 'now'))])].map((f) => f.replace(/\.md$/, '')).sort();
    const rows = [];
    for (const id of ids) {
      const a = join(work, 'before', `${id}.md`); const b = join(work, 'now', `${id}.md`);
      if (!existsSync(a)) { rows.push({ id, note: 'new course', diff: readFileSync(b, 'utf8'), removed: 0, added: readFileSync(b, 'utf8').split('\n').length }); continue; }
      if (!existsSync(b)) { rows.push({ id, note: 'course removed', diff: '', removed: readFileSync(a, 'utf8').split('\n').length, added: 0 }); continue; }
      if (readFileSync(a, 'utf8') === readFileSync(b, 'utf8')) continue;
      // diff exits with 1 when the files differ, which execFileSync reports as an error carrying the output.
      let text = ''; try { text = execFileSync('diff', ['-U0', a, b], { maxBuffer: 1 << 28 }).toString(); } catch (e) { text = String(e.stdout || ''); }
      const body = text.split('\n').filter((l) => !l.startsWith('---') && !l.startsWith('+++'));
      rows.push({ id, note: '', diff: body.join('\n'), removed: body.filter((l) => l.startsWith('-')).length, added: body.filter((l) => l.startsWith('+')).length });
    }
    const outside = rows.filter((r) => scope.size && !scope.has(r.id));
    const out = [];
    out.push(`# Content changes since ${earlier}`);
    out.push('');
    out.push(`${rows.length} of ${ids.length} courses changed${scope.size ? `; the pass's scope: ${[...scope].join(', ')}` : ''}.`);
    out.push('');
    out.push('| Course | Lines removed | Lines added | Note |');
    out.push('|---|---|---|---|');
    for (const r of rows) out.push(`| ${r.id} | ${r.removed} | ${r.added} | ${r.note || (scope.size && !scope.has(r.id) ? 'outside the scope' : '')} |`);
    out.push('');
    if (scope.size) {
      out.push(`## Outside the pass's scope (${outside.length})`);
      out.push('');
      out.push(outside.length ? 'Each of these courses changed although the pass did not name it. Confirm each change was meant (a shared kind, a shared picture row, a fix a check asked for), or undo it.' : 'Nothing outside the scope changed.');
      out.push('');
    }
    // Courses outside the scope first, since they are the ones to question.
    for (const r of [...outside, ...rows.filter((x) => !outside.includes(x))]) {
      // A changed line repeated across a course (one printed line on 740 questions) is shown once with its count, and a hunk left
      // with nothing under it is dropped, so one bank cannot push the rest of a course past the cap (round four, pass MM).
      const raw = r.diff.split('\n'); const times = new Map();
      for (const l of raw) if (/^[+-]/.test(l)) times.set(l, (times.get(l) || 0) + 1);
      const shown = new Set(); const kept = [];
      for (const l of raw) { const n = times.get(l) || 0; if (n > 2) { if (shown.has(l)) continue; shown.add(l); kept.push(`${l}   [this line ${n} times in the course]`); } else kept.push(l); }
      const lines = kept.filter((l, i) => !(l.startsWith('@@') && (i + 1 >= kept.length || kept[i + 1].startsWith('@@') || !kept[i + 1].trim())));
      out.push(`## ${r.id}${r.note ? ` (${r.note})` : ''}`);
      out.push('');
      out.push('```diff');
      for (const l of lines.slice(0, cap)) out.push(l);   // one at a time, since a whole section can outgrow a spread's limit
      if (lines.length > cap) out.push(`... ${lines.length - cap} more lines (--lines raises the limit)`);
      out.push('```');
      out.push('');
    }
    // Every keyed item (pass MM): both copies snapshotted by the same code, compared as sets of keys.
    const snap = (root, file) => execFileSync(process.execPath, [join(here, 'tools/content-snapshot.mjs'), '--root', root, '--out', file], { stdio: ['ignore', 'ignore', 'inherit'], maxBuffer: 1 << 28 });
    snap(resolve(earlier), join(work, 'before.json')); snap(here, join(work, 'now.json'));
    const A = JSON.parse(readFileSync(join(work, 'before.json'), 'utf8')); const B = JSON.parse(readFileSync(join(work, 'now.json'), 'utf8'));
    const all = [...new Set([...Object.keys(A.items), ...Object.keys(B.items)])].sort();
    const moved = all.filter((k) => A.items[k] !== B.items[k]).map((k) => ({ k, how: !(k in A.items) ? 'added' : !(k in B.items) ? 'removed' : 'changed', courses: (B.scope[k] || A.scope[k] || '').split(',').filter(Boolean) }));
    // Where a value changed, the part that differs, with a little of what surrounds it.
    const brief = (a = '', b = '') => { let i = 0; while (i < a.length && i < b.length && a[i] === b[i]) i += 1; let j = 0; while (j < a.length - i && j < b.length - i && a[a.length - 1 - j] === b[b.length - 1 - j]) j += 1;
      const cut = (s) => (s.length > 360 ? `${s.slice(0, 360)} ...` : s); const from = Math.max(0, i - 80);
      return [`- ${cut(a.slice(from, a.length - j + 40))}`, `+ ${cut(b.slice(from, b.length - j + 40))}`]; };
    const area = (k) => (k.startsWith('question:') ? k.split(':').slice(0, 2).join(':') : k.split(':')[0]);
    const groups = { outside: [], shared: [], scope: [] };
    // An item that belongs to a course outside the scope is filed outside, even when it belongs to one inside too (round two's code
    // check, pass MM: a bank shared with an outside course hid among the scope's items), so the final read confirms it was meant.
    for (const m of moved) groups[!m.courses.length ? 'shared' : scope.size && m.courses.some((c) => !scope.has(c)) ? 'outside' : 'scope'].push(m);
    out.push(`## Every keyed item (${moved.length} of ${all.length} changed: ${moved.filter((m) => m.how === 'added').length} added, ${moved.filter((m) => m.how === 'removed').length} removed, ${moved.filter((m) => m.how === 'changed').length} changed)`);
    out.push('');
    out.push('Every exported list and table item by item, every distinct question of every bank with all its renderings (each bank read until its seeds make nothing new, to 6,400 seeds, or to 102,400 for a bank of fewer than 1,000 questions; its printed words; and where the answers of each bank sit), the art and audio ledger rows, the review marks and a fingerprint of each source file, from tools/content-snapshot.mjs on both copies.');
    out.push('');
    const titles = { outside: "Keyed items outside the pass's scope", shared: 'Keyed items that belong to no course (shared data, Wonder questions for no course, the code)', scope: "Keyed items in the pass's scope" };
    for (const g of ['outside', 'shared', 'scope']) {
      const list = groups[g]; if (!scope.size && g === 'outside') continue;
      out.push(`### ${titles[g]} (${list.length})`);
      out.push('');
      const byArea = new Map(); for (const m of list) { const a = area(m.k); if (!byArea.has(a)) byArea.set(a, []); byArea.get(a).push(m); }
      if (byArea.size) { out.push('| Area | Added | Removed | Changed | Courses |'); out.push('|---|---|---|---|---|');
        for (const [a, ms] of byArea) out.push(`| ${a} | ${ms.filter((m) => m.how === 'added').length} | ${ms.filter((m) => m.how === 'removed').length} | ${ms.filter((m) => m.how === 'changed').length} | ${[...new Set(ms.flatMap((m) => m.courses))].join(', ')} |`);
        out.push(''); }
      const lines = [];
      for (const m of list) { lines.push(`${m.how.toUpperCase()} ${m.k.length > 220 ? `${m.k.slice(0, 220)} ...` : m.k}`); if (m.how === 'changed') lines.push(...brief(A.items[m.k], B.items[m.k])); else if (!m.k.startsWith('question:')) lines.push(`${m.how === 'added' ? '+' : '-'} ${String((m.how === 'added' ? B : A).items[m.k]).slice(0, 360)}`); }
      if (lines.length) { out.push('```diff'); for (const l of lines.slice(0, cap)) out.push(l); if (lines.length > cap) out.push(`... ${lines.length - cap} more lines (--lines raises the limit)`); out.push('```'); out.push(''); }
    }
    writeFileSync(join(work, 'report.md'), out.join('\n'));
    console.log(out.join('\n'));
  }
}
