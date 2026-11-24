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
import { RelationGraph, type GraphEdge, type GraphFrame, type GraphNode, type NodeState } from '@/ui/structures'

/**
 * ALGEBRAIC SYSTEMS (DSM).
 *
 * Built from the signed-off plan at
 *   Outputs/dsm/session_plans/algebraic_systems/plan.md
 * the source of truth for order, framework and wording. Every result on these
 * slides was recomputed by `verify_tr.py` beside the plan.
 *
 * Six concepts: Algebraic Systems and Binary Operations (4MAT, five slides by
 * the user's decision), Associative and Commutative Properties (Merrill),
 * Identity Element (Merrill), Inverse Elements (Merrill), Idempotent Property
 * (4MAT), Examples and Verification (Merrill). Key Takeaways lists the TR's own
 * five items, without Examples and Verification (user, at sign-off).
 *
 * Operation tables light exactly the cells a test reads (`Lit`), so the room
 * sees which cells decide commutativity, the identity, an inverse or an
 * idempotent element. Where a table row and its picture belong together, one
 * `useBuild(n)` drives both (content rule 6).
 */

const SESSION = 'Algebraic Systems'
const C1 = 'Algebraic Systems and Binary Operations'
const C2 = 'Associative and Commutative Properties'
const C3 = 'Identity Element'
const C4 = 'Inverse Elements'
const C5 = 'Idempotent Property'
const C6 = 'Examples and Verification'
const TAKEAWAYS = [C1, C2, C3, C4, C5]

export const algebraicSystemsMeta: DeckMeta = {
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

/** A table header that is maths keeps its case: DataTable uppercases headers. */
const mh = (s: string) => <span className="normal-case tracking-normal">{s}</span>

const EASE = [0.22, 1, 0.36, 1] as const

/** A cell that fades up when its answer is revealed. */
function Fresh({ children }: { children: ReactNode }) {
  const instant = useInstant()
  return (
    <motion.span className="inline-block" initial={{ opacity: instant ? 1 : 0, y: instant ? 0 : 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: instant ? 0 : 0.52, ease: EASE }}>
      {children}
    </motion.span>
  )
}

type LitTone = 'ok' | 'warn' | 'brand'
const LIT = { ok: colors.success, warn: colors.warning, brand: colors.brandDark }

/** One table cell, tinted to the exact bounds of its value (content rule 43). */
function Lit({ v, tone }: { v: ReactNode; tone?: LitTone }) {
  if (!tone) return <>{v}</>
  const c = LIT[tone]
  return (
    <span className="inline-block rounded-md px-2 font-semibold" style={{ background: `${c}22`, color: c, boxShadow: `inset 0 0 0 1.5px ${c}66` }}>
      {v}
    </span>
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

/** An operation table: `sym` in the corner, `heads` both ways, `tone(a, b)` lights a cell. */
function OpTable({ sym, heads, f, tone, extra }: { sym: string; heads: number[]; f: (a: number, b: number) => ReactNode; tone?: (a: number, b: number) => LitTone | undefined; extra?: { label: string; cells: ReactNode[] } }) {
  return (
    <DataTable
      className="w-full"
      compact
      columns={[{ label: mh(sym), weight: 0.8 }, ...heads.map((h) => ({ label: String(h) })), ...(extra ? [{ label: extra.label, weight: 1.3 }] : [])]}
      rows={heads.map((a, i) => [<span className="font-semibold">{a}</span>, ...heads.map((b) => <Lit v={f(a, b)} tone={tone?.(a, b)} />), ...(extra ? [extra.cells[i]] : [])])}
    />
  )
}

const mod = (n: number) => (a: number, b: number) => (a * b) % n

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

/** One operation as a row: input → operation → result. */
const op = (key: string, input: string, sym: string, out: string, o: { iw?: number; mw?: number; ow?: number; state?: NodeState } = {}): Link[] => [
  { id: `${key}-in`, label: input, w: o.iw ?? 130 },
  { id: `${key}-op`, label: sym, m: true, w: o.mw ?? 80 },
  { id: `${key}-out`, label: out, w: o.ow ?? 100, state: o.state },
]
/** An expression and its value: two pills. */
const ev = (key: string, expr: string, val: string, o: { ew?: number; state?: NodeState } = {}): Link[] => [
  { id: `${key}-e`, label: expr, w: o.ew ?? 260 },
  { id: `${key}-v`, label: val, w: 100, state: o.state },
]

/** Rows of machines, one row per frame. */
function OpRows({ rows, width, rowGap = 78, labels, labelW = 0, gap = 48 }: { rows: Link[][]; width: number; rowGap?: number; labels?: string[]; labelW?: number; gap?: number }) {
  const frames: GraphFrame[] = rows.map((_, n) => ({
    nodes: rows.slice(0, n + 1).flatMap((r, i) => chainNodes(r, 36 + i * rowGap, labelW, gap)),
    edges: rows.slice(0, n + 1).flatMap((r) => chainEdges(r)),
    marks: labels ? labels.slice(0, n + 1).map((t, i) => ({ id: `l${i}`, node: rows[i][0].id, text: t, side: 'left' as const, tone: 'ink' as const })) : undefined,
  }))
  return <RelationGraph width={width} height={36 + (rows.length - 1) * rowGap + 40} frames={frames} />
}

/** Two inputs into one operation, one output. */
function TwoIn({ a, b, opLabel, out, width = 440, outState = 'ok' as NodeState }: { a: string; b: string; opLabel: string; out: string; width?: number; outState?: NodeState }) {
  return (
    <RelationGraph
      width={width}
      height={210}
      frames={[
        {
          nodes: [
            { id: 'a', x: 75, y: 50, label: a, w: 130 },
            { id: 'b', x: 75, y: 160, label: b, w: 130 },
            { id: 'op', x: 235, y: 105, label: opLabel, w: 120, state: 'lit' },
            { id: 'out', x: width - 75, y: 105, label: out, w: 130, state: outState },
          ],
          edges: [
            { id: 'e1', from: 'a', to: 'op' },
            { id: 'e2', from: 'b', to: 'op' },
            { id: 'e3', from: 'op', to: 'out' },
          ],
        },
      ]}
    />
  )
}

/* ── slides driven by one counter ────────────────────────────────────────── */

function SymmetricTable() {
  const k = useBuild(3)
  const pairs: [number, number][] = [
    [1, 2],
    [1, 3],
    [2, 3],
  ]
  const on = pairs.slice(0, k)
  return (
    <div className="grid w-full grid-cols-[1.1fr_1fr] items-center gap-8">
      <OpTable sym="×₄" heads={[0, 1, 2, 3]} f={mod(4)} tone={(a, b) => (on.some(([x, y]) => (a === x && b === y) || (a === y && b === x)) ? 'ok' : a === b ? 'brand' : undefined)} />
      <div className="space-y-3">
        <Callout kind="info" title="Main diagonal" asStep={false}>
          The cells a ×₄ a, from top left to bottom right
        </Callout>
        <Callout kind="success" title="Symmetric, so commutative" asStep={false}>
          Each cell matches its mirror across the diagonal
        </Callout>
      </div>
    </div>
  )
}

function InversesInTable() {
  const k = useBuild(4)
  const inv: Record<number, number> = { 1: 1, 2: 3, 3: 2, 4: 4 }
  return (
    <div className="grid w-full grid-cols-[1.2fr_1fr] items-center gap-8">
      <OpTable sym="×₅" heads={[1, 2, 3, 4]} f={(a, b) => (a * b) % 5} tone={(a, b) => (a <= k && b === inv[a] ? 'ok' : undefined)} />
      <div className="space-y-2">
        {[1, 2, 3, 4].map((a) => (
          <div key={a} className="h-[34px] font-heading text-[22px] font-semibold" style={{ color: colors.ink }}>
            {a <= k && (
              <Fresh>
                {a}⁻¹ = {inv[a]}
              </Fresh>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── the deck ────────────────────────────────────────────────────────────── */

export const algebraicSystemsDeck: SlideDef[] = [
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
          { title: C1, sub: 'Sets with operations, and closure' },
          { title: C2, sub: 'Grouping and order' },
          { title: C3, sub: 'The element that changes nothing' },
          { title: C4, sub: 'Getting back to the identity' },
          { title: C5, sub: 'a ∗ a = a' },
        ]}
      />
    ),
  },

  /* ── CONCEPT 1 (4MAT, five slides) ───────────────────────────────────── */
  { id: 'c1-divider', section: C1, label: 'Divider', element: <SectionBreakerSlide index={1} title={C1} lesson={SESSION} /> },
  {
    id: 'c1-pieces',
    section: C1,
    label: 'Pieces and Rules',
    element: (
      <ContentSlide
        kicker={C1}
        title="Pieces and Rules"
        lead="A board game is a set of pieces plus the rules for moving them"
        lesson={SESSION}
        points={[
          { text: 'Pieces: what we play with', icon: 'dot' },
          { text: 'Rules: what we may do with them', icon: 'book' },
        ]}
      >
        <TwoIn a="Pieces" b="Rules" opLabel="together" out="A game" />
      </ContentSlide>
    ),
    notes: 'The pieces are the set; the rule card is the operations.',
  },
  {
    id: 'c1-new-rules',
    section: C1,
    label: 'New Rules, New Game',
    element: (
      <ContentSlide
        kicker={C1}
        title="New Rules, New Game"
        lead="Change the pieces or the rules and you have a different game"
        lesson={SESSION}
        points={[
          { text: 'Same pieces, new rules: a new game', icon: 'dot' },
          { text: 'Same set, new operation: a new system', icon: 'target' },
        ]}
      >
        <TwoIn a="Same pieces" b="New rules" opLabel="together" out="New game" outState="lit" />
      </ContentSlide>
    ),
    notes: 'Added opening slide. (Z, +) and (Z, ×) share the set but are different systems, which the next slide shows.',
  },
  {
    id: 'c1-system',
    section: C1,
    label: 'Algebraic System',
    element: (
      <ContentSlide kicker={C1} title="Algebraic System" lead="A non-empty set S with one or more operations, written (S, f₁, f₂, …, fₖ)" lesson={SESSION}>
        <div className="w-full space-y-3">
          <DataTable
            className="w-full"
            stepped
            compact
            columns={[{ label: 'Algebraic system', weight: 1.3 }, { label: 'Underlying set', weight: 1.4 }, { label: 'Operations' }]}
            rows={[
              ['(Z, +)', 'Integers', 'Addition'],
              ['(Z, ×)', 'Integers', 'Multiplication'],
              ['({0, 1}, ∧, ∨)', '{0, 1}', 'AND, OR'],
              ['(Strings over {a, b}, ·)', 'All strings of a and b', 'Concatenation'],
            ]}
          />
          <Callout kind="info" title="Underlying set" asStep={false}>
            The set whose elements are combined, also called the carrier
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes: 'This recaps the Introduction session: "algebraic system" and "algebraic structure" mean the same thing; Tremblay and Manohar use "algebraic system". (Z, +) and (Z, ×) share an underlying set but are different systems. Ask: in adding times on a 12-hour clock, what are the underlying set and the operation?',
  },
  {
    id: 'c1-binary',
    section: C1,
    label: 'Binary Operations',
    element: (
      <ContentSlide kicker={C1} title="Binary Operations" lead="Every pair (a, b) gets exactly one a ∗ b, and it must be in S" lesson={SESSION}>
        <div className="grid w-full grid-cols-[0.9fr_1.4fr] items-center gap-8">
          <RelationGraph width={420} height={110} frames={[{ nodes: chainNodes(op('f', '(2, 3)', 'a + b + ab', '11', { iw: 90, mw: 140, ow: 70, state: 'ok' }), 50, 0, 40), edges: chainEdges(op('f', '(2, 3)', 'a + b + ab', '11')) }]} />
          <RevealTable
            columns={[{ label: 'Set and rule', weight: 1.3 }, { label: 'Closed?', weight: 0.6 }, { label: 'Reason', weight: 1.4 }]}
            rows={[
              ['Z, a + b + ab', 'Yes', 'Sums and products of integers are integers'],
              ['N, a − b', 'No', '2 − 5 = −3 ∉ N'],
              ['Even integers, ×', 'Yes', '(2m)(2n) = 2(2mn)'],
              ['{1, 2, 3}, +', 'No', '2 + 3 = 5'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '2 ∗ 3 = 2 + 3 + 6 = 11. "Every pair" rules out undefined cases: a ÷ b on Z is not a binary operation, since 1 ÷ 2 ∉ Z and 1 ÷ 0 has no value. "In S" is closure, covered in detail last session: one counterexample disproves it.',
  },
  {
    id: 'c1-tables',
    section: C1,
    label: 'Operation Tables',
    element: (
      <ContentSlide kicker={C1} title="Operation Tables" lead="S = {0, 1, 2, 3} with ×₄: a ×₄ b = remainder of a × b on division by 4" lesson={SESSION}>
        <div className="grid w-full grid-cols-[1.1fr_1fr] items-center gap-8">
          <OpTable sym="×₄" heads={[0, 1, 2, 3]} f={mod(4)} tone={(a, b) => (a === 2 && b === 3 ? 'ok' : undefined)} />
          <div className="space-y-3">
            <Callout kind="info" title="Row a, column b" asStep={false}>
              2 ×₄ 3 = 2, since 6 leaves remainder 2
            </Callout>
            <Callout kind="success" title="Closed" asStep={false}>
              Every entry is in S
            </Callout>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: 'Agree the convention now: a ∗ b is row a, column b. This table is used again to check commutativity, the identity, inverses and idempotent elements.',
  },

  /* ── CONCEPT 2: Associative and Commutative (Merrill) ────────────────── */
  { id: 'c2-divider', section: C2, label: 'Divider', element: <SectionBreakerSlide index={2} title={C2} lesson={SESSION} /> },
  {
    id: 'c2-bills',
    section: C2,
    label: 'Adding Three Bills',
    element: (
      <ContentSlide kicker={C2} title="Adding Three Bills" lead="Group the bills either way: the total is the same" lesson={SESSION}>
        <OpRows rows={[ev('a', '(₹100 + ₹50) + ₹20', '₹170', { state: 'ok' }), ev('b', '₹100 + (₹50 + ₹20)', '₹170', { state: 'ok' })]} width={760} labelW={190} labels={['First two first', 'Last two first']} />
      </ContentSlide>
    ),
    notes: 'Learners trust this for + and ×.',
  },
  {
    id: 'c2-break',
    section: C2,
    label: 'Grouping Can Break',
    element: (
      <ContentSlide kicker={C2} title="Grouping Can Break" lead="Try the same with subtraction" lesson={SESSION}>
        <OpRows rows={[ev('a', '(8 − 4) − 2', '2', { ew: 200 }), ev('b', '8 − (4 − 2)', '6', { ew: 200, state: 'warn' })]} width={700} labelW={190} labels={['First two first', 'Last two first']} />
      </ContentSlide>
    ),
    notes: 'Added opening slide. Same three numbers, different grouping, different answer: we need a name for operations where grouping never matters.',
  },
  {
    id: 'c2-associative',
    section: C2,
    label: 'Associative',
    element: (
      <ContentSlide kicker={C2} title="Associative" lead="(a ∗ b) ∗ c = a ∗ (b ∗ c) for all a, b, c ∈ S: grouping does not matter" lesson={SESSION}>
        <DataTable
          className="w-full"
          stepped
          compact
          columns={[{ label: 'Operation' }, { label: 'Associative?', weight: 0.7 }, { label: 'Why', weight: 1.8 }]}
          rows={[
            ['+ and × on Z', 'Yes', 'Any grouping gives the same result'],
            ['∪ and ∩, AND and OR', 'Yes', 'Any grouping gives the same result'],
            ['String concatenation', 'Yes', '(ab · c) · d = ab · (c · d)'],
            ['− on Z', 'No', '(8 − 4) − 2 = 2, but 8 − (4 − 2) = 6'],
            ['÷ on non-zero rationals', 'No', '(8 ÷ 4) ÷ 2 = 1, but 8 ÷ (4 ÷ 2) = 4'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Learners trust associativity for + and ×, and should be warned that − and ÷ do not have it.',
  },
  {
    id: 'c2-prove',
    section: C2,
    label: 'Proving Associativity',
    element: (
      <ContentSlide kicker={C2} title="Proving Associativity" lead="a ∗ b = a + b + ab on Z: expand both sides fully" lesson={SESSION}>
        <StepCards
          items={[
            ['(a ∗ b) ∗ c', '= (a + b + ab) + c + (a + b + ab)c = a + b + c + ab + ac + bc + abc'],
            ['a ∗ (b ∗ c)', '= a + (b + c + bc) + a(b + c + bc) = a + b + c + ab + ac + bc + abc'],
            ['Both sides are equal', 'So ∗ is associative'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'For a proof, expand both sides fully and compare term by term.',
  },
  {
    id: 'c2-disprove',
    section: C2,
    label: 'Disproving Associativity',
    element: (
      <ContentSlide kicker={C2} title="Disproving Associativity" lead="a ∗ b = a + 2b on Z: one counterexample is enough" lesson={SESSION}>
        <StepCards
          items={[
            ['(a ∗ b) ∗ c = a + 2b + 2c'],
            ['a ∗ (b ∗ c) = a + 2b + 4c'],
            ['a = b = 0, c = 1 gives 2 and 4', 'So ∗ is not associative'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'The general expansions show where the sides differ (2c against 4c); a single numerical counterexample finishes the job.',
  },
  {
    id: 'c2-commutative',
    section: C2,
    label: 'Commutative',
    element: (
      <ContentSlide kicker={C2} title="Commutative" lead="a ∗ b = b ∗ a for all a, b ∈ S: order does not matter" lesson={SESSION}>
        <DataTable
          className="w-full"
          stepped
          compact
          columns={[{ label: 'Operation' }, { label: 'Commutative?', weight: 0.7 }, { label: 'Why', weight: 1.8 }]}
          rows={[
            ['+ and × on Z, ∪ and ∩', 'Yes', 'Swapping gives the same result'],
            ['AND and OR, max(a, b)', 'Yes', 'Swapping gives the same result'],
            ['− on Z', 'No', '5 − 3 ≠ 3 − 5'],
            ['String concatenation', 'No', '"ab" · "cd" = "abcd", but "cd" · "ab" = "cdab"'],
            ['Matrix multiplication', 'No', 'AB and BA can differ'],
            ['a ∗ b = a + 2b', 'No', '1 ∗ 0 = 1, but 0 ∗ 1 = 2'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Ask: is putting on socks and then shoes commutative? No.',
  },
  {
    id: 'c2-symmetric',
    section: C2,
    label: 'Symmetric Table',
    element: (
      <ContentSlide kicker={C2} title="Symmetric Table" lead="Table test for commutativity: compare each cell with its mirror" lesson={SESSION}>
        <SymmetricTable />
      </ContentSlide>
    ),
    notes: 'Light the pairs one at a time: 1 ×₄ 2 and 2 ×₄ 1, then 1 and 3, then 2 and 3. The ×₄ table is symmetric, so ×₄ is commutative.',
  },
  {
    id: 'c2-independent',
    section: C2,
    label: 'Independent Properties',
    element: (
      <ContentSlide kicker={C2} title="Independent Properties" lead="Vote on each row: all four combinations happen" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Operation', weight: 1.2 }, { label: 'Associative?', weight: 1.6 }, { label: 'Commutative?', weight: 0.8 }]}
          rows={[
            ['+ on Z', 'Yes', 'Yes'],
            ['Concatenation of strings', 'Yes', 'No'],
            ['a ∗ b = |a − b| on Z', 'No: (1 ∗ 2) ∗ 3 = 2, but 1 ∗ (2 ∗ 3) = 0', 'Yes'],
            ['− on Z', 'No', 'No'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Learners often assume one property implies the other. This table shows that each must be checked separately.',
  },
  {
    id: 'c2-brackets',
    section: C2,
    label: 'Dropping Brackets',
    element: (
      <ContentSlide
        kicker={C2}
        title="Dropping Brackets"
        lead="Associativity is why we can write a + b + c with no brackets"
        lesson={SESSION}
        points={[
          { text: '+ and ×: a + b + c means one thing', icon: 'check' },
          { text: '− and ÷: the brackets decide the answer', icon: 'warning' },
        ]}
      />
    ),
    notes: 'Added Integration slide, from the associativity note.',
  },

  /* ── CONCEPT 3: Identity Element (Merrill) ───────────────────────────── */
  { id: 'c3-divider', section: C3, label: 'Divider', element: <SectionBreakerSlide index={3} title={C3} lesson={SESSION} /> },
  {
    id: 'c3-nothing',
    section: C3,
    label: 'Changing Nothing',
    element: (
      <ContentSlide kicker={C3} title="Changing Nothing" lead="Some elements leave every number unchanged" lesson={SESSION}>
        <OpRows rows={[op('p', '(7, 0)', '+', '7', { state: 'ok' }), op('t', '(7, 1)', '×', '7', { state: 'ok' })]} width={700} labelW={160} labels={['Adding 0', 'Multiplying by 1']} />
      </ContentSlide>
    ),
    notes: 'Added opening slide.',
  },
  {
    id: 'c3-not-zero',
    section: C3,
    label: 'Not Always 0',
    element: (
      <ContentSlide
        kicker={C3}
        title="Not Always 0"
        lead="Under a ∗ b = a + b − 3, try 0"
        lesson={SESSION}
        points={[
          { text: '5 ∗ 0 = 5 + 0 − 3 = 2', icon: 'cross' },
          { text: 'Here 0 changes things', icon: 'warning' },
          { text: 'Which element changes nothing?', icon: 'target' },
        ]}
      >
        <RelationGraph width={440} height={110} frames={[{ nodes: chainNodes(op('z', '(5, 0)', 'a + b − 3', '2', { iw: 90, mw: 130, ow: 70, state: 'warn' }), 50, 10, 40), edges: chainEdges(op('z', '(5, 0)', 'a + b − 3', '2')) }]} />
      </ContentSlide>
    ),
    notes: 'Added opening slide. The answer comes on the solving slide later in this concept: 3.',
  },
  {
    id: 'c3-identity',
    section: C3,
    label: 'Identity Element',
    element: (
      <ContentSlide kicker={C3} title="Identity Element" lead="e ∈ S is an identity for ∗ when e ∗ a = a ∗ e = a for every a ∈ S" lesson={SESSION}>
        <DataTable
          className="w-full"
          stepped
          compact
          columns={[{ label: 'System' }, { label: 'Identity' }]}
          rows={[
            ['(Z, +)', '0'],
            ['(Z, ×)', '1'],
            ['(P(S), ∪)', '∅'],
            ['(P(S), ∩)', 'S'],
            ['({0, 1}, ∧)', '1'],
            ['(Strings, concatenation)', 'The empty string ε'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Ask learners for the identity of OR on {0, 1}: it is 0, since 0 ∨ a = a.',
  },
  {
    id: 'c3-both-sides',
    section: C3,
    label: 'Both Sides',
    element: (
      <ContentSlide
        kicker={C3}
        title="Both Sides"
        lead="In (Z, −), try 0 on each side"
        lesson={SESSION}
        points={[
          { text: 'a − 0 = a: works on the right', icon: 'check' },
          { text: '0 − a ≠ a: fails on the left', icon: 'cross' },
          { text: 'So 0 is only a right identity, and (Z, −) has none', icon: 'warning' },
        ]}
      >
        <OpRows rows={[op('r', '(a, 0)', '−', 'a', { iw: 90, mw: 60, ow: 70, state: 'ok' }), op('l', '(0, a)', '−', '−a', { iw: 90, mw: 60, ow: 70, state: 'warn' })]} width={400} gap={40} />
      </ContentSlide>
    ),
    notes: 'One side is not enough: an identity must work from both sides.',
  },
  {
    id: 'c3-unique',
    section: C3,
    label: 'Only One Identity',
    element: (
      <ContentSlide kicker={C3} title="Only One Identity" lead="A system has at most one identity" lesson={SESSION}>
        <StepCards
          items={[
            ['Suppose e and e′ are both identities'],
            ['e ∗ e′ = e′', 'because e is an identity'],
            ['e ∗ e′ = e', 'because e′ is an identity'],
            ['So e = e′'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Walk through the argument slowly: e ∗ e′ equals e′ because e is an identity, and equals e because e′ is an identity.',
  },
  {
    id: 'c3-in-s',
    section: C3,
    label: 'Identity Must Be in S',
    element: (
      <ContentSlide
        kicker={C3}
        title="Identity Must Be in S"
        lead="Even integers under ×"
        lesson={SESSION}
        points={[
          { text: 'a × 1 = a for every even a', icon: 'check' },
          { text: 'But 1 is not even', icon: 'cross' },
          { text: 'So the even integers under × have no identity', icon: 'warning' },
        ]}
      >
        <RelationGraph
          width={440}
          height={180}
          frames={[
            {
              nodes: [
                ...['−2', '0', '2', '4'].map((v, i) => ({ id: `e${i}`, label: v, x: 60 + i * 70, y: 70 })),
                { id: 'one', label: '1', x: 380, y: 70, state: 'warn' as NodeState },
              ],
              groups: [{ id: 'even', nodes: ['e0', 'e1', 'e2', 'e3'] }],
              caption: 'Even integers, and 1 outside',
            },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'The candidate must belong to the underlying set.',
  },
  {
    id: 'c3-table',
    section: C3,
    label: 'Identity in a Table',
    element: (
      <ContentSlide kicker={C3} title="Identity in a Table" lead="Row of e repeats the column headings, and its column repeats the row headings" lesson={SESSION}>
        <div className="grid w-full grid-cols-[1.1fr_1fr] items-center gap-8">
          <OpTable sym="×₄" heads={[0, 1, 2, 3]} f={mod(4)} tone={(a, b) => (a === 1 || b === 1 ? 'ok' : undefined)} />
          <Callout kind="success" title="Identity of ×₄" asStep={false}>
            e = 1: row 1 reads 0, 1, 2, 3, and so does column 1
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes: 'This is the ×₄ table from the start of the session.',
  },
  {
    id: 'c3-solve',
    section: C3,
    label: 'Solving for e',
    element: (
      <ContentSlide kicker={C3} title="Solving for e" lead="a ∗ b = a + b − 3 on Z" lesson={SESSION}>
        <div className="w-full space-y-3">
          <StepCards
            items={[
              ['Need a ∗ e = a', 'a + e − 3 = a'],
              ['Solve', 'e = 3'],
            ]}
          />
          <Callout kind="success" title="Check the other side">
            3 ∗ a = 3 + a − 3 = a, so the identity is 3
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes: 'Solve for e, then check both sides.',
  },
  {
    id: 'c3-your-turn',
    section: C3,
    label: 'Your Turn',
    element: (
      <ContentSlide kicker={C3} title="Your Turn" lead="Find the identity, then check both sides" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'System', weight: 1.2 }, { label: 'Working', weight: 1.6 }, { label: 'Identity', weight: 0.6 }]}
          rows={[
            ['(Z, a ∗ b = a + b + ab)', 'a + e + ae = a for every a, so e(1 + a) = 0', '0'],
            ['({0, 1}, OR)', '0 ∨ a = a for a = 0 and a = 1', '0'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Check: 0 ∗ a = 0 + a + 0 = a.',
  },
  {
    id: 'c3-no-a',
    section: C3,
    label: 'e Cannot Depend on a',
    element: (
      <ContentSlide
        kicker={C3}
        title="e Cannot Depend on a"
        lead="One identity must work for every element at once"
        lesson={SESSION}
        points={[
          { text: 'Solve for e, then read the answer', icon: 'pencil' },
          { text: 'A number, such as e = 3: an identity', icon: 'check' },
          { text: 'An answer like e = a: no identity', icon: 'cross' },
        ]}
      />
    ),
    notes: 'Added Integration slide, from the solving note. The average (a + b)/2 near the end of the session is an example of e = a.',
  },
  { id: 'quiz-1', section: C3, label: 'Quiz Time', element: <QuizTimeSlide lesson={SESSION} /> },

  /* ── CONCEPT 4: Inverse Elements (Merrill) ───────────────────────────── */
  { id: 'c4-divider', section: C4, label: 'Divider', element: <SectionBreakerSlide index={4} title={C4} lesson={SESSION} /> },
  {
    id: 'c4-zero',
    section: C4,
    label: 'Back to Zero',
    element: (
      <ContentSlide kicker={C4} title="Back to Zero" lead="Under +, some pairs combine to the identity 0" lesson={SESSION}>
        <OpRows rows={[op('a', '(5, −5)', '+', '0', { state: 'ok' }), op('b', '(−3, 3)', '+', '0', { state: 'ok' })]} width={500} />
      </ContentSlide>
    ),
    notes: 'Each number has a partner that brings it back to 0.',
  },
  {
    id: 'c4-no-way',
    section: C4,
    label: 'No Way Back',
    element: (
      <ContentSlide
        kicker={C4}
        title="No Way Back"
        lead="In (Z, ×), the identity is 1"
        lesson={SESSION}
        points={[
          { text: '2 × ? = 1 has no integer answer', icon: 'cross' },
          { text: '1/2 is not in Z', icon: 'warning' },
        ]}
      >
        <RelationGraph width={440} height={110} frames={[{ nodes: chainNodes(op('n', '(2, ?)', '×', '1', { iw: 100, mw: 70, ow: 70 }), 50, 10, 50), edges: chainEdges(op('n', '(2, ?)', '×', '1')) }]} />
      </ContentSlide>
    ),
    notes: 'Added opening slide: some elements have no way back to the identity.',
  },
  {
    id: 'c4-inverse',
    section: C4,
    label: 'Inverse Element',
    element: (
      <ContentSlide
        kicker={C4}
        title="Inverse Element"
        lead="With identity e, b is an inverse of a when a ∗ b = b ∗ a = e"
        lesson={SESSION}
        points={[
          { text: 'Written b = a⁻¹', icon: 'pencil' },
          { text: 'Needs an identity first', icon: 'info' },
        ]}
      >
        <TwoIn a="a" b="a⁻¹" opLabel="∗" out="e" />
      </ContentSlide>
    ),
    notes: 'Inverses only make sense when an identity exists.',
  },
  {
    id: 'c4-which',
    section: C4,
    label: 'Which Have Inverses',
    element: (
      <ContentSlide kicker={C4} title="Which Have Inverses" lead="Some systems give every element an inverse, some only a few" lesson={SESSION}>
        <DataTable
          className="w-full"
          stepped
          compact
          columns={[{ label: 'System', weight: 1.1 }, { label: 'Identity', weight: 0.6 }, { label: 'Elements with inverses', weight: 1.8 }]}
          rows={[
            ['(Z, +)', '0', 'All: the inverse of a is −a'],
            ['(Q without 0, ×)', '1', 'All: the inverse of a is 1/a'],
            ['(Z, ×)', '1', 'Only 1 and −1'],
            ['(P(S), ∪)', '∅', 'Only ∅'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'The phrase "where applicable" in the syllabus matters: some systems have inverses for every element, some for only a few, and some have no identity at all.',
  },
  {
    id: 'c4-formula',
    section: C4,
    label: 'Inverses From a Formula',
    element: (
      <ContentSlide kicker={C4} title="Inverses From a Formula" lead="a ∗ b = a + b − 3 on Z, with identity e = 3" lesson={SESSION}>
        <StepCards
          items={[
            ['Need a ∗ x = 3', 'a + x − 3 = 3'],
            ['Solve', 'x = 6 − a, always an integer'],
            ['Every element has an inverse', '5⁻¹ = 1, since 5 ∗ 1 = 3'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Uses the identity found in the previous concept.',
  },
  {
    id: 'c4-fails',
    section: C4,
    label: 'When It Fails',
    element: (
      <ContentSlide kicker={C4} title="When It Fails" lead="a ∗ b = a + b + ab on Z, with identity e = 0" lesson={SESSION}>
        <div className="grid w-full grid-cols-[1.4fr_1fr] items-center gap-8">
          <StepCards
            items={[
              ['Need a + x + ax = 0', 'x = −a/(1 + a)'],
              ['An integer only for a = 0 and a = −2', 'a = −1 has no solution at all'],
              ['Check', '(−2) ∗ (−2) = −4 + 4 = 0'],
            ]}
          />
          <DataTable
            className="w-full"
            compact
            columns={[{ label: mh('a') }, { label: mh('x = −a/(1 + a)'), weight: 1.6 }]}
            rows={[
              ['0', <Lit v="0" tone="ok" />],
              ['1', '−1/2'],
              ['2', '−2/3'],
              ['−2', <Lit v="−2" tone="ok" />],
              ['−3', '−3/2'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: 'The inverse formula exists, but its value must lie in the underlying set.',
  },
  {
    id: 'c4-table',
    section: C4,
    label: 'Inverses in a Table',
    element: (
      <ContentSlide kicker={C4} title="Inverses in a Table" lead="S = {1, 2, 3, 4} with ×₅; the identity is 1: find 1 in each row" lesson={SESSION}>
        <InversesInTable />
      </ContentSlide>
    ),
    notes: 'Each row contains the identity 1 exactly once, so every element has an inverse.',
  },
  {
    id: 'c4-your-turn',
    section: C4,
    label: 'Your Turn',
    element: (
      <ContentSlide kicker={C4} title="Your Turn" lead="×₄ on {0, 1, 2, 3}, identity 1: which rows contain 1?" lesson={SESSION}>
        <RevealTable
          keep={5}
          columns={[{ label: mh('×₄'), weight: 0.8 }, { label: '0' }, { label: '1' }, { label: '2' }, { label: '3' }, { label: 'Inverse', weight: 1.3 }]}
          rows={[0, 1, 2, 3].map((a) => [<span className="font-semibold">{a}</span>, ...[0, 1, 2, 3].map((b) => <Lit v={(a * b) % 4} tone={(a * b) % 4 === 1 ? 'ok' : undefined} />), a === 1 ? '1' : a === 3 ? '3' : 'None'])}
        />
      </ContentSlide>
    ),
    notes: 'Rows 0 and 2 contain no 1, so 0 and 2 have no inverses under ×₄. Compare with ×₅, where every row has one.',
  },
  {
    id: 'c4-all-some',
    section: C4,
    label: 'All, Some or None',
    element: (
      <ContentSlide kicker={C4} title="All, Some or None" lead="Inverses exist only where applicable" lesson={SESSION}>
        <StepCards
          items={[
            ['Every element', '(Z, +), (Q without 0, ×), ×₅ on {1, 2, 3, 4}'],
            ['Only some elements', '(Z, ×): only 1 and −1'],
            ['Not applicable', '(Z, −) has no identity, so no inverses to look for'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Added Integration slide, from the "where applicable" note.',
  },

  /* ── CONCEPT 5: Idempotent Property (4MAT) ───────────────────────────── */
  { id: 'c5-divider', section: C5, label: 'Divider', element: <SectionBreakerSlide index={5} title={C5} lesson={SESSION} /> },
  {
    id: 'c5-twice',
    section: C5,
    label: 'Pressing Twice',
    element: (
      <ContentSlide kicker={C5} title="Pressing Twice" lead="Pressing a lift's call button twice does not call two lifts" lesson={SESSION}>
        <TwoIn a="press" b="press again" opLabel="lift button" out="one lift" width={560} />
      </ContentSlide>
    ),
    notes: 'Pressing it again has no further effect.',
  },
  {
    id: 'c5-pay',
    section: C5,
    label: 'Paying Twice',
    element: (
      <ContentSlide kicker={C5} title="Paying Twice" lead="Clicking Pay now twice must not charge twice" lesson={SESSION}>
        <TwoIn a="click Pay" b="click Pay" opLabel="payment" out="one charge" width={560} />
      </ContentSlide>
    ),
    notes: 'Added opening slide, from the speaker note: a well-designed payment request has this property.',
  },
  {
    id: 'c5-idempotent',
    section: C5,
    label: 'Idempotent',
    element: (
      <ContentSlide
        kicker={C5}
        title="Idempotent"
        lead="An element a is idempotent when a ∗ a = a"
        lesson={SESSION}
        points={[
          { text: 'The operation ∗ is idempotent when every element is', icon: 'check' },
          { text: 'A ∪ A = A for every set A', icon: 'dot' },
        ]}
      >
        <RelationGraph width={440} height={110} frames={[{ nodes: chainNodes(op('i', '(A, A)', '∪', 'A', { iw: 100, mw: 70, ow: 70, state: 'ok' }), 50, 10, 50), edges: chainEdges(op('i', '(A, A)', '∪', 'A')) }]} />
      </ContentSlide>
    ),
    notes: 'Combined with itself, the element gives itself back.',
  },
  {
    id: 'c5-examples',
    section: C5,
    label: 'Examples',
    element: (
      <ContentSlide kicker={C5} title="Examples" lead="Idempotent operations, and two that are not" lesson={SESSION}>
        <DataTable
          className="w-full"
          stepped
          compact
          columns={[{ label: 'Operation' }, { label: 'Idempotent?', weight: 0.7 }, { label: 'Why', weight: 1.5 }]}
          rows={[
            ['∪ and ∩', 'Yes', 'A ∪ A = A and A ∩ A = A'],
            ['AND and OR', 'Yes', 'a ∧ a = a and a ∨ a = a'],
            ['max and min', 'Yes', 'max(a, a) = a'],
            ['+ on Z', 'No', 'Only 0 + 0 = 0'],
            ['× on Z', 'No', 'Only 0 and 1'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'An operation is idempotent only if every element is.',
  },
  {
    id: 'c5-diagonal',
    section: C5,
    label: 'Diagonal Test',
    element: (
      <ContentSlide kicker={C5} title="Diagonal Test" lead="×₆ on {0, …, 5}: a is idempotent where the diagonal repeats the heading" lesson={SESSION}>
        <div className="grid w-full grid-cols-[1.5fr_1fr] items-center gap-8">
          <OpTable sym="×₆" heads={[0, 1, 2, 3, 4, 5]} f={mod(6)} tone={(a, b) => (a === b ? ((a * a) % 6 === a ? 'ok' : 'warn') : undefined)} />
          <Callout kind="success" title="Idempotent elements" asStep={false}>
            Diagonal 0, 1, 4, 3, 4, 1 matches at 0, 1, 3 and 4
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes: '3 × 3 = 9 leaves remainder 3, and 4 × 4 = 16 leaves remainder 4. Learners are often surprised that 3 and 4 qualify.',
  },
  {
    id: 'c5-find',
    section: C5,
    label: 'Find Them',
    element: (
      <ContentSlide kicker={C5} title="Find Them" lead="Look along the diagonal, or solve a ∗ a = a" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'System', weight: 1.4 }, { label: 'Diagonal', weight: 1.2 }, { label: 'Idempotent elements' }]}
          rows={[
            ['({0, 1, 2, 3}, ×₄)', '0, 1, 0, 1', '0, 1'],
            ['({0, 1, 2, 3, 4, 5}, ×₆)', '0, 1, 4, 3, 4, 1', '0, 1, 3, 4'],
            ['(Z, a ∗ b = a + b − 3)', 'a ∗ a = 2a − 3', 'Only 3'],
            ['(P(S), ∪)', 'A ∪ A = A', 'Every element'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'For a formula, solve a ∗ a = a: 2a − 3 = a gives a = 3.',
  },

  /* ── CONCEPT 6: Examples and Verification (Merrill) ──────────────────── */
  { id: 'c6-divider', section: C6, label: 'Divider', element: <SectionBreakerSlide index={6} title={C6} lesson={SESSION} /> },
  {
    id: 'c6-six',
    section: C6,
    label: 'Six Checks',
    element: (
      <ContentSlide kicker={C6} title="Six Checks" lead="Everything this session can ask of a system" lesson={SESSION}>
        <StepCards
          cols={2}
          items={[
            ['Closure', 'a ∗ b ∈ S'],
            ['Associative', 'Grouping does not matter'],
            ['Commutative', 'Order does not matter'],
            ['Identity', 'An element that changes nothing'],
            ['Inverses', 'A way back to the identity'],
            ['Idempotent', 'a ∗ a = a'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Added opening slide.',
  },
  {
    id: 'c6-order',
    section: C6,
    label: 'Order Matters',
    element: (
      <ContentSlide
        kicker={C6}
        title="Order Matters"
        lead="Some checks depend on others"
        lesson={SESSION}
        points={[
          { text: 'Without closure, ∗ is not an operation at all', icon: 'warning' },
          { text: 'Inverses cannot be checked before an identity is found', icon: 'cross' },
        ]}
      />
    ),
    notes: 'Added opening slide, from the verification note.',
  },
  {
    id: 'c6-glance',
    section: C6,
    label: 'Properties at a Glance',
    element: (
      <ContentSlide kicker={C6} title="Properties at a Glance" lead="Each property, its condition and its table test" lesson={SESSION}>
        <DataTable
          className="w-full"
          stepped
          compact
          columns={[{ label: 'Property', weight: 0.8 }, { label: 'Condition', weight: 1.3 }, { label: 'Operation table test', weight: 1.7 }]}
          rows={[
            ['Closure', 'a ∗ b ∈ S', 'Every entry is in S'],
            ['Associative', '(a ∗ b) ∗ c = a ∗ (b ∗ c)', 'No quick test: check triples'],
            ['Commutative', 'a ∗ b = b ∗ a', 'Symmetric about the main diagonal'],
            ['Identity e', 'e ∗ a = a ∗ e = a', 'A row and a column that repeat the headings'],
            ['Inverse of a', 'a ∗ b = b ∗ a = e', 'e in row a at column b, and in row b at column a'],
            ['Idempotent', 'a ∗ a = a', 'Diagonal repeats the headings'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'This is the revision slide. Associativity has no visual shortcut in a table: in principle every triple must be checked.',
  },
  {
    id: 'c6-familiar',
    section: C6,
    label: 'Familiar Systems',
    element: (
      <ContentSlide kicker={C6} title="Familiar Systems" lead="All are closed; they differ in the other properties" lesson={SESSION}>
        <DataTable
          className="w-full"
          stepped
          compact
          columns={[{ label: 'System', weight: 1.4 }, { label: 'Associative', weight: 0.9 }, { label: 'Commutative', weight: 0.9 }, { label: 'Identity', weight: 0.7 }, { label: 'Inverses for all', weight: 1.2 }, { label: 'Idempotent', weight: 0.8 }]}
          rows={[
            ['(Z, +)', 'Yes', 'Yes', '0', 'Yes', 'No'],
            ['(Z, ×)', 'Yes', 'Yes', '1', 'No: only ±1', 'No'],
            ['(Z, −)', 'No', 'No', 'None', 'Not applicable', 'No'],
            ['(P(S), ∪)', 'Yes', 'Yes', '∅', 'No: only ∅', 'Yes'],
            ['({0, 1}, ∧)', 'Yes', 'Yes', '1', 'No: 0 has none', 'Yes'],
            ['(Strings, concatenation)', 'Yes', 'No', 'ε', 'No: only ε', 'No'],
            ['(N, max)', 'Yes', 'Yes', '0', 'No: only 0', 'Yes'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'All of these are closed, so all are algebraic systems. Later sessions name systems by these properties.',
  },
  {
    id: 'c6-non',
    section: C6,
    label: 'Non-Examples',
    element: (
      <ContentSlide kicker={C6} title="Non-Examples" lead="Where the definition fails before any property is checked" lesson={SESSION}>
        <DataTable
          className="w-full"
          stepped
          compact
          columns={[{ label: 'Set and rule' }, { label: 'What goes wrong', weight: 2 }]}
          rows={[
            ['N with −', 'Not closed: 2 − 5 = −3'],
            ['Z with ÷', 'Not closed (1 ÷ 2 ∉ Z), and undefined for division by 0'],
            ['Odd integers with +', 'Not closed: 1 + 3 = 4'],
            ['{0, 1} with ordinary +', 'Not closed: 1 + 1 = 2'],
            ['Q with ÷', 'Undefined for division by 0'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'These fail before any property can be checked: the rule is not a binary operation on the set.',
  },
  {
    id: 'c6-formula',
    section: C6,
    label: 'Verifying a Formula',
    element: (
      <ContentSlide kicker={C6} title="Verifying a Formula" lead="(Z, ∗) with a ∗ b = a + b − 3, one property per press" lesson={SESSION}>
        <RevealTable
          keep={2}
          columns={[{ label: 'Property', weight: 0.8 }, { label: 'Working', weight: 1.8 }, { label: 'Result', weight: 1.1 }]}
          rows={[
            ['Closure', 'a + b − 3 is an integer', 'Yes'],
            ['Associative', 'Both groupings give a + b + c − 6', 'Yes'],
            ['Commutative', 'a + b − 3 = b + a − 3', 'Yes'],
            ['Identity', 'a + e − 3 = a gives e = 3', '3'],
            ['Inverses', 'a + x − 3 = 3 gives x = 6 − a', 'Every element'],
            ['Idempotent', '2a − 3 = a only when a = 3', 'No, only 3'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Follow this order in every exam answer. Write each working line out in full on the board.',
  },
  {
    id: 'c6-table',
    section: C6,
    label: 'Verifying a Table',
    element: (
      <ContentSlide kicker={C6} title="Verifying a Table" lead="S = {x, y} with the operation table on the left" lesson={SESSION}>
        <div className="grid w-full grid-cols-[0.6fr_1.6fr] items-center gap-6">
          <DataTable
            className="w-full"
            compact
            columns={[{ label: mh('∗') }, { label: mh('x') }, { label: mh('y') }]}
            rows={[
              [<span className="font-semibold">x</span>, 'y', 'y'],
              [<span className="font-semibold">y</span>, 'y', 'x'],
            ]}
          />
          <RevealTable
            keep={2}
            columns={[{ label: 'Property', weight: 0.8 }, { label: 'Check', weight: 2.2 }, { label: 'Result', weight: 0.6 }]}
            rows={[
              ['Closure', 'Every entry is x or y', 'Yes'],
              ['Commutative', 'x ∗ y = y ∗ x = y', 'Yes'],
              ['Associative', '(x ∗ x) ∗ y = y ∗ y = x, but x ∗ (x ∗ y) = x ∗ y = y', 'No'],
              ['Identity', 'Neither row repeats the headings', 'None'],
              ['Idempotent', 'x ∗ x = y and y ∗ y = x', 'No'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: 'This system is closed and commutative but not associative. Inverses do not apply, since there is no identity.',
  },
  {
    id: 'c6-average',
    section: C6,
    label: 'The Average',
    element: (
      <ContentSlide kicker={C6} title="The Average" lead="(Q, ∗) with a ∗ b = (a + b)/2" lesson={SESSION}>
        <RevealTable
          keep={2}
          columns={[{ label: 'Property', weight: 0.8 }, { label: 'Check', weight: 1.9 }, { label: 'Result', weight: 0.9 }]}
          rows={[
            ['Closure', 'The average of two rationals is rational', 'Yes'],
            ['Commutative', '(a + b)/2 = (b + a)/2', 'Yes'],
            ['Associative', '(0 ∗ 0) ∗ 4 = 2, but 0 ∗ (0 ∗ 4) = 1', 'No'],
            ['Identity', '(a + e)/2 = a gives e = a, which depends on a', 'None'],
            ['Idempotent', '(a + a)/2 = a', 'Yes, every element'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'A good example of an idempotent operation on numbers, and of the "e = a" failure. On a number line: 0 and 4 average to 2; 0 and 2 average to 1.',
  },
  {
    id: 'c6-your-turn',
    section: C6,
    label: 'Your Turn',
    element: (
      <ContentSlide kicker={C6} title="Your Turn" lead="(Z, ∗) with a ∗ b = a + b + 1: work it out, then reveal" lesson={SESSION}>
        <StepCards
          cols={2}
          items={[
            ['Closure: yes', 'a + b + 1 is an integer'],
            ['Associative: yes', 'Both groupings give a + b + c + 2'],
            ['Commutative: yes', 'a + b + 1 = b + a + 1'],
            ['Identity: −1', 'a + e + 1 = a gives e = −1'],
            ['Inverses: every element', 'x = −a − 2, so 3⁻¹ = −5'],
            ['Idempotent: no', '2a + 1 = a only when a = −1'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Give learners five minutes on paper. Check one inverse: 3 ∗ (−5) = 3 − 5 + 1 = −1, the identity.',
  },
  {
    id: 'c6-exam-order',
    section: C6,
    label: 'Exam Order',
    element: (
      <ContentSlide kicker={C6} title="Exam Order" lead="Check a system in this order, every time" lesson={SESSION}>
        <StepCards
          cols={2}
          items={[
            ['Closure'],
            ['Associative'],
            ['Commutative'],
            ['Identity'],
            ['Inverses', 'only if an identity exists'],
            ['Idempotent'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Added Integration slide, from the verification note.',
  },

  /* ── CLOSING ─────────────────────────────────────────────────────────── */
  { id: 'quiz-2', section: 'Closing', label: 'Quiz Time', element: <QuizTimeSlide lesson={SESSION} /> },
  { id: 'takeaways', section: 'Closing', label: 'Key Takeaways', element: <KeyTakeawaysSlide title={SESSION} lesson={SESSION} points={TAKEAWAYS} />, notes: 'The TR\'s five takeaway items (user, at sign-off).' },
  { id: 'feedback', section: 'Closing', label: 'Feedback', element: <FeedbackSlide lesson={SESSION} formless />, notes: 'No form and no QR (content rule 41 as amended 2026-11-21). Ask for feedback out loud.' },
  { id: 'thank-you', section: 'Closing', label: 'Thank you', element: <ThankYouSlide title="Thank You" lesson={SESSION} /> },
  { id: 'all-the-best', section: 'Closing', label: 'All the best', element: <ThankYouSlide title="All the Best" lesson={SESSION} /> },
]
