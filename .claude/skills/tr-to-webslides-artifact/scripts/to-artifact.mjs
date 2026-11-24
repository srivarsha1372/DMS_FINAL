#!/usr/bin/env node
// Turn a deck's single-file build (dist-single/<htmlName>.html) into a page the
// Artifact tool can publish.
//
// The Artifact tool wraps whatever it publishes in its own
// <!doctype html><head>…</head><body> skeleton, so the page we hand it must NOT
// carry its own <html>, <head> or <body>. This script:
//   - drops the doctype, <html>, <head>, <body> wrappers and their closers
//   - drops the charset / viewport metas (the skeleton supplies both)
//   - moves <title> to the very top (only the first 8 KB is scanned for it;
//     the inlined favicon data URI otherwise pushes it far past that)
//   - keeps every <style> and <script> verbatim, in order (the build is fully
//     inlined: fonts, images and JS are data URIs / inline code, so the
//     artifact CSP never sees an external request)
//   - adds a small reset so the deck fills the viewer: an explicit background
//     and no skeleton padding around the 16:9 stage
//
// Usage:
//   node to-artifact.mjs <built.html> [out.html] [--title "Session name"]
// Prints the output path and size. Exits 1 if the result is over 16 MB or still
// references an external host the artifact CSP would block.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'

const args = process.argv.slice(2)
let titleOverride = null
const pos = []
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--title') titleOverride = args[++i]
  else pos.push(args[i])
}
const [inPath, outArg] = pos
if (!inPath) {
  console.error('usage: node to-artifact.mjs <built.html> [out.html] [--title "Name"]')
  process.exit(2)
}
const outPath = outArg ?? join(dirname(inPath), basename(inPath, '.html') + '.artifact.html')

let html = readFileSync(inPath, 'utf8')

// The body sits at the very end of a Vite single-file build; script bodies can
// contain the literal strings "<body" / "</head>", so anchor on the LAST ones.
const bodyOpen = html.lastIndexOf('<body')
if (bodyOpen < 0) throw new Error('no <body> found: is this a dist-single build?')
const headClose = html.lastIndexOf('</head>', bodyOpen)
const headOpenMatch = /<head[^>]*>/i.exec(html)
if (headClose < 0 || !headOpenMatch) throw new Error('no <head>…</head> found')

let head = html.slice(headOpenMatch.index + headOpenMatch[0].length, headClose)
let body = html.slice(html.indexOf('>', bodyOpen) + 1)
body = body.replace(/<\/body>\s*<\/html>\s*$/i, '').replace(/<\/body>\s*$/i, '')

// Pull the title out of the head and remember it.
let title = titleOverride
head = head.replace(/<title>([\s\S]*?)<\/title>/i, (_, t) => {
  title ??= t.trim()
  return ''
})
title ??= basename(inPath, '.html')

// The skeleton already has these.
head = head
  .replace(/<meta\s+charset=[^>]*>/i, '')
  .replace(/<meta\s+name=["']viewport["'][^>]*>/i, '')

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')

const reset = `<style>
/* artifact wrapper: let the deck own the whole viewer */
:root { padding: 0 !important; color-scheme: light; }
html, body { margin: 0; height: 100%; background: #ffffff; overflow: hidden; }
#root { height: 100%; }
</style>`

const out = `<title>${escape(title)}</title>\n${reset}\n${head.trim()}\n${body.trim()}\n`

// Sanity: CSP only allows a handful of CDNs and no fetch to anything external.
const external = [...out.matchAll(/(?:src|href)\s*=\s*["'](https?:\/\/[^"']+)/gi)]
  .map((m) => m[1])
  .filter((u) => !/^https:\/\/(cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net\/npm|unpkg\.com|fonts\.(googleapis|gstatic)\.com)/.test(u))

mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, out)
const mb = Buffer.byteLength(out) / 1024 / 1024
console.log(`${outPath}  ${mb.toFixed(2)} MB  title="${title}"`)

let bad = false
if (mb > 16) {
  console.error(`TOO LARGE: ${mb.toFixed(2)} MB, the artifact limit is 16 MB. Shrink public/shots/ images.`)
  bad = true
}
if (external.length) {
  console.error('EXTERNAL REFERENCES (blocked inside an artifact, will not load):')
  for (const u of [...new Set(external)]) console.error('  ' + u)
  bad = true
}
process.exit(bad ? 1 : 0)
