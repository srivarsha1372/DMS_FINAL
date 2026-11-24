import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useInstant } from '@/motion/instant'
import { EASE, TIER, useFrame } from './frames'

/**
 * MEMORY MAP — storage locations, what they hold, and the links between them.
 *
 * THE ARGUMENT
 *
 * Every picture in a "how data sits in memory" lesson is the same three things:
 * numbered locations (an ADDRESS beside a box), what each one holds (its
 * CONTENT), and, once pointers arrive, an ARROW from a location to the location
 * whose address it holds. A table can list those, but it cannot show the two
 * facts the lesson turns on: that sequential storage is physically side by side,
 * and that linked storage is scattered and held together only by the arrows.
 *
 * One engine draws all of it, so the memory strip, the two layouts, the pointer,
 * the node and the linked list are the same object on every slide and a cell the
 * room has met keeps its look when it moves.
 *
 *   - a cell is one box (`value`) or a two-field node (`fields: [info, link]`)
 *   - `addr` is drawn beside the box, smaller and muted, so address and content
 *     can never be read as the same kind of thing (the lesson's first slip)
 *   - `arrows` join cells; each is clipped to both boxes so it never crosses one
 *     (content rule 42), with a small head on the line's own axis (45, 46)
 *   - `markers` are tags pinned to a cell (FIRST, P, A[5]), set beside it, never
 *     on it (rule 47)
 *
 * STEPPING: `frames`, see `frames.ts`. Cells are keyed by `id`; a cell whose
 * position changes between frames SLIDES there, which is how an array insert
 * shows its shift. A cell missing from a frame fades out; a new one fades in.
 *
 * Every label is a DOM element. Only the arrow strokes are SVG (CLAUDE.md:
 * "a figure made mostly of labels is built from DOM elements").
 *
 * Helpers `row()` and `column()` lay cells out for the common cases, so a deck
 * passes values, not coordinates.
 *
 * Sits on the body's left datum, never centred under a left lead (content
 * rule 38). Added 2026-11-21 for DSM "Representation of Discrete Structures".
 */

export type CellState = 'plain' | 'lit' | 'ok' | 'warn' | 'muted' | 'ghost'

export interface MapCell {
  id: string
  x: number
  y: number
  /** One-box cell. */
  value?: ReactNode
  /** Two-field node: [INFO, LINK]. */
  fields?: [ReactNode, ReactNode]
  addr?: ReactNode
  addrSide?: 'left' | 'below' | 'above'
  state?: CellState
  w?: number
  h?: number
}

export interface MapArrow {
  id: string
  from: string
  to: string
  /** Sideways bend in px; 0 is straight. Positive bends to the left of travel. */
  bend?: number
  tone?: 'brand' | 'warn' | 'ok'
  dashed?: boolean
}

export interface MapMarker {
  id: string
  cell: string
  text: ReactNode
  side?: 'above' | 'below' | 'left' | 'right'
  tone?: 'brand' | 'warn' | 'ok' | 'ink'
}

export interface MapFrame {
  cells: MapCell[]
  arrows?: MapArrow[]
  markers?: MapMarker[]
  caption?: ReactNode
}

const W = 76
const H = 58

const FILL: Record<CellState, { bg: string; edge: string; text: string; opacity: number; dash?: boolean }> = {
  plain: { bg: '#FFFFFF', edge: colors.line, text: colors.ink, opacity: 1 },
  lit: { bg: '#EAF1FF', edge: colors.brand, text: colors.brandDark, opacity: 1 },
  ok: { bg: '#EAF8EF', edge: colors.success, text: '#0F6B33', opacity: 1 },
  warn: { bg: '#FFF6E5', edge: colors.warning, text: '#8A5200', opacity: 1 },
  muted: { bg: '#FFFFFF', edge: colors.line, text: colors.muted, opacity: 0.45 },
  ghost: { bg: '#FFFFFF00', edge: colors.muted, text: colors.muted, opacity: 1, dash: true },
}

const ARROW_TONE = { brand: colors.brandDark, warn: colors.warning, ok: colors.success } as const
const MARK_TONE = { brand: colors.brand, warn: colors.warning, ok: colors.success, ink: colors.ink } as const

/* ── geometry ─────────────────────────────────────────────────────────────── */

type Rect = { x: number; y: number; w: number; h: number }
const rectOf = (c: MapCell): Rect => ({ x: c.x, y: c.y, w: c.w ?? (c.fields ? W * 1.7 : W), h: c.h ?? H })
const centre = (r: Rect) => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 })

/** Where a ray from the rect's centre towards (dx, dy) leaves the rect, pushed out by `gap`. */
function exitPoint(r: Rect, dx: number, dy: number, gap: number) {
  const c = centre(r)
  const len = Math.hypot(dx, dy) || 1
  const ux = dx / len
  const uy = dy / len
  const tx = ux === 0 ? Infinity : r.w / 2 / Math.abs(ux)
  const ty = uy === 0 ? Infinity : r.h / 2 / Math.abs(uy)
  const t = Math.min(tx, ty) + gap
  return { x: c.x + ux * t, y: c.y + uy * t }
}

function arrowPath(a: Rect, b: Rect, bend = 0) {
  const ca = centre(a)
  const cb = centre(b)
  const mx = (ca.x + cb.x) / 2
  const my = (ca.y + cb.y) / 2
  const dx = cb.x - ca.x
  const dy = cb.y - ca.y
  const len = Math.hypot(dx, dy) || 1
  /* control point: the midpoint pushed sideways by `bend` */
  const qx = mx + (-dy / len) * bend
  const qy = my + (dx / len) * bend
  const p0 = exitPoint(a, qx - ca.x, qy - ca.y, 4)
  /* the head is drawn separately, so the line stops at its base */
  const p1 = exitPoint(b, qx - cb.x, qy - cb.y, 4)
  const hx = p1.x - qx
  const hy = p1.y - qy
  const hl = Math.hypot(hx, hy) || 1
  const head = { x: p1.x, y: p1.y, ux: hx / hl, uy: hy / hl }
  const base = { x: p1.x - head.ux * 9, y: p1.y - head.uy * 9 }
  const d = bend
    ? `M ${p0.x} ${p0.y} Q ${qx} ${qy} ${base.x} ${base.y}`
    : `M ${p0.x} ${p0.y} L ${base.x} ${base.y}`
  return { d, head }
}

/* ── the figure ───────────────────────────────────────────────────────────── */

export function MemoryMap({
  frames,
  width,
  height,
  className = '',
}: {
  frames: MapFrame[]
  width: number
  height: number
  className?: string
}) {
  const instant = useInstant()
  const f = frames[useFrame(frames.length)]
  const byId = new Map(f.cells.map((c) => [c.id, c]))
  const dur = (t: number) => (instant ? 0 : t)
  const anyCaption = frames.some((fr) => fr.caption)

  return (
    <div className={`relative ${className}`} style={{ width }}>
      <div className="relative" style={{ width, height }}>
        {/* arrows sit UNDER the cells */}
        <svg className="pointer-events-none absolute inset-0" width={width} height={height} aria-hidden>
          <AnimatePresence initial={false}>
            {(f.arrows ?? []).map((a) => {
              const from = byId.get(a.from)
              const to = byId.get(a.to)
              if (!from || !to) return null
              const { d, head } = arrowPath(rectOf(from), rectOf(to), a.bend)
              const col = ARROW_TONE[a.tone ?? 'brand']
              /* the head as absolute points: tip, and a base 10px back, 5px either side */
              const bx = head.x - head.ux * 10
              const by = head.y - head.uy * 10
              const hd = `M ${head.x} ${head.y} L ${bx - head.uy * 5} ${by + head.ux * 5} L ${bx + head.uy * 5} ${by - head.ux * 5} Z`
              return (
                <motion.g
                  key={a.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: dur(TIER.enter), ease: EASE }}
                >
                  <motion.path
                    d={d}
                    animate={{ d }}
                    transition={{ duration: dur(TIER.move), ease: EASE }}
                    fill="none"
                    stroke={col}
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeDasharray={a.dashed ? '6 6' : undefined}
                  />
                  <motion.path
                    d={hd}
                    animate={{ d: hd }}
                    transition={{ duration: dur(TIER.move), ease: EASE }}
                    fill={col}
                  />
                </motion.g>
              )
            })}
          </AnimatePresence>
        </svg>

        <AnimatePresence initial={false}>
          {f.cells.map((c) => {
            const r = rectOf(c)
            const s = FILL[c.state ?? 'plain']
            return (
              <motion.div
                key={c.id}
                className="absolute"
                initial={{ opacity: 0, left: r.x, top: r.y + 10 }}
                animate={{ opacity: s.opacity, left: r.x, top: r.y }}
                exit={{ opacity: 0 }}
                transition={{ duration: dur(TIER.move), ease: EASE }}
                style={{ width: r.w, height: r.h }}
              >
                <div
                  className="flex h-full w-full overflow-hidden rounded-xl font-mono text-[20px] font-medium"
                  style={{
                    background: s.bg,
                    border: `2px ${s.dash ? 'dashed' : 'solid'} ${s.edge}`,
                    color: s.text,
                    boxShadow: s.dash ? undefined : `0 6px 16px -10px ${s.edge}aa, inset 0 1px 0 0 #FFFFFF`,
                    transition: instant ? undefined : 'background 420ms, border-color 420ms, color 420ms',
                  }}
                >
                  {c.fields ? (
                    <>
                      <span className="grid flex-[1.15] place-items-center px-1">{c.fields[0]}</span>
                      <span
                        className="grid flex-1 place-items-center px-1 text-[16px]"
                        style={{ borderLeft: `2px solid ${s.edge}` }}
                      >
                        {c.fields[1]}
                      </span>
                    </>
                  ) : (
                    <span className="grid flex-1 place-items-center px-1">{c.value}</span>
                  )}
                </div>
                {c.addr !== undefined && (
                  <span
                    className="absolute whitespace-nowrap font-mono text-[15px]"
                    style={{
                      color: colors.muted,
                      ...(c.addrSide === 'below'
                        ? { top: r.h + 4, left: 0, width: r.w, textAlign: 'center' }
                        : c.addrSide === 'above'
                          ? { bottom: r.h + 4, left: 0, width: r.w, textAlign: 'center' }
                          : { right: r.w + 10, top: 0, height: r.h, display: 'grid', alignItems: 'center' }),
                    }}
                  >
                    {c.addr}
                  </span>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {(f.markers ?? []).map((m) => {
            const c = byId.get(m.cell)
            if (!c) return null
            const r = rectOf(c)
            const side = m.side ?? 'above'
            const col = MARK_TONE[m.tone ?? 'brand']
            const pos =
              side === 'above'
                ? { left: r.x + r.w / 2, top: r.y - 40, x: '-50%' }
                : side === 'below'
                  ? { left: r.x + r.w / 2, top: r.y + r.h + (c.addr !== undefined && c.addrSide === 'below' ? 30 : 10), x: '-50%' }
                  : side === 'left'
                    ? { left: r.x - 12, top: r.y + r.h / 2 - 15, x: '-100%' }
                    : { left: r.x + r.w + 12, top: r.y + r.h / 2 - 15, x: '0%' }
            return (
              <motion.span
                key={m.id}
                className="absolute whitespace-nowrap rounded-pill px-3 py-0.5 font-heading text-[17px] font-semibold"
                style={{ background: `${col}18`, color: col, border: `1.5px solid ${col}55` }}
                initial={{ opacity: 0, ...pos }}
                animate={{ opacity: 1, ...pos }}
                exit={{ opacity: 0 }}
                transition={{ duration: dur(TIER.move), ease: EASE }}
              >
                {m.text}
              </motion.span>
            )
          })}
        </AnimatePresence>
      </div>

      {anyCaption && (
        <div className="relative mt-3 h-[30px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={frames.indexOf(f)}
              className="text-[19px] font-medium"
              style={{ color: colors.ink }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: dur(0.36), ease: EASE }}
            >
              {f.caption}
            </motion.p>
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

/* ── layout helpers ───────────────────────────────────────────────────────── */

type Item = Omit<MapCell, 'x' | 'y'>

/** Cells side by side, left to right, from (x, y). */
export function row(items: Item[], { x = 0, y = 0, gap = 10, w = W }: { x?: number; y?: number; gap?: number; w?: number } = {}): MapCell[] {
  return items.map((it, i) => ({ addrSide: 'below', ...it, w: it.w ?? w, x: x + i * ((it.w ?? w) + gap), y }))
}

/** Cells stacked top to bottom, from (x, y). Addresses sit on the left. */
export function column(items: Item[], { x = 0, y = 0, gap = 8, h = H }: { x?: number; y?: number; gap?: number; h?: number } = {}): MapCell[] {
  return items.map((it, i) => ({ addrSide: 'left', ...it, h: it.h ?? h, x, y: y + i * ((it.h ?? h) + gap) }))
}

/** A node chain: two-field cells left to right, each arrow to the next. */
export function chain(
  nodes: { id: string; info: ReactNode; link?: ReactNode; state?: CellState; addr?: ReactNode }[],
  { x = 0, y = 0, gap = 70 }: { x?: number; y?: number; gap?: number } = {},
): { cells: MapCell[]; arrows: MapArrow[] } {
  const nw = W * 1.7
  const cells: MapCell[] = nodes.map((n, i) => ({
    id: n.id,
    x: x + i * (nw + gap),
    y,
    fields: [n.info, n.link ?? '•'],
    state: n.state,
    addr: n.addr,
    addrSide: 'below',
  }))
  const arrows: MapArrow[] = nodes.slice(1).map((n, i) => ({ id: `${nodes[i].id}>${n.id}`, from: nodes[i].id, to: n.id }))
  return { cells, arrows }
}

/** Width of a two-field node, for decks that place one by hand. */
export const NODE_W = W * 1.7
export const CELL_W = W
export const CELL_H = H
