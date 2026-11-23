import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useInstant } from '@/motion/instant'
import { useClaimedSteps } from '@/motion/Stepper'
import { EASE, TIER } from './frames'

/**
 * CLASS TREE — a classification drawn top-down, one node per press.
 *
 * THE ARGUMENT
 *
 * A classification is a hierarchy: every box is a KIND OF its parent. A list or
 * a grid of cards loses that, and the room is left memorising labels. Drawn as a
 * tree, "linear is a kind of non-primitive" is a line on the screen. Built one
 * node per press, in reading order (level by level, left to right), so no part
 * arrives before the parent that explains it (pedagogy section 3).
 *
 * Connectors are plain CSS lines between boxes, never across one (rule 42).
 *
 * Sits on the body's left datum, never centred under a left lead (content
 * rule 38). Added 2026-11-21 for DSM "Representation of Discrete Structures".
 */

export interface TreeNode {
  label: ReactNode
  /** Examples or a one-line gloss, under the label. */
  sub?: ReactNode
  children?: TreeNode[]
}

const LINE = 2
const DROP = 22

function bfs(root: TreeNode): TreeNode[] {
  const out: TreeNode[] = []
  const q = [root]
  while (q.length) {
    const n = q.shift()!
    out.push(n)
    q.push(...(n.children ?? []))
  }
  return out
}

interface Ctx {
  shown: Set<TreeNode>
  dur: (t: number) => number
  lineColour: string
  boxWidth: number
}

function Box({ node, depth, ctx }: { node: TreeNode; depth: number; ctx: Ctx }) {
const { shown, dur, lineColour, boxWidth } = ctx
  const on = shown.has(node)
  const kids = node.children ?? []
  return (
    <div className="flex flex-col items-center">
      <motion.div
        className="rounded-card border-2 px-4 py-2.5 text-center"
        style={{
          width: boxWidth,
          background: depth === 0 ? '#EAF1FF' : '#FFFFFF',
          borderColor: depth === 0 ? colors.brand : colors.line,
          boxShadow: `0 8px 20px -14px ${colors.brand}88, inset 0 1px 0 0 #FFFFFF`,
        }}
        initial={false}
        animate={{ opacity: on ? 1 : 0, y: on ? 0 : 10 }}
        transition={{ duration: dur(TIER.enter), ease: EASE }}
      >
        <p className="font-heading text-[19px] font-semibold leading-tight" style={{ color: depth === 0 ? colors.brandDark : colors.ink }}>
          {node.label}
        </p>
        {node.sub && (
          <p className="mt-1 text-[15px] leading-snug" style={{ color: colors.ink }}>
            {node.sub}
          </p>
        )}
      </motion.div>

      {kids.length > 0 && (
        <motion.div
          className="flex flex-col items-center"
          initial={false}
          animate={{ opacity: kids.some((k) => shown.has(k)) ? 1 : 0 }}
          transition={{ duration: dur(TIER.enter), ease: EASE }}
        >
          {/* the stem down from the parent */}
          <span style={{ width: LINE, height: DROP, background: lineColour }} />
          <div className="flex items-start gap-6">
            {kids.map((k, i) => (
              <motion.div
                key={i}
                className="relative flex flex-col items-center"
                initial={false}
                animate={{ opacity: shown.has(k) ? 1 : 0 }}
                transition={{ duration: dur(TIER.enter), ease: EASE }}
              >
                {/* the bar joining siblings: half to each side, so the first and last stop at their own stem */}
                {kids.length > 1 && (
                  <span
                    className="absolute top-0"
                    style={{
                      height: LINE,
                      background: lineColour,
                      left: i === 0 ? '50%' : -12,
                      right: i === kids.length - 1 ? '50%' : -12,
                    }}
                  />
                )}
                <span style={{ width: LINE, height: DROP, background: lineColour }} />
                <Box node={k} depth={depth + 1} ctx={ctx} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export function ClassTree({ root, stepped = true, boxWidth = 220, className = '' }: { root: TreeNode; stepped?: boolean; boxWidth?: number; className?: string }) {
  const instant = useInstant()
  const order = bfs(root)
  const claimed = useClaimedSteps(stepped ? order.length - 1 : 0)
  const shown = new Set<TreeNode>([root, ...order.slice(1).filter((_, i) => !stepped || claimed[i])])
  const dur = (t: number) => (instant ? 0 : t)
  const lineColour = `${colors.brand}66`

  return (
    <div className={`w-max ${className}`}>
      <Box node={root} depth={0} ctx={{ shown, dur, lineColour, boxWidth }} />
    </div>
  )
}
