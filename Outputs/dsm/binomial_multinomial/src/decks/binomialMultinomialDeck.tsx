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
 * THE BINOMIAL AND MULTINOMIAL THEOREMS (DSM, Elementary Combinatorics).
 *
 * Built from the signed-off plan at
 *   Outputs/dsm/session_plans/binomial_multinomial/plan.md
 * (46 slides, one per TR slide). Every number was recomputed in `verify_tr.py`
 * (81 checks). No cross-session phrases (user rule, 2026-11-26).
 * Visuals are DOM figures, never SVG text.
 */

const SESSION = 'The Binomial and Multinomial Theorems'
const C1 = 'Expanding Powers of a Binomial'
const C2 = 'The Binomial Theorem'
const C3 = 'The General Term'
const C4 = 'Applications of the Binomial Theorem'
const C5 = 'The Multinomial Theorem'
const C6 = 'Putting It All Together'
const AGENDA = [C1, C2, C3, C4, C5, C6]

export const binomialMultinomialMeta: DeckMeta = {
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
const COEF = '#DB2777'
const XC = '#2D63FB'
const YC = '#16A34A'
const ZC = '#D97706'
const sup = '⁰¹²³⁴⁵⁶⁷⁸⁹'
const PAL = ['#2D63FB', '#DB2777', '#16A34A', '#D97706', '#7C3AED', '#0891B2']

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

const Txt = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <span className={`block text-[19px] ${className}`} style={{ color: colors.ink }}>
    {children}
  </span>
)

const Math_ = ({ children, size = 24, className = '' }: { children: ReactNode; size?: number; className?: string }) => (
  <span className={`font-heading font-semibold ${className}`} style={{ color: colors.ink, fontSize: size }}>
    {children}
  </span>
)

const C = ({ c, children }: { c: string; children: ReactNode }) => <span style={{ color: c }}>{children}</span>

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

function Total({ children, label = 'Answer' }: { children: ReactNode; label?: string }) {
  return (
    <span className="inline-flex items-center gap-3 rounded-xl px-5 py-2" style={{ background: `${TONE.ok}18`, boxShadow: `inset 0 0 0 2px ${TONE.ok}66` }}>
      {label && (
        <span className="text-[17px] font-semibold uppercase tracking-wide" style={{ color: TONE.ok }}>
          {label}
        </span>
      )}
      <span className="font-heading text-[28px] font-semibold" style={{ color: colors.ink }}>
        {children}
      </span>
    </span>
  )
}

function TryIt({ q, a }: { q: ReactNode; a: ReactNode }) {
  return (
    <Card tone="warn" className="w-fit">
      <Label tone="warn">Try it: {q}</Label>
      <Txt>{a}</Txt>
    </Card>
  )
}

/** An expansion: coefficients in COEF colour, monomials in ink. */
function Exp({ terms, size = 24 }: { terms: [string, string, string?][]; size?: number }) {
  return (
    <span className="font-heading font-semibold" style={{ fontSize: size, color: colors.ink }}>
      {terms.map(([co, mono, sign], i) => (
        <span key={i}>
          {i > 0 && <span style={{ color: sign === '−' ? TONE.bad : colors.ink }}> {sign ?? '+'} </span>}
          {i === 0 && sign === '−' && <span style={{ color: TONE.bad }}>−</span>}
          <span style={{ color: COEF }}>{co}</span>
          {mono}
        </span>
      ))}
    </span>
  )
}

/** A row of boxes; lit indices highlighted. */
function Boxes({ labels, lit = [], sub, color = colors.brand }: { labels: ReactNode[]; lit?: number[]; sub?: ReactNode[]; color?: string }) {
  return (
    <div className="flex w-fit items-start gap-2">
      {labels.map((l, i) => {
        const on = lit.includes(i)
        return (
          <span key={i} className="flex flex-col items-center gap-1">
            <span className="grid h-14 min-w-[60px] place-items-center rounded-lg border-2 px-2 font-heading text-[20px] font-semibold" style={{ borderColor: on ? color : colors.line, background: on ? color : '#fff', color: on ? '#fff' : colors.ink }}>
              {l}
            </span>
            {sub && (
              <span className="text-[17px] font-semibold" style={{ color: on ? color : TONE.grey }}>
                {sub[i]}
              </span>
            )}
          </span>
        )
      })}
    </div>
  )
}

function Num({ v, c, w = 48 }: { v: ReactNode; c: string; w?: number }) {
  return (
    <span className="grid h-11 place-items-center rounded-lg font-heading text-[19px] font-semibold text-white" style={{ background: c, minWidth: w }}>
      {v}
    </span>
  )
}

function PascalRow({ row, c = COEF }: { row: number[]; c?: string }) {
  return (
    <span className="flex justify-center gap-1.5">
      {row.map((v, i) => (
        <Num key={i} v={v} c={c} w={44} />
      ))}
    </span>
  )
}

/* ── the deck ───────────────────────────────────────────────────────────── */

export const binomialMultinomialDeck: SlideDef[] = [
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
          { title: C1, sub: 'Multiplying out (x + y)ⁿ and spotting Pascal\'s Triangle' },
          { title: C2, sub: 'Statement, counting proof and full expansions' },
          { title: C3, sub: 'One term or coefficient without the full expansion' },
          { title: C4, sub: 'Sums of coefficients and quick calculations' },
          { title: C5, sub: 'Powers of sums with more than two terms' },
          { title: C6, sub: 'Choosing the method, common mistakes and practice' },
        ]}
      />
    ),
  },

  /* ── CONCEPT 1 ───────────────────────────────────────────────────────── */
  { id: 'c1-divider', section: C1, label: 'Divider', element: <SectionBreakerSlide index={1} title={C1} lesson={SESSION} /> },
  {
    id: 'c1-powers',
    section: C1,
    label: 'Powers of (x + y)',
    element: (
      <ContentSlide kicker={C1} title="Powers of (x + y)" lead="Think First: expand (x + y)³ without a formula. How many terms, and which coefficients?" lesson={SESSION}>
        <div className="w-full space-y-2">
          {(
            [
              ['(x + y)⁰', [['1', '']]],
              ['(x + y)¹', [['', 'x'], ['', 'y']]],
              ['(x + y)²', [['', 'x²'], ['2', 'xy'], ['', 'y²']]],
              ['(x + y)³', [['', 'x³'], ['3', 'x²y'], ['3', 'xy²'], ['', 'y³']]],
              ['(x + y)⁴', [['', 'x⁴'], ['4', 'x³y'], ['6', 'x²y²'], ['4', 'xy³'], ['', 'y⁴']]],
            ] as [string, [string, string][]][]
          ).map(([p, t], i) => (
            <Step key={p}>
              <div className="flex w-fit items-center gap-4 rounded-card border border-line bg-white px-4 py-1.5 shadow-card-soft" style={{ marginLeft: i * 28 }}>
                <span className="w-[110px] font-heading text-[22px] font-semibold" style={{ color: colors.brandDark }}>
                  {p}
                </span>
                <Exp terms={t} size={22} />
                <span className="ml-2 text-[17px] font-semibold" style={{ color: COEF }}>
                  {[[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]][i].join(', ')}
                </span>
              </div>
            </Step>
          ))}
        </div>
      </ContentSlide>
    ),
    notes: '"Let learners multiply (x + y)² × (x + y) on paper first. Then reveal the rows and ask them what the coloured numbers remind them of."',
  },
  {
    id: 'c1-pascal',
    section: C1,
    label: 'The Coefficients Are Familiar',
    element: (
      <ContentSlide kicker={C1} title="The Coefficients Are Familiar" lead="Row n of Pascal's Triangle" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-x-6 gap-y-2">
            {[
              [[1, 2, 1], 'C(2, 0), C(2, 1), C(2, 2)', 2],
              [[1, 3, 3, 1], 'C(3, 0), …, C(3, 3)', 3],
              [[1, 4, 6, 4, 1], 'C(4, 0), …, C(4, 4)', 4],
            ].map(([row, cs, n]) => (
              <Step key={n as number} className="contents">
                <PascalRow row={row as number[]} />
                <Op>⟷</Op>
                <span className="text-[19px] font-semibold" style={{ color: colors.ink }}>
                  (x + y){sup[n as number]}: {cs as string}
                </span>
              </Step>
            ))}
          </div>
          <Step>
            <Callout kind="info" title="Binomial coefficients" asStep={false}>
              The coefficients of (x + y)ⁿ are C(n, 0), C(n, 1), …, C(n, n). A binomial is a two-term expression like x + y
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"We know C(n, r) as a count of subsets. Here we see why it is called a binomial coefficient."',
  },
  {
    id: 'c1-brackets',
    section: C1,
    label: 'One Letter From Each Bracket',
    element: (
      <ContentSlide kicker={C1} title="One Letter From Each Bracket" lead="(x + y)³ = (x + y)(x + y)(x + y): each term picks one letter from each bracket" lesson={SESSION}>
        <div className="w-full space-y-2">
          {[1, 2, 3].map((lvl) => (
            <Step key={lvl}>
              <div className="grid w-full items-center gap-1" style={{ gridTemplateColumns: '150px repeat(8, 1fr)' }}>
                <span className="text-[17px] font-semibold" style={{ color: TONE.grey }}>
                  Bracket {lvl}
                </span>
                {Array.from({ length: 2 ** lvl }, (_, i) => {
                  const l = i % 2 === 0 ? 'x' : 'y'
                  return (
                    <span key={i} className="grid h-10 place-items-center rounded-lg font-heading text-[19px] font-semibold text-white" style={{ gridColumn: `span ${8 / 2 ** lvl}`, background: l === 'x' ? XC : YC, margin: '0 6px' }}>
                      {l}
                    </span>
                  )
                })}
              </div>
            </Step>
          ))}
          <Step>
            <div className="grid w-full items-center gap-1" style={{ gridTemplateColumns: '150px repeat(8, 1fr)' }}>
              <span className="text-[17px] font-semibold" style={{ color: TONE.grey }}>
                Product
              </span>
              {['x³', 'x²y', 'x²y', 'xy²', 'x²y', 'xy²', 'xy²', 'y³'].map((p, i) => {
                const g = { 'x³': PAL[0], 'x²y': PAL[1], 'xy²': PAL[3], 'y³': PAL[2] }[p] as string
                return (
                  <span key={i} className="mx-1 grid h-11 place-items-center rounded-lg border-2 font-heading text-[19px] font-semibold" style={{ borderColor: g, background: `${g}18`, color: colors.ink }}>
                    {p}
                  </span>
                )
              })}
            </div>
          </Step>
          <Step>
            <Txt className="font-semibold">
              1 × x³, 3 × x²y, 3 × xy², 1 × y³. The coefficient of x²y = ways to choose which 1 bracket gives y: C(3, 1) = 3
            </Txt>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"This is the key idea of the whole session: a coefficient counts the ways to make a term. We count with our counting toolkit."',
  },

  /* ── CONCEPT 2 ───────────────────────────────────────────────────────── */
  { id: 'c2-divider', section: C2, label: 'Divider', element: <SectionBreakerSlide index={2} title={C2} lesson={SESSION} /> },
  {
    id: 'c2-statement',
    section: C2,
    label: 'The Binomial Theorem',
    element: (
      <ContentSlide kicker={C2} title="The Binomial Theorem" lead="Expanding (x + y)ⁿ for any positive integer n" lesson={SESSION}>
        <div className="w-full space-y-5">
          <div className="w-fit rounded-xl px-6 py-4" style={{ boxShadow: `inset 0 0 0 2px ${colors.brand}`, background: '#F8FAFF' }}>
            <Math_ size={27}>
              (x + y)ⁿ = <C c={COEF}>C(n, 0)</C>
              <C c={XC}>xⁿ</C> + <C c={COEF}>C(n, 1)</C>
              <C c={XC}>xⁿ⁻¹</C>
              <C c={YC}>y</C> + <C c={COEF}>C(n, 2)</C>
              <C c={XC}>xⁿ⁻²</C>
              <C c={YC}>y²</C> + … + <C c={COEF}>C(n, n)</C>
              <C c={YC}>yⁿ</C>
            </Math_>
          </div>
          <div className="flex w-fit gap-3">
            {[
              ['coefficients C(n, k)', COEF],
              ['powers of x fall', XC],
              ['powers of y rise', YC],
            ].map(([t, c]) => (
              <span key={t} className="rounded-lg px-3 py-1 text-[18px] font-semibold" style={{ background: `${c}18`, color: c }}>
                {t}
              </span>
            ))}
          </div>
          <Step>
            <Total label="Sigma form">
              (x + y)ⁿ = Σ <C c={COEF}>C(n, k)</C> <C c={XC}>xⁿ⁻ᵏ</C> <C c={YC}>yᵏ</C>, k = 0 to n
            </Total>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Read the sigma form aloud: sum over k from 0 to n of n choose k, times x to the n minus k, times y to the k. Many learners need to hear it once."',
  },
  {
    id: 'c2-features',
    section: C2,
    label: 'What Every Expansion Looks Like',
    element: (
      <ContentSlide kicker={C2} title="What Every Expansion Looks Like" lead="Four quick checks, shown on (x + y)⁵" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="grid w-fit grid-cols-[150px_repeat(6,96px)] items-center gap-y-2 text-center">
            <span />
            {['1', '5', '10', '10', '5', '1'].map((v, i) => (
              <span key={i} className="font-heading text-[22px] font-semibold" style={{ color: COEF, borderRight: i === 2 ? `3px dashed ${TONE.grey}` : undefined }}>
                {v}
              </span>
            ))}
            <span className="text-left text-[17px] font-semibold" style={{ color: XC }}>
              power of x ↓
            </span>
            {[5, 4, 3, 2, 1, 0].map((v) => (
              <span key={v} className="font-heading text-[21px] font-semibold" style={{ color: XC }}>
                {v}
              </span>
            ))}
            <span className="text-left text-[17px] font-semibold" style={{ color: YC }}>
              power of y ↑
            </span>
            {[0, 1, 2, 3, 4, 5].map((v) => (
              <span key={v} className="font-heading text-[21px] font-semibold" style={{ color: YC }}>
                {v}
              </span>
            ))}
          </div>
          <div className="grid w-full grid-cols-2 gap-2">
            {[
              <>There are <b>n + 1</b> terms</>,
              <>x powers <b>fall</b> n to 0; y powers <b>rise</b> 0 to n</>,
              <>In every term the powers <b>add up to n</b></>,
              <>Coefficients are <b>symmetric</b>: C(n, k) = C(n, n − k)</>,
            ].map((t, i) => (
              <Step key={i}>
                <div className="rounded-card border border-line bg-white px-4 py-2 text-[19px] shadow-card-soft" style={{ color: colors.ink }}>
                  ✓ {t}
                </div>
              </Step>
            ))}
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"Exam hook: use these four checks after any expansion. They catch most arithmetic slips."',
  },
  {
    id: 'c2-proof',
    section: C2,
    label: 'Why the Theorem Is True',
    element: (
      <ContentSlide kicker={C2} title="Why the Theorem Is True" lead="A combinatorial proof: count the ways to make each term" lesson={SESSION}>
        <div className="w-full space-y-4">
          <Boxes labels={['y', 'x', 'y', 'x', 'x', 'y', 'x']} lit={[0, 2, 5]} sub={['1', '2', '3', '4', '5', '6', 'n']} color={YC} />
          <Steps
            items={[
              ['(x + y)ⁿ is n brackets; each term picks x or y from every bracket'],
              ['The term is xⁿ⁻ᵏyᵏ exactly when y comes from k of the n brackets'],
              ['Ways to choose those k brackets', 'C(n, k)'],
              ['Collect like terms: coefficient of xⁿ⁻ᵏyᵏ', 'C(n, k) ✓'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes: '"This proof needs nothing but the definition of C(n, k). Compare it with the bracket picture for (x + y)³: the same idea for any n."',
  },
  {
    id: 'c2-five',
    section: C2,
    label: 'A Full Expansion: (x + y)⁵',
    element: (
      <ContentSlide kicker={C2} title="A Full Expansion: (x + y)⁵" lead="Use row 5 of Pascal's Triangle" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="grid w-fit grid-cols-[repeat(6,110px)] gap-y-2 text-center">
            {[1, 5, 10, 10, 5, 1].map((v, i) => (
              <span key={i} className="flex justify-center">
                <Num v={v} c={COEF} />
              </span>
            ))}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <span key={i} className="text-[20px]" style={{ color: TONE.grey }}>
                ↓
              </span>
            ))}
            {['x⁵', '5x⁴y', '10x³y²', '10x²y³', '5xy⁴', 'y⁵'].map((t, i) => (
              <Step key={i}>
                <Math_ size={22}>{t}</Math_>
              </Step>
            ))}
          </div>
          <Step>
            <Total label="Check">6 terms, powers add to 5, symmetric ✓</Total>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"For small n, reading the coefficients from Pascal\'s Triangle is fastest. For large n, use C(n, k)."',
  },
  {
    id: 'c2-twox',
    section: C2,
    label: 'Expanding (2x + 3)³',
    element: (
      <ContentSlide kicker={C2} title="Expanding (2x + 3)³" lead="Powers apply to the whole term: the first term is 2x, the second is 3" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="grid w-full grid-cols-4 gap-3">
            {[
              ['k = 0', '1 × (2x)³ × 1', '8x³'],
              ['k = 1', '3 × (2x)² × 3', '36x²'],
              ['k = 2', '3 × (2x)¹ × 9', '54x'],
              ['k = 3', '1 × 1 × 27', '27'],
            ].map(([k, w, t]) => (
              <Step key={k}>
                <Card>
                  <Label>{k}</Label>
                  <Txt>
                    <span className="rounded px-1" style={{ background: '#FEF3C7' }}>
                      {w}
                    </span>
                  </Txt>
                  <span className="mt-1 block font-heading text-[24px] font-semibold" style={{ color: TONE.ok }}>
                    {t}
                  </span>
                </Card>
              </Step>
            ))}
          </div>
          <Step>
            <Total label="Result">(2x + 3)³ = 8x³ + 36x² + 54x + 27</Total>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Most errors here come from writing 2x³ instead of (2x)³ = 8x³. Insist on brackets around each term."',
  },
  {
    id: 'c2-minus',
    section: C2,
    label: 'Expanding (a − b)⁵',
    element: (
      <ContentSlide kicker={C2} title="Expanding (a − b)⁵" lead="Write a − b as a + (−b): (−b)ᵏ is positive for even k, negative for odd k" lesson={SESSION}>
        <div className="w-full space-y-5">
          <div className="flex w-fit items-end gap-2">
            {[
              ['+', 'a⁵', 0],
              ['−', '5a⁴b', 1],
              ['+', '10a³b²', 2],
              ['−', '10a²b³', 3],
              ['+', '5ab⁴', 4],
              ['−', 'b⁵', 5],
            ].map(([s, t, k]) => (
              <span key={k as number} className="flex flex-col items-center gap-1">
                <span className="text-[16px] font-semibold" style={{ color: TONE.grey }}>
                  (−1){sup[k as number]}
                </span>
                <span className="rounded-lg px-3 py-2 font-heading text-[23px] font-semibold" style={{ background: s === '+' ? `${TONE.ok}1A` : '#FEE2E2', color: colors.ink }}>
                  <span style={{ color: s === '+' ? TONE.ok : TONE.bad }}>{s} </span>
                  {t as string}
                </span>
              </span>
            ))}
          </div>
          <Step>
            <TryIt q="expand (x + 1/x)⁴" a="x⁴ + 4x² + 6 + 4/x² + 1/x⁴" />
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"In the Try it, each term is C(4, k) x⁴⁻ᵏ (1/x)ᵏ = C(4, k) x⁴⁻²ᵏ. Note the constant middle term 6; we hunt for such terms in the next section."',
  },
  {
    id: 'c2-practice',
    section: C2,
    label: 'Expand Fully',
    element: (
      <ContentSlide kicker={C2} title="Expand Fully" lead="Write k, the coefficient and the term for each row, then reveal" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Expression', weight: 0.7 }, { label: 'Expansion', weight: 2 }]}
          rows={[
            ['(x + 2)⁴', 'x⁴ + 8x³ + 24x² + 32x + 16'],
            ['(1 − x)⁴', '1 − 4x + 6x² − 4x³ + x⁴'],
            ['(2a + b)³', '8a³ + 12a²b + 6ab² + b³'],
            ['(x − 3)³', 'x³ − 9x² + 27x − 27'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"Ask learners to apply the four quick checks to each answer."',
  },
  { id: 'quiz-1', section: C2, label: 'Quiz Time', element: <QuizTimeSlide lesson={SESSION} /> },

  /* ── CONCEPT 3 ───────────────────────────────────────────────────────── */
  { id: 'c3-divider', section: C3, label: 'Divider', element: <SectionBreakerSlide index={3} title={C3} lesson={SESSION} /> },
  {
    id: 'c3-general',
    section: C3,
    label: 'Going Straight to One Term',
    element: (
      <ContentSlide kicker={C3} title="Going Straight to One Term" lead="In (x + y)ⁿ, the term with yᵏ is the (k + 1)th term" lesson={SESSION}>
        <div className="w-full space-y-4">
          <Total label="General term">Tₖ₊₁ = C(n, k) xⁿ⁻ᵏ yᵏ</Total>
          <Boxes labels={['T₁', 'T₂', 'T₃', 'T₄', '…', 'Tₙ₊₁']} lit={[3]} sub={['k = 0', 'k = 1', 'k = 2', 'k = 3', '…', 'k = n']} />
          <Step>
            <Callout kind="warning" title="The off-by-one shift" asStep={false}>
              The rth term uses k = r − 1: the 4th term has k = 3, not k = 4
            </Callout>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"The off-by-one shift is the most common mistake: the 4th term has k = 3, not k = 4."',
  },
  {
    id: 'c3-fourth',
    section: C3,
    label: 'The 4th Term of (x + 2)⁷',
    element: (
      <ContentSlide kicker={C3} title="The 4th Term of (x + 2)⁷" lead="Write the general term, then substitute" lesson={SESSION}>
        <div className="w-full space-y-4">
          <Steps
            items={[
              [<>4th term, so <C c={COEF}>k = 3</C>; <C c={XC}>n = 7</C>, first term <C c={YC}>x</C>, second term <C c={ZC}>2</C></>],
              [<>T₄ = C(<C c={XC}>7</C>, <C c={COEF}>3</C>) <C c={YC}>x</C>⁷⁻³ (<C c={ZC}>2</C>)³</>],
              ['35 × x⁴ × 8', '280x⁴'],
            ]}
          />
          <Step>
            <TryIt q="the 3rd term of (2a + b)⁶" a="k = 2: C(6, 2) (2a)⁴ b² = 15 × 16a⁴ × b² = 240a⁴b²" />
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Write the general term first, then substitute. That single line earns most of the method marks."',
  },
  {
    id: 'c3-coefficient',
    section: C3,
    label: 'The Coefficient of x⁵ in (2x − 1)⁸',
    element: (
      <ContentSlide kicker={C3} title="The Coefficient of x⁵ in (2x − 1)⁸" lead="Find k from the power" lesson={SESSION}>
        <div className="w-full space-y-4">
          <Steps
            items={[
              ['Write the general term', 'C(8, k) (2x)⁸⁻ᵏ (−1)ᵏ'],
              ['Match the power: 8 − k = 5', 'k = 3'],
              ['Substitute: C(8, 3) × 2⁵ × (−1)³', '56 × 32 × (−1)'],
            ]}
          />
          <Step>
            <Total label="Coefficient">−1,792</Total>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Ask: why is the answer negative? Because k is odd, so (−1)ᵏ = −1."',
  },
  {
    id: 'c3-constant',
    section: C3,
    label: 'The Constant Term',
    element: (
      <ContentSlide kicker={C3} title="The Constant Term" lead="The term independent of x in (x² + 1/x)⁶: the power of x is zero" lesson={SESSION}>
        <div className="grid w-full grid-cols-[1fr_auto] items-center gap-8">
          <div className="space-y-3">
            <Steps
              items={[
                ['C(6, k) (x²)⁶⁻ᵏ (1/x)ᵏ', 'C(6, k) x¹²⁻³ᵏ'],
                ['Set the power = 0: 12 − 3k = 0', 'k = 4'],
                ['C(6, 4), the 5th term', '15'],
              ]}
            />
            <Step>
              <TryIt q="constant term of (x + 1/x)⁶" a="6 − 2k = 0, so k = 3: C(6, 3) = 20" />
            </Step>
          </div>
          <Step>
            <div className="flex flex-col items-center gap-2">
              <span className="text-[17px] font-semibold" style={{ color: TONE.grey }}>
                k from 0 to 6
              </span>
              <Boxes labels={[0, 1, 2, 3, 4, 5, 6].map(String)} lit={[4]} color={TONE.ok} />
            </div>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"If solving for k gives a fraction or a value outside 0 to n, there is no such term. Mention this case so learners do not force an answer."',
  },
  {
    id: 'c3-middle',
    section: C3,
    label: 'Finding the Middle',
    element: (
      <ContentSlide kicker={C3} title="Finding the Middle" lead="n + 1 terms: one middle term when n is even, two when n is odd" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="space-y-1">
            <Label>n = 8 (even): 9 terms, middle T₅ = term n/2 + 1</Label>
            <Boxes labels={['T₁', 'T₂', 'T₃', 'T₄', 'T₅', 'T₆', 'T₇', 'T₈', 'T₉']} lit={[4]} />
            <Step>
              <Txt className="font-semibold">T₅ = C(8, 4)x⁴y⁴ = 70x⁴y⁴</Txt>
            </Step>
          </div>
          <Step>
            <div className="space-y-1">
              <Label>n = 7 (odd): 8 terms, middle T₄ and T₅ = terms (n + 1)/2 and (n + 3)/2</Label>
              <Boxes labels={['T₁', 'T₂', 'T₃', 'T₄', 'T₅', 'T₆', 'T₇', 'T₈']} lit={[3, 4]} color="#7C3AED" />
              <Txt className="font-semibold">T₄ = 35x⁴y³ and T₅ = 35x³y⁴</Txt>
            </div>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"The middle term has the largest binomial coefficient, at the peak of the row in Pascal\'s Triangle."',
  },
  {
    id: 'c3-practice',
    section: C3,
    label: 'General Term First',
    element: (
      <ContentSlide kicker={C3} title="General Term First" lead="Write the general term for each row, then reveal" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Question', weight: 1.7 }, { label: 'k', weight: 0.3 }, { label: 'Answer', weight: 1.6 }]}
          rows={[
            ['Coefficient of x³ in (1 + x)¹⁰', '3', 'C(10, 3) = 120'],
            ['Coefficient of x² in (3 − x)⁵', '2', 'C(5, 2) × 3³ × (−1)² = 270'],
            ['5th term of (x − 2)⁶', '4', 'C(6, 4) x² (−2)⁴ = 240x²'],
            ['Term independent of x in (2x − 1/x)⁴', '2', 'C(4, 2) (2x)² (−1/x)² = 24'],
            ['Middle term of (a + b)¹⁰', '5', 'C(10, 5)a⁵b⁵ = 252a⁵b⁵'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"Check the second row with learners: the general term is C(5, k) 3⁵⁻ᵏ (−x)ᵏ, and k = 2 gives 10 × 27 × 1 = 270."',
  },

  /* ── CONCEPT 4 ───────────────────────────────────────────────────────── */
  { id: 'c4-divider', section: C4, label: 'Divider', element: <SectionBreakerSlide index={4} title={C4} lesson={SESSION} /> },
  {
    id: 'c4-sum',
    section: C4,
    label: 'Put x = y = 1',
    element: (
      <ContentSlide kicker={C4} title="Put x = y = 1" lead="Every coefficient counted once" lesson={SESSION}>
        <div className="w-full space-y-3">
          <div className="grid w-fit grid-cols-[repeat(7,104px)] gap-y-2 text-center">
            {['x⁶', '6x⁵y', '15x⁴y²', '20x³y³', '15x²y⁴', '6xy⁵', 'y⁶'].map((t) => (
              <Math_ key={t} size={21}>
                {t}
              </Math_>
            ))}
            {Array.from({ length: 7 }, (_, i) => (
              <span key={i} className="text-[19px]" style={{ color: TONE.grey }}>
                ↓
              </span>
            ))}
            {[1, 6, 15, 20, 15, 6, 1].map((v, i) => (
              <Step key={i} className="flex justify-center">
                <Num v={v} c={COEF} />
              </Step>
            ))}
          </div>
          <Step>
            <Txt>Left side: (1 + 1)⁶ = 2⁶. Right side: C(6, 0) + C(6, 1) + … + C(6, 6)</Txt>
          </Step>
          <Step>
            <Total label="Rule">C(n, 0) + C(n, 1) + … + C(n, n) = 2ⁿ (here 64)</Total>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Subset counting gives the same 2ⁿ: every element is either in or out. Here is a second, algebraic proof using the theorem."',
  },
  {
    id: 'c4-alternating',
    section: C4,
    label: 'Put x = 1, y = −1',
    element: (
      <ContentSlide kicker={C4} title="Put x = 1, y = −1" lead="(1 − 1)ⁿ = 0, so plus and minus cancel (n ≥ 1)" lesson={SESSION}>
        <div className="w-full space-y-4">
          <Total label="Rule">C(n, 0) − C(n, 1) + C(n, 2) − … ± C(n, n) = 0</Total>
          <Txt>n = 4: 1 − 4 + 6 − 4 + 1 = 0 ✓</Txt>
          <Step>
            <div className="flex w-fit items-center gap-6">
              <span className="flex gap-1.5">
                {[1, 5, 10, 10, 5, 1].map((v, i) => (
                  <Num key={i} v={v} c={i % 2 === 0 ? XC : COEF} />
                ))}
              </span>
              <span className="space-y-1">
                <Txt>
                  <C c={XC}>1 + 10 + 5 = 16</C>
                </Txt>
                <Txt>
                  <C c={COEF}>5 + 10 + 1 = 16</C>
                </Txt>
              </span>
            </div>
          </Step>
          <Step>
            <Txt className="font-semibold">Even-position and odd-position coefficients have equal sums, each 2ⁿ⁻¹ (here 2⁴ = 16)</Txt>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"In subset language: a non-empty set has as many even-sized subsets as odd-sized subsets."',
  },
  {
    id: 'c4-arithmetic',
    section: C4,
    label: 'Using the Expansion for Arithmetic',
    element: (
      <ContentSlide kicker={C4} title="Using the Expansion for Arithmetic" lead="Powers of 11 and numbers close to 1" lesson={SESSION}>
        <div className="grid w-full grid-cols-2 gap-6">
          <Card>
            <Label>11⁴ = (10 + 1)⁴</Label>
            <div className="mt-2 grid w-fit grid-cols-[repeat(5,64px)] gap-y-1 text-center">
              {['10⁴', '10³', '10²', '10', '1'].map((p) => (
                <span key={p} className="text-[17px] font-semibold" style={{ color: TONE.grey }}>
                  {p}
                </span>
              ))}
              {[1, 4, 6, 4, 1].map((v, i) => (
                <span key={i} className="flex justify-center">
                  <Num v={v} c={COEF} w={44} />
                </span>
              ))}
            </div>
            <Step>
              <span className="mt-2 block font-heading text-[26px] font-semibold" style={{ color: TONE.ok }}>
                = 14,641
              </span>
            </Step>
          </Card>
          <div className="space-y-3">
            <Step>
              <Card>
                <Label>1.01⁵ = (1 + 0.01)⁵</Label>
                <Txt>
                  1 + 5(0.01) + 10(0.01)² <span style={{ opacity: 0.5 }}>+ 10(0.01)³</span> <span style={{ opacity: 0.25 }}>+ …</span>
                </Txt>
                <span className="block font-heading text-[22px] font-semibold" style={{ color: TONE.ok }}>
                  ≈ 1.0510
                </span>
              </Card>
            </Step>
            <Step>
              <Card>
                <Label>99³ = (100 − 1)³</Label>
                <Txt>1,000,000 − 30,000 + 300 − 1</Txt>
                <span className="block font-heading text-[22px] font-semibold" style={{ color: TONE.ok }}>
                  = 970,299
                </span>
              </Card>
            </Step>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"For 1.01⁵, the exact value is 1.0510100501; the first three terms already give four correct decimal places."',
  },
  {
    id: 'c4-practice',
    section: C4,
    label: 'Substitute or Approximate',
    element: (
      <ContentSlide kicker={C4} title="Substitute or Approximate" lead="Choose the substitution, then reveal" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Question', weight: 1.8 }, { label: 'Method', weight: 1.4 }, { label: 'Answer', weight: 0.7 }]}
          rows={[
            ['Sum of the coefficients of (x + y)⁹', 'x = y = 1', '2⁹ = 512'],
            ['Sum of the coefficients of (2x + 1)⁴', 'x = 1', '3⁴ = 81'],
            ['C(7, 0) − C(7, 1) + C(7, 2) − … − C(7, 7)', 'x = 1, y = −1', '0'],
            ['11⁵', '(10 + 1)⁵', '161,051'],
            ['1.02⁴ (to 3 decimal places)', '1 + 4(0.02) + 6(0.02)² + …', '≈ 1.082'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"For the second row, substituting x = 1 into (2x + 1)⁴ gives 3⁴: the sum of the coefficients of any polynomial is its value at x = 1."',
  },

  /* ── CONCEPT 5 ───────────────────────────────────────────────────────── */
  { id: 'c5-divider', section: C5, label: 'Divider', element: <SectionBreakerSlide index={5} title={C5} lesson={SESSION} /> },
  {
    id: 'c5-square',
    section: C5,
    label: 'Expanding (x + y + z)²',
    element: (
      <ContentSlide kicker={C5} title="Expanding (x + y + z)²" lead="Think First: multiply it out. What changes with three terms?" lesson={SESSION}>
        <div className="grid w-full grid-cols-[auto_1fr] items-center gap-8">
          <div className="grid grid-cols-[48px_repeat(3,84px)] gap-1.5 text-center">
            <span />
            {['x', 'y', 'z'].map((h) => (
              <span key={h} className="font-heading text-[20px] font-semibold" style={{ color: colors.brandDark }}>
                {h}
              </span>
            ))}
            {['x', 'y', 'z'].map((r, i) => [
              <span key={`row-${r}`} className="grid place-items-center font-heading text-[20px] font-semibold" style={{ color: colors.brandDark }}>
                {r}
              </span>,
              ...['x', 'y', 'z'].map((c, j) => {
                const pair = [i, j].sort().join('')
                const bg = i === j ? '#E2E8F0' : { '01': '#DBEAFE', '12': '#FCE7F3', '02': '#DCFCE7' }[pair]
                return (
                  <span key={`${r}${c}`} className="grid h-14 place-items-center rounded-lg font-heading text-[20px] font-semibold" style={{ background: bg, color: colors.ink }}>
                    {i === j ? `${r}²` : r + c}
                  </span>
                )
              }),
            ])}
          </div>
          <div className="space-y-3">
            <Step>
              <Math_ size={25}>x² + y² + z² + 2xy + 2yz + 2zx</Math_>
            </Step>
            <Step>
              <Txt>xy appears twice: x from bracket 1 and y from bracket 2, or y from bracket 1 and x from bracket 2</Txt>
            </Step>
            <Step>
              <Txt className="font-semibold">A coefficient still counts the ways to pick one letter from each bracket</Txt>
            </Step>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"The grid makes the 2s visible: each mixed term appears in two cells."',
  },
  {
    id: 'c5-arrangements',
    section: C5,
    label: 'Counting Ways to Build x²yz',
    element: (
      <ContentSlide kicker={C5} title="Counting Ways to Build x²yz" lead="In (x + y + z)⁴, what is the coefficient of x²yz?" lesson={SESSION}>
        <div className="w-full space-y-3">
          {['x x y z', 'x y x z', 'z x y x', 'y z x x'].map((w) => (
            <Step key={w}>
              <div className="flex w-fit gap-2">
                {w.split(' ').map((l, i) => (
                  <span key={i} className="grid h-12 w-[88px] place-items-center rounded-lg border-2 font-heading text-[21px] font-semibold" style={{ borderColor: { x: XC, y: YC, z: ZC }[l], background: `${{ x: XC, y: YC, z: ZC }[l]}18`, color: colors.ink }}>
                    {l}
                  </span>
                ))}
              </div>
            </Step>
          ))}
          <Step>
            <Txt>Each way to build x²yz is an arrangement of the letters x, x, y, z (one letter per bracket)</Txt>
          </Step>
          <Step>
            <Total label="Coefficient">4! / (2! × 1! × 1!) = 12</Total>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"This is the multiset formula. A multinomial coefficient counts arrangements of a word."',
  },
  {
    id: 'c5-theorem',
    section: C5,
    label: 'The Multinomial Theorem',
    element: (
      <ContentSlide kicker={C5} title="The Multinomial Theorem" lead="k terms in the bracket, n a positive integer" lesson={SESSION}>
        <div className="w-full space-y-3">
          <div className="w-fit rounded-xl px-6 py-4" style={{ boxShadow: `inset 0 0 0 2px ${colors.brand}`, background: '#F8FAFF' }}>
            <Math_ size={26}>
              (x₁ + x₂ + … + xₖ)ⁿ = Σ <C c={COEF}>[n! / (n₁! n₂! … nₖ!)]</C> x₁<sup>n₁</sup> x₂<sup>n₂</sup> … xₖ<sup>nₖ</sup>
            </Math_>
          </div>
          <Step>
            <Txt>Sum over whole numbers n₁, …, nₖ ≥ 0 with <b>n₁ + n₂ + … + nₖ = n</b></Txt>
          </Step>
          <Step>
            <Txt>
              <C c={COEF}>n! / (n₁! n₂! … nₖ!)</C> is a <b>multinomial coefficient</b>
            </Txt>
          </Step>
          <Step>
            <div className="flex w-fit items-center gap-4">
              <Op>⟶</Op>
              <span className="text-[17px] font-semibold uppercase" style={{ color: TONE.grey }}>
                special case
              </span>
              <Card tone="ok">
                <Txt>k = 2: n! / (r! (n − r)!) = C(n, r), the binomial theorem</Txt>
              </Card>
            </div>
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"Stress the condition: the powers in each term add up to n, exactly as in the binomial case."',
  },
  {
    id: 'c5-coefficient',
    section: C5,
    label: 'Coefficient of a³b²c in (a + b + c)⁶',
    element: (
      <ContentSlide kicker={C5} title="Coefficient of a³b²c in (a + b + c)⁶" lead="Check the powers, then apply the formula" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="flex w-fit items-center gap-4">
            {[
              ['a', 3, XC],
              ['b', 2, YC],
              ['c', 1, ZC],
            ].map(([l, n, c]) => (
              <span key={l as string} className="flex gap-1">
                {Array.from({ length: n as number }, (_, i) => (
                  <Num key={i} v={l as string} c={c as string} w={44} />
                ))}
              </span>
            ))}
            <Txt>3 + 2 + 1 = 6 ✓</Txt>
          </div>
          <Step>
            <Total label="Coefficient">6! / (3! × 2! × 1!) = 720 / 12 = 60</Total>
          </Step>
          <Step>
            <TryIt q="coefficient of x²y³z in (2x − y + 3z)⁶" a="6! / (2! 3! 1!) = 60; constants 2² × (−1)³ × 3 = −12; coefficient 60 × (−12) = −720" />
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"As with (2x + 3)³, the constants inside each term are raised to their powers too. Do the multinomial coefficient first, then the constants."',
  },
  {
    id: 'c5-trinomial',
    section: C5,
    label: 'A Full Trinomial Expansion',
    element: (
      <ContentSlide kicker={C5} title="A Full Trinomial Expansion" lead="(x + y + z)³: group the terms by their pattern of powers" lesson={SESSION}>
        <div className="grid w-full grid-cols-[auto_1fr] items-center gap-8">
          <div className="space-y-1.5">
            {[
              [['x³', 0]],
              [['x²y', 1], ['x²z', 1]],
              [['xy²', 1], ['xyz', 2], ['xz²', 1]],
              [['y³', 0], ['y²z', 1], ['yz²', 1], ['z³', 0]],
            ].map((row, i) => (
              <div key={i} className="flex justify-center gap-1.5">
                {(row as [string, number][]).map(([t, g]) => (
                  <Num key={t} v={t} c={[XC, COEF, YC][g]} w={64} />
                ))}
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {[
              ['(3, 0, 0) like x³', '3! / 3! = 1', '3 terms', XC],
              ['(2, 1, 0) like x²y', '3! / (2! 1!) = 3', '6 terms', COEF],
              ['(1, 1, 1): xyz', '3! / (1! 1! 1!) = 6', '1 term', YC],
            ].map(([p, c, n, col]) => (
              <Step key={p}>
                <div className="grid grid-cols-[1.2fr_1.2fr_0.6fr] items-center gap-3 rounded-card border border-line bg-white px-4 py-2 shadow-card-soft" style={{ borderLeft: `5px solid ${col}` }}>
                  <span className="text-[18px] font-semibold" style={{ color: colors.ink }}>
                    {p}
                  </span>
                  <span className="text-[18px]" style={{ color: colors.ink }}>
                    {c}
                  </span>
                  <span className="text-[18px] font-semibold" style={{ color: col }}>
                    {n}
                  </span>
                </div>
              </Step>
            ))}
            <Step>
              <Txt className="font-semibold">x³ + y³ + z³ + 3(x²y + x²z + y²x + y²z + z²x + z²y) + 6xyz</Txt>
            </Step>
            <Step>
              <Txt>Check: 10 terms; 3 + 18 + 6 = 27 = 3³ ✓</Txt>
            </Step>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: '"The coefficient sum check works because putting x = y = z = 1 gives (1 + 1 + 1)³ = 27."',
  },
  {
    id: 'c5-terms',
    section: C5,
    label: 'Counting the Terms',
    element: (
      <ContentSlide kicker={C5} title="Counting the Terms" lead="Each term of (x₁ + … + xₖ)ⁿ is a choice n₁ + … + nₖ = n: stars and bars" lesson={SESSION}>
        <div className="w-full space-y-4">
          <div className="flex w-fit items-center gap-2">
            {[
              ['★', XC],
              ['★', XC],
              ['|', TONE.grey],
              ['★', YC],
              ['|', TONE.grey],
              ['★', ZC],
            ].map(([s, c], i) => (
              <span key={i} className="grid h-12 w-12 place-items-center font-heading text-[30px] font-semibold" style={{ color: c }}>
                {s}
              </span>
            ))}
            <Op>⟶</Op>
            <Math_ size={24}>x²yz in (x + y + z)⁴</Math_>
          </div>
          <Step>
            <Total label="Number of terms">C(n + k − 1, n)</Total>
          </Step>
          <Step>
            <DataTable
              className="w-fit"
              compact
              columns={[{ label: 'Expression' }, { label: 'Number of terms' }]}
              rows={[
                ['(x + y + z)³', 'C(5, 3) = 10'],
                ['(x + y + z)⁴', 'C(6, 4) = 15'],
                ['(a + b + c + d)²', 'C(5, 2) = 10'],
              ]}
            />
          </Step>
        </div>
      </ContentSlide>
    ),
    notes: '"n identical stars shared among k variables. This links stars and bars, multisets and this theorem."',
  },
  {
    id: 'c5-practice',
    section: C5,
    label: 'Check the Powers, Then Apply the Formula',
    element: (
      <ContentSlide kicker={C5} title="Check the Powers, Then Apply the Formula" lead="Check the powers add to n first, then reveal" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Question', weight: 1.9 }, { label: 'Working', weight: 1.3 }, { label: 'Answer', weight: 0.8 }]}
          rows={[
            ['Coefficient of x²y²z in (x + y + z)⁵', '5! / (2! 2! 1!)', '30'],
            ['Coefficient of xyzw in (x + y + z + w)⁴', '4! / (1! 1! 1! 1!)', '24'],
            ['Coefficient of x³y in (x + y + z)⁴', '4! / (3! 1! 0!)', '4'],
            ['Coefficient of x²yz in (x + 2y + z)⁴', '12 × 2¹', '24'],
            ['Coefficient of x²y² in (x + y + z)⁵', 'Powers add to 4, not 5', '0 (no such term)'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"The last row is a trap: every term of (x + y + z)⁵ has total power 5, so x²y² cannot appear. Always check the powers first."',
  },

  /* ── CONCEPT 6 ───────────────────────────────────────────────────────── */
  { id: 'c6-divider', section: C6, label: 'Divider', element: <SectionBreakerSlide index={6} title={C6} lesson={SESSION} /> },
  {
    id: 'c6-guide',
    section: C6,
    label: 'A Decision Guide',
    element: (
      <ContentSlide kicker={C6} title="A Decision Guide" lead="Read the question, pick the method" lesson={SESSION}>
        <div className="grid w-full grid-cols-2 gap-3">
          {[
            ['Full expansion, small n', "Pascal's Triangle row n"],
            ['Full expansion, larger n', 'C(n, k) for each term'],
            ['The rth term', 'Tᵣ = C(n, r − 1) xⁿ⁻⁽ʳ⁻¹⁾ yʳ⁻¹'],
            ['A coefficient or constant term', 'General term, match the power, find k'],
            ['Sum of all coefficients', 'Substitute 1 for every variable'],
            ['More than two terms in the bracket', 'n! / (n₁! … nₖ!)'],
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
    notes: '"Ask learners to classify a few past-paper questions using this guide before solving them."',
  },
  {
    id: 'c6-mistakes',
    section: C6,
    label: 'Avoid These Errors',
    element: (
      <ContentSlide kicker={C6} title="Avoid These Errors" lead="Red: the wrong working. Green: the fix" lesson={SESSION}>
        <div className="w-full space-y-2">
          {[
            ['Forgetting to raise the constant', '(2x + 3)³ starts 2x³', '(2x)³ = 8x³'],
            ['Off-by-one in the term number', '4th term of (x + 2)⁷ with k = 4', 'k = 3: 280x⁴'],
            ['Losing the sign', 'x⁵ in (2x − 1)⁸ as +1,792', '(−1)³ gives −1,792'],
            ['Powers not adding to n', 'x²y² in (x + y + z)⁵ is 30', 'No such term: 0'],
            ['C(n, r) for three terms', 'x²yz in (x + y + z)⁴ as C(4, 2) = 6', '4! / (2! 1! 1!) = 12'],
          ].map(([m, w, f]) => (
            <Step key={m}>
              <div className="grid grid-cols-[1fr_1.2fr_0.9fr] items-center gap-3 rounded-card border border-line bg-white px-4 py-2 shadow-card-soft">
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
    notes: '"Ask learners which of the four quick checks would have caught each error."',
  },
  {
    id: 'c6-mixed',
    section: C6,
    label: 'Binomial and Multinomial',
    element: (
      <ContentSlide kicker={C6} title="Binomial and Multinomial" lead="Solve in pairs, then reveal" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Question', weight: 1.5 }, { label: 'Answer', weight: 1.3 }]}
          rows={[
            ['Expand (x − 1)⁴', 'x⁴ − 4x³ + 6x² − 4x + 1'],
            ['Coefficient of x⁴ in (1 + 2x)⁶', 'C(6, 4) × 2⁴ = 240'],
            ['Term independent of x in (x + 2/x)⁴', 'C(4, 2) × 2² = 24'],
            ['Middle term of (x + 1)⁶', 'T₄ = C(6, 3)x³ = 20x³'],
            ['Coefficient of a²bc² in (a + b + c)⁵', '5! / (2! 1! 2!) = 30'],
            ['Number of terms in (a + b + c + d)³', 'C(6, 3) = 20'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '"Ask learners to name the method from the decision guide before solving each row."',
  },
  {
    id: 'c6-computing',
    section: C6,
    label: 'Where Programmers Meet These Coefficients',
    element: (
      <ContentSlide kicker={C6} title="Where Programmers Meet These Coefficients" lead="Counting with polynomials" lesson={SESSION}>
        <div className="grid w-full grid-cols-2 gap-3">
          {[
            ['01011000', '8-bit strings with exactly three 1s', 'x³ in (1 + x)⁸', 'C(8, 3) = 56'],
            ['{0,1}⁸', 'All bit strings of length 8', 'Sum of coefficients of (1 + x)⁸', '2⁸ = 256'],
            ['aabc', 'Length 4 over {a, b, c}: two a\'s, one b, one c', 'a²bc in (a + b + c)⁴', '12'],
            ['CAS', 'Computer algebra: expanding (x + y)²⁰', '21 terms, middle C(20, 10)', '184,756'],
          ].map(([icon, s, kind, c]) => (
            <Step key={icon}>
              <div className="rounded-2xl border border-line bg-white px-4 py-3 shadow-card-soft">
                <span className="inline-block rounded-md px-2 py-0.5 font-mono text-[16px] font-semibold text-white" style={{ background: colors.ink }}>
                  {icon}
                </span>
                <Txt className="mt-1">{s}</Txt>
                <div className="mt-1 flex items-center justify-between gap-3">
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
    notes: '"The first row shows the idea behind generating functions: a polynomial can store many counts at once, one in each coefficient."',
  },

  /* ── CLOSING ────────────────────────────────────────────────────────── */
  { id: 'quiz-2', section: 'Closing', label: 'Quiz Time', element: <QuizTimeSlide lesson={SESSION} /> },
  { id: 'takeaways', section: 'Closing', label: 'Key Takeaways', element: <KeyTakeawaysSlide title={SESSION} lesson={SESSION} points={AGENDA} /> },
  { id: 'feedback', section: 'Closing', label: 'Feedback', element: <FeedbackSlide lesson={SESSION} formless />, notes: 'No form and no QR (content rule 41 as amended 2026-11-21). Ask for feedback out loud.' },
  { id: 'thank-you', section: 'Closing', label: 'Thank you', element: <ThankYouSlide title="Thank You" lesson={SESSION} /> },
  { id: 'all-the-best', section: 'Closing', label: 'All the best', element: <ThankYouSlide title="All the Best" lesson={SESSION} /> },
]
