// Folge 5 – „KI einführen in 4 Schritten“ (Pilot, Schulung/AI Act, Regeln, Messen)
import { motion, useTransform } from 'framer-motion'
import { useT, useSegs, useF, wt, E, Scene, Type, Count, Cursor, Burst, C, cl, EASE, mix, card, pill } from '../core.jsx'
import { Floaty } from './V1.jsx'

const A = C.coral

export default function V5() {
  const s = useSegs()
  return (
    <>
      <Hook s={s} />
      <Stepper s={s} />
      <Step1 s={s} />
      <Step2 s={s} />
      <Step3 s={s} />
      <Step4 s={s} />
      <Save s={s} />
      <Cta s={s} />
    </>
  )
}

function Hook({ s }) {
  const a = s.hook.start, end = s.s1.start
  return (
    <Scene at={0} out={end - 0.15} from={{ scale: 1, blur: 0 }}>
      <E at={a} dur={0.5} style={{ position: 'absolute', top: 100, left: 0, right: 0, textAlign: 'center' }}>
        <div style={{ fontSize: 18, color: C.mute, fontWeight: 700 }}>KI EINFÜHREN IN</div>
      </E>
      <E at={a + 0.3} dur={0.7} from={{ scale: 3, blur: 20 }} ease={EASE.back} style={{ position: 'absolute', top: 120, left: 0, right: 0, textAlign: 'center' }}>
        <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 200, letterSpacing: -8, lineHeight: 1, color: A, textShadow: `0 0 60px ${A}88` }}>4</div>
        <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 44, letterSpacing: -1.5, marginTop: -10 }}>Schritten</div>
      </E>
      <div style={{ position: 'absolute', top: 440, left: 70, right: 70, display: 'flex', justifyContent: 'space-between' }}>
        {[1, 2, 3, 4].map((n, i) => (
          <E key={n} at={a + s.hook.dur * 0.55 + i * 0.18} dur={0.45} from={{ y: -120, rotate: 20 }} ease={EASE.back}>
            <div style={{ width: 72, height: 72, borderRadius: 20, ...card({ borderRadius: 20 }), display: 'grid', placeItems: 'center', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 32 }}>{n}</div>
          </E>
        ))}
      </div>
    </Scene>
  )
}

const STEPS = ['s1', 's2', 's3', 's4']
const LABELS = ['Pilot', 'Schulen', 'Regeln', 'Messen']

/** Horizontaler Fortschritts-Stepper, bleibt über alle 4 Schritte stehen */
function Stepper({ s }) {
  const a = s.s1.start, end = s.save.start
  const t = useT()
  const fill = useTransform(t, (v) => {
    let k = 0
    STEPS.forEach((id, i) => { if (v > s[id].start) k = i + EASE.inOut(cl((v - s[id].start) / 0.6)) - 1 })
    return cl(k / 3)
  })
  return (
    <Scene at={a - 0.1} out={end - 0.15} from={{ y: -40, blur: 6 }}>
      <div style={{ position: 'absolute', top: 80, left: 50, right: 50, height: 70 }}>
        <div style={{ position: 'absolute', left: 22, right: 22, top: 20, height: 4, background: 'rgba(255,255,255,.12)', borderRadius: 4 }} />
        <motion.div style={{ position: 'absolute', left: 22, right: 22, top: 20, height: 4, background: A, borderRadius: 4, scaleX: fill, transformOrigin: '0 50%', boxShadow: `0 0 12px ${A}` }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'space-between' }}>
          {STEPS.map((id, i) => <Dot key={id} n={i + 1} at={s[id].start} label={LABELS[i]} />)}
        </div>
      </div>
    </Scene>
  )
}

function Dot({ n, at, label }) {
  const t = useT()
  const bg = useTransform(t, (v) => (v > at ? A : '#1a1a24'))
  const col = useTransform(t, (v) => (v > at ? '#000' : C.mute))
  const sc = useTransform(t, (v) => 1 + 0.25 * Math.max(0, 1 - Math.abs(v - at - 0.15) / 0.25))
  return (
    <div style={{ width: 44, textAlign: 'center' }}>
      <motion.div style={{ width: 44, height: 44, borderRadius: 99, background: bg, color: col, scale: sc, display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 18, border: '2px solid rgba(255,255,255,.15)' }}>{n}</motion.div>
      <div style={{ fontSize: 11.5, fontWeight: 700, marginTop: 6, color: C.mute, marginLeft: -10, marginRight: -10 }}>{label}</div>
    </div>
  )
}

const Title = ({ n, children }) => (
  <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 42, letterSpacing: -1.5, lineHeight: 1.05 }}>
    <span style={{ color: A }}>{n}.</span> {children}
  </div>
)

function Step1({ s }) {
  const a = s.s1.start, end = s.s2.start, d = s.s1.dur
  const chips = [['👥', '1 Team'], ['🎯', '1 Problem'], ['🛠', '1 Tool']]
  return (
    <Scene at={a} out={end - 0.15} from={{ x: 80, y: 0, blur: 8 }}>
      <div style={{ position: 'absolute', top: 180, left: 46, right: 46 }}>
        <Title n={1}>Starte klein.</Title>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>
          {chips.map(([e, l], i) => (
            <E key={l} at={wt(s.s1, ['Team', 'Problem', 'Tool'][i]) - 0.25} dur={0.45} from={{ scale: 0.5, y: 0 }} ease={EASE.back}>
              <div style={{ ...card({ borderRadius: 18 }), padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 28 }}>
                <span style={{ fontSize: 30 }}>{e}</span>{l}
              </div>
            </E>
          ))}
        </div>
      </div>
    </Scene>
  )
}

function Step2({ s }) {
  const a = s.s2.start, end = s.s3.start, d = s.s2.dur
  const items = [
    ['✓', 'Maßnahmen für KI-Kompetenz', C.green, wt(s.s2, 'verlangt')],
    ['✕', 'Kein Pflicht-Zertifikat', C.mute, wt(s.s2, 'Zertifikat') - 0.2],
    ['📄', 'Schulungen dokumentieren', A, wt(s.s2, 'dokumentier') - 0.2],
  ]
  return (
    <Scene at={a} out={end - 0.15} from={{ x: 80, y: 0, blur: 8 }}>
      <div style={{ position: 'absolute', top: 180, left: 46, right: 46 }}>
        <Title n={2}>Schulen.</Title>
        <E at={wt(s.s2, 'EU') - 0.1} dur={0.45} from={{ scale: 0.6, y: 0 }} ease={EASE.back}>
          <div style={{ marginTop: 16 }}><span style={pill(C.cyan, { fontSize: 14 })}>🇪🇺 EU AI Act · Art. 4</span></div>
        </E>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
          {items.map(([ic, l, c, at]) => (
            <E key={l} at={at} dur={0.4} from={{ x: 50, y: 0 }} ease={EASE.back}>
              <div style={{ ...card({ borderRadius: 16 }), padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 12, fontWeight: 700, fontSize: 17 }}>
                <span style={{ width: 30, height: 30, borderRadius: 9, background: `${c}26`, color: c, display: 'grid', placeItems: 'center', fontWeight: 900 }}>{ic}</span>{l}
              </div>
            </E>
          ))}
        </div>
        <E at={a + 0.5} dur={0.4} from={{ y: 0 }}><div style={{ fontSize: 11, color: C.mute, marginTop: 10 }}>Hinweis: keine Rechtsberatung.</div></E>
      </div>
    </Scene>
  )
}

function Step3({ s }) {
  const a = s.s3.start, end = s.s4.start, d = s.s3.dur
  const ok = ['Freigegebene Tools', 'Öffentliche Infos', 'Eigene Entwürfe']
  const no = ['Kundendaten', 'Personaldaten', 'Geheimnisse']
  return (
    <Scene at={a} out={end - 0.15} from={{ x: 80, y: 0, blur: 8 }}>
      <div style={{ position: 'absolute', top: 180, left: 40, right: 40 }}>
        <Title n={3}>Regeln.</Title>
        <div style={{ display: 'flex', gap: 12, marginTop: 22 }}>
          <Col title="✅ Erlaubt" c={C.green} items={ok} at={wt(s.s3, 'Welche') - 0.1} />
          <Col title="⛔ Nie in Gratis-Tools" c={A} items={no} at={wt(s.s3, 'Daten') - 0.3} />
        </div>
      </div>
    </Scene>
  )
}
function Col({ title, c, items, at }) {
  return (
    <E at={at} dur={0.45} from={{ y: 40 }} ease={EASE.back} style={{ flex: 1 }}>
      <div style={{ ...card({ borderRadius: 18 }), padding: 14, borderColor: `${c}66`, background: `${c}10`, minHeight: 210 }}>
        <div style={{ fontWeight: 800, fontSize: 14, color: c, marginBottom: 8 }}>{title}</div>
        {items.map((it, i) => (
          <E key={it} at={at + 0.3 + i * 0.2} dur={0.35} from={{ x: -20, y: 0 }}>
            <div style={{ padding: '9px 10px', borderRadius: 10, background: 'rgba(255,255,255,.06)', marginTop: 7, fontSize: 14, fontWeight: 700 }}>{it}</div>
          </E>
        ))}
      </div>
    </E>
  )
}

function Step4({ s }) {
  const a = s.s4.start, end = s.save.start, d = s.s4.dur
  const pts = [[0, 120], [60, 112], [120, 96], [180, 70], [240, 52], [300, 26], [360, 8]]
  const path = pts.map((p, i) => `${i ? 'L' : 'M'} ${p[0]} ${p[1]}`).join(' ')
  const t = useT()
  const len = useTransform(t, (v) => EASE.inOut(cl((v - a - 0.6) / 1.6)))
  return (
    <Scene at={a} out={end - 0.15} from={{ x: 80, y: 0, blur: 8 }}>
      <div style={{ position: 'absolute', top: 180, left: 46, right: 46 }}>
        <Title n={4}>Messen.</Title>
        <E at={a + 0.4} dur={0.5} from={{ y: 30 }}>
          <div style={{ ...card(), padding: '16px 18px', marginTop: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.mute }}>Gesparte Stunden pro Woche</div>
            <svg width="380" height="140" viewBox="-10 -10 380 140" style={{ marginTop: 6, overflow: 'visible' }}>
              {[0, 40, 80, 120].map((y) => <line key={y} x1="0" x2="360" y1={y} y2={y} stroke="rgba(255,255,255,.07)" />)}
              <motion.path d={path} stroke={C.green} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ pathLength: len }} />
            </svg>
          </div>
        </E>
        <E at={wt(s.s4, 'Erst') - 0.15} dur={0.5} from={{ scale: 0.4, y: 0 }} ease={EASE.back}>
          <div style={{ marginTop: 16, textAlign: 'center' }}><span style={pill(C.green, { fontSize: 18, padding: '10px 18px' })}>🚀 Erst dann ausrollen</span></div>
        </E>
      </div>
    </Scene>
  )
}

function Save({ s }) {
  const a = s.save.start, end = s.cta.start
  const tap = a + 1.6
  const t = useT()
  const fill = useTransform(t, (v) => (v > tap ? A : 'transparent'))
  const sc = useTransform(t, (v) => 1 + 0.3 * Math.max(0, 1 - Math.abs(v - tap - 0.1) / 0.25))
  return (
    <Scene at={a - 0.1} out={end - 0.15}>
      <div style={{ position: 'absolute', top: 90, left: 60, right: 60 }}>
        <E at={a} dur={0.5}>
          <div style={{ ...card(), padding: 18 }}>
            <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 6 }}>📋 Deine KI-Checkliste</div>
            {['Pilot starten', 'Team schulen & dokumentieren', 'Regeln festlegen', 'Zeitersparnis messen'].map((l, i) => (
              <E key={l} at={a + 0.3 + i * 0.15} dur={0.35} from={{ x: -20, y: 0 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '7px 0', fontSize: 15, fontWeight: 600 }}>
                  <span style={{ color: C.green, fontWeight: 900 }}>✓</span>{l}
                </div>
              </E>
            ))}
          </div>
        </E>
      </div>
      <E at={a + 0.6} dur={0.5} from={{ scale: 0.4 }} ease={EASE.back} style={{ position: 'absolute', top: 360, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <motion.div style={{ scale: sc, width: 96, height: 96, borderRadius: 28, ...card({ borderRadius: 28 }), display: 'grid', placeItems: 'center' }}>
          <svg width="44" height="52" viewBox="0 0 44 52">
            <motion.path d="M4 4 H40 V48 L22 36 L4 48 Z" stroke={A} strokeWidth="4" strokeLinejoin="round" style={{ fill }} />
          </svg>
        </motion.div>
      </E>
      <E at={tap + 0.3} dur={0.4} from={{ y: 10 }} style={{ position: 'absolute', top: 470, left: 0, right: 0, textAlign: 'center', fontWeight: 800, fontSize: 18, color: A }}>✓ Gespeichert</E>
      <Burst at={tap} x={270} y={408} n={22} colors={[A, '#fff', C.amber]} spread={140} />
      <Cursor keys={[{ t: a + 0.7, x: 450, y: 620 }, { t: tap - 0.15, x: 285, y: 420 }, { t: end, x: 300, y: 450 }]} taps={[tap]} />
    </Scene>
  )
}

function Cta({ s }) {
  const a = s.cta.start
  const bubbles = [['2!', 70, a + 1.8, 380], ['1 😅', 360, a + 2.3, 395], ['3 – Regeln fehlen', 110, a + 2.8, 450], ['4 🚀', 380, a + 3.3, 470]]
  return (
    <Scene at={a - 0.1}>
      <E at={a} dur={0.5} style={{ position: 'absolute', top: 96, left: 0, right: 0, textAlign: 'center' }}>
        <span style={pill(A)}>💬 Kommentiere</span>
        <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 34, letterSpacing: -1, marginTop: 12 }}>Wo steht ihr gerade?</div>
      </E>
      <div style={{ position: 'absolute', top: 230, left: 50, right: 50, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[1, 2, 3, 4].map((n, i) => (
          <E key={n} at={a + 0.6 + i * 0.15} dur={0.5} from={{ y: -80, scale: 0.6 }} ease={EASE.back}>
            <Floaty phase={i} amp={6}>
              <div style={{ ...card({ borderRadius: 20 }), height: 100, display: 'grid', placeItems: 'center', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 44, color: i === 1 ? A : '#fff', borderColor: i === 1 ? `${A}aa` : C.line }}>{n}</div>
              <div style={{ textAlign: 'center', fontSize: 11.5, fontWeight: 700, color: C.mute, marginTop: 6 }}>{LABELS[i]}</div>
            </Floaty>
          </E>
        ))}
      </div>
      {bubbles.map(([txt, x, at, y1]) => <Bub key={txt} txt={txt} x={x} at={at} y1={y1} />)}
    </Scene>
  )
}

function Bub({ txt, x, at, y1 }) {
  const t = useT()
  const y = useTransform(t, (v) => mix(600, y1, EASE.out(cl((v - at) / 1.2))))
  const opacity = useTransform(t, (v) => (v < at ? 0 : 1))
  const sc = useTransform(t, (v) => 0.5 + 0.5 * EASE.back(cl((v - at) / 0.35)))
  return (
    <motion.div style={{ position: 'absolute', left: x, top: 0, y, opacity, scale: sc, background: '#fff', color: '#000', padding: '8px 14px',
      borderRadius: '16px 16px 16px 4px', fontWeight: 800, fontSize: 15, whiteSpace: 'nowrap', boxShadow: '0 8px 30px rgba(0,0,0,.4)' }}>{txt}</motion.div>
  )
}
