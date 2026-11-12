// The Wise Human. Copyright (c) 2026. Source-available; not for reuse. See LICENSE.md.
// How much each model did in a pass (pass NG). Mikey: "We just want to use each model for it's strengths (where it makes the most
// sense) with the idea of efficiency, accuracy and prestige in mind." and "I'm on the Ultra plan and Fable can be used for half of the
// weekly usage so maybe we can structure it so the usage lands right around 50% and have a plan for when it runs out before Opus."
//
// In plain terms: Claude Code keeps a log of every reply in a session, the lead's and every agent's, each with the model that wrote
// it and the tokens it read and wrote. This tool reads those logs, counts each reply once (a reply's lines share its message id and
// repeat its usage), totals each model's tokens, and prices them at Anthropic's published API rates. On a plan, Fable "use[s] them
// [the weekly limits] faster than other Claude models" (Anthropic's help article on Fable models on a plan), and how much faster is
// not published, so the dollars here are an estimate of each model's share of a week's usage, priced the way the API bills; the
// plan's own meter, Settings > Usage, is the true number. Each pass's DECISIONS entry gives Fable's share as this tool reads it, and
// the model map moves a read between Fable and Opus as the share calls for (RULES-AUDIT section 9's row on which model a task runs on).
//
// Since round one's code read (pass NG): a reply is counted once across every log read, not once in each (a log that repeats another's
// replies would have counted them twice); a model the table has no price for prints "no price" and stays out of the shares, where its
// tokens priced at nothing skewed them; and Haiku 5.5 is priced by each reply's prompt, at its higher rates over 100,000 tokens, as the
// pricing page sets them (a prompt counting its input, cache reads and cache writes).
// Run: node tools/usage-by-model.mjs [a log file or folder ...]      (no argument: every log under ~/.claude/projects)
//      add --by-file to list each log (the lead's and each agent's) on its own line as well.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path'; import { homedir } from 'node:os';

// Anthropic's API prices in dollars per million tokens (platform.claude.com/docs/en/about-claude/pricing, read November 11, 2026):
// base input, a cache write kept 5 minutes, one kept an hour, a cache read, and output. A model's id is matched by its start. Haiku 5.5
// alone is priced by prompt length: "a request whose prompt is over 100,000 tokens pays higher prices", its prompt counting "all of its
// input tokens, including cache reads and cache writes" (long, below); the others are priced alike at every length.
export const PRICES = [
  { model: 'claude-fable-5-2', name: 'Fable 5.2', input: 8, write5m: 10, write1h: 16, read: 0.2, output: 40 },
  { model: 'claude-opus-5-5', name: 'Opus 5.5', input: 4, write5m: 5, write1h: 8, read: 0.2, output: 20 },
  { model: 'claude-sonnet-5-5', name: 'Sonnet 5.5', input: 2, write5m: 2.5, write1h: 4, read: 0.1, output: 10 },
  { model: 'claude-haiku-5-5', name: 'Haiku 5.5', input: 0.1, write5m: 0.125, write1h: 0.2, read: 0.01, output: 0.5,
    long: { over: 100000, input: 0.5, write5m: 0.625, write1h: 1, read: 0.05, output: 2.5 } },
];
export const priceOf = (model) => PRICES.find((p) => String(model || '').startsWith(p.model)) || null;

// Every reply in some log lines, counted once by its message id, totalled by model, each reply priced on its own (its prompt decides
// Haiku's rates). A reply with no id is counted on its own line. seen, shared across logs, holds the ids already counted, so a reply
// two logs repeat counts once. A model with no price keeps its tokens and has dollars null.
export function usageByModel(lines, seen = new Set()) {
  const replies = new Map(); let n = 0;
  for (const line of lines) {
    let d; try { d = JSON.parse(line); } catch (e) { continue; }
    const m = d && d.type === 'assistant' && d.message; const u = m && m.usage; if (!u) continue;
    replies.set(m.id || `line-${n++}`, { model: m.model || 'unknown', u, id: m.id || null });
  }
  const out = {};
  for (const { model, u, id } of replies.values()) {
    if (id) { if (seen.has(id)) continue; seen.add(id); }
    const t = out[model] || (out[model] = { replies: 0, input: 0, write5m: 0, write1h: 0, read: 0, output: 0, dollars: 0 });
    const writes = u.cache_creation || {}; const w1h = Number(writes.ephemeral_1h_input_tokens || 0); const w5m = Number(writes.ephemeral_5m_input_tokens || 0);
    const allWrites = Number(u.cache_creation_input_tokens || 0); const input = Number(u.input_tokens || 0); const read = Number(u.cache_read_input_tokens || 0); const output = Number(u.output_tokens || 0);
    const five = w5m + Math.max(0, allWrites - w1h - w5m);   // a write with no breakdown is priced as the cheaper kind
    t.replies += 1; t.input += input; t.read += read; t.output += output; t.write1h += w1h; t.write5m += five;
    const p = priceOf(model); if (!p) { t.dollars = null; continue; }
    const rate = p.long && input + read + w1h + five > p.long.over ? p.long : p;
    if (t.dollars !== null) t.dollars += (input * rate.input + five * rate.write5m + w1h * rate.write1h + read * rate.read + output * rate.output) / 1e6;
  }
  return out;
}

// Every .jsonl log under a folder, its own and its agents' (Claude Code keeps an agent's log in subagents/ beside the session's).
export function logsUnder(path) {
  if (!existsSync(path)) return [];
  if (statSync(path).isFile()) return path.endsWith('.jsonl') ? [path] : [];
  return readdirSync(path).flatMap((f) => logsUnder(join(path, f)));
}

// Run as a tool only when it is the file being run (the house's rule for every tool; a test imports the functions above).
if (process.argv[1] && process.argv[1].endsWith('usage-by-model.mjs')) {
  const args = process.argv.slice(2).filter((a) => !a.startsWith('--')); const byFile = process.argv.includes('--by-file');
  const files = (args.length ? args : [join(homedir(), '.claude', 'projects')]).flatMap(logsUnder);
  const total = {}; const perFile = []; const seen = new Set();
  for (const f of files) {
    const lines = readFileSync(f, 'utf8').split('\n'); const u = usageByModel(lines, seen);
    if (byFile) perFile.push([f, usageByModel(lines)]);   // what each log holds, by itself
    for (const [model, t] of Object.entries(u)) { const s = total[model] || (total[model] = { replies: 0, input: 0, write5m: 0, write1h: 0, read: 0, output: 0, dollars: 0 }); for (const k of Object.keys(s)) s[k] = k === 'dollars' ? (s.dollars === null || t.dollars === null ? null : s.dollars + t.dollars) : s[k] + t[k]; }
  }
  const fmt = (x) => Math.round(x).toLocaleString('en-US'); const money = (d) => (d === null ? 'no price' : `$${d.toFixed(2)}`);
  const sum = Object.values(total).reduce((a, t) => a + (t.dollars || 0), 0);
  console.log(`${files.length} logs read`);
  for (const [model, t] of Object.entries(total).sort((a, b) => (b[1].dollars || 0) - (a[1].dollars || 0))) {
    const p = priceOf(model);
    console.log(`${(p ? p.name : model).padEnd(12)} ${fmt(t.replies).padStart(6)} replies  input ${fmt(t.input)}  cache writes ${fmt(t.write5m + t.write1h)}  cache reads ${fmt(t.read)}  output ${fmt(t.output)}  ${t.dollars === null ? 'no price, left out of the shares' : `about ${money(t.dollars)} at API prices (${sum ? ((100 * t.dollars) / sum).toFixed(1) : '0.0'} percent)`}`);
  }
  if (byFile) for (const [f, u] of perFile) console.log(`  ${f.split('/').slice(-2).join('/')}: ${Object.entries(u).map(([m, t]) => `${(priceOf(m) || { name: m }).name} ${money(t.dollars)}`).join(', ')}`);
}
