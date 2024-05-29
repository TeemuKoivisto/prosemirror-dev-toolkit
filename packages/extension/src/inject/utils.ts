import type { InjectMessageMap, InjectState } from '../types'

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

export function shouldRerun(oldState: InjectState, newState: InjectState) {
  return (
    !newState.disabled &&
    (oldState.devToolsOpts.devToolsExpanded !== newState.devToolsOpts.devToolsExpanded ||
      oldState.devToolsOpts.buttonPosition !== newState.devToolsOpts.buttonPosition ||
      oldState.inject.instance !== newState.inject.instance ||
      oldState.inject.selector !== newState.inject.selector)
  )
}
