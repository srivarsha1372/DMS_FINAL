#!/usr/bin/env node
// Prove a converted deck (to-artifact.mjs output) works the way the claude.ai
// Artifact viewer will run it: wrapped in the tool's own document skeleton and
// loaded in a SANDBOXED, opaque-origin iframe (no allow-same-origin), served
// over http. That is a harsher place than `dist-single/` over file://:
//   - localStorage / sessionStorage throw SecurityError
//   - keyboard input only reaches the deck once the frame has focus
//   - nothing outside the page can be fetched
// so a deck that passes marker-check.mjs can still fail here.
//
// Checks: no uncaught errors; the deck renders; arrow keys change slide; the
// annotation marker opens (M), draws (pen + highlighter), undoes (Ctrl+Z), keeps
// ink per slide across navigation, and hides with H.
//
// Usage (from anywhere; playwright is resolved from the session's node_modules):
//   node artifact-check.mjs <session>/dist-artifact/<htmlName>.html [--session <dir>]
// CHROME_PATH picks the browser, as for every other harness in the kit.
// Exits 1 on any failure.

import { createServer } from 'node:http'
import { createRequire } from 'node:module'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const args = process.argv.slice(2)
let sessionDir = null
const pos = []
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--session') sessionDir = args[++i]
  else pos.push(args[i])
}
const [pagePath] = pos
if (!pagePath || !existsSync(pagePath)) {
  console.error('usage: node artifact-check.mjs <dist-artifact/page.html> [--session <deck dir>]')
  process.exit(2)
}
// dist-artifact/<name>.html → the session is two levels up.
sessionDir = resolve(sessionDir ?? resolve(dirname(resolve(pagePath)), '..'))
let chromium
try {
  ;({ chromium } = createRequire(resolve(sessionDir, 'package.json'))('playwright'))
} catch {
  console.error(`playwright not found under ${sessionDir}/node_modules: run npm install there, or pass --session`)
  process.exit(2)
}

// What the Artifact tool does to a page before serving it.
const inner = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>${readFileSync(pagePath, 'utf8')}</body></html>`
const host = `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#222}</style></head><body>
<iframe id="art" src="/inner.html" sandbox="allow-scripts allow-popups allow-forms" allow="fullscreen" style="display:block;width:1280px;height:720px;border:0"></iframe>
</body></html>`
const server = createServer((req, res) => {
  const body = req.url.startsWith('/inner.html') ? inner : host
  res.writeHead(200, {
    'content-type': 'text/html; charset=utf-8',
    // a strict CSP in the spirit of the artifact host: nothing external
    'content-security-policy': "default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval' blob:; style-src 'unsafe-inline'; img-src data: blob:; font-src data:; media-src data: blob:; connect-src 'none'; frame-src 'self'",
  })
  res.end(body)
}).listen(0)
const port = server.address().port

const rows = []
const check = (name, ok, note = '') => (rows.push({ ok: !!ok, name, note }), !!ok)

const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {})
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
const errs = []
page.on('console', (m) => m.type() === 'error' && errs.push(m.text()))
page.on('pageerror', (e) => errs.push(`PAGEERROR ${e.message}`))
// Uncaught errors inside the iframe do not reach page.on('pageerror'); trap them in-frame.
await page.addInitScript(() => {
  window.__errs = []
  addEventListener('error', (e) => window.__errs.push(String(e.message || e)))
  addEventListener('unhandledrejection', (e) => window.__errs.push('rejection: ' + String(e.reason)))
})
await page.goto(`http://127.0.0.1:${port}/`)
const frame = await (await page.waitForSelector('#art')).contentFrame()
await frame.waitForLoadState('load')
await page.waitForTimeout(1800)

const storage = await frame.evaluate(() => { try { localStorage.getItem('x'); return 'available' } catch { return 'blocked' } })
check('sandbox is opaque-origin (localStorage blocked, as in the viewer)', storage === 'blocked', storage)
// Slide 1 is usually the full-bleed brand frame, which has no [data-slide-stage];
// the player writing `#/1-…` into the URL is the proof it mounted (and that
// history.replaceState is allowed in an opaque-origin frame).
const mounted = await frame.evaluate(() => ({
  root: document.getElementById('root')?.childElementCount ?? 0,
  hash: location.hash,
}))
check('the deck renders and the player tracks the slide', mounted.root > 0 && /^#\/1\b/.test(mounted.hash), JSON.stringify(mounted))

const slideNo = () => frame.evaluate(() => +(location.hash.match(/#\/(\d+)/)?.[1] ?? 1))
const inks = () => frame.evaluate(() => {
  const svg = document.querySelector('svg.absolute.inset-0.z-20')
  return svg ? svg.querySelectorAll('[data-ink]').length : -1
})
async function drag(pts) {
  await page.mouse.move(...pts[0]); await page.mouse.down()
  for (const p of pts.slice(1)) await page.mouse.move(...p, { steps: 6 })
  await page.mouse.up(); await page.waitForTimeout(150)
}
const key = async (k, wait = 350) => { await page.keyboard.press(k); await page.waitForTimeout(wait) }

// A viewer clicks into the page before typing; give the frame focus the same way
// a real click would, without the click itself advancing a build.
await frame.evaluate(() => { window.focus(); document.body.tabIndex = -1; document.body.focus() })

const s0 = await slideNo()
for (let i = 0; i < 12 && (await slideNo()) === s0; i++) await key('ArrowRight', 500)
const s1 = await slideNo()
check('arrow keys move to the next slide inside the frame', s1 > s0, `slide ${s0} → ${s1}`)

await key('m')
check('M opens the marker toolbar', await frame.evaluate(() => !!document.querySelector('[data-marker-toolbar]')))
await drag([[300, 320], [360, 360], [420, 320], [480, 380]])
check('a pen stroke commits', (await inks()) === 1, `inks=${await inks()}`)
await key('3', 150)
await drag([[300, 420], [600, 420]])
check('a highlighter stroke commits', (await inks()) === 2, `inks=${await inks()}`)
await key('Control+z', 200)
check('Ctrl+Z undoes the last stroke', (await inks()) === 1, `inks=${await inks()}`)

await key('Escape')
check('Esc puts the pen down and keeps the ink', (await inks()) === 1, `inks=${await inks()}`)
const before = await slideNo()
for (let i = 0; i < 12 && (await slideNo()) === before; i++) await key('ArrowRight', 500)
check('another slide carries no ink', (await inks()) <= 0, `slide ${await slideNo()}, inks=${await inks()}`)
for (let i = 0; i < 12 && (await slideNo()) !== before; i++) await key('ArrowLeft', 500)
// coming back lands on the slide's last build step, so every stamped stroke shows
check('returning to the slide brings its ink back', (await inks()) === 1, `slide ${await slideNo()}, inks=${await inks()}`)
// H is a marker key: it acts while the marker is open (as in marker-check.mjs).
await key('m')
await key('h', 200)
check('H hides the ink without erasing it', (await inks()) === 0, `inks=${await inks()}`)
await key('h', 200)
check('H brings it back', (await inks()) === 1, `inks=${await inks()}`)
await key('Escape')

const inFrame = await frame.evaluate(() => window.__errs)
const allErrs = [...errs, ...inFrame].filter((e) => !/favicon/i.test(e))
check('no uncaught errors or console errors', allErrs.length === 0, allErrs.slice(0, 3).join(' | '))

await browser.close()
server.close()

const failed = rows.filter((r) => !r.ok)
console.log(`\nartifact-check  ·  ${rows.length - failed.length}/${rows.length} passed\n`)
for (const r of rows) console.log(`  ${r.ok ? 'ok  ' : 'FAIL'}  ${r.name}${r.note ? `   (${r.note})` : ''}`)
console.log(failed.length ? '\n  NOT READY: fix before publishing.\n' : '\n  CLEAN: the deck and its marker work inside a sandboxed artifact frame.\n')
process.exit(failed.length ? 1 : 0)
