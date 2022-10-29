import { applyDevTools } from 'prosemirror-dev-toolkit'
import type { EditorView } from 'prosemirror-view'

import type { InjectMessages } from './types/messages'

let timeout: ReturnType<typeof setTimeout>,
  attempts = 0,
  selector = '.ProseMirror',
  pmEl: HTMLElement | undefined

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

  if (childWithSelectNode === undefined) {
    console.error(
      'Failed to find a ProseMirror child NodeViewDesc with selectNode function (which is strange)'
    )
  } else {
    childWithSelectNode.pmViewDesc?.selectNode()
    childWithSelectNode.pmViewDesc?.deselectNode()
  }
  return new Promise((res, rej) => {
    if (!el.pmViewDesc) return
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
  pmEl = await queryDOM(selector)
  if (!pmEl && attempts < 5) {
    findProsemirror()
  } else if (pmEl) {
    console.log('FOUND PROSEMIRROR')
    const view = await getEditorView(pmEl)
    applyDevTools(view, { buttonPosition: 'bottom-right' })
    send('found_instances', document.querySelectorAll(selector).length)
  }
}

function send<K extends keyof InjectMessages>(type: K, data: InjectMessages[K]) {
  window.postMessage({ source: 'pm-dev-tools', type, data })
}

window.addEventListener('load', () => {
  findProsemirror()
})

export {}
