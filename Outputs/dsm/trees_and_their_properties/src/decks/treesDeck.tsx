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

/**
 * TREES AND THEIR PROPERTIES (DSM, Graph Theory).
 *
 * Built from the signed-off plan at
 *   Outputs/dsm/session_plans/trees_and_their_properties/plan.md
 * (42 slides, one per TR slide). Every claim was brute-forced by `verify_tr.py`.
 * No cross-session phrases (user rule, 2026-11-26).
 * Graph figure shared with Basic Concepts of Graphs: text-free SVG edges and
 * teardrop loops, DOM vertex discs and badges placed clear of each other.
 */

const SESSION = 'Trees and Their Properties'
const C1 = 'Moving Around a Graph'
const C2 = 'What Is a Tree'
const C3 = 'The Unique Path Property'
const C4 = 'The n − 1 Edges Property'
const C5 = 'Building Intuition'
const C6 = 'Putting It All Together'
const AGENDA = [C1, C2, C3, C4, C5, C6]

export const treesMeta: DeckMeta = {
  title: SESSION,
  course: 'DSM',
  lesson: SESSION,
  presenter: 'NxtWave Instructor',
  player: { autoHideControls: true },
}

/* ── shared helpers ─────────────────────────────────────────────────────── */

function useBuild(n: number): number {
  return useClaimedSteps(n).filter(Boolean).length
}

const EASE = [0.22, 1, 0.36, 1] as const

function Fresh({ children, className = 'inline-block' }: { children: ReactNode; className?: string }) {
  const instant = useInstant()
  return (
    <motion.span className={className} initial={{ opacity: instant ? 1 : 0, y: instant ? 0 : 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: instant ? 0 : 0.52, ease: EASE }}>
      {children}
    </motion.span>
  )
}

type Tone = 'ok' | 'warn' | 'bad' | 'brand' | 'grey'
const TONE = { ok: colors.success, warn: colors.warning, bad: '#B91C1C', brand: colors.brandDark, grey: '#64748B' }
const BLUE = colors.brand
const ORANGE = '#EA580C'
const PURPLE = '#7C3AED'

function RevealTable({ columns, rows, keep = 1 }: { columns: TableColumn[]; rows: ReactNode[][]; keep?: number }) {
  const k = useBuild(rows.length)
  return (
    <DataTable
      className="w-full"
      compact
      columns={columns}
      highlight={k > 0 ? [k] : []}
      rows={rows.map((r, i) => r.map((c, j) => (j < keep ? c : i < k ? <Fresh key={`${i}-${j}`}>{c}</Fresh> : '')))}
    />
  )
}

function Card({ children, tone, className = '' }: { children: ReactNode; tone?: Tone; className?: string }) {
  const c = tone ? TONE[tone] : undefined
  return (
    <div className={`rounded-card border border-line bg-white px-5 py-4 shadow-card-soft ${className}`} style={c ? { boxShadow: `inset 0 0 0 2px ${c}55`, background: `${c}0D` } : undefined}>
      {children}
    </div>
  )
}

const Label = ({ children, tone }: { children: ReactNode; tone?: Tone }) => (
  <span className="block font-heading text-[17px] font-semibold uppercase tracking-wide" style={{ color: tone ? TONE[tone] : colors.brandDark }}>
    {children}
  </span>
)

const Txt = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <span className={`block text-[19px] ${className}`} style={{ color: colors.ink }}>
    {children}
  </span>
)

function Steps({ items }: { items: [ReactNode, ReactNode?][] }) {
  return (
    <div className="w-fit min-w-[460px] space-y-2">
      {items.map(([t, v], i) => (
        <Step key={i} className="flex items-center gap-3 rounded-card border border-line bg-white px-4 py-2.5 shadow-card-soft">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full font-heading text-[16px] font-semibold text-white" style={{ background: colors.brand }}>
            {i + 1}
          </span>
          <span className="mr-auto pr-6 text-[19px]" style={{ color: colors.ink }}>
            {t}
          </span>
          {v && (
            <span className="font-heading text-[21px] font-semibold" style={{ color: colors.brandDark }}>
              {v}
            </span>
          )}
        </Step>
      ))}
    </div>
  )
}


/* ── the Graph figure ───────────────────────────────────────────────────── */

interface GNode {
  id: string
  x: number
  y: number
  label?: string
  /** a badge shown beside the vertex (degree, count); offset dx, dy from the centre */
  badge?: { text: string; dx: number; dy: number; tone?: string }
  ring?: string
  fill?: string
}
interface GEdge {
  a: string
  b: string
  dir?: boolean
  bend?: number
  color?: string
  width?: number
  /** a pill on the edge; offset from the midpoint */
  pill?: { text: string; dx?: number; dy?: number }
}
interface GraphProps {
  w: number
  h: number
  nodes: GNode[]
  edges?: GEdge[]
  loops?: { node: string; dir?: boolean; color?: string; side?: 'up' | 'down' | 'left' | 'right' }[]
  /** edges revealed one per press, in list order */
  build?: boolean
  r?: number
}
function Graph({ w, h, nodes, edges = [], loops = [], build = false, r = 22 }: GraphProps) {
  const k = useBuild(build ? edges.length : 0)
  const at = Object.fromEntries(nodes.map((n) => [n.id, n]))
  const arrowHead = (x: number, y: number, ux: number, uy: number) => {
    const s = 11
    const px = -uy
    const py = ux
    return `${x},${y} ${x - ux * s + px * s * 0.55},${y - uy * s + py * s * 0.55} ${x - ux * s - px * s * 0.55},${y - uy * s - py * s * 0.55}`
  }
  return (
    <div className="relative shrink-0" style={{ width: w, height: h }}>
      <svg width={w} height={h} className="absolute left-0 top-0" aria-hidden>
        {edges.map((e, i) => {
          const A = at[e.a]
          const B = at[e.b]
          const c = e.color ?? colors.ink
          const shown = !build || i < k
          const dx = B.x - A.x
          const dy = B.y - A.y
          const len = Math.hypot(dx, dy)
          const ux = dx / len
          const uy = dy / len
          const bend = e.bend ?? 0
          const mx = (A.x + B.x) / 2 - uy * bend
          const my = (A.y + B.y) / 2 + ux * bend
          /* end points pulled back to the disc edge, along the curve's tangent */
          const ex0 = mx - A.x
          const ey0 = my - A.y
          const l0 = Math.hypot(ex0, ey0)
          const sx = A.x + (ex0 / l0) * r
          const sy = A.y + (ey0 / l0) * r
          const ex1 = B.x - mx
          const ey1 = B.y - my
          const l1 = Math.hypot(ex1, ey1)
          const tx = B.x - (ex1 / l1) * (r + (e.dir ? 2 : 0))
          const ty = B.y - (ey1 / l1) * (r + (e.dir ? 2 : 0))
          return (
            <g key={i} style={{ opacity: shown ? 1 : 0, transition: 'opacity .4s' }}>
              <path d={`M ${sx} ${sy} Q ${mx} ${my} ${tx} ${ty}`} fill="none" stroke={c} strokeWidth={e.width ?? 3} strokeLinecap="round" />
              {e.dir && <polygon points={arrowHead(tx, ty, ex1 / l1, ey1 / l1)} fill={c} />}
            </g>
          )
        })}
        {loops.map((l, i) => {
          /* A teardrop that leaves the disc and comes back, so a loop never reads as another vertex */
          const N = at[l.node]
          const c = l.color ?? colors.ink
          const [ox, oy] = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[l.side ?? 'up']
          const px = -oy
          const py = ox
          const a = Math.PI / 6
          const sx = N.x + r * (ox * Math.cos(a) + px * Math.sin(a))
          const sy = N.y + r * (oy * Math.cos(a) + py * Math.sin(a))
          const tx = N.x + r * (ox * Math.cos(a) - px * Math.sin(a))
          const ty = N.y + r * (oy * Math.cos(a) - py * Math.sin(a))
          const reach = r + 44
          const c1x = N.x + ox * reach + px * 30
          const c1y = N.y + oy * reach + py * 30
          const c2x = N.x + ox * reach - px * 30
          const c2y = N.y + oy * reach - py * 30
          return <path key={`l${i}`} d={`M ${sx} ${sy} C ${c1x} ${c1y} ${c2x} ${c2y} ${tx} ${ty}`} fill="none" stroke={c} strokeWidth={3} strokeLinecap="round" />
        })}
      </svg>
      {edges.map((e, i) =>
        e.pill ? (
          <span
            key={`p${i}`}
            className="absolute whitespace-nowrap rounded-pill px-2 py-0.5 text-[16px] font-semibold"
            style={{
              left: (at[e.a].x + at[e.b].x) / 2 + (e.pill.dx ?? 0),
              top: (at[e.a].y + at[e.b].y) / 2 + (e.pill.dy ?? 0),
              transform: 'translate(-50%, -50%)',
              background: '#FFFFFF',
              color: e.color ?? colors.ink,
              boxShadow: `inset 0 0 0 1.5px ${e.color ?? colors.line}`,
              opacity: !build || i < k ? 1 : 0,
            }}
          >
            {e.pill.text}
          </span>
        ) : null,
      )}
      {nodes.map((n) => (
        <span key={n.id}>
          <span
            className="absolute grid place-items-center rounded-full font-heading text-[18px] font-semibold"
            style={{
              left: n.x - r,
              top: n.y - r,
              width: r * 2,
              height: r * 2,
              background: n.fill ?? '#FFFFFF',
              color: n.fill ? '#fff' : colors.ink,
              boxShadow: `inset 0 0 0 2.5px ${n.ring ?? colors.ink}${n.ring ? `, 0 0 0 4px ${n.ring}55` : ''}`,
            }}
          >
            {n.label ?? n.id}
          </span>
          {n.badge && (
            <span
              className="absolute whitespace-nowrap rounded-md px-1.5 text-[16px] font-semibold text-white"
              style={{ left: n.x + n.badge.dx, top: n.y + n.badge.dy, transform: 'translate(-50%, -50%)', background: n.badge.tone ?? PURPLE }}
            >
              {n.badge.text}
            </span>
          )}
        </span>
      ))}
    </div>
  )
}

/* ── trees: shared data and figures ─────────────────────────────────────── */

const CAMPUS: GNode[] = [
  { id: 'L', x: 60, y: 60 },
  { id: 'C', x: 220, y: 40 },
  { id: 'H', x: 150, y: 170 },
  { id: 'G', x: 370, y: 80 },
  { id: 'A', x: 310, y: 205 },
  { id: 'P', x: 50, y: 205 },
]
const campus = (patch: Record<string, Partial<GNode>> = {}): GNode[] => CAMPUS.map((n) => ({ ...n, ...(patch[n.id] ?? {}) }))
const pair = (a: string, b: string) => [a, b].sort().join('')
/** Campus edges, those named in `lit` drawn thick in `color`. */
function campusEdges(lit: string[] = [], color = ORANGE, fade = false): GEdge[] {
  const on = new Set(lit.map((e) => pair(e[0], e[1])))
  return [
    ['L', 'C'],
    ['L', 'H'],
    ['C', 'H'],
    ['C', 'G'],
    ['H', 'A'],
  ].map(([a, b]) => (on.has(pair(a, b)) ? { a, b, color, width: 6 } : { a, b, color: fade ? '#94A3B8' : undefined }))
}

/** Soft land shapes behind a graph (components, forests): text-free SVG. */
function Islands({ w, h, blobs, children }: { w: number; h: number; blobs: { cx: number; cy: number; rx: number; ry: number; fill?: string }[]; children: ReactNode }) {
  return (
    <div className="relative shrink-0" style={{ width: w, height: h }}>
      <svg width={w} height={h} className="absolute left-0 top-0" aria-hidden>
        {blobs.map((b, i) => (
          <ellipse key={i} cx={b.cx} cy={b.cy} rx={b.rx} ry={b.ry} fill={b.fill ?? '#BBF7D0'} fillOpacity={0.55} stroke={TONE.ok} strokeOpacity={0.5} strokeWidth={2} />
        ))}
      </svg>
      <div className="absolute left-0 top-0">{children}</div>
    </div>
  )
}

const T13N: GNode[] = [
  { id: '1', x: 200, y: 30 },
  { id: '2', x: 100, y: 110 },
  { id: '3', x: 300, y: 110 },
  { id: '4', x: 50, y: 195 },
  { id: '5', x: 150, y: 195 },
  { id: '6', x: 250, y: 195 },
  { id: '7', x: 345, y: 195 },
  { id: '8', x: 440, y: 195 },
]
const T13E: [string, string][] = [
  ['1', '2'],
  ['1', '3'],
  ['2', '4'],
  ['2', '5'],
  ['3', '6'],
  ['3', '7'],
  ['7', '8'],
]
const litPath = (E: [string, string][], path: string[], color = ORANGE): GEdge[] => {
  const on = new Set(path.slice(1).map((v, i) => pair(path[i], v)))
  return E.map(([a, b]) => (on.has(pair(a, b)) ? { a, b, color, width: 6 } : { a, b }))
}

/** C13: the asked path lights on the tree, one per press, with its answer row. */
function PathFinder() {
  const asks: [string, string, string[]][] = [
    ['4', '5', ['4', '2', '5']],
    ['4', '8', ['4', '2', '1', '3', '7', '8']],
    ['6', '8', ['6', '3', '7', '8']],
  ]
  const k = useBuild(asks.length)
  const current = k > 0 ? asks[k - 1][2] : []
  return (
    <div className="flex w-full items-center gap-6">
      <Graph w={480} h={230} nodes={T13N.map((n) => (current.includes(n.id) ? { ...n, ring: ORANGE } : n))} edges={litPath(T13E, current)} />
      <div className="space-y-2">
        {asks.map(([s, t, p], i) => (
          <div key={s + t} className="flex w-[360px] items-center justify-between rounded-card border border-line bg-white px-4 py-2 shadow-card-soft" style={{ opacity: i < k ? 1 : 0.35 }}>
            <span className="text-[19px] font-semibold" style={{ color: colors.ink }}>
              {s} to {t}
            </span>
            <span className="text-[18px]" style={{ color: i < k ? ORANGE : colors.ink }}>
              {i < k ? `${p.join(', ')} · length ${p.length - 1}` : '?'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/** A small tree drawing for galleries; nodes given as [x, y], edges as index pairs. */
function Mini({ pts, edges, w = 150, h = 90, r = 10, colorEdges }: { pts: [number, number][]; edges: [number, number][]; w?: number; h?: number; r?: number; colorEdges?: string }) {
  return (
    <Graph
      w={Math.max(w, 130)}
      h={h}
      r={r}
      nodes={pts.map(([x, y], i) => ({ id: String(i), x, y, label: '' }))}
      edges={edges.map(([a, b]) => ({ a: String(a), b: String(b), width: 2.5, color: colorEdges }))}
    />
  )
}

const Yes = () => (
  <span className="font-semibold" style={{ color: TONE.ok }}>
    ✓
  </span>
)
const No = () => (
  <span className="font-semibold" style={{ color: TONE.bad }}>
    ✗
  </span>
)

const T26N: GNode[] = [
  { id: '1', x: 50, y: 60 },
  { id: '2', x: 50, y: 180 },
  { id: '3', x: 170, y: 120 },
  { id: '4', x: 170, y: 220 },
  { id: '5', x: 300, y: 120 },
  { id: '6', x: 400, y: 50 },
  { id: '7', x: 400, y: 190 },
]
const T26E: [string, string][] = [
  ['1', '2'],
  ['1', '3'],
  ['3', '4'],
  ['3', '5'],
  ['5', '6'],
  ['5', '7'],
]

/* ── the deck ───────────────────────────────────────────────────────────── */

export const treesDeck: SlideDef[] = [
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
          { title: C1, sub: 'Walks, paths, cycles, connectedness' },
          { title: C2, sub: 'Connected and acyclic; forests' },
          { title: C3, sub: 'Exactly one path between any two vertices' },
          { title: C4, sub: 'Leaves, edge counts, equivalent definitions' },
          { title: C5, sub: 'Removing and adding edges, small trees, molecules' },
          { title: C6, sub: 'Practice, mistakes, applications' },
        ]}
      />
    ),
  },

  /* ── CONCEPT 1 ───────────────────────────────────────────────────────── */
  { id: 'c1-divider', section: C1, label: 'Divider', element: <SectionBreakerSlide index={1} title={C1} lesson={SESSION} /> },
  {
    id: 'c1-campus',
    section: C1,
    label: 'Walking Around Campus',
    element: (
      <ContentSlide kicker={C1} title="Walking Around Campus" lead="Think First: the campus graph, with Parking (P) on no path at all" lesson={SESSION}>
        <div className="flex w-full items-center gap-8">
          <Graph w={420} h={240} nodes={campus({ P: { ring: TONE.bad }, G: { fill: ORANGE }, A: { fill: ORANGE } })} edges={campusEdges(['GC', 'CH', 'HA'])} />
          <div className="space-y-2">
            {[
              ['Walk from the Gym to Admin?', 'G → C → H → A'],
              ['From G back to G without reusing a path?', 'No: G has only one path'],
              ['Reach Parking from anywhere?', 'No: P is cut off'],
            ].map(([q, a]) => (
              <Step key={q}>
                <div className="w-[480px] rounded-card border border-line bg-white px-4 py-2 shadow-card-soft">
                  <Txt className="text-[18px]">{q}</Txt>
                  <span className="block font-heading text-[19px] font-semibold" style={{ color: ORANGE }}>
                    {a}
                  </span>
                </div>
              </Step>
            ))}
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"These three answers lead to paths, cycles and connectedness." Paths on campus: L–C, L–H, C–H, C–G, H–A.',
  },
  {
    id: 'c1-walks',
    section: C1,
    label: 'Routes Through a Graph',
    element: (
      <ContentSlide kicker={C1} title="Routes Through a Graph" lead="Walk, path and length" lesson={SESSION}>
        <div className="w-full space-y-3">
          <div className="grid w-fit grid-cols-2 gap-6">
            <Card>
              <Label tone="bad">Walk: C, H, L, C, G</Label>
              <Graph w={420} h={240} r={20} nodes={campus({ C: { ring: TONE.bad } })} edges={campusEdges(['CH', 'HL', 'LC', 'CG'], TONE.bad, true)} />
              <Txt className="text-[18px]">Each vertex adjacent to the next; vertices and edges may repeat (C twice)</Txt>
            </Card>
            <Step>
              <Card>
                <Label tone="ok">Path: G, C, H, A</Label>
                <Graph w={420} h={240} r={20} nodes={campus()} edges={campusEdges(['GC', 'CH', 'HA'], TONE.ok, true)} />
                <Txt className="text-[18px]">A walk with no repeated vertex. Length = edges used: 3</Txt>
              </Card>
            </Step>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"Terminology differs between books; some call a path a simple path. In this course, a path never repeats a vertex."',
  },
  {
    id: 'c1-cycles',
    section: C1,
    label: 'Coming Back Home',
    element: (
      <ContentSlide kicker={C1} title="Coming Back Home" lead="A cycle: length at least 3, back to the start, no other vertex repeated" lesson={SESSION}>
        <div className="flex w-full items-center gap-8">
          <Graph w={420} h={240} nodes={campus({ L: { ring: TONE.ok } })} edges={campusEdges(['LC', 'CH', 'HL'], TONE.ok, true)} />
          <Steps
            items={[
              ['L, C, H, L: one lap of the triangle', 'length 3'],
              ['No cycles at all', 'acyclic'],
              ['Why at least 3? u → v → u reuses one edge'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"Why length at least 3? In a simple graph, going from u to v and straight back along the same edge is not a real cycle."',
  },
  {
    id: 'c1-connected',
    section: C1,
    label: 'Can Everyone Reach Everyone?',
    element: (
      <ContentSlide kicker={C1} title="Can Everyone Reach Everyone?" lead="Connected: a path between every pair of vertices" lesson={SESSION}>
        <div className="flex w-full items-center gap-8">
          <Islands
            w={440}
            h={270}
            blobs={[
              { cx: 230, cy: 120, rx: 205, ry: 118 },
              { cx: 40, cy: 232, rx: 34, ry: 32, fill: '#FDE68A' },
            ]}
          >
            <Graph w={420} h={264} nodes={campus({ P: { x: 40, y: 232 } })} edges={campusEdges()} />
          </Islands>
          <Steps
            items={[
              ['Otherwise disconnected: it splits into components'],
              ['Campus: {L, C, H, G, A} and {P}', '2 components'],
              ['5 isolated vertices', '5 components'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"Each component is an island, with bridges (edges) only inside it. Ask: how many components does a graph with 5 isolated vertices have? Five."',
  },
  {
    id: 'c1-practice',
    section: C1,
    label: 'Walk, Path or Cycle?',
    element: (
      <ContentSlide kicker={C1} title="Walk, Path or Cycle?" lead="Edges 12, 23, 31, 34, 56: call it, then reveal" lesson={SESSION}>
        <div className="flex w-full items-center gap-6">
          <Graph
            w={360}
            h={200}
            nodes={[
              { id: '1', x: 40, y: 40 },
              { id: '2', x: 160, y: 40 },
              { id: '3', x: 100, y: 150 },
              { id: '4', x: 220, y: 150 },
              { id: '5', x: 310, y: 40 },
              { id: '6', x: 310, y: 160 },
            ]}
            edges={[
              { a: '1', b: '2' },
              { a: '2', b: '3' },
              { a: '3', b: '1' },
              { a: '3', b: '4' },
              { a: '5', b: '6' },
            ]}
          />
          <RevealTable
            columns={[{ label: 'Sequence or question', weight: 1.1 }, { label: 'Answer', weight: 1.3 }]}
            rows={[
              ['1, 2, 3, 1, 2', 'Walk (repeats 1 and 2)'],
              ['2, 3, 4', 'Path of length 2'],
              ['1, 2, 3, 1', 'Cycle of length 3'],
              ['Connected?', 'No: {1, 2, 3, 4} and {5, 6}'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"Remind learners that every path is a walk, but not every walk is a path."',
  },

  /* ── CONCEPT 2 ───────────────────────────────────────────────────────── */
  { id: 'c2-divider', section: C2, label: 'Divider', element: <SectionBreakerSlide index={2} title={C2} lesson={SESSION} /> },
  {
    id: 'c2-around',
    section: C2,
    label: 'Branching Without Loops',
    element: (
      <ContentSlide kicker={C2} title="Branching Without Loops" lead="Think First: a family tree, a reporting chart, the folders on your laptop" lesson={SESSION}>
        <div className="w-full space-y-3">
          <div className="grid w-fit grid-cols-3 gap-4">
            {[
              ['Family tree', [[75, 15], [35, 50], [115, 50], [15, 85], [55, 85]], [[0, 1], [0, 2], [1, 3], [1, 4]]],
              ['Reporting chart', [[75, 15], [25, 50], [75, 50], [125, 50], [125, 85]], [[0, 1], [0, 2], [0, 3], [3, 4]]],
              ['Laptop folders', [[75, 15], [30, 50], [120, 50], [95, 85], [140, 85]], [[0, 1], [0, 2], [2, 3], [2, 4]]],
            ].map(([t, pts, e]) => (
              <Step key={t as string}>
                <Card>
                  <Label>{t as string}</Label>
                  <Mini pts={pts as [number, number][]} edges={e as [number, number][]} h={100} />
                </Card>
              </Step>
            ))}
          </div>
          <Step>
            <Callout kind="info" title="Each connects everything into one structure" asStep={false}>
              It branches out but never loops back: such structures are trees
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"The reference deck W10_S1 uses hierarchies, game trees and file systems. We return to these applications at the end."',
  },
  {
    id: 'c2-definition',
    section: C2,
    label: 'A Tree',
    element: (
      <ContentSlide kicker={C2} title="A Tree" lead="A tree is a graph that is connected and acyclic" lesson={SESSION}>
        <div className="flex w-full items-center gap-8">
          <Graph w={480} h={230} nodes={T13N} edges={T13E.map(([a, b]) => ({ a, b }))} />
          <div className="space-y-3">
            {[
              ['Connected', 'A path between every pair of vertices'],
              ['Acyclic', 'No cycles'],
            ].map(([b, d]) => (
              <Step key={b}>
                <div className="flex w-[420px] items-center gap-3 rounded-card border-2 bg-white px-4 py-2" style={{ borderColor: TONE.ok }}>
                  <span className="rounded-pill px-3 py-1 font-heading text-[18px] font-semibold text-white" style={{ background: TONE.ok }}>
                    ✓ {b}
                  </span>
                  <Txt className="text-[18px]">{d}</Txt>
                </div>
              </Step>
            ))}
            <Step>
              <Callout kind="info" title="Always simple" asStep={false}>
                A loop or a pair of parallel edges would make a cycle
              </Callout>
            </Step>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"Both conditions are needed. Next slide: what happens when one of them fails."',
  },
  {
    id: 'c2-forest',
    section: C2,
    label: 'Many Trees Together',
    element: (
      <ContentSlide kicker={C2} title="Many Trees Together" lead="A forest is acyclic; it need not be connected" lesson={SESSION}>
        <div className="flex w-full items-center gap-8">
          <Islands
            w={440}
            h={230}
            blobs={[
              { cx: 90, cy: 115, rx: 80, ry: 105 },
              { cx: 260, cy: 115, rx: 70, ry: 60 },
              { cx: 390, cy: 115, rx: 40, ry: 40 },
            ]}
          >
            <Graph
              w={440}
              h={230}
              nodes={[
                { id: '1', x: 90, y: 40 },
                { id: '2', x: 45, y: 180 },
                { id: '3', x: 135, y: 180 },
                { id: '4', x: 220, y: 115 },
                { id: '5', x: 300, y: 115 },
                { id: '6', x: 390, y: 115 },
              ]}
              edges={[
                { a: '1', b: '2' },
                { a: '1', b: '3' },
                { a: '4', b: '5' },
              ]}
            />
          </Islands>
          <Steps
            items={[
              ['Each component of a forest is a tree'],
              ['A single tree is a forest with one component'],
              ['Edges 12, 13, 45 on 1 to 6', '3 trees'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"The name is a pun: many trees make a forest. Forests matter later when we count edges." The trees are {1, 2, 3}, {4, 5} and {6}.',
  },
  {
    id: 'c2-gallery',
    section: C2,
    label: 'Tree or Not?',
    element: (
      <ContentSlide kicker={C2} title="Tree or Not?" lead="Test both conditions" lesson={SESSION}>
        <div className="grid w-full grid-cols-5 gap-3">
          {[
            ['Path 1–2–3–4–5', [[15, 60], [45, 25], [75, 60], [105, 25], [135, 60]], [[0, 1], [1, 2], [2, 3], [3, 4]], true, true],
            ['Star, 5 leaves', [[75, 50], [20, 20], [130, 20], [20, 80], [130, 80], [75, 10]], [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5]], true, true],
            ['Triangle', [[75, 15], [25, 80], [125, 80]], [[0, 1], [1, 2], [2, 0]], true, false],
            ['Edges 12, 34', [[25, 25], [25, 80], [120, 25], [120, 80]], [[0, 1], [2, 3]], false, true],
            ['Square with a tail', [[20, 20], [80, 20], [80, 80], [20, 80], [135, 80]], [[0, 1], [1, 2], [2, 3], [3, 0], [2, 4]], true, false],
          ].map(([t, pts, e, conn, acyc]) => (
            <Step key={t as string}>
              <div className="h-full rounded-card border border-line bg-white px-3 py-3 shadow-card-soft" style={{ boxShadow: conn && acyc ? `inset 0 0 0 3px ${ORANGE}` : undefined }}>
                <span className="block text-[17px] font-semibold" style={{ color: colors.ink }}>
                  {t as string}
                </span>
                <Mini pts={pts as [number, number][]} edges={e as [number, number][]} h={95} />
                <span className="block text-[17px]" style={{ color: colors.ink }}>
                  Connected {conn ? <Yes /> : <No />}
                </span>
                <span className="block text-[17px]" style={{ color: colors.ink }}>
                  Acyclic {acyc ? <Yes /> : <No />}
                </span>
                <span className="mt-1 block font-heading text-[18px] font-semibold" style={{ color: conn && acyc ? ORANGE : TONE.grey }}>
                  {conn && acyc ? 'Tree' : acyc ? 'A forest' : 'Not a tree'}
                </span>
              </div>
            </Step>
          ))}
        </div>
      </ContentSlide>
    ),
    notes: '"Ask learners for the smallest change that turns each non-tree into a tree: delete one triangle edge, add an edge 23, delete one square edge."',
  },
  {
    id: 'c2-practice',
    section: C2,
    label: 'Tree, Forest or Neither?',
    element: (
      <ContentSlide kicker={C2} title="Tree, Forest or Neither?" lead="Toss each graph into a basket, then reveal" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Graph', weight: 1.5 }, { label: 'Answer', weight: 1.5 }]}
          rows={[
            ['A single vertex, no edges', 'Tree (trivially connected, no cycles)'],
            ['Vertices 1–5, edges 12, 23, 24, 25', 'Tree'],
            ['Vertices 1–6, edges 12, 23, 45, 56', 'Forest of 2 trees'],
            ['Vertices 1–4, edges 12, 23, 34, 41', 'Neither: a cycle'],
            ['Vertices 1–5, edges 12, 23, 31, 45', 'Neither: a cycle, and disconnected'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"Remind learners that every tree is also a forest. Forest only here means a forest that is not a tree."',
  },

  /* ── CONCEPT 3 ───────────────────────────────────────────────────────── */
  { id: 'c3-divider', section: C3, label: 'Divider', element: <SectionBreakerSlide index={3} title={C3} lesson={SESSION} /> },
  {
    id: 'c3-one-way',
    section: C3,
    label: 'A Single Route',
    element: (
      <ContentSlide kicker={C3} title="A Single Route" lead="Think First: every path from 1 to 6 in the tree with edges 12, 23, 24, 45, 46" lesson={SESSION}>
        <div className="grid w-fit grid-cols-2 gap-6">
          <Card>
            <Label tone="ok">Tree: only 1, 2, 4, 6</Label>
            <Graph
              w={380}
              h={210}
              nodes={[
                { id: '1', x: 40, y: 110, ring: ORANGE },
                { id: '2', x: 140, y: 110, ring: ORANGE },
                { id: '3', x: 140, y: 30 },
                { id: '4', x: 240, y: 110, ring: ORANGE },
                { id: '5', x: 340, y: 40 },
                { id: '6', x: 340, y: 180, ring: ORANGE },
              ]}
              edges={litPath(
                [
                  ['1', '2'],
                  ['2', '3'],
                  ['2', '4'],
                  ['4', '5'],
                  ['4', '6'],
                ],
                ['1', '2', '4', '6'],
              )}
            />
          </Card>
          <Step>
            <Card>
              <Label tone="bad">Triangle: two paths from 1 to 3</Label>
              <Graph
                w={300}
                h={210}
                nodes={[
                  { id: '1', x: 40, y: 170 },
                  { id: '2', x: 150, y: 35 },
                  { id: '3', x: 260, y: 170 },
                ]}
                edges={[
                  { a: '1', b: '3', color: ORANGE, width: 5, pill: { text: '1, 3', dy: 22 } },
                  { a: '1', b: '2', color: BLUE, width: 5 },
                  { a: '2', b: '3', color: BLUE, width: 5, pill: { text: '1, 2, 3', dx: 46, dy: -16 } },
                ]}
              />
            </Card>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Encourage learners to try to find a second route in the tree. Every attempt either repeats a vertex or hits a dead end."',
  },
  {
    id: 'c3-theorem',
    section: C3,
    label: 'Unique Paths Characterise Trees',
    element: (
      <ContentSlide kicker={C3} title="Unique Paths Characterise Trees" lead="A graph is a tree if and only if exactly one path joins every pair of vertices" lesson={SESSION}>
        <div className="flex w-full items-center gap-6">
          <Islands w={460} h={220} blobs={[{ cx: 230, cy: 110, rx: 95, ry: 72, fill: '#FECACA' }]}>
            <Graph
              w={460}
              h={220}
              nodes={[
                { id: 'u', x: 40, y: 110 },
                { id: 'a', x: 140, y: 110 },
                { id: 'c', x: 230, y: 45 },
                { id: 'd', x: 230, y: 175 },
                { id: 'e', x: 320, y: 110 },
                { id: 'v', x: 420, y: 110 },
              ]}
              edges={[
                { a: 'u', b: 'a' },
                { a: 'a', b: 'c', color: BLUE, width: 5 },
                { a: 'c', b: 'e', color: BLUE, width: 5 },
                { a: 'a', b: 'd', color: ORANGE, width: 5 },
                { a: 'd', b: 'e', color: ORANGE, width: 5 },
                { a: 'e', b: 'v' },
              ]}
            />
          </Islands>
          <Steps
            items={[
              ['At least one path: the tree is connected'],
              ['At most one: two routes split and meet again, and a cycle hides between them'],
              ['Conversely: unique paths give connected, and a cycle would give two paths'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"Keep the proof informal: two routes that split and later meet again form a loop. That loop is a cycle." The shaded region a, c, e, d is the hidden cycle.',
  },
  {
    id: 'c3-practice',
    section: C3,
    label: 'Find the Path',
    element: (
      <ContentSlide kicker={C3} title="Find the Path" lead="Tree on 1 to 8: edges 12, 13, 24, 25, 36, 37, 78. Pull the string tight between two pins" lesson={SESSION}>
        <PathFinder />
      </ContentSlide>
    ),
    notes: '"Ask: in a tree, is the unique path also the shortest path? Yes, because it is the only one."',
  },

  /* ── CONCEPT 4 ───────────────────────────────────────────────────────── */
  { id: 'c4-divider', section: C4, label: 'Divider', element: <SectionBreakerSlide index={4} title={C4} lesson={SESSION} /> },
  {
    id: 'c4-pattern',
    section: C4,
    label: 'A Pattern in Small Trees',
    element: (
      <ContentSlide kicker={C4} title="A Pattern in Small Trees" lead="List small, then generalise" lesson={SESSION}>
        <div className="w-full space-y-3">
          <div className="grid w-fit grid-cols-5 gap-3">
            {[
              ['1 vertex', [[75, 45]], [], 1, 0],
              ['One edge', [[35, 45], [115, 45]], [[0, 1]], 2, 1],
              ['Path on 3', [[20, 45], [75, 45], [130, 45]], [[0, 1], [1, 2]], 3, 2],
              ['Star, 4 leaves', [[75, 45], [25, 15], [125, 15], [25, 75], [125, 75]], [[0, 1], [0, 2], [0, 3], [0, 4]], 5, 4],
              ['Find the Path tree', [[75, 12], [40, 42], [110, 42], [20, 78], [60, 78], [95, 78], [125, 78], [140, 45]], [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6], [6, 7]], 8, 7],
            ].map(([t, pts, e, n, m]) => (
              <Step key={t as string}>
                <Card className="h-full">
                  <span className="block text-[17px] font-semibold" style={{ color: colors.ink }}>
                    {t as string}
                  </span>
                  <Mini pts={pts as [number, number][]} edges={e as [number, number][]} h={92} r={9} />
                  <span className="mt-1 block font-heading text-[19px] font-semibold" style={{ color: BLUE }}>
                    n = {n as number} · edges {m as number}
                  </span>
                </Card>
              </Step>
            ))}
          </div>
          <Step>
            <Callout kind="success" title="Pattern: a tree on n vertices has n − 1 edges" asStep={false}>
              Vertices and edges always differ by one
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Ask learners to draw any tree with 6 vertices and count its edges before revealing the general rule."',
  },
  {
    id: 'c4-leaves',
    section: C4,
    label: 'Every Tree Has Leaves',
    element: (
      <ContentSlide kicker={C4} title="Every Tree Has Leaves" lead="A leaf is a vertex of degree 1; a tree with 2 or more vertices has at least two" lesson={SESSION}>
        <div className="flex w-full items-center gap-6">
          <Graph
            w={480}
            h={230}
            nodes={T13N.map((n) => (n.id === '4' || n.id === '8' ? { ...n, fill: TONE.ok } : ['2', '1', '3', '7'].includes(n.id) ? { ...n, ring: ORANGE } : n))}
            edges={litPath(T13E, ['4', '2', '1', '3', '7', '8'])}
          />
          <Steps
            items={[
              ['Take a longest path (the orange spine)'],
              ['A neighbour of an end on the path would make a cycle'],
              ['A neighbour off the path would make a longer path'],
              ['So both ends are leaves', '4 and 8'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"Degree-1 vertices are also called pendant vertices. In trees they are usually called leaves."',
  },
  {
    id: 'c4-prune',
    section: C4,
    label: 'Prune One Leaf at a Time',
    element: (
      <ContentSlide kicker={C4} title="Prune One Leaf at a Time" lead="Theorem: a tree with n vertices has exactly n − 1 edges" lesson={SESSION}>
        <div className="w-full space-y-3">
          <div className="grid w-fit grid-cols-5 gap-3">
            {[0, 1, 2, 3, 4].map((cut) => {
              const pts: [number, number][] = [
                [75, 15],
                [30, 50],
                [120, 50],
                [30, 85],
                [120, 85],
              ]
              const all: [number, number][] = [
                [0, 1],
                [0, 2],
                [1, 3],
                [2, 4],
              ]
              const order = [3, 4, 1, 2]
              const gone = order.slice(0, cut)
              return (
                <Step key={cut}>
                  <Card className="h-full">
                    <span className="block text-[17px] font-semibold" style={{ color: colors.ink }}>
                      {cut === 0 ? 'Start: 5 vertices' : `Snip ${cut}`}
                    </span>
                    <Mini pts={pts.filter((_, i) => !gone.includes(i))} edges={all.filter(([, b]) => !gone.includes(b)).map(([a, b]) => [pts.filter((_, i) => !gone.includes(i)).indexOf(pts[a]), pts.filter((_, i) => !gone.includes(i)).indexOf(pts[b])] as [number, number])} h={100} />
                    <span className="block font-heading text-[18px] font-semibold" style={{ color: ORANGE }}>
                      edges removed: {cut}
                    </span>
                  </Card>
                </Step>
              )
            })}
          </div>
          <Steps
            items={[
              ['Remove a leaf and its one edge: still a tree, one fewer edge'],
              ['Repeat until one vertex remains: 0 edges'],
              ['n − 1 leaves removed, one edge each', 'n − 1 edges ✓'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"This is a proof by induction in disguise. Learners comfortable with induction can write it formally: assume true for n − 1 vertices, then add a leaf." Four snips of the 5-vertex tree remove 4 = 5 − 1 edges.',
  },
  {
    id: 'c4-forest-edges',
    section: C4,
    label: 'Edges in a Forest',
    element: (
      <ContentSlide kicker={C4} title="Edges in a Forest" lead="A forest with n vertices and k trees has n − k edges" lesson={SESSION}>
        <div className="w-full space-y-3">
          <DataTable
            className="w-[640px]"
            compact
            stepped
            columns={[{ label: 'Tree', weight: 1 }, { label: 'Vertices', weight: 0.8 }, { label: 'Edges', weight: 0.8 }]}
            rows={[
              ['{1, 2, 3}', '3', '2'],
              ['{4, 5}', '2', '1'],
              ['{6}', '1', '0'],
              [<span className="font-semibold">Total: 3 trees</span>, <span className="font-semibold">6</span>, <span className="font-semibold">3 = 6 − 3 ✓</span>],
            ]}
          />
          <Txt>Each tree with nᵢ vertices has nᵢ − 1 edges; adding over the k trees gives n − k. A tree is k = 1</Txt>
        </div>
      </ContentSlide>
    ),
    notes: '"A tree is the case k = 1, giving n − 1." The forest is the one from Many Trees Together: edges 12, 13, 45.',
  },
  {
    id: 'c4-warning',
    section: C4,
    label: 'n − 1 Edges Does Not Make a Tree',
    element: (
      <ContentSlide kicker={C4} title="n − 1 Edges Does Not Make a Tree" lead="A warning: 7 vertices and 6 edges, but not a tree" lesson={SESSION}>
        <div className="flex w-full items-center gap-8">
          <div>
            <span className="mb-2 inline-block -rotate-2 rounded-md px-3 py-1 font-heading text-[18px] font-semibold text-white" style={{ background: ORANGE }}>
              7 vertices · 6 edges
            </span>
            <Graph
              w={420}
              h={210}
              nodes={[
                { id: 'a', x: 40, y: 40, ring: TONE.bad },
                { id: 'b', x: 180, y: 40, ring: TONE.bad },
                { id: 'c', x: 40, y: 170, ring: TONE.bad },
                { id: 'd', x: 180, y: 170, ring: TONE.bad },
                { id: 'e', x: 290, y: 60 },
                { id: 'f', x: 380, y: 105 },
                { id: 'g', x: 290, y: 160 },
              ]}
              edges={[
                { a: 'a', b: 'b', color: TONE.bad },
                { a: 'a', b: 'c', color: TONE.bad },
                { a: 'a', b: 'd', color: TONE.bad },
                { a: 'b', b: 'c', color: TONE.bad },
                { a: 'b', b: 'd', color: TONE.bad },
                { a: 'c', b: 'd', color: TONE.bad },
              ]}
            />
          </div>
          <Steps
            items={[
              ['Four vertices joined in every possible way: 6 edges'],
              ['Three isolated vertices'],
              ['It has cycles and is disconnected', 'not a tree'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"The edge count is a necessary condition for a tree. The next slide shows which combinations of conditions are enough."',
  },
  {
    id: 'c4-equivalent',
    section: C4,
    label: 'Six Ways to Say "Tree"',
    element: (
      <ContentSlide kicker={C4} title={'Six Ways to Say "Tree"'} lead="For a graph G with n vertices, these are equivalent: each implies all the others" lesson={SESSION}>
        <div className="grid w-full grid-cols-3 gap-3">
          {[
            'Connected and acyclic',
            'Exactly one path between every pair of vertices',
            'Connected, with n − 1 edges',
            'Acyclic, with n − 1 edges',
            'Connected, but removing any edge disconnects it',
            'Acyclic, but adding any new edge creates a cycle',
          ].map((t, i) => (
            <Step key={t}>
              <div className="flex h-full items-center gap-3 rounded-card border border-line bg-white px-4 py-3 shadow-card-soft" style={{ boxShadow: i === 2 || i === 3 ? `inset 0 0 0 2px ${TONE.ok}` : undefined }}>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full font-heading text-[17px] font-semibold text-white" style={{ background: i === 2 || i === 3 ? TONE.ok : colors.brand }}>
                  {i + 1}
                </span>
                <Txt className="text-[18px]">{t}</Txt>
              </div>
            </Step>
          ))}
        </div>
      </ContentSlide>
    ),
    notes: '"Exam hook: to prove a graph is a tree, any one of these is enough. Statements 3 and 4 (green) are usually the quickest: count the edges and check one more property."',
  },
  {
    id: 'c4-practice',
    section: C4,
    label: 'Use n − 1 and n − k',
    element: (
      <ContentSlide kicker={C4} title="Use n − 1 and n − k" lead="Rapid fire: answer before the reveal" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Question', weight: 2 }, { label: 'Answer', weight: 1.2 }]}
          rows={[
            ['Edges in a tree with 10 vertices', '9'],
            ['Vertices in a tree with 15 edges', '16'],
            ['Edges in a forest with 12 vertices and 3 trees', '9'],
            ['8 vertices, 7 edges, no cycles: a tree?', 'Yes (statement 4)'],
            ['8 vertices, 8 edges, connected: a tree?', 'No: a tree has exactly 7'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"For the last row, add: a connected graph with n vertices and n edges contains exactly one cycle."',
  },
  { id: 'quiz-1', section: C4, label: 'Quiz Time', element: <QuizTimeSlide lesson={SESSION} /> },

  /* ── CONCEPT 5 ───────────────────────────────────────────────────────── */
  { id: 'c5-divider', section: C5, label: 'Divider', element: <SectionBreakerSlide index={5} title={C5} lesson={SESSION} /> },
  {
    id: 'c5-fragile',
    section: C5,
    label: 'Minimally Connected, Maximally Acyclic',
    element: (
      <ContentSlide kicker={C5} title="Minimally Connected, Maximally Acyclic" lead="Just enough edges to connect, and as many as possible without a cycle" lesson={SESSION}>
        <div className="grid w-fit grid-cols-2 gap-6">
          <Step>
            <Card>
              <Label tone="warn">Remove any edge (cut 3–5)</Label>
              <Islands
                w={460}
                h={262}
                blobs={[
                  { cx: 110, cy: 140, rx: 108, ry: 120 },
                  { cx: 350, cy: 120, rx: 100, ry: 112, fill: '#BFDBFE' },
                ]}
              >
                <Graph w={440} h={250} nodes={T26N} edges={T26E.filter(([a, b]) => !(a === '3' && b === '5')).map(([a, b]) => ({ a, b }))} />
              </Islands>
              <Txt className="text-[18px]">It splits into exactly two trees</Txt>
            </Card>
          </Step>
          <Step>
            <Card>
              <Label tone="bad">Add any new edge (4–7)</Label>
              <Graph
                w={440}
                h={250}
                nodes={T26N}
                edges={[
                  ...T26E.map(([a, b]) => (['34', '35', '57'].includes(a + b) ? { a, b, color: TONE.bad, width: 5 } : { a, b })),
                  { a: '4', b: '7', color: TONE.bad, width: 5 },
                ]}
              />
              <Txt className="text-[18px]">Exactly one cycle appears: 4, 3, 5, 7, 4</Txt>
            </Card>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Why exactly one cycle when adding uv? The new edge plus the unique path from u to v forms one cycle, and there is no other path to make a second."',
  },
  {
    id: 'c5-small-trees',
    section: C5,
    label: 'Trees up to Isomorphism',
    element: (
      <ContentSlide kicker={C5} title="Trees up to Isomorphism" lead="How many different trees on n vertices? Different means not isomorphic" lesson={SESSION}>
        <div className="w-full space-y-2">
          {[
            ['n = 1, 2, 3', [[[[75, 40]], []], [[[40, 40], [110, 40]], [[0, 1]]], [[[20, 40], [75, 40], [130, 40]], [[0, 1], [1, 2]]]]],
            ['n = 4: 2 trees', [[[[15, 40], [55, 40], [95, 40], [135, 40]], [[0, 1], [1, 2], [2, 3]]], [[[75, 40], [25, 15], [125, 15], [75, 75]], [[0, 1], [0, 2], [0, 3]]]]],
            [
              'n = 5: 3 trees',
              [
                [[[10, 40], [43, 40], [76, 40], [109, 40], [140, 40]], [[0, 1], [1, 2], [2, 3], [3, 4]]],
                [[[75, 40], [25, 12], [125, 12], [25, 70], [125, 70]], [[0, 1], [0, 2], [0, 3], [0, 4]]],
                [[[60, 40], [20, 15], [20, 70], [100, 40], [140, 40]], [[0, 1], [0, 2], [0, 3], [3, 4]]],
              ],
            ],
          ].map(([label, trees]) => (
            <Step key={label as string}>
              <div className="flex w-fit items-center gap-3 rounded-card border border-line bg-white px-4 py-1 shadow-card-soft">
                <span className="w-[150px] font-heading text-[19px] font-semibold" style={{ color: colors.brandDark }}>
                  {label as string}
                </span>
                {(trees as [[number, number][], [number, number][]][]).map(([pts, e], i) => (
                  <Mini key={i} pts={pts} edges={e} h={82} r={9} colorEdges={[BLUE, ORANGE, PURPLE][i]} />
                ))}
              </div>
            </Step>
          ))}
          <Step>
            <div className="flex w-fit items-center gap-3 rounded-card border border-line bg-white px-4 py-2 shadow-card-soft">
              <span className="w-[150px] font-heading text-[19px] font-semibold" style={{ color: colors.brandDark }}>
                n = 6: 6 trees
              </span>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <span key={i} className="h-14 w-20 rounded-md border-2 border-dashed" style={{ borderColor: colors.line }} />
              ))}
              <Txt className="text-[18px]">find them in groups</Txt>
            </div>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"This links to isomorphism. Use degree sequences to check that the 5-vertex trees are different: (2,2,2,1,1), (4,1,1,1,1) and (3,2,1,1,1)." The third 5-vertex tree is the T shape.',
  },
  {
    id: 'c5-leaves',
    section: C5,
    label: 'Handshaking Meets n − 1',
    element: (
      <ContentSlide kicker={C5} title="Handshaking Meets n − 1" lead="2 vertices of degree 3, 3 of degree 2, the rest leaves. How many leaves?" lesson={SESSION}>
        <div className="flex w-full items-center gap-6">
          <div className="space-y-2">
            <Steps
              items={[
                ['L leaves: n = 5 + L, edges n − 1 = 4 + L'],
                ['Handshaking: 2 × 3 + 3 × 2 + L = 2(4 + L)'],
                ['12 + L = 8 + 2L', 'L = 4'],
              ]}
            />
          </div>
          <Step>
            <Card>
              <Label>One such tree: 9 vertices, 8 edges</Label>
              <Graph
                w={430}
                h={170}
                r={16}
                nodes={[
                  { id: 'a', x: 60, y: 85, label: '3', fill: PURPLE },
                  { id: 'b', x: 150, y: 85, label: '2', fill: BLUE },
                  { id: 'c', x: 240, y: 85, label: '2', fill: BLUE },
                  { id: 'd', x: 330, y: 85, label: '2', fill: BLUE },
                  { id: 'e', x: 410, y: 85, label: '3', fill: PURPLE },
                  { id: 'f', x: 25, y: 25, label: '' },
                  { id: 'g', x: 25, y: 145, label: '' },
                  { id: 'h', x: 410, y: 25, label: '' },
                  { id: 'i', x: 410, y: 150, label: '' },
                ]}
                edges={[
                  { a: 'a', b: 'b' },
                  { a: 'b', b: 'c' },
                  { a: 'c', b: 'd' },
                  { a: 'd', b: 'e' },
                  { a: 'a', b: 'f' },
                  { a: 'a', b: 'g' },
                  { a: 'e', b: 'h' },
                  { a: 'e', b: 'i' },
                ]}
              />
            </Card>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"This combination of the Handshaking Lemma and n − 1 edges is a favourite exam question." Discs show degrees; the four plain discs are the leaves.',
  },
  {
    id: 'c5-molecules',
    section: C5,
    label: 'Molecules as Trees',
    element: (
      <ContentSlide kicker={C5} title="Molecules as Trees" lead="Alkanes CₙH₂ₙ₊₂: atoms are vertices, bonds are edges" lesson={SESSION}>
        <div className="flex w-full items-center gap-6">
          <div className="grid w-fit grid-cols-2 gap-4">
            {[
              ['Butane', 'chain', [[15, 45], [55, 45], [95, 45], [135, 45]], [[0, 1], [1, 2], [2, 3]]],
              ['Isobutane', 'branched', [[75, 45], [25, 15], [125, 15], [75, 85]], [[0, 1], [0, 2], [0, 3]]],
            ].map(([n, s, pts, e]) => (
              <Card key={n as string}>
                <Label>{n as string} C₄H₁₀</Label>
                <Mini pts={pts as [number, number][]} edges={e as [number, number][]} h={100} r={11} />
                <Txt className="text-[17px]">carbon skeleton: {s as string}</Txt>
              </Card>
            ))}
          </div>
          <Steps
            items={[
              ['Carbon degree 4, hydrogen degree 1'],
              ['Vertices: n + (2n + 2)', '3n + 2'],
              ['Edges: (4n + 2n + 2) / 2', '3n + 1'],
              ['Connected with vertices − 1 edges', 'a tree'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"Butane and isobutane are non-isomorphic trees: the same formula, different shapes. Cayley counted such molecules using trees in the 1800s." Hydrogens are left out of the skeleton drawings.',
  },

  /* ── CONCEPT 6 ───────────────────────────────────────────────────────── */
  { id: 'c6-divider', section: C6, label: 'Divider', element: <SectionBreakerSlide index={6} title={C6} lesson={SESSION} /> },
  {
    id: 'c6-myths',
    section: C6,
    label: 'What Went Wrong?',
    element: (
      <ContentSlide kicker={C6} title="What Went Wrong?" lead="Myth or fact? Vote, then reveal" lesson={SESSION}>
        <div className="w-full space-y-2">
          {[
            ['"It has n − 1 edges, so it is a tree"', 'It must also be connected, or acyclic'],
            ['"A forest is never a tree"', 'Every tree is a forest with one component'],
            ['"A tree with 1 vertex has 1 leaf"', 'A single vertex has degree 0: no leaves'],
            ['"Removing a leaf disconnects the tree"', 'The rest is a smaller tree'],
            ['"Adding an edge to a tree may create two cycles"', 'Exactly one cycle'],
          ].map(([myth, fact]) => (
            <Step key={myth}>
              <div className="grid grid-cols-[1fr_1.1fr] items-center gap-4 rounded-card border border-line bg-white px-4 py-2 shadow-card-soft">
                <span className="w-fit -rotate-1 rounded-sm px-3 py-1 text-[18px] italic line-through" style={{ background: '#FEF3C7', color: colors.ink, textDecorationColor: TONE.bad }}>
                  {myth}
                </span>
                <span className="text-[18px] font-semibold" style={{ color: TONE.ok }}>
                  FACT: {fact}
                </span>
              </div>
            </Step>
          ))}
        </div>
      </ContentSlide>
    ),
    notes: '"Ask learners to vote myth or fact before revealing each correction."',
  },
  {
    id: 'c6-mixed',
    section: C6,
    label: 'One Graph, Every Idea',
    element: (
      <ContentSlide kicker={C6} title="One Graph, Every Idea" lead="Vertices 1 to 7; edges 12, 13, 34, 35, 56, 57" lesson={SESSION}>
        <div className="flex w-full items-center gap-6">
          <Graph w={440} h={250} nodes={T26N} edges={T26E.map(([a, b]) => ({ a, b }))} />
          <RevealTable
            columns={[{ label: 'Question', weight: 1.3 }, { label: 'Answer', weight: 1.3 }]}
            rows={[
              ['Is it a tree?', 'Yes: 7 vertices, 6 edges, connected'],
              ['Path from 2 to 7', '2, 1, 3, 5, 7'],
              ['The leaves', '2, 4, 6, 7'],
              ['Add edge 47: cycles?', 'One: 4, 3, 5, 7, 4'],
              ['Remove edge 35', 'Two trees: {1, 2, 3, 4}, {5, 6, 7}'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"Check the leaves with degrees: 2, 4, 6 and 7 each have degree 1."',
  },
  {
    id: 'c6-applications',
    section: C6,
    label: 'Applications',
    element: (
      <ContentSlide kicker={C6} title="Applications" lead="Where trees appear" lesson={SESSION}>
        <div className="grid w-full grid-cols-2 gap-3">
          {[
            ['File systems', 'Folders and files; "is inside" links'],
            ['Game trees', 'Tic-tac-toe and chess positions; moves between them'],
            ['Organisation charts', 'People; "reports to" links'],
            ['Chemistry', 'Atoms; bonds'],
            ['Data structures', 'Search trees, Huffman codes, tries: items and the links used to find them'],
            ['Deep Blue, 1997', 'Searched huge game trees to beat Garry Kasparov at chess'],
          ].map(([t, d]) => (
            <Step key={t}>
              <div className="rounded-2xl border border-line bg-white px-4 py-2.5 shadow-card-soft">
                <span className="inline-block rounded-md px-2 py-0.5 font-mono text-[16px] font-semibold text-white" style={{ background: colors.ink }}>
                  {t}
                </span>
                <Txt className="mt-1 text-[18px]">{d}</Txt>
              </div>
            </Step>
          ))}
        </div>
      </ContentSlide>
    ),
    notes: '"Many of these trees have a natural top, such as the main folder. Rooted and directed trees, with words like parent and child, come later in the course."',
  },

  /* ── CLOSING ────────────────────────────────────────────────────────── */
  { id: 'quiz-2', section: 'Closing', label: 'Quiz Time', element: <QuizTimeSlide lesson={SESSION} /> },
  { id: 'takeaways', section: 'Closing', label: 'Key Takeaways', element: <KeyTakeawaysSlide title={SESSION} lesson={SESSION} points={AGENDA} /> },
  { id: 'feedback', section: 'Closing', label: 'Feedback', element: <FeedbackSlide lesson={SESSION} formless />, notes: 'No form and no QR (content rule 41 as amended 2026-11-21). Ask for feedback out loud.' },
  { id: 'thank-you', section: 'Closing', label: 'Thank you', element: <ThankYouSlide title="Thank You" lesson={SESSION} /> },
  { id: 'all-the-best', section: 'Closing', label: 'All the best', element: <ThankYouSlide title="All the Best" lesson={SESSION} /> },
]
