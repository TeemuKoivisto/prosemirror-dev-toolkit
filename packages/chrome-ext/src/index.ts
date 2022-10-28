document.querySelector('#mybutton')?.addEventListener('click', async () => {
  const tab = await chrome.tabs.getCurrent()
  const sending = await chrome.runtime.sendMessage('', {
    el: document.querySelector('.ProseMirror'),
    tab
  })
})

export {}
