import { DecorationSet } from 'prosemirror-view'
import { Transaction } from 'prosemirror-state'
import { Node as PMNode, NodeType } from 'prosemirror-model'

export type Operation = 'insert' | 'replace' | 'delete'

export class DummyClass {
  values: any[] = [{ 1: [1, 2, 3] }, { a: 'hello' }, 1]
}
export interface TrackedNodes {
  tr: Transaction
  changedNodesMap: Map<PMNode, { pos: number; operation: Operation }>
  changedNodesTypesSet: Set<NodeType>
}
export interface PluginState {
  decorationSet: DecorationSet
  exampleMap: Map<any, any>
  exampleSet: Set<HTMLElement>
  exampleClasses: DummyClass[]
  trackedTrs: TrackedNodes[]
  joined: TrackedNodes
}
