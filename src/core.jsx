// Kern der Motion-Engine: Alles hängt an EINEM Framer-Motion-Wert `t` (Sekunden).
// Dadurch lässt sich jedes Video Frame für Frame exakt rendern und lippensynchron zur Stimme halten.
import { createContext, useContext } from 'react'
import { motion, useTransform, cubicBezier } from 'framer-motion'

export const TimeCtx = createContext(null)
export const VideoCtx = createContext(null)
export const useT = () => useContext(TimeCtx)
export const useVideo = () => useContext(VideoCtx)
export const useSegs = () => useContext(VideoCtx).segs

export const EASE = {
  out: cubicBezier(0.16, 1, 0.3, 1),
  inOut: cubicBezier(0.65, 0, 0.35, 1),
  back: cubicBezier(0.34, 1.7, 0.64, 1),
  in: cubicBezier(0.5, 0, 0.75, 0),
  lin: (x) => x,
}
/** Zeitpunkt, an dem ein bestimmtes Wort gesprochen wird (n = n-tes Vorkommen) */
export const wt = (seg, prefix, n = 0) => {
  const ws = seg.words.filter((w) => w.w.toLowerCase().replace(/^[^\wäöü0-9]+/, '').startsWith(prefix.toLowerCase()))
  return (ws[n] || ws[0] || { t: seg.start }).t
}
export const cl = (x) => (x < 0 ? 0 : x > 1 ? 1 : x)
export const prog = (t, at, dur, ease = EASE.out) => ease(cl((t - at) / dur))
export const mix = (a, b, p) => a + (b - a) * p

export const C = {
  bg: '#06060B', ink: '#F5F5F7', mute: '#8B8BA3', line: 'rgba(255,255,255,0.09)',
  card: 'rgba(255,255,255,0.055)', violet: '#7C5CFF', cyan: '#2EE6D6', lime: '#C6FF3D',
  coral: '#FF5C7A', amber: '#FFB547', green: '#3DFF9A',
}

/** Abgeleiteter Motion-Wert aus t */
export const useF = (fn) => useTransform(useT(), fn)

/**
 * <E> – universelles Ein-/Ausblend-Element.
 * from: Startzustand (y, x, scale, rotate, blur), out: Zeitpunkt fürs Ausblenden.
 */
export function E({ at = 0, out = Infinity, dur = 0.6, outDur = 0.35, from = { y: 36 }, to = {},
  ease = EASE.out, children, style, className, as = 'div', ...rest }) {
  const t = useT()
  const pi = (v) => ease(cl((v - at) / dur))
  const po = (v) => EASE.inOut(cl((v - out) / outDur))
  const opacity = useTransform(t, (v) => cl(pi(v) * 1.6) * (1 - po(v)))
  const y = useTransform(t, (v) => (from.y ?? 0) * (1 - pi(v)) + (to.y ?? -18) * po(v))
  const x = useTransform(t, (v) => (from.x ?? 0) * (1 - pi(v)) + (to.x ?? 0) * po(v))
  const scale = useTransform(t, (v) => mix(from.scale ?? 1, 1, pi(v)) * mix(1, to.scale ?? 0.96, po(v)))
  const rotate = useTransform(t, (v) => (from.rotate ?? 0) * (1 - pi(v)))
  const filter = useTransform(t, (v) => {
    const b = (from.blur ?? 6) * (1 - cl((v - at) / dur)) + 6 * po(v)
    return b > 0.05 ? `blur(${b.toFixed(2)}px)` : 'none'
  })
  const visibility = useTransform(t, (v) => (v < at - 0.01 || v > out + outDur + 0.01 ? 'hidden' : 'visible'))
  const M = motion[as]
  return (
    <M className={className} style={{ ...style, opacity, y, x, scale, rotate, filter, visibility }} {...rest}>
      {children}
    </M>
  )
}

/** Sichtbarkeitsfenster ohne Animation (für Container) */
export function Win({ at, out = Infinity, children, style }) {
  const visibility = useF((v) => (v >= at && v <= out ? 'visible' : 'hidden'))
  return <motion.div style={{ position: 'absolute', inset: 0, ...style, visibility }}>{children}</motion.div>
}

/** Szene: komplette Ebene mit Ein-/Ausblende */
export function Scene({ at, out = Infinity, children, style, from = { scale: 1.06, blur: 10, y: 0 } }) {
  return (
    <E at={at} out={out} dur={0.55} from={from} to={{ y: -30, scale: 0.94 }} outDur={0.4}
      style={{ position: 'absolute', inset: 0, ...style }}>
      {children}
    </E>
  )
}

/** Schreibmaschinen-Text */
export function Type({ at, text, cps = 28, cursor = true, style }) {
  const t = useT()
  const shown = useTransform(t, (v) => text.slice(0, Math.max(0, Math.floor((v - at) * cps))))
  const caretO = useTransform(t, (v) => {
    const done = (v - at) * cps >= text.length
    return v < at ? 0 : done ? (Math.floor(v * 2.2) % 2 ? 0 : 1) : 1
  })
  return (
    <span style={style}>
      <motion.span>{shown}</motion.span>
      {cursor && <motion.span style={{ opacity: caretO, marginLeft: 1, borderRight: '2px solid currentColor' }}>&#8203;</motion.span>}
    </span>
  )
}

/** Hochzähler */
export function Count({ at, dur = 1.4, from = 0, to, decimals = 0, suffix = '', prefix = '', style }) {
  const t = useT()
  const v = useTransform(t, (x) => {
    const n = mix(from, to, EASE.out(cl((x - at) / dur)))
    return prefix + n.toFixed(decimals).replace('.', ',') + suffix
  })
  return <motion.span style={style}>{v}</motion.span>
}

/** Animierter Cursor-Finger mit Tap-Ripple: keys = [{t, x, y}], taps = [t,...] */
export function Cursor({ keys, taps = [], color = '#fff' }) {
  const t = useT()
  const pos = (v) => {
    if (v <= keys[0].t) return keys[0]
    for (let i = 0; i < keys.length - 1; i++) {
      const a = keys[i], b = keys[i + 1]
      if (v <= b.t) {
        const p = EASE.inOut(cl((v - a.t) / (b.t - a.t)))
        return { x: mix(a.x, b.x, p), y: mix(a.y, b.y, p) }
      }
    }
    return keys[keys.length - 1]
  }
  const x = useTransform(t, (v) => pos(v).x)
  const y = useTransform(t, (v) => pos(v).y)
  const near = (v) => taps.reduce((m, tp) => Math.min(m, Math.abs(v - tp)), 9)
  const scale = useTransform(t, (v) => 1 - 0.18 * Math.max(0, 1 - near(v) / 0.12))
  const opacity = useTransform(t, (v) => cl((v - keys[0].t) / 0.25) * (1 - cl((v - keys[keys.length - 1].t - 0.4) / 0.3)))
  const rip = (v) => { const d = taps.map((tp) => v - tp).filter((d) => d >= 0 && d < 0.6); return d.length ? d[d.length - 1] / 0.6 : -1 }
  const rs = useTransform(t, (v) => { const r = rip(v); return r < 0 ? 0 : 0.3 + r * 1.6 })
  const ro = useTransform(t, (v) => { const r = rip(v); return r < 0 ? 0 : (1 - r) * 0.8 })
  return (
    <motion.div style={{ position: 'absolute', left: 0, top: 0, x, y, opacity, zIndex: 50, pointerEvents: 'none' }}>
      <motion.div style={{ position: 'absolute', left: -28, top: -28, width: 56, height: 56, borderRadius: 99, border: `3px solid ${color}`, scale: rs, opacity: ro }} />
      <motion.div style={{ scale, position: 'absolute', left: -14, top: -14, width: 28, height: 28, borderRadius: 99,
        background: 'rgba(255,255,255,0.92)', boxShadow: '0 6px 24px rgba(0,0,0,.45), 0 0 0 6px rgba(255,255,255,.18)' }} />
    </motion.div>
  )
}

/** Konfetti-Explosion zum Zeitpunkt `at` */
export function Burst({ at, x = 270, y = 400, n = 26, colors = [C.lime, C.cyan, C.violet, C.coral, C.amber], spread = 220 }) {
  const parts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 + (i % 3) * 0.3
    const r = spread * (0.55 + ((i * 37) % 11) / 22)
    return { dx: Math.cos(a) * r, dy: Math.sin(a) * r, c: colors[i % colors.length], s: 6 + (i % 4) * 3, rot: (i * 47) % 360 }
  })
  return parts.map((p, i) => <Particle key={i} p={p} at={at} x={x} y={y} />)
}
function Particle({ p, at, x, y }) {
  const t = useT()
  const k = (v) => cl((v - at) / 1.3)
  const px = useTransform(t, (v) => x + p.dx * EASE.out(k(v)))
  const py = useTransform(t, (v) => y + p.dy * EASE.out(k(v)) + 160 * k(v) * k(v))
  const opacity = useTransform(t, (v) => (v < at ? 0 : 1 - k(v)))
  const rotate = useTransform(t, (v) => p.rot + 540 * k(v))
  return <motion.div style={{ position: 'absolute', left: 0, top: 0, x: px, y: py, opacity, rotate,
    width: p.s, height: p.s * 0.6, background: p.c, borderRadius: 2 }} />
}

/** Glas-Karte */
export const card = (extra = {}) => ({
  background: 'linear-gradient(160deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))',
  border: `1px solid ${C.line}`, borderRadius: 22, backdropFilter: 'blur(14px)',
  boxShadow: '0 20px 60px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.08)', ...extra,
})

export const pill = (color, extra = {}) => ({
  display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 99,
  background: `${color}22`, color, border: `1px solid ${color}55`, fontWeight: 700, fontSize: 15, ...extra,
})
