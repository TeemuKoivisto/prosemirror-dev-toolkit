import { applyDevTools } from 'prosemirror-dev-toolkit'

import { findAllEditorViews } from './findEditorViews'
import { send } from './utils'

import { DEFAULT_INJECT_STATE } from '../types'
import type { InjectState, InjectStatus } from '../types'

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
        let status = 'found'
        if (
          'data' in evt.result &&
          !applied &&
          selected.type === evt.data.type &&
          selected.index === evt.data.index
        ) {
          try {
            applyDevTools(evt.result.data, state.global.devToolsOpts)
            applied = true
            status = 'apply-successfull'
          } catch (err: any) {
            console.error(err)
            err = err.toString()
            status = 'apply-failed'
          }
        }
        const html = 'data' in evt.result ? evt.result.data.dom.innerHTML : ''
        send('inject-event', {
          type: 'view-result',
          data: {
            type: evt.data.type,
            index: evt.data.index,
            iframeIndex: 0,
            size: html.length,
            element: html.slice(0, 100),
            status,
            err
          }
        })
      } else if (evt.type !== 'abort') {
        send('inject-event', evt)
      }
    }
    this.updateStatus('finished')
  }
}
