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
 * INFERENCE THEORY OF THE PREDICATE CALCULUS (DSM, Mathematical Logic).
 *
 * Built from the signed-off plan at
 *   Outputs/dsm/session_plans/inference_predicate_calculus/plan.md
 * (45 slides, one per TR slide). Every argument was checked over all small
 * universes by `verify_tr.py`. Visuals are DOM figures, never SVG text.
 */

const SESSION = 'Inference Theory of the Predicate Calculus'
const C1 = 'Why We Need New Rules'
const C2 = 'Universal Rules'
const C3 = 'Existential Rules'
const C4 = 'Conditions and Restrictions'
const C5 = 'Deriving Conclusions'
const C6 = 'Spotting Invalid Arguments'
const C7 = 'Putting It All Together'
const AGENDA = [C1, C2, C3, C4, C5, C6, C7]

export const inferencePredicateCalculusMeta: DeckMeta = {
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

/** Proof stages: strip (UI, EI), reason (propositional), rebuild (UG, EG), bad (illegal). */
type Stage = 'premise' | 'strip' | 'reason' | 'rebuild' | 'bad'
const STAGE: Record<Stage, { label: string; c: string }> = {
  premise: { label: 'premise', c: '#64748B' },
  strip: { label: 'strip', c: '#0369A1' },
  reason: { label: 'reason', c: '#7C3AED' },
  rebuild: { label: 'rebuild', c: colors.success },
  bad: { label: 'illegal', c: '#B91C1C' },
}

/** No. / Statement / Reason / stage tag, one line per press after the first. */
function Proof({ lines, reasonW = 300 }: { lines: [string, string, Stage][]; reasonW?: number }) {
  const cols = `40px 1fr ${reasonW}px 96px`
  return (
    <div className="w-full overflow-hidden rounded-card border border-line bg-white shadow-card-soft">
      <div className="grid items-center gap-3 px-4 py-1.5 font-heading text-[16px] font-semibold uppercase tracking-wide text-white" style={{ gridTemplateColumns: cols, background: colors.brandDark }}>
        <span>No.</span>
        <span>Statement</span>
        <span>Reason</span>
        <span>Stage</span>
      </div>
      {lines.map(([s, r, st], i) => {
        const bad = st === 'bad'
        const row = (
          <div className="grid items-center gap-3 border-t border-line px-4 py-1" style={{ gridTemplateColumns: cols, background: bad ? '#FEE2E2' : undefined }}>
            <span className="font-heading text-[18px] font-semibold" style={{ color: colors.brandDark }}>
              {i + 1}
            </span>
            <span className="font-heading text-[20px] font-semibold" style={{ color: bad ? TONE.bad : colors.ink }}>
              {s}
            </span>
            <span className="text-[18px]" style={{ color: bad ? TONE.bad : colors.ink }}>
              {r}
            </span>
            <span className="rounded-md px-2 text-center text-[16px] font-semibold" style={{ color: STAGE[st].c, background: `${STAGE[st].c}18` }}>
              {STAGE[st].label}
            </span>
          </div>
        )
        return i === 0 ? <div key={i}>{row}</div> : <Step key={i}>{row}</Step>
      })}
    </div>
  )
}

/** A verdict table whose verdict column is a coloured stamp. */
function Verdicts({ head, rows, stampW = 1.2 }: { head: [string, string, string?]; rows: (string | [string, boolean])[][]; stampW?: number }) {
  const cols: TableColumn[] = head[2]
    ? [{ label: head[0], weight: 1.2 }, { label: head[1], weight: 1 }, { label: head[2], weight: stampW }]
    : [{ label: head[0], weight: 1.6 }, { label: head[1], weight: stampW }]
  return (
    <RevealTable
      keep={cols.length - 1}
      columns={cols}
      rows={rows.map((r) => r.map((c) => (Array.isArray(c) ? <Lit v={c[0]} tone={c[1] ? 'ok' : 'bad'} /> : c)))}
    />
  )
}

/* ── the deck ───────────────────────────────────────────────────────────── */

export const inferencePredicateCalculusDeck: SlideDef[] = [
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
          { title: C1, sub: 'Removing and adding quantifiers' },
          { title: C2, sub: 'UI and UG' },
          { title: C3, sub: 'EI and EG' },
          { title: C4, sub: 'When each rule may be used' },
          { title: C5, sub: 'Quantifier rules with propositional rules' },
          { title: C6, sub: 'Errors in substitution and generalization' },
          { title: C7, sub: 'Checklist and mixed practice' },
        ]}
      />
    ),
  },

  /* ── CONCEPT 1 ───────────────────────────────────────────────────────── */
  { id: 'c1-divider', section: C1, label: 'Divider', element: <SectionBreakerSlide index={1} title={C1} lesson={SESSION} /> },
  {
    id: 'c1-socrates',
    section: C1,
    label: 'Finishing an Old Argument',
    element: (
      <ContentSlide kicker={C1} title="Finishing an Old Argument" lead="Think First: which rule gives M(s) from ∀x (H(x) → M(x)) and H(s)?" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-xl border-4 px-5 py-3" style={{ borderColor: colors.ink, background: '#F1F5F9' }}>
              <Label>Locked case</Label>
              <Big className="text-[24px]">∀x (H(x) → M(x))</Big>
            </div>
            <Step className="flex items-center gap-3">
              <Arrow label="UI key" />
              <Chip big>H(s) → M(s)</Chip>
              <span className="font-heading text-[24px] font-semibold" style={{ color: colors.brandDark }}>
                +
              </span>
              <Chip big>H(s)</Chip>
              <Arrow label="MP" />
              <Chip tone="ok" big>
                M(s)
              </Chip>
            </Step>
          </div>
          <Step>
            <Callout kind="warning" title="The ∀ is in the way" asStep={false}>
              Modus Ponens needs p → q. We need a rule from "for all x" to "for Socrates"
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Last session we could translate this argument but not prove it. Today\'s four rules complete the job."',
  },
  {
    id: 'c1-plan',
    section: C1,
    label: 'Strip, Reason, Rebuild',
    element: (
      <ContentSlide kicker={C1} title="Strip, Reason, Rebuild" lead="The plan for every proof: a three-station factory" lesson={SESSION}>
        <div className="grid w-full grid-cols-3 gap-4">
          {[
            ['strip', '1. Strip', 'Remove the ∀ and ∃ caps, replacing x by a constant', 'UI, EI'],
            ['reason', '2. Reason', 'Work with ordinary statements about that constant', 'MP, MT, HS, DS, Simp, Conj, …'],
            ['rebuild', '3. Rebuild', 'Put a quantifier cap back on the conclusion', 'UG, EG'],
          ].map(([st, t, d, r]) => (
            <Step key={st}>
              <div className="h-full rounded-card border-2 bg-white px-4 py-4 shadow-card-soft" style={{ borderColor: STAGE[st as Stage].c }}>
                <span className="block font-heading text-[24px] font-semibold" style={{ color: STAGE[st as Stage].c }}>
                  {t}
                </span>
                <Txt className="mt-2">{d}</Txt>
                <Txt className="mt-2 font-semibold">Rules: {r}</Txt>
              </div>
            </Step>
          ))}
        </div>
      </ContentSlide>
    ),
    notes: '"Most proofs in this topic follow this three-stage plan. Learners can use it as a checklist." The stage tags on every proof in this deck use these three colours.',
  },
  {
    id: 'c1-rules',
    section: C1,
    label: 'The Four Rules at a Glance',
    element: (
      <ContentSlide kicker={C1} title="The Four Rules at a Glance" lead="Remove a quantifier, or add one back" lesson={SESSION}>
        <div className="grid w-full grid-cols-[140px_1fr_1fr] gap-3">
          <span />
          <Label>Instantiate (remove)</Label>
          <Label>Generalize (add)</Label>
          {[
            ['Universal', ['UI', '∀x P(x)  ⟶  P(c)', 'c is any element', false], ['UG', 'P(c)  ⟶  ∀x P(x)', 'c must be arbitrary', true]],
            ['Existential', ['EI', '∃x P(x)  ⟶  P(c)', 'c must be a new name', true], ['EG', 'P(c)  ⟶  ∃x P(x)', 'c is some element', false]],
          ].map(([row, a, b]) => (
            <span key={row as string} className="contents">
              <span className="self-center font-heading text-[19px] font-semibold" style={{ color: colors.ink }}>
                {row as string}
              </span>
              {[a, b].map((cell) => {
                const [n, f, cond, warn] = cell as [string, string, string, boolean]
                return (
                  <Step key={n}>
                    <Card tone={warn ? 'warn' : undefined} className="h-full">
                      <span className="flex items-center gap-2">
                        <span className="font-heading text-[22px] font-semibold" style={{ color: colors.brandDark }}>
                          {n}
                        </span>
                        {warn && (
                          <span className="text-[17px] font-semibold" style={{ color: TONE.warn }}>
                            strict condition
                          </span>
                        )}
                      </span>
                      <Big>{f}</Big>
                      <Txt>{cond}</Txt>
                    </Card>
                  </Step>
                )
              })}
            </span>
          ))}
        </div>
      </ContentSlide>
    ),
    notes: '"This matches the quantification rules in the reference deck W1_S7. The conditions column is today\'s most important topic."',
  },

  /* ── CONCEPT 2 ───────────────────────────────────────────────────────── */
  { id: 'c2-divider', section: C2, label: 'Divider', element: <SectionBreakerSlide index={2} title={C2} lesson={SESSION} /> },
  {
    id: 'c2-ui',
    section: C2,
    label: 'Universal Instantiation',
    element: (
      <ContentSlide kicker={C2} title="Universal Instantiation" lead="From ∀x P(x), infer P(c) for any element c of the universe" lesson={SESSION}>
        <div className="w-full space-y-4">
          <Card>
            <Label>Batch stamp: every biscuit contains sugar</Label>
            <div className="mt-2 flex gap-2">
              {Array.from({ length: 8 }, (_, i) => (
                <span key={i} className="h-12 w-12 rounded-full" style={{ background: i === 5 ? '#F59E0B' : '#FDE68A', boxShadow: i === 5 ? `0 0 0 3px ${colors.brand}` : undefined }} />
              ))}
            </div>
            <Step>
              <Txt className="mt-2 font-semibold">Pick any one: this biscuit contains sugar</Txt>
            </Step>
          </Card>
          <StepCards
            cols={2}
            items={[
              ['c may be named or arbitrary', 'Socrates, 7, or "any element c"'],
              ['Example: ∀x (x² ≥ 0) over the reals', 'So (−3)² ≥ 0'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"UI is the safest rule: it has no restriction on the choice of c."',
  },
  {
    id: 'c2-ug',
    section: C2,
    label: 'Universal Generalization',
    element: (
      <ContentSlide kicker={C2} title="Universal Generalization" lead="If P(c) is proved for an arbitrary c, infer ∀x P(x)" lesson={SESSION}>
        <div className="grid w-full grid-cols-[1fr_1.3fr] items-start gap-5">
          <Card>
            <Label>Lucky draw, blindfolded</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {Array.from({ length: 6 }, (_, i) => (
                <span key={i} className="grid h-11 w-11 place-items-center rounded-lg border-2 font-heading text-[18px] font-semibold" style={{ borderColor: i === 2 ? colors.brand : colors.line, color: colors.ink }}>
                  {i === 2 ? 'c' : ''}
                </span>
              ))}
            </div>
            <Step>
              <span className="mt-3 inline-block -rotate-3 rounded-lg border-2 px-3 py-1 font-heading text-[18px] font-semibold" style={{ borderColor: TONE.ok, color: TONE.ok }}>
                Applies to everyone
              </span>
            </Step>
          </Card>
          <StepCards
            items={[
              ['Arbitrary', 'c was not chosen specially: it could have been any element'],
              ['Typical source', 'c came from UI applied to universal premises'],
              ['Not allowed', 'if c is a specific or EI-chosen element'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"Everyday version: Let x be any student. … Therefore every student …. That let x be any is UG in disguise."',
  },
  {
    id: 'c2-chain',
    section: C2,
    label: 'Chaining Universals',
    element: (
      <ContentSlide kicker={C2} title="Chaining Universals" lead="∀x (P(x) → Q(x)), ∀x (Q(x) → R(x)) ∴ ∀x (P(x) → R(x))" lesson={SESSION}>
        <div className="grid w-full grid-cols-[1fr_260px] items-start gap-4">
          <Proof
            reasonW={230}
            lines={[
              ['∀x (P(x) → Q(x))', 'Premise', 'premise'],
              ['P(c) → Q(c)', 'UI (1), c arbitrary', 'strip'],
              ['∀x (Q(x) → R(x))', 'Premise', 'premise'],
              ['Q(c) → R(c)', 'UI (3), same c', 'strip'],
              ['P(c) → R(c)', 'HS (2), (4)', 'reason'],
              ['∀x (P(x) → R(x))', 'UG (5): c arbitrary', 'rebuild'],
            ]}
          />
          <div className="grid aspect-square place-items-center rounded-full border-4" style={{ borderColor: '#7C3AED' }}>
            <div className="grid h-[180px] w-[180px] place-items-center rounded-full border-4" style={{ borderColor: colors.brand }}>
              <div className="grid h-[96px] w-[96px] place-items-center rounded-full border-4 text-center text-[16px] font-semibold" style={{ borderColor: colors.success, color: colors.ink }}>
                squares • c
              </div>
            </div>
            <span className="sr-only">squares inside rectangles inside parallelograms</span>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"Step 6 is allowed because c was introduced only by UI and nothing special was assumed about it." Meaning: all squares are rectangles; all rectangles are parallelograms; so all squares are parallelograms. Rings: squares (green) inside rectangles (blue) inside parallelograms (purple).',
  },
  {
    id: 'c2-shortcuts',
    section: C2,
    label: 'Two Shortcuts',
    element: (
      <ContentSlide kicker={C2} title="Two Shortcuts" lead="UI combined with MP or MT" lesson={SESSION}>
        <div className="w-full space-y-3">
          {[
            ['Universal Modus Ponens', '∀x (P(x) → Q(x))', 'P(a)', 'Q(a)', 'ok'],
            ['Universal Modus Tollens', '∀x (P(x) → Q(x))', '¬Q(a)', '¬P(a)', 'brand'],
          ].map(([n, rule, fact, concl, t]) => (
            <Step key={n}>
              <Card tone={t as Tone}>
                <Label tone={t as Tone}>{n}</Label>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Chip tone="plain">{rule}</Chip>
                  <span className="text-[22px]" style={{ color: colors.ink }}>
                    +
                  </span>
                  <Chip tone="plain">{fact}</Chip>
                  <Arrow label={`UI, then ${n.endsWith('Ponens') ? 'MP' : 'MT'}`} />
                  <Chip tone={t as Tone}>{concl}</Chip>
                </div>
              </Card>
            </Step>
          ))}
          <Step>
            <Callout kind="info" title="Universal MT in words" asStep={false}>
              All computer science students study DSM. Asha does not study DSM. ∴ Asha is not a computer science student
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Learners may write these shortcuts in one line, but in exams it is safer to show UI and then MP or MT."',
  },
  {
    id: 'c2-practice',
    section: C2,
    label: 'Which Step Is Allowed?',
    element: (
      <ContentSlide kicker={C2} title="Which Step Is Allowed?" lead="The bouncer checks each step's ID" lesson={SESSION}>
        <Verdicts
          head={['From', 'Claimed step', 'Allowed?']}
          rows={[
            ['∀x (E(x) → D(x))', 'E(8) → D(8)', ['Yes: UI with c = 8', true]],
            ['∀x P(x)', 'P(Ravi)', ['Yes: UI', true]],
            ['P(c) → Q(c), c from UI', '∀x (P(x) → Q(x))', ['Yes: UG, c arbitrary', true]],
            ['P(7), 7 chosen specially', '∀x P(x)', ['No: 7 is not arbitrary', false]],
            ['∀x (B(x) → F(x)), ¬F(tweety)', '¬B(tweety)', ['Yes: Universal MT', true]],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"Row 4: proving something about the number 7 does not prove it for every number."',
  },

  /* ── CONCEPT 3 ───────────────────────────────────────────────────────── */
  { id: 'c3-divider', section: C3, label: 'Divider', element: <SectionBreakerSlide index={3} title={C3} lesson={SESSION} /> },
  {
    id: 'c3-eg',
    section: C3,
    label: 'One Example Is Enough',
    element: (
      <ContentSlide kicker={C3} title="One Example Is Enough" lead="Existential Generalization: from P(c) for some c, infer ∃x P(x)" lesson={SESSION}>
        <div className="flex w-full items-center gap-5">
          <Card className="w-[320px]">
            <Label>Sign above the mine</Label>
            <Big className="text-[26px]">Gems exist here!</Big>
            <div className="mt-3 h-14 w-14 rotate-45 rounded-md" style={{ background: 'linear-gradient(135deg,#67E8F9,#2563EB)', boxShadow: '0 0 18px #60A5FA' }} />
          </Card>
          <div className="flex-1 space-y-3">
            <Step>
              <Card>
                <Txt>Found one element with the property, so such an element exists</Txt>
              </Card>
            </Step>
            <Step>
              <Card tone="ok">
                <Label tone="ok">Example</Label>
                <Big>2 is prime and even, so ∃x (x is prime ∧ x is even)</Big>
              </Card>
            </Step>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"EG is as safe as UI: any element that has the property works."',
  },
  {
    id: 'c3-ei',
    section: C3,
    label: 'Give It a Fresh Name',
    element: (
      <ContentSlide kicker={C3} title="Give It a Fresh Name" lead="Existential Instantiation: from ∃x P(x), infer P(c) with c a new name" lesson={SESSION}>
        <div className="flex w-full items-start gap-5">
          <div className="relative w-[340px] rounded-lg border-2 py-6 pl-5 pr-16" style={{ borderColor: '#A16207', background: '#FEF9C3' }}>
            <Txt className="font-semibold">Sealed: someone in this class topped the exam</Txt>
            <span className="absolute -right-3 -top-4 rotate-6 rounded-md px-4 py-2 font-heading text-[24px] font-semibold shadow-card-soft" style={{ background: '#FDE047', color: colors.ink }}>
              c
            </span>
          </div>
          <StepCards
            items={[
              ['We know one exists', 'but not which one'],
              ['c must be fresh', 'not used earlier in the proof'],
              ['Assume nothing else about c', 'the envelope stays sealed'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"Like a detective naming an unknown suspect Mr. X: we know there is such a person, but nothing else about them."',
  },
  {
    id: 'c3-integers',
    section: C3,
    label: 'There Exists an Integer',
    element: (
      <ContentSlide kicker={C3} title="There Exists an Integer" lead="Reals. ∀x (N(x) → I(x)), ∃x N(x) ∴ ∃x I(x)" lesson={SESSION}>
        <div className="w-full space-y-3">
          <Proof
            lines={[
              ['∃x N(x)', 'Premise', 'premise'],
              ['N(c)', 'EI (1), c a new name', 'strip'],
              ['∀x (N(x) → I(x))', 'Premise', 'premise'],
              ['N(c) → I(c)', 'UI (3), using the same c', 'strip'],
              ['I(c)', 'MP (4), (2)', 'reason'],
              ['∃x I(x)', 'EG (5)', 'rebuild'],
            ]}
          />
          <Txt>N(x): x is a natural number; I(x): x is an integer. The point c on the number line: natural, so integer, so an integer exists</Txt>
        </div>
      </ContentSlide>
    ),
    notes: '"Notice the order: EI first (step 2), then UI with the same c (step 4). Reversing that order causes trouble (Conditions and Restrictions)." From W1_S7.',
  },
  {
    id: 'c3-practice',
    section: C3,
    label: 'Approved or Rejected?',
    element: (
      <ContentSlide kicker={C3} title="Approved or Rejected?" lead="Each claimed step gets a stamp" lesson={SESSION}>
        <Verdicts
          head={['From', 'Claimed step', 'Stamp']}
          rows={[
            ['Q(5)', '∃x Q(x)', ['Approved: EG', true]],
            ['∃x P(x)', 'P(c), c new', ['Approved: EI', true]],
            ['∃x P(x), a already used', 'P(a)', ['Rejected: EI needs a new name', false]],
            ['∃x P(x)', '∀x P(x)', ['Rejected: "some" does not give "all"', false]],
            ['P(c) ∧ Q(c)', '∃x (P(x) ∧ Q(x))', ['Approved: EG', true]],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"Row 3: a may already have other properties attached to it; reusing it would mix information about two possibly different elements."',
  },

  /* ── CONCEPT 4 ───────────────────────────────────────────────────────── */
  { id: 'c4-divider', section: C4, label: 'Divider', element: <SectionBreakerSlide index={4} title={C4} lesson={SESSION} /> },
  {
    id: 'c4-source',
    section: C4,
    label: 'Where Did c Come From?',
    element: (
      <ContentSlide kicker={C4} title="Where Did c Come From?" lead="Arbitrary or particular: only arbitrary constants pass the UG funnel" lesson={SESSION}>
        <div className="grid w-full grid-cols-2 gap-5">
          <Step>
            <Card tone="ok" className="h-full">
              <Label tone="ok">Jar 1: arbitrary c · UG allowed</Label>
              <div className="my-2 flex gap-2">
                {Array.from({ length: 6 }, (_, i) => (
                  <span key={i} className="h-9 w-9 rounded-full border-2" style={{ borderColor: TONE.ok, background: '#fff' }} />
                ))}
              </div>
              <Txt>• UI from a universal premise</Txt>
              <Txt>• "Let c be any element"</Txt>
            </Card>
          </Step>
          <Step>
            <Card tone="bad" className="h-full">
              <Label tone="bad">Jar 2: particular c · UG not allowed</Label>
              <div className="my-2 flex gap-2">
                <span className="rounded-full border-2 px-3 py-1 text-[17px] font-semibold" style={{ borderColor: TONE.bad, color: TONE.bad }}>
                  name tag
                </span>
              </div>
              <Txt>• EI from an existential premise (unknown)</Txt>
              <Txt>• A named object: Socrates, 7 (known)</Txt>
            </Card>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Before every UG, ask: Where did this constant come from? If the answer is EI or a named object, stop."',
  },
  {
    id: 'c4-restrictions',
    section: C4,
    label: 'Rules With Conditions',
    element: (
      <ContentSlide kicker={C4} title="Rules With Conditions" lead="Four warning signs, and what goes wrong if you ignore them" lesson={SESSION}>
        <div className="grid w-full grid-cols-2 gap-3">
          {[
            ['UG', 'c must be arbitrary: not from EI, not named', '"Some" or "this one" turns into "all"'],
            ['EI', 'c must be a new symbol', 'Two different elements treated as one'],
            ['EI with UI', 'EI first, then UI with the same constant', 'If UI uses c first, EI cannot reuse c'],
            ['UG with nested EI', 'Do not generalize over a variable an EI constant depends on', '∀x ∃y turns into ∃y ∀x'],
          ].map(([r, cond, wrong]) => (
            <Step key={r}>
              <div className="flex h-full gap-3 rounded-card border border-line bg-white px-4 py-3 shadow-card-soft">
                <span className="grid h-12 w-12 shrink-0 rotate-45 place-items-center rounded-md" style={{ background: '#FACC15' }}>
                  <span className="-rotate-45 font-heading text-[18px] font-semibold" style={{ color: colors.ink }}>
                    !
                  </span>
                </span>
                <span>
                  <span className="block font-heading text-[19px] font-semibold" style={{ color: colors.brandDark }}>
                    {r}
                  </span>
                  <Txt className="text-[18px]">{cond}</Txt>
                  <span className="block text-[17px] font-semibold" style={{ color: TONE.bad }}>
                    If ignored: {wrong}
                  </span>
                </span>
              </div>
            </Step>
          ))}
        </div>
      </ContentSlide>
    ),
    notes: '"These four restrictions explain almost every wrong proof in this topic. The Spotting Invalid Arguments section shows each error in action."',
  },
  {
    id: 'c4-order',
    section: C4,
    label: 'EI First, Then UI',
    element: (
      <ContentSlide kicker={C4} title="EI First, Then UI" lead="Premises ∀x (N(x) → I(x)) and ∃x N(x)" lesson={SESSION}>
        <div className="w-full space-y-3">
          {[
            ['Correct kitchen', [['Buy mystery ingredient', 'N(c), c new (EI)'], ['Apply the universal recipe to it', 'N(c) → I(c) (UI, same c)']], 'ok', 'They match'],
            ['Wrong kitchen', [['Write the recipe for c', 'N(c) → I(c) (UI)'], ['Buy the ingredient', 'N(d), d new (EI)']], 'bad', 'c and d do not match'],
          ].map(([n, steps, t, res]) => (
            <Step key={n as string}>
              <Card tone={t as Tone}>
                <Label tone={t as Tone}>{n as string}</Label>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  {(steps as string[][]).map(([a, b], i) => (
                    <span key={a} className="flex items-center gap-2">
                      <span className="rounded-lg border border-line bg-white px-3 py-1">
                        <span className="block text-[17px]" style={{ color: colors.ink }}>
                          {i + 1}. {a}
                        </span>
                        <span className="block font-heading text-[19px] font-semibold" style={{ color: colors.ink }}>
                          {b}
                        </span>
                      </span>
                      {i === 0 && <Arrow />}
                    </span>
                  ))}
                  <span className="ml-2 font-heading text-[19px] font-semibold" style={{ color: TONE[t as Tone] }}>
                    {res as string}
                  </span>
                </div>
              </Card>
            </Step>
          ))}
          <Step>
            <Callout kind="info" title="UI can use any constant" asStep={false}>
              including one created by EI, so it should come second
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Rule of thumb for exams: when a proof uses both EI and UI, write the EI step first."',
  },
  {
    id: 'c4-practice',
    section: C4,
    label: 'Allowed or Not, and Why?',
    element: (
      <ContentSlide kicker={C4} title="Allowed or Not, and Why?" lead="Referee review: replay each clip" lesson={SESSION}>
        <Verdicts
          head={['Proof fragment', 'Verdict']}
          rows={[
            ['1. ∃x P(x)   2. P(c) (EI)   3. ∀x P(x) (UG on 2)', ['Not allowed: c came from EI', false]],
            ['1. ∀x P(x)   2. P(c) (UI)   3. ∀y P(y) (UG on 2)', ['Allowed: c is arbitrary', true]],
            ['1. ∃x P(x)   2. ∃x Q(x)   3. P(c) (EI)   4. Q(c) (EI)', ['Not allowed: step 4 needs a new name', false]],
            ['1. ∃x P(x)   2. P(c) (EI)   3. ∃y P(y) (EG on 2)', ['Allowed', true]],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"Row 2 shows that renaming the bound variable during UG is fine."',
  },
  { id: 'quiz-1', section: C4, label: 'Quiz Time', element: <QuizTimeSlide lesson={SESSION} /> },

  /* ── CONCEPT 5 ───────────────────────────────────────────────────────── */
  { id: 'c5-divider', section: C5, label: 'Divider', element: <SectionBreakerSlide index={5} title={C5} lesson={SESSION} /> },
  {
    id: 'c5-socrates',
    section: C5,
    label: 'Socrates Is Mortal',
    element: (
      <ContentSlide kicker={C5} title="Socrates Is Mortal" lead="The case opens: UI plus Modus Ponens" lesson={SESSION}>
        <div className="w-full space-y-3">
          <Proof
            lines={[
              ['∀x (H(x) → M(x))', 'Premise', 'premise'],
              ['H(s) → M(s)', 'UI (1)', 'strip'],
              ['H(s)', 'Premise', 'premise'],
              ['M(s)', 'MP (2), (3)', 'reason'],
            ]}
          />
          <Txt>Universe: all people. H(x): x is human; M(x): x is mortal; s: Socrates</Txt>
        </div>
      </ContentSlide>
    ),
    notes: '"This closes the gap we saw in the previous session: predicate logic plus UI makes the argument provable."',
  },
  {
    id: 'c5-book',
    section: C5,
    label: 'Someone Passed Without Reading',
    element: (
      <ContentSlide kicker={C5} title="Someone Passed Without Reading" lead="∃x (C(x) ∧ ¬B(x)), ∀x (C(x) → P(x)) ∴ ∃x (P(x) ∧ ¬B(x))" lesson={SESSION}>
        <Proof
          lines={[
            ['∃x (C(x) ∧ ¬B(x))', 'Premise', 'premise'],
            ['C(a) ∧ ¬B(a)', 'EI (1), a new', 'strip'],
            ['C(a)', 'Simp (2)', 'reason'],
            ['∀x (C(x) → P(x))', 'Premise', 'premise'],
            ['C(a) → P(a)', 'UI (4)', 'strip'],
            ['P(a)', 'MP (5), (3)', 'reason'],
            ['¬B(a)', 'Simp (2)', 'reason'],
            ['P(a) ∧ ¬B(a)', 'Conj (6), (7)', 'reason'],
            ['∃x (P(x) ∧ ¬B(x))', 'EG (8)', 'rebuild'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"This combines all three stages: strip (EI, UI), reason (Simp, MP, Conj), rebuild (EG)." Universe: all students. C(x): x is in this class; B(x): x has read the book; P(x): x passed the first exam. Student a holds an unopened book and a PASS certificate.',
  },
  {
    id: 'c5-split-all',
    section: C5,
    label: 'Splitting a Universal',
    element: (
      <ContentSlide kicker={C5} title="Splitting a Universal" lead="∀x (P(x) ∧ Q(x)) ⟹ ∀x P(x) ∧ ∀x Q(x): the zip opens" lesson={SESSION}>
        <Proof
          lines={[
            ['∀x (P(x) ∧ Q(x))', 'Premise', 'premise'],
            ['P(c) ∧ Q(c)', 'UI (1), c arbitrary', 'strip'],
            ['P(c)', 'Simp (2)', 'reason'],
            ['∀x P(x)', 'UG (3)', 'rebuild'],
            ['Q(c)', 'Simp (2)', 'reason'],
            ['∀x Q(x)', 'UG (5)', 'rebuild'],
            ['∀x P(x) ∧ ∀x Q(x)', 'Conj (4), (6)', 'reason'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"This proves the equivalence ∀x (P(x) ∧ Q(x)) ≡ ∀x P(x) ∧ ∀x Q(x) from the Predicate Calculus session in one direction."',
  },
  {
    id: 'c5-split-some',
    section: C5,
    label: 'Splitting an Existential',
    element: (
      <ContentSlide kicker={C5} title="Splitting an Existential" lead="∃x (P(x) ∧ Q(x)) ⟹ ∃x P(x) ∧ ∃x Q(x)" lesson={SESSION}>
        <div className="w-full space-y-3">
          <Proof
            lines={[
              ['∃x (P(x) ∧ Q(x))', 'Premise', 'premise'],
              ['P(c) ∧ Q(c)', 'EI (1), c new', 'strip'],
              ['P(c)', 'Simp (2)', 'reason'],
              ['∃x P(x)', 'EG (3)', 'rebuild'],
              ['Q(c)', 'Simp (2)', 'reason'],
              ['∃x Q(x)', 'EG (5)', 'rebuild'],
              ['∃x P(x) ∧ ∃x Q(x)', 'Conj (4), (6)', 'reason'],
            ]}
          />
          <Step>
            <Callout kind="error" title="The converse is not valid" asStep={false}>
              One student with a bat and a guitar gives "someone plays cricket" and "someone plays guitar", not the other way round (Error 2)
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Ask learners to predict whether the reverse direction works before turning to Spotting Invalid Arguments."',
  },
  {
    id: 'c5-meena',
    section: C5,
    label: 'Every Hard Worker Passes',
    element: (
      <ContentSlide kicker={C5} title="Every Hard Worker Passes" lead="∀x (D(x) → C(x)), ∀x (C(x) → W(x)), D(m) ∴ W(m)" lesson={SESSION}>
        <div className="w-full space-y-3">
          <div className="grid grid-cols-3 gap-3">
            {['Meena practises daily: D(m)', 'She is confident: C(m)', 'She does well in interviews: W(m)'].map((p, i) => (
              <Card key={p}>
                <Label>Panel {i + 1}</Label>
                <Txt>{p}</Txt>
              </Card>
            ))}
          </div>
          <Proof
            lines={[
              ['D(m) → C(m)', 'UI on the first premise', 'strip'],
              ['C(m) → W(m)', 'UI on the second premise', 'strip'],
              ['D(m) → W(m)', 'HS (1), (2)', 'reason'],
              ['W(m)', 'MP (3), premise D(m)', 'reason'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"Here UI is used with the named constant m, which is always allowed. We never generalize over m." English: Every student who practises daily is confident. Every confident student does well in interviews. Meena is a student who practises daily.',
  },
  {
    id: 'c5-practice',
    section: C5,
    label: 'Write a Full Proof',
    element: (
      <ContentSlide kicker={C5} title="Write a Full Proof" lead="Drag the rule tiles into order, then reveal" lesson={SESSION}>
        <RevealTable
          keep={2}
          columns={[{ label: 'Premises', weight: 1.5 }, { label: 'Conclusion', weight: 0.9 }, { label: 'Key steps', weight: 1.4 }]}
          rows={[
            ['∀x (P(x) → Q(x)), ¬Q(b)', '¬P(b)', 'UI; MT'],
            ['∀x (A(x) ∨ B(x)), ∀x ¬A(x)', '∀x B(x)', 'UI on both (arbitrary c); DS; UG'],
            ['∃x P(x), ∀x (P(x) → R(x))', '∃x R(x)', 'EI; UI; MP; EG'],
            ['∀x (F(x) → G(x)), ∃x (F(x) ∧ H(x))', '∃x (G(x) ∧ H(x))', 'EI; Simp twice; UI; MP; Conj; EG'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"Remind learners: in rows 3 and 4, do EI first."',
  },

  /* ── CONCEPT 6 ───────────────────────────────────────────────────────── */
  { id: 'c6-divider', section: C6, label: 'Divider', element: <SectionBreakerSlide index={6} title={C6} lesson={SESSION} /> },
  {
    id: 'c6-error1',
    section: C6,
    label: 'Error 1: From Some to All',
    element: (
      <ContentSlide kicker={C6} title="Error 1: From Some to All" lead="Illegal UG on an EI constant" lesson={SESSION}>
        <div className="w-full space-y-3">
          <Proof
            lines={[
              ['∃x P(x)', 'Premise', 'premise'],
              ['P(c)', 'EI (1)', 'strip'],
              ['∀x P(x)', 'UG on 2: c came from EI', 'bad'],
            ]}
          />
          <Step>
            <Card>
              <span className="inline-block font-heading text-[22px] font-semibold line-through" style={{ color: TONE.bad, textDecorationThickness: 3 }}>
                "ALL STUDENTS WIN GOLD"
              </span>
              <Txt className="mt-1">Counterexample: universe {'{1, 2}'}, P(x): x is even. ∃x P(x) is true (x = 2), ∀x P(x) is false (x = 1)</Txt>
            </Card>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Any time a proof turns some into all, look for this error." One student won gold; the headline claims all did.',
  },
  {
    id: 'c6-error2',
    section: C6,
    label: 'Error 2: Two Different Somebodies',
    element: (
      <ContentSlide kicker={C6} title="Error 2: Two Different Somebodies" lead="Claim: ∃x P(x), ∃x Q(x) ∴ ∃x (P(x) ∧ Q(x))" lesson={SESSION}>
        <div className="w-full space-y-3">
          <Proof
            lines={[
              ['P(c)', 'EI on ∃x P(x)', 'strip'],
              ['Q(c)', 'EI on ∃x Q(x): c is not new', 'bad'],
              ['P(c) ∧ Q(c)', 'Conj', 'reason'],
              ['∃x (P(x) ∧ Q(x))', 'EG', 'rebuild'],
            ]}
          />
          <Step>
            <Callout kind="error" title="The second EI must use a new name d, giving Q(d)" asStep={false}>
              Nothing joins P(c) and Q(d). Counterexample: universe {'{1, 2}'}, P: odd, Q: even. Both premises true, no number is both
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"This is why the converse on Splitting an Existential fails." Picture: a tall person and a left-handed person merged into one glitching photo.',
  },
  {
    id: 'c6-error3',
    section: C6,
    label: 'Error 3: Affirming the Consequent',
    element: (
      <ContentSlide kicker={C6} title="Error 3: Affirming the Consequent" lead="All engineers know maths. Kiran knows maths. ∴ Kiran is an engineer" lesson={SESSION}>
        <div className="grid w-full grid-cols-[320px_1fr] items-center gap-6">
          <div className="grid h-[260px] w-[300px] place-items-center rounded-full border-4" style={{ borderColor: colors.brand, background: `${colors.brand}0D` }}>
            <div className="relative h-full w-full">
              <span className="absolute left-1/2 top-3 -translate-x-1/2 text-[17px] font-semibold" style={{ color: colors.brandDark }}>
                know maths
              </span>
              <span className="absolute left-[70px] top-[80px] grid h-[120px] w-[120px] place-items-center rounded-full border-4 text-[17px] font-semibold" style={{ borderColor: '#7C3AED', color: '#7C3AED' }}>
                engineers
              </span>
              <span className="absolute bottom-10 right-8 rounded-full px-3 py-1 text-[17px] font-semibold text-white" style={{ background: TONE.bad }}>
                Kiran
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <Card>
              <Big>∀x (E(x) → M(x)), M(k) ∴ E(k)</Big>
            </Card>
            <Step>
              <Card tone="bad">
                <Txt>After UI: E(k) → M(k) and M(k). This is affirming the consequent: invalid</Txt>
              </Card>
            </Step>
            <Step>
              <Card>
                <Txt>Counterexample: Kiran is a maths teacher who knows maths but is not an engineer</Txt>
              </Card>
            </Step>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"Quantifier rules are used correctly here, but a propositional fallacy creeps in after UI."',
  },
  {
    id: 'c6-error4',
    section: C6,
    label: 'Error 4: Swapping ∀ and ∃',
    element: (
      <ContentSlide kicker={C6} title="Error 4: Swapping ∀ and ∃" lead="Claim: ∀x ∃y L(x, y) ∴ ∃y ∀x L(x, y)" lesson={SESSION}>
        <div className="w-full space-y-3">
          <Proof
            lines={[
              ['∃y L(c, y)', 'UI on the premise', 'strip'],
              ['L(c, d)', 'EI: d chosen after c', 'strip'],
              ['∀x L(x, d)', 'UG on c: d depends on c', 'bad'],
              ['∃y ∀x L(x, y)', 'EG', 'rebuild'],
            ]}
          />
          <Step>
            <Callout kind="error" title="Counterexample: universe {1, 2}, only L(1, 1) and L(2, 2)" asStep={false}>
              Everyone loves someone (themself), but nobody is loved by both. Once d is picked to match c, it need not work for every c
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"This links back to Order Matters in the Predicate Calculus session: the order of different quantifiers matters." Game picture: the opponent picks c, you pick d to match.',
  },
  {
    id: 'c6-small',
    section: C6,
    label: 'Build a Small Universe',
    element: (
      <ContentSlide kicker={C6} title="Build a Small Universe" lead="Premises all true, conclusion false: the argument is invalid" lesson={SESSION}>
        <div className="w-full space-y-3">
          <div className="grid grid-cols-3 gap-3">
            {['Choose a small universe, often 1 to 3 elements', 'Decide which elements make each predicate true', 'Check every premise is true and the conclusion false'].map((t, i) => (
              <div key={t} className="rounded-t-[28px] border-2 bg-white px-4 pb-3 pt-4" style={{ borderColor: colors.brand }}>
                <Label>Room {i + 1}</Label>
                <Txt className="text-[18px]">{t}</Txt>
              </div>
            ))}
          </div>
          <RevealTable
            columns={[{ label: 'Argument', weight: 1.5 }, { label: 'Small universe counterexample', weight: 1.1 }]}
            rows={[
              ['∃x P(x) ∴ ∀x P(x)', '{1, 2}; P true only for 2'],
              ['∀x (P(x) ∨ Q(x)) ∴ ∀x P(x) ∨ ∀x Q(x)', '{1, 2}; P only for 1, Q only for 2'],
              ['∀x (P(x) → Q(x)), Q(a) ∴ P(a)', '{a}; P(a) false, Q(a) true'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"One counterexample is enough to prove invalidity, just like a critical row with a false conclusion in a truth table."',
  },

  /* ── CONCEPT 7 ───────────────────────────────────────────────────────── */
  { id: 'c7-divider', section: C7, label: 'Divider', element: <SectionBreakerSlide index={7} title={C7} lesson={SESSION} /> },
  {
    id: 'c7-checklist',
    section: C7,
    label: 'Before You Submit a Proof',
    element: (
      <ContentSlide kicker={C7} title="Before You Submit a Proof" lead="Pre-flight: all five switches green before take-off" lesson={SESSION}>
        <div className="w-full space-y-2">
          {[
            'Did every EI use a new name?',
            'Did I do EI before UI on the same constant?',
            'Is every UG on an arbitrary constant (not from EI, not a named object)?',
            'Are the propositional steps valid (no affirming the consequent or denying the antecedent)?',
            'Does every line have a reason (Premise, UI, EI, UG, EG, MP, …)?',
          ].map((q, i) => (
            <Step key={q}>
              <div className="flex items-center gap-4 rounded-card border border-line bg-white px-4 py-2 shadow-card-soft">
                <span className="relative h-7 w-14 rounded-full" style={{ background: colors.success }}>
                  <span className="absolute right-1 top-1 h-5 w-5 rounded-full bg-white" />
                </span>
                <span className="font-heading text-[17px] font-semibold" style={{ color: colors.brandDark }}>
                  Check {i + 1}
                </span>
                <Txt>{q}</Txt>
              </div>
            </Step>
          ))}
        </div>
      </ContentSlide>
    ),
    notes: '"Ask learners to run this checklist on a proof from Deriving Conclusions and then on a faulty proof from Spotting Invalid Arguments."',
  },
  {
    id: 'c7-mixed',
    section: C7,
    label: 'Prove or Refute',
    element: (
      <ContentSlide kicker={C7} title="Prove or Refute" lead="Open each case file, then reveal" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Case file', weight: 1.7 }, { label: 'Answer', weight: 1.3 }]}
          rows={[
            ['PROVE: ∀x (P(x) → Q(x)), P(a) ∴ ∃x Q(x)', 'UI; MP gives Q(a); EG'],
            ['PROVE: ∀x P(x) ∴ ∃x P(x) (non-empty universe)', 'UI gives P(c); EG'],
            ['REFUTE? ∃x P(x) ∧ ∃x Q(x) ∴ ∃x (P(x) ∧ Q(x))', <Lit v="Invalid: Error 2" tone="bad" />],
            ['FIND THE ERROR: 1. ∀x ∃y (x < y)  2. ∃y (c < y) (UI)  3. c < d (EI)  4. ∀x (x < d) (UG)', <Lit v="Step 4: d depends on c, UG illegal" tone="bad" />],
            ['PROVE: ∀x (S(x) → T(x)), ∃x ¬T(x) ∴ ∃x ¬S(x)', 'EI gives ¬T(c); UI gives S(c) → T(c); MT gives ¬S(c); EG'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"Row 2 needs the usual assumption that the universe is non-empty, which is standard in this course."',
  },

  /* ── CLOSING ────────────────────────────────────────────────────────── */
  { id: 'quiz-2', section: 'Closing', label: 'Quiz Time', element: <QuizTimeSlide lesson={SESSION} /> },
  { id: 'takeaways', section: 'Closing', label: 'Key Takeaways', element: <KeyTakeawaysSlide title={SESSION} lesson={SESSION} points={AGENDA} /> },
  { id: 'feedback', section: 'Closing', label: 'Feedback', element: <FeedbackSlide lesson={SESSION} formless />, notes: 'No form and no QR (content rule 41 as amended 2026-11-21). Ask for feedback out loud.' },
  { id: 'thank-you', section: 'Closing', label: 'Thank you', element: <ThankYouSlide title="Thank You" lesson={SESSION} /> },
  { id: 'all-the-best', section: 'Closing', label: 'All the best', element: <ThankYouSlide title="All the Best" lesson={SESSION} /> },
]
