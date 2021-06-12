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
  depth: number
  collapsed: boolean
  type: ValueType
  path: string[]
  parent: string | null
  children: ITreeNode[]
  key: string
  value: any
}

export type ValueType =
  | 'array'
  | 'map'
  | 'object'
  | 'function'
  | 'string'
  | 'number'
  | 'bigint'
  | 'boolean'
  | 'symbol'
  | 'null'
  | 'undefined'
