
// =====================================================================
//  FILE: src/ui.jsx — the screens
//
//  This file only draws things and reacts to taps. Every rule about
//  mastery, locking, questions, and reports lives in logic.mjs above
//  (build.sh pastes that file in front of this one to make one artifact).
//
//  Screens, in the order a learner sees them:
//    Welcome  -> pick or type a name
//    Overview -> the modules, which are locked / ready / mastered
//    Lesson   -> read the explanation, then "Practice this"
//    Practice -> one question at a time, instant feedback
//    Result   -> mastered (unlocks the next module) or practice again
//    Report   -> progress numbers, recomputed from the event log every time
//
//  Storage: the artifact's built-in window.storage. One key per learner,
//  holding { version, name, createdAt, events: [...] }. The app only ever
//  ADDS events to that list.
// =====================================================================

// ---------- Colors and shared styles (one palette, used everywhere) ----------
const C = {
  bg: '#F5F7F1', surface: '#FFFFFF', ink: '#24291F', muted: '#5C6355', line: '#DCE3D6',
  green: '#2F5D4F', greenSoft: '#E4EEE8', gold: '#B8862B', goldSoft: '#F7EAD1',
  clay: '#B9634A', claySoft: '#F6E4DB',
};
const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
// Every screen sits inside a bold green frame — the app's outer edge.
// The frame is fixed to the window rather than drawn around the content, so it stays
// in place while the page scrolls behind it.
const page = { fontFamily: FONT, background: C.bg, color: C.ink, minHeight: '100vh', boxSizing: 'border-box', padding: '22px 16px 40px', lineHeight: 1.5, position: 'relative', isolation: 'isolate' };
// The frame is fixed to the viewport. On phones the bottom edge chased the address bar as it hid and
// showed during fast scrolling, so the bottom bar is drawn by the page's own padding instead (see
// .edu-page-foot), and the fixed frame carries only the top and sides.
const frame = { position: 'fixed', top: 0, left: 0, right: 0, height: '100lvh', borderTop: `6px solid ${C.green}`, borderLeft: `6px solid ${C.green}`, borderRight: `6px solid ${C.green}`, boxSizing: 'border-box', pointerEvents: 'none', zIndex: 50 };
// Width comes from the .edu-wrap class, so a wide screen can be given more room.
const wrap = { margin: '0 auto', minHeight: 'calc(100vh - 62px)' };
// Where 'Contact us' goes. One place to change it later.
const CONTACT_EMAIL = 'michaelowen37@gmail.com';

// A quiet line at the foot of a screen. Discreet by design: help is there without shouting.
// The contact popup, shared by the welcome page and the Classroom page.
function ContactPopup({ onClose }) {
  return (
    <div className="edu-no-print" style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, background: 'rgba(36, 41, 31, 0.55)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div className="edu-rise" style={{ maxWidth: 420, width: '100%', background: C.surface, borderRadius: 14, padding: 20, position: 'relative', textAlign: 'center' }}>
        <button type="button" onClick={onClose} aria-label="Close" style={{ position: 'absolute', top: 8, right: 10, background: 'none', border: 'none', width: 36, height: 36, fontSize: 30, lineHeight: '34px', cursor: 'pointer', color: C.ink, fontFamily: FONT, padding: 0 }}>×</button>
        <p style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 600 }}>Contact us</p>
        <p style={{ margin: '0 0 14px', fontSize: 15, color: C.muted }}>Questions, problems, or an idea. We read everything.</p>
        <p style={{ margin: '0 0 14px', fontSize: 16, fontWeight: 600 }}>{CONTACT_EMAIL}</p>
        <a href={`mailto:${CONTACT_EMAIL}`} style={{ display: 'inline-block', fontFamily: FONT, fontSize: 16, fontWeight: 600, padding: '12px 18px', borderRadius: 10, background: C.green, color: '#fff', textDecoration: 'none' }}>Open in your email app</a>
      </div>
    </div>
  );
}

// A PIN box that shows dots, with only the digit just typed visible for a moment.
function PinInput({ value, onChange, placeholder, style, onEnter = null }) {
  const [reveal, setReveal] = useState(false);
  const timer = useRef(null);
  const shown = value.split('').map((ch, i) => (i === value.length - 1 && reveal ? ch : '•')).join('');
  return (
    <input value={shown} inputMode="numeric" autoComplete="off" placeholder={placeholder} aria-label={placeholder} style={style}
      onKeyDown={(e) => { if (e.key === 'Enter' && onEnter) onEnter(); }}
      onChange={(e) => {
        // Rebuild the real PIN from what the box now shows: a dot keeps the digit already there,
        // anything else is a new digit. This handles typing, deleting and pasting a whole PIN.
        const next = e.target.value;
        let real = '';
        for (let i = 0; i < next.length && real.length < 6; i++) {
          const ch = next[i];
          if (ch === '•') { if (value[i]) real += value[i]; }
          else if (/[0-9]/.test(ch)) real += ch;
        }
        onChange(real);
        setReveal(true);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setReveal(false), 900);
      }} />
  );
}

// A stamp of when this copy of the page was built, so a stale page in a cache can be told apart
// from a fresh one at a glance. Written by the build, never by hand.
const BUILD_STAMP = '__BUILD_STAMP__';
function ContactLine({ onOpen, inline = false }) {
  return (
    <p className="edu-no-print" style={{ textAlign: 'center', marginTop: inline ? 0 : 28, fontSize: inline ? 14 : 12, color: C.muted, margin: inline ? '0' : undefined }}>
      {onOpen
        ? <button type="button" onClick={onOpen} style={{ background: 'none', border: 'none', color: C.muted, fontFamily: FONT, fontSize: 12, cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>Contact us</button>
        : <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: C.muted, textDecoration: 'underline' }}>Contact us</a>}
    </p>
  );
}

// A name typed with a parenthetical, like "Mikey (Grade 3)", keeps the parenthetical on one line
// wherever the name is shown: the spaces inside the parentheses become non-breaking. Display only;
// the stored name never changes.
const keepTogether = (s) => String(s).replace(/\(([^)]*)\)/g, (m) => m.replace(/ /g, '\u00A0').replace(/-/g, '\u2011'));
const linkBtn = { background: 'none', border: 'none', color: '#2F5D4F', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', fontSize: 15, cursor: 'pointer', padding: '6px 0', textDecoration: 'underline' };
// Cards are solid, so stars show only in the open space between them and never behind text.
const cardLink = { ...linkBtn, marginRight: 12 };
const card = { background: C.surface, border: `1px solid ${C.line}`, borderRadius: 14, padding: 18, marginBottom: 14 };

// ---------- Small building blocks ----------
function Btn({ children, onClick, kind = 'primary', disabled = false, full = false, halo = false, orbit = false, style: extra = null }) {
  const base = {
    fontFamily: FONT, fontSize: 16, fontWeight: 600, padding: '12px 18px', borderRadius: 10,
    cursor: disabled ? 'default' : 'pointer', border: `2px solid ${C.green}`, minHeight: 46,
    width: full ? '100%' : 'auto', opacity: disabled ? 0.5 : 1,
  };
  const looks = kind === 'primary'
    ? { background: C.green, color: '#fff' }
    : { background: C.surface, color: C.green };
  // An inviting button pulses itself, gently, rather than casting a ring around it.
  return <button type="button" className={[halo && !disabled ? 'edu-press edu-pulse' : 'edu-press', orbit && !disabled ? 'edu-orbit' : ''].filter(Boolean).join(' ')} style={{ ...base, ...looks, ...(extra || {}), ...(orbit ? { position: 'relative' } : {}) }} onClick={onClick} disabled={disabled}>{children}</button>;
}

// The signature visual: a bar split into equal parts with some shaded.
// Used in lessons, in questions, and on the overview to show progress.
function FractionBar({ parts, shaded, color = C.green, height = 44 }) {
  const w = 320; const gap = parts > 12 ? 2 : 4;
  const partW = (w - gap * (parts - 1)) / parts;
  return (
    <svg viewBox={`0 0 ${w} ${height}`} width="100%" height={height} role="img" aria-label={`${shaded} of ${parts} parts shaded`} style={{ display: 'block' }}>
      {Array.from({ length: parts }).map((_, i) => (
        <rect key={i} x={i * (partW + gap)} y="2" width={partW} height={height - 4} rx="6"
          fill={i < shaded ? color : C.surface} stroke={C.line} strokeWidth="2" />
      ))}
    </svg>
  );
}

// A group of dots for the counting course (rows of five, like a ten-frame).
// A pad for tracing a letter with a finger. The letter's strokes show faintly with a
// green starting dot and a small arrow on each. The finger's path is collected in the
// pad's own 100 by 100 coordinates, so a check can be done by arithmetic regardless of
// screen size. Works with a mouse too, but it is built for glass.
// The letter's real shape, faint, fitted to the guide strokes' box, so a child traces inside a letter.
function TraceShape({ letter, def }) {
  const g = LETTER_GLYPHS[letter];
  if (!def || def.dots || def.line || !g) return null;
  const pts = def.strokes.flat(); const top = Math.min(...pts.map((q) => q[1])); const bottom = Math.max(...pts.map((q) => q[1]));
  const s = (bottom - top) / (g.box[3] - g.box[1]); const cx = (Math.min(...pts.map((q) => q[0])) + Math.max(...pts.map((q) => q[0]))) / 2;
  return <path d={g.d} transform={`translate(${(cx - ((g.box[0] + g.box[2]) / 2) * s).toFixed(2)} ${(bottom + g.box[1] * s).toFixed(2)}) scale(${s.toFixed(4)} ${(-s).toFixed(4)})`} fill="#E3E9DE" stroke="#C4CEBE" strokeWidth={1.4 / s} pointerEvents="none" />;
}
function TracePad({ letter, paths, onChange, disabled = false, tone = null }) {
  const ref = useRef(null);
  const drawing = useRef(false);
  const def = TRACE_LETTERS[letter];
  const toLocal = (e) => {
    const box = ref.current.getBoundingClientRect();
    return [Math.round(((e.clientX - box.left) / box.width) * 100), Math.round(((e.clientY - box.top) / box.height) * 100)];
  };
  const start = (e) => { if (disabled) return; drawing.current = true; e.currentTarget.setPointerCapture && e.currentTarget.setPointerCapture(e.pointerId); onChange([...paths, [toLocal(e)]]); };
  const move = (e) => { if (!drawing.current || disabled) return; const next = paths.slice(); next[next.length - 1] = [...next[next.length - 1], toLocal(e)]; onChange(next); };
  const end = () => { drawing.current = false; };
  const ink = tone === 'good' ? C.green : tone === 'bad' ? C.clay : C.ink;
  return (
    <svg ref={ref} viewBox="0 0 100 100" role="img" aria-label={def && def.dots ? `Connect the dots to make a ${letter}` : def && def.line ? 'Draw along the line' : `Trace ${letter}`}
      onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerLeave={end} onPointerCancel={end}
      style={{ width: '100%', maxWidth: 320, aspectRatio: '1 / 1', display: 'block', margin: '0 auto', background: C.surface, border: `2px solid ${C.line}`, borderRadius: 16, touchAction: 'none', cursor: 'crosshair' }}>
      {def && def.dots && def.strokes[0].map((p, i) => (i === def.strokes[0].length - 1 && p.join() === def.strokes[0][0].join() ? null : (
        <g key={`dot-${i}`}><circle cx={p[0]} cy={p[1]} r="5" fill={C.gold} /><text x={p[0]} y={p[1] - 7} fontSize="7" textAnchor="middle" fill={C.ink} fontFamily={FONT}>{i + 1}</text></g>
      )))}
      <TraceShape letter={letter} def={def} />
      {def && !def.dots && def.strokes.map((st, i) => (
        <g key={i}>
          <polyline points={st.map((p) => p.join(',')).join(' ')} fill="none" stroke={C.line} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
          {/* the starting dot and the direction of the first move */}
          <circle cx={st[0][0]} cy={st[0][1]} r="4.5" fill={C.green} />
          {(() => { const [a, b] = [st[0], st[1]]; const dx = b[0] - a[0]; const dy = b[1] - a[1]; const len = Math.hypot(dx, dy) || 1; const ux = dx / len; const uy = dy / len; const tip = [a[0] + ux * 16, a[1] + uy * 16]; const l = [tip[0] - ux * 5 - uy * 3.5, tip[1] - uy * 5 + ux * 3.5]; const r = [tip[0] - ux * 5 + uy * 3.5, tip[1] - uy * 5 - ux * 3.5]; return <polygon points={`${tip.join(',')} ${l.join(',')} ${r.join(',')}`} fill={C.green} />; })()}
        </g>
      ))}
      {paths.map((path, i) => path.length > 1
        ? <polyline key={i} points={path.map((p) => p.join(',')).join(' ')} fill="none" stroke={ink} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        : <circle key={i} cx={path[0][0]} cy={path[0][1]} r="3" fill={ink} />)}
    </svg>
  );
}

// A stroke that draws itself, for the tracing lessons. The guide sits in gray with the start dot
// and the arrow of the first move, exactly as on the practice pad, and green ink draws each
// stroke in turn, rests, and draws again. A dots picture shows its numbered dots and joins them.
// Under reduced motion the finished shape simply sits there.
const prefersReducedMotion = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const PACES = [26, 40, 65]; // units per second: slower on request, the pre-K pace, and the grade 1 pace
function TraceDemo({ letter, animKey = 0, pace = 'slow', nudge = 0 }) {
  const def = TRACE_LETTERS[letter];
  if (!def) return null;
  const strokes = def.strokes;
  const lengths = strokes.map((st) => st.slice(1).reduce((acc, p, i) => acc + Math.hypot(p[0] - st[i][0], p[1] - st[i][1]), 0));
  const speed = PACES[Math.max(0, Math.min(2, (pace === 'quick' ? 2 : 1) + nudge))]; // the lesson's own pace, nudged slower or faster by the student
  const rest = 1.8; // seconds with the finished shape before it draws again
  const cycle = lengths.reduce((a, b) => a + b, 0) / speed + 0.5 * strokes.length + rest;
  const id = `edu-tr-${String(letter).replace(/[^a-z0-9]/gi, '')}`;
  let t = 0.5;
  const frames = strokes.map((st, i) => { const dur = lengths[i] / speed; const a = (t / cycle) * 100; const b = ((t + dur) / cycle) * 100; t += dur + 0.5; return { a, b }; });
  const css = frames.map((f, i) => `@keyframes ${id}-${i} { 0%, ${f.a.toFixed(2)}% { stroke-dashoffset: ${lengths[i].toFixed(2)}; } ${f.b.toFixed(2)}%, 100% { stroke-dashoffset: 0; } }`).join('\n');
  const points = (st) => st.map((pt) => pt.join(',')).join(' ');
  const [a, b] = [strokes[0][0], strokes[0][1]];
  const dx = b[0] - a[0]; const dy = b[1] - a[1]; const len = Math.hypot(dx, dy) || 1; const ux = dx / len; const uy = dy / len;
  const tip = [a[0] + ux * 16, a[1] + uy * 16];
  const wing = (side) => [tip[0] - ux * 5 + side * uy * 4, tip[1] - uy * 5 - side * ux * 4];
  return (
    <svg key={animKey} viewBox="0 0 100 100" role="img" aria-label={def.dots ? `Connect the dots to make a ${letter}` : def.line ? 'A line drawing itself' : `${letter} drawing itself`}
      style={{ width: '100%', maxWidth: 230, aspectRatio: '1 / 1', display: 'block', margin: '0 auto', background: C.surface, border: `2px solid ${C.line}`, borderRadius: 16 }}>
      <TraceShape letter={letter} def={TRACE_LETTERS[letter]} />
      <style>{css}</style>
      {def.dots && strokes[0].map((pt, i) => (i === strokes[0].length - 1 && pt.join() === strokes[0][0].join() ? null : (
        <g key={`dot-${i}`}><circle cx={pt[0]} cy={pt[1]} r="5" fill={C.gold} /><text x={pt[0]} y={pt[1] - 7} fontSize="7" textAnchor="middle" fill={C.ink} fontFamily={FONT}>{i + 1}</text></g>
      )))}
      {!def.dots && strokes.map((st, i) => <polyline key={`guide-${i}`} points={points(st)} fill="none" stroke={C.line} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />)}
      {strokes.map((st, i) => <polyline key={`ink-${i}`} className="edu-trace-draw" points={points(st)} fill="none" stroke={C.green} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"
        style={{ strokeDasharray: lengths[i], strokeDashoffset: 0, animation: `${id}-${i} ${cycle.toFixed(2)}s linear infinite` }} />)}
      <circle cx={a[0]} cy={a[1]} r="4.5" fill={C.green} />
      {!def.dots && <polyline points={`${wing(1).join(',')} ${tip.join(',')} ${wing(-1).join(',')}`} fill="none" stroke={C.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
      {/* The pen: a gold dot that rides the tip of the ink. SVG motion, so it needs no script, and it is
          left out entirely when the device asks for reduced motion. */}
      {!prefersReducedMotion() && strokes.map((st, i) => (
        <circle key={`pen-${i}`} r="4" fill={C.gold} stroke="#fff" strokeWidth="1.5" opacity="0">
          <animateMotion dur={`${cycle.toFixed(2)}s`} repeatCount="indefinite" calcMode="linear" keyPoints="0;0;1;1" keyTimes={`0;${(frames[i].a / 100).toFixed(4)};${(frames[i].b / 100).toFixed(4)};1`} path={`M ${st[0][0]} ${st[0][1]} ` + st.slice(1).map((pt) => `L ${pt[0]} ${pt[1]}`).join(' ')} />
          <animate attributeName="opacity" dur={`${cycle.toFixed(2)}s`} repeatCount="indefinite" calcMode="discrete" values="0;1;0;0" keyTimes={`0;${(frames[i].a / 100).toFixed(4)};${(frames[i].b / 100).toFixed(4)};1`} />
        </circle>
      ))}
    </svg>
  );
}

// Pre-K pictures: a colour swatch, a coloured shape (optionally big or small), a pattern row.
const SWATCH = { red: '#D9534F', blue: '#4A7FC1', yellow: '#F0C93A', green: '#5E9A62' };
function Swatch({ colour, size = 90 }) {
  return <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label={colour} style={{ display: 'block', margin: '0 auto' }}><rect x="10" y="10" width="80" height="80" rx="18" fill={SWATCH[colour] || C.line} /></svg>;
}
function Item({ spec, size = 80 }) {
  // spec looks like 'circle-red', 'square-blue-big', 'triangle-green-small', maybe with '#n' on the end
  const [shape, colour, scale] = String(spec).split('#')[0].split('-');
  const s2 = scale === 'big' ? size * 1.35 : scale === 'small' ? size * 0.55 : size;
  return <ShapePic name={shape} size={s2} color={SWATCH[colour] || C.green} />;
}
function PatternRow({ items, colour }) {
  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
      {items.map((it, i) => it === '?'
        ? <span key={i} style={{ width: 52, height: 52, borderRadius: 12, border: `3px dashed ${C.muted}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, color: C.muted, fontWeight: 700 }}>?</span>
        : <ShapePic key={i} name={it} size={52} color={SWATCH[colour] || C.green} />)}
    </div>
  );
}

// An analogue clock face. The short hand shows the hour, the long hand the minutes.
function ClockPic({ hour, minute = 0, size = 120 }) {
  const cx = 50; const cy = 50; const r = 44;
  const minAngle = (minute / 60) * 360; const hourAngle = ((hour % 12) / 12) * 360 + (minute / 60) * 30;
  const hand = (angle, len, width, color) => {
    const a = ((angle - 90) * Math.PI) / 180;
    return <line x1={cx} y1={cy} x2={cx + len * Math.cos(a)} y2={cy + len * Math.sin(a)} stroke={color} strokeWidth={width} strokeLinecap="round" />;
  };
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label={`clock showing ${hour}:${String(minute).padStart(2, '0')}`} style={{ display: 'block', margin: '0 auto' }}>
      <circle cx={cx} cy={cy} r={r} fill={C.surface} stroke={C.ink} strokeWidth="2.5" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = ((i * 30 - 90) * Math.PI) / 180; const tx = cx + 35 * Math.cos(a); const ty = cy + 35 * Math.sin(a);
        return <text key={i} x={tx} y={ty + 3.5} textAnchor="middle" fontSize="9" fill={C.ink} fontFamily={FONT}>{i === 0 ? 12 : i}</text>;
      })}
      {hand(hourAngle, 20, 4, C.ink)}
      {hand(minAngle, 30, 2.5, C.green)}
      <circle cx={cx} cy={cy} r="2.5" fill={C.ink} />
    </svg>
  );
}

// A number line from 0 to 1 cut into equal steps, with a dot at one of them.
function NumberLine({ parts, mark }) {
  const w = 300; const pad = 16; const y = 26; const step = (w - pad * 2) / parts;
  return (
    <svg viewBox={`0 0 ${w} 56`} width="100%" role="img" aria-label={`number line with ${parts} steps, dot at ${mark}`} style={{ display: 'block', maxWidth: 320, margin: '0 auto', height: 'auto' }}>
      <line x1={pad} y1={y} x2={w - pad} y2={y} stroke={C.ink} strokeWidth="2.5" />
      {Array.from({ length: parts + 1 }).map((_, i) => (
        <g key={i}>
          <line x1={pad + i * step} y1={y - 8} x2={pad + i * step} y2={y + 8} stroke={C.ink} strokeWidth={i === 0 || i === parts ? 2.5 : 1.5} />
          {(i === 0 || i === parts) && <text x={pad + i * step} y={y + 24} textAnchor="middle" fontSize="13" fill={C.ink} fontFamily={FONT}>{i === 0 ? '0' : '1'}</text>}
        </g>
      ))}
      {mark > 0 && <circle cx={pad + mark * step} cy={y} r="7" fill={C.gold} stroke={C.ink} strokeWidth="1.5" />}
    </svg>
  );
}

// An array: rows and columns of dots, the picture of a multiplication.
function ArrayPic({ rows, cols, size = 18 }) {
  const gap = 6; const w = cols * (size + gap) - gap; const h = rows * (size + gap) - gap;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={Math.min(w, 280)} role="img" aria-label={`${rows} rows of ${cols}`} style={{ display: 'block', margin: '0 auto', maxWidth: '100%', height: 'auto' }}>
      {Array.from({ length: rows * cols }).map((_, i) => (
        <circle key={i} cx={(i % cols) * (size + gap) + size / 2} cy={Math.floor(i / cols) * (size + gap) + size / 2} r={size / 2} fill={C.green} />
      ))}
    </svg>
  );
}

// Groups of ten, drawn as neat ten-frames, so counting by tens has something to point at.
function TensGroup({ count, size = 22, animate = false, animKey = 0 }) {
  const gap = 6; const frameW = size * 5 + gap * 4; const frameH = size * 2 + gap;
  const cols = Math.min(count, 5); const rows = Math.ceil(count / 5);
  const w = cols * (frameW + 14) - 14; const h = rows * (frameH + 14) - 14;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={Math.min(w, 300)} role="img" aria-label={`${count} tens`} style={{ display: 'block', maxWidth: '100%', height: 'auto', overflow: 'visible' }}>
      {Array.from({ length: count }).map((_, g) => {
        const ox = (g % 5) * (frameW + 14); const oy = Math.floor(g / 5) * (frameH + 14);
        return (
          <g key={`${animKey}-${g}`} className={animate ? 'edu-drift' : undefined} style={animate ? { animationDelay: `${g * 0.5}s`, transformBox: 'fill-box', transformOrigin: 'center' } : undefined}>
            {Array.from({ length: 10 }).map((__, i) => (
              <rect key={i} x={ox + (i % 5) * (size + gap)} y={oy + Math.floor(i / 5) * (size + gap)} width={size} height={size} rx={size / 2} fill={C.green} />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

// Lines of different lengths, or towers of different heights, for comparing size.
function BarPic({ length, vertical = false, size = 22 }) {
  const cells = Array.from({ length }).map((_, i) => vertical
    ? <rect key={i} x="0" y={(9 - 1 - i) * (size + 3)} width={size * 1.6} height={size} rx="4" fill={C.gold} />
    : <rect key={i} x={i * (size + 3)} y="0" width={size} height={size * 1.6} rx="4" fill={C.gold} />);
  const w = vertical ? size * 1.6 : 9 * (size + 3) - 3; const h = vertical ? 9 * (size + 3) - 3 : size * 1.6;
  return <svg viewBox={`0 0 ${w} ${h}`} width={vertical ? 40 : Math.min(w, 260)} height={vertical ? 160 : undefined} role="img" aria-label={vertical ? `tower ${length}` : `line ${length}`} style={{ display: 'block', margin: '0 auto', maxWidth: '100%' }}>{cells}</svg>;
}

// Solid shapes, drawn with a little shading so they read as things rather than outlines.
// Drawn with gradients rather than a 3D library: the light sits upper left, a soft
// shadow sits beneath, and the whole thing weighs nothing and renders on every device.
function SolidPic({ name, size = 90 }) {
  const clean = String(name).split('#')[0];
  const uid = `s${clean}`;
  const defs = (
    <defs>
      <radialGradient id={`${uid}-ball`} cx="35%" cy="32%" r="70%"><stop offset="0%" stopColor="#9CC7B0" /><stop offset="45%" stopColor={C.green} /><stop offset="100%" stopColor="#1F3B31" /></radialGradient>
      <linearGradient id={`${uid}-side`} x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#6FA189" /><stop offset="100%" stopColor="#2A4E42" /></linearGradient>
      <linearGradient id={`${uid}-top`} x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#A9D2BD" /><stop offset="100%" stopColor="#5E8F7A" /></linearGradient>
      <linearGradient id={`${uid}-cone`} x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#7FB09A" /><stop offset="55%" stopColor={C.green} /><stop offset="100%" stopColor="#1F3B31" /></linearGradient>
      <radialGradient id={`${uid}-shadow`} cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#000" stopOpacity="0.22" /><stop offset="100%" stopColor="#000" stopOpacity="0" /></radialGradient>
    </defs>
  );
  const shadow = <ellipse cx="52" cy="88" rx="30" ry="6" fill={`url(#${uid}-shadow)`} />;
  const body = clean === 'sphere' ? <g>{shadow}<circle cx="50" cy="48" r="36" fill={`url(#${uid}-ball)`} /><ellipse cx="36" cy="34" rx="9" ry="6" fill="#fff" opacity="0.45" /></g>
    : clean === 'cube' ? <g>{shadow}<path d="M22 34 L54 22 L82 34 L50 46 Z" fill={`url(#${uid}-top)`} /><path d="M22 34 L50 46 L50 84 L22 72 Z" fill={C.green} /><path d="M50 46 L82 34 L82 72 L50 84 Z" fill={`url(#${uid}-side)`} /></g>
    : clean === 'cylinder' ? <g>{shadow}<rect x="24" y="24" width="52" height="52" fill={`url(#${uid}-cone)`} /><ellipse cx="50" cy="76" rx="26" ry="10" fill="#2A4E42" /><ellipse cx="50" cy="24" rx="26" ry="10" fill={`url(#${uid}-top)`} /></g>
    : <g>{shadow}<path d="M50 12 L22 74 L78 74 Z" fill={`url(#${uid}-cone)`} /><ellipse cx="50" cy="74" rx="28" ry="10" fill="#2A4E42" /></g>;
  return <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label={clean} style={{ display: 'block', margin: '0 auto' }}>{defs}{body}</svg>;
}

// A ten-frame: two rows of five, some filled. The empty spaces are what a child counts.
function TenFrame({ filled, size = 30 }) {
  const gap = 5; const w = 5 * size + 4 * gap; const h = 2 * size + gap;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={Math.min(w, 260)} role="img" aria-label={`ten frame with ${filled} filled`} style={{ display: 'block', margin: '0 auto', maxWidth: '100%', height: 'auto' }}>
      {Array.from({ length: 10 }).map((_, i) => (
        <g key={i}>
          <rect x={(i % 5) * (size + gap)} y={Math.floor(i / 5) * (size + gap)} width={size} height={size} rx="6" fill={C.surface} stroke={C.line} strokeWidth="2" />
          {i < filled && <circle cx={(i % 5) * (size + gap) + size / 2} cy={Math.floor(i / 5) * (size + gap) + size / 2} r={size * 0.34} fill={C.green} />}
        </g>
      ))}
    </svg>
  );
}

// One of the four kindergarten shapes, drawn large. A choice 'shape:square#2' carries a
// suffix so the same shape can appear twice; the drawing ignores it.
// Simple drawn icons for the spoken science courses. Each is named by the word a child hears.
const ICON_NAMES = ['sun', 'moon', 'cloud', 'rain', 'snow', 'plant', 'tree', 'flower', 'fish', 'bird', 'rock', 'drop', 'ice', 'fire', 'magnet'];
// Tracing and connect-the-dots need a finger or a stylus on a screen, never a mouse.
function hasTouchScreen() { try { return typeof window !== 'undefined' && ((window.matchMedia && window.matchMedia('(pointer: coarse)').matches) || (navigator.maxTouchPoints || 0) > 0); } catch (e) { return false; } }

// The September 11 card. Same words for everyone; an educator can hide it on this device for the year.
function todayLocalIso() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
function RemembranceCard({ educator = false }) {
  const day = remembranceFor(todayLocalIso());
  const key = day ? `edu-remembrance-hidden-${day.id}-${new Date().getFullYear()}` : '';
  const [hidden, setHidden] = useState(() => { try { return key ? localStorage.getItem(key) === '1' : false; } catch (e) { return false; } });
  if (!day || hidden) return null;
  return (
    <div style={{ ...card, borderColor: '#B9C4BF', background: '#F4F6F4', textAlign: 'center' }}>
      <p style={{ margin: '0 0 8px', fontWeight: 700, fontSize: 18 }}>{day.title}</p>
      {day.lines.map((line) => <p key={line} style={{ margin: '0 0 8px', fontSize: 15 }}>{line}</p>)}
      {educator && <p style={{ margin: '4px 0 0', fontSize: 13 }}><button type="button" onClick={() => { try { localStorage.setItem(key, '1'); } catch (e) { /* fine */ } setHidden(true); }} style={{ ...linkBtn, fontSize: 13, padding: 0 }}>Hide this on this device for the rest of the year</button></p>}
    </div>
  );
}

function IconPic({ name, size = 90 }) {
  const gold = C.gold; const green = C.green; const grey = '#8A9086'; const blue = '#4A86C5'; const red = '#C9573E'; const brown = '#8B5A2B';
  const body = {
    sun: <g><defs><radialGradient id="eduSunG" cx="40%" cy="38%" r="65%"><stop offset="0" stopColor="#FFF1B8" /><stop offset="0.6" stopColor={gold} /><stop offset="1" stopColor="#D99A2B" /></radialGradient></defs><circle cx="50" cy="50" r="30" fill={gold} opacity="0.18" /><circle cx="50" cy="50" r="20" fill="url(#eduSunG)" />{[0, 45, 90, 135, 180, 225, 270, 315].map((a) => <line key={a} x1={50 + 28 * Math.cos(a * Math.PI / 180)} y1={50 + 28 * Math.sin(a * Math.PI / 180)} x2={50 + 40 * Math.cos(a * Math.PI / 180)} y2={50 + 40 * Math.sin(a * Math.PI / 180)} stroke={gold} strokeWidth="5" strokeLinecap="round" />)}</g>,
    moon: <path d="M62 14a34 34 0 1 0 0 72 27 27 0 0 1 0-72z" fill={gold} />,
    cloud: <path d="M28 66a14 14 0 0 1 3-27 20 20 0 0 1 38-4 15 15 0 0 1 3 31z" fill="#D6DBD2" stroke={grey} strokeWidth="3" />,
    rain: <g><path d="M28 52a14 14 0 0 1 3-27 20 20 0 0 1 38-4 15 15 0 0 1 3 31z" fill="#D6DBD2" stroke={grey} strokeWidth="3" />{[34, 50, 66].map((x) => <line key={x} x1={x} y1="62" x2={x - 6} y2="82" stroke={blue} strokeWidth="5" strokeLinecap="round" />)}</g>,
    snow: <g><path d="M28 52a14 14 0 0 1 3-27 20 20 0 0 1 38-4 15 15 0 0 1 3 31z" fill="#D6DBD2" stroke={grey} strokeWidth="3" />{[34, 50, 66].map((x) => <circle key={x} cx={x} cy="74" r="5" fill="#fff" stroke={blue} strokeWidth="2" />)}</g>,
    plant: <g><defs><linearGradient id="eduLeafG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#6FAF7E" /><stop offset="1" stopColor="#245A3C" /></linearGradient></defs><rect x="30" y="72" width="40" height="16" rx="4" fill={brown} /><rect x="30" y="72" width="40" height="4" rx="2" fill="#A8743F" opacity="0.7" /><line x1="50" y1="72" x2="50" y2="34" stroke="#3E7D52" strokeWidth="5" strokeLinecap="round" /><ellipse cx="38" cy="48" rx="12" ry="7" fill="url(#eduLeafG)" transform="rotate(-30 38 48)" /><ellipse cx="62" cy="40" rx="12" ry="7" fill="url(#eduLeafG)" transform="rotate(30 62 40)" /></g>,
    tree: <g><defs><radialGradient id="eduTreeG" cx="38%" cy="32%" r="70%"><stop offset="0" stopColor="#7FB58E" /><stop offset="1" stopColor="#245A3C" /></radialGradient></defs><rect x="44" y="60" width="12" height="28" rx="3" fill={brown} /><rect x="47" y="60" width="3" height="28" fill="#A8743F" opacity="0.6" /><circle cx="50" cy="44" r="26" fill="url(#eduTreeG)" /><circle cx="38" cy="36" r="7" fill="#fff" opacity="0.18" /></g>,
    flower: <g><line x1="50" y1="88" x2="50" y2="50" stroke={green} strokeWidth="5" />{[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={50 + 14 * Math.cos(a * Math.PI / 180)} cy={44 + 14 * Math.sin(a * Math.PI / 180)} rx="10" ry="7" fill={red} transform={`rotate(${a} ${50 + 14 * Math.cos(a * Math.PI / 180)} ${44 + 14 * Math.sin(a * Math.PI / 180)})`} />)}<circle cx="50" cy="44" r="8" fill={gold} /></g>,
    fish: <g><defs><linearGradient id="eduFishG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7FB3E6" /><stop offset="1" stopColor="#2F66A8" /></linearGradient></defs><path d="M70 50l18-14v28z" fill="#2F66A8" /><ellipse cx="46" cy="50" rx="28" ry="16" fill="url(#eduFishG)" /><path d="M40 40q8 2 12 10-4 8-12 10" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.5" /><circle cx="32" cy="46" r="3.5" fill="#fff" /><circle cx="33" cy="46" r="1.6" fill="#1a1a1a" /></g>,
    bird: <g><ellipse cx="50" cy="54" rx="22" ry="14" fill={grey} /><circle cx="70" cy="42" r="9" fill={grey} /><path d="M78 42l10 3-10 3z" fill={gold} /><path d="M40 50q10-16 26-6" fill="none" stroke="#6B716A" strokeWidth="4" strokeLinecap="round" /></g>,
    rock: <path d="M22 70q-6-22 18-34 30-10 40 14 6 20-14 24-38 6-44-4z" fill="#A5AAA0" stroke={grey} strokeWidth="3" />,
    drop: <g><defs><radialGradient id="eduDropG" cx="38%" cy="55%" r="70%"><stop offset="0" stopColor="#9CC7F0" /><stop offset="1" stopColor="#2F66A8" /></radialGradient></defs><path d="M50 14q26 34 26 50a26 26 0 0 1-52 0q0-16 26-50z" fill="url(#eduDropG)" /><ellipse cx="40" cy="58" rx="5" ry="9" fill="#fff" opacity="0.45" transform="rotate(-20 40 58)" /></g>,
    ice: <g><rect x="24" y="30" width="52" height="46" rx="6" fill="#DDEBF7" stroke={blue} strokeWidth="3" /><line x1="34" y1="40" x2="46" y2="52" stroke="#fff" strokeWidth="4" strokeLinecap="round" /></g>,
    fire: <path d="M50 12q22 22 22 44a22 22 0 0 1-44 0q0-10 8-18 0 12 8 14-2-20 6-40z" fill={red} />,
    magnet: <g><path d="M30 20v34a20 20 0 0 0 40 0V20" fill="none" stroke={red} strokeWidth="14" strokeLinecap="butt" /><rect x="23" y="20" width="14" height="16" fill={grey} /><rect x="63" y="20" width="14" height="16" fill={grey} /></g>,
  }[name] || <circle cx="50" cy="50" r="30" fill={grey} />;
  return <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label={name} style={{ display: 'block', margin: '0 auto' }}>{body}</svg>;
}

function ShapePic({ name, size = 90, color = C.green }) {
  const clean = String(name).split('#')[0];
  const body = clean === 'circle' ? <circle cx="50" cy="50" r="38" fill={color} />
    : clean === 'triangle' ? <path d="M50 12 L88 84 L12 84 Z" fill={color} />
    : clean === 'square' ? <rect x="14" y="14" width="72" height="72" rx="4" fill={color} />
    : <rect x="6" y="26" width="88" height="48" rx="4" fill={color} />;
  return <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label={clean} style={{ display: 'block', margin: '0 auto' }}>{body}</svg>;
}

function DotGroup({ count, size = 34, animate = false, animKey = 0 }) {
  const cols = 5; const rows = Math.ceil(count / cols); const gap = 8;
  const w = cols * size + (cols - 1) * gap; const h = rows * size + (rows - 1) * gap;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} role="img" aria-label={`${count} dots`} style={{ display: 'block', maxWidth: '100%', overflow: 'visible' }}>
      <defs>
        <radialGradient id="edu-ball" cx="35%" cy="32%" r="70%"><stop offset="0%" stopColor="#9CC7B0" /><stop offset="45%" stopColor={C.green} /><stop offset="100%" stopColor="#1F3B31" /></radialGradient>
      </defs>
      {Array.from({ length: count }).map((_, i) => (
        <circle key={`${animKey}-${i}`} className={animate ? 'edu-drift' : undefined}
          style={animate ? { animationDelay: `${i * 0.55}s`, transformBox: 'fill-box', transformOrigin: 'center' } : undefined}
          cx={(i % cols) * (size + gap) + size / 2} cy={Math.floor(i / cols) * (size + gap) + size / 2} r={size / 2 - 2} fill="url(#edu-ball)" />
      ))}
    </svg>
  );
}

// A small picture for each pre-K skill fold, drawn from the same shapes the lessons use, so a
// child who cannot read the word Colors still knows which fold it is.
function SkillIcon({ skill, size = 40 }) {
  const g = C.green; const ink = C.ink;
  const body = {
    Colors: <g><rect x="8" y="26" width="38" height="48" rx="8" fill={SWATCH.red} /><rect x="54" y="26" width="38" height="48" rx="8" fill={SWATCH.blue} /></g>,
    Shapes: <g><circle cx="30" cy="50" r="22" fill={g} /><path d="M56 72 L96 72 L76 30 Z" fill={SWATCH.yellow} /></g>,
    Sizes: <g><circle cx="36" cy="54" r="30" fill={g} /><circle cx="82" cy="70" r="13" fill={g} /></g>,
    Matching: <g><circle cx="28" cy="50" r="20" fill={SWATCH.red} /><circle cx="72" cy="50" r="20" fill={SWATCH.red} /></g>,
    Patterns: <g><circle cx="16" cy="50" r="12" fill={SWATCH.red} /><rect x="36" y="38" width="24" height="24" rx="4" fill={SWATCH.blue} /><circle cx="84" cy="50" r="12" fill={SWATCH.red} /></g>,
    Counting: <g>{[24, 50, 76].map((x) => <circle key={x} cx={x} cy="50" r="11" fill={g} />)}</g>,
    Comparing: <g>{[20, 44].map((x) => <circle key={x} cx={x} cy="40" r="9" fill={g} />)}<circle cx="32" cy="62" r="9" fill={g} /><circle cx="80" cy="50" r="9" fill={g} /><line x1="58" y1="24" x2="58" y2="76" stroke={C.line} strokeWidth="3" /></g>,
    Listening: <g><path d="M22 40h14l18-14v48L36 60H22z" fill={C.gold} /><path d="M62 38a14 14 0 010 24M72 30a24 24 0 010 40" fill="none" stroke={C.gold} strokeWidth="6" strokeLinecap="round" /></g>,
    Letters: <text x="50" y="66" textAnchor="middle" fontFamily={FONT} fontSize="48" fontWeight="700" fill={g}>Aa</text>,
    Drawing: <g><path d="M18 78 C30 40, 60 40, 82 24" fill="none" stroke={g} strokeWidth="7" strokeLinecap="round" /><circle cx="18" cy="78" r="8" fill={C.gold} /></g>,
    'Getting along': <g><circle cx="32" cy="50" r="20" fill={SWATCH.yellow} /><circle cx="68" cy="50" r="20" fill={SWATCH.yellow} />{[[24, 45], [34, 45], [60, 45], [70, 45]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="2.6" fill={ink} />)}<path d="M23 56q9 8 18 0M59 56q9 8 18 0" fill="none" stroke={ink} strokeWidth="2.6" strokeLinecap="round" /></g>,
  }[skill];
  if (!body) return null;
  return <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}>{body}</svg>;
}

// Draws whichever picture a lesson or question asks for.
function Picture({ visual, animate = false, animKey = 0, nudge = 0 }) {
  if (!visual) return null;
  if (visual.kind === 'dots') return <div style={{ padding: '6px 0' }}><DotGroup count={visual.count} animate={animate} animKey={animKey} /></div>;
  if (visual.kind === 'trace') return <div style={{ padding: '6px 0' }}><TraceDemo letter={visual.text} animKey={animKey} pace={visual.pace} nudge={nudge} /></div>;
  if (DIAGRAMS[visual.kind]) { const D = DIAGRAMS[visual.kind]; return <div key={animKey} style={{ padding: '6px 0' }}><D {...visual} /></div>; }
  if (visual.kind === 'numberline' && visual.from !== undefined) return <div key={animKey} style={{ padding: '6px 0' }}><NumberLinePic from={visual.from} to={visual.to} mark={visual.mark ?? null} marks={visual.marks || []} /></div>;
  if (visual.kind === 'tri') return <div key={animKey} style={{ padding: '6px 0' }}><TriPic base={visual.base} height={visual.height} area={visual.area} /></div>;
  if (visual.kind === 'para') return <div key={animKey} style={{ padding: '6px 0' }}><ParaPic base={visual.base} height={visual.height} side={visual.side} /></div>;
  if (visual.kind === 'periodic') return <div key={animKey} style={{ padding: '6px 0' }}><PeriodicPic highlight={visual.highlight || []} period={visual.period || null} group={visual.group || null} /></div>;
  if (visual.kind === 'pic') return <div key={animKey} className={animate ? 'edu-drift' : undefined} style={{ padding: '6px 0', display: 'flex', justifyContent: 'center' }}><StudentPicture name={visual.name} size={110} /></div>;
  if (visual.kind === 'art') return <div key={animKey} className={animate ? 'edu-drift' : undefined} style={{ padding: '6px 0', display: 'flex', justifyContent: 'center' }}><ColorThumb picture={visual.name} size={120} /></div>;
  if (visual.kind === 'icon') return <div key={animKey} className={animate ? 'edu-drift' : undefined} style={{ padding: '6px 0' }}><IconPic name={visual.name} size={110} /></div>;
  if (visual.kind === 'shape') return <div key={animKey} className={animate ? 'edu-drift' : undefined} style={{ padding: '6px 0' }}><ShapePic name={visual.name} size={visual.size === 'big' ? 140 : visual.size === 'small' ? 50 : 110} /></div>;
  if (visual.kind === 'tens') return <div style={{ padding: '6px 0' }}><TensGroup count={visual.count} animate={animate} animKey={animKey} /></div>;
  if (visual.kind === 'array') return <div style={{ padding: '6px 0' }}><ArrayPic rows={visual.rows} cols={visual.cols} /></div>;
  if (visual.kind === 'numberline') return <div style={{ padding: '6px 0' }}><NumberLine parts={visual.parts} mark={visual.mark} /></div>;
  if (visual.kind === 'clock') return <div style={{ padding: '6px 0' }}><ClockPic hour={visual.hour} minute={visual.minute} /></div>;
  // Two things side by side: two shapes, two colors, two groups of dots. Each half is any picture
  // this function can draw, so "red and blue are colors" shows red beside blue, not red alone.
  if (visual.kind === 'pair') {
    const half = (v, i) => (v.kind ? <div key={`${animKey}-${i}`} className={animate ? 'edu-drift' : undefined} style={{ animationDelay: `${i * 0.5}s`, maxWidth: '46%', transform: 'scale(0.85)' }}><Picture visual={v} /></div> : <Item key={i} spec={`${v.shape}-${v.colour}`} size={96} />);
    return <div style={{ padding: '6px 0', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 28 }}>{half(visual.a, 0)}{half(visual.b, 1)}</div>;
  }
  if (visual.kind === 'swatch') return <div key={animKey} className={animate ? 'edu-drift' : undefined} style={{ padding: '6px 0' }}><Swatch colour={visual.colour} size={120} /></div>;
  if (visual.kind === 'item') return <div style={{ padding: '6px 0' }}><Item spec={`${visual.shape}-${visual.colour}`} size={110} /></div>;
  if (visual.kind === 'pattern') return <div key={animKey} className={animate ? 'edu-rise' : undefined} style={{ padding: '6px 0' }}><PatternRow items={visual.items} colour={visual.colour || 'green'} /></div>;
  if (visual.kind === 'solid') return <div key={animKey} className={animate ? 'edu-drift' : undefined} style={{ padding: '6px 0' }}><SolidPic name={visual.name} size={110} /></div>;
  if (visual.kind === 'tenframe') return <div key={animKey} className={animate ? 'edu-rise' : undefined} style={{ padding: '6px 0' }}><TenFrame filled={visual.filled} /></div>;
  if (visual.kind === 'bars') return <div style={{ padding: '6px 0', display: 'grid', gap: 10 }}>{visual.lengths.map((n, i) => <BarPic key={`${animKey}-${i}`} length={n} />)}</div>;
  if (visual.kind === 'letters') {
    // Words and expressions ("ethos pathos logos", "5x + 3 = 2x + 15") are shown as one centered
    // line that wraps. Only short runs of single letters are spelled out large, one by one.
    const tokens = visual.text.split(' ');
    if (tokens.some((t) => t.length > 1) && visual.text.replace(/\s/g, '').length > 4 && !visual.highlight) {
      return <p style={{ fontSize: 28, fontWeight: 700, margin: '6px 0', textAlign: 'center', color: C.green, lineHeight: 1.3, wordBreak: 'break-word' }}>{visual.text}</p>;
    }
    // Each letter swells as it is named, so a child who cannot read still knows which one
    // is being talked about.
    const parts = visual.text.split('');
    // With a highlight, the named part of each word is emphasized as one piece: it turns gold,
    // sits a little larger, and swells together, word by word. The other letters stay quiet.
    if (visual.highlight) {
      const words = visual.text.split(' ');
      return (
        <p style={{ fontSize: 44, fontWeight: 700, letterSpacing: 6, margin: '6px 0', textAlign: 'center', color: C.green }}>
          {words.map((w, wi) => {
            const at = visual.highlight === 'first' ? 0 : w.toLowerCase().lastIndexOf(visual.highlight.toLowerCase());
            const len = visual.highlight === 'first' ? 1 : visual.highlight.length;
            const before = at >= 0 ? w.slice(0, at) : w; const hot = at >= 0 ? w.slice(at, at + len) : ''; const after = at >= 0 ? w.slice(at + len) : '';
            return (
              <span key={`${animKey}-${wi}`} style={{ display: 'inline-block', marginRight: wi < words.length - 1 ? 18 : 0 }}>
                {before}
                {hot && <span className={animate ? 'edu-stress' : undefined} style={{ display: 'inline-block', color: C.gold, transform: 'scale(1.12)', transformOrigin: 'center', animationDelay: `${0.4 + wi * 0.9}s` }}>{hot}</span>}
                {after}
              </span>
            );
          })}
        </p>
      );
    }
    return (
      <p style={{ fontSize: 44, fontWeight: 700, letterSpacing: 6, margin: '6px 0', textAlign: 'center', color: C.green }}>
        {parts.map((ch, i) => (
          <span key={`${animKey}-${i}`} className={animate && ch.trim() ? 'edu-grow' : undefined}
            style={animate && ch.trim() ? { display: 'inline-block', animationDelay: `${parts.slice(0, i).filter((x) => x.trim()).length * 0.75}s` } : undefined}>
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        ))}
      </p>
    );
  }
  return <FractionBar parts={visual.parts} shaded={visual.shaded} />;
}

// Read text aloud with the browser's built-in voice. Free, no service, no data sent.
// Voices come from the device, not from us, so quality varies by phone. We pick the
// most natural-sounding English voice the device offers (preferring the softer female
// voices), and fall back to whatever exists. A truly natural voice needs a paid
// text-to-speech service; that is a phase 1 decision.
// Warm, clear, female voices first, on whichever device this is. Names are matched loosely
// because each maker names its voices differently.
const PREFERRED_VOICES = ['Ava', 'Samantha', 'Allison', 'Microsoft Aria', 'Microsoft Jenny', 'Google US English', 'Karen', 'Moira', 'Microsoft Zira', 'Tessa', 'Victoria', 'Fiona', 'Susan', 'Joanna', 'Salli'];
function pickVoice() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices() || [];
  const english = voices.filter((v) => /^en/i.test(v.lang));
  for (const name of PREFERRED_VOICES) { const v = english.find((x) => x.name.includes(name)); if (v) return v; }
  return english.find((v) => /female/i.test(v.name)) || english[0] || null;
}
// Some previews and older browsers have no speech at all. We check once so the screen can
// say so plainly instead of leaving a button that looks broken.
function canSpeak() {
  return typeof window !== 'undefined' && !!window.speechSynthesis && typeof window.SpeechSynthesisUtterance === 'function';
}

// A soft two-note blip when a young learner taps an answer. Made with the browser's own
// sound engine, so there is no file to load and it works offline. Silent where blocked.
let tapAudio = null;
function playTap() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    tapAudio = tapAudio || new Ctx();
    if (tapAudio.state === 'suspended') tapAudio.resume();
    const now = tapAudio.currentTime;
    const o = tapAudio.createOscillator(); const g = tapAudio.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(520, now); o.frequency.exponentialRampToValueAtTime(780, now + 0.09);
    g.gain.setValueAtTime(0.0001, now); g.gain.exponentialRampToValueAtTime(0.18, now + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
    o.connect(g); g.connect(tapAudio.destination); o.start(now); o.stop(now + 0.17);
  } catch (e) { /* no sound is never a problem */ }
}

// Device voices read letters, not sounds: "mmm" comes out as em, em, em. These swaps
// give each sustained sound a spelling the voice will hum or hiss instead. Recorded
// audio, when it comes, replaces this for good.
// "hmm" put an H in front of the M sound, which was wrong. Each sound is now spoken as the
// stretched start of a word the voice knows how to say: mmmoon, sssun, fffish. The letters
// run into the word, so the sound is held and the word confirms it. The screen keeps "mmm".
const stretch = (letter, word) => letter.repeat(44) + word;
const SOUND_SPEECH = [[/\bmmm\b/gi, stretch('m', 'oon')], [/\bnnn\b/gi, stretch('n', 'ut')], [/\bsss\b/gi, stretch('s', 'un')], [/\bfff\b/gi, stretch('f', 'ish')], [/\bzzz\b/gi, stretch('z', 'ip')], [/\brrr\b/gi, stretch('r', 'un')], [/\blll\b/gi, stretch('l', 'ion')]];
const SOUND_TOKEN = /\b(mmm|nnn|sss|fff|zzz|rrr|lll)\b/gi;
function speechFriendly(text) { let out = String(text); for (const [re, to] of SOUND_SPEECH) out = out.replace(re, to); return out; }
// A line is spoken in pieces: ordinary words at the normal pace, and each sustained sound
// as its own slow, stretched utterance, so "mmm" is held rather than clipped.
// Speech is shaped sentence by sentence so it sounds like a person rather than a flat run:
// a one-word sentence is the word at play, so it is held slowly and a little higher; a
// question lifts at the end; everything else rolls along at an easy pace. Sustained sounds
// stay their own long, slow pieces.
function speechPieces(text) {
  const src = String(text);
  const sentences = src.split(/(?<=[.!?])\s+/).filter((x) => x.trim());
  const pieces = [];
  for (const sentence of sentences) {
    const words = sentence.replace(/[.!?]+$/, '').trim().split(/\s+/).filter(Boolean);
    const shape = words.length === 1 && !/\d/.test(words[0]) ? 'key' : /\?$/.test(sentence.trim()) ? 'question' : 'plain';
    let last = 0;
    for (const m of sentence.matchAll(SOUND_TOKEN)) {
      if (m.index > last) pieces.push({ text: sentence.slice(last, m.index), shape });
      pieces.push({ text: speechFriendly(m[0]), shape: 'sound' });
      last = m.index + m[0].length;
    }
    if (last < sentence.length) pieces.push({ text: sentence.slice(last), shape });
  }
  // A piece that is only punctuation would be read aloud as a word. Drop it.
  return pieces.filter((p) => /[A-Za-z0-9]/.test(p.text));
}
const SPEECH_SHAPES = { key: { rate: 0.6, pitch: 1.25 }, question: { rate: 0.9, pitch: 1.22 }, plain: { rate: 0.86, pitch: 1.15 }, sound: { rate: 0.1, pitch: 1.15 } };

// Slower and Faster on a tracing lesson move the voice with the drawing: -1 slows every line to
// three quarters speed, +1 quickens it a little. Reset to 0 whenever a lesson opens.
let SPEECH_NUDGE = 0;
function setSpeechNudge(n) { SPEECH_NUDGE = n; }
// Speech is scheduled, never fired in the same tick as a cancel: Chrome drops an utterance queued
// right after cancel(), and lets go of one that nothing holds a reference to. So every request
// takes a ticket, waits a beat, keeps its utterances alive, and if nothing is speaking shortly
// after, sends them once more. A newer request cancels an older one, so moving quickly through
// questions never plays the last question's words over the next one.
let speechTicket = 0;
let speechAlive = [];   // the utterances now speaking, held so the browser cannot collect them
function speak(text) {
  if (typeof window === 'undefined' || !window.speechSynthesis || !text) return;
  const ticket = ++speechTicket;
  const pieces = speechPieces(text);
  if (!pieces.length) return;
  const send = () => {
    if (ticket !== speechTicket) return;
    try {
      const voice = pickVoice();
      speechAlive = pieces.map((piece) => {
        const u = new SpeechSynthesisUtterance(piece.text);
        if (voice) u.voice = voice;
        const shape = SPEECH_SHAPES[piece.shape] || SPEECH_SHAPES.plain;
        u.rate = shape.rate * (SPEECH_NUDGE < 0 ? 0.75 : SPEECH_NUDGE > 0 ? 1.1 : 1); u.pitch = shape.pitch;
        return u;
      });
      speechAlive.forEach((u) => window.speechSynthesis.speak(u));
    } catch (e) { /* a broken voice must never stop a lesson */ }
  };
  const ss = window.speechSynthesis;
  // A voice already talking is stopped first, and the new words follow a beat later; a quiet voice is spoken to at once.
  if (ss.speaking || ss.pending) { try { ss.cancel(); } catch (e) { /* a broken voice must never stop a lesson */ } setTimeout(send, 80); } else send();
  // One retry: a voice that never started is asked again; one that started is left alone.
  setTimeout(() => { if (ticket === speechTicket && ss.speaking === false && ss.pending === false) { try { ss.cancel(); } catch (e) { /* as above */ } setTimeout(send, 80); } }, 700);
}

// A small round i that sits inside a sentence, after the last word it explains.
function inlineInfoStyle(open) {
  return { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, borderRadius: '50%', border: `1.5px solid ${C.green}`, background: open ? C.green : 'none', color: open ? '#fff' : C.green, fontFamily: FONT, fontSize: 12, fontWeight: 700, cursor: 'pointer', verticalAlign: 'middle', padding: 0, marginLeft: 4 };
}
// A lesson's ways: the caption is way 0 and each `another` entry, a string or { text, visual }, is one more.
// The picture for a way is its own when it has one, else the lesson's example drawing.
function wayText(w) { return typeof w === 'string' ? w : (w && w.text) || ''; }
function wayVisual(example, at) { const w = at > 0 ? [].concat(example.another || [])[at - 1] : null; return w && typeof w === 'object' && w.visual ? { ...w.visual, caption: example.caption } : example; }
// A line split into its sentences, for reading along.
function sentencesOf(text) { return String(text || '').split(/(?<=[.!?])\s+/).filter(Boolean); }
// Speaks a list of texts one after another and reports which one is playing, so a page can
// light the paragraph being read. Returns a stop function. Uses the same ticket as speak().
// Purchased audio: when the build lists a clip for a key (audio/<key>.mp3, keys like S7-0 for a story's
// title, S7-3 for its third paragraph, or counting-k:tracing-letters:2:1 for a lesson line's sentence),
// the clip plays in place of the device voice and the same read-along lighting follows it.
function clipFor(key) { return typeof window !== 'undefined' && Array.isArray(window.__eduAudio) && key && window.__eduAudio.includes(key) ? `audio/${key}.mp3` : null; }
function speakSequence(texts, onIndex, onDone, keys = []) {
  if (typeof window === 'undefined' || !texts.length) return () => {};
  if (keys.length && keys.every((k) => clipFor(k))) {
    let stopped = false; let current = null;
    const play = (i) => {
      if (stopped) return; if (i >= texts.length) { onDone && onDone(); return; }
      onIndex(i); current = new Audio(clipFor(keys[i])); current.onended = () => play(i + 1); current.onerror = () => play(i + 1);
      current.play().catch(() => play(i + 1));
    };
    play(0);
    return () => { stopped = true; if (current) { try { current.pause(); } catch (e) { /* a broken clip must never stop a story */ } } onDone && onDone(); };
  }
  if (!window.speechSynthesis) return () => {};
  const ticket = ++speechTicket; const ss = window.speechSynthesis;
  const stop = () => { if (ticket === speechTicket) speechTicket += 1; try { ss.cancel(); } catch (e) { /* a broken voice must never stop a story */ } onDone && onDone(); };
  const say = (i) => {
    if (ticket !== speechTicket) return;
    if (i >= texts.length) { onDone && onDone(); return; }
    onIndex(i);
    const pieces = speechPieces(texts[i]); if (!pieces.length) { say(i + 1); return; }
    const voice = pickVoice(); let left = pieces.length;
    pieces.forEach((piece) => {
      const u = new SpeechSynthesisUtterance(piece.text); if (voice) u.voice = voice;
      const shape = SPEECH_SHAPES[piece.shape] || SPEECH_SHAPES.plain; u.rate = shape.rate * (SPEECH_NUDGE < 0 ? 0.75 : SPEECH_NUDGE > 0 ? 1.1 : 1); u.pitch = shape.pitch;
      u.onend = () => { left -= 1; if (left === 0) say(i + 1); }; u.onerror = () => { left -= 1; if (left === 0) say(i + 1); };
      try { ss.speak(u); } catch (e) { left -= 1; if (left === 0) say(i + 1); }
    });
  };
  if (ss.speaking || ss.pending) { try { ss.cancel(); } catch (e) { /* as above */ } setTimeout(() => say(0), 80); } else say(0);
  return stop;
}
// One button for every read-aloud spot. If the device or preview has no speech, the
// button is replaced by a short note, so nothing on screen looks broken or unresponsive.
// Every read-aloud spot has one of these. `corner` puts a small speaker button in the top
// right of the card it sits in; otherwise it is a full button. The "on silent" note is
// shown by the page, at its foot, once anything has been spoken.
let onSpoke = null;
function SpeakButton({ text, label, full = false, corner = false, mini = false }) {
  // Tapping while it reads stops it; the button watches the voice so the label follows what is happening.
  const [reading, setReading] = useState(false);
  useEffect(() => { if (!reading) return undefined; const t = setInterval(() => { if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) setReading(false); }, 300); return () => clearInterval(t); }, [reading]);
  if (!canSpeak()) {
    return corner || mini ? null : <p style={{ margin: '0 0 12px', fontSize: 14, color: C.muted }}>Reading aloud is not available on this device or in this preview. The words are all on screen.</p>;
  }
  const press = () => { if (reading) { speechTicket += 1; window.speechSynthesis.cancel(); setReading(false); return; } speak(text); setReading(true); if (onSpoke) onSpoke(); };
  const shownLabel = reading ? 'Stop reading' : label;
  if (mini) {
    return (
      <button type="button" onClick={press} aria-label={shownLabel} title={shownLabel} className="edu-press"
        style={{ width: 44, height: 44, borderRadius: 999, border: `3px solid ${C.gold}`, background: reading ? C.gold : C.goldSoft, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill={C.ink} /><path d="M16 8.5a4.5 4.5 0 0 1 0 7M18.5 6a8 8 0 0 1 0 12" fill="none" stroke={C.ink} strokeWidth="1.8" strokeLinecap="round" /></svg>
      </button>
    );
  }
  if (corner) {
    return (
      <button type="button" onClick={press} aria-label={shownLabel} title={shownLabel} className="edu-press edu-sway"
        style={{ position: 'absolute', top: 12, right: 12, width: 48, height: 48, borderRadius: 999, border: `3px solid ${C.gold}`, background: C.goldSoft, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
        <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
          <path d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4z" fill={C.gold} />
          <path d="M15.5 8.5a5 5 0 010 7M18 6a8.5 8.5 0 010 12" fill="none" stroke={C.gold} strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    );
  }
  return (
    <div style={{ marginBottom: 12, textAlign: 'center' }}>
      <Btn full={full} kind="secondary" onClick={press}>{shownLabel}</Btn>
    </div>
  );
}
function SilentNote({ shown }) {
  return shown && canSpeak() ? <p style={{ margin: '14px 0 0', fontSize: 13, color: C.muted, textAlign: 'center' }}>If you hear nothing, check that your device is not on silent.</p> : null;
}

function LabeledBar({ parts, shaded, label, color }) {
  return (
    <div style={{ marginTop: 8 }}>
      <FractionBar parts={parts} shaded={shaded} color={color} height={30} />
      <p style={{ margin: '4px 0 0', fontSize: 14, color: C.muted }}>{label}</p>
    </div>
  );
}

// The logo. Geometry comes from logic.mjs (buildSphereArcs / layoutWord etc.),
// so the mark is identical everywhere and is changed by editing numbers, not by redrawing.
// Rounded letter edges come from stroking each letter with its own color; "Sphere" also
// gets a background-colored halo so it reads cleanly where it overlaps "EDU".
const LOGO = (() => {
  const cx = 150; const cy = 152; const r = 122;
  const edu = layoutWord('EDU', 52, 76, 166, -0.03);
  const sphere = layoutWord('Sphere', 52, 92, 202, -0.03);
  const boxOf = (w, descender) => ({ x: w.x - 8, y: w.y - 0.75 * w.size - 8, w: w.width + 16, h: 0.75 * w.size + descender * w.size + 16 });
  const keepOut = [boxOf(edu, 0.02), boxOf(sphere, 0.25)];
  return {
    edu,
    sphere,
    arcs: buildSphereArcs(cx, cy, r, 44, keepOut, 2200),
    flecks: buildSphereFlecks(cx, cy, r, 5, keepOut, 3),
    accent: buildAccentArc(62, 238, 236, 16),
  };
})();

// Once, on arrival, the arcs sketch themselves on and the words settle into place. After
// that it holds still. On a desktop the arcs near the pointer fade out and back, which
// costs nothing and gives people something to play with. Every part of this is CSS
// transform, opacity and stroke-dashoffset, so it runs the same on an old Chromebook as
// on a new iPad, and none of it delays anything: the buttons work from the first frame.
function Logo({ width = 250, animate = false }) {
  const svgRef = useRef(null);
  const [clearing, setClearing] = useState(null); // pointer position in viewBox units, or null
  const onMove = (e) => {
    const svg = svgRef.current;
    if (!svg) return;
    const box = svg.getBoundingClientRect();
    setClearing({ x: ((e.clientX - box.left) / box.width) * 320, y: ((e.clientY - box.top) / box.height) * 280 });
  };
  // Distance from the pointer to the middle of an arc decides how faded it is.
  const fadeFor = (points) => {
    if (!clearing) return 1;
    const nums = points.split(/[ ,]/).map(Number);
    const mid = Math.floor(nums.length / 4) * 2;
    const d = Math.hypot(nums[mid] - clearing.x, nums[mid + 1] - clearing.y);
    return d < 24 ? 0.08 : d < 38 ? 0.45 : 1;
  };
  // A letter near the pointer thins out and comes back, the same way the arcs do.
  const letterFade = (p) => { if (!clearing) return 1; const d = Math.hypot(p.cx - clearing.x, p.cy - clearing.y); return d < 18 ? 0.06 : d < 30 ? 0.4 : 1; };
  const letters = (word, fill, halo) => (
    <>
      {halo ? <g fill={C.bg} stroke={C.bg} strokeWidth={halo} strokeLinejoin="round" strokeLinecap="round">{word.paths.map((p, i) => <path key={i} d={p.d} transform={p.transform} />)}</g> : null}
      <g fill={fill} stroke={fill} strokeWidth={9} strokeLinejoin="round" strokeLinecap="round">{word.paths.map((p, i) => <path key={i} d={p.d} transform={p.transform} style={{ opacity: letterFade(p), transition: 'opacity 0.35s ease' }} />)}</g>
    </>
  );
  return (
    <svg ref={svgRef} viewBox="0 0 320 280" width={width} role="img" aria-label="EduSphere"
      onMouseMove={onMove} onMouseLeave={() => setClearing(null)}
      style={{ display: 'block', margin: '0 auto', maxWidth: '100%', height: 'auto' }}>
      {LOGO.arcs.map((a, i) => (
        <polyline key={`a${i}`} points={a.points} fill="none" stroke={a.gold ? C.gold : C.green} strokeWidth={a.width} strokeLinecap="round"
          className={animate ? 'edu-draw' : undefined}
          style={{ strokeOpacity: a.opacity * fadeFor(a.points), transition: 'stroke-opacity 0.35s ease', animationDelay: animate ? `${(i % 23) * 0.05}s` : undefined }} />
      ))}
      {LOGO.flecks.map((f, i) => <polyline key={`f${i}`} points={f.points} fill="none" stroke={C.gold} strokeWidth={1.3} strokeOpacity={f.opacity} strokeLinecap="round" className={animate ? 'edu-draw' : undefined} style={{ animationDelay: animate ? '1.1s' : undefined }} />)}
      <polyline points={LOGO.accent} fill="none" stroke={C.gold} strokeWidth={2.1} strokeOpacity={0.85} strokeLinecap="round" className={animate ? 'edu-draw' : undefined} style={{ animationDelay: animate ? '0.9s' : undefined }} />
      <g className={animate ? 'edu-settle' : undefined} style={{ transformOrigin: '160px 150px' }}>{letters(LOGO.edu, C.green, 0)}</g>
      <g className={animate ? 'edu-settle-late' : undefined} style={{ transformOrigin: '160px 190px' }}>{letters(LOGO.sphere, C.gold, 18)}</g>
    </svg>
  );
}

// The Wonder button gets a gentle shimmer and a few twinkling sparks, so an open
// question feels like a treat rather than more work. Anyone who has asked their device
// to reduce motion sees a plain button instead.
const PRINT_STYLES = `
.edu-print-only { display: none; }
@media print {
  /* On the certificate screen only the sheet prints, on a sideways page. */
  body.edu-cert-mode * { visibility: hidden; }
  body.edu-cert-mode .edu-cert-sheet, body.edu-cert-mode .edu-cert-sheet * { visibility: visible; }
  body.edu-cert-mode .edu-cert-sheet { position: absolute; left: 0; top: 0; width: 100%; }
  body.edu-cert-mode { page: cert; }
  @page cert { size: landscape; margin: 8mm; }
  body.edu-cert-mode:has(.edu-cert-portrait) { page: certup; }
  @page certup { size: portrait; margin: 8mm; }
  /* On the story page only the story prints: its title, pictures and words, upright. */
  body.edu-story-mode * { visibility: hidden; }
  body.edu-story-mode .edu-story-sheet, body.edu-story-mode .edu-story-sheet * { visibility: visible; }
  body.edu-story-mode .edu-story-sheet { position: absolute; left: 0; top: 0; width: 100%; }
  body.edu-story-mode .edu-no-print { display: block !important; }   /* the story window is inside a no-print overlay; the mode shows only the sheet anyway */
  body.edu-story-mode .edu-story-sheet button { display: none; }
  /* The weekly note prints alone, from its own Print link. */
  body.edu-note-mode * { visibility: hidden; }
  body.edu-note-mode .edu-weekly-note, body.edu-note-mode .edu-weekly-note * { visibility: visible; }
  body.edu-note-mode .edu-weekly-note { position: absolute; left: 0; top: 0; width: 100%; }
  body.edu-note-mode .edu-weekly-note button, body.edu-note-mode .edu-weekly-note textarea { display: none; }
  /* The class's weekly notes print alone from the Who Needs Help page. */
  body.edu-classnotes-mode * { visibility: hidden; }
  body.edu-classnotes-mode .edu-class-notes, body.edu-classnotes-mode .edu-class-notes * { visibility: visible; }
  body.edu-classnotes-mode .edu-class-notes { position: absolute; left: 0; top: 0; width: 100%; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 16px; }
  /* Everything folded away on screen is opened for the printer, so a printed report is complete. */
  .edu-collapsible { display: block !important; }
  .edu-no-print { display: none !important; }
  .edu-print-only { display: block !important; }
  /* On paper a button is just its words: no border, no fill, so a report reads as a report. */
  .edu-wrap button { border: none !important; background: none !important; color: inherit !important; padding: 0 !important; box-shadow: none !important; }
  .edu-frame { display: none !important; }
  body { background: #fff; }
}`;

const KID_ANIMATION = `
/* Transform and opacity only. Both are hardware accelerated, work in every browser worth
   supporting, and never move an element's real position, so a tap target stays tappable. */
@keyframes edu-halo { 0%, 100% { transform: scale(1); opacity: 0.45; } 50% { transform: scale(1.28); opacity: 0; } }
@keyframes edu-drift-in { 0% { transform: translateX(-46px) scale(0.4); opacity: 0; } 60% { opacity: 1; } 100% { transform: translateX(0) scale(1); opacity: 1; } }
@keyframes edu-cheer { 0%, 100% { transform: translateY(0) scale(1); } 25% { transform: translateY(-16px) scale(1.05); } 55% { transform: translateY(0) scale(0.97); } 75% { transform: translateY(-6px) scale(1.02); } }
@keyframes edu-wobble { 0%, 100% { transform: translateX(0) rotate(0deg); } 20% { transform: translateX(-9px) rotate(-2deg); } 40% { transform: translateX(9px) rotate(2deg); } 60% { transform: translateX(-5px) rotate(-1deg); } 80% { transform: translateX(5px) rotate(1deg); } }
@keyframes edu-burst { 0% { transform: translate(0, 0) scale(0.2) rotate(0deg); opacity: 1; } 100% { transform: translate(var(--dx), var(--dy)) scale(1) rotate(140deg); opacity: 0; } }
@keyframes edu-rise { 0% { transform: translateY(14px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
@keyframes edu-sway { 0%, 100% { transform: rotate(-2.5deg); } 50% { transform: rotate(2.5deg); } }
@keyframes edu-grow { 0%, 55%, 100% { transform: scale(1); color: inherit; } 20%, 35% { transform: scale(1.55); } }
@keyframes edu-draw { 0% { stroke-dashoffset: 400; } 100% { stroke-dashoffset: 0; } }
@keyframes edu-settle { 0% { transform: translateY(-8px) scale(1.03); opacity: 0; } 100% { transform: translateY(0) scale(1); opacity: 1; } }
@keyframes edu-twinkle-star { 0%, 100% { transform: scale(1) rotate(0deg); } 50% { transform: scale(1.18) rotate(9deg); } }

/* A halo behind a button, so the invitation to tap pulses while the button itself holds still. */
.edu-halo { animation: edu-halo 1.9s ease-out infinite; }
.edu-drift { animation: edu-drift-in 0.9s cubic-bezier(0.25, 1.1, 0.4, 1) both; }
.edu-cheer { animation: edu-cheer 0.9s ease-in-out; }
.edu-wobble { animation: edu-wobble 0.55s ease-in-out; }
.edu-burst { animation: edu-burst 0.9s ease-out forwards; }
.edu-rise { animation: edu-rise 0.5s ease-out both; }
.edu-sway { animation: edu-sway 3.2s ease-in-out infinite; }
.edu-grow { animation: edu-grow 2.2s ease-in-out both; }
.edu-draw { stroke-dasharray: 400; animation: edu-draw 1.4s ease-out both; }
.edu-settle { animation: edu-settle 1.1s ease-out 0.5s both; }
.edu-settle-late { animation: edu-settle 1.1s ease-out 0.75s both; }
/* On a phone the logo draws itself in at half the pace, so the arcs can be watched arriving. */
@media (max-width: 999px) {
  .edu-draw { animation-duration: 3s; }
  .edu-settle { animation-duration: 1.8s; animation-delay: 1.1s; }
  .edu-settle-late { animation-duration: 1.8s; animation-delay: 1.5s; }
}
.edu-star-twinkle { animation: edu-twinkle-star 2.4s ease-in-out infinite; }
.edu-press { transition: transform 0.12s ease; }
.edu-press:active { transform: scale(0.94); }
/* Layout for larger screens. Phones stay narrow; a laptop gets a wider column and a
   pair of quiet arcs at the edges, drawn in the same green as the logo, so the page
   does not sit in a sea of blank space. */
.edu-wrap { max-width: 560px; position: relative; z-index: 1; padding-bottom: 72px; }
  /* The bottom bar of the frame. On a phone the address bar hides and shows as you scroll, and a fixed bottom
     edge chases it a beat late, so phones get no bottom bar and the device's own edge closes the frame.
     Laptops and desktops, which have no moving bars, get the full frame. */
  .edu-frame-bottom { display: none; }
  /* The login grid: one name per row on a phone, two per row from a tablet up (never for a single student). */
  .edu-name-grid { grid-template-columns: 1fr; }
  .edu-name-grade { display: block; margin-top: 3px; font-size: 12px; font-weight: 400; line-height: 1.2; color: ${C.muted}; }

  @media (min-width: 600px) { .edu-name-grid-two { grid-template-columns: 1fr 1fr; } }
  /* The student card: on a phone the name, grade and links stay left and Open report sits below them, centered;
     on a laptop the name, grade and links stack on the left and Open report sits on the right, centered on them. */
  .edu-student-body { display: block; }
  /* On a phone the picture sits above the name, so every name, grade and link starts at the card's left edge,
     with or without a picture; on a laptop the picture returns beside them. */
  .edu-student-left { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px; }
  .edu-student-name-row { display: flex; flex-direction: column-reverse; align-items: center; gap: 6px; }
  .edu-student-left > div { width: 100%; }
  /* The first-week tour points: the one element named by the card carries .edu-tour-target while its card is up;
     it glows with a slow pulse and a dark spot circles its frame so the eye finds it even when the page is busy. */
  .edu-tour-target { position: relative; border-radius: 12px; animation: edu-tour-pulse 1.6s ease-in-out infinite; }
  /* A student's very first button wears the same circling spot, so a young eye finds it. */
  .edu-orbit::after { content: ''; position: absolute; width: 11px; height: 11px; border-radius: 50%; background: #24291F; border: 2px solid #E6B84B; pointer-events: none; z-index: 5; animation: edu-tour-orbit 4s linear infinite; }
  @media (prefers-reduced-motion: reduce) { .edu-orbit::after { animation: none; top: -8px; left: -8px; } }
  .edu-tour-target::after { content: ''; position: absolute; width: 11px; height: 11px; border-radius: 50%; background: #24291F; border: 2px solid #E6B84B; pointer-events: none; z-index: 5; animation: edu-tour-orbit 4s linear infinite; }
  @keyframes edu-tour-pulse { 0%, 100% { box-shadow: 0 0 0 4px #E6B84B, 0 0 14px 4px rgba(230, 184, 75, 0.45); } 50% { box-shadow: 0 0 0 6px #E6B84B, 0 0 26px 10px rgba(230, 184, 75, 0.75); } }
  @keyframes edu-tour-orbit { 0% { top: -8px; left: -8px; } 25% { top: -8px; left: calc(100% - 4px); } 50% { top: calc(100% - 4px); left: calc(100% - 4px); } 75% { top: calc(100% - 4px); left: -8px; } 100% { top: -8px; left: -8px; } }
  @media (prefers-reduced-motion: reduce) { .edu-tour-target { animation: none; box-shadow: 0 0 0 5px #E6B84B, 0 0 18px 6px rgba(230, 184, 75, 0.55); } .edu-tour-target::after { animation: none; } }
  .edu-recovery-code { font-size: 22px; }
  @media (max-width: 480px) { .edu-recovery-code { font-size: 17px; letter-spacing: 0.5px; } }
  .edu-student-actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 2px 16px; }
  .edu-student-actions button { margin-right: 0 !important; font-size: 15px !important; white-space: nowrap; }
  .edu-student-wonder { text-align: center; margin-top: 10px; }
  .edu-student-open { display: flex; justify-content: center; margin-top: 12px; }
  @media (min-width: 1000px) {
    .edu-student-body { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
    .edu-student-left { flex: 1 1 auto; min-width: 0; text-align: left; flex-direction: column; align-items: flex-start; gap: 4px; }
    .edu-student-name-row { flex-direction: row; align-items: center; gap: 12px; }
    .edu-student-left > div { width: auto; }
  }
  /* Section titles read centered at every width. A fold keeps its count and chevron pinned to its
     right edge while the title centers. */
  /* A phone in dark mode was painting the inputs and buttons dark. This page has one palette. */
  :root { color-scheme: light; }
  input, textarea, select, button { color-scheme: light; }
  input, textarea, select { background: #FFFFFF; color: #1F2D24; -webkit-text-fill-color: #1F2D24; }
  input::placeholder, textarea::placeholder { color: #6B7A70; opacity: 1; }
  /* The coloring title cycles through the crayon colors, so it catches a young eye. */
  @keyframes edu-rainbow { 0% { color: #E4572E; } 20% { color: #F4A259; } 40% { color: #5BA84A; } 60% { color: #3E7CB1; } 80% { color: #7D5BA6; } 100% { color: #E4572E; } }
  .edu-rainbow { animation: edu-rainbow 6s linear infinite; }
  /* The coloring fold wears the crayons: the whole strip drifts through them, with two sparkles
     crossing corner to corner so a child's eye lands on it. */
  @keyframes edu-colorwash { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
  .edu-colorwash { background: linear-gradient(115deg, #F7D154, #F4A259, #E4572E, #7D5BA6, #3E7CB1, #5BA84A, #F7D154); background-size: 400% 400%; animation: edu-colorwash 9s ease-in-out infinite; }
  /* A picture ready to color: the drawing stays black and white, the square behind it drifts through
     the crayons, paler than the fold so the outline still reads. */
  .edu-colorwash-soft { background: linear-gradient(120deg, #FDF0C9, #FBE0C6, #F8D2C6, #E6D9F0, #CFE0EF, #D4EBCF, #FDF0C9); background-size: 400% 400%; animation: edu-colorwash 11s ease-in-out infinite; }
  @keyframes edu-sparkle-a { 0% { transform: translate(-10%, -120%) scale(0.6); opacity: 0; } 25% { opacity: 1; } 100% { transform: translate(560%, 320%) scale(1.1); opacity: 0; } }
  @keyframes edu-sparkle-b { 0% { transform: translate(600%, 320%) scale(0.7); opacity: 0; } 30% { opacity: 1; } 100% { transform: translate(-20%, -140%) scale(1); opacity: 0; } }
  .edu-sparkle { position: absolute; left: 12px; top: 50%; width: 12px; height: 12px; border-radius: 999px; background: #fff; box-shadow: 0 0 10px #fff; animation: edu-sparkle-a 5.5s linear infinite; }
  .edu-sparkle-2 { animation: edu-sparkle-b 7s linear infinite; }
  .edu-sparkle-3 { left: auto; right: 16px; top: 22%; animation: edu-sparkle-b 6.2s linear infinite 1.4s; }
  .edu-sparkle-4 { left: auto; right: 34px; top: 74%; animation: edu-sparkle-a 8s linear infinite 2.6s; }
  .edu-card-title { text-align: center; }
  .edu-fold-head { position: relative; justify-content: center !important; }
  .edu-fold-title { text-align: center; }
  .edu-fold-meta { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); }
  /* The note box: the field spans the card, tall enough for the example, with Save note centered below it. */
  /* The crayons: five to a row at any width, a little smaller on a phone so all three rows fit. */
  .edu-crayons { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; justify-items: center; width: min(300px, 100%); margin: 10px auto; }
  /* How wide the picture and everything stacked with it may be. On a phone held upright it is sized
     by the height that is really there, so the crayons and the nibs stay on the first screen; turned
     on its side, or on a laptop, the picture takes the height instead. */
  /* The coloring page is its own thing: it may use more of the window than the reading columns do. */
  .edu-wrap-wide { max-width: none !important; padding-bottom: 10px !important; zoom: 1 !important; }
  .edu-pad { max-width: 100%; }
  .edu-pad-col { width: min(100%, 46vh); }
  @media (min-width: 700px) { .edu-pad-col { width: min(72vw, calc(100vh - 302px)); } }
  /* Upright only on a phone: sideways, everything is covered by a gentle ask to turn back. */
  .edu-rotate { display: none; }
  {
    .edu-rotate.edu-rotate-on { display: flex; position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 9999; background: ${C.paper || '#F5F7F1'}; color: ${C.green}; align-items: center; justify-content: center; text-align: center; padding: 24px; font-family: ${FONT}; }
    .edu-rotate p { font-size: 20px; font-weight: 600; margin: 12px 0 0; color: ${C.ink}; }
  }
  .edu-wide-only { display: none; }
  /* A mouse becomes a paintbrush over a drawing picture, and only there; a finger or a stylus needs no cursor. */
  @media (hover: hover) and (pointer: fine) { .edu-pad:not(.edu-pad-fill) .edu-picture svg { cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><path d='M4 28l4-1 15-15-3-3L5 24z' fill='%23E4A23A' stroke='%232E2E2E' stroke-width='1.5' stroke-linejoin='round'/><path d='M21 8l3-3 3 3-3 3z' fill='%232F5D4F' stroke='%232E2E2E' stroke-width='1.5' stroke-linejoin='round'/></svg>") 4 28, crosshair; } }
  .edu-boot-word { display: flex; gap: 2px; font-size: 34px; font-weight: 800; color: ${C.green}; letter-spacing: 1px; }
  .edu-boot-word span { display: inline-block; animation: edu-bob 1.2s ease-in-out infinite; }
  .edu-boot-word .edu-boot-dots { color: ${C.gold}; }
  @keyframes edu-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
  @media (prefers-reduced-motion: reduce) { .edu-boot-word span { animation: none; } }
  .edu-bullets { list-style: disc; }
  /* Letters on a coloring page are drawings, never text to select: a finger dragging across them must not
     start a selection, which on a phone paints a second, highlighted copy of the glyph. */
  .edu-picture svg, .edu-picture svg text { user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; }
  .edu-picture svg text { pointer-events: none; }
  .edu-bullets li::marker { color: ${C.green}; }
  /* A picture that is filled in rather than drawn on has no nibs, so it shows every crayon and
     gives the picture the room the nibs would have taken. */
  .edu-crayons-all .edu-crayon.edu-wide-only { display: block; }
  .edu-note-quiet::placeholder { font-weight: 400; color: #8A9188; opacity: 1; }
  .edu-crayon-wide { display: none; }
  @media (min-width: 700px) { .edu-crayon-wide { display: block; } }
  .edu-pad-fill .edu-pad-col { width: min(100%, 50vh); }
  @media (max-width: 599px) { .edu-crayons-all { gap: 6px; } .edu-crayons-all .edu-crayon { width: 36px; height: 36px; } }
  .edu-nib { width: 38px; height: 38px; border-radius: 999px; display: flex; align-items: center; justify-content: center; cursor: pointer; padding: 0; }
  .edu-nib.edu-wide-only { display: none; }
  /* On a phone the nibs sit in the same five columns as the crayons, so the two rows line up. */
  .edu-nibs { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; width: min(300px, 100%); margin: 10px auto 0; }
  .edu-erasers { display: none; }
  /* Zoomed in, the zoom-out button pulses so a child can find the way back to the whole picture. */
  @keyframes edu-zoom-back { 0%, 100% { box-shadow: 0 0 0 0 rgba(46, 46, 46, 0.45); } 50% { box-shadow: 0 0 0 9px rgba(46, 46, 46, 0); } }
  .edu-zoom-back { animation: edu-zoom-back 1.4s ease-out infinite; }
  @media (min-width: 700px) {
    /* Nibs stand beside the picture and the crayons run the width of the card. */
    .edu-pad { display: grid; grid-template-columns: auto auto auto; grid-template-areas: 'nibs head erasers' 'nibs bar erasers' 'nibs picture erasers' '. crayons .'; column-gap: 28px; justify-content: center; }
    .edu-erasers { grid-area: erasers; display: flex; flex-direction: column; align-self: center; gap: 10px; }
    .edu-pad-head { grid-area: head; }
    .edu-pad-bar { grid-area: bar; }
    .edu-picture { grid-area: picture; }
    .edu-nibs { grid-area: nibs; display: flex; flex-direction: column; flex-wrap: nowrap; align-self: center; gap: 10px; width: auto; margin: 0; }
    .edu-nib { width: 46px; height: 46px; }
    .edu-crayons { grid-area: crayons; grid-template-columns: repeat(7, 1fr); margin: 12px 0 0; }
    .edu-pad .edu-crayons { width: min(72vw, calc(100vh - 302px)); }
    .edu-wide-only { display: flex; }
    .edu-nib.edu-wide-only { display: flex; }
  }
  .edu-crayon { width: 38px; height: 38px; border-radius: 999px; cursor: pointer; padding: 0; }
  @media (min-width: 700px) { .edu-crayon.edu-wide-only { display: block; } }
  @media (min-width: 600px) {
    .edu-crayons { gap: 10px; width: min(340px, 100%); margin: 12px auto; }
    .edu-crayon { width: 44px; height: 44px; }
  }
  .edu-note-box { margin-top: 8px; }
  .edu-note-box textarea { min-height: 96px; text-align: center; }
  @media (min-width: 1000px) { .edu-note-box textarea { min-height: 0; } }
  .edu-note-save { display: flex; justify-content: center; margin-top: 8px; }
  @media (min-width: 1000px) {
    .edu-student-open { margin-top: 0; flex: 0 0 auto; }
  }
  /* On a phone the logout countdown sits centered at the foot; on a laptop it stays bottom right. */
  @media (max-width: 999px) { .edu-logout-chip { right: auto !important; left: 50% !important; transform: translateX(-50%); } }
  @media (hover: hover) and (pointer: fine) { .edu-frame-bottom { display: block; position: fixed; left: 0; right: 0; bottom: 0; height: 6px; background: ${C.green}; pointer-events: none; z-index: 50; } }
.edu-side { display: none; }
.edu-page-stars { display: none; }
@media (min-width: 700px) {
  .edu-page-stars { display: block; position: fixed; top: 0; right: 0; bottom: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 0; opacity: 0.55; }
  /* Loose text outside the tiles carries a backing in the page's own color, so no star ever
     sits behind a heading, a paragraph or a text link. Inside a tile the tile already covers it. */
  .edu-wrap :is(p, h1, h2, h3, li, label) { background: #F5F7F1; }
  .edu-wrap :is([style*="border-radius: 14px"], [style*="border-radius: 12px"], [style*="border-radius: 10px"], button) :is(p, h1, h2, h3, li, label) { background: transparent; }
  .edu-wrap :is(button, a)[style*="background: none"] { background: #F5F7F1 !important; }
  .edu-wrap [style*="border-radius: 14px"] :is(button, a)[style*="background: none"] { background: transparent !important; }
}
.edu-flank { display: none; }
.edu-welcome { position: relative; }
.edu-galaxy { display: block; position: absolute; left: 50%; top: -10px; width: 100vw; height: 380px; transform: translateX(-50%); pointer-events: none; z-index: 0; }
.edu-welcome-logo, .edu-welcome-card, .edu-welcome-links { position: relative; z-index: 1; }
@media (max-width: 999px) { .edu-welcome-card { margin-top: 26px; } }
@keyframes edu-twinkle-star { 0% { transform: scale(1); } 50% { transform: scale(2.4); } 100% { transform: scale(1); } }
.edu-twinkle-star { animation: edu-twinkle-star 2.4s ease-in-out 1 both; transform-box: fill-box; transform-origin: center; }
@media (min-width: 1000px) {
  .edu-flank { display: block; position: relative; z-index: 1; width: 150px; height: 130px; }
  .edu-galaxy { height: 68vh; min-height: 620px; }
}
html, body { overflow-x: hidden; }
.edu-welcome { display: flex; flex-direction: column; }
.edu-welcome-links { margin-top: auto; }
@media (min-width: 1000px) {
  .edu-wrap { max-width: 720px; }
  .edu-welcome { min-height: calc(100vh - 40px); }
  /* A very large logo that grows downward: its top edge stays put and its lower half runs
     behind the sign-in card, which is drawn over it. */
  .edu-welcome-logo > svg:not(.edu-flank) { width: min(400px, 92vw) !important; height: auto !important; flex-shrink: 0 !important; max-width: none !important; }
  /* At this size the logo fills the width on its own; the two distant spheres would only be pushed off the edge. */
  .edu-flank { display: none !important; }
  .edu-welcome-logo { align-items: flex-start !important; margin-bottom: 0 !important; z-index: 1; overflow: visible !important; }
  .edu-welcome { overflow: visible; }
  .edu-welcome-card { z-index: 2; }
  .edu-welcome-links { z-index: 2; }
  .edu-galaxy { height: 92vh; min-height: 900px; }
  .edu-welcome-card { margin-top: 36px; padding: 22px 24px !important; }
  .edu-welcome-card h2 { font-size: 24px !important; }
  .edu-welcome-links { padding-top: 4px; padding-bottom: 16px; }
  .edu-welcome-links button, .edu-welcome-links p { font-size: 18px !important; }
}
@media (min-width: 1000px) {
  /* Everything grows a little on a laptop, so text and taps stay in proportion. */
  .edu-wrap { zoom: 1.08; }
  .edu-wrap > div[style*="margin-bottom: 14px"] { margin-bottom: 22px !important; }
  .edu-wrap h1 { margin-top: 20px !important; }
  .edu-classroom-intro { padding: 12px 90px 0 !important; }
  .edu-two-up { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: stretch; }
  .edu-two-up > div { margin-top: 0 !important; margin-bottom: 0 !important; }
  .edu-narrow { max-width: 380px; margin-left: auto; margin-right: auto; }
  .edu-backup-link { font-size: 19px !important; }
  .edu-login-body { margin-top: 12vh; }
  .edu-overview-body { margin-top: 10px !important; }
}
@media (min-width: 1100px) {
  .edu-side { display: block; position: fixed; top: 0; bottom: 0; width: 300px; pointer-events: none; z-index: 0; opacity: 0.6; }
  .edu-side-left { left: 0; } .edu-side-right { right: 0; transform: scaleX(-1); }
}
@media (min-width: 1500px) { .edu-side { width: 420px; opacity: 0.7; } }
/* A name lifts a little under the pointer, where there is one. */
@media (hover: hover) { .edu-name { transition: background 0.18s ease, border-color 0.18s ease; } .edu-name:hover { background: #E4F0E8 !important; border-color: #3A6B58 !important; } .edu-login-btn button { transition: transform 0.18s ease, filter 0.18s ease; } .edu-login-btn button:hover { transform: scale(1.04); filter: brightness(1.1); } }
@keyframes edu-glow { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }
@keyframes edu-stress { 0%, 100% { transform: scale(1.12); } 25% { transform: scale(1.55); } 50% { transform: scale(1.12); } 75% { transform: scale(1.55); } }
.edu-stress { animation: edu-stress 1.6s ease-in-out both; }
@keyframes edu-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.025); } }
.edu-pulse { animation: edu-pulse 1.6s ease-in-out infinite; }
/* The beat never stops: a card that is open simply turns it down to nothing with --beat, so it
   is still on the same stroke as every other card when it comes back. */
@keyframes edu-breathe { 0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(58, 107, 88, 0); } 50% { transform: scale(calc(1 + 0.015 * var(--beat, 1))); box-shadow: 0 0 0 calc(6px * var(--beat, 1)) rgba(58, 107, 88, calc(0.18 * var(--beat, 1))); } }
.edu-breathe { animation: edu-breathe 2.2s ease-in-out infinite; border-radius: 12px; }
@keyframes edu-side-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
.edu-side path { stroke-dasharray: 1; animation: edu-side-draw 1.6s ease-out both; }
@keyframes edu-slide-in { 0% { transform: translateY(-70px) scale(0.5) rotate(-6deg); opacity: 0; } 55% { transform: translateY(10px) scale(1.12) rotate(2deg); opacity: 1; } 78% { transform: translateY(-4px) scale(0.96) rotate(0deg); } 100% { transform: translateY(0) scale(1); } }
.edu-slide-in { animation: edu-slide-in 1.1s cubic-bezier(0.2, 0.9, 0.3, 1.2) both; background: linear-gradient(90deg, #3A6B58, #D9A83B, #3A6B58); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; color: transparent !important; animation: edu-slide-in 1.1s cubic-bezier(0.2, 0.9, 0.3, 1.2) both, edu-shimmer 3s linear 1.1s infinite; }
.edu-glow { animation: edu-glow 1.8s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) {
  .edu-glow, .edu-breathe, .edu-slide-in, .edu-pulse, .edu-zoom-back, .edu-stress, .edu-twinkle-star, .edu-trace-draw, .edu-rainbow, .edu-colorwash, .edu-colorwash-soft, .edu-sparkle, .edu-side path { animation: none; }
  .edu-side path { stroke-dasharray: none; }
  .edu-halo, .edu-drift, .edu-cheer, .edu-wobble, .edu-burst, .edu-rise, .edu-sway, .edu-star-twinkle, .edu-grow, .edu-draw, .edu-settle, .edu-settle-late { animation: none; }
  .edu-draw { stroke-dasharray: none; }
  .edu-press { transition: none; }
}`;

const WONDER_ANIMATION = `
@keyframes edu-shimmer { 0% { background-position: -160% 0; } 100% { background-position: 260% 0; } }
@keyframes edu-twinkle { 0%, 100% { opacity: 0; transform: scale(0.6) rotate(0deg); } 50% { opacity: 1; transform: scale(1) rotate(90deg); } }
.edu-wonder-shine { animation: edu-shimmer 3.4s ease-in-out infinite; }
.edu-spark { animation: edu-twinkle 2.4s ease-in-out infinite; transform-origin: center; }
.edu-spark-2 { animation-delay: 0.8s; }
.edu-spark-3 { animation-delay: 1.6s; }
@media (prefers-reduced-motion: reduce) {
  .edu-wonder-shine, .edu-spark { animation: none; }
  .edu-spark { opacity: 0.9; }
}`;

// A four-pointed spark, drawn rather than typed, so it looks the same everywhere.
function Spark({ x, y, size, className }) {
  const d = `M ${x} ${y - size} Q ${x + size * 0.18} ${y - size * 0.18} ${x + size} ${y} Q ${x + size * 0.18} ${y + size * 0.18} ${x} ${y + size} Q ${x - size * 0.18} ${y + size * 0.18} ${x - size} ${y} Q ${x - size * 0.18} ${y - size * 0.18} ${x} ${y - size} Z`;
  return <path className={className} d={d} fill={C.gold} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />;
}

function WonderButton({ onClick, children }) {
  return (
    <button type="button" onClick={onClick}
      style={{ position: 'relative', overflow: 'hidden', fontFamily: FONT, fontSize: 17, fontWeight: 700, color: '#fff', background: C.green, border: `2px solid ${C.green}`, borderRadius: 12, padding: '14px 18px', minHeight: 52, width: '100%', cursor: 'pointer' }}>
      <span className="edu-wonder-shine" aria-hidden="true"
        style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, background: `linear-gradient(100deg, transparent 35%, ${C.gold}66 50%, transparent 65%)`, backgroundSize: '220% 100%', pointerEvents: 'none' }} />
      <svg viewBox="0 0 120 40" aria-hidden="true" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }} preserveAspectRatio="none">
        <Spark x={14} y={11} size={4.5} className="edu-spark" />
        <Spark x={104} y={27} size={5.5} className="edu-spark edu-spark-2" />
        <Spark x={92} y={9} size={3.5} className="edu-spark edu-spark-3" />
      </svg>
      <span style={{ position: 'relative' }}>{children}</span>
    </button>
  );
}

// ---------- Pictures a young student picks instead of reading a name ----------
// Eight friendly faces, drawn here so nothing is ever uploaded. Simple enough to read at
// thumbnail size, distinct enough that a five-year-old finds theirs at a glance.
function StudentPicture({ name, tint = null, size = 56 }) {
  const faces = {
    fox: <g><path d="M12 44 L18 14 L30 26 L42 14 L48 44 Z" fill="#D98B3D" /><circle cx="24" cy="34" r="2.6" fill="#24291F" /><circle cx="36" cy="34" r="2.6" fill="#24291F" /><path d="M27 41 L30 44 L33 41 Z" fill="#24291F" /></g>,
    owl: <g><ellipse cx="30" cy="34" rx="18" ry="20" fill="#8C7A5B" /><circle cx="22" cy="30" r="7" fill="#F5F1E6" /><circle cx="38" cy="30" r="7" fill="#F5F1E6" /><circle cx="22" cy="30" r="3" fill="#24291F" /><circle cx="38" cy="30" r="3" fill="#24291F" /><path d="M27 40 L30 46 L33 40 Z" fill="#C79A3D" /></g>,
    frog: <g><ellipse cx="30" cy="36" rx="20" ry="14" fill="#5E9A62" /><circle cx="20" cy="22" r="7" fill="#5E9A62" /><circle cx="40" cy="22" r="7" fill="#5E9A62" /><circle cx="20" cy="22" r="3" fill="#24291F" /><circle cx="40" cy="22" r="3" fill="#24291F" /><path d="M20 40 Q30 47 40 40" fill="none" stroke="#24291F" strokeWidth="2.5" strokeLinecap="round" /></g>,
    whale: <g><path d="M8 34 Q30 12 52 34 Q30 52 8 34 Z" fill="#5A8EA3" /><path d="M46 20 L54 12 L52 24 Z" fill="#5A8EA3" /><circle cx="20" cy="32" r="2.6" fill="#24291F" /><path d="M14 38 Q20 42 26 38" fill="none" stroke="#24291F" strokeWidth="2" strokeLinecap="round" /></g>,
    bee: <g><ellipse cx="30" cy="36" rx="16" ry="12" fill="#E2B83A" /><rect x="22" y="26" width="5" height="20" fill="#24291F" /><rect x="34" y="26" width="5" height="20" fill="#24291F" /><ellipse cx="22" cy="20" rx="8" ry="5" fill="#DCE9F5" opacity="0.9" /><ellipse cx="38" cy="20" rx="8" ry="5" fill="#DCE9F5" opacity="0.9" /><circle cx="15" cy="34" r="2.2" fill="#24291F" /></g>,
    cat: <g><path d="M14 44 L14 18 L24 26 L36 26 L46 18 L46 44 Z" fill="#A9A19A" /><circle cx="24" cy="34" r="2.6" fill="#24291F" /><circle cx="36" cy="34" r="2.6" fill="#24291F" /><path d="M27 40 L30 43 L33 40 Z" fill="#B45A3C" /><path d="M8 40 L22 41 M8 46 L22 44 M52 40 L38 41 M52 46 L38 44" stroke="#24291F" strokeWidth="1.5" /></g>,
    turtle: <g><ellipse cx="30" cy="36" rx="18" ry="12" fill="#6A8F5B" /><circle cx="48" cy="34" r="6" fill="#8FB07E" /><circle cx="50" cy="33" r="1.8" fill="#24291F" /><path d="M18 32 L24 30 L30 32 L36 30 L42 32" fill="none" stroke="#4F6E44" strokeWidth="2" /></g>,
    rabbit: <g><ellipse cx="30" cy="38" rx="14" ry="12" fill="#E8DFD3" /><ellipse cx="23" cy="18" rx="5" ry="12" fill="#E8DFD3" /><ellipse cx="37" cy="18" rx="5" ry="12" fill="#E8DFD3" /><circle cx="25" cy="36" r="2.4" fill="#24291F" /><circle cx="35" cy="36" r="2.4" fill="#24291F" /><path d="M28 42 L30 44 L32 42 Z" fill="#D98B8B" /></g>,
    bear: <g><circle cx="30" cy="34" r="16" fill="#8B6B4A" /><circle cx="18" cy="22" r="6" fill="#8B6B4A" /><circle cx="42" cy="22" r="6" fill="#8B6B4A" /><ellipse cx="30" cy="40" rx="7" ry="5" fill="#C9A98A" /><circle cx="24" cy="31" r="2.4" fill="#24291F" /><circle cx="36" cy="31" r="2.4" fill="#24291F" /><circle cx="30" cy="38" r="2.4" fill="#24291F" /></g>,
    fish: <g><path d="M10 34 Q26 16 44 34 Q26 52 10 34 Z" fill="#E28A5B" /><path d="M44 34 L54 24 L54 44 Z" fill="#E28A5B" /><circle cx="20" cy="32" r="2.6" fill="#24291F" /><path d="M26 26 Q30 34 26 42" fill="none" stroke="#C9704A" strokeWidth="2" /></g>,
    duck: <g><ellipse cx="32" cy="38" rx="17" ry="11" fill="#F0D45C" /><circle cx="20" cy="26" r="9" fill="#F0D45C" /><path d="M11 27 L4 30 L11 32 Z" fill="#E28A2B" /><circle cx="18" cy="24" r="2.2" fill="#24291F" /></g>,
    snail: <g><path d="M8 44 L40 44 Q46 44 46 38 L46 30" fill="none" stroke="#7A9B6C" strokeWidth="8" strokeLinecap="round" /><circle cx="28" cy="32" r="13" fill="#C98B5E" /><circle cx="28" cy="32" r="7" fill="none" stroke="#A96F45" strokeWidth="3" /><path d="M44 30 L42 20 M48 30 L50 20" stroke="#7A9B6C" strokeWidth="2.5" strokeLinecap="round" /><circle cx="42" cy="19" r="2" fill="#24291F" /><circle cx="50" cy="19" r="2" fill="#24291F" /></g>,
  };
  if (!faces[name]) return null;
  const bg = tintFor(tint);
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} role="img" aria-label={bg ? `${bg.id} ${name}` : name}>
      {bg && <circle cx="30" cy="30" r="29" fill={bg.color} />}
      {faces[name]}
    </svg>
  );
}

// Status as a drawn symbol rather than a word, for children who cannot read yet.
// A filled star means mastered, an open circle means ready, a padlock means not yet.
function StatusMark({ status, size = 30 }) {
  const label = status === 'mastered' ? 'Finished' : status === 'passed' ? 'Passed once' : status === 'available' ? 'Ready' : 'Locked';
  if (status === 'passed') {
    // A hollow star: passed once, the filled star waits for another day.
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} role="img" aria-label={label}>
        <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" fill="none" stroke={C.gold} strokeWidth="2" strokeLinejoin="round" />
      </svg>
    );
  }
  if (status === 'mastered') {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} role="img" aria-label={label}>
        <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" fill={C.gold} />
      </svg>
    );
  }
  if (status === 'available') {
    return (
      <svg className="edu-star-twinkle" viewBox="0 0 24 24" width={size} height={size} role="img" aria-label={label} style={{ transformOrigin: 'center' }}>
        <circle cx="12" cy="12" r="8.5" fill="none" stroke={C.green} strokeWidth="3" />
        <circle cx="12" cy="12" r="3.5" fill={C.green} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} role="img" aria-label={label}>
      <rect x="5" y="10.5" width="14" height="10" rx="2" fill={C.muted} />
      <path d="M8.5 10.5V8a3.5 3.5 0 017 0v2.5" fill="none" stroke={C.muted} strokeWidth="2.5" />
    </svg>
  );
}

// A big round tap target with a drawn arrow, for hands that cannot read a label.
function BigTap({ onClick, label, dir = 'next', disabled = false }) {
  const inviting = dir === 'next' && !disabled;
  return (
    <span style={{ position: 'relative', display: 'inline-flex' }}>
      <button type="button" onClick={onClick} disabled={disabled} aria-label={label} className={inviting ? 'edu-press edu-pulse' : 'edu-press'}
        style={{ position: 'relative', width: 66, height: 66, borderRadius: 999, border: `3px solid ${C.green}`, background: dir === 'next' ? C.green : C.surface, cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.35 : 1, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox="0 0 24 24" width="38" height="38" aria-hidden="true">
          <path d={dir === 'next' ? 'M9 5l7 7-7 7' : 'M15 5l-7 7 7 7'} fill="none" stroke={dir === 'next' ? '#fff' : C.green} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </span>
  );
}

// A small shower of stars, thrown out from the middle when an answer is right.
function StarBurst() {
  const bits = [[-70, -40], [70, -46], [-46, 34], [52, 40], [0, -74], [-88, -4], [88, 8], [12, 62]];
  return (
    <span aria-hidden="true" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
      {bits.map(([dx, dy], i) => (
        <svg key={i} className="edu-burst" viewBox="0 0 24 24" width="22" height="22"
          style={{ position: 'absolute', '--dx': `${dx}px`, '--dy': `${dy}px`, animationDelay: `${i * 0.05}s` }}>
          <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" fill={i % 2 ? C.gold : C.green} />
        </svg>
      ))}
    </span>
  );
}

// Every piece of teaching text (lesson paragraphs, key ideas, explanations, result lines)
// is rendered through this. A newline starts a new line. **bold** is emphasized. A line
// wrapped in [[ ]] is centered, bold, and given air above and below: that is how an
// equation or a key phrase stands apart from the prose around it.
function inlineRich(text, keyPrefix) {
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((part, i) => (part.startsWith('**') && part.endsWith('**') ? <strong key={`${keyPrefix}-${i}`}>{part.slice(2, -2)}</strong> : <React.Fragment key={`${keyPrefix}-${i}`}>{part}</React.Fragment>));
}
function RichText({ text, size = 17, color = null, center = false, lineGap = 10 }) {
  const lines = String(text || '').split('\n');
  return (
    <>
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} style={{ height: 6 }} />;
        // A bullet line: hanging indent, always left-aligned, sitting as a narrow block in the middle when the text is centered.
        const labelled = /^\*\*[^*]{1,40}:\*\*\s/.test(trimmed);
        if (trimmed.startsWith('• ') || labelled) return <p key={i} style={{ margin: center ? '0 auto 6px' : '0 0 6px', maxWidth: center ? '32ch' : undefined, fontSize: size, lineHeight: 1.6, textAlign: 'left', paddingLeft: 18, textIndent: -18, color: color || undefined }}>{'• '}{inlineRich(labelled ? trimmed : trimmed.slice(2), i)}</p>;
        const centered = /^\[\[.*\]\]$/.test(trimmed);
        if (centered) return <p key={i} style={{ margin: '14px 0', fontSize: size + 3, fontWeight: 700, textAlign: 'center', letterSpacing: 0.3, color: color || C.ink }}>{inlineRich(trimmed.slice(2, -2).trim(), i)}</p>;
        return <p key={i} style={{ margin: `0 0 ${lineGap}px`, fontSize: size, lineHeight: 1.6, textAlign: center ? 'center' : 'left', color: color || undefined }}>{inlineRich(trimmed, i)}</p>;
      })}
    </>
  );
}

// The text behind an i button. A soft green gradient sets it apart from the page's own
// text, and every tip uses this so they all look the same.
const tipStyle = { margin: '6px 0 10px', padding: '10px 12px', borderRadius: 10, fontSize: 13, color: C.ink, fontStyle: 'italic', lineHeight: 1.55, background: 'linear-gradient(135deg, #EAF2EC 0%, #F5F9F5 100%)', border: '1px solid #DCE8DF' };
function TipText({ children }) { return <div style={tipStyle}>{children}</div>; }
// Two halves of one rectangle, butted together: the same control on every screen that offers a choice of two.
// Diagrams drawn by the app for lessons whose picture has structure: a cycle, a leaf, a triangle
// with its squares, a cell, two carts, two curves, an atom, a number line, the turning Earth.
// Anything with labels on it is drawn here in code, never requested as art.
const DIAGRAM_TEXT = { fontFamily: FONT, fontSize: 5.2, fontWeight: 600, fill: '#2E2E2E', textAnchor: 'middle' };
function Arrow({ d, color = C.green }) { return <path d={d} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" markerEnd="url(#eduArrow)" />; }
function Diagram({ children, label }) {
  return (
    <svg viewBox="0 0 160 100" width="100%" role="img" aria-label={label} style={{ display: 'block', maxWidth: 560, margin: '0 auto' }}>
      <defs><marker id="eduArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="context-stroke" /></marker></defs>
      {children}
    </svg>
  );
}
function CyclePic() {
  return (
    <Diagram label="The water cycle">
      <circle cx="26" cy="20" r="11" fill={C.gold} /><rect x="0" y="72" width="160" height="28" fill="#9ACD32" /><path d="M0 84 Q40 70 80 84 T160 84 V100 H0z" fill="#8FC4E8" />
      <ellipse cx="112" cy="26" rx="26" ry="11" fill="#FFFFFF" stroke="#A9B1AA" strokeWidth="1" /><ellipse cx="98" cy="30" rx="16" ry="9" fill="#FFFFFF" />
      <Arrow d="M60 78 C62 60 70 44 86 34" /><Arrow d="M124 38 C132 52 134 62 130 74" color="#3E7CB1" /><Arrow d="M128 88 C110 92 80 92 44 86" color="#3E7CB1" />
      {[[116, 46], [122, 56], [128, 66]].map(([x, y], i) => <path key={i} d={`M${x} ${y} q3 3 0 6 q-3 -3 0 -6`} fill="#3E7CB1" />)}
      <text x="56" y="56" {...DIAGRAM_TEXT}>evaporation</text><text x="106" y="14" {...DIAGRAM_TEXT}>condensation</text><text x="146" y="60" {...DIAGRAM_TEXT}>rain</text><text x="80" y="98" {...DIAGRAM_TEXT}>collection</text>
    </Diagram>
  );
}
function LeafPic() {
  return (
    <Diagram label="Photosynthesis">
      <path d="M80 86 C40 80 30 40 60 18 C100 10 118 40 100 70 C94 80 88 84 80 86z" fill="#5BA84A" stroke="#2E2E2E" strokeWidth="1.2" /><path d="M80 86 C74 62 72 44 66 26" fill="none" stroke="#2E2E2E" strokeWidth="1" />
      <circle cx="22" cy="18" r="9" fill={C.gold} /><Arrow d="M32 24 L52 36" color={C.gold} />
      <text x="20" y="52" {...DIAGRAM_TEXT}>water</text><Arrow d="M32 56 L54 62" color="#3E7CB1" />
      <text x="24" y="80" {...DIAGRAM_TEXT}>carbon dioxide</text><Arrow d="M46 76 L58 72" color={C.muted} />
      <Arrow d="M110 30 L134 22" color={C.gold} /><text x="140" y="16" {...DIAGRAM_TEXT}>sugar</text>
      <Arrow d="M108 56 L134 60" color="#3E7CB1" /><text x="144" y="70" {...DIAGRAM_TEXT}>oxygen</text>
      <text x="80" y="96" {...DIAGRAM_TEXT}>sunlight in, sugar and oxygen out</text>
    </Diagram>
  );
}
function PythagPic() {
  // Right angle at (70, 62); legs of 4 and 3 units of 7; the square on each side sits outside the triangle.
  return (
    <Diagram label="A 3-4-5 right triangle with the squares on its sides">
      <rect x="70" y="62" width="28" height="28" fill={C.goldSoft} stroke={C.gold} strokeWidth="1" />
      <rect x="49" y="41" width="21" height="21" fill="#CFE7E5" stroke="#2FA5A0" strokeWidth="1" />
      <polygon points="98,62 70,41 91,13 119,34" fill="#F6C9C4" stroke="#D9534F" strokeWidth="1" />
      <polygon points="70,62 98,62 70,41" fill="#FFFFFF" stroke="#2E2E2E" strokeWidth="1.4" strokeLinejoin="round" />
      <rect x="70" y="58" width="4" height="4" fill="none" stroke="#2E2E2E" strokeWidth="0.8" />
      <text x="84" y="78" {...DIAGRAM_TEXT}>4² = 16</text><text x="59.5" y="53" {...DIAGRAM_TEXT}>3² = 9</text><text x="95" y="39" {...DIAGRAM_TEXT}>5² = 25</text>
      <text x="40" y="96" {...DIAGRAM_TEXT}>9 + 16 = 25</text>
    </Diagram>
  );
}
function CellPic({ highlight = '' }) {
  const lit = (name) => highlight.includes(name);
  const edge = (name, base) => (lit(name) ? { stroke: C.gold, strokeWidth: 2.6 } : base);
  return (
    <Diagram label="A plant cell">
      <rect x="24" y="4" width="112" height="92" rx="18" fill="#DCE6CF" {...edge('wall', { stroke: '#6B8F5E', strokeWidth: 2.2 })} />
      <rect x="31" y="10" width="98" height="80" rx="15" fill="#E9F3DE" {...edge('membrane', { stroke: '#2E2E2E', strokeWidth: 1.2 })} />
      <ellipse cx="108" cy="66" rx="14" ry="10" fill="#D7EAF8" {...edge('vacuole', { stroke: '#8FC4E8', strokeWidth: 1 })} />
      <circle cx="72" cy="44" r="16" fill="#C9DDF5" {...edge('nucleus', { stroke: '#3E7CB1', strokeWidth: 1.2 })} /><circle cx="72" cy="44" r="4.5" fill="#3E7CB1" />
      {[[48, 24], [108, 26], [46, 70], [90, 82]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="8" ry="4.5" fill="#5BA84A" {...edge('chloroplast', { stroke: '#2E2E2E', strokeWidth: 0.8 })} transform={`rotate(${i * 30} ${x} ${y})`} />)}
      {[[100, 46], [58, 80]].map(([x, y], i) => <ellipse key={`m${i}`} cx={x} cy={y} rx="6" ry="3.4" fill="#F4A259" {...edge('mitochond', { stroke: '#2E2E2E', strokeWidth: 0.8 })} transform={`rotate(${20 + i * 50} ${x} ${y})`} />)}
      <text x="72" y="28" {...DIAGRAM_TEXT}>nucleus</text><text x="12" y="16" {...DIAGRAM_TEXT}>wall</text><text x="14" y="30" {...DIAGRAM_TEXT}>membrane</text>
      <text x="146" y="90" {...DIAGRAM_TEXT}>chloroplast</text><text x="118" y="54" {...DIAGRAM_TEXT}>mitochondrion</text><text x="122" y="80" {...DIAGRAM_TEXT}>vacuole</text>
    </Diagram>
  );
}
function PercentGridPic({ shaded = 25 }) {
  return (
    <Diagram label={`${shaded} of 100 squares shaded`}>
      {Array.from({ length: 100 }, (_, i) => <rect key={i} x={30 + (i % 10) * 10} y={2 + Math.floor(i / 10) * 9.6} width="9" height="8.6" rx="1" fill={i < shaded ? C.gold : '#FFFFFF'} stroke="#A9B1AA" strokeWidth="0.5" />)}
      <text x="80" y="99" {...DIAGRAM_TEXT}>{shaded} of 100 = {shaded}%</text>
    </Diagram>
  );
}
function GroupsPic({ a = 2, b = 1, aLabel = '', bLabel = '' }) {
  const big = Math.max(a, b) <= 4; const r = big ? 9 : 3.6; const step = big ? 24 : 9.5;
  const row = (n, y, color) => Array.from({ length: Math.min(n, 12) }, (_, i) => <circle key={i} cx={46 + i * step} cy={y} r={r} fill={color} stroke="#2E2E2E" strokeWidth={big ? 1.2 : 0.6} />);
  return (
    <Diagram label={`${a} and ${b}`}>
      {row(a, 34, '#3E7CB1')}{row(b, 64, C.gold)}
      <text x="18" y="36" {...DIAGRAM_TEXT}>{a}{aLabel ? ` ${aLabel}` : ''}</text><text x="18" y="66" {...DIAGRAM_TEXT}>{b}{bLabel ? ` ${bLabel}` : ''}</text>
      {(a > 12 || b > 12) && <text x="80" y="92" {...DIAGRAM_TEXT}>(twelve shown of each row at most)</text>}
    </Diagram>
  );
}
function AnglesPic({ type = 'vertical', given = 50, second = 60 }) {
  const rad = (d) => (d * Math.PI) / 180;
  if (type === 'triangle') {
    const A = [20, 84]; const B = [140, 84]; const t = rad(given); const u = rad(second); const x = 20 + (120 * Math.sin(u) * Math.cos(t)) / Math.sin(t + u); const y = 84 - (120 * Math.sin(u) * Math.sin(t)) / Math.sin(t + u);
    return (
      <Diagram label="A triangle with two given angles">
        <polygon points={`${A[0]},${A[1]} ${B[0]},${B[1]} ${x},${y}`} fill="#FFFFFF" stroke="#2E2E2E" strokeWidth="1.4" strokeLinejoin="round" />
        <text x={A[0] + 14} y={A[1] - 5} {...DIAGRAM_TEXT}>{given}°</text><text x={B[0] - 14} y={B[1] - 5} {...DIAGRAM_TEXT}>{second}°</text><text x={x} y={y + 9} {...DIAGRAM_TEXT}>?</text>
      </Diagram>
    );
  }
  const cx = 80; const cy = 56; const th = rad(given);
  return (
    <Diagram label={type === 'vertical' ? 'Two lines crossing' : 'Two angles on a straight line'}>
      <line x1="10" y1={cy} x2="150" y2={cy} stroke="#2E2E2E" strokeWidth="1.4" />
      <line x1={type === 'vertical' ? cx - 60 * Math.cos(th) : cx} y1={type === 'vertical' ? cy + 60 * Math.sin(th) : cy} x2={cx + 60 * Math.cos(th)} y2={cy - 60 * Math.sin(th)} stroke="#2E2E2E" strokeWidth="1.4" />
      <path d={`M${cx + 14} ${cy} A14 14 0 0 0 ${cx + 14 * Math.cos(th)} ${cy - 14 * Math.sin(th)}`} fill="none" stroke={C.gold} strokeWidth="2" />
      <text x={cx + 22 * Math.cos(th / 2) + 8} y={cy - 22 * Math.sin(th / 2) + 2} {...DIAGRAM_TEXT}>{given}°</text>
      {type === 'vertical'
        ? <text x={cx - 22 * Math.cos(th / 2) - 8} y={cy + 22 * Math.sin(th / 2) + 4} {...DIAGRAM_TEXT}>?</text>
        : <text x={cx - 24} y={cy - 10} {...DIAGRAM_TEXT}>?</text>}
    </Diagram>
  );
}
function LightRayPic({ angle = 40 }) {
  const th = (angle * Math.PI) / 180; const cx = 80; const cy = 78;
  return (
    <Diagram label="A ray bouncing off a mirror">
      <rect x="20" y={cy} width="120" height="6" fill="#C9DDF5" stroke="#2E2E2E" strokeWidth="1" /><line x1={cx} y1={cy} x2={cx} y2="14" stroke={C.muted} strokeWidth="1" strokeDasharray="3 2" />
      <Arrow d={`M${cx - 66 * Math.sin(th)} ${cy - 66 * Math.cos(th)} L${cx} ${cy}`} color={C.gold} /><Arrow d={`M${cx} ${cy} L${cx + 66 * Math.sin(th)} ${cy - 66 * Math.cos(th)}`} color={C.gold} />
      <text x={cx - 24} y="30" {...DIAGRAM_TEXT}>{angle}° in</text><text x={cx + 26} y="30" {...DIAGRAM_TEXT}>{angle}° out</text><text x="80" y="96" {...DIAGRAM_TEXT}>mirror</text>
    </Diagram>
  );
}
function PunnettPic({ p1 = 'Bb', p2 = 'Bb' }) {
  const cells = [0, 1].flatMap((r) => [0, 1].map((c) => `${p1[c]}${p2[r]}`.split('').sort().join('')));
  return (
    <Diagram label="A Punnett square">
      {[0, 1].map((c) => <text key={`t${c}`} x={52 + c * 34} y="14" {...DIAGRAM_TEXT}>{p1[c]}</text>)}
      {[0, 1].map((r) => <text key={`l${r}`} x="26" y={38 + r * 34} {...DIAGRAM_TEXT}>{p2[r]}</text>)}
      {cells.map((g, i) => { const brown = g.includes('B'); return <g key={i}><rect x={36 + (i % 2) * 34} y={20 + Math.floor(i / 2) * 34} width="32" height="32" fill={brown ? '#E8D2B8' : '#C9DDF5'} stroke="#2E2E2E" strokeWidth="1" /><text x={52 + (i % 2) * 34} y={38 + Math.floor(i / 2) * 34} {...DIAGRAM_TEXT}>{g}</text></g>; })}
      <text x="112" y="40" {...DIAGRAM_TEXT} textAnchor="start">B = brown</text><text x="112" y="52" {...DIAGRAM_TEXT} textAnchor="start">b = blue</text>
      <text x="80" y="96" {...DIAGRAM_TEXT}>{['none', 'one', 'two', 'three', 'all four'][cells.filter((g) => g.includes('B')).length]} of the four show brown</text>
    </Diagram>
  );
}
function AllelesPic({ pair = 'Bb' }) {
  return (
    <Diagram label={`Two versions: ${pair}`}>
      {pair.split('').map((g, i) => <g key={i}><rect x={50 + i * 36} y="28" width="24" height="40" rx="6" fill={g === 'B' ? '#E8D2B8' : '#C9DDF5'} stroke="#2E2E2E" strokeWidth="1" /><text x={62 + i * 36} y="50" {...DIAGRAM_TEXT} fontSize="9">{g}</text></g>)}
      <text x="80" y="88" {...DIAGRAM_TEXT}>B = brown, dominant. b = blue, recessive.</text>
    </Diagram>
  );
}
function BeakerPic({ moles = 4, liters = 2 }) {
  const level = 20 + Math.min(liters, 5) * 12;
  return (
    <Diagram label={`${moles} moles in ${liters} liters`}>
      <path d={`M56 10 V${90} H104 V10`} fill="none" stroke="#2E2E2E" strokeWidth="1.6" /><rect x="57" y={90 - level} width="46" height={level} fill="#C9DDF5" opacity="0.9" />
      {Array.from({ length: Math.min(moles, 12) }, (_, i) => <circle key={i} cx={64 + (i % 4) * 11} cy={84 - Math.floor(i / 4) * 12} r="3" fill={C.gold} stroke="#2E2E2E" strokeWidth="0.6" />)}
      <text x="130" y="40" {...DIAGRAM_TEXT}>{moles} moles</text><text x="130" y="52" {...DIAGRAM_TEXT}>{liters} liters</text><text x="80" y="99" {...DIAGRAM_TEXT}>concentration = moles per liter</text>
    </Diagram>
  );
}
function ForcesPic() {
  const cart = (x, y, w, h, fill) => <g><rect x={x} y={y} width={w} height={h} rx="3" fill={fill} stroke="#2E2E2E" strokeWidth="1.2" /><circle cx={x + 8} cy={y + h + 4} r="4" fill="#2E2E2E" /><circle cx={x + w - 8} cy={y + h + 4} r="4" fill="#2E2E2E" /></g>;
  return (
    <Diagram label="The same push on a light cart and a heavy cart">
      <line x1="0" y1="46" x2="160" y2="46" stroke="#A9B1AA" strokeWidth="1" /><line x1="0" y1="92" x2="160" y2="92" stroke="#A9B1AA" strokeWidth="1" />
      {cart(40, 22, 30, 16, '#F7D154')}<Arrow d="M12 30 L36 30" color="#D9534F" /><text x="22" y="24" {...DIAGRAM_TEXT}>push</text><Arrow d="M76 30 L128 30" /><text x="102" y="24" {...DIAGRAM_TEXT}>fast</text>
      {cart(40, 60, 54, 24, '#8C6239')}<Arrow d="M12 72 L36 72" color="#D9534F" /><text x="22" y="66" {...DIAGRAM_TEXT}>push</text><Arrow d="M100 72 L118 72" /><text x="110" y="66" {...DIAGRAM_TEXT}>slow</text>
      <text x="80" y="99" {...DIAGRAM_TEXT}>same force, more mass, less acceleration</text>
    </Diagram>
  );
}
function CurvesPic() {
  return (
    <Diagram label="Supply and demand curves crossing at the equilibrium price">
      <line x1="24" y1="10" x2="24" y2="84" stroke="#2E2E2E" strokeWidth="1.2" /><line x1="24" y1="84" x2="150" y2="84" stroke="#2E2E2E" strokeWidth="1.2" />
      <path d="M34 20 L134 76" fill="none" stroke="#D9534F" strokeWidth="2" /><path d="M34 76 L134 20" fill="none" stroke="#3E7CB1" strokeWidth="2" />
      <circle cx="84" cy="48" r="3.5" fill={C.gold} stroke="#2E2E2E" strokeWidth="1" /><line x1="24" y1="48" x2="84" y2="48" stroke={C.muted} strokeWidth="0.8" strokeDasharray="2 2" /><line x1="84" y1="48" x2="84" y2="84" stroke={C.muted} strokeWidth="0.8" strokeDasharray="2 2" />
      <text x="140" y="80" {...DIAGRAM_TEXT} fill="#D9534F">demand</text><text x="140" y="18" {...DIAGRAM_TEXT} fill="#3E7CB1">supply</text><text x="108" y="44" {...DIAGRAM_TEXT}>equilibrium</text>
      <text x="14" y="14" {...DIAGRAM_TEXT}>price</text><text x="120" y="94" {...DIAGRAM_TEXT}>amount</text>
    </Diagram>
  );
}
function AtomPic() {
  return (
    <Diagram label="A carbon atom: nucleus and electron shells">
      <circle cx="80" cy="50" r="18" fill="none" stroke="#A9B1AA" strokeWidth="1" /><circle cx="80" cy="50" r="38" fill="none" stroke="#A9B1AA" strokeWidth="1" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => { const a = (i / 12) * Math.PI * 2; return <circle key={i} cx={80 + Math.cos(a) * 6} cy={50 + Math.sin(a) * 6} r="3.2" fill={i % 2 ? '#D9534F' : '#3E7CB1'} stroke="#2E2E2E" strokeWidth="0.6" />; })}
      {[0, 1].map((i) => <circle key={`i${i}`} cx={80 + (i ? 18 : -18)} cy="50" r="2.6" fill={C.gold} stroke="#2E2E2E" strokeWidth="0.6" />)}
      {[0, 1, 2, 3].map((i) => { const a = (i / 4) * Math.PI * 2 + 0.6; return <circle key={`o${i}`} cx={80 + Math.cos(a) * 38} cy={50 + Math.sin(a) * 38} r="2.6" fill={C.gold} stroke="#2E2E2E" strokeWidth="0.6" />; })}
      <text x="20" y="20" {...DIAGRAM_TEXT}>nucleus:</text><text x="20" y="28" {...DIAGRAM_TEXT}>6 protons</text><text x="20" y="36" {...DIAGRAM_TEXT}>6 neutrons</text>
      <text x="140" y="88" {...DIAGRAM_TEXT}>6 electrons</text>
    </Diagram>
  );
}
function NumberLinePic({ from = -5, to = 5, mark = null, marks = [] }) {
  const n = to - from; const x = (v) => 14 + ((v - from) / n) * 132; const dots = mark === null ? marks : [mark, ...marks];
  const every = n > 14 ? 2 : 1;
  return (
    <Diagram label={`A number line from ${from} to ${to}`}>
      <line x1="8" y1="50" x2="152" y2="50" stroke="#2E2E2E" strokeWidth="1.4" />
      {Array.from({ length: n + 1 }, (_, i) => from + i).map((v) => <g key={v}><line x1={x(v)} y1={v === 0 ? 40 : 44} x2={x(v)} y2={v === 0 ? 60 : 56} stroke="#2E2E2E" strokeWidth={v === 0 ? 1.6 : 1} />{(v % every === 0 || dots.includes(v)) && <text x={x(v)} y="70" {...DIAGRAM_TEXT} fontSize={n > 14 ? 4.4 : 5.2}>{v}</text>}</g>)}
      {dots.map((v, i) => <circle key={i} cx={x(v)} cy="50" r="4" fill={i === 0 ? C.gold : '#3E7CB1'} stroke="#2E2E2E" strokeWidth="1" />)}
    </Diagram>
  );
}
function DayNightPic() {
  return (
    <Diagram label="The sun lighting one side of the turning Earth">
      <circle cx="26" cy="50" r="16" fill={C.gold} />{[0, 1, 2, 3, 4].map((i) => <line key={i} x1="46" y1={26 + i * 12} x2="66" y2={26 + i * 12} stroke={C.gold} strokeWidth="1.4" />)}
      <circle cx="110" cy="50" r="28" fill="#8FC4E8" stroke="#2E2E2E" strokeWidth="1.2" /><path d="M110 22 A28 28 0 0 1 110 78 Z" fill="#2B4C8C" opacity="0.75" />
      <path d="M96 40 q8 -6 14 2 q-6 6 -14 -2" fill="#5BA84A" /><path d="M120 60 q6 6 -2 10 q-8 -2 2 -10" fill="#5BA84A" opacity="0.6" />
      <Arrow d="M100 8 C120 0 140 6 146 20" color={C.muted} />
      <text x="88" y="92" {...DIAGRAM_TEXT}>day</text><text x="132" y="92" {...DIAGRAM_TEXT} fill="#FFFFFF" stroke="#2B4C8C" strokeWidth="0.3">night</text>
    </Diagram>
  );
}
function TriPic({ base, height, area }) {
  return (
    <Diagram label="A triangle with its base and height">
      <polygon points="30,80 130,80 90,20" fill="#CFE7E5" stroke="#2E2E2E" strokeWidth="1.4" strokeLinejoin="round" />
      <line x1="90" y1="20" x2="90" y2="80" stroke="#D9534F" strokeWidth="1.2" strokeDasharray="3 2" /><rect x="90" y="74" width="5" height="6" fill="none" stroke="#D9534F" strokeWidth="0.8" />
      <text x="80" y="92" {...DIAGRAM_TEXT}>base {base}</text><text x="108" y="50" {...DIAGRAM_TEXT} fill="#D9534F">height {height}</text>
      {area !== undefined && <text x="70" y="62" {...DIAGRAM_TEXT}>area {area}</text>}
    </Diagram>
  );
}
function ParaPic({ base, height, side }) {
  return (
    <Diagram label="A parallelogram with its base, height and slanted side">
      <polygon points="30,80 110,80 140,24 60,24" fill="#F9DDB7" stroke="#2E2E2E" strokeWidth="1.4" strokeLinejoin="round" />
      <line x1="110" y1="80" x2="110" y2="24" stroke="#D9534F" strokeWidth="1.2" strokeDasharray="3 2" /><rect x="105" y="74" width="5" height="6" fill="none" stroke="#D9534F" strokeWidth="0.8" />
      <text x="70" y="92" {...DIAGRAM_TEXT}>base {base}</text><text x="128" y="56" {...DIAGRAM_TEXT} fill="#D9534F">height {height}</text><text x="36" y="50" {...DIAGRAM_TEXT}>side {side}</text>
    </Diagram>
  );
}
function EqualGroupsPic({ total = 24, groups = 3 }) {
  const per = Math.floor(total / groups); const w = 140 / groups;
  return (
    <Diagram label={`${total} shared into ${groups} groups`}>
      {Array.from({ length: groups }, (_, g) => <g key={g}><rect x={12 + g * w} y="14" width={w - 6} height="62" rx="8" fill="#FFFFFF" stroke={C.muted} strokeWidth="1" strokeDasharray="3 2" />{Array.from({ length: per }, (_, i) => <circle key={i} cx={20 + g * w + (i % 3) * ((w - 24) / 2)} cy={24 + Math.floor(i / 3) * 12} r="3.4" fill={C.gold} stroke="#2E2E2E" strokeWidth="0.6" />)}</g>)}
      <text x="80" y="94" {...DIAGRAM_TEXT}>{total} ÷ {groups} = {per}</text>
    </Diagram>
  );
}
function FracGridPic({ a = [1, 2], b = [1, 2] }) {
  const cw = 80 / b[1]; const rh = 64 / a[1];
  return (
    <Diagram label="A fraction of a fraction">
      {Array.from({ length: b[1] }, (_, c) => <rect key={`c${c}`} x={40 + c * cw} y="10" width={cw} height="64" fill={c < b[0] ? '#C9DDF5' : '#FFFFFF'} stroke="#2E2E2E" strokeWidth="0.8" />)}
      {Array.from({ length: a[1] }, (_, r) => <rect key={`r${r}`} x="40" y={10 + r * rh} width="80" height={rh} fill={r < a[0] ? C.gold : 'none'} opacity="0.55" stroke="#2E2E2E" strokeWidth="0.8" />)}
      <text x="80" y="92" {...DIAGRAM_TEXT}>{a[0]}/{a[1]} of {b[0]}/{b[1]} = {a[0] * b[0]}/{a[1] * b[1]}</text>
    </Diagram>
  );
}
function OpsPic({ add = 3, rows = 4, cols = 2 }) {
  return (
    <Diagram label={`${add} plus ${rows} times ${cols}`}>
      {Array.from({ length: add }, (_, i) => <circle key={i} cx={22 + i * 12} cy="44" r="4" fill={C.gold} stroke="#2E2E2E" strokeWidth="0.6" />)}
      <text x="70" y="47" {...DIAGRAM_TEXT}>+</text>
      <rect x="80" y="14" width={cols * 14 + 6} height={rows * 14 + 6} rx="4" fill="none" stroke={C.green} strokeWidth="1.2" />
      {Array.from({ length: rows * cols }, (_, i) => <circle key={`a${i}`} cx={90 + (i % cols) * 14} cy={24 + Math.floor(i / cols) * 14} r="4" fill="#3E7CB1" stroke="#2E2E2E" strokeWidth="0.6" />)}
      <text x="80" y="94" {...DIAGRAM_TEXT}>{add} + {rows} × {cols} = {add + rows * cols}</text>
    </Diagram>
  );
}
function CuboidPic({ l = 4, w = 3, h = 2 }) {
  const u = 10; const ox = 40; const oy = 78; const cube = (x, y, z) => { const px = ox + x * u + z * u * 0.5; const py = oy - y * u - z * u * 0.5; return <g key={`${x}${y}${z}`}><rect x={px} y={py - u} width={u} height={u} fill={C.gold} stroke="#2E2E2E" strokeWidth="0.5" /><polygon points={`${px},${py - u} ${px + u * 0.5},${py - u * 1.5} ${px + u * 1.5},${py - u * 1.5} ${px + u},${py - u}`} fill="#FFF3C8" stroke="#2E2E2E" strokeWidth="0.5" /><polygon points={`${px + u},${py - u} ${px + u * 1.5},${py - u * 1.5} ${px + u * 1.5},${py - u * 0.5} ${px + u},${py}`} fill="#C9A227" stroke="#2E2E2E" strokeWidth="0.5" /></g>; };
  const cubes = []; for (let z = w - 1; z >= 0; z--) for (let y = 0; y < h; y++) for (let x = 0; x < l; x++) cubes.push(cube(x, y, z));
  return <Diagram label={`${l} by ${w} by ${h}`}>{cubes}<text x="118" y="60" {...DIAGRAM_TEXT}>{l} × {w} × {h} = {l * w * h}</text></Diagram>;
}
function FracPiecesPic({ wholes = 3, per = 2 }) {
  return (
    <Diagram label={`${wholes} wholes in ${per === 2 ? 'halves' : 'pieces'}`}>
      {Array.from({ length: wholes }, (_, k) => <g key={k}>{Array.from({ length: per }, (_, i) => <rect key={i} x={16 + k * 46 + i * (40 / per)} y="24" width={40 / per} height="36" fill={C.goldSoft} stroke="#2E2E2E" strokeWidth="1" />)}</g>)}
      <text x="80" y="84" {...DIAGRAM_TEXT}>{wholes} ÷ 1/{per} = {wholes * per} pieces</text>
    </Diagram>
  );
}
function BalancePic({ left = 'x + 5', right = '12' }) {
  return (
    <Diagram label="A balanced scale">
      <polygon points="70,90 90,90 80,62" fill={C.muted} /><line x1="14" y1="60" x2="146" y2="60" stroke="#2E2E2E" strokeWidth="2.4" />
      <path d="M14 60 L20 40 L50 40 L56 60" fill="#FFF3C8" stroke="#2E2E2E" strokeWidth="1.2" /><path d="M104 60 L110 40 L140 40 L146 60" fill="#C9DDF5" stroke="#2E2E2E" strokeWidth="1.2" />
      <text x="35" y="33" {...DIAGRAM_TEXT} fontSize="7">{left}</text><text x="125" y="33" {...DIAGRAM_TEXT} fontSize="7">{right}</text><text x="80" y="98" {...DIAGRAM_TEXT}>whatever you do to one pan, do to the other</text>
    </Diagram>
  );
}
function CirclePic({ d = 4 }) {
  return (
    <Diagram label="A circle with its diameter">
      <circle cx="80" cy="50" r="36" fill="#EEF4FB" stroke="#2E2E2E" strokeWidth="1.6" /><line x1="44" y1="50" x2="116" y2="50" stroke={C.gold} strokeWidth="2" /><circle cx="80" cy="50" r="2" fill="#2E2E2E" />
      <text x="80" y="45" {...DIAGRAM_TEXT}>d = {d}</text><text x="80" y="96" {...DIAGRAM_TEXT}>around ≈ 3.14 × {d} = {(3.14 * d).toFixed(2)}</text>
    </Diagram>
  );
}
function DoublingPic({ base = 2, times = 5, ask = false }) {
  const counts = Array.from({ length: times + 1 }, (_, i) => base ** i);
  return (
    <Diagram label={`Powers of ${base}`}>
      {counts.map((n, k) => <g key={k}><text x={14 + k * 25} y="12" {...DIAGRAM_TEXT}>{k === 0 ? '1' : `${base}^${k}`}</text>{Array.from({ length: Math.min(n, 32) }, (_, i) => <circle key={i} cx={8 + k * 25 + (i % 4) * 5} cy={20 + Math.floor(i / 4) * 5} r="1.8" fill={C.gold} />)}<text x={14 + k * 25} y="74" {...DIAGRAM_TEXT}>{n}</text></g>)}
      <text x="80" y="94" {...DIAGRAM_TEXT}>{ask ? `${base} to what power is ${counts[times]}? ${times}.` : `${base}^${times} = ${counts[times]}`}</text>
    </Diagram>
  );
}
function GrowthBarsPic({ values = [100, 110, 121, 133], labels = [] }) {
  const max = Math.max(...values); const w = Math.min(28, 120 / values.length);
  return (
    <Diagram label="Bars growing">
      {values.map((v, i) => <g key={i}><rect x={20 + i * (w + 8)} y={80 - (v / max) * 60} width={w} height={(v / max) * 60} rx="3" fill={i % 2 ? C.gold : '#3E7CB1'} stroke="#2E2E2E" strokeWidth="0.8" /><text x={20 + i * (w + 8) + w / 2} y={76 - (v / max) * 60} {...DIAGRAM_TEXT} fontSize="4.6">{v}</text><text x={20 + i * (w + 8) + w / 2} y="92" {...DIAGRAM_TEXT} fontSize="4.6">{labels[i] || ''}</text></g>)}
    </Diagram>
  );
}
function PlotPic({ fn = 'line', point = null }) {
  const X = (x) => 80 + x * 12; const Y = (y) => 52 - y * 8;
  const curves = { line: [(x) => 2 * x + 1], slope: [(x) => 2 * x], exp: [(x) => 2 ** x / 4], decay: [(x) => 5 * 0.5 ** (x + 2)], parabola: [(x) => (x * x) / 3 - 3], shift: [(x) => (x * x) / 3, (x) => ((x - 2) * (x - 2)) / 3 + 3], cubeneg: [(x) => -(x * x * x) / 12], steeper: [(x) => x, (x) => 2.5 * x], accel: [(x) => (x + 5) * 0.7], hubble: [(x) => 0.7 * x], cross: [(x) => x + 1, (x) => -x + 5], composite: [(x) => x + 1, (x) => x * x / 3] };
  const path = (f) => { const pts = []; for (let x = -5; x <= 5; x += 0.25) { const y = f(x); if (Number.isFinite(y) && y > -6 && y < 6) pts.push(`${X(x).toFixed(1)},${Y(y).toFixed(1)}`); } return pts.join(' '); };
  return (
    <Diagram label="A graph">
      <line x1="16" y1="52" x2="144" y2="52" stroke="#2E2E2E" strokeWidth="1" /><line x1="80" y1="8" x2="80" y2="96" stroke="#2E2E2E" strokeWidth="1" />
      {(curves[fn] || curves.line).map((f, i) => <polyline key={i} points={path(f)} fill="none" stroke={i ? C.gold : '#3E7CB1'} strokeWidth="2" strokeLinejoin="round" />)}
      {fn === 'slope' && <g><line x1={X(1)} y1={Y(2)} x2={X(2)} y2={Y(2)} stroke={C.gold} strokeWidth="1.6" /><line x1={X(2)} y1={Y(2)} x2={X(2)} y2={Y(4)} stroke={C.gold} strokeWidth="1.6" /><text x={X(1.5)} y={Y(2) + 6} {...DIAGRAM_TEXT}>run 1</text><text x={X(2) + 10} y={Y(3)} {...DIAGRAM_TEXT}>rise 2</text></g>}
      {fn === 'line' && point !== null && <g><circle cx={X(point)} cy={Y(2 * point + 1)} r="3" fill={C.gold} stroke="#2E2E2E" strokeWidth="0.8" /><text x={X(point) + 16} y={Y(2 * point + 1) - 4} {...DIAGRAM_TEXT}>({point}, {2 * point + 1})</text></g>}
      {fn === 'cross' && <circle cx={X(2)} cy={Y(3)} r="3" fill={C.gold} stroke="#2E2E2E" strokeWidth="0.8" />}
      {fn === 'shift' && <text x="120" y="20" {...DIAGRAM_TEXT}>moved 2 right, 3 up</text>}
      {fn === 'cubeneg' && <><text x="30" y="14" {...DIAGRAM_TEXT}>up on the left</text><text x="128" y="92" {...DIAGRAM_TEXT}>down on the right</text></>}
    </Diagram>
  );
}
function TilesPic({ p = 2, q = 3 }) {
  const u = 12; const xw = 34; const ox = 26; const oy = 16;
  return (
    <Diagram label={`x + ${p} by x + ${q}`}>
      <rect x={ox} y={oy} width={xw} height={xw} fill="#C9DDF5" stroke="#2E2E2E" strokeWidth="0.8" /><text x={ox + xw / 2} y={oy + xw / 2} {...DIAGRAM_TEXT}>x²</text>
      {Array.from({ length: p }, (_, i) => <rect key={`r${i}`} x={ox + xw + i * u} y={oy} width={u} height={xw} fill={C.goldSoft} stroke="#2E2E2E" strokeWidth="0.8" />)}
      {Array.from({ length: q }, (_, i) => <rect key={`b${i}`} x={ox} y={oy + xw + i * u} width={xw} height={u} fill={C.goldSoft} stroke="#2E2E2E" strokeWidth="0.8" />)}
      {Array.from({ length: p * q }, (_, i) => <rect key={`u${i}`} x={ox + xw + (i % p) * u} y={oy + xw + Math.floor(i / p) * u} width={u} height={u} fill="#DCEBD3" stroke="#2E2E2E" strokeWidth="0.8" />)}
      <text x={ox + xw / 2} y={oy - 6} {...DIAGRAM_TEXT}>x</text><text x={ox + xw + (p * u) / 2} y={oy - 6} {...DIAGRAM_TEXT}>{p}</text><text x={ox - 8} y={oy + xw / 2} {...DIAGRAM_TEXT}>x</text><text x={ox - 8} y={oy + xw + (q * u) / 2} {...DIAGRAM_TEXT}>{q}</text>
      <text x="118" y="60" {...DIAGRAM_TEXT}>x² + {p + q}x + {p * q}</text>
    </Diagram>
  );
}
function SectorPic({ degrees = 90 }) {
  const a = (degrees * Math.PI) / 180; const ex = 80 + Math.cos(-a) * 36; const ey = 50 + Math.sin(-a) * 36;
  return <Diagram label={`${degrees} degrees of a circle`}><circle cx="80" cy="50" r="36" fill="#FFFFFF" stroke="#2E2E2E" strokeWidth="1.4" /><path d={`M80 50 L116 50 A36 36 0 ${degrees > 180 ? 1 : 0} 0 ${ex.toFixed(1)} ${ey.toFixed(1)} Z`} fill={C.goldSoft} stroke={C.gold} strokeWidth="1.6" /><text x="80" y="96" {...DIAGRAM_TEXT}>{degrees} of 360 = {(degrees / 360).toFixed(2)} of the way around</text></Diagram>;
}
function TrigTriPic() {
  return <Diagram label="A right triangle with its sides named"><polygon points="30,84 130,84 130,20" fill="#FFFFFF" stroke="#2E2E2E" strokeWidth="1.4" strokeLinejoin="round" /><rect x="120" y="74" width="8" height="8" fill="none" stroke="#2E2E2E" strokeWidth="0.8" /><path d="M44 84 A14 14 0 0 0 42 78" fill="none" stroke={C.gold} strokeWidth="1.6" /><text x="80" y="94" {...DIAGRAM_TEXT}>adjacent</text><text x="144" y="52" {...DIAGRAM_TEXT}>opposite</text><text x="66" y="44" {...DIAGRAM_TEXT}>hypotenuse</text><text x="52" y="80" {...DIAGRAM_TEXT}>θ</text></Diagram>;
}
function SimilarPic() {
  return <Diagram label="Two similar triangles"><polygon points="14,80 38,80 14,62" fill="#C9DDF5" stroke="#2E2E2E" strokeWidth="1.2" /><polygon points="60,88 132,88 60,34" fill="#FFF3C8" stroke="#2E2E2E" strokeWidth="1.2" /><text x="26" y="90" {...DIAGRAM_TEXT}>4</text><text x="8" y="72" {...DIAGRAM_TEXT}>3</text><text x="32" y="68" {...DIAGRAM_TEXT}>5</text><text x="96" y="96" {...DIAGRAM_TEXT}>12</text><text x="52" y="62" {...DIAGRAM_TEXT}>9</text><text x="104" y="58" {...DIAGRAM_TEXT}>15</text><text x="80" y="14" {...DIAGRAM_TEXT}>every side times 3</text></Diagram>;
}
function ReflectPic({ point = [2, 3] }) {
  const X = (x) => 80 + x * 12; const Y = (y) => 52 - y * 9;
  return <Diagram label="A point and its reflection"><line x1="16" y1="52" x2="144" y2="52" stroke="#2E2E2E" strokeWidth="1" /><line x1="80" y1="8" x2="80" y2="96" stroke="#2E2E2E" strokeWidth="1.6" /><circle cx={X(point[0])} cy={Y(point[1])} r="3" fill={C.gold} stroke="#2E2E2E" strokeWidth="0.8" /><circle cx={X(-point[0])} cy={Y(point[1])} r="3" fill="#3E7CB1" stroke="#2E2E2E" strokeWidth="0.8" /><line x1={X(point[0])} y1={Y(point[1])} x2={X(-point[0])} y2={Y(point[1])} stroke={C.muted} strokeWidth="0.8" strokeDasharray="2 2" /><text x={X(point[0]) + 14} y={Y(point[1]) - 4} {...DIAGRAM_TEXT}>({point[0]}, {point[1]})</text><text x={X(-point[0]) - 16} y={Y(point[1]) - 4} {...DIAGRAM_TEXT}>({-point[0]}, {point[1]})</text></Diagram>;
}
function UnitCirclePic({ deg = 45 }) {
  const a = (deg * Math.PI) / 180; const x = 80 + Math.cos(a) * 36; const y = 50 - Math.sin(a) * 36;
  return <Diagram label="The unit circle"><circle cx="80" cy="50" r="36" fill="none" stroke="#2E2E2E" strokeWidth="1.2" /><line x1="36" y1="50" x2="124" y2="50" stroke={C.muted} strokeWidth="0.8" /><line x1="80" y1="6" x2="80" y2="94" stroke={C.muted} strokeWidth="0.8" /><line x1="80" y1="50" x2={x} y2={y} stroke={C.gold} strokeWidth="1.8" /><line x1={x} y1={y} x2={x} y2="50" stroke="#3E7CB1" strokeWidth="1.4" strokeDasharray="2 2" /><circle cx={x} cy={y} r="3" fill={C.gold} stroke="#2E2E2E" strokeWidth="0.8" /><text x={x + 18} y={y - 4} {...DIAGRAM_TEXT}>(cos, sin)</text><text x={(80 + x) / 2} y="58" {...DIAGRAM_TEXT}>cos</text><text x={x + 10} y={(y + 50) / 2} {...DIAGRAM_TEXT}>sin</text><text x="80" y="96" {...DIAGRAM_TEXT}>radius 1, angle {deg}°</text></Diagram>;
}
function ScatterPic() {
  const rnd = lcg(11); const pts = Array.from({ length: 18 }, () => { const t = rnd(); return [20 + t * 120, 82 - t * 60 + (rnd() - 0.5) * 16]; });
  return <Diagram label="Two things that rise together"><line x1="16" y1="86" x2="150" y2="86" stroke="#2E2E2E" strokeWidth="1" /><line x1="16" y1="86" x2="16" y2="10" stroke="#2E2E2E" strokeWidth="1" />{pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.6" fill={C.gold} stroke="#2E2E2E" strokeWidth="0.6" />)}<text x="86" y="96" {...DIAGRAM_TEXT}>ice cream sold</text><text x="14" y="6" {...DIAGRAM_TEXT} textAnchor="start">swimming accidents</text><text x="118" y="24" {...DIAGRAM_TEXT}>hot days cause both</text></Diagram>;
}
function DotPlotPic({ values = [], compare = null }) {
  const row = (vals, y, color) => { const counts = {}; return vals.map((v, i) => { counts[v] = (counts[v] || 0) + 1; return <circle key={i} cx={20 + v * 12} cy={y - (counts[v] - 1) * 7} r="3" fill={color} stroke="#2E2E2E" strokeWidth="0.6" />; }); };
  return <Diagram label="A dot plot"><line x1="12" y1="46" x2="150" y2="46" stroke="#2E2E2E" strokeWidth="1" />{Array.from({ length: 11 }, (_, v) => <text key={v} x={20 + v * 12} y="54" {...DIAGRAM_TEXT} fontSize="4.4">{v}</text>)}{row(values, 40, C.gold)}{compare && <><line x1="12" y1="92" x2="150" y2="92" stroke="#2E2E2E" strokeWidth="1" />{row(compare, 86, '#3E7CB1')}</>}</Diagram>;
}
function SpinnerPic({ sectors = 8, win = 3 }) {
  const arc = (i) => { const a0 = (i / sectors) * Math.PI * 2; const a1 = ((i + 1) / sectors) * Math.PI * 2; return `M80 50 L${80 + Math.cos(a0) * 36} ${50 + Math.sin(a0) * 36} A36 36 0 0 1 ${80 + Math.cos(a1) * 36} ${50 + Math.sin(a1) * 36} Z`; };
  return <Diagram label={`${win} of ${sectors} sectors win`}>{Array.from({ length: sectors }, (_, i) => <path key={i} d={arc(i)} fill={i < win ? C.gold : '#FFFFFF'} stroke="#2E2E2E" strokeWidth="0.8" />)}<polygon points="80,50 76,20 84,20" fill="#2E2E2E" /><text x="80" y="96" {...DIAGRAM_TEXT}>{win} of {sectors} = {win}/{sectors}</text></Diagram>;
}
const Box = ({ x, y, w, h, text, fill = '#FFFFFF' }) => { const [X, Y, W, H] = [x, y, w, h].map(Number); const size = Math.min(5.2, Math.max(3.2, (W * 1.5) / Math.max(4, text.length))); return <g><rect x={X} y={Y} width={W} height={H} rx="6" fill={fill} stroke="#2E2E2E" strokeWidth="1" /><text x={X + W / 2} y={Y + H / 2} {...DIAGRAM_TEXT} fontSize={size}>{text}</text></g>; };
function FlowPic({ steps = [] }) {
  // Up to four boxes in a row; a longer chain wraps to a second row and the arrow turns the corner.
  const per = steps.length > 4 ? Math.ceil(steps.length / 2) : steps.length; const rows = Math.ceil(steps.length / per);
  const w = Math.min(40, (150 - (per - 1) * 12) / per); const gap = (160 - per * w) / (per + 1); const y0 = rows > 1 ? 18 : 38;
  const at = (i) => [gap + (i % per) * (w + gap), y0 + Math.floor(i / per) * 40];
  return <Diagram label={steps.join(', then ')}>{steps.map((t, i) => { const [x, y] = at(i); const nxt = i < steps.length - 1 ? at(i + 1) : null; return <g key={i}><Box x={x} y={y} w={w} h={24} text={t} fill={i === steps.length - 1 ? C.goldSoft : '#FFFFFF'} />{nxt && (nxt[1] === y ? <Arrow d={`M${x + w + 2} ${y + 12} L${nxt[0] - 2} ${y + 12}`} /> : <Arrow d={`M${x + w / 2} ${y + 26} C${x + w / 2} ${y + 40} ${nxt[0] + w / 2} ${y + 26} ${nxt[0] + w / 2} ${nxt[1] - 2}`} />)}</g>; })}</Diagram>;
}
function LoopPic({ steps = [] }) {
  const n = steps.length; const cx = 80; const cy = 50; const r = 34;
  const at = (i) => { const a = -Math.PI / 2 + (i / n) * Math.PI * 2; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; };
  return <Diagram label={steps.join(' around to ')}>{steps.map((t, i) => { const [x1, y1] = at(i); const [x2, y2] = at((i + 1) % n); const mx = (x1 + x2) / 2; const my = (y1 + y2) / 2; const dx = mx - cx; const dy = my - cy; const k = 1.25; return <path key={`a${i}`} d={`M${x1} ${y1} Q${cx + dx * k} ${cy + dy * k} ${x2} ${y2}`} fill="none" stroke={C.green} strokeWidth="1.4" markerEnd="url(#eduArrow)" />; })}{steps.map((t, i) => { const [x, y] = at(i); return <Box key={i} x={x - 17} y={y - 7} w={34} h={14} text={t} />; })}</Diagram>;
}
function StatesPic() {
  const rnd = lcg(4); const panel = (x, label, mode) => <g><rect x={x} y="12" width="44" height="60" rx="5" fill="#EEF4FB" stroke="#2E2E2E" strokeWidth="1" />{Array.from({ length: mode === 'gas' ? 6 : 16 }, (_, i) => { const gx = mode === 'solid' ? x + 8 + (i % 4) * 9.5 : mode === 'liquid' ? x + 8 + (i % 4) * 9.5 + (rnd() - 0.5) * 4 : x + 6 + rnd() * 32; const gy = mode === 'solid' ? 20 + Math.floor(i / 4) * 12 : mode === 'liquid' ? 34 + Math.floor(i / 4) * 9 + (rnd() - 0.5) * 3 : 16 + rnd() * 50; return <circle key={i} cx={gx} cy={gy} r="3" fill="#3E7CB1" stroke="#2E2E2E" strokeWidth="0.5" />; })}<text x={x + 22} y="84" {...DIAGRAM_TEXT}>{label}</text></g>;
  return <Diagram label="Solid, liquid, gas">{panel(8, 'ice', 'solid')}{panel(58, 'water', 'liquid')}{panel(108, 'steam', 'gas')}</Diagram>;
}
function ThermometerPic({ c = 30 }) {
  const top = 12; const bottom = 76; const y = bottom - ((c + 10) / 50) * (bottom - top);
  return <Diagram label={`${c} degrees Celsius`}><rect x="74" y={top} width="12" height={bottom - top} rx="6" fill="#FFFFFF" stroke="#2E2E2E" strokeWidth="1.2" /><rect x="77" y={y} width="6" height={bottom - y} fill="#D9534F" /><circle cx="80" cy="82" r="9" fill="#D9534F" stroke="#2E2E2E" strokeWidth="1.2" />{[-10, 0, 10, 20, 30, 40].map((v) => <g key={v}><line x1="86" y1={bottom - ((v + 10) / 50) * (bottom - top)} x2="92" y2={bottom - ((v + 10) / 50) * (bottom - top)} stroke="#2E2E2E" strokeWidth="0.8" /><text x="100" y={bottom - ((v + 10) / 50) * (bottom - top) + 2} {...DIAGRAM_TEXT}>{v}°C</text></g>)}</Diagram>;
}
function CircuitPic({ mode = 'single', labels = false }) {
  const bulb = (x, y, lit = true) => <g><circle cx={x} cy={y} r="6" fill={lit ? C.gold : '#FFFFFF'} stroke="#2E2E2E" strokeWidth="1" /><rect x={x - 3} y={y + 5} width="6" height="4" fill="#2E2E2E" /></g>;
  const battery = (x, y) => <g><rect x={x - 4} y={y - 8} width="8" height="16" fill="#2E2E2E" /><rect x={x - 2} y={y - 11} width="4" height="3" fill="#2E2E2E" /></g>;
  if (mode === 'both') return <Diagram label="Series and parallel"><rect x="12" y="20" width="56" height="50" fill="none" stroke="#2E2E2E" strokeWidth="1.2" />{battery(12, 45)}{bulb(30, 20)}{bulb(52, 20)}<text x="40" y="84" {...DIAGRAM_TEXT}>series: one path</text><rect x="92" y="20" width="56" height="50" fill="none" stroke="#2E2E2E" strokeWidth="1.2" /><line x1="120" y1="20" x2="120" y2="70" stroke="#2E2E2E" strokeWidth="1.2" />{battery(92, 45)}{bulb(120, 38)}{bulb(148, 45)}<text x="120" y="84" {...DIAGRAM_TEXT}>parallel: many paths</text></Diagram>;
  return <Diagram label="A circuit"><rect x="36" y="18" width="88" height="56" fill="none" stroke="#2E2E2E" strokeWidth="1.4" />{battery(36, 46)}{bulb(80, 18)}{labels && <><text x="18" y="46" {...DIAGRAM_TEXT}>V</text><text x="80" y="8" {...DIAGRAM_TEXT}>R</text><Arrow d="M50 74 L110 74" /><text x="80" y="86" {...DIAGRAM_TEXT}>I, the current</text></>}{!labels && <text x="80" y="88" {...DIAGRAM_TEXT}>battery, wire, bulb, and back</text>}</Diagram>;
}
function OrbitsPic() {
  return <Diagram label="The sun, the Earth and the moon"><circle cx="50" cy="50" r="16" fill={C.gold} /><ellipse cx="50" cy="50" rx="66" ry="36" fill="none" stroke={C.muted} strokeWidth="0.8" strokeDasharray="3 2" /><circle cx="116" cy="50" r="7" fill="#8FC4E8" stroke="#2E2E2E" strokeWidth="0.8" /><circle cx="116" cy="50" r="14" fill="none" stroke={C.muted} strokeWidth="0.6" strokeDasharray="2 2" /><circle cx="130" cy="50" r="2.5" fill="#DDE3EB" stroke="#2E2E2E" strokeWidth="0.5" /><Arrow d="M108 34 A16 16 0 0 1 128 38" color={C.green} /><text x="80" y="94" {...DIAGRAM_TEXT}>spin a day, circle a year, moon circles a month</text></Diagram>;
}
function MixturePic() {
  const rnd = lcg(21);
  return <Diagram label="A mixture and a solution"><path d="M24 14 V78 H72 V14" fill="none" stroke="#2E2E2E" strokeWidth="1.4" /><rect x="25" y="30" width="46" height="48" fill="#C9DDF5" />{Array.from({ length: 14 }, (_, i) => <circle key={i} cx={30 + rnd() * 36} cy={70 + rnd() * 6} r="1.8" fill="#8C6239" />)}<text x="48" y="90" {...DIAGRAM_TEXT}>sand settles: a mixture</text><path d="M88 14 V78 H136 V14" fill="none" stroke="#2E2E2E" strokeWidth="1.4" /><rect x="89" y="30" width="46" height="48" fill="#C9DDF5" />{Array.from({ length: 22 }, (_, i) => <circle key={`s${i}`} cx={94 + rnd() * 36} cy={34 + rnd() * 40} r="1.2" fill="#FFFFFF" stroke="#3E7CB1" strokeWidth="0.4" />)}<text x="112" y="90" {...DIAGRAM_TEXT}>salt spreads out: a solution</text></Diagram>;
}
function DensityPic() {
  const block = (x, n, label) => <g><rect x={x} y="22" width="44" height="44" rx="3" fill="#FFF3C8" stroke="#2E2E2E" strokeWidth="1.2" />{Array.from({ length: n }, (_, i) => <circle key={i} cx={x + 8 + (i % 5) * 7} cy={30 + Math.floor(i / 5) * 8} r="2.4" fill="#8C6239" />)}<text x={x + 22} y="80" {...DIAGRAM_TEXT}>{label}</text></g>;
  return <Diagram label="Two blocks the same size">{block(24, 8, 'light')}{block(92, 24, 'dense')}<text x="80" y="94" {...DIAGRAM_TEXT}>density = mass ÷ volume</text></Diagram>;
}
function PyramidPic({ levels = [1000, 100, 10, 1] }) {
  return <Diagram label="An energy pyramid">{levels.map((v, i) => { const w = 130 - i * 30; return <g key={i}><rect x={80 - w / 2} y={78 - i * 18} width={w} height="16" fill={['#9ACD32', '#5BA84A', C.gold, '#D9534F'][i]} stroke="#2E2E2E" strokeWidth="0.8" /><text x="80" y={86 - i * 18 - 0.5} {...DIAGRAM_TEXT}>{v.toLocaleString('en-US')}</text></g>; })}<text x="80" y="98" {...DIAGRAM_TEXT}>about a tenth moves up each level</text></Diagram>;
}
function MoleculePic({ formulaText = 'H₂O', masses = false }) {
  return <Diagram label={formulaText}><circle cx="80" cy="44" r="16" fill="#D9534F" stroke="#2E2E2E" strokeWidth="1" /><circle cx="56" cy="62" r="10" fill="#FFFFFF" stroke="#2E2E2E" strokeWidth="1" /><circle cx="104" cy="62" r="10" fill="#FFFFFF" stroke="#2E2E2E" strokeWidth="1" /><text x="80" y="44" {...DIAGRAM_TEXT} fill="#FFFFFF" fontSize="7">O</text><text x="56" y="62" {...DIAGRAM_TEXT} fontSize="6">H</text><text x="104" y="62" {...DIAGRAM_TEXT} fontSize="6">H</text>{masses ? <text x="80" y="92" {...DIAGRAM_TEXT}>1 + 1 + 16 = 18 grams per mole</text> : <text x="80" y="92" {...DIAGRAM_TEXT}>{formulaText}: two hydrogens bonded to one oxygen</text>}</Diagram>;
}
function PlatesPic() {
  const panel = (x, label, d1, d2) => <g><rect x={x} y="24" width="22" height="30" fill="#C9A227" stroke="#2E2E2E" strokeWidth="0.8" /><rect x={x + 24} y="24" width="22" height="30" fill="#E3D9A6" stroke="#2E2E2E" strokeWidth="0.8" /><Arrow d={d1} /><Arrow d={d2} /><text x={x + 23} y="70" {...DIAGRAM_TEXT}>{label}</text></g>;
  return <Diagram label="Plates push, pull and slide">{panel(8, 'push', 'M2 40 L8 40', 'M60 40 L54 40')}{panel(60, 'pull', 'M80 40 L74 40', 'M88 40 L94 40')}{panel(112, 'slide', 'M114 18 L130 18', 'M156 60 L140 60')}<text x="80" y="92" {...DIAGRAM_TEXT}>mountains, rifts, earthquakes</text></Diagram>;
}
function MothsPic() {
  const moth = (x, y, fill) => <g><ellipse cx={x - 6} cy={y} rx="7" ry="4" fill={fill} stroke="#2E2E2E" strokeWidth="0.6" transform={`rotate(-20 ${x - 6} ${y})`} /><ellipse cx={x + 6} cy={y} rx="7" ry="4" fill={fill} stroke="#2E2E2E" strokeWidth="0.6" transform={`rotate(20 ${x + 6} ${y})`} /><ellipse cx={x} cy={y} rx="2" ry="5" fill="#2E2E2E" /></g>;
  return <Diagram label="A pale moth and a dark moth on a dark trunk"><rect x="30" y="8" width="100" height="80" rx="6" fill="#4A3F35" />{moth(60, 40, '#F5EFE0')}{moth(100, 58, '#4A3F35')}<text x="60" y="78" {...DIAGRAM_TEXT} fill="#FFFFFF">seen</text><text x="100" y="78" {...DIAGRAM_TEXT} fill="#FFFFFF">hidden</text></Diagram>;
}
function LayersPic() {
  return <Diagram label="Rock layers, deeper is older">{['#E3D9A6', '#C9A227', '#A6825B', '#8C6239'].map((f, i) => <rect key={i} x="24" y={16 + i * 17} width="112" height="17" fill={f} stroke="#2E2E2E" strokeWidth="0.6" />)}<path d="M96 66 q6 -8 12 0 q-6 4 -12 0" fill="#FFFFFF" stroke="#2E2E2E" strokeWidth="0.8" /><text x="140" y="28" {...DIAGRAM_TEXT} textAnchor="start">newest</text><text x="140" y="78" {...DIAGRAM_TEXT} textAnchor="start">oldest</text></Diagram>;
}
function CellDivPic() {
  return <Diagram label="One cell becomes two"><circle cx="40" cy="50" r="22" fill="#E9F3DE" stroke="#2E2E2E" strokeWidth="1.2" /><text x="40" y="50" {...DIAGRAM_TEXT}>46</text><Arrow d="M66 50 L86 50" /><circle cx="108" cy="36" r="14" fill="#E9F3DE" stroke="#2E2E2E" strokeWidth="1.2" /><circle cx="108" cy="66" r="14" fill="#E9F3DE" stroke="#2E2E2E" strokeWidth="1.2" /><text x="108" y="36" {...DIAGRAM_TEXT}>23</text><text x="108" y="66" {...DIAGRAM_TEXT}>23</text><text x="80" y="94" {...DIAGRAM_TEXT}>sex cells carry half</text></Diagram>;
}
function BasePairsPic() {
  const pairs = [['A', 'T'], ['C', 'G'], ['T', 'A'], ['G', 'C']];
  return <Diagram label="DNA base pairs"><line x1="50" y1="10" x2="50" y2="90" stroke="#2E2E2E" strokeWidth="3" /><line x1="110" y1="10" x2="110" y2="90" stroke="#2E2E2E" strokeWidth="3" />{pairs.map(([a, b], i) => <g key={i}><rect x="50" y={18 + i * 18} width="30" height="8" fill={a === 'A' || a === 'T' ? C.goldSoft : '#C9DDF5'} stroke="#2E2E2E" strokeWidth="0.6" /><rect x="80" y={18 + i * 18} width="30" height="8" fill={b === 'A' || b === 'T' ? C.goldSoft : '#C9DDF5'} stroke="#2E2E2E" strokeWidth="0.6" /><text x="65" y={22 + i * 18} {...DIAGRAM_TEXT}>{a}</text><text x="95" y={22 + i * 18} {...DIAGRAM_TEXT}>{b}</text></g>)}</Diagram>;
}
function HomologyPic() {
  const limb = (x, label, scale) => <g><line x1={x} y1="20" x2={x + 4 * scale} y2="52" stroke="#2E2E2E" strokeWidth="4" strokeLinecap="round" /><line x1={x + 4 * scale} y1="52" x2={x - 2 * scale} y2="72" stroke="#2E2E2E" strokeWidth="3" strokeLinecap="round" /><line x1={x + 4 * scale} y1="52" x2={x + 8 * scale} y2="72" stroke="#2E2E2E" strokeWidth="3" strokeLinecap="round" /><text x={x + 3} y="88" {...DIAGRAM_TEXT}>{label}</text></g>;
  return <Diagram label="An arm, a flipper, a wing">{limb(30, 'arm', 1)}{limb(80, 'flipper', 0.6)}{limb(128, 'wing', 1.4)}</Diagram>;
}
function TwoWayPic({ a = '', b = '', top = '', bottom = '' }) {
  return <Diagram label={`${a} and ${b}, each way`}><Box x="6" y="38" w="56" h="24" text={a} /><Box x="98" y="38" w="56" h="24" text={b} /><Arrow d="M64 44 L96 44" /><Arrow d="M96 56 L64 56" color={C.gold} /><text x="80" y="32" {...DIAGRAM_TEXT}>{top}</text><text x="80" y="72" {...DIAGRAM_TEXT}>{bottom}</text></Diagram>;
}
function PhScalePic() {
  return <Diagram label="The pH scale"><defs><linearGradient id="eduPh" x1="0" x2="1"><stop offset="0" stopColor="#D9534F" /><stop offset="0.5" stopColor="#5BA84A" /><stop offset="1" stopColor="#4B3A8F" /></linearGradient></defs><rect x="14" y="40" width="132" height="14" rx="4" fill="url(#eduPh)" stroke="#2E2E2E" strokeWidth="0.8" />{[0, 7, 14].map((v) => <text key={v} x={14 + (v / 14) * 132} y="66" {...DIAGRAM_TEXT}>{v}</text>)}<text x="34" y="30" {...DIAGRAM_TEXT}>acid</text><text x="80" y="30" {...DIAGRAM_TEXT}>neutral</text><text x="128" y="30" {...DIAGRAM_TEXT}>base</text><text x="80" y="88" {...DIAGRAM_TEXT}>lemon near 2, water at 7, soap near 10</text></Diagram>;
}
function ReactionPic({ left = [], right = [] }) {
  const row = (items, x0, fill) => items.map((t, i) => <g key={t + i}><Box x={x0 + i * 32} y="36" w="26" h="20" text={t} fill={fill} />{i < items.length - 1 && <text x={x0 + i * 32 + 29} y="47" {...DIAGRAM_TEXT}>+</text>}</g>);
  const lw = left.length * 32 - 6; const rw = right.length * 32 - 6; const x0 = Math.max(4, (150 - lw - rw - 24) / 2);
  return <Diagram label="A reaction">{row(left, x0, '#FFFFFF')}<Arrow d={`M${x0 + lw + 3} 46 L${x0 + lw + 22} 46`} />{row(right, x0 + lw + 26, C.goldSoft)}<text x="80" y="80" {...DIAGRAM_TEXT}>what goes in becomes what comes out</text></Diagram>;
}
function GasLawPic() {
  const cyl = (x, h, n, label) => <g><rect x={x} y={80 - h} width="40" height={h} fill="#EEF4FB" stroke="#2E2E2E" strokeWidth="1.2" /><rect x={x - 3} y={78 - h} width="46" height="4" fill="#2E2E2E" />{Array.from({ length: n }, (_, i) => <circle key={i} cx={x + 8 + (i % 4) * 8} cy={74 - Math.floor(i / 4) * (h / 3)} r="2.2" fill="#3E7CB1" />)}<text x={x + 20} y="92" {...DIAGRAM_TEXT}>{label}</text></g>;
  return <Diagram label="The same gas in two volumes">{cyl(28, 56, 8, 'big, low pressure')}{cyl(96, 28, 8, 'half, double')}</Diagram>;
}
function BondsPic() {
  return <Diagram label="Ionic and covalent"><circle cx="34" cy="44" r="13" fill="#F6C9C4" stroke="#2E2E2E" strokeWidth="1" /><circle cx="66" cy="44" r="13" fill="#CFE7E5" stroke="#2E2E2E" strokeWidth="1" /><text x="34" y="44" {...DIAGRAM_TEXT}>Na⁺</text><text x="66" y="44" {...DIAGRAM_TEXT}>Cl⁻</text><Arrow d="M40 28 C50 20 58 22 62 30" color={C.gold} /><text x="50" y="72" {...DIAGRAM_TEXT}>gives: ionic</text><circle cx="120" cy="40" r="12" fill="#D9534F" stroke="#2E2E2E" strokeWidth="1" /><circle cx="104" cy="56" r="7" fill="#FFFFFF" stroke="#2E2E2E" strokeWidth="1" /><circle cx="136" cy="56" r="7" fill="#FFFFFF" stroke="#2E2E2E" strokeWidth="1" /><circle cx="110" cy="49" r="2" fill={C.gold} /><circle cx="130" cy="49" r="2" fill={C.gold} /><text x="120" y="72" {...DIAGRAM_TEXT}>shares: covalent</text></Diagram>;
}
function MomentumPic() {
  return <Diagram label="A bike and a truck at the same speed"><circle cx="40" cy="60" r="8" fill="#3E7CB1" stroke="#2E2E2E" strokeWidth="1" /><Arrow d="M52 60 L76 60" /><text x="40" y="82" {...DIAGRAM_TEXT}>small mass</text><rect x="90" y="40" width="40" height="30" rx="4" fill="#8C6239" stroke="#2E2E2E" strokeWidth="1" /><Arrow d="M134 55 L158 55" /><text x="110" y="82" {...DIAGRAM_TEXT}>big mass</text><text x="80" y="96" {...DIAGRAM_TEXT}>same speed, more mass, more momentum</text></Diagram>;
}
function WavePic({ wavelength = 40, amplitude = 14 }) {
  const pts = []; for (let x = 10; x <= 150; x += 2) pts.push(`${x},${50 - Math.sin(((x - 10) / wavelength) * Math.PI * 2) * amplitude}`);
  return <Diagram label="A wave"><line x1="10" y1="50" x2="150" y2="50" stroke={C.muted} strokeWidth="0.8" /><polyline points={pts.join(' ')} fill="none" stroke="#3E7CB1" strokeWidth="2" /><line x1="20" y1="22" x2="60" y2="22" stroke={C.gold} strokeWidth="1.4" /><text x="40" y="16" {...DIAGRAM_TEXT}>wavelength λ</text><line x1="130" y1="50" x2="130" y2={50 - amplitude} stroke={C.gold} strokeWidth="1.4" /><text x="140" y="40" {...DIAGRAM_TEXT}>amplitude</text></Diagram>;
}
function WorkPic() {
  return <Diagram label="A push through a distance"><line x1="10" y1="70" x2="150" y2="70" stroke="#2E2E2E" strokeWidth="1" /><rect x="30" y="44" width="30" height="26" fill="#F7D154" stroke="#2E2E2E" strokeWidth="1" /><Arrow d="M8 57 L28 57" color="#D9534F" /><text x="18" y="50" {...DIAGRAM_TEXT}>F</text><rect x="100" y="44" width="30" height="26" fill="#F7D154" stroke="#2E2E2E" strokeWidth="1" opacity="0.45" /><line x1="45" y1="82" x2="115" y2="82" stroke={C.gold} strokeWidth="1.4" /><text x="80" y="92" {...DIAGRAM_TEXT}>distance d</text></Diagram>;
}
function EarthLayersPic() {
  return <Diagram label="The Earth in layers"><circle cx="80" cy="50" r="44" fill="#8C6239" stroke="#2E2E2E" strokeWidth="1.2" /><circle cx="80" cy="50" r="40" fill="#E4572E" /><circle cx="80" cy="50" r="22" fill="#F4A259" /><circle cx="80" cy="50" r="11" fill="#FFF3C8" stroke="#2E2E2E" strokeWidth="0.6" /><text x="80" y="10" {...DIAGRAM_TEXT}>crust</text><text x="80" y="24" {...DIAGRAM_TEXT}>mantle</text><text x="80" y="38" {...DIAGRAM_TEXT}>outer core</text><text x="80" y="52" {...DIAGRAM_TEXT}>inner</text></Diagram>;
}
function OceanPic() {
  return <Diagram label="Cold salty water sinking"><rect x="10" y="20" width="140" height="66" fill="#C9DDF5" /><rect x="10" y="20" width="140" height="8" fill="#FFFFFF" opacity="0.5" /><Arrow d="M30 30 C26 50 26 66 40 78" color="#2B4C8C" /><Arrow d="M50 80 L120 80" color="#2B4C8C" /><Arrow d="M130 72 C136 50 132 36 110 30" color="#D9534F" /><Arrow d="M100 28 L44 28" color="#D9534F" /><text x="34" y="16" {...DIAGRAM_TEXT}>cold, salty: sinks</text><text x="120" y="16" {...DIAGRAM_TEXT}>warm: rises</text></Diagram>;
}
function HeatPic() {
  return <Diagram label="Conduction, convection, radiation"><rect x="8" y="34" width="44" height="14" fill="#D9534F" /><rect x="8" y="48" width="44" height="14" fill="#F4A259" /><text x="30" y="76" {...DIAGRAM_TEXT}>touch</text><path d="M62 70 V32 H102 V70" fill="none" stroke="#2E2E2E" strokeWidth="1.2" /><path d="M72 62 C72 44 92 44 92 62" fill="none" stroke="#D9534F" strokeWidth="1.4" markerEnd="url(#eduArrow)" /><text x="82" y="82" {...DIAGRAM_TEXT}>flow</text><circle cx="130" cy="42" r="10" fill={C.gold} />{[0, 1, 2].map((i) => <line key={i} x1={118 + i * 12} y1="58" x2={114 + i * 12} y2="70" stroke={C.gold} strokeWidth="1.4" />)}<text x="130" y="82" {...DIAGRAM_TEXT}>rays</text></Diagram>;
}
function TimelinePic({ events = [] }) {
  const years = events.map((e) => e[0]); const lo = Math.min(...years); const hi = Math.max(...years); const span = Math.max(1, hi - lo);
  const X = (y) => 16 + ((y - lo) / span) * 128; const label = (y) => (y < 0 ? `${-y} BC` : `${y}`);
  return (
    <Diagram label={events.map((e) => `${label(e[0])} ${e[1]}`).join(', ')}>
      <line x1="10" y1="52" x2="150" y2="52" stroke="#2E2E2E" strokeWidth="1.4" /><polygon points="150,48 156,52 150,56" fill="#2E2E2E" />
      {(() => {
        // Dots sit at their true years; labels spread out so close years do not pile up, joined by a thin leader.
        let last = -100; const placed = events.map(([y, t], i) => { const x = X(y); const lx = Math.max(x, last + 22); last = lx; return { x, lx, y, t, up: i % 2 === 0 }; });
        return placed.map(({ x, lx, y, t, up }, i) => <g key={i}><line x1={x} y1="46" x2={x} y2="58" stroke="#2E2E2E" strokeWidth="1.2" /><circle cx={x} cy="52" r="3" fill={C.gold} stroke="#2E2E2E" strokeWidth="0.8" />{lx !== x && <line x1={x} y1={up ? 46 : 58} x2={lx} y2={up ? 44 : 64} stroke={C.muted} strokeWidth="0.6" />}<text x={lx} y={up ? 34 : 72} {...DIAGRAM_TEXT} fontSize="5.4" fontWeight="700">{label(y)}</text><text x={lx} y={up ? 42 : 80} {...DIAGRAM_TEXT} fontSize="4.4">{t}</text></g>);
      })()}
    </Diagram>
  );
}
const MAP_SHAPES = {
  texas: [[52, 6], [74, 6], [74, 36], [120, 36], [126, 60], [124, 76], [80, 96], [50, 64], [24, 44], [52, 44]],
  us: [[8, 30], [40, 22], [80, 18], [120, 22], [150, 30], [152, 48], [136, 58], [128, 72], [104, 74], [96, 86], [80, 72], [60, 74], [36, 70], [12, 56]],
};
const WORLD_SHAPES = [[[10, 14], [50, 10], [64, 30], [46, 52], [28, 48], [14, 30]], [[40, 54], [56, 52], [60, 70], [48, 92], [40, 72]], [[76, 16], [96, 14], [100, 32], [84, 36], [76, 28]], [[78, 38], [100, 38], [104, 60], [92, 80], [80, 66]], [[98, 10], [152, 12], [156, 40], [130, 56], [104, 42], [100, 30]], [[126, 66], [148, 66], [150, 84], [128, 84]]];
function MapPic({ region = 'texas', spots = [] }) {
  const land = { fill: '#DCEBD3', stroke: '#2E2E2E', strokeWidth: 1.2, strokeLinejoin: 'round' };
  return (
    <Diagram label={`${region} map${spots.length ? ': ' + spots.map((s) => s[2]).join(', ') : ''}`}>
      <rect x="0" y="0" width="160" height="100" fill={region === 'town' ? '#F5F7F1' : '#C9DDF5'} />
      {region === 'town' ? <g stroke="#FFFFFF" strokeWidth="6">{[20, 60, 100, 140].map((x) => <line key={`v${x}`} x1={x} y1="0" x2={x} y2="100" />)}{[16, 52, 88].map((y) => <line key={`h${y}`} x1="0" y1={y} x2="160" y2={y} />)}</g>
        : region === 'world' ? WORLD_SHAPES.map((pts, i) => <polygon key={i} points={pts.map((p) => p.join(',')).join(' ')} {...land} />)
        : <polygon points={MAP_SHAPES[region].map((p) => p.join(',')).join(' ')} {...land} />}
      {spots.map(([x, y, t], i) => <g key={i}><circle cx={x} cy={y} r="3.4" fill={C.gold} stroke="#2E2E2E" strokeWidth="0.9" /><text x={x} y={y - 6} {...DIAGRAM_TEXT} fontSize="4.6" fontWeight="700">{t}</text></g>)}
    </Diagram>
  );
}
function BranchesPic({ checks = false }) {
  return <Diagram label="Three branches of government"><Box x="6" y="36" w="44" h="26" text="Congress" fill="#C9DDF5" /><Box x="58" y="36" w="44" h="26" text="President" fill="#FFF3C8" /><Box x="110" y="36" w="44" h="26" text="Courts" fill="#DCEBD3" /><text x="28" y="76" {...DIAGRAM_TEXT}>makes laws</text><text x="80" y="76" {...DIAGRAM_TEXT}>carries out</text><text x="132" y="76" {...DIAGRAM_TEXT}>judges</text>{checks && <><Arrow d="M28 34 C40 12 68 12 80 34" color={C.gold} /><Arrow d="M80 64 C92 88 120 88 132 64" color={C.gold} /><Arrow d="M132 34 C110 6 50 6 28 34" color={C.gold} /><text x="80" y="10" {...DIAGRAM_TEXT}>each checks the others</text></>}</Diagram>;
}
function StackPic({ levels = [] }) {
  return <Diagram label={levels.join(' over ')}>{levels.map((t, i) => <Box key={i} x={30 + i * 10} y={12 + i * 26} w={100 - i * 20} h={20} text={t} fill={['#C9DDF5', '#FFF3C8', '#DCEBD3', '#F6C9C4'][i % 4]} />)}</Diagram>;
}
function CompassPic() {
  return <Diagram label="A compass rose"><circle cx="80" cy="50" r="34" fill="#FFFFFF" stroke="#2E2E2E" strokeWidth="1.2" /><polygon points="80,18 86,50 80,82 74,50" fill={C.gold} stroke="#2E2E2E" strokeWidth="0.8" /><polygon points="48,50 80,44 112,50 80,56" fill="#C9DDF5" stroke="#2E2E2E" strokeWidth="0.8" /><text x="80" y="10" {...DIAGRAM_TEXT} fontSize="7">N</text><text x="80" y="94" {...DIAGRAM_TEXT} fontSize="7">S</text><text x="122" y="52" {...DIAGRAM_TEXT} fontSize="7">E</text><text x="38" y="52" {...DIAGRAM_TEXT} fontSize="7">W</text></Diagram>;
}
function FlagPic({ stars = false, texas = false }) {
  if (texas) return <Diagram label="The Texas flag"><rect x="20" y="16" width="120" height="68" fill="#FFFFFF" stroke="#2E2E2E" strokeWidth="1" /><rect x="20" y="16" width="40" height="68" fill="#2B4C8C" /><rect x="60" y="50" width="80" height="34" fill="#D9534F" /><BigStarSmall x={40} y={50} /></Diagram>;
  return <Diagram label="The United States flag">{Array.from({ length: 13 }, (_, i) => <rect key={i} x="20" y={16 + i * 5.2} width="120" height="5.2" fill={i % 2 ? '#FFFFFF' : '#D9534F'} />)}<rect x="20" y="16" width="48" height="36.4" fill="#2B4C8C" />{stars && Array.from({ length: 50 }, (_, i) => <circle key={`s${i}`} cx={24 + (i % 10) * 4.4} cy={19 + Math.floor(i / 10) * 7} r="1.1" fill="#FFFFFF" />)}<rect x="20" y="16" width="120" height="67.6" fill="none" stroke="#2E2E2E" strokeWidth="1" /><text x="80" y="94" {...DIAGRAM_TEXT}>{stars ? 'fifty stars, thirteen stripes' : 'thirteen stripes'}</text></Diagram>;
}
function BigStarSmall({ x, y }) { const pts = Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + (i * Math.PI) / 5; const r = i % 2 ? 5 : 12; return `${x + Math.cos(a) * r},${y + Math.sin(a) * r}`; }).join(' '); return <polygon points={pts} fill="#FFFFFF" />; }
function SignPic({ text = 'STOP', color = '#D9534F' }) {
  const oct = text === 'STOP';
  return <Diagram label={`A ${text} sign`}>{oct ? <polygon points="62,22 98,22 116,40 116,60 98,78 62,78 44,60 44,40" fill={color} stroke="#2E2E2E" strokeWidth="1.2" /> : <rect x="44" y="30" width="72" height="40" rx="4" fill={color} stroke="#2E2E2E" strokeWidth="1.2" />}<text x="80" y="50" {...DIAGRAM_TEXT} fontSize="12" fontWeight="800" fill="#FFFFFF">{text}</text></Diagram>;
}
const DIAGRAMS = { timeline: TimelinePic, map: MapPic, branches: BranchesPic, stack: StackPic, compass: CompassPic, flag: FlagPic, sign: SignPic, flow: FlowPic, loop: LoopPic, states: StatesPic, thermometer: ThermometerPic, circuit: CircuitPic, orbits: OrbitsPic, mixture: MixturePic, densitypic: DensityPic, pyramid: PyramidPic, molecule: MoleculePic, plates: PlatesPic, moths: MothsPic, layers: LayersPic, celldiv: CellDivPic, basepairs: BasePairsPic, homology: HomologyPic, twoway: TwoWayPic, phscale: PhScalePic, reaction: ReactionPic, gaslaw: GasLawPic, bonds: BondsPic, momentum: MomentumPic, wave: WavePic, work: WorkPic, earthlayers: EarthLayersPic, ocean: OceanPic, heat: HeatPic, equalgroups: EqualGroupsPic, fracgrid: FracGridPic, opspic: OpsPic, cuboid: CuboidPic, fracpieces: FracPiecesPic, balance: BalancePic, circlepic: CirclePic, doubling: DoublingPic, growthbars: GrowthBarsPic, plot: PlotPic, tiles: TilesPic, sector: SectorPic, trigtri: TrigTriPic, similar: SimilarPic, reflect: ReflectPic, unitcircle: UnitCirclePic, scatter: ScatterPic, dotplot: DotPlotPic, spinner: SpinnerPic, cycle: CyclePic, leaf: LeafPic, pythag: PythagPic, cell: CellPic, forces: ForcesPic, curves: CurvesPic, atom: AtomPic, daynight: DayNightPic, percentgrid: PercentGridPic, groups: GroupsPic, angles: AnglesPic, lightray: LightRayPic, punnett: PunnettPic, alleles: AllelesPic, beaker: BeakerPic };
// The periodic table, drawn here so a lesson can show it and a question can light up the element it
// names. Cells are tinted by family; a highlighted element, period or group gets a gold edge.
const PT_SYMBOLS = 'H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr Rf Db Sg Bh Hs Mt Ds Rg Cn Nh Fl Mc Lv Ts Og'.split(' ');
function ptPlace(z) {
  if (z === 1) return [1, 1]; if (z === 2) return [1, 18];
  if (z <= 10) return [2, z <= 4 ? z - 2 : z + 8]; if (z <= 18) return [3, z <= 12 ? z - 10 : z];
  if (z <= 36) return [4, z - 18]; if (z <= 54) return [5, z - 36];
  if (z <= 56) return [6, z - 54]; if (z <= 71) return [9, z - 54]; if (z <= 86) return [6, z - 68];
  if (z <= 88) return [7, z - 86]; if (z <= 103) return [10, z - 86]; return [7, z - 100];
}
function ptFamily(z, row, col) {
  if (row >= 9) return row === 9 ? '#E7D7F3' : '#F1D6E4';
  if (z === 1 || [6, 7, 8, 15, 16, 34].includes(z)) return '#DCEBD3';
  if ([5, 14, 32, 33, 51, 52, 85].includes(z)) return '#E3E9C6';
  if (col === 1) return '#F6C9C4'; if (col === 2) return '#F9DDB7'; if (col === 17) return '#CFE7E5'; if (col === 18) return '#C9DDF5';
  if (col >= 3 && col <= 12) return '#F3E8C8'; return '#DDE3EB';
}
function PeriodicPic({ highlight = [], period = null, group = null }) {
  const cell = 20; const gap = 1.4; const w = 18 * (cell + gap); const h = 10 * (cell + gap) + 6; const H = h + 26;
  return (
    <svg viewBox={`0 0 ${w} ${H}`} width="100%" role="img" aria-label="The periodic table" style={{ display: 'block', maxWidth: 720, margin: '0 auto' }}>
      {PT_SYMBOLS.map((sym, i) => {
        const z = i + 1; const [row, col] = ptPlace(z); const x = (col - 1) * (cell + gap); const y = (row - 1) * (cell + gap) + (row >= 9 ? 6 : 0);
        const lit = highlight.includes(sym) || (period && row === period) || (group && col === group && row <= 7);
        return (
          <g key={sym}>
            <rect x={x} y={y} width={cell} height={cell} rx={2} fill={lit ? C.goldSoft : ptFamily(z, row, col)} stroke={lit ? C.gold : '#A9B1AA'} strokeWidth={lit ? 1.6 : 0.5} />
            <text x={x + cell / 2} y={y + cell / 2 + 0.5} fontSize={sym.length > 2 ? 5.6 : 7} fontWeight={lit ? 800 : 600} fontFamily={FONT} textAnchor="middle" dominantBaseline="central" fill={C.ink}>{sym}</text>
          </g>
        );
      })}
      {/* The legend: the family colors, so the table itself says what a question asks. */}
      {[['#F6C9C4', 'alkali metals'], ['#F9DDB7', 'alkaline earth'], ['#F3E8C8', 'transition metals'], ['#DDE3EB', 'other metals'], ['#E3E9C6', 'metalloids'], ['#DCEBD3', 'nonmetals'], ['#CFE7E5', 'halogens'], ['#C9DDF5', 'noble gases']].map(([fill, name], i) => <g key={name}><rect x={4 + (i % 4) * 96} y={h - 2 + Math.floor(i / 4) * 12} width="9" height="9" rx="1.5" fill={fill} stroke="#A9B1AA" strokeWidth="0.5" /><text x={16 + (i % 4) * 96} y={h + 5.5 + Math.floor(i / 4) * 12} fontSize="7" fontFamily={FONT} fill={C.ink}>{name}</text></g>)}
    </svg>
  );
}
// ---- Graduation certificates. Four templates drawn in code on one landscape sheet (1600 by 1100):
// the EduSphere mark, the student's name as the educator types it, the grade, and room for 0 to 3
// photos. A photo is read into memory for the sheet and never written anywhere by the app; the
// educator prints or saves the finished sheet and that is the only copy.
const CERT_TEMPLATES = [
  { id: 'classic', title: 'Classic', photos: 0, blurb: 'A framed certificate with a seal.', w: 1600, h: 1100 },
  { id: 'stars', title: 'Stars', photos: 1, blurb: 'One round photo, bright and playful.', w: 1600, h: 1100 },
  { id: 'arches', title: 'Arches', photos: 2, blurb: 'Two tall photos and the year.', w: 1100, h: 1600 },
  { id: 'classof', title: 'Class of', photos: 3, blurb: 'Three photos, a keepsake card.', w: 1100, h: 1600 },
];
const CERT_GRADE_NAME = { PK3: 'Pre-K 3', PK4: 'Pre-K 4', K: 'Kindergarten', C: 'College level' };
function certGradeName(g) { return CERT_GRADE_NAME[g] || `Grade ${g}`; }
const SERIF = 'Georgia, "Times New Roman", serif';
const CERT_TEXT = {
  en: { title: 'CERTIFICATE', sub: 'OF GRADUATION', presented: 'PROUDLY PRESENTED TO', forDone: (g) => `for completing every module of ${g}`, awarded: (d) => `Awarded on ${d}`, educator: 'Educator', date: 'Date', graduated: (g) => `graduated from ${g}!`, great: 'Great job!', every: (g, d) => `Every module of ${g} completed. ${d}`, happy: 'Happy', grad1: 'GRADU', grad2: 'ATION', proud1: 'WE ARE SO PROUD', proud2: 'OF YOU', classOf: 'Class of', graduation: 'Graduation', locale: 'en-US', grade: (g) => certGradeName(g) },
  es: { title: 'CERTIFICADO', sub: 'DE GRADUACIÓN', presented: 'ENTREGADO CON ORGULLO A', forDone: (g) => `por completar todos los módulos de ${g}`, awarded: (d) => `Otorgado el ${d}`, educator: 'Educador', date: 'Fecha', graduated: (g) => `¡se graduó de ${g}!`, great: '¡Excelente trabajo!', every: (g, d) => `Todos los módulos de ${g} completados. ${d}`, happy: 'Feliz', grad1: 'GRADUA', grad2: 'CIÓN', proud1: 'ESTAMOS MUY', proud2: 'ORGULLOSOS DE TI', classOf: 'Generación', graduation: 'Graduación', locale: 'es-MX', grade: (g) => ({ PK3: 'Pre-K 3', PK4: 'Pre-K 4', K: 'Kínder', C: 'Nivel universitario' }[g] || `${g}.º grado`) },
};
function Confetti({ seed = 3, n = 60, w = 1600, h = 1100 }) {
  const rnd = lcg(seed); const colors = [CRAYONS[0], CRAYONS[3], CRAYONS[6], CRAYONS[8], CRAYONS[11], CRAYONS[12]];
  return <g>{Array.from({ length: n }, (_, i) => { const x = rnd() * w; const y = rnd() * h; const s = 10 + rnd() * 16; const r = rnd() * 360; return <rect key={i} x={x} y={y} width={s} height={s * 0.55} rx={3} fill={colors[i % colors.length]} opacity="0.85" transform={`rotate(${r} ${x} ${y})`} />; })}</g>;
}
function BigStar({ x, y, size, color }) { const pts = Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + (i * Math.PI) / 5; const r = i % 2 ? size * 0.42 : size; return `${x + Math.cos(a) * r},${y + Math.sin(a) * r}`; }).join(' '); return <polygon points={pts} fill={color} stroke="#2E2E2E" strokeWidth="3" strokeLinejoin="round" />; }
function Seal({ x, y }) {
  return <g>{Array.from({ length: 24 }, (_, i) => { const a = (i / 24) * Math.PI * 2; return <circle key={i} cx={x + Math.cos(a) * 62} cy={y + Math.sin(a) * 62} r="14" fill="#B23A3A" />; })}<circle cx={x} cy={y} r="60" fill="#C9473F" /><circle cx={x} cy={y} r="44" fill="none" stroke="#FFE4C4" strokeWidth="3" /><BigStar x={x} y={y + 3} size={22} color={C.gold} /></g>;
}
// A scrolled corner for the classic frame, mirrored into the four corners.
function Corner({ x, y, flipX = false, flipY = false }) {
  return <g transform={`translate(${x} ${y}) scale(${flipX ? -1 : 1} ${flipY ? -1 : 1})`} fill="none" stroke={C.green} strokeWidth="5" strokeLinecap="round"><path d="M0 120 C0 40 40 0 120 0" /><path d="M0 120 C10 70 70 10 120 0 M30 120 C30 80 80 30 120 30" /><path d="M0 160 C0 60 60 0 160 0" strokeWidth="2.5" /><circle cx="42" cy="42" r="10" fill={C.gold} stroke="none" /></g>;
}
function Arch({ x, y, w, h }) { return `M${x} ${y + h} V${y + w / 2} A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2} V${y + h} Z`; }
function PhotoFrame({ id, x, y, w, h, src, shape = 'rect', tilt = 0 }) {
  const clipId = `edu-cert-clip-${id}`; const cx = x + w / 2; const cy = y + h / 2;
  const clip = shape === 'round' ? <circle cx={cx} cy={cy} r={Math.min(w, h) / 2} /> : shape === 'arch' ? <path d={Arch({ x, y, w, h })} /> : <rect x={x} y={y} width={w} height={h} rx="14" />;
  const frame = shape === 'round' ? <circle cx={cx} cy={cy} r={Math.min(w, h) / 2 + 10} fill="#FFFFFF" stroke="#2E2E2E" strokeWidth="4" /> : shape === 'arch' ? <path d={Arch({ x: x - 8, y: y - 8, w: w + 16, h: h + 16 })} fill="#FFFFFF" stroke="#2E2E2E" strokeWidth="3" /> : <rect x={x - 14} y={y - 14} width={w + 28} height={h + 60} rx="10" fill="#FFFFFF" stroke="#2E2E2E" strokeWidth="4" />;
  return (
    <g transform={`rotate(${tilt} ${cx} ${cy})`}>
      <defs><clipPath id={clipId}>{clip}</clipPath></defs>{frame}
      {src ? <image href={src} x={x} y={y} width={w} height={h} preserveAspectRatio="xMidYMid slice" clipPath={`url(#${clipId})`} />
        : <g clipPath={`url(#${clipId})`}><rect x={x} y={y} width={w} height={h} fill="#EAF0E6" /><BigStar x={cx} y={cy} size={Math.min(w, h) * 0.22} color={C.goldSoft} /></g>}
    </g>
  );
}
function CertificateSheet({ template, name, grade, photos, date, year, lang = 'en' }) {
  const T = CERT_TEXT[lang] || CERT_TEXT.en; const t = template.id; const who = name.trim() || (lang === 'es' ? 'Nuestro graduado' : 'Our graduate'); const { w, h } = template; const G = T.grade(grade);
  const mark = (x, y, size) => <svg x={x} y={y} width={size} height={size * 0.876} viewBox="0 0 290 254"><Logo width={290} /></svg>;
  const common = { role: 'img', 'aria-label': `${who} graduated from ${certGradeName(grade)}`, lang, style: { display: 'block', borderRadius: 12, border: `1px solid ${C.line}`, background: '#FFFFFF' } };
  if (t === 'classic') return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" {...common}>
      <rect width={w} height={h} fill="#FFFDF7" /><rect x="50" y="50" width={w - 100} height={h - 100} fill="none" stroke={C.green} strokeWidth="4" /><rect x="66" y="66" width={w - 132} height={h - 132} fill="none" stroke={C.gold} strokeWidth="2" />
      <Corner x={70} y={70} /><Corner x={w - 70} y={70} flipX /><Corner x={70} y={h - 70} flipY /><Corner x={w - 70} y={h - 70} flipX flipY />
      {mark(w / 2 - 110, 96, 220)}
      <text x={w / 2} y="380" fontFamily={SERIF} fontSize="72" fontWeight="700" textAnchor="middle" fill={C.ink} letterSpacing="6">{T.title}</text>
      <text x={w / 2} y="426" fontFamily={SERIF} fontSize="28" textAnchor="middle" fill={C.muted} letterSpacing="6">{T.sub}</text>
      <text x={w / 2} y="520" fontFamily={SERIF} fontSize="24" textAnchor="middle" fill={C.muted} letterSpacing="4">{T.presented}</text>
      <text x={w / 2} y="620" fontFamily={SERIF} fontSize="92" fontStyle="italic" textAnchor="middle" fill={C.ink}>{who}</text><line x1={w / 2 - 340} y1="648" x2={w / 2 + 340} y2="648" stroke={C.ink} strokeWidth="2" />
      <text x={w / 2} y="712" fontFamily={SERIF} fontSize="30" textAnchor="middle" fill={C.ink}>{T.forDone(G)}</text>
      <text x={w / 2} y="756" fontFamily={SERIF} fontSize="26" textAnchor="middle" fill={C.muted}>{T.awarded(date)}</text>
      <line x1="300" y1="930" x2="620" y2="930" stroke={C.ink} strokeWidth="2" /><text x="460" y="964" fontFamily={SERIF} fontSize="22" textAnchor="middle" fill={C.muted}>{T.educator}</text>
      <line x1={w - 620} y1="930" x2={w - 300} y2="930" stroke={C.ink} strokeWidth="2" /><text x={w - 460} y="964" fontFamily={SERIF} fontSize="22" textAnchor="middle" fill={C.muted}>{T.date}</text>
      <Seal x={w / 2} y={905} />
    </svg>
  );
  if (t === 'stars') return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" {...common}>
      <rect width={w} height={h} fill="#EEF4FB" /><rect x="40" y="40" width={w - 80} height={h - 80} rx="28" fill="none" stroke={C.gold} strokeWidth="10" />
      {[[160, 180, 60], [1430, 160, 74], [220, 900, 50], [1380, 920, 62], [120, 560, 40], [1490, 520, 44]].map(([x, y, r], i) => <BigStar key={i} x={x} y={y} size={r} color={i % 2 ? C.gold : CRAYONS[3]} />)}
      <PhotoFrame id="a" x={590} y={150} w={420} h={420} src={photos[0]} shape="round" />{mark(1290, 72, 210)}
      <text x={w / 2} y="700" fontFamily={FONT} fontSize="74" fontWeight="800" textAnchor="middle" fill={C.ink}>{who}</text>
      <text x={w / 2} y="780" fontFamily={FONT} fontSize="46" fontWeight="600" textAnchor="middle" fill={C.ink}>{T.graduated(G)}</text>
      <text x={w / 2} y="870" fontFamily={FONT} fontSize="54" fontWeight="800" textAnchor="middle" fill={C.green}>{T.great}</text>
      <text x={w / 2} y="960" fontFamily={FONT} fontSize="28" fontWeight="600" textAnchor="middle" fill={C.muted}>{T.every(G, date)}</text>
    </svg>
  );
  if (t === 'arches') return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" {...common}>
      <rect width={w} height={h} fill="#FFFFFF" />
      <PhotoFrame id="a" x={90} y={110} w={430} h={760} src={photos[0]} shape="arch" /><PhotoFrame id="b" x={600} y={640} w={420} h={780} src={photos[1]} shape="arch" />
      {String(year).split('').map((d, i) => <text key={i} x="560" y={430 + i * 160} fontFamily={FONT} fontSize="190" fontWeight="800" textAnchor="middle" fill="#FFFFFF" stroke={C.ink} strokeWidth="8" paintOrder="stroke">{d}</text>)}
      <text x="810" y="180" fontFamily={SERIF} fontSize="86" fontStyle="italic" textAnchor="middle" fill={C.ink}>{T.happy}</text>
      <text x="810" y="300" fontFamily={FONT} fontSize="118" fontWeight="800" textAnchor="middle" fill={C.ink} letterSpacing="2">{T.grad1}</text><text x="810" y="420" fontFamily={FONT} fontSize="118" fontWeight="800" textAnchor="middle" fill={C.ink} letterSpacing="2">{T.grad2}</text>
      {mark(740, 470, 150)}
      <text x="300" y="1010" fontFamily={SERIF} fontSize="78" fontStyle="italic" textAnchor="middle" fill={C.ink}>{who}</text>
      <text x="300" y="1085" fontFamily={FONT} fontSize="40" fontWeight="600" textAnchor="middle" fill={C.ink}>{G}</text><line x1="220" y1="1130" x2="380" y2="1130" stroke={C.ink} strokeWidth="3" />
      <text x="300" y="1200" fontFamily={FONT} fontSize="30" fontWeight="600" textAnchor="middle" fill={C.muted} letterSpacing="4">{T.proud1}</text><text x="300" y="1246" fontFamily={FONT} fontSize="30" fontWeight="600" textAnchor="middle" fill={C.muted} letterSpacing="4">{T.proud2}</text>
      <text x="300" y="1400" fontFamily={FONT} fontSize="24" textAnchor="middle" fill={C.muted}>{date}</text>
    </svg>
  );
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" {...common}>
      <rect width={w} height={h} fill="#FFFFFF" />
      <text x="140" y="360" fontFamily={SERIF} fontSize="60" fontStyle="italic" textAnchor="middle" fill={C.ink} transform="rotate(-72 140 360)">{T.classOf}</text>
      <text x="330" y="270" fontFamily={FONT} fontSize="170" fontWeight="800" textAnchor="middle" fill={C.ink}>{String(year).slice(0, 2)}</text><text x="330" y="430" fontFamily={FONT} fontSize="170" fontWeight="800" textAnchor="middle" fill={C.ink}>{String(year).slice(2)}</text>
      <PhotoFrame id="a" x={100} y={520} w={410} h={900} src={photos[0]} shape="arch" /><PhotoFrame id="b" x={580} y={90} w={430} h={560} src={photos[1]} shape="arch" /><PhotoFrame id="c" x={580} y={690} w={430} h={470} src={photos[2]} shape="rect" />
      <text x="800" y="1290" fontFamily={SERIF} fontSize="84" fontStyle="italic" textAnchor="middle" fill={C.ink}>{T.graduation}</text>
      <text x="800" y="1370" fontFamily={FONT} fontSize="56" fontWeight="800" textAnchor="middle" fill={C.ink}>{who}</text>
      <text x="800" y="1430" fontFamily={FONT} fontSize="34" fontWeight="600" textAnchor="middle" fill={C.muted}>{G} · {date}</text>
      {mark(820, 1460, 130)}
    </svg>
  );
}
// The sheet as a PNG the educator keeps: the SVG is drawn onto a canvas on the device.
async function certificatePng(svgEl, w = 1600, h = 1100) {
  const xml = new XMLSerializer().serializeToString(svgEl);
  const url = URL.createObjectURL(new Blob([xml], { type: 'image/svg+xml;charset=utf-8' }));
  try {
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
    const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h;
    canvas.getContext('2d').drawImage(img, 0, 0, w, h);
    return await new Promise((res) => canvas.toBlob(res, 'image/png'));
  } finally { URL.revokeObjectURL(url); }
}
function saveBlob(name, blob) { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); }
// The loading word: each letter bobs in turn, the same in the page shell and on the app's loading screen.
Object.assign(STORY_TITLES, Object.fromEntries(Object.entries(STORIES).map(([id, st]) => [id, { title: st.title, about: st.about || '' }])));
// The first-week tour: title, the element it points at (a data-tour name, or null), and the words.
const TOUR = [
  ['Welcome to your classroom', 'add', null, <>Add a student by using their school ID. Then, you'll have an option to create nicknames, assign fun sign-in pictures and more!<br /><br />No names or photos are ever stored.</>],
  ['Lessons, Stories, Practice, Mastery', 'summary', 'report', <>We combine mastery-based learning, spaced repetition, story-based learning, reflection questions, images and games to help information stick.<br /><br />Mastery requires continuous proof of competence over time. Modules are presented multiple times across multiple days and even when a student masters a subject, they'll continue to be exposed through "memory checks."<br /><br />Educators see detailed summaries along the way.</>],
  ['Backups live on this device', 'backup', null, <>A backup file automatically downloads to your device when a student taps <em>Exit</em> or, when an educator makes changes and <em>signs out</em>.<br /><br />We still recommend periodic manual backups to a shared drive folder which insures you against lost or broken devices.<br /><br />One file restores everything on any device.</>],
  ['Wonder Questions', 'wonder', null, <>Wonder questions are deep, thought-provoking questions sprinkled between learning modules. They're designed to promote curiosity, reflection and critical thinking and once a student finds themselves failing modules, the questions are re-prioritized to cover emotional resilience and frame failure as an effective way to learn.<br /><br />Students only see the questions you approve.</>],
  ['Life skills', 'life', null, <>EDUSphere is designed to make learning more efficient. Our curated list of practical life skills is a perfect way to fill the time you gain back.<br /><br />You'll find helpful skills for every age group!</>],
  ['Reading', 'reading', null, <>Need direction finding books for various age groups? We've got you covered! Our reading list is quite extensive.</>],
  ['Experiments', 'experiments', null, <>Science is way more fun when it's tangible. We've got experiment ideas for every age group!</>],
  ['Student Summaries', 'help', 'class', <>Every student has a personalized report. Whether you want to see what they've done that day, that week or from the very beginning, we've got you covered! Every module they practice, every story they read, every attempt they make, even their level of confidence on any given topic is continually updated in plain English.<br /><br />Print weekly summaries, add personalized notes, practice missed questions and more!<br /><br />Have more than one student? <strong>Who Needs Help</strong> let's you know who might need a little guidance.</>],
  ['Transcripts', 'transcript', 'report', <>Every student has a printable transcript covering everything they've ever worked on. While weekly summaries are helpful, this is the clearest view of progression across the years.</>],
];
// Three made-up students for the tour's sample Who needs help view. Nothing is saved.
function sampleClass() {
  const one = sampleRecord();
  const day = (n, h) => { const d = new Date(); d.setDate(d.getDate() - n); d.setHours(h, 0, 0, 0); return d.toISOString(); };
  const rough = (moduleId, seed, at, misses) => { const a = buildAttempt(moduleId, seed, []); const res = a.core.map((q, k) => ({ genId: q.genId, seed: q.seed, correct: k >= misses, given: k >= misses ? q.answer : '', answer: q.answer, elapsedMs: 9000 })); return makeAttemptEvent(a, res, null, at, at); };
  const two = [makeCoursesEnabledEvent(['counting-k', 'letters-k'], day(9, 8)), rough('count-to-10', 21, day(7, 9), 3), rough('count-to-10', 22, day(5, 9), 2), rough('count-to-10', 23, day(3, 9), 3)];
  const three = [makeCoursesEnabledEvent(['counting-k', 'letters-k'], day(2, 8))];
  return [{ id: 'S-1001', label: 'Sample student', events: one.events }, { id: 'S-1002', label: 'Second student', events: two }, { id: 'S-1003', label: 'Third student', events: three }];
}
// A made-up student for the tour's sample report: a few days of work, a story, a note. Nothing is saved.
function sampleRecord() {
  const day = (n, h) => { const d = new Date(); d.setDate(d.getDate() - n); d.setHours(h, 0, 0, 0); return d.toISOString(); };
  const done = (moduleId, seed, at, misses = 0) => { const a = buildAttempt(moduleId, seed, []); const res = a.core.map((q, k) => ({ genId: q.genId, seed: q.seed, correct: k >= misses, given: k >= misses ? q.answer : String(q.choices ? q.choices.find((c) => c !== q.answer) : ''), answer: q.answer, elapsedMs: 4000 + k * 900 })); return makeAttemptEvent(a, res, null, at, at); };
  const events = [makeCoursesEnabledEvent(['counting-k', 'letters-k', 'science-k'], day(9, 8))];
  events.push(done('count-to-10', 11, day(8, 9)), done('count-to-10', 12, day(6, 9)), done('one-more-one-less', 13, day(6, 10)), done('one-more-one-less', 14, day(4, 9)));
  events.push(done('shapes', 15, day(4, 10)), done('shapes', 16, day(2, 9)), done('making-ten', 17, day(2, 10), 2), done('making-ten', 18, day(1, 9), 1));
  events.push(makeStoryReadEvent('count-to-10', day(6, 9)), makeStoryReadEvent('shapes', day(2, 9)));
  events.push(makeNoteEvent('Loves the counting stories. Needs a little more time with partners of ten.', day(1, 15)));
  return { name: 'Sample student', events, preview: true, level: 'early' };
}

function LoadingWord() {
  return <div className="edu-boot-word" aria-hidden="true">{'Loading'.split('').map((ch, i) => <span key={i} style={{ animationDelay: `${i * 0.12}s` }}>{ch}</span>)}<span className="edu-boot-dots" style={{ animationDelay: '0.9s' }}>...</span></div>;
}
// A centered heading with an i hanging off its right, so the word itself never shifts.
// A story's illustration, or a placeholder wearing its serial until Mikey has made the picture.
function StoryArt({ serial, alt, fallback = null }) {
  // The page knows which pictures exist (the build lists art/stories), so a missing one shows its
  // placeholder at once, with no request going out for a file that is not there.
  const present = typeof window !== 'undefined' && Array.isArray(window.__eduArt) && window.__eduArt.includes(serial);
  const [missing, setMissing] = useState(!present);
  return (
    <div style={{ margin: '0 0 14px' }}>
      {!missing && <img src={`art/stories/${serial}.webp`} alt={alt} loading="lazy" onError={() => setMissing(true)} style={{ display: 'block', width: '100%', borderRadius: 12 }} />}
      {missing && fallback && <div style={{ padding: '4px 0 0' }}><Picture visual={fallback} /><p style={{ margin: '4px 0 0', fontSize: 12, color: C.muted, textAlign: 'center' }}>Illustration {serial} to come</p></div>}
      {missing && !fallback && (
        <div aria-label={`Illustration ${serial} to come`} style={{ aspectRatio: '4 / 3', borderRadius: 12, border: `2px dashed ${C.muted}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, color: C.muted, background: 'rgba(255,255,255,0.5)' }}>
          <svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" /><circle cx="8.5" cy="9.5" r="1.8" fill="currentColor" /><path d="M4 18l5-5 4 4 3-3 4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>
          <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: 0.5 }}>Illustration {serial}</span>
        </div>
      )}
    </div>
  );
}
// The story page body: title, pictures where they fall in the text, the words, one speaker.
function StoryBody({ story }) {
  // Read-along: the title, then each paragraph in turn, the one being read lit until the voice moves on.
  const [readingAt, setReadingAt] = useState(-1); const stopRef = useRef(null);
  useEffect(() => () => { if (stopRef.current) stopRef.current(); }, []);
  const toggle = () => {
    if (stopRef.current) { stopRef.current(); stopRef.current = null; setReadingAt(-1); return; }
    stopRef.current = speakSequence([`${story.title}.`, ...story.words], (i) => setReadingAt(i - 1), () => { stopRef.current = null; setReadingAt(-1); }, [`${story.art}-0`, ...story.words.map((_, i) => `${story.art}-${i + 1}`)]);
  };
  const reading = stopRef.current !== null && readingAt >= -1 && stopRef.current;
  return (
    <div style={{ ...card, background: '#FFF8E8', borderColor: '#F1E3BE' }}>
      <p style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 700, textAlign: 'center' }}>{story.title}</p>
      <StoryArt serial={story.art} alt={story.alt} fallback={story.diagram || null} />
      {story.words.map((t, i) => (
        <React.Fragment key={i}>
          <div style={{ borderRadius: 10, padding: readingAt === i ? '6px 10px' : 0, margin: readingAt === i ? '0 -10px' : 0, background: readingAt === i ? C.goldSoft : 'transparent', transition: 'background 200ms' }}><RichText text={t} size={17} lineGap={12} /></div>
          {(story.more || []).filter((m) => m.after === i).map((m) => <StoryArt key={m.serial} serial={m.serial} alt={m.alt} />)}
        </React.Fragment>
      ))}
      {canSpeak()
        ? <Btn full kind={reading ? 'secondary' : 'primary'} onClick={toggle}>{reading ? 'Stop reading' : 'Read the story to me'}</Btn>
        : <p style={{ margin: '0 0 12px', fontSize: 14, color: C.muted }}>Reading aloud is not available on this device or in this preview. The words are all on screen.</p>}
    </div>
  );
}
// The since-you-last-looked line, built from pieces so the punctuation stays clean.
function sinceLine(since) {
  const bits = [];
  if (since.mastered.length) bits.push(['mastered ', since.mastered.slice(0, 3).join(', '), since.mastered.length > 3 ? [' and ', String(since.mastered.length - 3), ' more'].join('') : ''].join(''));
  if (since.questions) bits.push([String(since.questions), ' questions answered'].join(''));
  if (since.stories) bits.push([String(since.stories), since.stories === 1 ? ' story read' : ' stories read'].join(''));
  if (since.colored) bits.push([String(since.colored), since.colored === 1 ? ' picture colored' : ' pictures colored'].join(''));
  return bits.join('; ');
}
function niceDateShort(iso) { const d = new Date(iso); return isNaN(d) ? '' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }
function HeadWithInfo({ children, onClick, label, open }) {
  return <p style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 600, textAlign: 'center' }}><span style={{ position: 'relative', display: 'inline-block' }}>{children}<span style={{ position: 'absolute', left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: 8, lineHeight: 0 }}><InfoButton onClick={onClick} label={label} open={open} /></span></span></p>;
}
function SegToggle({ options, value, onChange, ariaLabel, size = 'normal' }) {
  return (
    <div role="group" aria-label={ariaLabel} className="edu-no-print" style={{ display: 'flex', justifyContent: 'center', margin: '0 0 14px' }}>
      <div style={{ display: 'flex', width: 'min(340px, 100%)', border: `2px solid ${C.green}`, borderRadius: 6, overflow: 'hidden' }}>
        {options.map(([key, label], i) => (
          <button key={key} type="button" onClick={() => onChange(key)} aria-pressed={value === key}
            style={{ fontFamily: FONT, fontSize: size === 'big' ? 18 : 15, fontWeight: 600, flex: '1 1 0', padding: size === 'big' ? '15px 0' : '10px 0', cursor: 'pointer', border: 'none', borderLeft: i === 0 ? 'none' : `1px solid ${C.green}`, background: value === key ? C.green : C.surface, color: value === key ? '#fff' : C.green }}>{label}</button>
        ))}
      </div>
    </div>
  );
}

// ---- Let's Play. Small games that need no words: each is a square drawn to fit, played with a
// finger, a stylus or a mouse (pointer events only), and says "done" with a shower of stars.
const GAME_BOX = { width: 'min(520px, 100%)', aspectRatio: '1 / 1', margin: '0 auto', position: 'relative', background: '#FFFFFF', border: `2px solid ${C.ink}`, borderRadius: 14, overflow: 'hidden', touchAction: 'none', userSelect: 'none', boxSizing: 'border-box' };
const PAIR_ICONS = ['sun', 'fish', 'tree', 'flower', 'moon', 'bird', 'cup', 'drop'];
// A small seeded random so a round is the same shuffle on every device, and "play again" is a new one.
// (shuffle itself comes from logic.mjs: shuffle(rng, list).)
function lcg(seed) { let x = seed >>> 0; return () => { x = (x * 1664525 + 1013904223) >>> 0; return x / 4294967296; }; }
// Where a pointer is inside an element, in that element's own 0 to 100 box.
function boxPoint(el, e) { const b = el.getBoundingClientRect(); return [((e.clientX - b.left) / b.width) * 100, ((e.clientY - b.top) / b.height) * 100]; }
function Done({ show }) {
  if (!show) return null;
  return (
    <div className="edu-cheer" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
      <StarBurst />
      <svg viewBox="0 0 24 24" width="120" height="120" role="img" aria-label="Done"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" fill={C.gold} stroke="#2E2E2E" strokeWidth="1.2" strokeLinejoin="round" /></svg>
    </div>
  );
}
// Join the dots in order. The next dot is gold; a wrong one wobbles; the last line closes the shape.
function DotsGame({ game, name, round }) {
  const dots = useMemo(() => (game.shape === 'name' ? nameDots(name) : DOT_SHAPES[game.shape]), [game, name]);
  const [next, setNext] = useState(0); const [wrong, setWrong] = useState(-1);
  useEffect(() => { setNext(0); }, [round]);
  const done = next >= dots.length;
  const tap = (i) => { if (done) return; if (i === next) setNext(next + 1); else { setWrong(i); setTimeout(() => setWrong(-1), 400); } };
  const drawn = dots.slice(0, next).concat(done && game.shape !== 'name' ? [dots[0]] : []);
  const small = dots.length > 12 ? 0.72 : 1;                          // a name has many dots, so they shrink to keep clear of each other
  return (
    <div style={GAME_BOX}>
      <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ display: 'block' }}>
        <polyline points={drawn.map((d) => d.join(',')).join(' ')} fill="none" stroke={C.green} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        {dots.map(([x, y], i) => (
          <g key={i} onPointerDown={() => tap(i)} style={{ cursor: 'pointer' }} className={wrong === i ? 'edu-wobble' : undefined}>
            <circle cx={x} cy={y} r={(i === next ? 5.2 : 4.2) * small} fill={i < next ? C.green : i === next ? C.gold : '#FFFFFF'} stroke="#2E2E2E" strokeWidth="0.9" />
            <text x={x} y={y} fontSize={4.6 * small} fontWeight="700" fontFamily={FONT} textAnchor="middle" dominantBaseline="central" fill={i < next ? '#FFFFFF' : '#2E2E2E'}>{i + 1}</text>
          </g>
        ))}
      </svg>
      <Done show={done} />
    </div>
  );
}
// Pairs: cards face down, two turn over at a time, a match stays.
function PairsGame({ game, round }) {
  const cards = useMemo(() => { const rnd = lcg(round * 7919 + 13); const icons = shuffle(rnd, PAIR_ICONS).slice(0, game.pairs); return shuffle(rnd, icons.flatMap((ic) => [ic, ic])); }, [game, round]);
  const [up, setUp] = useState([]); const [found, setFound] = useState([]);
  useEffect(() => { setUp([]); setFound([]); }, [round]);
  const flip = (i) => {
    if (found.includes(i) || up.includes(i) || up.length === 2) return;
    const pair = [...up, i]; setUp(pair);
    if (pair.length === 2) { if (cards[pair[0]] === cards[pair[1]]) { setFound([...found, ...pair]); setUp([]); } else setTimeout(() => setUp([]), 700); }
  };
  const cols = game.pairs <= 3 ? 3 : 4;
  return (
    <div style={{ ...GAME_BOX, aspectRatio: 'auto', padding: 12 }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 10 }}>
        {cards.map((ic, i) => { const shown = up.includes(i) || found.includes(i); return (
          <button key={i} type="button" onClick={() => flip(i)} aria-label={shown ? ic : 'Card'} className="edu-press"
            style={{ aspectRatio: '1 / 1', borderRadius: 12, border: `2px solid ${shown ? C.green : C.ink}`, background: shown ? '#FFFFFF' : C.greenSoft, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 6 }}>
            {shown ? <IconPic name={ic} size={60} /> : <span style={{ width: 26, height: 26, borderRadius: 13, background: C.green, opacity: 0.35 }} />}
          </button>); })}
      </div>
      <Done show={found.length === cards.length} />
    </div>
  );
}
// Sort: drag each shape into the box it belongs to, by size or by color. The boxes wear their rule.
function SortGame({ game, round }) {
  const items = useMemo(() => {
    const rnd = lcg(round * 104729 + 5); const shapes = ['circle', 'square', 'triangle'];
    const list = [0, 1, 2, 3, 4, 5].map((i) => (game.by === 'size' ? { id: i, bin: i % 2, shape: shapes[i % 3], colour: C.green, big: i % 2 === 0 } : { id: i, bin: i % 2, shape: shapes[i % 3], colour: i % 2 === 0 ? SWATCH.red : SWATCH.blue, big: false }));
    return shuffle(rnd, list).map((it, k) => ({ ...it, x: 18 + (k % 3) * 32, y: 16 + Math.floor(k / 3) * 24 }));
  }, [game, round]);
  const [placed, setPlaced] = useState({}); const [drag, setDrag] = useState(null); const boxRef = useRef(null);
  useEffect(() => { setPlaced({}); setDrag(null); }, [round]);
  const start = (it, e) => { if (placed[it.id] !== undefined) return; boxRef.current.setPointerCapture(e.pointerId); const [x, y] = boxPoint(boxRef.current, e); setDrag({ id: it.id, x, y }); };
  const move = (e) => { if (!drag) return; const [x, y] = boxPoint(boxRef.current, e); setDrag({ ...drag, x, y }); };
  const drop = () => { if (!drag) return; const it = items.find((i) => i.id === drag.id); const bin = drag.y > 64 ? (drag.x < 50 ? 0 : 1) : -1; if (bin === it.bin) setPlaced({ ...placed, [it.id]: bin }); setDrag(null); };
  const inBin = (bin) => items.filter((it) => placed[it.id] === bin);
  const spot = (it) => { const p = placed[it.id]; if (p !== undefined) return [(p === 0 ? 12 : 60) + inBin(p).indexOf(it) * 12, 84]; if (drag && drag.id === it.id) return [drag.x, drag.y]; return [it.x, it.y]; };
  return (
    <div ref={boxRef} style={GAME_BOX} onPointerMove={move} onPointerUp={drop} onPointerCancel={drop}>
      {[0, 1].map((bin) => (
        <div key={bin} style={{ position: 'absolute', left: bin === 0 ? '4%' : '52%', top: '66%', width: '44%', height: '30%', border: `3px dashed ${C.muted}`, borderRadius: 14, boxSizing: 'border-box' }}>
          <span style={{ position: 'absolute', left: 6, top: 4, opacity: 0.55, lineHeight: 0 }}>{game.by === 'size' ? <ShapePic name="circle" size={bin === 0 ? 30 : 16} color={C.muted} /> : <Swatch colour={bin === 0 ? 'red' : 'blue'} size={22} />}</span>
        </div>
      ))}
      {items.map((it) => { const [x, y] = spot(it); const stuck = placed[it.id] !== undefined; return (
        <div key={it.id} onPointerDown={(e) => start(it, e)} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)', cursor: stuck ? 'default' : 'grab', touchAction: 'none', lineHeight: 0, transition: drag && drag.id === it.id ? 'none' : 'left 0.2s ease, top 0.2s ease' }}>
          <ShapePic name={it.shape} size={it.big ? 58 : 34} color={it.colour} />
        </div>); })}
      <Done show={items.every((it) => placed[it.id] !== undefined)} />
    </div>
  );
}
// A maze carved by a random walk, the same one for the same round everywhere. Drag the dot from the
// top left to the gold square; it only moves to a neighbor with no wall between.
function makeMaze(n, seed) {
  const rnd = lcg(seed); const cells = Array.from({ length: n }, () => Array.from({ length: n }, () => ({ t: true, r: true, b: true, l: true, seen: false })));
  const stack = [[0, 0]]; cells[0][0].seen = true;
  while (stack.length) {
    const [r, c] = stack[stack.length - 1];
    const next = shuffle(rnd, [[r - 1, c, 't', 'b'], [r, c + 1, 'r', 'l'], [r + 1, c, 'b', 't'], [r, c - 1, 'l', 'r']]).find(([nr, nc]) => nr >= 0 && nc >= 0 && nr < n && nc < n && !cells[nr][nc].seen);
    if (!next) { stack.pop(); continue; }
    const [nr, nc, wall, back] = next; cells[r][c][wall] = false; cells[nr][nc][back] = false; cells[nr][nc].seen = true; stack.push([nr, nc]);
  }
  return cells;
}
function MazeGame({ game, round }) {
  const n = game.cells; const cells = useMemo(() => makeMaze(n, round * 31 + n), [n, round]);
  const [trail, setTrail] = useState([[0, 0]]); const boxRef = useRef(null);
  useEffect(() => { setTrail([[0, 0]]); }, [round]);
  const [pr, pc] = trail[trail.length - 1]; const done = pr === n - 1 && pc === n - 1;
  const move = (e) => {
    if (done || !(e.buttons & 1)) return;
    const [x, y] = boxPoint(boxRef.current, e); const c = Math.floor(x / (100 / n)); const r = Math.floor(y / (100 / n));
    const dr = r - pr; const dc = c - pc; if (Math.abs(dr) + Math.abs(dc) !== 1) return;
    const wall = dr === -1 ? 't' : dr === 1 ? 'b' : dc === 1 ? 'r' : 'l'; if (cells[pr][pc][wall]) return;
    setTrail([...trail, [r, c]]);
  };
  const s = 100 / n; const mid = (i) => i * s + s / 2;
  return (
    <div ref={boxRef} style={GAME_BOX} onPointerDown={(e) => { boxRef.current.setPointerCapture(e.pointerId); move(e); }} onPointerMove={move}>
      <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ display: 'block' }}>
        <rect x={(n - 1) * s + 0.8} y={(n - 1) * s + 0.8} width={s - 1.6} height={s - 1.6} fill={C.goldSoft} />
        {cells.map((row, r) => row.map((cell, c) => (
          <g key={`${r}-${c}`} stroke="#2E2E2E" strokeWidth={n > 9 ? 1 : 1.4} strokeLinecap="round">
            {cell.t && <line x1={c * s} y1={r * s} x2={(c + 1) * s} y2={r * s} />}
            {cell.l && <line x1={c * s} y1={r * s} x2={c * s} y2={(r + 1) * s} />}
            {cell.b && <line x1={c * s} y1={(r + 1) * s} x2={(c + 1) * s} y2={(r + 1) * s} />}
            {cell.r && <line x1={(c + 1) * s} y1={r * s} x2={(c + 1) * s} y2={(r + 1) * s} />}
          </g>
        )))}
        <polyline points={trail.map(([r, c]) => `${mid(c)},${mid(r)}`).join(' ')} fill="none" stroke={C.green} strokeWidth={s * 0.3} strokeOpacity="0.4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={mid(pc)} cy={mid(pr)} r={s * 0.3} fill={C.gold} stroke="#2E2E2E" strokeWidth="0.9" />
      </svg>
      <Done show={done} />
    </div>
  );
}
// A jigsaw of one scene: tap a piece, then the piece to swap it with, until the picture is whole.
function Scene() {
  return (
    <g>
      <rect x="0" y="0" width="100" height="100" fill="#DDEFF8" /><circle cx="78" cy="22" r="11" fill={C.gold} />
      <rect x="0" y="66" width="100" height="34" fill="#9ACD32" />
      <rect x="26" y="40" width="34" height="30" fill="#F4A259" stroke="#2E2E2E" strokeWidth="1.2" /><polygon points="22,42 43,22 64,42" fill="#C9573E" stroke="#2E2E2E" strokeWidth="1.2" />
      <rect x="38" y="52" width="10" height="18" fill="#8B5A2B" /><rect x="72" y="50" width="8" height="24" fill="#8B5A2B" /><circle cx="76" cy="42" r="14" fill="#5BA84A" stroke="#2E2E2E" strokeWidth="1.2" />
      <circle cx="12" cy="52" r="6" fill="#F58FB0" /><circle cx="90" cy="82" r="5" fill="#F7D154" />
    </g>
  );
}
function JigsawGame({ game, round }) {
  const n = game.side; const total = n * n;
  const mixed = (r) => { const o = shuffle(lcg(r * 977 + n), [...Array(total).keys()]); return o.every((v, i) => v === i) ? [...o.slice(1), o[0]] : o; };
  const [order, setOrder] = useState(() => mixed(round)); const [pick, setPick] = useState(-1);
  useEffect(() => { setOrder(mixed(round)); setPick(-1); }, [round]);
  const done = order.every((v, i) => v === i);
  const tap = (slot) => { if (done) return; if (pick < 0) { setPick(slot); return; } const o = [...order]; [o[pick], o[slot]] = [o[slot], o[pick]]; setOrder(o); setPick(-1); };
  const s = 100 / n;
  return (
    <div style={GAME_BOX}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${n}, 1fr)`, gap: 3, padding: 3, height: '100%', boxSizing: 'border-box' }}>
        {order.map((piece, slot) => (
          <button key={slot} type="button" aria-label={`Piece ${piece + 1}`} onClick={() => tap(slot)} style={{ padding: 0, border: `3px solid ${pick === slot ? C.gold : C.ink}`, borderRadius: 6, background: '#FFFFFF', cursor: 'pointer', overflow: 'hidden' }}>
            <svg viewBox={`${(piece % n) * s} ${Math.floor(piece / n) * s} ${s} ${s}`} width="100%" height="100%" style={{ display: 'block' }} preserveAspectRatio="none"><Scene /></svg>
          </button>
        ))}
      </div>
      <Done show={done} />
    </div>
  );
}
// Pong for grade 2: the paddle follows the finger or the mouse, the ball speeds up a little with
// every hit, and a miss starts a fresh ball. The count is the current run; the star is the best run.
function PongGame({ round }) {
  const boxRef = useRef(null); const state = useRef(null); const [score, setScore] = useState(0); const [best, setBest] = useState(0);
  useEffect(() => {
    const st = { x: 50, y: 30, vx: 0.45, vy: 0.55, paddle: 50, hits: 0 }; state.current = st; setScore(0);
    const draw = () => { const el = boxRef.current; if (!el) return; const ball = el.querySelector('.edu-pong-ball'); const pad = el.querySelector('.edu-pong-paddle'); if (ball) { ball.setAttribute('cx', st.x); ball.setAttribute('cy', st.y); } if (pad) pad.setAttribute('x', st.paddle - 12); };
    let raf;
    const tick = () => {
      st.x += st.vx; st.y += st.vy;
      if (st.x < 3 || st.x > 97) st.vx = -st.vx; if (st.y < 3) st.vy = Math.abs(st.vy);
      if (st.y > 91 && st.y < 95 && st.vy > 0 && Math.abs(st.x - st.paddle) < 13) { st.vy = -Math.abs(st.vy) * 1.03; st.vx += (st.x - st.paddle) * 0.02; st.hits += 1; setScore(st.hits); }
      if (st.y > 104) { setBest((b) => Math.max(b, st.hits)); st.x = 50; st.y = 30; st.vx = 0.45 * (Math.random() > 0.5 ? 1 : -1); st.vy = 0.55; st.hits = 0; setScore(0); }
      draw(); raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [round]);
  const move = (e) => { if (!state.current) return; const [x] = boxPoint(boxRef.current, e); state.current.paddle = Math.max(12, Math.min(88, x)); };
  return (
    <div ref={boxRef} style={GAME_BOX} onPointerMove={move} onPointerDown={move}>
      <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ display: 'block' }}>
        <text x="50" y="16" fontSize="14" fontWeight="800" fontFamily={FONT} textAnchor="middle" fill={C.line}>{score}</text>
        <circle className="edu-pong-ball" cx="50" cy="30" r="2.6" fill={C.gold} stroke="#2E2E2E" strokeWidth="0.8" />
        <rect className="edu-pong-paddle" x="38" y="93" width="24" height="3.5" rx="1.75" fill={C.green} />
      </svg>
      {best > 0 && <div style={{ position: 'absolute', top: 8, right: 12, fontSize: 15, color: C.muted }}>★ {best}</div>}
    </div>
  );
}
// The frame around a game: play again, the title, close, and the same countdown bar as a picture.
const GAME_OF = { dots: DotsGame, pairs: PairsGame, sort: SortGame, maze: MazeGame, jigsaw: JigsawGame, pong: PongGame };
function GamePad({ game, name, secondsLeft, total, onClose }) {
  const [round, setRound] = useState(1);
  const Game = GAME_OF[game.kind];
  const iconBtn = { background: 'none', border: 'none', padding: 6, cursor: 'pointer', color: C.green, lineHeight: 0 };
  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button type="button" aria-label="Play again" onClick={() => setRound(round + 1)} style={{ ...iconBtn, margin: '0 0 0 -10px' }}>
          <svg viewBox="0 0 24 24" width="32" height="32" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.6-5.9M20 4v5h-5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <h1 className="edu-rainbow" style={{ fontSize: 20, margin: 0, textAlign: 'center' }}>{game.title}</h1>
        <button type="button" aria-label="Close game" onClick={onClose} style={{ ...iconBtn, margin: '0 -10px 0 0' }}>
          <svg viewBox="0 0 24 24" width="32" height="32" aria-hidden="true"><path d="M5 5 L19 19 M19 5 L5 19" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" /></svg>
        </button>
      </div>
      <div style={{ margin: '8px 0 12px', height: 10, borderRadius: 5, background: C.line, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${Math.max(0, (secondsLeft / total) * 100)}%`, background: `linear-gradient(90deg, ${CRAYONS[0]}, ${CRAYONS[3]}, ${CRAYONS[4]})`, transition: 'width 1s linear' }} />
      </div>
      <Game game={game} name={name} round={round} />
    </div>
  );
}
// A tile's picture in the Let's Play grid: one small drawing per kind of game, no words.
function GameThumb({ kind, game = null }) {
  const k = '#2E2E2E';
  // A connect-the-dots tile draws its own shape from the game's points; the name game shows a few dotted letters.
  const dotShape = game && game.kind === 'dots' ? (game.shape && DOT_SHAPES[game.shape] ? DOT_SHAPES[game.shape].map(([x, y]) => [4 + (x * 32) / 100, 4 + (y * 32) / 100]) : null) : null;
  if (dotShape) return <svg viewBox="0 0 40 40" width="44" height="44" aria-hidden="true"><polyline points={[...dotShape, dotShape[0]].map((pt) => pt.join(',')).join(' ')} fill="none" stroke={C.green} strokeWidth="2" strokeLinejoin="round" />{dotShape.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.6" fill="#fff" stroke={k} strokeWidth="1.4" />)}</svg>;
  if (game && game.kind === 'dots') return <svg viewBox="0 0 40 40" width="44" height="44" aria-hidden="true"><text x="20" y="27" fontFamily={FONT} fontSize="18" fontWeight="700" textAnchor="middle" fill={C.green} stroke={k} strokeWidth="0.6" strokeDasharray="1.5 1.5">Ab</text></svg>;
  const body = {
    dots: <g><polyline points="8,32 20,8 32,32 6,17 34,17 8,32" fill="none" stroke={C.green} strokeWidth="2" strokeLinejoin="round" />{[[8, 32], [20, 8], [32, 32], [6, 17], [34, 17]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" fill={i === 0 ? C.gold : '#fff'} stroke={k} strokeWidth="1" />)}</g>,
    pairs: <g><rect x="5" y="9" width="16" height="22" rx="3" fill={C.greenSoft} stroke={k} strokeWidth="1.4" /><rect x="19" y="9" width="16" height="22" rx="3" fill="#fff" stroke={k} strokeWidth="1.4" /><circle cx="27" cy="20" r="5" fill={C.gold} /></g>,
    sort: <g><circle cx="13" cy="18" r="9" fill={C.green} /><circle cx="29" cy="24" r="4.5" fill={C.green} /><rect x="3" y="30" width="34" height="6" rx="2" fill="none" stroke={C.muted} strokeWidth="1.6" strokeDasharray="3 2" /></g>,
    maze: <g fill="none" stroke={k} strokeWidth="1.6"><rect x="5" y="5" width="30" height="30" rx="2" /><path d="M15 5v12M25 13v14M5 25h10M25 35v-4M15 17h10" /><circle cx="10" cy="10" r="2.5" fill={C.gold} stroke="none" /></g>,
    jigsaw: <g><path d="M8 8h9a4 4 0 0 1 6 0h9v9a4 4 0 0 0 0 6v9h-9a4 4 0 0 1-6 0H8v-9a4 4 0 0 0 0-6z" fill={C.gold} stroke={k} strokeWidth="1.4" strokeLinejoin="round" /></g>,
    pong: <g><rect x="10" y="31" width="20" height="4" rx="2" fill={C.green} /><circle cx="24" cy="15" r="4" fill={C.gold} stroke={k} strokeWidth="1" /></g>,
  }[kind];
  return <svg viewBox="0 0 40 40" width="100%" height="100%" aria-hidden="true">{body}</svg>;
}
// Coloring: play, not work. Tap a part to fill it with the color you picked. Nothing is scored,
// nothing is recorded; a picture is simply there to enjoy once the student has earned it.
const COLOR_BREAK_SECONDS = 300;
// A picture's five minutes and its rest afterwards live on the device, next to the settings, never
// in the student's record: coloring is play and leaves no history. Leaving and coming back picks up
// where the timer stopped, and a picture that ran its five minutes rests for fifteen.
const colorKey = (studentId) => `edusphere_v1_coloring:${studentId}`;
async function loadColorState(studentId) { try { return JSON.parse((await storageGet(colorKey(studentId))) || '{}'); } catch (e) { return {}; } }
async function saveColorState(studentId, state) { return storageSet(colorKey(studentId), JSON.stringify(state)); }
// How fat the line is, finest first. A phone shows four; a wider screen has room for all six.
const NIBS = [0.7, 1.1, 1.5, 2.2, 3, 5];
const PHONE_NIBS = [0.7, 1.5, 2.2, 3, 5];
const NIB_DEFAULT = 2.2;                 // a middle thickness: neither the hairline nor the marker
const ERASERS = [2.2, 4, 7, 12];         // eraser widths, wide screens only: four sizes in a column beside the picture
const ZOOMS = [1, 1.5, 2.2];  // how close in the picture is drawn, always about its middle
// Fifteen crayons on a phone; a wider screen adds six more and lays all of them across the card.
const CRAYONS = [
  '#D62828', '#E4572E', '#F4A259', '#F7D154', '#C9A227',
  '#9ACD32', '#5BA84A', '#2FA5A0', '#3E7CB1', '#2B4C8C',
  '#7D5BA6', '#C86FC9', '#F58FB0', '#8C6239', '#2E2E2E',
];
// Five more crayons for a picture that is filled in, and a twenty-first that fills out the three
// rows of seven a wide screen shows.
const WIDE_CRAYONS = ['#7B1E1E', '#FFD9A0', '#1F7A5A', '#9FD8E8', '#4B3A8F'];
const EXTRA_CRAYON = '#B8B8B8';
// Some pictures are filled by tapping a part; others are drawn on freely with a finger.
// Half are filled in by tapping a part, half are drawn on with a finger. A name page is always drawn.
const COLORING_MODE = { ball: 'fill', sun: 'fill', balloon: 'fill', 'my-name': 'draw', star: 'draw', tree: 'fill', house: 'fill', fish: 'draw', cat: 'draw', flower: 'draw', boat: 'fill', rocket: 'draw', butterfly: 'draw', train: 'fill', car: 'fill', robot: 'fill', fishbowl: 'draw', castle: 'fill', dinosaur: 'draw', city: 'draw', garden: 'fill', playground: 'draw', farm: 'draw', birthday: 'draw',
  // Letter pages are colored by hand, crayon over the outline, like the drawings.
  ...Object.fromEntries('abcdefghijklmnopqrstuvwxyz'.split('').map((ch) => [`letter-${ch}`, 'draw'])),
  ...Object.fromEntries(['kite', 'ladybug', 'ice-cream', 'snowman', 'hot-air-balloon', 'lighthouse', 'treehouse', 'submarine', 'pirate-ship', 'dragon', 'space-station', 'jungle-waterfall'].map((pic) => [pic, 'draw'])),
};
// A ray stands square on the sun: its base lies across the rim, its point straight out.
const ray = (i) => {
  const a = (i * Math.PI) / 4; const [cx, cy] = [Math.cos(a), Math.sin(a)]; const [px, py] = [-Math.sin(a), Math.cos(a)];
  const at = (r, side) => `${(50 + cx * r + px * side).toFixed(1)},${(50 + cy * r + py * side).toFixed(1)}`;
  return { t: 'polygon', points: `${at(23, 6)} ${at(23, -6)} ${at(45, 0)}` };
};
// One slice of the beach ball, from the middle out to the rim.
const slice = (i, n = 6, r = 30) => {
  const a1 = (i * 2 * Math.PI) / n - Math.PI / 2; const a2 = ((i + 1) * 2 * Math.PI) / n - Math.PI / 2;
  const p = (a) => `${(50 + Math.cos(a) * r).toFixed(1)},${(52 + Math.sin(a) * r).toFixed(1)}`;
  return { t: 'path', d: `M50,52 L${p(a1)} A${r},${r} 0 0,1 ${p(a2)} Z` };
};
const COLORING_ART = {
  ball: [
    { t: 'circle', cx: 50, cy: 52, r: 30 }, slice(0), slice(1), slice(2), slice(3), slice(4), slice(5),
  ],
  sun: [{ t: 'circle', cx: 50, cy: 50, r: 22 }, ...[0, 1, 2, 3, 4, 5, 6, 7].map(ray)],
  balloon: [
    { t: 'path', d: 'M50,8 C65,8 76,20 76,33 C76,47 63,58 52,67 L48,67 C37,58 24,47 24,33 C24,20 35,8 50,8 Z' },
    { t: 'polygon', points: '45,66 55,66 50,74' },
    { t: 'path', line: true, d: 'M50,74 C58,80 42,84 50,90 C54,93 50,96 48,97' },
    { t: 'path', d: 'M20,40 C28,40 33,47 33,54 C33,62 26,68 20,74 L18,74 C12,68 6,62 6,54 C6,47 12,40 20,40 Z' },
    { t: 'polygon', points: '16,73 23,73 19,79' },
    { t: 'path', line: true, d: 'M19,79 C24,84 14,88 19,94' },
    { t: 'path', d: 'M66,84 C66,79 72,76 76,79 C78,73 87,72 90,78 C96,77 98,84 93,86 L70,86 C67,86 66,85 66,84 Z' },
    { t: 'circle', cx: 86, cy: 16, r: 7 },
  ],
  star: [
    { t: 'polygon', points: '50,10 60,38 90,38 66,56 75,86 50,68 25,86 34,56 10,38 40,38' },
    { t: 'path', d: 'M12,14 C18,18 18,28 12,32 C20,32 26,26 26,22 C26,18 20,13 12,14 Z' },
    { t: 'path', d: 'M86,64 C86,68 89,70 92,70 C89,70 86,73 86,77 C86,73 83,70 80,70 C83,70 86,68 86,64 Z' },
    { t: 'path', d: 'M16,78 C16,82 19,84 22,84 C19,84 16,87 16,91 C16,87 13,84 10,84 C13,84 16,82 16,78 Z' },
    { t: 'path', d: 'M74,14 C74,17 76,19 79,19 C76,19 74,21 74,24 C74,21 72,19 69,19 C72,19 74,17 74,14 Z' },
  ],
  tree: [
    { t: 'circle', cx: 88, cy: 10, r: 7 },
    { t: 'path', d: 'M4,20 C4,14 10,11 14,14 C16,7 26,6 29,12 C35,11 38,18 33,21 L8,21 C4,21 3,20 4,20 Z' },
    { t: 'ellipse', cx: 50, cy: 92, rx: 42, ry: 7 },
    { t: 'path', d: 'M44,60 C44,72 42,82 38,91 L62,91 C58,82 56,72 56,60 Z' },
    { t: 'path', d: 'M50,16 C63,16 74,24 75,35 C84,40 83,54 72,58 C67,65 57,68 50,64 C43,68 33,65 28,58 C17,54 16,40 25,35 C26,24 37,16 50,16 Z' },
    { t: 'circle', cx: 31, cy: 41, r: 5 }, { t: 'circle', cx: 47, cy: 26, r: 5 }, { t: 'circle', cx: 69, cy: 36, r: 5 }, { t: 'circle', cx: 41, cy: 56, r: 5 }, { t: 'circle', cx: 62, cy: 53, r: 5 }, { t: 'circle', cx: 56, cy: 40, r: 4 },
    { t: 'path', d: 'M56,14 C59,9 63,13 65,15 C67,13 71,9 74,14 C70,17 66,18 65,17 C64,18 60,17 56,14 Z' },
  ],
  house: [
    { t: 'circle', cx: 84, cy: 14, r: 9 },
    { t: 'path', d: 'M4,24 C4,18 10,15 14,18 C16,11 26,10 29,16 C35,15 38,22 33,25 L8,25 C4,25 3,24 4,24 Z' },
    { t: 'rect', x: 64, y: 20, width: 9, height: 16 },
    { t: 'circle', cx: 68, cy: 14, r: 4 }, { t: 'circle', cx: 74, cy: 8, r: 3 },
    { t: 'polygon', points: '50,16 90,44 10,44' },
    { t: 'rect', x: 18, y: 44, width: 64, height: 42 },
    { t: 'rect', x: 42, y: 60, width: 16, height: 26 },
    { t: 'circle', cx: 54, cy: 74, r: 2 },
    { t: 'rect', x: 24, y: 52, width: 13, height: 13 }, { t: 'rect', x: 63, y: 52, width: 13, height: 13 },
    { t: 'path', d: 'M42,86 C38,90 34,92 30,94 L70,94 C66,92 62,90 58,86 Z' },
    { t: 'rect', x: 2, y: 86, width: 96, height: 10 },
  ],
  fish: [
    { t: 'path', d: 'M14,50 C18,34 40,26 58,34 C65,38 69,44 71,50 C69,56 65,62 58,66 C40,74 18,66 14,50 Z' },
    { t: 'polygon', points: '71,50 90,34 86,50 90,66' },
    { t: 'path', d: 'M38,30 C44,20 54,20 58,32 C51,28 44,28 38,30 Z' },
    { t: 'path', d: 'M34,66 C38,76 48,78 52,68 C46,69 40,68 34,66 Z' },
    { t: 'circle', cx: 28, cy: 44, r: 4 },
    { t: 'path', d: 'M22,56 C28,62 36,62 42,56 C36,60 28,60 22,56 Z' },
    { t: 'circle', cx: 80, cy: 16, r: 5 }, { t: 'circle', cx: 70, cy: 8, r: 3 },
    { t: 'path', d: 'M18,94 C16,82 24,76 22,66 C28,74 26,84 28,94 Z' },
    { t: 'path', d: 'M76,94 C74,84 82,78 80,70 C86,78 84,86 86,94 Z' },
    { t: 'ellipse', cx: 50, cy: 96, rx: 46, ry: 6 },
  ],
  cat: [
    { t: 'ellipse', cx: 52, cy: 72, rx: 24, ry: 15 },
    { t: 'path', d: 'M74,74 C86,74 90,62 84,54 C90,64 84,80 74,80 Z' },
    { t: 'path', d: 'M50,26 C63,26 72,36 72,48 C72,60 63,68 50,68 C37,68 28,60 28,48 C28,36 37,26 50,26 Z' },
    { t: 'polygon', points: '30,36 32,18 45,28' }, { t: 'polygon', points: '70,36 68,18 55,28' },
    { t: 'circle', cx: 42, cy: 46, r: 4 }, { t: 'circle', cx: 58, cy: 46, r: 4 },
    { t: 'polygon', points: '46,54 54,54 50,60' },
  ],
  flower: [
    ...[0, 1, 2, 3, 4, 5].map((i) => { const a = (i * Math.PI) / 3 - Math.PI / 2; const [cx, cy] = [50 + Math.cos(a) * 17, 36 + Math.sin(a) * 17];
      const [px, py] = [-Math.sin(a) * 9, Math.cos(a) * 9];
      return { t: 'path', d: `M50,36 C${(50 + px).toFixed(1)},${(36 + py).toFixed(1)} ${(cx + px).toFixed(1)},${(cy + py).toFixed(1)} ${(cx + Math.cos(a) * 9).toFixed(1)},${(cy + Math.sin(a) * 9).toFixed(1)} C${(cx - px).toFixed(1)},${(cy - py).toFixed(1)} ${(50 - px).toFixed(1)},${(36 - py).toFixed(1)} 50,36 Z` }; }),
    { t: 'circle', cx: 50, cy: 36, r: 9 },
    { t: 'path', d: 'M47,62 C47,74 48,84 47,92 L53,92 C52,84 53,74 53,62 Z' },
    { t: 'path', d: 'M47,72 C36,64 26,70 28,78 C30,85 42,82 47,76 Z' },
    { t: 'path', d: 'M53,80 C64,72 74,78 72,86 C70,93 58,90 53,84 Z' },
    { t: 'ellipse', cx: 50, cy: 94, rx: 40, ry: 6 },
  ],
  boat: [
    { t: 'circle', cx: 84, cy: 14, r: 8 },
    { t: 'path', d: 'M4,22 C4,16 10,13 14,16 C16,9 26,8 29,14 C35,13 38,20 33,23 L8,23 C4,23 3,22 4,22 Z' },
    { t: 'rect', x: 48, y: 14, width: 4, height: 56 },
    { t: 'path', d: 'M54,18 C66,32 72,50 74,66 L54,66 Z' },
    { t: 'path', d: 'M46,30 C38,42 34,54 32,66 L46,66 Z' },
    { t: 'polygon', points: '52,14 66,18 52,22' },
    { t: 'path', d: 'M10,68 L90,68 C86,82 76,90 50,90 C24,90 14,82 10,68 Z' },
    { t: 'path', line: true, d: 'M6,94 C14,90 22,98 30,94 C38,90 46,98 54,94 C62,90 70,98 78,94 C86,90 92,96 96,94' },
  ],
  rocket: [
    { t: 'path', d: 'M50,8 C60,18 66,34 66,50 C66,62 60,72 50,78 C40,72 34,62 34,50 C34,34 40,18 50,8 Z' },
    { t: 'circle', cx: 50, cy: 38, r: 9 },
    { t: 'path', d: 'M34,54 C26,60 20,70 18,80 L34,74 Z' },
    { t: 'path', d: 'M66,54 C74,60 80,70 82,80 L66,74 Z' },
    { t: 'path', d: 'M44,78 C46,86 48,92 50,96 C52,92 54,86 56,78 Z' },
    { t: 'circle', cx: 16, cy: 18, r: 6 },
    { t: 'path', d: 'M84,24 C84,28 87,31 91,31 C87,31 84,34 84,38 C84,34 81,31 77,31 C81,31 84,28 84,24 Z' },
    { t: 'path', d: 'M20,60 C20,63 22,65 25,65 C22,65 20,67 20,70 C20,67 18,65 15,65 C18,65 20,63 20,60 Z' },
    { t: 'path', d: 'M76,70 C76,73 78,75 81,75 C78,75 76,77 76,80 C76,77 74,75 71,75 C74,75 76,73 76,70 Z' },
  ],
  butterfly: [
    { t: 'path', d: 'M48,50 C36,30 18,24 12,34 C6,44 20,56 46,56 Z' },
    { t: 'path', d: 'M52,50 C64,30 82,24 88,34 C94,44 80,56 54,56 Z' },
    { t: 'path', d: 'M48,54 C38,68 24,78 18,70 C12,62 26,54 46,54 Z' },
    { t: 'path', d: 'M52,54 C62,68 76,78 82,70 C88,62 74,54 54,54 Z' },
    { t: 'path', d: 'M50,26 C54,26 56,32 56,44 C56,60 54,72 50,76 C46,72 44,60 44,44 C44,32 46,26 50,26 Z' },
    { t: 'circle', cx: 50, cy: 22, r: 5 },
    { t: 'path', line: true, d: 'M47,18 C42,10 36,8 32,10' },
    { t: 'path', line: true, d: 'M53,18 C58,10 64,8 68,10' },
    { t: 'circle', cx: 28, cy: 38, r: 5 }, { t: 'circle', cx: 72, cy: 38, r: 5 },
    { t: 'circle', cx: 30, cy: 64, r: 4 }, { t: 'circle', cx: 70, cy: 64, r: 4 },
  ],
  train: [
    { t: 'circle', cx: 86, cy: 14, r: 7 },
    { t: 'circle', cx: 30, cy: 14, r: 5 }, { t: 'circle', cx: 40, cy: 8, r: 4 }, { t: 'circle', cx: 50, cy: 12, r: 3 },
    { t: 'path', d: 'M56,36 C56,30 60,28 66,28 L80,28 C86,28 88,32 88,38 L88,70 L56,70 Z' },
    { t: 'rect', x: 62, y: 36, width: 20, height: 16, },
    { t: 'path', d: 'M10,48 C10,44 12,42 16,42 L56,42 L56,70 L10,70 Z' },
    { t: 'path', d: 'M18,42 L18,30 C18,28 20,26 24,26 L30,26 C34,26 36,28 36,30 L36,42 Z' },
    { t: 'circle', cx: 24, cy: 76, r: 9 }, { t: 'circle', cx: 48, cy: 76, r: 9 }, { t: 'circle', cx: 74, cy: 76, r: 9 },
    { t: 'circle', cx: 24, cy: 76, r: 3 }, { t: 'circle', cx: 48, cy: 76, r: 3 }, { t: 'circle', cx: 74, cy: 76, r: 3 },
    { t: 'rect', x: 2, y: 88, width: 96, height: 8 },
  ],
  car: [
    { t: 'circle', cx: 84, cy: 14, r: 7 },
    { t: 'path', d: 'M6,22 C6,16 12,13 16,16 C18,9 28,8 31,14 C37,13 40,20 35,23 L10,23 C6,23 5,22 6,22 Z' },
    { t: 'path', d: 'M8,68 C8,58 12,54 20,52 C26,40 34,34 50,34 C64,34 72,40 78,52 C86,54 92,58 92,68 C92,74 88,76 82,76 L18,76 C12,76 8,74 8,68 Z' },
    { t: 'path', d: 'M32,50 C34,42 40,40 48,40 L48,52 L30,52 Z' },
    { t: 'path', d: 'M52,40 C62,40 68,44 72,52 L52,52 Z' },
    { t: 'circle', cx: 28, cy: 76, r: 11 }, { t: 'circle', cx: 72, cy: 76, r: 11 },
    { t: 'circle', cx: 28, cy: 76, r: 4 }, { t: 'circle', cx: 72, cy: 76, r: 4 },
    { t: 'circle', cx: 88, cy: 60, r: 3 },
    { t: 'rect', x: 2, y: 88, width: 96, height: 8 },
  ],
  robot: [
    { t: 'path', d: 'M34,20 C34,16 37,14 41,14 L59,14 C63,14 66,16 66,20 L66,44 C66,48 63,50 59,50 L41,50 C37,50 34,48 34,44 Z' },
    { t: 'circle', cx: 44, cy: 28, r: 5 }, { t: 'circle', cx: 56, cy: 28, r: 5 },
    { t: 'path', d: 'M42,38 C46,42 54,42 58,38 C54,44 46,44 42,38 Z' },
    { t: 'path', line: true, d: 'M50,14 L50,6' }, { t: 'circle', cx: 50, cy: 5, r: 4 },
    { t: 'path', d: 'M28,54 C28,50 31,48 35,48 L65,48 C69,48 72,50 72,54 L72,80 C72,84 69,86 65,86 L35,86 C31,86 28,84 28,80 Z' },
    { t: 'rect', x: 40, y: 58, width: 20, height: 14 },
    { t: 'path', d: 'M14,58 L28,58 L28,66 L14,66 C11,66 10,64 10,62 C10,60 11,58 14,58 Z' },
    { t: 'path', d: 'M86,58 L72,58 L72,66 L86,66 C89,66 90,64 90,62 C90,60 89,58 86,58 Z' },
    { t: 'path', d: 'M36,86 L46,86 L46,94 C46,96 44,96 40,96 C36,96 34,96 34,94 Z' },
    { t: 'path', d: 'M54,86 L64,86 L66,94 C66,96 64,96 60,96 C56,96 54,96 54,94 Z' },
  ],
  fishbowl: [
    { t: 'path', d: 'M22,46 C22,30 34,20 50,20 C66,20 78,30 78,46 C78,64 66,78 50,78 C34,78 22,64 22,46 Z' },
    { t: 'path', d: 'M24,52 C34,58 66,58 76,52 C74,68 64,78 50,78 C36,78 26,68 24,52 Z' },
    { t: 'path', d: 'M32,64 C36,58 46,56 54,60 L62,55 L60,64 L62,72 L54,68 C46,72 36,70 32,64 Z' },
    { t: 'circle', cx: 38, cy: 62, r: 2 },
    { t: 'path', d: 'M30,76 C28,68 34,62 32,56 C38,62 36,70 38,76 Z' },
    { t: 'circle', cx: 44, cy: 34, r: 3 }, { t: 'circle', cx: 54, cy: 28, r: 2 }, { t: 'circle', cx: 62, cy: 38, r: 2 },
    { t: 'path', d: 'M30,78 L70,78 C72,84 66,88 50,88 C34,88 28,84 30,78 Z' },
    { t: 'rect', x: 2, y: 88, width: 96, height: 8 },
  ],
  castle: [
    { t: 'circle', cx: 36, cy: 9, r: 6 },
    { t: 'path', d: 'M34,27 C34,21 40,18 44,21 C46,14 56,13 59,19 C65,18 68,25 63,28 L38,28 C34,28 33,27 34,27 Z' },
    { t: 'path', d: 'M24,44 L76,44 L76,88 L24,88 Z' },
    { t: 'path', d: 'M24,44 L24,36 L32,36 L32,42 L40,42 L40,36 L48,36 L48,42 L56,42 L56,36 L64,36 L64,42 L72,42 L72,36 L76,36 L76,44 Z' },
    { t: 'rect', x: 8, y: 40, width: 18, height: 48 }, { t: 'rect', x: 74, y: 40, width: 18, height: 48 },
    { t: 'polygon', points: '6,40 17,22 28,40' }, { t: 'polygon', points: '72,40 83,22 94,40' },
    { t: 'path', line: true, d: 'M17,22 L17,10' }, { t: 'polygon', points: '17,10 29,14 17,18' },
    { t: 'path', line: true, d: 'M83,22 L83,10' }, { t: 'polygon', points: '83,10 95,14 83,18' },
    { t: 'path', d: 'M42,88 L42,68 C42,60 58,60 58,68 L58,88 Z' },
    { t: 'rect', x: 30, y: 52, width: 10, height: 12 }, { t: 'rect', x: 60, y: 52, width: 10, height: 12 },
    { t: 'rect', x: 2, y: 88, width: 96, height: 10 },
  ],
  dinosaur: [
    { t: 'circle', cx: 88, cy: 12, r: 7 },
    { t: 'path', d: 'M4,22 C4,16 10,13 14,16 C16,9 26,8 29,14 C35,13 38,20 33,23 L8,23 C4,23 3,22 4,22 Z' },
    { t: 'path', d: 'M20,64 C20,52 32,46 46,48 C50,38 56,30 64,28 C74,26 82,32 82,40 C82,48 76,52 70,52 C70,66 56,74 42,72 C30,74 20,72 20,64 Z' },
    { t: 'path', d: 'M20,64 C12,58 4,62 2,72 C12,76 18,72 22,68 Z' },
    { t: 'rect', x: 30, y: 70, width: 9, height: 18 }, { t: 'rect', x: 52, y: 70, width: 9, height: 18 },
    { t: 'polygon', points: '28,48 32,38 36,48' }, { t: 'polygon', points: '40,44 44,34 48,44' }, { t: 'polygon', points: '52,44 56,34 60,44' },
    { t: 'circle', cx: 74, cy: 38, r: 2 },
    { t: 'rect', x: 2, y: 88, width: 96, height: 10 },
  ],
  garden: [
    { t: 'circle', cx: 86, cy: 12, r: 8 },
    { t: 'path', d: 'M6,20 C6,14 12,11 16,14 C18,7 28,6 31,12 C37,11 40,18 35,21 L10,21 C6,21 5,20 6,20 Z' },
    { t: 'path', d: 'M24,54 C24,70 25,80 24,90 L28,90 C27,80 28,70 28,54 Z' },
    ...[0, 1, 2, 3, 4].map((i) => { const a = (i * 2 * Math.PI) / 5 - Math.PI / 2; return { t: 'ellipse', cx: 26 + Math.cos(a) * 9, cy: 44 + Math.sin(a) * 9, rx: 6, ry: 6 }; }),
    { t: 'circle', cx: 26, cy: 44, r: 5 },
    { t: 'path', d: 'M52,46 C52,66 53,78 52,90 L56,90 C55,78 56,66 56,46 Z' },
    ...[0, 1, 2, 3, 4, 5].map((i) => { const a = (i * Math.PI) / 3 - Math.PI / 2; return { t: 'ellipse', cx: 54 + Math.cos(a) * 11, cy: 34 + Math.sin(a) * 11, rx: 7, ry: 7 }; }),
    { t: 'circle', cx: 54, cy: 34, r: 6 },
    { t: 'path', d: 'M78,60 C78,74 79,82 78,90 L82,90 C81,82 82,74 82,60 Z' },
    ...[0, 1, 2, 3, 4].map((i) => { const a = (i * 2 * Math.PI) / 5 - Math.PI / 2; return { t: 'ellipse', cx: 80 + Math.cos(a) * 8, cy: 52 + Math.sin(a) * 8, rx: 5, ry: 5 }; }),
    { t: 'circle', cx: 80, cy: 52, r: 4 },
    { t: 'path', d: 'M30,72 C22,64 12,70 15,78 C18,84 28,80 30,74 Z' },
    { t: 'path', d: 'M60,66 C68,58 78,64 75,72 C72,78 62,74 60,68 Z' },
    { t: 'rect', x: 2, y: 88, width: 96, height: 10 },
  ],
  playground: [
    { t: 'circle', cx: 86, cy: 12, r: 7 },
    { t: 'path', d: 'M4,22 C4,16 10,13 14,16 C16,9 26,8 29,14 C35,13 38,20 33,23 L8,23 C4,23 3,22 4,22 Z' },
    { t: 'path', d: 'M8,30 L54,30 L54,36 L8,36 Z' },
    { t: 'polygon', points: '6,36 2,86 10,86 14,36' }, { t: 'polygon', points: '48,36 52,86 60,86 56,36' },
    { t: 'path', line: true, d: 'M22,36 L22,62' }, { t: 'path', line: true, d: 'M40,36 L40,62' },
    { t: 'path', d: 'M18,62 L44,62 C46,62 46,68 44,68 L18,68 C16,68 16,62 18,62 Z' },
    { t: 'path', d: 'M68,44 C80,44 88,52 88,64 L88,86 L74,86 L74,64 C74,58 70,54 66,54 Z' },
    { t: 'rect', x: 62, y: 38, width: 26, height: 8 },
    { t: 'circle', cx: 30, cy: 80, r: 6 },
    { t: 'rect', x: 2, y: 86, width: 96, height: 12 },
  ],
  farm: [
    { t: 'circle', cx: 88, cy: 12, r: 7 },
    { t: 'path', d: 'M4,22 C4,16 10,13 14,16 C16,9 26,8 29,14 C35,13 38,20 33,23 L8,23 C4,23 3,22 4,22 Z' },
    { t: 'path', d: 'M8,48 L20,34 L46,34 L58,48 Z' },
    { t: 'rect', x: 10, y: 48, width: 46, height: 36 },
    { t: 'path', d: 'M24,84 L24,62 C24,56 42,56 42,62 L42,84 Z' },
    { t: 'rect', x: 14, y: 54, width: 9, height: 9 }, { t: 'rect', x: 43, y: 54, width: 9, height: 9 },
    { t: 'path', d: 'M66,42 C66,34 84,34 84,42 L84,84 L66,84 Z' },
    { t: 'path', d: 'M70,74 C74,70 82,70 86,74 C90,78 88,84 82,84 L74,84 C68,84 66,78 70,74 Z' },
    { t: 'circle', cx: 66, cy: 74, r: 5 },
    { t: 'rect', x: 2, y: 84, width: 96, height: 14 },
  ],
  birthday: [
    { t: 'path', d: 'M16,58 L84,58 L84,84 C84,88 80,90 74,90 L26,90 C20,90 16,88 16,84 Z' },
    { t: 'path', d: 'M16,58 C20,50 24,54 28,50 C32,46 36,52 40,50 C44,48 48,54 52,50 C56,46 60,52 64,50 C68,48 72,54 76,50 C80,46 84,52 84,58 Z' },
    { t: 'rect', x: 30, y: 30, width: 5, height: 20 }, { t: 'rect', x: 48, y: 26, width: 5, height: 24 }, { t: 'rect', x: 66, y: 30, width: 5, height: 20 },
    { t: 'path', d: 'M32.5,18 C36,22 37,26 34,29 C31,31 28,28 30,24 Z' },
    { t: 'path', d: 'M50.5,14 C54,18 55,22 52,25 C49,27 46,24 48,20 Z' },
    { t: 'path', d: 'M68.5,18 C72,22 73,26 70,29 C67,31 64,28 66,24 Z' },
    { t: 'circle', cx: 32, cy: 72, r: 4 }, { t: 'circle', cx: 50, cy: 72, r: 4 }, { t: 'circle', cx: 68, cy: 72, r: 4 },
    { t: 'path', d: 'M8,90 C8,86 92,86 92,90 C92,94 8,94 8,90 Z' },
  ],
  city: [
    { t: 'path', d: 'M78,14 C78,20 74,24 68,24 C74,26 80,22 82,16 C82,14 80,12 78,14 Z' },
    { t: 'path', d: 'M20,14 C20,17 22,19 25,19 C22,19 20,21 20,24 C20,21 18,19 15,19 C18,19 20,17 20,14 Z' },
    { t: 'path', d: 'M50,8 C50,11 52,13 55,13 C52,13 50,15 50,18 C50,15 48,13 45,13 C48,13 50,11 50,8 Z' },
    { t: 'path', d: 'M8,46 L30,46 L30,88 L8,88 Z' },
    { t: 'path', d: 'M34,30 L58,30 L58,88 L34,88 Z' }, { t: 'polygon', points: '34,30 46,20 58,30' },
    { t: 'path', d: 'M62,54 L82,54 L82,88 L62,88 Z' },
    { t: 'path', d: 'M84,40 C84,36 94,36 94,40 L94,88 L84,88 Z' },
    { t: 'rect', x: 13, y: 54, width: 6, height: 8 }, { t: 'rect', x: 21, y: 54, width: 6, height: 8 },
    { t: 'rect', x: 40, y: 40, width: 6, height: 8 }, { t: 'rect', x: 48, y: 40, width: 6, height: 8 },
    { t: 'rect', x: 40, y: 56, width: 6, height: 8 }, { t: 'rect', x: 48, y: 56, width: 6, height: 8 },
    { t: 'rect', x: 67, y: 62, width: 6, height: 8 }, { t: 'rect', x: 13, y: 70, width: 6, height: 8 },
    { t: 'rect', x: 2, y: 88, width: 96, height: 10 },
  ],
};
// The same drawing, small and in outline, for the grid of pictures. A name page shows the name.
// A name is drawn at whatever size fits: two lines if it has a space in it, one if not, and never
// stretched out of shape. Long names simply come out smaller.
function nameLines(name) {
  // Anything in brackets is the educator's note to themselves, not the child's name.
  const words = String(name || 'Your name').replace(/\([^)]*\)/g, ' ').trim().split(/[\s-]+/).filter(Boolean);
  const lines = [];
  for (const word of words) {
    const last = lines[lines.length - 1];
    if (last && (last + ' ' + word).length <= 12) lines[lines.length - 1] = `${last} ${word}`;
    else if (lines.length < 3) lines.push(word);
    else lines[2] = `${lines[2]} ${word}`;
  }
  if (!lines.length) lines.push('Name');
  const longest = Math.max(...lines.map((w) => w.length));
  // A bold letter is about 0.62 of its size wide, and the square is 88 units across with a margin.
  const size = Math.max(6, Math.min(26, 88 / (0.62 * longest), 80 / (lines.length * 1.2)));
  const step = size * 1.2;
  const y = (i) => 52 + (i - (lines.length - 1) / 2) * step + size * 0.34;
  return { lines, size, y };
}
function ColorThumb({ picture, name, size = 72 }) {
  const box = { width: size, height: size, display: 'block' };
  if (picture === 'my-name') {
    const { lines, size: fs, y } = nameLines(name);
    return (
      <svg viewBox="0 0 100 100" {...box} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        {lines.map((line, i) => (
          <text key={line + i} x="50" y={y(i)} textAnchor="middle" fontFamily={FONT} fontSize={fs} fontWeight="700" fill="#FFFFFF" stroke="#2E2E2E" strokeWidth={fs * 0.055} paintOrder="stroke" strokeLinejoin="round">{line}</text>
        ))}
      </svg>
    );
  }
  const parts = layoutLetterParts(COLORING_ART[picture] || []);
  return (
    <svg viewBox="0 0 100 100" {...box} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      {parts.map((p, i) => {
        const common = { key: i, fill: p.line ? 'none' : '#FFFFFF', stroke: '#2E2E2E', strokeWidth: 2.4, strokeLinecap: 'round', strokeLinejoin: 'round' };
        if (p.t === 'art') return <ArtPart key={i} p={p} thumb />;
        if (p.t === 'text') { const g = letterPath(p); return g ? <path {...common} d={g.d} transform={g.transform} paintOrder="stroke" strokeWidth={1.5 / g.s} strokeLinejoin="round" /> : <text {...common} x={p.x} y={p.y} fontSize={p.size} fontFamily={FONT} fontWeight={400} textAnchor="middle" dominantBaseline="central" paintOrder="stroke" strokeWidth={3.6}>{p.text}</text>; }
        if (p.t === 'circle') return <circle {...common} cx={p.cx} cy={p.cy} r={p.r} />;
        if (p.t === 'ellipse') return <ellipse {...common} cx={p.cx} cy={p.cy} rx={p.rx} ry={p.ry} />;
        if (p.t === 'rect') return <rect {...common} x={p.x} y={p.y} width={p.width} height={p.height} rx={2} />;
        if (p.t === 'path') return <path {...common} d={p.d} />;
        return <polygon {...common} points={p.points} />;
      })}
    </svg>
  );
}
// True when the window is short and wide: a phone on its side, where the timer stands upright.
function useSideways() {
  const [on, setOn] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-height: 540px)').matches);
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const m = window.matchMedia('(max-height: 540px)');
    const listen = () => setOn(m.matches);
    m.addEventListener('change', listen);
    return () => m.removeEventListener('change', listen);
  }, []);
  return on;
}
// The letter pages: the capital on the left, its lowercase on the right, and five circles of
// Letter outlines baked from DejaVu Sans at build time (tools/glyphs.py), so a coloring letter is a
// path, the same on every device: no font, no fake bold, no autosizing, and real widths for the layout.
const GLYPH_UPM = 2048; const GLYPH_CAP = 1493;
const LETTER_GLYPHS = {"A":{"d":"M700 1294 426 551H975ZM586 1493H815L1384 0H1174L1038 383H365L229 0H16Z","adv":1401,"box":[16,0,1384,1493]},"B":{"d":"M403 713V166H727Q890 166 968 234Q1047 301 1047 440Q1047 580 968 646Q890 713 727 713ZM403 1327V877H702Q850 877 922 932Q995 988 995 1102Q995 1215 922 1271Q850 1327 702 1327ZM201 1493H717Q948 1493 1073 1397Q1198 1301 1198 1124Q1198 987 1134 906Q1070 825 946 805Q1095 773 1178 672Q1260 570 1260 418Q1260 218 1124 109Q988 0 737 0H201Z","adv":1405,"box":[201,0,1260,1493]},"C":{"d":"M1319 1378V1165Q1217 1260 1102 1307Q986 1354 856 1354Q600 1354 464 1198Q328 1041 328 745Q328 450 464 294Q600 137 856 137Q986 137 1102 184Q1217 231 1319 326V115Q1213 43 1094 7Q976 -29 844 -29Q505 -29 310 178Q115 386 115 745Q115 1105 310 1312Q505 1520 844 1520Q978 1520 1096 1484Q1215 1449 1319 1378Z","adv":1430,"box":[115,-29,1319,1520]},"D":{"d":"M403 1327V166H647Q956 166 1100 306Q1243 446 1243 748Q1243 1048 1100 1188Q956 1327 647 1327ZM201 1493H616Q1050 1493 1253 1312Q1456 1132 1456 748Q1456 362 1252 181Q1048 0 616 0H201Z","adv":1577,"box":[201,0,1456,1493]},"E":{"d":"M201 1493H1145V1323H403V881H1114V711H403V170H1163V0H201Z","adv":1294,"box":[201,0,1163,1493]},"F":{"d":"M201 1493H1059V1323H403V883H995V713H403V0H201Z","adv":1178,"box":[201,0,1059,1493]},"G":{"d":"M1219 213V614H889V780H1419V139Q1302 56 1161 14Q1020 -29 860 -29Q510 -29 312 176Q115 380 115 745Q115 1111 312 1316Q510 1520 860 1520Q1006 1520 1138 1484Q1269 1448 1380 1378V1163Q1268 1258 1142 1306Q1016 1354 877 1354Q603 1354 466 1201Q328 1048 328 745Q328 443 466 290Q603 137 877 137Q984 137 1068 156Q1152 174 1219 213Z","adv":1587,"box":[115,-29,1419,1520]},"H":{"d":"M201 1493H403V881H1137V1493H1339V0H1137V711H403V0H201Z","adv":1540,"box":[201,0,1339,1493]},"I":{"d":"M201 1493H403V0H201Z","adv":604,"box":[201,0,403,1493]},"J":{"d":"M201 1493H403V104Q403 -166 300 -288Q198 -410 -29 -410H-106V-240H-43Q91 -240 146 -165Q201 -90 201 104Z","adv":604,"box":[-106,-410,403,1493]},"K":{"d":"M201 1493H403V862L1073 1493H1333L592 797L1386 0H1120L403 719V0H201Z","adv":1343,"box":[201,0,1386,1493]},"L":{"d":"M201 1493H403V170H1130V0H201Z","adv":1141,"box":[201,0,1130,1493]},"M":{"d":"M201 1493H502L883 477L1266 1493H1567V0H1370V1311L985 287H782L397 1311V0H201Z","adv":1767,"box":[201,0,1567,1493]},"N":{"d":"M201 1493H473L1135 244V1493H1331V0H1059L397 1249V0H201Z","adv":1532,"box":[201,0,1331,1493]},"O":{"d":"M807 1356Q587 1356 458 1192Q328 1028 328 745Q328 463 458 299Q587 135 807 135Q1027 135 1156 299Q1284 463 1284 745Q1284 1028 1156 1192Q1027 1356 807 1356ZM807 1520Q1121 1520 1309 1310Q1497 1099 1497 745Q1497 392 1309 182Q1121 -29 807 -29Q492 -29 304 181Q115 391 115 745Q115 1099 304 1310Q492 1520 807 1520Z","adv":1612,"box":[115,-29,1497,1520]},"P":{"d":"M403 1327V766H657Q798 766 875 839Q952 912 952 1047Q952 1181 875 1254Q798 1327 657 1327ZM201 1493H657Q908 1493 1036 1380Q1165 1266 1165 1047Q1165 826 1036 713Q908 600 657 600H403V0H201Z","adv":1235,"box":[201,0,1165,1493]},"Q":{"d":"M807 1356Q587 1356 458 1192Q328 1028 328 745Q328 463 458 299Q587 135 807 135Q1027 135 1156 299Q1284 463 1284 745Q1284 1028 1156 1192Q1027 1356 807 1356ZM1090 27 1356 -264H1112L891 -25Q858 -27 840 -28Q823 -29 807 -29Q492 -29 304 182Q115 392 115 745Q115 1099 304 1310Q492 1520 807 1520Q1121 1520 1309 1310Q1497 1099 1497 745Q1497 485 1392 300Q1288 115 1090 27Z","adv":1612,"box":[115,-264,1497,1520]},"R":{"d":"M909 700Q974 678 1036 606Q1097 534 1159 408L1364 0H1147L956 383Q882 533 812 582Q743 631 623 631H403V0H201V1493H657Q913 1493 1039 1386Q1165 1279 1165 1063Q1165 922 1100 829Q1034 736 909 700ZM403 1327V797H657Q803 797 878 864Q952 932 952 1063Q952 1194 878 1260Q803 1327 657 1327Z","adv":1423,"box":[201,0,1364,1493]},"S":{"d":"M1096 1444V1247Q981 1302 879 1329Q777 1356 682 1356Q517 1356 428 1292Q338 1228 338 1110Q338 1011 398 960Q457 910 623 879L745 854Q971 811 1078 702Q1186 594 1186 412Q1186 195 1040 83Q895 -29 614 -29Q508 -29 388 -5Q269 19 141 66V274Q264 205 382 170Q500 135 614 135Q787 135 881 203Q975 271 975 397Q975 507 908 569Q840 631 686 662L563 686Q337 731 236 827Q135 923 135 1094Q135 1292 274 1406Q414 1520 659 1520Q764 1520 873 1501Q982 1482 1096 1444Z","adv":1300,"box":[135,-29,1186,1520]},"T":{"d":"M-6 1493H1257V1323H727V0H524V1323H-6Z","adv":1251,"box":[-6,0,1257,1493]},"U":{"d":"M178 1493H381V586Q381 346 468 240Q555 135 750 135Q944 135 1031 240Q1118 346 1118 586V1493H1321V561Q1321 269 1176 120Q1032 -29 750 -29Q467 -29 322 120Q178 269 178 561Z","adv":1499,"box":[178,-29,1321,1493]},"V":{"d":"M586 0 16 1493H227L700 236L1174 1493H1384L815 0Z","adv":1401,"box":[16,0,1384,1493]},"W":{"d":"M68 1493H272L586 231L899 1493H1126L1440 231L1753 1493H1958L1583 0H1329L1014 1296L696 0H442Z","adv":2025,"box":[68,0,1958,1493]},"X":{"d":"M129 1493H346L717 938L1090 1493H1307L827 776L1339 0H1122L702 635L279 0H61L594 797Z","adv":1403,"box":[61,0,1339,1493]},"Y":{"d":"M-4 1493H213L627 879L1038 1493H1255L727 711V0H524V711Z","adv":1251,"box":[-4,0,1255,1493]},"Z":{"d":"M115 1493H1288V1339L344 170H1311V0H92V154L1036 1323H115Z","adv":1403,"box":[92,0,1311,1493]},"a":{"d":"M702 563Q479 563 393 512Q307 461 307 338Q307 240 372 182Q436 125 547 125Q700 125 792 234Q885 342 885 522V563ZM1069 639V0H885V170Q822 68 728 20Q634 -29 498 -29Q326 -29 224 68Q123 164 123 326Q123 515 250 611Q376 707 627 707H885V725Q885 852 802 922Q718 991 567 991Q471 991 380 968Q289 945 205 899V1069Q306 1108 401 1128Q496 1147 586 1147Q829 1147 949 1021Q1069 895 1069 639Z","adv":1255,"box":[123,-29,1069,1147]},"b":{"d":"M997 559Q997 762 914 878Q830 993 684 993Q538 993 454 878Q371 762 371 559Q371 356 454 240Q538 125 684 125Q830 125 914 240Q997 356 997 559ZM371 950Q429 1050 518 1098Q606 1147 729 1147Q933 1147 1060 985Q1188 823 1188 559Q1188 295 1060 133Q933 -29 729 -29Q606 -29 518 20Q429 68 371 168V0H186V1556H371Z","adv":1300,"box":[186,-29,1188,1556]},"c":{"d":"M999 1077V905Q921 948 842 970Q764 991 684 991Q505 991 406 878Q307 764 307 559Q307 354 406 240Q505 127 684 127Q764 127 842 148Q921 170 999 213V43Q922 7 840 -11Q757 -29 664 -29Q411 -29 262 130Q113 289 113 559Q113 833 264 990Q414 1147 676 1147Q761 1147 842 1130Q923 1112 999 1077Z","adv":1126,"box":[113,-29,999,1147]},"d":{"d":"M930 950V1556H1114V0H930V168Q872 68 784 20Q695 -29 571 -29Q368 -29 240 133Q113 295 113 559Q113 823 240 985Q368 1147 571 1147Q695 1147 784 1098Q872 1050 930 950ZM303 559Q303 356 386 240Q470 125 616 125Q762 125 846 240Q930 356 930 559Q930 762 846 878Q762 993 616 993Q470 993 386 878Q303 762 303 559Z","adv":1300,"box":[113,-29,1114,1556]},"e":{"d":"M1151 606V516H305Q317 326 420 226Q522 127 705 127Q811 127 910 153Q1010 179 1108 231V57Q1009 15 905 -7Q801 -29 694 -29Q426 -29 270 127Q113 283 113 549Q113 824 262 986Q410 1147 662 1147Q888 1147 1020 1002Q1151 856 1151 606ZM967 660Q965 811 882 901Q800 991 664 991Q510 991 418 904Q325 817 311 659Z","adv":1260,"box":[113,-29,1151,1147]},"f":{"d":"M760 1556V1403H584Q485 1403 446 1363Q408 1323 408 1219V1120H711V977H408V0H223V977H47V1120H223V1198Q223 1385 310 1470Q397 1556 586 1556Z","adv":721,"box":[47,0,760,1556]},"g":{"d":"M930 573Q930 773 848 883Q765 993 616 993Q468 993 386 883Q303 773 303 573Q303 374 386 264Q468 154 616 154Q765 154 848 264Q930 374 930 573ZM1114 139Q1114 -147 987 -286Q860 -426 598 -426Q501 -426 415 -412Q329 -397 248 -367V-188Q329 -232 408 -253Q487 -274 569 -274Q750 -274 840 -180Q930 -85 930 106V197Q873 98 784 49Q695 0 571 0Q365 0 239 157Q113 314 113 573Q113 833 239 990Q365 1147 571 1147Q695 1147 784 1098Q873 1049 930 950V1120H1114Z","adv":1300,"box":[113,-426,1114,1147]},"h":{"d":"M1124 676V0H940V670Q940 829 878 908Q816 987 692 987Q543 987 457 892Q371 797 371 633V0H186V1556H371V946Q437 1047 526 1097Q616 1147 733 1147Q926 1147 1025 1028Q1124 908 1124 676Z","adv":1298,"box":[186,0,1124,1556]},"i":{"d":"M193 1120H377V0H193ZM193 1556H377V1323H193Z","adv":569,"box":[193,0,377,1556]},"j":{"d":"M193 1120H377V-20Q377 -234 296 -330Q214 -426 33 -426H-37V-270H12Q117 -270 155 -222Q193 -173 193 -20ZM193 1556H377V1323H193Z","adv":569,"box":[-37,-426,377,1556]},"k":{"d":"M186 1556H371V637L920 1120H1155L561 596L1180 0H940L371 547V0H186Z","adv":1186,"box":[186,0,1180,1556]},"l":{"d":"M193 1556H377V0H193Z","adv":569,"box":[193,0,377,1556]},"m":{"d":"M1065 905Q1134 1029 1230 1088Q1326 1147 1456 1147Q1631 1147 1726 1024Q1821 902 1821 676V0H1636V670Q1636 831 1579 909Q1522 987 1405 987Q1262 987 1179 892Q1096 797 1096 633V0H911V670Q911 832 854 910Q797 987 678 987Q537 987 454 892Q371 796 371 633V0H186V1120H371V946Q434 1049 522 1098Q610 1147 731 1147Q853 1147 938 1085Q1024 1023 1065 905Z","adv":1995,"box":[186,0,1821,1147]},"n":{"d":"M1124 676V0H940V670Q940 829 878 908Q816 987 692 987Q543 987 457 892Q371 797 371 633V0H186V1120H371V946Q437 1047 526 1097Q616 1147 733 1147Q926 1147 1025 1028Q1124 908 1124 676Z","adv":1298,"box":[186,0,1124,1147]},"o":{"d":"M627 991Q479 991 393 876Q307 760 307 559Q307 358 392 242Q478 127 627 127Q774 127 860 243Q946 359 946 559Q946 758 860 874Q774 991 627 991ZM627 1147Q867 1147 1004 991Q1141 835 1141 559Q1141 284 1004 128Q867 -29 627 -29Q386 -29 250 128Q113 284 113 559Q113 835 250 991Q386 1147 627 1147Z","adv":1253,"box":[113,-29,1141,1147]},"p":{"d":"M371 168V-426H186V1120H371V950Q429 1050 518 1098Q606 1147 729 1147Q933 1147 1060 985Q1188 823 1188 559Q1188 295 1060 133Q933 -29 729 -29Q606 -29 518 20Q429 68 371 168ZM997 559Q997 762 914 878Q830 993 684 993Q538 993 454 878Q371 762 371 559Q371 356 454 240Q538 125 684 125Q830 125 914 240Q997 356 997 559Z","adv":1300,"box":[186,-426,1188,1147]},"q":{"d":"M303 559Q303 356 386 240Q470 125 616 125Q762 125 846 240Q930 356 930 559Q930 762 846 878Q762 993 616 993Q470 993 386 878Q303 762 303 559ZM930 168Q872 68 784 20Q695 -29 571 -29Q368 -29 240 133Q113 295 113 559Q113 823 240 985Q368 1147 571 1147Q695 1147 784 1098Q872 1050 930 950V1120H1114V-426H930Z","adv":1300,"box":[113,-426,1114,1147]},"r":{"d":"M842 948Q811 966 774 974Q738 983 694 983Q538 983 454 882Q371 780 371 590V0H186V1120H371V946Q429 1048 522 1098Q615 1147 748 1147Q767 1147 790 1144Q813 1142 841 1137Z","adv":842,"box":[186,0,842,1147]},"s":{"d":"M907 1087V913Q829 953 745 973Q661 993 571 993Q434 993 366 951Q297 909 297 825Q297 761 346 724Q395 688 543 655L606 641Q802 599 884 522Q967 446 967 309Q967 153 844 62Q720 -29 504 -29Q414 -29 316 -12Q219 6 111 41V231Q213 178 312 152Q411 125 508 125Q638 125 708 170Q778 214 778 295Q778 370 728 410Q677 450 506 487L442 502Q271 538 195 612Q119 687 119 817Q119 975 231 1061Q343 1147 549 1147Q651 1147 741 1132Q831 1117 907 1087Z","adv":1067,"box":[111,-29,967,1147]},"t":{"d":"M375 1438V1120H754V977H375V369Q375 232 412 193Q450 154 565 154H754V0H565Q352 0 271 80Q190 159 190 369V977H55V1120H190V1438Z","adv":803,"box":[55,0,754,1438]},"u":{"d":"M174 442V1120H358V449Q358 290 420 210Q482 131 606 131Q755 131 842 226Q928 321 928 485V1120H1112V0H928V172Q861 70 772 20Q684 -29 567 -29Q374 -29 274 91Q174 211 174 442ZM637 1147Z","adv":1298,"box":[174,-29,1112,1147]},"v":{"d":"M61 1120H256L606 180L956 1120H1151L731 0H481Z","adv":1212,"box":[61,0,1151,1120]},"w":{"d":"M86 1120H270L500 246L729 1120H946L1176 246L1405 1120H1589L1296 0H1079L838 918L596 0H379Z","adv":1675,"box":[86,0,1589,1120]},"x":{"d":"M1124 1120 719 575 1145 0H928L602 440L276 0H59L494 586L96 1120H313L610 721L907 1120Z","adv":1212,"box":[59,0,1145,1120]},"y":{"d":"M659 -104Q581 -304 507 -365Q433 -426 309 -426H162V-272H270Q346 -272 388 -236Q430 -200 481 -66L514 18L61 1120H256L606 244L956 1120H1151Z","adv":1212,"box":[61,-426,1151,1120]},"z":{"d":"M113 1120H987V952L295 147H987V0H88V168L780 973H113Z","adv":1075,"box":[88,0,987,1120]}};
// Scales and moves the parts of a drawing (circles, ellipses, rects, polygons, and paths of M, L, C, Z)
// so a picture can sit in a corner of another page.
function scaleParts(parts, k, dx, dy) {
  const num = (x, y) => [x * k + dx, y * k + dy];
  return parts.map((p) => {
    if (p.t === 'circle') { const [cx, cy] = num(p.cx, p.cy); return { ...p, cx, cy, r: p.r * k }; }
    if (p.t === 'ellipse') { const [cx, cy] = num(p.cx, p.cy); return { ...p, cx, cy, rx: p.rx * k, ry: p.ry * k }; }
    if (p.t === 'rect') { const [x, y] = num(p.x, p.y); return { ...p, x, y, w: p.w * k, h: p.h * k, width: p.width !== undefined ? p.width * k : undefined, height: p.height !== undefined ? p.height * k : undefined }; }
    if (p.t === 'polygon') return { ...p, points: String(p.points).trim().split(/\s+/).map((pt) => { const [x, y] = pt.split(',').map(Number); return num(x, y).map((v) => v.toFixed(2)).join(','); }).join(' ') };
    if (p.t === 'path') return { ...p, d: scalePath(String(p.d), k, dx, dy) };
    if (p.t === 'art') { const [x, y] = num(p.x, p.y); return { ...p, x, y, w: p.w * k, h: p.h * k }; }
    return p;
  });
}
// Path data through a scale and a shift, command by command: absolute points move and scale, relative
// points only scale, arc radii scale and arc flags are left alone.
function scalePath(d, k, dx, dy) {
  const tokens = d.match(/[A-Za-z]|-?\d*\.?\d+(?:e-?\d+)?/g) || []; const out = []; let cmd = 'M'; let i = 0;
  const arity = { M: 2, L: 2, T: 2, C: 6, S: 4, Q: 4, A: 7, H: 1, V: 1, Z: 0 };
  while (i < tokens.length) {
    const t = tokens[i];
    if (/[A-Za-z]/.test(t)) { cmd = t; out.push(t); i += 1; if (cmd.toUpperCase() === 'Z') continue; }
    const abs = cmd === cmd.toUpperCase(); const n = arity[cmd.toUpperCase()]; if (!n) { i += 1; continue; }
    const nums = tokens.slice(i, i + n).map(Number); i += n;
    const up = cmd.toUpperCase(); let vals;
    if (up === 'A') vals = [nums[0] * k, nums[1] * k, nums[2], nums[3], nums[4], abs ? nums[5] * k + dx : nums[5] * k, abs ? nums[6] * k + dy : nums[6] * k];
    else if (up === 'H') vals = [abs ? nums[0] * k + dx : nums[0] * k];
    else if (up === 'V') vals = [abs ? nums[0] * k + dy : nums[0] * k];
    else vals = nums.map((v, j) => (abs ? v * k + (j % 2 === 0 ? dx : dy) : v * k));
    out.push(vals.map((v, j) => (up === 'A' && (j === 3 || j === 4) ? String(v) : Number(v.toFixed(2)).toString())).join(' '));
  }
  return out.join(' ');
}
// A word laid out in coloring letters along a line, by real widths.
function wordParts(word, y, size) {
  const sx = (size / GLYPH_UPM) * GLYPH_WIDE; const gap = 3;
  const w = word.split('').map((ch) => (LETTER_GLYPHS[ch] ? LETTER_GLYPHS[ch].adv * sx : size * 0.5)); const total = w.reduce((a, b) => a + b, 0) + gap * (word.length - 1);
  let x = 50 - total / 2; return word.split('').map((ch, i) => { const part = { t: 'text', text: ch, x: x + w[i] / 2, y, size }; x += w[i] + gap; return part; });
}
// A coloring page drawn by Mikey: the image when art/coloring/<serial>.webp exists, else a dashed
// frame wearing the serial so everyone can see what is still to be made.
function ArtPart({ p, thumb = false }) {
  const have = typeof window !== 'undefined' && Array.isArray(window.__eduColoringArt) && window.__eduColoringArt.includes(p.serial);
  if (have) return <image href={`art/coloring/${p.serial}.webp`} x={p.x} y={p.y} width={p.w} height={p.h} preserveAspectRatio="xMidYMid meet" style={{ pointerEvents: 'none' }} />;
  return (
    <g style={{ pointerEvents: 'none' }}>
      <rect x={p.x} y={p.y} width={p.w} height={p.h} rx="4" fill="#FAFBF8" stroke={C.muted} strokeWidth={thumb ? 1.2 : 0.8} strokeDasharray="3 2" />
      <text x={p.x + p.w / 2} y={p.y + p.h / 2 - (thumb ? 0 : 4)} fontFamily={FONT} fontSize={thumb ? 16 : 9} fontWeight="700" fill={C.muted} textAnchor="middle" dominantBaseline="central">{p.serial}</text>
      {!thumb && <text x={p.x + p.w / 2} y={p.y + p.h / 2 + 8} fontFamily={FONT} fontSize="4.6" fill={C.muted} textAnchor="middle" dominantBaseline="central">{p.alt}</text>}
    </g>
  );
}
// A letter part as a path: centered on p.x like anchored text, its baseline set so capitals sit
// centered on p.y. Stroke widths are given in picture units and divided by the scale.
const GLYPH_WIDE = 2.2;   // coloring letters are stretched sideways: wider is friendlier to color
function letterPath(p) {
  const g = LETTER_GLYPHS[p.text]; if (!g) return null;
  const s = p.size / GLYPH_UPM; const sx = s * GLYPH_WIDE;
  return { d: g.d, s, transform: `translate(${(p.x - (g.adv * sx) / 2).toFixed(2)} ${(p.y + (GLYPH_CAP * s) / 2).toFixed(2)}) scale(${sx.toFixed(4)} ${(-s).toFixed(4)})` };
}
// Letter pages: the capital and the small letter sit side by side by their real widths, centered,
// and the bubbles stay out of the two bottom corners where the zoom buttons live.
function layoutLetterParts(parts) {
  const texts = parts.filter((p) => p.t === 'text' && LETTER_GLYPHS[p.text]);
  if (parts.some((p) => p.t === 'art')) {
    // An art page: bubbles take the top band and the bottom middle, clear of the frame and the zoom buttons.
    const artSpots = [[12, 12], [38, 9], [62, 9], [88, 12], [50, 91]]; let b = 0;
    return parts.map((p) => (p.t === 'circle' ? { ...p, cx: artSpots[b % 5][0], cy: artSpots[b++ % 5][1], r: Math.min(p.r, 5.5) } : p));
  }
  if (texts.length !== 2 || parts.some((p) => p.t === 'text' && p.y >= 78)) return parts;
  const gap = 5; const fit = (size) => { const s = (size / GLYPH_UPM) * GLYPH_WIDE; return texts.map((p) => LETTER_GLYPHS[p.text].adv * s); };
  let size = texts[0].size; let w = fit(size); if (w[0] + gap + w[1] > 96) { size = size * (96 / (w[0] + gap + w[1])); w = fit(size); }
  const total = w[0] + gap + w[1]; let x = 50 - total / 2;
  const placed = texts.map((p, i) => { const out = { ...p, size, x: x + w[i] / 2, y: 48 }; x += w[i] + gap; return out; });
  // Bubbles spread over the whole card: two along the top, two along the bottom between the zoom
  // buttons, and one at a side when the letters leave room (else a third across the top). Which
  // spots, the letter decides, so every page differs; none sits on a letter or a zoom button.
  const left = placed[0].x - w[0] / 2; const right = placed[1].x + w[1] / 2; const k = texts[0].text.charCodeAt(0);
  const top = k % 2 ? [[12, 12], [62, 9]] : [[38, 9], [88, 12]]; const bottom = k % 3 ? [[30, 91], [70, 91]] : [[50, 90], [30, 91]];
  const side = left >= 15 && k % 2 ? [7, 48] : right <= 85 ? [93, 48] : left >= 15 ? [7, 48] : (k % 2 ? [88, 12] : [12, 12]);
  const spots = [...top, ...bottom, side];
  let bubble = 0;
  return parts.map((p) => {
    if (p.t === 'text') return placed[texts.indexOf(p)];
    if (p.t === 'circle') { const [cx, cy] = spots[bubble % spots.length]; bubble += 1; return { ...p, cx, cy, r: Math.min(p.r, cy > 80 ? 4.5 : 6) }; }
    return p;
  });
}
// different sizes around them, placed by the letter itself so every page is a little different.
// Drawing pages that Mikey makes in Leonardo (D1 to D10 in the ledger): until the image exists the card
// wears a placeholder with its serial; the child colors over the image by hand once it is there.
const DRAWN_PAGES = {
  fishbowl: ['D1', 'A goldfish bowl on a table'], fish: ['D2', 'One fish with sea plants behind it'], cat: ['D3', 'A sitting cat'], flower: ['D4', 'One flower, and three flowers together'],
  rocket: ['D5', 'A rocket taking off'], butterfly: ['D6', 'A butterfly with open wings'], dinosaur: ['D7', 'A friendly dinosaur'], farm: ['D8', 'A barn, a fence and a cow'],
  birthday: ['D9', 'A birthday cake with candles'], playground: ['D10', 'A slide and a swing'], city: ['D11', 'A city street with tall buildings'],
  // New pages, simplest first: the further down the list, the busier the scene.
  kite: ['D12', 'A kite on a string in the sky'], ladybug: ['D13', 'A ladybug on a leaf'], 'ice-cream': ['D14', 'An ice cream cone with two scoops'], snowman: ['D15', 'A snowman with a scarf and a hat'],
  'hot-air-balloon': ['D16', 'A hot air balloon over hills'], lighthouse: ['D17', 'A lighthouse on rocks by the sea'], treehouse: ['D18', 'A treehouse with a rope ladder'], submarine: ['D19', 'A submarine among fish and coral'],
  'pirate-ship': ['D20', 'A pirate ship on rolling waves'], dragon: ['D21', 'A friendly dragon over a village'], 'space-station': ['D22', 'A space station with planets behind it'], 'jungle-waterfall': ['D23', 'A jungle waterfall with animals'],
};
for (const [pic, [serial, alt]] of Object.entries(DRAWN_PAGES)) COLORING_ART[pic] = [{ t: 'art', serial, x: 4, y: 4, w: 92, h: 92, alt }];
// Letter pages are art now: a coloring page Mikey makes in Leonardo (L1 to L26 in the ledger), shown
// as an image the child colors over; until it exists the card wears a placeholder with its serial.
const LETTER_SERIAL = (ch) => `L${ch.charCodeAt(0) - 96}`;
for (const ch of 'abcdefghijklmnopqrstuvwxyz') {
  const k = ch.charCodeAt(0) - 96;
  const spots = [[12, 13], [88, 12], [10, 88], [90, 87], [50, 8], [50, 92], [6, 50], [94, 50]];
  const circles = [0, 1, 2, 3, 4].map((i) => { const [cx, cy] = spots[(k * 3 + i * 5) % spots.length]; return { t: 'circle', cx, cy, r: 3.5 + ((k + i * 7) % 5) * 1.1 }; });
  COLORING_ART[`letter-${ch}`] = [{ t: 'art', serial: LETTER_SERIAL(ch), x: 4, y: 4, w: 92, h: 92, alt: `A capital ${ch.toUpperCase()} beside a small ${ch}` }];
}
// The sound of a crayon on paper, made on the device: soft noise through a band-pass filter, louder
// as the hand moves faster and silent when it stops. Starts on the first touch (which is also what
// the browser needs before it will play anything) and fails quietly on a device with no audio.
let paper = null;
function paperStart() {
  try {
    if (!paper) {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate); const data = buf.getChannelData(0);
      let last = 0; for (let i = 0; i < data.length; i++) { last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; data[i] = last * 3.5; }
      const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
      const band = ctx.createBiquadFilter(); band.type = 'bandpass'; band.frequency.value = 1800; band.Q.value = 0.7;
      const gain = ctx.createGain(); gain.gain.value = 0;
      src.connect(band); band.connect(gain); gain.connect(ctx.destination); src.start();
      paper = { ctx, gain };
    }
    if (paper.ctx.state === 'suspended') paper.ctx.resume();
  } catch (e) { paper = null; }
}
function paperMove(pxPerMs) { if (paper) paper.gain.gain.setTargetAtTime(Math.min(0.3, pxPerMs * 0.25), paper.ctx.currentTime, 0.03); }
function paperStop() { if (paper) paper.gain.gain.setTargetAtTime(0, paper.ctx.currentTime, 0.05); }
function ColoringPad({ picture, name, secondsLeft, total, saved, onArt, onClose }) {
  const [crayon, setCrayon] = useState(CRAYONS[0]);
  const [nib, setNib] = useState(NIB_DEFAULT);
  const [eraser, setEraser] = useState(null);   // an eraser width while erasing, null while coloring
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 }); // the top-left corner of what is shown, in the picture's own units
  const [fills, setFills] = useState((saved && saved.fills) || {});
  const [strokes, setStrokes] = useState((saved && saved.strokes) || []);
  // The work in progress is handed up as it happens, so leaving and coming back finds it as it was.
  useEffect(() => { onArt({ fills, strokes }); }, [fills, strokes]);
  const drawing = useRef(false);
  // A letter page says its letter when it opens; the speaker in the header says it again.
  const letterSay = picture.startsWith('letter-') ? `On the left is a capital ${picture.slice(-1).toUpperCase()}. On the right is a lower case ${picture.slice(-1).toUpperCase()}.` : null;
  useEffect(() => { if (letterSay) speak(letterSay); }, [picture]);
  const lastPt = useRef([0, 0, 0]);                                  // where the pointer was last, in screen pixels, and when
  const svgRef = useRef(null);
  useEffect(() => paperStop, []);
  const parts = layoutLetterParts(COLORING_ART[picture] || []);
  const freeDraw = COLORING_MODE[picture] === 'draw';
  // Zoomed in, the picture is still drawn in its own coordinates, so color put on close up stays
  // exactly where it belongs when they zoom back out.
  const span = 100 / zoom;
  // A picture that is filled in has a strip of paper below the drawing, so the zoom buttons sit
  // under it rather than over it. A drawing picture keeps the square: the hand needs the room.
  const tall = freeDraw ? 1 : 1.14;
  const spanY = span * tall;
  const limit = 100 - span;
  const clamp = (v) => Math.max(0, Math.min(limit, v));
  const view = { x: clamp(pan.x), y: clamp(pan.y) };
  const at = (e) => { const r = svgRef.current.getBoundingClientRect(); return [view.x + ((e.clientX - r.left) / r.width) * span, view.y + ((e.clientY - r.top) / r.height) * spanY]; };
  // Zooming keeps the middle of what they were looking at, so the picture does not jump under them.
  const changeZoom = (dir) => {
    const next = ZOOMS[Math.max(0, Math.min(ZOOMS.length - 1, ZOOMS.indexOf(zoom) + dir))];
    const nextSpan = 100 / next; const nextLimit = 100 - nextSpan;
    const midX = view.x + span / 2; const midY = view.y + span / 2;
    setPan({ x: Math.max(0, Math.min(nextLimit, midX - nextSpan / 2)), y: Math.max(0, Math.min(nextLimit, midY - nextSpan / 2)) });
    setZoom(next);
  };
  const nudge = (dx, dy) => setPan({ x: clamp(view.x + dx * span * 0.45), y: clamp(view.y + dy * span * 0.45) });
  // An eraser is a stroke of paper color: it lifts crayon without touching the outline, which is drawn on top.
  const start = (e) => { if (!freeDraw) return; drawing.current = true; lastPt.current = [e.clientX, e.clientY, performance.now()]; paperStart(); setStrokes((list) => [...list, eraser ? { colour: '#FFFFFF', width: eraser, points: [at(e)] } : { colour: crayon, width: nib, points: [at(e)] }]); };
  const move = (e) => { if (!freeDraw || !drawing.current) return; e.preventDefault(); const [lx, ly, lt] = lastPt.current; const now = performance.now(); paperMove(Math.hypot(e.clientX - lx, e.clientY - ly) / Math.max(1, now - lt)); lastPt.current = [e.clientX, e.clientY, now]; setStrokes((list) => { const rest = list.slice(0, -1); const last = list[list.length - 1]; return [...rest, { ...last, points: [...last.points, at(e)] }]; }); };
  const stop = () => { drawing.current = false; paperStop(); };
  return (
    <div className={`edu-pad${freeDraw ? '' : ' edu-pad-fill'}`}>
      {/* Start over on the left, close on the right, both sitting on the picture's own width. */}
      <div className="edu-pad-head edu-pad-col" style={{ margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button type="button" aria-label="Start over" onClick={() => { setFills({}); setStrokes([]); onArt({ fills: {}, strokes: [] }); }}
          style={{ background: 'none', border: 'none', padding: 6, margin: '0 0 0 -10px', cursor: 'pointer', color: C.green, lineHeight: 0 }}>
          <svg viewBox="0 0 24 24" width="32" height="32" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.6-5.9M20 4v5h-5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <h1 className="edu-rainbow" style={{ fontSize: 20, margin: 0, textAlign: 'center', textTransform: 'capitalize', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pictureTitle(picture)}</h1>
        <button type="button" aria-label="Close coloring" onClick={onClose}
          style={{ background: 'none', border: 'none', padding: 6, margin: '0 -10px 0 0', cursor: 'pointer', color: C.green, lineHeight: 0 }}>
          <svg viewBox="0 0 24 24" width="32" height="32" aria-hidden="true"><path d="M5 5 L19 19 M19 5 L5 19" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" /></svg>
        </button>
      </div>
      {typeof secondsLeft === 'number' && (
        <div className="edu-pad-bar edu-pad-col" style={{ margin: '8px auto 12px' }}>
          <div style={{ height: 14, borderRadius: 999, background: C.line, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.max(0, (secondsLeft / total) * 100)}%`, background: `linear-gradient(90deg, ${CRAYONS[0]}, ${CRAYONS[3]}, ${CRAYONS[4]})`, transition: 'width 1s linear' }} />
          </div>
        </div>
      )}
      <div className="edu-picture edu-pad-col" style={{ position: 'relative', margin: '0 auto' }}>
      <svg ref={svgRef} viewBox={`${view.x} ${view.y} ${span} ${spanY}`} role="img" aria-label={`A ${picture} to color`}
        onPointerDown={start} onPointerMove={move} onPointerUp={stop} onPointerLeave={stop}
        style={{ width: '100%', aspectRatio: `1 / ${tall}`, display: 'block', background: '#fff', border: `2px solid ${C.line}`, borderRadius: 16, clipPath: 'inset(0 round 15px)', touchAction: freeDraw ? 'none' : 'auto' }}>
        {/* The square behind the picture is colorable too: a sky, a wall, whatever they decide it is. */}
        <rect x="-60" y="-60" width="220" height="220" fill={fills.bg || '#FFFFFF'} onClick={freeDraw ? undefined : () => setFills((f) => ({ ...f, bg: crayon }))} style={{ cursor: freeDraw ? 'default' : 'pointer' }} />
        {/* The name, drawn once, white letters with their outline behind them. This is the drawing
            Mikey approved: one element, no spacing of our own, no second copy over the ink. */}
        {picture === 'my-name' && (() => { const n = nameLines(name); return n.lines.map((line, i) => (
          <text key={line + i} x="50" y={n.y(i)} textAnchor="middle" fontFamily={FONT} fontSize={n.size} fontWeight="700" fill="#FFFFFF" stroke="#2E2E2E" strokeWidth={n.size * 0.055} paintOrder="stroke" strokeLinejoin="round" pointerEvents="none">{line}</text>
        )); })()}
        {parts.map((p, i) => {
          const common = p.line
            ? { key: i, fill: 'none', stroke: '#2E2E2E', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', pointerEvents: 'none' }
            : { key: i, fill: fills[i] || '#FFFFFF', stroke: '#2E2E2E', strokeWidth: 1.6, strokeLinejoin: 'round', style: { cursor: freeDraw ? 'default' : 'pointer' }, onClick: freeDraw ? undefined : () => setFills((f) => ({ ...f, [i]: crayon })) };
          if (p.t === 'art') return <ArtPart key={i} p={p} />;
          if (p.t === 'text') { const g = letterPath(p); return g ? <path {...common} stroke={freeDraw ? 'none' : '#2E2E2E'} d={g.d} transform={g.transform} paintOrder="stroke" strokeWidth={1.5 / g.s} strokeLinejoin="round" /> : <text {...common} stroke={freeDraw ? 'none' : '#2E2E2E'} x={p.x} y={p.y} fontSize={p.size} fontFamily={FONT} fontWeight={400} textAnchor="middle" dominantBaseline="central" paintOrder="stroke" strokeWidth={3.6}>{p.text}</text>; }
        if (p.t === 'circle') return <circle {...common} cx={p.cx} cy={p.cy} r={p.r} />;
          if (p.t === 'ellipse') return <ellipse {...common} cx={p.cx} cy={p.cy} rx={p.rx} ry={p.ry} />;
          if (p.t === 'rect') return <rect {...common} x={p.x} y={p.y} width={p.width} height={p.height} rx={2} />;
          if (p.t === 'path') return <path {...common} d={p.d} />;
        return <polygon {...common} points={p.points} />;
        })}
        {picture === 'my-name' && (() => { const n = nameLines(name); return (
          <mask id="edu-name-guard" maskUnits="userSpaceOnUse" x="-60" y="-60" width="220" height="220">
            <rect x="-60" y="-60" width="220" height="220" fill="#FFFFFF" />
            {n.lines.map((line, i) => (
              <text key={`guard-${i}`} x="50" y={n.y(i)} textAnchor="middle" fontFamily={FONT} fontSize={n.size} fontWeight="700" fill="#FFFFFF" stroke="#000000" strokeWidth={n.size * 0.055} paintOrder="stroke" strokeLinejoin="round">{line}</text>
            ))}
          </mask>
        ); })()}
        {/* On a drawing page the ink is kept off every outline by a mask: the lines are drawn once, under
            the color, and stay visible because the color cannot land on them. The name page has its own
            guard that keeps the whole name clear. */}
        {freeDraw && picture !== 'my-name' && (
          <mask id="edu-edge-guard" maskUnits="userSpaceOnUse" x="-60" y="-60" width="220" height="220">
            <rect x="-60" y="-60" width="220" height="220" fill="#FFFFFF" />
            {parts.map((p, i) => {
              // The band is the drawn outline plus a hair, so no white shows around the lines. The glyph must match the visible one exactly: same weight, same size.
              const band = { key: `band-${i}`, fill: 'none', stroke: '#000000', strokeWidth: p.t === 'text' ? 4 : 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
              if (p.t === 'text' || p.t === 'art') return null;   // letters and art pages are not guarded
              if (p.t === 'circle') return <circle {...band} cx={p.cx} cy={p.cy} r={p.r} />;
              if (p.t === 'ellipse') return <ellipse {...band} cx={p.cx} cy={p.cy} rx={p.rx} ry={p.ry} />;
              if (p.t === 'rect') return <rect {...band} x={p.x} y={p.y} width={p.width} height={p.height} rx={2} />;
              if (p.t === 'path') return <path {...band} d={p.d} />;
              return <polygon {...band} points={p.points} />;
            })}
          </mask>
        )}
        <g mask={picture === 'my-name' ? 'url(#edu-name-guard)' : freeDraw ? 'url(#edu-edge-guard)' : undefined} style={parts.some((p) => p.t === 'art') ? { mixBlendMode: 'multiply' } : undefined}>
          {strokes.map((st, i) => <polyline key={`s${i}`} points={st.points.map((pt) => pt.join(',')).join(' ')} fill="none" stroke={st.colour} strokeWidth={st.width || 5} strokeLinecap="round" strokeLinejoin="round" pointerEvents="none" />)}
        </g>
        {/* Letters: the outline is drawn once, over the ink, at normal weight, so the line is never
            buried and never doubled. The body underneath is plain white and takes the color. */}
        {freeDraw && parts.map((p, i) => (p.t === 'text'
          ? (() => { const g = letterPath(p); return g ? <path key={`edge-${i}`} d={g.d} transform={g.transform} fill="none" stroke="#2E2E2E" strokeWidth={1.5 / g.s} strokeLinejoin="round" pointerEvents="none" /> : <text key={`edge-${i}`} x={p.x} y={p.y} fontSize={p.size} fontFamily={FONT} fontWeight={400} textAnchor="middle" dominantBaseline="central" fill="none" stroke="#2E2E2E" strokeWidth={3.6} strokeLinejoin="round" pointerEvents="none">{p.text}</text>; })()
          : null))}

      </svg>
      {/* Zoom sits in the picture's own corners, over the top: color goes behind it, never onto it. */}
      {[['−', -1, { left: 10 }], ['+', 1, { right: 10 }]].map(([label, dir, side]) => {
        const off = (dir < 0 && zoom === ZOOMS[0]) || (dir > 0 && zoom === ZOOMS[ZOOMS.length - 1]);
        return (
          <button key={label} type="button" disabled={off} aria-label={dir < 0 ? 'Zoom out' : 'Zoom in'} className={dir < 0 && zoom > 1 ? 'edu-zoom-back' : undefined}
            onClick={() => changeZoom(dir)}
            style={{ position: 'absolute', bottom: 10, ...side, width: 46, height: 46, borderRadius: 999, background: '#FFFFFF', border: '3px solid #2E2E2E', color: '#2E2E2E', fontFamily: FONT, fontSize: 26, fontWeight: 700, lineHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: off ? 'default' : 'pointer', opacity: off ? 0.35 : 1 }}>{label}</button>
        );
      })}
      {/* Zoomed in, a small arrow appears on each edge that still has picture beyond it, and nowhere else. */}
      {zoom > 1 && [
        ['Move up', 0, -1, { top: 6, left: '50%', transform: 'translateX(-50%)' }, 'M12 8 L18 16 L6 16 Z', view.y > 0],
        ['Move down', 0, 1, { bottom: 6, left: '50%', transform: 'translateX(-50%)' }, 'M12 16 L6 8 L18 8 Z', view.y < limit],
        ['Move left', -1, 0, { left: 6, top: '50%', transform: 'translateY(-50%)' }, 'M8 12 L16 6 L16 18 Z', view.x > 0],
        ['Move right', 1, 0, { right: 6, top: '50%', transform: 'translateY(-50%)' }, 'M16 12 L8 18 L8 6 Z', view.x < limit],
      ].filter(([, , , , , can]) => can).map(([label, dx, dy, side, d]) => (
        <button key={label} type="button" aria-label={label} onClick={() => nudge(dx, dy)}
          style={{ position: 'absolute', ...side, width: 34, height: 34, borderRadius: 999, background: 'rgba(255,255,255,0.86)', border: '2px solid #2E2E2E', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d={d} fill="#2E2E2E" /></svg>
        </button>
      ))}
      </div>
      {/* The crayons sit under the picture; on a wide screen they run the width of the card and the
          nibs stand in a column beside the picture, so nothing needs scrolling to reach. */}
      <div className={`edu-crayons${freeDraw ? '' : ' edu-crayons-all'}`}>
        {[...CRAYONS, ...WIDE_CRAYONS, EXTRA_CRAYON].map((colour, i) => (
          <button key={colour} type="button" className={`edu-crayon${i >= CRAYONS.length + WIDE_CRAYONS.length ? ' edu-crayon-wide' : i >= CRAYONS.length ? ' edu-wide-only' : ''}`} aria-label="Use this color" aria-pressed={crayon === colour && !eraser} onClick={() => { setCrayon(colour); setEraser(null); }}
            style={{ background: colour, border: crayon === colour ? `4px solid ${C.ink}` : `2px solid ${C.line}` }} />
        ))}
        {letterSay && <div style={{ flexBasis: '100%', gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', marginTop: 4 }}><SpeakButton mini text={letterSay} label="Say the letters again" /></div>}
      </div>
      {freeDraw && (
        <div className="edu-nibs">
          {NIBS.map((w, i) => (
            <button key={w} type="button" className={`edu-nib${PHONE_NIBS.includes(w) ? '' : ' edu-wide-only'}`} aria-label={`Line ${i + 1} of ${NIBS.length}`} aria-pressed={nib === w && !eraser} onClick={() => { setNib(w); setEraser(null); }}
              style={{ background: C.surface, border: nib === w && !eraser ? `3px solid ${C.ink}` : `2px solid ${C.line}` }}>
              <span style={{ display: 'block', width: Math.max(4, w * 4.5), height: Math.max(4, w * 4.5), borderRadius: 999, background: crayon }} />
            </button>
          ))}
        </div>
      )}
      {/* Four erasers stand to the right of a drawing picture on a wide screen, the mirror of the nibs. */}
      {freeDraw && (
        <div className="edu-erasers">
          {ERASERS.map((w, i) => (
            <button key={w} type="button" className="edu-nib edu-eraser" aria-label={`Eraser ${i + 1} of ${ERASERS.length}`} aria-pressed={eraser === w} onClick={() => setEraser(w)}
              style={{ background: C.surface, border: eraser === w ? `3px solid ${C.ink}` : `2px solid ${C.line}` }}>
              <span style={{ display: 'block', width: Math.max(6, w * 2.6), height: Math.max(6, w * 2.6), borderRadius: 4, background: '#FFFFFF', border: `2px solid ${C.ink}`, boxSizing: 'border-box' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
// A CSS animation starts when its element does, so a card that comes back after being opened
// would beat out of step with the rest. A negative delay, measured from when the page opened,
// drops it back into the same rhythm as everything else.
const PAGE_OPENED = typeof performance !== 'undefined' ? performance.now() : Date.now();
const inBeat = (seconds) => ({ animationDelay: `-${((((typeof performance !== 'undefined' ? performance.now() : Date.now()) - PAGE_OPENED) / 1000) % seconds).toFixed(2)}s` });
function InfoButton({ onClick, label, open = false }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} aria-expanded={open}
      style={{ background: open ? C.green : 'none', border: `1.5px solid ${C.green}`, color: open ? '#fff' : C.green, fontFamily: FONT, fontSize: 12, fontWeight: 700, lineHeight: '15px', width: 18, height: 18, borderRadius: 999, cursor: 'pointer', padding: 0, marginLeft: 8, verticalAlign: 'middle', flexShrink: 0 }}>i</button>
  );
}

// A small faint sphere on each side of the logo, shown only on large screens, so the
// logo does not sit alone in a wide empty band. Drawn from the same arc geometry.
function FlankSphere({ side }) {
  const arcs = LOGO.arcs.filter((a, i) => i % 3 === 0).slice(0, 12);
  return (
    <svg className="edu-flank" viewBox="0 0 320 280" width="120" height="105" aria-hidden="true" style={{ opacity: 0.32, transform: side === 'left' ? 'rotate(-14deg)' : 'rotate(14deg) scaleX(-1)' }}>
      <g fill="none" strokeLinecap="round">{arcs.map((a, i) => <polyline key={i} points={a.points} stroke={a.gold ? C.gold : C.green} strokeWidth={a.width} strokeOpacity={0.55 + (i % 3) * 0.15} />)}</g>
    </svg>
  );
}

// A galaxy behind the logo on large screens: a field of faint stars in the site's own
// green and gold, and two long arms sweeping around the sphere, as if the logo were one
// world seen from a little way out. Positions come from a fixed seed so it is the same
// every time. Everything sits behind the logo and takes no taps.
// Two star fields from one seed: the full one for laptops and a lighter one for phones,
// where thousands of circles would slow the page and make the logo's own animation
// stutter. Only a small share of stars sparkle, and each sparkles once, after the logo
// has finished drawing itself, so the two animations never compete.
function buildGalaxy(scale) {
  const rng = makeRng(2026);
  const stars = [];
  const W = 1600; const H = 900; const cx = W / 2; const cy = H * 0.32;
  const nearLogo = (x, y) => Math.sqrt(((x - cx) / 235) ** 2 + ((y - cy) / 205) ** 2);
  const keepNearLogo = (x, y) => { const d = nearLogo(x, y); if (d >= 1) return true; if (d < 0.55) return rng() < 0.07; return rng() < 0.07 + ((d - 0.55) / 0.45) * 0.93; };
  const add = (x, y, bright) => {
    if (x < 0 || x > W || y < 0 || y > H) return;
    if (!keepNearLogo(x, y)) return;
    // A little thinner in the band just under the logo, which otherwise clots on wide screens.
    if (Math.abs(x - cx) < 420 && y > cy + 60 && y < cy + 300 && rng() < 0.4) return;
    if (scale === 1 && Math.abs(x - cx) < 320 && y < cy - 70 && y > cy - 300 && rng() < 0.3) return;
    // and quieter directly behind the logo, so the drawing stays the thing you look at
    stars.push({ x: x.toFixed(1), y: y.toFixed(1), r: (bright ? 0.9 + rng() * 1.8 : 0.35 + rng() * 1.0).toFixed(2), gold: rng() < 0.2, twinkle: rng() < 0.05, delay: (2.2 + rng() * 10).toFixed(2), dur: (1.6 + rng() * 2.4).toFixed(2), alpha: (bright ? 0.45 + rng() * 0.5 : 0.16 + rng() * 0.36).toFixed(2) });
  };
  for (let i = 0; i < Math.round(2600 * scale); i++) {
    const a = rng() * Math.PI * 2; const d = Math.pow(rng(), 1.5);
    add(cx + Math.cos(a) * d * W * 0.62, cy + Math.sin(a) * d * H * 0.62, rng() < 0.28 && d < 0.5);
  }
  for (let i = 0; i < Math.round(500 * scale); i++) add(rng() * W, rng() * H, false);
  // Two thick clouds to the left and right of the sphere, where the wide screen has room.
  for (const side of [-1, 1]) for (let i = 0; i < Math.round(5600 * scale); i++) {
    const a = rng() * Math.PI * 2; const d = Math.pow(rng(), 1.2);
    const x = cx + side * 600 + Math.cos(a) * d * 520; const y = cy + 30 + Math.sin(a) * d * 360;
    add(x, y, rng() < 0.3);
  }
  // A third knot, up and to the right of the left cloud, so the two do not sit in a flat line.
  for (let i = 0; i < Math.round(2100 * scale); i++) {
    const a = rng() * Math.PI * 2; const d = Math.pow(rng(), 1.25);
    add(cx - 330 + Math.cos(a) * d * 290, cy - 270 + Math.sin(a) * d * 210, rng() < 0.3);
  }
  // A dense ring just outside the logo, fading outward. Points that would land inside the
  // clear zone are dropped before they are added, so the logo keeps its quiet sky.
  for (let i = 0; i < Math.round(2400 * scale); i++) {
    const a = rng() * Math.PI * 2; const d = 1 + Math.pow(rng(), 1.3) * 1.6;
    const x = cx + Math.cos(a) * 250 * d; const y = cy + Math.sin(a) * 210 * d;
    add(x, y, rng() < 0.3);
  }
  const along = (p0, p1, p2, p3, n) => { for (let i = 0; i < n; i++) { const t = rng(); const u = 1 - t; const x = u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0]; const y = u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]; add(x + (rng() - 0.5) * 70, y + (rng() - 0.5) * 50, rng() < 0.35); } };
  along([cx, cy], [cx + 150, cy - 240], [cx + 620, cy - 300], [W + 60, cy + 120], Math.round(220 * scale));
  along([cx, cy], [cx - 150, cy + 240], [cx - 620, cy + 300], [-60, cy - 120], Math.round(220 * scale));
  along([cx, cy], [cx - 240, cy - 120], [cx - 520, cy - 380], [cx - 300, -60], Math.round(120 * scale));
  along([cx, cy], [cx + 240, cy + 120], [cx + 520, cy + 380], [cx + 300, H + 60], Math.round(120 * scale));
  return { stars, W, H };
}
const GALAXY_FULL = buildGalaxy(1);
const GALAXY_LIGHT = buildGalaxy(0.32);
// Thousands of stars as thousands of elements made the page stagger. The faint dust is
// now drawn as a handful of paths, one per dot size, each holding hundreds of dots; only
// the brighter stars are their own circles, and only some of those sparkle.
const GALAXY_DRAWN = { full: null, light: null };
function galaxyLayers(g) {
  const bright = g.stars.filter((st) => Number(st.r) >= 1.7);
  const dust = g.stars.filter((st) => Number(st.r) < 1.7);
  const buckets = {};
  for (const st of dust) {
    const key = `${st.gold ? 'g' : 'n'}${(Math.round(Number(st.r) * 4) / 4).toFixed(2)}`;
    (buckets[key] = buckets[key] || { gold: st.gold, r: Number(st.r), d: [] }).d.push(`M${st.x} ${st.y}h0.01`);
  }
  return { bright, dust: Object.values(buckets).map((b) => ({ ...b, d: b.d.join('') })) };
}
function Galaxy() {
  const light = typeof window !== 'undefined' && window.innerWidth < 1000;
  const g = light ? GALAXY_LIGHT : GALAXY_FULL;
  const key = light ? 'light' : 'full';
  const layers = GALAXY_DRAWN[key] || (GALAXY_DRAWN[key] = galaxyLayers(g));
  return (
    <svg className="edu-galaxy" viewBox={`0 0 ${g.W} ${g.H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {layers.dust.map((b, i) => (
        <path key={`d${i}`} d={b.d} fill="none" stroke={b.gold ? C.gold : C.green} strokeWidth={b.r * 2} strokeLinecap="round" strokeOpacity="0.32" />
      ))}
      {layers.bright.map((st, i) => (
        <circle key={i} cx={st.x} cy={st.y} r={st.r} fill={st.gold ? C.gold : C.green} opacity={st.alpha}
          className={st.twinkle && !light ? 'edu-twinkle-star' : undefined} style={st.twinkle && !light ? { animationDelay: `${st.delay}s`, animationDuration: `${st.dur}s` } : undefined} />
      ))}
    </svg>
  );
}

// The arcs that fill the edges of a wide screen. Hidden on anything narrower than a
// laptop, never in the way of a tap, and drawn once with no animation.
function SideArcs({ side }) {
  return (
    <svg className={`edu-side edu-side-${side}`} viewBox="0 0 240 900" preserveAspectRatio="xMinYMid slice" aria-hidden="true">
      <g fill="none" stroke={C.green} strokeLinecap="round">
        <path pathLength="1" d="M-40 120 C 120 220, 120 420, -40 520" strokeWidth="2.2" strokeOpacity="0.55" />
        <path pathLength="1" d="M-60 260 C 160 360, 160 560, -60 660" strokeWidth="1.6" strokeOpacity="0.4" style={{ animationDelay: '0.2s' }} />
        <path pathLength="1" d="M-30 420 C 200 520, 200 720, -30 820" strokeWidth="2.6" strokeOpacity="0.35" style={{ animationDelay: '0.4s' }} />
        <path pathLength="1" d="M-70 40 C 90 120, 90 300, -70 380" strokeWidth="1.4" strokeOpacity="0.3" style={{ animationDelay: '0.6s' }} />
        <path pathLength="1" d="M-50 600 C 140 680, 140 860, -50 940" strokeWidth="1.8" strokeOpacity="0.45" style={{ animationDelay: '0.8s' }} />
        <path pathLength="1" d="M60 180 C 150 260, 150 380, 60 460" strokeWidth="1.2" stroke={C.gold} strokeOpacity="0.5" style={{ animationDelay: '1.1s' }} />
      </g>
    </svg>
  );
}

// The stylesheet rides along with the frame, so every screen has the animations.
let PAGE_STARS = null;
function PageStars() {
  if (!PAGE_STARS) {
    // Stars fizzle out toward the middle rather than stopping at a line: full density at the
    // edges of the content column, a faint scatter behind the text. The choice per star is a
    // fixed hash of its position, so the sky is the same on every visit.
    const keep = (st) => {
      const x = Number(st.x); const y = Number(st.y);
      const t = Math.min(1, Math.abs(x - 800) / 560);
      const chance = 0.42 + 0.58 * Math.pow(t, 1.4);
      const h = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1;
      return h < chance;
    };
    const layers = galaxyLayers({ stars: GALAXY_FULL.stars.filter(keep) });
    PAGE_STARS = layers;
  }
  return (
    <svg className="edu-page-stars" viewBox={`0 0 ${GALAXY_FULL.W} ${GALAXY_FULL.H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {PAGE_STARS.dust.map((b, i) => <path key={`d${i}`} d={b.d} fill="none" stroke={b.gold ? C.gold : C.green} strokeWidth={b.r * 2} strokeLinecap="round" strokeOpacity="0.32" />)}
      {PAGE_STARS.bright.map((st, i) => <circle key={i} cx={st.x} cy={st.y} r={st.r} fill={st.gold ? C.gold : C.green} opacity={st.alpha} />)}
    </svg>
  );
}

const EDUCATOR_IDLE_MS = 60 * 1000; // an educator stays signed in for a quiet minute; the chip counts the whole minute down as a reminder not to hand the device over too soon

function PageChrome({ idleWarning = false, stars = true, logoutIn = null, walkthrough = false }) {
  return (
    <>
      <style>{WONDER_ANIMATION + PRINT_STYLES + KID_ANIMATION}</style>
      <div className="edu-frame" style={frame} aria-hidden="true" />
      <div className="edu-frame-bottom" aria-hidden="true" />
      {stars && <PageStars />}
      {/* While an educator is signed in, a small chip counts down to sign-out on every screen. Moving the mouse, typing or clicking resets it to sixty. */}
      {logoutIn !== null && (
        <div role="status" className="edu-no-print edu-logout-chip" style={{ position: 'fixed', bottom: 12, right: 12, zIndex: 60, background: logoutIn <= 10 ? '#24291F' : 'rgba(36, 41, 31, 0.72)', color: '#fff', borderRadius: 999, padding: '6px 12px', fontFamily: FONT, fontSize: 13, fontWeight: 600, pointerEvents: 'none' }}>
          Logging out in {logoutIn}
        </div>
      )}
      {/* A walk-through says so in the same quiet way, bottom left, on every screen. */}
      {walkthrough && (
        <div role="status" className="edu-no-print" style={{ position: 'fixed', bottom: 12, left: 12, zIndex: 60, background: 'rgba(36, 41, 31, 0.72)', color: '#fff', borderRadius: 999, padding: '6px 12px', fontSize: 13, fontFamily: FONT }}>
          Walkthrough Mode
        </div>
      )}
      {/* Quiet great-circle arcs at the edges of a wide screen, like the logo's. */}
      <SideArcs side="left" />
      <SideArcs side="right" />
      {idleWarning && logoutIn === null && (
        <div role="status" className="edu-no-print edu-rise" style={{ position: 'fixed', left: 12, right: 12, bottom: 16, zIndex: 60, background: '#24291F', color: '#fff', borderRadius: 12, padding: '12px 16px', fontFamily: FONT, fontSize: 15, textAlign: 'center' }}>
          You will be logged out in a few seconds due to inactivity. Tap anywhere to stay.
        </div>
      )}
    </>
  );
}

function Tag({ children, tone }) {
  const tones = { mastered: [C.goldSoft, C.gold], passed: [C.goldSoft, C.gold], available: [C.greenSoft, C.green], locked: ['#EEF0EA', C.muted], review: [C.claySoft, C.clay] };
  const [bg, fg] = tones[tone] || tones.locked;
  return <span style={{ display: 'inline-block', background: bg, color: fg, fontSize: 13, fontWeight: 600, lineHeight: '18px', padding: '4px 10px', borderRadius: 999, whiteSpace: 'nowrap', textAlign: 'center' }}>{children}</span>;
}

function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

// ---------- Storage helpers (all reads/writes go through these) ----------
// Rules: keys use only letters, numbers and underscores; every save is also kept
// in memory for the session, so a failed save never breaks the lesson; a failed
// save is retried once after a short pause (the storage API is rate limited).
const STORE_PREFIX = 'edusphere_v1_learner_';
const slug = (name) => name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
const sessionCopy = new Map();
const hasStorage = () => typeof window !== 'undefined' && window.storage && typeof window.storage.set === 'function';
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function storageGet(key) {
  if (sessionCopy.has(key)) return sessionCopy.get(key);
  if (!hasStorage()) return null;
  try {
    const r = await window.storage.get(key, false);
    return r && typeof r.value === 'string' ? r.value : null;
  } catch (e) { return null; } // a missing key throws; that just means "new learner"
}
async function storageDelete(key) {
  sessionCopy.delete(key);
  if (!hasStorage()) return { saved: false, reason: 'no storage on this page' };
  try { await window.storage.delete(key, false); return { saved: true }; } catch (e) { return { saved: false, reason: (e && e.message) || 'unknown error' }; }
}
async function storageSet(key, value) {
  sessionCopy.set(key, value);
  if (!hasStorage()) return { saved: false, reason: 'no storage on this page' };
  for (let tryNo = 1; tryNo <= 2; tryNo++) {
    try {
      const r = await window.storage.set(key, value, false);
      if (r) return { saved: true };
    } catch (e) {
      if (tryNo === 2) return { saved: false, reason: (e && e.message) || 'unknown error' };
    }
    await pause(600);
  }
  return { saved: false, reason: 'no response' };
}
async function loadRecord(name) {
  const raw = await storageGet(STORE_PREFIX + slug(name));
  if (raw) { try { return JSON.parse(raw); } catch (e) { /* fall through to a fresh record */ } }
  return { version: 1, name: name.trim(), createdAt: new Date().toISOString(), events: [] };
}
async function saveRecord(record) {
  return storageSet(STORE_PREFIX + slug(record.name), JSON.stringify(record));
}
// The roster lives under one key. Students never create themselves; an admin does.
const ROSTER_KEY = 'edusphere_v1_roster';
async function loadRoster() {
  const raw = await storageGet(ROSTER_KEY);
  if (raw) { try { const r = JSON.parse(raw); if (r && Array.isArray(r.students)) return r; } catch (e) { /* fall through */ } }
  return emptyRoster();
}
async function saveRoster(roster) { return storageSet(ROSTER_KEY, JSON.stringify(roster)); }

// Which life skills this classroom has covered. Nothing about any student is stored here.
const COVERED_KEY = 'edusphere_v1_covered_skills';
async function loadCovered() {
  const raw = await storageGet(COVERED_KEY);
  if (raw) { try { const c = JSON.parse(raw); if (c && Array.isArray(c.covered)) return c; } catch (e) { /* fall through */ } }
  return emptyCoveredSkills();
}
async function saveCovered(state) { return storageSet(COVERED_KEY, JSON.stringify(state)); }

// Which reflection questions this school has read and approved.
const WONDER_KEY = 'edusphere_v1_wonder_review';
async function loadWonderReview() {
  const raw = await storageGet(WONDER_KEY);
  if (raw) { try { const r = JSON.parse(raw); if (r && Array.isArray(r.approved)) return r; } catch (e) { /* fall through */ } }
  return emptyWonderReview();
}
async function saveWonderReview(state) { return storageSet(WONDER_KEY, JSON.stringify(state)); }

// When the classroom was last backed up to a file, so the app can nag gently.
const BACKUP_AT_KEY = 'edusphere_v1_last_backup';
async function loadBackupAt() { return (await storageGet(BACKUP_AT_KEY)) || null; }
async function saveBackupAt(at) { return storageSet(BACKUP_AT_KEY, at); }
// The educator's own PIN, kept on this device. A convenience lock rather than security,
// exactly as before, but now the educator chooses it. Stored scrambled so it is not
// sitting in plain sight in the browser's storage.
const EDUCATOR_KEY = 'edusphere_v1_educator';
function scramble(text) { let h = 5381; for (const ch of String(text)) h = ((h * 33) ^ ch.charCodeAt(0)) >>> 0; return String(h); }
async function loadEducator() { const raw = await storageGet(EDUCATOR_KEY); if (raw) { try { const p = JSON.parse(raw); return p && p.pin ? p : null; } catch (e) { /* fall through */ } } return null; }
async function loadEducatorRaw() { const raw = await storageGet(EDUCATOR_KEY); if (raw) { try { return JSON.parse(raw); } catch (e) { /* fall through */ } } return null; }
async function saveEducator(profile) { return storageSet(EDUCATOR_KEY, JSON.stringify(profile)); }
// Fingerprint or face for the educator, through the browser's own passkey door (WebAuthn) with the
// device's built-in authenticator. Nothing goes anywhere: the device makes a key pair, keeps the private
// half, and hands back an id that is stored with the educator account. Signing in later asks the device
// to verify the person for that id; a yes opens the door, the PIN stays as the other key. Needs a
// secure page (the real site or the installed app), so it never appears on a file or in a viewer.
const biometricReady = () => typeof window !== 'undefined' && window.isSecureContext && !!window.PublicKeyCredential;
const toB64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
const fromB64 = (str) => Uint8Array.from(atob(str), (ch) => ch.charCodeAt(0));
async function enrollBiometric() {
  const cred = await navigator.credentials.create({ publicKey: {
    challenge: crypto.getRandomValues(new Uint8Array(32)), rp: { name: 'EduSphere' },
    user: { id: crypto.getRandomValues(new Uint8Array(16)), name: 'educator', displayName: 'Educator' },
    pubKeyCredParams: [{ type: 'public-key', alg: -7 }, { type: 'public-key', alg: -257 }],
    authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required', residentKey: 'discouraged' }, timeout: 60000, attestation: 'none',
  } });
  return toB64(cred.rawId);
}
async function checkBiometric(id) {
  const cred = await navigator.credentials.get({ publicKey: { challenge: crypto.getRandomValues(new Uint8Array(32)), allowCredentials: [{ type: 'public-key', id: fromB64(id) }], userVerification: 'required', timeout: 60000 } });
  return !!cred;
}
const DEVICE_KEY = 'edusphere_v1_device_name';
const QUICK_KEY = 'edusphere_v1_quickchecks';
async function loadQuickChecks() { return (await storageGet(QUICK_KEY)) !== 'off'; }
async function saveQuickChecks(on) { return storageSet(QUICK_KEY, on ? 'on' : 'off'); }
const STATE_KEY = 'edusphere_v1_state';
async function loadStateCode() { return (await storageGet(STATE_KEY)) || ''; }
async function saveStateCode(c) { return storageSet(STATE_KEY, c); }
async function loadDeviceName() { return (await storageGet(DEVICE_KEY)) || ''; }
async function saveDeviceName(n) { return storageSet(DEVICE_KEY, n); }

// Everything on this device, gathered for a backup file.
async function gatherEverything(roster) {
  const records = [];
  for (const st of roster.students) { const r = await loadRecord(st.id); if (r.events.length) records.push(r); }
  return { roster, records, wonderReview: await loadWonderReview(), covered: await loadCovered() };
}

// Some browsers (Chrome, Edge, Chromebooks) let a page keep writing to a file the person
// chose once. When that is available, the classroom backup rewrites itself after every
// finished practice round, so the record on disk is never more than one round behind.
// iPads do not allow it; there, Share and Download are the way. Nothing is sent anywhere.
// Automatic backups go to the device's downloads folder without asking: when a student signs out, on
// the first sign-in of each day, and when a course is finished. Only the newest file is ever needed;
// older ones can be deleted. A browser cannot save a file as it closes, so the sign-out is the last
// chance, and nothing is lost either way: every step is already in the browser's own storage.
// Chrome and Edge on a computer can also keep ONE file up to date after every practice round
// (`backupFile`), so the downloads folder never fills up there.
function plainDownload(name, text) {
  if (typeof document === 'undefined') return false;
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return true;
}

// Hands the browser a file to download. Works in every browser; nothing is sent anywhere.
async function downloadFile(name, text) {
  if (typeof document === 'undefined') return false;
  // Chrome and Edge on a laptop can ask where to save. Other browsers save to their downloads folder.
  if (typeof window !== 'undefined' && window.showSaveFilePicker) {
    try {
      const handle = await window.showSaveFilePicker({ suggestedName: name, types: [{ description: 'EduSphere backup', accept: { 'application/json': ['.json'] } }] });
      const w = await handle.createWritable(); await w.write(text); await w.close();
      return true;
    } catch (err) { if (err && err.name === 'AbortError') return 'canceled'; /* fall through to a plain download */ }
  }
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return true;
}

// ---------- The app ----------
export default function EduSphereApp() {
  const [screen, setScreen] = useState('loading');
  const [nameInput, setNameInput] = useState('');
  const [roster, setRoster] = useState(emptyRoster());
  const [rosterInput, setRosterInput] = useState('');         // the ID box on the roster screen
  const [renamingId, setRenamingId] = useState(null);
  const [renameInput, setRenameInput] = useState('');
  const [mergeFrom, setMergeFrom] = useState('');
  const [rosterError, setRosterError] = useState('');
  const [showRosterTip, setShowRosterTip] = useState(false);
  const [newLevel, setNewLevel] = useState('');                // starting level chosen while adding
  const [newStartGrade, setNewStartGrade] = useState('');      // the grade to start at, chosen after the level
  const [newPicture, setNewPicture] = useState('');            // picture chosen while adding (early years only)
  const [newTint, setNewTint] = useState('');
  const [pictureFor, setPictureFor] = useState(null);          // student whose picture is being changed
  const [wizardPin, setWizardPin] = useState('');            // optional PIN typed while adding
  const [wizardWonder, setWizardWonder] = useState(true);    // Wonder questions on for the student being added
  const [showWonderWhy, setShowWonderWhy] = useState(false);   // the i beside the Wonder switch
  const [pinFor, setPinFor] = useState(null);                  // student whose PIN is being set on their card
  const [wonderPopupFor, setWonderPopupFor] = useState(null);            // student whose Wonder Questions popup is open
  const [showPinWhy, setShowPinWhy] = useState(false);         // the i beside PIN (optional) in the add-student popup
  const [showAutoTip, setShowAutoTip] = useState(false);       // the i under the automatic backups list
  const [pinDraft, setPinDraft] = useState('');
  const [pinAsk, setPinAsk] = useState(null);                  // sign-in: the student whose PIN is being asked for
  const [pinTry, setPinTry] = useState('');
  const [pinWrong, setPinWrong] = useState(false);
  // My Classroom: press and hold a card, then drag it to a new place. The order is kept on the roster.
  const [dragId, setDragId] = useState(null);                  // the student card being dragged
  const [dragOver, setDragOver] = useState(null);              // the row index it is held over
  const dragTimer = useRef(null); const dragStart = useRef(null); const cardEls = useRef(new Map());
  const dragY = useRef(null);                                  // where the finger is while a card is held
  useEffect(() => {
    if (!dragId || typeof document === 'undefined') return undefined;
    const stop = (e) => e.preventDefault();   // the page must not scroll under a dragged card
    document.addEventListener('touchmove', stop, { passive: false });
    // Near the top or bottom edge the page creeps along on its own, so the card can reach any row.
    let raf = 0; const creep = () => { const y = dragY.current; if (y !== null) { const h = window.innerHeight; if (y < 90) window.scrollBy(0, -Math.ceil((90 - y) / 6)); else if (y > h - 90) window.scrollBy(0, Math.ceil((y - (h - 90)) / 6)); } raf = requestAnimationFrame(creep); };
    raf = requestAnimationFrame(creep);
    return () => { document.removeEventListener('touchmove', stop); cancelAnimationFrame(raf); dragY.current = null; };
  }, [dragId]);
  const [backupAt, setBackupAt] = useState(null);              // when this device was last backed up
  const [backupNote, setBackupNote] = useState('');
  const [showBackupTip, setShowBackupTip] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [deviceDraft, setDeviceDraft] = useState('');
  const [educator, setEducator] = useState(null);                 // the educator profile on this device, if one has been created
  const [newPin, setNewPin] = useState('');
  const [newPin2, setNewPin2] = useState('');
  const [setupError, setSetupError] = useState('');
  const [showStateTip, setShowStateTip] = useState(false);
  const [showPinTip, setShowPinTip] = useState(false);              // the i beside Choose a PIN
  const [startOverArmed, setStartOverArmed] = useState(false);      // the start-over link asks once before it acts
  const [showBackupWhat, setShowBackupWhat] = useState(false);      // the i beside Backup classroom
  const [storyRows, setStoryRows] = useState(null);                 // the story log: every active student with their events
  const [storyView, setStoryView] = useState({});                   // per student: 'recent' (default), 'read' or 'unread'
  const [openStoryId, setOpenStoryId] = useState(null);             // the story open in its own window on the story log
  const [showStoryWhy, setShowStoryWhy] = useState(false);          // the i on the story log
  const [storyExpanded, setStoryExpanded] = useState({});           // per student: the long list is fully shown
  const [openStoryFor, setOpenStoryFor] = useState(null);           // which student the open story belongs to
  const [forgotPin, setForgotPin] = useState(false);
  const [pendingProfile, setPendingProfile] = useState(null);      // carried through a reset so the recovery code survives
  const [typedCode, setTypedCode] = useState('');
  const [showContact, setShowContact] = useState(false);
  const [showWonderTip, setShowWonderTip] = useState(false);
  const [showHelpTip, setShowHelpTip] = useState(false);
  const [showProTip, setShowProTip] = useState(false);
  const [showRecommendTip, setShowRecommendTip] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);           // the hidden student whose deletion is being confirmed
  const [backupNudgeSeen, setBackupNudgeSeen] = useState(false);       // the first-backup popup shows once per session
  const [openResourceGrades, setOpenResourceGrades] = useState([]); // which grade folds are open on the resource pages
  const [placementWalk, setPlacementWalk] = useState(null);           // { subject, grades, cleared } while a placement check runs
  const [placementResult, setPlacementResult] = useState(null);       // what the last placement check decided
  const [quickResult, setQuickResult] = useState(null);               // what the last quick check decided
  const [showProgressTip, setShowProgressTip] = useState(false);
  const [openSummary, setOpenSummary] = useState(true);
  const [openAssigned, setOpenAssigned] = useState(false);
  const [openProgress, setOpenProgress] = useState(false);
  const [openTerms, setOpenTerms] = useState([]);
  const [openApproved, setOpenApproved] = useState([]);
  const [openProgressGroups, setOpenProgressGroups] = useState([]);
  const [openMapGroups, setOpenMapGroups] = useState([]);           // the standards map's dropdowns, closed until opened
  const [openMapHeads, setOpenMapHeads] = useState([]);             // the standards map's grade (or subject) headings, closed until opened
  const [mapOrder, setMapOrder] = useState('grade');                // the standards map: grouped by grade, or by subject
  const [classFilter, setClassFilter] = useState('all');            // who needs help: everyone, or only the flagged, or only missed quick checks
  const [noteSearch, setNoteSearch] = useState('');                  // who needs help: find students by what you wrote about them
  const [showQuickTip, setShowQuickTip] = useState(false);           // the quick checks explanation on the Classroom page
  const [showOrderTip, setShowOrderTip] = useState(false);           // who needs help: how ties are ordered
  const [showPlacedTip, setShowPlacedTip] = useState(false);         // transcript: placed past and skipped by quick check
  const [otherKind, setOtherKind] = useState('core');               // other courses: core or electives
  const [openOtherGrades, setOpenOtherGrades] = useState([]);        // other courses: which grade dropdowns are open
  const [openDoneGrades, setOpenDoneGrades] = useState([]);          // transcript: which completed-course grades are open
  const [mapKind, setMapKind] = useState('core');                   // the standards map, by grade: core courses or electives
  const [quickChecks, setQuickChecks] = useState(true);             // may a student skip a module by passing five questions?
  const [coloring, setColoring] = useState(null);                    // the picture being colored, when the coloring screen is up
  // A coloring break lasts five minutes. The bar empties, then the courses come back; a student
  // can leave earlier with the button, and start the picture over as often as they like.
  const [showRequirements, setShowRequirements] = useState(false);   // a writing assignment's requirements popup
  const [storyOpen, setStoryOpen] = useState(false);                // the story fold under a lesson's key idea
  const [certFor, setCertFor] = useState(null);                    // { id, grade } while the certificate screen is open
  const [certTemplate, setCertTemplate] = useState('classic');
  const [certName, setCertName] = useState('');                    // the name the educator types for the sheet; kept only in memory
  const [certPhotos, setCertPhotos] = useState([]);                // data URLs for the sheet; never saved anywhere by the app
  const [certNote, setCertNote] = useState('');
  const [certLang, setCertLang] = useState('en');                  // English or Spanish on the sheet
  const [missed, setMissed] = useState({});
  const [anotherWay, setAnotherWay] = useState(0);              // the example's second explanation, when the lesson has one                        // moduleId -> lesson sentences behind answers missed this session (memory only)
  const news = typeof window !== 'undefined' && window.__eduNews && window.__eduNews.items && window.__eduNews.items.length ? window.__eduNews : null;
  const [newsOpen, setNewsOpen] = useState(false);
  const [tourCardAt, setTourCardAt] = useState('bottom');           // the tour sheet sits opposite its target
  const [tourStep, setTourStep] = useState(-1);                    // -1 closed; 0 to 4 the card showing
  const [readyGrades, setReadyGrades] = useState({});              // studentId -> grades completed in full, read on the welcome screen
  const certSheetRef = useRef(null);
  const [bioNote, setBioNote] = useState('');                        // what the fingerprint or face step said last
  const [noteFocus, setNoteFocus] = useState(false);
  const [showNoteWhy, setShowNoteWhy] = useState(false);            // the i beside Notes
  const [weeklyEdit, setWeeklyEdit] = useState(null);               // the weekly note's text once the educator has edited it (memory only)
  const [weeklyEditing, setWeeklyEditing] = useState(false);        // the note box is open
  const [reportOpenedFrom, setReportOpenedFrom] = useState(null);   // the previous visit's time, kept for this opening only
  const [wrongWay, setWrongWay] = useState(false);                  // the other explanation, opened on a wrong answer                 // the note box has the cursor, so its example text steps aside
  const [showRecTip, setShowRecTip] = useState(false);               // the i beside the recommendations line on the report
  const [showNoteTip, setShowNoteTip] = useState(false);             // what a note is for, under the note box
  const [editingNote, setEditingNote] = useState(null);              // the note being rewritten: { id, text }
  const [printing, setPrinting] = useState(false);                   // true while the report prints, so every course fold opens with its stories
  useEffect(() => { if (typeof window === 'undefined' || !window.matchMedia) return undefined; const before = () => setPrinting(true); const after = () => setPrinting(false); window.addEventListener('beforeprint', before); window.addEventListener('afterprint', after); return () => { window.removeEventListener('beforeprint', before); window.removeEventListener('afterprint', after); }; }, []);
  const returnTo = useRef(null);                                     // { screen, scrollY } to go back to after Change state or a PIN unlock
  const goBackTo = () => { const r = returnTo.current; returnTo.current = null; if (r) { pendingScroll.current = r.scrollY; setScreen(r.screen); } else setScreen('educator-pick'); };
  const pendingScroll = useRef(null);
  const rememberHere = () => { returnTo.current = { screen, scrollY: typeof window !== 'undefined' ? window.scrollY : 0 }; };
  const closeTips = () => { setRestoreNote(''); setShowBackupTip(false); setShowRosterTip(false); setShowStateTip(false); setShowWonderTip(false); setShowProgressTip(false); setShowHelpTip(false); setShowProTip(false); setShowRecommendTip(false); setForgotPin(false); setSetupError(''); };
  const [stateCode, setStateCode] = useState('');                 // the educator's state, chosen once
  const [stateDraft, setStateDraft] = useState('');
  const [activeOpen, setActiveOpen] = useState(true);            // the Active students list, open by default
  const [hiddenOpen, setHiddenOpen] = useState(false);
  const [adding, setAdding] = useState(false);                   // the add-a-student popup
  const [classRows, setClassRows] = useState(null);              // the whole-class view, once loaded
  const [lastActive, setLastActive] = useState(0);               // when the educator last touched the screen
  const [idleWarning, setIdleWarning] = useState(false);
  const [openSubjects, setOpenSubjects] = useState([]);       // which subject panels are expanded on the report
  const [showAllCourses, setShowAllCourses] = useState(false); // optional courses on the educator report
  const [courseQuery, setCourseQuery] = useState('');           // the course search box on the report
  const [preparedBackup, setPreparedBackup] = useState(null);     // the backup text made ahead of a share, so the click shares at once
  const [shareRefused, setShareRefused] = useState(false);        // a browser that refused to share hides the button for this session
  const [restoreNote, setRestoreNote] = useState('');              // the outcome of a restore, shown inside the restore card
  const [heardNote, setHeardNote] = useState(false);               // the "on silent" note, once anything has been spoken on this screen
  onSpoke = () => setHeardNote(true);
  const [now, setNow] = useState(Date.now());                      // ticks each second while an educator is signed in, for the countdown
  const [autoBackupNote, setAutoBackupNote] = useState('');       // what the last automatic backup did
  useEffect(() => {
    if (screen !== 'backup') return;
    let alive = true;
    (async () => {
      const everything = await gatherEverything(roster);
      const at = new Date().toISOString();
      const text = JSON.stringify(buildBackup({ ...everything, deviceName, recovery: educator ? educator.recovery : null }, at), null, 2);
      if (alive) setPreparedBackup({ at, name: backupFileName(deviceName, activeStudents(roster).length, at), text });
    })();
    return () => { alive = false; };
  }, [screen, roster, deviceName, educator]);
  // Worked out once, when the report opens. Recalculating it on every change would reshuffle
  // the list under the educator's finger, so the next row slides into the place they just tapped.
  const [recommendedIds, setRecommendedIds] = useState([]);
  const [storyModule, setStoryModule] = useState(null);       // the module whose story is open in an overlay
  const [confirmModuleReset, setConfirmModuleReset] = useState(null);
  const [openSkills, setOpenSkills] = useState([]);            // which life skills are expanded
  const [covered, setCovered] = useState(emptyCoveredSkills()); // the classroom's own bookmark, never a child's record
  const [hideCovered, setHideCovered] = useState(false);
  const [openStages, setOpenStages] = useState([]);           // stages start closed, so the page opens as four rows
  const [wonderReview, setWonderReview] = useState(emptyWonderReview());
  // In a walk-through every wonder question counts as approved, so the educator sees what students would.
  const previewReview = () => (record && record.preview ? { ...wonderReview, approved: WONDER.map((w) => w.id), hidden: [] } : wonderReview);
  const [openWonder, setOpenWonder] = useState([]);
  const [openWonderStages, setOpenWonderStages] = useState([]);
  const [reviewing, setReviewing] = useState(null);           // the question open in the overlay
  const [openVoices, setOpenVoices] = useState([]);
  const [lessonStep, setLessonStep] = useState(0);            // which spoken line of a pre-reader lesson
  const [misses, setMisses] = useState(0);                    // wrong tries on the current question (pre-readers retry)
  const [wrongPicks, setWrongPicks] = useState([]);           // greyed within this question only; cleared with the next
  let renderModuleCard = null;
  const [wonderVoiceStep, setWonderVoiceStep] = useState(0);   // which spoken voice a young child is on
  const [tracePaths, setTracePaths] = useState([]);
  const [replays, setReplays] = useState(0);                          // "Say it again" replays the lesson picture too
  const [paceNudge, setPaceNudge] = useState(0);                      // Slower / Faster on a tracing demonstration: -1, 0 or 1 from the lesson's own pace
  const [noteInput, setNoteInput] = useState('');                     // a teacher note being written on the report
  const [ticks, setTicks] = useState([]);              // the self-check boxes ticked on a writing question           // the finger's path on a tracing question
  const [cheer, setCheer] = useState(0);                      // bumped to replay the celebration
  const [record, setRecord] = useState(null);      // { name, events, ... } for the current learner
  const [colorState, setColorState] = useState({});                  // per picture: seconds left, and when its rest ends
  const [colorLeft, setColorLeft] = useState(COLOR_BREAK_SECONDS);
  const [colorNow, setColorNow] = useState(Date.now());               // ticks while the overview is up, so a resting picture fills
  const colorArt = useRef({ fills: {}, strokes: [] });                // the colors on the picture open right now
  useEffect(() => { if (!record || !record.name) return; loadColorState(record.name).then(setColorState); }, [record && record.name]);
  useEffect(() => { if (screen !== 'overview') return undefined; const id = setInterval(() => setColorNow(Date.now()), 5000); return () => clearInterval(id); }, [screen]);
  useEffect(() => {
    if (screen !== 'coloring' || !coloring || !record) return undefined;
    const start = (colorState[coloring] || {}).left;
    setColorLeft(typeof start === 'number' ? start : COLOR_BREAK_SECONDS);
    const id = setInterval(() => setColorLeft((n) => {
      const next = n - 1;
      if (next <= 0) { // the five minutes are up: this picture rests, and the courses come back
        // The five minutes are up: the picture rests, and next time it starts blank again.
        const state = { ...colorState, [coloring]: { left: COLOR_BREAK_SECONDS, restUntil: Date.now() + COLOR_LOCKOUT_MINUTES * 60000, art: null } };
        setColorState(state); saveColorState(record.name, state);
        if (!record.preview && !coloring.startsWith('play:')) addEvent(makeColoredEvent(coloring, new Date().toISOString()));
        setColoring(null); setScreen('overview'); return COLOR_BREAK_SECONDS;
      }
      if (next % 5 === 0) { const state = { ...colorState, [coloring]: { ...(colorState[coloring] || {}), left: next, art: colorArt.current } }; setColorState(state); saveColorState(record.name, state); }
      return next;
    }), 1000);
    return () => clearInterval(id);
  }, [screen, coloring]);
  // Leaving early keeps the time that is left, so the picture is not handed back a fresh five minutes.
  const leaveColoring = () => {
    if (record && coloring) {
      const state = { ...colorState, [coloring]: { ...(colorState[coloring] || {}), left: colorLeft, art: colorArt.current } };
      setColorState(state); saveColorState(record.name, state);
      if (!record.preview && !coloring.startsWith('play:')) addEvent(makeColoredEvent(coloring, new Date().toISOString()));
    }
    setColoring(null); setScreen('overview');
  };
  // The phone's back button goes up one level inside the app instead of leaving it: a lesson or a
  // picture goes back to the courses, the courses go back to the sign-in screen, an educator page
  // goes back to the educator's list. One guard entry sits on the browser's history whenever the
  // app is past the sign-in screen; back pops it, the app moves up, and the guard is put back unless
  // the sign-in screen is where it landed, so one more back really does leave.
  const quietly = (fn) => { try { fn(); } catch (e) { /* a sandboxed preview has no history to speak of */ } };
  const upScreen = () => {
    if (screen === 'overview') return record && record.preview ? 'educator-pick' : 'welcome';
    if (['educator-pin', 'educator-setup', 'educator-pick'].includes(screen)) return 'welcome';
    if (['class-view', 'backup', 'standards-map', 'experiments', 'reading-lists', 'wonder-review', 'life-skills', 'transcript', 'change-state', 'educator-report'].includes(screen)) return 'educator-pick';
    if (screen === 'welcome' || screen === 'loading') return null;
    return 'overview';
  };
  const upRef = useRef(upScreen); upRef.current = upScreen;
  const leaveRef = useRef(leaveColoring); leaveRef.current = leaveColoring;
  useEffect(() => {
    if (typeof window === 'undefined' || !window.history || !window.history.pushState) return undefined;
    const onBack = () => {
      const up = upRef.current();
      if (!up) return;
      if (screen === 'coloring') leaveRef.current();
      else if (screen === 'overview' && record && record.preview) { setRecord(null); setScreen('educator-pick'); }
      else setScreen(up);
      if (up !== 'welcome') quietly(() => window.history.pushState({ edusphere: true }, ''));
    };
    window.addEventListener('popstate', onBack);
    return () => window.removeEventListener('popstate', onBack);
  }, [screen, record]);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.history || !window.history.pushState) return undefined;
    // Leaving the sign-in screen lays down the guard entry; arriving at it lets the entry go, so the
    // browser's own back is never one tap behind what the screen shows.
    const guarded = window.history.state && window.history.state.edusphere;
    if (screen !== 'welcome' && screen !== 'loading' && !guarded) quietly(() => window.history.pushState({ edusphere: true }, ''));
    if (screen === 'welcome' && guarded) quietly(() => window.history.back());
    return undefined;
  }, [screen]);
  const recordRef = useRef(null);                  // the newest record, for back-to-back writes
  useEffect(() => { recordRef.current = record; }, [record]);
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [moduleId, setModuleId] = useState(null);
  const [attempt, setAttempt] = useState(null);    // { core: [...], review: {...} | null }
  const [qIndex, setQIndex] = useState(0);
  const [given, setGiven] = useState('');
  const [checked, setChecked] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [coreResults, setCoreResults] = useState([]);
  const [reviewResult, setReviewResult] = useState(null);
  const [review2Result, setReview2Result] = useState(null);
  const [startedAt, setStartedAt] = useState(null);
  const [lastEvent, setLastEvent] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [saveNote, setSaveNote] = useState('');       // shown once if a save could not be stored on the device
  const [qShownAt, setQShownAt] = useState(0);
  const [orderPicked, setOrderPicked] = useState([]);  // the pieces tapped so far on an order question       // when the current question appeared (for time-per-question)
  const [pinInput, setPinInput] = useState('');
  const [educatorRecord, setEducatorRecord] = useState(null); // the learner an educator is looking at
  const [wonder, setWonder] = useState(null);        // the Wonder question shown after mastery
  const [wonderText, setWonderText] = useState('');  // stays on the screen only; never saved
  const [wonderPick, setWonderPick] = useState('');
  const [wonderStartedAt, setWonderStartedAt] = useState(0);
  const [openSubject, setOpenSubject] = useState(null); // the one subject a learner has opened, if any
  const [showFinished, setShowFinished] = useState(false); // young learners: finished modules stay folded away

  // Everything the screens need is recomputed from the event log on every render.
  const progress = useMemo(() => (record ? deriveProgress(record.events) : null), [record]);
  const statuses = useMemo(() => (progress && record ? moduleStatuses(progress, enabledCourseIds(record.events)).map((st) => (record.preview && st.status === 'locked' ? { ...st, status: 'available' } : st)) : []), [progress, record]);
  const statusOf = (id) => (statuses.find((s) => s.id === id) || {}).status;
  const sortedModules = useMemo(() => [...MODULES].sort((a, b) => a.order - b.order), []);
  // The record is keyed by the student's ID, but every screen shows the name an admin typed.
  const displayName = useMemo(() => {
    if (!record) return '';
    const st = findStudent(roster, record.name);
    return st ? st.label : record.name;
  }, [record, roster]);
  const visibleCourses = useMemo(() => (record ? COURSES.filter((c) => enabledCourseIds(record.events).includes(c.id)) : []), [record]);
  const visibleModules = useMemo(() => visibleCourses.flatMap((c) => c.modules), [visibleCourses]);
  // Alphabetical, so the order never depends on how the content happens to be written.
  const subjects = useMemo(() => sortSubjects(visibleCourses.map((c) => c.subject)), [visibleCourses]);
  // A young learner is any student with an early-years course (pre-K to grade 2) still
  // unfinished, whatever else is assigned. Their screens are simpler: no numbers to read,
  // nothing that needs a scroll to find, one thing to do next. Early courses come first in
  // every subject, and the prerequisite graph keeps advanced work locked until the early
  // work it depends on is mastered. Once every early course is complete they graduate to
  // the regular screens.
  const earlyModuleIds = useMemo(() => visibleCourses.filter((c) => stageForGrade(c.grade) === 'early').flatMap((c) => c.modules.map((m) => m.id)), [visibleCourses]);
  const youngLearner = earlyModuleIds.length > 0 && earlyModuleIds.some((id) => !progress.masteredIds.includes(id));
  // Young learners see only their early-years courses; anything above grade 2 waits until they graduate.
  const shownCourses = useMemo(() => (earlyModuleIds.length > 0 && earlyModuleIds.some((id) => !progress.masteredIds.includes(id)) ? visibleCourses.filter((c) => stageForGrade(c.grade) === 'early') : visibleCourses), [visibleCourses, earlyModuleIds, progress]);
  const shownSubjects = useMemo(() => sortSubjects(shownCourses.map((c) => c.subject)), [shownCourses]);


  // On first load: find learners who have used this device before.
  useEffect(() => {
    (async () => {
      setRoster(await loadRoster());
      setCovered(await loadCovered());
      setWonderReview(await loadWonderReview());
      setBackupAt(await loadBackupAt());
      setDeviceName(await loadDeviceName());
      setStateCode(await loadStateCode());
      setQuickChecks(await loadQuickChecks());
      setEducator(await loadEducator());
      { const rawProfile = await loadEducatorRaw(); if (rawProfile && !rawProfile.pin) setPendingProfile(rawProfile); }
      setScreen('welcome');
    })();
  }, []);

  // Adds one event to the learner's log and saves. This is the ONLY place the log changes.
  async function addEvent(event) { return addEvents([event]); }
  // Every write starts from the newest record, not the one this render closed over, so two writes in a
  // row never lose each other. recordRef always holds the latest.
  async function addEvents(list) {
    const base = recordRef.current || record;
    const next = { ...base, events: [...base.events, ...list] };
    recordRef.current = next;
    setRecord(next);
    if (record.preview) return next; // a walk-through: nothing is written to this device
    changedSinceBackup.current = true;
    setBusy(true);
    const outcome = await saveRecord(next);
    setSaveNote(outcome.saved ? '' : 'This step could not be saved on this device. This happens only during incognito browsing or when browser storage is full. It still counts for this session.');
    setBusy(false);
    return next;
  }

  // A record with no course decision yet gets the starter set for the student's level, once.
  // This covers students added before the starter rule existed, who would otherwise be
  // handed every course there is.
  async function withStarterCourses(rec) {
    if (rec.events.some((e) => e.type === 'courses_enabled')) return rec;
    const st = findStudent(roster, rec.name);
    if (!st || !st.level) return rec;
    const starter = makeCoursesEnabledEvent(recommendedCourseIds([makeCoursesEnabledEvent([], new Date().toISOString())], st.level), new Date().toISOString());
    const next = { ...rec, events: [...rec.events, starter] };
    await saveRecord(next);
    return next;
  }

  async function startWithName(name) {
    if (!name.trim()) return;
    setOpenSubject(null); setShowFinished(false);
    // Opening a student ends any educator session at once, so the next Educator Login asks for the PIN.
    setLastActive(0); setIdleWarning(false);
    setBusy(true); setErrorMsg('');
    try {
      const rec = await withStarterCourses(await loadRecord(name));
      setRecord(rec);
      setScreen('overview');
      // The first sign-in of the day backs up yesterday's work, in case nobody tapped Exit.
    } catch (e) { setErrorMsg('Could not load this learner. Please try again.'); }
    setBusy(false);
  }

  // Sends the student back to a prerequisite for a quick check, recording that it happened.
  async function loopBack(fromId, toId) {
    await addEvent(makeLoopBackEvent(fromId, toId, new Date().toISOString()));
    setModuleId(toId); setLessonStep(0); setScreen('lesson');
  }

  // "I already know this": five questions from the module, no lesson, on the practice screen.
  function startQuickCheck(id) {
    const check = buildQuickCheck(id, (Date.now() % 2147483646) + 1);
    if (!check) return;
    setModuleId(id);
    setAttempt(check);
    setQIndex(0); setGiven(''); setChecked(false); setMisses(0); setCoreResults([]); setOrderPicked([]); setReviewResult(null); setReview2Result(null);
    setStartedAt(new Date().toISOString());
    setQShownAt(Date.now());
    setScreen('practice');
  }

  async function openModule(id) {
    if (statusOf(id) === 'locked') return;
    // A touch module on a laptop without a touch screen says so instead of opening to a mouse.
    if ((getModule(id) || {}).needsTouch && !hasTouchScreen()) { setErrorMsg('This module needs a touch screen. An iPad or another large tablet with a stylus is best.'); return; }
    setModuleId(id);
    setLessonStep(0);
    await addEvent(makeLessonViewedEvent(id, new Date().toISOString()));
    setScreen('lesson');
  }

  function startPlacement(subject) {
    const st = findStudent(roster, record.name);
    const grades = placementGrades(subject, st ? st.level : null);
    if (!grades.length) return;
    // A student added at a particular grade starts the walk there; everyone else starts at the bottom of the band.
    const startAt = st && st.startGrade && grades.includes(st.startGrade) ? st.startGrade : grades[0];
    const probe = buildPlacementProbe(subject, startAt, (Date.now() % 2147483646) + 1);
    if (!probe) return;
    setPlacementWalk({ subject, grades, cleared: [], failed: [], direction: 'up' });
    setModuleId(probe.moduleId);
    setAttempt(probe);
    setQIndex(0); setGiven(''); setChecked(false); setMisses(0); setCoreResults([]); setOrderPicked([]); setReviewResult(null); setReview2Result(null);
    setStartedAt(new Date().toISOString());
    setQShownAt(Date.now());
    setScreen('practice');
  }

  // A backup file straight to the downloads folder, or into the one file an educator chose to keep
  // up to date. Never during a walk-through. `changed` is set by every saved event and cleared here,
  // so a sign-out with nothing new to save downloads nothing.
  const changedSinceBackup = useRef(false);
  async function autoBackup(reason = 'course') {
    const rec = recordRef.current || record;
    if (rec && rec.preview) return;
    if (!changedSinceBackup.current) return;
    try {
      const everything = await gatherEverything(roster);
      const at = new Date().toISOString();
      const text = JSON.stringify(buildBackup({ ...everything, deviceName, recovery: educator ? educator.recovery : null }, at), null, 2);
      const name = backupFileName(deviceName, (everything.students || []).length, at);
      if (!plainDownload(name, text)) return;
      changedSinceBackup.current = false;
      setBackupAt(at); await saveBackupAt(at);
      setAutoBackupNote(`Backup saved to downloads at ${fmtDate(at)}.`);
    } catch (e) { setAutoBackupNote('The automatic backup could not be saved this time.'); }
  }

  // Courses in which every module is passed, for deciding when a round finished a course.
  function courseProgressFinished(events) {
    const pg = deriveProgress(events);
    return enabledCourseIds(events).filter((id) => { const c = getCourse(id); return c && c.modules.length > 0 && c.modules.every((m) => pg.passedIds.includes(m.id)); });
  }

  function startPreview(level) {
    // A walk-through record: every course in the band, every subject, pre-K included, nothing saved, every module open.
    const band = levelFor(level);
    const ids = COURSES.filter((c) => band && band.grades.includes(c.grade)).map((c) => c.id);
    const events = [makeCoursesEnabledEvent(ids, new Date().toISOString())];
    setOpenSubject(null); setShowFinished(false);
    setRecord({ name: 'Walk-through', events, preview: true, level });
    setEducatorRecord(null);
    setScreen('overview');
  }

  function startCheckpoint() {
    const seed = (Date.now() % 2147483646) + 1;
    const cp = buildCheckpoint(record.events, seed);
    if (!cp) return;
    setModuleId(cp.moduleId);
    setAttempt(cp);
    setQIndex(0); setGiven(''); setChecked(false); setMisses(0); setCoreResults([]); setOrderPicked([]); setReviewResult(null); setReview2Result(null);
    setStartedAt(new Date().toISOString());
    setQShownAt(Date.now());
    setScreen('practice');
  }

  // The module a student missed most this week; null when nothing was missed.
  function mostMissedModule() {
    if (!record) return null; const week = Date.now() - 7 * 24 * 3600 * 1000; const count = {};
    for (const e of record.events || []) if (e.type === 'attempt_completed' && e.at && new Date(e.at).getTime() >= week) for (const r of (e.core || [])) if (r && r.correct === false) count[e.moduleId] = (count[e.moduleId] || 0) + 1;
    const best = Object.entries(count).sort((a, b) => b[1] - a[1])[0]; return best && getModule(best[0]) && visibleCourses.some((c) => c.id === getModule(best[0]).courseId) ? best[0] : null;
  }
  function startPractice() {
    const seed = (Date.now() % 2147483646) + 1;
    setAttempt(buildAttempt(moduleId, seed, progress.passedIds));
    setQIndex(0); setGiven(''); setChecked(false); setMisses(0); setCoreResults([]); setOrderPicked([]); setReviewResult(null); setReview2Result(null);
    setStartedAt(new Date().toISOString());
    setQShownAt(Date.now());
    setScreen('practice');
  }

  // The questions shown in this practice set: the core ones, then the review one (if any).
  const questions = attempt ? [...attempt.core, ...(attempt.review ? [attempt.review.question] : []), ...(attempt.review2 ? [attempt.review2.question] : [])] : [];
  const isReviewQ = attempt ? qIndex >= attempt.core.length : false;
  const q = questions[qIndex];

  // On a placement check, "I don't know" counts as a miss and moves straight on, with no
  // lesson in between: a guess would only add noise to where the student lands.
  function dontKnow() {
    if (!attempt || !attempt.placement || checked) return;
    const result = { genId: q.genId, seed: q.seed, prompt: q.prompt, answer: q.answer, given: 'I do not know', correct: false, timeMs: Date.now() - qShownAt };
    setCoreResults((r) => [...r, result]);
    setChecked(true); setWasCorrect(false); setGiven('');
  }

  async function submitWriting() {
    if (!q || q.type !== 'writing') return;
    // The writing lives on paper or in the student's own word processor, never in the app. The app keeps the
    // prompt, the medium, the self-check and the time, and waits for the educator's check.
    const event = makeWritingEvent(mod.id, `${q.medium === 'typed' ? 'Typed: ' : 'Handwritten: '}${q.prompt}`, '', q.checklist.map((c, i) => ({ item: c, ticked: ticks.includes(i) })), startedAt, new Date().toISOString());
    setLastEvent(event);
    await addEvent(event);
    setScreen('writing-sent');
  }

  function checkCurrent() {
    if (checked || given === '') return;
    const correct = checkAnswer(q, given);
    // Pre-readers try again until they get it, so nobody is left stuck on a wrong answer.
    // What we record is whether they were right FIRST time, which is what mastery should mean.
    if (readAloud && !correct) {
      setMisses((n) => n + 1);
      setWrongPicks((list) => (list.includes(String(given)) ? list : [...list, String(given)]));
      setWasCorrect(false); setChecked(true);
      return;
    }
    const firstTry = misses === 0;
    const result = { genId: q.genId, seed: q.seed, prompt: q.prompt, answer: q.answer, given: String(given), correct: readAloud ? firstTry : correct, timeMs: Date.now() - qShownAt, retries: misses };
    if (isReviewQ && qIndex === attempt.core.length) setReviewResult({ moduleId: attempt.review.moduleId, ...result });
    else if (isReviewQ) setReview2Result({ moduleId: attempt.review2.moduleId, ...result });
    else setCoreResults((r) => [...r, result]);
    setWasCorrect(correct); setChecked(true); setWrongWay(false);
    if (correct) setCheer((n) => n + 1);
    else { const line = taughtLine(mod.id, q.answer); if (line) setMissed((m) => ({ ...m, [mod.id]: [...new Set([...(m[mod.id] || []), line])].slice(-3) })); }
  }

  // Clears the feedback so the child can have another go at the same question.
  function tryAgain() {
    setOrderPicked([]);
    setGiven(''); setChecked(false); setTracePaths([]); setQShownAt(Date.now());
  }

  async function nextQuestion() {
    if (qIndex + 1 < questions.length) {
      setQIndex(qIndex + 1); setGiven(''); setChecked(false); setMisses(0); setQShownAt(Date.now()); setOrderPicked([]);
      return;
    }
    if (attempt.placement && placementWalk) {
      const cleared = placementCleared(coreResults);
      const all = placementGradesAll(placementWalk.subject);
      const here = all.indexOf(attempt.grade);
      const nextCleared = cleared ? [...placementWalk.cleared, attempt.grade] : placementWalk.cleared;
      const failed = cleared ? (placementWalk.failed || []) : [...(placementWalk.failed || []), attempt.grade];
      // Walking up: cleared, and there is a higher grade in the band. Walking down: nothing cleared yet,
      // this grade was not cleared, and there is a lower grade to try.
      const upIndex = placementWalk.grades.indexOf(attempt.grade);
      const goUp = cleared && placementWalk.direction !== 'down' && upIndex >= 0 && placementWalk.grades[upIndex + 1];
      const goDown = !cleared && nextCleared.length === 0 && here > 0;
      const nextGrade = goUp ? placementWalk.grades[upIndex + 1] : goDown ? all[here - 1] : null;
      if (nextGrade) {
        const probe = buildPlacementProbe(placementWalk.subject, nextGrade, (Date.now() % 2147483646) + 1);
        setPlacementWalk({ ...placementWalk, cleared: nextCleared, failed, direction: goDown ? 'down' : placementWalk.direction });
        setModuleId(probe.moduleId); setAttempt(probe);
        setQIndex(0); setGiven(''); setChecked(false); setMisses(0); setCoreResults([]); setOrderPicked([]); setQShownAt(Date.now());
        return;
      }
      const st = findStudent(roster, record.name);
      // The start is the lowest grade not cleared: a walk down that clears grade 7 after failing 9 and 8 starts at 8.
      const highestCleared = nextCleared.length ? nextCleared.slice().sort((a, b) => all.indexOf(b) - all.indexOf(a))[0] : null;
      const startGrade = failed.length ? failed.slice().sort((a, b) => all.indexOf(a) - all.indexOf(b))[0] : highestCleared ? all[Math.min(all.length - 1, all.indexOf(highestCleared) + 1)] : null;
      const outcome = placementOutcome(placementWalk.subject, st ? st.level : null, nextCleared, startGrade);
      const at = new Date().toISOString();
      // Switch on the starting grade's courses in this subject, keeping everything else assigned.
      const enabledNow = enabledCourseIds([...record.events]);
      const others = enabledNow.filter((id) => { const c = getCourse(id); return !c || c.subject !== placementWalk.subject; });
      await addEvents([makePlacementEvent(placementWalk.subject, outcome.startGrade, outcome.clearedModuleIds, at), makeCoursesEnabledEvent([...new Set([...others, ...outcome.startCourseIds])], at)]);
      setPlacementResult({ subject: placementWalk.subject, startGrade: outcome.startGrade, cleared: nextCleared, lastCleared: cleared });
      setPlacementWalk(null);
      setScreen('placement-result');
      return;
    }
    if (attempt.quickCheck) {
      const at = new Date().toISOString();
      const qc = makeQuickCheckEvent(attempt.moduleId, coreResults, at);
      await addEvents(qc.passed ? [qc, makeQuickPlacedEvent(attempt.moduleId, at)] : [qc]);
      setQuickResult({ moduleId: attempt.moduleId, right: qc.right, total: qc.total, passed: qc.passed, guessed: qc.guessed });
      setScreen('quick-result');
      return;
    }
    if (attempt.checkpoint) {
      const cpEvent = makeCheckpointEvent(attempt, coreResults, startedAt, new Date().toISOString());
      setLastEvent(cpEvent);
      await addEvent(cpEvent);
      setScreen('checkpoint-result');
      return;
    }
    const event = makeAttemptEvent(attempt, coreResults, reviewResult, startedAt, new Date().toISOString(), review2Result);
    setLastEvent(event);
    // Finishing a whole course switches on the next course up in that subject, recorded as
    // an event so the educator can see it happened and change it if they like. Both go in one write.
    const nextUp = coursesToUnlock([...record.events, event]);
    await addEvents(nextUp.length ? [event, makeCoursesEnabledEvent([...enabledCourseIds([...record.events, event]), ...nextUp], new Date().toISOString())] : [event]);
    setScreen('result');
    // A backup goes to the downloads folder when this round finished a whole course. Per round was too many files.
    const before = new Set(courseProgressFinished(record.events));
    const after = courseProgressFinished([...record.events, event]);
  }


  // Which module/course is open, and read-aloud for courses that use it.
  // (Hooks live here, above the first early return, so React sees the same hooks every render.)
  const currentFrom = attempt && (attempt.checkpoint || attempt.placement) && screen === 'practice' && attempt.core[qIndex] ? attempt.core[qIndex].fromModuleId : null;
  const roundLabel = !attempt ? '' : attempt.checkpoint ? 'Checkpoint · ' : attempt.placement ? `Placement, ${gradeLabel(attempt.grade).toLowerCase()} · ` : attempt.quickCheck ? 'Quick check · ' : '';
  // Answer sizes: a question's choices share one size, so 4 never towers over -3 or 1/6 beside it.
  const choiceFont = (choices) => {
    if (!choices || !choices.length) return 18;
    if (choices.every((c) => /^[A-Za-z]$/.test(c))) return 34;
    if (choices.every((c) => /^-?[\d.,\/ ]+$/.test(c))) { const longest = Math.max(...choices.map((c) => c.length)); return longest <= 2 ? 34 : longest <= 6 ? 26 : 20; }
    return 18;
  };
  const mod = currentFrom ? getModule(currentFrom) : moduleId ? getModule(moduleId) : null;
  const course = mod ? getCourse(mod.courseId) : null;
  const readAloud = !!(course && course.readAloud);
  const questionText = q ? [q.story, q.prompt].filter(Boolean).join(' ') : '';
  // The question's position is a dependency too: two questions in a row can carry the very same words
  // (the same picture picked twice), and the second must still be spoken.
  useEffect(() => { if (screen === 'practice' && readAloud && questionText) speak(questionText); }, [screen, readAloud, questionText, qIndex]);
  // An educator stays signed in while they are using the screen. After four quiet minutes a
  // warning appears; after five, the PIN is asked for again. Any tap or key resets the clock.
  const EDUCATOR_SCREENS = ['educator-pick', 'educator-report', 'transcript', 'life-skills', 'wonder-review', 'backup', 'class-view', 'change-state', 'standards-map'];
  const onEducatorScreen = EDUCATOR_SCREENS.includes(screen);
  const logoutIn = onEducatorScreen && lastActive && tourStep < 0 ? Math.max(0, Math.ceil((EDUCATOR_IDLE_MS - (now - lastActive)) / 1000)) : null;
  useEffect(() => {
    if (!onEducatorScreen) { setIdleWarning(false); return undefined; }
    setLastActive(Date.now());
    const touch = () => { setLastActive(Date.now()); setIdleWarning(false); };
    let lastMove = 0;
    const move = () => { const now = Date.now(); if (now - lastMove > 1500) { lastMove = now; touch(); } };
    window.addEventListener('pointerdown', touch); window.addEventListener('keydown', touch);
    window.addEventListener('pointermove', move); window.addEventListener('wheel', move); window.addEventListener('scroll', move, true);
    return () => {
      window.removeEventListener('pointerdown', touch); window.removeEventListener('keydown', touch);
      window.removeEventListener('pointermove', move); window.removeEventListener('wheel', move); window.removeEventListener('scroll', move, true);
    };
  }, [onEducatorScreen]);
  useEffect(() => {
    if (!onEducatorScreen) return undefined;
    // Thirty seconds of quiet ends the session, so a student picking up the device meets the PIN
    // screen. A warning shows at twenty; any tap or key resets the clock.
    const tick = setInterval(() => {
      if (tourStep >= 0) { setLastActive(Date.now()); return; }   // reading the tour is not idleness, and no one is signed out mid-card
      const quiet = Date.now() - lastActive;
      setNow(Date.now());
      if (quiet >= EDUCATOR_IDLE_MS) { rememberHere(); setIdleWarning(false); setPinInput(''); setScreen('educator-pin'); }
      else if (quiet >= EDUCATOR_IDLE_MS - 10000) setIdleWarning(true);
    }, 1000);
    return () => clearInterval(tick);
  }, [onEducatorScreen, lastActive, tourStep]);
  // Every screen opens at the top. Without this, a long page keeps the previous scroll position.
  useEffect(() => {
    if (typeof window !== 'undefined' && window.scrollTo) {
      if (pendingScroll.current !== null) { const y = pendingScroll.current; pendingScroll.current = null; setTimeout(() => window.scrollTo(0, y), 0); }
      else window.scrollTo(0, 0);
    }
    closeTips(); setHeardNote(false);
  }, [screen]);
  // Whatever route brought a question on screen, it starts clean: nothing picked, nothing counted.
  const questionKey = attempt ? `${attempt.seed}-${qIndex}` : '';
  useEffect(() => { setGiven(''); setChecked(false); setMisses(0); setWrongPicks([]); setTracePaths([]); }, [questionKey]);
  // Each line of a pre-reader lesson is spoken as it appears, without waiting to be asked.
  const lessonLines = mod && readAloud ? (mod.lesson.script || []).map((x) => x.say) : [];
  const currentLessonLine = lessonLines[Math.min(lessonStep, Math.max(0, lessonLines.length - 1))] || '';
  const [litSentence, setLitSentence] = useState(-1);               // which sentence of a read-aloud line the voice is on
  useEffect(() => {
    if (!(screen === 'lesson' && readAloud && currentLessonLine)) { setLitSentence(-1); return undefined; }
    const parts = sentencesOf(currentLessonLine); setLitSentence(-1);
    const stop = speakSequence(parts, (i) => setLitSentence(i), () => setLitSentence(-1), parts.map((_, i) => `${mod ? mod.id : 'lesson'}-${lessonStep}-${i}`));
    return () => { stop(); };
  }, [screen, readAloud, currentLessonLine]);
  useEffect(() => { setStoryOpen(false); setAnotherWay(0); }, [screen === 'lesson' ? (mod && mod.id) : null]);
  // Opening a report remembers the visit on the roster, after noting when the last one was.
  useEffect(() => { if (screen !== 'educator-report' || !educatorRecord || !roster || educatorRecord.preview) return; const st = findStudent(roster, educatorRecord.name); setReportOpenedFrom(st && st.reportSeenAt ? st.reportSeenAt : null); const next = setReportSeen(roster, educatorRecord.name, new Date().toISOString()); setRoster(next); saveRoster(next); setWeeklyEdit(null); setWeeklyEditing(false); }, [screen === 'educator-report' ? (educatorRecord && educatorRecord.name) : null]);
  useEffect(() => { if (typeof document !== 'undefined') { document.body.classList.toggle('edu-cert-mode', screen === 'certificate'); document.body.classList.toggle('edu-story-mode', screen === 'story'); } }, [screen]);
  // The what's-new pop-up: once per build, the first time an educator lands on the classroom after it.
  const tourSheetRef = useRef(null);                               // the sheet, scrolled back to its top on every card
  const tourBegun = useRef(false);                                 // the tour starts once per sign-in, not every time the classroom page shows
  // On a phone the tour does not start on its own (the sheet fights the page for room); the classroom page offers it instead.
  const phoneScreen = typeof window !== 'undefined' && window.innerWidth < 700;
  useEffect(() => { if (screen === 'educator-pick' && educator && !educator.tourSeen) { if (!tourBegun.current && !phoneScreen) { tourBegun.current = true; setTourStep(0); } return; } if (screen === 'educator-pick' && news && educator && educator.newsSeen !== news.stamp && educator.tourSeen) setNewsOpen(true); }, [screen, educator && educator.newsSeen, educator && educator.tourSeen]);
  useEffect(() => { if (screen === 'wonder' && readAloud && wonder) speak(wonder.prompt); }, [screen, readAloud, wonder]);
  const spokenVoice = screen === 'wonder-voices' && readAloud && wonder ? (wonder.simple || [])[Math.min(wonderVoiceStep, ((wonder.simple || []).length || 1) - 1)] : null;
  useEffect(() => { if (spokenVoice) speak(`${spokenVoice.voice}. ${spokenVoice.says}`); }, [spokenVoice]);
  // The test hook: what screen is up, which question, and a way to open a named module without
  // hunting for its card, so a browser check can go straight to a lesson.
  // A phone held sideways is asked to turn upright rather than shown a squeezed layout. Tablets and
  // laptops are unaffected: the ask only appears on a short, wide screen that is touched, not clicked.
  useEffect(() => {
    if (typeof document === 'undefined' || document.getElementById('edu-rotate')) return undefined;
    const box = document.createElement('div');
    box.id = 'edu-rotate';
    box.className = 'edu-rotate';
    box.innerHTML = '<div><svg viewBox="0 0 24 24" width="64" height="64" aria-hidden="true"><rect x="7" y="2" width="10" height="20" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M4 14a8 8 0 0 0 8 8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M4 14l-1 3 3 0.6z" fill="currentColor"/></svg><p>Please turn your phone upright.</p></div>';
    document.body.appendChild(box);
    // A keyboard shortens the viewport too, so the screen's own orientation decides, never the viewport's shape.
    const check = () => { const coarse = window.matchMedia('(pointer: coarse)').matches; const sideways = window.screen.orientation ? /landscape/.test(window.screen.orientation.type) : window.screen.width > window.screen.height; box.classList.toggle('edu-rotate-on', coarse && sideways && window.innerHeight <= 540); };
    check(); window.addEventListener('resize', check); window.addEventListener('orientationchange', check);
    return () => { window.removeEventListener('resize', check); window.removeEventListener('orientationchange', check); if (box.parentNode) box.parentNode.removeChild(box); };
  }, []);
  useEffect(() => { if (typeof window !== 'undefined') window.__eduTest = { screen, question: q || null, isReviewQ, openModule: (id) => openModule(id), openColoring: (pic) => { setColoring(pic); setScreen('coloring'); }, openCertificate: (id, grade) => { setCertFor({ id, grade }); setCertTemplate('classic'); setCertName(''); setCertPhotos([]); setScreen('certificate'); } }; }, [screen, q, isReviewQ]);
  const endTour = async () => { setTourStep(-1); if ((screen === 'educator-report' && educatorRecord && educatorRecord.preview) || screen === 'class-view') { setEducatorRecord(null); setClassRows(null); setScreen('educator-pick'); } const next = { ...educator, tourSeen: true, newsSeen: news ? news.stamp : educator.newsSeen }; setEducator(next); await saveEducator(next); };
  const tourPopup = tourStep >= 0 && educator && (screen === 'educator-pick' || (screen === 'educator-report' && educatorRecord && educatorRecord.preview) || screen === 'class-view') ? (
    <div className="edu-no-print" style={{ position: 'fixed', right: 0, left: 0, ...(tourCardAt === 'top' ? { top: 0 } : { bottom: 0 }), zIndex: 130, display: 'flex', justifyContent: 'center', padding: tourCardAt === 'top' ? '10px 12px 0' : '0 12px 10px', pointerEvents: 'none' }}>
      {/* A small sheet at the top or the bottom, whichever leaves the thing being described in view; never a curtain. */}
      <div className="edu-rise" ref={tourSheetRef} style={{ width: 'min(420px, 100%)', background: C.surface, borderRadius: 14, padding: '12px 16px', textAlign: 'center', boxShadow: '0 4px 30px rgba(36, 41, 31, 0.3)', border: `1px solid ${C.line}`, pointerEvents: 'auto', maxHeight: '36vh', overflowY: 'auto' }} role="dialog" aria-label="First week tour">
      <p style={{ margin: '0 0 4px', fontSize: 13, color: C.muted }}>{tourStep + 1} of {TOUR.length}</p>
      <p style={{ margin: '0 0 6px', fontSize: 17, fontWeight: 700 }}>{TOUR[tourStep][0]}</p>
      <p style={{ margin: '0 0 12px', fontSize: 14, lineHeight: 1.55 }}>{TOUR[tourStep][3]}</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
        <Btn kind="secondary" onClick={endTour}>Skip tour</Btn>
        {tourStep < TOUR.length - 1 ? <Btn onClick={() => setTourStep(tourStep + 1)}>Next</Btn> : <Btn onClick={endTour}>Done</Btn>}
      </div>
      </div>
    </div>
  ) : null;
  // While a tour card is up, the element it talks about glows: data-tour on the element, the target name on the body.
  useEffect(() => {
    if (typeof document === 'undefined' || tourStep < 0 || !TOUR[tourStep]) { if (typeof document !== 'undefined') for (const el of document.querySelectorAll('.edu-tour-target')) el.classList.remove('edu-tour-target'); return undefined; }
    const [, target, sample] = TOUR[tourStep];
    if (tourSheetRef.current) tourSheetRef.current.scrollTop = 0;
    // A card with a sample screen opens it with made-up students; the others come back to the classroom page.
    if (sample === 'report' && screen !== 'educator-report') { setEducatorRecord(sampleRecord()); setOpenSubjects([]); setShowAllCourses(false); setConfirmReset(false); setScreen('educator-report'); return undefined; }
    if (sample === 'class' && screen !== 'class-view') { setClassRows(classView(sampleClass(), new Date().toISOString())); setScreen('class-view'); return undefined; }
    if (!sample && screen !== 'educator-pick') { setScreen('educator-pick'); return undefined; }
    // The target is marked, scrolled into view, and the sheet takes the other end of the screen.
    const place = () => {
      const el = target ? document.querySelector(`[data-tour="${target}"]`) : null;
      if (!el) { setTourCardAt('bottom'); return; }
      el.classList.add('edu-tour-target');
      el.scrollIntoView({ block: 'center' });
      const r = el.getBoundingClientRect(); setTourCardAt(r.top + r.height / 2 > window.innerHeight / 2 ? 'top' : 'bottom');
    };
    const t1 = setTimeout(place, 60); const t2 = setTimeout(place, 450);
    return () => { clearTimeout(t1); clearTimeout(t2); for (const el of document.querySelectorAll('.edu-tour-target')) el.classList.remove('edu-tour-target'); };
  }, [screen, tourStep]);
  // A picture opens at the top of the page, so the palette and the buttons are where they were left.
  useEffect(() => { if (screen === 'coloring' && typeof window !== 'undefined') window.scrollTo(0, 0); }, [screen, coloring]);
  // The learner list can change during a session (a new learner just started), so refresh it whenever a picker screen opens.
  useEffect(() => { if (screen === 'welcome' || screen === 'educator-pick') loadRoster().then(setRoster); }, [screen]);
  // The band under each name on the login screen, read from each student's own record.
  const [bands, setBands] = useState({});
  useEffect(() => { if (screen !== 'welcome') return; (async () => {
    const pairs = await Promise.all(activeStudents(roster).map(async (st) => { try { const rec = await loadRecord(st.id); return [st.id, bandTitle(rec.events), completedGrades(rec.events)]; } catch (e) { return [st.id, '', []]; } }));
    setBands(Object.fromEntries(pairs.map(([id, band]) => [id, band])));
    setReadyGrades(Object.fromEntries(pairs.map(([id, , grades]) => [id, grades])));
  })(); }, [screen, roster]);
  // A young learner who was wrong tries again, so the voice must not give the answer away.
  useEffect(() => { if (screen === 'practice' && readAloud && checked && q) speak(wasCorrect ? 'Correct. ' + q.explain : 'Not that one. Have another try.'); }, [checked]);

  // ---------- Screens ----------
  const refreshIds = refresherIds(record ? record.events : []);
  // Subjects still waiting on a placement decision: the check is offered, and that subject's
  // courses, the mastered count and My progress stay out of sight until it is settled.
  const placementPending = record && !youngLearner && !record.preview
    ? ['Math', 'Reading', 'Science'].filter((subject) => placementGrades(subject, (findStudent(roster, record.name) || {}).level).length > 0 && !placementDone(record.events, subject) && !activeEvents(record.events).some((e) => e.type === 'attempt_completed' && (getCourse((getModule(e.moduleId) || {}).courseId) || {}).subject === subject))
    : [];
  async function skipPlacement(subject) {
    // Starting at the beginning is a placement decision too: nothing cleared, first grade of the band,
    // and the subject's courses switch to that grade so the student really does start there.
    const st = findStudent(roster, record.name);
    const outcome = placementOutcome(subject, st ? st.level : null, []);
    const enabledNow = enabledCourseIds(record.events);
    const others = enabledNow.filter((id) => { const c = getCourse(id); return !c || c.subject !== subject; });
    const at = new Date().toISOString();
    await addEvents([makePlacementEvent(subject, outcome.startGrade, [], at), makeCoursesEnabledEvent([...new Set([...others, ...outcome.startCourseIds])], at)]);
  }
  // A student who came up through the early years never meets a placement check: when the last
  // early module is mastered and a subject would ask, it starts at the beginning instead.
  useEffect(() => {
    if (screen !== 'overview' || !record || record.preview || youngLearner || busy) return;
    const cameUp = progress.masteredIds.some((id) => { const c = getCourse((getModule(id) || {}).courseId); return c && stageForGrade(c.grade) === 'early'; });
    if (cameUp && placementPending.length) skipPlacement(placementPending[0]);
  }, [screen, record, youngLearner, busy]);
  if (screen === 'loading') return <div style={page}><PageChrome idleWarning={idleWarning} stars={false} /><div className="edu-wrap" style={wrap}><div className="edu-loading" style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }} aria-label="Loading"><LoadingWord /></div></div></div>;

  if (screen === 'welcome') {
    return (
      <div style={page}><PageChrome idleWarning={idleWarning} stars={false} /><div className="edu-wrap edu-welcome" style={wrap}>
        <Galaxy />
        <div className="edu-welcome-logo" style={{ margin: '10px 0 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28 }}>
          <FlankSphere side="left" /><Logo width={250} animate /><FlankSphere side="right" />
        </div>
        <div className="edu-welcome-card" style={{ ...card, background: 'rgba(249, 251, 247, 0.9)', borderColor: '#E3EBE2' }}>
          <h2 style={{ fontSize: 20, margin: '0 0 14px', textAlign: 'center' }}>Who's learning today?</h2>
          {activeStudents(roster).length === 0 ? (
            <p style={{ margin: 0, color: C.muted, fontSize: 15, textAlign: 'center' }}>No students have been added. An educator can add students by logging in below.</p>
          ) : (
            <>
              {activeStudents(roster).length > 8 && (
                <input value={nameInput} onChange={(e) => setNameInput(e.target.value)} placeholder="Find your name"
                  style={{ textAlign: 'center',  fontFamily: FONT, fontSize: 17, padding: '10px 12px', width: '100%', boxSizing: 'border-box', border: `2px solid ${C.line}`, borderRadius: 10, marginBottom: 10 }} />
              )}
              {/* One name per row on a phone, so no name is ever squeezed; two per row from a tablet up,
                  which keeps a class of thirty on one or two screens. A single student always gets one column. */}
              <div className={'edu-name-grid' + (activeStudents(roster).length > 1 ? ' edu-name-grid-two' : '')} style={{ display: 'grid', gridAutoRows: 'minmax(84px, auto)', gap: 10 }}>
                {activeStudents(roster)
                  .filter((st) => st.label.toLowerCase().includes(nameInput.trim().toLowerCase()))
                  .map((st) => (
                    <button key={st.id} type="button" aria-label={st.label} onClick={() => { if (st.pin) { setPinAsk(st.id); setPinTry(''); setPinWrong(false); } else startWithName(st.id); }} disabled={busy} className="edu-press edu-name"
                      style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, borderRadius: 10, background: C.surface, border: `2px solid ${C.line}`, color: C.ink, cursor: 'pointer', minHeight: 84, padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, overflow: 'hidden', position: 'relative' }}>
                      {/* Every button has the same three slots: a picture slot on the left, the name centred
                          in the middle, and a matching empty slot on the right, so names line up across the
                          grid whether or not a student has a picture. */}
                      <span style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 8 }}>
                        <span style={{ width: 40, flexShrink: 0, display: 'inline-flex', justifyContent: 'center' }}>{st.picture && <StudentPicture name={st.picture} tint={st.tint} size={40} />}</span>
                        <span style={{ textAlign: 'center', lineHeight: 1.2, flex: '1 1 auto', minWidth: 0, overflowWrap: 'anywhere' }}>{keepTogether(st.label)}
                          {/* A quieter second line says which band they are working in, so the two lines stand about as tall as the picture. */}
                          <span className="edu-name-grade">{bands[st.id] || levelFor(st.level).title}</span>
                        </span>
                        <span style={{ width: 40, flexShrink: 0 }} aria-hidden="true" />
                      </span>
                    </button>
                  ))}
              </div>
              {activeStudents(roster).filter((st) => st.label.toLowerCase().includes(nameInput.trim().toLowerCase())).length === 0 && (
                <p style={{ margin: '10px 0 0', color: C.muted, fontSize: 15 }}>No name matches “{nameInput.trim()}”. Ask your educator.</p>
              )}
            </>
          )}
          {errorMsg && <p style={{ color: C.clay }}>{errorMsg}</p>}
        </div>
        <div className="edu-welcome-links" style={{ marginTop: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <div className="edu-login-btn" style={{ width: '100%', maxWidth: 320, marginBottom: 18 }}><Btn full onClick={() => { if (lastActive && Date.now() - lastActive < EDUCATOR_IDLE_MS) { setScreen('educator-pick'); return; } setPinInput(''); setScreen('educator-pin'); }}>Educator Login</Btn></div>
          {!educator && (
            <button type="button" onClick={() => { setNewPin(''); setNewPin2(''); setDeviceDraft(''); setStateDraft(''); setSetupError(''); setScreen('educator-setup'); }} style={{ background: 'none', border: 'none', color: C.muted, fontFamily: FONT, fontSize: 14, cursor: 'pointer', padding: '4px 12px', textDecoration: 'underline' }}>Create account</button>
          )}
          <ContactLine onOpen={() => setShowContact(true)} inline />
        </div>
        {/* The privacy note sits at the very foot of the page, padded evenly and never wider than the column. */}
        <p style={{ color: C.muted, fontSize: 13, margin: 'auto 0 0', padding: '72px 36px 12px', textAlign: 'center', maxWidth: '100%', boxSizing: 'border-box' }}>All of your school's important information lives entirely on this device (students, student progression, educator settings, transcripts etc).</p>
        <p className="edu-no-print" style={{ color: C.muted, fontSize: 11, opacity: 0.7, margin: '0 0 14px', textAlign: 'center' }}>Build {BUILD_STAMP}</p>
        {showContact && <ContactPopup onClose={() => setShowContact(false)} />}
        {/* A PIN keeps classmates out of each other's records on a shared screen. Four digits, then Go. */}
        {pinAsk && (() => { const st = findStudent(roster, pinAsk); if (!st) return null; const tryIt = () => { if (pinMatches(st, pinTry)) { setPinAsk(null); startWithName(st.id); } else { setPinWrong(true); setPinTry(''); } }; return (
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, background: 'rgba(36, 41, 31, 0.55)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            <div className="edu-rise" style={{ width: '100%', maxWidth: 340, background: C.surface, borderRadius: 14, padding: 20, textAlign: 'center' }}>
              {st.picture && <StudentPicture name={st.picture} tint={st.tint} size={56} />}
              <p style={{ margin: '8px 0 12px', fontSize: 18, fontWeight: 600 }}>{keepTogether(st.label)}</p>
              <PinInput value={pinTry} onChange={setPinTry} placeholder="Your PIN" onEnter={tryIt}
                style={{ fontFamily: FONT, fontSize: 24, letterSpacing: 8, textAlign: 'center', padding: '12px 14px', width: '100%', boxSizing: 'border-box', border: `2px solid ${pinWrong ? C.clay : C.line}`, borderRadius: 10, marginBottom: 10 }} />
              {pinWrong && <p style={{ margin: '0 0 10px', fontSize: 14, color: C.clay }}>That is not the PIN. Try again.</p>}
              <Btn full onClick={tryIt} disabled={pinTry.length < PIN_LENGTH}>Go</Btn>
              <div style={{ marginTop: 8 }}><button type="button" style={linkBtn} onClick={() => setPinAsk(null)}>Not me</button></div>
            </div>
          </div>
        ); })()}
      </div></div>
    );
  }

  if (screen === 'coloring' && coloring) {
    return (
      <div style={page}><PageChrome idleWarning={idleWarning} logoutIn={logoutIn} walkthrough={!!(record && record.preview)} /><div className="edu-wrap edu-wrap-wide" style={wrap}>
        {coloring.startsWith('play:') ? <GamePad key={coloring} game={GAMES.find((g) => `play:${g.id}` === coloring) || GAMES[0]} name={displayName} secondsLeft={colorLeft} total={COLOR_BREAK_SECONDS} onClose={leaveColoring} /> : (
          <ColoringPad key={`${coloring}-${displayName}`} picture={coloring} name={displayName} secondsLeft={colorLeft} total={COLOR_BREAK_SECONDS} saved={(colorState[coloring] || {}).art} onArt={(art) => { colorArt.current = art; }} onClose={leaveColoring} />
        )}

      </div></div>
    );
  }

  if (screen === 'overview') {
    const firstVisit = !(record.events || []).some((e) => e.type === 'attempt_completed' || e.type === 'lesson_viewed' || e.type === 'story_read' || e.type === 'colored');
    const mastered = visibleModules.filter((m) => progress.masteredIds.includes(m.id)).length;
    const youngGroups = (() => {
      const isPreK = (c) => c.grade === 'PK3' || c.grade === 'PK4';
      // Every pre-K module comes first: the skill folds stay, and kindergarten waits out of sight
      // until the last of them is mastered, so the screen never changes shape halfway through pre-K.
      const preK = shownCourses.some((c) => isPreK(c) && c.modules.some((m) => !progress.masteredIds.includes(m.id)));
      if (!preK) return shownSubjects.filter((sub) => !placementPending.includes(sub)).map((sub) => ({ key: sub, courses: shownCourses.filter((c) => c.subject === sub).sort(byGradeOrder) }));
      const bySkill = new Map();
      shownCourses.filter(isPreK).forEach((c, ci) => c.modules.forEach((m) => { const k = m.skill || c.subject; if (!bySkill.has(k)) bySkill.set(k, []); bySkill.get(k).push({ ...m, order: ci * 100 + m.order }); }));
      return SKILL_ORDER.filter((k) => bySkill.has(k)).map((k) => ({ key: k, courses: [{ id: `skill-${k}`, title: k, modules: bySkill.get(k).sort((a, b) => a.order - b.order) }] }));
        })().filter((group) => {
      // A skill or subject with nothing left to do today drops off a young learner's screen.
      if (!youngLearner) return true;
      const today = new Date().toISOString();
      return group.courses.some((c) => c.modules.some((m) => statusOf(m.id) !== 'locked' && statusOf(m.id) !== 'mastered' && !waitingForAnotherDay(record.events, m.id, today)));
        });
    return (
      <div style={page}><PageChrome idleWarning={idleWarning} logoutIn={logoutIn} walkthrough={!!(record && record.preview)} /><div className="edu-wrap" style={wrap}>
        <div style={{ position: 'relative', paddingTop: 6 }}>
          <h1 style={{ fontSize: 26, margin: '18px 0 8px', textAlign: 'center' }}>Your courses</h1>
          {/* A first visit: one line that says what to tap, gone as soon as anything has been done. The available buttons already glow. */}
          {firstVisit && (
            <p style={{ margin: '0 0 12px', fontSize: 16, textAlign: 'center', color: C.green, fontWeight: 600 }}>Tap a glowing button to start your first lesson.</p>
          )}
          <button type="button" onClick={async () => { if (record && record.preview) { setRecord(null); setScreen('educator-pick'); } else { await autoBackup('sign-out'); setScreen('welcome'); } }} style={{ position: 'absolute', top: 0, right: 0, background: 'none', border: 'none', color: C.green, fontFamily: FONT, fontSize: 15, cursor: 'pointer' }}>Exit</button>
        </div>
        <p className="edu-overview-body" style={{ color: C.muted, margin: '0 0 22px', textAlign: 'center', fontSize: youngLearner ? 22 : 18, fontWeight: youngLearner ? 600 : 400 }}>{record.preview ? 'Walkthrough mode. Nothing here is recorded.' : `Hi ${displayName}, welcome back!`}</p>
        <RemembranceCard />
        {!youngLearner && placementPending.map((subject) => (
          <div key={subject} style={{ ...card, background: C.greenSoft, borderColor: C.green, textAlign: 'center', marginTop: 18 }}>
            <p style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 700 }}>Find your starting point in {subject.toLowerCase()}</p>
            <p style={{ margin: '0 0 12px', fontSize: 15 }}>A short check to see where you are. For each grade, there are four questions and as you clear them, you move up. The first grade not cleared is where you'll land and you can build upon the knowledge you already have. Incorrect answers do not count against you in any way.</p>
            <Btn onClick={() => startPlacement(subject)} disabled={busy}>Start the placement check</Btn>
            <p style={{ margin: '10px 0 0', fontSize: 13 }}><button type="button" onClick={() => skipPlacement(subject)} style={{ ...linkBtn, fontSize: 13, padding: 0 }}>Start at the beginning instead</button></p>
          </div>
        ))}
        {!youngLearner && !record.preview && checkpointDue(record.events) && (
          <div style={{ ...card, background: C.goldSoft, borderColor: C.gold, textAlign: 'center' }}>
            <p style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 700 }}>Checkpoint</p>
            <p style={{ margin: '0 0 12px', fontSize: 15 }}>You have passed {checkpointDue(record.events).atCount} modules. Here are eight questions from what you have learned so far. Nothing new, just a look back to see what stuck.</p>
            <Btn onClick={startCheckpoint} disabled={busy}>Start the checkpoint</Btn>
          </div>
        )}
        {!youngLearner && placementPending.length === 0 && (
          <div style={card}>
            <p style={{ margin: '0 0 8px', fontWeight: 600 }}>{mastered} of {visibleModules.length} modules mastered</p>
            <FractionBar parts={Math.max(1, visibleModules.length)} shaded={mastered} color={C.gold} height={36} />
          </div>
        )}
        {visibleCourses.length === 0 && <div style={card}><p style={{ margin: 0, color: C.muted }}>No courses are switched on for you yet. Ask your educator.</p></div>}

        {/* Subjects stack vertically at the same width, so ten of them look as tidy as two.
            Only one opens at a time, and the modules appear underneath it. */}
        {/* One module card, drawn the same way whether it comes before or after the finished fold. */}
                      {(() => { renderModuleCard = (course, m, st, p, locked) => (
                          <div key={m.id} style={{ ...card, marginBottom: 10, opacity: locked || (m.needsTouch && !hasTouchScreen()) ? 0.6 : 1, borderColor: st === 'mastered' ? C.gold : st === 'available' ? C.green : C.line, borderWidth: isPreReader(course.id) && st === 'available' ? 3 : 1, boxShadow: isPreReader(course.id) && st === 'available' ? `0 0 0 4px ${C.greenSoft}` : 'none' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                              <div>
                                <h2 style={{ fontSize: 18, margin: '0 0 2px' }}>{m.title}</h2>
                                <p style={{ margin: 0, color: C.muted, fontSize: 15 }}>{m.tagline}</p>
                              </div>
                              {isPreReader(course.id) ? <StatusMark status={st} /> : <Tag tone={st}>{st === 'mastered' ? 'Mastered' : st === 'passed' ? 'Passed once' : st === 'available' ? 'Ready' : 'Locked'}</Tag>}
                            </div>
                            {youngLearner && st === 'passed' && <p style={{ color: C.muted, fontSize: 15, margin: '8px 0 0' }}>Passed once. Pass again to master.</p>}
                            {p.attempts > 0 && !isPreReader(course.id) && <p style={{ color: C.muted, fontSize: 14, margin: '10px 0 0' }}>Best score {p.bestCore} of {moduleRules(m.id).questions}{st === 'passed' ? '. Pass it again on another day to master it.' : ''}</p>}
                            {refreshIds.includes(m.id) && <p style={{ color: C.clay, fontSize: 14, margin: '6px 0 0', fontWeight: 600 }}>Missed in the last checkpoint. A quick refresher round will help.</p>}
                            {p.pendingWriting && <p style={{ color: C.gold, fontSize: 14, margin: '6px 0 0', fontWeight: 600 }}>Handed in. Waiting for your teacher to check it.</p>}
                            {locked ? (
                              !isPreReader(course.id) && <p style={{ color: C.muted, fontSize: 14, margin: '10px 0 0' }}>Finish the module before this one first.</p>
                            ) : m.needsTouch && !hasTouchScreen() ? (
                              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                                <p style={{ margin: 0, width: '34%', minWidth: 150, textAlign: 'center', alignSelf: 'center', fontSize: 14, fontWeight: 600, color: C.clay }}>This needs a touch screen. An iPad or another large tablet with a stylus is best.</p>
                              </div>
                            ) : (
                              <div style={{ marginTop: 12 }}>
                                <Btn halo={st === 'available'} kind={st === 'mastered' ? 'secondary' : 'primary'} onClick={() => openModule(m.id)} disabled={busy}>{st === 'mastered' ? 'Practice again' : st === 'passed' ? 'Pass it again' : 'Open'}</Btn>
                                {/* One try per module: five questions, no lesson, and a pass places the module without the star. */}
                                {st === 'available' && !(record && record.preview) && quickChecks && quickCheckAllowed(record.events, m.id) && (
                                  <div style={{ marginTop: 8 }}><button type="button" style={linkBtn} onClick={() => startQuickCheck(m.id)} disabled={busy}>I already know this</button></div>
                                )}
                              </div>
                            )}
                          </div>
                        ); return null; })()}
        {/* Pre-K groups by the skill being practised (Colors, Shapes, Counting); every other grade
            groups by subject. Only this screen changes: courses, transcripts and reports are untouched. */}
        {youngGroups.map((group) => {
          const sub = group.key;
          const isOpen = openSubject === sub;
          const subCourses = group.courses;
          const subModules = subCourses.flatMap((c) => c.modules);
          const done = subModules.filter((m) => progress.masteredIds.includes(m.id)).length;
          return (
            <div key={sub} style={{ ...card, padding: 0, overflow: 'visible', position: 'relative', borderColor: isOpen ? C.green : C.line }}>
              {/* A closed subject with something ready inside breathes gently, so a young child knows where to tap. */}
              <button type="button" onClick={() => setOpenSubject(isOpen ? null : sub)} aria-expanded={isOpen}
                className="edu-breathe"
                style={{ fontFamily: FONT, width: '100%', textAlign: 'left', background: 'transparent', border: 'none', padding: 16, cursor: 'pointer', color: C.ink, '--beat': youngLearner && !isOpen && subModules.some((m) => statusOf(m.id) === 'available') ? 1 : 0, ...inBeat(2.2) }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}><SkillIcon skill={sub} /><span style={{ fontSize: 21, fontWeight: 600 }}>{sub}</span></span>
                  <span style={{ fontSize: 14, color: C.muted, whiteSpace: 'nowrap' }}>{done} of {subModules.length} {isOpen ? '▴' : '▾'}</span>
                </div>
                <div style={{ marginTop: 8 }}><FractionBar parts={Math.max(1, subModules.length)} shaded={done} color={C.gold} height={12} /></div>
              </button>
              {isOpen && (
                <div style={{ padding: '0 12px 12px' }}>
                  {subCourses.map((course) => (
                    <div key={course.id}>
                      {subCourses.length > 1 && !youngLearner && <p style={{ margin: '10px 0 2px', fontSize: 14, color: C.muted, paddingLeft: 4 }}>{course.title}</p>}
                      {/* Where the standards name dates to know, they sit at the top of the course, before the first module. */}
                      {REFERENCE_DATES[course.id] && (
                        <div style={{ ...card, padding: '12px 14px', marginBottom: 10, background: C.goldSoft || C.surface }}>
                          <p style={{ margin: '0 0 6px', fontWeight: 600, fontSize: 15 }}>Dates to know</p>
                          {REFERENCE_DATES[course.id].map(([year, what]) => <p key={year} style={{ margin: '2px 0', fontSize: 14 }}><strong>{year}</strong>: {what}</p>)}
                        </div>
                      )}
                      {course.modules.slice().sort((a, b) => a.order - b.order).map((m) => {
                        const st = statusOf(m.id);
                        const p = progress.perModule[m.id];
                        const locked = st === 'locked';
                        // Young learners see only what they can do now: locked work would clutter the screen,
                        // and a module passed today can only be mastered on another day, so it waits until then.
                        if (youngLearner && locked) return null;
                        if (youngLearner && waitingForAnotherDay(record.events, m.id, new Date().toISOString())) return null;
                        if (isPreReader(course.id) && st === 'mastered' && (youngLearner || !showFinished)) return null;
                        return renderModuleCard(course, m, st, p, locked);
                      })}
                      {isPreReader(course.id) && !youngLearner && course.modules.some((m) => statusOf(m.id) === 'mastered') && (
                        <button type="button" onClick={() => setShowFinished(!showFinished)} aria-expanded={showFinished} aria-label="Finished modules"
                          style={{ fontFamily: FONT, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: C.goldSoft, border: 'none', borderRadius: 10, padding: '10px 14px', marginBottom: 10, cursor: 'pointer', color: C.ink }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <StatusMark status="mastered" size={24} />
                            <span style={{ fontSize: 15, fontWeight: 600 }}>{course.modules.filter((m) => statusOf(m.id) === 'mastered').length}</span>
                          </span>
                          <span style={{ fontSize: 14, color: C.muted }}>{showFinished ? '▴' : '▾'}</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {/* Let's Color: a grid of drawings, no words. One more picture for every module passed.
            A picture rests for fifteen minutes after its five, and fills with color while it rests. */}
        {(() => {
          // Coloring is for pre-K through grade 2. Once a student has graduated the early years it goes.
          if (!youngLearner) return null;
          // An educator's walk-through sees every picture, unlocked and rested, so they can look at all of them.
          const unlocked = record.preview ? COLORING_PICTURES.length : coloringUnlocked(record.events); const open = openSubject === '__coloring';
          const restLeft = (pic) => (record.preview ? 0 : Math.max(0, ((colorState[pic] || {}).restUntil || 0) - colorNow));
          const anyReady = COLORING_PICTURES.slice(0, unlocked).some((pic) => restLeft(pic) === 0);
          return (
            <div style={{ ...card, padding: 0, overflow: 'hidden', marginBottom: 12 }}>
              <button type="button" aria-expanded={open} aria-label="Let's Color" onClick={() => setOpenSubject(open ? null : '__coloring')}
                className={`edu-colorwash${anyReady ? ' edu-press' : ''}`}
                style={{ fontFamily: FONT, width: '100%', border: 'none', padding: 16, cursor: 'pointer', color: C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                <span className="edu-sparkle" aria-hidden="true" />
                <span className="edu-sparkle edu-sparkle-2" aria-hidden="true" />
                <span className="edu-sparkle edu-sparkle-3" aria-hidden="true" />
                <span className="edu-sparkle edu-sparkle-4" aria-hidden="true" />
                <span style={{ fontSize: 20, fontWeight: 700, position: 'relative' }}>Let's Color</span>
                <span aria-hidden="true" style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: C.muted }}>{open ? '▴' : '▾'}</span>
              </button>
              {open && (
                <div className="edu-colorwash" style={{ padding: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(96px, 1fr))', gap: 10 }}>
                    {COLORING_PICTURES.map((pic, i) => {
                      const locked = i >= unlocked;
                      const resting = !locked && restLeft(pic) > 0;
                      const restFraction = resting ? restLeft(pic) / (COLOR_LOCKOUT_MINUTES * 60000) : 0;
                      return (
                        <button key={pic} type="button" disabled={locked || resting} aria-label={locked ? 'Locked picture' : resting ? 'Resting picture' : `Color the ${pic === 'my-name' ? 'name' : pictureTitle(pic).toLowerCase()}`}
                          onClick={() => { setColoring(pic); setScreen('coloring'); }} className={`edu-breathe${!locked && !resting ? ' edu-press' : ''}`}
                          style={{ position: 'relative', overflow: 'hidden', aspectRatio: '1 / 1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 6, borderRadius: 12, background: locked ? 'rgba(255,255,255,0.55)' : '#FFFFFF', border: `2px solid ${locked || resting ? 'rgba(255,255,255,0.7)' : C.ink}`, cursor: locked || resting ? 'default' : 'pointer', '--beat': locked || resting ? 0 : 1, ...inBeat(2.2) }}>
                          {locked ? (
                            <svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true"><path d="M7 10V8a5 5 0 0110 0v2" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round" /><rect x="5" y="10" width="14" height="10" rx="2" fill={C.line} stroke={C.muted} strokeWidth="1.5" /></svg>
                          ) : (
                            <>
                              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}><ColorThumb picture={pic} name={displayName} size="100%" /></span>
                              {/* Resting: grey covers the whole square and sweeps away like a clock hand, so the
                                  drawing comes back into view as its break runs down. */}
                              {resting && (
                                <span aria-hidden="true" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, pointerEvents: 'none', background: `conic-gradient(from 0deg, rgba(150,158,152,0.92) 0 ${(restFraction * 100).toFixed(1)}%, rgba(150,158,152,0) ${(restFraction * 100).toFixed(1)}% 100%)` }} />
                              )}
                            </>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ); })()}
        {/* Let's Play: the same fold as Let's Color, for games. One more game for every course
            mastered; a game rests like a picture does. Harder games wait for the grade that suits them. */}
        {(() => {
          if (!youngLearner) return null;
          const top = visibleCourses.reduce((best, c) => (GRADES.indexOf(c.grade) > GRADES.indexOf(best) ? c.grade : best), 'PK3');
          const games = record.preview ? GAMES : gamesFor(top);
          const unlocked = record.preview ? games.length : Math.min(games.length, gamesUnlocked(record.events)); const open = openSubject === '__play';
          const restLeft = (g) => (record.preview ? 0 : Math.max(0, ((colorState[`play:${g.id}`] || {}).restUntil || 0) - colorNow));
          const anyReady = games.slice(0, unlocked).some((g) => restLeft(g) === 0);
          return (
            <div style={{ ...card, padding: 0, overflow: 'hidden', marginBottom: 12 }}>
              <button type="button" aria-expanded={open} aria-label="Let's Play" onClick={() => setOpenSubject(open ? null : '__play')}
                className={`edu-colorwash${anyReady ? ' edu-press' : ''}`}
                style={{ fontFamily: FONT, width: '100%', border: 'none', padding: 16, cursor: 'pointer', color: C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                <span className="edu-sparkle" aria-hidden="true" />
                <span className="edu-sparkle edu-sparkle-2" aria-hidden="true" />
                <span className="edu-sparkle edu-sparkle-3" aria-hidden="true" />
                <span className="edu-sparkle edu-sparkle-4" aria-hidden="true" />
                <span style={{ fontSize: 20, fontWeight: 700, position: 'relative' }}>Let's Play</span>
                <span aria-hidden="true" style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: C.muted }}>{open ? '▴' : '▾'}</span>
              </button>
              {open && (
                <div className="edu-colorwash" style={{ padding: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(96px, 1fr))', gap: 10 }}>
                    {games.map((g, i) => {
                      const locked = i >= unlocked; const resting = !locked && restLeft(g) > 0;
                      const restFraction = resting ? restLeft(g) / (COLOR_LOCKOUT_MINUTES * 60000) : 0;
                      return (
                        <button key={g.id} type="button" disabled={locked || resting} aria-label={locked ? 'Locked game' : resting ? 'Resting game' : `Play ${g.title}`}
                          onClick={() => { setColoring(`play:${g.id}`); setScreen('coloring'); }} className={`edu-breathe${!locked && !resting ? ' edu-press' : ''}`}
                          style={{ position: 'relative', overflow: 'hidden', aspectRatio: '1 / 1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 12, background: locked ? 'rgba(255,255,255,0.55)' : '#FFFFFF', border: `2px solid ${locked || resting ? 'rgba(255,255,255,0.7)' : C.ink}`, cursor: locked || resting ? 'default' : 'pointer', '--beat': locked || resting ? 0 : 1, ...inBeat(2.2) }}>
                          {locked ? (
                            <svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true"><path d="M7 10V8a5 5 0 0110 0v2" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round" /><rect x="5" y="10" width="14" height="10" rx="2" fill={C.line} stroke={C.muted} strokeWidth="1.5" /></svg>
                          ) : (
                            <>
                              <GameThumb kind={g.kind} game={g} />
                              {resting && (
                                <span aria-hidden="true" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, pointerEvents: 'none', background: `conic-gradient(from 0deg, rgba(150,158,152,0.92) 0 ${(restFraction * 100).toFixed(1)}%, rgba(150,158,152,0) ${(restFraction * 100).toFixed(1)}% 100%)` }} />
                              )}
                            </>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })()}
        {youngLearner && !record.preview && youngGroups.length === 0 && (
          <div className="edu-rise" style={{ ...card, background: C.goldSoft, borderColor: C.gold, textAlign: 'center', padding: '22px 18px' }}>
            <StarBurst />
            <p style={{ fontSize: 24, fontWeight: 700, margin: '10px 0 0' }}>Well done! Come back tomorrow.</p>
            <div style={{ marginTop: 12 }}><SpeakButton text="Well done! Come back tomorrow." label="Say it again" /></div>
          </div>
        )}
        {youngLearner ? (
          <div style={{ paddingTop: 16 }}>
            <div style={{ ...card, background: C.goldSoft, borderColor: C.goldSoft, marginBottom: 0 }}>
              {/* A row of stars says how far they have come, without a number to read. Filled ones
                  come first, from the left, the way counting goes. Finished modules are not offered
                  again here: memory checks bring old work back inside later rounds by themselves. */}
              <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 4, flexWrap: 'wrap' }}>
                {[...visibleModules.filter((m) => earlyModuleIds.includes(m.id))].sort((a, b) => (progress.masteredIds.includes(b.id) ? 1 : 0) - (progress.masteredIds.includes(a.id) ? 1 : 0)).map((m) => (
                  <svg key={m.id} viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
                    <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" fill={progress.masteredIds.includes(m.id) ? C.gold : C.line} />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        ) : (
          placementPending.length === 0 && <Btn kind="secondary" full onClick={() => setScreen('my-progress')}>My progress</Btn>
        )}
        {saveNote && <p style={{ color: C.muted, fontSize: 13, textAlign: 'center', marginTop: 32 }}>{saveNote}</p>}
        {errorMsg && <p style={{ color: C.clay }}>{errorMsg}</p>}
      </div></div>
    );
  }


  // A lesson for a child who cannot read: one spoken line at a time, the picture doing
  // most of the work, and two big arrows. No paragraphs, no labels, nothing to read.
  if (screen === 'lesson' && mod && course && course.readAloud) {
    const script = mod.lesson.script || [{ say: mod.lesson.example.caption, show: mod.lesson.example }];
    const step = script[Math.min(lessonStep, script.length - 1)];
    const line = step.say;
    const last = lessonStep >= script.length - 1;
    return (
      <div style={page}><PageChrome idleWarning={idleWarning} logoutIn={logoutIn} walkthrough={!!(record && record.preview)} /><div className="edu-wrap" style={wrap}>
        <button type="button" onClick={() => setScreen('overview')} aria-label="Back" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke={C.green} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <div key={lessonStep} className="edu-rise" style={{ ...card, textAlign: 'center', padding: '20px 18px' }}>
          <Picture visual={step.show} animate animKey={`${lessonStep}-${replays}`} />

          <p style={{ fontSize: 22, lineHeight: 1.5, margin: '18px 0 0' }}>{sentencesOf(line).map((sentence, i) => <span key={i} style={{ background: litSentence === i ? C.goldSoft : 'transparent', borderRadius: 6, padding: litSentence === i ? '0 4px' : 0, transition: 'background 150ms' }}>{sentence}{i < sentencesOf(line).length - 1 ? ' ' : ''}</span>)}</p>
        </div>
        {/* One tap repeats the line, in case they missed it. */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
          {canSpeak() ? (
            <button type="button" onClick={() => { speak(line); setReplays((n) => n + 1); }} aria-label="Say it again" className="edu-press edu-sway"
              style={{ width: 66, height: 66, borderRadius: 999, border: `3px solid ${C.gold}`, background: C.goldSoft, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true">
                <path d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4z" fill={C.gold} />
                <path d="M15.5 8.5a5 5 0 010 7M18 6a8.5 8.5 0 010 12" fill="none" stroke={C.gold} strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          ) : (
            <p style={{ margin: 0, fontSize: 14, color: C.muted }}>Reading aloud is not available in this preview.</p>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <BigTap dir="back" label="Go back" disabled={lessonStep === 0} onClick={() => setLessonStep(Math.max(0, lessonStep - 1))} />
          <div style={{ display: 'flex', gap: 6 }}>
            {script.map((_, i) => <span key={i} style={{ width: 9, height: 9, borderRadius: 999, background: i === lessonStep ? C.green : C.line }} />)}
          </div>
          {last ? (
            <span style={{ position: 'relative', display: 'inline-flex' }}>
              <button type="button" onClick={startPractice} aria-label="Start practice" className="edu-press edu-pulse"
                style={{ position: 'relative', width: 66, height: 66, borderRadius: 999, border: `3px solid ${C.gold}`, background: C.gold, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg className="edu-star-twinkle" viewBox="0 0 24 24" width="40" height="40" aria-hidden="true" style={{ transformOrigin: 'center' }}><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" fill="#fff" /></svg>
              </button>
            </span>
          ) : (
            <BigTap dir="next" label="Next" onClick={() => setLessonStep(lessonStep + 1)} />
          )}
        </div>
      </div></div>
    );
  }

  if (screen === 'story' && mod && storyFor(mod.id)) {
    return (
      <div style={page}><PageChrome idleWarning={idleWarning} logoutIn={logoutIn} walkthrough={!!(record && record.preview)} /><div className="edu-wrap" style={wrap}>
        <div className="edu-no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <button type="button" onClick={() => setScreen('lesson')} style={{ background: 'none', border: 'none', color: C.green, fontFamily: FONT, fontSize: 15, cursor: 'pointer', padding: 0 }}>Back to the lesson</button>
          <button type="button" onClick={() => window.print()} style={{ background: 'none', border: 'none', color: C.muted, fontFamily: FONT, fontSize: 13, cursor: 'pointer', padding: 0 }}>Print</button>
        </div>
        <div className="edu-story-sheet"><StoryBody story={storyFor(mod.id)} /></div>
        <div style={{ marginTop: 16 }}><Btn full onClick={startPractice}>Practice this</Btn></div>
      </div></div>
    );
  }
  if (screen === 'lesson' && mod) {
    return (
      <div style={page}><PageChrome idleWarning={idleWarning} logoutIn={logoutIn} walkthrough={!!(record && record.preview)} /><div className="edu-wrap" style={wrap}>
        <button type="button" onClick={() => setScreen('overview')} style={{ background: 'none', border: 'none', color: C.green, fontFamily: FONT, fontSize: 15, cursor: 'pointer', padding: 0 }}>Back to overview</button>
        <p style={{ color: C.muted, margin: '-22px 0 0', fontSize: 14, textAlign: 'right' }}>Module {mod.order} of {course.modules.length}</p>
        <h1 style={{ fontSize: 26, margin: '14px 0 22px', textAlign: 'center' }}>{mod.title}</h1>
        <div style={card}>
          {mod.lesson.paragraphs.map((t, i) => <RichText key={i} text={formatTeachingText(t)} size={17} lineGap={12} />)}
          <div style={{ background: C.greenSoft, borderRadius: 10, padding: 14 }}>
            <Picture visual={wayVisual(mod.lesson.example, anotherWay)} />
            {mod.lesson.example.formula && <p style={{ margin: '10px 0 0', fontSize: 17, fontWeight: 700, textAlign: 'center' }}>{mod.lesson.example.formula}</p>}
            {(() => {
              const ways = [mod.lesson.example.caption, ...[].concat(mod.lesson.example.another || []).map((w) => (typeof w === 'string' ? w : w.text))].filter(Boolean).slice(0, 4); const at = Math.min(anotherWay, ways.length - 1);
              return (<>
                <div style={{ margin: '10px 0 0' }}><RichText text={ways[at]} size={15} center lineGap={6} /></div>
                {ways.length > 1 && <p style={{ margin: '8px 0 0', textAlign: 'center' }}><button type="button" style={{ ...linkBtn, fontSize: 14 }} onClick={() => setAnotherWay((at + 1) % ways.length)}>{at === ways.length - 1 ? 'Show me the first way' : at === 0 ? 'Show me another way' : 'Show me one more way'}</button>{ways.length > 2 && <span style={{ marginLeft: 8, fontSize: 12, color: C.muted }}>{at + 1} of {ways.length}</span>}</p>}
              </>);
            })()}
          </div>
        </div>
        {(missed[mod.id] || []).length > 0 && (
          <div style={{ ...card, borderColor: C.gold }}>
            <p style={{ margin: '0 0 6px', fontWeight: 600 }}>Look again</p>
            {missed[mod.id].map((line, i) => <p key={i} style={{ margin: '4px 0', fontSize: 15 }}>“{line}”</p>)}
          </div>
        )}
        <div style={{ ...card, background: C.goldSoft, borderColor: C.goldSoft }}>
          <p style={{ margin: 0, fontWeight: 600 }}>Key idea</p>
          <div style={{ marginTop: 6 }}><RichText text={formatTeachingText(mod.lesson.keyIdea)} size={16} /></div>
        </div>
        {<SpeakButton full text={[...mod.lesson.paragraphs, mod.lesson.example.formula || '', mod.lesson.example.caption, mod.lesson.keyIdea].join(' ')} label="Read it to me" />}
        {storyFor(mod.id)
          ? <Btn full onClick={() => { if (record && !record.preview && !record.events.some((e) => e.type === 'story_read' && e.moduleId === mod.id)) addEvent(makeStoryReadEvent(mod.id, new Date().toISOString())); setScreen('story'); }}>View story</Btn>
          : <Btn full onClick={startPractice}>Practice this</Btn>}
        <p style={{ color: C.muted, fontSize: 13, marginTop: 48, textAlign: 'center' }}>Source: {mod.sources.join(' ')}</p>
      </div></div>
    );
  }

  if (screen === 'practice' && q) {
    return (
      <div style={page}><PageChrome idleWarning={idleWarning} logoutIn={logoutIn} walkthrough={!!(record && record.preview)} /><div className="edu-wrap" style={wrap}>
        {/* Module name on the left, the question count in the middle, and a bold green X on the
            right that leaves the round. Leaving mid-round records nothing, so nobody is locked in. */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 10, margin: '4px 0 0' }}>
          <p style={{ color: C.muted, fontSize: 14, margin: 0 }}>{isReviewQ ? 'Quick review from an earlier module' : `${roundLabel}Question ${qIndex + 1} of ${attempt.core.length}`}</p>
          <button type="button" onClick={() => setScreen('overview')} aria-label="Back" title="Leave this round"
            style={{ justifySelf: 'end', background: 'none', border: 'none', color: C.green, width: 36, height: 36, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" /></svg>
          </button>
        </div>
        {!isReviewQ && <p style={{ margin: '10px 0 18px', fontSize: 18, fontWeight: 600, textAlign: 'center' }}>{mod.title}</p>}
        <div style={{ ...card, position: 'relative' }}>
          <p style={{ fontSize: 20, fontWeight: 600, margin: readAloud ? '8px 0 12px' : '0 0 12px', textAlign: 'center', padding: readAloud ? '0 66px' : 0, minHeight: readAloud ? 48 : 0 }}>{q.prompt}</p>
          {q.story && <div style={{ margin: '0 0 14px', color: C.ink }}><RichText text={q.story} size={17} center lineGap={8} /></div>}
          {q.visual && <div style={{ margin: '0 0 14px' }}><Picture visual={q.visual} /></div>}
          <SpeakButton corner text={questionText} label={readAloud ? 'Hear it again' : 'Read it to me'} />
          {q.type === 'choice' ? (
            <div style={{ display: 'grid', gap: 10, gridTemplateColumns: q.choices.every((c) => /^(\d+|[A-Za-z])$/.test(c)) ? 'repeat(auto-fit, minmax(70px, 1fr))' : '1fr' }}>
              {q.choices.map((c) => {
                const picked = given === c;
                let bg = C.surface; let border = C.line;
                const ruledOut = wrongPicks.includes(c);
                if (ruledOut) bg = '#EDEFEA';
                if (checked && c === q.answer) { bg = C.greenSoft; border = C.green; }
                else if (checked && picked) { bg = C.claySoft; border = C.clay; }
                else if (picked) { border = C.green; }
                return (
                  // A word answer says itself for a child who cannot read; a picture answer never does,
                  // because naming it would hand over the answer.
                  <button key={c} type="button" data-choice={c} onClick={() => { if (!checked) { if (readAloud) { playTap(); if (!c.includes(':')) speak(c); } setGiven(c); } }}
                    style={{ opacity: ruledOut && !checked ? 0.45 : 1, fontFamily: FONT, fontSize: choiceFont(q.choices), textAlign: 'center', padding: '12px 10px', minWidth: 0, overflowWrap: 'anywhere', borderRadius: 10, background: bg, border: `2px solid ${border}`, color: C.ink, cursor: checked ? 'default' : 'pointer', minHeight: 48 }}>
                    {/^dots:(\d+)$/.test(c) ? <DotGroup count={Number(c.split(':')[1])} size={28} /> : /^shape:/.test(c) ? <ShapePic name={c.split(':')[1]} size={c.endsWith(':big') ? 88 : c.endsWith(':small') ? 34 : c.endsWith(':medium') ? 58 : 64} /> : /^tens:(\d+)$/.test(c) ? <TensGroup count={Number(c.split(':')[1])} size={14} /> : /^bar:(\d+)$/.test(c) ? <BarPic length={Number(c.split(':')[1])} size={18} /> : /^tower:(\d+)$/.test(c) ? <BarPic length={Number(c.split(':')[1])} vertical size={14} /> : /^solid:/.test(c) ? <SolidPic name={c.slice(6)} size={64} /> : /^pic:/.test(c) ? <StudentPicture name={c.slice(4).split('#')[0]} size={72} /> : /^art:/.test(c) ? <ColorThumb picture={c.slice(4).split('#')[0]} size={84} /> : /^icon:/.test(c) ? <IconPic name={c.slice(5)} size={64} /> : /^swatch:/.test(c) ? <Swatch colour={c.slice(7)} size={64} /> : /^item:/.test(c) ? <Item spec={c.slice(5)} size={64} /> : /^clock:/.test(c) ? <ClockPic hour={Number(c.split(':')[1])} minute={Number(c.split(':')[2])} size={80} /> : /^array:/.test(c) ? <ArrayPic rows={Number(c.slice(6).split('x')[0])} cols={Number(c.slice(6).split('x')[1])} size={12} /> : c}
                  </button>
                );
              })}
            </div>
          ) : q.type === 'writing' ? (
            <div>
              <div style={{ padding: 14, borderRadius: 10, background: C.goldSoft, marginBottom: 12 }}>
                <p style={{ margin: '0 0 6px', fontWeight: 600 }}>{q.medium === 'typed' ? 'Type this in a word processor.' : 'Write this by hand, on paper.'}</p>
                <p style={{ margin: 0, fontSize: 15 }}>Aim for about {q.minWords} words. {q.medium === 'typed' ? 'Print it or send it the way your teacher asks, then' : 'When you are done,'} check your work against the list below and tap the button. Your teacher will read it and check it off.</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 15 }}>{ticks.length} of {q.checklist.length} requirements checked</p>
                <button type="button" style={linkBtn} onClick={() => setShowRequirements(true)}>Requirements</button>
              </div>
              {showRequirements && (
                <div role="dialog" aria-label="Requirements" style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 40 }} onClick={() => setShowRequirements(false)}>
                  <div style={{ ...card, maxWidth: 520, width: '100%', maxHeight: '80vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
                    <p style={{ margin: '0 0 10px', fontWeight: 600, fontSize: 17 }}>Requirements</p>
                    <p style={{ margin: '0 0 10px', fontSize: 14, color: C.muted }}>Check each one against your work before you hand it in.</p>
                    {q.checklist.map((item, i2) => (
                      <label key={i2} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '8px 0', fontSize: 15, cursor: 'pointer', borderTop: `1px solid ${C.line}` }}>
                        <input type="checkbox" checked={ticks.includes(i2)} onChange={() => setTicks((t) => (t.includes(i2) ? t.filter((x) => x !== i2) : [...t, i2]))} style={{ width: 20, height: 20, marginTop: 2 }} />
                        <span>{item}</span>
                      </label>
                    ))}
                    <div style={{ textAlign: 'center', marginTop: 12 }}><Btn onClick={() => setShowRequirements(false)}>Done</Btn></div>
                  </div>
                </div>
              )}
            </div>
          ) : q.type === 'order' ? (
            <div>
              {/* Tap the pieces in order; they move up into the sequence. Tapping a placed piece takes it back. */}
              <div style={{ minHeight: 52, padding: 8, borderRadius: 10, border: `2px dashed ${checked ? (wasCorrect ? C.green : C.clay) : C.line}`, display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12, justifyContent: 'center' }}>
                {orderPicked.length === 0 && <span style={{ color: C.muted, fontSize: 14, alignSelf: 'center' }}>Tap the pieces below in order.</span>}
                {orderPicked.map((item, i) => (
                  <button key={item} type="button" data-placed={item} disabled={checked} onClick={() => { const next = orderPicked.filter((x) => x !== item); setOrderPicked(next); setGiven(next.join(' | ')); }}
                    style={{ fontFamily: FONT, fontSize: 16, padding: '8px 12px', borderRadius: 8, background: C.greenSoft, border: `2px solid ${C.green}`, color: C.ink, cursor: checked ? 'default' : 'pointer' }}>
                    <span style={{ color: C.muted, marginRight: 6 }}>{i + 1}.</span>{item}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                {q.items.filter((item) => !orderPicked.includes(item)).map((item) => (
                  <button key={item} type="button" data-choice={item} disabled={checked} onClick={() => { const next = [...orderPicked, item]; setOrderPicked(next); setGiven(next.join(' | ')); }}
                    style={{ fontFamily: FONT, fontSize: 16, padding: '10px 14px', borderRadius: 10, background: C.surface, border: `2px solid ${C.line}`, color: C.ink, cursor: checked ? 'default' : 'pointer' }}>
                    {item}
                  </button>
                ))}
              </div>
              {checked && !wasCorrect && <p style={{ margin: '10px 0 0', fontSize: 14, color: C.muted, textAlign: 'center' }}>The order is: {q.answer.split(' | ').join(', then ')}.</p>}
            </div>
          ) : q.type === 'trace' ? (
            <div>
              {!hasTouchScreen() && <p style={{ margin: '0 0 8px', fontSize: 13, color: C.clay, textAlign: 'center', fontWeight: 600 }}>This needs a touch screen. An iPad or another large tablet with a stylus is best.</p>}
              {/* Two misses on the same trace, and the stroke draws itself above the pad as a hint. */}
              {misses >= 2 && !checked && (
                <div style={{ marginBottom: 12 }}>
                  <TraceDemo letter={q.answer} animKey={misses} />
                  <p style={{ margin: '6px 0 0', fontSize: 16, textAlign: 'center' }}>Watch first. Then trace it.</p>
                </div>
              )}
              <TracePad letter={q.answer} paths={tracePaths} disabled={checked} tone={checked ? (wasCorrect ? 'good' : 'bad') : null}
                onChange={(next) => { setTracePaths(next); setGiven(JSON.stringify(next)); }} />
              {!checked && tracePaths.length > 0 && (
                <div style={{ textAlign: 'center', marginTop: 8 }}><button type="button" style={linkBtn} onClick={() => { setTracePaths([]); setGiven(''); }}>Start again</button></div>
              )}
            </div>
          ) : (
            <input value={given} inputMode="numeric" onChange={(e) => setGiven(e.target.value)} disabled={checked}
              onKeyDown={(e) => { if (e.key === 'Enter') checkCurrent(); }} placeholder="Type a number"
              style={{ fontFamily: FONT, fontSize: 20, padding: '12px 14px', width: '100%', boxSizing: 'border-box', border: `2px solid ${checked ? (wasCorrect ? C.green : C.clay) : C.line}`, borderRadius: 10 }} />
          )}
          {checked && attempt.placement && !wasCorrect && given === '' && (
            <div style={{ marginTop: 14, padding: 14, borderRadius: 10, background: C.goldSoft, textAlign: 'center' }}>
              <p style={{ margin: 0, fontWeight: 600 }}>No problem. That one does not count against you.</p>
              <p style={{ margin: '6px 0 0', fontSize: 14, color: C.muted }}>It only tells the check where to start you.</p>
            </div>
          )}
          {checked && !(attempt.placement && !wasCorrect && given === '') && (
            <div key={cheer} className={wasCorrect ? 'edu-cheer' : 'edu-wobble'} style={{ position: 'relative', marginTop: 14, padding: 14, borderRadius: 10, background: wasCorrect ? C.greenSoft : C.claySoft }}>
              {wasCorrect && <StarBurst />}
              <p style={{ margin: 0, fontWeight: 600, color: wasCorrect ? C.green : C.clay }}>{wasCorrect ? 'Correct' : readAloud ? 'Not that one. Have another try.' : `Not quite. The answer is ${describeChoice(q.answer)}.`}</p>
              {(wasCorrect || !readAloud) && <div style={{ margin: '8px 0 0' }}><RichText text={formatTeachingText(q.explain)} size={15} lineGap={6} />{!wasCorrect && !readAloud && taughtLine(mod.id, q.answer) && <p style={{ margin: '8px 0 0', fontSize: 14, color: C.muted }}>From the lesson: “{taughtLine(mod.id, q.answer)}”</p>}{!wasCorrect && !readAloud && mod.lesson.example && mod.lesson.example.another && (wrongWay ? <div style={{ margin: '8px 0 0', padding: '10px 12px', borderRadius: 10, background: C.goldSoft }}><div style={{ maxWidth: 240, margin: '0 auto 8px' }}><Picture visual={wayVisual(mod.lesson.example, 1)} /></div><RichText text={wayText([].concat(mod.lesson.example.another)[0])} size={14} lineGap={6} /></div> : <p style={{ margin: '8px 0 0' }}><button type="button" style={{ ...linkBtn, fontSize: 14 }} onClick={() => setWrongWay(true)}>Show me another way</button></p>)}{!wasCorrect && q.choiceNotes && q.choiceNotes[given] && <p style={{ margin: '6px 0 0', fontSize: 15, color: C.muted }}>{q.choiceNotes[given]}</p>}</div>}
              {/* An explanation picture is either a set of fraction bars or one group of dots. */}
              {(wasCorrect || !readAloud) && Array.isArray(q.explainVisual) && q.explainVisual.map((b, i) => <LabeledBar key={i} parts={b.parts} shaded={b.shaded} label={b.label} color={wasCorrect ? C.green : C.clay} />)}
              {(wasCorrect || !readAloud) && q.explainVisual && !Array.isArray(q.explainVisual) && q.explainVisual.kind === 'dots' && <div style={{ marginTop: 8 }}><DotGroup count={q.explainVisual.count} size={28} animate animKey={cheer} /></div>}
            </div>
          )}
        </div>
        {/* A pre-reader who got it wrong tries again. Nobody moves on from a wrong answer. */}
        {checked && !wasCorrect && readAloud
          ? <Btn full halo onClick={tryAgain}>Try again</Btn>
          : checked
            ? <Btn full halo onClick={nextQuestion} disabled={busy}>{qIndex + 1 < questions.length ? 'Next question' : 'See results'}</Btn>
            : q.type === 'writing'
              ? <Btn full halo={ticks.length === q.checklist.length} onClick={submitWriting} disabled={busy || ticks.length < q.checklist.length}>I have finished writing it</Btn>
              : <>
                <Btn full halo={given !== ''} onClick={checkCurrent} disabled={given === '' || (q.type === 'order' && orderPicked.length < q.items.length)}>Check answer</Btn>
                {attempt.placement && <div style={{ marginTop: 10 }}><Btn full kind="secondary" onClick={dontKnow}>I don't know</Btn></div>}
              </>}
        {record.preview && <div style={{ marginTop: 10 }}><Btn full kind="secondary" onClick={() => { setChecked(false); setGiven(''); setOrderPicked([]); if (qIndex + 1 < questions.length) { setQIndex(qIndex + 1); setQShownAt(Date.now()); } else { setScreen('overview'); } }}>Skip (walk-through)</Btn></div>}
        <SilentNote shown={heardNote} />
      </div></div>
    );
  }

  if (screen === 'writing-sent' && lastEvent && lastEvent.type === 'writing_submitted') {
    return (
      <div style={page}><PageChrome idleWarning={idleWarning} logoutIn={logoutIn} walkthrough={!!(record && record.preview)} /><div className="edu-wrap" style={wrap}>
        <div style={{ ...card, textAlign: 'center' }}>
          <h1 style={{ fontSize: 24, margin: '12px 0 6px' }}>Great job!</h1>
          <p style={{ fontSize: 16, margin: 0 }}>{String(lastEvent.prompt || '').startsWith('Typed') ? 'Now you just need to give your teacher your printed or sent file and the next module will open after they check it.' : 'Now you just need to give your teacher the paper and the next module will open after they check it.'}</p>
        </div>
        <div style={{ textAlign: 'center' }}><Btn halo onClick={() => setScreen('overview')}>Back to my courses</Btn></div>
      </div></div>
    );
  }

  if (screen === 'quick-result' && quickResult) {
    const qr = quickResult; const mod = getModule(qr.moduleId);
    return (
      <div style={page}><PageChrome idleWarning={idleWarning} logoutIn={logoutIn} walkthrough={!!(record && record.preview)} /><div className="edu-wrap" style={wrap}>
        <div style={{ ...card, textAlign: 'center' }}>
          <h1 style={{ fontSize: 24, margin: '12px 0 6px' }}>{qr.passed ? `You already know ${lowerTitle(mod.title)}` : `Not yet: ${lowerTitle(mod.title)}`}</h1>
          {qr.passed
            ? <p style={{ fontSize: 16, margin: '0 0 10px' }}>{qr.right} of {qr.total} right. The module is unlocked without the lesson, and the next one is open.</p>
            : qr.guessed
              ? <p style={{ fontSize: 16, margin: '0 0 10px' }}>That was too fast to count. The lesson is the way in from here, and it is a short one.</p>
              : <p style={{ fontSize: 16, margin: '0 0 10px' }}>{qr.right} of {qr.total} right. Nothing you got wrong counts against you. The lesson is the way in from here.</p>}
          <p style={{ fontSize: 15, margin: 0, color: C.muted }}>{qr.passed ? 'It is not counted as mastered. The star is still yours to earn, and memory checks will visit it along the way.' : 'The quick check is one try per module. Practice rounds work as usual.'}</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          {qr.passed
            ? <Btn halo onClick={() => { setQuickResult(null); setScreen('overview'); }}>Back to my courses</Btn>
            : <Btn halo onClick={() => { setQuickResult(null); openModule(qr.moduleId); }}>Open the lesson</Btn>}
        </div>
      </div></div>
    );
  }

  if (screen === 'placement-result' && placementResult) {
    const pr = placementResult;
    return (
      <div style={page}><PageChrome idleWarning={idleWarning} logoutIn={logoutIn} walkthrough={!!(record && record.preview)} /><div className="edu-wrap" style={wrap}>
        <div style={{ ...card, textAlign: 'center' }}>
          <h1 style={{ fontSize: 24, margin: '12px 0 6px' }}>You start at {gradeLabel(pr.startGrade).toLowerCase()} {pr.subject.toLowerCase()}</h1>
          {pr.cleared.length
            ? <p style={{ fontSize: 16, margin: '0 0 10px' }}>You cleared {pr.cleared.map((g) => gradeLabel(g).toLowerCase()).join(', ')}. Every module in {pr.cleared.length === 1 ? 'that grade' : 'those grades'} is unlocked.</p>
            : <p style={{ fontSize: 16, margin: '0 0 10px' }}>That is the first grade in your band, so you start at the beginning. Nothing you got wrong counts against you.</p>}
          <p style={{ fontSize: 15, margin: 0, color: C.muted }}>Unlocked modules are not counted as mastered. The star on each one is still yours to earn, and memory checks will visit them along the way.</p>
        </div>
        <div style={{ textAlign: 'center' }}><Btn halo onClick={() => { setPlacementResult(null); setScreen('overview'); }}>Back to my courses</Btn></div>
      </div></div>
    );
  }

  if (screen === 'checkpoint-result' && lastEvent && lastEvent.type === 'checkpoint_completed') {
    const missed = [...new Set(lastEvent.results.filter((r) => !r.correct).map((r) => r.moduleId))].map((id) => getModule(id)).filter(Boolean);
    const strong = lastEvent.correct === lastEvent.total;
    return (
      <div style={page}><PageChrome idleWarning={idleWarning} logoutIn={logoutIn} walkthrough={!!(record && record.preview)} /><div className="edu-wrap" style={wrap}>
        <div style={{ ...card, textAlign: 'center' }}>
          <h1 style={{ fontSize: 24, margin: '12px 0 6px' }}>{strong ? 'It all stuck!' : 'Checkpoint done'}</h1>
          <p style={{ fontSize: 17, margin: '0 0 12px' }}>{lastEvent.correct} of {lastEvent.total} correct.</p>
          <FractionBar parts={lastEvent.total} shaded={lastEvent.correct} color={strong ? C.gold : C.clay} height={36} />
          {strong
            ? <p style={{ fontSize: 16, margin: '14px 0 0' }}>Every question came from a module you passed a while ago, and you still had it. That is what mastery looks like.</p>
            : <div style={{ margin: '14px 0 0' }}>
                <p style={{ fontSize: 16, margin: '0 0 8px' }}>Worth a quick refresher: <strong>{missed.map((m) => lowerTitle(m.title)).join(', ')}</strong>.</p>
                <p style={{ fontSize: 15, margin: 0, color: C.muted }}>Nothing you passed is lost. A miss here only means the memory needs one more visit, so those modules are marked on your course list.</p>
              </div>}
        </div>
        <div style={{ textAlign: 'center' }}><Btn halo onClick={() => setScreen('overview')}>Back to my courses</Btn></div>
      </div></div>
    );
  }

  if (screen === 'result' && lastEvent && mod && course && course.readAloud) {
    const mastered = isMasteredAttempt(lastEvent);
    // The next module in this course by order, skipping any already mastered.
    const nextMod = sortedModules.filter((m) => m.courseId === mod.courseId && m.order > mod.order && !(progress.perModule[m.id] || {}).mastered).sort((a, b) => a.order - b.order)[0] || null;
    const passedToday = !readAloud && mastered && !(progress.perModule[mod.id] || {}).mastered;   // a first pass: the star waits for another day
    const courseDone = mastered && !nextMod && sortedModules.filter((m) => m.courseId === mod.courseId && m.id !== mod.id).every((m) => (progress.perModule[m.id] || {}).mastered);
    const nextCourse = courseDone ? visibleCourses.find((c) => c.id !== mod.courseId && c.modules.some((m) => !(progress.perModule[m.id] || {}).mastered)) : null;
    const rules = moduleRules(mod.id);
    // One thing to do next, never a menu. Well done goes forward; not yet goes round again
    // through the lesson, because a child who struggled should see it explained once more.
    const backTo = mastered ? null : loopBackTarget(record.events, mod.id);
    // After mastery, an approved reflection is offered once, spoken and tap-only. The record
    // of this round shows whether it has already been answered, so it never repeats.
    const wonderHere = FEATURES.reflection && mastered && wonderOnFor(findStudent(roster, record.name)) ? nextWonder(record.events, mod.courseId, previewReview(), true) : null;
    const wonderDone = wonderHere && record.events.some((e) => e.type === 'wonder_answered' && e.wonderId === wonderHere.id && String(e.at) > String(lastEvent.at));
    // Coloring is not offered here on purpose: a picture in the middle of a round pulls a student
    // away from the work. The pictures wait in Let's Color, where they choose one themselves.
    const goOn = () => {
      if (wonderHere && !wonderDone) { setWonder(wonderHere); setWonderText(''); setWonderPick(''); setWonderStartedAt(Date.now()); setScreen('wonder'); return; }
      // Well done goes on to the next module; at the end of a course it goes home, never round the same module again.
      if (mastered && nextMod) openModule(nextMod.id); else if (mastered && nextCourse) openModule(sortedModules.filter((m) => m.courseId === nextCourse.id && !(progress.perModule[m.id] || {}).mastered).sort((a, b) => a.order - b.order)[0].id); else if (mastered) setScreen('overview'); else if (backTo) loopBack(mod.id, backTo); else { setLessonStep(0); setScreen('lesson'); }
    };
    return (
      <div style={page}><PageChrome idleWarning={idleWarning} logoutIn={logoutIn} walkthrough={!!(record && record.preview)} /><div className="edu-wrap" style={wrap}>
        <button type="button" onClick={() => setScreen('overview')} aria-label="Back" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke={C.green} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <div className="edu-rise" style={{ ...card, textAlign: 'center', padding: '24px 18px', position: 'relative' }}>
          {mastered && <StarBurst />}
          {/* A row of stars says the score without a number to read. */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
            {Array.from({ length: rules.questions }).map((_, i) => (
              <svg key={i} viewBox="0 0 24 24" width="38" height="38" aria-hidden="true" className={i < lastEvent.coreCorrect ? 'edu-star-twinkle' : undefined} style={{ transformOrigin: 'center', animationDelay: `${i * 0.15}s` }}>
                <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" fill={i < lastEvent.coreCorrect ? C.gold : C.line} />
              </svg>
            ))}
          </div>
          <p style={{ fontSize: 22, margin: 0 }}>{mastered ? (courseDone ? 'Well done! That was the whole course.' : 'Well done!') : 'Good try. Let us go again.'}</p>
          {passedToday && <p style={{ fontSize: 15, margin: '8px 0 0', color: C.muted }}>Passed today. Pass it again another day and the star is yours.</p>}
          {courseDone && <p style={{ fontSize: 15, margin: '8px 0 0', color: C.muted }}>{nextCourse ? `Next: ${nextCourse.title}.` : 'Every course here is finished.'}</p>}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
          {canSpeak() && (
            <button type="button" onClick={() => speak(mastered ? 'Well done!' : 'Good try. Let us go again.')} aria-label="Say it again" className="edu-press edu-sway"
              style={{ width: 66, height: 66, borderRadius: 999, border: `3px solid ${C.gold}`, background: C.goldSoft, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true">
                <path d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4z" fill={C.gold} />
                <path d="M15.5 8.5a5 5 0 010 7M18 6a8.5 8.5 0 010 12" fill="none" stroke={C.gold} strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <span style={{ position: 'relative', display: 'inline-flex' }}>
            <button type="button" onClick={goOn} disabled={busy} aria-label={mastered ? 'Keep going' : 'Go again'} className="edu-press edu-pulse"
              style={{ position: 'relative', width: 84, height: 84, borderRadius: 999, border: `3px solid ${mastered ? C.gold : C.green}`, background: mastered ? C.gold : C.green, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" width="46" height="46" aria-hidden="true">
                <path d="M9 5l7 7-7 7" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </span>
        </div>
      </div></div>
    );
  }

  if (screen === 'result' && lastEvent && mod) {
    const mastered = isMasteredAttempt(lastEvent);
    // The next module in this course by order, skipping any already mastered.
    const nextMod = sortedModules.filter((m) => m.courseId === mod.courseId && m.order > mod.order && !(progress.perModule[m.id] || {}).mastered).sort((a, b) => a.order - b.order)[0] || null;
    return (
      <div style={page}><PageChrome idleWarning={idleWarning} logoutIn={logoutIn} walkthrough={!!(record && record.preview)} /><div className="edu-wrap" style={wrap}>
        <div style={{ ...card, borderColor: mastered ? C.gold : C.clay }}>
          <Tag tone={mastered ? 'mastered' : 'review'}>{mastered ? 'Mastered' : 'Keep practicing'}</Tag>
          <h1 style={{ fontSize: 24, margin: '12px 0 6px', textAlign: 'center' }}>{mastered ? (masteryState(record.events, mod.id) === 'mastered' ? 'Mastered!' : 'Great job!') : 'Good try!'}</h1>
          <div style={{ margin: '0 0 12px' }}><RichText text={encouragementFor(record.events, mod.id, mastered)} size={17} center lineGap={8} /></div>
          {(() => {
            const backTo = mastered ? null : loopBackTarget(record.events, mod.id);
            const rules = moduleRules(mod.id);
            if (backTo) {
              const b = getModule(backTo);
              return <p style={{ fontSize: 17, margin: '0 0 12px' }}>{lastEvent.coreCorrect} of {lastEvent.coreTotal} correct. This one has been tricky twice, so let us take a quick look back at {lowerTitle(b.title)}. Getting that solid again usually makes this one click.</p>;
            }
            return <p style={{ fontSize: 17, margin: '0 0 12px', textAlign: 'center' }}>{lastEvent.coreCorrect} of {lastEvent.coreTotal} correct. {mastered ? `Getting ${rules.toMaster} or more right shows you truly understand it.` : `You need ${rules.toMaster} of ${lastEvent.coreTotal}. Reading the lesson once more, then trying a fresh set of questions, usually does it.`}</p>;
          })()}
          <FractionBar parts={lastEvent.coreTotal} shaded={lastEvent.coreCorrect} color={mastered ? C.gold : C.clay} height={36} />
          {lastEvent.review && <p style={{ color: C.muted, fontSize: 14, margin: '12px 0 0', textAlign: 'center' }}>Memory {lastEvent.review2 ? 'checks' : 'check'} from earlier: {[lastEvent.review, lastEvent.review2].filter(Boolean).map((r) => `${(getModule(r.moduleId) || { title: 'earlier' }).title.toLowerCase()} ${r.correct ? 'correct' : 'missed'}`).join(', ')} (does not affect mastery).</p>}
        </div>
        <div style={{ display: 'grid', gap: 10 }}>
          {FEATURES.reflection && !readAloud && mastered && wonderOnFor(findStudent(roster, record.name)) && nextWonder(record.events, mod.courseId, wonderReview) && <WonderButton onClick={() => { setWonder(nextWonder(record.events, mod.courseId, wonderReview)); setWonderText(''); setWonderPick(''); setWonderStartedAt(Date.now()); setScreen('wonder'); }}>Wonder for a minute</WonderButton>}
          {mastered && nextMod && <Btn full onClick={() => openModule(nextMod.id)} disabled={busy}>Next: {nextMod.title}</Btn>}
          {!mastered && loopBackTarget(record.events, mod.id) && <Btn full onClick={() => loopBack(mod.id, loopBackTarget(record.events, mod.id))} disabled={busy}>Look back at {getModule(loopBackTarget(record.events, mod.id)).title.toLowerCase()}</Btn>}
          {!mastered && !loopBackTarget(record.events, mod.id) && <Btn full onClick={() => setScreen('lesson')}>Review the lesson</Btn>}
          {(mastered || !loopBackTarget(record.events, mod.id)) && <Btn full kind="secondary" onClick={startPractice}>{mastered ? 'Practice this again' : 'Try a fresh set of questions'}</Btn>}
          <Btn full kind="secondary" onClick={() => setScreen('overview')}>Back to overview</Btn>
        </div>
        {errorMsg && <p style={{ color: C.clay }}>{errorMsg}</p>}
      </div></div>
    );
  }

  // ---------- Wonder for a child who cannot read: one spoken question, a tap, two short spoken voices ----------
  if (screen === 'wonder' && wonder && readAloud) {
    const options = wonder.options || ['Yes', 'No'];
    const finish = async (choice) => {
      setWonderPick(choice);
      const seconds = Math.round((Date.now() - wonderStartedAt) / 1000);
      await addEvent(makeWonderEvent(wonder.id, moduleId, new Date().toISOString(), seconds, 1));
      setWonderVoiceStep(0);
      setScreen('wonder-voices');
    };
    return (
      <div style={page}><PageChrome idleWarning={idleWarning} logoutIn={logoutIn} walkthrough={!!(record && record.preview)} /><div className="edu-wrap" style={wrap}>
        <h1 className="edu-slide-in" style={{ fontSize: 30, margin: '8px 0 12px', textAlign: 'center', color: C.green }}>Let's Wonder!</h1>
        <div className="edu-rise" style={{ ...card, textAlign: 'center', padding: '22px 18px', position: 'relative' }}>
          <p style={{ fontSize: 22, lineHeight: 1.5, margin: 0 }}>{wonder.prompt}</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
          {canSpeak() && (
            <button type="button" onClick={() => speak(wonder.prompt)} aria-label="Say it again" className="edu-press edu-sway"
              style={{ width: 66, height: 66, borderRadius: 999, border: `3px solid ${C.gold}`, background: C.goldSoft, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true">
                <path d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4z" fill={C.gold} />
                <path d="M15.5 8.5a5 5 0 010 7M18 6a8.5 8.5 0 010 12" fill="none" stroke={C.gold} strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
        {/* Big tap targets, read aloud when tapped, so choosing needs no reading. */}
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: `repeat(${Math.min(3, options.length)}, 1fr)` }}>
          {options.map((o) => (
            <button key={o} type="button" onClick={() => finish(o)} className="edu-press"
              style={{ fontFamily: FONT, fontSize: 20, fontWeight: 600, padding: '22px 10px', borderRadius: 14, background: C.surface, border: `3px solid ${C.green}`, color: C.green, cursor: 'pointer', minHeight: 78 }}>
              {o}
            </button>
          ))}
        </div>
      </div></div>
    );
  }

  // The two short voices, one at a time, each spoken as it appears.
  if (screen === 'wonder-voices' && wonder && readAloud) {
    const voices = wonder.simple || wonder.perspectives.slice(0, 2).map((p) => ({ voice: p.voice, says: p.says.split('. ')[0] + '.' }));
    const step = Math.min(wonderVoiceStep, voices.length - 1);
    const v = voices[step];
    const last = step >= voices.length - 1;
    return (
      <div style={page}><PageChrome idleWarning={idleWarning} logoutIn={logoutIn} walkthrough={!!(record && record.preview)} /><div className="edu-wrap" style={wrap}>
        <div key={step} className="edu-rise" style={{ ...card, textAlign: 'center', padding: '22px 18px' }}>
          <p style={{ fontSize: 15, color: C.muted, margin: '0 0 8px' }}>{v.voice}</p>
          <p style={{ fontSize: 22, lineHeight: 1.5, margin: 0 }}>{v.says}</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
          {canSpeak() && (
            <button type="button" onClick={() => speak(`${v.voice}. ${v.says}`)} aria-label="Say it again" className="edu-press edu-sway"
              style={{ width: 66, height: 66, borderRadius: 999, border: `3px solid ${C.gold}`, background: C.goldSoft, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true">
                <path d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4z" fill={C.gold} />
                <path d="M15.5 8.5a5 5 0 010 7M18 6a8.5 8.5 0 010 12" fill="none" stroke={C.gold} strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <BigTap dir="back" label="Go back" disabled={step === 0} onClick={() => setWonderVoiceStep(step - 1)} />
          <div style={{ display: 'flex', gap: 6 }}>
            {voices.map((_, i) => <span key={i} style={{ width: 9, height: 9, borderRadius: 999, background: i === step ? C.green : C.line }} />)}
          </div>
          {last
            ? <BigTap dir="next" label="Finish" onClick={() => setScreen('result')} />
            : <BigTap dir="next" label="Next" onClick={() => setWonderVoiceStep(step + 1)} />}
        </div>
      </div></div>
    );
  }

  // ---------- Wonder: an open question, then how others see it. Nothing a child writes is saved. ----------
  if (screen === 'wonder' && wonder) {
    const canContinue = wonder.answerMode === 'pick' ? wonderPick !== '' : wonderText.trim().length > 0;
    const finish = async () => {
      const seconds = Math.round((Date.now() - wonderStartedAt) / 1000);
      const words = wonder.answerMode === 'pick' ? 1 : wonderText.trim().split(/\s+/).length;
      await addEvent(makeWonderEvent(wonder.id, moduleId, new Date().toISOString(), seconds, words));
      setScreen('wonder-voices');
    };
    return (
      <div style={page}><PageChrome idleWarning={idleWarning} logoutIn={logoutIn} walkthrough={!!(record && record.preview)} /><div className="edu-wrap" style={wrap}>
        <h1 className="edu-slide-in" style={{ fontSize: 30, margin: '8px 0 4px', textAlign: 'center', color: C.green }}>Let's Wonder!</h1>
        <p style={{ color: C.muted, fontSize: 14, margin: '0 0 10px', textAlign: 'center' }}>No right answer</p>
        <div style={{ ...card, position: 'relative' }}>
          <p style={{ fontSize: 20, fontWeight: 600, margin: '0 0 14px', paddingRight: readAloud ? 60 : 0 }}>{wonder.prompt}</p>
          <SpeakButton corner text={wonder.prompt} label={readAloud ? 'Hear it again' : 'Read it to me'} />
          {wonder.answerMode === 'pick' ? (
            <div style={{ display: 'grid', gap: 10 }}>
              {wonder.options.map((o) => (
                <button key={o} type="button" onClick={() => setWonderPick(o)} style={{ fontFamily: FONT, fontSize: 20, padding: '12px 14px', borderRadius: 10, background: wonderPick === o ? C.greenSoft : C.surface, border: `2px solid ${wonderPick === o ? C.green : C.line}`, color: C.ink, cursor: 'pointer', minHeight: 48 }}>{o}</button>
              ))}
            </div>
          ) : (
            <textarea value={wonderText} onChange={(e) => setWonderText(e.target.value)} placeholder="Write what you think…" rows={5}
              style={{ fontFamily: FONT, fontSize: 17, padding: 12, width: '100%', boxSizing: 'border-box', border: `2px solid ${C.line}`, borderRadius: 10 }} />
          )}
          <p style={{ color: C.muted, fontSize: 13, margin: '10px 0 0' }}>Your words stay on this screen. Only that you thought about it is saved.</p>
        </div>
        <div style={{ display: 'grid', gap: 10 }}>
          <Btn full onClick={finish} disabled={!canContinue || busy}>See how others think</Btn>
          <Btn full kind="secondary" onClick={() => setScreen('overview')}>Skip for now</Btn>
        </div>
      </div></div>
    );
  }

  if (screen === 'wonder-voices' && wonder) {
    const allText = wonder.perspectives.map((p) => `${p.voice} says: ${p.says}`).join(' ') + ' ' + wonder.closing;
    return (
      <div style={page}><PageChrome idleWarning={idleWarning} logoutIn={logoutIn} walkthrough={!!(record && record.preview)} /><div className="edu-wrap" style={wrap}>
        <p style={{ color: C.muted, fontSize: 14, margin: '4px 0 6px' }}>How others might see it</p>
        {/* The question is repeated here so nobody has to remember what they were asked. */}
        <div style={{ ...card, background: C.greenSoft, borderColor: C.greenSoft }}>
          <p style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>{wonder.prompt}</p>
        </div>
        <SpeakButton text={allText} label="Read it to me" />
        {wonder.perspectives.map((p) => (
          <div key={p.voice} style={card}>
            <p style={{ margin: '0 0 4px', fontWeight: 600, color: C.green }}>{p.voice}</p>
            <p style={{ margin: 0, fontSize: 16 }}>{p.says}</p>
          </div>
        ))}
        <div style={{ ...card, background: C.goldSoft, borderColor: C.goldSoft }}>
          <p style={{ margin: 0, fontSize: 16 }}>{wonder.closing}</p>
        </div>
        <Btn full onClick={() => setScreen('overview')}>Back to overview</Btn>
      </div></div>
    );
  }

  // ---------- Learner-facing progress: short, plain words, no numbers a child has to interpret ----------
  if (screen === 'my-progress') {
    const rep = buildReport(displayName, record.events);
    const mine = rep.modules.filter((m) => visibleModules.some((v) => v.id === m.id));
    const groups = [
      { key: 'mastered', title: "Courses I've Mastered", items: mine.filter((m) => statusOf(m.id) === 'mastered') },
      { key: 'passed', title: "Courses I've Passed", items: mine.filter((m) => statusOf(m.id) === 'passed') },
      { key: 'available', title: 'Available Courses', items: mine.filter((m) => statusOf(m.id) === 'available') },
      { key: 'locked', title: 'Locked Courses', items: mine.filter((m) => statusOf(m.id) === 'locked') },
    ];
    const sentences = studentSummary(record.events, visibleModules.map((m) => m.id));
    return (
      <div style={page}><PageChrome idleWarning={idleWarning} logoutIn={logoutIn} walkthrough={!!(record && record.preview)} /><div className="edu-wrap" style={wrap}>
        <button type="button" onClick={() => setScreen('overview')} style={{ background: 'none', border: 'none', color: C.green, fontFamily: FONT, fontSize: 15, cursor: 'pointer', padding: 0 }}>Back</button>
        <h1 style={{ fontSize: 26, margin: '12px 0 12px', textAlign: 'center' }}>My progress</h1>
        <div style={{ ...card, background: 'linear-gradient(135deg, #DCEBE1 0%, #EEF5F0 100%)', borderColor: '#C9DCCF' }}>
          {sentences.map((line, i) => <div key={i} style={{ margin: '0 0 6px' }}><RichText text={line} size={17} center lineGap={6} /></div>)}
          <FractionBar parts={Math.max(1, mine.length)} shaded={mine.filter((m) => m.mastered).length} color={C.gold} height={30} />
          <p style={{ margin: '10px 0 0', color: C.muted, fontSize: 14, textAlign: 'center' }}>{mine.filter((m) => m.mastered).length} of {mine.length} modules mastered</p>
        </div>
        {groups.map((g) => {
          const open = openProgressGroups.includes(g.key);
          return (
            <div key={g.key} style={{ ...card, padding: 0, overflow: 'hidden' }}>
              <button type="button" onClick={() => setOpenProgressGroups((list) => (list.includes(g.key) ? list.filter((x) => x !== g.key) : [...list, g.key]))} aria-expanded={open}
                style={{ fontFamily: FONT, width: '100%', textAlign: 'left', background: 'transparent', border: 'none', padding: 16, cursor: 'pointer', color: C.ink, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 17, fontWeight: 600 }}>{g.title} ({g.items.length})</span><span style={{ color: C.muted }}>{open ? '▴' : '▾'}</span>
              </button>
              {open && (
                <div style={{ padding: '0 12px 8px' }}>
                  {g.items.length === 0 && <p style={{ margin: '0 0 8px', color: C.muted, fontSize: 15, textAlign: 'center' }}>Nothing here yet.</p>}
                  {g.items.map((m) => (
                    <div key={m.id} style={{ padding: '10px 4px', borderTop: `1px solid ${C.line}`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, textAlign: 'center' }}>
                      <div>
                        <p style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{m.title}</p>
                        <p style={{ margin: '4px 0 0', fontSize: 14, color: C.muted }}>
                          {m.mastered ? 'You showed you understand this.' : m.attempts ? `Your best so far is ${m.bestScore}. You need ${moduleRules(m.id).toMaster} to master it.` : g.key === 'locked' ? 'Opens when the module before it is mastered.' : 'Ready when you are.'}
                        </p>
                      </div>
                      {g.key !== 'locked' && <div style={{ width: '100%', textAlign: 'center', marginTop: 6 }}><Btn kind={m.mastered ? 'secondary' : 'primary'} onClick={() => openModule(m.id)} disabled={busy}>{m.mastered ? 'Practice again' : 'Open module'}</Btn></div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {/* Practice the missed ones: the module missed most this week, one tap, centered at the very foot. */}
        {mostMissedModule() && (
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Btn kind="secondary" onClick={() => openModule(mostMissedModule())} style={{ width: 'min(320px, 100%)' }}>Practice the missed ones</Btn>
            <p style={{ margin: '8px 0 0', fontSize: 13, color: C.muted }}>{getModule(mostMissedModule()).title}, where the most answers went wrong this week.</p>
          </div>
        )}
      </div></div>
    );
  }

  // ---------- The standards map: which module covers which standard, for this state ----------
  if (screen === 'standards-map') {
    const fw = frameworkForState(stateCode || 'CA');
    const plan = CURRICULUM.filter((entry) => entry.standards.some((st) => st.framework === fw));
    return (
      <div style={page}><PageChrome idleWarning={idleWarning} logoutIn={logoutIn} walkthrough={!!(record && record.preview)} /><div className="edu-wrap" style={wrap}>
        <button type="button" onClick={() => setScreen('educator-pick')} style={linkBtn}>Back to Classroom</button>
        <h1 style={{ fontSize: 24, margin: '12px 0 4px', textAlign: 'center' }}>Standards map</h1>
        <p style={{ color: C.muted, marginTop: 0, fontSize: 15, textAlign: 'center' }}>
          {stateCode && fw !== 'CCSS' ? `Every module, matched to ${stateFor(stateCode).name}'s standards (${FRAMEWORKS[fw].name}).` : `Every module, matched to ${FRAMEWORKS.CCSS.name}.`}<br />Print this page for a coverage record.
        </p>
        {/* Grouped by grade (each grade a heading, one light-green dropdown per subject) or by subject.
            The list grows by itself as courses are added, because it is read from the curriculum plan. */}
        <SegToggle options={[['grade', 'By grade'], ['subject', 'By subject']]} value={mapOrder} onChange={setMapOrder} ariaLabel="Group by grade or by subject" />
        {(() => {
          const subjectOrder = sortSubjects(plan.map((entry) => entry.subject));
          // A plan is an elective when every module it names sits in an elective course.
          const electiveEntry = (entry) => { const ids = [...new Set(entry.standards.flatMap((st) => st.moduleIds))]; return ids.length > 0 && ids.every((id) => { const m = getModule(id); const c = m && getCourse(m.courseId); return !!(c && c.elective); }); };
          const anyElectives = plan.some(electiveEntry);
          const shown = mapOrder === 'grade' && anyElectives ? plan.filter((entry) => (mapKind === 'electives' ? electiveEntry(entry) : !electiveEntry(entry))) : plan;
          const sorted = [...shown].sort((a, b) => GRADES.indexOf(a.grade) - GRADES.indexOf(b.grade) || subjectOrder.indexOf(a.subject) - subjectOrder.indexOf(b.subject));
          const groups = mapOrder === 'grade'
            ? GRADES.filter((g) => sorted.some((e) => e.grade === g)).map((g) => ({ key: g, title: gradeLabel(g), entries: sorted.filter((e) => e.grade === g) }))
            : subjectOrder.map((sub) => ({ key: sub, title: sub, entries: sorted.filter((e) => e.subject === sub) })).filter((group) => group.entries.length);
          const kindToggle = mapOrder === 'grade' && anyElectives ? (
            <SegToggle key="kind" options={[['core', 'Core'], ['electives', 'Electives']]} value={mapKind} onChange={setMapKind} ariaLabel="Core courses or electives" />
          ) : null;
          // Each grade (or subject) is one closed row with its own count, so the page reads as a short
          // list; opening a row shows its subject dropdowns. Closed rows are still rendered for printing.
          return [kindToggle, ...groups.map((group) => {
            const headOpen = openMapHeads.includes(group.key);
            const tally = group.entries.reduce((acc, entry) => { const rows = entry.standards.filter((st) => st.framework === fw); return { covered: acc.covered + rows.filter((st) => st.moduleIds.length).length, total: acc.total + rows.length }; }, { covered: 0, total: 0 });
            return (
            <div key={group.key} style={{ marginBottom: 12 }}>
              <button type="button" onClick={() => setOpenMapHeads((list) => (list.includes(group.key) ? list.filter((x) => x !== group.key) : [...list, group.key]))} aria-expanded={headOpen}
                style={{ fontFamily: FONT, width: '100%', background: headOpen ? C.green : C.surface, color: headOpen ? '#FFFFFF' : C.green, border: `2px solid ${C.green}`, borderRadius: 12, padding: '12px 16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: headOpen ? 8 : 0 }}>
                <span style={{ fontSize: 19, fontWeight: 700 }}>{group.title}</span>
                <span style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap' }}>{tally.covered} of {tally.total} covered {headOpen ? '▴' : '▾'}</span>
              </button>
              <div className="edu-collapsible" style={{ display: headOpen ? 'block' : 'none' }}>
              {group.entries.map((entry) => {
                const key = `${entry.grade}-${entry.subject}`;
                const open = openMapGroups.includes(key);
                const rows = entry.standards.filter((st) => st.framework === fw);
                const covered = rows.filter((st) => st.moduleIds.length).length;
                return (
                  <div key={key} style={{ ...card, padding: 0, overflow: 'hidden', marginBottom: 10 }}>
                    <button type="button" onClick={() => setOpenMapGroups((list) => (list.includes(key) ? list.filter((x) => x !== key) : [...list, key]))} aria-expanded={open} aria-label={`${gradeLabel(entry.grade)} ${entry.subject}`}
                      style={{ fontFamily: FONT, width: '100%', textAlign: 'left', background: C.greenSoft, border: 'none', padding: 16, cursor: 'pointer', color: C.ink, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 17, fontWeight: 600 }}>{mapOrder === 'grade' ? entry.subject : gradeLabel(entry.grade)}</span>
                      <span style={{ fontSize: 14, color: covered === rows.length ? C.green : entry.status === 'ready' ? C.clay : C.muted, whiteSpace: 'nowrap' }}>{covered} of {rows.length} covered {open ? '▴' : '▾'}</span>
                    </button>
                    {/* Rendered whether open or closed, and shown when printing, so a printed map is always complete. The body stays white. */}
                    <div className="edu-collapsible" style={{ display: open ? 'block' : 'none', padding: '10px 16px 12px', background: C.surface }}>
                      <p style={{ margin: '0 0 6px', fontSize: 13, color: C.muted }}>{entry.source}</p>
                      {rows.map((st) => (
                        <div key={st.code} style={{ padding: '8px 0', borderTop: `1px solid ${C.line}` }}>
                          <p style={{ margin: 0, fontSize: 15 }}><strong>{st.code}</strong> {st.text}</p>
                          <p style={{ margin: '4px 0 0', fontSize: 14, color: st.moduleIds.length ? C.green : C.clay }}>
                            {st.moduleIds.length ? `Covered by: ${st.moduleIds.map((id) => (getModule(id) ? getModule(id).title : id)).join(', ')}` : 'Not yet covered'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              </div>
            </div>
          ); })];
        })()}
        <div className="edu-no-print" style={{ textAlign: 'center', marginTop: 8 }}>
          <Btn onClick={() => { if (typeof window !== 'undefined' && window.print) window.print(); }}>Print standards map</Btn>
        </div>
      </div></div>
    );
  }

  // ---------- Reviewing the Wonder questions before any child sees one ----------
  if (screen === 'reading-lists' || screen === 'experiments') {
    const lists = screen === 'reading-lists';
    return (
      <div style={page}><PageChrome idleWarning={idleWarning} logoutIn={logoutIn} walkthrough={!!(record && record.preview)} /><div className="edu-wrap" style={wrap}>
        <button type="button" onClick={() => setScreen('educator-pick')} style={{ ...linkBtn, marginBottom: 6 }}>Back</button>
        <h1 style={{ fontSize: 24, margin: '12px 0 4px', textAlign: 'center' }}>{lists ? 'Reading List Ideas' : 'Science Experiment Ideas'}</h1>
        <p style={{ color: C.muted, margin: '0 0 26px', fontSize: 15, textAlign: 'center' }}>{lists ? 'Here\'s a comprehensive list of books you might consider incorporating into your curriculum. Regular reading is fantastic for growing brains!' : 'Science is way more fun when it\'s tangible. Here are some ideas for every age group!'}</p>
        {(lists ? [...gradesWithCourses(), 'grown'] : gradesWithCourses().filter((g) => experimentsFor(g).length)).map((g) => {
          const open = openResourceGrades.includes(g);
          const title = g === 'grown' ? 'For parents, educators and advanced readers' : gradeLabel(g);
          const count = lists ? readingListFor(g).length : experimentsFor(g).length;
          return (
            <div key={g} style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 10, background: 'rgb(26, 71, 58)' }}>
              <button type="button" onClick={() => setOpenResourceGrades((list) => (list.includes(g) ? list.filter((x) => x !== g) : [...list, g]))} aria-expanded={open}
                style={{ fontFamily: FONT, width: '100%', textAlign: 'left', background: 'transparent', border: 'none', padding: '14px 16px', cursor: 'pointer', color: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 18, fontWeight: 600 }}>{title}</span>
                  <span style={{ fontSize: 14, opacity: 0.85, whiteSpace: 'nowrap' }}>{count} {lists ? (count === 1 ? 'book' : 'books') : 'ideas'} {open ? '▴' : '▾'}</span>
                </div>
              </button>
              <div className="edu-collapsible" style={{ display: open ? 'block' : 'none', background: C.greenSoft, padding: '14px 18px' }}>
                {lists
                  ? <ul style={{ margin: 0, paddingLeft: 20, fontSize: 15 }}>{readingListFor(g).map((t) => <li key={t} style={{ margin: '3px 0' }}>{t}</li>)}</ul>
                  : experimentsFor(g).map((x) => (
                    <div key={x.title} style={{ borderTop: `1px solid rgba(26, 71, 58, 0.15)`, padding: '8px 0' }}>
                      <p style={{ margin: '0 0 2px', fontWeight: 600 }}>{x.title}</p>
                      <p style={{ margin: '0 0 4px', fontSize: 15 }}><strong>Ask first:</strong> {x.ask}</p>
                      <p style={{ margin: '0 0 4px', fontSize: 15 }}>{x.do}</p>
                      <p style={{ margin: 0, fontSize: 15, color: C.muted }}><strong>What you see:</strong> {x.see}</p>
                    </div>
                  ))}
              </div>
            </div>
          );
        })}
        <div className="edu-no-print" style={{ textAlign: 'center', marginTop: 12 }}><Btn kind="secondary" onClick={() => window.print()}>Print</Btn></div>
      </div></div>
    );
  }

  if (screen === 'wonder-review') {
    const waiting = wonderAwaitingReview(wonderReview);
    const reviewingQuestion = WONDER.find((w) => w.id === reviewing) || null;
    const apply = async (next) => {
      changedSinceBackup.current = true;
      setWonderReview(next);
      const outcome = await saveWonderReview(next);
      if (!outcome.saved) setSaveNote('That change could not be saved on this device. This happens only during incognito browsing or when browser storage is full.');
    };
    // A gentle gradient down the page, palest at kindergarten and deepest at the oldest.
    const inOrder = wonderInOrder();
    // The four section rows carry the gradient, palest at kindergarten and deepest at the oldest.
    const stageTint = (i) => {
      const m = LIFE_STAGES.length <= 1 ? 0 : i / (LIFE_STAGES.length - 1);
      const mix = (from, to) => Math.round(from + (to - from) * m);
      return `rgb(${mix(214, 26)}, ${mix(233, 71)}, ${mix(211, 58)})`;
    };
    // The pale green used for the small panels inside a question.
    const PANEL = 'rgb(240, 248, 238)';

    return (
      <div style={page}><PageChrome idleWarning={idleWarning} logoutIn={logoutIn} walkthrough={!!(record && record.preview)} /><div className="edu-wrap" style={wrap}>
        <button type="button" onClick={() => setScreen('educator-pick')} style={linkBtn}>Back to Classroom</button>
        <h1 style={{ fontSize: 24, margin: '12px 0 4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Wonder Questions <InfoButton onClick={() => setShowWonderTip(!showWonderTip)} label="How reflection questions work" open={showWonderTip} /></h1>
        {showWonderTip && (
          <TipText>
            <p style={{ margin: '0 0 8px' }}>After every two practice rounds, whether it went well or not, a reflection question is introduced. Each question is written toward one of four aims: curiosity about the world, failure as the way learning happens, naming and handling feelings, and the idea that hard days are normal yet, we always get through them.</p>
            <p style={{ margin: '0 0 8px' }}>These questions rotate. A student never sees the same question more than twice and after a bad practice round, questions about failure and feelings are prioritized. Student answers are never stored and only questions you approve will ever appear.</p>
            <p style={{ margin: 0 }}>Note: By never storing student answers, there is no pressure for them to answer a certain way. They are free to answer as themselves then they'll see other perspectives to expand their way of thinking. This also keeps EDUSphere compliant with privacy laws.</p>
          </TipText>
        )}
        <p style={{ color: C.muted, marginTop: 0, marginBottom: 26, fontSize: 15, textAlign: 'center' }}>Thought-provoking questions sprinkled between learning modules. Wonder Questions are designed not only to help information stick, but to promote emotional intelligence, curiosity, critical thinking and positive views of failure.</p>

        <div style={{ ...card, marginTop: 22, background: waiting > 0 ? C.goldSoft : C.greenSoft, borderColor: waiting > 0 ? C.goldSoft : C.greenSoft }}>
          <p style={{ margin: 0, fontSize: 16, fontWeight: 600, textAlign: 'center' }}>
            {waiting > 0 ? `${waiting} to review` : `All ${WONDER.length} reviewed`}
          </p>
          <p style={{ margin: '6px 0 10px', fontSize: 15, textAlign: 'center' }}>Students only see what you approve. Responses are never recorded for privacy reasons.</p>
          {waiting === 0 && WONDER.length > 0 && <p style={{ margin: '0 0 10px', fontSize: 13, textAlign: 'center' }}><button type="button" onClick={() => apply(unapproveAllWonder(wonderReview))} style={{ ...linkBtn, fontSize: 13, padding: 0 }}>Un-approve all</button></p>}
          {waiting > 0 && <Btn full kind="secondary" onClick={() => apply(approveAllWonder(wonderReview))}>Approve all</Btn>}
        </div>

        {LIFE_STAGES.map((stage, stageIndex) => {
          const inStage = inOrder.filter((w) => (w.stage || 'early') === stage.id);
          const stageBg = stageTint(stageIndex);
          const stageLight = stageIndex < 2;
          const stageOpen = openWonderStages.includes(stage.id);
          const waitingHere = inStage.filter((w) => !isWonderApproved(wonderReview, w.id) && !isWonderHidden(wonderReview, w.id)).length;
          return (
            <div key={stage.id}>
              {/* Four rows to begin with. The questions inside wait until a stage is opened. */}
              <button type="button" onClick={() => setOpenWonderStages((list) => (list.includes(stage.id) ? list.filter((x) => x !== stage.id) : [...list, stage.id]))} aria-expanded={stageOpen}
                style={{ fontFamily: FONT, width: '100%', textAlign: 'left', background: stageBg, border: 'none', borderRadius: 12, padding: '14px 16px', cursor: 'pointer', color: stageLight ? C.ink : '#fff', marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 18, fontWeight: 600 }}>{stage.title}</span>
                  <span style={{ fontSize: 14, opacity: 0.85, whiteSpace: 'nowrap' }}>{inStage.length === 0 ? 'none yet' : waitingHere > 0 ? `${waitingHere} to review` : 'all reviewed'} {stageOpen ? '▴' : '▾'}</span>
                </div>
                <p style={{ margin: '4px 0 0', fontSize: 14, opacity: 0.85, fontWeight: 400 }}>{stage.blurb}</p>
              </button>
              {stageOpen && inStage.length === 0 && (
                <div style={{ ...card, marginTop: 0 }}><p style={{ margin: 0, color: C.muted, fontSize: 15 }}>No questions written for this stage yet.</p></div>
              )}
              {(() => {
                if (!stageOpen) return null;
                const row = (w) => {
                  const approved = isWonderApproved(wonderReview, w.id);
                  const hidden = isWonderHidden(wonderReview, w.id);
                  const tone = hidden ? 'locked' : approved ? 'mastered' : 'review';
                  const state = hidden ? 'Removed' : approved ? 'Approved' : 'Awaiting review';
                  return (
                    <button key={w.id} type="button" onClick={() => { setReviewing(w.id); setOpenVoices([]); }}
                      style={{ ...card, display: 'block', width: '100%', textAlign: 'left', padding: 14, cursor: 'pointer', border: `1px solid ${C.line}`, opacity: hidden ? 0.7 : 1, background: hidden ? '#EDEFEA' : C.surface, fontFamily: FONT, color: C.ink }}>
                      <span style={{ display: 'block', fontSize: 16, fontWeight: 600, lineHeight: 1.4 }}>{w.prompt}</span>
                      <span style={{ display: 'block', marginTop: 8 }}><Tag tone={tone}>{state}</Tag></span>
                    </button>
                  );
                };
                // Awaiting questions stay in view; reviewed ones fold away so the next one is always at the top.
                const awaiting = inStage.filter((w) => !isWonderApproved(wonderReview, w.id) && !isWonderHidden(wonderReview, w.id));
                const reviewed = inStage.filter((w) => isWonderApproved(wonderReview, w.id) || isWonderHidden(wonderReview, w.id));
                const foldOpen = openApproved.includes(stage.id);
                return (
                  <>
                    {reviewed.length > 0 && (
                      <div style={{ ...card, padding: 0, overflow: 'hidden', background: C.greenSoft, borderColor: C.greenSoft }}>
                        <button type="button" onClick={() => setOpenApproved((list) => (list.includes(stage.id) ? list.filter((x) => x !== stage.id) : [...list, stage.id]))} aria-expanded={foldOpen}
                          style={{ fontFamily: FONT, width: '100%', textAlign: 'left', background: 'transparent', border: 'none', padding: 14, cursor: 'pointer', color: C.ink, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 15, fontWeight: 600 }}>Reviewed ({reviewed.length})</span>
                          <span style={{ color: C.muted }}>{foldOpen ? '▴' : '▾'}</span>
                        </button>
                        {foldOpen && <div style={{ padding: '0 10px 6px' }}>{reviewed.map(row)}</div>}
                      </div>
                    )}
                    {awaiting.map(row)}
                  </>
                );
              })()}
            </div>
          );
        })}

        <p style={{ color: C.muted, fontSize: 13, marginTop: 120, lineHeight: 1.6, textAlign: 'center' }}>Wonder questions are written to sit comfortably with families of all beliefs. No individual voice is implied correct and no question or answer will ever argue for or against religion. Although we think faith is important, we strive to remain neutral for the benefit of all. If a question doesn't suit your community, remove it. Nothing is shown to a student until you approve it.</p>
        {saveNote && <p style={{ color: C.muted, fontSize: 13, textAlign: 'center', marginTop: 32 }}>{saveNote}</p>}

        {/* Reviewing one question opens over the page rather than pushing everything down.
            With a hundred questions to work through, expanding in place would mean endless scrolling. */}
        {reviewingQuestion && (
          <div className="edu-no-print" style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, background: 'rgba(36, 41, 31, 0.55)', zIndex: 100, overflowY: 'auto', padding: '24px 12px' }}>
            <div style={{ maxWidth: 560, margin: '0 auto', background: C.surface, borderRadius: 14, padding: 18, position: 'relative' }}>
              <button type="button" onClick={() => setReviewing(null)} aria-label="Close"
                style={{ position: 'absolute', top: 8, right: 10, background: 'none', border: 'none', width: 36, height: 36, fontSize: 30, fontWeight: 400, lineHeight: '34px', cursor: 'pointer', color: C.ink, fontFamily: FONT, padding: 0 }}>×</button>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingRight: 40 }}>
                <Tag tone={isWonderHidden(wonderReview, reviewingQuestion.id) ? 'locked' : isWonderApproved(wonderReview, reviewingQuestion.id) ? 'mastered' : 'review'}>
                  {isWonderHidden(wonderReview, reviewingQuestion.id) ? 'Removed' : isWonderApproved(wonderReview, reviewingQuestion.id) ? 'Approved' : 'Awaiting review'}
                </Tag>

              </div>
              <p style={{ margin: '12px 0 14px', fontSize: 18, fontWeight: 600, lineHeight: 1.4 }}>{reviewingQuestion.prompt}</p>

              {Array.isArray(reviewingQuestion.simple) && (
                <div style={{ background: PANEL, borderRadius: 10, padding: '10px 12px', marginBottom: 12 }}>
                  <p style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 600 }}>What the youngest children hear</p>
                  <p style={{ margin: '0 0 6px', fontSize: 13, color: C.muted }}>Children who cannot read yet hear the question spoken, tap one of the choices, and then hear only these two short voices. The four voices below are for readers.</p>
                  {reviewingQuestion.simple.map((v) => <p key={v.voice} style={{ margin: '0 0 4px', fontSize: 14 }}><strong>{v.voice}</strong> {v.says}</p>)}
                </div>
              )}
              <div style={{ background: PANEL, borderRadius: 10, padding: '10px 12px', marginBottom: 12 }}>
                <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 600 }}>Answered by</p>
                {reviewingQuestion.answerMode === 'typed' ? (
                  <p style={{ margin: 0, fontSize: 14, color: C.muted }}>Typing in their own words. Nothing they write is saved.</p>
                ) : (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                    {(reviewingQuestion.options || []).map((o) => (
                      <span key={o} style={{ fontSize: 14, fontWeight: 600, color: C.green, background: C.surface, border: `2px solid ${C.line}`, borderRadius: 10, padding: '7px 14px' }}>{o}</span>
                    ))}
                  </div>
                )}
              </div>

              <p style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 600 }}>The four voices:</p>
              {reviewingQuestion.perspectives.map((p) => {
                const shown = openVoices.includes(p.voice);
                return (
                  <div key={p.voice} style={{ borderTop: `1px solid ${C.line}` }}>
                    <button type="button" onClick={() => setOpenVoices((list) => (list.includes(p.voice) ? list.filter((x) => x !== p.voice) : [...list, p.voice]))} aria-expanded={shown}
                      style={{ fontFamily: FONT, width: '100%', textAlign: 'left', background: 'transparent', border: 'none', padding: '10px 0', cursor: 'pointer', color: C.green, fontSize: 15, fontWeight: 600, display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                      <span>{p.voice}</span>
                      <span style={{ color: C.muted, fontWeight: 400 }}>{shown ? '▴' : '▾'}</span>
                    </button>
                    <div className="edu-collapsible" style={{ display: shown ? 'block' : 'none', paddingBottom: 10 }}>
                      <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6 }}>{p.says}</p>
                    </div>
                  </div>
                );
              })}

              <div style={{ background: PANEL, borderRadius: 10, padding: '10px 12px', marginTop: 12 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Closing question</p>
                <p style={{ margin: '2px 0 0', fontSize: 15 }}>{reviewingQuestion.closing}</p>
              </div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16 }}>
                {isWonderHidden(wonderReview, reviewingQuestion.id) ? (
                  <Btn kind="secondary" onClick={() => apply(restoreWonder(wonderReview, reviewingQuestion.id))}>Put it back for review</Btn>
                ) : isWonderApproved(wonderReview, reviewingQuestion.id) ? (
                  <>
                    <Btn kind="secondary" onClick={() => apply(unapproveWonder(wonderReview, reviewingQuestion.id))}>Withdraw approval</Btn>
                    <Btn kind="secondary" onClick={() => apply(hideWonder(wonderReview, reviewingQuestion.id))}>Remove</Btn>
                  </>
                ) : (
                  <>
                    <Btn onClick={() => { apply(approveWonder(wonderReview, reviewingQuestion.id)); setReviewing(null); }}>Approve</Btn>
                    <Btn kind="secondary" onClick={() => apply(hideWonder(wonderReview, reviewingQuestion.id))}>Remove</Btn>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div></div>
    );
  }

  // ---------- Practical Life Skills: one sequence, marked out in stages ----------
  if (screen === 'life-skills') {
    const ordered = lifeSkillsInOrder();
    const shown = hideCovered ? ordered.filter((sk) => !isCovered(covered, sk.id)) : ordered;
    const doneCount = coveredCount(covered, ordered);
    // Palest green at the top, deep forest green at the bottom, so maturity is visible
    // before a single word is read.
    // One steady green for every skill, so the page reads calmly. Colour is saved for the
    // one thing that actually changes: whether the classroom has covered it.
    const SKILL_GREEN = 'rgb(69, 106, 94)';
    const STAGE_GREEN = 'rgb(26, 71, 58)';
    const markCovered = async (id) => {
      const next = toggleCovered(covered, id);
      setCovered(next);
      const outcome = await saveCovered(next);
      if (!outcome.saved) setSaveNote('That change could not be saved on this device. This happens only during incognito browsing or when browser storage is full.');
    };

    return (
      <div style={page}><PageChrome idleWarning={idleWarning} logoutIn={logoutIn} walkthrough={!!(record && record.preview)} /><div className="edu-wrap" style={wrap}>
        <button type="button" onClick={() => setScreen('educator-pick')} style={linkBtn}>Back to Classroom</button>
        <h1 style={{ fontSize: 24, margin: '12px 0 4px', textAlign: 'center' }}>Practical Life Skills</h1>
        <p style={{ color: C.muted, marginTop: 0, fontSize: 15 }}>Making the academic work efficient frees up hours. These are ideas for what to do with them, listed from the earliest skills at the top to the most mature at the bottom. Nothing here is graded, tracked, or shown to a student.</p>

        <div style={{ ...card, marginTop: 22, background: C.greenSoft, borderColor: C.greenSoft }}>
          <p style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600 }}>My Completed Skills: {doneCount} out of {ordered.length}</p>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15 }}>
            <input type="checkbox" checked={hideCovered} onChange={() => setHideCovered(!hideCovered)} />
            <span>Hide completed skills</span>
          </label>
        </div>

        {LIFE_STAGES.map((stage) => {
          const inStage = shown.filter((sk) => sk.stage === stage.id);
          if (inStage.length === 0) return null;
          const stageOpen = openStages.includes(stage.id);
          const coveredHere = coveredCount(covered, inStage);
          return (
            <div key={stage.id} style={{ marginBottom: 6 }}>
              {/* The page opens as four stages. Everything else waits until one is chosen. */}
              <button type="button" onClick={() => setOpenStages((list) => (list.includes(stage.id) ? list.filter((x) => x !== stage.id) : [...list, stage.id]))} aria-expanded={stageOpen}
                style={{ fontFamily: FONT, width: '100%', textAlign: 'left', background: STAGE_GREEN, border: 'none', borderRadius: 12, padding: '14px 16px', cursor: 'pointer', color: '#fff', marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 18, fontWeight: 600 }}>{stage.title}</span>
                  <span style={{ fontSize: 14, opacity: 0.85, whiteSpace: 'nowrap' }}>{coveredHere} of {inStage.length} {stageOpen ? '▴' : '▾'}</span>
                </div>
                <p style={{ margin: '4px 0 0', fontSize: 14, opacity: 0.85, fontWeight: 400 }}>{stage.blurb}</p>
              </button>
              {stageOpen && inStage.map((sk) => {
                const open = openSkills.includes(sk.id);
                const done = isCovered(covered, sk.id);
                const bg = done ? '#EDEFEA' : SKILL_GREEN;
                const light = done;
                return (
                  <div key={sk.id} style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 10, background: bg, opacity: done ? 0.75 : 1 }}>
                    <button type="button" onClick={() => setOpenSkills((list) => (list.includes(sk.id) ? list.filter((x) => x !== sk.id) : [...list, sk.id]))} aria-expanded={open}
                      style={{ fontFamily: FONT, width: '100%', textAlign: 'left', background: 'transparent', border: 'none', padding: '16px 18px', cursor: 'pointer', color: light ? C.ink : '#fff' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 18, fontWeight: 600 }}>{done ? '✓ ' : ''}{sk.title}</span>
                        <span style={{ fontSize: 14, opacity: 0.8, whiteSpace: 'nowrap' }}>{open ? '▴' : '▾'}</span>
                      </div>
                    </button>
                    <div className="edu-collapsible" style={{ display: open ? 'block' : 'none', background: C.greenSoft, padding: '14px 18px' }}>
                      <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6 }}>{sk.why}</p>
                      {sk.ways.length > 0 && (
                        <>
                          <p style={{ margin: '12px 0 4px', fontSize: 14, fontWeight: 600 }}>Ways to practice</p>
                          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 15 }}>
                            {sk.ways.map((w, i) => <li key={i} style={{ margin: '3px 0' }}>{w}</li>)}
                          </ul>
                        </>
                      )}
                      <div style={{ marginTop: 12 }}>
                        <Btn kind="secondary" onClick={() => markCovered(sk.id)}>{done ? 'Mark as not covered' : 'Mark as covered'}</Btn>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}

        {shown.length === 0 && <div style={card}><p style={{ margin: 0, color: C.muted }}>Everything is marked as covered. Untick the box above to see the list again.</p></div>}

        <p style={{ color: C.muted, fontSize: 13, marginTop: 14, textAlign: 'center' }}>The order is a sequence rather than a schedule. Younger children start at the top, and there is no wrong moment to try one further down. Most of these are never really finished, which is why they are marked as covered rather than complete.</p>
        {saveNote && <p style={{ color: C.muted, fontSize: 13, textAlign: 'center', marginTop: 32 }}>{saveNote}</p>}
      </div></div>
    );
  }

  // ---------- The transcript: a printable record of work done, including courses no longer assigned ----------
  if (screen === 'transcript' && educatorRecord) {
    const student = findStudent(roster, educatorRecord.name);
    const who = student ? student.label : educatorRecord.name;
    const tr = buildTranscript(who, educatorRecord.events);
    // The standards a finished course covers, in the state's own framework, read from the curriculum plan.
    const standardsSatisfied = (courseId) => {
      const fw = frameworkForState(stateCode || 'CA');
      const ids = (getCourse(courseId) || { modules: [] }).modules.map((m) => m.id);
      return CURRICULUM.flatMap((entry) => entry.standards.filter((st) => st.framework === fw && st.moduleIds.some((id) => ids.includes(id))).map((st) => st.code));
    };
    // The codes one mastered module satisfies, in the state's framework, for the line under its title.
    const codesForModule = (moduleId) => { const fw = frameworkForState(stateCode || 'CA'); return [...new Set(CURRICULUM.flatMap((entry) => entry.standards.filter((st) => st.framework === fw && st.moduleIds.includes(moduleId)).map((st) => st.code)))]; };
    const section = (title, list) => (
      <div style={{ marginBottom: 18 }}>
        {title && <h2 style={{ fontSize: 18, margin: '0 0 10px', textAlign: 'center' }}>{title}</h2>}
        {list.length === 0 && <p style={{ margin: 0, fontSize: 15, color: C.muted, textAlign: 'center' }}>Nothing to show here yet.</p>}
        {list.map((c) => (
          <div key={c.id} style={{ border: `1px solid ${C.line}`, borderRadius: 10, padding: 14, marginBottom: 10, background: C.surface }}>
            <p style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>{c.title}</p>
            <p style={{ margin: '2px 0 8px', fontSize: 13, color: C.muted }}>{gradeShort(c.grade)} - {c.subject}</p>
            <p style={{ margin: 0, fontSize: 15 }}>
              {c.modulesMastered} of {c.modulesTotal} modules mastered
              {c.averageConfidence !== null ? ` · average confidence ${c.averageConfidence} of 5` : ''}
              {!c.stillAssigned ? ' · no longer assigned' : ''}
            </p>
            <p style={{ margin: '4px 0 8px', fontSize: 14, color: C.muted }}>
              {c.startedAt ? `Started ${fmtDate(c.startedAt)}` : ''}{c.completedAt ? ` · completed ${fmtDate(c.completedAt)}` : ''}
            </p>
            {c.completedAt && standardsSatisfied(c.id).length > 0 && (
              <p style={{ margin: '0 0 8px', fontSize: 14, lineHeight: 1.6 }}><strong>Standards satisfied</strong> ({FRAMEWORKS[frameworkForState(stateCode || 'CA')].name}): {standardsSatisfied(c.id).join(', ')}</p>
            )}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <tbody>
                {c.modules.map((m) => (
                  <tr key={m.id} style={{ borderTop: `1px solid ${C.line}` }}>
                    <td style={{ padding: '6px 0' }}>{titleCase(m.title)}{!m.mastered && m.attempts > 0 && m.bestScore && <span style={{ display: 'block', fontSize: 12, color: C.muted }}>(best score {String(m.bestScore).replace(' of ', ' out of ')}; attempted {m.attempts === 1 ? 'once' : m.attempts === 2 ? 'twice' : `${m.attempts} times`})</span>}{m.mastered && codesForModule(m.id).length > 0 && <span style={{ display: 'block', fontSize: 12, color: C.muted }}>Satisfies {codesForModule(m.id).join(', ')}</span>}</td>
                    <td style={{ padding: '6px 0 6px 12px', textAlign: 'right', color: C.muted }}>
                      {m.mastered ? `Mastered ${fmtDate(m.masteredAt)}` : m.passed && m.firstPassedAt ? `Passed once ${fmtDate(m.firstPassedAt)}` : m.placed ? (m.quickCheck && m.quickCheck.passed ? 'Skipped by quick check' : 'Placed past') : m.pendingWriting ? 'Needs your check' : m.attempts ? 'In progress' : 'Not started'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    );
    return (
      <div style={page}><PageChrome idleWarning={idleWarning} logoutIn={logoutIn} walkthrough={!!(record && record.preview)} /><div className="edu-wrap" style={wrap}>
        <div className="edu-no-print">
          <button type="button" onClick={() => setScreen('educator-report')} style={linkBtn}>Back to report</button>
        </div>
        <div style={{ margin: '12px 0 6px' }}><Logo width={180} /></div>
        <h1 style={{ fontSize: 24, margin: '10px 0 2px', textAlign: 'center' }}>Transcript</h1>
        <p style={{ margin: '0 0 18px', textAlign: 'center', color: C.muted, fontSize: 15 }}>{who} · issued {fmtDate(tr.generatedAt)}</p>

        {/* One explanation at the top, so the headings below can stand on their own. */}
        <div style={{ border: `1px solid ${C.line}`, borderRadius: 10, padding: 14, marginBottom: 18, background: C.surface }}>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, textAlign: 'center' }}>Courses are considered complete once every associated module is mastered. Completions remain on this record indefinitely. Currently assigned courses can appear or disappear depending on whether or not they are actively assigned. <InfoButton onClick={() => setShowPlacedTip(!showPlacedTip)} label="About placed and skipped modules" open={showPlacedTip} /></p>
                  {showPlacedTip && <TipText><strong>Placed Past</strong> means that a student has cleared a module by demonstrating their knowledge in a placement test.<br /><br /><strong>Skipped by quick-check</strong> means a student has cleared a module without entering the lesson by correctly answering five test questions.<br /><br />Neither of the above situations lead to a mastered status (stars still need to be earned) and students will continue to be exposed to questions from these modules at random (routed back for review if necessary).</TipText>}
        </div>

        {(() => {
          const grades = GRADES.filter((g) => tr.completed.some((c) => c.grade === g));
          if (!grades.length) return section('Completed courses', tr.completed);
          return (
            <div style={{ marginBottom: 18 }}>
              <h2 style={{ fontSize: 19, margin: '0 0 8px' }}>Completed courses</h2>
              {grades.map((g) => { const open = openDoneGrades.includes(g); const list = tr.completed.filter((c) => c.grade === g);
                return (
                  <div key={g} style={{ border: `1px solid ${C.line}`, borderRadius: 10, marginBottom: 8, overflow: 'hidden', background: C.surface }}>
                    <button type="button" className="edu-no-print" aria-expanded={open} onClick={() => setOpenDoneGrades((l) => (l.includes(g) ? l.filter((x) => x !== g) : [...l, g]))}
                      style={{ fontFamily: FONT, width: '100%', textAlign: 'left', background: C.greenSoft, border: 'none', padding: '12px 14px', cursor: 'pointer', color: C.ink, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 16, fontWeight: 600 }}>{gradeLabel(g)}</span>
                      <span style={{ fontSize: 14, color: C.muted }}>{list.length} {list.length === 1 ? 'course ' : 'courses '}{open ? '▴' : '▾'}</span>
                    </button>
                    <p className="edu-print-only" style={{ margin: 0, padding: '10px 14px 0', fontWeight: 600 }}>{gradeLabel(g)}</p>
                    <div className="edu-collapsible" style={{ display: open ? 'block' : 'none', padding: '8px 10px' }}>{section('', list)}</div>
                  </div>
                ); })}
            </div>
          );
        })()}
        {section('Courses in progress', tr.inProgress)}

        {tr.retention.asked > 0 && (
          <div style={{ border: `1px solid ${C.line}`, borderRadius: 10, padding: 14, marginBottom: 18, background: C.surface }}>
            <p style={{ margin: 0, fontSize: 15, textAlign: 'center' }}>Memory checks from earlier modules: {tr.retention.correct} of {tr.retention.asked} answered correctly.</p>
          </div>
        )}

        <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, textAlign: 'center' }}>{tr.note}</p>
        <p style={{ fontSize: 13, color: C.muted, textAlign: 'center' }}>Untouched courses are left off of this record for obvious reasons.</p>

        <div className="edu-no-print" style={{ marginTop: 16 }}>
          <Btn full onClick={() => { if (typeof window !== 'undefined' && window.print) window.print(); }}>Print or save as PDF</Btn>

        </div>
      </div></div>
    );
  }

  // ---------- Educator screens. NOTE: the PIN is a convenience lock for the prototype, not security.
  // Real educator accounts with real permissions arrive in phase 1. ----------
  const EDUCATOR_PIN = '2468';

  if (screen === 'change-state') {
    return (
      <div style={page}><PageChrome idleWarning={idleWarning} logoutIn={logoutIn} walkthrough={!!(record && record.preview)} /><div className="edu-wrap" style={wrap}>
        <button type="button" onClick={() => setScreen('educator-pick')} style={linkBtn}>Back to Classroom</button>
        <h1 style={{ fontSize: 24, margin: '12px 0 8px' }}>Your state</h1>
        <p style={{ color: C.muted, marginTop: 0, fontSize: 15 }}>Each state publishes its own learning standards. Your reports show coverage against the standards that apply to you.</p>
        <div style={card}>
          <select value={stateDraft} onChange={(e) => setStateDraft(e.target.value)} aria-label="Your state"
            style={{ fontFamily: FONT, fontSize: 16, padding: '10px 12px', width: '100%', boxSizing: 'border-box', border: `2px solid ${C.line}`, borderRadius: 10, background: C.surface, marginBottom: 12 }}>
            {STATES.map((st) => <option key={st.code} value={st.code}>{st.name}</option>)}
          </select>
          <Btn full onClick={async () => { setStateCode(stateDraft); await saveStateCode(stateDraft); goBackTo(); }}>Save</Btn>
        </div>
      </div></div>
    );
  }

  // ---------- Creating the educator account: PIN, device name and state, asked once ----------
  if (screen === 'educator-setup') {
    return (
      <div style={page}><PageChrome idleWarning={idleWarning} logoutIn={logoutIn} walkthrough={!!(record && record.preview)} /><div className="edu-wrap" style={wrap}>
        <button type="button" onClick={() => setScreen('welcome')} style={{ background: 'none', border: 'none', color: C.green, fontFamily: FONT, fontSize: 15, cursor: 'pointer', padding: 0 }}>Back</button>
        <h1 style={{ fontSize: 24, margin: '12px 0 8px', textAlign: 'center' }}>Create your educator account</h1>
        <p style={{ color: C.muted, marginTop: 0, fontSize: 15, textAlign: 'center' }}>Credentials live on this device only. Nothing is sent anywhere.</p>
        <div style={card}>
          <HeadWithInfo onClick={() => setShowPinTip(!showPinTip)} label="About the PIN" open={showPinTip}>Choose a PIN</HeadWithInfo>
          <p style={{ margin: '0 0 8px', fontSize: 14, color: C.muted, textAlign: 'center' }}>Four to six digits.</p>
          {showPinTip && <p style={{ ...tipStyle, textAlign: 'center' }}>A PIN is important for keeping students out of the educator pages.<br /><br />Don't worry, lost PINs are easy to recover!</p>}
          <PinInput value={newPin} onChange={setNewPin} placeholder="PIN"
            style={{ fontFamily: FONT, fontSize: 18, padding: '12px 14px', width: '100%', boxSizing: 'border-box', border: `2px solid ${C.line}`, borderRadius: 10, marginBottom: 10, letterSpacing: 4 }} />
          <PinInput value={newPin2} onChange={setNewPin2} placeholder="PIN again"
            style={{ fontFamily: FONT, fontSize: 18, padding: '12px 14px', width: '100%', boxSizing: 'border-box', border: `2px solid ${C.line}`, borderRadius: 10, letterSpacing: 4 }} />
        </div>
        <div style={card}>
          <p style={{ margin: '0 0 6px', fontWeight: 600, textAlign: 'center' }}>This device's name</p>
          <p style={{ margin: '0 0 8px', fontSize: 14, color: C.muted, textAlign: 'center' }}>Student progress should be backed up regularly. The name you choose here becomes part of the backup file so multiple device classrooms are easier to restore.<br /><br />(i.e. iPad 3, laptop, chrome book 4).</p>
          <input value={deviceDraft} onChange={(e) => setDeviceDraft(e.target.value)} placeholder="This device's name"
            style={{ fontFamily: FONT, fontSize: 16, padding: '10px 12px', width: '100%', boxSizing: 'border-box', border: `2px solid ${C.line}`, borderRadius: 10 }} />
        </div>
        <div style={card}>
          <p style={{ margin: '0 0 6px', fontWeight: 600, textAlign: 'center' }}>Your state
            <button type="button" onClick={() => setShowStateTip(!showStateTip)} aria-label="Why we ask for your state"
              style={{ background: 'none', border: `1.5px solid ${C.green}`, color: C.green, fontFamily: FONT, fontSize: 12, fontWeight: 700, lineHeight: '15px', width: 18, height: 18, borderRadius: 999, cursor: 'pointer', padding: 0, marginLeft: 8, verticalAlign: 'middle' }}>i</button>
          </p>
          {showStateTip && <p style={{ ...tipStyle, textAlign: 'center' }}>Each state publishes its own learning standards. Most use the Common Core; Texas uses its own. Our courses are mapped to both!<br /><br />Choosing a state mildly alters the course flow and you can change this later from the <strong>My Classroom</strong> page.</p>}
          <select value={stateDraft} onChange={(e) => setStateDraft(e.target.value)} aria-label="Your state"
            style={{ fontFamily: FONT, fontSize: 16, padding: '10px 12px', width: '100%', boxSizing: 'border-box', border: `2px solid ${C.line}`, borderRadius: 10, background: C.surface }}>
            <option value="">Choose a state</option>
            {STATES.map((st) => <option key={st.code} value={st.code}>{st.name}</option>)}
          </select>
        </div>
        <Btn full onClick={async () => {
          if (newPin.length < 4) { setSetupError('The PIN needs at least four digits.'); return; }
          if (newPin !== newPin2) { setSetupError('The two PINs do not match.'); return; }
          if (!deviceDraft.trim() && !deviceName) { setSetupError('Give this device a name.'); return; }
          if (!stateDraft && !stateCode) { setSetupError('Choose your state.'); return; }
          const profile = pendingProfile
            ? { ...pendingProfile, pin: scramble(newPin) }
            : { version: 1, pin: scramble(newPin), recovery: makeRecoveryCode(Date.now() + newPin.length), createdAt: new Date().toISOString(), resets: [] };
          setPendingProfile(null);
          await saveEducator(profile); setEducator(profile);
          if (deviceDraft.trim()) { setDeviceName(deviceDraft.trim()); await saveDeviceName(deviceDraft.trim()); }
          if (stateDraft) { setStateCode(stateDraft); await saveStateCode(stateDraft); }
          setLastActive(Date.now());
          setScreen('educator-pick');
        }}>Create account</Btn>
        {setupError && <p style={{ color: C.clay, fontSize: 14 }}>{setupError}</p>}
      </div></div>
    );
  }

  if (screen === 'educator-pin') {
    // With an account on this device, its PIN is the key. Without one, the prototype PIN still opens the door.
    const ok = educator ? scramble(pinInput) === educator.pin : pinInput === EDUCATOR_PIN;
    return (
      <div style={page}><PageChrome idleWarning={idleWarning} logoutIn={logoutIn} walkthrough={!!(record && record.preview)} /><div className="edu-wrap edu-welcome" style={wrap}>
        <button type="button" onClick={() => setScreen('welcome')} style={{ background: 'none', border: 'none', color: C.green, fontFamily: FONT, fontSize: 15, cursor: 'pointer', padding: 0, alignSelf: 'flex-start' }}>Back</button>
        <div className="edu-login-body">
        <h1 style={{ fontSize: 24, margin: '12px 0 22px', textAlign: 'center' }}>Please log in to continue:</h1>
        <div style={card}>
          <p style={{ margin: '0 0 10px' }}>Enter your PIN.</p>
          <PinInput value={pinInput} onChange={setPinInput} placeholder="PIN" onEnter={() => { if (ok) goBackTo(); }}
            style={{ fontFamily: FONT, fontSize: 18, padding: '12px 14px', width: '100%', boxSizing: 'border-box', border: `2px solid ${C.line}`, borderRadius: 10, marginBottom: 12, letterSpacing: 4 }} />
          <div style={{ paddingBottom: 10 }}><Btn full onClick={goBackTo} disabled={!ok}>Open</Btn></div>
          {educator && educator.biometric && biometricReady() && (
            <div style={{ paddingBottom: 16, textAlign: 'center' }}>
              <Btn full kind="secondary" onClick={async () => { try { if (await checkBiometric(educator.biometric)) goBackTo(); } catch (e) { setBioNote('That did not work. Use your PIN.'); } }}>Use fingerprint or face</Btn>
              {bioNote && <p style={{ margin: '8px 0 0', fontSize: 13, color: C.muted }}>{bioNote}</p>}
            </div>
          )}
          {!educator && <p style={{ margin: '12px 0 0', fontSize: 14, color: C.muted, textAlign: 'center' }}>No educator account created on this device. <button type="button" onClick={() => { setNewPin(''); setNewPin2(''); setDeviceDraft(''); setStateDraft(''); setSetupError(''); setScreen('educator-setup'); }} style={{ ...linkBtn, fontSize: 14, padding: 0 }}>Create one here</button><br />Starter PIN still works and data can be merged later.</p>}
          {educator && !forgotPin && <p style={{ margin: '12px 0 0', fontSize: 14, color: C.muted }}><button type="button" onClick={() => setForgotPin(true)} style={{ ...linkBtn, fontSize: 14, padding: 0 }}>Forgot my PIN</button></p>}
          {educator && forgotPin && (
            <div style={{ marginTop: 12, padding: 12, borderRadius: 10, background: C.goldSoft }}>
              <p style={{ margin: '0 0 10px', fontSize: 14, textAlign: 'center' }}>To reset your pin, select a backup file or type the recovery code into the field below.</p>
              <input value={typedCode} onChange={(e) => setTypedCode(e.target.value)} placeholder="Recovery code, e.g. 1234-5678-9012-3456" inputMode="numeric"
                style={{ fontFamily: FONT, fontSize: 16, padding: '10px 12px', width: '100%', boxSizing: 'border-box', border: `2px solid ${C.line}`, borderRadius: 10, marginBottom: 10 }} />
              {educator.biometric && biometricReady() && (
                <div style={{ marginBottom: 10 }}>
                  <Btn full kind="secondary" onClick={async () => {
                    try { if (!(await checkBiometric(educator.biometric))) return; } catch (e) { setSetupError('That did not work. Use the recovery code or a backup file.'); return; }
                    const kept = { ...educator, pin: null, resets: [...(educator.resets || []), new Date().toISOString()] };
                    await saveEducator(kept); setEducator(null); setPendingProfile(kept); setTypedCode('');
                    setForgotPin(false); setNewPin(''); setNewPin2(''); setDeviceDraft(deviceName); setStateDraft(stateCode); setSetupError(''); setScreen('educator-setup');
                  }}>Reset with fingerprint or face</Btn>
                </div>
              )}
              {typedCode.replace(/[^0-9]/g, '').length === 16 && (
                <div style={{ marginBottom: 10 }}>
                  <Btn onClick={async () => {
                    if (!codeMatches(typedCode, educator.recovery)) { setSetupError('That code does not match this classroom.'); return; }
                    const kept = { ...educator, pin: null, resets: [...(educator.resets || []), new Date().toISOString()] };
                    await saveEducator(kept); setEducator(null); setPendingProfile(kept); setTypedCode('');
                    setForgotPin(false); setNewPin(''); setNewPin2(''); setDeviceDraft(deviceName); setStateDraft(stateCode); setSetupError(''); setScreen('educator-setup');
                  }}>Reset with this code</Btn>
                </div>
              )}
              {setupError && <p style={{ margin: '0 0 10px', fontSize: 14, color: C.clay }}>{setupError}</p>}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, maxWidth: 360, margin: '0 auto' }}>
                <label style={{ display: 'block' }}>
                  <span style={{ display: 'block', textAlign: 'center', fontFamily: FONT, fontSize: 15, fontWeight: 600, padding: '9px 14px', borderRadius: 10, background: C.green, color: '#fff', cursor: 'pointer' }}>Choose File</span>
                  <input type="file" accept="application/json,.json" style={{ display: 'none' }} onChange={async (e) => {
                    const f = e.target.files && e.target.files[0];
                    if (!f) return;
                    try {
                      const data = JSON.parse(await f.text());
                      if (!backupProvesOwnership(data, educator.recovery)) { setSetupError('That file is not a backup of this classroom, so it cannot reset the PIN.'); return; }
                      const kept = { ...educator, pin: null, resets: [...(educator.resets || []), new Date().toISOString()] };
                      await saveEducator(kept); setEducator(null); setPendingProfile(kept);
                      setForgotPin(false); setNewPin(''); setNewPin2(''); setDeviceDraft(deviceName); setStateDraft(stateCode); setSetupError(''); setScreen('educator-setup');
                    } catch (err) { setSetupError('That file could not be read.'); }
                    e.target.value = '';
                  }} />
                </label>
                <Btn full kind="secondary" onClick={() => setForgotPin(false)} style={{ padding: '9px 14px', minHeight: 40, fontSize: 15 }}>Cancel</Btn>
              </div>
            </div>
          )}
          {pinInput.length >= 4 && !ok && <p style={{ color: C.clay, fontSize: 14 }}>That PIN is not right.</p>}
        </div>
        </div>
        <p style={{ color: C.muted, fontSize: 13, textAlign: 'center', marginTop: 'auto', paddingTop: 80 }}>PIN numbers are easily reset. First, backup your classroom. Then, reset keys can be found within the backup file.</p>
      </div></div>
    );
  }

  // ---------- The roster: add, rename, hide and merge students ----------
  if (screen === 'educator-pick') {
    // Every change writes the whole roster back, then refreshes the screen from it.
    const applyRoster = async (next, error) => {
      setRosterError(error || '');
      if (error) return;
      changedSinceBackup.current = true;
      setRoster(next);
      const outcome = await saveRoster(next);
      if (!outcome.saved) setSaveNote('That change could not be saved on this device. This happens only during incognito browsing or when browser storage is full.');
    };
    const visible = classroomOrder(roster.students.filter((st) => st.active));
    const hidden = roster.students.filter((st) => !st.active);
    const isControl = (el) => !!(el && el.closest && el.closest('button, input, textarea, select, a'));
    const rowUnder = (y) => { const rows = visible.map((st, i) => ({ i, el: cardEls.current.get(st.id) })).filter((r) => r.el); const hit = rows.find((r) => { const b = r.el.getBoundingClientRect(); return y >= b.top && y <= b.bottom; }); return hit ? hit.i : (rows.length && y > rows[rows.length - 1].el.getBoundingClientRect().bottom ? rows.length - 1 : 0); };
    const dragEnd = async () => {
      clearTimeout(dragTimer.current); dragTimer.current = null;
      if (dragId !== null && dragOver !== null) {
        const ids = visible.map((st) => st.id).filter((id) => id !== dragId); ids.splice(dragOver, 0, dragId);
        await applyRoster(setClassroomOrder(roster, ids));
      }
      setDragId(null); setDragOver(null);
    };
    const holdProps = (st) => ({
      onPointerDown: (e) => { if (isControl(e.target) || renamingId) return; dragStart.current = { x: e.clientX, y: e.clientY }; dragTimer.current = setTimeout(() => { setDragId(st.id); setDragOver(visible.findIndex((x) => x.id === st.id)); }, 450); },
      onPointerMove: (e) => { if (dragTimer.current && dragStart.current && Math.hypot(e.clientX - dragStart.current.x, e.clientY - dragStart.current.y) > 8) { clearTimeout(dragTimer.current); dragTimer.current = null; } if (dragId === st.id) { dragY.current = e.clientY; setDragOver(rowUnder(e.clientY)); } },
      onPointerUp: dragEnd, onPointerCancel: dragEnd, onContextMenu: (e) => { if (dragId) e.preventDefault(); },
    });
    const newsPopup = newsOpen && news ? (
      <div className="edu-no-print" style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, background: 'rgba(36, 41, 31, 0.55)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <div className="edu-rise" style={{ width: 'min(440px, 100%)', background: C.surface, borderRadius: 14, padding: '24px 22px', textAlign: 'center' }} role="dialog" aria-label="What's new">
          <p style={{ margin: '0 0 4px', fontSize: 19, fontWeight: 700 }}>What's new</p>
          <p style={{ margin: '0 0 14px', fontSize: 13, color: C.muted }}>{news.date}</p>
          <ul style={{ margin: '0 0 18px', padding: '0 0 0 22px', textAlign: 'left', fontSize: 15, lineHeight: 1.6 }}>{news.items.map((t, k) => <li key={k}>{t}</li>)}</ul>
          <Btn onClick={async () => { setNewsOpen(false); const next = { ...educator, newsSeen: news.stamp }; setEducator(next); await saveEducator(next); }}>Got it</Btn>
        </div>
      </div>
    ) : null;
    return (
      <div style={page}><PageChrome idleWarning={idleWarning} logoutIn={logoutIn} walkthrough={!!(record && record.preview)} /><div className="edu-wrap" style={wrap}>
        {tourPopup}
        {newsPopup}
        {(() => {
          const days = daysSinceBackup(backupAt, new Date().toISOString());
          const overdue = visible.length > 0 && (days === null || days >= 1);
          return (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
              <button type="button" onClick={() => { if (record && record.preview) { setRecord(null); setScreen('educator-pick'); } else setScreen('welcome'); }} style={{ background: 'none', border: 'none', color: C.green, fontFamily: FONT, fontSize: 15, cursor: 'pointer', padding: 0 }}>Home</button>
              {/* Ends the session now, so the next person at a shared device meets the PIN screen. */}
              <button type="button" onClick={async () => { await autoBackup('sign-out'); setLastActive(0); setIdleWarning(false); closeTips(); setScreen('welcome'); }} style={{ background: 'none', border: 'none', color: C.muted, fontFamily: FONT, fontSize: 14, cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>Sign out</button>
            </div>
          );
        })()}
        <h1 style={{ fontSize: 24, margin: '12px 0 4px', textAlign: 'center' }}>My Classroom</h1>
        {educator && backupAt === null && !backupNudgeSeen && tourStep < 0 && (
          <div className="edu-no-print" style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, background: 'rgba(36, 41, 31, 0.55)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            <div className="edu-rise" style={{ maxWidth: 420, width: '100%', background: C.surface, borderRadius: 14, padding: 22, textAlign: 'center' }}>
              <p style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 600 }}>Make your first backup soon</p>
              <p style={{ margin: '0 0 18px', fontSize: 15, color: C.muted }}>A forgotten PIN can only be reset with a backup file.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <Btn full kind="secondary" onClick={() => setBackupNudgeSeen(true)}>Later</Btn>
                <Btn full onClick={() => { setBackupNudgeSeen(true); setScreen('backup'); }}>Backup now</Btn>
              </div>
            </div>
          </div>
        )}
        {educator && (educator.resets || []).length > 0 && (
          <p style={{ margin: '0 0 10px', fontSize: 13, color: C.muted }}>PIN last reset {fmtDate((educator.resets || []).slice(-1)[0])}.</p>
        )}
        <p className="edu-classroom-intro" style={{ color: C.muted, marginTop: 0, fontSize: 15, textAlign: 'center' }}>
          Input student ID, add, then assign a nickname. Students will login by selecting their name to avoid <span style={{ whiteSpace: 'nowrap' }}>typos.
          <button type="button" onClick={() => setShowRosterTip(!showRosterTip)} aria-label="More about nicknames"
            style={{ background: 'none', border: `1.5px solid ${C.green}`, color: C.green, fontFamily: FONT, fontSize: 12, fontWeight: 700, lineHeight: '15px', width: 18, height: 18, borderRadius: 999, cursor: 'pointer', padding: 0, marginLeft: 6, verticalAlign: 'middle' }}>i</button></span>
        </p>
        {showRosterTip && (
          <TipText>
            Early-years students are given a picture beside their nickname, so they can find themselves on the sign-in screen without reading.

          </TipText>
        )}
        <div style={{ height: 10 }} />

        <div className="edu-narrow" data-tour="add"><Btn full onClick={() => { setAdding(true); setRosterError(''); setRosterInput(''); setNewLevel(''); setNewPicture(''); setNewTint(''); setWizardPin(''); setWizardWonder(true); setShowWonderWhy(false); }}>Add someone new</Btn></div>
        <div style={{ height: 14 }} />
        {visible.length > 1 && (
          <div className="edu-narrow" style={{ marginTop: 10, marginBottom: 28 }}>
            <div style={{ position: 'relative' }}>
              <div data-tour="help"><Btn full kind="secondary" onClick={async () => {
                const students = [];
                for (const st of visible) { const r = await loadRecord(st.id); students.push({ id: st.id, label: st.label, events: r.events }); }
                setClassRows(classView(students, new Date().toISOString()));
                setScreen('class-view');
              }}>Who needs help</Btn></div>
              <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', display: 'inline-flex' }}><InfoButton onClick={() => setShowHelpTip(!showHelpTip)} label="About who needs help" open={showHelpTip} /></span>
            </div>
            {showHelpTip && <TipText>A list of struggling students who might need some guidance. Fast clicking, repeat failures and low confidence scores will push a student to the top of the list.</TipText>}
          </div>
        )}
        {adding && (
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, background: 'rgba(36, 41, 31, 0.55)', zIndex: 100, overflowY: 'auto', padding: '24px 12px' }}>
            <div className="edu-rise" style={{ maxWidth: 560, margin: '0 auto', background: C.surface, borderRadius: 14, padding: 22, position: 'relative', textAlign: 'center' }}>
              <button type="button" onClick={() => setAdding(false)} aria-label="Close"
                style={{ position: 'absolute', top: 8, right: 10, background: 'none', border: 'none', width: 36, height: 36, fontSize: 30, lineHeight: '34px', cursor: 'pointer', color: C.ink, fontFamily: FONT, padding: 0 }}>×</button>
              <p style={{ margin: '0 0 14px', fontWeight: 600, fontSize: 18 }}>Add someone new</p>

          <input value={rosterInput} onChange={(e) => setRosterInput(e.target.value)} placeholder="School-issued ID" maxLength={NAME_MAX}
            style={{ fontFamily: FONT, fontSize: 17, padding: '12px 14px', width: '100%', boxSizing: 'border-box', border: `2px solid ${C.line}`, borderRadius: 10, marginBottom: 14, textAlign: 'center' }} />
          {/* A rough starting level. It only decides where the placement check begins. */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, marginBottom: 12 }}>
            {LEVELS.map((lv) => {
              const on = newLevel === lv.id;
              return (
                <button key={lv.id} type="button" aria-pressed={on}
                  onClick={() => {
                    setNewLevel(on ? '' : lv.id);
                    // Suggest a picture nobody is using yet, so the common case is one tap.
                    if (!on && lv.picture) { const free = firstFreePicture(roster); setNewPicture(free.picture); setNewTint(free.tint); }
                    if (!lv.picture || on) { setNewPicture(''); setNewTint(''); }
                  }}
                  style={{ fontFamily: FONT, textAlign: 'center', padding: '12px 12px', borderRadius: 10, cursor: 'pointer', background: on ? C.greenSoft : C.surface, border: `2px solid ${on ? C.green : C.line}`, color: C.ink }}>
                  <span style={{ display: 'block', fontSize: 15, fontWeight: 600 }}>{lv.title}</span>
                  <span style={{ display: 'block', fontSize: 12, color: C.muted, marginTop: 2 }}>{lv.blurb}</span>
                </button>
              );
            })}
            {newLevel && levelFor(newLevel) && (
              <div style={{ gridColumn: '1 / -1', marginTop: 4 }}>
                <p style={{ margin: '0 0 6px', fontSize: 14, color: C.muted }}>Which grade should they start in? The placement check can still move a reader up or down from here.</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                  {gradesWithCourses().filter((g) => levelFor(newLevel).grades.includes(g)).map((g) => {
                    const on = newStartGrade === g;
                    return <button key={g} type="button" aria-pressed={on} onClick={() => setNewStartGrade(on ? '' : g)} style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, padding: '8px 12px', borderRadius: 10, cursor: 'pointer', background: on ? C.greenSoft : C.surface, border: `2px solid ${on ? C.green : C.line}`, color: C.ink }}>{gradeLabel(g)}</button>;
                  })}
                </div>
              </div>
            )}
          </div>
          {/* Only the early years are asked for a picture, since only they need one. */}
          {levelFor(newLevel) && levelFor(newLevel).picture && (
            <>
              <p style={{ margin: '0 0 6px', fontSize: 14, color: C.muted }}>Choose a sign-in picture.</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10, justifyContent: 'center' }}>
                {PICTURES.map((pic) => (
                  <button key={pic} type="button" onClick={() => setNewPicture(pic)} aria-label={pic} aria-pressed={newPicture === pic}
                    style={{ padding: 3, borderRadius: 12, cursor: 'pointer', background: C.surface, border: `2px solid ${newPicture === pic ? C.green : C.line}` }}>
                    <StudentPicture name={pic} tint={newTint} size={42} />
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                {TINTS.map((t) => (
                  <button key={t.id} type="button" onClick={() => setNewTint(t.id)} aria-label={t.id} aria-pressed={newTint === t.id}
                    style={{ width: 30, height: 30, borderRadius: 999, cursor: 'pointer', background: t.color, border: `3px solid ${newTint === t.id ? C.green : C.surface}`, boxShadow: `0 0 0 1px ${C.line}` }} />
                ))}
                {newPicture && pictureInUse(roster, newPicture, newTint, normalizeStudentId(rosterInput)) && <span style={{ fontSize: 13, color: C.clay }}>Another student has this one.</span>}
              </div>
            </>
          )}
          <div style={{ marginTop: 26 }}>
            <HeadWithInfo onClick={() => setShowPinWhy(!showPinWhy)} label="About the PIN" open={showPinWhy}>PIN (optional)</HeadWithInfo>
            {showPinWhy && <TipText>Four digits the student types after tapping their name, so nobody opens the wrong record.</TipText>}
            <PinInput value={wizardPin} onChange={setWizardPin} placeholder="PIN"
              style={{ fontFamily: FONT, fontSize: 18, letterSpacing: 6, padding: '10px 14px', width: 200, boxSizing: 'border-box', border: `2px solid ${C.line}`, borderRadius: 10, display: 'block', margin: '0 auto', textAlign: 'center' }} />
          </div>
          <div style={{ marginTop: 26, marginBottom: 20 }}>
            <HeadWithInfo onClick={() => setShowWonderWhy(!showWonderWhy)} label="About wonder questions" open={showWonderWhy}>Wonder Questions</HeadWithInfo>
            {showWonderWhy && <TipText>Wonder Questions are optional thought-provoking questions sprinkled between learning modules.<br /><br />They're designed to help students reframe failure as an effective way to learn and promote curiosity, emotional resilience and, most importantly, right-hemispheric thinking.<br /><br />Students only see the questions you approve (see bottom of <strong>My Classroom</strong>).</TipText>}
            <SegToggle size="big" options={[['on', 'On'], ['off', 'Off']]} value={wizardWonder ? 'on' : 'off'} onChange={(v) => setWizardWonder(v === 'on')} ariaLabel="Wonder Questions" />
          </div>
          <Btn full onClick={async () => {
            const r = addStudent(roster, rosterInput, new Date().toISOString(), { level: newLevel, picture: newPicture, tint: newTint, startGrade: newStartGrade || null, pin: wizardPin, wonder: wizardWonder });
            await applyRoster(r.roster, r.error);
            if (!r.error) {
              // A new student starts with the recommended courses for their level, not every course there is.
              const id = normalizeStudentId(rosterInput);
              const rec = await loadRecord(id);
              if (!rec.events.some((e) => e.type === 'courses_enabled')) {
                const starter = makeCoursesEnabledEvent(recommendedCourseIds([makeCoursesEnabledEvent([], new Date().toISOString())], newLevel, newStartGrade || null), new Date().toISOString());
                await saveRecord({ ...rec, events: [...rec.events, starter] });
              }
              setRosterInput(''); setNewLevel(''); setNewStartGrade(''); setNewPicture(''); setNewTint(''); setWizardPin(''); setWizardWonder(true); setShowWonderWhy(false); setAdding(false);
            }
          }}>Add</Btn>
          {rosterError && <p style={{ color: C.clay, fontSize: 14, margin: '10px 0 0' }}>{rosterError}</p>}
            </div>
          </div>
        )}

        {visible.length === 0 && <div style={{ ...card, background: C.greenSoft, borderColor: C.greenSoft, textAlign: 'center' }}><p style={{ margin: 0, color: C.muted }}>Nobody here yet. Add someone above.</p></div>}
        {visible.length > 0 && (<div style={{ ...card, padding: 10, background: 'linear-gradient(135deg, #E6F0E8 0%, #F3F8F4 100%)', borderColor: '#C9DCCF' }}>
          <button type="button" className="edu-fold-head" onClick={() => setActiveOpen(!activeOpen)} aria-expanded={activeOpen}
            style={{ fontFamily: FONT, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, #D6E6DB 0%, #E6F0E8 100%)', border: '1px solid #C9DCCF', borderRadius: 12, padding: '14px 16px', marginBottom: 10, cursor: 'pointer', color: C.ink }}>
            <span className="edu-fold-title" style={{ fontSize: 18, fontWeight: 600 }}>Active Students</span>
            <span className="edu-fold-meta" style={{ fontSize: 14, color: C.muted }}>{visible.length} {activeOpen ? '▴' : '▾'}</span>
          </button>
        {activeOpen && visible.length > 1 && <p style={{ margin: '0 0 8px', fontSize: 13, color: C.muted, textAlign: 'center' }}>Youngest band first, then by name. Press and hold a card to drag it somewhere else.</p>}
        {activeOpen && visible.map((st, i) => (
          <div key={st.id} ref={(el) => { if (el) cardEls.current.set(st.id, el); else cardEls.current.delete(st.id); }} {...holdProps(st)}
            style={{ ...card, paddingBottom: 14, touchAction: dragId ? 'none' : 'auto', WebkitUserSelect: dragId ? 'none' : 'auto', userSelect: dragId ? 'none' : 'auto', opacity: dragId === st.id ? 0.55 : 1, transform: dragId === st.id ? 'scale(1.02)' : 'none', boxShadow: dragId === st.id ? '0 8px 24px rgba(36, 41, 31, 0.25)' : 'none', borderTop: dragId && dragOver === i && dragId !== st.id ? `4px solid ${C.green}` : undefined, transition: 'transform 0.15s ease, opacity 0.15s ease' }}>
            {renamingId === st.id ? (
              <>
                <input value={renameInput} onChange={(e) => setRenameInput(e.target.value)} placeholder="Name shown to the student" maxLength={NAME_MAX}
                  style={{ fontFamily: FONT, fontSize: 17, padding: '10px 12px', width: '100%', boxSizing: 'border-box', border: `2px solid ${C.line}`, borderRadius: 10, marginBottom: 10 }} />
                <div style={{ display: 'flex', gap: 10 }}>
                  <Btn onClick={async () => { const r = renameStudent(roster, st.id, renameInput); await applyRoster(r.roster, r.error); if (!r.error) setRenamingId(null); }}>Save name</Btn>
                  <Btn kind="secondary" onClick={() => { setRenamingId(null); setRosterError(''); }}>Cancel</Btn>
                </div>
                <p style={{ color: C.muted, fontSize: 13, margin: '10px 0 0' }}>The ID stays the same, so progress follows the new name.</p>
              </>
            ) : (
              <>
                <div className="edu-student-body">
                <div className="edu-student-left">
                {/* The picture sits beside the name, to its right on a laptop so that every name and link
                    starts at the same edge, with or without one; on a phone it moves above the name. */}
                <div className="edu-student-name-row">
                  <div style={{ minWidth: 0 }}>
                    <span style={{ display: 'block', fontSize: 18, fontWeight: 600 }}>{keepTogether(st.label)}</span>
                    {st.level && <span style={{ display: 'block', fontSize: 12, color: C.muted }}>{levelFor(st.level).title}{st.startGrade ? ` · ${gradeLabel(st.startGrade)}` : ''}</span>}
                  </div>
                  {st.picture && <StudentPicture name={st.picture} tint={st.tint} size={40} />}
                </div>
                <div style={{ flex: '1 1 auto', minWidth: 0 }}>
                {/* On a laptop the name, grade and links stack on the left and Open report sits on the right, centered
                    on them; on a phone the name and links stay as they are and Open report sits below them, centered. */}
                <div className="edu-student-actions" style={{ marginTop: 8 }}>
                  <button type="button" onClick={() => { setRenamingId(st.id); setRenameInput(st.label); setRosterError(''); }} style={cardLink}>Rename</button>
                  <button type="button" onClick={() => setPictureFor(pictureFor === st.id ? null : st.id)} style={cardLink}>{st.picture ? 'Change picture' : 'Add picture'}</button>
                  <button type="button" onClick={() => { setPinFor(pinFor === st.id ? null : st.id); setPinDraft(''); }} style={cardLink}>{st.pin ? 'Change PIN' : 'Add PIN'}</button>
                  <span aria-hidden="true" style={{ flexBasis: '100%', height: 0 }} />{/* the second row starts here, whatever the first row's labels */}
                  <button type="button" onClick={() => applyRoster(setStudentActive(roster, st.id, false))} style={cardLink}>Hide</button>
                  {mergeFrom === '' ? (
                    <button type="button" onClick={() => { setMergeFrom(st.id); setRosterError(''); }} style={cardLink}>Merge into…</button>
                  ) : mergeFrom === st.id ? (
                    <button type="button" onClick={() => setMergeFrom('')} style={cardLink}>Cancel merge</button>
                  ) : (
                    <button type="button" onClick={async () => {
                      const r = mergeStudents(roster, st.id, mergeFrom);
                      if (!r.error) {
                        const keep = await loadRecord(st.id); const gone = await loadRecord(mergeFrom);
                        await saveRecord({ ...keep, events: mergeEventLogs(keep.events, gone.events) });
                      }
                      await applyRoster(r.roster, r.error);
                      setMergeFrom('');
                    }} style={{ ...cardLink, color: C.gold }}>Merge here</button>
                  )}
                </div>
                {certificatesPending(st, readyGrades[st.id] || []).map((g) => (
                  <div key={g} className="edu-rise" style={{ margin: '10px auto 0', maxWidth: 360, padding: '10px 12px', borderRadius: 12, background: '#FFF8E8', border: `2px solid ${C.gold}`, textAlign: 'center' }}>
                    <p style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 700 }}>Finished {certGradeName(g)}!</p>
                    <button type="button" style={cardLink} onClick={() => { setCertFor({ id: st.id, grade: g }); setCertTemplate('classic'); setCertName(''); setCertPhotos([]); setCertNote(''); setScreen('certificate'); }}>Make a certificate</button>
                    <button type="button" style={{ ...cardLink, marginRight: 0 }} onClick={() => applyRoster(setCertificateState(roster, st.id, g, 'skipped'))}>Not now</button>
                  </div>
                ))}
                {/* Wonder Questions stands on its own line, last, because it opens a popup rather than acting at once. */}
                <div className="edu-student-wonder">
                  <button type="button" onClick={() => setWonderPopupFor(st.id)} style={{ ...cardLink, marginRight: 0, display: 'inline-flex', alignItems: 'center', gap: 8 }}>Wonder Questions
                    <span aria-hidden="true" style={{ display: 'inline-block', fontSize: 12, fontWeight: 700, letterSpacing: 0.5, padding: '2px 10px', borderRadius: 999, background: wonderOnFor(st) ? C.green : C.line, color: wonderOnFor(st) ? '#FFFFFF' : C.muted, textDecoration: 'none' }}>{wonderOnFor(st) ? 'ON' : 'OFF'}</span>
                  </button>
                </div>
                </div>
                </div>
                <div className="edu-student-open" data-tour={i === 0 ? 'report' : undefined}><Btn kind="secondary" disabled={busy} onClick={async () => {
                    setBusy(true);
                    const rec = await withStarterCourses(await loadRecord(st.id));
                    setEducatorRecord(rec);
                    setRecommendedIds(recommendedCourseIds(rec.events, st.level));
                    setOpenSubjects([]); setShowAllCourses(false); setConfirmReset(false); setBusy(false); setScreen('educator-report');
                  }}>Open report</Btn></div>
                </div>
                {mergeFrom === st.id && <p style={{ color: C.gold, fontSize: 13, margin: '8px 0 0' }}>Now tap “Merge here” on the student to keep. Both histories are joined; nothing is deleted.</p>}
                {wonderPopupFor === st.id && (
                  <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, background: 'rgba(36, 41, 31, 0.55)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setWonderPopupFor(null)}>
                    <div className="edu-rise" style={{ width: 'min(420px, 100%)', background: C.surface, borderRadius: 14, padding: '26px 22px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                      <p style={{ margin: '0 0 6px', fontSize: 19, fontWeight: 700 }}>Wonder Questions</p>
                      <p style={{ margin: '0 0 18px', fontSize: 15, color: C.muted }}>Currently: <strong style={{ color: wonderOnFor(st) ? C.green : C.ink }}>{wonderOnFor(st) ? 'On' : 'Off'}</strong></p>
                      <SegToggle size="big" options={[['on', 'On'], ['off', 'Off']]} value={wonderOnFor(st) ? 'on' : 'off'} onChange={(v) => applyRoster(setStudentWonder(roster, st.id, v === 'on'))} ariaLabel="Wonder Questions" />
                      <Btn kind="secondary" onClick={() => setWonderPopupFor(null)}>Close</Btn>
                    </div>
                  </div>
                )}
                {pinFor === st.id && (
                  <div style={{ marginTop: 10, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <PinInput value={pinDraft} onChange={setPinDraft} placeholder="New PIN"
                      style={{ fontFamily: FONT, fontSize: 17, letterSpacing: 6, padding: '10px 14px', width: 200, boxSizing: 'border-box', border: `2px solid ${C.line}`, borderRadius: 10 }} />
                    <Btn disabled={pinDraft.length !== PIN_LENGTH} onClick={async () => { await applyRoster(setStudentPin(roster, st.id, pinDraft)); setPinFor(null); }}>Save PIN</Btn>
                    {st.pin && <button type="button" style={linkBtn} onClick={async () => { await applyRoster(setStudentPin(roster, st.id, null)); setPinFor(null); }}>Remove PIN</button>}
                    <button type="button" style={linkBtn} onClick={() => setPinFor(null)}>Cancel</button>
                  </div>
                )}
                {pictureFor === st.id && (
                  <div style={{ marginTop: 10 }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                      {PICTURES.map((pic) => (
                        <button key={pic} type="button" onClick={() => applyRoster(setStudentPicture(roster, st.id, pic, st.tint || TINTS[0].id))} aria-label={pic}
                          style={{ padding: 3, borderRadius: 12, cursor: 'pointer', background: C.surface, border: `2px solid ${st.picture === pic ? C.green : C.line}` }}>
                          <StudentPicture name={pic} tint={st.tint || TINTS[0].id} size={40} />
                        </button>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      {TINTS.map((t) => (
                        <button key={t.id} type="button" onClick={() => applyRoster(setStudentPicture(roster, st.id, st.picture || PICTURES[0], t.id))} aria-label={t.id}
                          style={{ width: 30, height: 30, borderRadius: 999, cursor: 'pointer', background: t.color, border: `3px solid ${st.tint === t.id ? C.green : C.surface}`, boxShadow: `0 0 0 1px ${C.line}` }} />
                      ))}
                      {st.picture && pictureInUse(roster, st.picture, st.tint, st.id) && <span style={{ fontSize: 13, color: C.clay }}>Another student has this one.</span>}
                      {st.picture && <button type="button" style={linkBtn} onClick={async () => { await applyRoster(setStudentPicture(roster, st.id, null)); setPictureFor(null); }}>No picture</button>}
                      <button type="button" style={linkBtn} onClick={() => setPictureFor(null)}>Done</button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
        </div>)}

        {hidden.length > 0 && (
          <button type="button" className="edu-fold-head" onClick={() => setHiddenOpen(!hiddenOpen)} aria-expanded={hiddenOpen}
            style={{ fontFamily: FONT, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: C.surface, border: `1px solid ${C.line}`, borderRadius: 12, padding: '14px 16px', marginBottom: 10, cursor: 'pointer', color: C.ink }}>
            <span className="edu-fold-title" style={{ fontSize: 18, fontWeight: 600 }}>Inactive Students ({hidden.length})</span>
            <span className="edu-fold-meta" style={{ fontSize: 14, color: C.green, textDecoration: 'underline' }}>{hiddenOpen ? 'hide' : 'show'}</span>
          </button>
        )}
        {hidden.length > 0 && hiddenOpen && (
          <div style={card}>
            {hidden.map((st) => (
              <div key={st.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, padding: '6px 0' }}>
                <span style={{ color: C.muted }}>{st.label}{st.mergedInto ? ` (merged into ${(findStudent(roster, st.mergedInto) || { label: st.mergedInto }).label})` : ''}</span>
                {!st.mergedInto && (
                  <span style={{ display: 'inline-flex', gap: 12, alignItems: 'center' }}>
                    <button type="button" onClick={() => applyRoster(setStudentActive(roster, st.id, true))} style={linkBtn}>Show again</button>
                    <button type="button" onClick={() => setConfirmDelete(st.id)} style={{ ...linkBtn, color: C.clay }}>Delete</button>
                  </span>
                )}
              </div>
            ))}
            <p style={{ color: C.muted, fontSize: 13, margin: '8px 0 0', padding: '0 20px', textAlign: 'center' }}>Inactive students are those you've chosen to hide. All student progress is retained but they are hidden from the login screen. Deleting inactive students will remove all of their history and progress from this point forward but data can still be recovered from old backup files.</p>
            {hidden.filter((st) => !st.mergedInto).length > 1 && (
              <div style={{ textAlign: 'center', marginTop: 14 }}>
                <button type="button" onClick={() => setConfirmDelete('__all__')} style={{ ...linkBtn, color: C.clay, fontSize: 15 }}>Delete all inactive students</button>
              </div>
            )}
          </div>
        )}
        {/* One clear popup over everything, for one student or for all of them. */}
        {confirmDelete && (() => {
          const all = confirmDelete === '__all__';
          const targets = all ? hidden.filter((st) => !st.mergedInto) : hidden.filter((st) => st.id === confirmDelete);
          if (!targets.length) return null;
          const doDelete = async () => {
            let next = roster;
            for (const st of targets) { await storageDelete(STORE_PREFIX + slug(st.id)); next = removeStudent(next, st.id); }
            await applyRoster(next);
            setConfirmDelete(null);
          };
          return (
            <div role="dialog" aria-modal="true" onClick={() => setConfirmDelete(null)} style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, background: 'rgba(36, 41, 31, 0.55)', zIndex: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
              <div onClick={(e) => e.stopPropagation()} style={{ ...card, maxWidth: 420, width: '100%', textAlign: 'center', padding: 22, boxShadow: '0 12px 40px rgba(0,0,0,0.25)' }}>
                <p style={{ margin: '0 0 8px', fontSize: 19, fontWeight: 700 }}>{all ? `Delete every record for all ${targets.length} inactive students?` : `Delete every record for ${targets[0].label}?`}</p>
                <p style={{ margin: '0 0 18px', fontSize: 15, color: C.muted }}>Their history and progress leave this device for good. Old backup files still hold them.</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
                  <Btn onClick={doDelete} style={{ background: C.clay, borderColor: C.clay, minWidth: 140 }}>Yes, delete</Btn>
                  <Btn kind="secondary" onClick={() => setConfirmDelete(null)} style={{ minWidth: 140 }}>Keep</Btn>
                </div>
              </div>
            </div>
          );
        })()}
        <RemembranceCard educator />
        <div style={{ ...card, marginTop: 22, textAlign: 'center' }}>
          <div style={{ margin: '0 0 16px', padding: '12px 14px', borderRadius: 10, background: C.greenSoft, textAlign: 'center' }}>
            <p style={{ margin: '0 0 4px', fontWeight: 600 }}>Quick checks</p>
            <p style={{ margin: '0 0 8px', fontSize: 14, color: C.muted, lineHeight: 1.5 }}>All new students (above grade 2) start by taking placement tests. Quick Checks allow for further refinement by allowing students to skip the material they already know through knowledge-based tests. <InfoButton onClick={() => setShowQuickTip(!showQuickTip)} label="About quick checks" open={showQuickTip} /></p>
            {showQuickTip && <TipText>Generically placing a student into grade 3 math (after failing grade 4 in a placement test) is an over-simplification. They may already understand some of the grade 3 material. Quick-checks are opportunities for students to skip individual modules (in this case, grade 3 math modules) through five-question knowledge tests and allow for less wasted time.<br /><br /><strong>Note:</strong> Successful skips lead to a transcript status of "placed" rather than "mastered." If they answer too quickly, it doesn't count. Future memory checks will further test their level of understanding of these skipped modules by integrating the concepts into new material, ensuring that nothing slips through the cracks. If necessary, we route them backwards.</TipText>}
            <SegToggle options={[['on', 'On'], ['off', 'Off']]} value={quickChecks ? 'on' : 'off'} onChange={async (key) => { const next = key === 'on'; setQuickChecks(next); await saveQuickChecks(next); }} ariaLabel="Quick checks on or off" />
          </div>
          <p style={{ margin: '0 0 6px', fontWeight: 600 }} data-tour="walk">Walk through as a student</p>
          <p style={{ margin: '0 0 10px', fontSize: 15 }}>See exactly what a student sees. Every module is open, every question can be skipped, and nothing is recorded.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {LEVELS.map((lv) => <button key={lv.id} type="button" aria-label={`Walk through ${lv.title.toLowerCase()}`} onClick={() => startPreview(lv.id)} style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, padding: '10px 16px', borderRadius: 10, background: C.surface, border: `2px solid ${C.green}`, color: C.green, cursor: 'pointer' }}>{lv.title}</button>)}
          </div>
        </div>
        <div className="edu-two-up" style={{ marginTop: 22 }}>
        {FEATURES.reflection && (
          <div data-tour="wonder" style={{ ...card, background: 'linear-gradient(135deg, #DCEBE1 0%, #EEF5F0 100%)', borderColor: '#C9DCCF', display: 'flex', flexDirection: 'column' }}>
            <p style={{ margin: '0 0 6px', fontWeight: 600, textAlign: 'center' }}>Wonder Questions</p>
            <p style={{ margin: '0 0 10px', fontSize: 15, textAlign: 'center' }}>{wonderAwaitingReview(wonderReview) > 0 ? `${wonderAwaitingReview(wonderReview)} to review. These optional reflection questions remain invisible until approved.` : 'All reviewed. Only the ones you approved are shown to students.'}</p>
            <div style={{ marginTop: 'auto' }}><Btn full kind="secondary" onClick={() => setScreen('wonder-review')}>Wonder Questions</Btn></div>
          </div>
        )}
        <div data-tour="reading" style={{ ...card, background: 'linear-gradient(135deg, #E3E9F3 0%, #F1F4F9 100%)', borderColor: '#C9D3E3', display: 'flex', flexDirection: 'column' }}>
          <p style={{ margin: '0 0 6px', fontWeight: 600, textAlign: 'center' }}>Reading Lists</p>
          <p style={{ margin: '0 0 10px', fontSize: 15, textAlign: 'center' }}>Don't know what books to read? No problem! Check out our curated list organized by grade.</p>
          <div style={{ marginTop: 'auto' }}><Btn full kind="secondary" onClick={() => setScreen('reading-lists')}>Reading Lists</Btn></div>
        </div>
        <div data-tour="experiments" style={{ ...card, background: 'linear-gradient(135deg, #F3DCD2 0%, #FAECE6 100%)', borderColor: '#E6C4B6', display: 'flex', flexDirection: 'column' }}>
          <p style={{ margin: '0 0 6px', fontWeight: 600, textAlign: 'center' }}>Science Experiments</p>
          <p style={{ margin: '0 0 10px', fontSize: 15, textAlign: 'center' }}>Who says science is boring? We have cool experiment ideas for every age group!</p>
          <div style={{ marginTop: 'auto' }}><Btn full kind="secondary" onClick={() => setScreen('experiments')}>Experiments</Btn></div>
        </div>
        {FEATURES.lifeSkills && (
          <div data-tour="life" style={{ ...card, background: 'linear-gradient(135deg, #F3E7C9 0%, #FAF3E1 100%)', borderColor: '#E6D4A6', display: 'flex', flexDirection: 'column' }}>
            <p style={{ margin: '0 0 6px', fontWeight: 600, textAlign: 'center' }}>Practical Life Skills</p>
            <p style={{ margin: '0 0 10px', fontSize: 15, textAlign: 'center' }}>If everything goes right, you'll find yourself learning at an accelerated pace. These are the skills for those hours you save.</p>
            <div style={{ marginTop: 'auto' }}><Btn full kind="secondary" onClick={() => setScreen('life-skills')}>Life Skills</Btn></div>
          </div>
        )}
        </div>
        {saveNote && <p style={{ color: C.muted, fontSize: 13, textAlign: 'center', marginTop: 32 }}>{saveNote}</p>}
        {(() => {
          const days = daysSinceBackup(backupAt, new Date().toISOString());
          const overdue = visible.length > 0 && (days === null || days >= 1);
          return (
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              {/* The halo pulses behind the link while a backup is due, and rests once one has been taken today. */}
              <span style={{ position: 'relative', display: 'inline-block' }}>
                <button type="button" data-tour="backup" onClick={() => setScreen('backup')} className={`edu-backup-link${overdue ? ' edu-glow' : ''}`} style={{ position: 'relative', background: 'none', border: 'none', color: C.green, fontFamily: FONT, fontSize: 16, fontWeight: 600, cursor: 'pointer', padding: '8px 12px', textDecoration: 'underline' }}>Backup classroom</button>
                <button type="button" onClick={() => setShowBackupTip(!showBackupTip)} aria-label="About backups"
                  style={{ position: 'absolute', left: '100%', top: '50%', transform: 'translateY(-50%)', background: 'none', border: `1.5px solid ${C.green}`, color: C.green, fontFamily: FONT, fontSize: 12, fontWeight: 700, lineHeight: '15px', width: 18, height: 18, borderRadius: 999, cursor: 'pointer', padding: 0 }}>i</button>
              </span>
                    {showBackupTip && (
                <p style={{ ...tipStyle, textAlign: 'center' }}>All student progress is regularly backed up into your device's download folder. However, we still recommend manual backups to a shared drive folder. This insures student progress against broken or lost devices.<br /><br />Only one recent backup file is required for restoration of all settings and progress for both students and educators!</p>
              )}
            </div>
          );
        })()}
        {/* The story log: the very last link on the page, a page of its own. */}
        {roster.students.some((st) => st.active) && (
          <p className="edu-no-print" style={{ textAlign: 'center', margin: '18px 0 0' }}>
            <button type="button" onClick={async () => {
              setBusy(true);
              const rows = [];
              for (const st of roster.students.filter((x) => x.active)) { const rec = await withStarterCourses(await loadRecord(st.id)); rows.push({ id: st.id, label: st.label, events: rec.events || [] }); }
              setStoryRows(rows); setStoryView({}); setOpenStoryId(null); setBusy(false); setScreen('story-log');
            }} disabled={busy} style={{ ...linkBtn, fontSize: 15 }}>Story Log</button>
          </p>
        )}
        <ContactLine onOpen={() => setShowContact(true)} />
        {showContact && <ContactPopup onClose={() => setShowContact(false)} />}
      </div></div>
    );
  }

  // ---------- The whole class, most in need first ----------
  // ---------- Story-based Learning: every student's stories, read, unread or most recent, each opening in its own window ----------
  if (screen === 'story-log' && storyRows) {
    const goalOf = (moduleId) => { const m = getModule(moduleId); return m ? m.title : ''; };
    const line = (moduleId) => { const st = storyFor(moduleId); if (!st) return null; return { moduleId, title: st.title, about: st.about || '', goal: goalOf(moduleId) }; };
    const listFor = (row) => {
      const view = storyView[row.id] || 'recent';
      const read = storiesRead(row.events);                                     // [{ moduleId, at }] newest first
      const readIds = new Set(read.map((r) => r.moduleId));
      const available = enabledCourseIds(row.events).flatMap((cid) => { const c = getCourse(cid); return c ? c.modules.map((m) => m.id) : []; }).filter((id) => storyFor(id));
      if (view === 'read') return read.map((r) => ({ ...line(r.moduleId), at: r.at })).filter((x) => x.title);
      if (view === 'unread') return available.filter((id) => !readIds.has(id)).map((id) => line(id)).filter(Boolean);
      const dayOf = (at) => { const d = new Date(at); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; };
      const today = dayOf(new Date().toISOString()); const todays = read.filter((r) => dayOf(r.at) === today);
      return (todays.length ? todays : read.slice(0, 5)).map((r) => ({ ...line(r.moduleId), at: r.at })).filter((x) => x.title);
    };
    const countsFor = (row) => {
      const readIds = new Set(storiesRead(row.events).map((r) => r.moduleId));
      const available = enabledCourseIds(row.events).flatMap((cid) => { const c = getCourse(cid); return c ? c.modules.map((m) => m.id) : []; }).filter((id) => storyFor(id));
      return { read: available.filter((id) => readIds.has(id)).length, total: available.length };
    };
    const openStory = openStoryId ? storyFor(openStoryId) : null;
    const SHOW = 5;   // a long list shows five rows, then offers the rest
    const markRead = async (studentId, moduleId) => {
      const rec = await loadRecord(studentId); const next = { ...rec, events: [...(rec.events || []), makeStoryReadEvent(moduleId, new Date().toISOString())] };
      await saveRecord(next); changedSinceBackup.current = true;
      setStoryRows(storyRows.map((r) => (r.id === studentId ? { ...r, events: next.events } : r)));
    };
    return (
      <div style={page}><PageChrome idleWarning={idleWarning} logoutIn={logoutIn} /><div className="edu-wrap" style={wrap}>
        <p className="edu-no-print" style={{ margin: '4px 0 12px' }}><button type="button" onClick={() => { setScreen('educator-pick'); setOpenStoryId(null); }} style={linkBtn}>Back to Classroom</button></p>
        <h1 style={{ fontSize: 24, margin: '12px 0 8px', textAlign: 'center' }}>Story-based Learning</h1>
        <p style={{ margin: '0 0 8px', fontSize: 15, color: C.muted, textAlign: 'center' }}>Each learning module pairs with a short story to teach an idea before the questions do. This page shows everything a student has read, what's pending and what was read most recently. <button type="button" onClick={() => setShowStoryWhy(!showStoryWhy)} aria-label="About story-based learning" aria-expanded={showStoryWhy} style={inlineInfoStyle(showStoryWhy)}>i</button></p>
        {showStoryWhy && <p style={{ ...tipStyle, textAlign: 'center' }}>Stories stick where facts slide off. A student who has read about the cart that would not start remembers Newton's laws as a girl and a heavy load, not as three sentences.<br /><br />Open any story and read it together or print it for the classroom wall. <strong>Most Recent</strong> is either something that was read today or, if there's nothing for the day, the prior five.</p>}
        {storyRows.map((row) => {
          const items = listFor(row); const view = storyView[row.id] || 'recent'; const counts = countsFor(row);
          const expanded = !!storyExpanded[row.id]; const shown = expanded ? items : items.slice(0, SHOW);
          return (
            <div key={row.id} style={{ ...card, marginTop: 14, padding: 0, overflow: 'hidden' }} className="edu-story-row">
              {/* The name band is a light green, so the list below reads as its own thing. */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap', padding: '12px 16px', background: C.greenSoft }}>
                <p style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{row.label} <span style={{ fontWeight: 400, fontSize: 14, color: C.muted }}>{counts.read} of {counts.total} read</span></p>
                <select aria-label={`Stories to show for ${row.label}`} value={view} onChange={(e) => { setStoryView({ ...storyView, [row.id]: e.target.value }); setStoryExpanded({ ...storyExpanded, [row.id]: false }); }} className="edu-no-print" style={{ fontFamily: FONT, fontSize: 14, padding: '6px 10px', borderRadius: 8, border: `1px solid ${C.line}`, background: C.surface, color: C.ink }}>
                  <option value="recent">Most recent</option>
                  <option value="read">Read</option>
                  <option value="unread">Unread</option>
                </select>
              </div>
              <div style={{ padding: '4px 16px 12px' }}>
                {items.length === 0 && <p style={{ margin: '10px 0 0', fontSize: 14, color: C.muted }}>{view === 'unread' ? 'Nothing waiting: every assigned story has been read.' : 'No stories read yet.'}</p>}
                {shown.map((it, i) => (
                  <div key={`${it.moduleId}-${i}`} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 0', borderTop: i === 0 ? 'none' : `1px solid ${C.line}` }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontWeight: 600 }}>{it.title}</p>
                      {it.at && <p style={{ margin: '1px 0 0', fontSize: 13, color: C.muted }}>{niceDateShort(it.at)}</p>}
                      <p style={{ margin: '2px 0 0', fontSize: 14, color: C.muted }}>{it.about ? `A story about ${it.about}. ` : ''}{it.goal ? `It teaches ${it.goal.charAt(0).toLowerCase() + it.goal.slice(1)}.` : ''}</p>
                    </div>
                    <Btn kind="secondary" onClick={() => { setOpenStoryId(it.moduleId); setOpenStoryFor(row.id); }} style={{ padding: '8px 14px', minHeight: 38, fontSize: 14 }}>Open</Btn>
                  </div>
                ))}
                {items.length > SHOW && (
                  <p className="edu-no-print" style={{ margin: '6px 0 0', textAlign: 'center' }}>
                    <button type="button" onClick={() => setStoryExpanded({ ...storyExpanded, [row.id]: !expanded })} style={{ ...linkBtn, fontSize: 14 }}>{expanded ? 'Show fewer' : `Show ${items.length - SHOW} more`}</button>
                  </p>
                )}
              </div>
            </div>
          );
        })}
        <div className="edu-no-print" style={{ textAlign: 'center', marginTop: 28 }}>
          <Btn onClick={() => { if (typeof window !== 'undefined' && window.print) window.print(); }}>Print all</Btn>
        </div>
        {openStory && (
          <div className="edu-no-print" style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, background: 'rgba(36, 41, 31, 0.55)', zIndex: 140, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: 16, overflowY: 'auto' }} onClick={(e) => { if (e.target === e.currentTarget) setOpenStoryId(null); }}>
            <div className="edu-rise edu-story-sheet" style={{ width: 'min(560px, 100%)', background: C.surface, borderRadius: 14, padding: '18px 18px 22px', position: 'relative', marginTop: 12 }} role="dialog" aria-label={openStory.title}>
              <button type="button" onClick={() => setOpenStoryId(null)} aria-label="Close" style={{ position: 'absolute', top: 8, right: 10, background: 'none', border: 'none', color: C.green, fontFamily: FONT, fontSize: 26, cursor: 'pointer', lineHeight: 1 }}>×</button>
              <p style={{ margin: '0 0 6px' }}>
                <button type="button" onClick={() => { document.body.classList.add('edu-story-mode'); window.print(); setTimeout(() => document.body.classList.remove('edu-story-mode'), 500); }} style={{ ...linkBtn, fontSize: 13, color: C.muted }}>Print</button>
                {openStoryFor && !storiesRead((storyRows.find((r) => r.id === openStoryFor) || { events: [] }).events).some((r) => r.moduleId === openStoryId)
                  ? <button type="button" onClick={() => markRead(openStoryFor, openStoryId)} style={{ ...linkBtn, fontSize: 13, color: C.muted, marginLeft: 14 }}>Mark as Read</button>
                  : openStoryFor ? <span style={{ fontSize: 13, color: C.muted, marginLeft: 14 }}>Read</span> : null}
              </p>
              <StoryBody story={openStory} />
            </div>
          </div>
        )}
      </div></div>
    );
  }
  if (screen === 'class-view' && classRows) {
    const tone = (band) => (band === 'needs help now' ? 'review' : band === 'keep an eye on' ? 'locked' : 'mastered');
    return (
      <div style={page}><PageChrome idleWarning={idleWarning} logoutIn={logoutIn} walkthrough={!!(record && record.preview)} /><div className="edu-wrap" style={wrap}>
        <button type="button" onClick={() => setScreen('educator-pick')} style={linkBtn}>Back to Classroom</button>
        <h1 style={{ fontSize: 24, margin: '12px 0 16px', textAlign: 'center' }} data-tour="help">Who needs help</h1>
        <p className="edu-print-only" style={{ margin: '0 0 12px', textAlign: 'center', fontSize: 14, color: C.muted }}>{educator && educator.deviceName ? `${educator.deviceName}, ` : ''}{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}. Ranked most in need first.</p>
        <div style={{ ...card, background: C.greenSoft, borderColor: C.greenSoft, marginBottom: 24 }}>
          {classSummary(classRows).split('\n').map((line, i) => <p key={i} style={{ margin: i === 0 ? '0 0 10px' : 0, fontSize: 16, lineHeight: 1.6, textAlign: 'center', fontWeight: i === 0 ? 400 : 700 }}>{line}</p>)}
        </div>
        <div className="edu-no-print" style={{ margin: '0 0 14px' }}>
          <input value={noteSearch} onChange={(e) => setNoteSearch(e.target.value)} aria-label="Search notes" placeholder="Search your notes, for example: shy"
            style={{ width: '100%', boxSizing: 'border-box', fontFamily: FONT, fontSize: 15, padding: '10px 12px', borderRadius: 10, border: `1px solid ${C.line}`, textAlign: 'center' }} />
        </div>
        {classRows.filter((r) => (!noteSearch.trim() || r.notesText.toLowerCase().includes(noteSearch.trim().toLowerCase()))).length === 0 && (
          <p style={{ textAlign: 'center', color: C.muted, fontSize: 15 }}>{noteSearch.trim() ? 'No note says that.' : 'Nobody needs a look right now.'}</p>
        )}
        {classRows.filter((r) => (!noteSearch.trim() || r.notesText.toLowerCase().includes(noteSearch.trim().toLowerCase()))).map((r) => {
          const st = findStudent(roster, r.id);
          return (
            <div key={r.id} style={{ ...card, borderColor: r.band === 'needs help now' ? C.clay : C.line }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {st && st.picture && <StudentPicture name={st.picture} tint={st.tint} size={36} />}
                  <span>
                    <span style={{ display: 'block', fontSize: 17, fontWeight: 600 }}>{r.label}</span>
                    {r.stage && <span style={{ display: 'block', fontSize: 12, fontWeight: 400, color: C.muted }}>{r.stage}</span>}
                  </span>
                </span>
                <Tag tone={tone(r.band)}>{r.band}</Tag>
              </div>
              {r.why && <p style={{ margin: '8px 0 0', fontSize: 15, fontWeight: 600 }}>{r.why}</p>}
              <div style={{ margin: '10px 0 0', fontSize: 15 }}>
                {(() => { const lines = r.reasons.length ? r.reasons.map((x) => x.replace(/^./, (c) => c.toUpperCase()) + '.') : ['Nothing to flag.'];
                  const tally = r.total ? `${r.mastered} out of ${r.total} assigned modules have been mastered.` : 'No courses assigned.';
                  const next = r.nextTitle ? ` Next up: **${r.nextTitle}**.` : '';
                  return <RichText text={[...lines, tally + next].join('\n')} size={15} lineGap={4} />; })()}
              </div>
              {r.practice && <div style={{ margin: '14px 0 0', paddingTop: 10, borderTop: `1px solid ${C.line}`, fontSize: 14, color: C.muted }}><RichText text={r.practice} size={14} lineGap={4} /></div>}
              {r.note && <p style={{ margin: '10px 0 0', fontSize: 14, fontStyle: 'italic' }}>Your note: {noteSearch.trim() && !r.note.toLowerCase().includes(noteSearch.trim().toLowerCase()) ? (r.notesAll.find((n) => n.toLowerCase().includes(noteSearch.trim().toLowerCase())) || r.note) : r.note}</p>}
              <div style={{ marginTop: 8, textAlign: 'right' }}>
                <button type="button" style={linkBtn} onClick={async () => {
                  setBusy(true);
                  const rec = await withStarterCourses(await loadRecord(r.id));
                  setEducatorRecord(rec); setRecommendedIds(recommendedCourseIds(rec.events, st ? st.level : null));
                  setOpenSubjects([]); setShowAllCourses(false); setConfirmReset(false); setBusy(false); setScreen('educator-report');
                }}>Open report</button>
              </div>
            </div>
          );
        })}
        {!noteSearch.trim() && <p style={{ fontSize: 13, color: C.muted, textAlign: 'center', padding: '0 24px' }}>Order is chosen by student metrics. Stuck on a module? Frequent loop backs? Guessing or low confidence? To the top for you. <InfoButton onClick={() => setShowOrderTip(!showOrderTip)} label="About the order" open={showOrderTip} /></p>}
        {!noteSearch.trim() && showOrderTip && <TipText>If students share an "on track" status, they are ordered by the number of attempts required to remain on track (more attempts on top).</TipText>}
        <div className="edu-no-print" style={{ textAlign: 'center', marginTop: 40 }}>
          <Btn onClick={() => { if (typeof window !== 'undefined' && window.print) window.print(); }}>Print this list</Btn>
          {/* The class's weekly notes print from a sheet built only for the printer, so the page itself carries nothing extra. */}
          <p className="edu-no-print" style={{ textAlign: 'center', margin: '10px 0 0' }}><button type="button" onClick={() => {
            const esc = (t) => String(t).replace(/[&<>]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[ch]));
            const sheet = document.createElement('div'); sheet.className = 'edu-class-notes';
            sheet.innerHTML = `<p style="font-size:20px;font-weight:700;margin:0 0 12px">Weekly notes</p>${classRows.map((r) => `<div style="margin:0 0 14px;padding-bottom:10px;border-bottom:1px solid #D9DED4"><p style="margin:0 0 4px;font-weight:600">${esc(r.label)}</p><p style="margin:0;font-size:15px;line-height:1.6;white-space:pre-wrap">${esc(r.weekly)}</p></div>`).join('')}<p style="margin:0;font-size:12px;color:#6B7266">EDUSphere: The Smart Way to Learn. ${esc(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }))}</p>`;
            document.body.appendChild(sheet); document.body.classList.add('edu-classnotes-mode'); window.print();
            setTimeout(() => { document.body.classList.remove('edu-classnotes-mode'); sheet.remove(); }, 500);
          }} style={{ ...linkBtn, fontSize: 13, color: C.muted }}>Print weekly notes</button></p>
        </div>
        {tourPopup}
      </div></div>
    );
  }

  // ---------- Backup: the whole classroom in one file, nothing sent anywhere ----------
  if (screen === 'certificate' && certFor) {
    const template = CERT_TEMPLATES.find((t) => t.id === certTemplate) || CERT_TEMPLATES[0];
    const student = findStudent(roster, certFor.id);
    const date = new Date().toLocaleDateString(CERT_TEXT[certLang].locale, { year: 'numeric', month: 'long', day: 'numeric' });
    const addPhoto = (i, file) => { if (!file) return; const r = new FileReader(); r.onload = () => setCertPhotos((p) => { const next = [...p]; next[i] = String(r.result); return next; }); r.readAsDataURL(file); };
    const finish = async (state) => { const next = setCertificateState(roster, certFor.id, certFor.grade, state); setRoster(next); await saveRoster(next); setCertPhotos([]); setCertFor(null); setScreen('educator-pick'); };
    return (
      <div style={page}><PageChrome idleWarning={idleWarning} /><div className="edu-wrap" style={wrap}>
        <button type="button" className="edu-no-print" onClick={() => finish(((student && student.certificates) || {})[certFor.grade] || 'skipped')} style={{ ...linkBtn, marginBottom: 8 }}>Back to Classroom</button>
        <h1 className="edu-no-print" style={{ fontSize: 24, margin: '0 0 4px', textAlign: 'center' }}>Certificate</h1>
        <p className="edu-no-print" style={{ margin: '0 0 16px', color: C.muted, textAlign: 'center' }}>{(student && student.label) || certFor.id} finished every module of {certGradeName(certFor.grade)}.</p>
        <div className="edu-no-print" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 14 }}>
          {CERT_TEMPLATES.map((t) => (
            <button key={t.id} type="button" onClick={() => { setCertTemplate(t.id); setCertPhotos([]); }} aria-pressed={certTemplate === t.id}
              style={{ fontFamily: FONT, padding: '12px 10px', borderRadius: 12, cursor: 'pointer', textAlign: 'center', background: certTemplate === t.id ? C.greenSoft : C.surface, border: `2px solid ${certTemplate === t.id ? C.green : C.line}`, color: C.ink }}>
              <span style={{ display: 'block', fontWeight: 700 }}>{t.title}</span><span style={{ display: 'block', fontSize: 13, color: C.muted, marginTop: 4 }}>{t.blurb}</span>
            </button>
          ))}
        </div>
        <div className="edu-no-print" style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}><SegToggle options={[['en', 'English'], ['es', 'Español']]} value={certLang} onChange={setCertLang} ariaLabel="Certificate language" /></div>
        <div className="edu-no-print" style={{ textAlign: 'center', marginBottom: 12 }}>
          <input value={certName} onChange={(e) => setCertName(e.target.value)} placeholder="Name to print on the certificate" maxLength={40} aria-label="Name on the certificate"
            style={{ fontFamily: FONT, fontSize: 17, padding: '12px 14px', width: 'min(420px, 100%)', boxSizing: 'border-box', border: `2px solid ${C.line}`, borderRadius: 10, textAlign: 'center' }} />
          <p style={{ margin: '8px 0 0', fontSize: 13, color: C.muted }}>The name and any photo live only on this sheet. EduSphere keeps neither.</p>
        </div>
        {template.photos > 0 && (
          <div className="edu-no-print" style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
            {Array.from({ length: template.photos }, (_, i) => (
              <label key={i} style={{ fontFamily: FONT, padding: '10px 14px', borderRadius: 10, border: `2px dashed ${certPhotos[i] ? C.green : C.line}`, background: certPhotos[i] ? C.greenSoft : C.surface, cursor: 'pointer', fontSize: 15, fontWeight: 600 }}>
                {certPhotos[i] ? `Photo ${i + 1}: change` : `Photo ${i + 1}: take or choose`}
                <input type="file" accept="image/*" capture="environment" onChange={(e) => addPhoto(i, e.target.files && e.target.files[0])} style={{ display: 'none' }} />
              </label>
            ))}
          </div>
        )}
        <div className={`edu-cert-sheet${template.h > template.w ? ' edu-cert-portrait' : ''}`} ref={certSheetRef} style={{ maxWidth: template.h > template.w ? 520 : undefined, margin: '0 auto' }}><CertificateSheet template={template} name={certName} grade={certFor.grade} photos={certPhotos} date={date} year={new Date().getFullYear()} lang={certLang} /></div>
        <div className="edu-no-print" style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', margin: '16px 0 8px' }}>
          <Btn onClick={() => window.print()}>Print</Btn>
          <Btn onClick={async () => { try { const svg = certSheetRef.current && certSheetRef.current.querySelector('svg'); const png = await certificatePng(svg, template.w, template.h); saveBlob(`edusphere-certificate-${certGradeName(certFor.grade).replace(/\s+/g, '-').toLowerCase()}.png`, png); setCertNote('Saved as a picture in your downloads. Share it from there.'); } catch (e) { setCertNote('This browser could not save the picture. Print works.'); } }}>Save picture</Btn>
          <Btn kind="secondary" onClick={() => finish('made')}>Done</Btn>
        </div>
        {certNote && <p className="edu-no-print" style={{ margin: 0, fontSize: 13, color: C.muted, textAlign: 'center' }}>{certNote}</p>}
      </div></div>
    );
  }
  if (screen === 'backup') {
    const days = daysSinceBackup(backupAt, new Date().toISOString());
    const activeCount = roster.students.filter((st) => st.active).length;
    // Share appears only where this browser can actually share a file. Most desktop browsers
    // cannot, so there it stays hidden and Download stands alone.
    // Share is offered on phones and tablets only, where the share sheet is dependable. A laptop
    // browser may claim it can share a file and then refuse, so there Download stands alone.
    const handheld = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    // Share is off for now: it failed on Mikey's phone as well as his laptop, and a button that fails is worse than none. Download works everywhere.
    const canShare = false;
    const makeFile = async () => {
      const everything = await gatherEverything(roster);
      const at = new Date().toISOString();
      const text = JSON.stringify(buildBackup({ ...everything, deviceName, recovery: educator ? educator.recovery : null }, at), null, 2);
      return { at, name: backupFileName(deviceName, activeCount, at), text };
    };
    const markDone = async (at, note) => { setBackupAt(at); await saveBackupAt(at); setBackupNote(note); };
    return (
      <div style={page}><PageChrome idleWarning={idleWarning} logoutIn={logoutIn} walkthrough={!!(record && record.preview)} /><div className="edu-wrap" style={wrap}>
        <button type="button" onClick={() => setScreen('educator-pick')} style={linkBtn}>Back to Classroom</button>
        <div style={{ height: 36 }} />
        <HeadWithInfo onClick={() => setShowBackupWhat(!showBackupWhat)} label="About backup files" open={showBackupWhat}><span style={{ fontSize: 24 }}>Backup classroom</span></HeadWithInfo>
        {showBackupWhat && <p style={{ ...tipStyle, textAlign: 'center' }}>A backup file holds every student's log (every module attempt, completed stories, individualized notes, settings and more). That includes assigned courses, educator settings, this device's name and even the recovery code for resetting a PIN.<br /><br />Simply restore from backup (on any device) and everything comes back.</p>}
        <p style={{ color: C.muted, marginTop: 0, fontSize: 15, textAlign: 'center' }}>
          <strong style={{ fontWeight: 600, color: C.ink }}>{days === null ? 'No backup yet.' : days === 0 ? 'Last backup today.' : `Last backup ${days} ${days === 1 ? 'day' : 'days'} ago.`}</strong>
          <br />Backups save all student progress and allow for restoration on any device at a later time.
        </p>
        <div style={{ height: 20 }} />

        {!(educator && educator.recovery) && (
          <div style={{ ...card, background: C.goldSoft, borderColor: C.goldSoft }}>
            <p style={{ margin: '0 0 4px', fontWeight: 600, textAlign: 'center' }}>No recovery code yet</p>
            <p style={{ margin: 0, fontSize: 14, color: C.muted, textAlign: 'center' }}>A recovery code, used to reset a pin, comes with an educator account. <button type="button" onClick={() => { setNewPin(''); setNewPin2(''); setDeviceDraft(deviceName || ''); setStateDraft(stateCode || ''); setSetupError(''); setScreen('educator-setup'); }} style={{ ...linkBtn, fontSize: 14, padding: 0 }}>Create one here</button>.</p>
            <p style={{ margin: '10px 0 0', fontSize: 14, color: C.muted, textAlign: 'center' }}>This device is still using a starter PIN. Once an account is created, your recovery code will appear here and within every backup file.</p>
          </div>
        )}
        {educator && educator.recovery && (
          <div style={{ ...card, background: C.greenSoft, borderColor: C.greenSoft }}>
            <p style={{ margin: '0 0 4px', fontWeight: 600, textAlign: 'center' }}>Recovery code</p>
            <p className="edu-recovery-code" style={{ margin: '0 0 6px', fontWeight: 700, letterSpacing: 1, textAlign: 'center', whiteSpace: 'nowrap' }}>{educator.recovery}</p>
            <p style={{ margin: 0, fontSize: 14, color: C.muted, textAlign: 'center' }}>This code is also written at the top of every backup file. If you ever forget your PIN, simply select "forgot my pin" on the login screen and type in the code or choose a backup file. Keep it where students cannot see it.</p>
          </div>
        )}
        <div style={card}>
          <p style={{ margin: '0 0 6px', fontWeight: 600, textAlign: 'center' }}>Automatic Backups</p>
          <p style={{ margin: '0 0 8px', fontSize: 14, color: C.muted, textAlign: 'center' }}>An automatic backup is generated within your downloads folder when:</p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ul className="edu-bullets" style={{ margin: 0, padding: '0 0 0 24px', fontSize: 15, fontWeight: 600, color: C.ink, textAlign: 'left', lineHeight: 2, display: 'inline-block' }}>
              <li>An educator makes changes and signs out.</li>
              <li>A student taps <em>Exit</em>.</li>
            </ul>
          </div>
          {autoBackupNote && <p style={{ margin: '22px 0 0', fontSize: 13, color: C.muted, textAlign: 'center' }}>{autoBackupNote}</p>}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: autoBackupNote ? 10 : 20 }}><InfoButton onClick={() => setShowAutoTip(!showAutoTip)} label="About the backup files" open={showAutoTip} /></div>
          {showAutoTip && <TipText>Only the newest file matters, so older ones can be deleted.</TipText>}
        </div>

        <div style={{ ...card, padding: '26px 18px' }}>
          <p style={{ margin: '0 0 6px', fontWeight: 600, textAlign: 'center' }}>Manual Backups</p>
          <p style={{ margin: '0 0 22px', fontSize: 14, color: C.muted, textAlign: 'center', lineHeight: 1.6 }}>Automatic backups are great but they live only on this device. Manual backups, however, allow you to select your own file destination.<br /><br />We recommend periodic saves into shared drive folders which insures both student progress and educator settings against lost or broken devices.<br /><br />Only one file is needed to restore all progress and settings on another device.</p>
          {/* One green button. Where the device can share a file (an iPad or a phone), it opens the device's own
              sheet, so Drive or Mail is one tap away; elsewhere it downloads, asking where to save on a laptop. */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Btn onClick={async () => {
              if (canShare) {
                const f = preparedBackup;
                if (!f) { setBackupNote('One moment, the backup is still being prepared. Try again.'); return; }
                const file = new File([f.text], f.name, { type: 'application/json' });
                if (navigator.canShare({ files: [file] })) {
                  navigator.share({ files: [file], title: 'EduSphere backup' })
                    .then(() => markDone(f.at, 'Shared. Wherever you sent it is now your backup.'))
                    .catch((err) => { if (err && err.name === 'AbortError') setBackupNote('Sharing was canceled.'); else setShareRefused(true); });
                  return;
                }
              }
              const f = await makeFile();
              const outcome = await downloadFile(f.name, f.text);
              if (outcome === 'canceled') setBackupNote('No file was saved.');
              else if (outcome) await markDone(f.at, 'Backup saved. Keep it somewhere safe, such as a shared folder or your email.');
              else setBackupNote('Downloads are not available here.');
            }}>Manual backup</Btn>
          </div>
          {backupNote && <p style={{ margin: '10px 0 0', fontSize: 14, color: C.muted, textAlign: 'center' }}>{backupNote}</p>}
        </div>

        <div style={card}>
          <p style={{ margin: '0 0 6px', fontWeight: 600, textAlign: 'center' }}>This device's name</p>
          <p style={{ margin: '0 0 8px', fontSize: 14, color: C.muted, textAlign: 'center' }}>Backing up your device includes the name you add here. This allows for a classroom of ten devices to read at a glance.</p>
          <input value={deviceName} onChange={(e) => setDeviceName(e.target.value)} onBlur={() => saveDeviceName(deviceName)} placeholder="Example: iPad 3, Chromebook"
            style={{ fontFamily: FONT, fontSize: 16, padding: '10px 12px', width: '100%', boxSizing: 'border-box', border: `2px solid ${C.line}`, borderRadius: 10 }} />
          <p style={{ margin: '8px 0 0', fontSize: 13, color: C.muted, textAlign: 'center' }}>Example file name: {backupFileName(deviceName || 'chromebook', activeCount || 2, new Date().toISOString())}</p>
        </div>

        {educator && biometricReady() && (
          <div style={card}>
            <p style={{ margin: '0 0 6px', fontWeight: 600, textAlign: 'center' }}>Fingerprint or face</p>
            <p style={{ margin: '0 0 12px', fontSize: 14, color: C.muted, textAlign: 'center' }}>Sign in to the educator pages with this device's fingerprint or face reader instead of typing the PIN. The PIN still works. This is set per device and nothing leaves it.</p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              {educator.biometric
                ? <Btn kind="secondary" onClick={async () => { const next = { ...educator, biometric: null }; setEducator(next); await saveEducator(next); setBioNote(''); }}>Turn off</Btn>
                : <Btn onClick={async () => { try { const id = await enrollBiometric(); const next = { ...educator, biometric: id }; setEducator(next); await saveEducator(next); setBioNote('On for this device.'); } catch (e) { setBioNote('This device did not offer a fingerprint or face reader.'); } }}>Turn on</Btn>}
            </div>
            {bioNote && <p style={{ margin: '10px 0 0', fontSize: 13, color: C.muted, textAlign: 'center' }}>{bioNote}</p>}
          </div>
        )}
        <div style={card}>
          <p style={{ margin: '0 0 6px', fontWeight: 600, textAlign: 'center' }}>Restore from backup</p>
          <p style={{ margin: '0 0 10px', fontSize: 14, color: C.muted, textAlign: 'center' }}>Restoring <strong>adds</strong> student metrics to whatever currently lives on this device. Students are matched by ID and histories are merged.<br />Nothing on this device is ever removed.</p>
          <label style={{ display: 'block', textAlign: 'center' }}>
            <span style={{ display: 'inline-block', width: 280, minHeight: 46, boxSizing: 'border-box', textAlign: 'center', fontFamily: FONT, fontSize: 16, fontWeight: 600, padding: '12px 18px', borderRadius: 10, border: `2px solid ${C.green}`, color: C.green, cursor: 'pointer' }}>Restore from backup file</span>
            <input type="file" accept="application/json,.json" style={{ display: 'none' }} onChange={async (e) => {
              const f = e.target.files && e.target.files[0];
              if (!f) return;
              try {
                const data = JSON.parse(await f.text());
                const problem = checkBackup(data);
                if (problem) { setRestoreNote(problem); return; }
                const merged = mergeBackup(await gatherEverything(roster), data);
                for (const r of merged.records) await saveRecord(r);
                await saveRoster(merged.roster); await saveWonderReview(merged.wonderReview); await saveCovered(merged.covered);
                setRoster(merged.roster); setWonderReview(merged.wonderReview); setCovered(merged.covered);
                const from = data.deviceName ? ` from ${data.deviceName}` : '';
                setRestoreNote(`Restored from ${data.deviceName ? data.deviceName : 'a'} backup file. ${merged.addedStudents} ${merged.addedStudents === 1 ? 'student was' : 'students were'} added and all relevant history was merged. Nothing was removed.`);
              } catch (err) { setRestoreNote('That file could not be read.'); }
              e.target.value = '';
            }} />
          </label>
          {restoreNote && <p style={{ margin: '10px 0 0', fontSize: 14, color: C.green, fontWeight: 600, textAlign: 'center' }}>{restoreNote}</p>}
        </div>
        <p style={{ color: C.muted, fontSize: 13, textAlign: 'center', margin: '52px 0 8px' }}>We send nothing anywhere. You choose where the file lives. Choose wisely.</p>
        {/* The two housekeeping links sit together at the very foot, well below the work of the page. */}
        {educator && !phoneScreen && <p style={{ textAlign: 'center', margin: '56px 0 0' }}><button type="button" style={{ ...linkBtn, fontSize: 13, color: C.muted }} onClick={async () => { const next = { ...educator, tourSeen: false }; setEducator(next); await saveEducator(next); tourBegun.current = false; setScreen('educator-pick'); }}>Show the first week tour again</button></p>}
        {/* Starting over: the educator profile (PIN, device name, state, tour) is removed and the students are untouched,
            so the account can be created again from the first screen. Two taps, so a stray touch does nothing. */}
        {educator && (
          <p style={{ textAlign: 'center', margin: phoneScreen ? '56px 0 0' : '10px 0 0' }}>
            {startOverArmed
              ? <span style={{ fontSize: 13, color: C.muted }}>Remove this educator account and keep every student? <button type="button" style={{ ...linkBtn, fontSize: 13, color: C.clay, marginLeft: 6 }} onClick={async () => { await storageDelete(EDUCATOR_KEY); setEducator(null); setStartOverArmed(false); setScreen('welcome'); }}>Yes, start over</button> <button type="button" style={{ ...linkBtn, fontSize: 13, marginLeft: 10 }} onClick={() => setStartOverArmed(false)}>No</button></span>
              : <button type="button" style={{ ...linkBtn, fontSize: 13, color: C.muted }} onClick={() => setStartOverArmed(true)}>Start over as a new educator</button>}
          </p>
        )}
      </div></div>
    );
  }

  // ---------- One student's report: summary, what's assigned, course switches, progress, resets ----------
  if (screen === 'educator-report' && educatorRecord) {
    // The codes a mastered module satisfies, in the state's framework, the same line the transcript prints.
    const codesForModule = (moduleId) => { const fw = frameworkForState(stateCode || 'CA'); return [...new Set(CURRICULUM.flatMap((entry) => entry.standards.filter((st) => st.framework === fw && st.moduleIds.includes(moduleId)).map((st) => st.code)))]; };
    const student = findStudent(roster, educatorRecord.name);
    const shownName = student ? student.label : educatorRecord.name;
    const rep = buildReport(shownName, educatorRecord.events);
    const enabled = rep.enabledCourseIds;
    const since = reportOpenedFrom && student && student.reportSeenAt ? changesSince(educatorRecord.events, reportOpenedFrom) : null;

    // Writes one event onto this student's log and keeps the screen in step.
    // One event or several, so an edit (the old note removed, the new one written) is a single save.
    const addToStudent = async (event) => {
      const next = { ...educatorRecord, events: [...educatorRecord.events, ...(Array.isArray(event) ? event : [event])] };
      setEducatorRecord(next);
      if (record && record.name === next.name) setRecord(next);
      const outcome = await saveRecord(next);
      if (!outcome.saved) setSaveNote('That change could not be saved on this device. This happens only during incognito browsing or when browser storage is full.');
    };
    const setEnabled = (ids) => addToStudent(makeCoursesEnabledEvent(ids, new Date().toISOString()));

    // Everything switched on right now, across every grade — so nobody has to hunt.
    // Beginner to advanced, so a third grade course never sits above a kindergarten one.
    const assigned = COURSES.filter((c) => enabled.includes(c.id)).sort((a, b) => GRADES.indexOf(a.grade) - GRADES.indexOf(b.grade) || a.subject.localeCompare(b.subject));
    const recommended = recommendedIds;
    const toggleSubjectPanel = (id) => setOpenSubjects((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]));

    return (
      <div style={page}><PageChrome idleWarning={idleWarning} logoutIn={logoutIn} walkthrough={!!(record && record.preview)} /><div className="edu-wrap" style={wrap}>
        <button type="button" onClick={() => setScreen('educator-pick')} style={linkBtn}>Back to Classroom</button>
        <h1 style={{ fontSize: 26, margin: '10px 0 2px', textAlign: 'center' }}>{keepTogether(shownName)}</h1>
        {since && (since.attempts || since.mastered.length || since.stories || since.colored) ? (
          <p style={{ margin: '0 0 14px', fontSize: 14, color: C.muted, textAlign: 'center' }}>
            Since you last looked: {sinceLine(since)}.<br />({niceDateShort(reportOpenedFrom)})
          </p>
        ) : since ? <p style={{ margin: '0 0 14px', fontSize: 14, color: C.muted, textAlign: 'center' }}>Nothing new since you last looked.<br />({niceDateShort(reportOpenedFrom)})</p> : null}
        <div className="edu-no-print" style={{ textAlign: 'center', margin: '0 0 12px' }}><Btn kind="secondary" onClick={() => { if (typeof window !== 'undefined' && window.print) window.print(); }}>Print this report</Btn></div>

        {/* Teacher notes: written here, kept on the student's log, so they ride along in every backup. */}
        <div style={{ ...card, marginBottom: 14 }}>
          <HeadWithInfo onClick={() => setShowNoteWhy(!showNoteWhy)} label="About notes" open={showNoteWhy}>Notes</HeadWithInfo>
          {showNoteWhy && <p style={{ margin: '0 0 12px', fontSize: 13, color: C.muted, textAlign: 'center' }}>A note here stays with the student and can be restored through backups. Quickly search student notes through the Who Needs Help page.</p>}
          {/* Each note sits on its own soft green card, centered, with Edit and Remove under it. An edit is
              the old note removed and the new one written, so the log still says everything that happened. */}
          {rep.notes.map((n) => (
            <div key={n.id} style={{ margin: '0 0 8px', padding: '10px 12px', borderRadius: 10, background: 'linear-gradient(135deg, #EAF2EC 0%, #F5F9F5 100%)', border: '1px solid #DCE8DF', textAlign: 'center' }}>
              {editingNote && editingNote.id === n.id ? (
                <div className="edu-no-print">
                  <textarea value={editingNote.text} onChange={(e) => setEditingNote({ id: n.id, text: e.target.value })} aria-label="Edit note" rows={3}
                    style={{ width: '100%', boxSizing: 'border-box', fontFamily: FONT, fontSize: 15, padding: 10, borderRadius: 10, border: `1px solid ${C.line}`, resize: 'vertical' }} />
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 8 }}>
                    <Btn kind="secondary" disabled={!editingNote.text.trim()} onClick={async () => { const at = new Date().toISOString(); await addToStudent([makeNoteRemovedEvent(n.id, at), makeNoteEvent(editingNote.text, at)]); setEditingNote(null); }}>Save</Btn>
                    <Btn kind="secondary" onClick={() => setEditingNote(null)}>Cancel</Btn>
                  </div>
                </div>
              ) : (
                <>
                  <p style={{ margin: 0, fontSize: 15, whiteSpace: 'pre-wrap' }}>{n.text}</p>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: C.muted }}>{fmtDate(n.at)}
                    <button type="button" className="edu-no-print" style={{ ...linkBtn, fontSize: 13, marginLeft: 8 }} onClick={() => setEditingNote({ id: n.id, text: n.text })}>Edit</button>
                    <button type="button" className="edu-no-print" style={{ ...linkBtn, fontSize: 13, marginLeft: 8 }} onClick={() => addToStudent(makeNoteRemovedEvent(n.id, new Date().toISOString()))}>Remove</button>
                  </p>
                </>
              )}
            </div>
          ))}
          <div className="edu-note-box edu-no-print" style={{ position: 'relative' }}>
            <textarea value={noteInput} onChange={(e) => { setNoteInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = `${Math.max(44, e.target.scrollHeight)}px`; }} onFocus={() => setNoteFocus(true)} onBlur={() => setNoteFocus(false)} aria-label="Teacher note" placeholder="Write a note about this student" rows={1}
              style={{ width: '100%', minHeight: 44, height: 44, boxSizing: 'border-box', fontFamily: FONT, fontSize: 15, lineHeight: '22px', padding: '10px 14px', borderRadius: 10, border: `1px solid ${C.line}`, resize: 'none', display: 'block', textAlign: 'center', overflow: 'hidden' }} className="edu-note-quiet" />
            {/* The example sits in the middle of the box, lightly, until there is a note or a cursor. */}
            <div className="edu-note-save"><Btn kind="secondary" disabled={!noteInput.trim()} onClick={async () => { await addToStudent(makeNoteEvent(noteInput, new Date().toISOString())); setNoteInput(''); const box = document.querySelector('textarea[aria-label="Teacher note"]'); if (box) box.style.height = '44px'; }}>Save note</Btn></div>
          </div>

        </div>
        {/* The summary a parent or principal can read without decoding anything: a list, then sentences */}
        {(() => {
          const parts = summaryParts(rep);
          return (
            <div style={{ ...card, padding: 0, overflow: 'hidden' }} data-tour="summary">
              <button type="button" className="edu-fold-head" onClick={() => setOpenSummary(!openSummary)} aria-expanded={openSummary}
                style={{ fontFamily: FONT, width: '100%', textAlign: 'left', background: 'transparent', border: 'none', padding: 16, cursor: 'pointer', color: C.ink, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="edu-fold-title" style={{ fontSize: 17, fontWeight: 600 }}>Summary</span><span className="edu-fold-meta" style={{ color: C.muted }}>{openSummary ? '▴' : '▾'}</span>
              </button>
              {openSummary && (
                <div style={{ padding: '0 16px 16px' }}>
                  <p style={{ margin: '0 0 6px', fontSize: 16, lineHeight: 1.6, textAlign: 'center' }}>{parts.lead}</p>
                  {parts.items.length > 0 && <ul style={{ margin: '0 0 10px', padding: '10px 12px 10px 32px', listStyleType: 'disc', fontSize: 15, lineHeight: 1.7, borderRadius: 10, background: 'linear-gradient(135deg, #EAF2EC 0%, #F5F9F5 100%)', border: '1px solid #DCE8DF' }}>{parts.items.map((it) => <li key={it} style={{ display: 'list-item' }}>{it}</li>)}</ul>}
                  {parts.rest && <div style={{ margin: 0, fontSize: 16, lineHeight: 1.6, textAlign: 'center' }}>{parts.rest.split(/(?<=\.)\s+/).filter(Boolean).map((line) => <p key={line} style={{ margin: '2px 0' }}>{line}</p>)}</div>}
                  {rep.coloringBreaks > 0 && <p style={{ margin: '6px 0 0', fontSize: 15, color: C.muted, textAlign: 'center' }}>Coloring breaks taken: {rep.coloringBreaks}. Coloring is play; it is never marked and never appears on the transcript.</p>}
                  {parts.tried && parts.tried.length > 0 && (
                    <div style={{ margin: '8px 0 0' }}>
                      <p style={{ margin: '0 0 4px', fontSize: 16, lineHeight: 1.6, textAlign: 'center', fontWeight: 600 }}>Tried but not passed yet:</p>
                      <ul style={{ margin: 0, padding: '10px 12px 10px 32px', listStyleType: 'disc', fontSize: 15, lineHeight: 1.7, borderRadius: 10, background: 'linear-gradient(135deg, #EAF2EC 0%, #F5F9F5 100%)', border: '1px solid #DCE8DF' }}>
                        {parts.tried.map((t) => <li key={t.id}><button type="button" style={{ ...linkBtn, fontSize: 15, fontWeight: 600 }} onClick={() => setStoryModule(t.id)}>{t.title}</button> ({t.subject ? `${t.subject}: ` : ''}{t.detail})</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })()}

        {pendingWritings(educatorRecord.events).length > 0 && (
          <div style={{ ...card, background: C.goldSoft, borderColor: C.gold }}>
            <p className="edu-card-title" style={{ margin: '0 0 4px', fontWeight: 600 }}>Writing assignment that needs your check ({pendingWritings(educatorRecord.events).length})</p>
            <p style={{ margin: '0 0 12px', fontSize: 14, color: C.muted, textAlign: 'center', lineHeight: 1.5 }}>{shownName} wrote this assignment on paper and marked it as finished. The requirements are outlined below and it's up to you to select "Pass" or "Not Yet". By selecting "Pass" you are unlocking the next writing module. "Not Yet" requires a retry. Students never receive numerical scores from us.</p>
            {pendingWritings(educatorRecord.events).map((w) => (
              <div key={w.at} style={{ borderTop: `1px solid ${C.line}`, padding: '10px 0' }}>
                <p style={{ margin: '0 0 4px', fontWeight: 600, textAlign: 'center' }}>{titleCase((getModule(w.moduleId) || { title: w.moduleId }).title)} · finished {fmtDate(w.at)}</p>
                <p style={{ margin: '0 0 6px', fontSize: 14, color: C.muted }}>{w.prompt}</p>
                <ul style={{ margin: '0 0 8px', padding: '0 0 0 4px', listStyle: 'none', fontSize: 13, color: C.muted }}>{(w.checklist || []).map((c) => <li key={c.item} style={{ padding: '2px 0' }}>{c.ticked ? '✓' : '✗'} {c.item}</li>)}</ul>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <Btn full onClick={async () => { const at = new Date().toISOString(); const next = { ...educatorRecord, events: [...educatorRecord.events, makeWritingMark(w.moduleId, w.at, true, '', at)] }; await saveRecord(next); setEducatorRecord(next); }} disabled={busy}>Pass</Btn>
                  <Btn full kind="secondary" onClick={async () => { const at = new Date().toISOString(); const next = { ...educatorRecord, events: [...educatorRecord.events, makeWritingMark(w.moduleId, w.at, false, '', at)] }; await saveRecord(next); setEducatorRecord(next); }} disabled={busy}>Not Yet</Btn>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Choose what this student works on. Recommended first, everything else tucked away. */}
        <div style={{ ...card, background: C.greenSoft, borderColor: C.greenSoft }}>
          <p className="edu-card-title" style={{ margin: '0 0 4px', fontWeight: 600 }}>Assigned Now</p>
          <p style={{ margin: '0 0 10px', fontSize: 14, color: C.muted, textAlign: 'center' }}>Assign courses by checking or unchecking the boxes below. Each student starts with the courses we recommend (based on a combination of {shownName}'s initial placement check, quick-check module skips and/or his or her actual progression through the modules) but you are free to edit how you see fit.</p>
          <input value={courseQuery} onChange={(e) => setCourseQuery(e.target.value)} placeholder="Search courses, for example: grade 1 math, kinder, fractions" aria-label="Search courses"
            style={{ fontFamily: FONT, fontSize: 15, padding: '10px 12px', width: '100%', boxSizing: 'border-box', border: `2px solid ${C.line}`, borderRadius: 10, marginBottom: 10, background: C.surface, textAlign: 'center' }} />
          {!courseQuery.trim() && (
            <p style={{ margin: '0 0 10px', fontSize: 13, textAlign: 'center' }}>
              <button type="button" onClick={() => { const student = findStudent(roster, educatorRecord.name); const starter = recommendedCourseIds([makeCoursesEnabledEvent([], new Date().toISOString())], student ? student.level : null); const keep = COURSES.filter((c) => c.modules.some((m) => rep.modules.find((x) => x.id === m.id && x.attempts > 0))).map((c) => c.id); const unlocked = coursesToUnlock([...educatorRecord.events, makeCoursesEnabledEvent([...new Set([...starter, ...keep])], new Date().toISOString())]); const next = [...new Set([...starter, ...keep, ...unlocked])]; setEnabled(next); setRecommendedIds(next); setShowAllCourses(false); }} style={{ ...linkBtn, fontSize: 13, padding: 0 }}>Back to recommended courses</button>
              <InfoButton onClick={() => setShowRecommendTip(!showRecommendTip)} label="About recommended courses" open={showRecommendTip} />
            </p>
          )}
          {!courseQuery.trim() && showRecommendTip && (
            <TipText>Sets this student back to the courses we recommend for their level. Any course they have already started stays assigned, so no progress is hidden.</TipText>
          )}
          {courseQuery.trim() && (
            <div>
              {COURSES.filter((c) => matchesCourseSearch(c, courseQuery)).sort(byGradeOrder).map((c) => (
                <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', fontSize: 16 }}>
                  <input type="checkbox" checked={enabled.includes(c.id)} onChange={() => setEnabled(enabled.includes(c.id) ? enabled.filter((id) => id !== c.id) : [...enabled, c.id])} />
                  <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}><span>{courseLabel(c)}</span>{courseNeedsTouch(c.id) && <Tag tone="review">Needs a touch screen</Tag>}</span>
                </label>
              ))}
              {COURSES.filter((c) => matchesCourseSearch(c, courseQuery)).length === 0 && <p style={{ margin: '0 0 8px', fontSize: 15, color: C.muted }}>No course matches that. Try a grade, a subject, or a word from a course title.</p>}
            </div>
          )}
          {!courseQuery.trim() && COURSES.filter((c) => recommended.includes(c.id)).length === 0 && (
            <p style={{ margin: '0 0 8px', fontSize: 15, color: C.muted }}>Nothing is written yet for this student's level. Anything below can still be assigned.</p>
          )}
          {!courseQuery.trim() && COURSES.filter((c) => recommended.includes(c.id)).sort(byGradeOrder).map((c) => (
            <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', fontSize: 16 }}>
              <input type="checkbox" checked={enabled.includes(c.id)} onChange={() => setEnabled(enabled.includes(c.id) ? enabled.filter((id) => id !== c.id) : [...enabled, c.id])} />
              <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}><span>{courseLabel(c)}</span>{courseNeedsTouch(c.id) && <Tag tone="review">Needs a touch screen</Tag>}</span>
            </label>
          ))}
          {!courseQuery.trim() && <div className="edu-no-print" style={{ textAlign: 'center', marginTop: 6 }}><button type="button" style={linkBtn} onClick={() => setShowAllCourses(!showAllCourses)}>
            {showAllCourses ? 'Hide other courses' : `Show other courses (${COURSES.length - recommended.length})`}
          </button></div>}
          {!courseQuery.trim() && showAllCourses && (
            <div className="edu-no-print" style={{ borderTop: `1px solid ${C.line}`, marginTop: 8, paddingTop: 8 }}>
              <p style={{ margin: '0 0 10px', fontSize: 14, color: C.muted, textAlign: 'center' }}>Wish to stray from our recommendations? Select anything below for {shownName} to complete. <InfoButton onClick={() => setShowRecTip(!showRecTip)} label="About kindergarten and pre-K" open={showRecTip} /></p>
              {showRecTip && <TipText>Kindergarten (and above) courses will not show for a student who has any pre-k courses activated. They must either complete the pre-k courses first or you must uncheck them.</TipText>}
              {/* Core courses or electives, then one closed dropdown per grade, so a long catalog stays quick to navigate. */}
              <SegToggle options={[['core', 'Core'], ['electives', 'Electives']]} value={otherKind} onChange={setOtherKind} ariaLabel="Core courses or electives" />
              {(() => {
                const others = COURSES.filter((c) => !recommended.includes(c.id) && (otherKind === 'electives' ? !!c.elective : !c.elective)).sort(byGradeOrder);
                const grades = GRADES.filter((g) => others.some((c) => c.grade === g));
                if (!grades.length) return <p style={{ margin: '0 0 8px', fontSize: 15, color: C.muted, textAlign: 'center' }}>{otherKind === 'electives' ? 'No electives outside the recommended set.' : 'No other core courses outside the recommended set.'}</p>;
                return grades.map((g) => { const key = `${otherKind}-${g}`; const open = openOtherGrades.includes(key); const list = others.filter((c) => c.grade === g);
                  return (
                    <div key={key} style={{ border: `1px solid ${C.line}`, borderRadius: 10, marginBottom: 8, overflow: 'hidden', background: C.surface }}>
                      <button type="button" aria-expanded={open} onClick={() => setOpenOtherGrades((l) => (l.includes(key) ? l.filter((x) => x !== key) : [...l, key]))}
                        style={{ fontFamily: FONT, width: '100%', textAlign: 'left', background: C.greenSoft, border: 'none', padding: '12px 14px', cursor: 'pointer', color: C.ink, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 16, fontWeight: 600 }}>{gradeLabel(g)}</span>
                        <span style={{ fontSize: 14, color: C.muted }}>{list.filter((c) => enabled.includes(c.id)).length ? `${list.filter((c) => enabled.includes(c.id)).length} of ${list.length} selected ` : `${list.length} ${list.length === 1 ? 'course ' : 'courses '}`}{open ? '▴' : '▾'}</span>
                      </button>
                      {open && <div style={{ padding: '4px 14px 8px' }}>
                        {list.map((c) => (
                          <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', fontSize: 16 }}>
                            <input type="checkbox" checked={enabled.includes(c.id)} onChange={() => setEnabled(enabled.includes(c.id) ? enabled.filter((id) => id !== c.id) : [...enabled, c.id])} />
                            <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}><span>{courseLabel(c)}</span>{courseNeedsTouch(c.id) && <Tag tone="review">Needs a touch screen</Tag>}</span>
                          </label>
                        ))}
                      </div>}
                    </div>
                  ); });
              })()}
            </div>
          )}
          <p style={{ margin: '10px 0 0', fontSize: 13, color: C.muted, textAlign: 'center' }}>Switching a course off hides it from the student. Their progress is kept.</p>
        </div>

        {/* Progress by course, all of it behind one dropdown so the transcript is not pushed out of sight. */}
        <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
          <div className="edu-fold-head" style={{ display: 'flex', alignItems: 'center', padding: '14px 16px' }}>
            <span className="edu-fold-title" style={{ fontSize: 17, fontWeight: 600, display: 'inline-flex', alignItems: 'center' }}>Progress by course<InfoButton onClick={() => setShowProgressTip(!showProgressTip)} label="About progress by course" open={showProgressTip} /></span>
            <button type="button" className="edu-fold-meta" onClick={() => setOpenProgress(!openProgress)} aria-expanded={openProgress} aria-label="Progress by course"
              style={{ fontFamily: FONT, textAlign: 'right', background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: C.muted, fontSize: 16 }}>{openProgress ? '▴' : '▾'}</button>
          </div>
          {showProgressTip && <div style={{ padding: '0 16px' }}><TipText>Once you assign a course above, you can view or reset the student's progression within said course. See how they're doing or allow them to start fresh.</TipText></div>}
        </div>
        {(openProgress || printing) && assigned.map((course) => {
          const open = openSubjects.includes(course.id);
          const rows = rep.modules.filter((m) => m.courseId === course.id);
          const done = rows.filter((m) => m.mastered).length;
          return (
            <div key={course.id} style={{ ...card, padding: 0, overflow: 'hidden' }}>
              <button type="button" onClick={() => toggleSubjectPanel(course.id)} aria-expanded={open}
                style={{ fontFamily: FONT, width: '100%', textAlign: 'left', background: 'transparent', border: 'none', padding: 16, cursor: 'pointer', color: C.ink }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                  <span>
                    <span style={{ display: 'block', fontSize: 17, fontWeight: 600 }}>{course.title}</span>
                    <span style={{ display: 'block', fontSize: 13, fontWeight: 400, color: C.muted, marginTop: 2 }}>{gradeShort(course.grade)} - {course.subject}</span>
                  </span>
                  <span style={{ fontSize: 14, color: C.muted, whiteSpace: 'nowrap' }}>{done} of {rows.length} {open ? '▴' : '▾'}</span>
                </div>
              </button>
              <div className="edu-collapsible" style={{ padding: '0 16px 14px', display: open || printing ? 'block' : 'none' }}>
                  {rows.map((m) => {
                    const state = m.mastered ? 'Mastered' : m.passed && m.firstPassedAt ? 'Passed once' : m.placed ? (m.quickCheck && m.quickCheck.passed ? 'Skipped by quick check' : 'Placed past') : m.pendingWriting ? 'Needs the educator\'s check' : m.attempts ? 'In progress' : 'Not started';
                    return (
                      <div key={m.id} style={{ borderTop: `1px solid ${C.line}`, paddingTop: 10, marginTop: 10 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 16, fontWeight: 600 }}>{m.title}</span>
                          <Tag tone={m.mastered ? 'mastered' : m.attempts ? 'review' : 'locked'}>{state}</Tag>
                        </div>
                        {m.mastered && codesForModule(m.id).length > 0 && <p style={{ margin: '4px 0 0', fontSize: 12, color: C.muted }}>Satisfies {codesForModule(m.id).join(', ')}</p>}
                        {!m.mastered && !m.passed && !m.attempts && moduleStatuses(deriveProgress(educatorRecord.events), enabled).find((x) => x.id === m.id) && moduleStatuses(deriveProgress(educatorRecord.events), enabled).find((x) => x.id === m.id).status === 'locked' && (
                          <p style={{ margin: '6px 0 0', fontSize: 13 }}>Locked by its prerequisites. <button type="button" onClick={async () => { const next = { ...educatorRecord, events: [...educatorRecord.events, makeUnlockEvent(m.id, new Date().toISOString())] }; await saveRecord(next); setEducatorRecord(next); }} style={{ ...linkBtn, fontSize: 13, padding: 0 }}>Unlock it anyway</button></p>
                        )}
                        {/* The story of this module opens over the page, so a long report never sprawls. */}
                        <button type="button" className="edu-no-print" style={linkBtn} onClick={() => setStoryModule(m.id)}>View progress for this module</button>
                        <p className="edu-print-only" style={{ margin: '6px 0 0', fontSize: 13, lineHeight: 1.6 }}>{moduleStory(shownName, educatorRecord.events, m.id)}</p>
                        {m.attempts > 0 && (confirmModuleReset === m.id ? (
                          <div style={{ background: C.claySoft, borderRadius: 10, padding: 12, marginTop: 8 }}>
                            <p style={{ margin: '0 0 10px', fontSize: 15 }}>Are you sure you want to erase all current progress for this module? Historical performance is still recorded.</p>
                            <div style={{ display: 'flex', gap: 10 }}>
                              <Btn onClick={async () => { await addToStudent(makeModuleResetEvent(m.id, new Date().toISOString())); setConfirmModuleReset(null); }} disabled={busy}>Yes, erase it</Btn>
                              <Btn kind="secondary" onClick={() => setConfirmModuleReset(null)}>Cancel</Btn>
                            </div>
                          </div>
                        ) : (
                          <div><button type="button" style={linkBtn} onClick={() => setConfirmModuleReset(m.id)}>Reset progress for this module</button></div>
                        ))}
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}

        {storyModule && (
          <div className="edu-no-print" style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, background: 'rgba(36, 41, 31, 0.55)', zIndex: 100, overflowY: 'auto', padding: '24px 12px' }}>
            <div className="edu-rise" style={{ maxWidth: 560, margin: '0 auto', background: C.surface, borderRadius: 14, padding: 18, position: 'relative' }}>
              <button type="button" onClick={() => setStoryModule(null)} aria-label="Close"
                style={{ position: 'absolute', top: 8, right: 10, background: 'none', border: 'none', width: 36, height: 36, fontSize: 30, lineHeight: '34px', cursor: 'pointer', color: C.ink, fontFamily: FONT, padding: 0 }}>×</button>
              <p style={{ margin: '0 0 2px', fontSize: 18, fontWeight: 600, paddingRight: 40 }}>{getModule(storyModule).title}</p>
              <p style={{ margin: '0 0 14px', fontSize: 13, color: C.muted }}>{courseLabel(getCourse(getModule(storyModule).courseId))}</p>
              <p style={{ margin: 0, fontSize: 16, lineHeight: 1.7 }}>{moduleStory(shownName, educatorRecord.events, storyModule)}</p>
              {(() => {
                const row = rep.modules.find((x) => x.id === storyModule);
                if (!row || row.attempts === 0) return null;
                return (
                  <p style={{ margin: '14px 0 0', fontSize: 13, color: C.muted }}>
                    Answered correctly overall: {row.accuracyPercent}%. Best round: {row.bestScore}.{row.confidence.medianSec !== null ? ` Typical answering time: ${row.confidence.medianSec} seconds.` : ''}
                  </p>
                );
              })()}
            </div>
          </div>
        )}

        {/* Everything the student has ever worked on, including courses since switched off. */}
        <div className="edu-no-print" style={{ ...card, background: C.goldSoft, borderColor: C.goldSoft }} data-tour="transcript">
          <p className="edu-card-title" style={{ margin: '0 0 6px', fontWeight: 600 }}>Transcript</p>
          <p style={{ margin: '0 0 10px', fontSize: 15, textAlign: 'center' }}>A printable record of everything {shownName} has ever worked on, including courses that are no longer assigned. This is the clearest view of student progression.</p>
          <div style={{ textAlign: 'center' }}><Btn kind="secondary" onClick={() => setScreen('transcript')} style={{ width: 'min(300px, 100%)' }}>Open transcript</Btn></div>
        </div>
        {(() => {
          const generated = weeklyNote(shownName, educatorRecord.events, new Date().toISOString()); const shown = weeklyEdit === null ? generated : weeklyEdit;
          return (
            <div className="edu-weekly-note" style={card}>
              <div className="edu-no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <p className="edu-card-title" style={{ margin: '0 0 6px', fontWeight: 600 }}>Weekly note</p>
                <span>
                  {weeklyEditing
                    ? <button type="button" onClick={() => setWeeklyEditing(false)} style={{ ...linkBtn, fontSize: 13, color: C.muted }}>Save</button>
                    : <>
                      <button type="button" onClick={() => { if (weeklyEdit === null) setWeeklyEdit(generated); setWeeklyEditing(true); }} style={{ ...linkBtn, fontSize: 13, color: C.muted, marginRight: 12 }}>Edit</button>
                      <button type="button" onClick={() => { document.body.classList.add('edu-note-mode'); window.print(); setTimeout(() => document.body.classList.remove('edu-note-mode'), 500); }} style={{ ...linkBtn, fontSize: 13, color: C.muted }}>Print</button>
                    </>}
                </span>
              </div>
              <p className="edu-print-only" style={{ margin: '0 0 6px', fontWeight: 600 }}>Weekly note</p>
              {!weeklyEditing
                ? <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, whiteSpace: 'pre-wrap', textAlign: 'center' }}>{shown}</p>
                : <textarea value={weeklyEdit} onChange={(e) => setWeeklyEdit(e.target.value)} aria-label="Weekly note" rows={5} style={{ width: '100%', boxSizing: 'border-box', fontFamily: FONT, fontSize: 15, padding: 10, borderRadius: 10, border: `1px solid ${C.line}`, resize: 'vertical', display: 'block' }} />}
              {weeklyEditing && <p className="edu-print-only" style={{ margin: 0, fontSize: 15, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{weeklyEdit}</p>}
              <p style={{ margin: '8px 0 0', fontSize: 12, color: C.muted, textAlign: 'center' }}>EDUSphere: The Smart Way to Learn. {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
          );
        })()}
        {storiesRead(educatorRecord.events).length > 0 && (() => {
          const read = storiesRead(educatorRecord.events).map((r) => ({ ...r, story: storyFor(r.moduleId), mod: getModule(r.moduleId) })).filter((r) => r.story && r.mod);
          const cast = [...new Set(read.flatMap((r) => r.story.cast || []))];
          return (
            <div style={card}>
              <p className="edu-card-title" style={{ margin: '0 0 6px', fontWeight: 600 }}>Stories</p>
              <p style={{ margin: '0 0 10px', fontSize: 13, color: C.muted }}>{read.length === 1 ? 'One story opened' : `${read.length} stories opened`}{cast.length ? `, and met ${cast.join(', ')}` : ''}.</p>
              {read.map((r) => <p key={r.moduleId} style={{ margin: '4px 0', fontSize: 14 }}>{r.story.title} <span style={{ color: C.muted }}>({r.mod.title}, {niceDateShort(r.at)})</span></p>)}
            </div>
          );
        })()}

        {/* Plain-language explanations, written for someone who does not work in tech */}
        <div style={{ ...card, background: 'linear-gradient(135deg, #BFD6C7 0%, #D3E4D9 100%)', borderColor: '#A9C6B4' }}>
          <p className="edu-card-title" style={{ margin: '0 0 8px', fontWeight: 600 }}>Key Words - Explained</p>
          {EXPLANATIONS.map((x, i) => {
            const open = openTerms.includes(x.term);
            return (
              <div key={x.term} style={{ borderTop: i === 0 ? 'none' : '1px solid rgba(58, 107, 88, 0.18)' }}>
                <button type="button" onClick={() => setOpenTerms((list) => (list.includes(x.term) ? list.filter((t) => t !== x.term) : [...list, x.term]))} aria-expanded={open}
                  style={{ fontFamily: FONT, width: '100%', textAlign: 'left', background: 'transparent', border: 'none', padding: '6px 0', cursor: 'pointer', color: C.ink, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: 15 }}>{x.term}</span><span style={{ color: C.muted }}>{open ? '▴' : '▾'}</span>
                </button>
                {open && <p style={{ margin: '0 0 6px', fontSize: 15 }}>{x.plain}</p>}
              </div>
            );
          })}
          
        </div>

        <p style={{ fontSize: 14, color: C.muted, textAlign: 'center', margin: '0 0 14px' }}>
          {stateCode && frameworkForState(stateCode) !== 'CCSS' ? `We measure against ${stateFor(stateCode).name}'s standards (${FRAMEWORKS[frameworkForState(stateCode)].name}).` : `We measure against ${FRAMEWORKS.CCSS.name}.`}<br />
          {educator && <><button type="button" onClick={() => { rememberHere(); setStateDraft(stateCode || ''); setScreen('change-state'); }} style={{ ...linkBtn, fontSize: 14, padding: 0 }}>Change state</button>{' · '}</>}
          <button type="button" onClick={() => setScreen('standards-map')} style={{ ...linkBtn, fontSize: 14, padding: 0 }}>Standards map</button>
        </p>
        <details className="edu-no-print" style={{ marginBottom: 14 }}>
          <summary className="edu-card-title" style={{ cursor: 'pointer', color: C.green, fontWeight: 600 }}>Raw data</summary>
          <p style={{ fontSize: 14, color: C.muted, margin: '8px 0' }}>Every line below records one thing that happened, in the order it happened. Lines are only ever added. Because nothing is changed or removed, any report from any date can be reproduced exactly as it was.</p>
          <textarea readOnly value={JSON.stringify(activeEvents(educatorRecord.events), null, 2)} style={{ width: '100%', boxSizing: 'border-box', height: 220, fontSize: 12, borderRadius: 10, border: `1px solid ${C.line}`, padding: 10 }} />
        </details>

        <div className="edu-no-print">
        {completedGrades(educatorRecord.events).length > 0 && (
          <div className="edu-no-print" style={{ ...card, textAlign: 'center' }}>
            <p className="edu-card-title" style={{ margin: '0 0 8px', fontWeight: 600 }}>Certificates</p>
            {completedGrades(educatorRecord.events).map((g) => (
              <div key={g} style={{ margin: '6px 0' }}>
                <button type="button" style={{ ...cardLink, marginRight: 0 }} onClick={() => { setCertFor({ id: educatorRecord.name, grade: g }); setCertTemplate('classic'); setCertName(''); setCertPhotos([]); setCertNote(''); setScreen('certificate'); }}>{certGradeName(g)}: {((findStudent(roster, educatorRecord.name) || {}).certificates || {})[g] === 'made' ? 'make another certificate' : 'make a certificate'}</button>
              </div>
            ))}
          </div>
        )}
        {confirmReset ? (
          <div style={{ ...card, borderColor: C.clay }}>
            <p style={{ margin: '0 0 10px' }}>Start {shownName} over in every subject? The record is kept, but nothing will count as mastered.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <Btn onClick={async () => { await addToStudent(makeResetEvent(new Date().toISOString())); setConfirmReset(false); }} disabled={busy}>Yes, reset all progress</Btn>
              <Btn kind="secondary" onClick={() => setConfirmReset(false)}>Cancel</Btn>
            </div>
          </div>
        ) : (
          <div className="edu-no-print" style={{ textAlign: 'center', marginTop: 56 }}><Btn kind="secondary" onClick={() => setConfirmReset(true)} style={{ width: 'min(300px, 100%)' }}>Reset {shownName}'s Progress</Btn></div>
        )}
        </div>
        {saveNote && <p style={{ color: C.muted, fontSize: 13, textAlign: 'center', marginTop: 32 }}>{saveNote}</p>}
        <p style={{ color: C.muted, margin: '32px 0 0', fontSize: 13, textAlign: 'center' }}>Report generated {fmtDate(rep.generatedAt)}</p>
        {tourPopup}
      </div></div>
    );
  }

  return <div style={page}><PageChrome idleWarning={idleWarning} logoutIn={logoutIn} walkthrough={!!(record && record.preview)} /><div className="edu-wrap" style={wrap}><p>Something went wrong. <Btn kind="secondary" onClick={() => setScreen('overview')}>Back to overview</Btn></p></div></div>;
}
