import { applyDevTools } from 'prosemirror-dev-toolkit'

import { DEFAULT_INJECT_STATE } from '../types'
import type { InjectState, InjectStatus } from '../types'

import { findAllEditorViews } from './findEditorViews'
import { send } from './utils'

export let mounted = false
export let state: InjectState = DEFAULT_INJECT_STATE
export let controller = new AbortController()

export const injectActions = {
  setMounted(val: boolean) {
    mounted = val
  },
  setState(data: InjectState) {
    state = data
  },
  updateStatus(status: InjectStatus) {
    state.data.status = status
    send('inject-status', status)
  },
  abort() {
    controller.abort()
    controller = new AbortController()
    this.updateStatus('aborted')
  },
  async findInstances() {
    this.updateStatus('finding')
    let applied = false
    for await (const evt of findAllEditorViews(state, controller)) {
      if (evt.type === 'found-view') {
        const { selected } = state.inject
        const err = 'err' in evt.result ? evt.result.err : ''
        if (
          'data' in evt.result &&
          !applied &&
          selected.type === evt.data.type &&
          selected.index === evt.data.index
        ) {
          try {
            applyDevTools(evt.result.data, state.global.devToolsOpts)
            applied = true
          } catch (err: any) {
            console.error(err)
            err = err.toString()
          }
        }
        const base = {
          index: evt.data.index,
          size: 'data' in evt.result ? evt.result.data.dom.innerHTML.length : 0,
          element: 'data' in evt.result ? evt.result.data.dom.innerHTML.slice(0, 100) : '',
          err
        }
        if (evt.data.type === 'view') {
          send('inject-event', {
            type: 'view-result',
            data: base
          })
        } else {
          send('inject-event', {
            type: 'iframe-result',
            data: { ...base, iframeIndex: 0 }
          })
        }
      } else {
        send('inject-event', evt)
      }
    }
    this.updateStatus('finished')
  }
}
