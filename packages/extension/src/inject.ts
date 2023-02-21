import { applyDevTools, removeDevTools } from 'prosemirror-dev-toolkit'
import type { EditorView } from 'prosemirror-view'

import type { InjectMessageMap, InjectState, InjectStatus, SWMessageMap } from './types'

const MAX_ATTEMPTS = 10

let mounted = false
let state: InjectState = {
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
  }, 1)

  return new Promise((res, rej) => {
    if (childWithSelectNode === undefined || !el.pmViewDesc) {
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
    }, 1000)
  })
}

function sleep(ms: number) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true)
    }, ms)
  })
}

async function tryQueryIframe(iframe: HTMLIFrameElement, selector: string) {
  try {
    const doc = iframe.contentDocument
    if (!doc) return []
    let tries = 0
    while (doc?.readyState === 'loading' || tries < 5) {
      await sleep(500)
      tries += 1
    }
    return Array.from(doc.querySelectorAll(selector) || [])
  } catch (err) {
    // Probably "Blocked a frame with origin from accessing a cross-origin frame." error
    return []
  }
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
        getEditorView(el as HTMLElement).catch(err => {
          return undefined
        })
      )
    )
    const iframes = (
      await Promise.all(
        Array.from(document.querySelectorAll('iframe')).map(iframe =>
          tryQueryIframe(iframe, selector)
        )
      )
    ).flat()
    const iframeViews = await Promise.all(
      iframes.map(el =>
        getEditorView(el as HTMLElement).catch(err => {
          return undefined
        })
      )
    )
    const filtered = views.concat(iframeViews).filter(v => v !== undefined) as EditorView[]
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

function shouldRerun(oldState: InjectState, newState: InjectState) {
  return (
    !newState.disabled &&
    (oldState.devToolsOpts.devToolsExpanded !== newState.devToolsOpts.devToolsExpanded ||
      oldState.devToolsOpts.buttonPosition !== newState.devToolsOpts.buttonPosition ||
      oldState.inject.instance !== newState.inject.instance ||
      oldState.inject.selector !== newState.inject.selector)
  )
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
  if (event.data.origin !== 'sw') {
    return
  }
  // console.log('RECEIVED IN INJECT', event.data)
  const msg = event.data
  switch (msg.type) {
    case 'inject-state':
      if ((!mounted && !msg.data.disabled) || shouldRerun(state, msg.data)) {
        findInstances()
        mounted = true
      } else if (mounted && msg.data.disabled) {
        removeDevTools()
        mounted = false
      }
      state = msg.data
      break
    case 'rerun-inject':
      removeDevTools()
      findInstances()
      break
  }
}

window.addEventListener('message', handleMessages, false)

export {}
