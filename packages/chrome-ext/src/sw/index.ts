import openDevToolsWindow, { DevToolsPosition } from './openWindow'
import { createMenu, removeMenu } from './contextMenus'
import './listener'

// Listen for keyboard shortcuts
chrome.commands.onCommand.addListener(shortcut => {
  openDevToolsWindow(shortcut as DevToolsPosition)
})

// Create the context menu when installed
chrome.runtime.onInstalled.addListener(() => {
  createMenu()
  openDevToolsWindow('devtools-left')
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

// Create or Remove context menu when config changed
chrome.storage.onChanged.addListener(changes => {
  if (changes.showContextMenus) {
    if (changes.showContextMenus.newValue) createMenu()
    else removeMenu()
  }
})

export {}
