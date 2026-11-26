import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { FolderSearch, ListChecks, ListOrdered, Timer } from 'lucide-react'
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
import { RelationGraph, type GraphEdge, type GraphFrame, type GraphNode, type NodeState } from '@/ui/structures'

/**
 * COMBINATIONS AND PERMUTATIONS (DSM).
 *
 * Built from the signed-off plan at
 *   Outputs/dsm/session_plans/combinations_and_permutations/plan.md
 * the source of truth for order, framework and wording. Every count on these
 * slides was recomputed by `verify_tr.py` beside the plan. 50 slides at most
 * (the user's cap): two-step TR slides are one slide with reveals.
 *
 * Six concepts: Arrangement Versus Selection (4MAT), then Factorial Notation,
 * Permutations, Combinations, Relationship, Solving Standard Problems (Merrill).
 * Published as a claude.ai Artifact with the kit's Editor controls.
 */

const SESSION = 'Combinations and Permutations'
const C1 = 'Arrangement Versus Selection'
const C2 = 'Factorial Notation'
const C3 = 'Permutations (nPr)'
const C4 = 'Combinations (nCr)'
const C5 = 'Relationship Between nPr and nCr'
const C6 = 'Solving Standard Problems'
const AGENDA = [C1, C2, C3, C4, C5, C6]

export const combinationsAndPermutationsMeta: DeckMeta = {
  title: SESSION,
  course: 'DSM',
  lesson: SESSION,
  presenter: 'NxtWave Instructor',
  player: { autoHideControls: true },
}

/* ── shared helpers (as in the Basics of Counting deck) ──────────────────── */

function useBuild(n: number): number {
  return useClaimedSteps(n).filter(Boolean).length
}

/** A table header that is maths keeps its case: DataTable uppercases headers. */
const mh = (s: string) => <span className="normal-case tracking-normal">{s}</span>
const EASE = [0.22, 1, 0.36, 1] as const

function Fresh({ children }: { children: ReactNode }) {
  const instant = useInstant()
  return (
    <motion.span className="inline-block" initial={{ opacity: instant ? 1 : 0, y: instant ? 0 : 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: instant ? 0 : 0.52, ease: EASE }}>
      {children}
    </motion.span>
  )
}

/** Appears when `on` turns true; mounts at its final state on an instant jump. */
function Appear({ on, children, className = '', style }: { on: boolean; children: ReactNode; className?: string; style?: React.CSSProperties }) {
  const instant = useInstant()
  return (
    <motion.div
      className={className}
      style={style}
      initial={false}
      animate={{ opacity: on ? 1 : 0, y: on ? 0 : 8 }}
      transition={{ duration: instant ? 0 : 0.5, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

type LitTone = 'ok' | 'warn' | 'brand' | 'bad'
const LIT = { ok: colors.success, warn: colors.warning, brand: colors.brandDark, bad: colors.danger }

/** One value, tinted to its exact bounds (content rule 43). */
function Lit({ v, tone }: { v: ReactNode; tone?: LitTone }) {
  if (!tone) return <>{v}</>
  const c = LIT[tone]
  return (
    <span className="inline-block rounded-md px-2 font-semibold" style={{ background: `${c}22`, color: c, boxShadow: `inset 0 0 0 1.5px ${c}66` }}>
      {v}
    </span>
  )
}

/** A table whose answer columns arrive one row per press. */
function RevealTable({ columns, rows, keep = 1, compact = true }: { columns: TableColumn[]; rows: ReactNode[][]; keep?: number; compact?: boolean }) {
  const k = useBuild(rows.length)
  return (
    <DataTable
      className="w-full"
      compact={compact}
      columns={columns}
      highlight={k > 0 ? [k] : []}
      rows={rows.map((r, i) => r.map((c, j) => (j < keep ? c : i < k ? <Fresh key={`${i}-${j}`}>{c}</Fresh> : '')))}
    />
  )
}

function Card({ children, className = '', tone, style }: { children: ReactNode; className?: string; tone?: string; style?: React.CSSProperties }) {
  return (
    <div className={`rounded-card border bg-white px-4 py-3 shadow-card-soft ${className}`} style={{ borderColor: tone ?? colors.line, ...style }}>
      {children}
    </div>
  )
}

const H = ({ children, color }: { children: ReactNode; color?: string }) => (
  <span className="block font-heading text-[20px] font-semibold" style={{ color: color ?? colors.ink }}>
    {children}
  </span>
)
const T = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <span className={`block text-[18px] ${className}`} style={{ color: colors.ink }}>
    {children}
  </span>
)

/* ── slot diagrams ───────────────────────────────────────────────────────── */

type Slot = number | string | { v: ReactNode; note?: string; tone?: LitTone }

function SlotBox({ s, small = false }: { s: Slot; small?: boolean }) {
  const cell = typeof s === 'object' ? s : { v: s }
  const c = cell.tone ? LIT[cell.tone] : colors.brand
  return (
    <span className="flex flex-col items-center gap-1">
      <span
        className={`grid place-items-center rounded-xl px-2 font-heading font-semibold ${small ? 'h-[44px] min-w-[44px] text-[20px]' : 'h-[56px] min-w-[56px] text-[24px]'}`}
        style={{ color: cell.tone ? c : colors.ink, background: cell.tone ? `${c}18` : '#FFFFFF', boxShadow: `inset 0 0 0 2px ${c}` }}
      >
        {cell.v}
      </span>
      {cell.note !== undefined && (
        <span className="text-[16px] font-semibold" style={{ color: cell.tone ? c : colors.ink }}>
          {cell.note}
        </span>
      )}
    </span>
  )
}

function SlotLine({ slots, total, small = false, label }: { slots: Slot[]; total?: ReactNode; small?: boolean; label?: ReactNode }) {
  const notes = slots.some((s) => typeof s === 'object' && s.note !== undefined)
  const pad = small ? 'pt-2' : 'pt-3'
  const sz = small ? 'text-[20px]' : 'text-[24px]'
  return (
    <div className={`flex w-fit gap-3 ${notes ? 'items-start' : 'items-center'}`}>
      {label !== undefined && (
        <span className={`shrink-0 ${pad} font-heading text-[19px] font-semibold`} style={{ color: colors.ink }}>
          {label}
        </span>
      )}
      {slots.map((s, i) => (
        <span key={i} className="flex items-start gap-3">
          {i > 0 && <span className={`${pad} font-heading ${sz} font-semibold`} style={{ color: colors.muted }}>×</span>}
          <SlotBox s={s} small={small} />
        </span>
      ))}
      {total !== undefined && (
        <>
          <span className={`${pad} font-heading ${sz} font-semibold`} style={{ color: colors.muted }}>
            =
          </span>
          <span className={`${pad} font-heading ${sz}`}>
            <Lit v={total} tone="brand" />
          </span>
        </>
      )}
    </div>
  )
}

/* ── pictures ────────────────────────────────────────────────────────────── */

const pw = (s: string) => Math.max(64, 30 + s.length * 11)

/** A top-down tree: each level one step, revealed one level per press. */
function LevelTree({ levels, width, levelGap = 96, captions }: { levels: { id: string; label: string; parent?: string; state?: NodeState }[][]; width: number; levelGap?: number; captions: ReactNode[] }) {
  const placed: GraphNode[][] = levels.map((lv, d) =>
    lv.map((n, i) => ({ id: n.id, x: (width / lv.length) * (i + 0.5), y: 30 + d * levelGap, label: n.label, w: pw(n.label), state: n.state ?? (d === levels.length - 1 ? 'ok' : 'plain') })),
  )
  const edgesTo = (d: number): GraphEdge[] => levels[d].filter((n) => n.parent).map((n) => ({ id: `${n.parent}>${n.id}`, from: n.parent!, to: n.id, kind: 'line', tone: 'brand' }))
  const frames: GraphFrame[] = levels.map((_, d) => ({
    nodes: placed.slice(0, d + 1).flat(),
    edges: levels.slice(1, d + 1).flatMap((_, k) => edgesTo(k + 1)),
    caption: captions[d],
  }))
  return <RelationGraph width={width} height={30 + (levels.length - 1) * levelGap + 40} frames={frames} />
}

const PAIR_TONES = [colors.brand, colors.success, colors.warning, colors.danger, colors.brandDark, '#7A4DD8']

/** A letter chip: one student, one letter, one outcome. */
function Chip({ v, color = colors.brand, size = 44 }: { v: ReactNode; color?: string; size?: number }) {
  return (
    <span
      className="inline-grid place-items-center rounded-lg font-heading font-semibold"
      style={{ minWidth: size, height: size, padding: '0 8px', fontSize: size >= 44 ? 20 : 18, color, background: `${color}14`, boxShadow: `inset 0 0 0 2px ${color}` }}
    >
      {v}
    </span>
  )
}

/** Ordered outcomes grouped into the selections they repeat. */
function PairGroups({ groups, cols, k, labels, colW }: { groups: string[][]; cols: number; k: number; labels: string[]; colW?: number }) {
  return (
    <div className={`grid gap-4 ${colW ? 'w-fit' : 'w-full'}`} style={{ gridTemplateColumns: colW ? `repeat(${cols}, ${colW}px)` : `repeat(${cols}, minmax(0, 1fr))` }}>
      {groups.map((g, i) => {
        const c = PAIR_TONES[i % PAIR_TONES.length]
        const on = k >= 1
        return (
          <motion.div
            key={i}
            className="flex flex-col items-center gap-2 rounded-card px-2 py-3"
            initial={false}
            animate={{ backgroundColor: on ? `${c}12` : 'rgba(255,255,255,0)', boxShadow: on ? `inset 0 0 0 2px ${c}` : `inset 0 0 0 2px rgba(0,0,0,0)` }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="flex gap-2">
              {g.map((o) => (
                <Chip key={o} v={o} color={on ? c : colors.ink} />
              ))}
            </div>
            <Appear on={on}>
              <span className="font-heading text-[19px] font-semibold" style={{ color: c }}>
                {labels[i]}
              </span>
            </Appear>
          </motion.div>
        )
      })}
    </div>
  )
}

/** A vertical bar chart drawn from DOM boxes, every label a real element. */
function Bars({ data, height = 230, max }: { data: { x: string; ys: { v: number; label: string; color: string }[] }[]; height?: number; max: number }) {
  const instant = useInstant()
  return (
    <div className="flex w-full items-end justify-center gap-5" style={{ height: height + 64 }}>
      {data.map((d, i) => (
        <div key={d.x} className="flex flex-col items-center gap-1">
          <div className="flex items-end gap-1">
            {d.ys.map((y, j) => {
              const h = Math.max(3, (y.v / max) * height)
              return (
                <div key={j} className="flex flex-col items-center gap-1">
                  <span className="text-[16px] font-semibold" style={{ color: y.color }}>
                    {y.label}
                  </span>
                  <motion.div
                    className="rounded-t-md"
                    style={{ width: d.ys.length > 1 ? 34 : 52, background: y.color }}
                    initial={{ height: instant ? h : 0 }}
                    animate={{ height: h }}
                    transition={{ duration: instant ? 0 : 0.6, delay: instant ? 0 : 0.08 * i, ease: EASE }}
                  />
                </div>
              )
            })}
          </div>
          <span className="font-heading text-[18px] font-semibold" style={{ color: colors.ink }}>
            {d.x}
          </span>
        </div>
      ))}
    </div>
  )
}

/** Factors written out, with a cancelled tail struck through. */
function Struck({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-md px-1" style={{ color: colors.danger, background: `${colors.danger}12`, textDecoration: 'line-through', textDecorationThickness: 2 }}>
      {children}
    </span>
  )
}

function Fraction({ top, bottom, result }: { top: ReactNode; bottom: ReactNode; result: ReactNode }) {
  return (
    <div className="flex w-fit items-center gap-4 font-heading text-[22px] font-semibold" style={{ color: colors.ink }}>
      <div className="flex flex-col items-center">
        <span className="px-2 pb-1">{top}</span>
        <span className="w-full" style={{ height: 2, background: colors.ink }} />
        <span className="px-2 pt-1">{bottom}</span>
      </div>
      <span style={{ color: colors.muted }}>=</span>
      <Lit v={result} tone="brand" />
    </div>
  )
}

/** Stacked binomial notation, drawn with DOM so it scales with the text. */
function Binom({ n, r }: { n: string; r: string }) {
  return (
    <span className="inline-flex items-center font-heading text-[28px] font-semibold" style={{ color: colors.ink }}>
      <span className="text-[56px] font-normal leading-none">(</span>
      <span className="flex flex-col items-center leading-tight">
        <span>{n}</span>
        <span>{r}</span>
      </span>
      <span className="text-[56px] font-normal leading-none">)</span>
    </span>
  )
}

/** A basket holding `count` items out of n. */
function Basket({ count, label }: { count: number | 'all'; label: string }) {
  const dots = count === 'all' ? 6 : count
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="flex h-[96px] w-[170px] flex-wrap content-end items-end justify-center gap-2 px-3 pb-3"
        style={{ borderLeft: `3px solid ${colors.brandDark}`, borderRight: `3px solid ${colors.brandDark}`, borderBottom: `3px solid ${colors.brandDark}`, borderRadius: '0 0 40px 40px', background: `${colors.brand}0C` }}
      >
        {Array.from({ length: dots }, (_, i) => (
          <span key={i} className="h-[22px] w-[22px] rounded-full" style={{ background: count === 'all' ? colors.success : colors.warning }} />
        ))}
      </div>
      <span className="text-[18px] font-semibold" style={{ color: colors.ink }}>
        {label}
      </span>
    </div>
  )
}

/* ── the deck ────────────────────────────────────────────────────────────── */

function TwoQuestions() {
  const chair = (t: string) => (
    <div className="flex flex-col items-center gap-1">
      <div className="grid h-[64px] w-[120px] place-items-center rounded-xl text-[18px] font-semibold" style={{ color: colors.brandDark, boxShadow: `inset 0 0 0 2px ${colors.brand}`, background: '#fff' }}>
        {t}
      </div>
      <div className="h-[22px] w-[90px] rounded-b-lg" style={{ background: `${colors.brand}33` }} />
    </div>
  )
  const q = (
    <span className="grid h-[44px] w-[44px] place-items-center rounded-full font-heading text-[24px] font-semibold text-white" style={{ background: colors.warning }}>
      ?
    </span>
  )
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-3">
        {['A', 'B', 'C'].map((s) => (
          <Chip key={s} v={s} size={48} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-5">
        <Card className="flex flex-col items-center gap-3">
          <H>Question 1: a President and a Secretary</H>
          <div className="flex items-center gap-4">
            {chair('President')}
            {chair('Secretary')}
            {q}
          </div>
        </Card>
        <Card className="flex flex-col items-center gap-3">
          <H>Question 2: a 2-member team</H>
          <div className="flex items-center gap-4">
            <div className="flex h-[86px] w-[220px] items-center justify-center gap-3 rounded-xl" style={{ border: `2px dashed ${colors.success}`, background: `${colors.success}0E` }}>
              <span className="text-[18px] font-semibold" style={{ color: colors.success }}>
                Team of 2
              </span>
            </div>
            {q}
          </div>
        </Card>
      </div>
      <Callout kind="tip" title="Guess first">
        Are the two answers the same?
      </Callout>
    </div>
  )
}

function TeamPairs() {
  const k = useBuild(2)
  return (
    <div className="w-full space-y-4">
      <PairGroups cols={3} colW={260} k={k} groups={[['AB', 'BA'], ['AC', 'CA'], ['BC', 'CB']]} labels={['{A, B}', '{A, C}', '{B, C}']} />
      <Appear on={k >= 2}>
        <Callout kind="success" title="3 teams" asStep={false}>
          Half of the 6 outcomes: each team was listed twice, once in each order
        </Callout>
      </Appear>
    </div>
  )
}

function SwapTest() {
  const k = useBuild(1)
  const instant = useInstant()
  const sw = k >= 1
  const chip = (v: string, dx: number) => (
    <motion.span initial={false} animate={{ x: sw ? dx : 0 }} transition={{ duration: instant ? 0 : 0.7, ease: EASE }}>
      <Chip v={v} />
    </motion.span>
  )
  const side = (title: string, verdict: string, tone: string, same: boolean) => (
    <Card className="flex flex-1 items-center gap-4 py-2" tone={sw ? tone : undefined}>
      <span className="w-[190px] shrink-0 font-heading text-[19px] font-semibold" style={{ color: tone }}>
        {title}
      </span>
      <div className="flex gap-3">
        {chip('A', 56)}
        {chip('B', -56)}
      </div>
      <Appear on={sw}>
        <span className="text-[18px] font-semibold" style={{ color: tone }}>
          {verdict}
        </span>
      </Appear>
      <span className="sr-only">{same ? 'same' : 'different'}</span>
    </Card>
  )
  return (
    <div className="w-full space-y-4">
      <DataTable
        className="w-full"
        compact
        columns={[{ label: 'Idea', weight: 1 }, { label: 'Permutation', weight: 1.3 }, { label: 'Combination', weight: 1.3 }]}
        rows={[
          ['Meaning', 'An arrangement: order matters', 'A selection: order does not matter'],
          ['AB and BA', <Lit v="Different" tone="brand" />, <Lit v="Same" tone="ok" />],
          ['Example', 'President and Secretary', '2-member team'],
          ['A, B, C, pick 2', '6', '3'],
        ]}
      />
      <div className="flex w-full gap-5">
        {side('President, Secretary', 'New outcome: permutation', colors.brandDark, false)}
        {side('Team of 2', 'Same outcome: combination', colors.success, true)}
      </div>
    </div>
  )
}

function SortBins() {
  const items: [string, 'P' | 'C', string][] = [
    ['Gold, silver and bronze among 8 runners', 'P', 'Medals differ'],
    ['Choosing 3 toppings for a pizza', 'C', 'Same pizza'],
    ['A 4-digit PIN with no repeated digit', 'P', '1234 ≠ 4321'],
    ['Picking 5 players for a team', 'C', 'Same team'],
    ['Seating 4 guests in 4 numbered seats', 'P', 'Seats differ'],
  ]
  const k = useBuild(items.length)
  const bin = (kind: 'P' | 'C', title: string, c: string) => (
    <div className="flex min-h-[330px] flex-1 flex-col gap-2 rounded-card px-3 py-3" style={{ border: `2px dashed ${c}`, background: `${c}0A` }}>
      <span className="text-center font-heading text-[20px] font-semibold" style={{ color: c }}>
        {title}
      </span>
      {items.map(([, t, why], i) =>
        t === kind && i < k ? (
          <Fresh key={i}>
            <span className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-[18px] shadow-card-soft" style={{ color: colors.ink }}>
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[16px] font-semibold text-white" style={{ background: c }}>
                {i + 1}
              </span>
              {why}
            </span>
          </Fresh>
        ) : null,
      )}
    </div>
  )
  return (
    <div className="flex w-full items-start gap-5">
      <div className="flex flex-[1.5] flex-col gap-2">
        {items.map(([s], i) => (
          <Card key={i} className="flex items-center gap-3 py-2" tone={i < k ? (items[i][1] === 'P' ? colors.brand : colors.success) : undefined}>
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full font-heading text-[16px] font-semibold text-white" style={{ background: colors.ink }}>
              {i + 1}
            </span>
            <T>{s}</T>
          </Card>
        ))}
      </div>
      {bin('P', 'P: order matters', colors.brandDark)}
      {bin('C', 'C: order does not', colors.success)}
    </div>
  )
}

const BOOK = { M: colors.brand, P: colors.success, C: colors.warning } as const

function Shelf({ order }: { order: string }) {
  return (
    <div className="flex items-end gap-1 border-b-4 px-2 pt-1" style={{ borderColor: colors.ink }}>
      {order.split('').map((b, i) => (
        <span key={i} className="grid h-[52px] w-[30px] place-items-center rounded-t-md text-[18px] font-semibold text-white" style={{ background: BOOK[b as keyof typeof BOOK] }}>
          {b}
        </span>
      ))}
    </div>
  )
}

function Books() {
  const k = useBuild(2)
  return (
    <div className="w-full space-y-4">
      <SlotLine slots={[{ v: 3, note: '1st place' }, { v: 2, note: '2nd place' }, { v: 1, note: '3rd place' }]} total={6} />
      <Appear on={k >= 1} className="flex flex-wrap items-end gap-5">
        {['MPC', 'MCP', 'PMC', 'PCM', 'CMP', 'CPM'].map((o) => (
          <Shelf key={o} order={o} />
        ))}
      </Appear>
      <Appear on={k >= 2}>
        <Callout kind="info" title="More books" asStep={false}>
          4 books: 4 × 3 × 2 × 1 = 24; 5 books: 120
        </Callout>
      </Appear>
    </div>
  )
}

function Staircase() {
  const k = useBuild(2)
  const steps = ['n', 'n − 1', 'n − 2', '…', '2', '1']
  return (
    <div className="w-full space-y-4">
      <div className="flex w-fit items-end gap-2">
        {steps.map((s, i) => (
          <span key={i} className="flex items-end gap-2">
            {i > 0 && <span className="pb-2 font-heading text-[22px] font-semibold" style={{ color: colors.muted }}>×</span>}
            <span className="grid w-[84px] place-items-center rounded-t-lg font-heading text-[22px] font-semibold text-white" style={{ height: 130 - i * 16, background: i === 3 ? colors.muted : colors.brand }}>
              {s}
            </span>
          </span>
        ))}
        <span className="pb-2 font-heading text-[22px] font-semibold" style={{ color: colors.muted }}>=</span>
        <span className="mb-1 rounded-xl px-4 py-2 font-heading text-[26px] font-semibold" style={{ color: colors.brandDark, boxShadow: `inset 0 0 0 2.5px ${colors.brandDark}` }}>
          n!
        </span>
      </div>
      <Appear on={k >= 1}>
        <Callout kind="info" title="What n! counts" asStep={false}>
          The ways to arrange n distinct objects in a row
        </Callout>
      </Appear>
      <Appear on={k >= 2} className="grid grid-cols-2 gap-4">
        <Card tone={colors.success}>
          <H color={colors.success}>0! = 1</H>
          <T>Exactly one way to arrange nothing</T>
        </Card>
        <Card tone={colors.success}>
          <H color={colors.success}>n! = n × (n − 1)!</H>
          <T>With n = 1: 1! = 1 × 0!, so 0! = 1</T>
        </Card>
      </Appear>
    </div>
  )
}

function CancelFirst() {
  return (
    <div className="w-full space-y-4">
      <Fraction
        top={
          <>
            10 × 9 × <Struck>8 × 7 × … × 1</Struck>
          </>
        }
        bottom={<Struck>8 × 7 × … × 1</Struck>}
        result="10 × 9 = 90"
      />
      <DataTable
        className="w-full"
        stepped
        compact
        columns={[{ label: 'Expression', weight: 1 }, { label: 'Cancel', weight: 1.6 }, { label: 'Value', weight: 0.8 }]}
        rows={[
          [mh('100! / 98!'), 'Keep 100 × 99, cancel 98!', '9,900'],
          [mh('7! / (3! × 4!)'), '5040 / (6 × 24) = 5040 / 144', '35'],
        ]}
      />
    </div>
  )
}

function Podium() {
  const k = useBuild(3)
  const step = (label: string, slot: number, h: number, c: string, on: boolean) => (
    <div className="flex flex-col items-center gap-2">
      <Appear on={on}>
        <SlotBox s={{ v: slot, tone: 'brand' }} />
      </Appear>
      <div className="grid w-[150px] place-items-center rounded-t-lg font-heading text-[20px] font-semibold text-white" style={{ height: h, background: c }}>
        {label}
      </div>
    </div>
  )
  return (
    <div className="flex w-full items-end gap-8">
      <div className="flex items-end">
        {step('Silver', 7, 110, '#8A9BB0', k >= 2)}
        {step('Gold', 8, 150, '#D9A21B', k >= 1)}
        {step('Bronze', 6, 80, '#B8733A', k >= 3)}
      </div>
      <div className="flex flex-1 flex-col gap-3 pb-2">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 8 }, (_, i) => (
            <Chip key={i} v={`R${i + 1}`} color={colors.ink} size={40} />
          ))}
        </div>
        <Appear on={k >= 3}>
          <Callout kind="success" title="8 × 7 × 6 = 336" asStep={false}>
            Only 3 of the 8 runners are arranged, and the order matters
          </Callout>
        </Appear>
      </div>
    </div>
  )
}

function NprForms() {
  const k = useBuild(1)
  return (
    <div className="w-full space-y-4">
      <SlotLine slots={[{ v: 'n' }, { v: 'n − 1' }, { v: '…' }, { v: 'n − r + 1' }]} total="nPr" />
      <Appear on={k >= 1}>
        <Card className="flex flex-wrap items-center gap-2 font-heading text-[22px] font-semibold">
          <span style={{ color: colors.ink }}>n × (n − 1) × … × (n − r + 1) ×</span>
          <Struck>(n − r) × … × 1</Struck>
          <span className="text-[18px]" style={{ color: colors.danger }}>
            this tail is (n − r)!
          </span>
        </Card>
      </Appear>
      <Appear on={k >= 1}>
        <Callout kind="info" title="nPr = n! / (n − r)!, also written P(n, r) or ⁿPᵣ" asStep={false}>
          Dividing by (n − r)! cancels the factors we did not use. Podium: 8P3 = 8! / 5! = 336
        </Callout>
      </Appear>
    </div>
  )
}

function EdgeCard({ head, picture, meaning, check }: { head: string; picture: ReactNode; meaning: string; check: string }) {
  return (
    <Step className="flex w-[330px] flex-col items-center gap-3 rounded-card border border-line bg-white px-4 py-4 shadow-card-soft">
      <H color={colors.brandDark}>{head}</H>
      <div className="grid h-[110px] place-items-center">{picture}</div>
      <T className="text-center">{meaning}</T>
      <Lit v={check} tone="ok" />
    </Step>
  )
}

function Seating() {
  return (
    <div className="w-full space-y-4">
      <div className="flex w-full items-end gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-[16px] font-semibold" style={{ color: colors.muted }}>
            In the wings
          </span>
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 7 }, (_, i) => (
              <Chip key={i} v={`S${i + 1}`} color={colors.ink} size={40} />
            ))}
          </div>
        </div>
        <div className="flex-1 rounded-card px-5 pb-3 pt-2" style={{ background: `${colors.brand}10`, borderBottom: `6px solid ${colors.brandDark}` }}>
          <span className="text-[16px] font-semibold" style={{ color: colors.brandDark }}>
            Stage
          </span>
          <SlotLine slots={[{ v: 7, note: 'Chair 1' }, { v: 6, note: 'Chair 2' }, { v: 5, note: 'Chair 3' }, { v: 4, note: 'Chair 4' }]} total={840} />
        </div>
      </div>
      <Callout kind="info" title="n = 7, r = 4">
        Order matters: chair 1 and chair 2 are different places, so 7P4 = 840
      </Callout>
      <Callout kind="tip" title="Try it: all 5 band members line up for a photo">
        5P5 = 5! = 120
      </Callout>
    </div>
  )
}

function LetterCodes() {
  return (
    <div className="w-full space-y-4">
      <div className="flex gap-2">
        {'COMPUTER'.split('').map((c) => (
          <span key={c} className="grid h-[52px] w-[52px] place-items-center rounded-lg font-heading text-[24px] font-semibold" style={{ color: colors.ink, background: '#F6E7C8', boxShadow: 'inset 0 -4px 0 #D8B97A' }}>
            {c}
          </span>
        ))}
      </div>
      <SlotLine slots={[8, 7, 6]} total={336} />
      <div className="grid grid-cols-2 gap-4">
        <Callout kind="info" title="A code is an ordered string">
          CMP ≠ PMC: n = 8, r = 3, 8P3 = 336
        </Callout>
        <Callout kind="tip" title="Try it: all the letters of MATH">
          4P4 = 4! = 24
        </Callout>
      </div>
    </div>
  )
}

function Backwards() {
  const k = useBuild(2)
  const lit = (n: number) => (k >= 1 && (n === 7 || n === 8) ? colors.brandDark : k >= 2 && n >= 4 && n <= 6 ? colors.success : undefined)
  return (
    <div className="w-full space-y-4">
      <div className="flex gap-2">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
          const c = lit(n)
          return (
            <span
              key={n}
              className="grid h-[54px] w-[62px] place-items-center rounded-lg font-heading text-[22px] font-semibold transition-colors duration-500"
              style={{ color: c ? '#fff' : colors.ink, background: c ?? '#fff', boxShadow: `inset 0 0 0 2px ${c ?? colors.line}` }}
            >
              {n}
            </span>
          )
        })}
      </div>
      <Appear on={k >= 1}>
        <Callout kind="info" title="nP2 = 56 means n(n − 1) = 56" asStep={false}>
          Two consecutive integers with product 56: 8 × 7, so n = 8. The root −7 is rejected: n counts objects
        </Callout>
      </Appear>
      <Appear on={k >= 2}>
        <Callout kind="tip" title="Try it: nP3 = 120" asStep={false}>
          n(n − 1)(n − 2) = 120 = 6 × 5 × 4, so n = 6
        </Callout>
      </Appear>
    </div>
  )
}

function FourTeams() {
  const k = useBuild(2)
  return (
    <div className="w-full space-y-4">
      <PairGroups
        cols={6}
        k={k}
        groups={[['AB', 'BA'], ['AC', 'CA'], ['AD', 'DA'], ['BC', 'CB'], ['BD', 'DB'], ['CD', 'DC']]}
        labels={['{A, B}', '{A, C}', '{A, D}', '{B, C}', '{B, D}', '{C, D}']}
      />
      <Appear on={k >= 2} className="flex items-center justify-center gap-4 font-heading text-[24px] font-semibold">
        <Lit v="12 arrangements" tone="brand" />
        <span style={{ color: colors.muted }}>÷ 2! →</span>
        <Lit v="6 selections" tone="ok" />
      </Appear>
    </div>
  )
}

function NcrFormula() {
  const k = useBuild(1)
  return (
    <div className="w-full space-y-4">
      <Card className="flex flex-col items-start gap-2 py-4" tone={colors.brandDark} style={{ boxShadow: `inset 0 0 0 1px ${colors.brandDark}` }}>
        <span className="font-heading text-[30px] font-semibold" style={{ color: colors.brandDark }}>
          nCr = nPr / r! = n! / (r! (n − r)!)
        </span>
        <T>÷ r!: each selection of r objects appears r! times among the arrangements</T>
        <Lit v="4C2 = 4! / (2! × 2!) = 24 / 4 = 6" tone="ok" />
      </Card>
      <Appear on={k >= 1} className="grid w-fit grid-cols-[260px_260px_260px] gap-4">
        <Card className="flex h-[110px] flex-col items-center justify-center">
          <span className="font-heading text-[28px] font-semibold" style={{ color: colors.ink }}>
            nCr
          </span>
          <T>exam papers</T>
        </Card>
        <Card className="flex h-[110px] flex-col items-center justify-center">
          <span className="font-heading text-[28px] font-semibold" style={{ color: colors.ink }}>
            C(n, r)
          </span>
          <T>Tremblay, Grimaldi</T>
        </Card>
        <Card className="flex h-[110px] flex-col items-center justify-center">
          <Binom n="n" r="r" />
          <T>read "n choose r"</T>
        </Card>
      </Appear>
    </div>
  )
}

function Handshakes() {
  const R = 120
  const cx = 190
  const cy = 150
  const people: GraphNode[] = ['P1', 'P2', 'P3', 'P4', 'P5'].map((p, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5
    return { id: p, x: cx + R * Math.cos(a), y: cy + R * Math.sin(a), label: p, w: 56, state: 'lit' }
  })
  const edges: GraphEdge[] = []
  for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) edges.push({ id: `h${i}${j}`, from: people[i].id, to: people[j].id, kind: 'line', tone: 'ok' })
  return (
    <div className="flex w-full items-start gap-6">
      <RelationGraph
        width={380}
        height={300}
        frames={[
          { nodes: people, caption: '5 people' },
          { nodes: people, edges, caption: 'Every pair once: 5C2 = 10 lines' },
        ]}
      />
      <div className="flex flex-1 flex-col gap-3">
        <Callout kind="info" title="A shakes B = B shakes A">
          Order does not matter: a handshake is a selection of 2 people
        </Callout>
        <Callout kind="success" title="10 people">
          10C2 = (10 × 9) / 2 = 45 handshakes
        </Callout>
        <Callout kind="tip" title="Try it: 6 points on a circle">
          Lines joining two of them: 6C2 = 15
        </Callout>
      </div>
    </div>
  )
}

function QuestionPaper() {
  const ticked = new Set([1, 2, 4, 5, 6, 8, 9, 10])
  return (
    <div className="flex w-full items-start gap-6">
      <div className="w-[380px] rounded-card bg-white px-5 py-4 shadow-card" style={{ borderTop: `8px solid ${colors.brandDark}` }}>
        <span className="mb-3 block font-heading text-[19px] font-semibold" style={{ color: colors.ink }}>
          Answer any 8 questions
        </span>
        <div className="grid grid-cols-5 gap-3">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((q) => {
            const on = ticked.has(q)
            return (
              <span key={q} className="flex flex-col items-center gap-1">
                <span className="grid h-[44px] w-[44px] place-items-center rounded-lg text-[22px] font-semibold" style={{ color: on ? '#fff' : colors.muted, background: on ? colors.success : '#fff', boxShadow: `inset 0 0 0 2px ${on ? colors.success : colors.line}` }}>
                  {on ? '✓' : ''}
                </span>
                <span className="text-[16px] font-semibold" style={{ color: colors.ink }}>
                  Q{q}
                </span>
              </span>
            )
          })}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3">
        <Callout kind="info" title="Selection">
          The order of answering does not change the choice
        </Callout>
        <Callout kind="success" title="10C8 = 10! / (8! × 2!)">
          Cancel 8! first: (10 × 9) / 2 = 45
        </Callout>
        <Callout kind="tip" title="Try it: 5 cards from 52">
          52C5 = 2,598,960 hands
        </Callout>
      </div>
    </div>
  )
}

function SelectArrange() {
  const k = useBuild(3)
  const box = (on: boolean, title: string, general: string, num: string, c: string) => (
    <motion.div
      className="flex w-[260px] flex-col items-center gap-1 rounded-card bg-white px-4 py-4 shadow-card-soft"
      initial={false}
      animate={{ opacity: on ? 1 : 0.25, boxShadow: on ? `inset 0 0 0 2px ${c}` : `inset 0 0 0 2px ${colors.line}` }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <H color={c}>{title}</H>
      <span className="font-heading text-[26px] font-semibold" style={{ color: colors.ink }}>
        {general}
      </span>
      <Appear on={k >= 3}>
        <Lit v={num} tone="ok" />
      </Appear>
    </motion.div>
  )
  const arrow = <span className="font-heading text-[30px]" style={{ color: colors.muted }}>→</span>
  return (
    <div className="w-full space-y-5">
      <div className="flex items-center gap-4">
        {box(k >= 1, 'Step 1: select', 'nCr', '5C3 = 10', colors.success)}
        {arrow}
        {box(k >= 2, 'Step 2: arrange', 'r!', '3! = 6', colors.warning)}
        {arrow}
        {box(k >= 2, 'Arrangements', 'nPr', '5P3 = 60', colors.brandDark)}
      </div>
      <Appear on={k >= 2}>
        <Callout kind="info" title="Product rule: nPr = nCr × r!" asStep={false}>
          Choose which r objects, then put those r in order
        </Callout>
      </Appear>
    </div>
  )
}

function Ladder() {
  const rungs: [string, string][] = [
    ['Divide', 'r! = nPr / nCr = 720 / 120 = 6'],
    ['Match factorial', '3! = 6, so r = 3'],
    ['Consecutive product', 'n(n − 1)(n − 2) = 720 = 10 × 9 × 8, so n = 10'],
  ]
  return (
    <div className="flex w-full flex-col gap-3">
      {rungs.map(([a, b], i) => (
        <Step key={i} className="flex items-center gap-3 rounded-card border border-line bg-white px-4 py-3 shadow-card-soft" style={{ marginLeft: i * 56, width: 760 }}>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full font-heading text-[17px] font-semibold text-white" style={{ background: colors.brand }}>
            {i + 1}
          </span>
          <span className="w-[210px] shrink-0 font-heading text-[19px] font-semibold" style={{ color: colors.brandDark }}>
            {a}
          </span>
          <T>{b}</T>
        </Step>
      ))}
      <Step className="flex items-center gap-3 rounded-card px-4 py-3" style={{ marginLeft: 112, width: 760, background: `${colors.success}14`, boxShadow: `inset 0 0 0 2px ${colors.success}` }}>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[20px] font-semibold text-white" style={{ background: colors.success }}>
          ✓
        </span>
        <T>Check: 10C3 = 720 / 6 = 120</T>
      </Step>
    </div>
  )
}

function ExitTicket() {
  const rows: [string, string, string][] = [
    ['6C2 = 15', '6P2', '15 × 2! = 30'],
    ['7P3 = 210', '7C3', '210 ÷ 3! = 35'],
    ['8P4 = 1680', '8C4', '1680 ÷ 4! = 70'],
    ['nPr = 24, nCr = 4', 'r', 'r! = 6, so r = 3'],
  ]
  const k = useBuild(rows.length)
  return (
    <div className="w-[860px] rounded-card bg-white px-6 py-4 shadow-card" style={{ border: `2px dashed ${colors.brand}` }}>
      <span className="mb-2 block font-heading text-[20px] font-semibold" style={{ color: colors.brandDark }}>
        Exit ticket: move between nPr and nCr
      </span>
      <div className="grid grid-cols-[1.3fr_0.6fr_1.3fr] gap-x-4">
        {['Given', 'Find', 'Answer'].map((h) => (
          <span key={h} className="border-b-2 pb-1 text-[17px] font-semibold uppercase tracking-wide" style={{ color: colors.muted, borderColor: colors.line }}>
            {h}
          </span>
        ))}
        {rows.map(([g, f, a], i) => (
          <div key={i} className="contents">
            <span className="border-b py-2 font-heading text-[20px] font-semibold" style={{ color: colors.ink, borderColor: colors.line }}>
              {g}
            </span>
            <span className="border-b py-2 font-heading text-[20px] font-semibold" style={{ color: colors.ink, borderColor: colors.line }}>
              {f}
            </span>
            <span className="border-b py-2 text-[20px]" style={{ borderColor: colors.line }}>
              {i < k ? (
                <Fresh>
                  <Lit v={a} tone="ok" />
                </Fresh>
              ) : (
                ''
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function MethodChart() {
  const k = useBuild(3)
  const node = (t: string, c: string = colors.brand) => (
    <span className="rounded-xl bg-white px-4 py-3 text-center font-heading text-[19px] font-semibold shadow-card-soft" style={{ color: colors.ink, boxShadow: `inset 0 0 0 2px ${c}` }}>
      {t}
    </span>
  )
  const arrow = <span className="font-heading text-[26px]" style={{ color: colors.muted }}>→</span>
  return (
    <div className="flex w-full items-center justify-center gap-3">
      {node('1. Identify n and r')}
      {arrow}
      <div className="relative grid h-[180px] w-[180px] place-items-center">
        <span className="absolute h-[126px] w-[126px] rotate-45 rounded-lg bg-white" style={{ boxShadow: `inset 0 0 0 2px ${colors.warning}` }} />
        <span className="relative w-[120px] text-center text-[17px] font-semibold" style={{ color: colors.ink }}>
          2. Swap test: new outcome?
        </span>
      </div>
      <div className="flex flex-col gap-6">
        <Appear on={k >= 1} className="flex items-center gap-3">
          <span className="text-[18px] font-semibold" style={{ color: colors.brandDark }}>
            Yes →
          </span>
          {node('3. nPr', colors.brandDark)}
        </Appear>
        <Appear on={k >= 2} className="flex items-center gap-3">
          <span className="text-[18px] font-semibold" style={{ color: colors.success }}>
            No →
          </span>
          {node('3. nCr', colors.success)}
        </Appear>
      </div>
      <Appear on={k >= 3} className="flex items-center gap-3">
        {arrow}
        {node('4. Compute and check: cancel, is it sensible?', colors.ink)}
      </Appear>
    </div>
  )
}

function SignalWords() {
  const group = (title: string, words: string[], c: string) => (
    <Step className="flex flex-1 flex-col gap-3 rounded-card px-4 py-4" style={{ background: `${c}0E`, boxShadow: `inset 0 0 0 2px ${c}` }}>
      <H color={c}>{title}</H>
      <div className="flex flex-wrap gap-2">
        {words.map((w) => (
          <span key={w} className="rounded-pill bg-white px-3 py-1 text-[18px] font-semibold" style={{ color: c, boxShadow: `inset 0 0 0 1.5px ${c}` }}>
            {w}
          </span>
        ))}
      </div>
    </Step>
  )
  return (
    <div className="w-full space-y-4">
      <div className="flex gap-5">
        {group('Permutation words', ['arrange', 'line up', 'rank', 'positions', 'titles'], colors.brandDark)}
        {group('Combination words', ['select', 'choose', 'team', 'committee', 'group'], colors.success)}
      </div>
      <Callout kind="warning" title="Trap: a committee with a chair and a secretary">
        It is an arrangement: the titles differ. Signal words help, the swap test decides
      </Callout>
    </div>
  )
}

function RoundTable() {
  const seats = 6
  return (
    <div className="relative h-[220px] w-[220px] shrink-0">
      <div className="absolute left-1/2 top-1/2 grid h-[120px] w-[120px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-center text-[16px] font-semibold" style={{ background: `${colors.brand}18`, color: colors.brandDark, boxShadow: `inset 0 0 0 2px ${colors.brand}` }}>
        No seat is special
      </div>
      {Array.from({ length: seats }, (_, i) => {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / seats
        return (
          <span key={i} className="absolute h-[34px] w-[34px] rounded-full" style={{ left: 110 + 92 * Math.cos(a) - 17, top: 110 + 92 * Math.sin(a) - 17, background: colors.success }} />
        )
      })}
    </div>
  )
}

function Badges() {
  const k = useBuild(2)
  const person = (badge?: string) => (
    <span className="flex flex-col items-center gap-1">
      <span className="h-[48px] w-[48px] rounded-full" style={{ background: colors.ink }} />
      <span className="grid h-[30px] min-w-[30px] place-items-center rounded-md px-1 text-[17px] font-semibold" style={{ color: badge ? '#fff' : 'transparent', background: badge ? colors.warning : 'transparent' }}>
        {badge ?? '·'}
      </span>
    </span>
  )
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-5">
        <Card className="flex flex-1 flex-col items-center gap-3" tone={colors.success}>
          <H color={colors.success}>Committee of 3</H>
          <div className="flex gap-5 rounded-full px-6 py-3" style={{ boxShadow: `inset 0 0 0 2px ${colors.success}` }}>
            {person()}
            {person()}
            {person()}
          </div>
          <Lit v="8C3 = 56" tone="ok" />
        </Card>
        <Appear on={k >= 2} className="w-[150px] text-center font-heading text-[19px] font-semibold" style={{ color: colors.warning }}>
          × 3! = 6 ways to hand out the badges
        </Appear>
        <Appear on={k >= 1} className="flex-1">
          <Card className="flex flex-col items-center gap-3" tone={colors.brandDark}>
            <H color={colors.brandDark}>President, Treasurer, Secretary</H>
            <div className="flex gap-5 px-6 py-3">
              {person('P')}
              {person('T')}
              {person('S')}
            </div>
            <Lit v="8P3 = 336" tone="brand" />
          </Card>
        </Appear>
      </div>
      <Appear on={k >= 2}>
        <Callout kind="success" title="336 = 56 × 3!" asStep={false}>
          The same idea as the first slide, nPr = nCr × r!, at a larger size
        </Callout>
      </Appear>
    </div>
  )
}

function MarkingSheet() {
  const rows: [string, string, string][] = [
    ['Using nPr for a team', 'Team of 3 from 8: 8P3 = 336', '8C3 = 56'],
    ['Using nCr for positions', 'Gold, silver, bronze from 8: 8C3 = 56', '8P3 = 336'],
    ['Forgetting r! in nCr', '10C2 = 10! / 8! = 90', '10! / (2! × 8!) = 45'],
    ['Taking 0! = 0', '5P5 = 5! / 0, undefined', '0! = 1, so 5P5 = 120'],
  ]
  return (
    <div className="w-full rounded-card bg-white py-2 pr-4 shadow-card" style={{ borderLeft: `4px solid ${colors.danger}`, backgroundImage: `repeating-linear-gradient(#fff 0 55px, ${colors.line} 55px 56px)` }}>
      {rows.map(([m, wrong, right], i) => (
        <Step key={i} className="grid grid-cols-[1fr_1.5fr_1.2fr] items-center gap-4 py-2 pl-5">
          <span className="font-heading text-[19px] font-semibold" style={{ color: colors.ink }}>
            {m}
          </span>
          <span className="flex items-center gap-2 text-[18px]" style={{ color: colors.danger }}>
            <span className="font-semibold">✗</span>
            <span style={{ textDecoration: 'line-through', textDecorationThickness: 2 }}>{wrong}</span>
          </span>
          <span className="flex items-center gap-2 text-[18px] font-semibold" style={{ color: colors.success }}>
            <span>✓</span>
            {right}
          </span>
        </Step>
      ))}
    </div>
  )
}

function VoteList() {
  const rows: [string, 'P' | 'C', string][] = [
    ['8 teams play a league; each pair plays once', 'C', '8C2 = 28'],
    ['8 teams; each pair plays home and away', 'P', '8P2 = 56'],
    ['Arrange 4 of 9 paintings in a row on a wall', 'P', '9P4 = 3,024'],
    ['Choose 4 of 9 paintings for an exhibition', 'C', '9C4 = 126'],
    ['A first and a second prize among 10 students', 'P', '10P2 = 90'],
  ]
  const k = useBuild(rows.length)
  return (
    <div className="flex w-full flex-col gap-2">
      {rows.map(([s, t, a], i) => {
        const c = t === 'P' ? colors.brandDark : colors.success
        return (
          <Card key={i} className="flex items-center gap-4 py-2">
            <T className="flex-1">{s}</T>
            <span className="flex w-[260px] items-center justify-end gap-3">
              {i < k && (
                <Fresh>
                  <span className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full font-heading text-[18px] font-semibold text-white" style={{ background: c }}>
                      {t}
                    </span>
                    <Lit v={a} tone={t === 'P' ? 'brand' : 'ok'} />
                  </span>
                </Fresh>
              )}
            </span>
          </Card>
        )
      })}
    </div>
  )
}

function ComputingTiles() {
  const tiles: [ReactNode, string, string, string][] = [
    [<FolderSearch size={30} />, 'Compare every pair of 100 files for duplicates', '100C2', '4,950 comparisons'],
    [<ListOrdered size={30} />, 'Rank the top 3 of 50 search results', '50P3', '117,600 orderings'],
    [<ListChecks size={30} />, 'Choose 3 of 20 test cases for a quick check', '20C3', '1,140 selections'],
    [<Timer size={30} />, 'Run 5 tasks one after another, all orders', '5!', '120 schedules'],
  ]
  return (
    <div className="w-full space-y-3">
      <div className="grid grid-cols-2 gap-4">
        {tiles.map(([icon, s, f, r], i) => (
          <Step key={i} className="flex items-center gap-4 rounded-card border border-line bg-white px-4 py-3 shadow-card-soft">
            <span className="grid h-[56px] w-[56px] shrink-0 place-items-center rounded-xl text-white" style={{ background: colors.brand }}>
              {icon}
            </span>
            <span className="flex flex-col gap-1">
              <T>{s}</T>
              <span className="flex items-center gap-2 font-heading text-[19px] font-semibold" style={{ color: colors.brandDark }}>
                {f} = <Lit v={r} tone="ok" />
              </span>
            </span>
          </Step>
        ))}
      </div>
      <Callout kind="warning" title="Why comparing every pair is slow">
        Pairs grow like n²/2: 1,000 files need 1000C2 = 499,500 comparisons
      </Callout>
    </div>
  )
}

export const combinationsAndPermutationsDeck: SlideDef[] = [
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
          { title: C1, sub: 'When order matters and when it does not' },
          { title: C2, sub: 'Arranging a whole set; n! and 0!' },
          { title: C3, sub: 'Arranging r objects chosen from n' },
          { title: C4, sub: 'Selecting r objects from n' },
          { title: C5, sub: 'nPr = nCr × r!' },
          { title: C6, sub: 'Arranging people and forming committees' },
        ]}
      />
    ),
  },

  /* ── CONCEPT 1: Arrangement Versus Selection (4MAT) ─────────────────── */
  { id: 'c1-divider', section: C1, label: 'Divider', element: <SectionBreakerSlide index={1} title={C1} lesson={SESSION} /> },
  {
    id: 'c1-two-questions',
    section: C1,
    label: 'Two Questions',
    element: (
      <ContentSlide kicker={C1} title="Two Questions" lead="Asha (A), Bala (B) and Chitra (C) volunteer for the class committee" lesson={SESSION}>
        <TwoQuestions />
      </ContentSlide>
    ),
    notes: 'Think First. Collect guesses with a show of hands. Most learners say both answers are equal; the listing on the next two slides shows they are not. This builds on last session\'s habit: list small, then generalise.',
  },
  {
    id: 'c1-positions',
    section: C1,
    label: 'Positions',
    element: (
      <ContentSlide kicker={C1} title="Positions" lead="Picking a President and a Secretary: the two positions are different" lesson={SESSION}>
        <LevelTree
          width={760}
          levels={[
            [{ id: 'r', label: 'Start', state: 'lit' }],
            ['A', 'B', 'C'].map((s) => ({ id: s, label: s, parent: 'r' })),
            ['A', 'B', 'C'].flatMap((p) => ['A', 'B', 'C'].filter((s) => s !== p).map((s) => ({ id: p + s, label: p + s, parent: p }))),
          ]}
          captions={['Three students, two positions', 'President: 3 choices', 'Secretary: 2 left each, 3 × 2 = 6 outcomes; AB ≠ BA']}
        />
      </ContentSlide>
    ),
    notes: 'AB means Asha President, Bala Secretary; BA swaps them, a different outcome. Point out this is exactly the product rule from last session: 3 choices for President, then 2 for Secretary.',
  },
  {
    id: 'c1-team',
    section: C1,
    label: 'A Team',
    element: (
      <ContentSlide kicker={C1} title="A Team" lead="Picking a 2-member team: there are no titles, so {A, B} is the same as {B, A}" lesson={SESSION}>
        <TeamPairs />
      </ContentSlide>
    ),
    notes: 'Ask: why exactly half? Each team of 2 was listed twice before, once in each order. Keep this observation; it becomes the link between the two formulas later in the session.',
  },
  {
    id: 'c1-swap-test',
    section: C1,
    label: 'Swap Test',
    element: (
      <ContentSlide kicker={C1} title="Swap Test" lead="Swap two chosen objects: a new outcome means permutation, the same outcome means combination" lesson={SESSION}>
        <SwapTest />
      </ContentSlide>
    ),
    notes: 'Exam hook: before using any formula, write one line saying whether order matters and why. Examiners award marks for that reasoning.',
  },
  {
    id: 'c1-order-or-not',
    section: C1,
    label: 'Order or Not',
    element: (
      <ContentSlide kicker={C1} title="Order or Not" lead="Hold up P or C for each situation, then sort it" lesson={SESSION}>
        <SortBins />
      </ContentSlide>
    ),
    notes: 'Learners vote P or C before each press. For the PIN row, recall the previous session: 10 × 9 × 8 × 7. Today we learn a short name for such products.',
  },

  /* ── CONCEPT 2: Factorial Notation (Merrill) ────────────────────────── */
  { id: 'c2-divider', section: C2, label: 'Divider', element: <SectionBreakerSlide index={2} title={C2} lesson={SESSION} /> },
  {
    id: 'c2-books',
    section: C2,
    label: 'Books on a Shelf',
    element: (
      <ContentSlide kicker={C2} title="Books on a Shelf" lead="In how many ways can Maths, Physics and Chemistry books stand in a row?" lesson={SESSION}>
        <Books />
      </ContentSlide>
    ),
    notes: 'Think First. Have learners list the 6 shelf orders quickly in pairs. Then ask them to predict the count for 4 books before showing it.',
  },
  {
    id: 'c2-factorial',
    section: C2,
    label: 'n Factorial',
    element: (
      <ContentSlide kicker={C2} title="n Factorial" lead="n! is the product of all the integers from n down to 1" lesson={SESSION}>
        <Staircase />
      </ContentSlide>
    ),
    notes: 'Read n! as "n factorial". Learners often find 0! = 1 strange. Justify it two ways: there is one empty arrangement, and the step rule 1! = 1 × 0! forces 0! = 1.',
  },
  {
    id: 'c2-grow',
    section: C2,
    label: 'Factorials Grow',
    element: (
      <ContentSlide kicker={C2} title="Factorials Grow" lead="Values to remember, n = 0 to 7" lesson={SESSION}>
        <div className="w-full space-y-2">
          <Bars
            max={5040}
            data={[1, 1, 2, 6, 24, 120, 720, 5040].map((v, n) => ({ x: `${n}!`, ys: [{ v, label: v.toLocaleString('en-IN'), color: n >= 6 ? colors.brandDark : colors.brand }] }))}
          />
          <Callout kind="info" title="10! = 3,628,800">
            The bars shoot up after n = 5
          </Callout>
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'c2-cancel',
    section: C2,
    label: 'Cancel First',
    element: (
      <ContentSlide kicker={C2} title="Cancel First" lead="Write the larger factorial down to the smaller one, then cancel" lesson={SESSION}>
        <CancelFirst />
      </ContentSlide>
    ),
    notes: 'Never compute 100! to divide by 98!. Takeaway for this section: arranging all n objects gives n!, and factorials are cancelled, never multiplied out.',
  },

  /* ── CONCEPT 3: Permutations (nPr) (Merrill) ────────────────────────── */
  { id: 'c3-divider', section: C3, label: 'Divider', element: <SectionBreakerSlide index={3} title={C3} lesson={SESSION} /> },
  {
    id: 'c3-podium',
    section: C3,
    label: 'Medal Podium',
    element: (
      <ContentSlide kicker={C3} title="Medal Podium" lead="8 runners are in a final. In how many ways can gold, silver and bronze be awarded?" lesson={SESSION}>
        <Podium />
      </ContentSlide>
    ),
    notes: 'Think First. This is a permutation of 8 objects taken 3 at a time. Notice the product stops after 3 factors; it does not run down to 1.',
  },
  {
    id: 'c3-npr',
    section: C3,
    label: 'nPr',
    element: (
      <ContentSlide kicker={C3} title="nPr" lead="Arrangements of r objects chosen from n distinct objects, 0 ≤ r ≤ n: r factors counting down from n" lesson={SESSION}>
        <NprForms />
      </ContentSlide>
    ),
    notes: 'Explain why dividing by (n − r)! works: it cancels the factors we did not use. Learners should be able to use either form.',
  },
  {
    id: 'c3-edges',
    section: C3,
    label: 'Edge Cases',
    element: (
      <ContentSlide kicker={C3} title="Edge Cases" lead="Check the formula at r = n, r = 1 and r = 0" lesson={SESSION}>
        <div className="flex w-full gap-5">
          <EdgeCard head="nPn = n! / 0! = n!" picture={<SlotLine small slots={['n', 'n − 1', '…', 1]} />} meaning="Arrange all n objects in a row" check="5P5 = 120" />
          <EdgeCard head="nP1 = n" picture={<SlotLine small slots={['n']} />} meaning="One object for one position" check="7P1 = 7" />
          <EdgeCard
            head="nP0 = 1"
            picture={
              <span className="grid h-[44px] w-[150px] place-items-center rounded-xl text-[17px] font-semibold" style={{ border: `2px dashed ${colors.muted}`, color: colors.muted }}>
                no slots: 1 way
              </span>
            }
            meaning="One way to arrange nothing"
            check="9P0 = 1"
          />
        </div>
      </ContentSlide>
    ),
    notes: 'The case nPn connects back to the bookshelf: arranging all n books is n!. This is why we needed 0! = 1.',
  },
  {
    id: 'c3-evaluate',
    section: C3,
    label: 'Evaluating nPr',
    element: (
      <ContentSlide kicker={C3} title="Evaluating nPr" lead="Write r factors counting down from n, then multiply" lesson={SESSION}>
        <RevealTable
          columns={[{ label: 'Expression', weight: 0.9 }, { label: 'Working', weight: 1.7 }, { label: 'Value', weight: 0.6 }]}
          rows={[
            ['5P2', '5 × 4', '20'],
            ['6P3', '6 × 5 × 4', '120'],
            ['7P4', '7 × 6 × 5 × 4', '840'],
            ['10P3', '10 × 9 × 8', '720'],
            ['4P4', '4 × 3 × 2 × 1', '24'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Learners call out each answer before the reveal. Shortcut: nPr has exactly r factors; count the factors to check your working.',
  },
  {
    id: 'c3-seating',
    section: C3,
    label: 'Stage Seating',
    element: (
      <ContentSlide kicker={C3} title="Stage Seating" lead="7 students are shortlisted and 4 numbered chairs are on the stage" lesson={SESSION}>
        <Seating />
      </ContentSlide>
    ),
    notes: 'Exam hook: write "n = …, r = …, order matters because …" before the formula. It earns method marks even if the arithmetic slips.',
  },
  {
    id: 'c3-codes',
    section: C3,
    label: 'Letter Codes',
    element: (
      <ContentSlide kicker={C3} title="Letter Codes" lead="COMPUTER has 8 different letters: how many 3-letter codes with no repeats?" lesson={SESSION}>
        <LetterCodes />
      </ContentSlide>
    ),
    notes: 'This works only because all 8 letters are different. Words with repeated letters need a different method, which we will not cover today.',
  },
  {
    id: 'c3-backwards',
    section: C3,
    label: 'Working Backwards',
    element: (
      <ContentSlide kicker={C3} title="Working Backwards" lead="If nP2 = 56, find n" lesson={SESSION}>
        <Backwards />
      </ContentSlide>
    ),
    notes: 'Textbook exercises often ask this. Encourage the consecutive-product trick instead of solving a quadratic every time. Takeaway for this section: r positions where order matters, r factors counting down from n.',
  },
  { id: 'quiz-1', section: C3, label: 'Quiz Time', element: <QuizTimeSlide lesson={SESSION} /> },

  /* ── CONCEPT 4: Combinations (nCr) (Merrill) ────────────────────────── */
  { id: 'c4-divider', section: C4, label: 'Divider', element: <SectionBreakerSlide index={4} title={C4} lesson={SESSION} /> },
  {
    id: 'c4-teams',
    section: C4,
    label: 'Teams from Four',
    element: (
      <ContentSlide kicker={C4} title="Teams from Four" lead="Friends A, B, C, D: how many 2-member teams? Start from the 4P2 = 12 ordered pairs" lesson={SESSION}>
        <FourTeams />
      </ContentSlide>
    ),
    notes: 'Think First. This is the key idea of the session: count the arrangements, then divide by the number of times each selection was counted. Each team appears 2! = 2 times.',
  },
  {
    id: 'c4-ncr',
    section: C4,
    label: 'nCr',
    element: (
      <ContentSlide kicker={C4} title="nCr" lead="Selections of r objects from n distinct objects, 0 ≤ r ≤ n, when order does not matter" lesson={SESSION}>
        <NcrFormula />
      </ContentSlide>
    ),
    notes: 'Tremblay and Grimaldi both use C(n, r); many exam papers write nCr. Tell learners all three notations mean the same number.',
  },
  {
    id: 'c4-edges',
    section: C4,
    label: 'Edge Cases',
    element: (
      <ContentSlide kicker={C4} title="Edge Cases" lead="Check the formula at r = 0, r = 1 and r = n" lesson={SESSION}>
        <div className="flex w-full gap-5">
          <EdgeCard head="nC0 = 1" picture={<Basket count={0} label="empty basket" />} meaning="One way to select nothing" check="9C0 = 1" />
          <EdgeCard head="nC1 = n" picture={<Basket count={1} label="any one item" />} meaning="Select any one object" check="7C1 = 7" />
          <EdgeCard head="nCn = 1" picture={<Basket count="all" label="all n items" />} meaning="One way to select everything" check="8C8 = 1" />
        </div>
      </ContentSlide>
    ),
    notes: 'Ask learners to explain nCn = 1 in words: if you must take all of them, there is no choice to make.',
  },
  {
    id: 'c4-evaluate',
    section: C4,
    label: 'Evaluating nCr',
    element: (
      <ContentSlide kicker={C4} title="Evaluating nCr" lead="r factors on top, r! underneath: cancel before you multiply" lesson={SESSION}>
        <div className="w-full space-y-3">
          <RevealTable
            columns={[{ label: 'Expression', weight: 0.7 }, { label: 'Working', weight: 2 }, { label: 'Value', weight: 0.6 }]}
            rows={[
              ['5C2', '(5 × 4) / (2 × 1)', '10'],
              ['6C3', '(6 × 5 × 4) / (3 × 2 × 1)', '20'],
              ['10C3', '(10 × 9 × 8) / (3 × 2 × 1)', '120'],
              ['7C4', '(7 × 6 × 5 × 4) / (4 × 3 × 2 × 1)', '35'],
              ['12C5', '(12 × 11 × 10 × 9 × 8) / 120', '792'],
            ]}
          />
          <Callout kind="tip" title="Cancel first: 10C3">
            9 ÷ 3 = 3 and 8 ÷ 2 = 4, leaving 10 × 3 × 4 = 120
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes: 'Cancel common factors first so the numbers stay small.',
  },
  {
    id: 'c4-handshakes',
    section: C4,
    label: 'Handshakes',
    element: (
      <ContentSlide kicker={C4} title="Handshakes" lead="10 people meet and every pair shakes hands once. How many handshakes?" lesson={SESSION}>
        <Handshakes />
      </ContentSlide>
    ),
    notes: 'Start with a small case: ask 4 learners to shake hands with each other and count the handshakes (4C2 = 6). Then generalise to 10.',
  },
  {
    id: 'c4-questions',
    section: C4,
    label: 'Choosing Questions',
    element: (
      <ContentSlide kicker={C4} title="Choosing Questions" lead="An exam paper has 10 questions and a student must answer any 8" lesson={SESSION}>
        <QuestionPaper />
      </ContentSlide>
    ),
    notes: 'Cancel the larger factorial first: 10! / 8! leaves 10 × 9, then divide by 2!. Learners should never multiply out 10! here. Takeaway for this section: count the arrangements, then divide by r!.',
  },

  /* ── CONCEPT 5: Relationship Between nPr and nCr (Merrill) ──────────── */
  { id: 'c5-divider', section: C5, label: 'Divider', element: <SectionBreakerSlide index={5} title={C5} lesson={SESSION} /> },
  {
    id: 'c5-select-arrange',
    section: C5,
    label: 'Select, Then Arrange',
    element: (
      <ContentSlide kicker={C5} title="Select, Then Arrange" lead="Every arrangement of r objects from n has two steps" lesson={SESSION}>
        <SelectArrange />
      </ContentSlide>
    ),
    notes: 'This links the two formulas through the product rule from the previous session. If learners forget the nCr formula, they can rebuild it from nPr by dividing by r!.',
  },
  {
    id: 'c5-side-by-side',
    section: C5,
    label: 'Side by Side',
    element: (
      <ContentSlide kicker={C5} title="Side by Side" lead="For n = 5, every row satisfies 5Pr = 5Cr × r!" lesson={SESSION}>
        <DataTable
          className="w-full"
          stepped
          compact
          columns={[{ label: mh('r'), weight: 0.5 }, { label: mh('5Pr') }, { label: mh('5Cr') }, { label: mh('r!') }, { label: mh('5Cr × r!'), weight: 1.3 }]}
          rows={[
            ['0', '1', '1', '1', '1 × 1 = 1'],
            ['1', '5', '5', '1', '5 × 1 = 5'],
            ['2', '20', '10', '2', '10 × 2 = 20'],
            ['3', '60', '10', '6', '10 × 6 = 60'],
            ['4', '120', '5', '24', '5 × 24 = 120'],
            ['5', '120', '1', '120', '1 × 120 = 120'],
          ]}
        />
      </ContentSlide>
    ),
  },
  {
    id: 'c5-gap',
    section: C5,
    label: 'Gap Grows',
    element: (
      <ContentSlide kicker={C5} title="Gap Grows" lead="Arrangements always outnumber selections, and the gap grows with r" lesson={SESSION}>
        <div className="flex w-full items-center gap-6">
          <div className="flex-[1.4]">
            <Bars
              height={220}
              max={120}
              data={[0, 1, 2, 3, 4, 5].map((r) => ({
                x: `r = ${r}`,
                ys: [
                  { v: [1, 5, 20, 60, 120, 120][r], label: String([1, 5, 20, 60, 120, 120][r]), color: colors.brandDark },
                  { v: [1, 5, 10, 10, 5, 1][r], label: String([1, 5, 10, 10, 5, 1][r]), color: colors.success },
                ],
              }))}
            />
          </div>
          <div className="flex flex-1 flex-col gap-3">
            <span className="flex items-center gap-2 text-[18px] font-semibold" style={{ color: colors.brandDark }}>
              <span className="h-4 w-4 rounded" style={{ background: colors.brandDark }} /> 5Pr
            </span>
            <span className="flex items-center gap-2 text-[18px] font-semibold" style={{ color: colors.success }}>
              <span className="h-4 w-4 rounded" style={{ background: colors.success }} /> 5Cr
            </span>
            <Callout kind="info" title="nPr ≥ nCr">
              Equal only when r = 0 or r = 1
            </Callout>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: 'Ask: why are the two counts equal for r = 1? With one object there is nothing to put in order.',
  },
  {
    id: 'c5-find',
    section: C5,
    label: 'Find n and r',
    element: (
      <ContentSlide kicker={C5} title="Find n and r" lead="If nPr = 720 and nCr = 120, find r and n" lesson={SESSION}>
        <Ladder />
      </ContentSlide>
    ),
    notes: 'Exam hook: this "given nPr and nCr" question is a textbook favourite. The relationship nPr = nCr × r! is the first step.',
  },
  {
    id: 'c5-practice',
    section: C5,
    label: 'Practice',
    element: (
      <ContentSlide kicker={C5} title="Practice" lead="Multiply by r! to go up, divide by r! to come down" lesson={SESSION}>
        <ExitTicket />
      </ContentSlide>
    ),
    notes: 'For the last row, ask learners to also find n: nP3 = 24 = 4 × 3 × 2, so n = 4. Takeaway for this section: forgot nCr? Rebuild it from nPr ÷ r!.',
  },

  /* ── CONCEPT 6: Solving Standard Problems (Merrill) ─────────────────── */
  { id: 'c6-divider', section: C6, label: 'Divider', element: <SectionBreakerSlide index={6} title={C6} lesson={SESSION} /> },
  {
    id: 'c6-method',
    section: C6,
    label: 'Four-Step Method',
    element: (
      <ContentSlide kicker={C6} title="Four-Step Method" lead="Decide before you calculate" lesson={SESSION}>
        <MethodChart />
      </ContentSlide>
    ),
    notes: 'Step 1: what are the n objects, and how many (r) are chosen? Step 2: does swapping two chosen objects give a new outcome? Step 3: yes gives nPr, no gives nCr. Step 4: cancel factors and ask whether the answer is sensible.',
  },
  {
    id: 'c6-signal',
    section: C6,
    label: 'Signal Words',
    element: (
      <ContentSlide kicker={C6} title="Signal Words" lead="Words in a problem that hint at the formula" lesson={SESSION}>
        <SignalWords />
      </ContentSlide>
    ),
    notes: 'Signal words help but can mislead; the swap test is the real decider.',
  },
  {
    id: 'c6-people',
    section: C6,
    label: 'Arranging People',
    element: (
      <ContentSlide kicker={C6} title="Arranging People" lead="Positions differ in every row, so order matters" lesson={SESSION}>
        <RevealTable
          keep={2}
          columns={[{ label: 'Problem', weight: 2.4 }, { label: mh('n, r'), weight: 0.6 }, { label: 'Working', weight: 1.5 }, { label: 'Answer', weight: 0.7 }]}
          rows={[
            ['6 people stand in a queue', '6, 6', '6!', '720'],
            ['3 of 6 people sit on 3 numbered chairs', '6, 3', '6P3 = 6 × 5 × 4', '120'],
            ['President, Vice-President and Secretary from 12 members', '12, 3', '12P3 = 12 × 11 × 10', '1,320'],
            ['First, second and third prize among 20 entries', '20, 3', '20P3 = 20 × 19 × 18', '6,840'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'In every row the positions are different, so the swap test gives a new outcome. Ask learners to say which word in each problem signals order.',
  },
  {
    id: 'c6-committees',
    section: C6,
    label: 'Forming Committees',
    element: (
      <ContentSlide kicker={C6} title="Forming Committees" lead="No seat at the table is special, so order does not matter" lesson={SESSION}>
        <div className="flex w-full items-center gap-6">
          <RoundTable />
          <div className="flex-1">
            <RevealTable
              keep={2}
              columns={[{ label: 'Problem', weight: 2 }, { label: mh('n, r'), weight: 0.6 }, { label: 'Working', weight: 1.1 }, { label: 'Answer', weight: 0.7 }]}
              rows={[
                ['A committee of 4 from 9 teachers', '9, 4', '9C4', '126'],
                ['A team of 5 from 12 players', '12, 5', '12C5', '792'],
                ['A squad of 11 from 15 players', '15, 11', '15! / (11! × 4!)', '1,365'],
                ['3 books to borrow from a shelf of 10', '10, 3', '10C3', '120'],
              ]}
            />
          </div>
        </div>
      </ContentSlide>
    ),
    notes: 'For 15C11, compute 15! / (11! × 4!) = (15 × 14 × 13 × 12) / 24 = 1,365. Cancelling against the larger factorial keeps the working short.',
  },
  {
    id: 'c6-office',
    section: C6,
    label: 'Committee or Office-Bearers',
    element: (
      <ContentSlide kicker={C6} title="Committee or Office-Bearers" lead="A club has 8 members. Same group, two questions" lesson={SESSION}>
        <Badges />
      </ContentSlide>
    ),
    notes: 'This mirrors the first slide of the session at a larger size: each committee of 3 can share out the three offices in 3! = 6 ways.',
  },
  {
    id: 'c6-mistakes',
    section: C6,
    label: 'Common Mistakes',
    element: (
      <ContentSlide kicker={C6} title="Common Mistakes" lead="Four answers from a marked script, and their corrections" lesson={SESSION}>
        <MarkingSheet />
      </ContentSlide>
    ),
    notes: 'Ask learners which error they have made before. The first two are the most common: decide order first, every time.',
  },
  {
    id: 'c6-practice',
    section: C6,
    label: 'Practice',
    element: (
      <ContentSlide kicker={C6} title="Practice" lead="Vote P or C first, then compute" lesson={SESSION}>
        <VoteList />
      </ContentSlide>
    ),
    notes: 'The league rows are a strong pair: with home and away, A at home to B is a different match from B at home to A, so order matters.',
  },
  {
    id: 'c6-computing',
    section: C6,
    label: 'In Computing',
    element: (
      <ContentSlide kicker={C6} title="In Computing" lead="Where programmers meet nPr and nCr" lesson={SESSION}>
        <ComputingTiles />
      </ContentSlide>
    ),
    notes: 'The first tile explains why comparing every pair is slow. Ask learners how many comparisons 1,000 files would need before revealing 499,500.',
  },

  /* ── CLOSE ───────────────────────────────────────────────────────────── */
  { id: 'quiz-2', section: 'Close', label: 'Quiz Time', element: <QuizTimeSlide lesson={SESSION} /> },
  { id: 'takeaways', section: 'Close', label: 'Key Takeaways', element: <KeyTakeawaysSlide title={SESSION} lesson={SESSION} points={AGENDA} /> },
  { id: 'feedback', section: 'Close', label: 'Feedback', element: <FeedbackSlide lesson={SESSION} formless />, notes: 'No form and no QR (content rule 41 as amended 2026-11-21). Ask for feedback out loud.' },
  { id: 'thank-you', section: 'Close', label: 'Thank You', element: <ThankYouSlide title="Thank You" lesson={SESSION} /> },
  { id: 'all-the-best', section: 'Close', label: 'All the Best', element: <ThankYouSlide title="All the Best" lesson={SESSION} /> },
]
