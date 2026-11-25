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
 * THEORY OF INFERENCE FOR THE STATEMENT CALCULUS (DSM, Mathematical Logic).
 *
 * Built from the signed-off plan at
 *   Outputs/dsm/session_plans/theory_of_inference/plan.md
 * the source of truth for order, framework and wording. Every validity
 * verdict, counterexample and proof line was checked by `verify_tr.py`.
 *
 * Seven concepts, one deck slide per TR slide. Visuals are DOM figures
 * (cards, chips, proof ledgers), never SVG text.
 */

const SESSION = 'Theory of Inference for the Statement Calculus'
const C1 = 'Arguments'
const C2 = 'Valid and Invalid Arguments'
const C3 = 'Testing Validity with Truth Tables'
const C4 = 'Rules of Inference'
const C5 = 'Testing Validity with Rules of Inference'
const C6 = 'Deriving Conclusions from Multiple Premises'
const C7 = 'Putting It All Together'
const AGENDA = [C1, C2, C3, C4, C5, C6, C7]

export const theoryOfInferenceMeta: DeckMeta = {
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

const mh = (s: string) => <span className="normal-case tracking-normal">{s}</span>
const EASE = [0.22, 1, 0.36, 1] as const

function Fresh({ children, className = 'inline-block' }: { children: ReactNode; className?: string }) {
  const instant = useInstant()
  return (
    <motion.span className={className} initial={{ opacity: instant ? 1 : 0, y: instant ? 0 : 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: instant ? 0 : 0.52, ease: EASE }}>
      {children}
    </motion.span>
  )
}

type Tone = 'ok' | 'warn' | 'bad' | 'brand'
const TONE = { ok: colors.success, warn: colors.warning, bad: '#B91C1C', brand: colors.brandDark }

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

/** An argument in stacked form: premises, a rule line, ∴ conclusion. */
function Stack({ premises, conclusion, size = 22 }: { premises: string[]; conclusion: string; size?: number }) {
  return (
    <div className="inline-block font-heading font-semibold" style={{ color: colors.ink, fontSize: size }}>
      {premises.map((p) => (
        <span key={p} className="block">
          {p}
        </span>
      ))}
      <span className="my-1 block h-[2px] w-full" style={{ background: colors.ink }} />
      <span className="block">∴ {conclusion}</span>
    </div>
  )
}

/** A formal proof: No. / Statement / Reason, one line per press after the first. */
function Proof({ lines, reasonW = 330 }: { lines: [string, string][]; reasonW?: number }) {
  return (
    <div className="w-full overflow-hidden rounded-card border border-line bg-white shadow-card-soft">
      <div className="grid items-center gap-3 px-4 py-2 font-heading text-[16px] font-semibold uppercase tracking-wide text-white" style={{ gridTemplateColumns: `44px 1fr ${reasonW}px`, background: colors.brandDark }}>
        <span>No.</span>
        <span>Statement</span>
        <span>Reason</span>
      </div>
      {lines.map(([s, r], i) => {
        const row = (
          <div className="grid items-center gap-3 border-t border-line px-4 py-1.5" style={{ gridTemplateColumns: `44px 1fr ${reasonW}px` }}>
            <span className="font-heading text-[18px] font-semibold" style={{ color: colors.brandDark }}>
              {i + 1}
            </span>
            <span className="font-heading text-[20px] font-semibold" style={{ color: colors.ink }}>
              {s}
            </span>
            <span className="text-[18px]" style={{ color: r === 'Premise' ? colors.ink : TONE.ok, fontWeight: r === 'Premise' ? 400 : 600 }}>
              {r}
            </span>
          </div>
        )
        return i === 0 ? <div key={i}>{row}</div> : <Step key={i}>{row}</Step>
      })}
    </div>
  )
}

/** Truth table with critical rows ringed and a stamp. */
function CriticalTable({ heads, rows, critical, stamp }: { heads: string[]; rows: string[][]; critical: Record<number, Tone>; stamp: { text: string; tone: Tone } }) {
  return (
    <div className="grid w-full grid-cols-[1.7fr_1fr] items-center gap-5">
      <DataTable
        className="w-full"
        compact
        stepped
        columns={heads.map((h, i) => ({ label: mh(h), weight: i === heads.length - 1 ? 2 : 1 }))}
        rows={rows.map((r, i) => r.map((c, j) => (j === r.length - 1 && critical[i] ? <Lit v={c} tone={critical[i]} /> : c)))}
      />
      <Step>
        <div className="flex flex-col items-start gap-3">
          <span className="inline-block -rotate-6 rounded-xl border-4 px-6 py-2 font-heading text-[40px] font-semibold tracking-widest" style={{ borderColor: TONE[stamp.tone], color: TONE[stamp.tone] }}>
            {stamp.text}
          </span>
        </div>
      </Step>
    </div>
  )
}

/* ── slide-specific figures ─────────────────────────────────────────────── */

/** C5: a 2 × 2 board, valid / invalid against true / false premises. */
function Quadrant() {
  const k = useBuild(2)
  const cell = (on: boolean, note?: ReactNode, tone?: Tone) => (
    <div className="min-h-[118px] rounded-card border-2 border-dashed px-3 py-2" style={{ borderColor: colors.line }}>
      {on && note && (
        <Fresh className="block">
          <div className="rounded-lg px-3 py-2 text-[17px] shadow-card-soft" style={{ background: tone === 'bad' ? '#FEE2E2' : '#FEF9C3', color: colors.ink }}>
            {note}
          </div>
        </Fresh>
      )}
    </div>
  )
  return (
    <div className="grid w-full grid-cols-[130px_1fr_1fr] gap-3">
      <span />
      <Label>True premises</Label>
      <Label>A false premise</Label>
      <Label tone="ok">Valid</Label>
      {cell(false)}
      {cell(k >= 1, <>If 7 is even, 7 is divisible by 2. 7 is even. ∴ 7 is divisible by 2. <b>Valid, conclusion false</b></>)}
      <Label tone="bad">Invalid</Label>
      {cell(k >= 2, <>If it is a cat, it has four legs. It has four legs. ∴ It is a cat. <b>Not guaranteed</b></>, 'bad')}
      {cell(false)}
    </div>
  )
}

/** C11: the eight rules as cards. */
const RULES: [string, string[], string, string][] = [
  ['Modus Ponens (MP)', ['p', 'p → q'], 'q', '(p ∧ (p → q)) → q'],
  ['Modus Tollens (MT)', ['¬q', 'p → q'], '¬p', '(¬q ∧ (p → q)) → ¬p'],
  ['Hypothetical Syllogism (HS)', ['p → q', 'q → r'], 'p → r', '((p → q) ∧ (q → r)) → (p → r)'],
  ['Disjunctive Syllogism (DS)', ['p ∨ q', '¬p'], 'q', '((p ∨ q) ∧ ¬p) → q'],
  ['Addition (Add)', ['p'], 'p ∨ q', 'p → (p ∨ q)'],
  ['Simplification (Simp)', ['p ∧ q'], 'p', '(p ∧ q) → p'],
  ['Conjunction (Conj)', ['p', 'q'], 'p ∧ q', '(p ∧ q) → (p ∧ q)'],
  ['Resolution (Res)', ['p ∨ q', '¬p ∨ r'], 'q ∨ r', '((p ∨ q) ∧ (¬p ∨ r)) → (q ∨ r)'],
]
function RuleCards() {
  return (
    <div className="grid w-full grid-cols-4 gap-3">
      {RULES.map(([name, prem, concl, taut]) => (
        <Step key={name} className="flex flex-col rounded-card border border-line bg-white px-4 py-3 shadow-card-soft">
          <span className="font-heading text-[17px] font-semibold" style={{ color: colors.brandDark }}>
            {name}
          </span>
          <div className="mt-1">
            <Stack premises={[prem.join(',  ')]} conclusion={concl} size={20} />
          </div>
          <span className="mt-auto pt-1 text-[16px]" style={{ color: colors.ink }}>
            {taut}
          </span>
        </Step>
      ))}
    </div>
  )
}

/** C24: premises flow through rules into two conclusions. */
function MindMap() {
  const rows: [string[], string, string, string?, string?][] = [
    [['h', 'h → f'], 'MP', 'f', 'MP with f → w', 'w: I will watch a film'],
    [['m', '¬m ∨ t'], 'DS', 't: I am tired'],
  ]
  return (
    <div className="w-full space-y-4">
      {rows.map(([prem, rule, out, rule2, out2], i) => (
        <Step key={i} className="flex flex-wrap items-center gap-2">
          {prem.map((p) => (
            <Chip key={p} tone="plain">
              {p}
            </Chip>
          ))}
          <Arrow label={rule} />
          <Chip tone={rule2 ? 'brand' : 'ok'}>{out}</Chip>
          {rule2 && (
            <>
              <Arrow label={rule2} />
              <Chip tone="ok">{out2}</Chip>
            </>
          )}
        </Step>
      ))}
    </div>
  )
}

/** C26: the p → q table as a signal panel. */
function SignalPanel() {
  const rows: [string, string, string, Tone, string][] = [
    ['T', 'T', 'T', 'ok', 'trivial (q true)'],
    ['T', 'F', 'F', 'bad', 'the only false row'],
    ['F', 'T', 'T', 'ok', 'vacuous and trivial'],
    ['F', 'F', 'T', 'ok', 'vacuous (p false)'],
  ]
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-[44px_44px_70px_1fr] gap-2 px-3 font-heading text-[17px] font-semibold" style={{ color: colors.brandDark }}>
        <span>p</span>
        <span>q</span>
        <span>p → q</span>
        <span />
      </div>
      {rows.map(([p, q, v, tone, why]) => (
        <div key={p + q} className="grid grid-cols-[44px_44px_70px_1fr] items-center gap-2 rounded-xl px-3 py-2" style={{ background: `${TONE[tone]}18`, boxShadow: `inset 0 0 0 2px ${TONE[tone]}55` }}>
          <span className="text-[20px] font-semibold" style={{ color: colors.ink }}>
            {p}
          </span>
          <span className="text-[20px] font-semibold" style={{ color: colors.ink }}>
            {q}
          </span>
          <span className="flex items-center gap-2 text-[20px] font-semibold" style={{ color: TONE[tone] }}>
            <span className="h-4 w-4 rounded-full" style={{ background: TONE[tone] }} />
            {v}
          </span>
          <span className="text-[17px]" style={{ color: colors.ink }}>
            {why}
          </span>
        </div>
      ))}
    </div>
  )
}

/** C28: five squares to the trophy. */
function BoardTrack() {
  const tasks: [string, string][] = [
    ['Is p → q, r → q ∴ p → r valid?', 'Invalid: p = T, q = T, r = F'],
    ['Prove: p ∧ q, p → r ∴ r ∨ s', 'Simp gives p; MP gives r; Add gives r ∨ s'],
    ['Prove: p ∨ q, ¬q ∨ r, ¬r ∴ p', 'Res gives p ∨ r; DS with ¬r gives p'],
    ['What follows from a → b, ¬b, a ∨ c?', '¬a (MT), then c (DS)'],
    ['Which rule: (p → q) ∧ (q → r) ⟹ p → r?', 'Hypothetical Syllogism'],
  ]
  const k = useBuild(tasks.length)
  return (
    <div className="w-full space-y-3">
      <div className="grid grid-cols-5 gap-3">
        {tasks.map(([t, a], i) => (
          <div key={t} className="flex min-h-[250px] flex-col rounded-card border-2 px-3 py-3" style={{ borderColor: i < k ? TONE.ok : colors.line, background: i < k ? `${TONE.ok}0F` : '#fff' }}>
            <span className="grid h-8 w-8 place-items-center rounded-full font-heading text-[16px] font-semibold text-white" style={{ background: i < k ? colors.success : colors.brand }}>
              {i + 1}
            </span>
            <span className="mt-2 font-heading text-[18px] font-semibold" style={{ color: colors.ink }}>
              {t}
            </span>
            {i < k && (
              <Fresh className="mt-2 block">
                <span className="text-[18px] font-semibold" style={{ color: TONE.ok }}>
                  {a}
                </span>
              </Fresh>
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <span className="h-[3px] flex-1 rounded-full" style={{ background: k === tasks.length ? colors.success : colors.line }} />
        <span className="rounded-pill px-4 py-1 font-heading text-[18px] font-semibold" style={{ background: k === tasks.length ? '#FEF3C7' : `${colors.line}66`, color: colors.ink }}>
          🏆 Logic Master
        </span>
      </div>
    </div>
  )
}

/* ── the deck ───────────────────────────────────────────────────────────── */

export const theoryOfInferenceDeck: SlideDef[] = [
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
          { title: C1, sub: 'Premises and conclusions' },
          { title: C2, sub: 'Validity, and two famous fallacies' },
          { title: C3, sub: 'The critical-row method' },
          { title: C4, sub: 'Eight valid patterns to reuse' },
          { title: C5, sub: 'Step-by-step formal proofs' },
          { title: C6, sub: 'Chains of rules and proof strategies' },
          { title: C7, sub: 'Common mistakes and mixed practice' },
        ]}
      />
    ),
  },

  /* ── CONCEPT 1: Arguments (4MAT) ─────────────────────────────────────── */
  { id: 'c1-divider', section: C1, label: 'Divider', element: <SectionBreakerSlide index={1} title={C1} lesson={SESSION} /> },
  {
    id: 'c1-facts',
    section: C1,
    label: 'From Facts to a Conclusion',
    element: (
      <ContentSlide kicker={C1} title="From Facts to a Conclusion" lead="Think First: what can you conclude, and why are you so sure?" lesson={SESSION}>
        <div className="w-full space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <Card tone="warn">
              <Label tone="warn">Clue 1</Label>
              <Big>If it rains today, we will have a pleasant evening</Big>
            </Card>
            <Card tone="warn">
              <Label tone="warn">Clue 2</Label>
              <Big>It rained today</Big>
            </Card>
          </div>
          <Step>
            <Card tone="ok">
              <Label tone="ok">Follows</Label>
              <Big>We will have a pleasant evening</Big>
              <Txt>We never checked the evening. The conclusion follows from the two statements</Txt>
            </Card>
          </Step>
          <Step>
            <Callout kind="info" title="Today's question" asStep={false}>
              Logic tells us exactly when such a "following" is guaranteed
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"This is the opening example of the reference deck W1_S6. Ask learners whether they would bet money on the conclusion. Why?"',
  },
  {
    id: 'c1-parts',
    section: C1,
    label: 'The Parts of an Argument',
    element: (
      <ContentSlide kicker={C1} title="The Parts of an Argument" lead="p: it rains,  q: we have a pleasant evening" lesson={SESSION}>
        <div className="grid w-full grid-cols-[1fr_1.3fr] items-center gap-6">
          <Card>
            <Stack premises={['p → q', 'p']} conclusion="q" size={30} />
          </Card>
          <StepCards
            items={[
              ['Premises', 'Statements assumed to be true: the starting facts'],
              ['Conclusion', 'The statement claimed to follow from the premises'],
              ['Argument', 'A list of premises together with a conclusion'],
              ['∴', 'Read "therefore"'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"Stress the stacked notation with a line and ∴, used throughout W1_S6 and W1_S7." The premises are the cake layers; the conclusion is the topper above the ∴ line of icing.',
  },
  {
    id: 'c1-formula',
    section: C1,
    label: 'An Argument as One Formula',
    element: (
      <ContentSlide kicker={C1} title="An Argument as One Formula" lead="Premises P₁, P₂, …, Pₙ and conclusion C give one implication" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="flex items-center gap-2">
            {['P₁', 'P₂', '…', 'Pₙ'].map((p, i) => (
              <span key={p} className="flex items-center gap-2">
                <Chip tone="plain" big>
                  {p}
                </Chip>
                {i < 3 && (
                  <span className="font-heading text-[24px] font-semibold" style={{ color: colors.brandDark }}>
                    ∧
                  </span>
                )}
              </span>
            ))}
            <Arrow label="→" />
            <Chip tone="ok" big>
              C
            </Chip>
          </div>
          <Step>
            <Card tone="brand">
              <Label>The rain argument becomes</Label>
              <Big className="text-[28px]">(p ∧ (p → q)) → q</Big>
            </Card>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"This single formula is the bridge to validity: we will ask whether it is a tautology."',
  },

  /* ── CONCEPT 2: Valid and Invalid (4MAT) ────────────────────────────── */
  { id: 'c2-divider', section: C2, label: 'Divider', element: <SectionBreakerSlide index={2} title={C2} lesson={SESSION} /> },
  {
    id: 'c2-validity',
    section: C2,
    label: 'Validity',
    element: (
      <ContentSlide kicker={C2} title="Validity" lead="Valid: whenever all the premises are true, the conclusion must be true" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="grid grid-cols-2 gap-5">
            <Step>
              <Card tone="ok" className="h-full">
                <Label tone="ok">Valid vault</Label>
                <Txt>Every premise key turned: the vault always opens on a true conclusion</Txt>
                <Big className="mt-2">(P₁ ∧ … ∧ Pₙ) → C is a tautology</Big>
                <Txt className="mt-1">We write P₁, …, Pₙ ⟹ C: C logically follows</Txt>
              </Card>
            </Step>
            <Step>
              <Card tone="bad" className="h-full">
                <Label tone="bad">Invalid vault</Label>
                <Txt>Every premise key turned, yet sometimes the room is empty: the conclusion is false</Txt>
                <Big className="mt-2">Invalid = a fallacy</Big>
              </Card>
            </Step>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"Validity is about form, not content: the same pattern is valid whatever p and q mean."',
  },
  {
    id: 'c2-form',
    section: C2,
    label: 'Form Versus Facts',
    element: (
      <ContentSlide kicker={C2} title="Form Versus Facts" lead="Validity and truth are different" lesson={SESSION}>
        <div className="w-full space-y-3">
          <Quadrant />
          <Step>
            <Callout kind="success" title="Sound argument" asStep={false}>
              A valid argument with true premises always gives a true conclusion
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"The first row is valid even though its conclusion is false. Validity only promises: true premises in, true conclusion out." The 7-is-even argument has the Modus Ponens form.',
  },
  {
    id: 'c2-fallacies',
    section: C2,
    label: 'Two Famous Fallacies',
    element: (
      <ContentSlide kicker={C2} title="Two Famous Fallacies" lead="Patterns that look valid but are not" lesson={SESSION}>
        <div className="w-full space-y-3">
          <div className="grid grid-cols-2 gap-5">
            {[
              ['Affirming the consequent', ['p → q', 'q'], 'p', 'If it rained, the road is wet. The road is wet. ∴ It rained'],
              ['Denying the antecedent', ['p → q', '¬p'], '¬q', 'If it rained, the road is wet. It did not rain. ∴ The road is not wet'],
            ].map(([name, prem, concl, story]) => (
              <Step key={name as string}>
                <Card tone="warn" className="h-full">
                  <Label tone="warn">{name}</Label>
                  <div className="my-2">
                    <Stack premises={prem as string[]} conclusion={concl as string} />
                  </div>
                  <Txt>{story}</Txt>
                </Card>
              </Step>
            ))}
          </div>
          <Step>
            <Callout kind="error" title="Counterexample for both: p false, q true" asStep={false}>
              A water tanker wet the road under a clear sky: no rain, yet the road is wet
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"One counterexample row is enough to show an argument is invalid. The next section makes this systematic."',
  },

  /* ── CONCEPT 3: Truth Tables (Merrill) ───────────────────────────────── */
  { id: 'c3-divider', section: C3, label: 'Divider', element: <SectionBreakerSlide index={3} title={C3} lesson={SESSION} /> },
  {
    id: 'c3-method',
    section: C3,
    label: 'Check Every Possibility',
    element: (
      <ContentSlide kicker={C3} title="Check Every Possibility" lead="The critical-row method" lesson={SESSION}>
        <StepCards
          items={[
            ['Build the truth table', 'A column for each premise and for the conclusion'],
            ['Mark the critical rows', 'Rows where all premises are true: the detector beeps only here'],
            ['Every critical row has a true conclusion?', 'Then the argument is valid'],
            ['Some critical row has a false conclusion?', 'Invalid, and that row is a counterexample'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"Equivalent to checking that (P₁ ∧ … ∧ Pₙ) → C is a tautology, but quicker because only critical rows matter."',
  },
  {
    id: 'c3-valid',
    section: C3,
    label: 'Modus Tollens by Table',
    element: (
      <ContentSlide kicker={C3} title="Modus Tollens by Table" lead="Testing p → q, ¬q ∴ ¬p" lesson={SESSION}>
        <CriticalTable
          heads={['p', 'q', 'p → q', '¬q', '¬p', 'Critical?']}
          rows={[
            ['T', 'T', 'T', 'F', 'F', 'No'],
            ['T', 'F', 'F', 'T', 'F', 'No'],
            ['F', 'T', 'T', 'F', 'T', 'No'],
            ['F', 'F', 'T', 'T', 'T', 'Yes: conclusion T'],
          ]}
          critical={{ 3: 'ok' }}
          stamp={{ text: 'VALID', tone: 'ok' }}
        />
      </ContentSlide>
    ),
    notes: '"Ask learners to read the argument in words: if p then q; not q; therefore not p." The only critical row has a true conclusion: valid.',
  },
  {
    id: 'c3-invalid',
    section: C3,
    label: 'Affirming the Consequent by Table',
    element: (
      <ContentSlide kicker={C3} title="Affirming the Consequent by Table" lead="Testing p → q, q ∴ p" lesson={SESSION}>
        <div className="w-full space-y-3">
          <CriticalTable
            heads={['p', 'q', 'p → q', 'q', 'Conclusion p', 'Critical?']}
            rows={[
              ['T', 'T', 'T', 'T', 'T', 'Yes: conclusion T'],
              ['T', 'F', 'F', 'F', 'T', 'No'],
              ['F', 'T', 'T', 'T', 'F', 'Yes: conclusion F ✗'],
              ['F', 'F', 'T', 'F', 'F', 'No'],
            ]}
            critical={{ 0: 'ok', 2: 'bad' }}
            stamp={{ text: 'INVALID', tone: 'bad' }}
          />
          <Step>
            <Callout kind="error" title="Counterexample: p = F, q = T" asStep={false}>
              Row 3 is critical with a false conclusion
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Connect row 3 to the water-tanker story from the fallacies slide."',
  },
  {
    id: 'c3-practice',
    section: C3,
    label: 'Valid or Invalid?',
    element: (
      <ContentSlide kicker={C3} title="Valid or Invalid?" lead="Find the critical rows, then reveal" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Argument', weight: 1 }, { label: 'Answer', weight: 1.3 }]}
          rows={[
            ['p ∨ q, ¬p ∴ q', <Lit v="Valid: needle stays calm" tone="ok" />],
            ['p → q, ¬p ∴ ¬q', <Lit v="Invalid: spike at p = F, q = T" tone="bad" />],
            ['p → q, q → r ∴ p → r', <Lit v="Valid: 8 rows, every critical row passes" tone="ok" />],
            ['p ∨ q ∴ p', <Lit v="Invalid: spike at p = F, q = T" tone="bad" />],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"Row 3 needs 8 rows; ask learners to list only the critical rows to save time."',
  },

  /* ── CONCEPT 4: Rules of Inference (Merrill) ────────────────────────── */
  { id: 'c4-divider', section: C4, label: 'Divider', element: <SectionBreakerSlide index={4} title={C4} lesson={SESSION} /> },
  {
    id: 'c4-rules',
    section: C4,
    label: 'The Rules at a Glance',
    element: (
      <ContentSlide kicker={C4} title="The Rules at a Glance" lead="Ready-made valid arguments, with the tautology behind each" lesson={SESSION}>
        <RuleCards />
      </ContentSlide>
    ),
    notes: '"This is the table from W1_S6. Each rule is a valid argument, checked once by truth table, then reused freely."',
  },
  {
    id: 'c4-mp',
    section: C4,
    label: 'Modus Ponens',
    element: (
      <ContentSlide kicker={C4} title="Modus Ponens" lead="p → q, p ∴ q: the way that affirms" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="flex items-end gap-6">
            {[
              ['p', 0],
              ['→', 0],
              ['q', 1],
            ].map(([t, fall], i) => (
              <Step key={i}>
                <div
                  className="grid h-[150px] w-[76px] place-items-center rounded-xl font-heading text-[30px] font-semibold text-white"
                  style={{ background: fall ? colors.success : colors.brand, transform: fall ? 'rotate(18deg)' : undefined, transformOrigin: 'bottom right' }}
                >
                  {t}
                </div>
              </Step>
            ))}
          </div>
          <Step>
            <Card tone="ok">
              <Big>"If I score 90, I get an A. I scored 90. ∴ I get an A"</Big>
              <Txt>The most used rule: every "if … then" plus its "if" part gives the "then" part</Txt>
            </Card>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Contrast with affirming the consequent: MP affirms the if part, not the then part." This is the rain argument from the start of the session.',
  },
  {
    id: 'c4-mt',
    section: C4,
    label: 'Modus Tollens',
    element: (
      <ContentSlide kicker={C4} title="Modus Tollens" lead="p → q, ¬q ∴ ¬p: the way that denies" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Card>
              <Label>p → q</Label>
              <Txt>If the alarm works, it rings during a fire drill</Txt>
            </Card>
            <Arrow />
            <Step>
              <Card tone="warn">
                <Label tone="warn">¬q</Label>
                <Txt>It did not ring</Txt>
              </Card>
            </Step>
            <Arrow />
            <Step>
              <Card tone="bad">
                <Label tone="bad">∴ ¬p</Label>
                <Txt>The alarm does not work</Txt>
              </Card>
            </Step>
          </div>
          <Step>
            <Callout kind="info" title="Why it works" asStep={false}>
              p → q is equivalent to its contrapositive ¬q → ¬p
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"MT is the logic behind proof by contraposition in the reference deck W1_S8."',
  },
  {
    id: 'c4-syllogisms',
    section: C4,
    label: 'Two Syllogisms',
    element: (
      <ContentSlide kicker={C4} title="Two Syllogisms" lead="Chaining and eliminating" lesson={SESSION}>
        <div className="grid w-full grid-cols-2 gap-5">
          <Step>
            <Card className="h-full">
              <Label>Hypothetical Syllogism: chain</Label>
              <div className="my-3 flex items-center gap-1">
                {['p', 'q', 'r'].map((t, i) => (
                  <span key={t} className="flex items-center gap-1">
                    <span className="grid h-14 w-14 place-items-center rounded-full border-4 font-heading text-[22px] font-semibold" style={{ borderColor: colors.brand, color: colors.ink, opacity: i === 1 ? 0.35 : 1 }}>
                      {t}
                    </span>
                    {i < 2 && <span className="h-[4px] w-6" style={{ background: colors.brand }} />}
                  </span>
                ))}
                <span className="ml-3 font-heading text-[22px] font-semibold" style={{ color: TONE.ok }}>
                  p → r
                </span>
              </div>
              <Big>p → q, q → r ∴ p → r</Big>
              <Txt className="mt-1">If I study, I pass. If I pass, I graduate. ∴ If I study, I graduate</Txt>
            </Card>
          </Step>
          <Step>
            <Card className="h-full">
              <Label>Disjunctive Syllogism: eliminate</Label>
              <div className="my-3 flex gap-3">
                <span className="rounded-xl border-2 px-5 py-3 font-heading text-[20px] font-semibold line-through" style={{ borderColor: TONE.bad, color: TONE.bad }}>
                  bag
                </span>
                <span className="rounded-xl border-2 px-5 py-3 font-heading text-[20px] font-semibold" style={{ borderColor: TONE.ok, color: TONE.ok, background: `${TONE.ok}14` }}>
                  drawer ✓
                </span>
              </div>
              <Big>p ∨ q, ¬p ∴ q</Big>
              <Txt className="mt-1">The key is in the bag or in the drawer. It is not in the bag. ∴ It is in the drawer</Txt>
            </Card>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"HS chains implications; DS eliminates one option from an or."',
  },
  {
    id: 'c4-build',
    section: C4,
    label: 'Building Up and Breaking Down',
    element: (
      <ContentSlide kicker={C4} title="Building Up and Breaking Down" lead="Three simple rules" lesson={SESSION}>
        <div className="grid w-full grid-cols-3 gap-4">
          {[
            ['Addition', 'p ∴ p ∨ q', ['p', '+ ∨ q'], 'It is raining. ∴ It is raining or it is snowing'],
            ['Simplification', 'p ∧ q ∴ p', ['p ∧ q', '→ p'], 'It is cold and windy. ∴ It is cold'],
            ['Conjunction', 'p, q ∴ p ∧ q', ['p + q', '→ p ∧ q'], 'It is Monday. It is sunny. ∴ It is Monday and sunny'],
          ].map(([name, form, bricks, ex]) => (
            <Step key={name as string}>
              <Card className="h-full">
                <Label>{name}</Label>
                <div className="my-3 flex flex-wrap gap-2">
                  {(bricks as string[]).map((b, i) => (
                    <span key={b} className="rounded-md px-3 py-2 font-heading text-[20px] font-semibold text-white" style={{ background: i === 0 ? colors.brand : colors.success }}>
                      {b}
                    </span>
                  ))}
                </div>
                <Big>{form}</Big>
                <Txt className="mt-1">{ex}</Txt>
              </Card>
            </Step>
          ))}
        </div>
      </ContentSlide>
    ),
    notes: '"Addition surprises learners: any statement may be weakened by or anything. It is still true."',
  },
  {
    id: 'c4-resolution',
    section: C4,
    label: 'Resolution',
    element: (
      <ContentSlide kicker={C4} title="Resolution" lead="p ∨ q, ¬p ∨ r ∴ q ∨ r: p and ¬p cancel" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Chip big>
              <span style={{ color: TONE.bad }}>p</span>&nbsp;∨ q
            </Chip>
            <Chip big>
              <span style={{ color: TONE.bad }}>¬p</span>&nbsp;∨ r
            </Chip>
            <Arrow label="lock together" />
            <Step>
              <Chip tone="ok" big>
                q ∨ r
              </Chip>
            </Step>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Step>
              <Card>
                <Label>If p is true</Label>
                <Txt>¬p ∨ r forces r, so q ∨ r</Txt>
              </Card>
            </Step>
            <Step>
              <Card>
                <Label>If p is false</Label>
                <Txt>p ∨ q forces q, so q ∨ r</Txt>
              </Card>
            </Step>
          </div>
          <Step>
            <Callout kind="info" title="Computers use it" asStep={false}>
              Resolution checks logic automatically, working on clauses from the Normal Forms session
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Resolution is included in W1_S6. If q = r, it gives p ∨ q, ¬p ∨ q ∴ q."',
  },
  {
    id: 'c4-practice',
    section: C4,
    label: 'Name That Rule',
    element: (
      <ContentSlide kicker={C4} title="Name That Rule" lead="Hit the buzzer, then reveal" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Argument', weight: 3 }, { label: 'Rule', weight: 1.1 }]}
          rows={[
            ['If it is a holiday, college is closed. It is a holiday. ∴ College is closed', <Lit v="Modus Ponens" tone="ok" />],
            ['Ravi is in Hyderabad or Chennai. Ravi is not in Hyderabad. ∴ Ravi is in Chennai', <Lit v="Disjunctive Syllogism" tone="ok" />],
            ['If I oversleep, I miss the bus. I did not miss the bus. ∴ I did not oversleep', <Lit v="Modus Tollens" tone="ok" />],
            ['The tea is hot and sweet. ∴ The tea is sweet', <Lit v="Simplification" tone="ok" />],
            ['p ∨ q, ¬p ∨ r ∴ q ∨ r', <Lit v="Resolution" tone="ok" />],
            ['If x > 5 then x > 3; if x > 3 then x > 1. ∴ If x > 5 then x > 1', <Lit v="Hypothetical Syllogism" tone="ok" />],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"Encourage learners to translate each sentence into symbols before naming the rule."',
  },
  { id: 'quiz-1', section: C4, label: 'Quiz Time', element: <QuizTimeSlide lesson={SESSION} /> },

  /* ── CONCEPT 5: Formal proofs (Merrill) ─────────────────────────────── */
  { id: 'c5-divider', section: C5, label: 'Divider', element: <SectionBreakerSlide index={5} title={C5} lesson={SESSION} /> },
  {
    id: 'c5-ledger',
    section: C5,
    label: 'A Proof Is a Numbered List',
    element: (
      <ContentSlide kicker={C5} title="A Proof Is a Numbered List" lead="Every line needs a reason" lesson={SESSION}>
        <div className="w-full space-y-3">
          <DataTable
            className="w-full"
            compact
            stepped
            columns={[{ label: 'Column', weight: 0.6 }, { label: 'What it contains', weight: 2 }]}
            rows={[
              ['No.', '1, 2, 3, …, so later lines can refer back'],
              ['Statement', 'A premise, or a statement obtained from earlier lines'],
              ['Reason', 'Premise, a rule with the lines used, such as MT (2), (3), or an equivalence law'],
            ]}
          />
          <Step>
            <Callout kind="success" title="The proof ends when the conclusion appears as a line" asStep={false}>
              Often faster than a truth table: 5 variables need 32 rows
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Tremblay and Manohar call using a premise Rule P and using an implication or equivalence Rule T. Both naming styles are fine if used consistently."',
  },
  {
    id: 'c5-canoe',
    section: C5,
    label: 'The Canoe Trip',
    element: (
      <ContentSlide kicker={C5} title="The Canoe Trip" lead="Premises ¬p ∧ q, r → p, ¬r → s, s → t.  Conclusion t" lesson={SESSION}>
        <div className="grid w-full grid-cols-[300px_1fr] items-start gap-4">
          <Card>
            <Label>Variables</Label>
            <Txt className="text-[17px]">p: sunny this afternoon</Txt>
            <Txt className="text-[17px]">q: colder than yesterday</Txt>
            <Txt className="text-[17px]">r: we go swimming</Txt>
            <Txt className="text-[17px]">s: we take a canoe trip</Txt>
            <Txt className="text-[17px]">t: home by sunset</Txt>
          </Card>
          <Proof
            reasonW={250}
            lines={[
              ['¬p ∧ q', 'Premise'],
              ['¬p', 'Simp (1)'],
              ['r → p', 'Premise'],
              ['¬r', 'MT (3), (2)'],
              ['¬r → s', 'Premise'],
              ['s', 'MP (5), (4)'],
              ['s → t', 'Premise'],
              ['t', 'MP (7), (6): home by sunset'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"A truth table would need 32 rows for 5 variables. The proof takes 8 lines." Example from W1_S7.',
  },
  {
    id: 'c5-saturday',
    section: C5,
    label: 'Saturday Sports',
    element: (
      <ContentSlide kicker={C5} title="Saturday Sports" lead="Premises p → (q ∨ r), s → ¬q, p ∧ s.  Conclusion r ∨ t" lesson={SESSION}>
        <div className="grid w-full grid-cols-[300px_1fr] items-start gap-4">
          <Card>
            <Label>Variables</Label>
            <Txt className="text-[17px]">p: it is Saturday</Txt>
            <Txt className="text-[17px]">q: we play soccer</Txt>
            <Txt className="text-[17px]">r: we play basketball</Txt>
            <Txt className="text-[17px]">s: soccer field occupied</Txt>
            <Txt className="text-[17px]">t: we play volleyball</Txt>
          </Card>
          <Proof
            reasonW={230}
            lines={[
              ['p ∧ s', 'Premise'],
              ['p', 'Simp (1)'],
              ['p → (q ∨ r)', 'Premise'],
              ['q ∨ r', 'MP (3), (2)'],
              ['s', 'Simp (1)'],
              ['s → ¬q', 'Premise'],
              ['¬q', 'MP (6), (5)'],
              ['r', 'DS (4), (7)'],
              ['r ∨ t', 'Add (8)'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"Note step 9: Addition lets us add or volleyball even though we know basketball. The reference slide\'s step labels are out of order; this table gives the correct reasons." Example from W1_S7.',
  },
  {
    id: 'c5-holmes',
    section: C5,
    label: 'Sherlock Holmes',
    element: (
      <ContentSlide kicker={C5} title="Sherlock Holmes" lead="Premises b → t, ¬t, ¬b → (o ∨ w), o → l, k → ¬l, k.  Conclusion w" lesson={SESSION}>
        <div className="grid w-full grid-cols-[300px_1fr] items-start gap-4">
          <Card>
            <Label>Variables</Label>
            <Txt className="text-[17px]">b: it was a robbery</Txt>
            <Txt className="text-[17px]">t: something was taken</Txt>
            <Txt className="text-[17px]">o: politics</Txt>
            <Txt className="text-[17px]">w: a woman</Txt>
            <Txt className="text-[17px]">l: assassin left at once</Txt>
            <Txt className="text-[17px]">k: tracks all over the room</Txt>
          </Card>
          <Proof
            reasonW={300}
            lines={[
              ['¬b', 'MT (b → t, ¬t)'],
              ['o ∨ w', 'MP (¬b → (o ∨ w), 1)'],
              ['¬l', 'MP (k → ¬l, k)'],
              ['¬o', 'MT (o → l, 3)'],
              ['w: it was a woman', 'DS (2), (4)'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"Ask learners to read Holmes\'s original reasoning (on the reference slide) and match each sentence to a step." From "A Study in Scarlet", W1_S7.',
  },
  {
    id: 'c5-resolution',
    section: C5,
    label: 'Using Resolution',
    element: (
      <ContentSlide kicker={C5} title="Using Resolution" lead="Premises P → Q, ¬P → R, Q → S.  Conclusion ¬R → S" lesson={SESSION}>
        <div className="w-full space-y-3">
          <div className="flex items-center justify-center gap-2">
            <Chip tone="plain">implications</Chip>
            <Arrow label="translate" />
            <Chip tone="plain">clauses</Chip>
            <Arrow label="resolve" />
            <Chip tone="plain">clause</Chip>
            <Arrow label="translate back" />
            <Chip tone="ok">¬R → S</Chip>
          </div>
          <Proof
            reasonW={420}
            lines={[
              ['¬P ∨ Q', 'Implication law on premise P → Q'],
              ['P ∨ R', 'Implication law on premise ¬P → R'],
              ['Q ∨ R', 'Res (1), (2)'],
              ['¬R → Q', 'Implication law on (3)'],
              ['¬R → S', 'HS (4), premise Q → S'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"Step 4 uses Q ∨ R ≡ R ∨ Q ≡ ¬R → Q. Equivalence laws from the Connectives session may be used at any step." Example from W1_S7.',
  },
  {
    id: 'c5-practice',
    section: C5,
    label: 'Fill In the Reasons',
    element: (
      <ContentSlide kicker={C5} title="Fill In the Reasons" lead="Premises p → q, q → r, ¬r.  Conclusion ¬p" lesson={SESSION}>
        <RevealTable
          keep={2}
          columns={[{ label: 'No.', weight: 0.4 }, { label: 'Statement', weight: 1 }, { label: 'Reason', weight: 2 }]}
          rows={[
            ['1', 'p → q', 'Premise'],
            ['2', 'q → r', 'Premise'],
            ['3', 'p → r', 'Hypothetical Syllogism (1), (2)'],
            ['4', '¬r', 'Premise'],
            ['5', '¬p', 'Modus Tollens (3), (4)'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"Alternative proof: ¬q by MT from (2) and (4), then ¬p by MT from (1). Several correct proofs can exist."',
  },

  /* ── CONCEPT 6: Deriving (Merrill) ──────────────────────────────────── */
  { id: 'c6-divider', section: C6, label: 'Divider', element: <SectionBreakerSlide index={6} title={C6} lesson={SESSION} /> },
  {
    id: 'c6-follows',
    section: C6,
    label: 'What Follows?',
    element: (
      <ContentSlide kicker={C6} title="What Follows?" lead="Find the conclusion yourself" lesson={SESSION}>
        <div className="w-full space-y-4">
          <Card>
            <Txt>
              "If I finish the assignment, I will watch a film. If it is a holiday, I will finish the assignment. It is a holiday. I did not go to the market or I am tired. I went to the market"
            </Txt>
            <Big className="mt-2">f → w,  h → f,  h,  ¬m ∨ t,  m</Big>
          </Card>
          <MindMap />
        </div>
      </ContentSlide>
    ),
    notes: '"Strategy: start from simple facts (single letters), then look for implications whose if part matches a fact." DS works on the second row because m is ¬(¬m).',
  },
  {
    id: 'c6-strategies',
    section: C6,
    label: 'Strategies for p → q',
    element: (
      <ContentSlide kicker={C6} title="Strategies for p → q" lead="Three doors to the same conclusion" lesson={SESSION}>
        <div className="w-full space-y-3">
          <div className="grid grid-cols-3 gap-4">
            {[
              ['Conditional proof (Rule CP)', 'Add p as an extra premise and derive q', 'Direct proof: assume p, show q'],
              ['Contrapositive', 'Prove ¬q → ¬p instead (equivalent to p → q)', 'Proof by contraposition'],
              ['Indirect proof', 'Add the negation of the conclusion and derive a contradiction such as r ∧ ¬r', 'Proof by contradiction'],
            ].map(([name, idea, link]) => (
              <Step key={name}>
                <div className="h-full rounded-t-[40px] border-2 bg-white px-4 pb-3 pt-5 shadow-card-soft" style={{ borderColor: colors.brand }}>
                  <Label>{name}</Label>
                  <Txt className="mt-1">{idea}</Txt>
                  <Txt className="mt-2 font-semibold">{link}</Txt>
                </div>
              </Step>
            ))}
          </div>
          <Step>
            <Callout kind="success" title="CP example: premises p → (q → r), q.  Prove p → r" asStep={false}>
              Assume p. Then q → r by MP, and r by MP. So p → r ✓
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Tremblay and Manohar call the first strategy Rule CP. The reference deck W1_S8 shows these as proof methods for mathematical statements."',
  },
  {
    id: 'c6-free',
    section: C6,
    label: 'True for Free',
    element: (
      <ContentSlide kicker={C6} title="True for Free" lead="Vacuous and trivial proofs of p → q" lesson={SESSION}>
        <div className="grid w-full grid-cols-[1fr_1.1fr] items-start gap-5">
          <SignalPanel />
          <div className="space-y-3">
            <Step>
              <Card tone="ok">
                <Label tone="ok">Vacuous proof: p is false</Label>
                <Txt>"If 3 &lt; 0, then 3² &gt; 3" is true, since 3 &lt; 0 is false</Txt>
              </Card>
            </Step>
            <Step>
              <Card tone="ok">
                <Label tone="ok">Trivial proof: q is true</Label>
                <Txt>"If a &gt; b, then a⁰ ≥ b⁰" is true, since a⁰ = b⁰ = 1</Txt>
              </Card>
            </Step>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"These follow directly from the truth table of the conditional. They are useful edge cases, not everyday proof methods." From W1_S8.',
  },

  /* ── CONCEPT 7: Putting It All Together (Merrill) ───────────────────── */
  { id: 'c7-divider', section: C7, label: 'Divider', element: <SectionBreakerSlide index={7} title={C7} lesson={SESSION} /> },
  {
    id: 'c7-errors',
    section: C7,
    label: 'What Went Wrong?',
    element: (
      <ContentSlide kicker={C7} title="What Went Wrong?" lead="Yellow cards for common mistakes" lesson={SESSION}>
        <div className="w-full space-y-2">
          {[
            ['From p → q and q, conclude p', 'Affirming the consequent', 'Invalid; MP needs p, not q'],
            ['From p → q and ¬p, conclude ¬q', 'Denying the antecedent', 'Invalid; MT needs ¬q'],
            ['From p ∨ q, conclude p', 'Not Simplification (that needs ∧)', 'p ∨ q alone gives neither p nor q'],
            ['"Valid, so the conclusion is true"', 'Truth needs true premises too', 'Only a sound argument guarantees truth'],
            ['A proof line with no reason', 'Every line must be justified', 'Write Premise, a rule with line numbers, or a law'],
          ].map(([step, err, fix]) => (
            <Step key={step}>
              <div className="grid grid-cols-[40px_1.2fr_1fr_1.2fr] items-center gap-3 rounded-card border border-line bg-white px-4 py-2 shadow-card-soft">
                <span className="h-10 w-7 -rotate-6 rounded-sm" style={{ background: '#FACC15' }} />
                <span className="text-[18px] font-semibold" style={{ color: colors.ink }}>
                  {step}
                </span>
                <span className="text-[17px]" style={{ color: TONE.bad }}>
                  {err}
                </span>
                <span className="text-[17px] font-semibold" style={{ color: TONE.ok }}>
                  {fix}
                </span>
              </div>
            </Step>
          ))}
        </div>
      </ContentSlide>
    ),
    notes: '"The first two rows are the most common exam errors. Remind learners of the water-tanker counterexample."',
  },
  {
    id: 'c7-mixed',
    section: C7,
    label: 'Test, Prove and Derive',
    element: (
      <ContentSlide kicker={C7} title="Test, Prove and Derive" lead="Each answer moves you one square" lesson={SESSION}>
        <BoardTrack />
      </ContentSlide>
    ),
    notes: '"For row 1, ask learners to find the counterexample row themselves before revealing it."',
  },

  /* ── CLOSING ────────────────────────────────────────────────────────── */
  { id: 'quiz-2', section: 'Closing', label: 'Quiz Time', element: <QuizTimeSlide lesson={SESSION} /> },
  { id: 'takeaways', section: 'Closing', label: 'Key Takeaways', element: <KeyTakeawaysSlide title={SESSION} lesson={SESSION} points={AGENDA} /> },
  { id: 'feedback', section: 'Closing', label: 'Feedback', element: <FeedbackSlide lesson={SESSION} formless />, notes: 'No form and no QR (content rule 41 as amended 2026-11-21). Ask for feedback out loud.' },
  { id: 'thank-you', section: 'Closing', label: 'Thank you', element: <ThankYouSlide title="Thank You" lesson={SESSION} /> },
  { id: 'all-the-best', section: 'Closing', label: 'All the best', element: <ThankYouSlide title="All the Best" lesson={SESSION} /> },
]
