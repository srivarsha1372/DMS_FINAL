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
 * ENUMERATING COMBINATIONS AND PERMUTATIONS WITH REPETITIONS (DSM, Elementary Combinatorics).
 *
 * Built from the signed-off plan at
 *   Outputs/dsm/session_plans/combinations_with_repetition/plan.md
 * (46 slides, one per TR slide). Every count was recomputed by `verify_tr.py`.
 * No cross-session phrases on slides or in notes (user rule, 2026-11-26).
 * Visuals are DOM figures, never SVG text.
 */

const SESSION = 'Enumerating Combinations and Permutations with Repetitions'
const C1 = 'When Repetition Is Allowed'
const C2 = 'Permutations with Repetition'
const C3 = 'Combinations with Repetition'
const C4 = 'The Stars and Bars Method'
const C5 = 'Distributing Identical Objects'
const C6 = 'Choosing the Right Formula'
const AGENDA = [C1, C2, C3, C4, C5, C6]

export const repetitionMeta: DeckMeta = {
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
const FLAVOUR: Record<string, string> = { V: '#E7D9B0', C: '#7C4A2D', S: '#F472B6' }

function Lit({ v, tone }: { v: ReactNode; tone?: Tone }) {
  if (!tone) return <>{v}</>
  const c = TONE[tone]
  return (
    <span className="inline-block rounded-md px-2 font-semibold" style={{ background: `${c}22`, color: c, boxShadow: `inset 0 0 0 1.5px ${c}66` }}>
      {v}
    </span>
  )
}

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
    <div className="w-fit min-w-[620px] space-y-2">
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
      <span className="text-[17px] font-semibold uppercase tracking-wide" style={{ color: TONE.ok }}>
        {label}
      </span>
      <span className="font-heading text-[28px] font-semibold" style={{ color: colors.ink }}>
        {children}
      </span>
    </span>
  )
}

function Slots({ values, tone = colors.brand }: { values: (string | number)[]; tone?: string }) {
  return (
    <div className="flex w-fit items-center gap-2">
      {values.map((v, i) => (
        <span key={i} className="flex items-center gap-2">
          <span className="grid h-14 min-w-[56px] place-items-center rounded-lg border-2 border-dashed px-2 font-heading text-[22px] font-semibold" style={{ borderColor: tone, color: colors.ink }}>
            {v}
          </span>
          {i < values.length - 1 && (
            <span className="text-[20px] font-semibold" style={{ color: colors.brandDark }}>
              ×
            </span>
          )}
        </span>
      ))}
    </div>
  )
}

/** A star-and-bar row; '*' is a star, '|' is a bar. */
function StarBar({ code, size = 30 }: { code: string; size?: number }) {
  return (
    <span className="inline-flex items-center gap-1">
      {code.split('').map((ch, i) =>
        ch === '*' ? (
          <span key={i} style={{ color: '#D97706', fontSize: size, lineHeight: 1 }}>
            ★
          </span>
        ) : (
          <span key={i} className="mx-1 inline-block rounded-sm" style={{ width: 5, height: size + 6, background: colors.ink }} />
        ),
      )}
    </span>
  )
}

/** An ice cream cup with scoops in flavour colours. */
function Cup({ scoops, label = true }: { scoops: string; label?: boolean }) {
  return (
    <span className="inline-flex flex-col items-center">
      <span className="flex flex-col-reverse items-center">
        {scoops.split('').map((f, i) => (
          <span key={i} className="-mb-1 h-6 w-9 rounded-full" style={{ background: FLAVOUR[f], boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.12)' }} />
        ))}
      </span>
      <span className="h-6 w-10" style={{ background: '#D6A15A', clipPath: 'polygon(0 0, 100% 0, 75% 100%, 25% 100%)' }} />
      {label && (
        <span className="mt-1 text-[17px] font-semibold" style={{ color: colors.ink }}>
          {scoops}
        </span>
      )}
    </span>
  )
}

/** The 2 × 2 grid of counting kinds. */
function Grid({ cells }: { cells: [ReactNode, ReactNode, ReactNode, ReactNode] }) {
  const tile = (c: ReactNode, i: number) => (
    <div key={i} className="grid min-h-[100px] place-items-center rounded-xl px-3 py-3" style={{ background: [`${colors.brand}18`, '#FEF3C7', `${TONE.ok}18`, '#FCE7F3'][i] }}>
      {c}
    </div>
  )
  return (
    <div className="grid w-full grid-cols-[210px_1fr_1fr] gap-2">
      <span />
      <Label>Repetition not allowed</Label>
      <Label>Repetition allowed</Label>
      <span className="self-center font-heading text-[19px] font-semibold" style={{ color: colors.ink }}>
        Order matters
      </span>
      {tile(cells[0], 0)}
      {tile(cells[1], 1)}
      <span className="self-center font-heading text-[19px] font-semibold" style={{ color: colors.ink }}>
        Order does not matter
      </span>
      {tile(cells[2], 2)}
      {tile(cells[3], 3)}
    </div>
  )
}

/** C4: tree of 2-letter codes from a, b, c. */
function CodeTree() {
  return (
    <div className="space-y-2">
      {['a', 'b', 'c'].map((f) => (
        <Step key={f} className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full font-heading text-[20px] font-semibold text-white" style={{ background: colors.brand }}>
            {f}
          </span>
          <span className="h-[3px] w-6" style={{ background: colors.brandDark }} />
          {['a', 'b', 'c'].map((s) => (
            <span key={s} className="rounded-lg px-3 py-1 font-heading text-[19px] font-semibold" style={{ background: f === s ? '#FEF3C7' : '#fff', color: colors.ink, boxShadow: `inset 0 0 0 2px ${f === s ? '#D97706' : colors.line}` }}>
              {f}
              {s}
            </span>
          ))}
        </Step>
      ))}
    </div>
  )
}

/* ── the deck ───────────────────────────────────────────────────────────── */

export const repetitionDeck: SlideDef[] = [
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
          { title: C1, sub: 'Order and repetition: four kinds of counting' },
          { title: C2, sub: 'Ordered choices with repeats: nʳ' },
          { title: C3, sub: 'Unordered choices with repeats' },
          { title: C4, sub: 'The C(n + r − 1, r) formula' },
          { title: C5, sub: 'Sharing identical items' },
          { title: C6, sub: 'The four-cell grid and mixed problems' },
        ]}
      />
    ),
  },

  /* ── CONCEPT 1 ───────────────────────────────────────────────────────── */
  { id: 'c1-divider', section: C1, label: 'Divider', element: <SectionBreakerSlide index={1} title={C1} lesson={SESSION} /> },
  {
    id: 'c1-lock',
    section: C1,
    label: 'Is Repetition Allowed?',
    element: (
      <ContentSlide kicker={C1} title="Is Repetition Allowed?" lead="Think First: how many 3-digit codes can a suitcase lock have, 000 to 999?" lesson={SESSION}>
        <div className="grid w-full grid-cols-[auto_1fr] items-center gap-8">
          <div className="rounded-2xl px-5 py-4" style={{ background: '#1E293B' }}>
            <div className="flex gap-2">
              {['4', '8', '2'].map((d, i) => (
                <span key={i} className="flex flex-col items-center rounded-lg px-3 py-1" style={{ background: '#0F172A' }}>
                  <span className="text-[16px]" style={{ color: '#94A3B8' }}>
                    {(Number(d) + 9) % 10}
                  </span>
                  <span className="font-heading text-[30px] font-semibold text-white">{d}</span>
                  <span className="text-[16px]" style={{ color: '#94A3B8' }}>
                    {(Number(d) + 1) % 10}
                  </span>
                </span>
              ))}
            </div>
            <span className="mt-2 block text-[16px]" style={{ color: '#CBD5E1' }}>
              each wheel: 0 to 9
            </span>
          </div>
          <div className="space-y-3">
            <Step>
              <Card>
                <Label>No digit repeats: 482 ✓</Label>
                <Big>10P3 = 10 × 9 × 8 = 720</Big>
              </Card>
            </Step>
            <Step>
              <Card tone="warn">
                <Label tone="warn">Repeats allowed: 337 ✓, 000 ✓</Label>
                <Txt>Each wheel can show any of the 10 digits. How many now?</Txt>
              </Card>
            </Step>
            <Step>
              <Callout kind="info" title="A new question" asStep={false}>
                Until now every object could be used at most once. Today we drop that rule
              </Callout>
            </Step>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"Let learners guess the count with repeats allowed. Many will say 720 again; the next section shows it is 1,000."',
  },
  {
    id: 'c1-everyday',
    section: C1,
    label: 'Where Repeats Happen',
    element: (
      <ContentSlide kicker={C1} title="Where Repeats Happen" lead="Key test: after an object is chosen, is it still available?" lesson={SESSION}>
        <div className="w-full space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <Card tone="ok">
              <Label tone="ok">Put the marble back: repetition allowed</Label>
              <div className="mt-2 flex gap-2">
                {['#2D63FB', '#16A34A', '#F59E0B', '#2D63FB'].map((c, i) => (
                  <span key={i} className="h-8 w-8 rounded-full" style={{ background: c }} />
                ))}
                <span className="ml-2 text-[18px] font-semibold" style={{ color: TONE.ok }}>
                  ↺ back in the jar
                </span>
              </div>
            </Card>
            <Card tone="bad">
              <Label tone="bad">Keep it aside: no repetition</Label>
              <div className="mt-2 flex gap-2">
                {['#2D63FB', '#16A34A', '#F59E0B'].map((c, i) => (
                  <span key={i} className="h-8 w-8 rounded-full" style={{ background: c }} />
                ))}
                <span className="ml-2 text-[18px] font-semibold" style={{ color: TONE.bad }}>
                  set aside
                </span>
              </div>
            </Card>
          </div>
          <RevealTable
            columns={[{ label: 'Situation', weight: 1.5 }, { label: 'Allowed?', weight: 0.6 }, { label: 'Why', weight: 1.6 }]}
            rows={[
              ['PIN for a debit card', <Lit v="Yes" tone="ok" />, '1111 is a valid PIN'],
              ['Gold, silver, bronze in a race', <Lit v="No" tone="bad" />, 'One runner cannot win two medals'],
              ['3 scoops of ice cream', <Lit v="Yes" tone="ok" />, 'You may take 2 scoops of chocolate'],
              ['A team of 5 from a class', <Lit v="No" tone="bad" />, 'A person cannot be picked twice'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"The put it back picture is the clearest way to think about repetition: choosing with replacement versus without replacement."',
  },
  {
    id: 'c1-grid',
    section: C1,
    label: 'Order and Repetition',
    element: (
      <ContentSlide kicker={C1} title="Order and Repetition" lead="Two questions decide the formula: does order matter? Is repetition allowed?" lesson={SESSION}>
        <div className="w-full space-y-3">
          <Grid
            cells={[
              <Big className="text-[26px]">nPr (podium)</Big>,
              <span className="font-heading text-[40px] font-semibold" style={{ color: '#D97706' }}>
                ?
              </span>,
              <Big className="text-[26px]">nCr (basket)</Big>,
              <span className="font-heading text-[40px] font-semibold" style={{ color: '#DB2777' }}>
                ?
              </span>,
            ]}
          />
          <Step>
            <Callout kind="info" title="Today we fill in the two empty cells" asStep={false}>
              Ordered with repeats next, then unordered with repeats
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Keep returning to this grid. At the end, all four cells will be filled (All Four Kinds of Counting)." nPr and nCr are already known; the right-hand cells are new.',
  },

  /* ── CONCEPT 2 ───────────────────────────────────────────────────────── */
  { id: 'c2-divider', section: C2, label: 'Divider', element: <SectionBreakerSlide index={2} title={C2} lesson={SESSION} /> },
  {
    id: 'c2-codes',
    section: C2,
    label: 'Codes From a, b, c',
    element: (
      <ContentSlide kicker={C2} title="Codes From a, b, c" lead="Think First: 2-letter codes, letters may repeat, order matters" lesson={SESSION}>
        <div className="grid w-full grid-cols-[1fr_1fr] items-center gap-6">
          <CodeTree />
          <div className="space-y-3">
            <Step>
              <Total>3 × 3 = 9</Total>
            </Step>
            <Step>
              <Card>
                <Txt>Without repetition: 3P2 = 6 (no aa, bb, cc). The highlighted leaves are the 3 extra codes</Txt>
              </Card>
            </Step>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"The highlighted leaves are exactly the extra codes we gain by allowing repetition: 9 − 6 = 3."',
  },
  {
    id: 'c2-rule',
    section: C2,
    label: 'n Choices for Every Position',
    element: (
      <ContentSlide kicker={C2} title="n Choices for Every Position" lead="Ordered arrangements of length r from n objects, each usable any number of times" lesson={SESSION}>
        <div className="w-full space-y-4">
          <Card tone="ok" className="w-fit">
            <Label tone="ok">With repetition</Label>
            <div className="mt-2 flex items-center gap-4">
              <Slots values={['n', 'n', 'n', '…', 'n']} tone={TONE.ok} />
              <Op>=</Op>
              <span className="font-heading text-[34px] font-semibold" style={{ color: colors.ink }}>
                nʳ
              </span>
            </div>
          </Card>
          <Step>
            <Card className="w-fit">
              <Label>Without repetition (nPr)</Label>
              <div className="mt-2">
                <Slots values={['n', 'n − 1', 'n − 2', '…']} />
              </div>
            </Card>
          </Step>
          <Step>
            <Callout kind="info" title="Product rule, objects put back" asStep={false}>
              Here r can exceed n: 5-letter codes from 2 letters are fine
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Exam hook: compare the two slot diagrams. Without repetition the labels go down by one each time; with repetition they stay at n."',
  },
  {
    id: 'c2-compare',
    section: C2,
    label: 'How Much Does Repetition Add?',
    element: (
      <ContentSlide kicker={C2} title="How Much Does Repetition Add?" lead="nPr against nʳ" lesson={SESSION}>
        <div className="w-full space-y-2">
          {[
            ['2 letters from a, b, c', '3P2 = 6', '3² = 9', 6, 9],
            ['3-digit lock codes', '10P3 = 720', '10³ = 1,000', 720, 1000],
            ['4-digit PINs', '10P4 = 5,040', '10⁴ = 10,000', 5040, 10000],
            ['4-letter codes from 26 letters', '26P4 = 358,800', '26⁴ = 456,976', 358800, 456976],
          ].map(([name, a, b, x, y]) => (
            <Step key={name as string}>
              <div className="grid grid-cols-[280px_1fr] items-center gap-4 rounded-card border border-line bg-white px-4 py-2 shadow-card-soft">
                <span className="font-heading text-[18px] font-semibold" style={{ color: colors.ink }}>
                  {name as string}
                </span>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="h-5 rounded" style={{ width: `${((x as number) / (y as number)) * 360}px`, background: colors.brand }} />
                    <span className="text-[17px] font-semibold" style={{ color: colors.ink }}>
                      {a as string}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-5 rounded" style={{ width: 360, background: TONE.ok }} />
                    <span className="text-[17px] font-semibold" style={{ color: colors.ink }}>
                      {b as string}
                    </span>
                  </div>
                </div>
              </div>
            </Step>
          ))}
        </div>
      </ContentSlide>
    ),
    notes: '"Answer the opening lock question here: 1,000 lock codes with repeats, 720 without." Blue bars: no repetition; green bars: repetition (scaled per row).',
  },
  {
    id: 'c2-dice',
    section: C2,
    label: 'Repeated Experiments',
    element: (
      <ContentSlide kicker={C2} title="Repeated Experiments" lead="A die rolled 3 times, results recorded in order" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="flex w-fit items-center gap-4">
            {[2, 4, 4].map((v, i) => (
              <span key={i} className="flex flex-col items-center">
                <span className="text-[17px] font-semibold" style={{ color: colors.brandDark }}>
                  6
                </span>
                <span className="grid h-14 w-14 place-items-center rounded-xl border-2 font-heading text-[24px] font-semibold" style={{ borderColor: colors.ink, color: colors.ink }}>
                  {v}
                </span>
              </span>
            ))}
            <Op>⟶</Op>
            <Total>6³ = 216</Total>
          </div>
          <Txt>(2, 4, 4) and (4, 2, 4) are different outcomes: a 4 can come up twice</Txt>
          <Step>
            <Card tone="warn" className="w-fit">
              <Label tone="warn">Try it: a coin tossed 5 times</Label>
              <div className="mt-1 flex items-center gap-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className="grid h-11 w-11 place-items-center rounded-full font-heading text-[17px] font-semibold" style={{ background: '#FDE68A', color: colors.ink }}>
                    2
                  </span>
                ))}
                <Big className="ml-3">2⁵ = 32</Big>
              </div>
            </Card>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Recording results in order is what makes this a permutation: (2, 4, 4) and (4, 2, 4) are different outcomes."',
  },
  {
    id: 'c2-jobs',
    section: C2,
    label: 'Every Job Picks a Printer',
    element: (
      <ContentSlide kicker={C2} title="Every Job Picks a Printer" lead="5 different print jobs, 3 printers, each job to any printer" lesson={SESSION}>
        <div className="grid w-full grid-cols-[1fr_1fr] items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="space-y-1.5">
              {[1, 2, 3, 4, 5].map((j) => (
                <span key={j} className="block rounded-md px-3 py-1 text-[17px] font-semibold text-white" style={{ background: colors.brand }}>
                  Job {j} → 3 choices
                </span>
              ))}
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((p) => (
                <span key={p} className="block rounded-lg border-2 px-3 py-2 text-[17px] font-semibold" style={{ borderColor: colors.ink, color: colors.ink }}>
                  Printer {p}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <Slots values={[3, 3, 3, 3, 3]} />
            <Step>
              <Total>3⁵ = 243</Total>
            </Step>
            <Step>
              <Txt>The base is the number of options (printers); the power is the number of decisions (jobs)</Txt>
            </Step>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"This is the same count as the number of functions from a 5-element set to a 3-element set."',
  },
  {
    id: 'c2-base-power',
    section: C2,
    label: 'Which Number Goes on Top?',
    element: (
      <ContentSlide kicker={C2} title="Which Number Goes on Top?" lead="Say it: each ___ picks one of ___. The thing that picks is the power" lesson={SESSION}>
        <div className="w-full space-y-2">
          {[
            ['5 letters posted into 3 letterboxes', 'Each letter picks a box', '3⁵ = 243', '5³ = 125'],
            ['4 students each pick one of 6 clubs', 'Each student picks a club', '6⁴ = 1,296', '4⁶ = 4,096'],
            ['8-bit strings', 'Each bit picks 0 or 1', '2⁸ = 256', '8² = 64'],
          ].map(([p, who, right, wrong]) => (
            <Step key={p}>
              <div className="grid grid-cols-[1.4fr_1.2fr_0.8fr_0.8fr] items-center gap-3 rounded-card border border-line bg-white px-4 py-2 shadow-card-soft">
                <span className="text-[18px] font-semibold" style={{ color: colors.ink }}>
                  {p}
                </span>
                <span className="text-[18px]" style={{ color: colors.ink }}>
                  {who}
                </span>
                <span className="font-heading text-[20px] font-semibold" style={{ color: TONE.ok }}>
                  ✓ {right}
                </span>
                <span className="text-[18px] line-through" style={{ color: TONE.bad, textDecorationThickness: 2 }}>
                  {wrong}
                </span>
              </div>
            </Step>
          ))}
        </div>
      </ContentSlide>
    ),
    notes: '"Ask learners to say the sentence each ___ picks one of ___ for every problem. The thing that picks is the power."',
  },
  {
    id: 'c2-practice',
    section: C2,
    label: 'n Choices, r Times',
    element: (
      <ContentSlide kicker={C2} title="n Choices, r Times" lead="Draw the slot diagram first, then reveal" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Problem', weight: 2 }, { label: 'n, r', weight: 0.6 }, { label: 'Answer', weight: 1.1 }]}
          rows={[
            ['3-letter passwords from 26 lowercase letters', '26, 3', '26³ = 17,576'],
            ['10 true-or-false questions, all answered', '2, 10', '2¹⁰ = 1,024'],
            ['6 different gifts, each to one of 4 children', '4, 6', '4⁶ = 4,096'],
            ['4-digit PINs with at least one repeated digit', 'Complement', '10⁴ − 10P4 = 4,960'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"The last row uses the complement method: all PINs minus PINs with no repeated digit."',
  },

  /* ── CONCEPT 3 ───────────────────────────────────────────────────────── */
  { id: 'c3-divider', section: C3, label: 'Divider', element: <SectionBreakerSlide index={3} title={C3} lesson={SESSION} /> },
  {
    id: 'c3-scoops',
    section: C3,
    label: 'Three Scoops, Three Flavours',
    element: (
      <ContentSlide kicker={C3} title="Three Scoops, Three Flavours" lead="Think First: 3 scoops from Vanilla, Chocolate, Strawberry; order in the cup does not matter" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="flex w-fit items-end gap-6">
            {['V', 'C', 'S'].map((f) => (
              <span key={f} className="flex flex-col items-center">
                <span className="h-12 w-16 rounded-t-xl" style={{ background: FLAVOUR[f] }} />
                <span className="text-[17px] font-semibold" style={{ color: colors.ink }}>
                  {{ V: 'Vanilla', C: 'Chocolate', S: 'Strawberry' }[f]}
                </span>
              </span>
            ))}
            <span className="ml-6 flex items-end gap-3">
              <Cup scoops="VVC" />
              <Op>=</Op>
              <Cup scoops="VCV" />
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Step>
              <Card tone="bad">
                <Label tone="bad">nʳ = 3³ = 27: too many</Label>
                <Txt>It counts orders</Txt>
              </Card>
            </Step>
            <Step>
              <Card tone="bad">
                <Label tone="bad">3C3 = 1: too few</Label>
                <Txt>It forbids repeats</Txt>
              </Card>
            </Step>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"Neither formula we know fits. Ask learners to list the cups in pairs before the next slide."',
  },
  {
    id: 'c3-list',
    section: C3,
    label: 'Listing Every Cup',
    element: (
      <ContentSlide kicker={C3} title="Listing Every Cup" lead="Organise by pattern" lesson={SESSION}>
        <div className="w-full space-y-3">
          {[
            ['All 3 the same', ['VVV', 'CCC', 'SSS']],
            ['2 the same, 1 different', ['VVC', 'VVS', 'CCV', 'CCS', 'SSV', 'SSC']],
            ['All 3 different', ['VCS']],
          ].map(([p, cs]) => (
            <Step key={p as string}>
              <div className="flex items-end gap-4 rounded-card border border-line bg-white px-4 py-2 shadow-card-soft">
                <span className="w-[230px] self-center font-heading text-[19px] font-semibold" style={{ color: colors.ink }}>
                  {p as string}: {(cs as string[]).length}
                </span>
                {(cs as string[]).map((c) => (
                  <Cup key={c} scoops={c} />
                ))}
              </div>
            </Step>
          ))}
          <Step>
            <Total>3 + 6 + 1 = 10 cups</Total>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Listing works here, but would be painful for 10 scoops from 6 flavours. We need a method that turns this into a counting problem we already know."',
  },
  {
    id: 'c3-counts',
    section: C3,
    label: 'A Cup Is a List of Counts',
    element: (
      <ContentSlide kicker={C3} title="A Cup Is a List of Counts" lead="How many scoops of each flavour; whole numbers adding to 3" lesson={SESSION}>
        <div className="grid w-full grid-cols-4 gap-4">
          {[
            ['VVV', [3, 0, 0]],
            ['VVC', [2, 1, 0]],
            ['VCS', [1, 1, 1]],
            ['CSS', [0, 1, 2]],
          ].map(([c, n]) => (
            <Step key={c as string}>
              <Card className="h-full">
                <Cup scoops={c as string} />
                <div className="mt-2 flex gap-2">
                  {['V', 'C', 'S'].map((f, i) => (
                    <span key={f} className="flex flex-col items-center rounded-md px-2 py-1" style={{ background: '#F1F5F9' }}>
                      <span className="text-[16px] font-semibold" style={{ color: colors.brandDark }}>
                        {f}
                      </span>
                      <span className="font-heading text-[22px] font-semibold" style={{ color: colors.ink }}>
                        {(n as number[])[i]}
                      </span>
                    </span>
                  ))}
                </div>
              </Card>
            </Step>
          ))}
        </div>
      </ContentSlide>
    ),
    notes: '"This view is the bridge to stars and bars: we are really counting ways to split the number 3 into 3 labelled parts." Order inside the cup is ignored.',
  },
  {
    id: 'c3-definition',
    section: C3,
    label: 'Combination with Repetition',
    element: (
      <ContentSlide kicker={C3} title="Combination with Repetition" lead="An r-combination with repetition from n types: a selection of r objects" lesson={SESSION}>
        <div className="grid w-full grid-cols-[1fr_1fr] items-center gap-6">
          <div className="flex items-end gap-4">
            {['V', 'C', 'S'].map((f) => (
              <span key={f} className="flex flex-col items-center">
                <span className="text-[22px] font-semibold" style={{ color: colors.brandDark }}>
                  ∞
                </span>
                <span className="h-20 w-16 rounded-b-xl" style={{ background: FLAVOUR[f] }} />
                <span className="text-[17px] font-semibold" style={{ color: colors.ink }}>
                  {f}
                </span>
              </span>
            ))}
            <Op>⟶</Op>
            <Cup scoops="VCC" label={false} />
          </div>
          <div className="space-y-2">
            {['Order does not matter', 'Repetition allowed: any type any number of times', 'An unlimited supply of each type'].map((t) => (
              <Step key={t}>
                <Card>
                  <Txt>{t}</Txt>
                </Card>
              </Step>
            ))}
            <Step>
              <Txt className="font-semibold">A cup of 3 scoops from 3 flavours: one of 10</Txt>
            </Step>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"Stress unlimited supply. If the shop had only one scoop of strawberry left, our method would need changing; we do not handle such limits today."',
  },
  {
    id: 'c3-everyday',
    section: C3,
    label: 'Selections With Repeats',
    element: (
      <ContentSlide kicker={C3} title="Selections With Repeats" lead="Order does not matter, types can repeat" lesson={SESSION}>
        <div className="grid w-full grid-cols-2 gap-3">
          {[
            ['Doughnut box', '6 doughnuts from 4 kinds', 'n = 4, r = 6'],
            ['Coin purse', '10 coins from ₹1, ₹2, ₹5, ₹10', 'n = 4, r = 10'],
            ['Fruit basket', '5 fruits from apples, bananas, oranges', 'n = 3, r = 5'],
            ['Pen stand', '3 pens from red, blue, green, black', 'n = 4, r = 3'],
          ].map(([scene, d, nr]) => (
            <Step key={scene}>
              <Card>
                <Label>{scene}</Label>
                <Txt>{d}</Txt>
                <span className="mt-1 inline-block rounded-md px-2 py-0.5 font-heading text-[18px] font-semibold" style={{ background: `${colors.brand}18`, color: colors.brandDark }}>
                  {nr}
                </span>
              </Card>
            </Step>
          ))}
        </div>
      </ContentSlide>
    ),
    notes: '"In each row, ask: does the order of picking matter? No. Can a type repeat? Yes. So all four are combinations with repetition."',
  },
  {
    id: 'c3-practice',
    section: C3,
    label: 'Order? Repetition?',
    element: (
      <ContentSlide kicker={C3} title="Order? Repetition?" lead="Place each situation in one cell of the grid" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Situation', weight: 1.8 }, { label: 'Order?', weight: 0.5 }, { label: 'Repetition?', weight: 0.6 }, { label: 'Kind', weight: 1.4 }]}
          rows={[
            ['4-digit PIN', 'Yes', 'Yes', 'Permutation with repetition'],
            ['3 scoops of ice cream from 5 flavours', 'No', 'Yes', 'Combination with repetition'],
            ['A team of 4 from 12 players', 'No', 'No', 'Combination'],
            ['President and Secretary from 12 members', 'Yes', 'No', 'Permutation'],
            ['8 sweets chosen from 3 types', 'No', 'Yes', 'Combination with repetition'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"This sorting skill is the most important takeaway. The formula follows once the cell is known."',
  },
  { id: 'quiz-1', section: C3, label: 'Quiz Time', element: <QuizTimeSlide lesson={SESSION} /> },

  /* ── CONCEPT 4 ───────────────────────────────────────────────────────── */
  { id: 'c4-divider', section: C4, label: 'Divider', element: <SectionBreakerSlide index={4} title={C4} lesson={SESSION} /> },
  {
    id: 'c4-code',
    section: C4,
    label: 'Stars for Items, Bars as Dividers',
    element: (
      <ContentSlide kicker={C4} title="Stars for Items, Bars as Dividers" lead="Each cup becomes a row of 3 stars and 2 bars: V | C | S" lesson={SESSION}>
        <div className="w-full space-y-2">
          {[
            ['VVC', '**|*|'],
            ['VCS', '*|*|*'],
            ['SSS', '||***'],
            ['CCS', '|**|*'],
          ].map(([cup, c]) => (
            <Step key={cup}>
              <div className="flex w-fit items-center gap-5 rounded-card border border-line bg-white px-4 py-2 shadow-card-soft">
                <Cup scoops={cup} label={false} />
                <span className="w-16 font-heading text-[20px] font-semibold" style={{ color: colors.ink }}>
                  {cup}
                </span>
                <Op>⟶</Op>
                <StarBar code={c} size={28} />
              </div>
            </Step>
          ))}
        </div>
      </ContentSlide>
    ),
    notes: '"Ask a learner to decode | ★ | ★★: 0 vanilla, 1 chocolate, 2 strawberry, the cup CSS." Stars before the first bar are V, between the bars C, after the second bar S.',
  },
  {
    id: 'c4-match',
    section: C4,
    label: 'A Perfect Match',
    element: (
      <ContentSlide kicker={C4} title="A Perfect Match" lead="Every cup gives one row, and every row gives one cup" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="flex w-fit items-center gap-3">
            {['★', '|', '★', '★', '|'].map((s, i) => (
              <span key={i} className="flex flex-col items-center">
                <span className="grid h-16 w-16 place-items-center rounded-lg border-2 border-dashed text-[30px]" style={{ borderColor: s === '★' ? '#D97706' : colors.ink, color: s === '★' ? '#D97706' : colors.ink }}>
                  {s}
                </span>
                <span className="text-[17px]" style={{ color: colors.ink }}>
                  {i + 1}
                </span>
              </span>
            ))}
          </div>
          <Steps
            items={[
              ['A row has 3 + 2 = 5 positions'],
              ['Choose which 3 positions hold stars; the rest are bars', '5C3'],
              ['Number of cups = number of rows', '10 ✓'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"This one-to-one matching is a bijection. Counting the codes counts the cups." It matches the list of 10 cups.',
  },
  {
    id: 'c4-formula',
    section: C4,
    label: 'The Stars and Bars Formula',
    element: (
      <ContentSlide kicker={C4} title="The Stars and Bars Formula" lead="r-combinations with repetition from n types" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="w-fit">
            <div className="flex items-center gap-1">
              <span className="rounded-lg px-3 py-2 font-heading text-[20px] font-semibold" style={{ background: '#FEF3C7', color: '#92400E' }}>
                r stars ★★★…
              </span>
              <span className="rounded-lg px-3 py-2 font-heading text-[20px] font-semibold text-white" style={{ background: colors.ink }}>
                n − 1 bars | | …
              </span>
            </div>
            <span className="mt-1 block border-t-4 pt-1 text-center text-[18px] font-semibold" style={{ borderColor: colors.brand, color: colors.brandDark }}>
              n + r − 1 positions
            </span>
          </div>
          <Step>
            <span className="inline-block rounded-xl px-6 py-3 font-heading text-[34px] font-semibold" style={{ background: `${TONE.ok}18`, color: colors.ink, boxShadow: `inset 0 0 0 2px ${TONE.ok}` }}>
              C(n + r − 1, r)
            </span>
          </Step>
          <Step>
            <Txt>Check: 3 scoops from 3 flavours, n = 3, r = 3: C(5, 3) = 10 ✓</Txt>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Common error: using n bars instead of n − 1. Three bins need only two dividers. Draw three bins to show it."',
  },
  {
    id: 'c4-doughnuts',
    section: C4,
    label: 'A Box of Doughnuts',
    element: (
      <ContentSlide kicker={C4} title="A Box of Doughnuts" lead="4 kinds of doughnuts; a box of 6" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="flex w-fit items-center gap-2 rounded-xl px-3 py-2" style={{ background: '#FDE68A' }}>
            {['#F472B6', '#F472B6', '#7C4A2D', '#22C55E', '#22C55E', '#22C55E'].map((c, i) => (
              <span key={i} className="grid h-12 w-12 place-items-center rounded-full" style={{ background: c }}>
                <span className="h-3 w-3 rounded-full bg-white" />
              </span>
            ))}
          </div>
          <div className="flex w-fit items-center gap-4">
            <StarBar code="**|*||***" />
            <Txt>2 of kind 1, 1 of kind 2, none of kind 3, 3 of kind 4</Txt>
          </div>
          <Steps
            items={[
              ['Order in the box does not matter; kinds can repeat'],
              ['n = 4 kinds (3 bars), r = 6 doughnuts (6 stars)'],
              ['C(9, 6) = (9 × 8 × 7) / (3 × 2 × 1)', '84'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"Compute 9C6 by cancelling: (9 × 8 × 7) / (3 × 2 × 1) = 84."',
  },
  {
    id: 'c4-practice',
    section: C4,
    label: 'Find n and r First',
    element: (
      <ContentSlide kicker={C4} title="Find n and r First" lead="n is the number of types, r the number of items chosen" lesson={SESSION}>
        <div className="w-full space-y-3">
          <RevealTable
            columns={[{ label: 'Selection', weight: 1.6 }, { label: 'n, r', weight: 0.6 }, { label: 'Formula', weight: 0.8 }, { label: 'Answer', weight: 0.6 }]}
            rows={[
              ['3 scoops from 5 flavours', '5, 3', 'C(7, 3)', '35'],
              ['5 fruits from 3 kinds', '3, 5', 'C(7, 5)', '21'],
              ['10 coins from 4 denominations', '4, 10', 'C(13, 10)', '286'],
              ['3 pens from 4 colours', '4, 3', 'C(6, 3)', '20'],
            ]}
          />
          <div className="flex w-fit items-center gap-3">
            <Label>Row 1 as a code</Label>
            <StarBar code="*|*||*|" size={24} />
            <Txt>3 stars, 4 bars</Txt>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"Remind learners: n is the number of types, r is the number of items chosen. Mixing them up is the most common error."',
  },
  {
    id: 'c4-wrong',
    section: C4,
    label: 'Why Not nʳ or nCr?',
    element: (
      <ContentSlide kicker={C4} title="Why Not nʳ or nCr?" lead="3 scoops from 3 flavours: three formulas, one right" lesson={SESSION}>
        <div className="grid w-full grid-cols-3 gap-4">
          {[
            ['nʳ = 3³', '27', 'Ordered scoops: VVC ≠ VCV', 'bad'],
            ['nCr = 3C3', '1', 'Only cups with 3 different flavours', 'bad'],
            ['C(n + r − 1, r) = C(5, 3)', '10', 'Any flavours, order ignored', 'ok'],
          ].map(([f, v, what, t]) => (
            <Step key={f}>
              <Card tone={t as Tone} className="h-full">
                <span className="font-heading text-[26px] font-semibold" style={{ color: TONE[t as Tone] }}>
                  {t === 'ok' ? '✓' : '✗'}
                </span>
                <Big>{f}</Big>
                <Big className="text-[30px]">{v}</Big>
                <Txt>{what}</Txt>
              </Card>
            </Step>
          ))}
        </div>
      </ContentSlide>
    ),
    notes: '"Exam hook: when stuck, check the formula against a small case you can list. That is how we caught the error here."',
  },

  /* ── CONCEPT 5 ───────────────────────────────────────────────────────── */
  { id: 'c5-divider', section: C5, label: 'Divider', element: <SectionBreakerSlide index={5} title={C5} lesson={SESSION} /> },
  {
    id: 'c5-chocolates',
    section: C5,
    label: 'Identical Chocolates, Different Children',
    element: (
      <ContentSlide kicker={C5} title="Identical Chocolates, Different Children" lead="Think First: 7 identical chocolates for Ravi, Sita and Tara; a child may get none" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="flex w-fit items-end gap-2">
            {[
              ['Ravi', 3],
              ['Sita', 1],
              ['Tara', 3],
            ].map(([n, k], i) => (
              <span key={n as string} className="flex items-end gap-2">
                <span className="flex flex-col items-center">
                  <span className="flex h-12 items-end gap-0.5 text-[24px]" style={{ color: '#7C4A2D' }}>
                    {'★'.repeat(k as number)}
                  </span>
                  <span className="h-8 w-28 rounded-b-full" style={{ background: '#E2E8F0' }} />
                  <span className="text-[18px] font-semibold" style={{ color: colors.ink }}>
                    {n as string} {k as number}
                  </span>
                </span>
                {i < 2 && <span className="mb-6 h-20 w-[5px] rounded" style={{ background: colors.ink }} />}
              </span>
            ))}
          </div>
          <Steps
            items={[
              ['Identical chocolates: only how many each child gets matters'],
              ['Each sharing is a row of 7 stars and 2 bars'],
              ['C(3 + 7 − 1, 7) = C(9, 7)', '36'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"Point out that sharing identical objects among n people is the same as choosing r items from n types: each child plays the role of a type."',
  },
  {
    id: 'c5-stories',
    section: C5,
    label: 'Two Stories, One Count',
    element: (
      <ContentSlide kicker={C5} title="Two Stories, One Count" lead="n = types or boxes, r = identical objects" lesson={SESSION}>
        <div className="w-full space-y-2">
          {[
            ['Choose 7 sweets from 3 types', 'Share 7 identical sweets among 3 children', 'C(9, 7) = 36'],
            ['Choose 3 scoops from 3 flavours', 'Put 3 identical balls into 3 boxes', 'C(5, 3) = 10'],
            ['Choose 6 doughnuts from 4 kinds', 'Give 6 identical coupons to 4 teams', 'C(9, 6) = 84'],
          ].map(([a, b, c]) => (
            <Step key={a}>
              <div className="grid grid-cols-[1fr_40px_1fr_170px] items-center gap-3 rounded-card border border-line bg-white px-4 py-2 shadow-card-soft">
                <span className="text-[18px]" style={{ color: colors.ink }}>
                  {a}
                </span>
                <span className="text-[24px] font-semibold" style={{ color: colors.brand }}>
                  ⇄
                </span>
                <span className="text-[18px]" style={{ color: colors.ink }}>
                  {b}
                </span>
                <span className="font-heading text-[20px] font-semibold" style={{ color: TONE.ok }}>
                  {c}
                </span>
              </div>
            </Step>
          ))}
        </div>
      </ContentSlide>
    ),
    notes: '"Learners should be able to retell any distribution problem as a selection problem and back again."',
  },
  {
    id: 'c5-one-each',
    section: C5,
    label: 'No Child Left Out',
    element: (
      <ContentSlide kicker={C5} title="No Child Left Out" lead="7 identical chocolates, each child gets at least one" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="flex w-fit items-end gap-4">
            {['Ravi', 'Sita', 'Tara'].map((n) => (
              <span key={n} className="flex flex-col items-center">
                <span className="text-[24px]" style={{ color: TONE.grey }}>
                  ★
                </span>
                <span className="h-8 w-24 rounded-b-full" style={{ background: '#E2E8F0' }} />
                <span className="text-[17px] font-semibold" style={{ color: colors.ink }}>
                  {n}
                </span>
              </span>
            ))}
            <span className="ml-4 text-[28px]" style={{ color: '#7C4A2D' }}>
              ★★★★
            </span>
            <span className="text-[18px] font-semibold" style={{ color: colors.ink }}>
              4 left
            </span>
          </div>
          <Steps
            items={[
              ['Give 1 chocolate to each child (1 way: they are identical)', '4 left'],
              ['Share the 4 freely: 4 stars, 2 bars, C(6, 4)', '15'],
            ]}
          />
          <Step>
            <Txt>Compare: 36 when a child may get none</Txt>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"This give one each first trick turns an at least one distribution into a free distribution. Compare with 36 when children may get none."',
  },
  {
    id: 'c5-identical',
    section: C5,
    label: 'Identical or Different Objects?',
    element: (
      <ContentSlide kicker={C5} title="Identical or Different Objects?" lead="5 balls into 3 different boxes, empty boxes allowed" lesson={SESSION}>
        <div className="grid w-full grid-cols-2 gap-5">
          <Step>
            <Card className="h-full">
              <Label>5 different balls</Label>
              <div className="my-2 flex gap-2">
                {[1, 2, 3, 4, 5].map((b) => (
                  <span key={b} className="grid h-11 w-11 place-items-center rounded-full font-heading text-[18px] font-semibold text-white" style={{ background: colors.brand }}>
                    {b}
                  </span>
                ))}
              </div>
              <Txt>Which box each ball goes to: each ball picks one of 3</Txt>
              <Big className="mt-1 text-[28px]">3⁵ = 243</Big>
            </Card>
          </Step>
          <Step>
            <Card className="h-full">
              <Label>5 identical balls</Label>
              <div className="my-2">
                <StarBar code="**|*|**" size={26} />
              </div>
              <Txt>How many balls in each box: 5 stars, 2 bars</Txt>
              <Big className="mt-1 text-[28px]">C(7, 5) = 21</Big>
            </Card>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Exam hook: read carefully whether the objects are identical or distinct. It changes the method completely."',
  },
  {
    id: 'c5-practice',
    section: C5,
    label: 'Stars, Bars and One-Each-First',
    element: (
      <ContentSlide kicker={C5} title="Stars, Bars and One-Each-First" lead="Say identical or different first, then pick the method" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Problem', weight: 2.2 }, { label: 'Working', weight: 0.8 }, { label: 'Answer', weight: 0.5 }]}
          rows={[
            ['10 identical marbles into 4 boxes', 'C(13, 10)', '286'],
            ['6 identical pencils among 3 students', 'C(8, 6)', '28'],
            ['6 identical pencils among 3 students, each at least one', 'C(5, 3)', '10'],
            ['4 different toys among 3 children', '3⁴', '81'],
            ['8 identical apples among 2 people', 'C(9, 8)', '9'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"Check the last row by listing: (0, 8), (1, 7), …, (8, 0) gives 9 ways, matching the formula."',
  },

  /* ── CONCEPT 6 ───────────────────────────────────────────────────────── */
  { id: 'c6-divider', section: C6, label: 'Divider', element: <SectionBreakerSlide index={6} title={C6} lesson={SESSION} /> },
  {
    id: 'c6-grid',
    section: C6,
    label: 'All Four Kinds of Counting',
    element: (
      <ContentSlide kicker={C6} title="All Four Kinds of Counting" lead="Choosing r from n; example n = 3, r = 2 from a, b, c" lesson={SESSION}>
        <Grid
          cells={[
            <span>
              <Big>nPr = n! / (n − r)!</Big>
              <Txt className="text-[17px]">ab, ba, ac, ca, bc, cb: 6</Txt>
            </span>,
            <span>
              <Big>nʳ</Big>
              <Txt className="text-[17px]">the 6, plus aa, bb, cc: 9</Txt>
            </span>,
            <span>
              <Big>nCr = n! / (r! (n − r)!)</Big>
              <Txt className="text-[17px]">ab, ac, bc: 3</Txt>
            </span>,
            <span>
              <Big>C(n + r − 1, r)</Big>
              <Txt className="text-[17px]">ab, ac, bc, aa, bb, cc: 6</Txt>
            </span>,
          ]}
        />
      </ContentSlide>
    ),
    notes: '"This is the summary of the whole counting module so far. Ask learners to copy the grid into their notes."',
  },
  {
    id: 'c6-fruit',
    section: C6,
    label: 'A Fruit Stall',
    element: (
      <ContentSlide kicker={C6} title="A Fruit Stall" lead="5 kinds of fruit, plenty of each. Choose 3" lesson={SESSION}>
        <RevealTable
          keep={1}
          columns={[{ label: 'Question', weight: 2 }, { label: 'Cell', weight: 1.2 }, { label: 'Answer', weight: 0.8 }]}
          rows={[
            ['3 different kinds, given to 3 friends in order', 'Order, no repetition', '5P3 = 60'],
            ['3 fruits, kinds may repeat, given to 3 friends in order', 'Order, repetition', '5³ = 125'],
            ['A bag of 3 different kinds', 'No order, no repetition', '5C3 = 10'],
            ['A bag of 3 fruits, kinds may repeat', 'No order, repetition', 'C(7, 3) = 35'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"Change one word in the question and the cell changes. Ask learners to identify which word moves it."',
  },
  {
    id: 'c6-mistakes',
    section: C6,
    label: 'Avoid These Errors',
    element: (
      <ContentSlide kicker={C6} title="Avoid These Errors" lead="Red: the wrong working. Green: the fix" lesson={SESSION}>
        <div className="w-full space-y-2">
          {[
            ['Base and power swapped', '5 letters into 3 boxes: 5³', '3⁵ = 243'],
            ['nʳ when order does not matter', '3 scoops from 3 flavours: 3³ = 27', 'C(5, 3) = 10'],
            ['n bars instead of n − 1', '6 doughnuts from 4 kinds: C(10, 6)', 'C(9, 6) = 84'],
            ['Identical objects treated as different', '5 identical balls into 3 boxes: 3⁵', 'C(7, 5) = 21'],
            ['Forgetting "at least one"', '7 chocolates, each child ≥ 1: C(9, 7)', 'C(6, 4) = 15'],
          ].map(([m, w, f]) => (
            <Step key={m}>
              <div className="grid grid-cols-[1fr_1.3fr_0.7fr] items-center gap-3 rounded-card border border-line bg-white px-4 py-2 shadow-card-soft">
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
    notes: '"Ask learners which question avoids each mistake: who picks, does order matter, how many dividers, identical or different, any minimum?"',
  },
  {
    id: 'c6-computing',
    section: C6,
    label: 'Where Programmers Meet These Counts',
    element: (
      <ContentSlide kicker={C6} title="Where Programmers Meet These Counts" lead="Strings, loops and resources" lesson={SESSION}>
        <div className="grid w-full grid-cols-2 gap-3">
          {[
            ['Bit string', 'Strings of length 8 over {0, 1}', 'Order, repetition', '2⁸ = 256'],
            ['Server rack', 'Assigning 6 tasks to 4 servers', 'Order, repetition', '4⁶ = 4,096'],
            ['Nested loops', 'Triples i ≤ j ≤ k with values 1 to 4', 'No order, repetition', 'C(6, 3) = 20'],
            ['Load balancer', '10 identical requests among 3 servers', 'No order, repetition', 'C(12, 10) = 66'],
          ].map(([icon, s, kind, c]) => (
            <Step key={icon}>
              <div className="rounded-2xl border border-line bg-white px-4 py-3 shadow-card-soft">
                <span className="inline-block rounded-md px-2 py-0.5 font-mono text-[16px] font-semibold text-white" style={{ background: colors.ink }}>
                  {icon}
                </span>
                <Txt className="mt-1">{s}</Txt>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-[17px]" style={{ color: TONE.grey }}>
                    {kind}
                  </span>
                  <span className="font-heading text-[22px] font-semibold" style={{ color: TONE.ok }}>
                    {c}
                  </span>
                </div>
              </div>
            </Step>
          ))}
        </div>
      </ContentSlide>
    ),
    notes: '"The loop row is a nice surprise: choosing i ≤ j ≤ k from 1 to 4 is choosing 3 values with repetition, order fixed by sorting. Check a small case: i ≤ j from 1 to 2 gives (1,1), (1,2), (2,2) = C(3, 2) = 3."',
  },

  /* ── CLOSING ────────────────────────────────────────────────────────── */
  { id: 'quiz-2', section: 'Closing', label: 'Quiz Time', element: <QuizTimeSlide lesson={SESSION} /> },
  { id: 'takeaways', section: 'Closing', label: 'Key Takeaways', element: <KeyTakeawaysSlide title={SESSION} lesson={SESSION} points={AGENDA} /> },
  { id: 'feedback', section: 'Closing', label: 'Feedback', element: <FeedbackSlide lesson={SESSION} formless />, notes: 'No form and no QR (content rule 41 as amended 2026-11-21). Ask for feedback out loud.' },
  { id: 'thank-you', section: 'Closing', label: 'Thank you', element: <ThankYouSlide title="Thank You" lesson={SESSION} /> },
  { id: 'all-the-best', section: 'Closing', label: 'All the best', element: <ThankYouSlide title="All the Best" lesson={SESSION} /> },
]
