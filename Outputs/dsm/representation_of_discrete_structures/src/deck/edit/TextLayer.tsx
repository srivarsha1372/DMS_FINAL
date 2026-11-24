import { useEffect, useRef, type ReactNode } from 'react'

/**
 * TEXT LAYER: shows a slide's edited wording, and lets an Editor click a line
 * of text and retype it.
 *
 * Wraps one slide's element in a `display: contents` box, so it adds no layout.
 * A "line" is a LEAF element: one whose only child is a single non-empty text
 * node (a title, a lead, a bullet, a table cell, a pill label). Edits are keyed
 * by the line's ORIGINAL text, which is stable across reveal steps and
 * rebuilds, where a DOM position is not: a stepped table mounts its rows one
 * press at a time.
 *
 * React owns these text nodes, so an edit writes the text node's `nodeValue`
 * (React keeps its reference) and records what it wrote in `data-shown-text`.
 * If React later changes the line itself (a caption that cross-fades to the
 * next frame), the shown text no longer matches, and the line is treated as new
 * original text. A MutationObserver re-applies edits to lines that mount late.
 */

const SKIP = 'button, [role="button"], input, textarea, select, svg, [data-no-edit]'

function isLeaf(el: Element): el is HTMLElement {
  if (!(el instanceof HTMLElement)) return false
  const n = el.childNodes
  return n.length === 1 && n[0].nodeType === Node.TEXT_NODE && (n[0].nodeValue ?? '').trim() !== '' && !el.closest(SKIP)
}

export function TextLayer({
  slideId,
  edits,
  editing,
  onEdit,
  children,
}: {
  slideId: string
  edits: Record<string, string> | undefined
  editing: boolean
  onEdit: (slideId: string, original: string, replacement: string | null) => void
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const editsRef = useRef(edits)
  editsRef.current = edits

  /* Apply edits: on mount, when they change, and whenever lines mount. */
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const apply = () => {
      const map = editsRef.current ?? {}
      for (const el of Array.from(root.querySelectorAll('*'))) {
        if (!isLeaf(el) || el.isContentEditable) continue
        const node = el.firstChild as Text
        const now = node.nodeValue ?? ''
        if (el.dataset.origText !== undefined && now !== el.dataset.shownText) {
          /* React rewrote this line: its current text is the new original. */
          delete el.dataset.origText
          delete el.dataset.shownText
        }
        const orig = el.dataset.origText ?? now
        const want = map[orig] ?? orig
        if (editing) el.dataset.editable = ''
        else delete el.dataset.editable
        if (want === orig && el.dataset.origText === undefined) continue
        el.dataset.origText = orig
        el.dataset.shownText = want
        if (now !== want) node.nodeValue = want
      }
    }
    apply()
    const mo = new MutationObserver(apply)
    mo.observe(root, { childList: true, subtree: true, characterData: true })
    return () => mo.disconnect()
  }, [edits, editing])

  /* Click a line to retype it. Enter or leaving the line saves; Esc cancels. */
  useEffect(() => {
    const root = ref.current
    if (!root || !editing) return
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null
      if (!target || !isLeaf(target) || target.isContentEditable) return
      e.preventDefault()
      e.stopPropagation()
      const el = target
      const node = el.firstChild as Text
      const orig = el.dataset.origText ?? node.nodeValue ?? ''
      const before = node.nodeValue ?? ''
      el.contentEditable = 'plaintext-only'
      if (el.contentEditable !== 'plaintext-only') el.contentEditable = 'true'
      el.focus()
      const range = document.createRange()
      range.selectNodeContents(el)
      const sel = window.getSelection()
      sel?.removeAllRanges()
      sel?.addRange(range)
      let cancelled = false
      const onKey = (k: KeyboardEvent) => {
        k.stopPropagation()
        if (k.key === 'Enter') {
          k.preventDefault()
          el.blur()
        } else if (k.key === 'Escape') {
          cancelled = true
          el.blur()
        }
      }
      const onBlur = () => {
        el.removeEventListener('keydown', onKey)
        el.removeEventListener('blur', onBlur)
        el.removeAttribute('contenteditable')
        const typed = (el.textContent ?? '').replace(/\s+/g, ' ').trim()
        if (cancelled || typed === '') {
          el.textContent = before
          return
        }
        /* Keep exactly one text node, so React's reference stays valid. */
        if (el.firstChild !== node || el.childNodes.length !== 1) el.replaceChildren(node)
        node.nodeValue = typed
        if (typed !== before) onEdit(slideId, orig, typed === orig ? null : typed)
      }
      el.addEventListener('keydown', onKey)
      el.addEventListener('blur', onBlur)
    }
    root.addEventListener('click', onClick, true)
    return () => root.removeEventListener('click', onClick, true)
  }, [editing, onEdit, slideId])

  return (
    <div ref={ref} className={editing ? 'deck-text-editing' : undefined} style={{ display: 'contents' }}>
      {children}
    </div>
  )
}
