import { applyDevTools, removeDevTools } from 'prosemirror-dev-toolkit'
import type { EditorView } from 'prosemirror-view'

import type { InjectMessageMap, InjectState, InjectStatus, SWMessageMap } from './types'

const MAX_ATTEMPTS = 10

let injectData: InjectState = {
  disabled: false,
  selector: '.ProseMirror',
  injectStatus: 'finding',
  devToolsOpts: {
    devToolsExpanded: false,
    buttonPosition: 'bottom-right'
  }
}

declare global {
  interface Element {
    pmViewDesc?: {
      updateChildren: (view: EditorView, pos: number) => void
      selectNode: () => void
      deselectNode: () => void
    }
  }
}

function getEditorView(el: HTMLElement): Promise<any> {
  const oldFn = el.pmViewDesc?.updateChildren
  const childWithSelectNode = Array.from(el.children).find(
    child => child.pmViewDesc && child.pmViewDesc?.selectNode !== undefined
  )
  let found = false

  if (childWithSelectNode !== undefined) {
    found = true
    childWithSelectNode.pmViewDesc?.selectNode()
    childWithSelectNode.pmViewDesc?.deselectNode()
  }
  return new Promise((res, rej) => {
    if (!found || !el.pmViewDesc) {
      return rej(
        'Failed to find a ProseMirror child NodeViewDesc with selectNode function (which is strange)'
      )
    }
    el.pmViewDesc.updateChildren = (view: EditorView, pos: number) => {
      if (el.pmViewDesc && oldFn) el.pmViewDesc.updateChildren = oldFn
      res(view)
      // @ts-ignore
      return Function.prototype.bind.apply(oldFn, view, pos)
    }
  })
}

function findProsemirror(attempts: number) {
  return new Promise<HTMLElement | undefined>((resolve, reject) => {
    try {
      setTimeout(async () => {
        const { disabled, selector } = injectData
        if (disabled) {
          // console.log('DISABLED')
          updateStatus('no-instances')
          return resolve(undefined)
        }
        // console.log('FINDING')
        const pmEl = document.querySelector(selector) as HTMLElement | null
        if (!pmEl && attempts < MAX_ATTEMPTS) {
          return findProsemirror(attempts + 1)
        } else if (pmEl instanceof HTMLElement) {
          try {
            const view = await getEditorView(pmEl)
            applyDevTools(view, injectData.devToolsOpts)
          } catch (err) {
            console.error(err)
          }
          const instances = Array.from(document.querySelectorAll(selector)).map(el => ({
            size: el.innerHTML.length,
            element: el.innerHTML.slice(0, 100)
          }))
          send('inject-found-instances', {
            instances
          })
        } else if (!pmEl) {
          updateStatus('no-instances')
        }
        resolve(pmEl || undefined)
      }, 1000 * attempts)
    } catch (err) {
      console.error(err)
      updateStatus('error')
      resolve(undefined)
    }
  })
}

function updateStatus(status: InjectStatus) {
  injectData.injectStatus = status
  send('inject-status', status)
}

function send<K extends keyof InjectMessageMap>(type: K, data: InjectMessageMap[K]['data']) {
  window.postMessage({ source: 'pm-dev-tools', origin: 'inject', type, data })
}

function handleMessages<K extends keyof SWMessageMap>(event: MessageEvent<SWMessageMap[K]>) {
  if (
    typeof event.data !== 'object' ||
    !('source' in event.data) ||
    event.data.source !== 'pm-dev-tools'
  ) {
    return
  }
  // console.log('RECEIVED IN INJECT', event)
  const msg = event.data
  switch (msg.type) {
    case 'inject-state':
      injectData = msg.data
      if (!injectData.disabled) {
        updateStatus('finding')
        findProsemirror(0)
      } else {
        removeDevTools()
      }
      break
    case 'rerun-inject':
      removeDevTools()
      updateStatus('finding')
      findProsemirror(0)
      break
  }
}

window.addEventListener('message', handleMessages, false)

export {}
