// The Wise Human. Copyright (c) 2026. Source-available; not for reuse. See LICENSE.md.
// Words that spill out of their box, and centred words pushed off centre by an icon beside them (pass MR, Mikey: "see the screenshot
// for the word sunshine bleeding out through a button and there is another example where the centered text is pushed left by the
// speaker icon.  I never want this to happen anywhere in the app and try to correct every example I find."). In plain terms: this
// file holds one function a browser test runs inside the page (layoutProblems), which reads every piece of visible text under a root
// and reports two kinds of fault:
//   spill   a run of words drawn past the edge of the box that holds it: the nearest button, or the nearest element with its own
//           border, background or clipping, or the root itself (the game board, the screen); a word clipped inside a box that hides
//           its overflow counts too, since it is cut off rather than shown;
//   overlap two runs of words drawn over each other (since round four of pass MS, on a game's board, when asked);
//   offset  words set to sit in the middle (text-align: center, or a flex or grid cell that centres its content) inside a row that
//           also holds an icon or a button with no words (a speaker, a star, a pace snail) or an info button (its one letter, i),
//           whose middle sits more than 3 pixels from the row's own middle, as Grow the Plant's question did beside its speaker
//           before pass MQ; and, since round three of pass MR, the words on the line of a centered block (a paragraph, a line with a
//           link) that an icon shares in the line's own flow, as "Back to recommended courses" and three paragraphs ending in an i
//           did on the educator's pages.
// Text a screen hides on purpose (display none, visibility hidden, opacity 0, a measuring copy held at no height, a screen reader's
// only text) is skipped, and so is text inside an element marked data-layout-free (a ticker that scrolls on purpose, a long word in a
// table a person scrolls sideways). Each problem names its words, the box, and how many pixels it is out by.
export const layoutProblems = function (rootSelector, opts) {
  const o = Object.assign({ spillPx: 0.75, offsetPx: 3, overlap: false }, opts || {});
  const root = typeof rootSelector === 'string' ? document.querySelector(rootSelector) : (rootSelector || document.body);
  if (!root) return [{ kind: 'missing', text: String(rootSelector) }];
  const out = [];
  const hidden = (el) => {
    for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.display === 'none' || cs.visibility === 'hidden' || cs.visibility === 'collapse' || Number(cs.opacity) === 0) return true;
      if (n.hasAttribute && n.hasAttribute('data-layout-free')) return true;
      // A measuring copy (SpokenRow's) is held at no height with its overflow hidden: nothing in it shows.
      if ((cs.overflow === 'hidden' || cs.overflowY === 'hidden') && n.getBoundingClientRect().height === 0) return true;
      if (/^(sr-only|edu-sr)$/.test(n.className && n.className.baseVal === undefined ? n.className : '')) return true;
    }
    return false;
  };
  const sides = (el) => { const cs = getComputedStyle(el); const r = el.getBoundingClientRect(); return { left: r.left + (parseFloat(cs.borderLeftWidth) || 0), right: r.right - (parseFloat(cs.borderRightWidth) || 0), top: r.top + (parseFloat(cs.borderTopWidth) || 0), bottom: r.bottom - (parseFloat(cs.borderBottomWidth) || 0) }; };
  const visibleEdge = (cs, side) => (parseFloat(cs[`border${side}Width`]) || 0) > 0 && cs[`border${side}Style`] !== 'none' && !/rgba\(0, 0, 0, 0\)|transparent/.test(cs[`border${side}Color`]);
  const bounded = (n) => {
    if (n.tagName === 'BUTTON' || (n.getAttribute && n.getAttribute('role') === 'button')) return true;
    if (n instanceof SVGElement) return n.tagName.toLowerCase() === 'svg';
    const cs = getComputedStyle(n);
    const bg = cs.backgroundColor && !/rgba\(0, 0, 0, 0\)|transparent/.test(cs.backgroundColor);
    const edge = ['Top', 'Right', 'Bottom', 'Left'].some((s) => visibleEdge(cs, s));
    const clip = cs.overflowX !== 'visible' || cs.overflowY !== 'visible';
    return bg || edge || clip || (cs.backgroundImage && cs.backgroundImage !== 'none');
  };
  const boxOf = (el) => { for (let n = el; n; n = n.parentElement) { if (n === root) return root; if (bounded(n)) return n; } return root; };
  const label = (el) => { const t = el.tagName.toLowerCase(); const a = el.getAttribute('aria-label'); const cls = typeof el.className === 'string' ? el.className.split(/\s+/).filter(Boolean).slice(0, 2).join('.') : ''; return `${t}${cls ? '.' + cls : ''}${a ? `[${a.slice(0, 40)}]` : ''}`; };
  const words = (s) => s.replace(/\s+/g, ' ').trim();
  // Spill: every visible text node, its drawn extent against its box.
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = words(node.nodeValue || ''); if (!text) continue;
    const el = node.parentElement; if (!el || hidden(el)) continue;
    const rg = document.createRange(); rg.selectNodeContents(node);
    const rects = [...rg.getClientRects()].filter((r) => r.width > 0 && r.height > 0); if (!rects.length) continue;
    const t = { left: Math.min(...rects.map((r) => r.left)), right: Math.max(...rects.map((r) => r.right)), top: Math.min(...rects.map((r) => r.top)), bottom: Math.max(...rects.map((r) => r.bottom)) };
    const box = boxOf(el); const b = sides(box);
    // A word in a box that scrolls is not spilling; it is there to be scrolled to.
    const bcs = getComputedStyle(box); if (box !== root && (/auto|scroll/.test(bcs.overflowX) || /auto|scroll/.test(bcs.overflowY))) continue;
    const by = Math.max(b.left - t.left, t.right - b.right, 0);
    if (by > o.spillPx) { const key = `${text}|${label(box)}`; if (!seen.has(key)) { seen.add(key); out.push({ kind: 'spill', text: text.slice(0, 60), box: label(box), by: +by.toFixed(1), boxWidth: Math.round(b.right - b.left) }); } }
    // Clipped: a box that hides its overflow and holds words wider than itself.
    if (box !== root && box.scrollWidth > box.clientWidth + 1 && (bcs.overflowX === 'hidden' || bcs.overflowX === 'clip')) { const key = `clip|${label(box)}`; if (!seen.has(key)) { seen.add(key); out.push({ kind: 'clipped', text: text.slice(0, 60), box: label(box), by: box.scrollWidth - box.clientWidth }); } }
  }
  // Overlap (round four's screen read, pass MS): two runs of words drawn over each other, as two "decresc." side by side were on
  // Shape the Sound's board at 320, each still inside the board, so no spill showed. Every visible text node's lines are read, and
  // two lines of different nodes that cross by more than a pixel across and by more than half the shorter one's height down are
  // reported once (lines stacked a little tight in a paragraph cross by far less than half a line). It reads a game's board when
  // asked (opts.overlap, the game sweep): on the screens a floating notice crosses the page by design ("Logging out in"), and the
  // certificate's small wordmark stacks its words, so the screens' read waits for its own pass (EARMARKS L18).
  if (o.overlap) { const runs = []; const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let node = tw.nextNode(); node; node = tw.nextNode()) { if (!words(node.nodeValue || '')) continue; const el = node.parentElement; if (!el || hidden(el)) continue;
      const rg = document.createRange(); rg.selectNodeContents(node); for (const r of rg.getClientRects()) if (r.width > 0 && r.height > 0) runs.push({ node, r }); }
    for (let i = 0; i < runs.length; i++) for (let j = i + 1; j < runs.length; j++) { const a = runs[i]; const b = runs[j]; if (a.node === b.node) continue;
      const dx = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left); const dy = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
      if (dx > 1 && dy > 0.5 * Math.min(a.r.height, b.r.height)) { const key = `overlap|${words(a.node.nodeValue)}|${words(b.node.nodeValue)}`; if (!seen.has(key)) { seen.add(key); out.push({ kind: 'overlap', text: `${words(a.node.nodeValue).slice(0, 30)} / ${words(b.node.nodeValue).slice(0, 30)}`, box: label(a.node.parentElement), by: +dx.toFixed(1) }); } } } }
  // Offset: a row holding centred words beside an icon with no words.
  // An info button (InfoButton in ui.jsx: a small round button whose one letter is i) is an icon too (round three of pass MR).
  const iconLike = (el) => { if (hidden(el)) return false; const r = el.getBoundingClientRect(); if (r.width === 0 || r.width > 72) return false; const txt = words(el.textContent || ''); if (el.tagName === 'BUTTON' && txt === 'i' && r.width <= 24) return true; return !txt && (el.querySelector('svg') || el.tagName === 'BUTTON' || el.tagName.toLowerCase() === 'svg'); };
  const centred = (el) => { const cs = getComputedStyle(el); return cs.textAlign === 'center' || ((cs.display === 'flex' || cs.display === 'inline-flex' || cs.display === 'grid') && (cs.justifyContent === 'center' || cs.justifyItems === 'center')); };
  for (const row of root.querySelectorAll('*')) {
    if (hidden(row)) continue;
    const cs = getComputedStyle(row); if (!/flex|grid/.test(cs.display)) continue;
    if (cs.flexDirection && cs.flexDirection.startsWith('column')) continue;
    // Words written straight into a centred row, beside an icon element, are read too (round one's screen check, pass MR: "Wonder
    // Questions" and "Progress by course" sat 13 pixels left of center beside their i, and the read saw no words, since a text node
    // is no element).
    const loose = centred(row) ? [...row.childNodes].filter((n) => n.nodeType === 3 && words(n.nodeValue || '')) : [];
    const kids = [...row.children].filter((k) => !hidden(k)); if (kids.length + loose.length < 2) continue;
    const icons = kids.filter(iconLike); const texts = [...kids.filter((k) => !iconLike(k) && words(k.textContent || '') && centred(k)), ...loose];
    if (!icons.length || !texts.length) continue;
    // A row of pictures with one worded tile among them (a pattern's ? beside its shapes) is a row of tiles, each its own box, not a
    // label beside its icon; so is a chip, a box with its own edge or fill that hugs its icon and words (The Better Deal's price tag),
    // which reads as one centred thing (the sweep's first run, pass MR: both were found and read as fine).
    if (icons.length > 2 || texts.length > 1) continue;
    const rcs = getComputedStyle(row); const hugs = row.getBoundingClientRect().width <= kids.reduce((a, k) => a + k.getBoundingClientRect().width, 0) + (parseFloat(rcs.columnGap) || 0) * (kids.length - 1) + (parseFloat(rcs.paddingLeft) || 0) + (parseFloat(rcs.paddingRight) || 0) + (parseFloat(rcs.borderLeftWidth) || 0) + (parseFloat(rcs.borderRightWidth) || 0) + 2;
    if (hugs && bounded(row)) continue;
    const rr = sides(row); const mid = (rr.left + rr.right) / 2;
    for (const k of texts) {
      const rg = document.createRange(); rg.selectNodeContents(k); const rects = [...rg.getClientRects()].filter((r) => r.width > 0 && r.height > 0); if (!rects.length) continue;
      const left = Math.min(...rects.map((r) => r.left)); const right = Math.max(...rects.map((r) => r.right));
      // Only words that sit in the same band as the icon (a row of words above a row of buttons is a different layout).
      const ir = icons[0].getBoundingClientRect(); const tr = { top: Math.min(...rects.map((r) => r.top)), bottom: Math.max(...rects.map((r) => r.bottom)) };
      if (ir.bottom < tr.top || ir.top > tr.bottom) continue;
      // A row that starts its words at the left (a list row with an icon at its end) is not a centred row.
      const off = (left + right) / 2 - mid;
      if (Math.abs(off) > o.offsetPx) out.push({ kind: 'offset', text: words(k.textContent).slice(0, 60), row: label(row), by: +off.toFixed(1) });
    }
  }
  // Offset in a centered block (round three of pass MR, the alignment read: the read looked at flex and grid rows only, so a link or
  // a paragraph's last line beside an i in a plain centered block went unseen). An icon in the block's own line flow (every element
  // from the icon up to the block set inline and none placed absolutely) takes room in its line, so the words on that line, measured
  // against the middle of the block's content, show how far it pushed them; an icon hung outside the line, as HeadWithInfo and
  // EndInfo hang theirs, takes no room and is not read.
  const inFlow = (el, block) => { for (let n = el; n && n !== block; n = n.parentElement) { const c = getComputedStyle(n); if (c.position === 'absolute' || c.position === 'fixed' || c.float !== 'none') return false; if (!/^inline/.test(c.display)) return false; } return true; };
  for (const block of [root, ...root.querySelectorAll('*')]) {   // the root itself may be the centered block
    if (hidden(block)) continue;
    const bcs = getComputedStyle(block); if (!/^(block|list-item|table-cell)$/.test(bcs.display) || bcs.textAlign !== 'center') continue;
    const found = [...block.querySelectorAll('button, svg, img')].filter((el) => !(el.parentElement && el.parentElement.closest('svg')) && iconLike(el) && inFlow(el, block));
    const icons = found.filter((ic) => !found.some((other) => other !== ic && other.contains(ic)));   // a speaker's drawing is its button's
    if (!icons.length) continue;
    const rects = []; const tw = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
    for (let n = tw.nextNode(); n; n = tw.nextNode()) { const p = n.parentElement; if (!p || hidden(p) || !words(n.nodeValue || '') || icons.some((ic) => ic.contains(n)) || (p !== block && !inFlow(p, block))) continue;
      const rg = document.createRange(); rg.selectNodeContents(n); rects.push(...[...rg.getClientRects()].filter((r) => r.width > 0 && r.height > 0)); }
    const bb = block.getBoundingClientRect(); const mid = (bb.left + (parseFloat(bcs.borderLeftWidth) || 0) + (parseFloat(bcs.paddingLeft) || 0) + bb.right - (parseFloat(bcs.borderRightWidth) || 0) - (parseFloat(bcs.paddingRight) || 0)) / 2;
    for (const ic of icons) {
      const ir = ic.getBoundingClientRect(); const line = rects.filter((r) => { const c = (r.top + r.bottom) / 2; return c >= ir.top && c <= ir.bottom; });
      if (!line.length) continue;
      const off = (Math.min(...line.map((r) => r.left)) + Math.max(...line.map((r) => r.right))) / 2 - mid;
      const key = `block|${label(block)}|${Math.round(off)}`;
      if (Math.abs(off) > o.offsetPx && !seen.has(key)) { seen.add(key); out.push({ kind: 'offset', text: words(block.textContent || '').slice(0, 60), row: label(block), by: +off.toFixed(1) }); }
    }
  }
  return out;
};
// The function as source, to hand to page.evaluate with a selector: page.evaluate(`(${LAYOUT_SOURCE})('[data-game-pad]')`).
export const LAYOUT_SOURCE = layoutProblems.toString();
