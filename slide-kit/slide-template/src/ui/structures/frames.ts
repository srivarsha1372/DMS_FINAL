import { useClaimedSteps } from '@/motion/Stepper'

/**
 * FRAMES: the one stepping contract every figure in `structures/` shares.
 *
 * A figure is handed an array of states. Frame 0 is what the slide opens on;
 * each press of the presenter's step key moves to the next frame. The figure
 * claims `frames.length - 1` build steps from the slide's `Stepper`, so it sits
 * in the same press order as every `Step` around it, `?all` shows the last
 * frame, and `revealSteps.ts` counts it like any other build.
 *
 * Why frames rather than "one element per step" flags: the build sequences in a
 * data-structures lesson are not only things appearing. An insert SHIFTS cells,
 * a delete REDRAWS a link, a sieve pass SWITCHES cells off. A frame is the whole
 * picture at that press, so a change of any kind is just the difference between
 * two frames, and the figure animates whatever moved.
 */
export function useFrame(count: number): number {
  const shown = useClaimedSteps(Math.max(0, count - 1))
  let n = 0
  for (const s of shown) if (s) n++
  return Math.min(n, Math.max(0, count - 1))
}

/** The explanatory tier (generate-slides 4b): roughly double the UI numbers. */
export const TIER = {
  enter: 0.52,
  move: 0.62,
  draw: 0.86,
  stagger: 0.13,
} as const

export const EASE = [0.22, 1, 0.36, 1] as const
