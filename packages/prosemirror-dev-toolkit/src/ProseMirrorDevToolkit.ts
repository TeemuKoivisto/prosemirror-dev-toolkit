import { mount, unmount } from 'svelte'
import DevTools from './components/DevTools.svelte'

import type { EditorView } from 'prosemirror-view'
import type { DevToolsOpts } from './types'

// Inspired by https://www.colorglare.com/svelte-components-as-web-components-b400d1253504
// Using a web component allows toolkit to encapsulate its DOM and CSS styles without affecting
// the site or being affected by its global stylesheets
export class ProseMirrorDevToolkit extends HTMLElement {
  private component?: ReturnType<typeof mount>

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })

    this.addEventListener('init-dev-toolkit', (event: Event) => {
      const {
        detail: { view, opts }
      } = event as CustomEvent<{ view: EditorView; opts: DevToolsOpts }>
      console.log('CREATE')
      this.component = mount(DevTools, {
        target: shadowRoot,
        props: {
          view,
          ...opts
        }
      })
    })
  }

  disconnectedCallback(): void {
    this.component && unmount(this.component)
  }
}
