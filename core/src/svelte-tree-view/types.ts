import { SvelteComponent, SvelteComponentTyped } from 'svelte'

export interface TreeViewProps {
  data: any
  base16theme?: { [key: string]: string }
  leftIndent?: number
  showLogButton?: boolean
  showCopyButton?: boolean
  valueComponent?: SvelteComponentTyped<{
    value: any
    node: ITreeNode
    defaultFormatter?: (val: any) => string | undefined
  }>
  recursionOpts?: TreeRecursionOpts
  valueFormatter?: (val: any, n: ITreeNode) => string | undefined
}

export interface TreeRecursionOpts {
  maxDepth?: number
  omitKeys?: string[]
  stopCircularRecursion?: boolean
  isCircularNode?: (n: ITreeNode, iteratedValues: Map<any, ITreeNode>) => boolean
  shouldExpandNode?: (n: ITreeNode) => boolean
  mapChildren?: (val: any, type: ValueType, parent: ITreeNode) => [string, any][] | undefined
}

export class TreeView extends SvelteComponentTyped<TreeViewProps> {}

export interface ITreeNode {
  id: string
  index: number
  key: string
  value: any
  depth: number
  collapsed: boolean
  type: ValueType
  path: number[]
  parentId: string | null
  circularOfId: string | null
  children: ITreeNode[]
}

export type ValueType =
  | 'array'
  | 'map'
  | 'set'
  | 'date'
  | 'object'
  | 'function'
  | 'string'
  | 'number'
  | 'bigint'
  | 'boolean'
  | 'symbol'
  | 'null'
  | 'undefined'
