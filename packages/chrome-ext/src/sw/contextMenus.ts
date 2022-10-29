import openDevToolsWindow, { DevToolsPosition } from './openWindow'

export function createMenu() {
  const menus = [
    { id: 'pm-devtools-left', title: 'To left' },
    { id: 'pm-devtools-right', title: 'To right' },
    { id: 'pm-devtools-bottom', title: 'To bottom' },
    {
      id: 'pm-devtools-panel',
      title: 'Open in a panel (enable in browser settings)'
    },
    { id: 'pm-devtools-remote', title: 'Open Remote DevTools' }
  ]

  const shortcuts: { [commandName: string]: string | undefined } = {}
  chrome.commands.getAll(commands => {
    commands.forEach(({ name, shortcut }) => {
      shortcuts[name!] = shortcut
    })

    menus.forEach(({ id, title }) => {
      chrome.contextMenus.create({
        id: id,
        title: title + (shortcuts[id] ? ' (' + shortcuts[id] + ')' : ''),
        contexts: ['all']
      })
    })
  })
}

export function removeMenu() {
  chrome.contextMenus.removeAll()
}

// chrome.contextMenus.onClicked.addListener(({ menuItemId }) => {
//   openDevToolsWindow(menuItemId as DevToolsPosition);
// });
