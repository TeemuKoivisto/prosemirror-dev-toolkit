import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { schema } from 'prosemirror-schema-basic'
import { exampleSetup } from 'prosemirror-example-setup'

import './index.css'
import './prosemirror-example-setup.css'
import './menu.css'

window.addEventListener(
  'message',
  (event: MessageEvent<any>) => {
    console.log('index.ts >>', event.data)
    if (
      typeof event.data !== 'object' ||
      !('source' in event.data) ||
      event.data.source !== 'pm-dev-tools'
    ) {
      return
    }
  },
  true
)

new EditorView(document.querySelector('#editor') as HTMLElement, {
  state: EditorState.create({
    schema,
    plugins: exampleSetup({ schema })
  })
})
