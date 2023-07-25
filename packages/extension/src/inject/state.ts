import { applyDevTools } from 'prosemirror-dev-toolkit'

import type { InjectState, InjectStatus } from '../types'

import { findEditorViews } from './findEditorViews'
import { send } from './utils'

export let mounted = false
export let state: InjectState = {
  disabled: false,
  devToolsOpts: {
    devToolsExpanded: false,
    buttonPosition: 'bottom-right'
  },
  inject: {
    instance: 0,
    selector: '.ProseMirror',
    status: 'finding',
    instances: []
  }
}

export const injectActions = {
  setMounted(val: boolean) {
    mounted = val
  },
  setState(val: InjectState) {
    state = val
  },
  updateStatus(status: InjectStatus) {
    state.inject.status = status
    send('inject-status', status)
  },
  async findInstances() {
    this.updateStatus('finding')
    const views = await findEditorViews(0, state)
    if (!views) {
      this.updateStatus('error')
    } else if (views.length > 0) {
      let applied = false
      const instances = views.map((v, idx) => {
        if (idx === state.inject.instance || (!applied && idx === views.length - 1)) {
          try {
            applyDevTools(v, state.devToolsOpts)
            applied = true
          } catch (err) {
            console.error(err)
          }
        }
        return {
          size: v.dom.innerHTML.length,
          element: v.dom.innerHTML.slice(0, 100)
        }
      })
      send('inject-found-instances', { instances })
    }
  }
}
