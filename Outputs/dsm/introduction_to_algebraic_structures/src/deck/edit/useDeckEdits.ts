import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * DECK EDITS: hide, delete and reword slides, kept per deck, shared by everyone
 * who opens it, writable only by its Editors.
 *
 * WHERE THIS WORKS. Only inside a claude.ai Artifact that declares
 *   capabilities: { db: { rules: [{ path: "", read: "view", write: "admin" }] }, user: {} }
 * There the page has `window.claude.use`, the `user` capability says whether
 * this viewer may edit (`canEdit()`, the share menu's Editor or Owner), and the
 * `db` capability holds ONE document, `deck/state`, with every edit. Everyone
 * admitted reads it; only `admin` writes it, so the rule, not this code, is the
 * permission. Anywhere else (the double-clicked `dist-single` file, the dev
 * server, every harness) `window.claude` is absent and this hook reports
 * `available: false`: the deck renders exactly as built and no editor control
 * is drawn.
 *
 * WHAT IS STORED. Slide ids, never positions: `hidden` and `deleted` are ids,
 * and text edits are keyed by slide id, then by the ORIGINAL text of the line
 * they replace (see `TextLayer`). A rebuilt deck that keeps its ids keeps its
 * edits; a slide whose wording was changed at source simply loses the edit for
 * that line, and nothing breaks.
 *
 * Added 2026-11-24 for the DSM decks (user: editable on a permission basis,
 * with Hide Slide and Delete Slide; deleted slides restorable).
 */

export interface DeckEditState {
  /** Slide ids skipped when presenting. Editors still see them in edit mode. */
  hidden: string[]
  /** Slide ids removed from the deck. Restorable from the Deleted list. */
  deleted: string[]
  /** slide id -> original line text -> replacement text. */
  text: Record<string, Record<string, string>>
}

export const EMPTY_EDITS: DeckEditState = { hidden: [], deleted: [], text: {} }

/* The tiny slice of the platform API this file uses. */
type Unsub = () => void
interface DocSnap {
  exists: boolean
  data(): Record<string, unknown> | undefined
  metadata: { fromCache: boolean }
}
interface DocRef {
  set(data: Record<string, unknown>): Promise<void>
  onSnapshot(next: (s: DocSnap) => void, error?: (e: { code: string }) => void): Unsub
}
interface Db {
  doc(path: string): DocRef
}
interface UserCap {
  canEdit(): Promise<boolean>
}
interface ClaudeHost {
  use(name: 'db'): Promise<Db | null>
  use(name: 'user'): Promise<UserCap | null>
}

function host(): ClaudeHost | null {
  if (typeof window === 'undefined') return null
  const c = (window as unknown as { claude?: ClaudeHost }).claude
  return c && typeof c.use === 'function' ? c : null
}

const strings = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [])

function parse(body: Record<string, unknown> | undefined): DeckEditState {
  if (!body) return EMPTY_EDITS
  const text: DeckEditState['text'] = {}
  const raw = body.text
  if (raw && typeof raw === 'object') {
    for (const [slide, lines] of Object.entries(raw as Record<string, unknown>)) {
      if (!lines || typeof lines !== 'object') continue
      const out: Record<string, string> = {}
      for (const [from, to] of Object.entries(lines as Record<string, unknown>)) if (typeof to === 'string') out[from] = to
      if (Object.keys(out).length) text[slide] = out
    }
  }
  return { hidden: strings(body.hidden), deleted: strings(body.deleted), text }
}

export interface DeckEdits {
  /** The page runs inside an artifact with the store reachable. */
  available: boolean
  /** This viewer may change the deck (Editor or Owner). */
  canEdit: boolean
  state: DeckEditState
  /** A write was refused or failed; the message is for the editor. */
  error: string | null
  /** Replace the whole state: one write, awaited before the next. */
  save: (next: DeckEditState) => void
}

export function useDeckEdits(): DeckEdits {
  const [available, setAvailable] = useState(false)
  const [canEdit, setCanEdit] = useState(false)
  const [state, setState] = useState<DeckEditState>(EMPTY_EDITS)
  const [error, setError] = useState<string | null>(null)
  const refRef = useRef<DocRef | null>(null)
  /* One write at a time to the document; a newer state queued behind it wins. */
  const writing = useRef(false)
  const queued = useRef<DeckEditState | null>(null)

  useEffect(() => {
    const c = host()
    if (!c) return
    let unsub: Unsub | null = null
    let dead = false
    ;(async () => {
      const [db, user] = await Promise.all([c.use('db'), c.use('user')])
      if (dead || !db) return
      const ref = db.doc('deck/state')
      refRef.current = ref
      setAvailable(true)
      unsub = ref.onSnapshot(
        (snap) => setState(parse(snap.exists ? snap.data() : undefined)),
        () => setAvailable(false),
      )
      try {
        setCanEdit(Boolean(await user?.canEdit()))
      } catch {
        setCanEdit(false)
      }
    })()
    return () => {
      dead = true
      unsub?.()
    }
  }, [])

  const flush = useCallback(async () => {
    const ref = refRef.current
    if (!ref || writing.current) return
    writing.current = true
    try {
      while (queued.current) {
        const next = queued.current
        queued.current = null
        try {
          await ref.set({ hidden: next.hidden, deleted: next.deleted, text: next.text })
          setError(null)
        } catch (e) {
          const code = (e as { code?: string })?.code
          if (code === 'invalid_argument') {
            setCanEdit(false)
            setError('This deck is read-only for you.')
          } else setError('Could not save the change. Try again.')
        }
      }
    } finally {
      writing.current = false
    }
  }, [])

  const save = useCallback(
    (next: DeckEditState) => {
      setState(next)
      queued.current = next
      void flush()
    },
    [flush],
  )

  return { available, canEdit, state, error, save }
}
