import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useInstant } from '@/motion/instant'
import { EASE, TIER, useFrame } from './frames'

/**
 * BIT STRIP — a set as one lit or dark cell per element of the universe.
 *
 * THE ARGUMENT
 *
 * A bit-represented set is read by POSITION: bit i answers "is the i-th element
 * in the set?". The figure puts the element above its bit, every time, so the
 * room reads the 1s as members rather than as a binary number. A lit cell is a
 * member (the source's light bulb, the attendance register's "present"); a dark
 * one is not. Rows stacked under one header are what makes OR, AND and NOT
 * visible column by column, and a row whose cells switch off one pass at a time
 * is the sieve.
 *
 * `bits` per row is a string: '1' lit, '0' dark, anything else ('?', ' ') an
 * empty slot not filled yet, which is how a row is built "with the room".
 *
 * STEPPING: `frames`, see `frames.ts`. A cell that changes between frames
 * cross-fades its fill; nothing moves position.
 *
 * Sits on the body's left datum, never centred under a left lead (content
 * rule 38). Added 2026-11-21 for DSM "Representation of Discrete Structures".
 */

export interface BitRow {
  label: ReactNode
  bits: string
  /** A result row is set apart by a rule above it and a brand label. */
  result?: boolean
  /** The set this row stands for, written after the bits. */
  set?: ReactNode
}

export interface BitFrame {
  rows: BitRow[]
  /** 0-based positions to ring, in every row (decoding: "circle the 1s"). */
  ring?: number[]
  caption?: ReactNode
}

export function BitStrip({
  elements,
  frames,
  cell = 50,
  gap = 6,
  labelWidth = 150,
  setWidth = 0,
  className = '',
}: {
  /** The universe in its fixed order: the header above each column. */
  elements: ReactNode[]
  frames: BitFrame[]
  cell?: number
  gap?: number
  labelWidth?: number
  /** Width of the column after the bits that holds `set`; 0 hides it. */
  setWidth?: number
  className?: string
}) {
  const instant = useInstant()
  const fi = useFrame(frames.length)
  const f = frames[fi]
  const ring = new Set(f.ring ?? [])
  const dur = (t: number) => (instant ? 0 : t)
  const anyCaption = frames.some((fr) => fr.caption)
  const grid = {
    display: 'grid',
    gridTemplateColumns: `${labelWidth}px repeat(${elements.length}, ${cell}px)${setWidth ? ` ${setWidth}px` : ''}`,
    columnGap: gap,
    alignItems: 'center',
  } as const

  return (
    <div className={`w-max ${className}`}>
      {/* header: the universe, in order */}
      <div style={grid} className="mb-2">
        <span />
        {elements.map((e, i) => (
          <span key={i} className="text-center font-mono text-[17px] font-medium" style={{ color: colors.muted }}>
            {e}
          </span>
        ))}
        {setWidth ? <span /> : null}
      </div>

      <div className="space-y-2.5">
        <AnimatePresence initial={false}>
          {f.rows.map((r, ri) => (
            <motion.div
              key={`${ri}-${String(r.label)}`}
              style={{ ...grid, borderTop: r.result ? `2px solid ${colors.line}` : undefined, paddingTop: r.result ? 10 : 0 }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: dur(TIER.enter), ease: EASE }}
            >
              <span
                className="whitespace-nowrap pr-2 text-right font-heading text-[19px] font-semibold"
                style={{ color: r.result ? colors.brandDark : colors.ink }}
              >
                {r.label}
              </span>
              {elements.map((_, i) => {
                const b = r.bits[i] ?? ' '
                const on = b === '1'
                const off = b === '0'
                return (
                  <motion.span
                    key={i}
                    className="grid place-items-center rounded-lg font-mono text-[20px] font-semibold"
                    style={{ height: cell, outlineOffset: 3 }}
                    initial={false}
                    animate={{
                      backgroundColor: on ? '#FFE9A8' : off ? '#FFFFFF' : '#FFFFFF00',
                      color: on ? '#7A4B00' : colors.muted,
                      borderColor: on ? colors.warning : off ? colors.line : colors.muted,
                      boxShadow: on ? `0 0 16px -2px ${colors.warning}99` : '0 0 0 0 #0000',
                      outline: ring.has(i) && on ? `3px solid ${colors.brand}` : '3px solid #0000',
                    }}
                    transition={{ duration: dur(0.42), ease: EASE }}
                  >
                    <span
                      className="grid h-full w-full place-items-center rounded-lg"
                      style={{ border: `2px ${on || off ? 'solid' : 'dashed'} currentColor`, borderColor: 'inherit' }}
                    >
                      {on || off ? b : ''}
                    </span>
                  </motion.span>
                )
              })}
              {setWidth ? (
                <span className="pl-3 font-mono text-[18px]" style={{ color: colors.ink }}>
                  {r.set}
                </span>
              ) : null}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {anyCaption && (
        <div className="relative mt-4 h-[30px]">
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
