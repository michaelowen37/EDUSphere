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
//
// Each agent's share of a pass (pass NX, EARMARKS L33, after pass NR's week ran out by Tuesday; Mikey: "Has this round and last used a
// lot more usage than normal rounds?  Seems like we maxed our weekly usage faster than I ever have in the past.  It's only Tuesday
// morning and the usage reset Sunday evening."). The lead runs this at each checkpoint of a pass, so it paces the pass by measure, not
// by estimate. It reads whichever the session keeps:
//
// 1. The logs (--by-agent, or --names <the lead's state file>). Claude Code 2.1.330 writes the lead's log as <project folder>/
//    <session id>.jsonl and each agent's as <project folder>/<session id>/subagents/agent-<agent id>.jsonl, and an agent continued
//    with SendMessage keeps its id and its log (read in its code, pass NX). Each agent is one row, by its id, however many logs hold
//    it, and each session's own log is the lead's row: its replies, each counted once across every log (usageByModel, below, with one
//    seen for all of them), its cache reads, its dollars at the prices below and its share of every log's dollars, and an agent's
//    rounds; the largest first, ties in the order read. A reply two logs hold counts in the log read first, the sessions' logs before
//    the agents', each group in the order of its paths, since a log that carries another's replies (a fork's carries its parent's) is
//    read after the one that wrote them. A line written twice (the same uuid, as a resume or a copy of a log can write it) is read once
//    for the rounds, and a reply counts in the round its first line stands in.
//    A round is one start or resume: the agent's first prompt, and each prompt that comes once it has stopped, after a reply that
//    called no tool (a reply's lines read together), after one that called SubagentHandback (which ends a run) or after the harness's
//    "[Request interrupted by user" line; a message the lead sends while the agent works comes after a reply that called a tool and
//    stays in its round. A prompt is a user line that is not a tool's result and that the harness has not marked as its own (isMeta),
//    as a compaction's summary (isCompactSummary) or as a line for the transcript only (isVisibleInTranscriptOnly). A round is named by
//    the time its prompt was written (UTC), with its replies and their dollars; a log that begins with a reply begins its first round
//    there.
//    An agent's name is the first of: the words before its id on the first line of the state file that holds the id with no letter
//    or digit beside it and gives words before it (the lead writes each agent's name beside its id there), back to the line's start or
//    to the last colon, semicolon or full stop followed by a space, less a list's dash and a clock time at the front and a bracket or a
//    comma at the end; the agentName its own log's lines carry (an agent team's teammate); the name, else the description, of the Agent
//    call (Task in older logs) whose result gives the id (toolUseResult's agentId, else "agentId: <id>" in the result's words); and
//    none. A compaction rewrites the lead's log (pass NG: its replies before each compaction were gone), so the state file's name is the
//    one that lasts.
// 2. The lead's table (--agents <file>), where the session keeps no log on disk (passes NJ to NQ and NS to NW kept none, and pass NX
//    keeps none: a cloud session's project folder holds tool results alone). The lead adds one entry for each agent's task
//    notification as it comes, to a file that is a JSON array of entries, in the order the notifications came:
//      [{ "name": "WR1", "role": "whole read, RULES-AUDIT 1-340", "model": "Fable 5.2", "tokens": 329236, "toolUses": 61,
//         "minutes": 24.6, "at": "2026-11-22 18:20", "version": "2.1.330" }]
//    with these fields, the first seven required:
//      name      the name the lead gave the agent, as its state file has it (an agent resumed keeps its name: one entry a round)
//      role      what it did (a whole read, an engineer, the sweep, a code read)
//      model     the model it ran on, by its name (Fable 5.2, Opus 5.5, Sonnet 5.5, Haiku 5.5) or its id (claude-opus-5-5)
//      tokens    the notification's subagent_tokens, a whole number
//      toolUses  its tool_uses, a whole number
//      minutes   its duration_ms over 60,000, a number
//      at        when the notification came, as the lead writes a time ("2026-11-22 18:20")
//      version   (optional) the Claude Code version the agent ran on, as claude --version prints it ("2.1.330")
//      note      (optional) the lead's own words
//    Words are read without the spaces at their ends. An entry that is not an object, lacks a required field, holds one of the wrong
//    kind or a field the form does not have, repeats an earlier entry (every required field the same) or gives a model other than its
//    agent's first round's is named first and left out of every total, and the run exits 1; a table with no entries is named too. The
//    rest prints each agent once, the largest first, its rounds named by their at, its tokens (its rounds' sum, since each round's
//    replies read the agent's whole context again), tool uses and minutes, and its share of its model's agents' tokens and of all the
//    agents' tokens; then each model's tokens and share; then the lead's own work, named as not counted, since no notification reports
//    it (Mikey's bars at the pass's start and end measure it).
//    What a notification's count is (read in Claude Code 2.1.330's code, pass NX): the larger of the harness's running count and the
//    agent's last reply's own usage, each that reply's prompt (its input, cache writes and cache reads) and its output, never the sum
//    of its replies. So it is the agent's context at its end, a round after a resume holds the rounds before it, and a share here is
//    of the agents' last contexts, a guide to their size, not to the week's use, which every reply's reading makes.
// The week's research sweep (pass NX): Claude Code's changelog (its CHANGELOG.md on GitHub, whose 2.1.328 heading the lead read again on
// November 23) says 2.1.328 "Fixed the token counts on the spinner and for subagents
// counting a retried reply twice, missing replies that were not streamed, and standing still while Claude thinks" (the release notes
// inside 2.1.330, read in pass NX, give the entry whole). So a notification's count taken before 2.1.328 may be high where a reply was
// retried, and low where one was not streamed; the table's lines count its rounds by the version they name. The logs give each
// reply's usage as written with it, not the harness's count the entry fixed. Every run prints this note last.
//
// Run: node tools/usage-by-model.mjs [a log file or folder ...]      (no argument: every log under ~/.claude/projects)
//      add --by-file to list each log (the lead's and each agent's) on its own line as well;
//      add --by-agent, or --names <the lead's state file>, for each agent's share, rounds, replies and cache reads (pass NX);
//      add --agents <file> to read the lead's table where the session keeps no log (pass NX);
//      or --selftest, which proves the tool on made logs and a made table in a few seconds (check.sh's step for it).
// It exits 0; 1 when the table names a problem; 2 when --agents or --names names no file it can read, or the table is not a JSON
// array, each before any log is read.
import { readFileSync, readdirSync, statSync, existsSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join, basename } from 'node:path'; import { homedir, tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process'; import { fileURLToPath } from 'node:url';

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

// One reply's tokens and dollars, the one place a reply is priced (pass NX moved it here from usageByModel, unchanged): its input, its
// cache writes kept five minutes and an hour (a write with no breakdown priced as the cheaper kind), its cache reads and its output,
// and its dollars at its model's rates, Haiku 5.5's by its prompt; dollars null for a model with no price.
export function replyCost(model, u) {
  const writes = u.cache_creation || {}; const w1h = Number(writes.ephemeral_1h_input_tokens || 0); const w5m = Number(writes.ephemeral_5m_input_tokens || 0);
  const allWrites = Number(u.cache_creation_input_tokens || 0); const input = Number(u.input_tokens || 0); const read = Number(u.cache_read_input_tokens || 0); const output = Number(u.output_tokens || 0);
  const five = w5m + Math.max(0, allWrites - w1h - w5m);   // a write with no breakdown is priced as the cheaper kind
  const p = priceOf(model); if (!p) return { input, read, output, write1h: w1h, write5m: five, dollars: null };
  const rate = p.long && input + read + w1h + five > p.long.over ? p.long : p;
  return { input, read, output, write1h: w1h, write5m: five, dollars: (input * rate.input + five * rate.write5m + w1h * rate.write1h + read * rate.read + output * rate.output) / 1e6 };
}

// Every reply in some log lines, counted once by its message id, totalled by model, each reply priced on its own (its prompt decides
// Haiku's rates). A reply with no id is counted on its own line. seen, shared across logs, holds the ids already counted, so a reply
// two logs repeat counts once. A model with no price keeps its tokens and has dollars null. Since pass NX, onReply, when given, hears
// each reply counted here, with its model, its cost and the line it first stands on (at), so the agents' reader counts through this
// function and no copy of it.
export function usageByModel(lines, seen = new Set(), onReply = null) {
  const replies = new Map(); let n = 0;
  lines.forEach((line, at) => {
    let d; try { d = JSON.parse(line); } catch (e) { return; }
    const m = d && d.type === 'assistant' && d.message; const u = m && m.usage; if (!u) return;
    const key = m.id || `line-${n++}`; const was = replies.get(key);
    replies.set(key, { model: m.model || 'unknown', u, id: m.id || null, at: was ? was.at : at });
  });
  const out = {};
  for (const { model, u, id, at } of replies.values()) {
    if (id) { if (seen.has(id)) continue; seen.add(id); }
    const t = out[model] || (out[model] = { replies: 0, input: 0, write5m: 0, write1h: 0, read: 0, output: 0, dollars: 0 });
    const c = replyCost(model, u);
    t.replies += 1; t.input += c.input; t.read += c.read; t.output += c.output; t.write1h += c.write1h; t.write5m += c.write5m;
    if (c.dollars === null) t.dollars = null; else if (t.dollars !== null) t.dollars += c.dollars;
    if (onReply) onReply({ model, at, cost: c });
  }
  return out;
}

// Every .jsonl log under a folder, its own and its agents' (Claude Code keeps an agent's log in subagents/ beside the session's).
export function logsUnder(path) {
  if (!existsSync(path)) return [];
  if (statSync(path).isFile()) return path.endsWith('.jsonl') ? [path] : [];
  return readdirSync(path).flatMap((f) => logsUnder(join(path, f)));
}

// Whose log a file is (pass NX): an agent's is named agent-<its id>.jsonl, wherever it lies; any other is a session's, the lead's,
// named by its session id. orderLogs gives the order they are read in: each file once, the sessions' logs first, then the agents',
// each group by its path.
export const agentIdOf = (file) => { const m = /^agent-(.+)\.jsonl$/.exec(basename(file)); return m ? m[1] : null; };
const sessionOf = (file) => basename(file).replace(/\.jsonl$/, '');
export const orderLogs = (files) => [...new Set(files)].sort((a, b) => (agentIdOf(a) !== null) - (agentIdOf(b) !== null) || (a < b ? -1 : a > b ? 1 : 0));

// The words of a message's content, whether it is a string or a list of blocks (its text blocks, joined); none for no content.
const textOf = (content) => (typeof content === 'string' ? content : Array.isArray(content) ? content.map((b) => b.text).join('\n') : '');

// What a log line is, for the rounds (header, part 1): a reply, a tool's result, the harness's line that a run was stopped, a prompt,
// or another line (one with no message, such as a summary, the harness's own, a compaction's summary or a line for the transcript only).
export function lineKind(d) {
  if (!d.message) return 'other';
  if (d.type === 'assistant') return 'reply';
  if (d.type !== 'user') return 'other';
  const c = d.message.content;
  if (Array.isArray(c) && c.some((b) => b.type === 'tool_result')) return 'result';
  if (d.isMeta === true || d.isCompactSummary === true || d.isVisibleInTranscriptOnly === true) return 'other';
  if (/^\[Request interrupted by user/.test(textOf(c).trim())) return 'stopped';
  return 'prompt';
}

// The name the lead's state file gives an agent (header, part 1): from the first line that holds the id with no letter or digit beside
// it and gives words before it, those words back to the line's start or the last colon, semicolon or full stop followed by a space,
// less a list's dash and a clock time at the front and a bracket or a comma at the end. null when no line names it.
export function nameInState(text, id) {
  const word = /[0-9A-Za-z]/;
  for (const line of String(text).split('\n')) {
    let at = line.indexOf(id);
    while (at >= 0 && (word.test(line[at - 1] || '') || word.test(line[at + id.length] || ''))) at = line.indexOf(id, at + 1);
    if (at < 0) continue;
    const before = line.slice(0, at);
    const stops = [...before.matchAll(/[:;.]\s/g)]; const from = stops.length ? stops[stops.length - 1].index + 1 : 0;
    const name = before.slice(from).replace(/^\s*(?:[-*+]\s+)?(?:\d{1,2}:\d{2}\s+)?/, '').replace(/[\s,([]+$/, '');
    if (name) return name;
  }
  return null;
}

// The name an Agent call gave (its name, else its description), and the agent id its result gives (toolUseResult's agentId, else
// "agentId: <id>" in the result's words).
const nameOfCall = (input) => (typeof input.name === 'string' && input.name.trim() ? input.name.trim() : typeof input.description === 'string' && input.description.trim() ? input.description.trim() : null);
function agentIdIn(d, block) {
  const r = d.toolUseResult; if (r && r.agentId) return String(r.agentId);
  const m = /agentId: ([A-Za-z0-9_-]+)/.exec(textOf(block.content)); return m ? m[1] : null;
}

// Each agent's share (header, part 1): every log read in order, its lines walked once for the rounds and the names, and its replies
// counted through usageByModel with one seen for every log, each into its owner (the lead of its session, or the agent of its id),
// the owner's round and its model's totals. Returns the owners (the leads and the agents, each with its rounds, replies, cache reads
// and dollars, and an agent with its name and where the name came from) and the totals by model, as usageByModel gives them.
export function usageByAgent(files, { stateText = '', read = (f) => readFileSync(f, 'utf8') } = {}) {
  const ordered = orderLogs(files); const seen = new Set(); const owners = new Map(); const models = {};
  const calls = new Map(); const launched = new Map();   // each Agent call's tool use id and the name it gave; each agent id a result gave, and that name
  const newRound = (at) => ({ at, replies: 0, dollars: 0 });
  for (const f of ordered) {
    const id = agentIdOf(f); const key = id === null ? 'session ' + sessionOf(f) : 'agent ' + id;
    if (!owners.has(key)) owners.set(key, { kind: id === null ? 'lead' : 'agent', id, session: id === null ? sessionOf(f) : null, files: [], logName: null, rounds: [], uuids: new Set(), stopped: true, lastReply: undefined, lastTools: new Set(), replies: 0, read: 0, dollars: 0, unpriced: 0, models: new Map() });
    const o = owners.get(key); o.files.push(f);
    // The walk for the rounds and the names: a line this owner has read already is passed over.
    const walk = (line) => {
      let d; try { d = JSON.parse(line); } catch (e) { return; }
      if (!d || typeof d !== 'object') return;
      if (d.uuid) { if (o.uuids.has(d.uuid)) return; o.uuids.add(d.uuid); }
      if (d.agentName) o.logName = String(d.agentName);
      const kind = lineKind(d);
      if (kind === 'reply') {
        if (!o.rounds.length) o.rounds.push(newRound(d.timestamp));
        if (d.message.id !== o.lastReply) { o.lastReply = d.message.id; o.lastTools = new Set(); }
        for (const b of d.message.content || []) if (b.type === 'tool_use') { o.lastTools.add(b.name); if (b.name === 'Agent' || b.name === 'Task') calls.set(b.id, nameOfCall(b.input || {})); }
        o.stopped = o.lastTools.size === 0 || o.lastTools.has('SubagentHandback');
      } else if (kind === 'result') {
        for (const b of d.message.content) if (calls.get(b.tool_use_id)) { const agent = agentIdIn(d, b); if (agent) launched.set(agent, calls.get(b.tool_use_id)); }
      } else if (kind === 'stopped') o.stopped = true;
      else if (kind === 'prompt') { if (o.stopped) o.rounds.push(newRound(d.timestamp)); o.stopped = false; }
    };
    const lines = read(f).split('\n'); const roundAt = [];
    lines.forEach((line, i) => { walk(line); roundAt[i] = o.rounds.length - 1; });
    // The count: each reply once, through usageByModel, into its model, its owner and the round its first line stands in.
    usageByModel(lines, seen, ({ model, at, cost }) => {
      const t = models[model] || (models[model] = { replies: 0, input: 0, write5m: 0, write1h: 0, read: 0, output: 0, dollars: 0 });
      t.replies += 1; t.input += cost.input; t.write5m += cost.write5m; t.write1h += cost.write1h; t.read += cost.read; t.output += cost.output;
      const r = o.rounds[roundAt[at]]; o.replies += 1; o.read += cost.read; r.replies += 1;
      if (cost.dollars === null) { t.dollars = null; o.unpriced += 1; } else { t.dollars += cost.dollars; o.dollars += cost.dollars; r.dollars += cost.dollars; }
      o.models.set(model, (o.models.get(model) || 0) + 1);
    });
  }
  // Each agent's name, by the order the header gives.
  for (const o of owners.values()) {
    if (o.kind !== 'agent') continue;
    const fromState = nameInState(stateText, o.id);
    if (fromState) { o.name = fromState; o.nameFrom = 'the state file'; }
    else if (o.logName) { o.name = o.logName; o.nameFrom = 'its log'; }
    else if (launched.has(o.id)) { o.name = launched.get(o.id); o.nameFrom = "the lead's log"; }
    else { o.name = null; o.nameFrom = 'no name'; }
  }
  return { owners: [...owners.values()], models, logs: ordered.length };
}

// Numbers and words for the lines below: a whole number with commas, dollars, a share in percent to one place, a plural.
const fmt = (x) => Math.round(x).toLocaleString('en-US');
const money = (d) => (d === null ? 'no price' : '$' + d.toFixed(2));
const pct = (part, whole) => (whole ? ((100 * part) / whole).toFixed(1) : '0.0');
const plural = (n, word, many = word + 's') => fmt(n) + ' ' + (n === 1 ? word : many);

// The totals by model, one line each, as the tool has printed them since pass NG.
export function modelLines(models) {
  const sum = Object.values(models).reduce((a, t) => a + (t.dollars || 0), 0);
  return Object.entries(models).sort((a, b) => (b[1].dollars || 0) - (a[1].dollars || 0)).map(([model, t]) => {
    const p = priceOf(model);
    const priced = t.dollars === null ? 'no price, left out of the shares' : 'about ' + money(t.dollars) + ' at API prices (' + pct(t.dollars, sum) + ' percent)';
    return `${(p ? p.name : model).padEnd(12)} ${fmt(t.replies).padStart(6)} replies  input ${fmt(t.input)}  cache writes ${fmt(t.write5m + t.write1h)}  cache reads ${fmt(t.read)}  output ${fmt(t.output)}  ${priced}`;
  });
}

// When a round began, as "11-23 00:35" in UTC, or "00:35" when the round before it began the same day.
function stamp(at, before) {
  const m = /^\d{4}-(\d\d)-(\d\d)T(\d\d):(\d\d)/.exec(String(at)); if (!m) return 'a time not written';
  const b = /^\d{4}-(\d\d)-(\d\d)T/.exec(String(before));
  return (b && b[1] === m[1] && b[2] === m[2] ? '' : m[1] + '-' + m[2] + ' ') + m[3] + ':' + m[4];
}

// Each agent's share (header, part 1), a line for each session's lead and each agent, the largest first, and a line for them all.
export function agentLines(r, stateFile) {
  const total = r.owners.reduce((a, o) => a + o.dollars, 0); const out = [];
  const modelsOf = (o) => [...o.models.entries()].sort((a, b) => b[1] - a[1]).map(([m]) => (priceOf(m) || { name: m }).name).join(' and ');
  const body = (o) => {
    const rounds = o.kind === 'agent' ? plural(o.rounds.length, 'round') + ': ' + o.rounds.map((rd, i) => stamp(rd.at, i ? o.rounds[i - 1].at : null) + ' (' + plural(rd.replies, 'reply', 'replies') + ', ' + money(rd.dollars) + ')').join(', ') + ', ' : '';
    const unpriced = o.unpriced ? ', ' + plural(o.unpriced, 'reply', 'replies') + ' of a model with no price left out of its dollars' : '';
    const logs = o.files.length > 1 ? ', in ' + plural(o.files.length, 'log') : '';
    return (modelsOf(o) || 'no replies') + ', ' + rounds + plural(o.replies, 'reply', 'replies') + ', cache reads ' + fmt(o.read) + ', about ' + money(o.dollars) + ' at API prices (' + pct(o.dollars, total) + ' percent)' + unpriced + logs;
  };
  out.push("Each agent's share of these logs, each reply once at the prices above (times in UTC; a name from " + (stateFile ? 'the state file ' + stateFile + ', else ' : '') + "the agent's own log, else the Agent call that launched it):");
  const leads = r.owners.filter((o) => o.kind === 'lead'); const agents = r.owners.filter((o) => o.kind === 'agent').sort((a, b) => b.dollars - a.dollars);
  for (const o of leads) out.push('  the lead, session ' + o.session.slice(0, 8) + ': ' + body(o));
  for (const o of agents) out.push('  ' + (o.name || '(no name)') + ' [' + o.id + ', ' + o.nameFrom + ']: ' + body(o));
  const leadDollars = leads.reduce((a, o) => a + o.dollars, 0); const agentDollars = agents.reduce((a, o) => a + o.dollars, 0);
  out.push('The lead about ' + money(leadDollars) + ' (' + pct(leadDollars, total) + ' percent); the agents about ' + money(agentDollars) + ' (' + pct(agentDollars, total) + ' percent), ' + plural(agents.length, 'agent') + ' in ' + plural(agents.reduce((a, o) => a + o.rounds.length, 0), 'round') + '.');
  return out;
}

// The lead's table (header, part 2): its fields and the kind each must be, each condition written so a missing or broken value fails.
export const TABLE_FIELDS = { name: 'text', role: 'text', model: 'text', tokens: 'count', toolUses: 'count', minutes: 'minutes', at: 'text' };
export const TABLE_OPTIONAL = { version: 'version', note: 'text' };
const KIND_WORDS = { text: 'words', count: 'a whole number', minutes: 'a number of minutes', version: 'a version such as 2.1.330' };
const fits = (kind, v) => (kind === 'text' ? typeof v === 'string' && v.trim() !== ''
  : kind === 'count' ? Number.isInteger(v) && v >= 0
    : kind === 'minutes' ? Number.isFinite(v) && v >= 0
      : kind === 'version' ? typeof v === 'string' && /^\d+\.\d+\.\d+$/.test(v.trim()) : false);

// A model as the table writes it, by its name when the price table knows it by its id or its name ("claude-opus-5-5", "opus 5.5"),
// else as written.
export function modelName(v) { const s = v.trim(); const p = PRICES.find((x) => s.startsWith(x.model) || s.toLowerCase() === x.name.toLowerCase()); return p ? p.name : s; }

// Claude Code's version that fixed the harness's counts (the sweep's finding, header), and whether a version comes before it, part
// by part as numbers (2.1.99 comes before 2.1.328).
export const COUNTS_FIXED_IN = '2.1.328';
export function versionBefore(v, than = COUNTS_FIXED_IN) {
  const a = String(v).split('.').map(Number); const b = than.split('.').map(Number);
  for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] < b[i];
  return false;
}

// The table read and checked (header, part 2): each problem named, in the file's order; the entries that pass gathered by name into
// agents, each with its rounds; the totals by model and in all; and the rounds counted by the version they name.
export function readAgentTable(entries) {
  const problems = []; const agents = new Map(); const firstOf = new Map();
  if (!entries.length) problems.push('the table holds no entries');
  entries.forEach((e, i) => {
    const n = i + 1;
    if (!e || typeof e !== 'object' || Array.isArray(e)) { problems.push('entry ' + n + ' is not an object of fields'); return; }
    const label = 'entry ' + n + (typeof e.name === 'string' && e.name.trim() ? ' (' + e.name.trim() + ')' : '');
    const own = [];
    for (const [f, kind] of Object.entries(TABLE_FIELDS)) {
      if (!Object.hasOwn(e, f)) own.push('no ' + f); else if (!fits(kind, e[f])) own.push(f + ' is ' + JSON.stringify(e[f]) + ', not ' + KIND_WORDS[kind]);
    }
    for (const [f, kind] of Object.entries(TABLE_OPTIONAL)) if (Object.hasOwn(e, f) && !fits(kind, e[f])) own.push(f + ' is ' + JSON.stringify(e[f]) + ', not ' + KIND_WORDS[kind]);
    for (const f of Object.keys(e)) if (!Object.hasOwn(TABLE_FIELDS, f) && !Object.hasOwn(TABLE_OPTIONAL, f)) own.push('a field the form does not have, ' + JSON.stringify(f));
    if (own.length) { problems.push(label + ': ' + own.join('; ')); return; }
    const name = e.name.trim(); const at = e.at.trim(); const model = modelName(e.model);
    const same = JSON.stringify([name, e.role.trim(), model, e.tokens, e.toolUses, e.minutes, at]);
    if (firstOf.has(same)) { problems.push(label + ' repeats entry ' + firstOf.get(same) + ': every required field the same, counted once'); return; }
    firstOf.set(same, n);
    const a = agents.get(name);
    if (a && a.model !== model) { problems.push(label + ': its model, ' + model + ", is not its first round's, " + a.model + ' (an agent resumed keeps its model)'); return; }
    const round = { at, tokens: e.tokens, toolUses: e.toolUses, minutes: e.minutes, version: typeof e.version === 'string' ? e.version : null };
    if (a) a.rounds.push(round); else agents.set(name, { name, role: e.role.trim(), model, rounds: [round] });
  });
  const sum = (list, k) => list.reduce((x, r) => x + r[k], 0);
  const list = [...agents.values()].map((a) => ({ ...a, tokens: sum(a.rounds, 'tokens'), toolUses: sum(a.rounds, 'toolUses'), minutes: sum(a.rounds, 'minutes') })).sort((a, b) => b.tokens - a.tokens);
  const models = new Map();
  for (const a of list) { const m = models.get(a.model) || { model: a.model, tokens: 0, agents: 0, rounds: 0 }; m.tokens += a.tokens; m.agents += 1; m.rounds += a.rounds.length; models.set(a.model, m); }
  const rounds = list.flatMap((a) => a.rounds);
  const versions = { rounds: rounds.length, before: rounds.filter((r) => versionBefore(r.version)).length, none: rounds.filter((r) => r.version === null).length };
  versions.after = versions.rounds - versions.before - versions.none;
  return { problems, agents: list, models: [...models.values()].sort((a, b) => b.tokens - a.tokens), total: { tokens: sum(list, 'tokens'), agents: list.length, rounds: rounds.length }, versions };
}

// The table's file read (header, part 2): its entries, or the reason it cannot be read (no file, not JSON, not a JSON array).
export function loadAgentTable(file) {
  let text; try { text = readFileSync(file, 'utf8'); } catch (e) { return { error: '--agents: ' + file + ' cannot be read (' + (e.code || e.message) + ')' }; }
  let v; try { v = JSON.parse(text); } catch (e) { return { error: '--agents: ' + file + ' is not JSON (' + e.message + ')' }; }
  if (!Array.isArray(v)) return { error: '--agents: ' + file + " is not a JSON array of entries (its form is in this tool's header)" };
  return { entries: v };
}

// What a notification's count is (header, part 2), said under the table's lines.
export const COUNT_MEANING = "What a notification's count is (read in Claude Code 2.1.330's code, pass NX): the larger of the harness's running count and the agent's last reply's own usage, each that reply's prompt (its input, cache writes and cache reads) and its output, never the sum of its replies. So it is the agent's context at its end, a round after a resume holds the rounds before it, and these shares are of the agents' last contexts, a guide to their size, not a measure of the week's use.";

// The table's lines (header, part 2): its problems first, then each agent, each model and the whole, the lead named as not counted.
export function tableLines(t, file) {
  const out = ["The lead's table of the agents' task notifications (" + file + '):'];
  for (const p of t.problems) out.push('PROBLEM ' + p);
  if (t.problems.length) out.push(plural(t.problems.length, 'problem') + ' in the table: each entry named is left out of every total below; mend it and read the table again.');
  if (!t.agents.length) out.push('No entry was counted.');
  else {
    out.push(plural(t.total.agents, 'agent') + ' in ' + plural(t.total.rounds, 'round') + ', ' + fmt(t.total.tokens) + " tokens by the harness's own count (each notification's subagent_tokens):");
    const ofModel = new Map(t.models.map((m) => [m.model, m.tokens]));
    for (const a of t.agents) {
      const rounds = plural(a.rounds.length, 'round') + ': ' + a.rounds.map((r) => r.at + ' (' + fmt(r.tokens) + ')').join(', ');
      out.push('  ' + a.name + ' (' + a.role + ', ' + a.model + '): ' + fmt(a.tokens) + ' tokens, ' + pct(a.tokens, ofModel.get(a.model)) + ' percent of the ' + a.model + " agents' tokens and " + pct(a.tokens, t.total.tokens) + " percent of all the agents'; " + rounds + '; ' + plural(a.toolUses, 'tool use') + ', ' + Number(a.minutes.toFixed(1)).toLocaleString('en-US') + ' minutes');
    }
    out.push('By model:');
    for (const m of t.models) out.push('  ' + m.model + ': ' + fmt(m.tokens) + ' tokens (' + pct(m.tokens, t.total.tokens) + ' percent), ' + plural(m.agents, 'agent') + ' in ' + plural(m.rounds, 'round'));
  }
  out.push('In all: ' + fmt(t.total.tokens) + ' tokens, ' + plural(t.total.agents, 'agent') + ' in ' + plural(t.total.rounds, 'round') + ". The lead's own work is not counted: no notification reports it, and Mikey's bars at the pass's start and end are its measure.");
  out.push(COUNT_MEANING);
  return out;
}

// The week's research sweep (header), printed last in every run, with what the logs read and the table's versions say beside it.
export const SWEEP_ENTRY = 'Fixed the token counts on the spinner and for subagents counting a retried reply twice, missing replies that were not streamed, and standing still while Claude thinks';
export function sweepNote({ logs = 0, versions = null } = {}) {
  let s = "The week's research sweep (pass NX): Claude Code's changelog says " + COUNTS_FIXED_IN + ' "' + SWEEP_ENTRY + '", so a count a notification gave before ' + COUNTS_FIXED_IN + ' may be high where a reply was retried, and low where one was not streamed.';
  if (logs) s += " The logs read above give each reply's own usage, as written with it and counted once by its id, not the harness's count that entry fixed.";
  if (versions) s += " The table's rounds by the version they name: " + fmt(versions.before) + ' before ' + COUNTS_FIXED_IN + ', ' + fmt(versions.after) + ' at or after it, ' + fmt(versions.none) + ' with none.';
  return s;
}

// The tool as the lead runs it: the logs under the paths given (or every log under ~/.claude/projects), the models' totals, each log
// with --by-file, each agent with --by-agent or --names, the lead's table with --agents, and the sweep's note last. Returns the exit code.
export function main(argv) {
  if (argv.includes('--selftest')) return selfTest();
  const valued = ['--agents', '--names'];
  const valueOf = (flag) => { const i = argv.indexOf(flag); if (i < 0) return undefined; const v = argv[i + 1]; return v !== undefined && !v.startsWith('--') ? v : null; };
  const agentsFile = valueOf('--agents'); const namesFile = valueOf('--names');
  if (agentsFile === null || namesFile === null) { console.log('usage: node tools/usage-by-model.mjs [a log file or folder ...] [--by-file] [--by-agent] [--names <the state file>] [--agents <the table>] | --selftest (--agents and --names each name a file)'); return 2; }
  let stateText = '';
  if (namesFile !== undefined) { try { stateText = readFileSync(namesFile, 'utf8'); } catch (e) { console.log('--names: ' + namesFile + ' cannot be read (' + (e.code || e.message) + ')'); return 2; } }
  let table = null;
  if (agentsFile !== undefined) { const t = loadAgentTable(agentsFile); if (t.error) { console.log(t.error); return 2; } table = readAgentTable(t.entries); }
  const paths = argv.filter((a, i) => !a.startsWith('--') && !valued.includes(argv[i - 1]));
  const roots = paths.length ? paths : [join(homedir(), '.claude', 'projects')];
  const files = orderLogs(roots.flatMap(logsUnder)); const r = usageByAgent(files, { stateText });
  const out = [];
  if (files.length) out.push(`${files.length} logs read`);
  else out.push('0 logs read under ' + roots.join(', ') + ": no session log there (a cloud session keeps none on disk; its folder holds tool results alone), so each agent's share comes from the lead's table of its notifications (--agents <file>; its form is in this tool's header)");
  out.push(...modelLines(r.models));
  if (argv.includes('--by-file')) for (const f of files) { const u = usageByModel(readFileSync(f, 'utf8').split('\n')); out.push('  ' + f.split('/').slice(-2).join('/') + ': ' + Object.entries(u).map(([m, t]) => (priceOf(m) || { name: m }).name + ' ' + money(t.dollars)).join(', ')); }
  if (files.length && (argv.includes('--by-agent') || namesFile !== undefined)) out.push(...agentLines(r, namesFile));
  if (table) out.push(...tableLines(table, agentsFile));
  out.push(sweepNote({ logs: files.length, versions: table ? table.versions : null }));
  console.log(out.join('\n'));
  return table && table.problems.length ? 1 : 0;
}

// --selftest (check.sh's step for it): made logs and made tables in a folder with a space in its path, read by the functions above and
// by the tool's own command line, as the lead runs it. Each check's words say what it reads; each rule of the header is held by a
// check that fails without it (the pass's undo-alone proof undid each alone in a copy).
function selfTest() {
  let passed = 0; let failed = 0;
  const ok = (label, cond, detail) => { if (cond) { passed += 1; console.log('PASS ' + label); } else { failed += 1; console.log('FAIL ' + label + (detail === undefined ? '' : '\n     ' + (typeof detail === 'string' ? detail : JSON.stringify(detail)).slice(0, 2000))); } };
  const near = (a, b) => typeof a === 'number' && Math.abs(a - b) < 1e-9;
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const byKey = (o) => Object.fromEntries(Object.entries(o).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));   // a table compared whatever order its keys were met in
  const dir = mkdtempSync(join(tmpdir(), 'usage meter selftest ')); const self = fileURLToPath(import.meta.url);
  const run = (...args) => { const p = spawnSync(process.execPath, [self, ...args], { encoding: 'utf8' }); return { code: p.status, out: String(p.stdout || '') + String(p.stderr || ''), lines: String(p.stdout || '').split('\n') }; };
  try {
    // The made logs, in the form Claude Code 2.1.330 writes (header, part 1). Prices: Opus 5.5 $5 a million written for five minutes,
    // $8 for an hour, $0.20 read and $20 out; Fable 5.2 $40 out; Sonnet 5.5 $2 in; claude-new-9 has none.
    const T = (hhmm) => '2026-11-23T' + hhmm + ':00.000Z';
    const line = (o) => JSON.stringify({ parentUuid: null, version: '2.1.330', ...o });
    const user = (uuid, at, content, extra = {}) => line({ type: 'user', uuid, timestamp: at, message: { role: 'user', content }, ...extra });
    const reply = (uuid, at, id, model, content, usage, extra = {}) => line({ type: 'assistant', uuid, timestamp: at, message: { id, model, role: 'assistant', content, usage }, ...extra });
    const result = (uuid, at, toolUseId, words, extra = {}) => user(uuid, at, [{ type: 'tool_result', tool_use_id: toolUseId, content: [{ type: 'text', text: words }] }], extra);
    const tool = (id, name, input) => ({ type: 'tool_use', id, name, input }); const say = (words) => ({ type: 'text', text: words });
    const use = ({ input = 0, read = 0, output = 0, write5m = 0, write1h = 0 } = {}) => ({ input_tokens: input, cache_creation_input_tokens: write5m + write1h, cache_creation: { ephemeral_5m_input_tokens: write5m, ephemeral_1h_input_tokens: write1h }, cache_read_input_tokens: read, output_tokens: output });
    const launchedWords = (id) => 'Async agent launched successfully.\nagentId: ' + id + ' (internal ID - do not mention to user.)';
    const OPUS = 'claude-opus-5-5'; const FABLE = 'claude-fable-5-2'; const SONNET = 'claude-sonnet-5-5'; const NEW = 'claude-new-9';
    const S = '11111111-2222-4333-8444-555555555555'; const A = 'a0123456789abcdef'; const B = 'afedcba9876543210'; const C = 'a2222222222222222'; const D = 'a3333333'; const E = 'a4444444444444444'; const F = 'a5555555555555555';
    const proj = join(dir, 'projects', '-home-made'); const subs = join(proj, S, 'subagents'); const elsewhere = join(dir, 'elsewhere', 'subagents'); const nolog = join(dir, 'nolog');
    for (const p of [subs, elsewhere, join(proj, S, 'tool-results'), join(nolog, '-home-claude', S, 'tool-results')]) mkdirSync(p, { recursive: true });
    writeFileSync(join(proj, S, 'tool-results', 'toolu_x.txt'), 'a tool result, no log');
    writeFileSync(join(nolog, '-home-claude', S, 'tool-results', 'toolu_y.txt'), 'a tool result, no log');
    // The lead's log: a summary line with no message, and four launches. A's result gives its id in its words alone, its content a
    // string; B's call gives a name and a description and its result a toolUseResult with no agentId beside the id in its words; E's call
    // is an older Task call and its result gives the id in toolUseResult alone, in a reply that also holds an Agent call with no input,
    // whose result names F; C's in toolUseResult. $20.20 + $10 + $0 + $0.
    const L2 = reply('L-a2', T('00:02'), 'msg_L2', OPUS, [tool('toolu_B', 'Agent', { name: 'reader-made', description: 'made reader', prompt: 'Read it.' })], use({ output: 5e5 }));
    const lead = [user('L-u1', T('00:00'), 'Begin pass ZZ.'), line({ type: 'summary', summary: 'Pass ZZ', leafUuid: 'L-a1' }),
      reply('L-a1', T('00:01'), 'msg_L1', OPUS, [tool('toolu_A', 'Agent', { description: 'eng-made launch words', prompt: 'Do the task.' })], use({ read: 1e6, output: 1e6 })),
      user('L-r1', T('00:01'), [{ type: 'tool_result', tool_use_id: 'toolu_A', content: launchedWords(A) }]),
      L2, result('L-r2', T('00:02'), 'toolu_B', launchedWords(B), { toolUseResult: { status: 'async_launched' } }),
      reply('L-a3', T('00:03'), 'msg_L3', OPUS, [tool('toolu_E', 'Task', { description: 'made sweep', prompt: 'Sweep.' }), { type: 'tool_use', id: 'toolu_N', name: 'Agent' }], use()),
      result('L-r3', T('00:03'), 'toolu_E', 'Async agent launched successfully.', { toolUseResult: { status: 'async_launched', agentId: E } }),
      result('L-r5', T('00:03'), 'toolu_N', launchedWords(F)),
      reply('L-a4', T('00:04'), 'msg_L4', OPUS, [tool('toolu_C', 'Agent', { description: 'made chore launch', prompt: 'Count.' })], use()),
      result('L-r4', T('00:04'), 'toolu_C', 'Async agent launched successfully.', { toolUseResult: { status: 'async_launched', agentId: C } })];
    // Agent A, resumed twice. Round one ends on a reply that calls no tool, its first reply written on two lines; then a user line with
    // no message, a system line and the harness's reminder (isMeta); round two's prompt, after which the resume writes the first two
    // lines again; a reply written as a call and then words, a message with no content and a message sent while it works; it ends on
    // SubagentHandback and its result; a compaction's summary comes before round three's prompt, written as a list of blocks; round
    // three ends on a reply with an hour's cache write. $5 + $2.20 | $1.40 + $0.40 | $0.10 + $0.50.
    const agentA = [user('A-u1', T('00:35'), 'You are engineer made. Do the task.'),
      reply('A-a1', T('00:36'), 'msg_A1', OPUS, [say('Reading.')], use({ write5m: 1e6 })),
      reply('A-a2', T('00:36'), 'msg_A1', OPUS, [tool('toolu_a1', 'Bash', { command: 'ls' })], use({ write5m: 1e6 })),
      result('A-r1', T('00:37'), 'toolu_a1', 'the files'),
      reply('A-a3', T('00:40'), 'msg_A2', OPUS, [say('Round one is done.')], use({ read: 1e6, output: 1e5 })),
      line({ type: 'user', uuid: 'A-z1', timestamp: T('00:50') }), line({ type: 'system', uuid: 'A-s1', timestamp: T('01:05'), message: { content: "A line of the harness's own." } }),
      user('A-m1', T('01:09'), 'A reminder the harness adds.', { isMeta: true }),
      user('A-u2', T('01:10'), 'Round two: mend the second finding.'),
      user('A-u1', T('00:35'), 'You are engineer made. Do the task.'), reply('A-a1', T('00:36'), 'msg_A1', OPUS, [say('Reading.')], use({ write5m: 1e6 })),
      reply('A-a4', T('01:11'), 'msg_A3', OPUS, [tool('toolu_a3', 'Bash', {})], use({ read: 2e6, output: 5e4 })),
      reply('A-a4b', T('01:11'), 'msg_A3', OPUS, [say('Running it.')], use({ read: 2e6, output: 5e4 })),
      result('A-r3', T('01:12'), 'toolu_a3', 'done'), line({ type: 'user', uuid: 'A-w1', timestamp: T('01:13'), message: { role: 'user' } }),
      user('A-u3', T('01:15'), 'A note while you work: read the header too.'),
      reply('A-a5', T('01:20'), 'msg_A4', OPUS, [tool('toolu_h1', 'SubagentHandback', { message: 'the report' })], use({ read: 1e6, output: 1e4 })),
      result('A-r4', T('01:20'), 'toolu_h1', 'Delivered.'),
      user('A-c1', T('01:39'), 'A summary of the run so far.', { isCompactSummary: true }),
      user('A-u4', T('01:40'), [say('Round three: one more check.')]),
      reply('A-a6', T('01:41'), 'msg_A5', OPUS, [tool('toolu_a5', 'Read', {})], use({ output: 5e3 })),
      result('A-r5', T('01:42'), 'toolu_a5', 'the text'),
      reply('A-a7', T('01:45'), 'msg_A6', OPUS, [say('Done.')], use({ output: 5e3, write1h: 5e4 }))];
    // Agent D: a reply of a model with no price first; its run stopped by the harness's interruption line, then a line for the
    // transcript only, then a prompt; the interruption line and the prompt carry no uuid. $0 + $2 | $1.
    const agentD = [user('D-u1', T('00:55'), 'Run the slow step.'), reply('D-a0', T('00:55'), 'msg_D0', NEW, [say('Thinking.')], use({ output: 7 })),
      reply('D-a1', T('00:56'), 'msg_D1', OPUS, [tool('toolu_d1', 'Bash', {})], use({ output: 1e5 })),
      line({ type: 'user', timestamp: T('01:00'), message: { role: 'user', content: [say('[Request interrupted by user for tool use]')] } }),
      user('D-v1', T('01:04'), 'A line for the transcript only.', { isVisibleInTranscriptOnly: true }),
      line({ type: 'user', timestamp: T('01:05'), message: { role: 'user', content: 'Go on, but skip the slow step.' } }),
      reply('D-a2', T('01:06'), 'msg_D2', OPUS, [say('Done.')], use({ output: 5e4 }))];
    const write = (path, lines) => writeFileSync(path, lines.join('\n') + '\n');
    write(join(proj, S + '.jsonl'), lead);
    write(join(subs, 'agent-' + A + '.jsonl'), agentA);
    write(join(elsewhere, 'agent-' + A + '.jsonl'), [...agentA, L2]);   // a copy of A's log in another folder, carrying one of the lead's replies
    write(join(subs, 'agent-' + B + '.jsonl'), [user('B-u1', T('00:40'), 'Read the made pages.'), user('B-u2', T('00:40'), 'The pages are in the made folder.'), reply('B-a1', T('00:45'), 'msg_B1', FABLE, [say('Read.')], use({ output: 1e6 }))]);
    write(join(subs, 'agent-' + C + '.jsonl'), ['null', user('C-u1', T('00:50'), 'Count the rows.', { agentName: 'chore-made' }), reply('C-a1', T('00:51'), 'msg_C1', SONNET, [say('42 rows.')], use({ input: 1e6 }), { agentName: 'chore-made' })]);
    write(join(subs, 'agent-' + D + '.jsonl'), agentD);
    write(join(subs, 'agent-' + E + '.jsonl'), [user('E-c0', T('00:29'), 'A summary of the sweep so far.', { isCompactSummary: true }), line({ type: 'assistant', uuid: 'E-a1', timestamp: T('00:32'), message: { id: 'msg_E1', model: FABLE, role: 'assistant', usage: use({ output: 2.5e5 }) } })]);
    write(join(subs, 'agent-' + F + '.jsonl'), [line({ type: 'user', uuid: 'F-u1', message: { role: 'user', content: 'Start the screen read.' } })]);
    // The made state file, in the forms the lead's notes take (pass NX's own STATE.md among them).
    const state = ["# Pass ZZ state (the lead's notes, made for the self-test)", '- 19:10 eng-made resumed: a0123456789abcdef',
      '- WR1 RA 1-340 (+ long-row list) a908a446ff963acd4',
      '- 18:35 wave 2 launched (background): eng-made (Opus) a0123456789abcdef; eng-ripple (Opus) a6f9a2196035cbde7; A180 reader (Fable) aa83c91cbb0c014cc.',
      '- 18:20 whole reads all back (WR1 329,236; WR2 273,194), sweep 119,991; reports in nx/reports. Flow review aefe0eacf701fe322 running.',
      '- SWEEP a56fafaca77daeefa', '- 18:40 eng-x (a5842623586b63fd1)', '- eng-y, a7777777777777777', '- eng-z [a8888888888888888]', '- a6666666666666666x and ya6666666666666666 were old; eng-w a6666666666666666',
      '- 19:40 eng-made round three a0123456789abcdef', '- old reader afedcba98765432109', '- old writer xafedcba9876543210'].join('\n');
    const statePath = join(dir, 'STATE.md'); writeFileSync(statePath, state);

    // 1. The state file's names, each form the header gives, read alone.
    const ids = ['a908a446ff963acd4', A, 'a6f9a2196035cbde7', 'aa83c91cbb0c014cc', 'aefe0eacf701fe322', 'a56fafaca77daeefa', 'a5842623586b63fd1', 'a7777777777777777', 'a8888888888888888', 'a6666666666666666', B, D];
    const names = Object.fromEntries(ids.map((id) => [id, nameInState(state, id)]));
    const wantNames = { a908a446ff963acd4: 'WR1 RA 1-340 (+ long-row list)', [A]: 'eng-made (Opus)', a6f9a2196035cbde7: 'eng-ripple (Opus)', aa83c91cbb0c014cc: 'A180 reader (Fable)', aefe0eacf701fe322: 'Flow review', a56fafaca77daeefa: 'SWEEP', a5842623586b63fd1: 'eng-x', a7777777777777777: 'eng-y', a8888888888888888: 'eng-z', a6666666666666666: 'eng-w', [B]: null, [D]: null };
    ok("the state file names each agent by the words before its id: after a colon and a space (eng-made (Opus), its first line giving no words passed over and its later line not read), a semicolon (eng-ripple (Opus), A180 reader (Fable), eng-w, whose first two places are inside words) and a full stop (Flow review), less a list's dash (WR1 RA 1-340 (+ long-row list), SWEEP), a clock time and a bracket (eng-x, whose 18:40 is no stop), a comma (eng-y) and a square bracket (eng-z); an id with a letter or digit beside it, on either side, and one no line holds, name none", same(byKey(names), byKey(wantNames)), { names, wantNames });

    // 2. The logs read as the lead's and six agents', A once though two folders hold its log.
    // Handed in out of order (round one's code read of pass NX): usageByAgent orders the logs itself, the sessions' before the agents'.
    const files = orderLogs([...logsUnder(join(dir, 'projects')), ...logsUnder(join(dir, 'elsewhere'))]).reverse();
    const r = usageByAgent(files, { stateText: state }); const by = Object.fromEntries(r.owners.map((o) => [o.kind === 'lead' ? 'lead' : o.id, o]));
    ok('the made logs read as the lead and six agents, eight logs, agent A once by its id though two folders hold its log (and no tool result read as a log)', files.length === 8 && r.owners.length === 7 && same(Object.keys(by).sort(), [A, B, C, D, E, F, 'lead'].sort()) && by[A].files.length === 2, { files: files.length, owners: Object.keys(by) });
    const roundsOf = (o) => (o ? o.rounds.map((x) => [x.at, x.replies]) : null);
    ok('an agent resumed twice is one row with its three rounds named by when each began, 00:35, 01:10 and 01:40, two replies in each', same(roundsOf(by[A]), [[T('00:35'), 2], [T('01:10'), 2], [T('01:40'), 2]]), roundsOf(by[A]));
    ok('a reply written on two lines, again by the resume after round two\'s prompt and again in the copy of the log counts once, in the round its first line stands in: agent A has 6 replies, about $9.60 ($7.20, $1.80 and $0.60 by round) and 4,000,000 cache reads', by[A] && by[A].replies === 6 && near(by[A].dollars, 9.6) && by[A].read === 4e6 && by[A].rounds.every((x, i) => near(x.dollars, [7.2, 1.8, 0.6][i])), by[A] && { replies: by[A].replies, dollars: by[A].dollars, read: by[A].read, rounds: by[A].rounds });
    ok("a reply that called no tool ends a run (A's round two begins at 01:10), and so does one that called SubagentHandback (A's round three at 01:40) and the harness's interruption line (D's round two at 01:05, its lines with no uuid each read)", by[A] && by[A].rounds.length === 3 && by[A].rounds[1].at === T('01:10') && by[A].rounds[2].at === T('01:40') && same(roundsOf(by[D]), [[T('00:55'), 2], [T('01:05'), 1]]), { A: roundsOf(by[A]), D: roundsOf(by[D]) });
    ok("a message sent while the agent works stays in its round (A's 01:15 note, and its message with no content), as does a reply whose words follow its call (A's msg_A3), and no tool's result (the handback's at 01:20), no line written twice (the resume's first prompt again), no line without a message, no system line and none the harness marks as its own (isMeta at 01:09, a compaction's summary at 01:39, a line for the transcript only at 01:04 in D) begins a round; nor does a second prompt before any reply (B's)", same(roundsOf(by[A]), [[T('00:35'), 2], [T('01:10'), 2], [T('01:40'), 2]]) && same(roundsOf(by[D]), [[T('00:55'), 2], [T('01:05'), 1]]) && same(roundsOf(by[B]), [[T('00:40'), 1]]), { A: roundsOf(by[A]), D: roundsOf(by[D]), B: roundsOf(by[B]) });
    ok("a log that begins with a reply begins its first round there (E's, after a compaction's summary, at 00:32), and an agent that has not replied has its one round and no reply (F's, its time not written)", same(roundsOf(by[E]), [[T('00:32'), 1]]) && same(roundsOf(by[F]), [[undefined, 0]]) && by[F].replies === 0 && by[F].dollars === 0, { E: roundsOf(by[E]), F: roundsOf(by[F]) });
    ok("the lead's row is its session's log: 4 replies, about $30.20 and 1,000,000 cache reads, its Agent call's reply counted for it though the copy of A's log, read first by path, holds it too", by.lead && by.lead.replies === 4 && near(by.lead.dollars, 30.2) && by.lead.read === 1e6 && by.lead.session === S, by.lead && { replies: by.lead.replies, dollars: by.lead.dollars });
    ok("a reply of a model with no price counts as a reply and stays out of the dollars: D has 3 replies, 1 unpriced, about $3.00", by[D] && by[D].replies === 3 && by[D].unpriced === 1 && near(by[D].dollars, 3), by[D] && { replies: by[D].replies, unpriced: by[D].unpriced, dollars: by[D].dollars });
    const named = Object.fromEntries(r.owners.filter((o) => o.kind === 'agent').map((o) => [o.id, [o.name, o.nameFrom]]));
    ok("each agent's name comes from the first source that has one: A from the state file over its Agent call's description, B from its call's name over its description (its id in the result's words, beside a toolUseResult with none), C from the agentName its log carries over its call's description, E from an older Task call's description (its id in toolUseResult alone), and D and F none (F's id is in the result of a call that gave no name)", same(byKey(named), byKey({ [A]: ['eng-made (Opus)', 'the state file'], [B]: ['reader-made', "the lead's log"], [C]: ['chore-made', 'its log'], [D]: [null, 'no name'], [E]: ['made sweep', "the lead's log"], [F]: [null, 'no name'] })), named);
    const crossed = {}; const seen = new Set();
    for (const f of files) for (const [m, t] of Object.entries(usageByModel(readFileSync(f, 'utf8').split('\n'), seen))) { const s = crossed[m] || (crossed[m] = { replies: 0, dollars: 0 }); s.replies += t.replies; s.dollars = s.dollars === null || t.dollars === null ? null : s.dollars + t.dollars; }
    const models = Object.fromEntries(Object.entries(r.models).map(([m, t]) => [m, [t.replies, t.dollars === null ? 'no price' : Math.round(t.dollars * 100) / 100]]));
    ok('the totals by model: Opus 5.5 12 replies about $42.80, Fable 5.2 2 about $50.00, Sonnet 5.5 1 about $2.00 and claude-new-9 1 with no price, each what usageByModel gives over the same logs with one seen', same(byKey(models), byKey({ [OPUS]: [12, 42.8], [FABLE]: [2, 50], [SONNET]: [1, 2], [NEW]: [1, 'no price'] })) && Object.keys(crossed).length === 4 && Object.entries(crossed).every(([m, t]) => r.models[m].replies === t.replies && (t.dollars === null ? r.models[m].dollars === null : near(r.models[m].dollars, t.dollars))), { models, crossed });

    // 3. The same logs through the command line, as the lead runs it, the projects folder given twice.
    const cli = run('--names', statePath, join(dir, 'projects'), join(dir, 'projects'), join(dir, 'elsewhere'));
    const wantModels = ['Fable 5.2         2 replies  input 0  cache writes 0  cache reads 0  output 1,250,000  about $50.00 at API prices (52.7 percent)',
      'Opus 5.5         12 replies  input 0  cache writes 1,050,000  cache reads 5,000,000  output 1,820,000  about $42.80 at API prices (45.1 percent)',
      'Sonnet 5.5        1 replies  input 1,000,000  cache writes 0  cache reads 0  output 0  about $2.00 at API prices (2.1 percent)',
      'claude-new-9      1 replies  input 0  cache writes 0  cache reads 0  output 7  no price, left out of the shares'];
    const wantRows = ['  the lead, session 11111111: Opus 5.5, 4 replies, cache reads 1,000,000, about $30.20 at API prices (31.9 percent)',
      '  reader-made [' + B + ", the lead's log]: Fable 5.2, 1 round: 11-23 00:40 (1 reply, $40.00), 1 reply, cache reads 0, about $40.00 at API prices (42.2 percent)",
      '  made sweep [' + E + ", the lead's log]: Fable 5.2, 1 round: 11-23 00:32 (1 reply, $10.00), 1 reply, cache reads 0, about $10.00 at API prices (10.5 percent)",
      '  eng-made (Opus) [' + A + ', the state file]: Opus 5.5, 3 rounds: 11-23 00:35 (2 replies, $7.20), 01:10 (2 replies, $1.80), 01:40 (2 replies, $0.60), 6 replies, cache reads 4,000,000, about $9.60 at API prices (10.1 percent), in 2 logs',
      '  (no name) [' + D + ', no name]: Opus 5.5 and claude-new-9, 2 rounds: 11-23 00:55 (2 replies, $2.00), 01:05 (1 reply, $1.00), 3 replies, cache reads 0, about $3.00 at API prices (3.2 percent), 1 reply of a model with no price left out of its dollars',
      '  chore-made [' + C + ', its log]: Sonnet 5.5, 1 round: 11-23 00:50 (1 reply, $2.00), 1 reply, cache reads 0, about $2.00 at API prices (2.1 percent)',
      '  (no name) [' + F + ', no name]: no replies, 1 round: a time not written (0 replies, $0.00), 0 replies, cache reads 0, about $0.00 at API prices (0.0 percent)',
      'The lead about $30.20 (31.9 percent); the agents about $64.60 (68.1 percent), 6 agents in 9 rounds.'];
    const at = cli.lines.findIndex((l) => l.startsWith("Each agent's share of these logs"));
    ok('the command line with --names reads each log once though a folder is given twice, prints 8 logs, the models in the form of pass NG, and each agent once, the largest first, with its rounds, replies, cache reads, dollars and share, and exits 0', cli.code === 0 && cli.lines[0] === '8 logs read' && same(cli.lines.slice(1, 5), wantModels) && at === 5 && cli.lines[at] === "Each agent's share of these logs, each reply once at the prices above (times in UTC; a name from the state file " + statePath + ", else the agent's own log, else the Agent call that launched it):" && same(cli.lines.slice(at + 1, at + 1 + wantRows.length), wantRows), cli.out);
    const agentOnly = run('--by-agent', join(dir, 'projects'), join(dir, 'elsewhere'));
    ok("the command line with --by-agent and no state file names each agent from its log and the lead's Agent calls: A by its call's description, its id in the result's words", agentOnly.code === 0 && agentOnly.lines[5] === "Each agent's share of these logs, each reply once at the prices above (times in UTC; a name from the agent's own log, else the Agent call that launched it):" && agentOnly.lines.includes('  eng-made launch words [' + A + ", the lead's log]: Opus 5.5, 3 rounds: 11-23 00:35 (2 replies, $7.20), 01:10 (2 replies, $1.80), 01:40 (2 replies, $0.60), 6 replies, cache reads 4,000,000, about $9.60 at API prices (10.1 percent), in 2 logs"), agentOnly.out);
    const plain = run(join(dir, 'projects'), join(dir, 'elsewhere'));
    ok("the command line with no flag prints the logs and the models alone, as before pass NX, then the sweep's note, and exits 0", plain.code === 0 && plain.lines[0] === '8 logs read' && same(plain.lines.slice(1, 5), wantModels) && !plain.out.includes("Each agent's share") && plain.lines.filter(Boolean).length === 6 && plain.lines[5].startsWith("The week's research sweep (pass NX)"), plain.out);
    const each = run('--by-file', join(dir, 'projects'), join(dir, 'elsewhere'));
    ok('the command line with --by-file lists each log by itself, the copy of A\'s log with the lead\'s reply it carries ($19.60) and a log with a model with no price', each.code === 0 && same(each.lines.slice(5, 13), ['  -home-made/' + S + '.jsonl: Opus 5.5 $30.20', '  subagents/agent-' + A + '.jsonl: Opus 5.5 $19.60', '  subagents/agent-' + A + '.jsonl: Opus 5.5 $9.60', '  subagents/agent-' + C + '.jsonl: Sonnet 5.5 $2.00', '  subagents/agent-' + D + '.jsonl: claude-new-9 no price, Opus 5.5 $3.00', '  subagents/agent-' + E + '.jsonl: Fable 5.2 $10.00', '  subagents/agent-' + F + '.jsonl: ', '  subagents/agent-' + B + '.jsonl: Fable 5.2 $40.00']), each.out);
    const none = run(nolog); const noneNamed = run('--names', statePath, nolog);
    const noLogLine = '0 logs read under ' + nolog + ": no session log there (a cloud session keeps none on disk; its folder holds tool results alone), so each agent's share comes from the lead's table of its notifications (--agents <file>; its form is in this tool's header)";
    ok("a session folder that holds tool results alone reads as no log, the line saying so and naming the lead's table, the sweep's note after it with no word of logs, and exits 0, with --names too, which then prints no agent", none.code === 0 && none.lines[0] === noLogLine && none.lines[1].startsWith("The week's research sweep (pass NX)") && !none.out.includes('The logs read above') && noneNamed.code === 0 && noneNamed.lines[0] === noLogLine && noneNamed.lines[1] === none.lines[1] && !noneNamed.out.includes("Each agent's share"), { none: none.out, noneNamed: noneNamed.out });
    const note = cli.lines[cli.lines.length - 2];
    ok("the sweep's note quotes 2.1.328's entry whole, says a count before it may be high where a reply was retried and low where one was not streamed, and that the logs are not the harness's count", note === "The week's research sweep (pass NX): Claude Code's changelog says 2.1.328 \"" + SWEEP_ENTRY + "\", so a count a notification gave before 2.1.328 may be high where a reply was retried, and low where one was not streamed. The logs read above give each reply's own usage, as written with it and counted once by its id, not the harness's count that entry fixed." && SWEEP_ENTRY === 'Fixed the token counts on the spinner and for subagents counting a retried reply twice, missing replies that were not streamed, and standing still while Claude thinks', note);

    // 4. The lead's table, clean: an agent resumed twice (a round's name, at, model and version with spaces at their ends, its first
    // round's role too), a model by its id and one in other letters, a model whose only agent has no tokens, two Sonnet agents whose
    // sum passes Fable's though Fable has the bigger agent, and versions on each side of 2.1.328.
    const clean = [{ name: 'WR1', role: 'whole read', model: 'Fable 5.2', tokens: 329236, toolUses: 61, minutes: 24.6, at: '2026-11-22 18:20', version: '2.1.330' },
      { name: 'eng-made', role: 'engineer ', model: 'Opus 5.5', tokens: 200000, toolUses: 40, minutes: 30, at: '2026-11-22 18:35', version: '2.1.327' },
      { name: 'sweep', role: 'research sweep', model: 'claude-fable-5-2', tokens: 119991, toolUses: 30, minutes: 12, at: '2026-11-22 18:20' },
      { name: 'eng-made', role: 'engineer', model: 'Opus 5.5 ', tokens: 250000, toolUses: 12, minutes: 10, at: '2026-11-22 19:10', version: '2.1.328' },
      { name: 'chore', role: 'a count', model: 'sonnet 5.5', tokens: 300000, toolUses: 5, minutes: 2, at: '2026-11-22 19:20', version: '2.1.99', note: 'made for the self-test' },
      { name: 'eng-made ', role: 'engineer', model: 'Opus 5.5', tokens: 280000, toolUses: 9, minutes: 8, at: '2026-11-22 19:40 ', version: ' 2.1.329 ' },
      { name: 'stopped-early', role: 'code read', model: 'Haiku 5.5', tokens: 0, toolUses: 0, minutes: 0.1, at: '2026-11-22 19:50', version: '2.1.330' },
      { name: 'chore2', role: 'a count', model: 'Sonnet 5.5', tokens: 200000, toolUses: 4, minutes: 3, at: '2026-11-22 19:55', version: '2.1.330' }];
    const t = readAgentTable(clean); const em = t.agents.find((a) => a.name === 'eng-made');
    ok("a clean table names no problem, and its agent resumed twice is one agent of three rounds, 18:35, 19:10 and 19:40, its tokens their sum (730,000), its tool uses 61 and minutes 48, its role its first round's", t.problems.length === 0 && t.agents.length === 6 && em && em.role === 'engineer' && same(em.rounds.map((x) => [x.at, x.tokens]), [['2026-11-22 18:35', 200000], ['2026-11-22 19:10', 250000], ['2026-11-22 19:40', 280000]]) && em.tokens === 730000 && em.toolUses === 61 && em.minutes === 48, t);
    ok("the table's totals by model, the largest first, and in all: Opus 5.5 730,000 in 1 agent and 3 rounds, Sonnet 5.5 500,000 in 2 (sonnet 5.5 read as it) before Fable 5.2 449,227 in 2 (claude-fable-5-2 read as Fable 5.2) though Fable has the bigger agent, Haiku 5.5 0 in 1, 1,679,227 in 6 agents and 8 rounds", same(t.models, [{ model: 'Opus 5.5', tokens: 730000, agents: 1, rounds: 3 }, { model: 'Sonnet 5.5', tokens: 500000, agents: 2, rounds: 2 }, { model: 'Fable 5.2', tokens: 449227, agents: 2, rounds: 2 }, { model: 'Haiku 5.5', tokens: 0, agents: 1, rounds: 1 }]) && same(t.total, { tokens: 1679227, agents: 6, rounds: 8 }), { models: t.models, total: t.total });
    ok("versions are read part by part as numbers on each side of 2.1.328: 2.1.327 and 2.1.99 before it, 2.1.328, 2.1.329 and 3.0.0 not, 2.0.400 before; the clean table's eight rounds, 2 before, 5 at or after and 1 with none", versionBefore('2.1.327') && versionBefore('2.1.99') && !versionBefore('2.1.328') && !versionBefore('2.1.329') && !versionBefore('3.0.0') && versionBefore('2.0.400') && same(t.versions, { rounds: 8, before: 2, none: 1, after: 5 }), t.versions);
    // A table with every kind of problem, each tripping one rule alone, its clean entries the same eight.
    const base = { name: 'WRx', role: 'whole read', model: 'Fable 5.2', tokens: 9, toolUses: 2, minutes: 3, at: '2026-11-22 21:00' };
    const without = (f, name) => { const e = { ...base, name }; delete e[f]; return e; };
    const bad = [...clean,
      { name: 'made-reader', role: 'code read', model: 'Fable 5.2', tokens: 257258, minutes: 20, at: '2026-11-22 20:00' },
      { name: 'eng-made', role: 'engineer', model: 'Opus 5.5', tokens: 250000, toolUses: 12, minutes: 10, at: '2026-11-22 19:10' },
      { ...base, name: 'WR2', tokens: '273,194' }, { name: 'eng-made', role: 'engineer', model: 'Fable 5.2', tokens: 10, toolUses: 1, minutes: 1, at: '2026-11-22 20:10' },
      { ...base, name: 'WR3', tokns: 5 }, { ...base, name: 'WR4', minutes: -1 }, { ...base, name: '' }, 'WR5 244,352', { ...base, name: 'WR6', version: 'v2.1' },
      { ...base, name: 'WR7', tokens: 1.5 }, { ...base, name: 'WR8', model: '   ' }, without('at', 'WR9'), { ...base, name: 'WR10', toolUses: 2.5 }, { ...base, name: 'WR11', note: 5 },
      without('role', 'WR12'), without('name'), without('tokens', 'WR13'), without('model', 'WR14'), without('minutes', 'WR15'), { ...base, name: 'WR16', role: 7 },
      { ...base, name: 'WR17', at: '' }, { ...base, name: 'WR18', minutes: '3' }, { ...base, name: 'WR19', tokens: -4 }, { ...base, name: 'WR20', toolUses: '2' }, ['an', 'array'],
      { ...base, name: 'WR21', version: ['2.1.330'] }, null];
    const wantProblems = ['entry 9 (made-reader): no toolUses', 'entry 10 (eng-made) repeats entry 4: every required field the same, counted once', 'entry 11 (WR2): tokens is "273,194", not a whole number',
      "entry 12 (eng-made): its model, Fable 5.2, is not its first round's, Opus 5.5 (an agent resumed keeps its model)", 'entry 13 (WR3): a field the form does not have, "tokns"', 'entry 14 (WR4): minutes is -1, not a number of minutes',
      'entry 15: name is "", not words', 'entry 16 is not an object of fields', 'entry 17 (WR6): version is "v2.1", not a version such as 2.1.330', 'entry 18 (WR7): tokens is 1.5, not a whole number', 'entry 19 (WR8): model is "   ", not words',
      'entry 20 (WR9): no at', 'entry 21 (WR10): toolUses is 2.5, not a whole number', 'entry 22 (WR11): note is 5, not words', 'entry 23 (WR12): no role', 'entry 24: no name', 'entry 25 (WR13): no tokens', 'entry 26 (WR14): no model',
      'entry 27 (WR15): no minutes', 'entry 28 (WR16): role is 7, not words', 'entry 29 (WR17): at is "", not words', 'entry 30 (WR18): minutes is "3", not a number of minutes', 'entry 31 (WR19): tokens is -4, not a whole number',
      'entry 32 (WR20): toolUses is "2", not a whole number', 'entry 33 is not an object of fields', 'entry 34 (WR21): version is ["2.1.330"], not a version such as 2.1.330', 'entry 35 is not an object of fields'];
    const tb = readAgentTable(bad);
    ok("a table with a field missing names it (entry 9 (made-reader): no toolUses), and every other problem by its entry, each required field missing and of the wrong kind, the optional ones of the wrong kind, a field the form does not have, a repeated entry counted once, a resumed agent on another model and an entry that is no object, 27 problems in the file's order", same(tb.problems, wantProblems), tb.problems);
    ok("an entry named as a problem is left out of every total: the table's totals are the clean table's", same(tb.total, t.total) && same(tb.models, t.models) && same(tb.agents, t.agents), tb.total);
    ok('a table with no entries is named', same(readAgentTable([]).problems, ['the table holds no entries']));

    // 5. The tables through the command line: the lines, the problems first, the exit codes.
    const cleanPath = join(dir, 'agents clean.json'); writeFileSync(cleanPath, JSON.stringify(clean, null, 1)); const badPath = join(dir, 'agents bad.json'); writeFileSync(badPath, JSON.stringify(bad));
    const tc = run('--agents', cleanPath, nolog); const head = tc.lines.findIndex((l) => l.startsWith("The lead's table"));
    const wantTable = ["The lead's table of the agents' task notifications (" + cleanPath + '):', "6 agents in 8 rounds, 1,679,227 tokens by the harness's own count (each notification's subagent_tokens):",
      "  eng-made (engineer, Opus 5.5): 730,000 tokens, 100.0 percent of the Opus 5.5 agents' tokens and 43.5 percent of all the agents'; 3 rounds: 2026-11-22 18:35 (200,000), 2026-11-22 19:10 (250,000), 2026-11-22 19:40 (280,000); 61 tool uses, 48 minutes",
      "  WR1 (whole read, Fable 5.2): 329,236 tokens, 73.3 percent of the Fable 5.2 agents' tokens and 19.6 percent of all the agents'; 1 round: 2026-11-22 18:20 (329,236); 61 tool uses, 24.6 minutes",
      "  chore (a count, Sonnet 5.5): 300,000 tokens, 60.0 percent of the Sonnet 5.5 agents' tokens and 17.9 percent of all the agents'; 1 round: 2026-11-22 19:20 (300,000); 5 tool uses, 2 minutes",
      "  chore2 (a count, Sonnet 5.5): 200,000 tokens, 40.0 percent of the Sonnet 5.5 agents' tokens and 11.9 percent of all the agents'; 1 round: 2026-11-22 19:55 (200,000); 4 tool uses, 3 minutes",
      "  sweep (research sweep, Fable 5.2): 119,991 tokens, 26.7 percent of the Fable 5.2 agents' tokens and 7.1 percent of all the agents'; 1 round: 2026-11-22 18:20 (119,991); 30 tool uses, 12 minutes",
      "  stopped-early (code read, Haiku 5.5): 0 tokens, 0.0 percent of the Haiku 5.5 agents' tokens and 0.0 percent of all the agents'; 1 round: 2026-11-22 19:50 (0); 0 tool uses, 0.1 minutes",
      'By model:', '  Opus 5.5: 730,000 tokens (43.5 percent), 1 agent in 3 rounds', '  Sonnet 5.5: 500,000 tokens (29.8 percent), 2 agents in 2 rounds', '  Fable 5.2: 449,227 tokens (26.8 percent), 2 agents in 2 rounds', '  Haiku 5.5: 0 tokens (0.0 percent), 1 agent in 1 round',
      "In all: 1,679,227 tokens, 6 agents in 8 rounds. The lead's own work is not counted: no notification reports it, and Mikey's bars at the pass's start and end are its measure.", COUNT_MEANING,
      "The week's research sweep (pass NX): Claude Code's changelog says 2.1.328 \"" + SWEEP_ENTRY + "\", so a count a notification gave before 2.1.328 may be high where a reply was retried, and low where one was not streamed. The table's rounds by the version they name: 2 before 2.1.328, 5 at or after it, 1 with none."];
    ok("the command line with --agents prints the table's agents, each once with its rounds and its shares of its model and of all, the models, the whole with the lead's own work named as not counted, what a notification's count is and the sweep's note with the versions, after the line that reads no log under the folder given alone, and exits 0", tc.code === 0 && tc.lines[0] === noLogLine && head === 1 && same(tc.lines.slice(head, head + wantTable.length), wantTable) && tc.lines.length === head + wantTable.length + 1, tc.out);
    ok("COUNT_MEANING keeps the words of what a notification's count is, as pass NX read it in Claude Code 2.1.330's code: the last reply's prompt and output, not the sum of its replies", /last reply's own usage, each that reply's prompt \(its input, cache writes and cache reads\) and its output, never the sum of its replies/.test(COUNT_MEANING));
    const tbad = run('--agents', badPath, nolog); const bhead = tbad.lines.findIndex((l) => l.startsWith("The lead's table"));
    ok('the command line names every problem of a bad table first, says each is left out, prints the clean totals and exits 1', tbad.code === 1 && bhead === 1 && same(tbad.lines.slice(bhead + 1, bhead + 28), wantProblems.map((p) => 'PROBLEM ' + p)) && tbad.lines[bhead + 28] === '27 problems in the table: each entry named is left out of every total below; mend it and read the table again.' && tbad.out.includes('In all: 1,679,227 tokens, 6 agents in 8 rounds.'), tbad.out);
    const emptyPath = join(dir, 'empty.json'); writeFileSync(emptyPath, '[]'); const objPath = join(dir, 'object.json'); writeFileSync(objPath, '{"name": "WR1"}'); const junkPath = join(dir, 'junk.json'); writeFileSync(junkPath, '[{"name": ');
    const empty = run('--agents', emptyPath, nolog); const obj = run('--agents', objPath, nolog); const junk = run('--agents', junkPath, nolog); const gone = run('--agents', join(dir, 'no such table.json'), nolog);
    const bare = run(nolog, '--agents'); const flagNext = run('--agents', '--by-agent', nolog); const noState = run('--names', join(dir, 'no such state.md'), nolog);
    ok('an empty table exits 1, its problem named; a table that is no array, not JSON or no file, --agents with no file after it or a flag in its place, and --names naming no file each exit 2 with the reason, before any log is read', empty.code === 1 && empty.lines.includes('PROBLEM the table holds no entries') && empty.lines.includes('No entry was counted.')
      && obj.code === 2 && same(obj.lines, ['--agents: ' + objPath + " is not a JSON array of entries (its form is in this tool's header)", '']) && junk.code === 2 && junk.lines.length === 2 && junk.lines[0].startsWith('--agents: ' + junkPath + ' is not JSON (')
      && gone.code === 2 && same(gone.lines, ['--agents: ' + join(dir, 'no such table.json') + ' cannot be read (ENOENT)', '']) && bare.code === 2 && bare.lines[0].startsWith('usage: ') && flagNext.code === 2 && flagNext.lines[0].startsWith('usage: ')
      && noState.code === 2 && same(noState.lines, ['--names: ' + join(dir, 'no such state.md') + ' cannot be read (ENOENT)', '']), { empty: empty.out, obj: obj.out, junk: junk.out, gone: gone.out, bare: bare.out, flagNext: flagNext.out, noState: noState.out });
  } finally { rmSync(dir, { recursive: true, force: true }); }
  console.log(`\n${passed} passed, ${failed} failed`);
  return failed ? 1 : 0;
}

// Run as a tool only when it is the file being run (the house's rule for every tool; a test imports the functions above).
if (process.argv[1] && process.argv[1].endsWith('usage-by-model.mjs')) process.exitCode = main(process.argv.slice(2));
