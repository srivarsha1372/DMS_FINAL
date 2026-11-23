import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useInstant } from '@/motion/instant'
import { EASE, TIER, useFrame } from './frames'

/**
 * RELATION GRAPH — elements as dots, related pairs as arrows, loops or lines.
 *
 * THE ARGUMENT
 *
 * A relation on a set is most often SEEN rather than listed: a loop at every
 * dot is "reflexive", an arrow with a return arrow is "symmetric", a two-arrow
 * path with its shortcut is "transitive", and a layered drawing with the
 * arrowheads dropped is a Hasse diagram. One figure draws all of these, so the
 * room meets the same dots and arrows on every slide of a relations lesson.
 *
 *   - `nodes` are labelled dots (or pills, with `w`), placed by their CENTRE
 *   - `edges` with `from === to` draw a LOOP; `kind: 'line'` drops the head
 *     (an undirected or Hasse edge); `kind: 'dashed'` marks a derived arrow
 *   - every edge is clipped to both nodes so it never crosses one (rule 42),
 *     with a small head on its own axis (rules 45, 46)
 *   - `groups` draw a soft oval round some nodes (a class, a block)
 *   - `marks` are tags pinned beside a node, never on it (rule 47)
 *
 * Helpers `layered()` (a Hasse diagram, bottom level first) and `columns()`
 * (a relation from A to B, or a composition across three sets) place nodes.
 *
 * STEPPING: `frames`, see `frames.ts`. Nodes and edges keyed by id, so a node
 * that moves slides and an edge that appears fades in.
 *
 * Sits on the body's left datum (content rule 38). Added 2026-11-23 for DSM
 * "Relations and Ordering".
 */

export type NodeState = 'plain' | 'lit' | 'ok' | 'warn' | 'muted' | 'ghost'

export interface GraphNode {
  id: string
  x: number
  y: number
  label: ReactNode
  /** Width of a pill for a word label; a round dot when omitted. */
  w?: number
  state?: NodeState
}

export interface GraphEdge {
  id: string
  from: string
  to: string
  kind?: 'arrow' | 'line' | 'dashed'
  tone?: 'brand' | 'ok' | 'warn' | 'danger' | 'muted'
  bend?: number
  /** For a loop: which side of the node it sits on. */
  side?: 'top' | 'bottom' | 'left' | 'right'
  /** Draw a cross through the middle: "this pair is not allowed". */
  crossed?: boolean
}

export interface GraphGroup {
  id: string
  nodes: string[]
  tone?: 'brand' | 'ok' | 'warn' | 'danger'
  crossed?: boolean
}

export interface GraphMark {
  id: string
  node: string
  text: ReactNode
  side?: 'above' | 'below' | 'left' | 'right'
  tone?: 'brand' | 'ok' | 'warn' | 'danger' | 'ink'
}

export interface GraphFrame {
  nodes: GraphNode[]
  edges?: GraphEdge[]
  groups?: GraphGroup[]
  marks?: GraphMark[]
  caption?: ReactNode
}

const D = 50
const TONE = {
  brand: colors.brandDark,
  ok: colors.success,
  warn: colors.warning,
  danger: colors.danger,
  muted: colors.muted,
  ink: colors.ink,
} as const

const FILL: Record<NodeState, { bg: string; edge: string; text: string; opacity: number; dash?: boolean }> = {
  plain: { bg: '#FFFFFF', edge: colors.brand, text: colors.ink, opacity: 1 },
  lit: { bg: '#EAF1FF', edge: colors.brandDark, text: colors.brandDark, opacity: 1 },
  ok: { bg: '#EAF8EF', edge: colors.success, text: '#0F6B33', opacity: 1 },
  warn: { bg: '#FFF6E5', edge: colors.warning, text: '#8A5200', opacity: 1 },
  muted: { bg: '#FFFFFF', edge: colors.line, text: colors.muted, opacity: 0.5 },
  ghost: { bg: '#FFFFFF00', edge: colors.muted, text: colors.muted, opacity: 1, dash: true },
}

/* ── geometry ─────────────────────────────────────────────────────────────── */

const halfW = (n: GraphNode) => (n.w ?? D) / 2
const H2 = 22

/** Where a ray from the node's centre towards (dx, dy) leaves the node, plus `gap`. */
function exit(n: GraphNode, dx: number, dy: number, gap = 5) {
  const len = Math.hypot(dx, dy) || 1
  const ux = dx / len
  const uy = dy / len
  let t: number
  if (n.w === undefined) t = D / 2
  else {
    const tx = ux === 0 ? Infinity : halfW(n) / Math.abs(ux)
    const ty = uy === 0 ? Infinity : H2 / Math.abs(uy)
    t = Math.min(tx, ty)
  }
  return { x: n.x + ux * (t + gap), y: n.y + uy * (t + gap), ux, uy }
}

function headPath(tipX: number, tipY: number, ux: number, uy: number) {
  const bx = tipX - ux * 10
  const by = tipY - uy * 10
  return `M ${tipX} ${tipY} L ${bx - uy * 5} ${by + ux * 5} L ${bx + uy * 5} ${by - ux * 5} Z`
}

function edgeGeom(a: GraphNode, b: GraphNode, e: GraphEdge) {
  if (a.id === b.id) {
    /* a loop: a teardrop out of one side and back */
    const side = e.side ?? 'top'
    const dir = { top: [0, -1], bottom: [0, 1], left: [-1, 0], right: [1, 0] }[side] as [number, number]
    const [dx, dy] = dir
    const px = -dy
    const py = dx
    const r = (a.w === undefined ? D / 2 : side === 'top' || side === 'bottom' ? H2 : halfW(a)) + 2
    const s = { x: a.x + dx * r + px * 11, y: a.y + dy * r + py * 11 }
    const t = { x: a.x + dx * (r + 6) - px * 11, y: a.y + dy * (r + 6) - py * 11 }
    const c1 = { x: s.x + dx * 40 + px * 18, y: s.y + dy * 40 + py * 18 }
    const c2 = { x: t.x + dx * 40 - px * 18, y: t.y + dy * 40 - py * 18 }
    const hx = t.x - c2.x
    const hy = t.y - c2.y
    const hl = Math.hypot(hx, hy) || 1
    const ux = hx / hl
    const uy = hy / hl
    const base = { x: t.x - ux * 9, y: t.y - uy * 9 }
    return {
      d: `M ${s.x} ${s.y} C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${base.x} ${base.y}`,
      head: headPath(t.x, t.y, ux, uy),
      mid: { x: a.x + dx * (r + 30), y: a.y + dy * (r + 30) },
    }
  }
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy) || 1
  const bend = e.bend ?? 0
  const qx = (a.x + b.x) / 2 + (-dy / len) * bend
  const qy = (a.y + b.y) / 2 + (dx / len) * bend
  const p0 = exit(a, qx - a.x, qy - a.y)
  const p1 = exit(b, qx - b.x, qy - b.y)
  const headed = (e.kind ?? 'arrow') !== 'line'
  const end = headed ? { x: p1.x + p1.ux * 9, y: p1.y + p1.uy * 9 } : p1
  /* p1.u points from b towards the control point; the travel direction is its reverse */
  const ux = -p1.ux
  const uy = -p1.uy
  const d = bend ? `M ${p0.x} ${p0.y} Q ${qx} ${qy} ${end.x} ${end.y}` : `M ${p0.x} ${p0.y} L ${end.x} ${end.y}`
  return {
    d,
    head: headed ? headPath(p1.x, p1.y, ux, uy) : null,
    mid: { x: (p0.x + 2 * qx + p1.x) / 4, y: (p0.y + 2 * qy + p1.y) / 4 },
  }
}

/* ── the figure ───────────────────────────────────────────────────────────── */

export function RelationGraph({
  frames,
  width,
  height,
  className = '',
}: {
  frames: GraphFrame[]
  width: number
  height: number
  className?: string
}) {
  const instant = useInstant()
  const fi = useFrame(frames.length)
  const f = frames[fi]
  const byId = new Map(f.nodes.map((n) => [n.id, n]))
  const dur = (t: number) => (instant ? 0 : t)
  const anyCaption = frames.some((fr) => fr.caption)

  return (
    <div className={`relative ${className}`} style={{ width }}>
      <div className="relative" style={{ width, height }}>
        <svg className="pointer-events-none absolute inset-0" width={width} height={height} aria-hidden>
          {/* groups under everything */}
          <AnimatePresence initial={false}>
            {(f.groups ?? []).map((g) => {
              const ns = g.nodes.map((id) => byId.get(id)).filter(Boolean) as GraphNode[]
              if (!ns.length) return null
              const x0 = Math.min(...ns.map((n) => n.x - halfW(n))) - 16
              const x1 = Math.max(...ns.map((n) => n.x + halfW(n))) + 16
              const y0 = Math.min(...ns.map((n) => n.y - 25)) - 14
              const y1 = Math.max(...ns.map((n) => n.y + 25)) + 14
              const col = TONE[g.tone ?? 'brand']
              return (
                <motion.g key={g.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: dur(TIER.enter), ease: EASE }}>
                  <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} rx={(y1 - y0) / 2} fill={`${col}14`} stroke={col} strokeWidth={2} strokeDasharray="7 6" />
                  {g.crossed && <path d={`M ${x0 + 10} ${y0 + 6} L ${x1 - 10} ${y1 - 6}`} stroke={colors.danger} strokeWidth={3} strokeLinecap="round" />}
                </motion.g>
              )
            })}
          </AnimatePresence>
          <AnimatePresence initial={false}>
            {(f.edges ?? []).map((e) => {
              const a = byId.get(e.from)
              const b = byId.get(e.to)
              if (!a || !b) return null
              const g = edgeGeom(a, b, e)
              const col = TONE[e.tone ?? 'brand']
              return (
                <motion.g key={e.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: dur(TIER.enter), ease: EASE }}>
                  <motion.path
                    d={g.d}
                    animate={{ d: g.d }}
                    transition={{ duration: dur(TIER.move), ease: EASE }}
                    fill="none"
                    stroke={col}
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeDasharray={e.kind === 'dashed' ? '7 6' : undefined}
                  />
                  {g.head && <motion.path d={g.head} animate={{ d: g.head }} transition={{ duration: dur(TIER.move), ease: EASE }} fill={col} />}
                  {e.crossed && (
                    <path
                      d={`M ${g.mid.x - 9} ${g.mid.y - 9} L ${g.mid.x + 9} ${g.mid.y + 9} M ${g.mid.x + 9} ${g.mid.y - 9} L ${g.mid.x - 9} ${g.mid.y + 9}`}
                      stroke={colors.danger}
                      strokeWidth={3}
                      strokeLinecap="round"
                    />
                  )}
                </motion.g>
              )
            })}
          </AnimatePresence>
        </svg>

        <AnimatePresence initial={false}>
          {f.nodes.map((n) => {
            const s = FILL[n.state ?? 'plain']
            const w = n.w ?? D
            const h = n.w === undefined ? D : 44
            return (
              <motion.div
                key={n.id}
                className="absolute grid place-items-center whitespace-nowrap font-heading text-[19px] font-semibold"
                style={{ width: w, height: h, borderRadius: 999 }}
                initial={{ opacity: 0, left: n.x - w / 2, top: n.y - h / 2 + 8 }}
                animate={{
                  opacity: s.opacity,
                  left: n.x - w / 2,
                  top: n.y - h / 2,
                  backgroundColor: s.bg,
                  color: s.text,
                  boxShadow: s.dash ? `inset 0 0 0 2px ${s.edge}` : `inset 0 0 0 2px ${s.edge}, 0 6px 14px -9px ${s.edge}`,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: dur(TIER.move), ease: EASE }}
              >
                {n.label}
              </motion.div>
            )
          })}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {(f.marks ?? []).map((m) => {
            const n = byId.get(m.node)
            if (!n) return null
            const col = TONE[m.tone ?? 'brand']
            const side = m.side ?? 'above'
            const hw = halfW(n)
            const hh = n.w === undefined ? D / 2 : H2
            const pos =
              side === 'above'
                ? { left: n.x, top: n.y - hh - 38, x: '-50%' }
                : side === 'below'
                  ? { left: n.x, top: n.y + hh + 8, x: '-50%' }
                  : side === 'left'
                    ? { left: n.x - hw - 12, top: n.y - 15, x: '-100%' }
                    : { left: n.x + hw + 12, top: n.y - 15, x: '0%' }
            return (
              <motion.span
                key={m.id}
                className="absolute whitespace-nowrap rounded-pill px-3 py-0.5 font-heading text-[16px] font-semibold"
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
              key={fi}
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

type Spot = Omit<GraphNode, 'x' | 'y'>

/**
 * A Hasse diagram: `levels[0]` is the BOTTOM row. Each row is centred on
 * `cx`; rows are `rowGap` apart upward from `bottom`.
 */
export function layered(levels: Spot[][], { cx, bottom, rowGap = 90, colGap = 110 }: { cx: number; bottom: number; rowGap?: number; colGap?: number }): GraphNode[] {
  return levels.flatMap((lv, li) =>
    lv.map((n, i) => ({ ...n, x: cx + (i - (lv.length - 1) / 2) * colGap, y: bottom - li * rowGap })),
  )
}

/** Columns of nodes, left to right: a relation from A to B, or A, B and C. */
export function columns(cols: Spot[][], { x0, top, colGap = 220, rowGap = 70 }: { x0: number; top: number; colGap?: number; rowGap?: number }): GraphNode[] {
  return cols.flatMap((c, ci) => c.map((n, i) => ({ ...n, x: x0 + ci * colGap, y: top + i * rowGap })))
}

/** Edges for a list of pairs, ids derived from the pair. */
export function pairs(list: [string, string][], opts: Omit<GraphEdge, 'id' | 'from' | 'to'> = {}): GraphEdge[] {
  return list.map(([a, b]) => ({ id: `${a}>${b}`, from: a, to: b, ...opts }))
}
