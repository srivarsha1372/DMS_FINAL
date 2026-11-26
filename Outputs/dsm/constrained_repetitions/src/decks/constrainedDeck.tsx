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
 * ENUMERATING PERMUTATION WITH CONSTRAINED REPETITIONS (DSM, Elementary Combinatorics).
 *
 * Built from the signed-off plan at
 *   Outputs/dsm/session_plans/constrained_repetitions/plan.md
 * (46 slides, one per TR slide). Every count was recomputed by brute force in
 * `verify_tr.py`. No cross-session phrases (user rule, 2026-11-26).
 * Visuals are DOM figures, never SVG text.
 */

const SESSION = 'Enumerating Permutation with Constrained Repetitions'
const C1 = 'Arranging Objects That Are Not All Different'
const C2 = 'The Multiset Formula'
const C3 = 'Circular Permutations'
const C4 = 'Restrictions on Positions'
const C5 = 'Together and Not Together'
const C6 = 'Putting It All Together'
const AGENDA = [C1, C2, C3, C4, C5, C6]

export const constrainedMeta: DeckMeta = {
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
const LETTER_COLOURS = ['#2D63FB', '#DB2777', '#16A34A', '#D97706', '#7C3AED', '#0891B2']

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

/** Letter tiles; letters with a colour map are coloured by letter. */
function Tiles({ word, colourBy = true, small = false }: { word: string; colourBy?: boolean; small?: boolean }) {
  const letters = Array.from(new Set(word.replace(/[^A-Za-z]/g, '').split('')))
  return (
    <span className="inline-flex flex-wrap gap-1.5">
      {word.split(' ').filter(Boolean).map((t, i) => {
        const base = t.replace(/[₁₂₃]/g, '')
        const c = colourBy ? LETTER_COLOURS[letters.indexOf(base[0]) % LETTER_COLOURS.length] : colors.brand
        return (
          <span key={i} className={`grid place-items-center rounded-lg font-heading font-semibold text-white ${small ? 'h-10 min-w-[40px] px-1 text-[18px]' : 'h-12 min-w-[48px] px-1.5 text-[22px]'}`} style={{ background: c }}>
            {t}
          </span>
        )
      })}
    </span>
  )
}

/** Slots: each value in a dashed box; `lock` marks indices fixed first. */
function Slots({ values, lock = [], tint }: { values: (string | number)[]; lock?: number[]; tint?: Record<number, string> }) {
  return (
    <div className="flex w-fit items-center gap-2">
      {values.map((v, i) => {
        const locked = lock.includes(i)
        const t = tint?.[i]
        return (
          <span
            key={i}
            className="grid h-14 min-w-[56px] place-items-center rounded-lg border-2 px-2 font-heading text-[22px] font-semibold"
            style={{ borderStyle: locked ? 'solid' : 'dashed', borderColor: locked ? TONE.warn : t ?? colors.brand, background: locked ? '#FEF3C7' : t ? `${t}18` : '#fff', color: colors.ink }}
          >
            {v}
          </span>
        )
      })}
    </div>
  )
}

/** People around a round table: labels placed on a circle as DOM elements. */
function RoundTable({ seats, size = 190, fixed, double, label }: { seats: string[]; size?: number; fixed?: number; double?: number; label?: ReactNode }) {
  const r = size / 2 - 26
  /* The table stops 4px inside the seats (a seat is 38px tall), so no seat label sits on it. */
  const tableR = r - 19 - (double !== undefined ? 14 : 4)
  return (
    <span className="inline-flex flex-col items-center">
      <span className="relative inline-block" style={{ width: size, height: size }}>
        <span className="absolute rounded-full" style={{ left: size / 2 - tableR, top: size / 2 - tableR, width: tableR * 2, height: tableR * 2, background: '#E7D3B1', boxShadow: 'inset 0 0 0 3px #B08A57' }} />
        {seats.map((s, i) => {
          const a = (i / seats.length) * Math.PI * 2 - Math.PI / 2
          const x = size / 2 + r * Math.cos(a)
          const y = size / 2 + r * Math.sin(a)
          const isFixed = fixed === i
          const isDouble = double === i
          return (
            <span
              key={i}
              className="absolute grid place-items-center rounded-full font-heading text-[17px] font-semibold text-white"
              style={{ left: x - (isDouble ? 26 : 19), top: y - 19, width: isDouble ? 52 : 38, height: 38, background: isFixed ? TONE.warn : isDouble ? '#DB2777' : colors.brand }}
            >
              {s}
            </span>
          )
        })}
      </span>
      {label && (
        <span className="mt-1 text-[17px] font-semibold" style={{ color: colors.ink }}>
          {label}
        </span>
      )}
    </span>
  )
}

/** Gap markers around a row of items, with chosen gaps filled. */
function Gaps({ items, filled, itemColor = colors.brand, fillColor = '#DB2777', fillLabel = 'G' }: { items: string[]; filled: number[]; itemColor?: string; fillColor?: string; fillLabel?: string }) {
  const cells: ReactNode[] = []
  for (let g = 0; g <= items.length; g++) {
    const on = filled.includes(g)
    cells.push(
      <span key={`g${g}`} className="grid h-12 w-11 place-items-center rounded-md border-2 border-dashed font-heading text-[18px] font-semibold" style={{ borderColor: on ? fillColor : colors.line, background: on ? `${fillColor}22` : '#fff', color: on ? fillColor : TONE.grey }}>
        {on ? fillLabel : '^'}
      </span>,
    )
    if (g < items.length)
      cells.push(
        <span key={`i${g}`} className="grid h-12 w-12 place-items-center rounded-lg font-heading text-[20px] font-semibold text-white" style={{ background: itemColor }}>
          {items[g]}
        </span>,
      )
  }
  return <div className="flex w-fit items-center gap-1.5">{cells}</div>
}

/* ── the deck ───────────────────────────────────────────────────────────── */

export const constrainedDeck: SlideDef[] = [
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
          { title: C1, sub: 'Why repeated objects reduce the count' },
          { title: C2, sub: 'n! / (n₁! n₂! … nₖ!)' },
          { title: C3, sub: 'Around a circle: (n − 1)!' },
          { title: C4, sub: 'Fill the restricted positions first' },
          { title: C5, sub: 'Blocks, the complement and gaps' },
          { title: C6, sub: 'Mixed problems and common mistakes' },
        ]}
      />
    ),
  },

  /* ── CONCEPT 1 ───────────────────────────────────────────────────────── */
  { id: 'c1-divider', section: C1, label: 'Divider', element: <SectionBreakerSlide index={1} title={C1} lesson={SESSION} /> },
  {
    id: 'c1-book',
    section: C1,
    label: 'Rearranging a Word',
    element: (
      <ContentSlide kicker={C1} title="Rearranging a Word" lead="Think First: how many different words come from rearranging BOOK?" lesson={SESSION}>
        <div className="w-full space-y-4">
          <Tiles word="B O O K" />
          <Step>
            <div className="flex w-fit items-center gap-4">
              <Tiles word="B O₁ O₂ K" />
              <Op>=</Op>
              <Tiles word="B O₂ O₁ K" />
              <span className="rounded-lg px-3 py-1 text-[18px] font-semibold" style={{ background: '#FEF3C7', color: '#92400E' }}>
                same word
              </span>
            </div>
          </Step>
          <Step>
            <Callout kind="warning" title="4! = 24 is a first guess" asStep={false}>
              Swapping the two O's gives the same word, so 24 counts some words more than once
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Collect guesses. Some learners will say 24; ask them to list a few and spot the duplicates."',
  },
  {
    id: 'c1-tags',
    section: C1,
    label: 'Tag the Copies',
    element: (
      <ContentSlide kicker={C1} title="Tag the Copies" lead="Arrangements of A, A, B: pretend the A's are different, then drop the tags" lesson={SESSION}>
        <div className="w-full space-y-3">
          {[
            ['A₁ A₂ B', 'A₂ A₁ B', 'A A B'],
            ['A₁ B A₂', 'A₂ B A₁', 'A B A'],
            ['B A₁ A₂', 'B A₂ A₁', 'B A A'],
          ].map(([x, y, w]) => (
            <Step key={w}>
              <div className="flex w-fit items-center gap-4 rounded-card border border-line bg-white px-4 py-2 shadow-card-soft">
                <Tiles word={x} small />
                <Tiles word={y} small />
                <Op>⟶</Op>
                <Tiles word={w} small />
              </div>
            </Step>
          ))}
          <Step>
            <Txt className="font-semibold">With tags 3! = 6; each word appears 2! = 2 times, so 6 ÷ 2 = 3 words</Txt>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Tagging is the key trick: pretend the copies are different, count, then divide out the swaps that do not change the word."',
  },
  {
    id: 'c1-divide',
    section: C1,
    label: 'Dividing Out the Swaps',
    element: (
      <ContentSlide kicker={C1} title="Dividing Out the Swaps" lead="One factorial for each repeated letter" lesson={SESSION}>
        <div className="grid w-full grid-cols-[320px_1fr] items-center gap-6">
          <div className="flex flex-col items-center gap-1">
            <span className="w-full rounded-t-xl px-4 py-3 text-center font-heading text-[22px] font-semibold text-white" style={{ background: colors.brand }}>
              4! = 24 tagged
            </span>
            <span className="w-[75%] px-3 py-2 text-center font-heading text-[20px] font-semibold" style={{ background: '#FEF3C7', color: '#92400E' }}>
              ÷ 2! (swap the O's)
            </span>
            <span className="w-[50%] rounded-b-xl px-3 py-3 text-center font-heading text-[22px] font-semibold text-white" style={{ background: TONE.ok }}>
              12 words
            </span>
          </div>
          <Steps
            items={[
              ['Pretend all copies are different', 'n!'],
              ['Copies of a letter swap without changing the word'],
              ['A letter appearing k times swaps in k! ways', '÷ k!'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"This is the same divide out the overcount idea we used to go from nPr to nCr." BOOK: 4! / 2! = 24 / 2 = 12 words.',
  },

  /* ── CONCEPT 2 ───────────────────────────────────────────────────────── */
  { id: 'c2-divider', section: C2, label: 'Divider', element: <SectionBreakerSlide index={2} title={C2} lesson={SESSION} /> },
  {
    id: 'c2-formula',
    section: C2,
    label: 'The Formula',
    element: (
      <ContentSlide kicker={C2} title="The Formula" lead="A multiset is a collection in which objects may repeat" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="flex w-fit items-end gap-4">
            {[
              ['n₁', 3, LETTER_COLOURS[0]],
              ['n₂', 2, LETTER_COLOURS[1]],
              ['…', 1, TONE.grey],
              ['nₖ', 2, LETTER_COLOURS[2]],
            ].map(([l, k, c]) => (
              <span key={l as string} className="flex flex-col items-center gap-1">
                <span className="flex gap-1">
                  {Array.from({ length: k as number }, (_, i) => (
                    <span key={i} className="h-10 w-10 rounded-lg" style={{ background: c as string }} />
                  ))}
                </span>
                <span className="font-heading text-[19px] font-semibold" style={{ color: c as string }}>
                  {l as string}
                </span>
              </span>
            ))}
          </div>
          <Step>
            <span className="inline-block rounded-xl px-6 py-3 font-heading text-[32px] font-semibold" style={{ background: `${TONE.ok}18`, color: colors.ink, boxShadow: `inset 0 0 0 2px ${TONE.ok}` }}>
              n! / (<span style={{ color: LETTER_COLOURS[0] }}>n₁!</span> × <span style={{ color: LETTER_COLOURS[1] }}>n₂!</span> × … × <span style={{ color: LETTER_COLOURS[2] }}>nₖ!</span>)
            </span>
          </Step>
          <Step>
            <Txt>n₁ + n₂ + … + nₖ = n. Objects of one type are identical; a type that appears once gives 1! = 1</Txt>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Exam hook: always write the letter counts first, for example B: 1, A: 3, N: 2, then the formula. It earns method marks and prevents mistakes."',
  },
  {
    id: 'c2-banana',
    section: C2,
    label: 'Rearranging BANANA',
    element: (
      <ContentSlide kicker={C2} title="Rearranging BANANA" lead="Count each letter first" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="flex w-fit items-end gap-6">
            {[
              ['B', 1],
              ['A A A', 3],
              ['N N', 2],
            ].map(([t, n]) => (
              <span key={t as string} className="flex flex-col items-center gap-1">
                <Tiles word={t as string} />
                <span className="text-[18px] font-semibold" style={{ color: colors.ink }}>
                  {n as number}
                </span>
              </span>
            ))}
            <span className="text-[18px] font-semibold" style={{ color: colors.brandDark }}>
              total 6
            </span>
          </div>
          <Step>
            <Total>6! / (3! × 2!) = 720 / 12 = 60</Total>
          </Step>
          <Step>
            <Card tone="warn" className="w-fit">
              <Label tone="warn">Try it: LETTER</Label>
              <Txt>L 1, E 2, T 2, R 1 (6 letters): 6! / (2! × 2!) = 720 / 4 = 180</Txt>
            </Card>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Ask learners to check the counts add up to the total number of letters. That simple check catches most errors."',
  },
  {
    id: 'c2-mississippi',
    section: C2,
    label: 'MISSISSIPPI',
    element: (
      <ContentSlide kicker={C2} title="MISSISSIPPI" lead="The formula saves a huge amount of listing" lesson={SESSION}>
        <div className="w-full space-y-4">
          <Tiles word="M I S S I S S I P P I" small />
          <div className="flex w-fit items-center gap-3">
            {[
              ['M', 1],
              ['I', 4],
              ['S', 4],
              ['P', 2],
            ].map(([l, n]) => (
              <span key={l as string} className="rounded-lg border border-line bg-white px-3 py-1 text-[19px] font-semibold" style={{ color: colors.ink }}>
                {l as string}: {n as number}
              </span>
            ))}
            <span className="text-[19px] font-semibold" style={{ color: colors.brandDark }}>
              total 11
            </span>
          </div>
          <Step>
            <div className="flex w-fit items-center gap-3">
              <span className="font-heading text-[24px] font-semibold" style={{ color: TONE.grey }}>
                11! = 39,916,800
              </span>
              <Op>⟶</Op>
              <span className="text-[18px] font-semibold" style={{ color: colors.brandDark }}>
                ÷ 4! 4! 2! = ÷ 1,152
              </span>
              <Op>⟶</Op>
              <Total label="">34,650</Total>
            </div>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Encourage cancelling: 11! / (4! × 4! × 2!) = (11 × 10 × 9 × 8 × 7 × 6 × 5) / (24 × 2) = 34,650."',
  },
  {
    id: 'c2-everywhere',
    section: C2,
    label: 'Repeated Objects Everywhere',
    element: (
      <ContentSlide kicker={C2} title="Repeated Objects Everywhere" lead="Flags, bit strings, books: the same formula" lesson={SESSION}>
        <div className="w-full space-y-3">
          {[
            ['3 red, 2 green, 1 blue flag', ['#DC2626', '#DC2626', '#DC2626', '#16A34A', '#16A34A', '#2D63FB'], '6! / (3! 2!) = 60'],
            ['Bit strings of length 7 with three 1s', 'bits', '7! / (3! 4!) = 35'],
            ['4 identical maths, 3 identical physics books', ['#2D63FB', '#2D63FB', '#2D63FB', '#2D63FB', '#D97706', '#D97706', '#D97706'], '7! / (4! 3!) = 35'],
          ].map(([name, pic, ans]) => (
            <Step key={name as string}>
              <div className="grid grid-cols-[1.2fr_1fr_0.8fr] items-center gap-4 rounded-card border border-line bg-white px-4 py-2 shadow-card-soft">
                <span className="text-[19px] font-semibold" style={{ color: colors.ink }}>
                  {name as string}
                </span>
                <span className="flex gap-1">
                  {pic === 'bits'
                    ? '1011000'.split('').map((b, i) => (
                        <span key={i} className="grid h-9 w-8 place-items-center rounded font-mono text-[18px] font-semibold" style={{ background: b === '1' ? '#FDE68A' : '#F1F5F9', color: colors.ink }}>
                          {b}
                        </span>
                      ))
                    : (pic as string[]).map((c, i) => <span key={i} className="h-9 w-6 rounded-sm" style={{ background: c }} />)}
                </span>
                <span className="font-heading text-[20px] font-semibold" style={{ color: TONE.ok }}>
                  {ans as string}
                </span>
              </div>
            </Step>
          ))}
          <Step>
            <Callout kind="info" title="Two types: this is nCr" asStep={false}>
              n! / (r! (n − r)!) chooses the r positions for one type
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"The link to nCr is worth pausing on: arranging 3 ones and 4 zeros is the same as choosing which 3 of the 7 positions hold a 1."',
  },
  {
    id: 'c2-grid',
    section: C2,
    label: 'Walking on a Grid',
    element: (
      <ContentSlide kicker={C2} title="Walking on a Grid" lead="From (0, 0) to (4, 3), one block Right (R) or Up (U) at a time" lesson={SESSION}>
        <div className="grid w-full grid-cols-[auto_1fr] items-center gap-8">
          <div className="grid gap-0" style={{ gridTemplateColumns: 'repeat(4, 52px)', gridTemplateRows: 'repeat(3, 52px)' }}>
            {Array.from({ length: 12 }, (_, i) => (
              <span key={i} className="border-2" style={{ borderColor: '#94A3B8', background: '#F8FAFC' }} />
            ))}
          </div>
          <div className="space-y-3">
            {[
              ['RRURUUR', colors.brand],
              ['UUURRRR', '#DB2777'],
            ].map(([w, c]) => (
              <Step key={w}>
                <div className="flex w-fit items-center gap-3">
                  <span className="font-mono text-[22px] font-semibold" style={{ color: c }}>
                    {w}
                  </span>
                  <span className="text-[22px]" style={{ color: c }}>
                    {w.replace(/R/g, '→').replace(/U/g, '↑')}
                  </span>
                </div>
              </Step>
            ))}
            <Step>
              <Txt>Every shortest path is an arrangement of R, R, R, R, U, U, U</Txt>
            </Step>
            <Step>
              <Total>7! / (4! × 3!) = 35</Total>
            </Step>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"Ask learners to list paths on a 2 × 1 grid first: RRU, RUR, URR, which is 3! / (2! 1!) = 3."',
  },
  {
    id: 'c2-practice',
    section: C2,
    label: 'Count, Then Divide',
    element: (
      <ContentSlide kicker={C2} title="Count, Then Divide" lead="Write the letter counts, then reveal" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Problem', weight: 2 }, { label: 'Working', weight: 1.1 }, { label: 'Answer', weight: 0.6 }]}
          rows={[
            ['Arrangements of APPLE', '5! / 2!', '60'],
            ['Arrangements of STATISTICS (S 3, T 3, I 2, A 1, C 1)', '10! / (3! 3! 2!)', '50,400'],
            ['Arrangements of the digits 1, 1, 2, 2, 2', '5! / (2! 3!)', '10'],
            ['Shortest grid paths from (0, 0) to (3, 3)', '6! / (3! 3!)', '20'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"STATISTICS is a classic exam word. Make learners count letters carefully: S 3, T 3, I 2, A 1, C 1, totalling 10."',
  },

  /* ── CONCEPT 3 ───────────────────────────────────────────────────────── */
  { id: 'c3-divider', section: C3, label: 'Divider', element: <SectionBreakerSlide index={3} title={C3} lesson={SESSION} /> },
  {
    id: 'c3-round',
    section: C3,
    label: 'A Round Table',
    element: (
      <ContentSlide kicker={C3} title="A Round Table" lead="Think First: A, B, C around a round table; only the order around it matters" lesson={SESSION}>
        <div className="w-full space-y-3">
          <div className="flex w-fit items-center gap-3">
            <RoundTable seats={['A', 'B', 'C']} size={150} label="ABC" />
            <Op>=</Op>
            <RoundTable seats={['B', 'C', 'A']} size={150} label="BCA" />
            <Op>=</Op>
            <RoundTable seats={['C', 'A', 'B']} size={150} label="CAB" />
            <Step>
              <span className="ml-4 inline-flex items-center gap-3">
                <Op>≠</Op>
                <RoundTable seats={['A', 'C', 'B']} size={150} label="ACB: different" />
              </span>
            </Step>
          </div>
          <Step>
            <Txt>
              In a row 3! = 6 orders. Rotations keep everyone's neighbours, so 6 ÷ 3 = <b>2</b> seatings
            </Txt>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Physically rotate three learners around an imaginary table. Each person\'s neighbours stay the same, so the seating has not changed." Read seatings clockwise.',
  },
  {
    id: 'c3-formula',
    section: C3,
    label: 'Fix One Person, Arrange the Rest',
    element: (
      <ContentSlide kicker={C3} title="Fix One Person, Arrange the Rest" lead="n distinct objects in a circle, rotations counted as the same: (n − 1)!" lesson={SESSION}>
        <div className="grid w-full grid-cols-[auto_1fr] items-center gap-8">
          <RoundTable seats={['A', '1', '2', '3', '4', '5']} fixed={0} size={210} label="A fixed as the reference" />
          <div className="space-y-3">
            <Step>
              <Card>
                <Label>Reason 1</Label>
                <Txt>Each circle gives n row orders, one starting at each person: n! / n = (n − 1)!</Txt>
              </Card>
            </Step>
            <Step>
              <Card>
                <Label>Reason 2</Label>
                <Txt>Fix one person; arrange the other n − 1 in the remaining seats</Txt>
                <div className="mt-2">
                  <Slots values={['n − 1', 'n − 2', '…', '1']} />
                </div>
              </Card>
            </Step>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"The fix one person view is the one learners should use for restriction problems later on."',
  },
  {
    id: 'c3-dinner',
    section: C3,
    label: 'Six Guests at Dinner',
    element: (
      <ContentSlide kicker={C3} title="Six Guests at Dinner" lead="6 guests around a round dinner table" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="flex w-fit items-center gap-8">
            <RoundTable seats={['1', '2', '3', '4', '5', '6']} fixed={0} size={200} label="(6 − 1)! = 5! = 120" />
            <span className="flex flex-col items-center gap-2">
              <Slots values={['', '', '', '', '', '']} />
              <span className="text-[17px] font-semibold" style={{ color: colors.ink }}>
                a bench: 6! = 720
              </span>
            </span>
          </div>
          <Step>
            <Card tone="warn" className="w-fit">
              <Label tone="warn">Try it: 8 children stand in a circle</Label>
              <Big>7! = 5,040</Big>
            </Card>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Ask: why is the circular count exactly one sixth of the row count? Each circle corresponds to 6 rows, one starting at each guest."',
  },
  {
    id: 'c3-necklace',
    section: C3,
    label: 'When Flipping Changes Nothing',
    element: (
      <ContentSlide kicker={C3} title="When Flipping Changes Nothing" lead="A necklace of distinct beads: turning it over gives the same necklace" lesson={SESSION}>
        <div className="w-full space-y-3">
          <div className="flex w-fit items-center gap-4">
            <RoundTable seats={['1', '2', '3', '4', '5']} size={160} label="clockwise" />
            <Op>=</Op>
            <RoundTable seats={['1', '5', '4', '3', '2']} size={160} label="flipped over" />
            <Step>
              <span className="ml-4 rounded-xl border-2 px-4 py-3 text-[18px]" style={{ borderColor: colors.line, color: colors.ink }}>
                People at a table cannot be flipped
              </span>
            </Step>
          </div>
          <Step>
            <Total label="Necklace">(n − 1)! / 2</Total>
          </Step>
          <Step>
            <Txt>7 different beads: 6! / 2 = 720 / 2 = 360 (for n ≥ 3)</Txt>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Exam hook: read whether the objects are people at a table (no flipping) or beads on a necklace (flipping allowed). The difference is a factor of 2."',
  },
  {
    id: 'c3-practice',
    section: C3,
    label: 'Row, Circle or Necklace?',
    element: (
      <ContentSlide kicker={C3} title="Row, Circle or Necklace?" lead="Pick the shape first: bench, round table or necklace" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Problem', weight: 2 }, { label: 'Type', weight: 0.7 }, { label: 'Answer', weight: 1 }]}
          rows={[
            ['5 people around a round table', 'Circle', '4! = 24'],
            ['5 people on a bench', 'Row', '5! = 120'],
            ['10 people in a circular dance', 'Circle', '9! = 362,880'],
            ['6 different flowers on a garland', 'Necklace', '5! / 2 = 60'],
            ['4 different keys on a key ring', 'Necklace', '3! / 2 = 3'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"List the key ring case if learners doubt it: with keys A, B, C, D and A fixed, the orders ABCD, ABDC, ACBD and their reverses give exactly 3 different rings."',
  },
  { id: 'quiz-1', section: C3, label: 'Quiz Time', element: <QuizTimeSlide lesson={SESSION} /> },

  /* ── CONCEPT 4 ───────────────────────────────────────────────────────── */
  { id: 'c4-divider', section: C4, label: 'Divider', element: <SectionBreakerSlide index={4} title={C4} lesson={SESSION} /> },
  {
    id: 'c4-rule',
    section: C4,
    label: 'Handle the Rule First',
    element: (
      <ContentSlide kicker={C4} title="Handle the Rule First" lead="Think First: arrangements of MONDAY that start with M" lesson={SESSION}>
        <div className="w-full space-y-4">
          <Slots values={['M', 5, 4, 3, 2, 1]} lock={[0]} />
          <Steps
            items={[
              ['First position fixed: M', '1'],
              ['Remaining 5 letters fill the other 5 positions', '5! = 120'],
              ['Multiply', '120'],
            ]}
          />
          <Step>
            <Callout kind="success" title="Strategy" asStep={false}>
              Fill the restricted positions first, then arrange the rest freely
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"If learners fill the free positions first, the restricted position might be left with no valid choice. Always deal with the rule first."',
  },
  {
    id: 'c4-vowels',
    section: C4,
    label: 'Start and End With a Vowel',
    element: (
      <ContentSlide kicker={C4} title="Start and End With a Vowel" lead="MONDAY with a vowel (O or A) first and last" lesson={SESSION}>
        <div className="w-full space-y-4">
          <Slots values={[2, 4, 3, 2, 1, 1]} tint={{ 0: '#DB2777', 5: '#DB2777' }} />
          <Steps
            items={[
              ['Ends: arrange the 2 vowels (O…A or A…O)', '2'],
              ['Middle: the consonants M, N, D, Y', '4! = 24'],
              ['Multiply', '48'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"Treat Y as a consonant here; say so explicitly, as different textbooks differ. Stating the assumption is good exam practice."',
  },
  {
    id: 'c4-even',
    section: C4,
    label: 'Forming Even Numbers',
    element: (
      <ContentSlide kicker={C4} title="Forming Even Numbers" lead="5-digit numbers using 1, 2, 3, 4, 5 once each; the number must be even" lesson={SESSION}>
        <div className="w-full space-y-4">
          <Slots values={[4, 3, 2, 1, '2 or 4']} lock={[4]} />
          <Steps
            items={[
              ['Last digit 2 or 4 (fill it first)', '2'],
              ['The other 4 digits fill the first 4 positions', '4! = 24'],
              ['Multiply', '48'],
            ]}
          />
          <Step>
            <Card tone="warn" className="w-fit">
              <Label tone="warn">Try it: greater than 40,000</Label>
              <Txt>First digit 4 or 5: 2 × 4! = 48</Txt>
            </Card>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Ask: what if 0 were among the digits? Then the first position would also be restricted. Keep it as a discussion point only."',
  },
  {
    id: 'c4-multiset',
    section: C4,
    label: 'Rules With Repeated Letters',
    element: (
      <ContentSlide kicker={C4} title="Rules With Repeated Letters" lead="Fix first, then use the multiset formula" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="flex w-fit items-center gap-4">
            <Slots values={['B', '', '', '', '', '']} lock={[0]} />
            <Tiles word="A A A N N" small />
          </div>
          <Step>
            <Total label="Begins with B">5! / (3! × 2!) = 10</Total>
          </Step>
          <Step>
            <Card tone="warn" className="w-fit">
              <Label tone="warn">Try it: begins and ends with A</Label>
              <Txt>Fix A at both ends; arrange B, A, N, N in the middle: 4! / 2! = 12</Txt>
            </Card>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"After fixing letters, recount what is left before applying the formula. In the Try it, only one A remains in the middle."',
  },
  {
    id: 'c4-practice',
    section: C4,
    label: 'Restricted Places First',
    element: (
      <ContentSlide kicker={C4} title="Restricted Places First" lead="Sketch the slots, lock the restricted ones, then reveal" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Problem', weight: 2.2 }, { label: 'Working', weight: 0.8 }, { label: 'Answer', weight: 0.5 }]}
          rows={[
            ['Arrangements of PENCIL beginning with P', '5!', '120'],
            ['Arrangements of PENCIL with E and I at the two ends', '2! × 4!', '48'],
            ['4-digit even numbers from 1, 3, 5, 6 (each once)', '1 × 3!', '6'],
            ['Arrangements of LETTER beginning with T', '5! / 2!', '60'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"For LETTER beginning with T: after fixing one T, the remaining L, E, E, T, R have only E repeated, so 5! / 2! = 60."',
  },

  /* ── CONCEPT 5 ───────────────────────────────────────────────────────── */
  { id: 'c5-divider', section: C5, label: 'Divider', element: <SectionBreakerSlide index={5} title={C5} lesson={SESSION} /> },
  {
    id: 'c5-block',
    section: C5,
    label: 'Glue Them Into a Block',
    element: (
      <ContentSlide kicker={C5} title="Glue Them Into a Block" lead="5 people A, B, C, D, E in a row, with A and B together" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="flex w-fit items-center gap-2">
            <span className="rounded-xl border-2 px-3 py-2 font-heading text-[20px] font-semibold" style={{ borderColor: '#DB2777', color: colors.ink }}>
              [A B]
            </span>
            {['C', 'D', 'E'].map((p) => (
              <span key={p} className="grid h-12 w-12 place-items-center rounded-full font-heading text-[20px] font-semibold text-white" style={{ background: colors.brand }}>
                {p}
              </span>
            ))}
            <span className="ml-4 rounded-2xl border-2 px-3 py-2 text-[18px] font-semibold" style={{ borderColor: '#DB2777', color: colors.ink }}>
              zoom: AB, BA
            </span>
          </div>
          <Steps
            items={[
              ['Block [AB] + C, D, E = 4 units', '4! = 24'],
              ['Inside the block', '2! = 2'],
              ['Multiply', '48'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"The block method: units outside, order inside. The new idea comes next: the opposite condition, not together."',
  },
  {
    id: 'c5-complement',
    section: C5,
    label: 'Total Minus Together',
    element: (
      <ContentSlide kicker={C5} title="Total Minus Together" lead="5 people in a row with A and B not next to each other" lesson={SESSION}>
        <div className="grid w-full grid-cols-[1.1fr_1fr] items-center gap-6">
          <div className="flex h-[200px] overflow-hidden rounded-card" style={{ boxShadow: `inset 0 0 0 2px ${colors.brand}` }}>
            <span className="grid flex-[48] place-items-center px-2 text-center text-[19px] font-semibold text-white" style={{ background: '#DB2777' }}>
              Together 48
            </span>
            <span className="grid flex-[72] place-items-center px-2 text-center text-[19px] font-semibold" style={{ background: `${TONE.ok}22`, color: colors.ink }}>
              Not together 72
            </span>
          </div>
          <div className="space-y-3">
            <Steps
              items={[
                ['All arrangements', '5! = 120'],
                ['A and B together', '48'],
                ['Not together', '120 − 48 = 72'],
              ]}
            />
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"This works because every arrangement is either together or not together, never both: the same complement idea as at least one."',
  },
  {
    id: 'c5-gaps',
    section: C5,
    label: 'No Two of Them Side by Side',
    element: (
      <ContentSlide kicker={C5} title="No Two of Them Side by Side" lead="4 boys and 3 girls in a row, no two girls next to each other" lesson={SESSION}>
        <div className="w-full space-y-4">
          <Gaps items={['B', 'B', 'B', 'B']} filled={[0, 2, 4]} />
          <Steps
            items={[
              ['Arrange the 4 boys', '4! = 24'],
              ['The boys create 5 gaps: _ B _ B _ B _ B _'],
              ['Place the 3 girls in 3 different gaps, in order', '5P3 = 60'],
              ['Multiply', '1,440'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"Ask: why 5 gaps for 4 boys? Count the spaces: one before the first boy, three between boys, one after the last boy."',
  },
  {
    id: 'c5-careful',
    section: C5,
    label: 'Read the Condition Carefully',
    element: (
      <ContentSlide kicker={C5} title="Read the Condition Carefully" lead="Arrangements of COMPUTER, vowels O, U, E" lesson={SESSION}>
        <div className="w-full space-y-2">
          {[
            ['All vowels together', 'Block', '6! × 3!', '4,320', 'C M O U E P T R', [2, 3, 4]],
            ['Vowels not all together', 'Complement', '8! − 4,320', '36,000', 'C O U M P E T R', [1, 2, 5]],
            ['No two vowels together', 'Gaps', '5! × 6P3', '14,400', 'O C U M P E T R', [0, 2, 5]],
          ].map(([c, m, w, a, s, v]) => (
            <Step key={c as string}>
              <div className="grid grid-cols-[1.1fr_0.7fr_1.4fr_0.9fr] items-center gap-3 rounded-card border border-line bg-white px-4 py-2 shadow-card-soft">
                <span className="text-[18px] font-semibold" style={{ color: colors.ink }}>
                  {c as string}
                </span>
                <span className="text-[18px]" style={{ color: colors.brandDark }}>
                  {m as string}
                </span>
                <span className="flex gap-1">
                  {(s as string).split(' ').map((l, i) => (
                    <span key={i} className="grid h-8 w-7 place-items-center rounded text-[17px] font-semibold" style={{ background: (v as number[]).includes(i) ? '#DB2777' : '#E2E8F0', color: (v as number[]).includes(i) ? '#fff' : colors.ink }}>
                      {l}
                    </span>
                  ))}
                </span>
                <span className="font-heading text-[19px] font-semibold" style={{ color: TONE.ok }}>
                  {w as string} = {a as string}
                </span>
              </div>
            </Step>
          ))}
          <Step>
            <Callout kind="warning" title="Not the same question" asStep={false}>
              "Not all together" allows two vowels side by side (row 2's example); "no two together" does not
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Exam hook: these two phrases are often confused. The second example string is the deciding case: it counts in row 2 but not in row 3."',
  },
  {
    id: 'c5-banana',
    section: C5,
    label: 'BANANA With Conditions',
    element: (
      <ContentSlide kicker={C5} title="BANANA With Conditions" lead="Combining the methods with identical letters" lesson={SESSION}>
        <div className="w-full space-y-3">
          <Gaps items={['B', 'N', 'N']} filled={[0, 1, 3]} fillColor={LETTER_COLOURS[1]} fillLabel="A" />
          <RevealTable
            keep={1}
            columns={[{ label: 'Condition', weight: 1.1 }, { label: 'Method', weight: 1.7 }, { label: 'Answer', weight: 0.9 }]}
            rows={[
              ['All three A\'s together', 'Block [AAA] + B, N, N', '4! / 2! = 12'],
              ['A\'s not all together', 'Complement', '60 − 12 = 48'],
              ['No two A\'s together', 'Arrange B, N, N; choose 3 of the 4 gaps', '3!/2! × 4C3 = 12'],
            ]}
          />
          <Txt className="font-semibold">The A's are identical, so their gaps are chosen (4C3), not arranged</Txt>
        </div>
      </ContentSlide>
    ),
    notes: '"Compare with the boys and girls: distinct girls are arranged in gaps (nPr); identical A\'s are only chosen (nCr)."',
  },
  {
    id: 'c5-circle',
    section: C5,
    label: 'Blocks Work in Circles Too',
    element: (
      <ContentSlide kicker={C5} title="Blocks Work in Circles Too" lead="6 people at a round table; P and Q together" lesson={SESSION}>
        <div className="grid w-full grid-cols-[1fr_auto] items-center gap-8">
          <Steps
            items={[
              ['5 units around a circle', '(5 − 1)! = 24'],
              ['Inside the block', '2! = 2'],
              ['Together', '48'],
              ['Not together: (6 − 1)! − 48', '120 − 48 = 72'],
            ]}
          />
          <RoundTable seats={['PQ', '1', '2', '3', '4']} double={0} size={210} label="5 units around the circle" />
        </div>
      </ContentSlide>
    ),
    notes: '"The same block and complement ideas apply; only the outer count changes from n! to (n − 1)!."',
  },
  {
    id: 'c5-practice',
    section: C5,
    label: 'Block, Complement or Gaps?',
    element: (
      <ContentSlide kicker={C5} title="Block, Complement or Gaps?" lead="Name the method first, then compute" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Problem', weight: 2 }, { label: 'Method', weight: 0.8 }, { label: 'Answer', weight: 1 }]}
          rows={[
            ['6 people in a row, 2 particular people not together', 'Complement', '720 − 240 = 480'],
            ['5 boys and 3 girls in a row, no two girls together', 'Gaps', '5! × 6P3 = 14,400'],
            ['APPLE with the two P\'s together', 'Block', '4! = 24'],
            ['APPLE with the two P\'s not together', 'Complement', '60 − 24 = 36'],
            ['7 people at a round table, 2 particular people together', 'Circular block', '5! × 2 = 240'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"For APPLE, the block PP is a single unit and its inside has only 1 arrangement, because the P\'s are identical."',
  },

  /* ── CONCEPT 6 ───────────────────────────────────────────────────────── */
  { id: 'c6-divider', section: C6, label: 'Divider', element: <SectionBreakerSlide index={6} title={C6} lesson={SESSION} /> },
  {
    id: 'c6-guide',
    section: C6,
    label: 'A Decision Guide',
    element: (
      <ContentSlide kicker={C6} title="A Decision Guide" lead="Read the problem, pick the tool" lesson={SESSION}>
        <div className="grid w-full grid-cols-2 gap-3">
          {[
            ['Some objects are identical', 'Divide by each repeat count\'s factorial'],
            ['Around a table or circle', '(n − 1)!; divide by 2 more for necklaces'],
            ['A position has a rule', 'Fill the restricted positions first'],
            ['Items must be together', 'Block: units outside × order inside'],
            ['Items must not be together', 'Total − together'],
            ['No two of a kind side by side', 'Gaps: arrange the others, then fill gaps'],
          ].map(([clue, tool]) => (
            <Step key={clue}>
              <div className="flex items-center gap-3 rounded-card border border-line bg-white px-4 py-2.5 shadow-card-soft">
                <span className="text-[18px] font-semibold" style={{ color: colors.ink }}>
                  {clue}
                </span>
                <Op>⟶</Op>
                <span className="text-[18px]" style={{ color: TONE.ok }}>
                  {tool}
                </span>
              </div>
            </Step>
          ))}
        </div>
      </ContentSlide>
    ),
    notes: '"Several clues can appear in one problem. Apply them one at a time, writing each step in words."',
  },
  {
    id: 'c6-balloon',
    section: C6,
    label: 'A Multi-Step Problem',
    element: (
      <ContentSlide kicker={C6} title="A Multi-Step Problem" lead="BALLOON beginning with B, with the two L's together" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="flex w-fit items-center gap-4">
            <Slots values={['B']} lock={[0]} />
            <Tiles word="A LL O O N" />
          </div>
          <Steps
            items={[
              ['Letters: B 1, A 1, L 2, O 2, N 1 (7 letters)'],
              ['Fix B first; remaining A, L, L, O, O, N'],
              ['Glue the L\'s: units A, [LL], O, O, N (5 units, O twice)'],
              ['Block inside: 1 order (identical L\'s)', '5! / 2! = 60'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"Walk through each clue in turn: position rule first, then the block, then divide for the repeated O\'s."',
  },
  {
    id: 'c6-mistakes',
    section: C6,
    label: 'Avoid These Errors',
    element: (
      <ContentSlide kicker={C6} title="Avoid These Errors" lead="Red: the wrong working. Green: the fix" lesson={SESSION}>
        <div className="w-full space-y-2">
          {[
            ['Ignoring repeated letters', 'BANANA: 6! = 720', '6! / (3! 2!) = 60'],
            ['n! for a round table', '6 guests: 6! = 720', '5! = 120'],
            ['Dividing by 2 for people at a table', '6 guests: 5! / 2 = 60', '5! = 120 (people cannot be flipped)'],
            ['"Not all" taken as "no two" together', 'COMPUTER: 14,400', '8! − 4,320 = 36,000'],
            ['Wrong number of gaps', '4 boys give 3 gaps', '4 boys give 5 gaps'],
          ].map(([m, w, f]) => (
            <Step key={m}>
              <div className="grid grid-cols-[1.1fr_1fr_1.2fr] items-center gap-3 rounded-card border border-line bg-white px-4 py-2 shadow-card-soft">
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
    notes: '"Ask learners to name the clue that would have prevented each mistake."',
  },
  {
    id: 'c6-mixed',
    section: C6,
    label: 'Identify the Clues, Then Solve',
    element: (
      <ContentSlide kicker={C6} title="Identify the Clues, Then Solve" lead="List the clues, then reveal" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Problem', weight: 1.6 }, { label: 'Clues', weight: 1.2 }, { label: 'Answer', weight: 1.4 }]}
          rows={[
            ['Arrangements of ENGINEERING', 'E 3, N 3, G 2, I 2, R 1', '11! / (3! 3! 2! 2!) = 277,200'],
            ['8 people at a round table', 'Circle', '7! = 5,040'],
            ['MONDAY ending with Y', 'Position', '5! = 120'],
            ['5 different books, 2 particular not together', 'Complement', '120 − 48 = 72'],
            ['3 boys and 3 girls in a row, no two girls together', 'Gaps', '3! × 4P3 = 144'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"ENGINEERING is a good count-check exercise: 3 + 3 + 2 + 2 + 1 = 11 letters."',
  },
  {
    id: 'c6-computing',
    section: C6,
    label: 'Where Programmers Meet These Counts',
    element: (
      <ContentSlide kicker={C6} title="Where Programmers Meet These Counts" lead="Strings, rings and schedules" lesson={SESSION}>
        <div className="grid w-full grid-cols-2 gap-3">
          {[
            ['String', 'Distinct strings from a, a, b, b, c', 'Multiset', '5! / (2! 2!) = 30'],
            ['Ring network', '5 computers connected in a ring', 'Circle', '4! = 24 orders'],
            ['Task queue', '6 tasks, the backup task last', 'Position', '5! = 120'],
            ['Scheduler', '6 tasks, two conflicting tasks not adjacent', 'Complement', '720 − 240 = 480'],
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
    notes: '"The ring network row assumes the direction of the ring matters (data flows one way). If direction does not matter, divide by 2, like a necklace."',
  },

  /* ── CLOSING ────────────────────────────────────────────────────────── */
  { id: 'quiz-2', section: 'Closing', label: 'Quiz Time', element: <QuizTimeSlide lesson={SESSION} /> },
  { id: 'takeaways', section: 'Closing', label: 'Key Takeaways', element: <KeyTakeawaysSlide title={SESSION} lesson={SESSION} points={AGENDA} /> },
  { id: 'feedback', section: 'Closing', label: 'Feedback', element: <FeedbackSlide lesson={SESSION} formless />, notes: 'No form and no QR (content rule 41 as amended 2026-11-21). Ask for feedback out loud.' },
  { id: 'thank-you', section: 'Closing', label: 'Thank you', element: <ThankYouSlide title="Thank You" lesson={SESSION} /> },
  { id: 'all-the-best', section: 'Closing', label: 'All the best', element: <ThankYouSlide title="All the Best" lesson={SESSION} /> },
]
