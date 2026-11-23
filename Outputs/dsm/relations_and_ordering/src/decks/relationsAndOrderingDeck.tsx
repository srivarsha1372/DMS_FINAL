import type { ReactNode } from 'react'
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
import { Step } from '@/motion/Stepper'
import { colors } from '@/design/tokens'
import {
  BitStrip,
  RelationGraph,
  columns,
  layered,
  pairs,
  type GraphEdge,
  type GraphFrame,
  type GraphNode,
  type NodeState,
} from '@/ui/structures'

/**
 * RELATIONS AND ORDERING (DSM).
 *
 * Built from the signed-off plan at
 *   Outputs/dsm/session_plans/relations_and_ordering/plan.md
 * the source of truth for order, framework and wording. Every result on these
 * slides was recomputed by `verify_tr.py` beside the plan.
 *
 * Four concepts: Relations and Their Representations (4MAT), Properties and
 * Composition (Merrill), Equivalence and Compatibility (4MAT), Partial Orders
 * and Posets (Merrill). No recap, setup or Next Session slide: the TR has
 * none (PEDAGOGY_GUIDELINES section 1, amended 2026-11-23). Feedback slide is
 * `formless` (content rule 41, amended 2026-11-21).
 */

const SESSION = 'Relations and Ordering'
const C1 = 'Relations and Their Representations'
const C2 = 'Properties and Composition'
const C3 = 'Equivalence and Compatibility'
const C4 = 'Partial Orders and Posets'
const AGENDA = [C1, C2, C3, C4]

export const relationsAndOrderingMeta: DeckMeta = {
  title: SESSION,
  course: 'DSM',
  lesson: SESSION,
  presenter: 'NxtWave Instructor',
  player: { autoHideControls: true },
}

/* ── shared figure data ──────────────────────────────────────────────────── */

const N = (id: string, x: number, y: number, extra: Partial<GraphNode> = {}): GraphNode => ({ id, x, y, label: id, ...extra })
const loop = (id: string, side: GraphEdge['side'], tone?: GraphEdge['tone']): GraphEdge => ({ id: `${id}@`, from: id, to: id, side, tone })

/** "x divides y" on {1, 2, 3, 4}, dots on a square. */
const DIV_NODES = (states: Record<string, NodeState> = {}, dx = 0) => [
  N('1', 90 + dx, 80, { state: states['1'] }),
  N('2', 290 + dx, 80, { state: states['2'] }),
  N('3', 90 + dx, 250, { state: states['3'] }),
  N('4', 290 + dx, 250, { state: states['4'] }),
]
const DIV_LOOPS = (tone?: GraphEdge['tone']) => [loop('1', 'top', tone), loop('2', 'top', tone), loop('3', 'bottom', tone), loop('4', 'bottom', tone)]
const DIV_ARROWS = pairs([['1', '2'], ['1', '3'], ['1', '4'], ['2', '4']])

/** A 0/1 relation matrix drawn with BitStrip. */
function Matrix({ cols, rows, ring, frames, cell = 46 }: { cols: string[]; rows: [string, string][]; ring?: number[]; frames?: { rows: [string, string][]; caption?: ReactNode; ring?: number[] }[]; cell?: number }) {
  const fr = frames ?? [{ rows, ring }]
  return (
    <BitStrip
      elements={cols}
      cell={cell}
      labelWidth={70}
      frames={fr.map((f) => ({ rows: f.rows.map(([label, bits]) => ({ label, bits })), ring: f.ring, caption: f.caption }))}
    />
  )
}
const DIV_MATRIX: [string, string][] = [
  ['1', '1111'],
  ['2', '0101'],
  ['3', '0010'],
  ['4', '0001'],
]

/** Divisors of 12 as a Hasse diagram. */
const D12 = (states: Record<string, NodeState> = {}, cx = 200, bottom = 270) =>
  layered(
    [
      [{ id: '1', label: '1' }],
      [{ id: '2', label: '2' }, { id: '3', label: '3' }],
      [{ id: '4', label: '4' }, { id: '6', label: '6' }],
      [{ id: '12', label: '12' }],
    ].map((lv) => lv.map((n) => ({ ...n, state: states[n.id] }))),
    { cx, bottom, rowGap: 78, colGap: 120 },
  )
const D12_EDGES = (tone: Record<string, GraphEdge['tone']> = {}) =>
  ([['1', '2'], ['1', '3'], ['2', '4'], ['2', '6'], ['3', '6'], ['4', '12'], ['6', '12']] as [string, string][]).map(([a, b]) => ({
    id: `${a}-${b}`,
    from: a,
    to: b,
    kind: 'line' as const,
    tone: tone[`${a}-${b}`],
  }))

/** {2, 3, 4, 6, 12, 18} under divides. */
const Q6 = (states: Record<string, NodeState> = {}, cx = 200, bottom = 290) =>
  layered(
    [
      [{ id: '2', label: '2' }, { id: '3', label: '3' }],
      [{ id: '4', label: '4' }, { id: '6', label: '6' }],
      [{ id: '12', label: '12' }, { id: '18', label: '18' }],
    ].map((lv) => lv.map((n) => ({ ...n, state: states[n.id] }))),
    { cx, bottom, rowGap: 100, colGap: 140 },
  )
const Q6_EDGES: GraphEdge[] = ([['2', '4'], ['2', '6'], ['3', '6'], ['4', '12'], ['6', '12'], ['6', '18']] as [string, string][]).map(([a, b]) => ({ id: `${a}-${b}`, from: a, to: b, kind: 'line' }))

/** The power-set cube of {a, b, c}. */
const SUBSETS = [[''], ['a', 'b', 'c'], ['ab', 'ac', 'bc'], ['abc']]
const setLabel = (s: string) => (s ? `{${s.split('').join(', ')}}` : '∅')
const CUBE = (states: Record<string, NodeState> = {}, cx = 220, bottom = 340) =>
  layered(
    SUBSETS.map((lv) => lv.map((s) => ({ id: `s${s}`, label: setLabel(s), w: s.length === 3 ? 104 : s.length === 2 ? 84 : 58, state: states[s] }))),
    { cx, bottom, rowGap: 100, colGap: 128 },
  )
const CUBE_EDGES: GraphEdge[] = SUBSETS.slice(0, 3).flatMap((lv, i) =>
  lv.flatMap((x) => SUBSETS[i + 1].filter((y) => x.split('').every((ch) => y.includes(ch))).map((y) => ({ id: `${x}-${y}`, from: `s${x}`, to: `s${y}`, kind: 'line' as const }))),
)

/** One frame per item: a small helper for figures with a single frame. */
const one = (f: GraphFrame) => [f]

/** A property chip row. */
function Chips({ items }: { items: { text: string; tone?: 'brand' | 'ok' | 'muted' }[] }) {
  return (
    <span className="flex flex-wrap gap-2">
      {items.map((c) => {
        const col = c.tone === 'ok' ? colors.success : c.tone === 'muted' ? colors.muted : colors.brand
        return (
          <span key={c.text} className="rounded-pill px-3 py-1 font-heading text-[17px] font-semibold" style={{ background: `${col}18`, color: col, border: `1.5px solid ${col}55` }}>
            {c.text}
          </span>
        )
      })}
    </span>
  )
}

/** Small numbered cards, one per press. */
function StepCards({ items, cols = 1 }: { items: [string, string?][]; cols?: number }) {
  return (
    <div className="grid w-full gap-3" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {items.map(([t, sub], i) => (
        <Step key={t} className="flex items-start gap-3 rounded-card border border-line bg-white px-4 py-3 shadow-card-soft">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full font-heading text-[16px] font-semibold text-white" style={{ background: colors.brand }}>
            {i + 1}
          </span>
          <span>
            <span className="block font-heading text-[18px] font-semibold" style={{ color: colors.ink }}>
              {t}
            </span>
            {sub && (
              <span className="block text-[16px]" style={{ color: colors.ink }}>
                {sub}
              </span>
            )}
          </span>
        </Step>
      ))}
    </div>
  )
}

const mono = (s: string) => <span className="font-mono">{s}</span>

/* ── more figure data ─────────────────────────────────────────────────── */

function COMP_EDGES(lit: string[] = []): GraphEdge[] {
  return pairs([['1', 'x'], ['2', 'x'], ['3', 'y'], ['x', 'p'], ['y', 'p'], ['y', 'q']]).map((e) => ({ ...e, tone: lit.includes(e.id) ? 'ok' : lit.length ? 'muted' : 'brand' }))
}
const COMP_NODES: GraphNode[] = columns(
  [
    [{ id: '1', label: '1' }, { id: '2', label: '2' }, { id: '3', label: '3' }],
    [{ id: 'x', label: 'x' }, { id: 'y', label: 'y' }],
    [{ id: 'p', label: 'p' }, { id: 'q', label: 'q' }],
  ],
  { x0: 40, top: 40, colGap: 190, rowGap: 85 },
)

function WORDS(): GraphNode[] {
  return ['sun', 'nut', 'tea', 'ear'].map((w, i) => N(w, 50 + i * 113, 75, { label: w, w: 76 }))
}
const WORD_EDGES: GraphEdge[] = pairs([['sun', 'nut'], ['nut', 'tea'], ['tea', 'ear']], { kind: 'line' })

function COURSES(states: Record<string, NodeState> = {}): GraphNode[] {
  return [
    N('prog', 110, 250, { label: 'Programming', w: 150, state: states.prog }),
    N('dm', 330, 250, { label: 'Discrete Maths', w: 170, state: states.dm }),
    N('ds', 110, 140, { label: 'Data Structures', w: 170, state: states.ds }),
    N('algo', 220, 35, { label: 'Algorithms', w: 140, state: states.algo }),
  ]
}
const COURSE_EDGES: GraphEdge[] = pairs([['prog', 'ds'], ['ds', 'algo'], ['dm', 'algo']])

const H3: GraphNode[] = layered([[{ id: '1', label: '1' }], [{ id: '2', label: '2' }], [{ id: '4', label: '4' }]], { cx: 120, bottom: 290, rowGap: 110 })


/* ── the deck ────────────────────────────────────────────────────────────── */

export const relationsAndOrderingDeck: SlideDef[] = [
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
          { title: C1, sub: 'Pairs, matrices and directed graphs' },
          { title: C2, sub: 'Five tests, and chaining two relations' },
          { title: C3, sub: 'Classes, partitions and blocks' },
          { title: C4, sub: 'Hasse diagrams and bounds' },
        ]}
      />
    ),
  },

  /* ── CONCEPT 1 ───────────────────────────────────────────────────────── */
  { id: 'c1-divider', section: C1, label: 'Divider', element: <SectionBreakerSlide index={1} title={C1} lesson={SESSION} /> },
  {
    id: 'c1-connect',
    section: C1,
    label: 'Things That Connect',
    element: (
      <ContentSlide kicker={C1} title="Things That Connect" lead="Many facts connect one thing to another" lesson={SESSION}>
        <RelationGraph
          width={900}
          height={250}
          frames={one({
            nodes: [
              N('asha', 60, 40, { label: 'Asha', w: 100 }),
              N('dm', 460, 40, { label: 'Discrete Maths', w: 170 }),
              N('n3', 60, 125, { label: '3' }),
              N('n7', 460, 125, { label: '7' }),
              N('hyd', 60, 210, { label: 'Hyderabad', w: 130 }),
              N('che', 460, 210, { label: 'Chennai', w: 120 }),
            ],
            edges: [
              { id: 'e1', from: 'asha', to: 'dm' },
              { id: 'e2', from: 'n3', to: 'n7' },
              { id: 'e3', from: 'hyd', to: 'che' },
            ],
            marks: [
              { id: 'm1', node: 'dm', text: 'is enrolled in', side: 'right', tone: 'ink' },
              { id: 'm2', node: 'n7', text: 'is less than', side: 'right', tone: 'ink' },
              { id: 'm3', node: 'che', text: 'has a direct train to', side: 'right', tone: 'ink' },
            ],
          })}
        />
      </ContentSlide>
    ),
    notes: 'Ask learners for two relations from their own life. On Instagram, "follows" is a relation: for any two accounts, the first follows the second or it does not.',
  },
  {
    id: 'c1-order',
    section: C1,
    label: 'Order Matters',
    element: (
      <ContentSlide
        kicker={C1}
        title="Order Matters"
        lead="“Asha follows Ravi” is not the same fact as “Ravi follows Asha”"
        lesson={SESSION}
        points={[
          { text: 'Words do not say which pairs are connected', icon: 'warning' },
          { text: 'We need a precise record of the pairs', icon: 'target' },
        ]}
      >
        <RelationGraph
          width={440}
          height={200}
          frames={one({
            nodes: [N('asha', 80, 50, { label: 'Asha', w: 100 }), N('ravi', 340, 50, { label: 'Ravi', w: 100 }), N('asha2', 80, 160, { label: 'Asha', w: 100 }), N('ravi2', 340, 160, { label: 'Ravi', w: 100 })],
            edges: [
              { id: 'f1', from: 'asha', to: 'ravi', tone: 'ok' },
              { id: 'f2', from: 'ravi2', to: 'asha2', tone: 'muted', crossed: true },
            ],
          })}
        />
      </ContentSlide>
    ),
    notes: 'Added opening slide. A relation records exactly which ordered pairs hold, so direction is never ambiguous.',
  },
  {
    id: 'c1-product',
    section: C1,
    label: 'All Possible Pairs',
    element: (
      <ContentSlide kicker={C1} title="All Possible Pairs" lead="A × B = {(a, b) | a ∈ A, b ∈ B}: every pair, first from A, second from B" lesson={SESSION}>
        <div className="w-full space-y-3">
          <DataTable
            className="w-full"
            columns={[{ label: 'S × C' }, { label: 'DM' }, { label: 'DS' }]}
            rows={[
              ['Asha', mono('(Asha, DM)'), mono('(Asha, DS)')],
              ['Ravi', mono('(Ravi, DM)'), mono('(Ravi, DS)')],
            ]}
          />
          <p className="text-[19px]" style={{ color: colors.ink }}>
            |S × C| = |S| × |C| = 2 × 2 = 4
          </p>
        </div>
      </ContentSlide>
    ),
    notes: 'A recap from set theory: spend only a minute. A × B lists every possible connection, whether or not it happens.',
  },
  {
    id: 'c1-subset',
    section: C1,
    label: 'A Relation Is a Subset',
    element: (
      <ContentSlide kicker={C1} title="A Relation Is a Subset" lead="The pairs we choose from A × B form a relation R" lesson={SESSION}>
        <div className="w-full space-y-3">
          <DataTable
            className="w-full"
            revealColumn={2}
            columns={[{ label: 'Pair' }, { label: 'Actual enrolment?' }, { label: 'We write' }]}
            rows={[
              [mono('(Asha, DM)'), 'Yes', mono('Asha R DM')],
              [mono('(Asha, DS)'), 'No', mono('Asha R̸ DS')],
              [mono('(Ravi, DM)'), 'Yes', mono('Ravi R DM')],
              [mono('(Ravi, DS)'), 'Yes', mono('Ravi R DS')],
            ]}
          />
          <p className="text-[19px]" style={{ color: colors.ink }}>
            R uses 3 of the 4 possible pairs, so R ⊆ S × C
          </p>
        </div>
      </ContentSlide>
    ),
    notes: 'A × B is the menu of all possible pairs; a relation is the order you actually place. Any choice of pairs, even an empty one, is a relation.',
  },
  {
    id: 'c1-count',
    section: C1,
    label: 'Counting Relations',
    element: (
      <ContentSlide
        kicker={C1}
        title="Counting Relations"
        lead="Each of the mn pairs is either in R or not: 2^(mn) relations"
        lesson={SESSION}
        points={[
          { text: 'From S to C: 2^4 = 16 relations', icon: 'target' },
          { text: 'The empty relation ∅: no pairs', icon: 'dot' },
          { text: 'The universal relation A × B: every pair', icon: 'check' },
        ]}
      >
        <BitStrip
          elements={['(A, DM)', '(A, DS)', '(R, DM)', '(R, DS)']}
          cell={78}
          labelWidth={90}
          frames={[
            { rows: [{ label: 'Enrolled', bits: '1011' }] },
            { rows: [{ label: 'Enrolled', bits: '1011' }, { label: 'Empty', bits: '0000' }, { label: 'Universal', bits: '1111' }], caption: '2 × 2 × 2 × 2 = 16 settings' },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'The relations from A to B are exactly the elements of P(A × B). Exam hook: |A| = 3 and |B| = 2 gives 2^6 = 64.',
  },
  {
    id: 'c1-binary',
    section: C1,
    label: 'Binary Relations',
    element: (
      <ContentSlide
        kicker={C1}
        title="Binary Relations"
        lead="A relation from a set A to itself: a subset of A × A"
        lesson={SESSION}
        points={[
          { text: '“Less than” on {1, 2, 3}', sub: '{(1, 2), (1, 3), (2, 3)}', icon: 'arrow' },
          { text: '“Equal to”, the identity relation', sub: '{(1, 1), (2, 2), (3, 3)}: the diagonal', icon: 'check' },
          { text: 'On n elements: 2^(n²) relations', sub: 'For n = 3: 2^9 = 512', icon: 'target' },
        ]}
      >
        <Matrix
          cols={['1', '2', '3']}
          rows={[]}
          frames={[
            { rows: [['1', '011'], ['2', '001'], ['3', '000']], caption: 'Less than' },
            { rows: [['1', '100'], ['2', '010'], ['3', '001']], caption: 'Equal to', ring: [0, 1, 2] },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Binary means each fact involves two elements. The identity relation is the diagonal of the grid; this picture helps with reflexive relations.',
  },
  {
    id: 'c1-domain',
    section: C1,
    label: 'Domain and Range',
    element: (
      <ContentSlide
        kicker={C1}
        title="Domain and Range"
        lead="R = {(1, 2), (1, 4), (2, 4), (3, 6)} on {1, …, 6}"
        lesson={SESSION}
        points={[
          { text: 'Domain: first elements used', sub: '{1, 2, 3}', icon: 'arrow' },
          { text: 'Range: second elements used', sub: '{2, 4, 6}', icon: 'target' },
          { text: '5 is in neither: no pair uses it', icon: 'dot' },
        ]}
      >
        <RelationGraph
          width={420}
          height={340}
          frames={one({
            nodes: columns(
              [
                ['1', '2', '3', '4', '5', '6'].map((v) => ({ id: `a${v}`, label: v, state: (['1', '2', '3'].includes(v) ? 'lit' : 'plain') as NodeState })),
                ['1', '2', '3', '4', '5', '6'].map((v) => ({ id: `b${v}`, label: v, state: (['2', '4', '6'].includes(v) ? 'ok' : 'plain') as NodeState })),
              ],
              { x0: 90, top: 30, colGap: 240, rowGap: 56 },
            ),
            edges: pairs([['a1', 'b2'], ['a1', 'b4'], ['a2', 'b4'], ['a3', 'b6']]),
          })}
        />
      </ContentSlide>
    ),
    notes: 'Common slip: the domain is not the whole set A, only the part used as first elements. The enrolment relation has domain {Asha, Ravi} and range {DM, DS}.',
  },
  {
    id: 'c1-list',
    section: C1,
    label: 'From Rule to List',
    element: (
      <ContentSlide kicker={C1} title="From Rule to List" lead="R = {(x, y) | x divides y} on {1, 2, 3, 4}" lesson={SESSION}>
        <div className="w-full space-y-3">
          <DataTable
            className="w-full"
            stepped
            compact
            columns={[{ label: 'x' }, { label: 'y values that work' }, { label: 'Pairs' }]}
            rows={[
              ['1', '1, 2, 3, 4', mono('(1, 1) (1, 2) (1, 3) (1, 4)')],
              ['2', '2, 4', mono('(2, 2) (2, 4)')],
              ['3', '3', mono('(3, 3)')],
              ['4', '4', mono('(4, 4)')],
            ]}
          />
          <Callout kind="info" title="Try it" asStep>
            x + y = 5 on {'{1, 2, 3, 4}'} gives (1, 4), (2, 3), (3, 2), (4, 1)
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes: 'Work through x = 1, 2, 3, 4 and ask which y values work: 8 pairs. Keep this relation on the board; it returns as a matrix and a digraph.',
  },
  {
    id: 'c1-matrix',
    section: C1,
    label: 'The Relation Matrix',
    element: (
      <ContentSlide
        kicker={C1}
        title="The Relation Matrix"
        lead="A grid with 1 where the pair is in R, and 0 where it is not"
        lesson={SESSION}
        points={[
          { text: 'Rows: the first element x', icon: 'arrow' },
          { text: 'Columns: the second element y', icon: 'arrow' },
          { text: 'Count the 1s: 8, one for each pair', icon: 'check' },
        ]}
      >
        <Matrix cols={['1', '2', '3', '4']} rows={DIV_MATRIX} />
      </ContentSlide>
    ),
    notes: 'mᵢⱼ = 1 if aᵢ R bⱼ, else 0. Fix the order of elements once and use it for rows and columns.',
  },
  {
    id: 'c1-read-matrix',
    section: C1,
    label: 'Matrix to Pairs',
    element: (
      <ContentSlide
        kicker={C1}
        title="Matrix to Pairs"
        lead="Every 1 in row aᵢ and column bⱼ is the pair (aᵢ, bⱼ)"
        lesson={SESSION}
        points={[{ text: 'Which relation on {a, b, c} is this?', icon: 'bulb' }, { text: 'Different set sizes give a rectangular matrix', icon: 'info' }]}
      >
        <Matrix
          cols={['a', 'b', 'c']}
          rows={[]}
          frames={[
            { rows: [['a', '010'], ['b', '001'], ['c', '100']] },
            { rows: [['a', '010'], ['b', '001'], ['c', '100']], caption: 'R = {(a, b), (b, c), (c, a)}', ring: [0, 1, 2] },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Ask learners to write the enrolment matrix: row Asha is 1 0, row Ravi is 1 1.',
  },
  {
    id: 'c1-digraph',
    section: C1,
    label: 'Digraph Representation',
    element: (
      <ContentSlide
        kicker={C1}
        title="Digraph Representation"
        lead="“x divides y” on {1, 2, 3, 4}, drawn as dots and arrows"
        lesson={SESSION}
        points={[
          { text: 'One dot, a vertex, for each element', icon: 'dot' },
          { text: 'An arrow from a to b for each pair', icon: 'arrow' },
          { text: 'A loop for each pair (a, a)', icon: 'route' },
        ]}
      >
        <RelationGraph
          width={400}
          height={340}
          frames={[
            { nodes: DIV_NODES() },
            { nodes: DIV_NODES(), edges: DIV_ARROWS },
            { nodes: DIV_NODES(), edges: [...DIV_ARROWS, ...DIV_LOOPS()], caption: '4 loops + 4 arrows = 8 pairs' },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Draw it live on the board. Count arrows including loops: 8, the same 8 pairs again.',
  },
  {
    id: 'c1-three-views',
    section: C1,
    label: 'Three Views',
    element: (
      <ContentSlide kicker={C1} title="Three Views" lead="One relation, three ways to write it" lesson={SESSION}>
        <DataTable
          className="w-full"
          stepped
          columns={[{ label: 'Representation' }, { label: 'What it looks like', weight: 1.3 }, { label: 'Best for', weight: 1.3 }]}
          rows={[
            ['Ordered pairs', mono('{(a, b), (b, c), (c, a)}'), 'Writing answers; small relations'],
            ['Relation matrix', 'A grid of 0s and 1s', 'Computers; checking properties quickly'],
            ['Directed graph', 'Dots joined by arrows', 'Seeing paths, loops and cycles'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Try it: the digraph of {(a, b), (b, c), (c, a)} is a triangle a → b → c → a with no loops. The matrix and the digraph are exactly the tests the next concept uses.',
  },

  /* ── CONCEPT 2 ───────────────────────────────────────────────────────── */
  { id: 'c2-divider', section: C2, label: 'Divider', element: <SectionBreakerSlide index={2} title={C2} lesson={SESSION} /> },
  {
    id: 'c2-known',
    section: C2,
    label: 'Relations We Know',
    element: (
      <ContentSlide kicker={C2} title="Relations We Know" lead="Three relations the room already uses" lesson={SESSION}>
        <div className="grid w-full grid-cols-3 gap-6">
          {[
            { t: 'Divides on {1, 2, 3}', e: [...pairs([['1', '2'], ['1', '3']]), loop('1', 'left'), loop('2', 'top'), loop('3', 'bottom')] },
            { t: 'Less than on {1, 2, 3}', e: pairs([['1', '2'], ['1', '3'], ['2', '3']]) },
            { t: 'Is a sibling of', e: pairs([['1', '2'], ['2', '1'], ['2', '3'], ['3', '2'], ['1', '3'], ['3', '1']]).map((x) => ({ ...x, bend: 18 })) },
          ].map((g) => (
            <div key={g.t}>
              <p className="mb-2 font-heading text-[18px] font-semibold" style={{ color: colors.ink }}>
                {g.t}
              </p>
              <RelationGraph width={300} height={250} frames={one({ nodes: [N('1', 70, 70), N('2', 230, 70), N('3', 150, 200)], edges: g.e })} />
            </div>
          ))}
        </div>
      </ContentSlide>
    ),
    notes: 'Added opening slide. For the sibling graph, read the dots as three siblings.',
  },
  {
    id: 'c2-alike',
    section: C2,
    label: 'Alike, but How?',
    element: (
      <ContentSlide
        kicker={C2}
        title="Alike, but How?"
        lead="Some relations share a pattern, but we have no name for it yet"
        lesson={SESSION}
        points={[
          { text: 'Divides: a loop at every dot', icon: 'route' },
          { text: 'Sibling: every arrow has a return arrow', icon: 'arrow' },
          { text: 'Without names, we cannot test or compare them', icon: 'warning' },
        ]}
      />
    ),
    notes: 'Added opening slide. Five named patterns follow, each with a matrix test and a digraph test.',
  },
  {
    id: 'c2-reflexive',
    section: C2,
    label: 'Reflexive',
    element: (
      <ContentSlide
        kicker={C2}
        title="Reflexive"
        lead="(a, a) ∈ R for every a in A: every element related to itself"
        lesson={SESSION}
        points={[
          { text: 'Matrix test: the diagonal is all 1s', icon: 'check' },
          { text: 'Digraph test: a loop at every vertex', icon: 'route' },
          { text: 'Divides, ≤, “same birth month”', icon: 'star' },
          { text: 'Not reflexive: {(1, 1), (2, 2)} on {1, 2, 3}', sub: '(3, 3) is missing', icon: 'cross' },
        ]}
      >
        <RelationGraph width={400} height={340} frames={one({ nodes: DIV_NODES(), edges: [...DIV_ARROWS.map((e) => ({ ...e, tone: 'muted' as const })), ...DIV_LOOPS('ok')] })} />
      </ContentSlide>
    ),
    notes: '"Every" is the whole point: one missing loop breaks reflexivity.',
  },
  {
    id: 'c2-irreflexive',
    section: C2,
    label: 'Irreflexive',
    element: (
      <ContentSlide kicker={C2} title="Irreflexive" lead="(a, a) ∉ R for every a: no element related to itself, as in “<”" lesson={SESSION}>
        <DataTable
          className="w-full"
          revealColumn={2}
          columns={[{ label: 'Relation on {1, 2}', weight: 1.4 }, { label: 'Reflexive?' }, { label: 'Irreflexive?' }]}
          rows={[
            [mono('{(1, 1), (2, 2), (1, 2)}'), 'Yes', 'No'],
            [mono('{(1, 2)}'), 'No', 'Yes'],
            [mono('{(1, 1)}'), 'No', 'No: neither'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Matrix test: diagonal all 0. Digraph test: no loops. The last row is the trap: not reflexive does not mean irreflexive.',
  },
  {
    id: 'c2-symmetric',
    section: C2,
    label: 'Symmetric',
    element: (
      <ContentSlide
        kicker={C2}
        title="Symmetric"
        lead="(a, b) ∈ R means (b, a) ∈ R: every connection goes both ways"
        lesson={SESSION}
        points={[
          { text: 'Matrix test: equal to its transpose', sub: 'mᵢⱼ = mⱼᵢ for all i, j', icon: 'check' },
          { text: 'Digraph test: every arrow has a return arrow', icon: 'arrow' },
          { text: 'Facebook friend is symmetric', sub: 'Instagram follows is not', icon: 'star' },
          { text: 'Divides is not: 1 | 2 but 2 ∤ 1', icon: 'cross' },
        ]}
      >
        <RelationGraph
          width={400}
          height={300}
          frames={one({ nodes: [N('a', 80, 80), N('b', 320, 80), N('c', 200, 240)], edges: pairs([['a', 'b'], ['b', 'a'], ['b', 'c'], ['c', 'b']], { bend: 16 }) })}
        />
      </ContentSlide>
    ),
    notes: 'Ask learners to classify "is a sister of": not symmetric. Asha is a sister of Ravi, but Ravi is not a sister of Asha.',
  },
  {
    id: 'c2-antisymmetric',
    section: C2,
    label: 'Antisymmetric',
    element: (
      <ContentSlide
        kicker={C2}
        title="Antisymmetric"
        lead="(a, b) and (b, a) both in R only when a = b"
        lesson={SESSION}
        points={[
          { text: 'Matrix test: for i ≠ j, mᵢⱼ and mⱼᵢ never both 1', icon: 'check' },
          { text: 'Digraph test: no two-way arrows', sub: 'Loops are allowed', icon: 'arrow' },
          { text: '≤, divides, ⊆', icon: 'star' },
        ]}
      >
        <RelationGraph
          width={400}
          height={300}
          frames={one({
            nodes: [N('a', 80, 80), N('b', 320, 80), N('c', 90, 230), N('d', 310, 230)],
            edges: [{ id: 'ab', from: 'a', to: 'b', tone: 'ok' }, loop('a', 'top', 'ok'), { id: 'cd', from: 'c', to: 'd', bend: 16, tone: 'danger' }, { id: 'dc', from: 'd', to: 'c', bend: 16, tone: 'danger', crossed: true }],
          })}
        />
      </ContentSlide>
    ),
    notes: 'Check divides on {1, 2, 3, 4}: the only two-way pairs are loops like (2, 2), where a = b. So it is antisymmetric.',
  },
  {
    id: 'c2-not-opposites',
    section: C2,
    label: 'Not Opposites',
    element: (
      <ContentSlide kicker={C2} title="Not Opposites" lead="Symmetric and antisymmetric can both hold, or neither" lesson={SESSION}>
        <DataTable
          className="w-full"
          stepped
          columns={[{ label: 'Relation on {1, 2, 3}', weight: 1.5 }, { label: 'Symmetric?' }, { label: 'Antisymmetric?' }]}
          rows={[
            [mono('{(1, 1), (2, 2)}'), 'Yes', 'Yes'],
            [mono('{(1, 2), (2, 1)}'), 'Yes', 'No'],
            [mono('{(1, 2)}'), 'No', 'Yes'],
            [mono('{(1, 2), (2, 1), (1, 3)}'), 'No', 'No'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Row 1: no pairs between different elements, so both hold. Row 4: (1, 3) has no return arrow, and (1, 2), (2, 1) are both present with 1 ≠ 2. Exam hook: "not symmetric" does not mean "antisymmetric".',
  },
  {
    id: 'c2-transitive',
    section: C2,
    label: 'Transitive',
    element: (
      <ContentSlide
        kicker={C2}
        title="Transitive"
        lead="(a, b) and (b, c) in R means (a, c) is in R too"
        lesson={SESSION}
        points={[
          { text: 'Every two-arrow path has a shortcut', icon: 'route' },
          { text: '<, ≤, divides, “is an ancestor of”', icon: 'check' },
          { text: 'Not: “is a parent of”', sub: "A parent's parent is a grandparent", icon: 'cross' },
        ]}
      >
        <RelationGraph
          width={440}
          height={260}
          frames={[
            { nodes: [N('hyd', 80, 200, { label: 'Hyderabad', w: 120 }), N('vij', 220, 60, { label: 'Vijayawada', w: 130 }), N('che', 360, 200, { label: 'Chennai', w: 110 })], edges: pairs([['hyd', 'vij'], ['vij', 'che']]) },
            {
              nodes: [N('hyd', 80, 200, { label: 'Hyderabad', w: 120 }), N('vij', 220, 60, { label: 'Vijayawada', w: 130 }), N('che', 360, 200, { label: 'Chennai', w: 110 })],
              edges: [...pairs([['hyd', 'vij'], ['vij', 'che']]), { id: 'short', from: 'hyd', to: 'che', tone: 'ok' }],
              caption: 'The shortcut a transitive network must have',
            },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Transitivity is the property learners check least carefully. The next slide gives a systematic method.',
  },
  {
    id: 'c2-check',
    section: C2,
    label: 'A Systematic Check',
    element: (
      <ContentSlide kicker={C2} title="A Systematic Check" lead="R = {(1, 2), (2, 3), (1, 3), (3, 3)}: chain every matching pair" lesson={SESSION}>
        <div className="w-full space-y-3">
          <DataTable
            className="w-full"
            stepped
            compact
            columns={[{ label: 'Chain', weight: 1.4 }, { label: 'Needs' }, { label: 'Present?' }]}
            rows={[
              [mono('(1, 2), (2, 3)'), mono('(1, 3)'), 'Yes'],
              [mono('(1, 3), (3, 3)'), mono('(1, 3)'), 'Yes'],
              [mono('(2, 3), (3, 3)'), mono('(2, 3)'), 'Yes'],
              [mono('(3, 3), (3, 3)'), mono('(3, 3)'), 'Yes'],
            ]}
          />
          <Callout kind="warning" title="Not transitive" asStep>
            {'{(1, 2), (2, 1)}: the chain (1, 2), (2, 1) needs (1, 1), which is missing'}
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes: 'Every chain closes, so R is transitive. The second example is the classic trap: a chain that goes out and back needs the loop (a, a).',
  },
  {
    id: 'c2-glance',
    section: C2,
    label: 'Properties at a Glance',
    element: (
      <ContentSlide kicker={C2} title="Properties at a Glance" lead="The checklist for everything that follows" lesson={SESSION}>
        <DataTable
          className="w-full"
          stepped
          compact
          columns={[{ label: 'Property' }, { label: 'Condition', weight: 1.5 }, { label: 'Matrix test', weight: 1.3 }, { label: 'Digraph test', weight: 1.4 }]}
          rows={[
            ['Reflexive', '(a, a) ∈ R for all a', 'Diagonal all 1', 'Loop at every vertex'],
            ['Irreflexive', '(a, a) ∉ R for all a', 'Diagonal all 0', 'No loops'],
            ['Symmetric', '(a, b) ∈ R ⇒ (b, a) ∈ R', 'Equals its transpose', 'Every arrow has a return'],
            ['Antisymmetric', '(a, b), (b, a) ∈ R ⇒ a = b', 'Off-diagonal 1s never paired', 'No two-way arrows'],
            ['Transitive', '(a, b), (b, c) ∈ R ⇒ (a, c) ∈ R', 'Check every chain', 'Every path has a shortcut'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'The revision slide for the five properties. Ask learners to copy it.',
  },
  {
    id: 'c2-compose',
    section: C2,
    label: 'Chaining Relations',
    element: (
      <ContentSlide
        kicker={C2}
        title="Chaining Relations"
        lead="R from A to B, then S from B to C, gives R ∘ S from A to C"
        lesson={SESSION}
        points={[
          { text: '(a, c) ∈ R ∘ S when some b has (a, b) ∈ R and (b, c) ∈ S', icon: 'route' },
          { text: 'Flights: home to hub, then hub to destination', sub: 'R ∘ S: where you reach with one change', icon: 'globe' },
        ]}
      >
        <RelationGraph
          width={440}
          height={260}
          frames={[
            { nodes: columns([[{ id: 'a', label: 'a' }], [{ id: 'b', label: 'b' }], [{ id: 'c', label: 'c' }]], { x0: 50, top: 130, colGap: 170 }), edges: pairs([['a', 'b'], ['b', 'c']]) },
            {
              nodes: columns([[{ id: 'a', label: 'a' }], [{ id: 'b', label: 'b' }], [{ id: 'c', label: 'c' }]], { x0: 50, top: 130, colGap: 170 }),
              edges: [...pairs([['a', 'b'], ['b', 'c']]), { id: 'ac', from: 'a', to: 'c', kind: 'dashed', bend: -80, tone: 'ok' }],
              caption: 'Two steps become one pair of R ∘ S',
            },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Notation: Tremblay and Manohar write R ∘ S for "R first, then S". Some books, such as Rosen, write the same relation as S ∘ R. Always check the convention.',
  },
  {
    id: 'c2-compute',
    section: C2,
    label: 'Computing R ∘ S',
    element: (
      <ContentSlide kicker={C2} title="Computing R ∘ S" lead="R = {(1, x), (2, x), (3, y)} and S = {(x, p), (y, p), (y, q)}" lesson={SESSION}>
        <div className="grid w-full grid-cols-[1fr_1.1fr] items-center gap-8">
          <RelationGraph
            width={460}
            height={260}
            frames={[
              { nodes: COMP_NODES, edges: COMP_EDGES() },
              { nodes: COMP_NODES, edges: COMP_EDGES(['1>x', 'x>p']) },
              { nodes: COMP_NODES, edges: COMP_EDGES(['2>x', 'x>p']) },
              { nodes: COMP_NODES, edges: COMP_EDGES(['3>y', 'y>p', 'y>q']) },
            ]}
          />
          <DataTable
            className="w-full"
            stepped
            compact
            columns={[{ label: 'a' }, { label: 'R takes a to' }, { label: 'S takes that to' }, { label: 'Pairs', weight: 2 }]}
            rows={[
              ['1', 'x', 'p', mono('(1, p)')],
              ['2', 'x', 'p', mono('(2, p)')],
              ['3', 'y', 'p, q', mono('(3, p), (3, q)')],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: 'R ∘ S = {(1, p), (2, p), (3, p), (3, q)}. Work row by row: where R sends a, then where S sends each of those.',
  },
  {
    id: 'c2-boolean',
    section: C2,
    label: 'Boolean Product',
    element: (
      <ContentSlide kicker={C2} title="Boolean Product" lead="Multiply M_R and M_S with OR for + and AND for ×" lesson={SESSION}>
        <div className="flex w-full items-center gap-6">
          <div>
            <p className="mb-1 font-heading text-[17px] font-semibold" style={{ color: colors.ink }}>M_R</p>
            <Matrix cols={['x', 'y']} rows={[['1', '10'], ['2', '10'], ['3', '01']]} cell={44} />
          </div>
          <span className="font-heading text-[30px]" style={{ color: colors.brand }}>⊙</span>
          <div>
            <p className="mb-1 font-heading text-[17px] font-semibold" style={{ color: colors.ink }}>M_S</p>
            <Matrix cols={['p', 'q']} rows={[['x', '10'], ['y', '11']]} cell={44} />
          </div>
          <span className="font-heading text-[30px]" style={{ color: colors.brand }}>=</span>
          <Step>
            <p className="mb-1 font-heading text-[17px] font-semibold" style={{ color: colors.ink }}>Matrix of R ∘ S</p>
            <Matrix cols={['p', 'q']} rows={[['1', '10'], ['2', '10'], ['3', '11']]} cell={44} />
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: 'Row 3: (0 AND 1) OR (1 AND 1) = 1 for p, and (0 AND 0) OR (1 AND 1) = 1 for q. The result matches the arrow method.',
  },
  {
    id: 'c2-order',
    section: C2,
    label: 'Order Matters',
    element: (
      <ContentSlide kicker={C2} title="Order Matters" lead="R = {(1, 2), (2, 3)} and S = {(2, 1), (3, 3)} on {1, 2, 3}" lesson={SESSION}>
        <DataTable
          className="w-full"
          stepped
          columns={[{ label: 'Compute', weight: 0.8 }, { label: 'Result', weight: 1 }, { label: 'So', weight: 1.6 }]}
          rows={[
            [mono('R ∘ S'), mono('{(1, 1), (2, 3)}'), 'Not the same as S ∘ R'],
            [mono('S ∘ R'), mono('{(2, 2)}'), 'Composition is not commutative'],
            [mono('(R ∘ S) ∘ T'), mono('R ∘ (S ∘ T)'), 'But it is associative'],
            [mono('R² = R ∘ R'), mono('{(1, 3)}'), 'Transitive exactly when R² ⊆ R: here it is not'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'For S ∘ R: (2, 1) then (1, 2) gives (2, 2); (3, 3) cannot continue because R has no pair starting with 3. R² ⊆ R links composition back to transitivity.',
  },
  {
    id: 'c2-your-turn',
    section: C2,
    label: 'Your Turn',
    element: (
      <ContentSlide kicker={C2} title="Your Turn" lead="Test both relations on {1, 2, 3} for all five properties" lesson={SESSION}>
        <DataTable
          className="w-full"
          compact
          columns={[{ label: 'Property' }, { label: 'R₁ = {(1, 1), (2, 2), (3, 3), (1, 2), (2, 1)}', weight: 2.2 }, { label: 'R₂ = “<” = {(1, 2), (1, 3), (2, 3)}', weight: 2 }]}
          rows={(
            [
              ['Reflexive', 'Yes', 'No'],
              ['Irreflexive', 'No', 'Yes'],
              ['Symmetric', 'Yes', 'No'],
              ['Antisymmetric', 'No', 'Yes'],
              ['Transitive', 'Yes', 'Yes'],
            ] as const
          ).map(([p, a, b]) => [
            p,
            <Step key="a" style={{ color: a === 'Yes' ? colors.success : colors.danger }}>{a}</Step>,
            <Step key="b" style={{ color: b === 'Yes' ? colors.success : colors.danger }}>{b}</Step>,
          ])}
        />
      </ContentSlide>
    ),
    notes: 'R₁ transitivity: (1, 2), (2, 1) and (2, 1), (1, 2) need (1, 1) and (2, 2), both present. R₂ is antisymmetric because no two-way pair exists. R₁ is reflexive, symmetric and transitive.',
  },
  {
    id: 'c2-named',
    section: C2,
    label: 'Named Combinations',
    element: (
      <ContentSlide kicker={C2} title="Named Combinations" lead="Three combinations of properties have names of their own" lesson={SESSION}>
        <div className="w-full space-y-4">
          {[
            { name: 'Equivalence relation', props: ['Reflexive', 'Symmetric', 'Transitive'] },
            { name: 'Compatibility relation', props: ['Reflexive', 'Symmetric'] },
            { name: 'Partial order', props: ['Reflexive', 'Antisymmetric', 'Transitive'] },
          ].map((r) => (
            <Step key={r.name} className="flex items-center gap-5 rounded-card border border-line bg-white px-5 py-4 shadow-card-soft">
              <span className="w-[280px] font-heading text-[21px] font-semibold" style={{ color: colors.ink }}>
                {r.name}
              </span>
              <Chips items={r.props.map((p) => ({ text: p }))} />
            </Step>
          ))}
        </div>
      </ContentSlide>
    ),
    notes: 'Added Integration slide. R₁ from the practice is the first kind; the next two concepts take each family in turn.',
  },
  { id: 'quiz-1', section: C2, label: 'Quiz Time', element: <QuizTimeSlide lesson={SESSION} />, notes: 'Mid-deck check: both later concepts are built from these properties.' },

  /* ── CONCEPT 3 ───────────────────────────────────────────────────────── */
  { id: 'c3-divider', section: C3, label: 'Divider', element: <SectionBreakerSlide index={3} title={C3} lesson={SESSION} /> },
  {
    id: 'c3-alike',
    section: C3,
    label: 'Alike in One Way',
    element: (
      <ContentSlide
        kicker={C3}
        title="Alike in One Way"
        lead="We often group things that match in one feature"
        lesson={SESSION}
        points={[
          { text: 'Students with the same birth month', icon: 'star' },
          { text: 'Integers with the same remainder on division by 3', icon: 'target' },
          { text: 'Students in the same branch', icon: 'book' },
        ]}
      >
        <BitStrip
          elements={['Asha', 'Ben', 'Chen', 'Dev', 'Esha', 'Ravi']}
          cell={56}
          labelWidth={80}
          frames={[{ rows: [{ label: 'March', bits: '100101' }, { label: 'July', bits: '011010' }] }]}
        />
      </ContentSlide>
    ),
    notes: 'Ask learners for one example from college life.',
  },
  {
    id: 'c3-clean',
    section: C3,
    label: 'Clean Groups',
    element: (
      <ContentSlide
        kicker={C3}
        title="Clean Groups"
        lead="A grouping by a feature must never partly overlap"
        lesson={SESSION}
        points={[
          { text: 'Every student is in a section', icon: 'check' },
          { text: 'Sharing a section works both ways', icon: 'arrow' },
          { text: 'One student in two half-overlapping sections is a mistake', icon: 'cross' },
        ]}
      >
        <RelationGraph
          width={440}
          height={220}
          frames={one({
            nodes: [N('a', 70, 110, { label: 'Asha', w: 90 }), N('r', 210, 110, { label: 'Ravi', w: 90 }), N('s', 350, 110, { label: 'Sana', w: 90 })],
            groups: [
              { id: 'g1', nodes: ['a', 'r'], tone: 'danger' },
              { id: 'g2', nodes: ['r', 's'], tone: 'danger', crossed: true },
            ],
          })}
        />
      </ContentSlide>
    ),
    notes: 'Added opening slide. Which relation guarantees clean, non-overlapping groups? That is the definition that follows.',
  },
  {
    id: 'c3-equivalence',
    section: C3,
    label: 'Equivalence Relations',
    element: (
      <ContentSlide
        kicker={C3}
        title="Equivalence Relations"
        lead="A relation that is reflexive, symmetric and transitive"
        lesson={SESSION}
        points={[
          { text: '“Is equal to” on any set', icon: 'check' },
          { text: '“Has the same birth month as”', icon: 'check' },
          { text: '“Has the same remainder when divided by 3”', icon: 'check' },
          { text: 'R₁ from the practice', icon: 'check' },
        ]}
      >
        <Chips items={[{ text: 'Reflexive' }, { text: 'Symmetric' }, { text: 'Transitive' }]} />
      </ContentSlide>
    ),
    notes: 'An equivalence relation says two things are "the same" with respect to one feature.',
  },
  {
    id: 'c3-mod3',
    section: C3,
    label: 'Congruence Modulo 3',
    element: (
      <ContentSlide kicker={C3} title="Congruence Modulo 3" lead="a ≡ b (mod 3) means 3 divides a − b" lesson={SESSION}>
        <div className="w-full space-y-3">
          <StepCards
            items={[
              ['Reflexive', 'a − a = 0 = 3 × 0, so a ≡ a'],
              ['Symmetric', 'a − b = 3k gives b − a = 3(−k), so b ≡ a'],
              ['Transitive', 'a − b = 3k and b − c = 3m give a − c = 3(k + m)'],
            ]}
          />
          <p className="text-[19px]" style={{ color: colors.ink }}>
            7 ≡ 1 (mod 3) since 7 − 1 = 6, but 8 ≢ 3 (mod 3) since 8 − 3 = 5
          </p>
        </div>
      </ContentSlide>
    ),
    notes: 'This proof pattern, difference = 3 × integer, works for any modulus n. Exam hook: prove congruence modulo n is an equivalence relation.',
  },
  {
    id: 'c3-classes',
    section: C3,
    label: 'Equivalence Classes',
    element: (
      <ContentSlide kicker={C3} title="Equivalence Classes" lead="[a] = {x | x R a}: everything related to a. Mod 3 on {1, …, 9}" lesson={SESSION}>
        <div className="w-full space-y-3">
          <BitStrip
            elements={['1', '2', '3', '4', '5', '6', '7', '8', '9']}
            labelWidth={160}
            setWidth={200}
            frames={[
              { rows: [] },
              { rows: [{ label: '[1]: rem 1', bits: '100100100', set: '{1, 4, 7}' }] },
              { rows: [{ label: '[1]: rem 1', bits: '100100100', set: '{1, 4, 7}' }, { label: '[2]: rem 2', bits: '010010010', set: '{2, 5, 8}' }] },
              {
                rows: [
                  { label: '[1]: rem 1', bits: '100100100', set: '{1, 4, 7}' },
                  { label: '[2]: rem 2', bits: '010010010', set: '{2, 5, 8}' },
                  { label: '[3]: rem 0', bits: '001001001', set: '{3, 6, 9}' },
                ],
                caption: 'Any member names its class: [4] = [7] = [1]',
              },
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: 'Ask learners for [5] and [9]. On all of Z the classes are infinite, for example [0] = {…, −3, 0, 3, 6, …}.',
  },
  {
    id: 'c3-behave',
    section: C3,
    label: 'How Classes Behave',
    element: (
      <ContentSlide
        kicker={C3}
        title="How Classes Behave"
        lead="Two classes are equal or disjoint, never in between"
        lesson={SESSION}
        points={[
          { text: 'a ∈ [a], so no class is empty', icon: 'check' },
          { text: 'a R b exactly when [a] = [b]', icon: 'check' },
          { text: 'Every element lies in exactly one class', icon: 'check' },
        ]}
      >
        <RelationGraph
          width={440}
          height={230}
          frames={one({
            nodes: [N('1', 60, 70), N('4', 160, 70), N('2', 290, 70), N('5', 390, 70), N('x', 160, 180, { label: '7' }), N('y', 290, 180, { label: '8' })],
            groups: [
              { id: 'g1', nodes: ['1', '4'], tone: 'ok' },
              { id: 'g2', nodes: ['2', '5'], tone: 'ok' },
              { id: 'g3', nodes: ['x', 'y'], tone: 'danger', crossed: true },
            ],
          })}
        />
      </ContentSlide>
    ),
    notes: 'Why: if x were in both [a] and [b], then a R x and x R b, so a R b by symmetry and transitivity, and the classes would be equal. The crossed oval mixes two classes.',
  },
  {
    id: 'c3-partition',
    section: C3,
    label: 'Partitions',
    element: (
      <ContentSlide
        kicker={C3}
        title="Partitions"
        lead="Blocks that are non-empty, never share an element, and cover A"
        lesson={SESSION}
        points={[
          { text: 'The classes of an equivalence relation form a partition', icon: 'check' },
          { text: 'Written A/R', sub: 'Mod 3: {{1, 4, 7}, {2, 5, 8}, {3, 6, 9}}', icon: 'info' },
          { text: 'Not a partition: {{1, 2}, {2, 3}}', sub: '2 is in two blocks', icon: 'cross' },
        ]}
      >
        <RelationGraph
          width={440}
          height={260}
          frames={one({
            nodes: columns(
              [
                ['1', '4', '7'].map((v) => ({ id: v, label: v })),
                ['2', '5', '8'].map((v) => ({ id: v, label: v })),
                ['3', '6', '9'].map((v) => ({ id: v, label: v })),
              ],
              { x0: 80, top: 50, colGap: 140, rowGap: 80 },
            ),
            groups: [
              { id: 'b1', nodes: ['1', '4', '7'] },
              { id: 'b2', nodes: ['2', '5', '8'] },
              { id: 'b3', nodes: ['3', '6', '9'] },
            ],
          })}
        />
      </ContentSlide>
    ),
    notes: 'Check the three conditions with the class on the mod 3 example.',
  },
  {
    id: 'c3-back',
    section: C3,
    label: 'Partition to Relation',
    element: (
      <ContentSlide kicker={C3} title="Partition to Relation" lead="Same block means related. The partition {{a, b}, {c}} of {a, b, c}" lesson={SESSION}>
        <div className="flex w-full items-center gap-10">
          <RelationGraph
            width={360}
            height={240}
            frames={one({
              nodes: [N('a', 70, 140), N('b', 210, 140), N('c', 320, 140)],
              edges: [...pairs([['a', 'b'], ['b', 'a']], { bend: 18 }), loop('a', 'top'), loop('b', 'top'), loop('c', 'top')],
              groups: [{ id: 'ab', nodes: ['a', 'b'] }, { id: 'cc', nodes: ['c'] }],
            })}
          />
          <div className="space-y-3">
            <Matrix cols={['a', 'b', 'c']} rows={[['a', '110'], ['b', '110'], ['c', '001']]} />
            <p className="text-[19px]" style={{ color: colors.ink }}>
              5 pairs: 2² + 1² = 5
            </p>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: 'Equivalence relations and partitions are two descriptions of one thing. Listed block by block, the matrix shows square blocks of 1s on the diagonal.',
  },
  {
    id: 'c3-your-turn',
    section: C3,
    label: 'Your Turn',
    element: (
      <ContentSlide kicker={C3} title="Your Turn" lead="R = {(1, 1), (2, 2), (3, 3), (4, 4), (1, 3), (3, 1), (2, 4), (4, 2)}" lesson={SESSION}>
        <div className="grid w-full grid-cols-[1.3fr_1fr] items-center gap-8">
          <StepCards
            items={[
              ['Reflexive', 'All four loops are present'],
              ['Symmetric', '(1, 3) with (3, 1), and (2, 4) with (4, 2)'],
              ['Transitive', 'Every chain closes: (1, 3), (3, 1) needs (1, 1)'],
              ['Equivalence relation', 'Classes {1, 3} and {2, 4}'],
            ]}
          />
          <RelationGraph
            width={400}
            height={260}
            frames={one({
              nodes: [N('1', 70, 140), N('3', 170, 140), N('2', 250, 140), N('4', 350, 140)],
              edges: [...pairs([['1', '3'], ['3', '1'], ['2', '4'], ['4', '2']], { bend: 16 }), loop('1', 'top'), loop('3', 'top'), loop('2', 'top'), loop('4', 'top')],
            })}
          />
        </div>
      </ContentSlide>
    ),
    notes: 'Ask why "is a friend of" is not an equivalence relation: it fails transitivity.',
  },
  {
    id: 'c3-compat',
    section: C3,
    label: 'Compatibility Relations',
    element: (
      <ContentSlide
        kicker={C3}
        title="Compatibility Relations"
        lead="Reflexive and symmetric, but not necessarily transitive"
        lesson={SESSION}
        points={[
          { text: 'Words related when they share a letter', icon: 'chat' },
          { text: 'sun and nut share u, n; nut and tea share t', icon: 'check' },
          { text: 'But sun and tea share no letter: not transitive', icon: 'cross' },
        ]}
      >
        <RelationGraph width={440} height={150} frames={one({ nodes: WORDS(), edges: WORD_EDGES })} />
      </ContentSlide>
    ),
    notes: 'Reflexive and symmetric, so drawn with plain lines and no loops. Every equivalence relation is a compatibility relation, not the other way round.',
  },
  {
    id: 'c3-blocks',
    section: C3,
    label: 'Maximal Blocks',
    element: (
      <ContentSlide
        kicker={C3}
        title="Maximal Blocks"
        lead="A block: every two elements related. Maximal: inside no larger block"
        lesson={SESSION}
        points={[
          { text: '{sun, nut}, {nut, tea}, {tea, ear}', icon: 'check' },
          { text: 'They overlap at nut and tea', sub: 'So they form a covering, not a partition', icon: 'info' },
        ]}
      >
        <RelationGraph
          width={440}
          height={170}
          frames={[
            { nodes: WORDS(), edges: WORD_EDGES },
            { nodes: WORDS(), edges: WORD_EDGES, groups: [{ id: 'b1', nodes: ['sun', 'nut'] }] },
            { nodes: WORDS(), edges: WORD_EDGES, groups: [{ id: 'b1', nodes: ['sun', 'nut'] }, { id: 'b2', nodes: ['nut', 'tea'], tone: 'ok' }] },
            { nodes: WORDS(), edges: WORD_EDGES, groups: [{ id: 'b1', nodes: ['sun', 'nut'] }, { id: 'b2', nodes: ['nut', 'tea'], tone: 'ok' }, { id: 'b3', nodes: ['tea', 'ear'], tone: 'warn' }] },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'If "compatible" means two people can share a lab bench, a maximal block is a largest group where everyone can sit together.',
  },
  {
    id: 'c3-compare',
    section: C3,
    label: 'Equivalence or Compatibility',
    element: (
      <ContentSlide kicker={C3} title="Equivalence or Compatibility" lead="One missing property changes what the groups can do" lesson={SESSION}>
        <div className="w-full space-y-3">
          <DataTable
            className="w-full"
            stepped
            compact
            columns={[{ label: 'Feature' }, { label: 'Equivalence' }, { label: 'Compatibility' }]}
            rows={[
              ['Properties', 'Reflexive, symmetric, transitive', 'Reflexive, symmetric'],
              ['Groups formed', 'Equivalence classes', 'Maximal compatibility blocks'],
              ['Can groups overlap?', 'No: classes are disjoint', 'Yes: blocks may overlap'],
              ['Groups together form', 'A partition', 'A covering'],
            ]}
          />
          <Callout kind="success" title="Verdict">
            Transitivity is what stops the groups overlapping
          </Callout>
        </div>
      </ContentSlide>
    ),
  },

  /* ── CONCEPT 4 ───────────────────────────────────────────────────────── */
  { id: 'c4-divider', section: C4, label: 'Divider', element: <SectionBreakerSlide index={4} title={C4} lesson={SESSION} /> },
  {
    id: 'c4-order',
    section: C4,
    label: 'Things in Order',
    element: (
      <ContentSlide kicker={C4} title="Things in Order" lead="Some courses must come before others" lesson={SESSION} points={[{ text: 'Programming before Data Structures', icon: 'arrow' }, { text: 'Data Structures before Algorithms', icon: 'arrow' }]}>
        <RelationGraph width={440} height={300} frames={one({ nodes: COURSES(), edges: COURSE_EDGES })} />
      </ContentSlide>
    ),
    notes: 'Arrows point from a prerequisite to the course that needs it.',
  },
  {
    id: 'c4-not-every',
    section: C4,
    label: 'Not Every Pair',
    element: (
      <ContentSlide
        kicker={C4}
        title="Not Every Pair"
        lead="Discrete Maths and Programming need no order between them"
        lesson={SESSION}
        points={[
          { text: 'An equivalence relation only groups', sub: 'It cannot say “before”', icon: 'warning' },
          { text: 'We need a relation that orders, but not every pair', icon: 'target' },
        ]}
      >
        <RelationGraph width={440} height={300} frames={one({ nodes: COURSES({ dm: 'warn', prog: 'warn' }), edges: COURSE_EDGES })} />
      </ContentSlide>
    ),
    notes: 'Added opening slide. The only change from an equivalence relation is antisymmetric in place of symmetric.',
  },
  {
    id: 'c4-partial',
    section: C4,
    label: 'Partial Order',
    element: (
      <ContentSlide kicker={C4} title="Partial Order" lead="Reflexive, antisymmetric and transitive. (A, ≼) is a poset" lesson={SESSION}>
        <div className="w-full space-y-3">
          <DataTable
            className="w-full"
            stepped
            compact
            columns={[{ label: 'Poset' }, { label: 'Order relation', weight: 1.6 }]}
            rows={[
              [mono('(Z, ≤)'), 'Less than or equal to'],
              [mono('(Z⁺, |)'), 'Divides, on positive integers'],
              [mono('(P(S), ⊆)'), 'Subset of, on the power set of S'],
            ]}
          />
          <Callout kind="warning" title="Not partial orders" asStep>
            {'“<” is not reflexive; divides on Z fails: 2 | −2 and −2 | 2, but 2 ≠ −2'}
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes: 'Equivalence relations group things that are alike; partial orders arrange things in order. A set with a partial order is called a poset.',
  },
  {
    id: 'c4-proof',
    section: C4,
    label: 'Divides Is a Partial Order',
    element: (
      <ContentSlide kicker={C4} title="Divides Is a Partial Order" lead="(Z⁺, |) passes all three tests" lesson={SESSION}>
        <StepCards
          items={[
            ['Reflexive', 'a = 1 × a, so a | a'],
            ['Antisymmetric', 'b = ka and a = mb give mk = 1, so k = m = 1 and a = b'],
            ['Transitive', 'b = ka and c = mb give c = (mk)a, so a | c'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"Positive" is used in the antisymmetric step: mk = 1 forces k = m = 1 only for positive integers. That is why divides fails on all of Z.',
  },
  {
    id: 'c4-comparable',
    section: C4,
    label: 'Comparable or Not',
    element: (
      <ContentSlide
        kicker={C4}
        title="Comparable or Not"
        lead="a and b are comparable when a ≼ b or b ≼ a"
        lesson={SESSION}
        points={[
          { text: '3 and 6: comparable, since 3 | 6', icon: 'check' },
          { text: '4 and 6: incomparable', sub: 'Neither divides the other', icon: 'cross' },
          { text: 'Every pair comparable: a total order', sub: 'The poset is a chain, like (Z, ≤)', icon: 'route' },
        ]}
      >
        <RelationGraph
          width={440}
          height={220}
          frames={one({
            nodes: [N('3', 80, 60), N('6', 340, 60), N('4', 80, 170), N('6b', 340, 170, { label: '6' })],
            edges: [{ id: '36', from: '3', to: '6', tone: 'ok' }, { id: '46', from: '4', to: '6b', kind: 'line', tone: 'danger', crossed: true }],
          })}
        />
      </ContentSlide>
    ),
    notes: 'Incomparable pairs are why the order is called "partial".',
  },
  {
    id: 'c4-hasse',
    section: C4,
    label: 'Hasse Diagrams',
    element: (
      <ContentSlide kicker={C4} title="Hasse Diagrams" lead="({1, 2, 4}, |): from the full digraph to a clean picture" lesson={SESSION}>
        <div className="grid w-full grid-cols-[1fr_1.1fr] items-center gap-8">
          <StepCards items={[['Remove the loops', 'Reflexive is understood'], ['Remove implied arrows', 'Keep a → b only if nothing lies between'], ['Draw upward, drop the arrowheads']]} />
          <RelationGraph
            width={300}
            height={340}
            frames={[
              { nodes: H3, edges: [...pairs([['1', '2'], ['2', '4']]), { id: '1>4', from: '1', to: '4', bend: -60 }, loop('1', 'right'), loop('2', 'right'), loop('4', 'right')], caption: '6 pairs' },
              { nodes: H3, edges: [...pairs([['1', '2'], ['2', '4']]), { id: '1>4', from: '1', to: '4', bend: -60 }] },
              { nodes: H3, edges: pairs([['1', '2'], ['2', '4']]) },
              { nodes: H3, edges: pairs([['1', '2'], ['2', '4']], { kind: 'line' }), caption: 'Hasse diagram: 2 edges' },
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: 'b covers a when a ≺ b and no c lies strictly between them. Only cover pairs are drawn.',
  },
  {
    id: 'c4-d12',
    section: C4,
    label: 'Divisors of 12',
    element: (
      <ContentSlide
        kicker={C4}
        title="Divisors of 12"
        lead="({1, 2, 3, 4, 6, 12}, |): 18 pairs, 7 edges"
        lesson={SESSION}
        points={[
          { text: '1 is covered by 2 and 3', icon: 'arrow' },
          { text: '2 by 4 and 6; 3 by 6', icon: 'arrow' },
          { text: '4 and 6 by 12', icon: 'arrow' },
        ]}
      >
        <RelationGraph
          width={400}
          height={305}
          frames={[
            { nodes: D12().filter((n) => n.id === '1'), edges: [] },
            { nodes: D12().filter((n) => ['1', '2', '3'].includes(n.id)), edges: D12_EDGES().slice(0, 2) },
            { nodes: D12().filter((n) => n.id !== '12'), edges: D12_EDGES().slice(0, 5) },
            { nodes: D12(), edges: D12_EDGES() },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Ask why there is no edge 1–6: 1–2–6 already shows it. 4 and 6 sit on one level with no edge: they are incomparable.',
  },
  {
    id: 'c4-cube',
    section: C4,
    label: 'Power Set Hasse',
    element: (
      <ContentSlide
        kicker={C4}
        title="Power Set Hasse"
        lead="(P({a, b, c}), ⊆): the cube, 12 edges"
        lesson={SESSION}
        points={[
          { text: '∅ at the bottom, {a, b, c} at the top', icon: 'route' },
          { text: 'Each set joins the next-level sets that contain it', icon: 'link' },
          { text: '{a} and {b, c} are incomparable', icon: 'cross' },
        ]}
      >
        <RelationGraph width={460} height={400} frames={one({ nodes: CUBE(), edges: CUBE_EDGES })} />
      </ContentSlide>
    ),
    notes: 'This cube shape appears often in exams.',
  },
  {
    id: 'c4-read',
    section: C4,
    label: 'Reading the Order',
    element: (
      <ContentSlide kicker={C4} title="Reading the Order" lead="a ≼ b exactly when an upward path runs from a to b" lesson={SESSION} points={[{ text: 'Is 1 ≼ 12?', icon: 'bulb' }, { text: 'Is 3 ≼ 4?', icon: 'bulb' }, { text: 'Is 2 ≼ 12?', icon: 'bulb' }]}>
        <RelationGraph
          width={400}
          height={305}
          frames={[
            { nodes: D12(), edges: D12_EDGES() },
            { nodes: D12({ '1': 'ok', '2': 'ok', '4': 'ok', '12': 'ok' }), edges: D12_EDGES({ '1-2': 'ok', '2-4': 'ok', '4-12': 'ok' }), caption: 'Yes: 1, 2, 4, 12 goes upward' },
            { nodes: D12({ '3': 'warn', '4': 'warn' }), edges: D12_EDGES(), caption: 'No upward path either way: incomparable' },
            { nodes: D12({ '2': 'ok', '6': 'ok', '12': 'ok' }), edges: D12_EDGES({ '2-6': 'ok', '6-12': 'ok' }), caption: 'Yes: 2, 6, 12' },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'A downward path does not count. Being lower on the page is not enough: 3 is drawn below 4, but no upward path joins them.',
  },
  {
    id: 'c4-minmax',
    section: C4,
    label: 'Minimal and Maximal',
    element: (
      <ContentSlide
        kicker={C4}
        title="Minimal and Maximal"
        lead="{2, 3, 4, 6, 12, 18} under divides"
        lesson={SESSION}
        points={[
          { text: 'Minimal: nothing strictly below', sub: '2 and 3', icon: 'arrow' },
          { text: 'Maximal: nothing strictly above', sub: '12 and 18', icon: 'arrow' },
          { text: 'A poset can have several of each', icon: 'info' },
        ]}
      >
        <RelationGraph
          width={420}
          height={340}
          frames={[
            { nodes: Q6(), edges: Q6_EDGES },
            { nodes: Q6({ '2': 'lit', '3': 'lit' }), edges: Q6_EDGES, caption: 'Minimal: no edge goes down' },
            { nodes: Q6({ '2': 'lit', '3': 'lit', '12': 'warn', '18': 'warn' }), edges: Q6_EDGES, caption: 'Maximal: no edge goes up' },
          ]}
        />
      </ContentSlide>
    ),
  },
  {
    id: 'c4-least',
    section: C4,
    label: 'Least and Greatest',
    element: (
      <ContentSlide kicker={C4} title="Least and Greatest" lead="Least: below everything. Greatest: above everything. Each is unique" lesson={SESSION}>
        <div className="flex w-full items-start gap-10">
          <div>
            <p className="mb-2 font-heading text-[18px] font-semibold" style={{ color: colors.ink }}>Divisors of 12: least 1, greatest 12</p>
            <RelationGraph width={400} height={305} frames={one({ nodes: D12({ '1': 'ok', '12': 'ok' }), edges: D12_EDGES() })} />
          </div>
          <div>
            <p className="mb-2 font-heading text-[18px] font-semibold" style={{ color: colors.ink }}>{'{2, 3, 4, 6, 12, 18}: neither exists'}</p>
            <RelationGraph width={420} height={330} frames={one({ nodes: Q6({ '2': 'warn', '3': 'warn', '12': 'warn', '18': 'warn' }), edges: Q6_EDGES })} />
          </div>
        </div>
      </ContentSlide>
    ),
    notes: 'A least element is always minimal, but a minimal element need not be least: 2 and 3 are incomparable.',
  },
  {
    id: 'c4-four',
    section: C4,
    label: 'Four Special Elements',
    element: (
      <ContentSlide kicker={C4} title="Four Special Elements" lead="Which exist in which poset?" lesson={SESSION}>
        <DataTable
          className="w-full"
          stepped
          compact
          columns={[{ label: 'Poset', weight: 1.6 }, { label: 'Minimal' }, { label: 'Least' }, { label: 'Maximal' }, { label: 'Greatest' }]}
          rows={[
            ['Divisors of 12, divides', '1', '1', '12', '12'],
            ['{2, 3, 4, 6, 12, 18}, divides', '2, 3', 'None', '12, 18', 'None'],
            ['(P({a, b}), ⊆)', '∅', '∅', '{a, b}', '{a, b}'],
            ['({2, 3, 5}, divides)', '2, 3, 5', 'None', '2, 3, 5', 'None'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'The last row has no edges at all: every element is both minimal and maximal. Its Hasse diagram is three dots side by side.',
  },
  {
    id: 'c4-bounds',
    section: C4,
    label: 'Upper and Lower Bounds',
    element: (
      <ContentSlide
        kicker={C4}
        title="Upper and Lower Bounds"
        lead="For a subset B of a poset: above every element, or below every element"
        lesson={SESSION}
        points={[
          { text: 'B = {2, 3}: upper bounds 6, 12; lower bound 1', icon: 'arrow' },
          { text: 'B = {4, 6}: upper bound 12; lower bounds 1, 2', icon: 'arrow' },
          { text: 'A bound may or may not be in B', icon: 'info' },
        ]}
      >
        <RelationGraph
          width={400}
          height={305}
          frames={[
            { nodes: D12({ '2': 'lit', '3': 'lit' }), edges: D12_EDGES() },
            { nodes: D12({ '2': 'lit', '3': 'lit', '6': 'ok', '12': 'ok', '1': 'warn' }), edges: D12_EDGES(), caption: 'Upper: 6, 12. Lower: 1' },
            { nodes: D12({ '4': 'lit', '6': 'lit', '12': 'ok', '1': 'warn', '2': 'warn' }), edges: D12_EDGES(), caption: 'B = {4, 6}. Upper: 12. Lower: 1, 2' },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'For upper bounds look for elements reachable upward from every element of B; for lower bounds look downward.',
  },
  {
    id: 'c4-sup',
    section: C4,
    label: 'Supremum and Infimum',
    element: (
      <ContentSlide
        kicker={C4}
        title="Supremum and Infimum"
        lead="The least upper bound and the greatest lower bound"
        lesson={SESSION}
        points={[
          { text: '{2, 3}: supremum 6, infimum 1', icon: 'check' },
          { text: '{4, 6}: supremum 12, infimum 2', icon: 'check' },
          { text: 'In (Z⁺, |): lcm and gcd', icon: 'info' },
          { text: 'In (P(S), ⊆): ∪ and ∩', icon: 'info' },
        ]}
      >
        <RelationGraph width={400} height={305} frames={one({ nodes: D12({ '4': 'lit', '6': 'lit', '12': 'ok', '2': 'warn' }), edges: D12_EDGES({ '4-12': 'ok', '6-12': 'ok', '2-4': 'warn', '2-6': 'warn' }), marks: [{ id: 's', node: '12', text: 'sup', side: 'right', tone: 'ok' }, { id: 'i', node: '2', text: 'inf', side: 'left', tone: 'warn' }] })} />
      </ContentSlide>
    ),
    notes: '{4, 6}: lower bounds 1 and 2, the greatest is 2 = gcd(4, 6); the upper bound 12 = lcm(4, 6). Also called lub and glb.',
  },
  {
    id: 'c4-missing',
    section: C4,
    label: 'When Bounds Are Missing',
    element: (
      <ContentSlide kicker={C4} title="When Bounds Are Missing" lead="In {2, 3, 4, 6, 12, 18}, a bound must be an element of the poset" lesson={SESSION}>
        <div className="grid w-full grid-cols-[1.25fr_1fr] items-center gap-6">
          <DataTable
            className="w-full"
            stepped
            compact
            columns={[{ label: 'B' }, { label: 'Upper' }, { label: 'Sup' }, { label: 'Lower' }, { label: 'Inf' }]}
            rows={[
              ['{12, 18}', 'None', 'None', '2, 3, 6', '6'],
              ['{2, 3}', '6, 12, 18', '6', 'None', 'None'],
            ]}
          />
          <RelationGraph width={420} height={330} frames={[{ nodes: Q6(), edges: Q6_EDGES }, { nodes: Q6({ '12': 'lit', '18': 'lit', '6': 'warn' }), edges: Q6_EDGES }, { nodes: Q6({ '2': 'lit', '3': 'lit', '6': 'ok' }), edges: Q6_EDGES }]} />
        </div>
      </ContentSlide>
    ),
    notes: '12 and 18 have no common multiple in the set; 2 and 3 have no common divisor in it (1 is not in the set). "Does not exist" is a valid exam answer.',
  },
  {
    id: 'c4-your-turn',
    section: C4,
    label: 'Your Turn',
    element: (
      <ContentSlide kicker={C4} title="Your Turn" lead="In the cube, B = {{a}, {b}}" lesson={SESSION}>
        <div className="grid w-full grid-cols-[1fr_1.1fr] items-center gap-6">
          <DataTable
            className="w-full"
            revealColumn={1}
            compact
            columns={[{ label: 'Find' }, { label: 'Answer', weight: 1.4 }]}
            rows={[
              ['Upper bounds', '{a, b} and {a, b, c}'],
              ['Supremum', '{a, b} = {a} ∪ {b}'],
              ['Lower bounds', '∅'],
              ['Infimum', '∅ = {a} ∩ {b}'],
              ['Minimal, maximal', '∅ and {a, b, c}'],
            ]}
          />
          <RelationGraph width={460} height={400} frames={one({ nodes: CUBE({ a: 'lit', b: 'lit' }), edges: CUBE_EDGES })} />
        </div>
      </ContentSlide>
    ),
    notes: 'Give two minutes before revealing. Then ask for the supremum and infimum of {{a, b}, {b, c}}: {a, b, c} and {b}.',
  },
  {
    id: 'c4-back',
    section: C4,
    label: 'Back to Prerequisites',
    element: (
      <ContentSlide
        kicker={C4}
        title="Back to Prerequisites"
        lead="The prerequisite chart is a poset, drawn as a Hasse diagram"
        lesson={SESSION}
        points={[
          { text: 'Minimal courses have no prerequisite', sub: 'Programming and Discrete Maths', icon: 'check' },
          { text: 'Any upward reading is a valid course order', icon: 'route' },
        ]}
      >
        <RelationGraph width={440} height={300} frames={one({ nodes: COURSES({ prog: 'ok', dm: 'ok' }), edges: COURSE_EDGES.map((e) => ({ ...e, kind: 'line' as const })) })} />
      </ContentSlide>
    ),
    notes: 'Added Integration slide: the opening chart, now read as a poset.',
  },

  /* ── CLOSING ─────────────────────────────────────────────────────────── */
  { id: 'quiz-2', section: 'Closing', label: 'Quiz Time', element: <QuizTimeSlide lesson={SESSION} /> },
  { id: 'takeaways', section: 'Closing', label: 'Key Takeaways', element: <KeyTakeawaysSlide title={SESSION} lesson={SESSION} points={AGENDA} /> },
  { id: 'feedback', section: 'Closing', label: 'Feedback', element: <FeedbackSlide lesson={SESSION} formless />, notes: 'No form and no QR (content rule 41 as amended 2026-11-21). Ask for feedback out loud.' },
  { id: 'thank-you', section: 'Closing', label: 'Thank you', element: <ThankYouSlide title="Thank You" lesson={SESSION} /> },
  { id: 'all-the-best', section: 'Closing', label: 'All the best', element: <ThankYouSlide title="All the Best" lesson={SESSION} /> },
]

