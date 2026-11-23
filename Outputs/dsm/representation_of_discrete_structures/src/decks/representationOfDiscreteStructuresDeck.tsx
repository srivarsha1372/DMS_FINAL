import type { DeckMeta, SlideDef } from '@/deck/types'
import {
  AgendaSlide,
  BrandSlide,
  ContentSlide,
  FeedbackSlide,
  FlowChartSlide,
  KeyTakeawaysSlide,
  QuestionSlide,
  QuizTimeSlide,
  SectionBreakerSlide,
  StatusPointsSlide,
  ThankYouSlide,
  WelcomeSlide,
} from '@/slides'
import { AnalogyMap, Callout, Card, CardGrid, DataTable, SyntaxBreakdown } from '@/ui'
import { CodeOutput } from '@/ui/CodeOutput'
import { Phone } from '@/ui/foundations/Phone'
import { Definition } from '@/ui/foundations/common'
import { Step } from '@/motion/Stepper'
import { colors } from '@/design/tokens'
import {
  BitStrip,
  ClassTree,
  MatrixOrder,
  MemoryMap,
  VennMini,
  chain,
  column,
  row,
  NODE_W,
  type MapArrow,
  type MapCell,
  type MapFrame,
} from '@/ui/structures'

/**
 * REPRESENTATION OF DISCRETE STRUCTURES (DSM).
 *
 * Built from the signed-off plan at
 *   Outputs/dsm/session_plans/representation_of_discrete_structures/plan.md
 * which is the source of truth for order, framework and wording. Every number,
 * trace and bit string on these slides was recomputed by `verify_tr.py` beside
 * the plan; the Python output on "In Real Programs" is a real run.
 *
 * Four concepts (hard rule 20): Data Structures (4MAT), Storage Structures
 * (4MAT), Sequential and Linked Allocation (SCQA), Bit Represented Sets (STAR).
 * No Next Session slide (plan decision D).
 *
 * The figures come from the kit's `@/ui/structures` (MemoryMap, BitStrip,
 * MatrixOrder, VennMini, ClassTree), added for this deck and raised as a kit PR.
 */

const SESSION = 'Representation of Discrete Structures'

const C1 = 'Data Structures'
const C2 = 'Storage Structures'
const C3 = 'Sequential and Linked Allocation'
const C4 = 'Bit Represented Sets'
const AGENDA = [C1, C2, C3, C4]

export const representationOfDiscreteStructuresMeta: DeckMeta = {
  title: SESSION,
  course: 'DSM',
  lesson: SESSION,
  presenter: 'NxtWave Instructor',
  player: { autoHideControls: true },
}

/* ── figure data ─────────────────────────────────────────────────────────── */

/** The linked list of concept 3, as the TR lays it out in memory. */
const MEM: { addr: number; info: string; link: string; free?: boolean }[] = [
  { addr: 1000, info: '37', link: '1060' },
  { addr: 1020, info: '12', link: '1080' },
  { addr: 1040, info: 'free', link: 'free', free: true },
  { addr: 1060, info: '48', link: 'NULL' },
  { addr: 1080, info: '25', link: '1000' },
]

/** The memory table as a column of two-field nodes, with some nodes lit. */
function memTable(x: number, lit: number[] = []): MapCell[] {
  return column(
    MEM.map((m) => ({
      id: `m${m.addr}`,
      fields: [m.info, m.link] as [string, string],
      addr: m.addr,
      w: NODE_W,
      state: m.free ? 'ghost' : lit.includes(m.addr) ? 'lit' : 'plain',
    })),
    { x, y: 0, h: 50, gap: 12 },
  )
}

/** Arrows that follow a trace through the memory table, bent out to the right. */
const TRACE_BEND: Record<string, number> = { '1020>1080': -260, '1080>1000': 340, '1000>1060': -280 }
function traceArrows(pairs: [number, number][]): MapArrow[] {
  return pairs.map(([a, b]) => ({ id: `${a}>${b}`, from: `m${a}`, to: `m${b}`, bend: TRACE_BEND[`${a}>${b}`] }))
}

/** The four-node chain 12, 25, 37, 48, shown up to `k` nodes. */
const CHAIN = chain(
  [
    { id: 'n12', info: '12', link: '1080', addr: 1020 },
    { id: 'n25', info: '25', link: '1000', addr: 1080 },
    { id: 'n37', info: '37', link: '1060', addr: 1000 },
    { id: 'n48', info: '48', link: 'NULL', addr: 1060 },
  ],
  { x: 110, y: 60, gap: 60 },
)
const chainUpTo = (k: number, lit: string[] = []): MapFrame => ({
  cells: CHAIN.cells.slice(0, k).map((c) => ({ ...c, state: lit.includes(c.id) ? 'lit' : 'plain' })),
  arrows: CHAIN.arrows.slice(0, Math.max(0, k - 1)),
})

/** Universe {1 … 10} for the bit-set slides. */
const U10 = Array.from({ length: 10 }, (_, i) => String(i + 1))
const A_BITS = '1010101010'
const B_BITS = '0110101000'

/** The sieve over {2 … 20}. */
const SIEVE_NUMS = Array.from({ length: 19 }, (_, i) => i + 2)
const sieveBits = (passes: number[]) =>
  SIEVE_NUMS.map((n) => (passes.some((p) => n > p && n % p === 0) ? '0' : '1')).join('')
const PRIME_POSITIONS = SIEVE_NUMS.map((_, i) => (sieveBits([2, 3])[i] === '1' ? i : -1)).filter((i) => i >= 0)

/** Seats for "Finding Seat 9". */
const SEATS = (states: Record<number, 'lit' | 'muted' | 'ok'> = {}) =>
  row(
    Array.from({ length: 9 }, (_, i) => ({ id: `seat${i + 1}`, value: String(i + 1), state: states[i + 1] ?? 'plain' })),
    { x: 0, y: 100, w: 60, gap: 12 },
  )

/** Insertion into an array: six fixed slots, values that move. */
const SLOT_X = (k: number) => k * 90
const SLOTS: MapCell[] = Array.from({ length: 6 }, (_, k) => ({
  id: `slot${k}`,
  x: SLOT_X(k),
  y: 50,
  value: '',
  addr: `A[${k + 1}]`,
  addrSide: 'below',
  state: 'ghost',
}))
const val = (v: number, k: number, state: MapCell['state'] = 'plain'): MapCell => ({ id: `v${v}`, x: SLOT_X(k), y: 50, value: String(v), state })

/** Inserting a node: positions on the row, and the free node below. */
const NX = { n12: 60, n25: 290, n37: 520, n48: 750 } as const
const insNode = (id: keyof typeof NX, info: string, link: string, addr: number, state: MapCell['state'] = 'plain'): MapCell => ({
  id,
  x: NX[id],
  y: 20,
  fields: [info, link],
  addr,
  addrSide: 'below',
  state,
})
const ins30 = (info: string, link: string, state: MapCell['state']): MapCell => ({
  id: 'n30',
  x: 405,
  y: 150,
  fields: [info, link],
  addr: 1040,
  addrSide: 'below',
  state,
})

/** Deleting a node: five nodes in list order. */
const DX = (k: number) => 40 + k * 200
const delNode = (k: number, id: string, info: string, link: string, addr: number, state: MapCell['state'] = 'plain'): MapCell => ({
  id,
  x: DX(k),
  y: 80,
  fields: [info, link],
  addr,
  addrSide: 'below',
  state,
})

/* ── the deck ────────────────────────────────────────────────────────────── */

export const representationOfDiscreteStructuresDeck: SlideDef[] = [
  /* ── OPENING ─────────────────────────────────────────────────────────── */
  {
    id: 'brand',
    section: 'Opening',
    label: 'Welcome',
    element: <BrandSlide greeting="Welcome!" lesson={SESSION} />,
    notes: 'On screen while the room settles.',
  },
  {
    id: 'session-name',
    section: 'Opening',
    label: 'Session name',
    element: <WelcomeSlide minimal title={SESSION} lesson={SESSION} />,
    notes: 'The session name only.',
  },
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
          { title: C1, sub: 'How discrete data is organised' },
          { title: C2, sub: 'How data sits in memory' },
          { title: C3, sub: 'Side by side, or joined by links' },
          { title: C4, sub: 'A set as a string of bits' },
        ]}
      />
    ),
    notes: 'Four concepts. The same four words come back on the dividers and on Key Takeaways.',
  },

  /* ── CONCEPT 1: DATA STRUCTURES (4MAT) ───────────────────────────────── */
  {
    id: 'c1-divider',
    section: C1,
    label: 'Divider',
    element: <SectionBreakerSlide index={1} title={C1} lesson={SESSION} />,
  },
  {
    id: 'c1-data-on-paper',
    section: C1,
    label: 'Data on Paper',
    element: (
      <ContentSlide
        kicker={C1}
        title="Data on Paper"
        lead="We write sets, sequences and relations on paper"
        lesson={SESSION}
        points={[
          { text: 'A phone keeps a playlist in a fixed order', sub: 'Song 1, then song 2, then song 3', icon: 'devices' },
          { text: 'How does it store that order?', icon: 'bulb' },
        ]}
      >
        <div className="flex justify-center">
          <Phone
            width={190}
            height={392}
            top={{ bg: colors.brand, light: true, header: <span className="font-heading text-[15px] font-semibold text-white">My Playlist</span> }}
          >
            <ol className="space-y-2 p-3">
              {['Morning Run', 'Focus Beats', 'Lo-fi Study', 'Night Drive', 'Rain Sounds'].map((s, i) => (
                <li key={s} className="flex items-center gap-2 rounded-lg px-2 py-1.5" style={{ background: colors.surface }}>
                  <span className="grid h-6 w-6 place-items-center rounded-full font-mono text-[12px] font-semibold text-white" style={{ background: colors.brand }}>
                    {i + 1}
                  </span>
                  <span className="text-[13px] font-medium" style={{ color: colors.ink }}>
                    {s}
                  </span>
                </li>
              ))}
            </ol>
          </Phone>
        </div>
      </ContentSlide>
    ),
    notes:
      'Open with the question: how does a phone know the order of songs in a playlist? Let learners answer before moving on. The idea to land: data plus an arrangement.',
  },
  {
    id: 'c1-pile-of-books',
    section: C1,
    label: 'A Pile of Books',
    element: (
      <ContentSlide kicker={C1} title="A Pile of Books" lead="Two libraries with the same 500 books" lesson={SESSION}>
        <CardGrid cols={2}>
          <Card icon="warning" title="Books in a heap" tone="accent">
            <p className="text-body-lg" style={{ color: colors.ink }}>To find one book, you check every book</p>
          </Card>
          <Card icon="check" title="Numbered shelves" tone="success">
            <p className="text-body-lg" style={{ color: colors.ink }}>The shelf number takes you straight to the book</p>
          </Card>
        </CardGrid>
      </ContentSlide>
    ),
    notes: 'A library is more than a pile of books. Without the shelf and numbering system, finding one book means searching through all of them. Same books; the arrangement is the difference.',
  },
  {
    id: 'c1-definition',
    section: C1,
    label: 'Data Structures',
    element: (
      <ContentSlide kicker={C1} title="Data Structures" lead="Data items, kept together with how they relate, so our work on them is fast" lesson={SESSION}>
        <div className="max-w-[720px]">
          <Definition sig="Data structure">The name for this: the data, its relationships and the operations on it</Definition>
        </div>
      </ContentSlide>
    ),
    notes: 'The gloss first, then the name. Stress that the same data can be organised in different ways depending on what we want to do with it.',
  },
  {
    id: 'c1-three-parts',
    section: C1,
    label: 'Three Parts',
    element: (
      <ContentSlide kicker={C1} title="Three Parts" lead="Every data structure has three parts" lesson={SESSION}>
        <AnalogyMap
          leftLabel="In the library"
          rightLabel="In a data structure"
          rows={[
            { from: 'The books', to: 'Data elements: roll numbers, names, marks' },
            { from: 'Call-number order', to: 'Relationships: "comes after", "is a parent of"' },
            { from: 'Issue and return', to: 'Operations: access, insert, delete, search' },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Map each part to the library as you reveal it. Traverse, the fifth operation, comes with the operations slide.',
  },
  {
    id: 'c1-examples',
    section: C1,
    label: 'Examples',
    element: (
      <ContentSlide kicker={C1} title="Examples" lead="Same idea, different relationships" lesson={SESSION}>
        <DataTable
          className="w-full"
          stepped
          compact
          columns={[{ label: 'Real situation', weight: 1.3 }, { label: 'Structure', weight: 0.8 }, { label: 'Relationship', weight: 1.5 }]}
          rows={[
            ['Roll list of a class in order', 'Sequence', 'Each student has a next student'],
            ['Students in the coding club', 'Set', 'Only membership matters: no order, no repeats'],
            ['Folders inside folders', 'Tree', 'Each folder has one parent folder'],
            ['Cities joined by train routes', 'Graph', 'Two cities are joined, or not'],
            ['"Is a prerequisite of" for courses', 'Relation', 'Ordered pairs (course, course)'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'One row at a time. Ask learners for one more example for each row. The relationship column decides which structure we choose.',
  },
  {
    id: 'c1-kinds',
    section: C1,
    label: 'Kinds of Data Structures',
    element: (
      <ContentSlide kicker={C1} title="Kinds of Data Structures" lead="From one value to many related values" lesson={SESSION}>
        <ClassTree
          boxWidth={250}
          root={{
            label: 'Data structures',
            children: [
              { label: 'Primitive', sub: 'Integer, real, character, logical' },
              {
                label: 'Non-primitive',
                children: [
                  { label: 'Linear', sub: 'Arrays, strings, stacks, queues' },
                  { label: 'Non-linear', sub: 'Trees, graphs' },
                ],
              },
            ],
          }}
        />
      </ContentSlide>
    ),
    notes:
      'Primitive: one value the machine handles directly. Linear: each element except the last has one next element. Non-linear: an element may be related to several others. Keep it light: the structure is chosen to match the relationship, not memorised as a list.',
  },
  {
    id: 'c1-operations',
    section: C1,
    label: 'Operations',
    element: (
      <ContentSlide
        kicker={C1}
        title="Operations"
        lead="What we do with a data structure"
        lesson={SESSION}
        points={[
          { text: 'Insert and delete', sub: 'Add a contact, remove a contact', icon: 'plus' },
          { text: 'Search', sub: 'Look someone up by name', icon: 'eye' },
          { text: 'Traverse', sub: 'Scroll through every contact once', icon: 'route' },
          { text: 'Also: create, select, update and sort', icon: 'settings' },
        ]}
      >
        <div className="flex justify-center">
          <Phone
            width={190}
            height={392}
            top={{ bg: colors.brand, light: true, header: <span className="font-heading text-[15px] font-semibold text-white">Contacts</span> }}
          >
            <div className="p-3">
              <div className="mb-2 rounded-lg px-3 py-1.5 text-[12px]" style={{ background: colors.surface2, color: colors.muted }}>
                Search
              </div>
              <ul className="space-y-1.5">
                {['Aarav', 'Diya', 'Kabir', 'Meera', 'Rohan', 'Sana'].map((n) => (
                  <li key={n} className="flex items-center gap-2 px-1 py-1">
                    <span className="grid h-6 w-6 place-items-center rounded-full text-[11px] font-semibold text-white" style={{ background: colors.brandDark }}>
                      {n[0]}
                    </span>
                    <span className="text-[13px] font-medium" style={{ color: colors.ink }}>
                      {n}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Phone>
        </div>
      </ContentSlide>
    ),
    notes: 'Insert, delete and access come back later: how fast each one runs depends on how the data is stored in memory.',
  },
  {
    id: 'c1-pick',
    section: C1,
    label: 'Pick the Structure',
    element: (
      <ContentSlide kicker={C1} title="Pick the Structure" lead="Vote first, then see the answer" lesson={SESSION}>
        <DataTable
          className="w-full"
          revealColumn={1}
          columns={[{ label: 'Data to store', weight: 1.6 }, { label: 'Best described as', weight: 1 }]}
          rows={[
            ['Marks of 60 students, looked up by roll number', 'Linear: array'],
            ["A company's reporting hierarchy", 'Non-linear: tree'],
            ["One student's CGPA", 'Primitive: real number'],
            ['Friend connections on a social network', 'Non-linear: graph'],
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Run as a quick poll, one row at a time. Close the concept: every structure, however complex, must finally be laid out in memory. That is the next concept.',
  },

  /* ── CONCEPT 2: STORAGE STRUCTURES (4MAT) ────────────────────────────── */
  {
    id: 'c2-divider',
    section: C2,
    label: 'Divider',
    element: <SectionBreakerSlide index={2} title={C2} lesson={SESSION} />,
  },
  {
    id: 'c2-locations',
    section: C2,
    label: 'Storage Locations',
    element: (
      <ContentSlide
        kicker={C2}
        title="Storage Locations"
        lead="Main memory is a long row of storage locations"
        lesson={SESSION}
        points={[
          { text: 'Each location has a fixed number', sub: 'This number is its address', icon: 'target' },
          { text: 'Each location holds a value', sub: 'This value is its content', icon: 'database' },
          { text: 'Hostel room 101 stays room 101', sub: 'The student living there can change', icon: 'key' },
        ]}
      >
        <MemoryMap
          width={330}
          height={300}
          frames={[{ cells: column(['13', '65', '7', '20', '1'].map((v, i) => ({ id: `c${i}`, value: v, addr: 1000 + i })), { x: 150, y: 0, h: 50, gap: 10 }) }]}
        />
      </ContentSlide>
    ),
    notes:
      'Ask: what is the difference between "location 1000" and "the value at location 1000"? Keep this distinction alive; pointers depend on it. The addresses are consecutive, so the next location is always known.',
  },
  {
    id: 'c2-units',
    section: C2,
    label: 'Units of Storage',
    element: (
      <ContentSlide kicker={C2} title="Units of Storage" lead="From one bit upward" lesson={SESSION}>
        <DataTable
          className="w-full"
          stepped
          columns={[{ label: 'Unit', weight: 0.7 }, { label: 'Size', weight: 1.4 }, { label: 'Can hold', weight: 1.4 }, { label: 'Drawn', weight: 1.6 }]}
          rows={[
            ['Bit', '1 binary digit', '0 or 1, such as true or false', <Squares n={1} />],
            ['Byte', '8 bits', "One character, such as 'A'", <Squares n={8} />],
            ['Word', '16, 32 or 64 bits', 'One integer, real number or address', <Squares n={32} />],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'A word is the amount the machine reads or writes in one step, and its size depends on the machine. This matters again with bit represented sets, where one word holds a whole set.',
  },
  {
    id: 'c2-same-bits',
    section: C2,
    label: 'Same Bits, Different Meanings',
    element: (
      <ContentSlide kicker={C2} title="Same Bits, Different Meanings" lead="Memory stores bit patterns only, never their meaning" lesson={SESSION}>
        <div className="w-full space-y-3">
          <DataTable
          className="w-full"
            compact
            highlight={[4]}
            columns={[{ label: 'Address', weight: 0.6 }, { label: 'Content (binary)', weight: 1 }, { label: 'Read as', weight: 1.6 }]}
            rows={[
              ['1000', <span className="font-mono">00001101</span>, 'The integer 13'],
              ['1001', <span className="font-mono">01000001</span>, "The character 'A', code 65 in ASCII"],
              ['1002', <span className="font-mono">00000001</span>, 'The logical value true'],
              ['1003', <span className="font-mono">00111110</span>, "The integer 62, or the character '>'"],
            ]}
          />
          <p className="text-[17px]" style={{ color: colors.muted }}>
            ASCII: American Standard Code for Information Interchange, the number code for characters
          </p>
        </div>
      </ContentSlide>
    ),
    notes:
      'The last row is the point: memory holds only bit patterns. Whether 00111110 is a number or a character is decided by the program that reads it. Nor does memory hold "comes after": the relationships from the first concept are not stored by themselves.',
  },
  {
    id: 'c2-storage-structures',
    section: C2,
    label: 'Storage Structures',
    element: (
      <ContentSlide
        kicker={C2}
        title="Storage Structures"
        lead="One list, two ways of looking at it"
        lesson={SESSION}
        points={[
          { text: 'Data structure', sub: 'The logical picture: what the data means', icon: 'eye' },
          { text: 'Storage structure', sub: 'Where the bits actually sit in memory', icon: 'database' },
        ]}
      >
        <MemoryMap
          width={430}
          height={240}
          frames={[
            {
              cells: [
                ...row(['12', '25', '37', '48'].map((v, i) => ({ id: `t${i}`, value: v })), { x: 130, y: 10, w: 64, gap: 14 }),
                ...row(['12', '25', '37', '48'].map((v, i) => ({ id: `m${i}`, value: v, addr: 2000 + 4 * i, state: 'lit' as const })), { x: 130, y: 150, w: 64, gap: 14 }),
              ],
              arrows: [0, 1, 2, 3].map((i) => ({ id: `d${i}`, from: `t${i}`, to: `m${i}` })),
              markers: [
                { id: 'l1', cell: 't0', text: 'List', side: 'left' },
                { id: 'l2', cell: 'm0', text: 'Memory', side: 'left' },
              ],
            },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'The list (12, 25, 37, 48) is the data structure. Four memory locations holding it are one storage structure for it.',
  },
  {
    id: 'c2-many-layouts',
    section: C2,
    label: 'One List, Many Layouts',
    element: (
      <ContentSlide kicker={C2} title="One List, Many Layouts" lead="The same list can sit in memory in more than one way" lesson={SESSION}>
        <MemoryMap
          width={900}
          height={330}
          frames={[
            {
              cells: row(['12', '25', '37', '48'].map((v, i) => ({ id: `a${i}`, value: v, addr: 2000 + 4 * i })), { x: 140, y: 20, gap: 10 }),
              markers: [{ id: 'k1', cell: 'a0', text: 'Side by side', side: 'left' }],
              caption: 'Four locations in a row, from address 2000',
            },
            {
              cells: [
                ...row(['12', '25', '37', '48'].map((v, i) => ({ id: `a${i}`, value: v, addr: 2000 + 4 * i })), { x: 140, y: 20, gap: 10 }),
                { id: 's0', x: 140, y: 190, value: '12', addr: 1020, addrSide: 'below' },
                { id: 's1', x: 560, y: 240, value: '25', addr: 1080, addrSide: 'below' },
                { id: 's2', x: 340, y: 250, value: '37', addr: 1000, addrSide: 'below' },
                { id: 's3', x: 700, y: 170, value: '48', addr: 1060, addrSide: 'below' },
              ],
              markers: [
                { id: 'k1', cell: 'a0', text: 'Side by side', side: 'left' },
                { id: 'k2', cell: 's0', text: 'Spread apart', side: 'left' },
              ],
              caption: 'Or four locations spread apart in memory',
            },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'One data structure can have more than one storage structure. Ask: if the values are spread apart, how would we know which comes next? Hold that question.',
  },
  {
    id: 'c2-layout-decides',
    section: C2,
    label: 'What the Layout Decides',
    element: (
      <ContentSlide kicker={C2} title="What the Layout Decides" lead="The layout we choose decides three things" lesson={SESSION}>
        <CardGrid cols={3}>
          <Card icon="database" title="Memory used">
            <p className="text-body-lg" style={{ color: colors.ink }}>How many locations the list takes</p>
          </Card>
          <Card icon="bolt" title="Speed of access">
            <p className="text-body-lg" style={{ color: colors.ink }}>How fast we reach any element</p>
          </Card>
          <Card icon="pencil" title="Ease of change">
            <p className="text-body-lg" style={{ color: colors.ink }}>How easily we insert and delete</p>
          </Card>
        </CardGrid>
      </ContentSlide>
    ),
    notes: 'This is why the layout matters: finding, inserting and deleting all depend on it. The next concept compares the two layouts on exactly these three.',
  },
  {
    id: 'quiz-1',
    section: C2,
    label: 'Quiz Time',
    element: <QuizTimeSlide lesson={SESSION} />,
    notes: 'Mid-deck check. Everything after this builds on address, content and bits.',
  },

  /* ── CONCEPT 3: SEQUENTIAL AND LINKED ALLOCATION (SCQA) ──────────────── */
  {
    id: 'c3-divider',
    section: C3,
    label: 'Divider',
    element: <SectionBreakerSlide index={3} title={C3} lesson={SESSION} />,
  },
  {
    id: 'c3-storing',
    section: C3,
    label: 'Storing a List',
    element: (
      <ContentSlide
        kicker={C3}
        title="Storing a List"
        lead="We must store the list 12, 25, 37, 48 and then work on it"
        lesson={SESSION}
        points={[
          { text: 'Find the third element', icon: 'eye' },
          { text: 'Insert 30 after 25', icon: 'plus' },
          { text: 'Delete 37', icon: 'trash' },
        ]}
      >
        <MemoryMap width={400} height={90} frames={[{ cells: row(['12', '25', '37', '48'].map((v, i) => ({ id: `l${i}`, value: v })), { x: 40, y: 10, gap: 12 }) }]} />
      </ContentSlide>
    ),
    notes: 'The situation: one list, three jobs. Every layout has to support all three.',
  },
  {
    id: 'c3-two-layouts',
    section: C3,
    label: 'Two Layouts',
    element: (
      <ContentSlide
        kicker={C3}
        title="Two Layouts"
        lead="Each layout makes one job easy"
        lesson={SESSION}
        points={[
          { text: 'Sequential allocation', sub: 'Side by side: next is the next location', icon: 'route' },
          { text: 'Linked allocation', sub: 'Anywhere: each element stores where the next one is', icon: 'link' },
        ]}
      >
        <MemoryMap
          width={440}
          height={360}
          frames={[
            {
              cells: [
                ...row(['12', '25', '37', '48'].map((v, i) => ({ id: `q${i}`, value: v, addr: 2000 + 4 * i })), { x: 130, y: 10, w: 60, gap: 6 }),
                { id: 'r0', x: 130, y: 150, w: 60, value: '12', addr: 1020, addrSide: 'below' },
                { id: 'r1', x: 330, y: 150, w: 60, value: '25', addr: 1080, addrSide: 'below' },
                { id: 'r2', x: 170, y: 270, w: 60, value: '37', addr: 1000, addrSide: 'below' },
                { id: 'r3', x: 370, y: 270, w: 60, value: '48', addr: 1060, addrSide: 'below' },
              ],
              arrows: [
                { id: 'r01', from: 'r0', to: 'r1' },
                { id: 'r12', from: 'r1', to: 'r2' },
                { id: 'r23', from: 'r2', to: 'r3' },
              ],
              markers: [
                { id: 'mq', cell: 'q0', text: 'Sequential', side: 'left' },
                { id: 'mr', cell: 'r0', text: 'Linked', side: 'left' },
              ],
            },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Side by side: how do we find the 3rd element? Scattered: how do we find the next one? Let learners guess before the answers.',
  },
  {
    id: 'c3-question',
    section: C3,
    label: 'Which Layout?',
    element: <QuestionSlide kicker={C3} question="Which layout should a list use?" lesson={SESSION} />,
    notes: 'Let the room commit to an answer. Do not answer it here: the rest of this concept builds both layouts, then compares them.',
  },
  {
    id: 'c3-side-by-side',
    section: C3,
    label: 'Side by Side',
    element: (
      <ContentSlide
        kicker={C3}
        title="Side by Side"
        lead="List elements sit in consecutive locations, in list order"
        lesson={SESSION}
        points={[
          { text: 'An array is a list stored this way', icon: 'route' },
          { text: 'Cinema seats are numbered the same way', sub: 'Seat 1, seat 2, seat 3, side by side', icon: 'target' },
        ]}
      >
        <MemoryMap
          width={440}
          height={240}
          frames={[
            {
              cells: [
                ...row(['1', '2', '3', '4', '5'].map((v, i) => ({ id: `s${i}`, value: v })), { x: 110, y: 10, w: 56, gap: 8 }),
                ...row(['72', '85', '64', '90', '58'].map((v, i) => ({ id: `a${i}`, value: v, addr: 2000 + 4 * i, state: 'lit' as const })), { x: 110, y: 140, w: 56, gap: 8 }),
              ],
              arrows: [0, 1, 2, 3, 4].map((i) => ({ id: `sa${i}`, from: `s${i}`, to: `a${i}` })),
              markers: [
                { id: 'ms', cell: 's0', text: 'Seats', side: 'left' },
                { id: 'ma', cell: 'a0', text: 'Array', side: 'left' },
              ],
            },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Seat k matches element k. Ask how they would find seat 9 in the dark.',
  },
  {
    id: 'c3-seat-9',
    section: C3,
    label: 'Finding Seat 9',
    element: (
      <ContentSlide kicker={C3} title="Finding Seat 9" lead="In the dark, checking seats one by one is slow" lesson={SESSION}>
        <MemoryMap
          width={900}
          height={230}
          frames={[
            { cells: SEATS(), markers: [{ id: 'you', cell: 'seat1', text: 'You', side: 'below' }], caption: 'You need seat 9' },
            { cells: SEATS({ 1: 'muted', 2: 'muted', 3: 'muted', 4: 'lit' }), markers: [{ id: 'you', cell: 'seat4', text: 'You', side: 'below' }], caption: 'Seat 1, seat 2, seat 3, seat 4 …' },
            {
              cells: SEATS({ 1: 'muted', 2: 'muted', 3: 'muted', 4: 'muted', 5: 'muted', 6: 'muted', 7: 'muted', 8: 'muted', 9: 'ok' }),
              markers: [{ id: 'you', cell: 'seat9', text: 'You', side: 'below' }],
              caption: '8 checks before you reach seat 9, and more as the row grows',
            },
            {
              cells: SEATS({ 1: 'lit', 9: 'ok' }),
              arrows: [{ id: 'jump', from: 'seat1', to: 'seat9', bend: -150 }],
              markers: [{ id: 'you', cell: 'seat1', text: 'You', side: 'below' }],
              caption: 'Each seat is 50 cm wide, so seat 9 is 4 m from seat 1',
            },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'The answer "count the distance" is exactly the address formula.',
  },
  {
    id: 'c3-task',
    section: C3,
    label: 'Calculate, Not Search',
    element: (
      <FlowChartSlide
        kicker={C3}
        title="Calculate, Not Search"
        lead="We need the address of any element from its position alone"
        lesson={SESSION}
        nodes={[
          { label: 'Position i', caption: 'Which element we want', icon: 'target' },
          { label: 'One calculation', caption: 'No visiting the ones before it', icon: 'bolt' },
          { label: 'Its address', caption: 'Where it sits in memory', icon: 'database' },
        ]}
      />
    ),
    notes: 'The capability in plain words, before any formula.',
  },
  {
    id: 'c3-formula',
    section: C3,
    label: 'The Address Formula',
    element: (
      <ContentSlide kicker={C3} title="The Address Formula" lead="Count how many elements come before A[i]" lesson={SESSION}>
        <SyntaxBreakdown
          language="formula"
          parts={[
            { token: 'Loc(A[i])', label: 'the answer', body: 'The address of element A[i]', after: ' = ' },
            { token: 'L₀', label: 'base address', body: 'The address where A[1] starts', after: ' + ' },
            { token: 'c', label: 'size', body: 'Locations one element takes', after: ' × ' },
            { token: '(i − 1)', label: 'elements before', body: 'How many come before A[i]', after: '' },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'One part per press. L₀ is called the base address.',
  },
  {
    id: 'c3-worked',
    section: C3,
    label: 'Worked Example',
    element: (
      <ContentSlide kicker={C3} title="Worked Example" lead="Marks of 6 students in A[1..6], with L₀ = 2000 and c = 4" lesson={SESSION}>
        <MemoryMap
          width={900}
          height={170}
          frames={[0, 1, 2].map((f) => ({
            cells: row(
              ['72', '85', '64', '90', '58', '77'].map((v, i) => ({
                id: `w${i}`,
                value: v,
                addr: 2000 + 4 * i,
                state: (f >= 1 && i === 4) || (f === 2 && i === 0) ? ('lit' as const) : ('plain' as const),
              })),
              { x: 0, y: 50, gap: 14 },
            ),
            markers: [0, 1, 2, 3, 4, 5].map((i) => ({ id: `k${i}`, cell: `w${i}`, text: `A[${i + 1}]`, side: 'above' as const, tone: 'ink' as const })),
            caption: ['Each element takes 4 locations, so the addresses go up by 4', 'Loc(A[5]) = 2000 + 4 × (5 − 1) = 2016', 'A[5] is reached as fast as A[1]: this is direct access'][f],
          }))}
        />
      </ContentSlide>
    ),
    notes: 'Reaching A[5] takes the same time as reaching A[1]. Ask learners to compute Loc(A[6]) themselves: 2020.',
  },
  {
    id: 'c3-index-ranges',
    section: C3,
    label: 'Other Index Ranges',
    element: (
      <ContentSlide kicker={C3} title="Other Index Ranges" lead="When the index starts at l, count from l" lesson={SESSION}>
        <DataTable
          className="w-full"
          stepped
          columns={[{ label: 'Case', weight: 1.2 }, { label: 'Formula', weight: 1.4 }]}
          rows={[
            ['Array A[l..u]', <span className="font-mono">Loc(A[i]) = L₀ + c × (i − l)</span>],
            ['Number of elements in A[l..u]', <span className="font-mono">u − l + 1</span>],
            ['Index from 0, as in C and Python', <span className="font-mono">Loc(A[i]) = L₀ + c × i</span>],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'The term (i − l) is how many elements come before A[i]. Exam hook: questions of exactly this type are common.',
  },
  {
    id: 'c3-try-1',
    section: C3,
    label: 'Try It',
    element: (
      <ContentSlide kicker={C3} title="Try It" lead="A[5..20], with L₀ = 1200 and c = 2" lesson={SESSION}>
        <DataTable
          className="w-full"
          revealColumn={1}
          columns={[{ label: 'Find', weight: 1 }, { label: 'Answer', weight: 1.4 }]}
          rows={[
            [<span className="font-mono">Loc(A[12])</span>, <span className="font-mono">1200 + 2 × (12 − 5) = 1214</span>],
            ['Number of elements', <span className="font-mono">20 − 5 + 1 = 16</span>],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Give a minute before each answer.',
  },
  {
    id: 'c3-table-in-line',
    section: C3,
    label: 'A Table in One Line',
    element: (
      <ContentSlide kicker={C3} title="A Table in One Line" lead="Memory is one line, but a 3 × 4 matrix has rows and columns" lesson={SESSION}>
        <MatrixOrder m={3} n={4} frames={[{ order: 'row', filled: 0 }]} />
      </ContentSlide>
    ),
    notes: 'The matrix has to be flattened into the line. There are two ways to walk it.',
  },
  {
    id: 'c3-row-major',
    section: C3,
    label: 'Row-Major Order',
    element: (
      <ContentSlide kicker={C3} title="Row-Major Order" lead="Store row 1 fully, then row 2, then row 3" lesson={SESSION}>
        <MatrixOrder
          m={3}
          n={4}
          frames={[
            { order: 'row', filled: 0 },
            { order: 'row', filled: 4 },
            { order: 'row', filled: 8 },
            { order: 'row', filled: 12, caption: "Used by C, C++ and Python's NumPy" },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'One row per press.',
  },
  {
    id: 'c3-column-major',
    section: C3,
    label: 'Column-Major Order',
    element: (
      <ContentSlide kicker={C3} title="Column-Major Order" lead="Store column 1 fully, then column 2, and so on" lesson={SESSION}>
        <MatrixOrder
          m={3}
          n={4}
          frames={[
            { order: 'column', filled: 0 },
            { order: 'column', filled: 3 },
            { order: 'column', filled: 6 },
            { order: 'column', filled: 9 },
            { order: 'column', filled: 12, caption: 'Used by Fortran and MATLAB' },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Same matrix, different walk. Compare the line with the row-major one.',
  },
  {
    id: 'c3-find-aij',
    section: C3,
    label: 'Finding A[i, j]',
    element: (
      <ContentSlide kicker={C3} title="Finding A[i, j]" lead="m = 3, n = 4, L₀ = 500, c = 2: find A[2, 3]" lesson={SESSION}>
        <MatrixOrder
          m={3}
          n={4}
          frames={[
            { order: 'row', filled: 12, lit: [2, 3], caption: 'Row-major: L₀ + c × [(i − 1) × n + (j − 1)]' },
            { order: 'row', filled: 12, lit: [2, 3], caption: 'A[2, 3] is 7th: 500 + 2 × [1 × 4 + 2] = 512' },
            { order: 'column', filled: 12, lit: [2, 3], caption: 'Column-major: L₀ + c × [(j − 1) × m + (i − 1)]' },
            { order: 'column', filled: 12, lit: [2, 3], caption: 'A[2, 3] is 8th: 500 + 2 × [2 × 3 + 1] = 514' },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'In row-major, 6 elements come before A[2,3] (6 × 2 = 12). In column-major, 7 come before it (7 × 2 = 14). Exam hook: questions ask for both orders on the same matrix.',
  },
  {
    id: 'c3-insert-shift',
    section: C3,
    label: 'Insertion Means Shifting',
    element: (
      <ContentSlide kicker={C3} title="Insertion Means Shifting" lead="Insert 30 into the sorted list 10, 20, 40, 50, 60" lesson={SESSION}>
        <MemoryMap
          width={900}
          height={160}
          frames={[
            { cells: [...SLOTS, val(10, 0), val(20, 1), val(40, 2), val(50, 3), val(60, 4)], caption: 'A[6] is empty' },
            { cells: [...SLOTS, val(10, 0), val(20, 1), val(40, 2), val(50, 3), val(60, 5, 'lit')], caption: 'Shift 60 one place right' },
            { cells: [...SLOTS, val(10, 0), val(20, 1), val(40, 2), val(50, 4, 'lit'), val(60, 5)], caption: 'Then shift 50' },
            { cells: [...SLOTS, val(10, 0), val(20, 1), val(40, 3, 'lit'), val(50, 4), val(60, 5)], caption: 'Then shift 40' },
            { cells: [...SLOTS, val(10, 0), val(20, 1), val(30, 2, 'ok'), val(40, 3), val(50, 4), val(60, 5)], caption: '30 goes into the free A[3]' },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Ask why shifting starts from the last element: starting at 40 would overwrite 50. Then ask what deleting 20 needs: shift 30, 40, 50 and 60 one place left.',
  },
  {
    id: 'c3-pros-cons',
    section: C3,
    label: 'Pros and Cons',
    element: (
      <StatusPointsSlide
        kicker={C3}
        title="Pros and Cons"
        lead="Fast access, costly change"
        lesson={SESSION}
        items={[
          { status: 'success', text: 'Any element is reached directly by the formula' },
          { status: 'success', text: 'No extra memory: the position is the order' },
          { status: 'error', text: 'Insert or delete shifts up to n elements' },
          { status: 'error', text: 'The size is fixed in advance' },
        ]}
      />
    ),
    notes: 'These costs are what linked allocation answers.',
  },
  {
    id: 'c3-anywhere',
    section: C3,
    label: 'Elements Anywhere',
    element: (
      <ContentSlide
        kicker={C3}
        title="Elements Anywhere"
        lead="If elements could sit anywhere, nothing would shift"
        lesson={SESSION}
        points={[
          { text: 'But there is no next location to calculate', icon: 'warning' },
          { text: 'How do we find the next element?', icon: 'bulb' },
        ]}
      >
        <MemoryMap
          width={440}
          height={290}
          frames={[
            {
              cells: [
                { id: 'e0', x: 60, y: 20, value: '12', addr: 1020, addrSide: 'below', state: 'lit' },
                { id: 'e1', x: 300, y: 60, value: '25', addr: 1080, addrSide: 'below' },
                { id: 'e2', x: 90, y: 190, value: '37', addr: 1000, addrSide: 'below' },
                { id: 'e3', x: 320, y: 200, value: '48', addr: 1060, addrSide: 'below' },
              ],
              markers: [{ id: 'q', cell: 'e0', text: 'next?', side: 'right', tone: 'warn' }],
            },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Linked allocation keeps the elements where they are and records the order separately.',
  },
  {
    id: 'c3-store-next',
    section: C3,
    label: 'Store the Next Location',
    element: (
      <ContentSlide kicker={C3} title="Store the Next Location" lead="Each element carries the address of the element after it" lesson={SESSION}>
        <MemoryMap
          width={640}
          height={260}
          frames={[
            {
              cells: [{ id: 'x12', x: 20, y: 40, fields: ['12', '?'], addr: 1020, addrSide: 'below', state: 'lit' }],
              caption: 'The value, and a second slot: where is the next one?',
            },
            {
              cells: [
                { id: 'x12', x: 20, y: 40, fields: ['12', '1080'], addr: 1020, addrSide: 'below', state: 'lit' },
                { id: 'x25', x: 320, y: 150, value: '25', addr: 1080, addrSide: 'below' },
              ],
              arrows: [{ id: 'xa', from: 'x12', to: 'x25' }],
              caption: 'The slot holds 1080, the address of 25',
            },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'The capability in plain words. The value stored in that second slot has a name, which comes next.',
  },
  {
    id: 'c3-pointers',
    section: C3,
    label: 'Pointers',
    element: (
      <ContentSlide
        kicker={C3}
        title="Pointers"
        lead="A value that is the address of another location"
        lesson={SESSION}
        points={[
          { text: 'That value is called a pointer', icon: 'link' },
          { text: 'P at 3000 holds 4096', sub: 'Follow it to 4096, which holds "Ravi"', icon: 'arrow' },
        ]}
      >
        <div className="w-full space-y-3">
          <MemoryMap
            width={440}
            height={270}
            frames={[
              {
                cells: [
                  { id: 'p', x: 110, y: 40, value: '4096', w: 90, addr: 3000, addrSide: 'left', state: 'lit' },
                  { id: 'ravi', x: 300, y: 190, value: 'Ravi', w: 90, addr: 4096, addrSide: 'left' },
                ],
                arrows: [{ id: 'pr', from: 'p', to: 'ravi' }],
                markers: [{ id: 'mp', cell: 'p', text: 'P', side: 'above' }],
              },
            ]}
          />
          <Callout kind="warning" asStep={false}>
            P lives at 3000 but holds 4096
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes: 'A pointer is content that happens to be an address. Common slip: confusing the pointer\'s own address (3000) with the address it holds (4096).',
  },
  {
    id: 'c3-null',
    section: C3,
    label: 'Pointing Nowhere',
    element: (
      <ContentSlide kicker={C3} title="Pointing Nowhere" lead="NULL means a pointer points nowhere, and marks the end of a chain" lesson={SESSION}>
        <AnalogyMap
          leftLabel="A phone contact"
          rightLabel="A pointer"
          rows={[
            { from: 'A saved contact', to: 'The pointer: how to reach the data' },
            { from: 'Your friend', to: 'The data it points to' },
            { from: 'Your friend changes number', to: 'Change the pointer: the data stays put' },
            { from: 'A deleted contact', to: 'NULL: points nowhere' },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Ask: what happens if a program follows a NULL pointer? It has nowhere to go: this is the null pointer error learners will meet in code. In C, int *p stores an address; in Python and Java every object variable is a reference to an object. NULL is written Λ or 0 in many books.',
  },
  {
    id: 'c3-node',
    section: C3,
    label: 'A Node',
    element: (
      <ContentSlide
        kicker={C3}
        title="A Node"
        lead="Each element is stored in a node with two fields"
        lesson={SESSION}
        points={[
          { text: 'INFO holds the value', icon: 'database' },
          { text: 'LINK holds the address of the next node', icon: 'link' },
          { text: 'A treasure hunt clue works the same way', sub: 'A prize, and where the next clue is', icon: 'star' },
        ]}
      >
        <MemoryMap
          width={440}
          height={180}
          frames={[
            {
              cells: [{ id: 'node', x: (440 - NODE_W) / 2, y: 60, fields: ['12', '1080'], state: 'lit' }],
              markers: [
                { id: 'mi', cell: 'node', text: 'INFO', side: 'left' },
                { id: 'ml', cell: 'node', text: 'LINK', side: 'right' },
              ],
            },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Draw one node large on the board and label both fields before showing the chain. INFO and LINK come together because neither means anything alone.',
  },
  {
    id: 'c3-linked-list',
    section: C3,
    label: 'A Linked List',
    element: (
      <ContentSlide kicker={C3} title="A Linked List" lead="FIRST points to the first node, and the last LINK is NULL" lesson={SESSION}>
        <MemoryMap
          width={1000}
          height={180}
          frames={[1, 2, 3, 4].map((k) => ({
            ...chainUpTo(k),
            markers: [{ id: 'first', cell: 'n12', text: 'FIRST', side: 'left' as const }],
            caption: k === 4 ? 'The order comes only from the links, not from the addresses' : undefined,
          }))}
        />
      </ContentSlide>
    ),
    notes: 'One node per press. Nodes joined by links like this are called a linked list.',
  },
  {
    id: 'c3-follow',
    section: C3,
    label: 'Following the Links',
    element: (
      <ContentSlide kicker={C3} title="Following the Links" lead="FIRST = 1020: read the list from memory" lesson={SESSION}>
        <MemoryMap
          width={1000}
          height={310}
          frames={[
            { cells: memTable(70), caption: 'Start at FIRST' },
            { cells: memTable(70, [1020]), caption: '1020 holds 12, and its LINK says 1080' },
            { cells: memTable(70, [1020, 1080]), arrows: traceArrows([[1020, 1080]]), caption: '1080 holds 25, and its LINK says 1000' },
            { cells: memTable(70, [1020, 1080, 1000]), arrows: traceArrows([[1020, 1080], [1080, 1000]]), caption: '1000 holds 37, and its LINK says 1060' },
            {
              cells: memTable(70, [1020, 1080, 1000, 1060]),
              arrows: traceArrows([[1020, 1080], [1080, 1000], [1000, 1060]]),
              caption: '1060 holds 48, and its LINK is NULL, so stop',
            },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Trace slowly with learners calling out the next address. The list is 12, 25, 37, 48 even though the nodes are not in address order. To reach the 4th element we pass through the first three: there is no address formula here.',
  },
  {
    id: 'c3-traversal',
    section: C3,
    label: 'Traversal',
    element: (
      <ContentSlide kicker={C3} title="Traversal" lead="While P is not NULL: use INFO(P), then set P to LINK(P)" lesson={SESSION}>
        <MemoryMap
          width={1000}
          height={190}
          frames={[
            { ...chainUpTo(4), markers: [{ id: 'p', cell: 'n12', text: 'P', side: 'below' }], caption: 'Set P to FIRST' },
            { ...chainUpTo(4, ['n12']), markers: [{ id: 'p', cell: 'n12', text: 'P', side: 'below' }], caption: 'Output: 12' },
            { ...chainUpTo(4, ['n12', 'n25']), markers: [{ id: 'p', cell: 'n25', text: 'P', side: 'below' }], caption: 'Output: 12, 25' },
            { ...chainUpTo(4, ['n12', 'n25', 'n37']), markers: [{ id: 'p', cell: 'n37', text: 'P', side: 'below' }], caption: 'Output: 12, 25, 37' },
            { ...chainUpTo(4, ['n12', 'n25', 'n37', 'n48']), markers: [{ id: 'p', cell: 'n48', text: 'P', side: 'below' }], caption: 'Output: 12, 25, 37, 48' },
            { ...chainUpTo(4, ['n12', 'n25', 'n37', 'n48']), markers: [{ id: 'p', cell: 'n48', text: 'P = NULL', side: 'right', tone: 'warn' }], caption: 'P is NULL, so the loop stops' },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Visiting every node once is called traversal. The loop stops only because the last LINK is NULL.',
  },
  {
    id: 'c3-try-2',
    section: C3,
    label: 'Try It',
    element: (
      <ContentSlide
        kicker={C3}
        title="Try It"
        lead="Same memory, but FIRST = 1080"
        lesson={SESSION}
        points={[{ text: 'Which list do you get?', icon: 'bulb' }]}
      >
        <MemoryMap
          width={440}
          height={310}
          frames={[
            { cells: memTable(110) },
            { cells: memTable(110, [1080, 1000, 1060]), arrows: traceArrows([[1080, 1000], [1000, 1060]]), caption: 'The list is 25, 37, 48' },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'The same memory can hold different lists depending on where we start.',
  },
  {
    id: 'c3-insert-node',
    section: C3,
    label: 'Inserting a Node',
    element: (
      <ContentSlide kicker={C3} title="Inserting a Node" lead="Insert 30 after 25, using the free node 1040" lesson={SESSION}>
        <div className="w-full space-y-2">
          <MemoryMap
            width={1000}
            height={232}
            frames={[
              {
                cells: [insNode('n12', '12', '1080', 1020), insNode('n25', '25', '1000', 1080), insNode('n37', '37', '1060', 1000), insNode('n48', '48', 'NULL', 1060), ins30('', '', 'ghost')],
                arrows: [
                  { id: 'a1', from: 'n12', to: 'n25' },
                  { id: 'a2', from: 'n25', to: 'n37' },
                  { id: 'a3', from: 'n37', to: 'n48' },
                ],
                markers: [{ id: 'av', cell: 'n30', text: 'AVAIL: free nodes', side: 'right' }],
                caption: 'Free nodes wait in a pool called AVAIL',
              },
              {
                cells: [insNode('n12', '12', '1080', 1020), insNode('n25', '25', '1000', 1080), insNode('n37', '37', '1060', 1000), insNode('n48', '48', 'NULL', 1060), ins30('30', '', 'lit')],
                arrows: [
                  { id: 'a1', from: 'n12', to: 'n25' },
                  { id: 'a2', from: 'n25', to: 'n37' },
                  { id: 'a3', from: 'n37', to: 'n48' },
                ],
                caption: 'Step 1: INFO(1040) ← 30',
              },
              {
                cells: [insNode('n12', '12', '1080', 1020), insNode('n25', '25', '1000', 1080), insNode('n37', '37', '1060', 1000), insNode('n48', '48', 'NULL', 1060), ins30('30', '1000', 'lit')],
                arrows: [
                  { id: 'a1', from: 'n12', to: 'n25' },
                  { id: 'a2', from: 'n25', to: 'n37' },
                  { id: 'a3', from: 'n37', to: 'n48' },
                  { id: 'a4', from: 'n30', to: 'n37' },
                ],
                caption: 'Step 2: LINK(1040) ← LINK(1080), so 30 points to 37',
              },
              {
                cells: [insNode('n12', '12', '1080', 1020), insNode('n25', '25', '1040', 1080, 'lit'), insNode('n37', '37', '1060', 1000), insNode('n48', '48', 'NULL', 1060), ins30('30', '1000', 'ok')],
                arrows: [
                  { id: 'a1', from: 'n12', to: 'n25' },
                  { id: 'a5', from: 'n25', to: 'n30' },
                  { id: 'a3', from: 'n37', to: 'n48' },
                  { id: 'a4', from: 'n30', to: 'n37' },
                ],
                caption: 'Step 3: LINK(1080) ← 1040. The list is 12, 25, 30, 37, 48',
              },
            ]}
          />
          <Callout kind="warning" asStep={false}>
            Step 2 must come before step 3, or the address 1000 is lost
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes:
      'Nothing was shifted. Ask what goes wrong if steps 2 and 3 are swapped: once LINK(1080) is overwritten, the address 1000 is lost and the rest of the list is cut off. This is the most common error in linked-list code.',
  },
  {
    id: 'c3-delete-node',
    section: C3,
    label: 'Deleting a Node',
    element: (
      <ContentSlide kicker={C3} title="Deleting a Node" lead="Delete 37: make the node before it skip over it" lesson={SESSION}>
        <MemoryMap
          width={1000}
          height={230}
          frames={[
            {
              cells: [delNode(0, 'd12', '12', '1080', 1020), delNode(1, 'd25', '25', '1040', 1080), delNode(2, 'd30', '30', '1000', 1040), delNode(3, 'd37', '37', '1060', 1000, 'warn'), delNode(4, 'd48', '48', 'NULL', 1060)],
              arrows: [
                { id: 'b1', from: 'd12', to: 'd25' },
                { id: 'b2', from: 'd25', to: 'd30' },
                { id: 'b3', from: 'd30', to: 'd37' },
                { id: 'b4', from: 'd37', to: 'd48' },
              ],
              caption: '37 is in node 1000, after 30',
            },
            {
              cells: [delNode(0, 'd12', '12', '1080', 1020), delNode(1, 'd25', '25', '1040', 1080), delNode(2, 'd30', '30', '1060', 1040, 'lit'), delNode(3, 'd37', '37', '1060', 1000, 'muted'), delNode(4, 'd48', '48', 'NULL', 1060)],
              arrows: [
                { id: 'b1', from: 'd12', to: 'd25' },
                { id: 'b2', from: 'd25', to: 'd30' },
                { id: 'b5', from: 'd30', to: 'd48', bend: -110 },
              ],
              caption: 'LINK(1040) ← LINK(1000), so 30 now points to 48',
            },
            {
              cells: [delNode(0, 'd12', '12', '1080', 1020), delNode(1, 'd25', '25', '1040', 1080), delNode(2, 'd30', '30', '1060', 1040), delNode(4, 'd48', '48', 'NULL', 1060)],
              arrows: [
                { id: 'b1', from: 'd12', to: 'd25' },
                { id: 'b2', from: 'd25', to: 'd30' },
                { id: 'b5', from: 'd30', to: 'd48', bend: -110 },
              ],
              caption: 'Node 1000 returns to AVAIL: the list is 12, 25, 30, 48',
            },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Only one LINK changed. Compare with inserting into an array, which needed three shifts.',
  },
  {
    id: 'c3-compare',
    section: C3,
    label: 'Sequential or Linked',
    element: (
      <ContentSlide kicker={C3} title="Sequential or Linked" lead="The same list, the two layouts, side by side" lesson={SESSION}>
        <div className="w-full space-y-3">
          <DataTable
          className="w-full"
            stepped
            compact
            columns={[{ label: 'Feature', weight: 1 }, { label: 'Sequential', weight: 1.2 }, { label: 'Linked', weight: 1.3 }]}
            rows={[
              ['Placement', 'Consecutive locations', 'Anywhere, joined by pointers'],
              ['Reach the i-th element', 'Direct, by the formula', 'Follow links from FIRST'],
              ['Insert or delete', 'Slow: elements shift', 'Fast once found: change links'],
              ['Size', 'Fixed in advance', 'Grows and shrinks using AVAIL'],
              ['Extra memory', 'None', 'One LINK field in every node'],
            ]}
          />
          <Callout kind="success" title="Verdict">
            Choose by the operation the list does most
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes: 'Neither layout wins every time. Many look-ups: sequential. Many inserts and deletes: linked.',
  },
  {
    id: 'c3-your-turn',
    section: C3,
    label: 'Your Turn',
    element: (
      <ContentSlide kicker={C3} title="Your Turn" lead="Vote on a layout, and give a reason" lesson={SESSION}>
        <div className="grid grid-cols-3 gap-5">
          {[
            { icon: 'target' as const, q: 'Monthly temperatures of a city for one year', a: 'Sequential: fixed size, read by month number' },
            { icon: 'play' as const, q: 'A music queue where songs are added and removed while playing', a: 'Linked: constant adding and removing' },
            { icon: 'code' as const, q: 'A 10 × 10 multiplication table', a: 'Sequential: a two-dimensional array' },
          ].map((c) => (
            <Card key={c.q} icon={c.icon}>
              <p className="text-body-lg font-medium" style={{ color: colors.ink }}>
                {c.q}
              </p>
              <Step className="mt-4 rounded-xl px-4 py-3 text-[18px] font-semibold" style={{ background: colors.surface2, color: colors.brandDark }}>
                {c.a}
              </Step>
            </Card>
          ))}
        </div>
      </ContentSlide>
    ),
    notes: "Ask for a reason, not only an answer. Python's list is sequential (an array of references), which is why inserting at the front of a long list is slow.",
  },

  /* ── CONCEPT 4: BIT REPRESENTED SETS (STAR) ──────────────────────────── */
  {
    id: 'c4-divider',
    section: C4,
    label: 'Divider',
    element: <SectionBreakerSlide index={4} title={C4} lesson={SESSION} />,
  },
  {
    id: 'c4-set-as-list',
    section: C4,
    label: 'A Set as a List',
    element: (
      <ContentSlide kicker={C4} title="A Set as a List" lead="Store A = {1, 3, 5, 7, 9} and B = {2, 3, 5, 7} as lists" lesson={SESSION}>
        <MemoryMap
          width={900}
          height={230}
          frames={[
            {
              cells: [
                ...row(['1', '3', '5', '7', '9'].map((v) => ({ id: `la${v}`, value: v })), { x: 60, y: 20, gap: 12 }),
                ...row(['2', '3', '5', '7'].map((v) => ({ id: `lb${v}`, value: v })), { x: 60, y: 130, gap: 12 }),
              ],
              markers: [
                { id: 'ma', cell: 'la1', text: 'A', side: 'left' },
                { id: 'mb', cell: 'lb2', text: 'B', side: 'left' },
              ],
              caption: 'To find A ∩ B, check each element of A against B',
            },
            {
              cells: [
                ...row(['1', '3', '5', '7', '9'].map((v) => ({ id: `la${v}`, value: v, state: v === '1' ? ('lit' as const) : ('plain' as const) })), { x: 60, y: 20, gap: 12 }),
                ...row(['2', '3', '5', '7'].map((v) => ({ id: `lb${v}`, value: v, state: 'warn' as const })), { x: 60, y: 130, gap: 12 }),
              ],
              markers: [
                { id: 'ma', cell: 'la1', text: 'A', side: 'left' },
                { id: 'mb', cell: 'lb2', text: 'B', side: 'left' },
              ],
              caption: 'Is 1 in B? That takes 4 comparisons',
            },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'This is the routine the room already knows: a set stored as a list, in the sequential layout.',
  },
  {
    id: 'c4-every-pair',
    section: C4,
    label: 'Every Pair Compared',
    element: (
      <ContentSlide
        kicker={C4}
        title="Every Pair Compared"
        lead="Every element of A is checked against every element of B"
        lesson={SESSION}
        points={[
          { text: '5 × 4 = 20 comparisons for two small sets', icon: 'warning' },
          { text: '"Is 6 in A?" means checking all of A', icon: 'eye' },
        ]}
      >
        <DataTable
          className="w-full"
          stepped
          compact
          columns={[{ label: 'A \\ B', align: 'center' }, { label: '2', align: 'center' }, { label: '3', align: 'center' }, { label: '5', align: 'center' }, { label: '7', align: 'center' }]}
          rows={[
            ['1', '≠', '≠', '≠', '≠'],
            ['3', '≠', '=', '≠', '≠'],
            ['5', '≠', '≠', '=', '≠'],
            ['7', '≠', '≠', '≠', '='],
            ['9', '≠', '≠', '≠', '≠'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'The count grows with both sets: double each set and the comparisons go up four times.',
  },
  {
    id: 'c4-task',
    section: C4,
    label: 'One Place per Element',
    element: (
      <FlowChartSlide
        kicker={C4}
        title="One Place per Element"
        lead="We need to answer “is x in the set?” by looking at one fixed place"
        lesson={SESSION}
        nodes={[
          { label: 'An element x', caption: 'From the universal set U', icon: 'target' },
          { label: 'Its own place', caption: 'Fixed, the same for every set', icon: 'database' },
          { label: 'Yes or no', caption: 'In the set, or not', icon: 'check' },
        ]}
      />
    ),
    notes: 'The capability, before the representation.',
  },
  {
    id: 'c4-definition',
    section: C4,
    label: 'Bit Represented Sets',
    element: (
      <ContentSlide
        kicker={C4}
        title="Bit Represented Sets"
        lead="An attendance register stores one bit for each student"
        lesson={SESSION}
        points={[
          { text: 'Fix an order for the universal set U', icon: 'route' },
          { text: 'Bit i is 1 when the i-th element is in the set', sub: 'And 0 when it is not', icon: 'check' },
          { text: 'A set stored like this is a bit represented set', icon: 'bulb' },
        ]}
      >
        <BitStrip
          elements={['Asha', 'Ben', 'Chen', 'Dev', 'Esha', 'Ravi']}
          cell={52}
          gap={5}
          labelWidth={96}
          frames={[{ rows: [{ label: 'Present', bits: '110101' }] }]}
        />
      </ContentSlide>
    ),
    notes: 'The order of U is fixed once and used for every set; otherwise bit strings cannot be compared. Writing the elements right to left, like binary place values, is also correct if used consistently.',
  },
  {
    id: 'c4-set-to-bits',
    section: C4,
    label: 'From Set to Bits',
    element: (
      <ContentSlide kicker={C4} title="From Set to Bits" lead="U = {1, 2, …, 10}, in this order from left to right" lesson={SESSION}>
        <BitStrip
          elements={U10}
          setWidth={230}
          frames={[
            { rows: [{ label: 'A: odd', bits: '          ', set: '{1, 3, 5, 7, 9}' }] },
            { rows: [{ label: 'A: odd', bits: A_BITS, set: '{1, 3, 5, 7, 9}' }], caption: 'A = 1010101010' },
            {
              rows: [
                { label: 'A: odd', bits: A_BITS, set: '{1, 3, 5, 7, 9}' },
                { label: 'B: primes', bits: B_BITS, set: '{2, 3, 5, 7}' },
              ],
              caption: 'B = 0110101000',
            },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Build row A with the class element by element before the press that fills it. Let them build row B on their own.',
  },
  {
    id: 'c4-bits-to-set',
    section: C4,
    label: 'From Bits to Set',
    element: (
      <ContentSlide kicker={C4} title="From Bits to Set" lead="List the positions that hold 1" lesson={SESSION}>
        <div className="w-full space-y-3">
          <BitStrip
            elements={U10}
            cell={42}
            setWidth={230}
            frames={[
              { rows: [{ label: 'Bits', bits: '1100000011', set: '{1, 2, 9, 10}' }], ring: [0, 1, 8, 9] },
              {
                rows: [
                  { label: 'Bits', bits: '1100000011', set: '{1, 2, 9, 10}' },
                  { label: 'Empty set', bits: '0000000000', set: '∅' },
                  { label: 'U', bits: '1111111111', set: 'U' },
                ],
              },
              {
                rows: [
                  { label: 'Bits', bits: '1100000011', set: '{1, 2, 9, 10}' },
                  { label: 'Empty set', bits: '0000000000', set: '∅' },
                  { label: 'U', bits: '1111111111', set: 'U' },
                  { label: 'Try it', bits: '0001001000', set: '{4, 7}', result: true },
                ],
              },
            ]}
          />
          <Callout kind="info" asStep={false}>
            |A| is the number of 1s, and one 16-bit word holds any subset of 16 elements
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes: 'Decoding is the reverse of building. |A| = 5 and |B| = 4. Ask: what bit string stands for {10}? Answer: 0000000001.',
  },
  {
    id: 'c4-operations',
    section: C4,
    label: 'Set and Bit Operations',
    element: (
      <ContentSlide kicker={C4} title="Set and Bit Operations" lead="Each set operation becomes a bit operation, position by position" lesson={SESSION}>
        <DataTable
          className="w-full"
          stepped
          compact
          columns={[{ label: 'Set operation', weight: 1.3 }, { label: 'Bits', weight: 0.9 }, { label: 'Rule at each position', weight: 1.5 }, { label: 'Region', weight: 0.7, align: 'center' }]}
          rows={[
            ['Union A ∪ B', 'A OR B', '1 if either bit is 1', <VennMini region="union" width={64} />],
            ['Intersection A ∩ B', 'A AND B', '1 only if both bits are 1', <VennMini region="intersection" width={64} />],
            ['Complement A′', 'NOT A', 'Flip every bit', <VennMini region="complement" width={64} />],
            ['Difference A − B', 'A AND (NOT B)', '1 if 1 in A and 0 in B', <VennMini region="difference" width={64} />],
            ['Symmetric difference A ⊕ B', 'A XOR B', '1 if the two bits differ', <VennMini region="symmetric" width={64} />],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Bit i answers "is uᵢ in the set?", so each set operation is a logical connective applied position by position. Exam hook: A − B is A AND NOT B; learners often write A AND B by mistake.',
  },
  {
    id: 'c4-or-and-not',
    section: C4,
    label: 'OR, AND, NOT',
    element: (
      <ContentSlide kicker={C4} title="OR, AND, NOT" lead="Same A and B: odd numbers and primes up to 10" lesson={SESSION}>
        <BitStrip
          elements={U10}
          labelWidth={170}
          setWidth={240}
          frames={[0, 1, 2, 3].map((k) => ({
            rows: [
              { label: 'A', bits: A_BITS, set: '{1, 3, 5, 7, 9}' },
              { label: 'B', bits: B_BITS, set: '{2, 3, 5, 7}' },
              ...[
                { label: 'A ∪ B: OR', bits: '1110101010', set: '{1, 2, 3, 5, 7, 9}', result: true },
                { label: 'A ∩ B: AND', bits: '0010101000', set: '{3, 5, 7}', result: true },
                { label: 'A′: NOT A', bits: '0101010101', set: '{2, 4, 6, 8, 10}', result: true },
              ].slice(0, k),
            ],
          }))}
        />
      </ContentSlide>
    ),
    notes: 'Do the OR row column by column with the class, then let them do AND and NOT. Check each answer against the sets directly.',
  },
  {
    id: 'c4-andnot-xor',
    section: C4,
    label: 'AND NOT and XOR',
    element: (
      <ContentSlide kicker={C4} title="AND NOT and XOR" lead="Same A and B, two more operations" lesson={SESSION}>
        <BitStrip
          elements={U10}
          labelWidth={200}
          setWidth={270}
          cell={42}
          frames={[0, 1, 2, 3, 4].map((k) => ({
            rows: [
              { label: 'A', bits: A_BITS, set: '{1, 3, 5, 7, 9}' },
              { label: 'B', bits: B_BITS, set: '{2, 3, 5, 7}' },
              ...[
                { label: "B′: NOT B", bits: '1001010111', set: '{1, 4, 6, 8, 9, 10}', result: true },
                { label: "A − B: A AND B′", bits: '1000000010', set: '{1, 9}', result: true },
                { label: 'A ⊕ B: XOR', bits: '1100000010', set: '{1, 2, 9}', result: true },
              ].slice(0, Math.min(k, 3)),
            ],
            caption: k === 4 ? 'Check: (A − B) ∪ (B − A) = {1, 9} ∪ {2} = {1, 2, 9}' : undefined,
          }))}
        />
      </ContentSlide>
    ),
    notes:
      'Subset test: A ⊆ B exactly when A AND B = A. Here A AND B ≠ A, so A is not a subset of B. A computer applies AND or OR to a whole word, up to 64 elements, in one machine instruction.',
  },
  {
    id: 'c4-sieve',
    section: C4,
    label: 'Sieve of Eratosthenes',
    element: (
      <ContentSlide kicker={C4} title="Sieve of Eratosthenes" lead="Find every prime up to 20 with a bit represented set" lesson={SESSION}>
        <div className="w-full space-y-5">
          <BitStrip elements={SIEVE_NUMS.map(String)} cell={42} gap={5} labelWidth={90} frames={[{ rows: [{ label: 'PRIME', bits: sieveBits([]) }] }]} />
          <div className="grid grid-cols-2 gap-3">
            {[
              ['Start with every bit of PRIME equal to 1', ''],
              ['Take the smallest p still in PRIME', 'M = the multiples of p greater than p'],
              ['PRIME ← PRIME AND (NOT M)', 'The set difference PRIME − M'],
              ['Move to the next p', 'Stop when p × p > 20'],
            ].map(([t, sub], i) => (
              <Step key={t} className="flex items-start gap-3 rounded-card border border-line bg-white px-4 py-3 shadow-card-soft">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full font-heading text-[16px] font-semibold text-white" style={{ background: colors.brand }}>
                  {i + 1}
                </span>
                <span>
                  <span className="block font-heading text-[18px] font-semibold" style={{ color: colors.ink }}>{t}</span>
                  {sub && <span className="block text-[16px]" style={{ color: colors.ink }}>{sub}</span>}
                </span>
              </Step>
            ))}
          </div>
        </div>
      </ContentSlide>
    ),
    notes: 'Finding primes by removing multiples is the sieve of Eratosthenes. Every step is a set difference done with AND and NOT on whole words (Tremblay and Manohar).',
  },
  {
    id: 'c4-sieve-run',
    section: C4,
    label: 'Running the Sieve',
    element: (
      <ContentSlide kicker={C4} title="Running the Sieve" lead="Two passes are enough for 20" lesson={SESSION}>
        <BitStrip
          elements={SIEVE_NUMS.map(String)}
          cell={42}
          gap={5}
          labelWidth={90}
          frames={[
            { rows: [{ label: 'PRIME', bits: sieveBits([]) }], caption: 'Every number starts in PRIME' },
            { rows: [{ label: 'PRIME', bits: sieveBits([2]) }], caption: 'p = 2 removes 4, 6, 8 and every even number up to 20' },
            { rows: [{ label: 'PRIME', bits: sieveBits([2, 3]) }], caption: 'p = 3 removes 6, 9, 12, 15, 18, but only 9 and 15 change' },
            {
              rows: [{ label: 'PRIME', bits: sieveBits([2, 3]) }],
              ring: PRIME_POSITIONS,
              caption: 'Next is p = 5, and 5 × 5 = 25 > 20, so stop: 2, 3, 5, 7, 11, 13, 17, 19',
            },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Ask why we can stop at p = 5: every composite number up to 20 has a factor no larger than √20, which is less than 5. Also ask why 4 never needs its own pass: its multiples were removed as multiples of 2.',
  },
  {
    id: 'c4-practice',
    section: C4,
    label: 'Practice',
    element: (
      <ContentSlide kicker={C4} title="Practice" lead="U = {a, …, h} in order, A = {a, c, d, f}, B = {b, c, f, h}" lesson={SESSION}>
        <DataTable
          className="w-full"
          revealColumn={1}
          compact
          columns={[{ label: 'Find', weight: 0.6 }, { label: 'Answer', weight: 1.6 }]}
          rows={[
            ['A', <span className="font-mono">10110100</span>],
            ['B', <span className="font-mono">01100101</span>],
            ['A ∪ B', <span className="font-mono">11110101 = {'{a, b, c, d, f, h}'}</span>],
            ['A ∩ B', <span className="font-mono">00100100 = {'{c, f}'}</span>],
            ['A′', <span className="font-mono">01001011 = {'{b, e, g, h}'}</span>],
            ['A − B', <span className="font-mono">10110100 AND 10011010 = 10010000 = {'{a, d}'}</span>],
            ['A ⊕ B', <span className="font-mono">11010001 = {'{a, b, d, h}'}</span>],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Give two minutes before revealing the answers, one per press. Ask learners to check A ⊕ B by computing B − A = {b, h} and taking the union with A − B.',
  },
  {
    id: 'c4-code',
    section: C4,
    label: 'In Real Programs',
    element: (
      <ContentSlide
        kicker={C4}
        title="In Real Programs"
        lead="Python's | & ~ ^ are OR, AND, NOT and XOR on bits"
        lesson={SESSION}
      >
        <div className="w-full space-y-3">
          <CodeOutput
            panes={[
              {
                location: 'VS Code · bitsets.py',
                code: 'A = 0b10110100\nB = 0b01100101\nprint(bin(A | B))\nprint(bin(A & B))\nprint(bin(A & ~B))\nprint(bin(A ^ B))\nprint(bin(~A & 0b11111111))',
                output: '0b11110101\n0b100100\n0b10010000\n0b11010001\n0b1001011',
                showLineNumbers: true,
              },
            ]}
          />
          <Callout kind="info" asStep={false}>
            Linux file permissions use 3 bits: r-x is 101
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes:
      'Run it live if a laptop is available. Python does not print leading zeros, so 0b100100 is 00100100. The mask in the last line keeps only the 8 bits of our universe, because ~ works on integers of unlimited length. Bit sets are also used for feature flags in apps and bitmap indexes in databases.',
  },

  /* ── CLOSING ─────────────────────────────────────────────────────────── */
  {
    id: 'quiz-2',
    section: 'Closing',
    label: 'Quiz Time',
    element: <QuizTimeSlide lesson={SESSION} />,
    notes: 'The last check, before the takeaways.',
  },
  {
    id: 'takeaways',
    section: 'Closing',
    label: 'Key Takeaways',
    element: <KeyTakeawaysSlide title={SESSION} lesson={SESSION} points={AGENDA} />,
    notes: 'The four agenda items, word for word.',
  },
  {
    id: 'feedback',
    section: 'Closing',
    label: 'Feedback',
    element: <FeedbackSlide lesson={SESSION} formless />,
    notes: "No form and no QR on this deck's feedback frame (user, 2026-11-21). Ask for feedback out loud.",
  },
  {
    id: 'thank-you',
    section: 'Closing',
    label: 'Thank you',
    element: <ThankYouSlide title="Thank You" lesson={SESSION} />,
  },
  {
    id: 'all-the-best',
    section: 'Closing',
    label: 'All the best',
    element: <ThankYouSlide title="All the Best" lesson={SESSION} />,
  },
]

/** Small squares for the units table: 1, 8 or 32 of them. */
function Squares({ n }: { n: number }) {
  return (
    <span className="flex flex-wrap gap-[3px]" style={{ maxWidth: 16 * 11 }}>
      {Array.from({ length: n }, (_, i) => (
        <span key={i} className="h-[8px] w-[8px] rounded-[2px]" style={{ background: colors.brand }} />
      ))}
    </span>
  )
}
