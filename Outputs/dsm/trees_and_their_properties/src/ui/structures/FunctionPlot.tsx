import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useInstant } from '@/motion/instant'
import { EASE, TIER, useFrame } from './frames'

/**
 * FUNCTION PLOT: the graph of y = f(x), drawn only over its domain.
 *
 * THE ARGUMENT
 *
 * Whether a rule is one-to-one, onto or invertible depends on its sets as much
 * as its formula. A table can say "x² on [0, ∞) is one-to-one"; a plot SHOWS
 * it: the left half of the parabola fades out, the codomain is a bar on the
 * y-axis, a missing point is an open circle, and the inverse is the same curve
 * mirrored in y = x. No other figure in the kit draws a graph.
 *
 *   - `curves` are sampled from `fn` over `domain`, clipped to the y-range;
 *     `faded` draws a part that is no longer in the domain, `dashed` a guide
 *   - `codomain` is a thick bar on the y-axis (the set where outputs may land)
 *   - `holes` are open circles (a point the function does not have)
 *   - `mirror` draws the dashed line y = x
 *   - `labels` are short tags pinned at a data point, never on the curve
 *
 * STEPPING: `frames`, see `frames.ts`. A curve that appears draws itself along
 * its path (generate-slides 4b, line draws 860ms).
 *
 * Added 2026-11-23 for DSM "Functions".
 */

type Tone = 'brand' | 'ok' | 'warn' | 'danger' | 'muted'

export interface PlotCurve {
  id: string
  fn: (x: number) => number
  domain: [number, number]
  tone?: Tone
  faded?: boolean
  dashed?: boolean
}

export interface PlotLabel {
  id: string
  x: number
  y: number
  text: ReactNode
  tone?: Tone | 'ink'
  /** Which side of the point the tag sits on. */
  side?: 'left' | 'right' | 'above' | 'below'
}

export interface PlotFrame {
  curves: PlotCurve[]
  codomain?: [number, number]
  holes?: { x: number; y: number }[]
  mirror?: boolean
  labels?: PlotLabel[]
  caption?: ReactNode
}

const TONE = {
  brand: colors.brandDark,
  ok: colors.success,
  warn: colors.warning,
  danger: colors.danger,
  muted: colors.muted,
  ink: colors.ink,
} as const

export function FunctionPlot({
  frames,
  width,
  height,
  x,
  y,
  ticks = true,
  className = '',
}: {
  frames: PlotFrame[]
  width: number
  height: number
  /** Visible x-range. */
  x: [number, number]
  /** Visible y-range. */
  y: [number, number]
  /** Draw integer tick marks on both axes. */
  ticks?: boolean
  className?: string
}) {
  const instant = useInstant()
  const fi = useFrame(frames.length)
  const f = frames[fi]
  const dur = (t: number) => (instant ? 0 : t)
  const anyCaption = frames.some((fr) => fr.caption)

  const pad = 18
  const sx = (v: number) => pad + ((v - x[0]) / (x[1] - x[0])) * (width - 2 * pad)
  const sy = (v: number) => pad + ((y[1] - v) / (y[1] - y[0])) * (height - 2 * pad)
  const ax = sx(Math.min(Math.max(0, x[0]), x[1]))
  const ay = sy(Math.min(Math.max(0, y[0]), y[1]))

  /** Sample a curve, breaking the path where it leaves the y-range. */
  const pathOf = (c: PlotCurve) => {
    const n = 160
    const [a, b] = c.domain
    let d = ''
    let pen = false
    for (let i = 0; i <= n; i++) {
      const xv = a + ((b - a) * i) / n
      const yv = c.fn(xv)
      if (!Number.isFinite(yv) || yv < y[0] - 0.01 || yv > y[1] + 0.01) {
        pen = false
        continue
      }
      d += `${pen ? 'L' : 'M'} ${sx(xv).toFixed(1)} ${sy(yv).toFixed(1)} `
      pen = true
    }
    return d.trim()
  }

  const tickXs: number[] = []
  const tickYs: number[] = []
  if (ticks) {
    for (let v = Math.ceil(x[0]); v <= Math.floor(x[1]); v++) if (v !== 0) tickXs.push(v)
    for (let v = Math.ceil(y[0]); v <= Math.floor(y[1]); v++) if (v !== 0) tickYs.push(v)
  }

  return (
    <div className={`relative ${className}`} style={{ width }}>
      <div
        className="relative rounded-card border border-line"
        style={{ width, height, background: 'linear-gradient(180deg, #FFFFFF 0%, #F6F9FF 100%)', boxShadow: '0 1px 0 #FFFFFF inset, 0 10px 24px -18px rgba(0, 37, 75, 0.35)' }}
      >
        <svg className="pointer-events-none absolute inset-0" width={width} height={height} aria-hidden>
          {/* axes */}
          <line x1={pad - 6} y1={ay} x2={width - pad + 6} y2={ay} stroke={colors.ink} strokeOpacity={0.45} strokeWidth={1.5} />
          <line x1={ax} y1={pad - 6} x2={ax} y2={height - pad + 6} stroke={colors.ink} strokeOpacity={0.45} strokeWidth={1.5} />
          {tickXs.map((v) => (
            <line key={`tx${v}`} x1={sx(v)} y1={ay - 4} x2={sx(v)} y2={ay + 4} stroke={colors.ink} strokeOpacity={0.4} strokeWidth={1.2} />
          ))}
          {tickYs.map((v) => (
            <line key={`ty${v}`} x1={ax - 4} y1={sy(v)} x2={ax + 4} y2={sy(v)} stroke={colors.ink} strokeOpacity={0.4} strokeWidth={1.2} />
          ))}

          {/* the line y = x */}
          <AnimatePresence initial={false}>
            {f.mirror && (
              <motion.line
                key="mirror"
                x1={sx(Math.max(x[0], y[0]))}
                y1={sy(Math.max(x[0], y[0]))}
                x2={sx(Math.min(x[1], y[1]))}
                y2={sy(Math.min(x[1], y[1]))}
                stroke={colors.muted}
                strokeWidth={1.8}
                strokeDasharray="6 6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: dur(TIER.enter), ease: EASE }}
              />
            )}
          </AnimatePresence>

          {/* the codomain, a bar on the y-axis */}
          <AnimatePresence initial={false}>
            {f.codomain && (
              <motion.rect
                key="codomain"
                x={ax - 4}
                width={8}
                rx={4}
                fill={colors.warning}
                fillOpacity={0.55}
                initial={{ opacity: 0, y: sy(Math.min(f.codomain[1], y[1])), height: Math.max(0, sy(Math.max(f.codomain[0], y[0])) - sy(Math.min(f.codomain[1], y[1]))) }}
                animate={{ opacity: 1, y: sy(Math.min(f.codomain[1], y[1])), height: Math.max(0, sy(Math.max(f.codomain[0], y[0])) - sy(Math.min(f.codomain[1], y[1]))) }}
                exit={{ opacity: 0 }}
                transition={{ duration: dur(TIER.move), ease: EASE }}
              />
            )}
          </AnimatePresence>

          {/* curves */}
          <AnimatePresence initial={false}>
            {f.curves.map((c) => {
              const col = TONE[c.tone ?? 'brand']
              return (
                <motion.path
                  key={c.id}
                  d={pathOf(c)}
                  fill="none"
                  stroke={col}
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={c.dashed ? '7 6' : undefined}
                  initial={{ pathLength: instant ? 1 : 0, opacity: 1 }}
                  animate={{ pathLength: 1, opacity: c.faded ? 0.22 : 1, d: pathOf(c) }}
                  exit={{ opacity: 0 }}
                  transition={{ pathLength: { duration: dur(TIER.draw), ease: EASE }, opacity: { duration: dur(TIER.enter), ease: EASE }, d: { duration: dur(TIER.move), ease: EASE } }}
                />
              )
            })}
          </AnimatePresence>

          {/* open circles */}
          <AnimatePresence initial={false}>
            {(f.holes ?? []).map((h) => (
              <motion.circle
                key={`h${h.x},${h.y}`}
                cx={sx(h.x)}
                cy={sy(h.y)}
                r={7}
                fill="#FFFFFF"
                stroke={colors.danger}
                strokeWidth={2.5}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: dur(TIER.enter), ease: EASE }}
              />
            ))}
          </AnimatePresence>
        </svg>

        <AnimatePresence initial={false}>
          {(f.labels ?? []).map((l) => {
            const col = TONE[l.tone ?? 'ink']
            const side = l.side ?? 'right'
            const px = sx(l.x)
            const py = sy(l.y)
            const pos =
              side === 'right'
                ? { left: px + 12, top: py - 14, x: '0%' }
                : side === 'left'
                  ? { left: px - 12, top: py - 14, x: '-100%' }
                  : side === 'above'
                    ? { left: px, top: py - 40, x: '-50%' }
                    : { left: px, top: py + 12, x: '-50%' }
            return (
              <motion.span
                key={l.id}
                className="absolute whitespace-nowrap rounded-pill px-2.5 py-0.5 font-heading text-[16px] font-semibold"
                style={{ background: `${col}14`, color: col, border: `1.5px solid ${col}44` }}
                initial={{ opacity: 0, ...pos }}
                animate={{ opacity: 1, ...pos }}
                exit={{ opacity: 0 }}
                transition={{ duration: dur(TIER.enter), ease: EASE }}
              >
                {l.text}
              </motion.span>
            )
          })}
        </AnimatePresence>
      </div>

      {anyCaption && (
        <div className="relative mt-3 h-[30px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={fi}
              className="text-[19px] font-medium"
              style={{ color: colors.ink }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: dur(0.36), ease: EASE }}
            >
              {f.caption}
            </motion.p>
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
