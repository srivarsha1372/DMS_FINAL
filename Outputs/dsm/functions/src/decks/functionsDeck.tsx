import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import type { DeckMeta, SlideDef } from '@/deck/types'
import {
  AgendaSlide,
  BrandSlide,
  ContentSlide,
  FeedbackSlide,
  KeyTakeawaysSlide,
  QuizTimeSlide,
  SectionBreakerSlide,
  ThankYouSlide,
  WelcomeSlide,
} from '@/slides'
import { Callout, DataTable } from '@/ui'
import type { TableColumn } from '@/ui/DataTable'
import { Step, useClaimedSteps } from '@/motion/Stepper'
import { useInstant } from '@/motion/instant'
import { colors } from '@/design/tokens'
import {
  BitStrip,
  FunctionPlot,
  RelationGraph,
  type GraphEdge,
  type GraphFrame,
  type GraphGroup,
  type GraphMark,
  type GraphNode,
  type NodeState,
  type PlotFrame,
} from '@/ui/structures'

/**
 * FUNCTIONS (DSM).
 *
 * Built from the signed-off plan at
 *   Outputs/dsm/session_plans/functions/plan.md
 * the source of truth for order, framework and wording. Every result on these
 * slides was recomputed by `verify_tr.py` beside the plan.
 *
 * Five concepts: Function Definition and Notation (4MAT), Types of Functions
 * (Merrill), Equality of Functions (4MAT), Composition of Functions (Merrill),
 * Identity and Inverse Functions (Merrill). No recap, setup or Next Session
 * slide: the TR has none. Feedback slide is `formless` (rule 41, 2026-11-21).
 *
 * Composition is written (g ∘ f)(x) = g(f(x)), f first, as in the TR. Last
 * session's relation composition R ∘ S was R first; the convention slide says so.
 *
 * Parallel reveal (content rule 6): where a table row and its diagram belong
 * together, ONE `useBuild(n)` claims the steps and drives both, so the row and
 * the diagram change on the same press.
 */

const SESSION = 'Functions'
const C1 = 'Function Definition and Notation'
const C2 = 'Types of Functions'
const C3 = 'Equality of Functions'
const C4 = 'Composition of Functions'
const C5 = 'Identity and Inverse Functions'
const AGENDA = [C1, C2, C3, C4, C5]

export const functionsMeta: DeckMeta = {
  title: SESSION,
  course: 'DSM',
  lesson: SESSION,
  presenter: 'NxtWave Instructor',
  player: { autoHideControls: true },
}

/* ── shared helpers ──────────────────────────────────────────────────────── */

/** Claim `n` build steps once and return how many have been reached. */
function useBuild(n: number): number {
  return useClaimedSteps(n).filter(Boolean).length
}

const mono = (s: string) => <span className="font-mono">{s}</span>
/** A table header that is maths keeps its case: DataTable uppercases headers, and F(X) is not f(x). */
const mh = (s: string) => <span className="normal-case tracking-normal">{s}</span>

/** A cell that fades up when its answer is revealed. */
function Fresh({ children }: { children: ReactNode }) {
  const instant = useInstant()
  return (
    <motion.span className="inline-block" initial={{ opacity: instant ? 1 : 0, y: instant ? 0 : 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: instant ? 0 : 0.52, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.span>
  )
}

/** A table whose answer columns arrive one row per press, driven by `k`. */
function SyncTable({ columns, rows, k, keep = 1, compact = true }: { columns: TableColumn[]; rows: ReactNode[][]; k: number; keep?: number; compact?: boolean }) {
  return (
    <DataTable
      className="w-full"
      compact={compact}
      columns={columns}
      highlight={k > 0 ? [k] : []}
      rows={rows.map((r, i) => r.map((c, j) => (j < keep ? c : i < k ? <Fresh key={`${i}-${j}`}>{c}</Fresh> : '')))}
    />
  )
}

/** Small numbered cards, one per press. */
function StepCards({ items, cols = 1 }: { items: [ReactNode, ReactNode?][]; cols?: number }) {
  return (
    <div className="grid w-full gap-3" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {items.map(([t, sub], i) => (
        <Step key={i} className="flex items-center gap-3 rounded-card border border-line bg-white px-4 py-3 shadow-card-soft">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full font-heading text-[16px] font-semibold text-white" style={{ background: colors.brand }}>
            {i + 1}
          </span>
          <span>
            <span className="block font-heading text-[19px] font-semibold" style={{ color: colors.ink }}>
              {t}
            </span>
            {sub && (
              <span className="block text-[17px]" style={{ color: colors.ink }}>
                {sub}
              </span>
            )}
          </span>
        </Step>
      ))}
    </div>
  )
}

/* ── arrow diagrams: sets as ovals, elements as dots ────────────────────── */

interface SetCol {
  set: string
  items: string[]
}
interface SetFrame {
  cols: SetCol[]
  edges?: GraphEdge[]
  states?: Record<string, NodeState>
  marks?: GraphMark[]
  caption?: ReactNode
}
interface Layout {
  x0?: number
  top?: number
  colGap?: number
  rowGap?: number
  dir?: 'right' | 'down'
}

const nodeW = (label: string) => (label.length > 2 ? 22 + label.length * 11 : undefined)

function setNodes(cols: SetCol[], states: Record<string, NodeState> = {}, { x0 = 70, top = 52, colGap = 200, rowGap = 62, dir = 'right' }: Layout = {}): GraphNode[] {
  const longest = Math.max(...cols.map((c) => c.items.length))
  return cols.flatMap((c, ci) =>
    c.items.map((it, i) => {
      const id = `${c.set}:${it}`
      const along = (i + (longest - c.items.length) / 2) * rowGap
      const across = ci * colGap
      return {
        id,
        label: it,
        w: nodeW(it),
        state: states[id],
        x: dir === 'right' ? x0 + across : x0 + along,
        y: dir === 'right' ? top + along : top + across,
      }
    }),
  )
}

function setGroups(cols: SetCol[]): GraphGroup[] {
  const names = [...new Set(cols.map((c) => c.set))]
  return names.map((s) => ({ id: `g-${s}`, nodes: cols.filter((c) => c.set === s).flatMap((c) => c.items.map((it) => `${s}:${it}`)) }))
}

/** Edges for a mapping, from set `a` to set `b`. */
const arr = (list: [string, string][], a = 'X', b = 'Y', o: Partial<GraphEdge> = {}): GraphEdge[] =>
  list.map(([x, y]) => ({ id: `${a}:${x}>${b}:${y}`, from: `${a}:${x}`, to: `${b}:${y}`, ...o }))

/**
 * One arrow diagram. With `at`, it shows that frame and claims no steps, so a
 * slide can drive it from the same counter as a table (content rule 6).
 * The set names sit in a band above, centred on their columns.
 */
function SetMap({ frames, at, width, height, layout = {}, names = true }: { frames: SetFrame[]; at?: number; width: number; height: number; layout?: Layout; names?: boolean }) {
  const built: GraphFrame[] = frames.map((f) => ({
    nodes: setNodes(f.cols, f.states, layout),
    edges: f.edges,
    groups: setGroups(f.cols),
    marks: f.marks,
    caption: f.caption,
  }))
  const shown = at === undefined ? built : [built[Math.min(at, built.length - 1)]]
  const ref = frames[at === undefined ? 0 : Math.min(at, frames.length - 1)]
  const { x0 = 70, colGap = 200 } = layout
  const sets = [...new Set(ref.cols.map((c) => c.set))]
  const showNames = names && (layout.dir ?? 'right') === 'right'
  return (
    <div style={{ width }}>
      {showNames && (
        <div className="relative h-[30px]">
          {sets.map((s) => {
            const idx = ref.cols.map((c, i) => (c.set === s ? i : -1)).filter((i) => i >= 0)
            const x = x0 + (idx.reduce((a, b) => a + b, 0) / idx.length) * colGap
            return (
              <span key={s} className="absolute top-0 whitespace-nowrap font-heading text-[19px] font-semibold" style={{ left: x, transform: 'translateX(-50%)', color: colors.ink }}>
                {s}
              </span>
            )
          })}
        </div>
      )}
      <RelationGraph width={width} height={height} frames={shown} />
    </div>
  )
}

/* ── machine chains: values and machines as pills ───────────────────────── */

interface Link {
  id: string
  label: ReactNode
  /** A machine (lit pill); a value otherwise. */
  m?: boolean
  w?: number
  state?: NodeState
}
function chainNodes(items: Link[], y: number, x0 = 0, gap = 48): GraphNode[] {
  let x = x0
  return items.map((it) => {
    const w = it.w ?? 100
    const n: GraphNode = { id: it.id, x: x + w / 2, y, label: it.label, w, state: it.state ?? (it.m ? 'lit' : 'plain') }
    x += w + gap
    return n
  })
}
const chainEdges = (items: Link[], tone?: GraphEdge['tone']): GraphEdge[] =>
  items.slice(1).map((it, i) => ({ id: `${items[i].id}>${it.id}`, from: items[i].id, to: it.id, tone }))

/* ── figure data ─────────────────────────────────────────────────────────── */

const X3 = { set: 'X', items: ['1', '2', '3'] }
const Yabc = { set: 'Y', items: ['a', 'b', 'c'] }
const Yabcd = { set: 'Y', items: ['a', 'b', 'c', 'd'] }
const Yab = { set: 'Y', items: ['a', 'b'] }

const sq = (x: number) => x * x

/** x² over four choices of domain and codomain. */
const X2_CASES: { sets: string; dom: [number, number]; cod: [number, number]; verdict: string }[] = [
  { sets: 'R → R', dom: [-2.3, 2.3], cod: [-1.4, 5], verdict: 'Not one-to-one, not onto' },
  { sets: 'R → [0, ∞)', dom: [-2.3, 2.3], cod: [0, 5], verdict: 'Not one-to-one, onto' },
  { sets: '[0, ∞) → R', dom: [0, 2.3], cod: [-1.4, 5], verdict: 'One-to-one, not onto' },
  { sets: '[0, ∞) → [0, ∞)', dom: [0, 2.3], cod: [0, 5], verdict: 'Bijective' },
]

/* ── slides that drive two things from one counter ──────────────────────── */

function FunctionOrNot() {
  const k = useBuild(4)
  const frames: SetFrame[] = [
    { cols: [X3, Yabc] },
    { cols: [X3, Yabc], edges: arr([['1', 'a'], ['2', 'b'], ['3', 'b']], 'X', 'Y', { tone: 'ok' }) },
    { cols: [X3, Yabc], edges: arr([['1', 'a'], ['2', 'b']]), states: { 'X:3': 'warn' }, marks: [{ id: 'm', node: 'X:3', text: 'no image', side: 'left', tone: 'warn' }] },
    {
      cols: [X3, Yabc],
      edges: [...arr([['1', 'a'], ['1', 'b']], 'X', 'Y', { tone: 'warn' }), ...arr([['2', 'c'], ['3', 'c']])],
      states: { 'X:1': 'warn' },
      marks: [{ id: 'm', node: 'X:1', text: 'two images', side: 'left', tone: 'warn' }],
    },
    { cols: [X3, Yabc], edges: arr([['1', 'c'], ['2', 'c'], ['3', 'c']], 'X', 'Y', { tone: 'ok' }) },
  ]
  return (
    <div className="grid w-full grid-cols-[1.55fr_1fr] items-center gap-8">
      <SyncTable
        k={k}
        columns={[{ label: 'Relation', weight: 1.7 }, { label: 'Function?', weight: 0.7 }, { label: 'Reason', weight: 1.5 }]}
        rows={[
          [mono('{(1, a), (2, b), (3, b)}'), 'Yes', 'Each input has one image'],
          [mono('{(1, a), (2, b)}'), 'No', '3 has no image'],
          [mono('{(1, a), (1, b), (2, c), (3, c)}'), 'No', '1 has two images'],
          [mono('{(1, c), (2, c), (3, c)}'), 'Yes', 'Every input has one image'],
        ]}
      />
      <SetMap at={k} width={400} height={200} layout={{ x0: 160, top: 40, colGap: 180, rowGap: 62 }} frames={frames} />
    </div>
  )
}

function TestOneToOne() {
  const k = useBuild(2)
  const Z = { set: 'Z', items: ['−2', '0', '2'] }
  const frames: SetFrame[] = [
    { cols: [{ set: 'x', items: ['−2', '0', '2'] }, { set: '2x + 3', items: ['−1', '3', '7'] }] },
    { cols: [{ set: 'x', items: ['−2', '0', '2'] }, { set: '2x + 3', items: ['−1', '3', '7'] }], edges: arr([['−2', '−1'], ['0', '3'], ['2', '7']], 'x', '2x + 3', { tone: 'ok' }) },
    {
      cols: [{ ...Z, set: 'x' }, { set: 'x²', items: ['0', '4'] }],
      edges: arr([['−2', '4'], ['2', '4']], 'x', 'x²', { tone: 'warn' }).concat(arr([['0', '0']], 'x', 'x²')),
      states: { 'x²:4': 'warn' },
      marks: [{ id: 'm', node: 'x²:4', text: 'shared', side: 'right', tone: 'warn' }],
    },
  ]
  return (
    <div className="grid w-full grid-cols-[1.45fr_1fr] items-center gap-8">
      <div className="space-y-4">
        <SyncTable
          k={k}
          columns={[{ label: 'Function on Z', weight: 1 }, { label: 'One-to-one?', weight: 1.05 }, { label: 'Why', weight: 1.5 }]}
          rows={[
            ['f(x) = 2x + 3', 'Yes', 'Different x, different 2x + 3'],
            ['g(x) = x²', 'No', 'g(2) = g(−2) = 4'],
          ]}
        />
        <Callout kind="info" title="Aadhaar numbers" asStep={false}>
          Two different people never share one number
        </Callout>
      </div>
      <SetMap at={k} width={420} height={200} layout={{ x0: 110, top: 40, colGap: 190, rowGap: 62 }} frames={frames} />
    </div>
  )
}

function TestOnto() {
  const k = useBuild(2)
  const X = { set: 'x', items: ['0', '1', '2'] }
  const frames: SetFrame[] = [
    { cols: [X, { set: 'x + 1', items: ['1', '2', '3'] }] },
    { cols: [X, { set: 'x + 1', items: ['1', '2', '3'] }], edges: arr([['0', '1'], ['1', '2'], ['2', '3']], 'x', 'x + 1', { tone: 'ok' }) },
    {
      cols: [X, { set: '2x', items: ['0', '1', '2', '3', '4'] }],
      edges: arr([['0', '0'], ['1', '2'], ['2', '4']], 'x', '2x'),
      states: { '2x:1': 'warn', '2x:3': 'warn' },
      marks: [{ id: 'm', node: '2x:3', text: 'missed', side: 'right', tone: 'warn' }],
    },
  ]
  return (
    <div className="grid w-full grid-cols-[1.45fr_1fr] items-center gap-8">
      <SyncTable
        k={k}
        columns={[{ label: 'Function on Z' }, { label: 'Onto?', weight: 0.6 }, { label: 'Why', weight: 1.8 }]}
        rows={[
          ['f(x) = x + 1', 'Yes', 'Any y comes from x = y − 1'],
          ['g(x) = 2x', 'No', 'Odd numbers, such as 3, are missed'],
        ]}
      />
      <SetMap at={k} width={420} height={290} layout={{ x0: 110, top: 34, colGap: 190, rowGap: 56 }} frames={frames} />
    </div>
  )
}

function FourCombinations() {
  const k = useBuild(4)
  const cells: { title: string; cols: SetCol[]; edges: [string, string][]; warn: string[]; missed: string[]; why: string }[] = [
    { title: 'One-to-one, onto', cols: [X3, Yabc], edges: [['1', 'a'], ['2', 'b'], ['3', 'c']], warn: [], missed: [], why: 'No sharing, nothing missed' },
    { title: 'One-to-one, into', cols: [X3, Yabcd], edges: [['1', 'a'], ['2', 'b'], ['3', 'c']], warn: [], missed: ['d'], why: 'No sharing, d missed' },
    { title: 'Many-to-one, onto', cols: [X3, Yab], edges: [['1', 'a'], ['2', 'a'], ['3', 'b']], warn: ['a'], missed: [], why: 'a shared, nothing missed' },
    { title: 'Many-to-one, into', cols: [X3, Yabc], edges: [['1', 'a'], ['2', 'a'], ['3', 'b']], warn: ['a'], missed: ['c'], why: 'a shared, c missed' },
  ]
  return (
    <div className="grid w-full grid-cols-4 gap-4">
      {cells.map((cell, i) => {
        const states: Record<string, NodeState> = {}
        cell.warn.forEach((y) => (states[`Y:${y}`] = 'warn'))
        cell.missed.forEach((y) => (states[`Y:${y}`] = 'muted'))
        return (
          <div key={cell.title} className="flex flex-col items-center gap-2" style={{ opacity: k > i ? 1 : 0, transition: 'opacity 520ms cubic-bezier(0.22, 1, 0.36, 1)' }}>
            <span className="font-heading text-[19px] font-semibold" style={{ color: i === 0 ? colors.success : colors.ink }}>
              {cell.title}
            </span>
            <SetMap at={0} width={240} height={250} layout={{ x0: 55, top: 40, colGap: 130, rowGap: 56 }} frames={[{ cols: cell.cols, edges: arr(cell.edges, 'X', 'Y', { tone: i === 0 ? 'ok' : 'brand' }), states }]} />
            <span className="h-[28px] text-center text-[17px] font-medium" style={{ color: colors.ink, opacity: k > i ? 1 : 0 }}>
              {cell.why}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function SameRuleFourWays() {
  const k = useBuild(4)
  return (
    <div className="grid w-full grid-cols-4 gap-4">
      {X2_CASES.map((c, i) => {
        const frame: PlotFrame = {
          curves: [
            ...(c.dom[0] === 0 ? [{ id: 'gone', fn: sq, domain: [-2.3, 0] as [number, number], faded: true }] : []),
            { id: 'f', fn: sq, domain: c.dom, tone: k > i ? (c.verdict === 'Bijective' ? 'ok' : 'brand') : 'muted' },
          ],
          codomain: c.cod,
        }
        return (
          <div key={c.sets} className="flex flex-col items-center gap-2">
            <span className="font-heading text-[19px] font-semibold" style={{ color: colors.ink }}>
              {c.sets}
            </span>
            <FunctionPlot frames={[frame]} width={250} height={170} x={[-2.5, 2.5]} y={[-1.4, 5]} ticks={false} />
            <span className="h-[28px] text-center text-[18px] font-medium" style={{ color: c.verdict === 'Bijective' ? colors.success : colors.ink, opacity: k > i ? 1 : 0, transition: 'opacity 520ms cubic-bezier(0.22, 1, 0.36, 1)' }}>
              {c.verdict}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function CountingHelps() {
  const k = useBuild(3)
  const n = (c: number) => Array.from({ length: c }, (_, i) => `${i + 1}`)
  const cases: { x: number; y: number; edges: [string, string][]; title: string; why: string }[] = [
    { x: 5, y: 4, edges: [['1', '1'], ['2', '2'], ['3', '3'], ['4', '4'], ['5', '4']], title: '|X| > |Y|', why: 'Some output is shared' },
    { x: 3, y: 5, edges: [['1', '1'], ['2', '2'], ['3', '3']], title: '|X| < |Y|', why: 'Some output is missed' },
    { x: 4, y: 4, edges: [['1', '1'], ['2', '2'], ['3', '3'], ['4', '4']], title: '|X| = |Y|', why: 'One-to-one exactly when onto' },
  ]
  return (
    <div className="flex w-full gap-12">
      {cases.map((c, i) => {
        const states: Record<string, NodeState> = {}
        if (i === 0) states['Y:4'] = 'warn'
        if (i === 1) {
          states['Y:4'] = 'muted'
          states['Y:5'] = 'muted'
        }
        return (
          <div key={c.title} className="flex flex-col items-start gap-1" style={{ opacity: k > i ? 1 : 0, transition: 'opacity 520ms cubic-bezier(0.22, 1, 0.36, 1)' }}>
            <SetMap at={0} width={320} height={262} layout={{ x0: 70, top: 32, colGap: 150, rowGap: 50 }} frames={[{ cols: [{ set: 'X', items: n(c.x) }, { set: 'Y', items: n(c.y) }], edges: arr(c.edges), states }]} />
            <span className="h-[28px] whitespace-nowrap text-[18px] font-medium" style={{ color: colors.ink, opacity: k > i ? 1 : 0 }}>
              {c.title}: {c.why.charAt(0).toLowerCase() + c.why.slice(1)}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function FollowArrows() {
  const k = useBuild(3)
  const lit: [string, string][][] = [[], [['1', 'a'], ['a', 'q']], [['2', 'b'], ['b', 'p']], [['3', 'a'], ['a', 'q']]]
  const on = lit[k]
  const tone = (a: string, b: string): GraphEdge['tone'] => (on.length === 0 ? 'brand' : on.some(([x, y]) => x === a && y === b) ? 'ok' : 'muted')
  const fEdges: [string, string][] = [['1', 'a'], ['2', 'b'], ['3', 'a']]
  const gEdges: [string, string][] = [['a', 'q'], ['b', 'p']]
  const frame: SetFrame = {
    cols: [X3, { set: 'Y', items: ['a', 'b'] }, { set: 'Z', items: ['q', 'p'] }],
    edges: [...fEdges.map(([a, b]) => arr([[a, b]], 'X', 'Y', { tone: tone(a, b) })[0]), ...gEdges.map(([a, b]) => arr([[a, b]], 'Y', 'Z', { tone: tone(a, b) })[0])],
  }
  return (
    <div className="grid w-full grid-cols-[1fr_1fr] items-center gap-8">
      <SyncTable
        k={k}
        columns={[{ label: mh('x'), weight: 0.5 }, { label: mh('f(x)'), weight: 0.8 }, { label: mh('(g ∘ f)(x) = g(f(x))'), weight: 1.8 }]}
        rows={[
          ['1', 'a', 'q'],
          ['2', 'b', 'p'],
          ['3', 'a', 'q'],
        ]}
      />
      <SetMap at={0} width={460} height={200} layout={{ x0: 70, top: 40, colGap: 160, rowGap: 62 }} frames={[frame]} />
    </div>
  )
}

function WhenInverseExists() {
  const k = useBuild(3)
  const frames: SetFrame[] = [
    { cols: [Yabc, X3] },
    { cols: [Yabc, X3], edges: [...arr([['a', '1'], ['a', '2']], 'Y', 'X', { tone: 'warn' }), ...arr([['b', '3']], 'Y', 'X')], states: { 'Y:a': 'warn', 'Y:c': 'muted' }, marks: [{ id: 'm', node: 'Y:a', text: 'two outputs', side: 'left', tone: 'warn' }] },
    { cols: [Yabc, X3], edges: arr([['a', '1'], ['b', '2']], 'Y', 'X'), states: { 'Y:c': 'warn' }, marks: [{ id: 'm', node: 'Y:c', text: 'no output', side: 'left', tone: 'warn' }] },
    { cols: [Yabc, X3], edges: arr([['a', '3'], ['b', '1'], ['c', '2']], 'Y', 'X', { tone: 'ok' }) },
  ]
  return (
    <div className="grid w-full grid-cols-[1.5fr_1fr] items-center gap-8">
      <SyncTable
        k={k}
        columns={[{ label: mh('If f is'), weight: 1.3 }, { label: 'Reversing gives', weight: 1.3 }, { label: 'Inverse?', weight: 1 }]}
        rows={[
          ['Not one-to-one, f(1) = f(2) = a', 'a sent to 1 and 2', 'No: two outputs for a'],
          ['Not onto, c never reached', 'c sent to nothing', 'No: c has no output'],
          ['Bijective', 'Each y sent to one x', 'Yes'],
        ]}
      />
      <SetMap at={k} width={400} height={200} layout={{ x0: 170, top: 40, colGap: 180, rowGap: 62 }} frames={frames} />
    </div>
  )
}

/* ── chains ─────────────────────────────────────────────────────────────── */

const LAUNDRY: Link[] = [
  { id: 'dirty', label: 'Dirty clothes', w: 160 },
  { id: 'washer', label: 'Washing machine', m: true, w: 200 },
  { id: 'wet', label: 'Wet clothes', w: 150 },
  { id: 'dryer', label: 'Dryer', m: true, w: 120 },
  { id: 'dry', label: 'Dry clothes', w: 150 },
]
const FX_CHAIN: Link[] = [
  { id: 'x', label: 'x', w: 56 },
  { id: 'f', label: 'f', m: true, w: 56 },
  { id: 'fx', label: 'f(x)', w: 80 },
  { id: 'g', label: 'g', m: true, w: 56 },
  { id: 'gfx', label: 'g(f(x))', w: 104 },
]
const GF_X: Link[] = [
  { id: 'a0', label: 'x', w: 60 },
  { id: 'a1', label: '+ 2', m: true, w: 90 },
  { id: 'a2', label: 'x + 2', w: 100 },
  { id: 'a3', label: 'square', m: true, w: 110 },
  { id: 'a4', label: '(x + 2)²', w: 120 },
]
const FG_X: Link[] = [
  { id: 'b0', label: 'x', w: 60 },
  { id: 'b1', label: 'square', m: true, w: 110 },
  { id: 'b2', label: 'x²', w: 70 },
  { id: 'b3', label: '+ 2', m: true, w: 90 },
  { id: 'b4', label: 'x² + 2', w: 110 },
]
const GF_3: Link[] = [
  { id: 'a0', label: '3', w: 60 },
  { id: 'a1', label: '+ 2', m: true, w: 90 },
  { id: 'a2', label: '5', w: 70 },
  { id: 'a3', label: 'square', m: true, w: 110 },
  { id: 'a4', label: '25', w: 80, state: 'ok' },
]
const FG_3: Link[] = [
  { id: 'b0', label: '3', w: 60 },
  { id: 'b1', label: 'square', m: true, w: 110 },
  { id: 'b2', label: '9', w: 70 },
  { id: 'b3', label: '+ 2', m: true, w: 90 },
  { id: 'b4', label: '11', w: 80, state: 'warn' },
]
const HGF: Link[] = [
  { id: 'x', label: 'x', w: 56 },
  { id: 'f', label: '× 2', m: true, w: 84 },
  { id: 'v1', label: '2x', w: 70 },
  { id: 'g', label: '+ 3', m: true, w: 84 },
  { id: 'v2', label: '2x + 3', w: 110 },
  { id: 'h', label: 'square', m: true, w: 110 },
  { id: 'v3', label: '(2x + 3)²', w: 130, state: 'ok' },
]
const CODE: Link[] = [
  { id: 'm', label: 'HELLO', w: 120 },
  { id: 'enc', label: 'Encrypt', m: true, w: 130 },
  { id: 'c', label: 'IFMMP', w: 120 },
  { id: 'dec', label: 'Decrypt', m: true, w: 130 },
  { id: 'm2', label: 'HELLO', w: 120, state: 'ok' },
]
const ID_CHAIN: Link[] = [
  { id: 'x', label: 'x', w: 56 },
  {
    id: 'i',
    label: (
      <span>
        I<sub>X</sub>
      </span>
    ),
    m: true,
    w: 80,
  },
  { id: 'x2', label: 'x', w: 56 },
  { id: 'f', label: 'f', m: true, w: 56 },
  { id: 'fx', label: 'f(x)', w: 80 },
]
const ROUND: Link[] = [
  { id: 'one', label: '1', w: 60 },
  { id: 'f', label: 'f', m: true, w: 70 },
  { id: 'b', label: 'b', w: 60 },
  { id: 'fi', label: 'f⁻¹', m: true, w: 80 },
  { id: 'one2', label: '1', w: 60, state: 'ok' },
]
const FWD: Link[] = [
  { id: 'f0', label: '4', w: 60 },
  { id: 'f1', label: '× 2', m: true, w: 90 },
  { id: 'f2', label: '8', w: 60 },
  { id: 'f3', label: '+ 3', m: true, w: 90 },
  { id: 'f4', label: '11', w: 70 },
]
const BWD: Link[] = [
  { id: 'r0', label: '11', w: 70 },
  { id: 'r1', label: '− 3', m: true, w: 90 },
  { id: 'r2', label: '8', w: 60 },
  { id: 'r3', label: '÷ 2', m: true, w: 90 },
  { id: 'r4', label: '4', w: 60, state: 'ok' },
]

const INVERSE_FRAMES: SetFrame[] = (() => {
  const f: [string, string][] = [['1', 'b'], ['2', 'c'], ['3', 'a']]
  return [0, 1, 2, 3].map((n) => ({
    cols: [X3, Yabc],
    edges: [...arr(f.slice(n)), ...f.slice(0, n).map(([x, y]) => arr([[y, x]], 'Y', 'X', { tone: 'ok' })[0])],
    caption: n === 3 ? 'f⁻¹: a ↦ 3, b ↦ 1, c ↦ 2' : n === 0 ? 'f: 1 ↦ b, 2 ↦ c, 3 ↦ a' : 'Reversing one arrow at a time',
  }))
})()

/* ── the deck ────────────────────────────────────────────────────────────── */

export const functionsDeck: SlideDef[] = [
  { id: 'brand', section: 'Opening', label: 'Welcome', element: <BrandSlide greeting="Welcome!" lesson={SESSION} /> },
  { id: 'session-name', section: 'Opening', label: 'Session name', element: <WelcomeSlide minimal title={SESSION} lesson={SESSION} /> },
  {
    id: 'agenda',
    section: 'Opening',
    label: 'Agenda',
    element: (
      <AgendaSlide
        kicker={SESSION}
        title="Agenda"
        lesson={SESSION}
        items={[
          { title: C1, sub: 'Domain, codomain and range' },
          { title: C2, sub: 'One-to-one, onto and bijective' },
          { title: C3, sub: 'When two functions are the same' },
          { title: C4, sub: 'Combining and evaluating functions' },
          { title: C5, sub: 'Undoing a function' },
        ]}
      />
    ),
  },

  /* ── CONCEPT 1: Function Definition and Notation (4MAT) ──────────────── */
  { id: 'c1-divider', section: C1, label: 'Divider', element: <SectionBreakerSlide index={1} title={C1} lesson={SESSION} /> },
  {
    id: 'c1-rules',
    section: C1,
    label: 'Rules We Use',
    element: (
      <ContentSlide kicker={C1} title="Rules We Use" lead="Each input gives back exactly one answer" lesson={SESSION}>
        <RelationGraph
          width={900}
          height={250}
          frames={[0, 1, 2].map((s) => ({
            nodes: [
              { id: 'roll', x: 110, y: 40, label: 'Roll number 21', w: 190 },
              { id: 'name', x: 450, y: 40, label: 'Asha', w: 110 },
              { id: 'asha', x: 110, y: 125, label: 'Asha', w: 110 },
              { id: 'dob', x: 450, y: 125, label: '12 March 2006', w: 180 },
              { id: 'code', x: 110, y: 210, label: 'Barcode 8901', w: 180 },
              { id: 'price', x: 450, y: 210, label: '₹ 40', w: 100 },
            ].filter((_, i) => Math.floor(i / 2) <= s),
            edges: [
              { id: 'e1', from: 'roll', to: 'name' },
              { id: 'e2', from: 'asha', to: 'dob' },
              { id: 'e3', from: 'code', to: 'price' },
            ].slice(0, s + 1),
            marks: [
              { id: 'm1', node: 'name', text: 'student name', side: 'right' as const, tone: 'ink' as const },
              { id: 'm2', node: 'dob', text: 'date of birth', side: 'right' as const, tone: 'ink' as const },
              { id: 'm3', node: 'price', text: 'price at the counter', side: 'right' as const, tone: 'ink' as const },
            ].slice(0, s + 1),
          }))}
        />
      </ContentSlide>
    ),
    notes: 'Each roll number belongs to exactly one student; each student has exactly one date of birth; each barcode gives one price at the billing counter. Ask learners for one more rule like this from their own day.',
  },
  {
    id: 'c1-two-outputs',
    section: C1,
    label: 'One Input, Two Outputs',
    element: (
      <ContentSlide
        kicker={C1}
        title="One Input, Two Outputs"
        lead="Some rules give one input more than one answer"
        lesson={SESSION}
        points={[
          { text: 'Person to phone number', sub: 'Some people have two numbers', icon: 'warning' },
          { text: 'Button B2 gives chips one day, a biscuit the next', icon: 'warning' },
          { text: 'We cannot rely on a rule like this', icon: 'cross' },
        ]}
      >
        <RelationGraph
          width={420}
          height={220}
          frames={[
            {
              nodes: [
                { id: 'ravi', x: 70, y: 110, label: 'Ravi', w: 100 },
                { id: 'p1', x: 320, y: 50, label: '98480 11111', w: 170 },
                { id: 'p2', x: 320, y: 170, label: '90000 22222', w: 170 },
              ],
              edges: [
                { id: 'a', from: 'ravi', to: 'p1', tone: 'warn' },
                { id: 'b', from: 'ravi', to: 'p2', tone: 'warn' },
              ],
            },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'A vending machine that sometimes gives chips and sometimes a biscuit for B2 would not be a function. Ask learners for one rule that is a function and one that is not.',
  },
  {
    id: 'c1-function',
    section: C1,
    label: 'Function',
    element: (
      <ContentSlide
        kicker={C1}
        title="Function"
        lead="A function f from X to Y relates every x in X to exactly one y in Y"
        lesson={SESSION}
        points={[
          { text: 'Every input is used', sub: 'Each x ∈ X has an image', icon: 'check' },
          { text: 'Only one output', sub: 'No x ∈ X has two images', icon: 'check' },
          { text: 'An element of Y may get no arrow, or several', icon: 'info' },
        ]}
      >
        <SetMap
          width={420}
          height={270}
          layout={{ x0: 110, top: 40, colGap: 200, rowGap: 62 }}
          frames={[{ cols: [X3, Yabcd], edges: arr([['1', 'a'], ['2', 'a'], ['3', 'c']]), caption: 'One arrow leaves each x' }]}
        />
      </ContentSlide>
    ),
    notes: 'Link back to the previous session: a function is a relation, a subset of X × Y, with these two extra conditions. Elements of Y may receive no arrow or several arrows; the conditions are only about X.',
  },
  {
    id: 'c1-function-or-not',
    section: C1,
    label: 'Function or Not?',
    element: (
      <ContentSlide kicker={C1} title="Function or Not?" lead="X = {1, 2, 3} and Y = {a, b, c}: check every input" lesson={SESSION}>
        <FunctionOrNot />
      </ContentSlide>
    ),
    notes: 'Row 4 surprises learners: many inputs may share one output. That is allowed.',
  },
  {
    id: 'c1-matrix-test',
    section: C1,
    label: 'Matrix Test',
    element: (
      <ContentSlide
        kicker={C1}
        title="Matrix Test"
        lead="In the relation matrix of a function, every row has exactly one 1"
        lesson={SESSION}
        points={[
          { text: 'One 1 in every row: a function', icon: 'check' },
          { text: 'Row 1 with two 1s: not a function', icon: 'cross' },
          { text: 'On graph paper, this is the vertical line test', icon: 'info' },
        ]}
      >
        <div className="flex gap-8">
          <BitStrip elements={['a', 'b', 'c']} cell={46} labelWidth={40} frames={[{ rows: [{ label: '1', bits: '100' }, { label: '2', bits: '010' }, { label: '3', bits: '010' }], caption: 'Function' }]} />
          <BitStrip elements={['a', 'b', 'c']} cell={46} labelWidth={40} frames={[{ rows: [{ label: '1', bits: '110' }, { label: '2', bits: '001' }, { label: '3', bits: '001' }], caption: 'Not a function' }]} />
        </div>
      </ContentSlide>
    ),
    notes: 'Left: the first relation from the table. Right: the third, where row 1 has two 1s. The graph-paper version of this test is the vertical line test learners know from school.',
  },
  {
    id: 'c1-notation',
    section: C1,
    label: 'Function Notation',
    element: (
      <ContentSlide
        kicker={C1}
        title="Function Notation"
        lead="Three short ways to write a function and what it does"
        lesson={SESSION}
        points={[
          { text: 'f: X → Y', sub: 'f is a function from X to Y', icon: 'arrow' },
          { text: 'y = f(x)', sub: 'y is the output for x', icon: 'arrow' },
          { text: 'x ↦ x²', sub: 'x goes to x²', icon: 'arrow' },
        ]}
      >
        <div className="grid grid-cols-3 gap-3 rounded-card border border-line bg-white p-5 shadow-card-soft">
          {[
            ['f', 'name of the function'],
            ['X', 'where inputs come from'],
            ['Y', 'where outputs land'],
          ].map(([s, t]) => (
            <div key={s} className="flex flex-col items-center gap-2 text-center">
              <span className="font-mono text-[40px] font-semibold" style={{ color: colors.brandDark }}>
                {s}
              </span>
              <span className="text-[17px]" style={{ color: colors.ink }}>
                {t}
              </span>
            </div>
          ))}
        </div>
      </ContentSlide>
    ),
    notes: 'Write f: X → Y on the board and point at each part. The rule x ↦ x² is read "x goes to x squared".',
  },
  {
    id: 'c1-images',
    section: C1,
    label: 'Images and Preimages',
    element: (
      <ContentSlide
        kicker={C1}
        title="Images and Preimages"
        lead="f: R → R, f(x) = x²"
        lesson={SESSION}
        points={[
          { text: 'f(3) = 9: 9 is the image of 3', icon: 'arrow' },
          { text: 'Preimages of 9: 3 and −3', icon: 'check' },
          { text: '−4 has no preimage', sub: 'No real square is negative', icon: 'cross' },
        ]}
      >
        <SetMap
          width={420}
          height={200}
          layout={{ x0: 110, top: 40, colGap: 200, rowGap: 62 }}
          frames={[
            {
              cols: [
                { set: 'Inputs', items: ['3', '−3', '2'] },
                { set: 'Outputs', items: ['9', '4', '−4'] },
              ],
              edges: arr([['3', '9'], ['−3', '9'], ['2', '4']], 'Inputs', 'Outputs'),
              states: { 'Outputs:−4': 'muted' },
            },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Stress: an element of X has exactly one image, but an element of Y can have zero, one or many preimages.',
  },
  {
    id: 'c1-domain-codomain',
    section: C1,
    label: 'Domain and Codomain',
    element: (
      <ContentSlide
        kicker={C1}
        title="Domain and Codomain"
        lead="f(x) = 2x from X = {1, 2, 3, 4} to Y = {1, 2, …, 10}"
        lesson={SESSION}
        points={[
          { text: 'Domain: X, the set of all inputs', icon: 'arrow' },
          { text: 'Codomain: Y, where outputs may land', icon: 'target' },
        ]}
      >
        <SetMap
          width={440}
          height={300}
          layout={{ x0: 80, top: 34, colGap: 160, rowGap: 52 }}
          frames={[
            {
              cols: [
                { set: 'X', items: ['1', '2', '3', '4'] },
                { set: 'Y', items: ['2', '4', '6', '8'] },
                { set: 'Y', items: ['1', '3', '5', '7', '9', '10'] },
              ],
              edges: arr([['1', '2'], ['2', '4'], ['3', '6'], ['4', '8']]),
            },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'The codomain is part of the definition of the function: it is chosen, not computed.',
  },
  {
    id: 'c1-range',
    section: C1,
    label: 'Range',
    element: (
      <ContentSlide
        kicker={C1}
        title="Range"
        lead="Range f(X) = {f(x) | x ∈ X}: the outputs that actually occur"
        lesson={SESSION}
        points={[
          { text: 'Here the range is {2, 4, 6, 8}', icon: 'check' },
          { text: 'Range ⊆ codomain, always', icon: 'info' },
          { text: 'Exam hall: every seat is the codomain, filled seats are the range', icon: 'bulb' },
        ]}
      >
        <SetMap
          width={440}
          height={300}
          layout={{ x0: 80, top: 34, colGap: 160, rowGap: 52 }}
          frames={[
            {
              cols: [
                { set: 'X', items: ['1', '2', '3', '4'] },
                { set: 'Y', items: ['2', '4', '6', '8'] },
                { set: 'Y', items: ['1', '3', '5', '7', '9', '10'] },
              ],
              edges: arr([['1', '2'], ['2', '4'], ['3', '6'], ['4', '8']], 'X', 'Y', { tone: 'ok' }),
              states: { 'Y:2': 'ok', 'Y:4': 'ok', 'Y:6': 'ok', 'Y:8': 'ok' },
            },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'The codomain is part of the function’s definition; the range is computed from the rule. Changing the codomain changes the function, as the next concept shows.',
  },
  {
    id: 'c1-quick-check',
    section: C1,
    label: 'Find the Three Sets',
    element: (
      <ContentSlide kicker={C1} title="Find the Three Sets" lead="Name the domain, codomain and range of each" lesson={SESSION}>
        <div className="w-full space-y-3">
          <DataTable
            className="w-full"
            compact
            revealColumn={3}
            columns={[{ label: 'Function', weight: 2.1 }, { label: 'Domain', weight: 0.8 }, { label: 'Codomain', weight: 0.8 }, { label: 'Range', weight: 1.1 }]}
            rows={[
              ['f: R → R, f(x) = x²', 'R', 'R', '[0, ∞)'],
              ['g: Z → Z, g(x) = |x|', 'Z', 'Z', '{0, 1, 2, 3, …}'],
              ['h: {a, b, c} → {1, 2, 3}, h(a) = h(b) = 1, h(c) = 3', '{a, b, c}', '{1, 2, 3}', '{1, 3}'],
            ]}
          />
          <Callout kind="info" title="Think about it">
            Why is 2 not in the range of h?
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes: 'Ask why 2 is not in the range of h: no element is sent to it. This gap between range and codomain is exactly what "onto" is about.',
  },

  /* ── CONCEPT 2: Types of Functions (Merrill) ─────────────────────────── */
  { id: 'c2-divider', section: C2, label: 'Divider', element: <SectionBreakerSlide index={2} title={C2} lesson={SESSION} /> },
  {
    id: 'c2-shared-missed',
    section: C2,
    label: 'Shared and Missed',
    element: (
      <ContentSlide kicker={C2} title="Shared and Missed" lead="Look again at h: {a, b, c} → {1, 2, 3}" lesson={SESSION}>
        <SetMap
          width={560}
          height={230}
          layout={{ x0: 150, top: 40, colGap: 220, rowGap: 62 }}
          frames={[
            { cols: [{ set: 'X', items: ['a', 'b', 'c'] }, { set: 'Y', items: ['1', '2', '3'] }], edges: arr([['a', '1'], ['b', '1'], ['c', '3']]), caption: 'h(a) = h(b) = 1 and h(c) = 3' },
            {
              cols: [{ set: 'X', items: ['a', 'b', 'c'] }, { set: 'Y', items: ['1', '2', '3'] }],
              edges: [...arr([['a', '1'], ['b', '1']], 'X', 'Y', { tone: 'warn' }), ...arr([['c', '3']])],
              states: { 'Y:1': 'warn' },
              marks: [{ id: 's', node: 'Y:1', text: 'shared', side: 'right', tone: 'warn' }],
              caption: 'a and b share the output 1',
            },
            {
              cols: [{ set: 'X', items: ['a', 'b', 'c'] }, { set: 'Y', items: ['1', '2', '3'] }],
              edges: [...arr([['a', '1'], ['b', '1']], 'X', 'Y', { tone: 'warn' }), ...arr([['c', '3']])],
              states: { 'Y:1': 'warn', 'Y:2': 'muted' },
              marks: [
                { id: 's', node: 'Y:1', text: 'shared', side: 'right', tone: 'warn' },
                { id: 'm', node: 'Y:2', text: 'missed', side: 'right', tone: 'danger' },
              ],
              caption: '2 is never reached',
            },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Added opening slide, from the quick check. Two things can go "wrong" in a function without breaking the definition: an output is shared, or an output is missed.',
  },
  {
    id: 'c2-two-questions',
    section: C2,
    label: 'Two Questions',
    element: (
      <ContentSlide kicker={C2} title="Two Questions" lead="Ask these about any function" lesson={SESSION}>
        <div className="w-full space-y-4">
          <StepCards
            cols={2}
            items={[
              ['Is any output shared?', 'Two inputs, one output'],
              ['Is any output missed?', 'An output no input reaches'],
            ]}
          />
          <Callout kind="note" title="Why names matter">
            Without names for the answers, we cannot classify a function or reverse it
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes: 'Added opening slide. The two answers place any function in one of four boxes, which comes later in this concept.',
  },
  {
    id: 'c2-one-to-one',
    section: C2,
    label: 'One-to-One',
    element: (
      <ContentSlide
        kicker={C2}
        title="One-to-One"
        lead="Different inputs always give different outputs"
        lesson={SESSION}
        points={[
          { text: 'f(x₁) = f(x₂) ⇒ x₁ = x₂', icon: 'check' },
          { text: 'Arrow test: no two arrows meet', icon: 'arrow' },
          { text: 'Also called injective', icon: 'info' },
        ]}
      >
        <div className="flex gap-4">
          <SetMap width={200} height={210} layout={{ x0: 45, top: 40, colGap: 110, rowGap: 62 }} frames={[{ cols: [X3, Yabc], edges: arr([['1', 'a'], ['2', 'b'], ['3', 'c']], 'X', 'Y', { tone: 'ok' }), caption: 'One-to-one' }]} />
          <SetMap
            width={200}
            height={210}
            layout={{ x0: 45, top: 40, colGap: 110, rowGap: 62 }}
            frames={[{ cols: [X3, Yabc], edges: [...arr([['1', 'a'], ['2', 'a']], 'X', 'Y', { tone: 'warn' }), ...arr([['3', 'c']])], states: { 'Y:a': 'warn' }, caption: 'Two arrows meet' }]}
          />
        </div>
      </ContentSlide>
    ),
    notes: 'Equivalently, x₁ ≠ x₂ ⇒ f(x₁) ≠ f(x₂). Learners remember this as "no sharing of outputs".',
  },
  {
    id: 'c2-test-one-to-one',
    section: C2,
    label: 'Testing One-to-One',
    element: (
      <ContentSlide kicker={C2} title="Testing One-to-One" lead="One counterexample is enough to say no" lesson={SESSION}>
        <TestOneToOne />
      </ContentSlide>
    ),
    notes: 'One counterexample is enough to show a function is not one-to-one.',
  },
  {
    id: 'c2-prove-one-to-one',
    section: C2,
    label: 'Proving One-to-One',
    element: (
      <ContentSlide kicker={C2} title="Proving One-to-One" lead="Claim: f: R → R, f(x) = 3x − 5 is one-to-one" lesson={SESSION}>
        <div className="w-full space-y-3">
          <StepCards
            cols={2}
            items={[
              ['Suppose f(a) = f(b)'],
              ['Then 3a − 5 = 3b − 5'],
              ['So 3a = 3b, and a = b'],
              ['Equal outputs force equal inputs'],
            ]}
          />
          <Callout kind="info" title="To disprove">
            Find two different inputs with the same output, as with g(2) = g(−2) for x²
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes: 'This "assume f(a) = f(b), show a = b" pattern is the standard exam proof. Exam hook: prove or disprove that a given function is one-to-one.',
  },
  {
    id: 'c2-many-to-one',
    section: C2,
    label: 'Many-to-One',
    element: (
      <ContentSlide
        kicker={C2}
        title="Many-to-One"
        lead="Not one-to-one: at least two inputs share an output"
        lesson={SESSION}
        points={[
          { text: 'Student to grade: many students get A', icon: 'dot' },
          { text: 'x² on Z: 3 and −3 both go to 9', icon: 'dot' },
          { text: 'Still a function: each input has one output', icon: 'check' },
        ]}
      >
        <SetMap
          width={420}
          height={210}
          layout={{ x0: 110, top: 40, colGap: 200, rowGap: 62 }}
          frames={[{ cols: [X3, Yab], edges: [...arr([['1', 'a'], ['2', 'a']], 'X', 'Y', { tone: 'warn' }), ...arr([['3', 'b']])], states: { 'Y:a': 'warn' }, caption: 'h(1) = h(2) = a' }]}
        />
      </ContentSlide>
    ),
    notes: 'Many-to-one is still a function: each input still has exactly one output. Only the outputs are shared.',
  },
  {
    id: 'c2-onto',
    section: C2,
    label: 'Onto',
    element: (
      <ContentSlide
        kicker={C2}
        title="Onto"
        lead="Every output in the codomain is reached: range = codomain"
        lesson={SESSION}
        points={[
          { text: 'Arrow test: every y gets an arrow', icon: 'arrow' },
          { text: 'Every seat in the hall is filled', icon: 'bulb' },
          { text: 'Also called surjective', icon: 'info' },
        ]}
      >
        <div className="flex gap-4">
          <SetMap width={200} height={210} layout={{ x0: 45, top: 40, colGap: 110, rowGap: 62 }} frames={[{ cols: [X3, Yab], edges: arr([['1', 'a'], ['2', 'b'], ['3', 'b']], 'X', 'Y', { tone: 'ok' }), caption: 'Onto' }]} />
          <SetMap
            width={200}
            height={210}
            layout={{ x0: 45, top: 40, colGap: 110, rowGap: 62 }}
            frames={[{ cols: [{ set: 'X', items: ['1', '2'] }, Yabc], edges: arr([['1', 'a'], ['2', 'b']]), states: { 'Y:c': 'muted' }, caption: 'c is missed' }]}
          />
        </div>
      </ContentSlide>
    ),
    notes: 'To show onto, start from an arbitrary y and find an x that maps to it. To disprove, find one y that is never reached.',
  },
  {
    id: 'c2-test-onto',
    section: C2,
    label: 'Testing Onto',
    element: (
      <ContentSlide kicker={C2} title="Testing Onto" lead="Start from any output and look for an input" lesson={SESSION}>
        <TestOnto />
      </ContentSlide>
    ),
    notes: 'For x + 1, any integer y comes from the integer y − 1. For 2x, every output is even, so no odd number is reached.',
  },
  {
    id: 'c2-prove-onto',
    section: C2,
    label: 'Proving Onto',
    element: (
      <ContentSlide kicker={C2} title="Proving Onto" lead="Claim: f: R → R, f(x) = 3x − 5 is onto" lesson={SESSION}>
        <StepCards
          items={[
            ['Take any y ∈ R and solve y = 3x − 5', 'x = (y + 5)/3'],
            ['This x is a real number', 'f(x) = 3 × (y + 5)/3 − 5 = y'],
            ['Every y has a preimage, so f is onto'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Start from an arbitrary output, solve for the input, and check the input is in the domain.',
  },
  {
    id: 'c2-sets-decide',
    section: C2,
    label: 'Sets Decide',
    element: (
      <ContentSlide
        kicker={C2}
        title="Sets Decide"
        lead="Same rule 3x − 5, now as f: Z → Z"
        lesson={SESSION}
        points={[
          { text: 'For y = 0 we need x = 5/3', icon: 'target' },
          { text: '5/3 is not an integer, so 0 is missed', icon: 'cross' },
          { text: 'Read the sets before the formula', icon: 'bulb' },
        ]}
      >
        <SetMap
          width={420}
          height={300}
          layout={{ x0: 110, top: 34, colGap: 200, rowGap: 56 }}
          frames={[
            {
              cols: [
                { set: 'X', items: ['1', '2', '3'] },
                { set: 'Y', items: ['−2', '−1', '0', '1', '4'] },
              ],
              edges: arr([['1', '−2'], ['2', '1'], ['3', '4']]),
              states: { 'Y:0': 'warn', 'Y:−1': 'muted' },
              marks: [{ id: 'm', node: 'Y:0', text: 'needs 5/3', side: 'right', tone: 'warn' }],
            },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'The same formula can be onto or not depending on the domain and codomain. Always read the sets before the formula.',
  },
  {
    id: 'c2-into',
    section: C2,
    label: 'Into',
    element: (
      <ContentSlide
        kicker={C2}
        title="Into"
        lead="Not onto: some element of the codomain has no preimage"
        lesson={SESSION}
        points={[
          { text: 'Range is a proper subset of the codomain', icon: 'info' },
          { text: '2x on Z is into: odd numbers are missed', icon: 'dot' },
          { text: 'Every function is onto or into, never both', icon: 'check' },
        ]}
      >
        <SetMap
          width={420}
          height={260}
          layout={{ x0: 110, top: 40, colGap: 200, rowGap: 60 }}
          frames={[{ cols: [X3, Yabcd], edges: arr([['1', 'a'], ['2', 'b'], ['3', 'c']]), states: { 'Y:d': 'muted' }, marks: [{ id: 'm', node: 'Y:d', text: 'no preimage', side: 'right', tone: 'danger' }] }]}
        />
      </ContentSlide>
    ),
    notes: 'Into and onto are opposites, just like one-to-one and many-to-one. Every function is exactly one of onto or into, and exactly one of one-to-one or many-to-one.',
  },
  {
    id: 'c2-bijective',
    section: C2,
    label: 'Bijective',
    element: (
      <ContentSlide
        kicker={C2}
        title="Bijective"
        lead="One-to-one and onto: every output is reached exactly once"
        lesson={SESSION}
        points={[
          { text: '3x − 5 on R is bijective', sub: 'Proved one-to-one and onto', icon: 'check' },
          { text: 'Exam seats, all filled: one student per seat', icon: 'bulb' },
          { text: 'Finite sets need |X| = |Y|', icon: 'info' },
        ]}
      >
        <SetMap width={420} height={210} layout={{ x0: 110, top: 40, colGap: 200, rowGap: 62 }} frames={[{ cols: [X3, Yabc], edges: arr([['1', 'a'], ['2', 'b'], ['3', 'c']], 'X', 'Y', { tone: 'ok' }), caption: 'Also called a one-to-one correspondence' }]} />
      </ContentSlide>
    ),
    notes: 'Bijections are the functions that can be reversed; this is the key idea for inverse functions in the last concept.',
  },
  {
    id: 'c2-four',
    section: C2,
    label: 'Four Combinations',
    element: (
      <ContentSlide kicker={C2} title="Four Combinations" lesson={SESSION}>
        <FourCombinations />
      </ContentSlide>
    ),
    notes: 'Ask two questions for any function: is any output shared? Is any output missed? The answers place it in one of the four boxes.',
  },
  {
    id: 'c2-x-squared',
    section: C2,
    label: 'Same Rule, Four Ways',
    element: (
      <ContentSlide kicker={C2} title="Same Rule, Four Ways" lead="f(x) = x², with the codomain marked on the y-axis" lesson={SESSION}>
        <SameRuleFourWays />
      </ContentSlide>
    ),
    notes: 'Shrinking the domain removes sharing; shrinking the codomain removes missed outputs. This trick is used again to create inverses. f(2) = f(−2) breaks one-to-one; −1 is never reached, which breaks onto.',
  },
  {
    id: 'c2-counting',
    section: C2,
    label: 'Counting Helps',
    element: (
      <ContentSlide kicker={C2} title="Counting Helps" lead="For finite sets, compare the sizes of X and Y" lesson={SESSION}>
        <CountingHelps />
      </ContentSlide>
    ),
    notes: 'The pigeonhole idea: 5 pigeons in 4 holes forces sharing. The third fact saves work: for equal-sized finite sets, checking one property is enough. It does not hold for infinite sets: n ↦ n + 1 on {0, 1, 2, …} is one-to-one but not onto.',
  },
  {
    id: 'c2-your-turn',
    section: C2,
    label: 'Your Turn',
    element: (
      <ContentSlide kicker={C2} title="Your Turn" lead="Vote first, then check one row at a time" lesson={SESSION}>
        <YourTurnClassify />
      </ContentSlide>
    ),
    notes: 'For k: different reals have different cubes, and every real y is the cube of its cube root. For h: 2 is never a square of an integer, so h is not onto.',
  },
  {
    id: 'c2-back-to-h',
    section: C2,
    label: 'Back to h',
    element: (
      <ContentSlide
        kicker={C2}
        title="Back to h"
        lead="h from the quick check, classified"
        lesson={SESSION}
        points={[
          { text: 'Shrinking the codomain removes missed outputs', icon: 'check' },
          { text: 'Shrinking the domain removes sharing', icon: 'check' },
        ]}
      >
        <SetMap
          width={420}
          height={210}
          layout={{ x0: 110, top: 40, colGap: 200, rowGap: 62 }}
          frames={[
            { cols: [{ set: 'X', items: ['a', 'b', 'c'] }, { set: 'Y', items: ['1', '2', '3'] }], edges: arr([['a', '1'], ['b', '1'], ['c', '3']]), states: { 'Y:2': 'muted' }, caption: 'Codomain {1, 2, 3}: many-to-one, into' },
            { cols: [{ set: 'X', items: ['a', 'b', 'c'] }, { set: 'Y', items: ['1', '3'] }], edges: arr([['a', '1'], ['b', '1'], ['c', '3']], 'X', 'Y', { tone: 'ok' }), caption: 'Codomain {1, 3}: many-to-one, onto' },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Added Integration slide. The same rule with a smaller codomain is a different function, and here it becomes onto.',
  },
  { id: 'quiz-1', section: C2, label: 'Quiz Time', element: <QuizTimeSlide lesson={SESSION} /> },

  /* ── CONCEPT 3: Equality of Functions (4MAT) ─────────────────────────── */
  { id: 'c3-divider', section: C3, label: 'Divider', element: <SectionBreakerSlide index={3} title={C3} lesson={SESSION} /> },
  {
    id: 'c3-two-formulas',
    section: C3,
    label: 'Two Formulas',
    element: (
      <ContentSlide kicker={C3} title="Two Formulas" lead="f(x) = x² and g(x) = 3x − 2 on X = {1, 2}" lesson={SESSION}>
        <TwoTables />
      </ContentSlide>
    ),
    notes: 'Let learners compute both columns before showing them.',
  },
  {
    id: 'c3-same',
    section: C3,
    label: 'Same Function?',
    element: (
      <ContentSlide
        kicker={C3}
        title="Same Function?"
        lead="Formulas differ, outputs match: one function or two?"
        lesson={SESSION}
        points={[
          { text: 'Formulas alone cannot decide', icon: 'warning' },
          { text: 'We need a test that compares behaviour', icon: 'target' },
        ]}
      >
        <TwoTables small />
      </ContentSlide>
    ),
    notes: 'Added opening slide. Equality is about behaviour, not the look of the formula.',
  },
  {
    id: 'c3-equal',
    section: C3,
    label: 'Equal Functions',
    element: (
      <ContentSlide kicker={C3} title="Equal Functions" lead="f and g are equal when all three hold" lesson={SESSION}>
        <div className="w-full space-y-3">
          <StepCards items={[['Same domain'], ['Same codomain'], ['f(x) = g(x) for every x in the domain']]} />
          <Callout kind="success" title="So">
            x² and 3x − 2 are equal as functions from {'{1, 2}'} to Z
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes: 'f(1) = 1 = g(1) and f(2) = 4 = g(2), so f = g, even though the formulas look different. But the domain and codomain must match first.',
  },
  {
    id: 'c3-domain-first',
    section: C3,
    label: 'Domain Comes First',
    element: (
      <ContentSlide kicker={C3} title="Domain Comes First" lead="f(x) = (x² − 1)/(x − 1) and g(x) = x + 1 as real functions" lesson={SESSION}>
        <DomainFirst />
      </ContentSlide>
    ),
    notes: 'For every x ≠ 1 the two give the same output, but f has no value at x = 1. Different domains, so not equal.',
  },
  {
    id: 'c3-your-turn',
    section: C3,
    label: 'Your Turn',
    element: (
      <ContentSlide kicker={C3} title="Your Turn" lead="Codomain Z in every row: equal or not?" lesson={SESSION}>
        <YourTurnEqual />
      </ContentSlide>
    ),
    notes: 'Rows 2 and 3 use the same formulas: whether they are equal depends on the domain.',
  },

  /* ── CONCEPT 4: Composition of Functions (Merrill) ───────────────────── */
  { id: 'c4-divider', section: C4, label: 'Divider', element: <SectionBreakerSlide index={4} title={C4} lesson={SESSION} /> },
  {
    id: 'c4-one-after',
    section: C4,
    label: 'One After Another',
    element: (
      <ContentSlide kicker={C4} title="One After Another" lead="Laundry runs through two machines" lesson={SESSION}>
        <RelationGraph width={1060} height={120} frames={[2, 3, 5].map((n) => ({ nodes: chainNodes(LAUNDRY, 60, 0, 44).slice(0, n), edges: chainEdges(LAUNDRY).slice(0, n - 1) }))} />
      </ContentSlide>
    ),
    notes: 'The washing machine takes dirty clothes and gives wet clothes; the dryer takes wet clothes and gives dry clothes.',
  },
  {
    id: 'c4-handoff',
    section: C4,
    label: 'Output Becomes Input',
    element: (
      <ContentSlide kicker={C4} title="Output Becomes Input" lead="Dryer only accepts what the washer gives out" lesson={SESSION}>
        <div className="w-full space-y-4">
          <RelationGraph width={1060} height={120} frames={[{ nodes: chainNodes(LAUNDRY.map((l) => (l.id === 'wet' ? { ...l, state: 'ok' as NodeState } : l)), 60, 0, 44), edges: chainEdges(LAUNDRY) }]} />
          <Callout kind="note" title="What we need">
            One name for the two-step machine that takes dirty clothes to dry clothes
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes: 'Added opening slide. The handoff is the whole idea: the second machine must accept every output of the first.',
  },
  {
    id: 'c4-composition',
    section: C4,
    label: 'Composition',
    element: (
      <ContentSlide
        kicker={C4}
        title="Composition"
        lead="f: X → Y and g: Y → Z give g ∘ f: X → Z"
        lesson={SESSION}
        points={[
          { text: '(g ∘ f)(x) = g(f(x))', icon: 'arrow' },
          { text: 'f acts first: read right to left', icon: 'info' },
          { text: 'Last session, R ∘ S meant R first', sub: 'Always check the convention', icon: 'warning' },
        ]}
      >
        <SetMap
          width={440}
          height={200}
          layout={{ x0: 60, top: 70, colGap: 160, rowGap: 72 }}
          frames={[
            { cols: [{ set: 'X', items: ['1', '2'] }, { set: 'Y', items: ['a', 'b'] }, { set: 'Z', items: ['q', 'p'] }], edges: arr([['1', 'a'], ['2', 'b']]), caption: 'f: X → Y' },
            { cols: [{ set: 'X', items: ['1', '2'] }, { set: 'Y', items: ['a', 'b'] }, { set: 'Z', items: ['q', 'p'] }], edges: [...arr([['1', 'a'], ['2', 'b']]), ...arr([['a', 'q'], ['b', 'p']], 'Y', 'Z')], caption: 'then g: Y → Z' },
            {
              cols: [{ set: 'X', items: ['1', '2'] }, { set: 'Y', items: ['a', 'b'] }, { set: 'Z', items: ['q', 'p'] }],
              edges: [...arr([['1', 'a'], ['2', 'b']], 'X', 'Y', { tone: 'muted' }), ...arr([['a', 'q'], ['b', 'p']], 'Y', 'Z', { tone: 'muted' }), ...arr([['1', 'q']], 'X', 'Z', { kind: 'dashed', tone: 'ok', bend: -80 })],
              caption: 'g ∘ f: X → Z in one step',
            },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Read g ∘ f from right to left: f acts first. Note the difference from the relation notation R ∘ S used last session (R first). For functions, most books including Grimaldi write g ∘ f for "f first"; always check which convention a question uses.',
  },
  {
    id: 'c4-follow',
    section: C4,
    label: 'Follow the Arrows',
    element: (
      <ContentSlide kicker={C4} title="Follow the Arrows" lead="f: 1 ↦ a, 2 ↦ b, 3 ↦ a and g: a ↦ q, b ↦ p" lesson={SESSION}>
        <FollowArrows />
      </ContentSlide>
    ),
    notes: 'X = {1, 2, 3}, Y = {a, b}, Z = {p, q}. So g ∘ f: 1 ↦ q, 2 ↦ p, 3 ↦ q. Trace each two-step path with a finger.',
  },
  {
    id: 'c4-fails',
    section: C4,
    label: 'When It Fails',
    element: (
      <ContentSlide
        kicker={C4}
        title="When It Fails"
        lead="f ∘ g would mean g first, then f"
        lesson={SESSION}
        points={[
          { text: 'g gives out p and q', icon: 'arrow' },
          { text: 'f only accepts 1, 2 and 3', icon: 'info' },
          { text: 'So f ∘ g is not defined here', icon: 'cross' },
        ]}
      >
        <SetMap
          width={440}
          height={200}
          layout={{ x0: 60, top: 40, colGap: 160, rowGap: 62 }}
          frames={[
            {
              cols: [{ set: 'Y', items: ['a', 'b'] }, { set: 'Z', items: ['q', 'p'] }, X3],
              edges: [...arr([['a', 'q'], ['b', 'p']], 'Y', 'Z'), ...arr([['q', '1']], 'Z', 'X', { tone: 'danger', kind: 'dashed', crossed: true })],
            },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'g ∘ f needs the outputs of f to be valid inputs of g. One order can make sense while the other does not.',
  },
  {
    id: 'c4-formulas',
    section: C4,
    label: 'With Formulas',
    element: (
      <ContentSlide kicker={C4} title="With Formulas" lead="f, g: R → R with f(x) = x + 2 and g(x) = x²" lesson={SESSION}>
        <RelationGraph
          width={1000}
          height={230}
          frames={[
            { nodes: chainNodes(GF_X, 50, 130), edges: chainEdges(GF_X), marks: [{ id: 'l1', node: 'a0', text: '(g ∘ f)(x)', side: 'left', tone: 'brand' }] },
            {
              nodes: [...chainNodes(GF_X, 50, 130), ...chainNodes(FG_X, 175, 130)],
              edges: [...chainEdges(GF_X), ...chainEdges(FG_X)],
              marks: [
                { id: 'l1', node: 'a0', text: '(g ∘ f)(x)', side: 'left', tone: 'brand' },
                { id: 'l2', node: 'b0', text: '(f ∘ g)(x)', side: 'left', tone: 'brand' },
              ],
            },
          ]}
        />
      </ContentSlide>
    ),
    notes: '(g ∘ f)(x) = g(x + 2) = (x + 2)², and (f ∘ g)(x) = f(x²) = x² + 2. Work from the inside out.',
  },
  {
    id: 'c4-order',
    section: C4,
    label: 'Order Matters',
    element: (
      <ContentSlide kicker={C4} title="Order Matters" lead="Feed both chains the input 3" lesson={SESSION}>
        <div className="w-full space-y-4">
          <RelationGraph
            width={1000}
            height={230}
            frames={[
              {
                nodes: [...chainNodes(GF_3, 50, 130), ...chainNodes(FG_3, 175, 130)],
                edges: [...chainEdges(GF_3), ...chainEdges(FG_3)],
                marks: [
                  { id: 'l1', node: 'a0', text: '(g ∘ f)(3)', side: 'left', tone: 'brand' },
                  { id: 'l2', node: 'b0', text: '(f ∘ g)(3)', side: 'left', tone: 'brand' },
                ],
              },
            ]}
          />
          <Callout kind="warning" title="Not commutative">
            g ∘ f ≠ f ∘ g in general, just as socks then shoes is not shoes then socks
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes: '(g ∘ f)(3) = 25 but (f ∘ g)(3) = 11. Use the everyday version: "put on socks, then shoes" is not the same as "shoes, then socks".',
  },
  {
    id: 'c4-associative',
    section: C4,
    label: 'Associative',
    element: (
      <ContentSlide kicker={C4} title="Associative" lead="h ∘ (g ∘ f) = (h ∘ g) ∘ f, so brackets can be dropped" lesson={SESSION}>
        <RelationGraph
          width={1060}
          height={150}
          frames={[
            { nodes: chainNodes(HGF, 70, 0, 40), edges: chainEdges(HGF), caption: 'f(x) = 2x, g(x) = x + 3, h(x) = x² on R' },
            { nodes: chainNodes(HGF, 70, 0, 40), edges: chainEdges(HGF), groups: [{ id: 'gf', nodes: ['f', 'g'] }], caption: 'h ∘ (g ∘ f): group f and g first, result (2x + 3)²' },
            { nodes: chainNodes(HGF, 70, 0, 40), edges: chainEdges(HGF), groups: [{ id: 'hg', nodes: ['g', 'h'], tone: 'ok' }], caption: '(h ∘ g) ∘ f: group g and h first, same result (2x + 3)²' },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Associativity lets us write long chains like h ∘ g ∘ f without brackets.',
  },
  {
    id: 'c4-types',
    section: C4,
    label: 'Types Carry Over',
    element: (
      <ContentSlide
        kicker={C4}
        title="Types Carry Over"
        lead="Composition keeps these properties"
        lesson={SESSION}
        points={[
          { text: 'f, g one-to-one ⇒ g ∘ f one-to-one', icon: 'check' },
          { text: 'f, g onto ⇒ g ∘ f onto', icon: 'check' },
          { text: 'So two bijections compose to a bijection', icon: 'star' },
        ]}
      >
        <SetMap
          width={440}
          height={210}
          layout={{ x0: 60, top: 40, colGap: 160, rowGap: 62 }}
          frames={[
            {
              cols: [X3, Yabc, { set: 'Z', items: ['p', 'q', 'r'] }],
              edges: [...arr([['1', 'a'], ['2', 'b'], ['3', 'c']]), ...arr([['a', 'p'], ['b', 'q'], ['c', 'r']], 'Y', 'Z')],
              caption: 'Two bijections, one after another',
            },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'The type-preserving facts are useful in proofs. Follow any element of Z backwards: exactly one path reaches it.',
  },
  {
    id: 'c4-your-turn',
    section: C4,
    label: 'Your Turn',
    element: (
      <ContentSlide kicker={C4} title="Your Turn" lead="f(x) = 3x − 1 and g(x) = x² + 1 on R: work inside out" lesson={SESSION}>
        <YourTurnCompose />
      </ContentSlide>
    ),
    notes: 'Always compute the innermost function first. Exam hook: questions often ask for both f ∘ g and g ∘ f to test whether learners keep the order straight.',
  },
  {
    id: 'c4-laundry',
    section: C4,
    label: 'Back to the Laundry',
    element: (
      <ContentSlide kicker={C4} title="Back to the Laundry" lead="Washer, then dryer, is dryer ∘ washer" lesson={SESSION}>
        <div className="w-full space-y-4">
          <RelationGraph
            width={900}
            height={110}
            frames={[
              { nodes: chainNodes(LAUNDRY, 55, 0, 44), edges: chainEdges(LAUNDRY) },
              { nodes: chainNodes(FX_CHAIN.map((l, i) => ({ ...l, w: LAUNDRY[i].w })), 55, 0, 44).map((n, i) => ({ ...n, id: LAUNDRY[i].id })), edges: chainEdges(LAUNDRY) },
            ]}
          />
          <Callout kind="info" title="Read right to left">
            In g ∘ f, the first machine f is written last
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes: 'Added Integration slide. The washer is f, the dryer is g, and the whole laundry is g ∘ f.',
  },

  /* ── CONCEPT 5: Identity and Inverse Functions (Merrill) ─────────────── */
  { id: 'c5-divider', section: C5, label: 'Divider', element: <SectionBreakerSlide index={5} title={C5} lesson={SESSION} /> },
  {
    id: 'c5-undo',
    section: C5,
    label: 'Undoing a Step',
    element: (
      <ContentSlide kicker={C5} title="Undoing a Step" lead="Decryption must give back exactly the original message" lesson={SESSION}>
        <RelationGraph width={1000} height={120} frames={[3, 5].map((n) => ({ nodes: chainNodes(CODE, 60, 30, 48).slice(0, n), edges: chainEdges(CODE).slice(0, n - 1) }))} />
      </ContentSlide>
    ),
    notes: 'Added opening slide. Here each letter moves one place forward; decryption moves it one place back.',
  },
  {
    id: 'c5-undo-fails',
    section: C5,
    label: 'When Undo Fails',
    element: (
      <ContentSlide
        kicker={C5}
        title="When Undo Fails"
        lead="If two inputs share an output, going back has two choices"
        lesson={SESSION}
        points={[
          { text: 'Squaring sends 2 and −2 to 4', icon: 'arrow' },
          { text: 'Going back from 4 cannot pick one', icon: 'cross' },
        ]}
      >
        <SetMap
          width={420}
          height={200}
          layout={{ x0: 110, top: 40, colGap: 200, rowGap: 62 }}
          frames={[
            { cols: [{ set: 'x', items: ['2', '−2'] }, { set: 'x²', items: ['4'] }], edges: arr([['2', '4'], ['−2', '4']], 'x', 'x²') },
            {
              cols: [{ set: 'x', items: ['2', '−2'] }, { set: 'x²', items: ['4'] }],
              edges: arr([['4', '2'], ['4', '−2']], 'x²', 'x', { tone: 'warn' }),
              states: { 'x²:4': 'warn' },
              marks: [{ id: 'm', node: 'x²:4', text: 'which one?', side: 'right', tone: 'warn' }],
            },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Added opening slide. Hash functions are like this on purpose: many inputs, one output, so the input cannot be recovered.',
  },
  {
    id: 'c5-identity',
    section: C5,
    label: 'Identity Function',
    element: (
      <ContentSlide
        kicker={C5}
        title="Identity Function"
        lead={
          <>
            I<sub>X</sub>: X → X with I<sub>X</sub>(x) = x for every x in X
          </>
        }
        lesson={SESSION}
        points={[
          { text: 'Each element goes to itself', icon: 'arrow' },
          { text: 'Identity is bijective', icon: 'check' },
        ]}
      >
        <SetMap width={420} height={210} layout={{ x0: 110, top: 40, colGap: 200, rowGap: 62 }} frames={[{ cols: [X3, { set: 'X ', items: ['1', '2', '3'] }], edges: arr([['1', '1'], ['2', '2'], ['3', '3']], 'X', 'X ', { tone: 'ok' }) }]} />
      </ContentSlide>
    ),
    notes: 'The identity function looks trivial, but it is what an inverse must produce: undoing a function should leave you exactly where you started.',
  },
  {
    id: 'c5-identity-composition',
    section: C5,
    label: 'Identity in Composition',
    element: (
      <ContentSlide
        kicker={C5}
        title="Identity in Composition"
        lead={
          <>
            For any f: X → Y, f ∘ I<sub>X</sub> = f and I<sub>Y</sub> ∘ f = f
          </>
        }
        lesson={SESSION}
      >
        <div className="w-full space-y-4">
          <RelationGraph width={700} height={110} frames={[{ nodes: chainNodes(ID_CHAIN, 55, 0, 48), edges: chainEdges(ID_CHAIN) }]} />
          <Callout kind="info" title="Like multiplying by 1">
            Passing through the identity leaves every input unchanged
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes: 'Multiplying a number by 1 leaves it unchanged; the identity function plays the same role for composition.',
  },
  {
    id: 'c5-inverse',
    section: C5,
    label: 'Inverse Function',
    element: (
      <ContentSlide
        kicker={C5}
        title="Inverse Function"
        lead="f bijective: f⁻¹(y) = x exactly when f(x) = y"
        lesson={SESSION}
        points={[
          { text: 'Reverse every arrow of f', icon: 'route' },
          { text: 'f⁻¹ goes from Y back to X', icon: 'arrow' },
        ]}
      >
        <SetMap width={420} height={210} layout={{ x0: 110, top: 40, colGap: 200, rowGap: 62 }} frames={INVERSE_FRAMES} />
      </ContentSlide>
    ),
    notes: 'f: 1 ↦ b, 2 ↦ c, 3 ↦ a. Reversing gives f⁻¹: a ↦ 3, b ↦ 1, c ↦ 2.',
  },
  {
    id: 'c5-check',
    section: C5,
    label: 'Checking an Inverse',
    element: (
      <ContentSlide
        kicker={C5}
        title="Checking an Inverse"
        lead={
          <>
            f⁻¹ ∘ f = I<sub>X</sub> and f ∘ f⁻¹ = I<sub>Y</sub>
          </>
        }
        lesson={SESSION}
      >
        <div className="w-full space-y-4">
          <RelationGraph width={700} height={110} frames={[{ nodes: chainNodes(ROUND, 55, 0, 44), edges: chainEdges(ROUND) }]} />
          <Callout kind="warning" title="Careful">
            f⁻¹ does not mean 1/f
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes: 'Check one element both ways: f(1) = b and f⁻¹(b) = 1.',
  },
  {
    id: 'c5-exists',
    section: C5,
    label: 'When an Inverse Exists',
    element: (
      <ContentSlide kicker={C5} title="When an Inverse Exists" lead="f has an inverse exactly when f is bijective" lesson={SESSION}>
        <WhenInverseExists />
      </ContentSlide>
    ),
    notes: 'This explains the condition rather than asking learners to memorise it: the reversed relation must itself pass the function test.',
  },
  {
    id: 'c5-formula',
    section: C5,
    label: 'Inverse From a Formula',
    element: (
      <ContentSlide kicker={C5} title="Inverse From a Formula" lead="f: R → R, f(x) = 3x − 5 is bijective, so solve for x" lesson={SESSION}>
        <div className="w-full space-y-3">
          <StepCards items={[['Write y = 3x − 5'], ['Solve for x: x = (y + 5)/3'], ['So f⁻¹(x) = (x + 5)/3']]} />
          <Callout kind="success" title="Check">
            f(f⁻¹(x)) = 3 × (x + 5)/3 − 5 = x
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes: 'Always confirm bijectivity first, then solve, then check with a composition. The check catches algebra slips.',
  },
  {
    id: 'c5-restrict',
    section: C5,
    label: 'Restricting the Sets',
    element: (
      <ContentSlide
        kicker={C5}
        title="Restricting the Sets"
        lead="x² on R has no inverse: neither one-to-one nor onto"
        lesson={SESSION}
        points={[
          { text: 'Restrict to [0, ∞) → [0, ∞)', sub: 'Now bijective', icon: 'check' },
          { text: 'Inverse: f⁻¹(x) = √x', icon: 'arrow' },
          { text: '√(x²) = x for x ≥ 0, and (√x)² = x', icon: 'check' },
        ]}
      >
        <FunctionPlot
          width={420}
          height={330}
          x={[-2.5, 5]}
          y={[-1, 5]}
          frames={[
            { curves: [{ id: 'sq', fn: sq, domain: [-2.2, 2.2] }], caption: 'x² on R' },
            { curves: [{ id: 'sqL', fn: sq, domain: [-2.2, 0], faded: true }, { id: 'sq', fn: sq, domain: [0, 2.2] }], codomain: [0, 5], caption: 'Restricted to [0, ∞)' },
            {
              curves: [{ id: 'sqL', fn: sq, domain: [-2.2, 0], faded: true }, { id: 'sq', fn: sq, domain: [0, 2.2] }, { id: 'rt', fn: Math.sqrt, domain: [0, 4.9], tone: 'ok' }],
              codomain: [0, 5],
              mirror: true,
              labels: [
                { id: 'l1', x: 1.6, y: 2.56, text: 'x²', side: 'left', tone: 'brand' },
                { id: 'l2', x: 4, y: 2, text: '√x', side: 'below', tone: 'ok' },
              ],
              caption: '√x is its mirror image in y = x',
            },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'This is why the square root symbol always means the non-negative root: it is the inverse of squaring restricted to non-negative numbers.',
  },
  {
    id: 'c5-composition-inverse',
    section: C5,
    label: 'Inverse of a Composition',
    element: (
      <ContentSlide kicker={C5} title="Inverse of a Composition" lead="(g ∘ f)⁻¹ = f⁻¹ ∘ g⁻¹: undo the last step first" lesson={SESSION}>
        <div className="w-full space-y-3">
          <RelationGraph
            width={900}
            height={190}
            frames={[
              { nodes: chainNodes(FWD, 40, 160), edges: chainEdges(FWD), marks: [{ id: 'l1', node: 'f0', text: 'g ∘ f', side: 'left', tone: 'brand' }], caption: 'f(x) = 2x, then g(x) = x + 3: (g ∘ f)(4) = 11' },
              {
                nodes: [...chainNodes(FWD, 40, 160), ...chainNodes(BWD, 140, 160)],
                edges: [...chainEdges(FWD), ...chainEdges(BWD, 'ok')],
                marks: [
                  { id: 'l1', node: 'f0', text: 'g ∘ f', side: 'left', tone: 'brand' },
                  { id: 'l2', node: 'r0', text: 'f⁻¹ ∘ g⁻¹', side: 'left', tone: 'ok' },
                ],
                caption: 'g⁻¹(x) = x − 3 first, then f⁻¹(x) = x/2: back to 4',
              },
            ]}
          />
          <Callout kind="info" title="Socks and shoes" asStep={false}>
            Morning: socks, then shoes; night: shoes off first, then socks
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes: '(g ∘ f)(x) = 2x + 3, so (g ∘ f)⁻¹(x) = (x − 3)/2. And (f⁻¹ ∘ g⁻¹)(x) = f⁻¹(x − 3) = (x − 3)/2, which matches.',
  },
  {
    id: 'c5-your-turn',
    section: C5,
    label: 'Your Turn',
    element: (
      <ContentSlide kicker={C5} title="Your Turn" lead="f(x) = 2x + 1 and g(x) = x³ on R, both bijective" lesson={SESSION}>
        <YourTurnInverse />
      </ContentSlide>
    ),
    notes: 'Row 4 links back to row 3: since (g ∘ f)(1) = 27, the inverse must send 27 back to 1. Encourage learners to use such checks in exams.',
  },
  {
    id: 'c5-computing',
    section: C5,
    label: 'Functions in Computing',
    element: (
      <ContentSlide kicker={C5} title="Functions in Computing" lead="Same ideas, inside the software we use" lesson={SESSION}>
        <DataTable
          className="w-full"
          stepped
          compact
          columns={[{ label: 'Use', weight: 1.3 }, { label: 'Type of function' }, { label: 'Why it matters', weight: 1.7 }]}
          rows={[
            ['Hash functions', 'Many-to-one', 'Fixed-size outputs, so collisions are expected'],
            ['Encryption', 'Bijective', 'Decryption is the inverse function'],
            ['Character codes, such as ASCII', 'Bijective', 'Each character has one code, and back'],
            ['Data pipelines', 'Composition', 'Output of one step is input of the next'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Keep this brief. The point is that one-to-one, onto and inverses decide whether data can be recovered.',
  },

  /* ── CLOSING ─────────────────────────────────────────────────────────── */
  { id: 'quiz-2', section: 'Closing', label: 'Quiz Time', element: <QuizTimeSlide lesson={SESSION} /> },
  { id: 'takeaways', section: 'Closing', label: 'Key Takeaways', element: <KeyTakeawaysSlide title={SESSION} lesson={SESSION} points={AGENDA} /> },
  { id: 'feedback', section: 'Closing', label: 'Feedback', element: <FeedbackSlide lesson={SESSION} formless />, notes: 'No form and no QR (content rule 41 as amended 2026-11-21). Ask for feedback out loud.' },
  { id: 'thank-you', section: 'Closing', label: 'Thank you', element: <ThankYouSlide title="Thank You" lesson={SESSION} /> },
  { id: 'all-the-best', section: 'Closing', label: 'All the best', element: <ThankYouSlide title="All the Best" lesson={SESSION} /> },
]

/* ── remaining driven slides (function declarations are hoisted) ──────── */

function YourTurnClassify() {
  const k = useBuild(4)
  return (
    <SyncTable
      k={k}
      columns={[{ label: 'Function', weight: 1.9 }, { label: 'One-to-one?', weight: 0.8 }, { label: 'Onto?', weight: 1 }, { label: 'Type', weight: 1.1 }]}
      rows={[
        ['f: Z → Z, f(x) = x + 5', 'Yes', 'Yes', 'Bijective'],
        ['g: N → N, g(n) = n + 1', 'Yes', 'No: 0 is missed', 'One-to-one, into'],
        ['h: Z → Z, h(x) = x²', 'No', 'No', 'Many-to-one, into'],
        ['k: R → R, k(x) = x³', 'Yes', 'Yes', 'Bijective'],
      ]}
    />
  )
}

function TwoTables({ small = false }: { small?: boolean }) {
  const t = (name: string) => (
    <DataTable
      className="w-full"
      compact
      columns={[{ label: mh('x') }, { label: mh(`${name}(x)`) }]}
      rows={[
        ['1', '1'],
        ['2', '4'],
      ]}
    />
  )
  return (
    <div className={`grid ${small ? 'w-[420px]' : 'w-[760px]'} grid-cols-[1fr_auto_1fr] items-center gap-5`}>
      {t('f')}
      <span className="font-heading text-[34px] font-semibold" style={{ color: colors.brandDark }}>
        {small ? '?' : '='}
      </span>
      {t('g')}
    </div>
  )
}

function DomainFirst() {
  const line = (x: number) => x + 1
  return (
    <div className="w-full space-y-4">
      <div className="flex gap-8">
        {[
          { name: 'f(x) = (x² − 1)/(x − 1)', hole: true },
          { name: 'g(x) = x + 1', hole: false },
        ].map((p) => (
          <div key={p.name} className="flex flex-col items-center gap-2">
            <span className="font-heading text-[19px] font-semibold" style={{ color: colors.ink }}>
              {p.name}
            </span>
            <FunctionPlot
              width={360}
              height={200}
              x={[-2.5, 3.2]}
              y={[-1.2, 4.4]}
              frames={[
                {
                  curves: [{ id: 'l', fn: line, domain: [-2.2, 3] }],
                  holes: p.hole ? [{ x: 1, y: 2 }] : [],
                                  },
              ]}
            />
          </div>
        ))}
      </div>
      <Callout kind="error" title="Not equal">
        f has no value at x = 1, so the two domains differ
      </Callout>
    </div>
  )
}

function YourTurnEqual() {
  const k = useBuild(3)
  return (
    <SyncTable
      k={k}
      keep={2}
      columns={[{ label: 'Functions', weight: 1.3 }, { label: 'Domain', weight: 1.2 }, { label: 'Equal?', weight: 0.6 }, { label: 'Reason', weight: 1.4 }]}
      rows={[
        ['f(x) = x³, g(x) = x', '{−1, 0, 1}', 'Yes', 'Outputs −1, 0, 1 match'],
        ['f(x) = |x|, g(x) = x²', '{−1, 0, 1}', 'Yes', 'Outputs 1, 0, 1 match'],
        ['f(x) = |x|, g(x) = x²', '{−2, −1, 0, 1, 2}', 'No', 'f(2) = 2 but g(2) = 4'],
      ]}
    />
  )
}

function YourTurnCompose() {
  const k = useBuild(4)
  return (
    <SyncTable
      k={k}
      keep={2}
      columns={[{ label: 'Find', weight: 0.8 }, { label: 'Working', weight: 1.6 }, { label: 'Answer', weight: 0.7 }]}
      rows={[
        ['(f ∘ g)(2)', 'g(2) = 5, then f(5)', '14'],
        ['(g ∘ f)(2)', 'f(2) = 5, then g(5)', '26'],
        ['(f ∘ f)(x)', 'f(3x − 1) = 3(3x − 1) − 1', '9x − 4'],
        ['(g ∘ g)(1)', 'g(1) = 2, then g(2)', '5'],
      ]}
    />
  )
}

function YourTurnInverse() {
  const k = useBuild(5)
  return (
    <SyncTable
      k={k}
      keep={1}
      columns={[{ label: 'Find', weight: 0.9 }, { label: 'Working', weight: 1.7 }, { label: 'Answer', weight: 0.7 }]}
      rows={[
        ['f⁻¹(x)', 'y = 2x + 1, so x = (y − 1)/2', '(x − 1)/2'],
        ['g⁻¹(x)', 'y = x³, so x = ∛y', '∛x'],
        ['(g ∘ f)(1)', 'f(1) = 3, then g(3)', '27'],
        ['(g ∘ f)⁻¹(27)', 'f⁻¹(g⁻¹(27)) = f⁻¹(3)', '1'],
        ['f⁻¹(f(5))', 'f⁻¹ undoes f', '5'],
      ]}
    />
  )
}
