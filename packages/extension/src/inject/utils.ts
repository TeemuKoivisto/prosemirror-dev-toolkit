import type { EditorView } from 'prosemirror-view'

import type { InjectMessageMap, InjectState, InjectStatus, SWMessageMap } from '../types'

export function sleep(ms: number) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true)
    }, ms)
  })
}

export function send<K extends keyof InjectMessageMap>(type: K, data: InjectMessageMap[K]['data']) {
  window.postMessage({ source: 'pm-dev-tools', origin: 'inject', type, data })
}

export async function tryQueryIframe(iframe: HTMLIFrameElement, selector: string) {
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

export function getEditorView(el: HTMLElement): Promise<EditorView> {
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

export function shouldRerun(oldState: InjectState, newState: InjectState) {
  return (
    !newState.disabled &&
    (oldState.devToolsOpts.devToolsExpanded !== newState.devToolsOpts.devToolsExpanded ||
      oldState.devToolsOpts.buttonPosition !== newState.devToolsOpts.buttonPosition ||
      oldState.inject.instance !== newState.inject.instance ||
      oldState.inject.selector !== newState.inject.selector)
  )
}
