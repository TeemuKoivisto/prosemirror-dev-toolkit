import App from './App.svelte'

const el = document.querySelector('.__prosemirror-dev-toolkit-extension__')
if (el) {
  new App({ target: el })
}

export {}
