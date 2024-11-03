import { listenToConnections } from './run'

const id = 'prosemirror-dev-toolkit-inject'

function register() {
  return chrome.scripting.registerContentScripts([
    {
      id,
      allFrames: true,
      matches: ['<all_urls>'],
      js: ['inject.js'],
      runAt: 'document_start',
      world: 'MAIN'
    }
  ])
}

try {
  register()
} catch (err: any) {
  // When developing the extension, the old inject script might conflict with the new one
  if (err.toString().includes('Duplicate script ID')) {
    chrome.scripting
      .unregisterContentScripts({
        ids: [id]
      })
      .then(() => register())
  }
}
chrome.runtime.onConnect.addListener(listenToConnections)

export {}
