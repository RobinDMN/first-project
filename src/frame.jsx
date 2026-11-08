// Gemeinsamer Rahmen aller Shorts: Hintergrund, Kopfzeile, Fortschritt, Kinetic-Captions
import { motion, useTransform } from 'framer-motion'
import { useT, useVideo, C, cl, EASE } from './core.jsx'

export function Background({ accent, accent2 = C.violet }) {
  const t = useT()
  const b1x = useTransform(t, (v) => Math.sin(v * 0.35) * 90)
  const b1y = useTransform(t, (v) => Math.cos(v * 0.27) * 70)
  const b2x = useTransform(t, (v) => Math.cos(v * 0.31) * 110)
  const b2y = useTransform(t, (v) => Math.sin(v * 0.22) * 90)
  const gridY = useTransform(t, (v) => (v * 14) % 40)
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: C.bg }}>
      <motion.div style={{ position: 'absolute', left: -140, top: -120, width: 520, height: 520, borderRadius: 999,
        background: `radial-gradient(circle, ${accent}55 0%, transparent 65%)`, x: b1x, y: b1y }} />
      <motion.div style={{ position: 'absolute', right: -200, bottom: 120, width: 620, height: 620, borderRadius: 999,
        background: `radial-gradient(circle, ${accent2}44 0%, transparent 65%)`, x: b2x, y: b2y }} />
      <motion.div style={{ position: 'absolute', inset: -40, y: gridY, opacity: 0.5,
        backgroundImage: 'linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)',
        backgroundSize: '40px 40px', maskImage: 'radial-gradient(ellipse at 50% 40%, #000 30%, transparent 75%)',
        WebkitMaskImage: 'radial-gradient(ellipse at 50% 40%, #000 30%, transparent 75%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 120%, rgba(0,0,0,.8), transparent 60%)' }} />
    </div>
  )
}

export function Header({ ep, accent, label }) {
  const t = useT()
  const { duration } = useVideo()
  const sx = useTransform(t, (v) => cl(v / duration))
  const o = useTransform(t, (v) => cl((v - 0.15) / 0.5))
  return (
    <>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 4, background: 'rgba(255,255,255,.08)', zIndex: 40 }}>
        <motion.div style={{ height: '100%', background: accent, transformOrigin: '0 50%', scaleX: sx, boxShadow: `0 0 12px ${accent}` }} />
      </div>
      <motion.div style={{ position: 'absolute', left: 26, top: 26, display: 'flex', gap: 8, alignItems: 'center', opacity: o, zIndex: 40 }}>
        <div style={{ width: 30, height: 30, borderRadius: 9, background: accent, color: '#000', fontWeight: 800,
          display: 'grid', placeItems: 'center', fontFamily: 'Space Grotesk', fontSize: 14 }}>KI</div>
        <div style={{ lineHeight: 1.05 }}>
          <div style={{ fontWeight: 800, fontSize: 13, letterSpacing: 0.4 }}>KI IM UNTERNEHMEN</div>
          <div style={{ fontSize: 11.5, color: C.mute, fontWeight: 600 }}>Folge {ep}/5 · {label}</div>
        </div>
      </motion.div>
    </>
  )
}

function chunks(segs) {
  const out = []
  for (const id of Object.keys(segs)) {
    const ws = segs[id].words
    let cur = []
    ws.forEach((w, i) => {
      cur.push(w)
      const end = /[.!?:]$/.test(w.w) || (/,$/.test(w.w) && cur.length >= 2) || cur.length >= 4 || i === ws.length - 1
      if (end) { out.push({ words: cur, seg: id }); cur = [] }
    })
  }
  out.forEach((c, i) => {
    c.start = c.words[0].t
    const last = c.words[c.words.length - 1]
    const naturalEnd = last.t + last.d + 0.25
    const next = out[i + 1]
    c.end = next && next.words[0].t - naturalEnd < 0.35 ? next.words[0].t : naturalEnd
  })
  return out
}

export function Captions({ accent, y = 640 }) {
  const { segs } = useVideo()
  const list = chunks(segs)
  return (
    <div style={{ position: 'absolute', left: 24, right: 24, top: y, height: 120, zIndex: 30 }}>
      {list.map((c, i) => <Chunk key={i} c={c} accent={accent} />)}
    </div>
  )
}

function Chunk({ c, accent }) {
  const t = useT()
  const opacity = useTransform(t, (v) => (v < c.start - 0.02 || v > c.end ? 0 : 1))
  const scale = useTransform(t, (v) => 0.86 + 0.14 * EASE.back(cl((v - c.start) / 0.22)))
  const y = useTransform(t, (v) => 14 * (1 - EASE.out(cl((v - c.start) / 0.22))))
  return (
    <motion.div style={{ position: 'absolute', inset: 0, display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
      alignContent: 'center', gap: '2px 11px', opacity, scale, y }}>
      {c.words.map((w, i) => <Word key={i} w={w} accent={accent} />)}
    </motion.div>
  )
}

function Word({ w, accent }) {
  const t = useT()
  const active = (v) => v >= w.t - 0.03 && v < w.t + w.d + 0.02
  const color = useTransform(t, (v) => (active(v) ? accent : '#FFFFFF'))
  const y = useTransform(t, (v) => (active(v) ? -3 : 0))
  return (
    <motion.span style={{ color, y, display: 'inline-block', fontFamily: 'Space Grotesk', fontWeight: 800,
      fontSize: 34, lineHeight: 1.12, letterSpacing: -0.5, textTransform: 'uppercase',
      textShadow: '0 3px 0 rgba(0,0,0,.6), 0 0 22px rgba(0,0,0,.65), 0 0 2px #000' }}>
      {w.w}
    </motion.span>
  )
}
