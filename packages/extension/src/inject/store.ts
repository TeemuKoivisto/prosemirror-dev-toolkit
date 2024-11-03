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
    // send('inject-status', status)
  },
  abort() {
    controller.abort()
    controller = new AbortController()
    this.updateStatus('stopped')
  },
  async findInstances() {
    let applied = false
    for await (const evt of findAllEditorViews(state, controller)) {
      if (evt.type === 'found-view') {
        const { result, data } = evt
        const err = 'err' in result ? result.err : ''
        const id =
          data.type === 'view' ? `view-${data.index}` : `iframe-${data.iframeIndex}-${data.index}`
        let status = 'found'
        if ('data' in result && !applied && state.inject.selectedId === id) {
          try {
            applyDevTools(result.data, state.global.devToolsOpts)
            applied = true
            status = 'applied'
          } catch (err: any) {
            console.error(err)
            err = err.toString()
            status = 'apply-failed'
          }
        }
        const html = 'data' in result ? result.data.dom.innerHTML : ''
        send({
          type: 'view-result',
          data: {
            type: data.type,
            index: data.index,
            iframeIndex: data.type === 'view' ? 0 : data.iframeIndex,
            size: html.length,
            element: html.slice(0, 100),
            status,
            err
          }
        })
      } else if (evt.type !== 'abort') {
        // @TODO set state based on event type
        send(evt)
      }
    }
    this.updateStatus('finished')
  }
}
