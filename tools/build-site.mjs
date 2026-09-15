// Builds index.html: the whole product as ONE file that runs anywhere a browser runs.
// GitHub Pages, a school's own web server, a USB stick, or double-clicked from a folder.
//
// What goes in:
// - React, bundled in, so nothing is fetched from anywhere and locked-down devices work.
// - The app, compiled from dist/edusphere-prototype.jsx to plain JavaScript.
// - A storage layer on the browser's own localStorage, with the same contract the
//   artifact host uses, so the app code is identical in both places.
//
// Nothing here talks to a server. The file is the product.
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const G = execSync('npm root -g').toString().trim();
const read = (rel) => readFileSync(`${G}/${rel}`, 'utf8');
const mods = {
  react: read('react/cjs/react.production.js'),
  'react-dom': read('react-dom/cjs/react-dom.production.js'),
  'react-dom/client': read('react-dom/cjs/react-dom-client.production.js'),
  scheduler: read('react-dom/node_modules/scheduler/cjs/scheduler.production.js'),
};
execSync('tsc --allowJs --jsx react --target es2020 --module commonjs --outDir tests/e2e/out dist/edusphere-prototype.jsx', { stdio: 'ignore' });
mods.app = readFileSync('tests/e2e/out/edusphere-prototype.js', 'utf8');

// The logo as the browser-tab icon. Built from the same drawing the app uses, squeezed
// into a data address so the page still needs no other file.
// A tab icon is 16 pixels wide, so the full logo's fine arcs vanish. This bold version
// keeps the idea (a green sphere with a gold arc) at a size a tab can show.
const iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#3A6B58"/><path d="M8 40 C 20 22, 44 22, 56 40" fill="none" stroke="#D9A83B" stroke-width="6" stroke-linecap="round"/><path d="M22 18 h20 M22 18 v28 M22 32 h15 M22 46 h20" fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const favicon = 'data:image/svg+xml,' + encodeURIComponent(iconSvg);

const wrap = (name, code) => `__def(${JSON.stringify(name)}, function(module, exports, require){${code}\n});`;
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="EduSphere: mastery-based learning for pre-K to 12, with nothing leaving the device.">
<title>EduSphere</title>
<link rel="icon" type="image/svg+xml" href="${favicon}">
<link rel="apple-touch-icon" href="${favicon}">
<meta name="theme-color" content="#F5F7F1">
<style>html, body { margin: 0; padding: 0; background: #F5F7F1; } #root:empty::after { content: 'Loading EduSphere'; display: block; padding: 40px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #6B7263; }</style>
</head>
<body>
<div id="root"></div>
<script>
var process = { env: { NODE_ENV: 'production' } };
var __mods = {}, __cache = {};
function __def(n, f) { __mods[n] = f; }
function require(n) { if (__cache[n]) return __cache[n].exports; var m = { exports: {} }; __cache[n] = m; __mods[n](m, m.exports, require); return m.exports; }
// Storage on the browser's own localStorage, with the contract the app expects:
// get throws when a key is missing, set and delete return what they did, list filters by prefix.
// Everything a student does lives here, on this device, and nowhere else.
window.storage = {
  get: async function (k) { var v = localStorage.getItem(k); if (v === null) throw new Error('not found'); return { key: k, value: v, shared: false }; },
  set: async function (k, v) { localStorage.setItem(k, v); return { key: k, value: v, shared: false }; },
  delete: async function (k) { localStorage.removeItem(k); return { key: k, deleted: true, shared: false }; },
  list: async function (p) { var keys = []; for (var i = 0; i < localStorage.length; i++) { var key = localStorage.key(i); if (key.indexOf(p || '') === 0) keys.push(key); } return { keys: keys, prefix: p, shared: false }; },
};
</script>
<script>${Object.entries(mods).map(([n, c]) => wrap(n, c)).join('\n')}</script>
<script>
var React = require('react'); var App = require('app').default;
require('react-dom/client').createRoot(document.getElementById('root')).render(React.createElement(App));
</script>
</body>
</html>`;
writeFileSync('index.html', html);
writeFileSync('dist/index.html', html);
console.log('index.html written (' + Math.round(html.length / 1024) + ' KB)');
