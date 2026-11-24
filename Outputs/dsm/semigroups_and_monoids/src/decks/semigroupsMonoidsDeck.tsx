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
 * SEMIGROUPS AND MONOIDS (DSM).
 *
 * Built from the signed-off plan at
 *   Outputs/dsm/session_plans/semigroups_and_monoids/plan.md
 * the source of truth for order, framework and wording. Every result on these
 * slides was recomputed by `verify_tr.py` beside the plan.
 *
 * Five concepts: Semigroups (4MAT), Monoids (4MAT), Semigroup or Monoid?
 * (Merrill), Subsemigroups and Submonoids (Merrill), Homomorphisms (Merrill).
 * Published as a claude.ai Artifact with the kit's Editor controls.
 */

const SESSION = 'Semigroups and Monoids'
const C1 = 'Semigroups'
const C2 = 'Monoids'
const C3 = 'Semigroup or Monoid?'
const C4 = 'Subsemigroups and Submonoids'
const C5 = 'Homomorphisms'
const AGENDA = [C1, C2, C3, C4, C5]

export const semigroupsMonoidsMeta: DeckMeta = {
  title: SESSION,
  course: 'DSM',
  lesson: SESSION,
  presenter: 'NxtWave Instructor',
  player: { autoHideControls: true },
}

/* ── shared helpers (as in the Algebraic Systems deck) ───────────────────── */

function useBuild(n: number): number {
  return useClaimedSteps(n).filter(Boolean).length
}

/** A table header that is maths keeps its case: DataTable uppercases headers. */
const mh = (s: string) => <span className="normal-case tracking-normal">{s}</span>
const EASE = [0.22, 1, 0.36, 1] as const

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
function OpTable<H extends string | number>({ sym, heads, f, tone }: { sym: string; heads: H[]; f: (a: H, b: H) => ReactNode; tone?: (a: H, b: H) => LitTone | undefined }) {
  return (
    <DataTable
      className="w-full"
      compact
      columns={[{ label: mh(sym), weight: 0.8 }, ...heads.map((h) => ({ label: mh(String(h)) }))]}
      rows={heads.map((a) => [<span className="font-semibold">{a}</span>, ...heads.map((b) => <Lit v={f(a, b)} tone={tone?.(a, b)} />)])}
    />
  )
}
const mod = (n: number) => (a: number, b: number) => (a * b) % n

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

/* ── machines and pictures ───────────────────────────────────────────────── */

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
const chainEdges = (items: Link[]): GraphEdge[] => items.slice(1).map((it, i) => ({ id: `${items[i].id}>${it.id}`, from: items[i].id, to: it.id }))
const op = (key: string, input: string, sym: string, out: string, o: { iw?: number; mw?: number; ow?: number; state?: NodeState } = {}): Link[] => [
  { id: `${key}-in`, label: input, w: o.iw ?? 120 },
  { id: `${key}-op`, label: sym, m: true, w: o.mw ?? 80 },
  { id: `${key}-out`, label: out, w: o.ow ?? 90, state: o.state },
]

function OpRows({ rows, width, rowGap = 78, labels, labelW = 0, gap = 48 }: { rows: Link[][]; width: number; rowGap?: number; labels?: string[]; labelW?: number; gap?: number }) {
  const frames: GraphFrame[] = rows.map((_, n) => ({
    nodes: rows.slice(0, n + 1).flatMap((r, i) => chainNodes(r, 36 + i * rowGap, labelW, gap)),
    edges: rows.slice(0, n + 1).flatMap((r) => chainEdges(r)),
    marks: labels ? labels.slice(0, n + 1).map((t, i) => ({ id: `l${i}`, node: rows[i][0].id, text: t, side: 'left' as const, tone: 'ink' as const })) : undefined,
  }))
  return <RelationGraph width={width} height={36 + (rows.length - 1) * rowGap + 40} frames={frames} />
}

/** A set as an oval of dots, and elements that land outside it. */
function SetPicture({ inside, outside = [], edges = [], width, height, caption, states = {} }: { inside: { id: string; label: string; x: number; y: number }[]; outside?: { id: string; label: string; x: number; y: number; state?: NodeState }[]; edges?: [string, string][]; width: number; height: number; caption?: ReactNode; states?: Record<string, NodeState> }) {
  const outIds = new Set(outside.map((o) => o.id))
  const nodes: GraphNode[] = [...inside, ...outside].map((n) => ({ ...n, w: n.label.length > 2 ? 22 + n.label.length * 11 : undefined, state: states[n.id] ?? (outIds.has(n.id) ? ('warn' as NodeState) : 'plain') }))
  return (
    <RelationGraph
      width={width}
      height={height}
      frames={[{ nodes, groups: [{ id: 'set', nodes: inside.map((n) => n.id) }], edges: edges.map(([a, b]) => ({ id: `${a}>${b}`, from: a, to: b, tone: outIds.has(b) ? 'warn' : 'ok' })), caption }]}
    />
  )
}

/**
 * THE SQUARE: combine then map (top, then right) against map then combine
 * (left, then bottom). One frame shows the corners, the next the top route,
 * the last the bottom route, so the room sees both reach the same corner.
 */
function Square({ tl, tr, bl, br, top, right, left, bottom, width = 680, captions }: { tl: string; tr: string; bl: string; br: string; top: string; right: string; left: string; bottom: string; width?: number; captions: [ReactNode, ReactNode, ReactNode] }) {
  /* Each route's operation is a pill in the middle of its side, like the machines elsewhere in this deck. */
  const w = (s: string) => Math.max(70, 26 + s.length * 11)
  const L = 105
  const R = width - 105
  const M = width / 2
  const nodes = (top1: boolean, bottom1: boolean): GraphNode[] => [
    { id: 'tl', x: L, y: 40, label: tl, w: w(tl), state: top1 || bottom1 ? 'lit' : 'plain' },
    { id: 'tr', x: R, y: 40, label: tr, w: w(tr), state: top1 ? 'lit' : 'plain' },
    { id: 'bl', x: L, y: 250, label: bl, w: w(bl), state: bottom1 ? 'lit' : 'plain' },
    { id: 'br', x: R, y: 250, label: br, w: w(br), state: top1 || bottom1 ? 'ok' : 'plain' },
    { id: 'mt', x: M, y: 40, label: top, w: w(top), state: top1 ? 'lit' : 'muted' },
    { id: 'mr', x: R, y: 145, label: right, w: w(right), state: top1 ? 'lit' : 'muted' },
    { id: 'ml', x: L, y: 145, label: left, w: w(left), state: bottom1 ? 'lit' : 'muted' },
    { id: 'mb', x: M, y: 250, label: bottom, w: w(bottom), state: bottom1 ? 'lit' : 'muted' },
  ]
  const e = (id: string, from: string, to: string, on: boolean): GraphEdge => ({ id, from, to, tone: on ? 'ok' : 'muted' })
  const edges = (top1: boolean, bottom1: boolean): GraphEdge[] => [
    e('t1', 'tl', 'mt', top1), e('t2', 'mt', 'tr', top1), e('r1', 'tr', 'mr', top1), e('r2', 'mr', 'br', top1),
    e('l1', 'tl', 'ml', bottom1), e('l2', 'ml', 'bl', bottom1), e('b1', 'bl', 'mb', bottom1), e('b2', 'mb', 'br', bottom1),
  ]
  return (
    <RelationGraph
      width={width}
      height={290}
      frames={[
        { nodes: nodes(false, false), edges: edges(false, false), caption: captions[0] },
        { nodes: nodes(true, false), edges: edges(true, false), caption: captions[1] },
        { nodes: nodes(true, true), edges: edges(true, true), caption: captions[2] },
      ]}
    />
  )
}

/** Two steps of a staircase: the lower one always named, the upper one named when `upper` is given. */
function Staircase({ upper }: { upper?: string }) {
  return (
    <RelationGraph
      width={440}
      height={200}
      frames={[
        {
          nodes: [
            { id: 's1', x: 130, y: 150, label: 'Semigroup', w: 150, state: upper ? 'plain' : 'lit' },
            { id: 's2', x: 320, y: 60, label: upper ?? 'next step', w: 150, state: upper ? 'lit' : 'ghost' },
          ],
          edges: [{ id: 'up', from: 's1', to: 's2', tone: upper ? 'ok' : 'muted' }],
          marks: [
            { id: 'm1', node: 's1', text: 'closure, associativity', side: 'below', tone: 'ink' },
            ...(upper ? [{ id: 'm2', node: 's2', text: '+ identity', side: 'below' as const, tone: 'ok' as const }] : []),
          ],
        },
      ]}
    />
  )
}

/* ── the deck ────────────────────────────────────────────────────────────── */

export const semigroupsMonoidsDeck: SlideDef[] = [
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
          { title: C1, sub: 'Closure and associativity' },
          { title: C2, sub: 'Adding an identity' },
          { title: C3, sub: 'Telling them apart' },
          { title: C4, sub: 'Structures inside structures' },
          { title: C5, sub: 'Maps that keep the operation' },
        ]}
      />
    ),
  },

  /* ── CONCEPT 1: Semigroups (4MAT) ────────────────────────────────────── */
  { id: 'c1-divider', section: C1, label: 'Divider', element: <SectionBreakerSlide index={1} title={C1} lesson={SESSION} /> },
  {
    id: 'c1-checks',
    section: C1,
    label: 'Checks So Far',
    element: (
      <ContentSlide kicker={C1} title="Checks So Far" lead="Last session we checked these properties one by one" lesson={SESSION}>
        <StepCards
          cols={2}
          items={[
            ['Closure', 'a ∗ b stays in S'],
            ['Associativity', 'Grouping does not matter'],
            ['Identity', 'An element that changes nothing'],
            ['Inverses', 'A way back to the identity'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'A quick recap from the Algebraic Systems session.',
  },
  {
    id: 'c1-names',
    section: C1,
    label: 'Names for Patterns',
    element: (
      <ContentSlide
        kicker={C1}
        title="Names for Patterns"
        lead="Systems that pass the same checks share a name"
        lesson={SESSION}
        points={[
          { text: "A learner's licence needs fewer tests than a permanent one", icon: 'book' },
          { text: 'Each structure name is earned by passing certain checks', icon: 'check' },
        ]}
      >
        <Staircase />
      </ContentSlide>
    ),
    notes: 'Driving licences come in levels. Each structure name is a licence earned by passing certain property tests. Groups, which add inverses, come in a later session.',
  },
  {
    id: 'c1-semigroup',
    section: C1,
    label: 'Semigroup',
    element: (
      <ContentSlide kicker={C1} title="Semigroup" lead="A non-empty set S with a binary operation ∗ that is closed and associative" lesson={SESSION}>
        <DataTable
          className="w-full"
          stepped
          compact
          columns={[{ label: 'Property', weight: 1.2 }, { label: 'Needed?', weight: 0.7 }, { label: 'Condition', weight: 1.6 }]}
          rows={[
            ['Closure', <Lit v="Yes" tone="ok" />, 'a ∗ b ∈ S for all a, b ∈ S'],
            ['Associativity', <Lit v="Yes" tone="ok" />, '(a ∗ b) ∗ c = a ∗ (b ∗ c)'],
            ['Identity, inverses', 'No', 'Not required'],
            ['Commutativity', 'No', '∗ need not be commutative'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"Semi" suggests "half a group": a semigroup has only part of what a group needs.',
  },
  {
    id: 'c1-brackets',
    section: C1,
    label: 'Brackets Can Be Dropped',
    element: (
      <ContentSlide kicker={C1} title="Brackets Can Be Dropped" lead="In a semigroup, a₁ ∗ a₂ ∗ … ∗ aₙ has one value, however it is bracketed" lesson={SESSION}>
        <div className="w-full space-y-3">
          <DataTable
            className="w-full"
            stepped
            compact
            columns={[{ label: 'Bracketing in (Z, +)', weight: 1.6 }, { label: 'Value', weight: 0.6 }]}
            rows={[
              ['(2 + 3) + (4 + 5)', '14'],
              ['((2 + 3) + 4) + 5', '14'],
              ['2 + (3 + (4 + 5))', '14'],
            ]}
          />
          <Callout kind="info" title="And closure" asStep={false}>
            Every result stays in S, so the semigroup never leaks outside it
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes: 'Without associativity, a ∗ b ∗ c would be ambiguous. This is why associativity is the defining property of a semigroup.',
  },
  {
    id: 'c1-powers',
    section: C1,
    label: 'Powers',
    element: (
      <ContentSlide kicker={C1} title="Powers" lead="Associativity makes powers of an element well defined" lesson={SESSION}>
        <div className="w-full space-y-3">
          <StepCards
            items={[
              ['aⁿ = a ∗ a ∗ … ∗ a', 'n times, no brackets needed'],
              ['aᵐ ∗ aⁿ = aᵐ⁺ⁿ'],
              ['(aᵐ)ⁿ = aᵐⁿ'],
            ]}
          />
          <Callout kind="note" title="In (Z, +)">
            a³ means a + a + a = 3a, and a² ∗ a³ = 2a + 3a = 5a, which is a⁵
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes: 'Without associativity even a² ∗ a would need brackets.',
  },
  {
    id: 'c1-examples',
    section: C1,
    label: 'Examples',
    element: (
      <ContentSlide kicker={C1} title="Examples" lead="Semigroups are everywhere" lesson={SESSION}>
        <DataTable
          className="w-full"
          stepped
          compact
          columns={[{ label: 'Semigroup', weight: 1.1 }, { label: 'Operation', weight: 1.3 }, { label: 'Comment', weight: 1.7 }]}
          rows={[
            ['(Z, +), (Z, ×)', 'Addition, multiplication', 'Closed and associative'],
            ['(Z⁺, +)', 'Addition on positive integers', 'No identity, since 0 ∉ Z⁺'],
            ['(P(S), ∪), (P(S), ∩)', 'Union, intersection', 'Associative set operations'],
            ['(Σ⁺, ·)', 'Joining non-empty strings', 'Associative, not commutative'],
            ['(Z, max)', 'Larger of a and b', 'max(max(a, b), c) = max(a, max(b, c))'],
            ['(S, a ∗ b = a)', 'Keep the first', 'Both groupings give a'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Σ⁺ means all strings of length at least 1 over an alphabet Σ. "Keep the first" works on any non-empty set and has no identity.',
  },
  {
    id: 'c1-non',
    section: C1,
    label: 'Non-Examples',
    element: (
      <ContentSlide kicker={C1} title="Non-Examples" lead="Which condition fails?" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'System', weight: 1.2 }, { label: 'Fails', weight: 0.8 }, { label: 'Reason', weight: 2.2 }]}
          rows={[
            ['(N, −)', 'Closure', '2 − 5 = −3 ∉ N'],
            ['(Z, −)', 'Associativity', '(8 − 4) − 2 = 2, but 8 − (4 − 2) = 6'],
            ['(Z, a ∗ b = ab + 1)', 'Associativity', '(a ∗ b) ∗ c = abc + c + 1, but a ∗ (b ∗ c) = abc + a + 1'],
            ['(Q, a ∗ b = (a + b)/2)', 'Associativity', '(0 ∗ 0) ∗ 4 = 2, but 0 ∗ (0 ∗ 4) = 1'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'For the third row, pick a = 0, c = 1, b anything: the two sides give 2 and 1. One counterexample is enough.',
  },
  {
    id: 'c1-verify',
    section: C1,
    label: 'Verifying a Semigroup',
    element: (
      <ContentSlide kicker={C1} title="Verifying a Semigroup" lead="(Z, ∗) with a ∗ b = a + b + ab" lesson={SESSION}>
        <StepCards
          items={[
            ['Closure', 'a + b + ab is an integer for all integers a, b'],
            ['Associativity', 'Both groupings expand to a + b + c + ab + ac + bc + abc'],
            ['So (Z, ∗) is a semigroup'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Exam answers should state both properties explicitly.',
  },
  {
    id: 'c1-finite',
    section: C1,
    label: 'Finite Semigroup',
    element: (
      <ContentSlide kicker={C1} title="Finite Semigroup" lead="({0, 1, 2, 3}, ×₄): multiplication modulo 4" lesson={SESSION}>
        <div className="grid w-full grid-cols-[1.1fr_1fr] items-center gap-8">
          <OpTable sym="×₄" heads={[0, 1, 2, 3]} f={mod(4)} />
          <div className="space-y-3">
            <Callout kind="success" title="Closed" asStep={false}>
              Every entry is in the set
            </Callout>
            <Callout kind="success" title="Associative" asStep={false}>
              Inherited from ordinary multiplication
            </Callout>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: 'For modulo operations, learners may quote that associativity is inherited from ordinary + or ×. Notice row 1 of this table: it matters in the next concept.',
  },

  /* ── CONCEPT 2: Monoids (4MAT) ───────────────────────────────────────── */
  { id: 'c2-divider', section: C2, label: 'Divider', element: <SectionBreakerSlide index={2} title={C2} lesson={SESSION} /> },
  {
    id: 'c2-zero',
    section: C2,
    label: 'Adding Zero',
    element: (
      <ContentSlide kicker={C2} title="Adding Zero" lead="On a calculator, adding 0 changes nothing" lesson={SESSION}>
        <OpRows rows={[op('a', '(7, 0)', '+', '7', { state: 'ok' }), op('b', '(0, 12)', '+', '12', { state: 'ok' })]} width={500} />
      </ContentSlide>
    ),
    notes: 'A do-nothing element is what upgrades a semigroup.',
  },
  {
    id: 'c2-no-zero',
    section: C2,
    label: 'No Zero Available',
    element: (
      <ContentSlide
        kicker={C2}
        title="No Zero Available"
        lead="(Z⁺, +) is a semigroup, but 0 is not in Z⁺"
        lesson={SESSION}
        points={[
          { text: 'Adding any positive integer changes the number', icon: 'cross' },
          { text: 'No element of Z⁺ leaves everything unchanged', icon: 'warning' },
        ]}
      >
        <SetPicture width={440} height={180} inside={['1', '2', '3', '4'].map((v, i) => ({ id: `p${v}`, label: v, x: 60 + i * 70, y: 70 }))} outside={[{ id: 'z', label: '0', x: 380, y: 70 }]} caption="Z⁺, and 0 outside it" />
      </ContentSlide>
    ),
    notes: 'Added opening slide, from the (Z⁺, +) example.',
  },
  {
    id: 'c2-monoid',
    section: C2,
    label: 'Monoid',
    element: (
      <ContentSlide
        kicker={C2}
        title="Monoid"
        lead="A semigroup (M, ∗) with an identity e: e ∗ a = a ∗ e = a for all a ∈ M"
        lesson={SESSION}
        points={[
          { text: 'Three properties: closure, associativity, identity', icon: 'check' },
          { text: 'Written (M, ∗, e)', icon: 'pencil' },
        ]}
      >
        <Staircase upper="Monoid" />
      </ContentSlide>
    ),
    notes: 'The identity is written into the notation (M, ∗, e) because it is part of what makes the structure a monoid.',
  },
  {
    id: 'c2-identity',
    section: C2,
    label: 'Both Sides, Only One',
    element: (
      <ContentSlide kicker={C2} title="Both Sides, Only One" lead="What a monoid's identity must do" lesson={SESSION}>
        <StepCards
          items={[
            ['Work on both sides', 'e ∗ a = a and a ∗ e = a'],
            ['Be the only one', 'If e and e′ are both identities, e = e ∗ e′ = e′'],
            ['Belong to M itself'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Remind learners of the one-sided case from last session: 0 works on the right for subtraction but not on the left.',
  },
  {
    id: 'c2-table',
    section: C2,
    label: 'Identity in a Table',
    element: (
      <ContentSlide kicker={C2} title="Identity in a Table" lead="Row and column of e repeat the headings" lesson={SESSION}>
        <div className="grid w-full grid-cols-[1.1fr_1fr] items-center gap-8">
          <OpTable sym="×₄" heads={[0, 1, 2, 3]} f={mod(4)} tone={(a, b) => (a === 1 || b === 1 ? 'ok' : undefined)} />
          <Callout kind="success" title="A monoid" asStep={false}>
            Row 1 and column 1 read 0, 1, 2, 3, so 1 is the identity
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes: 'The same ×₄ table as the end of the previous concept.',
  },
  {
    id: 'c2-examples',
    section: C2,
    label: 'Examples of Monoids',
    element: (
      <ContentSlide kicker={C2} title="Examples of Monoids" lead="Spot the identity in each" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Monoid', weight: 2 }, { label: 'Identity', weight: 1.2 }]}
          rows={[
            ['(N, +)', '0'],
            ['(Z, ×)', '1'],
            ['(Σ∗, ·): all strings, the empty one included', 'Empty string ε'],
            ['(P(S), ∪)', '∅'],
            ['(P(S), ∩)', 'S'],
            ['({0, 1}, ∧)', '1'],
            ['(2 × 2 real matrices, ×)', 'Identity matrix I'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Ask learners to name each identity before it is revealed. (Z⁺, max), with identity 1, follows on the next slide.',
  },
  {
    id: 'c2-max-min',
    section: C2,
    label: 'Max and Min',
    element: (
      <ContentSlide kicker={C2} title="Max and Min" lead="Same set Z⁺, two operations" lesson={SESSION}>
        <div className="w-full space-y-4">
          <OpRows rows={[op('x', '(1, 7)', 'max', '7', { state: 'ok' }), op('n', '(?, 7)', 'min', '7', { state: 'warn' })]} width={700} labelW={150} labels={['(Z⁺, max)', '(Z⁺, min)']} />
          <Callout kind="warning" title="No identity for min">
            It would have to be the largest positive integer, and there is none
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes: '(Z⁺, max) has identity 1: max(1, a) = a for every positive integer a.',
  },
  {
    id: 'c2-functions',
    section: C2,
    label: 'Functions Under Composition',
    element: (
      <ContentSlide kicker={C2} title="Functions Under Composition" lead="All functions from {1, 2} to itself; row f, column g holds f ∘ g" lesson={SESSION}>
        <div className="grid w-full grid-cols-[0.8fr_1.3fr] items-center gap-6">
          <DataTable
            className="w-full"
            compact
            columns={[{ label: 'Name' }, { label: mh('(f(1), f(2))'), weight: 1.4 }]}
            rows={[
              ['i', '(1, 2)'],
              ['c₁', '(1, 1)'],
              ['c₂', '(2, 2)'],
              ['s', '(2, 1)'],
            ]}
          />
          <div className="space-y-3">
            <OpTable
              sym="∘"
              heads={['i', 'c₁', 'c₂', 's']}
              f={(a, b) => ({ i: { i: 'i', 'c₁': 'c₁', 'c₂': 'c₂', s: 's' }, 'c₁': { i: 'c₁', 'c₁': 'c₁', 'c₂': 'c₁', s: 'c₁' }, 'c₂': { i: 'c₂', 'c₁': 'c₂', 'c₂': 'c₂', s: 'c₂' }, s: { i: 's', 'c₁': 'c₂', 'c₂': 'c₁', s: 'i' } } as Record<string, Record<string, string>>)[a][b]}
              tone={(a, b) => (a === 'i' || b === 'i' ? 'ok' : undefined)}
            />
            <Callout kind="success" title="A monoid" asStep={false}>
              Closed, associative, and i is the identity
            </Callout>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: 'Check one entry together: s ∘ c₁ sends 1 to s(1) = 2 and 2 to s(1) = 2, so it is c₂. Composition is always associative. This monoid is not commutative: s ∘ c₁ = c₂ but c₁ ∘ s = c₁.',
  },

  /* ── CONCEPT 3: Semigroup or Monoid? (Merrill) ───────────────────────── */
  { id: 'c3-divider', section: C3, label: 'Divider', element: <SectionBreakerSlide index={3} title={C3} lesson={SESSION} /> },
  {
    id: 'c3-labels',
    section: C3,
    label: 'Two Labels',
    element: (
      <ContentSlide kicker={C3} title="Two Labels" lead="Every system so far is a semigroup; some are also monoids" lesson={SESSION}>
        <StepCards
          cols={2}
          items={[
            ['Semigroup', 'Closure, associativity'],
            ['Monoid', 'Closure, associativity, identity'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Added opening slide.',
  },
  {
    id: 'c3-missing',
    section: C3,
    label: 'Adding What Is Missing',
    element: (
      <ContentSlide kicker={C3} title="Adding What Is Missing" lead="(Z⁺, +) becomes the monoid (N, +) once 0 is added" lesson={SESSION}>
        <RelationGraph
          width={600}
          height={200}
          frames={[
            {
              nodes: [...['1', '2', '3'].map((v, i) => ({ id: `n${v}`, label: v, x: 230 + i * 70, y: 80 })), { id: 'z', label: '0', x: 70, y: 80, state: 'warn' as NodeState }],
              groups: [{ id: 'g', nodes: ['n1', 'n2', 'n3'] }],
              caption: 'Z⁺: a semigroup, 0 outside',
            },
            {
              nodes: [...['1', '2', '3'].map((v, i) => ({ id: `n${v}`, label: v, x: 230 + i * 70, y: 80 })), { id: 'z', label: '0', x: 160, y: 80, state: 'ok' as NodeState }],
              groups: [{ id: 'g', nodes: ['z', 'n1', 'n2', 'n3'], tone: 'ok' }],
              caption: 'N: 0 inside, so a monoid',
            },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Added opening slide, from the note on the difference: adding the missing identity often turns a semigroup into a monoid.',
  },
  {
    id: 'c3-difference',
    section: C3,
    label: 'The Difference',
    element: (
      <ContentSlide kicker={C3} title="The Difference" lead="One extra requirement" lesson={SESSION}>
        <DataTable
          className="w-full"
          stepped
          compact
          columns={[{ label: 'Feature', weight: 1.3 }, { label: 'Semigroup' }, { label: 'Monoid', weight: 1.2 }]}
          rows={[
            ['Closure', 'Required', 'Required'],
            ['Associativity', 'Required', 'Required'],
            ['Identity element', 'Not required', <Lit v="Required" tone="ok" />],
            ['Notation', '(S, ∗)', '(M, ∗, e)'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'The identity is the only difference.',
  },
  {
    id: 'c3-nested',
    section: C3,
    label: 'Every Monoid Is a Semigroup',
    element: (
      <ContentSlide
        kicker={C3}
        title="Every Monoid Is a Semigroup"
        lead="But not every semigroup is a monoid"
        lesson={SESSION}
        points={[
          { text: 'Monoids: (N, +), (Z, ×)', icon: 'check' },
          { text: 'Only semigroups: (Z⁺, +), (Σ⁺, ·), evens under ×', icon: 'dot' },
        ]}
      >
        <RelationGraph
          width={440}
          height={250}
          frames={[
            {
              nodes: [
                { id: 'm1', label: '(N, +)', x: 90, y: 90, w: 90, state: 'ok' },
                { id: 'm2', label: '(Z, ×)', x: 90, y: 170, w: 90, state: 'ok' },
                { id: 's1', label: '(Z⁺, +)', x: 300, y: 60, w: 100 },
                { id: 's2', label: '(Σ⁺, ·)', x: 300, y: 130, w: 100 },
                { id: 's3', label: 'evens, ×', x: 300, y: 200, w: 110 },
              ],
              groups: [
                { id: 'all', nodes: ['m1', 'm2', 's1', 's2', 's3'] },
                { id: 'mon', nodes: ['m1', 'm2'], tone: 'ok' },
              ],
            },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Outer oval: semigroups. Inner oval: monoids. The even integers under × have no identity: the only candidate, 1, is odd. Keep-the-first, a ∗ b = a on a set of two or more elements, is another semigroup that is not a monoid.',
  },
  {
    id: 'c3-test',
    section: C3,
    label: 'Three-Step Test',
    element: (
      <ContentSlide kicker={C3} title="Three-Step Test" lead="Check in this order" lesson={SESSION}>
        <StepCards
          items={[
            ['Closure?', 'No: neither'],
            ['Associativity?', 'No: neither'],
            ['Identity?', 'Yes: a monoid; no: only a semigroup'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'This order matters: there is no point looking for an identity in a system that is not associative.',
  },
  {
    id: 'c3-formulas',
    section: C3,
    label: 'Classifying Formulas',
    element: (
      <ContentSlide kicker={C3} title="Classifying Formulas" lead="Apply the three steps to each system" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'System', weight: 1.7 }, { label: 'Closed?', weight: 0.7 }, { label: 'Associative?', weight: 0.9 }, { label: 'Identity', weight: 0.9 }, { label: 'Result', weight: 0.9 }]}
          rows={[
            ['(Z, a ∗ b = a + b − 3)', 'Yes', 'Yes', '3', 'Monoid'],
            ['(R, a ∗ b = a + b − ab)', 'Yes', 'Yes', '0', 'Monoid'],
            ['(Z⁺, max)', 'Yes', 'Yes', '1', 'Monoid'],
            ['(Z⁺, min)', 'Yes', 'Yes', 'None', 'Semigroup'],
            ['(Even integers, ×)', 'Yes', 'Yes', 'None', 'Semigroup'],
            ['(Z, a ∗ b = 2a + 2b)', 'Yes', 'No', 'Not checked', 'Neither'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'For the last row: (a ∗ b) ∗ c = 4a + 4b + 2c but a ∗ (b ∗ c) = 2a + 4b + 4c. For the second row, both groupings give a + b + c − ab − ac − bc + abc.',
  },
  {
    id: 'c3-surprise',
    section: C3,
    label: 'A Surprising Monoid',
    element: (
      <ContentSlide kicker={C3} title="A Surprising Monoid" lead="({0, 2, 4}, ×₆): multiplication modulo 6" lesson={SESSION}>
        <div className="grid w-full grid-cols-[1fr_1fr] items-center gap-8">
          <OpTable sym="×₆" heads={[0, 2, 4]} f={mod(6)} tone={(a, b) => (a === 4 || b === 4 ? 'ok' : undefined)} />
          <div className="space-y-3">
            <Callout kind="success" title="Identity 4" asStep={false}>
              Row 4 and column 4 repeat the headings
            </Callout>
            <Callout kind="info" title="Not 1" asStep={false}>
              1 is not even in the set
            </Callout>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: 'Closed: every entry is 0, 2 or 4. Associativity is inherited from multiplication modulo 6. Check: 4 × 2 = 8 leaves remainder 2; 4 × 4 = 16 leaves remainder 4. The identity is whatever element behaves like one.',
  },
  {
    id: 'c3-your-turn',
    section: C3,
    label: 'Your Turn',
    element: (
      <ContentSlide kicker={C3} title="Your Turn" lead="Semigroup, monoid or neither? Vote, then reveal" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'System', weight: 1.4 }, { label: 'Answer', weight: 0.8 }, { label: 'Reason', weight: 1.6 }]}
          rows={[
            ['(Z, a ∗ b = a + b + 1)', 'Monoid', 'Associative; identity −1'],
            ['(Σ∗, ·)', 'Monoid', 'Identity is the empty string'],
            ['(N, a ∗ b = a)', 'Semigroup', 'Associative; no identity'],
            ['(Z, −)', 'Neither', 'Not associative'],
            ['({0, 1}, ∨)', 'Monoid', 'Identity 0'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'For (Z, a ∗ b = a + b + 1): both groupings give a + b + c + 2; the identity solves a + e + 1 = a, so e = −1.',
  },
  {
    id: 'c3-order',
    section: C3,
    label: 'Order of Checks',
    element: (
      <ContentSlide
        kicker={C3}
        title="Order of Checks"
        lead="Closure, then associativity, then identity"
        lesson={SESSION}
        points={[
          { text: 'A failed closure or associativity ends the test: neither', icon: 'cross' },
          { text: 'Only then is it worth looking for an identity', icon: 'target' },
        ]}
      />
    ),
    notes: 'Added Integration slide, from the note on the three-step test.',
  },
  { id: 'quiz-1', section: C3, label: 'Quiz Time', element: <QuizTimeSlide lesson={SESSION} /> },

  /* ── CONCEPT 4: Subsemigroups and Submonoids (Merrill) ───────────────── */
  { id: 'c4-divider', section: C4, label: 'Divider', element: <SectionBreakerSlide index={4} title={C4} lesson={SESSION} /> },
  {
    id: 'c4-inside',
    section: C4,
    label: 'A Set Inside a Set',
    element: (
      <ContentSlide kicker={C4} title="A Set Inside a Set" lead="Even integers sit inside (Z, +), and even + even stays even" lesson={SESSION}>
        <RelationGraph
          width={600}
          height={190}
          frames={[
            {
              nodes: [
                ...['−2', '0', '2'].map((v, i) => ({ id: `e${i}`, label: v, x: 90 + i * 70, y: 90, state: 'ok' as NodeState })),
                ...['−1', '1', '3'].map((v, i) => ({ id: `o${i}`, label: v, x: 360 + i * 70, y: 90 })),
              ],
              groups: [
                { id: 'z', nodes: ['e0', 'e1', 'e2', 'o0', 'o1', 'o2'] },
                { id: 'ev', nodes: ['e0', 'e1', 'e2'], tone: 'ok' },
              ],
              caption: 'Z, with the even integers inside it',
            },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Added opening slide.',
  },
  {
    id: 'c4-question',
    section: C4,
    label: 'What Must Be Checked?',
    element: (
      <ContentSlide kicker={C4} title="What Must Be Checked?" lead="For a smaller set inside a semigroup" lesson={SESSION}>
        <Callout kind="note" title="Question" asStep={false}>
          Must every property be checked again for the smaller set?
        </Callout>
      </ContentSlide>
    ),
    notes: 'Added opening slide. Let learners guess before the definition.',
  },
  {
    id: 'c4-subsemigroup',
    section: C4,
    label: 'Subsemigroup',
    element: (
      <ContentSlide kicker={C4} title="Subsemigroup" lead="Non-empty T ⊆ S, closed under ∗: then (T, ∗) is a subsemigroup of (S, ∗)" lesson={SESSION}>
        <DataTable
          className="w-full"
          stepped
          compact
          columns={[{ label: 'Subset', weight: 1.1 }, { label: 'Inside', weight: 0.8 }, { label: 'Why closed', weight: 1.6 }]}
          rows={[
            ['Even integers', '(Z, +)', 'Even + even is even'],
            ['Z⁺', '(Z, +)', 'A sum of positives is positive'],
            ['{0, 1}', '(Z, ×)', 'Every product is 0 or 1'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Only closure needs checking. The next slide explains why associativity comes for free.',
  },
  {
    id: 'c4-inherited',
    section: C4,
    label: 'Associativity Is Inherited',
    element: (
      <ContentSlide kicker={C4} title="Associativity Is Inherited" lead="True in S, so true in T" lesson={SESSION}>
        <StepCards
          items={[
            ['Associativity holds for all a, b, c ∈ S'],
            ['Elements of T are elements of S', 'So it holds for all a, b, c ∈ T too'],
            ['A closed non-empty subset of a semigroup is a semigroup'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'So the answer to the question is no: only closure needs checking.',
  },
  {
    id: 'c4-odd',
    section: C4,
    label: 'Odd Integers Fail',
    element: (
      <ContentSlide
        kicker={C4}
        title="Odd Integers Fail"
        lead="Odd integers inside (Z, +)"
        lesson={SESSION}
        points={[
          { text: '1 + 3 = 4, which is even', icon: 'cross' },
          { text: 'Not closed, so not a subsemigroup', icon: 'warning' },
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
    notes: 'Closure is the one property a subset must earn for itself.',
  },
  {
    id: 'c4-submonoid',
    section: C4,
    label: 'Submonoid',
    element: (
      <ContentSlide kicker={C4} title="Submonoid" lead="T ⊆ M is a submonoid of (M, ∗, e) when T is closed and contains e" lesson={SESSION}>
        <DataTable
          className="w-full"
          stepped
          compact
          columns={[{ label: 'Subset', weight: 1.1 }, { label: 'Monoid', weight: 0.9 }, { label: 'Why', weight: 1.7 }]}
          rows={[
            ['N', '(Z, +, 0)', 'Closed, and holds 0'],
            ['Even integers', '(Z, +, 0)', 'Closed, and 0 is even'],
            ['{1, −1}', '(Z, ×, 1)', 'Closed, and holds 1'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'The extra condition is easy to forget: a submonoid must contain the same identity as the big monoid, not just some identity of its own.',
  },
  {
    id: 'c4-own',
    section: C4,
    label: 'Its Own Identity',
    element: (
      <ContentSlide kicker={C4} title="Its Own Identity" lead="Closed, but missing the identity of M" lesson={SESSION}>
        <div className="w-full space-y-3">
          <RevealTable
            columns={[{ label: 'Subset of monoid', weight: 1.7 }, { label: 'Closed?', weight: 0.6 }, { label: mh('Identity of M in it?'), weight: 1.1 }, { label: 'Submonoid?', weight: 1.1 }]}
            rows={[
              ['Z⁺ in (N, +, 0)', 'Yes', 'No: 0 ∉ Z⁺', 'Only a subsemigroup'],
              ['{0} in (Z, ×, 1)', 'Yes', 'No: 1 ∉ {0}', 'Only a subsemigroup'],
              ['{0, 2, 4} in ({0, …, 5}, ×₆, 1)', 'Yes', 'No: 1 ∉ {0, 2, 4}', 'Only a subsemigroup'],
            ]}
          />
          <Callout kind="warning" title="Exam trap">
            {'({0}, ×) and ({0, 2, 4}, ×₆) are monoids on their own, with identities 0 and 4, but not submonoids'}
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes: 'This is the classic exam trap: {0, 2, 4} is a monoid with identity 4, yet not a submonoid of the ×₆ monoid on {0, …, 5}, whose identity is 1.',
  },
  {
    id: 'c4-your-turn',
    section: C4,
    label: 'Your Turn',
    element: (
      <ContentSlide kicker={C4} title="Your Turn" lead="Subsets of (Z, ×, 1): subsemigroup? submonoid?" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Subset', weight: 1 }, { label: 'Subsemigroup?', weight: 1.3 }, { label: 'Submonoid?', weight: 1.2 }]}
          rows={[
            ['{1, −1}', 'Yes', 'Yes'],
            ['{−1, 0, 1}', 'Yes', 'Yes'],
            ['Odd integers', 'Yes: odd × odd is odd', 'Yes: 1 is odd'],
            ['Even integers', 'Yes', 'No: 1 is not even'],
            ['{0}', 'Yes', 'No'],
            ['{2}', 'No: 2 × 2 = 4', 'No'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Remind learners to check closure first; if closure fails, the subset is neither.',
  },
  {
    id: 'c4-inherit',
    section: C4,
    label: 'Inherited or Not',
    element: (
      <ContentSlide kicker={C4} title="Inherited or Not" lead="What a subset gets from the bigger structure" lesson={SESSION}>
        <StepCards
          items={[
            ['Associativity', 'Always passes down'],
            ['Commutativity', 'Always passes down'],
            ['Identity', 'May be missing from the subset'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Added Integration slide, from the inheritance note.',
  },

  /* ── CONCEPT 5: Homomorphisms (Merrill) ──────────────────────────────── */
  { id: 'c5-divider', section: C5, label: 'Divider', element: <SectionBreakerSlide index={5} title={C5} lesson={SESSION} /> },
  {
    id: 'c5-lengths',
    section: C5,
    label: 'Lengths Add Up',
    element: (
      <ContentSlide kicker={C5} title="Lengths Add Up" lead="Join two strings, or add their lengths: both routes reach 8" lesson={SESSION}>
        <Square
          tl="(data, base)"
          tr="database"
          bl="(4, 4)"
          br="8"
          top="join"
          right="length"
          left="lengths"
          bottom="add"
          captions={['Two routes from the same start', 'Join, then measure: 8', 'Measure, then add: 4 + 4 = 8']}
        />
      </ContentSlide>
    ),
    notes: 'Joining "data" and "base" gives "database" of length 8, and adding the lengths 4 + 4 also gives 8.',
  },
  {
    id: 'c5-translation',
    section: C5,
    label: 'A Good Translation',
    element: (
      <ContentSlide
        kicker={C5}
        title="A Good Translation"
        lead="A good translation keeps the meaning"
        lesson={SESSION}
        points={[
          { text: 'Translate the combined sentence', icon: 'arrow' },
          { text: 'Or translate the parts and combine them', icon: 'arrow' },
          { text: 'Both give the same meaning', icon: 'check' },
        ]}
      />
    ),
    notes: 'The same idea as the string lengths: two routes, one result.',
  },
  {
    id: 'c5-idea',
    section: C5,
    label: 'Homomorphism',
    element: (
      <ContentSlide kicker={C5} title="Homomorphism" lead="A map between systems where combine then map equals map then combine" lesson={SESSION}>
        <Square
          tl="(a, b)"
          tr="a ∗ b"
          bl="(f(a), f(b))"
          br="f(a ∗ b)"
          top="∗"
          right="f"
          left="f"
          bottom="∘"
          captions={['Start from a pair', 'Combine, then map: f(a ∗ b)', 'Map, then combine: f(a) ∘ f(b), the same corner']}
        />
      </ContentSlide>
    ),
    notes: 'The word comes from Greek: "homo" (same) and "morph" (shape). A homomorphism keeps the shape of the operation.',
  },
  {
    id: 'c5-semigroup-hom',
    section: C5,
    label: 'Semigroup Homomorphism',
    element: (
      <ContentSlide
        kicker={C5}
        title="Semigroup Homomorphism"
        lead="f: (S, ∗) → (T, ∘) with f(a ∗ b) = f(a) ∘ f(b) for all a, b ∈ S"
        lesson={SESSION}
        points={[
          { text: '∗ on the left is in S; ∘ on the right is in T', icon: 'info' },
          { text: 'Length L: (Σ⁺, ·) → (Z⁺, +)', sub: 'L(xy) = L(x) + L(y)', icon: 'check' },
        ]}
      />
    ),
    notes: 'Stress which operation is used on which side. A common slip is to use the same symbol on both sides when the two systems have different operations.',
  },
  {
    id: 'c5-parity',
    section: C5,
    label: 'The Parity Map',
    element: (
      <ContentSlide kicker={C5} title="The Parity Map" lead="f: (Z, +) → ({0, 1}, +₂), f(a) = remainder of a on division by 2" lesson={SESSION}>
        <RevealTable
          keep={2}
          columns={[{ label: mh('a, b'), weight: 0.8 }, { label: mh('f(a + b)'), weight: 1 }, { label: mh('f(a) +₂ f(b)'), weight: 1.2 }]}
          rows={[
            ['3, 5', 'f(8) = 0', '1 +₂ 1 = 0'],
            ['2, 7', 'f(9) = 1', '0 +₂ 1 = 1'],
            ['4, 6', 'f(10) = 0', '0 +₂ 0 = 0'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'The parity of a sum is the sum of the parities, modulo 2.',
  },
  {
    id: 'c5-monoid-hom',
    section: C5,
    label: 'Monoid Homomorphism',
    element: (
      <ContentSlide kicker={C5} title="Monoid Homomorphism" lead="f: (M, ∗, e) → (T, ∘, e′) needs two conditions" lesson={SESSION}>
        <div className="w-full space-y-3">
          <StepCards items={[['f(a ∗ b) = f(a) ∘ f(b)', 'for all a, b ∈ M'], ['f(e) = e′', 'identity goes to identity']]} />
          <Callout kind="success" title="Example">
            Length L: (Σ∗, ·, ε) → (N, +, 0), with L(xy) = L(x) + L(y) and L(ε) = 0
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes: 'The second condition is what the monoid adds.',
  },
  {
    id: 'c5-powers',
    section: C5,
    label: 'Powers of 2',
    element: (
      <ContentSlide kicker={C5} title="Powers of 2" lead="f(x) = 2ˣ from (R, +, 0) to (R⁺, ×, 1)" lesson={SESSION}>
        <div className="w-full space-y-3">
          <StepCards items={[['2ˣ⁺ʸ = 2ˣ × 2ʸ', 'addition becomes multiplication'], ['2⁰ = 1', 'identity goes to identity']]} />
          <Callout kind="info" title="Logarithm tables">
            They use the reverse map, turning multiplication into addition
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes: 'The exponential example is the reason logarithm tables worked: they turn multiplication into addition, and its inverse turns addition into multiplication.',
  },
  {
    id: 'c5-zero-map',
    section: C5,
    label: 'The Zero Map',
    element: (
      <ContentSlide
        kicker={C5}
        title="The Zero Map"
        lead="f: (Z, ×, 1) → (Z, ×, 1), f(a) = 0 for every a"
        lesson={SESSION}
        points={[
          { text: 'f(ab) = 0 = f(a) × f(b)', sub: 'A semigroup homomorphism', icon: 'check' },
          { text: 'f(1) = 0 ≠ 1', sub: 'Not a monoid homomorphism', icon: 'cross' },
        ]}
      >
        <RelationGraph
          width={440}
          height={230}
          frames={[
            {
              nodes: [
                ...['−1', '1', '2'].map((v, i) => ({ id: `a${i}`, label: v, x: 90, y: 50 + i * 65 })),
                { id: 'z', label: '0', x: 330, y: 80, state: 'warn' as NodeState },
                { id: 'one', label: '1', x: 330, y: 170, state: 'muted' as NodeState },
              ],
              edges: [0, 1, 2].map((i) => ({ id: `e${i}`, from: `a${i}`, to: 'z', tone: 'warn' as const })),
              marks: [{ id: 'm', node: 'one', text: 'never reached', side: 'right', tone: 'ink' }],
            },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Every element is sent to 0, so the identity 1 on the right is never reached.',
  },
  {
    id: 'c5-onto',
    section: C5,
    label: 'Onto Maps Keep e',
    element: (
      <ContentSlide kicker={C5} title="Onto Maps Keep e" lead="An onto semigroup homomorphism between monoids sends e to e′" lesson={SESSION}>
        <StepCards
          items={[
            ['Take any t in T', 'Onto, so t = f(a) for some a'],
            ['f(e) ∘ t = f(e ∗ a) = f(a) = t'],
            ['Same on the right', 'So f(e) is the identity of T'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'A useful fact: the zero map fails it because it is not onto.',
  },
  {
    id: 'c5-checks',
    section: C5,
    label: 'Worked Checks',
    element: (
      <ContentSlide kicker={C5} title="Worked Checks" lead="Test the defining equation with a = 2, b = 3" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Function', weight: 1.6 }, { label: 'Check', weight: 1.6 }, { label: 'Result', weight: 1.2 }]}
          rows={[
            ['f(x) = 3x on (Z, +, 0)', 'f(5) = 15 = 6 + 9; f(0) = 0', 'Monoid homomorphism'],
            ['g(x) = x + 1 on (Z, +)', 'g(5) = 6, but g(2) + g(3) = 7', 'Not a homomorphism'],
            ['h(n) = 2ⁿ, (N, +, 0) → (N, ×, 1)', '2⁵ = 32 = 4 × 8; 2⁰ = 1', 'Monoid homomorphism'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'One failing pair is enough to disprove: g(5) = 6, but g(2) + g(3) = 3 + 4 = 7.',
  },
  {
    id: 'c5-your-turn',
    section: C5,
    label: 'Your Turn',
    element: (
      <ContentSlide kicker={C5} title="Your Turn" lead="Homomorphism or not? Decide, then reveal" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Function', weight: 1.8 }, { label: 'Answer', weight: 1 }, { label: 'Reason', weight: 1.6 }]}
          rows={[
            ["(Σ∗, ·, ε) → (N, +, 0), number of a's", 'Monoid homomorphism', "Counts add when strings join; ε has no a's"],
            ['(Z, +) → (Z, +), x ↦ x²', 'Not a homomorphism', '(1 + 1)² = 4, but 1² + 1² = 2'],
            ['(Z, ×, 1) → (Z, ×, 1), x ↦ x²', 'Monoid homomorphism', '(ab)² = a²b² and 1² = 1'],
            ["(P(S), ∪, ∅) → (P(S), ∩, S), A ↦ A′", 'Monoid homomorphism', "(A ∪ B)′ = A′ ∩ B′, and ∅′ = S"],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Give learners time to vote on each row first.',
  },
  {
    id: 'c5-de-morgan',
    section: C5,
    label: 'De Morgan Again',
    element: (
      <ContentSlide kicker={C5} title="De Morgan Again" lead="(A ∪ B)′ = A′ ∩ B′ says complement is a homomorphism" lesson={SESSION}>
        <Callout kind="success" title="From set theory to structures" asStep={false}>
          Complement maps (P(S), ∪, ∅) to (P(S), ∩, S), and sends ∅ to S
        </Callout>
      </ContentSlide>
    ),
    notes: "Added Integration slide, from the note on the last practice row: De Morgan's law is exactly a homomorphism statement, linking this session back to set theory.",
  },

  /* ── CLOSING ─────────────────────────────────────────────────────────── */
  { id: 'quiz-2', section: 'Closing', label: 'Quiz Time', element: <QuizTimeSlide lesson={SESSION} /> },
  { id: 'takeaways', section: 'Closing', label: 'Key Takeaways', element: <KeyTakeawaysSlide title={SESSION} lesson={SESSION} points={AGENDA} /> },
  { id: 'feedback', section: 'Closing', label: 'Feedback', element: <FeedbackSlide lesson={SESSION} formless />, notes: 'No form and no QR (content rule 41 as amended 2026-11-21). Ask for feedback out loud.' },
  { id: 'thank-you', section: 'Closing', label: 'Thank you', element: <ThankYouSlide title="Thank You" lesson={SESSION} /> },
  { id: 'all-the-best', section: 'Closing', label: 'All the best', element: <ThankYouSlide title="All the Best" lesson={SESSION} /> },
]
