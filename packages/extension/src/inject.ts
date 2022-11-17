import { applyDevTools, removeDevTools } from 'prosemirror-dev-toolkit'
import type { EditorView } from 'prosemirror-view'

import type { InjectMessageMap, InjectState, InjectStatus, SWMessageMap } from './types'

const MAX_ATTEMPTS = 10

let state: InjectState = {
  disabled: false,
  devToolsOpts: {
    devToolsExpanded: false,
    buttonPosition: 'bottom-right'
  },
  inject: {
    instance: 0,
    selector: '.ProseMirror',
    status: 'finding'
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

function getEditorView(el: HTMLElement): Promise<EditorView> {
  const oldFn = el.pmViewDesc?.updateChildren
  const childWithSelectNode = Array.from(el.children).find(
    child => child.pmViewDesc && child.pmViewDesc?.selectNode !== undefined
  )

  setTimeout(() => {
    if (childWithSelectNode !== undefined) {
      childWithSelectNode.pmViewDesc?.selectNode()
      childWithSelectNode.pmViewDesc?.deselectNode()
    }
  }, 0)

  return new Promise((res, rej) => {
    if (childWithSelectNode === undefined || !el.pmViewDesc) {
      console.log('throw error')
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
    setTimeout(() => {
      rej('Unable to trigger childWithSelectNode.pmViewDesc.selectNode')
    }, 0)
  })
}

function sleep(ms: number) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true)
    }, ms)
  })
}

async function findEditorViews(attempts: number): Promise<EditorView[] | undefined> {
  await sleep(1000 * attempts)
  try {
    const {
      disabled,
      inject: { selector }
    } = state
    if (disabled) {
      return []
    }
    const views = await Promise.all(
      Array.from(document.querySelectorAll(selector)).map(el =>
        getEditorView(el as HTMLElement).catch(err => undefined)
      )
    )
    const filtered = views.filter(v => v !== undefined) as EditorView[]
    if (filtered.length === 0 && attempts < MAX_ATTEMPTS) {
      return findEditorViews(attempts + 1)
    }
    return filtered
  } catch (err) {
    console.error(err)
    return undefined
  }
}

function updateStatus(status: InjectStatus) {
  state.inject.status = status
  send('inject-status', status)
}

async function findInstances() {
  updateStatus('finding')
  const views = await findEditorViews(0)
  if (!views) {
    updateStatus('error')
  } else if (views.length > 0) {
    const instances = views.map((v, idx) => {
      if (idx === state.inject.instance) {
        try {
          applyDevTools(v, state.devToolsOpts)
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
  } else {
    updateStatus('no-instances')
  }
}

function send<K extends keyof InjectMessageMap>(type: K, data: InjectMessageMap[K]['data']) {
  window.postMessage({ source: 'pm-dev-tools', origin: 'inject', type, data })
}

async function handleMessages<K extends keyof SWMessageMap>(event: MessageEvent<SWMessageMap[K]>) {
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
      state = msg.data
      if (!state.disabled) {
        findInstances()
      } else {
        removeDevTools()
      }
      break
    case 'rerun-inject':
      removeDevTools()
      findInstances()
      break
  }
}

window.addEventListener('message', handleMessages, false)

export {}
