// The Wise Human. Copyright (c) 2026. Source-available; not for reuse. See LICENSE.md.
// A browser too old for the app (Q92, Mikey's answer in pass NG: "Q92 - B"; EARMARKS A113). In plain terms: the app's script uses
// ways of writing JavaScript that Safari reads only from 16.4 (March 2023), and Chrome, Edge and Firefox only from 80, 80 and 78 (2020),
// so on an older one, an iPad Air 2 or an iPhone 7 among them, the script stops before the first screen and the Loading word bobbed
// for ever. TOO_OLD_SCRIPT runs first, and is written in the oldest JavaScript there is (no arrow functions, no let or const, no
// template strings), so every one of those browsers runs it; it only defines window.__eduCannotStart, which puts TOO_OLD_LINES where the
// Loading word was. START_SCRIPT, last, starts the app inside a guard and calls it when the app's script never loaded (require then
// fails: the note that the browser is too old), or when the app's script loaded but the app stops before its first screen: React's
// onUncaughtError, for a stop outside the app's crash guard (its error still reported as React reports it), and the crash guard itself
// (src/ui.jsx), which catches every stop in the app's screens and, before the app has shown a screen past Loading, hands it here.
// Since round one's reads (pass NG) a stop after the script loaded shows STOPPED_LINES, not the too-old lines: a browser that reads
// the app's script reads everything the app's syntax needs, so the cause may be a newer built-in it lacks or a fault, and the note
// says only what is true of both (the screen read planted a stop on a current Chromium, and the too-old lines blamed the device).
// The note never shows on a device where the app runs: it waits for the root to be empty and for the app never to have shown a
// screen past Loading (window.__eduAppShown, which the app sets). Names are held whole by no-break spaces (The Wise Human, iOS 16.4,
// iPad Air 2, Software Update), which round one's screen read found split at 320 to 430 pixels, and the third line speaks to every
// other device, an Android phone or tablet as well as a computer. Since round two's screen read each note's last line holds "or Safari."
// together (the too-old note's "Safari." stood alone at 360, 375, 768, an iPad Air 2 upright, 820, 1024 and 1280 pixels, and the other's
// at 344 to 356, 432 to 444 and 636 to 640), and since the third read the other's first line holds "this browser." (its "browser." stood
// alone from 468 to 568); text-wrap cannot do it, since the browsers that show the note are older than it.
// This module only defines them, with nothing to run: tools/build-site.mjs puts them in the page, and tests/e2e/too-old.mjs holds
// the scripts to that old JavaScript, the page to no newer feature than those browsers read, and the note to showing when the app
// cannot start and never when it can. The README names the same versions.
export const TOO_OLD_LINES = [
  'This device or browser is too old for The\u00A0Wise\u00A0Human.',
  'On an iPad or iPhone, it needs iPadOS or iOS\u00A016.4 or later, and another browser there will not help. Some older iPads and iPhones, such as the iPad\u00A0Air\u00A02, cannot update that far. To update one that can, open Settings, then General, then Software\u00A0Update.',
  'On any other device, open it in a current Chrome, Edge, Firefox or\u00A0Safari.',
];
export const STOPPED_LINES = [
  'The\u00A0Wise\u00A0Human could not start in this\u00A0browser.',
  'Reload the page to try again. If it still does not start, update the device or its browser, or open it in a current Chrome, Edge, Firefox or\u00A0Safari.',
];
export const TOO_OLD_SCRIPT = `
// When the app cannot start (Q92, pass NG; tools/build-site.mjs says why). The oldest JavaScript there is, so an old browser runs it.
(function () {
  var shown = false;
  window.__eduCannotStart = function (why) {
    var boot = document.getElementById('edu-boot'); var root = document.getElementById('root');
    if (shown || window.__eduAppShown || !boot || (root && root.firstChild)) return false;
    shown = true; boot.removeAttribute('aria-hidden');
    while (boot.firstChild) boot.removeChild(boot.firstChild);
    var stopped = why === 'stopped';
    var note = document.createElement('div'); note.className = 'edu-too-old'; note.setAttribute('role', 'alert'); note.setAttribute('data-too-old', stopped ? 'stopped' : 'old');
    var lines = stopped ? ${JSON.stringify(STOPPED_LINES)} : ${JSON.stringify(TOO_OLD_LINES)};
    for (var i = 0; i < lines.length; i++) { var p = document.createElement('p'); if (i === 0) p.className = 'edu-too-old-head'; p.appendChild(document.createTextNode(lines[i])); note.appendChild(p); }
    boot.appendChild(note);
    return true;
  };
})();
`;
export const START_SCRIPT = `
// The app starts here, inside a guard: if its script never loaded, or it stops before its first screen, the note takes the Loading word's place.
var eduLoaded = false;
try {
  var React = require('react'); var App = require('app').default; eduLoaded = true;
  require('react-dom/client').createRoot(document.getElementById('root'), { onUncaughtError: function (error) { if (window.__eduCannotStart) window.__eduCannotStart('stopped'); if (typeof window.reportError === 'function') window.reportError(error); else setTimeout(function () { throw error; }, 0); } }).render(React.createElement(App));
} catch (e) { if (window.__eduCannotStart) window.__eduCannotStart(eduLoaded ? 'stopped' : 'old'); if (window.console && window.console.error) window.console.error(e); }
`;
