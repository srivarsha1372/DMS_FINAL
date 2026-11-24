import { useId } from 'react'
import { colors } from '@/design/tokens'

/**
 * VENN MINI — two sets in a universe, with the region one operation keeps shaded.
 *
 * Small enough to sit in a table row beside the operation it pictures, so a
 * five-row "set operation = bit operation" table can show each region without
 * a separate slide per diagram. The letters are DOM, the shapes SVG.
 *
 * Added 2026-11-21 for DSM "Representation of Discrete Structures".
 */

export type VennRegion = 'union' | 'intersection' | 'complement' | 'difference' | 'symmetric'

export function VennMini({ region, width = 112, className = '' }: { region: VennRegion; width?: number; className?: string }) {
  const uid = useId().replace(/:/g, '')
  const h = Math.round(width * 0.62)
  const r = h * 0.34
  const ax = width * 0.38
  const bx = width * 0.62
  const cy = h / 2
  const fill = `${colors.brand}66`
  const edge = colors.brandDark
  const circleA = <circle cx={ax} cy={cy} r={r} />
  const circleB = <circle cx={bx} cy={cy} r={r} />

  return (
    <div className={`relative inline-block ${className}`} style={{ width, height: h }}>
      <svg width={width} height={h} aria-hidden className="absolute inset-0">
        <defs>
          <clipPath id={`${uid}-a`}>{circleA}</clipPath>
          <mask id={`${uid}-noA`}>
            <rect width={width} height={h} fill="#fff" />
            <circle cx={ax} cy={cy} r={r} fill="#000" />
          </mask>
          <mask id={`${uid}-noB`}>
            <rect width={width} height={h} fill="#fff" />
            <circle cx={bx} cy={cy} r={r} fill="#000" />
          </mask>
        </defs>

        {region === 'union' && (
          <g fill={fill}>
            {circleA}
            {circleB}
          </g>
        )}
        {region === 'intersection' && (
          <g fill={fill} clipPath={`url(#${uid}-a)`}>
            {circleB}
          </g>
        )}
        {region === 'complement' && <rect x={2} y={2} width={width - 4} height={h - 4} rx={8} fill={fill} mask={`url(#${uid}-noA)`} />}
        {region === 'difference' && (
          <g fill={fill} mask={`url(#${uid}-noB)`}>
            {circleA}
          </g>
        )}
        {region === 'symmetric' && (
          <path
            fill={fill}
            fillRule="evenodd"
            d={`M ${ax - r} ${cy} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0 Z M ${bx - r} ${cy} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0 Z`}
          />
        )}

        {/* outlines over the fill */}
        <rect x={2} y={2} width={width - 4} height={h - 4} rx={8} fill="none" stroke={colors.line} strokeWidth={2} />
        <g fill="none" stroke={edge} strokeWidth={2}>
          {circleA}
          {circleB}
        </g>
      </svg>
      <span className="absolute font-heading text-[13px] font-semibold" style={{ left: ax - r - 2, top: 3, color: edge }}>
        A
      </span>
      <span className="absolute font-heading text-[13px] font-semibold" style={{ left: bx + r - 8, top: 3, color: edge }}>
        B
      </span>
    </div>
  )
}
