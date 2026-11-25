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
 * NORMAL FORMS (DSM, Mathematical Logic).
 *
 * Built from the signed-off plan at
 *   Outputs/dsm/session_plans/normal_forms/plan.md
 * the source of truth for order, framework and wording. Every equivalence and
 * every PDNF / PCNF here was checked by truth table in `verify_tr.py`.
 *
 * Seven concepts, one deck slide per TR slide. Visuals are DOM figures (cards,
 * chips, rails, doors), never SVG text, so the harnesses can see every label.
 */

const SESSION = 'Normal Forms'
const C1 = 'Why Normal Forms'
const C2 = 'Building Blocks'
const C3 = 'DNF and CNF'
const C4 = 'Converting to DNF and CNF'
const C5 = 'Principal Normal Forms'
const C6 = 'Using Truth Tables'
const C7 = 'Uniqueness and Ordering'
const AGENDA = [C1, C2, C3, C4, C5, C6, C7]

export const normalFormsMeta: DeckMeta = {
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

/** A table whose answer columns arrive one row per press. */
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

/** A formula chip: one tile with a coloured edge. */
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

/** A derivation line by line: struck parts in red, inserted parts in green. */
type Seg = string | { del: string } | { ins: string }
function Derivation({ lines }: { lines: { f: Seg[]; why: string }[] }) {
  return (
    <div className="w-full space-y-2">
      {lines.map((ln, i) => {
        const body = (
          <div className="grid grid-cols-[40px_1fr_260px] items-center gap-3 rounded-card border border-line bg-white px-4 py-2.5 shadow-card-soft">
            <span className="grid h-8 w-8 place-items-center rounded-full font-heading text-[16px] font-semibold text-white" style={{ background: colors.brand }}>
              {i + 1}
            </span>
            <span className="font-heading text-[22px] font-semibold" style={{ color: colors.ink }}>
              {ln.f.map((s, j) =>
                typeof s === 'string' ? (
                  <span key={j}>{s}</span>
                ) : 'del' in s ? (
                  <span key={j} className="line-through" style={{ color: TONE.bad, textDecorationThickness: 2 }}>
                    {s.del}
                  </span>
                ) : (
                  <span key={j} className="rounded px-1 underline" style={{ color: TONE.ok, background: `${TONE.ok}14`, textDecorationThickness: 2 }}>
                    {s.ins}
                  </span>
                ),
              )}
            </span>
            <span className="text-[18px]" style={{ color: colors.ink }}>
              {ln.why}
            </span>
          </div>
        )
        return i === 0 ? <div key={i}>{body}</div> : <Step key={i}>{body}</Step>
      })}
    </div>
  )
}

/** Truth-table rows as doors: each door shows its row and, below, the term that belongs to it. */
function Doors({ rows, term, lit, kind }: { rows: string[]; term: (i: number) => string; lit?: (i: number) => boolean; kind: 'key' | 'lock' }) {
  return (
    <div className="grid w-full gap-4" style={{ gridTemplateColumns: `repeat(${rows.length}, minmax(0, 1fr))` }}>
      {rows.map((r, i) => {
        const on = lit ? lit(i) : true
        const tone: Tone = kind === 'key' ? 'ok' : 'warn'
        return (
          <Step key={i} className="flex flex-col items-center gap-2">
            <div
              className="flex h-[150px] w-[120px] flex-col items-center justify-center rounded-t-[60px] border-2"
              style={{ borderColor: on ? TONE[tone] : colors.line, background: on ? `${TONE[tone]}18` : '#fff' }}
            >
              <span className="text-[17px]" style={{ color: colors.ink }}>
                Row
              </span>
              <span className="font-heading text-[24px] font-semibold" style={{ color: colors.ink }}>
                {r}
              </span>
            </div>
            <span className="text-[17px]" style={{ color: on ? TONE[tone] : colors.ink, opacity: on ? 1 : 0.55 }}>
              {kind === 'key' ? 'key' : 'lock'}
            </span>
            <Chip tone={on ? tone : 'plain'}>{term(i)}</Chip>
          </Step>
        )
      })}
    </div>
  )
}

const TFrows = ['TT', 'TF', 'FT', 'FF']
const minterm2 = ['P ∧ Q', 'P ∧ ¬Q', '¬P ∧ Q', '¬P ∧ ¬Q']
const maxterm2 = ['¬P ∨ ¬Q', '¬P ∨ Q', 'P ∨ ¬Q', 'P ∨ Q']

/** A parallel circuit: each branch is a row of series switches between two rails. */
function Circuit({ branches }: { branches: string[][] }) {
  return (
    <div className="flex w-full items-stretch gap-0">
      <div className="w-[6px] rounded-full" style={{ background: colors.brandDark }} />
      <div className="flex flex-1 flex-col gap-3 py-2">
        {branches.map((b, i) => (
          <Step key={i} className="flex items-center">
            <div className="h-[3px] w-8" style={{ background: colors.brandDark }} />
            {b.map((s, j) => (
              <span key={j} className="flex items-center">
                <Chip>{s}</Chip>
                {j < b.length - 1 && (
                  <span className="flex items-center">
                    <span className="h-[3px] w-5" style={{ background: colors.brandDark }} />
                    <span className="font-heading text-[18px] font-semibold" style={{ color: colors.brandDark }}>
                      ∧
                    </span>
                    <span className="h-[3px] w-5" style={{ background: colors.brandDark }} />
                  </span>
                )}
              </span>
            ))}
            <div className="h-[3px] flex-1" style={{ background: colors.brandDark }} />
          </Step>
        ))}
      </div>
      <div className="w-[6px] rounded-full" style={{ background: colors.brandDark }} />
      <div className="ml-4 flex flex-col items-center justify-center">
        <span className="grid h-16 w-16 place-items-center rounded-full text-[30px]" style={{ background: '#FEF3C7', boxShadow: `0 0 24px ${colors.warning}66` }}>
          💡
        </span>
        <span className="mt-1 text-[17px]" style={{ color: colors.ink }}>
          lights if any branch closes
        </span>
      </div>
    </div>
  )
}

/** A checklist: one clause per line, ticked one per press. */
function Checklist({ items, title }: { items: string[]; title: string }) {
  return (
    <Card className="w-full max-w-[640px]">
      <Label>{title}</Label>
      <div className="mt-2 space-y-2">
        {items.map((t, i) => (
          <Step key={i} className="flex items-center gap-3 border-b border-dashed border-line pb-2 last:border-0">
            <span className="grid h-7 w-7 place-items-center rounded-md text-[18px] font-semibold text-white" style={{ background: colors.success }}>
              ✓
            </span>
            <span className="font-heading text-[22px] font-semibold" style={{ color: colors.ink }}>
              {t}
            </span>
          </Step>
        ))}
      </div>
    </Card>
  )
}

function Arrow({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center px-2">
      <span className="font-heading text-[34px] font-semibold" style={{ color: colors.brand }}>
        ⟶
      </span>
      {label && (
        <span className="text-[17px]" style={{ color: colors.ink }}>
          {label}
        </span>
      )}
    </div>
  )
}

/* ── slide-specific figures ─────────────────────────────────────────────── */

/** C6: tiles drop into Literal / Product / Sum / None bins, one per press. */
function SortingBins() {
  const tiles: [string, number, string?][] = [
    ['¬Q', 0, 'also a product and a sum'],
    ['P ∧ ¬R ∧ Q', 1],
    ['¬P ∨ R', 2],
    ['P ∧ (Q ∨ R)', 3, 'mixes ∧ and ∨'],
    ['¬(P ∧ Q)', 3, '¬ on a compound'],
  ]
  const bins = ['Literal', 'Product', 'Sum', 'None']
  const k = useBuild(tiles.length)
  return (
    <div className="w-full space-y-3">
      <div className="flex flex-wrap justify-center gap-3">
        {tiles.map(([t], i) => (
          <span key={i} style={{ opacity: i < k ? 0.35 : 1 }}>
            <Chip tone="plain">{t}</Chip>
          </span>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-3">
        {bins.map((b, bi) => (
          <div key={b} className="min-h-[220px] rounded-card border-2 border-dashed px-3 py-3" style={{ borderColor: bi === 3 ? `${TONE.warn}88` : `${colors.brand}55` }}>
            <Label tone={bi === 3 ? 'warn' : undefined}>{b}</Label>
            <div className="mt-2 flex flex-col gap-2">
              {tiles.map(([t, to, why], i) =>
                to === bi && i < k ? (
                  <Fresh key={i} className="block">
                    <Chip tone={bi === 3 ? 'warn' : 'ok'}>{t}</Chip>
                    {why && (
                      <span className="mt-1 block text-[16px]" style={{ color: colors.ink }}>
                        {why}
                      </span>
                    )}
                  </Fresh>
                ) : null,
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/** C28: six dials; each answer turns one, and the last opens the door. */
function EscapeDoor() {
  const qs: [string, string][] = [
    ['A CNF', '(¬P ∨ Q) ∧ (¬Q ∨ P)'],
    ['A DNF', '(P ∧ Q) ∨ (¬P ∧ ¬Q)'],
    ['Number of true rows', '2'],
    ['PDNF', '(P ∧ Q) ∨ (¬P ∧ ¬Q)'],
    ['PCNF', '(¬P ∨ Q) ∧ (P ∨ ¬Q)'],
    ['Which connective is it?', 'P ↔ Q'],
  ]
  const k = useBuild(qs.length)
  return (
    <div className="grid w-full grid-cols-3 gap-3">
      {qs.map(([q, a], i) => (
        <div
          key={q}
          className="flex min-h-[118px] flex-col rounded-card border-2 px-4 py-3"
          style={{ borderColor: i < k ? (i === 5 ? TONE.ok : `${colors.brand}88`) : colors.line, background: i < k ? (i === 5 ? `${TONE.ok}14` : '#fff') : `${colors.line}40` }}
        >
          <span className="flex items-center gap-2 font-heading text-[18px] font-semibold" style={{ color: colors.brandDark }}>
            <span className="grid h-7 w-7 place-items-center rounded-full text-[16px] text-white" style={{ background: i < k ? colors.success : colors.brand }}>
              {i + 1}
            </span>
            {q}
          </span>
          {i < k && (
            <Fresh className="mt-2 block">
              <span className="font-heading text-[21px] font-semibold" style={{ color: colors.ink }}>
                {a}
              </span>
            </Fresh>
          )}
        </div>
      ))}
    </div>
  )
}

/** C27: a console; each claim is an error line, then its fix. */
function Console({ items }: { items: [string, string, string][] }) {
  return (
    <div className="w-full rounded-card px-5 py-4 font-mono" style={{ background: '#0F1B2D' }}>
      {items.map(([claim, err, fix], i) => (
        <Step key={i} className="border-b border-white/10 py-1.5 last:border-0">
          <span className="block text-[17px]" style={{ color: '#FCA5A5' }}>
            ✗ {claim}: {err}
          </span>
          <span className="block text-[17px]" style={{ color: '#86EFAC' }}>
            ✓ {fix}
          </span>
        </Step>
      ))}
    </div>
  )
}

/* ── the deck ───────────────────────────────────────────────────────────── */

export const normalFormsDeck: SlideDef[] = [
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
          { title: C1, sub: 'A standard shape for formulas' },
          { title: C2, sub: 'Literals, products and sums' },
          { title: C3, sub: 'Disjunctive and conjunctive forms' },
          { title: C4, sub: 'A three-step recipe' },
          { title: C5, sub: 'Minterms, maxterms, PDNF and PCNF' },
          { title: C6, sub: 'Reading the forms from a table' },
          { title: C7, sub: 'One official form, and its uses' },
        ]}
      />
    ),
  },

  /* ── CONCEPT 1: Why Normal Forms (4MAT) ─────────────────────────────── */
  { id: 'c1-divider', section: C1, label: 'Divider', element: <SectionBreakerSlide index={1} title={C1} lesson={SESSION} /> },
  {
    id: 'c1-same',
    section: C1,
    label: 'Same Meaning, Different Look',
    element: (
      <ContentSlide kicker={C1} title="Same Meaning, Different Look" lead="Think First: are these three formulas saying the same thing?" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {[
              ['P → Q', 'brand'],
              ['¬P ∨ Q', 'ok'],
              ['¬Q → ¬P', 'warn'],
            ].map(([f, t]) => (
              <Card key={f} tone={t as Tone} className="text-center">
                <span className="font-heading text-[30px] font-semibold" style={{ color: colors.ink }}>
                  {f}
                </span>
              </Card>
            ))}
          </div>
          <Step>
            <Card className="text-center">
              <Label>Same fingerprint: truth values in rows TT, TF, FT, FF</Label>
              <div className="mt-2 flex justify-center gap-3">
                {['T', 'F', 'T', 'T'].map((v, i) => (
                  <Lit key={i} v={<span className="px-2 text-[24px]">{v}</span>} tone={v === 'T' ? 'ok' : 'bad'} />
                ))}
              </div>
            </Card>
          </Step>
          <Step>
            <Callout kind="info" title="Logically equivalent" asStep={false}>
              Same truth table, but hard to tell from their shapes. We need a standard shape
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"This links to logical equivalence from the Connectives session. Today we learn a standard uniform that every formula can be dressed in."',
  },
  {
    id: 'c1-shape',
    section: C1,
    label: 'A Standard Shape',
    element: (
      <ContentSlide kicker={C1} title="A Standard Shape" lead="A normal form uses only ¬, ∧ and ∨, arranged in a fixed pattern" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Card tone="warn">
              <Label tone="warn">In: messy</Label>
              <span className="font-heading text-[22px] font-semibold" style={{ color: colors.ink }}>
                ¬((P → Q) ↔ ¬(R ∧ ¬P))
              </span>
            </Card>
            <Arrow label="standardise" />
            <Card tone="ok">
              <Label tone="ok">Out: neat</Label>
              <span className="font-heading text-[22px] font-semibold" style={{ color: colors.ink }}>
                (… ∧ …) ∨ (… ∧ …)
              </span>
            </Card>
          </div>
          <StepCards
            cols={2}
            items={[
              ['Compare formulas', 'Equivalent formulas get the same principal form'],
              ['Test formulas', 'Tautology or contradiction?'],
              ['Design circuits', 'AND-OR and OR-AND gate layouts'],
              ['Feed computer programs', 'SAT solvers need a fixed input format'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"Keep this motivational. Each purpose will appear again in an example during the session."',
  },
  {
    id: 'c1-laws',
    section: C1,
    label: 'The Laws We Need',
    element: (
      <ContentSlide kicker={C1} title="The Laws We Need" lead="Our toolbox from the Connectives session" lesson={SESSION}>
        <StepCards
          items={[
            ['Implication', 'P → Q ≡ ¬P ∨ Q'],
            ['Biconditional', 'P ↔ Q ≡ (P → Q) ∧ (Q → P) ≡ (P ∧ Q) ∨ (¬P ∧ ¬Q)'],
            ['Double negation', '¬¬P ≡ P'],
            ["De Morgan's laws", '¬(P ∧ Q) ≡ ¬P ∨ ¬Q;  ¬(P ∨ Q) ≡ ¬P ∧ ¬Q'],
            ['Distributive laws', 'P ∧ (Q ∨ R) ≡ (P ∧ Q) ∨ (P ∧ R);  P ∨ (Q ∧ R) ≡ (P ∨ Q) ∧ (P ∨ R)'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"Ask learners to verify one law, such as P → Q ≡ ¬P ∨ Q, with a quick truth table before moving on."',
  },

  /* ── CONCEPT 2: Building Blocks (Merrill) ───────────────────────────── */
  { id: 'c2-divider', section: C2, label: 'Divider', element: <SectionBreakerSlide index={2} title={C2} lesson={SESSION} /> },
  {
    id: 'c2-literals',
    section: C2,
    label: 'Literals',
    element: (
      <ContentSlide kicker={C2} title="Literals" lead="A literal is a variable or its negation" lesson={SESSION}>
        <div className="grid w-full grid-cols-[1.2fr_1fr] gap-5">
          <Card tone="ok">
            <Label tone="ok">Single bricks: literals</Label>
            <div className="mt-3 flex flex-wrap gap-3">
              {['P', '¬P', 'Q', '¬R'].map((t) => (
                <Chip key={t} tone="ok" big>
                  {t}
                </Chip>
              ))}
            </div>
          </Card>
          <Step>
            <Card tone="warn">
              <Label tone="warn">Not one brick</Label>
              <div className="mt-3 space-y-2">
                <div>
                  <Chip tone="warn">P ∧ Q</Chip>
                  <span className="ml-2 text-[18px]" style={{ color: colors.ink }}>
                    two variables joined
                  </span>
                </div>
                <div>
                  <Chip tone="warn">¬(P ∨ Q)</Chip>
                  <span className="ml-2 text-[18px]" style={{ color: colors.ink }}>
                    ¬ on a compound
                  </span>
                </div>
              </div>
            </Card>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"A literal is one variable, with or without a single ¬ directly in front of it."',
  },
  {
    id: 'c2-products-sums',
    section: C2,
    label: 'Products and Sums',
    element: (
      <ContentSlide kicker={C2} title="Products and Sums" lead="Literals joined by only one kind of connective" lesson={SESSION}>
        <div className="w-full space-y-4">
          {[
            ['Elementary product (conjunctive clause)', '∧', ['P', '¬Q', 'R'], 'P ∧ ¬Q,  ¬P ∧ Q ∧ R,  P'],
            ['Elementary sum (clause)', '∨', ['¬P', 'Q', 'R'], 'P ∨ ¬Q,  ¬P ∨ Q ∨ R,  ¬Q'],
          ].map(([name, op, beads, ex]) => (
            <Step key={name as string}>
              <Card>
                <Label>{name}</Label>
                <div className="mt-2 flex items-center gap-2">
                  {(beads as string[]).map((b, i) => (
                    <span key={b} className="flex items-center gap-2">
                      <span className="grid h-14 w-14 place-items-center rounded-full font-heading text-[22px] font-semibold text-white" style={{ background: colors.brand }}>
                        {b}
                      </span>
                      {i < 2 && (
                        <span className="font-heading text-[26px] font-semibold" style={{ color: colors.brandDark }}>
                          {op}
                        </span>
                      )}
                    </span>
                  ))}
                  <span className="ml-6 text-[19px]" style={{ color: colors.ink }}>
                    Examples: {ex}
                  </span>
                </div>
              </Card>
            </Step>
          ))}
          <Step>
            <Callout kind="success" title="One literal" asStep={false}>
              A single literal counts as both an elementary product and an elementary sum
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Tremblay and Manohar use elementary product and elementary sum. Many books and computer tools say clause for an elementary sum."',
  },
  {
    id: 'c2-name',
    section: C2,
    label: 'Name the Piece',
    element: (
      <ContentSlide kicker={C2} title="Name the Piece" lead="Literal, product, sum or none? Decide, then reveal" lesson={SESSION}>
        <SortingBins />
      </ContentSlide>
    ),
    notes: '"The last row is a common trap: ¬(P ∧ Q) becomes an elementary sum only after De Morgan\'s law, ¬P ∨ ¬Q."',
  },

  /* ── CONCEPT 3: DNF and CNF (Merrill) ───────────────────────────────── */
  { id: 'c3-divider', section: C3, label: 'Divider', element: <SectionBreakerSlide index={3} title={C3} lesson={SESSION} /> },
  {
    id: 'c3-dnf',
    section: C3,
    label: 'OR of ANDs',
    element: (
      <ContentSlide kicker={C3} title="OR of ANDs" lead="DNF: a disjunction (∨) of elementary products" lesson={SESSION}>
        <div className="w-full space-y-4">
          <Circuit branches={[['P', '¬Q'], ['¬P', 'Q', 'R'], ['R']]} />
          <Step>
            <Callout kind="info" title="(P ∧ ¬Q) ∨ (¬P ∧ Q ∧ R) ∨ R" asStep={false}>
              Each product is one way to make the formula true
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Series switches behave like AND, parallel branches like OR. A DNF is parallel branches of series switches." Pattern: ( … ∧ … ) ∨ ( … ∧ … ) ∨ …',
  },
  {
    id: 'c3-cnf',
    section: C3,
    label: 'AND of ORs',
    element: (
      <ContentSlide kicker={C3} title="AND of ORs" lead="CNF: a conjunction (∧) of elementary sums (clauses)" lesson={SESSION}>
        <div className="flex w-full items-start gap-6">
          <Checklist title="(P ∨ ¬Q) ∧ (¬P ∨ Q ∨ R) ∧ ¬R" items={['P ∨ ¬Q', '¬P ∨ Q ∨ R', '¬R']} />
          <Step className="flex-1">
            <Callout kind="info" title="Every line needs a tick" asStep={false}>
              Each clause is a condition that must hold
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Think of CNF as a list of rules that must all be satisfied, like the eligibility conditions on an application form." Pattern: ( … ∨ … ) ∧ ( … ∨ … ) ∧ …',
  },
  {
    id: 'c3-check',
    section: C3,
    label: 'Check the Shape',
    element: (
      <ContentSlide kicker={C3} title="Check the Shape" lead="DNF, CNF, both or neither?" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Formula', weight: 1 }, { label: mh('DNF?'), weight: 1.2 }, { label: mh('CNF?'), weight: 1.3 }]}
          rows={[
            ['(P ∧ Q) ∨ ¬R', <Lit v="Yes" tone="ok" />, <Lit v="No" tone="bad" />],
            ['(P ∨ Q) ∧ ¬R', <Lit v="No" tone="bad" />, <Lit v="Yes" tone="ok" />],
            ['P ∧ ¬Q ∧ R', <Lit v="Yes: one product" tone="ok" />, <Lit v="Yes: three one-literal clauses" tone="ok" />],
            ['P ∨ ¬Q', <Lit v="Yes: two one-literal products" tone="ok" />, <Lit v="Yes: one clause" tone="ok" />],
            ['¬(P ∧ Q)', <Lit v="No" tone="bad" />, <Lit v="No" tone="bad" />],
            ['P → Q', <Lit v="No" tone="bad" />, <Lit v="No: → not allowed" tone="bad" />],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"Rows 3 and 4 show that a single product or a single clause is in both forms. That is fine."',
  },
  {
    id: 'c3-not-unique',
    section: C3,
    label: 'More Than One DNF',
    element: (
      <ContentSlide kicker={C3} title="More Than One DNF" lead="Equivalent formulas, all in DNF" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {[
              ['P', 'the short one'],
              ['P ∨ (P ∧ Q)', 'absorption law'],
              ['(P ∧ Q) ∨ (P ∧ ¬Q)', 'split on Q'],
            ].map(([f, why]) => (
              <Step key={f}>
                <Card className="text-center">
                  <span className="inline-block rounded-md px-2 text-[16px] font-semibold text-white" style={{ background: colors.brand }}>
                    DNF
                  </span>
                  <span className="mt-2 block font-heading text-[24px] font-semibold" style={{ color: colors.ink }}>
                    {f}
                  </span>
                  <span className="block text-[18px]" style={{ color: colors.ink }}>
                    {why}
                  </span>
                </Card>
              </Step>
            ))}
          </div>
          <Step>
            <Callout kind="warning" title="Which one is the official ID photo?" asStep={false}>
              A formula has many DNFs and many CNFs. A unique form comes in Section 5: the principal normal forms
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"This is the motivation for PDNF and PCNF: an official, unique ID photo for every formula."',
  },

  /* ── CONCEPT 4: Converting (Merrill) ────────────────────────────────── */
  { id: 'c4-divider', section: C4, label: 'Divider', element: <SectionBreakerSlide index={4} title={C4} lesson={SESSION} /> },
  {
    id: 'c4-recipe',
    section: C4,
    label: 'Three Steps',
    element: (
      <ContentSlide kicker={C4} title="Three Steps" lead="From any formula to DNF or CNF" lesson={SESSION}>
        <div className="w-full space-y-3">
          <StepCards
            items={[
              ['Remove → and ↔', 'Implication and biconditional laws'],
              ['Push ¬ inwards until it sits only on variables', "De Morgan's laws, double negation"],
              ['Distribute to get the required shape', '∧ over ∨ for DNF; ∨ over ∧ for CNF'],
            ]}
          />
          <Step>
            <Callout kind="success" title="Finally, simplify" asStep={false}>
              Remove repeated literals, and drop products that contain P ∧ ¬P
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Exam hook: write the law used beside every line of a conversion. Examiners give marks for each justified step."',
  },
  {
    id: 'c4-dnf',
    section: C4,
    label: 'Converting to DNF',
    element: (
      <ContentSlide kicker={C4} title="Converting to DNF" lead="¬(P → Q) ∨ (P ∧ R)" lesson={SESSION}>
        <div className="w-full space-y-3">
          <Derivation
            lines={[
              { f: ['¬(P → Q) ∨ (P ∧ R)'], why: 'Given' },
              { f: ['¬(', { del: 'P → Q' }, { ins: '¬P ∨ Q' }, ') ∨ (P ∧ R)'], why: 'Implication law' },
              { f: ['(', { del: '¬(¬P ∨ Q)' }, { ins: '¬¬P ∧ ¬Q' }, ') ∨ (P ∧ R)'], why: "De Morgan's law" },
              { f: ['(', { del: '¬¬P' }, { ins: 'P' }, ' ∧ ¬Q) ∨ (P ∧ R)'], why: 'Double negation' },
            ]}
          />
          <Step>
            <Callout kind="success" title="DNF" asStep={false}>
              A disjunction of two elementary products
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"No distribution was needed here. Ask: what would the CNF of line 4 be? P ∧ (¬Q ∨ R), by factoring out P."',
  },
  {
    id: 'c4-cnf',
    section: C4,
    label: 'Converting to CNF',
    element: (
      <ContentSlide kicker={C4} title="Converting to CNF" lead="(P ∧ Q) ∨ ¬R: copy ¬R onto each of P and Q" lesson={SESSION}>
        <div className="w-full space-y-3">
          <Derivation
            lines={[
              { f: ['(P ∧ Q) ∨ ¬R'], why: 'Given (already a DNF)' },
              { f: [{ ins: '(P ∨ ¬R)' }, ' ∧ ', { ins: '(Q ∨ ¬R)' }], why: 'Distribute ∨ over ∧' },
            ]}
          />
          <Step>
            <Callout kind="info" title="Check by cases" asStep={false}>
              If R is false, both clauses are true. If R is true, both reduce to P and Q ✓
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"This is the distributive law P ∨ (Q ∧ R) ≡ (P ∨ Q) ∧ (P ∨ R) read with the roles swapped." Line 2 is a CNF: a conjunction of two clauses.',
  },
  {
    id: 'c4-biconditional',
    section: C4,
    label: 'Both Forms for P ↔ Q',
    element: (
      <ContentSlide kicker={C4} title="Both Forms for P ↔ Q" lead="One formula, two faces of one coin" lesson={SESSION}>
        <div className="grid w-full grid-cols-2 gap-5">
          <Step>
            <Card tone="brand" className="h-full">
              <Label>CNF: two rules</Label>
              <span className="mt-2 block font-heading text-[26px] font-semibold" style={{ color: colors.ink }}>
                (¬P ∨ Q) ∧ (P ∨ ¬Q)
              </span>
              <span className="mt-2 block text-[19px]" style={{ color: colors.ink }}>
                From (P → Q) ∧ (Q → P), then the implication law
              </span>
              <span className="mt-2 block text-[19px] font-semibold" style={{ color: colors.brandDark }}>
                "If P then Q, and if Q then P"
              </span>
            </Card>
          </Step>
          <Step>
            <Card tone="ok" className="h-full">
              <Label tone="ok">DNF: two branches</Label>
              <span className="mt-2 block font-heading text-[26px] font-semibold" style={{ color: colors.ink }}>
                (P ∧ Q) ∨ (¬P ∧ ¬Q)
              </span>
              <span className="mt-2 block text-[19px]" style={{ color: colors.ink }}>
                Distribute the CNF and drop P ∧ ¬P and Q ∧ ¬Q
              </span>
              <span className="mt-2 block text-[19px] font-semibold" style={{ color: TONE.ok }}>
                "Both true, or both false"
              </span>
            </Card>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Show the distribution in full on the board: (¬P ∨ Q) ∧ (P ∨ ¬Q) expands to (¬P ∧ P) ∨ (¬P ∧ ¬Q) ∨ (Q ∧ P) ∨ (Q ∧ ¬Q); the first and last are contradictions."',
  },
  {
    id: 'c4-practice',
    section: C4,
    label: 'Use the Recipe',
    element: (
      <ContentSlide kicker={C4} title="Use the Recipe" lead="Two minutes each, then reveal" lesson={SESSION}>
        <RevealTable
          keep={2}
          columns={[{ label: 'Formula', weight: 1 }, { label: 'Required form', weight: 0.8 }, { label: 'Answer', weight: 1.3 }]}
          rows={[
            ['P → Q', 'DNF and CNF', '¬P ∨ Q (it is both)'],
            ['¬(P ∨ Q)', 'DNF', '¬P ∧ ¬Q'],
            ['¬(P ∧ Q) → R', 'CNF', '(P ∨ R) ∧ (Q ∨ R)'],
            ['P ∧ (Q → R)', 'DNF', '(P ∧ ¬Q) ∨ (P ∧ R)'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"Row 3 in full: ¬(P ∧ Q) → R ≡ ¬¬(P ∧ Q) ∨ R ≡ (P ∧ Q) ∨ R ≡ (P ∨ R) ∧ (Q ∨ R)."',
  },
  { id: 'quiz-1', section: C4, label: 'Quiz Time', element: <QuizTimeSlide lesson={SESSION} /> },

  /* ── CONCEPT 5: Principal Normal Forms (Merrill) ────────────────────── */
  { id: 'c5-divider', section: C5, label: 'Divider', element: <SectionBreakerSlide index={5} title={C5} lesson={SESSION} /> },
  {
    id: 'c5-minterms',
    section: C5,
    label: 'Minterms',
    element: (
      <ContentSlide kicker={C5} title="Minterms" lead="An elementary product with every variable exactly once, plain or negated" lesson={SESSION}>
        <div className="w-full space-y-4">
          <Doors rows={TFrows} term={(i) => minterm2[i]} kind="key" />
          <Step>
            <Callout kind="info" title="One key, one door" asStep={false}>
              n variables give 2ⁿ minterms, and each is true in exactly one row
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Minterms are also called min-terms or Boolean conjunctions. Each one picks out a single row." Rows are written as P, Q values: TT means P = T, Q = T.',
  },
  {
    id: 'c5-pdnf',
    section: C5,
    label: 'PDNF',
    element: (
      <ContentSlide kicker={C5} title="PDNF" lead="Principal disjunctive normal form: a disjunction of distinct minterms" lesson={SESSION}>
        <div className="w-full space-y-4">
          <Doors rows={TFrows} term={(i) => minterm2[i]} lit={(i) => i < 3} kind="key" />
          <Step>
            <Callout kind="success" title="P ∨ Q is true in rows TT, TF, FT" asStep={false}>
              PDNF: (P ∧ Q) ∨ (P ∧ ¬Q) ∨ (¬P ∧ Q), the sum-of-products canonical form
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"A plain DNF can use short products; a PDNF must use full minterms containing every variable." Each minterm in the PDNF is a row where the formula is true.',
  },
  {
    id: 'c5-maxterms',
    section: C5,
    label: 'Maxterms and PCNF',
    element: (
      <ContentSlide kicker={C5} title="Maxterms and PCNF" lead="The mirror idea: every variable once, joined by ∨, false in exactly one row" lesson={SESSION}>
        <div className="w-full space-y-4">
          <Doors rows={TFrows} term={(i) => maxterm2[i]} lit={(i) => i === 0 || i === 3} kind="lock" />
          <Step>
            <Callout kind="warning" title="PCNF: a conjunction of distinct maxterms" asStep={false}>
              One maxterm per row where the formula is false (product-of-sums canonical form)
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Rule for a maxterm: write a variable negated if it is T in that row, plain if it is F. This is the opposite of the minterm rule." Lit locks: row TT gives ¬P ∨ ¬Q, row FF gives P ∨ Q.',
  },
  {
    id: 'c5-algebra',
    section: C5,
    label: 'Filling In Missing Variables',
    element: (
      <ContentSlide kicker={C5} title="Filling In Missing Variables" lead="PDNF of P ∨ (¬P ∧ Q) by laws" lesson={SESSION}>
        <div className="w-full space-y-3">
          <Derivation
            lines={[
              { f: ['P ∨ (¬P ∧ Q)'], why: 'Given (a DNF)' },
              { f: ['(P ∧ ', { ins: '(Q ∨ ¬Q)' }, ') ∨ (¬P ∧ Q)'], why: 'P ≡ P ∧ (Q ∨ ¬Q)' },
              { f: [{ ins: '(P ∧ Q) ∨ (P ∧ ¬Q)' }, ' ∨ (¬P ∧ Q)'], why: 'Distributive law' },
            ]}
          />
          <Step>
            <Callout kind="success" title="The missing piece" asStep={false}>
              Every product now contains both P and Q: this is the PDNF
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"The trick: multiply a product that lacks a variable X by (X ∨ ¬X), which is always true, then distribute."',
  },
  {
    id: 'c5-practice',
    section: C5,
    label: 'Complete the Minterms',
    element: (
      <ContentSlide kicker={C5} title="Complete the Minterms" lead="Fill in the missing variables, then reveal" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Formula', weight: 0.9 }, { label: 'PDNF', weight: 2 }]}
          rows={[
            ['P (in variables P, Q)', '(P ∧ Q) ∨ (P ∧ ¬Q)'],
            ['¬P ∨ Q', '(P ∧ Q) ∨ (¬P ∧ Q) ∨ (¬P ∧ ¬Q)'],
            ['P ∧ (Q ∨ R)', '(P ∧ Q ∧ R) ∨ (P ∧ Q ∧ ¬R) ∨ (P ∧ ¬Q ∧ R)'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"Row 2 needs care: expanding ¬P and Q separately gives (¬P ∧ Q) twice. Keep only one copy (idempotent law)."',
  },

  /* ── CONCEPT 6: Using Truth Tables (Merrill) ────────────────────────── */
  { id: 'c6-divider', section: C6, label: 'Divider', element: <SectionBreakerSlide index={6} title={C6} lesson={SESSION} /> },
  {
    id: 'c6-method',
    section: C6,
    label: 'Read Off the Forms',
    element: (
      <ContentSlide kicker={C6} title="Read Off the Forms" lead="A mechanical method from the truth table" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="grid grid-cols-2 gap-5">
            <Step>
              <Card tone="ok" className="h-full">
                <Label tone="ok">PDNF: use the true rows</Label>
                <span className="mt-2 block text-[20px]" style={{ color: colors.ink }}>
                  Write a minterm per row: P if P = T, ¬P if P = F
                </span>
                <span className="mt-1 block text-[20px] font-semibold" style={{ color: colors.ink }}>
                  Join with ∨
                </span>
              </Card>
            </Step>
            <Step>
              <Card tone="warn" className="h-full">
                <Label tone="warn">PCNF: use the false rows</Label>
                <span className="mt-2 block text-[20px]" style={{ color: colors.ink }}>
                  Write a maxterm per row: ¬P if P = T, P if P = F
                </span>
                <span className="mt-1 block text-[20px] font-semibold" style={{ color: colors.ink }}>
                  Join with ∧
                </span>
              </Card>
            </Step>
          </div>
          <Step>
            <Callout kind="info" title="Every row is used exactly once" asStep={false}>
              Either in the PDNF or in the PCNF
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"This is the most reliable method in exams. No law can be misapplied when the table is right."',
  },
  {
    id: 'c6-classic',
    section: C6,
    label: 'A Classic Example',
    element: (
      <ContentSlide kicker={C6} title="A Classic Example" lead="PDNF and PCNF of ¬(P ∨ Q) ↔ (P ∧ Q)" lesson={SESSION}>
        <div className="grid w-full grid-cols-[1.25fr_1fr] items-start gap-5">
          <DataTable
            className="w-full"
            compact
            columns={[{ label: mh('P'), weight: 0.5 }, { label: mh('Q'), weight: 0.5 }, { label: mh('¬(P ∨ Q)') }, { label: mh('P ∧ Q') }, { label: 'Formula' }]}
            rows={[
              ['T', 'T', 'F', 'T', <Lit v="F" tone="warn" />],
              ['T', 'F', 'F', 'F', <Lit v="T" tone="ok" />],
              ['F', 'T', 'F', 'F', <Lit v="T" tone="ok" />],
              ['F', 'F', 'T', 'F', <Lit v="F" tone="warn" />],
            ]}
          />
          <div className="space-y-3">
            <Step>
              <Card tone="ok">
                <Label tone="ok">PDNF (true rows TF, FT)</Label>
                <span className="font-heading text-[22px] font-semibold" style={{ color: colors.ink }}>
                  (P ∧ ¬Q) ∨ (¬P ∧ Q)
                </span>
              </Card>
            </Step>
            <Step>
              <Card tone="warn">
                <Label tone="warn">PCNF (false rows TT, FF)</Label>
                <span className="font-heading text-[22px] font-semibold" style={{ color: colors.ink }}>
                  (¬P ∨ ¬Q) ∧ (P ∨ Q)
                </span>
              </Card>
            </Step>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"Check the PCNF: the first maxterm comes from row TT (both negated), the second from row FF (both plain)." A classic textbook example.',
  },
  {
    id: 'c6-three',
    section: C6,
    label: 'Eight Rows',
    element: (
      <ContentSlide kicker={C6} title="Eight Rows" lead="(P ∧ Q) ∨ (¬P ∧ R): each row gives a minterm or a maxterm" lesson={SESSION}>
        <DataTable
          className="w-full"
          compact
          stepped
          columns={[{ label: mh('P'), weight: 0.35 }, { label: mh('Q'), weight: 0.35 }, { label: mh('R'), weight: 0.35 }, { label: 'Value', weight: 0.5 }, { label: 'Term', weight: 2 }]}
          rows={[
            ['T', 'T', 'T', <Lit v="T" tone="ok" />, <Lit v="Minterm P ∧ Q ∧ R" tone="ok" />],
            ['T', 'T', 'F', <Lit v="T" tone="ok" />, <Lit v="Minterm P ∧ Q ∧ ¬R" tone="ok" />],
            ['T', 'F', 'T', <Lit v="F" tone="warn" />, <Lit v="Maxterm ¬P ∨ Q ∨ ¬R" tone="warn" />],
            ['T', 'F', 'F', <Lit v="F" tone="warn" />, <Lit v="Maxterm ¬P ∨ Q ∨ R" tone="warn" />],
            ['F', 'T', 'T', <Lit v="T" tone="ok" />, <Lit v="Minterm ¬P ∧ Q ∧ R" tone="ok" />],
            ['F', 'T', 'F', <Lit v="F" tone="warn" />, <Lit v="Maxterm P ∨ ¬Q ∨ R" tone="warn" />],
            ['F', 'F', 'T', <Lit v="T" tone="ok" />, <Lit v="Minterm ¬P ∧ ¬Q ∧ R" tone="ok" />],
            ['F', 'F', 'F', <Lit v="F" tone="warn" />, <Lit v="Maxterm P ∨ Q ∨ R" tone="warn" />],
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'PDNF: (P ∧ Q ∧ R) ∨ (P ∧ Q ∧ ¬R) ∨ (¬P ∧ Q ∧ R) ∨ (¬P ∧ ¬Q ∧ R). PCNF: (¬P ∨ Q ∨ ¬R) ∧ (¬P ∨ Q ∨ R) ∧ (P ∨ ¬Q ∨ R) ∧ (P ∨ Q ∨ R). Join the green terms with ∨ and the orange terms with ∧ on the board. "This formula means if P then Q, else R, a selector. It appears in circuits as a multiplexer."',
  },
  {
    id: 'c6-practice',
    section: C6,
    label: 'Build the Table',
    element: (
      <ContentSlide kicker={C6} title="Build the Table" lead="Partner A builds the table, Partner B reads the forms, then swap" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Formula', weight: 0.6 }, { label: 'PDNF', weight: 1.6 }, { label: 'PCNF', weight: 1.6 }]}
          rows={[
            ['P → Q', '(P ∧ Q) ∨ (¬P ∧ Q) ∨ (¬P ∧ ¬Q)', '¬P ∨ Q'],
            ['P ↔ Q', '(P ∧ Q) ∨ (¬P ∧ ¬Q)', '(¬P ∨ Q) ∧ (P ∨ ¬Q)'],
            ['P ∧ ¬Q', 'P ∧ ¬Q', '(¬P ∨ ¬Q) ∧ (P ∨ ¬Q) ∧ (P ∨ Q)'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"Row 1 shows a nice fact: P → Q has only one false row, so its PCNF is a single maxterm."',
  },

  /* ── CONCEPT 7: Uniqueness and Ordering (4MAT) ──────────────────────── */
  { id: 'c7-divider', section: C7, label: 'Divider', element: <SectionBreakerSlide index={7} title={C7} lesson={SESSION} /> },
  {
    id: 'c7-unique',
    section: C7,
    label: 'One Official Form',
    element: (
      <ContentSlide kicker={C7} title="One Official Form" lead="Fix the variables and their order, say P, Q, R" lesson={SESSION}>
        <div className="w-full space-y-3">
          <div className="flex items-center justify-center gap-3">
            <div className="flex flex-col gap-2">
              {['P → Q', '¬P ∨ Q', '¬Q → ¬P'].map((f) => (
                <Chip key={f} tone="plain">
                  {f}
                </Chip>
              ))}
            </div>
            <Arrow label="photo booth" />
            <Card tone="ok">
              <Label tone="ok">One standard PDNF</Label>
              <span className="font-heading text-[22px] font-semibold" style={{ color: colors.ink }}>
                (P ∧ Q) ∨ (¬P ∧ Q) ∨ (¬P ∧ ¬Q)
              </span>
            </Card>
          </div>
          <StepCards
            items={[
              ['Unique', 'Exactly one PDNF (if not a contradiction) and one PCNF (if not a tautology), apart from term order'],
              ['Standard order', 'Same variable order in every term; terms in truth-table row order'],
              ['Σ shorthand', 'Read T as 1 and F as 0: TTF = 110 = 6, so the eight-row PDNF is Σ(1, 3, 6, 7)'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"Why unique? The PDNF is determined by the set of true rows, and equivalent formulas have exactly the same true rows. The Σ shorthand is optional; use it only if learners find it helpful." Σ(7, 6, 3, 1) in row order, usually listed as Σ(1, 3, 6, 7).',
  },
  {
    id: 'c7-tests',
    section: C7,
    label: 'Tests Made Easy',
    element: (
      <ContentSlide kicker={C7} title="Tests Made Easy" lead="Principal forms answer three questions" lesson={SESSION}>
        <div className="w-full space-y-3">
          <DataTable
            className="w-full"
            compact
            stepped
            columns={[{ label: 'Question', weight: 1 }, { label: 'Test using principal forms', weight: 2 }]}
            rows={[
              ['Are A and B equivalent?', 'Same PDNF (or same PCNF)'],
              ['Is A a tautology?', 'PDNF has all 2ⁿ minterms (no PCNF terms)'],
              ['Is A a contradiction?', 'No minterms (PCNF has all 2ⁿ maxterms)'],
              ['How do the forms relate?', 'Minterms in PDNF + maxterms in PCNF = 2ⁿ'],
            ]}
          />
          <Step>
            <Card tone="ok">
              <Label tone="ok">Scan: P → Q and ¬Q → ¬P</Label>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                {['P ∧ Q', '¬P ∧ Q', '¬P ∧ ¬Q'].map((t) => (
                  <Chip key={t} tone="ok">
                    {t}
                  </Chip>
                ))}
                <span className="ml-2 font-heading text-[20px] font-semibold" style={{ color: TONE.ok }}>
                  same bars: equivalent ✓
                </span>
              </div>
            </Card>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"This answers the first slide: P → Q, ¬P ∨ Q and ¬Q → ¬P all share one PDNF."',
  },
  {
    id: 'c7-errors',
    section: C7,
    label: 'What Went Wrong?',
    element: (
      <ContentSlide kicker={C7} title="What Went Wrong?" lead="Common mistakes, and their fixes" lesson={SESSION}>
        <Console
          items={[
            ['"P ∨ Q is the PDNF of P ∨ Q"', 'products lack variables', 'PDNF: (P ∧ Q) ∨ (P ∧ ¬Q) ∨ (¬P ∧ Q)'],
            ['"Maxterm for row P = T, Q = F is P ∨ ¬Q"', 'rule reversed', 'Negate the true variables: ¬P ∨ Q'],
            ['"PCNF uses the true rows"', 'rows swapped', 'PCNF uses the false rows'],
            ['"¬(P ∧ Q) is in CNF"', '¬ applies to a compound', "Apply De Morgan: ¬P ∨ ¬Q"],
            ['"A formula has only one DNF"', 'only the principal form is unique', 'P and P ∨ (P ∧ Q) are both DNFs'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"Check the maxterm rule together: ¬P ∨ Q is false only when P = T and Q = F."',
  },
  {
    id: 'c7-mixed',
    section: C7,
    label: 'One Formula, Every Idea',
    element: (
      <ContentSlide kicker={C7} title="One Formula, Every Idea" lead="(P → Q) ∧ (Q → P): turn each dial to open the door" lesson={SESSION}>
        <EscapeDoor />
      </ContentSlide>
    ),
    notes: '"Point out that the CNF and the PCNF coincide here because each clause already contains both variables."',
  },

  /* ── CLOSING ────────────────────────────────────────────────────────── */
  { id: 'quiz-2', section: 'Closing', label: 'Quiz Time', element: <QuizTimeSlide lesson={SESSION} /> },
  { id: 'takeaways', section: 'Closing', label: 'Key Takeaways', element: <KeyTakeawaysSlide title={SESSION} lesson={SESSION} points={AGENDA} /> },
  { id: 'feedback', section: 'Closing', label: 'Feedback', element: <FeedbackSlide lesson={SESSION} formless />, notes: 'No form and no QR (content rule 41 as amended 2026-11-21). Ask for feedback out loud.' },
  { id: 'thank-you', section: 'Closing', label: 'Thank you', element: <ThankYouSlide title="Thank You" lesson={SESSION} /> },
  { id: 'all-the-best', section: 'Closing', label: 'All the best', element: <ThankYouSlide title="All the Best" lesson={SESSION} /> },
]
