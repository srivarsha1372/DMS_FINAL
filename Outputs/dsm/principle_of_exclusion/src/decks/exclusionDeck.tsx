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
 * THE PRINCIPLE OF EXCLUSION (DSM, Elementary Combinatorics).
 *
 * Built from the signed-off plan at
 *   Outputs/dsm/session_plans/principle_of_exclusion/plan.md
 * (46 slides, one per TR slide). Every count was recomputed by `verify_tr.py`.
 * No cross-session phrases (user rule, 2026-11-26).
 * Venn diagrams: text-free SVG circles; every number is a real page element,
 * so the harnesses can see the labels and none sits on a box.
 */

const SESSION = 'The Principle of Exclusion'
const C1 = 'Counting with Overlaps'
const C2 = 'Inclusion–Exclusion for Two Sets'
const C3 = 'Inclusion–Exclusion for Three Sets'
const C4 = 'Applying Inclusion–Exclusion'
const C5 = 'Derangements'
const C6 = 'Putting It All Together'
const AGENDA = [C1, C2, C3, C4, C5, C6]

export const exclusionMeta: DeckMeta = {
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
const PINK = '#DB2777'

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

const Big = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <span className={`block font-heading text-[22px] font-semibold ${className}`} style={{ color: colors.ink }}>
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
    <div className="w-fit min-w-[520px] space-y-2">
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

/* ── the Venn figure ────────────────────────────────────────────────────── */

type RegionKey = 'a' | 'b' | 'c' | 'ab' | 'ac' | 'bc' | 'abc' | 'out'
interface VennProps {
  sets: [string, string] | [string, string, string]
  values: Partial<Record<RegionKey, ReactNode>>
  /** regions revealed one per press, in this order; others shown at once */
  order?: RegionKey[]
  universe?: string
  hot?: RegionKey[]
}
function Venn({ sets, values, order = [], universe, hot = [] }: VennProps) {
  const k = useBuild(order.length)
  const three = sets.length === 3
  const W = three ? 360 : 380
  const H = three ? 330 : 230
  const cx = W / 2
  const cy = three ? 140 : 112
  const r = three ? 95 : 90
  const cols = [BLUE, ORANGE, PURPLE]
  const centres: [number, number][] = three
    ? [
        [cx - 55, cy - 32],
        [cx + 55, cy - 32],
        [cx, cy + 63],
      ]
    : [
        [cx - 55, cy],
        [cx + 55, cy],
      ]
  const pos: Record<RegionKey, [number, number]> = three
    ? { a: [cx - 100, cy - 60], b: [cx + 100, cy - 60], c: [cx, cy + 118], ab: [cx, cy - 72], ac: [cx - 60, cy + 46], bc: [cx + 60, cy + 46], abc: [cx, cy + 4], out: [W - 50, H - 22] }
    : { a: [cx - 92, cy], b: [cx + 92, cy], ab: [cx, cy], c: [0, 0], ac: [0, 0], bc: [0, 0], abc: [0, 0], out: [W - 50, H - 22] }
  return (
    <div className="w-fit shrink-0">
      {/* Set names live in a legend row, never inside the drawing, so they cannot touch a border or a count */}
      <div className="mb-2 flex w-fit flex-wrap gap-x-4 gap-y-1">
        {sets.map((s, i) => (
          <span key={s} className="flex items-center gap-1.5 text-[17px] font-semibold" style={{ color: cols[i] }}>
            <span className="h-3.5 w-3.5 rounded-full" style={{ background: cols[i] }} />
            {s}
          </span>
        ))}
      </div>
      <div className="relative" style={{ width: W, height: H }}>
        <svg width={W} height={H} className="absolute left-0 top-0" aria-hidden>
          {universe && <rect x={2} y={2} width={W - 4} height={H - 4} rx={14} fill="none" stroke={colors.ink} strokeWidth={2} />}
          {centres.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill={cols[i]} fillOpacity={0.12} stroke={cols[i]} strokeWidth={3} />
          ))}
        </svg>
        {universe && (
          <span className="absolute text-[16px] font-semibold" style={{ left: 12, top: H - 32, color: colors.ink }}>
            U = {universe}
          </span>
        )}
        {(Object.keys(values) as RegionKey[]).map((key) => {
          const oi = order.indexOf(key)
          const shown = oi < 0 || oi < k
          const isHot = hot.includes(key)
          const [x, y] = pos[key]
          return (
            <span
              key={key}
              className="absolute whitespace-nowrap rounded-md px-1.5 font-heading text-[20px] font-semibold"
              style={{ left: x, top: y, transform: 'translate(-50%, -50%)', opacity: shown ? 1 : 0, transition: 'opacity .4s', color: isHot ? '#fff' : colors.ink, background: isHot ? PINK : 'transparent' }}
            >
              {values[key]}
            </span>
          )
        })}
      </div>
    </div>
  )
}

/* ── the deck ───────────────────────────────────────────────────────────── */

export const exclusionDeck: SlideDef[] = [
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
          { title: C1, sub: 'Why adding group sizes can overcount' },
          { title: C2, sub: '|A ∪ B| = |A| + |B| − |A ∩ B|' },
          { title: C3, sub: 'Singles, pairs, the triple' },
          { title: C4, sub: 'Divisibility, arrangements, distributions' },
          { title: C5, sub: 'Nothing stays in its place' },
          { title: C6, sub: 'Choosing the form, mistakes, practice' },
        ]}
      />
    ),
  },

  /* ── CONCEPT 1 ───────────────────────────────────────────────────────── */
  { id: 'c1-divider', section: C1, label: 'Divider', element: <SectionBreakerSlide index={1} title={C1} lesson={SESSION} /> },
  {
    id: 'c1-clubs',
    section: C1,
    label: 'Counting Club Members',
    element: (
      <ContentSlide kicker={C1} title="Counting Club Members" lead="Think First: 10 in coding, 8 in music, 3 in both. How many in at least one club?" lesson={SESSION}>
        <div className="flex w-full items-center gap-8">
          <Venn sets={['Coding (10)', 'Music (8)']} values={{ a: 7, ab: 3, b: 5 }} hot={['ab']} />
          <div className="space-y-3">
            <Step>
              <Card tone="bad">
                <Txt>10 + 8 = 18 counts the 3 shared students twice</Txt>
              </Card>
            </Step>
            <Step>
              <Card tone="ok">
                <Big>18 − 3 = 15</Big>
              </Card>
            </Step>
            <Step>
              <Callout kind="info" title="The sum rule needs disjoint groups" asStep={false}>
                Today: the rule for groups that overlap
              </Callout>
            </Step>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"The sum rule warns us that groups must not overlap. Today we turn that warning into a principle that works for any number of overlapping groups." Subheading: Two clubs, some shared members.',
  },
  {
    id: 'c1-everywhere',
    section: C1,
    label: 'Overlaps Are Everywhere',
    element: (
      <ContentSlide kicker={C1} title="Overlaps Are Everywhere" lead="The key word is or: at least one condition, with shared members" lesson={SESSION}>
        <div className="grid w-full grid-cols-3 gap-4">
          {[
            ['Numbers 1–100 divisible by 2 or 3', 'Multiples of 2', 'Multiples of 3', 'Multiples of 6'],
            ['Students who play cricket or football', 'Cricket players', 'Football players', 'Play both'],
            ['Bit strings that start with 1 or end with 00', 'Start with 1', 'End with 00', 'Both conditions'],
          ].map(([q, a, b, ab]) => (
            <Step key={q}>
              <Card className="h-full">
                <Big className="text-[19px]">{q}</Big>
                <div className="mt-2 space-y-1">
                  <span className="block rounded-md px-2 py-0.5 text-[17px] font-semibold" style={{ background: `${BLUE}18`, color: colors.ink }}>
                    A: {a}
                  </span>
                  <span className="block rounded-md px-2 py-0.5 text-[17px] font-semibold" style={{ background: `${ORANGE}18`, color: colors.ink }}>
                    B: {b}
                  </span>
                  <span className="block rounded-md px-2 py-0.5 text-[17px] font-semibold text-white" style={{ background: PINK }}>
                    Shared: {ab}
                  </span>
                </div>
              </Card>
            </Step>
          ))}
        </div>
      </ContentSlide>
    ),
    notes: '"Ask learners for one more example of their own, such as people who speak Telugu or Hindi."',
  },
  {
    id: 'c1-idea',
    section: C1,
    label: 'Include, Then Exclude',
    element: (
      <ContentSlide kicker={C1} title="Include, Then Exclude" lead="Correct the overcount until every member is counted exactly once" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="flex w-fit items-center gap-4">
            {[
              ['Include', 'add all the group sizes', 'overlap counted 2 times', BLUE],
              ['Exclude', 'subtract what was counted too often', 'remove one copy', ORANGE],
              ['Done', 'every member counted', '1 time', TONE.ok],
            ].map(([t, d, s, c], i) => (
              <Step key={t}>
                <div className="w-[260px] rounded-card border-2 bg-white px-4 py-3" style={{ borderColor: c }}>
                  <span className="block font-heading text-[22px] font-semibold" style={{ color: c }}>
                    {i + 1}. {t}
                  </span>
                  <Txt className="text-[18px]">{d}</Txt>
                  <Txt className="text-[18px] font-semibold">{s}</Txt>
                </div>
              </Step>
            ))}
          </div>
          <Step>
            <Callout kind="success" title="The Principle of Inclusion–Exclusion" asStep={false}>
              Also called the principle of exclusion
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Keep this slide light. The goal is the phrase every member counted exactly once."',
  },

  /* ── CONCEPT 2 ───────────────────────────────────────────────────────── */
  { id: 'c2-divider', section: C2, label: 'Divider', element: <SectionBreakerSlide index={2} title={C2} lesson={SESSION} /> },
  {
    id: 'c2-regions',
    section: C2,
    label: 'Three Regions, Two Circles',
    element: (
      <ContentSlide kicker={C2} title="Three Regions, Two Circles" lead="How many times is each region counted in |A| + |B|?" lesson={SESSION}>
        <div className="flex w-full items-center gap-8">
          <Venn sets={['A', 'B']} values={{ a: '1', ab: '2', b: '1' }} order={['a', 'b', 'ab']} hot={['ab']} />
          <div className="space-y-2">
            <Card>
              <Txt>Only A: in |A|, not in |B|: once</Txt>
              <Txt>Only B: in |B|, not in |A|: once</Txt>
              <Txt className="font-semibold">A ∩ B: in both: twice</Txt>
            </Card>
            <Step>
              <Callout kind="info" title="Only the overlap is counted twice" asStep={false}>
                So subtract |A ∩ B| once
              </Callout>
            </Step>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"Ask learners to place a finger in each region and count how many circles they are inside."',
  },
  {
    id: 'c2-formula',
    section: C2,
    label: 'Inclusion–Exclusion for Two Sets',
    element: (
      <ContentSlide kicker={C2} title="Inclusion–Exclusion for Two Sets" lead="For finite sets A and B" lesson={SESSION}>
        <div className="flex w-full items-center gap-8">
          <div className="space-y-3">
            <Formula>|A ∪ B| = |A| + |B| − |A ∩ B|</Formula>
            <Step>
              <Card>
                <Txt>Disjoint sets: |A ∩ B| = 0, and this is the sum rule</Txt>
              </Card>
            </Step>
            <Step>
              <Card tone="warn">
                <Label tone="warn">Complement form</Label>
                <Txt>In neither set: |U| − |A ∪ B|</Txt>
              </Card>
            </Step>
          </div>
          <Venn sets={['A', 'B']} values={{ out: 'neither' }} universe="all" hot={['out']} />
        </div>
      </ContentSlide>
    ),
    notes: '"Point out that the sum rule is the special case with no overlap. Inclusion–exclusion is the general version."',
  },
  {
    id: 'c2-sports',
    section: C2,
    label: 'Cricket and Football',
    element: (
      <ContentSlide kicker={C2} title="Cricket and Football" lead="40 students: 25 cricket, 18 football, 10 both" lesson={SESSION}>
        <div className="flex w-full items-center gap-8">
          <Venn sets={['Cricket (25)', 'Football (18)']} values={{ ab: 10, a: 15, b: 8, out: 7 }} order={['ab', 'a', 'b', 'out']} universe="40" />
          <Steps
            items={[
              ['At least one: 25 + 18 − 10', '33'],
              ['Neither: 40 − 33', '7'],
              ['Only cricket 25 − 10, only football 18 − 10', '15, 8'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"Fill the Venn diagram from the inside out: the overlap first, then the only regions, then the outside. Check that 15 + 10 + 8 + 7 = 40."',
  },
  {
    id: 'c2-multiples',
    section: C2,
    label: 'How Many Multiples?',
    element: (
      <ContentSlide kicker={C2} title="How Many Multiples?" lead="Integers from 1 to n divisible by k: ⌊n / k⌋ (round down)" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="grid w-fit gap-1" style={{ gridTemplateColumns: 'repeat(15, 44px)' }}>
            {Array.from({ length: 30 }, (_, i) => i + 1).map((x) => {
              const two = x % 2 === 0
              const three = x % 3 === 0
              return (
                <span
                  key={x}
                  className="grid h-10 place-items-center rounded-md text-[17px] font-semibold"
                  style={{ background: two && three ? `linear-gradient(135deg, ${BLUE} 50%, ${ORANGE} 50%)` : two ? BLUE : three ? ORANGE : '#F1F5F9', color: two || three ? '#fff' : colors.ink }}
                >
                  {x}
                </span>
              )
            })}
          </div>
          <Steps
            items={[
              ['Divisible by 2 (blue)', '⌊100 / 2⌋ = 50'],
              ['Divisible by 3 (orange)', '⌊100 / 3⌋ = 33'],
              ['Divisible by 2 and 3: by their lcm 6 (both colours)', '⌊100 / 6⌋ = 16'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"Ask learners to check ⌊100 / 3⌋ = 33 by noting that 99 is the last multiple of 3."',
  },
  {
    id: 'c2-two-or-three',
    section: C2,
    label: 'Numbers Divisible by 2 or 3',
    element: (
      <ContentSlide kicker={C2} title="Numbers Divisible by 2 or 3" lead="How many integers from 1 to 100?" lesson={SESSION}>
        <div className="flex w-full items-center gap-8">
          <Venn sets={['Multiples of 2', 'Multiples of 3']} values={{ ab: 16, a: 34, b: 17, out: 33 }} order={['ab', 'a', 'b', 'out']} universe="100" />
          <Steps
            items={[
              ['A = multiples of 2, B = multiples of 3, A ∩ B = multiples of 6', '50, 33, 16'],
              ['|A ∪ B| = 50 + 33 − 16', '67'],
              ['Neither: 100 − 67', '33'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"Exam hook: this is the most common inclusion–exclusion question. Write A, B and A ∩ B in words before the numbers."',
  },
  {
    id: 'c2-practice',
    section: C2,
    label: 'Add, Subtract the Overlap',
    element: (
      <ContentSlide kicker={C2} title="Add, Subtract the Overlap" lead="Sketch a Venn diagram for each row, then reveal" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Problem', weight: 2.2 }, { label: 'Working', weight: 1.2 }, { label: 'Answer', weight: 0.5 }]}
          rows={[
            ['Integers 1–200 divisible by 4 or 6', '50 + 33 − 16 (lcm 12)', '67'],
            ['Integers 1–50 divisible by neither 3 nor 5', '50 − (16 + 10 − 3)', '27'],
            ['Bit strings of length 8 starting with 1 or ending with 00', '2⁷ + 2⁶ − 2⁵', '160'],
            ['60 people: 35 tea, 30 coffee, 12 both; neither?', '60 − (35 + 30 − 12)', '7'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"In the first row, stress that divisible by 4 and 6 means divisible by lcm(4, 6) = 12, not by 24."',
  },

  /* ── CONCEPT 3 ───────────────────────────────────────────────────────── */
  { id: 'c3-divider', section: C3, label: 'Divider', element: <SectionBreakerSlide index={3} title={C3} lesson={SESSION} /> },
  {
    id: 'c3-regions',
    section: C3,
    label: 'Seven Regions',
    element: (
      <ContentSlide kicker={C3} title="Seven Regions" lead="Singles − pairs + triple counts every element once" lesson={SESSION}>
        <div className="flex w-full items-center gap-8">
          <Venn sets={['A', 'B', 'C']} values={{ a: '1', b: '1', c: '1', ab: '2', ac: '2', bc: '2', abc: '3' }} hot={['abc']} />
          <div className="space-y-2">
            {[
              ['In exactly 1 set', '1 − 0 + 0 = 1'],
              ['In exactly 2 sets', '2 − 1 + 0 = 1'],
              ['In all 3 sets', '3 − 3 + 1 = 1'],
            ].map(([w, s]) => (
              <Step key={w}>
                <div className="flex w-[420px] items-center justify-between rounded-card border border-line bg-white px-4 py-2 shadow-card-soft">
                  <span className="text-[19px]" style={{ color: colors.ink }}>
                    {w}
                  </span>
                  <span className="font-heading text-[21px] font-semibold" style={{ color: TONE.ok }}>
                    {s}
                  </span>
                </div>
              </Step>
            ))}
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"Walk through the centre region carefully: added 3 times, subtracted 3 times, added back once. That is why the triple term is added." Each region shows how many sets contain it.',
  },
  {
    id: 'c3-formula',
    section: C3,
    label: 'Inclusion–Exclusion for Three Sets',
    element: (
      <ContentSlide kicker={C3} title="Inclusion–Exclusion for Three Sets" lead="For finite sets A, B and C" lesson={SESSION}>
        <div className="w-full space-y-4">
          <span className="inline-block rounded-xl px-5 py-3 font-heading text-[24px] font-semibold" style={{ background: '#F8FAFC', color: colors.ink, boxShadow: `inset 0 0 0 2px ${colors.line}` }}>
            |A ∪ B ∪ C| = <span style={{ color: TONE.ok }}>|A| + |B| + |C|</span> <span style={{ color: TONE.bad }}>− |A ∩ B| − |A ∩ C| − |B ∩ C|</span>{' '}
            <span style={{ color: TONE.ok }}>+ |A ∩ B ∩ C|</span>
          </span>
          <Steps
            items={[
              ['Add the three singles', '+'],
              ['Subtract the three pairs', '−'],
              ['Add back the triple', '+'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"Memory aid: plus, minus, plus, alternating by the number of sets in each intersection."',
  },
  {
    id: 'c3-survey',
    section: C3,
    label: 'A Student Survey',
    element: (
      <ContentSlide kicker={C3} title="A Student Survey" lead="100 students: Maths 45, Physics 40, Chemistry 35" lesson={SESSION}>
        <div className="flex w-full items-center gap-8">
          <Venn sets={['Maths 45', 'Physics 40', 'Chemistry 35']} values={{}} universe="100" />
          <div className="space-y-3">
            <Card>
              <Txt>Pairs: M and P 15, P and C 12, M and C 10</Txt>
              <Txt>All three: 5</Txt>
            </Card>
            <Steps
              items={[
                ['At least one: 45 + 40 + 35 − 15 − 12 − 10 + 5', '88'],
                ['None: 100 − 88', '12'],
              ]}
            />
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"The next slide fills in every region, as a check on the formula."',
  },
  {
    id: 'c3-fill',
    section: C3,
    label: 'Region by Region',
    element: (
      <ContentSlide kicker={C3} title="Region by Region" lead="Work from the centre outwards" lesson={SESSION}>
        <div className="flex w-full items-center gap-8">
          <Venn
            sets={['Maths', 'Physics', 'Chemistry']}
            values={{ abc: 5, ab: 10, bc: 7, ac: 5, a: 25, b: 18, c: 18, out: 12 }}
            order={['abc', 'ab', 'bc', 'ac', 'a', 'b', 'c', 'out']}
            universe="100"
          />
          <div className="space-y-1.5 text-[18px]" style={{ color: colors.ink }}>
            <Txt className="text-[18px]">All three: 5</Txt>
            <Txt className="text-[18px]">M and P only: 15 − 5 = 10</Txt>
            <Txt className="text-[18px]">P and C only: 12 − 5 = 7</Txt>
            <Txt className="text-[18px]">M and C only: 10 − 5 = 5</Txt>
            <Txt className="text-[18px]">Only M: 45 − 10 − 5 − 5 = 25</Txt>
            <Txt className="text-[18px]">Only P: 40 − 10 − 7 − 5 = 18</Txt>
            <Txt className="text-[18px]">Only C: 35 − 7 − 5 − 5 = 18</Txt>
            <Txt className="text-[18px] font-semibold">In the circles: 88 ✓</Txt>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"Learners should practise this centre-outwards method; exam questions often ask for only Maths or exactly two subjects."',
  },
  {
    id: 'c3-357',
    section: C3,
    label: 'Divisible by 3, 5 or 7',
    element: (
      <ContentSlide kicker={C3} title="Divisible by 3, 5 or 7" lead="Multiples in 1 to 1,000; 105 is the smallest number in all three" lesson={SESSION}>
        <div className="w-full space-y-3">
          <DataTable
            className="w-full"
            compact
            stepped
            columns={[{ label: 'Sets', weight: 1 }, { label: 'Divisible by', weight: 1 }, { label: 'Count', weight: 1 }]}
            rows={[
              ['A, B, C', '3, 5, 7', '333, 200, 142'],
              ['A ∩ B, A ∩ C, B ∩ C', '15, 21, 35', '66, 47, 28'],
              ['A ∩ B ∩ C', '105', '9'],
            ]}
          />
          <Steps
            items={[
              ['333 + 200 + 142 − 66 − 47 − 28 + 9', '543'],
              ['Divisible by none of them: 1,000 − 543', '457'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"Check the floor values with learners: 1000 / 7 = 142.8, so 142; 1000 / 105 = 9.5, so 9."',
  },
  {
    id: 'c3-backwards',
    section: C3,
    label: 'Working Backwards',
    element: (
      <ContentSlide kicker={C3} title="Working Backwards" lead="50 people, each speaks at least one of English, Hindi, Telugu. How many speak all three?" lesson={SESSION}>
        <div className="w-full space-y-4">
          <Card className="w-fit">
            <Txt>English 30, Hindi 25, Telugu 20; E and H 12, E and T 10, H and T 8</Txt>
          </Card>
          <div className="flex w-fit items-center gap-3">
            <span className="font-heading text-[26px] font-semibold" style={{ color: colors.ink }}>
              50 = 30 + 25 + 20 − 12 − 10 − 8 +
            </span>
            <span className="grid h-12 w-12 place-items-center rounded-lg border-2 font-heading text-[24px] font-semibold" style={{ borderColor: PINK, color: PINK }}>
              x
            </span>
          </div>
          <Step>
            <Formula>50 = 45 + x, so x = 5</Formula>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"The phrase each speaks at least one tells us |A ∪ B ∪ C| = 50. Ask learners to spot that clue."',
  },
  {
    id: 'c3-practice',
    section: C3,
    label: 'Singles, Pairs, Triple',
    element: (
      <ContentSlide kicker={C3} title="Singles, Pairs, Triple" lead="Draw the three circles, then reveal" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Problem', weight: 2 }, { label: 'Working', weight: 1.5 }, { label: 'Answer', weight: 0.5 }]}
          rows={[
            ['Integers 1–100 divisible by 2, 3 or 5', '50 + 33 + 20 − 16 − 10 − 6 + 3', '74'],
            ['Integers 1–100 divisible by none of 2, 3, 5', '100 − 74', '26'],
            ['|A| = 20, |B| = 15, |C| = 10; each pair 4, all three 2', '45 − 12 + 2', '35'],
            ['Survey: students who like exactly two subjects', '10 + 7 + 5', '22'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"For the first row, the pair lcms are 6, 10 and 15, and the triple lcm is 30."',
  },
  { id: 'quiz-1', section: C3, label: 'Quiz Time', element: <QuizTimeSlide lesson={SESSION} /> },

  /* ── CONCEPT 4 ───────────────────────────────────────────────────────── */
  { id: 'c4-divider', section: C4, label: 'Divider', element: <SectionBreakerSlide index={4} title={C4} lesson={SESSION} /> },
  {
    id: 'c4-general',
    section: C4,
    label: 'The General Principle',
    element: (
      <ContentSlide kicker={C4} title="The General Principle" lead="For finite sets A₁, A₂, …, Aₙ the pattern continues" lesson={SESSION}>
        <div className="w-full space-y-3">
          <span className="inline-block rounded-xl px-5 py-3 font-heading text-[21px] font-semibold" style={{ background: '#F8FAFC', color: colors.ink, boxShadow: `inset 0 0 0 2px ${colors.line}` }}>
            |A₁ ∪ … ∪ Aₙ| = Σ|Aᵢ| − Σ|Aᵢ ∩ Aⱼ| + Σ|Aᵢ ∩ Aⱼ ∩ Aₖ| − … + (−1)ⁿ⁺¹|A₁ ∩ … ∩ Aₙ|
          </span>
          <div className="w-fit space-y-1.5">
            {[
              ['1 set', '+', TONE.ok],
              ['2 sets', '−', TONE.bad],
              ['3 sets', '+', TONE.ok],
              ['4 sets', '−', TONE.bad],
            ].map(([t, s, c]) => (
              <Step key={t}>
                <div className="flex w-[300px] items-center justify-between rounded-lg px-4 py-1.5" style={{ background: `${c}18`, boxShadow: `inset 0 0 0 2px ${c}66` }}>
                  <span className="text-[19px] font-semibold" style={{ color: colors.ink }}>
                    {t}
                  </span>
                  <span className="font-heading text-[26px] font-semibold" style={{ color: c }}>
                    {s}
                  </span>
                </div>
              </Step>
            ))}
          </div>
          <Txt>Sign of a term with k sets: + for odd k, − for even k</Txt>
        </div>
      </ContentSlide>
    ),
    notes: '"We will need this general form only once, for derangements. Do not ask learners to memorise more than the pattern of signs."',
  },
  {
    id: 'c4-forbidden',
    section: C4,
    label: 'Two Forbidden Places',
    element: (
      <ContentSlide kicker={C4} title="Two Forbidden Places" lead="Arrangements of 1, 2, 3, 4, 5 with 1 not first and 2 not second" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="flex w-fit gap-2">
            {['not 1', 'not 2', '', '', ''].map((t, i) => (
              <span key={i} className="grid h-14 w-[86px] place-items-center rounded-lg border-2 border-dashed text-[17px] font-semibold" style={{ borderColor: t ? TONE.bad : colors.brand, color: TONE.bad, background: t ? '#FEE2E2' : '#fff' }}>
                {t}
              </span>
            ))}
          </div>
          <Steps
            items={[
              ['A = 1 in position 1: 4!; B = 2 in position 2: 4!; A ∩ B: 3!', '24, 24, 6'],
              ['Bad: |A ∪ B| = 24 + 24 − 6', '42'],
              ['Good: 5! − 42 = 120 − 42', '78'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"Recognising the bad cases as a union is the key move. Not this and not that is the complement of this or that."',
  },
  {
    id: 'c4-gifts',
    section: C4,
    label: 'No Child Left Empty-Handed',
    element: (
      <ContentSlide kicker={C4} title="No Child Left Empty-Handed" lead="5 different gifts to 3 children, every child at least one" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="flex w-fit gap-4">
            {['Child 1', 'Child 2', 'Child 3'].map((c) => (
              <span key={c} className="flex flex-col items-center">
                <span className="h-14 w-16 rounded-b-xl rounded-t-md" style={{ background: '#FDE68A', boxShadow: 'inset 0 4px 0 #D97706' }} />
                <span className="text-[17px] font-semibold" style={{ color: colors.ink }}>
                  {c}
                </span>
              </span>
            ))}
          </div>
          <Steps
            items={[
              ['All distributions: each gift picks a child', '3⁵ = 243'],
              ['Aᵢ = child i gets nothing: 2⁵; two empty: 1⁵; all three: 0', '32, 1, 0'],
              ['Bad: 3 × 32 − 3 × 1 + 0', '93'],
              ['Good: 243 − 93', '150'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"Compare with identical objects, where giving one each first worked. With different gifts we need inclusion–exclusion."',
  },
  {
    id: 'c4-pins',
    section: C4,
    label: 'At Least One of Each',
    element: (
      <ContentSlide kicker={C4} title="At Least One of Each" lead="4-digit PINs (repeats allowed) containing at least one 0 and at least one 1" lesson={SESSION}>
        <div className="flex w-full items-start gap-8">
          <div className="grid w-fit grid-cols-3 gap-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', ''].map((d, i) => (
              <span key={i} className="grid h-12 w-12 place-items-center rounded-lg font-heading text-[20px] font-semibold" style={{ background: d === '0' || d === '1' ? PINK : d ? '#F1F5F9' : 'transparent', color: d === '0' || d === '1' ? '#fff' : colors.ink }}>
                {d}
              </span>
            ))}
          </div>
          <Steps
            items={[
              ['Total', '10⁴ = 10,000'],
              ['A = no 0: 9⁴; B = no 1: 9⁴; neither digit: 8⁴', '6,561, 6,561, 4,096'],
              ['Missing 0 or 1: 6,561 + 6,561 − 4,096', '9,026'],
              ['Contains both: 10,000 − 9,026', '974'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"Exam hook: at least one of each usually means total minus the union of missing one of them."',
  },
  {
    id: 'c4-practice',
    section: C4,
    label: 'Name the Sets First',
    element: (
      <ContentSlide kicker={C4} title="Name the Sets First" lead="Write A = …, B = … for each row, then reveal" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Problem', weight: 2.2 }, { label: 'Working', weight: 1.4 }, { label: 'Answer', weight: 0.5 }]}
          rows={[
            ['Arrangements of A, B, C, D: A not first, B not last', '24 − (6 + 6 − 2)', '14'],
            ['4 different gifts to 2 children, each at least one', '2⁴ − 2 × 1⁴', '14'],
            ['4 different gifts to 3 children, each at least one', '3⁴ − 3 × 2⁴ + 3 × 1⁴', '36'],
            ['3-digit strings with at least one 7 and at least one 8', '1000 − (729 + 729 − 512)', '54'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"Naming the sets in words is half the solution. Insist on it before any numbers are written."',
  },

  /* ── CONCEPT 5 ───────────────────────────────────────────────────────── */
  { id: 'c5-divider', section: C5, label: 'Divider', element: <SectionBreakerSlide index={5} title={C5} lesson={SESSION} /> },
  {
    id: 'c5-envelopes',
    section: C5,
    label: 'Every Letter in the Wrong Envelope',
    element: (
      <ContentSlide kicker={C5} title="Every Letter in the Wrong Envelope" lead="Think First: 3 letters, 3 matching envelopes, filled at random" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="flex w-fit items-center gap-6">
            <div className="space-y-2">
              {['Letter 1', 'Letter 2', 'Letter 3'].map((l) => (
                <span key={l} className="block rounded-md px-3 py-1.5 text-[18px] font-semibold text-white" style={{ background: BLUE }}>
                  {l}
                </span>
              ))}
            </div>
            <div className="space-y-2 text-[24px]" style={{ color: PINK }}>
              <span className="block">↘ to 2</span>
              <span className="block">↘ to 3</span>
              <span className="block">↖ to 1</span>
            </div>
            <div className="space-y-2">
              {['Envelope 1', 'Envelope 2', 'Envelope 3'].map((l) => (
                <span key={l} className="block rounded-md border-2 px-3 py-1 text-[18px] font-semibold" style={{ borderColor: colors.ink, color: colors.ink }}>
                  {l}
                </span>
              ))}
            </div>
          </div>
          <Step>
            <Callout kind="info" title="A derangement: no object in its own position" asStep={false}>
              Dₙ is the number of derangements of n objects
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Other versions of the story: hats returned at random after a party, or a Secret Santa where nobody draws their own name."',
  },
  {
    id: 'c5-list',
    section: C5,
    label: 'Derangements for n = 1, 2, 3',
    element: (
      <ContentSlide kicker={C5} title="Derangements for n = 1, 2, 3" lead="Counting by hand" lesson={SESSION}>
        <div className="w-full space-y-3">
          <div className="flex w-fit items-center gap-3">
            <Label>n = 3</Label>
            {['123', '132', '213', '231', '312', '321'].map((p) => {
              const der = p === '231' || p === '312'
              return (
                <span key={p} className="flex gap-0.5 rounded-lg px-2 py-1.5" style={{ background: der ? `${TONE.ok}22` : '#F8FAFC', boxShadow: der ? `inset 0 0 0 2px ${TONE.ok}` : undefined }}>
                  {p.split('').map((d, i) => (
                    <span key={i} className="grid h-8 w-7 place-items-center rounded-full font-heading text-[19px] font-semibold" style={{ color: Number(d) === i + 1 ? TONE.bad : colors.ink, boxShadow: Number(d) === i + 1 ? `inset 0 0 0 2px ${TONE.bad}` : undefined }}>
                      {d}
                    </span>
                  ))}
                </span>
              )
            })}
          </div>
          <RevealTable
            columns={[{ label: 'n', weight: 0.3 }, { label: 'Derangements', weight: 1.2 }, { label: 'Dₙ', weight: 0.4 }]}
            rows={[
              ['1', 'none', '0'],
              ['2', '21', '1'],
              ['3', '231, 312', '2'],
              ['4', 'listing gives 9 of the 24', '9'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"Ask learners in pairs to list the 9 derangements of 1234. It takes a few minutes and builds trust in the formula." Red circles mark objects in their own place.',
  },
  {
    id: 'c5-derive',
    section: C5,
    label: 'Inclusion–Exclusion on Fixed Points',
    element: (
      <ContentSlide kicker={C5} title="Inclusion–Exclusion on Fixed Points" lead="Aᵢ = arrangements where object i stays in position i" lesson={SESSION}>
        <div className="w-full space-y-3">
          <div className="flex w-fit gap-1.5">
            {Array.from({ length: 7 }, (_, i) => (
              <span key={i} className="grid h-12 w-12 place-items-center rounded-lg font-heading text-[18px] font-semibold" style={{ background: i < 3 ? '#FEF3C7' : `${BLUE}14`, color: colors.ink, boxShadow: i < 3 ? 'inset 0 0 0 2px #D97706' : undefined }}>
                {i < 3 ? i + 1 : '?'}
              </span>
            ))}
            <span className="ml-3 self-center text-[18px] font-semibold" style={{ color: colors.ink }}>
              k fixed, the other n − k shuffled: (n − k)! ways
            </span>
          </div>
          <Steps
            items={[
              ['Choose the k fixed objects', 'C(n, k)'],
              ['C(n, k)(n − k)!', 'n! / k!'],
              ['Alternate the signs', 'Dₙ = n! − n!/1! + n!/2! − … + (−1)ⁿ n!/n!'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"Keep the derivation at this level: inclusion–exclusion applied to object i is fixed. The details are on The General Principle slide."',
  },
  {
    id: 'c5-formula',
    section: C5,
    label: 'The Derangement Formula',
    element: (
      <ContentSlide kicker={C5} title="The Derangement Formula" lead="Dₙ = n! [1 − 1/1! + 1/2! − 1/3! + … + (−1)ⁿ/n!]" lesson={SESSION}>
        <div className="flex w-full items-end gap-8">
          <div className="flex w-fit items-end gap-4">
            {[
              [1, 0, 1],
              [2, 1, 2],
              [3, 2, 6],
              [4, 9, 24],
              [5, 44, 120],
              [6, 265, 720],
            ].map(([n, d, fact]) => (
              <Step key={n} className="flex flex-col items-center gap-1">
                <span className="text-[16px] font-semibold" style={{ color: PINK }}>
                  {d}
                </span>
                <span className="flex items-end gap-1">
                  <span className="w-5 rounded-t" style={{ height: Math.max(4, (d / 720) * 220), background: PINK }} />
                  <span className="w-5 rounded-t" style={{ height: Math.max(4, (fact / 720) * 220), background: `${BLUE}88` }} />
                </span>
                <span className="text-[16px] font-semibold" style={{ color: colors.ink }}>
                  n = {n}
                </span>
                <span className="text-[16px]" style={{ color: TONE.grey }}>
                  {fact}
                </span>
              </Step>
            ))}
          </div>
          <div className="space-y-2">
            <Txt>
              <span style={{ color: PINK }}>Pink: Dₙ</span>, <span style={{ color: BLUE }}>blue: n!</span>
            </Txt>
            <Card tone="ok">
              <Label tone="ok">Check D₄</Label>
              <Txt>24 (1 − 1 + 1/2 − 1/6 + 1/24) = 12 − 4 + 1 = 9 ✓</Txt>
            </Card>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"Ask learners to compute D₅ from the formula: 120 (1/2 − 1/6 + 1/24 − 1/120) = 60 − 20 + 5 − 1 = 44."',
  },
  {
    id: 'c5-constant',
    section: C5,
    label: 'A Surprising Constant',
    element: (
      <ContentSlide kicker={C5} title="A Surprising Constant" lead="The fraction Dₙ / n! settles near 1/e ≈ 0.3679" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="relative w-fit" style={{ height: 190 }}>
            <span className="absolute left-0 right-0 border-t-2 border-dashed" style={{ top: 190 - 0.3679 * 380, borderColor: TONE.ok }} />
            <div className="flex h-full items-end gap-6 px-2">
              {[
                [3, 0.3333],
                [4, 0.375],
                [5, 0.3667],
                [6, 0.3681],
                [7, 0.3679],
              ].map(([n, v]) => (
                <Step key={n} className="flex flex-col items-center gap-1">
                  <span className="text-[17px] font-semibold" style={{ color: colors.ink }}>
                    {v.toFixed(4)}
                  </span>
                  <span className="w-14 rounded-t" style={{ height: v * 380 - 30, background: `${PINK}aa` }} />
                  <span className="text-[16px] font-semibold" style={{ color: colors.brandDark }}>
                    n = {n}
                  </span>
                </Step>
              ))}
            </div>
          </div>
          <Step>
            <Callout kind="success" title="About 37 percent" asStep={false}>
              For any largish group, a random shuffle leaves nobody in their own place about 37% of the time
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"This is a nice surprise: the chance hardly depends on the number of people once n is 5 or more. Mention e only as a known constant; no calculus is needed." The dashed line is 1/e.',
  },
  {
    id: 'c5-practice',
    section: C5,
    label: 'Use the Table or the Formula',
    element: (
      <ContentSlide kicker={C5} title="Use the Table or the Formula" lead="Decide, then reveal" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Problem', weight: 2.2 }, { label: 'Working', weight: 1.2 }, { label: 'Answer', weight: 0.5 }]}
          rows={[
            ['5 letters, all in wrong envelopes', 'D₅', '44'],
            ['6 guests take random hats; nobody gets their own', 'D₆', '265'],
            ['4 students swap test papers; nobody marks their own', 'D₄', '9'],
            ['5 letters, exactly 1 in the correct envelope', 'C(5, 1) × D₄ = 5 × 9', '45'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"For the last row: choose the one correct letter (5 ways), then the other 4 must all be wrong: D₄ = 9."',
  },

  /* ── CONCEPT 6 ───────────────────────────────────────────────────────── */
  { id: 'c6-divider', section: C6, label: 'Divider', element: <SectionBreakerSlide index={6} title={C6} lesson={SESSION} /> },
  {
    id: 'c6-guide',
    section: C6,
    label: 'A Decision Guide',
    element: (
      <ContentSlide kicker={C6} title="A Decision Guide" lead="Read the question, pick the form" lesson={SESSION}>
        <div className="grid w-full grid-cols-2 gap-3">
          {[
            ['In A or B (at least one)', '|A| + |B| − |A ∩ B|'],
            ['In neither A nor B', '|U| − |A ∪ B|'],
            ['In A, B or C', 'Singles − pairs + triple'],
            ['Only A, exactly two, …', 'Fill the Venn diagram centre outwards'],
            ['"Not this and not that"', 'Total − |union of the bad cases|'],
            ['Nothing in its own place', 'Dₙ'],
          ].map(([q, f]) => (
            <Step key={q}>
              <div className="flex items-center gap-3 rounded-card border border-line bg-white px-4 py-2.5 shadow-card-soft">
                <span className="text-[18px] font-semibold" style={{ color: colors.ink }}>
                  {q}
                </span>
                <span className="font-heading text-[24px] font-semibold" style={{ color: colors.brandDark }}>
                  ⟶
                </span>
                <span className="text-[18px] font-semibold" style={{ color: TONE.ok }}>
                  {f}
                </span>
              </div>
            </Step>
          ))}
        </div>
      </ContentSlide>
    ),
    notes: '"Ask learners to classify a few past-paper questions with this guide before solving."',
  },
  {
    id: 'c6-mistakes',
    section: C6,
    label: 'Avoid These Errors',
    element: (
      <ContentSlide kicker={C6} title="Avoid These Errors" lead="Red: the wrong working. Green: the fix" lesson={SESSION}>
        <div className="w-full space-y-2">
          {[
            ['Forgetting the overlap', '2 or 3 in 1–100: 50 + 33 = 83', '50 + 33 − 16 = 67'],
            ['Multiplying instead of the lcm', 'By 4 and 6 taken as by 24', 'By lcm(4, 6) = 12'],
            ['Forgetting to add back the triple', 'Survey: 45 + 40 + 35 − 15 − 12 − 10 = 83', '+ 5 gives 88'],
            ['"At least one" when "neither" is asked', 'Sports: 33', 'Neither: 40 − 33 = 7'],
            ['Derangements taken as all arrangements', '4 wrong envelopes: 4! = 24', 'D₄ = 9'],
          ].map(([m, w, f]) => (
            <Step key={m}>
              <div className="grid grid-cols-[1fr_1.3fr_0.9fr] items-center gap-3 rounded-card border border-line bg-white px-4 py-2 shadow-card-soft">
                <span className="font-heading text-[18px] font-semibold" style={{ color: colors.ink }}>
                  {m}
                </span>
                <span className="text-[18px] line-through" style={{ color: TONE.bad, textDecorationThickness: 2 }}>
                  {w}
                </span>
                <span className="text-[18px] font-semibold" style={{ color: TONE.ok }}>
                  {f}
                </span>
              </div>
            </Step>
          ))}
        </div>
      </ContentSlide>
    ),
    notes: '"The lcm mistake is very common: for 2 and 3 the product works only because they share no factor."',
  },
  {
    id: 'c6-mixed',
    section: C6,
    label: 'Plan, Then Solve',
    element: (
      <ContentSlide kicker={C6} title="Plan, Then Solve" lead="Solve in pairs, then compare" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Problem', weight: 1.6 }, { label: 'Answer', weight: 1.6 }]}
          rows={[
            ['Integers 1–60 divisible by 3 or 4', '20 + 15 − 5 = 30'],
            ['Integers 1–60 divisible by none of 2, 3, 5', '60 − (30 + 20 + 12 − 10 − 6 − 4 + 2) = 16'],
            ['30 students: 18 tea, 15 coffee, 8 both; like only one', '(18 − 8) + (15 − 8) = 17'],
            ['3 different gifts to 3 children, each one or more', '27 − 3 × 8 + 3 × 1 = 6'],
            ['5 people, random seating, nobody in their own seat', 'D₅ = 44'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"The gift row with 3 gifts and 3 children gives 6 = 3!: each child must get exactly one gift. Ask learners why."',
  },
  {
    id: 'c6-computing',
    section: C6,
    label: 'Where Programmers Meet It',
    element: (
      <ContentSlide kicker={C6} title="Where Programmers Meet It" lead="Filters, tests and shuffles" lesson={SESSION}>
        <div className="grid w-full grid-cols-2 gap-3">
          {[
            ['Database filter', 'Records matching filter A or filter B', '|A| + |B| − |A ∩ B|', '500 + 300 − 120 = 680'],
            ['Number sieve', 'Up to 100 with no factor 2, 3 or 5', 'Complement of a union', '26'],
            ['Bug report', 'Inputs that trigger at least one of three bugs', 'Three-set formula', 'Singles − pairs + triple'],
            ['Shuffled playlist', 'Checking a shuffle algorithm', 'Derangements', '≈ 37% move every item'],
          ].map(([icon, s, idea, ex]) => (
            <Step key={icon}>
              <div className="rounded-2xl border border-line bg-white px-4 py-3 shadow-card-soft">
                <span className="inline-block rounded-md px-2 py-0.5 font-mono text-[16px] font-semibold text-white" style={{ background: colors.ink }}>
                  {icon}
                </span>
                <Txt className="mt-1">{s}</Txt>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-[17px]" style={{ color: TONE.grey }}>
                    {idea}
                  </span>
                  <span className="font-heading text-[19px] font-semibold" style={{ color: TONE.ok }}>
                    {ex}
                  </span>
                </div>
              </div>
            </Step>
          ))}
        </div>
      </ContentSlide>
    ),
    notes: '"Database query planners estimate the size of A OR B results with exactly this formula."',
  },

  /* ── CLOSING ────────────────────────────────────────────────────────── */
  { id: 'quiz-2', section: 'Closing', label: 'Quiz Time', element: <QuizTimeSlide lesson={SESSION} /> },
  { id: 'takeaways', section: 'Closing', label: 'Key Takeaways', element: <KeyTakeawaysSlide title={SESSION} lesson={SESSION} points={AGENDA} /> },
  { id: 'feedback', section: 'Closing', label: 'Feedback', element: <FeedbackSlide lesson={SESSION} formless />, notes: 'No form and no QR (content rule 41 as amended 2026-11-21). Ask for feedback out loud.' },
  { id: 'thank-you', section: 'Closing', label: 'Thank you', element: <ThankYouSlide title="Thank You" lesson={SESSION} /> },
  { id: 'all-the-best', section: 'Closing', label: 'All the best', element: <ThankYouSlide title="All the Best" lesson={SESSION} /> },
]
