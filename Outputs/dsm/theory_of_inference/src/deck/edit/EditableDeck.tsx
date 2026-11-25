import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArchiveRestore, Eye, EyeOff, FilePenLine, Trash2 } from 'lucide-react'
import { Deck } from '../Deck'
import { useDeck } from '../DeckContext'
import { ControlButton } from '../DeckControls'
import type { DeckProps, SlideDef } from '../types'
import { TextLayer } from './TextLayer'
import { useDeckEdits, type DeckEditState } from './useDeckEdits'
import { colors } from '@/design/tokens'

/**
 * EDITABLE DECK: the kit's `Deck`, plus Editor-only controls when the deck runs
 * as a claude.ai Artifact that grants them (see `useDeckEdits`).
 *
 *   - Everyone: hidden and deleted slides are skipped; edited text is shown.
 *   - Editors (share menu Editor or Owner) get four bar buttons:
 *       Edit      turns edit mode on: hidden slides come back into the run so
 *                 they can be reviewed, and any line of text can be clicked and
 *                 retyped (Enter saves, Esc cancels)
 *       Hide      hides the current slide from presenting, or shows it again
 *       Delete    removes the current slide (press twice to confirm)
 *       Restore   lists hidden and deleted slides, each with Show or Restore
 *
 * Outside an artifact nothing here renders and `slides` pass through untouched,
 * so the double-clicked deck, the dev server and every harness see the deck
 * exactly as built.
 */
export function EditableDeck({ slides, meta, transition }: DeckProps) {
  const { available, canEdit, state, error, save } = useDeckEdits()
  const [editing, setEditing] = useState(false)
  const editor = available && canEdit
  const live = editor && editing

  const onEdit = useCallback(
    (slideId: string, original: string, replacement: string | null) => {
      const lines = { ...(state.text[slideId] ?? {}) }
      if (replacement === null) delete lines[original]
      else lines[original] = replacement
      const text = { ...state.text, [slideId]: lines }
      if (!Object.keys(lines).length) delete text[slideId]
      save({ ...state, text })
    },
    [state, save],
  )

  const shown = useMemo<SlideDef[]>(() => {
    if (!available) return slides
    const hidden = new Set(state.hidden)
    const deleted = new Set(state.deleted)
    return slides
      .filter((s) => !deleted.has(s.id) && (live || !hidden.has(s.id)))
      .map((s) => ({
        ...s,
        element: (
          <TextLayer slideId={s.id} edits={state.text[s.id]} editing={live} onEdit={onEdit}>
            {s.element}
          </TextLayer>
        ),
      }))
  }, [available, slides, state, live, onEdit])

  const player = useMemo(
    () => ({
      ...meta?.player,
      extraControls: (
        <>
          {meta?.player?.extraControls}
          {editor && <EditorControls slides={slides} shown={shown} state={state} save={save} editing={editing} setEditing={setEditing} error={error} />}
        </>
      ),
    }),
    [meta?.player, editor, slides, shown, state, save, editing, error],
  )

  return <Deck slides={shown} meta={{ ...(meta ?? { title: '' }), player }} transition={transition} />
}

function EditorControls({
  slides,
  shown,
  state,
  save,
  editing,
  setEditing,
  error,
}: {
  slides: SlideDef[]
  shown: SlideDef[]
  state: DeckEditState
  save: (s: DeckEditState) => void
  editing: boolean
  setEditing: (b: boolean) => void
  error: string | null
}) {
  const { index } = useDeck()
  const current = shown[index]
  const [confirming, setConfirming] = useState(false)
  const [panel, setPanel] = useState(false)

  /* A second press within four seconds confirms a delete; moving on cancels it. */
  useEffect(() => setConfirming(false), [current?.id])
  useEffect(() => {
    if (!confirming) return
    const t = window.setTimeout(() => setConfirming(false), 4000)
    return () => window.clearTimeout(t)
  }, [confirming])

  const isHidden = current ? state.hidden.includes(current.id) : false
  const toggleHidden = () => {
    if (!current) return
    const hidden = isHidden ? state.hidden.filter((id) => id !== current.id) : [...state.hidden, current.id]
    save({ ...state, hidden })
  }
  const remove = () => {
    if (!current) return
    if (!confirming) {
      setConfirming(true)
      return
    }
    setConfirming(false)
    save({ ...state, deleted: [...state.deleted, current.id], hidden: state.hidden.filter((id) => id !== current.id) })
  }
  const restore = (id: string) => save({ ...state, deleted: state.deleted.filter((d) => d !== id) })
  const unhide = (id: string) => save({ ...state, hidden: state.hidden.filter((d) => d !== id) })

  const label = (id: string) => {
    const i = slides.findIndex((s) => s.id === id)
    const s = slides[i]
    return `${i + 1}. ${s?.label ?? id}`
  }
  const parked = state.hidden.length + state.deleted.length

  return (
    <>
      <ControlButton label={editing ? 'Stop editing' : 'Edit text and slides'} onClick={() => setEditing(!editing)} on={editing}>
        <FilePenLine size={16} />
      </ControlButton>
      {editing && (
        <>
          <ControlButton label={isHidden ? 'Show this slide' : 'Hide this slide'} onClick={toggleHidden} on={isHidden} wide={isHidden}>
            {isHidden ? <Eye size={16} /> : <EyeOff size={16} />}
            {isHidden && <span className="text-[12px] font-semibold">Hidden</span>}
          </ControlButton>
          <ControlButton label={confirming ? 'Press again to delete this slide' : 'Delete this slide'} onClick={remove} on={confirming} wide={confirming}>
            <Trash2 size={16} />
            {confirming && <span className="text-[12px] font-semibold">Delete?</span>}
          </ControlButton>
          <ControlButton label="Hidden and deleted slides" onClick={() => setPanel(!panel)} on={panel} wide={parked > 0}>
            <ArchiveRestore size={16} />
            {parked > 0 && <span className="text-[12px] font-semibold">{parked}</span>}
          </ControlButton>
        </>
      )}
      {editing && (panel || error) && (
        <div
          className="fixed bottom-16 left-1/2 z-50 w-[360px] max-w-[92vw] -translate-x-1/2 rounded-card border border-line bg-white p-4 text-[14px] shadow-float"
          style={{ color: colors.ink }}
          data-no-edit
        >
          {error && <p className="mb-2 font-semibold text-danger">{error}</p>}
          {panel && (
            <>
              <p className="mb-2 font-semibold">Hidden slides</p>
              {state.hidden.length === 0 && <p className="mb-3 text-muted">None</p>}
              <ul className="mb-3 space-y-1">
                {state.hidden.map((id) => (
                  <li key={id} className="flex items-center justify-between gap-3">
                    <span className="truncate">{label(id)}</span>
                    <button className="rounded-pill px-3 py-1 font-semibold text-brand hover:bg-brand/10" onClick={() => unhide(id)}>
                      Show
                    </button>
                  </li>
                ))}
              </ul>
              <p className="mb-2 font-semibold">Deleted slides</p>
              {state.deleted.length === 0 && <p className="text-muted">None</p>}
              <ul className="space-y-1">
                {state.deleted.map((id) => (
                  <li key={id} className="flex items-center justify-between gap-3">
                    <span className="truncate">{label(id)}</span>
                    <button className="rounded-pill px-3 py-1 font-semibold text-brand hover:bg-brand/10" onClick={() => restore(id)}>
                      Restore
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </>
  )
}
