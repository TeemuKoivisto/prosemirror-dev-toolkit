let isRunning = false

const getCurrentTab = async () => {
  const queryOptions = { active: true, lastFocusedWindow: true }
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  const [tab] = await chrome.tabs.query(queryOptions)

  return tab
}

const isCSPDisabled = async () => {
  const rules = await chrome.declarativeNetRequest.getSessionRules(),
    urls = rules.map(rule => rule.condition.urlFilter),
    { url } = await getCurrentTab()

  return urls.some(item => item === url)
}

const updateUI = async () => {
  // const isDisabled = await isCSPDisabled(),
  //   iconColor = isDisabled ? '' : '_gray',
  //   title = isDisabled ? 'is' : 'is not'
  // chrome.action.setIcon({ path: `icon/cola${iconColor}.png` })
  // chrome.action.setTitle({ title: `The extension ${title} working` })
}

const disableCSP = async (id: number) => {
  if (isRunning) return
  isRunning = true

  const addRules: { id: number; action: any; condition: any }[] = [],
    removeRuleIds: number[] = [],
    { url } = await getCurrentTab()

  if (!(await isCSPDisabled())) {
    addRules.push({
      id,
      action: {
        type: 'modifyHeaders',
        responseHeaders: [{ header: 'content-security-policy', operation: 'set', value: '' }]
      },
      condition: { urlFilter: url, resourceTypes: ['main_frame', 'sub_frame'] }
    })

    chrome.browsingData.remove({}, { serviceWorkers: true }, () => {})
  } else {
    const rules = await chrome.declarativeNetRequest.getSessionRules()

    rules.forEach(rule => {
      if (rule.condition.urlFilter === url) {
        removeRuleIds.push(rule.id)
      }
    })
  }

  await chrome.declarativeNetRequest.updateSessionRules({ addRules, removeRuleIds })

  await updateUI()
  isRunning = false
}

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
  // disableCSP(tab?.id || 1)
  return undefined
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

export {}
