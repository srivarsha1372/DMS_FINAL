#!/usr/bin/env node
// EDIT CHECK: proves the Editor controls (src/deck/edit) on the BUILT deck.
//
// The real permission and storage exist only inside a claude.ai Artifact, so this
// harness stands in for the platform: it injects a `window.claude.use` whose `db`
// is one shared document held here in Node, and whose `user.canEdit()` answers
// for the role under test. Then it drives the deck like a person would:
//
//   EDITOR   Edit appears; Hide hides the slide (stored); Delete needs a second
//            press, then stores the delete and moves on; a clicked line can be
//            retyped and Enter stores it; the panel restores a deleted slide.
//   VIEWER   no editor control; the hidden slide is skipped; the retyped line
//            shows; the deleted-then-restored slide is back.
//   OFFLINE  no window.claude (the double-clicked file): no editor control, and
//            every slide is there, exactly as built.
//
// Usage: node edit-check.mjs [built.html]   (default: dist-single/<htmlName>.html)
// Prints one line per check; exits 1 on any failure. Added 2026-11-24.

import { resolve } from 'node:path'
import { chromium } from 'playwright'
import { HTML_FILE, SLIDE_COUNT } from './deck.config.mjs'

const FILE = resolve(process.argv[2] ?? HTML_FILE)
const URL = `file:///${FILE.replace(/\\/g, '/')}`
let failures = 0
const say = (ok, msg) => {
  console.log(`${ok ? '   ok' : ' FAIL'} ${msg}`)
  if (!ok) failures++
}

/* The one shared document every page reads and the editor writes. */
let store = null

const fake = (role) => `
  (() => {
    const listeners = []
    const snap = (body) => ({ exists: !!body, data: () => body || undefined, metadata: { fromCache: false } })
    const ref = {
      async set(d) {
        await window.__editCheckSet(JSON.stringify(d))
        const body = JSON.parse(JSON.stringify(d))
        listeners.forEach((l) => l(snap(body)))
      },
      onSnapshot(next) {
        listeners.push(next)
        window.__editCheckGet().then((s) => next(snap(s ? JSON.parse(s) : null)))
        return () => {}
      },
    }
    const db = { doc: () => ref }
    const user = { canEdit: async () => ${role === 'editor'} }
    window.claude = { use: async (name) => (name === 'db' ? db : name === 'user' ? user : null) }
  })()`

async function open(browser, role, hash = '#/1') {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
  if (role !== 'offline') {
    await page.exposeFunction('__editCheckGet', () => (store ? JSON.stringify(store) : null))
    await page.exposeFunction('__editCheckSet', (s) => {
      store = JSON.parse(s)
    })
    await page.addInitScript(fake(role))
  }
  await page.goto(URL + hash)
  await page.waitForTimeout(2500)
  return page
}

const slideId = (page) => page.evaluate(() => (location.hash.match(/#\/\d+-(.+)$/) || [])[1] || null)
const btn = (page, label) => page.locator(`button[aria-label="${label}"]`)
/* The bar hides until the pointer comes near the bottom, as it does for a presenter. */
async function press(page, label) {
  await page.mouse.move(640, 785)
  await page.waitForTimeout(350)
  await btn(page, label).click()
}

async function allIds(page) {
  const ids = []
  await page.goto(page.url().replace(/#.*$/, '') + '#/1')
  await page.waitForTimeout(1200)
  for (let i = 0; i < SLIDE_COUNT + 2; i++) {
    const id = await slideId(page)
    if (ids[ids.length - 1] === id) break
    ids.push(id)
    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(250)
  }
  return ids
}

const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {})

/* ── EDITOR ─────────────────────────────────────────────────────────────── */
const ed = await open(browser, 'editor', '#/5')
say((await btn(ed, 'Edit text and slides').count()) === 1, 'editor sees the Edit button')
await press(ed, 'Edit text and slides')
await ed.waitForTimeout(400)
say((await btn(ed, 'Hide this slide').count()) === 1 && (await btn(ed, 'Delete this slide').count()) === 1, 'edit mode shows Hide and Delete')

const hiddenId = await slideId(ed)
await press(ed, 'Hide this slide')
await ed.waitForTimeout(400)
say(store?.hidden?.includes(hiddenId) === true, `Hide stores the slide (${hiddenId})`)
say((await btn(ed, 'Show this slide').count()) === 1, 'the button now offers Show')

await ed.keyboard.press('ArrowRight')
await ed.waitForTimeout(900)
const deletedId = await slideId(ed)
await press(ed, 'Delete this slide')
await ed.waitForTimeout(300)
say(!store?.deleted?.includes(deletedId) && (await btn(ed, 'Press again to delete this slide').count()) === 1, 'one press only arms Delete')
await press(ed, 'Press again to delete this slide')
await ed.waitForTimeout(900)
say(store?.deleted?.includes(deletedId) === true, `the second press stores the delete (${deletedId})`)
say((await slideId(ed)) !== deletedId, 'the deck moves off the deleted slide')

/* Retype the first editable line on the current slide. */
const textSlide = await slideId(ed)
const target = await ed.evaluateHandle(() =>
  [...document.querySelectorAll('[data-editable]')].find((el) => {
    const r = el.getBoundingClientRect()
    return r.width > 40 && r.height > 10 && r.top > 0 && (el.textContent || '').trim().length > 3
  }) || null,
)
const original = await target.evaluate((el) => (el ? el.textContent : null))
say(original !== null, `an editable line is offered on ${textSlide}`)
if (original !== null) {
  await target.asElement().click()
  await ed.waitForTimeout(200)
  await ed.keyboard.press('Control+A')
  await ed.keyboard.type('Edited by the check')
  await ed.keyboard.press('Enter')
  await ed.waitForTimeout(600)
  say(store?.text?.[textSlide]?.[original] === 'Edited by the check', 'Enter stores the new wording')
  say((await target.evaluate((el) => el.textContent)) === 'Edited by the check', 'the slide shows the new wording')
}

await press(ed, 'Hidden and deleted slides')
await ed.waitForTimeout(300)
const restore = ed.locator('button', { hasText: 'Restore' })
say((await restore.count()) === 1, 'the panel lists the deleted slide')
await restore.first().click()
await ed.waitForTimeout(500)
say(store?.deleted?.includes(deletedId) === false, 'Restore brings the slide back')
await ed.close()

/* ── VIEWER ─────────────────────────────────────────────────────────────── */
const vw = await open(browser, 'viewer')
say((await btn(vw, 'Edit text and slides').count()) === 0, 'viewer sees no editor control')
const viewerIds = await allIds(vw)
say(!viewerIds.includes(hiddenId), 'viewer never reaches the hidden slide')
say(viewerIds.includes(deletedId), 'viewer sees the restored slide')
say(viewerIds.length === SLIDE_COUNT - 1, `viewer deck has ${SLIDE_COUNT - 1} slides (one hidden)`)
if (original !== null) {
  await vw.goto(vw.url().replace(/#.*$/, '') + `#/${viewerIds.indexOf(textSlide) + 1}`)
  await vw.waitForTimeout(2500)
  const body = await vw.evaluate(() => document.body.innerText)
  say(body.includes('Edited by the check'), 'viewer sees the edited wording')
}
await vw.close()

/* ── OFFLINE ────────────────────────────────────────────────────────────── */
const off = await open(browser, 'offline')
say((await btn(off, 'Edit text and slides').count()) === 0, 'offline file shows no editor control')
const offIds = await allIds(off)
say(offIds.length === SLIDE_COUNT, `offline file has all ${SLIDE_COUNT} slides`)
await off.close()

await browser.close()
console.log(failures ? `\nedit: ${failures} check(s) failed` : '\nedit: all checks passed')
process.exit(failures ? 1 : 0)
