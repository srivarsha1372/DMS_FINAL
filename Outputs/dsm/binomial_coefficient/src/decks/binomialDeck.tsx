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
 * BINOMIAL COEFFICIENT (DSM, Elementary Combinatorics).
 *
 * Built from the signed-off plan at
 *   Outputs/dsm/session_plans/binomial_coefficient/plan.md
 * (44 slides, one per TR slide). Every value and identity was recomputed by
 * `verify_tr.py`. No cross-session phrases (user rule, 2026-11-26).
 * Visuals are DOM figures, never SVG text; Pascal's Triangle places each entry
 * absolutely inside one fixed box.
 */

const SESSION = 'Binomial Coefficient'
const C1 = 'The Binomial Coefficient'
const C2 = "Pascal's Triangle"
const C3 = 'The Symmetry Property'
const C4 = "Pascal's Identity"
const C5 = "Patterns in Pascal's Triangle"
const C6 = 'Putting It All Together'
const AGENDA = [C1, C2, C3, C4, C5, C6]

export const binomialMeta: DeckMeta = {
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
const PINK = '#DB2777'
const ORANGE = '#D97706'
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

function Op({ children }: { children: ReactNode }) {
  return (
    <span className="font-heading text-[28px] font-semibold" style={{ color: colors.brandDark }}>
      {children}
    </span>
  )
}

function Steps({ items }: { items: [ReactNode, ReactNode?][] }) {
  return (
    <div className="w-fit min-w-[560px] space-y-2">
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

function Total({ children, label = 'Total' }: { children: ReactNode; label?: string }) {
  return (
    <span className="inline-flex items-center gap-3 rounded-xl px-5 py-2" style={{ background: `${TONE.ok}18`, boxShadow: `inset 0 0 0 2px ${TONE.ok}66` }}>
      {label && (
        <span className="text-[17px] font-semibold uppercase tracking-wide" style={{ color: TONE.ok }}>
          {label}
        </span>
      )}
      <span className="font-heading text-[26px] font-semibold" style={{ color: colors.ink }}>
        {children}
      </span>
    </span>
  )
}

const binom = (n: number, r: number): number => {
  let v = 1
  for (let i = 1; i <= r; i++) v = (v * (n - r + i)) / i
  return Math.round(v)
}

/**
 * PASCAL'S TRIANGLE. One fixed box; every entry absolutely placed, so the
 * alignment harness sees one figure, and entries never reflow.
 */
interface TriProps {
  from?: number
  to: number
  dx?: number
  dy?: number
  d?: number
  hi?: Record<string, string>
  blanks?: string[]
  build?: boolean
  rowLabels?: boolean
  sums?: boolean
  mirror?: boolean
  revealBlanks?: boolean
}
function Triangle({ from = 0, to, dx = 54, dy = 46, d = 42, hi = {}, blanks = [], build = false, rowLabels = false, sums = false, mirror = false, revealBlanks = false }: TriProps) {
  const rows = to - from + 1
  const k = useBuild(build ? rows : revealBlanks ? blanks.length : 0)
  const labelW = rowLabels ? 70 : 0
  const width = labelW + (to + 1) * dx + (sums ? 90 : 0)
  const height = rows * dy
  const cx = labelW + ((to + 1) * dx) / 2
  return (
    <div className="relative" style={{ width, height }}>
      {mirror && <span className="absolute border-l-4 border-dashed" style={{ left: cx - 2, top: -6, height: height + 6, borderColor: `${PINK}99` }} />}
      {Array.from({ length: rows }, (_, i) => {
        const n = from + i
        const shown = !build || i < k
        return (
          <span key={n} style={{ opacity: shown ? 1 : 0, transition: 'opacity .4s' }}>
            {rowLabels && (
              <span className="absolute text-[17px] font-semibold" style={{ left: 0, top: i * dy + (d - 22) / 2, color: colors.brandDark }}>
                n = {n}
              </span>
            )}
            {Array.from({ length: n + 1 }, (_, r) => {
              const key = `${n},${r}`
              const c = hi[key]
              const bi = blanks.indexOf(key)
              const blank = bi >= 0 && !(revealBlanks && bi < k)
              const x = cx + (r - n / 2) * dx - d / 2
              return (
                <span
                  key={r}
                  className="absolute grid place-items-center rounded-full font-heading font-semibold"
                  style={{
                    left: x,
                    top: i * dy,
                    width: d,
                    height: d,
                    fontSize: binom(n, r) > 99 ? 16 : 18,
                    background: blank ? '#fff' : c ?? `${colors.brand}18`,
                    color: c ? '#fff' : colors.ink,
                    boxShadow: blank ? `inset 0 0 0 2px ${ORANGE}` : c ? undefined : `inset 0 0 0 1.5px ${colors.brand}44`,
                  }}
                >
                  {blank ? '' : binom(n, r)}
                </span>
              )
            })}
            {sums && (
              <span className="absolute text-[17px] font-semibold" style={{ left: cx + ((to + 1) * dx) / 2 + 10, top: i * dy + (d - 22) / 2, color: TONE.ok }}>
                = {2 ** n}
              </span>
            )}
          </span>
        )
      })}
    </div>
  )
}

/** A stacked "n over r" in brackets. */
function Choose({ n, r }: { n: string; r: string }) {
  return (
    <span className="inline-flex items-center font-heading text-[26px] font-semibold" style={{ color: colors.ink }}>
      <span className="text-[44px] font-normal leading-none">(</span>
      <span className="flex flex-col items-center leading-tight">
        <span>{n}</span>
        <span>{r}</span>
      </span>
      <span className="text-[44px] font-normal leading-none">)</span>
    </span>
  )
}

/* ── the deck ───────────────────────────────────────────────────────────── */

export const binomialDeck: SlideDef[] = [
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
          { title: C1, sub: 'Definition, notation and subsets' },
          { title: C2, sub: 'How it is built and read' },
          { title: C3, sub: 'C(n, r) = C(n, n − r), two proofs' },
          { title: C4, sub: 'C(n, r) = C(n − 1, r − 1) + C(n − 1, r)' },
          { title: C5, sub: 'Row sums and diagonals' },
          { title: C6, sub: 'Verifications, mistakes and computing' },
        ]}
      />
    ),
  },

  /* ── CONCEPT 1 ───────────────────────────────────────────────────────── */
  { id: 'c1-divider', section: C1, label: 'Divider', element: <SectionBreakerSlide index={1} title={C1} lesson={SESSION} /> },
  {
    id: 'c1-toppings',
    section: C1,
    label: 'Choosing Toppings',
    element: (
      <ContentSlide kicker={C1} title="Choosing Toppings" lead="Think First: 4 toppings, choose 2 different ones. How many ways?" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="flex w-fit gap-2">
            {[
              ['Onion', '#A855F7'],
              ['Paneer', '#F59E0B'],
              ['Corn', '#EAB308'],
              ['Mushroom', '#78716C'],
            ].map(([t, c]) => (
              <span key={t} className="rounded-pill px-4 py-2 text-[19px] font-semibold text-white" style={{ background: c }}>
                {t}
              </span>
            ))}
          </div>
          <div className="grid w-fit grid-cols-6 gap-2">
            {['O + P', 'O + C', 'O + M', 'P + C', 'P + M', 'C + M'].map((p) => (
              <Step key={p}>
                <span className="grid h-16 w-24 place-items-center rounded-b-full rounded-t-md text-[17px] font-semibold" style={{ background: '#FDE68A', color: colors.ink, boxShadow: 'inset 0 4px 0 #D97706' }}>
                  {p}
                </span>
              </Step>
            ))}
          </div>
          <Step>
            <Callout kind="info" title="4C2 = 6: order does not matter, no repetition" asStep={false}>
              Today this number has a name of its own: the binomial coefficient
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Learners already know how to compute nCr. Today\'s focus is on its patterns and identities, which make many calculations faster."',
  },
  {
    id: 'c1-definition',
    section: C1,
    label: 'The Binomial Coefficient',
    element: (
      <ContentSlide kicker={C1} title="The Binomial Coefficient" lead="For 0 ≤ r ≤ n: ways to choose r of n distinct objects, order ignored" lesson={SESSION}>
        <div className="w-full space-y-4">
          <span className="inline-block rounded-xl px-6 py-3 font-heading text-[32px] font-semibold" style={{ background: `${TONE.ok}18`, color: colors.ink, boxShadow: `inset 0 0 0 2px ${TONE.ok}` }}>
            C(n, r) = n! / (r! (n − r)!)
          </span>
          <div className="grid w-fit grid-cols-3 gap-4">
            {[
              [<Big className="text-[28px]">C(n, r)</Big>, '"C of n, r"'],
              [<Big className="text-[28px]">nCr, ⁿCᵣ</Big>, '"n C r"'],
              [<Choose n="n" r="r" />, '"n choose r"'],
            ].map(([sym, read], i) => (
              <Step key={i}>
                <div className="flex h-full w-[220px] flex-col items-start justify-between rounded-card border border-line bg-white px-4 py-3 shadow-card-soft">
                  {sym}
                  <Txt className="mt-1">{read as string}</Txt>
                </div>
              </Step>
            ))}
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"Tremblay and Grimaldi use C(n, r); Koshy also uses the stacked bracket form. All mean the same number. We will mostly write C(n, r)."',
  },
  {
    id: 'c1-subsets',
    section: C1,
    label: 'Counting Subsets',
    element: (
      <ContentSlide kicker={C1} title="Counting Subsets" lead="C(n, r) counts the r-element subsets of an n-element set: S = {a, b, c, d}" lesson={SESSION}>
        <div className="flex w-fit items-end gap-3">
          {[
            ['∅'],
            ['{a}', '{b}', '{c}', '{d}'],
            ['{a,b}', '{a,c}', '{a,d}', '{b,c}', '{b,d}', '{c,d}'],
            ['{a,b,c}', '{a,b,d}', '{a,c,d}', '{b,c,d}'],
            ['{a,b,c,d}'],
          ].map((col, r) => (
            <Step key={r} className="flex flex-col items-center gap-1">
              {col.map((s) => (
                <span key={s} className="w-[110px] rounded-md px-1 py-0.5 text-center text-[16px] font-semibold" style={{ background: `${colors.brand}14`, color: colors.ink }}>
                  {s}
                </span>
              ))}
              <span className="mt-1 font-heading text-[19px] font-semibold" style={{ color: colors.brandDark }}>
                r = {r}: {col.length}
              </span>
            </Step>
          ))}
        </div>
      </ContentSlide>
    ),
    notes: '"Ask learners to notice two patterns in the counts: they read the same forwards and backwards, and the total is 16. Both are explained later."',
  },
  {
    id: 'c1-special',
    section: C1,
    label: 'Values to Know by Heart',
    element: (
      <ContentSlide kicker={C1} title="Values to Know by Heart" lead="The edges of the triangle" lesson={SESSION}>
        <div className="grid w-full grid-cols-2 gap-3">
          {[
            ['C(n, 0) = 1', 'One way to choose nothing: the empty set', 'empty basket'],
            ['C(n, n) = 1', 'One way to choose everything', 'full basket'],
            ['C(n, 1) = n', 'Choose any one of the n objects', 'one item'],
            ['C(n, 2) = n(n − 1) / 2', 'Number of pairs, as in handshakes', 'handshake'],
          ].map(([v, why, pic]) => (
            <Step key={v}>
              <Card className="h-full">
                <span className="inline-block rounded-md px-2 py-0.5 text-[16px] font-semibold" style={{ background: '#F1F5F9', color: TONE.grey }}>
                  {pic}
                </span>
                <Big className="mt-1 text-[24px]">{v}</Big>
                <Txt>{why}</Txt>
              </Card>
            </Step>
          ))}
        </div>
      </ContentSlide>
    ),
    notes: '"These values form the edges and the first inner lines of Pascal\'s Triangle, which we build next."',
  },
  {
    id: 'c1-practice',
    section: C1,
    label: 'Cancel, Then Multiply',
    element: (
      <ContentSlide kicker={C1} title="Cancel, Then Multiply" lead="Evaluate, then reveal one row at a time" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Expression', weight: 0.8 }, { label: 'Working', weight: 1.5 }, { label: 'Value', weight: 0.6 }]}
          rows={[
            ['C(6, 2)', '(6 × 5) / 2', '15'],
            ['C(7, 3)', '(7 × 6 × 5) / 6', '35'],
            ['C(8, 4)', '(8 × 7 × 6 × 5) / 24', '70'],
            ['C(9, 1)', 'Special value', '9'],
            ['C(10, 0)', 'Special value', '1'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"Keep these values on the board: C(7, 3) = 35 and C(8, 4) = 70 appear again in Pascal\'s Triangle."',
  },

  /* ── CONCEPT 2 ───────────────────────────────────────────────────────── */
  { id: 'c2-divider', section: C2, label: 'Divider', element: <SectionBreakerSlide index={2} title={C2} lesson={SESSION} /> },
  {
    id: 'c2-build',
    section: C2,
    label: 'One Simple Rule',
    element: (
      <ContentSlide kicker={C2} title="One Simple Rule" lead="Every inside number is the sum of the two numbers just above it" lesson={SESSION}>
        <div className="grid w-full grid-cols-[auto_1fr] items-start gap-8">
          <Triangle to={5} build hi={{ '3,1': ORANGE, '3,2': ORANGE, '4,2': TONE.ok }} />
          <div className="space-y-3">
            <Card>
              <Txt>Row 0 is a single 1</Txt>
              <Txt>Every row starts and ends with 1</Txt>
            </Card>
            <Card tone="ok">
              <Label tone="ok">Row 4</Label>
              <Big>1, (1 + 3), (3 + 3), (3 + 1), 1</Big>
              <Big>= 1, 4, 6, 4, 1</Big>
            </Card>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"Ask learners to build row 5 themselves before revealing it. Most learners pick up the rule from a single example." The orange 3s add to the green 6.',
  },
  {
    id: 'c2-rows',
    section: C2,
    label: 'The First Eight Rows',
    element: (
      <ContentSlide kicker={C2} title="The First Eight Rows" lead="Row n has n + 1 entries" lesson={SESSION}>
        <Triangle to={7} rowLabels dy={44} d={40} dx={52} />
      </ContentSlide>
    ),
    notes: '"Point out that row n has n + 1 entries. Learners often expect n entries."',
  },
  {
    id: 'c2-read',
    section: C2,
    label: 'Every Entry Is a C(n, r)',
    element: (
      <ContentSlide kicker={C2} title="Every Entry Is a C(n, r)" lead="Rows from 0 at the top, positions from 0 on the left" lesson={SESSION}>
        <div className="grid w-full grid-cols-[auto_1fr] items-start gap-8">
          <Triangle to={7} rowLabels dy={44} d={40} dx={50} hi={{ '6,2': PINK, '7,3': ORANGE }} />
          <div className="space-y-3">
            <Step>
              <Card>
                <span className="font-heading text-[20px] font-semibold" style={{ color: PINK }}>
                  Row 6, position 2: 15
                </span>
                <Txt>C(6, 2) = 15 ✓</Txt>
              </Card>
            </Step>
            <Step>
              <Card>
                <span className="font-heading text-[20px] font-semibold" style={{ color: ORANGE }}>
                  Row 7, position 3: 35
                </span>
                <Txt>C(7, 3) = 35 ✓</Txt>
              </Card>
            </Step>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"Common slip: counting rows or positions from 1 instead of 0. Make learners locate C(5, 2) = 10 themselves."',
  },
  {
    id: 'c2-why',
    section: C2,
    label: 'The Rule Behind the Triangle',
    element: (
      <ContentSlide kicker={C2} title="The Rule Behind the Triangle" lead="Entry = left parent + right parent" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="flex w-fit items-center gap-10">
            {[
              ['C(n − 1, r − 1)', 'C(n − 1, r)', 'C(n, r)'],
              ['4', '6', '10'],
            ].map(([a, b, c], i) => (
              <Step key={i}>
                <div className="relative" style={{ width: 300, height: 130 }}>
                  {[
                    [a, 0, 0],
                    [b, 160, 0],
                    [c, 80, 80],
                  ].map(([t, x, y]) => (
                    <span key={t as string} className="absolute grid h-12 w-[140px] place-items-center rounded-full font-heading text-[19px] font-semibold" style={{ left: x as number, top: y as number, background: y ? TONE.ok : `${colors.brand}18`, color: y ? '#fff' : colors.ink }}>
                      {t as string}
                    </span>
                  ))}
                </div>
              </Step>
            ))}
          </div>
          <Step>
            <Callout kind="success" title="Pascal's identity: C(n, r) = C(n − 1, r − 1) + C(n − 1, r)" asStep={false}>
              C(5, 2) = C(4, 1) + C(4, 2) = 4 + 6 = 10. Proved in the Pascal's Identity section
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Keep this brief: state the identity here and prove it later, after the symmetry property."',
  },
  {
    id: 'c2-practice',
    section: C2,
    label: 'Fill In the Missing Entries',
    element: (
      <ContentSlide kicker={C2} title="Fill In the Missing Entries" lead="Each blank is the sum of the two entries above it" lesson={SESSION}>
        <Triangle from={5} to={9} dx={56} dy={50} d={44} revealBlanks blanks={['6,3', '7,2', '7,5', '8,3', '8,5', '9,2', '9,7']} />
      </ContentSlide>
    ),
    notes: '"Ask learners what they notice about the blanks in each row: they come in equal pairs. That is the symmetry property, our next section." Answers: 20; 21, 21; 56, 56; 36, 36.',
  },

  /* ── CONCEPT 3 ───────────────────────────────────────────────────────── */
  { id: 'c3-divider', section: C3, label: 'Divider', element: <SectionBreakerSlide index={3} title={C3} lesson={SESSION} /> },
  {
    id: 'c3-mirror',
    section: C3,
    label: 'A Mirror in Every Row',
    element: (
      <ContentSlide kicker={C3} title="A Mirror in Every Row" lead="Entries at equal distances from the two ends are equal" lesson={SESSION}>
        <div className="grid w-full grid-cols-[auto_1fr] items-center gap-8">
          <Triangle to={6} mirror hi={{ '4,1': ORANGE, '4,3': ORANGE, '6,2': PINK, '6,4': PINK, '5,2': PURPLE, '5,3': PURPLE }} />
          <div className="space-y-2">
            {['Row 4: 1, 4, 6, 4, 1', 'Row 5: 1, 5, 10, 10, 5, 1', 'Row 6: 1, 6, 15, 20, 15, 6, 1'].map((t) => (
              <Step key={t}>
                <Card>
                  <Txt className="font-semibold">{t}</Txt>
                  <Txt className="text-[17px]">reads the same both ways</Txt>
                </Card>
              </Step>
            ))}
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"Let learners state the pattern in their own words before the formal statement on the next slide."',
  },
  {
    id: 'c3-statement',
    section: C3,
    label: 'Choosing r Is Choosing n − r',
    element: (
      <ContentSlide kicker={C3} title="Choosing r Is Choosing n − r" lead="For integers 0 ≤ r ≤ n" lesson={SESSION}>
        <div className="w-full space-y-4">
          <span className="inline-block rounded-xl px-6 py-3 font-heading text-[34px] font-semibold" style={{ background: `${TONE.ok}18`, color: colors.ink, boxShadow: `inset 0 0 0 2px ${TONE.ok}` }}>
            C(n, r) = C(n, n − r)
          </span>
          <div className="flex w-fit items-center gap-2">
            {[1, 7, 21, 35, 35, 21, 7, 1].map((v, i) => (
              <span key={i} className="grid h-12 w-14 place-items-center rounded-full font-heading text-[19px] font-semibold" style={{ background: i === 3 || i === 4 ? PINK : `${colors.brand}18`, color: i === 3 || i === 4 ? '#fff' : colors.ink }}>
                {v}
              </span>
            ))}
            <span className="ml-3 text-[18px] font-semibold" style={{ color: PINK }}>
              3 from the left = 3 from the right
            </span>
          </div>
          <Step>
            <Txt>C(6, 2) = C(6, 4) = 15;  C(7, 3) = C(7, 4) = 35;  C(10, 8) = C(10, 2) = 45</Txt>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Ask: what is C(n, n)? By symmetry it equals C(n, 0) = 1, matching the special values."',
  },
  {
    id: 'c3-algebra',
    section: C3,
    label: 'Swap the Two Factorials',
    element: (
      <ContentSlide kicker={C3} title="Swap the Two Factorials" lead="Algebraic proof" lesson={SESSION}>
        <div className="w-full space-y-2">
          {[
            <>
              C(n, n − r) = n! / (<span style={{ color: PINK }}>(n − r)!</span> × (n − (n − r))!)
            </>,
            <>
              Since n − (n − r) = r: = n! / (<span style={{ color: PINK }}>(n − r)!</span> × <span style={{ color: ORANGE }}>r!</span>)
            </>,
            <>
              = n! / (<span style={{ color: ORANGE }}>r!</span> × <span style={{ color: PINK }}>(n − r)!</span>) = C(n, r) ✓
            </>,
          ].map((line, i) => (
            <Step key={i}>
              <div className="w-fit rounded-card border border-line bg-white px-5 py-3 font-heading text-[24px] font-semibold shadow-card-soft" style={{ color: colors.ink }}>
                {line}
              </div>
            </Step>
          ))}
        </div>
      </ContentSlide>
    ),
    notes: '"The whole proof is one observation: the formula has r! and (n − r)! in the denominator, and swapping r with n − r just swaps them."',
  },
  {
    id: 'c3-counting',
    section: C3,
    label: 'Who Goes Decides Who Stays',
    element: (
      <ContentSlide kicker={C3} title="Who Goes Decides Who Stays" lead="A teacher chooses 2 of 6 students for a trip" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="flex w-fit items-center gap-6">
            <Card tone="ok">
              <Label tone="ok">Bus: 2 go</Label>
              <div className="mt-1 flex gap-2">
                {['A', 'B'].map((s) => (
                  <span key={s} className="grid h-11 w-11 place-items-center rounded-full font-heading text-[18px] font-semibold text-white" style={{ background: TONE.ok }}>
                    {s}
                  </span>
                ))}
              </div>
            </Card>
            <span className="h-20 w-1 rounded" style={{ background: colors.ink }} />
            <Card>
              <Label>Gate: 4 stay</Label>
              <div className="mt-1 flex gap-2">
                {['C', 'D', 'E', 'F'].map((s) => (
                  <span key={s} className="grid h-11 w-11 place-items-center rounded-full font-heading text-[18px] font-semibold text-white" style={{ background: colors.brand }}>
                    {s}
                  </span>
                ))}
              </div>
            </Card>
          </div>
          <Steps
            items={[
              ['Choosing the 2 who go decides the 4 who stay'],
              ['Each group of 2 matches exactly one group of 4, and back', 'C(6, 2) = C(6, 4)'],
              ['In general: each r-subset matches its complement', 'C(n, r) = C(n, n − r)'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"A combinatorial proof counts the same set in two ways or matches two sets one-to-one. This matching is a bijection."',
  },
  {
    id: 'c3-practice',
    section: C3,
    label: 'Symmetry Saves Work',
    element: (
      <ContentSlide kicker={C3} title="Symmetry Saves Work" lead="If C(n, a) = C(n, b) with a ≠ b, then a + b = n" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Problem', weight: 1.3 }, { label: 'Using symmetry', weight: 1.5 }, { label: 'Answer', weight: 0.5 }]}
          rows={[
            ['Evaluate C(100, 98)', 'C(100, 2) = (100 × 99) / 2', '4,950'],
            ['Evaluate C(20, 17)', 'C(20, 3) = (20 × 19 × 18) / 6', '1,140'],
            ['Find n if C(n, 7) = C(n, 5)', '7 = n − 5, so n = 12', '12'],
            ['Find r if C(15, r) = C(15, r + 3)', 'r + (r + 3) = 15, so r = 6', '6'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"Exam hook: if C(n, a) = C(n, b) with a ≠ b, then a + b = n. This gives a quick answer to many find n questions."',
  },
  { id: 'quiz-1', section: C3, label: 'Quiz Time', element: <QuizTimeSlide lesson={SESSION} /> },

  /* ── CONCEPT 4 ───────────────────────────────────────────────────────── */
  { id: 'c4-divider', section: C4, label: 'Divider', element: <SectionBreakerSlide index={4} title={C4} lesson={SESSION} /> },
  {
    id: 'c4-statement',
    section: C4,
    label: 'The Rule That Builds the Triangle',
    element: (
      <ContentSlide kicker={C4} title="The Rule That Builds the Triangle" lead="For 1 ≤ r ≤ n − 1: C(n, r) = C(n − 1, r − 1) + C(n − 1, r)" lesson={SESSION}>
        <div className="grid w-full grid-cols-[auto_1fr] items-start gap-8">
          <Triangle to={8} dx={44} dy={40} d={36} hi={{ '4,1': ORANGE, '4,2': ORANGE, '5,2': ORANGE, '6,2': PINK, '6,3': PINK, '7,3': PINK, '7,4': PURPLE, '8,4': PURPLE }} />
          <div className="space-y-2">
            {[
              ['C(5, 2) = 10', 'C(4, 1) + C(4, 2) = 4 + 6 = 10 ✓', ORANGE],
              ['C(7, 3) = 35', 'C(6, 2) + C(6, 3) = 15 + 20 = 35 ✓', PINK],
              ['C(8, 4) = 70', 'C(7, 3) + C(7, 4) = 35 + 35 = 70 ✓', PURPLE],
            ].map(([l, r, c]) => (
              <Step key={l}>
                <div className="rounded-card border-2 bg-white px-4 py-2" style={{ borderColor: c }}>
                  <span className="block font-heading text-[19px] font-semibold" style={{ color: c }}>
                    {l}
                  </span>
                  <Txt className="text-[18px]">{r}</Txt>
                </div>
              </Step>
            ))}
            <Step>
              <Txt className="text-[18px] font-semibold">Checks are not a proof: proofs follow</Txt>
            </Step>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"Verification is not proof: three examples do not show the identity holds for all n and r. The next two slides give proofs." (C(7, 4) and C(7, 3) share the purple and pink 35s.)',
  },
  {
    id: 'c4-small',
    section: C4,
    label: 'With a or Without a',
    element: (
      <ContentSlide kicker={C4} title="With a or Without a" lead="Think First: split the 2-element subsets of {a, b, c, d} by whether they contain a" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="grid w-fit grid-cols-2 gap-5">
            {[
              ['Contains a', ['{a, b}', '{a, c}', '{a, d}'], 'C(3, 1) = 3', PINK],
              ['Does not contain a', ['{b, c}', '{b, d}', '{c, d}'], 'C(3, 2) = 3', colors.brand],
            ].map(([t, s, c, col]) => (
              <Step key={t as string}>
                <div className="w-[300px] rounded-card border-2 bg-white px-4 py-3" style={{ borderColor: col as string }}>
                  <Label>{t as string}</Label>
                  <div className="my-2 flex flex-wrap gap-2">
                    {(s as string[]).map((x) => (
                      <span key={x} className="rounded-md px-2 py-1 font-heading text-[19px] font-semibold" style={{ background: `${col as string}14`, color: colors.ink }}>
                        {x.split('a').map((part, i, arr) => (
                          <span key={i}>
                            {part}
                            {i < arr.length - 1 && <span style={{ color: PINK }}>a</span>}
                          </span>
                        ))}
                      </span>
                    ))}
                  </div>
                  <Big>{c as string}</Big>
                </div>
              </Step>
            ))}
          </div>
          <Step>
            <Total>3 + 3 = 6 = C(4, 2) ✓</Total>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"This small case is the whole idea of the combinatorial proof on the next slide."',
  },
  {
    id: 'c4-counting',
    section: C4,
    label: 'A Committee and a Special Member',
    element: (
      <ContentSlide kicker={C4} title="A Committee and a Special Member" lead="Committees of r from a class of n, one of whom is Asha" lesson={SESSION}>
        <div className="flex w-full flex-wrap items-center gap-4">
          <Step>
            <Card tone="ok" className="w-[340px]">
              <Label tone="ok">Asha in</Label>
              <Txt>Choose the other r − 1 from the remaining n − 1</Txt>
              <Big className="mt-1">C(n − 1, r − 1)</Big>
            </Card>
          </Step>
          <Op>+</Op>
          <Step>
            <Card className="w-[340px]">
              <Label>Asha out</Label>
              <Txt>Choose all r from the remaining n − 1</Txt>
              <Big className="mt-1">C(n − 1, r)</Big>
            </Card>
          </Step>
          <Op>=</Op>
          <Step>
            <Total label="Sum rule">C(n, r) ✓</Total>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Learners should be able to retell this proof in words. It uses only the sum rule and the definition of C(n, r). Every committee is in exactly one group."',
  },
  {
    id: 'c4-algebra',
    section: C4,
    label: 'Adding Two Fractions',
    element: (
      <ContentSlide kicker={C4} title="Adding Two Fractions" lead="Algebraic proof: use r! = r × (r − 1)! and (n − r)! = (n − r) × (n − r − 1)!" lesson={SESSION}>
        <div className="w-full space-y-2">
          {[
            <>(n − 1)! / ((r − 1)! (n − r)!) + (n − 1)! / (r! (n − r − 1)!)</>,
            <>
              Common denominator r! (n − r)!: multiply by <span style={{ color: PINK }}>r</span> / r and <span style={{ color: ORANGE }}>(n − r)</span> / (n − r)
            </>,
            <>
              = (n − 1)! [<span style={{ color: PINK }}>r</span> + <span style={{ color: ORANGE }}>(n − r)</span>] / (r! (n − r)!)
            </>,
            <>= (n − 1)! × n / (r! (n − r)!) = n! / (r! (n − r)!) = C(n, r) ✓</>,
          ].map((line, i) => (
            <Step key={i}>
              <div className="w-fit rounded-card border border-line bg-white px-5 py-2.5 font-heading text-[21px] font-semibold shadow-card-soft" style={{ color: colors.ink }}>
                {line}
              </div>
            </Step>
          ))}
        </div>
      </ContentSlide>
    ),
    notes: '"The key steps are r! = r × (r − 1)! and (n − r)! = (n − r) × (n − r − 1)!. Write these on the side before starting."',
  },
  {
    id: 'c4-staircase',
    section: C4,
    label: 'No Factorials Needed',
    element: (
      <ContentSlide kicker={C4} title="No Factorials Needed" lead="Each answer feeds the next step" lesson={SESSION}>
        <div className="w-full space-y-3">
          {[
            ['C(8, 3)', 'C(7, 2) + C(7, 3) = 21 + 35', '56', 0],
            ['C(9, 4)', 'C(8, 3) + C(8, 4) = 56 + 70', '126', 60],
            ['C(10, 5)', 'C(9, 4) + C(9, 5) = 126 + 126', '252', 120],
          ].map(([f, w, a, pad]) => (
            <Step key={f as string}>
              <div className="flex w-fit items-center gap-4 rounded-card border border-line bg-white px-4 py-2 shadow-card-soft" style={{ marginLeft: pad as number }}>
                <span className="font-heading text-[21px] font-semibold" style={{ color: colors.brandDark }}>
                  {f as string}
                </span>
                <Txt>{w as string}</Txt>
                <span className="font-heading text-[22px] font-semibold" style={{ color: TONE.ok }}>
                  {a as string}
                </span>
              </div>
            </Step>
          ))}
          <Step>
            <Callout kind="info" title="Read backwards" asStep={false}>
              C(12, 4) + C(12, 5) = C(13, 5): two neighbours in row n give the entry below them
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Reading the identity backwards is a common exam question: two neighbours in row n add to give the entry below them in row n + 1."',
  },
  {
    id: 'c4-practice',
    section: C4,
    label: 'Symmetry or Pascal?',
    element: (
      <ContentSlide kicker={C4} title="Symmetry or Pascal?" lead="Vote for the identity, then reveal" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Problem', weight: 1.6 }, { label: 'Identity', weight: 0.7 }, { label: 'Answer', weight: 1.5 }]}
          rows={[
            ['Evaluate C(50, 48)', 'Symmetry', 'C(50, 2) = 1,225'],
            ['Write C(10, 4) + C(10, 5) as one coefficient', 'Pascal', 'C(11, 5)'],
            ['Find n if C(n, 4) = C(n, 6)', 'Symmetry', 'n = 10'],
            ['Verify C(6, 3) = C(5, 2) + C(5, 3)', 'Pascal', '20 = 10 + 10 ✓'],
            ['Simplify C(7, 2) + C(7, 3) + C(8, 4)', 'Pascal twice', 'C(8, 3) + C(8, 4) = C(9, 4) = 126'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"The last row applies Pascal\'s identity twice: first C(7, 2) + C(7, 3) = C(8, 3), then C(8, 3) + C(8, 4) = C(9, 4)."',
  },

  /* ── CONCEPT 5 ───────────────────────────────────────────────────────── */
  { id: 'c5-divider', section: C5, label: 'Divider', element: <SectionBreakerSlide index={5} title={C5} lesson={SESSION} /> },
  {
    id: 'c5-sums',
    section: C5,
    label: 'Every Row Sums to a Power of 2',
    element: (
      <ContentSlide kicker={C5} title="Every Row Sums to a Power of 2" lead="C(n, 0) + C(n, 1) + … + C(n, n) = 2ⁿ" lesson={SESSION}>
        <div className="grid w-full grid-cols-[auto_1fr] items-center gap-8">
          <Triangle to={5} sums />
          <div className="space-y-2">
            <Step>
              <Txt>1 → 2 → 4 → 8 → 16 → 32: each total doubles</Txt>
            </Step>
            <Step>
              <Card>
                <Txt>The subsets of {'{a, b, c, d}'} by size: 1, 4, 6, 4, 1, total 16 = 2⁴</Txt>
              </Card>
            </Step>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"Remind learners of Counting Subsets: the subsets of {a, b, c, d} by size were 1, 4, 6, 4, 1, totalling 16."',
  },
  {
    id: 'c5-why',
    section: C5,
    label: 'Counting All Subsets Two Ways',
    element: (
      <ContentSlide kicker={C5} title="Counting All Subsets Two Ways" lead="Count all subsets of an n-element set" lesson={SESSION}>
        <div className="grid w-full grid-cols-2 gap-5">
          <Step>
            <Card className="h-full">
              <Label>Way 1: by size</Label>
              <Txt>Size 0, 1, …, n</Txt>
              <Big className="mt-2">C(n, 0) + C(n, 1) + … + C(n, n)</Big>
            </Card>
          </Step>
          <Step>
            <Card className="h-full">
              <Label>Way 2: element by element</Label>
              <div className="my-2 flex gap-2">
                {['a', 'b', 'c', 'd'].map((e, i) => (
                  <span key={e} className="flex flex-col items-center">
                    <span className="text-[17px] font-semibold" style={{ color: colors.ink }}>
                      {e}
                    </span>
                    <span className="relative h-6 w-11 rounded-full" style={{ background: i % 2 ? TONE.ok : '#CBD5E1' }}>
                      <span className="absolute top-1 h-4 w-4 rounded-full bg-white" style={{ left: i % 2 ? 24 : 4 }} />
                    </span>
                    <span className="text-[16px]" style={{ color: TONE.grey }}>
                      {i % 2 ? 'in' : 'out'}
                    </span>
                  </span>
                ))}
              </div>
              <Big>2 × 2 × … × 2 = 2ⁿ</Big>
            </Card>
          </Step>
          <Step className="col-span-2">
            <Callout kind="success" title="Same collection, so the counts are equal" asStep={false}>
              Count one collection two ways and set the counts equal: a combinatorial proof
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"This is another combinatorial proof: count one collection in two ways and set the counts equal." Way 2 is the product rule.',
  },
  {
    id: 'c5-diagonals',
    section: C5,
    label: 'Hidden Sequences',
    element: (
      <ContentSlide kicker={C5} title="Hidden Sequences" lead="Read the triangle along its diagonals" lesson={SESSION}>
        <div className="grid w-full grid-cols-[auto_1fr] items-start gap-6">
          <Triangle
            to={6}
            dx={48}
            dy={42}
            d={38}
            hi={Object.fromEntries([
              ...[0, 1, 2, 3, 4, 5, 6].map((n) => [`${n},0`, TONE.grey]),
              ...[1, 2, 3, 4, 5, 6].map((n) => [`${n},1`, colors.brand]),
              ...[2, 3, 4, 5, 6].map((n) => [`${n},2`, PINK]),
              ...[3, 4, 5, 6].map((n) => [`${n},3`, ORANGE]),
            ])}
          />
          <div className="space-y-2">
            {[
              ['C(n, 0)', '1, 1, 1, 1, …', 'all ones', TONE.grey],
              ['C(n, 1) = n', '1, 2, 3, 4, 5, …', 'natural numbers', colors.brand],
              ['C(n, 2)', '1, 3, 6, 10, 15, …', 'triangular numbers', PINK],
              ['C(n, 3)', '1, 4, 10, 20, 35, …', 'tetrahedral numbers', ORANGE],
            ].map(([f, s, name, c]) => (
              <Step key={f}>
                <div className="rounded-card border-2 bg-white px-4 py-1.5" style={{ borderColor: c }}>
                  <span className="font-heading text-[18px] font-semibold" style={{ color: c }}>
                    {f}: {name}
                  </span>
                  <Txt className="text-[18px]">{s}</Txt>
                </div>
              </Step>
            ))}
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"Triangular numbers count dots in a triangle and also handshakes: C(n, 2). Tetrahedral numbers count stacked balls in a pyramid. Learners enjoy discovering these sequences."',
  },
  {
    id: 'c5-practice',
    section: C5,
    label: 'Use the Patterns',
    element: (
      <ContentSlide kicker={C5} title="Use the Patterns" lead="Name the pattern, then reveal" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Question', weight: 1.6 }, { label: 'Pattern', weight: 1.1 }, { label: 'Answer', weight: 0.7 }]}
          rows={[
            ['Sum of the entries in row 8', 'Row sum', '2⁸ = 256'],
            ['Number of subsets of a 6-element set', 'Row sum', '2⁶ = 64'],
            ['Non-empty subsets of a 5-element set', 'Row sum minus C(5, 0)', '32 − 1 = 31'],
            ['The 7th triangular number', 'C(8, 2)', '28'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"For the last row, list the triangular numbers 1, 3, 6, 10, 15, 21, 28 and check that the 7th is C(8, 2)."',
  },

  /* ── CONCEPT 6 ───────────────────────────────────────────────────────── */
  { id: 'c6-divider', section: C6, label: 'Divider', element: <SectionBreakerSlide index={6} title={C6} lesson={SESSION} /> },
  {
    id: 'c6-row9',
    section: C6,
    label: 'Row 9 of Pascal\'s Triangle',
    element: (
      <ContentSlide kicker={C6} title="Row 9 of Pascal's Triangle" lead="From row 8, build row 9 and check symmetry" lesson={SESSION}>
        <div className="grid w-full grid-cols-[auto_1fr] items-center gap-6">
          <Triangle from={8} to={9} dx={56} dy={60} d={46} mirror hi={{ '8,1': ORANGE, '8,2': ORANGE, '9,2': TONE.ok, '8,4': PINK, '8,5': PINK, '9,5': TONE.ok }} />
          <Steps
            items={[
              ['Pascal: 8 + 28 = 36, 56 + 70 = 126', '1, 9, 36, 84, 126, …'],
              ['Symmetry: C(9, 2) = C(9, 7)', '36'],
              ['Symmetry: C(9, 4) = C(9, 5)', '126'],
              ['Formula check: (9 × 8) / 2', '36 ✓'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"This exercise uses both identities and the formula together. It is a typical short-answer exam question." Row 9 = 1, 9, 36, 84, 126, 126, 84, 36, 9, 1.',
  },
  {
    id: 'c6-mistakes',
    section: C6,
    label: 'Avoid These Errors',
    element: (
      <ContentSlide kicker={C6} title="Avoid These Errors" lead="Red: the wrong version. Green: the fix" lesson={SESSION}>
        <div className="w-full space-y-2">
          {[
            ['Counting rows from 1', 'The 6th printed row (1, 5, 10, 10, 5, 1) for n = 6: C(6, 2) = 10', 'Row 6 is the 7th printed row: C(6, 2) = 15'],
            ['Wrong symmetry partner', 'C(10, 3) = C(10, 3 − 10)', 'C(10, 3) = C(10, 7)'],
            ["Pascal's identity with the wrong row", 'C(7, 3) = C(7, 2) + C(7, 3)', 'C(7, 3) = C(6, 2) + C(6, 3)'],
            ['Verification taken as proof', '"It works for n = 5, so it is true"', 'Give a counting or algebraic proof'],
          ].map(([m, w, f]) => (
            <Step key={m}>
              <div className="grid grid-cols-[0.9fr_1.3fr_1.1fr] items-center gap-3 rounded-card border border-line bg-white px-4 py-2 shadow-card-soft">
                <span className="font-heading text-[18px] font-semibold" style={{ color: colors.ink }}>
                  {m}
                </span>
                <span className="text-[17px] line-through" style={{ color: TONE.bad, textDecorationThickness: 2 }}>
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
    notes: '"The last row matters for exams: when a question says prove, examples alone earn little credit."',
  },
  {
    id: 'c6-mixed',
    section: C6,
    label: 'Definition, Triangle and Identities',
    element: (
      <ContentSlide kicker={C6} title="Definition, Triangle and Identities" lead="Name the tool for each row, then reveal" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Problem', weight: 1.8 }, { label: 'Tool', weight: 0.7 }, { label: 'Answer', weight: 0.8 }]}
          rows={[
            ['3-element subsets of {1, 2, 3, 4, 5, 6}', 'Definition', 'C(6, 3) = 20'],
            ['The entry in row 7, position 2', 'Triangle', 'C(7, 2) = 21'],
            ['Find n if C(n, 3) = C(n, 9)', 'Symmetry', 'n = 12'],
            ['Write C(15, 6) + C(15, 7) as one coefficient', 'Pascal', 'C(16, 7)'],
            ['Evaluate C(25, 23)', 'Symmetry', 'C(25, 2) = 300'],
            ['Sum of all entries in row 10', 'Row sum', '2¹⁰ = 1,024'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"Ask learners to name the tool for each row: definition, triangle, symmetry, Pascal\'s identity, symmetry, row sum."',
  },
  {
    id: 'c6-computing',
    section: C6,
    label: "Pascal's Identity as an Algorithm",
    element: (
      <ContentSlide kicker={C6} title="Pascal's Identity as an Algorithm" lead="Computing C(n, r) with only additions" lesson={SESSION}>
        <div className="grid w-full grid-cols-[auto_1fr] items-start gap-6">
          <div className="grid gap-0.5" style={{ gridTemplateColumns: '36px repeat(7, 42px)' }}>
            <span className="text-[16px] font-semibold" style={{ color: TONE.grey }}>
              i\j
            </span>
            {[0, 1, 2, 3, 4, 5, 6].map((j) => (
              <span key={j} className="grid h-8 place-items-center text-[16px] font-semibold" style={{ color: colors.brandDark }}>
                {j}
              </span>
            ))}
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <span key={i} className="contents">
                <span className="grid h-9 place-items-center text-[16px] font-semibold" style={{ color: colors.brandDark }}>
                  {i}
                </span>
                {[0, 1, 2, 3, 4, 5, 6].map((j) => {
                  const on = j <= i
                  const target = i === 5 && j === 2
                  const parent = i === 4 && (j === 1 || j === 2)
                  return (
                    <span key={j} className="grid h-9 place-items-center rounded text-[16px] font-semibold" style={{ background: target ? TONE.ok : parent ? ORANGE : on ? `${colors.brand}18` : '#F8FAFC', color: target || parent ? '#fff' : colors.ink }}>
                      {on ? binom(i, j) : ''}
                    </span>
                  )
                })}
              </span>
            ))}
          </div>
          <div className="space-y-3">
            <Step>
              <Txt>n! overflows fast: 21! is larger than the largest 64-bit integer</Txt>
            </Step>
            <Step>
              <div className="rounded-card px-4 py-3 font-mono text-[17px]" style={{ background: '#0F1B2D', color: '#E2E8F0' }}>
                <span className="block">C[i][0] = C[i][i] = 1</span>
                <span className="block">C[i][j] = C[i-1][j-1] + C[i-1][j]</span>
              </div>
            </Step>
            <Step>
              <Callout kind="success" title="Dynamic programming" asStep={false}>
                Fill the table row by row, reusing smaller answers
              </Callout>
            </Step>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"Ask learners why the table avoids overflow: every entry counts subsets, not orderings, so the numbers stay far smaller than n!. For example, C(30, 15) = 155,117,520 fits easily, while 30! has 33 digits." The orange cells 4 and 6 add to the green 10.',
  },

  /* ── CLOSING ────────────────────────────────────────────────────────── */
  { id: 'quiz-2', section: 'Closing', label: 'Quiz Time', element: <QuizTimeSlide lesson={SESSION} /> },
  { id: 'takeaways', section: 'Closing', label: 'Key Takeaways', element: <KeyTakeawaysSlide title={SESSION} lesson={SESSION} points={AGENDA} /> },
  { id: 'feedback', section: 'Closing', label: 'Feedback', element: <FeedbackSlide lesson={SESSION} formless />, notes: 'No form and no QR (content rule 41 as amended 2026-11-21). Ask for feedback out loud.' },
  { id: 'thank-you', section: 'Closing', label: 'Thank you', element: <ThankYouSlide title="Thank You" lesson={SESSION} /> },
  { id: 'all-the-best', section: 'Closing', label: 'All the best', element: <ThankYouSlide title="All the Best" lesson={SESSION} /> },
]
