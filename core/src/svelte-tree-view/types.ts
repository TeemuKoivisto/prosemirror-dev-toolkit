import { SvelteComponentTyped } from 'svelte'

interface TreeViewProps {
  data: any
  base16theme?: { [key: string]: string }
  leftIndent?: number
  showLogButton?: boolean
  showCopyButton?: boolean
  sortObjectValues?: 'ascending' | 'descending'
  valueFormatter?: (val: any, n: ITreeNode) => string | undefined
  shouldExpandNode?: (n: ITreeNode) => boolean
  mapChildren?: (val: any, type: ValueType, parent: ITreeNode) => [string, any][] | undefined
}

export interface TreeRecursionOpts {
  maxDepth: number
  omitKeys: string[]
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
  children: ITreeNode[]
}

export type ValueType =
  | 'array'
  | 'map'
  | 'set'
  | 'object'
  | 'function'
  | 'string'
  | 'number'
  | 'bigint'
  | 'boolean'
  | 'symbol'
  | 'null'
  | 'undefined'
