// Folge 3 – „Kundenservice um 3 Uhr nachts“ (KI-Agenten im Support)
import { motion, useTransform } from 'framer-motion'
import { useT, useSegs, useF, wt, E, Scene, Type, Cursor, Burst, C, cl, EASE, mix, card, pill } from '../core.jsx'
import { Floaty } from './V1.jsx'

const A = C.violet

export default function V3() {
  const s = useSegs()
  return (
    <>
      <Night s={s} />
      <Agent s={s} />
      <Chat s={s} />
      <Tools s={s} />
      <Knowledge s={s} />
      <Handoff s={s} />
      <Cta s={s} />
    </>
  )
}

function Stars() {
  const st = Array.from({ length: 26 }, (_, i) => ({ x: (i * 97) % 520, y: 70 + ((i * 53) % 300), s: 1 + (i % 3), ph: i }))
  return st.map((p, i) => <Star key={i} p={p} />)
}
function Star({ p }) {
  const o = useF((v) => 0.25 + 0.75 * Math.abs(Math.sin(v * 1.7 + p.ph)))
  return <motion.div style={{ position: 'absolute', left: p.x, top: p.y, width: p.s * 2, height: p.s * 2, borderRadius: 9, background: '#fff', opacity: o }} />
}

/** iPhone-ähnlicher Rahmen (generisch) */
function Phone({ children, top = 250, h = 330 }) {
  return (
    <div style={{ position: 'absolute', top, left: 95, width: 350, height: h, borderRadius: 38, background: '#0d0d16', border: '2px solid rgba(255,255,255,.14)',
      boxShadow: '0 30px 80px rgba(0,0,0,.6)', overflow: 'hidden', padding: '36px 16px 16px' }}>
      <div style={{ position: 'absolute', top: 10, left: '50%', marginLeft: -45, width: 90, height: 22, borderRadius: 20, background: '#000' }} />
      {children}
    </div>
  )
}

const Bub = ({ me, children, style }) => (
  <div style={{ maxWidth: '82%', marginLeft: me ? 'auto' : 0, padding: '10px 13px', borderRadius: me ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
    background: me ? '#2f7bff' : 'rgba(255,255,255,.1)', fontSize: 14.5, fontWeight: 600, lineHeight: 1.35, ...style }}>{children}</div>
)

function Night({ s }) {
  const a = s.hook.start, end = s.agent.start
  const t = useT()
  const sleepO = useTransform(t, (v) => 0.4 + 0.6 * Math.abs(Math.sin(v * 2)))
  return (
    <Scene at={0} out={end - 0.15} from={{ scale: 1, blur: 0 }}>
      <Stars />
      <E at={a} dur={0.8} from={{ y: 40, blur: 14 }} style={{ position: 'absolute', top: 80, left: 0, right: 0, textAlign: 'center' }}>
        <div style={{ fontSize: 46 }}>🌙</div>
        <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 84, letterSpacing: -3, lineHeight: 1 }}>
          03:<FlipMin at={a} />
        </div>
      </E>
      <E at={a + 1.0} dur={0.6} from={{ y: 120 }}>
        <Phone>
          <E at={a + 1.5} dur={0.4} from={{ y: 20, scale: 0.9 }} ease={EASE.back}>
            <Bub me>Hallo? Wo bleibt meine Bestellung? 😤</Bub>
          </E>
          <E at={a + 2.8} dur={0.4} from={{ y: 20 }}>
            <div style={{ marginTop: 18, textAlign: 'center' }}>
              <motion.span style={{ ...pill(C.mute, { fontSize: 13 }), opacity: sleepO }}>💤 Support: offline bis 9:00</motion.span>
            </div>
          </E>
          <E at={a + 3.3} dur={0.4} from={{ y: 10 }}>
            <div style={{ marginTop: 14, textAlign: 'center', fontSize: 13, color: C.coral, fontWeight: 700 }}>⏳ Antwort in ca. 6 Stunden</div>
          </E>
        </Phone>
      </E>
    </Scene>
  )
}

function FlipMin({ at }) {
  const v = useF((x) => String(Math.min(2, Math.max(0, Math.floor((x - at - 0.3) * 1.2)))).padStart(2, '0'))
  return <motion.span>{v}</motion.span>
}

export function Orb({ size = 150, pulse = true }) {
  const t = useT()
  const r = (k) => useTransform(t, (v) => 1 + (((v * 0.7 + k / 3) % 1)) * 0.8)
  const o = (k) => useTransform(t, (v) => 0.6 * (1 - (((v * 0.7 + k / 3) % 1))))
  const rings = [0, 1, 2].map((k) => ({ s: r(k), o: o(k) }))
  const rot = useTransform(t, (v) => v * 40)
  const br = useTransform(t, (v) => 1 + Math.sin(v * 3) * 0.03)
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      {pulse && rings.map((rg, k) => <motion.div key={k} style={{ position: 'absolute', inset: 0, borderRadius: 999, border: `2px solid ${A}`, scale: rg.s, opacity: rg.o }} />)}
      <motion.div style={{ position: 'absolute', inset: 0, borderRadius: 999, scale: br,
        background: `conic-gradient(from 0deg, ${A}, ${C.cyan}, ${C.coral}, ${A})`, rotate: rot, filter: 'blur(1px)', boxShadow: `0 0 80px ${A}aa` }} />
      <div style={{ position: 'absolute', inset: 10, borderRadius: 999, background: `radial-gradient(circle at 35% 30%, #ffffffdd, ${A}55 45%, #120a33 85%)` }} />
    </div>
  )
}

function Agent({ s }) {
  const a = s.agent.start, end = s.action.start
  const langs = ['Hallo! 👋', 'Hello! 👋', '¡Hola! 👋', 'Merhaba! 👋', 'Cześć! 👋', 'Bonjour ! 👋']
  return (
    <Scene at={a - 0.1} out={end - 0.15} from={{ scale: 0.8, blur: 14 }}>
      <div style={{ position: 'absolute', top: 120, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <Orb size={170} />
      </div>
      <E at={a + 0.4} dur={0.4} from={{ scale: 0.5 }} ease={EASE.back} style={{ position: 'absolute', top: 92, left: 0, right: 0, textAlign: 'center' }}>
        <span style={pill(C.green, { fontSize: 13 })}>● KI-Agent online</span>
      </E>
      <E at={a + 1.0} dur={0.5} from={{ y: 20 }} style={{ position: 'absolute', top: 340, left: 0, right: 0, textAlign: 'center' }}>
        <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 72, letterSpacing: -3, lineHeight: 1 }}>24/7</div>
      </E>
      <div style={{ position: 'absolute', top: 440, left: 0, right: 0, height: 60 }}>
        {langs.map((l, i) => {
          const st = a + 2.2 + i * 0.45
          return (
            <E key={l} at={st} dur={0.25} out={i === langs.length - 1 ? Infinity : st + 0.4} outDur={0.12} from={{ y: 24, blur: 4 }} to={{ y: -24 }}
              style={{ position: 'absolute', inset: 0, textAlign: 'center' }}>
              <span style={{ ...pill(A, { fontSize: 22, padding: '10px 20px' }), color: '#fff' }}>{l}</span>
            </E>
          )
        })}
      </div>
    </Scene>
  )
}

function Chat({ s }) {
  const a = s.action.start, end = s.tools.start, d = s.action.dur
  const t = useT()
  const look = a + 1.2, act = a + d * 0.62
  const spin = useTransform(t, (v) => v * 400)
  const ld = (v) => v > act + 1.0
  const spO = useTransform(t, (v) => (ld(v) ? 0 : 1))
  const okO = useTransform(t, (v) => (ld(v) ? 1 : 0))
  const track = useTransform(t, (v) => cl((v - act - 1.2) / 0.9))
  return (
    <Scene at={a - 0.1} out={end - 0.15}>
      <Phone top={86} h={500}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{ width: 30, height: 30, borderRadius: 99, background: `radial-gradient(circle at 35% 30%, #fff, ${A} 50%, #1a0d4d)` }} />
          <div style={{ fontWeight: 800, fontSize: 14 }}>Support-Agent <span style={{ color: C.green, fontSize: 11 }}>● online</span></div>
        </div>
        <Bub me>Wo bleibt meine Bestellung? 😤</Bub>
        <E at={a + 0.3} dur={0.25} out={look} outDur={0.1} from={{ y: 0, blur: 0 }}><Dots /></E>
        <E at={look} dur={0.35} from={{ y: 14 }} ease={EASE.back}>
          <Bub style={{ marginTop: 10 }}>Ich schau sofort nach! 👀<br />Deine Bestellnummer ist <b>#48213</b>, richtig?</Bub>
        </E>
        <E at={act} dur={0.45} from={{ y: 20, scale: 0.9 }} ease={EASE.back}>
          <div style={{ marginTop: 12, padding: 12, borderRadius: 16, border: `1px solid ${A}88`, background: `${A}18` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, fontSize: 13 }}>
              <span style={{ position: 'relative', width: 18, height: 18 }}>
                <motion.span style={{ position: 'absolute', inset: 0, borderRadius: 99, border: `3px solid ${A}`, borderTopColor: 'transparent', rotate: spin, opacity: spO }} />
                <motion.span style={{ position: 'absolute', inset: 0, color: C.green, opacity: okO }}>✓</motion.span>
              </span>
              Aktion: Bestellstatus prüfen
            </div>
            <div style={{ position: 'relative', height: 26, marginTop: 14 }}>
              <div style={{ position: 'absolute', left: 8, right: 8, top: 8, height: 4, background: 'rgba(255,255,255,.15)', borderRadius: 4 }} />
              <motion.div style={{ position: 'absolute', left: 8, right: 8, top: 8, height: 4, background: C.green, borderRadius: 4, scaleX: track, transformOrigin: '0 50%' }} />
              {['📦', '🏭', '🚚', '🏠'].map((e, i) => (
                <div key={i} style={{ position: 'absolute', left: `${i * 31}%`, top: -4, fontSize: 18 }}>{e}</div>
              ))}
            </div>
          </div>
        </E>
        <E at={act + 2.2} dur={0.4} from={{ y: 14 }} ease={EASE.back}>
          <Bub style={{ marginTop: 10 }}>Dein Paket ist unterwegs 🚚 und kommt <b>morgen</b>!</Bub>
        </E>
        <E at={act + 3.0} dur={0.4} from={{ y: 14 }} ease={EASE.back}>
          <Bub me style={{ marginTop: 10 }}>Wow, danke! 😍</Bub>
        </E>
      </Phone>
    </Scene>
  )
}

function Dots() {
  return (
    <div style={{ marginTop: 10, display: 'inline-flex', gap: 5, padding: '12px 14px', borderRadius: 16, background: 'rgba(255,255,255,.1)' }}>
      {[0, 1, 2].map((k) => <Dot key={k} k={k} />)}
    </div>
  )
}
function Dot({ k }) {
  const y = useF((v) => Math.sin(v * 10 - k) * 3)
  return <motion.div style={{ width: 7, height: 7, borderRadius: 9, background: '#fff', y }} />
}

function Tools({ s }) {
  const a = s.tools.start, end = s.knowledge.start
  const tools = [['Intercom Fin', 'Abrechnung pro gelöstem Fall', wt(s.tools, 'Intercom') - 0.2], ['Zendesk AI', 'Agenten für viele Branchen', wt(s.tools, 'Zendesk') - 0.2]]
  return (
    <Scene at={a - 0.1} out={end - 0.15}>
      <E at={a} dur={0.5} style={{ position: 'absolute', top: 92, left: 0, right: 0, textAlign: 'center' }}>
        <span style={pill(A)}>🧰 Tool-Check</span>
      </E>
      <div style={{ position: 'absolute', top: 160, left: 40, right: 40, display: 'flex', flexDirection: 'column', gap: 18 }}>
        {tools.map(([n, d, at], i) => (
          <E key={n} at={at} dur={0.6} from={{ y: 80, rotate: i ? 5 : -5, scale: 0.8 }} ease={EASE.back}>
            <div style={{ ...card({ borderRadius: 26 }), padding: '26px 22px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: -40, top: -40, width: 160, height: 160, borderRadius: 999, background: `radial-gradient(circle, ${i ? C.cyan : A}55, transparent 70%)` }} />
              <div style={{ fontSize: 13, fontWeight: 800, color: i ? C.cyan : A, letterSpacing: 1 }}>KI-AGENT</div>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 36, letterSpacing: -1 }}>{n}</div>
              <div style={{ fontSize: 14, color: C.mute, fontWeight: 600, marginTop: 2 }}>{d}</div>
            </div>
          </E>
        ))}
      </div>
    </Scene>
  )
}

function Knowledge({ s }) {
  const a = s.knowledge.start, end = s.handoff.start
  const docs = [['FAQ', -150, 0], ['Versand', 150, 0.25], ['Retouren', -130, 0.5], ['Preise', 140, 0.75]]
  const t = useT()
  const q = useTransform(t, (v) => cl((v - a - 1.2) / 2.2))
  return (
    <Scene at={a - 0.1} out={end - 0.15}>
      <div style={{ position: 'absolute', top: 210, left: 195, width: 150, height: 150 }}><Orb size={150} /></div>
      {docs.map(([n, dx, dl], i) => <DocFly key={n} n={n} dx={dx} at={a + 0.6 + dl} i={i} />)}
      <E at={a + 1.0} dur={0.5} style={{ position: 'absolute', top: 430, left: 70, right: 70 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 14, marginBottom: 8 }}>
          <span>Wissen = Antwort-Qualität</span><span style={{ color: C.green }}>↑</span>
        </div>
        <div style={{ height: 14, borderRadius: 99, background: 'rgba(255,255,255,.1)', overflow: 'hidden' }}>
          <motion.div style={{ height: '100%', background: `linear-gradient(90deg, ${C.coral}, ${C.amber}, ${C.green})`, scaleX: q, transformOrigin: '0 50%' }} />
        </div>
      </E>
    </Scene>
  )
}

function DocFly({ n, dx, at, i }) {
  const t = useT()
  const p = (v) => EASE.in(cl((v - at - 0.5) / 0.6))
  const y0 = 100 + (i % 2) * 30
  const x = useTransform(t, (v) => mix(270 + dx - 45, 225, p(v)))
  const y = useTransform(t, (v) => mix(y0 + (i > 1 ? 280 : 0), 265, p(v)))
  const sc = useTransform(t, (v) => (1 - p(v) * 0.8) * EASE.back(cl((v - at) / 0.4)))
  const opacity = useTransform(t, (v) => (v < at ? 0 : 1 - cl((v - at - 1.0) / 0.12)))
  return (
    <motion.div style={{ position: 'absolute', left: 0, top: 0, x, y, scale: sc, opacity, padding: '10px 14px', borderRadius: 12, background: '#fff', color: '#111', fontWeight: 800, fontSize: 14, boxShadow: '0 10px 30px rgba(0,0,0,.4)' }}>
      📄 {n}
    </motion.div>
  )
}

function Handoff({ s }) {
  const a = s.handoff.start, end = s.cta.start
  const t = useT()
  const p = (v) => EASE.inOut(cl((v - a - 1.2) / 0.8))
  const bx = useTransform(t, (v) => mix(110, 330, p(v)))
  const by = useTransform(t, (v) => 300 - Math.sin(p(v) * Math.PI) * 60)
  return (
    <Scene at={a - 0.1} out={end - 0.15}>
      <E at={a} dur={0.5} style={{ position: 'absolute', top: 96, left: 0, right: 0, textAlign: 'center' }}>
        <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 34, letterSpacing: -1 }}>Schwieriger Fall? 🤔</div>
      </E>
      <E at={a + 0.2} dur={0.5} from={{ x: -50, y: 0 }} style={{ position: 'absolute', top: 260, left: 60 }}>
        <Orb size={110} pulse={false} />
        <div style={{ textAlign: 'center', marginTop: 10, fontWeight: 800, fontSize: 14 }}>KI-Agent</div>
      </E>
      <E at={a + 0.5} dur={0.5} from={{ x: 50, y: 0 }} style={{ position: 'absolute', top: 260, right: 60, textAlign: 'center' }}>
        <div style={{ width: 110, height: 110, borderRadius: 999, background: 'linear-gradient(135deg, #FFB547, #FF5C7A)', display: 'grid', placeItems: 'center', fontSize: 58 }}>👩‍💼</div>
        <div style={{ marginTop: 10, fontWeight: 800, fontSize: 14 }}>Mensch</div>
      </E>
      <motion.div style={{ position: 'absolute', left: 0, top: 0, x: bx, y: by, fontSize: 34, zIndex: 5 }}>💬</motion.div>
      <E at={a + 2.0} dur={0.45} from={{ y: 20, scale: 0.9 }} ease={EASE.back} style={{ position: 'absolute', top: 440, left: 70, right: 70 }}>
        <div style={{ ...card({ borderRadius: 18 }), padding: '12px 16px', textAlign: 'center', fontWeight: 700, fontSize: 15 }}>
          „Ich übernehme ab hier!“ 👋
        </div>
      </E>
    </Scene>
  )
}

function Cta({ s }) {
  const a = s.cta.start
  const pick = a + 3.4
  const t = useT()
  const fill = (k) => useTransform(t, (v) => (k === 0 && v > pick ? `${A}` : 'rgba(255,255,255,.06)'))
  const f0 = fill(0), f1 = fill(1)
  return (
    <Scene at={a - 0.1}>
      <E at={a} dur={0.5} style={{ position: 'absolute', top: 92, left: 0, right: 0, textAlign: 'center' }}>
        <span style={pill(A)}>🗳️ Abstimmung</span>
        <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 34, letterSpacing: -1, marginTop: 12 }}>Was ist dir lieber?</div>
      </E>
      <div style={{ position: 'absolute', top: 220, left: 46, right: 46, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[['🤖', 'Bot zuerst', f0], ['🙋', 'Mensch zuerst', f1]].map(([e, l, f], i) => (
          <E key={l} at={a + 0.7 + i * 0.25} dur={0.5} from={{ x: i ? 80 : -80, y: 0 }} ease={EASE.back}>
            <Floaty phase={i} amp={4}>
              <motion.div style={{ ...card(), background: f, padding: '20px 22px', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ fontSize: 44 }}>{e}</div>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 28 }}>{l}</div>
              </motion.div>
            </Floaty>
          </E>
        ))}
      </div>
      <Burst at={pick} x={130} y={265} n={20} colors={[A, C.cyan, '#fff']} spread={130} />
      <E at={pick + 0.4} dur={0.45} style={{ position: 'absolute', top: 470, left: 0, right: 0, textAlign: 'center', fontWeight: 800, fontSize: 18 }}>
        Und du? Ab in die Kommentare 👇
      </E>
      <Cursor keys={[{ t: a + 1.8, x: 460, y: 600 }, { t: pick - 0.15, x: 140, y: 265 }, { t: pick + 2, x: 160, y: 300 }]} taps={[pick]} />
    </Scene>
  )
}
