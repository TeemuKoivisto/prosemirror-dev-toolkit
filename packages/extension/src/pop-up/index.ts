import App from './App.svelte'
import { init } from './store'

init()

const el = document.querySelector('.__prosemirror-dev-toolkit-extension__')
if (el) {
  new App({ target: el })
}

export {}
