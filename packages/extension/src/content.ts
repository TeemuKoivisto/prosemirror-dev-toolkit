const source = '@devtools-extension'
const pageSource = '@devtools-page'

let connected = false
let bg: chrome.runtime.Port | undefined
let messages = 0

declare global {
  interface Window {
    devToolsExtensionID?: string
  }
}

function postToPageScript(message: any) {
  window.postMessage(message, '*')
}

function connect() {
  // Connect to the background script
  connected = true
  const name = 'pm-tab'
  // if (window.devToolsExtensionID) {
  //   bg = chrome.runtime.connect(window.devToolsExtensionID, { name })
  // } else {
  // }
  bg = chrome.runtime.connect({ name })
  console.log('connected!', bg)
  // Relay background script messages to the page script
  bg.onMessage.addListener((message: any) => {
    if ('action' in message) {
      if (message.type === 'DISPATCH') {
        postToPageScript({
          type: message.type,
          payload: message.action,
          state: message.state,
          id: message.id,
          source
        })
      } else if (message.type === 'ACTION') {
        postToPageScript({
          type: message.type,
          payload: message.action,
          state: message.state,
          id: message.id,
          source
        })
      } else {
        postToPageScript({
          type: message.type,
          payload: message.action,
          state: message.state,
          id: message.id,
          source
        })
      }
      // } else if ('options' in message) {
      //   injectOptions(message.options);
    } else {
      postToPageScript({
        type: message.type,
        state: message.state,
        id: message.id,
        source
      })
    }
  })

  // bg.onDisconnect.addListener(handleDisconnect)
}

// function handleDisconnect() {
//   window.removeEventListener('message', handleMessages)
//   window.postMessage({ type: 'STOP', failed: true, source }, '*')
//   bg = undefined
// }

function postToBackground(message: any) {
  bg!.postMessage(message)
}

function send(message: any) {
  if (!connected) connect()
  if (message.type === 'INIT_INSTANCE') {
    postToBackground({ name: 'INIT_INSTANCE', instanceId: message.instanceId })
  } else {
    postToBackground({ name: 'RELAY', message })
  }
}

// Resend messages from the page to the background script
function handleMessages(event: any) {
  console.log('handleMessages', event)
  messages += 1
  console.log('messages ', messages)
  // if (!connected) connect()
  // bg!.postMessage(event.data)
  chrome.runtime.sendMessage(event.data)
  chrome.runtime.sendMessage({ type: 'content-msgs', data: messages })
  if ('type' in event && event.type === 'pop-up-open') {
    window.postMessage({ type: 'pop-up-msgs', data: messages }, '*')
  }
  // if (!event || event.source !== window || typeof event.data !== 'object') {
  //   return
  // }
  // const message = event.data
  // if (message.source !== pageSource) return
  // if (message.type === 'DISCONNECT') {
  //   if (bg) {
  //     bg.disconnect()
  //     connected = false
  //   }
  //   return
  // }
  // send(message)
}

// window.addEventListener('message', handleMessages, false)
window.addEventListener('message', handleMessages)

export {}
