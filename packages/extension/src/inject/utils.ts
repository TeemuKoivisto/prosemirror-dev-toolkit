import type { InjectMsgMap, InjectSource, SWMessageMap } from '../types'

export function sleep(ms: number) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true)
    }, ms)
  })
}

export function send<K extends keyof InjectMsgMap>(type: K, data: InjectMsgMap[K]['data']) {
  const msg: InjectSource & {
    type: InjectMsgMap[keyof InjectMsgMap]['type']
    data: InjectMsgMap[keyof InjectMsgMap]['data']
  } = { source: 'pm-dev-tools', origin: 'inject', type, data }
  console.log('msg', msg.data)
  window.postMessage(msg)
}

export async function tryQueryIframe(
  iframe: HTMLIFrameElement,
  selector: string
): Promise<HTMLElement[]> {
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

export function shouldRerun(
  o: SWMessageMap['run-inject']['data'],
  n: SWMessageMap['run-inject']['data']
) {
  const { disabled, devToolsOpts: oldDOpts } = o.global
  const { devToolsOpts: newDOpts } = n.global
  return (
    !disabled &&
    (oldDOpts.devToolsExpanded !== newDOpts.devToolsExpanded ||
      oldDOpts.buttonPosition !== newDOpts.buttonPosition ||
      o.inject.selected.type !== n.inject.selected.type ||
      o.inject.selected.index !== n.inject.selected.index ||
      o.inject.selector !== n.inject.selector)
  )
}
