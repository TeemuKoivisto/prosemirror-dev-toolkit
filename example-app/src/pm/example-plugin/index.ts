import { Plugin, PluginKey } from 'prosemirror-state'
import { DecorationSet } from 'prosemirror-view'

import { ExampleSchema } from '../schema-types'

import { findAddedOrRemovedNodes } from './findChangedNodes'

import { DummyClass } from './types'
import type { TrackedNodes, PluginState } from './types'

export const examplePluginKey = new PluginKey<PluginState>('example-plugin')

function joinStates(s1: TrackedNodes, s2: TrackedNodes) {
  const changedNodesMap = new Map(s1.changedNodesMap.entries())
  s2.changedNodesMap.forEach((val, key) => changedNodesMap.set(key, val))
  const changedNodesTypesSet = new Set(s1.changedNodesTypesSet.values())
  s2.changedNodesTypesSet.forEach((val) => changedNodesTypesSet.add(val))
  return {
    tr: s2.tr,
    changedNodesMap,
    changedNodesTypesSet,
  }
}

export const examplePlugin = () =>
  new Plugin({
    key: examplePluginKey,
    state: {
      init(config, instance): PluginState {
        return {
          decorationSet: DecorationSet.empty,
          // @ts-ignore
          exampleMap: new Map([['a', 1], ['b', { 'x': [1,2] }]]),
          exampleSet: new Set([document.createElement('div'), document.createElement('span')]),
          exampleClasses: [new DummyClass(), new DummyClass()],
          trackedTrs: [],
          joined: {
            tr: instance.tr,
            changedNodesMap: new Map(),
            changedNodesTypesSet: new Set(),
          },
        }
      },
      apply(tr, value, oldState, newState): PluginState {
        const state = findAddedOrRemovedNodes(tr, oldState.doc)
        if (tr.getMeta('appendedTransaction')) {
          return {
            ...value,
            trackedTrs: [...value.trackedTrs, state],
            joined: joinStates(value.joined, state),
          }
        }
        return {
          ...value,
          trackedTrs: [state],
          joined: state,
        }
      },
    },
    props: {
      decorations(state) {
        return examplePluginKey.getState(state)?.decorationSet
      },
    },
  })
