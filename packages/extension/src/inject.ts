import { applyDevTools, removeDevTools } from 'prosemirror-dev-toolkit'
import type { EditorView } from 'prosemirror-view'

import type { InjectMessages, SWMessageMap } from './types'

const MAX_ATTEMPTS = 10

let timeout: ReturnType<typeof setTimeout>,
  attempts = 0,
  disabled = false,
  selector = '.ProseMirror'

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

function queryDOM(selector: string): Promise<HTMLElement | undefined> {
  return new Promise((resolve, reject) => {
    timeout = setTimeout(() => {
      const el = document.querySelector(selector)
      if (el instanceof HTMLElement) {
        resolve(el)
      } else {
        attempts += 1
        resolve(undefined)
      }
    }, 1000 * attempts)
  })
}

async function findProsemirror() {
  if (disabled) {
    console.log('DISABLED')
    return
  }
  console.log('FINDING')
  const pmEl = await queryDOM(selector)
  if (!pmEl && attempts < MAX_ATTEMPTS) {
    findProsemirror()
  } else if (pmEl) {
    try {
      const view = await getEditorView(pmEl)
      applyDevTools(view, { buttonPosition: 'bottom-right' })
    } catch (err) {
      console.error(err)
    }
    const editors = Array.from(document.querySelectorAll(selector)).map(el => ({
      size: el.innerHTML.length,
      classes: Array.from(el.classList)
    }))
    send('inject-found-instances', editors)
  }
}

function send<K extends keyof InjectMessages>(type: K, data: InjectMessages[K]) {
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
  console.log('RECEIVED IN INJECT', event)
  const msg = event.data
  switch (msg.type) {
    case 'inject-data':
      console.log('RECEIVED INJECT DATA', msg.data)
      disabled = msg.data.disabled
      selector = msg.data.selector
      if (!disabled) {
        findProsemirror()
      } else {
        removeDevTools()
      }
      break
  }
}

window.addEventListener('message', handleMessages, false)

export {}
