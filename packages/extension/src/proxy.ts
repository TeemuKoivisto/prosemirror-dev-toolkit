// Resend messages from inject to sw
function handleInjectMsgs(event: MessageEvent<any>) {
  if (
    typeof event.data !== 'object' ||
    !('source' in event.data) ||
    event.data.source !== 'pm-dev-tools'
  ) {
    return
  }
  console.log('inject msg!', event.data)
  pagePort.postMessage(event.data)
}

// Resend messages from sw to inject and pop-up
function handleSWMsgs(msg: any) {
  if (typeof msg !== 'object' || !('source' in msg) || msg.source !== 'pm-dev-tools') {
    return
  }
  console.log('sw msg!', msg)
  window.postMessage(msg, '*')
  popUpPort.postMessage(msg)
}

// Resend messages from pop-up to sw
function handlePopUpMsgs(msg: any) {
  if (typeof msg !== 'object' || !('source' in msg) || msg.source !== 'pm-dev-tools') {
    return
  }
  console.log('pop-up msg!', msg)
  pagePort.postMessage(msg)
}

window.addEventListener('message', handleInjectMsgs, false)
const pagePort = chrome.runtime.connect({
  name: 'pm-devtools-page'
})
pagePort.onMessage.addListener(handleSWMsgs)
const popUpPort = chrome.runtime.connect({
  name: 'pm-devtools-pop-up'
})
popUpPort.onMessage.addListener(handlePopUpMsgs)

// port.onDisconnect.addListener(handleDisconnect);

export {}
