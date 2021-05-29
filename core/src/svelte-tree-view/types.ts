export interface ITreeNode {
  id: string
  depth: number
  collapsed: boolean
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
