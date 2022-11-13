import { applyDevTools, removeDevTools } from 'prosemirror-dev-toolkit'
import type { EditorView } from 'prosemirror-view'

import type { InjectMessageMap, InjectState, SWMessageMap } from './types'

const MAX_ATTEMPTS = 10

let injectData: InjectState = {
  disabled: false,
  selector: '.ProseMirror',
  devToolsOpts: {}
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

async function findProsemirror(attempts: number) {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      const { disabled, selector } = injectData
      if (disabled) {
        // console.log('DISABLED')
        return resolve(undefined)
      }
      // console.log('FINDING')
      const pmEl = document.querySelector(selector)
      if (!pmEl && attempts < MAX_ATTEMPTS) {
        return findProsemirror(attempts + 1)
      } else if (pmEl instanceof HTMLElement) {
        try {
          const view = await getEditorView(pmEl)
          applyDevTools(view, { buttonPosition: 'bottom-right' })
        } catch (err) {
          console.error(err)
        }
        const instances = Array.from(document.querySelectorAll(selector)).map(el => ({
          size: el.innerHTML.length,
          element: el.outerHTML.slice(0, 70)
        }))
        send('inject-found-instances', {
          instances
        })
      }
      resolve(pmEl)
    }, 1000 * attempts)
  })
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
    case 'inject-data':
      injectData = msg.data
      if (!injectData.disabled) {
        findProsemirror(0)
      } else {
        removeDevTools()
      }
      break
    case 'rerun-inject':
      removeDevTools()
      findProsemirror(0)
      break
  }
}

window.addEventListener('message', handleMessages, false)

export {}
