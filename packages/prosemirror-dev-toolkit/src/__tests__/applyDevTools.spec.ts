/**
 * @jest-environment jsdom
 */

import { render, fireEvent } from '@testing-library/svelte'
import { EditorView } from 'prosemirror-view'
import { beforeAll, describe, expect, it, vi } from 'vitest'

import { applyDevTools, removeDevTools } from '../applyDevTools'
import { setupEditor } from '$test-utils/setupEditor'
import { filterPlugin } from '$test-utils/filterPlugin'

let view: EditorView

describe('applyDevTools', () => {
  beforeAll(() => {
    const el = document.createElement('div')
    document.body.appendChild(el)
    el.id = 'pm-editor'
    view = setupEditor(el)

    vi.stubGlobal('prompt', (str: string) => undefined)
  })

  it('should mount and unmount dev-toolkit', () => {
    applyDevTools(view)
    expect(document.body).toMatchSnapshot()
    removeDevTools()
    expect(document.body).toMatchSnapshot()
  })

  it('should not crash when transactions are prevented by filterTransaction', () => {
    const logSpy = vi.spyOn(console, 'log')
    const infoSpy = vi.spyOn(console, 'info')
    const warnSpy = vi.spyOn(console, 'warn')
    const errorSpy = vi.spyOn(console, 'error')

    applyDevTools(view)
    view.dispatch(view.state.tr.insert(1, view.state.schema.text('hello')))
    view.updateState(
      view.state.reconfigure({
        plugins: [filterPlugin()]
      })
    )
    view.dispatch(view.state.tr.insert(6, view.state.schema.text(' world')))
    expect(logSpy).toHaveBeenCalledTimes(0)
    expect(infoSpy).toHaveBeenCalledTimes(0)
    expect(warnSpy).toHaveBeenCalledTimes(0)
    expect(errorSpy).toHaveBeenCalledTimes(0)
    expect(view.state.toJSON()).toEqual({
      doc: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'hello'
              }
            ]
          }
        ]
      },
      selection: {
        anchor: 6,
        head: 6,
        type: 'text'
      }
    })
    expect(document.body).toMatchSnapshot()
  })
})
