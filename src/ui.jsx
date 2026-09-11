
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
const page = { fontFamily: FONT, background: C.bg, color: C.ink, minHeight: '100vh', boxSizing: 'border-box', padding: '22px 16px 40px', lineHeight: 1.5 };
const frame = { position: 'fixed', inset: 0, border: `6px solid ${C.green}`, pointerEvents: 'none', zIndex: 50 };
// Width comes from the .edu-wrap class, so a wide screen can be given more room.
const wrap = { margin: '0 auto' };
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

function ContactLine({ onOpen, inline = false }) {
  return (
    <p className="edu-no-print" style={{ textAlign: 'center', marginTop: inline ? 0 : 28, fontSize: inline ? 14 : 12, color: C.muted, margin: inline ? '0' : undefined }}>
      {onOpen
        ? <button type="button" onClick={onOpen} style={{ background: 'none', border: 'none', color: C.muted, fontFamily: FONT, fontSize: 12, cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>Contact us</button>
        : <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: C.muted, textDecoration: 'underline' }}>Contact us</a>}
    </p>
  );
}

const linkBtn = { background: 'none', border: 'none', color: '#2F5D4F', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', fontSize: 15, cursor: 'pointer', padding: '6px 0', textDecoration: 'underline' };
const card = { background: C.surface, border: `1px solid ${C.line}`, borderRadius: 14, padding: 18, marginBottom: 14 };

// ---------- Small building blocks ----------
function Btn({ children, onClick, kind = 'primary', disabled = false, full = false, halo = false }) {
  const base = {
    fontFamily: FONT, fontSize: 16, fontWeight: 600, padding: '12px 18px', borderRadius: 10,
    cursor: disabled ? 'default' : 'pointer', border: `2px solid ${C.green}`, minHeight: 46,
    width: full ? '100%' : 'auto', opacity: disabled ? 0.5 : 1,
  };
  const looks = kind === 'primary'
    ? { background: C.green, color: '#fff' }
    : { background: C.surface, color: C.green };
  const button = <button type="button" className="edu-press" style={{ ...base, ...looks }} onClick={onClick} disabled={disabled}>{children}</button>;
  if (!halo || disabled) return button;
  // The halo pulses behind the button, never on it, so the tap target never moves.
  return (
    <span style={{ position: 'relative', display: full ? 'block' : 'inline-block' }}>
      <span className="edu-halo" aria-hidden="true" style={{ position: 'absolute', inset: -5, borderRadius: 14, background: kind === 'primary' ? C.green : C.gold, pointerEvents: 'none' }} />
      <span style={{ position: 'relative', display: 'block' }}>{button}</span>
    </span>
  );
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
    <svg ref={ref} viewBox="0 0 100 100" role="img" aria-label={`Trace the letter ${letter}`}
      onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerLeave={end} onPointerCancel={end}
      style={{ width: '100%', maxWidth: 320, aspectRatio: '1 / 1', display: 'block', margin: '0 auto', background: C.surface, border: `2px solid ${C.line}`, borderRadius: 16, touchAction: 'none', cursor: 'crosshair' }}>
      {def && def.strokes.map((st, i) => (
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
function Picture({ visual, animate = false, animKey = 0 }) {
  if (!visual) return null;
  if (visual.kind === 'dots') return <div style={{ padding: '6px 0' }}><DotGroup count={visual.count} animate={animate} animKey={animKey} /></div>;
  if (visual.kind === 'shape') return <div key={animKey} className={animate ? 'edu-drift' : undefined} style={{ padding: '6px 0' }}><ShapePic name={visual.name} size={110} /></div>;
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
    // Each letter swells as it is named, so a child who cannot read still knows which one
    // is being talked about.
    const parts = visual.text.split('');
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
const PREFERRED_VOICES = ['Samantha', 'Ava', 'Allison', 'Karen', 'Moira', 'Google US English', 'Microsoft Aria', 'Microsoft Jenny', 'Microsoft Zira', 'Tessa', 'Fiona', 'Victoria'];
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

function speak(text) {
  if (typeof window === 'undefined' || !window.speechSynthesis || !text) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const voice = pickVoice();
    if (voice) u.voice = voice;
    u.rate = 0.88;   // a little slower than normal speech, for young listeners
    u.pitch = 1.05;  // slightly warmer than the default
    window.speechSynthesis.speak(u);
  } catch (e) { /* a broken voice must never stop a lesson */ }
}

// One button for every read-aloud spot. If the device or preview has no speech, the
// button is replaced by a short note, so nothing on screen looks broken or unresponsive.
function SpeakButton({ text, label, full = false }) {
  const [spoke, setSpoke] = useState(false);
  if (!canSpeak()) {
    return <p style={{ margin: '0 0 12px', fontSize: 14, color: C.muted }}>Reading aloud is not available on this device or in this preview. The words are all on screen.</p>;
  }
  return (
    <div style={{ marginBottom: 12 }}>
      <Btn full={full} kind="secondary" onClick={() => { speak(text); setSpoke(true); }}>{label}</Btn>
      {spoke && <p style={{ margin: '6px 0 0', fontSize: 13, color: C.muted }}>If you heard nothing, check that your device is not on silent.</p>}
    </div>
  );
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
    return d < 44 ? 0.08 : d < 70 ? 0.45 : 1;
  };
  // A letter near the pointer thins out and comes back, the same way the arcs do.
  const letterFade = (p) => { if (!clearing) return 1; const d = Math.hypot(p.cx - clearing.x, p.cy - clearing.y); return d < 30 ? 0.06 : d < 52 ? 0.4 : 1; };
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
@media print {
  /* Everything folded away on screen is opened for the printer, so a printed report is complete. */
  .edu-collapsible { display: block !important; }
  .edu-no-print { display: none !important; }
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
@keyframes edu-settle { 0% { transform: translateY(-10px) scale(1.04); opacity: 0; } 55% { opacity: 1; } 100% { transform: translateY(0) scale(1); opacity: 1; } }
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
.edu-settle { animation: edu-settle 0.9s cubic-bezier(0.2, 0.9, 0.3, 1.1) 0.9s both; }
.edu-settle-late { animation: edu-settle 0.9s cubic-bezier(0.2, 0.9, 0.3, 1.1) 1.2s both; }
.edu-star-twinkle { animation: edu-twinkle-star 2.4s ease-in-out infinite; }
.edu-press { transition: transform 0.12s ease; }
.edu-press:active { transform: scale(0.94); }
/* Layout for larger screens. Phones stay narrow; a laptop gets a wider column and a
   pair of quiet arcs at the edges, drawn in the same green as the logo, so the page
   does not sit in a sea of blank space. */
.edu-wrap { max-width: 560px; }
.edu-side { display: none; }
.edu-welcome { display: flex; flex-direction: column; }
.edu-welcome-links { margin-top: auto; }
@media (min-width: 1000px) {
  .edu-wrap { max-width: 720px; }
  .edu-welcome { min-height: calc(100vh - 40px); }
  .edu-welcome-logo svg { width: 333px !important; height: auto !important; }
  .edu-welcome-card { margin-top: 36px; min-height: 340px; padding: 28px 24px !important; }
  .edu-welcome-card h2 { font-size: 26px !important; }
  .edu-welcome-links { padding-top: 48px; padding-bottom: 24px; }
  .edu-welcome-links button, .edu-welcome-links p { font-size: 18px !important; }
}
@media (min-width: 1100px) {
  .edu-side { display: block; position: fixed; top: 0; bottom: 0; width: 300px; pointer-events: none; z-index: 0; opacity: 0.6; }
  .edu-side-left { left: 0; } .edu-side-right { right: 0; transform: scaleX(-1); }
}
@media (min-width: 1500px) { .edu-side { width: 420px; opacity: 0.7; } }
@keyframes edu-glow { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }
@keyframes edu-breathe { 0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(58, 107, 88, 0); } 50% { transform: scale(1.015); box-shadow: 0 0 0 6px rgba(58, 107, 88, 0.18); } }
.edu-breathe { animation: edu-breathe 2.2s ease-in-out infinite; border-radius: 12px; }
@keyframes edu-slide-in { from { transform: translateX(-40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
.edu-slide-in { animation: edu-slide-in 0.6s ease-out both; }
.edu-glow { animation: edu-glow 1.8s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) {
  .edu-glow, .edu-breathe, .edu-slide-in { animation: none; }
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
  const label = status === 'mastered' ? 'Finished' : status === 'available' ? 'Ready' : 'Locked';
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
      {inviting && <span className="edu-halo" aria-hidden="true" style={{ position: 'absolute', inset: -6, borderRadius: 999, background: C.green, pointerEvents: 'none' }} />}
      <button type="button" onClick={onClick} disabled={disabled} aria-label={label} className="edu-press"
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

// The text behind an i button. A soft green gradient sets it apart from the page's own
// text, and every tip uses this so they all look the same.
const tipStyle = { margin: '6px 0 10px', padding: '10px 12px', borderRadius: 10, fontSize: 13, color: C.ink, fontStyle: 'italic', lineHeight: 1.55, background: 'linear-gradient(135deg, #EAF2EC 0%, #F5F9F5 100%)', border: '1px solid #DCE8DF' };
function TipText({ children }) { return <div style={tipStyle}>{children}</div>; }
function InfoButton({ onClick, label, open = false }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} aria-expanded={open}
      style={{ background: open ? C.green : 'none', border: `1.5px solid ${C.green}`, color: open ? '#fff' : C.green, fontFamily: FONT, fontSize: 12, fontWeight: 700, lineHeight: '15px', width: 18, height: 18, borderRadius: 999, cursor: 'pointer', padding: 0, marginLeft: 8, verticalAlign: 'middle', flexShrink: 0 }}>i</button>
  );
}

// The arcs that fill the edges of a wide screen. Hidden on anything narrower than a
// laptop, never in the way of a tap, and drawn once with no animation.
function SideArcs({ side }) {
  return (
    <svg className={`edu-side edu-side-${side}`} viewBox="0 0 240 900" preserveAspectRatio="xMinYMid slice" aria-hidden="true">
      <g fill="none" stroke={C.green} strokeLinecap="round">
        <path d="M-40 120 C 120 220, 120 420, -40 520" strokeWidth="2.2" strokeOpacity="0.55" />
        <path d="M-60 260 C 160 360, 160 560, -60 660" strokeWidth="1.6" strokeOpacity="0.4" />
        <path d="M-30 420 C 200 520, 200 720, -30 820" strokeWidth="2.6" strokeOpacity="0.35" />
        <path d="M-70 40 C 90 120, 90 300, -70 380" strokeWidth="1.4" strokeOpacity="0.3" />
        <path d="M-50 600 C 140 680, 140 860, -50 940" strokeWidth="1.8" strokeOpacity="0.45" />
        <path d="M60 180 C 150 260, 150 380, 60 460" strokeWidth="1.2" stroke={C.gold} strokeOpacity="0.5" />
      </g>
    </svg>
  );
}

// The stylesheet rides along with the frame, so every screen has the animations.
function PageChrome({ idleWarning = false }) {
  return (
    <>
      <style>{WONDER_ANIMATION + PRINT_STYLES + KID_ANIMATION}</style>
      <div className="edu-frame" style={frame} aria-hidden="true" />
      {/* Quiet great-circle arcs at the edges of a wide screen, like the logo's. */}
      <SideArcs side="left" />
      <SideArcs side="right" />
      {idleWarning && (
        <div role="status" className="edu-no-print edu-rise" style={{ position: 'fixed', left: 12, right: 12, bottom: 16, zIndex: 60, background: '#24291F', color: '#fff', borderRadius: 12, padding: '12px 16px', fontFamily: FONT, fontSize: 15, textAlign: 'center' }}>
          You will be logged out soon due to inactivity. Tap anywhere to stay.
        </div>
      )}
    </>
  );
}

function Tag({ children, tone }) {
  const tones = { mastered: [C.goldSoft, C.gold], available: [C.greenSoft, C.green], locked: ['#EEF0EA', C.muted], review: [C.claySoft, C.clay] };
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
let autoSaveHandle = null; // the chosen file, kept for this session only
function canAutoSave() { return typeof window !== 'undefined' && typeof window.showSaveFilePicker === 'function'; }
async function chooseAutoSaveFile(suggestedName) {
  if (!canAutoSave()) return false;
  try {
    autoSaveHandle = await window.showSaveFilePicker({ suggestedName, types: [{ description: 'EduSphere backup', accept: { 'application/json': ['.json'] } }] });
    return true;
  } catch (err) { return false; }
}
async function writeAutoSave(text) {
  if (!autoSaveHandle) return false;
  try { const w = await autoSaveHandle.createWritable(); await w.write(text); await w.close(); return true; }
  catch (err) { autoSaveHandle = null; return false; }
}

// Hands the browser a file to download. Works in every browser; nothing is sent anywhere.
function downloadFile(name, text) {
  if (typeof document === 'undefined') return false;
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
  const [showTouchlessTip, setShowTouchlessTip] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showWonderTip, setShowWonderTip] = useState(false);
  const [showProgressTip, setShowProgressTip] = useState(false);
  const [openSummary, setOpenSummary] = useState(true);
  const [openAssigned, setOpenAssigned] = useState(false);
  const [openProgress, setOpenProgress] = useState(false);
  const [openTerms, setOpenTerms] = useState([]);
  const [openApproved, setOpenApproved] = useState([]);
  const closeTips = () => { setShowBackupTip(false); setShowRosterTip(false); setShowStateTip(false); setShowTouchlessTip(false); setShowWonderTip(false); setShowProgressTip(false); };
  const [stateCode, setStateCode] = useState('');                 // the educator's state, chosen once
  const [stateDraft, setStateDraft] = useState('');
  const [autoSaving, setAutoSaving] = useState(false);            // a file has been chosen for touchless backup
  const [activeOpen, setActiveOpen] = useState(true);            // the Active students list, open by default
  const [hiddenOpen, setHiddenOpen] = useState(false);
  const [adding, setAdding] = useState(false);                   // the add-a-student popup
  const [classRows, setClassRows] = useState(null);              // the whole-class view, once loaded
  const [lastActive, setLastActive] = useState(0);               // when the educator last touched the screen
  const [idleWarning, setIdleWarning] = useState(false);
  const [openSubjects, setOpenSubjects] = useState([]);       // which subject panels are expanded on the report
  const [showAllCourses, setShowAllCourses] = useState(false); // optional courses on the educator report
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
  const [tracePaths, setTracePaths] = useState([]);           // the finger's path on a tracing question
  const [cheer, setCheer] = useState(0);                      // bumped to replay the celebration
  const [record, setRecord] = useState(null);      // { name, events, ... } for the current learner
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
  const [startedAt, setStartedAt] = useState(null);
  const [lastEvent, setLastEvent] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [saveNote, setSaveNote] = useState('');       // shown once if a save could not be stored on the device
  const [qShownAt, setQShownAt] = useState(0);       // when the current question appeared (for time-per-question)
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
  const statuses = useMemo(() => (progress ? moduleStatuses(progress) : []), [progress]);
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
  const subjects = useMemo(() => [...new Set(visibleCourses.map((c) => c.subject))].sort(), [visibleCourses]);
  // A young learner is any student with an early-years course (pre-K to grade 2) still
  // unfinished, whatever else is assigned. Their screens are simpler: no numbers to read,
  // nothing that needs a scroll to find, one thing to do next. Early courses come first in
  // every subject, and the prerequisite graph keeps advanced work locked until the early
  // work it depends on is mastered. Once every early course is complete they graduate to
  // the regular screens.
  const earlyModuleIds = useMemo(() => visibleCourses.filter((c) => stageForGrade(c.grade) === 'early').flatMap((c) => c.modules.map((m) => m.id)), [visibleCourses]);
  const youngLearner = earlyModuleIds.length > 0 && earlyModuleIds.some((id) => !progress.masteredIds.includes(id));

  // On first load: find learners who have used this device before.
  useEffect(() => {
    (async () => {
      setRoster(await loadRoster());
      setCovered(await loadCovered());
      setWonderReview(await loadWonderReview());
      setBackupAt(await loadBackupAt());
      setDeviceName(await loadDeviceName());
      setStateCode(await loadStateCode());
      setEducator(await loadEducator());
      { const rawProfile = await loadEducatorRaw(); if (rawProfile && !rawProfile.pin) setPendingProfile(rawProfile); }
      setScreen('welcome');
    })();
  }, []);

  // Adds one event to the learner's log and saves. This is the ONLY place the log changes.
  async function addEvent(event) {
    const next = { ...record, events: [...record.events, event] };
    setRecord(next);
    setBusy(true);
    const outcome = await saveRecord(next);
    setSaveNote(outcome.saved ? '' : 'This step could not be saved on this device. This happens only during incognito browsing or when browser storage is full. It still counts for this session.');
    setBusy(false);
    return next;
  }

  async function startWithName(name) {
    if (!name.trim()) return;
    setBusy(true); setErrorMsg('');
    try {
      const rec = await loadRecord(name);
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

  async function openModule(id) {
    if (statusOf(id) === 'locked') return;
    setModuleId(id);
    setLessonStep(0);
    await addEvent(makeLessonViewedEvent(id, new Date().toISOString()));
    setScreen('lesson');
  }

  function startPractice() {
    const seed = (Date.now() % 2147483646) + 1;
    setAttempt(buildAttempt(moduleId, seed, progress.masteredIds));
    setQIndex(0); setGiven(''); setChecked(false); setMisses(0); setCoreResults([]); setReviewResult(null);
    setStartedAt(new Date().toISOString());
    setQShownAt(Date.now());
    setScreen('practice');
  }

  // The questions shown in this practice set: the core ones, then the review one (if any).
  const questions = attempt ? [...attempt.core, ...(attempt.review ? [attempt.review.question] : [])] : [];
  const isReviewQ = attempt ? qIndex >= attempt.core.length : false;
  const q = questions[qIndex];

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
    if (isReviewQ) setReviewResult({ moduleId: attempt.review.moduleId, ...result });
    else setCoreResults((r) => [...r, result]);
    setWasCorrect(correct); setChecked(true);
    if (correct) setCheer((n) => n + 1);
  }

  // Clears the feedback so the child can have another go at the same question.
  function tryAgain() {
    setGiven(''); setChecked(false); setTracePaths([]); setQShownAt(Date.now());
  }

  async function nextQuestion() {
    if (qIndex + 1 < questions.length) {
      setQIndex(qIndex + 1); setGiven(''); setChecked(false); setMisses(0); setQShownAt(Date.now());
      return;
    }
    const event = makeAttemptEvent(attempt, coreResults, reviewResult, startedAt, new Date().toISOString());
    setLastEvent(event);
    await addEvent(event);
    // Finishing a whole course switches on the next course up in that subject, recorded as
    // an event so the educator can see it happened and change it if they like.
    const nextUp = coursesToUnlock([...record.events, event]);
    if (nextUp.length) await addEvent(makeCoursesEnabledEvent([...enabledCourseIds([...record.events, event]), ...nextUp], new Date().toISOString()));
    setScreen('result');
    // Touchless backup: if a file was chosen, it is rewritten now with everything on the device.
    if (autoSaving) {
      const everything = await gatherEverything(roster);
      const at = new Date().toISOString();
      const wrote = await writeAutoSave(JSON.stringify(buildBackup({ ...everything, deviceName, recovery: educator ? educator.recovery : null }, at), null, 2));
      if (wrote) { setBackupAt(at); await saveBackupAt(at); } else setAutoSaving(false);
    }
  }


  // Which module/course is open, and read-aloud for courses that use it.
  // (Hooks live here, above the first early return, so React sees the same hooks every render.)
  const mod = moduleId ? getModule(moduleId) : null;
  const course = mod ? getCourse(mod.courseId) : null;
  const readAloud = !!(course && course.readAloud);
  const questionText = q ? [q.story, q.prompt].filter(Boolean).join(' ') : '';
  useEffect(() => { if (screen === 'practice' && readAloud && questionText) speak(questionText); }, [screen, readAloud, questionText]);
  // An educator stays signed in while they are using the screen. After four quiet minutes a
  // warning appears; after five, the PIN is asked for again. Any tap or key resets the clock.
  const EDUCATOR_SCREENS = ['educator-pick', 'educator-report', 'transcript', 'life-skills', 'wonder-review', 'backup', 'class-view', 'change-state'];
  const onEducatorScreen = EDUCATOR_SCREENS.includes(screen);
  useEffect(() => {
    if (!onEducatorScreen) { setIdleWarning(false); return undefined; }
    setLastActive(Date.now());
    const touch = () => { setLastActive(Date.now()); setIdleWarning(false); };
    window.addEventListener('pointerdown', touch); window.addEventListener('keydown', touch);
    return () => { window.removeEventListener('pointerdown', touch); window.removeEventListener('keydown', touch); };
  }, [onEducatorScreen]);
  useEffect(() => {
    if (!onEducatorScreen) return undefined;
    const tick = setInterval(() => {
      const quiet = Date.now() - lastActive;
      if (quiet >= 5 * 60 * 1000) { setIdleWarning(false); setPinInput(''); setScreen('educator-pin'); }
      else if (quiet >= 4 * 60 * 1000) setIdleWarning(true);
    }, 5000);
    return () => clearInterval(tick);
  }, [onEducatorScreen, lastActive]);
  // Every screen opens at the top. Without this, a long page keeps the previous scroll position.
  useEffect(() => { if (typeof window !== 'undefined' && window.scrollTo) window.scrollTo(0, 0); closeTips(); }, [screen]);
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
  useEffect(() => { if (typeof window !== 'undefined') window.__eduTest = { screen, question: q || null, isReviewQ }; }, [screen, q, isReviewQ]);
  // The learner list can change during a session (a new learner just started), so refresh it whenever a picker screen opens.
  useEffect(() => { if (screen === 'welcome' || screen === 'educator-pick') loadRoster().then(setRoster); }, [screen]);
  useEffect(() => { if (screen === 'practice' && readAloud && checked && q) speak((wasCorrect ? 'Correct. ' : 'Not quite. The answer is ' + describeChoice(q.answer) + '. ') + q.explain); }, [checked]);

  // ---------- Screens ----------
  if (screen === 'loading') return <div style={page}><PageChrome idleWarning={idleWarning} /><div className="edu-wrap" style={wrap}><p style={{ color: C.muted }}>Loading…</p></div></div>;

  if (screen === 'welcome') {
    return (
      <div style={page}><PageChrome idleWarning={idleWarning} /><div className="edu-wrap edu-welcome" style={wrap}>
        <div className="edu-welcome-logo" style={{ margin: '10px 0 8px' }}><Logo width={250} animate /></div>
        <div className="edu-welcome-card" style={card}>
          <h2 style={{ fontSize: 20, margin: '0 0 14px', textAlign: 'center' }}>Who's learning today?</h2>
          {activeStudents(roster).length === 0 ? (
            <p style={{ margin: 0, color: C.muted, fontSize: 15, textAlign: 'center' }}>No students have been added. An educator can add students by logging in below.</p>
          ) : (
            <>
              {activeStudents(roster).length > 8 && (
                <input value={nameInput} onChange={(e) => setNameInput(e.target.value)} placeholder="Find your name"
                  style={{ fontFamily: FONT, fontSize: 17, padding: '10px 12px', width: '100%', boxSizing: 'border-box', border: `2px solid ${C.line}`, borderRadius: 10, marginBottom: 10 }} />
              )}
              {/* Two per row keeps a class of thirty on one or two screens instead of thirty. */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8, maxHeight: 320, overflowY: 'auto' }}>
                {activeStudents(roster)
                  .filter((st) => st.label.toLowerCase().includes(nameInput.trim().toLowerCase()))
                  .map((st) => (
                    <button key={st.id} type="button" onClick={() => startWithName(st.id)} disabled={busy} className="edu-press"
                      style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, borderRadius: 10, background: C.surface, border: `2px solid ${C.line}`, color: C.ink, cursor: 'pointer', height: 64, padding: '0 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, overflow: 'hidden', position: 'relative' }}>
                      {st.picture && <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', display: 'inline-flex' }}><StudentPicture name={st.picture} tint={st.tint} size={40} /></span>}
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'center', width: '100%', paddingLeft: st.picture ? 40 : 0, boxSizing: 'border-box' }}>{st.label}</span>
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
        <p style={{ color: C.muted, fontSize: 13, margin: '14px 0 0', textAlign: 'center' }}>Progress is saved on this device only. Nothing is sent anywhere.</p>
        <div className="edu-welcome-links" style={{ marginTop: 28, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <button type="button" onClick={() => { if (lastActive && Date.now() - lastActive < 5 * 60 * 1000) { setScreen('educator-pick'); return; } setPinInput(''); setScreen('educator-pin'); }} style={{ background: 'none', border: 'none', color: C.muted, fontFamily: FONT, fontSize: 14, cursor: 'pointer', padding: '8px 12px', textDecoration: 'underline' }}>Educator Login</button>
          {!educator && (
            <button type="button" onClick={() => { setNewPin(''); setNewPin2(''); setDeviceDraft(''); setStateDraft(''); setSetupError(''); setScreen('educator-setup'); }} style={{ background: 'none', border: 'none', color: C.muted, fontFamily: FONT, fontSize: 14, cursor: 'pointer', padding: '4px 12px', textDecoration: 'underline' }}>Create account</button>
          )}
          <ContactLine onOpen={() => setShowContact(true)} inline />
        </div>
        {showContact && <ContactPopup onClose={() => setShowContact(false)} />}
      </div></div>
    );
  }

  if (screen === 'overview') {
    const mastered = visibleModules.filter((m) => progress.masteredIds.includes(m.id)).length;
    return (
      <div style={page}><PageChrome idleWarning={idleWarning} /><div className="edu-wrap" style={wrap}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <h1 style={{ fontSize: 26, margin: '8px 0' }}>Your courses</h1>
          <button type="button" onClick={() => setScreen('welcome')} style={{ background: 'none', border: 'none', color: C.green, fontFamily: FONT, fontSize: 15, cursor: 'pointer' }}>Exit</button>
        </div>
        <p style={{ color: C.muted, marginTop: 0 }}>Hi {displayName}, welcome back!</p>
        {!youngLearner && (
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
                          <div key={m.id} style={{ ...card, marginBottom: 10, opacity: locked ? 0.6 : 1, borderColor: st === 'mastered' ? C.gold : st === 'available' ? C.green : C.line, borderWidth: isPreReader(course.id) && st === 'available' ? 3 : 1, boxShadow: isPreReader(course.id) && st === 'available' ? `0 0 0 4px ${C.greenSoft}` : 'none' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                              <div>
                                <h2 style={{ fontSize: 18, margin: '0 0 2px' }}>{m.title}</h2>
                                <p style={{ margin: 0, color: C.muted, fontSize: 15 }}>{m.tagline}</p>
                              </div>
                              {isPreReader(course.id) ? <StatusMark status={st} /> : <Tag tone={st}>{st === 'mastered' ? 'Mastered' : st === 'available' ? 'Ready' : 'Locked'}</Tag>}
                            </div>
                            {p.attempts > 0 && !isPreReader(course.id) && <p style={{ color: C.muted, fontSize: 14, margin: '10px 0 0' }}>Best score {p.bestCore} of {moduleRules(m.id).questions}</p>}
                            {locked ? (
                              !isPreReader(course.id) && <p style={{ color: C.muted, fontSize: 14, margin: '10px 0 0' }}>Finish the module before this one first.</p>
                            ) : (
                              <div style={{ marginTop: 12 }}><Btn halo={isPreReader(course.id) && st === 'available'} kind={st === 'mastered' ? 'secondary' : 'primary'} onClick={() => openModule(m.id)} disabled={busy}>{st === 'mastered' ? 'Practice again' : 'Open'}</Btn></div>
                            )}
                          </div>
                        ); return null; })()}
        {subjects.map((sub) => {
          const isOpen = openSubject === sub;
          const subCourses = visibleCourses.filter((c) => c.subject === sub).sort(byGradeOrder);
          const subModules = subCourses.flatMap((c) => c.modules);
          const done = subModules.filter((m) => progress.masteredIds.includes(m.id)).length;
          return (
            <div key={sub} style={{ ...card, padding: 0, overflow: 'visible', position: 'relative', borderColor: isOpen ? C.green : C.line }}>
              {/* A closed subject with something ready inside breathes gently, so a young child knows where to tap. */}
              <button type="button" onClick={() => setOpenSubject(isOpen ? null : sub)} aria-expanded={isOpen}
                className={youngLearner && !isOpen && openSubject === null && subModules.some((m) => statusOf(m.id) === 'available') ? 'edu-breathe' : undefined}
                style={{ fontFamily: FONT, width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 16, cursor: 'pointer', color: C.ink }}>
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
                      {subCourses.length > 1 && <p style={{ margin: '10px 0 2px', fontSize: 14, color: C.muted, paddingLeft: 4 }}>{course.title}</p>}
                      {course.modules.slice().sort((a, b) => a.order - b.order).map((m) => {
                        const st = statusOf(m.id);
                        const p = progress.perModule[m.id];
                        const locked = st === 'locked';
                        // Young learners see only what they can do now; locked work would only clutter the screen.
                        if (youngLearner && locked) return null;
                        if (isPreReader(course.id) && st === 'mastered' && !showFinished) return null;
                        return renderModuleCard(course, m, st, p, locked);
                      })}
                      {isPreReader(course.id) && course.modules.some((m) => statusOf(m.id) === 'mastered') && (
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
          <div style={{ ...card, background: C.goldSoft, borderColor: C.goldSoft, textAlign: 'center' }}>
            {/* A row of stars says how far they have come, without a number to read. */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
              {visibleModules.filter((m) => earlyModuleIds.includes(m.id)).map((m) => (
                <svg key={m.id} viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
                  <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" fill={progress.masteredIds.includes(m.id) ? C.gold : C.line} />
                </svg>
              ))}
            </div>
          </div>
        ) : (
          <Btn kind="secondary" full onClick={() => setScreen('my-progress')}>My progress</Btn>
        )}
        {saveNote && <p style={{ color: C.muted, fontSize: 13, textAlign: 'center' }}>{saveNote}</p>}
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
      <div style={page}><PageChrome idleWarning={idleWarning} /><div className="edu-wrap" style={wrap}>
        <button type="button" onClick={() => setScreen('overview')} aria-label="Back" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke={C.green} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <div key={lessonStep} className="edu-rise" style={{ ...card, textAlign: 'center', padding: '20px 18px' }}>
          <Picture visual={step.show} animate animKey={lessonStep} />
          <p style={{ fontSize: 22, lineHeight: 1.5, margin: '18px 0 0' }}>{line}</p>
        </div>
        {/* One tap repeats the line, in case they missed it. */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
          {canSpeak() ? (
            <button type="button" onClick={() => speak(line)} aria-label="Say it again" className="edu-press edu-sway"
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
              <span className="edu-halo" aria-hidden="true" style={{ position: 'absolute', inset: -6, borderRadius: 999, background: C.gold, pointerEvents: 'none' }} />
              <button type="button" onClick={startPractice} aria-label="Start practice" className="edu-press"
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
      <div style={page}><PageChrome idleWarning={idleWarning} /><div className="edu-wrap" style={wrap}>
        <button type="button" onClick={() => setScreen('overview')} style={{ background: 'none', border: 'none', color: C.green, fontFamily: FONT, fontSize: 15, cursor: 'pointer', padding: 0 }}>Back to overview</button>
        <p style={{ color: C.muted, margin: '12px 0 0', fontSize: 14 }}>Module {mod.order}</p>
        <h1 style={{ fontSize: 26, margin: '2px 0 14px' }}>{mod.title}</h1>
        <div style={card}>
          {mod.lesson.paragraphs.map((t, i) => <p key={i} style={{ fontSize: 17, margin: '0 0 14px' }}>{t}</p>)}
          <div style={{ background: C.greenSoft, borderRadius: 10, padding: 14 }}>
            <Picture visual={mod.lesson.example} />
            <p style={{ margin: '10px 0 0', fontSize: 15 }}>{mod.lesson.example.caption}</p>
          </div>
        </div>
        <div style={{ ...card, background: C.goldSoft, borderColor: C.goldSoft }}>
          <p style={{ margin: 0, fontWeight: 600 }}>Key idea</p>
          <p style={{ margin: '6px 0 0', fontSize: 16 }}>{mod.lesson.keyIdea}</p>
        </div>
        {course && course.readAloud && <SpeakButton full text={[...mod.lesson.paragraphs, mod.lesson.example.caption, mod.lesson.keyIdea].join(' ')} label="Read it to me" />}
        <Btn full onClick={startPractice}>Practice this</Btn>
        <p style={{ color: C.muted, fontSize: 13, marginTop: 16 }}>Source: {mod.sources.join(' ')}</p>
      </div></div>
    );
  }

  if (screen === 'practice' && q) {
    return (
      <div style={page}><PageChrome idleWarning={idleWarning} /><div className="edu-wrap" style={wrap}>
        <p style={{ color: C.muted, fontSize: 14, margin: '4px 0 6px' }}>
          {isReviewQ ? 'Quick review from an earlier module' : `${mod.title} · Question ${qIndex + 1} of ${attempt.core.length}`}
        </p>
        <div style={card}>
          {q.story && <p style={{ fontSize: 17, margin: '0 0 8px', color: C.muted }}>{q.story}</p>}
          <p style={{ fontSize: 20, fontWeight: 600, margin: '0 0 14px' }}>{q.prompt}</p>
          {q.visual && <div style={{ margin: '0 0 14px' }}><Picture visual={q.visual} /></div>}
          {readAloud && <SpeakButton text={questionText} label="Hear it again" />}
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
                  <button key={c} type="button" onClick={() => { if (!checked) setGiven(c); }}
                    style={{ opacity: ruledOut && !checked ? 0.45 : 1, fontFamily: FONT, fontSize: /^(\d+|[A-Za-z])$/.test(c) ? 34 : 18, textAlign: /^(\d+|[A-Za-z])$/.test(c) ? 'center' : 'left', padding: '12px 14px', borderRadius: 10, background: bg, border: `2px solid ${border}`, color: C.ink, cursor: checked ? 'default' : 'pointer', minHeight: 48 }}>
                    {/^dots:(\d+)$/.test(c) ? <DotGroup count={Number(c.split(':')[1])} size={28} /> : /^shape:/.test(c) ? <ShapePic name={c.slice(6)} size={64} /> : /^tens:(\d+)$/.test(c) ? <TensGroup count={Number(c.split(':')[1])} size={14} /> : /^bar:(\d+)$/.test(c) ? <BarPic length={Number(c.split(':')[1])} size={18} /> : /^tower:(\d+)$/.test(c) ? <BarPic length={Number(c.split(':')[1])} vertical size={14} /> : /^solid:/.test(c) ? <SolidPic name={c.slice(6)} size={64} /> : /^swatch:/.test(c) ? <Swatch colour={c.slice(7)} size={64} /> : /^item:/.test(c) ? <Item spec={c.slice(5)} size={64} /> : /^clock:/.test(c) ? <ClockPic hour={Number(c.split(':')[1])} minute={Number(c.split(':')[2])} size={80} /> : /^array:/.test(c) ? <ArrayPic rows={Number(c.slice(6).split('x')[0])} cols={Number(c.slice(6).split('x')[1])} size={12} /> : c}
                  </button>
                );
              })}
            </div>
          ) : q.type === 'trace' ? (
            <div>
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
          {checked && (
            <div key={cheer} className={wasCorrect ? 'edu-cheer' : 'edu-wobble'} style={{ position: 'relative', marginTop: 14, padding: 14, borderRadius: 10, background: wasCorrect ? C.greenSoft : C.claySoft }}>
              {wasCorrect && <StarBurst />}
              <p style={{ margin: 0, fontWeight: 600, color: wasCorrect ? C.green : C.clay }}>{wasCorrect ? 'Correct' : `Not quite. The answer is ${describeChoice(q.answer)}.`}</p>
              <p style={{ margin: '6px 0 0', fontSize: 15 }}>{q.explain}</p>
              {/* An explanation picture is either a set of fraction bars or one group of dots. */}
              {Array.isArray(q.explainVisual) && q.explainVisual.map((b, i) => <LabeledBar key={i} parts={b.parts} shaded={b.shaded} label={b.label} color={wasCorrect ? C.green : C.clay} />)}
              {q.explainVisual && !Array.isArray(q.explainVisual) && q.explainVisual.kind === 'dots' && <div style={{ marginTop: 8 }}><DotGroup count={q.explainVisual.count} size={28} animate animKey={cheer} /></div>}
            </div>
          )}
        </div>
        {/* A pre-reader who got it wrong tries again. Nobody moves on from a wrong answer. */}
        {checked && !wasCorrect && readAloud
          ? <Btn full halo={readAloud} onClick={tryAgain}>Try again</Btn>
          : checked
            ? <Btn full halo={readAloud} onClick={nextQuestion} disabled={busy}>{qIndex + 1 < questions.length ? 'Next question' : 'See results'}</Btn>
            : <Btn full halo={readAloud && given !== ''} onClick={checkCurrent} disabled={given === ''}>Check answer</Btn>}
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
      <div style={page}><PageChrome idleWarning={idleWarning} /><div className="edu-wrap" style={wrap}>
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
            <span className="edu-halo" aria-hidden="true" style={{ position: 'absolute', inset: -6, borderRadius: 999, background: mastered ? C.gold : C.green, pointerEvents: 'none' }} />
            <button type="button" onClick={goOn} disabled={busy} aria-label={mastered ? 'Keep going' : 'Go again'} className="edu-press"
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
      <div style={page}><PageChrome idleWarning={idleWarning} /><div className="edu-wrap" style={wrap}>
        <div style={{ ...card, borderColor: mastered ? C.gold : C.clay }}>
          <Tag tone={mastered ? 'mastered' : 'review'}>{mastered ? 'Mastered' : 'Keep practicing'}</Tag>
          <h1 style={{ fontSize: 24, margin: '12px 0 6px' }}>{mastered ? 'Great job!' : 'Good try!'}</h1>
          <p style={{ margin: '0 0 12px', fontSize: 17, lineHeight: 1.5 }}>{encouragementFor(record.events, mod.id, mastered)}</p>
          {(() => {
            const backTo = mastered ? null : loopBackTarget(record.events, mod.id);
            const rules = moduleRules(mod.id);
            if (backTo) {
              const b = getModule(backTo);
              return <p style={{ fontSize: 17, margin: '0 0 12px' }}>{lastEvent.coreCorrect} of {lastEvent.coreTotal} correct. This one has been tricky twice, so let us take a quick look back at {b.title.toLowerCase()} first. Getting that solid again usually makes this one click.</p>;
            }
            return <p style={{ fontSize: 17, margin: '0 0 12px' }}>{lastEvent.coreCorrect} of {lastEvent.coreTotal} correct. {mastered ? `Getting ${rules.toMaster} or more right shows you understand it.` : `You need ${rules.toMaster} of ${lastEvent.coreTotal}. Reading the lesson once more, then trying a fresh set of questions, usually does it.`}</p>;
          })()}
          <FractionBar parts={lastEvent.coreTotal} shaded={lastEvent.coreCorrect} color={mastered ? C.gold : C.clay} height={36} />
          {lastEvent.review && <p style={{ color: C.muted, fontSize: 14, margin: '12px 0 0' }}>Review question from earlier: {lastEvent.review.correct ? 'correct' : 'missed'} (does not affect mastery).</p>}
        </div>
        <div style={{ display: 'grid', gap: 10 }}>
          {FEATURES.reflection && !readAloud && mastered && nextWonder(record.events, mod.courseId, wonderReview) && <WonderButton onClick={() => { setWonder(nextWonder(record.events, mod.courseId, wonderReview)); setWonderText(''); setWonderPick(''); setWonderStartedAt(Date.now()); setScreen('wonder'); }}>Wonder for a minute</WonderButton>}
          {mastered && nextMod && <Btn full onClick={() => openModule(nextMod.id)} disabled={busy}>Next: {nextMod.title}</Btn>}
          {!mastered && loopBackTarget(record.events, mod.id) && <Btn full onClick={() => loopBack(mod.id, loopBackTarget(record.events, mod.id))} disabled={busy}>Look back at {getModule(loopBackTarget(record.events, mod.id)).title.toLowerCase()}</Btn>}
          {!mastered && !loopBackTarget(record.events, mod.id) && <Btn full onClick={() => setScreen('lesson')}>Review the lesson</Btn>}
          <Btn full kind="secondary" onClick={startPractice}>{mastered ? 'Practice this again' : 'Try a fresh set of questions'}</Btn>
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
      <div style={page}><PageChrome idleWarning={idleWarning} /><div className="edu-wrap" style={wrap}>
        <h1 className="edu-slide-in" style={{ fontSize: 30, margin: '8px 0 12px', textAlign: 'center', color: C.green }}>Let's Wonder!</h1>
        <div className="edu-rise" style={{ ...card, textAlign: 'center', padding: '22px 18px' }}>
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
      <div style={page}><PageChrome idleWarning={idleWarning} /><div className="edu-wrap" style={wrap}>
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
      <div style={page}><PageChrome idleWarning={idleWarning} /><div className="edu-wrap" style={wrap}>
        <h1 className="edu-slide-in" style={{ fontSize: 30, margin: '8px 0 4px', textAlign: 'center', color: C.green }}>Let's Wonder!</h1>
        <p style={{ color: C.muted, fontSize: 14, margin: '0 0 10px', textAlign: 'center' }}>No right answer</p>
        <div style={card}>
          <p style={{ fontSize: 20, fontWeight: 600, margin: '0 0 14px' }}>{wonder.prompt}</p>
          {readAloud && <SpeakButton text={wonder.prompt} label="Hear it again" />}
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
      <div style={page}><PageChrome idleWarning={idleWarning} /><div className="edu-wrap" style={wrap}>
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
    return (
      <div style={page}><PageChrome idleWarning={idleWarning} /><div className="edu-wrap" style={wrap}>
        <button type="button" onClick={() => setScreen('overview')} style={{ background: 'none', border: 'none', color: C.green, fontFamily: FONT, fontSize: 15, cursor: 'pointer', padding: 0 }}>Back to overview</button>
        <h1 style={{ fontSize: 26, margin: '12px 0 4px' }}>My progress</h1>
        <p style={{ color: C.muted, marginTop: 0 }}>{rep.learnerName}</p>
        <div style={card}>
          <p style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 600 }}>
            {rep.modulesMastered === 0 ? "You're just getting started." : rep.modulesMastered === rep.modulesTotal ? "You've mastered every part. Amazing." : `You've mastered ${rep.modulesMastered} of ${rep.modulesTotal} parts.`}
          </p>
          <FractionBar parts={rep.modulesTotal} shaded={rep.modulesMastered} color={C.gold} height={36} />
          <p style={{ margin: '10px 0 0', color: C.muted, fontSize: 15 }}>You have practiced {rep.totalAttempts} {rep.totalAttempts === 1 ? 'time' : 'times'}.</p>
        </div>
        {rep.modules.filter((m) => visibleModules.some((v) => v.id === m.id)).map((m) => {
          const st = statusOf(m.id);
          return (
            <div key={m.id} style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                <h2 style={{ fontSize: 18, margin: 0 }}>{m.title}</h2>
                <Tag tone={m.mastered ? 'mastered' : m.attempts ? 'review' : 'locked'}>{m.mastered ? 'Mastered' : m.attempts ? 'Keep going' : 'Not started'}</Tag>
              </div>
              <p style={{ margin: '8px 0 0', fontSize: 15, color: C.muted }}>
                {m.mastered ? 'You showed you understand this.' : m.attempts ? `Your best so far is ${m.bestScore}. You need ${CONFIG.MASTERY_MIN_CORRECT} to master it.` : st === 'locked' ? 'This one unlocks when you finish the module before it.' : 'This one is ready when you are.'}
              </p>
              {/* Straight into the module from here, so nobody has to go back and hunt for it. */}
              {st !== 'locked' && (
                <div style={{ marginTop: 10 }}>
                  <Btn kind={m.mastered ? 'secondary' : 'primary'} onClick={() => openModule(m.id)} disabled={busy}>{m.mastered ? 'Practice again' : 'Open module'}</Btn>
                </div>
              )}
            </div>
          );
        })}
        {rep.retention.asked > 0 && (
          <div style={{ ...card, background: C.greenSoft, borderColor: C.greenSoft }}>
            <p style={{ margin: 0, fontSize: 15 }}>{rep.retention.percent >= 80 ? 'When old questions come back, you remember them. That means your learning is sticking.' : 'Some older questions have been tricky when they came back. A quick look at those lessons again would help.'}</p>
          </div>
        )}
      </div></div>
    );
  }

  // ---------- Reviewing the Wonder questions before any child sees one ----------
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
      <div style={page}><PageChrome idleWarning={idleWarning} /><div className="edu-wrap" style={wrap}>
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
                      <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
                        <button type="button" onClick={() => setOpenApproved((list) => (list.includes(stage.id) ? list.filter((x) => x !== stage.id) : [...list, stage.id]))} aria-expanded={foldOpen}
                          style={{ fontFamily: FONT, width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 14, cursor: 'pointer', color: C.ink, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
        {saveNote && <p style={{ color: C.muted, fontSize: 13, textAlign: 'center' }}>{saveNote}</p>}

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
                <span style={{ fontSize: 13, color: C.muted }}>{wonderFirstSeen(reviewingQuestion)}</span>
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
                      style={{ fontFamily: FONT, width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '10px 0', cursor: 'pointer', color: C.green, fontSize: 15, fontWeight: 600, display: 'flex', justifyContent: 'space-between', gap: 10 }}>
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
      <div style={page}><PageChrome idleWarning={idleWarning} /><div className="edu-wrap" style={wrap}>
        <button type="button" onClick={() => setScreen('educator-pick')} style={linkBtn}>Back to Classroom</button>
        <h1 style={{ fontSize: 24, margin: '12px 0 4px' }}>Practical Life Skills</h1>
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
                      style={{ fontFamily: FONT, width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '16px 18px', cursor: 'pointer', color: light ? C.ink : '#fff' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 18, fontWeight: 600 }}>{done ? '✓ ' : ''}{sk.title}</span>
                        <span style={{ fontSize: 14, opacity: 0.8, whiteSpace: 'nowrap' }}>{open ? '▴' : '▾'}</span>
                      </div>
                    </button>
                    <div className="edu-collapsible" style={{ display: open ? 'block' : 'none', background: C.surface, padding: '14px 18px' }}>
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

        <p style={{ color: C.muted, fontSize: 13, marginTop: 14 }}>The order is a sequence rather than a schedule. Younger children start at the top, and there is no wrong moment to try one further down. Most of these are never really finished, which is why they are marked as covered rather than complete.</p>
        {saveNote && <p style={{ color: C.muted, fontSize: 13, textAlign: 'center' }}>{saveNote}</p>}
      </div></div>
    );
  }

  // ---------- The transcript: a printable record of work done, including courses no longer assigned ----------
  if (screen === 'transcript' && educatorRecord) {
    const student = findStudent(roster, educatorRecord.name);
    const who = student ? student.label : educatorRecord.name;
    const tr = buildTranscript(who, educatorRecord.events);
    const section = (title, list) => (
      <div style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 18, margin: '0 0 10px' }}>{title}</h2>
        {list.length === 0 && <p style={{ margin: 0, fontSize: 15, color: C.muted }}>Nothing to show here yet.</p>}
        {list.map((c) => (
          <div key={c.id} style={{ border: `1px solid ${C.line}`, borderRadius: 10, padding: 14, marginBottom: 10 }}>
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
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <tbody>
                {c.modules.map((m) => (
                  <tr key={m.id} style={{ borderTop: `1px solid ${C.line}` }}>
                    <td style={{ padding: '6px 0' }}>{m.title}</td>
                    <td style={{ padding: '6px 0', textAlign: 'right', color: C.muted, whiteSpace: 'nowrap' }}>
                      {m.mastered ? `Mastered ${fmtDate(m.masteredAt)}` : m.attempts ? 'In progress' : 'Not started'}
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
      <div style={page}><PageChrome idleWarning={idleWarning} /><div className="edu-wrap" style={wrap}>
        <div className="edu-no-print">
          <button type="button" onClick={() => setScreen('educator-report')} style={linkBtn}>Back to report</button>
        </div>
        <div style={{ margin: '12px 0 6px' }}><Logo width={180} /></div>
        <h1 style={{ fontSize: 24, margin: '10px 0 2px', textAlign: 'center' }}>Transcript</h1>
        <p style={{ margin: '0 0 18px', textAlign: 'center', color: C.muted, fontSize: 15 }}>{who} · issued {fmtDate(tr.generatedAt)}</p>

        {/* One explanation at the top, so the headings below can stand on their own. */}
        <div style={{ border: `1px solid ${C.line}`, borderRadius: 10, padding: 14, marginBottom: 18 }}>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6 }}>Every course is considered complete once every module within that course is mastered. All completions remain on this record indefinitely while currently assigned courses, which are not yet complete, can appear or disappear depending on whether or not they are actively assigned.</p>
        </div>

        {section('Completed courses', tr.completed)}
        {section('Courses in progress', tr.inProgress)}

        {tr.retention.asked > 0 && (
          <div style={{ border: `1px solid ${C.line}`, borderRadius: 10, padding: 14, marginBottom: 18 }}>
            <p style={{ margin: 0, fontSize: 15 }}>Memory checks from earlier modules: {tr.retention.correct} of {tr.retention.asked} answered correctly.</p>
          </div>
        )}

        <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{tr.note}</p>
        <p style={{ fontSize: 13, color: C.muted }}>Untouched courses are left off of this record for obvious reasons.</p>

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
      <div style={page}><PageChrome idleWarning={idleWarning} /><div className="edu-wrap" style={wrap}>
        <button type="button" onClick={() => setScreen('educator-pick')} style={linkBtn}>Back to Classroom</button>
        <h1 style={{ fontSize: 24, margin: '12px 0 8px' }}>Your state</h1>
        <p style={{ color: C.muted, marginTop: 0, fontSize: 15 }}>Each state publishes its own learning standards. Your reports show coverage against the standards that apply to you.</p>
        <div style={card}>
          <select value={stateDraft} onChange={(e) => setStateDraft(e.target.value)} aria-label="Your state"
            style={{ fontFamily: FONT, fontSize: 16, padding: '10px 12px', width: '100%', boxSizing: 'border-box', border: `2px solid ${C.line}`, borderRadius: 10, background: C.surface, marginBottom: 12 }}>
            {STATES.map((st) => <option key={st.code} value={st.code}>{st.name}</option>)}
          </select>
          <Btn full onClick={async () => { setStateCode(stateDraft); await saveStateCode(stateDraft); setScreen('educator-pick'); }}>Save</Btn>
        </div>
      </div></div>
    );
  }

  // ---------- Creating the educator account: PIN, device name and state, asked once ----------
  if (screen === 'educator-setup') {
    return (
      <div style={page}><PageChrome idleWarning={idleWarning} /><div className="edu-wrap" style={wrap}>
        <button type="button" onClick={() => setScreen('welcome')} style={{ background: 'none', border: 'none', color: C.green, fontFamily: FONT, fontSize: 15, cursor: 'pointer', padding: 0 }}>Back</button>
        <h1 style={{ fontSize: 24, margin: '12px 0 8px', textAlign: 'center' }}>Create your educator account</h1>
        <p style={{ color: C.muted, marginTop: 0, fontSize: 15, textAlign: 'center' }}>Credentials live on this device only. Nothing is sent anywhere.</p>
        <div style={card}>
          <p style={{ margin: '0 0 6px', fontWeight: 600, textAlign: 'center' }}>Choose a PIN</p>
          <p style={{ margin: '0 0 8px', fontSize: 14, color: C.muted, textAlign: 'center' }}>Four to six digits. It keeps students out of the educator pages; it is not a bank-grade lock. If it is ever forgotten, it can be reset from the sign-in screen without losing any student progress.</p>
          <input value={newPin} inputMode="numeric" autoComplete="off" onChange={(e) => setNewPin(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))} placeholder="PIN"
            style={{ fontFamily: FONT, fontSize: 18, padding: '12px 14px', width: '100%', boxSizing: 'border-box', border: `2px solid ${C.line}`, borderRadius: 10, marginBottom: 10 }} />
          <input value={newPin2} inputMode="numeric" autoComplete="off" onChange={(e) => setNewPin2(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))} placeholder="PIN again"
            style={{ fontFamily: FONT, fontSize: 18, padding: '12px 14px', width: '100%', boxSizing: 'border-box', border: `2px solid ${C.line}`, borderRadius: 10 }} />
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
      <div style={page}><PageChrome idleWarning={idleWarning} /><div className="edu-wrap" style={wrap}>
        <button type="button" onClick={() => setScreen('welcome')} style={{ background: 'none', border: 'none', color: C.green, fontFamily: FONT, fontSize: 15, cursor: 'pointer', padding: 0 }}>Back</button>
        <h1 style={{ fontSize: 24, margin: '12px 0 8px', textAlign: 'center' }}>Please log in to continue:</h1>
        <div style={card}>
          <p style={{ margin: '0 0 10px' }}>Enter your PIN.</p>
          <input value={pinInput} inputMode="numeric" autoComplete="off" onChange={(e) => setPinInput(e.target.value.replace(/[^0-9]/g, ''))} placeholder="PIN"
            onKeyDown={(e) => { if (e.key === 'Enter' && ok) setScreen('educator-pick'); }}
            style={{ fontFamily: FONT, fontSize: 18, padding: '12px 14px', width: '100%', boxSizing: 'border-box', border: `2px solid ${C.line}`, borderRadius: 10, marginBottom: 12 }} />
          <Btn full onClick={() => setScreen('educator-pick')} disabled={!ok}>Open</Btn>
          {!educator && <p style={{ margin: '12px 0 0', fontSize: 14, color: C.muted, textAlign: 'center' }}>No educator account on this device yet. <button type="button" onClick={() => { setNewPin(''); setNewPin2(''); setDeviceDraft(''); setStateDraft(''); setSetupError(''); setScreen('educator-setup'); }} style={{ ...linkBtn, fontSize: 14, padding: 0 }}>Create one</button></p>}
          {educator && !forgotPin && <p style={{ margin: '12px 0 0', fontSize: 14, color: C.muted }}><button type="button" onClick={() => setForgotPin(true)} style={{ ...linkBtn, fontSize: 14, padding: 0 }}>Forgot your PIN?</button></p>}
          {educator && forgotPin && (
            <div style={{ marginTop: 12, padding: 12, borderRadius: 10, background: C.goldSoft }}>
              <p style={{ margin: '0 0 10px', fontSize: 14 }}>To reset, choose a backup file of this classroom, or type the recovery code from the top of that file. Only this classroom's backups carry it, which is how we know it is you and not a student. Nothing else changes: every student, the device name and the state stay as they are. Resets are shown on the Classroom page.</p>
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
              <div style={{ display: 'flex', gap: 10 }}>
                <label style={{ display: 'inline-block' }}>
                  <span style={{ display: 'inline-block', fontFamily: FONT, fontSize: 16, fontWeight: 600, padding: '12px 18px', borderRadius: 10, background: C.green, color: '#fff', cursor: 'pointer' }}>Choose a backup file to reset</span>
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
                <Btn kind="secondary" onClick={() => setForgotPin(false)}>Cancel</Btn>
              </div>
            </div>
          )}
          {pinInput.length >= 4 && !ok && <p style={{ color: C.clay, fontSize: 14 }}>That PIN is not right.</p>}
        </div>
        <p style={{ color: C.muted, fontSize: 13, textAlign: 'center' }}>PIN numbers are easily reset. First, backup your classroom. Then, reset keys can be found within the backup file.</p>
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
      <div style={page}><PageChrome idleWarning={idleWarning} /><div className="edu-wrap" style={wrap}>
        {(() => {
          const days = daysSinceBackup(backupAt, new Date().toISOString());
          const overdue = visible.length > 0 && (days === null || days >= 1);
          return (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
              <button type="button" onClick={() => setScreen('welcome')} style={{ background: 'none', border: 'none', color: C.green, fontFamily: FONT, fontSize: 15, cursor: 'pointer', padding: 0 }}>Back</button>
              {/* Ends the session now, so the next person at a shared device meets the PIN screen. */}
              <button type="button" onClick={() => { setLastActive(0); setIdleWarning(false); closeTips(); setScreen('welcome'); }} style={{ background: 'none', border: 'none', color: C.muted, fontFamily: FONT, fontSize: 14, cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>Sign out</button>
            </div>
          );
        })()}
        <h1 style={{ fontSize: 24, margin: '12px 0 4px', textAlign: 'center' }}>My Classroom</h1>
        {educator && backupAt === null && (
          <p style={{ margin: '0 0 10px', fontSize: 14, color: C.clay }}>Make your first backup soon. A forgotten PIN can only be reset with a backup of this classroom.</p>
        )}
        {educator && (educator.resets || []).length > 0 && (
          <p style={{ margin: '0 0 10px', fontSize: 13, color: C.muted }}>PIN last reset {fmtDate((educator.resets || []).slice(-1)[0])}.</p>
        )}
        <p style={{ color: C.muted, marginTop: 0, fontSize: 15, textAlign: 'center' }}>
          Input student ID, add, then assign a nickname. Students will login by selecting their name to avoid typos.
          <button type="button" onClick={() => setShowRosterTip(!showRosterTip)} aria-label="More about nicknames"
            style={{ background: 'none', border: `1.5px solid ${C.green}`, color: C.green, fontFamily: FONT, fontSize: 12, fontWeight: 700, lineHeight: '15px', width: 18, height: 18, borderRadius: 999, cursor: 'pointer', padding: 0, marginLeft: 6, verticalAlign: 'middle' }}>i</button>
        </p>
        {showRosterTip && (
          <TipText>
            Early-years students are given a picture beside their nickname, so they can find themselves on the sign-in screen without reading.
            {stateCode && <>{' '}Reports measure against {stateFor(stateCode).name}'s standards ({FRAMEWORKS[frameworkForState(stateCode)].name}). <button type="button" onClick={() => { setStateDraft(stateCode); setScreen('change-state'); }} style={{ ...linkBtn, fontSize: 13, padding: 0 }}>Change state</button></>}
          </TipText>
        )}
        <div style={{ height: 10 }} />

        <Btn full onClick={() => { setAdding(true); setRosterError(''); setRosterInput(''); setNewLevel(''); setNewPicture(''); setNewTint(''); }}>Add someone new</Btn>
        <div style={{ height: 14 }} />
        {visible.length > 1 && (
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
              <Btn full kind="secondary" onClick={async () => {
                const students = [];
                for (const st of visible) { const r = await loadRecord(st.id); students.push({ id: st.id, label: st.label, events: r.events }); }
                setClassRows(classView(students, new Date().toISOString()));
                setScreen('class-view');
              }}>Who needs help</Btn>
            </div>
            <p style={{ margin: '6px 0 0', fontSize: 14, color: C.muted, textAlign: 'center' }}>Every student organized by most in need.</p>
          </div>
        )}
        {adding && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(36, 41, 31, 0.55)', zIndex: 100, overflowY: 'auto', padding: '24px 12px' }}>
            <div className="edu-rise" style={{ maxWidth: 560, margin: '0 auto', background: C.surface, borderRadius: 14, padding: 18, position: 'relative' }}>
              <button type="button" onClick={() => setAdding(false)} aria-label="Close"
                style={{ position: 'absolute', top: 8, right: 10, background: 'none', border: 'none', width: 36, height: 36, fontSize: 30, lineHeight: '34px', cursor: 'pointer', color: C.ink, fontFamily: FONT, padding: 0 }}>×</button>
              <p style={{ margin: '0 0 14px', fontWeight: 600, fontSize: 18 }}>Add someone new</p>

          <input value={rosterInput} onChange={(e) => setRosterInput(e.target.value)} placeholder="School-issued ID"
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
            const r = addStudent(roster, rosterInput, new Date().toISOString(), { level: newLevel, picture: newPicture, tint: newTint });
            await applyRoster(r.roster, r.error);
            if (!r.error) {
              // A new student starts with the recommended courses for their level, not every course there is.
              const id = normalizeStudentId(rosterInput);
              const rec = await loadRecord(id);
              if (!rec.events.some((e) => e.type === 'courses_enabled')) {
                const starter = makeCoursesEnabledEvent(recommendedCourseIds([makeCoursesEnabledEvent([], new Date().toISOString())], newLevel), new Date().toISOString());
                await saveRecord({ ...rec, events: [...rec.events, starter] });
              }
              setRosterInput(''); setNewLevel(''); setNewPicture(''); setNewTint(''); setAdding(false);
            }
          }}>Add</Btn>
          {rosterError && <p style={{ color: C.clay, fontSize: 14, margin: '10px 0 0' }}>{rosterError}</p>}
            </div>
          </div>
        )}

        {visible.length === 0 && <div style={card}><p style={{ margin: 0, color: C.muted }}>Nobody here yet. Add someone above.</p></div>}
        {visible.length > 0 && (
          <button type="button" onClick={() => setActiveOpen(!activeOpen)} aria-expanded={activeOpen}
            style={{ fontFamily: FONT, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, #D6E6DB 0%, #E6F0E8 100%)', border: '1px solid #C9DCCF', borderRadius: 12, padding: '14px 16px', marginBottom: 10, cursor: 'pointer', color: C.ink }}>
            <span style={{ fontSize: 18, fontWeight: 600 }}>Active Students</span>
            <span style={{ fontSize: 14, color: C.muted }}>{visible.length} {activeOpen ? '▴' : '▾'}</span>
          </button>
        )}
        {activeOpen && visible.map((st) => (
          <div key={st.id} style={card}>
            {renamingId === st.id ? (
              <>
                <input value={renameInput} onChange={(e) => setRenameInput(e.target.value)} placeholder="Name shown to the student"
                  style={{ fontFamily: FONT, fontSize: 17, padding: '10px 12px', width: '100%', boxSizing: 'border-box', border: `2px solid ${C.line}`, borderRadius: 10, marginBottom: 10 }} />
                <div style={{ display: 'flex', gap: 10 }}>
                  <Btn onClick={async () => { const r = renameStudent(roster, st.id, renameInput); await applyRoster(r.roster, r.error); if (!r.error) setRenamingId(null); }}>Save name</Btn>
                  <Btn kind="secondary" onClick={() => { setRenamingId(null); setRosterError(''); }}>Cancel</Btn>
                </div>
                <p style={{ color: C.muted, fontSize: 13, margin: '10px 0 0' }}>The ID stays the same, so progress follows the new name.</p>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {st.picture && <StudentPicture name={st.picture} tint={st.tint} size={40} />}
                    <span>
                      <span style={{ display: 'block', fontSize: 18, fontWeight: 600 }}>{st.label}</span>
                      {st.level && <span style={{ display: 'block', fontSize: 12, color: C.muted }}>{levelFor(st.level).title}</span>}
                    </span>
                  </span>
                  <span style={{ alignSelf: 'center', flexShrink: 0 }}><Btn kind="secondary" disabled={busy} onClick={async () => {
                    setBusy(true);
                    const rec = await loadRecord(st.id);
                    setEducatorRecord(rec);
                    setRecommendedIds(recommendedCourseIds(rec.events, st.level));
                    setOpenSubjects([]); setShowAllCourses(false); setConfirmReset(false); setBusy(false); setScreen('educator-report');
                  }}>Open report</Btn></span>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
                  <button type="button" onClick={() => { setRenamingId(st.id); setRenameInput(st.label); setRosterError(''); }} style={linkBtn}>Rename</button>
                  <button type="button" onClick={() => setPictureFor(pictureFor === st.id ? null : st.id)} style={linkBtn}>{st.picture ? 'Change picture' : 'Add picture'}</button>
                  <button type="button" onClick={() => applyRoster(setStudentActive(roster, st.id, false))} style={linkBtn}>Hide</button>
                  {mergeFrom === '' ? (
                    <button type="button" onClick={() => { setMergeFrom(st.id); setRosterError(''); }} style={linkBtn}>Merge into…</button>
                  ) : mergeFrom === st.id ? (
                    <button type="button" onClick={() => setMergeFrom('')} style={linkBtn}>Cancel merge</button>
                  ) : (
                    <button type="button" onClick={async () => {
                      const r = mergeStudents(roster, st.id, mergeFrom);
                      if (!r.error) {
                        const keep = await loadRecord(st.id); const gone = await loadRecord(mergeFrom);
                        await saveRecord({ ...keep, events: mergeEventLogs(keep.events, gone.events) });
                      }
                      await applyRoster(r.roster, r.error);
                      setMergeFrom('');
                    }} style={{ ...linkBtn, color: C.gold }}>Merge here</button>
                  )}
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

        {hidden.length > 0 && (
          <button type="button" onClick={() => setHiddenOpen(!hiddenOpen)} aria-expanded={hiddenOpen}
            style={{ fontFamily: FONT, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: C.surface, border: `1px solid ${C.line}`, borderRadius: 12, padding: '14px 16px', marginBottom: 10, cursor: 'pointer', color: C.ink }}>
            <span style={{ fontSize: 18, fontWeight: 600 }}>Inactive Students ({hidden.length})</span>
            <span style={{ fontSize: 14, color: C.green, textDecoration: 'underline' }}>{hiddenOpen ? 'hide' : 'show'}</span>
          </button>
        )}
        {hidden.length > 0 && hiddenOpen && (
          <div style={card}>
            {hidden.map((st) => (
              <div key={st.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, padding: '6px 0' }}>
                <span style={{ color: C.muted }}>{st.label}{st.mergedInto ? ` (merged into ${(findStudent(roster, st.mergedInto) || { label: st.mergedInto }).label})` : ''}</span>
                {!st.mergedInto && <button type="button" onClick={() => applyRoster(setStudentActive(roster, st.id, true))} style={linkBtn}>Show again</button>}
              </div>
            ))}
            <p style={{ color: C.muted, fontSize: 13, margin: '8px 0 0' }}>Inactive students are those you've chosen to hide. All student progress is retained but they are hidden from the login screen.</p>
          </div>
        )}
        {FEATURES.reflection && (
          <div style={{ ...card, marginTop: 22, background: wonderAwaitingReview(wonderReview) > 0 ? C.goldSoft : C.greenSoft, borderColor: wonderAwaitingReview(wonderReview) > 0 ? C.goldSoft : C.greenSoft }}>
            <p style={{ margin: '0 0 6px', fontWeight: 600, textAlign: 'center' }}>Wonder Questions</p>
            <p style={{ margin: '0 0 10px', fontSize: 15, textAlign: 'center' }}>{wonderAwaitingReview(wonderReview) > 0 ? `${wonderAwaitingReview(wonderReview)} to review. These optional reflection questions remain invisible until approved.` : 'All reviewed. Only the ones you approved are shown to students.'}</p>
            <Btn full kind="secondary" onClick={() => setScreen('wonder-review')}>Wonder Questions</Btn>
          </div>
        )}
        {FEATURES.lifeSkills && (
          <div style={{ ...card, background: C.greenSoft, borderColor: C.greenSoft }}>
            <p style={{ margin: '0 0 6px', fontWeight: 600, textAlign: 'center' }}>Practical Life Skills</p>
            <p style={{ margin: '0 0 10px', fontSize: 15, textAlign: 'center' }}>Ideas for the hours the academic work gives back, listed from the earliest skills to the most mature.</p>
            <Btn full kind="secondary" onClick={() => setScreen('life-skills')}>Life Skills</Btn>
          </div>
        )}
        {saveNote && <p style={{ color: C.muted, fontSize: 13, textAlign: 'center' }}>{saveNote}</p>}
        {(() => {
          const days = daysSinceBackup(backupAt, new Date().toISOString());
          const overdue = visible.length > 0 && (days === null || days >= 1);
          return (
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              {/* The halo pulses behind the link while a backup is due, and rests once one has been taken today. */}
              <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <button type="button" onClick={() => setScreen('backup')} className={overdue ? 'edu-glow' : undefined} style={{ position: 'relative', background: 'none', border: 'none', color: C.green, fontFamily: FONT, fontSize: 16, fontWeight: 600, cursor: 'pointer', padding: '8px 12px', textDecoration: 'underline' }}>Backup classroom</button>
                <button type="button" onClick={() => setShowBackupTip(!showBackupTip)} aria-label="About backups"
                  style={{ position: 'relative', background: 'none', border: `1.5px solid ${C.green}`, color: C.green, fontFamily: FONT, fontSize: 12, fontWeight: 700, lineHeight: '15px', width: 18, height: 18, borderRadius: 999, cursor: 'pointer', padding: 0 }}>i</button>
              </span>
              {showBackupTip && (
                <p style={{ ...tipStyle, textAlign: 'left' }}>We recommend backing up at the end of each day. Since all student data lives on this device (rather than in a cloud) the ability to restore progress after a browser's cache is cleared becomes paramount. This backup creates a file that holds all student progression, educator settings, life skill progress etc. Share it to your email, drive folder or any place that can be accessed if and when your device becomes compromised. Backup files allow you to restore everything with ease!</p>
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
      <div style={page}><PageChrome idleWarning={idleWarning} /><div className="edu-wrap" style={wrap}>
        <button type="button" onClick={() => setScreen('educator-pick')} style={linkBtn}>Back to Classroom</button>
        <h1 style={{ fontSize: 24, margin: '12px 0 4px' }}>Who needs help</h1>
        <div style={{ ...card, background: C.greenSoft, borderColor: C.greenSoft }}>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6 }}>{classSummary(classRows)}</p>
        </div>
        {classRows.map((r) => {
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
              <p style={{ margin: '8px 0 0', fontSize: 15 }}>
                {r.reasons.length ? r.reasons.join('. ').replace(/^./, (c) => c.toUpperCase()) + '.' : 'Nothing to flag.'}
                {' '}{r.total ? `${r.mastered} of ${r.total} modules mastered.` : 'No courses assigned.'}
                {r.next ? ` Next up: ${r.next}.` : ''}
              </p>
              <div style={{ marginTop: 8 }}>
                <button type="button" style={linkBtn} onClick={async () => {
                  setBusy(true);
                  const rec = await loadRecord(r.id);
                  setEducatorRecord(rec); setRecommendedIds(recommendedCourseIds(rec.events, st ? st.level : null));
                  setOpenSubjects([]); setShowAllCourses(false); setConfirmReset(false); setBusy(false); setScreen('educator-report');
                }}>Open report</button>
              </div>
            </div>
          );
        })}
        <p style={{ fontSize: 13, color: C.muted }}>Order is chosen by student metrics. Stuck on a module? Frequent loop backs? Guessing or low confidence? To the top for you.</p>
      </div></div>
    );
  }

  // ---------- Backup: the whole classroom in one file, nothing sent anywhere ----------
  if (screen === 'backup') {
    const days = daysSinceBackup(backupAt, new Date().toISOString());
    const activeCount = roster.students.filter((st) => st.active).length;
    const canShare = typeof navigator !== 'undefined' && !!navigator.share && !!navigator.canShare;
    const makeFile = async () => {
      const everything = await gatherEverything(roster);
      const at = new Date().toISOString();
      const text = JSON.stringify(buildBackup({ ...everything, deviceName, recovery: educator ? educator.recovery : null }, at), null, 2);
      return { at, name: backupFileName(deviceName, activeCount, at), text };
    };
    const markDone = async (at, note) => { setBackupAt(at); await saveBackupAt(at); setBackupNote(note); };
    return (
      <div style={page}><PageChrome idleWarning={idleWarning} /><div className="edu-wrap" style={wrap}>
        <button type="button" onClick={() => setScreen('educator-pick')} style={linkBtn}>Back to Classroom</button>
        <h1 style={{ fontSize: 24, margin: '12px 0 4px' }}>Backup classroom</h1>
        <p style={{ color: C.muted, marginTop: 0, fontSize: 15 }}>
          {days === null ? 'This classroom has never been backed up.' : days === 0 ? 'Backed up today.' : `Last backed up ${days} ${days === 1 ? 'day' : 'days'} ago.`}
          {' '}Backups save all student progress and allow for restoration on any device at a later time. Regular backups are highly recommended. While some devices allow for automatic backups on a per module basis, others require manual backups.
        </p>
        <div style={{ height: 20 }} />

        {educator && educator.recovery && (
          <div style={{ ...card, background: C.greenSoft, borderColor: C.greenSoft }}>
            <p style={{ margin: '0 0 4px', fontWeight: 600 }}>Recovery code</p>
            <p style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 700, letterSpacing: 1 }}>{educator.recovery}</p>
            <p style={{ margin: 0, fontSize: 14, color: C.muted }}>It is written at the top of every backup file. If the PIN is ever forgotten, choose a backup file on the sign-in screen or type this code. Keep it where students cannot see it.</p>
          </div>
        )}
        <div style={card}>
          <p style={{ margin: '0 0 6px', fontWeight: 600 }}>This device's name</p>
          <p style={{ margin: '0 0 8px', fontSize: 14, color: C.muted }}>Device name goes into the file name so a classroom of ten devices reads at a glance.</p>
          <input value={deviceName} onChange={(e) => setDeviceName(e.target.value)} onBlur={() => saveDeviceName(deviceName)} placeholder="Example: iPad 3, Chromebook"
            style={{ fontFamily: FONT, fontSize: 16, padding: '10px 12px', width: '100%', boxSizing: 'border-box', border: `2px solid ${C.line}`, borderRadius: 10 }} />
          <p style={{ margin: '8px 0 0', fontSize: 13, color: C.muted }}>Example file name: {backupFileName(deviceName || 'chromebook', activeCount || 2, new Date().toISOString())}</p>
        </div>

        <div style={card}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {/* On an iPad or a phone, Share opens the device's own sheet, where Mail is one tap away. */}
            {canShare && (
              <Btn onClick={async () => {
                const f = await makeFile();
                const file = new File([f.text], f.name, { type: 'application/json' });
                if (!navigator.canShare({ files: [file] })) { setBackupNote('Sharing files is not available here. Use Download instead.'); return; }
                try { await navigator.share({ files: [file], title: 'EduSphere backup' }); await markDone(f.at, 'Shared. Wherever you sent it is now your backup.'); }
                catch (err) { setBackupNote('Sharing was canceled.'); }
              }}>Share backup</Btn>
            )}
            <Btn kind={canShare ? 'secondary' : 'primary'} onClick={async () => {
              const f = await makeFile();
              if (downloadFile(f.name, f.text)) await markDone(f.at, 'Backup downloaded. Keep it somewhere safe, such as your email.');
              else setBackupNote('Downloads are not available here.');
            }}>Download backup</Btn>
          </div>
          {backupNote && <p style={{ margin: '10px 0 0', fontSize: 14, color: C.muted }}>{backupNote}</p>}
        </div>

        {canAutoSave() && (
          <div style={card}>
            <p style={{ margin: '0 0 6px', fontWeight: 600 }}>Touchless backup
              <button type="button" onClick={() => setShowTouchlessTip(!showTouchlessTip)} aria-label="Touchless backup exceptions"
                style={{ background: 'none', border: `1.5px solid ${C.green}`, color: C.green, fontFamily: FONT, fontSize: 12, fontWeight: 700, lineHeight: '15px', width: 18, height: 18, borderRadius: 999, cursor: 'pointer', padding: 0, marginLeft: 8, verticalAlign: 'middle' }}>i</button>
            </p>
            {showTouchlessTip && <TipText>Touchless Backups only work with Chrome or Edge (laptop or PC). It does not work on iPads or in Safari as these options prevent pages from writing files. If you are using an iPad or Safari, you must manually backup your classroom then share or download the file yourself.</TipText>}
            <p style={{ margin: '0 0 10px', fontSize: 14, color: C.muted }}>Choose a file location once (ideally a shared folder) and this device will rewrite it after every finished practice round. One file, always current, nothing to remember.</p>
            {autoSaving
              ? <p style={{ margin: 0, fontSize: 15, color: C.green, fontWeight: 600 }}>On. The file updates itself after every round.</p>
              : <Btn kind="secondary" onClick={async () => { if (await chooseAutoSaveFile(backupFileName(deviceName, activeCount, new Date().toISOString()))) { setAutoSaving(true); const f = await makeFile(); if (await writeAutoSave(f.text)) await markDone(f.at, 'Touchless backup is on and the first copy is written.'); } }}>Choose the file</Btn>}
          </div>
        )}

        <div style={card}>
          <p style={{ margin: '0 0 6px', fontWeight: 600 }}>Restore from backup</p>
          <p style={{ margin: '0 0 10px', fontSize: 14, color: C.muted }}>Restoring <strong>adds</strong> student metrics to whatever currently lives on this device. Students are matched by ID and histories are then merged. Nothing on this device is ever removed.</p>
          <label style={{ display: 'inline-block' }}>
            <span style={{ display: 'inline-block', fontFamily: FONT, fontSize: 16, fontWeight: 600, padding: '12px 18px', borderRadius: 10, border: `2px solid ${C.green}`, color: C.green, cursor: 'pointer' }}>Choose a backup file</span>
            <input type="file" accept="application/json,.json" style={{ display: 'none' }} onChange={async (e) => {
              const f = e.target.files && e.target.files[0];
              if (!f) return;
              try {
                const data = JSON.parse(await f.text());
                const problem = checkBackup(data);
                if (problem) { setBackupNote(problem); return; }
                const merged = mergeBackup(await gatherEverything(roster), data);
                for (const r of merged.records) await saveRecord(r);
                await saveRoster(merged.roster); await saveWonderReview(merged.wonderReview); await saveCovered(merged.covered);
                setRoster(merged.roster); setWonderReview(merged.wonderReview); setCovered(merged.covered);
                const from = data.deviceName ? ` from ${data.deviceName}` : '';
                setBackupNote(`Restored${from}. ${merged.addedStudents} ${merged.addedStudents === 1 ? 'student' : 'students'} added and every history joined. Nothing already here was lost.`);
              } catch (err) { setBackupNote('That file could not be read.'); }
              e.target.value = '';
            }} />
          </label>
        </div>
        <p style={{ fontSize: 13, color: C.muted }}>We send nothing anywhere. You choose where the file goes. Choose wisely.</p>
      </div></div>
    );
  }

  // ---------- One student's report: summary, what's assigned, course switches, progress, resets ----------
  if (screen === 'educator-report' && educatorRecord) {
    const student = findStudent(roster, educatorRecord.name);
    const shownName = student ? student.label : educatorRecord.name;
    const rep = buildReport(shownName, educatorRecord.events);
    const enabled = rep.enabledCourseIds;

    // Writes one event onto this student's log and keeps the screen in step.
    const addToStudent = async (event) => {
      const next = { ...educatorRecord, events: [...educatorRecord.events, event] };
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
      <div style={page}><PageChrome idleWarning={idleWarning} /><div className="edu-wrap" style={wrap}>
        <button type="button" onClick={() => setScreen('educator-pick')} style={linkBtn}>Back to Classroom</button>
        <h1 style={{ fontSize: 26, margin: '10px 0 2px' }}>{shownName}</h1>
        <p style={{ color: C.muted, marginTop: 0, fontSize: 14 }}>Report generated {fmtDate(rep.generatedAt)}</p>

        {/* The summary a parent or principal can read without decoding anything: a list, then sentences */}
        {(() => {
          const parts = summaryParts(rep);
          return (
            <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
              <button type="button" onClick={() => setOpenSummary(!openSummary)} aria-expanded={openSummary}
                style={{ fontFamily: FONT, width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 16, cursor: 'pointer', color: C.ink, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 17, fontWeight: 600 }}>Summary</span><span style={{ color: C.muted }}>{openSummary ? '▴' : '▾'}</span>
              </button>
              {openSummary && (
                <div style={{ padding: '0 16px 16px' }}>
                  <p style={{ margin: '0 0 6px', fontSize: 16, lineHeight: 1.6 }}>{parts.lead}</p>
                  {parts.items.length > 0 && <ul style={{ margin: '0 0 10px', padding: '10px 12px 10px 32px', listStyleType: 'disc', fontSize: 15, lineHeight: 1.7, borderRadius: 10, background: 'linear-gradient(135deg, #EAF2EC 0%, #F5F9F5 100%)', border: '1px solid #DCE8DF' }}>{parts.items.map((it) => <li key={it} style={{ display: 'list-item' }}>{it}</li>)}</ul>}
                  {parts.rest && <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6 }}>{parts.rest}</p>}
                </div>
              )}
            </div>
          );
        })()}

        {/* Choose what this student works on. Recommended first, everything else tucked away. */}
        <div style={{ ...card, background: C.greenSoft, borderColor: C.greenSoft }}>
          <p style={{ margin: '0 0 4px', fontWeight: 600 }}>Assigned Now</p>
          <p style={{ margin: '0 0 10px', fontSize: 14, color: C.muted }}>Assign courses by checking or unchecking the boxes below. Each student starts with the courses we recommend (based on a combination of {shownName}'s initial placement check and/or his or her progression through the modules) but you are free to edit how you see fit.</p>
          {COURSES.filter((c) => recommended.includes(c.id)).length === 0 && (
            <p style={{ margin: '0 0 8px', fontSize: 15, color: C.muted }}>Nothing is written yet for this student's level. Anything below can still be assigned.</p>
          )}
          {COURSES.filter((c) => recommended.includes(c.id)).sort(byGradeOrder).map((c) => (
            <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', fontSize: 16 }}>
              <input type="checkbox" checked={enabled.includes(c.id)} onChange={() => setEnabled(enabled.includes(c.id) ? enabled.filter((id) => id !== c.id) : [...enabled, c.id])} />
              <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}><span>{courseLabel(c)}</span>{courseNeedsTouch(c.id) && <Tag tone="review">Needs a touch screen</Tag>}</span>
            </label>
          ))}
          <button type="button" style={{ ...linkBtn, marginTop: 6 }} onClick={() => setShowAllCourses(!showAllCourses)}>
            {showAllCourses ? 'Hide other courses' : `Show other courses (${COURSES.length - recommended.length})`}
          </button>
          {showAllCourses && (
            <div style={{ borderTop: `1px solid ${C.line}`, marginTop: 8, paddingTop: 8 }}>
              <p style={{ margin: '0 0 4px', fontWeight: 600 }}>Optional courses</p>
              <p style={{ margin: '0 0 8px', fontSize: 14, color: C.muted }}>Select any course you would like to include for {shownName}.</p>
              {COURSES.filter((c) => !recommended.includes(c.id)).sort(byGradeOrder).map((c) => (
                <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', fontSize: 16 }}>
                  <input type="checkbox" checked={enabled.includes(c.id)} onChange={() => setEnabled(enabled.includes(c.id) ? enabled.filter((id) => id !== c.id) : [...enabled, c.id])} />
                  <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}><span>{courseLabel(c)}</span>{courseNeedsTouch(c.id) && <Tag tone="review">Needs a touch screen</Tag>}</span>
                </label>
              ))}
            </div>
          )}
          <p style={{ margin: '10px 0 0', fontSize: 13, color: C.muted }}>Switching a course off hides it from the student. Their progress is kept.</p>
        </div>

        {/* Progress by course, all of it behind one dropdown so the transcript is not pushed out of sight. */}
        <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '14px 16px' }}>
            <span style={{ fontSize: 17, fontWeight: 600, display: 'inline-flex', alignItems: 'center' }}>Progress by course<InfoButton onClick={() => setShowProgressTip(!showProgressTip)} label="About progress by course" open={showProgressTip} /></span>
            <button type="button" onClick={() => setOpenProgress(!openProgress)} aria-expanded={openProgress} aria-label="Progress by course"
              style={{ fontFamily: FONT, flex: 1, textAlign: 'right', background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: C.muted, fontSize: 16 }}>{openProgress ? '▴' : '▾'}</button>
          </div>
          {showProgressTip && <div style={{ padding: '0 16px' }}><TipText>This section shows progression through the assigned courses only. Each course opens to show every module, whether it is mastered, and how confident the work looks.</TipText></div>}
        </div>
        {openProgress && assigned.map((course) => {
          const open = openSubjects.includes(course.id);
          const rows = rep.modules.filter((m) => m.courseId === course.id);
          const done = rows.filter((m) => m.mastered).length;
          return (
            <div key={course.id} style={{ ...card, padding: 0, overflow: 'hidden' }}>
              <button type="button" onClick={() => toggleSubjectPanel(course.id)} aria-expanded={open}
                style={{ fontFamily: FONT, width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 16, cursor: 'pointer', color: C.ink }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                  <span>
                    <span style={{ display: 'block', fontSize: 17, fontWeight: 600 }}>{course.title}</span>
                    <span style={{ display: 'block', fontSize: 13, fontWeight: 400, color: C.muted, marginTop: 2 }}>{gradeShort(course.grade)} - {course.subject}</span>
                  </span>
                  <span style={{ fontSize: 14, color: C.muted, whiteSpace: 'nowrap' }}>{done} of {rows.length} {open ? '▴' : '▾'}</span>
                </div>
              </button>
              <div className="edu-collapsible" style={{ padding: '0 16px 14px', display: open ? 'block' : 'none' }}>
                  {rows.map((m) => {
                    const state = m.mastered ? 'Mastered' : m.attempts ? 'In progress' : 'Not started';
                    return (
                      <div key={m.id} style={{ borderTop: `1px solid ${C.line}`, paddingTop: 10, marginTop: 10 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 16, fontWeight: 600 }}>{m.title}</span>
                          <Tag tone={m.mastered ? 'mastered' : m.attempts ? 'review' : 'locked'}>{state}</Tag>
                        </div>
                        {/* The story of this module opens over the page, so a long report never sprawls. */}
                        <button type="button" style={linkBtn} onClick={() => setStoryModule(m.id)}>View progress for this module</button>
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
          <p style={{ margin: '0 0 6px', fontWeight: 600 }}>Transcript</p>
          <p style={{ margin: '0 0 10px', fontSize: 15 }}>A printable record of everything {shownName} has ever worked on, including courses that are no longer assigned. This is the clearest view of student progression.</p>
          <Btn kind="secondary" onClick={() => setScreen('transcript')}>Open transcript</Btn>
        </div>

        {/* Plain-language explanations, written for someone who does not work in tech */}
        <div style={{ ...card, background: 'linear-gradient(135deg, #D6E6DB 0%, #E6F0E8 100%)', borderColor: '#C9DCCF' }}>
          <p style={{ margin: '0 0 8px', fontWeight: 600 }}>Key Words - Explained</p>
          {EXPLANATIONS.map((x, i) => {
            const open = openTerms.includes(x.term);
            return (
              <div key={x.term} style={{ borderTop: i === 0 ? 'none' : '1px solid rgba(58, 107, 88, 0.18)' }}>
                <button type="button" onClick={() => setOpenTerms((list) => (list.includes(x.term) ? list.filter((t) => t !== x.term) : [...list, x.term]))} aria-expanded={open}
                  style={{ fontFamily: FONT, width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '6px 0', cursor: 'pointer', color: C.ink, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: 15 }}>{x.term}</span><span style={{ color: C.muted }}>{open ? '▴' : '▾'}</span>
                </button>
                {open && <p style={{ margin: '0 0 6px', fontSize: 15 }}>{x.plain}</p>}
              </div>
            );
          })}
          <p style={{ margin: '4px 0 0', fontSize: 14, color: C.muted }}>We never store a numerical student score. We store, one line at a time, what happened. These ground truths are recounted each time you open this page.</p>
        </div>

        <details style={{ marginBottom: 14 }}>
          <summary style={{ cursor: 'pointer', color: C.green, fontWeight: 600 }}>Raw data</summary>
          <p style={{ fontSize: 14, color: C.muted, margin: '8px 0' }}>Every line below records one thing that happened, in the order it happened. Lines are only ever added. Because nothing is changed or removed, any report from any date can be reproduced exactly as it was.</p>
          <textarea readOnly value={JSON.stringify(activeEvents(educatorRecord.events), null, 2)} style={{ width: '100%', boxSizing: 'border-box', height: 220, fontSize: 12, borderRadius: 10, border: `1px solid ${C.line}`, padding: 10 }} />
        </details>

        {confirmReset ? (
          <div style={{ ...card, borderColor: C.clay }}>
            <p style={{ margin: '0 0 10px' }}>Start {shownName} over in every subject? The record is kept, but nothing will count as mastered.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <Btn onClick={async () => { await addToStudent(makeResetEvent(new Date().toISOString())); setConfirmReset(false); }} disabled={busy}>Yes, reset all progress</Btn>
              <Btn kind="secondary" onClick={() => setConfirmReset(false)}>Cancel</Btn>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}><Btn kind="secondary" onClick={() => setConfirmReset(true)}>Reset all progress</Btn></div>
        )}
        {saveNote && <p style={{ color: C.muted, fontSize: 13, textAlign: 'center' }}>{saveNote}</p>}
      </div></div>
    );
  }

  return <div style={page}><PageChrome idleWarning={idleWarning} /><div className="edu-wrap" style={wrap}><p>Something went wrong. <Btn kind="secondary" onClick={() => setScreen('overview')}>Back to overview</Btn></p></div></div>;
}
