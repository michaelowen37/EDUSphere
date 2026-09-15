
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
    <div className="edu-no-print" style={{ position: 'fixed', inset: 0, background: 'rgba(36, 41, 31, 0.55)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
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
function Btn({ children, onClick, kind = 'primary', disabled = false, full = false, halo = false, style: extra = null }) {
  const base = {
    fontFamily: FONT, fontSize: 16, fontWeight: 600, padding: '12px 18px', borderRadius: 10,
    cursor: disabled ? 'default' : 'pointer', border: `2px solid ${C.green}`, minHeight: 46,
    width: full ? '100%' : 'auto', opacity: disabled ? 0.5 : 1,
  };
  const looks = kind === 'primary'
    ? { background: C.green, color: '#fff' }
    : { background: C.surface, color: C.green };
  // An inviting button pulses itself, gently, rather than casting a ring around it.
  return <button type="button" className={halo && !disabled ? 'edu-press edu-pulse' : 'edu-press'} style={{ ...base, ...looks, ...(extra || {}) }} onClick={onClick} disabled={disabled}>{children}</button>;
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

// Draws whichever picture a lesson or question asks for.
function Picture({ visual, animate = false, animKey = 0, nudge = 0 }) {
  if (!visual) return null;
  if (visual.kind === 'dots') return <div style={{ padding: '6px 0' }}><DotGroup count={visual.count} animate={animate} animKey={animKey} /></div>;
  if (visual.kind === 'trace') return <div style={{ padding: '6px 0' }}><TraceDemo letter={visual.text} animKey={animKey} pace={visual.pace} nudge={nudge} /></div>;
  if (visual.kind === 'icon') return <div key={animKey} className={animate ? 'edu-drift' : undefined} style={{ padding: '6px 0' }}><IconPic name={visual.name} size={110} /></div>;
  if (visual.kind === 'shape') return <div key={animKey} className={animate ? 'edu-drift' : undefined} style={{ padding: '6px 0' }}><ShapePic name={visual.name} size={visual.size === 'big' ? 140 : visual.size === 'small' ? 50 : 110} /></div>;
  if (visual.kind === 'tens') return <div style={{ padding: '6px 0' }}><TensGroup count={visual.count} animate={animate} animKey={animKey} /></div>;
  if (visual.kind === 'array') return <div style={{ padding: '6px 0' }}><ArrayPic rows={visual.rows} cols={visual.cols} /></div>;
  if (visual.kind === 'numberline') return <div style={{ padding: '6px 0' }}><NumberLine parts={visual.parts} mark={visual.mark} /></div>;
  if (visual.kind === 'clock') return <div style={{ padding: '6px 0' }}><ClockPic hour={visual.hour} minute={visual.minute} /></div>;
  if (visual.kind === 'pair') return <div style={{ padding: '6px 0', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 28 }}><Item spec={`${visual.a.shape}-${visual.a.colour}`} size={96} /><Item spec={`${visual.b.shape}-${visual.b.colour}`} size={96} /></div>;
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
function speak(text) {
  if (typeof window === 'undefined' || !window.speechSynthesis || !text) return;
  try {
    window.speechSynthesis.cancel();
    const voice = pickVoice();
    for (const piece of speechPieces(text)) {
      const u = new SpeechSynthesisUtterance(piece.text);
      if (voice) u.voice = voice;
      const shape = SPEECH_SHAPES[piece.shape] || SPEECH_SHAPES.plain;
      u.rate = shape.rate * (SPEECH_NUDGE < 0 ? 0.75 : SPEECH_NUDGE > 0 ? 1.1 : 1); u.pitch = shape.pitch;
      window.speechSynthesis.speak(u);
    }
  } catch (e) { /* a broken voice must never stop a lesson */ }
}

// One button for every read-aloud spot. If the device or preview has no speech, the
// button is replaced by a short note, so nothing on screen looks broken or unresponsive.
// Every read-aloud spot has one of these. `corner` puts a small speaker button in the top
// right of the card it sits in; otherwise it is a full button. The "on silent" note is
// shown by the page, at its foot, once anything has been spoken.
let onSpoke = null;
function SpeakButton({ text, label, full = false, corner = false }) {
  if (!canSpeak()) {
    return corner ? null : <p style={{ margin: '0 0 12px', fontSize: 14, color: C.muted }}>Reading aloud is not available on this device or in this preview. The words are all on screen.</p>;
  }
  const press = () => { speak(text); if (onSpoke) onSpoke(); };
  if (corner) {
    return (
      <button type="button" onClick={press} aria-label={label} title={label} className="edu-press edu-sway"
        style={{ position: 'absolute', top: 10, right: 10, width: 54, height: 54, borderRadius: 999, border: `3px solid ${C.gold}`, background: C.goldSoft, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
          <path d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4z" fill={C.gold} />
          <path d="M15.5 8.5a5 5 0 010 7M18 6a8.5 8.5 0 010 12" fill="none" stroke={C.gold} strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    );
  }
  return (
    <div style={{ marginBottom: 12, textAlign: 'center' }}>
      <Btn full={full} kind="secondary" onClick={press}>{label}</Btn>
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
  @media (min-width: 600px) { .edu-name-grid-two { grid-template-columns: 1fr 1fr; } }
  /* The student card: on a phone the name, grade and links stay left and Open report sits below them, centered;
     on a laptop the name, grade and links stack on the left and Open report sits on the right, centered on them. */
  .edu-student-body { display: block; }
  /* On a phone the picture sits above the name, so every name, grade and link starts at the card's left edge,
     with or without a picture; on a laptop the picture returns beside them. */
  .edu-student-left { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
  .edu-student-actions { text-align: left; }
  .edu-student-actions button { margin-right: 10px; }
  .edu-student-open { display: flex; justify-content: center; margin-top: 12px; }
  @media (min-width: 1000px) {
    .edu-student-body { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
    .edu-student-left { flex: 1 1 auto; min-width: 0; text-align: left; flex-direction: row; align-items: center; gap: 10px; }
  }
  /* Section titles read centered on a phone and stay left on a laptop. A fold keeps its count and
     chevron pinned right while the title centers. */
  .edu-card-title { text-align: center; }
  .edu-fold-head { position: relative; justify-content: center !important; }
  .edu-fold-title { text-align: center; }
  .edu-fold-meta { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); }
  @media (min-width: 1000px) {
    .edu-card-title { text-align: left; }
    .edu-fold-head { justify-content: space-between !important; }
    .edu-fold-meta { position: static; transform: none; }
  }
  /* The note box: on a phone the field spans the card, tall enough for the example, and Save note sits centered below it. */
  .edu-note-box { margin-top: 8px; }
  .edu-note-box textarea { min-height: 96px; }
  @media (min-width: 1000px) { .edu-note-box textarea { min-height: 0; } }
  .edu-note-save { display: flex; justify-content: center; margin-top: 8px; }
  @media (min-width: 1000px) {
    .edu-note-box { display: flex; gap: 8px; align-items: flex-start; }
    .edu-note-save { margin-top: 0; flex: 0 0 auto; }
    .edu-student-open { margin-top: 0; flex: 0 0 auto; }
  }
  /* On a phone the logout countdown sits centered at the foot; on a laptop it stays bottom right. */
  @media (max-width: 999px) { .edu-logout-chip { right: auto !important; left: 50% !important; transform: translateX(-50%); } }
  @media (hover: hover) and (pointer: fine) { .edu-frame-bottom { display: block; position: fixed; left: 0; right: 0; bottom: 0; height: 6px; background: ${C.green}; pointer-events: none; z-index: 50; } }
.edu-side { display: none; }
.edu-page-stars { display: none; }
@media (min-width: 1000px) {
  .edu-page-stars { display: block; position: fixed; inset: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 0; opacity: 0.55; }
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
@keyframes edu-breathe { 0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(58, 107, 88, 0); } 50% { transform: scale(1.015); box-shadow: 0 0 0 6px rgba(58, 107, 88, 0.18); } }
.edu-breathe { animation: edu-breathe 2.2s ease-in-out infinite; border-radius: 12px; }
@keyframes edu-side-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
.edu-side path { stroke-dasharray: 1; animation: edu-side-draw 1.6s ease-out both; }
@keyframes edu-slide-in { 0% { transform: translateY(-70px) scale(0.5) rotate(-6deg); opacity: 0; } 55% { transform: translateY(10px) scale(1.12) rotate(2deg); opacity: 1; } 78% { transform: translateY(-4px) scale(0.96) rotate(0deg); } 100% { transform: translateY(0) scale(1); } }
.edu-slide-in { animation: edu-slide-in 1.1s cubic-bezier(0.2, 0.9, 0.3, 1.2) both; background: linear-gradient(90deg, #3A6B58, #D9A83B, #3A6B58); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; color: transparent !important; animation: edu-slide-in 1.1s cubic-bezier(0.2, 0.9, 0.3, 1.2) both, edu-shimmer 3s linear 1.1s infinite; }
.edu-glow { animation: edu-glow 1.8s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) {
  .edu-glow, .edu-breathe, .edu-slide-in, .edu-pulse, .edu-stress, .edu-twinkle-star, .edu-trace-draw, .edu-side path { animation: none; }
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
        style={{ position: 'absolute', inset: 0, background: `linear-gradient(100deg, transparent 35%, ${C.gold}66 50%, transparent 65%)`, backgroundSize: '220% 100%', pointerEvents: 'none' }} />
      <svg viewBox="0 0 120 40" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} preserveAspectRatio="none">
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
    <span aria-hidden="true" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
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
function SegToggle({ options, value, onChange, ariaLabel }) {
  return (
    <div role="group" aria-label={ariaLabel} className="edu-no-print" style={{ display: 'flex', justifyContent: 'center', margin: '0 0 14px' }}>
      <div style={{ display: 'flex', width: 'min(340px, 100%)', border: `2px solid ${C.green}`, borderRadius: 6, overflow: 'hidden' }}>
        {options.map(([key, label], i) => (
          <button key={key} type="button" onClick={() => onChange(key)} aria-pressed={value === key}
            style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, flex: '1 1 0', padding: '10px 0', cursor: 'pointer', border: 'none', borderLeft: i === 0 ? 'none' : `1px solid ${C.green}`, background: value === key ? C.green : C.surface, color: value === key ? '#fff' : C.green }}>{label}</button>
        ))}
      </div>
    </div>
  );
}
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
// Automatic backups: each time a student finishes a course, a backup file goes to the device's downloads
// folder without asking. Only the newest file is ever needed; older ones can be deleted.
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
  const [showRequirements, setShowRequirements] = useState(false);   // a writing assignment's requirements popup
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

  // A backup file each time a course is finished, straight to the downloads folder. Never during a walk-through.
  async function autoBackup() {
    if (!record || record.preview) return;
    try {
      const everything = await gatherEverything(roster);
      const at = new Date().toISOString();
      const text = JSON.stringify(buildBackup({ ...everything, deviceName, recovery: educator ? educator.recovery : null }, at), null, 2);
      const name = backupFileName(deviceName, (everything.students || []).length, at);
      if (plainDownload(name, text)) setAutoBackupNote(`Backup saved to downloads at ${fmtDate(at)}.`);
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
    setWasCorrect(correct); setChecked(true);
    if (correct) setCheer((n) => n + 1);
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
    if (after.some((id) => !before.has(id))) await autoBackup();
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
  useEffect(() => { if (screen === 'practice' && readAloud && questionText) speak(questionText); }, [screen, readAloud, questionText]);
  // An educator stays signed in while they are using the screen. After four quiet minutes a
  // warning appears; after five, the PIN is asked for again. Any tap or key resets the clock.
  const EDUCATOR_SCREENS = ['educator-pick', 'educator-report', 'transcript', 'life-skills', 'wonder-review', 'backup', 'class-view', 'change-state', 'standards-map'];
  const onEducatorScreen = EDUCATOR_SCREENS.includes(screen);
  const logoutIn = onEducatorScreen && lastActive ? Math.max(0, Math.ceil((EDUCATOR_IDLE_MS - (now - lastActive)) / 1000)) : null;
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
      const quiet = Date.now() - lastActive;
      setNow(Date.now());
      if (quiet >= EDUCATOR_IDLE_MS) { rememberHere(); setIdleWarning(false); setPinInput(''); setScreen('educator-pin'); }
      else if (quiet >= EDUCATOR_IDLE_MS - 10000) setIdleWarning(true);
    }, 1000);
    return () => clearInterval(tick);
  }, [onEducatorScreen, lastActive]);
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
  useEffect(() => { if (screen === 'lesson' && readAloud && currentLessonLine) speak(currentLessonLine); }, [screen, readAloud, currentLessonLine]);
  useEffect(() => { if (screen === 'wonder' && readAloud && wonder) speak(wonder.prompt); }, [screen, readAloud, wonder]);
  const spokenVoice = screen === 'wonder-voices' && readAloud && wonder ? (wonder.simple || [])[Math.min(wonderVoiceStep, ((wonder.simple || []).length || 1) - 1)] : null;
  useEffect(() => { if (spokenVoice) speak(`${spokenVoice.voice}. ${spokenVoice.says}`); }, [spokenVoice]);
  // The test hook: what screen is up, which question, and a way to open a named module without
  // hunting for its card, so a browser check can go straight to a lesson.
  useEffect(() => { if (typeof window !== 'undefined') window.__eduTest = { screen, question: q || null, isReviewQ, openModule: (id) => openModule(id) }; }, [screen, q, isReviewQ]);
  // The learner list can change during a session (a new learner just started), so refresh it whenever a picker screen opens.
  useEffect(() => { if (screen === 'welcome' || screen === 'educator-pick') loadRoster().then(setRoster); }, [screen]);
  // A young learner who was wrong tries again, so the voice must not give the answer away.
  useEffect(() => { if (screen === 'practice' && readAloud && checked && q) speak(wasCorrect ? 'Correct. ' + q.explain : 'Not that one. Have another try.'); }, [checked]);

  // ---------- Screens ----------
  if (screen === 'loading') return <div style={page}><PageChrome idleWarning={idleWarning} stars={false} /><div className="edu-wrap" style={wrap}><p style={{ color: C.muted }}>Loading…</p></div></div>;

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
              <div className={'edu-name-grid' + (activeStudents(roster).length > 1 ? ' edu-name-grid-two' : '')} style={{ display: 'grid', gridAutoRows: 84, gap: 10 }}>
                {activeStudents(roster)
                  .filter((st) => st.label.toLowerCase().includes(nameInput.trim().toLowerCase()))
                  .map((st) => (
                    <button key={st.id} type="button" onClick={() => startWithName(st.id)} disabled={busy} className="edu-press edu-name"
                      style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, borderRadius: 10, background: C.surface, border: `2px solid ${C.line}`, color: C.ink, cursor: 'pointer', height: 84, padding: '0 18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, overflow: 'hidden', position: 'relative' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, maxWidth: '100%' }}>
                        {st.picture && <span style={{ display: 'inline-flex', flexShrink: 0 }}><StudentPicture name={st.picture} tint={st.tint} size={40} /></span>}
                        <span style={{ overflow: 'hidden', textAlign: 'center', lineHeight: 1.2, maxHeight: '3.6em', flex: '1 1 auto', minWidth: 0, overflowWrap: 'anywhere' }}>{keepTogether(st.label)}</span>
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
        {showContact && <ContactPopup onClose={() => setShowContact(false)} />}
      </div></div>
    );
  }

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
  if (screen === 'overview') {
    const mastered = visibleModules.filter((m) => progress.masteredIds.includes(m.id)).length;
    return (
      <div style={page}><PageChrome idleWarning={idleWarning} logoutIn={logoutIn} walkthrough={!!(record && record.preview)} /><div className="edu-wrap" style={wrap}>
        <div style={{ position: 'relative', paddingTop: 6 }}>
          <h1 style={{ fontSize: 26, margin: '18px 0 8px', textAlign: 'center' }}>Your courses</h1>
          <button type="button" onClick={() => { if (record && record.preview) { setRecord(null); setScreen('educator-pick'); } else setScreen('welcome'); }} style={{ position: 'absolute', top: 0, right: 0, background: 'none', border: 'none', color: C.green, fontFamily: FONT, fontSize: 15, cursor: 'pointer' }}>Exit</button>
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
        {shownSubjects.filter((sub) => !placementPending.includes(sub)).map((sub) => {
          const isOpen = openSubject === sub;
          const subCourses = shownCourses.filter((c) => c.subject === sub).sort(byGradeOrder);
          const subModules = subCourses.flatMap((c) => c.modules);
          const done = subModules.filter((m) => progress.masteredIds.includes(m.id)).length;
          return (
            <div key={sub} style={{ ...card, padding: 0, overflow: 'visible', position: 'relative', borderColor: isOpen ? C.green : C.line }}>
              {/* A closed subject with something ready inside breathes gently, so a young child knows where to tap. */}
              <button type="button" onClick={() => setOpenSubject(isOpen ? null : sub)} aria-expanded={isOpen}
                className={youngLearner && !isOpen && openSubject === null && subModules.some((m) => statusOf(m.id) === 'available') ? 'edu-breathe' : undefined}
                style={{ fontFamily: FONT, width: '100%', textAlign: 'left', background: 'transparent', border: 'none', padding: 16, cursor: 'pointer', color: C.ink }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 21, fontWeight: 600 }}>{sub}</span>
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
                        // Young learners see only what they can do now; locked work would only clutter the screen.
                        if (youngLearner && locked) return null;
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
          <Picture visual={step.show} animate animKey={`${lessonStep}-${replays}-${paceNudge}`} nudge={paceNudge} />
          {step.show && step.show.kind === 'trace' && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, margin: '2px 0 8px' }}>
              {[['Slower', -1], ['Faster', 1]].map(([label, dir]) => { const base = step.show.pace === 'quick' ? 2 : 1; const at = base + paceNudge; const off = (dir < 0 && at <= 0) || (dir > 0 && at >= 2);
                return <button key={label} type="button" disabled={off} onClick={() => { const next = Math.max(-base, Math.min(2 - base, paceNudge + dir)); setPaceNudge(next); setSpeechNudge(next); speak(line); }} aria-label={`${label} drawing and voice`}
                  style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, padding: '6px 12px', borderRadius: 999, border: `2px solid ${off ? C.line : C.green}`, background: C.surface, color: off ? C.muted : C.green, cursor: off ? 'default' : 'pointer' }}>{label}</button>; })}
            </div>
          )}
          <p style={{ fontSize: 22, lineHeight: 1.5, margin: '18px 0 0' }}>{line}</p>
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

  if (screen === 'lesson' && mod) {
    return (
      <div style={page}><PageChrome idleWarning={idleWarning} logoutIn={logoutIn} walkthrough={!!(record && record.preview)} /><div className="edu-wrap" style={wrap}>
        <button type="button" onClick={() => setScreen('overview')} style={{ background: 'none', border: 'none', color: C.green, fontFamily: FONT, fontSize: 15, cursor: 'pointer', padding: 0 }}>Back to overview</button>
        <p style={{ color: C.muted, margin: '-22px 0 0', fontSize: 14, textAlign: 'right' }}>Module {mod.order} of {course.modules.length}</p>
        <h1 style={{ fontSize: 26, margin: '14px 0 22px', textAlign: 'center' }}>{mod.title}</h1>
        <div style={card}>
          {mod.lesson.paragraphs.map((t, i) => <RichText key={i} text={formatTeachingText(t)} size={17} lineGap={12} />)}
          <div style={{ background: C.greenSoft, borderRadius: 10, padding: 14 }}>
            <Picture visual={mod.lesson.example} />
            <p style={{ margin: '10px 0 0', fontSize: 15, textAlign: 'center' }}>{mod.lesson.example.caption}</p>
          </div>
        </div>
        <div style={{ ...card, background: C.goldSoft, borderColor: C.goldSoft }}>
          <p style={{ margin: 0, fontWeight: 600 }}>Key idea</p>
          <div style={{ marginTop: 6 }}><RichText text={formatTeachingText(mod.lesson.keyIdea)} size={16} /></div>
        </div>
        {course && course.readAloud && <SpeakButton full text={[...mod.lesson.paragraphs, mod.lesson.example.caption, mod.lesson.keyIdea].join(' ')} label="Read it to me" />}
        <Btn full onClick={startPractice}>Practice this</Btn>
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
          <p style={{ fontSize: 20, fontWeight: 600, margin: '0 0 12px', textAlign: 'center', padding: readAloud ? '0 60px' : 0 }}>{q.prompt}</p>
          {q.story && <div style={{ margin: '0 0 14px', color: C.ink }}><RichText text={q.story} size={17} center lineGap={8} /></div>}
          {q.visual && <div style={{ margin: '0 0 14px' }}><Picture visual={q.visual} /></div>}
          {readAloud && <SpeakButton corner text={questionText} label="Hear it again" />}
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
                  <button key={c} type="button" data-choice={c} onClick={() => { if (!checked) { if (readAloud) playTap(); setGiven(c); } }}
                    style={{ opacity: ruledOut && !checked ? 0.45 : 1, fontFamily: FONT, fontSize: choiceFont(q.choices), textAlign: 'center', padding: '12px 10px', minWidth: 0, overflowWrap: 'anywhere', borderRadius: 10, background: bg, border: `2px solid ${border}`, color: C.ink, cursor: checked ? 'default' : 'pointer', minHeight: 48 }}>
                    {/^dots:(\d+)$/.test(c) ? <DotGroup count={Number(c.split(':')[1])} size={28} /> : /^shape:/.test(c) ? <ShapePic name={c.split(':')[1]} size={c.endsWith(':big') ? 88 : c.endsWith(':small') ? 34 : c.endsWith(':medium') ? 58 : 64} /> : /^tens:(\d+)$/.test(c) ? <TensGroup count={Number(c.split(':')[1])} size={14} /> : /^bar:(\d+)$/.test(c) ? <BarPic length={Number(c.split(':')[1])} size={18} /> : /^tower:(\d+)$/.test(c) ? <BarPic length={Number(c.split(':')[1])} vertical size={14} /> : /^solid:/.test(c) ? <SolidPic name={c.slice(6)} size={64} /> : /^icon:/.test(c) ? <IconPic name={c.slice(5)} size={64} /> : /^swatch:/.test(c) ? <Swatch colour={c.slice(7)} size={64} /> : /^item:/.test(c) ? <Item spec={c.slice(5)} size={64} /> : /^clock:/.test(c) ? <ClockPic hour={Number(c.split(':')[1])} minute={Number(c.split(':')[2])} size={80} /> : /^array:/.test(c) ? <ArrayPic rows={Number(c.slice(6).split('x')[0])} cols={Number(c.slice(6).split('x')[1])} size={12} /> : c}
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
                <div role="dialog" aria-label="Requirements" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 40 }} onClick={() => setShowRequirements(false)}>
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
                  <TraceDemo letter={q.answer} animKey={misses} nudge={paceNudge} />
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
              {(wasCorrect || !readAloud) && <div style={{ margin: '8px 0 0' }}><RichText text={formatTeachingText(q.explain)} size={15} lineGap={6} />{!wasCorrect && q.choiceNotes && q.choiceNotes[given] && <p style={{ margin: '6px 0 0', fontSize: 15, color: C.muted }}>{q.choiceNotes[given]}</p>}</div>}
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
    const nextMod = sortedModules.find((m) => m.courseId === mod.courseId && m.order === mod.order + 1);
    const rules = moduleRules(mod.id);
    // One thing to do next, never a menu. Well done goes forward; not yet goes round again
    // through the lesson, because a child who struggled should see it explained once more.
    const backTo = mastered ? null : loopBackTarget(record.events, mod.id);
    // After mastery, an approved reflection is offered once, spoken and tap-only. The record
    // of this round shows whether it has already been answered, so it never repeats.
    const wonderHere = FEATURES.reflection && mastered ? nextWonder(record.events, mod.courseId, wonderReview, true) : null;
    const wonderDone = wonderHere && record.events.some((e) => e.type === 'wonder_answered' && e.wonderId === wonderHere.id && String(e.at) > String(lastEvent.at));
    const goOn = () => {
      if (wonderHere && !wonderDone) { setWonder(wonderHere); setWonderText(''); setWonderPick(''); setWonderStartedAt(Date.now()); setScreen('wonder'); return; }
      if (mastered && nextMod) openModule(nextMod.id); else if (mastered) startPractice(); else if (backTo) loopBack(mod.id, backTo); else { setLessonStep(0); setScreen('lesson'); }
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
          <p style={{ fontSize: 22, margin: 0 }}>{mastered ? 'Well done!' : 'Good try. Let us go again.'}</p>
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
    const nextMod = sortedModules.find((m) => m.courseId === mod.courseId && m.order === mod.order + 1);
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
          {FEATURES.reflection && !readAloud && mastered && nextWonder(record.events, mod.courseId, wonderReview) && <WonderButton onClick={() => { setWonder(nextWonder(record.events, mod.courseId, wonderReview)); setWonderText(''); setWonderPick(''); setWonderStartedAt(Date.now()); setScreen('wonder'); }}>Wonder for a minute</WonderButton>}
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
          {readAloud && <SpeakButton corner text={wonder.prompt} label="Hear it again" />}
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
        {readAloud && <SpeakButton text={allText} label="Read it to me" />}
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
          return [kindToggle, ...groups.map((group) => (
            <div key={group.key} style={{ marginBottom: 18 }}>
              <h2 style={{ fontSize: 19, margin: '0 0 8px', color: C.green, textAlign: 'center' }}>{group.title}</h2>
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
          ))];
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
        <p style={{ color: C.muted, marginTop: 0, fontSize: 15, textAlign: 'center' }}>These thought-provoking questions, situated randomly between learning modules, are designed not only to help information stick, but to promote emotional intelligence, curiosity, critical thinking and positive views of failure. There are no right or wrong answers and responses are never stored.</p>

        <div style={{ ...card, marginTop: 22, background: waiting > 0 ? C.goldSoft : C.greenSoft, borderColor: waiting > 0 ? C.goldSoft : C.greenSoft }}>
          <p style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
            {waiting > 0 ? `${waiting} to review` : `All ${WONDER.length} reviewed`}
          </p>
          <p style={{ margin: '6px 0 10px', fontSize: 15, textAlign: 'center' }}>Students see nothing until approval. Responses are never recorded for privacy reasons.</p>
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

        <p style={{ color: C.muted, fontSize: 13, marginTop: 14, lineHeight: 1.6, textAlign: 'center' }}>Wonder questions are written to sit comfortably with families of all beliefs. No individual voice is implied correct and no question or answer will ever argue for or against religion. Although we think faith is important, we strive to remain neutral for the benefit of all. If a question doesn't suit your community, remove it. Nothing is shown to a student until you approve it.</p>
        {saveNote && <p style={{ color: C.muted, fontSize: 13, textAlign: 'center', marginTop: 32 }}>{saveNote}</p>}

        {/* Reviewing one question opens over the page rather than pushing everything down.
            With a hundred questions to work through, expanding in place would mean endless scrolling. */}
        {reviewingQuestion && (
          <div className="edu-no-print" style={{ position: 'fixed', inset: 0, background: 'rgba(36, 41, 31, 0.55)', zIndex: 100, overflowY: 'auto', padding: '24px 12px' }}>
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
          <p style={{ margin: '0 0 6px', fontWeight: 600, textAlign: 'center' }}>Choose a PIN</p>
          <p style={{ margin: '0 0 8px', fontSize: 14, color: C.muted, textAlign: 'center' }}>Four to six digits. It keeps students out of the educator pages; it is not a bank-grade lock. If it is ever forgotten, it can be reset from the sign-in screen without losing any student progress.</p>
          <PinInput value={newPin} onChange={setNewPin} placeholder="PIN"
            style={{ fontFamily: FONT, fontSize: 18, padding: '12px 14px', width: '100%', boxSizing: 'border-box', border: `2px solid ${C.line}`, borderRadius: 10, marginBottom: 10, letterSpacing: 4 }} />
          <PinInput value={newPin2} onChange={setNewPin2} placeholder="PIN again"
            style={{ fontFamily: FONT, fontSize: 18, padding: '12px 14px', width: '100%', boxSizing: 'border-box', border: `2px solid ${C.line}`, borderRadius: 10, letterSpacing: 4 }} />
        </div>
        <div style={card}>
          <p style={{ margin: '0 0 6px', fontWeight: 600, textAlign: 'center' }}>This device's name</p>
          <p style={{ margin: '0 0 8px', fontSize: 14, color: C.muted, textAlign: 'center' }}>Student progress should be backed up daily. The name you choose for your device incorporates into the name of the backup file so multiple device classrooms are easier to restore (i.e. iPad 3, laptop, chrome book 4).</p>
          <input value={deviceDraft} onChange={(e) => setDeviceDraft(e.target.value)} placeholder="This device's name"
            style={{ fontFamily: FONT, fontSize: 16, padding: '10px 12px', width: '100%', boxSizing: 'border-box', border: `2px solid ${C.line}`, borderRadius: 10 }} />
        </div>
        <div style={card}>
          <p style={{ margin: '0 0 6px', fontWeight: 600, textAlign: 'center' }}>Your state
            <button type="button" onClick={() => setShowStateTip(!showStateTip)} aria-label="Why we ask for your state"
              style={{ background: 'none', border: `1.5px solid ${C.green}`, color: C.green, fontFamily: FONT, fontSize: 12, fontWeight: 700, lineHeight: '15px', width: 18, height: 18, borderRadius: 999, cursor: 'pointer', padding: 0, marginLeft: 8, verticalAlign: 'middle' }}>i</button>
          </p>
          {showStateTip && <p style={{ ...tipStyle, textAlign: 'center' }}>Each state publishes its own learning standards. Most use the Common Core; Texas uses its own. Every course here is mapped to both, and your reports show coverage against the standards that apply to you. You can change this later from the Classroom page.</p>}
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
          <div style={{ paddingBottom: 26 }}><Btn full onClick={goBackTo} disabled={!ok}>Open</Btn></div>
          {!educator && <p style={{ margin: '12px 0 0', fontSize: 14, color: C.muted, textAlign: 'center' }}>No educator account created on this device. <button type="button" onClick={() => { setNewPin(''); setNewPin2(''); setDeviceDraft(''); setStateDraft(''); setSetupError(''); setScreen('educator-setup'); }} style={{ ...linkBtn, fontSize: 14, padding: 0 }}>Create one here</button><br />Starter PIN still works and data can be merged later.</p>}
          {educator && !forgotPin && <p style={{ margin: '12px 0 0', fontSize: 14, color: C.muted }}><button type="button" onClick={() => setForgotPin(true)} style={{ ...linkBtn, fontSize: 14, padding: 0 }}>Forgot my PIN</button></p>}
          {educator && forgotPin && (
            <div style={{ marginTop: 12, padding: 12, borderRadius: 10, background: C.goldSoft }}>
              <p style={{ margin: '0 0 10px', fontSize: 14, textAlign: 'center' }}>To reset your pin, select a backup file or type the recovery code into the field below.</p>
              <input value={typedCode} onChange={(e) => setTypedCode(e.target.value)} placeholder="Recovery code, e.g. 1234-5678-9012-3456" inputMode="numeric"
                style={{ fontFamily: FONT, fontSize: 16, padding: '10px 12px', width: '100%', boxSizing: 'border-box', border: `2px solid ${C.line}`, borderRadius: 10, marginBottom: 10 }} />
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
      setRoster(next);
      const outcome = await saveRoster(next);
      if (!outcome.saved) setSaveNote('That change could not be saved on this device. This happens only during incognito browsing or when browser storage is full.');
    };
    const visible = roster.students.filter((st) => st.active);
    const hidden = roster.students.filter((st) => !st.active);
    return (
      <div style={page}><PageChrome idleWarning={idleWarning} logoutIn={logoutIn} walkthrough={!!(record && record.preview)} /><div className="edu-wrap" style={wrap}>
        {(() => {
          const days = daysSinceBackup(backupAt, new Date().toISOString());
          const overdue = visible.length > 0 && (days === null || days >= 1);
          return (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
              <button type="button" onClick={() => { if (record && record.preview) { setRecord(null); setScreen('educator-pick'); } else setScreen('welcome'); }} style={{ background: 'none', border: 'none', color: C.green, fontFamily: FONT, fontSize: 15, cursor: 'pointer', padding: 0 }}>Home</button>
              {/* Ends the session now, so the next person at a shared device meets the PIN screen. */}
              <button type="button" onClick={() => { setLastActive(0); setIdleWarning(false); closeTips(); setScreen('welcome'); }} style={{ background: 'none', border: 'none', color: C.muted, fontFamily: FONT, fontSize: 14, cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>Sign out</button>
            </div>
          );
        })()}
        <h1 style={{ fontSize: 24, margin: '12px 0 4px', textAlign: 'center' }}>My Classroom</h1>
        {educator && backupAt === null && !backupNudgeSeen && (
          <div className="edu-no-print" style={{ position: 'fixed', inset: 0, background: 'rgba(36, 41, 31, 0.55)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
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

        <div className="edu-narrow"><Btn full onClick={() => { setAdding(true); setRosterError(''); setRosterInput(''); setNewLevel(''); setNewPicture(''); setNewTint(''); }}>Add someone new</Btn></div>
        <div style={{ height: 14 }} />
        {visible.length > 1 && (
          <div className="edu-narrow" style={{ marginTop: 10, marginBottom: 28 }}>
            <div style={{ position: 'relative' }}>
              <div><Btn full kind="secondary" onClick={async () => {
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
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(36, 41, 31, 0.55)', zIndex: 100, overflowY: 'auto', padding: '24px 12px' }}>
            <div className="edu-rise" style={{ maxWidth: 560, margin: '0 auto', background: C.surface, borderRadius: 14, padding: 18, position: 'relative' }}>
              <button type="button" onClick={() => setAdding(false)} aria-label="Close"
                style={{ position: 'absolute', top: 8, right: 10, background: 'none', border: 'none', width: 36, height: 36, fontSize: 30, lineHeight: '34px', cursor: 'pointer', color: C.ink, fontFamily: FONT, padding: 0 }}>×</button>
              <p style={{ margin: '0 0 14px', fontWeight: 600, fontSize: 18 }}>Add someone new</p>

          <input value={rosterInput} onChange={(e) => setRosterInput(e.target.value)} placeholder="School-issued ID" maxLength={NAME_MAX}
            style={{ fontFamily: FONT, fontSize: 17, padding: '12px 14px', width: '100%', boxSizing: 'border-box', border: `2px solid ${C.line}`, borderRadius: 10, marginBottom: 12 }} />
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
                  style={{ fontFamily: FONT, textAlign: 'left', padding: '10px 12px', borderRadius: 10, cursor: 'pointer', background: on ? C.greenSoft : C.surface, border: `2px solid ${on ? C.green : C.line}`, color: C.ink }}>
                  <span style={{ display: 'block', fontSize: 15, fontWeight: 600 }}>{lv.title}</span>
                  <span style={{ display: 'block', fontSize: 12, color: C.muted, marginTop: 2 }}>{lv.blurb}</span>
                </button>
              );
            })}
            {newLevel && levelFor(newLevel) && (
              <div style={{ gridColumn: '1 / -1', marginTop: 4 }}>
                <p style={{ margin: '0 0 6px', fontSize: 14, color: C.muted }}>Which grade should they start in? The placement check can still move a reader up or down from here.</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
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
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                {PICTURES.map((pic) => (
                  <button key={pic} type="button" onClick={() => setNewPicture(pic)} aria-label={pic} aria-pressed={newPicture === pic}
                    style={{ padding: 3, borderRadius: 12, cursor: 'pointer', background: C.surface, border: `2px solid ${newPicture === pic ? C.green : C.line}` }}>
                    <StudentPicture name={pic} tint={newTint} size={42} />
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
                {TINTS.map((t) => (
                  <button key={t.id} type="button" onClick={() => setNewTint(t.id)} aria-label={t.id} aria-pressed={newTint === t.id}
                    style={{ width: 30, height: 30, borderRadius: 999, cursor: 'pointer', background: t.color, border: `3px solid ${newTint === t.id ? C.green : C.surface}`, boxShadow: `0 0 0 1px ${C.line}` }} />
                ))}
                {newPicture && pictureInUse(roster, newPicture, newTint, normalizeStudentId(rosterInput)) && <span style={{ fontSize: 13, color: C.clay }}>Another student has this one.</span>}
              </div>
            </>
          )}
          <Btn full onClick={async () => {
            const r = addStudent(roster, rosterInput, new Date().toISOString(), { level: newLevel, picture: newPicture, tint: newTint, startGrade: newStartGrade || null });
            await applyRoster(r.roster, r.error);
            if (!r.error) {
              // A new student starts with the recommended courses for their level, not every course there is.
              const id = normalizeStudentId(rosterInput);
              const rec = await loadRecord(id);
              if (!rec.events.some((e) => e.type === 'courses_enabled')) {
                const starter = makeCoursesEnabledEvent(recommendedCourseIds([makeCoursesEnabledEvent([], new Date().toISOString())], newLevel, newStartGrade || null), new Date().toISOString());
                await saveRecord({ ...rec, events: [...rec.events, starter] });
              }
              setRosterInput(''); setNewLevel(''); setNewStartGrade(''); setNewPicture(''); setNewTint(''); setAdding(false);
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
        {activeOpen && visible.map((st) => (
          <div key={st.id} style={{ ...card, paddingBottom: 14 }}>
            {renamingId === st.id ? (
              <>
                <input value={renameInput} onChange={(e) => setRenameInput(e.target.value)} placeholder="Name shown to the student" maxLength={NAME_MAX}
                  style={{ fontFamily: FONT, fontSize: 17, padding: '10px 12px', width: '100%', boxSizing: 'border-box', border: `2px solid ${C.line}`, borderRadius: 10, marginBottom: 10 }} />
                <div style={{ display: 'flex', gap: 10 }}>
                  <Btn onClick={async () => { const r = renameStudent(roster, st.id, renameInput); await applyRoster(r.roster, r.error); if (!r.error) { setRenamingId(null);
                    // The ID becomes the first note, so the report still shows it; the educator can remove it.
                    const rec = await loadRecord(st.id); if (rec && renameInput.trim() !== st.id && !teacherNotes(rec.events).some((n) => n.text.startsWith('Student ID:'))) await saveRecord({ ...rec, events: [...rec.events, makeNoteEvent(`Student ID: ${st.id}`, new Date().toISOString())] }); } }}>Save name</Btn>
                  <Btn kind="secondary" onClick={() => { setRenamingId(null); setRosterError(''); }}>Cancel</Btn>
                </div>
                <p style={{ color: C.muted, fontSize: 13, margin: '10px 0 0' }}>The ID stays the same, so progress follows the new name.</p>
              </>
            ) : (
              <>
                <div className="edu-student-body">
                <div className="edu-student-left">
                {st.picture && <StudentPicture name={st.picture} tint={st.tint} size={40} />}
                <div style={{ flex: '1 1 auto', minWidth: 0 }}>
                  <span style={{ display: 'block', fontSize: 18, fontWeight: 600 }}>{keepTogether(st.label)}</span>
                  {st.level && <span style={{ display: 'block', fontSize: 12, color: C.muted }}>{levelFor(st.level).title}{st.startGrade ? ` · ${gradeLabel(st.startGrade)}` : ''}</span>}
                {/* On a laptop the name, grade and links stack on the left and Open report sits on the right, centered
                    on them; on a phone the name and links stay as they are and Open report sits below them, centered. */}
                <div className="edu-student-actions" style={{ display: 'flow-root', marginTop: 8 }}>
                  <button type="button" onClick={() => { setRenamingId(st.id); setRenameInput(st.label); setRosterError(''); }} style={cardLink}>Rename</button>
                  <button type="button" onClick={() => setPictureFor(pictureFor === st.id ? null : st.id)} style={cardLink}>{st.picture ? 'Change picture' : 'Add picture'}</button>
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
                </div>
                </div>
                <div className="edu-student-open"><Btn kind="secondary" disabled={busy} onClick={async () => {
                    setBusy(true);
                    const rec = await withStarterCourses(await loadRecord(st.id));
                    setEducatorRecord(rec);
                    setRecommendedIds(recommendedCourseIds(rec.events, st.level));
                    setOpenSubjects([]); setShowAllCourses(false); setConfirmReset(false); setBusy(false); setScreen('educator-report');
                  }}>Open report</Btn></div>
                </div>
                {mergeFrom === st.id && <p style={{ color: C.gold, fontSize: 13, margin: '8px 0 0' }}>Now tap “Merge here” on the student to keep. Both histories are joined; nothing is deleted.</p>}
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
            <div role="dialog" aria-modal="true" onClick={() => setConfirmDelete(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(36, 41, 31, 0.55)', zIndex: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
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
            <button type="button" role="switch" aria-checked={quickChecks} onClick={async () => { const next = !quickChecks; setQuickChecks(next); await saveQuickChecks(next); }}
              style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, padding: '8px 14px', borderRadius: 999, border: `2px solid ${C.green}`, cursor: 'pointer', whiteSpace: 'nowrap', background: quickChecks ? C.green : C.surface, color: quickChecks ? '#fff' : C.green }}>
              {quickChecks ? 'On' : 'Off'}
            </button>
          </div>
          <p style={{ margin: '0 0 6px', fontWeight: 600 }}>Walk through as a student</p>
          <p style={{ margin: '0 0 10px', fontSize: 15 }}>See exactly what a student sees. Every module is open, every question can be skipped, and nothing is recorded.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {LEVELS.map((lv) => <button key={lv.id} type="button" aria-label={`Walk through ${lv.title.toLowerCase()}`} onClick={() => startPreview(lv.id)} style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, padding: '10px 16px', borderRadius: 10, background: C.surface, border: `2px solid ${C.green}`, color: C.green, cursor: 'pointer' }}>{lv.title}</button>)}
          </div>
        </div>
        <div className="edu-two-up" style={{ marginTop: 22 }}>
        {FEATURES.reflection && (
          <div style={{ ...card, background: 'linear-gradient(135deg, #DCEBE1 0%, #EEF5F0 100%)', borderColor: '#C9DCCF', display: 'flex', flexDirection: 'column' }}>
            <p style={{ margin: '0 0 6px', fontWeight: 600, textAlign: 'center' }}>Wonder Questions</p>
            <p style={{ margin: '0 0 10px', fontSize: 15, textAlign: 'center' }}>{wonderAwaitingReview(wonderReview) > 0 ? `${wonderAwaitingReview(wonderReview)} to review. These optional reflection questions remain invisible until approved.` : 'All reviewed. Only the ones you approved are shown to students.'}</p>
            <div style={{ marginTop: 'auto' }}><Btn full kind="secondary" onClick={() => setScreen('wonder-review')}>Wonder Questions</Btn></div>
          </div>
        )}
        <div style={{ ...card, background: 'linear-gradient(135deg, #E3E9F3 0%, #F1F4F9 100%)', borderColor: '#C9D3E3', display: 'flex', flexDirection: 'column' }}>
          <p style={{ margin: '0 0 6px', fontWeight: 600, textAlign: 'center' }}>Reading Lists</p>
          <p style={{ margin: '0 0 10px', fontSize: 15, textAlign: 'center' }}>Don't know what books to read? No problem! Check out our curated list organized by grade.</p>
          <div style={{ marginTop: 'auto' }}><Btn full kind="secondary" onClick={() => setScreen('reading-lists')}>Reading Lists</Btn></div>
        </div>
        <div style={{ ...card, background: 'linear-gradient(135deg, #F3DCD2 0%, #FAECE6 100%)', borderColor: '#E6C4B6', display: 'flex', flexDirection: 'column' }}>
          <p style={{ margin: '0 0 6px', fontWeight: 600, textAlign: 'center' }}>Science Experiments</p>
          <p style={{ margin: '0 0 10px', fontSize: 15, textAlign: 'center' }}>Who says science is boring? We have cool experiment ideas for every age group!</p>
          <div style={{ marginTop: 'auto' }}><Btn full kind="secondary" onClick={() => setScreen('experiments')}>Experiments</Btn></div>
        </div>
        {FEATURES.lifeSkills && (
          <div style={{ ...card, background: 'linear-gradient(135deg, #F3E7C9 0%, #FAF3E1 100%)', borderColor: '#E6D4A6', display: 'flex', flexDirection: 'column' }}>
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
              <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <button type="button" onClick={() => setScreen('backup')} className={`edu-backup-link${overdue ? ' edu-glow' : ''}`} style={{ position: 'relative', background: 'none', border: 'none', color: C.green, fontFamily: FONT, fontSize: 16, fontWeight: 600, cursor: 'pointer', padding: '8px 12px', textDecoration: 'underline' }}>Backup classroom</button>
                <button type="button" onClick={() => setShowBackupTip(!showBackupTip)} aria-label="About backups"
                  style={{ position: 'relative', background: 'none', border: `1.5px solid ${C.green}`, color: C.green, fontFamily: FONT, fontSize: 12, fontWeight: 700, lineHeight: '15px', width: 18, height: 18, borderRadius: 999, cursor: 'pointer', padding: 0 }}>i</button>
              </span>
                    {showBackupTip && (
                <p style={{ ...tipStyle, textAlign: 'left' }}>All student progress is regularly backed up into your device's download folder. A fresh copy is made after every completed course. However, we still recommend periodic manual backups to shared drive folders in order to insure yourself against broken or lost devices. Only one recent backup file is required to restore all settings and progress for both students and educators!</p>
              )}
            </div>
          );
        })()}
        <ContactLine onOpen={() => setShowContact(true)} />
        {showContact && <ContactPopup onClose={() => setShowContact(false)} />}
      </div></div>
    );
  }

  // ---------- The whole class, most in need first ----------
  if (screen === 'class-view' && classRows) {
    const tone = (band) => (band === 'needs help now' ? 'review' : band === 'keep an eye on' ? 'locked' : 'mastered');
    return (
      <div style={page}><PageChrome idleWarning={idleWarning} logoutIn={logoutIn} walkthrough={!!(record && record.preview)} /><div className="edu-wrap" style={wrap}>
        <button type="button" onClick={() => setScreen('educator-pick')} style={linkBtn}>Back to Classroom</button>
        <h1 style={{ fontSize: 24, margin: '12px 0 16px', textAlign: 'center' }}>Who needs help</h1>
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
                  <span style={{ fontSize: 17, fontWeight: 600 }}>{r.label}</span>
                </span>
                <Tag tone={tone(r.band)}>{r.band}</Tag>
              </div>
              {r.why && <p style={{ margin: '8px 0 0', fontSize: 15, fontWeight: 600 }}>{r.why}</p>}
              <div style={{ margin: '6px 0 0', fontSize: 15 }}>
                {(() => { const lines = r.reasons.length ? r.reasons.map((x) => x.replace(/^./, (c) => c.toUpperCase()) + '.') : ['Nothing to flag.'];
                  const tally = r.total ? `${r.mastered} out of ${r.total} assigned modules have been mastered.` : 'No courses assigned.';
                  const next = r.nextTitle ? ` Next up: **${r.nextTitle}**.` : '';
                  return <RichText text={[...lines, tally + next].join('\n')} size={15} lineGap={4} />; })()}
              </div>
              {r.practice && <div style={{ margin: '6px 0 0', fontSize: 14, color: C.muted }}><RichText text={r.practice} size={14} lineGap={4} /></div>}
              {r.note && <p style={{ margin: '6px 0 0', fontSize: 14, fontStyle: 'italic' }}>Your note: {noteSearch.trim() && !r.note.toLowerCase().includes(noteSearch.trim().toLowerCase()) ? (r.notesAll.find((n) => n.toLowerCase().includes(noteSearch.trim().toLowerCase())) || r.note) : r.note}</p>}
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
        <div className="edu-no-print" style={{ textAlign: 'center', marginTop: 8 }}>
          <Btn onClick={() => { if (typeof window !== 'undefined' && window.print) window.print(); }}>Print this list</Btn>
        </div>
      </div></div>
    );
  }

  // ---------- Backup: the whole classroom in one file, nothing sent anywhere ----------
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
        <h1 style={{ fontSize: 24, margin: '12px 0 18px', textAlign: 'center' }}>Backup classroom</h1>
        <p style={{ color: C.muted, marginTop: 0, fontSize: 15, textAlign: 'center' }}>
          {days === null ? 'No manual backup yet.' : days === 0 ? 'Last manual backup today.' : `Last manual backup ${days} ${days === 1 ? 'day' : 'days'} ago.`}
          {' '}Backups save all student progress and allow for restoration on any device at a later time. Regular backups are highly recommended.
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
            <p style={{ margin: '0 0 4px', fontWeight: 600 }}>Recovery code</p>
            <p style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 700, letterSpacing: 1 }}>{educator.recovery}</p>
            <p style={{ margin: 0, fontSize: 14, color: C.muted, textAlign: 'center' }}>This code is also written at the top of every backup file. If you ever forget your PIN, simply select "forgot my pin" on the login screen and type in the code or choose a backup file. Keep it where students cannot see it.</p>
          </div>
        )}
        <div style={card}>
          <p style={{ margin: '0 0 6px', fontWeight: 600, textAlign: 'center' }}>This device's name</p>
          <p style={{ margin: '0 0 8px', fontSize: 14, color: C.muted, textAlign: 'center' }}>Backing up your device includes the name you add here. This allows for a classroom of ten devices to read at a glance.</p>
          <input value={deviceName} onChange={(e) => setDeviceName(e.target.value)} onBlur={() => saveDeviceName(deviceName)} placeholder="Example: iPad 3, Chromebook"
            style={{ fontFamily: FONT, fontSize: 16, padding: '10px 12px', width: '100%', boxSizing: 'border-box', border: `2px solid ${C.line}`, borderRadius: 10 }} />
          <p style={{ margin: '8px 0 0', fontSize: 13, color: C.muted, textAlign: 'center' }}>Example file name: {backupFileName(deviceName || 'chromebook', activeCount || 2, new Date().toISOString())}</p>
        </div>

        <div style={card}>
          <div style={{ display: 'grid', gridTemplateColumns: canShare ? '1fr 1fr' : '1fr', gap: 10 }}>
            {/* On an iPad or a phone, Share opens the device's own sheet, where Mail is one tap away. */}
            {canShare && (
              <Btn full onClick={() => {
                // Sharing must happen in the same instant as the click, so the file is the one prepared earlier.
                const f = preparedBackup;
                if (!f) { setBackupNote('One moment, the backup is still being prepared. Try again.'); return; }
                const file = new File([f.text], f.name, { type: 'application/json' });
                if (!navigator.canShare({ files: [file] })) { setShareRefused(true); setBackupNote('Sharing files is not available here. Use Download instead.'); return; }
                navigator.share({ files: [file], title: 'EduSphere backup' })
                  .then(() => markDone(f.at, 'Shared. Wherever you sent it is now your backup.'))
                  .catch((err) => { if (err && err.name === 'AbortError') setBackupNote('Sharing was canceled.'); else { setShareRefused(true); setBackupNote('This browser cannot share files. Use Download instead.'); } });
              }}>Share backup</Btn>
            )}
            <Btn full kind={canShare ? 'secondary' : 'primary'} onClick={async () => {
              const f = await makeFile();
              const outcome = await downloadFile(f.name, f.text);
              if (outcome === 'canceled') setBackupNote('No file was saved.');
              else if (outcome) await markDone(f.at, 'Backup saved. Keep it somewhere safe, such as a shared folder or your email.');
              else setBackupNote('Downloads are not available here.');
            }}>Download backup</Btn>
          </div>
          {backupNote && <p style={{ margin: '10px 0 0', fontSize: 14, color: C.muted, textAlign: 'center' }}>{backupNote}</p>}
        </div>

        <div style={card}>
          <p style={{ margin: '0 0 6px', fontWeight: 600, textAlign: 'center' }}>Automatic Backups</p>
          <p style={{ margin: '0 0 10px', fontSize: 14, color: C.muted, textAlign: 'center' }}>Each time a student finishes a course, a backup of their progress is stored into your downloads folder.</p>
          <p style={{ margin: 0, fontSize: 14, color: C.muted, textAlign: 'center' }}>While you have the option to push a backup manually and select a destination above, it's not entirely necessary. However, it could be a good idea to periodically save into a shared drive folder to insure yourself against broken devices. This allows you to restore all progress and settings on any other device of your choosing.</p>
          {autoBackupNote && <p style={{ margin: '8px 0 0', fontSize: 13, color: C.muted, textAlign: 'center' }}>{autoBackupNote}</p>}
        </div>

        <div style={card}>
          <p style={{ margin: '0 0 6px', fontWeight: 600, textAlign: 'center' }}>Restore from backup</p>
          <p style={{ margin: '0 0 10px', fontSize: 14, color: C.muted, textAlign: 'center' }}>Restoring <strong>adds</strong> student metrics to whatever currently lives on this device. Students are matched by ID and histories are then merged. Nothing on this device is ever removed.</p>
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
        <p style={{ fontSize: 13, color: C.muted, textAlign: 'center' }}>We send nothing anywhere. You choose where the file goes. Choose wisely.</p>
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
        <p style={{ color: C.muted, marginTop: 0, fontSize: 14, textAlign: 'center' }}>Report generated {fmtDate(rep.generatedAt)}</p>
        <div className="edu-no-print" style={{ textAlign: 'center', margin: '0 0 12px' }}><Btn kind="secondary" onClick={() => { if (typeof window !== 'undefined' && window.print) window.print(); }}>Print this report</Btn></div>

        {/* Teacher notes: written here, kept on the student's log, so they ride along in every backup. */}
        <div style={{ ...card, marginBottom: 14 }}>
          <p className="edu-card-title" style={{ margin: '0 0 6px', fontWeight: 600 }}>Notes</p>
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
          <div className="edu-note-box edu-no-print">
            <textarea value={noteInput} onChange={(e) => setNoteInput(e.target.value)} aria-label="Teacher note" placeholder="Write a note about this student (i.e. needs assistance with math, loves dinosaurs)" rows={2}
              style={{ width: '100%', boxSizing: 'border-box', fontFamily: FONT, fontSize: 15, padding: 10, borderRadius: 10, border: `1px solid ${C.line}`, resize: 'vertical' }} />
            <div className="edu-note-save"><Btn kind="secondary" disabled={!noteInput.trim()} onClick={async () => { await addToStudent(makeNoteEvent(noteInput, new Date().toISOString())); setNoteInput(''); }}>Save note</Btn></div>
          </div>
          <p style={{ margin: '10px 0 0', fontSize: 14, color: C.muted, textAlign: 'center' }}>Quickly search student notes through the "Who Needs Help" page. <InfoButton onClick={() => setShowNoteTip(!showNoteTip)} label="About notes" open={showNoteTip} /></p>
          {showNoteTip && <TipText>A note here stays with the student and can be restored through backups.</TipText>}
        </div>
        {/* The summary a parent or principal can read without decoding anything: a list, then sentences */}
        {(() => {
          const parts = summaryParts(rep);
          return (
            <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
              <button type="button" className="edu-fold-head" onClick={() => setOpenSummary(!openSummary)} aria-expanded={openSummary}
                style={{ fontFamily: FONT, width: '100%', textAlign: 'left', background: 'transparent', border: 'none', padding: 16, cursor: 'pointer', color: C.ink, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="edu-fold-title" style={{ fontSize: 17, fontWeight: 600 }}>Summary</span><span className="edu-fold-meta" style={{ color: C.muted }}>{openSummary ? '▴' : '▾'}</span>
              </button>
              {openSummary && (
                <div style={{ padding: '0 16px 16px' }}>
                  <p style={{ margin: '0 0 6px', fontSize: 16, lineHeight: 1.6 }}>{parts.lead}</p>
                  {parts.items.length > 0 && <ul style={{ margin: '0 0 10px', padding: '10px 12px 10px 32px', listStyleType: 'disc', fontSize: 15, lineHeight: 1.7, borderRadius: 10, background: 'linear-gradient(135deg, #EAF2EC 0%, #F5F9F5 100%)', border: '1px solid #DCE8DF' }}>{parts.items.map((it) => <li key={it} style={{ display: 'list-item' }}>{it}</li>)}</ul>}
                  {parts.rest && <div style={{ margin: 0, fontSize: 16, lineHeight: 1.6, textAlign: 'center' }}>{parts.rest.split(/(?<=\.)\s+/).filter(Boolean).map((line) => <p key={line} style={{ margin: '2px 0' }}>{line}</p>)}</div>}
                  {parts.tried && parts.tried.length > 0 && (
                    <div style={{ margin: '8px 0 0' }}>
                      <p style={{ margin: '0 0 4px', fontSize: 16, lineHeight: 1.6 }}>Tried but not passed yet:</p>
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
            <p style={{ margin: '0 0 4px', fontWeight: 600 }}>Writing assignment that needs your check ({pendingWritings(educatorRecord.events).length})</p>
            <p style={{ margin: '0 0 12px', fontSize: 14, color: C.muted, textAlign: 'center', lineHeight: 1.5 }}>{shownName} wrote this assignment on paper and marked it as finished. The requirements are outlined below and it's up to you to select "Pass" or "Not Yet". By selecting "Pass" you are unlocking the next writing module. "Not Yet" requires a retry. Students never receive numerical scores from us.</p>
            {pendingWritings(educatorRecord.events).map((w) => (
              <div key={w.at} style={{ borderTop: `1px solid ${C.line}`, padding: '10px 0' }}>
                <p style={{ margin: '0 0 4px', fontWeight: 600 }}>{titleCase((getModule(w.moduleId) || { title: w.moduleId }).title)} · finished {fmtDate(w.at)}</p>
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
          <p style={{ margin: '0 0 10px', fontSize: 14, color: C.muted }}>Assign courses by checking or unchecking the boxes below. Each student starts with the courses we recommend (based on a combination of {shownName}'s initial placement check, quick-check module skips and/or his or her actual progression through the modules) but you are free to edit how you see fit.</p>
          <input value={courseQuery} onChange={(e) => setCourseQuery(e.target.value)} placeholder="Search courses, for example: grade 1 math, kinder, fractions" aria-label="Search courses"
            style={{ fontFamily: FONT, fontSize: 15, padding: '10px 12px', width: '100%', boxSizing: 'border-box', border: `2px solid ${C.line}`, borderRadius: 10, marginBottom: 10, background: C.surface }} />
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
          {!courseQuery.trim() && <button type="button" className="edu-no-print" style={{ ...linkBtn, marginTop: 6 }} onClick={() => setShowAllCourses(!showAllCourses)}>
            {showAllCourses ? 'Hide other courses' : `Show other courses (${COURSES.length - recommended.length})`}
          </button>}
          {!courseQuery.trim() && showAllCourses && (
            <div className="edu-no-print" style={{ borderTop: `1px solid ${C.line}`, marginTop: 8, paddingTop: 8 }}>
              <p style={{ margin: '0 0 10px', fontSize: 14, color: C.muted, textAlign: 'center' }}>Wish to stray from our recommendations? Select anything below for {shownName} to complete.</p>
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
          <div className="edu-no-print" style={{ position: 'fixed', inset: 0, background: 'rgba(36, 41, 31, 0.55)', zIndex: 100, overflowY: 'auto', padding: '24px 12px' }}>
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
        <div className="edu-no-print" style={{ ...card, background: C.goldSoft, borderColor: C.goldSoft }}>
          <p className="edu-card-title" style={{ margin: '0 0 6px', fontWeight: 600 }}>Transcript</p>
          <p style={{ margin: '0 0 10px', fontSize: 15 }}>A printable record of everything {shownName} has ever worked on, including courses that are no longer assigned. This is the clearest view of student progression.</p>
          <div style={{ textAlign: 'center' }}><Btn kind="secondary" onClick={() => setScreen('transcript')} style={{ width: 'min(300px, 100%)' }}>Open transcript</Btn></div>
        </div>

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
        {confirmReset ? (
          <div style={{ ...card, borderColor: C.clay }}>
            <p style={{ margin: '0 0 10px' }}>Start {shownName} over in every subject? The record is kept, but nothing will count as mastered.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <Btn onClick={async () => { await addToStudent(makeResetEvent(new Date().toISOString())); setConfirmReset(false); }} disabled={busy}>Yes, reset all progress</Btn>
              <Btn kind="secondary" onClick={() => setConfirmReset(false)}>Cancel</Btn>
            </div>
          </div>
        ) : (
          <div className="edu-no-print" style={{ textAlign: 'center' }}><Btn kind="secondary" onClick={() => setConfirmReset(true)} style={{ width: 'min(300px, 100%)' }}>Reset {shownName}'s Progress</Btn></div>
        )}
        </div>
        {saveNote && <p style={{ color: C.muted, fontSize: 13, textAlign: 'center', marginTop: 32 }}>{saveNote}</p>}
      </div></div>
    );
  }

  return <div style={page}><PageChrome idleWarning={idleWarning} logoutIn={logoutIn} walkthrough={!!(record && record.preview)} /><div className="edu-wrap" style={wrap}><p>Something went wrong. <Btn kind="secondary" onClick={() => setScreen('overview')}>Back to overview</Btn></p></div></div>;
}
