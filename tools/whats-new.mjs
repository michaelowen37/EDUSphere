// The Wise Human. Copyright (c) 2026. Source-available; not for reuse. See LICENSE.md.
// Which block of docs/WHATS-NEW.md educators see in the What's new pop-up (2026-09-28, pass FR). The build and its
// test both ask here, so the page and the check can never disagree.
//
// A block starts with a heading like "## September 28, 2026 (stories that flow)". The newest is the one with the
// latest date; when two share a date, the one higher in the file wins, which is why every pass adds its block at the
// top. The stamp educators are remembered against is the whole heading, so a second block on the same day still shows.
// Before this pass the build read the heading as one word ("2026-09-22"), so once the headings became dates with
// spaces (September 24) nothing matched and the pop-up went dark for every build since.
export function newestNews(doc) {
  const blocks = String(doc || '').split(/\n(?=## )/).filter((b) => b.startsWith('## '));
  const parsed = blocks.map((b, order) => {
    const lines = b.split('\n'); const heading = lines[0].slice(3).trim();
    const dateText = heading.replace(/\s*\(.*$/, '').trim(); const when = new Date(dateText).getTime();
    const items = lines.slice(1).filter((ln) => ln.startsWith('- ')).map((ln) => ln.slice(2).trim());
    return { stamp: heading, date: dateText, items, when: Number.isNaN(when) ? -Infinity : when, order };
  }).filter((b) => b.items.length);
  if (!parsed.length) return null;
  parsed.sort((a, b) => (b.when - a.when) || (a.order - b.order));
  const { stamp, date, items } = parsed[0];
  return { stamp, date, items };
}
