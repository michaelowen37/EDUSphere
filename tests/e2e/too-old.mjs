// The Wise Human. Copyright (c) 2026. Source-available; not for reuse. See LICENSE.md.
// A browser too old for the app (Q92, Mikey's answer in pass NG: "Q92 - B"; EARMARKS A113; tools/too-old.mjs). In plain terms: on a
// browser that cannot run the app, the page shows a plain note where the Loading word was, and on one that can, nothing changes. This
// holds four things:
//   1. The note's script and the start's guard are written in the oldest JavaScript there is (ES5: no arrow function, let or const,
//      template string, class, spread, destructuring, for of, default value, shorthand, async or ?. and ??), read by TypeScript's own
//      parser, so the browsers the note is for can run them; three near misses (an arrow, a const, a template string) caught.
//   2. The built page (index.html) carries both scripts word for word, the note's first and the start last.
//   3. The page uses nothing newer than the browsers the note and the README name read (Safari 16.4 and iOS 16.4, Chrome and Edge 80,
//      Firefox 78; caniuse.com, read in pass NG): each script of the page is parsed whole, and a call to a newer built-in (Array's at,
//      Object.hasOwn, structuredClone, replaceAll, and the rest below, each with the first versions that read it) or a newer piece of
//      syntax (??=, ||=, &&=, a class's # names or static block) or a regular expression's d or v flag fails; three near misses caught.
//   4. In a real browser: the page as built starts the app and shows no note; with its app script unreadable (a syntax error, as an
//      old browser meets the app's lookbehind) or with an earlier script unreadable too (as a browser older still meets async functions),
//      the note shows the three too-old lines in place of the Loading word, where a screen reader reads it; with the app's script read
//      but the app stopping before its first screen, the note that it could not start shows instead. Since round one's code read (pass
//      NG) the stops are planted inside the app itself, where the app's crash guard catches them, as well as outside it: in its first
//      drawing, in a layout effect and an effect as it starts, and in its first screen past Loading, so the check follows the path the
//      app really takes (until then the only stop planted swapped the whole app for one that throws, outside the guard, and a stop in
//      the app's own screens showed the guard's Go home, not the note). Once the app has shown a screen, a later stop shows the crash
//      guard's screen and no note, and a call to the note does nothing. The note's words read 4.5 to 1. Near misses, each caught: a
//      start with no guard leaves the Loading word, and a crash guard with no early path shows its Go home where the note belongs.
//      Since round two's code read (pass NG): a stop in an effect of the first screen that runs after the one that marks the app shown
//      still shows the note (the mark waits for the next task; set at once, planted, Go home shows, caught); a refresh that restores a
//      remembered screen which stops shows the note once and erases the note of where the student was, so the reload the note asks for
//      starts the app at the front door (the erase taken out, planted, the note shows again on the reload, caught); once the app has
//      shown a screen a call to the note does nothing even with the root emptied (the note's own wait on the app's word taken out,
//      planted, caught); and a page with no note's script keeps the crash guard's Go home for an early stop.
// Run: ./build.sh && node tests/e2e/too-old.mjs
import { createRequire } from 'node:module'; import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs'; import { tmpdir } from 'node:os'; import { join } from 'node:path'; import { pathToFileURL } from 'node:url';
const G = execSync('npm root -g').toString().trim(); const req = createRequire(import.meta.url);
const { chromium } = req(`${G}/playwright`); const ts = req(`${G}/typescript`);
const { TOO_OLD_LINES, STOPPED_LINES, TOO_OLD_SCRIPT, START_SCRIPT } = await import('../../tools/too-old.mjs');
let passed = 0, failed = 0;
const ok = (name, cond, info) => { if (cond) { passed++; console.log('PASS - ' + name); } else { failed++; console.log('FAIL - ' + name + (info !== undefined ? '  ' + JSON.stringify(info).slice(0, 600) : '')); } };

// 1. ES5 only: every node a browser from before 2015 could not read is named.
const newerThanEs5 = (code) => {
  const sf = ts.createSourceFile('x.js', code, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS); const found = [];
  const K = ts.SyntaxKind;
  const visit = (n) => {
    if (n.kind === K.ArrowFunction) found.push('arrow function');
    if (n.kind === K.TemplateExpression || n.kind === K.NoSubstitutionTemplateLiteral || n.kind === K.TaggedTemplateExpression) found.push('template string');
    if (ts.isVariableDeclarationList(n) && (n.flags & (ts.NodeFlags.Let | ts.NodeFlags.Const))) found.push('let or const');
    if (n.kind === K.ClassDeclaration || n.kind === K.ClassExpression) found.push('class');
    if (n.kind === K.SpreadElement || n.kind === K.SpreadAssignment) found.push('spread');
    if (n.kind === K.ObjectBindingPattern || n.kind === K.ArrayBindingPattern) found.push('destructuring');
    if (n.kind === K.ForOfStatement) found.push('for of');
    if (ts.isParameter(n) && (n.initializer || n.dotDotDotToken)) found.push('default or rest parameter');
    if (n.kind === K.ShorthandPropertyAssignment || (n.kind === K.MethodDeclaration && n.parent && n.parent.kind === K.ObjectLiteralExpression)) found.push('shorthand');
    if (n.kind === K.ComputedPropertyName) found.push('computed name');
    if (n.kind === K.QuestionDotToken || n.kind === K.QuestionQuestionToken) found.push('?. or ??');
    if (n.kind === K.AsyncKeyword || n.kind === K.AwaitExpression || n.kind === K.YieldExpression) found.push('async, await or yield');
    ts.forEachChild(n, visit);
  };
  visit(sf); if (sf.parseDiagnostics && sf.parseDiagnostics.length) found.push('does not parse');
  return [...new Set(found)];
};
for (const [name, code] of [['the note\'s script', TOO_OLD_SCRIPT], ['the start\'s guard', START_SCRIPT]]) ok(`${name} is written in ES5 alone, so the oldest browsers run it`, newerThanEs5(code).length === 0, newerThanEs5(code));
{ const plants = [TOO_OLD_SCRIPT.replace('function () {', '() => {'), TOO_OLD_SCRIPT.replace('var shown', 'const shown'), TOO_OLD_SCRIPT.replace("'data-too-old'", "`data-too-old`")].map((c) => newerThanEs5(c));
  ok('near misses: the note\'s script with an arrow function, a const or a template string is caught', plants[0].includes('arrow function') && plants[1].includes('let or const') && plants[2].includes('template string'), plants); }

// 2. The built page carries both scripts word for word: the note's first of all the page's scripts, the start's last.
const page = readFileSync('index.html', 'utf8');
const scripts = [...page.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
ok('index.html runs the note\'s script before any other and the guarded start last, word for word', scripts.length >= 3 && scripts[0] === TOO_OLD_SCRIPT && scripts[scripts.length - 1] === START_SCRIPT && page.indexOf(TOO_OLD_SCRIPT) > page.indexOf('id="edu-boot"'), scripts.length);

// 3. Nothing newer than Safari 16.4, Chrome and Edge 80 and Firefox 78 read. Each built-in with the first versions that read it
//    (Chrome, Firefox, Safari), all past at least one of those (caniuse.com and MDN's compatibility tables).
const NEWER_CALLS = { at: 'Chrome 92, Firefox 90, Safari 15.4', hasOwn: 'Chrome 93, Firefox 92, Safari 15.4', structuredClone: 'Chrome 98, Firefox 94, Safari 15.4',
  findLast: 'Chrome 97, Firefox 104, Safari 15.4', findLastIndex: 'Chrome 97, Firefox 104, Safari 15.4', toSorted: 'Chrome 110, Firefox 115, Safari 16', toReversed: 'Chrome 110, Firefox 115, Safari 16',
  toSpliced: 'Chrome 110, Firefox 115, Safari 16', groupBy: 'Chrome 117, Firefox 119, Safari 17.4', withResolvers: 'Chrome 119, Firefox 121, Safari 17.4', fromAsync: 'Chrome 121, Firefox 115, Safari 16.4',
  replaceAll: 'Chrome 85, Firefox 77, Safari 13.1', randomUUID: 'Chrome 92, Firefox 95, Safari 15.4', isWellFormed: 'Chrome 111, Firefox 119, Safari 16.4', toWellFormed: 'Chrome 111, Firefox 119, Safari 16.4',
  union: 'Chrome 122, Firefox 127, Safari 17', intersection: 'Chrome 122, Firefox 127, Safari 17', symmetricDifference: 'Chrome 122, Firefox 127, Safari 17', isSubsetOf: 'Chrome 122, Firefox 127, Safari 17',
  isSupersetOf: 'Chrome 122, Firefox 127, Safari 17', isDisjointFrom: 'Chrome 122, Firefox 127, Safari 17' };
const NEWER_GLOBALS = { structuredClone: NEWER_CALLS.structuredClone, WeakRef: 'Chrome 84, Firefox 79, Safari 14.1', FinalizationRegistry: 'Chrome 84, Firefox 79, Safari 14.1', AggregateError: 'Chrome 85, Firefox 79, Safari 14' };
const NEWER_PROMISE = { any: 'Chrome 85, Firefox 79, Safari 14' };
const NEWER_INTL = { Segmenter: 'Chrome 87, Firefox 125, Safari 14.1', DurationFormat: 'Chrome 129, Firefox 136, Safari 16.4' };
const own = (table, k) => Object.prototype.hasOwnProperty.call(table, k);   // an own key only (toString and hasOwnProperty are Object's own)
const newerFeatures = (code) => {
  const sf = ts.createSourceFile('page.js', code, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS); const found = new Map(); const K = ts.SyntaxKind;
  const note = (what, why) => found.set(what, (found.get(what) || 0) + 1);
  const visit = (n) => {
    if (ts.isCallExpression(n) && ts.isPropertyAccessExpression(n.expression)) { const name = n.expression.name.text; const on = n.expression.expression.getText ? n.expression.expression.getText() : '';
      if (own(NEWER_CALLS, name)) note(`${on.length < 40 ? on : '…'}.${name}()`, NEWER_CALLS[name]);
      if (on === 'Promise' && own(NEWER_PROMISE, name)) note(`Promise.${name}()`, NEWER_PROMISE[name]); }
    if ((ts.isCallExpression(n) || ts.isNewExpression(n)) && ts.isIdentifier(n.expression) && own(NEWER_GLOBALS, n.expression.text)) note(n.expression.text, NEWER_GLOBALS[n.expression.text]);
    if (ts.isNewExpression(n) && ts.isPropertyAccessExpression(n.expression) && n.expression.expression.getText() === 'Intl' && own(NEWER_INTL, n.expression.name.text)) note(`Intl.${n.expression.name.text}`, NEWER_INTL[n.expression.name.text]);
    if (n.kind === K.QuestionQuestionEqualsToken || n.kind === K.BarBarEqualsToken || n.kind === K.AmpersandAmpersandEqualsToken) note('??=, ||= or &&=', 'Chrome 85, Firefox 79, Safari 14');
    if (n.kind === K.PrivateIdentifier) note("a class's # name", 'Chrome 74 to 91, Firefox 90, Safari 14.1 to 15');
    if (n.kind === K.ClassStaticBlockDeclaration) note("a class's static block", 'Chrome 94, Firefox 93, Safari 16.4');
    if (n.kind === K.RegularExpressionLiteral) { const flags = (/\/([a-z]*)$/.exec(n.text) || [])[1] || ''; if (/[dv]/.test(flags)) note(`a regular expression's ${flags.replace(/[^dv]/g, '')} flag`, 'd: Chrome 90, Firefox 88, Safari 15; v: Chrome 112, Firefox 116, Safari 17'); }
    ts.forEachChild(n, visit);
  };
  visit(sf); return [...found.entries()].map(([k, v]) => `${k} x${v}`);
};
const pageCode = scripts.join('\n;\n');
const real = newerFeatures(pageCode);
ok('the page uses no built-in, syntax or regular expression flag newer than Safari 16.4, Chrome and Edge 80 and Firefox 78 read', real.length === 0, real);
{ const plants = ['[1, 2].at(-1);', 'Object.hasOwn({}, "a");', 'var r = /a/v;'].map((extra) => newerFeatures(scripts[0] + '\n' + extra));
  ok("near misses: Array's at, Object.hasOwn and a regular expression's v flag, each planted, are caught", plants.every((p) => p.length === 1), plants); }

// 4. In a real browser. Each variant of the page is written to a folder of its own and opened as a family would open the file.
const dir = mkdtempSync(join(tmpdir(), 'edu-too-old-'));
const appScript = scripts.find((s) => s.includes('__def("app"')) || '';
const storageScript = scripts.find((s) => s.includes('window.storage = {')) || '';
const variant = (name, html) => { const f = join(dir, `${name}.html`); writeFileSync(f, html); return pathToFileURL(f).href; };
// One exact swap, its new text taken as it is: String's replace reads $& and $' in a new text as patterns, and the page's code is
// full of $, so a plain replace pasted pieces of the page into its own app script. Each swap must find its text once.
const swap = (text, from, to) => { const at = text.indexOf(from); if (at < 0 || text.indexOf(from, at + 1) >= 0) throw new Error(`swap: ${from.slice(0, 40)} found ${at < 0 ? 'nowhere' : 'twice'}`); return text.slice(0, at) + to + text.slice(at + from.length); };
const brokenApp = swap(appScript, '__def("app"', '__def(@@ "app"');
// The places a stop is planted inside the app (the compiled src/ui.jsx): its screens' first line, the line that makes its screen state
// (a stop once that state leaves Loading is a stop in the first screen past it), and the crash guard's early path.
const SCREENS = 'function EduSphereScreens() {'; const SCREEN_STATE = "const [screen, setScreen] = (0, react_1.useState)('loading');";
const firstScreenStops = swap(page, SCREEN_STATE, `${SCREEN_STATE} if (screen !== 'loading') throw new Error('planted: the first screen stops');`);
// Since round two's code read: an effect of the first screen that runs after the app's mark (placed before the state line that follows
// the mark's effect), a remembered overview that stops, the note's script without its wait on the app's word, and no note's script.
const NAME_STATE = "const [nameInput, setNameInput] = (0, react_1.useState)('');";
const laterEffect = swap(page, NAME_STATE, `(0, react_1.useEffect)(() => { if (screen !== 'loading') throw new Error('planted: a later effect stops'); }, [screen]); ${NAME_STATE}`);
const overviewStops = swap(page, SCREEN_STATE, `${SCREEN_STATE} if (screen === 'overview') throw new Error('planted: the remembered overview stops');`);
const ERASE = "if (this.state.early) {\n            saveWhere(null);\n";
const variants = {
  asBuilt: variant('as-built', page),
  appUnreadable: variant('app-unreadable', swap(page, appScript, brokenApp)),
  allUnreadable: variant('all-unreadable', swap(swap(page, appScript, brokenApp), storageScript, swap(storageScript, 'get: async function', 'get: async @@ function'))),
  outsideGuard: variant('outside-guard', swap(page, START_SCRIPT, swap(START_SCRIPT, "var App = require('app').default;", "var App = function () { throw new Error('planted: the app stops outside its guard'); };"))),
  drawing: variant('drawing', swap(page, SCREENS, `${SCREENS} throw new Error('planted: the app stops drawing');`)),
  layoutEffect: variant('layout-effect', swap(page, SCREENS, `${SCREENS} react_1.default.useLayoutEffect(() => { throw new Error('planted: a layout effect stops'); }, []);`)),
  effect: variant('effect', swap(page, SCREENS, `${SCREENS} (0, react_1.useEffect)(() => { throw new Error('planted: an effect stops'); }, []);`)),
  firstScreen: variant('first-screen', firstScreenStops),
  noGuard: variant('no-guard', swap(swap(page, appScript, brokenApp), START_SCRIPT, "\nvar React = require('react'); var App = require('app').default;\nrequire('react-dom/client').createRoot(document.getElementById('root')).render(React.createElement(App));\n")),
  noEarlyPath: variant('no-early-path', swap(firstScreenStops, 'early: !appShown &&', 'early: false &&')),
  laterEffect: variant('later-effect', laterEffect),
  markAtOnce: variant('mark-at-once', swap(laterEffect, 'let live = true;\n        let line = null;\n', 'let live = true; appShown = true; window.__eduAppShown = true;\n        let line = null;\n')),
  overviewStops: variant('overview-stops', overviewStops),
  noErase: variant('no-erase', swap(overviewStops, ERASE, 'if (this.state.early) {\n')),
  noWait: variant('no-wait', swap(page, TOO_OLD_SCRIPT, swap(TOO_OLD_SCRIPT, 'if (shown || window.__eduAppShown || !boot', 'if (shown || !boot'))),
  noNoteScript: variant('no-note-script', swap(firstScreenStops, `<script>${TOO_OLD_SCRIPT}</script>`, '')),
};
const browser = await chromium.launch();
const read = async (url, wait = 4000) => {
  const p = await browser.newPage({ viewport: { width: 390, height: 844 } }); const errors = []; const logged = [];
  p.on('pageerror', (e) => errors.push(String(e).slice(0, 160))); p.on('console', (m) => { if (m.type() === 'error') logged.push(m.text().slice(0, 200)); });
  await p.goto(url); await p.waitForTimeout(wait);
  const r = await p.evaluate(() => { const boot = document.getElementById('edu-boot'); const note = document.querySelector('[data-too-old]'); const cs = boot ? getComputedStyle(boot) : null;
    return { rootFilled: !!document.getElementById('root').firstChild, note: note ? [...note.querySelectorAll('p')].map((x) => x.textContent) : null, kind: note ? note.getAttribute('data-too-old') : null,
      role: note ? note.getAttribute('role') : null, hidden: boot ? boot.getAttribute('aria-hidden') : null, bootShown: !!cs && cs.display !== 'none', loading: !!document.querySelector('.edu-boot-word'),
      guard: (document.getElementById('root').textContent || '').includes('Something went wrong on this page'), shownFlag: window.__eduAppShown === true }; });
  return { p, r, errors, logged };
};
const noteShown = (r, lines, kind) => !r.rootFilled && JSON.stringify(r.note) === JSON.stringify(lines) && r.kind === kind && r.role === 'alert' && r.hidden === null && r.bootShown && !r.loading;
{ const { p, r } = await read(variants.asBuilt, 9000);
  ok('as built, the app starts, says it has shown a screen, and no note shows', r.rootFilled && r.note === null && !r.bootShown && r.shownFlag, r);
  const said = await p.evaluate(() => window.__eduCannotStart && window.__eduCannotStart('stopped')); const after = await p.evaluate(() => !!document.querySelector('[data-too-old]'));
  ok('once the app has shown a screen, a call to the note does nothing', said === false && !after, { said, after });
  await p.evaluate(() => window.__eduTest.crash()); await p.waitForTimeout(600);
  const later = await p.evaluate(() => ({ guard: (document.getElementById('root').textContent || '').includes('Something went wrong on this page'), note: !!document.querySelector('[data-too-old]') }));
  ok("a later stop in the app's screens shows the crash guard's Go home and no note", later.guard && !later.note, later); await p.close(); }
for (const [name, label] of [['appUnreadable', 'with the app\'s script unreadable, as an old browser meets its lookbehind'], ['allUnreadable', 'with an earlier script unreadable too, as a browser older still meets async functions']]) {
  const { p, r, errors } = await read(variants[name]);
  ok(`${label}, the note shows the three too-old lines in place of the Loading word, where a screen reader reads it`, noteShown(r, TOO_OLD_LINES, 'old'), { r, errors });
  await p.close();
}
for (const [name, label, said] of [['outsideGuard', 'with the app stopping outside its crash guard', /planted: the app stops outside its guard/], ['drawing', 'with the app stopping in its first drawing', /planted: the app stops drawing/],
  ['layoutEffect', 'with a layout effect stopping as the app starts', /planted: a layout effect stops/], ['effect', 'with an effect stopping as the app starts', /planted: an effect stops/],
  ['firstScreen', 'with the app stopping in its first screen past Loading', /planted: the first screen stops/]]) {
  const { p, r, errors, logged } = await read(variants[name], name === 'firstScreen' ? 6000 : 4000);
  ok(`${label}, its script read, the note that it could not start shows in place of the Loading word, where a screen reader reads it`, noteShown(r, STOPPED_LINES, 'stopped') && !r.guard, { r, errors, logged });
  ok(`${label}, the stop is still reported`, [...errors, ...logged].some((e) => said.test(e)), { errors, logged });
  await p.close();
}
{ const { p, r } = await read(variants.noGuard);
  ok('near miss: a start with no guard, planted, leaves the Loading word and no note, and is caught', r.note === null && r.loading && !r.rootFilled, r); await p.close(); }
{ const { p, r } = await read(variants.noEarlyPath, 6000);
  ok("near miss: a crash guard with no early path shows its Go home where the note belongs, and is caught", !noteShown(r, STOPPED_LINES, 'stopped') && r.guard && r.note === null, r); await p.close(); }
// Since round two's code read.
{ const { p, r, errors, logged } = await read(variants.laterEffect, 6000);
  ok("with an effect of the first screen stopping after the app's own mark, the note that it could not start shows, since the mark waits for the next task", noteShown(r, STOPPED_LINES, 'stopped') && !r.guard && [...errors, ...logged].some((e) => /planted: a later effect stops/.test(e)), { r, errors, logged }); await p.close(); }
{ const { p, r } = await read(variants.markAtOnce, 6000);
  ok('near miss: the mark set at once, the same stop shows Go home where the note belongs, and is caught', r.guard && r.note === null, r); await p.close(); }
// A refresh onto a remembered screen that stops: a learner and a note of where they were seeded as the app keeps them, then two loads.
const remembered = async (url) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } }); const p = await ctx.newPage();
  await p.goto(variants.asBuilt); await p.waitForTimeout(5000);
  await p.evaluate(() => { const rec = { version: 1, name: 'T1', createdAt: new Date().toISOString(), events: [{ type: 'courses_enabled', at: new Date().toISOString(), courseIds: [] }] };
    localStorage.setItem('edusphere_v1_learner_t1', JSON.stringify(rec)); localStorage.setItem('edusphere_v1_where', JSON.stringify({ name: 'T1', screen: 'overview', moduleId: null })); });
  const load = async () => { await p.goto(url); await p.waitForTimeout(6000);
    return p.evaluate(() => ({ note: (document.querySelector('[data-too-old]') || {}).getAttribute ? document.querySelector('[data-too-old]').getAttribute('data-too-old') : null,
      rootFilled: !!document.getElementById('root').firstChild, guard: (document.getElementById('root').textContent || '').includes('Something went wrong'), where: localStorage.getItem('edusphere_v1_where') })); };
  const first = await load(); const second = await load(); await ctx.close(); return { first, second }; };
{ const { first, second } = await remembered(variants.overviewStops);
  ok('a refresh onto a remembered overview that stops shows the note that it could not start once and erases the note of where the student was, and the reload it asks for starts the app at the front door', first.note === 'stopped' && !first.rootFilled && first.where === null && second.note === null && second.rootFilled && !second.guard, { first, second }); }
{ const { first, second } = await remembered(variants.noErase);
  ok('near miss: with the erase taken out, the reload restores the overview and shows the note again, and is caught', first.note === 'stopped' && second.note === 'stopped', { first, second }); }
// Once the app has shown a screen, the note waits on the app's own word, not on the root alone.
const emptied = async (url) => { const { p } = await read(url, 7000); const r = await p.evaluate(() => { const root = document.getElementById('root'); while (root.firstChild) root.removeChild(root.firstChild);
  const said = window.__eduCannotStart('stopped'); return { said, note: !!document.querySelector('[data-too-old]') }; }); await p.close(); return r; };
{ const r = await emptied(variants.asBuilt); ok("once the app has shown a screen, a call to the note does nothing even with the root emptied", r.said === false && !r.note, r); }
{ const r = await emptied(variants.noWait); ok("near miss: the note's script without its wait on the app's word shows the note there, and is caught", r.said === true && r.note, r); }
{ const { p, r } = await read(variants.noNoteScript, 6000);
  ok("a page with no note's script keeps the crash guard's Go home for a stop before the first screen", r.guard && r.note === null, r); await p.close(); }
// Since round two's screen read, and swept since the third read: no paragraph of either note ends on one word alone at any width from
// 320 to 1280 pixels, read every 4 pixels on one page resized ("Safari." stood alone on the too-old note from 360 to 1280 at six widths
// a sample of eleven held, and the other note's "browser." from 468 to 568 and its "Safari." at 344 to 356, 432 to 444 and 636 to 640,
// which the sample missed). Near misses, each caught: each note with its held words written with plain spaces shows a lone word somewhere.
const loneWords = async (url) => { const p = await browser.newPage({ viewport: { width: 320, height: 900 } }); await p.goto(url); await p.waitForTimeout(2500); const found = [];
  for (let w = 320; w <= 1280; w += 4) { await p.setViewportSize({ width: w, height: 900 });
    const alone = await p.evaluate(() => [...document.querySelectorAll('[data-too-old] p')].map((el) => { const t = el.firstChild; if (!t) return null; const words = []; const re = /\S+/g; let m;
      while ((m = re.exec(t.textContent))) { const rg = document.createRange(); rg.setStart(t, m.index); rg.setEnd(t, m.index + m[0].length); words.push({ w: m[0], top: Math.round(rg.getClientRects()[0].top) }); }
      const last = words[words.length - 1]; const onLast = words.filter((x) => Math.abs(x.top - last.top) < 3); return onLast.length < 2 ? last.w : null; }).filter(Boolean));
    if (alone.length) found.push({ w, alone }); }
  await p.close(); return found; };
const plainHolds = (html) => { const nb = ' '; let out = html; for (const held of [`or${nb}Safari.`, `this${nb}browser.`]) out = out.split(held).join(held.replace(nb, ' ')); return out; };
{ const lone = { old: await loneWords(variants.appUnreadable), stopped: await loneWords(variants.drawing) };
  ok("no paragraph of either note ends on one word alone at any width from 320 to 1280 pixels, read every 4 pixels", lone.old.length === 0 && lone.stopped.length === 0, lone);
  const plainOld = await loneWords(variant('plain-old', plainHolds(swap(page, appScript, brokenApp))));
  const plainStopped = await loneWords(variant('plain-stopped', plainHolds(swap(page, SCREENS, `${SCREENS} throw new Error('planted: the app stops drawing');`))));
  ok("near misses: each note with its held words written with plain spaces leaves a word alone at some width, and is caught", plainOld.length > 0 && plainStopped.length > 0, { plainOld: plainOld.slice(0, 2), plainStopped: plainStopped.slice(0, 2) }); }
// Since the third read: a remembered overview that stops after the app has shown it brings Go home back to it once, and the second Go
// home goes to the front door (the note of where the student was erased), where until then every Go home restored it and stopped again;
// the erase taken out, planted, Go home restores the overview again, caught. And the guard's own screen where the note's function returns
// false (the note not shown), as on a page whose note has already shown.
const LATE = "(0, react_1.useEffect)(() => { if (screen === 'overview') { const t = setTimeout(() => setBoom(true), 600); return () => clearTimeout(t); } }, [screen]); ";
const lateOverview = swap(page, NAME_STATE, `${LATE}${NAME_STATE}`);
const goHome = async (url) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } }); const p = await ctx.newPage();
  await p.goto(variants.asBuilt); await p.waitForTimeout(5000);
  await p.evaluate(() => { const rec = { version: 1, name: 'T1', createdAt: new Date().toISOString(), events: [{ type: 'courses_enabled', at: new Date().toISOString(), courseIds: [] }] };
    localStorage.setItem('edusphere_v1_learner_t1', JSON.stringify(rec)); localStorage.setItem('edusphere_v1_where', JSON.stringify({ name: 'T1', screen: 'overview', moduleId: null })); });
  await p.goto(url); await p.waitForTimeout(6000);
  const seen = [];
  for (let k = 0; k < 2; k++) { const guard = await p.evaluate(() => (document.getElementById('root').textContent || '').includes('Something went wrong'));
    seen.push(guard); if (!guard) break; await p.getByRole('button', { name: 'Go home', exact: true }).click(); await p.waitForTimeout(3000); }
  const end = await p.evaluate(() => ({ screen: window.__eduTest ? window.__eduTest.screen : null, guard: (document.getElementById('root').textContent || '').includes('Something went wrong'), where: localStorage.getItem('edusphere_v1_where') }));
  await ctx.close(); return { seen, end }; };
{ const r = await goHome(variant('late-overview', lateOverview));
  ok("a remembered overview that stops after the app has shown it: the first Go home resumes it and it stops again, and the second goes to the front door with the note of where the student was erased", r.seen.join() === 'true,true' && r.end.screen === 'welcome' && !r.end.guard && r.end.where === null, r); }
{ const r = await goHome(variant('late-overview-no-erase', swap(lateOverview, 'if (laterStops >= 2)\n                            saveWhere(null); ', '')));
  ok('near miss: Go home with the erase taken out restores the overview again, which stops again, and is caught', r.end.screen !== 'welcome' || r.end.guard, r); }
{ const { p, r } = await read(variant('note-refused', swap(firstScreenStops, 'window.__eduCannotStart = function (why) {', 'window.__eduCannotStart = function (why) { return false;')), 6000);
  ok("where the note's function shows nothing (it returns false), the crash guard falls back to its own Go home", r.guard && r.note === null, r); await p.close(); }
await browser.close(); rmSync(dir, { recursive: true, force: true });
// The note's words against the page's own background, #F5F7F1: its lines in #1F3B31 and its first in #2F5D4F, 4.5 to 1 or better.
{ const lum = (hex) => { const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4))); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
  const ratio = (a, b) => (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);
  const css = (page.match(/\.edu-too-old \{[^}]*color: (#[0-9A-Fa-f]{6})/) || [])[1]; const head = (page.match(/\.edu-too-old \.edu-too-old-head \{[^}]*color: (#[0-9A-Fa-f]{6})/) || [])[1];
  ok("the note's words read 4.5 to 1 or better on the page's background", !!css && !!head && ratio(css, '#F5F7F1') >= 4.5 && ratio(head, '#F5F7F1') >= 4.5, { css, head, body: css && ratio(css, '#F5F7F1').toFixed(2), first: head && ratio(head, '#F5F7F1').toFixed(2) }); }
console.log(`\n${passed} passed, ${failed} failed`);
process.exitCode = failed ? 1 : 0;   // never process.exit(): it can drop the last lines of a piped stdout (2026-09-23)
