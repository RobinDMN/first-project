// Folge 2 – „Nie wieder Protokoll schreiben“ (KI-Meeting-Assistenten)
import { motion, useTransform } from 'framer-motion'
import { useT, useSegs, useF, wt, E, Scene, Type, Count, Cursor, Burst, C, cl, EASE, mix, card, pill } from '../core.jsx'
import { Floaty } from './V1.jsx'

const A = C.cyan

export default function V2() {
  const s = useSegs()
  return (
    <>
      <Hook s={s} />
      <Call s={s} />
      <Summary s={s} />
      <Tools s={s} />
      <Legal s={s} />
      <Crm s={s} />
      <Cta s={s} />
    </>
  )
}

function Hook({ s }) {
  const a = s.hook.start, end = s.how.start
  const t = useT()
  const hand = useTransform(t, (v) => v * 360 * 1.6)
  const docs = Array.from({ length: 7 }, (_, i) => i)
  const swoop = a + 2.6
  const stackS = useTransform(t, (v) => 1 - 0.85 * EASE.in(cl((v - swoop) / 0.45)))
  const stackO = useTransform(t, (v) => 1 - cl((v - swoop - 0.3) / 0.2))
  return (
    <Scene at={0} out={end - 0.2} from={{ scale: 1, blur: 0 }}>
      <E at={a} dur={0.5} style={{ position: 'absolute', top: 96, left: 0, right: 0, textAlign: 'center' }}>
        <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 40, letterSpacing: -1.2, lineHeight: 1.05 }}>
          Stunden für<br /><span style={{ color: C.coral }}>Protokolle?</span>
        </div>
      </E>
      <E at={a + 0.3} dur={0.5} from={{ scale: 0.5 }} ease={EASE.back} style={{ position: 'absolute', top: 210, right: 64 }}>
        <div style={{ width: 78, height: 78, borderRadius: 99, border: '4px solid #fff', position: 'relative', background: 'rgba(255,255,255,.06)' }}>
          <motion.div style={{ position: 'absolute', left: 35, top: 10, width: 4, height: 30, background: C.coral, borderRadius: 4, transformOrigin: '50% 100%', rotate: hand }} />
          <div style={{ position: 'absolute', left: 33, top: 33, width: 8, height: 8, borderRadius: 9, background: '#fff' }} />
        </div>
      </E>
      <motion.div style={{ position: 'absolute', top: 270, left: 120, width: 260, height: 300, scale: stackS, opacity: stackO, transformOrigin: '50% 30%' }}>
        {docs.map((i) => (
          <E key={i} at={a + 0.4 + i * 0.22} dur={0.45} from={{ y: -260, rotate: (i % 2 ? 1 : -1) * 25 }} ease={EASE.back}
            style={{ position: 'absolute', left: (i % 3) * 8 - 8, top: 150 - i * 20 }}>
            <div style={{ ...card({ borderRadius: 12, background: '#fff' }), width: 250, padding: '12px 14px', color: '#111', rotate: `${((i * 13) % 9) - 4}deg` }}>
              <div style={{ fontWeight: 800, fontSize: 13 }}>📄 Protokoll_KW{12 + i}.docx</div>
              <div style={{ height: 6, background: '#ddd', borderRadius: 3, marginTop: 8, width: '90%' }} />
              <div style={{ height: 6, background: '#ddd', borderRadius: 3, marginTop: 6, width: '70%' }} />
            </div>
          </E>
        ))}
      </motion.div>
      <E at={swoop + 0.35} dur={0.6} from={{ scale: 0.3, blur: 12 }} ease={EASE.back} style={{ position: 'absolute', top: 330, left: 0, right: 0, textAlign: 'center' }}>
        <div style={{ display: 'inline-block', padding: '18px 28px', borderRadius: 24, background: `${A}22`, border: `1px solid ${A}`, boxShadow: `0 0 60px ${A}66` }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: A }}>✨ MIT KI</div>
          <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 52, letterSpacing: -2 }}>Sekunden</div>
        </div>
      </E>
    </Scene>
  )
}

const PEOPLE = [['LM', '#FF8A5C', 'Lena'], ['TK', '#7C5CFF', 'Tom'], ['SB', '#2EE6A0', 'Sara']]
const LINES = [['Lena', 'Wir brauchen das Angebot bis Freitag.'], ['Tom', 'Ich übernehme die Kalkulation.'], ['Sara', 'Launch verschieben wir auf Mai.']]

function Call({ s }) {
  const a = s.how.start, end = s.result.start
  return (
    <Scene at={a - 0.1} out={end - 0.15}>
      <E at={a} dur={0.5} style={{ position: 'absolute', top: 84, left: 34, right: 34 }}>
        <div style={{ ...card({ borderRadius: 24 }), padding: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '2px 6px 10px' }}>
            <Rec />
            <div style={{ fontWeight: 700, fontSize: 14 }}>Weekly · Team Vertrieb</div>
            <div style={{ marginLeft: 'auto', fontSize: 12, color: C.mute }}>00:<Count at={a} dur={8} from={12} to={20} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {PEOPLE.map((p, i) => <Tile key={i} p={p} i={i} a={a} />)}
            <BotTile at={a + 0.9} />
          </div>
        </div>
      </E>
      <E at={a + 1.6} dur={0.5} style={{ position: 'absolute', top: 396, left: 34, right: 34 }}>
        <div style={{ ...card({ borderRadius: 18 }), padding: '12px 16px', fontSize: 14.5, lineHeight: 1.45, height: 150 }}>
          <div style={{ color: A, fontWeight: 800, fontSize: 12, letterSpacing: 1, marginBottom: 6 }}>● LIVE-TRANSKRIPT</div>
          {LINES.map(([n, txt], i) => (
            <E key={i} at={a + 1.8 + i * 1.2} dur={0.3} from={{ y: 8, blur: 0 }}>
              <div><b style={{ color: PEOPLE[i][1] }}>{n}:</b> <Type at={a + 1.85 + i * 1.2} text={txt} cps={40} cursor={false} /></div>
            </E>
          ))}
        </div>
      </E>
    </Scene>
  )
}

function Rec() {
  const o = useF((v) => (Math.floor(v * 2) % 2 ? 0.35 : 1))
  return <motion.div style={{ width: 10, height: 10, borderRadius: 9, background: C.coral, opacity: o, boxShadow: `0 0 10px ${C.coral}` }} />
}

function Tile({ p, i, a }) {
  const t = useT()
  // abwechselnd sprechen
  const talking = (v) => { const k = Math.floor((v - a - 1.8) / 1.2); return k === i }
  const ring = useTransform(t, (v) => (talking(v) ? `0 0 0 3px ${p[1]}` : '0 0 0 0px transparent'))
  return (
    <E at={a + 0.2 + i * 0.15} dur={0.45} from={{ scale: 0.7 }} ease={EASE.back}>
      <motion.div style={{ height: 120, borderRadius: 14, background: 'rgba(255,255,255,.05)', display: 'grid', placeItems: 'center', boxShadow: ring, position: 'relative' }}>
        <div style={{ width: 54, height: 54, borderRadius: 99, background: `linear-gradient(135deg, ${p[1]}, ${p[1]}66)`, display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 18 }}>{p[0]}</div>
        <div style={{ position: 'absolute', left: 8, bottom: 6, fontSize: 11, fontWeight: 700, opacity: 0.8 }}>{p[2]}</div>
        <Wave on={talking} color={p[1]} />
      </motion.div>
    </E>
  )
}

function Wave({ on, color }) {
  return (
    <div style={{ position: 'absolute', right: 8, bottom: 8, display: 'flex', gap: 2, alignItems: 'flex-end', height: 16 }}>
      {[0, 1, 2, 3].map((k) => <WaveBar key={k} k={k} on={on} color={color} />)}
    </div>
  )
}
function WaveBar({ k, on, color }) {
  const h = useF((v) => (on(v) ? 4 + Math.abs(Math.sin(v * 13 + k * 1.9)) * 12 : 3))
  return <motion.div style={{ width: 3, height: h, background: color, borderRadius: 2 }} />
}

function BotTile({ at }) {
  const t = useT()
  const r1 = useTransform(t, (v) => 1 + ((v * 0.9) % 1) * 0.9)
  const o1 = useTransform(t, (v) => 0.7 * (1 - ((v * 0.9) % 1)))
  return (
    <E at={at} dur={0.55} from={{ scale: 0.3, blur: 10 }} ease={EASE.back}>
      <div style={{ height: 120, borderRadius: 14, background: `${A}16`, border: `1px solid ${A}88`, display: 'grid', placeItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <motion.div style={{ position: 'absolute', width: 54, height: 54, borderRadius: 99, border: `2px solid ${A}`, scale: r1, opacity: o1 }} />
        <div style={{ width: 54, height: 54, borderRadius: 99, background: `radial-gradient(circle at 35% 30%, #fff, ${A} 45%, #0a6e66)`, boxShadow: `0 0 30px ${A}` }} />
        <div style={{ position: 'absolute', left: 8, bottom: 6, fontSize: 11, fontWeight: 800, color: A }}>✨ KI-Notizen</div>
      </div>
    </E>
  )
}

function Summary({ s }) {
  const a = s.result.start, end = s.tools.start
  const rows = [['Lena', 'Angebot senden', 'Fr', '#FF8A5C'], ['Tom', 'Kalkulation', 'Do', '#7C5CFF']]
  return (
    <Scene at={a - 0.1} out={end - 0.15} from={{ y: 60, blur: 8 }}>
      <div style={{ position: 'absolute', top: 88, left: 38, right: 38 }}>
        <div style={{ ...card({ borderRadius: 24 }), padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 26 }}>📝</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 19 }}>Zusammenfassung</div>
              <div style={{ fontSize: 12, color: C.mute }}>Weekly · automatisch erstellt</div>
            </div>
            <E at={a + 0.4} dur={0.4} from={{ scale: 0 }} ease={EASE.back} style={{ marginLeft: 'auto' }}><span style={pill(A, { fontSize: 12, padding: '5px 10px' })}>✓ fertig</span></E>
          </div>
          <E at={a + 0.6} dur={0.4} from={{ y: 10 }}>
            <div style={{ marginTop: 16, fontSize: 14.5, lineHeight: 1.5, color: '#d8d8e4' }}>
              Angebot für Kunde Weber priorisiert, Launch-Termin angepasst.
            </div>
          </E>
          <E at={a + 1.9} dur={0.4} from={{ x: -30, y: 0 }}>
            <div style={{ marginTop: 16, fontSize: 12, fontWeight: 800, letterSpacing: 1, color: C.mute }}>ENTSCHEIDUNG</div>
            <div style={{ marginTop: 6, padding: '10px 12px', borderRadius: 12, background: `${C.amber}1c`, border: `1px solid ${C.amber}55`, fontWeight: 700, fontSize: 15 }}>
              🚀 Launch → Mai
            </div>
          </E>
          <E at={a + 3.0} dur={0.4} from={{ x: -30, y: 0 }}>
            <div style={{ marginTop: 16, fontSize: 12, fontWeight: 800, letterSpacing: 1, color: C.mute }}>AUFGABEN</div>
          </E>
          {rows.map((r, i) => <Task key={i} r={r} at={a + 3.3 + i * 0.5} />)}
        </div>
      </div>
    </Scene>
  )
}

function Task({ r, at }) {
  const t = useT()
  const fill = useTransform(t, (v) => (v > at + 0.45 ? A : 'transparent'))
  const ck = useTransform(t, (v) => EASE.back(cl((v - at - 0.45) / 0.3)))
  return (
    <E at={at} dur={0.4} from={{ x: 40, y: 0 }} ease={EASE.back}>
      <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, background: 'rgba(255,255,255,.05)' }}>
        <motion.div style={{ width: 22, height: 22, borderRadius: 7, border: `2px solid ${A}`, background: fill, display: 'grid', placeItems: 'center' }}>
          <motion.span style={{ scale: ck, color: '#000', fontWeight: 900, fontSize: 14 }}>✓</motion.span>
        </motion.div>
        <div style={{ width: 26, height: 26, borderRadius: 99, background: r[3], fontSize: 11, fontWeight: 800, display: 'grid', placeItems: 'center' }}>{r[0][0]}</div>
        <div style={{ fontWeight: 700, fontSize: 15 }}>{r[1]}</div>
        <div style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700, color: C.amber }}>📅 {r[2]}</div>
      </div>
    </E>
  )
}

function Tools({ s }) {
  const a = s.tools.start, end = s.legal.start, d = s.tools.dur
  const tools = [
    ['Fireflies', 'Transkript & Analyse', '🔥', wt(s.tools, 'Fireflies') - 0.15],
    ['Otter', 'Live-Mitschrift', '🦦', wt(s.tools, 'Otter') - 0.15],
    ['Jamie', 'Ohne Bot im Call', '🎧', wt(s.tools, 'Jamie') - 0.15],
  ]
  return (
    <Scene at={a - 0.1} out={end - 0.15}>
      <E at={a} dur={0.5} style={{ position: 'absolute', top: 92, left: 0, right: 0, textAlign: 'center' }}>
        <span style={pill(A)}>🧰 Tool-Check</span>
      </E>
      <div style={{ position: 'absolute', top: 150, left: 46, right: 46, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {tools.map(([n, d2, e, at], i) => (
          <E key={n} at={at} dur={0.55} from={{ x: i % 2 ? 90 : -90, y: 0, rotate: i % 2 ? 4 : -4 }} ease={EASE.back}>
            <div style={{ ...card(), display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', borderColor: i === 2 ? `${A}aa` : C.line }}>
              <div style={{ width: 54, height: 54, borderRadius: 16, background: 'rgba(255,255,255,.08)', display: 'grid', placeItems: 'center', fontSize: 28 }}>{e}</div>
              <div>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 24 }}>{n}</div>
                <div style={{ fontSize: 13, color: C.mute, fontWeight: 600 }}>{d2}</div>
              </div>
              {i === 2 && <E at={at + 0.5} dur={0.4} from={{ scale: 0 }} ease={EASE.back} style={{ marginLeft: 'auto' }}><span style={pill(A, { fontSize: 13 })}>🇪🇺 EU-Server</span></E>}
            </div>
          </E>
        ))}
      </div>
    </Scene>
  )
}

function Legal({ s }) {
  const a = s.legal.start, end = s.pro.start
  const t = useT()
  const on = (v) => v > a + 1.8
  const knob = useTransform(t, (v) => 30 * EASE.back(cl((v - a - 1.8) / 0.3)))
  const track = useTransform(t, (v) => (on(v) ? C.green : 'rgba(255,255,255,.18)'))
  const shake = useTransform(t, (v) => (v > a && v < a + 0.5 ? Math.sin(v * 70) * 6 * (1 - (v - a) / 0.5) : 0))
  return (
    <Scene at={a - 0.1} out={end - 0.15}>
      <motion.div style={{ x: shake, position: 'absolute', top: 96, left: 0, right: 0, textAlign: 'center' }}>
        <E at={a} dur={0.4} from={{ scale: 2, blur: 10 }} ease={EASE.back}>
          <div style={{ fontSize: 80 }}>⚠️</div>
          <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 40, color: C.amber, letterSpacing: -1 }}>Wichtig!</div>
        </E>
      </motion.div>
      <E at={a + 0.9} dur={0.5} style={{ position: 'absolute', top: 300, left: 50, right: 50 }}>
        <div style={{ ...card(), padding: 20 }}>
          <div style={{ fontSize: 16, color: '#e6e6ee', lineHeight: 1.4, fontWeight: 600 }}>„Dieses Meeting wird mit KI aufgezeichnet. Einverstanden?“</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
            <motion.div style={{ width: 62, height: 32, borderRadius: 99, background: track, position: 'relative' }}>
              <motion.div style={{ position: 'absolute', top: 3, left: 3, width: 26, height: 26, borderRadius: 99, background: '#fff', x: knob }} />
            </motion.div>
            <div style={{ fontWeight: 800, fontSize: 15 }}>Alle informiert</div>
          </div>
        </div>
      </E>
      <Cursor keys={[{ t: a + 1.0, x: 430, y: 560 }, { t: a + 1.65, x: 106, y: 408 }, { t: end, x: 130, y: 440 }]} taps={[a + 1.75]} />
    </Scene>
  )
}

function Crm({ s }) {
  const a = s.pro.start, end = s.cta.start
  const tasks = [['Angebot senden', '#FF8A5C'], ['Kalkulation', '#7C5CFF'], ['Launch-Mail', '#2EE6A0']]
  return (
    <Scene at={a - 0.1} out={end - 0.15}>
      <E at={a} dur={0.5} style={{ position: 'absolute', top: 92, left: 0, right: 0, textAlign: 'center' }}>
        <span style={pill(C.amber)}>💡 Profi-Tipp</span>
        <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 34, letterSpacing: -1, marginTop: 10 }}>Meeting <span style={{ color: A }}>→</span> CRM</div>
      </E>
      <E at={a + 0.6} dur={0.5} from={{ x: 60, y: 0 }} style={{ position: 'absolute', top: 290, left: 250, right: 40 }}>
        <div style={{ ...card(), padding: 14, height: 250 }}>
          <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 10 }}>🗂 CRM · Weber GmbH</div>
          {tasks.map(([n, c], i) => (
            <E key={n} at={a + 2.6 + i * 0.6} dur={0.35} from={{ scale: 0.6, y: 0 }} ease={EASE.back}>
              <div style={{ marginTop: 8, padding: '9px 10px', borderRadius: 10, background: `${c}22`, borderLeft: `3px solid ${c}`, fontSize: 13, fontWeight: 700 }}>✓ {n}</div>
            </E>
          ))}
        </div>
      </E>
      {tasks.map(([n, c], i) => <Flyer key={n} n={n} c={c} at={a + 2.0 + i * 0.6} y0={300 + i * 60} y1={330 + i * 44} />)}
      <E at={a + 0.3} dur={0.5} from={{ x: -60, y: 0 }} style={{ position: 'absolute', top: 290, left: 40, width: 180 }}>
        <div style={{ ...card(), padding: 14, height: 250 }}>
          <div style={{ fontWeight: 800, fontSize: 14 }}>📝 Meeting-Notiz</div>
          {[0, 1, 2, 3, 4].map((k) => <div key={k} style={{ height: 7, borderRadius: 4, background: 'rgba(255,255,255,.12)', marginTop: 12, width: `${90 - k * 9}%` }} />)}
        </div>
      </E>
    </Scene>
  )
}

function Flyer({ n, c, at, y0, y1 }) {
  const t = useT()
  const p = (v) => EASE.inOut(cl((v - at) / 0.7))
  const x = useTransform(t, (v) => mix(60, 262, p(v)))
  const y = useTransform(t, (v) => mix(y0, y1, p(v)) - Math.sin(p(v) * Math.PI) * 70)
  const opacity = useTransform(t, (v) => (v < at || v > at + 0.72 ? 0 : 1))
  const rotate = useTransform(t, (v) => Math.sin(p(v) * Math.PI) * -10)
  return <motion.div style={{ position: 'absolute', left: 0, top: 0, x, y, opacity, rotate, zIndex: 10, padding: '8px 12px', borderRadius: 10, background: c, fontWeight: 800, fontSize: 13, boxShadow: `0 10px 30px ${c}88`, whiteSpace: 'nowrap' }}>{n}</motion.div>
}

function Cta({ s }) {
  const a = s.cta.start
  const opts = ['Weekly 🔁', 'Kundentermin 🤝', 'Projekt-Kickoff 🚀', '1:1-Gespräch ☕']
  const t = useT()
  const pick = a + 2.4
  return (
    <Scene at={a - 0.1}>
      <E at={a} dur={0.5} style={{ position: 'absolute', top: 92, left: 0, right: 0, textAlign: 'center' }}>
        <span style={pill(A)}>💬 Deine Wahl?</span>
        <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 32, letterSpacing: -1, marginTop: 12, lineHeight: 1.1 }}>Welches Meeting<br />automatisierst du zuerst?</div>
      </E>
      <div style={{ position: 'absolute', top: 250, left: 50, right: 50, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {opts.map((o, i) => <Choice key={o} o={o} at={a + 0.6 + i * 0.15} sel={i === 0 ? pick : null} i={i} />)}
      </div>
      <E at={pick + 0.4} dur={0.45} from={{ y: 20 }} style={{ position: 'absolute', top: 440, left: 50, right: 50 }}>
        <div style={{ ...card({ borderRadius: 16 }), padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 99, background: C.violet, display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 800 }}>Du</div>
          <Type at={pick + 0.6} text="Unser Weekly! Dauert immer ewig 🙈" cps={22} style={{ fontSize: 15, fontWeight: 600 }} />
        </div>
      </E>
      <Burst at={pick + 0.02} x={160} y={280} n={18} colors={[A, '#fff', C.violet]} spread={120} />
      <Cursor keys={[{ t: a + 1.3, x: 450, y: 600 }, { t: pick - 0.15, x: 170, y: 285 }, { t: pick + 2, x: 190, y: 330 }]} taps={[pick]} />
    </Scene>
  )
}

function Choice({ o, at, sel, i }) {
  const t = useT()
  const bg = useTransform(t, (v) => (sel && v > sel ? A : 'rgba(255,255,255,.06)'))
  const col = useTransform(t, (v) => (sel && v > sel ? '#000' : '#fff'))
  const sc = useTransform(t, (v) => (sel ? 1 + 0.08 * Math.max(0, 1 - Math.abs(v - sel - 0.1) / 0.25) : 1))
  return (
    <E at={at} dur={0.45} from={{ scale: 0.6 }} ease={EASE.back}>
      <Floaty phase={i} amp={3}>
        <motion.div style={{ ...card({ borderRadius: 16 }), background: bg, color: col, scale: sc, padding: '18px 10px', textAlign: 'center', fontWeight: 800, fontSize: 16 }}>{o}</motion.div>
      </Floaty>
    </E>
  )
}
