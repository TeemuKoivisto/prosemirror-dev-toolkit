import App from './App.svelte'

const el = document.querySelector('#pm-dev-toolkit-extension-root')
if (el) {
  new App({ target: el })
}

export {}
