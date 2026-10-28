// The Wise Human. Copyright (c) 2026. Source-available; not for reuse. See LICENSE.md.
// Every game, at every common screen size, read for words that spill out of their box and centered words pushed off center by an icon
// (pass MR, Mikey: "I never want this to happen anywhere in the app and try to correct every example I find."). In plain terms: it
// opens each of the games in the real test page as an early-years student would, on phones from 320 to 430 pixels wide, a tablet and a
// laptop, lets the board settle, and runs tests/e2e/layout-check.mjs over the whole game page (the header, the board, the Instructions
// link, the speaker and the note under it). With --wide-font every word is drawn in a wider typeface (DejaVu Sans, about a tenth
// wider than the app's own) to find the words that fit only by a hair, since a phone's own font can be wider than the test browser's
// (Mikey's phone spilled sunshine where the tests' font fitted it with 3 pixels to spare), and the run fails unless that typeface is
// really drawn, since a browser that lacks it falls back to another without a word. With --wrong a wrong answer is tapped on every
// board that names its right one, and the board is read again once it shows the tap was wrong (a wobble, or the game's hint line),
// since a hint or a mark can move or spill words too; the games where no wrong tap could be made are listed and do not fail the run.
// Until round two of pass MR the tap went to the first worded button not marked for a demonstration, a mark only demonstrations
// carry, so in play it often tapped the right answer, or nothing, and read the board as if it had been wrong. Every run also plants
// two faults in the first game it opens at each size, a tile's words wider than the tile and a centered row pushed off center by an
// icon, and fails unless the read reports both, so a read that stopped seeing either fault cannot pass quietly. Proven in round two:
// with the read's limits raised past any fault, the run failed on the planted pair (at 320 and 390 pixels); with the wide font named
// as one this machine lacks, it failed on the missing typeface; and the new tap drew a wrong sign in all 30 games whose boards name
// their answer, where the old one drew it in 29, tapped the right answer in ask-speech-3, drew no sign in 35 and tapped nothing in 95.
// Run: node tests/e2e/make-page.mjs && node tools/layout-sweep.mjs [--wide-font] [--wrong] [--sizes=320x568,390x844] [gameId,gameId,...]
import { createRequire } from 'node:module'; import { execSync } from 'node:child_process'; import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const SWEEP_SIZES = [[320, 568, 'phone'], [360, 740, 'phone'], [375, 667, 'phone'], [390, 844, 'phone'], [412, 915, 'phone'], [430, 932, 'phone'], [768, 1024, 'tablet'], [1280, 800, 'laptop']];

// Taps a wrong answer on the open board, found from what the board says is right, and says what it tapped, or why it tapped
// nothing. A board names its answer in a data attribute (data-stat-answer="12", data-grow-need="water", the real reasons in
// data-because-real, the chord's notes in data-chord-notes), and a choice carries its value in data-bin, in its label after a
// colon ("Feeling: calm") or after its first word ("Give water", "Key C#"), or in its words. The right choice must be found among
// the buttons first, and the wrong one is taken from the same row and of the same sort, so a board this cannot read is never
// tapped at a guess: it is listed instead, with the reason. Runs inside the page.
function tapWrong() {
  const box = document.querySelector('[data-game-pad] .edu-game-box'); if (!box) return { why: 'no board' };
  const buttons = [...box.querySelectorAll('button')].filter((b) => !b.disabled && b.getClientRects().length > 0);
  const low = (s) => String(s).replace(/\s+/g, ' ').trim().toLowerCase();
  const aria = (b) => b.getAttribute('aria-label') || '';
  const values = (b) => [b.dataset.bin, aria(b), aria(b).includes(': ') ? aria(b).slice(aria(b).indexOf(': ') + 2) : null, aria(b).includes(' ') ? aria(b).slice(aria(b).indexOf(' ') + 1) : null, b.textContent].filter((v) => v != null && v !== '').map(low);
  const sortOf = (b) => (b.dataset.bin !== undefined ? 'bin' : aria(b).includes(': ') ? aria(b).slice(0, aria(b).indexOf(': ')) : (/^(Give|Key|Word|Answer) /.exec(aria(b)) || ['plain'])[0]);
  const tap = (b, how) => { b.click(); return { tapped: (aria(b) || b.textContent).trim().slice(0, 40), how }; };
  const named = (n) => box.getAttribute(n);
  // A board whose answer is yes or no: its two buttons say the sides in words.
  for (const [n, yes, no] of [['data-argument-valid', 'Valid', 'Not valid'], ['data-reason-supports', 'Supports it', 'Does not'], ['data-sprout-answer', 'Answer: it sprouts', 'Answer: it will not sprout']]) {
    const v = named(n); if (v !== 'yes' && v !== 'no') continue;
    const b = buttons.find((x) => aria(x) === (v === 'yes' ? no : yes));
    return b ? tap(b, `the other side of ${n}`) : { why: `${n} is ${v}, and no button says the other side` };
  }
  // Cut the Fillers: a word that is no filler. Share the Cookies and Shape the Sound: Check before anything is done.
  if (named('data-filler-left')) { const b = buttons.find((x) => x.dataset.filler === 'no'); return b ? tap(b, 'a word that is no filler') : { why: 'no word that is not a filler' }; }
  if (named('data-share-each') || named('data-dynamics-plan')) { const b = buttons.find((x) => /^Check/.test(x.textContent.trim())); return b ? tap(b, 'Check before the board is done') : { why: 'no Check button' }; }
  // Every other board: its right answers, then a choice in their row, of their sort, that is none of them.
  let right = null;
  for (const [n, sep] of [['data-because-real', ' | '], ['data-chord-notes', ' ']]) if (named(n)) right = named(n).split(sep).map(low);
  if (!right) { const a = [...box.attributes].find((x) => /^data-[a-z]+-(answer|need)$/.test(x.name) && x.value); if (a) right = [low(a.value)]; }
  if (!right) return { why: 'its board names no answer' };
  const isRight = (b) => values(b).some((v) => right.includes(v));
  const first = buttons.find(isRight); if (!first) return { why: `no button carries its answer (${right.join(', ')})` };
  let row = first.parentElement; while (row !== box && row.querySelectorAll('button').length < 2) row = row.parentElement;
  const wrongOne = buttons.find((b) => row.contains(b) && sortOf(b) === sortOf(first) && !isRight(b));
  return wrongOne ? tap(wrongOne, 'a choice that is not its answer') : { why: 'every choice beside the answer is right' };
}
// What a wrong tap shows: a wobble in the board, or the game's hint line (Grow the Plant's "Look again: ...", Shape the Sound's
// "Not yet: ..."). A hint line holds every hint its round can give, unseen, to keep its height, so only words that show count.
// Runs inside the page.
function wrongSign() {
  const box = document.querySelector('[data-game-pad] .edu-game-box'); if (!box) return false;
  if (box.querySelector('.edu-wobble, .edu-wobble-chip')) return true;
  const shows = (el) => [el, ...el.querySelectorAll('*')].some((n) => [...n.childNodes].some((c) => c.nodeType === 3 && c.nodeValue.trim()) && getComputedStyle(n).visibility !== 'hidden' && n.getBoundingClientRect().height > 0);
  const hint = box.querySelector('[data-grow-hint]'); if (hint && shows(hint)) return true;
  return [...box.querySelectorAll('p')].some((p) => /^Not yet/.test(p.textContent.trim()) && shows(p));
}
// Whether a typeface is really drawn: words set in it, falling back to monospace, measure wider or narrower than the same words in
// monospace alone, while a typeface the browser lacks falls back without a word and measures the same. Runs inside the page; the
// style is set important on the words themselves, past the wide font's own rule for every element.
function typefaceDrawn(family) {
  const width = (f) => { const s = document.createElement('span'); s.textContent = 'The Wise Human grows sunshine 0123456789'; s.style.setProperty('font-family', f, 'important'); s.style.setProperty('font-size', '20px', 'important'); s.style.position = 'absolute'; s.style.whiteSpace = 'nowrap'; document.body.appendChild(s); const w = s.getBoundingClientRect().width; s.remove(); return w; };
  return Math.abs(width(`${family}, monospace`) - width('monospace')) > 0.5;
}

if (process.argv[1] && process.argv[1].endsWith('layout-sweep.mjs')) {
  const G = execSync('npm root -g').toString().trim(); const { chromium } = createRequire(import.meta.url)(`${G}/playwright`);
  const L = await import('../src/logic.mjs');
  const { LAYOUT_SOURCE } = await import('../tests/e2e/layout-check.mjs');
  const args = process.argv.slice(2);
  const wideFont = args.includes('--wide-font'); const wrong = args.includes('--wrong');
  const sizeArg = args.find((a) => a.startsWith('--sizes='));
  const sizes = sizeArg ? sizeArg.slice(8).split(',').map((s) => { const [w, h] = s.split('x').map(Number); return [w, h, w >= 1000 ? 'laptop' : w >= 700 ? 'tablet' : 'phone']; }) : SWEEP_SIZES;
  const only = args.find((a) => !a.startsWith('--'));
  const games = L.GAMES.filter((g) => !only || only.split(',').includes(g.id));
  const pagePath = fileURLToPath(new URL('../tests/e2e/out/page-phone.html', import.meta.url));
  mkdirSync(fileURLToPath(new URL('../tests/e2e/out/', import.meta.url)), { recursive: true });
  writeFileSync(pagePath, readFileSync(new URL('../tests/e2e/page.html', import.meta.url), 'utf8').replace('<head>', '<head><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">'));
  // The two planted faults, put at the top of the game page, read with the rest of it, and taken out again: a tile whose words
  // run wider than the tile, and words in a centered row pushed off center by an icon beside them (the row question-screens.mjs
  // plants). Both must be reported, at every size.
  const PLANT = `(() => { const pad = document.querySelector('[data-game-pad]'); if (!pad) return null; const host = document.createElement('div');
    host.innerHTML = '<button type="button" style="width:56px;padding:0;white-space:nowrap;font-size:16px">sunshine sunshine</button>'
      + '<h2 style="display:flex;align-items:center;justify-content:center;margin:8px 0 0;font-size:18px">Wonder Questions <button type="button" aria-label="i" style="width:30px;height:30px;padding:0"><svg width="20" height="20"></svg></button></h2>';
    pad.prepend(host); const found = (${LAYOUT_SOURCE})('[data-game-pad]'); host.remove();
    return { spill: found.some((p) => p.kind === 'spill' && p.text === 'sunshine sunshine'), offset: found.some((p) => p.kind === 'offset' && p.text === 'Wonder Questions') }; })()`;
  const browser = await chromium.launch();
  const problems = []; let opened = 0; const noWrongTap = new Map(); let wrongRead = 0;
  for (const [w, h, kind] of sizes) {
    const touch = kind !== 'laptop';
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, screen: touch ? { width: w, height: h } : { width: 1440, height: 900 }, hasTouch: touch, isMobile: touch, reducedMotion: 'reduce' });
    const page = await ctx.newPage(); const errors = []; page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
    if (wideFont) await page.addInitScript(() => { document.addEventListener('DOMContentLoaded', () => { const s = document.createElement('style'); s.textContent = '* { font-family: "DejaVu Sans", sans-serif !important; }'; document.head.appendChild(s); }); });
    const screenIs = (n) => page.waitForFunction((x) => window.__eduTest && window.__eduTest.screen === x, n, { timeout: 20000 });
    const tapIf = async (name) => { const b = page.getByRole('button', { name, exact: true }); if (await b.count()) { await b.first().click(); await page.waitForTimeout(250); } };
    await page.goto(new URL(`file://${pagePath}`).href);
    // The wide font must really be drawn, and the check must tell a missing typeface (one made up here) from a drawn one.
    if (wideFont) {
      const drawn = await page.evaluate(typefaceDrawn, '"DejaVu Sans"'); const madeUp = await page.evaluate(typefaceDrawn, '"No Such Typeface"');
      if (!drawn) problems.push({ size: `${w}x${h}`, game: '-', kind: 'wide font missing', text: 'DejaVu Sans is not drawn here (it measures as monospace), so the wide font never reached a word' });
      if (madeUp) problems.push({ size: `${w}x${h}`, game: '-', kind: 'font check blind', text: 'a made-up typeface measured as drawn, so the check cannot tell a missing font' });
    }
    await page.getByRole('button', { name: 'Create account', exact: true }).first().click(); await screenIs('educator-setup');
    await page.fill('input[placeholder="PIN"]', '2468'); await page.fill('input[placeholder="PIN again"]', '2468'); await page.fill('input[placeholder="This device\'s name"]', 'Sweep'); await page.selectOption('select[aria-label="Your state"]', 'TX');
    await page.getByRole('button', { name: 'Create account', exact: true }).click(); await screenIs('educator-pick'); await page.waitForTimeout(300);
    await tapIf('Skip tour'); await tapIf('Later'); await tapIf('Got it');
    await page.getByRole('button', { name: 'Add someone new' }).first().click(); await page.waitForTimeout(250);
    await page.fill('input[placeholder="School-issued ID"]', `S-${w}`); await page.getByRole('button', { name: /^Early years/ }).first().click(); await page.waitForTimeout(150);
    await page.getByRole('button', { name: 'Add', exact: true }).click(); await page.waitForTimeout(300); await tapIf('Later');
    await page.getByRole('button', { name: 'Home' }).first().click(); await page.waitForTimeout(300);
    await page.getByRole('button', { name: new RegExp(`S-${w}$`) }).first().click(); await page.waitForTimeout(700); await tapIf('Later');
    for (const g of games) {
      await page.evaluate((id) => window.__eduTest.openColoring('play:' + id), g.id); await page.waitForTimeout(650);
      // A moving game opens behind Begin; pressing it lets the board show, as a child sees it.
      await page.evaluate(() => { const b = document.querySelector('[data-begin-cover] button'); if (b) b.click(); }); await page.waitForTimeout(250);
      const found = await page.evaluate(`(${LAYOUT_SOURCE})('[data-game-pad]')`);
      for (const p of found) problems.push({ size: `${w}x${h}`, game: g.id, state: 'rest', ...p });
      if (g === games[0]) {
        const planted = await page.evaluate(PLANT);
        if (!planted || !planted.spill || !planted.offset) problems.push({ size: `${w}x${h}`, game: g.id, kind: 'planted fault missed', text: `the read did not report ${!planted ? 'either planted fault (no game page)' : [!planted.spill && "the tile's spilled words", !planted.offset && 'the off-center row'].filter(Boolean).join(' or ')}` });
        else console.log(`PLANTED ${g.id} at ${w}x${h}: the read reported the tile's spilled words and the off-center row`);
      }
      if (wrong) {
        // Hold It in Mind shows its words first and names its answer only once they hide, so an empty answer is waited for.
        await page.waitForFunction(() => { const box = document.querySelector('[data-game-pad] .edu-game-box'); return !box || ![...box.attributes].some((a) => /^data-[a-z]+-answer$/.test(a.name) && !a.value); }, null, { timeout: 6000 }).catch(() => {});
        const before = await page.evaluate(wrongSign);
        const pick = before ? { why: 'it showed a wrong sign before any tap' } : await page.evaluate(tapWrong);
        const shown = pick.tapped ? await page.waitForFunction(wrongSign, null, { timeout: 2000 }).then(() => true).catch(() => false) : false;
        if (shown) {
          wrongRead += 1;
          const after = await page.evaluate(`(${LAYOUT_SOURCE})('[data-game-pad]')`);
          for (const p of after) problems.push({ size: `${w}x${h}`, game: g.id, state: 'after a wrong tap', ...p });
        } else {
          const why = pick.tapped ? `tapped "${pick.tapped}" (${pick.how}), and no wrong sign showed` : pick.why;
          const list = noWrongTap.get(why) || new Set(); list.add(g.id); noWrongTap.set(why, list);
        }
      }
      opened += 1;
      const close = page.getByRole('button', { name: 'Close game' }); if (await close.count()) { await close.first().click({ force: true }); await page.waitForTimeout(250); }
    }
    if (errors.length) problems.push({ size: `${w}x${h}`, game: '-', kind: 'page error', text: errors.join(' | ').slice(0, 300) });
    await ctx.close();
  }
  await browser.close();
  // One line per problem, grouped so a repeat at many sizes reads once with its sizes.
  const grouped = new Map();
  for (const p of problems) { const key = `${p.game} | ${p.state || ''} | ${p.kind} | ${p.text} | ${p.box || p.row || ''}`; const g = grouped.get(key) || { ...p, sizes: [] }; g.sizes.push(`${p.size}${p.by !== undefined ? ` (${p.by})` : ''}`); grouped.set(key, g); }
  for (const g of grouped.values()) console.log(`${g.kind.toUpperCase()} ${g.game}${g.state && g.state !== 'rest' ? ` [${g.state}]` : ''}: "${g.text}"${g.box || g.row ? ` in ${g.box || g.row}` : ''} at ${g.sizes.join(', ')}`);
  // The games where no wrong tap could be made, by reason: listed so they can be read, never a failure.
  for (const [why, ids] of noWrongTap) console.log(`NO WRONG TAP (not a failure), ${ids.size} ${ids.size === 1 ? 'game' : 'games'}: ${why}: ${[...ids].join(', ')}`);
  console.log(`\n${games.length} games at ${sizes.length} sizes (${opened} opened${wideFont ? ', wide font' : ''}${wrong ? `, ${wrongRead} read after a wrong tap` : ''}): ${grouped.size} problems`);
  // A problem (a planted fault missed and a missing wide font among them), or a game that never opened, fails the run, so check.sh
  // can read the exit as well as the line.
  process.exitCode = grouped.size || opened < games.length * sizes.length ? 1 : 0;
}
