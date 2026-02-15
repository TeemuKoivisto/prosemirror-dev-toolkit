import { type DirectEditorProps, EditorView } from 'prosemirror-view'
import { exampleSetup } from 'prosemirror-example-setup'
import { beforeAll, describe, expect, it, type MockInstance, vi } from 'vitest'

import { applyDevTools, removeDevTools } from '../applyDevTools'
import { setupEditor } from '../test-utils/setupEditor'
import { EditorState, Transaction } from 'prosemirror-state'
import { schema } from '../test-utils/schema'

interface Spies {
  log: MockInstance
  info: MockInstance
  warn: MockInstance
  error: MockInstance
}

let spies: Spies

class CustomEditorView extends EditorView {
  // @ts-ignore
  props: DirectEditorProps
  constructor(place: HTMLElement, props: DirectEditorProps) {
    super(place, props)
  }
}

describe('edge cases', () => {
  let editor: EditorView
  const div = document.createElement('div')
  div.id = 'pm-editor'
  document.body.appendChild(div)

  beforeAll(() => {
    spies = {
      log: vi.spyOn(console, 'log'),
      info: vi.spyOn(console, 'info'),
      warn: vi.spyOn(console, 'warn'),
      error: vi.spyOn(console, 'error')
    }
  })

  afterEach(() => {
    if (editor) {
      editor.destroy()
    }
    vi.restoreAllMocks()
  })

  it('should not crash if somebody is using weird CustomEditorView hack which overrides props', () => {
    editor = new CustomEditorView(div, {
      state: EditorState.create({
        schema,
        plugins: exampleSetup({ schema })
      }),
      dispatchTransaction(tr: Transaction) {
        editor.updateState(editor.state.apply(tr))
      }
    })

    vi.stubGlobal('prompt', (str: string) => undefined)

    applyDevTools(editor, { disableWebComponent: true })
    editor.dispatch(editor.state.tr.insert(1, editor.state.schema.text('hello')))
    expect(spies.log).toHaveBeenCalledTimes(0)
    expect(spies.info).toHaveBeenCalledTimes(0)
    expect(spies.warn).toHaveBeenCalledTimes(0)
    expect(spies.error).toHaveBeenCalledTimes(0)
  })

  it('should not run applyDevTools on already destroyed EditorView', () => {
    editor = setupEditor(div)

    applyDevTools(editor, { disableWebComponent: true })
    editor.dispatch(editor.state.tr.insert(1, editor.state.schema.text('hello')))

    editor.destroy()
    applyDevTools(editor, { disableWebComponent: true })

    expect(spies.log).toHaveBeenCalledTimes(0)
    expect(spies.info).toHaveBeenCalledTimes(0)
    expect(spies.warn).toHaveBeenCalledTimes(0)
    expect(spies.error).toHaveBeenCalledTimes(0)
  })
})
