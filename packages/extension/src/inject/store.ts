import { applyDevTools } from 'prosemirror-dev-toolkit'

import { DEFAULT_INJECT_STATE } from '../types'
import type { FoundInstance, InjectState, InjectStatus } from '../types'

import { findEditorViews } from './findEditorViews'
import { send } from './utils'

export let mounted = false
export let state: InjectState = DEFAULT_INJECT_STATE

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
    const views = await findEditorViews(state)
    if (!views) {
      this.updateStatus('error')
    } else if (views.length > 0) {
      let applied = false
      // If any ProseMirror instances are found, apply toolkit to the first one (which doesn't error)
      // since there can be only one toolkit dock at a time
      const instances: FoundInstance[] = views.map((v, idx) => {
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
    this.updateStatus('finished')
  }
}
