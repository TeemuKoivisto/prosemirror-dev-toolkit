import { get } from 'svelte/store'

import openDevToolsWindow, { DevToolsPosition } from './openWindow'
import { createMenu, removeMenu } from './contextMenus'
import { listener } from './listener'
import { disabled, storeActions } from './store'
import { send } from './send'

// Listen for keyboard shortcuts
chrome.commands.onCommand.addListener(shortcut => {
  openDevToolsWindow(shortcut as DevToolsPosition)
})

// Create the context menu when installed
chrome.runtime.onInstalled.addListener(() => {
  createMenu()
  // openDevToolsWindow('devtools-left')
})

// chrome.management.onEnabled.addListener(
//   callback: function,
// )

// Create or Remove context menu when config changed
chrome.storage.onChanged.addListener(changes => {
  if (changes.showContextMenus) {
    if (changes.showContextMenus.newValue) createMenu()
    else removeMenu()
  }
})

chrome.scripting.registerContentScripts([
  {
    id: 'inject',
    matches: ['<all_urls>'],
    js: ['inject.js'],
    runAt: 'document_end',
    world: 'MAIN'
  }
])

const ports: Record<number, any> = {}

chrome.runtime.onMessage.addListener(listener)
chrome.runtime.onConnect.addListener(function (port) {
  console.log('install on port', port)
  if (!port.sender?.tab?.id) return
  const tab = port.sender.tab.id
  const name = 'pm-devtools-sw'

  if (!ports[tab]) {
    ports[tab] = {
      devtools: null,
      'content-script': null
    }
  }
  ports[tab][name] = port
  port.onMessage.addListener(listenPort)
})

function listenPort(msg: any, port: chrome.runtime.Port) {
  console.log('received msg from port!', msg)
  switch (msg.type) {
    case 'init-inject2':
      port.postMessage({
        source: 'pm-dev-tools',
        origin: 'sw',
        type: 'init-inject',
        data: {
          selector: '.ProseMirror',
          disabled: false
        }
      })
  }
}

export {}
