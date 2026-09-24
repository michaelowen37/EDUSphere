// Builds tests/e2e/page.html: the real built artifact running in a real browser.
// React is loaded from the machine's node_modules with a tiny require() shim
// (React 19 ships no browser bundle), and window.storage is a fake in-memory
// version of the artifact host's storage API.
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';

const G = execSync('npm root -g').toString().trim();
const req = createRequire(import.meta.url);
const read = (rel) => readFileSync(`${G}/${rel}`, 'utf8');
const mods = {
  react: read('react/cjs/react.production.js'),
  'react-dom': read('react-dom/cjs/react-dom.production.js'),
  'react-dom/client': read('react-dom/cjs/react-dom-client.production.js'),
  scheduler: read('react-dom/node_modules/scheduler/cjs/scheduler.production.js'),
};
// Transpile the artifact's JSX + imports to plain CommonJS with TypeScript.
execSync('tsc --allowJs --jsx react --target es2020 --module commonjs --outDir tests/e2e/out dist/edusphere-prototype.jsx', { stdio: 'ignore' });
mods.app = readFileSync('tests/e2e/out/edusphere-prototype.js', 'utf8');

const wrap = (name, code) => `__def(${JSON.stringify(name)}, function(module, exports, require){${code}\n});`;
const html = `<!doctype html><html><head><meta charset="utf-8"><title>EduSphere e2e</title></head><body><div id="root"></div>
<script>
var process = { env: { NODE_ENV: 'production' } };
var __mods = {}, __cache = {};
function __def(n, f) { __mods[n] = f; }
function require(n) { if (__cache[n]) return __cache[n].exports; var m = { exports: {} }; __cache[n] = m; __mods[n](m, m.exports, require); return m.exports; }
// Fake storage with the host's documented behavior: get throws on a missing key.
var __store = {};
window.storage = {
  get: async function (k) { if (!(k in __store)) throw new Error('not found'); return { key: k, value: __store[k], shared: false }; },
  set: async function (k, v) { __store[k] = v; return { key: k, value: v, shared: false }; },
  delete: async function (k) { delete __store[k]; return { key: k, deleted: true, shared: false }; },
  list: async function (p) { return { keys: Object.keys(__store).filter(function (k) { return k.startsWith(p || ''); }), prefix: p, shared: false }; },
};
window.__spoken = [];
Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: { cancel: function(){}, getVoices: function(){ return []; }, speak: function (u) { window.__spoken.push(u.text); (window.__rates = window.__rates || []).push(u.rate); setTimeout(function () { if (u.onend) u.onend({}); }, 30); } } });
Object.defineProperty(window, 'SpeechSynthesisUtterance', { configurable: true, value: function (t) { this.text = t; } });
</script>
<script>${Object.entries(mods).map(([n, c]) => wrap(n, c)).join('\n')}</script>
<script>
var React = require('react'); var App = require('app').default;
require('react-dom/client').createRoot(document.getElementById('root')).render(React.createElement(App));
</script></body></html>`;
writeFileSync('tests/e2e/page.html', html);
console.log('page.html written (' + Math.round(html.length / 1024) + ' KB)');
