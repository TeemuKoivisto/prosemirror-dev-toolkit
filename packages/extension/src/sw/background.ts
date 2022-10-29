async function toggleBadge(tab: chrome.tabs.Tab) {
  const prevState = await chrome.action.getBadgeText({ tabId: tab.id })
  const nextState = prevState === 'ON' ? 'OFF' : 'ON'
  // Set the action badge to the next state
  await chrome.action.setBadgeText({
    tabId: tab.id,
    text: nextState
  })
  // if (nextState === 'ON') {
  //   // Insert the CSS file when the user turns the extension on
  //   await chrome.scripting.insertCSS({
  //     files: ['focus-mode.css'],
  //     target: { tabId: tab.id || 0 }
  //   })
  // } else if (nextState === 'OFF') {
  //   // Remove the CSS file when the user turns the extension off
  //   await chrome.scripting.removeCSS({
  //     files: ['focus-mode.css'],
  //     target: { tabId: tab.id || 0 }
  //   })
  // }
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: 'OFF'
  })
})

chrome.runtime.onMessage.addListener((ev, sender, sendResponse) => {
  const { el, tab } = ev
  console.log(`A content script sent a message: ${tab}`)
  console.log(`A content script sent a message: ${ev.tabId}`)
  toggleBadge(tab || { id: undefined })
  return undefined
})

chrome.runtime.onConnect.addListener(port => {
  if (port.sender.url == chrome.runtime.getURL('/devtools/panel.html')) {
    port.onMessage.addListener(handleToolsMessage)
  } else {
    // This is not an expected connection, so we just log an error and close it
    console.error('Unexpected connection. Port ', port)
    port.disconnect()
  }
})

function handleToolsMessage(msg: any, port: chrome.runtime.Port) {
  switch (msg.type) {
    // 'init' and 'reload' messages do not need to be delivered to content script
    case 'init':
      setup(msg.tabId, port, msg.profilerEnabled)
      break
    case 'reload':
      chrome.tabs.reload(msg.tabId, { bypassCache: true })
      break
    default:
      chrome.tabs.sendMessage(msg.tabId, msg)
      break
  }
}

function setup(tabId, port, profilerEnabled) {
  chrome.tabs.executeScript(tabId, {
    code: profilerEnabled
      ? `window.sessionStorage.SvelteDevToolsProfilerEnabled = "true"`
      : 'delete window.sessionStorage.SvelteDevToolsProfilerEnabled',
    runAt: 'document_start'
  })

  toolsPorts.set(tabId, port)

  port.onDisconnect.addListener(() => {
    toolsPorts.delete(tabId)
    chrome.tabs.onUpdated.removeListener(attachScript)
    // Inform content script that it background closed and it needs to clean up
    chrome.tabs.sendMessage(tabId, {
      type: 'clear',
      tabId: tabId
    })
  })

  chrome.tabs.onUpdated.addListener(attachScript)
}

chrome.scripting.registerContentScripts([
  {
    id: 'inject',
    matches: ['<all_urls>'],
    js: ['inject.js'],
    runAt: 'document_end',
    world: 'MAIN'
  }
])

export {}
