import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useInstant } from '@/motion/instant'
import { EASE, TIER, useFrame } from './frames'

/**
 * MATRIX ORDER — a table laid out in a line, row by row or column by column.
 *
 * THE ARGUMENT
 *
 * Memory is one line and a matrix has two directions, so storing one means
 * choosing which direction to walk. The figure shows the grid the room thinks
 * in and, under it, the line memory actually holds, filled in the order the
 * walk visits the cells. Each grid cell gains its position number as it is laid
 * down, so "A[2,3] is 7th in row-major and 8th in column-major" is something
 * the room reads off the picture, not a fact it is told.
 *
 * STEPPING: `frames`, see `frames.ts`. A frame says the order, how many cells
 * have been laid into the line so far, and which cell (if any) is lit.
 *
 * Sits on the body's left datum, never centred under a left lead (content
 * rule 38). Added 2026-11-21 for DSM "Representation of Discrete Structures".
 */

export interface MatrixFrame {
  order: 'row' | 'column'
  /** How many cells have been laid into the line. */
  filled: number
  /** [i, j], 1-based, lit in the grid and in the line. */
  lit?: [number, number]
  caption?: ReactNode
}

const ord = (k: number) => `${k}${k % 10 === 1 && k !== 11 ? 'st' : k % 10 === 2 && k !== 12 ? 'nd' : k % 10 === 3 && k !== 13 ? 'rd' : 'th'}`

export function MatrixOrder({
  m,
  n,
  frames,
  name = 'A',
  cellW = 96,
  cellH = 56,
  lineW = 78,
  lineLength,
  className = '',
}: {
  m: number
  n: number
  frames: MatrixFrame[]
  name?: string
  cellW?: number
  cellH?: number
  lineW?: number
  /** How many cells the line draws (defaults to all m × n). */
  lineLength?: number
  className?: string
}) {
  const instant = useInstant()
  const f = frames[useFrame(frames.length)]
  const dur = (t: number) => (instant ? 0 : t)
  const total = lineLength ?? m * n

  /* the walk: the list of [i, j] in storage order */
  const walk: [number, number][] = []
  if (f.order === 'row') for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) walk.push([i, j])
  else for (let j = 1; j <= n; j++) for (let i = 1; i <= m; i++) walk.push([i, j])
  const posOf = (i: number, j: number) => walk.findIndex(([a, b]) => a === i && b === j) + 1
  const isLit = (i: number, j: number) => !!f.lit && f.lit[0] === i && f.lit[1] === j
  const label = (i: number, j: number) => `${name}[${i},${j}]`

  const cellStyle = (lit: boolean, laid: boolean) => ({
    backgroundColor: lit ? '#FFF6E5' : laid ? '#EAF1FF' : '#FFFFFF',
    borderColor: lit ? colors.warning : laid ? colors.brand : colors.line,
    color: lit ? '#8A5200' : colors.ink,
  })

  return (
    <div className={`flex w-max flex-col items-start ${className}`}>
      {/* the grid the room thinks in */}
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${n}, ${cellW}px)` }}>
        {Array.from({ length: m }, (_, r) =>
          Array.from({ length: n }, (_, c) => {
            const i = r + 1
            const j = c + 1
            const p = posOf(i, j)
            const laid = p <= f.filled
            return (
              <motion.div
                key={`${i}-${j}`}
                className="relative grid place-items-center rounded-xl border-2 font-mono text-[18px] font-medium"
                style={{ height: cellH }}
                initial={false}
                animate={cellStyle(isLit(i, j), laid)}
                transition={{ duration: dur(0.42), ease: EASE }}
              >
                <span className="leading-none">{label(i, j)}</span>
                <motion.span
                  className="font-heading text-[14px] font-semibold leading-none"
                  style={{ color: colors.brandDark }}
                  initial={false}
                  animate={{ opacity: laid ? 1 : 0 }}
                  transition={{ duration: dur(TIER.enter), ease: EASE }}
                >
                  {ord(p)}
                </motion.span>
              </motion.div>
            )
          }),
        )}
      </div>

      <p className="mb-3 mt-6 font-heading text-[17px] font-semibold uppercase tracking-wider" style={{ color: colors.muted }}>
        Memory: one line
      </p>

      {/* the line memory holds */}
      <div className="flex gap-1.5">
        {Array.from({ length: total }, (_, k) => {
          const laid = k < f.filled
          const [i, j] = walk[k]
          return (
            <div key={k} className="flex flex-col items-center gap-1">
              <motion.div
                className="grid place-items-center rounded-lg border-2 font-mono text-[15px] font-medium"
                style={{ width: lineW, height: 46 }}
                initial={false}
                animate={{
                  ...cellStyle(laid && isLit(i, j), laid),
                  borderStyle: laid ? 'solid' : 'dashed',
                }}
                transition={{ duration: dur(0.42), ease: EASE }}
              >
                <motion.span
                  initial={false}
                  animate={{ opacity: laid ? 1 : 0, y: laid ? 0 : -6 }}
                  transition={{ duration: dur(TIER.enter), ease: EASE }}
                >
                  {label(i, j)}
                </motion.span>
              </motion.div>
              <span className="font-mono text-[14px]" style={{ color: colors.muted }}>
                {k + 1}
              </span>
            </div>
          )
        })}
      </div>

      {frames.some((fr) => fr.caption) && (
        <p className="mt-3 h-[28px] text-[19px] font-medium" style={{ color: colors.ink }}>
          {f.caption}
        </p>
      )}
    </div>
  )
}
