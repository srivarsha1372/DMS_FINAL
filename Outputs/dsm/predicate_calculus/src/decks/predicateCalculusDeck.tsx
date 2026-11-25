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
 * THE PREDICATE CALCULUS (DSM, Mathematical Logic).
 *
 * Built from the signed-off plan at
 *   Outputs/dsm/session_plans/predicate_calculus/plan.md
 * (54 slides: S10 + S11 and S16 + S17 merged, every other TR slide its own).
 * Every truth value, witness and counterexample was checked by `verify_tr.py`.
 * Visuals are DOM figures (cards, chips, grids), never SVG text.
 */

const SESSION = 'The Predicate Calculus'
const C1 = 'Limits of Propositional Logic'
const C2 = 'Predicates and Statement Functions'
const C3 = 'Quantifiers'
const C4 = 'English to Predicate Logic'
const C5 = 'Predicate Logic to English'
const C6 = 'Free and Bound Variables'
const C7 = 'Negating Quantified Statements'
const C8 = 'Nested Quantifiers'
const AGENDA = [C1, C2, C3, C4, C5, C6, C7, C8]

export const predicateCalculusMeta: DeckMeta = {
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
              <span className="block text-[18px]" style={{ color: colors.ink }}>
                {sub}
              </span>
            )}
          </span>
        </Step>
      ))}
    </div>
  )
}

function Arrow({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center px-2">
      <span className="font-heading text-[30px] font-semibold" style={{ color: colors.brand }}>
        ⟶
      </span>
      {label && (
        <span className="text-[17px] font-semibold" style={{ color: colors.brandDark }}>
          {label}
        </span>
      )}
    </div>
  )
}

/** Line / Formula / Reason, one line per press after the first. */
function Lines({ lines, reasonW = 330 }: { lines: [string, string][]; reasonW?: number }) {
  return (
    <div className="w-full overflow-hidden rounded-card border border-line bg-white shadow-card-soft">
      <div className="grid items-center gap-3 px-4 py-2 font-heading text-[16px] font-semibold uppercase tracking-wide text-white" style={{ gridTemplateColumns: `44px 1fr ${reasonW}px`, background: colors.brandDark }}>
        <span>Line</span>
        <span>Formula</span>
        <span>Reason</span>
      </div>
      {lines.map(([s, r], i) => {
        const row = (
          <div className="grid items-center gap-3 border-t border-line px-4 py-2" style={{ gridTemplateColumns: `44px 1fr ${reasonW}px` }}>
            <span className="font-heading text-[18px] font-semibold" style={{ color: colors.brandDark }}>
              {i + 1}
            </span>
            <span className="font-heading text-[22px] font-semibold" style={{ color: colors.ink }}>
              {s}
            </span>
            <span className="text-[18px] font-semibold" style={{ color: i === 0 ? colors.ink : TONE.ok }}>
              {r}
            </span>
          </div>
        )
        return i === 0 ? <div key={i}>{row}</div> : <Step key={i}>{row}</Step>
      })}
    </div>
  )
}

/** A light that is grey, green or red. */
function Light({ tone, text }: { tone: Tone; text: string }) {
  return (
    <span className="inline-flex items-center gap-2 font-heading text-[18px] font-semibold" style={{ color: TONE[tone] }}>
      <span className="h-5 w-5 rounded-full" style={{ background: TONE[tone], boxShadow: `0 0 10px ${TONE[tone]}88` }} />
      {text}
    </span>
  )
}

/* ── slide-specific figures ─────────────────────────────────────────────── */

/** C11: three switches in series (∀) and in parallel (∃). */
function Switches({ parallel }: { parallel: boolean }) {
  const sw: [string, boolean][] = [
    ['P(1)', true],
    ['P(2)', true],
    ['P(3)', false],
  ]
  const lit = parallel ? sw.some(([, v]) => v) : sw.every(([, v]) => v)
  const box = (name: string, on: boolean) => (
    <span key={name} className="rounded-xl px-3 py-2 font-heading text-[18px] font-semibold" style={{ background: on ? `${TONE.ok}18` : `${TONE.bad}14`, color: on ? TONE.ok : TONE.bad, boxShadow: `inset 0 0 0 2px ${on ? TONE.ok : TONE.bad}66` }}>
      {name} {on ? 'on' : 'off'}
    </span>
  )
  const bulb = (
    <span className="flex flex-col items-center">
      <span className="h-10 w-10 rounded-full" style={{ background: lit ? '#FACC15' : '#CBD5E1', boxShadow: lit ? '0 0 22px #FACC15' : undefined }} />
      <span className="text-[17px] font-semibold" style={{ color: lit ? TONE.ok : TONE.bad }}>
        {lit ? 'lit: true' : 'dark: false'}
      </span>
    </span>
  )
  const wire = <span className="h-[3px] w-5" style={{ background: colors.brandDark }} />
  return parallel ? (
    <div className="flex items-center gap-2">
      <span className="w-[5px] self-stretch rounded" style={{ background: colors.brandDark }} />
      <div className="flex flex-col gap-2">{sw.map(([n, v]) => <span key={n} className="flex items-center">{wire}{box(n, v)}{wire}</span>)}</div>
      <span className="w-[5px] self-stretch rounded" style={{ background: colors.brandDark }} />
      {wire}
      {bulb}
    </div>
  ) : (
    <div className="flex items-center gap-0">
      {sw.map(([n, v]) => (
        <span key={n} className="flex items-center">
          {wire}
          {box(n, v)}
        </span>
      ))}
      {wire}
      {bulb}
    </div>
  )
}

/** C32: the x, y grid for x + y = x · y on 0 to 3. */
function SumProductGrid() {
  const k = useBuild(1)
  const vals = [0, 1, 2, 3]
  return (
    <div className="inline-grid gap-1" style={{ gridTemplateColumns: `56px repeat(${vals.length}, 56px)` }}>
      <span className="grid h-12 place-items-center text-[17px] font-semibold" style={{ color: colors.brandDark }}>
        x \ y
      </span>
      {vals.map((y) => (
        <span key={`h${y}`} className="grid h-12 place-items-center font-heading text-[19px] font-semibold" style={{ color: colors.brandDark }}>
          {y}
        </span>
      ))}
      {vals.map((x) => (
        <span key={`r${x}`} className="contents">
          <span className="grid h-12 place-items-center font-heading text-[19px] font-semibold" style={{ color: colors.brandDark }}>
            {x}
          </span>
          {vals.map((y) => {
            const gold = k > 0 && x + y === x * y
            return (
              <span
                key={`${x}${y}`}
                className="grid h-12 place-items-center rounded-md text-[17px] font-semibold"
                style={{ background: gold ? '#FDE68A' : `${TONE.ok}22`, color: colors.ink, boxShadow: gold ? 'inset 0 0 0 2px #D97706' : undefined }}
              >
                {gold ? '★' : '✓'}
              </span>
            )
          })}
        </span>
      ))}
    </div>
  )
}

/** C37: six locks. */
function SixLocks() {
  const qs: [string, string][] = [
    ['Translate: "Every square number is non-negative" (S(x): x is a perfect square)', '∀x (S(x) → x ≥ 0)'],
    ['Translate: ∃x (P(x) ∧ ¬E(x)), P: prime, E: even', 'Some prime number is not even'],
    ['Free variables in ∀x (x < y) ∧ ∃y (y > 0)', 'The y in x < y'],
    ['Negate: ∀x ∃y (y > x)', '∃x ∀y (y ≤ x)'],
    ['Is ∀x ∃y (y > x) true over the integers?', 'Yes: y = x + 1'],
    ['Is ∃y ∀x (y > x) true over the integers?', 'No: no integer is larger than every integer'],
  ]
  const k = useBuild(qs.length)
  return (
    <div className="grid w-full grid-cols-3 gap-3">
      {qs.map(([q, a], i) => (
        <div key={q} className="flex min-h-[150px] flex-col rounded-card border-2 px-4 py-3" style={{ borderColor: i < k ? TONE.ok : colors.line, background: i < k ? `${TONE.ok}0F` : '#fff' }}>
          <span className="flex items-start gap-2 text-[17px] font-semibold" style={{ color: colors.ink }}>
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[16px] text-white" style={{ background: i < k ? colors.success : colors.brand }}>
              {i + 1}
            </span>
            {q}
          </span>
          {i < k && (
            <Fresh className="mt-2 block">
              <span className="font-heading text-[19px] font-semibold" style={{ color: TONE.ok }}>
                {a}
              </span>
            </Fresh>
          )}
        </div>
      ))}
    </div>
  )
}

/** A formula with part of it under a tinted "scope" band. */
function Scope({ q, inside, outside }: { q: string; inside: string; outside?: string }) {
  return (
    <span className="font-heading text-[28px] font-semibold" style={{ color: colors.ink }}>
      <span style={{ color: colors.brandDark }}>{q}</span>{' '}
      <span className="relative inline-block rounded-md px-1" style={{ background: `${colors.brand}22`, boxShadow: `inset 0 -4px 0 ${colors.brand}` }}>
        {inside}
      </span>
      {outside && (
        <span className="ml-2 rounded-md px-1" style={{ background: `${TONE.warn}22` }}>
          {outside}
        </span>
      )}
    </span>
  )
}

/* ── the deck ───────────────────────────────────────────────────────────── */

export const predicateCalculusDeck: SlideDef[] = [
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
          { title: C1, sub: 'Why p, q and r are not enough' },
          { title: C2, sub: 'Variables, domains, universe' },
          { title: C3, sub: 'For all and there exists' },
          { title: C4, sub: 'All, some, none, not all' },
          { title: C5, sub: 'Reading formulas naturally' },
          { title: C6, sub: 'Scope of a quantifier' },
          { title: C7, sub: 'When ¬ jumps a quantifier' },
          { title: C8, sub: 'Two quantifiers and their order' },
        ]}
      />
    ),
  },

  /* ── CONCEPT 1 ───────────────────────────────────────────────────────── */
  { id: 'c1-divider', section: C1, label: 'Divider', element: <SectionBreakerSlide index={1} title={C1} lesson={SESSION} /> },
  {
    id: 'c1-gap',
    section: C1,
    label: 'A Gap in Our Logic',
    element: (
      <ContentSlide kicker={C1} title="A Gap in Our Logic" lead="Think First: can the rules of inference give 8 is divisible by 2?" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="grid grid-cols-2 gap-5">
            {[
              ['p', 'Every even number is divisible by 2', '2 ✓  4 ✓  6 ✓  8 ✓  …'],
              ['q', '8 is an even number', '8'],
            ].map(([l, s, inside]) => (
              <Card key={l}>
                <span className="inline-grid h-12 w-12 place-items-center rounded-lg font-heading text-[24px] font-semibold text-white" style={{ background: colors.ink }}>
                  {l}
                </span>
                <Txt className="mt-2">{s}</Txt>
                <Step>
                  <div className="mt-2 rounded-lg px-3 py-2 font-heading text-[20px] font-semibold" style={{ background: '#0F1B2D', color: '#86EFAC' }}>
                    X-ray: {inside}
                  </div>
                </Step>
              </Card>
            ))}
          </div>
          <Step>
            <Callout kind="warning" title="Sealed boxes" asStep={false}>
              In propositional logic p and q are unrelated letters. The missing piece: p talks about every even number, and 8 is one of them
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Propositional logic treats each sentence as a sealed box. Today we open the box and look at the subject, the property and the word every." The conclusion is obviously correct, yet no rule connects p and q.',
  },
  {
    id: 'c1-socrates',
    section: C1,
    label: 'All Humans Are Mortal',
    element: (
      <ContentSlide kicker={C1} title="All Humans Are Mortal" lead="An argument propositional logic cannot check" lesson={SESSION}>
        <div className="w-full space-y-3">
          <div className="grid grid-cols-3 gap-4">
            {[
              ['All humans are mortal', 'p', 'The words "all" and "humans"'],
              ['Socrates is a human', 'q', 'That Socrates is one of the humans'],
              ['∴ Socrates is mortal', 'r', 'The link between p, q and r'],
            ].map(([s, l, lost], i) => (
              <Step key={l}>
                <Card className="h-full">
                  <Label>Panel {i + 1}</Label>
                  <Big>{s}</Big>
                  <Txt className="mt-1">As a proposition: {l}</Txt>
                  <Txt className="mt-1 font-semibold" >Lost: {lost}</Txt>
                </Card>
              </Step>
            ))}
          </div>
          <Step>
            <Callout kind="error" title="p, q ∴ r is invalid" asStep={false}>
              Take p and q true and r false. Yet everyone agrees the argument is valid: we need a logic that sees inside statements
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"This is the oldest example of reasoning in logic textbooks. It motivates predicates and quantifiers." The propositional logic robot is confused.',
  },
  {
    id: 'c1-ingredients',
    section: C1,
    label: 'Two New Ingredients',
    element: (
      <ContentSlide kicker={C1} title="Two New Ingredients" lead="What predicate logic adds to the toolbox" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Label>Old tools</Label>
            {['¬', '∧', '∨', '→', '↔'].map((t) => (
              <Chip key={t} tone="plain">
                {t}
              </Chip>
            ))}
          </div>
          <StepCards
            cols={3}
            items={[
              ['Predicate P(x)', 'A property or relation: is even, is mortal, is greater than'],
              ['Variables x, y', 'Stand for objects'],
              ['Quantifiers ∀, ∃', 'For all; there exists'],
            ]}
          />
          <Step>
            <Card tone="ok">
              <Label tone="ok">Every even number is divisible by 2</Label>
              <Big className="text-[28px]">∀x (E(x) → D(x))</Big>
            </Card>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"By the end of the session learners should be able to read and write formulas like ∀x (E(x) → D(x)) confidently."',
  },

  /* ── CONCEPT 2 ───────────────────────────────────────────────────────── */
  { id: 'c2-divider', section: C2, label: 'Divider', element: <SectionBreakerSlide index={2} title={C2} lesson={SESSION} /> },
  {
    id: 'c2-split',
    section: C2,
    label: 'Splitting a Sentence',
    element: (
      <ContentSlide kicker={C2} title="Splitting a Sentence" lead="The predicate is the property said about the subject" lesson={SESSION}>
        <div className="w-full space-y-3">
          {[
            ['Ravi', 'is a student', 'S(r)'],
            ['7', 'is prime', 'P(7)'],
            ['Hyderabad, Pune', 'is larger than', 'L(h, p)'],
          ].map(([sub, pred, sym]) => (
            <Step key={sym} className="flex items-center gap-3">
              <span className="w-[230px] rounded-lg px-4 py-2 font-heading text-[20px] font-semibold text-white" style={{ background: colors.brand }}>
                {sub}
              </span>
              <span className="w-[230px] rounded-lg px-4 py-2 font-heading text-[20px] font-semibold text-white" style={{ background: '#EA580C' }}>
                {pred}
              </span>
              <Arrow />
              <Chip big>{sym}</Chip>
            </Step>
          ))}
          <div className="flex gap-6 pt-1">
            <Light tone="brand" text="subject" />
            <span className="inline-flex items-center gap-2 font-heading text-[18px] font-semibold" style={{ color: '#EA580C' }}>
              <span className="h-5 w-5 rounded-full" style={{ background: '#EA580C' }} />
              predicate
            </span>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"Capital letters name predicates; the objects go inside brackets. This notation is from Tremblay and Manohar and the reference deck W1_S4."',
  },
  {
    id: 'c2-function',
    section: C2,
    label: 'Sentences With a Blank',
    element: (
      <ContentSlide kicker={C2} title="Sentences With a Blank" lead="A statement function P(x) becomes a statement when x is replaced by an object" lesson={SESSION}>
        <div className="w-full space-y-4">
          <Card>
            <Label>P(x): x &gt; 3</Label>
            <div className="mt-3 grid grid-cols-3 gap-4">
              {[
                ['5', 'P(5): true', 'ok'],
                ['2', 'P(2): false', 'bad'],
                ['__', 'P(x): no truth value yet', 'grey'],
              ].map(([tile, text, tone]) => (
                <Step key={tile} className="flex items-center gap-3">
                  <span className="grid h-14 w-14 place-items-center rounded-lg border-2 border-dashed font-heading text-[24px] font-semibold" style={{ borderColor: colors.brand, color: colors.ink }}>
                    {tile}
                  </span>
                  <Light tone={tone as Tone} text={text} />
                </Step>
              ))}
            </div>
          </Card>
          <Step>
            <Callout kind="info" title="Not a statement on its own" asStep={false}>
              P(x) is neither true nor false until x is filled in
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Many books call this a propositional function. The reference deck uses that name."',
  },
  {
    id: 'c2-places',
    section: C2,
    label: 'n-Place Predicates',
    element: (
      <ContentSlide kicker={C2} title="n-Place Predicates" lead="P(x₁, x₂, …, xₙ) has n places: a relation between objects" lesson={SESSION}>
        <div className="grid w-full grid-cols-3 gap-4">
          {[
            [1, 'P(x): x is prime', 'P(7) true, P(8) false'],
            [2, 'P(x, y): x + y > 0', 'P(−1, 1) false, P(1, 1) true'],
            [3, 'B(x, y, z): x is between y and z', 'B(5, 1, 9) true'],
          ].map(([n, p, ex]) => (
            <Step key={n as number}>
              <Card className="h-full">
                <div className="flex gap-2">
                  {Array.from({ length: n as number }, (_, i) => (
                    <span key={i} className="h-8 w-4 rounded-sm" style={{ background: colors.ink }} />
                  ))}
                  <span className="ml-2 font-heading text-[18px] font-semibold" style={{ color: colors.brandDark }}>
                    {n}-pin socket
                  </span>
                </div>
                <Big className="mt-3">{p}</Big>
                <Txt className="mt-1">{ex}</Txt>
              </Card>
            </Step>
          ))}
        </div>
      </ContentSlide>
    ),
    notes: '"The P(x, y): x + y > 0 example is from W1_S4. Ask learners for a 2-place predicate from everyday life: x is a friend of y."',
  },
  {
    id: 'c2-domain',
    section: C2,
    label: 'Where Can x Come From?',
    element: (
      <ContentSlide kicker={C2} title="Where Can x Come From?" lead="Each variable takes values from its domain" lesson={SESSION}>
        <div className="w-full space-y-3">
          <StepCards
            cols={2}
            items={[
              ['Domain', 'The set a variable takes its values from'],
              ['Universe of discourse', 'The domain for all the variables in a discussion'],
            ]}
          />
          <div className="grid grid-cols-2 gap-4">
            <Step>
              <Card tone="bad">
                <Label tone="bad">Playground: integers</Label>
                <Big>"x² = 2 has a solution"</Big>
                <Light tone="bad" text="false" />
              </Card>
            </Step>
            <Step>
              <Card tone="ok">
                <Label tone="ok">Playground: real numbers</Label>
                <Big>"x² = 2 has a solution"</Big>
                <Light tone="ok" text="true: x = √2" />
              </Card>
            </Step>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"Always state the universe of discourse. Without it, many questions have no definite answer." The same formula can be true in one domain and false in another.',
  },
  {
    id: 'c2-universe',
    section: C2,
    label: 'Choosing the Universe',
    element: (
      <ContentSlide kicker={C2} title="Choosing the Universe" lead="Turn the universe dial and the truth value can flip" lesson={SESSION}>
        <RevealTable
          keep={2}
          columns={[{ label: 'Statement', weight: 1.4 }, { label: 'Universe', weight: 1.2 }, { label: 'Truth value', weight: 1 }]}
          rows={[
            ['Every x has x ≥ 0', 'Natural numbers {0, 1, 2, …}', <Lit v="True" tone="ok" />],
            ['Every x has x ≥ 0', 'Integers', <Lit v="False (x = −1)" tone="bad" />],
            ['Some x satisfies 3x + 2 = 8', 'Integers', <Lit v="True (x = 2)" tone="ok" />],
            ['Some x satisfies 2x = 1', 'Integers', <Lit v="False" tone="bad" />],
            ['Some x satisfies 2x = 1', 'Rationals', <Lit v="True (x = 1/2)" tone="ok" />],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"The 3x + 2 = 8 example is from W1_S4."',
  },
  {
    id: 'c2-practice',
    section: C2,
    label: 'Statement or Statement Function?',
    element: (
      <ContentSlide kicker={C2} title="Statement or Statement Function?" lead="Hold up grey, green or red, then reveal" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Expression', weight: 1.3 }, { label: 'Answer', weight: 1.7 }]}
          rows={[
            ['x is a multiple of 5', <Lit v="Statement function: no truth value until x is known" tone="grey" />],
            ['15 is a multiple of 5', <Lit v="Statement: true" tone="ok" />],
            ['P(x, y): x < y; find P(2, 7)', <Lit v="True" tone="ok" />],
            ['P(x, y): x < y; find P(7, 2)', <Lit v="False" tone="bad" />],
            ['"x is greater than 10", universe {1, 2, 3}', <Lit v="Statement function; false for every value here" tone="grey" />],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"The last row shows that a statement function can be false for every value and still not be a statement on its own."',
  },

  /* ── CONCEPT 3 ───────────────────────────────────────────────────────── */
  { id: 'c3-divider', section: C3, label: 'Divider', element: <SectionBreakerSlide index={3} title={C3} lesson={SESSION} /> },
  {
    id: 'c3-quantifiers',
    section: C3,
    label: 'For All and There Exists',
    element: (
      <ContentSlide kicker={C3} title="For All and There Exists" lead="Both turn a statement function into a statement" lesson={SESSION}>
        <div className="grid w-full grid-cols-2 gap-5">
          <Step>
            <Card className="h-full">
              <Label>∀x P(x): for all x</Label>
              <Txt>P(x) is true for every x in the universe</Txt>
              <div className="my-3 flex gap-2">
                {['✓', '✓', '✓', '✗', '✓'].map((m, i) => (
                  <span key={i} className="grid h-10 w-10 place-items-center rounded-lg text-[20px] font-semibold" style={{ background: m === '✓' ? `${TONE.ok}22` : `${TONE.bad}22`, color: m === '✓' ? TONE.ok : TONE.bad }}>
                    {m}
                  </span>
                ))}
              </div>
              <Txt>Roll call: one absence (a counterexample) makes it false</Txt>
              <Txt className="mt-1 font-semibold">Reals: ∀x (x² ≥ 0) is true</Txt>
            </Card>
          </Step>
          <Step>
            <Card className="h-full">
              <Label>∃x P(x): there exists x</Label>
              <Txt>P(x) is true for at least one x</Txt>
              <div className="my-3 flex gap-2">
                {['', '', '●', '', ''].map((m, i) => (
                  <span key={i} className="grid h-10 w-10 place-items-center rounded-lg border-2 text-[20px]" style={{ borderColor: m ? '#D97706' : colors.line, color: '#D97706', background: m ? '#FEF3C7' : '#fff' }}>
                    {m}
                  </span>
                ))}
              </div>
              <Txt>Treasure hunt: the first coin (a witness) makes it true</Txt>
              <Txt className="mt-1 font-semibold">Integers: ∃x (3x + 2 = 8) true, witness 2; ∃x (x = x + 3) false</Txt>
            </Card>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes:
      '∀: over the complex numbers x² ≥ 0 fails, x = i gives i² = −1. W1_S4 uses x² > 0; x = 0 is a counterexample to that over the integers. ∃: both examples are from W1_S4. Ask: why is ∃x (x = x + 3) false? Subtracting x gives 0 = 3.',
  },
  {
    id: 'c3-finite',
    section: C3,
    label: 'A Big AND, a Big OR',
    element: (
      <ContentSlide kicker={C3} title="A Big AND, a Big OR" lead="Universe {1, 2, 3},  P(x): x < 3" lesson={SESSION}>
        <div className="w-full space-y-4">
          <Step>
            <Card>
              <Label>∀x P(x) = P(1) ∧ P(2) ∧ P(3): switches in series</Label>
              <div className="mt-2 flex items-center gap-6">
                <Switches parallel={false} />
                <Txt className="font-semibold">T ∧ T ∧ F = false (counterexample 3)</Txt>
              </div>
            </Card>
          </Step>
          <Step>
            <Card>
              <Label>∃x P(x) = P(1) ∨ P(2) ∨ P(3): switches in parallel</Label>
              <div className="mt-2 flex items-center gap-6">
                <Switches parallel />
                <Txt className="font-semibold">T ∨ T ∨ F = true (witnesses 1 and 2)</Txt>
              </div>
            </Card>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"This links quantifiers back to ∧ and ∨ from the Connectives session, and explains De Morgan\'s laws for quantifiers later."',
  },
  {
    id: 'c3-truth',
    section: C3,
    label: 'Truth Conditions',
    element: (
      <ContentSlide kicker={C3} title="Truth Conditions" lead="The judge's scorecard" lesson={SESSION}>
        <div className="w-full space-y-3">
          <DataTable
            className="w-full"
            compact
            stepped
            columns={[{ label: 'Statement', weight: 0.6 }, { label: 'True when', weight: 1.4 }, { label: 'False when', weight: 1.6 }]}
            rows={[
              ['∀x P(x)', 'P(x) is true for every x', 'Some x has P(x) false: a counterexample'],
              ['∃x P(x)', 'Some x has P(x) true: a witness', 'P(x) is false for every x'],
            ]}
          />
          <div className="grid grid-cols-2 gap-4">
            <Step>
              <Card tone="ok">
                <Label tone="ok">Prove</Label>
                <Txt>∀: argue for an arbitrary x</Txt>
                <Txt>∃: show one witness</Txt>
              </Card>
            </Step>
            <Step>
              <Card tone="bad">
                <Label tone="bad">Disprove</Label>
                <Txt>∀: show one counterexample</Txt>
                <Txt>∃: show P(x) fails for every x</Txt>
              </Card>
            </Step>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"Exam hook: one example never proves a ∀ statement, but one counterexample always disproves it."',
  },
  {
    id: 'c3-equivalences',
    section: C3,
    label: 'Which Equivalences Hold?',
    element: (
      <ContentSlide kicker={C3} title="Which Equivalences Hold?" lead="∀ goes with ∧, ∃ goes with ∨" lesson={SESSION}>
        <div className="w-full space-y-3">
          <RevealTable
            columns={[{ label: 'Equivalence', weight: 3 }, { label: 'Holds?', weight: 0.7 }]}
            rows={[
              ['∀x (P(x) ∧ Q(x)) ≡ ∀x P(x) ∧ ∀x Q(x)', <Lit v="Yes" tone="ok" />],
              ['∃x (P(x) ∨ Q(x)) ≡ ∃x P(x) ∨ ∃x Q(x)', <Lit v="Yes" tone="ok" />],
              ['∀x (P(x) ∨ Q(x)) ≡ ∀x P(x) ∨ ∀x Q(x)', <Lit v="No" tone="bad" />],
              ['∃x (P(x) ∧ Q(x)) ≡ ∃x P(x) ∧ ∃x Q(x)', <Lit v="No" tone="bad" />],
            ]}
          />
          <Step>
            <Card>
              <div className="flex flex-wrap items-center gap-2">
                {[-3, -2, -1, 0, 1, 2, 3, 4].map((n) => (
                  <span key={n} className="grid h-11 w-11 place-items-center rounded-lg font-heading text-[19px] font-semibold text-white" style={{ background: n % 2 === 0 ? colors.brand : '#EA580C' }}>
                    {n}
                  </span>
                ))}
                <Txt className="ml-2">Every integer is even (blue) or odd (orange), yet neither all are even nor all are odd</Txt>
              </div>
            </Card>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"W1_S4 makes the same point with P: even, Q: positive. Ask learners to find a counterexample to the last row using the same idea." (Some integer is even and some is odd, but none is both.)',
  },
  {
    id: 'c3-practice',
    section: C3,
    label: 'Witness or Counterexample?',
    element: (
      <ContentSlide kicker={C3} title="Witness or Counterexample?" lead="Universe: integers. Swipe right for true, left for false" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Statement', weight: 1.2 }, { label: 'Answer', weight: 1.3 }]}
          rows={[
            ['∀x (x + 0 = x)', <Lit v="True" tone="ok" />],
            ['∀x (x² > x)', <Lit v="False: x = 0 or x = 1" tone="bad" />],
            ['∃x (x² = 49)', <Lit v="True: x = 7 (or −7)" tone="ok" />],
            ['∃x (x² = −1)', <Lit v="False" tone="bad" />],
            ['∀x (2x is even)', <Lit v="True" tone="ok" />],
            ['∃x (x > 100 ∧ x < 101)', <Lit v="False" tone="bad" />],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"Ask learners to name the witness or counterexample every time, not just the truth value."',
  },
  { id: 'quiz-1', section: C3, label: 'Quiz Time', element: <QuizTimeSlide lesson={SESSION} /> },

  /* ── CONCEPT 4 ───────────────────────────────────────────────────────── */
  { id: 'c4-divider', section: C4, label: 'Divider', element: <SectionBreakerSlide index={4} title={C4} lesson={SESSION} /> },
  {
    id: 'c4-pairing',
    section: C4,
    label: 'All Uses →, Some Uses ∧',
    element: (
      <ContentSlide kicker={C4} title="All Uses →, Some Uses ∧" lead="Universe: all people. S(x): x is a student; L(x): x studies logic" lesson={SESSION}>
        <div className="grid w-full grid-cols-2 gap-5">
          <Step>
            <Card tone="ok" className="h-full">
              <Label tone="ok">"All students study logic"</Label>
              <Big className="text-[26px]">∀x (S(x) → L(x))</Big>
              <Txt className="mt-1">The spotlight checks only the students; non-students are ignored</Txt>
              <div className="mt-3 rounded-lg px-3 py-2" style={{ background: `${TONE.bad}10` }}>
                <Txt>
                  <b style={{ color: TONE.bad }}>Not</b> ∀x (S(x) ∧ L(x)): everyone is a student and studies logic
                </Txt>
              </div>
            </Card>
          </Step>
          <Step>
            <Card tone="ok" className="h-full">
              <Label tone="ok">"Some students study logic"</Label>
              <Big className="text-[26px]">∃x (S(x) ∧ L(x))</Big>
              <Txt className="mt-1">One witness: a student holding a logic book</Txt>
              <div className="mt-3 rounded-lg px-3 py-2" style={{ background: `${TONE.bad}10` }}>
                <Txt>
                  <b style={{ color: TONE.bad }}>Not</b> ∃x (S(x) → L(x)): true for a silly reason, as soon as any non-student exists
                </Txt>
              </div>
            </Card>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"This is the single most important translation rule: all A are B becomes ∀x (A(x) → B(x))." "Pairing rule: ∀ goes with →, ∃ goes with ∧. Ask learners to say it aloud."',
  },
  {
    id: 'c4-none',
    section: C4,
    label: 'None and Not All',
    element: (
      <ContentSlide kicker={C4} title="None and Not All" lead="Two negative statements, each with an equivalent form" lesson={SESSION}>
        <div className="grid w-full grid-cols-2 gap-5">
          {[
            ['"No student fails logic"', '∀x (S(x) → ¬F(x))', '¬∃x (S(x) ∧ F(x))', '0 fails: about every student', 'ok'],
            ['"Not all students pass logic"', '¬∀x (S(x) → P(x))', '∃x (S(x) ∧ ¬P(x))', 'At least one student did not pass', 'warn'],
          ].map(([e, f, g, stamp, t]) => (
            <Step key={e}>
              <Card tone={t as Tone} className="h-full">
                <Label tone={t as Tone}>{stamp}</Label>
                <Big>{e}</Big>
                <Big className="mt-2 text-[24px]">{f}</Big>
                <Txt className="mt-1">same as {g}</Txt>
              </Card>
            </Step>
          ))}
        </div>
      </ContentSlide>
    ),
    notes: '"The equivalent forms preview the negation rules in Section 7."',
  },
  {
    id: 'c4-four',
    section: C4,
    label: 'The Four Standard Forms',
    element: (
      <ContentSlide kicker={C4} title="The Four Standard Forms" lead="All, no, some, some not" lesson={SESSION}>
        <div className="grid w-full grid-cols-2 gap-4">
          {[
            ['Universal affirmative', 'All A are B', '∀x (A(x) → B(x))'],
            ['Universal negative', 'No A is B', '∀x (A(x) → ¬B(x))'],
            ['Particular affirmative', 'Some A are B', '∃x (A(x) ∧ B(x))'],
            ['Particular negative', 'Some A are not B', '∃x (A(x) ∧ ¬B(x))'],
          ].map(([n, e, f]) => (
            <Step key={n}>
              <Card>
                <Label>{n}</Label>
                <Txt>{e}</Txt>
                <Big className="mt-1 text-[24px]">{f}</Big>
              </Card>
            </Step>
          ))}
        </div>
      </ContentSlide>
    ),
    notes: '"These four forms come from classical logic and cover most textbook translation questions." They sit at the corners of the classical square.',
  },
  {
    id: 'c4-maths',
    section: C4,
    label: 'Mathematical Sentences',
    element: (
      <ContentSlide kicker={C4} title="Mathematical Sentences" lead="Universe: integers. E: even, D: divisible by 2, P: prime" lesson={SESSION}>
        <div className="w-full space-y-2 rounded-card px-5 py-4" style={{ background: '#1F3B2D' }}>
          {[
            ['Every even number is divisible by 2', '∀x (E(x) → D(x))'],
            ['Some prime number is even', '∃x (P(x) ∧ E(x))'],
            ['No prime number is divisible by 4', '∀x (P(x) → ¬F(x)),  F(x): x is divisible by 4'],
            ['Not every prime is odd', '∃x (P(x) ∧ ¬O(x)),  O(x): x is odd'],
          ].map(([e, f]) => (
            <Step key={e} className="border-b border-white/15 pb-2 last:border-0">
              <span className="block text-[19px]" style={{ color: '#F8FAFC' }}>
                {e}
              </span>
              <span className="block font-heading text-[22px] font-semibold" style={{ color: '#FDE047' }}>
                {f}
              </span>
            </Step>
          ))}
        </div>
      </ContentSlide>
    ),
    notes: '"The first row answers the first slide. Now, with 8 as a value of x, the rules of inference can reach D(8)."',
  },
  {
    id: 'c4-everyday',
    section: C4,
    label: 'Everyday Sentences',
    element: (
      <ContentSlide kicker={C4} title="Everyday Sentences" lead="Universe: all people" lesson={SESSION}>
        <div className="grid w-full grid-cols-2 gap-3">
          {[
            ['Every engineer knows maths', '∀x (E(x) → M(x))'],
            ['Some engineers play chess', '∃x (E(x) ∧ C(x))'],
            ['Nobody likes traffic jams', '∀x ¬L(x)  or  ¬∃x L(x)'],
            ['Everybody loves somebody', '∀x ∃y L(x, y)  (nested: Section 8)'],
            ['Only students can enter the library', '∀x (E(x) → S(x)),  E(x): x can enter'],
          ].map(([e, f]) => (
            <Step key={e}>
              <div className="rounded-2xl rounded-bl-none border border-line bg-white px-4 py-2 shadow-card-soft">
                <Txt>{e}</Txt>
                <Big className="text-[20px]">{f}</Big>
              </div>
            </Step>
          ))}
        </div>
      </ContentSlide>
    ),
    notes: '"Only A are B reverses the arrow: only students can enter means anyone who enters is a student."',
  },
  {
    id: 'c4-practice',
    section: C4,
    label: 'Translate to Symbols',
    element: (
      <ContentSlide kicker={C4} title="Translate to Symbols" lead="Universe: animals. B: bird, F: can fly, P: penguin" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Zoo sign', weight: 1.3 }, { label: 'Answer', weight: 1 }]}
          rows={[
            ['All birds can fly', '∀x (B(x) → F(x))'],
            ['Some birds cannot fly', '∃x (B(x) ∧ ¬F(x))'],
            ['No penguin can fly', '∀x (P(x) → ¬F(x))'],
            ['Every penguin is a bird', '∀x (P(x) → B(x))'],
            ['Some animals that fly are not birds', '∃x (F(x) ∧ ¬B(x))'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"Ask: is All birds can fly true? No: penguins are a counterexample. Translation is separate from truth."',
  },

  /* ── CONCEPT 5 ───────────────────────────────────────────────────────── */
  { id: 'c5-divider', section: C5, label: 'Divider', element: <SectionBreakerSlide index={5} title={C5} lesson={SESSION} /> },
  {
    id: 'c5-naturally',
    section: C5,
    label: 'Say It Naturally',
    element: (
      <ContentSlide kicker={C5} title="Say It Naturally" lead="First the literal reading, then good English" lesson={SESSION}>
        <div className="w-full space-y-3">
          {[
            ['∀x (S(x) → L(x))', 'For every x, if x is a student then x studies logic', 'Every student studies logic'],
            ['∃x (S(x) ∧ ¬L(x))', 'There is an x that is a student and does not study logic', 'Some student does not study logic'],
            ['¬∃x (S(x) ∧ C(x))', 'It is not the case that some x is a student and cheats', 'No student cheats'],
          ].map(([f, lit, nat]) => (
            <Step key={f}>
              <div className="grid grid-cols-[250px_1fr] items-center gap-4 rounded-card border border-line bg-white px-4 py-3 shadow-card-soft">
                <span className="rounded-lg px-3 py-2 font-heading text-[20px] font-semibold" style={{ background: `${colors.brand}14`, color: colors.ink }}>
                  {f}
                </span>
                <span>
                  <span className="block text-[18px]" style={{ color: TONE.grey }}>
                    {lit}
                  </span>
                  <span className="block font-heading text-[21px] font-semibold" style={{ color: colors.ink }}>
                    {nat}
                  </span>
                </span>
              </div>
            </Step>
          ))}
        </div>
      </ContentSlide>
    ),
    notes: '"Encourage two steps: first the literal reading, then a smooth sentence with the same meaning."',
  },
  {
    id: 'c5-friends',
    section: C5,
    label: 'Computers and Friends',
    element: (
      <ContentSlide kicker={C5} title="Computers and Friends" lead="∀x (C(x) ∨ ∃y (C(y) ∧ F(x, y)))" lesson={SESSION}>
        <div className="grid w-full grid-cols-[1fr_1.1fr] items-start gap-5">
          <div className="space-y-2">
            {[
              ['Asha', true, ''],
              ['Bala', false, 'friend of Asha'],
              ['Chitra', true, ''],
              ['Dev', false, 'friend of Chitra'],
            ].map(([n, c, f]) => (
              <div key={n as string} className="flex items-center gap-3 rounded-xl border border-line bg-white px-3 py-2">
                <span className="grid h-9 w-9 place-items-center rounded-full font-heading text-[16px] font-semibold text-white" style={{ background: c ? colors.success : colors.brand }}>
                  {(n as string)[0]}
                </span>
                <span className="text-[19px] font-semibold" style={{ color: colors.ink }}>
                  {n as string}
                </span>
                <span className="text-[18px]" style={{ color: c ? TONE.ok : colors.ink }}>
                  {c ? 'has a computer' : `→ ${f as string}, who has one`}
                </span>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <Card>
              <Label>Universe: students in your school</Label>
              <Txt>C(x): x has a computer; F(x, y): x and y are friends</Txt>
            </Card>
            <Step>
              <Card>
                <Label>Literal</Label>
                <Txt>For every student x, x has a computer, or there is a student y who has a computer and is a friend of x</Txt>
              </Card>
            </Step>
            <Step>
              <Card tone="ok">
                <Label tone="ok">Natural</Label>
                <Big>Every student has a computer or has a friend who has a computer</Big>
              </Card>
            </Step>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"This exercise is from the reference deck W1_S5. It also previews nested quantifiers in Section 8."',
  },
  {
    id: 'c5-practice',
    section: C5,
    label: 'Formulas to Sentences',
    element: (
      <ContentSlide kicker={C5} title="Formulas to Sentences" lead="Universe: all people. T: teacher, K: kind, H: happy" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Formula', weight: 1 }, { label: 'Natural English', weight: 1.2 }]}
          rows={[
            ['∀x (T(x) → K(x))', 'All teachers are kind'],
            ['∃x (T(x) ∧ ¬H(x))', 'Some teacher is not happy'],
            ['∀x (K(x) → H(x))', 'Every kind person is happy'],
            ['¬∀x H(x)', 'Not everyone is happy'],
            ['∃x (T(x) ∧ K(x) ∧ H(x))', 'Some teacher is kind and happy'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"Accept any natural phrasing with the same meaning."',
  },

  /* ── CONCEPT 6 ───────────────────────────────────────────────────────── */
  { id: 'c6-divider', section: C6, label: 'Divider', element: <SectionBreakerSlide index={6} title={C6} lesson={SESSION} /> },
  {
    id: 'c6-scope',
    section: C6,
    label: 'How Far Does ∀ Reach?',
    element: (
      <ContentSlide kicker={C6} title="How Far Does ∀ Reach?" lead="The scope: the smallest formula right after the quantifier" lesson={SESSION}>
        <div className="w-full space-y-4">
          <Step>
            <Card>
              <Label>Umbrella over the whole bracket</Label>
              <Scope q="∀x" inside="(P(x) → Q(x))" />
              <Txt className="mt-1">Scope of ∀x: P(x) → Q(x)</Txt>
            </Card>
          </Step>
          <Step>
            <Card>
              <Label tone="warn">Umbrella over P(x) only</Label>
              <Scope q="∀x" inside="P(x)" outside="→ Q(x)" />
              <Txt className="mt-1">Scope of ∀x: only P(x). Q(x) is left out in the rain</Txt>
            </Card>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Brackets change meaning. When in doubt, add brackets to show the scope clearly."',
  },
  {
    id: 'c6-bound',
    section: C6,
    label: 'Is the Variable Captured?',
    element: (
      <ContentSlide kicker={C6} title="Is the Variable Captured?" lead="Bound: inside the scope of ∀x or ∃x. Free: otherwise" lesson={SESSION}>
        <div className="w-full space-y-3">
          <DataTable
            className="w-full"
            compact
            stepped
            columns={[{ label: 'Formula', weight: 1.2 }, { label: 'Bound (on a string)', weight: 1 }, { label: 'Free (loose)', weight: 1 }]}
            rows={[
              ['∀x P(x, y)', <Lit v="x" tone="ok" />, <Lit v="y" tone="warn" />],
              ['∃x (P(x) ∧ Q(x))', <Lit v="both x's" tone="ok" />, 'none'],
              ['∀x P(x) ∧ Q(x)', <Lit v="x in P(x)" tone="ok" />, <Lit v="x in Q(x)" tone="warn" />],
            ]}
          />
          <Step>
            <Callout kind="info" title="Statement or statement function?" asStep={false}>
              A formula with a free variable is still a statement function; with no free variables it is a statement
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"The third row is tricky: the same letter x is bound in one place and free in another. Its two x\'s are unrelated."',
  },
  {
    id: 'c6-rename',
    section: C6,
    label: 'The Name Does Not Matter',
    element: (
      <ContentSlide kicker={C6} title="The Name Does Not Matter" lead="Bound variables are placeholders" lesson={SESSION}>
        <div className="grid w-full grid-cols-[1fr_1.2fr] items-start gap-5">
          <Card>
            <Label>Find and replace (within the scope)</Label>
            <div className="mt-2 space-y-2">
              <div className="rounded-lg border border-line px-3 py-2 text-[19px]" style={{ color: colors.ink }}>
                Find: <b>x</b> &nbsp; Replace: <b>y</b>
              </div>
              <Big>∀x P(x) &nbsp;=&nbsp; ∀y P(y)</Big>
            </div>
          </Card>
          <StepCards
            items={[
              ['Rename consistently', 'Within its scope, the meaning does not change'],
              ['Avoid confusion', '∀x P(x) ∧ Q(x) is clearer as ∀y P(y) ∧ Q(x)'],
              ['Free variables cannot be renamed', 'P(x) and P(z) are different statement functions'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"Bound variables behave like the loop variable in a for-loop: its name is local to the loop." Recipe picture: take an egg, crack the egg, fry the egg; swapping egg for item throughout changes nothing.',
  },
  {
    id: 'c6-practice',
    section: C6,
    label: 'Free or Bound?',
    element: (
      <ContentSlide kicker={C6} title="Free or Bound?" lead="Highlight bound occurrences green and free ones pink" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Formula', weight: 1.3 }, { label: 'Free variables', weight: 0.9 }, { label: 'Statement or function?', weight: 1 }]}
          rows={[
            ['∀x (x + y = y + x)', 'y', 'Statement function'],
            ['∃x ∀y (x ≤ y)', 'None', 'Statement'],
            ['∀x (P(x) → Q(x)) ∨ R(y)', 'y', 'Statement function'],
            ['∃y (P(x, y) ∧ ∀x Q(x))', 'x (in P(x, y))', 'Statement function'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"In the last row, the x inside ∀x Q(x) is bound, but the x in P(x, y) is free."',
  },

  /* ── CONCEPT 7 ───────────────────────────────────────────────────────── */
  { id: 'c7-divider', section: C7, label: 'Divider', element: <SectionBreakerSlide index={7} title={C7} lesson={SESSION} /> },
  {
    id: 'c7-flip',
    section: C7,
    label: 'The Quantifier Flips',
    element: (
      <ContentSlide kicker={C7} title="The Quantifier Flips" lead="When ¬ jumps over a quantifier, ∀ and ∃ swap" lesson={SESSION}>
        <div className="w-full space-y-4">
          {[
            ['¬∀x P(x)', '∃x ¬P(x)', '"Not everyone…" = "someone does not…"'],
            ['¬∃x P(x)', '∀x ¬P(x)', '"No one…" = "everyone does not…"'],
          ].map(([a, b, w]) => (
            <Step key={a}>
              <div className="flex flex-wrap items-center gap-3">
                <Chip big>{a}</Chip>
                <Arrow label="¬ hops, pad flips" />
                <Chip tone="ok" big>
                  {b}
                </Chip>
                <Txt className="ml-2">{w}</Txt>
              </div>
            </Step>
          ))}
        </div>
      </ContentSlide>
    ),
    notes: '"This is the rule of thumb from W1_S4. For a finite universe, it is just De Morgan\'s law for big ∧ and big ∨ (the switches slide)."',
  },
  {
    id: 'c7-classroom',
    section: C7,
    label: 'Negating Everyday Statements',
    element: (
      <ContentSlide kicker={C7} title="Negating Everyday Statements" lead="Universe: students in the class" lesson={SESSION}>
        <div className="grid w-full grid-cols-2 gap-5">
          {[
            ['∀x P(x)', 'Every student studied the reading material', '∃x ¬P(x)', 'Some student did not study the reading material', ['✓', '✓', '✗', '✓']],
            ['∃x Q(x)', 'Some student got a full score', '∀x ¬Q(x)', 'No student got a full score', ['✗', '✗', '✗', '✗']],
          ].map(([s, e, n, ne, marks]) => (
            <Step key={s as string}>
              <Card className="h-full">
                <Label>Register</Label>
                <Big>{s as string}</Big>
                <Txt>{e as string}</Txt>
                <div className="my-2 flex gap-2">
                  {(marks as string[]).map((m, i) => (
                    <span key={i} className="grid h-9 w-9 place-items-center rounded-md text-[18px] font-semibold" style={{ background: m === '✓' ? `${TONE.ok}22` : `${TONE.bad}22`, color: m === '✓' ? TONE.ok : TONE.bad }}>
                      {m}
                    </span>
                  ))}
                </div>
                <Big className="text-[24px]" >Negation: {n as string}</Big>
                <Txt className="font-semibold">{ne as string}</Txt>
              </Card>
            </Step>
          ))}
        </div>
      </ContentSlide>
    ),
    notes: '"A common wrong negation of every student studied is every student did not study. That is far too strong." Examples from W1_S4.',
  },
  {
    id: 'c7-machine',
    section: C7,
    label: 'Negating With → and ∧',
    element: (
      <ContentSlide kicker={C7} title="Negating With → and ∧" lead="The negation machine: push ¬ through, step by step" lesson={SESSION}>
        <div className="w-full space-y-3">
          <Lines
            lines={[
              ['¬∀x (S(x) → L(x))', 'Given: not all students study logic'],
              ['∃x ¬(S(x) → L(x))', 'Station 1: flip quantifier'],
              ['∃x ¬(¬S(x) ∨ L(x))', 'Station 2: remove →'],
              ['∃x (S(x) ∧ ¬L(x))', 'Station 3: De Morgan, double negation'],
            ]}
          />
          <Step>
            <Callout kind="success" title="Some student does not study logic" asStep={false}>
              The negation of a ∀ with → is an ∃ with ∧
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"This shows the pairing rule again: the negation of a ∀-with-→ is a ∃-with-∧."',
  },
  {
    id: 'c7-practice',
    section: C7,
    label: 'Write the Negation',
    element: (
      <ContentSlide kicker={C7} title="Write the Negation" lead="Symbols and English, then reveal the mirror side" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Statement', weight: 1.1 }, { label: 'Negation', weight: 1.6 }]}
          rows={[
            ['∀x (x² ≥ 0)', '∃x (x² < 0): some number has a negative square'],
            ['∃x (x is prime ∧ x is even)', '∀x (x is prime → x is not even): no prime is even'],
            ['All birds can fly: ∀x (B(x) → F(x))', '∃x (B(x) ∧ ¬F(x)): some bird cannot fly'],
            ['No student cheats: ∀x (S(x) → ¬C(x))', '∃x (S(x) ∧ C(x)): some student cheats'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"Then ask which of each pair is true over the obvious universe. Exactly one of a statement and its negation is true."',
  },

  /* ── CONCEPT 8 ───────────────────────────────────────────────────────── */
  { id: 'c8-divider', section: C8, label: 'Divider', element: <SectionBreakerSlide index={8} title={C8} lesson={SESSION} /> },
  {
    id: 'c8-same',
    section: C8,
    label: 'Two of the Same Kind',
    element: (
      <ContentSlide kicker={C8} title="Two of the Same Kind" lead="Universe: integers. Read left to right, like nested loops" lesson={SESSION}>
        <div className="grid w-full grid-cols-[auto_1fr] items-start gap-6">
          <SumProductGrid />
          <div className="space-y-3">
            <Card tone="ok">
              <Label tone="ok">∀x ∀y (x + y = y + x): every cell ✓</Label>
              <Txt>True: addition is commutative</Txt>
            </Card>
            <Step>
              <Card tone="warn">
                <Label tone="warn">∃x ∃y (x + y = x · y): gold ★ cells</Label>
                <Txt>True: x = y = 2, or x = y = 0</Txt>
              </Card>
            </Step>
            <Step>
              <Callout kind="info" title="Same kind can swap" asStep={false}>
                ∀x ∀y ≡ ∀y ∀x and ∃x ∃y ≡ ∃y ∃x
              </Callout>
            </Step>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"Nested quantifiers read from left to right, like nested loops in a program." The grid shows x and y from 0 to 3. From W1_S4.',
  },
  {
    id: 'c8-order',
    section: C8,
    label: 'Order Matters',
    element: (
      <ContentSlide kicker={C8} title="Order Matters" lead="Universe: integers.  P(x, y): x + y = 0" lesson={SESSION}>
        <div className="w-full space-y-3">
          <div className="grid grid-cols-2 gap-5">
            {[
              ['∀x ∃y P(x, y)', 'Every integer has an additive inverse', ['Opponent picks x', 'You answer y = −x'], 'You win: true', 'ok'],
              ['∃x ∀y P(x, y)', 'One integer adds to 0 with every y', ['You pick x', 'Opponent picks y ≠ −x'], 'You lose: false', 'bad'],
            ].map(([f, m, moves, res, t]) => (
              <Step key={f as string}>
                <Card tone={t as Tone} className="h-full">
                  <Big className="text-[26px]">{f as string}</Big>
                  <Txt>{m as string}</Txt>
                  <div className="my-2 flex flex-wrap items-center gap-2">
                    {(moves as string[]).map((mv, i) => (
                      <span key={mv} className="flex items-center gap-2">
                        <span className="rounded-lg border border-line bg-white px-3 py-1 text-[18px] font-semibold" style={{ color: colors.ink }}>
                          {i + 1}. {mv}
                        </span>
                      </span>
                    ))}
                  </div>
                  <Light tone={t as Tone} text={res as string} />
                </Card>
              </Step>
            ))}
          </div>
          <Step>
            <Callout kind="warning" title="∀ is the opponent's move, ∃ is yours" asStep={false}>
              In ∀x ∃y, y is chosen after x and may depend on it. In ∃x ∀y, x must work for all y at once
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"The game picture is powerful: ∀ is the opponent\'s move, ∃ is your move, and the order of moves is the order of the quantifiers."',
  },
  {
    id: 'c8-translate',
    section: C8,
    label: 'Nested Sentences',
    element: (
      <ContentSlide kicker={C8} title="Nested Sentences" lead="The outer quantifier is the outer folder" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'English', weight: 1.2 }, { label: 'Predicate logic (universe)', weight: 1.6 }]}
          rows={[
            ['The sum of two positive integers is always positive', '∀x ∀y ((x > 0 ∧ y > 0) → x + y > 0)  (integers)'],
            ['Every real number except zero has a multiplicative inverse', '∀x (x ≠ 0 → ∃y (x · y = 1))  (reals)'],
            ['Everybody loves somebody', '∀x ∃y L(x, y)  (people)'],
            ['Somebody is loved by everybody', '∃y ∀x L(x, y)  (people)'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"Rows 3 and 4 show again how order changes meaning: in row 4, one person is loved by everyone." Examples from W1_S5.',
  },
  {
    id: 'c8-negate',
    section: C8,
    label: 'Flip Every Quantifier',
    element: (
      <ContentSlide kicker={C8} title="Flip Every Quantifier" lead="¬∀x ∃y (xy = 1): the ¬ marble rolls inwards" lesson={SESSION}>
        <div className="w-full space-y-3">
          <Lines
            reasonW={260}
            lines={[
              ['¬∀x ∃y (xy = 1)', 'Given'],
              ['∃x ¬∃y (xy = 1)', 'Quantifier negation'],
              ['∃x ∀y ¬(xy = 1)', 'Quantifier negation'],
              ['∃x ∀y (xy ≠ 1)', 'Meaning of ¬'],
            ]}
          />
          <Step>
            <Callout kind="success" title="Over the real numbers, line 4 is true (x = 0)" asStep={false}>
              So ∀x ∃y (xy = 1) is false
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"This is the W1_S4 example. Every quantifier flips, and the ¬ lands on the innermost statement."',
  },
  {
    id: 'c8-errors',
    section: C8,
    label: 'What Went Wrong?',
    element: (
      <ContentSlide kicker={C8} title="What Went Wrong?" lead="Red edit marks, then the green fix" lesson={SESSION}>
        <div className="w-full space-y-2">
          {[
            ['"All students study": ∀x (S(x) ∧ L(x))', '∀ paired with ∧', '∀x (S(x) → L(x))'],
            ['"Some students study": ∃x (S(x) → L(x))', '∃ paired with →', '∃x (S(x) ∧ L(x))'],
            ['¬∀x P(x) ≡ ∀x ¬P(x)', 'Quantifier not flipped', '¬∀x P(x) ≡ ∃x ¬P(x)'],
            ['∀x ∃y P(x, y) ≡ ∃y ∀x P(x, y)', 'Different quantifiers swapped', 'Not equivalent (Order Matters)'],
            ['"∀x P(x) is true because P(1) and P(2) are true"', 'Examples do not prove ∀', 'Argue for an arbitrary x, or check a finite universe'],
          ].map(([w, e, f]) => (
            <Step key={w}>
              <div className="grid grid-cols-[1.3fr_0.9fr_1.2fr] items-center gap-3 rounded-card border border-line bg-white px-4 py-2 shadow-card-soft">
                <span className="text-[18px] line-through" style={{ color: TONE.bad, textDecorationThickness: 2 }}>
                  {w}
                </span>
                <span className="text-[17px]" style={{ color: colors.ink }}>
                  {e}
                </span>
                <span className="text-[18px] font-semibold" style={{ color: TONE.ok }}>
                  ✓ {f}
                </span>
              </div>
            </Step>
          ))}
        </div>
      </ContentSlide>
    ),
    notes: '"Rows 1 and 2 are the most frequent exam errors. Repeat: ∀ with →, ∃ with ∧."',
  },
  {
    id: 'c8-mixed',
    section: C8,
    label: 'Every Idea in One Set',
    element: (
      <ContentSlide kicker={C8} title="Every Idea in One Set" lead="Each answer opens one lock" lesson={SESSION}>
        <SixLocks />
      </ContentSlide>
    ),
    notes: '"Ask learners to connect rows 5 and 6 to the Order Matters slide: the same pattern, with order changing the truth value." Universe for row 1: integers.',
  },

  /* ── CLOSING ────────────────────────────────────────────────────────── */
  { id: 'quiz-2', section: 'Closing', label: 'Quiz Time', element: <QuizTimeSlide lesson={SESSION} /> },
  { id: 'takeaways', section: 'Closing', label: 'Key Takeaways', element: <KeyTakeawaysSlide title={SESSION} lesson={SESSION} points={AGENDA} /> },
  { id: 'feedback', section: 'Closing', label: 'Feedback', element: <FeedbackSlide lesson={SESSION} formless />, notes: 'No form and no QR (content rule 41 as amended 2026-11-21). Ask for feedback out loud.' },
  { id: 'thank-you', section: 'Closing', label: 'Thank you', element: <ThankYouSlide title="Thank You" lesson={SESSION} /> },
  { id: 'all-the-best', section: 'Closing', label: 'All the best', element: <ThankYouSlide title="All the Best" lesson={SESSION} /> },
]
