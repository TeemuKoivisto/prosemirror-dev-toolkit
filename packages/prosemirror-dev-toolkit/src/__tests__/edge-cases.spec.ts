/**
 * @jest-environment jsdom
 */

import { DirectEditorProps, EditorView } from 'prosemirror-view'
import { exampleSetup } from 'prosemirror-example-setup'
import { beforeAll, describe, expect, it, SpyInstance, vi } from 'vitest'

import { applyDevTools, removeDevTools } from '../applyDevTools'
import { setupEditor } from '../test-utils/setupEditor'
import { EditorState, Transaction } from 'prosemirror-state'
import { schema } from '../test-utils/schema'

let view: EditorView

interface Spies {
  log: SpyInstance
  info: SpyInstance
  warn: SpyInstance
  error: SpyInstance
}

let spies: Spies

class CustomEditorView extends EditorView {
  // @ts-ignore
  props: DirectEditorProps
  constructor(place: HTMLElement, props: DirectEditorProps) {
    super(place, props)
  }
}

describe('various-bug.spec', () => {
  beforeAll(() => {
    spies = {
      log: vi.spyOn(console, 'log'),
      info: vi.spyOn(console, 'info'),
      warn: vi.spyOn(console, 'warn'),
      error: vi.spyOn(console, 'error')
    }
  })

  it('should not crash if somebody is using weird CustomEditorView hack which overrides props', () => {
    const el = document.createElement('div')
    document.body.appendChild(el)
    el.id = 'pm-editor'
    view = new CustomEditorView(el, {
      state: EditorState.create({
        schema,
        plugins: exampleSetup({ schema })
      }),
      dispatchTransaction(tr: Transaction) {
        view.updateState(view.state.apply(tr))
      }
    })

    vi.stubGlobal('prompt', (str: string) => undefined)

    applyDevTools(view)
    view.dispatch(view.state.tr.insert(1, view.state.schema.text('hello')))
    expect(spies.log).toHaveBeenCalledTimes(0)
    expect(spies.info).toHaveBeenCalledTimes(0)
    expect(spies.warn).toHaveBeenCalledTimes(0)
    expect(spies.error).toHaveBeenCalledTimes(0)
  })

  it('should not run applyDevTools on already destroyed EditorView', () => {
    const el = document.createElement('div')
    document.body.appendChild(el)
    el.id = 'pm-editor'
    view = setupEditor(el)

    applyDevTools(view)
    view.dispatch(view.state.tr.insert(1, view.state.schema.text('hello')))

    view.destroy()
    applyDevTools(view)

    expect(spies.log).toHaveBeenCalledTimes(0)
    expect(spies.info).toHaveBeenCalledTimes(0)
    expect(spies.warn).toHaveBeenCalledTimes(0)
    expect(spies.error).toHaveBeenCalledTimes(0)
  })
})
