import { Plugin, PluginKey } from 'prosemirror-state'

export interface PluginState {
  active: boolean
}

export const filterPluginKey = new PluginKey<PluginState>('filter-plugin')

export const filterPlugin = () =>
  new Plugin({
    key: filterPluginKey,
    filterTransaction: (tr, oldState) => {
      return false
    }
  })
