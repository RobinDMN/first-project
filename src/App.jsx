import { useEffect, useRef, useState } from 'react'
import { useMotionValue } from 'framer-motion'
import { TimeCtx, VideoCtx, C } from './core.jsx'
import { Background, Header, Captions } from './frame.jsx'
import timings from './timings.json'
import V1 from './videos/V1.jsx'
import V2 from './videos/V2.jsx'
import V3 from './videos/V3.jsx'
import V4 from './videos/V4.jsx'
import V5 from './videos/V5.jsx'

export const VIDEOS = {
  v1: { C: V1, ep: 1, label: 'Status', accent: C.lime, accent2: C.violet },
  v2: { C: V2, ep: 2, label: 'Meetings', accent: C.cyan, accent2: C.violet },
  v3: { C: V3, ep: 3, label: 'Kundenservice', accent: C.violet, accent2: C.cyan },
  v4: { C: V4, ep: 4, label: 'Automatisierung', accent: C.amber, accent2: C.coral },
  v5: { C: V5, ep: 5, label: 'Einführung', accent: C.coral, accent2: C.violet },
}

const W = 540, H = 960
const params = new URLSearchParams(location.search)

export function Stage({ id, t }) {
  const v = VIDEOS[id], tm = timings[id]
  const Body = v.C
  return (
    <TimeCtx.Provider value={t}>
      <VideoCtx.Provider value={tm}>
        <div style={{ position: 'relative', width: W, height: H, overflow: 'hidden', background: C.bg, color: C.ink,
          fontFamily: 'Inter, sans-serif' }}>
          <Background accent={v.accent} accent2={v.accent2} />
          <Body />
          <Header ep={v.ep} accent={v.accent} label={v.label} />
          <Captions accent={v.accent} />
        </div>
      </VideoCtx.Provider>
    </TimeCtx.Provider>
  )
}

function RenderMode({ id }) {
  const t = useMotionValue(0)
  useEffect(() => {
    window.__duration = timings[id].duration
    window.__setTime = (x) => t.set(x)
    document.fonts.ready.then(() => { window.__ready = true })
  }, [])
  return <Stage id={id} t={t} />
}

function Player({ id }) {
  const t = useMotionValue(0)
  const audio = useRef(null)
  const [playing, setPlaying] = useState(false)
  const scale = Math.min(1, (window.innerHeight - 120) / H)
  useEffect(() => {
    let raf
    const loop = () => { if (audio.current) t.set(audio.current.currentTime); raf = requestAnimationFrame(loop) }
    loop()
    return () => cancelAnimationFrame(raf)
  }, [])
  const toggle = () => {
    const a = audio.current
    if (a.paused) { if (a.ended) a.currentTime = 0; a.play(); setPlaying(true) } else { a.pause(); setPlaying(false) }
  }
  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: 16 }}>
      <nav style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        {Object.entries(VIDEOS).map(([k, v]) => (
          <a key={k} href={`?v=${k}`} style={{ color: k === id ? '#000' : '#fff', background: k === id ? v.accent : '#222', padding: '6px 12px', borderRadius: 99, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
            {v.ep}. {v.label}
          </a>
        ))}
      </nav>
      <div onClick={toggle} style={{ width: W * scale, height: H * scale, cursor: 'pointer', borderRadius: 18, overflow: 'hidden' }}>
        <div style={{ transform: `scale(${scale})`, transformOrigin: '0 0' }}><Stage id={id} t={t} /></div>
      </div>
      <audio ref={audio} src={`audio/${id}_mix.m4a`} onEnded={() => setPlaying(false)} />
      <div style={{ fontSize: 13, opacity: 0.6 }}>{playing ? 'Klick zum Pausieren' : 'Klick aufs Video zum Abspielen'}</div>
    </div>
  )
}

export default function App() {
  const id = params.get('v') || 'v1'
  return params.has('render') ? <RenderMode id={id} /> : <Player id={id} />
}
