// Rendert ein Short Frame für Frame (1080×1920, 30 fps) und legt die Tonspur darunter.
// Aufruf: node scripts/render.mjs v1 [fps]   (Vite-Dev-Server muss auf :5173 laufen)
import { createRequire } from 'module'
import { spawn } from 'child_process'
import fs from 'fs'
const { chromium } = createRequire(import.meta.url)('playwright')

const id = process.argv[2] || 'v1'
const FPS = +(process.argv[3] || 30)
fs.mkdirSync('output', { recursive: true })
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 540, height: 960 }, deviceScaleFactor: 2 })
page.on('pageerror', (e) => console.error('PAGE ERROR', e.message))
await page.goto(`http://127.0.0.1:5173/?v=${id}&render`)
await page.waitForFunction(() => window.__ready)
const dur = await page.evaluate(() => window.__duration)
const frames = Math.ceil(dur * FPS)

const out = `output/${id}.mp4`
const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
  '-i', `build/${id}_mix.wav`, '-map', '0:v', '-map', '1:a',
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-r', String(FPS),
  '-af', 'apad', '-t', String(frames / FPS), '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] })

const t0 = Date.now()
for (let f = 0; f < frames; f++) {
  await page.evaluate((x) => new Promise((r) => { window.__setTime(x); requestAnimationFrame(() => requestAnimationFrame(r)) }), f / FPS)
  const buf = await page.screenshot({ type: 'jpeg', quality: 92 })
  if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r))
  if (f % 150 === 0) console.log(`${id}: ${f}/${frames} (${((Date.now() - t0) / 1000).toFixed(0)}s)`)
}
ff.stdin.end()
await new Promise((r) => ff.on('close', r))
await browser.close()
console.log(`${id}: fertig → ${out} (${dur.toFixed(1)} s)`)
