import { listenToConnections } from './ports'

chrome.scripting.registerContentScripts([
  {
    id: 'inject',
    matches: ['<all_urls>'],
    js: ['inject.js'],
    runAt: 'document_end',
    world: 'MAIN'
  }
])
chrome.runtime.onConnect.addListener(listenToConnections)

export {}
