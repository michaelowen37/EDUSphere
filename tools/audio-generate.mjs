// Makes the app's recorded audio with ElevenLabs (2026-10-04, pass JH). In plain terms: reads docs/AUDIO-LEDGER.csv and, for every
// clip whose file is not in audio/ yet, asks ElevenLabs' Eleven v4 model (model_id eleven_v4) to speak the clip's tagged words,
// then saves audio/<key>.mp3, the name the app already looks for. Each request also carries the plain words just before and after
// the clip (previous_text and next_text), which ElevenLabs uses to keep the delivery steady from one clip to the next. Finished
// clips are skipped, so the run can be stopped and started again at any time.
// Since pass MW (Mikey: "Just be sure to add emphasis tags and descriptions within the audio ledger for Eleven.") the ledger also
// holds the app's own sounds, and this tool asks for each the way its kind needs: a speech sound (kind speech sound) is spoken by the
// young voice from its row's text, its direction, its goal (since pass MX) and its phonetic symbols, with no words before or after it, and a sound effect (kind sound effect, the cheer's
// whistle and crowd, Q82 (a)) is made by ElevenLabs' sound effects (POST /v1/sound-generation, model eleven_text_to_sound_v3, or
// another with --sfx-model, since ElevenLabs says SFX v3 is in limited access) from the row's text, the prompt that describes the
// sound, for its seconds and its influence, never sent to the voice, which would read the prompt aloud; its description column says
// what to listen for and is never sent. Each sound is made in a few takes (the row's takes), saved as audio/takes/<key>-<n>.mp3 for Mikey to pick by ear; the take
// he likes is copied to audio/<key>.mp3, which this tool never writes for a sound itself, and a sound whose file is there is skipped.
// Run: ELEVENLABS_API_KEY=... node tools/audio-generate.mjs --voice <id> [--voice-young <id>] [--model eleven_v4] [--sfx-model eleven_text_to_sound_v3] [--build 1] [--only S95] [--limit 50] [--dry-run] [--no-goals]
//      (--build 1, since pass NJ, makes build 1 alone: every clip pre-K 3 to grade 1 plays, the early build Mikey records first)
//      (--only sounds makes the speech sounds and the sound effects alone; --no-goals, since pass MX, sends a row without the short
//      direction the ledger puts before each speech sound, for a take that still read the direction aloud when made again: delete
//      that take as well, then run with the voices you used before and --only <its key>, since finished clips are skipped and
//      every other row should keep its goals)
// The API key comes only from the environment and is never written to a file.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { SOUND_GOAL_TAGS } from '../src/logic.mjs';

// A row's text without the goals the ledger puts before its sounds (pass MX, Mikey's descriptors for Eleven), for --no-goals: each
// goal tag and the space after it, read from the one list in src/logic.mjs.
export const withoutGoals = (text) => SOUND_GOAL_TAGS.reduce((t, g) => t.split(g + ' ').join(''), String(text));

// The two kinds of row that are sounds rather than spoken words (pass MW).
export const SOUND_KINDS = ['speech sound', 'sound effect'];

// A small reader for the ledger's CSV: quoted fields, doubled quotes inside them, each row read by its header's names.
export function parseCsv(text) {
  const rows = []; let row = []; let field = ''; let q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) { if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; } else if (ch === '"') q = false; else field += ch; }
    else if (ch === '"') q = true; else if (ch === ',') { row.push(field); field = ''; } else if (ch === '\n') { row.push(field); rows.push(row); row = []; field = ''; } else field += ch;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const [head, ...body] = rows; return body.filter((r) => r.length === head.length).map((r) => Object.fromEntries(head.map((h, i) => [h, r[i]])));
}

// The plain words just before and after each clip in its own story or lesson, for previous_text and next_text; a sound has none,
// since it is said alone (pass MW), and no clip borrows a sound's symbols as its neighbor's words.
const plain = (t) => String(t).replace(/\[[^\]]*\]\s*/g, '').replace(/\s+/g, ' ').trim();
export function withNeighbors(rows) {
  return rows.map((r, i) => {
    const near = (o) => o && o.group === r.group && !SOUND_KINDS.includes(o.kind) && !SOUND_KINDS.includes(r.kind);
    return { ...r, previous: near(rows[i - 1]) ? plain(rows[i - 1].text) : '', next: near(rows[i + 1]) ? plain(rows[i + 1].text) : '' };
  });
}

// What one row asks ElevenLabs for (pass MW): the address, the body and how many takes. A sound effect goes to the sound-effects
// endpoint with its text (the sound's prompt), seconds and influence; every other row goes to the voice, a speech sound in the young voice and in
// takes, a clip of words once, with its neighbors' words when it has them (none for eleven_v3, where ElevenLabs says request
// stitching is not available). The rules in plain terms are held by tests/scripts.test.mjs.
export function requestFor(row, { voice, voiceYoung, model = 'eleven_v4', sfxModel = 'eleven_text_to_sound_v3', noGoals = false } = {}) {
  if (row.kind === 'sound effect') {
    return { url: 'https://api.elevenlabs.io/v1/sound-generation', takes: Math.max(1, Number(row.takes) || 1),
      body: { text: row.text, duration_seconds: Number(row.seconds), prompt_influence: Number(row.influence), model_id: sfxModel } };
  }
  const v = row.voice === 'young' ? (voiceYoung || voice) : voice; const stitch = model !== 'eleven_v3';
  const body = { text: noGoals ? withoutGoals(row.text) : row.text, model_id: model, ...(stitch && row.previous ? { previous_text: row.previous } : {}), ...(stitch && row.next ? { next_text: row.next } : {}) };
  return { url: `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(v)}`, takes: row.kind === 'speech sound' ? Math.max(1, Number(row.takes) || 1) : 1, body };
}

// Run only when this is the file being run, so a test can import requestFor without making anything (read by name with endsWith,
// so a folder with a space in its path still works).
if (process.argv[1] && process.argv[1].endsWith('audio-generate.mjs')) {
  const args = process.argv.slice(2); const opt = (name, fallback = null) => { const i = args.indexOf(`--${name}`); return i >= 0 ? (args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true) : fallback; };
  const voice = opt('voice'); const voiceYoung = opt('voice-young', voice); const model = opt('model', 'eleven_v4'); const sfxModel = opt('sfx-model', 'eleven_text_to_sound_v3');
  const only = opt('only'); const limit = Number(opt('limit', 0)) || Infinity; const dry = !!opt('dry-run', false); const noGoals = !!opt('no-goals', false);
  // --build 1 makes build 1 alone, every clip pre-K 3 to grade 1 plays (pass NJ: the early build first, so young learners can try the app);
  // --build 2 the rest. The ledger's last column names each row's build (tools/audio-ledger.mjs).
  const build = opt('build'); if (build !== null && !['1', '2'].includes(String(build))) { console.log('--build takes 1 or 2'); process.exit(2); }
  const key = process.env.ELEVENLABS_API_KEY;
  if (!voice || (!key && !dry)) { console.log('Usage: ELEVENLABS_API_KEY=... node tools/audio-generate.mjs --voice <id> [--voice-young <id>] [--model eleven_v4] [--sfx-model eleven_text_to_sound_v3] [--build 1] [--only S95] [--limit 50] [--dry-run] [--no-goals]'); process.exitCode = 1; }
  else {
    const rows = withNeighbors(parseCsv(readFileSync(new URL('../docs/AUDIO-LEDGER.csv', import.meta.url), 'utf8')));
    const outDir = new URL('../audio/', import.meta.url); if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
    const takesDir = new URL('../audio/takes/', import.meta.url);
    let made = 0; let skipped = 0; let stop = false;
    for (const r of rows) {
      if (stop) break;
      if (only && !(r.key === only || r.key.startsWith(`${only}-`) || r.source === only)) continue;
      if (build !== null && String(r.build) !== String(build)) continue;
      if (existsSync(new URL(`${r.key}.mp3`, outDir))) { skipped++; continue; }
      const req = requestFor(r, { voice, voiceYoung, model, sfxModel, noGoals });
      const names = req.takes > 1 || SOUND_KINDS.includes(r.kind) ? Array.from({ length: req.takes }, (_, k) => `takes/${r.key}-${k + 1}.mp3`) : [`${r.key}.mp3`];
      for (const name of names) {
        const file = new URL(name, outDir);
        if (existsSync(file)) { skipped++; continue; }
        if (made >= limit) { stop = true; break; }
        // A dry run shows a sound's whole request (a sound effect's seconds, influence and model come after its prompt, and since pass
        // MX a speech sound's goal and symbols run past 200 characters), a line with a goal whole too (round two's code read: a lesson
        // line's goals were cut at 200), and any other clip's first 200 characters.
        if (dry) { const shown = JSON.stringify(req.body); const whole = SOUND_KINDS.includes(r.kind) || SOUND_GOAL_TAGS.some((g) => r.text.includes(g)); console.log(r.key + ' -> ' + req.url + ': ' + (whole ? shown : shown.slice(0, 200))); made++; continue; }
        if (name.startsWith('takes/') && !existsSync(takesDir)) mkdirSync(takesDir, { recursive: true });
        const res = await fetch(req.url, { method: 'POST', headers: { 'xi-api-key': key, 'Content-Type': 'application/json', Accept: 'audio/mpeg' }, body: JSON.stringify(req.body) });
        if (!res.ok) { console.log(`Stopped at ${r.key}: ElevenLabs answered ${res.status} ${await res.text()}`); process.exitCode = 1; stop = true; break; }
        writeFileSync(file, Buffer.from(await res.arrayBuffer())); made++;
        console.log(`saved audio/${name}`);
      }
    }
    console.log(`${dry ? 'would make' : 'made'} ${made} clip${made === 1 ? '' : 's'}; ${skipped} already there. A sound's takes are in audio/takes: copy the one you like to audio/<key>.mp3.`);
  }
}
