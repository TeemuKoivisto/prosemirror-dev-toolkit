// Resend messages from inject to sw
function handleInjectMsgs(event: MessageEvent<any>) {
  if (
    typeof event.data !== 'object' ||
    !('source' in event.data) ||
    event.data.source !== 'pm-dev-tools'
  ) {
    return
  }
  console.log('hello msg', event)
  pagePort?.postMessage(event.data)
}

// Resend messages from sw to inject and pop-up
function handleSWMsgs(msg: any) {
  if (typeof msg !== 'object' || !('source' in msg) || msg.source !== 'pm-dev-tools') {
    return
  }
  window.postMessage(msg, '*')
  popUpPort?.postMessage(msg)
}

// Resend messages from pop-up to sw
function handlePopUpMsgs(msg: any) {
  if (typeof msg !== 'object' || !('source' in msg) || msg.source !== 'pm-dev-tools') {
    return
  }
  pagePort?.postMessage(msg)
}

window.addEventListener('message', handleInjectMsgs, false)
let pagePort: chrome.runtime.Port | undefined = chrome.runtime.connect({
  name: 'pm-devtools-page'
})
pagePort.onMessage.addListener(handleSWMsgs)
pagePort.onDisconnect.addListener(() => {
  pagePort = undefined
})
let popUpPort: chrome.runtime.Port | undefined = chrome.runtime.connect({
  name: 'pm-devtools-pop-up'
})
popUpPort.onMessage.addListener(handlePopUpMsgs)
popUpPort.onDisconnect.addListener(() => {
  popUpPort = undefined
})

export {}
