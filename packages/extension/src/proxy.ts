import { InjectMessages, SWMessages } from './types'

// Resend messages from inject.ts to sw.ts
function handleInjectMsgs<K extends keyof InjectMessages>(
  event: MessageEvent<{ source: 'pm-dev-tools'; type: K; data: InjectMessages[K] }>
) {
  if (
    typeof event.data !== 'object' ||
    !('source' in event.data) ||
    event.data.source !== 'pm-dev-tools'
  )
    return
  chrome.runtime.sendMessage(event.data)
  port.postMessage(event.data)
}

// Resend messages from sw.ts to inject.ts
function handleSWMsgs(msg: SWMessages) {
  if (typeof msg !== 'object' || !('source' in msg) || msg.source !== 'pm-dev-tools') return
  window.postMessage(msg, '*')
}

chrome.runtime.onMessage.addListener(handleSWMsgs)
window.addEventListener('message', handleInjectMsgs, false)
const port = chrome.runtime.connect({
  name: 'pm-devtools-sw'
})
port.onMessage.addListener(handleSWMsgs)
// port.onDisconnect.addListener(handleDisconnect);

// window.addEventListener('load', () => {
//   chrome.runtime.sendMessage({
//     source: 'pm-dev-tools',
//     type: 'init-proxy',
//     data: true,
//     origin: 'proxy'
//   })
//   window.postMessage(
//     { source: 'pm-dev-tools', type: 'init-proxy', data: true, origin: 'proxy' },
//     '*'
//   )
// })

export {}
