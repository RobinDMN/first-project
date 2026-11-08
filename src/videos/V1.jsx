// Folge 1 – „57 % nutzen KI, aber nur 3 % richtig“ (Status quo + Quiz)
import { motion, useTransform } from 'framer-motion'
import { useT, useSegs, useF, wt, E, Scene, Count, Cursor, Burst, C, cl, EASE, mix, card, pill } from '../core.jsx'

const A = C.lime

export default function V1() {
  const s = useSegs()
  return (
    <>
      <Hook s={s} />
      <Stat s={s} />
      <Quiz s={s} />
      <Reveal s={s} />
      <Series s={s} />
      <Cta s={s} />
    </>
  )
}

function Hook({ s }) {
  const t = useT()
  const shake = useTransform(t, (v) => (v > 0.12 && v < 0.5 ? Math.sin(v * 90) * 7 * (1 - (v - 0.12) / 0.38) : 0))
  const end = s.stat.start
  return (
    <Scene at={0} out={end - 0.2} from={{ scale: 1, blur: 0 }}>
      <motion.div style={{ x: shake, position: 'absolute', top: 110, left: 0, right: 0, textAlign: 'center' }}>
        <E at={0.05} dur={0.3} out={1.25} from={{ scale: 2.8, blur: 12 }} ease={EASE.back}>
          <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 118, color: C.coral, letterSpacing: -4,
            textShadow: `0 0 50px ${C.coral}88` }}>STOPP<span style={{ fontSize: 90 }}>✋</span></div>
        </E>
      </motion.div>
      <E at={1.3} dur={0.5} from={{ y: 30 }} style={{ position: 'absolute', top: 100, left: 0, right: 0, textAlign: 'center' }}>
        <div style={{ fontSize: 22, color: C.mute, fontWeight: 600 }}>In Deutschland nutzt</div>
        <div style={{ fontFamily: 'Space Grotesk', fontSize: 44, fontWeight: 800, letterSpacing: -1.5, lineHeight: 1.05, marginTop: 6 }}>
          mehr als <span style={{ color: A }}>jedes 2.</span><br />Unternehmen KI
        </div>
      </E>
      <div style={{ position: 'absolute', top: 290, left: 60, right: 60, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
        {Array.from({ length: 10 }, (_, i) => <Building key={i} i={i} at={1.6 + i * 0.09} on={i < 6} lightAt={2.6 + i * 0.12} />)}
      </div>
    </Scene>
  )
}

function Building({ i, at, on, lightAt }) {
  const t = useT()
  const bg = useTransform(t, (v) => (on && v > lightAt ? A : 'rgba(255,255,255,.08)'))
  const glow = useTransform(t, (v) => (on && v > lightAt ? `0 0 28px ${A}aa` : '0 0 0 rgba(0,0,0,0)'))
  const sc = useTransform(t, (v) => (on ? 1 + 0.18 * Math.max(0, 1 - Math.abs(v - lightAt) / 0.15) : 1))
  return (
    <E at={at} dur={0.45} from={{ y: 30, scale: 0.6 }} ease={EASE.back}>
      <motion.div style={{ height: 96, borderRadius: 14, background: bg, boxShadow: glow, scale: sc, position: 'relative', overflow: 'hidden' }}>
        {[0, 1, 2].map((r) => (
          <div key={r} style={{ position: 'absolute', left: 12, right: 12, top: 16 + r * 24, height: 10, display: 'flex', gap: 6 }}>
            <div style={{ flex: 1, background: 'rgba(0,0,0,.28)', borderRadius: 3 }} />
            <div style={{ flex: 1, background: 'rgba(0,0,0,.28)', borderRadius: 3 }} />
          </div>
        ))}
      </motion.div>
    </E>
  )
}

function Stat({ s }) {
  const a = s.stat.start, end = s.quiz.start
  const bars = [
    { l: '2024', v: 20, at: a + 0.9 },
    { l: 'Frühjahr 2026', v: 41, at: wt(s.stat, '41') - 0.3 },
    { l: 'Sept. 2026', v: 57, at: a + 1.2, hi: true },
  ]
  return (
    <Scene at={a - 0.1} out={end - 0.2}>
      <div style={{ position: 'absolute', top: 92, left: 0, right: 0, textAlign: 'center' }}>
        <E at={a} dur={0.5} from={{ y: 20 }}><span style={pill(A)}>📊 Bitkom-Studie</span></E>
        <E at={a + 0.15} dur={0.7} from={{ scale: 0.6, blur: 14 }} ease={EASE.back}>
          <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 150, letterSpacing: -7, lineHeight: 1, marginTop: 10,
            background: `linear-gradient(180deg, #fff, ${A})`, WebkitBackgroundClip: 'text', color: 'transparent' }}>
            <Count at={a + 0.15} dur={1.6} to={57} suffix="%" />
          </div>
        </E>
        <E at={a + 0.6} dur={0.5}><div style={{ color: C.mute, fontSize: 18, fontWeight: 600 }}>der Unternehmen nutzen KI</div></E>
      </div>
      <div style={{ position: 'absolute', top: 360, left: 50, right: 50, height: 220, display: 'flex', alignItems: 'flex-end', gap: 22 }}>
        {bars.map((b, i) => <Bar key={i} b={b} />)}
      </div>
    </Scene>
  )
}

function Bar({ b }) {
  const t = useT()
  const h = useTransform(t, (v) => 4 + 170 * (b.v / 57) * EASE.out(cl((v - b.at) / 0.9)))
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <E at={b.at + 0.3} dur={0.4} from={{ y: 10 }}>
        <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 22, color: b.hi ? A : '#fff' }}>{b.v}%</div>
      </E>
      <motion.div style={{ width: '100%', height: h, borderRadius: 12,
        background: b.hi ? `linear-gradient(180deg, ${A}, ${A}66)` : 'linear-gradient(180deg, rgba(255,255,255,.35), rgba(255,255,255,.08))',
        boxShadow: b.hi ? `0 0 40px ${A}66` : 'none' }} />
      <E at={b.at} dur={0.4} from={{ y: 0 }}><div style={{ fontSize: 13, color: C.mute, fontWeight: 600 }}>{b.l}</div></E>
    </div>
  )
}

const OPTS = [{ k: 'A', v: '3 %' }, { k: 'B', v: '30 %' }, { k: 'C', v: '50 %' }]

function Quiz({ s }) {
  const a = s.quiz.start, cd = s.quiz.end + 0.05, end = s.reveal.start
  return (
    <Scene at={a - 0.1} out={end + 1.35}>
      <E at={a} dur={0.5} out={end - 0.1} style={{ position: 'absolute', top: 96, left: 0, right: 0, textAlign: 'center' }}>
        <span style={pill(C.amber)}>🧠 Quiz · rate mit!</span>
        <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 36, lineHeight: 1.08, letterSpacing: -1, marginTop: 14, padding: '0 30px' }}>
          Wie viele nutzen KI<br />wirklich <span style={{ color: C.amber }}>stark</span>?
        </div>
      </E>
      <div style={{ position: 'absolute', top: 250, left: 46, right: 46, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {OPTS.map((o, i) => <Opt key={o.k} o={o} i={i} at={a + 0.9 + i * 0.18} reveal={end} />)}
      </div>
      <Countdown at={cd} />
      <Cursor keys={[{ t: cd - 0.2, x: 420, y: 560 }, { t: cd + 0.6, x: 380, y: 425 }, { t: cd + 1.4, x: 390, y: 350 }, { t: cd + 2.3, x: 380, y: 280 }, { t: end + 0.1, x: 380, y: 280 }]}
        taps={[end - 0.15]} />
    </Scene>
  )
}

function Opt({ o, i, at, reveal }) {
  const t = useT()
  const win = o.k === 'A'
  const bg = useTransform(t, (v) => (v > reveal ? (win ? `${A}` : 'rgba(255,255,255,.03)') : 'rgba(255,255,255,.07)'))
  const col = useTransform(t, (v) => (v > reveal ? (win ? '#000' : 'rgba(255,255,255,.3)') : '#fff'))
  const sc = useTransform(t, (v) => (v > reveal ? (win ? 1 + 0.06 * EASE.back(cl((v - reveal) / 0.4)) : 0.95) : 1))
  const strike = useTransform(t, (v) => (!win && v > reveal ? cl((v - reveal - 0.2) / 0.3) : 0))
  return (
    <E at={at} dur={0.5} from={{ x: i % 2 ? 60 : -60, y: 0 }} ease={EASE.back}>
      <motion.div style={{ ...card({ borderRadius: 18 }), background: bg, color: col, scale: sc, display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', position: 'relative' }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(0,0,0,.25)', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 20, fontFamily: 'Space Grotesk' }}>{o.k}</div>
        <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 32 }}>{o.v}</div>
        <div style={{ marginLeft: 'auto', fontSize: 26 }}>{win ? <E at={reveal + 0.15} dur={0.35} from={{ scale: 0 }} ease={EASE.back}>✓</E> : null}</div>
        <motion.div style={{ position: 'absolute', left: 80, right: 30, top: '50%', height: 3, background: 'rgba(255,255,255,.35)', scaleX: strike, transformOrigin: '0 50%' }} />
      </motion.div>
    </E>
  )
}

function Countdown({ at }) {
  const t = useT()
  const R = 34, L = 2 * Math.PI * R
  const off = useTransform(t, (v) => L * cl((v - at) / 3))
  return (
    <E at={at} dur={0.35} out={at + 3.05} from={{ scale: 0.4 }} ease={EASE.back}
      style={{ position: 'absolute', top: 498, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14 }}>
      <div style={{ position: 'relative', width: 84, height: 84 }}>
        <svg width="84" height="84" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="42" cy="42" r={R} stroke="rgba(255,255,255,.12)" strokeWidth="7" fill="none" />
          <motion.circle cx="42" cy="42" r={R} stroke={C.amber} strokeWidth="7" fill="none" strokeLinecap="round"
            strokeDasharray={L} style={{ strokeDashoffset: off }} />
        </svg>
        {[3, 2, 1].map((n, i) => (
          <E key={n} at={at + i} dur={0.25} out={at + i + 0.8} outDur={0.15} from={{ scale: 1.8 }}
            style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 34 }}>{n}</E>
        ))}
      </div>
      <div style={{ fontWeight: 700, fontSize: 16, color: C.mute, lineHeight: 1.2 }}>⏸ Pausier' das Video<br />und tipp deine Antwort!</div>
    </E>
  )
}

function Reveal({ s }) {
  const a = s.reveal.start, end = s.series.start
  return (
    <Scene at={a + 1.6} out={end - 0.2} from={{ y: 40, blur: 8 }}>
      <Burst at={a + 0.05} x={270} y={290} n={34} />
      <div style={{ position: 'absolute', top: 100, left: 0, right: 0, textAlign: 'center' }}>
        <E at={a + 1.7} dur={0.6} from={{ scale: 0.5 }} ease={EASE.back}>
          <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 64, letterSpacing: -2, lineHeight: 1 }}>
            Nur <span style={{ color: A }}>3 %</span>
          </div>
          <div style={{ color: C.mute, fontWeight: 600, fontSize: 18, marginTop: 8 }}>schöpfen KI stark aus</div>
        </E>
      </div>
      <div style={{ position: 'absolute', top: 300, left: 50, right: 50, display: 'flex', gap: 16 }}>
        <E at={a + 2.4} dur={0.5} from={{ y: 40, rotate: -6 }} ease={EASE.back} style={{ flex: 1 }}>
          <div style={{ ...card(), padding: 22, textAlign: 'center' }}>
            <div style={{ fontSize: 44 }}>🧰</div>
            <div style={{ fontWeight: 800, fontSize: 22, marginTop: 6 }}>Tool</div>
            <div style={{ color: C.green, fontWeight: 800, fontSize: 28 }}>✓</div>
          </div>
        </E>
        <E at={a + 2.9} dur={0.5} from={{ y: 40, rotate: 6 }} ease={EASE.back} style={{ flex: 1 }}>
          <div style={{ ...card(), padding: 22, textAlign: 'center', borderColor: `${C.coral}88` }}>
            <div style={{ fontSize: 44 }}>🗺️</div>
            <div style={{ fontWeight: 800, fontSize: 22, marginTop: 6 }}>Plan</div>
            <div style={{ color: C.coral, fontWeight: 800, fontSize: 28 }}>✕</div>
          </div>
        </E>
      </div>
    </Scene>
  )
}

const EPS = [
  ['01', 'Status & Quiz', '📊'], ['02', 'Meeting-Protokolle', '🎙️'], ['03', 'KI-Kundenservice', '💬'],
  ['04', 'Automatisierung', '⚡'], ['05', 'Einführung & AI Act', '🧭'],
]
function Series({ s }) {
  const a = s.series.start, end = s.cta.start
  return (
    <Scene at={a - 0.1} out={end - 0.2}>
      <E at={a} dur={0.5} style={{ position: 'absolute', top: 92, left: 0, right: 0, textAlign: 'center' }}>
        <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 38, letterSpacing: -1 }}>5 Folgen. <span style={{ color: A }}>0 Blabla.</span></div>
      </E>
      <div style={{ position: 'absolute', top: 160, left: 44, right: 44, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {EPS.map((e, i) => (
          <E key={i} at={a + 0.5 + i * 0.32} dur={0.5} from={{ x: 80, y: 0, blur: 8 }}>
            <div style={{ ...card({ borderRadius: 16 }), display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px',
              borderColor: i === 0 ? `${A}aa` : C.line, background: i === 0 ? `${A}18` : undefined }}>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 20, color: i === 0 ? A : C.mute, width: 34 }}>{e[0]}</div>
              <div style={{ fontWeight: 700, fontSize: 19, flex: 1 }}>{e[1]}</div>
              <div style={{ fontSize: 24 }}>{e[2]}</div>
            </div>
          </E>
        ))}
      </div>
    </Scene>
  )
}

function Cta({ s }) {
  const a = s.cta.start
  const t = useT()
  const followed = (v) => v > a + 3.6
  const fBg = useTransform(t, (v) => (followed(v) ? 'rgba(255,255,255,.12)' : '#fff'))
  const fCol = useTransform(t, (v) => (followed(v) ? '#fff' : '#000'))
  const l1 = useTransform(t, (v) => (followed(v) ? 0 : 1))
  const l2 = useTransform(t, (v) => (followed(v) ? 1 : 0))
  return (
    <Scene at={a - 0.1}>
      <E at={a} dur={0.5} style={{ position: 'absolute', top: 96, left: 0, right: 0, textAlign: 'center' }}>
        <span style={pill(A)}>💬 Kommentiere</span>
        <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 36, letterSpacing: -1, marginTop: 12 }}>Nutzt ihr schon KI?</div>
      </E>
      <div style={{ position: 'absolute', top: 230, left: 50, right: 50, display: 'flex', gap: 16 }}>
        {[['JA', '👍', C.green], ['NEIN', '👎', C.coral]].map(([l, e, c], i) => (
          <E key={l} at={a + 0.5 + i * 0.2} dur={0.55} from={{ scale: 0.4 }} ease={EASE.back} style={{ flex: 1 }}>
            <Floaty phase={i}>
              <div style={{ ...card(), padding: '22px 0', textAlign: 'center', borderColor: `${c}88`, background: `${c}1c` }}>
                <div style={{ fontSize: 48 }}>{e}</div>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 28, color: c }}>{l}</div>
              </div>
            </Floaty>
          </E>
        ))}
      </div>
      <Bubbles at={a + 1.2} />
      <E at={a + 2.2} dur={0.5} from={{ y: 30 }} style={{ position: 'absolute', top: 470, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <motion.div style={{ background: fBg, color: fCol, padding: '14px 30px', borderRadius: 99, fontWeight: 800, fontSize: 20, position: 'relative', boxShadow: '0 10px 40px rgba(0,0,0,.5)' }}>
          <motion.span style={{ opacity: l1 }}>➕ Folgen für Folge 2</motion.span>
          <motion.span style={{ opacity: l2, position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>✓ Gefolgt</motion.span>
        </motion.div>
      </E>
      <Cursor keys={[{ t: a + 2.6, x: 440, y: 600 }, { t: a + 3.4, x: 280, y: 497 }, { t: a + 5, x: 290, y: 500 }]} taps={[a + 3.55]} />
    </Scene>
  )
}

export function Floaty({ phase = 0, amp = 6, children }) {
  const y = useF((v) => Math.sin(v * 2.4 + phase * 1.7) * amp)
  return <motion.div style={{ y }}>{children}</motion.div>
}

function Bubbles({ at }) {
  const items = [['ja! 🙌', 70], ['nein, noch nicht', 300], ['ja, ChatGPT 😅', 150], ['planen wir gerade', 280], ['ja 🔥', 90]]
  return items.map(([txt, x], i) => <Bubble key={i} txt={txt} x={x} at={at + i * 0.55} />)
}
function Bubble({ txt, x, at }) {
  const t = useT()
  const y = useTransform(t, (v) => mix(430, 160, cl((v - at) / 2.6)))
  const opacity = useTransform(t, (v) => { const p = (v - at) / 2.6; return p < 0 || p > 1 ? 0 : Math.min(1, p * 6, (1 - p) * 3) })
  const sc = useTransform(t, (v) => 0.6 + 0.4 * EASE.back(cl((v - at) / 0.35)))
  return (
    <motion.div style={{ position: 'absolute', left: x, top: 0, y, opacity, scale: sc, background: '#fff', color: '#000', padding: '8px 14px',
      borderRadius: '16px 16px 16px 4px', fontWeight: 700, fontSize: 15, whiteSpace: 'nowrap', boxShadow: '0 8px 30px rgba(0,0,0,.4)', zIndex: 20 }}>{txt}</motion.div>
  )
}
