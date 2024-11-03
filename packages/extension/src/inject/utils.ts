import type { InjectMsgMap, InjectOptions, InjectSource, SWMessageMap } from '../types'

export function sleep(ms: number) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true)
    }, ms)
  })
}

// type SendArgs = {
//   [K in keyof InjectMsgMap]: [type: K, options?: InjectMsgMap[K]['data']]
// }[keyof InjectMsgMap]

// export function send(...[type, data]: ToggleModalArgs) {
export function send<K extends keyof InjectMsgMap>(type: K, data: InjectMsgMap[K]['data']) {
  const msg: InjectSource & {
    type: InjectMsgMap[keyof InjectMsgMap]['type']
    data: InjectMsgMap[keyof InjectMsgMap]['data']
  } = { source: 'pm-dev-tools', origin: 'inject', type, data }
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
  return true
  // const { disabled, devToolsOpts: oldDOpts } = o.global
  // const { selector: oldSelector } = o.inject
  // const { devToolsOpts: newDOpts } = n.global
  // return (
  //   !disabled &&
  //   (oldDOpts.devToolsExpanded !== newDOpts.devToolsExpanded ||
  //     oldDOpts.buttonPosition !== newDOpts.buttonPosition ||
  //     // o.inject.instance !== n.inject.instance ||
  //     o.inject.selector !== n.inject.selector)
  // )
}
