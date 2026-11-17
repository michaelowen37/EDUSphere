// Copyright (c) 2026 iECHO, LLC. All rights reserved.
// -----------------------------------------------------------------------------------------------------------------
// check.sh's step times, kept run after run in docs/CHECK-TIMES.md (pass NQ, EARMARKS L20, Mikey's answer to Q113).
//
// In plain terms: check.sh takes about three hours, and a step that grows a little each pass is not seen until it stops a
// passing run at its time limit (the click-through at 480 seconds in pass KU and at 720 in pass MT). So check.sh times every
// step and, once its verdict line is printed, hands this tool the run's record when CHECK_TIMES_FILE names a file (a pass's own runs
// set it to the tree's docs/CHECK-TIMES.md; a run in Mikey's folder does not, and writes nothing); this tool adds the run there,
// newest first, and prints, step by step, the seconds each run took, the median, and a flag where the newest run grew more than
// a quarter over the runs before it or came past two thirds of its limit (check.sh's slow rule), so a raised limit carries its
// cause. The twelve newest runs stay whole; older ones fold into one table of each step's median seconds, with each folded
// run's seconds kept beside it so the median stays exact as more runs fold in.
//
// Run: node tools/check-times.mjs                      prints the steps' times from docs/CHECK-TIMES.md (exit 0: it reports)
//      node tools/check-times.mjs --file <file>        the same from another copy of the file
//      node tools/check-times.mjs --write <record> [--into <file>]
//                                                      adds the run check.sh recorded in /tmp to docs/CHECK-TIMES.md (or to
//                                                      --into); check.sh's times_write runs it with --into $CHECK_TIMES_FILE,
//                                                      and a run made without it leaves its record in /tmp/edu_times.txt,
//                                                      which this adds by hand the same way.
// The record is check.sh's own: a line "began", a line "step" for each step (its name, seconds, limit, its command's exit code
// where run timed it, whether check.sh failed it, and its summary line), and a line "ended" with the total seconds and the
// verdict, the fields split by tabs. tests/docs-sync.test.mjs runs check.sh's helpers and this writer on a fake run, and
// tests/floor-guard.test.mjs reads the file with parseTimes.
// -----------------------------------------------------------------------------------------------------------------
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// How many runs stay whole, and where the file lives.
export const KEEP_WHOLE = 12;
export const TIMES_FILE = fileURLToPath(new URL('../docs/CHECK-TIMES.md', import.meta.url));

// The file's head, written again with every run, so what it says is always this tool's.
export const HEAD = [
  "# check.sh's step times",
  '',
  "check.sh writes this file at the end of every run a pass makes, after its verdict line, and nobody edits it by hand (pass NQ, EARMARKS L20): a pass's own runs name it in CHECK_TIMES_FILE (CHECK_TIMES_FILE=<the project>/docs/CHECK-TIMES.md ./check.sh), and a run without it, as a run in Mikey's folder is, records nothing here, so his folder stays as the zip left it and another machine's times never mix with the pass machine's in the medians. Each run is a short dated table, newest first: when the run began and ended, its verdict and its minutes in all, then one row for each step, with the step's name as check.sh echoes it, its seconds, its time limit where it runs under one (check.sh's run), the share of that limit it used, its status (passed, failed, or stopped at its limit, with its command's exit code where that was not 0) and its summary line, the line its verdict reads. The twelve newest runs are kept whole; older runs are folded into one table at the end, each step's median seconds over the runs folded, with every folded run's seconds kept beside it so the median stays exact as more runs fold in, and the file stays small.",
  '',
  "tools/check-times.mjs reads it and prints, step by step, its seconds over the runs recorded, its median, and a flag where the newest run is more than a quarter over the median of the runs before it or past two thirds of its limit (check.sh's slow rule), so a step's growth is seen and a raised limit carries its cause. tests/floor-guard.test.mjs reads the newest run's limits and each step's count of checks from its newest passing run. Nothing is written here while the steps run, since a step reads the tree (pass MT's third run failed when a doc changed mid-run); a run on a frozen copy of the project writes into the file CHECK_TIMES_FILE names, the project's when the lead sets it so.",
  '',
  "A step whose seconds say not recorded was not measured: the oldest run, pass NP's final run, was written here in pass NQ from its DECISIONS entry, with the counts that entry lists and the limits check.sh had then.",
].join('\n');

// A table cell holds no bar of its own: a bar inside a name or a summary line is written as \| and read back.
const cell = (v) => String(v === null || v === undefined ? '' : v).replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();
const cellsOf = (row) => row.replace(/^\|/, '').replace(/\|\s*$/, '').split(/(?<!\\)\|/).map((c) => c.trim().replace(/\\\|/g, '|'));

// The middle of a list of seconds (the mean of the two middle ones, to a whole second, when the count is even).
export function median(xs) {
  const s = xs.filter((x) => Number.isFinite(x)).sort((a, b) => a - b); if (!s.length) return null;
  const m = Math.floor(s.length / 2); return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
}

// A step's count of checks from its summary line: the number before "passed" ("3243 passed, 0 failed", "3,243 passed, as
// DECISIONS gives it"), or the layout sweep's games ("160 games at 1 sizes ...: 0 problems"); null for a line with no count.
export function countOf(summary) {
  const s = String(summary || '').replace(/\d{1,3}(?:,\d{3})+\b/g, (m) => m.replace(/,/g, ''));
  const passed = /(\d+) passed\b/.exec(s); if (passed) return Number(passed[1]);
  const games = /^(\d+) games\b/.exec(s); if (games) return Number(games[1]);
  return null;
}

// A step's status in words, from its command's exit code (run's, where it ran under a limit) and check.sh's own verdict on it.
export function statusOf(code, failedByCheck) {
  const c = String(code || '').trim(); const other = c && c !== '0' && c !== '124' ? `, exit code ${c}` : '';
  if (c === '124') return 'stopped at its limit';
  return (failedByCheck ? 'failed' : 'passed') + other;
}

// check.sh's record of one run (its tab-split lines) as a run: when it began and ended, its verdict, its minutes, its steps.
export function readRecord(text) {
  const run = { began: '', ended: '', minutes: null, about: false, verdict: '', note: '', steps: [] };
  for (const line of String(text).split('\n')) {
    const f = line.split('\t');
    if (f[0] === 'began') run.began = f[2] || '';
    else if (f[0] === 'step' && f.length >= 7) {
      const seconds = Number(f[2]); const limit = f[3] === '' ? null : Number(f[3]);
      run.steps.push({ name: f[1], seconds: Number.isFinite(seconds) ? seconds : null, limit: Number.isFinite(limit) ? limit : null, status: statusOf(f[4], f[5] === '1'), summary: f.slice(6).join(' ') });
    } else if (f[0] === 'ended') { run.ended = f[2] || ''; const total = Number(f[3]); run.minutes = Number.isFinite(total) ? Math.round(total / 60) : null; run.verdict = f.slice(4).join(' ').trim(); }
  }
  if (!run.began || !run.ended || !run.verdict) throw new Error('the record has no began line, ended line or verdict: check.sh writes all three');
  return run;
}

// docs/CHECK-TIMES.md as runs (newest first) and the folded table. A file whose run headings the parser cannot all read is an
// error, never a smaller file: the writer would otherwise write the runs it could read and lose the rest.
export function parseTimes(text) {
  const doc = { runs: [], folded: { runs: 0, from: '', to: '', steps: [] } };
  const parts = String(text || '').split(/\n(?=## )/);
  for (const part of parts) {
    const lines = part.split('\n');
    if (lines[0].startsWith('## Run of ')) {
      const info = lines.find((l) => l.startsWith('Began ')) || '';
      const m = /^Began (.+?) and ended (.+?), (about )?(\d+) minutes? in all\. Verdict: (.+?)\.(?: (.*))?$/.exec(info);
      if (!m) throw new Error(`a run's line is not as this tool writes it: ${lines[0]}`);
      const run = { began: m[1], ended: m[2], minutes: Number(m[4]), about: !!m[3], verdict: m[5], note: m[6] || '', steps: [] };
      for (const row of lines.filter((l) => l.startsWith('| ') && !l.startsWith('| Step |'))) {
        const [name, seconds, limit, , status, summary] = cellsOf(row);
        run.steps.push({ name, seconds: /^\d+$/.test(seconds) ? Number(seconds) : null, limit: /^\d+$/.test(limit) ? Number(limit) : null, status, summary });
      }
      doc.runs.push(run);
    } else if (lines[0].startsWith('## Older runs, folded')) {
      const info = lines.find((l) => /^\d+ runs? folded/.test(l)) || '';
      const m = /^(\d+) runs? folded, which began from (.+?) to (.+?);/.exec(info);
      if (!m) throw new Error('the folded table\'s line is not as this tool writes it');
      doc.folded.runs = Number(m[1]); doc.folded.from = m[2]; doc.folded.to = m[3];
      for (const row of lines.filter((l) => l.startsWith('| ') && !l.startsWith('| Step |'))) {
        const [name, , , seconds] = cellsOf(row);
        doc.folded.steps.push({ name, seconds: seconds ? seconds.split(',').map((x) => Number(x.trim())).filter(Number.isFinite) : [] });
      }
    }
  }
  const headings = (String(text || '').match(/^## Run of /gm) || []).length;
  if (headings !== doc.runs.length) throw new Error(`the file has ${headings} run headings and ${doc.runs.length} were read`);
  return doc;
}

// The file from the runs and the folded table: the head, each whole run newest first, then the folded table when any run folded.
export function renderTimes(doc) {
  const out = [HEAD, ''];
  for (const run of doc.runs) {
    out.push(`## Run of ${run.began}`, '');
    out.push(`Began ${run.began} and ended ${run.ended}, ${run.about ? 'about ' : ''}${run.minutes} minute${run.minutes === 1 ? '' : 's'} in all. Verdict: ${run.verdict}.${run.note ? ' ' + run.note : ''}`, '');
    out.push('| Step | Seconds | Limit | Share of limit | Status | Summary line |', '|---|---|---|---|---|---|');
    for (const s of run.steps) {
      const share = s.seconds !== null && s.limit ? `${Math.round((100 * s.seconds) / s.limit)}%` : '';
      out.push(`| ${cell(s.name)} | ${s.seconds === null ? 'not recorded' : s.seconds} | ${s.limit === null ? '' : s.limit} | ${share} | ${cell(s.status)} | ${cell(s.summary) || 'no summary line'} |`);
    }
    out.push('');
  }
  if (doc.folded.runs) {
    const f = doc.folded;
    out.push('## Older runs, folded', '');
    out.push(`${f.runs} run${f.runs === 1 ? '' : 's'} folded, which began from ${f.from} to ${f.to}; each step's median seconds over the folded runs that timed it, and those seconds, oldest first, so the median stays exact as more runs fold in (the ${KEEP_WHOLE} newest runs are above, whole).`, '');
    out.push('| Step | Runs | Median seconds | Seconds, oldest first |', '|---|---|---|---|');
    for (const s of f.steps) out.push(`| ${cell(s.name)} | ${s.seconds.length} | ${s.seconds.length ? median(s.seconds) : ''} | ${s.seconds.join(', ')} |`);
    out.push('');
  }
  return out.join('\n');
}

// A new run joins at the top; past the twelve newest, the oldest whole run folds into the table, its measured seconds appended
// to each step's list (a step new to the table gets a row at its end). Folded runs are always older than whole ones, so each
// list stays oldest first.
export function addRun(doc, run) {
  const next = { runs: [run, ...doc.runs], folded: { ...doc.folded, steps: doc.folded.steps.map((s) => ({ name: s.name, seconds: [...s.seconds] })) } };
  while (next.runs.length > KEEP_WHOLE) {
    const old = next.runs.pop(); const f = next.folded;
    f.runs += 1; if (!f.from) f.from = old.began; f.to = old.began;
    for (const s of old.steps) {
      let row = f.steps.find((x) => x.name === s.name); if (!row) { row = { name: s.name, seconds: [] }; f.steps.push(row); }
      if (s.seconds !== null) row.seconds.push(s.seconds);
    }
  }
  return next;
}

// Each step's seconds over the runs recorded, its median, and its flags: growing, where the newest run is more than a quarter
// over the median of every run before it (whole and folded); near its limit, where the newest run used more than two thirds of
// its limit, check.sh's slow rule (3 x seconds > 2 x limit).
export function analyze(doc) {
  const newest = doc.runs[0]; const names = [];
  for (const run of doc.runs) for (const s of run.steps) if (!names.includes(s.name)) names.push(s.name);
  for (const s of doc.folded.steps) if (!names.includes(s.name)) names.push(s.name);
  return names.map((name) => {
    const whole = doc.runs.map((r) => { const s = r.steps.find((x) => x.name === name); return s ? s.seconds : null; });
    const folded = (doc.folded.steps.find((x) => x.name === name) || { seconds: [] }).seconds;
    const now = newest ? (newest.steps.find((x) => x.name === name) || {}) : {};
    const latest = now.seconds === undefined ? null : now.seconds; const limit = now.limit === undefined ? null : now.limit;
    const before = [...whole.slice(1).filter((x) => x !== null), ...folded]; const mid = median(before); const all = median([...whole.filter((x) => x !== null), ...folded]);
    const flags = [];
    if (latest !== null && mid !== null && latest * 4 > mid * 5) flags.push(`growing: ${latest} seconds, more than a quarter over the median of the runs before it (${mid})`);
    if (latest !== null && limit && latest * 3 > limit * 2) flags.push(`near its limit: ${latest} of its ${limit} seconds, past two thirds`);
    return { name, whole, folded, latest, limit, medianBefore: mid, median: all, flags };
  });
}

// The analysis as a table to read or paste.
export function report(doc, file) {
  const rows = analyze(doc); const newest = doc.runs[0];
  const out = [`check.sh's step times, ${file}: ${doc.runs.length} run${doc.runs.length === 1 ? '' : 's'} whole, ${doc.folded.runs} folded${newest ? `; the newest began ${newest.began} (${newest.verdict}, ${newest.about ? 'about ' : ''}${newest.minutes} minutes)` : ''}.`, ''];
  if (!rows.length) return out.concat('No run is recorded yet.').join('\n');
  out.push('| Step | Newest | Median before it | Median of all | Seconds, newest first | Limit | Flag |', '|---|---|---|---|---|---|---|');
  for (const r of rows) {
    const series = r.whole.map((x) => (x === null ? '-' : String(x))).join(', ') + (r.folded.length ? `; folded: ${r.folded.length} runs, median ${median(r.folded)}` : '');
    out.push(`| ${cell(r.name)} | ${r.latest === null ? '-' : r.latest} | ${r.medianBefore === null ? '-' : r.medianBefore} | ${r.median === null ? '-' : r.median} | ${series} | ${r.limit === null ? '' : r.limit} | ${r.flags.join('; ')} |`);
  }
  const flagged = rows.filter((r) => r.flags.length);
  out.push('', flagged.length ? `${flagged.length} step${flagged.length === 1 ? '' : 's'} flagged: read each one's cause before its limit is raised, and name the cause beside the limit in check.sh.` : 'No step flagged.');
  return out.join('\n');
}

// Run alone: print the analysis, or, with --write, add the record check.sh made to the file. The writer runs only when this is
// the file being run and its flag is given, inside this block (CLAUDE-PART-2's rule for a tool another tool may import).
if (process.argv[1] && process.argv[1].endsWith('check-times.mjs')) {
  const args = process.argv.slice(2); const option = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };
  if (process.argv.includes('--write')) {
    const into = option('--into') || TIMES_FILE; const record = option('--write');
    try {
      const doc = existsSync(into) ? parseTimes(readFileSync(into, 'utf8')) : { runs: [], folded: { runs: 0, from: '', to: '', steps: [] } };
      const run = readRecord(readFileSync(record, 'utf8')); const next = addRun(doc, run);
      writeFileSync(into, renderTimes(next));
      console.log(`added the run that began ${run.began} (${run.verdict}) to ${into}: ${next.runs.length} whole, ${next.folded.runs} folded`);
    } catch (e) { console.log(`not written: ${e.message}`); process.exitCode = 1; }
  } else {
    const file = option('--file') || TIMES_FILE;
    if (!existsSync(file)) { console.log(`${file} does not exist yet: check.sh writes it at the end of its first run`); } else console.log(report(parseTimes(readFileSync(file, 'utf8')), file));
  }
}
