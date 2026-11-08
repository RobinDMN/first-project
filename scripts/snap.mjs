// Schnappschüsse eines Videos zu bestimmten Zeitpunkten (zur Kontrolle)
import { createRequire } from 'module'
const { chromium } = createRequire(import.meta.url)('playwright')
const [id, ...times] = process.argv.slice(2)
const out = process.env.OUT || '.'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 540, height: 960 }, deviceScaleFactor: 1 })
p.on('pageerror', (e) => console.log('ERR', e.message))
await p.goto(`http://127.0.0.1:5173/?v=${id}&render`)
await p.waitForFunction(() => window.__ready)
for (const t of times) {
  await p.evaluate((x) => window.__setTime(x), +t)
  await p.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))))
  await p.screenshot({ path: `${out}/${id}_${t}.png` })
}
await b.close()
