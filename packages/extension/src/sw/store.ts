import { get, writable } from 'svelte/store'

export const disabled = writable(false)
export const mounted = writable(false)

async function hydrate() {
  const dis = await chrome.storage.sync.get('disabled')
  disabled.set(!!dis)
}

hydrate()

disabled.subscribe(async disable => {
  chrome.storage.sync.set({ disabled: disable }, () => {
    console.log('Is disabled: ' + disable)
  })
  if (!disable && !get(mounted)) {
    console.log('register')
    mounted.set(true)
  } else if (get(mounted)) {
    console.log('unregister')
    mounted.set(false)
    // chrome.management.setEnabled(
    //   id: string,
    //   enabled: boolean,
    //   callback?: function,
    // )
  }
})

export const storeActions = {
  toggleDisabled() {
    disabled.update(val => !val)
  }
}
