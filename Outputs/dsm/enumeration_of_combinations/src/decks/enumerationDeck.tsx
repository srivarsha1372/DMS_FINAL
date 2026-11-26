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
 * ENUMERATION OF COMBINATIONS AND PERMUTATIONS (DSM, Elementary Combinatorics).
 *
 * Built from the signed-off plan at
 *   Outputs/dsm/session_plans/enumeration_of_combinations/plan.md
 * (47 slides, one per TR slide). Every count was recomputed by `verify_tr.py`,
 * by brute force where feasible. Visuals are DOM figures, never SVG text.
 */

const SESSION = 'Enumeration of Combinations and Permutations'
const C1 = 'A Strategy for Counting Problems'
const C2 = 'Select, Then Arrange'
const C3 = 'Items Grouped Together'
const C4 = 'Exactly k of a Type'
const C5 = 'At Least and At Most'
const C6 = 'Putting It All Together'
const AGENDA = [C1, C2, C3, C4, C5, C6]

export const enumerationMeta: DeckMeta = {
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
const GIRL = '#DB2777'
const BOY = colors.brand

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

function Chip({ children, tone = 'brand', big = false }: { children: ReactNode; tone?: Tone | 'plain'; big?: boolean }) {
  const c = tone === 'plain' ? colors.line : TONE[tone]
  return (
    <span
      className={`inline-flex items-center justify-center rounded-xl bg-white px-4 font-heading font-semibold ${big ? 'py-3 text-[24px]' : 'py-2 text-[20px]'}`}
      style={{ color: colors.ink, boxShadow: `inset 0 0 0 2px ${c}` }}
    >
      {children}
    </span>
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

/** Numbered steps that build one per press, each with an optional value on the right. */
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

/** A result box. */
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

/** A basket of n people, the first k lifted out. */
function Basket({ title, n, k, color, formula }: { title: string; n: number; k: number; color: string; formula: string }) {
  return (
    <div className="rounded-b-[36px] border-2 border-t-0 px-4 pb-4 pt-3" style={{ borderColor: color, background: `${color}0A` }}>
      <span className="block font-heading text-[18px] font-semibold" style={{ color }}>
        {title}
      </span>
      <div className="mt-2 flex flex-wrap gap-2">
        {Array.from({ length: n }, (_, i) => (
          <span key={i} className="h-9 w-9 rounded-full" style={{ background: i < k ? color : `${color}33`, transform: i < k ? 'translateY(-6px)' : undefined }} />
        ))}
      </div>
      <span className="mt-2 block font-heading text-[22px] font-semibold" style={{ color: colors.ink }}>
        {formula}
      </span>
    </div>
  )
}

/** Slots with numbers. */
function Slots({ values, wide }: { values: (string | number)[]; wide?: number }) {
  return (
    <div className="flex gap-2">
      {values.map((v, i) => (
        <span
          key={i}
          className="grid h-14 place-items-center rounded-lg border-2 border-dashed font-heading text-[22px] font-semibold"
          style={{ width: i === wide ? 120 : 56, borderColor: i === wide ? GIRL : colors.brand, color: colors.ink, background: i === wide ? `${GIRL}14` : '#fff' }}
        >
          {v}
        </span>
      ))}
    </div>
  )
}

/* ── slide-specific figures ─────────────────────────────────────────────── */

/** C5: tree M1, M2 → three women-pairs each. */
function SmallTree() {
  const pairs = ['W₁ W₂', 'W₁ W₃', 'W₂ W₃']
  return (
    <div className="space-y-3">
      {['M₁', 'M₂'].map((m) => (
        <Step key={m} className="flex items-center gap-3">
          <Chip tone="brand" big>
            {m}
          </Chip>
          <span className="h-[3px] w-8" style={{ background: colors.brandDark }} />
          <div className="flex flex-col gap-1.5">
            {pairs.map((p) => (
              <span key={p} className="rounded-lg px-3 py-1 text-[18px] font-semibold" style={{ background: `${GIRL}14`, color: colors.ink, boxShadow: `inset 0 0 0 1.5px ${GIRL}55` }}>
                {m} {p}
              </span>
            ))}
          </div>
        </Step>
      ))}
    </div>
  )
}

/** C10: six line-ups of A, B, C. */
function LineUps() {
  const rows = ['ABC', 'BAC', 'CAB', 'CBA', 'ACB', 'BCA']
  const k = useBuild(rows.length)
  const together = (s: string) => Math.abs(s.indexOf('A') - s.indexOf('B')) === 1
  return (
    <div className="grid grid-cols-3 gap-3">
      {rows.map((r, i) => {
        const shown = i < k
        const ok = together(r)
        return (
          <div key={r} className="flex items-center gap-1 rounded-xl border border-line bg-white px-3 py-2" style={{ opacity: shown ? (ok ? 1 : 0.4) : 0.15 }}>
            {r.split('').map((ch, j) => {
              const inBand = ok && (ch === 'A' || ch === 'B')
              return (
                <span key={j} className="grid h-11 w-11 place-items-center rounded-full font-heading text-[20px] font-semibold text-white" style={{ background: ch === 'C' ? TONE.grey : colors.brand, boxShadow: inBand && shown ? `0 0 0 4px ${GIRL}` : undefined }}>
                  {ch}
                </span>
              )
            })}
            <span className="ml-2 text-[17px] font-semibold" style={{ color: ok ? TONE.ok : TONE.bad }}>
              {shown ? (ok ? 'together' : 'apart') : ''}
            </span>
          </div>
        )
      })}
    </div>
  )
}

/** C18: bar chart of committees by number of girls. */
function Bars() {
  const data = [6, 60, 120, 60, 6]
  return (
    <div className="flex items-end gap-5">
      {data.map((v, i) => (
        <Step key={i} className="flex flex-col items-center gap-1">
          <span className="font-heading text-[20px] font-semibold" style={{ color: colors.ink }}>
            {v}
          </span>
          <span className="w-[64px] rounded-t-lg" style={{ height: Math.max(6, (v / 120) * 200), background: i === 2 ? GIRL : `${GIRL}88` }} />
          <span className="text-[17px] font-semibold" style={{ color: colors.brandDark }}>
            {i} girls
          </span>
        </Step>
      ))}
    </div>
  )
}

/** C21: number line 0 to 4 with the allowed values shaded. */
function GirlLine({ allowed }: { allowed: number[] }) {
  return (
    <div className="flex gap-1">
      {[0, 1, 2, 3, 4].map((n) => (
        <span
          key={n}
          className="grid h-9 w-10 place-items-center rounded-md text-[18px] font-semibold"
          style={{ background: allowed.includes(n) ? GIRL : `${colors.line}`, color: allowed.includes(n) ? '#fff' : colors.ink }}
        >
          {n}
        </span>
      ))}
    </div>
  )
}

/* ── the deck ───────────────────────────────────────────────────────────── */

export const enumerationDeck: SlideDef[] = [
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
          { title: C1, sub: 'Breaking a problem into steps and cases' },
          { title: C2, sub: 'The product rule with nCr and nPr' },
          { title: C3, sub: 'The block method' },
          { title: C4, sub: 'Selections split by type' },
          { title: C5, sub: 'Adding cases, counting the complement' },
          { title: C6, sub: 'Multi-step problems and common mistakes' },
        ]}
      />
    ),
  },

  /* ── CONCEPT 1 ───────────────────────────────────────────────────────── */
  { id: 'c1-divider', section: C1, label: 'Divider', element: <SectionBreakerSlide index={1} title={C1} lesson={SESSION} /> },
  {
    id: 'c1-mix',
    section: C1,
    label: 'Real Problems Mix Ideas',
    element: (
      <ContentSlide kicker={C1} title="Real Problems Mix Ideas" lead="Think First: 6 boys, 4 girls. A committee of 5 with exactly 2 girls?" lesson={SESSION}>
        <div className="grid w-full grid-cols-[1fr_1.1fr] items-start gap-5">
          <Card>
            <Label>Toolbox</Label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {['Sum rule (+)', 'Product rule (×)', 'nPr', 'nCr'].map((t) => (
                <Chip key={t} tone="plain">
                  {t}
                </Chip>
              ))}
            </div>
          </Card>
          <div className="space-y-3">
            <Card>
              <Txt>
                Committee of 5 from 6 boys and 4 girls with <b style={{ color: GIRL, background: `${GIRL}14` }}>exactly 2 girls</b>
              </Txt>
            </Card>
            <Step>
              <Card tone="warn">
                <Txt>10C5 = 252 counts every committee, with 0, 1, 3 or 4 girls too. One nCr cannot see "exactly 2 girls"</Txt>
              </Card>
            </Step>
            <Step>
              <Callout kind="info" title="Combine the tools" asStep={false}>
                Sum rule, product rule, nPr and nCr together
              </Callout>
            </Step>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"Leave the question unanswered; we solve it in Exactly k of a Type. Today\'s message: hard problems are built from easy pieces we already know."',
  },
  {
    id: 'c1-toolkit',
    section: C1,
    label: 'Our Toolkit',
    element: (
      <ContentSlide kicker={C1} title="Our Toolkit" lead="The tools we already have" lesson={SESSION}>
        <div className="grid w-full grid-cols-5 gap-3">
          {[
            ['+', 'Sum rule', 'Separate cases (or)', '3 veg or 4 non-veg: 3 + 4'],
            ['×', 'Product rule', 'Steps (and then)', '3 shirts then 2 trousers: 3 × 2'],
            ['nPr', 'Podium', 'Arrange r of n (order matters)', 'Gold, silver, bronze from 8: 336'],
            ['nCr', 'Basket', 'Select r of n (order does not)', 'Team of 3 from 8: 56'],
            ['n!', 'Full shelf', 'Arrange all n', '5 in a row: 120'],
          ].map(([sym, n, use, ex]) => (
            <div key={n} className="flex flex-col rounded-card border border-line bg-white px-3 py-3 shadow-card-soft">
              <span className="font-heading text-[28px] font-semibold" style={{ color: colors.brand }}>
                {sym}
              </span>
              <span className="font-heading text-[18px] font-semibold" style={{ color: colors.ink }}>
                {n}
              </span>
              <span className="text-[17px]" style={{ color: colors.ink }}>
                {use}
              </span>
              <Step>
                <span className="mt-2 block rounded-md px-2 py-1 text-[17px] font-semibold" style={{ background: `${TONE.ok}14`, color: colors.ink }}>
                  {ex}
                </span>
              </Step>
            </div>
          ))}
        </div>
      </ContentSlide>
    ),
    notes: '"Keep this recap brief. Ask learners for one example of each tool from memory before revealing the examples."',
  },
  {
    id: 'c1-strategy',
    section: C1,
    label: 'Four Questions to Ask',
    element: (
      <ContentSlide kicker={C1} title="Four Questions to Ask" lead="Plan before calculating" lesson={SESSION}>
        <Steps
          items={[
            ['Split into cases: does the condition allow several separate situations?', 'Sum rule'],
            ['Split into steps: within a case, what is done first, second, …?', 'Product rule'],
            ['Count each step: does order matter here?', 'nPr or nCr'],
            ['Check: is every outcome counted exactly once?', 'List a small case'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"Exam hook: examiners give marks for the plan. Learners should write the cases and steps in words before any numbers." Flow: problem → several cases? → steps → order matters? nPr : nCr → multiply → check.',
  },

  /* ── CONCEPT 2 ───────────────────────────────────────────────────────── */
  { id: 'c2-divider', section: C2, label: 'Divider', element: <SectionBreakerSlide index={2} title={C2} lesson={SESSION} /> },
  {
    id: 'c2-two-groups',
    section: C2,
    label: 'A Committee From Two Groups',
    element: (
      <ContentSlide kicker={C2} title="A Committee From Two Groups" lead="From 5 men and 4 women, choose 2 men and 3 women" lesson={SESSION}>
        <div className="flex w-full flex-wrap items-center gap-4">
          <Step>
            <Basket title="Men (5)" n={5} k={2} color={BOY} formula="5C2 = 10" />
          </Step>
          <Op>×</Op>
          <Step>
            <Basket title="Women (4)" n={4} k={3} color={GIRL} formula="4C3 = 4" />
          </Step>
          <Op>=</Op>
          <Step>
            <Total>40</Total>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Ask: why multiply and not add? Every choice of men can be paired with every choice of women; the committee needs both."',
  },
  {
    id: 'c2-small',
    section: C2,
    label: 'List Small to Check',
    element: (
      <ContentSlide kicker={C2} title="List Small to Check" lead="1 of 2 men and 2 of 3 women, by hand" lesson={SESSION}>
        <div className="grid w-full grid-cols-[1.2fr_1fr] items-center gap-6">
          <SmallTree />
          <Step>
            <Card tone="ok">
              <Label tone="ok">Formula</Label>
              <Big className="text-[26px]">2C1 × 3C2 = 2 × 3 = 6</Big>
              <Txt>matches the 6 leaves</Txt>
            </Card>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"This is the list small, then generalise habit. When unsure about a method, test it on a case small enough to list."',
  },
  {
    id: 'c2-captain',
    section: C2,
    label: 'A Team With a Captain',
    element: (
      <ContentSlide kicker={C2} title="A Team With a Captain" lead="From 10 players: a team of 5, then a captain from the team" lesson={SESSION}>
        <div className="grid w-full grid-cols-[1fr_auto] items-center gap-6">
          <div className="space-y-3">
            {[
              ['Route 1: team, then captain', '10C5 × 5C1 = 252 × 5'],
              ['Route 2: captain, then the rest', '10 × 9C4 = 10 × 126'],
            ].map(([r, f]) => (
              <Step key={r}>
                <div className="flex items-center gap-3 rounded-card border border-line bg-white px-4 py-3 shadow-card-soft">
                  <span className="flex-1">
                    <Label>{r}</Label>
                    <Big>{f}</Big>
                  </span>
                  <Op>⟶</Op>
                </div>
              </Step>
            ))}
          </div>
          <Total label="Both">1,260</Total>
        </div>
      </ContentSlide>
    ),
    notes: '"Counting the same thing two ways is a strong check. Both orders of steps give the same answer because each outcome is counted once in each route."',
  },
  {
    id: 'c2-words',
    section: C2,
    label: 'Choose Letters, Then Form Words',
    element: (
      <ContentSlide kicker={C2} title="Choose Letters, Then Form Words" lead="5 consonants, 3 vowels: 3-letter words with 2 consonants and 1 vowel" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="flex w-fit flex-wrap items-center gap-3">
            <Step>
              <Card>
                <Label>Pick consonants</Label>
                <Big>5C2 = 10</Big>
              </Card>
            </Step>
            <Op>×</Op>
            <Step>
              <Card>
                <Label>Pick vowel</Label>
                <Big>3C1 = 3</Big>
              </Card>
            </Step>
            <Op>×</Op>
            <Step>
              <Card>
                <Label>Arrange</Label>
                <Slots values={[3, 2, 1]} />
              </Card>
            </Step>
            <Op>=</Op>
            <Step>
              <Total>180</Total>
            </Step>
          </div>
          <Step>
            <Callout kind="info" title="Selection first, arrangement last" asStep={false}>
              The select-then-arrange pattern (nPr = nCr × r!), now from two groups
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"This is the select-then-arrange pattern (nPr = nCr × r!), now with selections from two groups." Any arrangement counts as a word.',
  },
  {
    id: 'c2-shelf',
    section: C2,
    label: 'Choose and Display',
    element: (
      <ContentSlide kicker={C2} title="Choose and Display" lead="4 novels, 3 comics: pick 2 of each and arrange the 4 on a shelf" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="flex flex-wrap items-end gap-6">
            <div>
              <Label>Novels: 4C2 = 6</Label>
              <div className="mt-1 flex gap-1">
                {[1, 1, 0, 0].map((h, i) => (
                  <span key={i} className="h-16 w-6 rounded-sm" style={{ background: h ? BOY : `${BOY}33` }} />
                ))}
              </div>
            </div>
            <div>
              <Label>Comics: 3C2 = 3</Label>
              <div className="mt-1 flex gap-1">
                {[1, 1, 0].map((h, i) => (
                  <span key={i} className="h-16 w-6 rounded-sm" style={{ background: h ? '#EA580C' : '#EA580C33' }} />
                ))}
              </div>
            </div>
            <Step>
              <div>
                <Label>Shelf: 4! = 24</Label>
                <Slots values={[4, 3, 2, 1]} />
              </div>
            </Step>
          </div>
          <Step>
            <Total>6 × 3 × 24 = 432</Total>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"A common error is to stop after 6 × 3 = 18. Ask: does the shelf display care about order? Yes, so multiply by 4!."',
  },
  {
    id: 'c2-practice',
    section: C2,
    label: 'Write the Steps First',
    element: (
      <ContentSlide kicker={C2} title="Write the Steps First" lead="Say which steps select and which arrange, then reveal" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Problem', weight: 2 }, { label: 'Steps', weight: 1.1 }, { label: 'Answer', weight: 1.1 }]}
          rows={[
            ['3 men from 6 and 2 women from 5 for a committee', '6C3 × 5C2', '20 × 10 = 200'],
            ['A team of 4 from 9, then a leader from the team', '9C4 × 4', '126 × 4 = 504'],
            ['2 of 5 boys and 1 of 3 girls stand in a row', '5C2 × 3C1 × 3!', '10 × 3 × 6 = 180'],
            ['2 of 4 red and 2 of 3 blue different flags hung in a row', '4C2 × 3C2 × 4!', '6 × 3 × 24 = 432'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"For each row, ask learners to say aloud which steps are selections and which are arrangements."',
  },

  /* ── CONCEPT 3 ───────────────────────────────────────────────────────── */
  { id: 'c3-divider', section: C3, label: 'Divider', element: <SectionBreakerSlide index={3} title={C3} lesson={SESSION} /> },
  {
    id: 'c3-friends',
    section: C3,
    label: 'Two Friends Who Stay Together',
    element: (
      <ContentSlide kicker={C3} title="Two Friends Who Stay Together" lead="Think First: A, B, C in a row with A and B next to each other" lesson={SESSION}>
        <div className="w-full space-y-3">
          <LineUps />
          <Callout kind="success" title="4 of the 6 arrangements keep A and B together" asStep={false}>
            Spot the pattern: the pair behaves like one person, and inside the pair A and B can swap
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes: '"Ask learners to spot a pattern: the pair AB behaves like a single person, and inside the pair A and B can swap."',
  },
  {
    id: 'c3-block',
    section: C3,
    label: 'Glue the Group Into One Block',
    element: (
      <ContentSlide kicker={C3} title="Glue the Group Into One Block" lead="Two steps for grouped items, joined by the product rule" lesson={SESSION}>
        <div className="grid w-full grid-cols-2 gap-5">
          <Step>
            <Card className="h-full">
              <Label>Step 1: arrange the units</Label>
              <div className="my-2 flex items-center gap-2">
                <span className="rounded-xl border-2 px-3 py-2 font-heading text-[20px] font-semibold" style={{ borderColor: GIRL, color: colors.ink }}>
                  [A B]
                </span>
                <span className="grid h-11 w-11 place-items-center rounded-full font-heading text-[20px] font-semibold text-white" style={{ background: TONE.grey }}>
                  C
                </span>
              </div>
              <Big>2 units: 2! = 2</Big>
            </Card>
          </Step>
          <Step>
            <Card className="h-full">
              <Label>Step 2: arrange inside the block</Label>
              <div className="my-2 flex gap-2">
                {['A B', 'B A'].map((t) => (
                  <span key={t} className="rounded-xl border-2 px-3 py-2 font-heading text-[20px] font-semibold" style={{ borderColor: GIRL, color: colors.ink }}>
                    {t}
                  </span>
                ))}
              </div>
              <Big>2! = 2</Big>
            </Card>
          </Step>
          <Step className="col-span-2">
            <Total>2 × 2 = 4 ✓</Total>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"The block method is just the product rule: first arrange the units, then arrange inside the block."',
  },
  {
    id: 'c3-photo',
    section: C3,
    label: 'Siblings Together in a Photo',
    element: (
      <ContentSlide kicker={C3} title="Siblings Together in a Photo" lead="6 friends line up; 2 siblings must stand together" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div>
            <Label>Block + 4 others = 5 units</Label>
            <Slots values={['', 'S S', '', '', '']} wide={1} />
          </div>
          <Steps
            items={[
              ['Arrange the 5 units', '5! = 120'],
              ['Arrange inside the block', '2! = 2'],
              ['Multiply', '240'],
            ]}
          />
          <Step>
            <Txt>Compare: with no condition, 6! = 720 line-ups</Txt>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Ask why the answer is one third of 720. Not needed for exams, but a good sense check: the restriction should make the count smaller."',
  },
  {
    id: 'c3-computer',
    section: C3,
    label: 'Vowels Together in COMPUTER',
    element: (
      <ContentSlide kicker={C3} title="Vowels Together in COMPUTER" lead="O, U, E form one block" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {['C', 'M', 'P', 'T', 'R'].map((l) => (
              <span key={l} className="grid h-14 w-14 place-items-center rounded-lg font-heading text-[24px] font-semibold text-white" style={{ background: colors.brand }}>
                {l}
              </span>
            ))}
            <span className="grid h-14 place-items-center rounded-lg px-4 font-heading text-[24px] font-semibold text-white" style={{ background: GIRL }}>
              O U E
            </span>
            <Step>
              <span className="ml-3 rounded-2xl border-2 px-3 py-2 text-[18px] font-semibold" style={{ borderColor: GIRL, color: colors.ink }}>
                zoom: OUE OEU UOE UEO EOU EUO
              </span>
            </Step>
          </div>
          <Steps
            items={[
              ['8 letters − 3 vowels + 1 block = 6 units', '6! = 720'],
              ['Arrange the vowels inside the block', '3! = 6'],
              ['Multiply', '4,320'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"Remind learners that this works because all 8 letters of COMPUTER are different."',
  },
  {
    id: 'c3-subjects',
    section: C3,
    label: 'Every Subject Stays Together',
    element: (
      <ContentSlide kicker={C3} title="Every Subject Stays Together" lead="3 Maths, 2 Physics, 4 Chemistry books, each subject together" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="flex items-end gap-3 border-b-4 pb-1" style={{ borderColor: '#92400E' }}>
            {[
              ['Maths', 3, BOY, '3! = 6'],
              ['Physics', 2, TONE.ok, '2! = 2'],
              ['Chemistry', 4, '#EA580C', '4! = 24'],
            ].map(([n, c, col, f]) => (
              <Step key={n as string}>
                <div className="flex flex-col items-center">
                  <span className="text-[17px] font-semibold" style={{ color: colors.ink }}>
                    {f as string}
                  </span>
                  <div className="flex gap-1 rounded-md p-1" style={{ boxShadow: `inset 0 0 0 2px ${col as string}` }}>
                    {Array.from({ length: c as number }, (_, i) => (
                      <span key={i} className="h-16 w-6 rounded-sm" style={{ background: col as string }} />
                    ))}
                  </div>
                  <span className="text-[17px] font-semibold" style={{ color: col as string }}>
                    {n as string}
                  </span>
                </div>
              </Step>
            ))}
            <span className="ml-4 self-center font-heading text-[20px] font-semibold" style={{ color: colors.brandDark }}>
              blocks: 3! = 6
            </span>
          </div>
          <Step>
            <Total>6 × 6 × 2 × 24 = 1,728</Total>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Exam hook: when several groups must stay together, there is one factorial for the blocks plus one factorial for each block\'s inside."',
  },
  {
    id: 'c3-practice',
    section: C3,
    label: 'Count the Units, Then the Insides',
    element: (
      <ContentSlide kicker={C3} title="Count the Units, Then the Insides" lead="Sketch the units as boxes, then reveal" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Problem', weight: 2.2 }, { label: 'Units', weight: 0.5 }, { label: 'Working', weight: 1.1 }, { label: 'Answer', weight: 0.6 }]}
          rows={[
            ['5 people in a row; 2 particular people together', '4', '4! × 2!', '48'],
            ['4 boys and 3 girls in a row; all girls together', '5', '5! × 3!', '720'],
            ['7 different books; 3 particular books together', '5', '5! × 3!', '720'],
            ['2 red, 3 blue, 1 green different beads; each colour together', '3', '3! × 2! × 3! × 1!', '72'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"Always count units first: (items outside the blocks) + (number of blocks)."',
  },
  { id: 'quiz-1', section: C3, label: 'Quiz Time', element: <QuizTimeSlide lesson={SESSION} /> },

  /* ── CONCEPT 4 ───────────────────────────────────────────────────────── */
  { id: 'c4-divider', section: C4, label: 'Divider', element: <SectionBreakerSlide index={4} title={C4} lesson={SESSION} /> },
  {
    id: 'c4-two-girls',
    section: C4,
    label: 'Back to the Opening Problem',
    element: (
      <ContentSlide kicker={C4} title="Back to the Opening Problem" lead="6 boys, 4 girls: a committee of 5 with exactly 2 girls" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex gap-2 rounded-xl px-3 py-3" style={{ background: `${GIRL}14`, boxShadow: `inset 0 0 0 2px ${GIRL}` }}>
              {[0, 1].map((i) => (
                <span key={i} className="h-12 w-12 rounded-lg" style={{ background: GIRL }} />
              ))}
              <span className="self-center font-heading text-[20px] font-semibold" style={{ color: GIRL }}>
                girls: 4C2
              </span>
            </div>
            <Op>×</Op>
            <div className="flex gap-2 rounded-xl px-3 py-3" style={{ background: `${BOY}14`, boxShadow: `inset 0 0 0 2px ${BOY}` }}>
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-12 w-12 rounded-lg" style={{ background: BOY }} />
              ))}
              <span className="self-center font-heading text-[20px] font-semibold" style={{ color: BOY }}>
                boys: 6C3
              </span>
            </div>
          </div>
          <Steps
            items={[
              ['Exactly 2 girls means the other 3 are boys'],
              ['Girls 4C2 = 6, boys 6C3 = 20'],
              ['Multiply', '120'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"The key move: exactly k of one type fixes how many of the other type too. Then it is a two-step selection, like Select, Then Arrange."',
  },
  {
    id: 'c4-recipe',
    section: C4,
    label: 'A General Recipe',
    element: (
      <ContentSlide kicker={C4} title="A General Recipe" lead="Choose r with exactly k from group A (size a), the rest from B (size b)" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="flex items-center gap-3">
            <Card>
              <Label>Pool A (a)</Label>
              <Big>k items</Big>
            </Card>
            <Op>+</Op>
            <Card>
              <Label>Pool B (b)</Label>
              <Big>r − k items</Big>
            </Card>
            <Op>⟶</Op>
            <Card tone="ok">
              <Label tone="ok">r chosen</Label>
              <Big className="text-[28px]">aCk × bC(r − k)</Big>
            </Card>
          </div>
          <Step>
            <Callout kind="success" title="Check: a = 4 girls, b = 6 boys, r = 5, k = 2" asStep={false}>
              4C2 × 6C3 = 120
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Check the recipe against the opening problem: a = 4 girls, b = 6 boys, r = 5, k = 2 gives 4C2 × 6C3 = 120."',
  },
  {
    id: 'c4-cases',
    section: C4,
    label: 'Every Possible Number of Girls',
    element: (
      <ContentSlide kicker={C4} title="Every Possible Number of Girls" lead="Committees of 5 from 6 boys and 4 girls, by the number of girls" lesson={SESSION}>
        <div className="grid w-full grid-cols-[auto_1fr] items-end gap-6">
          <Bars />
          <div className="space-y-2">
            <Txt>4C0 × 6C5 = 6</Txt>
            <Txt>4C1 × 6C4 = 60</Txt>
            <Txt>4C2 × 6C3 = 120</Txt>
            <Txt>4C3 × 6C2 = 60</Txt>
            <Txt>4C4 × 6C1 = 6</Txt>
            <Total label="All">252 = 10C5</Total>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"The cases are mutually exclusive and cover everything, so by the sum rule they add up to 10C5. This table is the key to the next section."',
  },
  {
    id: 'c4-exam',
    section: C4,
    label: 'Questions From Two Parts',
    element: (
      <ContentSlide kicker={C4} title="Questions From Two Parts" lead="Answer exactly 3 of 5 in Part A and exactly 2 of 4 in Part B" lesson={SESSION}>
        <div className="w-full space-y-3">
          <div className="flex items-center gap-3">
            {[
              ['Part A', 5, 3, '5C3 = 10'],
              ['Part B', 4, 2, '4C2 = 6'],
            ].map(([p, n, k, f]) => (
              <Card key={p as string}>
                <Label>{p as string}</Label>
                <div className="my-2 flex gap-1.5">
                  {Array.from({ length: n as number }, (_, i) => (
                    <span key={i} className="grid h-9 w-9 place-items-center rounded-md border-2 text-[18px] font-semibold" style={{ borderColor: colors.brand, color: TONE.ok }}>
                      {i < (k as number) ? '✓' : ''}
                    </span>
                  ))}
                </div>
                <Big>{f as string}</Big>
              </Card>
            ))}
            <Op>=</Op>
            <Total>10 × 6 = 60</Total>
          </div>
          <Step>
            <Card tone="warn">
              <Label tone="warn">Try it: 5 cards from 52, exactly 2 aces</Label>
              <Big>4C2 × 48C3 = 6 × 17,296 = 103,776</Big>
            </Card>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"For the card problem, the other type is the 48 non-aces. Learners often forget to restrict the remaining cards to non-aces."',
  },
  {
    id: 'c4-practice',
    section: C4,
    label: 'Fix Both Types, Then Multiply',
    element: (
      <ContentSlide kicker={C4} title="Fix Both Types, Then Multiply" lead="Exactly k of type A means exactly r − k of type B" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Problem', weight: 2.2 }, { label: 'Working', weight: 0.9 }, { label: 'Answer', weight: 0.9 }]}
          rows={[
            ['4 from 5 seniors and 6 juniors, exactly 1 senior', '5C1 × 6C3', '5 × 20 = 100'],
            ['6 from 7 men and 5 women, exactly 3 women', '5C3 × 7C3', '10 × 35 = 350'],
            ['3 bulbs from 8 good and 4 faulty, exactly 2 faulty', '4C2 × 8C1', '6 × 8 = 48'],
            ['5 questions from 6 theory and 4 problems, exactly 2 problems', '4C2 × 6C3', '6 × 20 = 120'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"Ask learners to state exactly k of type A means exactly r − k of type B for each row before writing the working."',
  },

  /* ── CONCEPT 5 ───────────────────────────────────────────────────────── */
  { id: 'c5-divider', section: C5, label: 'Divider', element: <SectionBreakerSlide index={5} title={C5} lesson={SESSION} /> },
  {
    id: 'c5-reading',
    section: C5,
    label: 'Reading the Condition',
    element: (
      <ContentSlide kicker={C5} title="Reading the Condition" lead="Committee of 5 from 6 boys and 4 girls: which numbers of girls are allowed?" lesson={SESSION}>
        <div className="w-full space-y-2">
          {[
            ['Exactly 2 girls', [2]],
            ['At least 2 girls', [2, 3, 4]],
            ['At most 2 girls', [0, 1, 2]],
            ['More than 2 girls', [3, 4]],
            ['At least 1 girl', [1, 2, 3, 4]],
          ].map(([c, a]) => (
            <Step key={c as string}>
              <div className="flex items-center gap-4 rounded-card border border-line bg-white px-4 py-2 shadow-card-soft">
                <span className="w-[260px] font-heading text-[20px] font-semibold" style={{ color: colors.ink }}>
                  {c as string}
                </span>
                <GirlLine allowed={a as number[]} />
              </div>
            </Step>
          ))}
        </div>
      </ContentSlide>
    ),
    notes: '"Most mistakes in this topic come from misreading the condition. Ask learners to write the allowed values first, every time."',
  },
  {
    id: 'c5-direct',
    section: C5,
    label: 'Direct Method',
    element: (
      <ContentSlide kicker={C5} title="Direct Method" lead="At least 3 girls: count each allowed case and add" lesson={SESSION}>
        <div className="flex w-full flex-wrap items-center gap-4">
          <Step>
            <Card>
              <Label>Case 1: 3 girls</Label>
              <Big>4C3 × 6C2 = 4 × 15 = 60</Big>
            </Card>
          </Step>
          <Op>+</Op>
          <Step>
            <Card>
              <Label>Case 2: 4 girls</Label>
              <Big>4C4 × 6C1 = 1 × 6 = 6</Big>
            </Card>
          </Step>
          <Op>=</Op>
          <Step>
            <Total>66</Total>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"The cases are mutually exclusive (a committee cannot have both 3 and 4 girls), so the sum rule applies."',
  },
  {
    id: 'c5-complement',
    section: C5,
    label: 'Complement Method',
    element: (
      <ContentSlide kicker={C5} title="Complement Method" lead="At least 1 girl: total minus the unwanted case (no girls)" lesson={SESSION}>
        <div className="grid w-full grid-cols-[1.2fr_1fr] items-center gap-6">
          <div className="relative h-[230px] rounded-card border-2 px-5 py-4" style={{ borderColor: colors.brand, background: `${TONE.ok}12` }}>
            <Label>All committees: 10C5 = 252</Label>
            <Big className="mt-10 text-[26px]">At least 1 girl: 246</Big>
            <Step>
              <span className="absolute bottom-0 right-0 grid h-[90px] w-[170px] place-items-center rounded-br-card rounded-tl-xl text-center text-[18px] font-semibold text-white" style={{ background: TONE.bad }}>
                No girls: 6C5 = 6
              </span>
            </Step>
          </div>
          <div className="space-y-3">
            <Step>
              <Total>252 − 6 = 246</Total>
            </Step>
            <Step>
              <Callout kind="success" title="wanted = total − unwanted" asStep={false}>
                Direct needs four cases: 60 + 120 + 60 + 6 = 246
              </Callout>
            </Step>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"The direct method needs four cases (1, 2, 3 or 4 girls). The complement needs one subtraction. Same answer, less work."',
  },
  {
    id: 'c5-which',
    section: C5,
    label: 'Direct or Complement?',
    element: (
      <ContentSlide kicker={C5} title="Direct or Complement?" lead="Count whichever side has fewer cases" lesson={SESSION}>
        <div className="w-full space-y-2">
          {[
            ['At least 3 girls (of 4)', 2, 3],
            ['At least 1 girl', 4, 1],
            ['At most 3 girls', 4, 1],
            ['At most 1 girl', 2, 3],
          ].map(([c, d, u]) => {
            const direct = (d as number) < (u as number)
            return (
              <Step key={c as string}>
                <div className="grid grid-cols-[240px_1fr_1fr] items-center gap-3 rounded-card border border-line bg-white px-4 py-2 shadow-card-soft">
                  <span className="font-heading text-[19px] font-semibold" style={{ color: colors.ink }}>
                    {c as string}
                  </span>
                  <span className="rounded-lg px-3 py-1 text-[18px]" style={{ background: direct ? `${TONE.ok}22` : '#F1F5F9', color: colors.ink, fontWeight: direct ? 600 : 400 }}>
                    Direct: {d as number} {(d as number) === 1 ? 'case' : 'cases'}
                    {direct ? '  ✓ lighter' : ''}
                  </span>
                  <span className="rounded-lg px-3 py-1 text-[18px]" style={{ background: !direct ? `${TONE.ok}22` : '#F1F5F9', color: colors.ink, fontWeight: !direct ? 600 : 400 }}>
                    Complement: {u as number} unwanted
                    {!direct ? '  ✓ lighter' : ''}
                  </span>
                </div>
              </Step>
            )
          })}
        </div>
      </ContentSlide>
    ),
    notes: '"At least one almost always means complement: total minus none." The unwanted case for at most 3 girls is 4 girls.',
  },
  {
    id: 'c5-bulbs',
    section: C5,
    label: 'At Least One Faulty Bulb',
    element: (
      <ContentSlide kicker={C5} title="At Least One Faulty Bulb" lead="10 bulbs, 3 faulty: pick 4 with at least one faulty" lesson={SESSION}>
        <div className="grid w-full grid-cols-[300px_1fr] items-start gap-6">
          <Card>
            <Label>The box</Label>
            <div className="mt-2 grid grid-cols-5 gap-2">
              {Array.from({ length: 10 }, (_, i) => (
                <span key={i} className="grid h-10 w-10 place-items-center rounded-full text-[18px] font-semibold" style={{ background: i < 3 ? '#FEE2E2' : '#FEF9C3', color: TONE.bad, boxShadow: i < 3 ? `inset 0 0 0 2px ${TONE.bad}` : 'inset 0 0 0 2px #CA8A04' }}>
                  {i < 3 ? '✗' : ''}
                </span>
              ))}
            </div>
          </Card>
          <div className="space-y-2">
            <Steps
              items={[
                ['Total selections', '10C4 = 210'],
                ['No faulty bulb: all from the 7 good', '7C4 = 35'],
                ['Complement', '210 − 35 = 175'],
              ]}
            />
            <Step>
              <Txt>Check by cases: 1 faulty 3 × 35 = 105; 2 faulty 3 × 21 = 63; 3 faulty 1 × 7 = 7; total 175 ✓</Txt>
            </Step>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"Use the check to convince learners the complement method is safe. In the exam, the complement alone is enough."',
  },
  {
    id: 'c5-trap',
    section: C5,
    label: 'Why "Pick One First" Overcounts',
    element: (
      <ContentSlide kicker={C5} title={'Why "Pick One First" Overcounts'} lead="Wrong working: pick 1 faulty (3 ways), then any 3 of the other 9: 3 × 84 = 252" lesson={SESSION}>
        <div className="w-full space-y-3">
          <div className="grid grid-cols-2 gap-4">
            {['F₁', 'F₂'].map((chosen) => (
              <Step key={chosen}>
                <Card>
                  <Label>Route: pick {chosen} first</Label>
                  <div className="mt-2 flex gap-2">
                    {['F₁', 'F₂', 'G₁', 'G₂'].map((b) => (
                      <span
                        key={b}
                        className="grid h-12 w-12 place-items-center rounded-full font-heading text-[18px] font-semibold"
                        style={{ background: b.startsWith('F') ? '#FEE2E2' : '#FEF9C3', color: colors.ink, boxShadow: b === chosen ? `0 0 0 4px ${colors.brand}` : undefined }}
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </Card>
              </Step>
            ))}
          </div>
          <Step>
            <div className="flex items-center gap-4">
              <span className="-rotate-6 rounded-lg border-4 px-4 py-1 font-heading text-[26px] font-semibold" style={{ borderColor: TONE.bad, color: TONE.bad }}>
                counted twice!
              </span>
              <Txt>252 is more than 175: selections with 2 or 3 faulty bulbs are reached by more than one route. Fix: the complement (or add exact cases)</Txt>
            </div>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Exam hook: this is the most common error in at least one questions. Learners should always ask whether any outcome can be reached by two different routes."',
  },
  {
    id: 'c5-practice',
    section: C5,
    label: 'Choose the Method, Then Compute',
    element: (
      <ContentSlide kicker={C5} title="Choose the Method, Then Compute" lead="Vote direct or complement, then reveal" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Problem', weight: 1.6 }, { label: 'Method', weight: 0.7 }, { label: 'Answer', weight: 1.6 }]}
          rows={[
            ['4 from 5 men and 4 women, at least 1 woman', <Lit v="Complement" tone="brand" />, '9C4 − 5C4 = 126 − 5 = 121'],
            ['4 from 5 men and 4 women, at least 3 women', <Lit v="Direct" tone="ok" />, '4C3 × 5C1 + 4C4 = 20 + 1 = 21'],
            ['3 bulbs from 8 good and 4 faulty, at most 1 faulty', <Lit v="Direct" tone="ok" />, '8C3 + 4C1 × 8C2 = 56 + 112 = 168'],
            ['5 cards from 52, at least 1 ace', <Lit v="Complement" tone="brand" />, '52C5 − 48C5 = 2,598,960 − 1,712,304 = 886,656'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"For the third row, at most 1 faulty means 0 or 1 faulty: two short cases, so direct is quicker."',
  },

  /* ── CONCEPT 6 ───────────────────────────────────────────────────────── */
  { id: 'c6-divider', section: C6, label: 'Divider', element: <SectionBreakerSlide index={6} title={C6} lesson={SESSION} /> },
  {
    id: 'c6-multi',
    section: C6,
    label: 'A Multi-Step Problem',
    element: (
      <ContentSlide kicker={C6} title="A Multi-Step Problem" lead="From 5 boys and 4 girls, choose 3 boys and 2 girls and seat them in a row" lesson={SESSION}>
        <div className="w-full space-y-3">
          <Step>
            <Card>
              <Label>(a) Any order</Label>
              <Big>5C3 × 4C2 × 5! = 10 × 6 × 120 = 7,200</Big>
            </Card>
          </Step>
          <Step>
            <Card tone="ok">
              <Label tone="ok">(b) The 2 chosen girls sit together</Label>
              <div className="mt-1 flex flex-wrap items-center gap-3">
                <Txt>Select: 10 × 6 = 60</Txt>
                <Slots values={['B', 'G G', 'B', 'B']} wide={1} />
                <Txt>4! × 2! = 48</Txt>
              </div>
              <Big className="mt-1">60 × 48 = 2,880</Big>
            </Card>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Walk through the plan in words first: select, then arrange; the grouping condition affects only the arrangement step."',
  },
  {
    id: 'c6-cases',
    section: C6,
    label: 'Cases First, Steps Inside',
    element: (
      <ContentSlide kicker={C6} title="Cases First, Steps Inside" lead="4 seniors, 3 juniors: a panel of 3 with at least 2 seniors, seated in a row" lesson={SESSION}>
        <div className="flex w-full flex-wrap items-center gap-4">
          <Step>
            <Card>
              <Label>Case 1: 2 seniors, 1 junior</Label>
              <Txt>Select 4C2 × 3C1 = 18</Txt>
              <Txt>Arrange 3! = 6</Txt>
              <Big>108</Big>
            </Card>
          </Step>
          <Op>+</Op>
          <Step>
            <Card>
              <Label>Case 2: 3 seniors</Label>
              <Txt>Select 4C3 = 4</Txt>
              <Txt>Arrange 3! = 6</Txt>
              <Big>24</Big>
            </Card>
          </Step>
          <Op>=</Op>
          <Step>
            <Total>132</Total>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Sum rule across the cases, product rule inside each case. This structure (cases, then steps) solves most problems in this topic."',
  },
  {
    id: 'c6-mistakes',
    section: C6,
    label: 'Avoid These Errors',
    element: (
      <ContentSlide kicker={C6} title="Avoid These Errors" lead="Red: the wrong working. Green: the fix" lesson={SESSION}>
        <div className="w-full space-y-2">
          {[
            ['Forgetting to arrange after selecting', 'Books on a shelf as 4C2 × 3C2 = 18', 'Multiply by 4! for the display: 432'],
            ['Forgetting the inside of a block', 'COMPUTER vowels together as 6! = 720', 'Multiply by 3!: 4,320'],
            ['Wrong number of units', '6 friends, 2 together, as 6! × 2!', '5 units: 5! × 2! = 240'],
            ['"Pick one first" for at least one', 'Bulbs as 3 × 9C3 = 252', 'Complement: 210 − 35 = 175'],
            ['Misreading "at most"', 'At most 1 counted as exactly 1', 'Include the 0 case too'],
          ].map(([m, w, f]) => (
            <Step key={m}>
              <div className="grid grid-cols-[1fr_1.1fr_1.1fr] items-center gap-3 rounded-card border border-line bg-white px-4 py-2 shadow-card-soft">
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
    notes: '"Ask learners which mistake they find easiest to make. Encourage the small-case check (List Small to Check) whenever in doubt."',
  },
  {
    id: 'c6-mixed',
    section: C6,
    label: 'Plan, Then Solve',
    element: (
      <ContentSlide kicker={C6} title="Plan, Then Solve" lead="Name the plan first, then compute" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Problem', weight: 1.8 }, { label: 'Plan', weight: 0.8 }, { label: 'Answer', weight: 1.6 }]}
          rows={[
            ['7 from 6 men and 5 women, exactly 4 men', 'Exactly k', '6C4 × 5C3 = 15 × 10 = 150'],
            ['7 from 6 men and 5 women, at least 1 woman', 'Complement', '11C7 − 0 = 330 (7 men impossible: only 6)'],
            ['5 different books in a row, 2 particular together', 'Block', '4! × 2! = 48'],
            ['2 of 4 novels and 1 of 3 comics in a row', 'Select, then arrange', '4C2 × 3C1 × 3! = 108'],
            ['3 from 4 doctors and 5 nurses, at least 1 doctor', 'Complement', '9C3 − 5C3 = 84 − 10 = 74'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"The second row is a deliberate trap: an all-men committee of 7 is impossible with only 6 men, so the unwanted count is 0 and every committee qualifies."',
  },

  /* ── CLOSING ────────────────────────────────────────────────────────── */
  { id: 'quiz-2', section: 'Closing', label: 'Quiz Time', element: <QuizTimeSlide lesson={SESSION} /> },
  { id: 'takeaways', section: 'Closing', label: 'Key Takeaways', element: <KeyTakeawaysSlide title={SESSION} lesson={SESSION} points={AGENDA} /> },
  { id: 'feedback', section: 'Closing', label: 'Feedback', element: <FeedbackSlide lesson={SESSION} formless />, notes: 'No form and no QR (content rule 41 as amended 2026-11-21). Ask for feedback out loud.' },
  { id: 'thank-you', section: 'Closing', label: 'Thank you', element: <ThankYouSlide title="Thank You" lesson={SESSION} /> },
  { id: 'all-the-best', section: 'Closing', label: 'All the best', element: <ThankYouSlide title="All the Best" lesson={SESSION} /> },
]
