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
import { Callout, CodeBlock, DataTable, OutputPanel } from '@/ui'
import type { TableColumn } from '@/ui/DataTable'
import { Step, useClaimedSteps } from '@/motion/Stepper'
import { useInstant } from '@/motion/instant'
import { colors } from '@/design/tokens'
import { RelationGraph, type GraphEdge, type GraphFrame, type GraphNode, type NodeState } from '@/ui/structures'

/**
 * INTRODUCTION TO ALGEBRAIC STRUCTURES (DSM).
 *
 * Built from the signed-off plan at
 *   Outputs/dsm/session_plans/introduction_to_algebraic_structures/plan.md
 * the source of truth for order, framework and wording. Every result on these
 * slides was recomputed by `verify_tr.py` beside the plan; the Python output is
 * what Python printed when the plan was written.
 *
 * Four concepts: Meaning of Algebraic Structures (4MAT), Closure Property
 * (Merrill), Examples of Algebraic Structures (Merrill), Importance of
 * Algebraic Structures (4MAT). No recap, setup or Next Session slide: the TR
 * has none. Feedback slide is `formless` (rule 41, 2026-11-21).
 *
 * Parallel reveal (content rule 6): where a table row and its picture belong
 * together, ONE `useBuild(n)` claims the steps and drives both.
 */

const SESSION = 'Introduction to Algebraic Structures'
const C1 = 'Meaning of Algebraic Structures'
const C2 = 'Closure Property'
const C3 = 'Examples of Algebraic Structures'
const C4 = 'Importance of Algebraic Structures'
const AGENDA = [C1, C2, C3, C4]

export const algebraicStructuresMeta: DeckMeta = {
  title: SESSION,
  course: 'DSM',
  lesson: SESSION,
  presenter: 'NxtWave Instructor',
  player: { autoHideControls: true },
}

/* ── shared helpers (the same contracts as the Functions deck) ─────────────── */

/** Claim `n` build steps once and return how many have been reached. */
function useBuild(n: number): number {
  return useClaimedSteps(n).filter(Boolean).length
}

/** A table header that is maths keeps its case: DataTable uppercases headers. */
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

/** A table whose answer columns arrive one row per press. */
function RevealTable({ columns, rows, keep = 1, compact = true }: { columns: TableColumn[]; rows: ReactNode[][]; keep?: number; compact?: boolean }) {
  const k = useBuild(rows.length)
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

/* ── machines: values and operations as pills ────────────────────────────── */

interface Link {
  id: string
  label: ReactNode
  /** An operation (lit pill); a value otherwise. */
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

/** One operation as a row: (a, b) → op → result. */
const op = (key: string, pair: string, sym: string, out: string, o: { pw?: number; mw?: number; ow?: number; state?: NodeState } = {}): Link[] => [
  { id: `${key}-in`, label: pair, w: o.pw ?? 130 },
  { id: `${key}-op`, label: sym, m: true, w: o.mw ?? 80 },
  { id: `${key}-out`, label: out, w: o.ow ?? 110, state: o.state },
]

/** Several operation rows, stacked, built one row per frame. */
function OpRows({ rows, width, x0 = 0, rowGap = 78, labels, labelW = 0 }: { rows: Link[][]; width: number; x0?: number; rowGap?: number; labels?: string[]; labelW?: number }) {
  const frames: GraphFrame[] = rows.map((_, n) => ({
    nodes: rows.slice(0, n + 1).flatMap((r, i) => chainNodes(r, 36 + i * rowGap, x0 + labelW)),
    edges: rows.slice(0, n + 1).flatMap((r) => chainEdges(r)),
    marks: labels ? labels.slice(0, n + 1).map((t, i) => ({ id: `l${i}`, node: rows[i][0].id, text: t, side: 'left' as const, tone: 'ink' as const })) : undefined,
  }))
  return <RelationGraph width={width} height={36 + (rows.length - 1) * rowGap + 40} frames={frames} />
}

/** A set as an oval of dots, with results that may land inside or outside. */
function SetPicture({ inside, outside = [], edges, width, height, caption, states = {} }: { inside: { id: string; label: string; x: number; y: number }[]; outside?: { id: string; label: string; x: number; y: number }[]; edges: [string, string][]; width: number; height: number; caption?: ReactNode; states?: Record<string, NodeState> }) {
  const nodes: GraphNode[] = [...inside, ...outside].map((n) => ({ ...n, w: n.label.length > 2 ? 22 + n.label.length * 11 : undefined, state: states[n.id] ?? (outside.some((o) => o.id === n.id) ? 'warn' : 'plain') }))
  const outIds = new Set(outside.map((o) => o.id))
  return (
    <RelationGraph
      width={width}
      height={height}
      frames={[
        {
          nodes,
          groups: [{ id: 'set', nodes: inside.map((n) => n.id) }],
          edges: edges.map(([a, b]) => ({ id: `${a}>${b}`, from: a, to: b, tone: outIds.has(b) ? 'warn' : 'ok' })),
          caption,
        },
      ]}
    />
  )
}

/* ── figure data ─────────────────────────────────────────────────────────── */

const COMBINE = [
  op('z', '(3, 5)', '+', '8'),
  op('b', '(true, false)', 'OR', 'true', { pw: 160 }),
  op('s', '({a}, {b})', '∪', '{a, b}', { pw: 150 }),
]
const BINARY: Link[] = [
  { id: 'ab', label: '(a, b)', w: 110 },
  { id: 'star', label: '∗', m: true, w: 70 },
  { id: 'res', label: 'a ∗ b', w: 100, state: 'ok' },
]
const AS_FUNCTIONS = [op('z', '(3, 5)', '+', '8'), op('p', '(A, B)', '∪', 'A ∪ B'), op('b', '(1, 0)', '∧', '0')]
const UNARY: Link[][] = [
  [{ id: 'n-in', label: '4', w: 70 }, { id: 'n-op', label: 'negate', m: true, w: 110 }, { id: 'n-out', label: '−4', w: 80 }],
  [{ id: 'c-in', label: 'A', w: 70 }, { id: 'c-op', label: 'complement', m: true, w: 150 }, { id: 'c-out', label: 'A′', w: 80 }],
  [{ id: 't-in', label: '1', w: 70 }, { id: 't-op', label: 'NOT', m: true, w: 90 }, { id: 't-out', label: '0', w: 80 }],
]
const TERNARY: Link[] = [
  { id: 'in', label: '(2, 9, 4)', w: 130 },
  { id: 'max', label: 'max', m: true, w: 90 },
  { id: 'out', label: '9', w: 70, state: 'ok' },
]
const MINUS: Link[] = [
  { id: 'in', label: '(3, 5)', w: 110 },
  { id: 'op', label: '−', m: true, w: 70 },
  { id: 'out', label: '−2', w: 80 },
]
const CONCAT: Link[] = [
  { id: 'in', label: '(01, 110)', w: 140 },
  { id: 'op', label: 'join', m: true, w: 90 },
  { id: 'out', label: '01110', w: 110, state: 'ok' },
]
const OVERFLOW: Link[] = [
  { id: 'in', label: '2147483647 + 1', w: 190 },
  { id: 'op', label: '32-bit int', m: true, w: 130 },
  { id: 'out', label: '−2147483648', w: 170, state: 'warn' },
]

/** Twelve hours on a ring. */
const CLOCK = (states: Record<string, NodeState> = {}): GraphNode[] =>
  Array.from({ length: 12 }, (_, i) => {
    const h = i + 1
    const a = (h / 12) * 2 * Math.PI
    return { id: `h${h}`, label: String(h), x: 180 + 148 * Math.sin(a), y: 180 - 148 * Math.cos(a), state: states[`h${h}`] }
  })

/* ── slides driven by one counter ────────────────────────────────────────── */

function PowerSets() {
  return (
    <div className="w-full space-y-3">
      <DataTable
        className="w-full"
        stepped
        compact
        columns={[{ label: 'Operation', weight: 1.4 }, { label: 'Result' }, { label: 'In P(S)?', weight: 0.8 }]}
        rows={[
          ['{a} ∪ {b}', '{a, b}', 'Yes'],
          ['{a} ∩ {b}', '∅', 'Yes'],
          ['{a}′, complement in S', '{b}', 'Yes'],
        ]}
      />
      <Callout kind="success" title="Closed under all three">
        Union, intersection and complement of subsets of S are always subsets of S
      </Callout>
    </div>
  )
}

/* ── the deck ────────────────────────────────────────────────────────────── */

export const algebraicStructuresDeck: SlideDef[] = [
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
          { title: C1, sub: 'Operations on a set' },
          { title: C2, sub: 'Does the result stay inside?' },
          { title: C3, sub: 'Integers, Boolean values, sets, strings' },
          { title: C4, sub: 'Mathematics and computer science' },
        ]}
      />
    ),
  },

  /* ── CONCEPT 1: Meaning of Algebraic Structures (4MAT) ───────────────── */
  { id: 'c1-divider', section: C1, label: 'Divider', element: <SectionBreakerSlide index={1} title={C1} lesson={SESSION} /> },
  {
    id: 'c1-combine',
    section: C1,
    label: 'Sets That Combine',
    element: (
      <ContentSlide kicker={C1} title="Sets That Combine" lead="Most useful sets come with ways to combine two elements" lesson={SESSION}>
        <OpRows rows={COMBINE} width={900} labelW={190} labels={['Integers', 'True and false', 'Sets']} />
      </ContentSlide>
    ),
    notes: 'Ask learners which operations they used today without thinking: adding prices, AND-ing conditions in code, merging contact lists. Each is an operation on some set.',
  },
  {
    id: 'c1-pieces',
    section: C1,
    label: 'Pieces and Rules',
    element: (
      <ContentSlide
        kicker={C1}
        title="Pieces and Rules"
        lead="A box of LEGO bricks is only a set of pieces"
        lesson={SESSION}
        points={[
          { text: 'Pieces alone cannot build anything', icon: 'dot' },
          { text: 'Snapping rule: how two bricks join', icon: 'link' },
          { text: 'Set plus rule: now we can build', icon: 'check' },
        ]}
      >
        <RelationGraph
          width={440}
          height={210}
          frames={[
            {
              nodes: [
                { id: 'b1', x: 70, y: 50, label: 'brick', w: 90 },
                { id: 'b2', x: 70, y: 160, label: 'brick', w: 90 },
                { id: 'snap', x: 210, y: 105, label: 'snap', w: 90, state: 'lit' },
                { id: 'big', x: 360, y: 105, label: 'bigger piece', w: 150, state: 'ok' },
              ],
              edges: [
                { id: 'e1', from: 'b1', to: 'snap' },
                { id: 'e2', from: 'b2', to: 'snap' },
                { id: 'e3', from: 'snap', to: 'big' },
              ],
            },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'A box of LEGO bricks is just a set of pieces. Once you know how two bricks snap together into a bigger piece, you can build things: the snapping rule is the operation.',
  },
  {
    id: 'c1-binary',
    section: C1,
    label: 'Binary Operation',
    element: (
      <ContentSlide
        kicker={C1}
        title="Binary Operation"
        lead="Every ordered pair (a, b) from S gets exactly one a ∗ b, also in S"
        lesson={SESSION}
        points={[
          { text: 'Two elements in: an ordered pair', icon: 'arrow' },
          { text: 'Exactly one element out', icon: 'check' },
          { text: 'Output stays in S', icon: 'target' },
        ]}
      >
        <RelationGraph width={440} height={150} frames={[{ nodes: chainNodes(BINARY, 60, 20, 50), edges: chainEdges(BINARY), groups: [{ id: 's', nodes: ['ab', 'star', 'res'] }], caption: 'Everything stays in S' }]} />
      </ContentSlide>
    ),
    notes: 'Binary means two inputs. The output must be a single element, and it must belong to the same set S.',
  },
  {
    id: 'c1-as-functions',
    section: C1,
    label: 'Operations as Functions',
    element: (
      <ContentSlide kicker={C1} title="Operations as Functions" lead="∗: S × S → S, a function from pairs of S to S" lesson={SESSION}>
        <OpRows rows={AS_FUNCTIONS} width={900} labelW={200} labels={['Addition on Z', 'Union on P(S)', 'AND on {0, 1}']} />
      </ContentSlide>
    ),
    notes: 'Link back to the Functions session: an operation is simply a function whose input is a pair from S × S and whose output must be in S. That last condition is closure, the main idea of this session.',
  },
  {
    id: 'c1-unary',
    section: C1,
    label: 'Unary Operations',
    element: (
      <ContentSlide kicker={C1} title="Unary Operations" lead="One element in, one element out: f: S → S" lesson={SESSION}>
        <OpRows rows={UNARY} width={900} labelW={200} labels={['Negation on Z', 'Complement on P(S)', 'NOT on {0, 1}']} />
      </ContentSlide>
    ),
    notes: 'Unary operations such as complement appear in Boolean algebra.',
  },
  {
    id: 'c1-n-ary',
    section: C1,
    label: 'n-ary Operations',
    element: (
      <ContentSlide
        kicker={C1}
        title="n-ary Operations"
        lead="n elements in, one element out: f: Sⁿ → S"
        lesson={SESSION}
        points={[
          { text: 'max(a, b, c) on Z takes three inputs', sub: 'A ternary operation', icon: 'dot' },
          { text: 'This unit works with binary operations', icon: 'info' },
        ]}
      >
        <RelationGraph width={440} height={110} frames={[{ nodes: chainNodes(TERNARY, 50, 20, 50), edges: chainEdges(TERNARY) }]} />
      </ContentSlide>
    ),
    notes: 'Binary operations are by far the most important; the rest of the unit focuses on them.',
  },
  {
    id: 'c1-structure',
    section: C1,
    label: 'Algebraic Structure',
    element: (
      <ContentSlide
        kicker={C1}
        title="Algebraic Structure"
        lead="A non-empty set together with one or more operations on it"
        lesson={SESSION}
        points={[
          { text: 'Also called an algebraic system', icon: 'info' },
          { text: 'Written as the set, then its operations', sub: '(S, ∗)', icon: 'pencil' },
        ]}
      >
        <RelationGraph
          width={440}
          height={220}
          frames={[
            {
              nodes: [
                ...['−1', '0', '1', '2'].map((v, i) => ({ id: `z${i}`, label: v, x: 70 + i * 70, y: 60 })),
                { id: 'plus', label: '+', x: 140, y: 170, w: 70, state: 'lit' as NodeState },
                { id: 'times', label: '×', x: 250, y: 170, w: 70, state: 'lit' as NodeState },
              ],
              groups: [{ id: 'z', nodes: ['z0', 'z1', 'z2', 'z3'] }],
              marks: [{ id: 'set', node: 'z3', text: 'set', side: 'right', tone: 'ink' }, { id: 'ops', node: 'times', text: 'operations', side: 'right', tone: 'ink' }],
            },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'The set must be non-empty. One set can carry one operation or several.',
  },
  {
    id: 'c1-notation',
    section: C1,
    label: 'Writing a Structure',
    element: (
      <ContentSlide kicker={C1} title="Writing a Structure" lead="List the set, then its operations, inside brackets" lesson={SESSION}>
        <DataTable
          className="w-full"
          stepped
          compact
          columns={[{ label: 'Notation' }, { label: 'Set' }, { label: 'Operations', weight: 1.4 }]}
          rows={[
            ['(Z, +)', 'Integers', 'Addition'],
            ['(Z, +, ×)', 'Integers', 'Addition and multiplication'],
            ['({0, 1}, ∨, ∧, ¬)', 'Boolean values', 'OR, AND, NOT'],
            ['(P(S), ∪, ∩, ′)', 'Subsets of S', 'Union, intersection, complement'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Read each notation aloud: "the integers with addition", and so on.',
  },
  {
    id: 'c1-same-set',
    section: C1,
    label: 'Same Set, New Structure',
    element: (
      <ContentSlide kicker={C1} title="Same Set, New Structure" lead="(Z, +) and (Z, ×) are two different structures on one set" lesson={SESSION}>
        <OpRows rows={[op('a', '(3, 5)', '+', '8'), op('m', '(3, 5)', '×', '15')]} width={900} labelW={140} labels={['(Z, +)', '(Z, ×)']} />
      </ContentSlide>
    ),
    notes: 'Stress that the same set with different operations gives different structures, even though the set is the same.',
  },

  /* ── CONCEPT 2: Closure Property (Merrill) ───────────────────────────── */
  { id: 'c2-divider', section: C2, label: 'Divider', element: <SectionBreakerSlide index={2} title={C2} lesson={SESSION} /> },
  {
    id: 'c2-lands',
    section: C2,
    label: 'Where the Answer Lands',
    element: (
      <ContentSlide
        kicker={C2}
        title="Where the Answer Lands"
        lead="3 − 5 can always be calculated"
        lesson={SESSION}
        points={[
          { text: 'Answer: −2', icon: 'check' },
          { text: 'Next question: which set is −2 in?', icon: 'target' },
        ]}
      >
        <RelationGraph width={440} height={110} frames={[{ nodes: chainNodes(MINUS, 50, 20, 50), edges: chainEdges(MINUS) }]} />
      </ContentSlide>
    ),
    notes: 'Closure is about where the answer lands, not about whether the calculation is possible.',
  },
  {
    id: 'c2-leaving',
    section: C2,
    label: 'Leaving the Set',
    element: (
      <ContentSlide kicker={C2} title="Leaving the Set" lead="In N = {0, 1, 2, …}, the answer −2 is outside" lesson={SESSION}>
        <div className="w-full space-y-4">
          <SetPicture
            width={700}
            height={210}
            inside={['0', '1', '2', '3', '4', '5'].map((v, i) => ({ id: `n${v}`, label: v, x: 260 + i * 72, y: 60 }))}
            outside={[{ id: 'neg', label: '−2', x: 548, y: 170 }]}
            edges={[
              ['n3', 'neg'],
              ['n5', 'neg'],
            ]}
          />
          <Callout kind="note" title="A members-only club">
            Two members team up and produce an outsider
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes: 'Added opening slide. 3 and 5 are both in N, but their difference is not. A club where two members could produce an outsider is not closed.',
  },
  {
    id: 'c2-closure',
    section: C2,
    label: 'Closure',
    element: (
      <ContentSlide kicker={C2} title="Closure" lead="S is closed under ∗ when a ∗ b ∈ S for all a, b ∈ S" lesson={SESSION}>
        <div className="flex w-full gap-10">
          <SetPicture
            width={420}
            height={200}
            inside={[
              { id: 'a', label: '3', x: 80, y: 60 },
              { id: 'b', label: '5', x: 80, y: 150 },
              { id: 'c', label: '8', x: 260, y: 105 },
            ]}
            edges={[
              ['a', 'c'],
              ['b', 'c'],
            ]}
            caption="Z under +: closed"
          />
          <SetPicture
            width={420}
            height={200}
            inside={[
              { id: 'a', label: '3', x: 80, y: 60 },
              { id: 'b', label: '5', x: 80, y: 150 },
            ]}
            outside={[{ id: 'c', label: '−2', x: 300, y: 105 }]}
            edges={[
              ['a', 'c'],
              ['b', 'c'],
            ]}
            caption="N under −: not closed"
          />
        </div>
      </ContentSlide>
    ),
    notes: 'The sum of two integers is always an integer. 3 − 5 can be calculated; the problem is that the answer leaves N.',
  },
  {
    id: 'c2-first',
    section: C2,
    label: 'Closure Comes First',
    element: (
      <ContentSlide kicker={C2} title="Closure Comes First" lead="No closure, no operation, no algebraic structure" lesson={SESSION}>
        <div className="w-full space-y-3">
          <Callout kind="error" title="Check 1: closure">
            (N, −) fails: 3 − 5 ∉ N, so − is not an operation on N
          </Callout>
          <Callout kind="note" title="Every later property">
            Checked only once closure holds
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes: 'An operation on S must produce an element of S every time; that is what ∗: S × S → S means. Use the analogy of a building inspection: if the foundation fails, the inspector does not check the paint. Associativity, identity and inverses come in later sessions.',
  },
  {
    id: 'c2-prove',
    section: C2,
    label: 'Proving Closure',
    element: (
      <ContentSlide kicker={C2} title="Proving Closure" lead="Even integers under +: take any two, not just examples" lesson={SESSION}>
        <div className="w-full space-y-3">
          <StepCards items={[['Take any two even integers', '2m and 2n'], ['Add them', '2m + 2n = 2(m + n)'], ['2(m + n) is even', 'So even integers are closed under +']]} />
          <Callout kind="info" title="Examples are not proof">
            Checking a few pairs never proves closure
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes: 'Take arbitrary elements of S and show the result has the form required by S.',
  },
  {
    id: 'c2-disprove',
    section: C2,
    label: 'Disproving Closure',
    element: (
      <ContentSlide
        kicker={C2}
        title="Disproving Closure"
        lead="Odd integers under +: one counterexample is enough"
        lesson={SESSION}
        points={[
          { text: '1 and 3 are odd', icon: 'dot' },
          { text: '1 + 3 = 4, which is not odd', icon: 'cross' },
          { text: 'So odd integers are not closed under +', icon: 'warning' },
        ]}
      >
        <SetPicture
          width={440}
          height={200}
          inside={[
            { id: 'o5', label: '5', x: 70, y: 60 },
            { id: 'o7', label: '7', x: 70, y: 150 },
            { id: 'o1', label: '1', x: 160, y: 60 },
            { id: 'o3', label: '3', x: 160, y: 150 },
          ]}
          outside={[{ id: 'four', label: '4', x: 360, y: 105 }]}
          edges={[
            ['o1', 'four'],
            ['o3', 'four'],
          ]}
          caption="Odd integers"
        />
      </ContentSlide>
    ),
    notes: 'One counterexample always disproves closure. Exam hook: "Is the set of odd integers closed under addition? Justify."',
  },
  {
    id: 'c2-odd-times',
    section: C2,
    label: 'Odd Times Odd',
    element: (
      <ContentSlide kicker={C2} title="Odd Times Odd" lead="Odd integers under ×: the same set, a different operation" lesson={SESSION}>
        <StepCards items={[['Take any two odd integers', '2m + 1 and 2n + 1'], ['Multiply them', '(2m + 1)(2n + 1) = 2(2mn + m + n) + 1'], ['That is 2k + 1, so odd', 'Odd integers are closed under ×']]} />
      </ContentSlide>
    ),
    notes: 'Same set as the previous slide, different operation, different answer.',
  },
  {
    id: 'c2-tables',
    section: C2,
    label: 'Operation Tables',
    element: (
      <ContentSlide kicker={C2} title="Operation Tables" lead="S = {0, 1, 2, 3}, with a +₄ b = remainder of a + b on division by 4" lesson={SESSION}>
        <div className="grid w-full grid-cols-[1.1fr_1fr] items-center gap-8">
          <DataTable
            className="w-full"
            stepped
            compact
            columns={[{ label: mh('+₄') }, { label: '0' }, { label: '1' }, { label: '2' }, { label: '3' }]}
            rows={[
              ['0', '0', '1', '2', '3'],
              ['1', '1', '2', '3', '0'],
              ['2', '2', '3', '0', '1'],
              ['3', '3', '0', '1', '2'],
            ]}
          />
          <div className="space-y-3">
            <Callout kind="success" title="Closed">
              Every entry is 0, 1, 2 or 3
            </Callout>
            <Callout kind="error" title="With ordinary +">
              2 + 3 = 5, which is not in S
            </Callout>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: 'For a finite set, list every result in a table: S is closed exactly when every entry lies in S. This kind of table is called an operation table or Cayley table.',
  },
  {
    id: 'c2-your-turn',
    section: C2,
    label: 'Closed or Not?',
    element: (
      <ContentSlide kicker={C2} title="Closed or Not?" lead="Vote first, then check one row at a time" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Set and operation' }, { label: 'Closed?', weight: 0.6 }, { label: 'Reason or counterexample', weight: 2 }]}
          rows={[
            ['N, +', 'Yes', 'Sum of two natural numbers is natural'],
            ['N, −', 'No', '3 − 5 = −2'],
            ['Z, −', 'Yes', 'Difference of two integers is an integer'],
            ['Z, ÷', 'No', '1 ÷ 2 = 0.5, and 1 ÷ 0 is undefined'],
            ['Q without 0, ÷', 'Yes', 'Quotient of two non-zero rationals is a non-zero rational'],
            ['{−1, 0, 1}, +', 'No', '1 + 1 = 2'],
            ['{−1, 0, 1}, ×', 'Yes', 'Every product is −1, 0 or 1'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Point out the Z, ÷ row: an operation must work for every pair, including pairs with 0 as the divisor. Removing 0 from Q fixes this.',
  },
  {
    id: 'c2-clock',
    section: C2,
    label: 'Clock Arithmetic',
    element: (
      <ContentSlide
        kicker={C2}
        title="Clock Arithmetic"
        lead="A clock adds modulo 12: 5 hours after 9 o'clock is 2 o'clock"
        lesson={SESSION}
        points={[
          { text: 'Every answer is one of the 12 hours', icon: 'check' },
          { text: 'So the hours are closed under clock addition', icon: 'target' },
        ]}
      >
        <RelationGraph
          width={360}
          height={360}
          frames={[
            { nodes: CLOCK({ h9: 'lit' }) },
            { nodes: CLOCK({ h9: 'lit', h2: 'ok' }), edges: [{ id: 'e', from: 'h9', to: 'h2', tone: 'ok', bend: 40 }] },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Added Integration slide, from the operation-table note. Addition modulo 12 is a structure learners use every day.',
  },
  { id: 'quiz-1', section: C2, label: 'Quiz Time', element: <QuizTimeSlide lesson={SESSION} /> },

  /* ── CONCEPT 3: Examples of Algebraic Structures (Merrill) ───────────── */
  { id: 'c3-divider', section: C3, label: 'Divider', element: <SectionBreakerSlide index={3} title={C3} lesson={SESSION} /> },
  {
    id: 'c3-familiar',
    section: C3,
    label: 'Familiar Sets',
    element: (
      <ContentSlide kicker={C3} title="Familiar Sets" lead="Sets we have already met, in earlier sessions and in code" lesson={SESSION}>
        <StepCards
          cols={2}
          items={[
            ['Integers', 'Z'],
            ['True and false', '{0, 1}'],
            ['Subsets of a set S', 'P(S)'],
            ['Strings of 0s and 1s', '01, 110, …'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Added opening slide.',
  },
  {
    id: 'c3-which',
    section: C3,
    label: 'Which Ones Count?',
    element: (
      <ContentSlide kicker={C3} title="Which Ones Count?" lead="A set and an operation count as a structure only after closure" lesson={SESSION}>
        <Callout kind="note" title="The test for every example" asStep={false}>
          Does every result of the operation stay inside the set?
        </Callout>
      </ContentSlide>
    ),
    notes: 'Added opening slide. Each example that follows is run through the closure check.',
  },
  {
    id: 'c3-integers',
    section: C3,
    label: 'Integers',
    element: (
      <ContentSlide kicker={C3} title="Integers" lead="Five operations on Z" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Structure' }, { label: 'Closed?', weight: 0.6 }, { label: 'Comment', weight: 2.2 }]}
          rows={[
            ['(Z, +)', 'Yes', 'Sum of integers is an integer'],
            ['(Z, ×)', 'Yes', 'Product of integers is an integer'],
            ['(Z, +, ×)', 'Yes', 'Two operations on the same set'],
            ['(Z, −)', 'Yes', 'But order matters: 5 − 3 ≠ 3 − 5'],
            ['(Z, ÷)', 'No', '1 ÷ 2 ∉ Z, so not an algebraic structure'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'The comment on (Z, −) previews later properties: closure holds, but order matters. We will study such properties in coming sessions.',
  },
  {
    id: 'c3-boolean',
    section: C3,
    label: 'Boolean Values',
    element: (
      <ContentSlide kicker={C3} title="Boolean Values" lead="B = {0, 1}, where 0 means false and 1 means true" lesson={SESSION}>
        <div className="w-full space-y-3">
          <DataTable
            className="w-full"
            stepped
            compact
            columns={[{ label: mh('a'), weight: 0.6 }, { label: mh('b'), weight: 0.6 }, { label: mh('a ∨ b (OR)') }, { label: mh('a ∧ b (AND)') }, { label: mh('¬a (NOT)') }]}
            rows={[
              ['0', '0', '0', '0', '1'],
              ['0', '1', '1', '0', '1'],
              ['1', '0', '1', '0', '0'],
              ['1', '1', '1', '1', '0'],
            ]}
          />
          <Callout kind="success" title="Closed">
            Every result is 0 or 1, so (B, ∨, ∧, ¬) is an algebraic structure
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes: 'Picture two light switches wired in parallel (OR) and in series (AND) to a bulb. This structure is the basis of Boolean algebra and every digital circuit. Ordinary + is not closed on {0, 1}: 1 + 1 = 2. XOR (1 ⊕ 1 = 0) is closed.',
  },
  {
    id: 'c3-power-sets',
    section: C3,
    label: 'Power Sets',
    element: (
      <ContentSlide kicker={C3} title="Power Sets" lead="S = {a, b}, so P(S) = {∅, {a}, {b}, {a, b}}" lesson={SESSION}>
        <PowerSets />
      </ContentSlide>
    ),
    notes: 'Complement is taken with respect to S = {a, b}. Draw the Venn diagram on the board if learners need it.',
  },
  {
    id: 'c3-strings',
    section: C3,
    label: 'Strings',
    element: (
      <ContentSlide
        kicker={C3}
        title="Strings"
        lead="Strings of 0s and 1s, joined end to end: concatenation"
        lesson={SESSION}
        points={[
          { text: '01 · 110 = 01110', icon: 'link' },
          { text: 'Any two strings join into a string', icon: 'check' },
          { text: 'So strings are closed under concatenation', icon: 'target' },
        ]}
      >
        <RelationGraph width={440} height={110} frames={[{ nodes: chainNodes(CONCAT, 50, 10, 44), edges: chainEdges(CONCAT) }]} />
      </ContentSlide>
    ),
    notes: 'Concatenation appears again in compilers and automata theory.',
  },
  {
    id: 'c3-matrices',
    section: C3,
    label: 'Matrices',
    element: (
      <ContentSlide kicker={C3} title="Matrices" lead="2 × 2 matrices under two operations" lesson={SESSION}>
        <RevealTable
          keep={2}
          columns={[{ label: 'Set', weight: 1.2 }, { label: 'Operation', weight: 0.9 }, { label: 'Closed?', weight: 0.6 }, { label: 'Why', weight: 2 }]}
          rows={[
            ['2 × 2 real matrices', 'Addition', 'Yes', 'Sum of two 2 × 2 matrices is 2 × 2'],
            ['2 × 2 real matrices', 'Multiplication', 'Yes', 'Product of two 2 × 2 matrices is 2 × 2'],
            ['2 × 2 invertible matrices', 'Addition', 'No', 'I + (−I) is the zero matrix, not invertible'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'The last row shows that a well-behaved set can fail closure under one operation and pass under another: invertible matrices are closed under multiplication but not under addition.',
  },
  {
    id: 'c3-your-turn',
    section: C3,
    label: 'Your Turn',
    element: (
      <ContentSlide kicker={C3} title="Your Turn" lead="Vote on each, then reveal" lesson={SESSION}>
        <RevealTable
          keep={2}
          columns={[{ label: 'Set', weight: 1 }, { label: 'Operation', weight: 1.1 }, { label: 'Closed?', weight: 0.6 }, { label: 'Reason', weight: 2 }]}
          rows={[
            ['Positive integers', 'aᵇ', 'Yes', 'A positive integer to a positive power is a positive integer'],
            ['N', 'max(a, b)', 'Yes', 'The larger of two is one of them'],
            ['Z', '(a + b)/2', 'No', '(1 + 2)/2 = 1.5'],
            ['{0, 1}', 'Ordinary +', 'No', '1 + 1 = 2'],
            ['{0, 1}', 'XOR', 'Yes', 'Results are 0 or 1'],
            ['{1, −1, i, −i}', 'Multiplication', 'Yes', 'i × i = −1, i × (−i) = 1, and so on'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'For the last row, ask learners to build the 4 × 4 operation table: every entry is one of 1, −1, i, −i.',
  },
  {
    id: 'c3-sets-logic',
    section: C3,
    label: 'Sets Match Logic',
    element: (
      <ContentSlide kicker={C3} title="Sets Match Logic" lead="Set operations and logic operations behave alike" lesson={SESSION}>
        <div className="w-full space-y-3">
          <DataTable
            className="w-full"
            stepped
            compact
            columns={[{ label: 'On P(S)' }, { label: 'On {0, 1}' }]}
            rows={[
              ['∪ union', '∨ OR'],
              ['∩ intersection', '∧ AND'],
              ['′ complement', '¬ NOT'],
            ]}
          />
          <Callout kind="info" title="No accident">
            Both are examples of the same kind of structure
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes: 'Added Integration slide, from the power-set note: compare the power-set slide with the Boolean slide.',
  },

  /* ── CONCEPT 4: Importance of Algebraic Structures (4MAT) ────────────── */
  { id: 'c4-divider', section: C4, label: 'Divider', element: <SectionBreakerSlide index={4} title={C4} lesson={SESSION} /> },
  {
    id: 'c4-same',
    section: C4,
    label: 'Same Behaviour',
    element: (
      <ContentSlide kicker={C4} title="Same Behaviour" lead="Very different sets, combining in the same way" lesson={SESSION}>
        <StepCards
          items={[
            ['Integers under +', 'Closed: two integers give an integer'],
            ['Clock arithmetic', 'Closed: two hours give an hour'],
            ['2 × 2 matrices under +', 'Closed: two matrices give a matrix'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'A number line, a clock and a matrix look nothing alike, but their operations behave the same way.',
  },
  {
    id: 'c4-again',
    section: C4,
    label: 'Proving Again',
    element: (
      <ContentSlide kicker={C4} title="Proving Again" lead="Without a shared name, each set needs its own proof" lesson={SESSION}>
        <StepCards
          items={[
            ['Integers under +', 'Prove each fact'],
            ['Clock arithmetic', 'Prove the same fact again'],
            ['2 × 2 matrices under +', 'And again'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Added opening slide: the cost that abstraction removes.',
  },
  {
    id: 'c4-abstraction',
    section: C4,
    label: 'Power of Abstraction',
    element: (
      <ContentSlide
        kicker={C4}
        title="Power of Abstraction"
        lead="Prove a fact once for a type of structure, and it holds for every set of that type"
        lesson={SESSION}
        points={[
          { text: 'Group sets by how their operations behave', icon: 'check' },
          { text: 'Like writing a function once and reusing it', icon: 'code' },
          { text: 'Shows hidden links, such as sets and logic', icon: 'link' },
        ]}
      >
        <RelationGraph
          width={440}
          height={240}
          frames={[
            {
              nodes: [
                { id: 'p', label: 'One proof', x: 80, y: 120, w: 130, state: 'lit' },
                { id: 'i', label: 'Integers', x: 330, y: 40, w: 120 },
                { id: 'c', label: 'Clock', x: 330, y: 120, w: 120 },
                { id: 'm', label: 'Matrices', x: 330, y: 200, w: 120 },
              ],
              edges: [
                { id: 'a', from: 'p', to: 'i', tone: 'ok' },
                { id: 'b', from: 'p', to: 'c', tone: 'ok' },
                { id: 'd', from: 'p', to: 'm', tone: 'ok' },
              ],
            },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Abstraction is the same idea as a function in programming: write the proof once and reuse it for every structure of that type.',
  },
  {
    id: 'c4-computing',
    section: C4,
    label: 'Structures in Computing',
    element: (
      <ContentSlide kicker={C4} title="Structures in Computing" lead="Structures behind familiar technology" lesson={SESSION}>
        <DataTable
          className="w-full"
          stepped
          compact
          columns={[{ label: 'Structure' }, { label: 'Where it is used', weight: 1.6 }]}
          rows={[
            ['Boolean values with AND, OR, NOT', 'Digital circuits, conditions in code, search filters'],
            ['Integers modulo n', 'Cryptography such as RSA, hashing, checksums, clocks'],
            ['Bit strings with XOR', 'Parity checks and error-detecting codes'],
            ['Strings with concatenation', 'Compilers, text processing, automata theory'],
            ['Sets with union and intersection', 'Database queries: UNION, INTERSECT'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Keep this as motivation; learners will meet each of these in later courses.',
  },
  {
    id: 'c4-python',
    section: C4,
    label: 'Division in Python',
    element: (
      <ContentSlide kicker={C4} title="Division in Python" lead="When integers are not closed, Python changes the type of the result" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="grid w-full grid-cols-2 items-center gap-6">
            <CodeBlock filename="Python" chip={false} code={'print(7 / 2)\nprint(7//2)\nprint("ab" + "cd")'} />
            <OutputPanel output={'3.5\n3\nabcd'} />
          </div>
          <Callout kind="info" title="Closure view">
            7 / 2 leaves the integers, so Python returns a float; 7//2 stays an integer
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes: 'Ask a learner to run 7 / 2 and 7 // 2 in Python. The type change is the programming language admitting that integers are not closed under ordinary division. Floor division stays an integer except for division by 0. Strings are closed under concatenation.',
  },
  {
    id: 'c4-overflow',
    section: C4,
    label: 'Integer Overflow',
    element: (
      <ContentSlide
        kicker={C4}
        title="Integer Overflow"
        lead="In C or Java, an int has a fixed size of 32 bits"
        lesson={SESSION}
        points={[
          { text: 'A sum too large for the type wraps around', icon: 'warning' },
          { text: 'So int arithmetic is really modulo 2³²', icon: 'info' },
        ]}
      >
        <RelationGraph width={440} height={170} frames={[{ nodes: chainNodes(OVERFLOW.slice(0, 2), 40, 0, 40).concat(chainNodes(OVERFLOW.slice(2), 130, 230)), edges: chainEdges(OVERFLOW) }]} />
      </ContentSlide>
    ),
    notes: 'The largest 32-bit int is 2147483647; adding 1 wraps to −2147483648. The int type is closed, but its arithmetic is not the arithmetic of the integers.',
  },
  {
    id: 'c4-thread',
    section: C4,
    label: 'Set, Operation, Closure',
    element: (
      <ContentSlide kicker={C4} title="Set, Operation, Closure" lead="Common thread behind every example in this session" lesson={SESSION}>
        <StepCards items={[['A set', 'The elements'], ['An operation', 'How two elements combine'], ['Closure', 'The result stays inside the set']]} />
      </ContentSlide>
    ),
    notes: 'The common thread is a set, an operation, and closure.',
  },

  /* ── CLOSING ─────────────────────────────────────────────────────────── */
  { id: 'quiz-2', section: 'Closing', label: 'Quiz Time', element: <QuizTimeSlide lesson={SESSION} /> },
  {
    id: 'takeaways',
    section: 'Closing',
    label: 'Key Takeaways',
    element: <KeyTakeawaysSlide title={SESSION} lesson={SESSION} points={AGENDA} />,
    notes: 'Meaning: a non-empty set with one or more operations, written (S, ∗); a binary operation is ∗: S × S → S. Closure: a ∗ b ∈ S for all a, b; the first check; one counterexample disproves it. Examples: (Z, +), (Z, ×), ({0, 1}, ∨, ∧, ¬), (P(S), ∪, ∩, ′), strings; non-examples (N, −), (Z, ÷). Importance: prove once, apply to many sets; circuits, cryptography, error detection, compilers, databases.',
  },
  { id: 'feedback', section: 'Closing', label: 'Feedback', element: <FeedbackSlide lesson={SESSION} formless />, notes: 'No form and no QR (content rule 41 as amended 2026-11-21). Ask for feedback out loud.' },
  { id: 'thank-you', section: 'Closing', label: 'Thank you', element: <ThankYouSlide title="Thank You" lesson={SESSION} /> },
  { id: 'all-the-best', section: 'Closing', label: 'All the best', element: <ThankYouSlide title="All the Best" lesson={SESSION} /> },
]
