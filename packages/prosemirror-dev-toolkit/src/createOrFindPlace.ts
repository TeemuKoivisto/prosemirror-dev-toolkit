const DEVTOOLS_CSS_CLASS = '__prosemirror-dev-toolkit__'

export function createOrFindPlace() {
  let place: HTMLElement | null = document.querySelector(`.${DEVTOOLS_CSS_CLASS}`)

  if (!place) {
    place = document.createElement('div')
    place.className = DEVTOOLS_CSS_CLASS
    document.body.appendChild(place)
  }

  return place
}
