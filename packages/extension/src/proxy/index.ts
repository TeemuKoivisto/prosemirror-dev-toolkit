import { PAGE_PORT, POP_UP_PORT } from '../types/consts'

/**
 * Resends messages from inject to sw
 * @param event
 * @returns
 */
function handleInjectMsgs(event: MessageEvent<any>) {
  if (
    typeof event.data !== 'object' ||
    !('source' in event.data) ||
    event.data.source !== 'pm-dev-tools'
  ) {
    return
  }
  pagePort?.postMessage(event.data)
}

/**
 * Resends messages from sw to inject and pop-up
 * @param msg
 * @returns
 */
function handleSWMsgs(msg: any) {
  if (typeof msg !== 'object' || !('source' in msg) || msg.source !== 'pm-dev-tools') {
    return
  }
  window.postMessage(msg, '*')
  popUpPort?.postMessage(msg)
}

/**
 * Resends messages from pop-up to sw
 * @param msg
 * @returns
 */
function handlePopUpMsgs(msg: any) {
  if (typeof msg !== 'object' || !('source' in msg) || msg.source !== 'pm-dev-tools') {
    return
  }
  pagePort?.postMessage(msg)
}

window.addEventListener('message', handleInjectMsgs, true)
let pagePort: chrome.runtime.Port | undefined = chrome.runtime.connect({
  name: PAGE_PORT
})
pagePort.onMessage.addListener(handleSWMsgs)
pagePort.onDisconnect.addListener(() => {
  pagePort = undefined
})
let popUpPort: chrome.runtime.Port | undefined = chrome.runtime.connect({
  name: POP_UP_PORT
})
popUpPort.onMessage.addListener(handlePopUpMsgs)
popUpPort.onDisconnect.addListener(() => {
  popUpPort = undefined
})
