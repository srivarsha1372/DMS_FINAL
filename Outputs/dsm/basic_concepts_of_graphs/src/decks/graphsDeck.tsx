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
 * BASIC CONCEPTS OF GRAPHS (DSM, Graph Theory).
 *
 * Built from the signed-off plan at
 *   Outputs/dsm/session_plans/basic_concepts_of_graphs/plan.md
 * (45 slides, one per TR slide). Every graph was rebuilt from its edge list by
 * `verify_tr.py`. No cross-session phrases (user rule, 2026-11-26).
 * Graph figure: edges, arrows and loops in a text-free SVG; every vertex,
 * weight and badge is a page element placed clear of the others.
 */

const SESSION = 'Basic Concepts of Graphs'
const C1 = 'Why Graphs'
const C2 = 'What Is a Graph'
const C3 = 'Types of Graphs'
const C4 = 'Adjacency and Incidence'
const C5 = 'Degree and the Handshaking Lemma'
const C6 = 'Putting It All Together'
const AGENDA = [C1, C2, C3, C4, C5, C6]

export const graphsMeta: DeckMeta = {
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
const PINK = '#DB2777'
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

function Formula({ children, size = 30 }: { children: ReactNode; size?: number }) {
  return (
    <span className="inline-block rounded-xl px-6 py-3 font-heading font-semibold" style={{ fontSize: size, background: `${TONE.ok}18`, color: colors.ink, boxShadow: `inset 0 0 0 2px ${TONE.ok}` }}>
      {children}
    </span>
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

/* The campus graph: Library, Canteen, Hostel, Gym, Admin, Parking */
const CAMPUS: GNode[] = [
  { id: 'L', x: 60, y: 60 },
  { id: 'C', x: 220, y: 40 },
  { id: 'H', x: 150, y: 170 },
  { id: 'G', x: 370, y: 80 },
  { id: 'A', x: 310, y: 205 },
  { id: 'P', x: 50, y: 205 },
]
const CAMPUS_E: GEdge[] = [
  { a: 'L', b: 'C' },
  { a: 'L', b: 'H' },
  { a: 'C', b: 'H' },
  { a: 'C', b: 'G' },
  { a: 'H', b: 'A' },
]
const campus = (patch: Record<string, Partial<GNode>> = {}): GNode[] => CAMPUS.map((n) => ({ ...n, ...(patch[n.id] ?? {}) }))

/* ── the deck ───────────────────────────────────────────────────────────── */

export const graphsDeck: SlideDef[] = [
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
          { title: C1, sub: 'Networks of things and connections' },
          { title: C2, sub: 'The definition G = (V, E)' },
          { title: C3, sub: 'Direction, loops, repeats and weights' },
          { title: C4, sub: 'Neighbours and two matrices' },
          { title: C5, sub: 'Degrees and the sum of degrees' },
          { title: C6, sub: 'Practice, mistakes and computing' },
        ]}
      />
    ),
  },

  /* ── CONCEPT 1 ───────────────────────────────────────────────────────── */
  { id: 'c1-divider', section: C1, label: 'Divider', element: <SectionBreakerSlide index={1} title={C1} lesson={SESSION} /> },
  {
    id: 'c1-skeleton',
    section: C1,
    label: 'What Do These Have in Common?',
    element: (
      <ContentSlide kicker={C1} title="What Do These Have in Common?" lead="Think First: a metro map, a friend list, a road atlas" lesson={SESSION}>
        <div className="flex w-full items-center gap-6">
          <Card>
            <Label>Metro map</Label>
            <Graph
              w={300}
              h={170}
              r={13}
              nodes={[
                { id: 'a', x: 30, y: 40, label: '' },
                { id: 'b', x: 110, y: 40, label: '' },
                { id: 'c', x: 190, y: 85, label: '' },
                { id: 'd', x: 270, y: 85, label: '' },
                { id: 'e', x: 110, y: 140, label: '' },
                { id: 'f', x: 270, y: 150, label: '' },
              ]}
              edges={[
                { a: 'a', b: 'b', color: '#DC2626', width: 7, bend: -10 },
                { a: 'b', b: 'c', color: '#DC2626', width: 7, bend: 12 },
                { a: 'c', b: 'd', color: '#DC2626', width: 7 },
                { a: 'e', b: 'c', color: '#16A34A', width: 7, bend: -14 },
                { a: 'c', b: 'f', color: '#16A34A', width: 7, bend: 10 },
              ]}
            />
          </Card>
          <span className="font-heading text-[32px] font-semibold" style={{ color: colors.brand }}>
            ⟶
          </span>
          <Step>
            <Card tone="brand">
              <Label>This skeleton is a graph</Label>
              <Graph
                w={300}
                h={170}
                r={13}
                nodes={[
                  { id: 'a', x: 30, y: 40, label: '' },
                  { id: 'b', x: 110, y: 40, label: '' },
                  { id: 'c', x: 190, y: 85, label: '' },
                  { id: 'd', x: 270, y: 85, label: '' },
                  { id: 'e', x: 110, y: 140, label: '' },
                  { id: 'f', x: 270, y: 150, label: '' },
                ]}
                edges={[{ a: 'a', b: 'b' }, { a: 'b', b: 'c' }, { a: 'c', b: 'd' }, { a: 'e', b: 'c' }, { a: 'c', b: 'f' }]}
              />
            </Card>
          </Step>
          <div className="space-y-2">
            {['Things: stations, people, towns', 'Connections between pairs', 'Only who is connected to whom matters'].map((t) => (
              <Step key={t}>
                <Card>
                  <Txt className="text-[18px]">{t}</Txt>
                </Card>
              </Step>
            ))}
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"Start with intuition. Ask learners to name one more network from daily life before moving on: bus routes, family trees, the web." Positions and shapes do not matter.',
  },
  {
    id: 'c1-networks',
    section: C1,
    label: 'Things and Connections',
    element: (
      <ContentSlide kicker={C1} title="Things and Connections" lead="Real networks as graphs" lesson={SESSION}>
        <div className="grid w-full grid-cols-2 gap-3">
          {[
            ['Metro system', 'Stations', 'Tracks between neighbouring stations', false],
            ['Messaging app', 'People', 'Friendships', false],
            ['Internet', 'Routers', 'Cables between routers', false],
            ['Course plan', 'Courses', '"Must be taken before" links', true],
          ].map(([n, v, e, d]) => (
            <Step key={n as string}>
              <div className="flex items-center gap-4 rounded-card border border-line bg-white px-4 py-3 shadow-card-soft">
                <Graph
                  w={130}
                  h={70}
                  r={11}
                  nodes={[
                    { id: '1', x: 18, y: 18, label: '' },
                    { id: '2', x: 112, y: 18, label: '' },
                    { id: '3', x: 65, y: 54, label: '' },
                  ]}
                  edges={[
                    { a: '1', b: '2', dir: d as boolean, width: 2.5 },
                    { a: '2', b: '3', dir: d as boolean, width: 2.5 },
                    { a: '1', b: '3', dir: d as boolean, width: 2.5 },
                  ]}
                />
                <span>
                  <span className="block font-heading text-[19px] font-semibold" style={{ color: colors.ink }}>
                    {n as string}
                  </span>
                  <span className="block text-[17px]" style={{ color: colors.ink }}>
                    Vertices: {v as string}
                  </span>
                  <span className="block text-[17px]" style={{ color: colors.ink }}>
                    Edges: {e as string}
                  </span>
                  {d && (
                    <span className="block text-[17px] font-semibold" style={{ color: ORANGE }}>
                      has a direction
                    </span>
                  )}
                </span>
              </div>
            </Step>
          ))}
        </div>
      </ContentSlide>
    ),
    notes: '"The course plan row is different: before has a direction. Keep that thought; it leads to directed graphs in Types of Graphs."',
  },
  {
    id: 'c1-konigsberg',
    section: C1,
    label: 'Where Graph Theory Began',
    element: (
      <ContentSlide kicker={C1} title="Where Graph Theory Began" lead="A walking puzzle from 1736" lesson={SESSION}>
        <div className="flex w-full items-center gap-8">
          <Graph
            w={420}
            h={230}
            nodes={[
              { id: 'A', x: 140, y: 115, fill: BLUE },
              { id: 'B', x: 270, y: 30, fill: TONE.ok },
              { id: 'C', x: 270, y: 200, fill: TONE.ok },
              { id: 'D', x: 390, y: 115, fill: ORANGE },
            ]}
            edges={[
              { a: 'A', b: 'B', bend: 22 },
              { a: 'A', b: 'B', bend: -22 },
              { a: 'A', b: 'C', bend: 22 },
              { a: 'A', b: 'C', bend: -22 },
              { a: 'A', b: 'D' },
              { a: 'B', b: 'D' },
              { a: 'C', b: 'D' },
            ]}
          />
          <Steps
            items={[
              ['Königsberg: 7 bridges joining 4 land areas'],
              ['Can you cross every bridge exactly once?'],
              ['Euler: land areas become dots, bridges become lines'],
              ['The puzzle is solved later in the course'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"Do not solve the puzzle now. Use it as a hook: learners will be able to answer it once they know about degrees and Euler circuits." A is the island, B and C the river banks, D the east area.',
  },

  /* ── CONCEPT 2 ───────────────────────────────────────────────────────── */
  { id: 'c2-divider', section: C2, label: 'Divider', element: <SectionBreakerSlide index={2} title={C2} lesson={SESSION} /> },
  {
    id: 'c2-definition',
    section: C2,
    label: 'Graph G = (V, E)',
    element: (
      <ContentSlide kicker={C2} title="Graph G = (V, E)" lead="Vertices and edges" lesson={SESSION}>
        <div className="w-full space-y-4">
          <Formula size={34}>G = (V, E)</Formula>
          <div className="grid w-fit grid-cols-2 gap-5">
            <Step>
              <Card className="h-full w-[380px]">
                <Label>V: vertices (nodes)</Label>
                <div className="my-2 flex gap-2">
                  {['u', 'v', 'w', 'x'].map((t) => (
                    <span key={t} className="grid h-10 w-10 place-items-center rounded-full font-heading text-[18px] font-semibold text-white" style={{ background: BLUE }}>
                      {t}
                    </span>
                  ))}
                </div>
                <Txt>A non-empty set</Txt>
              </Card>
            </Step>
            <Step>
              <Card className="h-full w-[380px]">
                <Label>E: edges</Label>
                <div className="my-2 flex flex-wrap gap-2">
                  {['{u, v}', '{v, w}', 'uw'].map((t) => (
                    <span key={t} className="rounded-md px-2 py-1 font-heading text-[18px] font-semibold" style={{ background: `${ORANGE}18`, color: colors.ink }}>
                      {t}
                    </span>
                  ))}
                </div>
                <Txt>Each edge joins two endpoints; E may be empty</Txt>
              </Card>
            </Step>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"Stress that V cannot be empty, but E can be. A graph with vertices and no edges is still a graph." In an undirected graph an edge joining u and v is written {u, v} or simply uv.',
  },
  {
    id: 'c2-campus',
    section: C2,
    label: 'Building a Graph From a Story',
    element: (
      <ContentSlide kicker={C2} title="Building a Graph From a Story" lead="Walking paths on campus" lesson={SESSION}>
        <div className="flex w-full items-center gap-8">
          <div className="space-y-2">
            <Card>
              <Txt className="text-[18px]">Library L, Canteen C, Hostel H, Gym G, Admin A, Parking P</Txt>
              <Txt className="text-[18px]">Paths: L–C, L–H, C–H, C–G, H–A</Txt>
            </Card>
            <Steps
              items={[
                ['V = {L, C, H, G, A, P}', '|V| = 6'],
                ['E = {LC, LH, CH, CG, HA}', '|E| = 5'],
              ]}
            />
          </div>
          <Step>
            <Graph w={420} h={240} nodes={campus({ P: { ring: ORANGE } })} edges={CAMPUS_E} />
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"We will use this campus graph throughout. Point out that P has no path to anything; it is still a vertex of the graph."',
  },
  {
    id: 'c2-draw',
    section: C2,
    label: 'From Sets to a Picture',
    element: (
      <ContentSlide kicker={C2} title="From Sets to a Picture" lead="Try it: draw the graph, then check against the reveal" lesson={SESSION}>
        <div className="flex w-fit items-center gap-8">
          <div className="w-[300px] -rotate-1 rounded-md px-4 py-3 shadow-card-soft" style={{ background: '#FEF9C3' }}>
            <Txt className="font-semibold">V = {'{1, 2, 3, 4, 5, 6}'}</Txt>
            <Txt className="font-semibold">E = {'{12, 13, 24, 26, 34, 35}'}</Txt>
            <Txt className="mt-2 text-[17px]">Place 6 dots, draw one line per pair, then count: 6 lines</Txt>
          </div>
          <Graph
            w={420}
            h={240}
            build
            nodes={[
              { id: '1', x: 60, y: 120 },
              { id: '2', x: 180, y: 40 },
              { id: '3', x: 180, y: 200 },
              { id: '4', x: 280, y: 120 },
              { id: '5', x: 360, y: 210 },
              { id: '6', x: 360, y: 35 },
            ]}
            edges={[
              { a: '1', b: '2' },
              { a: '1', b: '3' },
              { a: '2', b: '4' },
              { a: '2', b: '6' },
              { a: '3', b: '4' },
              { a: '3', b: '5' },
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"Different learners will place the dots differently and their pictures will look different. Ask: are they the same graph? Yes, because V and E are the same; only the drawing differs."',
  },
  {
    id: 'c2-finite',
    section: C2,
    label: 'How Many Vertices?',
    element: (
      <ContentSlide kicker={C2} title="How Many Vertices?" lead="Finite versus infinite" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="grid w-fit grid-cols-2 gap-6">
            <Card>
              <Label>Finite graph: V and E finite</Label>
              <Graph w={420} h={240} r={18} nodes={campus()} edges={CAMPUS_E} />
            </Card>
            <Card>
              <Label>Infinite graph: V infinite</Label>
              <div className="mt-16 flex items-center">
                <span className="text-[22px] font-semibold" style={{ color: TONE.grey }}>
                  …
                </span>
                {[-2, -1, 0, 1, 2].map((n, i) => (
                  <span key={n} className="flex items-center">
                    <span className="h-[3px] w-6" style={{ background: colors.ink }} />
                    <span className="grid h-10 w-10 place-items-center rounded-full font-heading text-[16px] font-semibold" style={{ boxShadow: `inset 0 0 0 2.5px ${colors.ink}`, color: colors.ink }}>
                      {n}
                    </span>
                    {i === 4 && <span className="h-[3px] w-6" style={{ background: colors.ink }} />}
                  </span>
                ))}
                <span className="text-[22px] font-semibold" style={{ color: TONE.grey }}>
                  …
                </span>
              </div>
              <Txt className="mt-6 text-[18px]">Integers, with an edge between n and n + 1</Txt>
            </Card>
          </div>
          <Txt>In this course, "graph" means a finite graph unless stated otherwise</Txt>
        </div>
      </ContentSlide>
    ),
    notes: '"Keep this brief. Infinite graphs are mentioned for completeness; every problem in this course uses finite graphs."',
  },

  /* ── CONCEPT 3 ───────────────────────────────────────────────────────── */
  { id: 'c3-divider', section: C3, label: 'Divider', element: <SectionBreakerSlide index={3} title={C3} lesson={SESSION} /> },
  {
    id: 'c3-directed',
    section: C3,
    label: 'Two-Way or One-Way?',
    element: (
      <ContentSlide kicker={C3} title="Two-Way or One-Way?" lead="Undirected and directed graphs" lesson={SESSION}>
        <div className="grid w-full grid-cols-2 gap-6">
          <Step>
            <Card className="h-full">
              <Label>Undirected: friends</Label>
              <Graph w={300} h={90} nodes={[{ id: 'A', x: 40, y: 45 }, { id: 'B', x: 260, y: 45 }]} edges={[{ a: 'A', b: 'B', pill: { text: 'friends', dy: -18 } }]} />
              <Txt>An edge {'{u, v}'} has no direction: a two-way road, a friendship</Txt>
            </Card>
          </Step>
          <Step>
            <Card className="h-full">
              <Label>Directed (digraph): follows</Label>
              <Graph w={300} h={90} nodes={[{ id: 'A', x: 40, y: 45 }, { id: 'B', x: 260, y: 45 }]} edges={[{ a: 'A', b: 'B', dir: true, color: ORANGE, pill: { text: 'follows', dy: -18 } }]} />
              <Txt>An edge is an ordered pair (u, v): u is the initial vertex, v the terminal vertex</Txt>
            </Card>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Ask: is is a sibling of directed or undirected? Undirected. Is a parent of? Directed." Here A follows B but B does not follow A.',
  },
  {
    id: 'c3-simple',
    section: C3,
    label: 'The Cleanest Kind of Graph',
    element: (
      <ContentSlide kicker={C3} title="The Cleanest Kind of Graph" lead="A simple graph: undirected, no loops, no parallel edges" lesson={SESSION}>
        <div className="grid w-full grid-cols-3 gap-4">
          {[
            ['Simple', '✓', TONE.ok, [], [{ a: 'x', b: 'y' }, { a: 'y', b: 'z' }, { a: 'x', b: 'z' }]],
            ['Has a loop', '✗', TONE.bad, [{ node: 'z', side: 'right' as const, color: TONE.bad }], [{ a: 'x', b: 'y' }, { a: 'y', b: 'z' }]],
            ['Has parallel edges', '✗', TONE.bad, [], [{ a: 'x', b: 'y', bend: 14, color: TONE.bad }, { a: 'x', b: 'y', bend: -14, color: TONE.bad }, { a: 'y', b: 'z' }]],
          ].map(([t, mark, c, loops, edges]) => (
            <Step key={t as string}>
              <Card className="h-full">
                <span className="font-heading text-[20px] font-semibold" style={{ color: c as string }}>
                  {mark as string} {t as string}
                </span>
                <Graph
                  w={240}
                  h={150}
                  nodes={[
                    { id: 'x', x: 40, y: 40 },
                    { id: 'y', x: 180, y: 40 },
                    { id: 'z', x: 110, y: 120 },
                  ]}
                  edges={edges as GEdge[]}
                  loops={loops as GraphProps['loops']}
                />
              </Card>
            </Step>
          ))}
        </div>
      </ContentSlide>
    ),
    notes: '"Most graphs in this course are simple. When a question says just graph, check the context; some books mean simple graph by default." The campus graph is simple.',
  },
  {
    id: 'c3-multigraph',
    section: C3,
    label: 'More Than One Edge',
    element: (
      <ContentSlide kicker={C3} title="More Than One Edge" lead="A multigraph allows parallel edges" lesson={SESSION}>
        <div className="flex w-full items-center gap-8">
          <Graph
            w={400}
            h={190}
            nodes={[
              { id: 'X', x: 50, y: 95, fill: BLUE },
              { id: 'Y', x: 350, y: 95, fill: BLUE },
            ]}
            edges={[
              { a: 'X', b: 'Y', bend: -45, color: PURPLE, width: 4, pill: { text: 'highway', dy: -56 } },
              { a: 'X', b: 'Y', bend: 45, color: ORANGE, width: 4, pill: { text: 'old road', dy: 56 } },
            ]}
          />
          <Steps
            items={[
              ['Parallel (multiple) edges join the same pair'],
              ['m edges join u and v: multiplicity m', '{X, Y}: 2'],
              ['Two cables between data centres: a backup'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"Terminology varies between books. We use multigraph for parallel edges, and pseudograph when loops are also allowed (next slide)."',
  },
  {
    id: 'c3-loops',
    section: C3,
    label: 'An Edge From a Vertex to Itself',
    element: (
      <ContentSlide kicker={C3} title="An Edge From a Vertex to Itself" lead="Loops and pseudographs" lesson={SESSION}>
        <div className="flex w-full items-center gap-8">
          <div>
            <Graph w={220} h={190} r={30} nodes={[{ id: 'page', x: 110, y: 120, label: 'page', fill: BLUE }]} loops={[{ node: 'page', side: 'up', color: ORANGE }]} />
            <Txt className="text-[17px]">A web page that links to itself</Txt>
          </div>
          <Steps
            items={[
              ['A loop: both endpoints are the same vertex'],
              ['A pseudograph may have loops and parallel edges'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"Loops matter when we count degrees: a loop will count twice. Flag this now so it does not surprise learners later."',
  },
  {
    id: 'c3-directed-repeats',
    section: C3,
    label: 'Direction Plus Repeats',
    element: (
      <ContentSlide kicker={C3} title="Direction Plus Repeats" lead="Simple directed graphs and directed multigraphs" lesson={SESSION}>
        <div className="flex w-full items-center gap-8">
          <Graph
            w={400}
            h={200}
            nodes={[
              { id: 'a', x: 50, y: 100 },
              { id: 'b', x: 200, y: 100 },
              { id: 'c', x: 350, y: 100 },
            ]}
            edges={[
              { a: 'a', b: 'b', dir: true, pill: { text: '×1', dy: -22 } },
              { a: 'b', b: 'c', dir: true, bend: 30, color: ORANGE },
              { a: 'b', b: 'c', dir: true, bend: -30, color: PURPLE, pill: { text: '×2', dy: -40 } },
            ]}
          />
          <div className="space-y-2">
            <DataTable
              className="w-[460px]"
              compact
              columns={[{ label: 'Type', weight: 1.4 }, { label: 'Loops?', weight: 0.6 }, { label: 'Repeats?', weight: 0.7 }]}
              rows={[
                ['Simple directed graph', 'No', 'No'],
                ['Directed multigraph', 'Yes', 'Yes'],
              ]}
            />
            <Step>
              <Callout kind="info" title="(u, v) and (v, u) are different edges" asStep={false}>
                One arrow each way is not a repeat
              </Callout>
            </Step>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"The example matches the reference slides W8_S1. Point out that an arrow from a to b and one from b to a form a two-way pair, not a repeated edge." Multiplicity of (a, b) is 1, of (b, c) is 2.',
  },
  {
    id: 'c3-weighted',
    section: C3,
    label: 'Edges With Numbers',
    element: (
      <ContentSlide kicker={C3} title="Edges With Numbers" lead="Weights: distances, times, costs, capacities" lesson={SESSION}>
        <div className="flex w-full items-center gap-8">
          <Graph
            w={420}
            h={240}
            nodes={campus()}
            edges={[
              { a: 'L', b: 'C', color: BLUE, pill: { text: '4 min', dy: -14 } },
              { a: 'L', b: 'H', color: BLUE, pill: { text: '6 min', dx: -26 } },
              { a: 'C', b: 'H', color: BLUE, pill: { text: '3 min', dx: 26 } },
              { a: 'C', b: 'G', color: BLUE, pill: { text: '5 min', dy: -16 } },
              { a: 'H', b: 'A', color: BLUE, pill: { text: '2 min', dy: 16 } },
            ]}
          />
          <Steps
            items={[
              ['L → C → H: 4 + 3', '7 min'],
              ['Direct L–H', '6 min'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"Weighted graphs are the basis of route finding in map apps. Shortest paths and minimum spanning trees appear later in the course."',
  },
  {
    id: 'c3-switchboard',
    section: C3,
    label: 'What Is Allowed?',
    element: (
      <ContentSlide kicker={C3} title="What Is Allowed?" lead="Check three switches: direction, loops, parallel edges" lesson={SESSION}>
        <div className="w-full space-y-1.5">
          <div className="grid w-fit grid-cols-[260px_130px_130px_150px] gap-2 px-3">
            {['Type', 'Direction', 'Loops', 'Parallel'].map((h) => (
              <Label key={h}>{h}</Label>
            ))}
          </div>
          {[
            ['Simple graph', 0, 0, 0],
            ['Multigraph', 0, 0, 1],
            ['Pseudograph', 0, 1, 1],
            ['Simple directed graph', 1, 0, 0],
            ['Directed multigraph', 1, 1, 1],
          ].map(([t, ...s]) => (
            <Step key={t as string}>
              <div className="grid w-fit grid-cols-[260px_130px_130px_150px] items-center gap-2 rounded-card border border-line bg-white px-3 py-1.5 shadow-card-soft">
                <span className="text-[19px] font-semibold" style={{ color: colors.ink }}>
                  {t as string}
                </span>
                {s.map((on, i) => (
                  <span key={i} className="relative h-7 w-14 rounded-full" style={{ background: on ? TONE.ok : '#CBD5E1' }}>
                    <span className="absolute top-1 h-5 w-5 rounded-full bg-white" style={{ left: on ? 32 : 4 }} />
                  </span>
                ))}
              </div>
            </Step>
          ))}
          <Txt className="pt-1">Weighted is an extra feature: any type can carry edge weights</Txt>
        </div>
      </ContentSlide>
    ),
    notes: '"Exam hook: questions often ask what type of graph is this?. Check three things: arrows, loops, repeated edges."',
  },
  {
    id: 'c3-practice',
    section: C3,
    label: 'Sort the Scenarios',
    element: (
      <ContentSlide kicker={C3} title="Sort the Scenarios" lead="Call out the bin for each card, then reveal" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Scenario', weight: 2.2 }, { label: 'Graph type', weight: 1 }]}
          rows={[
            ['Cities joined by roads, at most one road between two cities', 'Simple graph'],
            ['Who follows whom on a social app', 'Simple directed graph'],
            ['Cities joined by several different train lines', 'Multigraph'],
            ['Flights between airports, several on the same route', 'Directed multigraph'],
            ['Bus stops with travel time on each road', 'Weighted graph'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"Some scenarios fit two labels; for example, the bus-stop graph is also simple. Accept both if the learner gives a reason."',
  },
  { id: 'quiz-1', section: C3, label: 'Quiz Time', element: <QuizTimeSlide lesson={SESSION} /> },

  /* ── CONCEPT 4 ───────────────────────────────────────────────────────── */
  { id: 'c4-divider', section: C4, label: 'Divider', element: <SectionBreakerSlide index={4} title={C4} lesson={SESSION} /> },
  {
    id: 'c4-adjacent',
    section: C4,
    label: 'Neighbours and Incidence',
    element: (
      <ContentSlide kicker={C4} title="Neighbours and Incidence" lead="Vertex to vertex, and edge to vertex" lesson={SESSION}>
        <div className="flex w-full items-center gap-8">
          <Graph
            w={420}
            h={240}
            nodes={campus({ C: { fill: ORANGE }, L: { ring: BLUE }, H: { ring: BLUE }, G: { ring: BLUE } })}
            edges={[
              { a: 'L', b: 'C', color: ORANGE, width: 5 },
              { a: 'L', b: 'H' },
              { a: 'C', b: 'H', color: ORANGE, width: 5 },
              { a: 'C', b: 'G', color: ORANGE, width: 5 },
              { a: 'H', b: 'A' },
            ]}
          />
          <div className="space-y-2">
            <Steps
              items={[
                ['Adjacent (neighbours): an edge joins them', 'L, C ✓  L, G ✗'],
                ['Edge {u, v} is incident with u and v', 'orange edges'],
                ['Neighbourhood N(v)', 'N(C) = {L, H, G}'],
                ['P has no neighbours', 'N(P) = ∅'],
              ]}
            />
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"The words are easy to mix up. Adjacency is between two vertices; incidence is between an edge and a vertex." Orange edges are incident with C; blue rings mark its neighbours.',
  },
  {
    id: 'c4-to-from',
    section: C4,
    label: 'To and From',
    element: (
      <ContentSlide kicker={C4} title="To and From" lead="Direction changes the words, for a directed edge (u, v)" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="flex w-fit items-end gap-4">
            <span className="w-[240px] rounded-lg px-3 py-2 text-[18px] font-semibold" style={{ background: `${BLUE}14`, color: colors.ink }}>
              initial vertex: u is adjacent TO v
            </span>
            <span className="w-[240px] rounded-lg px-3 py-2 text-[18px] font-semibold" style={{ background: `${ORANGE}14`, color: colors.ink }}>
              terminal vertex: v is adjacent FROM u
            </span>
          </div>
          <Graph w={520} h={90} r={30} nodes={[{ id: 'u', x: 40, y: 45, fill: BLUE }, { id: 'v', x: 470, y: 45, fill: ORANGE }]} edges={[{ a: 'u', b: 'v', dir: true, width: 6 }]} />
          <Step>
            <Card className="w-fit">
              <Txt>Course plan edge (Maths-1, Maths-2): Maths-1 is adjacent to Maths-2</Txt>
              <Txt>A loop (u, u): initial and terminal vertex are the same</Txt>
            </Card>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Ask learners to read the arrow aloud: u to v. The words follow the direction of the arrow."',
  },
  {
    id: 'c4-adjacency-matrix',
    section: C4,
    label: 'A Graph as a Table',
    element: (
      <ContentSlide kicker={C4} title="A Graph as a Table" lead="Entry (i, j): the number of edges joining vertex i and vertex j" lesson={SESSION}>
        <div className="flex w-full items-center gap-6">
          <Graph w={420} h={240} r={20} nodes={campus({ C: { ring: PINK }, G: { ring: PINK } })} edges={[...CAMPUS_E.slice(0, 3), { a: 'C', b: 'G', color: PINK, width: 5 }, CAMPUS_E[4]]} />
          <div className="space-y-2">
            <div className="grid w-fit gap-1" style={{ gridTemplateColumns: 'repeat(7, 46px)' }}>
              {['', 'L', 'C', 'H', 'G', 'A', 'P'].map((h, i) => (
                <span key={`h${i}`} className="grid h-9 place-items-center text-[17px] font-semibold" style={{ color: colors.brandDark }}>
                  {h}
                </span>
              ))}
              {[
                ['L', 0, 1, 1, 0, 0, 0],
                ['C', 1, 0, 1, 1, 0, 0],
                ['H', 1, 1, 0, 0, 1, 0],
                ['G', 0, 1, 0, 0, 0, 0],
                ['A', 0, 0, 1, 0, 0, 0],
                ['P', 0, 0, 0, 0, 0, 0],
              ].map(([row, ...cells]) => (
                <span key={row as string} className="contents">
                  <span className="grid h-9 place-items-center text-[17px] font-semibold" style={{ color: colors.brandDark }}>
                    {row as string}
                  </span>
                  {cells.map((v, j) => {
                    const lit = (row === 'C' && j === 3) || (row === 'G' && j === 1)
                    return (
                      <span key={j} className="grid h-9 place-items-center rounded-md text-[18px] font-semibold" style={{ background: lit ? PINK : v ? `${BLUE}22` : '#F1F5F9', color: lit ? '#fff' : colors.ink }}>
                        {v as number}
                      </span>
                    )
                  })}
                </span>
              ))}
            </div>
            <Step>
              <Txt className="text-[18px]">Undirected: symmetric. Simple: 0s on the diagonal</Txt>
            </Step>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"Ask learners why the row for P is all zeros: P is isolated. Ask why the matrix is symmetric: an undirected edge works in both directions." The edge C–G lights both (C, G) and (G, C).',
  },
  {
    id: 'c4-incidence-matrix',
    section: C4,
    label: 'Vertices Against Edges',
    element: (
      <ContentSlide kicker={C4} title="Vertices Against Edges" lead="The incidence matrix: rows are vertices, columns are edges" lesson={SESSION}>
        <div className="w-full space-y-3">
          <DataTable
            className="w-full"
            compact
            columns={[{ label: '', weight: 0.6 }, ...['LC', 'LH', 'CH', 'CG', 'HA'].map((e) => ({ label: e }))]}
            rows={[
              ['L', 1, 1, 0, 0, 0],
              ['C', 1, 0, 1, 1, 0],
              ['H', 0, 1, 1, 0, 1],
              ['G', 0, 0, 0, 1, 0],
              ['A', 0, 0, 0, 0, 1],
              ['P', 0, 0, 0, 0, 0],
            ].map(([v, ...c]) => [<span className="font-semibold">{v}</span>, ...c.map((x) => (x ? <span className="inline-block rounded-md px-2 font-semibold text-white" style={{ background: BLUE }}>1</span> : '0'))])}
          />
          <Step>
            <Callout kind="success" title="Every column has exactly two 1s" asStep={false}>
              Each edge has two endpoints: the heart of the Handshaking Lemma
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Hold on to the observation every column has two 1s. It is the heart of the Handshaking Lemma in the next section."',
  },

  /* ── CONCEPT 5 ───────────────────────────────────────────────────────── */
  { id: 'c5-divider', section: C5, label: 'Divider', element: <SectionBreakerSlide index={5} title={C5} lesson={SESSION} /> },
  {
    id: 'c5-degree',
    section: C5,
    label: 'How Many Edges Meet Here?',
    element: (
      <ContentSlide kicker={C5} title="How Many Edges Meet Here?" lead="deg(v): edges incident with v, a loop counting twice" lesson={SESSION}>
        <div className="flex w-full items-center gap-8">
          <Graph
            w={440}
            h={250}
            nodes={campus({
              L: { badge: { text: 'deg 2', dx: 0, dy: -36, tone: PURPLE } },
              C: { badge: { text: 'deg 3', dx: 60, dy: -16, tone: PINK } },
              H: { badge: { text: 'deg 3', dx: 0, dy: 38, tone: PINK } },
              G: { badge: { text: 'deg 1', dx: 0, dy: 36, tone: BLUE } },
              A: { badge: { text: 'deg 1', dx: 56, dy: 0, tone: BLUE } },
              P: { badge: { text: 'deg 0', dx: 0, dy: 36, tone: TONE.grey } },
            })}
            edges={CAMPUS_E}
          />
          <Steps
            items={[
              ['Degree 0: isolated', 'P'],
              ['Degree 1: pendant', 'G, A'],
              ['Degree = adjacency row sum', 'row C: 3'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"Degree can be read from the adjacency matrix too: it is the row sum. Check row C: 1 + 1 + 1 = 3."',
  },
  {
    id: 'c5-edge-ends',
    section: C5,
    label: 'Counting Edge-Ends',
    element: (
      <ContentSlide kicker={C5} title="Counting Edge-Ends" lead="A loop has both of its ends at its vertex" lesson={SESSION}>
        <div className="flex w-full items-center gap-8">
          <Graph
            w={420}
            h={220}
            nodes={[
              { id: 'a', x: 60, y: 130, badge: { text: 'deg 2', dx: 0, dy: 38 } },
              { id: 'b', x: 230, y: 130, badge: { text: 'deg 3', dx: 0, dy: 38 } },
              { id: 'c', x: 370, y: 130, badge: { text: 'deg 3', dx: 0, dy: 38, tone: PINK } },
            ]}
            edges={[
              { a: 'a', b: 'b', bend: 26 },
              { a: 'a', b: 'b', bend: -26 },
              { a: 'b', b: 'c' },
            ]}
            loops={[{ node: 'c', side: 'up', color: PINK }]}
          />
          <Steps
            items={[
              ['a: two parallel edges to b', '2'],
              ['b: two to a, one to c', '3'],
              ['c: one to b, plus 2 for the loop', '3'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"Thinking in edge-ends makes the next theorem obvious. Ask learners to count the knots at each vertex: the loop\'s two knots both sit on c."',
  },
  {
    id: 'c5-handshake',
    section: C5,
    label: 'Sum of Degrees = 2 × Edges',
    element: (
      <ContentSlide kicker={C5} title="Sum of Degrees = 2 × Edges" lead="The Handshaking Lemma: for any undirected graph with m edges" lesson={SESSION}>
        <div className="w-full space-y-4">
          <Formula>Σ deg(v) = 2m</Formula>
          <div className="flex w-fit items-center gap-4">
            <Card>
              <Label>1 handshake = 2 hands</Label>
              <Txt>10 handshakes use 20 hands</Txt>
            </Card>
            <div className="space-y-2">
              <Step>
                <Card tone="ok">
                  <Txt>Campus: 2 + 3 + 3 + 1 + 1 + 0 = 10 = 2 × 5 ✓</Txt>
                </Card>
              </Step>
              <Step>
                <Card tone="ok">
                  <Txt>Loop example: 2 + 3 + 3 = 8 = 2 × 4 ✓</Txt>
                </Card>
              </Step>
            </div>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"Run it live if possible: ask a few learners to shake hands with some others, count handshakes and count hands used. Hands always equal twice the handshakes." The first theorem of graph theory.',
  },
  {
    id: 'c5-proof',
    section: C5,
    label: 'A Two-Line Proof',
    element: (
      <ContentSlide kicker={C5} title="A Two-Line Proof" lead="Every edge has two ends: count the ends two ways" lesson={SESSION}>
        <div className="flex w-full items-start gap-6">
          <div className="grid w-fit gap-1" style={{ gridTemplateColumns: '44px repeat(5, 48px) 70px' }}>
            {['', 'LC', 'LH', 'CH', 'CG', 'HA', 'deg'].map((h, i) => (
              <span key={`h${i}`} className="grid h-8 place-items-center text-[16px] font-semibold" style={{ color: i === 6 ? PINK : colors.brandDark }}>
                {h}
              </span>
            ))}
            {[
              ['L', 1, 1, 0, 0, 0, 2],
              ['C', 1, 0, 1, 1, 0, 3],
              ['H', 0, 1, 1, 0, 1, 3],
              ['G', 0, 0, 0, 1, 0, 1],
              ['A', 0, 0, 0, 0, 1, 1],
              ['P', 0, 0, 0, 0, 0, 0],
            ].map(([v, ...c]) => (
              <span key={v as string} className="contents">
                <span className="grid h-8 place-items-center text-[16px] font-semibold" style={{ color: colors.brandDark }}>
                  {v as string}
                </span>
                {c.map((x, j) => (
                  <span key={j} className="grid h-8 place-items-center rounded text-[17px] font-semibold" style={{ background: j === 5 ? `${PINK}22` : x ? `${BLUE}22` : '#F8FAFC', color: colors.ink }}>
                    {x as number}
                  </span>
                ))}
              </span>
            ))}
            <span className="grid h-8 place-items-center text-[16px] font-semibold" style={{ color: TONE.ok }}>
              sum
            </span>
            {[2, 2, 2, 2, 2].map((x, j) => (
              <span key={j} className="grid h-8 place-items-center rounded text-[17px] font-semibold" style={{ background: `${TONE.ok}22`, color: colors.ink }}>
                {x}
              </span>
            ))}
            <span className="grid h-8 place-items-center rounded text-[17px] font-semibold text-white" style={{ background: TONE.ok }}>
              10
            </span>
          </div>
          <Steps
            items={[
              ['Each edge has two ends: 2m ends', 'columns: 2 each'],
              ['A degree counts the ends at one vertex', 'rows: degrees'],
              ['Both totals count every end once', 'Σ deg(v) = 2m ✓'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"This is a counting-in-two-ways proof: count the same collection of edge-ends by columns and by rows." Both totals are 10.',
  },
  {
    id: 'c5-odd',
    section: C5,
    label: 'Odd Vertices Come in Pairs',
    element: (
      <ContentSlide kicker={C5} title="Odd Vertices Come in Pairs" lead="Theorem: every undirected graph has an even number of odd-degree vertices" lesson={SESSION}>
        <div className="flex w-full items-center gap-8">
          <div className="flex w-fit items-end gap-5">
            {[
              ['Even degree', [['L', 2], ['P', 0]], BLUE],
              ['Odd degree', [['C', 3], ['H', 3], ['G', 1], ['A', 1]], ORANGE],
            ].map(([t, balls, c]) => (
              <div key={t as string} className="flex flex-col items-center">
                <div className="flex min-h-[110px] w-[220px] flex-wrap content-end gap-2 rounded-b-[30px] border-4 border-t-0 px-3 pb-3" style={{ borderColor: c as string }}>
                  {(balls as [string, number][]).map(([v, d], i) => (
                    <span key={v} className="grid h-12 w-12 place-items-center rounded-full font-heading text-[16px] font-semibold text-white" style={{ background: c as string, marginRight: t === 'Odd degree' && i % 2 === 1 ? 12 : 0 }}>
                      {v} {d}
                    </span>
                  ))}
                </div>
                <span className="mt-1 text-[18px] font-semibold" style={{ color: c as string }}>
                  {t as string}
                </span>
              </div>
            ))}
          </div>
          <Steps
            items={[
              ['Σ deg(v) = 2m is even'],
              ['Even-degree vertices add to an even number'],
              ['So the odd ones add to an even number: an even count of them', 'campus: 4 ✓'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"Exam hook: this theorem gives fast impossible answers. If a degree list has an odd number of odd degrees, no graph has it."',
  },
  {
    id: 'c5-quick',
    section: C5,
    label: 'Quick Answers From One Equation',
    element: (
      <ContentSlide kicker={C5} title="Quick Answers From One Equation" lead="A student asks; the lemma answers" lesson={SESSION}>
        <div className="w-full space-y-1.5">
          {[
            ['Can a graph have degrees 3, 3, 2, 1?', 'Sum 9 is odd: impossible'],
            ['Can 7 people each shake hands with exactly 3 others?', 'Sum 21 is odd: impossible'],
            ['Edges in a graph with degrees 4, 3, 3, 2, 2?', 'Sum 14 = 2m: m = 7'],
            ['10 edges, every vertex degree 4: how many vertices?', '4n = 20: n = 5'],
            ['5 friends, every pair shakes hands once: how many handshakes?', '5 × 4 = 2m: m = 10'],
          ].map(([q, a]) => (
            <Step key={q}>
              <div className="flex w-fit flex-col gap-1">
                <span className="w-fit rounded-2xl rounded-bl-none px-4 py-1.5 text-[18px]" style={{ background: '#E2E8F0', color: colors.ink }}>
                  {q}
                </span>
                <span className="ml-24 w-fit rounded-2xl rounded-br-none px-4 py-1.5 text-[18px] font-semibold text-white" style={{ background: BLUE }}>
                  {a}
                </span>
              </div>
            </Step>
          ))}
        </div>
      </ContentSlide>
    ),
    notes: '"The last row matches C(5, 2) = 10: two different methods, the same answer."',
  },
  {
    id: 'c5-in-out',
    section: C5,
    label: 'Arrows In, Arrows Out',
    element: (
      <ContentSlide kicker={C5} title="Arrows In, Arrows Out" lead="In a directed graph: deg⁻(v) arrows in, deg⁺(v) arrows out; a loop adds 1 to each" lesson={SESSION}>
        <div className="flex w-full items-center gap-8">
          <Graph
            w={400}
            h={250}
            nodes={[
              { id: '1', x: 70, y: 130, badge: { text: 'in 2 · out 2', dx: 0, dy: 40 } },
              { id: '2', x: 200, y: 40, badge: { text: 'in 1 · out 1', dx: 84, dy: 0 } },
              { id: '3', x: 320, y: 140, badge: { text: 'in 3 · out 2', dx: 0, dy: 44 } },
              { id: '4', x: 60, y: 30, badge: { text: 'in 0 · out 1', dx: 72, dy: -4 } },
            ]}
            edges={[
              { a: '1', b: '2', dir: true },
              { a: '2', b: '3', dir: true },
              { a: '3', b: '1', dir: true, bend: 20 },
              { a: '1', b: '3', dir: true, bend: 20, color: ORANGE },
              { a: '4', b: '1', dir: true },
            ]}
            loops={[{ node: '3', side: 'right', color: PINK }]}
          />
          <RevealTable
            keep={1}
            columns={[{ label: 'Vertex', weight: 0.6 }, { label: 'deg⁻ (in)', weight: 0.8 }, { label: 'deg⁺ (out)', weight: 0.8 }]}
            rows={[
              ['1', '2', '2'],
              ['2', '1', '1'],
              ['3', '3', '2'],
              ['4', '0', '1'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"Ask learners to describe vertex 4: nothing comes in, one arrow goes out. In a social app, that is someone who follows one person but has no followers." Edges (1,2), (2,3), (3,1), (1,3), (4,1) and the loop (3,3).',
  },
  {
    id: 'c5-directed-lemma',
    section: C5,
    label: 'In = Out = Number of Edges',
    element: (
      <ContentSlide kicker={C5} title="In = Out = Number of Edges" lead="Every arrow has one tail and one head" lesson={SESSION}>
        <div className="w-full space-y-4">
          <Formula>Σ deg⁻(v) = Σ deg⁺(v) = |E|</Formula>
          <div className="flex w-fit items-center gap-3">
            <span className="rounded-lg px-3 py-1.5 text-[18px] font-semibold" style={{ background: `${ORANGE}18`, color: colors.ink }}>
              tail: +1 out
            </span>
            <span className="h-[5px] w-40 rounded" style={{ background: colors.ink }} />
            <span className="text-[26px]" style={{ color: colors.ink }}>
              ▶
            </span>
            <span className="rounded-lg px-3 py-1.5 text-[18px] font-semibold" style={{ background: `${BLUE}18`, color: colors.ink }}>
              head: +1 in
            </span>
          </div>
          <Steps
            items={[
              ['In-degrees: 2 + 1 + 3 + 0', '6'],
              ['Out-degrees: 2 + 1 + 2 + 1', '6'],
              ['Number of arrows |E|', '6 ✓'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"Ask: for a directed graph, what is Σ(deg⁻ + deg⁺)? It is 2|E|, matching the undirected lemma." The example is the one on Arrows In, Arrows Out.',
  },

  /* ── CONCEPT 6 ───────────────────────────────────────────────────────── */
  { id: 'c6-divider', section: C6, label: 'Divider', element: <SectionBreakerSlide index={6} title={C6} lesson={SESSION} /> },
  {
    id: 'c6-ticket',
    section: C6,
    label: 'One Graph, Many Questions',
    element: (
      <ContentSlide kicker={C6} title="One Graph, Many Questions" lead="E = {pq, pr, qr, rs, rs, tt}: answer on your exit ticket" lesson={SESSION}>
        <div className="flex w-full items-center gap-6">
          <div className="rounded-md border-2 border-dashed px-3 py-2" style={{ borderColor: colors.line, background: '#FFFDF5' }}>
            <Graph
              w={330}
              h={230}
              nodes={[
                { id: 'p', x: 50, y: 50 },
                { id: 'q', x: 50, y: 180 },
                { id: 'r', x: 170, y: 115 },
                { id: 's', x: 290, y: 115 },
                { id: 't', x: 280, y: 200 },
              ]}
              edges={[
                { a: 'p', b: 'q' },
                { a: 'p', b: 'r' },
                { a: 'q', b: 'r' },
                { a: 'r', b: 's', bend: 18 },
                { a: 'r', b: 's', bend: -18 },
              ]}
              loops={[{ node: 't', side: 'left' }]}
            />
          </div>
          <RevealTable
            columns={[{ label: 'Question', weight: 1.2 }, { label: 'Answer', weight: 1.4 }]}
            rows={[
              ['What type of graph?', 'Pseudograph (parallel edges and a loop)'],
              ['N(r)', '{p, q, s}'],
              ['deg(r), deg(s), deg(t)', '4, 2, 2'],
              ['Sum of all degrees', '2 + 2 + 4 + 2 + 2 = 12 = 2 × 6 ✓'],
              ['Pendant or isolated vertices?', 'None'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"Common slip: counting the parallel edges r–s as one. r has edges to p, q and two to s, so deg(r) = 4." V = {p, q, r, s, t}.',
  },
  {
    id: 'c6-errors',
    section: C6,
    label: 'What Went Wrong?',
    element: (
      <ContentSlide kicker={C6} title="What Went Wrong?" lead="Red pen on the marking sheet" lesson={SESSION}>
        <div className="w-full space-y-2">
          {[
            ['"A loop adds 1 to the degree"', 'An undirected loop has two ends: it adds 2 (in a digraph: 1 in, 1 out)'],
            ['"Σ deg(v) = number of edges"', 'Each edge is counted twice: Σ deg(v) = 2m'],
            ['"Degrees 3, 3, 3 are possible"', 'An odd count of odd degrees: impossible'],
            ['"(u, v) and (v, u) are parallel edges"', 'Opposite directions: two different directed edges'],
            ['"L and G are adjacent because both touch C"', 'Sharing a neighbour is not adjacency'],
          ].map(([claim, fix]) => (
            <Step key={claim}>
              <div className="grid grid-cols-[1fr_1.3fr] items-center gap-4 rounded-card border border-line bg-white px-4 py-2 shadow-card-soft">
                <span className="w-fit rounded-full px-3 py-1 text-[18px] italic" style={{ color: colors.ink, boxShadow: `inset 0 0 0 2px ${TONE.bad}` }}>
                  {claim}
                </span>
                <span className="text-[18px] font-semibold" style={{ color: TONE.bad }}>
                  {fix}
                </span>
              </div>
            </Step>
          ))}
        </div>
      </ContentSlide>
    ),
    notes: '"Ask learners to find the error before revealing the correction. This builds the habit of checking claims against definitions."',
  },
  {
    id: 'c6-computing',
    section: C6,
    label: 'Where Programmers Meet Graphs',
    element: (
      <ContentSlide kicker={C6} title="Where Programmers Meet Graphs" lead="Programs store a graph as an adjacency matrix or as neighbour lists" lesson={SESSION}>
        <div className="grid w-full grid-cols-2 gap-3">
          {[
            ['Map navigation', 'Junctions', 'Roads with travel times', 'Weighted, often directed'],
            ['Social media follows', 'Accounts', 'Follows', 'Directed'],
            ['Computer networks', 'Devices', 'Links, sometimes several', 'Multigraph'],
            ['Web search', 'Web pages', 'Hyperlinks', 'Directed, loops possible'],
          ].map(([app, v, e, t]) => (
            <Step key={app}>
              <div className="rounded-2xl border border-line bg-white px-4 py-3 shadow-card-soft">
                <span className="inline-block rounded-md px-2 py-0.5 font-mono text-[16px] font-semibold text-white" style={{ background: colors.ink }}>
                  {app}
                </span>
                <Txt className="mt-1 text-[18px]">Vertices: {v}; edges: {e}</Txt>
                <span className="mt-1 block font-heading text-[19px] font-semibold" style={{ color: TONE.ok }}>
                  {t}
                </span>
              </div>
            </Step>
          ))}
        </div>
      </ContentSlide>
    ),
    notes: '"Ask learners which representation suits a huge social network where each person has few friends. A list of neighbours wastes less space than a matrix full of zeros."',
  },

  /* ── CLOSING ────────────────────────────────────────────────────────── */
  { id: 'quiz-2', section: 'Closing', label: 'Quiz Time', element: <QuizTimeSlide lesson={SESSION} /> },
  { id: 'takeaways', section: 'Closing', label: 'Key Takeaways', element: <KeyTakeawaysSlide title={SESSION} lesson={SESSION} points={AGENDA} /> },
  { id: 'feedback', section: 'Closing', label: 'Feedback', element: <FeedbackSlide lesson={SESSION} formless />, notes: 'No form and no QR (content rule 41 as amended 2026-11-21). Ask for feedback out loud.' },
  { id: 'thank-you', section: 'Closing', label: 'Thank you', element: <ThankYouSlide title="Thank You" lesson={SESSION} /> },
  { id: 'all-the-best', section: 'Closing', label: 'All the best', element: <ThankYouSlide title="All the Best" lesson={SESSION} /> },
]
