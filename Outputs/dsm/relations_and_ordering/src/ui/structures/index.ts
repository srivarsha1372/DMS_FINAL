/**
 * STRUCTURES — figures for teaching how data is stored: memory locations and
 * pointers (`MemoryMap`), bit-represented sets (`BitStrip`), matrix storage
 * order (`MatrixOrder`), set-operation regions (`VennMini`) and classification
 * trees (`ClassTree`). All step through `frames` (see `frames.ts`) or one node
 * per press. Added 2026-11-21 for DSM "Representation of Discrete Structures".
 */
export { MemoryMap, row, column, chain, NODE_W, CELL_W, CELL_H } from './MemoryMap'
export type { MapCell, MapArrow, MapMarker, MapFrame, CellState } from './MemoryMap'
export { BitStrip } from './BitStrip'
export type { BitRow, BitFrame } from './BitStrip'
export { MatrixOrder } from './MatrixOrder'
export type { MatrixFrame } from './MatrixOrder'
export { VennMini } from './VennMini'
export type { VennRegion } from './VennMini'
export { ClassTree } from './ClassTree'
export type { TreeNode } from './ClassTree'
export { useFrame } from './frames'
export { RelationGraph, layered, columns, pairs } from './RelationGraph'
export type { GraphNode, GraphEdge, GraphGroup, GraphMark, GraphFrame, NodeState } from './RelationGraph'
