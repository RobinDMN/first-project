// Folge 4 – „E-Mail rein, CRM fertig“ (Automatisierung mit Zapier, Make, n8n)
import { motion, useTransform } from 'framer-motion'
import { useT, useSegs, useF, wt, E, Scene, Type, Count, Cursor, Burst, C, cl, EASE, mix, card, pill } from '../core.jsx'

const A = C.amber

export default function V4() {
  const s = useSegs()
  return (
    <>
      <CopyPaste s={s} />
      <Flow s={s} />
      <Tools s={s} />
      <Tip s={s} />
      <Cta s={s} />
    </>
  )
}

function Key({ label, at, every, offset }) {
  const t = useT()
  const press = (v) => { if (v < at) return 0; const ph = ((v - at + offset) % every) / every; return ph < 0.18 ? 1 - ph / 0.18 : 0 }
  const y = useTransform(t, (v) => press(v) * 8)
  const sh = useTransform(t, (v) => `0 ${10 - press(v) * 8}px 0 #3a3a4a, 0 18px 40px rgba(0,0,0,.5)`)
  const bg = useTransform(t, (v) => (press(v) > 0.2 ? A : '#f2f2f6'))
  return (
    <motion.div style={{ y, boxShadow: sh, background: bg, width: 150, height: 120, borderRadius: 22, color: '#111', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 18, fontWeight: 700, opacity: 0.6 }}>Strg</div>
      <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 48, lineHeight: 1 }}>{label}</div>
    </motion.div>
  )
}

function CopyPaste({ s }) {
  const a = s.hook.start, end = s.intro.start, stamp = a + s.hook.dur * 0.62
  const t = useT()
  const n = useTransform(t, (v) => `${Math.min(47, Math.max(0, Math.floor((v - a - 0.3) * 6.5)))}×`)
  return (
    <Scene at={0} out={end - 0.15} from={{ scale: 1, blur: 0 }}>
      <E at={a} dur={0.5} style={{ position: 'absolute', top: 100, left: 0, right: 0, textAlign: 'center' }}>
        <div style={{ fontSize: 15, color: C.mute, fontWeight: 700 }}>HEUTE SCHON KOPIERT</div>
        <motion.div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 76, letterSpacing: -3, lineHeight: 1 }}>{n}</motion.div>
      </E>
      <E at={a + 0.2} dur={0.5} from={{ y: 60 }} style={{ position: 'absolute', top: 290, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 26 }}>
        <Key label="C" at={a + 0.3} every={0.3} offset={0} />
        <Key label="V" at={a + 0.3} every={0.3} offset={0.15} />
      </E>
      <E at={stamp} dur={0.28} from={{ scale: 3.2, rotate: -30, blur: 0 }} ease={EASE.out} style={{ position: 'absolute', top: 300, left: 0, right: 0, textAlign: 'center', zIndex: 5 }}>
        <div style={{ display: 'inline-block', padding: '10px 26px', border: `6px solid ${C.coral}`, color: C.coral, borderRadius: 16, fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 64, rotate: '-12deg', background: 'rgba(6,6,11,.75)', letterSpacing: 2 }}>STOPP</div>
      </E>
    </Scene>
  )
}

// Knoten im Workflow (Koordinaten im 540×960-Raster)
const NODES = [
  { id: 'mail', x: 40, y: 110, e: '✉️', t: 'E-Mail', sub: 'Neue Anfrage' },
  { id: 'ai', x: 300, y: 110, e: '🧠', t: 'KI', sub: 'Daten erkennen' },
  { id: 'crm', x: 40, y: 260, e: '🗂', t: 'CRM', sub: 'Kontakt anlegen' },
  { id: 'chat', x: 300, y: 260, e: '🔔', t: 'Team-Chat', sub: 'Vertrieb informieren' },
]
const NW = 200, NH = 82

function Flow({ s }) {
  const a = s.intro.start, ex = s.extract.start, cr = s.crm.start, end = s.tools.start
  const nodeAt = [a + 0.4, a + 0.8, a + 1.2, a + 1.6]
  const t = useT()
  const pulse = (k, at) => useTransform(t, (v) => (v > at ? `0 0 0 2px ${A}, 0 0 40px ${A}66` : '0 10px 30px rgba(0,0,0,.4)'))
  const glow = [pulse(0, ex + 0.2), pulse(1, ex + 2.0), pulse(2, cr + 0.4), pulse(3, cr + 2.4)]
  return (
    <Scene at={a - 0.1} out={end - 0.15}>
      <svg width="540" height="400" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <Wire d={`M ${40 + NW} ${110 + NH / 2} L 300 ${110 + NH / 2}`} at={a + 1.8} flow={ex + 1.4} />
        <Wire d={`M ${300 + NW / 2} ${110 + NH} C ${400} 230, ${140} 200, ${140} 260`} at={a + 2.1} flow={cr + 0.0} />
        <Wire d={`M ${40 + NW} ${260 + NH / 2} L 300 ${260 + NH / 2}`} at={a + 2.4} flow={cr + 2.0} />
      </svg>
      {NODES.map((n, i) => (
        <E key={n.id} at={nodeAt[i]} dur={0.5} from={{ scale: 0.4, y: 0 }} ease={EASE.back} style={{ position: 'absolute', left: n.x, top: n.y }}>
          <motion.div style={{ ...card({ borderRadius: 18 }), boxShadow: glow[i], width: NW, height: NH, display: 'flex', alignItems: 'center', gap: 12, padding: '0 14px' }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, background: `${A}22`, display: 'grid', placeItems: 'center', fontSize: 24 }}>{n.e}</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16 }}>{n.t}</div>
              <div style={{ fontSize: 12, color: C.mute, fontWeight: 600 }}>{n.sub}</div>
            </div>
          </motion.div>
        </E>
      ))}
      <Detail s={s} />
      <Stopwatch at={ex + 0.2} stop={cr + 2.6} />
    </Scene>
  )
}

function Wire({ d, at, flow }) {
  const t = useT()
  const len = useTransform(t, (v) => EASE.inOut(cl((v - at) / 0.6)))
  const dash = useTransform(t, (v) => -v * 60)
  const pk = useTransform(t, (v) => (v > flow && v < flow + 0.9 ? 1 : 0))
  const off = useTransform(t, (v) => `${cl((v - flow) / 0.9) * 100}%`)
  return (
    <>
      <motion.path d={d} stroke="rgba(255,255,255,.25)" strokeWidth="3" fill="none" strokeLinecap="round" style={{ pathLength: len }} />
      <motion.path d={d} stroke={A} strokeWidth="3" fill="none" strokeDasharray="6 14" style={{ strokeDashoffset: dash, opacity: len }} />
      <motion.circle r="9" fill={A} style={{ offsetPath: `path("${d}")`, offsetDistance: off, opacity: pk, filter: `drop-shadow(0 0 10px ${A})` }} />
    </>
  )
}

function Stopwatch({ at, stop }) {
  const v = useF((x) => (Math.max(0, Math.min(x, stop) - at) * 0.62).toFixed(1).replace('.', ',') + ' s')
  const col = useF((x) => (x > stop ? C.green : '#fff'))
  return (
    <E at={at} dur={0.4} from={{ scale: 0.5, y: 0 }} ease={EASE.back} style={{ position: 'absolute', top: 66, right: 26 }}>
      <motion.div style={{ ...pill('#ffffff', { fontSize: 14, padding: '6px 12px' }), color: col }}>⏱ <motion.span>{v}</motion.span></motion.div>
    </E>
  )
}

function Hl({ at, children, c = A }) {
  const t = useT()
  const sx = useTransform(t, (v) => EASE.out(cl((v - at) / 0.35)))
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <motion.span style={{ position: 'absolute', inset: '-1px -3px', background: `${c}55`, borderRadius: 5, scaleX: sx, transformOrigin: '0 50%' }} />
      <span style={{ position: 'relative' }}>{children}</span>
    </span>
  )
}

function Detail({ s }) {
  const ex = s.extract.start, cr = s.crm.start, d = s.extract.dur
  const hl = [wt(s.extract, 'Name'), wt(s.extract, 'Firma'), wt(s.extract, 'Anliegen')]
  const chips = [['👤', 'Jana Weber'], ['🏢', 'Weber GmbH'], ['🎯', 'Angebot · 20 Lizenzen']]
  return (
    <>
      <E at={ex} out={cr - 0.1} dur={0.5} from={{ y: 40 }} style={{ position: 'absolute', top: 380, left: 34, right: 34 }}>
        <div style={{ ...card({ background: '#fff' }), color: '#222', padding: 16, fontSize: 14.5, lineHeight: 1.5 }}>
          <div style={{ fontSize: 12, color: '#888', fontWeight: 700, marginBottom: 6 }}>Von: j.weber@… · Betreff: Anfrage</div>
          Hallo, ich bin <Hl at={hl[0]}>Jana Weber</Hl> von der <Hl at={hl[1]}>Weber GmbH</Hl>. Wir hätten gern ein <Hl at={hl[2]}>Angebot für 20 Lizenzen</Hl>.
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
          {chips.map(([e, l], i) => (
            <E key={l} at={hl[i] + 0.3} dur={0.4} from={{ y: -30, scale: 0.5 }} ease={EASE.back}>
              <span style={pill(A, { fontSize: 13 })}>{e} {l}</span>
            </E>
          ))}
        </div>
      </E>
      <E at={cr} dur={0.5} from={{ y: 40 }} style={{ position: 'absolute', top: 380, left: 34, right: 34 }}>
        <div style={{ ...card(), padding: 16 }}>
          <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 8 }}>🗂 Neuer Kontakt</div>
          {chips.map(([e, l], i) => (
            <div key={l} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '6px 0', borderTop: i ? `1px solid ${C.line}` : 'none', fontSize: 14 }}>
              <span style={{ width: 70, color: C.mute, fontWeight: 600 }}>{['Name', 'Firma', 'Anliegen'][i]}</span>
              <b><Type at={cr + 0.4 + i * 0.35} text={l} cps={40} cursor={false} /></b>
            </div>
          ))}
        </div>
        <E at={cr + 2.6} dur={0.45} from={{ x: 120, y: 0 }} ease={EASE.back}>
          <div style={{ marginTop: 10, ...card({ borderRadius: 16, background: '#1d1d2b' }), padding: '10px 14px', display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ fontSize: 22 }}>🔔</div>
            <div style={{ fontSize: 13.5 }}><b>#vertrieb</b> · Neuer Lead: Weber GmbH – Angebot für 20 Lizenzen</div>
          </div>
        </E>
      </E>
    </>
  )
}

function Tools({ s }) {
  const a = s.tools.start, end = s.tip.start, d = s.tools.dur
  const tools = [['Zapier', 'Tausende App-Verbindungen', wt(s.tools, 'Zapier') - 0.15], ['Make', 'Visuelle Abläufe', wt(s.tools, 'Make') - 0.15], ['n8n', 'Open Source', wt(s.tools, 'n8n') - 0.15]]
  return (
    <Scene at={a - 0.1} out={end - 0.15}>
      <E at={a} dur={0.5} style={{ position: 'absolute', top: 92, left: 0, right: 0, textAlign: 'center' }}>
        <span style={pill(A)}>🧰 Tool-Check</span>
      </E>
      <div style={{ position: 'absolute', top: 150, left: 46, right: 46, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {tools.map(([n, sub, at], i) => (
          <E key={n} at={at} dur={0.5} from={{ x: 100, y: 0, blur: 8 }} ease={EASE.back}>
            <div style={{ ...card(), padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, borderColor: i === 2 ? `${A}aa` : C.line }}>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 30, width: 110 }}>{n}</div>
              <div style={{ fontSize: 13.5, color: C.mute, fontWeight: 600, flex: 1 }}>{sub}</div>
            </div>
          </E>
        ))}
        <E at={wt(s.tools, 'eigenen')} dur={0.5} from={{ scale: 0.4, y: 0 }} ease={EASE.back} style={{ alignSelf: 'flex-end' }}>
          <span style={pill(C.green, { fontSize: 15 })}>🔒 n8n läuft auch auf eigenen Servern</span>
        </E>
      </div>
    </Scene>
  )
}

function Tip({ s }) {
  const a = s.tip.start, end = s.cta.start, d = s.tip.dur
  const words = [['1 Aufgabe.', '#fff', wt(s.tip, 'einzigen') - 0.1], ['Jeden Tag.', '#fff', wt(s.tip, 'jeden') - 0.1], ['Automatisieren.', A, wt(s.tip, 'nervt') + 0.2]]
  return (
    <Scene at={a - 0.1} out={end - 0.15}>
      <E at={a} dur={0.5} style={{ position: 'absolute', top: 96, left: 0, right: 0, textAlign: 'center' }}>
        <span style={pill(A)}>💡 Mein Tipp</span>
      </E>
      <div style={{ position: 'absolute', top: 190, left: 40, right: 40 }}>
        {words.map(([w, c, at], i) => (
          <E key={w} at={at} dur={0.45} from={{ x: -80, y: 0, blur: 12 }} ease={EASE.back}>
            <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: i === 2 ? 58 : 64, letterSpacing: -2.5, lineHeight: 1.1, color: c }}>{w}</div>
          </E>
        ))}
      </div>
    </Scene>
  )
}

function Cta({ s }) {
  const a = s.cta.start
  const send = a + 3.6
  return (
    <Scene at={a - 0.1}>
      <E at={a} dur={0.5} style={{ position: 'absolute', top: 96, left: 0, right: 0, textAlign: 'center' }}>
        <span style={pill(A)}>💬 Kommentiere</span>
        <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 32, letterSpacing: -1, marginTop: 12, lineHeight: 1.1 }}>Welche Aufgabe<br />nervt dich am meisten?</div>
      </E>
      <E at={a + 0.6} dur={0.5} from={{ y: 40 }} out={send + 0.05} outDur={0.3} to={{ y: -60, scale: 0.9 }} style={{ position: 'absolute', top: 280, left: 40, right: 40 }}>
        <div style={{ ...card({ borderRadius: 99 }), padding: '10px 10px 10px 22px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Type at={a + 1.0} text="Rechnungen abtippen 😩" cps={14} style={{ fontSize: 17, fontWeight: 600, flex: 1 }} />
          <div style={{ width: 44, height: 44, borderRadius: 99, background: A, color: '#000', display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: 20 }}>➤</div>
        </div>
      </E>
      <E at={send + 0.2} dur={0.5} from={{ y: 40, scale: 0.8 }} ease={EASE.back} style={{ position: 'absolute', top: 260, left: 40, right: 40 }}>
        <div style={{ ...card(), padding: 16 }}>
          <div style={{ fontSize: 12, color: C.mute, fontWeight: 700 }}>@du · gerade eben</div>
          <div style={{ fontSize: 17, fontWeight: 700, marginTop: 4 }}>Rechnungen abtippen 😩</div>
          <div style={{ fontSize: 13, color: A, fontWeight: 700, marginTop: 8 }}>♥ Gefällt mir · Antworten</div>
        </div>
      </E>
      <Burst at={send + 0.2} x={270} y={300} n={22} colors={[A, C.coral, '#fff']} spread={150} />
      <Cursor keys={[{ t: a + 2.4, x: 450, y: 600 }, { t: send - 0.2, x: 452, y: 304 }, { t: send + 1.5, x: 460, y: 340 }]} taps={[send]} />
    </Scene>
  )
}
