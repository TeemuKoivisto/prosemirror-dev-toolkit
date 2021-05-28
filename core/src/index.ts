import { EditorView } from 'prosemirror-view'
import DevTools from './DevTools.svelte'

const DEVTOOLS_CLASS_NAME = '__prosemirror-dev-toolkit__'

function createOrFindPlace() {
  let place: HTMLElement | null = document.querySelector(`.${DEVTOOLS_CLASS_NAME}`)

  if (!place) {
    place = document.createElement('div')
    place.className = DEVTOOLS_CLASS_NAME
    document.body.appendChild(place)
  }

  return place
}

export function applyDevTools(view: EditorView) {
  const place = createOrFindPlace()
  new DevTools({
    target: place,
    props: {
      view
    }
  })
}
