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
import { Callout, CodeBlock, DataTable } from '@/ui'
import type { TableColumn } from '@/ui/DataTable'
import { Step, useClaimedSteps } from '@/motion/Stepper'
import { useInstant } from '@/motion/instant'
import { colors } from '@/design/tokens'
import { RelationGraph, type GraphEdge, type GraphFrame, type GraphNode, type NodeState } from '@/ui/structures'

/**
 * BASICS OF COUNTING (DSM).
 *
 * Built from the signed-off plan at
 *   Outputs/dsm/session_plans/basics_of_counting/plan.md
 * the source of truth for order, framework and wording. Every count on these
 * slides was recomputed by `verify_tr.py` beside the plan.
 *
 * Five concepts: Why Count Systematically (4MAT), Sum Rule (Merrill), Product
 * Rule (Merrill), When to Add and When to Multiply (Merrill), Counting in
 * Computing (4MAT). Published as a claude.ai Artifact with the kit's Editor
 * controls.
 */

const SESSION = 'Basics of Counting'
const C1 = 'Why Count Systematically'
const C2 = 'Sum Rule'
const C3 = 'Product Rule'
const C4 = 'When to Add and When to Multiply'
const C5 = 'Counting in Computing'
const AGENDA = [C1, C2, C3, C4, C5]

export const basicsOfCountingMeta: DeckMeta = {
  title: SESSION,
  course: 'DSM',
  lesson: SESSION,
  presenter: 'NxtWave Instructor',
  player: { autoHideControls: true },
}

/* ── shared helpers (as in the Semigroups and Monoids deck) ──────────────── */

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

/** One value, tinted to its exact bounds (content rule 43). */
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

/* ── slot diagrams ───────────────────────────────────────────────────────── */

type Slot = number | string | { v: ReactNode; note?: string; tone?: LitTone }
interface SlotRow {
  label?: ReactNode
  slots: Slot[]
  total: ReactNode
}

function SlotBox({ s }: { s: Slot }) {
  const cell = typeof s === 'object' ? s : { v: s }
  const c = cell.tone ? LIT[cell.tone] : colors.brand
  return (
    <span className="flex flex-col items-center gap-1">
      <span
        className="grid h-[56px] min-w-[56px] place-items-center rounded-xl px-2 font-heading text-[24px] font-semibold"
        style={{ color: cell.tone ? c : colors.ink, background: cell.tone ? `${c}18` : '#FFFFFF', boxShadow: `inset 0 0 0 2px ${c}` }}
      >
        {cell.v}
      </span>
      {cell.note !== undefined && (
        <span className="text-[16px] font-semibold" style={{ color: cell.tone ? c : colors.ink }}>
          {cell.note}
        </span>
      )}
    </span>
  )
}

function SlotLine({ row, labelW }: { row: SlotRow; labelW: number }) {
  const notes = row.slots.some((s) => typeof s === 'object' && s.note !== undefined)
  return (
    <div className={`flex w-fit gap-3 ${notes ? 'items-start' : 'items-center'}`}>
      {labelW > 0 && (
        <span className="shrink-0 pt-3 font-heading text-[19px] font-semibold" style={{ width: labelW, color: colors.ink }}>
          {row.label}
        </span>
      )}
      {row.slots.map((s, i) => (
        <span key={i} className="flex items-start gap-3">
          {i > 0 && <span className="pt-3 font-heading text-[24px] font-semibold" style={{ color: colors.muted }}>×</span>}
          <SlotBox s={s} />
        </span>
      ))}
      <span className="pt-3 font-heading text-[24px] font-semibold" style={{ color: colors.muted }}>
        =
      </span>
      <span className="pt-3 font-heading text-[24px]">
        <Lit v={row.total} tone="brand" />
      </span>
    </div>
  )
}

/** One slot diagram per row, a row per press. */
function Slots({ rows, labelW = 0, stepped = true }: { rows: SlotRow[]; labelW?: number; stepped?: boolean }) {
  return (
    <div className="flex w-full flex-col gap-5">
      {rows.map((r, i) =>
        stepped ? (
          <Step key={i}>
            <SlotLine row={r} labelW={labelW} />
          </Step>
        ) : (
          <SlotLine key={i} row={r} labelW={labelW} />
        ),
      )}
    </div>
  )
}

/* ── pictures ────────────────────────────────────────────────────────────── */

const pw = (s: string) => Math.max(64, 30 + s.length * 11)

/** Two separate groups as two ovals, each named by a pill above it: nothing sits in both. */
function TwoGroups({ left, right, names, width = 640, caption, dots = false }: { left: string[]; right: string[]; names: [string, string]; width?: number; caption?: ReactNode; dots?: boolean }) {
  const gap = 56
  const top = 112
  const rows = Math.max(left.length, right.length)
  const lx = width * 0.27
  const rx = width * 0.73
  const node = (label: string, i: number, x: number, k: string): GraphNode => ({ id: `${k}${i}`, x, y: top + i * gap, label, w: dots ? undefined : pw(label) })
  const L = left.map((t, i) => node(t, i, lx, 'l'))
  const R = right.map((t, i) => node(t, i, rx, 'r'))
  return (
    <RelationGraph
      width={width}
      height={top + (rows - 1) * gap + 50}
      frames={[
        {
          nodes: [
            { id: 'nl', x: lx, y: 24, label: names[0], w: pw(names[0]), state: 'lit' },
            { id: 'nr', x: rx, y: 24, label: names[1], w: pw(names[1]), state: 'ok' },
            ...L,
            ...R,
          ],
          groups: [
            { id: 'gl', nodes: L.map((n) => n.id) },
            { id: 'gr', nodes: R.map((n) => n.id), tone: 'ok' },
          ],
          caption,
        },
      ]}
    />
  )
}

/** A top-down tree: each level one step, revealed one level per press. */
function LevelTree({ levels, width, levelGap = 96, captions }: { levels: { id: string; label: string; parent?: string; state?: NodeState }[][]; width: number; levelGap?: number; captions: ReactNode[] }) {
  const placed: GraphNode[][] = levels.map((lv, d) =>
    lv.map((n, i) => ({ id: n.id, x: (width / lv.length) * (i + 0.5), y: 30 + d * levelGap, label: n.label, w: pw(n.label), state: n.state ?? (d === levels.length - 1 ? 'ok' : 'plain') })),
  )
  const edgesTo = (d: number): GraphEdge[] => levels[d].filter((n) => n.parent).map((n) => ({ id: `${n.parent}>${n.id}`, from: n.parent!, to: n.id, kind: 'line', tone: 'brand' }))
  const frames: GraphFrame[] = levels.map((_, d) => ({
    nodes: placed.slice(0, d + 1).flat(),
    edges: levels.slice(1, d + 1).flatMap((_, k) => edgesTo(k + 1)),
    caption: captions[d],
  }))
  return <RelationGraph width={width} height={30 + (levels.length - 1) * levelGap + 40} frames={frames} />
}

/** A route map: start, middle pills, end; one route group per press. */
function RouteMap({ from, to, routes, captions, width = 640 }: { from: string; to: string; routes: string[]; captions: ReactNode[]; width?: number }) {
  const gap = 84
  const h = 40 + (routes.length - 1) * gap + 40
  const midY = h / 2
  const ends: GraphNode[] = [
    { id: 'from', x: 90, y: midY, label: from, w: pw(from), state: 'lit' },
    { id: 'to', x: width - 90, y: midY, label: to, w: pw(to), state: 'lit' },
  ]
  const mids = routes.map((r, i): GraphNode => ({ id: `m${i}`, x: width / 2, y: 40 + i * gap, label: r, w: pw(r), state: 'ok' }))
  const frames: GraphFrame[] = [
    { nodes: [...ends, ...mids.map((m) => ({ ...m, state: 'ghost' as NodeState }))], caption: captions[0] },
    ...routes.map((_, k) => ({
      nodes: [...ends, ...mids.map((m, i) => (i <= k ? m : { ...m, state: 'ghost' as NodeState }))],
      edges: mids.slice(0, k + 1).flatMap((m): GraphEdge[] => [
        { id: `a${m.id}`, from: 'from', to: m.id, tone: 'ok' },
        { id: `b${m.id}`, from: m.id, to: 'to', tone: 'ok' },
      ]),
      caption: captions[k + 1],
    })),
  ]
  return <RelationGraph width={width} height={h} frames={frames} />
}

/** A task box fanning out to its ways. */
function TaskFan({ ways }: { ways: boolean }) {
  const outs = ['White + Black', 'White + Grey', 'Blue + Black', 'Blue + Grey']
  return (
    <RelationGraph
      width={620}
      height={300}
      frames={[
        {
          nodes: [
            { id: 't', x: 120, y: 150, label: 'Choose an outfit', w: 200, state: 'lit' },
            ...outs.map((o, i): GraphNode => ({ id: `w${i}`, x: 470, y: 40 + i * 74, label: o, w: 180, state: ways ? 'ok' : 'ghost' })),
          ],
          edges: outs.map((_, i): GraphEdge => ({ id: `e${i}`, from: 't', to: `w${i}`, tone: ways ? 'ok' : 'muted' })),
          marks: [
            { id: 'mt', node: 't', text: 'task', side: 'below', tone: 'brand' },
            ...(ways ? [{ id: 'mw', node: 'w3', text: 'ways', side: 'below' as const, tone: 'ok' as const }] : []),
          ],
        },
      ]}
    />
  )
}

const PIN4: SlotRow = { slots: [10, 10, 10, 10], total: '10,000' }

/* ── the deck ────────────────────────────────────────────────────────────── */

export const basicsOfCountingDeck: SlideDef[] = [
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
          { title: C1, sub: 'When listing stops working' },
          { title: C2, sub: 'One option from separate groups' },
          { title: C3, sub: 'A task done in steps' },
          { title: C4, sub: '"Or" against "and then"' },
          { title: C5, sub: 'Passwords, addresses and loops' },
        ]}
      />
    ),
  },

  /* ── CONCEPT 1: Why Count Systematically (4MAT) ─────────────────────── */
  { id: 'c1-divider', section: C1, label: 'Divider', element: <SectionBreakerSlide index={1} title={C1} lesson={SESSION} /> },
  {
    id: 'c1-think',
    section: C1,
    label: 'Think First',
    element: (
      <ContentSlide kicker={C1} title="Think First" lead="How many different outfits can you make from the clothes you packed for a trip?" lesson={SESSION}>
        <div className="w-full space-y-3">
          <StepCards
            cols={2}
            items={[
              ['Shirts in the bag', 'Each one can be worn'],
              ['Trousers in the bag', 'Each pair can be worn'],
            ]}
          />
          <Callout kind="tip" title="Guess first">
            Write your guess down: we come back to it later in the session
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes: 'Do not answer yet. Ask learners to guess and write the guesses on the board; return to them at the end of the session and compare.',
  },
  {
    id: 'c1-questions',
    section: C1,
    label: 'Counting Questions',
    element: (
      <ContentSlide kicker={C1} title="Counting Questions" lead="Questions like this come up every day" lesson={SESSION}>
        <StepCards
          items={[
            ['How many 4-digit PINs can a debit card have?'],
            ['How many routes lead from your hostel to the college gate?'],
            ['How many meal combos can a canteen offer from its menu?'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Keep the guesses on the board for all four questions.',
  },
  {
    id: 'c1-combinatorics',
    section: C1,
    label: 'Combinatorics',
    element: (
      <ContentSlide kicker={C1} title="Combinatorics" lead="Each question asks how many possibilities there are" lesson={SESSION}>
        <Callout kind="info" title="Combinatorics" asStep={false}>
          Mathematics of counting possibilities without listing every one
        </Callout>
      </ContentSlide>
    ),
    notes: 'Combinatorics is the name of this whole area of discrete mathematics.',
  },
  {
    id: 'c1-listing-works',
    section: C1,
    label: 'Listing Works',
    element: (
      <ContentSlide kicker={C1} title="Listing Works" lead="2 shirts (white, blue) and 2 pairs of trousers (black, grey): listing every outfit is easy" lesson={SESSION}>
        <DataTable
          className="w-full"
          stepped
          compact
          columns={[{ label: 'Outfit', weight: 0.6 }, { label: 'Shirt' }, { label: 'Trousers' }]}
          rows={[
            ['1', 'White', 'Black'],
            ['2', 'White', 'Grey'],
            ['3', 'Blue', 'Black'],
            ['4', 'Blue', 'Grey'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Pedagogy for this module: always start from a small case learners can list by hand, spot the pattern, then state the rule.',
  },
  {
    id: 'c1-listing-breaks',
    section: C1,
    label: 'Listing Breaks',
    element: (
      <ContentSlide kicker={C1} title="Listing Breaks" lead="A 4-digit PIN has 10,000 possibilities: 0000, 0001, 0002, and so on up to 9999" lesson={SESSION}>
        <div className="w-full space-y-4">
          <Slots stepped={false} rows={[{ slots: ['?', '?', '?', '?'], total: '10,000' }]} />
          <StepCards
            items={[
              ['Counting rules give the answer directly', 'Nobody wants to list 10,000 PINs, and listing invites mistakes'],
              ['Listing small cases is still useful', 'It helps us discover and check the rules'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: 'Encourage the habit: list a small case, then generalise.',
  },
  {
    id: 'c1-task',
    section: C1,
    label: 'Task',
    element: (
      <ContentSlide kicker={C1} title="Task" lead="A task is something we do, such as choosing an outfit or setting a PIN" lesson={SESSION}>
        <TaskFan ways={false} />
      </ContentSlide>
    ),
  },
  {
    id: 'c1-ways',
    section: C1,
    label: 'Ways and Outcomes',
    element: (
      <ContentSlide kicker={C1} title="Ways and Outcomes" lead="A way, or outcome, is one possible result of the task" lesson={SESSION}>
        <div className="flex w-full items-center gap-6">
          <TaskFan ways />
          <Callout kind="info" title="Counting" className="flex-1">
            Finding the number of ways to do a task
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes: 'The four outfits from the listing slide are the four ways of this task.',
  },
  {
    id: 'c1-exclusive',
    section: C1,
    label: 'Mutually Exclusive',
    element: (
      <ContentSlide kicker={C1} title="Mutually Exclusive" lead="Two options are mutually exclusive, or disjoint, if choosing one rules out the other" lesson={SESSION}>
        <TwoGroups left={['Bus 1', 'Bus 2']} right={['Train 1', 'Train 2']} names={['Buses', 'Trains']} caption="One trip uses a bus or a train, never both" />
      </ContentSlide>
    ),
    notes: 'Keep this quick. Mutually exclusive is the key condition for the sum rule.',
  },
  {
    id: 'c1-rules',
    section: C1,
    label: 'Rules over Lists',
    element: (
      <ContentSlide kicker={C1} title="Rules over Lists" lead="Two rules count ways without listing them" lesson={SESSION}>
        <StepCards
          cols={2}
          items={[
            ['Sum rule', 'One choice from separate groups: "or"'],
            ['Product rule', 'A choice at each step: "and then"'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Only name the two rules here. Each gets its own section next.',
  },

  /* ── CONCEPT 2: Sum Rule (Merrill) ──────────────────────────────────── */
  { id: 'c2-divider', section: C2, label: 'Divider', element: <SectionBreakerSlide index={2} title={C2} lesson={SESSION} /> },
  {
    id: 'c2-lunch',
    section: C2,
    label: 'Lunch Choice',
    element: (
      <ContentSlide kicker={C2} title="Lunch Choice" lead="Veg counter: 3 dishes, non-veg counter: 4 dishes. You buy one dish: how many choices?" lesson={SESSION}>
        <DataTable
          className="w-full"
          compact
          columns={[{ label: 'Veg counter' }, { label: 'Non-veg counter' }]}
          rows={[
            ['Paneer curry', 'Chicken biryani'],
            ['Dal tadka', 'Egg curry'],
            ['Veg pulao', 'Fish fry'],
            ['', 'Mutton curry'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Think First: let learners answer before moving on.',
  },
  {
    id: 'c2-one-dish',
    section: C2,
    label: 'One Dish Only',
    element: (
      <ContentSlide kicker={C2} title="One Dish Only" lead="We pick from one counter or the other, and no dish is at both" lesson={SESSION}>
        <TwoGroups left={['Paneer curry', 'Dal tadka', 'Veg pulao']} right={['Chicken biryani', 'Egg curry', 'Fish fry', 'Mutton curry']} names={['Veg', 'Non-veg']} />
      </ContentSlide>
    ),
    notes: 'Ask learners why we will add here. Draw out the answer: one counter OR the other, never both, and no dish appears at both counters.',
  },
  {
    id: 'c2-count-menu',
    section: C2,
    label: 'Counting the Menu',
    element: (
      <ContentSlide kicker={C2} title="Counting the Menu" lead="Any dish from either counter works" lesson={SESSION}>
        <div className="w-full space-y-3">
          <DataTable
            className="w-full"
            compact
            columns={[{ label: 'Veg counter' }, { label: 'Non-veg counter' }]}
            rows={[
              [<Lit v="Paneer curry" tone="brand" />, <Lit v="Chicken biryani" tone="ok" />],
              [<Lit v="Dal tadka" tone="brand" />, <Lit v="Egg curry" tone="ok" />],
              [<Lit v="Veg pulao" tone="brand" />, <Lit v="Fish fry" tone="ok" />],
              ['', <Lit v="Mutton curry" tone="ok" />],
            ]}
          />
          <Callout kind="success" title="Choices">
            3 + 4 = 7
          </Callout>
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'c2-rule',
    section: C2,
    label: 'Sum Rule',
    element: (
      <ContentSlide kicker={C2} title="Sum Rule" lead="A task done in one of two mutually exclusive ways" lesson={SESSION}>
        <div className="w-full space-y-3">
          <StepCards
            items={[
              ['First way: m options'],
              ['Second way: n options'],
              ['Total: m + n ways'],
            ]}
          />
          <Callout kind="info" title="Key word" asStep={false}>
            "Or", with the options not overlapping
          </Callout>
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'c2-set-form',
    section: C2,
    label: 'Set Form',
    element: (
      <ContentSlide kicker={C2} title="Set Form" lead="If A and B are disjoint finite sets, |A ∪ B| = |A| + |B|" lesson={SESSION}>
        <TwoGroups dots left={['1', '2', '3']} right={['4', '5', '6', '7']} names={['A: 3', 'B: 4']} width={520} caption="A ∪ B: 3 + 4 = 7 elements" />
      </ContentSlide>
    ),
    notes: 'Link to set theory: the sum rule counts the elements of a union of disjoint sets.',
  },
  {
    id: 'c2-many',
    section: C2,
    label: 'Many Groups',
    element: (
      <ContentSlide kicker={C2} title="Many Groups" lead="Sum rule for k mutually exclusive groups" lesson={SESSION}>
        <StepCards
          items={[
            ['Group sizes', 'n₁, n₂, …, nₖ options'],
            ['Total', 'n₁ + n₂ + … + nₖ ways'],
          ]}
        />
      </ContentSlide>
    ),
  },
  {
    id: 'c2-routes',
    section: C2,
    label: 'Travel Routes',
    element: (
      <ContentSlide kicker={C2} title="Travel Routes" lead="Hyderabad to Chennai: one of 4 buses, 3 trains or 2 flights" lesson={SESSION}>
        <RouteMap
          from="Hyderabad"
          to="Chennai"
          routes={['4 buses', '3 trains', '2 flights']}
          captions={['A bus is never a train or a flight', 'Buses: 4', 'Trains: 3, so 4 + 3', 'Total: 4 + 3 + 2 = 9']}
        />
      </ContentSlide>
    ),
    notes: 'The three groups do not overlap, so we add.',
  },
  {
    id: 'c2-electives',
    section: C2,
    label: 'Electives',
    element: (
      <ContentSlide kicker={C2} title="Electives" lead="Choose one elective; no course is listed in two departments" lesson={SESSION}>
        <div className="w-full space-y-3">
          <DataTable
            className="w-full"
            stepped
            compact
            columns={[{ label: 'Department', weight: 1.6 }, { label: 'Electives' }]}
            rows={[
              ['Computer Science', '5'],
              ['Mathematics', '3'],
              ['Management', '4'],
            ]}
          />
          <Callout kind="success" title="Choices">
            5 + 3 + 4 = 12
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes: 'Emphasise the condition "no course listed in two departments". The next slide shows what goes wrong when options overlap.',
  },
  {
    id: 'c2-overlap',
    section: C2,
    label: 'Overlap',
    element: (
      <ContentSlide kicker={C2} title="Overlap" lead="Coding club: 10, music club: 8, with 3 in both. Pick one student from at least one club" lesson={SESSION}>
        <RelationGraph
          width={640}
          height={190}
          frames={[
            {
              nodes: [
                { id: 'c', x: 150, y: 90, label: '7 coding only', w: 170 },
                { id: 'b', x: 320, y: 90, label: '3 in both', w: 130, state: 'warn' },
                { id: 'm', x: 490, y: 90, label: '5 music only', w: 160 },
              ],
              groups: [
                { id: 'gc', nodes: ['c', 'b'] },
                { id: 'gm', nodes: ['b', 'm'], tone: 'ok' },
              ],
              caption: '10 + 8 = 18 counts the 3 shared students twice',
            },
            {
              nodes: [
                { id: 'c', x: 150, y: 90, label: '7 coding only', w: 170, state: 'ok' },
                { id: 'b', x: 320, y: 90, label: '3 in both', w: 130, state: 'ok' },
                { id: 'm', x: 490, y: 90, label: '5 music only', w: 160, state: 'ok' },
              ],
              groups: [
                { id: 'gc', nodes: ['c', 'b'] },
                { id: 'gm', nodes: ['b', 'm'], tone: 'ok' },
              ],
              caption: 'Subtract the shared part: 18 − 3 = 15',
            },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Same "do not count twice" idea learners met with Venn diagrams. The full method is called inclusion-exclusion; keep it brief here: check for overlap before adding.',
  },
  {
    id: 'c2-practice-1',
    section: C2,
    label: 'Practice 1',
    element: (
      <ContentSlide kicker={C2} title="Practice 1" lead="Add the separate options" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Situation', weight: 2.4 }, { label: 'Working' }, { label: 'Answer', weight: 0.6 }]}
          rows={[
            ['Pick one book from 6 novels or 4 comics', '6 + 4', '10'],
            ['Pick one snack from 5 sweets, 3 namkeens or 2 fruits', '5 + 3 + 2', '10'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Learners call out answers before each reveal.',
  },
  {
    id: 'c2-practice-2',
    section: C2,
    label: 'Practice 2',
    element: (
      <ContentSlide kicker={C2} title="Practice 2" lead="Add the separate options" lesson={SESSION}>
        <div className="w-full space-y-3">
          <RevealTable
            columns={[{ label: 'Situation', weight: 2.4 }, { label: 'Working' }, { label: 'Answer', weight: 0.6 }]}
            rows={[
              ['Watch one film from 7 on one app or 5 on another, no film on both', '7 + 5', '12'],
              ['Pick one student from 25 boys or 20 girls in a class', '25 + 20', '45'],
            ]}
          />
          <Callout kind="warning" title="What if 2 films are on both apps?">
            Subtract the overlap: 12 − 2 = 10
          </Callout>
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'c2-check',
    section: C2,
    label: 'Sum Rule Check',
    element: (
      <ContentSlide kicker={C2} title="Sum Rule Check" lead="Ask two questions before adding" lesson={SESSION}>
        <StepCards
          items={[
            ['Do I make one choice?', 'One dish, one film, one student'],
            ['Are the groups separate?', 'No option in two groups; if there is, subtract the overlap'],
            ['Both yes: add the group sizes'],
          ]}
        />
      </ContentSlide>
    ),
  },

  /* ── CONCEPT 3: Product Rule (Merrill) ──────────────────────────────── */
  { id: 'c3-divider', section: C3, label: 'Divider', element: <SectionBreakerSlide index={3} title={C3} lesson={SESSION} /> },
  {
    id: 'c3-outfits',
    section: C3,
    label: 'Outfits',
    element: (
      <ContentSlide kicker={C3} title="Outfits" lead="3 shirts (white, blue, red) and 2 pairs of trousers (black, grey): how many outfits?" lesson={SESSION}>
        <DataTable
          className="w-full"
          compact
          columns={[{ label: 'Shirt', weight: 0.8 }, { label: 'Black', weight: 1.2 }, { label: 'Grey', weight: 1 }]}
          rows={[
            ['White', '', ''],
            ['Blue', '', ''],
            ['Red', '', ''],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Think First: an outfit needs a shirt AND trousers.',
  },
  {
    id: 'c3-pairing',
    section: C3,
    label: 'Every Pairing',
    element: (
      <ContentSlide kicker={C3} title="Every Pairing" lead="Each shirt pairs with each pair of trousers" lesson={SESSION}>
        <div className="w-full space-y-3">
          <RevealTable
            columns={[{ label: 'Shirt', weight: 0.8 }, { label: 'Black', weight: 1.2 }, { label: 'Grey', weight: 1 }]}
            rows={[
              ['White', 'White + Black', 'White + Grey'],
              ['Blue', 'Blue + Black', 'Blue + Grey'],
              ['Red', 'Red + Black', 'Red + Grey'],
            ]}
          />
          <Callout kind="success" title="Outfits">
            3 × 2 = 6
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes: 'Ask why we multiply instead of adding. Every shirt choice opens up all trouser choices.',
  },
  {
    id: 'c3-rule',
    section: C3,
    label: 'Product Rule',
    element: (
      <ContentSlide kicker={C3} title="Product Rule" lead="A task done in two steps" lesson={SESSION}>
        <div className="w-full space-y-3">
          <StepCards
            items={[
              ['Step 1: m ways'],
              ['Step 2: n ways for each of those'],
              ['Total: m × n ways'],
            ]}
          />
          <Callout kind="info" title="Key words" asStep={false}>
            "And", "then", "for each"
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes: '"For each" matters: the number of choices in step 2 must be the same whatever happened in step 1.',
  },
  {
    id: 'c3-set-form',
    section: C3,
    label: 'Set Form',
    element: (
      <ContentSlide kicker={C3} title="Set Form" lead="|A × B| = |A| × |B|, the size of a Cartesian product" lesson={SESSION}>
        <div className="w-full space-y-3">
          <DataTable
            className="w-full"
            compact
            columns={[{ label: mh('a in A'), weight: 0.8 }, { label: mh('with x in B'), weight: 1.2 }, { label: mh('with y in B') }]}
            rows={[
              ['1', '(1, x)', '(1, y)'],
              ['2', '(2, x)', '(2, y)'],
              ['3', '(3, x)', '(3, y)'],
            ]}
          />
          <Callout kind="info" title="Many steps" asStep={false}>
            k steps with n₁, n₂, …, nₖ ways give n₁ × n₂ × … × nₖ
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes: 'Link to the Relations session: |A × B| = |A| × |B| was the first product-rule count learners saw. Here B = {x, y}.',
  },
  {
    id: 'c3-tree',
    section: C3,
    label: 'Tree Diagram',
    element: (
      <ContentSlide kicker={C3} title="Tree Diagram" lead="Hostel H to bus stand: roads p, q, r. Bus stand to college: roads x, y" lesson={SESSION}>
        <LevelTree
          width={640}
          levels={[
            [{ id: 'h', label: 'H', state: 'lit' }],
            ['p', 'q', 'r'].map((r) => ({ id: r, label: r, parent: 'h' })),
            ['p', 'q', 'r'].flatMap((r) => ['x', 'y'].map((s) => ({ id: r + s, label: r + s, parent: r }))),
          ]}
          captions={['Start at H', 'Step 1: 3 roads to the bus stand', 'Step 2: 2 roads each, 3 × 2 = 6 routes']}
        />
      </ContentSlide>
    ),
    notes: 'Each level of the tree is one step; the number of leaves is the answer. Ask learners to count the leaves and confirm 6.',
  },
  {
    id: 'c3-three-steps',
    section: C3,
    label: 'Three Steps',
    element: (
      <ContentSlide kicker={C3} title="Three Steps" lead="A combo is one starter, one main course and one dessert" lesson={SESSION}>
        <div className="w-full space-y-4">
          <Slots
            stepped={false}
            rows={[{ slots: [{ v: 3, note: 'starters' }, { v: 4, note: 'mains' }, { v: 2, note: 'desserts' }], total: 24 }]}
          />
          <Callout kind="note" title="Why not draw the tree?">
            A full tree would have 24 leaves: once numbers grow, multiply instead
          </Callout>
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'c3-slots',
    section: C3,
    label: 'Slots',
    element: (
      <ContentSlide kicker={C3} title="Slots" lead="Draw one box per position, write its number of choices, then multiply" lesson={SESSION}>
        <div className="w-full space-y-4">
          <Slots stepped={false} labelW={180} rows={[{ ...PIN4, label: '4-digit PIN' }]} />
          <Callout kind="info" title="Digits may repeat">
            Each position has 10 choices, 0 to 9
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes: 'Learners should draw the boxes first, fill in the numbers, and only then multiply.',
  },
  {
    id: 'c3-plates',
    section: C3,
    label: 'Number Plates',
    element: (
      <ContentSlide kicker={C3} title="Number Plates" lead="2 letters followed by 4 digits, repeats allowed" lesson={SESSION}>
        <div className="w-full space-y-4">
        <Slots
          stepped={false}
          rows={[
            {
              slots: [
                { v: 26, note: 'A–Z' },
                { v: 26, note: 'A–Z' },
                { v: 10, note: '0–9' },
                { v: 10, note: '0–9' },
                { v: 10, note: '0–9' },
                { v: 10, note: '0–9' },
              ],
              total: '6,760,000',
            },
          ]}
        />
        <Callout kind="info" title="Two kinds of slot">
          Each letter slot has 26 choices, each digit slot 10
        </Callout>
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'c3-no-repeats',
    section: C3,
    label: 'No Repeats',
    element: (
      <ContentSlide kicker={C3} title="No Repeats" lead="A 4-digit PIN with no repeated digit" lesson={SESSION}>
        <div className="w-full space-y-4">
          <Slots stepped={false} rows={[{ slots: [10, { v: 9, tone: 'warn' }, { v: 8, tone: 'warn' }, { v: 7, tone: 'warn' }], total: '5,040' }]} />
          <Callout kind="info" title="Product rule still applies">
            Each used digit removes one choice, so the count per step stays fixed
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes: 'The second digit always has 9 choices, whichever first digit was chosen. The actual options change; the count does not.',
  },
  {
    id: 'c3-restricted',
    section: C3,
    label: 'Restricted Slots',
    element: (
      <ContentSlide kicker={C3} title="Restricted Slots" lead="Fill the most restricted box first" lesson={SESSION}>
        <Slots
          labelW={220}
          rows={[
            { label: '3-digit numbers', slots: [{ v: 9, note: 'not 0', tone: 'warn' }, 10, 10], total: 900 },
            { label: 'Even, 3-digit', slots: [{ v: 9, note: 'not 0', tone: 'warn' }, 10, { v: 5, note: '0, 2, 4, 6, 8', tone: 'warn' }], total: 450 },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'The first digit cannot be 0; an even number ends in 0, 2, 4, 6 or 8.',
  },
  {
    id: 'c3-bits',
    section: C3,
    label: 'Bit Strings',
    element: (
      <ContentSlide kicker={C3} title="Bit Strings" lead="How many bit strings of length 3? Each position is 0 or 1" lesson={SESSION}>
        <LevelTree
          width={760}
          levelGap={84}
          levels={[
            [{ id: 'r', label: 'start', state: 'lit' }],
            ['0', '1'].map((b) => ({ id: b, label: b, parent: 'r' })),
            ['0', '1'].flatMap((a) => ['0', '1'].map((b) => ({ id: a + b, label: a + b, parent: a }))),
            ['00', '01', '10', '11'].flatMap((a) => ['0', '1'].map((b) => ({ id: a + b, label: a + b, parent: a }))),
          ]}
          captions={['Three positions to fill', '1st bit: 2 choices', '2nd bit: 2 × 2 = 4', '3rd bit: 2 × 2 × 2 = 8']}
        />
      </ContentSlide>
    ),
  },
  {
    id: 'c3-length-n',
    section: C3,
    label: 'Length n',
    element: (
      <ContentSlide kicker={C3} title="Length n" lead="2 choices per position, n positions" lesson={SESSION}>
        <div className="w-full space-y-4">
          <Slots labelW={150} rows={[
            { label: 'Length n', slots: [2, 2, '…', 2], total: '2ⁿ' },
            { label: 'A byte', slots: [2, 2, 2, 2, 2, 2, 2, 2], total: '2⁸ = 256' },
          ]} />
        </div>
      </ContentSlide>
    ),
    notes: 'A set with n elements has 2ⁿ subsets, because each subset is an n-bit string. The product rule explains that count.',
  },
  {
    id: 'c3-practice',
    section: C3,
    label: 'Practice',
    element: (
      <ContentSlide kicker={C3} title="Practice" lead="Draw the slots, then multiply" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Situation', weight: 2.4 }, { label: 'Working' }, { label: 'Answer', weight: 0.7 }]}
          rows={[
            ['A phone case in 4 colours and 3 designs', '4 × 3', '12'],
            ['A 3-letter code using A–Z, repeats allowed', '26 × 26 × 26', '17,576'],
            ['A 2-digit number with distinct digits', '9 × 9', '81'],
            ['An answer sheet for 10 true or false questions', '2¹⁰', '1,024'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Distinct digits: the first digit has 9 choices (1 to 9); the second has 9 choices (0 to 9 except the first digit). Ask why it is not 9 × 10 or 10 × 9.',
  },
  {
    id: 'c3-check',
    section: C3,
    label: 'Product Rule Check',
    element: (
      <ContentSlide kicker={C3} title="Product Rule Check" lead="Ask two questions before multiplying" lesson={SESSION}>
        <StepCards
          items={[
            ['Is the task done in steps?', 'A shirt, then trousers; one digit, then the next'],
            ['Is the count per step fixed?', 'Same number of choices, whatever came before'],
            ['Both yes: multiply the counts'],
          ]}
        />
      </ContentSlide>
    ),
  },
  { id: 'quiz-1', section: C3, label: 'Quiz Time', element: <QuizTimeSlide lesson={SESSION} /> },

  /* ── CONCEPT 4: When to Add and When to Multiply (Merrill) ──────────── */
  { id: 'c4-divider', section: C4, label: 'Divider', element: <SectionBreakerSlide index={4} title={C4} lesson={SESSION} /> },
  {
    id: 'c4-wardrobe',
    section: C4,
    label: 'Same Wardrobe',
    element: (
      <ContentSlide kicker={C4} title="Same Wardrobe" lead="You have 3 shirts and 2 pairs of trousers. Two questions" lesson={SESSION}>
        <StepCards
          items={[
            ['You may pack one item of clothing', 'How many choices?'],
            ['You wear a shirt and trousers', 'How many outfits?'],
          ]}
        />
      </ContentSlide>
    ),
  },
  {
    id: 'c4-or-and',
    section: C4,
    label: 'Or and And',
    element: (
      <ContentSlide kicker={C4} title="Or and And" lead="Question decides the rule" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Question', weight: 1.4 }, { label: 'Structure', weight: 1.6 }, { label: 'Rule', weight: 0.7 }, { label: 'Answer', weight: 0.8 }]}
          rows={[
            ['Pack one item', 'One choice from two separate groups', 'Sum', '3 + 2 = 5'],
            ['Wear a shirt and trousers', 'A choice at each of two steps', 'Product', '3 × 2 = 6'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'This side-by-side comparison is the heart of the session. Ask learners to invent their own pair of questions from one situation, one needing addition and one needing multiplication.',
  },
  {
    id: 'c4-decide',
    section: C4,
    label: 'Add or Multiply',
    element: (
      <ContentSlide kicker={C4} title="Add or Multiply" lead="Ask what the choice looks like" lesson={SESSION}>
        <DataTable
          className="w-full"
          stepped
          compact
          columns={[{ label: 'Ask yourself', weight: 1.8 }, { label: 'If yes', weight: 1 }, { label: 'Signal words', weight: 1.4 }]}
          rows={[
            ['Do I make one choice from several separate groups?', <Lit v="Add" tone="brand" />, '"or", "either … or", "one of"'],
            ['Do I make a choice at every step, one after another?', <Lit v="Multiply" tone="ok" />, '"and", "then", "for each", "followed by"'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Signal words help, but the real test is the structure of the task: when I am done, did I make one choice or a sequence of choices?',
  },
  {
    id: 'c4-both',
    section: C4,
    label: 'Both Rules',
    element: (
      <ContentSlide kicker={C4} title="Both Rules" lead="A to C: 2 direct roads, or 3 roads to B and then 2 roads to C" lesson={SESSION}>
        <RelationGraph
          width={680}
          height={250}
          frames={(() => {
            const base = (c1: boolean, c2: boolean): GraphNode[] => [
              { id: 'a', x: 60, y: 190, label: 'A', state: 'lit' },
              { id: 'b', x: 340, y: 190, label: 'B', state: c2 ? 'lit' : 'plain' },
              { id: 'c', x: 620, y: 190, label: 'C', state: 'lit' },
              { id: 'd', x: 340, y: 40, label: '2 direct roads', w: 180, state: c1 ? 'ok' : 'plain' },
              { id: 'ab', x: 200, y: 190, label: '3 roads', w: 110, state: c2 ? 'ok' : 'plain' },
              { id: 'bc', x: 480, y: 190, label: '2 roads', w: 110, state: c2 ? 'ok' : 'plain' },
            ]
            const ed = (c1: boolean, c2: boolean): GraphEdge[] => [
              { id: 'ad', from: 'a', to: 'd', tone: c1 ? 'ok' : 'muted' },
              { id: 'dc', from: 'd', to: 'c', tone: c1 ? 'ok' : 'muted' },
              { id: 'a-ab', from: 'a', to: 'ab', tone: c2 ? 'ok' : 'muted' },
              { id: 'ab-b', from: 'ab', to: 'b', tone: c2 ? 'ok' : 'muted' },
              { id: 'b-bc', from: 'b', to: 'bc', tone: c2 ? 'ok' : 'muted' },
              { id: 'bc-c', from: 'bc', to: 'c', tone: c2 ? 'ok' : 'muted' },
            ]
            return [
              { nodes: base(false, false), edges: ed(false, false), caption: 'Split into separate cases' },
              { nodes: base(true, false), edges: ed(true, false), caption: 'Case 1, direct: 2 ways' },
              { nodes: base(false, true), edges: ed(false, true), caption: 'Case 2, through B: 3 × 2 = 6 ways' },
              { nodes: base(true, true), edges: ed(true, true), caption: 'Total: 2 + 6 = 8 routes' },
            ]
          })()}
        />
      </ContentSlide>
    ),
    notes: 'Method: add the cases, multiply inside a case. Most errors in mixed problems come from forgetting a case or multiplying across cases.',
  },
  {
    id: 'c4-codes',
    section: C4,
    label: 'Codes',
    element: (
      <ContentSlide kicker={C4} title="Codes" lead="A lock code has either 3 or 4 digits, repeats allowed" lesson={SESSION}>
        <div className="w-full space-y-4">
          <Slots
            labelW={150}
            rows={[
              { label: '3 digits', slots: [10, 10, 10], total: '1,000' },
              { label: '4 digits', slots: [10, 10, 10, 10], total: '10,000' },
            ]}
          />
          <Callout kind="success" title="Total">
            1,000 + 10,000 = 11,000
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes: 'The lengths are separate cases (a code cannot be both 3 and 4 digits long), so we add. Within each case the positions are steps, so we multiply.',
  },
  {
    id: 'c4-usernames',
    section: C4,
    label: 'Usernames',
    element: (
      <ContentSlide kicker={C4} title="Usernames" lead="A short username has 1 or 2 letters from A to Z" lesson={SESSION}>
        <div className="w-full space-y-4">
          <Slots
            labelW={150}
            rows={[
              { label: '1 letter', slots: [26], total: 26 },
              { label: '2 letters', slots: [26, 26], total: 676 },
            ]}
          />
          <Callout kind="success" title="Total">
            26 + 676 = 702
          </Callout>
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'c4-plates',
    section: C4,
    label: 'Two Plate Formats',
    element: (
      <ContentSlide kicker={C4} title="Two Plate Formats" lead="Plates use either format, repeats allowed: product inside, sum across" lesson={SESSION}>
        <div className="w-full space-y-4">
          <Slots
            labelW={190}
            rows={[
              { label: '2 letters, 3 digits', slots: [26, 26, 10, 10, 10], total: '676,000' },
              { label: '3 letters, 2 digits', slots: [26, 26, 26, 10, 10], total: '1,757,600' },
            ]}
          />
          <Callout kind="success" title="Total">
            676,000 + 1,757,600 = 2,433,600
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes: 'Why not multiply the two format counts? A single plate uses one format or the other, never both. Multiplying would count pairs of plates.',
  },
  {
    id: 'c4-mistakes',
    section: C4,
    label: 'Common Mistakes',
    element: (
      <ContentSlide kicker={C4} title="Common Mistakes" lead="Four traps to watch for" lesson={SESSION}>
        <DataTable
          className="w-full"
          stepped
          compact
          columns={[{ label: 'Mistake', weight: 1.3 }, { label: 'Example', weight: 1.6 }, { label: 'Fix', weight: 1.5 }]}
          rows={[
            ['Adding steps done one after another', '3 shirts and 2 trousers counted as 5 outfits', 'Each shirt pairs with each trouser: 3 × 2'],
            ['Multiplying separate alternatives', 'One dish from 3 veg or 4 non-veg counted as 12', 'Only one dish is chosen: 3 + 4'],
            ['Adding overlapping groups', 'Clubs counted as 10 + 8 with 3 in both', 'Subtract the overlap: 18 − 3'],
            ['Ignoring a restriction', '3-digit numbers counted as 10 × 10 × 10', 'First digit cannot be 0: 9 × 10 × 10'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Ask which mistake learners think is most common. In exams it is usually the first: adding when the task has steps.',
  },
  {
    id: 'c4-practice-1',
    section: C4,
    label: 'Practice 1',
    element: (
      <ContentSlide kicker={C4} title="Practice 1" lead="Decide the rule first" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Situation', weight: 2.4 }, { label: 'Rule', weight: 0.7 }, { label: 'Answer', weight: 1.3 }]}
          rows={[
            ['Choose a laptop: 3 Dell models or 4 HP models', 'Sum', '7'],
            ['Choose a laptop model (7 options) and a bag (2 options)', 'Product', '14'],
            ['A PIN of 4 or 6 digits, repeats allowed', 'Both', '10⁴ + 10⁶ = 1,010,000'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Learners first vote on the rule, then compute.',
  },
  {
    id: 'c4-practice-2',
    section: C4,
    label: 'Practice 2',
    element: (
      <ContentSlide kicker={C4} title="Practice 2" lead="Decide the rule first" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Situation', weight: 2.4 }, { label: 'Rule', weight: 0.7 }, { label: 'Answer', weight: 1.3 }]}
          rows={[
            ['A to B by 2 roads or 1 train, then B to C by 3 roads', 'Both', '(2 + 1) × 3 = 9'],
            ['5 questions, each answered A, B, C or D', 'Product', '4⁵ = 1,024'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'The first row adds first and then multiplies: step 1 has 2 + 1 = 3 ways (sum rule), and step 2 has 3 ways. Rules can be nested in either order.',
  },
  {
    id: 'c4-choosing',
    section: C4,
    label: 'Choosing a Rule',
    element: (
      <ContentSlide kicker={C4} title="Choosing a Rule" lead="Two moves solve every problem in this session" lesson={SESSION}>
        <StepCards
          items={[
            ['Split the task into separate cases', 'Add the cases'],
            ['Count each case in steps', 'Multiply inside a case'],
          ]}
        />
      </ContentSlide>
    ),
  },

  /* ── CONCEPT 5: Counting in Computing (4MAT) ────────────────────────── */
  { id: 'c5-divider', section: C5, label: 'Divider', element: <SectionBreakerSlide index={5} title={C5} lesson={SESSION} /> },
  {
    id: 'c5-passwords',
    section: C5,
    label: 'Passwords',
    element: (
      <ContentSlide kicker={C5} title="Passwords" lead="8 characters from 62 symbols: A to Z, a to z and 0 to 9" lesson={SESSION}>
        <div className="w-full space-y-4">
          <Slots stepped={false} rows={[{ slots: [62, 62, 62, 62, 62, 62, 62, 62], total: '62⁸' }]} />
          <Callout kind="success" title="About 218 trillion passwords">
            Too many to try one by one: this is what keeps a password safe
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes: 'Exact value: 62⁸ = 218,340,105,584,896.',
  },
  {
    id: 'c5-ipv4',
    section: C5,
    label: 'IPv4 Addresses',
    element: (
      <ContentSlide kicker={C5} title="IPv4 Addresses" lead="An IPv4 address is 32 bits long" lesson={SESSION}>
        <div className="w-full space-y-4">
          <Slots stepped={false} labelW={150} rows={[{ label: '32 slots', slots: [2, 2, 2, '…', 2], total: '2³²' }]} />
          <Callout kind="success" title="About 4.3 billion addresses">
            Each bit is 0 or 1, so the product rule gives 2³²
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes: 'Exact value: 2³² = 4,294,967,296.',
  },
  {
    id: 'c5-nested',
    section: C5,
    label: 'Nested Loops',
    element: (
      <ContentSlide kicker={C5} title="Nested Loops" lead="A loop of m steps inside a loop of n steps" lesson={SESSION}>
        <div className="flex w-full items-start gap-6">
          <CodeBlock chip={false} filename="nested.py" className="flex-[1.2]" code={'for i in range(n):\n    for j in range(m):\n        print(i, j)'} />
          <Callout kind="info" title="Product rule" className="flex-1" asStep={false}>
            print runs m times for each of the n outer steps: m × n
          </Callout>
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'c5-sequential',
    section: C5,
    label: 'Loops in a Row',
    element: (
      <ContentSlide kicker={C5} title="Loops in a Row" lead="A loop of m steps followed by a separate loop of n steps" lesson={SESSION}>
        <div className="flex w-full items-start gap-6">
          <CodeBlock chip={false} filename="sequential.py" className="flex-[1.2]" code={'for i in range(m):\n    print(i)\nfor j in range(n):\n    print(j)'} />
          <Callout kind="info" title="Sum rule" className="flex-1" asStep={false}>
            Each print belongs to one loop or the other: m + n
          </Callout>
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'c5-counts',
    section: C5,
    label: 'Loop Counts',
    element: (
      <ContentSlide kicker={C5} title="Loop Counts" lead="Loops of 10 and 5 steps: how many times does print run?" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Loops', weight: 1.4 }, { label: 'Rule' }, { label: 'Runs' }]}
          rows={[
            ['Nested', 'Product', '10 × 5 = 50'],
            ['One after the other', 'Sum', '10 + 5 = 15'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Nested loops multiply, loops one after another add. Return to the guesses from the start of the session and compare.',
  },

  /* ── CLOSE ───────────────────────────────────────────────────────────── */
  { id: 'quiz-2', section: 'Close', label: 'Quiz Time', element: <QuizTimeSlide lesson={SESSION} /> },
  { id: 'takeaways', section: 'Close', label: 'Key Takeaways', element: <KeyTakeawaysSlide title={SESSION} lesson={SESSION} points={AGENDA} /> },
  { id: 'feedback', section: 'Close', label: 'Feedback', element: <FeedbackSlide lesson={SESSION} formless />, notes: 'No form and no QR (content rule 41 as amended 2026-11-21). Ask for feedback out loud.' },
  { id: 'thank-you', section: 'Close', label: 'Thank You', element: <ThankYouSlide title="Thank You" lesson={SESSION} /> },
  { id: 'all-the-best', section: 'Close', label: 'All the Best', element: <ThankYouSlide title="All the Best" lesson={SESSION} /> },
]

